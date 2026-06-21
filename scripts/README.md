# scripts/

- `check-architecture.mjs` — enforces layering from `.ai/ARCHITECTURE.md`
  (run via `npm run check`). Hard-fails on: Prisma outside repositories,
  inline GraphQL in routes, services importing Remix, files >300 lines, `any`
  types. Warns on potential missing shop-scoping in repository queries.

- `sync-skills.mjs` — verifies every skill in `.shopify/skills/registry.json`
  is installed as a symlink under `.claude/skills/`. Exits non-zero and prints
  install commands for any missing skills. Run via `npm run sync-skills`.

- `generate-adr.mjs` — creates a numbered ADR file in `docs/adr/` and adds a
  stub entry to `.ai/DECISIONS.md`. Usage:
  ```bash
  node scripts/generate-adr.mjs "short-title-as-slug"
  # e.g. node scripts/generate-adr.mjs "no-raw-sql-without-adr"
  ```
