# Architecture Summary - Subagent System (Claude Code 2.1.76)

## Overview

The subagent system provides a complete infrastructure for parallel task execution, agent coordination, and context isolation. This document provides architecture diagrams, design patterns, and a description of the critical code paths.

**v2.1.76 changes:**
- Worktree isolation support added to the execution path
- Completion notifications include result file path
- `background: true` agent definition flag affects execution policy
- Per-invocation model override in AgentTool call

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `agentLoopRunner` (qh) - Core async generator - chunks.133.mjs:1565
- `runWithAgentIdentity` (p01) - Identity context binding - chunks.80.mjs:2353
- `inProcessAgentRunner` (XNY) - In-process teammate runner - chunks.134.mjs:1571
- `pollForNextMessage` (DNY) - Teammate poll loop - chunks.134.mjs:1483
- `assembleSessionToolSet` (YP6) - Tool assembly - chunks.141.mjs:1476
- `deriveToolUseContext` (vQ1) - Context derivation - chunks.149.mjs:2589

---

## System Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         PARENT AGENT                                      │
│                                                                           │
│  ┌──────────────┐    ┌───────────────┐    ┌─────────────────────────┐   │
│  │  AgentTool   │───▶│  Task Manager │───▶│  agentLoopRunner (qh)   │   │
│  │   (rj1)      │    │  (89.mjs)     │    │  (133.mjs)              │   │
│  └──────────────┘    └───────────────┘    └────────────┬────────────┘   │
│                                                         │                │
└─────────────────────────────────────────────────────────│───────────────┘
                                                          │
              ┌───────────────────────────────────────────┼────────────────┐
              │               SUBAGENT EXECUTION          │                │
              │                                           ▼                │
              │   ┌─────────────────┐    ┌───────────────────────────┐   │
              │   │  Identity Store  │◀──│  runWithAgentIdentity (p01)│   │
              │   │ (AsyncLocalStore)│    │  (80.mjs)                 │   │
              │   └─────────────────┘    └──────────────┬────────────┘   │
              │                                          │                │
              │   ┌─────────────────┐    ┌──────────────▼────────────┐   │
              │   │  Tool Set       │◀──│  assembleSessionToolSet    │   │
              │   │  (filtered)     │    │  (YP6, 141.mjs)            │   │
              │   └─────────────────┘    └──────────────┬────────────┘   │
              │                                          │                │
              │   ┌─────────────────┐    ┌──────────────▼────────────┐   │
              │   │  Worktree       │◀──│  Isolation setup           │   │
              │   │  (v2.1.76)      │    │  (if isolation: worktree)  │   │
              │   └─────────────────┘    └──────────────┬────────────┘   │
              │                                          │                │
              │                           ┌──────────────▼────────────┐   │
              │                           │      LLM API Loop          │   │
              │                           │  (tool dispatch, progress) │   │
              │                           └───────────────────────────┘   │
              └───────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
Task Tool Input
{
  description: "...",
  run_in_background?: boolean,
  name?: string,
  team_name?: string,
  model?: string,        // v2.1.76: per-invocation model override
}
       │
       ▼
AgentTool.call()
  ├── Resolve agent definition (by name or default)
  ├── Merge with overrides (model from input → v2.1.76)
  ├── Build fork context messages
  └── Route to execution mode:
       │
       ├── Sync → createForegroundTask (wd7)
       │              │
       │              └── Promise.race(agentLoop, backgroundSignal)
       │
       ├── Async → createAsyncTask (zd7)
       │              │
       │              └── Launch agentLoop independently
       │
       └── Teammate → spawnTeammateDispatcher
                        │
                        ├── In-process → inProcessAgentRunner (XNY)
                        ├── Split-pane → iTerm2/tmux backend
                        └── Tmux-only → tmux backend
```

---

## File Structure Map

```
chunks.89.mjs    - Task lifecycle management (createForegroundTask, createAsyncTask, kill)
chunks.133.mjs   - agentLoopRunner, execution loop
chunks.134.mjs   - inProcessAgentRunner, pollForNextMessage, claimUnclaimedTask
chunks.132.mjs   - AgentTool, SkillTool (executeForkedSkill)
chunks.141.mjs   - assembleSessionToolSet
chunks.149.mjs   - deriveToolUseContext
chunks.80.mjs    - runWithAgentIdentity, AsyncLocalStorage store
chunks.129.mjs   - Mailbox operations (readMailbox, writeToMailbox, markMessageAsReadByIndex)
chunks.142.mjs   - atomicUpdateTask, task state operations
```

---

## Six Key Design Patterns

### 1. Generator-Based Streaming

All subagent execution uses `async function*` generators. Events are yielded from the innermost scope (LLM API response) through intermediate scopes (agentLoopRunner) to the outermost caller (AgentTool.call).

**Why:** Real-time UI updates without buffering. Each LLM token is displayed as it arrives rather than after the full response.

### 2. AsyncLocalStorage Identity Propagation

The current agent's identity is stored in `AsyncLocalStorage` and automatically propagates through all async operations without explicit parameter passing.

**Why:** Tools, hooks, and compaction all need to know which agent they are operating on behalf of, but threading this through every function call would create massive coupling.

### 3. Promise.race Mid-Run Backgrounding

Foreground tasks use `Promise.race([agentLoopPromise, backgroundSignal])`. When the user requests backgrounding, the signal fires and the task transitions to background mode without restarting.

**Why:** Zero state loss. The agent continues exactly where it was, but now outputs to a file instead of blocking the session.

### 4. Write Queue Serialization

Transcript writes are serialized through a Promise chain (`transcriptWriteQueue`). Each write appends to the chain, ensuring JSONL records are written in order even when tool results arrive concurrently.

**Why:** JSONL format requires one record per line with no interleaving. Promise chaining is simpler than a mutex and avoids event loop starvation.

### 5. Priority Poll Loop

The teammate's poll loop (`pollForNextMessage`) checks multiple message sources in priority order: user interrupts first, then mailbox messages, then idle check.

**Why:** User interrupts must be processed immediately. Lower-priority checks don't need to run if a higher-priority message is waiting.

### 6. Context Isolation

`deriveToolUseContext` (vQ1) creates a new context for the subagent by cloning some fields (readFileState) and sharing others (appState getter) from the parent context.

**Clone vs Share decision:**

| Field | Strategy | Reason |
|-------|----------|--------|
| `readFileState` | Clone (new Map) | Subagent's file reads are independent |
| `getAppState` | Share (same getter) | Subagent reads global app state |
| `setAppState` | Share (same setter) | Subagent can update global state |
| `options` | Clone (spread) | Subagent may override model/tools |

---

## Critical Code Paths

### Path 1: Sync Subagent Execution

```
User/LLM → AgentTool.call()
         → buildForkContextMessages()
         → resolveAgentDefinition()
         → mergeAgentDefinitions() (applies per-invocation model, v2.1.76)
         → createForegroundTask()
             → agentLoopRunner()
                 → assembleSessionToolSet()
                 → runWithAgentIdentity()
                     → setupWorktreeIsolation() (if isolation: worktree, v2.1.76)
                     → getSystemPrompt()
                     → deriveToolUseContext()
                     → fireSubagentStartHooks()
                     → llmLoop()  ← main execution
                     → fireSubagentStopHooks()
             → markTaskCompleted() (notification includes outputFilePath, v2.1.76)
         → return { status: "completed", content, tokens }
```

### Path 2: Async Backgrounded Subagent

```
User/LLM → AgentTool.call(run_in_background: true)
         → createAsyncTask()
         → launch agentLoopRunner() in detached Promise
         → return immediately { status: "async_launched", agentId, outputFile }

(Later)
         agentLoopRunner writes to outputFile
         markTaskCompleted({ outputFilePath }) ← v2.1.76 includes path
```

### Path 3: Teammate Execution

```
User/LLM → AgentTool.call(name, team_name)
         → spawnTeammateDispatcher()
             → routeToBackend():
                 - Non-interactive → inProcessAgentRunner (XNY)
                 - iTerm2 → iTerm2PaneBackend
                 - tmux → TmuxBackend
             → setupMailbox(agentId)
         → return immediately (teammate is async by definition)

(Teammate in parallel)
             → pollForNextMessage() loop
             → Process messages from mailbox
             → Send responses via writeToMailbox()
```

---

## Performance Characteristics

### Bottlenecks

1. **Tool assembly** (`assembleSessionToolSet`) runs on every subagent start. Includes scanning skill directories and loading MCP tools. ~50-200ms on cold start.

2. **System prompt construction** requires reading context files, CLAUDE.md, and generating skill listings. ~10-50ms depending on project size.

3. **Worktree allocation** (v2.1.76) adds ~100-500ms for git worktree creation when `isolation: worktree` is used.

4. **First LLM token latency** is network-bound (200-2000ms depending on model and region).

### Optimizations

- Tool assembly is memoized per session context (cache invalidated on skill file changes)
- System prompt is partially cached via prompt cache markers
- Worktree cleanup happens asynchronously after the subagent completes

---

## Comparison: v2.1.38 vs v2.1.76

| Feature | v2.1.38 | v2.1.76 |
|---------|---------|---------|
| Worktree isolation | Not supported | `isolation: worktree` in agent definition |
| Per-invocation model | Session model only | `model` parameter in Task tool call |
| Background agent flag | Not in schema | `background: true` agent definition field |
| Completion notification | `{ agentId }` only | `{ agentId, outputFilePath }` |
| Task creation | Requires `activeForm` field | `activeForm` no longer required |
