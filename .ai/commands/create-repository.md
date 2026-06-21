# create-repository — add a repository (Prisma access)

> **Always-on rules** (from `.ai/AGENTS.md`): search before writing · reuse
> existing patterns · no duplication · verify every Shopify surface · routes
> thin · Prisma only in repositories · GraphQL-first · validate before done.

**Input:** domain + aggregate (e.g. `orders: Order`).

## Steps
1. **Search** `app/domains/<domain>/repositories/` — one repository per
   aggregate; don't fragment access to the same aggregate across files.
2. **Create** `app/domains/<domain>/repositories/<aggregate>.repository.ts`
   from `.ai/templates/repository.ts.tmpl`.
3. **Only here** may `@prisma/client` be imported. Export a small, intention-
   revealing API (`findById`, `save`, `listByShop`, …) — not a raw Prisma proxy.
4. **Shop-scope** every query that isn't global; require `shop` as input.
5. **Return domain types** when they differ from Prisma rows; map at the edge.
6. **Integration test**: `repositories/<aggregate>.repository.test.ts` against a
   test database (see `tests/helpers/db.ts`).

## Done when
`scripts/check-architecture.mjs` passes (no prisma import outside repositories),
queries are shop-scoped, and the integration test passes.
