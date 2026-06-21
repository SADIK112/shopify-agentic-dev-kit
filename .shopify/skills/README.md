# Shopify Agent Skills — Router & Guardrails

This folder is how the agent connects to **Shopify's official Agent Skills**
(the Shopify AI Toolkit). It is deliberately thin.

## Important: we do NOT vendor skills here

Shopify's skills are generated upstream and **auto-update**. Manually copying
their `SKILL.md` files into the repo would freeze a stale snapshot — exactly the
thing that causes API hallucination. Instead:

- Skills are installed via the Toolkit / `npx skill install <name>` into the
  agent's environment (e.g. `~/.config/...` or the project's plugin path).
- This repo keeps only:
  - `registry.json` — the **mapping** from "task surface" → official skill name,
    so the agent knows which skill to invoke for a given job.
  - `guardrails/<skill>.md` — *our* project-specific rules layered on top of the
    official skill (naming, where ops live, repo conventions). Small, curated,
    committed.

## How the agent uses this

When a task touches a Shopify surface:

1. Open `registry.json`, find the surface, get the official `skill` name.
2. Invoke that skill (its `SKILL.md` loads Shopify's authoritative context;
   `search_docs` finds docs; `validate` checks generated code).
3. Also read `guardrails/<skill>.md` for how *this repo* wants it done.
4. Write code. Then run the skill's `validate` script before declaring done.

## Install / refresh

```bash
npx skills add Shopify/shopify-ai-toolkit   # recommended: auto-updating plugin
# or individually:
npx skill install shopify-admin
npx skill install shopify-functions
npx skill install shopify-custom-data
npx skill install shopify-polaris-app-home
npx skill install shopify-polaris-checkout-extensions
npx skill install shopify-polaris-customer-account-extensions

node scripts/sync-skills.mjs   # verify install + refresh registry status
```

## Surface → skill map (see registry.json for the machine-readable version)

| Task surface | Official skill | Prompt's old name |
|---|---|---|
| Admin GraphQL queries/mutations | `shopify-admin` | admin-graphql |
| Discount/cart/delivery logic | `shopify-functions` | functions |
| Metafields / metaobjects | `shopify-custom-data` | metafields |
| Checkout UI | `shopify-polaris-checkout-extensions` | checkout-ui |
| Customer account UI | `shopify-polaris-customer-account-extensions` | customer-account-ui |
| Embedded admin home / App Bridge | `shopify-polaris-app-home` | app-bridge |
| Polaris admin components | `shopify-polaris-app-home` (+ admin ext) | polaris |
| Storefront (headless) | `shopify-storefront-graphql` | — |
| General doc search | `shopify-dev` | — |
