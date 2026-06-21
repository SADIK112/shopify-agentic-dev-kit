# Shopify AI OS — AI-First Shopify Agent Development

A reusable repository blueprint for building and maintaining an AI assistant
focused on Shopify app development. This repo is intentionally agentic: it
contains skill routing, guardrails, documentation, and tooling for a Shopify
assistant, not a runtime app.

> **TL;DR for the agent:** read [`.ai/AGENTS.md`](.ai/AGENTS.md) first, then the
> nearest local `AGENTS.md`. Always invoke the matching Shopify Agent Skill and
> run its validation before generating Shopify-specific code.

---

## Why this exists

AI agents need structure to avoid hallucinations and stale Shopify advice.
This repository provides that structure through:

| Failure mode | Structural fix |
|---|---|
| Hallucinated Shopify API fields | Shopify Agent Skills + `validate` scripts are mandatory (`.shopify/skills/`) |
| Giant context loads | Local agent context and clear layer maps keep prompts small |
| Confused task routing | `.shopify/skills/registry.json` maps surfaces to the right skill |
| Stale upstream skills | We keep only the router/guardrails and install skills externally |

## How the agent loads context (cheap → expensive)

```
1. .ai/AGENTS.md                 ← always (global rules, architecture, glossary)
2. .shopify/skills/registry.json ← Shopify surface routing
3. .shopify/skills/guardrails/    ← repo-specific Shopify skill guidance
4. feature-specs/<x>/SPEC.md     ← feature intent and constraints
5. .claude/commands/<cmd>.md     ← workflow-specific instructions
```

The agent should pull in **only the layers a task needs**. That is the whole
token-efficiency strategy: context is *local*, not *global*.

## Stack

- **AI skill routing** — `.shopify/skills/registry.json` maps Shopify surface to skill
- **Shopify skill guardrails** — repo-specific rules layered on official skill behavior
- **Feature specs** — `feature-specs/` keeps intent separate from implementation
- **Agent tooling** — `.claude/`, `.ai/`, `scripts/`

## First-time setup

```bash
# 1. Install the Shopify AI Toolkit skills
npx skills add Shopify/shopify-ai-toolkit
# or install the specific skills you need
# npx skill install shopify-admin
# npx skill install shopify-functions
# npx skill install shopify-custom-data

# 2. Sync the repo skill router
npm run sync-skills

# 3. Install dependencies
npm install
```

See [`.shopify/skills/README.md`](.shopify/skills/README.md) for how skills are
wired and why installed skill payloads are not committed.

## Repository map

```
.ai/            Global agent operating system (rules, architecture, glossary)
.claude/        Claude Code commands, workflows, sub-agents, templates
.shopify/       Shopify Agent Skill router + local guardrail notes
feature-specs/  Feature intent, specs, rules, and TODOs
docs/           Human docs + Architecture Decision Records (ADR)
scripts/        Repo tooling for skill sync, checks, and validation
```

## License

Internal engineering blueprint. Adapt freely within your org.
