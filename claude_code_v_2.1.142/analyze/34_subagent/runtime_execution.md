# Subagent Runtime Execution (`runAgent` / `Vb`) — v2.1.142

## Scope

This document is the *inside* of [README.md](./README.md)'s "Spawn → Execute → Return" diagram. Everything that happens between the `Agent` tool resolving `subagent_type` and the parent receiving the `tool_result` envelope is in `runAgent` (`Vb`). It is a **single async generator** (`async function* Vb(...)`) at cli_inner_pretty.js:393099-393434. Its caller drives it with `for await` to pump messages back to the parent's REPL.

The function has four phases. We label them by what they *commit* — when each phase ends, certain state is durable on disk and certain hook events have fired:

| Phase | Lines | Commit point |
|-------|-------|--------------|
| **Setup** | 393127-393311 | After `Me([initial], u, …)` and `tJ$(u, …)` resolve, the sidechain JSONL has the initial messages and the metadata file describes the agent |
| **LLM loop** | 393316-393366 | Each yielded message has already been written to JSONL (`Me([msg], u, iH)`) before the parent sees it |
| **Stop attach** | 393330-393333 | `A$=true` flips when either `SubagentStop` hook attachment is observed or its progress event fires |
| **Cleanup** | 393369-393433 | Each named step in the `G$` array runs sequentially; `keepaliveGated` steps skip if a *background* run was successful (the worker remained alive) |

The exact contract is: **every message the parent observes has already been persisted before it yields**. There is no buffering layer outside this generator; the parent's `tool_result` envelope is built by reading the *yielded* messages, and crash recovery walks the same JSONL the parent saw.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Agent, Tools, Subagent)

Key functions in this document:
- `runAgent` (`Vb`) - the subagent generator (cli_inner_pretty.js:393099-393434)
- `dropDanglingToolUses` (`cJ6`) - strips `tool_use` blocks with no matching `tool_result` from fork context (cli_inner_pretty.js:393435-393451)
- `recordSidechainTranscript` (`Me`) - writes to the JSONL chain (cli_inner_pretty.js:515274-515276)
- `recordForkContextRef` (`Vy6`) - persists fork-pointer record (cli_inner_pretty.js:515277-515279)
- `mainAgentLoop` (`gC`) - the LLM-driving generator that `Vb` consumes (cli_inner_pretty.js:392128-393013)
- `buildSubagentSystemPrompt` (`d85`) - composes the system prompt; falls back to a static prompt on error (cli_inner_pretty.js:393452-393460)
- `resolveAgentSkill` (`c85`) - tries `bareName`, `parentScope:bareName`, then `*:bareName` suffix match (cli_inner_pretty.js:393461-393472)

## Setup Phase

### Step 1 — `agentId` allocation and transcript subdir

```javascript
// ============================================
// runAgent setup: agentId + transcript subdir
// Location: cli_inner_pretty.js:393127-393135
// ============================================

// ORIGINAL (for source lookup):
let C = q.getAppState(),
  R = C.toolPermissionContext.mode,
  B = kwH(H.model, q.options.mainLoopModel, M, R),
  u = O?.agentId ? O.agentId : hm();
if (v) jVK(u, v);
if (s7H()) {
  let $$ = q.agentId ?? v$();
  s68(u, H.agentType, $$);
}

// READABLE (for understanding):
let appState = toolUseContext.getAppState(),
  permissionMode = appState.toolPermissionContext.mode,
  resolvedModel = resolveAgentModel(agentDef.model, toolUseContext.options.mainLoopModel, modelOverride, permissionMode),
  agentId = override?.agentId ?? createAgentId();              // resumed agents reuse the same id

if (transcriptSubdir) setAgentTranscriptSubdir(agentId, transcriptSubdir);  // jVK
if (isPerfettoTracingEnabled()) {                              // s7H = perfetto gate
  let parentId = toolUseContext.agentId ?? getSessionId();
  registerPerfettoAgent(agentId, agentDef.agentType, parentId); // s68
}

// Mapping: C→appState, R→permissionMode, B→resolvedModel, u→agentId, O→override, v→transcriptSubdir,
//          hm→createAgentId, jVK→setAgentTranscriptSubdir, s7H→isPerfettoTracingEnabled,
//          s68→registerPerfettoAgent, v$→getSessionId
```

`createAgentId` (`hm`) generates a UUID — a fresh subagent uses a fresh id; a resumed subagent reuses the id passed via `override.agentId` from the `uiH` resume entrypoint (see [resume_state.md](./resume_state.md)). The id flows directly into the path `~/.claude/sidechains/<agentId>.jsonl` and into the `agent_id` field on every OTel/HTTP request the agent makes (see [README.md](./README.md) "Identity headers").

`setAgentTranscriptSubdir` (`jVK`) writes a global `Map` (`wK6`, cli_inner_pretty.js:141647) that `getSidechainPath` (`_0`, cli_inner_pretty.js:141621) reads. The subdir feature was added so workflow subagents could group their transcripts under `~/.claude/sidechains/workflows/<runId>/`. The cleanup phase calls `JVK` to delete the entry.

### Step 2 — Permission context construction

The permission context is *not* a static object. It's built lazily by a closure `o(...)` (393149-393168) that re-applies four edits on top of whatever permission context the parent has at the moment of the call. Re-applying on every call is intentional: the parent may change permission mode mid-turn (e.g. switching to plan mode), and the subagent must see those changes through `$H()` / `zH()`.

The four edits, in order:
1. **`MH` (frontmatter permissionMode)** overrides the parent's mode *unless* the parent is in `bypassPermissions`, `acceptEdits`, or `auto`. Those three modes are considered "trust elevations" by the user — frontmatter cannot downgrade them.
2. **`shouldAvoidPermissionPrompts`** is set when (a) caller said `canShowPermissionPrompts=false`, or (b) `permissionMode === "bubble"` and `isAsync=false`, or (c) `isAsync=true` and the caller didn't say otherwise. The flag tells the tool layer not to block on a confirm dialog — it'll either auto-deny or bubble to the parent.
3. **`awaitAutomatedChecksBeforeDialog`** is set when `isAsync=true` and we *would* show a prompt. This makes the permission engine finish async checks (hooks, GitHub auth status) before opening the dialog, so an async subagent's permission prompt doesn't pop up before the engine has decided whether it'll be denied anyway.
4. **`alwaysAllowRules.session = [...allowedTools]`** — if `allowedTools` was passed, the parent's session-allow list is *replaced*, not extended. The CLI-arg layer is preserved separately. This is how the `Agent` tool's `allowedTools` parameter restricts a subagent to a tool subset.

The closure is invoked by the LLM loop through `$H()` and `zH()` callbacks; `zH()` re-runs the closure with the current top-level `AppState`. Memoization is by reference: if the input `$$` is the same `toolPermissionContext` object reference as last call, the cached `e` is returned. This means parent permission changes propagate within one tick.

### Step 3 — Tool-pool resolution

```javascript
// ============================================
// runAgent setup: resolve the subagent's tool pool
// Location: cli_inner_pretty.js:393176-393184
// ============================================

// ORIGINAL (for source lookup):
let _H = H.effort !== void 0 ? () => H.effort : q.getEffortValue,
  YH = P ? j : Li(H, j, _).resolvedTools,
  DH = !P && rS7(I) ? YH.filter(($$) => !iS7.has($$.name)) : YH,
  OH = Array.from(C.toolPermissionContext.additionalWorkingDirectories.keys()),
  GH = O?.systemPrompt ? O.systemPrompt : r4(await d85(H, q, B, OH, DH)),
  TH = !P && bH(process.env.CLAUDE_CODE_ENABLE_APPEND_SUBAGENT_PROMPT) && q.options.appendSubagentSystemPrompt
      ? r4([...GH, q.options.appendSubagentSystemPrompt])
      : GH;

// READABLE:
let getEffort = agentDef.effort !== undefined ? () => agentDef.effort : toolUseContext.getEffortValue,
  filteredTools = useExactTools
    ? availableTools                                          // fork path: identical to parent
    : resolveAgentTools(agentDef, availableTools, isAsync).resolvedTools,
  toolPool = !useExactTools && isInProcessTeammate(isTeammate)
    ? filteredTools.filter(t => !TEAMMATE_BLOCKED_TOOLS.has(t.name))   // iS7 = e.g. Goal/Skill ban
    : filteredTools,
  cwds = Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys()),
  systemPrompt = override?.systemPrompt
    ? override.systemPrompt
    : composeSystemPrompt(await buildSubagentSystemPrompt(agentDef, toolUseContext, resolvedModel, cwds, toolPool));

// Mapping: H→agentDef, _H→getEffort, YH→filteredTools, DH→toolPool, GH→systemPrompt,
//          P→useExactTools, I→isTeammate, _→isAsync,
//          Li→resolveAgentTools, rS7→isInProcessTeammate, iS7→TEAMMATE_BLOCKED_TOOLS,
//          d85→buildSubagentSystemPrompt, r4→composeSystemPrompt
```

Two important nuances:
- **Fork path bypasses tool resolution** (`P=useExactTools=true`). Fork must hand the LLM byte-identical input to the parent's last request, so it cannot re-filter tools by frontmatter. The fork explicitly inherits the parent's full pool. See [fork_lifecycle.md](./fork_lifecycle.md).
- **In-process teammates are stricter than ordinary subagents** — they have the *Goal*, *SpawnTeammate*, and similar tools removed via `iS7`. Teammates cannot recursively spawn teammates. (The corresponding teammate runner is in [30_agent_team/teammate_runner_loop.md](../30_agent_team/teammate_runner_loop.md).)

`buildSubagentSystemPrompt` (`d85`, 393452-393460) calls `agentDef.getSystemPrompt({ toolUseContext })` and runs it through `HX$` to inject tool-name-anchored sections. On any thrown error, it falls back to a static system prompt (`Ka7`) so an agent author who ships a broken `getSystemPrompt` doesn't crash the subagent — they just get the default prompt.

### Step 4 — SubagentStart hook (`QL$`)

```javascript
// ============================================
// runAgent setup: drain SubagentStart hooks → additional_context
// Location: cli_inner_pretty.js:393187-393198
// ============================================

let vH = override?.abortController ?? (isAsync ? new AbortController() : toolUseContext.abortController),
  additionalContexts = [];
for await (let evt of executeSubagentStartHooks(agentId, agentDef.agentType, vH.signal, undefined, toolUseContext.getAppState))
  if (evt.additionalContexts?.length) additionalContexts.push(...evt.additionalContexts);
if (additionalContexts.length) {
  let attachment = renderAttachment({
    type: "hook_additional_context",
    content: additionalContexts,
    hookName: "SubagentStart",
    toolUseID: crypto.randomUUID(),
    hookEvent: "SubagentStart",
  });
  messages.push(attachment);   // x
}
```

`SubagentStart` hooks can emit `additional_context` blocks that become *real user messages* injected into the subagent's initial message list. The subagent sees them as if the user had prepended that text. The `toolUseID` here is synthetic because the hook didn't originate from a tool call. The hook event mirror in the message ensures the transcript shows what was injected.

`vH` (`abortController`) is *always* a fresh controller for async (background) subagents. Async subagents must be independently cancellable so killing the background job doesn't bubble through the parent's main controller. Foreground subagents share the parent's controller — if the user hits Ctrl+C, the subagent dies too.

### Step 5 — Frontmatter hook registration and skill preload

```javascript
let canRegisterHooks = !DX("hooks") || B7H(H.source);
if (H.hooks && canRegisterHooks) registerFrontmatterHooks(q.sessionHooksRegistry, u, H.hooks, `agent '${H.agentType}'`, true);
```

Hook registration is gated by `DX("hooks")` (settings "hooks" disabled) *unless* the agent source is admin-trusted (`B7H` checks `isSourceAdminTrusted`). This is the same gate as MCP server registration — see [mcpserver_inheritance.md](./mcpserver_inheritance.md) for the rationale (admin-trusted plugins can bypass user-level disables).

The skill preload loop (393201-393231) reads `agentDef.skills[]`, resolves each name via `c85` (which tries bare → `{agentType}:{name}` → `*:{name}` suffix), warns if not found or not prompt-type, and pushes a `w8({ content: [{ type: "text", text: header }, ...skillContent], isMeta: !0 })` message into the initial messages. The `isMeta` flag prevents the skill loader's preamble from being counted toward turn limits.

### Step 6 — MCP client initialization

```javascript
let { clients: hH, agentClients: FH, tools: lH, cleanup: H$ } = await g85(H, q.options.mcpClients),
  nH = lH.length > 0 ? cw([...DH, ...lH], "name") : DH;
```

`g85` (initializeAgentMcpServers) connects to the subagent-declared MCP servers (frontmatter `mcpServers:`), returns the live clients, agent-only clients, the tools they expose, and a `cleanup` function that's invoked unconditionally in the finally block. `cw` deduplicates by `name`, with later entries winning — so an agent's MCP-provided tool can override a built-in tool. See [mcpserver_inheritance.md](./mcpserver_inheritance.md) for the per-agent vs main-thread distinction.

### Step 7 — Transcript and metadata commit

This is the **first durable write**. It happens *before* the LLM loop starts.

```javascript
let pruned = forkContextMessages ? dropDanglingToolUses(forkContextMessages) : [],
  fullMessages = [...pruned, ...promptMessages, ...skillAttachments, ...mcpAttachments],
  toRecord = resumePersistedCount !== undefined
    ? fullMessages.slice(resumePersistedCount)                       // resume dedup (v2.1.132)
    : fullMessages.slice(prunedForkCount);                            // fork: skip parent-context prefix
let parentLastUuid = resumePersistedCount !== undefined
    ? fullMessages[resumePersistedCount - 1]?.uuid
    : forkContextMessages
      ? pruned.at(-1)?.uuid
      : null;

recordSidechainTranscript(toRecord, agentId, parentLastUuid).catch(N);  // Me
writeAgentMetadata(agentId, {                                            // tJ$
  agentType: agentDef.agentType,
  ...(worktreePath && { worktreePath }),
  ...(cwd && { cwd }),
  ...(description && { description }),
  ...(name && { name }),
}).catch(N);
```

Three things to note about the order:
1. The parent's reference is preserved via `parentLastUuid` so each subagent message can later be traced back to its initiating turn. This is what powers "trace this sidechain back to the parent" tooling.
2. The metadata file (`<agentId>.json`) is written with non-undefined-only fields. A fork subagent has no `description`, an in-process teammate has a `name`, a worktree-isolated subagent has a `worktreePath`. The omitted fields aren't `null` — they're just absent.
3. Both writes are **fire-and-forget**: an exception is logged but does not abort the subagent. If the disk is full, the subagent still runs — the parent will get the result but won't be able to resume.

`onCacheSafeParams` is called *after* this commit. The parent's stop-hook system uses the captured snapshot for post-turn forks; see [result_passing.md](./result_passing.md) and [fork_lifecycle.md](./fork_lifecycle.md).

## LLM Loop Phase

The body is a `for await` over `gC(...)`. Every iteration:
1. Calls `onQueryProgress?.()` — a liveness ping for the parent.
2. Detects `SubagentStop` attachment / progress events and sets `A$=true` so the finally block doesn't re-fire the hook.
3. Records API metrics start/end pairs (`ttftMs`, `outputTokens`) keyed by a synthetic UUID per request.
4. Handles `api_error` events (`yield $$` and continue — pass through without recording).
5. Handles attachments: pushes to the `mH` (live messages) buffer, breaks the loop on `max_turns_reached`.
6. For everything that passes `Q85($$)` (a message-filter predicate that drops `stream_event`s and other internal types), records to the sidechain (`Me`), updates the parent UUID pointer (`iH`), and yields.

```javascript
// ============================================
// runAgent LLM loop body — message handling and persistence
// Location: cli_inner_pretty.js:393316-393366
// ============================================

for await (let msg of mainAgentLoop({
  messages: initialMessages,                       // x
  systemPrompt, userContext, systemContext,
  canUseTool,
  toolUseContext: contextOverride,                  // WH = zj6(...)
  querySource, spawnedBySkill,
  maxTurns: maxTurns ?? agentDef.maxTurns,
  forkPointUuid,                                    // F = pruned.at(-1)?.uuid
})) {
  onQueryProgress?.();                              // E?.()
  if (msg.type === "attachment" && msg.attachment.hookEvent === "SubagentStop"
      || msg.type === "progress" && msg.data?.type === "hook_progress" && msg.data.hookEvent === "SubagentStop")
    stopAttached = true;                            // A$
  if (msg.type === "stream_event" && msg.event.type === "message_start" && msg.ttftMs != null) {
    metricId = randomUUID();
    toolUseContext.pushApiMetricsEntry?.({ type: "start", ttftMs: msg.ttftMs, id: metricId });
    continue;
  }
  if (msg.type === "stream_event" && msg.event.type === "message_delta"
      && msg.event.usage.output_tokens != null && metricId != null) {
    toolUseContext.pushApiMetricsEntry?.({ type: "end", outputTokens: msg.event.usage.output_tokens, id: metricId });
    metricId = undefined;
  }
  if (msg.type === "system" && msg.subtype === "api_error") { yield msg; continue; }
  if (msg.type === "attachment") {
    liveBuf?.push(msg);                              // mH
    if (msg.attachment.type === "max_turns_reached") { N(`[Agent: ${agentDef.agentType}] reached max turns`); break; }
    yield msg; continue;
  }
  if (isPersistableMessage(msg)) {                   // Q85
    if (msg.type !== "progress") liveBuf?.push(msg);
    await recordSidechainTranscript([msg], agentId, parentMsgUuid).catch(N);  // Me
    if (msg.type !== "progress") parentMsgUuid = msg.uuid;                     // iH = $$.uuid
    yield msg;
  }
}
```

**Why the `mH` (live messages) buffer exists alongside the JSONL.** The JSONL is the *durable* record. `mH` is what `onCacheSafeParams` retains so the parent's stop-hook machinery (and Auto-Compact) can replay a fresh subagent turn from the in-memory snapshot without re-reading the disk. The buffer is intentionally distinct from `x` (the initial messages); `x` is what was sent to the *first* LLM call, `mH` accumulates everything generated *during* the LLM call. The cleanup phase clears both.

**Why progress messages aren't UUID-tracked.** Progress messages are notification envelopes (e.g. `<task-notification>` from `startAgentSummarization`); they don't establish causality and would otherwise corrupt the parent-pointer chain. The condition `if ($$.type !== "progress") iH = $$.uuid` is the chain-builder.

**Why `Q85` filtering happens here, not in `gC`.** `gC` is the LLM-protocol generator. It yields the full set of events including `stream_event` deltas (one per token group). `Vb` is the place where "what counts as a message for transcript and parent" is decided. Putting it here means `gC` stays generic and reusable for the main agent loop too.

## Stop Attach Phase

The `A$` flag tracks whether `SubagentStop` was fired *by the loop itself*. There are two signal sources:
1. An `attachment` whose `hookEvent === "SubagentStop"` — the synthetic event injected by the hook system when the LLM loop naturally completes.
2. A `progress` event with `data.type === "hook_progress"` and `data.hookEvent === "SubagentStop"` — the in-flight progress notification from a `SubagentStop` hook that is still running its commands.

If either fires, the finally block's first cleanup step (the `SubagentStop` hook re-fire) short-circuits — `if (A$) return`. Otherwise, the loop was interrupted (abort, max-turns, or an uncaught throw) and we fire the hook synthetically: `S9H(undefined, undefined, 5000, false, agentId, contextOverride, undefined, agentType)`. The `5000` is a 5-second timeout; an interrupted hook may not have fresh inputs ready, so we cap it.

After the loop exits normally:
```javascript
if (vH.signal.aborted) throw new ZA();   // ZA = AbortError analog
if (rj(H) && H.callback) H.callback();   // synthetic-agent callback (background summarization, etc.)
```

`ZA` is the error class the parent catches to map "subagent was cancelled" into the right `tool_result` shape (typically a `cancelled` envelope, not an error). The callback hook is for *synthetic* agent definitions (`rj` = isSyntheticAgent), like the FORK_AGENT — these definitions can attach a callback that fires once the LLM loop completed normally. Not the same as a frontmatter hook.

## Cleanup Phase

The cleanup steps run **in sequence, not parallel**. The order matters:

```javascript
let keepalive = isAsync && stopAttached && !vH.signal.aborted && registerKeepalive(agentId, q.taskRegistry),   // qa7
  steps = [
    { name: "SubagentStop",     run: async () => { if (stopAttached) return; for await (let _ of S9H(undefined, undefined, 5000, false, agentId, contextOverride, undefined, agentDef.agentType)); } },
    { name: "mcp",               run: () => mcpCleanup() },                  // H$
    { name: "sessionHooks",      run: () => { if (agentDef.hooks) sessionHooksRegistry.clear(agentId); } },
    { name: "promptCacheTracking", run: () => { if (isPromptCacheTrackingEnabled()) clearPromptCacheTracking(agentId); } },  // vnK
    { name: "readFileState",     run: () => contextOverride.readFileState.clear() },
    { name: "sentSkillNames",    run: () => clearSentSkillNames(agentId) },  // $a7
    { name: "initialMessages",   run: () => { initialMessages.length = 0; } },
    { name: "liveMessages",      run: () => { if (liveBuf) liveBuf.length = 0; } },
    { name: "replHydrationSnapshot", run: () => { contextOverride.replHydration = undefined; } },
    { name: "perfetto",          run: () => unregisterPerfettoAgent(agentId) },  // nTH
    { name: "transcriptSubdir",  run: () => clearAgentTranscriptSubdir(agentId) }, // JVK
    { name: "todos",             run: () => agentLifecycle.clearTodos(agentId) },
    { name: "replContext",       run: () => { let ctx = getReplContexts()[agentId]; if (ctx) { ctx.clearAllTimers(); setReplContext(agentId, undefined); } } },
    { name: "mcpMonitors",       keepaliveGated: true, run: () => {} },
    { name: "shellTasks",        keepaliveGated: true, run: () => clearShellTasks(agentId, taskRegistry) },  // en7
  ];
for (let step of steps) {
  if (keepalive && step.keepaliveGated) continue;   // background-alive worker keeps shell tasks/mcp monitors
  await step.run();
}
```

### Why two pseudo-states (keepalive vs full-cleanup)

When `isAsync=true` *and* the subagent stopped normally *and* the abort signal isn't set, the system registers the agent as "kept alive" via `qa7` in `taskRegistry`. Two cleanup steps are then skipped:
- `mcpMonitors` — keep monitoring MCP servers (because progress summarization might still need them).
- `shellTasks` — keep the agent's spawned shell tasks alive (because `<task-notification>` envelopes are still reporting back).

This is the mechanism that supports `run_in_background: true` on the Agent tool: the LLM-loop generator has fully exited, the parent has received its initial "started in background" response, but the agent's *task surface* (shells, MCP monitors, summarization timer) stays alive until the parent explicitly polls/kills.

### Why the `SubagentStop` re-fire is bounded at 5s

`S9H` is the hook runner. When `Vb` finished without attaching a `SubagentStop` (e.g. AbortError thrown), the hook still needs to fire so user-side state (notifications, telemetry, audit logs) is consistent. But because the loop was interrupted, the hook's `transcript_snapshot` input may not be fully materialized — we cap at 5s and proceed. The hook return value is discarded; cleanup is a one-way operation.

### Why `mH.length = 0` instead of reassigning

The `liveBuf` (`mH`) variable is captured by the `onCacheSafeParams` callback's closure (see Step 7) — the parent's stop-hook system holds a reference. Reassigning `mH = []` would not be observable by the parent, but clearing `mH.length = 0` is. This frees memory while keeping the reference valid.

### Why `messages.length = 0`

`messages` (`x`) is the initial-messages array. The parent doesn't hold a reference to it (it's a local in `Vb`), but the subagent's hook system may have leaked references during execution. Empty-zeroing breaks those reference chains so GC can collect.

## Synchronous-vs-Async Decision Tree

```
              isAsync ?
            ┌────┴────┐
           no         yes
            │          │
            │       canShowPermissionPrompts === undefined ?
            │       ┌────┴────┐
            │      no         yes
            │       │          │
            │   use the      M$ = isAsync = true  (avoid prompts; background)
            │   caller's
            │   value
            │
       permissionMode === "bubble" ?
        ┌────┴────┐
       no         yes
        │          │
   M$ = false   M$ = false (prompts shown)
   (prompts     but awaitAutomatedChecks
   shown        before dialog (if async)
   in REPL)
```

The two flags `shouldAvoidPermissionPrompts` and `awaitAutomatedChecksBeforeDialog` materialize this decision into the permission context. The async subagent path is what powers `run_in_background: true` and the implicit fork — neither of these can interactively prompt because the parent's REPL is busy.

## Cross-Validation with v2.1.88

v2.1.88's `runAgent` in `src/tools/AgentTool/runAgent.ts` has the same shape and most of the same parameters. Key differences:

| Feature | v2.1.88 | v2.1.142 |
|---------|---------|----------|
| Generator signature | `async function* runAgent({...})` | identical (`Vb`) |
| Parameter `useExactTools` | Present (fork path) | Present (`P`) |
| Parameter `onQueryProgress` | Present (liveness ping) | Present (`E`) |
| Parameter `isTeammate` | Absent | Present (`I`, gates teammate-blocked-tools filter via `iS7`/`rS7`) |
| Parameter `resumePersistedCount` | Absent | Present (`h`, v2.1.132 dedup) |
| Parameter `name` | Absent | Present (`V`, for teammate metadata) |
| Cleanup keepalive gating | Not present | `keepaliveGated` flag on `mcpMonitors`, `shellTasks` |
| `S9H` SubagentStop fallback | Present but no 5s cap | 5-second timeout (v2.1.140) |
| Perfetto registration | Behind `isPerfettoTracingEnabled()` gate | Same (`s7H`/`s68`) |
| `forkContextMessages` pruning | `dropDanglingToolUses` (same predicate) | Same (`cJ6`) — strips assistant messages whose `tool_use` has no matching `tool_result` |
| Agent context ALS | `runWithAgentContext(...)` wraps generator | `RU` wraps generator (see [als_propagation.md](./als_propagation.md)) |

The v2.1.88 file `src/tools/AgentTool/runAgent.ts:329-end` parameter list, when read against the v2.1.142 destructure, makes the *added* params obvious: `isTeammate`, `resumePersistedCount`, `name`. They line up with the v2.1.116/132/140 changelog entries.

## Why a Single Async Generator?

A subagent could have been a separate process (like background agents) or a Promise that resolves with the final transcript. Instead it's a generator the parent consumes with `for await`. Three reasons:

1. **Streaming back-pressure.** The parent's REPL renders each assistant message as it arrives. If `runAgent` were a promise, the parent would block until the entire subagent turn completes, defeating real-time output. With `for await`, the parent pulls one message at a time, and the LLM loop only advances when the parent has consumed the previous yield.
2. **Cancellation propagation.** Throwing into a generator (`yield` site or via `vH.signal`) is a single, well-defined operation. The parent's main controller is reused as `vH` for foreground subagents — when the parent aborts, the subagent's next `yield` will throw, and the finally block runs cleanup automatically. A promise + abort-controller pair would require manual wiring.
3. **Composition.** The fork-subagent path needs to feed the same generator as the regular path. A generator's "messages flow through" abstraction makes this drop-in: the fork's `Vb` invocation differs only in `forkContextMessages` and `useExactTools`, not in protocol.

The cost is that subagents share the parent process's heap. A runaway subagent can OOM the parent. Mitigations: the `maxTurns` limit (default 200 for synthetic agents, frontmatter-overridable), the cleanup phase's aggressive array-zeroing, and the `messages array drained` step in finally.
