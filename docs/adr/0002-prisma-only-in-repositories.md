# ADR 0002 — Prisma only via repositories

**Status:** Accepted

## Context
A single persistence boundary makes services unit-testable with fakes and keeps DB concerns out of business logic. Enforced by a lint script.

## Decision
Any prisma import outside */repositories/ fails `npm run check`.

## Consequences
Recorded in `.ai/DECISIONS.md`. Revisit via a superseding ADR if conditions change.
