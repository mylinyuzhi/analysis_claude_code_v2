# Tool Runtime Mechanism — Streaming Dispatcher & Concurrency

> The dispatcher is a streaming state machine. As the model's `tool_use` blocks arrive (one block per JSON delta), the executor decides whether to launch the call immediately, wait for an exclusive slot, or queue behind a non-concurrent predecessor. This file walks through the runtime mechanism step by step, comparing the obfuscated v2.1.142 implementation against the v2.1.88 deobfuscated reference at `/lyz/codespace/3rd/claude-code/src/services/tools/StreamingToolExecutor.ts`.

> Other docs cover *what* each tool does (`tool_inventory.md`, per-tool files), *what* its contract looks like (`registration.md`, `schema_validation.md`), and *how the pre-/post-call pipeline shapes data* (`lifecycle.md`, `permission_pipeline.md`). This file fills the gap on the *runtime engine* that orchestrates the lot.

## Why streaming rather than blocking dispatch

Earlier versions of Claude Code waited for the model's complete assistant message before kicking off tool calls. Then v2.0.x switched to streaming so:

1. **Time-to-first-tool drops from O(message_length) to O(first_tool_block_complete).** For a multi-tool turn the first call can start executing while the model is still emitting the third block.
2. **Concurrent tools run in parallel.** Multiple Reads, Globs, or WebSearches share wall-clock time.
3. **Bash errors abort siblings early.** A failed `mkdir` doesn't waste cycles on the dependent `cd && build` that follows.

The cost is a more complex executor. The implementation centralises that complexity in a single class — `StreamingToolExecutor` (`NL$` in the bundle).

## State model

Each tool block goes through this lifecycle:

```
queued ──► executing ──► completed ──► yielded
   │           │             │
   │           └─────────────┴───► (results array filled)
   └────► (waits for predecessor to drain if not concurrency-safe)
```

```javascript
// ============================================
// TrackedTool — per-tool state record
// Location: cli_inner_pretty.js:388590-388604 (class fields)
// Cross-validated: src/services/tools/StreamingToolExecutor.ts:14-32
// ============================================

// ORIGINAL (obfuscated fields stored on entries of the `tools` array):
// id, block, assistantMessage, status, isConcurrencySafe, promise?, results?, contextModifiers?, pendingProgress, pendingBridgeEvents

// READABLE (matched against 2.1.88 TS source):
type TrackedTool = {
  id: string;                                            // tool_use_id
  block: ToolUseBlock;                                   // raw model output
  assistantMessage: AssistantMessage;                    // back-reference for UUID provenance
  status: "queued" | "executing" | "completed" | "yielded";
  isConcurrencySafe: boolean;                            // computed once after schema parse
  promise?: Promise<void>;                               // resolves when collectResults finishes
  results?: Message[];                                   // accumulated messages once status == "completed"
  contextModifiers?: Array<(ctx: ToolUseContext) => ToolUseContext>;
  pendingProgress: ProgressMessage[];                    // streamed to UI immediately
  pendingBridgeEvents: BridgeEvent[];                    // remote-control bridge events
};
```

**Why `pendingProgress` is a sibling of `results`:** Progress messages must reach the UI immediately (the human is watching), but they must *not* enter the results buffer (the model only sees the final result). Storing them separately keeps the two streams cleanly partitioned. Same trick for `pendingBridgeEvents`, which goes to the remote-control bridge.

## The executor class

The class lives at `cli_inner_pretty.js:388590-388860+` (obfuscated `NL$`). The cross-validated 2.1.88 TS source is at `src/services/tools/StreamingToolExecutor.ts`. The names map directly.

```javascript
// ============================================
// StreamingToolExecutor — outer shape
// Location: cli_inner_pretty.js:388590+
// Cross-validated: StreamingToolExecutor.ts:40-62
// ============================================

class StreamingToolExecutor {
  // toolDefinitions — array of all currently-registered Tool objects
  // canUseTool       — top-level CanUseToolFn; nested tool calls funnel through it
  // toolUseContext   — shared ToolUseContext (mutated by contextModifiers)
  // tools            — TrackedTool[] (mutated as blocks stream in)
  // hasErrored       — true once a non-concurrent Bash error has aborted siblings
  // erroredToolDescription — string for the synthetic "Cancelled: parallel tool call X errored"
  // siblingAbortController — child of ctx.abortController; cancels sibling subprocesses on Bash failure
  // discarded        — true if streaming fallback discarded this attempt
  // progressAvailableResolve — wakes getRemainingResults() when new progress arrives
}
```

### Adding a tool

When the model's stream finishes a `tool_use` block, the runtime calls `addTool`:

```javascript
// ============================================
// StreamingToolExecutor.addTool (NL$.prototype.addTool)
// Location: cli_inner_pretty.js:388608-388658
// Cross-validated: StreamingToolExecutor.ts:76-124
// ============================================

addTool(block, assistantMessage) {
  // 1. Resolve the tool by name (cached lookup via findToolByName/i4).
  const tool = findToolByName(this.toolDefinitions, block.name, this.toolUseContext.options.toolAliases);
  if (!tool) {
    // Unknown tool: enqueue a synthetic error and mark "completed". The runtime
    // also runs nameResolutionHints (pE6) which returns "Did you mean …?" suggestions.
    const suggestion = nameResolutionHints(block.name, this.toolDefinitions, this.toolUseContext.agentId, this.toolUseContext.options.mainLoopModel);
    this.tools.push({
      id: block.id, block, assistantMessage,
      status: "completed",
      isConcurrencySafe: true,                                     // No call to run — trivially "safe"
      pendingProgress: [], pendingBridgeEvents: [],
      results: [makeUserMessage({
        content: [{type:"tool_result", content: `<tool_use_error>Error: No such tool available: ${block.name}${suggestion}</tool_use_error>`, is_error: true, tool_use_id: block.id}],
        toolUseResult: `Error: No such tool available: ${block.name}${suggestion}`,
        sourceToolAssistantUUID: assistantMessage.uuid,
      })],
    });
    return;
  }

  // 2. Decide concurrency safety using the (possibly partial) input.
  //    parse against the Zod schema; if parsing fails, fall back to "not safe".
  const parsed = tool.inputSchema.safeParse(block.input);
  const isConcurrencySafe = parsed?.success
    ? (() => { try { return Boolean(tool.isConcurrencySafe(parsed.data)); } catch { return false; } })()
    : false;

  // 3. Enqueue. processQueue() may start it immediately.
  this.tools.push({
    id: block.id, block, assistantMessage,
    status: "queued",
    isConcurrencySafe,
    pendingProgress: [], pendingBridgeEvents: [],
    results: [],
  });
  void this.processQueue();
}
```

**Why fall back to `not safe` when parsing fails:** A schema-invalid input means the tool *will* error on validation. Treating it as not-safe ensures the executor doesn't run it concurrently with another tool, which would risk lost progress messages or out-of-order results. The synthetic error is generated later in `runToolUse` (which dispatches to `eH5` at `cli_inner_pretty.js:387960`).

**Key insight:** Concurrency is computed *per input*, not per tool. Bash with `command:"echo hi"` is theoretically safe (read-only), but the bundle always treats Bash as not safe because it has side effects across shells. Read with a partial input that hasn't yet specified `file_path` defaults to not-safe — only once the input fully streams in does the safe path activate.

### The queue scheduler

```javascript
// ============================================
// StreamingToolExecutor.processQueue
// Location: cli_inner_pretty.js:388663-388669
// Cross-validated: StreamingToolExecutor.ts:140-151
// ============================================

async processQueue() {
  for (const tool of this.tools) {
    if (tool.status !== "queued") continue;
    if (this.canExecuteTool(tool.isConcurrencySafe)) {
      await this.executeTool(tool);                              // Fires-and-tracks (executeTool returns immediately after attaching the promise)
    } else if (!tool.isConcurrencySafe) {
      // Non-concurrent tool blocked → stop here.
      // Subsequent queued tools must wait too — order preservation.
      break;
    }
    // Concurrent tool that's blocked by a non-concurrent predecessor:
    // the `else if !isConcurrencySafe` branch above already broke; this case can't happen.
  }
}

canExecuteTool(isConcurrencySafe) {
  const executingTools = this.tools.filter(t => t.status === "executing");
  // 1. If nothing is running, anything can start.
  // 2. If at least one is running, only concurrent tools (and only if all running ones are also concurrent) can start.
  return executingTools.length === 0 || (isConcurrencySafe && executingTools.every(t => t.isConcurrencySafe));
}
```

**Why "stop on first blocked non-concurrent":** Tool order in the model's emitted batch is meaningful — if the model emitted `[Bash, Read, Read]` and Bash is non-concurrent, the user expects Reads to wait for Bash. Starting them eagerly would violate that ordering. The scheduler honours intent by breaking out of the queue scan as soon as a blocked non-concurrent tool is hit.

**Key insight:** Even concurrent tools queue behind a running non-concurrent one. The `canExecuteTool` predicate returns `false` whenever `executingTools.length > 0 && some-non-concurrent`. This means a single `Bash` blocks everything until it finishes — both other Bash calls *and* concurrent Reads. The intent: while Bash modifies state, no observer (Read) should see a moving target.

### Executing a tool

```javascript
// ============================================
// StreamingToolExecutor.executeTool
// Location: cli_inner_pretty.js:388734-388804
// Cross-validated: StreamingToolExecutor.ts:265-403
// ============================================

async executeTool(tool) {
  tool.status = "executing";
  this.updateInterruptibleState();                              // UI: enable Ctrl-C indicator if all running tools have interruptBehavior=cancel
  const messages = [];
  const contextModifiers = [];
  const collectResults = (async () => {
    // 1. Pre-check: were we already aborted (by a sibling error or user Ctrl-C)?
    const reasonNow = this.getAbortReason(tool);
    if (reasonNow) {
      messages.push(this.createSyntheticErrorMessage(tool.id, reasonNow, tool.assistantMessage));
      tool.results = messages; tool.contextModifiers = contextModifiers; tool.status = "completed";
      this.updateInterruptibleState();
      return;
    }

    // 2. Each tool has its own child abort controller. Sibling errors abort *this*,
    //    not the parent — siblingAbortController is itself a child of ctx.abortController.
    //    A child abort bubbles up to ctx.abortController so the outer query loop can end the turn.
    const toolAbortController = createChildAbortController(this.siblingAbortController);
    toolAbortController.signal.addEventListener("abort", () => {
      if (toolAbortController.signal.reason !== "sibling_error" &&
          !this.toolUseContext.abortController.signal.aborted &&
          !this.discarded) {
        this.toolUseContext.abortController.abort(toolAbortController.signal.reason);
      }
    }, {once: true});

    // 3. Actually run the tool — this is the generator that flows through schema → permissions → call → render
    const generator = runToolUse(tool.block, tool.assistantMessage, this.canUseTool,
                                  { ...this.toolUseContext, abortController: toolAbortController });

    let thisToolErrored = false;
    for await (const update of generator) {
      // 3a. Bridge events go to pendingBridgeEvents and wake the consumer
      if (isBridgeEvent(update)) {
        tool.pendingBridgeEvents.push(update);
        if (this.progressAvailableResolve) { this.progressAvailableResolve(); this.progressAvailableResolve = undefined; }
        continue;
      }

      // 3b. Was an abort triggered while we were generating?
      const reasonMid = this.getAbortReason(tool);
      if (reasonMid && !thisToolErrored) {
        messages.push(this.createSyntheticErrorMessage(tool.id, reasonMid, tool.assistantMessage));
        break;
      }

      // 3c. Tool-result with is_error=true → mark "this tool errored". If it's a sibling-abort-trigger tool
      //     (currently only Bash + PowerShell), abort all sibling subprocesses.
      const isErrorResult = update.message?.type === "user" && Array.isArray(update.message.message.content)
        && update.message.message.content.some(c => c.type === "tool_result" && c.is_error === true);
      if (isErrorResult) {
        thisToolErrored = true;
        if (SIBLING_ABORTING_TOOLS.includes(tool.block.name) && !tool.isConcurrencySafe) {
          this.hasErrored = true;
          this.erroredToolDescription = this.getToolDescription(tool);
          this.siblingAbortController.abort("sibling_error");
        }
      }

      // 3d. Sort updates: progress → pendingProgress (UI), other messages → results buffer
      if (update.message) {
        if (update.message.type === "progress") {
          tool.pendingProgress.push(update.message);
          if (this.progressAvailableResolve) { this.progressAvailableResolve(); this.progressAvailableResolve = undefined; }
        } else {
          messages.push(update.message);
        }
      }
      if (update.contextModifier) contextModifiers.push(update.contextModifier.modifyContext);
    }

    tool.results = messages;
    tool.contextModifiers = contextModifiers;
    tool.status = "completed";
    this.updateInterruptibleState();

    // 4. contextModifiers run only for non-concurrent tools.
    //    (concurrent ones have undefined application order — see note below.)
    if (!tool.isConcurrencySafe && contextModifiers.length > 0) {
      for (const modifier of contextModifiers) {
        this.toolUseContext = modifier(this.toolUseContext);
      }
    }
  })();

  tool.promise = collectResults;
  collectResults.finally(() => { void this.processQueue(); });    // Trigger scheduler again after this finishes
}
```

**Why a per-tool child abort controller:** The 2.1.88 TS source has a long-form comment explaining this exact design (`StreamingToolExecutor.ts:294-300`):

> "Per-tool child controller. Lets siblingAbortController kill running subprocesses (Bash spawns listen to this signal) when a Bash error cascades. Permission-dialog rejection also aborts this controller (PermissionContext.ts cancelAndAbort) — that abort must bubble up to the query controller so the query loop's post-tool abort check ends the turn. Without bubble-up, ExitPlanMode 'clear context + auto' sends REJECT_MESSAGE to the model instead of aborting (#21056 regression)."

**Key insight:** The abort controllers form a three-level tree:

```
ctx.abortController                  ← parent (query loop owns this)
   │
   └── siblingAbortController         ← fired by Bash errors
          │
          └── toolAbortController     ← per-tool child
```

When the user hits Ctrl-C, `ctx.abortController` aborts, which propagates *down* through child controllers (AbortController inheritance). When Bash errors, `siblingAbortController` aborts, killing its toolAbortController children. When permission is denied for an individual tool, `toolAbortController` aborts; the explicit `addEventListener` handler also aborts the parent so the outer loop knows to end the turn.

### Aborting and synthetic errors

```javascript
// ============================================
// StreamingToolExecutor.getAbortReason
// Location: cli_inner_pretty.js:388700-388708
// Cross-validated: StreamingToolExecutor.ts:210-231
// ============================================

getAbortReason(tool) {
  if (this.discarded) return "streaming_fallback";                            // Outer runtime gave up on this attempt
  if (this.hasErrored) return "sibling_error";                                // Sibling Bash already errored
  if (this.toolUseContext.abortController.signal.aborted) {
    // "interrupt" = user typed during a running tool.
    // Only cancel tools whose interruptBehavior is 'cancel'. 'block' tools must finish.
    if (this.toolUseContext.abortController.signal.reason === "interrupt") {
      return this.getToolInterruptBehavior(tool) === "cancel" ? "user_interrupted" : null;
    }
    return "user_interrupted";
  }
  return null;
}
```

**Why three distinct reasons:** Each maps to different UI text:
- `user_interrupted` → "User rejected tool use" (with the `REJECT_MESSAGE` constant + memory-correction hint)
- `streaming_fallback` → "Streaming fallback - tool execution discarded" (the runtime hit a recoverable wire error and re-issued the call)
- `sibling_error` → "Cancelled: parallel tool call `<X(args)>` errored" (with the offending tool's description so the model sees what blew up)

The model uses these to decide whether to retry, apologise, or proceed with alternatives.

### Yielding results to the consumer

The consumer (the outer query loop) drains via two generators:

```javascript
// ============================================
// StreamingToolExecutor.getCompletedResults / getRemainingResults
// Location: cli_inner_pretty.js:388805-388820, 388822-388860+
// Cross-validated: StreamingToolExecutor.ts (later in the file)
// ============================================

// getCompletedResults: yield everything that's currently ready, then return.
// Used during streaming when the consumer wants to pull whatever's available.
*getCompletedResults() {
  if (this.discarded) return;
  for (const tool of this.tools) {
    while (tool.pendingBridgeEvents.length > 0) yield tool.pendingBridgeEvents.shift();
    while (tool.pendingProgress.length > 0) yield { message: tool.pendingProgress.shift(), newContext: this.toolUseContext };
    if (tool.status === "yielded") continue;
    if (tool.status === "completed") {
      tool.status = "yielded";                                              // Mark consumed
      for (const m of tool.results) yield { message: m, newContext: this.toolUseContext };
      yield { type: "set_in_progress_tool_use_ids", op: { action: "remove", ids: [tool.id] } };
    } else if (tool.status === "executing" && !tool.isConcurrencySafe) {
      break;                                                                 // Order-preserving — stop at first non-yielded blocker
    }
    // else: tool.status === "executing" && concurrent — skip and continue (peers may finish next)
  }
}

// getRemainingResults: keep yielding until everything is done. Awaits promises when nothing's ready.
async *getRemainingResults() {
  if (this.discarded) return;
  while (this.hasUnfinishedTools()) {
    await this.processQueue();
    let yielded = false;
    for (const r of this.getCompletedResults()) { yielded = true; yield r; }
    if (this.hasExecutingTools() && !yielded && !this.hasPendingProgress()) {
      // Nothing yielded this iteration — wait for either (a) a tool to finish, or (b) progress to arrive
      const inFlight = this.tools.filter(t => t.status === "executing" && t.promise).map(t => t.promise);
      const progressWaiter = new Promise(r => { this.progressAvailableResolve = r; });
      await Promise.race([...inFlight, progressWaiter]);
    }
  }
}
```

**Why ordered yield even though execution is concurrent:** The model's mental model of `[Bash, Read, Read]` is sequential — it expects the tool_results to come back in order. Even though the two Reads finish *together* while Bash is running, their results are buffered until Bash's results have been yielded. The `set_in_progress_tool_use_ids` action signals the UI to clear the spinner for that tool id as soon as the consumer pulls its results.

**Key insight:** The `progressAvailableResolve` Promise is the executor's "wake me up" channel. Without it, `getRemainingResults` would have to poll (busy-wait) for progress events; with it, the consumer sleeps efficiently until either a tool promise settles or progress arrives. This is a textbook case of Promise.race used for fan-in waiting.

## Sibling-aborting tools — the QW list

```javascript
// Location: cli_inner_pretty.js:141674, 141680
// var QW = [Sq, EK];   // [BASH_TOOL_NAME, POWERSHELL_TOOL_NAME]
```

Only Bash and PowerShell trigger the sibling-abort cascade on error. Other tools (Read, WebFetch, Grep, MCP …) errors are *independent*: one failure shouldn't nuke the rest of the batch.

**Why Bash/PowerShell are special:** They often have implicit dependency chains. A failed `mkdir target/` makes the subsequent `cd target/ && build` pointless — and `build` may even hang waiting on a directory that doesn't exist. Bash-failure aborting saves the user real time and the model real tokens.

The check is at `cli_inner_pretty.js:388779`:

```javascript
if (((f = !0), QW.includes(H.block.name) && !H.isConcurrencySafe))
  ((this.hasErrored = !0),
   (this.erroredToolDescription = this.getToolDescription(H)),
   this.siblingAbortController.abort("sibling_error"));
```

The `!H.isConcurrencySafe` guard means a Bash error in a *concurrent* call won't abort siblings. In practice, Bash always returns `isConcurrencySafe=false`, so this guard is conservative.

## interruptBehavior — block vs. cancel

```javascript
// Location: cli_inner_pretty.js:388710-388718
// Cross-validated: StreamingToolExecutor.ts:233-241

getToolInterruptBehavior(tool) {
  const def = findToolByName(this.toolDefinitions, tool.block.name, this.toolUseContext.options.toolAliases);
  if (!def?.interruptBehavior) return "block";
  try { return def.interruptBehavior(); } catch { return "block"; }
}
```

Tools declare their default reaction to user-typed-during-execution:
- `"block"` — finish naturally; the typed message queues for the next turn. **Default.**
- `"cancel"` — interrupt immediately; the in-progress call gets a `user_interrupted` synthetic error.

Bash, PowerShell, WebFetch, WebSearch typically return `"cancel"` — long-running, side-effecting, OK to lose. Read, Grep, Glob, TodoWrite return `"block"` — fast, idempotent, no point cancelling.

The UI uses `updateInterruptibleState` to display the right indicator: if *all* currently-running tools are `cancel`, show the "interruptible" cue; if any is `block`, suppress it.

## set_in_progress_tool_use_ids — UI integration

```javascript
// Location: cli_inner_pretty.js:388283, 388815
// Examples:
M({ type: "set_in_progress_tool_use_ids", op: { action: "add", ids: [$] } });    // Just before tool.call
yield { type: "set_in_progress_tool_use_ids", op: { action: "remove", ids: [tool.id] } };  // After results yielded
```

The UI listens for these events to:
1. Show a spinner next to the in-flight tool's chrome (the `BLACK_CIRCLE` rendering vs. the animated loader)
2. Show the queued state (`isQueued = !inProgress && !isResolved`)
3. Stop the spinner once the result is consumed

See `ui_rendering.md` for the full UI side.

## Post-call dispatcher special cases

After `tool.call` resolves, the dispatcher applies a small number of cross-tool effects (around `cli_inner_pretty.js:388297-388338`):

```javascript
// File-state cache invalidation
if (H.name === Bq) {                                       // Read tool
  // updates readFileState with the (filePath, offset, limit, content, timestamp) signature for dedup
}
if ((H.name === G7 || H.name === o4) && "file_path" in L) {   // Edit / Write
  // similarly updates readFileState so a subsequent Read knows the file's expected mtime/content
}
if (H.name === Sq && "command" in L) {                     // Bash
  // git-commit hash extraction for tool.git_commit_id telemetry
  if (L.command.match(/\bgit\s+commit\b/) && KH.data?.stdout) {
    const sha = extractCommitSha(KH.data.stdout);
    if (sha) g.git_commit_id = sha;
  }
}
```

**Why these special cases live in the dispatcher rather than inside each tool:** They involve cross-tool coordination — Edit must invalidate Read's cache, Bash must feed a separate attribution system. Encapsulating them inside Read/Edit/Bash would couple those tools to each other and to the telemetry system. The dispatcher has the only view that covers all participants.

**Key insight:** The constant-keyed comparisons (`H.name === Bq`) at least keep the special cases identifiable and grep-able. A future refactor could move the file-state logic into a "post-tool side-effects" registry keyed by tool name; the constant-keyed pattern makes that mechanical.

## Per-tool telemetry sampling

Every successful tool call emits `tengu_tool_use_success` (`cli_inner_pretty.js:388340-388365`):

```
{
  messageID, toolName, isMcp,
  durationMs, rssDeltaBytes, heapUsedDeltaBytes, externalDeltaBytes,
  preToolHookDurationMs, permissionDurationMs,
  toolResultSizeBytes, toolInputSizeBytes,
  fileExtension, filePathLen, bashCommandLen,
  readHasLimit, readHasOffset,
  queryChainId, queryDepth,
  mcpServerType, mcpServerBaseUrl, requestId,
}
```

The `fileExtension`/`filePathLen`/`bashCommandLen` fields are only populated for the matching tool family — Read/Edit/Write/NotebookEdit (filePath), Bash/PowerShell (command). The conditional `XY()` guard is the "include rich telemetry" flag, controlled by a Statsig gate.

**Why duration is split (`preToolHookDurationMs`, `permissionDurationMs`, plus implicit `durationMs - preToolHook - permission` = call time):** Performance regressions surface clearly. If hooks slow down, the hook field grows; if a permission classifier slows down, the permission field grows; if the tool itself slows down, the rest grows. Without the breakdown, "Bash is slow" could mean half a dozen different things.

## Worktree-context modifier interaction

A non-concurrent tool can return `contextModifier` to mutate `toolUseContext` *for subsequent tools in the same batch*:

```javascript
// Location: cli_inner_pretty.js:388796-388798
if (!H.isConcurrencySafe && q.length > 0)
  for (let O of q) this.toolUseContext = O(this.toolUseContext);
```

Tools that use this:
- **EnterPlanMode** (`Q3H`) — shifts `mode` to `'plan'` and stashes `prePlanMode`
- **ExitPlanMode** — restores `prePlanMode` if set
- **EnterWorktree** — extends `additionalWorkingDirectories`
- **ExitWorktree** — contracts it

**Why concurrent tools cannot use this:** If two parallel tools both returned context modifiers, the order of application would be undefined and the resulting context would depend on which finishes first. Restricting to non-concurrent ensures `tools[i+1]` sees `tools[i]`'s modifications deterministically.

## Discard / streaming-fallback

The bundle includes a `discard()` method (`cli_inner_pretty.js:388605-388607`) for the streaming-fallback path:

```javascript
discard() { this.discarded = true; }
```

If the model's stream errored mid-batch and the runtime needs to retry (e.g., 429 backoff, transport error), the partially-attempted tool calls are abandoned. Calling `discard()` causes:
- `getAbortReason` to return `"streaming_fallback"` for any subsequent check
- New abort events to *not* bubble up to `ctx.abortController` (the runtime is going to retry, not end the turn)

In-flight tools eventually finish (Promise-completion can't be cancelled), but their results never yield — the `if (this.discarded) return;` guards on `getCompletedResults` and `getRemainingResults` keep them invisible.

**Why "abandon" rather than "abort":** Bash spawns or MCP requests may have already kicked off real work. Aborting their controllers would terminate the work mid-flight (possibly leaving partial files written, partial network requests sent). Letting them complete and then discarding the results is safer — at worst the user pays a few CPU seconds; at best the side effects already occurred and ignoring them is fine.

## A worked end-to-end example

Suppose the model emits, in this order:
1. Bash(`make build`)             — concurrency-unsafe
2. Read(`src/foo.ts`)             — concurrency-safe
3. Read(`src/bar.ts`)             — concurrency-safe

Timeline:

```
t=0:    addTool(Bash) → queued
        processQueue → canExecuteTool(non-safe, executing=0)=true → executeTool → status=executing
        UI: spinner on Bash
t=10:   addTool(Read#1) → queued
        processQueue → canExecuteTool(safe, executing=[Bash non-safe])=false (executing.every safe = false)
                      → because Read is safe, the queue scan does NOT break — but the loop iterates next
        (No more queued items → exits scan)
        UI: queued circle on Read#1
t=15:   addTool(Read#2) → queued
        processQueue → same — Read#2 stays queued
        UI: queued circle on Read#2
t=180:  Bash promise resolves → status=completed
        getRemainingResults: yields Bash result + set_in_progress remove
        Loop calls processQueue → canExecuteTool(safe, executing=[])=true → executeTool(Read#1)
                                  → executeTool(Read#1) status=executing
                                  → canExecuteTool(safe, executing=[Read#1 safe])=true → executeTool(Read#2)
        Both Reads now executing in parallel
t=200:  Read#1 resolves, Read#2 resolves shortly after → both completed
        Yield Read#1 results + clear in_progress(#1)
        Yield Read#2 results + clear in_progress(#2)
```

This is the expected behavior: the model sees `[Bash result, Read#1 result, Read#2 result]` in order, but Reads ran in parallel.

If Bash had errored at t=180 instead:

```
t=180:  Bash result is is_error=true
        SIBLING_ABORTING_TOOLS.includes(Bash) → hasErrored=true, siblingAbortController.abort("sibling_error")
        getAbortReason(Read#1)=sibling_error → executeTool's check at "reasonMid" injects synthetic error and breaks
        Same for Read#2
        Yield Bash error result + clear in_progress
        Yield Read#1 synthetic "Cancelled: parallel tool call Bash(make build) errored" + clear in_progress
        Yield Read#2 synthetic "Cancelled: parallel tool call Bash(make build) errored" + clear in_progress
```

The model sees three results: one real error, two synthetic. It typically retries with a smaller/safer batch.

## Cross-validation summary

The obfuscated `NL$` class at `cli_inner_pretty.js:388590+` is structurally identical to the v2.1.88 TypeScript `StreamingToolExecutor` in `src/services/tools/StreamingToolExecutor.ts`:

| Method | Obfuscated location | TS source |
|--------|----|---|
| constructor | `388600-388604` | `53-62` |
| `discard` | `388605-388607` | `69-71` |
| `addTool` | `388608-388658` | `76-124` |
| `canExecuteTool` | `388659-388662` | `129-135` |
| `processQueue` | `388663-388669` | `140-151` |
| `createSyntheticErrorMessage` | `388670-388699` | `153-205` |
| `getAbortReason` | `388700-388708` | `210-231` |
| `getToolInterruptBehavior` | `388710-388718` | `233-241` |
| `getToolDescription` | `388719-388727` | `243-252` |
| `updateInterruptibleState` | `388728-388733` | `254-260` |
| `executeTool` | `388734-388804` | `265-403` |
| `getCompletedResults` | `388805-388820` | (later in TS file) |
| `getRemainingResults` | `388822-388860+` | (later in TS file) |

No semantic differences in the streaming executor between 2.1.88 and 2.1.142 — the same state machine, the same abort tree, the same QW list (Bash + PowerShell). The bundle's minification rewrote control-flow into ternary-laden one-liners, but the structure is preserved.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - v2.1.142 additions: [symbol_additions_v2_1_142_tools_arch.md](../00_overview/symbol_additions_v2_1_142_tools_arch.md)

Key entries in this document:
- `StreamingToolExecutor` (obfuscated: `NL$`) - Streaming executor class
- `runToolUse` (obfuscated: `QM$`, dispatched via `eH5`) - Inner per-tool generator
- `dispatchToolCall` (obfuscated: `eH5`) - Pre-call schema/permission/hook pipeline
- `SIBLING_ABORTING_TOOLS` (obfuscated: `QW`) - `[BASH_TOOL_NAME, POWERSHELL_TOOL_NAME]`
- `nameResolutionHints` (obfuscated: `pE6`) - "Did you mean …?" suggestions for unknown tool names
- `isBridgeEvent` (obfuscated: `xm`) - Remote-control bridge event predicate
- `mE6` - Slow-pipeline threshold (`2000` ms) used by both pre- and post-tool hook timing logs
