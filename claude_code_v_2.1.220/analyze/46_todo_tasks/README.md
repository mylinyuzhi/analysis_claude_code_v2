# 46 — Task tracking deltas (v2.1.193 → v2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
tagged `(193)` at every citation.

This module owns the **task/todo tracking layer**: `TodoWrite` V1, the V2
`TaskCreate`/`TaskGet`/`TaskUpdate`/`TaskList` file-backed store, their reminder attachments, the task-list
identity/lifecycle, and — because it was discovered here — the bundle-wide **`tengu_dead_probe_*`** gate
family. The 2.1.193 current-state description is the base; link, do not re-derive:
[`../../../claude_code_v_2.1.193/analyze/46_todo_tasks/README.md`](../../../claude_code_v_2.1.193/analyze/46_todo_tasks/README.md).

---

## Executive summary

**The task machine itself did not change.** The V1/V2 mutual-exclusion gate, the
`<configDir>/tasks/<list-id>/` per-task-JSON store with its `.lock` and `.highwatermark`, all five tools,
the dependency-edge cleanup, the 10-turn reminder cadence, and the `TaskCreated`/`TaskCompleted` hooks are
byte-equivalent carryover across a window that added +153,917 lines to the bundle. Twelve separate
carryover proofs are tabulated in [`task_tracking_deltas.md`](task_tracking_deltas.md) §4.

**Three real deltas, none of them in the changelog:**

1. **`tengu_vellum_ash`** (`:403924`, 220=1/193=0) — a remote, **model-targeted kill switch** that removes
   `TodoWrite` *and* all four V2 task tools from the model's tool list, and suppresses the reminder
   attachments, when the resolved model id contains any server-supplied substring. Eight call sites across
   three layers. No bullet in 579.
2. **Task-list carry-on-fork** (`M7S`, `:808777`, wired at `:808896`) — pressing `←` to background a
   conversation mints a new session id, and the V2 task list is keyed by session id, so the tracker
   appeared to vanish. 2.1.220 copies the directory into the fork under a 2-second abortable budget, but
   **only** when the list is private to the session. This is the missing anchor for `.210` #19.
3. **`agentNameRegistry` lifecycle** — 193 pruned a name binding inside every task-eviction reducer
   (`dCo`, 3 sites); 220 deleted all three and reconciles the whole registry only at `/clear` and at
   resume/fork (`RDo`, `:448602`). Writes got cheaper; readers now tolerate dangling ids.

**The headline find is a mechanism, not a feature.** 2.1.220 ships **25 `tengu_dead_probe_*` gates across
32 emission sites** (`grep -c 'dead_probe'` → **220=32 / 193=0**) that instrument code Anthropic believes is
already unreachable. Each fires once per process, reports a compile-time-constrained payload, and then
**lets the legacy path run unchanged**. It is a census staged for a future deletion — deletion-by-evidence
rather than deletion-by-judgement — and it is entirely undocumented.
See [`dead_probe_gate_family.md`](dead_probe_gate_family.md).

**Two large false deltas were caught and are recorded rather than written up as findings:**
`activeForm` 220=56 / 193=27 is **100 % carryover** (29 of the 220 hits are `activeFormattingElements` from
a newly vendored parse5 HTML parser; `activeForm\b` is 27/27), and `TaskOutput` 220=28 / 193=9 is a module
**export table**, not new behaviour.

---

## Document index

| Document | Contents |
|---|---|
| [`dead_probe_gate_family.md`](dead_probe_gate_family.md) | The `tengu_dead_probe_*` family: shape, latch idioms, the type-branded payload vocabulary, the daemon-path awaitable variant, the complete 25-gate / 32-site table with owner routing, and what a zero count would license. |
| [`task_tracking_deltas.md`](task_tracking_deltas.md) | `tengu_vellum_ash`; task-list carry-on-fork; the `agentNameRegistry` lifecycle change; the twelve carryover proofs; the four false deltas; the one bullet left unanchored. |

Two topic docs rather than three: the reminder/attachment layer and the prompt surface both turned out to
be pure carryover (`ZN_` `:517809-517821` is statement-for-statement identical to `Fuf` `:474344 (193)`;
`TODO_REMINDER_CONFIG` is `{10, 10}` in both), so they are folded into `task_tracking_deltas.md` §4 rather
than given documents of their own. **Merged because thin, as instructed.**

---

## Per-bullet ledger

Five changelog bullets were routed to this theme, plus three findings with no bullet at all. Note that the
scoping pass filed every one of the five under `background_agents`, `tools`, or `performance` — the string
`todo_tasks` does not appear in any `_scope_v*.md`, so there is no pre-existing row for this module.

| # | Bullet | Ver | Verdict | Anchor (2.1.220) | 220 / 193 | Doc section |
|---|---|---|---|---|---|---|
| 1 | `TaskStop`/`TaskOutput` failing to find background agents spawned by another agent — errors now list running agents by id and description | `.203` | **NET_NEW**, owned by `04_tools` | two-namespace resolver `Qko` `:399713-399747`; messages `AAd` `:399748`, `wAd` `:399751`, `dOs` `:399824`, `Zko` `:399795`; `TaskStop.validateInput` `:399998-400016` | `Multiple teammates match` 1/0; `Running named agents:` 1/0; `Running background agents:` 1/0; `Did you mean:` 3/0 | routed — [`../04_tools/web_and_misc_tools_deltas.md`](../04_tools/web_and_misc_tools_deltas.md) §4; probe half in [`dead_probe_gate_family.md`](dead_probe_gate_family.md) §5 rows 22–23 |
| 2 | Completed background agents now stay listed in `/tasks` until cleanup instead of vanishing the moment they finish | `.208` | **DELTA**, owned by `36_background_agents`; the *constants* are carryover | `evictAfter` kill branch `:747150`; `Hpr = 3000`, `Yse = 30000` `:341921-341922` | `evictAfter` 41/34; the three constants **identical** to `:446878-446880 (193)` | routed — [`../36_background_agents/bg_notifications_and_reporting.md`](../36_background_agents/bg_notifications_and_reporting.md) §8; carryover proof in [`task_tracking_deltas.md`](task_tracking_deltas.md) §4 |
| 3 | Improved input responsiveness while agent task lists update — task updates no longer re-render the entire UI | `.208` | **UNANCHORED** | none. The store selector hook `Ve` `:556846-556853` is byte-identical to `bt` `:178087-178094 (193)` | `useSyncExternalStore` 68/55 (all +13 are new subscribers); `.memo(` 17/16 | [`task_tracking_deltas.md`](task_tracking_deltas.md) §5.5 — the `agentNameRegistry` change (§3) is a plausible contributor, explicitly **not** claimed as the anchor |
| 4 | Fixed pressing ← to open the agents view dropping the task tracker when returning to the session | `.210` | **NET_NEW** — anchor found here; the scoping row's anchor was the keypress half | `carryTaskListToFork` `M7S` `:808777-808801`, wired at `:808896` inside `gpm` `:808802` | `[tasks] carry to fork` 3/0; `task-list carry` 1/0; `stopped at the cap` 1/0 | [`task_tracking_deltas.md`](task_tracking_deltas.md) §2 |
| 5 | Agent view / `claude agents --json`: sessions waiting on a sandbox, MCP-input, or managed-settings prompt now show as "Needs input" instead of "Working" | `.212` | **DELTA**, owned by `36_background_agents`; **the label is carryover** | state map `Rwt = { review: …, blocked: "Needs input", … }` `:808671` | `blocked: "Needs input"` **1 / 1** — identical to `:678802 (193)`; `needsInput` 6/0 | routed — [`../36_background_agents/agent_view_and_status.md`](../36_background_agents/agent_view_and_status.md) |
| A | *(no changelog bullet)* | — | **NET_NEW** | `tengu_vellum_ash` `:403924`; `_te()` `:403922-403931`; 8 call sites | 1 / 0 | [`task_tracking_deltas.md`](task_tracking_deltas.md) §1 |
| B | *(no changelog bullet)* | — | **NET_NEW structural** | `RDo` `:448602-448616`, called `:449503`, `:821895`; 193's `dCo` `:446683 (193)` and its 3 eviction call sites all removed | `RDo(` 2 sites / `dCo(` 0 in 220 | [`task_tracking_deltas.md`](task_tracking_deltas.md) §3 |
| C | *(no changelog bullet)* | — | **NET_NEW mechanism** | 25 gates / 32 sites, `:267285` … `:871382` | `dead_probe` **32 / 0** | [`dead_probe_gate_family.md`](dead_probe_gate_family.md) |

**Score: 5 bullets accounted for — 1 net-new anchored here, 3 routed to their owning module, 1 unanchored.
Plus 3 undocumented findings.**

---

## False deltas caught (register for cross-validation)

| Trap | 220 | 193 | Why it is a trap |
|---|---|---|---|
| `activeForm` | 56 | 27 | 29 of the 220 hits are `activeFormattingElements` in a newly vendored **parse5** HTML parser (`:369783`, `:370044`-`:372137`). `activeForm\b` is **27 / 27**. The V1 todo schema is unchanged. |
| `TaskOutput` | 28 | 9 | 17 of the 19 new hits are one **export table** at `:165108-165124`. `var gee = "TaskOutput"` `:230912` and the 4-entry alias map `:60380-60383` both have exact 193 twins. |
| `CLAUDE_CODE_TODO_REMINDER_MODE` | 2 | 2 | Reads like a 2.1.220 addition (env var + gate fallback) and is not. `H8s()` `:516577-516581` == `Dko()` `:473202-473206 (193)`. Sits three lines from the genuinely-new `tengu_vellum_ash`. |
| `tengu_soft_slate_nudge` | 1 | 1 | Same trap, gate half. |
| `CLAUDE_CODE_ENABLE_TASKS`, `CLAUDE_CODE_TASK_LIST_ID` | 3, 3 | 2, 2 | Both are in the **"GONE env vars"** list of [`../00_overview/_raw_asset_diff_193_to_220.md`](../00_overview/_raw_asset_diff_193_to_220.md) and both are live and read (`:324815`, `:324848`, `:808779`). `TASK_LIST_ID` actually *gained* a site. Instance of the `file_index.md` §4.2 extractor defect. |
| `blocked: "Needs input"` | 1 | 1 | Confirms `_GROUND_TRUTH` §3: the `.212` state **label** is carryover; only the state machine moved. |
| `evictAfter` timings | — | — | `Hpr`/`Yse`/`fdd` = 3000/30000/30000 `:341921-341923`, identical to `omt`/`Rde`/`hfl` `:446878-446880 (193)`. The `.208` grace behaviour is a *policy* change, not a constant change. |

New defect found in the asset extractor, for `file_index.md` §4.6: **`assets/feature_gates.json` lists 23
`tengu_dead_probe_*` names but the bundle contains 25** — `tengu_dead_probe_plugins_v1_file` (`:277546`)
and `tengu_dead_probe_plugins_v2_dualfile` (`:277437`) are missing. The gate list under-reports as well as
over-reports.

---

## Boundaries

| Owned by | What |
|---|---|
| [`../36_background_agents/`](../36_background_agents/) | the daemon, the agents view, `/tasks` eviction policy, `needsInput` state machine, `evictAfter` grace |
| [`../48_accessibility_ui/`](../48_accessibility_ui/) | render performance, `tengu_left_arrow_editing_guard` keypress machine |
| [`../04_tools/`](../04_tools/) | `TaskStop` / `TaskOutput` as tools, including the `.203` two-namespace resolver |
| [`../56_chrome_ide/`](../56_chrome_ide/) | `tengu_dead_probe_chrome_legacy_socket` |
| [`../07_compact/`](../07_compact/) | the four `tengu_dead_probe_preserved_segment` sites |
| **this module** | the todo/task tracking layer, the task-list store and its identity/lifecycle, and the `dead_probe` pattern as a mechanism (full owner routing in [`dead_probe_gate_family.md`](dead_probe_gate_family.md) §6) |

---

## Not covered

- **`.208` #33 render responsiveness** — unanchored; see the ledger and `task_tracking_deltas.md` §5.5.
  A future pass should diff the task-list component tree statement-by-statement rather than by literal, as
  `04_tools` recommends for the renderer-dispatch bullet.
- **Which of the 25 `dead_probe` gates has actually fired in production** — unknowable from the bundle. The
  document instead states what a zero count would license, per category.
- **The `tengu_vellum_ash` operational value** — the shipped default is `[]`, so the substring list is
  server-side and invisible here. Which model family it targets cannot be determined from the client.
- **The `_te()` inconsistency at `:437007`/`:517810`/`:578788`** is flagged but not traced to a
  user-visible consequence; confirming it would need a session running under a non-empty gate value.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this module are staged in
> [symbol_additions_v2_1_220_todo_tasks.md](../00_overview/symbol_additions_v2_1_220_todo_tasks.md).

Key functions in this module:
- `isTaskTrackingSuppressedForModel` (`_te`, `:403922`) - the `tengu_vellum_ash` model-targeted kill switch
- `isTodoV2Enabled` (`QL`, `:324814`) - V1/V2 mutual-exclusion gate (carryover; now via the `Z` env proxy)
- `getTaskListId` (`b6`, `:324847`) - env → team → session-id ladder (carryover)
- `getTaskListDir` (`v9`, `:324856`) - `<configDir>/tasks/<sanitized-list-id>`
- `carryTaskListToFork` (`M7S`, `:808777`) - copies the private task list into a `←` background fork
- `openAgentsViewViaLeftArrow` (`gpm`, `:808802`) - the `←` handler that wires the carry at `:808896`
- `pruneAgentNameRegistry` (`RDo`, `:448602`) - boundary reconciler replacing 193's per-eviction `dCo`
- `logEvent` (`O`, `:4083`) - the emitter every `dead_probe` uses; bounded buffer `L0l = 1000` (`:4099`)
- `logEventTo1PAwaitable` (`rk`, `:153134`) - awaitable emitter for the daemon-path probe
- `safeLiteral` / `safeEnum` (`Ee` `:138`, `fe` `:141`) - runtime identity, compile-time payload brands
- `sanitizeToolNameForTelemetry` (`ua`, `:151979`) - collapses `mcp__*` to `"mcp_tool"`
- `normalizeToolInput` (`atp`, `:508391`) - hosts the `TaskOutput` legacy-parameter probe and coalescing
- `buildTaskReminderAttachments` (`ZN_`, `:517809`) - unchanged from `Fuf` `:474344 (193)`
- `getTodoReminderMode` (`H8s`, `:516577`) - carryover reminder kill switch (do not confuse with `_te`)
