# TYPESCRIPT.md — TypeScript Operating Guide

Load this when: writing services, schemas, repositories, or routes; reviewing
TypeScript correctness; or when AGENTS.md §4 isn't enough detail for the task.

---

## 1. Compiler baseline — what strict mode actually enforces here

All of these flags are on. Treat every compiler error as a logic error:

| Flag | Practical meaning |
|---|---|
| `strictNullChecks` | `undefined`/`null` aren't assignable without explicit handling |
| `noImplicitAny` | every binding must have an inferrable or explicit type |
| `strictFunctionTypes` | function params are checked contravariantly |
| `useUnknownInCatchVariables` | `catch (e)` gives `unknown`, not `any` — narrow before using |
| `noUncheckedIndexedAccess` | array/record index access returns `T | undefined` |

`// @ts-ignore` and `// @ts-expect-error` require an inline comment explaining
why. If you need more than one, the design is probably wrong.

---

## 2. Result<T, E> — services never throw for business failures

Every service method that can fail returns `Result<T, E>`, not `T | null` and
not a thrown error. `throw` is reserved for genuinely unrecoverable conditions
(infra down, programming bugs) — not for "bundle not found" or "invalid input."

```typescript
import { ok, err, type Result } from "~/shared/types/result";

async function createBundle(shop: string, raw: unknown): Promise<Result<Bundle>> {
  const parsed = bundleCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return err({ kind: "validation", issues: parsed.error.issues });
  }
  if (await repo.findByTitle(shop, parsed.data.title)) {
    return err({ kind: "conflict", message: "A bundle with this title already exists" });
  }
  const saved = await repo.save(shop, parsed.data);
  return ok(saved);
}
```

**The calling pattern — exhaust both branches:**

```typescript
const result = await bundleService.create(session.shop, formData);
if (!result.ok) {
  // TypeScript knows result.error is DomainError — narrow by result.error.kind
  return json({ error: result.error }, { status: 422 });
}
return json({ bundle: result.value });
```

Routes are the only layer that converts `Result` errors to HTTP responses.
Services return `Result`. Repositories return `T | null` (they don't make policy
decisions — not finding a record isn't an error at that layer).

---

## 3. Domain errors — discriminated unions, not Error subclasses

Base errors live in `app/shared/types/errors.ts`. Domain-specific variants are
defined in the domain's `schemas/` file and unioned into the service's return type.

```typescript
// app/shared/types/errors.ts
export type ValidationError  = { kind: "validation"; issues: ZodIssue[] };
export type NotFoundError    = { kind: "not-found"; resource: string; id: string };
export type ShopifyError     = { kind: "shopify"; userErrors: ShopifyUserError[] };
export type ConflictError    = { kind: "conflict"; message: string };
export type DomainError      = ValidationError | NotFoundError | ShopifyError | ConflictError;

// app/domains/bundles/schemas/bundle.schema.ts — extend, don't mutate shared
export type BundleInactiveError = { kind: "bundle-inactive"; bundleId: string };
export type BundleError = DomainError | BundleInactiveError;
```

Narrowing is exhaustive and compiler-checked:

```typescript
switch (error.kind) {
  case "validation":      return json({ fieldErrors: error.issues }, 422);
  case "not-found":       return json({ message: `${error.resource} not found` }, 404);
  case "shopify":         return json({ userErrors: error.userErrors }, 422);
  case "conflict":        return json({ message: error.message }, 409);
  case "bundle-inactive": return json({ message: "Bundle is no longer active" }, 422);
  // No default needed — TypeScript ensures exhaustiveness
}
```

---

## 4. Brand types for Shopify GIDs

A `string` for a `ProductVariant` GID is interchangeable with a `Product` GID at
the type level. Brand types make that a compile error:

```typescript
import type { GID } from "~/shared/lib/gid";

type ProductVariantGID = GID<"ProductVariant">;
type ProductGID        = GID<"Product">;

// This is a compile error — wrong GID type:
function lookupVariant(id: ProductVariantGID) { ... }
lookupVariant("gid://shopify/Product/123" as ProductGID); // ✗ type error
```

Use `gidSchema("ProductVariant")` in Zod schemas to validate and brand in one step.
Use the `gid(type, id)` helper to construct GIDs, never template literals.

```typescript
// ✗ Fragile — easy to typo, no type safety
const id = `gid://shopify/ProductVariant/${rawId}`;

// ✓ Typed and validated
import { gid } from "~/shared/lib/gid";
const id = gid("ProductVariant", rawId); // type: GID<"ProductVariant">
```

---

## 5. Zod — schemas drive types, never the reverse

There is one source of truth per domain type: the Zod schema. TypeScript types
are always derived via `z.infer<>`. Never write an interface by hand and then
build a Zod schema to match it — they will drift.

```typescript
// ✓ Schema-first
const bundleCreateSchema = z.object({
  title:         z.string().min(1).max(255),
  discountType:  z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number().positive(),
  components:    z.array(bundleComponentSchema).min(2),
});
export type BundleCreate = z.infer<typeof bundleCreateSchema>;

// ✗ Parallel definition — guaranteed to drift
interface BundleCreate { title: string; discountType: "PERCENTAGE" | "FIXED_AMOUNT"; ... }
const bundleCreateSchema = z.object({ title: z.string(), ... });
```

**Zod patterns specific to this stack:**

```typescript
// Coerce Shopify's string booleans from form data
active: z.string().transform(v => v === "true").pipe(z.boolean())

// Validated GID fields
variantId: gidSchema("ProductVariant")

// Nullable vs optional distinction
shopifyId: z.string().nullable()  // field exists but may be null
nickname: z.string().optional()   // field may not be present at all

// Transform at the boundary, not downstream
price: z.string().transform(Number).pipe(z.number().positive())
```

---

## 6. Prisma — map at the repository boundary, don't leak the model

Repositories return domain types, not raw Prisma models. `@prisma/client` is
imported in exactly one place per aggregate (the repository). Services and
routes never see a Prisma shape.

```typescript
// ✗ Leaks Prisma model — service now implicitly depends on @prisma/client
async findById(shop: string, id: string): Promise<Prisma.Bundle | null>

// ✓ Returns domain type — decoupled from persistence
async findById(shop: string, id: string): Promise<Bundle | null> {
  const row = await prisma.bundle.findFirst({ where: { id, shop } });
  if (!row) return null;
  return bundleSchema.parse(row); // validate + map at the edge
}
```

For complex `select` / `include` shapes, use `Prisma.BundleGetPayload<{...}>`
internally in the repository, then strip it at the return boundary.

---

## 7. Remix typing — loaders, actions, components

```typescript
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const bundles = await bundleService.list(session.shop);
  return json({ bundles });
}

// useLoaderData<typeof loader> gives the exact return type — no manual annotation
export default function BundlesPage() {
  const { bundles } = useLoaderData<typeof loader>();
}
```

For actions that can succeed or fail, return a discriminated union with `as const`
so the component can safely narrow on `data.ok`:

```typescript
export async function action({ request }: ActionFunctionArgs) {
  // ...
  if (!result.ok) return json({ ok: false, error: result.error } as const, 422);
  return json({ ok: true, bundle: result.value } as const);
}

// In the component:
const fetcher = useFetcher<typeof action>();
if (fetcher.data?.ok === false) {
  // fetcher.data.error is typed as DomainError
}
```

---

## 8. Service factory pattern — typed dependency injection

Services use factory functions, not classes. Dependencies are typed via an
interface so fakes satisfy them at compile time:

```typescript
// The interface — this is what callers depend on
export interface BundleServiceDeps {
  repo:    BundleRepository;   // interface, not the concrete factory return type
  graphql: AdminGraphqlClient;
}

export function createBundleService({ repo, graphql }: BundleServiceDeps) {
  async function create(shop: string, raw: unknown): Promise<Result<Bundle, BundleError>> { ... }
  async function list(shop: string): Promise<Bundle[]> { ... }
  return { create, list };
}

// Expose the service type — consumers annotate with this, not the factory
export type BundleService = ReturnType<typeof createBundleService>;
```

---

## 9. Typing test fakes

Fakes satisfy the repository interface structurally. If the real repository adds
a method, every test fake missing that method is a compile error:

```typescript
import type { BundleRepository } from "~/domains/bundles/repositories/bundle.repository";

// In a test — fake must satisfy BundleRepository exactly
const fakeBundleRepo: BundleRepository = {
  findById:    vi.fn().mockResolvedValue(null),
  save:        vi.fn().mockImplementation(async (_shop, data) => ({ ...data, id: "t1", shop: "test.myshopify.com" })),
  listByShop:  vi.fn().mockResolvedValue([]),
};

// Usage
const service = createBundleService({ repo: fakeBundleRepo, graphql: fakeGraphql });
```

Never `as unknown as BundleRepository` — it defeats the purpose.

---

## 10. Type guards over type assertions

```typescript
// ✗ Assertion — bypasses the compiler
const gid = rawValue as GID<"ProductVariant">;

// ✓ Guard — verified at runtime, then typed
function isProductVariantGID(v: string): v is GID<"ProductVariant"> {
  return /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(v);
}
if (isProductVariantGID(rawValue)) {
  // rawValue is GID<"ProductVariant"> here
}
```

`as` is allowed in: Zod `.transform()` callbacks, codegen output files, and
the internals of typed helpers (`gid.ts`, `result.ts`). Document every use.

---

## 11. `satisfies` — object literal type safety without widening

```typescript
// satisfies checks the type but preserves the literal types of the values
const METAFIELD_KEYS = {
  active: "bundles.active",
  config: "bundles.config",
} satisfies Record<string, string>;

// METAFIELD_KEYS.active is typed as the literal "bundles.active", not string
// — safe to use in a lookup table or pass to a typed function
```

Use for config objects, lookup tables, and registry-style constants.

---

## 12. What to avoid

| Pattern | Why | Use instead |
|---|---|---|
| `as SomeType` on untrusted data | bypasses runtime safety | Zod `.parse()` / `.safeParse()` |
| `!` non-null assertion | hides null bugs | conditional check, `?.`, or Zod `.refine()` |
| `any` | turns off all checking | `unknown` + type guard or `z.unknown()` |
| Hand-written interfaces for domain types | drifts from Zod schema | `z.infer<typeof schema>` |
| `throw` in service layer | callers can't type-check the error | `return err({ kind: "..." })` |
| `object` as a type | too broad, accepts anything | `Record<string, unknown>` or a concrete shape |
| Unnecessary generics | complexity tax | write concrete types first; extract only when N≥3 call sites exist |
| Implicit `any` from `JSON.parse()` | no validation | `z.parse()` on the raw output |
| String enums | runtime overhead, enum weirdness | `z.enum([...])` + `z.infer<>` |
