# /create-service — add a service (application/business logic)

> **Always-on rules** (from `.ai/AGENTS.md`): search before writing · reuse
> existing patterns · no duplication · skill-gate every Shopify surface · routes
> thin · Prisma only in repositories · GraphQL-first · validate before done.

**Input:** domain + use-case (e.g. `orders: syncOrders`).

## Steps
1. **Search** `app/domains/<domain>/services/` for an existing service that
   should own this use-case. Prefer adding a method to a cohesive service over
   creating a near-duplicate file.
2. **Create/extend** `app/domains/<domain>/services/<concern>.service.ts` from
   `.claude/templates/service.ts.tmpl`.
3. **Dependencies via params, not imports of infra.** The service receives its
   repository and any GraphQL client through its arguments/constructor so it
   stays unit-testable. No `@prisma/client`, no `@remix-run/*`.
4. **Validate inputs** at the service boundary with the domain's Zod schema.
5. **Business rules live here** — invariants, policy, orchestration across
   repository + GraphQL ops. Surface `userErrors`/domain errors as typed results.
6. **Unit test** alongside: `services/<concern>.service.test.ts` with a fake
   repository. No DB, no network.

## Done when
Service compiles under strict TS, has a passing unit test with a fake
repository, and imports no route/Prisma/Remix infra.
