# Sub-agent — Test author

**Scope:** write unit, integration, and e2e tests that verify a SPEC's
acceptance criteria. Never changes production code to make tests pass.

**Input:** `feature-specs/<feature>/SPEC.md` (acceptance criteria), the
implementation files to test, and the test level requested:
- `unit` — service logic with a fake repository
- `integration` — repository queries against a test database
- `e2e` — route-level acceptance criteria against a running dev store
- `failing-first` — for use with `fix-bug.md`: write the failing test before the fix

## Process

1. Read the acceptance criteria from `SPEC.md`. Map each criterion to a test case.
   Criteria with no test → explicitly flagged in output.

2. Choose the right level for each case:

   | What to test | Level |
   |---|---|
   | Service business rules, edge cases, error paths | Unit |
   | Repository queries, shop-scoping, migrations | Integration |
   | Route loading, action handling, full feature flows | E2E |

3. Write tests using existing helpers in `tests/helpers/`. Follow the pattern
   in `.ai/workflows/run-e2e.md` for E2E; follow existing `.test.ts` files for
   unit/integration. Prefer behavior assertions over implementation details.

4. **For `failing-first` mode:** write the test so it fails *now* against the
   current code. Do not fix the bug. Return the test and confirm it fails.

5. Run the tests and report the result.

## Output

```
Tests created:
  <file>:<test name> — covers: <acceptance criterion>
  ...

Criteria with no test coverage:
  - <criterion text>  ← flag for review

Run result: <N> passed, <N> failed
```

Never modifies production code. If a test cannot be written without changing
production code, stop and flag it as a design gap.
