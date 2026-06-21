# ADR 0007 — Secrets never accessed by agent

**Status:** Accepted

## Context

An AI agent working in a Shopify app codebase has access to Read and Bash tools
that can inspect files and run shell commands. Without explicit constraints, an
agent could read `.env` files, print environment variables, log API keys during
debugging, or embed credential values directly into generated code. Any of these
actions would expose secrets that are meant to be invisible to tooling.

Shopify apps handle Admin API tokens, session secrets, database URLs, and webhook
signing keys — all of which are high-value targets. A single accidental `console.log`
of a session token or a hardcoded API key committed to source control is a
material security incident.

## Decision

Secrets are strictly out of scope for the agent at all times:

1. The agent must never read, request, inspect, log, echo, or attempt to reconstruct
   any `.env` file, environment variable value, API key, token, credential, or secret
   manager entry.
2. The agent must never suggest methods to retrieve, bypass, or expose secrets.
3. When code requires configuration, the agent uses `process.env.VARIABLE_NAME` as a
   reference placeholder — never the actual value.
4. All `process.env` reads in app code are centralized exclusively in
   `app/shared/lib/` (e.g. `env.ts`, `shopify.server.ts`). Services, routes, and
   components receive pre-configured clients as injected dependencies.
5. If a task depends on a secret value, the agent marks it `[CONFIGURE AT RUNTIME]`
   and continues the implementation.

## Consequences

- **Positive:** secrets can never leak through agent output, generated code, logs, or
  tool call results. The attack surface for accidental credential exposure is zero
  from the agent's side.
- **Tradeoff:** agents cannot self-diagnose configuration problems that depend on
  knowing the actual value of a variable. They must assume correct values are present
  at runtime and focus on code correctness.
- **Enforcement:**
  - `.claude/settings.json` deny rules block `Read(**/.env*)` and `Bash(printenv*)`,
    `Bash(env)`, `Bash(cat .env*)` at the tool-permission level.
  - `scripts/check-architecture.mjs` fails the build on any `process.env` reference
    outside `app/shared/lib/`, enforcing the centralized config rule in source code.
  - `.ai/AGENTS.md §10` states the rule as a binding constraint with the same
    priority as the anti-hallucination rule.
  - `/review` checklist includes secrets as a block-ship category.
