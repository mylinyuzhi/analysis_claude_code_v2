# Agent specs (reference data, NOT workflows to run)

These two files were originally written as `Workflow` scripts. **The Workflow tool is no longer used
for this project** — see `../../../todo.md` for why (concurrency cap 2 on this 4-core box, an `args`
marshalling bug, a fork-adoption failure, and all-or-nothing 529 storms).

They are kept because their **data** is the most valuable part: for every module theme they hold a
`docs` list (which documents to write and what each covers), a `seed` string (anchors already verified,
with 220/193 counts), and boundary notes saying which sibling module owns an overlapping bullet.

## How to use them when resuming

Read the file, find the entries you need, and **convert each one into a `Agent` tool prompt**. Launch
them as parallel `Agent` calls in a single message — this ran 9 concurrent in ~45 min, versus ~3 h for
the same work under `Workflow`.

| File | Contents |
|---|---|
| `module_specs.js` | 27 module entries in a `MODULES` array. Filter by `group`: `'A'` and `'B'` are **done**; **`'C'` is the 9 remaining breadth modules**. Each entry has `dir`, `themes`, `symbolSuffix`, `title`, `docs[]`, `seed`, `minDocs`. |
| `byversion_specs.js` | A `SLICES` array of 14 balanced release slices covering all 25 published versions, plus the full per-file prompt (release narrative + 100%-coverage per-bullet ledger + deep-dives + "what the changelog does not say"). |

The shared contract every module agent must read first is `../_MODULE_TASK_BRIEF.md`; keep pointing
agents at it so per-agent prompts stay short.
