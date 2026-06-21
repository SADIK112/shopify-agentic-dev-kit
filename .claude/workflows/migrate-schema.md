# Workflow — Migrate the Prisma Schema

Prisma migrations in a multi-tenant Shopify app are high-risk: every new row
type must be shop-scoped, and every column change can silently break queries
across all tenants. Follow this workflow in full.

## 1. Define the change in `prisma/schema.prisma`

- New model? It **must** include a `shop String` field unless it is a truly
  global record (sessions, platform config). Leave a comment if omitting shop.
- Renaming a column? Never rename in place on a live table — add the new column,
  backfill, then deprecate the old one in a follow-up migration.
- Adding a NOT NULL column? Provide a default or a migration-time backfill. An
  empty NOT NULL column breaks existing rows.

## 2. Generate the migration

```bash
npx prisma migrate dev --name <slug-describing-change>
# e.g. npx prisma migrate dev --name add-order-status
```

Review the generated SQL in `prisma/migrations/<timestamp>_<slug>/migration.sql`
before accepting. Confirm:
- No `DROP COLUMN` or `DROP TABLE` unless intentional and irreversible.
- `ALTER TABLE ... ADD COLUMN NOT NULL` has a default or runs a prior backfill.
- Foreign keys target the right table and ON DELETE behavior is correct.

## 3. Verify multi-tenant shop-scoping

Run the architecture check — it will warn on repository queries that may be
missing `shop`:

```bash
npm run check
```

Search for new model name in repository files and confirm every `findMany` /
`findFirst` includes `where: { ..., shop }`. Use the `// shop-scope-exempt`
marker only for globally-shared records, and only after explicit review.

## 4. Update or create the repository

If the migration adds a new aggregate, run `/create-repository <domain>: <Aggregate>`.
If it adds columns to an existing aggregate, update the repository's methods and
its TypeScript return types.

## 5. Run integration tests

```bash
# Migrate the test database, then run repository integration tests.
DATABASE_URL=<test-db-url> npx prisma migrate deploy
npm test -- --testPathPattern=repositories
```

## 6. Document

- If the migration is a consequence of a feature, update the feature's `TODO.md`.
- If it introduces a non-obvious pattern (e.g. a soft-delete column, a JSON
  blob column with a specific schema), add an ADR:
  ```bash
  node scripts/generate-adr.mjs "why-we-chose-this-pattern"
  ```
