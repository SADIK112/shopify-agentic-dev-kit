# Guardrail — shopify-polaris-app-home (embedded admin + App Bridge + Polaris)

> Layered on the official app-home skill.

## Rules
- All admin routes are embedded: authenticate with `authenticate.admin(request)`
  and use App Bridge for navigation/toasts/resource pickers.
- Use Polaris components from the skill's current library; validate prop usage —
  Polaris changes across majors and agents tend to use removed props.
- Keep page components thin: data comes from loaders (which call services), not
  from fetches inside components.
- Run the skill's `validate` on Polaris/App Bridge UI before done.
