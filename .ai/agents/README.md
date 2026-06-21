# Sub-agents

Specialized context modules for focused, single-responsibility tasks. Each agent
has a defined scope, a precise input contract, and a structured output — so any
AI can invoke, execute, and hand off predictably. All agents inherit the rules
in `.ai/AGENTS.md`.

## Roster

| Agent | When to use |
|---|---|
| `spec-writer-agent` | Turn a one-line brief into a complete SPEC.md + RULES.md |
| `shopify-research-agent` | Verify API fields/mutations before any Shopify-surface code |
| `shopify-graphql-agent` | Author and validate Admin GraphQL ops in `domain/graphql/` |
| `architecture-guard-agent` | Enforce layer boundaries; run `npm run check`; flag violations |
| `test-author-agent` | Write unit, integration, and e2e tests from SPEC acceptance criteria |
| `code-reviewer-agent` | Independent post-implementation review against spec + framework rules |

## How to invoke — cross-platform model

Agents are **context modules**, not separate processes. The invocation model
differs by platform, but the agent's input/process/output contract is identical
on all of them.

**Claude Code (native multi-agent support):**
Load the agent's `.md` file as the context for a sub-agent. The sub-agent runs
its process in an isolated context and returns its defined output to the caller.

**All other platforms (Copilot, Cursor, Codex, Gemini):**
No sub-agent spawn mechanism exists. Instead:
1. Load the agent's `.md` file into the current context window.
2. Execute the agent's process steps as a focused in-context checklist.
3. Produce the agent's defined output format.
4. Resume the main workflow with that output.

"Invoke `shopify-research-agent`" means: load `.ai/agents/shopify-research-agent.md`,
follow its steps, produce a research brief, then continue.

## Agent interaction sequence (typical feature build)

```
implement-feature
  └─ step B (per Shopify surface):
       └─ shopify-research-agent  → research brief (confirmed fields)
       └─ shopify-graphql-agent   → verified op file + codegen status
  └─ step D (after services):
       └─ test-author-agent       → test files + coverage report
  └─ step F (close the loop):
       └─ architecture-guard-agent → violations list | all clear
       └─ code-reviewer-agent      → approve | changes requested
```

## Contract rules

- Each agent defines its **input** — provide exactly that, nothing more.
- Each agent defines its **output format** — the calling agent consumes that format.
- Agents never expand their scope. A problem found outside scope is flagged and
  returned — not silently fixed.
- `shopify-graphql-agent` requires a completed brief from `shopify-research-agent`.
  Never call it with unverified fields; it will refuse.
