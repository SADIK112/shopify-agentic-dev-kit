# GLOSSARY.md — Shared Vocabulary

Use these terms consistently in code, comments, and commits so the agent and
humans mean the same thing.

## Architecture terms

- **Domain** — a bounded slice of the app under `app/domains/<name>/` owning its
  services, repositories, schemas, GraphQL, components, and tests.
- **Service** — application-layer use-case orchestrator. Contains business logic.
- **Repository** — the only Prisma access point for an aggregate.
- **GraphQL op** — a named, typed Admin API query/mutation under a domain's
  `graphql/` folder.
- **Schema** — a Zod schema validating input/output at a boundary. The inferred
  type is the canonical TS type.
- **Aggregate** — a cluster of data treated as one consistency unit (e.g. a
  Bundle and its components).

## Shopify terms

- **GID** — Shopify global ID, `gid://shopify/<Type>/<id>`.
- **Admin API** — GraphQL API for merchant store data (products, orders, etc.).
- **Function** — merchant-installed logic running in Shopify's runtime (discount,
  cart, delivery, etc.). Lives in `extensions/`.
- **UI Extension** — custom UI injected into checkout, customer account, or admin
  surfaces. Lives in `extensions/`.
- **Metafield / Metaobject** — Shopify custom data (skill: `shopify-custom-data`).
- **App Bridge** — the bridge that embeds our Remix app in Shopify Admin.
- **Polaris** — Shopify's React design system for admin UIs.
- **Session token** — short-lived token authenticating embedded admin requests.
- **userErrors** — per-mutation error array Shopify returns; always handled.

## Project-specific terms

> Add domain nouns here as features are built (e.g. "Bundle", "Bundle
> Component", "Discount Rule") so naming stays consistent across the codebase.
