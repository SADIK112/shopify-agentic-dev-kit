# /review — review a change before it ships

> **Always-on rules** (from `.ai/AGENTS.md`): search before writing · reuse
> existing patterns · no duplication · skill-gate every Shopify surface · routes
> thin · Prisma only in repositories · GraphQL-first · validate before done.

## Checklist
- **Security (block-ship if any finding here):**
  - No hardcoded API keys, tokens, passwords, or credentials anywhere in the diff.
  - No `.env` file reads, `process.env` access outside `app/shared/lib/`, or secret
    logging. (`npm run check` now catches the `process.env` rule.)
  - No code that retrieves, prints, or reconstructs a secret value at runtime.
  - Configuration placeholders use `process.env.VARIABLE_NAME` — never inline values.
- **Architecture:** routes thin? services hold the logic? Prisma only in
  repositories? GraphQL ops isolated per domain? (`npm run check` passes.)
- **Shopify correctness:** every Admin field verified via skill; mutations
  handle `userErrors`; API version pinned; GIDs used; rate-limit handling
  present; skill `validate` run on generated Shopify code.
- **Types & validation:** strict TS, no `any`/`!`-silencing; Zod at every external
  boundary. Services return `Result<T, E>` via `ok()`/`err()` — not thrown errors,
  not `T | null`. Shopify ID fields use `GID<"Type">` branded types — not bare
  `string`. Errors are discriminated unions (`kind` field) — not `Error` subclasses.
  Types are `z.infer<typeof schema>` — not hand-written interfaces alongside a schema.
- **File discipline:** files ≤300 lines, one responsibility, sensible names.
- **Tests:** unit (services, fake repo), integration (repositories), e2e where a
  route/feature path is involved. All green.
- **No duplication:** the change reuses existing patterns/utilities.
- **Docs:** new decisions → ADR + `.ai/DECISIONS.md`; new nouns → `GLOSSARY.md`.

## Output
A short verdict (approve / changes requested) with specific file:line notes.
Praise what's right; be concrete about what's wrong. No vague nits.
