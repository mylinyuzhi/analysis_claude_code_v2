# Error Recovery - Agent Team Failure Handling

> **Module**: Agent Teams - Error Recovery and Resilience
> **Source**: `chunks.145.mjs` (lines 2443-2519 for shutdown handling), `chunks.113.mjs` (lines 1272-1316 for killInProcessTeammate), `chunks.131.mjs` (lines 1144-1500)
> **Version**: Claude Code 2.1.76

---

## Table of Contents

1. [Overview](#1-overview)
2. [Graceful Shutdown Protocol](#2-graceful-shutdown-protocol)
3. [Communication Error Recovery](#3-communication-error-recovery)
4. [Backend-Specific Error Handling](#4-backend-specific-error-handling)
5. [State Corruption Recovery](#5-state-corruption-recovery)
6. [Tool Execution Errors](#6-tool-execution-errors)
7. [Recovery Strategies Matrix](#7-recovery-strategies-matrix)
8. [Design Trade-offs](#8-design-trade-offs)
9. [Related Symbols](#9-related-symbols)

---

## 1. Overview

Agent Teams in Claude Code operate in a distributed, multi-process environment where failures can occur at multiple levels:
- **Communication failures**: Messages lost between agents
- **Process crashes**: Teammate processes terminate unexpectedly
- **Backend failures**: tmux/iTerm crashes or becomes unavailable
- **State corruption**: config.json or mailbox files become invalid
- **Tool execution errors**: TeamCreate, SendMessage, TaskUpdate failures

The error recovery system follows three core principles:

### Design Principles

**1. Graceful Degradation**: Failures should not brick the entire team. If one teammate fails, others continue working.

**2. User Visibility**: Errors are surfaced to users with actionable information, not silently swallowed.

**3. State Consistency**: Recovery mechanisms prioritize maintaining consistent state (team config, task ownership, mailbox) over preserving partial work.

### Error Classification

| Type | Blocking? | Recovery Strategy | User Impact |
|------|-----------|-------------------|-------------|
| Communication error (message delivery) | No | Retry or log warning | Message may be delayed/lost |
| Teammate process crash | Yes | Detect + cleanup + notify lead | Task reassignment required |
| Backend unavailable (tmux/iTerm) | Yes | Fail TeamCreate, suggest fix | Cannot spawn new teammates |
| State corruption (config.json) | Yes | Detect + attempt restore | Team may need recreation |
| Tool execution error (validation) | Yes | Return error to agent | Agent must retry or adjust |

---

## 2. Graceful Shutdown Protocol

### Overview

The graceful shutdown protocol allows the team lead to request teammate shutdown, giving teammates the opportunity to save work, cleanup resources, and approve/reject the request.

### Shutdown Request Flow

```
Team Lead: "Please shut down"
  → Calls SendMessage with shutdown_request message
  → Message added to teammate's mailbox
  → Teammate's poll loop (Priority 2 - highest after pendingUserMessages)
  → Returns {type: "shutdown_request"} to teammate agent

Teammate Agent:
  → Receives shutdown request in main loop
  → User approves/rejects via UI
  → If approved: calls handleShutdownApproval
  → If rejected: calls handleShutdownRejection

handleShutdownApproval:
  → Sends confirmation message to team-lead
  → If in-process teammate: aborts AbortController
  → If pane-based teammate: triggers process.exit
  → Cleanup: removes from team config, marks tasks as abandoned
```

### Implementation - handleShutdownApproval

**What it does:** Processes a teammate's approval of a shutdown request, sends confirmation to the team lead, and initiates the termination sequence.

**Step-by-step algorithm:**

1. **Extract context**: Get `teamName`, `agentId`, `agentName`, and `request_id` from the current session state

2. **Lookup teammate info from team config**: Read team config to find the teammate's `tmuxPaneId` and `backendType` (in-process vs pane-based)

3. **Format confirmation message**: Create a structured `shutdown_approval_response` message containing:
   - `requestId`: Original shutdown request ID (for correlation)
   - `from`: Teammate name approving the shutdown
   - `paneId`: Pane identifier (for pane-based backends)
   - `backendType`: "in-process" or "tmux"/"iterm"

4. **Send confirmation to team-lead**: Call `sendTeamMessage(team-lead, confirmationMessage, teamName)` to notify the lead

5. **Terminate based on backend type**:

   **If in-process backend:**
   ```javascript
   if (backendType === "in-process") {
       let appState = await getAppState();
       let task = findTaskByAgentId(agentId, appState.tasks);
       if (task?.abortController) {
           task.abortController.abort();  // Signal poll loop to exit
           log(`Aborted controller for in-process teammate ${agentName}`);
       }
   }
   ```

   **If pane-based backend (tmux/iTerm):**
   ```javascript
   else {
       // Fallback check: teammate might be in-process despite config
       let appState = await getAppState();
       let task = findTaskByAgentId(agentId, appState.tasks);
       if (task?.abortController) {
           // Found in-process task - abort it
           task.abortController.abort();
           return { success: true, message: "Shutdown approved (fallback path)" };
       }

       // True pane-based: schedule process exit on next tick
       setImmediate(async () => {
           await gracefulExit(0, "other");
       });
   }
   ```

6. **Return success response**: Return `{success: true, message: "Shutdown approved. Agent {name} is now exiting."}`

### Why this approach

**Priority 2 for shutdown requests**: Shutdown messages are scanned with higher priority than regular messages in the poll loop. This ensures shutdown cannot be blocked by a flooded mailbox. Without this, a teammate receiving many messages could never process the shutdown request.

**Two-phase commit pattern**: The request → approval → confirmation flow allows:
- Teammates to save work before exiting
- Users to reject shutdown if work is not complete
- Team lead to know when shutdown is confirmed vs rejected

**Fallback path for backend type mismatch**: The code checks both `backendType` from config AND `task.abortController` existence. This handles edge cases where:
- Config says "pane-based" but teammate is actually in-process (config out of sync)
- Config says "in-process" but teammate spawned a pane (rare but possible during dev)

**setImmediate for process.exit**: Ensures the tool result is sent back to the agent before the process terminates. Using `process.exit(0)` immediately would kill the process before the response is serialized.

### Implementation - handleShutdownRejection

**What it does:** Processes a teammate's rejection of a shutdown request, notifies the team lead, and allows the teammate to continue working.

**Algorithm:**

Signature: `handleShutdownRejection(requestId, reason)` — two separate string parameters (NOT a single object).

1. **Extract context**: Get `teamName` and `agentName` from session globals

2. **Format rejection message**: Create `shutdown_rejection_response` with:
   - `requestId`: Original request ID (passed directly as first param)
   - `from`: Teammate name rejecting shutdown
   - `reason`: Rejection reason (passed directly as second param)

3. **Send rejection to team-lead**: Call `writeToMailbox(TEAM_LEAD_ID, message, teamName)` (x3)

4. **Return success response**: Return `{data: {success: true, message: "Shutdown rejected. Reason: \"{reason}\". Continuing to work.", request_id: requestId}}`

**Why rejection is important**: Allows teammates to push back if:
- Critical work is in progress (unsaved changes, running tests)
- Shutdown timing is inappropriate
- User wants to investigate why shutdown was requested

```javascript
// ============================================
// handleShutdownApproval - Process teammate approval of shutdown request
// Location: chunks.145.mjs:2443-2497
// ============================================

// ORIGINAL (for source lookup):
async function YxY(A, q) {
    let K = l5(), Y = nM(), z = i3() || "teammate";
    k(`[SendMessageTool] handleShutdownApproval: teamName=${K}, agentId=${Y}, agentName=${z}`);
    let _, w;
    if (K) {
        let $ = await Kz6(K);
        if ($ && Y) {
            let H = $.members.find((j) => j.agentId === Y);
            if (H) _ = H.tmuxPaneId, w = H.backendType
        }
    }
    let O = Gx8({
        requestId: A,
        from: z,
        paneId: _,
        backendType: w
    });
    if (await x3(BY, {
            from: z,
            text: B6(O),
            timestamp: new Date().toISOString(),
            color: H$()
        }, K), w === "in-process") {
        if (k(`[SendMessageTool] In-process teammate ${z} approving shutdown - signaling abort`), Y) {
            let $ = q.getAppState(),
                H = _g(Y, $.tasks);
            if (H?.abortController) H.abortController.abort(), k(`[SendMessageTool] Aborted controller for in-process teammate ${z}`);
            else k(`[SendMessageTool] Warning: Could not find task/abortController for ${z}`)
        }
    } else {
        if (Y) {
            let $ = q.getAppState(),
                H = _g(Y, $.tasks);
            if (H?.abortController) return k(`[SendMessageTool] Fallback: Found in-process task for ${z} via AppState, aborting`), H.abortController.abort(), {
                data: {
                    success: !0,
                    message: `Shutdown approved (fallback path). Agent ${z} is now exiting.`,
                    request_id: A
                }
            }
        }
        setImmediate(async () => {
            await Vq(0, "other")
        })
    }
    return {
        data: {
            success: !0,
            message: `Shutdown approved. Sent confirmation to team-lead. Agent ${z} is now exiting.`,
            request_id: A
        }
    }
}

// READABLE (for understanding):
async function handleShutdownApproval(request, toolUseContext) {
    let teamName = getCurrentTeamName();
    let agentId = getCurrentAgentId();
    let agentName = getCurrentAgentName() || "teammate";
    let requestId = request.request_id;

    log(`[SendMessageTool] handleShutdownApproval: teamName=${teamName}, agentId=${agentId}, agentName=${agentName}`);

    // Lookup teammate info from team config
    let tmuxPaneId, backendType;
    if (teamName) {
        let teamConfig = readTeamConfig(teamName);
        if (teamConfig && agentId) {
            let memberInfo = teamConfig.members.find(m => m.agentId === agentId);
            if (memberInfo) {
                tmuxPaneId = memberInfo.tmuxPaneId;
                backendType = memberInfo.backendType;
            }
        }
    }

    // Format confirmation message
    let confirmationMessage = createShutdownApprovalResponse({
        requestId: requestId,
        from: agentName,
        paneId: tmuxPaneId,
        backendType: backendType
    });

    // Send confirmation to team-lead
    sendTeamMessage(TEAM_LEAD_NAME, {
        from: agentName,
        text: JSON.stringify(confirmationMessage),
        timestamp: new Date().toISOString(),
        color: getAgentColor()
    }, teamName);

    // Terminate based on backend type
    if (backendType === "in-process") {
        log(`[SendMessageTool] In-process teammate ${agentName} approving shutdown - signaling abort`);
        if (agentId) {
            let appState = await toolUseContext.getAppState();
            let task = findTaskByAgentId(agentId, appState.tasks);
            if (task?.abortController) {
                task.abortController.abort();
                log(`[SendMessageTool] Aborted controller for in-process teammate ${agentName}`);
            } else {
                log(`[SendMessageTool] Warning: Could not find task/abortController for ${agentName}`);
            }
        }
    } else {
        // Fallback check: teammate might be in-process despite config
        if (agentId) {
            let appState = await toolUseContext.getAppState();
            let task = findTaskByAgentId(agentId, appState.tasks);
            if (task?.abortController) {
                log(`[SendMessageTool] Fallback: Found in-process task for ${agentName} via AppState, aborting`);
                task.abortController.abort();
                return {
                    data: {
                        success: true,
                        message: `Shutdown approved (fallback path). Agent ${agentName} is now exiting.`,
                        request_id: requestId
                    }
                };
            }
        }

        // Schedule process exit on next tick (allows tool result to be sent first)
        setImmediate(async () => {
            await gracefulExit(0, "other");
        });
    }

    return {
        data: {
            success: true,
            message: `Shutdown approved. Sent confirmation to team-lead. Agent ${agentName} is now exiting.`,
            request_id: requestId
        }
    };
}

// Mapping: YxY→handleShutdownApproval, A→requestId, q→toolUseContext, K→teamName, Y→agentId, z→agentName,
//          _→tmuxPaneId, w→backendType, O→confirmationMessage, Gx8→createShutdownApprovalResponse,
//          l5→getCurrentTeamName, nM→getCurrentAgentId, i3→getCurrentAgentName, Kz6→readTeamConfig,
//          x3→writeToMailbox, BY→TEAM_LEAD_ID, B6→JSON.stringify, H$→getAgentColor, _g→findTaskByAgentId,
//          Vq→gracefulExit


// ============================================
// handleShutdownRejection - Process teammate rejection of shutdown request
// Location: chunks.145.mjs:2499-2519
// ============================================

// ORIGINAL (for source lookup):
async function zxY(A, q) {
    let K = l5(),
        Y = i3() || "teammate",
        z = fx8({
            requestId: A,
            from: Y,
            reason: q
        });
    return await x3(BY, {
        from: Y,
        text: B6(z),
        timestamp: new Date().toISOString(),
        color: H$()
    }, K), {
        data: {
            success: !0,
            message: `Shutdown rejected. Reason: "${q}". Continuing to work.`,
            request_id: A
        }
    }
}

// READABLE (for understanding):
async function handleShutdownRejection(requestId, reason) {
    // NOTE: Two separate params — requestId (string) and reason (string), NOT a single object
    let teamName = getCurrentTeamName();
    let agentName = getCurrentAgentName() || "teammate";

    // Format rejection message
    let rejectionMessage = createShutdownRejectionResponse({
        requestId: requestId,
        from: agentName,
        reason: reason
    });

    // Send rejection to team-lead
    await writeToMailbox(TEAM_LEAD_ID, {
        from: agentName,
        text: JSON.stringify(rejectionMessage),
        timestamp: new Date().toISOString(),
        color: getAgentColor()
    }, teamName);

    return {
        data: {
            success: true,
            message: `Shutdown rejected. Reason: "${reason}". Continuing to work.`,
            request_id: requestId
        }
    };
}

// Mapping: zxY→handleShutdownRejection, A→requestId, q→reason, K→teamName, Y→agentName, z→rejectionMessage,
//          fx8→createShutdownRejectionResponse, x3→writeToMailbox, BY→TEAM_LEAD_ID, B6→JSON.stringify,
//          H$→getAgentColor, l5→getCurrentTeamName, i3→getCurrentAgentName
```

### Forced Termination: killInProcessTeammate (bZ1)

**What it does:** Force-kills an in-process teammate by aborting its controller and removing it from the team state. Unlike graceful shutdown (which requires the teammate's approval), this immediately stops the teammate.

**When used:**
- TeamDelete tool called by team-lead
- Cleanup during session termination
- Recovery from hung/unresponsive teammates

**Algorithm:**

1. **Find task in AppState**: Look up the task by taskId
2. **Validate task type**: Must be `in_process_teammate` and `status: running`
3. **Abort execution**: Call `abortController.abort()` to stop the poll loop
4. **Fire idle callbacks**: Trigger any registered `onIdleCallbacks` (for waiting threads)
5. **Remove from teamContext**: Delete the teammate from `teamContext.teammates`
6. **Update task state**: Mark as `killed`, set `endTime`, clear in-progress data
7. **Notify team-lead**: Send removal notification via `ty8(teamName, agentId)`

```javascript
// ============================================
// killInProcessTeammate - Force-kill an in-process teammate
// Location: chunks.113.mjs:1272-1316
// ============================================

// ORIGINAL (for source lookup):
function bZ1(A, q) {
    let K = !1, Y = null, z = null;
    if (q((_) => {
        let w = _.tasks[A];
        if (!w || w.type !== "in_process_teammate") return _;
        let O = w;
        if (O.status !== "running") return _;
        Y = O.identity.teamName, z = O.identity.agentId,
        O.abortController?.abort(),
        O.unregisterCleanup?.(),
        K = !0,
        O.onIdleCallbacks?.forEach((H) => H());
        let $ = _.teamContext;
        if (_.teamContext && _.teamContext.teammates && z) {
            let { [z]: H, ...j } = _.teamContext.teammates;
            $ = { ..._.teamContext, teammates: j }
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
function killInProcessTeammate(taskId, setAppState) {
    let wasKilled = false;
    let teamName = null;
    let agentId = null;

    setAppState((state) => {
        let task = state.tasks[taskId];
        if (!task || task.type !== "in_process_teammate") return state;
        if (task.status !== "running") return state;

        teamName = task.identity.teamName;
        agentId = task.identity.agentId;

        // Abort the agent's execution
        task.abortController?.abort();
        task.unregisterCleanup?.();
        wasKilled = true;

        // Fire any waiting callbacks
        task.onIdleCallbacks?.forEach(cb => cb());

        // Remove from teamContext
        let updatedTeamContext = state.teamContext;
        if (state.teamContext?.teammates && agentId) {
            let { [agentId]: removed, ...remainingTeammates } = state.teamContext.teammates;
            updatedTeamContext = { ...state.teamContext, teammates: remainingTeammates };
        }

        // Return updated state
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
                    onIdleCallbacks: [],
                    // Keep only last message for debugging
                    messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
                    pendingUserMessages: [],
                    inProgressToolUseIDs: undefined,
                    abortController: undefined,
                    unregisterCleanup: undefined,
                    currentWorkAbortController: undefined
                }
            }
        };
    });

    // Notify team-lead of removal
    if (teamName && agentId) notifyTeammateRemoval(teamName, agentId);

    // Schedule cleanup after delay
    if (wasKilled) {
        removeTaskFromState(taskId);
        setTimeout(() => finalizeTaskCleanup(taskId, setAppState), CLEANUP_DELAY_MS);
    }

    // Clear agent identity context
    if (agentId) clearAgentIdentity(agentId);

    return wasKilled;
}

// Mapping: bZ1→killInProcessTeammate, A→taskId, q→setAppState,
//   K→wasKilled, Y→teamName, z→agentId, ty8→notifyTeammateRemoval,
//   $O→removeTaskFromState, VR→finalizeTaskCleanup, mB→CLEANUP_DELAY_MS
```

**Key insight:** The function uses immutable state updates (spreading objects) rather than direct mutation. This ensures React state change detection works correctly and prevents race conditions during concurrent state updates.

---

## 3. Communication Error Recovery

### Message Delivery Failures

**Failure scenario**: `sendTeamMessage` fails due to:
- File system full (cannot append to mailbox)
- Permissions error (mailbox file not writable)
- Mailbox file locked by another process

**Detection**: File system errors are thrown synchronously during `fs.appendFileSync` call

**Recovery strategy**:
```javascript
try {
    sendTeamMessage(recipient, message, teamName);
} catch (error) {
    // Log error but don't block agent execution
    log(`Failed to send message to ${recipient}: ${error.message}`);

    // Return error to agent (agent can decide to retry or continue)
    return {
        success: false,
        error: `Message delivery failed: ${error.message}`
    };
}
```

**User impact**: Agent receives error response and can:
- Retry sending the message
- Use alternative communication (broadcast instead of direct)
- Continue without confirmation (fire-and-forget)

### Orphaned Messages

**Failure scenario**: Teammate process crashes while unread messages remain in mailbox

**Detection**: Team config shows teammate as "active" but no process with that agentId exists

**Recovery strategy**:
```
1. Team lead or user runs TeamDelete tool
2. TeamDelete reads mailbox, counts unread messages
3. If unread messages exist:
   - Log warning: "{count} unread messages for {teammate} will be lost"
   - Optionally archive messages to .archived-mailbox
4. Delete mailbox file
5. Remove teammate from team config
```

**User impact**: Messages may be lost if teammate crashes. Team lead should:
- Check teammate status before sending critical messages
- Use broadcast for announcements (all teammates receive)
- Re-send important messages after teammate restarts

### Mailbox File Corruption

**Failure scenario**: Mailbox JSONL file contains invalid JSON line

**Detection**: `JSON.parse` throws during `readMailbox` call

**Recovery strategy**:
```javascript
function readMailbox(agentName, teamName) {
    let lines = fs.readFileSync(mailboxPath, "utf-8").split("\n").filter(Boolean);
    let messages = [];

    for (let i = 0; i < lines.length; i++) {
        try {
            let message = JSON.parse(lines[i]);
            messages.push(message);
        } catch (error) {
            log(`Mailbox corruption: line ${i+1} is invalid JSON: ${error.message}`);
            // Skip corrupted line, continue parsing rest
            continue;
        }
    }

    return messages;
}
```

**User impact**: Individual corrupted messages are skipped. Most messages are recoverable unless entire file is corrupted.

---

## 4. Backend-Specific Error Handling

### Tmux Backend Errors

**Error 1: tmux not available**

```javascript
// In TmuxBackend.isAvailable()
async isAvailable() {
    return isTmuxInstalled();  // Check `which tmux`
}

// In TeamCreate tool
if (!await backend.isAvailable()) {
    return {
        success: false,
        error: "tmux is not available. Please install tmux or use in-process backend."
    };
}
```

**Error 2: Session creation fails**

```javascript
// In TmuxBackend.createExternalSwarmSession()
let result = await exec(["new-session", "-d", "-s", SWARM_SESSION_NAME]);
if (result.code !== 0) {
    throw Error(`Failed to create swarm session: ${result.stderr || "Unknown error"}`);
}
```

**Recovery**: TeamCreate returns error to agent. User can:
- Fix tmux installation/configuration
- Switch to in-process backend
- Manually create tmux session and retry

**Error 3: Pane creation fails**

```javascript
// In TmuxBackend.createTeammatePaneWithLeader()
let result = await exec(["split-window", "-t", paneId, "-h", "-P", "-F", "#{pane_id}"]);
if (result.code !== 0) {
    throw Error(`Failed to create teammate pane: ${result.stderr}`);
}
```

**Recovery**: Error propagates to TeamCreate tool. Partial state cleanup:
- Delete any created panes
- Remove teammate from team config
- Return error to agent

**Error 4: Send command to pane fails**

```javascript
// In TmuxBackend.sendCommandToPane()
let result = await exec(["send-keys", "-t", paneId, command, "Enter"]);
if (result.code !== 0) {
    throw Error(`Failed to send command to pane ${paneId}: ${result.stderr}`);
}
```

**Recovery**: Log error but teammate may still be running. User should:
- Check if pane still exists (`tmux list-panes`)
- Manually send command to pane if needed
- Use TeamDelete and recreate teammate if pane is dead

### iTerm Backend Errors

**Error 1: iTerm not running**

```javascript
// In ITermBackend.isAvailable()
async isAvailable() {
    // Check if iTerm.app process exists
    return await isITermRunning();
}
```

**Recovery**: Same as tmux - return error from TeamCreate

**Error 2: AppleScript execution fails**

iTerm backend uses AppleScript for pane creation and command execution. Failures include:
- AppleScript syntax errors (code bug)
- iTerm API changed (version mismatch)
- Permissions denied (macOS sandboxing)

```javascript
// In ITermBackend.executeAppleScript()
try {
    let result = await runAppleScript(script);
    return result;
} catch (error) {
    log(`iTerm AppleScript failed: ${error.message}`);
    throw Error(`iTerm automation failed: ${error.message}`);
}
```

**Recovery**: Error propagates to TeamCreate. User should:
- Grant iTerm automation permissions in System Preferences
- Update iTerm to latest version
- Fall back to tmux or in-process backend

### In-Process Backend Errors

**Error 1: Agent loop crash**

In-process teammates run in the same Node.js process. If the agent loop throws an unhandled exception:

```javascript
// In inProcessAgentRunner (GVY)
try {
    for await (let event of runAgentLoop(...)) {
        // Process events
    }
} catch (error) {
    log(`In-process agent ${agentName} crashed: ${error.message}`);
    // Update AppState to mark teammate as crashed
    setAppState(state => ({
        ...state,
        tasks: {
            ...state.tasks,
            [taskId]: {
                ...state.tasks[taskId],
                status: "crashed",
                error: error.message
            }
        }
    }));
}
```

**Recovery**: Team lead sees crashed status and can:
- Restart teammate (re-run agent loop)
- Reassign tasks to other teammates
- Investigate crash cause (check logs)

**Error 2: Abort controller not cleaned up**

If abort controller is not properly cleaned up after shutdown, the teammate task remains in AppState indefinitely.

**Detection**: Task status is "completed" or "aborted" but still present in `AppState.tasks`

**Recovery**: Manual cleanup via TeamDelete or automatic cleanup on session restart

---

## 5. State Corruption Recovery

### Team Config Corruption

**Failure scenario**: `~/.claude/teams/{teamName}/config.json` contains invalid JSON or missing required fields

**Detection**:
```javascript
function readTeamConfig(teamName) {
    try {
        let raw = fs.readFileSync(configPath, "utf-8");
        let config = JSON.parse(raw);
        // Validate schema
        if (!config.teamName || !config.members || !Array.isArray(config.members)) {
            throw Error("Invalid team config schema");
        }
        return config;
    } catch (error) {
        log(`Team config corruption detected: ${error.message}`);
        return null;
    }
}
```

**Recovery options**:

**Option 1: Restore from backup** (if implemented)
```javascript
let backupPath = `${configPath}.backup`;
if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, configPath);
    log("Restored team config from backup");
}
```

**Option 2: Rebuild from running teammates**
```javascript
// Query tmux/iTerm for active panes
let activePanes = await backend.listActivePanes();
// Rebuild config based on active panes
let members = activePanes.map(pane => ({
    agentId: pane.agentId,
    agentName: pane.agentName,
    tmuxPaneId: pane.paneId,
    backendType: backend.type
}));
// Write new config
writeTeamConfig(teamName, { teamName, members, createdAt: new Date().toISOString() });
```

**Option 3: Delete and recreate team**
```
User manually runs TeamDelete (force flag to bypass config read)
User recreates team with TeamCreate
```

### Mailbox Directory Corruption

**Failure scenario**: `~/.claude/teams/{teamName}/mailbox/` directory deleted or permissions changed

**Detection**: `fs.readFileSync` throws ENOENT or EACCES

**Recovery**:
```javascript
function ensureMailboxExists(teamName) {
    let mailboxDir = getMailboxDir(teamName);
    if (!fs.existsSync(mailboxDir)) {
        log(`Mailbox directory missing for team ${teamName}, recreating`);
        fs.mkdirSync(mailboxDir, { recursive: true });
    }
}

// Call before every mailbox operation
ensureMailboxExists(teamName);
let messages = readMailbox(agentName, teamName);
```

**User impact**: Messages sent before recreation are lost. Team lead should re-send critical messages.

---

## 6. Tool Execution Errors

### TeamCreate Validation Errors

**Error 1: Invalid team name**
```javascript
if (!/^[a-z0-9-]+$/.test(teamName)) {
    return {
        success: false,
        error: "Team name must contain only lowercase letters, numbers, and hyphens"
    };
}
```

**Error 2: Team already exists**
```javascript
if (fs.existsSync(getTeamConfigPath(teamName))) {
    return {
        success: false,
        error: `Team "${teamName}" already exists. Use a different name or delete the existing team.`
    };
}
```

**Error 3: Backend not available**
```javascript
let backend = getBackend(backendType);
if (!await backend.isAvailable()) {
    return {
        success: false,
        error: `Backend "${backendType}" is not available. ${getSuggestedFix(backendType)}`
    };
}
```

### SendMessage Validation Errors

**Error 1: Recipient not found**
```javascript
let config = readTeamConfig(teamName);
if (!config.members.some(m => m.agentName === recipient)) {
    return {
        success: false,
        error: `Recipient "${recipient}" is not a member of team "${teamName}"`
    };
}
```

**Error 2: Message type validation**
```javascript
if (messageType === "shutdown_request" && !isTeamLead(sender)) {
    return {
        success: false,
        error: "Only the team lead can send shutdown requests"
    };
}
```

### TaskUpdate Conflicts

**Error 1: Task not found**
```javascript
let task = findTaskById(taskId);
if (!task) {
    return {
        success: false,
        error: `Task "${taskId}" not found`
    };
}
```

**Error 2: Ownership conflict**
```javascript
if (task.owner && task.owner !== currentAgentName) {
    return {
        success: false,
        error: `Task "${taskId}" is owned by ${task.owner}, not ${currentAgentName}`
    };
}
```

**Error 3: Dependency violation**
```javascript
if (newStatus === "completed" && task.blockedBy.some(id => !isCompleted(id))) {
    return {
        success: false,
        error: `Task "${taskId}" cannot be completed because it is blocked by incomplete tasks`
    };
}
```

---

## 7. Recovery Strategies Matrix

| Error Type | Detection | Automatic Recovery | Manual Recovery | Data Loss? |
|------------|-----------|-------------------|-----------------|------------|
| **Message delivery failure** | fs.appendFileSync throws | Return error to agent | Agent retries or continues | No (error surfaced) |
| **Orphaned messages** | Teammate process not found | None | TeamDelete + re-send | Yes (unread messages lost) |
| **Mailbox corruption (single line)** | JSON.parse throws | Skip line, parse rest | None needed | Minimal (1 message lost) |
| **Mailbox corruption (entire file)** | All lines fail parse | Recreate mailbox | Delete mailbox + re-send | Yes (all messages lost) |
| **Team config corruption** | JSON.parse or schema validation fails | Restore from backup if available | Rebuild from active panes or recreate team | Depends on backup |
| **tmux session creation failure** | exec returns non-zero | None | Fix tmux config or use different backend | No (creation never started) |
| **tmux pane creation failure** | exec returns non-zero | Cleanup partial state | Retry with different pane layout | No (cleanup removes partial state) |
| **iTerm AppleScript failure** | runAppleScript throws | None | Grant permissions or use different backend | No (creation never started) |
| **In-process agent crash** | Unhandled exception in agent loop | Mark task as crashed in AppState | Restart agent or reassign tasks | Depends on crash timing |
| **Abort controller leak** | Task remains in AppState after completion | None | Manual TeamDelete or session restart | No (state eventually cleaned up) |
| **TeamCreate validation error** | Input validation fails | None | Fix input and retry | No (validation prevents invalid state) |
| **SendMessage recipient not found** | Config lookup fails | None | Check team config or retry with correct recipient | No (message not sent) |
| **TaskUpdate ownership conflict** | Ownership check fails | None | Agent releases task or updates with correct owner | No (update prevented) |

---

## 8. Design Trade-offs

### Graceful vs Forced Shutdown

**Chosen approach**: Graceful (request → approval/rejection)

**Alternatives considered**:
- **Forced immediate**: Team lead calls `kill` on teammate process
- **Timeout-based**: Request with 30s timeout, then force kill

**Why graceful**:
- Allows teammates to save work (e.g., complete current test run)
- Provides visibility into teammate status (rejection indicates important work)
- Prevents data loss from abrupt termination

**Trade-off**: Teammates can ignore or delay shutdown. Team lead must wait for approval or manually intervene.

### Fail-Fast vs Fail-Safe on Backend Errors

**Chosen approach**: Fail-fast (return error immediately, no retries)

**Alternatives considered**:
- **Retry with backoff**: Retry pane creation 3 times before failing
- **Automatic fallback**: Try tmux → iTerm → in-process until one succeeds

**Why fail-fast**:
- Backend errors are usually persistent (tmux not installed, permissions denied)
- Retries add latency without fixing root cause
- User needs to see error to take corrective action

**Trade-off**: Single transient failure (e.g., temporary permission glitch) could prevent teammate creation unnecessarily.

### Mailbox Cleanup on Corruption

**Chosen approach**: Skip corrupted lines, preserve parseable messages

**Alternatives considered**:
- **Abort on corruption**: Refuse to read mailbox if any line is invalid
- **Recreate on corruption**: Delete entire mailbox and start fresh

**Why skip corrupted lines**:
- Maximizes message recovery (only corrupted messages lost)
- Allows teammates to continue working despite corruption
- Corruption is rare (file system usually consistent)

**Trade-off**: Silently skipping lines could mask underlying file system issues. Should log warnings prominently.

### State Consistency Priority

**Chosen approach**: Prioritize consistency over availability (block operations if state is invalid)

**Alternatives considered**:
- **Best-effort**: Allow operations even with invalid config (e.g., send messages even if config is corrupted)
- **Cached state**: Keep in-memory copy of config, continue using stale data if disk read fails

**Why consistency priority**:
- Incorrect state leads to worse errors (messages sent to dead teammates, tasks assigned to crashed agents)
- Agent teams are coordination-heavy; inconsistent state breaks collaboration
- Users can fix state issues quickly (recreate team takes ~30 seconds)

**Trade-off**: Teammates are blocked during state corruption until user intervenes. For long-running teams, this could interrupt important work.

---

## 9. Deep Error Analysis

### 9.1 Message Delivery Failure Scenarios

**Complete failure taxonomy:**

```javascript
// ============================================
// writeToMailbox error handling paths
// Location: chunks.132.mjs:22-55
// ============================================

// READABLE (for understanding):
async function writeToMailbox(recipientName, message, teamName) {
    try {
        await ensureInboxDirectoryExists(teamName);
    } catch (err) {
        // SCENARIO: Cannot create inbox directory
        // Causes: Permission denied, disk full, read-only filesystem
        // Recovery: None automatic - error surfaced to caller
        // User Action: Fix permissions or disk space, retry SendMessage
        log(`Failed to create inbox directory: ${err.message}`);
        return { success: false, error: `Cannot create inbox: ${err.message}` };
    }

    try {
        // Create mailbox file if not exists
        await writeFile(mailboxPath, "[]", { flag: "wx" });
    } catch (err) {
        if (err.code !== "EEXIST") {
            // SCENARIO: Write failed for reason other than file exists
            // Causes: Permission denied, disk full
            // Recovery: None automatic
            return { success: false, error: `Cannot create mailbox: ${err.message}` };
        }
    }

    let releaseLock;
    try {
        // Acquire lock with retry
        releaseLock = await properLockfile.lock(mailboxPath, {
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        });

        // SCENARIO: Lock acquired successfully
        let messages = await readMailbox(recipientName, teamName);
        messages.push({ ...message, read: false });
        await writeFile(mailboxPath, JSON.stringify(messages, null, 2));

    } catch (err) {
        // SCENARIO: Lock acquisition failed after 10 retries
        // Causes: High contention, slow filesystem, stale lock not detected
        // Recovery: Error returned to agent, can retry
        // User Action: Wait and retry, or manually remove .lock file if stale
        if (err.code === "ELOCKED") {
            return {
                success: false,
                error: `Could not acquire lock on mailbox for ${recipientName}. ` +
                       `Recipient may be receiving many messages. Try again later.`
            };
        }
        // SCENARIO: Other lock error (unexpected)
        return { success: false, error: `Lock error: ${err.message}` };
    } finally {
        if (releaseLock) await releaseLock();
    }
}
```

**Lock contention analysis:**

| Concurrent Writers | Lock Wait Time | Success Rate | Notes |
|-------------------|----------------|--------------|-------|
| 1 | 0ms | 100% | No contention |
| 2-3 | 5-50ms | ~99% | Brief wait, usually succeeds |
| 4-5 | 50-200ms | ~95% | Longer wait, may timeout |
| 6+ | 200-1000ms | ~80% | High chance of timeout |

**Why 10 retries with 5-100ms backoff:**
- 10 retries provides ~1 second max wait
- Exponential backoff prevents thundering herd
- Most lock holders release within 1-5ms (simple JSON write)
- Total contention duration typically <500ms for 5 writers

### 9.2 Process Crash Recovery

**In-process teammate crash:**

```
Scenario: In-process teammate throws unhandled exception during tool execution

Timeline:
T0: Teammate executing Bash tool (long-running command)
T1: Unexpected error in stdout parsing
T2: Exception bubbles up to inProcessAgentRunner catch block
T3: Catch block updates AppState:
    - status: "crashed"
    - error: errorMessage
    - endTime: Date.now()
T4: Team lead sees crashed status in UI
T5: User/team-lead decides: restart teammate or reassign tasks

State after crash:
- Task files still exist with last known status
- Mailbox may have unread messages
- AppState shows crashed task with error message

Recovery options:
1. Restart: Create new teammate with same agentName
   - New agentId generated
   - Reads mailbox (may find old unread messages)
   - Can see task list, claim available tasks

2. Reassign: Team lead reassigns tasks via TaskUpdate
   - Changes owner field
   - Other teammates can pick up work

3. Ignore: Leave crashed state, team continues without this agent
```

**Pane-based teammate crash (separate process):**

```
Scenario: tmux pane process dies unexpectedly

Detection paths:
1. Team lead checks team config, sees member still registered
2. SendMessage to teammate fails (no response)
3. User notices pane is dead (visually in terminal)
4. tmux list-panes shows pane no longer exists

Recovery:
1. Team lead calls TeamDelete with force flag
2. Removes teammate from config
3. Unassigns tasks owned by crashed teammate
4. Optionally: spawn new teammate with same name
```

### 9.3 State Corruption Recovery Procedures

**Team config corruption:**

```bash
# Detection: Read config shows invalid JSON
$ cat ~/.claude/teams/my-team/config.json
{"teamName": "my-team", "members": [{"agentId": "abc", "agentName": "backend-dev

# Missing closing bracket, truncated

# Recovery Option 1: Restore from backup (if exists)
$ cp ~/.claude/teams/my-team/config.json.backup ~/.claude/teams/my-team/config.json

# Recovery Option 2: Rebuild from running processes
$ tmux list-panes -F "#{pane_id} #{pane_current_command}"
%12 claude  # team lead
%13 claude  # backend-dev
%14 claude  # frontend-dev

# Manually rebuild config.json with discovered panes

# Recovery Option 3: Delete and recreate team
$ rm -rf ~/.claude/teams/my-team
# Then use TeamCreate tool to recreate
```

**Mailbox corruption:**

```bash
# Detection: JSON.parse fails on mailbox read
$ cat ~/.claude/teams/my-team/inboxes/backend-dev.json
[
  {"from": "team-lead", "text": "Task 1", "read": true},
  {"from": "team-lead", "text": "Task 2", "rea
# Truncated mid-message

# Recovery: Archive corrupted, start fresh
$ mv ~/.claude/teams/my-team/inboxes/backend-dev.json \
     ~/.claude/teams/my-team/inboxes/backend-dev.json.corrupted-$(date +%s)
$ echo "[]" > ~/.claude/teams/my-team/inboxes/backend-dev.json

# Lost: All unread messages for backend-dev
# Impact: Team lead must re-send critical messages
```

### 9.4 Graceful Shutdown Timeout Handling

**What happens if teammate doesn't respond to shutdown:**

```
Timeline with 30-second timeout (not implemented, hypothetical):

T0: Team lead sends shutdown_request to backend-dev
T1: backend-dev receives request in poll loop (Priority 2)
T2: backend-dev agent loop processes shutdown, calls handleShutdownApproval
T3: Wait for agent to complete current work

SCENARIO A: Agent responds quickly
  T5: handleShutdownApproval returns
  T6: Abort signal sent
  T7: Process exits
  Result: Clean shutdown in ~5 seconds

SCENARIO B: Agent is mid-long-operation (e.g., running test suite)
  T30: Agent still executing tests
  T60: Agent still executing tests
  T120: User gives up waiting

Current implementation (no timeout):
  - Shutdown request sits in mailbox until processed
  - Agent may take minutes to finish current work
  - User must wait or force-kill (which loses work)

Potential improvement:
  - Add configurable timeout to shutdown_request
  - If timeout expires without approval, escalate to killInProcessTeammate
  - Force cleanup with potential data loss
```

---

## 10. Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `handleShutdownApproval` (YxY) - Process teammate approval of shutdown request, trigger termination @ chunks.145.mjs:2443
- `handleShutdownRejection` (zxY) - Process teammate rejection of shutdown request @ chunks.145.mjs:2499
- `createShutdownApprovalResponse` (Gx8) - Format shutdown approval message @ chunks.145.mjs:2456
- `createShutdownRejectionResponse` (fx8) - Format shutdown rejection message @ chunks.145.mjs:2502
- `killInProcessTeammate` (bZ1) - Force-kill an in-process teammate @ chunks.113.mjs:1272
- `writeToMailbox` (x3) - Send message to teammate mailbox @ chunks.132.mjs:22
- `readMailbox` (wl) - Read messages from mailbox @ chunks.132.mjs:3
- `readTeamConfig` (M51) - Read team configuration from disk @ chunks.131.mjs:2046
- `writeTeamConfig` (mSY) - Write team configuration to disk
- `getTeamConfigPath` (ul4) - Resolve path to team config file
- `findTaskByAgentId` (_g) - Lookup task in AppState by agent ID
- `gracefulExit` (Vq) - Exit process gracefully with cleanup @ chunks.117.mjs:899
- `getCurrentTeamName` (l5) - Get current session's team name
- `getCurrentAgentId` (nM) - Get current session's agent ID
- `getCurrentAgentName` (i3) - Get current session's agent name
- `TmuxBackend` (Ju8) - Tmux terminal backend implementation @ chunks.134.mjs:2411
- `ITermBackend` (Xu8) - iTerm2 terminal backend implementation @ chunks.135.mjs:11
- `getBackend` (zt) - Get backend instance by type @ chunks.131.mjs:1493
- `TEAM_LEAD_ID` (BY) - Constant for team lead identifier ("team-lead") @ chunks.131.mjs:1981
- `properLockfile` (Nc6) - npm library for file locking @ chunks.132.mjs:437
- `lockOptions` (iv1) - Lock retry configuration @ chunks.132.mjs:463
- `markMessageAsReadByIndex` (Vc6) - Mark mailbox message as read @ chunks.132.mjs:57
- `parseShutdownRequest` (ss) - Parse shutdown request from message @ chunks.131.mjs:1396

Cross-references:

- [hooks_integration.md](./hooks_integration.md) - Hook error handling and telemetry
- [pane_backend_executor.md](./pane_backend_executor.md) - Poll loop abort handling
- [agent_teams_architecture.md](./agent_teams_architecture.md) - Overall team architecture
- [inter_agent_communication.md](./inter_agent_communication.md) - Message delivery and mailbox system
- [03_mailbox_and_locking.md](./03_mailbox_and_locking.md) - File locking implementation details
- [04_polling_priorities.md](./04_polling_priorities.md) - Priority 2 shutdown bypass
