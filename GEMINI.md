# Shopify AI OS — Gemini Code Assist

## Load first

Read `.ai/AGENTS.md` before any task. All operating rules are there —
anti-hallucination, architecture boundaries, TypeScript discipline, Prisma,
GraphQL, webhooks, security, and the 6-step task loop. Every rule is binding.

## Load on demand (only what the task needs)

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
| Shared infrastructure templates | `.ai/templates/shared/` |

Never pre-load the whole repository. Token cost is proportional to context loaded.

## Workflows

For each type of task, load the matching file before starting:

### Build tasks

| Goal | File |
|---|---|
| Start a new feature | `.ai/commands/create-feature.md` |
| Add Prisma access for an aggregate | `.ai/commands/create-repository.md` |
| Add an application-layer use-case | `.ai/commands/create-service.md` |
| Add a Remix route + Polaris page | `.ai/commands/add-route.md` |
| Diagnose a failure | `.ai/commands/debug.md` |
| Pre-ship code review | `.ai/commands/review.md` |
| Refactor without behavior change | `.ai/commands/refactor.md` |

### Progress tracking

| Goal | File |
|---|---|
| See feature status | `.ai/commands/status.md` |
| End-of-session checkpoint | `.ai/commands/checkpoint.md` |

### Multi-step workflow chains

| Goal | File |
|---|---|
| Build a feature end to end | `.ai/workflows/build-feature-end-to-end.md` |
| Pick up a specced feature | `.ai/workflows/implement-feature.md` |
| Add a Shopify Function | `.ai/workflows/add-shopify-function.md` |
| Add a webhook handler | `.ai/workflows/add-webhook.md` |
| Add a UI extension | `.ai/workflows/add-ui-extension.md` |
| Migrate the Prisma schema | `.ai/workflows/migrate-schema.md` |
| Fix a known bug | `.ai/workflows/fix-bug.md` |
| Write and run e2e tests | `.ai/workflows/run-e2e.md` |
| Roll back or undo a feature | `.ai/workflows/rollback-feature.md` |

## Shopify surfaces

This platform does not support `npx skill install`. When a task touches any
Shopify API surface, use this procedure instead of skill invocation:

1. Open `.shopify/skills/registry.json`. Find the surface → skill name mapping.
2. Read `.shopify/skills/guardrails/<skill>.md` for this repo's Shopify rules.
3. For any field or mutation you cannot confirm from the guardrail, check
   `shopify.dev` before writing code. Never assume a field exists.
4. Flag anything unconfirmed as `UNVERIFIED: <field>` and stop — do not ship it.
5. Every mutation path must handle `userErrors`. Never assume success.
6. All Shopify IDs are GIDs: `gid://shopify/<Type>/<id>`. Never bare numbers.

See `.shopify/skills/guardrails/README.md` for the full surface → file map.

## Validation

Always run before declaring any task done:

```bash
npm run check   # architecture guard + typecheck + lint
```

A task is not done until this passes.
