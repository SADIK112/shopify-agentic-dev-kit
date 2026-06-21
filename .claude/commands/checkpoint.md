# /checkpoint — save current progress and write a handoff note

Use at the end of a working session, before a context reset, or any time you
want a clean "save point" that another agent (or this one after reset) can
resume from without re-reading the whole codebase.

> **Input:** feature name (e.g. `/checkpoint <your-feature>`)

## Steps

### 1. Collect the current state

Load **only** these files:
- `feature-specs/<feature>/TODO.md` — identify every item that changed status
  this session (newly checked items)
- `feature-specs/<feature>/BUGS.md` — note any new bugs opened or closed
- `feature-specs/<feature>/REVERT.md` — check if any new migrations or Shopify
  resources were created that aren't recorded yet

### 2. Update tracking files (if anything is missing)

- In `TODO.md`: confirm all completed items are checked. Update the `Status:`
  line if the phase changed (e.g. spec → in-progress → review).
- In `BUGS.md`: move any bugs fixed this session from Open → Closed. Add any
  newly discovered bugs to Open.
- In `REVERT.md`: add rows for any Prisma migrations run or Shopify resources
  created this session that aren't listed yet.

### 3. Append a session log entry to NOTES.md

Add a new `### YYYY-MM-DD` block under `## Session log` with:
- **Done this session**: bullet list of TODO items completed.
- **Next up**: the next 1–3 unchecked items from `TODO.md`.
- **Blockers / open questions**: anything preventing progress; any `TODO(human):`
  questions that need input.
- **Relevant files touched**: key file paths changed this session.

Keep the entry under 15 lines.

### 4. Optionally commit the checkpoint

If the working tree has staged or unstaged changes worth saving:
```bash
git add feature-specs/<feature>/
git add app/domains/<domain>/       # only the domain folder
git commit -m "wip(<feature>): checkpoint — <one-line summary of session>"
```
WIP commits are squashed before merging. Do **not** force-push if this branch
is shared.

### 5. Print a one-line summary

```
✓ Checkpoint saved for <feature>.
  Next up: <next TODO item>
  Blockers: <none | description>
```

## Done when
`NOTES.md` has a new session log entry and all tracking files are up to date.
