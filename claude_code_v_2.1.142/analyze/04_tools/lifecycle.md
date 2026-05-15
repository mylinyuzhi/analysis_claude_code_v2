# Tool Lifecycle — Call → Render → Result

> Once permission is granted, the dispatcher calls the tool's `call` method, streams progress, runs PostToolUse hooks, shapes the result for the API, and renders for the UI. This file walks the full lifecycle.

## End-to-end flow

```
              ┌──────────────────────────────┐
              │ Permission granted            │
              │ (input = updatedInput)        │
              └─────────────┬────────────────┘
                            │
                            ▼
              ┌──────────────────────────────┐
              │ M({type:"set_in_progress_    │
              │   tool_use_ids", ...})       │  ← UI sees spinner
              └─────────────┬────────────────┘
                            │
                            ▼
              ┌────────────────────────────────────────┐
              │ tool.call(input, {                     │
              │   ...ctx,                              │
              │   toolUseId,                           │
              │   userModified,                        │
              │   fileReadingLimits, globLimits        │
              │ }, canUseTool, parentMessage, onProg)  │
              └─────────────┬──────────────────────────┘
                            │ (may emit progress events via onProgress)
                            ▼
              ┌──────────────────────────────┐
              │ Returns { data, ... }         │
              └─────────────┬────────────────┘
                            │
                            ▼
              ┌──────────────────────────────┐
              │ PostToolUse hooks run         │
              │ (may rewrite via              │
              │  updatedToolOutput)           │
              └─────────────┬────────────────┘
                            │
                            ▼
              ┌──────────────────────────────────────┐
              │ tool.mapToolResultToToolResultBlock- │
              │   Param(data, toolUseID)             │
              └─────────────┬────────────────────────┘
                            │
                            ▼
              ┌──────────────────────────────┐
              │ tool.renderToolResultMessage  │
              │   (UI rendering)              │
              └─────────────┬────────────────┘
                            │
                            ▼
              ┌──────────────────────────────┐
              │ tool_use_id pushed to model  │
              │ as ToolResultBlockParam      │
              └──────────────────────────────┘
```

## The `call` method

### Signature

```typescript
call(
  input: z.infer<Input>,
  context: ToolUseContext,
  canUseTool: CanUseToolFn,
  parentMessage: AssistantMessage,
  onProgress?: ToolCallProgress<P>,
): Promise<ToolResult<Output>>

type ToolResult<T> = {
  data: T
  newMessages?: Message[]
  contextModifier?: (ctx) => ToolUseContext   // honored only when isConcurrencySafe=false
  mcpMeta?: { _meta?, structuredContent? }
}
```

### Invocation site

```javascript
// ============================================
// dispatchTool — Stage 4 invocation
// Location: cli_inner_pretty.js:388287
// ============================================

// ORIGINAL (for source lookup):
let KH = await H.call(P, { ...K, toolUseId: $, userModified: S.userModified ?? !1 }, _, A, M);

// READABLE (for understanding):
const callResult = await tool.call(
  finalInput,                                       // After hooks/permission rewrites
  { ...ctx, toolUseId, userModified: permissionDecision.userModified ?? false },
  canUseTool,                                       // For nested tool calls
  parentMessage,                                    // For provenance tracking
  onProgress,                                       // For streaming UI updates
);

// Mapping: H→tool, P→finalInput, K→ctx, $→toolUseId, S→permissionDecision, _→canUseTool, A→parentMessage, M→onProgress, KH→callResult
```

### Context properties

| Property | Purpose |
|----------|---------|
| `abortController.signal` | Tools watch this for user-cancel / timeout |
| `readFileState` | LRU cache (Read writes, Edit/Write read+write, dedup checks) |
| `getAppState() / setAppState(f)` | Read/update the global app state |
| `options.mcpClients` | Connected MCP clients |
| `options.tools` | Tools currently available (snapshot at turn start) |
| `options.refreshTools` | Optional callback to get latest tools (post-MCP-connect) |
| `options.thinkingConfig` | Extended thinking config (depth, budget) |
| `agentId` / `agentType` | Set for subagents only |
| `requestPrompt` | Interactive prompt callback (AskUserQuestion uses this) |
| `setToolJSX` | Transient JSX overlay (permission dialogs, plan-mode preview) |
| `fileReadingLimits` | `{maxTokens, maxSizeBytes}` — Read/Glob/Grep respect this |
| `globLimits` | `{maxResults}` — Glob respects this |
| `setStreamMode` | Toggle spinner style during long tools |
| `appendSystemMessage` | UI-only system message (stripped at API boundary) |

## Output streaming via `onProgress`

Long-running tools stream progress events through `onProgress`. The UI consumes them to update spinners, show partial output, and indicate per-stage status.

### Event shape

```typescript
type ProgressEvent<P> = {
  type: "progress",
  toolUseID: string,
  data: P,   // tool-specific progress type
}
```

Each tool defines its own progress data type. Examples:
- `BashProgress` — stdout/stderr chunks, exit status
- `MCPProgress` — `started` / `completed` / `failed` with elapsed time
- `WebSearchProgress` — `searching` / `fetching` / `parsing` per result
- `REPLToolProgress` — inner tool calls within the VM
- `SkillToolProgress` — skill-execution stages
- `AgentToolProgress` — subagent message turns

### Example: MCP tool progress

```javascript
// ============================================
// mcpToolFactory.call — progress hooks before/after the MCP request
// Location: cli_inner_pretty.js:414812-414855
// ============================================

// ORIGINAL (for source lookup):
if (L && P)
  L({ type: "progress", toolUseID: P, data: { type: "mcp_progress", status: "started", serverName: H.name, toolName: f.name } });
let W = Date.now();
// ... do the actual MCP call ...
if (L && P)
  L({ type: "progress", toolUseID: P, data: { type: "mcp_progress", status: "completed", serverName: H.name, toolName: f.name, elapsedTimeMs: Date.now() - W } });

// READABLE (for understanding):
if (onProgress && toolUseId) {
  onProgress({
    type: "progress",
    toolUseID: toolUseId,
    data: { type: "mcp_progress", status: "started", serverName: server.name, toolName: tool.name },
  });
}
const startTime = Date.now();
// ... do the actual MCP call ...
if (onProgress && toolUseId) {
  onProgress({
    type: "progress",
    toolUseID: toolUseId,
    data: {
      type: "mcp_progress",
      status: "completed",
      serverName: server.name,
      toolName: tool.name,
      elapsedTimeMs: Date.now() - startTime,
    },
  });
}

// Mapping: L→onProgress, P→toolUseId, H→server, f→tool, W→startTime
```

**Why progress events vs. blocking spinners:** Some tool calls (subagent runs, MCP server requests, web searches) take minutes. A blank spinner for 90 seconds is indistinguishable from a frozen session. Progress events let the UI show "Subagent: 3 tool calls so far", "WebSearch: fetched 4/5 results", etc., turning blocked waits into legible activity.

**Key insight:** Progress events do not flow into the model's context — they exist purely for the UI. The model only sees the final `mapToolResultToToolResultBlockParam(data, ...)` output. This separation lets the host show rich runtime detail without paying the prompt-cache cost of injecting structured progress into the message history.

## AbortController integration

Every tool that does I/O is expected to observe `ctx.abortController.signal`. When the user cancels (Ctrl-C, /interrupt, or the spawned `interruptBehavior: 'cancel'` trigger), the abort signal fires and the tool should clean up and reject.

### Pattern: signal-aware long-running call

```javascript
// ============================================
// Pattern: signal-aware long-running call
// Used widely; example from ToolSearch async waits
// Location: cli_inner_pretty.js:383453-383459 (ToolSearch wait-for-MCP)
// ============================================

// ORIGINAL (for source lookup):
async function J(v) {
  let E = Date.now(), I = E + Pe_;
  while (Date.now() < I && !A.signal.aborted) {
    let h = M().filter((C) => C.type === "pending");
    if (h.length === 0) break;
    if (v.length > 0 && !h.some((C) => v.includes(C.name) || v.includes($_(C.name)))) break;
    await a8(50, A.signal);
  }
  return Date.now() - E;
}

// READABLE (for understanding):
async function waitForPendingMcpServers(serversToWaitFor) {
  const startTime = Date.now();
  const deadline = startTime + TOOL_SEARCH_MCP_WAIT_MS;
  while (Date.now() < deadline && !abortController.signal.aborted) {
    const pending = currentMcpClients().filter(c => c.type === "pending");
    if (pending.length === 0) break;
    if (serversToWaitFor.length > 0 && !pending.some(p => serversToWaitFor.includes(p.name) || serversToWaitFor.includes(prefixForServer(p.name)))) {
      break;                                          // No relevant servers still pending
    }
    await sleepWithAbort(50, abortController.signal); // Wakes early on abort
  }
  return Date.now() - startTime;
}

// Mapping: J→waitForPendingMcpServers, v→serversToWaitFor, E→startTime, I→deadline, Pe_→TOOL_SEARCH_MCP_WAIT_MS, A→abortController, M→currentMcpClients, h→pending, C→p, $_→prefixForServer, a8→sleepWithAbort
```

**Why dual-check `Date.now() < deadline && !signal.aborted`:** Two distinct termination causes — deadline expired (no signal) or user cancelled (signal fired). The `sleepWithAbort` primitive also resolves immediately on abort so the loop doesn't waste a full 50ms slice when the user has already cancelled.

## The result shape: `mapToolResultToToolResultBlockParam`

This is what the model sees. The dispatcher calls it after `call` returns (and after PostToolUse hooks have had a chance to rewrite `data` via `updatedToolOutput`).

### Signature

```typescript
mapToolResultToToolResultBlockParam(content: Output, toolUseID: string): ToolResultBlockParam

type ToolResultBlockParam = {
  type: "tool_result"
  tool_use_id: string
  content: string | Array<{type: "text", text: string} | {type: "image", source: ...}>
  is_error?: boolean
}
```

### Example: Read tool — multi-shape output

```javascript
// ============================================
// readTool.mapToolResultToToolResultBlockParam — dispatch by output type
// Location: cli_inner_pretty.js:407397+
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam(H, $) {
  switch (H.type) {
    case "image":
      // returns { tool_use_id, type, content: [{type:"image", source:{type:"base64", media_type, data}}] }
    case "pdf":
      // returns image blocks per page
    case "text":
      // returns string content with line-number formatting
    case "file_unchanged":
      // returns sentinel reminder content
    case "notebook":
      // returns serialised cells
    ...
  }
}

// READABLE (for understanding):
mapToolResultToToolResultBlockParam(outputData, toolUseID) {
  switch (outputData.type) {
    case "image":
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: [{ type: "image", source: { type: "base64", media_type: outputData.file.type, data: outputData.file.base64 } }],
      };
    case "pdf":
      // PDF pages rendered as image blocks (one per page)
      return { tool_use_id: toolUseID, type: "tool_result", content: outputData.file.pages.map(page => ({type:"image", source: {...}})) };
    case "text":
      // Line-numbered cat -n style output
      return { tool_use_id: toolUseID, type: "tool_result", content: formatTextWithLineNumbers(outputData.file.content, outputData.file.offset) };
    case "file_unchanged":
      // No re-read happened; remind the model
      return { tool_use_id: toolUseID, type: "tool_result", content: WASTED_READ_REMINDER };
    case "notebook":
      // Cells with outputs
      return { tool_use_id: toolUseID, type: "tool_result", content: formatNotebook(outputData.file) };
  }
}

// Mapping: H→outputData, $→toolUseID
```

**Why a discriminated union return:** Read returns dramatically different content based on file type — text, image bytes, multi-page PDF images, notebook cells. Encoding this in a single output type with a `type` discriminator lets the UI render method (`renderToolResultMessage`) and the API-shaping method (`mapToolResultToToolResultBlockParam`) dispatch over the same shape. The model sees an `image` block when reading an image; the UI shows an image preview. Both come from one `data.type === "image"` path.

**Key insight:** The Read tool's `maxResultSizeChars: Infinity` setting interacts with this multi-shape output: persisting an image as a file-with-preview would create a circular Read→file→Read loop (the preview would be another Read result). Infinite max-size short-circuits the persistence machinery and lets images flow directly through.

### Example: SendUserFile — model-facing acknowledgement

```javascript
// ============================================
// sendUserFileTool.mapToolResultToToolResultBlockParam — concise text ack
// Location: cli_inner_pretty.js:385852-385868
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam(H, $) {
  let q = H.attachments.length,
    K = H.attachments.filter((_) => _.file_uuid !== void 0).map((_) => `  ${_.path} → file_uuid: ${_.file_uuid}`);
  return {
    tool_use_id: $,
    type: "tool_result",
    content: `${q} ${S8(q, "file")} delivered to user.` + (K.length > 0 ? `\n${K.join("\n")}` : ""),
  };
},

// READABLE (for understanding):
mapToolResultToToolResultBlockParam(outputData, toolUseID) {
  const count = outputData.attachments.length;
  // Surface file_uuids the host assigned (so the model can reference them in future turns)
  const uuidLines = outputData.attachments
    .filter(a => a.file_uuid !== undefined)
    .map(a => `  ${a.path} → file_uuid: ${a.file_uuid}`);
  return {
    tool_use_id: toolUseID,
    type: "tool_result",
    content:
      `${count} ${pluralize(count, "file")} delivered to user.` +
      (uuidLines.length > 0 ? `\n${uuidLines.join("\n")}` : ""),
  };
},

// Mapping: H→outputData, $→toolUseID, q→count, K→uuidLines, S8→pluralize
```

**Why surface `file_uuid` to the model:** The user can reference delivered files in subsequent turns ("can you regenerate the report I just received?"); having the UUIDs in the tool_result lets the model resolve such references without re-uploading or re-tracking.

## Three render methods

### `renderToolUseMessage(input, opts)` — call-time UI

Rendered as soon as the tool_use block is decoded (often before parameters fully stream in). Receives `Partial<Input>` because some fields may still be incoming.

Example (Read):
```javascript
renderToolUseMessage: pe7,                          // pe7 returns "Reading <path>" with line range / pages annotation
```

The component shows "Reading /path/to/file.ts (lines 100-150)" while the call runs.

### `renderToolResultMessage(data, progress, opts)` — post-run UI

Rendered after the call succeeds. Receives the final `data` plus `progressMessagesForMessage` (the accumulated progress events) plus options.

Example (Edit): shows a syntax-highlighted diff of before/after.
Example (TodoWrite): renders nothing — todos appear in a separate panel.
Example (Read): renders nothing in transcript mode, brief summary otherwise.

Defaults to "render nothing" when omitted.

### `renderToolUseRejectedMessage(input, opts)` — denied call UI

Rendered when the user denies the call (via dialog) or hooks return `deny`. Falls back to a generic `<FallbackToolUseRejectedMessage />` if omitted.

Tools that need custom rejection UI:
- **Edit / Write**: shows the rejected diff so the user sees what they prevented.
- **Bash**: shows the rejected command and any sandbox-related context.

### `renderToolUseProgressMessage(progress, opts)` — streaming UI

Optional. Rendered while the call is in flight and progress events arrive. For Bash, it shows partial stdout/stderr. For WebSearch, it shows "Fetching result 3 of 5". For Subagent (Agent), it shows the cumulative turn count.

### `renderToolUseErrorMessage(content, opts)` — error UI

Optional. Customises the display when the call throws. Falls back to `<FallbackToolUseErrorMessage />`.

Tools that need custom error UI:
- **Read**: "File not found. Did you mean ...?" with suggestions.
- **Edit**: shows the failing match and surrounding context.

## newMessages and side-channel injection

`call` can return `newMessages: Message[]` in addition to `data`. These are inserted into the message stream alongside the tool_result. Use cases:
- **TodoWrite**: emits an `<system-reminder>` summarising the new todo list (so the model is reminded without overhead in the tool_result itself).
- **EnterPlanMode** / **ExitPlanMode**: emits state-change messages.
- **EnterWorktree** / **ExitWorktree**: emits worktree-context updates.

`newMessages` is the channel for "side effects of the call that the model should know about" — distinct from `data` (the call's return) and `mcpMeta` (passthrough metadata for SDK consumers).

## contextModifier — non-concurrent tools only

Tools with `isConcurrencySafe: () => false` can return a `contextModifier: (ctx) => ToolUseContext`. The dispatcher applies it to the live context for subsequent tool calls in the same turn.

Example use cases:
- **EnterPlanMode**: shifts `mode` to `'plan'` and stashes the previous mode in `prePlanMode`.
- **EnterWorktree**: updates `additionalWorkingDirectories` to include the worktree path.

**Why concurrent-safe tools can't use this:** If two tools run in parallel and both return `contextModifier`, the order of application is undefined. Restricting to non-concurrent tools makes the order deterministic (sequential).

## maxResultSizeChars — automatic persistence

If `tool.maxResultSizeChars` is finite and the tool's serialised result exceeds it, the dispatcher persists the result to a file and replaces the model-visible content with a preview + file path.

Examples:
- **Read**: `Infinity` — never persist (would cause Read→file→Read loop).
- **Bash**: `1e5` (100K chars) — large command output gets persisted.
- **WebSearch**: `1e5` — large search bodies get persisted.
- **mcp** (base): `1e5` — but can be overridden via `_meta["anthropic/maxResultSizeChars"]`.

**Why per-tool budgets:** Different tools produce wildly different output sizes. Bash logs from a long build can run to megabytes; a Read of a 1MB file is bounded by line/byte limits in `validateInput`. Setting per-tool budgets lets the persistence cutoff match the natural distribution of each tool's output.

## Post-call telemetry & special cases

The dispatcher captures detailed telemetry per call (around `cli_inner_pretty.js:388338`):

```javascript
d("tengu_tool_use_success", {
  messageID, toolName: r7(H.name), isMcp: H.isMcp ?? !1,
  durationMs, rssDeltaBytes, heapUsedDeltaBytes, externalDeltaBytes,
  preToolHookDurationMs, permissionDurationMs,
  toolResultSizeBytes, toolInputSizeBytes,
  fileExtension, filePathLen, bashCommandLen,
  readHasLimit, readHasOffset,
  queryChainId, queryDepth,
  mcpServerType, mcpServerBaseUrl, requestId,
});
```

The post-call branch also performs **per-tool side effects**:
- `H.name === Bq` (Read): updates `readFileState` with offset/limit signature for dedup.
- `H.name === G7` (Edit) / `o4` (Write): writes the new file content into `readFileState`.
- `H.name === Sq` (Bash): if the command was `git commit`, extracts the commit SHA for `tool.git_commit_id`.

**Key insight:** These special cases are a code-smell symptom — the dispatcher knows too much about specific tools. But because they involve cross-tool coordination (Edit invalidates Read's cache; Bash-git-commit feeds the attribution system), they can't easily be encapsulated inside each tool. The constant-keyed name comparisons (`H.name === Bq`) at least keep the special-cases identifiable and grep-able.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - v2.1.142 additions: [symbol_additions_v2_1_142_tools_arch.md](../00_overview/symbol_additions_v2_1_142_tools_arch.md)

Key functions in this document:
- `sleepWithAbort` (obfuscated: `a8`) - Cancellable sleep primitive
- `TOOL_SEARCH_MCP_WAIT_MS` (obfuscated: `Pe_`) - Max wait time (5000ms) for pending MCP servers
- `pluralize` (obfuscated: `S8`) - "1 file" / "2 files" helper
- `anonymiseToolName` (obfuscated: `r7`) - Strip MCP prefix for telemetry aggregation
