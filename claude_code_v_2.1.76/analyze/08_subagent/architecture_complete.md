# Architecture Complete - Subagent System (Claude Code 2.1.76)

> Complete architecture documentation for the subagent execution system including component hierarchy, data flow, design patterns, and integration points.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](./cross_validation_unified_v3.md) - Unified symbol verification
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `qh` - agentLoopRunner — `chunks.133.mjs:1565`
- `QW6` - AgentTool — `chunks.136.mjs:1512`
- `pNY` - spawnTeammateDispatcher — `chunks.135.mjs:1110`
- `Xk8` - filterToolsForSubagent — `chunks.93.mjs:1568`

---

## System Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SUBAGENT EXECUTION ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              PARENT AGENT                                     │
│                                                                               │
│  ┌──────────────────┐     ┌───────────────────┐     ┌───────────────────┐   │
│  │   AgentTool      │────►│   Task Manager    │────►│ agentLoopRunner   │   │
│  │   (QW6)          │     │   (Qn4, Un4)      │     │   (qh)            │   │
│  │   chunks.136.mjs │     │   chunks.146.mjs  │     │   chunks.133.mjs  │   │
│  └──────────────────┘     └───────────────────┘     └─────────┬─────────┘   │
│                                                                 │             │
└─────────────────────────────────────────────────────────────────│─────────────┘
                                                                  │
              ┌───────────────────────────────────────────────────┼────────────┐
              │                  SUBAGENT EXECUTION               │            │
              │                                                  ▼            │
              │   ┌─────────────────────┐    ┌─────────────────────────────┐   │
              │   │  Identity Store     │◄───│  Context Derivation         │   │
              │   │  (AsyncLocalStorage)│    │  (Bc6)                      │   │
              │   └─────────────────────┘    └──────────────┬──────────────┘   │
              │                                               │                 │
              │   ┌─────────────────────┐    ┌───────────────▼──────────────┐  │
              │   │  Tool Filter        │◄───│  filterToolsForSubagent (Xk8)│  │
              │   │  (whitelist/black)  │    │  chunks.93.mjs               │  │
              │   └─────────────────────┘    └───────────────┬──────────────┘  │
              │                                               │                 │
              │   ┌─────────────────────┐    ┌───────────────▼──────────────┐  │
              │   │  Mailbox System     │◄───│  Teammate Communication      │  │
              │   │  (wl, x3)           │    │  (pNY, qn4)                  │  │
              │   │  chunks.132.mjs     │    │  chunks.135.mjs              │  │
              │   └─────────────────────┘    └──────────────────────────────┘  │
              │                                                                 │
              └─────────────────────────────────────────────────────────────────┘
```

---

## Execution Mode Architecture

### Mode Selection Flow

```
AgentTool.call({ prompt, subagent_type, run_in_background, name, team_name })
        │
        ├─── name && team_name ?
        │    │
        │    └─── YES ──► Teammate Mode
        │                  │
        │                  ├─── isInProcessEnabled() ?
        │                  │    └─── YES ──► spawnInProcessTeammate (FNY)
        │                  │
        │                  ├─── use_splitpane && iTerm2 ?
        │                  │    └─── YES ──► spawnSplitPaneTeammate (BNY)
        │                  │
        │                  └─── DEFAULT ──► spawnTmuxTeammate (gNY)
        │
        ├─── run_in_background ?
        │    │
        │    └─── YES ──► Background Mode
        │                  │
        │                  └─── createBackgroundAgentTask (Qn4)
        │
        └─── DEFAULT ──► Foreground Mode
                         │
                         ├─── createForegroundAgentTask (Un4)
                         │
                         └─── Promise.race([agentLoop, backgroundSignal])
```

### Execution Mode Comparison

| Aspect | Foreground | Background | Teammate |
|--------|------------|------------|----------|
| **Blocking** | Yes | No | No |
| **Output** | Inline | File-based | Mailbox |
| **Progress** | Real-time | System reminder | Message queue |
| **Tool Access** | Full | Restricted | Delegated |
| **Identity** | Subagent ID | Subagent ID | Teammate ID |
| **Communication** | Return value | Output file | Mailbox |

---

## Data Flow Diagrams

### Tool Input Processing

```
AgentTool.call({
    prompt: "...",
    description: "...",
    subagent_type: "general-purpose",
    run_in_background: false,
    model: "claude-sonnet-4",  // v2.1.76: per-invocation override
    isolation: "worktree"      // v2.1.76: git worktree isolation
})
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Input Validation & Resolution                                            │
│    ├── Validate input against agentInputSchema (aVY)                        │
│    ├── Resolve agent definition from subagent_type                          │
│    ├── Merge model override (v2.1.76)                                       │
│    └── Check required MCP servers                                           │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Task Creation                                                            │
│    ├── Generate task ID (oV)                                                │
│    ├── Create AbortController                                               │
│    ├── Initialize output file                                               │
│    ├── Register in appState.tasks (Zf)                                      │
│    └── Setup cleanup handler                                                │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Agent Loop Execution                                                     │
│    ├── Build fork context messages (Fx8)                                    │
│    ├── Filter tools (Xk8)                                                   │
│    ├── Build system prompt (vvY)                                            │
│    ├── Derive tool use context (Bc6)                                        │
│    ├── Setup worktree isolation (v2.1.76)                                   │
│    └── Execute LLM message loop (Yh)                                        │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Completion                                                               │
│    ├── Flush output buffer ($O)                                             │
│    ├── Mark task completed/failed ($m8/Hm8)                                 │
│    ├── Cleanup worktree (if used)                                           │
│    └── Fire SubagentStop hooks                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mailbox Communication Flow

```
Teammate A                          Mailbox System                      Teammate B
    │                                    │                                   │
    │  writeToMailbox(B, message)       │                                   │
    │ ─────────────────────────────────► │                                   │
    │                                    │  1. Ensure inbox directory        │
    │                                    │  2. Acquire lock (proper-lockfile)│
    │                                    │  3. Append message                │
    │                                    │  4. Release lock                  │
    │                                    │                                   │
    │                                    │  readMailbox(B)                   │
    │                                    │ ◄─────────────────────────────────│
    │                                    │                                   │
    │                                    │  markMessagesAsRead(B)            │
    │                                    │ ◄─────────────────────────────────│
    │                                    │                                   │
```

---

## Key Design Patterns

### 1. Generator-Based Streaming

All subagent execution uses `async function*` generators:

```javascript
// ============================================
// qh - agentLoopRunner - Core async generator
// Location: chunks.133.mjs:1565-1786
// ============================================

// ORIGINAL (for source lookup):
async function* qh({
    agentDefinition: A,
    promptMessages: q,
    toolUseContext: K,
    ...
}) {
    // ... initialization ...
    for await (let $6 of Yh({...})) {
        if ($6.type === "stream_event") {
            yield $6;  // Stream to parent
        }
        if (TvY($6)) {
            yield $6;  // Yield recorded messages
        }
    }
}

// READABLE (for understanding):
async function* agentLoopRunner({
    agentDefinition,
    promptMessages,
    toolUseContext,
    ...
}) {
    // Setup phase
    let agentId = generateAgentId();
    let systemPrompt = await buildSystemPromptForAgent(agentDefinition, ...);
    let filteredTools = filterToolsForSubagent(agentDefinition, availableTools, isAsync);

    // Execute agent loop
    for await (let event of llmMessageLoop({
        messages: promptMessages,
        systemPrompt,
        tools: filteredTools,
        ...
    })) {
        // Stream events to parent
        yield event;
    }
}
```

**Why this approach:**
- Real-time UI updates without buffering
- Each LLM token displayed as it arrives
- Parent can process events while subagent runs

### 2. AsyncLocalStorage Identity Propagation

```javascript
// ============================================
// ef8 - teammateContextStorage - Identity context
// Location: chunks.84.mjs:1425
// ============================================

// ORIGINAL (for source lookup):
ef8 = new AsyncLocalStorage();

// READABLE (for understanding):
const teammateContextStorage = new AsyncLocalStorage();

// Context is automatically available in all async operations
function runWithTeammateContext(teammateContext, callback) {
    return teammateContextStorage.run(teammateContext, callback);
}

function getTeammateContext() {
    return teammateContextStorage.getStore();
}
```

**Why this approach:**
- Tools, hooks, and compaction all need agent identity
- No explicit parameter threading required
- Automatic propagation through async operations

### 3. Promise.race Mid-Run Backgrounding

```javascript
// ============================================
// Mid-run backgrounding pattern
// Location: chunks.146.mjs:2165-2226
// ============================================

function createForegroundAgentTask({ autoBackgroundMs, ... }) {
    // Create background signal
    let backgroundSignal = new Promise((resolve) => {
        backgroundResolver = resolve;
    });

    // Set up auto-background timer
    if (autoBackgroundMs !== undefined && autoBackgroundMs > 0) {
        setTimeout(() => {
            // Transition to background
            setAppState((state) => ({
                ...state,
                tasks: {
                    ...state.tasks,
                    [taskId]: {
                        ...state.tasks[taskId],
                        isBackgrounded: true
                    }
                }
            }));
            backgroundResolver();
        }, autoBackgroundMs);
    }

    return { taskId, backgroundSignal };
}

// In AgentTool.call:
await Promise.race([
    agentCompletion,
    result.backgroundSignal
]);
```

**Why this approach:**
- Zero state loss on backgrounding
- Agent continues exactly where it was
- Clean transition without restart

### 4. Tool Filtering Strategy

```javascript
// ============================================
// Xk8 - filterToolsForSubagent
// Location: chunks.93.mjs:1568-1588
// ============================================

// ORIGINAL (for source lookup):
function Xk8({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z3(z, aJ) && Y === "plan") return !0;
        if (CW6.has(z.name)) return !1;
        if (!q && xV8.has(z.name)) return !1;
        if (K && !eP1.has(z.name)) {
            if (E7() && eP()) {
                if (z3(z, r4)) return !0;
                if (WY4.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}

// READABLE (for understanding):
function filterToolsForSubagent({
    tools,
    isBuiltIn,
    isAsync = false,
    permissionMode
}) {
    return tools.filter((tool) => {
        // Always allow MCP tools
        if (tool.name.startsWith("mcp__")) return true;

        // Allow ExitPlanMode in plan mode
        if (matchesTool(tool, "ExitPlanMode") && permissionMode === "plan") {
            return true;
        }

        // Block background-excluded tools
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Block built-in excluded for non-built-in agents
        if (!isBuiltIn && BUILTIN_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // In async mode, only allow whitelisted tools
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Exception: Teammates get Agent + TEAM_DELEGATE_TOOLS
            if (isAgentTeamsEnabled() && isInProcessEnabled()) {
                if (matchesTool(tool, "Agent")) return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}
```

**Why this approach:**
- Prevents background agents from blocking operations
- Teammates get delegation capabilities
- MCP tools always allowed for extensibility

---

## File Structure Map

| File | Content | Key Functions |
|------|---------|---------------|
| `chunks.136.mjs` | Agent Tool | `QW6` (AgentTool), `aVY` (agentInputSchema) |
| `chunks.133.mjs` | Agent Loop | `qh` (agentLoopRunner), `Yh` (llmMessageLoop) |
| `chunks.146.mjs` | Task Lifecycle | `Qn4`, `Un4`, `x66`, `$m8`, `Hm8` |
| `chunks.90.mjs` | Task State | `i9`, `Zf`, `VR`, `wY4` |
| `chunks.93.mjs` | Tool Filtering | `Xk8`, `_c` |
| `chunks.132.mjs` | Mailbox | `wl`, `x3`, `Vc6`, `kc6` |
| `chunks.135.mjs` | Teammate Spawn | `pNY`, `qn4`, `FNY`, `BNY`, `gNY` |
| `chunks.41.mjs` | Task ID | `oV`, `k$3`, `RG`, `Y91` |
| `chunks.147.mjs` | System Reminder | `suY`, `f4` |

---

## Performance Characteristics

### Bottlenecks

| Operation | Latency | Mitigation |
|-----------|---------|------------|
| Tool assembly | 50-200ms | Memoized per session |
| System prompt build | 10-50ms | Prompt cache markers |
| Worktree allocation | 100-500ms | Async cleanup |
| First LLM token | 200-2000ms | Network-bound |

### Optimizations

- Tool assembly memoized per session context
- System prompt partially cached via prompt cache markers
- Worktree cleanup happens asynchronously
- Output buffer uses batched writes

---

## Version Comparison

| Feature | v2.1.38 | v2.1.76 |
|---------|---------|---------|
| Worktree isolation | Not supported | `isolation: worktree` |
| Per-invocation model | Session only | `model` parameter |
| Background flag | Not in schema | `background: true` field |
| Completion notification | `{ agentId }` | `{ agentId, outputFilePath }` |

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Full architecture documentation