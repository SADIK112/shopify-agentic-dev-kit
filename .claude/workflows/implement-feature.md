# Workflow — Implement a Specced Feature

Use this when `feature-specs/<feature>/SPEC.md` is already written and signed
off. This workflow picks up from there and drives to a shippable implementation.

## Before starting

Read in this order — load *only* these files, nothing else yet:

1. `feature-specs/<feature>/SPEC.md` — goal, actors, workflows, acceptance criteria
2. `feature-specs/<feature>/RULES.md` — domain, skills, data ownership, out of scope
3. `feature-specs/<feature>/TODO.md` — current status; pick up from the first
   unchecked item
4. `app/domains/<domain>/AGENTS.md` — local domain rules (if the domain exists)

If any of these is missing or incomplete, stop and run `/create-feature` first.

## Implementation order

Work through the `TODO.md` checklist in sequence. Mark each item done in
`TODO.md` as soon as it is complete — this is the agent's progress log.

### A. Domain scaffold (if new domain)

```
app/domains/<domain>/
  AGENTS.md            ← fill from .claude/templates/domain/AGENTS.md
  schemas/             ← Zod schemas (see .claude/templates/schema.ts.tmpl)
  repositories/        ← one per aggregate (/create-repository)
  services/            ← one per use-case group (/create-service)
  graphql/             ← Admin API ops (shopify-admin skill)
  components/          ← Polaris page components
  tests/               ← unit + integration tests
```

### B. For each Shopify surface in RULES.md

1. Open `.shopify/skills/registry.json`; find the skill for this surface.
2. Read the matching `guardrails/<skill>.md`.
3. Invoke the skill. Verify every field/component against its schema.
4. Place GraphQL ops under `graphql/`; regenerate types: `npm run graphql:codegen`.
5. Run `validate` before moving on.
6. **Update `REVERT.md`** — record any Shopify resources the app creates
   (discounts, webhook subscriptions, metafield definitions, Function extensions).

### C. Data layer (repositories + schema migrations)

- Run `/create-repository` for each new aggregate.
- Run `migrate-schema` workflow for any new/changed Prisma models.
- **Update `REVERT.md`** — add a row for each migration run.
- Integration test each repository before building the service layer.

### D. Business logic (services)

- Run `/create-service` for each use-case in SPEC.md.
- Unit tests with fake repositories — no DB, no network.
- Implement every validation rule and edge case listed in SPEC.md.

### E. Presentation (routes + UI)

- Run `/add-route` for each route the feature needs.
- Run `add-ui-extension` workflow for any extension surfaces.
- Keep routes thin; keep page components thin.

### F. Close the loop

```bash
npm run check            # architecture + typecheck + lint
npm test                 # all unit + integration tests
```

Then run `/review` — full checklist. Fix all findings before marking the
feature done.

Update `feature-specs/<feature>/TODO.md` (check off remaining items) and
`NOTES.md` (record any surprises, tradeoffs, or deferred items).

## Token discipline

At each step: load only the domain folder for that step + the one skill it
needs. Don't pre-load the entire codebase. The `SPEC.md` and local `AGENTS.md`
are your primary anchors.
