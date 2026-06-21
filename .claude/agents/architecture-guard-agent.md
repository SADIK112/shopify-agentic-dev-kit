# Sub-agent — Architecture guard

**Scope:** enforce layering. Runs `scripts/check-architecture.mjs` and reviews
imports. Flags: Prisma outside repositories, GraphQL strings in routes, business
logic in routes, files >300 lines, `any`/`!` silencing. Output: a punch list of
file:line violations with the correct layer to move code to. **Never** writes
feature code.
