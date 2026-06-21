# TODO — Order Note Templates

**Status:** draft
<!-- Update status as the feature moves through the lifecycle. -->

## Spec phase

- [ ] SPEC.md complete (goal, actors, workflows, validation, edge cases, criteria)
- [ ] RULES.md complete (domain, skills, data ownership, out of scope)
- [ ] Human sign-off on SPEC.md before implementation starts

## Implementation phase

- [ ] Domain scaffolded (`app/domains/notes/`)
- [ ] Zod schemas in `schemas/` (`NoteTemplate`, `NoteTemplateCreate`, `ApplyInput`)
- [ ] Repositories + integration tests (`NoteTemplateRepository`, `ApplyLogRepository`)
- [ ] GraphQL ops + codegen (`npm run graphql:codegen`) + validate (order query + `orderUpdate` mutation)
- [ ] Services + unit tests (`noteTemplate.service.ts` — create, list, delete, applyToOrder)
- [ ] Routes + Polaris UI (`/add-route`) — templates list/new/edit + apply page
- [ ] Prisma migration — `migrate-schema` workflow

## Verification phase

- [ ] e2e tests covering every acceptance criterion (`run-e2e` workflow)
- [ ] `npm run check` passes (architecture + typecheck + lint)
- [ ] `/review` passed
- [ ] NOTES.md updated with learnings and deferred items
