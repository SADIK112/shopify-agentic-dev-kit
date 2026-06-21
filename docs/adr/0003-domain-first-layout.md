# ADR 0003 — Domain-first folder layout

**Status:** Accepted

## Context
Co-locating a domain's services/repos/schemas/graphql/tests keeps the context an agent must load small and local, cutting tokens and coupling.

## Decision
Cross-domain code goes to app/shared only when genuinely shared.

## Consequences
Recorded in `.ai/DECISIONS.md`. Revisit via a superseding ADR if conditions change.
