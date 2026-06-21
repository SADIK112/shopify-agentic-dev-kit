# Workflow — Build a feature end to end

Chains the commands into a full delivery loop. Use for any non-trivial feature.

1. `/create-feature <name>` — SPEC + domain scaffold + skill list. **Pause for
   sign-off on SPEC.md.**
2. For each data need: `/create-repository <domain>: <aggregate>` (+ int test).
3. For each Shopify read/write: invoke the mapped skill, add GraphQL ops under
   the domain's `graphql/`, regenerate types (`npm run graphql:codegen`),
   `validate`.
4. For each use-case: `/create-service <domain>: <use-case>` (+ unit test).
5. Presentation: add thin Remix route(s) and Polaris UI (app-home skill).
6. `tests/e2e/` — cover the feature's primary acceptance criteria.
7. `/review` — full checklist. Fix findings.
8. Update `feature-specs/<name>/TODO.md` (done) and `NOTES.md` (learnings).

Token discipline: at each step load only that step's domain folder + the one
skill it needs. Don't pre-load the whole repo.
