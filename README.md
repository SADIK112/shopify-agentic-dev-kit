# Shopify AI OS — AI-First Shopify Agent Development

A reusable repository blueprint for building and maintaining an AI assistant
focused on Shopify app development. This repo is intentionally agentic: it
contains skill routing, guardrails, documentation, and tooling for a Shopify
assistant, not a runtime app.

> **TL;DR for the agent:** read [`.ai/AGENTS.md`](.ai/AGENTS.md) first. For
> Shopify surfaces, check `.shopify/skills/registry.json` → run the matching skill
> (Claude Code) or read the matching guardrail (all other platforms). Never ship
> an unverified Shopify field.

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
5. .ai/commands/<cmd>.md     ← workflow-specific instructions
```

The agent should pull in **only the layers a task needs**. That is the whole
token-efficiency strategy: context is *local*, not *global*.

## Stack

- **AI skill routing** — `.shopify/skills/registry.json` maps Shopify surface to skill
- **Shopify skill guardrails** — repo-specific rules layered on official skill behavior
- **Feature specs** — `feature-specs/` keeps intent separate from implementation
- **Agent knowledge** — `.ai/` (commands, workflows, agents, templates, rules)
- **Claude Code runtime** — `.claude/` (settings.json, skills symlinks only)

## Platform support

The framework's intelligence layer (`.ai/`, `feature-specs/`, `docs/`, `.shopify/skills/guardrails/`) works with any AI agent. Platform-specific entry points wire it up:

| Platform | Entry point | Shopify skills |
|---|---|---|
| **Claude Code** | `CLAUDE.md` | Full skill invocation + `validate` |
| **OpenAI Codex** | `AGENTS.md` | Guardrails + `shopify.dev` |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Guardrails + `shopify.dev` |
| **Cursor** | `.cursor/rules/shopify-ai-os.mdc` | Guardrails + `shopify.dev` |
| **Gemini Code Assist** | `GEMINI.md` | Guardrails + `shopify.dev` |

**What "full skill invocation" means:** Claude Code can run `npx skill install shopify-admin` which gives the agent live Shopify GraphQL schema search and a `validate` command for generated ops. This is the strongest hallucination prevention. On other platforms, the guardrail files in `.shopify/skills/guardrails/` serve the same role without the live schema — they cover GID formats, `userErrors` handling, rate limits, and file placement conventions.

## First-time setup

### Claude Code (recommended)

```bash
# 1. Install the Shopify AI Toolkit skills
npx skills add Shopify/shopify-ai-toolkit

# 2. Sync and verify the skill router
npm run sync-skills

# 3. Install dependencies
npm install
```

See [`.shopify/skills/README.md`](.shopify/skills/README.md) for how skills are
wired and why installed skill payloads are not committed.

### Other platforms (Copilot, Cursor, Codex, Gemini)

```bash
# Skills installation is not available — skip steps 1 & 2 above.
npm install
```

The platform entry point file (`AGENTS.md`, `.github/copilot-instructions.md`,
`.cursor/rules/shopify-ai-os.mdc`, or `GEMINI.md`) loads automatically. Shopify
surface tasks use `.shopify/skills/guardrails/` as context — see
[`.shopify/skills/guardrails/README.md`](.shopify/skills/guardrails/README.md).

## Repository map

```
.ai/              Agent brain — all platforms
  AGENTS.md       Global operating rules and task loop
  ARCHITECTURE.md Layer rules and dependency enforcement
  TYPESCRIPT.md   TypeScript patterns (Result, GIDs, Zod, errors)
  commands/       Task workflow definitions (create-feature, review, debug…)
  workflows/      Multi-step workflow chains (build-feature-end-to-end…)
  agents/         Sub-agent persona briefs (shopify-research, code-reviewer…)
  templates/      Code scaffolding templates (.ts.tmpl, .tsx.tmpl)

.shopify/         Shopify surface router + guardrails — all platforms
.claude/          Claude Code runtime config only
  settings.json   Stop hook + permission rules
  skills/         Shopify skill symlinks (installed via npx skill install)
feature-specs/    Feature intent, specs, rules, and TODOs — all platforms
docs/             ADRs and human documentation — all platforms
scripts/          Architecture guard, skill sync, ADR gen — all platforms

CLAUDE.md         Claude Code entry point
AGENTS.md         OpenAI Codex entry point
GEMINI.md         Gemini Code Assist entry point
.github/          GitHub Copilot entry point (copilot-instructions.md)
.cursor/          Cursor entry point (rules/shopify-ai-os.mdc)
```

## License

Internal engineering blueprint. Adapt freely within your org.
