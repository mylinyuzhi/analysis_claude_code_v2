# Storage Cleanup & Disk Management for Agent Teams

> **Module**: Agent Teams - Storage Cleanup & Management
> **Version**: Claude Code 2.1.38
> **Purpose**: Document mailbox cleanup, retention policies, and disk management strategies

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Team Deletion Cleanup](#2-team-deletion-cleanup)
3. [Mailbox Message Lifecycle](#3-mailbox-message-lifecycle)
4. [Task Ledger Management](#4-task-ledger-management)
5. [Disk Space Growth Analysis](#5-disk-space-growth-analysis)
6. [Manual Cleanup Procedures](#6-manual-cleanup-procedures)
7. [Design Rationale & Trade-offs](#7-design-rationale--trade-offs)

---

## 1. Executive Summary

Agent teams storage cleanup is **minimal and manual** in Claude Code 2.1.38. The cleanup model prioritizes **data preservation** over automatic garbage collection:

**Current cleanup strategy**:
1. **Team deletion**: Removes team directory + tasks directory (complete cleanup)
2. **Mailbox messages**: Marked as read but NOT deleted (accumulate until team cleanup)
3. **Task ledger**: NO automatic cleanup (tasks accumulate indefinitely)
4. **Session memory**: Manual cleanup only (user deletes old sessions)

**Key behaviors**:
- **Team deletion is destructive**: Removes ALL team data (config, mailboxes, tasks)
- **No message retention limit**: Mailbox messages persist forever (until team deleted)
- **No task archiving**: Completed tasks remain in ledger indefinitely
- **No automatic disk quota**: No enforcement of storage limits

**Disk growth patterns**:
- **Mailboxes**: O(messages × teams) - Grow linearly with message volume
- **Tasks**: O(tasks created) - Grow linearly with task creation rate
- **Teams**: O(active teams) - One directory per team (minimal growth)

**Manual cleanup required for**:
- Old teams (via TeamDelete tool)
- Completed tasks (manual file deletion)
- Stale mailbox messages (deleted with team)
- Old session directories (rm -rf ~/.claude/{sessionId})

**Key insight**: Storage is **cheap** (messages/tasks are small JSON files), so aggressive cleanup is deferred. Users expected to manually clean up when disk space becomes an issue (rare for typical usage).

---

## 2. Team Deletion Cleanup

### 2.1 TeamDelete Tool

**What it does**: Removes team directory, tasks directory, and all associated data.

**How it works**:

```javascript
// ============================================
// cleanupTeam - Complete team cleanup on deletion
// Location: chunks.123.mjs:187-214
// ============================================

// ORIGINAL (for source lookup):
async function F$1(A, q) {
    let K = jhY(A),
        Y = [];
    if (K) {
        for (let H of K.members)
            if (H.worktreePath) Y.push(H.worktreePath)
    }

    // Cleanup worktrees
    for (let H of Y) await hjY(H);

    // Delete team directory
    let z = Ej6(A);
    try {
        await AR4(z, { recursive: !0, force: !0 });
        h(`[TeammateTool] Cleaned up team directory: ${z}`);
    } catch (H) {
        h(`[TeammateTool] Failed to clean up team directory ${z}: ${H instanceof Error?H.message:String(H)}`);
    }

    // Delete tasks directory
    let w = WL(q);
    try {
        await AR4(w, { recursive: !0, force: !0 });
        h(`[TeammateTool] Cleaned up tasks directory: ${w}`);
        l_1();  // Trigger task list refresh
    } catch (H) {
        h(`[TeammateTool] Failed to clean up tasks directory ${w}: ${H instanceof Error?H.message:String(H)}`);
    }
}

// READABLE (for understanding):
async function cleanupTeam(teamName, storageContext) {
    let teamConfig = readTeamConfig(teamName),
        worktreePaths = [];

    // Collect worktree paths from team members
    if (teamConfig) {
        for (let member of teamConfig.members) {
            if (member.worktreePath) {
                worktreePaths.push(member.worktreePath);
            }
        }
    }

    // Cleanup git worktrees (if any)
    for (let worktreePath of worktreePaths) {
        await cleanupWorktree(worktreePath);
    }

    // Delete team directory (~/.claude/teams/{teamName}/)
    let teamDirectory = getTeamDirectory(teamName);
    try {
        await deleteDirectory(teamDirectory, { recursive: true, force: true });
        debugLog(`[TeammateTool] Cleaned up team directory: ${teamDirectory}`);
    } catch (error) {
        debugLog(`[TeammateTool] Failed to clean up team directory ${teamDirectory}: ${error.message}`);
    }

    // Delete tasks directory (~/.claude/tasks/)
    let tasksDirectory = getTasksDirectory(storageContext);
    try {
        await deleteDirectory(tasksDirectory, { recursive: true, force: true });
        debugLog(`[TeammateTool] Cleaned up tasks directory: ${tasksDirectory}`);
        triggerTaskListRefresh();  // Notify UI
    } catch (error) {
        debugLog(`[TeammateTool] Failed to clean up tasks directory ${tasksDirectory}: ${error.message}`);
    }
}

// Mapping: F$1→cleanupTeam, A→teamName, q→storageContext, K→teamConfig,
// Y→worktreePaths, jhY→readTeamConfig, H→member/worktreePath/error,
// hjY→cleanupWorktree, z→teamDirectory, Ej6→getTeamDirectory,
// AR4→deleteDirectory, h→debugLog, w→tasksDirectory, WL→getTasksDirectory, l_1→triggerTaskListRefresh
```

**Step-by-step cleanup algorithm**:

1. **Read team config**: Load team.json to get member list
2. **Cleanup worktrees**: Remove git worktrees for members (if any)
3. **Delete team directory**: Recursively remove `~/.claude/teams/{teamName}/`
   - Removes team.json
   - Removes mailboxes/ directory (all unread messages lost)
   - Removes any other team-specific files
4. **Delete tasks directory**: Recursively remove `~/.claude/tasks/`
   - Removes ALL tasks (not just this team's tasks)
   - **CAUTION**: Affects all teams sharing task ledger
5. **Trigger UI refresh**: Notify UI that task list changed

**What's deleted**:
- ✅ Team config file (`team.json`)
- ✅ All mailbox messages (all teammates' inboxes)
- ✅ ALL tasks in global ledger (destructive)
- ✅ Git worktrees (if teammates used worktrees)

**What's NOT deleted**:
- ❌ Session memory (in `~/.claude/{sessionId}/`) - Persists
- ❌ Plan files (in `~/.claude/{sessionId}/plans/`) - Persists
- ❌ Project files written by teammates (code changes persist)

**Why delete tasks directory**:
- **Simplicity**: Cleanup everything related to team
- **Fresh start**: Next team starts with clean task ledger
- **Assumption**: User wants full cleanup (not partial)

**Trade-off**: Deleting tasks directory affects other teams if multiple teams share the same storage context. This is likely a bug—should only delete tasks owned by this team.

### 2.2 TeamDelete Tool Invocation

**What it does**: LLM tool for deleting teams (calls cleanup function).

**How it works**:

```javascript
// ============================================
// TeamDelete tool - Pre-deletion validation
// Location: chunks.141.mjs:759-850
// ============================================

// ORIGINAL (for source lookup):
async execute(A, q) {
    let K = Rm(),
        Y = await A.getAppState(),
        z = Y.teamContext?.teamName || q.team_name;
    if (!z) throw Error("team_name is required");

    // Read team config
    let w = M51(z);
    if (!w) throw Error(`Team "${z}" not found`);

    // Check for active teammates
    let H = [],
        $ = [];
    for (let O of w.members)
        if (O.type === "pane_teammate") H.push(O.name);
        else if (O.type === "in_process_teammate") {
            if (!ID() || !K) {
                $.push(O.name);
                continue
            }
            let _ = Y.tasks[o$1(O.name, z)];
            if (_ && _.type === "in_process_teammate" && !_.terminated) $.push(O.name)
        }

    if ($.length > 0) {
        let O = $.join(", ");
        throw Error(`Cannot cleanup team with ${$.length} active member(s): ${O}. Use requestShutdown to gracefully terminate teammates first.`);
    }

    // Cleanup
    await F$1(z, A);

    return {
        data: {
            success: !0,
            message: `Team "${z}" and all associated data deleted successfully.`,
            active_pane_teammates: H
        }
    };
}

// READABLE (for understanding):
async execute(context, params) {
    let isInProcessEnabled = isInProcessModeEnabled(),
        appState = await context.getAppState(),
        teamName = appState.teamContext?.teamName || params.team_name;

    if (!teamName) {
        throw Error("team_name is required");
    }

    // Load team config to check for active teammates
    let teamConfig = readTeamConfig(teamName);
    if (!teamConfig) {
        throw Error(`Team "${teamName}" not found`);
    }

    // Categorize members: pane vs. in-process
    let paneTeammates = [],
        activeInProcessTeammates = [];

    for (let member of teamConfig.members) {
        if (member.type === "pane_teammate") {
            paneTeammates.push(member.name);
        } else if (member.type === "in_process_teammate") {
            // Check if in-process teammate is still running
            if (!isTeammate() || !isInProcessEnabled) {
                activeInProcessTeammates.push(member.name);
                continue;
            }

            let teammateTask = appState.tasks[generateTaskId(member.name, teamName)];
            if (teammateTask &&
                teammateTask.type === "in_process_teammate" &&
                !teammateTask.terminated) {
                activeInProcessTeammates.push(member.name);
            }
        }
    }

    // VALIDATION: Prevent deletion if active in-process teammates exist
    if (activeInProcessTeammates.length > 0) {
        let activeList = activeInProcessTeammates.join(", ");
        throw Error(
            `Cannot cleanup team with ${activeInProcessTeammates.length} active member(s): ${activeList}. ` +
            `Use requestShutdown to gracefully terminate teammates first.`
        );
    }

    // Perform cleanup
    await cleanupTeam(teamName, context);

    return {
        data: {
            success: true,
            message: `Team "${teamName}" and all associated data deleted successfully.`,
            active_pane_teammates: paneTeammates  // Warning: pane teammates may still be running
        }
    };
}

// Mapping: M51→readTeamConfig, z→teamName, w→teamConfig, H→paneTeammates,
// $→activeInProcessTeammates, O→member/_→teammateTask, ID→isTeammate,
// K→isInProcessEnabled, Rm→isInProcessModeEnabled, F$1→cleanupTeam,
// o$1→generateTaskId
```

**Validation logic**:

1. **Check team exists**: Read team config, error if not found
2. **Enumerate members**: Categorize as pane vs. in-process
3. **Check active in-process teammates**:
   - If teammate exists in AppState.tasks AND not terminated → block deletion
   - If teammate terminated → allow deletion
4. **Pane teammates NOT checked**: Assumes user manually killed pane teammates first
5. **Throw error if active teammates**: User must call requestShutdown first

**Why validate active teammates**:
- **Data safety**: Prevent deleting team while teammates are working
- **Graceful shutdown**: Encourage proper shutdown protocol
- **Avoid corruption**: In-process teammates may have in-flight operations

**Limitation**: Pane teammates NOT validated (may still be running in separate processes).

### 2.3 Cleanup on Team Lead Exit

**Problem**: What happens if team lead exits without calling TeamDelete?

**Current behavior**: **No automatic cleanup**.

```
Scenario: Team lead exits (Ctrl+C)
  Team config: ✅ Persists
  Mailboxes: ✅ Persist (with unread messages)
  Tasks: ✅ Persist
  In-process teammates: ❌ Terminated (process exit)
  Pane teammates: ✅ Continue running (separate processes)

  Result: Team data persists, but teammates are orphaned
```

**Why no automatic cleanup**:
- **User intent unclear**: User may want to resume team later
- **Data preservation**: Better to preserve data and let user manually clean up
- **Crash scenario**: If process crashes, automatic cleanup could delete valid data

**Manual cleanup required**: User must call TeamDelete in next session or manually delete `~/.claude/teams/{teamName}/`.

---

## 3. Mailbox Message Lifecycle

### 3.1 Message Retention Model

**What it does**: Mailbox messages are marked as read but NOT deleted after consumption.

**Message states**:

```
State 1: Unread
  Location: ~/.claude/teams/{teamName}/mailboxes/{agentName}/message-001.json
  Content: { from: "sender", text: "...", timestamp: "...", read: false }

State 2: Read
  Location: (same file)
  Content: { from: "sender", text: "...", timestamp: "...", read: true }
          ↑ Only `read` field changes

State 3: Deleted
  Location: (file remains until team cleanup)
  NOT REACHED (no message deletion mechanism)
```

**Mark-as-read implementation**:

```javascript
// ============================================
// markMessageAsReadByIndex - Update message read status
// Location: chunks.129.mjs:1130 (estimated)
// ============================================

// ORIGINAL (for source lookup):
function JQ1(A, q, K) {
    let Y = Ld(A, q);  // Read all messages
    if (!Y[K]) return;

    Y[K].read = !0;  // Mark message as read

    // Write updated messages back to disk
    let z = as(A, q);
    eZY(z);  // Ensure directory exists
    yjY(z + "/messages.json", Q1(Y));  // Write to file
}

// READABLE (for understanding):
function markMessageAsReadByIndex(agentName, teamName, messageIndex) {
    let messages = readMailbox(agentName, teamName);
    if (!messages[messageIndex]) {
        return;  // Message doesn't exist
    }

    // Update read flag
    messages[messageIndex].read = true;

    // Persist to disk
    let inboxPath = getInboxPath(agentName, teamName);
    ensureInboxDirectoryExists(inboxPath);
    writeFileSync(inboxPath + "/messages.json", JSON.stringify(messages));
}

// Mapping: JQ1→markMessageAsReadByIndex, A→agentName, q→teamName, K→messageIndex,
// Y→messages, Ld→readMailbox, z→inboxPath, as→getInboxPath,
// eZY→ensureInboxDirectoryExists, yjY→writeFileSync, Q1→JSON.stringify
```

**Message accumulation**:

```
Team created (Day 1):
  mailboxes/researcher/ - 0 messages

After 100 messages (Day 2):
  mailboxes/researcher/ - 100 messages (all read: true)

After 1000 messages (Day 30):
  mailboxes/researcher/ - 1000 messages (all read: true)

Result: Messages accumulate indefinitely (no cleanup until team deleted)
```

**Why no message deletion**:
- **Simplicity**: No retention policy logic needed
- **Debugging**: Can inspect message history (all messages preserved)
- **Low cost**: Messages are small (few KB each), disk space cheap

**Trade-off**: Over time, mailbox files grow large (100s of messages), slowing down mailbox reads.

### 3.2 Mailbox File Structure

**What it does**: Stores messages in a JSON array (one file per agent).

**File format**:

```json
// File: ~/.claude/teams/web-app-team/mailboxes/researcher/messages.json
[
  {
    "from": "team-lead",
    "text": "Research the authentication libraries available",
    "summary": "Research auth libraries",
    "timestamp": "2025-01-15T10:00:00.000Z",
    "read": true,
    "color": "#6366f1"
  },
  {
    "from": "backend-dev",
    "text": "I found a security issue in the auth flow",
    "summary": "Security issue in auth",
    "timestamp": "2025-01-15T11:30:00.000Z",
    "read": false,
    "color": "#10b981"
  }
]
```

**File size growth**:

```
Message size: ~200 bytes (average JSON message)

100 messages = 20 KB
1000 messages = 200 KB
10000 messages = 2 MB
```

**Performance impact**:

```
Read mailbox (1000 messages):
  1. Read entire messages.json file (~200 KB)
  2. Parse JSON array (1000 objects)
  3. Filter unread messages
  4. Return filtered list

  Time: ~10-50ms (depending on disk speed)
```

**Why single-file array**:
- **Simplicity**: No index needed, direct JSON parsing
- **Atomic updates**: Single file write (no multi-file consistency issues)
- **Low message volume**: Expected < 1000 messages per teammate (single file manageable)

**Trade-off**: Large mailboxes (thousands of messages) cause slow reads. Could use per-message files (e.g., `message-001.json`, `message-002.json`) for scalability.

### 3.3 No Message Archiving

**Problem**: Should old read messages be archived to reduce mailbox size?

**Solution**: No archiving implemented.

**Alternatives considered**:

1. **Archive to separate file**: Move read messages to `messages-archive.json`
2. **Delete after N days**: Auto-delete messages older than retention period
3. **Compress old messages**: Gzip old messages to save space

**Why no archiving**:
- **Complexity**: Archive logic adds code complexity
- **Rare need**: Most teams short-lived (< 1 day), message accumulation not an issue
- **Debugging value**: All messages useful for troubleshooting

**Future work**: If mailbox performance becomes an issue, implement message archiving or pagination.

---

## 4. Task Ledger Management

### 4.1 No Task Cleanup

**What it does**: Completed tasks remain in ledger indefinitely.

**Task accumulation**:

```
Day 1: Create tasks 1-10
  ~/.claude/tasks/
    ├── 1.json (status: completed)
    ├── 2.json (status: completed)
    ├── ...
    └── 10.json (status: in_progress)

Day 30: 1000 tasks created
  ~/.claude/tasks/
    ├── 1.json (status: completed) ← Still here
    ├── 2.json (status: completed) ← Still here
    ├── ...
    └── 1000.json (status: pending)

Result: All 1000 task files persist (no automatic cleanup)
```

**Why no cleanup**:
- **Audit trail**: Completed tasks provide history of work done
- **Dependency references**: Other tasks may reference completed tasks in `blockedBy` fields
- **Low cost**: Task files are small (~500 bytes each), 1000 tasks = ~500 KB

**Trade-off**: Over time, task directory grows large (thousands of files), slowing down task listing operations.

### 4.2 Task Deletion Cleanup

**What it does**: When a task is deleted, it's removed from filesystem AND from dependency lists.

**Cleanup algorithm** (see [08_task_dependency_resolution.md](./08_task_dependency_resolution.md) Section 6.2):

```javascript
// ORIGINAL (simplified):
function sq6(A, q) {
    // Delete task file
    J67(WC1(A, q));

    // Remove from all dependency lists
    let z = WX(A);
    for (let w of z) {
        let H = w.blocks.filter((O) => O !== q),
            $ = w.blockedBy.filter((O) => O !== q);
        if (H.length !== w.blocks.length || $.length !== w.blockedBy.length) {
            JS(A, w.id, { blocks: H, blockedBy: $ });
        }
    }
    return !0;
}
```

**What's cleaned up on task deletion**:
- ✅ Task file deleted
- ✅ Removed from all `blocks` arrays
- ✅ Removed from all `blockedBy` arrays
- ✅ UI refreshed

**What's NOT cleaned up**:
- ❌ Task ID counter (next task ID continues incrementing)
- ❌ Task metadata in team config (if task was assigned to teammate)

**Why dependency cleanup important**: Prevents orphaned references (tasks blocked by deleted task ID).

### 4.3 Manual Task Cleanup

**What users do**: Manually delete old completed tasks to free disk space.

**Procedure**:

```bash
# List all tasks
ls ~/.claude/tasks/

# Find completed tasks (manually inspect JSON files)
cat ~/.claude/tasks/1.json | grep "completed"

# Delete completed tasks manually
rm ~/.claude/tasks/1.json
rm ~/.claude/tasks/2.json
# ... (repeat for all completed tasks)

# Or delete all tasks (DANGEROUS - loses all task history)
rm -rf ~/.claude/tasks/
```

**Risk**: Manual deletion may break dependencies if deleted task is referenced in `blockedBy` arrays. The task claiming algorithm handles this gracefully (deleted tasks treated as completed).

**Better approach**: Use task deletion via code (triggers dependency cleanup automatically).

---

## 5. Disk Space Growth Analysis

### 5.1 Growth Rate Estimates

**What it does**: Analyze how fast team storage grows over time.

**Storage components**:

| Component | File Size | Growth Rate | Example (30 days) |
|-----------|-----------|-------------|-------------------|
| Team config | ~1 KB | O(1) - constant | 1 KB |
| Mailbox messages | ~200 bytes/msg | O(messages) - linear | 100 msg/day × 30 = 600 KB |
| Task files | ~500 bytes/task | O(tasks) - linear | 50 tasks/day × 30 = 750 KB |
| Session memory | ~100 KB/session | O(sessions) - linear | 30 sessions × 100 KB = 3 MB |

**Total storage (30-day team)**:
- Team config: 1 KB
- Mailboxes: 600 KB (3000 messages)
- Tasks: 750 KB (1500 tasks)
- Session memory: 3 MB (30 sessions)
- **Total**: ~4.35 MB

**Disk space impact**: Negligible for modern systems (GBs of free space).

**When to worry**:
- Mailboxes > 10 MB (50K+ messages) - Slow mailbox reads
- Tasks > 10 MB (20K+ tasks) - Slow task list operations
- Total > 100 MB - Disk space concern

**Typical usage**: Most teams short-lived (< 1 day, < 100 messages, < 50 tasks). Storage growth not a practical concern.

### 5.2 Worst-Case Growth Scenarios

**Scenario 1: High-message-volume team**

```
Team lifespan: 30 days
Message rate: 1000 messages/day
Total messages: 30,000 messages

Storage: 30,000 × 200 bytes = 6 MB
Performance impact: Mailbox reads slow (parsing 30K JSON objects)
```

**Scenario 2: Long-running team with many tasks**

```
Team lifespan: 90 days
Task creation rate: 100 tasks/day
Total tasks: 9,000 tasks

Storage: 9,000 × 500 bytes = 4.5 MB
Performance impact: Task list operations slow (reading 9K files)
```

**Scenario 3: Many concurrent teams**

```
Active teams: 10
Average lifespan: 7 days each
Messages per team: 1000
Tasks per team: 100

Total storage: 10 × (1000 × 200 bytes + 100 × 500 bytes) = 2.5 MB
```

**Mitigation**: Manual cleanup (TeamDelete old teams, delete completed tasks).

### 5.3 No Disk Quota Enforcement

**Problem**: What if storage grows unbounded?

**Current behavior**: No disk quota limits.

```
User creates 1000 teams:
  ~/.claude/teams/ - 1000 directories
  Result: No error, no warning, consumes disk space until full
```

**Why no quota**:
- **Simplicity**: Quota enforcement adds complexity
- **Trust model**: Trust users to clean up when needed
- **Rare issue**: Storage growth slow (MBs per month), disk space plentiful (GBs)

**Alternative**: Implement quota (e.g., max 100 teams, max 10K tasks).
**Why not**: Engineering effort not justified given rare occurrence.

---

## 6. Manual Cleanup Procedures

### 6.1 Cleanup Old Teams

**What users do**: Delete teams that are no longer needed.

**Procedure**:

```bash
# List all teams
ls ~/.claude/teams/

# Delete specific team
claude code
> TeamDelete({ team_name: "old-team" })

# Or manually delete team directory
rm -rf ~/.claude/teams/old-team/
```

**What's deleted**:
- Team config
- Mailboxes (all messages)
- **WARNING**: Tasks directory also deleted (affects other teams)

**Recommendation**: Use TeamDelete tool (triggers proper cleanup) instead of manual `rm`.

### 6.2 Cleanup Old Sessions

**What users do**: Delete old session directories to free disk space.

**Procedure**:

```bash
# List all sessions
ls ~/.claude/

# Find old sessions (manually check timestamps)
ls -lt ~/.claude/ | head -20

# Delete old session
rm -rf ~/.claude/session-abc123/
```

**What's deleted**:
- Session memory files
- Conversation transcript
- Plan files
- Scratch files

**Recommendation**: Keep recent sessions (< 7 days), delete older ones.

### 6.3 Cleanup Completed Tasks

**What users do**: Remove completed tasks from ledger.

**Procedure**:

```bash
# List all tasks
ls ~/.claude/tasks/

# Inspect task status
cat ~/.claude/tasks/1.json | jq '.status'

# Delete completed tasks (CAREFUL: check dependencies first)
rm ~/.claude/tasks/1.json
rm ~/.claude/tasks/2.json
```

**Risk**: Deleting tasks may break references in `blockedBy` fields. The task claiming algorithm handles this (deleted tasks treated as completed).

**Better approach**: No built-in "archive completed tasks" command—must manually inspect and delete.

### 6.4 Cleanup Lock Files

**What users do**: Remove stale lock files if processes crash.

**Procedure**:

```bash
# Remove task lock
rm ~/.claude/tasks/tasks.lock

# Remove mailbox locks
rm ~/.claude/teams/*/mailboxes/*/inbox.lock
```

**When needed**: If process crashes and leaves stale locks (prevents new lock acquisitions).

**Safety**: `proper-lockfile` library detects stale locks automatically (checks PID), so manual cleanup rarely needed.

---

## 7. Design Rationale & Trade-offs

### 7.1 Why No Automatic Message Deletion?

**Problem**: Should mailbox messages be auto-deleted after being read?

**Solution**: No—mark as read but preserve.

**Rationale**:
1. **Debugging**: Can inspect message history
2. **Audit trail**: Full communication log preserved
3. **Low cost**: Messages are small (200 bytes), thousands fit in MB
4. **Simplicity**: No retention policy logic

**Trade-offs**:
- **Performance**: Large mailboxes (thousands of messages) slow down reads
- **Disk space**: Accumulates indefinitely (until team deleted)

**Alternative**: Auto-delete messages after N days or M messages.
**Why not**: Complexity not justified (most teams short-lived, < 1000 messages).

### 7.2 Why No Task Archiving?

**Problem**: Should completed tasks be archived to reduce task list size?

**Solution**: No—completed tasks remain in ledger.

**Rationale**:
1. **Audit trail**: Task history shows work completed
2. **Dependency references**: Completed tasks may be referenced in `blockedBy`
3. **Low cost**: Task files small (500 bytes), thousands fit in MB
4. **Simplicity**: No archive logic needed

**Trade-offs**:
- **Performance**: Large task lists (thousands of tasks) slow down task listing
- **Clutter**: UI shows all tasks (including old completed ones)

**Alternative**: Move completed tasks to `tasks-archive/` directory.
**Why not**: Dependency cleanup would need to check both directories (complexity).

### 7.3 Why Destructive Team Deletion?

**Problem**: Should TeamDelete preserve data for recovery?

**Solution**: No—complete deletion (team + tasks).

**Rationale**:
1. **Clean slate**: User wants fresh start (no leftover data)
2. **Simplicity**: No soft-delete or archive mechanism
3. **User intent**: Calling TeamDelete signals user wants data gone

**Trade-offs**:
- **Data loss risk**: Accidental deletion loses all data (no undo)
- **No recovery**: Cannot restore team after deletion

**Alternative**: Soft-delete (move to trash, restore option).
**Why not**: Engineering effort not justified (users expected to be careful).

### 7.4 Why Delete Tasks Directory on Team Deletion?

**Problem**: Should TeamDelete only delete this team's tasks or all tasks?

**Solution**: Delete ALL tasks (entire `~/.claude/tasks/` directory).

**Rationale**:
1. **Simplicity**: One deletion operation (no task filtering)
2. **Assumption**: User wants full cleanup
3. **Fresh start**: Next team starts with clean task ledger

**Trade-offs**:
- **Data loss**: Affects other teams sharing task directory
- **Unexpected behavior**: User may not expect all tasks deleted

**Likely bug**: Should filter tasks by team/owner before deleting. Current implementation deletes all tasks globally.

**Alternative**: Only delete tasks assigned to this team.
**Why not implemented**: May be oversight in implementation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `cleanupTeam` (F$1) - Complete team cleanup on deletion (chunks.123.mjs:187)
- `TeamDeleteTool` (USY) - Team deletion tool (chunks.141.mjs:759)
- `markMessageAsReadByIndex` (JQ1) - Mark mailbox message as read (chunks.129.mjs:1130)
- `deleteTask` (sq6) - Delete task and cleanup dependencies (chunks.48.mjs:530)
- `readTeamConfig` (M51) - Read team config from disk (chunks.131.mjs:2046)
- `deleteDirectory` (AR4) - Recursive directory deletion (utility function, location varies)
- `getTeamDirectory` (Ej6) - Get team directory path (chunks.123.mjs:21)
- `getTasksDirectory` (WL) - Get tasks directory path (chunks.48.mjs:452)

---

## Cross-References

- [02_spawn_mechanisms_deep_dive.md](./02_spawn_mechanisms_deep_dive.md) - Team creation (storage initialization)
- [03_mailbox_and_locking.md](./03_mailbox_and_locking.md) - Mailbox message format
- [08_task_dependency_resolution.md](./08_task_dependency_resolution.md) - Task deletion cleanup
- [10_session_memory_persistence.md](./10_session_memory_persistence.md) - Session vs. team storage
- [team_config_schema.md](./team_config_schema.md) - Team config file format

---

## Appendix: Storage Cleanup Checklist

### Weekly Cleanup (Recommended)

```bash
# Delete old sessions (> 7 days)
find ~/.claude/ -maxdepth 1 -type d -name "session-*" -mtime +7 -exec rm -rf {} \;

# Delete old teams (manually review first)
claude code
> TeamList()  # Check active teams
> TeamDelete({ team_name: "old-team" })  # Delete inactive teams
```

### Monthly Cleanup (Heavy Usage)

```bash
# Delete old tasks (manually inspect completed tasks)
cd ~/.claude/tasks/
for task in *.json; do
  status=$(cat $task | jq -r '.status')
  if [ "$status" = "completed" ]; then
    echo "Deleting completed task: $task"
    rm $task
  fi
done

# Delete stale locks
rm ~/.claude/tasks/tasks.lock 2>/dev/null
rm ~/.claude/teams/*/mailboxes/*/inbox.lock 2>/dev/null
```

### Emergency Cleanup (Disk Full)

```bash
# Delete ALL teams (DESTRUCTIVE)
rm -rf ~/.claude/teams/

# Delete ALL tasks (DESTRUCTIVE)
rm -rf ~/.claude/tasks/

# Delete ALL sessions (DESTRUCTIVE)
rm -rf ~/.claude/session-*/

# Keep only current session
current_session=$(claude code --print-session-id)
find ~/.claude/ -maxdepth 1 -type d -name "session-*" ! -name "$current_session" -exec rm -rf {} \;
```
