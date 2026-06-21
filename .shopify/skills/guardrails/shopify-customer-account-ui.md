# Guardrail — shopify-polaris-customer-account-extensions

> Layered on the official customer-account extensions skill.

## Rules
- Same discipline as checkout UI: validate targets + components against the
  skill's library before writing.
- Respect customer data access scopes; request the minimum.
- Run the skill's `validate` before done.
