# Sub-agents

Optional specialized personas for multi-agent collaboration. Each is a focused
context so a delegating agent can hand off a slice of work without loading
everything. Keep each agent's brief tight; they all inherit `.ai/AGENTS.md`.

| Agent | When to invoke |
|---|---|
| `spec-writer-agent` | Turn a one-line brief into a complete SPEC.md + RULES.md |
| `shopify-research-agent` | Verify API fields/mutations before any Shopify-surface code is written |
| `shopify-graphql-agent` | Author and validate Admin GraphQL ops in `domain/graphql/` |
| `architecture-guard-agent` | Enforce layer boundaries; run `npm run check` and review imports |
| `test-author-agent` | Write unit, integration, and e2e tests from a spec's acceptance criteria |
| `code-reviewer-agent` | Independent post-implementation review against spec + framework rules |
