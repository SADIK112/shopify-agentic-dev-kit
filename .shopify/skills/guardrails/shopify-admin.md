# Guardrail — shopify-admin (Admin GraphQL)

> Layered on top of the official `shopify-admin` skill. The skill is the source
> of truth for the schema; this file is how *we* use it.

## Before writing any query/mutation
- Invoke the `shopify-admin` skill and confirm every field against the schema /
  `search_docs`. Unverified field → do not ship.
- Use API version from `registry.json` (`apiVersion`). Never `unstable`.

## Where ops live
- One file per operation group under `app/domains/<domain>/graphql/`.
- Named exports, tagged with the codegen `#graphql` literal so types generate.
- Never inline a non-trivial op in a route, loader, action, or component.

## Conventions
- IDs are GIDs (`gid://shopify/Product/123`). Helpers in `app/shared/lib/gid.ts`.
- Request only the fields you use (cost-based rate limiting punishes over-fetch).
- Large reads → `bulkOperationRunQuery`, not client loops.
- Every mutation result MUST destructure and handle `userErrors`. A non-empty
  `userErrors` is a failure the service must surface — never assume success.
- Wrap calls so 429/503 trigger backoff honoring `Retry-After`
  (`app/shared/lib/shopify-admin.ts`).

## Validate before done
Run the skill's `validate` on every generated `.graphql`/op file. Fix, don't
suppress.
