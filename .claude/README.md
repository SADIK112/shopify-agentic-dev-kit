# .claude/ — Claude Code Runtime Config

This directory contains only Claude Code-specific runtime configuration.
It is intentionally minimal.

## What's here

| File / Dir | Purpose |
|---|---|
| `settings.json` | Stop hook (runs `npm run check` on task end) + permission rules |
| `skills/` | Symlinks to installed Shopify Agent Skills (`npx skill install`) |

## Where the content moved

Commands, workflows, sub-agents, and templates used to live here. They have
been moved to `.ai/` so all platforms can use them without loading a
Claude Code-named directory:

| Was | Now |
|---|---|
| `.claude/commands/` | `.ai/commands/` |
| `.claude/workflows/` | `.ai/workflows/` |
| `.claude/agents/` | `.ai/agents/` |
| `.claude/templates/` | `.ai/templates/` |

## Skill management

```bash
npx skills add Shopify/shopify-ai-toolkit   # install or update all skills
node scripts/sync-skills.mjs                # verify symlinks are present
```

Skill payloads are not committed — see `docs/adr/` ADR 0006.
