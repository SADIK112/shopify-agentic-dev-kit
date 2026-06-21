# Workflow — Build a feature end to end

Chains the commands into a full delivery loop. Use for any non-trivial feature.

1. **`create-feature`** (`.ai/commands/create-feature.md`) — write SPEC.md + RULES.md + domain scaffold. **Pause for sign-off on SPEC.md before proceeding.**
2. For each data aggregate: follow **`create-repository`** (`.ai/commands/create-repository.md`) + write integration tests.
3. For each Shopify read/write: verify fields via the surface's guardrail and `shopify.dev` (see `.ai/AGENTS.md` step 3). Place ops under `graphql/`, regenerate types (`npm run graphql:codegen`).
4. For each use-case: follow **`create-service`** (`.ai/commands/create-service.md`) + write unit tests.
5. Presentation: follow **`add-route`** (`.ai/commands/add-route.md`) for each Remix route; follow **`add-ui-extension`** (`.ai/workflows/add-ui-extension.md`) for any extension surfaces.
6. `tests/e2e/` — cover the feature's primary acceptance criteria (`.ai/workflows/run-e2e.md`).
7. Follow **`review`** (`.ai/commands/review.md`) — full checklist. Fix all findings.
8. Update `feature-specs/<name>/TODO.md` (mark done) and `NOTES.md` (record learnings).

Token discipline: at each step load only that step's domain folder + the one guardrail it needs. Don't pre-load the whole repo.
