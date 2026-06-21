# review — review a change before it ships

> **Always-on rules** (from `.ai/AGENTS.md`): search before writing · reuse
> existing patterns · no duplication · verify every Shopify surface · routes
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
- **Shopify correctness:** every Admin field verified via guardrail +
  `shopify.dev` (Claude Code: also skill `search_docs`); mutations handle
  `userErrors`; API version pinned; GIDs used throughout; rate-limit handling
  present; `npm run check` passes (Claude Code: also run skill `validate` on
  generated ops).
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
- **Platform neutrality** (applies to any change inside `.ai/`) — check against
  §11 of `.ai/AGENTS.md`:
  - No `/command-name` syntax in headings or prose.
  - No unqualified "invoke the skill" / "call search_docs" / "use the Agent tool".
  - Every platform-specific capability is labeled "On [Platform]:" and comes
    *after* the universal instruction — not instead of it.
  - New agent files include all four sections: Scope, Input, Process, Output.

## Output
A short verdict (approve / changes requested) with specific file:line notes.
Praise what's right; be concrete about what's wrong. No vague nits.
