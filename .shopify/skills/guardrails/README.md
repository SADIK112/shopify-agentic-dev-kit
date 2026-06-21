# Guardrails — Surface → File Map

These files capture project-specific Shopify rules layered on top of Shopify's
official documentation. On platforms without `npx skill install`, they are your
primary Shopify context. On Claude Code with skills installed, they complement
the skill — read both.

## Surface → guardrail file

| Shopify surface | Guardrail file | Official docs |
|---|---|---|
| Admin GraphQL (queries / mutations) | `shopify-admin.md` | shopify.dev/api/admin-graphql |
| Shopify Functions (discount, cart, delivery, checkout) | `shopify-functions.md` | shopify.dev/apps/build/functions |
| Metafields & metaobjects | `shopify-custom-data.md` | shopify.dev/apps/custom-data |
| Embedded admin / App Bridge / Polaris | `shopify-app-home.md` | shopify.dev/apps/design-guidelines |
| Checkout UI extensions | `shopify-checkout-ui.md` | shopify.dev/api/checkout-ui-extensions |
| Customer account UI extensions | `shopify-customer-account-ui.md` | shopify.dev/api/customer-account-ui-extensions |
| Admin UI extensions | `shopify-admin-extensions.md` | shopify.dev/api/admin-extensions |
| Storefront GraphQL (headless only) | `shopify-storefront.md` | shopify.dev/api/storefront |

Also check `.shopify/skills/registry.json` for the machine-readable surface → skill
name mapping — it is the canonical routing table.

## How to use (non-Claude platforms)

1. Identify which surface your task touches.
2. Open the matching guardrail file from the table above.
3. Read every "before writing" rule — they exist to prevent hallucination.
4. For any field or mutation you cannot confirm from the guardrail, open the
   official docs URL in the table and verify before writing code.
5. Flag anything you cannot confirm as `UNVERIFIED: <field>` in your output.
   The implementing agent must not ship unverified fields.

## How to use (Claude Code — skills installed)

1. Invoke the matching skill from `registry.json` (e.g. `shopify-admin`).
2. Use the skill's `search_docs` for field/mutation verification.
3. Also read the guardrail for repo-specific conventions (naming, file placement,
   rate-limit handling). The skill provides the schema; the guardrail provides
   the *how we use it here*.
4. Run the skill's `validate` on every generated GraphQL op before declaring done.

## Install or refresh skills (Claude Code only)

```bash
npx skills add Shopify/shopify-ai-toolkit   # install all at once
node scripts/sync-skills.mjs                # verify install status
```
