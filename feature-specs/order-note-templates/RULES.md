# RULES — Order Note Templates

Feature-local constraints that extend `.ai/AGENTS.md` and the domain's AGENTS.md.

- **Domain:** `app/domains/notes/`
- **Skills required:**
  - `shopify-admin` — before writing any order query or `orderUpdate` mutation
  - `app-home` — before rendering any Polaris component
- **Data ownership:**
  - `NoteTemplate` records are app-owned, stored in Prisma, shop-scoped.
  - `ApplyLog` records (which template was applied to which order, when) are
    app-owned, stored in Prisma, shop-scoped.
  - The order note field belongs to Shopify. The app reads it to build the
    preview and writes it via `orderUpdate`. The app never caches the note content.
- **Architecture constraints:**
  - The Admin API order query and `orderUpdate` mutation live in
    `app/domains/notes/graphql/` — not inline in the route or service.
  - The "append + length check + call API" logic belongs in the service, not the route.
  - The route parses input, calls the service, and maps the `Result` to an HTTP
    response. No `prisma`, no GraphQL strings in the route.
- **Out of scope (v1):**
  - Bulk apply to multiple orders at once.
  - Template categories or folders.
  - Notifications or email triggers on apply.
  - Storefront integration.
  - Shopify Functions.
  - Webhooks.
