# SPEC — Order Note Templates

## Business goal

Fulfillment teams type the same short instructions into Shopify order notes
repeatedly — "gift wrap requested", "signature required on delivery", "fragile,
handle with care." There is no native way to save and reuse these. This feature
lets merchants create a library of note templates and apply any template to an
order in a single action, eliminating repetitive manual entry and reducing
inconsistent phrasing across their operations team.

## Actors

- **Merchant (admin user)** — creates and manages templates; applies them to orders.

## Workflows

### 1. Manage templates

1. Merchant opens the app and navigates to the Templates tab.
2. Merchant creates a new template: enters a short name (e.g. "Gift wrap") and
   body text (e.g. "Please gift wrap this order.").
3. Template appears in the list immediately.
4. Merchant can edit or delete any template.

### 2. Apply a template to an order

1. Merchant navigates to the Apply tab and searches for an order by number or
   customer name.
2. The matching order is shown with its current note (if any) displayed.
3. Merchant selects a template from the dropdown.
4. The app shows a preview of the combined note (existing note + newline +
   template body) before the merchant confirms.
5. Merchant clicks Confirm. The app writes the combined note to Shopify via the
   `orderUpdate` Admin API mutation.
6. The app records the apply action (template ID, order GID, applied at timestamp).
7. Success confirmation is shown.

## Validation rules

- **Template title:** required, 1–100 characters, unique per shop.
- **Template body:** required, 1–4,900 characters. The 100-character buffer
  protects against exceeding Shopify's 5,000-character note limit when appended
  to an existing non-empty note.
- **Apply — combined length:** before calling Shopify, the app checks that
  (existing note length + 1 + template body length) ≤ 5,000. If it would
  exceed the limit, reject with a user-facing error and do not make the API call.
- **Apply — cancelled orders:** Shopify returns a `userError` when updating a
  cancelled order's note. Surface it to the merchant; do not silently fail.

## Shopify surfaces & skills

- Admin API (orders query + `orderUpdate` mutation) → `shopify-admin` skill
- Polaris UI → `app-home` skill

## Acceptance criteria

- [ ] Merchant can create a template; it appears in the list immediately.
- [ ] Duplicate template title within the same shop is rejected with a clear validation error.
- [ ] Applying a template appends to — and does not overwrite — an existing order note.
- [ ] Applying when the combined note would exceed 5,000 characters fails with a clear error before any API call is made.
- [ ] Applying to a cancelled order surfaces the Shopify `userError` to the merchant.
- [ ] Deleting a template has no effect on orders it was previously applied to.
- [ ] All templates and apply records are shop-scoped; no cross-tenant data access.
- [ ] `npm run check` passes.
