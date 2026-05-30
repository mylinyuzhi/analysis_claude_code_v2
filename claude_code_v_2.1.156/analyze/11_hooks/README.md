# Module 11 — Hooks (v2.1.143 → v2.1.156 Deltas)

## Overview

This document covers hook-subsystem changes that landed between **v2.1.143** and **v2.1.156**.
The prior window (v2.1.113 → v2.1.142) is in [v2.1.142 hooks analysis](../../../claude_code_v_2.1.142/analyze/11_hooks/v2_1_142_README.md) — read that first for the
preceding delta (exec form, MCP-tool hooks, `continueOnBlock`, `terminalSequence`, `effort.level`,
`duration_ms`). For the foundational architecture (executor dispatch, schema layout, the
execute → parse → apply → aggregate result lifecycle), see the v2.1.112 baseline analysis it points to.

The hook *platform* is unchanged in this window — the same `BaseHookInputSchema().and(...)` per-event
input union, the `hookSpecificOutput` discriminated-union output, the typed-executor dispatch table,
`applyHookJSONOutput`, the per-hook aggregator, and the `hasHookForEvent` gate that all existed in 2.1.88.
What lands in this window is **three new capabilities slotted into that mature plumbing**:

1. **A new display-only hook event (`MessageDisplay`).** The first hook in the catalog that is purely
   cosmetic: it can rewrite or hide assistant text *on screen* while it streams, without ever touching the
   transcript on disk or the text the model reads on its next turn. It is backed by a dedicated per-message
   streaming engine that converts a token stream into whole-line, debounced, in-flight-capped hook
   invocations, fails open to the original text on any error, and survives re-renders via a separate
   completed-message rewrite path.
2. **Two new SessionStart output fields (`sessionTitle`, `reloadSkills`).** A SessionStart hook can now set
   the session title (same effect as `/rename`, via a cache-at-load vs persist-mid-session split) and ask
   Claude Code to re-scan skill/command directories so skills the hook just installed are usable in the
   same session (the programmatic `/reload-skills`).
3. **Two Stop/SubagentStop changes.** The Stop and SubagentStop hook input gains `background_tasks` and
   `session_crons` arrays so a hook can tell "the session is genuinely done" apart from "the session is
   parked, waiting for a background task or a scheduled wakeup to revive it." Separately, a numeric
   *block cap* (`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`, default 8) stops a misbehaving Stop hook from blocking
   the turn forever — a liveness backstop decoupled from the cooperative `stop_hook_active` convention.

| Version | Change | Lifecycle Impact |
|---------|--------|------------------|
| v2.1.143 | Stop-hook block cap (`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`, default 8) | A repeatedly-blocking Stop/SubagentStop hook is overridden + warned after N blocks; the turn always terminates |
| v2.1.145 | Stop/SubagentStop input `background_tasks` + `session_crons` | A Stop hook can read in-flight background work + scheduled wakeups to make a better allow/block decision |
| v2.1.152 | SessionStart `hookSpecificOutput.sessionTitle` | A hook sets the session title (cache at startup/resume, persist mid-session via the `/rename` machinery, tagged `source:"hook"`) |
| v2.1.152 | SessionStart `hookSpecificOutput.reloadSkills` | A hook re-scans skill/command dirs after SessionStart hooks finish, so hook-installed skills light up in-session |
| 2.1.143–156 | `MessageDisplay` hook event + streaming engine | A hook transforms/hides on-screen assistant text, display-only; transcript and model context untouched |

The throughline of this window is **the hook surface gaining the two halves the prior surface lacked**:
a *display-only* output channel (`MessageDisplay`/`displayContent`) to complement the pre-existing
*model-visible* output channel (`updatedToolOutput`), and *session-shell* write surfaces (`sessionTitle`,
`reloadSkills`, plus the Stop-hook situational-awareness arrays) so a hook can manage the session
container — not just inject context or rewrite tool output.

## Module Structure

| File | Topic | Changelog Anchor |
|------|-------|------------------|
| [message_display_event.md](./message_display_event.md) | `MessageDisplay` hook event end-to-end — event registration in both event-name arrays, the `lj_` input schema (`turn_id`/`message_id`/`index`/`final`/`delta`) and `Mw_` output schema (`displayContent`), the `forceSyncExecution` + `suppressPerInvocationTelemetry` executor `l6$`, the `applyHookJSONOutput` case, the aggregator yield, the `wk` gate, a summary of the `OW9` streaming engine + `MW9` completed-message path, the `/hooks` help block, exit-code semantics, and the display-only design rationale | MessageDisplay (NEW post-2.1.88) |
| [message_display_streaming_engine.md](./message_display_streaming_engine.md) | The `OW9` streaming engine in depth — the per-message turn object, the whole-line flush algorithm (`f`), the 100ms debounce scheduler (`O`), the 3-way in-flight cap, the ordered `appendChain` assembly + fail-open fallback (`A`), the lifecycle/telemetry hub (`Y`), `begin`/`delta`/`finalize`/`entryLanded`/`newTurn`/`abandonTurn`, the completed-message rewrite (`MW9`), renderer wiring (`displayTransform`/`setStreamingDisplay`), render-side substitution, `displayedMessageContent` pruning (`t5q`), and the `tengu_message_display_hooks` telemetry | MessageDisplay streaming engine (NEW post-2.1.88) |
| [session_start_title_and_reload_skills.md](./session_start_title_and_reload_skills.md) | SessionStart `hookSpecificOutput` gains `sessionTitle` + `reloadSkills` — the schema additions (+ the UserPromptSubmit `sessionTitle` write surface), the aggregator yields, the `$U` reducer, the `reloadSkills` triple-dispatch (`_C`/`Bo`/`Xc.emit()` + telemetry), the two-path `sessionTitle` design (startup/resume **cache** `KSH` vs mid-session **apply** `ih8`), the 200-char sanitizer `Q6$`, the subagent/empty/unchanged guards, and the `YN6`/`niH` deferred-slot mechanism | 2.1.152 |
| [stop_hook_background_tasks_and_block_cap.md](./stop_hook_background_tasks_and_block_cap.md) | Two Stop/SubagentStop changes — **(A)** the 2.1.145 `background_tasks` + `session_crons` input arrays (schemas `Nj_`/`hj_`/`Qo7`/`go7`, dispatcher `fzH`, mappers `v89`/`k89`, the 1000-char cap `hKq`/`ub$`, label map `er6`, in-flight filter `uL`) that distinguish "session done" from "session parked"; and **(B)** the 2.1.143 stop-hook block cap (`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` default 8) with override warning and `tengu_stop_hook_block_count` telemetry | 2.1.143 / 2.1.145 |
| [../00_overview/symbol_additions_v2_1_156_hooks.md](../00_overview/symbol_additions_v2_1_156_hooks.md) | All symbol mappings discovered in this delta (the consolidated module symbol table) | — |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent loop / streaming, the Stop-hook block-cap branch lives here)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks, Skills, Crons — most of this module's symbols)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Telemetry sink)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (UI components / `/hooks` picker, renderer wiring)
> - [symbol_additions_v2_1_156_hooks.md](../00_overview/symbol_additions_v2_1_156_hooks.md) - This delta's new symbols

Key functions/objects added or touched in v2.1.143 → v2.1.156:

- `HOOK_EVENT_NAMES` (`jN`) — Canonical runtime event-name array; `"MessageDisplay"` is the newest, last entry (cli_inner_pretty.js:49259, member at 49289)
- `hookEventNameEnumSource` (`wj_`) — Parallel Zod-enum source event-name array (cli_inner_pretty.js:336608)
- `messageDisplayInputSchema` (`lj_`) — MessageDisplay input: `turn_id`/`message_id`/`index`/`final`/`delta` (cli_inner_pretty.js:337023)
- `messageDisplayOutputSchema` (`Mw_`) — `hookSpecificOutput` with the single optional `displayContent` (cli_inner_pretty.js:337161)
- `executeMessageDisplayHooks` (`l6$`) — Typed executor for one MessageDisplay flush; `forceSyncExecution` + `suppressPerInvocationTelemetry`, 10s timeout (cli_inner_pretty.js:551726)
- `createMessageDisplayEngine` (`OW9`) — Per-message streaming flush/debounce/in-flight-cap state machine (cli_inner_pretty.js:626930)
- `applyMessageDisplayToCompletedMessage` (`MW9`) — Completed-message (non-streamed/replayed) rewrite path, fail-open (cli_inner_pretty.js:627097)
- `pruneDisplayedMessageContent` (`t5q`) — GC for the `displayedMessageContent` override map (cli_inner_pretty.js:627085)
- `hasHookForEvent` (`wk`) — Cheap gate; guards whether the MessageDisplay pipeline is instantiated at all (cli_inner_pretty.js:552979)
- `executeStopHooks` (`fzH`) — Stop/SubagentStop dispatcher; builds the `background_tasks`/`session_crons` payload (cli_inner_pretty.js:551871)
- `stopHookInputSchema` (`Nj_`) / `subagentStopHookInputSchema` (`hj_`) — Gain the two arrays (cli_inner_pretty.js:336840, 336879)
- `mapBackgroundTasksForHook` (`v89`) / `mapSessionCronsForHook` (`k89`) — Registry/cron → hook-element mappers (cli_inner_pretty.js:551812, 551842)
- `MESSAGE_DISPLAY_FLUSH_FPS` (`Xxz`=10) / `MESSAGE_DISPLAY_DEBOUNCE_MS` (`AW9`=100) / `MESSAGE_DISPLAY_INFLIGHT_CAP` (`YW9`=3) / `MESSAGE_DISPLAY_TIMEOUT_MS` (`fW9`=10000) — Engine tuning constants (cli_inner_pretty.js:627129-627132)

(See [symbol_additions_v2_1_156_hooks.md](../00_overview/symbol_additions_v2_1_156_hooks.md) for the complete table, including the SessionStart `sessionTitle`/`reloadSkills` and the block-cap branch helpers.)

## Hook Lifecycle Changes (v2.1.156 view)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Session entry                                                            │
│   SessionStart hook output:                                              │
│     + sessionTitle  → startup/resume: KSH cache (live state, no persist) │
│                     → mid-session:    ih8 apply (US rename, source:hook) │
│                                       [NEW v2.1.152]                      │
│     + reloadSkills  → _C() + Bo() + Xc.emit() + telemetry  [NEW v2.1.152] │
│                       (re-scan skills/commands so hook-installed skills   │
│                        light up in-session — programmatic /reload-skills) │
│                                                                          │
│ Each turn — while assistant text STREAMS                                 │
│   message_start ─→ OW9.begin(apiId)   (gated by wk("MessageDisplay"))    │
│   delta(text)   ─→ raw += text                            [NEW]          │
│       whole-line flush (f) → debounce 100ms (O) → in-flight cap 3        │
│       dispatchFlush (A) → l6$ hook (sync, 10s) → P = displayContent ?? Δ │
│       appendChain (ordered) → output += P → onStreamingDisplay           │
│   message_stop  ─→ finalize() → final flush (whole buffer, may end mid)  │
│   entry landed  ─→ onMessageDisplay(apiId, output)                       │
│                    → displayedMessageContent[apiId]   (render override)  │
│   re-render / resume ─→ MW9(entry) re-applies hook on full text          │
│   (transcript on disk + model-visible text NEVER touched)                │
│                                                                          │
│ Turn end — Stop / SubagentStop                                           │
│   input + background_tasks: [ {id,type,status,description,...} ]  [v145] │
│         + session_crons:    [ {id,schedule,recurring,prompt}    ]  [v145]│
│           (in-flight filter uL, type labels er6, 1000-char cap hKq)     │
│   hook returns blockingErrors → re-enter model, stopHookActive=true     │
│     consecutive-block streak++                                          │
│     if streak > CLAUDE_CODE_STOP_HOOK_BLOCK_CAP (8)  [NEW v2.1.143]      │
│        → warn + override + end turn (max-turns checked FIRST)            │
│   telemetry tengu_stop_hook_block_count {count,is_subagent,             │
│             hit_max_turns,hit_cap}                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

### What changed in the 4-stage hook result lifecycle (v2.1.142 → v2.1.156)

The executor's lifecycle is still **execute → parse → apply → aggregate**. The diff in this window:

**Stage 0 (input build):** Stop/SubagentStop input gains `background_tasks` + `session_crons` (built by
`executeStopHooks`/`fzH` from the task registry + session cron list, mapped by `v89`/`k89`); SessionStart
input gains `session_title` (the current title, so a hook can decide whether to overwrite).

**Stage 1 (execute):** A new typed executor `executeMessageDisplayHooks` (`l6$`) runs with
`forceSyncExecution: true` (a display hook must be awaited — a backgrounded result would arrive after the
line is already on screen) and `suppressPerInvocationTelemetry: true` (so dozens of per-flush events are
replaced by one rolled-up `tengu_message_display_hooks` summary). It is driven not directly but by the
streaming engine `OW9`, which batches tokens into whole-line, debounced, in-flight-capped flushes.

**Stage 2 (parse):** `parseHookJSONOutput` (`p89`) / `c6$().safeParse(...)` now recognizes the
`MessageDisplay` → `displayContent` variant and the SessionStart `sessionTitle`/`reloadSkills` and
UserPromptSubmit `sessionTitle` fields.

**Stage 3 (apply):** `applyHookJSONOutput` (`ah8`) gains a `MessageDisplay` case (copy `displayContent`
through, `undefined` = passthrough) and the SessionStart/UserPromptSubmit cases copy `sessionTitle`/
`reloadSkills`.

**Stage 4 (aggregate):** The aggregator yields `displayContent` (consumed by the engine's flush loop),
`reloadSkills`, and `sessionTitle` as peer hook-output channels alongside the existing
`updatedToolOutput`/`preventContinuation`/`watchPaths`.

**Agent-loop (outside the executor):** The Stop-hook block-cap branch (in `01_agent_loop`) wraps the inner
Stop-hook executor `dispatchStopHookErrors` (`kT4`), bumps a consecutive-block counter, checks `maxTurns`
first then `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`, and on cap overflow yields a warning system message and ends
the turn.

## Cross-References

- **Agent loop / Stop branch**: the block-cap branch lives in the query generator (the agent-loop module is not part of this delta tree). It is documented from the hook side in [stop_hook_background_tasks_and_block_cap.md](./stop_hook_background_tasks_and_block_cap.md); the agent-loop symbols `kT4`/`Z_`/`VK` are indexed in [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md).
- **Skills / `/reload-skills`**: `reloadSkills` shares machinery with the slash command; see [../10_skill_system/](../10_skill_system/) for `_C`/`Bo`/`Xc` and the SessionStart title/reload symbols.
- **Background agents / crons**: `background_tasks` reads the task registry and `session_crons` the session cron list; see [../36_background_agents/](../36_background_agents/) and the cron subsystem for `isInFlightTask`/`getSessionCronTasks` provenance.
- **UI rendering**: the MessageDisplay render-side substitution and the `/hooks` event picker (`Vd4`) live in the renderer; see [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md).
- **Prior hook deltas (unchanged here)**: exec form, MCP-tool hooks, `continueOnBlock`, `terminalSequence`, `effort.level`, `duration_ms` — see [v2.1.142 hooks analysis](../../../claude_code_v_2.1.142/analyze/11_hooks/v2_1_142_README.md).

## Reading Order

1. **[stop_hook_background_tasks_and_block_cap.md](./stop_hook_background_tasks_and_block_cap.md)** — smallest, most self-contained delta; two well-scoped input/loop changes that build directly on the existing 2.1.88 Stop-hook contract. Good warm-up that re-grounds you in the hook input envelope and the agent-loop Stop branch.
2. **[session_start_title_and_reload_skills.md](./session_start_title_and_reload_skills.md)** — two new output fields with an interesting cache-vs-apply split and an ordering insight (`reloadSkills` exists because the skill index is built before SessionStart hooks run). Reinforces the aggregator/apply-switch plumbing.
3. **[message_display_event.md](./message_display_event.md)** — the flagship new event, read top-down: schemas → executor → apply/aggregate/gate → engine summary → design rationale. Start here for the *what* and *why* of MessageDisplay.
4. **[message_display_streaming_engine.md](./message_display_streaming_engine.md)** — the deep mechanics of `OW9`: read last, once you understand the event contract, for the whole-line/debounce/in-flight-cap algorithms, the race-then-serialize append, the fail-open fallback, and the renderer wiring.
