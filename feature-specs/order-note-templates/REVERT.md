# REVERT — Order Note Templates

Recovery plan for undoing this feature. Agent: **fill this in as you
implement** — each time you run a migration, create a Shopify resource, or
register a webhook, add a row to the relevant section below.

A git revert only undoes code. It does NOT undo database migrations or created
Shopify resources.

---

## Git

```
Branch  : 
Base    : <sha of the commit before this feature started>
Commits : <first sha>..<last sha>

# Undo option A — revert (safe, keeps history):
git revert <first sha>..<last sha>

# Undo option B — reset to base (destructive — confirm with team before running):
git reset --hard <base sha>
```

---

## Prisma migrations

Agent: add one row per `prisma migrate dev` run. Leave empty if no migrations.

| Migration name | Date added | Rollback command |
|---|---|---|

```bash
# To roll back a migration (run after reverting schema.prisma via git):
npx prisma migrate resolve --rolled-back <migration-name>

# Dev only — drops all data:
# npx prisma migrate reset   ← NEVER on staging/production
```

---

## Shopify resources created

Agent: add one row per resource the app creates in a Shopify store. These are
NOT reversed by a git revert. Leave empty if no resources are created.

| Resource type | ID / identifier | How to delete |
|---|---|---|

---

## Config changes

Agent: list any `shopify.app.toml`, `.env`, or Partner Dashboard changes.
Leave empty if none.

- *(none)*

---

## Cleanup checklist

- [ ] Git commits reverted or branch deleted
- [ ] Prisma migrations rolled back (if any)
- [ ] Shopify resources deleted (if any)
- [ ] Config changes reverted and redeployed
- [ ] `npm run check` passes on main after rollback
