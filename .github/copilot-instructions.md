# Copilot Instructions — Shopify AI OS

## Read this first

Load `.ai/AGENTS.md` before any task. All operating rules are there —
architecture boundaries, TypeScript patterns, Shopify constraints, and the
6-step task loop. Every rule in that file is binding.

## Load context lazily

Only pull in what the task needs:

| Need | Load |
|---|---|
| Layer rules, import constraints | `.ai/ARCHITECTURE.md` |
| Shopify integration model | `.ai/PROJECT.md` |
| TypeScript patterns (Result, GIDs, Zod, errors) | `.ai/TYPESCRIPT.md` |
| Shopify surface routing | `.shopify/skills/registry.json` |
| Shopify rules for a specific surface | `.shopify/skills/guardrails/<skill>.md` |
| Feature intent and constraints | `feature-specs/<feature>/SPEC.md` |
| Workflow steps | `.ai/commands/<task>.md` |

## Workflow menu

For each type of task, read the file before starting:

| Task | File |
|---|---|
| New feature | `.ai/commands/create-feature.md` |
| New repository | `.ai/commands/create-repository.md` |
| New service | `.ai/commands/create-service.md` |
| New route | `.ai/commands/add-route.md` |
| Debug | `.ai/commands/debug.md` |
| Pre-ship review | `.ai/commands/review.md` |
| Refactor | `.ai/commands/refactor.md` |
| Feature status | `.ai/commands/status.md` |
| Session checkpoint | `.ai/commands/checkpoint.md` |

For multi-step tasks, see `README.md → Workflow chains` for the full list of
workflow chain files under `.ai/workflows/`.

## Shopify surfaces

`npx skill install` is not available here. When touching any Shopify API surface:

1. Check `.shopify/skills/registry.json` to identify the relevant skill.
2. Read `.shopify/skills/guardrails/<skill>.md` as authoritative Shopify context.
3. Verify unknown fields or mutations against `shopify.dev` before using them.
4. Never ship an unverified field — mark it `UNVERIFIED` and stop.
5. Handle `userErrors` on every mutation — never assume success.

See `.shopify/skills/guardrails/README.md` for the surface → guardrail file map.

## Validation

Run before declaring done:

```bash
npm run check
```
