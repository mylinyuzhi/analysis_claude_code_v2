# Stop/SubagentStop — background_tasks + session_crons Input and the Block Cap (2.1.143/2.1.145)

> Module 11_hooks — delta v2.1.143–156. Two related Stop/SubagentStop changes:
> **(A)** Stop and SubagentStop hook input gains `background_tasks` and `session_crons` arrays (2.1.145), so a hook can
> tell "the session is genuinely done" apart from "the session is *parked*, waiting for background work or a scheduled
> wakeup to revive it." **(B)** A stop-hook *block cap* (2.1.143): a Stop/SubagentStop hook that keeps blocking the turn
> from ending can no longer loop forever — after N consecutive blocks (`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`, default 8) the
> agent loop overrides the block, warns, and ends the turn.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks, Compact, Crons)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent loop, query)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key symbols in this document:

- `stopHookInputSchema` (`Nj_`) — Stop hook input schema; gains `background_tasks` + `session_crons` (cli_inner_pretty.js:336840-336865)
- `subagentStopHookInputSchema` (`hj_`) — SubagentStop input schema; same two arrays added (cli_inner_pretty.js:336879-336907)
- `backgroundTaskElementSchema` (`Qo7`) — Per-element schema for a background task (cli_inner_pretty.js:336795-336822)
- `sessionCronElementSchema` (`go7`) — Per-element schema for a session cron (cli_inner_pretty.js:336823-336839)
- `executeStopHooks` (`fzH`) — Stop/SubagentStop dispatcher; builds the `background_tasks`/`session_crons` payload (cli_inner_pretty.js:551871-551907)
- `mapBackgroundTasksForHook` (`v89`) — Maps the live task registry to hook-shaped task elements (cli_inner_pretty.js:551812-551841)
- `mapSessionCronsForHook` (`k89`) — Maps session cron tasks to hook-shaped cron elements (cli_inner_pretty.js:551842-551844)
- `HOOK_FIELD_CHAR_CAP` (`hKq`) — 1000-char field cap constant (cli_inner_pretty.js:551845)
- `TASK_TYPE_LABELS` (`er6`) — Discriminant → friendly task-type label map (cli_inner_pretty.js:457418-457427)
- `truncateWithMarker` (`ub$`) — Truncate-with-`… [+N chars]`-marker helper (cli_inner_pretty.js:9798-9802)
- `isInFlightTask` (`uL`) — In-flight predicate (running/pending and not un-backgrounded) (cli_inner_pretty.js:336125-336129)
- `getSessionCronTasks` (`WG`) — Session cron-task list accessor (cli_inner_pretty.js:2994-2996)
- `dispatchStopHookErrors` (`kT4`) — Inner Stop-hook executor returning `{blockingErrors, preventContinuation}` (cli_inner_pretty.js:450658)
- `makeSystemMessage` (`Z_`) — System/informational message builder used for the override warning (cli_inner_pretty.js:445864-445876)
- `emitTelemetry` (`d`) — Telemetry sink; emits `tengu_stop_hook_block_count` (cli_inner_pretty.js:451886, 451893, 451906)

---

## Part A — `background_tasks` + `session_crons` Hook Input (2.1.145)

### TL;DR

When a turn ends, Claude Code fires the `Stop` hook (or `SubagentStop` for a subagent). A hook that wants to *prevent*
the turn from ending (return `{decision: "block"}`) historically had no way to know *why* the session looked idle. In
2.1.145 the Stop/SubagentStop input envelope gains two optional arrays:

- `background_tasks` — in-flight background work registered in this session (running/pending shell tasks, subagents,
  MCP monitors, workflows, …). Present and non-empty means "the model has stopped talking, but there is still work in
  flight that may produce output and wake the session."
- `session_crons` — session-scoped scheduled wakeups (from `CronCreate`, `ScheduleWakeup`, `/loop`). Present and
  non-empty means "this session is parked and will be re-entered later on a schedule."

The changelog entry (2.1.145):

> Stop and SubagentStop hook input now includes `background_tasks` and `session_crons` fields

Confirmed at `CHANGELOG.md:202` (`## 2.1.145`) / `CHANGELOG.md:210`.

### Confidence vs 2.1.88

**NEW post-2.1.88, high confidence.** In v2.1.88 the Stop input schema
(`src/entrypoints/sdk/coreSchemas.ts:513-527`) had exactly `hook_event_name`, `stop_hook_active`, and
`last_assistant_message`; SubagentStop (`coreSchemas.ts:550-567`) added only `agent_id`/`agent_transcript_path`/
`agent_type` on top of those. Neither `background_tasks` nor `session_crons` existed. The surrounding Zod-schema
architecture (`BaseHookInputSchema().and(...)`, the `lazySchema()` wrapper → `yH(() => ...)` in the bundle) is the
unchanged precursor; only the two array fields are net-new.

### The schema additions

The Stop input schema `stopHookInputSchema` (`Nj_`) and the SubagentStop schema `subagentStopHookInputSchema` (`hj_`)
both append the two optional arrays. They share the *same* element schemas and the *same* describe-strings, so the two
events present an identical task/cron view.

```javascript
// ============================================
// stopHookInputSchema (Nj_) / subagentStopHookInputSchema (hj_) - background_tasks + session_crons added
// Location: cli_inner_pretty.js:336840-336865 (Stop), 336879-336907 (SubagentStop)
// ============================================

// ORIGINAL (for source lookup):
(Nj_ = yH(() =>
  cM().and(
    y.object({
      hook_event_name: y.literal("Stop"),
      stop_hook_active: y.boolean(),
      last_assistant_message: y.string().optional().describe("Text content of the last assistant message before stopping. Avoids the need to read and parse the transcript file."),
      background_tasks: y.array(Qo7()).optional().describe('In-flight background work (running/pending + backgrounded) registered in this session. Lets hooks distinguish "session is done" from "session is paused waiting for background work to wake it". Empty array when nothing is in flight.'),
      session_crons: y.array(go7()).optional().describe("Session-scoped cron tasks (CronCreate, ScheduleWakeup, /loop) that will wake this session later. Empty array when none are scheduled."),
    }),
  ),
)),
// ... hj_ is identical except hook_event_name:"SubagentStop" + agent_id/agent_transcript_path/agent_type, then the same two arrays.

// READABLE (for understanding):
const stopHookInputSchema = lazySchema(() =>
  baseHookInputSchema().and(
    z.object({
      hook_event_name: z.literal("Stop"),
      stop_hook_active: z.boolean(),
      last_assistant_message: z.string().optional().describe("Text content of the last assistant message before stopping. ..."),
      background_tasks: z.array(backgroundTaskElementSchema()).optional()
        .describe('In-flight background work ... Lets hooks distinguish "session is done" from "session is paused waiting for background work to wake it". Empty array when nothing is in flight.'),
      session_crons: z.array(sessionCronElementSchema()).optional()
        .describe("Session-scoped cron tasks (CronCreate, ScheduleWakeup, /loop) that will wake this session later. Empty array when none are scheduled."),
    }),
  ),
);

// Mapping: Nj_→stopHookInputSchema, hj_→subagentStopHookInputSchema, yH→lazySchema, cM→baseHookInputSchema,
//          y→z (zod), Qo7→backgroundTaskElementSchema, go7→sessionCronElementSchema
```

> Note both fields are `.optional()` and the describe-strings promise an **empty array when nothing is in flight /
> scheduled** — so a hook that *parses* the field gets `[]` rather than `undefined` at runtime (the runtime always
> builds the arrays when a `toolUseContext` is present; see `executeStopHooks` below). `.optional()` exists only because
> the dispatcher omits the whole `D` object when there is no `toolUseContext` (e.g. some SDK paths).

### The element schemas

#### Background task element `backgroundTaskElementSchema` (`Qo7`)

```javascript
// ============================================
// backgroundTaskElementSchema (Qo7) - one in-flight background task, with type-conditional fields
// Location: cli_inner_pretty.js:336795-336822
// ============================================

// ORIGINAL (for source lookup):
(Qo7 = yH(() =>
  y.object({
    id: y.string(),
    type: y.string().describe("Friendly task-type label (e.g. 'shell', 'subagent', 'monitor', 'workflow'). Falls back to the raw discriminant for unknown types."),
    status: y.string(),
    description: y.string().describe('Free-text description. Capped at 1000 chars; clipped values append an in-string "… [+N chars]" marker.'),
    command: y.string().optional().describe("Shell command line. Only present for 'shell' tasks. Capped at 1000 chars with the same \"… [+N chars]\" marker."),
    agent_type: y.string().optional().describe("Subagent type name. Only present for 'subagent' tasks."),
    server: y.string().optional().describe("MCP server name. Only present for 'monitor' / 'MCP task' tasks."),
    tool: y.string().optional().describe("MCP tool name. Only present for 'monitor' / 'MCP task' tasks."),
    name: y.string().optional().describe("Workflow name. Only present for 'workflow' tasks."),
  }),
)),

// READABLE (for understanding):
const backgroundTaskElementSchema = lazySchema(() =>
  z.object({
    id: z.string(),                                   // task registry id
    type: z.string(),                                 // friendly label (shell/subagent/monitor/workflow/...), raw discriminant fallback
    status: z.string(),                               // running | pending | ...
    description: z.string(),                          // free text, capped at 1000 chars
    command: z.string().optional(),                   // shell tasks only
    agent_type: z.string().optional(),                // subagent tasks only
    server: z.string().optional(),                    // monitor / MCP-task only
    tool: z.string().optional(),                      // monitor / MCP-task only
    name: z.string().optional(),                      // workflow tasks only
  }),
);

// Mapping: Qo7→backgroundTaskElementSchema, yH→lazySchema, y→z
```

The conditional fields (`command`, `agent_type`, `server`, `tool`, `name`) are *not* a discriminated union in the
schema — they are all `.optional()` on one flat object, and the **runtime mapper** is what populates exactly one of them
per task type (see `mapBackgroundTasksFor­Hook` below). That keeps the wire shape simple for hook authors writing
`jq`: every element is the same object shape, you just read whichever optional field is present.

#### Session cron element `sessionCronElementSchema` (`go7`)

```javascript
// ============================================
// sessionCronElementSchema (go7) - one scheduled wakeup
// Location: cli_inner_pretty.js:336823-336839
// ============================================

// ORIGINAL (for source lookup):
(go7 = yH(() =>
  y.object({
    id: y.string(),
    schedule: y.string().describe('Cron expression, e.g. "0 9 * * 1-5".'),
    recurring: y.boolean().describe("False for one-shot wakeups whose cron field encodes a single fire time; true for tasks that re-fire on every match."),
    prompt: y.string().describe('Prompt text submitted when the cron fires. Capped at 1000 chars; clipped values append an in-string "… [+N chars]" marker.'),
  }),
)),

// READABLE (for understanding):
const sessionCronElementSchema = lazySchema(() =>
  z.object({
    id: z.string(),
    schedule: z.string(),       // cron expression
    recurring: z.boolean(),     // false = one-shot single fire time; true = re-fires every match
    prompt: z.string(),         // prompt submitted on fire, capped at 1000 chars
  }),
);

// Mapping: go7→sessionCronElementSchema, yH→lazySchema, y→z
```

### Runtime — `executeStopHooks` (`fzH`) builds the payload

`executeStopHooks` (`fzH`) is the dispatcher for both Stop and SubagentStop (the `f = _ ? "SubagentStop" : "Stop"` line
at 551872 selects the event by whether a subagent id `_` was passed). When a `toolUseContext` `z` is present, it builds
the shared payload object `D` once and spreads it into whichever envelope it constructs.

```javascript
// ============================================
// executeStopHooks (fzH) - Stop/SubagentStop dispatcher; builds background_tasks + session_crons
// Location: cli_inner_pretty.js:551871-551907
// ============================================

// ORIGINAL (for source lookup):
async function* fzH(H, $, q = q_, K = !1, _, z, A, Y) {
  let f = _ ? "SubagentStop" : "Stop",
    O = z?.getAppState(),
    M = z?.agentId ?? E$();
  if (!wk(f, O, M)) return;
  let j = A ? _V(A) : void 0,
    w = j ? w9(j.message.content, `\n`).trim() || void 0 : void 0,
    D = z ? { background_tasks: v89(z.taskRegistry.all()), session_crons: k89() } : void 0,
    J = _
      ? { ...w5(H, void 0, z), hook_event_name: "SubagentStop", stop_hook_active: K, agent_id: _, agent_transcript_path: zV(_), agent_type: Y ?? "", last_assistant_message: w, ...D }
      : { ...w5(H, void 0, z), hook_event_name: "Stop", stop_hook_active: K, last_assistant_message: w, ...D },
    X;
  yield* QL({ hookInput: J, extendedHookInput: X, toolUseID: E89.randomUUID(), signal: $, timeoutMs: q, toolUseContext: z, messages: A });
}

// READABLE (for understanding):
async function* executeStopHooks(permissionMode, signal, timeoutMs = DEFAULT_HOOK_TIMEOUT, stopHookActive = false,
                                 subagentId, toolUseContext, messages, agentType) {
  const eventName = subagentId ? "SubagentStop" : "Stop";
  const appState = toolUseContext?.getAppState();
  const sessionId = toolUseContext?.agentId ?? getSessionId();
  if (!hasHookForEvent(eventName, appState, sessionId)) return;        // skip envelope build if no hook registered

  const lastAssistant = messages ? findLastAssistantMessage(messages) : undefined;
  const lastAssistantText = lastAssistant
    ? joinTextBlocks(lastAssistant.message.content, "\n").trim() || undefined
    : undefined;

  // NEW v2.1.145: only when a toolUseContext exists do we attach the two arrays.
  const taskPayload = toolUseContext
    ? {
        background_tasks: mapBackgroundTasksForHook(toolUseContext.taskRegistry.all()),
        session_crons: mapSessionCronsForHook(),                       // pulls from session state, no arg → WG()
      }
    : undefined;

  const hookInput = subagentId
    ? { ...createBaseHookInput(permissionMode, undefined, toolUseContext), hook_event_name: "SubagentStop",
        stop_hook_active: stopHookActive, agent_id: subagentId, agent_transcript_path: getTranscriptPath(subagentId),
        agent_type: agentType ?? "", last_assistant_message: lastAssistantText, ...taskPayload }
    : { ...createBaseHookInput(permissionMode, undefined, toolUseContext), hook_event_name: "Stop",
        stop_hook_active: stopHookActive, last_assistant_message: lastAssistantText, ...taskPayload };

  yield* dispatchHookOutputStream({ hookInput, extendedHookInput: undefined, toolUseID: randomUUID(),
                                    signal, timeoutMs, toolUseContext, messages });
}

// Mapping: fzH→executeStopHooks, H→permissionMode, $→signal, q→timeoutMs, K→stopHookActive, _→subagentId,
//          z→toolUseContext, A→messages, Y→agentType, f→eventName, O→appState, M→sessionId, j→lastAssistant,
//          w→lastAssistantText, D→taskPayload, J→hookInput, q_→DEFAULT_HOOK_TIMEOUT, wk→hasHookForEvent,
//          E$→getSessionId, _V→findLastAssistantMessage, w9→joinTextBlocks, w5→createBaseHookInput,
//          zV→getTranscriptPath, QL→dispatchHookOutputStream, v89→mapBackgroundTasksForHook, k89→mapSessionCronsForHook
```

Two details worth calling out:

1. **The arrays are spread last (`...D`).** Spreading after `last_assistant_message` means the array fields can never be
   accidentally shadowed by the base input; they are appended. Because `D` is built unconditionally (when
   `toolUseContext` exists), the fields are *always present as arrays* in practice, matching the "empty array when
   nothing is in flight" promise in the schema describe-strings.
2. **`mapSessionCronsForHook` takes no argument here**, so it falls through to its default `H = WG()` — i.e. it reads
   the current session's cron list straight from session state (see `getSessionCronTasks` at 2994-2996,
   `return nk()?.sessionCronTasks ?? d$.sessionCronTasks`).

### The mappers

#### `mapBackgroundTasksForHook` (`v89`) — registry → hook task elements

```javascript
// ============================================
// mapBackgroundTasksForHook (v89) - filter in-flight, label type, populate one conditional field, truncate
// Location: cli_inner_pretty.js:551812-551841
// ============================================

// ORIGINAL (for source lookup):
function v89(H) {
  let $ = [];
  for (let q of Object.values(H)) {
    if (!uL(q)) continue;
    let K = { id: q.id, type: er6[q.type] ?? q.type, status: q.status, description: ub$(q.description, hKq) };
    switch (q.type) {
      case "local_bash": K.command = ub$(q.command, hKq); break;
      case "local_agent": K.agent_type = q.agentType; break;
      case "monitor_mcp": ((K.server = q.server), (K.tool = q.tool)); break;
      case "mcp_task": ((K.server = q.serverName), (K.tool = q.toolName)); break;
      case "local_workflow": K.name = q.workflowName; break;
      case "in_process_teammate":
      case "remote_agent":
      case "dream": break;
    }
    $.push(K);
  }
  return $;
}

// READABLE (for understanding):
function mapBackgroundTasksForHook(taskRegistryMap) {
  const out = [];
  for (const task of Object.values(taskRegistryMap)) {
    if (!isInFlightTask(task)) continue;                                       // drop finished/cancelled/un-backgrounded
    const element = {
      id: task.id,
      type: TASK_TYPE_LABELS[task.type] ?? task.type,                          // friendly label, raw discriminant fallback
      status: task.status,
      description: truncateWithMarker(task.description, HOOK_FIELD_CHAR_CAP),   // 1000-char cap
    };
    switch (task.type) {
      case "local_bash":     element.command = truncateWithMarker(task.command, HOOK_FIELD_CHAR_CAP); break;
      case "local_agent":    element.agent_type = task.agentType; break;
      case "monitor_mcp":    element.server = task.server;     element.tool = task.tool;     break;
      case "mcp_task":       element.server = task.serverName; element.tool = task.toolName; break;
      case "local_workflow": element.name = task.workflowName; break;
      case "in_process_teammate":
      case "remote_agent":
      case "dream":          break;                                            // no extra field
    }
    out.push(element);
  }
  return out;
}

// Mapping: v89→mapBackgroundTasksForHook, H→taskRegistryMap, $→out, q→task, K→element, uL→isInFlightTask,
//          er6→TASK_TYPE_LABELS, ub$→truncateWithMarker, hKq→HOOK_FIELD_CHAR_CAP
```

Notice the internal task-registry discriminant (`q.type`) is *not* the hook-facing label. The registry uses
`local_bash`, `local_agent`, `monitor_mcp`, etc.; the hook sees `shell`, `subagent`, `monitor`, … via the label map
`TASK_TYPE_LABELS` (`er6`):

```javascript
// ============================================
// TASK_TYPE_LABELS (er6) - registry discriminant → friendly hook-facing label
// Location: cli_inner_pretty.js:457418-457427
// ============================================

// ORIGINAL (for source lookup):
er6 = {
  local_agent: "subagent",
  local_workflow: "workflow",
  local_bash: "shell",
  monitor_mcp: "monitor",
  mcp_task: "MCP task",
  in_process_teammate: "teammate",
  dream: "dream",
  remote_agent: "cloud session",
};

// READABLE (for understanding):
const TASK_TYPE_LABELS = {
  local_agent:        "subagent",
  local_workflow:     "workflow",
  local_bash:         "shell",
  monitor_mcp:        "monitor",
  mcp_task:           "MCP task",
  in_process_teammate:"teammate",
  dream:              "dream",
  remote_agent:       "cloud session",
};

// Mapping: er6→TASK_TYPE_LABELS (1:1 keys)
```

The `?? q.type` fallback in the mapper is what the schema describe-string means by "falls back to the raw discriminant
for unknown types" — a future registry type with no label entry still surfaces, just under its internal name.

#### `mapSessionCronsForHook` (`k89`) — cron list → hook cron elements

```javascript
// ============================================
// mapSessionCronsForHook (k89) - map session crons, truncate the prompt
// Location: cli_inner_pretty.js:551842-551844
// ============================================

// ORIGINAL (for source lookup):
function k89(H = WG()) {
  return H.map(($) => ({ id: $.id, schedule: $.cron, recurring: $.recurring ?? !1, prompt: ub$($.prompt, hKq) }));
}

// READABLE (for understanding):
function mapSessionCronsForHook(crons = getSessionCronTasks()) {
  return crons.map((cron) => ({
    id: cron.id,
    schedule: cron.cron,                                  // internal field `cron` → hook field `schedule`
    recurring: cron.recurring ?? false,                  // default one-shot if unset
    prompt: truncateWithMarker(cron.prompt, HOOK_FIELD_CHAR_CAP),
  }));
}

// Mapping: k89→mapSessionCronsForHook, H→crons, $→cron, WG→getSessionCronTasks, ub$→truncateWithMarker, hKq→HOOK_FIELD_CHAR_CAP
```

Two field renames happen here: the internal cron object's `cron` field is exposed as `schedule`, and `recurring`
defaults to `false` (`?? !1`) so a one-shot wakeup that never set the flag reads as `recurring: false` rather than
`undefined`.

### The 1000-char cap — `HOOK_FIELD_CHAR_CAP` (`hKq`) and `truncateWithMarker` (`ub$`)

```javascript
// ============================================
// HOOK_FIELD_CHAR_CAP (hKq) + truncateWithMarker (ub$) - 1000-char field cap with "… [+N chars]" marker
// Location: hKq cli_inner_pretty.js:551845; ub$ cli_inner_pretty.js:9798-9802
// ============================================

// ORIGINAL (for source lookup):
var hKq = 1000;
function ub$(H, $) {
  if (H.length <= $) return H;
  let q = yp8(H, $);
  return `${q}… [+${H.length - q.length} chars]`;
}

// READABLE (for understanding):
const HOOK_FIELD_CHAR_CAP = 1000;
function truncateWithMarker(text, cap) {
  if (text.length <= cap) return text;                  // under cap → returned verbatim
  const clipped = truncateToBudget(text, cap);          // yp8: trim to <= cap (word/grapheme-aware)
  return `${clipped}… [+${text.length - clipped.length} chars]`;  // append "… [+N chars]"
}

// Mapping: hKq→HOOK_FIELD_CHAR_CAP, ub$→truncateWithMarker, H→text, $→cap, q→clipped, yp8→truncateToBudget
```

`truncateWithMarker` is applied to exactly three free-text fields: a task's `description` (always), a shell task's
`command`, and a cron's `prompt`. The reported `N` is `originalLength - clippedLength`, so it tells the hook how many
characters were dropped, not the original length.

### In-flight filter — `isInFlightTask` (`uL`)

```javascript
// ============================================
// isInFlightTask (uL) - keep only running/pending tasks that are still backgrounded
// Location: cli_inner_pretty.js:336125-336129
// ============================================

// ORIGINAL (for source lookup):
function uL(H) {
  if (H.status !== "running" && H.status !== "pending") return !1;
  if ("isBackgrounded" in H && H.isBackgrounded === !1) return !1;
  return !0;
}

// READABLE (for understanding):
function isInFlightTask(task) {
  if (task.status !== "running" && task.status !== "pending") return false;    // completed/failed/cancelled → excluded
  if ("isBackgrounded" in task && task.isBackgrounded === false) return false;  // foregrounded task → excluded
  return true;
}

// Mapping: uL→isInFlightTask, H→task
```

This is the gate that makes the field meaningful for a Stop hook. Two conditions, both must pass:

1. **status is `running` or `pending`** — a finished, failed, or cancelled task is *not* going to wake the session, so
   reporting it would be noise. Only work that can still produce output survives.
2. **not explicitly foregrounded** — if a task carries `isBackgrounded === false`, it is being awaited in the
   foreground (the turn is *blocked on it*, not parked next to it). The `"isBackgrounded" in H` guard means tasks that
   don't track backgrounding at all (no such property) are treated as in-flight by default — the filter only *excludes*
   a task when it has the property set to exactly `false`.

### Why this approach — "session done" vs "session parked waiting for a wakeup"

**The problem.** A Stop hook's whole job is to decide whether the turn should really end. Before 2.1.145 the only signal
was `stop_hook_active` (am I already in a re-entrant stop-hook loop?) and `last_assistant_message`. A hook could not
tell these two situations apart:

```
  ┌─────────────────────────────────────────┐      ┌─────────────────────────────────────────┐
  │ "Session is DONE"                         │      │ "Session is PARKED"                       │
  │  - model produced final answer            │      │  - model stopped talking, BUT             │
  │  - nothing else will happen               │      │    * a background shell is still running  │
  │  - safe to notify user / close session    │      │    * a subagent is mid-flight             │
  │                                           │      │    * a cron will re-enter at 09:00        │
  │  background_tasks: []                      │      │  background_tasks: [ {...} ]              │
  │  session_crons:    []                      │      │  session_crons:    [ {...} ]              │
  └─────────────────────────────────────────┘      └─────────────────────────────────────────┘
            hook may safely end / notify                   hook should usually let it stop quietly,
                                                            knowing the session will revive itself
```

A "send me a desktop notification when the session is done" hook that fired on every Stop would spam the user once per
background-task wakeup. With `background_tasks`/`session_crons` the hook can suppress the notification when work is still
in flight or a cron will re-enter, and only fire when both arrays are empty.

**Why put it in the hook input rather than make the runtime decide.** The runtime *can't* know what a given hook wants
to do with the distinction — one hook wants to notify only at true completion, another wants to *block* the stop to keep
the session alive until background work finishes, a third just wants to log. Surfacing the raw in-flight/scheduled state
and letting the hook decide keeps the hook contract policy-free.

**Why cap fields at 1000 chars.** Hook input is serialized to JSON and piped to a subprocess on *every* Stop. An
unbounded shell command or cron prompt (these can be large, e.g. a multi-KB `/loop` prompt) would bloat the payload and
slow the pipe. 1000 chars is enough to identify *which* command/prompt this is (for a `jq` match or a log line) without
shipping the whole body; the `… [+N chars]` marker tells the hook the value was clipped so it doesn't mistake the suffix
for real content.

### Key insight

The two array fields are a **read-only situational-awareness channel**, not a control surface. They never change what
the model sees or what is stored — they only let a Stop/SubagentStop hook make a *better-informed* allow/block decision
by exposing the very state (the task registry and the session cron list) that the runtime itself uses to decide whether
the session is genuinely finished or merely between wakeups. The mapper deliberately flattens internal registry
discriminants into friendly labels and one conditional field per type so a hook author can treat every element as the
same uniform object.

---

## Part B — Stop-Hook Block Cap (2.1.143)

### TL;DR

A Stop or SubagentStop hook can *block* the turn from ending by returning blocking errors; the agent loop then re-enters
the model with those errors appended, giving the hook's complaint to the model so it can fix things, and increments a
consecutive-block counter. A buggy hook that *always* blocks would loop forever. 2.1.143 adds a cap: after
`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` (default **8**) consecutive blocks, the loop overrides the block, emits a warning, and
ends the turn anyway. The changelog (2.1.143, `CHANGELOG.md:278` / `:288`):

> Fixed stop hooks that block repeatedly looping forever — the turn now ends with a warning after 8 consecutive blocks
> (override via `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`)

### Confidence vs 2.1.88

**NEW post-2.1.88, high confidence.** v2.1.88 had `stop_hook_active` in the Stop input
(`coreSchemas.ts:513-527`) — the original loop-detection mechanism — but no numeric block cap and no
`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` env var. The cap is a second, independent guardrail layered on top of the existing
`stop_hook_active` convention.

### Where it lives — the agent loop's Stop-hook branch

The agent loop (the generator at `cli_inner_pretty.js:451220+`) destructures its per-iteration state from `D`, including
the consecutive-block counter `stopHookBlockingCount` (`b`) and the `turnCount` (`B`) (cli_inner_pretty.js:451261-451263).
`maxTurns` (`O`) comes from the outer query options (cli_inner_pretty.js:451228). When the model has nothing left to say,
the loop runs the inner Stop-hook executor `dispatchStopHookErrors` (`kT4`) and inspects its result.

```javascript
// ============================================
// Stop-hook block-cap branch - cap consecutive blocks, warn, override, end turn
// Location: cli_inner_pretty.js:451884-451933
// ============================================

// ORIGINAL (for source lookup):
let T$ = yield* kT4(U, zH, q, K, _, G, Y, C, P$$());
if (b > 0 && T$.blockingErrors.length === 0)
  d("tengu_stop_hook_block_count", { count: b, is_subagent: Boolean(G.agentId), hit_max_turns: !1, hit_cap: !1 });
if (T$.preventContinuation) return { reason: "stop_hook_prevented" };
if (T$.blockingErrors.length > 0) {
  let I$ = B + 1,
    $$ = b + 1;
  if (O && I$ > O)
    return (
      d("tengu_stop_hook_block_count", { count: $$, is_subagent: Boolean(G.agentId), hit_max_turns: !0, hit_cap: !1 }),
      yield VK({ type: "max_turns_reached", maxTurns: O, turnCount: I$ }),
      { reason: "max_turns", turnCount: I$ }
    );
  let v$ = parseInt(process.env.CLAUDE_CODE_STOP_HOOK_BLOCK_CAP ?? "", 10),
    F$ = Number.isNaN(v$) ? 8 : v$;
  if (F$ > 0 && $$ > F$)
    return (
      d("tengu_stop_hook_block_count", { count: $$, is_subagent: Boolean(G.agentId), hit_max_turns: !1, hit_cap: !0 }),
      yield Z_(
        `A hook blocked the turn from ending ${$$} consecutive times — overriding and ending turn. ` +
          "For Stop/SubagentStop hooks, check stop_hook_active in the input and return success while it's true. Set CLAUDE_CODE_STOP_HOOK_BLOCK_CAP to raise this limit.",
        "warning",
      ),
      { reason: "completed" }
    );
  D = {
    messages: [...U, ...zH, ...T$.blockingErrors],
    toolUseContext: G,
    compactTracking: Q,
    maxOutputTokensRecoveryCount: 0,
    hasAttemptedReactiveCompact: S,
    maxOutputTokensOverride: void 0,
    pendingToolUseSummary: void 0,
    stopHookActive: !0,
    stopHookBlockingCount: $$,
    turnCount: I$,
    transition: { reason: "stop_hook_blocking" },
  };
  continue;
}
return { reason: "completed" };

// READABLE (for understanding):
const stopResult = yield* dispatchStopHookErrors(messages, pendingMessages, permMode, ..., querySource, stopHookActive, sessionId());

// Block streak just ended (was blocking, now clean) → record the streak length.
if (consecutiveBlockCount > 0 && stopResult.blockingErrors.length === 0)
  emitTelemetry("tengu_stop_hook_block_count", { count: consecutiveBlockCount, is_subagent: Boolean(ctx.agentId), hit_max_turns: false, hit_cap: false });

// A hook explicitly said "prevent continuation" → stop now, no override.
if (stopResult.preventContinuation) return { reason: "stop_hook_prevented" };

if (stopResult.blockingErrors.length > 0) {
  const nextTurnCount  = turnCount + 1;
  const nextBlockCount = consecutiveBlockCount + 1;

  // Guardrail 1: max-turns wins first.
  if (maxTurns && nextTurnCount > maxTurns)
    return (emitTelemetry("tengu_stop_hook_block_count", { count: nextBlockCount, is_subagent: Boolean(ctx.agentId), hit_max_turns: true, hit_cap: false }),
            yield makeProgressMessage({ type: "max_turns_reached", maxTurns, turnCount: nextTurnCount }),
            { reason: "max_turns", turnCount: nextTurnCount });

  // Guardrail 2: the block cap.
  const envCap = parseInt(process.env.CLAUDE_CODE_STOP_HOOK_BLOCK_CAP ?? "", 10);
  const blockCap = Number.isNaN(envCap) ? 8 : envCap;          // default 8 when unset/garbage; 0 disables
  if (blockCap > 0 && nextBlockCount > blockCap)
    return (emitTelemetry("tengu_stop_hook_block_count", { count: nextBlockCount, is_subagent: Boolean(ctx.agentId), hit_max_turns: false, hit_cap: true }),
            yield makeSystemMessage(
              `A hook blocked the turn from ending ${nextBlockCount} consecutive times — overriding and ending turn. ` +
              "For Stop/SubagentStop hooks, check stop_hook_active in the input and return success while it's true. " +
              "Set CLAUDE_CODE_STOP_HOOK_BLOCK_CAP to raise this limit.",
              "warning",
            ),
            { reason: "completed" });

  // Under both caps → re-enter the model with the hook's blocking errors, mark stop_hook_active, bump counters.
  loopState = {
    messages: [...messages, ...pendingMessages, ...stopResult.blockingErrors],
    toolUseContext: ctx, compactTracking, maxOutputTokensRecoveryCount: 0,
    hasAttemptedReactiveCompact, maxOutputTokensOverride: undefined, pendingToolUseSummary: undefined,
    stopHookActive: true,                       // tell the next Stop-hook dispatch we're in a re-entrant loop
    stopHookBlockingCount: nextBlockCount,
    turnCount: nextTurnCount,
    transition: { reason: "stop_hook_blocking" },
  };
  continue;
}
return { reason: "completed" };

// Mapping: kT4→dispatchStopHookErrors, T$→stopResult, b→consecutiveBlockCount, B→turnCount, O→maxTurns,
//          I$→nextTurnCount, $$→nextBlockCount, v$→envCap, F$→blockCap, d→emitTelemetry, Z_→makeSystemMessage,
//          VK→makeProgressMessage, G→ctx (toolUseContext), D→loopState
```

### Step-by-step state machine

```
                 model has no tool calls, turn wants to end
                                 │
                                 ▼
                  dispatchStopHookErrors (kT4)  ── runs Stop/SubagentStop hooks
                                 │
            ┌────────────────────┼─────────────────────────────┐
            ▼                    ▼                              ▼
   blockingErrors == 0    preventContinuation==true       blockingErrors > 0
   (hook allowed stop)    (hook forced a hard stop)        (hook blocked)
            │                    │                              │
   if streak>0: emit             return                nextTurn  = turnCount+1
   block_count (hit_cap=false)   stop_hook_prevented   nextBlock = blockCount+1
            │                                                   │
   return completed                          ┌─────────────────┼──────────────────┐
                                             ▼                 ▼                  ▼
                                  nextTurn > maxTurns   nextBlock > cap     within both caps
                                  emit (hit_max_turns)  emit (hit_cap)      re-enter model with
                                  yield max_turns msg   yield WARNING        blockingErrors appended,
                                  return max_turns      return completed     stopHookActive=true,
                                                        (OVERRIDE)           counters bumped, continue
```

**Evaluation order matters.** Max-turns is checked *before* the block cap (cli_inner_pretty.js:451891 before 451904). So
if both would trip on the same iteration, the loop reports `reason: "max_turns"` with `hit_max_turns: true`, not the cap.
This keeps the existing max-turns ceiling authoritative; the block cap is a *fallback* for the common case where
`maxTurns` is unset (`O` falsy → the max-turns branch is skipped entirely).

**Counter lifecycle.** `stopHookBlockingCount` is reset to `0` on every *non*-blocking re-entry (the malformed-tool
retry at 451864, the max-output-tokens recovery at 451837, the initial state at 451239) and is only incremented along
the `stop_hook_blocking` transition (451928). "Consecutive" therefore means consecutive *Stop-hook blocks*, not
consecutive turns — a clean turn in between resets the streak.

### Telemetry — `tengu_stop_hook_block_count`

The event `tengu_stop_hook_block_count` is emitted at three sites, all with the same shape
`{ count, is_subagent, hit_max_turns, hit_cap }`:

- **451886** — a block streak *just ended* cleanly (`b > 0 && blockingErrors.length === 0`):
  `{ count: b, is_subagent, hit_max_turns: false, hit_cap: false }` — records how many blocks happened before the hook
  finally allowed the stop.
- **451893-451898** — the streak hit the **max-turns** ceiling: `{ count: nextBlock, hit_max_turns: true, hit_cap: false }`.
- **451906-451911** — the streak hit the **block cap** (the override path):
  `{ count: nextBlock, hit_max_turns: false, hit_cap: true }`.

`is_subagent` is `Boolean(G.agentId)` (truthy when this loop is running a subagent), so the metric separates main-thread
Stop blocks from SubagentStop blocks. The three sites are mutually exclusive per iteration, so a downstream query can
bucket on `(hit_cap, hit_max_turns)` to count clean recoveries vs. cap overrides vs. max-turns terminations.

### The override warning and the `stop_hook_active` interplay

The warning is built via `makeSystemMessage` (`Z_`) at level `"warning"` (cli_inner_pretty.js:445864-445876 — a
`{type:"system", subtype:"informational", level, content, ...}` record) and yielded into the stream so the user sees it.
Its text deliberately points the hook author at the *intended* cooperative mechanism:

> A hook blocked the turn from ending N consecutive times — overriding and ending turn. For Stop/SubagentStop hooks,
> check `stop_hook_active` in the input and return success while it's true. Set `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` to
> raise this limit.

This ties Part B back to the older `stop_hook_active` loop-detection convention. The *designed* contract is:

1. First Stop, `stop_hook_active: false` → the hook may block once to inject feedback.
2. Loop re-enters with `stopHookActive: true` (set at 451927), so the next Stop dispatch carries `stop_hook_active: true`.
3. A *well-behaved* hook sees `stop_hook_active: true` and returns success, ending the loop after one block.

The block cap exists for hooks that **ignore** `stop_hook_active` and keep blocking regardless. Rather than trusting the
hook to self-terminate, the cap is a hard runtime backstop: even a hook that never reads its input cannot wedge the
agent forever. The warning text nudges the author toward the `stop_hook_active` fix while the cap guarantees liveness.

### Why this approach

- **Why a numeric cap rather than relying on `stop_hook_active`.** `stop_hook_active` is *cooperative* — it only works
  if the hook reads it and chooses to stop. A misconfigured or naive hook (e.g. a one-liner that always exits non-zero
  with a "must run tests first" message) never consults the input and would block indefinitely, burning tokens and
  trapping the session. The cap is *non-cooperative*: the runtime enforces liveness no matter what the hook does.

- **Why default 8.** Eight consecutive blocks is well beyond any legitimate feedback loop (a real hook injecting one or
  two corrective rounds resolves in 1–2 blocks) but small enough to fail fast before runaway token spend. It's the same
  "generous-but-finite" sizing philosophy as the auto-compact and max-turns ceilings.

- **Why an env override (`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`).** Some workflows legitimately need a long feedback loop
  (CI-style hooks that iterate many times). The env var lets such users raise the ceiling; `parseInt(... , 10)` with
  `Number.isNaN → 8` means an unset or garbage value falls back to the default, and a value of `0` (the `F$ > 0` guard)
  disables the cap entirely for users who explicitly opt out of the backstop.

- **Why max-turns is checked first.** `maxTurns` is the harder, user-set ceiling on total model turns; honoring it first
  preserves its semantics and prevents the cap from masking a max-turns termination in telemetry.

### Key insight

The block cap is a **liveness guardrail decoupled from the cooperative protocol**. `stop_hook_active` asks the hook to
behave; the cap guarantees the agent loop terminates *even when the hook misbehaves*. The two compose: a good hook never
reaches the cap (it self-terminates via `stop_hook_active`), and a bad hook is bounded by it. The telemetry's
`(hit_cap, hit_max_turns)` flags let Anthropic see, in aggregate, how often hooks actually hit the backstop vs. resolve
cooperatively — i.e. whether the default of 8 is well-calibrated.

---

## Cross-version summary

| Aspect | v2.1.88 | v2.1.143/145 (this delta) |
|--------|---------|---------------------------|
| Stop input fields | `stop_hook_active`, `last_assistant_message` (`coreSchemas.ts:513-527`) | + `background_tasks`, `session_crons` (2.1.145) |
| SubagentStop input fields | + `agent_id`/`agent_transcript_path`/`agent_type` (`coreSchemas.ts:550-567`) | + same two arrays (2.1.145) |
| Stop-hook loop guard | `stop_hook_active` (cooperative only) | + numeric block cap `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` default 8 (2.1.143) |
| Telemetry | none for block streaks | `tengu_stop_hook_block_count` (count/is_subagent/hit_max_turns/hit_cap) |

Both items are confirmed **NEW post-2.1.88, high confidence**: the 2.1.88 schemas and the cooperative `stop_hook_active`
mechanism are the precursors, but the two array fields, the per-element schemas, the registry/cron mappers, the
1000-char cap, the env-driven block cap, and the `tengu_stop_hook_block_count` metric are all net-new in the 2.1.143–145
window.
