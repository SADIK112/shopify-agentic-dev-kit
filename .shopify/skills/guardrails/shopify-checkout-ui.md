# Guardrail — shopify-polaris-checkout-extensions

> Layered on the official checkout extensions skill.

## Rules
- Validate component names + extension targets against the skill's component
  library (this is where agents most often hallucinate component props).
- Extension lives in `extensions/<name>/`; keep render functions small.
- No secrets, no Admin API calls from checkout UI — use the allowed checkout
  APIs / attributes only.
- Run the skill's `validate` on the extension before done.
