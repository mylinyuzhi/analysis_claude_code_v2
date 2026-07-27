# 51_headless_sdk — Headless mode, print mode, and the SDK stream-json surface (v2.1.195 → v2.1.220)

> Module owner scope: every changelog bullet in the `.195`–`.220` window whose primary theme is
> **headless_sdk**. TARGET bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`, `build_time 2026-07-24T22:17:45Z`);
> baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` in this directory is a **2.1.220** line that was read in the
> 2.1.220 bundle; baseline citations are tagged `(193)`.

---

## The story of this window for headless mode

Twenty-nine bullets across 25 releases touch the headless/SDK surface, nineteen of them with it as the
primary theme. They read like unrelated maintenance. Three findings say otherwise.

**1. The process-IO module was rewritten, and that rewrite is four bullets in a trench coat.** In
2.1.193, `writeToStdout` was `process.stdout.write(chunk)` — three lines, no byte accounting, no
callback, no drain, no stdin error guard. In 2.1.220 it is a byte accountant (`Js`, `:20542`) feeding a
drain protocol (`jzt`, `:20552`) whose deadline is computed from the queued backlog
(`OUn`, `:20578`: `min(30 s, max(floor, queued_bytes / 256 KiB/s))`), armed under a watchdog derived
from that same number (`:522374`), with a seven-code stdin-usability whitelist (`Uzt`, `:20516`) guarding
three call sites. `.208` #11 (truncated output), `.211` #21 (Windows stdin crash) and `.214` #19 (scaled
drain) are all this module. The *enabling* change has no bullet at all: the stream-json stdout guard
stopped swallowing the write callback (`:841098-841111` vs `:702727-702740 (193)`), which is what makes
the byte accounting truthful in the first place.
→ [`stream_json_init_and_output.md`](./stream_json_init_and_output.md) §3

**2. Four bullets the foundation pass recorded as UNANCHORED are anchored here.** `.208` #19 (blank CRLF
killing the session) is `if (!e.trim())` at `:840090` replacing `if (!e)` at `:701898 (193)` — and the
proof that it *killed* rather than *ignored* is `w9o(e) { console.error(e), process.exit(1) }` at
`:702308 (193)`. `.208` #29 (SDK agents lost to a plugin refresh) is an array-push-vs-getter change at
`:849431-849433`. `.219` #7 (`claude -p` dropping the answer) is a two-slot rolling accumulator,
`priorAssistantText` 220=4/193=0. `.210` #22 (SDK MCP servers connecting a turn late) is one added call,
`It()` at `:847530`.

**3. Two of this theme's headline bullets are narrower than they read, and one anchor is dead code.**
`--forward-subagent-text` is genuinely new as a *flag*, but the SDK option `forwardSubagentText` it
drives is **carryover** (220=18 / 193=12, present in 193's `initialize` schema at `:700766 (193)`). And
`tengu_remote_subagent_frame_nested` — the scoping pass's anchor for `.219` #6 — sits inside
`let ut = null; if (ut !== null) { … }` at `:757390-757401`: **unreachable code**. The real depth-2
forwarding is a three-line `else if` at `:399018-399026`, in a different subsystem.

**The counter-story.** `register_repo_root` is **not** a new control request (220=15 / **193=3**); only
the `DirectoryAdded` hook firing inside it is new, and that belongs to `41_hooks`. The stream-json
stdout guard is carryover as a feature. `phantom` (`.218` #11) is 8/8. Two bullets in this theme remain
genuinely unanchored and are named as such below.

---

## Documents

| Doc | Covers | Depth |
|---|---|---|
| [`stream_json_init_and_output.md`](./stream_json_init_and_output.md) | the `system`/`init` event shape (4 new fields, 3 undocumented), `mcp_server_errors` + its two-stage filter + the TTY warning, stdout byte accounting, the exit drain and its byte-scaled budget, the stdout-guard callback fix, blank-CRLF stdin input, unreadable stdin, and the `claude -p` partial-answer recovery | full |
| [`subagent_text_forwarding.md`](./subagent_text_forwarding.md) | `--forward-subagent-text` / `CLAUDE_CODE_FORWARD_SUBAGENT_TEXT`, the flag-vs-env severity asymmetry, the thinking-display coupling, the depth-2+ re-emit and why it preserves ids, the parallel background-transport forwarder, and the dead-code anchor | full |
| [`control_requests.md`](./control_requests.md) | the control-request lifecycle rewrite + `control_request_progress`, `set_model` type validation and the five-slot mid-turn model chain, `initialize`'s MCP sync and agent merge, `set_cwd`'s busy predicate, `register_repo_root`'s keep-alive pump, and the scheduled-task banner | full |

Symbol tables for merging live in
[`../00_overview/symbol_additions_v2_1_220_headless_sdk.md`](../00_overview/symbol_additions_v2_1_220_headless_sdk.md).

---

## Per-bullet ledger

Verdicts: **NET_NEW** = literal/mechanism absent in 2.1.193 · **DELTA** = mechanism existed, this window
narrowed/extended it · **CARRYOVER** = the described mechanism predates the window · **PARTIAL** = one
half anchored · **UNANCHORED** = no anchor found, probes listed · **OTHER-MODULE** = primary theme is
elsewhere.

| # | Bullet (abridged) | Ver | Verdict | Anchor (2.1.220 unless tagged) | Doc section |
|---|---|---|---|---|---|
| 1 | Background tasks stuck on "Running" in web/desktop/VS Code panels after finishing | `.196` #11 | **OTHER-MODULE** (`36_background_agents` / `54_remote_control`) | scoped to `tengu_bg_result_seen` / `tengu_persistence_suppressed`; not read here | — (Not covered) |
| 2 | Hook events not streaming during SessionStart hooks in headless; workers idle-reaped mid-hook | `.204` #1 | **OTHER-MODULE** (`41_hooks`) | `CLAUDE_RUNNER_ACTIVITY_FD` `:840836` (3/0). Headless-side surface only: the `teeActivity` fork at `:841036-841045` writes hook activity to the fd instead of stdout | — (Not covered) |
| 3 | `--json-schema` silently unstructured on invalid schema; `format` keyword rejected | `.205` #2 | **OTHER-MODULE** (`42_workflow`) — cycle C9 resolved, owned there | `fty` `:231103-231141`; `validateFormats: !1` `:231106` (with `validateSchema` still ON at `:231107` — the two bullet clauses map onto those two options); CLI exit `:829680-829684` | [../42_workflow/workflow_runtime_and_ui.md](../42_workflow/workflow_runtime_and_ui.md) §8 (Not covered) |
| 4 | Message sent mid-turn lost when the turn ended at the `--max-turns` limit | `.205` #3 | **UNANCHORED** | `max_turns` 220=29/193=20, `--max-turns` 220=4/193=3 (both carryover-shaped); the `error_max_turns` construction `:653469` is unchanged in shape from 193. No isolable site | [control_requests §8](./control_requests.md) |
| 5 | RC web/mobile bg tasks stale "Running"; full task state on membership change | `.205` #15 | **OTHER-MODULE** (`54_remote_control`) | `background_tasks_changed` `:837673` (11/0) | — (Not covered) |
| 6 | Desktop sessions stuck "running" after a mid-turn slash command | `.206` #15 | **UNANCHORED** | `tengu_sdk_control_cancel_request` `:849005` (1/0) is the *cancel* path, not a slash-command path; `A turn is in progress` `:663612` is `set_cwd`'s. Read both, neither fits | [control_requests §8](./control_requests.md) |
| 7 | Truncated stream-json/JSON output and missing `result` piping large `claude -p` responses | `.208` #11 | **NET_NEW** | `drainStdoutBeforeExit` `jzt` `:20552` (1/0); `stdout drain timeout (exit)` `:20559` (1/0); byte accounting `Js` `:20542-20551`; **the enabling fix** — stdout guard now batches and forwards the write callback, `:841098-841111` vs `:702727-702740 (193)` | [init_and_output §3.1-§3.3](./stream_json_init_and_output.md) |
| 8 | stream-json input killing the session on blank CRLF / whitespace-only lines | `.208` #19 | **NET_NEW** (scoping said UNANCHORED) | `if (!e.trim()) return;` `:840090` + `stripBom` `SU` `:57355`, vs `if (!e) return;` `:701898 (193)`; fatal path `w9o` `:702308 (193)` = `console.error` + `process.exit(1)` | [init_and_output §4](./stream_json_init_and_output.md) |
| 9 | `control_request` with a non-string `set_model` hanging headless sessions | `.208` #20 | **NET_NEW** | `set_model: model must be a string` `:847581` (1/0); `tengu_set_model_unrecognized` `:847598` (1/0); 193's throw site `Ln.trim()` `:707081 (193)` | [control_requests §2.1-§2.2](./control_requests.md) |
| 10 | "Change directory" in SDK hosts failing with "A turn is in progress" | `.208` #25 | **NET_NEW** (with a caveat) | `A turn is in progress` `:663612` (1/0); `kxm` `:843367` — `(running && phase !== "waiting_for_agents") \|\| queued > 0`; phase assigned `:846976`. Caveat: the whole `set_cwd` request postdates 193, so the broken version is not observable | [control_requests §5](./control_requests.md) |
| 11 | SDK sessions losing `initialize`-defined agents when a plugin refresh ran first | `.208` #29 | **NET_NEW** (scoping said UNANCHORED and mis-anchored) | `mergedStdinAgents` `:849486`, `:847550-847553` (3/0); getter `() => $n` `:847544` vs array `u` `:707060 (193)`; 193's `u.push(...g)` `:708505 (193)` | [control_requests §4](./control_requests.md) |
| 12 | SDK MCP servers from an `initialize` control request waiting a turn to connect | `.210` #22 | **NET_NEW** (scoping mis-anchored to `tengu_mcp_sdk_generation`) | the added `It()` at `:847530`; reconciler `:845949-845982`; 193's push-only `:707046-707047 (193)` | [control_requests §3](./control_requests.md) |
| 13 | `--forward-subagent-text` + `CLAUDE_CODE_FORWARD_SUBAGENT_TEXT` for stream-json | `.211` #1 | **NET_NEW (surface) / CARRYOVER (option)** | flag `:851029`, env `:31043`, merge `:829131`, validation `:829537` — all 2/0. But `forwardSubagentText` is 220=18/**193=12**: schema `:700766 (193)`, Agent tool `:431010 (193)` | [subagent_text_forwarding §2](./subagent_text_forwarding.md) |
| 14 | Headless print-mode on Windows crashing/exiting silently when stdin is unreadable | `.211` #21 | **NET_NEW** | `isStdinUnusableError` `Uzt` `:20516` (1/0) + `u9m = {EISDIR, ENOTCONN, ECONNRESET}` `:20652`; guards `:828102`, `:828127`, `:682702`; `tengu_bg_stdin_unreadable` `:682705` (1/0); 193's unguarded `process.stdin.setEncoding` `:712137 (193)` | [init_and_output §5](./stream_json_init_and_output.md) |
| 15 | SIGTERM during Bash orphaned the process tree in print/SDK mode; now exits 143 | `.212` #10 | **DELTA** (secondary theme; `04_tools` owns the Bash half) | `143)` 220=3/**193=1**. Two new exit sites: global handler `Ds(143)` `:522459` (with `tengu_shutdown_signal` and a 5-field diagnostic at `:522445-522450`) and print-mode `se` handler `:845666-845669` which aborts the turn controller with reason `"shutdown"`. 193's single `143` `:310282 (193)` is unrelated | — (anchors only) |
| 16 | Hosted sessions failing at startup on mTLS/CA/OAuth-scope settings | `.212` #19 | **OTHER-MODULE** (`55_auth_providers`) | `skipping settings-sourced NODE_EXTRA_CA_CERTS under host-managed provider` `:825529` | — (Not covered) |
| 17 | `ExitWorktree` failing "no active EnterWorktree session" after `--continue`/`--resume` | `.212` #21 | **OTHER-MODULE** (`53_subagent_limits`) | `no active EnterWorktree session` 1/1 — carryover literal | — (Not covered) |
| 18 | Streaming control requests marked complete before their handler finished | `.212` #23 | **NET_NEW** | preamble exclusion `:847425-847434`; `runTracked`/`runDetached` `:847437-847451`; `finally` guard `:849001-849003`; 193's unconditional `completed` `:707018-707020 (193)`. Companion: `control_request_progress` `:837264-837281` (6/0) | [control_requests §1](./control_requests.md) |
| 19 | OTLP event log records missing `trace_id`/`span_id` when `TRACEPARENT` is set | `.212` #32 | **OTHER-MODULE** (`44_telemetry`) | `traceparent: Z.TRACEPARENT` `:167351` | — (Not covered) |
| 20 | Headless/SDK `set_model` control request applies mid-turn | `.212` #45 | **NET_NEW** | `lud` `:336898` (5-slot chain, `liveSwitchOverride` 2/0); `cud` `:336901`; adoption `:337599-337617`; `tengu_live_model_switch` `:337608` (2/0); 193's 4-slot inline `P ?? O ?? k[R] ?? I` `:466516 (193)` | [control_requests §2.3](./control_requests.md) |
| 21 | stream-json truncation at exit; drain now scales with queued bytes, not a flat 2 s | `.214` #19 | **NET_NEW** (relative to 193; step 2 of a 2-step change) | `scaleBudgetToQueue` 3/0 (`:20552`, `:522216`, `:840582`); `OUn` `:20578` with `f9m = 262144` / `m9m = 30000` `:20646-20647`; watchdog composition `Q8s(OUn() + GF_)` `:522374`, `GF_ = 1500` `:522406`. The "flat 2 s" survives only as the default parameter `e = 2000` | [init_and_output §3.4-§3.6](./stream_json_init_and_output.md) |
| 22 | Scheduled tasks refusing their own configured prompt as untrusted input | `.214` #20 | **NET_NEW** | `Zdo` banner `:226522-226527`, header `dZg` `:226513` (1/0); `delivered by the scheduler as configured` `:226524` (1/0); selector `Hcs` `:226508`, used at `:531549`/`:533918`; `modelScheduledOrigin` 12/0, scheduler `:847154-847180` | [control_requests §7](./control_requests.md) |
| 23 | `--max-budget-usd` not stopping background subagents | `.216` #20 | **OTHER-MODULE** (`53_subagent_limits`) | `max-budget-usd` 220=5/193=4 | — (Not covered) |
| 24 | Engine teardown race starting/abandoning a phantom turn; input after close rejected | `.218` #11 | **CARRYOVER** at the literal level | `phantom` 220=8/**193=8** — confirmed against `_false_delta_ledger.md`. The one headless-adjacent half I can anchor is `inputClosed` handling at `:840000-840003` (`Tool permission stream closed before response received`), which is byte-identical to `:701710`-ish in 193 | — (Not covered) |
| 25 | Fork-session lineage lost after compaction in headless and SDK sessions | `.218` #23 | **OTHER-MODULE** (`07_compact`) | `lineage` `:846491` per scoping | — (Not covered) |
| 26 | `DirectoryAdded` hook after `/add-dir` or SDK `register_repo_root` | `.219` #3 | **OTHER-MODULE** (`41_hooks`) + **carryover correction** | `register_repo_root` 220=15 / **193=3** — the control request pre-existed. Headless-side finding: the handler wraps hook execution in a 30 s `keep_alive` pump, `bs()` `:847193-847204`, started `:847254`, stopped `.finally(ji)` `:847265` | [control_requests §6](./control_requests.md) |
| 27 | `mcp_server_errors` in the headless stream-json init event; terminal startup warning | `.219` #4 | **NET_NEW** | schema `:836948-836953` (3/0); builder + stage-2 filter `:593589-593590`, emission `:593620`; stage-1 filter `:829286`; recorder `TEm`/`CEm` `:828309-828318`; TTY warning + control-char scrub `:829289-829297`; 193's discard-only path `:712845-712851 (193)` | [init_and_output §1](./stream_json_init_and_output.md) |
| 28 | Nested subagent forwarding in stream-json at depth-2+ with `--forward-subagent-text` | `.219` #6 | **NET_NEW** (scoping anchor is dead code) | `:399018-399026` (the `else if` re-emitting `agent_progress` with `parentToolUseID` preserved); bg twin `:344737-344739` (`bg-subagent nested progress write failed`, 1/0); 193 drops it at `:431026 (193)`. **The scoping anchor `tengu_remote_subagent_frame_nested` `:757401` is inside `let ut = null; if (ut !== null)` — unreachable** | [subagent_text_forwarding §3](./subagent_text_forwarding.md) |
| 29 | `claude -p` text output dropping the answer when a turn dies mid-stream | `.219` #7 | **NET_NEW** (scoping said UNANCHORED) | `priorAssistantText` 4/0, `partialForResult` 4/0; accumulator `wxm`/`Txm` `:843299-843325`; `vpE = "The response above may be incomplete."` `:843329`; renderer `:845476-845480` vs 193's bare `ki(z.result…)` `:705531 (193)` | [init_and_output §6](./stream_json_init_and_output.md) |
| 30 | (no bullet) init event gained `capabilities`, `fast_mode_disabled_reason`, `plugins[].version` | — | **NET_NEW, undocumented** | `capabilities` `:836956-836961`; tokens `:593634-593636` (`interrupt_receipt_v1` 4/0, `interrupt_cancel_queued_v1` 5/0, `msg_lifecycle_v1`); **two unequal sets** — `uDp` `:593652` (3 tokens, SDK path) vs `lCb` `:653849` (2 tokens, engine path); `fast_mode_disabled_reason` 18/0 `:836955`; `plugins[].version` `:836933` | [init_and_output §2](./stream_json_init_and_output.md) |
| 31 | (no bullet) `set_model` gained a transactional `system_prompt` field | — | **NET_NEW, undocumented** | `:838625-838631`; validation `:847584-847589`; application `:847628` only on the success branch; 193's one-line schema `:700864 (193)` | [control_requests §2.1](./control_requests.md) |
| 32 | (no bullet) unrecognized-model shape taxonomy + edit-distance suggestions | — | **NET_NEW, undocumented** | `pxm` `:843087`, `ypE` `:843101` (`display_name`/`numeric`/`bracketed`/`whitespace`/`other`), `O_l` `:843110`, `fxm` `:843115` (`is not a recognized model id` 1/0); fail-open on non-first-party providers `:843090` | [control_requests §2.2](./control_requests.md) |

**Roll-up of the 29 changelog bullets (rows 1–29):** **NET_NEW 15** (rows 7–14, 18, 20–22, 27–29;
row 13 is NET_NEW only on its flag/env half) · **DELTA 1** (row 15) · **CARRYOVER 1** (row 24) ·
**UNANCHORED 2** (rows 4, 6) · **OTHER-MODULE 10** (rows 1–3, 5, 16, 17, 19, 23, 25, 26) — plus
**3 undocumented net-new features** (rows 30–32),
**4 previously-UNANCHORED bullets newly anchored** (rows 8, 11, 12, 29), **2 scoping mis-anchors
corrected** (rows 12, 28), and **1 carryover correction defended** (row 26).

---

## Corrections to shared tree documents

1. **`00_overview/_false_delta_ledger.md`, `.198` row "Subagents and compaction inherit extended
   thinking configuration", anchor `yBc` 220=2/193=2.** That count is a `_CONVENTIONS.md` **trap #1**
   collision: in 2.1.193, `yBc` is `:9245-9247 (193)`,
   `function yBc(e) { return len(e, Tse, ynn); }` — a vendored helper aliased to `s7e`, unrelated to
   thinking. The 2.1.220 `yBc` (`:119662`) is the subagent thinking-display normalizer. Correct anchors:
   `display: "omitted"` 220=1 (`:119667`) / **193=0**, `sessionDisplayExplicit` 220=2 / **193=0**. The
   ledger's *conclusion* about the `.198` call site may stand; its *evidence* does not.
2. **`_scope_v215_220.md` row `.219` #6** anchors nested subagent forwarding to
   `tengu_remote_subagent_frame_nested` (`:757401`). That gate sits in a block guarded by
   `if (ut !== null)` where `ut` was assigned `null` on the preceding line — **dead code in this build**.
   Suggested replacement: the branch at `:399018-399026`, or the log literal
   `bg-subagent nested progress write failed` (`:344739`, 220=1/193=0).
3. **`_scope_v206_210.md` rows `.208` #19, `.208` #29, `.210` #22 and `_scope_v215_220.md` row `.219`
   #7** are all recorded UNANCHORED (two of them scoped against `tengu_mcp_sdk_generation`, which
   [`../39_mcp/dual_mcp_runtime_trees.md`](../39_mcp/dual_mcp_runtime_trees.md) shows is the v1/v2 arm
   probe). All four are anchored in this module; see ledger rows 8, 11, 12, 29.
4. **`00_overview/_false_delta_ledger.md` register 2, `headless_sdk` section** lists
   `mcp_server_errors` at `:836952`. That line is the *describe string*; the schema field starts at
   `:836948` and the **emission** is `:593620`. Both are correct to cite; the emitter is the more useful
   entry point.

---

## Not covered

- **The MCP-side production of `mcp_server_errors`** — the `skipReason` taxonomy, the validator `Ilr`
  (`:829253`), the redacting formatter. Owned by
  [`../39_mcp/errors_and_diagnostics.md`](../39_mcp/errors_and_diagnostics.md) by explicit coordination;
  this module documents only the event shape, the two-stage name filter, and the terminal warning.
- **`.212` #10's Bash half** (SIGTERM orphaning the process tree). The two new `Ds(143)` sites are
  recorded in ledger row 15 with line numbers, but I did not trace the process-group teardown; `04_tools`
  owns it.
- **`canUseTool` and the permission control-request path.** `pending_permission_requests` /
  `pending_user_dialog_requests` (12/9 each) and the replay contract at `:839684` are documented from
  the transport side in [`../38_permissions/security_hardening_214.md`](../38_permissions/security_hardening_214.md)
  §9; I did not re-derive them.
- **`.218` #11's engine teardown race.** `phantom` is 8/8 and I found no headless-side literal delta. I
  did not diff the teardown call graph statement-by-statement, so this is "not disproven", not
  "disproven".
- **The `Iet` / RemoteIO transport class** (`:840840-841073`) beyond the `teeActivity` fork. It carries
  the `CLAUDE_RUNNER_ACTIVITY_FD` plumbing that `41_hooks` owns.
- **`--session-mirror` / `transcript_mirror`** (`:851034-851039`, `:845655-845660`). No bullet in this
  window names it and I did not investigate whether it is new.

---

## Method notes for the next reader

1. **The IO module is the entry point for anything about output.** `:20501-20515` is the export table and
   it names nine functions in readable English (`drainStdoutBeforeExit`, `getStdoutDrainBudgetMs`,
   `markStdoutDrainExternallyClocked`, `isStdinUnusableError`, `peekForStdinData`,
   `iterateStreamUntilClose`, `_resetStdoutErrorLatchForTesting`, …). Use those names; the 193 twin at
   `:10085-10094 (193)` exports only seven and lets you diff the surface in one glance.
2. **Two `for await` loops own the whole theme.** `:847424` (`for await (let dt of e.structuredInput)`)
   is the control-request dispatcher; `:845410` (`for await (let Ae of rHm(…))`) is the output loop.
   Every bullet here is inside one of them or inside a function they call.
3. **A control-request bug is almost always a missing `respondSuccess`/`respondError`.** The SDK client
   keys pending promises by `request_id` with no global timeout on most subtypes, so *any* unhandled
   throw inside an arm presents as a hang. When a bullet says "hanging", grep the arm for a path that
   exits without calling `Pn` or `mr`.
4. **Do not trust a `tengu_*` gate's 220=N/193=0 count on its own.** `tengu_remote_subagent_frame_nested`
   is the counter-example: a live-looking gate inside statically dead code.

## Related Symbols

> Symbol mappings:
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (**CLI / headless** home)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [../00_overview/symbol_additions_v2_1_220_headless_sdk.md](../00_overview/symbol_additions_v2_1_220_headless_sdk.md) - the v2.1.220 headless/SDK additions produced by this module

Entry points, one per document:

- `drainStdoutBeforeExit` (`jzt`, `cli_inner_pretty.js:20552`) - the exit drain and everything hanging off it.
- `buildInitEvent` (`tAr`, `cli_inner_pretty.js:593588`) - the `system`/`init` frame and its filters.
- `normalizeSubagentThinkingDisplay` (`yBc`, `cli_inner_pretty.js:119662`) - where `forwardSubagentText` reaches request construction.
- `resolveRoundTripModel` (`lud`, `cli_inner_pretty.js:336898`) - the five-slot model precedence chain.
- `handleInitializeControlRequest` (`pfE`, `cli_inner_pretty.js:849395`) - the `initialize` arm.
