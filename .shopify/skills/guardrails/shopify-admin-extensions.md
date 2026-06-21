# Guardrail — shopify-polaris-admin-extensions

> Layered on the official `shopify-polaris-admin-extensions` skill.

## Extension targets

Admin UI extensions have distinct targets — confirm the exact target string with
the skill before writing any code. Common targets (not exhaustive):

- `admin.product-details.block.render` — product detail page block
- `admin.order-details.block.render` — order detail page block
- `admin.product-index.selection-modal.render` — product list bulk action

Do not guess target strings. They are versioned and change across API versions.

## Rules

- Validate all component names, props, and hook usage against the skill's current
  library — admin extension components differ from checkout extension components.
- Admin extensions run in Shopify's iframe, not our server. They can call the
  Admin API via the provided `adminApiClient` — no server-side session needed.
- Configuration the extension reads from the app flows through metafields
  (see `shopify-custom-data` skill). Extensions cannot reach Prisma directly.
- Respect the extension's allowed surface APIs; do not attempt to call Admin API
  mutations that require merchant action or permissions beyond the extension's scope.

## Validate before done

Run the skill's `validate` on the extension source before declaring done.
