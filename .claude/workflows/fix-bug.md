# Workflow — Fix a Bug

A structured path from "something is wrong" to "root cause fixed with a
regression test." This is tighter than `/debug` — use it when the symptom is
known and you need to get to a merged fix fast.

## Inputs required before starting

- **Symptom** — exact error message, failing test name, or observed vs expected
  behavior. Not a paraphrase — the literal output.
- **Reproduction** — route, input, or command that triggers it reliably.
- **Affected feature** (optional) — the `feature-specs/<feature>/` folder if known.

## Steps

### 1. Reproduce, don't assume

Run the failing command or test. Capture the exact stack trace / error text.
If you cannot reproduce it with the information given, ask for more detail
rather than guessing.

### 2. Localize by layer

Using `.ai/ARCHITECTURE.md`, decide which layer the symptom points to:

| Symptom type | Start here |
|---|---|
| HTTP 4xx / 5xx from a route | `app/routes/<route>.tsx` → then trace into the service |
| Wrong data returned | service → repository (check shop-scope) |
| Shopify API error (400/422) | `app/domains/<domain>/graphql/` + `shopify-admin` skill |
| Webhook not firing or failing HMAC | `app/routes/webhooks.*` + `shopify.app.toml` |
| Prisma error | repository → schema.prisma → migration |
| Type error in tests | Zod schema, generated types, or missing codegen run |
| Function applying wrong discount | `extensions/<name>/src/` + Function input query |

Load *only* the files the layer points to. Do not read the whole domain.

### 3. Write a failing test first

Before touching production code, add a test that:
- Triggers the exact bug.
- Fails now, will pass after the fix.
- Lives in the right test file: unit test for service logic, integration test for
  repository queries, e2e for a route-level behavior.

This confirms the reproduction and protects against regression.

### 4. Fix at the root, not the symptom

The bug's cause layer determines where the fix goes:
- Service logic bug → fix the service.
- Missing Prisma shop-scope → fix the repository query.
- Wrong GraphQL field → fix the op and re-run `npm run graphql:codegen`.
- Shopify deprecated API field → verify with `shopify-admin` skill, update op.
- Route leaking business logic → extract to a service (don't just patch the route).

Do not add a try/catch to hide an error that should be fixed upstream.

### 5. Confirm and expand test coverage

- Run the new failing test — it should now pass.
- Run the full test suite for the affected domain:
  ```bash
  npm test -- --testPathPattern=<domain>
  npm run check
  ```
- If related edge cases in `SPEC.md` are untested, add them now.

### 6. Record and close

- Move the bug's entry from **Open → Closed** in `feature-specs/<feature>/BUGS.md`.
  Fill in the fixed date, commit sha, and one-sentence root cause.
- If the root cause was non-obvious (undocumented Shopify behavior, a
  multi-tenant scoping gap, a rate-limit edge case), add a note to `NOTES.md`.
- If it reveals a missing architecture rule:
  ```bash
  node scripts/generate-adr.mjs "describe-the-constraint"
  ```
- Run `/checkpoint <feature>` to sync all tracking files and write the session
  log entry.
