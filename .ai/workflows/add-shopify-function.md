# Workflow — Add a Shopify Function

1. Verify the Function API and target via `guardrails/shopify-functions.md` and
   `shopify.dev/apps/build/functions`. Confirm the exact Function type and target
   string before generating — these are routinely hallucinated. On Claude Code:
   invoke the `shopify-functions` skill for schema lookup.
2. `shopify app generate extension` for the correct Function type.
3. `extensions/<name>/input.graphql` — validate against the **Function** input
   schema (not Admin API). Request only the fields the logic needs.
4. `src/` run logic: pure, deterministic, no network, no secrets.
5. Merchant configuration comes from metafields written by the owning app domain
   (e.g. `app/domains/discounts/`) — Function reads, never hardcodes.
6. Run `shopify app build` to validate locally, then `shopify app deploy`.
7. e2e/manual: verify behavior on a dev store with representative carts.
