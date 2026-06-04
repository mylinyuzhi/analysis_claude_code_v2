# Cross-Validation Report — Module 30_agent_team

- **Module:** 30_agent_team (Agent Team / Swarm — in-process vs cross-process pane teammates, the BackendRegistry executor split, file mailbox IPC, lifecycle tools, permission bridge)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/30_agent_team`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/00_overview/symbol_additions_v2_1_156_agent_team.md`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **v2.1.88 xval source:** `/lyz/codespace/3rd/claude-code/src` (named TypeScript, ~v2.1.83-88 snapshot)
- **v2.1.142 cross-tree:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.142/analyze/30_agent_team/`
- **Markdown files scanned:** 6 (README.md + 5 deep-dives) + 1 additions file

---

## C1 — Symbol existence (citation spot-checks)

A representative sample of **27 obfuscated symbols** cited across the module docs was opened at its cited
line in the 2.1.156 bundle and confirmed to be the declaration the docs claim. Every line below was read
directly via `sed -n '<line>p'` against the bundle.

- PASS: 27
- FAIL: 0

| Symbol | Cited line | Verified declaration at that line | Verdict |
|--------|-----------|-----------------------------------|---------|
| `Ru5` | 240763 | `function Ru5()` — `--agent-teams` flag check | PASS |
| `R7` | 240766 | `function R7()` — master gate; body matches verbatim (env/flag AND `tengu_amber_flint`) | PASS |
| `ma` | 381076 | `function ma(H = NS)` — isInProcessEnabled switch | PASS |
| `NT_` | 381098 | `async function NT_(H = !1, $ = NS)` — getTeammateExecutor dispatch | PASS |
| `jLH` | 380965 | `async function jLH(H = NS)` — detectAndGetBackend | PASS |
| `R94` | 380912 | `var R94 = {}` — BackendRegistry export map | PASS |
| `y94` | 380930 | `function y94()` — createBackendRegistry factory | PASS |
| `NS` | 381118 | `var NS;` — globalBackendRegistry decl (assigned `NS = y94()` @381129, also cited) | PASS |
| `K94` | 380062 | `class K94` — InProcessBackend | PASS |
| `L94` | 380388 | `class L94` — PaneBackendExecutor | PASS |
| `JT_` | 379714 | `async function JT_(H)` — runInProcessTeammate | PASS |
| `DT_` | 379637 | `async function DT_(H, $, q, K, _, z, A)` — 7-arg poll loop (7th = `standalone`) | PASS |
| `CW8` | 381458 | `async function CW8(H, $)` — spawnInProcessTeammate | PASS |
| `bW8` | 381513 | `function bW8(H, $, q)` — killInProcessTeammate (3-arg, taskRegistry form) | PASS |
| `aA` | 338306 | `async function aA(H, $, q)` — writeToMailbox | PASS |
| `jhH` | 338272 | `function jhH(H, $)` — getInboxPath | PASS |
| `JG$` | 338333 | `async function JG$(H, $, q)` — markMessageAsReadByIndex | PASS |
| `h_H` | 338286 | `async function h_H(H, $)` — readMailbox | PASS |
| `jU6` | 379421 | `var jU6 = \`` — TEAMMATE_SYSTEM_PROMPT_ADDENDUM template literal | PASS |
| `OT_` | 379430 | `function OT_(H, $, q, K)` — createTeammateCanUseTool (permission bridge) | PASS |
| `VsH` | 338516 | `function VsH(H)` — createShutdownRequestMessage | PASS |
| `NXH` | 338554 | `function NXH(H)` — isShutdownRequest | PASS |
| `U57` | 216435 | `U57 = new Set([SL, nd, Y0, rT, cf, rP, dI, bJ$])` — SWARM_TOOL_SET | PASS |
| `rd`/`Oo`/`cf` | 216438/216439/216283 | `"TeamCreate"` / `"TeamDelete"` / `"SendMessage"` name constants | PASS |
| `Th_`/`vh_`/`Bh_` | 406631/406775/407447 | `yK({...})` tool defs (TeamCreate/TeamDelete/SendMessage) | PASS |
| `X94`/`WT$`/`PT_` | 380309/380336/380350 | `function X94(H)` / `function WT$()` / `PT_ = [` — CLI/env builders + passthrough | PASS |
| `ZU6`/`TU6` | 380545/380820 | `class ZU6` (TmuxBackend) / `class TU6` (ITermBackend) | PASS |
| `cI`/`Bp`/`Mk5` | 216440/216460/216463 | `function cI()` / `function Bp()` / `function Mk5()` — coordinator gate | PASS |
| `x94`/`LJ`/`FA`/`fT_` | 381573/238588/99280/380022 | helper-module map / isInProcessTeammateTask / isTeammate / `var fT_ = 500` | PASS |

(The table lists 27 *distinct verification rows*; several rows verify a small constant cluster read in a
single batch, e.g. the three tool-name constants, the three tool defs.)

---

## C2 — Line/symbol pairing & body-level spot-checks

Beyond "the declaration exists at the line," six bodies were read in full and matched against the prose:

- **`R7` (master gate) @240766-240770** — body is verbatim
  `if (!xH(env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !Ru5()) return !1; if (!V$("tengu_amber_flint", !0)) return !1; return !0;`
  — exactly the two-layer (opt-in AND GrowthBook-default-true) gate the docs describe. PASS.
- **`fT_` @380022** — literally `var fT_ = 500;` — confirms the 500 ms poll interval cited in three docs. PASS.
- **`IH` @9111** — `function IH(H,$,q){ ... return JSON.stringify(H,$,q); }` — confirms the `IH→jsonStringify`
  mapping used by the mailbox/terminate snippets. PASS.
- **Coordinator env set/clear @216471-216475** — `process.env.CLAUDE_CODE_COORDINATOR_MODE = "1"` / `delete …`
  is present, proving the gate is *actively written*, not a dead `return false` stub. PASS (supports the
  coordinator-mode re-introduction finding in `cross_validation.md`: absent in v2.1.142, live in v2.1.156).
- **`Dk5` @216506** — `function Dk5()` (getCoordinatorSystemPrompt) exists — confirms the live coordinator
  session-role prompt path. PASS.
- **`NS` assignment @381129** — `NS = y94();` confirms the singleton is built from the factory at module init,
  validating the "one registry per process" claim. PASS.

- PASS: 6
- FAIL: 0

---

## C3 — Forbidden mapping-table scan (module docs)

Per project rule, the four core deep-dives + README must use **list format** for symbol references; only
`symbol_index_*`, `symbol_additions_*`, and `cross_validation_report_*` files may carry mapping tables. A
mode-comparison table or a tmux-color table is allowed; an `obfuscated | readable` mapping table is not.

A grep for markdown table-separator rows (`^\s*\|[-: ]+\|`) across the 5 module docs that must obey the rule:

| File | Tables found | Kind | Verdict |
|------|--------------|------|---------|
| `README.md` | 1 (lines 12-13) | **MODE-comparison** (In-process vs Cross-process columns) | ALLOWED |
| `execution_modes_and_backend_registry.md` | 0 | — | CLEAN |
| `in_process_mode.md` | 0 | — | CLEAN |
| `cross_process_mode.md` | 1 (line ~779) | **Aspect comparison** (in-process vs pane lifecycle) | ALLOWED |
| `mailbox_and_lifecycle_tools.md` | 0 | — | CLEAN |

`cross_validation.md` carries the v2.1.156→v2.1.88 mapping tables **by deliberate exception** (it is a
verification ledger, the same class as the `00_overview/` reports, and it states this exception explicitly at
the top). That is sanctioned.

**Result: NO forbidden `obfuscated|readable` mapping table in any of the 4 core docs or the README.** Both
tables present are comparison matrices the task brief explicitly permits.

---

## C4 — Broken relative-link sweep

Every relative markdown link target in all 6 docs was resolved against the filesystem (anchors stripped):

- **Sibling links** (`./README.md`, `./in_process_mode.md`, …, and bare `README.md` form in
  `mailbox_and_lifecycle_tools.md`): all resolve. PASS.
- **Overview links** (`../00_overview/symbol_index_*.md`, `../00_overview/symbol_additions_v2_1_156_agent_team.md`):
  all four symbol-index files + the additions file exist. PASS.
- **Cross-tree link** (`cross_validation.md` → `../../../claude_code_v_2.1.142/analyze/30_agent_team/README.md`):
  depth verified — from `…/2.1.156/analyze/30_agent_team/` three `../` reach the
  `…/analysis_claude_code_v2/` root, then `claude_code_v_2.1.142/analyze/30_agent_team/README.md` exists.
  PASS.

- Links checked: 51 (deduplicated)
- Broken: 0

Note: `cross_process_mode.md`'s "See Also" lists three of its siblings as *plain text* (not links) — cosmetic,
not a broken link.

---

## C5 — Code-snippet header & fence integrity

- **Code-fence balance:** every doc has an even number of ` ``` ` fences (README 2, execution_modes 32,
  in_process 34, cross_process 26, mailbox 38, cross_validation 6). All BALANCED. PASS.
- **Snippet headers:** the dual-version snippets carry the required
  `// ====` + `ReadableName - Description` + `// Location: cli_inner_pretty.js:line-range` header, followed by
  `// ORIGINAL (for source lookup):` and `// READABLE (for understanding):` blocks and a trailing
  `// Mapping:` line. Spot-checked ~12 snippets across the five docs; all well-formed.

---

## Cross-validation against v2.1.88 (`/lyz/codespace/3rd/claude-code/src`)

The "byte-identical vs evolved" claims in the module's `cross_validation.md` were re-checked against the
readable tree:

- **`isInProcessEnabled` precursor:** `utils/swarm/backends/registry.ts:351` is
  `export function isInProcessEnabled(): boolean` with the exact "force in-process for non-interactive
  sessions" guard comment — confirms the branch-for-branch claim and the **registry.ts:351** citation. PASS.
- **Env-passthrough growth (the headline delta):** v2.1.88 `spawnUtils.ts:96` `TEAMMATE_ENV_VARS` contains
  **17** quoted entries (counted directly: 96-134 → 17). v2.1.156 `PT_` (`cli_inner_pretty.js:380350-380386`)
  contains **32** array entries; plus the special-cased `CLAUDE_SECURESTORAGE_CONFIG_DIR` and the two
  hard-coded `CLAUDECODE=1`/`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` env vars emitted by `buildTeammateEnvString`,
  for ~35 forwarded vars total. The docs' "**17 → 35**" framing is accurate at the level it claims (≈17
  list-entries → ≈35 total forwarded env vars). PASS, with a minor wording nuance flagged in "Residual" below.
- **Broadcast-removal delta:** v2.1.88 `teammatePromptAddendum.ts:13` contains the line
  `Use the SendMessage tool with \`to: "*"\` sparingly for team-wide broadcasts` — present in the precursor,
  **dropped** from v2.1.156 `jU6`, and `SendMessage.validateInput` now *rejects* `to:"*"`. Confirms the
  lock-step "addendum + tool both removed broadcast" claim. PASS.
- **Builder/precursor symbols exist:** `getTeammateCommand` @spawnUtils.ts:23, `buildInheritedCliFlags` @:38,
  `TEAMMATE_ENV_VARS` @:96, `buildInheritedEnvVars` @:135 all present at the cited lines, validating the
  `J94`/`X94`/`PT_`/`WT$` mapping rows. PASS.
- **Ground-truth file inventory:** every v2.1.88 path the docs cite exists —
  `utils/swarm/{backends/{registry,detection,teammateModeSnapshot,InProcessBackend,PaneBackendExecutor,TmuxBackend,ITermBackend,it2Setup,types}.ts, inProcessRunner.ts, spawnInProcess.ts, spawnUtils.ts, leaderPermissionBridge.ts, permissionSync.ts, teammatePromptAddendum.ts}`,
  `utils/teammateMailbox.ts`, `tasks/InProcessTeammateTask/InProcessTeammateTask.tsx`. PASS.

**v2.1.88 corroboration verdict: PASS** — all precursor paths exist; the execution-mode switch, the detection
tree, the mailbox protocol, and the permission *sync* are a faithful continuation; the five flagged
evolutions (registry state-holding form, env-list growth, `--plugin-url`/`auto`/`skipModel` in the CLI
builder, the tmux `-S` socket, the permission-dialog plumbing migration) are real and correctly scoped.

---

## Fixes applied (in place)

One readable-name inconsistency was found during the citation sweep and fixed in the module (see PART C of the
critic pass):

1. **`S94` readable name unified to `getInProcessBackend`.** `execution_modes_and_backend_registry.md:55`
   alone called it `getInProcessBackendInstance`; every other site (the `R94` export map, the readable
   snippet in §6, the §8 diagram, the `// Mapping:` line, `README.md`, `in_process_mode.md`,
   `cross_validation.md`, and the canonical `symbol_additions` table) uses `getInProcessBackend`. The lone
   outlier was corrected to match the canonical name.

No mapping tables were introduced into module docs; the fix was a list-entry rename only.

---

## Confidence roll-up

| Area | Confidence | Notes |
|------|-----------|-------|
| Symbol existence (C1) | **HIGH** | 27/27 cited declarations confirmed at their lines |
| Body/semantics pairing (C2) | **HIGH** | 6/6 bodies read in full match the prose |
| Forbidden-table scan (C3) | **HIGH** | 0 mapping tables in core docs; 2 sanctioned comparison matrices |
| Broken-link sweep (C4) | **HIGH** | 51/51 relative links resolve, incl. the cross-tree v2.1.142 link |
| Fence/header integrity (C5) | **HIGH** | all fences balanced; snippet headers well-formed |
| v2.1.88 cross-validation | **HIGH** | precursors exist; 17-entry list + broadcast line confirmed verbatim |

**Aggregate pass-rate:** of the **39 discrete checks** recorded above (27 symbol-existence + 6 body + 5
v2.1.88 corroboration items + the C4 link sweep counted as one aggregate), **39/39 passed = 100%**. The single
defect found across the whole module was a *readable-name typo* (`getInProcessBackendInstance` for one `S94`
list entry) — a cosmetic naming-consistency issue, not a factual/line error — now reconciled.

**Overall verdict: PASS.** The module's citations, prose, and algorithm analysis are accurate against the
2.1.156 bundle and the v2.1.88 ground truth. The docs correctly use list format for symbol references, all
relative links (including the cross-tree one) resolve, code is fence-balanced, and the one naming
inconsistency has been fixed in place.

## Residual / honestly-flagged items

- **"~35-entry env passthrough" wording (LOW concern).** The literal `PT_` array has 32 entries; the docs say
  "~35" (`symbol_additions` §6) or "17 → 35" (`cross_validation.md`). The number reconciles only if you count
  the two hard-coded env vars + secure-storage var that `buildTeammateEnvString` adds outside the list. The
  claim is *defensible* but the bare "35-entry env forward list" phrasing in `symbol_additions` slightly
  conflates "list entries" with "total forwarded vars." Left as-is (not an error), flagged for precision.
- **`DT_` "6-priority" vs the 7 numbered steps.** `in_process_mode.md` §5.1 numbers seven steps (1-7) but
  titles the loop "6-priority"; steps 3 (the 500 ms sleep) and 4 (standalone skip) are control-flow guards,
  not message *sources*. The "6-priority" framing (counting the 6 work/exit sources) is internally consistent
  with the prose and the §8 ASCII; left as-is.
- **`getInProcessBackendInstance` (RESOLVED).** Fixed in place (see "Fixes applied"). No residual occurrences
  remain after the edit.
