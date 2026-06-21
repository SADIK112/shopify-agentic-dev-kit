# DECISIONS.md — Engineering Tradeoffs (index)

Short, append-only log of decisions that shape the codebase. Full records live
in `docs/adr/`. Add a one-line entry here and a file there for anything an agent
might otherwise "fix" by accident.

| # | Decision | Why | ADR |
|---|---|---|---|
| 1 | Admin GraphQL over REST | precise fields, bulk ops, better rate limits | adr/0001 |
| 2 | Prisma only via repositories | testability, single persistence boundary | adr/0002 |
| 3 | Domain-first folder layout | local context = fewer tokens, less coupling | adr/0003 |
| 4 | Don't mirror Shopify commerce data | Shopify is source of truth; avoid drift | adr/0004 |
| 5 | Zod at every external boundary | runtime safety for untrusted input | adr/0005 |
| 6 | Skills are synced, not vendored | upstream auto-updates; stale copies hallucinate | adr/0006 |
| 7 | Secrets never accessed by agent | prevent credential leakage via tool calls or generated code | adr/0007 |

## Standing tradeoffs the agent should respect

- **Correctness > cleverness.** Prefer the obvious implementation.
- **Explicit > implicit.** No magic; name things; validate inputs.
- **Local > global.** Put code and its context in the same domain folder.
- **Few files changed > broad refactors.** Scope creep is reviewed, not assumed.
