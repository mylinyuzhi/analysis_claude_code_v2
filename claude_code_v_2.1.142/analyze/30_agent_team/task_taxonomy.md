# Task Taxonomy — v2.1.142

## TL;DR

Every piece of asynchronous, user-visible work that Claude Code launches —
from a 30-second `Bash` invocation to a multi-hour cloud-hosted ultraplan
session — is modelled as a single uniform **task record** stored in
`AppState.tasks[id]`. The discriminator field `type` selects one of **eight**
concrete shapes, each backed by a TypeScript module (the 2.1.88 source) and a
distinct on-disk task-ID prefix (the 2.1.142 obfuscated bundle).

| `type` | ID prefix | Where it runs | Module (v2.1.88) | v2.1.142 obfuscated |
|--------|-----------|---------------|------------------|---------------------|
| `local_bash` | `b…` | Same process, shell child | `tasks/LocalShellTask/` | (multiple) |
| `local_agent` | `a…` | Same process, Agent-tool dispatch | `tasks/LocalAgentTask/LocalAgentTask.tsx` | `xi7` dispatch, `LocalAgentTask` referenced |
| `in_process_teammate` | `t…` | Same process, team-spawned | `tasks/InProcessTeammateTask/` | `t68` spawn, `X65`/`L65` runner |
| `remote_agent` | `r…` | Anthropic-hosted via Bridge | `tasks/RemoteAgentTask/` | (multiple, ~line 335673) |
| `local_workflow` | `w…` | Same process, workflow script (`/<workflow>`) | (`tasks/LocalWorkflowTask/`) | refs line 348812, 477940 |
| `monitor_mcp` | `m…` | Same process, MCP monitor subscription | (`tasks/MonitorMcpTask/`) | refs line 348814, 478004 |
| `mcp_task` | `k…` | Long-running MCP server task | (not in 2.1.88 src dir) | refs line 477972, 348816 |
| `dream` | `d…` | Background self-review pass | (`tasks/DreamTask/`) | refs `xI("dream")` line 377747 |

All eight share a base shape (`TaskStateBase`, built by `_2` /
`createTaskStateBase` at `cli_inner_pretty.js:518764`) and a `Task` interface
that exposes `{ name, type, async kill(taskId, setAppState) }`.

The set of types that participate in **agent-team mailbox/identity** plumbing
is a subset: `wu5 = new Set(["local_agent", "remote_agent",
"in_process_teammate", "local_workflow"])` (`cli_inner_pretty.js:518784`) — the
others are operational/background helpers without their own agent identity.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Background Agents, Agent Team
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Agent Loop, Agents, State

Key functions and constants:
- `createTaskStateBase` (`_2`) — base shape factory (cli_inner_pretty.js:518764-518776)
- `TASK_ID_PREFIX_BY_TYPE` (`Du5`) — `{local_bash:"b", local_agent:"a", remote_agent:"r", in_process_teammate:"t", local_workflow:"w", monitor_mcp:"m", mcp_task:"k", dream:"d"}` (cli_inner_pretty.js:518785-518794)
- `AGENT_TYPED_TASK_KINDS` (`wu5`) — types that own an `agentId` (cli_inner_pretty.js:518784)
- `appendCappedMessage` (`ETH`) — 50-message cap for teammate `messages` (cli_inner_pretty.js:234257-234265)
- `TEAMMATE_MESSAGES_UI_CAP` (`Pq7`) — `50` (cli_inner_pretty.js:234265)
- `isInProcessTeammateTask` (`lD`/`Wq7`) — type predicate (cli_inner_pretty.js:234254-234256)
- `getRunningTeammatesSorted` — sort-by-agentName helper (referenced by pill/footer/spinner-tree; v2.1.88 has the explicit export)
- `pillLabelFromBackgroundTasks` (`LnH`) — "1 team" / "N local agents" / "ultraplan needs your input" rendering (cli_inner_pretty.js:348780-348822)
- `pillNeedsCta` (`bx7`) — diamond CTA gate for ultraplan attention states (cli_inner_pretty.js:348823-348827)

---

## The Base Shape — `TaskStateBase`

Every task starts from this skeleton, produced by `_2(id, type, description,
toolUseId)`:

```javascript
// ============================================
// createTaskStateBase - Common scaffolding for every task type
// Location: cli_inner_pretty.js:518764-518776
// ============================================

// ORIGINAL (for source lookup):
function _2(H, $, q, K) {
  return {
    id: H,
    type: $,
    status: "pending",
    description: q,
    toolUseId: K,
    startTime: Date.now(),
    outputFile: Ef(H),
    outputOffset: 0,
    notified: !1,
  };
}

// READABLE (for understanding):
function createTaskStateBase(id, type, description, toolUseId) {
  return {
    id,
    type,
    status: "pending",            // → "running" → terminal: "completed"|"failed"|"killed"
    description,
    toolUseId,                    // back-reference to the tool_use that spawned this
    startTime: Date.now(),
    outputFile: getTaskOutputPath(id),
    outputOffset: 0,              // for incremental output reads
    notified: false,              // gate for one-shot completion notification
  };
}

// Mapping: _2→createTaskStateBase, H→id, $→type, q→description, K→toolUseId, Ef→getTaskOutputPath
```

Every concrete task type **extends** this with its own fields. The shared
fields are what the pill/footer/dialog UIs use to render generic info; the
type-specific fields are what type-specialized panels show.

### Status state machine

`pending → running → {completed, failed, killed}`

Terminal states are detected by `isTerminalTaskStatus`. Some types add
intermediate sub-states (e.g., `'idle'` for an in_process_teammate waiting
for inbox traffic; `'backgrounded'` flag for local_agent). The terminal-state
fan-in is centralized so the UI can uniformly decide eviction and notification.

### Why a uniform shape across such different runtimes?

**What it does:** Every parallel work item the user can see in the TUI lives
in `AppState.tasks[id]` regardless of whether it's a 30 ms `ls` or a 6-hour
ultraplan.

**Why this approach:**
- **One pill, one panel, one selector.** The footer pill, background-task
  dialog (`←`), and FleetView dashboard all iterate the same record. Adding
  a new task type adds a renderer; it does not require new UI plumbing.
- **One cancellation contract.** Every type implements `Task.kill(taskId,
  setAppState)`. Ctrl-C in agent view, the `TaskStop` tool, and the daemon's
  retire-on-idle path all call the same method. The implementation differs
  per type (`SIGTERM` for `local_bash`, `abortController.abort()` for
  `in_process_teammate`, daemon-control "shutdown" for `remote_agent`), but
  the call site is uniform.
- **One notification queue.** When a task transitions to terminal, the
  framework enqueues a `<task-notification>` XML block into the model's next
  user message. The same XML format works for every type; the model only
  needs to parse one envelope.

**Trade-offs:**
- Per-type fields cause discriminated-union complexity throughout the UI
  code (each renderer branches on `type`).
- Type-erasure helpers (`isInProcessTeammateTask`, `isLocalAgentTask`,
  `isPanelAgentTask`) proliferate.

**Key insight:** The uniform shape is what makes "parallelism is your
superpower" workable — every task type composes into the same TUI surface
and the same `AppState`, so launching 8 different kinds of work concurrently
needs no special coordination.

---

## Type 1: `local_bash`

The `Bash` tool's monitored execution mode (started via the `Monitor` tool
or by `Bash` with explicit `run_in_background: true`). Runs a shell child,
keeps stdout/stderr streaming to a per-task output file, exposes pause/resume
via the daemon's PTY socket when launched as a long-runner.

```typescript
type LocalShellTaskState = TaskStateBase & {
  type: 'local_bash';
  command: string;
  cwd: string;
  kind: 'shell' | 'monitor';    // 'monitor' = launched via Monitor tool
  pid?: number;
  exitCode?: number;
  child?: ChildProcess;          // runtime only, not persisted
}
```

UI: rendered as `1 shell` / `2 shells` / `1 monitor` in the pill label
(`LnH` line 348786-348793).

Cross-references: `tasks/LocalShellTask/LocalShellTask.tsx` (v2.1.88),
`tasks/LocalShellTask/killShellTasks.ts`, `tasks/LocalShellTask/guards.ts`.

---

## Type 2: `local_agent`

A subagent dispatched via the `Agent` tool, running in the **same Node.js
process** as the leader. Its identity is tracked via `AsyncLocalStorage`
(`Atq`); see `agent_identity_propagation.md`.

```typescript
type LocalAgentTaskState = TaskStateBase & {
  type: 'local_agent';
  agentId: string;
  prompt: string;
  selectedAgent?: AgentDefinition;
  agentType: string;             // 'general-purpose', 'main-session', or user-defined
  model?: string;
  abortController?: AbortController;
  unregisterCleanup?: () => void;
  error?: string;
  result?: AgentToolResult;
  progress?: AgentProgress;
  retrieved: boolean;
  messages?: Message[];
  lastReportedToolCount: number;
  lastReportedTokenCount: number;
  isBackgrounded: boolean;       // foreground until the user presses ↓
  pendingMessages: string[];     // queued via SendMessage mid-turn
  retain: boolean;               // UI is "holding" this task → blocks eviction
  diskLoaded: boolean;           // sidechain JSONL has been read into messages
  evictAfter?: number;           // GC deadline after terminal transition
}
```

### Foreground vs Backgrounded

A new local_agent starts foreground (`isBackgrounded: false`), meaning it
takes over the leader's main turn. After **autoBackgroundMs** (the
"BackgroundHint" timer fires; constant set per dispatch site), or the user
explicitly hits the down-arrow, it transitions to `isBackgrounded: true` and
the leader's turn resumes. A `backgroundSignal` Promise (kept in the module
map `backgroundSignalResolvers`) is resolved to interrupt the agent loop.

### Retain / EvictAfter

The `retain` flag lets a UI surface (e.g., the agent panel in coordinator
mode in v2.1.88) declare "I'm holding this task, don't GC it." When the
last holder releases retain, `evictAfter = Date.now() + PANEL_GRACE_MS`
schedules eviction. This decouples task lifetime from UI lifetime so a
quickly-completing task isn't gone before the user reads it.

### Pending Messages

`pendingMessages[]` is the queue drained between tool rounds. When a
coordinator sends `SendMessage({to: <agent-id>, message: "..."})` to a
running local_agent, the message is pushed to this array; at the next
tool-round boundary `drainPendingMessages` pulls them and threads them into
the agent loop's input.

### Panel Predicate (post-v2.1.142, in 2.1.88)

```typescript
function isPanelAgentTask(t: unknown): t is LocalAgentTaskState {
  return isLocalAgentTask(t) && t.agentType !== 'main-session'
}
```

The "main-session" agentType is special: it's the leader itself when a
session has been forked. The panel predicate excludes it so the leader isn't
shown alongside its own subagents in the coordinator-mode panel. This
predicate is **new in v2.1.88** and not present in v2.1.142.

---

## Type 3: `in_process_teammate`

A teammate spawned by a team-lead inside the same process, isolated by
`AsyncLocalStorage` (`Ei8`), communicating with the leader via the file
mailbox.

```typescript
type TeammateIdentity = {
  agentId: string;               // "researcher@my-team"
  agentName: string;             // "researcher"
  teamName: string;
  color?: string;
  planModeRequired: boolean;
  parentSessionId: string;       // leader's session ID
}

type InProcessTeammateTaskState = TaskStateBase & {
  type: 'in_process_teammate';
  identity: TeammateIdentity;
  prompt: string;
  model?: string;
  selectedAgent?: AgentDefinition;
  abortController?: AbortController;          // kills the WHOLE teammate
  currentWorkAbortController?: AbortController; // aborts current turn only
  unregisterCleanup?: () => void;
  awaitingPlanApproval: boolean;
  permissionMode: PermissionMode;             // independently cyclable via Shift+Tab
  error?: string;
  result?: AgentToolResult;
  progress?: AgentProgress;
  messages?: Message[];                        // capped at TEAMMATE_MESSAGES_UI_CAP = 50
  inProgressToolUseIDs?: Set<string>;
  pendingUserMessages: string[];               // queue from leader's transcript view
  spinnerVerb?: string;                        // stable random verb across re-renders
  pastTenseVerb?: string;
  isIdle: boolean;                             // true when waiting for inbox traffic
  shutdownRequested: boolean;
  onIdleCallbacks?: Array<() => void>;
  lastReportedToolCount: number;
  lastReportedTokenCount: number;
}
```

### Two Abort Controllers

The split into `abortController` (whole-teammate) and
`currentWorkAbortController` (current-turn) lets the leader interrupt a
specific tool round without tearing down the whole teammate's state. This
matters because the teammate's process-wide state (mailbox cursor, plan-mode
flag, AppState identity) survives a current-turn abort and is reused on the
next turn — only the in-flight LLM call and its tool calls are killed.

### `pendingUserMessages` vs Mailbox

`pendingUserMessages[]` is the **in-memory** queue from the leader's TUI
when the user is viewing a teammate's transcript (the Shift+→ "zoom into
teammate" path). It bypasses the mailbox entirely; the runner's 5-priority
order processes it first (see `teammate_runner_loop.md` priority #1). This
keeps interactive typing latency-free.

### Capped Messages

The `messages` array — the UI mirror for the zoomed transcript dialog — is
capped at `TEAMMATE_MESSAGES_UI_CAP = 50` entries via `appendCappedMessage`
(`ETH` cli_inner_pretty.js:234257-234265). The full transcript lives on
disk; the in-memory copy is for fast rendering of recent turns only. The
2.1.88 source comment cites a memory analysis that found ~125 MB per
concurrent teammate at 500+ turn sessions without the cap.

### Idle / Shutdown

`isIdle: true` after a teammate's runner has nothing to do (no pending user
messages, no unread inbox traffic, no claimable task). The leader's UI
shows idle teammates greyed out. `shutdownRequested` is set when the leader
issues `SendMessage({to, message: {type: "shutdown_request", ...}})`; the
runner exits its poll loop on the next iteration.

---

## Type 4: `remote_agent`

A session hosted by Anthropic-side infrastructure, reached over the **Bridge
transport** (HTTPS+SSE). Used for the `ultrareview` / `ultraplan`
cloud-hosted multi-agent flows.

```typescript
type RemoteAgentTaskState = TaskStateBase & {
  type: 'remote_agent';
  remoteSessionId: string;       // cloud session UUID
  sessionId: string;             // local proxy session
  title: string;
  isUltraplan?: boolean;
  ultraplanPhase?: 'plan_ready' | 'needs_input' | undefined;
  isRemoteReview?: boolean;      // ultrareview variant
  // … other cloud-specific fields
}
```

### UI Diamonds

The pill renderer (`LnH` line 348800-348810) uses a filled diamond
(`◆ DIAMOND_FILLED`) for `ultraplanPhase: 'plan_ready'` and an open diamond
(`◇ DIAMOND_OPEN`) for `'needs_input'` or normal running. The diamond
glyphs are the v2.1.142 visual cue that an ultraplan needs attention.

### When the Pill Shows a CTA

`pillNeedsCta` (`bx7`, cli_inner_pretty.js:348823-348827) returns true when
exactly one remote_agent is in an `ultraplan` attention state — that's when
the pill renders `· ↓ to view`. For non-ultraplan cloud sessions, the pill
shows just `◇ 1 cloud session` without a call-to-action.

---

## Type 5: `local_workflow`

A workflow script (the `/<workflow-name>` slash-command kind backed by a
`workflows/` definition file) executing in the background. Workflows are
self-driving sequences of agent + bash + Edit operations encoded as a YAML/
TS spec.

```typescript
type LocalWorkflowTaskState = TaskStateBase & {
  type: 'local_workflow';
  workflowName: string;
  workflowPath?: string;
  agentCount: number;            // number of agents the workflow has spawned
  // … workflow-specific fields
}
```

UI shows `N agents` while running, `done` when complete. Has its own kill
path (`NX8` in the bg-task dialog) that tears down the spawned agents in
order.

---

## Type 6: `monitor_mcp`

An MCP server subscription that the user kicked off explicitly (e.g.,
`/mcp <server> monitor`). The task represents the subscription's lifetime;
incoming events accumulate in the task's output file.

```typescript
type MonitorMcpTaskState = TaskStateBase & {
  type: 'monitor_mcp';
  serverName: string;
  // … monitor-specific fields
}
```

UI shows `1 monitor` / `N monitors` in the pill.

---

## Type 7: `mcp_task`

A long-running MCP tool invocation (distinct from `monitor_mcp` which is a
subscription). Used when an MCP server reports back that a tool call is
long-lived and the user can keep typing while it completes. The task's
`mcpTaskId` is the server's identifier; `serverName/toolName` identifies the
call.

```typescript
type McpTaskState = TaskStateBase & {
  type: 'mcp_task';
  mcpTaskId: string;
  serverName: string;
  toolName: string;
  mcpStatus: string;             // server-supplied status string
  statusMessage?: string;
}
```

UI shows `1 MCP task` / `N MCP tasks` in the pill, with the per-row
rendering pulling the first 8 chars of `mcpTaskId` as a label, then
`server/tool · {short-id} · {status}`.

---

## Type 8: `dream`

A background "self-review" pass where Claude analyses its own past
sessions, looking for memory-worthy patterns, recurring errors, or
candidate skills. The runtime spawns a Bun child that walks the project's
session transcripts, may edit files (its "filesTouched" array), and reports
back when done.

```typescript
type DreamTaskState = TaskStateBase & {
  type: 'dream';
  phase: 'reviewing' | 'updating' | 'done';
  sessionsReviewing: number;
  filesTouched: string[];
}
```

UI shows `dreaming` (singular, no count) in the pill — there's at most one
dream task at a time.

The dream task is dispatched by the `auto_dream` runtime; see
`31_auto_memory/auto_dream_runtime.md` for the actual reasoning.

---

## How Types Are Routed in the UI

A single `r6.useMemo` call in the background-task dialog
(`cli_inner_pretty.js:479660-479687`) bucket-sorts a flat `tasks` map into
per-type arrays, then concatenates them into a navigable list:

```javascript
let wH = MH.filter((GH) => GH.type === "local_bash"),
    e  = MH.filter((GH) => GH.type === "remote_agent"),
    o  = MH.filter((GH) => GH.type === "local_agent" && GH.id !== A),
    $H = MH.filter((GH) => GH.type === "local_workflow"),
    zH = MH.filter((GH) => GH.type === "monitor_mcp"),
    _H = MH.filter((GH) => GH.type === "mcp_task"),
    YH = MH.filter((GH) => GH.type === "dream"),
    DH = z ? [] : MH.filter((GH) => GH.type === "in_process_teammate");
```

The leader pseudo-task `{ id: "__leader__", type: "leader", … }` is
prepended when any teammates exist — so the user can "view leader" alongside
"view teammate" from the same dialog.

Selection order (the order the user tabs through with ↓/↑):

1. Leader pseudo-row (if teammates exist)
2. In-process teammates (alphabetical by `agentName`)
3. Local bash tasks
4. Monitor-MCP tasks
5. MCP tasks
6. Remote agents
7. Local agents (excluding the currently-displayed one)
8. Local workflow tasks
9. Dream tasks

### Key Bindings (Background-Task Dialog)

| Key | Action |
|-----|--------|
| `↑` / `↓` | Move selection |
| `←` | Dismiss dialog |
| `x` | Kill selected (per-type kill function) |
| `f` | "View" — Shift to teammate view (in_process_teammate) or leader view (leader pseudo-row) |
| Enter | Open detail panel (mode = `'detail'`) for any non-mcp_task |

The per-type kill functions (`q38.kill`, `$38.kill`, `oO$.kill`, `ef8.kill`,
`uvH.kill` at lines 479730-479744) are the indirection layer the dialog uses
to call into each task's `Task.kill(taskId, ...)` implementation.

---

## The `Task` Interface

Each task type declares a uniform interface:

```typescript
// v2.1.88 reference (matches v2.1.142 behavior):
type Task = {
  name: string;            // e.g., 'InProcessTeammateTask', 'LocalAgentTask'
  type: TaskTypeStr;       // matches the discriminator
  async kill(taskId, setAppState): Promise<void>;
}
```

The implementations are tiny — `kill` typically just calls a type-specific
helper like `killInProcessTeammate` / `killAsyncAgent`. The interface
exists to give the framework a single dispatch table:

```typescript
// v2.1.88 sketch of the dispatch (the 2.1.142 obfuscated equivalent is
// scattered across the bg-task dialog code; the principle is identical):
const taskKillers = {
  in_process_teammate: InProcessTeammateTask,
  local_agent:         LocalAgentTask,
  local_bash:          LocalShellTask,
  remote_agent:        RemoteAgentTask,
  local_workflow:      LocalWorkflowTask,
  monitor_mcp:         MonitorMcpTask,
  mcp_task:            McpTask,
  dream:               DreamTask,
};

function killTask(task: TaskState, setAppState: SetAppState) {
  taskKillers[task.type].kill(task.id, setAppState);
}
```

### Per-type kill semantics

| Type | Kill action |
|------|-------------|
| `local_bash` | `child.kill('SIGTERM')`, set status to `killed` |
| `local_agent` | `abortController.abort()`, transition to `killed`, schedule eviction |
| `in_process_teammate` | `abortController.abort()`, fire `onIdleCallbacks` so leader stops waiting, transition to `killed`, clear `teamContext.teammates[agentId]` |
| `remote_agent` | Send daemon-control "shutdown" over UDS, transition to `killed` |
| `local_workflow` | Recursively kill spawned sub-agents, then mark workflow killed |
| `monitor_mcp` | Unsubscribe from MCP server, transition to `killed` |
| `mcp_task` | Send MCP cancel notification |
| `dream` | Abort the dream Bun child |

---

## Task ID Generation

```javascript
// ============================================
// TASK_ID_PREFIX_BY_TYPE - The single-char prefix every task ID carries
// Location: cli_inner_pretty.js:518785-518794
// ============================================

// ORIGINAL (for source lookup):
Du5 = {
  local_bash: "b",
  local_agent: "a",
  remote_agent: "r",
  in_process_teammate: "t",
  local_workflow: "w",
  monitor_mcp: "m",
  mcp_task: "k",
  dream: "d",
};

// READABLE (for understanding):
TASK_ID_PREFIX_BY_TYPE = {
  local_bash:          "b",  // e.g., b0123abcd
  local_agent:         "a",  // e.g., a89efghij
  remote_agent:        "r",
  in_process_teammate: "t",
  local_workflow:      "w",
  monitor_mcp:         "m",
  mcp_task:            "k",  // MCP server task
  dream:               "d",
};
```

The ID format is `<prefix><8-char base36>` (using the alphabet
`"0123456789abcdefghijklmnopqrstuvwxyz"` at `Ly4` line 518780). A small
helper `xI(type)` (the `_28`/`_29` family) generates a new ID; deterministic
per-task only in that the prefix is fixed by type.

### Why prefixes?

**Debuggability.** When the user sees `t89abcdef` in a log line, the prefix
immediately says "this was an in-process teammate". When they see
`a4ef0a12`, that's a local subagent. Across thousands of log entries the
prefix dramatically cuts the cognitive load of correlating ID → kind.

**Cheap routing.** Code that needs to fan out by type can switch on the
first character of the ID without consulting AppState. This is rarely done
(most call sites have the task object available), but it's a useful escape
hatch in low-level helpers (e.g., the daemon's roster file, which carries
only IDs).

---

## What's NOT a Task

For completeness, several pieces of work that *look* like they might belong
in the taxonomy but don't:

- **Skill invocations** — they run synchronously inside a tool call, no
  task record.
- **MCP tool calls (non-monitored)** — same; the tool returns its result
  inline.
- **Bash without `run_in_background`** — synchronous; no task record.
- **Sub-tool-calls from a Skill or Agent's body** — they go through the
  normal tool execution; no separate task record.
- **The `/goal` overlay** — a Stop-hook-as-loop, not a Task. See
  `39_goal/`.
- **Compaction passes** — synchronous in the leader's stream; no Task.
- **PreCompact / Stop hooks** — synchronous; no Task.

The distinguishing rule: **"would the UI show a separate progress
indicator for this?"** If yes, it's a Task. If no, it's just a synchronous
step inside whatever caller fired it.

---

## v2.1.88 Cross-Reference

v2.1.88's TypeScript source organizes each type into its own directory
under `src/tasks/`:

```
src/tasks/
├── DreamTask/DreamTask.ts                       (157 lines)
├── InProcessTeammateTask/InProcessTeammateTask.tsx (125 lines)
├── InProcessTeammateTask/types.ts               (121 lines)
├── LocalAgentTask/LocalAgentTask.tsx            (682 lines)  ← largest
├── LocalShellTask/LocalShellTask.tsx            (522 lines)
├── LocalShellTask/guards.ts                      (41 lines)
├── LocalShellTask/killShellTasks.ts              (76 lines)
├── RemoteAgentTask/RemoteAgentTask.tsx          (855 lines)  ← largest
├── LocalMainSessionTask.ts                      (479 lines)  ← new in 2.1.88
├── pillLabel.ts                                  (82 lines)  ← getPillLabel
├── stopTask.ts                                  (100 lines)
└── types.ts                                      (46 lines)  ← the union
```

Some 2.1.88-only additions (not yet in v2.1.142):

- **`LocalMainSessionTask`** — a task type representing the leader's own
  main session as a first-class task. In v2.1.142 the leader is represented
  by a synthetic pseudo-row `{id: "__leader__", type: "leader"}` only in
  the bg-task dialog; in v2.1.88 it's a real task. This is the substrate
  for v2.1.88's coordinator-mode panel.
- **`isPanelAgentTask(t)`** predicate — `local_agent` that's not the main
  session, used by the panel to filter. Not in v2.1.142.
- **`pillLabel.ts`** as a shared module — in v2.1.142 the equivalent logic
  is the `LnH` function but it's not split into a named module.

These differences foreshadow v2.1.142 → 2.1.88 design changes but do not
contradict the v2.1.142 implementation analyzed here.

---

## See Also

- [teammate_runner_loop.md](./teammate_runner_loop.md) — `in_process_teammate` runtime detail
- [fleet_view_ui.md](./fleet_view_ui.md) — how these types render in the FleetView dashboard
- [team_lifecycle_tools.md](./team_lifecycle_tools.md) — TeamCreate / TeamDelete / SendMessage tools that produce these task records
- [coordinator_process_model.md](./coordinator_process_model.md) — daemon-supervised bg variant (different task type? no — bg workers are *processes*, not tasks; the dispatcher records them under `bgWorkerManager`'s workers map, not `AppState.tasks`)
- [agent_identity_propagation.md](./agent_identity_propagation.md) — which types own an `agentId` (the `wu5` set)
