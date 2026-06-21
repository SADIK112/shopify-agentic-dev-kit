# ADR NNNN — Title (replace with a noun-phrase, not a verb)

**Status:** Draft | Accepted | Superseded by [MMMM](./MMMM-slug.md)

## Context

What situation or constraint forced a decision here? Include:
- The forces at play (technical, organizational, compliance, Shopify platform).
- Why the default / obvious approach was not good enough.
- Relevant prior decisions this builds on.

Keep this short — the reader should understand the problem in under a paragraph.

## Decision

State the decision in one sentence. Follow with any clarifying scope:
- What is included.
- What is explicitly excluded.

Example: "We use Admin GraphQL for all Shopify data access. REST endpoints are
only allowed when GraphQL cannot accomplish the task, and each exception requires
its own ADR."

## Consequences

- **Positive:** what gets better because of this decision.
- **Negative / tradeoffs:** what gets harder, what we give up.
- **Enforcement:** how the codebase or tooling enforces this (lint rule, script,
  guard in AGENTS.md, etc.). If there is no enforcement, state that explicitly.
