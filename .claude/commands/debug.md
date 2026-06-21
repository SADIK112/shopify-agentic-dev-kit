# /debug — diagnose a failure methodically

> **Always-on rules** (from `.ai/AGENTS.md`): search before writing · reuse
> existing patterns · no duplication · skill-gate every Shopify surface · routes
> thin · Prisma only in repositories · GraphQL-first · validate before done.

## Steps
1. **Reproduce.** State the exact command/route/input and the observed vs
   expected behavior. Capture the real error text — don't paraphrase from memory.
2. **Localize by layer.** Decide if it's presentation, application, domain, or
   infrastructure using `.ai/ARCHITECTURE.md`. Read the *smallest* relevant
   files — don't load the whole domain.
3. **Shopify-specific checks** (if applicable):
   - GraphQL error → validate the op with the `shopify-admin` skill; check for
     deprecated fields and missing access scopes.
   - Webhook not firing → HMAC + subscription in `shopify.app.toml` + public URL.
   - Function misbehaving → validate against the *Function* schema, check input
     query and determinism.
4. **Form one hypothesis, test it.** Add a focused failing test that captures the
   bug before fixing.
5. **Fix at the right layer.** Don't patch a symptom in a route if the cause is a
   service/repository.
6. **Record** anything non-obvious in the feature's `NOTES.md` or an ADR.

## Done when
The failing test now passes, `npm run check` is green, and the root cause (not
just the symptom) is addressed.
