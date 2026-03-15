# Execution Flow Deep Dive - Subagent System (Claude Code 2.1.76)

## Overview

This document provides an in-depth analysis of the subagent execution flow, covering the `agentLoopRunner` (dR) generator, task state machine, abort signal propagation, and identity propagation via AsyncLocalStorage.

**v2.1.76 additions:**
- `isolation: worktree` declarative support for git worktree-based subagent isolation
- Subagent completion notifications now include the result file path

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `agentLoopRunner` (dR) - Core async generator for agent execution - chunks.130.mjs:1961
- `runWithAgentIdentity` (p01) - AsyncLocalStorage context binding - chunks.80.mjs:2353
- `reportToolProgress` (RjA) - Update progress preserving summary - chunks.89.mjs:1393
- `updateTaskProgress` (Yd7) - Update summary text - chunks.89.mjs:1407
- `atomicUpdateTask` (c5) - Generic task state updater - chunks.142.mjs:1662

---

## agentLoopRunner (dR) - 11-Phase Execution

### What it does

`agentLoopRunner` (dR) is the core async generator that drives the subagent's execution loop. It coordinates tool assembly, identity binding, LLM queries, tool dispatching, and progress reporting in a sequential pipeline.

### How it works

The function executes in 11 distinct phases:

**Phase 1: Tool Assembly**
Builds the complete tool set for this subagent by calling `assembleSessionToolSet` (YP6). The tool set includes both built-in tools and any tools specified in the agent definition's `tools` list.

**Phase 2: Identity Binding**
Wraps the entire execution in `runWithAgentIdentity` (p01) via `AsyncLocalStorage`. This allows any code in the call stack to call `getCurrentAgentIdentity()` without needing explicit parameter passing.

**Phase 3: System Prompt Construction**
Calls the agent definition's `getSystemPrompt()` method to build the system prompt. For subagents, this includes any `criticalSystemReminder_EXPERIMENTAL` content from the agent definition.

**Phase 4: Context Building**
Merges parent context with subagent-specific context via `deriveToolUseContext` (vQ1). Some fields are cloned (readFileState), others are shared (appState getter).

**Phase 5: Hook Firing - SubagentStart**
Fires the `SubagentStart` hook event, giving hook handlers an opportunity to run setup logic before the first LLM call.

**Phase 6: LLM Query Loop**
Enters the inner LLM loop, making API calls and streaming responses via the generator pattern. Each response chunk is yielded back to the caller for real-time UI updates.

**Phase 7: Tool Dispatch**
When the LLM produces a `tool_use` content block, routes the tool call to the appropriate tool handler. Permission checks are applied before execution.

**Phase 8: Progress Reporting**
Updates task progress via `reportToolProgress` (RjA) after each tool result. This updates the parent's view of what the subagent is doing.

**Phase 9: Token Tracking**
After each LLM call, updates token usage counters for billing and budget enforcement.

**Phase 10: Compaction Check**
After processing tool results, checks whether the context window is approaching the compaction threshold. If so, triggers auto-compaction.

**Phase 11: Cleanup**
In the `finally` block, fires `SubagentStop` hooks, deregisters any skill hooks, and cleans up abort signal listeners.

```javascript
// ============================================
// agentLoopRunner - Core execution generator (simplified structure)
// Location: chunks.130.mjs:1961
// ============================================

// ORIGINAL (for source lookup):
async function* dR({ agentDefinition: A, promptMessages: q, toolUseContext: K, ... }) {
    let Y = await YP6(K, A);  // Phase 1: tool assembly
    yield* p01(A.identity, async function*() {  // Phase 2: identity binding
        let z = await A.getSystemPrompt(K);     // Phase 3: system prompt
        let w = vQ1(K, A);                      // Phase 4: context derivation
        await fJ1(K, "SubagentStart", ...);     // Phase 5: hook firing
        try {
            for await (let H of llmLoop({...})) {
                yield H;                         // Phase 6-10: LLM loop
            }
        } finally {
            await fJ1(K, "SubagentStop", ...);  // Phase 11: cleanup
        }
    });
}

// READABLE (for understanding):
async function* agentLoopRunner({ agentDefinition, promptMessages, toolUseContext, ... }) {
    let toolSet = await assembleSessionToolSet(toolUseContext, agentDefinition);
    yield* runWithAgentIdentity(agentDefinition.identity, async function*() {
        let systemPrompt = await agentDefinition.getSystemPrompt(toolUseContext);
        let derivedContext = deriveToolUseContext(toolUseContext, agentDefinition);
        await fireHooks(toolUseContext, "SubagentStart", ...);
        try {
            for await (let event of llmLoop({ systemPrompt, toolSet, derivedContext, ... })) {
                yield event;
            }
        } finally {
            await fireHooks(toolUseContext, "SubagentStop", ...);
        }
    });
}

// Mapping: dR→agentLoopRunner, YP6→assembleSessionToolSet, p01→runWithAgentIdentity,
// vQ1→deriveToolUseContext, fJ1→fireHooks
```

---

## Worktree Isolation (v2.1.76)

### What it does

In v2.1.76, agent definitions support a new `isolation: "worktree"` field that requests git worktree-based filesystem isolation for the subagent.

### How it works

1. When `agentLoopRunner` sees `agentDefinition.isolation === "worktree"`, it allocates a new git worktree before starting the execution loop
2. The subagent's working directory is set to the worktree path
3. All file operations (Read, Write, Edit, Bash) in the subagent scope against the worktree, not the main working tree
4. On completion or error, the worktree is cleaned up in the `finally` block

**Why this approach:**
- **True filesystem isolation** prevents parallel agents from conflicting on file writes
- **Declarative specification** - the agent definition states its needs; the runner satisfies them
- **Automatic cleanup** - worktrees are ephemeral and do not require manual teardown

**Key insight:** Without worktree isolation, two parallel subagents editing the same file produce merge conflicts or data corruption. With `isolation: worktree`, each subagent writes to its own branch/worktree copy, and results can be merged after completion.

```javascript
// ============================================
// Worktree isolation setup (v2.1.76 addition)
// Location: chunks.130.mjs (added in 2.1.76)
// ============================================

// READABLE (for understanding):
async function* agentLoopRunner({ agentDefinition, ... }) {
    let worktreePath = null;

    if (agentDefinition.isolation === "worktree") {
        // Allocate a new git worktree for this subagent
        worktreePath = await allocateWorktree(agentDefinition.agentId);
    }

    try {
        // ... main execution loop using worktreePath as cwd if set ...
    } finally {
        if (worktreePath) {
            await cleanupWorktree(worktreePath);
        }
    }
}

// Mapping: isolation→agentDefinition.isolation, allocateWorktree→worktree allocator,
// cleanupWorktree→worktree cleanup
```

---

## Task State Machine

### States and Transitions

```
Created (foreground or background)
       │
       ├── [User requests backgrounding]
       │         ↓
       │    Backgrounded (mid-run)
       │         ↓
       ├── [Task finishes]
       ↓
   Completed / Failed / Killed
```

### createForegroundTask (wd7)

**What it does:** Creates a foreground task that can be backgrounded mid-run via `Promise.race`.

**How it works:**
1. Allocates a task ID and creates an entry in the global task map
2. Starts the agent loop in a Promise
3. Wraps it in `Promise.race` with a backgrounding signal
4. If backgrounding signal fires first, transitions to `createAsyncTask` path
5. Otherwise, waits for the agent loop to complete

```javascript
// ============================================
// createForegroundTask - Foreground task with backgrounding support
// Location: chunks.89.mjs:1477
// ============================================

// READABLE (for understanding):
async function createForegroundTask(agentDef, toolUseContext, ...) {
    let taskId = generateTaskId();

    let agentLoopPromise = (async () => {
        for await (let event of agentLoopRunner({ agentDefinition: agentDef, ... })) {
            reportProgress(event);
        }
    })();

    // Promise.race enables mid-run backgrounding
    let result = await Promise.race([
        agentLoopPromise,
        backgroundingSignal(taskId)
    ]);

    if (result?.type === "background") {
        // Transition to background task
        return createAsyncTask(taskId, agentLoopPromise, ...);
    }

    return { status: "completed", ... };
}

// Mapping: wd7→createForegroundTask, zd7→createAsyncTask
```

---

## Abort Signal Propagation

### Hierarchy

Abort signals flow from outermost to innermost scope:

```
Session AbortController
    │
    └── Task AbortController
            │
            └── LLM Request AbortController
                        │
                        └── Tool Execution AbortController
```

**Key behaviors:**
- Parent abort propagates down: aborting the task aborts any in-flight LLM request
- Child completion does NOT propagate up: a tool finishing does not affect the task signal
- Each level creates a `derived` signal chained to its parent

**Why this design:**
- **Clean teardown** - killing a task stops everything in one operation
- **Isolation** - individual tool timeouts don't kill the whole task
- **Composable** - signals can be combined with `AbortSignal.any()`

---

## Identity Propagation via AsyncLocalStorage

### runWithAgentIdentity (p01)

**What it does:** Establishes an `AsyncLocalStorage` context that makes the subagent's identity available to any code in the call stack without explicit parameter passing.

**How it works:**
1. Creates an identity object with `agentId`, `parentAgentId`, `sessionId`
2. Calls `AsyncLocalStorage.run(identity, fn)` which makes `identity` available via `store.getStore()`
3. Any code called from within `fn` (including tools, hooks, compaction) can retrieve the current agent identity via `getCurrentAgentIdentity()` (db1)

**Why this approach:**
- **Zero coupling** - tools don't need an `agentId` parameter
- **Async-safe** - the `AsyncLocalStorage` propagates through `await` chains automatically
- **Transparent** - callers don't need to know about identity; it's always available

**Key insight:** This pattern is similar to React's Context API but for Node.js async functions. It enables telemetry, logging, and coordination to be agent-aware without polluting every function signature.

```javascript
// ============================================
// runWithAgentIdentity - AsyncLocalStorage identity binding
// Location: chunks.80.mjs:2353
// ============================================

// ORIGINAL (for source lookup):
async function* p01(A, q) {
    yield* ix7.run(A, q)
}

// READABLE (for understanding):
async function* runWithAgentIdentity(agentIdentity, generatorFn) {
    // ix7 is the AsyncLocalStorage instance for agent identity
    yield* agentIdentityStorage.run(agentIdentity, generatorFn);
}

// Mapping: p01→runWithAgentIdentity, ix7→agentIdentityStorage, A→agentIdentity, q→generatorFn
```

---

## Dual Progress Reporting

### Why Two Progress Functions?

The subagent system has two distinct progress update mechanisms that serve different purposes:

**`reportToolProgress` (RjA):** Updates the progress message shown to the user while PRESERVING the summary. Used during tool execution to show "running git status..." without overwriting the existing summary of what the agent has accomplished.

**`updateTaskProgress` (Yd7):** REPLACES the summary text entirely. Used when the agent has finished a major phase and wants to set a new summary like "Analyzed 23 files, found 3 issues".

```javascript
// ============================================
// reportToolProgress - Update progress preserving existing summary
// Location: chunks.89.mjs:1393
// ============================================

// READABLE (for understanding):
function reportToolProgress(taskId, progressMessage) {
    atomicUpdateTask(taskId, (task) => ({
        ...task,
        progressMessage: progressMessage
        // summary is NOT overwritten
    }));
}

// ============================================
// updateTaskProgress - Replace summary text
// Location: chunks.89.mjs:1407
// ============================================

// READABLE (for understanding):
function updateTaskProgress(taskId, summaryText) {
    atomicUpdateTask(taskId, (task) => ({
        ...task,
        summary: summaryText,  // Replaces previous summary
        progressMessage: undefined  // Clear in-progress indicator
    }));
}

// Mapping: RjA→reportToolProgress, Yd7→updateTaskProgress, c5→atomicUpdateTask
```

**Why this design:** Users need to see both what the agent is currently doing (tool-level progress) and what it has accomplished (phase-level summary). Conflating these would cause the summary to flicker on every tool invocation.

---

## Completion Notification with Result File Path (v2.1.76)

In v2.1.76, when a background subagent completes, the completion notification now includes the path to the output file containing the agent's result. This allows the parent agent or user to directly access the result without needing to infer the file path from the agent ID.

**Before v2.1.76:**
```javascript
// Completion notification
{ type: "agent_completed", agentId: "agent-123" }
```

**In v2.1.76:**
```javascript
// Completion notification now includes outputFilePath
{ type: "agent_completed", agentId: "agent-123", outputFilePath: "/tmp/claude/agents/agent-123/output.jsonl" }
```

This change reduces the need for callers to construct file paths manually and makes the completion event self-contained.

---

## Design Rationale

### Why Generator-Based Streaming?

**Alternatives considered:**
1. **Callback-based** - Pass a callback for each event → Rejected because it makes composition harder
2. **Promise-based** - Return a Promise that resolves when done → Rejected because it loses streaming
3. **EventEmitter** - Emit events → Rejected because it doesn't integrate with async/await

**The chosen approach** (async generator) provides:
- **Composable** - Callers can `yield*` into the generator, passing events up the call stack
- **Backpressure** - Natural backpressure via generator protocol
- **Cancellable** - `return()` on the generator propagates cancellation
- **Memory efficient** - Messages are processed one at a time, not accumulated

### Why AsyncLocalStorage for Identity?

**Alternatives considered:**
1. **Thread-local** - Not available in Node.js single-threaded model
2. **Parameter passing** - Every function needs `agentId` parameter → Massive coupling
3. **Global variable** - Not safe when multiple agents run concurrently

**The chosen approach** (`AsyncLocalStorage`) is the correct Node.js idiom for this pattern - it's designed exactly for this use case of propagating context across async call chains.
