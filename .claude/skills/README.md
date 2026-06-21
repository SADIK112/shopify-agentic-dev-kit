# .claude/skills/ — Installed Skill Symlinks

This directory contains **symlinks** to Shopify Agent Skill payloads installed
by the Shopify AI Toolkit. Each symlink points to a skill's `SKILL.md` (or its
directory) in the agent's local skill store (e.g. `~/.agents/skills/<name>`).

## Why symlinks, not copies

Skills are generated upstream and auto-update through the Toolkit plugin.
Copying (vendoring) them would freeze a stale snapshot — exactly what causes
API hallucination. Symlinks let the Toolkit update skills in one place while
this repo always resolves to the current version. See ADR 0006.

## What's here

```
shopify-admin               → installed skill payload
shopify-custom-data         → installed skill payload
shopify-functions           → installed skill payload
shopify-polaris-app-home    → installed skill payload
... (one symlink per registered skill)
```

## How skills are verified

```bash
npm run sync-skills
```

This checks that every skill listed in `.shopify/skills/registry.json` has a
symlink (or directory) in this folder and exits non-zero if any are missing.

## Adding a new skill

```bash
npx skill install <skill-name>
# The Toolkit creates the symlink here automatically.
npm run sync-skills   # verify it appears
```

## Do not commit skill content

`skills-lock.json` tracks hash fingerprints for reproducibility. The skill
payloads themselves are excluded by `.gitignore`.
