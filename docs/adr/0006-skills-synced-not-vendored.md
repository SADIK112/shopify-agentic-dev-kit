# ADR 0006 — Shopify skills are synced, not vendored

**Status:** Accepted

## Context
Shopify's Agent Skills auto-update upstream. Vendoring stale SKILL.md copies reintroduces API hallucination. We keep only a registry mapping + local guardrails.

## Decision
`.shopify/skills/<skill>/` payloads are gitignored; registry.json + guardrails are committed.

## Consequences
Recorded in `.ai/DECISIONS.md`. Revisit via a superseding ADR if conditions change.
