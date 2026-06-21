# /add-route — add a Remix route + Polaris page

> **Always-on rules** (from `.ai/AGENTS.md`): search before writing · reuse
> existing patterns · no duplication · skill-gate every Shopify surface · routes
> thin · Prisma only in repositories · GraphQL-first · validate before done.

**Input:** domain + route name (e.g. `orders: app.orders._index`).

## Steps

1. **Search first.** Check `app/routes/` for an existing route that covers this
   surface. Check `app/domains/<domain>/` for the service(s) the route should call.
   A route with no backing service probably means the service isn't written yet —
   use `/create-service` first.

2. **Name the file correctly.**
   - Embedded admin routes: `app/routes/app.<domain>.<view>.tsx`
   - Webhook handlers: `app/routes/webhooks.<topic>.tsx`
   - Remix file-based routing: dots become `/`; `_index` is the index segment.

3. **Create** `app/routes/<name>.tsx` from `.claude/templates/route.tsx.tmpl`.
   The route must:
   - Call `authenticate.admin(request)` (or `authenticate.webhook` for webhooks)
     as its **first line** — never skip this.
   - Parse/validate input with Zod (form data, params, search params).
   - Delegate all business logic to a service; no `prisma`, no GraphQL strings.
   - Map service results and domain errors to an appropriate HTTP/JSON response.
   - Surface `userErrors` from Shopify mutations — never silently drop them.

4. **Invoke app-home skill** for any route rendering a Polaris UI. Validate
   component names and props against the skill's current library.

5. **Page component** (if loader/action): co-locate at
   `app/domains/<domain>/components/<page>.tsx`. Keep it thin — data from
   `useLoaderData`, mutations via `useFetcher`/`Form`. No direct API calls inside
   components.

6. **Test:** add an integration or e2e test covering the loader and at least the
   happy-path action.

## Done when
The route compiles, `authenticate.admin` is the first call, no Prisma/GraphQL
inline, `npm run check` passes, and the action test is green.
