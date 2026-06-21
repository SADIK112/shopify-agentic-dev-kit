# BUGS — {{Feature Name}}

Per-feature bug log. Agent: add an entry the moment you discover a bug during
implementation or QA. Do not silently fix and move on — the log is the record.

Link bug entries to `NOTES.md` for investigation detail and to the commit/PR
that fixed them.

---

## Open

To add a bug, copy this block and fill it in:

```
### Bug: <short imperative title>
**Status:** open | investigating | fix-in-progress
**Discovered:** YYYY-MM-DD
**Symptom:** What was observed (exact error, wrong value, unexpected behavior).
**Reproduction:**
  1. ...
  2. ...
**Layer:** presentation | application | domain | infrastructure | Shopify Function | UI extension
**Root cause hypothesis:** (leave blank until investigated)
**Linked NOTES entry:** (date of the matching NOTES.md session log entry)
```

---

## Closed

When a bug is fixed, move its entry here and trim to a one-liner after a week:

```
### Bug: <title>
**Fixed:** YYYY-MM-DD  **In:** <commit sha | PR #>  **Root cause:** one sentence
```
