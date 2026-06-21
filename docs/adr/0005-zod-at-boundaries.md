# ADR 0005 — Zod validation at every external boundary

**Status:** Accepted

## Context
Route inputs, webhook payloads, and untrusted Shopify responses are validated at the edge; inferred types are the canonical TS types.

## Decision
No unvalidated external input reaches a service.

## Consequences
Recorded in `.ai/DECISIONS.md`. Revisit via a superseding ADR if conditions change.
