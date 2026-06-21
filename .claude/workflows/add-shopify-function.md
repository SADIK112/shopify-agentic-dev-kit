# Workflow — Add a Shopify Function

1. Invoke the `shopify-functions` skill; confirm the Function API + target.
2. `shopify app generate extension` for the correct Function type.
3. `extensions/<name>/input.graphql` — validate against the **Function** schema
   (not Admin). Request minimal input.
4. `src/` run logic: pure, deterministic, no network, no secrets.
5. Merchant configuration comes from metafields written by the owning app domain
   (e.g. `app/domains/discounts/`) — Function reads, never hardcodes.
6. `validate` the Function; deploy with `shopify app deploy`.
7. e2e/manual: verify behavior on a dev store with representative carts.
