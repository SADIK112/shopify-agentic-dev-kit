# ADR 0004 — Don't mirror Shopify commerce data

**Status:** Accepted

## Context
Shopify is the source of truth for products/orders/customers. Mirroring invites drift. Functions that need data read it from metafields, not our DB.

## Decision
Caching allowed with explicit TTL + webhook invalidation, documented per domain.

## Consequences
Recorded in `.ai/DECISIONS.md`. Revisit via a superseding ADR if conditions change.
