# Workflow — Add a UI Extension

Covers checkout, customer-account, and admin UI extensions. Read the matching
guardrail *before* writing any component code.

## 1. Determine surface and skill

| Surface | Skill | Guardrail |
|---|---|---|
| Checkout | `shopify-polaris-checkout-extensions` | `guardrails/shopify-checkout-ui.md` |
| Customer account | `shopify-polaris-customer-account-extensions` | `guardrails/shopify-customer-account-ui.md` |
| Admin (action/block) | `shopify-polaris-admin-extensions` | *(add guardrail if building admin ext)* |

Verify the extension **target** (e.g. `purchase.checkout.block.render`) via the
matching guardrail and `shopify.dev` before writing code — target strings are
routinely hallucinated. On Claude Code: invoke the matching skill for live schema
lookup.

## 2. Generate the extension scaffold

```bash
shopify app generate extension
# Select the correct extension type and target when prompted.
```

Extension lives in `extensions/<name>/`.

## 3. Implement

- `src/` — render logic only. Keep render functions small (split into components).
- Component names and props must be verified against the current library via the
  matching guardrail and `shopify.dev`. On Claude Code: use the skill's component
  schema. Extension components change across versions — do not guess prop names.
- Respect the surface's allowed APIs:
  - **Checkout**: checkout APIs + attributes only. No Admin API calls.
  - **Customer account**: customer data scopes (request minimum).
  - **Admin**: admin extension APIs only.
- Configuration that the extension reads from the app should flow through
  metafields (see `guardrails/shopify-custom-data.md`). Extensions cannot reach Prisma.

## 4. Connect app-side data (if needed)

If the extension needs merchant-configured data:
- The app domain writes configuration to metafields (via its service + GraphQL op).
- The extension reads it via the allowed metafield APIs for its surface.
- Namespace/key constants must match exactly — define them once and import in
  both places (see `guardrails/shopify-custom-data.md`).

## 5. Validate and test

```bash
shopify app build                      # validate locally before deploying
shopify app deploy --only-extensions   # preview on dev store
```

- Manual test: open the surface on a dev store, verify the extension renders
  correctly and handles edge cases (empty data, API errors).
- If the extension conditionally renders (e.g. only for certain products), test
  both the show and no-show cases.

## 6. Document

- Add the extension's surface + target to the owning domain's `AGENTS.md` so
  future agents know what's already built.
- Record any non-obvious constraints in `feature-specs/<feature>/NOTES.md`.
