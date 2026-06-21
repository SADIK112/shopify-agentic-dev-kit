# PROJECT.md — System Model

High-level mental model of *this* app. Update it when the model changes; keep it
short enough that an agent can read it in one pass.

## What this app is

A Shopify embedded app built on the `@shopify/shopify-app-remix` template. It
runs inside the Shopify Admin (App Bridge + Polaris), extends checkout/customer
surfaces via UI extensions, and runs in-platform logic via Shopify Functions.

## Integration model

- **Embedded admin app** — Remix routes under `app/routes/app.*` rendered inside
  Shopify Admin via App Bridge. Session tokens authenticate every request.
- **Admin GraphQL** — primary data channel to the merchant's store.
- **Webhooks** — Shopify → app events (`app/routes/webhooks.*`), HMAC-verified.
- **Functions** — discount/cart/delivery/checkout logic deployed to Shopify's
  runtime (`extensions/`), not executed in our server.
- **UI Extensions** — checkout, customer-account, admin surfaces (`extensions/`).

## Data model rules

- App-owned data lives in Postgres via Prisma (sessions, app settings,
  per-shop configuration, jobs, caches).
- Merchant commerce data (products, orders, customers, inventory) lives in
  **Shopify** and is read/written via Admin GraphQL — *do not mirror it in
  Prisma* unless an ADR justifies a cache, and then treat Shopify as source of
  truth.
- Shop-scoped: every Prisma row that isn't global must carry `shop` and be
  filtered by it. Multi-tenant safety depends on this.

## Authentication

- `authenticate.admin(request)` from the Shopify Remix package gates admin
  routes and yields an authenticated `admin.graphql` client.
- Webhooks: `authenticate.webhook(request)` (HMAC) before handling.
- Never trust a `shop` value from the client; derive it from the authenticated
  session.

## Events / webhooks

- Subscribe in `shopify.app.toml`. Handlers live in `app/routes/webhooks.*`.
- Pattern: verify → parse with Zod → call a domain service → respond 200.
- Long work goes to a job (`app/domains/jobs/`), not the request thread.

## Caching strategy

- Default to **no cache**; correctness first.
- When a read is hot and the data is slow-changing (e.g. product metadata),
  cache in Prisma or memory with an explicit TTL, documented in the domain's
  `AGENTS.md`. Cache invalidation on the corresponding webhook.

## Environments

- `dev` (tunnel via `shopify app dev`), `staging`, `production`.
- API version is pinned in `shopify.app.toml` and `graphql.config.ts`; bump
  deliberately and regenerate types.
