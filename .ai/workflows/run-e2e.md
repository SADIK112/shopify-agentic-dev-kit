# Workflow — Write and Run E2E Tests

E2E tests verify acceptance criteria from `feature-specs/<feature>/SPEC.md`
against a running Shopify dev store. They are the last gate before marking a
feature done.

## When to use

- After all unit and integration tests pass for a feature.
- When a `SPEC.md` has unchecked acceptance criteria items.
- When a bug fix involves a route-level or checkout-level behavior change.

## Prerequisites

```bash
# 1. App running on a dev store tunnel
shopify app dev   # starts Remix + tunnel; note the store URL

# 2. Test runner (Playwright or your project's test harness) installed
# 3. A test store with representative data (products, customers)
```

## Writing e2e tests

Tests live in `tests/e2e/`. Name files after the feature:
`tests/e2e/<feature>.spec.ts`.

### What each test must cover

For every acceptance criterion in `SPEC.md`:
1. Identify the **actor** (Merchant in admin, Customer in checkout).
2. Identify the **entry point** (route URL, UI trigger, checkout scenario).
3. Write the happy-path test first.
4. Write at least one failure-path test (invalid input, Shopify userError).

### Test structure

```typescript
// tests/e2e/<feature>.spec.ts
import { test, expect } from "@playwright/test";

test.describe("<Feature> — <Actor>", () => {
  test("<acceptance criterion>", async ({ page }) => {
    // Arrange: navigate or set up store state via Admin API if needed.
    // Act: interact with the UI.
    // Assert: observable outcome matches SPEC acceptance criterion.
  });
});
```

### Shopify-specific e2e patterns

- **Admin app routes** — authenticate via session token. Use test helpers in
  `tests/helpers/auth.ts` to get an authenticated session before navigating.
- **Checkout** — use the Playwright checkout flow helpers; don't hardcode
  product/variant IDs (fetch them from the test store at setup time via Admin API).
- **Webhooks** — do not test webhooks in e2e; use integration tests with a signed
  payload instead (see `add-webhook.md` step 4).
- **Functions** — test via the checkout flow; the Function runs on Shopify's
  runtime, so e2e is the only way to verify it end to end.

## Running tests

```bash
# Against the dev store tunnel (interactive):
npx playwright test tests/e2e/<feature>.spec.ts --headed

# Headless (CI-style):
npx playwright test tests/e2e/<feature>.spec.ts
```

## Done when

Every unchecked acceptance criterion in `SPEC.md` is now covered by a passing
e2e test. Check off the e2e item in `feature-specs/<feature>/TODO.md` and note
any non-obvious test setup in `NOTES.md`.

## CI note

E2e tests require a live dev store tunnel and are slow. Run them:
1. Before shipping a feature (against staging).
2. Nightly in CI against a dedicated test store, not on every PR.

Keep e2e test count focused on acceptance criteria — not every edge case. Unit
and integration tests cover edge cases cheaper.
