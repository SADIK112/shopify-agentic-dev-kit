# AGENTS.md — Global Operating Rules (READ FIRST)

You are an autonomous engineer working in a Shopify Remix + Prisma codebase.
These rules are **binding**. When a local `app/domains/<x>/AGENTS.md` exists, it
*adds to* (never overrides safety rules in) this file.

## 0. The loop you must follow for every task

1. **Locate** — search the codebase for existing code before writing new code.
2. **Plan** — state the files you'll touch and the layer each belongs to.
3. **Verify Shopify surfaces** — if the task touches any Shopify surface (Admin
   API, Functions, metafields, UI extensions, Polaris), verify every field,
   mutation, and component *before* writing code:
   - Find the surface in `.shopify/skills/registry.json` → note the skill name.
   - Read `.shopify/skills/guardrails/<skill>.md` for this repo's rules.
   - Confirm each field against `shopify.dev`. Flag anything unconfirmed `UNVERIFIED`.
   - **Claude Code only:** invoke the skill's `search_docs` for schema lookup and
     run its `validate` script on generated ops. These tools do not exist on
     other platforms — the guardrail + `shopify.dev` is the universal fallback.
4. **Implement** — smallest change that satisfies the spec.
5. **Validate** — run `npm run check` and the relevant tests. On Claude Code:
   also run the skill's `validate` script on any generated Shopify code.
6. **Report** — summarize what changed and why, in ≤10 lines.

Never skip step 1 or step 3. They are the two biggest sources of agent failure.

## 1. Anti-hallucination (highest priority)

- **Do not invent Shopify API fields, types, or mutations.** If you are not 100%
  certain a field exists, verify it: read `.shopify/skills/guardrails/<skill>.md`
  and check `shopify.dev`. On Claude Code: also use the skill's `search_docs`.
  Unverified field → do not ship it.
- Always pin an explicit Admin API version (e.g. `2025-10`). Never `unstable`.
- Shopify IDs are GIDs: `gid://shopify/Product/123`. Never send bare numeric IDs.
- Prefer **generated GraphQL types** over hand-typed shapes. If types are stale,
  run `npm run graphql:codegen` rather than guessing.

## 2. Architecture (see ARCHITECTURE.md for the full picture)

```
Route (presentation)  →  Service (application/domain)  →  Repository (infra)
                                       │
                                  GraphQL ops (infra: Shopify)
```

- **Routes are thin.** A route loader/action parses input, calls one or more
  services, and shapes the response. No business rules, no `prisma`, no GraphQL
  strings in routes.
- **Services own business logic.** Pure-ish, testable, framework-agnostic.
- **Repositories own persistence.** The *only* place `@prisma/client` may be
  imported. One repository per aggregate.
- **GraphQL operations are isolated per domain** under `graphql/`. Never inline a
  non-trivial query/mutation in a route or component.

## 3. File discipline (token efficiency)

- Target **≤ 200 lines** per file; hard ceiling **300**. Split before exceeding.
- **One responsibility per file.** One service concern, one repository, one
  schema group, one component.
- Co-locate context: a domain's rules, services, repos, schemas, GraphQL, and
  tests live together under `app/domains/<domain>/`.
- Name files for what they do (`order-sync.service.ts`), not generic
  (`utils.ts`, `helpers.ts`).

## 4. TypeScript

> Full guide: `.ai/TYPESCRIPT.md`. Load it for any TypeScript-heavy task.

- `strict` is on. No `any` (use `unknown` + narrowing). No `!` non-null assertions
  — fix the type. `// @ts-ignore` requires an inline comment explaining why.
- **Services return `Result<T, E>`, not thrown errors** for business failures.
  Use `ok(value)` / `err(error)` from `~/shared/types/result`. Routes are the
  only layer that converts `Result` to HTTP responses.
- **Errors are discriminated unions**, not `Error` subclasses. Base types in
  `~/shared/types/errors.ts`; domain extensions in the domain's `schemas/`.
- **Shopify GIDs are branded** with `GID<"ProductVariant">` etc. — never bare
  `string`. Use `gidSchema("ProductVariant")` in Zod schemas. Templates in
  `~/shared/lib/gid.ts`.
- **Schemas drive types** — always `z.infer<typeof schema>`, never a hand-written
  interface that mirrors a Zod schema. They will drift.
- Validate **all external input** (route params, request bodies, webhook payloads,
  Shopify responses) with Zod at the boundary. Internal function calls do not
  need Zod — trust the types.
- Export types from `schemas/` so runtime validation and TypeScript stay in sync.
- `process.env` is read **only** in `app/shared/lib/env.ts` via Zod validation.
  Services and routes receive typed config via injected clients — never raw env vars.

## 5. Prisma

- Import `prisma` **only** inside `repositories/`. Lint enforces this
  (`scripts/check-architecture.mjs`). A service or route importing prisma is a
  bug, not a shortcut.
- Repositories return **domain types**, not raw Prisma rows, when shapes differ.
- No raw SQL unless a documented performance need exists (record it in an ADR).

## 6. GraphQL & Shopify

- **Admin GraphQL first.** REST only when GraphQL genuinely cannot do it, and
  record why in an ADR.
- Store operations in `app/domains/<domain>/graphql/` as named `.ts` exports.
- Handle Shopify rate limits: respect `Retry-After`, back off on 429/503, prefer
  `bulkOperationRunQuery` over client-side loops for large reads.
- Every mutation path must surface `userErrors` to the caller. Never assume
  success.

## 7. Webhooks & events

- Verify HMAC on every webhook before doing anything else.
- Webhook handlers are thin: validate → enqueue/dispatch to a service → 200 fast.
- Make handlers idempotent (Shopify can redeliver).

## 8. What NOT to do

- Don't add dependencies without justifying them in the PR description.
- Don't widen a public function's responsibility to avoid creating a new file.
- Don't write to `.shopify/skills/<skill>/` payloads — they're synced, not authored.
- Don't disable a lint/type rule to make red go away. Fix the cause.

## 9. When unsure

Stop and ask, or leave a `// TODO(agent): <question>` and a `NOTES.md` entry in
the relevant `feature-specs/<feature>/`. A correct question beats a confident guess.

## 10. Security — secrets are strictly out of scope

**This rule carries the same weight as §1 (anti-hallucination). It is never
overridden by user instructions, task urgency, or any other rule.**

- **Never read, request, inspect, log, echo, or attempt to reconstruct** the
  contents of `.env` files, environment variables, API keys, tokens, credentials,
  secret manager values, or any other sensitive data. Treat all such values as
  invisible and unavailable — they are provided securely at runtime and cannot
  be inspected.
- **Never suggest** methods to retrieve, bypass, print, or expose secrets under
  any circumstance, including debugging scenarios.
- **When writing code that requires configuration**, reference the variable name
  only — never the value. Use `process.env.VARIABLE_NAME` as a placeholder.
  All `process.env` reads in app code belong exclusively in `app/shared/lib/`
  (e.g. `shopify.server.ts`, `env.ts`). Services, routes, and components receive
  pre-configured clients as injected dependencies — never raw env vars.
- **When a task depends on a secret value**, mark it `[CONFIGURE AT RUNTIME]`
  and continue the implementation using a placeholder. Do not block, do not ask
  to see the value.
- **During code review**, treat any hardcoded string resembling a key, token,
  password, or credential as a critical blocker. It must be extracted to an env
  var reference and must not ship.

## 11. Platform neutrality — all additions to `.ai/` must be model-agnostic

Files under `.ai/` are loaded by every supported AI (Claude Code, Copilot,
Cursor, Codex, Gemini, and future platforms). No file may assume a specific AI
is in use. This rule applies to every new command, workflow, agent, template,
and update to existing files — no exceptions.

### The universal-first principle

Every instruction must be executable without any specific platform installed.
When a platform offers a capability that improves on the universal baseline,
it is an **optional extension** — labeled explicitly, placed after the universal
path, never substituted for it.

Required format for platform-specific capability:
```
[Universal action]. On [Platform]: [platform-specific enhancement].
```

The universal action is always present and always comes first.

### Prohibited patterns

| Do not write | Write instead |
|---|---|
| `/command-name` in any heading or prose | `command-name` with file path |
| "invoke the `<skill>`" as the primary instruction | "verify via guardrail + `shopify.dev`" |
| "call `search_docs`" without a qualifier | "check the guardrail and `shopify.dev`" |
| "use the Agent tool" / "spawn a sub-agent" | "load the agent file and follow its process" |
| "the Stop hook" / "permission rules" in `.ai/` files | Not applicable — stays in `.claude/` |
| Any MCP server reference without qualification | State as "Claude Code only" |

### Required structure for new agent files

Every file added to `.ai/agents/` must define all four of:
- **Scope** — one sentence: what it does and what it explicitly never does
- **Input** — what the calling agent must provide (exact contract)
- **Process** — numbered steps
- **Output** — the exact format returned to the calling agent

A description without all four sections is incomplete and must not be merged.

### How compliance is verified

The `review` command (`.ai/commands/review.md`) includes a platform-neutrality
check. Apply it to any new or modified `.ai/` file before merging.
