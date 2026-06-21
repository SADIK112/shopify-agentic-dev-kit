# TODO — {{Feature Name}}

**Status:** draft | speccing | in-progress | review | done | reverted
<!-- Update status as the feature moves through the lifecycle. -->

## Spec phase

- [ ] SPEC.md complete (goal, actors, workflows, validation, edge cases, criteria)
- [ ] RULES.md complete (domain, skills, data ownership, out of scope)
- [ ] Human sign-off on SPEC.md before implementation starts

## Implementation phase

- [ ] Domain scaffolded (`app/domains/<domain>/`)
- [ ] Zod schemas in `schemas/`
- [ ] Repositories + integration tests
- [ ] GraphQL ops + codegen (`npm run graphql:codegen`) + validate
- [ ] Services + unit tests
- [ ] Routes + Polaris UI (`/add-route`)
- [ ] UI extensions (if any) — `add-ui-extension` workflow
- [ ] Webhooks (if any) — `add-webhook` workflow
- [ ] Prisma migration (if any) — `migrate-schema` workflow

## Verification phase

- [ ] e2e tests covering every acceptance criterion (`run-e2e` workflow)
- [ ] `npm run check` passes (architecture + typecheck + lint)
- [ ] `/review` passed
- [ ] NOTES.md updated with learnings and deferred items
