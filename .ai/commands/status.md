# status — show current feature state

> **Input:** feature name (e.g. `status <your-feature>`). If omitted, list all
> features and their status line.

Produces a concise status card for a feature. Reads the tracking files; does
NOT load domain code or run any scripts.

## Steps

1. **Load** (in order, loading only these files):
   - `feature-specs/<feature>/TODO.md` — current STATUS line + phase checkboxes
   - `feature-specs/<feature>/BUGS.md` — count open bugs; list their titles
   - `feature-specs/<feature>/NOTES.md` — last "Session log" entry only
   - `feature-specs/<feature>/SPEC.md` — acceptance criteria checklist only
     (the `## Acceptance criteria` section)

2. **If no feature name given:** scan `feature-specs/` for all folders; for each
   read only the `STATUS:` line from `TODO.md`. Output a two-column table:
   feature → status. Stop there.

3. **Output the status card** — keep it under 25 lines:

```
Feature : <name>
Status  : <status from TODO.md>

Progress (<X>/<Y> TODO items done):
  Spec phase        ✓ / ○  (check each item)
  Implementation    ✓ / ○
  Verification      ✓ / ○

Acceptance criteria (<X>/<Y> checked in SPEC.md)

Open bugs (<N>):
  - <title>
  - <title>

Last session (<date from NOTES.md session log>):
  Done    : <done this session>
  Next up : <next unchecked TODO items>
  Blockers: <if any>
```

4. **If any TODO items or acceptance criteria are unresolved and Status = "done"**,
   flag it: `⚠ Status is "done" but N item(s) remain unchecked.`

## Done when
The card is printed. Do not modify any files during `status`.
