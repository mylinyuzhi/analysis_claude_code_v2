# Complete Functionality Chain Analysis - Agent Teams

> **Module**: Agent Teams - End-to-End Flow Analysis
> **Version**: Claude Code 2.1.76
> **Purpose**: Trace every step from team creation trigger through task completion to final cleanup

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Trigger Mechanisms](#2-trigger-mechanisms)
3. [Team Initialization Chain](#3-team-initialization-chain)
4. [Teammate Spawning Chain](#4-teammate-spawning-chain)
5. [Message Flow Chain](#5-message-flow-chain)
6. [Task Coordination Chain](#6-task-coordination-chain)
7. [Shutdown Chain](#7-shutdown-chain)
8. [Complete Flow Diagram](#8-complete-flow-diagram)
9. [Design Rationale & Trade-offs](#9-design-rationale--trade-offs)

---

## 1. Executive Summary

Agent Teams implement a **filesystem-backed multi-agent collaboration system** where the main Claude session (team lead) coordinates with background Claude processes (teammates). The complete functionality chain spans:

1. **Trigger**: User request or LLM autonomous decision → TeamCreate tool
2. **Initialization**: Filesystem directories created → team config written → AppState updated
3. **Spawning**: Backend selected → agent spawned (in-process OR pane-based) → poll loop started
4. **Messaging**: Mailbox files + file locking → priority-based delivery
5. **Task coordination**: Shared task ledger → atomic claim operations → dependency resolution
6. **Shutdown**: Request/approval protocol → graceful termination → cleanup

**Key architectural decision**: All inter-agent coordination uses **persistent filesystem state** (`~/.claude/teams/`, `~/.claude/tasks/`) rather than memory-only state. This enables:
- **Crash resilience**: Teams survive process restarts (task state persists)
- **Multi-process coordination**: Pane-based teammates are separate processes with no shared memory
- **Debuggability**: Filesystem inspection reveals exact team state

**Trade-off**: Filesystem I/O adds latency vs in-memory messaging, but provides durability and multi-process support. The 500ms poll interval masks most of this latency.

---

## 2. Trigger Mechanisms

### 2.1 LLM Autonomous Team Proposal

**What it does**: The LLM autonomously decides a task requires multiple agents and proposes creating a team.

**How it works**:

1. **User provides complex prompt**:
   ```
   "Build a full-stack web app with React frontend and Node.js backend"
   ```

2. **LLM analyzes scope** during planning phase:
   - Recognizes multiple distinct skill domains (frontend, backend, DB)
   - Determines parallel execution would accelerate delivery
   - Has access to TeamCreate tool in tool list

3. **LLM outputs TeamCreate tool call**:
   ```xml
   <tool_use>
     <tool_name>TeamCreate</tool_name>
     <parameters>
       <name>web-app-team</name>
       <description>Team to build full-stack application</description>
     </parameters>
   </tool_use>
   ```

4. **Agent loop dispatcher** routes to TeamCreate tool handler

**Why this approach**:
- **User doesn't need to know about teams**: Natural delegation
- **LLM context determines team need**: Based on task complexity, not user knowledge
- **Tool-based invocation**: Consistent with all other Claude Code capabilities

**Alternative considered**: User-initiated slash command `/team create`.
**Trade-off**: Slash commands are explicit but require user awareness. Autonomous tool use is more natural but may surprise users.

### 2.2 User Explicit Request

**What it does**: User directly asks for team creation.

**How it works**:

1. **User types explicit request**:
   ```
   "Create a team called 'refactor-team' with members for backend and frontend"
   ```

2. **LLM interprets user intent** and calls TeamCreate tool (same as 2.1)

3. **Team initialization proceeds** (see section 3)

**Why this approach**: Gives users full control over team lifecycle.

**Key insight**: Both autonomous and explicit paths converge at the **TeamCreate tool call** - the system doesn't distinguish between them. This simplifies implementation (single code path) and ensures consistent behavior.

### 2.3 CLI Teammate Launch

**What it does**: External Claude process launched with `--teammate-mode` joins existing team.

**How it works**:

1. **Pane-based backend spawns teammate** (see section 4.3):
   ```bash
   claude \
     --teammate-mode \
     --agent-id "abc123" \
     --agent-name "backend-dev" \
     --team-name "web-app-team" \
     --use-session-memory
   ```

2. **CLI argument parser** detects `--teammate-mode` flag

3. **Bootstrap sequence**:
   ```
   mainEntry (chunks.190.mjs:931)
     → detect --teammate-mode flag
     → read team config from ~/.claude/teams/{team-name}/config.json
     → inject teammate system prompts (role, team members, task list location)
     → start agent loop with inProcessPollLoop (WVY)
   ```

4. **Teammate begins polling** for messages/tasks

**Why this approach**:
- **Reuses existing CLI**: No separate teammate binary
- **Full agent capabilities**: Teammate has same tool access as lead
- **Standard process model**: Each pane = one Claude process

**Edge case handling**: If `--team-name` doesn't exist, teammate errors immediately with "Team config not found" rather than creating partial state.

---

## 3. Team Initialization Chain

### 3.1 TeamCreate Tool Invocation

**Complete execution flow:**

```
TeamCreateTool.call(input, context)  [chunks.141.mjs:571]
  |
  ├─→ Validate input
  |     └─→ sanitizeTeamName(input.name)  [chunks.141.mjs:543]
  |           • Remove special chars, convert to lowercase, replace spaces with hyphens
  |           • Prevent directory traversal: strip "..", "/", "\"
  |           • Example: "My Team!" → "my-team"
  |
  ├─→ Check team doesn't already exist
  |     └─→ fs.existsSync(~/.claude/teams/{sanitized-name}/)
  |
  ├─→ Backend availability check
  |     └─→ getBackend(useSplitPane)  [chunks.131.mjs:1493]
  |           ├─→ isInProcessEnabled() → return InProcessBackend
  |           └─→ else → detect tmux/iTerm2 backend
  |                 • tmux: check $TMUX env var + which tmux
  |                 • iTerm2: check $TERM_PROGRAM + which it2
  |                 • If none available → error "No backend available"
  |
  ├─→ Create team directories
  |     ├─→ fs.mkdirSync(~/.claude/teams/{name}/, {recursive: true})
  |     ├─→ fs.mkdirSync(~/.claude/teams/{name}/inboxes/, {recursive: true})
  |     └─→ fs.mkdirSync(~/.claude/tasks/{name}/, {recursive: true})
  |
  ├─→ Write team configuration
  |     └─→ writeTeamConfig(teamName, config)  [chunks.141.mjs:534]
  |           • File: ~/.claude/teams/{name}/config.json
  |           • Content:
  |             {
  |               "leadAgentId": "current-session-id",
  |               "members": [],
  |               "createdAt": "2024-02-14T08:00:00.000Z"
  |             }
  |
  ├─→ Update AppState with team context
  |     └─→ context.updateAppState(state => ({
  |           ...state,
  |           teamContext: {
  |             teamName: sanitizedName,
  |             role: "team-lead",
  |             isTeamLead: true
  |           }
  |         }))
  |
  └─→ Return success message
        • "Team '{name}' created successfully. Use SpawnTeammate to add members."
```

### 3.2 Directory Structure Created

```
~/.claude/
  ├─ teams/
  │   └─ {team-name}/
  │       ├─ config.json          # Team metadata
  │       └─ inboxes/              # Message mailboxes (created but empty)
  │           ├─ team-lead.json   # (created on first message)
  │           ├─ backend-dev.json
  │           └─ frontend-dev.json
  │
  └─ tasks/
      └─ {team-name}/
          ├─ task-1.json          # Individual task files (created by TaskCreate)
          ├─ task-2.json
          └─ task-3.json
```

### 3.3 Design Rationale: Filesystem-Backed State

**Why filesystem instead of in-memory state?**

| Approach | Pros | Cons |
|----------|------|------|
| **Filesystem** (chosen) | • Survives process crashes<br>• Multi-process coordination works<br>• Debuggable (cat ~/.claude/teams/...)<br>• No distributed consensus needed | • Slower (fs I/O)<br>• Race conditions need locking<br>• Disk space usage |
| **In-memory** (not chosen) | • Faster (no I/O)<br>• No locking needed<br>• Simpler code | • Lost on crash<br>• Requires IPC for multi-process<br>• Hard to debug |
| **Database** (not chosen) | • ACID transactions<br>• Efficient querying<br>• Mature concurrency | • Dependency on DB process<br>• Overkill for small teams<br>• Setup complexity |

**Decision**: Filesystem state provides the **minimum viable durability** for multi-agent coordination without external dependencies. Most teams are small (2-5 agents), so filesystem performance is adequate.

**Key insight**: The `~/.claude/teams/` directory is the **source of truth**. AppState is an **ephemeral cache** - if it diverges from disk, disk wins.

### 3.4 Edge Cases & Error Handling

| Error Condition | Detection | Recovery | User Experience |
|----------------|-----------|----------|-----------------|
| Team name collision | `fs.existsSync()` before mkdir | Reject with error | "Team 'X' already exists. Use TeamDelete first." |
| No backend available | `getBackend()` returns null | Reject tool call | "Cannot create team: tmux/iTerm2 not available" |
| Directory creation fails | `fs.mkdirSync()` throws | Clean up partial state, throw | "Failed to create team directories: {reason}" |
| Config write fails | `fs.writeFileSync()` throws | Clean up directories, throw | "Failed to write team config: {reason}" |
| AppState update fails | Exception in updateAppState | Team created but not active | Team exists on disk but lead doesn't know it's the lead |

**Atomic creation guarantee**: None. If directory creation succeeds but config write fails, you get orphaned directories. **Mitigation**: TeamDelete can clean up teams even if config.json is missing.

**Why no transactions**: Filesystem doesn't support atomic multi-file operations. Accepted trade-off: manual cleanup in rare error cases vs complexity of distributed transactions.

---

## 4. Teammate Spawning Chain

### 4.1 SpawnTeammate Tool Entry Point

**Tool call structure:**
```javascript
SpawnTeammate({
  agentName: "backend-dev",
  prompt: "You are the backend developer. Implement the API endpoints.",
  planModeRequired: true,  // Optional: force teammate to plan before executing
  useSplitPane: false      // Optional: override default backend selection
})
```

### 4.2 Spawn Mode Selection Algorithm

**Decision tree (obfuscated: iVY / spawnTeammateDispatcher):**

```
spawnTeammateDispatcher(params, context)  [chunks.131.mjs:2467]
  |
  ├─→ Check: isInProcessEnabled()?  [chunks.131.mjs:1586]
  |     ├─→ YES → spawnInProcessTeammate(...)  [chunks.123.mjs:242]
  |     |     • Backend: InProcessBackend (nb4)
  |     |     • Execution: Same Node.js process, separate agent loop
  |     |     • Communication: Shared AppState + mailbox files
  |     |
  |     └─→ NO → Check useSplitPane parameter
  |           |
  |           ├─→ useSplitPane !== false (default) →
  |           |     spawnSplitPaneTeammate(...)  [chunks.131.mjs:2077]
  |           |     • Backend: TmuxBackend or ITermBackend
  |           |     • Execution: New tmux pane OR iTerm2 pane
  |           |     • Communication: Mailbox files only (no shared memory)
  |           |
  |           └─→ useSplitPane === false →
  |                 spawnSeparateWindowTeammate(...)  [chunks.131.mjs:2202]
  |                 • Backend: External tmux session "claude-swarm"
  |                 • Execution: New window in separate tmux session
  |                 • Communication: Mailbox files only
```

**isInProcessEnabled() logic**:
```javascript
// ============================================
// isInProcessEnabled - Determines if in-process backend should be used
// Location: chunks.131.mjs:1586-1595
// ============================================

// ORIGINAL (for source lookup):
function Rm() {
    return Y0(process.env.FORCE_IN_PROCESS) || !process.stdin.isTTY || !OI() && !j51()
}

// READABLE (for understanding):
function isInProcessEnabled() {
    // Force in-process mode via env var
    if (parseBoolean(process.env.FORCE_IN_PROCESS)) return true;

    // Non-interactive session (no TTY) → must use in-process
    if (!process.stdin.isTTY) return true;

    // No tmux AND no iTerm2 available → fallback to in-process
    if (!isRunningInsideTmux() && !isRunningInIterm2()) return true;

    return false;
}

// Mapping: Rm→isInProcessEnabled, Y0→parseBoolean, OI→isRunningInsideTmux, j51→isRunningInIterm2
```

**Why this approach**:

1. **Non-interactive defaults to in-process**: CI/CD environments or SSH sessions without tmux can't spawn panes
2. **Backend availability fallback**: If user has no terminal multiplexer, in-process is the only option
3. **User override**: `FORCE_IN_PROCESS=1` for debugging or testing in-process behavior

**Trade-off**: In-process mode shares one Node.js event loop between all agents. CPU-intensive work in one agent blocks others. Pane-based mode provides full process isolation but requires tmux/iTerm2.

### 4.3 Split-Pane Spawning (tmux Backend Example)

**Complete flow:**

```
spawnSplitPaneTeammate(agentName, prompt, planMode, context)
  |
  ├─→ Get backend instance
  |     └─→ getBackend(useSplitPane=true)  [chunks.131.mjs:1493]
  |           └─→ isRunningInsideTmux() → return TmuxBackend instance
  |
  ├─→ Register teammate in team config
  |     └─→ Update ~/.claude/teams/{name}/config.json
  |           • Add to members array:
  |             {
  |               "agentId": "uuid-generated",
  |               "agentName": "backend-dev",
  |               "backendType": "tmux",
  |               "tmuxPaneId": null,  // Filled after spawn
  |               "spawnedAt": "2024-02-14T08:05:00.000Z"
  |             }
  |
  ├─→ Create teammate pane
  |     └─→ backend.createTeammatePaneWithLeader(...)  [TmuxBackend method]
  |           |
  |           ├─→ Get leader pane ID
  |           |     └─→ tmux display-message -p "#{pane_id}"
  |           |           • Returns: "%12"
  |           |
  |           ├─→ Calculate pane layout (see section 4.4)
  |           |     └─→ First teammate: horizontal split (70% for teammates)
  |           |           Subsequent: alternating vertical/horizontal
  |           |
  |           ├─→ Create new pane
  |           |     └─→ tmux split-window -t %12 -h -l 70%
  |           |           • Returns new pane ID: "%13"
  |           |
  |           └─→ Set pane border color
  |                 └─→ tmux select-pane -t %13 -P "bg=#3b82f6"
  |                       • Color from agentId hash
  |
  ├─→ Build teammate launch command
  |     └─→ buildTeammateCommand(agentName, teamName, agentId, prompt)
  |           • Result:
  |             claude \
  |               --teammate-mode \
  |               --agent-id "uuid-generated" \
  |               --agent-name "backend-dev" \
  |               --team-name "web-app-team" \
  |               --use-session-memory \
  |               --initial-prompt "You are the backend developer..."
  |
  ├─→ Send command to pane
  |     └─→ backend.sendCommand(paneId, command)
  |           └─→ tmux send-keys -t %13 "{command}" Enter
  |
  ├─→ Update team config with pane ID
  |     └─→ Write tmuxPaneId: "%13" to member config
  |
  └─→ Return success
        • Message: "Spawned teammate 'backend-dev' in tmux pane %13"
```

### 4.4 Tmux Pane Layout Algorithm

**Problem**: How to arrange N teammates in a visually balanced layout?

**Algorithm** (obfuscated: createTeammatePaneWithLeader in TmuxBackend):

```javascript
// ============================================
// TmuxBackend.createTeammatePaneWithLeader - Layout calculation for balanced pane arrangement
// Location: chunks.131.mjs:1144-1380 (TmuxBackend class)
// ============================================

// READABLE (for understanding):
async function createTeammatePaneWithLeader(agentName, teamName, agentId) {
    const leaderPaneId = await this.getLeaderPaneId();  // e.g., "%12"
    const existingTeammatePanes = await this.listTeammatePanes();
    const teammateCount = existingTeammatePanes.length;

    if (teammateCount === 0) {
        // First teammate: horizontal split, give teammates 70%
        const newPaneId = await this.tmux([
            "split-window",
            "-t", leaderPaneId,
            "-h",          // horizontal split
            "-l", "70%",   // new pane gets 70% of width
            "-P",          // print new pane ID
            "-F", "#{pane_id}"
        ]);

        // Leader is now in 30% left pane, teammate in 70% right pane
        return newPaneId.trim();
    } else {
        // Subsequent teammates: alternate vertical/horizontal for tiling
        const shouldSplitVertical = (teammateCount % 2 === 1);

        // Target the middle pane for visual balance
        const targetPaneIndex = Math.floor((teammateCount - 1) / 2);
        const targetPane = existingTeammatePanes[targetPaneIndex];

        const newPaneId = await this.tmux([
            "split-window",
            "-t", targetPane,
            shouldSplitVertical ? "-v" : "-h",  // alternate direction
            "-P",
            "-F", "#{pane_id}"
        ]);

        return newPaneId.trim();
    }
}
```

**Visual example** (4 teammates):

```
Iteration 0 (leader only):
┌───────────────────┐
│   Leader (%12)    │
│                   │
└───────────────────┘

Iteration 1 (first teammate):
Split horizontal, 30%/70%
┌─────┬─────────────┐
│     │             │
│ L   │  T1 (%13)   │
│     │             │
└─────┴─────────────┘
 30%       70%

Iteration 2 (second teammate):
Split T1 vertically (count=1, odd)
┌─────┬─────────────┐
│     │  T1 (%13)   │
│ L   ├─────────────┤
│     │  T2 (%14)   │
└─────┴─────────────┘

Iteration 3 (third teammate):
Split T1 horizontally (count=2, even)
┌─────┬──────┬──────┐
│     │  T1  │  T3  │
│ L   │      │ (%15)│
│     ├──────┴──────┤
│     │     T2      │
└─────┴─────────────┘

Iteration 4 (fourth teammate):
Split T2 vertically (count=3, odd, target middle)
┌─────┬──────┬──────┐
│     │  T1  │  T3  │
│ L   │      │      │
│     ├──────┴──────┤
│     │  T2  │  T4  │
└─────┴──────┴──────┘
```

**Why this approach**:

- **30% leader pane**: Enough to monitor, but doesn't dominate screen
- **Alternating splits**: Creates balanced grid instead of linear stack
- **Target middle pane**: Maintains visual symmetry
- **No rebalancing during spawn**: Layout only adjusts after spawn completes (see section 4.5)

**Trade-off**: Simple algorithm creates reasonably balanced layouts for 2-6 teammates. For >6, layout becomes cramped. Mitigation: Use separate window mode or external swarm view.

### 4.5 Layout Rebalancing

**Trigger**: After each teammate spawn completes

**Algorithm**:
```bash
# Apply tmux's built-in layout algorithm
tmux select-layout -t {session}:{window} main-vertical

# Manually resize leader pane to 30%
tmux resize-pane -t {leader-pane} -x 30%

# Apply tiled layout to all teammate panes
tmux select-layout -t {teammate-panes} tiled
```

**Why separate rebalancing step**:
- **tmux limitation**: Can't specify exact multi-pane layouts in one command
- **Visual consistency**: main-vertical ensures leader always gets left column
- **Tiled teammate area**: Distributes remaining space evenly

**Trade-off**: Brief visual flicker during rebalance. Acceptable because spawn is infrequent.

### 4.6 In-Process Spawning

**Complete flow:**

```
spawnInProcessTeammate(agentName, prompt, planMode, context)
  |
  ├─→ Generate unique agent ID
  |     └─→ crypto.randomUUID() → "550e8400-e29b-41d4-a716-446655440000"
  |
  ├─→ Create teammate context
  |     └─→ {
  |           agentId,
  |           agentName,
  |           teamName,
  |           role: "teammate",
  |           isTeamLead: false,
  |           initialPrompt: prompt
  |         }
  |
  ├─→ Register in AppState
  |     └─→ context.updateAppState(state => ({
  |           ...state,
  |           tasks: [
  |             ...state.tasks,
  |             {
  |               id: taskId,
  |               type: "in_process_teammate",
  |               agentId,
  |               agentName,
  |               status: "running",
  |               abortController: new AbortController(),
  |               pendingUserMessages: []  // For Priority 1 messages
  |             }
  |           ]
  |         }))
  |
  ├─→ Start in-process agent runner
  |     └─→ inProcessAgentRunner(context, abortSignal)  [chunks.131.mjs:347]
  |           |
  |           ├─→ Build system prompt
  |           |     • "You are {agentName} in team '{teamName}'"
  |           |     • "Team members: team-lead, backend-dev, frontend-dev"
  |           |     • "Use SendMessage to coordinate"
  |           |     • "Use TaskUpdate to claim tasks"
  |           |     • Initial prompt appended
  |           |
  |           ├─→ Start poll loop
  |           |     └─→ inProcessPollLoop(...)  [chunks.131.mjs:260]
  |           |           • Returns next message from priority queue
  |           |           • Blocks until message available or aborted
  |           |
  |           ├─→ For each message from poll loop:
  |           |     ├─→ Inject as user message
  |           |     ├─→ Run agent loop iteration
  |           |     └─→ Repeat
  |           |
  |           └─→ On abort signal:
  |                 • Exit poll loop
  |                 • Clean up agent state
  |                 • Mark task as completed in AppState
  |
  └─→ Return success (non-blocking)
        • Message: "Spawned in-process teammate 'backend-dev'"
```

**Key insight**: In-process teammates are **cooperative tasks** managed by AppState. They share the main process's event loop but run as independent agent loop iterations. The poll loop acts as a **virtual message queue** - teammates appear to be separate agents but are actually interleaved executions.

**Why this approach**:
- **No process overhead**: Spawn is instant (no exec/fork)
- **Shared memory efficiency**: AppState access is synchronous
- **Simpler debugging**: Single process to attach debugger

**Trade-off**: CPU-intensive teammate blocks entire process. Mitigation: Use pane-based mode for compute-heavy work.

---

## 5. Message Flow Chain

### 5.1 SendMessage Tool Call

**Entry point**:
```javascript
SendMessage({
  type: "message",
  recipient: "backend-dev",
  content: "Please implement the POST /users endpoint",
  summary: "Implement POST /users"  // 5-10 words for UI display
})
```

### 5.2 Message Delivery Path

**Complete flow:**

```
SendMessageTool.call(input, context)  [chunks.141.mjs:1373]
  |
  ├─→ Dispatch by message type
  |     └─→ if (input.type === "message") → handleDirectMessage(...)
  |
  └─→ handleDirectMessage(input, context)  [chunks.141.mjs:1432]
        |
        ├─→ Validate recipient exists
        |     └─→ Read team config
        |           • Check if recipient in members list
        |           • If not found: error "Agent '{recipient}' not in team"
        |
        ├─→ Construct message object
        |     └─→ {
        |           from: getAgentName() || "team-lead",
        |           to: input.recipient,
        |           text: input.content,
        |           summary: input.summary,
        |           timestamp: new Date().toISOString(),
        |           color: "#3b82f6",  // from sender's agent ID hash
        |           read: false
        |         }
        |
        ├─→ Write to recipient's mailbox
        |     └─→ writeToMailbox(recipient, message, teamName)  [chunks.129.mjs:1107]
        |           |
        |           ├─→ Get mailbox path
        |           |     └─→ ~/.claude/teams/{teamName}/inboxes/{recipient}.json
        |           |
        |           ├─→ Ensure inbox directory exists
        |           |     └─→ fs.mkdirSync(inboxes/, {recursive: true})
        |           |
        |           ├─→ Acquire file lock (see section 5.3)
        |           |     └─→ lockfile.lock(mailboxPath + ".lock", {
        |           |           retries: { retries: 5, minTimeout: 100 },
        |           |           stale: 60000  // 60 seconds
        |           |         })
        |           |
        |           ├─→ Read existing messages
        |           |     └─→ readMailbox(recipient, teamName)
        |           |           • If file doesn't exist: return []
        |           |           • else: JSON.parse(fs.readFileSync(mailboxPath))
        |           |
        |           ├─→ Append new message
        |           |     └─→ messages.push(message)
        |           |
        |           ├─→ Write back to disk
        |           |     └─→ fs.writeFileSync(mailboxPath, JSON.stringify(messages, null, 2))
        |           |
        |           └─→ Release lock
        |                 └─→ lockfile.unlock(mailboxPath + ".lock")
        |
        ├─→ If recipient is in-process:
        |     └─→ Inject message into pendingUserMessages
        |           • context.updateAppState(state => {
        |               const task = findTaskByAgentId(recipientId);
        |               task.pendingUserMessages.push({
        |                 type: "message",
        |                 from: senderName,
        |                 content: input.content
        |               });
        |             })
        |           • This triggers Priority 1 delivery (see section 5.4)
        |
        └─→ Return success
              • "Message sent to {recipient}"
```

### 5.3 File Locking Deep Dive

**Problem**: Multiple agents writing to same mailbox simultaneously causes race condition.

**Without locking (BROKEN)**:
```
Time  | Agent A (team-lead)            | Agent B (backend-dev)
------|--------------------------------|---------------------------
t0    | Read mailbox: [msg1, msg2]     |
t1    |                                | Read mailbox: [msg1, msg2]
t2    | Append msg3: [msg1, msg2, msg3]|
t3    | Write to disk                  |
t4    |                                | Append msg4: [msg1, msg2, msg4]
t5    |                                | Write to disk
------|--------------------------------|---------------------------
Result: msg3 LOST! File contains [msg1, msg2, msg4]
```

**With locking (CORRECT)**:
```
Time  | Agent A (team-lead)            | Agent B (backend-dev)
------|--------------------------------|---------------------------
t0    | Acquire lock (success)         |
t1    | Read: [msg1, msg2]             | Acquire lock (BLOCKED, waiting)
t2    | Append msg3                    | (still waiting...)
t3    | Write: [msg1, msg2, msg3]      |
t4    | Release lock                   |
t5    |                                | Acquire lock (success)
t6    |                                | Read: [msg1, msg2, msg3]
t7    |                                | Append msg4
t8    |                                | Write: [msg1, msg2, msg3, msg4]
t9    |                                | Release lock
------|--------------------------------|---------------------------
Result: Both messages preserved!
```

**Lock file implementation** (via `proper-lockfile` library):

```javascript
// ============================================
// writeToMailbox - Atomic message append with file locking
// Location: chunks.129.mjs:1107-1150
// ============================================

// READABLE (for understanding):
async function writeToMailbox(recipientName, message, teamName) {
    const mailboxPath = getInboxPath(recipientName, teamName);
    // Path: ~/.claude/teams/{teamName}/inboxes/{recipientName}.json

    const lockPath = mailboxPath + ".lock";

    // Acquire exclusive lock
    await lockfile.lock(lockPath, {
        retries: {
            retries: 5,      // Retry 5 times if lock unavailable
            minTimeout: 100, // Wait 100ms between retries
            maxTimeout: 1000 // Max 1s wait per retry
        },
        stale: 60000  // If lock holder crashed >60s ago, steal lock
    });

    try {
        // Critical section - only one process here at a time
        let messages = [];
        if (fs.existsSync(mailboxPath)) {
            const content = fs.readFileSync(mailboxPath, "utf-8");
            messages = JSON.parse(content);
        }

        messages.push(message);

        fs.writeFileSync(
            mailboxPath,
            JSON.stringify(messages, null, 2),
            "utf-8"
        );
    } finally {
        // Always release lock, even if error
        await lockfile.unlock(lockPath);
    }
}
```

**Why this approach**:

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Lock location | `.lock` file next to mailbox | Standard pattern, visible in filesystem |
| Retry strategy | 5 retries, 100ms-1s backoff | Handles transient contention, fails fast if deadlock |
| Stale timeout | 60 seconds | Balances crash recovery vs false stale detection |
| Lock scope | Entire read-modify-write | Prevents lost updates, ensures atomicity |

**Edge cases**:

1. **Process crash while holding lock**:
   - **Detection**: Lock file older than 60s
   - **Recovery**: `proper-lockfile` automatically removes stale lock
   - **Risk**: If process is slow (not crashed), lock stolen prematurely → corruption
   - **Mitigation**: 60s is conservative (typical message write <100ms)

2. **Concurrent writes from 10+ agents**:
   - **Behavior**: Some writers blocked, retrying
   - **Max wait**: 5 retries × 1s = 5 seconds
   - **After 5s**: Write fails with "Could not acquire lock"
   - **Mitigation**: User sees error, can retry SendMessage

3. **Lock file permission denied**:
   - **Cause**: Filesystem permissions or read-only disk
   - **Recovery**: None - surfaced as error to agent
   - **UX**: Agent receives "Failed to send message: EACCES"

**Alternative considered**: Lock-free append using `fs.appendFileSync()` with newline-delimited JSON.
**Trade-off**: Append is atomic but requires parsing entire file with error recovery for partial lines. Chosen approach (read-all, modify, write-all) is simpler and safer for small mailboxes (typically <100 messages).

### 5.4 Priority-Based Delivery (In-Process Mode)

**Recipient poll loop** (see [pane_backend_executor.md](./pane_backend_executor.md) for full algorithm):

```
inProcessPollLoop continuously checks:

Priority 1: pendingUserMessages in AppState
  └─→ Instant delivery (no polling delay)
      • Use case: Direct injection from lead agent's SendMessage call
      • Example: Lead sends message → immediately available to in-process teammate

Priority 2: shutdown_request in mailbox
  └─→ Scans ALL messages, returns shutdown immediately
      • Bypasses queue of 100+ unread messages
      • Ensures graceful shutdown isn't blocked

Priority 3: Messages from "team-lead"
  └─→ Leader coordination takes precedence over peer messages

Priority 4: Any unread message
  └─→ First unread message, FIFO order

Priority 5: Available tasks from task ledger
  └─→ Auto-claim next pending task if no messages

Sleep 500ms between poll cycles (if no Priority 1 message)
```

**Why Priority 1 (pendingUserMessages) exists**:

- **In-process optimization**: Lead and in-process teammate share same Node.js process
- **Avoid filesystem round-trip**: No need to write to disk then poll file
- **Instant response**: Teammate receives message within same event loop tick

**For pane-based teammates**: Only Priorities 2-5 apply (no shared memory, must poll mailbox file).

**Key insight**: Priority 1 creates a **two-tier delivery system**:
1. **Fast path** (in-process): Direct memory injection via AppState
2. **Slow path** (pane-based): Filesystem polling every 500ms

This optimization reduces message latency for in-process teams from 500ms to ~1ms while maintaining fallback compatibility for multi-process teams.

---

## 6. Task Coordination Chain

### 6.1 Task Creation by Lead

**Flow:**

```
Team lead: TaskCreate({
  subject: "Implement POST /users endpoint",
  description: "Create endpoint that accepts name, email, and returns user ID"
})
  |
  └─→ TaskCreateTool writes task file
        • Path: ~/.claude/tasks/{teamName}/task-{id}.json
        • Content:
          {
            "id": "task-123",
            "subject": "Implement POST /users endpoint",
            "description": "...",
            "status": "pending",
            "owner": null,
            "blockedBy": [],
            "createdAt": "2024-02-14T08:10:00.000Z"
          }
```

### 6.2 Task Auto-Claim by Idle Teammate

**Trigger**: Teammate's poll loop reaches Priority 5 (no messages available)

**Flow:**

```
inProcessPollLoop → Priority 5 → claimNextTask(context)  [chunks.131.mjs:241]
  |
  ├─→ Read all task files
  |     └─→ fs.readdirSync(~/.claude/tasks/{teamName}/)
  |           • Returns: ["task-123.json", "task-456.json", ...]
  |
  ├─→ Parse task JSON files
  |     └─→ tasks = files.map(f => JSON.parse(fs.readFileSync(f)))
  |
  ├─→ Find next available task
  |     └─→ findNextAvailableTask(tasks)  [chunks.131.mjs:222]
  |           |
  |           ├─→ Filter incomplete tasks
  |           |     └─→ incompleteTasks = new Set(
  |           |           tasks.filter(t => t.status !== "completed")
  |           |                 .map(t => t.id)
  |           |         )
  |           |
  |           └─→ Find first claimable task
  |                 └─→ tasks.find(task =>
  |                       task.status === "pending" &&
  |                       !task.owner &&
  |                       task.blockedBy.every(id => !incompleteTasks.has(id))
  |                     )
  |                 // Dependencies checked: if task-456 blockedBy task-123,
  |                 // and task-123 is incomplete, skip task-456
  |
  ├─→ Attempt to claim task (atomic operation)
  |     └─→ attemptToClaimTask(task, agentName)
  |           |
  |           ├─→ Acquire task file lock
  |           |     └─→ lockfile.lock(taskPath + ".lock")
  |           |
  |           ├─→ Re-read task (check if claimed by another agent)
  |           |     └─→ currentTask = JSON.parse(fs.readFileSync(taskPath))
  |           |           if (currentTask.owner !== null) {
  |           |             // Another agent claimed it first!
  |           |             unlock();
  |           |             return null;  // Abort claim
  |           |           }
  |           |
  |           ├─→ Update task
  |           |     └─→ currentTask.status = "in_progress";
  |           |         currentTask.owner = agentName;
  |           |         currentTask.claimedAt = new Date().toISOString();
  |           |
  |           ├─→ Write updated task
  |           |     └─→ fs.writeFileSync(taskPath, JSON.stringify(currentTask))
  |           |
  |           └─→ Release lock
  |                 └─→ lockfile.unlock(taskPath + ".lock")
  |
  ├─→ Generate task prompt
  |     └─→ generatePromptFromTask(task)  [chunks.131.mjs:231]
  |           • Returns:
  |             "You have been assigned a task from the team task list.
  |
  |              Task: Implement POST /users endpoint
  |
  |              Description: Create endpoint that accepts name, email...
  |
  |              Please complete this task and use TaskUpdate to mark it
  |              as completed when done."
  |
  └─→ Return prompt to poll loop
        • Poll loop injects this as a user message
        • Agent processes task
```

### 6.3 Dependency Resolution Algorithm

**Example scenario:**

```
Task List:
- task-1: "Setup database schema" (pending, no dependencies)
- task-2: "Create user model" (pending, blockedBy: [task-1])
- task-3: "Implement POST /users" (pending, blockedBy: [task-2])
```

**Resolution logic:**

```javascript
// ============================================
// findNextAvailableTask - Dependency-aware task selection
// Location: chunks.131.mjs:222-240
// ============================================

// READABLE (for understanding):
function findNextAvailableTask(tasks) {
    // Build set of incomplete task IDs (pending OR in_progress)
    const incompleteTasks = new Set(
        tasks.filter(t => t.status !== "completed")
             .map(t => t.id)
    );

    // Example state:
    // incompleteTasks = Set(["task-1", "task-2", "task-3"])

    return tasks.find(task => {
        // Must be pending (not in_progress or completed)
        if (task.status !== "pending") return false;

        // Must not already have an owner
        if (task.owner !== null) return false;

        // Check dependencies: ALL blockedBy tasks must be complete
        const allDependenciesComplete = task.blockedBy.every(
            dependencyId => !incompleteTasks.has(dependencyId)
        );

        // Example:
        // task-1: blockedBy=[] → every([]) = true ✓ CLAIMABLE
        // task-2: blockedBy=["task-1"] → task-1 in incompleteTasks → false ✗ BLOCKED
        // task-3: blockedBy=["task-2"] → task-2 in incompleteTasks → false ✗ BLOCKED

        return allDependenciesComplete;
    });
}
```

**Why `every()` instead of checking status directly**:

| Approach | Logic | Problem |
|----------|-------|---------|
| **Check status** (wrong) | `task.blockedBy.every(id => {`<br>`  const dep = tasks.find(t => t.id === id);`<br>`  return dep?.status === "completed";`<br>`})` | If dependency task deleted, `dep` is undefined → `dep.status` throws |
| **Check incomplete set** (chosen) | `task.blockedBy.every(id => !incompleteTasks.has(id))` | If dependency deleted, `!incompleteTasks.has(deletedId)` = true (safe) |

**Key insight**: Using a Set of incomplete IDs makes dependency checking **robust to deletion**. If task-1 is deleted (not just completed), task-2 becomes claimable because task-1 is not in the incomplete set.

**Trade-off**: Deleting a task unblocks its dependents even if the work wasn't done. Mitigation: UI warns when deleting tasks with dependents.

### 6.4 Race Condition Handling

**Scenario**: Two teammates poll simultaneously, both see task-1 as available.

```
Time  | Teammate A (backend-dev)       | Teammate B (frontend-dev)
------|--------------------------------|---------------------------
t0    | Poll → find task-1 available   | Poll → find task-1 available
t1    | Acquire lock on task-1.json    |
t2    | Read task-1: owner=null        | Attempt lock (BLOCKED)
t3    | Write task-1: owner="backend"  |
t4    | Release lock                   |
t5    |                                | Acquire lock (success)
t6    |                                | Read task-1: owner="backend"
t7    |                                | Detect already claimed
t8    |                                | Release lock, return null
t9    |                                | Poll loop continues, tries next task
------|--------------------------------|---------------------------
Result: Only backend-dev claims task-1. Frontend-dev retries claim on next poll.
```

**Why re-read after acquiring lock (defensive pattern)**:

The `findNextAvailableTask()` check happens **outside** the lock. Another agent might claim the task between the check and the lock acquisition. Re-reading inside the critical section prevents double-claim.

**Alternative considered**: Lock all task files during scan.
**Trade-off**: Scanning 100 tasks with 100 lock acquisitions is slow (serializes all teammates). Chosen approach optimistically scans, then validates inside lock (faster for common case, safe for rare contention).

---

## 7. Shutdown Chain

### 7.1 Graceful Shutdown Protocol

**Complete request/approval flow:**

```
Step 1: Lead initiates shutdown
  └─→ SendMessage({
        type: "shutdown_request",
        recipient: "backend-dev",
        content: "Your work is complete. Please shut down."
      })
        |
        └─→ writeToMailbox("backend-dev", message, teamName)
              • Message written to filesystem

Step 2: Teammate poll loop detects shutdown (Priority 2)
  └─→ inProcessPollLoop → Priority 2 check
        |
        ├─→ Scan ALL mailbox messages (including unread queue)
        |     └─→ for (let i = 0; i < messages.length; i++) {
        |           if (!messages[i].read) {
        |             const parsed = parseShutdownRequest(messages[i].text);
        |             if (parsed) {
        |               // FOUND! Skip remaining 99 unread messages
        |               markAsRead(i);
        |               return {
        |                 type: "shutdown_request",
        |                 requestId: parsed.requestId,
        |                 from: messages[i].from
        |               };
        |             }
        |           }
        |         }
        |
        └─→ UI prompts teammate (if interactive)
              └─→ "Team lead requested shutdown. Approve? (y/n)"
                    • User input: "y"

Step 3: Teammate responds with approval
  └─→ SendMessage({
        type: "shutdown_response",
        approve: true,
        request_id: parsedShutdownRequest.requestId,
        content: "Shutdown approved"
      })
        |
        └─→ handleShutdownApproval(input, context)  [chunks.141.mjs:1160]
              |
              ├─→ Deliver confirmation to lead
              |     └─→ writeToMailbox("team-lead", confirmationMessage)
              |
              └─→ Terminate based on backend type
                    |
                    ├─→ In-process backend:
                    |     └─→ task.abortController.abort()
                    |           • AbortSignal propagates to poll loop
                    |           • Poll loop exits: return {type: "aborted"}
                    |           • Agent runner stops iteration
                    |           • AppState marks task as completed
                    |
                    └─→ Pane-based backend:
                          └─→ setImmediate(async () => {
                                await exitProcess(0, "other");
                              })
                              • Async exit prevents response interruption
                              • Process exits cleanly after response sent
                              • tmux/iTerm pane shows "Process exited"

Step 4: Lead receives confirmation
  └─→ Lead's poll loop → Priority 3 (message from teammate)
        └─→ Inject as user message:
              "backend-dev confirmed shutdown"
        └─→ Lead can now safely call TeamDelete
```

### 7.2 Why Priority 2 Bypass Matters

**Problem scenario WITHOUT priority bypass:**

```
Teammate mailbox state:
- 100 unread messages from load testing tool
- Message #101: shutdown_request from team-lead

Timeline:
1. Teammate polls → finds message #1 (unread)
2. Processes message #1 → takes 30 seconds
3. Polls again → finds message #2
4. ... (processes all 100 messages)
5. 50 MINUTES LATER: finally reads message #101 shutdown request
6. Team lead has given up, killed process forcefully
```

**Solution WITH Priority 2:**

```
Same mailbox state:
- 100 unread messages
- Message #101: shutdown_request

Timeline:
1. Teammate polls → scans ALL messages FIRST for shutdown
2. Finds message #101 (shutdown_request)
3. IMMEDIATELY returns shutdown, skips messages 1-100
4. Processes shutdown within 1 second
5. Clean exit
```

**Why this approach**:

- **Shutdown is control plane, not data plane**: Coordination signals should bypass work queues
- **Bounded shutdown time**: Guarantees shutdown processed within one poll cycle (500ms + processing)
- **User expectation**: When lead requests shutdown, user expects immediate response

**Trade-off**: Shutdown "cuts in line" ahead of legitimate work messages. Acceptable because shutdown means work is done or being aborted anyway.

### 7.3 Shutdown Rejection Path

**Flow:**

```
Step 2b: Teammate rejects shutdown
  └─→ UI prompt: "Shutdown requested. Approve? (y/n)"
        • User input: "n"
        |
        └─→ SendMessage({
              type: "shutdown_response",
              approve: false,
              request_id: parsedShutdownRequest.requestId,
              content: "Still working on critical task, cannot shut down"
            })
              |
              └─→ handleShutdownRejection(input)  [chunks.141.mjs:1216]
                    |
                    ├─→ Deliver rejection to lead
                    |     └─→ writeToMailbox("team-lead", rejectionMessage)
                    |
                    └─→ Continue normal operation
                          • Poll loop resumes
                          • Teammate continues processing tasks
```

**Lead receives rejection:**

```
Lead sees:
"backend-dev rejected shutdown: Still working on critical task"

Lead options:
1. Wait and retry shutdown later
2. Force kill (TeamDelete with force flag)
3. Investigate why teammate is busy
```

**Why allow rejection**:

- **Teammate agency**: Agent can assess if safe to shutdown
- **Data safety**: Mid-transaction work shouldn't be interrupted
- **User control**: Pane-based teammates have human user who can refuse

**Trade-off**: Lead can't force shutdown (must use TeamDelete force or manual kill). Mitigation: TeamDelete has safety timeout (refuses to delete if teammates active for >60s).

### 7.4 Cleanup via TeamDelete

**Flow:**

```
TeamDeleteTool.call({teamName: "web-app-team"}, context)  [chunks.141.mjs:759]
  |
  ├─→ Read team config
  |     └─→ config = readTeamConfig(teamName)
  |
  ├─→ Check for active teammates
  |     └─→ activeMembers = config.members.filter(m => {
  |           if (m.backendType === "in-process") {
  |             return findTaskByAgentId(m.agentId, appState.tasks) !== null;
  |           } else {
  |             return isPaneActive(m.tmuxPaneId);
  |           }
  |         })
  |
  ├─→ Safety check
  |     └─→ if (activeMembers.length > 0) {
  |           return error(
  |             "Cannot delete team: {count} active teammates. " +
  |             "Send shutdown_request first."
  |           );
  |         }
  |
  ├─→ Delete team resources
  |     ├─→ rm -rf ~/.claude/teams/{teamName}/
  |     └─→ rm -rf ~/.claude/tasks/{teamName}/
  |
  ├─→ Clear AppState team context
  |     └─→ context.updateAppState(state => ({
  |           ...state,
  |           teamContext: null
  |         }))
  |
  └─→ Return success
        • "Team '{teamName}' deleted successfully"
```

**Orphaned mailbox handling:**

If teammate crashes without sending shutdown_response, their mailbox remains with unread messages. TeamDelete cleanup removes these:

```bash
rm -rf ~/.claude/teams/web-app-team/
# Removes:
# - config.json
# - inboxes/team-lead.json (may have undelivered confirmations)
# - inboxes/backend-dev.json (may have unread messages)
# - inboxes/frontend-dev.json
```

**Data loss implications:**

| Scenario | Lost Data | Impact |
|----------|-----------|--------|
| Teammate crashed, unread messages | Messages in crashed teammate's mailbox | Lost (acceptable - teammate couldn't process anyway) |
| Teammate sent response, lead crashed before reading | Response in lead's mailbox | Lost (acceptable - lead will recreate team) |
| Task half-complete, filesystem survives | Task file shows status="in_progress", owner="crashed-agent" | **Preserved** - can manually inspect task status |

**Why no rollback/recovery**: Distributed systems complexity avoided. Clean-slate model: create team → work → delete team. If failure occurs, manual inspection of `~/.claude/` reveals state.

---

## 8. Complete Flow Diagram

**End-to-end sequence** (successful team lifecycle):

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. TRIGGER                                                          │
├─────────────────────────────────────────────────────────────────────┤
│ User: "Build a web app with separate frontend and backend teams"   │
│   │                                                                 │
│   └─→ LLM decides → TeamCreate tool call                           │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 2. TEAM INITIALIZATION                                              │
├─────────────────────────────────────────────────────────────────────┤
│ TeamCreateTool:                                                     │
│   • sanitizeTeamName("web-app") → "web-app"                        │
│   • mkdir ~/.claude/teams/web-app/                                 │
│   • write config.json (leadAgentId, members=[])                    │
│   • mkdir ~/.claude/tasks/web-app/                                 │
│   • updateAppState({teamContext: {teamName, role: "lead"}})       │
│                                                                     │
│ Lead agent state: teamContext set, can spawn teammates             │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 3. TEAMMATE SPAWNING                                                │
├─────────────────────────────────────────────────────────────────────┤
│ Lead: SpawnTeammate({                                              │
│         name: "backend-dev",                                        │
│         prompt: "Implement API endpoints"                           │
│       })                                                            │
│   │                                                                 │
│   ├─→ Mode selection: isInProcessEnabled() → true                  │
│   |     (assuming non-TTY environment)                             │
│   │                                                                 │
│   └─→ spawnInProcessTeammate:                                      │
│         • Generate agentId (UUID)                                   │
│         • Register in AppState.tasks (type: "in_process_teammate") │
│         • Start inProcessAgentRunner                                │
│             └─→ inProcessPollLoop (500ms polling)                  │
│                   └─→ Waiting for messages or tasks...             │
│                                                                     │
│ Teammate state: Poll loop active, ready to receive work            │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 4. TASK COORDINATION                                                │
├─────────────────────────────────────────────────────────────────────┤
│ Lead: TaskCreate({                                                 │
│         subject: "Implement POST /users",                           │
│         description: "Create endpoint for user registration"        │
│       })                                                            │
│   │                                                                 │
│   └─→ Write ~/.claude/tasks/web-app/task-123.json                 │
│         {status: "pending", owner: null, ...}                       │
│                                                                     │
│ Teammate poll loop (Priority 5):                                   │
│   └─→ claimNextTask()                                              │
│         ├─→ Scan task directory                                    │
│         ├─→ Find task-123 (pending, no owner, no blocking deps)   │
│         ├─→ Acquire lock → update owner="backend-dev"             │
│         └─→ Return task prompt to agent                            │
│                                                                     │
│ Teammate processes task:                                           │
│   • Read files, implement code                                      │
│   • TaskUpdate({taskId: "123", status: "completed"})              │
│         └─→ Update task file: {status: "completed", ...}          │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 5. INTER-AGENT MESSAGING                                            │
├─────────────────────────────────────────────────────────────────────┤
│ Lead: SendMessage({                                                │
│         type: "message",                                            │
│         recipient: "backend-dev",                                   │
│         content: "Please add input validation"                      │
│       })                                                            │
│   │                                                                 │
│   ├─→ writeToMailbox("backend-dev", message)                       │
│   |     • Acquire lock on backend-dev.json.lock                    │
│   |     • Append message to mailbox                                │
│   |     • Release lock                                             │
│   │                                                                 │
│   └─→ (In-process optimization)                                    │
│         AppState.tasks[backend-dev].pendingUserMessages.push(msg)  │
│                                                                     │
│ Teammate poll loop (Priority 1):                                   │
│   └─→ Check pendingUserMessages → FOUND                            │
│         └─→ Immediately inject as user message (no 500ms delay)    │
│                                                                     │
│ Teammate responds to lead's instruction                             │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 6. GRACEFUL SHUTDOWN                                                │
├─────────────────────────────────────────────────────────────────────┤
│ Lead: SendMessage({                                                │
│         type: "shutdown_request",                                   │
│         recipient: "backend-dev"                                    │
│       })                                                            │
│   │                                                                 │
│   └─→ writeToMailbox("backend-dev", shutdownRequest)              │
│                                                                     │
│ Teammate poll loop (Priority 2):                                   │
│   ├─→ Scan ALL mailbox messages for shutdown_request               │
│   ├─→ FOUND (bypassing 50 unread messages)                         │
│   ├─→ UI prompt: "Approve shutdown? (y/n)" → user: "y"            │
│   └─→ SendMessage({type: "shutdown_response", approve: true})     │
│         │                                                           │
│         └─→ handleShutdownApproval:                                │
│               • Deliver confirmation to lead                        │
│               • task.abortController.abort()                        │
│               • Poll loop exits                                     │
│               • Agent runner stops                                  │
│                                                                     │
│ Teammate state: Exited cleanly                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 7. CLEANUP                                                          │
├─────────────────────────────────────────────────────────────────────┤
│ Lead: TeamDelete({teamName: "web-app"})                            │
│   │                                                                 │
│   ├─→ Check for active teammates → none found                      │
│   ├─→ rm -rf ~/.claude/teams/web-app/                             │
│   ├─→ rm -rf ~/.claude/tasks/web-app/                             │
│   └─→ updateAppState({teamContext: null})                         │
│                                                                     │
│ Final state: All team resources removed, AppState cleared          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Design Rationale & Trade-offs

### 9.1 Filesystem as Coordination Layer

**Decision**: Use `~/.claude/teams/` and `~/.claude/tasks/` instead of in-memory state or external database.

**Rationale**:

| Requirement | How Filesystem Satisfies |
|-------------|-------------------------|
| Multi-process coordination | Each process reads/writes shared files |
| Crash resilience | Task state survives process restart |
| Debuggability | `cat ~/.claude/teams/web-app/config.json` shows exact state |
| Zero external dependencies | No Redis, PostgreSQL, or distributed system setup |
| Simple mental model | Files = state, directory = namespace |

**Trade-offs**:

| Advantage | Disadvantage |
|-----------|--------------|
| ✅ Works on any filesystem (local, NFS) | ❌ Slower than in-memory (ms vs μs latency) |
| ✅ No process coordination needed | ❌ Race conditions require file locking |
| ✅ Persistent across restarts | ❌ Disk space usage (mailboxes grow unbounded) |
| ✅ Human-readable JSON files | ❌ No ACID transactions (partial writes possible) |

**When this breaks**:

- **Network filesystems** (NFS): File locking may be unreliable → race conditions → duplicate task claims
- **Disk full**: Write failures → lost messages or partial state
- **High concurrency** (>20 agents): Lock contention → 5-second retry timeout → write failures

**Mitigation**: Document requirement for local filesystem. For large teams (>10 agents), recommend external coordination service (future work).

### 9.2 In-Process vs Pane-Based Backends

**Decision**: Support two execution modes with automatic selection.

**Rationale**:

| Use Case | Optimal Mode | Why |
|----------|--------------|-----|
| CI/CD pipeline (no TTY) | In-process | Can't spawn tmux panes in non-interactive environment |
| Local development (tmux user) | Pane-based | Visual separation, process isolation, easier debugging |
| SSH session (tmux available) | Pane-based | User can monitor panes in parallel |
| Quick prototyping | In-process | Faster spawn (no process fork) |

**Trade-offs**:

| Aspect | In-Process | Pane-Based |
|--------|------------|------------|
| **Spawn time** | Instant (~1ms) | Slow (~200ms process spawn) |
| **Isolation** | None (shared event loop) | Full (separate processes) |
| **Memory** | Shared heap | Isolated heaps (higher total usage) |
| **Debugging** | Single debugger session | Need to attach to each process |
| **Crash impact** | All agents crash together | Isolated crashes |
| **Visual monitoring** | AppState UI only | Visible tmux/iTerm panes |

**Key insight**: In-process mode is a **fallback for non-interactive environments**, not the primary mode. Pane-based is the "default" when possible because process isolation is safer for untrusted code execution.

### 9.3 Priority-Based Polling vs Event-Driven

**Decision**: Use polling loop with 500ms interval + 5-level priority queue instead of event-driven notifications.

**Rationale**:

| Approach | Pros | Cons |
|----------|------|------|
| **Polling** (chosen) | • Simple: single loop, no event handlers<br>• Robust: survives IPC failures<br>• Priority queue easy to implement | • 500ms latency for mailbox messages<br>• CPU usage (polling thread) |
| **Event-driven** | • Instant notification (0ms latency)<br>• No wasted CPU cycles | • Complex: needs IPC (signals, sockets, etc.)<br>• Fragile: lost events = stuck agent<br>• Hard to prioritize events |

**Why 500ms interval**:

- **Too short** (e.g., 50ms): Excessive filesystem I/O, CPU spin
- **Too long** (e.g., 5s): User perceives lag when sending messages
- **500ms sweet spot**: Responsive enough for coordination, low enough overhead

**Latency analysis**:

```
Average message delivery time:
  In-process (Priority 1): 0-1ms   (instant AppState injection)
  Mailbox (Priority 2-4):  0-500ms (depends on poll phase)
  Task claim (Priority 5): 0-500ms

Worst case: 500ms (teammate just polled, message arrives 1ms later)
Best case:  0ms   (in-process) or 1ms (pane-based, lucky timing)
```

**Why acceptable**: Agent loop iterations take seconds to minutes (read files, call LLM, execute tools). 250ms average message latency is negligible compared to task execution time.

### 9.4 File Locking Strategy

**Decision**: Use `proper-lockfile` with 5 retries, 60s stale timeout.

**Rationale**:

| Parameter | Value | Why |
|-----------|-------|-----|
| **Retries** | 5 | Most contention resolves in 1-2 retries |
| **Min timeout** | 100ms | Balance responsiveness vs retry storm |
| **Max timeout** | 1s | Backoff prevents thundering herd |
| **Stale timeout** | 60s | Crash recovery vs false positive |

**Alternative considered**: No locking (use atomic append operations).

**Trade-off**: Append-only is simpler but requires newline-delimited JSON parsing with error recovery for corrupted lines. Chosen approach (read-modify-write with lock) is safer for structured data.

**Failure mode**: If 5 retries exhausted (5 seconds), write fails. Agent receives error, can retry SendMessage. User sees "Failed to send message: Could not acquire lock". In practice, rare (requires 6+ concurrent writers to same mailbox).

### 9.5 Shutdown Protocol

**Decision**: Request/approval protocol with Priority 2 bypass instead of force kill.

**Rationale**:

| Approach | Safety | User Control | Complexity |
|----------|--------|--------------|------------|
| **Force kill** | Unsafe (data loss) | None (lead decides) | Simple |
| **Request/approval** (chosen) | Safe (agent can save state) | High (agent approves) | Moderate |
| **Timeout-based** | Moderate (grace period) | Low (lead waits or kills) | Moderate |

**Why approval matters**:

```
Scenario: Teammate is mid-transaction writing to database

Without approval:
  Lead: TeamDelete → force kill
  Result: Partial write → database corruption

With approval:
  Lead: SendMessage(shutdown_request)
  Teammate: Detect mid-transaction → reject shutdown
  Lead: Wait for transaction complete → retry shutdown
  Teammate: Approve → clean exit
  Result: Database consistent
```

**Trade-off**: Lead can't force immediate shutdown. Mitigation: TeamDelete has `--force` flag (bypasses active check, use with caution).

### 9.6 Task Dependency Model

**Decision**: Simple `blockedBy` array with "all-complete" semantics (no OR-dependencies, no partial completion).

**Rationale**:

| Feature | Supported | Why/Why Not |
|---------|-----------|-------------|
| **AND dependencies** | ✅ Yes | blockedBy: ["task-1", "task-2"] means BOTH must complete |
| **OR dependencies** | ❌ No | Added complexity, rare use case |
| **Partial completion** | ❌ No | Task is atomic (pending → in_progress → completed) |
| **Cycles detection** | ❌ No | User responsibility to avoid cycles |

**Cycle handling**:

```
Example cycle:
  task-1: blockedBy: ["task-2"]
  task-2: blockedBy: ["task-1"]

Result:
  findNextAvailableTask() never returns either task
  Both stuck in "pending" forever

Detection:
  None (teammates poll loop continues, finds other tasks)

User must:
  Manually detect via TaskList, fix dependencies
```

**Why no cycle detection**: Cycle detection requires graph traversal (O(N²) for N tasks). Acceptable trade-off: user creates clean dependency graphs or manually resolves cycles.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions referenced in this document:

- `TeamCreateTool` (QSY) - Team initialization
- `SendMessageTool` (YhY) - Inter-agent messaging
- `spawnTeammateDispatcher` (iVY) - Spawn mode selection
- `spawnInProcessTeammate` (LP1) - In-process backend spawning
- `spawnSplitPaneTeammate` (dVY) - Pane-based backend spawning
- `inProcessPollLoop` (WVY) - 5-level priority polling
- `writeToMailbox` (f9) - Atomic message write with locking
- `claimNextTask` (ib4) - Task auto-claim with dependency resolution
- `handleShutdownApproval` (tSY) - Graceful shutdown termination
- `TeamDeleteTool` (USY) - Team cleanup

## Source Locations

- `chunks.141.mjs` - Team tools, message handling, shutdown protocol
- `chunks.131.mjs` - Backend implementations, poll loop, spawn logic
- `chunks.129.mjs` - Mailbox I/O, file locking
- `chunks.123.mjs` - In-process backend implementation

---

**Document Status**: Complete end-to-end chain analysis with deep algorithmic insights and design trade-offs.
