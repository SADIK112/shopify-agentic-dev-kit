# Shopify AI OS — Agent Bootstrap

This repository is an AI-first engineering framework for building Shopify apps
(Remix + Prisma + Shopify Admin API). It is **not** a runtime app — it provides
skill routing, guardrails, commands, workflows, and templates for agentic
development.

## Always load first

@.ai/AGENTS.md

## Load on demand (only what the task needs)

| When you need | Load |
|---|---|
| Layer rules, import constraints | `.ai/ARCHITECTURE.md` |
| Shopify integration model, auth, data ownership | `.ai/PROJECT.md` |
| TypeScript patterns (Result, GIDs, errors, Zod, fakes) | `.ai/TYPESCRIPT.md` |
| Term definitions | `.ai/GLOSSARY.md` |
| Engineering decision rationale | `.ai/DECISIONS.md` + `docs/adr/` |
| Feature intent, constraints, open questions | `feature-specs/<feature>/` (all 6 files) |
| Shopify surface → skill mapping | `.shopify/skills/registry.json` |
| Repo-specific Shopify skill rules | `.shopify/skills/guardrails/<skill>.md` |
| Workflow steps for a command | `.claude/commands/<cmd>.md` |
| Shared infrastructure templates | `.claude/templates/shared/` |

Never pre-load the whole repository. Token cost is proportional to context loaded.

## Entry commands

### Build commands
| Command | When to use |
|---|---|
| `/create-feature <name>` | Start a new feature: spec + domain scaffold + tracking files |
| `/create-repository <domain>: <aggregate>` | Add Prisma access for an aggregate |
| `/create-service <domain>: <use-case>` | Add application-layer use-case |
| `/add-route <domain>: <route>` | Add a Remix route + Polaris page |
| `/debug <description>` | Diagnose a failure methodically |
| `/review` | Pre-ship checklist |
| `/refactor` | Structural improvement without behavior change |

### Progress tracking commands
| Command | When to use |
|---|---|
| `/status <feature>` | See current progress, open bugs, and last session summary |
| `/status` | List all features and their status in one table |
| `/checkpoint <feature>` | End of session: update tracking files + write handoff note |

## Workflow chains (for multi-step tasks)

### Building
| Goal | Workflow |
|---|---|
| Build a feature end to end | `.claude/workflows/build-feature-end-to-end.md` |
| Pick up a specced feature and implement it | `.claude/workflows/implement-feature.md` |
| Add a Shopify Function | `.claude/workflows/add-shopify-function.md` |
| Add a webhook handler | `.claude/workflows/add-webhook.md` |
| Add a UI extension | `.claude/workflows/add-ui-extension.md` |
| Migrate the Prisma schema | `.claude/workflows/migrate-schema.md` |

### Debugging & testing
| Goal | Workflow |
|---|---|
| Fix a known bug | `.claude/workflows/fix-bug.md` |
| Write and run e2e tests | `.claude/workflows/run-e2e.md` |

### Recovery
| Goal | Workflow |
|---|---|
| Roll back or undo a feature | `.claude/workflows/rollback-feature.md` |

## Validation before done

```bash
npm run check   # architecture guard + typecheck + lint
```

The Stop hook in `.claude/settings.json` runs this automatically.
