# AGENTS.md — Shopify AI OS

> **OpenAI Codex / Operator entry point.** The operating rules, architecture
> constraints, TypeScript patterns, and 6-step task loop live in
> `.ai/AGENTS.md`. Read it before doing anything else.

## Operating rules

Load `.ai/AGENTS.md` first. Every rule there is binding — anti-hallucination,
layer architecture, TypeScript discipline, Prisma, GraphQL, webhooks, and
security. Local `app/domains/<x>/AGENTS.md` files extend it for a specific domain.

## Context loading strategy

Pull in only what the task needs. Never load the full repository.

| When you need | Load |
|---|---|
| Layer rules, import constraints | `.ai/ARCHITECTURE.md` |
| Shopify integration model, auth, data ownership | `.ai/PROJECT.md` |
| TypeScript patterns (Result, GIDs, errors, Zod) | `.ai/TYPESCRIPT.md` |
| Term definitions | `.ai/GLOSSARY.md` |
| Engineering decision rationale | `.ai/DECISIONS.md` + `docs/adr/` |
| Feature intent, constraints, open questions | `feature-specs/<feature>/` (all 6 files) |
| Shopify surface → skill mapping | `.shopify/skills/registry.json` |
| Shopify-specific rules | `.shopify/skills/guardrails/<skill>.md` |
| Workflow steps for a task | `.ai/commands/<cmd>.md` |
| Shared templates | `.ai/templates/shared/` |

## Workflow menu

When the user asks you to perform one of these tasks, read the corresponding
file before starting work:

### Build tasks

| Task | File |
|---|---|
| Start a new feature | `.ai/commands/create-feature.md` |
| Add Prisma access for an aggregate | `.ai/commands/create-repository.md` |
| Add an application-layer use-case | `.ai/commands/create-service.md` |
| Add a Remix route + Polaris page | `.ai/commands/add-route.md` |
| Diagnose a failure | `.ai/commands/debug.md` |
| Pre-ship code review | `.ai/commands/review.md` |
| Refactor without behavior change | `.ai/commands/refactor.md` |

### Progress tracking

| Task | File |
|---|---|
| Check feature progress | `.ai/commands/status.md` |
| End-of-session checkpoint | `.ai/commands/checkpoint.md` |

### Multi-step workflow chains

For complex, multi-phase tasks, load the full workflow chain:

| Goal | File |
|---|---|
| Build a feature end to end | `.ai/workflows/build-feature-end-to-end.md` |
| Pick up and implement a specced feature | `.ai/workflows/implement-feature.md` |
| Add a Shopify Function | `.ai/workflows/add-shopify-function.md` |
| Add a webhook handler | `.ai/workflows/add-webhook.md` |
| Add a UI extension | `.ai/workflows/add-ui-extension.md` |
| Migrate the Prisma schema | `.ai/workflows/migrate-schema.md` |
| Fix a known bug | `.ai/workflows/fix-bug.md` |
| Write and run e2e tests | `.ai/workflows/run-e2e.md` |
| Roll back or undo a feature | `.ai/workflows/rollback-feature.md` |

## Shopify surfaces

This platform does not support `npx skill install`. When a task touches any
Shopify API surface, follow this procedure instead of skill invocation:

1. Open `.shopify/skills/registry.json`. Find the surface → skill name mapping.
2. Read `.shopify/skills/guardrails/<skill>.md` for this repo's Shopify rules.
3. For any field or mutation you cannot confirm from the guardrail, check
   `shopify.dev` before writing code.
4. Never ship an unverified field — flag it `UNVERIFIED: <field>` and stop.
5. Every mutation brief must include how `userErrors` is handled.
6. All Shopify IDs are GIDs: `gid://shopify/<Type>/<id>`. Never bare numbers.

See `.shopify/skills/guardrails/README.md` for the full surface → file map.

## Validation

Always run before declaring any task done:

```bash
npm run check   # architecture guard + typecheck + lint
```

A task is not done until this passes.
