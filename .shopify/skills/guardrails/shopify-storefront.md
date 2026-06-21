# Guardrail — shopify-storefront-graphql

> Only applies if this app has a headless storefront component. Most embedded
> Shopify apps do NOT use the Storefront API — if you are unsure whether this
> applies, check `.ai/PROJECT.md` and the feature spec before proceeding.

## When this skill is relevant

- Building a headless storefront that reads product/collection/cart data.
- Implementing buyer identity, cart mutations, or customer account flows
  outside of Shopify's hosted checkout.
- NOT relevant for the embedded admin app (use `shopify-admin` instead).

## Before writing any query or mutation

- Invoke the `shopify-storefront-graphql` skill. Confirm every field against
  the Storefront API schema — it is a different schema from the Admin API.
- Use the API version from `registry.json` (`apiVersion`). Never `unstable`.
- Storefront API requires a **public access token** (not the admin API token).
  The token must be scoped appropriately and is safe to expose client-side.

## Where ops live

- Storefront operations go under a dedicated domain (e.g.
  `app/domains/storefront/graphql/`), never in the same domain folder as
  Admin API operations.
- Label files clearly: `product-storefront.ts` vs `product-admin.ts`.

## Conventions

- The Storefront API uses a different ID format for some types. Never mix
  Admin GIDs with Storefront node IDs.
- Cart mutations are idempotent by design — leverage `cartLinesUpdate` over
  delete + add pairs.
- Use `@inContext` directive for market-aware pricing and localization.

## Validate before done

Run the skill's `validate` on every Storefront op file before declaring the
work done.
