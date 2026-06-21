# ARCHITECTURE.md — Layered Architecture

Four layers, strict dependency direction (top depends on down, never up):

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION   app/routes/**          Remix loaders/actions,  │
│                app/domains/*/components  Polaris UI            │
│   • parse & validate input    • call services    • shape output│
└───────────────┬─────────────────────────────────────────────┘
                │ calls
┌───────────────▼─────────────────────────────────────────────┐
│ APPLICATION    app/domains/*/services/**                      │
│   • use-case orchestration   • transactions   • policy checks │
└───────────────┬─────────────────────────────────────────────┘
                │ uses
┌───────────────▼─────────────────────────────────────────────┐
│ DOMAIN         app/domains/*/ (pure rules, schemas, types)    │
│   • business invariants  • Zod schemas  • domain types/errors │
└───────────────┬─────────────────────────────────────────────┘
                │ depends on abstractions
┌───────────────▼─────────────────────────────────────────────┐
│ INFRASTRUCTURE app/domains/*/repositories/**  (Prisma)        │
│                app/domains/*/graphql/**       (Shopify Admin) │
│                app/shared/lib/**              (clients)        │
└─────────────────────────────────────────────────────────────┘
```

## Dependency rules (enforced by `scripts/check-architecture.mjs`)

| Layer | May import | May NOT import |
|---|---|---|
| Route | services, schemas, shared/ui | `@prisma/client`, raw GraphQL strings |
| Service | repositories, graphql ops, domain, schemas | `@remix-run/*`, `@prisma/client` directly |
| Repository | `@prisma/client`, domain types | services, routes |
| GraphQL ops | generated types | services, routes, prisma |

## Why these boundaries

- **Testability** — services test with fake repositories; no DB or network.
- **Swap-ability** — Shopify API or Prisma changes stay in infrastructure.
- **Agent legibility** — given a task, the agent knows exactly which folder to
  open and which file to create. Less searching = fewer tokens, fewer mistakes.

## A request, end to end

1. `app/routes/app.<domain>.<view>.tsx` action → Zod-parse the incoming form or params.
2. → `<domain>.service.<useCase>(shop, input)`.
3. Service validates invariants (domain layer), persists via `<domain>.repository`,
   calls any Shopify Admin mutations in `<domain>/graphql/`.
4. Service returns a `Result`; route maps domain errors to HTTP responses.

No layer reaches around another. Each file does one job.
