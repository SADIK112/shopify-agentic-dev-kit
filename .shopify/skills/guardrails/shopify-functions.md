# Guardrail — shopify-functions

> Layered on the official `shopify-functions` skill.

## Placement
- Each Function is its own extension under `extensions/<function-name>/`.
- Input query in `input.graphql`; run logic in `src/`. Keep run logic pure and
  deterministic — Functions execute in Shopify's runtime, not our server.

## Rules
- Target the correct Function API + version per the skill; validate the input
  query against the Function schema (not the Admin schema).
- No network calls, no nondeterminism, no secrets in Function code.
- Keep the output payload minimal and within documented limits.
- Business *configuration* for a Function lives in the matching app domain
  (e.g. discount rules in `app/domains/discounts/`), read by the Function via
  metafields. Don't hardcode merchant logic.

## Validate before done
Run the skill's `validate` against the Function's schema target.
