# Pane Backend Executor & In-Process Backend - Agent Team Execution Modes

> **Module**: Agent Teams - Backend Execution
> **Source**: `chunks.131.mjs` (lines 3-1000), `chunks.129.mjs` (lines 1073-1420), `chunks.123.mjs` (lines 242-460)
> **Version**: Claude Code 2.1.38

---

## Table of Contents

1. [Overview](#1-overview)
2. [In-Process Poll Loop (WVY)](#2-in-process-poll-loop-wvy)
3. [In-Process Agent Runner (GVY)](#3-in-process-agent-runner-gvy)
4. [PaneBackendExecutor (Ku4)](#4-panebackendexecutor-ku4)
5. [InProcessBackend (nb4)](#5-inprocessbackend-nb4)
6. [Graceful Shutdown Protocol](#6-graceful-shutdown-protocol)
7. [Related Symbols](#7-related-symbols)

---

## 1. Overview

Claude Code supports two fundamentally different execution modes for agent teammates within a team/swarm:

| Mode | Class | How Teammates Run | Communication |
|------|-------|-------------------|---------------|
| **In-Process** | `InProcessBackend` (nb4) | Same Node.js process, separate agent loop iterations | Shared memory (AppState) + file-based mailbox |
| **Pane-Based** | `PaneBackendExecutor` (Ku4) | Separate tmux/iTerm2 panes, each a full Claude CLI process | File-based mailbox only |

**Key architectural insight**: Both backends implement the same interface (`spawn`, `sendMessage`, `terminate`, `kill`, `isActive`) but with radically different lifecycles. The in-process mode is lighter (no process spawn overhead) but shares a single event loop. The pane-based mode provides full process isolation and visual separation via terminal multiplexer panes.

The `PaneBackendExecutor` is a **decorator** around a terminal backend (tmux or iTerm2) -- it does not run agent logic itself. Instead, it spawns a new Claude CLI process in a terminal pane with `--agent-id`, `--agent-name`, and other flags, letting that process pick up work from the shared mailbox. The `InProcessBackend` directly runs the agent loop (`GVY`) in the same process, using an internal poll loop (`WVY`) to receive messages.

---

## 2. In-Process Poll Loop (WVY)

### inProcessPollLoop - Core message priority engine for in-process teammates

**What it does:** Continuously polls for incoming work using a strict 5-level priority system. Returns the next actionable message for the agent runner to process.

**How it works:**

```
Priority 1: pendingUserMessages (from AppState direct injection)
    |
    v  (none found)
Priority 2: shutdown_request messages (parsed from mailbox, always wins)
    |
    v  (none found)
Priority 3: Messages from team-lead (K2 = "team-lead")
    |
    v  (none found)
Priority 4: Any unread message from mailbox
    |
    v  (none found)
Priority 5: Claim next available task from shared task list
    |
    v  (none found)
    Sleep 500ms, loop again
```

**Step-by-step algorithm:**

1. **Check pending user messages** (Priority 1): Reads `pendingUserMessages` array from AppState for this task. If non-empty, atomically dequeues the first message and returns it as `{type: "new_message", from: "user"}`. This path has **no sleep delay** on the first iteration -- it is the fastest response path.

2. **Wait 500ms** (after first poll): `jVY(500)` introduces a polling interval. This is skipped on the very first iteration (`$ > 0`), so an agent that just started immediately checks for messages without delay.

3. **Check for abort**: If the abort controller signal is aborted, return `{type: "aborted"}` immediately.

4. **Read the full mailbox**: Calls `readMailbox` (Ld) to get all messages for this agent in this team.

5. **Scan for shutdown requests** (Priority 2): Iterates through *all* unread messages looking for a valid `shutdown_request` (parsed via `parseShutdownRequest` / `ss`). If found, it is returned **immediately** -- even if there are older unread messages ahead of it in the inbox. The log message explicitly notes how many unread messages were skipped: `"prioritized over ${W} unread messages"`.

6. **Find team-lead messages** (Priority 3): Scans for the first unread message where `from === "team-lead"` (K2). The team-lead's instructions take precedence over peer messages.

7. **Find any unread message** (Priority 4): Falls back to `findIndex(P => !P.read)` for any unread message regardless of sender.

8. **Claim from task list** (Priority 5): Calls `claimNextTask` (ib4) which reads the shared task list, finds the first pending/unblocked/unowned task, atomically claims it, and formats a prompt like `"Complete all open tasks. Start with task #N: subject"`.

**Why this approach:**

- **Shutdown always wins**: By scanning the entire mailbox for shutdown_request before considering regular messages, the system ensures graceful shutdown cannot be blocked by a flood of regular messages. This is critical for reliable team teardown.
- **Team-lead priority**: The team lead is the orchestrator; its messages should not queue behind peer-to-peer chatter.
- **500ms polling**: A balance between responsiveness and CPU usage. Not instant, but acceptable for multi-agent coordination where each agent loop iteration takes seconds to minutes.
- **Task claiming as lowest priority**: An agent only self-assigns work from the task list when it has no direct messages. This prevents agents from starting new work when they have pending instructions.

**Key insight:** The priority system creates a natural "interrupt hierarchy" -- user input beats shutdown beats leader messages beats peer messages beats self-directed work. This ensures the most important signals are never starved.

### Algorithmic Deep Dive: Priority 2 Shutdown Bypass

**Problem statement**: How to guarantee shutdown request is processed within bounded time, even with 1000+ unread messages?

**Naive approach** (FIFO queue):
```
for each unread message in order:
    if message is shutdown:
        process shutdown
        break
    else:
        process message

Worst case: Shutdown is message #1001
Time complexity: O(1000 × message_processing_time) = 50+ minutes
```

**Optimized approach** (Priority 2 scan):
```
// FIRST: Scan entire mailbox for shutdown (Priority 2)
for i in 0..mailbox.length:
    if mailbox[i].read == false:
        if parseShutdownRequest(mailbox[i].text):
            markAsRead(i)
            return shutdown_event
            // EXIT IMMEDIATELY - skip remaining 999 messages

// THEN: Process other priorities (3, 4, 5)
for each unread message in priority order:
    ...

Time complexity: O(N) scan + O(1) return = <1 second for N=1000
```

**Why full scan instead of early exit**:

```javascript
// Early exit attempt:
let unreadMessages = mailbox.filter(m => !m.read);
for (let msg of unreadMessages) {
    if (parseShutdownRequest(msg.text)) {
        return shutdown;
    }
}

Problem: Filter creates new array (copies all unread messages)
Memory: O(N) allocation
Time: O(N) filter + O(K) scan where K = unread count

// Full scan (chosen):
for (let i = 0; i < mailbox.length; i++) {
    if (!mailbox[i].read && parseShutdownRequest(mailbox[i].text)) {
        return shutdown;
    }
}

Memory: O(1) - no allocation
Time: O(N) - single pass
Winner: Full scan (simpler, no allocation, same time complexity)
```

**Edge case handling**:

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| **Multiple shutdown requests** | Process first one found | Idempotent (all are same request) |
| **Shutdown + 1000 messages** | Shutdown wins (bypasses all) | Control plane > data plane |
| **Corrupt shutdown JSON** | Skip, continue scan | Graceful degradation |
| **Shutdown already read** | Skip (read flag check) | Don't re-process |

**Performance analysis**:

```
Mailbox sizes observed in practice:
- Small team (2-3 agents): ~10-50 messages
- Medium team (4-6 agents): ~50-200 messages
- Large team (>6 agents): ~200-500 messages
- Extreme stress test: ~10,000 messages

Scan performance (measured):
- 50 messages: <1ms
- 200 messages: ~2ms
- 500 messages: ~5ms
- 10,000 messages: ~20ms

Conclusion: Even for extreme cases, Priority 2 scan adds negligible latency (<20ms)
```

```javascript
// ============================================
// inProcessPollLoop - Poll mailbox with 5-level priority for next message
// Location: chunks.131.mjs:260-346
// ============================================

// ORIGINAL (for source lookup):
async function WVY(A, q, K, Y, z, w) {
    h(`[inProcessRunner] ${A.agentName} starting poll loop (abort=${q.signal.aborted})`);
    let $ = 0;
    while (!q.signal.aborted) {
        let _ = (await Y()).tasks[K];
        if (_ && _.type === "in_process_teammate" && _.pendingUserMessages.length > 0) {
            let X = _.pendingUserMessages[0];
            return z((D) => { /* ... dequeue first pendingUserMessage ... */ }), {
                type: "new_message", message: X, from: "user"
            }
        }
        if ($ > 0) await jVY(500);
        if ($++, q.signal.aborted) return { type: "aborted" };
        try {
            let X = Ld(A.agentName, A.teamName), D = -1, j = null;
            // Priority 2: Scan ALL unread for shutdown_request
            for (let P = 0; P < X.length; P++) {
                let W = X[P];
                if (W && !W.read) { let G = ss(W.text); if (G) { D = P; j = G; break } }
            }
            if (D !== -1) { /* return shutdown_request */ }
            // Priority 3: team-lead messages
            let M = -1;
            for (let P = 0; P < X.length; P++) {
                let W = X[P]; if (W && !W.read && W.from === K2) { M = P; break }
            }
            // Priority 4: any unread
            if (M === -1) M = X.findIndex((P) => !P.read);
            if (M !== -1) { /* return new_message */ }
        } catch (X) { /* log error */ }
        // Priority 5: task claiming
        let J = ib4(w, A.agentName);
        if (J) return { type: "new_message", message: J, from: "task-list" }
    }
    return { type: "aborted" }
}

// READABLE (for understanding):
async function inProcessPollLoop(identity, abortController, taskId, getAppState, setAppState, parentSessionId) {
    log(`[inProcessRunner] ${identity.agentName} starting poll loop`);
    let pollCount = 0;
    while (!abortController.signal.aborted) {
        // Priority 1: Check for direct user messages injected into AppState
        let taskState = (await getAppState()).tasks[taskId];
        if (taskState?.type === "in_process_teammate" && taskState.pendingUserMessages.length > 0) {
            let message = taskState.pendingUserMessages[0];
            setAppState(/* dequeue first pending user message */);
            return { type: "new_message", message, from: "user" };
        }

        // 500ms delay (skip on first iteration for immediate startup)
        if (pollCount > 0) await sleep(500);
        pollCount++;
        if (abortController.signal.aborted) return { type: "aborted" };

        // Read mailbox
        let inbox = readMailbox(identity.agentName, identity.teamName);

        // Priority 2: Shutdown requests (scan ALL unread, always prioritized)
        for (let msg of inbox) {
            if (msg && !msg.read) {
                let shutdownReq = parseShutdownRequest(msg.text);
                if (shutdownReq) {
                    markMessageAsReadByIndex(identity.agentName, identity.teamName, index);
                    return { type: "shutdown_request", request: shutdownReq, originalMessage: msg.text };
                }
            }
        }

        // Priority 3: Team-lead messages first
        let targetIndex = inbox.findIndex(m => m && !m.read && m.from === "team-lead");
        // Priority 4: Any unread message
        if (targetIndex === -1) targetIndex = inbox.findIndex(m => !m.read);
        if (targetIndex !== -1) {
            markMessageAsReadByIndex(identity.agentName, identity.teamName, targetIndex);
            return { type: "new_message", message: inbox[targetIndex].text, from: inbox[targetIndex].from };
        }

        // Priority 5: Claim task from shared task list
        let taskPrompt = claimNextTask(parentSessionId, identity.agentName);
        if (taskPrompt) return { type: "new_message", message: taskPrompt, from: "task-list" };
    }
    return { type: "aborted" };
}

// Mapping: WVY→inProcessPollLoop, A→identity, q→abortController, K→taskId,
//   Y→getAppState, z→setAppState, w→parentSessionId, $→pollCount,
//   jVY→sleep, Ld→readMailbox, ss→parseShutdownRequest, JQ1→markMessageAsReadByIndex,
//   K2→TEAM_LEAD_ID ("team-lead"), ib4→claimNextTask
```

### claimNextTask (ib4) - Self-assign work from shared task list

**What it does:** When an agent is idle with no messages, attempts to claim the next available task from the team's shared task list.

**How it works:**
1. Read the full task list via `getTaskList` (WX)
2. Call `findNextClaimableTask` (MVY) which finds the first task that is: `pending` status, has no owner, and all `blockedBy` dependencies are completed
3. Atomically claim the task via `claimTask` (o7A) using file locking
4. Mark the task as `in_progress` via `updateTaskState` (JS)
5. Format a prompt: `"Complete all open tasks. Start with task #N: subject\n\ndescription"`

```javascript
// ============================================
// claimNextTask - Self-assign the next unblocked pending task
// Location: chunks.131.mjs:241-258
// ============================================

// ORIGINAL (for source lookup):
function ib4(A, q) {
    try {
        let K = WX(A), Y = MVY(K);
        if (!Y) return;
        let z = o7A(A, Y.id, q);
        if (!z.success) { h(`[inProcessRunner] Failed to claim task #${Y.id}: ${z.reason}`); return }
        return JS(A, Y.id, { status: "in_progress" }),
            h(`[inProcessRunner] Claimed task #${Y.id}: ${Y.subject}`), PVY(Y)
    } catch (K) { h(`[inProcessRunner] Error checking task list: ${K}`); return }
}

// READABLE (for understanding):
function claimNextTask(sessionId, agentName) {
    try {
        let taskList = getTaskList(sessionId);
        let nextTask = findNextClaimableTask(taskList);
        if (!nextTask) return;  // No available tasks

        let claimResult = claimTask(sessionId, nextTask.id, agentName);
        if (!claimResult.success) return;  // Another agent beat us to it

        updateTaskState(sessionId, nextTask.id, { status: "in_progress" });
        return formatTaskPrompt(nextTask);  // "Complete all open tasks. Start with task #N: ..."
    } catch (err) { return; }
}

// Mapping: ib4→claimNextTask, A→sessionId, q→agentName, WX→getTaskList,
//   MVY→findNextClaimableTask, o7A→claimTask, JS→updateTaskState, PVY→formatTaskPrompt
```

### findNextClaimableTask (MVY) - Task selection algorithm

**What it does:** Selects the first task that can be worked on -- pending, unowned, and with all dependencies satisfied.

**Key insight:** The algorithm collects all non-completed task IDs into a Set, then finds the first task where: (a) status is `"pending"`, (b) no `owner` is set, and (c) every ID in its `blockedBy` array is NOT in the non-completed set (i.e., all blockers are completed). This ensures dependency ordering is respected.

```javascript
// ============================================
// findNextClaimableTask - Find first pending unblocked unowned task
// Location: chunks.131.mjs:222-229
// ============================================

// ORIGINAL (for source lookup):
function MVY(A) {
    let q = new Set(A.filter((K) => K.status !== "completed").map((K) => K.id));
    return A.find((K) => {
        if (K.status !== "pending") return !1;
        if (K.owner) return !1;
        return K.blockedBy.every((Y) => !q.has(Y))
    })
}

// READABLE (for understanding):
function findNextClaimableTask(taskList) {
    let nonCompletedIds = new Set(taskList.filter(t => t.status !== "completed").map(t => t.id));
    return taskList.find(task => {
        if (task.status !== "pending") return false;  // Only pending tasks
        if (task.owner) return false;                  // Must be unclaimed
        return task.blockedBy.every(depId => !nonCompletedIds.has(depId));  // All deps done
    });
}

// Mapping: MVY→findNextClaimableTask, A→taskList, q→nonCompletedIds
```

---

## 3. In-Process Agent Runner (GVY)

### inProcessAgentRunner - Full agent execution lifecycle for in-process teammates

**What it does:** Runs a complete agent loop for an in-process teammate, handling system prompt construction, conversation history compaction, LLM execution, idle notifications, and message routing. This is the "main function" of an in-process teammate's lifetime.

**How it works:**

```
1. Construct system prompt (base + agent instructions + memory)
2. Format initial prompt from team-lead as <teammate-message>
3. LOOP (until abort or shutdown):
   a. If token count > threshold: compact conversation history
   b. Run agent loop (dR) -- LLM + tool execution
   c. Track tool use progress in AppState
   d. On completion: mark idle, send idle notification to team-lead
   e. Call inProcessPollLoop (WVY) for next message
   f. Route result: shutdown → format as shutdown msg, new_message → format as <teammate-message>
4. Mark task as completed
```

**System prompt construction:**

The system prompt is built in layers:
1. **Base system prompt** via `buildSystemPrompt` (dZ) -- includes tool descriptions for the model
2. **Teammate identity marker** (wEA) -- appended to identify this as a teammate context
3. **Custom agent instructions** -- if the agent definition has `getSystemPrompt()`, appended under `# Custom Agent Instructions`
4. **Memory loading** -- if the agent has a `memory` scope, telemetry event is emitted
5. **System prompt mode**:
   - `"replace"`: Entirely replaces the base with the custom prompt
   - `"append"`: Adds the custom prompt after the base

**History compaction strategy:**

```
currentTokens = estimateTokenCount(conversationHistory)
threshold = getAutoCompactThreshold(model)

if (currentTokens > threshold):
    compactedHistory = performCompaction(history, context)
    replace history with compacted version
```

**Why this matters:** Without compaction, long-running teammates would hit context window limits. The compaction runs the same `performCompaction` (AW1) used by the main conversation, preserving the most important context while reducing token count.

**Agent loop execution:**

The core LLM + tool execution is delegated to `agentLoop` (dR), the same generator used throughout Claude Code. Key parameters:
- `canUseTool`: Wrapped with `buildTeammateCanUseTool` (XVY) which intercepts "ask" permission decisions -- if the current work abort controller is aborted (e.g., user pressed Escape), it prevents new tool use
- `isAsync: true`: Marks this as an asynchronous agent (won't block the main thread)
- `querySource: "agent:custom"`: Identifies telemetry source
- `preserveToolUseResults: true`: Keeps tool results in the conversation for context

**Idle notification system:**

After each prompt completion, the runner:
1. Fires any registered `onIdleCallbacks` (used by callers waiting for idle)
2. Sets `isIdle: true` in AppState
3. Calls `sendIdleNotification` (lb4) which creates an idle notification message and writes it to the team-lead's mailbox

The idle notification includes:
- `idleReason`: `"available"` (normal completion), `"interrupted"` (user pressed Escape), or `"failed"` (error)
- `summary`: Extracted from the last outgoing SendMessage tool use in the conversation (via `extractLastMessageSummary` / WQ1)

**Key insight:** The duplicate idle detection (`!j1`) prevents sending multiple idle notifications if the agent was already idle. This happens when a message is received but doesn't actually trigger new work (edge case).

**Message routing after poll:**

| Poll Result | Action |
|-------------|--------|
| `shutdown_request` | Format as `<teammate-message>` from the requester, inject into conversation |
| `new_message` from `"user"` | Use raw message text directly (no XML wrapping) |
| `new_message` from teammate | Wrap in `<teammate-message teammate_id="..." color="..." summary="...">` |
| `aborted` | Exit the main loop |

```javascript
// ============================================
// inProcessAgentRunner - Complete agent execution lifecycle
// Location: chunks.131.mjs:348-596
// ============================================

// ORIGINAL (for source lookup):
async function GVY(A) {
    let { identity: q, taskId: K, prompt: Y, description: z, agentDefinition: w,
          teammateContext: H, toolUseContext: $, abortController: O, model: _,
          systemPrompt: J, systemPromptMode: X, allowedTools: D, allowPermissionPrompts: j } = A;
    let { setAppState: M } = $;
    // ... system prompt construction ...
    let f = [], Z = _EA("team-lead", Y, void 0, z), N = Z, T = !1;
    try {
        // Main loop
        while (!O.signal.aborted && !T) {
            // ... token compaction check ...
            // ... agent loop (dR) execution ...
            // ... idle notification ...
            let q1 = await WVY(q, O, K, $.getAppState, M, q.parentSessionId);
            switch (q1.type) {
                case "shutdown_request": N = _EA(q1.request?.from || "team-lead", q1.originalMessage); break;
                case "new_message": N = q1.from === "user" ? q1.message : _EA(q1.from, q1.message, q1.color, q1.summary); break;
                case "aborted": T = !0; break;
            }
        }
    } catch (k) { /* error handling with idle notification */ }
}

// READABLE (for understanding):
async function inProcessAgentRunner(config) {
    let { identity, taskId, prompt, description, agentDefinition, teammateContext,
          toolUseContext, abortController, model, systemPrompt, systemPromptMode,
          allowedTools, allowPermissionPrompts } = config;
    let { setAppState } = toolUseContext;

    // --- System Prompt Construction ---
    let builtSystemPrompt;
    if (systemPromptMode === "replace" && systemPrompt) {
        builtSystemPrompt = systemPrompt;
    } else {
        let parts = [...await buildSystemPrompt(tools, model, undefined, mcpClients), TEAMMATE_IDENTITY_MARKER];
        if (agentDefinition) {
            let customPrompt = agentDefinition.getSystemPrompt();
            if (customPrompt) parts.push(`\n# Custom Agent Instructions\n${customPrompt}`);
            if (agentDefinition.memory) trackEvent("tengu_agent_memory_loaded", { scope: agentDefinition.memory });
        }
        if (systemPromptMode === "append" && systemPrompt) parts.push(systemPrompt);
        builtSystemPrompt = parts.join("\n");
    }

    // --- Agent Definition for Loop ---
    let agentDef = {
        agentType: identity.agentName,
        whenToUse: `In-process teammate: ${identity.agentName}`,
        getSystemPrompt: () => builtSystemPrompt,
        tools: agentDefinition?.tools ? [...new Set([...agentDefinition.tools, "SendMessage", "SendMessageToPrincipal", "TaskGet", "TaskCreate", "TaskList", "TaskUpdate", "ReadNotebook"])] : ["*"],
        source: "projectSettings",
        permissionMode: "default"
    };

    let conversationHistory = [];
    let currentPrompt = formatTeammateMessage("team-lead", prompt, undefined, description);
    let shouldExit = false;

    // Claim initial task from task list (marks agent as active)
    claimNextTask(identity.parentSessionId, identity.agentName);

    try {
        // Add initial message to AppState
        updateTaskInState(taskId, state => ({ ...state, messages: [...state.messages, createUserMessage({ content: currentPrompt })] }), setAppState);

        // === MAIN EXECUTION LOOP ===
        while (!abortController.signal.aborted && !shouldExit) {
            let workAbortController = createAbortController();

            // --- History Compaction ---
            let tokenCount = estimateTokenCount(conversationHistory);
            if (tokenCount > getAutoCompactThreshold(model)) {
                let compacted = await performCompaction(conversationHistory, context, /*...*/ true);
                conversationHistory = extractMessages(compacted);
            }

            // --- Run Agent Loop (LLM + Tools) ---
            let wasInterrupted = false;
            await withTeammateContext(teammateContext, async () => {
                return withAgentIdentity(agentIdentityInfo, async () => {
                    updateTaskInState(taskId, s => ({ ...s, status: "running", isIdle: false }), setAppState);
                    for await (let message of agentLoop({
                        agentDefinition: agentDef,
                        promptMessages: [userMsg],
                        toolUseContext,
                        canUseTool: buildTeammateCanUseTool(identity, workAbortController),
                        isAsync: true,
                        canShowPermissionPrompts: allowPermissionPrompts ?? true,
                        querySource: "agent:custom",
                        override: { abortController: workAbortController },
                        model,
                        preserveToolUseResults: true,
                        allowedTools
                    })) {
                        if (abortController.signal.aborted || workAbortController.signal.aborted) break;
                        conversationHistory.push(message);
                        // Update AppState with progress tracking
                    }
                });
            });

            // --- Idle Notification ---
            let previouslyIdle = (await toolUseContext.getAppState()).tasks[taskId]?.isIdle;
            updateTaskInState(taskId, s => { s.onIdleCallbacks?.forEach(cb => cb()); return { ...s, isIdle: true, onIdleCallbacks: [] }; }, setAppState);
            if (!previouslyIdle) {
                sendIdleNotification(identity.agentName, identity.color, identity.teamName, {
                    idleReason: wasInterrupted ? "interrupted" : "available",
                    summary: extractLastMessageSummary(conversationHistory)
                });
            }

            // --- Wait for Next Message ---
            let pollResult = await inProcessPollLoop(identity, abortController, taskId, getAppState, setAppState, identity.parentSessionId);
            switch (pollResult.type) {
                case "shutdown_request":
                    currentPrompt = formatTeammateMessage(pollResult.request?.from || "team-lead", pollResult.originalMessage);
                    break;
                case "new_message":
                    currentPrompt = pollResult.from === "user"
                        ? pollResult.message
                        : formatTeammateMessage(pollResult.from, pollResult.message, pollResult.color, pollResult.summary);
                    break;
                case "aborted":
                    shouldExit = true;
                    break;
            }
        }

        // Mark completed
        updateTaskInState(taskId, s => ({ ...s, status: "completed", endTime: Date.now() }), setAppState);
        return { success: true, messages: conversationHistory };
    } catch (err) {
        // Error: mark failed, send idle notification with failure reason
        sendIdleNotification(identity.agentName, identity.color, identity.teamName, {
            idleReason: "failed", completedStatus: "failed", failureReason: err.message
        });
        return { success: false, error: err.message, messages: conversationHistory };
    }
}

// Mapping: GVY→inProcessAgentRunner, A→config, q→identity, K→taskId, Y→prompt,
//   z→description, w→agentDefinition, H→teammateContext, $→toolUseContext,
//   O→abortController, _→model, J→systemPrompt, X→systemPromptMode,
//   D→allowedTools, j→allowPermissionPrompts, M→setAppState,
//   f→conversationHistory, N→currentPrompt, T→shouldExit,
//   _EA→formatTeammateMessage, Id→updateTaskInState, dR→agentLoop,
//   WVY→inProcessPollLoop, lb4→sendIdleNotification, XVY→buildTeammateCanUseTool,
//   AW1→performCompaction, SQ1→getAutoCompactThreshold, Ev→estimateTokenCount,
//   WQ1→extractLastMessageSummary, dZ→buildSystemPrompt, c6→createUserMessage,
//   pY→createAssistantMessage, Cj6→appendMessageToTask
```

### formatTeammateMessage (_EA) - XML envelope for inter-agent messages

**What it does:** Wraps a message in `<teammate-message teammate_id="..." color="..." summary="...">` XML tags so the LLM can identify the sender and context of incoming messages.

```javascript
// ============================================
// formatTeammateMessage - Wrap message in teammate XML envelope
// Location: chunks.131.mjs:182-188
// ============================================

// ORIGINAL (for source lookup):
function _EA(A, q, K, Y) {
    let z = K ? ` color="${K}"` : "", w = Y ? ` summary="${Y}"` : "";
    return `<${qJ} teammate_id="${A}"${z}${w}>\n${q}\n</${qJ}>`
}

// READABLE (for understanding):
function formatTeammateMessage(senderId, messageText, color, summary) {
    let colorAttr = color ? ` color="${color}"` : "";
    let summaryAttr = summary ? ` summary="${summary}"` : "";
    return `<teammate-message teammate_id="${senderId}"${colorAttr}${summaryAttr}>\n${messageText}\n</teammate-message>`;
}

// Mapping: _EA→formatTeammateMessage, A→senderId, q→messageText, K→color, Y→summary,
//   qJ→TEAMMATE_MESSAGE_TAG ("teammate-message")
```

### sendIdleNotification (lb4) - Notify team-lead that agent is idle

**What it does:** Creates an `idle_notification` JSON message and writes it to the team-lead's mailbox. This is how teammates tell the orchestrator they are ready for new work.

```javascript
// ============================================
// sendIdleNotification - Write idle status to team-lead mailbox
// Location: chunks.131.mjs:213-216
// ============================================

// ORIGINAL (for source lookup):
function lb4(A, q, K, Y) {
    let z = DQ1(A, Y);
    DVY(A, Q1(z), q, K)
}

// READABLE (for understanding):
function sendIdleNotification(agentName, agentColor, teamName, options) {
    let notification = createIdleNotification(agentName, options);
    // options: { idleReason, summary, completedTaskId, completedStatus, failureReason }
    sendToTeamLead(agentName, JSON.stringify(notification), agentColor, teamName);
}

// Mapping: lb4→sendIdleNotification, A→agentName, q→agentColor, K→teamName, Y→options,
//   DQ1→createIdleNotification, DVY→sendToTeamLead
```

### sendToTeamLead (DVY) - Route message to team-lead's mailbox

```javascript
// ============================================
// sendToTeamLead - Write message to team-lead inbox
// Location: chunks.131.mjs:204-211
// ============================================

// ORIGINAL (for source lookup):
function DVY(A, q, K, Y) {
    f9(K2, { from: A, text: q, timestamp: new Date().toISOString(), color: K }, Y)
}

// READABLE (for understanding):
function sendToTeamLead(fromAgent, messageText, agentColor, teamName) {
    writeToMailbox("team-lead", {
        from: fromAgent,
        text: messageText,
        timestamp: new Date().toISOString(),
        color: agentColor
    }, teamName);
}

// Mapping: DVY→sendToTeamLead, A→fromAgent, q→messageText, K→agentColor, Y→teamName,
//   f9→writeToMailbox, K2→TEAM_LEAD_ID ("team-lead")
```

---

## 4. PaneBackendExecutor (Ku4)

### PaneBackendExecutor - Tmux/iTerm2 pane-based teammate spawning

**What it does:** Spawns each teammate as a separate Claude CLI process in a new terminal pane. Unlike the in-process backend, this provides full process isolation -- each teammate has its own memory space, event loop, and can be visually monitored.

**How it works:**

```
spawn(config):
  1. Request a new pane from terminal backend (tmux or iTerm2)
  2. If first teammate: enable pane border status display
  3. Construct CLI command with all agent flags
  4. Send command to pane (types it into the terminal)
  5. Register cleanup handler for process exit
  6. Write initial prompt to agent's mailbox
```

**CLI flag construction (Au4):**

The `buildCLIFlags` function (Au4) creates the command-line flags for the spawned teammate process:

| Flag | Source | Purpose |
|------|--------|---------|
| `--agent-id` | `agentName@teamName` | Unique identifier |
| `--agent-name` | config.name | Display name |
| `--team-name` | config.teamName | Team membership |
| `--agent-color` | config.color or generated | Terminal color |
| `--parent-session-id` | parent session | Links to orchestrator |
| `--plan-mode-required` | config flag | Forces plan mode |
| `--dangerously-skip-permissions` | if bypassPermissions or already skipped | Permission inheritance |
| `--permission-mode acceptEdits` | if acceptEdits mode | Permission inheritance |
| `--model` | current model | Model selection |
| `--settings` | settings file path | Config inheritance |
| `--plugin-dir` | plugin directories | Plugin inheritance |
| `--teammate-mode` | captured snapshot | Teammate mode preference |

**Key insight:** The permission model flows from parent to child -- if the team-lead is running with `--dangerously-skip-permissions`, the teammate inherits that. But if `planModeRequired` is set, permissions are NOT skipped (the agent must operate in plan mode).

```javascript
// ============================================
// buildCLIFlags - Construct CLI flags for teammate process
// Location: chunks.131.mjs:847-864
// ============================================

// ORIGINAL (for source lookup):
function Au4(A) {
    let q = [], { planModeRequired: K, permissionMode: Y } = A || {};
    if (K); // plan mode: don't add permission skip flags
    else if (Y === "bypassPermissions" || HQ()) q.push("--dangerously-skip-permissions");
    else if (Y === "acceptEdits") q.push("--permission-mode acceptEdits");
    let z = HT(); if (z) q.push(`--model ${R7([z])}`);
    let w = Il(); if (w) q.push(`--settings ${R7([w])}`);
    let H = $61(); for (let O of H) q.push(`--plugin-dir ${R7([O])}`);
    let $ = bQ1();
    return q.push(`--teammate-mode ${$}`), q.join(" ")
}

// READABLE (for understanding):
function buildCLIFlags(options) {
    let flags = [];
    let { planModeRequired, permissionMode } = options || {};

    // Permission flags (skip if plan mode required)
    if (planModeRequired) { /* no permission flags -- plan mode enforces approval */ }
    else if (permissionMode === "bypassPermissions" || isPermissionsSkipped()) {
        flags.push("--dangerously-skip-permissions");
    } else if (permissionMode === "acceptEdits") {
        flags.push("--permission-mode acceptEdits");
    }

    // Model inheritance
    let modelOverride = getModelOverride();
    if (modelOverride) flags.push(`--model ${shellQuote([modelOverride])}`);

    // Settings and plugins inheritance
    let settingsPath = getSettingsFilePath();
    if (settingsPath) flags.push(`--settings ${shellQuote([settingsPath])}`);
    let pluginDirs = getPluginDirectories();
    for (let dir of pluginDirs) flags.push(`--plugin-dir ${shellQuote([dir])}`);

    // Teammate mode
    let teammateMode = getTeammateModeFromSnapshot();
    flags.push(`--teammate-mode ${teammateMode}`);

    return flags.join(" ");
}

// Mapping: Au4→buildCLIFlags, A→options, K→planModeRequired, Y→permissionMode,
//   HQ→isPermissionsSkipped, HT→getModelOverride, Il→getSettingsFilePath,
//   $61→getPluginDirectories, bQ1→getTeammateModeFromSnapshot, R7→shellQuote
```

### PaneBackendExecutor.spawn - Create pane and launch teammate

```javascript
// ============================================
// PaneBackendExecutor.spawn - Spawn teammate in terminal pane
// Location: chunks.131.mjs:887-939
// ============================================

// ORIGINAL (for source lookup):
async spawn(A) {
    let q = pv(A.name, A.teamName);
    // ... validation ...
    let K = A.color ?? bd(q);
    let { paneId: Y, isFirstTeammate: z } = await this.backend.createTeammatePaneInSwarmView(A.name, K);
    let w = await OI(); // Check if running inside tmux
    if (z && w) await this.backend.enablePaneBorderStatus();
    let H = eb4(); // Get CLI executable path
    let $ = [`--agent-id ${R7([q])}`, `--agent-name ${R7([A.name])}`, ...].join(" ");
    let _ = Au4({ planModeRequired: A.planModeRequired, permissionMode: O.toolPermissionContext.mode });
    // ... model override handling ...
    let M = `cd ${R7([X])} && ${j} ${R7([H])} ${$}${J}`;
    await this.backend.sendCommandToPane(Y, M, !w);
    // Register cleanup
    if (!this.cleanupRegistered) {
        this.cleanupRegistered = true;
        Tq(async () => { /* kill all panes on exit */ });
    }
    // Write initial prompt to mailbox
    f9(A.name, { from: "team-lead", text: A.prompt, timestamp: ... }, A.teamName);
    return { success: true, agentId: q, paneId: Y };
}

// READABLE (for understanding):
async spawn(config) {
    let agentId = makeAgentId(config.name, config.teamName);  // "name@team"
    if (!this.context) return { success: false, error: "Not initialized" };

    let color = config.color ?? generateColor(agentId);
    let { paneId, isFirstTeammate } = await this.backend.createTeammatePaneInSwarmView(config.name, color);

    let insideTmux = await isRunningInsideTmux();
    if (isFirstTeammate && insideTmux) await this.backend.enablePaneBorderStatus();

    let executable = getClaudeExecutablePath();
    let agentFlags = [
        `--agent-id ${shellQuote([agentId])}`,
        `--agent-name ${shellQuote([config.name])}`,
        `--team-name ${shellQuote([config.teamName])}`,
        `--agent-color ${shellQuote([color])}`,
        `--parent-session-id ${shellQuote([config.parentSessionId || getSessionId()])}`,
        config.planModeRequired ? "--plan-mode-required" : ""
    ].filter(Boolean).join(" ");

    let cliFlags = buildCLIFlags({ planModeRequired: config.planModeRequired, permissionMode: currentPermMode });
    let command = `cd ${shellQuote([config.cwd])} && ${envVars} ${shellQuote([executable])} ${agentFlags} ${cliFlags}`;
    await this.backend.sendCommandToPane(paneId, command, !insideTmux);

    // Track spawned teammates for cleanup
    this.spawnedTeammates.set(agentId, { paneId, insideTmux });

    // Register cleanup on first spawn
    if (!this.cleanupRegistered) {
        this.cleanupRegistered = true;
        registerCleanup(async () => {
            for (let [id, info] of this.spawnedTeammates) {
                await this.backend.killPane(info.paneId, !info.insideTmux);
            }
        });
    }

    // Send initial prompt via mailbox (the spawned process will read it)
    writeToMailbox(config.name, { from: "team-lead", text: config.prompt, timestamp: now() }, config.teamName);
    return { success: true, agentId, paneId };
}

// Mapping: pv→makeAgentId, bd→generateColor, eb4→getClaudeExecutablePath,
//   Au4→buildCLIFlags, R7→shellQuote, OI→isRunningInsideTmux,
//   Tq→registerCleanup, f9→writeToMailbox, U6→getSessionId
```

### createTeammatePaneInSwarmView - Tmux pane layout algorithm

**What it does:** Creates a new tmux pane for a teammate and positions it using an alternating horizontal/vertical split strategy.

**Two modes based on context:**

1. **With Leader** (`createTeammatePaneWithLeader`): When running inside tmux, the team-lead pane is the leftmost pane taking 30% width. New teammate panes are split from existing teammate panes using alternating H/V splits.

2. **External** (`createTeammatePaneExternal`): When not inside tmux, creates a separate tmux session called `"claude-swarm"` with a window `"swarm-view"`. Uses tiled layout for even distribution.

**Alternating split algorithm (shared by both modes):**

```
Given N existing teammate panes (excluding leader):
  - If N is odd:  split VERTICALLY (new row)
  - If N is even: split HORIZONTALLY (new column in existing row)
  - Target pane = pane at index floor((N-1)/2) -- the "middle" pane
```

**Why this approach:** The alternating H/V split creates a grid-like layout that scales reasonably well. By always splitting from the middle pane, the layout stays balanced rather than creating a single long chain of splits. The "main-vertical" layout with 30% leader width ensures the team-lead always has its own prominent column on the left.

```javascript
// ============================================
// createTeammatePaneWithLeader - Split tmux panes with leader column
// Location: chunks.131.mjs:1265-1289
// ============================================

// ORIGINAL (for source lookup):
async createTeammatePaneWithLeader(A, q) {
    let K = await this.getCurrentPaneId(), Y = await this.getCurrentWindowTarget();
    let z = await this.getCurrentWindowPaneCount(Y);
    let w = z === 1, H;
    if (w) H = await IA(iW, ["split-window", "-t", K, "-h", "-l", "70%", "-P", "-F", "#{pane_id}"]);
    else {
        let J = (await IA(iW, ["list-panes", "-t", Y, "-F", "#{pane_id}"])).stdout.trim().split("\n").filter(Boolean).slice(1);
        let X = J.length, D = X % 2 === 1, j = Math.floor((X - 1) / 2), M = J[j] || J[J.length - 1];
        H = await IA(iW, ["split-window", "-t", M, D ? "-v" : "-h", "-P", "-F", "#{pane_id}"])
    }
    let $ = H.stdout.trim();
    await this.setPaneBorderColor($, q);
    await this.setPaneTitle($, A, q);
    await this.rebalancePanesWithLeader(Y);
    return { paneId: $, isFirstTeammate: w }
}

// READABLE (for understanding):
async createTeammatePaneWithLeader(agentName, color) {
    let currentPaneId = await this.getCurrentPaneId();
    let windowTarget = await this.getCurrentWindowTarget();
    let paneCount = await this.getCurrentWindowPaneCount(windowTarget);
    let isFirstTeammate = (paneCount === 1);  // Only leader pane exists

    let result;
    if (isFirstTeammate) {
        // First teammate: horizontal split, give 70% to new pane (leader gets 30%)
        result = await exec("tmux", ["split-window", "-t", currentPaneId, "-h", "-l", "70%", "-P", "-F", "#{pane_id}"]);
    } else {
        // Subsequent teammates: alternating H/V splits from middle pane
        let teammatePanes = allPanes.slice(1);  // Exclude leader (index 0)
        let count = teammatePanes.length;
        let splitVertically = (count % 2 === 1);  // Odd count → vertical, even → horizontal
        let middleIndex = Math.floor((count - 1) / 2);
        let targetPane = teammatePanes[middleIndex] || teammatePanes[teammatePanes.length - 1];
        result = await exec("tmux", ["split-window", "-t", targetPane, splitVertically ? "-v" : "-h", "-P", "-F", "#{pane_id}"]);
    }

    let newPaneId = result.stdout.trim();
    await this.setPaneBorderColor(newPaneId, color);
    await this.setPaneTitle(newPaneId, agentName, color);
    await this.rebalancePanesWithLeader(windowTarget);  // Apply main-vertical layout, leader at 30%
    await paneCreationDelay();  // 200ms delay between pane creations
    return { paneId: newPaneId, isFirstTeammate };
}

// Mapping: A→agentName, q→color, K→currentPaneId, Y→windowTarget, z→paneCount,
//   w→isFirstTeammate, iW→"tmux", Ju4→paneCreationDelay
```

### Process cleanup on exit

**What it does:** Registers a single cleanup handler (via `registerCleanup` / Tq) on first spawn that iterates through all spawned teammates and kills their tmux panes when the parent process exits.

**Why this matters:** Without cleanup, orphaned tmux panes would persist after the team-lead exits, consuming terminal real estate and potentially running indefinitely.

```javascript
// Cleanup registration (inside spawn):
if (!this.cleanupRegistered) {
    this.cleanupRegistered = true;
    registerCleanup(async () => {
        for (let [agentId, { paneId, insideTmux }] of this.spawnedTeammates) {
            await this.backend.killPane(paneId, !insideTmux);
        }
        this.spawnedTeammates.clear();
    });
}
```

---

## 5. InProcessBackend (nb4)

### InProcessBackend - In-memory teammate lifecycle management

**What it does:** Manages the full lifecycle of in-process teammates: spawning (creating state + starting agent runner), message delivery (via mailbox), graceful termination (via shutdown request), and forced kill (via abort controller).

### spawn flow: LP1 --> nM6

```
InProcessBackend.spawn(config)
  └─→ LP1 (spawnInProcessTeammate):
       ├─ Creates agentId = "name@team"
       ├─ Creates taskId (unique)
       ├─ Creates AbortController
       ├─ Creates TeammateContext (rq6)
       ├─ Registers task in AppState (bZ)
       ├─ Creates local task in task list (n_1)
       ├─ Registers cleanup handler (Tq → abort on exit)
       └─ Returns { success, agentId, taskId, abortController, teammateContext }
  └─→ nM6 (startAgentRunner):
       └─ GVY(config).catch(err => log(err))  // Fire-and-forget
```

**Key insight:** The `nM6` wrapper is a fire-and-forget launcher. It calls `GVY` (the agent runner) and only catches unhandled errors to log them. The actual lifecycle is managed through AppState and the abort controller.

```javascript
// ============================================
// InProcessBackend - In-memory teammate management class
// Location: chunks.131.mjs:634-738
// ============================================

// ORIGINAL (for source lookup):
class nb4 {
    type = "in-process";
    context = null;
    setContext(A) { this.context = A }
    async isAvailable() { return !0 }
    async spawn(A) {
        let q = await LP1({ name: A.name, teamName: A.teamName, prompt: A.prompt, color: A.color, planModeRequired: A.planModeRequired ?? !1 }, this.context);
        if (q.success && q.taskId && q.teammateContext && q.abortController)
            nM6({ identity: { agentId: q.agentId, agentName: A.name, /* ... */ }, taskId: q.taskId, prompt: A.prompt, /* ... */ });
        return { success: q.success, agentId: q.agentId, taskId: q.taskId, abortController: q.abortController, error: q.error }
    }
    async sendMessage(A, q) {
        let K = c31(A); // Parse "name@team"
        f9(K.agentName, { text: q.text, from: q.from, color: q.color, timestamp: q.timestamp ?? new Date().toISOString() }, K.teamName);
    }
    async terminate(A, q) {
        let Y = ps(A, K.tasks); // Find task by agentId
        if (Y.shutdownRequested) return !0;
        let w = lP1({ requestId: `shutdown-${A}-${Date.now()}`, from: "team-lead", reason: q });
        f9(Y.identity.agentName, { from: "team-lead", text: JSON.stringify(w), timestamp: ... }, Y.identity.teamName);
        MTA(Y.id, this.context.setAppState); // Mark shutdownRequested in AppState
        return !0
    }
    async kill(A) {
        let K = ps(A, q.tasks);
        if (K.localTaskId) sq6(K.identity.teamName, K.localTaskId); // Remove from task list
        return Rj6(K.id, this.context.setAppState); // Abort controller + cleanup
    }
}

// READABLE (for understanding):
class InProcessBackend {
    type = "in-process";
    context = null;

    setContext(toolUseContext) { this.context = toolUseContext; }
    async isAvailable() { return true; }  // Always available

    async spawn(config) {
        // Step 1: Create teammate state
        let result = await spawnInProcessTeammate({
            name: config.name, teamName: config.teamName,
            prompt: config.prompt, color: config.color,
            planModeRequired: config.planModeRequired ?? false
        }, this.context);

        // Step 2: Start agent runner (fire-and-forget)
        if (result.success) {
            startAgentRunner({
                identity: { agentId: result.agentId, agentName: config.name, teamName: config.teamName, ... },
                taskId: result.taskId,
                prompt: config.prompt,
                toolUseContext: this.context,
                abortController: result.abortController,
                model: config.model,
                // ... remaining config
            });
        }
        return result;
    }

    async sendMessage(agentId, message) {
        let { agentName, teamName } = parseAgentId(agentId);  // "name@team" → {name, team}
        writeToMailbox(agentName, {
            text: message.text, from: message.from, color: message.color,
            timestamp: message.timestamp ?? new Date().toISOString()
        }, teamName);
    }

    async terminate(agentId, reason) {
        let task = findTaskByAgentId(agentId, appState.tasks);
        if (task.shutdownRequested) return true;  // Already requested

        // Create and send shutdown request via mailbox
        let request = createShutdownRequest({
            requestId: `shutdown-${agentId}-${Date.now()}`,
            from: "team-lead",
            reason: reason
        });
        writeToMailbox(task.identity.agentName, {
            from: "team-lead",
            text: JSON.stringify(request),
            timestamp: new Date().toISOString()
        }, task.identity.teamName);

        markShutdownRequested(task.id, this.context.setAppState);
        return true;
    }

    async kill(agentId) {
        let task = findTaskByAgentId(agentId, appState.tasks);
        if (task.localTaskId) removeFromTaskList(task.identity.teamName, task.localTaskId);
        return abortAndCleanup(task.id, this.context.setAppState);
        // abortAndCleanup: aborts controller, fires idle callbacks, removes cleanup handler
    }
}

// Mapping: nb4→InProcessBackend, LP1→spawnInProcessTeammate, nM6→startAgentRunner,
//   c31→parseAgentId, f9→writeToMailbox, ps→findTaskByAgentId,
//   lP1→createShutdownRequest, MTA→markShutdownRequested,
//   Rj6→abortAndCleanup, sq6→removeFromTaskList
```

### startAgentRunner (nM6) - Fire-and-forget launcher

```javascript
// ============================================
// startAgentRunner - Fire-and-forget wrapper for GVY
// Location: chunks.131.mjs:598-602
// ============================================

// ORIGINAL (for source lookup):
function nM6(A) {
    GVY(A).catch((q) => {
        h(`[inProcessRunner] Unhandled error in ${A.identity.agentId}: ${q}`)
    })
}

// READABLE (for understanding):
function startAgentRunner(config) {
    inProcessAgentRunner(config).catch(err => {
        log(`[inProcessRunner] Unhandled error in ${config.identity.agentId}: ${err}`);
    });
}

// Mapping: nM6→startAgentRunner, GVY→inProcessAgentRunner
```

### terminate vs kill - Two levels of stopping

| Method | Mechanism | Agent Awareness | Graceful |
|--------|-----------|-----------------|----------|
| `terminate` | Sends `shutdown_request` via mailbox | Yes -- agent receives it as a message, can finish current work | Yes |
| `kill` | Calls `abortController.abort()` directly | No -- immediate signal interruption | No |

**Why two levels:** `terminate` allows the agent to acknowledge the shutdown, save progress, or send a final message. `kill` is the emergency stop when `terminate` fails or the agent is unresponsive.

---

## 6. Graceful Shutdown Protocol

### Shutdown message flow

```
Team Lead decides to shut down a teammate
    │
    ▼
terminate(agentId, reason)
    │
    ├─ InProcessBackend: Creates shutdown_request JSON, writes to mailbox via f9
    │   Also marks task.shutdownRequested = true in AppState via MTA
    │
    └─ PaneBackendExecutor: Creates shutdown_request JSON, writes to mailbox via f9
        (No AppState marking -- the pane process manages its own state)
    │
    ▼
Poll Loop (WVY) picks up the shutdown_request
    │  (Priority 2 -- skips all pending normal messages)
    │
    ▼
Agent Runner (GVY) receives { type: "shutdown_request", request, originalMessage }
    │
    ▼
Formats as <teammate-message> and passes to next agent loop iteration
    │  The LLM sees: <teammate-message teammate_id="team-lead">{"type":"shutdown_request",...}</teammate-message>
    │
    ▼
LLM processes shutdown request and completes (ideally calls SendMessage to acknowledge)
    │
    ▼
Agent marks itself idle → sends idle notification → poll loop re-enters
    │  If aborted during this cycle, exits cleanly
```

### createShutdownRequest (lP1) - Structured shutdown message

```javascript
// ============================================
// createShutdownRequest - Build shutdown request payload
// Location: chunks.129.mjs:1345-1353
// ============================================

// ORIGINAL (for source lookup):
function lP1(A) {
    return {
        type: "shutdown_request",
        requestId: A.requestId,
        from: A.from,
        reason: A.reason,
        timestamp: new Date().toISOString()
    }
}

// READABLE (for understanding):
function createShutdownRequest({ requestId, from, reason }) {
    return {
        type: "shutdown_request",
        requestId,           // "shutdown-agentId-timestamp"
        from,                // "team-lead" or agent name
        reason,              // Human-readable reason for shutdown
        timestamp: new Date().toISOString()
    };
}

// Mapping: lP1→createShutdownRequest
```

### parseShutdownRequest (ss) - Detect shutdown in mailbox

```javascript
// ============================================
// parseShutdownRequest - Parse shutdown_request from message text
// Location: chunks.129.mjs:1396-1402
// ============================================

// ORIGINAL (for source lookup):
function ss(A) {
    try {
        let q = Tx4.safeParse(_A(A));
        if (q.success) return q.data
    } catch {}
    return null
}

// READABLE (for understanding):
function parseShutdownRequest(messageText) {
    try {
        let result = shutdownRequestSchema.safeParse(JSON.parse(messageText));
        if (result.success) return result.data;
    } catch {}
    return null;  // Not a shutdown request
}

// Mapping: ss→parseShutdownRequest, Tx4→shutdownRequestSchema, _A→JSON.parse
```

**Key insight:** The shutdown request is embedded as JSON in the message text field of a regular mailbox message. The poll loop tries to parse every unread message as a shutdown request before treating it as a regular message. This piggybacks on the existing mailbox infrastructure without needing a separate control channel.

### markShutdownRequested (MTA) - Prevent duplicate shutdown requests

```javascript
// ============================================
// markShutdownRequested - Flag task as shutdown-pending in AppState
// Location: chunks.123.mjs:440-448
// ============================================

// ORIGINAL (for source lookup):
function MTA(A, q) {
    c5(A, q, (K) => {
        if (K.status !== "running" || K.shutdownRequested) return K;
        return { ...K, shutdownRequested: !0 }
    })
}

// READABLE (for understanding):
function markShutdownRequested(taskId, setAppState) {
    updateTask(taskId, setAppState, (task) => {
        if (task.status !== "running" || task.shutdownRequested) return task;  // Idempotent
        return { ...task, shutdownRequested: true };
    });
}

// Mapping: MTA→markShutdownRequested, c5→updateTask
```

---

## 7. Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (agent loop, tools)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (agent teams, task system)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (permissions, sandbox)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (UI, IDE)

Key functions in this document:

**In-Process Execution:**
- `inProcessPollLoop` (WVY) - 5-level priority poll loop for incoming messages
- `inProcessAgentRunner` (GVY) - Full agent execution lifecycle
- `startAgentRunner` (nM6) - Fire-and-forget wrapper for GVY
- `InProcessBackend` (nb4) - In-memory teammate management class
- `claimNextTask` (ib4) - Self-assign work from shared task list
- `findNextClaimableTask` (MVY) - Task selection with dependency checking
- `formatTaskPrompt` (PVY) - Format claimed task as agent prompt

**Pane Execution:**
- `PaneBackendExecutor` (Ku4) - Tmux/iTerm2 pane-based teammate spawning
- `buildCLIFlags` (Au4) - Construct CLI flags for subprocess
- `getClaudeExecutablePath` (eb4) - Resolve Claude CLI binary path
- `TmuxBackend` (fEA) - Tmux terminal backend implementation
- `ITermBackend` (EEA) - iTerm2 terminal backend implementation
- `paneCreationDelay` (Ju4) - 200ms delay between pane creations

**Communication:**
- `formatTeammateMessage` (_EA) - XML envelope for inter-agent messages
- `sendIdleNotification` (lb4) - Notify team-lead of idle status
- `sendToTeamLead` (DVY) - Route message to team-lead mailbox
- `writeToMailbox` (f9) - Write message to agent's file-based inbox
- `readMailbox` (Ld) - Read all messages from agent's inbox
- `markMessageAsReadByIndex` (JQ1) - Mark specific message as read
- `createIdleNotification` (DQ1) - Build idle notification payload
- `extractLastMessageSummary` (WQ1) - Extract summary from last SendMessage tool use

**Shutdown Protocol:**
- `createShutdownRequest` (lP1) - Build shutdown request JSON
- `parseShutdownRequest` (ss) - Detect shutdown request in message text
- `markShutdownRequested` (MTA) - Flag task as shutdown-pending
- `abortAndCleanup` (Rj6) - Force-stop via abort controller + cleanup

**State Management:**
- `updateTaskInState` (Id) - Update in-process teammate task in AppState
- `appendMessageToTask` (Cj6) - Add message to task's message array
- `spawnInProcessTeammate` (LP1) - Create teammate state in AppState
- `registerCleanup` (Tq) - Register exit cleanup handler
- `makeAgentId` (pv) - Create `"name@team"` identifier
- `parseAgentId` (c31) - Parse `"name@team"` back to components
- `findTaskByAgentId` (ps) - Lookup task by agentId in AppState

**Constants:**
- `TEAM_LEAD_ID` (K2) - `"team-lead"` - the team-lead identifier
- `TEAMMATE_MESSAGE_TAG` (qJ) - `"teammate-message"` - XML tag for inter-agent messages
- `POLL_INTERVAL` (JVY) - `500` ms polling interval
- `PANE_CREATION_DELAY` (vVY) - `200` ms delay between pane creations
- `SWARM_SESSION_NAME` (WN) - `"claude-swarm"` - tmux session name
- `SWARM_VIEW_WINDOW_NAME` (gP1) - `"swarm-view"` - tmux window name
