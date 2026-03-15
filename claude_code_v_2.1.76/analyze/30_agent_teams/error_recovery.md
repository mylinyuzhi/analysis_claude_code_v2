# Error Recovery - Agent Team Failure Handling

> **Module**: Agent Teams - Error Recovery and Resilience
> **Source**: `chunks.141.mjs` (lines 1160-1237, 530-758), `chunks.131.mjs` (lines 1144-1500)
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

1. **Extract context**: Get `teamName`, `agentName`, `request_id`, and `content` (rejection reason)

2. **Format rejection message**: Create `shutdown_rejection_response` with:
   - `requestId`: Original request ID
   - `from`: Teammate name rejecting shutdown
   - `reason`: User-provided explanation

3. **Send rejection to team-lead**: Call `sendTeamMessage(team-lead, rejectionMessage, teamName)`

4. **Return success response**: Return `{success: true, message: "Shutdown rejected. Reason: {reason}. Continuing to work."}`

**Why rejection is important**: Allows teammates to push back if:
- Critical work is in progress (unsaved changes, running tests)
- Shutdown timing is inappropriate
- User wants to investigate why shutdown was requested

```javascript
// ============================================
// handleShutdownApproval - Process teammate approval of shutdown request
// Location: chunks.141.mjs:1160-1214
// ============================================

// ORIGINAL (for source lookup):
async function tSY(A, q) {
    let K = i3(), Y = ID(), z = g5() || "teammate", w = A.request_id;
    let H, $;
    if (K) {
        let _ = M51(K);
        if (_ && Y) {
            let J = _.members.find((X) => X.agentId === Y);
            if (J) H = J.tmuxPaneId, $ = J.backendType
        }
    }
    let O = mvA({ requestId: w, from: z, paneId: H, backendType: $ });
    if (f9(K2, { from: z, text: Q1(O), timestamp: new Date().toISOString(), color: b$() }, K), $ === "in-process") {
        if (Y) {
            let _ = await q.getAppState(), J = ps(Y, _.tasks);
            if (J?.abortController) J.abortController.abort();
        }
    } else {
        if (Y) {
            let _ = await q.getAppState(), J = ps(Y, _.tasks);
            if (J?.abortController) return J.abortController.abort(), { data: { success: !0, message: `Shutdown approved (fallback path). Agent ${z} is now exiting.`, request_id: w } }
        }
        setImmediate(async () => { await nK(0, "other") })
    }
    return { data: { success: !0, message: `Shutdown approved. Sent confirmation to team-lead. Agent ${z} is now exiting.`, request_id: w } }
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

// Mapping: tSY→handleShutdownApproval, A→request, q→toolUseContext, K→teamName, Y→agentId, z→agentName, w→requestId, H→tmuxPaneId, $→backendType, _→teamConfig/appState, J→memberInfo/task, X→member, O→confirmationMessage, i3→getCurrentTeamName, ID→getCurrentAgentId, g5→getCurrentAgentName, M51→readTeamConfig, mvA→createShutdownApprovalResponse, f9→sendTeamMessage, K2→TEAM_LEAD_NAME, Q1→JSON.stringify, b$→getAgentColor, ps→findTaskByAgentId, nK→gracefulExit


// ============================================
// handleShutdownRejection - Process teammate rejection of shutdown request
// Location: chunks.141.mjs:1216-1237
// ============================================

// ORIGINAL (for source lookup):
function eSY(A) {
    let q = i3(), K = g5() || "teammate", Y = A.request_id, z = FvA({ requestId: Y, from: K, reason: A.content || "" });
    return f9(K2, { from: K, text: Q1(z), timestamp: new Date().toISOString(), color: b$() }, q), { data: { success: !0, message: `Shutdown rejected. Reason: "${A.content}". Continuing to work.`, request_id: Y } }
}

// READABLE (for understanding):
function handleShutdownRejection(request) {
    let teamName = getCurrentTeamName();
    let agentName = getCurrentAgentName() || "teammate";
    let requestId = request.request_id;

    // Format rejection message
    let rejectionMessage = createShutdownRejectionResponse({
        requestId: requestId,
        from: agentName,
        reason: request.content || ""
    });

    // Send rejection to team-lead
    sendTeamMessage(TEAM_LEAD_NAME, {
        from: agentName,
        text: JSON.stringify(rejectionMessage),
        timestamp: new Date().toISOString(),
        color: getAgentColor()
    }, teamName);

    return {
        data: {
            success: true,
            message: `Shutdown rejected. Reason: "${request.content}". Continuing to work.`,
            request_id: requestId
        }
    };
}

// Mapping: eSY→handleShutdownRejection, A→request, q→teamName, K→agentName, Y→requestId, z→rejectionMessage, FvA→createShutdownRejectionResponse, f9→sendTeamMessage, K2→TEAM_LEAD_NAME, Q1→JSON.stringify, b$→getAgentColor, i3→getCurrentTeamName, g5→getCurrentAgentName
```

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

## 9. Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `handleShutdownApproval` (tSY) - Process teammate approval of shutdown request, trigger termination
- `handleShutdownRejection` (eSY) - Process teammate rejection of shutdown request
- `sendTeamMessage` (f9) - Send message to teammate mailbox
- `readTeamConfig` (M51) - Read team configuration from disk
- `writeTeamConfig` (mSY) - Write team configuration to disk
- `getTeamConfigPath` (ul4) - Resolve path to team config file
- `findTaskByAgentId` (ps) - Lookup task in AppState by agent ID
- `gracefulExit` (nK) - Exit process gracefully with cleanup
- `getCurrentTeamName` (i3) - Get current session's team name
- `getCurrentAgentId` (ID) - Get current session's agent ID
- `getCurrentAgentName` (g5) - Get current session's agent name
- `createShutdownApprovalResponse` (mvA) - Format shutdown approval message
- `createShutdownRejectionResponse` (FvA) - Format shutdown rejection message
- `TmuxBackend` (fEA) - Tmux terminal backend implementation
- `ITermBackend` (EEA) - iTerm2 terminal backend implementation
- `getBackend` (zt) - Get backend instance by type
- `TEAM_LEAD_NAME` (K2) - Constant for team lead identifier

Cross-references:

- [hooks_integration.md](./hooks_integration.md) - Hook error handling and telemetry
- [pane_backend_executor.md](./pane_backend_executor.md) - Poll loop abort handling
- [agent_teams_architecture.md](./agent_teams_architecture.md) - Overall team architecture
- [inter_agent_communication.md](./inter_agent_communication.md) - Message delivery and mailbox system
