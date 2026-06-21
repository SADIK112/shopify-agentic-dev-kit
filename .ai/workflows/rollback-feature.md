# Workflow — Roll Back a Feature

Use when a feature needs to be undone — either fully (the feature is cancelled)
or partially (a specific bad commit needs reverting while keeping earlier work).

Read `feature-specs/<feature>/REVERT.md` first. If it is empty or incomplete,
the agent must reconstruct the revert plan from git history before proceeding.

## ⚠ Before touching anything

This workflow is destructive in several ways:
- Prisma rollbacks can lose data in non-dev environments.
- Shopify resource deletions cannot be undone from the app; a human may need to
  re-create them via the Partner Dashboard.
- Confirm the scope with the team before running any step beyond Step 1.

---

## Step 1 — Understand the scope

Load `feature-specs/<feature>/REVERT.md`. If it exists and is filled in, that
is your primary guide. If not, reconstruct:

```bash
# Find commits for this feature branch
git log --oneline main..HEAD

# Find which files changed
git diff --name-only main...HEAD
```

Answer these questions before proceeding:
- Which commits are feature-only vs mixed with other work?
- Were any Prisma migrations added? (check `prisma/migrations/`)
- Were any Shopify resources created? (check REVERT.md or the service that
  registers them)
- Is this a full rollback or a targeted revert of one commit?

---

## Step 2 — Roll back the code

### Option A: Revert specific commits (safe — keeps history)

```bash
# Revert a range (newest first to avoid conflicts):
git revert <newest-sha> <older-sha> ...

# Or revert a merge commit:
git revert -m 1 <merge-sha>
```

### Option B: Reset to base (only for branches not yet merged to main)

```bash
# Identify the base commit (last commit before this feature)
git log --oneline | grep -v "wip\|feat(<feature>)"

git reset --hard <base-sha>
# Force-push only if the branch is yours alone and not shared:
git push --force-with-lease origin <branch>
```

---

## Step 3 — Roll back Prisma migrations

Do this **after** reverting the schema.prisma changes in Step 2.

```bash
# For each migration added by this feature (reverse order):
npx prisma migrate resolve --rolled-back <migration-name>

# Then push the resolved state:
npx prisma db push   # or re-run migrate deploy on the target env
```

**Dev only — nuclear option** (drops all data, recreates from current schema):
```bash
npx prisma migrate reset   # NEVER on staging/production
```

Verify the database matches the rolled-back schema:
```bash
npx prisma db pull   # should show no drift
```

---

## Step 4 — Clean up Shopify resources

Resources in `REVERT.md → Shopify resources created` must be deleted via Admin
API. They are NOT removed by a git revert.

For each entry, run the corresponding mutation via the Shopify Admin API
Explorer at `partners.shopify.com`, your store's GraphQL client, or the
`shopify-admin` skill on Claude Code:

| Resource | Delete mutation |
|---|---|
| Discount (automatic/code) | `discountAutomaticDelete` / `discountCodeDelete` |
| Webhook subscription | `webhookSubscriptionDelete` |
| Metafield definition | `metafieldDefinitionDelete` |
| Function (via app) | Redeploy with the extension removed: `shopify app deploy` |

Confirm deletion by querying the resource — do not assume success from the
mutation response alone.

---

## Step 5 — Revert config changes

If `shopify.app.toml` was changed (webhook topics, extension targets, access
scopes):
```bash
git checkout main -- shopify.app.toml
shopify app deploy   # redeploy the reverted config
```

---

## Step 6 — Verify

```bash
npm run check    # architecture + typecheck + lint must pass
npm test         # all tests must pass
npm run sync-skills  # skills still installed
```

Manually verify the feature surface is gone from the dev store.

---

## Step 7 — Update tracking files

- `feature-specs/<feature>/TODO.md` → set Status: `reverted`
- `feature-specs/<feature>/NOTES.md` → append a session log entry documenting
  what was rolled back, why, and the date.
- `feature-specs/<feature>/REVERT.md` → check off each cleanup step.
