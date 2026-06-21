# Guardrail — shopify-custom-data (metafields & metaobjects)

> Layered on the official `shopify-custom-data` skill.

## Rules
- Define namespaces/keys in one place per domain
  (`app/domains/<domain>/metafields.ts`) — never scatter string literals.
- Pick the correct metafield `type` (the skill lists valid types). Validate
  values with Zod against that type before writing.
- Metaobject definitions are infra: create/update them via migrations or a
  documented setup script, not ad hoc at request time.
- Reads that drive Functions must use the exact namespace/key the Function
  expects — keep them in a shared const both sides import.
