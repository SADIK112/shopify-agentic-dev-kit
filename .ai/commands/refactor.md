# refactor — improve structure without changing behavior

> **Always-on rules** (from `.ai/AGENTS.md`): search before writing · reuse
> existing patterns · no duplication · verify every Shopify surface · routes
> thin · Prisma only in repositories · GraphQL-first · validate before done.

## Rules
1. **Tests are the safety net.** Ensure the target code has tests *before*
   refactoring. If it doesn't, add characterization tests first.
2. **Behavior-preserving only.** No feature changes mixed into a refactor.
3. **Common triggers & moves:**
   - File >300 lines → split by responsibility.
   - Logic in a route → extract to a service.
   - Prisma outside a repository → move it into one.
   - Inline GraphQL → extract to `graphql/`.
   - Duplicated logic across domains → lift to `app/shared/` only if truly
     cross-domain; otherwise keep it local.
4. **Small commits.** One structural move per commit, tests green between each.
5. **Update context** (`AGENTS.md`, `GLOSSARY.md`) if names/locations change.

## Done when
Behavior is identical (tests prove it), `npm run check` passes, and the code is
smaller/clearer by a measurable count (lines, files, or import edges).
