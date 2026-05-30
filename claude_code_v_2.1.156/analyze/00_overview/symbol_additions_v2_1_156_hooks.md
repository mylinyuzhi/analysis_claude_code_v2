# Symbol Additions — v2.1.156 Hooks (module 11_hooks, 2.1.143–156 delta)

These mappings cover every obfuscated identifier introduced or touched by the
**Hooks** delta in the v2.1.143 → v2.1.156 window. Three independent features land here:

1. **MessageDisplay** — a NEW display-only hook event (transform/hide streaming assistant
   text without touching the transcript or model-visible context): its two parallel
   event-name arrays, the lazy Zod input/output schemas, the `forceSyncExecution` executor,
   the apply case + aggregator yield + gate, the per-message streaming engine (`OW9`) with its
   internal closures (flush / debounce / in-flight-cap / ordered append / emit / abandon), the
   constants block, the completed-message rewrite path (`MW9`), the state-prune helper, and the
   renderer wiring (`displayedMessageContent`, `setStreamingDisplay`, `displayTransform`).
2. **SessionStart `sessionTitle` + `reloadSkills`** (2.1.152) — covered in this module's
   doc, with its symbols filed under module 10_skill_system / session-lifecycle in
   `symbol_additions_v2_1_156_*` siblings; only the Hooks-side schema/aggregator touch points
   are listed there. (The detailed `$U`/`KSH`/`ih8`/`Q6$`/`_C`/`Bo` mappings live in the
   `session_start_title_and_reload_skills.md` doc and are catalogued in the skills/session
   additions file, not duplicated here.)
3. **Stop/SubagentStop `background_tasks` + `session_crons`** (2.1.145) and the **stop-hook
   block cap** (2.1.143) — the two input arrays, their element schemas, the dispatcher, the two
   registry/cron mappers, the 1000-char cap helper + label map + in-flight filter, and the
   block-cap branch helpers.

Each row gives the v2.1.156 obfuscated identifier, the readable name, `file:line`, and type.
A representative sample of lines was verified by reading
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` at that location.

Cross-validated against:
- v2.1.156 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/` — the hook *platform*
  (`BaseHookInputSchema`, the per-event input union, the `hookSpecificOutput` union, the
  executor dispatch, `applyHookJSONOutput`, `hasHookForEvent`, `stop_hook_active`) is the
  unchanged precursor; **`MessageDisplay`, `displayContent`, the streaming engine, `sessionTitle`,
  `reloadSkills`, `background_tasks`, `session_crons`, the 1000-char cap, and the
  `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` block cap are all NEW post-2.1.88 (high confidence).**
  2.1.88 Stop input = `coreSchemas.ts:513-527`; SubagentStop = `:550-567`; SessionStart output
  = `:821-829` (`additionalContext`/`initialUserMessage`/`watchPaths` only).
- Module docs: `claude_code_v_2.1.156/analyze/11_hooks/{message_display_event,message_display_streaming_engine,session_start_title_and_reload_skills,stop_hook_background_tasks_and_block_cap}.md`

> **Home-index placement (single source of truth).** When merged into the central index, split
> the rows by their `category`:
> - **`symbol_index_core_features.md`** (Hooks) — every schema/executor/engine/Stop-hook symbol
>   below except the four UI-side identifiers.
> - **`symbol_index_infra_integration.md`** (UI Components / Slash Commands) — the renderer-side
>   identifiers: `Vd4` (`/hooks` event picker), `ky` (`displayTransform`), `Ln`
>   (`setStreamingDisplay`), and `displayedMessageContent` (app-state map).

> **Line-number & dedup notes (single source of truth):**
> - `jN` is the head of a comma-expression assignment block at 49259 (`((jN = [ … ])`); the
>   `"MessageDisplay"` member is the last entry of that array at 49289.
> - `wj_` is the parallel Zod-enum source array (byte-identical event list) ending at 336638; the
>   enum `Fo7 = y.enum(wj_)` is built one line later at 336640.
> - The four engine constants are declared together in one `var` block at 627128-627132
>   (`var HR$, Xxz = 10, AW9, YW9 = 3, fW9 = 1e4;`); `AW9` and `HR$` are *assigned* in the lazy
>   init thunk at 627139 (`((HR$ = require("crypto")), (AW9 = 1000 / Xxz))`). Rows cite each
>   name's declaration line; `HR$`/`AW9` additionally note 627139.
> - The engine's internal closures (`z`/`A`/`Y`/`f`/`O`/`M`) are single-letter locals **inside**
>   `OW9` (cli_inner_pretty.js:626930-627084); they are listed for the deep-dive's benefit but are
>   not module-global symbols.
> - **Seed duplicates collapsed:** `OW9` (`messageDisplayStreamEngine`≡`createMessageDisplayEngine`),
>   `MW9` (`applyMessageDisplayToCompletedMessage`≡`rewriteCompletedMessage`), `l6$`
>   (one `executeMessageDisplayHooks`), `wk` (`hasHookForEvent`≡`hasHooksForEvent`), and the four
>   constants `Xxz`/`AW9`/`YW9`/`fW9` (each seeded twice with a constant- and a variable-style
>   readable name) each appear **once** below, with the alias recorded in Notes.
> - `Ln` (628558) is the React `useState` setter destructured from `[ts, Ln] = useState(null)` —
>   the streaming-display setter, hence `setStreamingDisplay`.
> - `ky` (628561) is the `useMemo`-built engine instance, i.e. the `displayTransform` handle the
>   stream reducer drives (`begin`/`delta`/`finalize`/`entryLanded`/`newTurn`).

---

## Module: Hooks — 2.1.143–156 delta

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AW9` | `MESSAGE_DISPLAY_DEBOUNCE_MS` (`1000 / Xxz` = 100ms flush debounce window; declared 627130, assigned 627139) | cli_inner_pretty.js:627130 | constant |
| `ah8` | `applyHookJSONOutput` (folds each event's `hookSpecificOutput` into the result `M`; `MessageDisplay`/`SessionStart`/`UserPromptSubmit` cases copy `displayContent`/`sessionTitle`/`reloadSkills`) | cli_inner_pretty.js:552419 | function |
| `cM` | `baseHookInput` (lazy Zod base envelope: `session_id`/`transcript_path`/`cwd`/`permission_mode`/`agent_id`/`agent_type`/`effort`; intersected into every per-event input schema) | cli_inner_pretty.js:336641 | object |
| `c6$` | `hookJSONOutputSchema` (the unified `HookJSONOutput` discriminated union safe-parsed by `p89`; includes the `MessageDisplay`/`displayContent` variant) | cli_inner_pretty.js:550780 | object |
| `displayedMessageContent` | `displayedMessageContent` (app-state map `apiMessageId → displayed text`; default `{}`, written by the engine's `onMessageDisplay`, read by the render-side substitution, GC'd by `t5q`) | cli_inner_pretty.js:241514 | variable |
| `do7` | `hookInputUnion` (the giant per-event hook-input discriminated union; `lj_`/`MessageDisplay` is a member) | cli_inner_pretty.js:337054 | object |
| `er6` | `TASK_TYPE_LABELS` (registry discriminant → friendly hook-facing label: `local_bash→shell`, `local_agent→subagent`, `monitor_mcp→monitor`, `local_workflow→workflow`, …) | cli_inner_pretty.js:457418 | object |
| `Fo7` | `hookEventNameEnum` (`y.enum(wj_)` — the Zod enum built from the source event-name array) | cli_inner_pretty.js:336640 | object |
| `fW9` | `MESSAGE_DISPLAY_TIMEOUT_MS` (`1e4` = 10s per-flush hook budget; passed by every real caller in place of `q_`) | cli_inner_pretty.js:627132 | constant |
| `fzH` | `executeStopHooks` (Stop/SubagentStop dispatcher; selects event by subagent id and builds the `background_tasks`/`session_crons` payload when a `toolUseContext` is present) | cli_inner_pretty.js:551871 | function |
| `go7` | `sessionCronElementSchema` (per-element Zod schema for a scheduled wakeup: `id`/`schedule`/`recurring`/`prompt`) | cli_inner_pretty.js:336823 | object |
| `hj_` | `subagentStopHookInputSchema` (SubagentStop input schema; same two arrays added as Stop, plus `agent_id`/`agent_transcript_path`/`agent_type`) | cli_inner_pretty.js:336879 | object |
| `hKq` | `HOOK_FIELD_CHAR_CAP` (`1000` — char cap for a Stop-hook task `description`/`command` and cron `prompt`) | cli_inner_pretty.js:551845 | constant |
| `HR$` | `cryptoModule` (lazily-required `crypto`; provides `randomUUID()` for the engine's local `messageId`/`turnId`; declared 627128, assigned 627139) | cli_inner_pretty.js:627128 | variable |
| `jN` | `HOOK_EVENT_NAMES` (canonical runtime event-name array; `"MessageDisplay"` is the newest, last entry at 49289) | cli_inner_pretty.js:49259 | constant |
| `k89` | `mapSessionCronsForHook` (maps the session cron list to hook cron elements; renames `cron→schedule`, defaults `recurring→false`, truncates `prompt`) | cli_inner_pretty.js:551842 | function |
| `kT4` | `dispatchStopHookErrors` (inner Stop-hook executor returning `{blockingErrors, preventContinuation}`; the block-cap branch inspects its result) | cli_inner_pretty.js:450658 | function |
| `ky` | `displayTransform` (the `useMemo`-built `OW9` engine instance wired with renderer callbacks; the stream reducer drives `begin`/`delta`/`finalize`/`entryLanded`/`newTurn`) | cli_inner_pretty.js:628561 | variable |
| `l6$` | `executeMessageDisplayHooks` (typed executor for one MessageDisplay flush; builds the input, delegates to `QL` with `forceSyncExecution`/`suppressPerInvocationTelemetry`, 10s timeout) | cli_inner_pretty.js:551726 | function |
| `lj_` | `messageDisplayInputSchema` (MessageDisplay input: `turn_id`/`message_id`/`index`/`final`/`delta` intersected onto `cM`) | cli_inner_pretty.js:337023 | object |
| `Ln` | `setStreamingDisplay` (React `useState` setter for the transient streaming-overlay text; the engine's `onStreamingDisplay` callback) | cli_inner_pretty.js:628558 | function |
| `Mw_` | `messageDisplayOutputSchema` (the `hookSpecificOutput` schema for MessageDisplay carrying the single optional `displayContent`) | cli_inner_pretty.js:337161 | object |
| `MW9` | `applyMessageDisplayToCompletedMessage` (a.k.a. `rewriteCompletedMessage`; one-shot MessageDisplay transform for non-streamed / replayed assistant messages, fail-open to the original) | cli_inner_pretty.js:627097 | function |
| `Nj_` | `stopHookInputSchema` (Stop input schema; gains `background_tasks` + `session_crons` in 2.1.145) | cli_inner_pretty.js:336840 | object |
| `OW9` | `createMessageDisplayEngine` (a.k.a. `messageDisplayStreamEngine`; factory returning the per-message streaming flush/debounce/in-flight-cap state machine) | cli_inner_pretty.js:626930 | function |
| `p89` | `parseHookJSONOutput` (`c6$().safeParse(...)` of a hook's stdout JSON; validates the `MessageDisplay`/`displayContent` variant) | cli_inner_pretty.js:552329 | function |
| `q_` | `DEFAULT_HOOK_TIMEOUT_MS` (`600000` = 10min default hook timeout; `l6$`'s default, overridden by `fW9` for MessageDisplay) | cli_inner_pretty.js:395687 | constant |
| `QL` | `executeHooks` (the generic hook-execution generator every typed executor delegates to; carries `forceSyncExecution`/`suppressPerInvocationTelemetry`) | cli_inner_pretty.js:553174 | function |
| `Qo7` | `backgroundTaskElementSchema` (per-element Zod schema for one in-flight background task: `id`/`type`/`status`/`description` + type-conditional `command`/`agent_type`/`server`/`tool`/`name`) | cli_inner_pretty.js:336795 | object |
| `t5q` | `pruneDisplayedMessageContent` (GC of `displayedMessageContent`: drops override entries whose assistant `message.id` is no longer in the live message list; identity short-circuit) | cli_inner_pretty.js:627085 | function |
| `th8` | `runShellHook` (shell-hook subprocess runner; honors `forceSyncExecution` by blocking on an "async" response instead of fire-and-forget; declared 552607, invoked by `QL` at 553613) | cli_inner_pretty.js:552607 | function |
| `ub$` | `truncateWithMarker` (truncate-to-budget then append `… [+N chars]`; used on Stop-hook `description`/`command`/`prompt`) | cli_inner_pretty.js:9798 | function |
| `uL` | `isInFlightTask` (Stop-hook task filter: keep only `running`/`pending` tasks that are not explicitly `isBackgrounded:false`) | cli_inner_pretty.js:336125 | function |
| `v89` | `mapBackgroundTasksForHook` (maps the live task registry to hook task elements; filters in-flight, labels the type, populates one conditional field per type, truncates) | cli_inner_pretty.js:551812 | function |
| `Vd4` | `hookEventPickerComponent` (the `/hooks` event-picker UI component; consumes the `hookEventMetadata` summary/description blocks) | cli_inner_pretty.js:515190 | function |
| `wj_` | `hookEventNameEnumSource` (parallel event-name source array fed into the Zod enum `Fo7`; `"MessageDisplay"` member at 336638) | cli_inner_pretty.js:336608 | constant |
| `wk` | `hasHookForEvent` (a.k.a. `hasHooksForEvent`; cheap gate returning true iff any policy/user/plugin/session hook is configured for an event; guards the whole MessageDisplay pipeline) | cli_inner_pretty.js:552979 | function |
| `WG` | `getSessionCronTasks` (session cron-task list accessor; `mapSessionCronsForHook`'s default argument) | cli_inner_pretty.js:2994 | function |
| `w5` | `buildBaseHookInput` (runtime builder of the common `session_id`/`transcript_path`/`cwd`/`agent_*`/`effort` envelope spread into each event's input) | cli_inner_pretty.js:552312 | function |
| `Xxz` | `MESSAGE_DISPLAY_FLUSH_FPS` (`10` — flush-rate divisor; `AW9 = 1000/Xxz` → 100ms; the meaningful "≤10 flushes/sec" budget knob) | cli_inner_pretty.js:627129 | constant |
| `YW9` | `MESSAGE_DISPLAY_INFLIGHT_CAP` (`3` — max concurrent in-flight flush hook passes; back-pressure for a slow hook) | cli_inner_pretty.js:627131 | constant |

---

## Engine-internal closures (locals inside `OW9`, cli_inner_pretty.js:626930-627084)

These are single-letter closures captured inside `createMessageDisplayEngine`; they are not
module-global symbols but are named here for the streaming-engine deep-dive.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A` | `dispatchFlush` (run one MessageDisplay hook pass for a flushed chunk; race the hook, serialize the append through `appendChain`, fall back to the original delta on error/timeout) | cli_inner_pretty.js:626938 | function |
| `f` | `flushWholeLines` (slice `raw` up to the last newline — whole lines only; final flush takes the whole buffer even mid-line) | cli_inner_pretty.js:626993 | function |
| `M` | `abandonTurn` (cancel an in-flight turn on supersede/`newTurn`: set `abandoned`, clear the timer, abort the controller) | cli_inner_pretty.js:627031 | function |
| `O` | `scheduleFlush` (leading-then-trailing 100ms debounce; early-outs on pending timer, in-flight cap, or no new complete line) | cli_inner_pretty.js:627007 | function |
| `Y` | `maybeEmitSummary` (post-flush hub: re-drive the scheduler while streaming, run the deferred final flush, emit the once-per-message `tengu_message_display_hooks` telemetry when drained) | cli_inner_pretty.js:626977 | function |
| `z` | `emit` (route engine `output` to the renderer: `onMessageDisplay(apiMessageId, output)` when `done`, else `onStreamingDisplay(output)`; no-op when `abandoned`) | cli_inner_pretty.js:626933 | function |

---

## Notes & gaps

- **Telemetry events (no obfuscated symbol — emitted via the `d` sink):**
  `tengu_message_display_hooks` (`{flushCount, errorCount, totalDurationMs, maxDurationMs}`, once
  per streamed message — cli_inner_pretty.js:626983), `tengu_stop_hook_block_count`
  (`{count, is_subagent, hit_max_turns, hit_cap}`, three mutually-exclusive sites —
  cli_inner_pretty.js:451886/451893/451906), and the SessionStart `hook_session_start_reload_skills`
  counter (cli_inner_pretty.js:270671). They are payload contracts, not symbols, so they are not
  table rows.
- **`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`** is an env var (default 8, `0` disables, garbage → 8),
  read inline in the agent-loop block-cap branch (cli_inner_pretty.js:451904 area). It is a string
  literal, not an obfuscated identifier, so it has no row; the surrounding helpers `kT4`
  (`dispatchStopHookErrors`), `Z_` (`makeSystemMessage`, the override warning, cli_inner_pretty.js:445864),
  and `VK` (`makeProgressMessage`, the max-turns message) belong to the agent-loop module
  (`01_agent_loop`) and are referenced here only as the block-cap branch's collaborators.
- **SessionStart `sessionTitle`/`reloadSkills` symbols** (`$U`/`OP$`/`KSH`/`ih8`/`Q6$`/`US`/`RzH`/
  `xjH`/`_C`/`Bo`/`Xc`/`wu`/`niH`/`YN6`/`v3`/`FA`/`PJz`) are documented in
  `session_start_title_and_reload_skills.md`; because they straddle Hooks, Skills (10_skill_system),
  and session lifecycle (00 overview), their authoritative index home is the skills/session
  additions consolidation, not this Hooks file. Only the shared apply-switch (`ah8`) and aggregator
  touch points overlap with this module and are already listed above.
- **Render-side substitution** (cli_inner_pretty.js:394840-394846) reads
  `appState.displayedMessageContent[apiMessageId]` and is gated by `!verbose`; the inline
  memo-cache slots there are anonymous (no stable obfuscated name) and are documented in
  `message_display_streaming_engine.md` rather than indexed.
- `q_` (`DEFAULT_HOOK_TIMEOUT_MS`, 600000) and `QL` (`executeHooks`), `w5` (`buildBaseHookInput`),
  `ah8` (`applyHookJSONOutput`), and `p89` (`parseHookJSONOutput`) are **pre-existing 2.1.88
  platform symbols** (their line numbers shifted in 2.1.156 but the functions predate this delta);
  they are listed because the MessageDisplay feature plugs into them, not because they are net-new.
