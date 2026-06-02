# MessageDisplay Hook Event — Transform/Hide Streaming Assistant Text (2.1.156)

## TL;DR

`MessageDisplay` is a **NEW** hook event (added between 2.1.88 and 2.1.156; flagship work in the 2.1.143–156 window) that lets a hook **rewrite or hide assistant message text on screen** while it streams — without ever touching the transcript that is saved to disk or the text the model itself sees on the next turn. It is the only hook in the catalog that is **display-only**.

It fires once per "flush" of whole-line deltas during streaming and once more on the final flush. A dedicated streaming engine (`OW9`) accumulates raw model text, slices off whole completed lines, debounces flushes (~100ms), caps in-flight hook invocations (3), and replaces the on-screen text with the hook's `displayContent`. A separate completed-message path (`MW9`) re-runs the hook against fully landed transcript entries so the substitution survives re-renders. If the hook crashes, times out, exits non-zero, or returns nothing, the **original delta is shown** — the feature can only ever change pixels, never correctness.

- Event name registered in both `HOOK_EVENT_NAMES` arrays: `jN` (cli_inner_pretty.js:49289) and `wj_` (cli_inner_pretty.js:336638).
- Input schema `lj_` (cli_inner_pretty.js:337023-337050): `turn_id`, `message_id`, `index`, `final`, `delta`.
- Output schema `Mw_` (cli_inner_pretty.js:337161-337175): `displayContent`.
- Executor `l6$` (cli_inner_pretty.js:551726-551745): `forceSyncExecution: true`, `suppressPerInvocationTelemetry: true`, 10s timeout.
- Apply case in `applyHookJSONOutput` (cli_inner_pretty.js:552584-552586).
- Aggregator yield (cli_inner_pretty.js:553907).
- Gate `wk("MessageDisplay")` (cli_inner_pretty.js:552979-552990; called at 627042 and 627098).
- Streaming engine `OW9` (cli_inner_pretty.js:626930-627084); completed-message path `MW9` (cli_inner_pretty.js:627097-627127).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks (this event)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent loop / streaming
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry, prompt building
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI rendering

Key symbols in this document:

- `HOOK_EVENT_NAMES` (`jN`) — Canonical event-name array; `"MessageDisplay"` is the last entry (cli_inner_pretty.js:49259-49290).
- `hookEventNameEnumSource` (`wj_`) — Zod-enum source array, identical list; the enum itself is `hookEventNameEnum` (`Fo7`) (cli_inner_pretty.js:336608-336639).
- `messageDisplayInputSchema` (`lj_`) — Hook input schema for `MessageDisplay` (cli_inner_pretty.js:337023-337050).
- `messageDisplayOutputSchema` (`Mw_`) — `hookSpecificOutput` schema with `displayContent` (cli_inner_pretty.js:337161-337175).
- `executeMessageDisplayHooks` (`l6$`) — Executor generator for the event (cli_inner_pretty.js:551726-551745).
- `executeHooks` (`QL`) — Generic hook execution generator that `l6$` delegates to (cli_inner_pretty.js:553174-553228).
- `buildBaseHookInput` (`w5`) — Builds the common `session_id/transcript_path/cwd/...` envelope (cli_inner_pretty.js:552312-552328).
- `applyHookJSONOutput` (`ah8`) — Folds parsed hook JSON into a result; `MessageDisplay` case at (cli_inner_pretty.js:552419, case at 552584-552586).
- `hasHookForEvent` (`wk`) — Gate that returns true iff any hook is configured for the event (cli_inner_pretty.js:552979-552990).
- `messageDisplayStreamEngine` (`OW9`) — Per-message streaming flush/debounce/cap state machine (cli_inner_pretty.js:626930-627084).
- `applyMessageDisplayToCompletedMessage` (`MW9`) — Re-runs the hook against a landed transcript entry (cli_inner_pretty.js:627097-627127).
- `MESSAGE_DISPLAY_INFLIGHT_CAP` (`YW9`) — Max concurrent in-flight flush hooks = 3 (cli_inner_pretty.js:627131).
- `MESSAGE_DISPLAY_FLUSH_FPS` (`Xxz`) — Flush rate divisor = 10 (→ 100ms debounce) (cli_inner_pretty.js:627129).
- `MESSAGE_DISPLAY_DEBOUNCE_MS` (`AW9`) — Debounce window = `1000/Xxz` = 100ms (cli_inner_pretty.js:627130, 627139).
- `MESSAGE_DISPLAY_TIMEOUT_MS` (`fW9`) — Per-flush hook timeout = 10000ms (cli_inner_pretty.js:627132).
- `DEFAULT_HOOK_TIMEOUT_MS` (`q_`) — Default hook timeout = 600000ms; **not** used here (cli_inner_pretty.js:395687).
- `hookEventMetadata.MessageDisplay` — Prompt/help config block for `/hooks` (cli_inner_pretty.js:515177-515184).

---

## 1. Cross-Validation: This Is NEW Post-2.1.88

**Confidence: HIGH. Marked NEW.**

There is no `MessageDisplay` anywhere in the 2.1.88 readable source tree:

- `grep -rc "MessageDisplay" /lyz/codespace/3rd/claude-code/src/` → zero matches.
- In 2.1.88, the `HOOK_EVENT_NAMES` list ended at `FileChanged` (`src/entrypoints/sdk/coreSchemas.ts:382`, `src/entrypoints/sdk/coreTypes.ts:52`). In 2.1.156 the array is identical up through `FileChanged` and then appends `MessageDisplay` (cli_inner_pretty.js:49288-49289), confirming it is the newest event grafted onto the end of an existing list.
- The `hookSpecificOutput` field `displayContent`, the input fields `turn_id`/`message_id`/`final`/`delta` in a `MessageDisplay` literal, and the streaming engine `OW9`/`MW9` have **no precursor** in 2.1.88 — the only display-rewriting hooks there were `updatedToolOutput`/`updatedMCPToolOutput` (tool output, not assistant text).

What **is** a precursor (and gives high confidence in the mechanism) is the entire surrounding plumbing: the `HOOK_EVENT_NAMES` array, the zod-union of per-event input schemas, the per-event `hookSpecificOutput` discriminated union, the executor-table dispatch, `applyHookJSONOutput`, and the `hasHookForEvent` gate all existed in 2.1.88. `MessageDisplay` is a new event slotted into a mature platform.

---

## 2. Event Registration — `HOOK_EVENT_NAMES`

The event name appears in **two** parallel arrays. The first (`jN`) is the canonical runtime list; the second (`wj_`) is the source array fed into the zod enum `Fo7 = y.enum(wj_)` (cli_inner_pretty.js:336640). Keeping them in lockstep is what makes a string a "real" hook event everywhere in the codebase.

```javascript
// ============================================
// HOOK_EVENT_NAMES (jN) - canonical event list; MessageDisplay is the newest, last entry
// Location: cli_inner_pretty.js:49259-49290
// ============================================

// ORIGINAL (for source lookup):
jN = [ "PreToolUse", "PostToolUse", "PostToolUseFailure", "PostToolBatch", "Notification", "UserPromptSubmit",
  "UserPromptExpansion", "SessionStart", "SessionEnd", "Stop", "StopFailure", "SubagentStart", "SubagentStop",
  "PreCompact", "PostCompact", "PermissionRequest", "PermissionDenied", "Setup", "TeammateIdle", "TaskCreated",
  "TaskCompleted", "Elicitation", "ElicitationResult", "ConfigChange", "WorktreeCreate", "WorktreeRemove",
  "InstructionsLoaded", "CwdChanged", "FileChanged", "MessageDisplay" ];

// READABLE (for understanding):
const HOOK_EVENT_NAMES = [
  /* ...existing 29 events through "FileChanged"... */
  "MessageDisplay",   // NEW: fires while assistant text is displayed (display-only)
];

// Mapping: jN→HOOK_EVENT_NAMES; the parallel zod-enum source array wj_ (336608-336639) is byte-identical.
```

**The two event-name arrays are not the only registration sites — and the others are load-bearing.** Beyond `jN`/`wj_`, `MessageDisplay` is also a *key* in the per-source hook-config maps. The plugin hook-config builder `buildPluginHookConfigMap` (`hc5`, cli_inner_pretty.js:270475) initializes a fresh per-event map seeded with all 30 `HOOK_EVENT_NAMES` keys to `[]`, ending in `MessageDisplay: []` (cli_inner_pretty.js:270506). The plugin-aggregation map inside `loadPluginHooks` (`X8H`, cli_inner_pretty.js:270579) seeds the identical map, also ending in `MessageDisplay: []` (cli_inner_pretty.js:270611), and merges each plugin via `hc5(K)` (cli_inner_pretty.js:270616) with `$[z].push(..._[z])` (cli_inner_pretty.js:270617).

This is structural, not cosmetic. `hc5`'s merge loop walks the plugin's declared `hooksConfig` entries and **silently drops any event that is not a key in the seed map** — the guard is `if (!$[_]) continue;` (cli_inner_pretty.js:270511, inside the `Object.entries(H.hooksConfig)` loop opened at 270509). So a plugin (or any source-config) that declares a `MessageDisplay` hook would have it discarded — never loaded, never run — if `MessageDisplay` were absent from this seed map. The division of labor is precise: registering the event in `jN`/`wj_` makes `"MessageDisplay"` a *valid* hook-event string everywhere the Zod enum is consulted; registering it as a key in the `hc5`/`loadPluginHooks` seed maps is what makes plugin- and source-defined `MessageDisplay` hooks actually survive the merge and load. Both are required for the feature to work end-to-end for plugin-provided hooks.

**Cross-validation (HIGH confidence): the registration *mechanism* is the unchanged 2.1.88 precursor; only the `MessageDisplay` key is new.** In 2.1.88 the same per-plugin builder exists as `convertPluginHooksToMatchers` (`src/utils/plugins/loadPluginHooks.ts:30-86`) with the identical skip-unknown-event guard `if (!pluginMatchers[hookEvent]) continue;` (`loadPluginHooks.ts:68-70`), and the aggregating `loadPluginHooks` memoized loader exists at `loadPluginHooks.ts:91`. The 2.1.88 seed maps end at `FileChanged: []` (`loadPluginHooks.ts:58`); in 2.1.156 the same maps append `MessageDisplay: []` (and `PostToolBatch: []`). So the obfuscated `hc5`/`X8H` are the evolved versions of `convertPluginHooksToMatchers`/`loadPluginHooks`, and the only delta relevant to this event is the added `MessageDisplay` seed key — which is exactly why that key is load-bearing for plugin hooks.

The `MessageDisplay` literal union member `lj_` is added to the giant input-union `do7` at (cli_inner_pretty.js:337085), so any incoming hook payload with `hook_event_name: "MessageDisplay"` parses into the typed shape below.

---

## 3. Input Schema — `lj_` (turn_id, message_id, index, final, delta)

The input schema is `cM().and(...)`: it intersects the **base hook input** `cM` (`session_id`, `transcript_path`, `cwd`, `permission_mode`, `agent_id`, `agent_type`, `effort` — cli_inner_pretty.js:336641-336659) with the event-specific fields. The field descriptions are unusually detailed because the contract for a streaming hook is subtle.

```javascript
// ============================================
// messageDisplayInputSchema (lj_) - MessageDisplay hook input (display-only streaming contract)
// Location: cli_inner_pretty.js:337023-337050
// ============================================

// ORIGINAL (for source lookup):
lj_ = yH(() =>
  cM().and(y.object({
    hook_event_name: y.literal("MessageDisplay"),
    turn_id: y.string().describe("UUID of the current turn."),
    message_id: y.string().describe("UUID of the assistant message being displayed. Stable across every flush of the same message. Not the API msg_… id."),
    index: y.number().int().describe("Zero-based index of this delta within the message. Increments by one per flush."),
    final: y.boolean().describe("True on the message's last flush. Exactly one flush per message has it."),
    delta: y.string().describe("The newly completed lines since the prior flush. Always whole lines, except on the final flush which may end mid-line. The delta of the final flush is empty when the message ends on a newline; treat final as the end-of-message signal regardless."),
  }))
  .describe("Hook input for the MessageDisplay event. Fired with each batch of newly completed lines while an assistant message streams. Display-only: the stored message and what the model sees are untouched."));

// READABLE (for understanding):
const messageDisplayInputSchema = baseHookInput().and(z.object({
  hook_event_name: z.literal("MessageDisplay"),
  turn_id:    z.string(),   // UUID of the turn; stable for the whole agent turn
  message_id: z.string(),   // UUID local to the display engine — NOT the API "msg_..." id
  index:      z.number().int(),  // 0-based flush counter within this message
  final:      z.boolean(),  // exactly one flush per message has final === true
  delta:      z.string(),   // newly completed whole lines (final flush may end mid-line / be "")
}));

// Mapping: lj_→messageDisplayInputSchema, cM→baseHookInput, yH→lazy zod factory, y→zod
```

### Field semantics (and why each matters)

- **`turn_id`** — Lets a hook correlate every flush across the whole agent turn (a turn can render multiple assistant messages, e.g. with interleaved tool calls). Sourced from the engine's `turnId` (cli_inner_pretty.js:626945, 627049), regenerated only on `newTurn()` (cli_inner_pretty.js:627038).
- **`message_id`** — A *display-engine-local* UUID (`HR$.randomUUID()` at cli_inner_pretty.js:626931/627048), explicitly **not** the API `msg_…` id. This is deliberate: the engine must have a stable key even before the API message id is known, and re-rendering the same message must not change the key. The completed-message path mints its own UUID per call (cli_inner_pretty.js:627103).
- **`index`** — Monotonic 0-based flush counter so a hook can detect dropped/out-of-order flushes and so the executor can derive a unique `toolUseID` (`${message_id}-${index}`, cli_inner_pretty.js:551738).
- **`final`** — The end-of-message signal. The doc string is emphatic that `final` is the source of truth: the final delta may be empty (when the message ends on a newline), so a hook must not rely on "empty delta" to detect end.
- **`delta`** — Whole completed lines only, except the final flush which may end mid-line. This whole-line guarantee is what makes the engine's debounce + line-slicing strategy (section 7) work, and it lets a transforming hook operate on syntactically meaningful chunks.

---

## 4. Output Schema — `Mw_` (displayContent)

The `hookSpecificOutput` for `MessageDisplay` carries exactly one optional field. The two-layer "omit to keep original" contract is encoded in the description.

```javascript
// ============================================
// messageDisplayOutputSchema (Mw_) - hookSpecificOutput for MessageDisplay
// Location: cli_inner_pretty.js:337161-337175
// ============================================

// ORIGINAL (for source lookup):
Mw_ = yH(() =>
  y.object({
    hookEventName: y.literal("MessageDisplay"),
    displayContent: y.string().optional()
      .describe("Text displayed in place of the delta. Omit (or return the delta unchanged) to display the original."),
  })
  .describe("Hook-specific output for the MessageDisplay event. Display-only: replaces the delta on screen without changing the stored message."));

// READABLE (for understanding):
const messageDisplayOutputSchema = z.object({
  hookEventName:  z.literal("MessageDisplay"),
  displayContent: z.string().optional(),  // shown in place of delta; omit → show original delta
});

// Mapping: Mw_→messageDisplayOutputSchema, hookEventName→discriminator literal, y→zod
```

The same `MessageDisplay` variant is also present inside the overall `HookJSONOutput` union (cli_inner_pretty.js:550767-550775), with the identical `displayContent` field and description — this is the schema actually validated by the top-level parser `p89` / `c6$().safeParse(...)` (cli_inner_pretty.js:550780, 552331).

```javascript
// ============================================
// HookJSONOutput - MessageDisplay variant in the overall hookSpecificOutput union
// Location: cli_inner_pretty.js:550767-550775
// ============================================

// ORIGINAL (for source lookup):
y.object({
  hookEventName: y.literal("MessageDisplay"),
  displayContent: y.string()
    .describe("Text displayed in place of the delta. Omit (or return the delta unchanged) to display the original.")
    .optional(),
}),

// READABLE (for understanding):
z.object({
  hookEventName:  z.literal("MessageDisplay"),
  displayContent: z.string().optional(),
}),

// Mapping: same field set as Mw_; this copy lives in the unified HookJSONOutput discriminated union.
```

To **hide** text, return `displayContent: ""` (empty string is a valid `displayContent`). To **transform**, return the rewritten text. To **passthrough**, omit the field (or return the delta unchanged), exit 0.

---

## 5. The Envelope (ASCII)

```
                         MessageDisplay HOOK ENVELOPE
   ┌──────────────────────────── INPUT (lj_) ────────────────────────────┐
   │ {                                                                     │
   │   session_id, transcript_path, cwd, permission_mode,   ← base (cM/w5) │
   │   agent_id?, agent_type?, effort?,                                    │
   │   hook_event_name: "MessageDisplay",                                  │
   │   turn_id:    "<turn uuid>",                                          │
   │   message_id: "<engine-local uuid>",   ← NOT the API msg_... id       │
   │   index:      N,                        ← 0-based flush counter       │
   │   final:      true|false,               ← exactly one true / message  │
   │   delta:      "<newly completed lines>" ← whole lines (final may cut) │
   │ }                                                                     │
   └──────────────────────────────────────────────────────────────────────┘
                                   │  stdin JSON
                                   ▼
                         ┌───────────────────┐
                         │  user hook script │  exit 0 → use response
                         │  (10s budget,fW9) │  exit ≠0 → show original delta
                         └───────────────────┘
                                   │  stdout JSON
                                   ▼
   ┌────────────────────────── OUTPUT (Mw_) ─────────────────────────────┐
   │ { "hookSpecificOutput": {                                            │
   │     "hookEventName": "MessageDisplay",                               │
   │     "displayContent": "<shown in place of delta>"  ← omit=passthrough│
   │ } }                                                                  │
   └──────────────────────────────────────────────────────────────────────┘
                                   │
        applyHookJSONOutput case  → M.displayContent = displayContent
                                   │
        aggregator (553907)       → yield { displayContent }
                                   │
        OW9 flush loop (626956)   → P = displayContent  (else P stays = delta)
                                   ▼
                          on-screen text replaced
              (transcript + model-visible text NEVER touched)
```

---

## 6. Executor — `l6$` (forceSyncExecution + suppressPerInvocationTelemetry)

`l6$` is the typed wrapper that turns engine arguments into a `MessageDisplay` hook input and delegates to the generic executor `QL` (`executeHooks`). It is registered in the executor dispatch table as `MessageDisplay: l6$` (cli_inner_pretty.js:552145) and exported as `executeMessageDisplayHooks` (cli_inner_pretty.js:552191).

```javascript
// ============================================
// executeMessageDisplayHooks (l6$) - run MessageDisplay hooks for one flush, synchronously
// Location: cli_inner_pretty.js:551726-551745
// ============================================

// ORIGINAL (for source lookup):
async function* l6$(H, $, q, K = q_) {
  let _ = {
    ...w5(void 0),
    hook_event_name: "MessageDisplay",
    turn_id: H.turnId,
    message_id: H.messageId,
    index: H.index,
    final: H.final,
    delta: H.delta,
  };
  yield* QL({
    hookInput: _,
    toolUseID: `${H.messageId}-${H.index}`,
    signal: q,
    timeoutMs: K,
    getAppState: $,
    forceSyncExecution: !0,
    suppressPerInvocationTelemetry: !0,
  });
}

// READABLE (for understanding):
async function* executeMessageDisplayHooks(args, getAppState, signal, timeoutMs = DEFAULT_HOOK_TIMEOUT_MS) {
  const hookInput = {
    ...buildBaseHookInput(undefined),         // session_id, transcript_path, cwd, agent_*, effort
    hook_event_name: "MessageDisplay",
    turn_id:    args.turnId,
    message_id: args.messageId,
    index:      args.index,
    final:      args.final,
    delta:      args.delta,
  };
  yield* executeHooks({
    hookInput,
    toolUseID: `${args.messageId}-${args.index}`,  // unique per flush
    signal,
    timeoutMs,                                       // callers pass fW9 = 10_000 ms
    getAppState,
    forceSyncExecution: true,                        // wait for the hook, don't fire-and-forget
    suppressPerInvocationTelemetry: true,            // no per-flush tengu_run_hook spam
  });
}

// Mapping: l6$→executeMessageDisplayHooks, H→args, $→getAppState, q→signal, K→timeoutMs,
//          w5→buildBaseHookInput, QL→executeHooks, q_→DEFAULT_HOOK_TIMEOUT_MS (600000)
```

### `forceSyncExecution: true` — why

A normal hook may return an "async" envelope (`{ async: true, asyncTimeout }`) telling Claude Code "I started work in the background, don't wait." That is wrong for a display hook: by the time a backgrounded result returns, the line is already on screen, so async would be a silent no-op. `forceSyncExecution: true` flows through `QL` (parameter `O`, cli_inner_pretty.js:553184) into the shell-hook runner `th8` (defined at cli_inner_pretty.js:552607, invoked by `QL` at cli_inner_pretty.js:553613); when an async response is detected under this flag the runtime logs *"Detected async hook but forceSyncExecution is true, waiting for completion"* (cli_inner_pretty.js:552777) and blocks for the real result. So a `MessageDisplay` hook is always awaited, bounded by the 10s timeout.

### `suppressPerInvocationTelemetry: true` — why

A streaming response can produce dozens of flushes per message. Emitting `tengu_run_hook` / `tengu_repl_hook_finished` for every flush (the `!M` branches at cli_inner_pretty.js:553202, 553232, 553241) would flood telemetry. Instead the engine emits **one aggregated** `tengu_message_display_hooks` event per message with `flushCount`, `errorCount`, `totalDurationMs`, `maxDurationMs` (cli_inner_pretty.js:626983-626988). `M` in `QL` is `suppressPerInvocationTelemetry`; when set, per-invocation telemetry and the `fE7` progress preamble are skipped.

### The timeout subtlety

`l6$`'s default `timeoutMs` is `q_` = 600000ms (10 minutes). But **every real caller overrides it** with `fW9` = 10000ms (10s): the streaming engine (cli_inner_pretty.js:626948) and the completed-message path (cli_inner_pretty.js:627103). So in practice a display hook has a 10-second budget per flush — short enough that a slow hook degrades to "show original" quickly rather than stalling the UI.

---

## 7. The Streaming Engine — `OW9` (flush / debounce / in-flight cap)

`OW9` is a closure-based per-message state machine. It is constructed once in the REPL (cli_inner_pretty.js:628561-628577) with three callbacks: `getAppState`, `onStreamingDisplay` (push the current on-screen string), and `onMessageDisplay` (commit the final text into `displayedMessageContent` state, cli_inner_pretty.js:628569-628574).

### State object (cli_inner_pretty.js:627046-627064)

```
{
  apiMessageId,        // the API msg_... id this stream belongs to
  messageId,           // engine-local UUID sent to the hook
  turnId,              // current turn UUID
  raw: "",             // all model text seen so far (the source of truth)
  flushedOffset: 0,    // how many chars of raw have been flushed
  index: 0,            // flush counter (becomes input.index)
  output: "",          // accumulated *displayed* text (post-hook)
  appendChain,         // a promise chain that serializes appends in order
  lastFlushAt, flushTimer,
  inFlight: 0,         // concurrent hook invocations
  finalized, finalDispatched, done, abandoned,
  stats: { totalDurationMs, maxDurationMs, errorCount, summaryEmitted },
}
```

### Public API (cli_inner_pretty.js:627035-627082)

- **`begin(apiId)`** — Start a new message. First aborts any unfinished prior message (`M`), then **gates on `wk("MessageDisplay")`** (cli_inner_pretty.js:627042). If no hook is configured, it sets `$ (onStreamingDisplay)` to `null` (meaning "render normally, engine inert") and returns. Otherwise it allocates fresh state and pushes `""`.
- **`delta(text)`** — Append model text to `raw`, then call `O` (the debounced scheduler).
- **`entryLanded(entry)`** — When the transcript entry for this message lands, mark `done` and commit via `z`.
- **`finalize()`** — End the message: set `finalized`, force a final flush `f(state, true)`, commit.
- **`newTurn()`** — Abort the current message and rotate `turnId`.

### Flush scheduler `O` and flusher `f` (the algorithm)

**What it does:** Convert a stream of arbitrary model chunks into a series of *whole-line* hook invocations, rate-limited and bounded.

**How it works:**
1. `delta()` appends to `raw` and calls `O` (cli_inner_pretty.js:627069).
2. `O` (cli_inner_pretty.js:627007-627030) returns early if a flush is already scheduled, if `inFlight >= YW9` (3), or if there is **no new complete line** (`raw.lastIndexOf("\n") + 1 <= flushedOffset`). It only ever flushes on line boundaries.
3. If at least `AW9` (100ms) has elapsed since `lastFlushAt`, it flushes immediately via `f(state, false)`; otherwise it sets a `setTimeout` for the remainder of the debounce window.
4. `f` (cli_inner_pretty.js:626993-627006) computes the slice end: for a final flush it is `raw.length`; otherwise it is the index just past the last newline (`raw.lastIndexOf("\n") + 1`). It slices `raw[flushedOffset .. end]` as the `delta`, advances `flushedOffset`, increments `index`, and calls `A` (the invoker). It also early-returns if `inFlight >= YW9` (the cap is checked both in `O` and `f`).
5. `A` (cli_inner_pretty.js:626938-626975) increments `inFlight`, runs `l6$` for that flush, and inside the loop sets the local `P = displayContent` if the hook returned one (else `P` stays equal to the original delta `J`). Errors/timeouts are caught, increment `errorCount`, and leave `P` as the original delta (cli_inner_pretty.js:626958-626963). Finally it appends `P` to `output` **through `appendChain`** so displayed pieces stay in stream order even though hook calls finish out of order.
6. After each invocation `Y` re-checks: if finalized and all in-flight done, emit the aggregated `tengu_message_display_hooks` telemetry once.

**Why this approach:**
- **Whole-line flushing** matches the input contract (`delta` is whole lines) and gives a transforming hook syntactically meaningful units (e.g. a full markdown line) instead of half tokens.
- **Debounce (100ms / 10fps)** caps hook spawn rate during fast streaming, trading a tiny latency for far fewer subprocess spawns.
- **In-flight cap (3)** bounds resource use if the hook is slow; new flushes simply wait, and the whole-line content is preserved in `raw` so nothing is lost.
- **`appendChain` promise serialization** is the clever part: hook invocations are dispatched in flush order but may resolve out of order; chaining the appends guarantees the *displayed* string is assembled in the correct order regardless of completion order.

**Key insight:** `raw` (true model text) and `output` (displayed text) are kept as **two separate strings**. The hook can only ever influence `output`; `raw` (and therefore everything downstream — transcript, model context) is never derived from `output`. That separation is what makes "display-only" structurally guaranteed rather than merely promised.

### Engine constants (cli_inner_pretty.js:627128-627139)

```javascript
// ============================================
// MessageDisplay streaming constants
// Location: cli_inner_pretty.js:627128-627139
// ============================================

// ORIGINAL (for source lookup):
var HR$, Xxz = 10, AW9, YW9 = 3, fW9 = 1e4;
// ... ((HR$ = require("crypto")), (AW9 = 1000 / Xxz));

// READABLE (for understanding):
const MESSAGE_DISPLAY_FLUSH_FPS    = 10;                // 10 flushes/sec target
const MESSAGE_DISPLAY_DEBOUNCE_MS  = 1000 / 10;         // = 100ms debounce window
const MESSAGE_DISPLAY_INFLIGHT_CAP = 3;                 // max concurrent flush hooks
const MESSAGE_DISPLAY_TIMEOUT_MS   = 10_000;            // 10s per-flush hook budget

// Mapping: Xxz→FLUSH_FPS, AW9→DEBOUNCE_MS, YW9→INFLIGHT_CAP, fW9→TIMEOUT_MS, HR$→crypto
```

---

## 8. Completed-Message Path — `MW9`

The streaming engine handles the live stream, but transcript entries can re-render (scrollback, resume, repaint). `MW9` re-applies the hook against a **fully landed** assistant message so the substitution is stable across re-renders.

```javascript
// ============================================
// applyMessageDisplayToCompletedMessage (MW9) - re-run hook for a landed message
// Location: cli_inner_pretty.js:627097-627127
// ============================================

// ORIGINAL (for source lookup):
async function MW9(H, $, q, K) {
  if (!wk("MessageDisplay", q(), E$())) return H;
  let _ = H.message.content.map((Y) => (Y.type === "text" ? Y.text : "")).join("");
  if (_ === "") return H;
  let z;
  try {
    for await (let Y of l6$({ turnId: $, messageId: HR$.randomUUID(), index: 0, final: !0, delta: _ }, q, K, fW9))
      if (Y.displayContent !== void 0) z = Y.displayContent;
  } catch (Y) {
    return (N(`MessageDisplay hook failed for completed message; emitting original text: ${...}`, { level: "error" }), H);
  }
  if (z === void 0) return H;
  let A = !0;
  return { ...H, message: { ...H.message,
    content: H.message.content.map((Y) => {
      if (Y.type !== "text") return Y;
      let f = A ? z : "";
      return ((A = !1), { ...Y, text: f });
    }),
  }};
}

// READABLE (for understanding):
async function applyMessageDisplayToCompletedMessage(entry, turnId, getAppState, signal) {
  if (!hasHookForEvent("MessageDisplay", getAppState(), currentSessionId())) return entry;   // gate
  const fullText = entry.message.content.filter(c => c.type === "text").map(c => c.text).join("");
  if (fullText === "") return entry;
  let displayContent;
  try {
    for await (const out of executeMessageDisplayHooks(
        { turnId, messageId: crypto.randomUUID(), index: 0, final: true, delta: fullText },
        getAppState, signal, MESSAGE_DISPLAY_TIMEOUT_MS))
      if (out.displayContent !== undefined) displayContent = out.displayContent;
  } catch (e) {
    return entry;   // any failure → show original text
  }
  if (displayContent === undefined) return entry;   // no override → original
  // Put the whole displayContent into the FIRST text block, blank the rest (display copy only).
  let first = true;
  return { ...entry, message: { ...entry.message,
    content: entry.message.content.map(c =>
      c.type !== "text" ? c : (first ? (first = false, { ...c, text: displayContent }) : { ...c, text: "" })) } };
}

// Mapping: MW9→applyMessageDisplayToCompletedMessage, H→entry, $→turnId, q→getAppState, K→signal,
//          wk→hasHookForEvent, E$→currentSessionId, l6$→executeMessageDisplayHooks, fW9→MESSAGE_DISPLAY_TIMEOUT_MS
```

Notes:
- It runs **one** synthetic flush with `index: 0, final: true` over the message's full concatenated text — the "whole message in one delta" form of the same contract.
- The returned entry is a **shallow copy**; the original `entry`/transcript object is returned unchanged on any failure or no-override. The first text block gets the override, remaining text blocks are blanked so the displayed copy isn't duplicated. This object is a *render-time* copy — it is not what gets persisted.

---

## 9. Apply Case — `applyHookJSONOutput`

`applyHookJSONOutput` walks each event's `hookSpecificOutput` and folds it into a mutable result `M`. The `MessageDisplay` case is the simplest in the switch: copy `displayContent` straight through.

```javascript
// ============================================
// applyHookJSONOutput - MessageDisplay case
// Location: cli_inner_pretty.js:552584-552586
// ============================================

// ORIGINAL (for source lookup):
case "MessageDisplay":
  M.displayContent = H.hookSpecificOutput.displayContent;
  break;

// READABLE (for understanding):
case "MessageDisplay":
  result.displayContent = output.hookSpecificOutput.displayContent;   // may be undefined → passthrough
  break;

// Mapping: M→result, H→parsed hook output, hookSpecificOutput.displayContent passed through verbatim
```

Because `displayContent` is optional, an `undefined` here is the passthrough signal: downstream the aggregator only yields when `displayContent !== void 0` (cli_inner_pretty.js:553907), and the engine only overrides `P` when the yielded value is defined (cli_inner_pretty.js:626956).

---

## 10. Aggregator Yield

The hook-output aggregator (the `for await` loop over `g28(...)`, cli_inner_pretty.js:553897) is the single point that surfaces each hook result to callers. The `MessageDisplay` contribution is one line:

```javascript
// ============================================
// hookOutputAggregator - yields displayContent to the caller
// Location: cli_inner_pretty.js:553907
// ============================================

// ORIGINAL (for source lookup):
if (g.displayContent !== void 0) yield { displayContent: g.displayContent };

// READABLE (for understanding):
if (result.displayContent !== undefined) yield { displayContent: result.displayContent };

// Mapping: g→per-hook result, yields a partial { displayContent } the engine collects in OW9.A / MW9
```

It sits alongside the other aggregated fields (`updatedToolOutput` 553903, `preventContinuation` 553908, `reloadSkills` 553933, `sessionTitle` 553934) — confirming `displayContent` is a peer hook-output channel, not a special case. The engine's flush loop reads exactly this yield (cli_inner_pretty.js:626956).

---

## 11. Gate — `wk("MessageDisplay")`

`hasHookForEvent` (`wk`) is the cheap guard that decides whether to instantiate the entire display pipeline. Both `OW9.begin` (cli_inner_pretty.js:627042) and `MW9` (cli_inner_pretty.js:627098) call it first; if it returns false they short-circuit to the original rendering with **zero overhead**.

```javascript
// ============================================
// hasHookForEvent (wk) - is any hook configured for this event?
// Location: cli_inner_pretty.js:552979-552990
// ============================================

// ORIGINAL (for source lookup):
function wk(H, $, q) {
  let K = fp()?.[H];
  if (K && K.length > 0) return !0;
  if (!Yw()) { let z = im()?.[H]; if (z && z.length > 0) return !0; }
  let _ = _b()?.[H];
  if (_ && _.length > 0) return !0;
  if ($?.sessionHooks.get(q)?.hooks[H]) return !0;
  return !1;
}

// READABLE (for understanding):
function hasHookForEvent(eventName, appState, sessionId) {
  if ((policyHooks()?.[eventName]?.length ?? 0) > 0) return true;          // managed/policy hooks
  if (!policyOnlyMode()) {                                                  // unless policy-only mode
    if ((userSettingsHooks()?.[eventName]?.length ?? 0) > 0) return true;  // user settings hooks
  }
  if ((pluginHooks()?.[eventName]?.length ?? 0) > 0) return true;          // plugin hooks
  if (appState?.sessionHooks.get(sessionId)?.hooks[eventName]) return true;// session-scoped hooks
  return false;
}

// Mapping: wk→hasHookForEvent, fp→policyHooks, im→userSettingsHooks, _b→pluginHooks, Yw→policyOnlyMode
```

The gate checks four hook sources in priority order: policy/managed, user settings (skipped in policy-only mode), plugin, and session-scoped. For `MessageDisplay` this is what makes the feature pay-for-use: a user with no display hook installed never allocates the engine state, never spawns a subprocess, and renders exactly as before.

---

## 12. `/hooks` Help Block — `hookEventMetadata.MessageDisplay`

The `hooksConfigManager`-side metadata (the object whose keys are events with `{}` placeholders at cli_inner_pretty.js:514870-514882, and whose full descriptions live at cli_inner_pretty.js:515177-515184) drives the `/hooks` UI and documents the exit-code contract.

```
MessageDisplay: {
  summary: "While assistant message text is displayed",          // cli_inner_pretty.js:515178
  description: `Input to command is JSON with turn_id, message_id, index, final, and delta (the newly completed lines).
Output JSON with hookSpecificOutput containing displayContent to replace the delta on screen.
Display-only: the stored message and what the model sees are untouched.
Exit code 0 - use hook response if provided
Other exit codes - display the original delta`,                  // cli_inner_pretty.js:515179-515183
}
```

### Exit-code semantics

- **Exit 0** → use the hook's response if it provided `displayContent`; otherwise (no field) show the original delta. This is the only path where the override takes effect.
- **Any non-zero exit** → show the original delta. Combined with the catch blocks in `OW9.A` (cli_inner_pretty.js:626958) and `MW9` (cli_inner_pretty.js:627105), this means crashes, timeouts, and non-zero exits all converge on the same safe behavior: **the user always sees the real text**.

The summary string "While assistant message text is displayed" deliberately mirrors the framing of the other *During-rendering* hooks and is the human-readable name shown in the `/hooks` event picker (`hookEventMetadata` is consumed by the picker component `Vd4` at cli_inner_pretty.js:515190).

---

## 13. Why Display-Only? (Design Rationale)

**What it does:** Lets a hook change what the user *sees* without changing what is *stored* or what the *model* reads.

**Why this approach:**
1. **Safety / auditability.** The transcript on disk and the conversation context the model receives must remain a faithful record of what the model actually produced. If a `MessageDisplay` hook could rewrite the stored message, a buggy or malicious hook could silently corrupt the conversation, poison future model turns, or hide what the assistant really said in logs. By construction (`raw` vs `output`, render-time shallow copies in `MW9`), it can only repaint the screen.
2. **Use cases that need *only* the screen.** Redaction/masking of secrets in displayed output, theming/colorizing, localization or live translation of the visible text, watermarking, or progressive-disclosure UIs. None of these should alter the canonical message.
3. **Failure containment.** Because the override is purely cosmetic, "show original on any error" is always a correct fallback. A display hook can fail open with zero correctness impact — unlike, say, a `PreToolUse` hook where failing open is a real decision.
4. **Comparison with `updatedToolOutput`.** The pre-existing `PostToolUse` `updatedToolOutput` field (the 2.1.88 precursor mechanism) is **model-visible** — it replaces what the model reads. `MessageDisplay` is the deliberate inverse: a channel that is *only* user-visible. The two together give hook authors both halves of the matrix (change model input vs change user display) explicitly and separately.

**Key insight:** The whole feature is engineered so the override can only ever flow into one place — the on-screen `output` string — and every error path drops back to the original. The "display-only" property is not a documentation promise; it is the structural shape of the data flow (`raw` is never derived from `output`; `MW9` returns render-time copies; failures return the untouched entry).

---

## 14. End-to-End Flow (Live Streaming)

```
model token stream
   │ chunk
   ▼
OW9.delta(chunk)  ─→ raw += chunk;  O(state)            [627067-627069]
   │ has a new complete line & not capped & debounce ok
   ▼
f(state,false)    ─→ slice whole lines → delta;          [626993-627006]
   │                  index++; A(state,index,false,delta)
   ▼
A(...)            ─→ inFlight++;                          [626938-626975]
   │                  for await l6$({turnId,messageId,index,final,delta},
   │                                getAppState, signal, fW9)
   │                     └─→ QL → th8 (sync, 10s)  → hook subprocess
   │                  P = displayContent ?? delta   (error → delta)
   │                  appendChain: output += P; z(state)
   ▼
onStreamingDisplay(output)   ─→ repaint screen           [628565-628567]

... finalize() / entryLanded() → final flush + commit via onMessageDisplay
... later re-render → MW9(entry,...) re-applies hook on full text   [627097]
```

---

## Confidence Summary

| Claim | Confidence | Basis |
|-------|-----------|-------|
| `MessageDisplay` event name + schemas exist as documented | HIGH | Read cli_inner_pretty.js:49289, 336638, 337023-337050, 337161-337175, 550767-550775 |
| Executor `l6$` flags (forceSync, suppressTelemetry, 10s) | HIGH | Read cli_inner_pretty.js:551726-551745, 627132, 627139 |
| Apply case + aggregator yield + gate | HIGH | Read cli_inner_pretty.js:552584-552586, 553907, 552979-552990 |
| Streaming engine `OW9` / completed path `MW9` behavior | HIGH | Read cli_inner_pretty.js:626930-627127 |
| Prompt/help block + exit-code contract | HIGH | Read cli_inner_pretty.js:515177-515184 |
| Display-only property is structural | HIGH | `raw` vs `output` separation (626950-626974); render-copy in MW9 (627116-627126) |
| NEW post-2.1.88, no precursor | HIGH | Zero `MessageDisplay`/`displayContent` matches in 2.1.88 src; list ended at `FileChanged` |
