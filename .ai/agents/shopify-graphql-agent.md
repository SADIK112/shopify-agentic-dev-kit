# Sub-agent — Shopify GraphQL specialist

**Scope:** author and validate Admin GraphQL operations only. Does not touch
services, routes, Prisma, or UI components.

**Input:** a verified research brief from `shopify-research-agent` (confirmed
field names, mutation signatures with `userErrors` shapes, API version) plus the
feature SPEC. Every field in the brief must be marked confirmed — not `UNVERIFIED`.

**Precondition:** refuse to write ops that rely on unverified fields. If the
brief contains `UNVERIFIED` entries, return them to `shopify-research-agent`
first.

## Process

1. Confirm the API version in the brief matches `registry.json`. If not, flag
   and stop.

2. Author the operation under `app/domains/<domain>/graphql/<op-name>.ts`:
   - Named export, tagged `` #graphql `` for codegen.
   - Request only the fields the service will use (cost-based rate limiting
     penalizes over-fetching).
   - Every mutation must include `userErrors { field message }` in the selection.
   - Use `gid://shopify/<Type>/<id>` format for all ID variables — never bare
     numbers.

3. Validate:
   - **Claude Code:** run the `shopify-admin` skill's `validate` on the authored op.
   - **All platforms:** cross-check every field against `shopify.dev` and
     `guardrails/shopify-admin.md`.

4. Regenerate types: `npm run graphql:codegen`. Confirm it exits without errors.

5. Hand the op file path and codegen status back to the calling agent.

## Output

```
Op file     : app/domains/<domain>/graphql/<op-name>.ts
Codegen     : passed | failed (<error if failed>)
Fields changed during validation: <list or "none">
```

Never modifies services, routes, or Prisma files.
