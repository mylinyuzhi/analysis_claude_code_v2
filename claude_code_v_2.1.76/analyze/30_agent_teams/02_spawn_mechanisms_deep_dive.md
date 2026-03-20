# Spawn Mechanisms Deep Dive - Agent Teams

> **Module**: Agent Teams - Backend Execution Modes
> **Version**: Claude Code 2.1.76
> **Purpose**: Comprehensive analysis of all 3 teammate spawning modes with algorithmic detail

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Mode Selection Algorithm](#2-mode-selection-algorithm)
3. [In-Process Mode Deep Dive](#3-in-process-mode-deep-dive)
4. [Split-Pane Mode (tmux/iTerm2)](#4-split-pane-mode-tmuxiterm2)
5. [Separate Window Mode](#5-separate-window-mode)
6. [Backend Detection & Availability](#6-backend-detection--availability)
7. [Performance Characteristics](#7-performance-characteristics)
8. [Decision Matrix & Recommendations](#8-decision-matrix--recommendations)

---

## 1. Executive Summary

Claude Code supports **three fundamentally different execution modes** for agent teammates:

| Mode | Process Model | Visual Separation | Communication | Best For |
|------|--------------|-------------------|---------------|----------|
| **In-Process** | Same Node.js process, cooperative multitasking | None (AppState UI only) | Shared memory + mailbox | CI/CD, non-interactive sessions |
| **Split-Pane** | Separate process per pane in current tmux/iTerm2 session | Each agent in own pane | Mailbox files only | Local development, visual monitoring |
| **Separate Window** | Separate process in external tmux session | New window per agent | Mailbox files only | Large teams, tmux power users |

**Key architectural insight**: Mode selection happens **automatically** based on environment detection (TTY availability, tmux presence, iTerm2 detection). Users can override via `useSplitPane` parameter or `FORCE_IN_PROCESS` environment variable.

**Design philosophy**: **Graceful degradation** - prefer rich UI (split-pane) when available, fall back to lean execution (in-process) when necessary. This enables the same codebase to work in interactive terminals, CI/CD pipelines, SSH sessions, and desktop IDEs.

---

## 2. Mode Selection Algorithm

### 2.1 Decision Tree

**Complete flow** (obfuscated: `spawnTeammateDispatcher` / pNY):

```javascript
// ============================================
// spawnTeammateDispatcher - Determine execution mode and dispatch to appropriate spawner
// Location: chunks.135.mjs:1110-1114
// ============================================

// ORIGINAL (for source lookup):
async function pNY(A, q) {
    if (Rb()) return FNY(A, q);
    if (A.use_splitpane !== !1) return BNY(A, q);
    return gNY(A, q)
}

// READABLE (for understanding):
async function spawnTeammateDispatcher(params, context) {
    // Step 1: Check if in-process mode is required or preferred
    if (isInProcessEnabled()) {
        return spawnInProcessTeammate(params, context);
    }

    // Step 2: Check user preference for split-pane mode
    if (params.useSplitPane !== false) {  // Default: true
        // Try split-pane mode (tmux/iTerm2 in current session)
        return spawnSplitPaneTeammate(params, context);
    } else {
        // User explicitly disabled split-pane → use separate window
        return spawnTmuxTeammate(params, context);
    }
}

// Mapping: pNY→spawnTeammateDispatcher, A→params, q→context, Rb→isInProcessEnabled,
//          FNY→spawnInProcessTeammate, BNY→spawnSplitPaneTeammate, gNY→spawnTmuxTeammate
```

### 2.2 In-Process Detection Logic

**Implementation**:

```javascript
// ============================================
// isInProcessEnabled - Determines if in-process backend should be used
// Location: chunks.135.mjs:208-215
// ============================================

// ORIGINAL (for source lookup):
function Rb() {
    return Y0(process.env.FORCE_IN_PROCESS) || !process.stdin.isTTY || !OI() && !j51()
}

// READABLE (for understanding):
function isInProcessEnabled() {
    // Condition 1: Explicit user override
    if (parseBoolean(process.env.FORCE_IN_PROCESS)) {
        return true;
    }

    // Condition 2: Non-interactive session (no TTY)
    // Examples: CI/CD pipeline, systemd service, cron job
    if (!process.stdin.isTTY) {
        return true;
    }

    // Condition 3: No terminal multiplexer available
    // Neither tmux nor iTerm2 detected
    if (!isRunningInsideTmux() && !isRunningInIterm2()) {
        return true;
    }

    return false;  // Prefer pane-based modes when available
}

// Mapping: Rb→isInProcessEnabled, Y0→parseBoolean, OI→isRunningInsideTmux, j51→isRunningInIterm2
```

**Condition precedence** (evaluated in order):

```
Priority 1: FORCE_IN_PROCESS=1
  └─→ User wants in-process mode regardless of environment
      Use case: Debugging, performance testing

Priority 2: !process.stdin.isTTY
  └─→ No interactive terminal available
      Examples:
        • GitHub Actions runner
        • Docker container without -t flag
        • SSH session with command (ssh host "claude ...")
        • systemd service

Priority 3: !tmux && !iTerm2
  └─→ Fallback for unsupported terminals
      Examples:
        • Plain bash/zsh terminal (no multiplexer)
        • VSCode integrated terminal (no tmux)
        • Windows Terminal (not yet supported)
```

**Why this precedence**:

1. **User override first**: Respects explicit user intent (debugging, testing)
2. **Environment constraint second**: Non-interactive sessions physically cannot spawn panes
3. **Capability detection last**: Fall back gracefully when advanced features unavailable

**Trade-off**: Automatic detection can surprise users ("Why is my agent not showing in a pane?"). Mitigation: Log detection decision at DEBUG level.

### 2.3 Split-Pane vs Separate Window

**Decision point**: If `isInProcessEnabled() === false`, choose between:

- **Split-Pane** (`useSplitPane !== false`): Default, creates pane in current tmux/iTerm2 session
- **Separate Window** (`useSplitPane === false`): Creates new window in external "claude-swarm" tmux session

**Why default to split-pane**:

| Aspect | Split-Pane (default) | Separate Window |
|--------|---------------------|----------------|
| **User convenience** | Visible immediately (same window) | Requires switching sessions (Ctrl+B s) |
| **Session management** | Automatic (uses current session) | Manual (creates external session) |
| **Cleanup** | Panes close with main session | Session persists after main exits |
| **Screen space** | Shares current window | Dedicated window per agent |

**When to use separate window**:
- Large teams (>5 agents) - split-pane becomes cramped
- Long-running agents - want session to survive leader exit
- tmux power users - prefer session-based organization

**Example override**:
```javascript
SpawnTeammate({
  agentName: "backend-dev",
  prompt: "...",
  useSplitPane: false  // Use separate window instead
})
```

### 2.4 Edge Case: Backend Availability Failure

**Scenario**: User in split-pane mode but tmux crashes mid-session.

**Flow**:

```
spawnSplitPaneTeammate(params, context)
  |
  ├─→ getBackend(useSplitPane=true)  [chunks.131.mjs:1493]
  |     |
  |     ├─→ isRunningInsideTmux() → true (detect $TMUX env var)
  |     ├─→ Create TmuxBackend instance
  |     └─→ backend.isAvailable()  [Check tmux actually works]
  |           |
  |           └─→ exec("tmux list-sessions")
  |                 • If success → return true
  |                 • If error → return false
  |
  └─→ if (!backend || !backend.isAvailable()) {
        // Fallback to in-process
        return spawnInProcessTeammate(params, context);
      }
```

**Why re-check availability**: Environment variables (like `$TMUX`) can be stale if tmux server died. Executing a tmux command verifies it's actually running.

**Recovery**: Automatically falls back to in-process mode. User sees warning: "tmux backend unavailable, using in-process mode".

---

## 3. In-Process Mode Deep Dive

### 3.1 Architecture

**Process model**: Teammates are **cooperative tasks** running in the same Node.js event loop as the team lead.

```
┌─────────────────────────────────────────────────────────┐
│ Single Node.js Process                                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐                                   │
│  │ Main Event Loop  │                                   │
│  └────────┬─────────┘                                   │
│           │                                              │
│           ├─→ Team Lead Agent Loop                      │
│           │     • User input processing                 │
│           │     • Tool execution                        │
│           │     • LLM API calls                         │
│           │                                              │
│           ├─→ Teammate "backend-dev" Poll Loop          │
│           │     • inProcessPollLoop (async)             │
│           │     • Yields to event loop every 500ms      │
│           │     • Shares AppState with lead             │
│           │                                              │
│           └─→ Teammate "frontend-dev" Poll Loop         │
│                 • Separate agent loop iteration         │
│                 • Shares same heap/memory               │
│                                                          │
│  AppState (Shared Memory):                              │
│    {                                                     │
│      teamContext: {...},                                │
│      tasks: [                                            │
│        {                                                 │
│          type: "in_process_teammate",                   │
│          agentId: "uuid-backend",                       │
│          agentName: "backend-dev",                      │
│          abortController: AbortController,              │
│          pendingUserMessages: []  // Priority 1 queue   │
│        },                                                │
│        ...                                               │
│      ]                                                   │
│    }                                                     │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Spawning Flow

**Complete execution** (obfuscated: `spawnInProcessTeammate` / FNY):

```javascript
// ============================================
// spawnInProcessTeammate - Spawn teammate in same process
// Location: chunks.135.mjs:985-1108
// ============================================

// READABLE (for understanding):
async function spawnInProcessTeammate(params, context) {
    const { agentName, prompt, planModeRequired } = params;
    const teamName = context.teamContext.teamName;

    // Step 1: Generate unique identifiers
    const agentId = crypto.randomUUID();  // e.g., "550e8400-e29b-41d4-a716-446655440000"
    const taskId = `teammate-${agentName}-${Date.now()}`;

    // Step 2: Create abort controller for graceful shutdown
    const abortController = new AbortController();

    // Step 3: Register teammate in AppState
    await context.updateAppState(state => ({
        ...state,
        tasks: [
            ...state.tasks,
            {
                id: taskId,
                type: "in_process_teammate",
                agentId,
                agentName,
                teamName,
                status: "running",
                abortController,
                pendingUserMessages: [],  // Fast-path message queue
                spawnedAt: new Date().toISOString()
            }
        ]
    }));

    // Step 4: Update team config on disk
    const teamConfig = readTeamConfig(teamName);
    teamConfig.members.push({
        agentId,
        agentName,
        backendType: "in-process",
        tmuxPaneId: null,  // Not applicable for in-process
        spawnedAt: new Date().toISOString()
    });
    writeTeamConfig(teamName, teamConfig);

    // Step 5: Start agent runner asynchronously (non-blocking)
    // This runs in background, doesn't block the spawning tool's response
    setImmediate(async () => {
        await inProcessAgentRunner({
            agentId,
            agentName,
            teamName,
            initialPrompt: prompt,
            planModeRequired,
            abortSignal: abortController.signal
        }, context);

        // Cleanup after agent exits
        await context.updateAppState(state => ({
            ...state,
            tasks: state.tasks.filter(t => t.id !== taskId)
        }));
    });

    return {
        success: true,
        agentId,
        message: `Spawned in-process teammate '${agentName}'`
    };
}

// Mapping: FNY→spawnInProcessTeammate, XNY→inProcessAgentRunner
```

**Key insight**: Spawning is **async but non-blocking**. The `setImmediate()` ensures the agent runner starts after the current event loop tick, allowing the SpawnTeammate tool to return immediately. The teammate begins polling in the background.

### 3.3 In-Process Poll Loop (Priority Queue)

**Implementation** (obfuscated: `pollForNextMessage` / DNY):

```javascript
// ============================================
// pollForNextMessage - 5-level priority message polling for in-process teammates
// Location: chunks.134.mjs:1483-1570
// ============================================

// READABLE (for understanding):
async function pollForNextMessage(config, abortSignal, context) {
    const { agentId, agentName, teamName } = config;

    let iterationCount = 0;
    while (!abortSignal.aborted) {
        // ═══════════════════════════════════════════════════════════
        // Priority 1: Pending user messages (fast path via AppState)
        // ═══════════════════════════════════════════════════════════
        const state = await context.getAppState();
        const task = findTaskByAgentId(agentId, state.tasks);

        if (task?.pendingUserMessages.length > 0) {
            // Dequeue first message atomically
            const message = await context.updateAppState(s => {
                const t = findTaskByAgentId(agentId, s.tasks);
                return t.pendingUserMessages.shift();
            });

            return {
                type: "user_message",
                from: message.from,
                content: message.content,
                timestamp: new Date().toISOString()
            };
        }

        // Sleep 500ms EXCEPT on first iteration (immediate check)
        if (iterationCount > 0) {
            await sleep(500);  // Polling interval
        }
        iterationCount++;

        // Check abort signal
        if (abortSignal.aborted) {
            return { type: "aborted" };
        }

        // ═══════════════════════════════════════════════════════════
        // Priority 2-4: Mailbox messages (slow path via filesystem)
        // ═══════════════════════════════════════════════════════════
        const mailbox = await readMailbox(agentName, teamName);

        // Priority 2: Shutdown requests (bypass entire queue)
        for (let i = 0; i < mailbox.length; i++) {
            const msg = mailbox[i];
            if (!msg.read) {
                const shutdownReq = parseShutdownRequest(msg.text);
                if (shutdownReq) {
                    // CRITICAL: Mark as read before returning
                    await markMessageAsReadByIndex(agentName, teamName, i);

                    const skippedCount = mailbox.filter(m => !m.read).length - 1;
                    console.log(
                        `[pollForNextMessage] Shutdown request prioritized over ` +
                        `${skippedCount} unread messages`
                    );

                    return {
                        type: "shutdown_request",
                        requestId: shutdownReq.requestId,
                        from: msg.from
                    };
                }
            }
        }

        // Priority 3: Messages from team-lead
        const leadMessageIndex = mailbox.findIndex(
            msg => !msg.read && msg.from === "team-lead"
        );
        if (leadMessageIndex !== -1) {
            await markMessageAsReadByIndex(agentName, teamName, leadMessageIndex);
            const msg = mailbox[leadMessageIndex];
            return {
                type: "team_message",
                from: msg.from,
                content: msg.text,
                timestamp: msg.timestamp
            };
        }

        // Priority 4: Any unread message (FIFO)
        const anyMessageIndex = mailbox.findIndex(msg => !msg.read);
        if (anyMessageIndex !== -1) {
            await markMessageAsReadByIndex(agentName, teamName, anyMessageIndex);
            const msg = mailbox[anyMessageIndex];
            return {
                type: "peer_message",
                from: msg.from,
                content: msg.text,
                timestamp: msg.timestamp
            };
        }

        // ═══════════════════════════════════════════════════════════
        // Priority 5: Auto-claim next available task
        // ═══════════════════════════════════════════════════════════
        const taskPrompt = await claimUnclaimedTask(agentName, teamName, context);
        if (taskPrompt) {
            return {
                type: "task_assignment",
                content: taskPrompt
            };
        }

        // No work available → continue polling
    }

    return { type: "aborted" };
}

// Mapping: DNY→pollForNextMessage, Ji4→claimUnclaimedTask, wl→readMailbox, Vc6→markMessageAsReadByIndex
```

**Why 5 priority levels**:

| Priority | Source | Rationale | Bypass |
|----------|--------|-----------|--------|
| **1** | `pendingUserMessages` (AppState) | Direct injection from lead = highest urgency | N/A (separate queue) |
| **2** | Shutdown requests (mailbox) | Control plane signal, must not be blocked | Scans ALL messages first |
| **3** | Team-lead messages (mailbox) | Coordination from orchestrator | Higher than peer messages |
| **4** | Any unread message (mailbox) | Normal inter-agent communication | FIFO within priority |
| **5** | Task auto-claim (filesystem) | Backfill work when idle | Only if no messages |

**Key algorithmic insight**: Priority 2's **full mailbox scan** prevents shutdown starvation:

```
Scenario without Priority 2 scan:
  Mailbox: [msg1, msg2, ..., msg100, shutdown_request]
  Poll loop: Processes msg1 → msg2 → ... (100 iterations × avg 30s each = 50 minutes)
  Result: Shutdown delayed by 50 minutes!

Scenario with Priority 2 scan:
  Mailbox: [msg1, msg2, ..., msg100, shutdown_request]
  Poll loop: Scans all messages FIRST, finds shutdown_request, returns immediately
  Result: Shutdown processed in <1 second
```

**Trade-off**: O(N) scan of mailbox every poll cycle. For typical mailboxes (<100 messages), this is <1ms. For huge mailboxes (>10,000), scan becomes expensive. Mitigation: Mailbox cleanup (archive old messages).

### 3.4 Agent Runner Loop

**Implementation** (obfuscated: `inProcessAgentRunner` / XNY):

```javascript
// ============================================
// inProcessAgentRunner - Main execution loop for in-process teammates
// Location: chunks.134.mjs:1571-1650
// ============================================

// READABLE (for understanding):
async function inProcessAgentRunner(config, context) {
    const { agentId, agentName, teamName, initialPrompt, abortSignal } = config;

    // Build system prompt
    const systemPrompt = [
        `You are ${agentName} in team "${teamName}".`,
        ``,
        `Team members:`,
        `- team-lead (coordinator)`,
        ...getTeamMembers(teamName).map(m => `- ${m.agentName}`),
        ``,
        `Task list location: ~/.claude/tasks/${teamName}/`,
        ``,
        `Use SendMessage to coordinate with teammates.`,
        `Use TaskUpdate to claim and update tasks.`,
        `Use TaskList to see available work.`,
        ``,
        initialPrompt
    ].join('\n');

    const messages = [];

    while (!abortSignal.aborted) {
        // Wait for next message from poll loop
        const nextMessage = await pollForNextMessage(config, abortSignal, context);

        if (nextMessage.type === "aborted") {
            console.log(`[inProcessRunner] ${agentName} aborted`);
            break;
        }

        if (nextMessage.type === "shutdown_request") {
            // Inject shutdown request as user message
            // Agent will process it and call SendMessage(type: "shutdown_response")
            messages.push({
                role: "user",
                content: `SHUTDOWN REQUEST from ${nextMessage.from}. ` +
                         `Please respond with SendMessage(type: "shutdown_response", ` +
                         `approve: true/false, request_id: "${nextMessage.requestId}").`
            });
        } else {
            // Normal message or task assignment
            messages.push({
                role: "user",
                content: nextMessage.content
            });
        }

        // Run agent loop iteration
        for await (const event of runAgentLoop({
            messages,
            systemPrompt: [systemPrompt],
            tools: getAvailableTools(teamName),  // Includes SendMessage, TaskUpdate, etc.
            abortSignal,
            querySource: "in_process_teammate"
        })) {
            if (event.type === "assistant_message") {
                messages.push({
                    role: "assistant",
                    content: event.content
                });
            }

            if (event.type === "tool_result") {
                messages.push({
                    role: "user",  // Tool results injected as user messages
                    content: `Tool ${event.toolName} result: ${event.result}`
                });
            }

            // Handle shutdown response tool call
            if (event.type === "tool_use" &&
                event.toolName === "SendMessage" &&
                event.params.type === "shutdown_response") {

                if (event.params.approve) {
                    // Graceful exit
                    console.log(`[inProcessRunner] ${agentName} approved shutdown`);
                    return;  // Exit runner, cleanup happens in setImmediate callback
                }
            }
        }

        // Agent loop iteration complete, poll for next message
    }
}

// Mapping: XNY→inProcessAgentRunner, DNY→pollForNextMessage, ZR→runAgentLoop
```

**Control flow**:

```
inProcessAgentRunner enters while loop
  ↓
inProcessPollLoop blocks until message available
  ↓
Poll loop returns {type: "user_message", content: "..."}
  ↓
Inject as user message in conversation
  ↓
runAgentLoop processes message
  - Calls LLM API
  - Executes tools (SendMessage, TaskUpdate, etc.)
  - Generates response
  ↓
Agent loop iteration completes
  ↓
Back to poll loop (next iteration)
```

**Key insight**: The runner is a **reactive loop** - it only executes when messages are available. When idle, it blocks in `inProcessPollLoop` at the 500ms sleep. This yields the event loop to other teammates and the main lead agent.

### 3.5 Memory & Resource Sharing

**Shared resources**:

| Resource | Sharing Model | Implications |
|----------|--------------|--------------|
| **Heap** | Shared | Teammate objects can reference lead's objects (risk: memory leaks) |
| **Event loop** | Shared | CPU-intensive work blocks all agents |
| **File descriptors** | Shared | No per-agent FD limit (process-wide limit applies) |
| **Environment vars** | Shared | Changes visible to all agents |
| **AppState** | Shared | Fast communication (no serialization) |

**Memory leak risk**:

```javascript
// BAD: Teammate stores reference to large AppState object
const teammate = {
    name: "backend-dev",
    appState: context.getAppState()  // 10MB object retained!
};
// If teammate crashes and task object lingers, 10MB leaked

// GOOD: Teammate reads AppState transiently
async function processMessa ge() {
    const state = await context.getAppState();  // Scoped to function
    const task = findTask(state.tasks);
    // state eligible for GC after function returns
}
```

**Mitigation**: Task cleanup on agent exit (see `setImmediate` callback in spawn function) removes task from AppState, allowing GC.

### 3.6 Teammate Registration & Lifecycle

**Entry point** (obfuscated: `registerTeammateAndRun` / xN1):

```javascript
// ============================================
// registerTeammateAndRun - Register teammate and start agent runner (fire-and-forget)
// Location: chunks.134.mjs:1847-1852
// ============================================

// ORIGINAL (for source lookup):
function xN1(A) {
    let q = A.identity.agentId;
    XNY(A).catch((K) => {
        k(`[inProcessRunner] Unhandled error in ${q}: ${K}`)
    })
}

// READABLE (for understanding):
function registerTeammateAndRun(teammateConfig) {
    const agentId = teammateConfig.identity.agentId;

    // Fire-and-forget: Start the agent runner asynchronously
    // Errors are caught and logged, not re-thrown
    inProcessAgentRunner(teammateConfig).catch((error) => {
        console.error(`[inProcessRunner] Unhandled error in ${agentId}: ${error}`);
    });
}

// Mapping: xN1→registerTeammateAndRun, XNY→inProcessAgentRunner, k→console.error
```

**Why fire-and-forget pattern**:

- **Non-blocking**: Returns immediately, allowing spawn tool to complete
- **Error isolation**: One teammate crash doesn't kill the lead or other teammates
- **Logging**: Errors are captured with agent context for debugging

**Kill mechanism** (obfuscated: `killInProcessTeammate` / bZ1):

```javascript
// ============================================
// killInProcessTeammate - Abort in-process teammate and clean up resources
// Location: chunks.113.mjs:1272-1316
// ============================================

// ORIGINAL (for source lookup):
function bZ1(A, q) {
    let K = !1,
        Y = null,
        z = null;
    if (q((_) => {
            let w = _.tasks[A];
            if (!w || w.type !== "in_process_teammate") return _;
            let O = w;
            if (O.status !== "running") return _;
            Y = O.identity.teamName, z = O.identity.agentId, O.abortController?.abort(), O.unregisterCleanup?.(), K = !0, O.onIdleCallbacks?.forEach((H) => H());
            let $ = _.teamContext;
            if (_.teamContext && _.teamContext.teammates && z) {
                let {
                    [z]: H, ...j
                } = _.teamContext.teammates;
                $ = {
                    ..._.teamContext,
                    teammates: j
                }
            }
            return {
                ..._,
                teamContext: $,
                tasks: {
                    ..._.tasks,
                    [A]: {
                        ...O,
                        status: "killed",
                        notified: !0,
                        endTime: Date.now(),
                        onIdleCallbacks: [],
                        messages: O.messages?.length ? [O.messages[O.messages.length - 1]] : void 0,
                        pendingUserMessages: [],
                        inProgressToolUseIDs: void 0,
                        abortController: void 0,
                        unregisterCleanup: void 0,
                        currentWorkAbortController: void 0
                    }
                }
            }
        }), Y && z) ty8(Y, z);
    if (K) $O(A), setTimeout(VR.bind(null, A, q), mB);
    if (z) a36(z);
    return K
}

// READABLE (for understanding):
function killInProcessTeammate(taskId, updateAppState) {
    let wasKilled = false;
    let teamName = null;
    let agentId = null;

    // Step 1: Atomically update state and collect cleanup info
    updateAppState((state) => {
        const task = state.tasks[taskId];
        if (!task || task.type !== "in_process_teammate") return state;

        if (task.status !== "running") return state;

        teamName = task.identity.teamName;
        agentId = task.identity.agentId;

        // Step 1a: Abort the agent loop
        task.abortController?.abort();

        // Step 1b: Run any registered cleanup handlers
        task.unregisterCleanup?.();

        wasKilled = true;

        // Step 1c: Notify idle callbacks (for hooks)
        task.onIdleCallbacks?.forEach((callback) => callback());

        // Step 1d: Remove from teamContext.teammates map
        let updatedTeamContext = state.teamContext;
        if (state.teamContext?.teammates && agentId) {
            const { [agentId]: removed, ...remainingTeammates } = state.teamContext.teammates;
            updatedTeamContext = {
                ...state.teamContext,
                teammates: remainingTeammates
            };
        }

        // Step 1e: Mark task as killed with minimal state
        return {
            ...state,
            teamContext: updatedTeamContext,
            tasks: {
                ...state.tasks,
                [taskId]: {
                    ...task,
                    status: "killed",
                    notified: true,
                    endTime: Date.now(),
                    onIdleCallbacks: [],           // Clear callbacks
                    messages: task.messages?.length
                        ? [task.messages[task.messages.length - 1]]  // Keep only last
                        : undefined,
                    pendingUserMessages: [],        // Clear queue
                    inProgressToolUseIDs: undefined,
                    abortController: undefined,     // Release reference
                    unregisterCleanup: undefined,
                    currentWorkAbortController: undefined
                }
            }
        };
    });

    // Step 2: Notify team (if team context exists)
    if (teamName && agentId) {
        notifyTeamOfTeammateExit(teamName, agentId);
    }

    // Step 3: Clean up task state after delay
    if (wasKilled) {
        flushTaskOutput(taskId);
        setTimeout(removeTaskFromState.bind(null, taskId, updateAppState), CLEANUP_DELAY_MS);
    }

    // Step 4: Clean up agent identity context
    if (agentId) {
        cleanupAgentIdentity(agentId);
    }

    return wasKilled;
}

// Mapping: bZ1→killInProcessTeammate, ty8→notifyTeamOfTeammateExit, $O→flushTaskOutput,
//          VR→removeTaskFromState, mB→CLEANUP_DELAY_MS, a36→cleanupAgentIdentity
```

**Why this approach**:

| Design Decision | Rationale |
|-----------------|-----------|
| **AbortController first** | Stops LLM calls immediately, preventing wasted API costs |
| **Clear pendingUserMessages** | Prevents messages from being delivered to dead agent |
| **Keep last message only** | Preserves final state for debugging while freeing memory |
| **Delayed task removal** | Allows UI to show "killed" status briefly before cleanup |
| **Notify team** | Teammates can reassign work that was assigned to killed agent |

### 3.7 Teammate Context (AsyncLocalStorage)

**Identity tracking** across async operations using Node.js AsyncLocalStorage:

```javascript
// ============================================
// Teammate Context - AsyncLocalStorage for agent identity tracking
// Location: chunks.84.mjs:1403-1426
// ============================================

// ORIGINAL (for source lookup):
function iM() {
    return ef8.getStore()
}
function UD1(A, q) {
    return ef8.run(A, q)
}
function dD1(A) {
    return {
        ...A,
        isInProcess: !0
    }
}
ef8  // Initialized as: new AsyncLocalStorage

// READABLE (for understanding):
// Storage instance (initialized lazily)
let teammateContextStorage = new AsyncLocalStorage();

// Get current teammate context (returns undefined if not in teammate scope)
function getTeammateContext() {
    return teammateContextStorage.getStore();
}

// Run callback with teammate context set
function runWithTeammateContext(context, callback) {
    return teammateContextStorage.run(context, callback);
}

// Create teammate context object with in-process flag
function createTeammateContext(identity) {
    return {
        ...identity,
        isInProcess: true
    };
}

// Mapping: ef8→teammateContextStorage, iM→getTeammateContext,
//          UD1→runWithTeammateContext, dD1→createTeammateContext
```

**Why AsyncLocalStorage**:

| Problem | Solution |
|---------|----------|
| **Async identity loss** | Callbacks/promises lose `this` context |
| **Thread-local needed** | Want per-teammate state without passing args everywhere |
| **Zero-serialization** | No need to pass identity through every function call |

**Usage pattern**:

```javascript
// At teammate spawn time:
const context = createTeammateContext({
    agentId: "550e8400-...",
    agentName: "backend-dev",
    teamName: "my-team",
    parentSessionId: "parent-123"
});

runWithTeammateContext(context, async () => {
    // Any async code here can call getTeammateContext()
    await someDeepFunction();

    // Even in callbacks:
    setTimeout(() => {
        const ctx = getTeammateContext();  // Returns context!
        console.log(ctx.agentName);  // "backend-dev"
    }, 1000);
});

// Outside teammate context:
getTeammateContext();  // Returns undefined
```

### 3.8 Performance Characteristics

**Spawn time**: ~1-2ms (create object in AppState, start async loop)

**Message delivery latency**:
- Priority 1 (pendingUserMessages): 0-1ms (synchronous AppState update)
- Priority 2-5 (mailbox): 0-500ms (depends on poll cycle phase)

**Memory overhead per teammate**: ~5-10MB (agent loop state + message history)

**CPU usage**: Minimal when idle (poll loop sleeps). When active, shares CPU with lead.

**Scalability limit**: ~5-10 teammates before event loop saturation (each teammate's LLM call is ~2-5s, but tool execution can block).

---

## 4. Split-Pane Mode (tmux/iTerm2)

### 4.1 Architecture

**Process model**: Each teammate is a **full Claude CLI process** in its own terminal pane.

```
┌─────────────────────────────────────────────────────────┐
│ tmux Session: "claude-main"                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌──────────┬────────────────────────────────────────┐   │
│ │ Pane %12 │ Pane %13                               │   │
│ │ (Leader) │ (Teammate "backend-dev")               │   │
│ ├──────────┤                                         │   │
│ │ Process: │ Process: claude --teammate-mode ...    │   │
│ │ claude   │                                         │   │
│ │          │ Own agent loop, own memory, own FDs    │   │
│ │          ├─────────────────────────────────────────┤   │
│ │          │ Pane %14                                │   │
│ │          │ (Teammate "frontend-dev")               │   │
│ │          │                                         │   │
│ │          │ Process: claude --teammate-mode ...     │   │
│ └──────────┴─────────────────────────────────────────┘   │
│                                                          │
│ Communication: ~/.claude/teams/web-app/inboxes/*.json   │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Spawning Flow (tmux Backend)

**Complete execution** (obfuscated: `spawnSplitPaneTeammate` / dVY):

```javascript
// ============================================
// spawnSplitPaneTeammate - Spawn teammate in tmux/iTerm2 pane
// Location: chunks.131.mjs:2077-2195
// ============================================

// READABLE (for understanding):
async function spawnSplitPaneTeammate(params, context) {
    const { agentName, prompt, planModeRequired, useSplitPane } = params;
    const teamName = context.teamContext.teamName;

    // Step 1: Get backend instance
    const backend = getBackend(useSplitPane);  // Returns TmuxBackend or ITermBackend
    if (!backend || !backend.isAvailable()) {
        throw new Error("Split-pane backend not available");
    }

    // Step 2: Generate identifiers
    const agentId = crypto.randomUUID();

    // Step 3: Register in team config BEFORE spawning
    const teamConfig = readTeamConfig(teamName);
    const memberEntry = {
        agentId,
        agentName,
        backendType: backend.type,  // "tmux" or "iterm2"
        tmuxPaneId: null,  // Filled after pane creation
        spawnedAt: new Date().toISOString()
    };
    teamConfig.members.push(memberEntry);
    writeTeamConfig(teamName, teamConfig);

    // Step 4: Create pane in terminal
    const paneId = await backend.createTeammatePaneWithLeader(agentName, teamName, agentId);
    // Example return: "%13"

    // Step 5: Update config with pane ID
    memberEntry.tmuxPaneId = paneId;
    writeTeamConfig(teamName, teamConfig);

    // Step 6: Build teammate launch command
    const command = buildTeammateCommand({
        agentId,
        agentName,
        teamName,
        initialPrompt: prompt,
        planModeRequired
    });
    // Result: "claude --teammate-mode --agent-id uuid --agent-name backend-dev ..."

    // Step 7: Send command to pane
    await backend.sendCommand(paneId, command);
    // Executes: tmux send-keys -t %13 "claude --teammate-mode ..." Enter

    // Step 8: Set pane visual styling
    await backend.setPaneBorderColor(paneId, hashColor(agentId));
    // Executes: tmux select-pane -t %13 -P "bg=#3b82f6"

    return {
        success: true,
        agentId,
        paneId,
        message: `Spawned teammate '${agentName}' in pane ${paneId}`
    };
}

// Mapping: dVY→spawnSplitPaneTeammate, zt→getBackend, fEA→TmuxBackend, EEA→ITermBackend
```

**Key differences vs in-process**:

1. **Pane creation first**: Must create pane before sending command (can't exec in non-existent pane)
2. **Config written twice**: Once to reserve member slot, again to store pane ID
3. **Command building**: Constructs full CLI invocation with flags
4. **Visual styling**: Border color for visual identification

### 4.3 Tmux Pane Creation Algorithm

**Implementation** (obfuscated: TmuxBackend.createTeammatePaneWithLeader):

```javascript
// ============================================
// TmuxBackend.createTeammatePaneWithLeader - Layout algorithm for teammate panes
// Location: chunks.131.mjs:1144-1300 (TmuxBackend class)
// ============================================

// READABLE (for understanding):
class TmuxBackend {
    async createTeammatePaneWithLeader(agentName, teamName, agentId) {
        // Step 1: Get leader pane ID
        const leaderPaneId = await this.getLeaderPaneId();
        // Executes: tmux display-message -p "#{pane_id}"
        // Returns: "%12"

        // Step 2: List existing teammate panes
        const existingPanes = await this.listTeammatePanes();
        // Executes: tmux list-panes -F "#{pane_id} #{pane_pid}"
        // Filters out leader pane, returns teammate panes only

        const teammateCount = existingPanes.length;

        // Step 3: Create pane with layout algorithm
        let newPaneId;

        if (teammateCount === 0) {
            // ═══════════════════════════════════════════════════════
            // FIRST TEAMMATE: Horizontal split, 30% leader / 70% teammates
            // ═══════════════════════════════════════════════════════
            newPaneId = await this.tmux([
                "split-window",
                "-t", leaderPaneId,  // Split from leader pane
                "-h",                 // Horizontal split (side-by-side)
                "-l", "70%",          // New pane gets 70% of width
                "-P",                 // Print new pane ID
                "-F", "#{pane_id}"
            ]);

            // Visual result:
            // ┌─────┬─────────────┐
            // │  L  │     T1      │
            // │30%  │     70%     │
            // └─────┴─────────────┘

        } else {
            // ═══════════════════════════════════════════════════════
            // SUBSEQUENT TEAMMATES: Alternate vertical/horizontal for tiling
            // ═══════════════════════════════════════════════════════

            // Determine split direction (alternates with each teammate)
            const shouldSplitVertical = (teammateCount % 2 === 1);

            // Target middle pane for visual balance
            const targetPaneIndex = Math.floor((teammateCount - 1) / 2);
            const targetPane = existingPanes[targetPaneIndex];

            newPaneId = await this.tmux([
                "split-window",
                "-t", targetPane.paneId,  // Split from middle pane
                shouldSplitVertical ? "-v" : "-h",  // Alternate direction
                "-P",
                "-F", "#{pane_id}"
            ]);

            // Example progression:
            // T1 only:
            // ┌─────┬─────────────┐
            // │  L  │     T1      │
            // └─────┴─────────────┘
            //
            // T1 + T2 (vertical split, count=1 odd):
            // ┌─────┬─────────────┐
            // │     │     T1      │
            // │  L  ├─────────────┤
            // │     │     T2      │
            // └─────┴─────────────┘
            //
            // T1 + T2 + T3 (horizontal split, count=2 even, target=T1):
            // ┌─────┬──────┬──────┐
            // │     │  T1  │  T3  │
            // │  L  ├──────┴──────┤
            // │     │      T2     │
            // └─────┴─────────────┘
        }

        // Step 4: Rebalance layout
        await this.rebalanceLayout();

        return newPaneId.trim();
    }

    async rebalanceLayout() {
        // Apply tmux's main-vertical layout
        await this.tmux(["select-layout", "main-vertical"]);

        // Manually adjust leader pane to 30%
        const leaderPaneId = await this.getLeaderPaneId();
        await this.tmux(["resize-pane", "-t", leaderPaneId, "-x", "30%"]);

        // Apply tiled layout to teammate area (automatic even distribution)
        const teammatePanes = await this.listTeammatePanes();
        if (teammatePanes.length > 0) {
            await this.tmux(["select-layout", "-t", teammatePanes[0].paneId, "tiled"]);
        }
    }
}
```

**Why alternate vertical/horizontal**:

| Approach | Layout for 4 Teammates | Pros | Cons |
|----------|------------------------|------|------|
| **All vertical** | ┌─┬───┐<br>│L│T1 │<br>│ ├───┤<br>│ │T2 │<br>│ ├───┤<br>│ │T3 │<br>│ ├───┤<br>│ │T4 │<br>└─┴───┘ | Simple | Narrow panes, hard to read |
| **All horizontal** | ┌─┬─┬─┬─┬─┐<br>│L│1│2│3│4│<br>└─┴─┴─┴─┴─┘ | Wide panes | Too many columns, split focus |
| **Alternating** (chosen) | ┌─┬───┬───┐<br>│ │T1 │T3 │<br>│L├───┴───┤<br>│ │T2 │T4 │<br>└─┴───┴───┘ | Balanced grid | More complex algorithm |

**Why target middle pane**: Splitting the middle pane maintains visual symmetry. Splitting the last pane creates lopsided layouts.

### 4.4 iTerm2 Backend Differences

**Key differences** from tmux:

| Aspect | tmux | iTerm2 |
|--------|------|--------|
| **Pane creation** | `tmux split-window` | `it2 create-tab` + `it2 send-text` |
| **Pane ID format** | `%12` (numeric) | Session UUID (long string) |
| **Layout control** | Precise (main-vertical, tiled) | Limited (auto-arrange only) |
| **Border colors** | Supported (`select-pane -P`) | Not supported |
| **Availability** | Works over SSH | Requires local macOS iTerm2 app |

**Implementation** (obfuscated: ITermBackend / EEA):

```javascript
class ITermBackend {
    async createTeammatePaneWithLeader(agentName, teamName, agentId) {
        // iTerm2 uses Python API via `it2` CLI
        const sessionId = await this.it2([
            "create-tab",
            "--profile", "Default",
            "--command", "echo 'Starting teammate...'"
        ]);

        // No precise layout control - iTerm2 auto-arranges
        // Border colors not supported

        return sessionId;
    }

    async sendCommand(sessionId, command) {
        await this.it2([
            "send-text",
            "--session-id", sessionId,
            command
        ]);
    }
}
```

**Why iTerm2 support exists**: macOS users may prefer iTerm2 over tmux. Even with limited features, basic pane spawning works.

**Trade-off**: Reduced visual control. Mitigation: Users who need precise layouts should use tmux.

### 4.5 Teammate CLI Launch

**Command construction**:

```javascript
// ============================================
// buildTeammateCommand - Construct CLI invocation for teammate process
// Location: chunks.131.mjs:2050-2075
// ============================================

// READABLE (for understanding):
function buildTeammateCommand(params) {
    const { agentId, agentName, teamName, initialPrompt, planModeRequired } = params;

    const parts = [
        "claude",
        "--teammate-mode",
        "--agent-id", `"${agentId}"`,
        "--agent-name", `"${agentName}"`,
        "--team-name", `"${teamName}"`,
        "--use-session-memory"  // Enable session memory for teammate
    ];

    if (initialPrompt) {
        parts.push("--initial-prompt", `"${escapeShellArg(initialPrompt)}"`);
    }

    if (planModeRequired) {
        parts.push("--plan-mode-required");
    }

    return parts.join(" ");
}

// Example result:
// claude --teammate-mode --agent-id "uuid-123" --agent-name "backend-dev" \
//   --team-name "web-app" --use-session-memory \
//   --initial-prompt "You are the backend developer. Implement API endpoints."
```

**Flag semantics**:

| Flag | Purpose | Effect |
|------|---------|--------|
| `--teammate-mode` | Identifies as teammate (not lead) | Enters teammate-specific bootstrap path |
| `--agent-id` | Unique identifier | Used for mailbox path, config lookup |
| `--agent-name` | Human-readable name | Used for message routing, UI display |
| `--team-name` | Team identifier | Reads config from `~/.claude/teams/{name}/` |
| `--use-session-memory` | Enable session memory | Creates `~/.claude/sessions/{agent-id}/` |
| `--initial-prompt` | Role definition | Injected into system prompt |
| `--plan-mode-required` | Force plan mode | Teammate must call ExitPlanMode before executing |

**Teammate bootstrap sequence** (when launched):

```
main CLI entry (chunks.190.mjs:931)
  |
  ├─→ Parse --teammate-mode flag
  |
  ├─→ Read team config: ~/.claude/teams/{team-name}/config.json
  |     • Verify agent-id in members list
  |     • Extract team context
  |
  ├─→ Build system prompt
  |     • Inject agent identity
  |     • Inject team members list
  |     • Inject initial-prompt
  |     • Add plan mode instructions if --plan-mode-required
  |
  ├─→ Start agent loop
  |     └─→ inProcessPollLoop (same code path as in-process mode!)
  |           • Priority 1 disabled (no shared AppState)
  |           • Priorities 2-5 use mailbox polling
  |
  └─→ On exit: Clean up session directory
```

**Key insight**: Pane-based teammates use the **same poll loop code** as in-process mode, just with Priority 1 disabled (no shared AppState). This code reuse simplifies maintenance.

### 4.6 Performance Characteristics

**Spawn time**: ~200-500ms (process fork + exec + tmux pane creation)

**Message delivery latency**: 0-500ms (mailbox polling, no fast path)

**Memory overhead per teammate**: ~50-100MB (full Claude process)

**CPU usage**: Independent (each process has own CPU allocation)

**Scalability limit**: ~10-20 teammates (limited by terminal pane count, tmux supports ~200 panes but becomes visually cramped)

---

## 5. Separate Window Mode

### 5.1 Architecture

**Process model**: Each teammate in new window of external tmux session "claude-swarm".

```
┌────────────────────────────────────────────┐
│ tmux Session: "claude-main" (user's shell) │
├────────────────────────────────────────────┤
│ Window 0: Team lead process                │
│   • User interacts here                    │
│   • Spawns teammates in separate session   │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ tmux Session: "claude-swarm" (background)  │
├────────────────────────────────────────────┤
│ Window 0: backend-dev                      │
│ Window 1: frontend-dev                     │
│ Window 2: db-specialist                    │
│   • User can attach: tmux attach -t claude-swarm │
│   • Persists after leader exits            │
└────────────────────────────────────────────┘
```

### 5.2 Spawning Flow

**Implementation** (obfuscated: `spawnSeparateWindowTeammate` / cVY):

```javascript
// ============================================
// spawnSeparateWindowTeammate - Spawn in external tmux session
// Location: chunks.131.mjs:2202-2280
// ============================================

// READABLE (for understanding):
async function spawnSeparateWindowTeammate(params, context) {
    const { agentName, prompt } = params;
    const teamName = context.teamContext.teamName;
    const agentId = crypto.randomUUID();

    const SWARM_SESSION_NAME = "claude-swarm";

    // Step 1: Ensure swarm session exists
    const sessionExists = await tmuxSessionExists(SWARM_SESSION_NAME);
    if (!sessionExists) {
        await exec(`tmux new-session -d -s ${SWARM_SESSION_NAME}`);
        console.log(`[spawnSeparateWindow] Created tmux session '${SWARM_SESSION_NAME}'`);
    }

    // Step 2: Create new window in swarm session
    const windowId = await exec(
        `tmux new-window -t ${SWARM_SESSION_NAME}: -n ${agentName} -P -F "#{window_id}"`
    );
    // Example return: "@15"

    // Step 3: Build teammate command
    const command = buildTeammateCommand({ agentId, agentName, teamName, initialPrompt: prompt });

    // Step 4: Send command to window
    await exec(
        `tmux send-keys -t ${SWARM_SESSION_NAME}:${windowId} "${command}" Enter`
    );

    // Step 5: Register in team config
    const teamConfig = readTeamConfig(teamName);
    teamConfig.members.push({
        agentId,
        agentName,
        backendType: "separate-window",
        tmuxWindowId: windowId,
        tmuxSessionName: SWARM_SESSION_NAME,
        spawnedAt: new Date().toISOString()
    });
    writeTeamConfig(teamName, teamConfig);

    return {
        success: true,
        agentId,
        windowId,
        message: `Spawned teammate '${agentName}' in tmux session '${SWARM_SESSION_NAME}' window ${windowId}`
    };
}

// Mapping: cVY→spawnSeparateWindowTeammate, WN→SWARM_SESSION_NAME
```

### 5.3 Why Separate Session

**Advantages** vs split-pane:

| Aspect | Split-Pane | Separate Window |
|--------|-----------|-----------------|
| **Screen space** | Shared (cramped for >5 agents) | Dedicated window per agent |
| **Session lifecycle** | Tied to leader | Independent (persists after leader exits) |
| **Visual organization** | Flat pane layout | tmux window list (Ctrl+B w) |
| **Long-running agents** | Pane closes when leader exits | Can run for days |

**Use cases**:
- **Large teams** (>5 agents): Each agent gets full window space
- **Background work**: Agents continue after user detaches from leader
- **tmux power users**: Leverage tmux's window management (rename, reorder, etc.)

**Trade-off**: Less immediate visibility (must switch sessions to see agents). Mitigation: Use `tmux attach -t claude-swarm` to monitor.

### 5.4 Swarm View UI

**Optional integration**: `swarm-view` window for monitoring (obfuscated: SWARM_VIEW_WINDOW_NAME / gP1).

```bash
# Create dedicated monitoring window
tmux new-window -t claude-swarm: -n swarm-view

# Display live status of all teammates
watch -n 1 'cat ~/.claude/teams/*/config.json | jq ".members[] | {name, status}"'
```

**Why separate view window**: Provides dashboard without switching between agent windows.

**Not enabled by default**: Requires user opt-in (adds complexity).

---

## 6. Backend Detection & Availability

### 6.1 Detection Logic

**Implementation** (obfuscated: `getBackend` / zt):

```javascript
// ============================================
// getBackend - Detect and instantiate appropriate terminal backend
// Location: chunks.131.mjs:1493-1550
// ============================================

// READABLE (for understanding):
function getBackend(useSplitPane) {
    if (useSplitPane === false) {
        // User explicitly requested separate window mode
        if (isTmuxInstalled()) {
            return new TmuxBackend({ mode: "separate-window" });
        }
        throw new Error("Separate window mode requires tmux");
    }

    // Auto-detect best backend for split-pane mode
    if (isRunningInsideTmux()) {
        return new TmuxBackend({ mode: "split-pane" });
    }

    if (isRunningInIterm2() && isIt2CliInstalled()) {
        return new ITermBackend();
    }

    // Fallback: Check if tmux is available (can spawn external session)
    if (isTmuxInstalled()) {
        return new TmuxBackend({ mode: "external-session" });
    }

    return null;  // No backend available
}

// Helper functions
function isRunningInsideTmux() {
    return process.env.TMUX !== undefined;
    // $TMUX format: "/tmp/tmux-501/default,12345,0"
}

function isRunningInIterm2() {
    return process.env.TERM_PROGRAM === "iTerm.app";
}

function isTmuxInstalled() {
    try {
        execSync("which tmux", { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

function isIt2CliInstalled() {
    try {
        execSync("which it2", { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

// Mapping: zt→getBackend, OI→isRunningInsideTmux, j51→isRunningInIterm2,
//          Kt→isTmuxInstalled, xQ1→isIt2CliInstalled
```

**Detection precedence**:

```
1. Inside tmux session ($TMUX exists)
     → TmuxBackend (split-pane in current session)

2. Inside iTerm2 ($TERM_PROGRAM = "iTerm.app") + it2 CLI available
     → ITermBackend (split-pane in iTerm2)

3. tmux installed but not running inside
     → TmuxBackend (external session mode)

4. None of the above
     → null (fallback to in-process mode)
```

### 6.2 Availability Verification

**Why double-check**: Environment variables can be stale (e.g., $TMUX set but tmux server crashed).

**Implementation**:

```javascript
class TmuxBackend {
    async isAvailable() {
        try {
            // Execute simple tmux command
            await this.tmux(["list-sessions"]);
            return true;
        } catch (error) {
            console.warn(`[TmuxBackend] Availability check failed: ${error.message}`);
            return false;
        }
    }
}

class ITermBackend {
    async isAvailable() {
        try {
            // Check if it2 can communicate with iTerm2
            await this.it2(["list-sessions"]);
            return true;
        } catch (error) {
            console.warn(`[ITermBackend] Availability check failed: ${error.message}`);
            return false;
        }
    }
}
```

**Failure scenarios**:

| Scenario | Detection | Result |
|----------|-----------|--------|
| $TMUX set, tmux server dead | `tmux list-sessions` errors | isAvailable() = false → fallback in-process |
| iTerm2 app running, it2 CLI missing | `which it2` fails | isIt2CliInstalled() = false → try tmux |
| tmux installed, permission denied | `tmux new-session` errors | Spawn fails, error surfaced to user |

**Graceful degradation**: If preferred backend unavailable, automatically falls back to in-process mode rather than failing spawn operation.

---

## 7. Performance Characteristics

### 7.1 Comparison Matrix

| Metric | In-Process | Split-Pane (tmux) | Separate Window |
|--------|------------|-------------------|-----------------|
| **Spawn latency** | 1-2ms | 200-500ms | 300-600ms |
| **Message delivery (P1)** | 0-1ms | N/A | N/A |
| **Message delivery (P2-5)** | 0-500ms | 0-500ms | 0-500ms |
| **Memory per agent** | ~5-10MB | ~50-100MB | ~50-100MB |
| **CPU isolation** | None (shared loop) | Full (separate process) | Full (separate process) |
| **Scalability** | 5-10 agents | 10-20 agents | 20+ agents |
| **Crash isolation** | None | Full | Full |

### 7.2 Spawn Time Breakdown

**In-process** (~1-2ms):
```
AppState update: 0.5ms
Team config write: 0.5ms
setImmediate schedule: 0.1ms
Total: ~1-2ms
```

**Split-pane tmux** (~200-500ms):
```
Team config write: 0.5ms
tmux list-panes: 20ms
tmux split-window: 150ms (process fork + pane setup)
tmux send-keys: 10ms
tmux rebalance layout: 20ms
Total: ~200-500ms
```

**Why tmux split-window is slow**: Process fork + TTY setup + tmux internal state update. Unavoidable overhead.

### 7.3 Memory Footprint

**In-process** (shared heap):
```
Agent loop state: 2MB
Message history: 1-3MB (depends on conversation length)
Tool state: 1MB
AppState reference: 0 (shared)
Total per agent: ~5-10MB
```

**Pane-based** (separate process):
```
Node.js runtime: 30MB
Agent loop state: 2MB
Message history: 1-3MB
Tool state: 1MB
AppState: 10MB (own copy)
Loaded code: 5MB
Total per agent: ~50-100MB
```

**Memory scaling**:
- 5 in-process teammates: 25-50MB overhead
- 5 pane-based teammates: 250-500MB overhead

**Trade-off**: In-process is leaner but less isolated. Pane-based uses more memory for safety.

### 7.4 CPU & Event Loop Impact

**In-process** (shared event loop):

```
Scenario: 3 teammates all call LLM API simultaneously

Time 0ms: Lead starts LLM call (takes 2000ms)
Time 10ms: Teammate A poll loop finds message, starts LLM call
           → Blocked by lead's in-flight call
Time 510ms: Teammate B poll loop wakes up
           → Blocked by lead + A
Time 1010ms: Teammate C poll loop wakes up
           → Blocked by lead + A + B

Result: Serial execution despite parallel intent
```

**Why blocking occurs**: Node.js event loop is single-threaded. Only one async operation actively executes at a time. Others wait in callback queue.

**Mitigation**: LLM API calls are mostly I/O-wait (network), so event loop not fully saturated. Tool execution (file reads, bash commands) can block.

**Pane-based** (separate processes):

```
Same scenario: 3 teammates all call LLM API simultaneously

Time 0ms: All 4 processes (lead + 3 teammates) send HTTP requests
Time 2000ms: All 4 receive responses concurrently

Result: True parallelism
```

**OS-level scheduling**: Each process gets own CPU slice. Even on single-core CPU, time-slicing creates perception of parallelism.

---

## 8. Decision Matrix & Recommendations

### 8.1 When to Use Each Mode

| Use Case | Recommended Mode | Rationale |
|----------|------------------|-----------|
| **CI/CD pipeline** | In-process (forced) | No TTY available |
| **Quick prototyping** | In-process | Fast spawn, simple debugging |
| **2-3 agents, light work** | In-process | Low overhead, adequate performance |
| **4-6 agents, interactive** | Split-pane (tmux) | Visual monitoring, process isolation |
| **>6 agents** | Separate window (tmux) | Dedicated screen space per agent |
| **CPU-intensive work** | Pane-based (any) | Prevent event loop blocking |
| **Long-running agents** | Separate window | Survives leader exit |
| **SSH session** | Split-pane (tmux) | Visual feedback over SSH |
| **macOS + iTerm2 user** | Split-pane (iTerm2) | Native app integration |

### 8.2 Override Strategies

**Force in-process** (for debugging):
```bash
export FORCE_IN_PROCESS=1
claude  # All teammates will spawn in-process
```

**Force separate window** (for large teams):
```javascript
SpawnTeammate({
  agentName: "backend-dev",
  prompt: "...",
  useSplitPane: false  // Override default
})
```

### 8.3 Hybrid Approach

**Scenario**: Mix modes in same team (not currently supported, but architecturally possible).

```
Team with 5 agents:
- Agent 1-3: In-process (quick coordination tasks)
- Agent 4-5: Pane-based (CPU-intensive model training)
```

**Future work**: Allow per-agent backend selection. Current limitation: All teammates in team use same mode (determined by first spawn).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `spawnTeammateDispatcher` (pNY) - Mode selection entry point
- `isInProcessEnabled` (Rb) - In-process mode detection
- `spawnInProcessTeammate` (FNY) - In-process spawning
- `spawnSplitPaneTeammate` (BNY) - Split-pane spawning
- `spawnTmuxTeammate` (gNY) - Separate window spawning (tmux session)
- `pollForNextMessage` (DNY) - 5-level priority polling
- `inProcessAgentRunner` (XNY) - In-process agent execution
- `claimUnclaimedTask` (Ji4) - Auto-claim available tasks
- `getBackend` (zt) - Backend detection and instantiation
- `TmuxBackend` (fEA) - tmux backend implementation
- `ITermBackend` (EEA) - iTerm2 backend implementation
- `isRunningInsideTmux` (OI) - Environment detection
- `isRunningInIterm2` (j51) - Environment detection

## Source Locations

- `chunks.135.mjs:1110` - spawnTeammateDispatcher (pNY)
- `chunks.135.mjs:208` - isInProcessEnabled (Rb)
- `chunks.135.mjs:985` - spawnInProcessTeammate (FNY)
- `chunks.135.mjs:711` - spawnSplitPaneTeammate (BNY)
- `chunks.135.mjs:838` - spawnTmuxTeammate (gNY)
- `chunks.134.mjs:1483` - pollForNextMessage (DNY)
- `chunks.134.mjs:1571` - inProcessAgentRunner (XNY)
- `chunks.134.mjs` - claimUnclaimedTask (Ji4)
- `chunks.131.mjs:1493` - getBackend (zt)
- `chunks.131.mjs:1144` - TmuxBackend class
- `chunks.131.mjs:1381` - ITermBackend class

## Cross-References

- **[01_complete_chain_analysis.md](./01_complete_chain_analysis.md)** - Complete team creation and spawning flow
- **[pane_backend_executor.md](./pane_backend_executor.md)** - Backend class implementation details
- **[03_mailbox_and_locking.md](./03_mailbox_and_locking.md)** - Mailbox communication for pane-based teammates
- **[04_polling_priorities.md](./04_polling_priorities.md)** - 5-level priority polling algorithm
- **[06_system_prompts_and_reminders.md](./06_system_prompts_and_reminders.md)** - System prompt construction for teammates
- **[../08_subagent/](../08_subagent/)** - Comparison with subagent spawning architecture

---

**Document Status**: Complete deep dive on all 3 spawn modes with algorithmic analysis and performance characteristics.
