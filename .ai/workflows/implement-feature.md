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

If any of these is missing or incomplete, stop and follow `create-feature` (`.ai/commands/create-feature.md`) first.

## Implementation order

Work through the `TODO.md` checklist in sequence. Mark each item done in
`TODO.md` as soon as it is complete — this is the agent's progress log.

### A. Domain scaffold (if new domain)

```
app/domains/<domain>/
  AGENTS.md            ← fill from .ai/templates/domain/AGENTS.md
  schemas/             ← Zod schemas (see .ai/templates/schema.ts.tmpl)
  repositories/        ← one per aggregate (create-repository command)
  services/            ← one per use-case group (create-service command)
  graphql/             ← Admin API ops (verified via guardrail or skill)
  components/          ← Polaris page components
  tests/               ← unit + integration tests
```

### B. For each Shopify surface in RULES.md

1. Open `.shopify/skills/registry.json`; find the skill for this surface.
2. Read the matching `guardrails/<skill>.md`.
3. Verify every field and component: read the guardrail + `shopify.dev`. On
   Claude Code: invoke the skill for schema lookup. Flag anything unconfirmed
   `UNVERIFIED` — do not proceed past this step with unverified fields.
4. Place GraphQL ops under `graphql/`; regenerate types: `npm run graphql:codegen`.
5. On Claude Code: run the skill's `validate` before moving on. All platforms:
   confirm all fields are verified and `npm run check` passes.
6. **Update `REVERT.md`** — record any Shopify resources the app creates
   (discounts, webhook subscriptions, metafield definitions, Function extensions).

### C. Data layer (repositories + schema migrations)

- Follow **`create-repository`** (`.ai/commands/create-repository.md`) for each aggregate.
- Follow **`migrate-schema`** (`.ai/workflows/migrate-schema.md`) for any new/changed Prisma models.
- **Update `REVERT.md`** — add a row for each migration run.
- Integration test each repository before building the service layer.

### D. Business logic (services)

- Follow **`create-service`** (`.ai/commands/create-service.md`) for each use-case in SPEC.md.
- Unit tests with fake repositories — no DB, no network.
- Implement every validation rule and edge case listed in SPEC.md.

### E. Presentation (routes + UI)

- Follow **`add-route`** (`.ai/commands/add-route.md`) for each route.
- Follow **`add-ui-extension`** (`.ai/workflows/add-ui-extension.md`) for extension surfaces.
- Keep routes thin; keep page components thin.

### F. Close the loop

```bash
npm run check            # architecture + typecheck + lint
npm test                 # all unit + integration tests
```

Then follow **`review`** (`.ai/commands/review.md`) — full checklist. Fix all findings before marking the feature done.

Update `feature-specs/<feature>/TODO.md` (check off remaining items) and
`NOTES.md` (record any surprises, tradeoffs, or deferred items).

## Token discipline

At each step: load only the domain folder for that step + the one guardrail
file it needs. Don't pre-load the entire codebase. The `SPEC.md` and local
`AGENTS.md` are your primary anchors.
