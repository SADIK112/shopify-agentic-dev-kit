# /create-feature — scaffold and plan a feature

> **Always-on rules** (from `.ai/AGENTS.md`): search before writing · reuse
> existing patterns · no duplication · skill-gate every Shopify surface · routes
> thin · Prisma only in repositories · GraphQL-first · validate before done.

**Input:** a feature name and a one-line goal.

## Steps
1. **Search first.** Grep for the feature noun and adjacent concepts across
   `app/domains/`, `feature-specs/`, and `.ai/GLOSSARY.md`. If something similar
   exists, extend it — do not create a parallel implementation.
2. **Create** `feature-specs/<feature-name>/` from `.claude/templates/feature/`.
   Scaffold all six tracking files:
   - `SPEC.md` — fill fully (goal, actors, workflows, validation, edge cases, acceptance criteria)
   - `RULES.md` — domain, skills, data ownership, out of scope
   - `TODO.md` — set Status: `speccing`; leave all boxes unchecked until plan is confirmed
   - `NOTES.md` — leave section headers; add the first entry: today's date + one-line goal
   - `BUGS.md` — leave empty (open/closed sections only); do not pre-populate
   - `REVERT.md` — leave scaffolded; agent fills it in during implementation
3. **Decide the domain.** Map the feature to a new or existing
   `app/domains/<domain>/`. If new, scaffold it from
   `.claude/templates/domain/` (services/ repositories/ schemas/ graphql/
   components/ tests/ + local `AGENTS.md`).
4. **Identify Shopify surfaces.** From `SPEC.md`, list every Shopify surface the
   feature touches and the matching skill via `.shopify/skills/registry.json`.
   Note them in `RULES.md`.
5. **Glossary.** Add any new domain nouns to `.ai/GLOSSARY.md`.
6. **Plan, don't build yet.** Output: the files you'll create, the layer each
   belongs to, and the skills you'll invoke. Wait for confirmation before
   implementing unless told to proceed.

## Done when
`feature-specs/<feature-name>/SPEC.md` is complete, the domain folder exists, and the
skill list is recorded. No business code written until the plan is acknowledged.
