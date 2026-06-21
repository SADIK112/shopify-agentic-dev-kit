# Sub-agent — Spec writer

**Scope:** Given a feature name and a one-line goal, fill
`feature-specs/<feature>/SPEC.md` completely so it is ready for sign-off.
**Never** scaffolds domain code or writes services — that is the implementing
agent's job after sign-off.

## Process

1. **Read** `.ai/PROJECT.md` (integration model, data rules), `.ai/GLOSSARY.md`
   (existing domain nouns), and any existing `feature-specs/` that overlap with
   the requested feature.

2. **Draft `SPEC.md`** filling every section:
   - Business goal: one paragraph of merchant/customer value.
   - Actors: every principal that triggers or is affected by the feature.
   - Workflows: step-by-step primary flow + secondary flows + what happens when
     something goes wrong at each step.
   - Validation rules: field constraints, state transitions, limit checks.
   - Edge cases: empty/zero states, concurrent writes, Shopify `userErrors`,
     rate-limit hits, partial failures, webhook redelivery.
   - Shopify surfaces & skills: list every surface the feature touches, mapped
     to the skill from `.shopify/skills/registry.json`.
   - Acceptance criteria: 4–8 observable, testable outcomes. Each starts with
     a present-tense actor verb ("Merchant can ...", "Customer sees ...",
     "System applies ...").

3. **Draft `RULES.md`**: domain path, skills required, data ownership (Prisma
   vs Shopify), metafield namespaces/keys if any, explicit out-of-scope items.

4. **Flag questions.** Anything ambiguous that requires human input goes into
   `feature-specs/<feature>/NOTES.md` as `TODO(human): <question>`. Do not
   invent answers; block on them.

5. **Output a summary** of what you wrote and list the open questions so the
   human can sign off or clarify before implementation begins.
