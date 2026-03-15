# Session Memory Persistence & Recovery for Agent Teams

> **Module**: Agent Teams - Session Memory & Persistence
> **Version**: Claude Code 2.1.76
> **Purpose**: Document session memory file format, recovery mechanisms, and limitations for team contexts

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Session Memory Architecture](#2-session-memory-architecture)
3. [Team State Persistence Model](#3-team-state-persistence-model)
4. [Session Resume Limitations](#4-session-resume-limitations)
5. [Storage Systems Comparison](#5-storage-systems-comparison)
6. [Recovery Mechanisms](#6-recovery-mechanisms)
7. [Design Rationale & Trade-offs](#7-design-rationale--trade-offs)

---

## 1. Executive Summary

Session memory in Claude Code provides **per-session persistent storage** for conversation context, but has **minimal integration with agent teams**. The persistence model for teams relies primarily on:

1. **Filesystem state**: Team config, task ledger, mailboxes (persistent across sessions)
2. **Process state**: In-process teammates (NOT persistent, lost on exit)
3. **Session memory**: General conversation history (team context NOT included)

**Key limitations**:
- **No team resume**: Exiting and restarting Claude does NOT restore active teammates
- **In-process teammates ephemeral**: Teammates exist only in-memory during session
- **No teammate conversation history**: Teammate interactions NOT saved to session memory
- **Manual recovery only**: User must recreate team after session restart

**v2.1.76 improvement**:
- **Session name preserved through compaction**: The session name (displayed in UI and used for `/resume`) is now preserved correctly when a compaction occurs. Previously, compaction could reset or lose the session name label. This improves the user experience for long-running sessions involving agent teams where compaction is more likely to trigger.

**Architecture**:
- Session memory: `~/.claude/{sessionId}/session-memory/*.md` - General conversation context
- Team state: `~/.claude/teams/{teamName}/` - Team config and member metadata
- Task state: `~/.claude/tasks/` - Task ledger (shared across teams)
- Mailboxes: `~/.claude/teams/{teamName}/mailboxes/{agentName}/` - Message queues

**Recovery model**: **Partial recovery only** — filesystem state (teams, tasks, mailboxes) persists, but active teammates must be manually respawned.

**Key insight**: Agent teams prioritize **stateless teammates** (can be spawned/killed without data loss) over **stateful teammates** (would require complex checkpoint/restore). This simplifies implementation but requires manual team recreation after restart.

---

## 2. Session Memory Architecture

### 2.1 Session Memory Directory Structure

**What it does**: Provides persistent storage for session-specific files (conversation history, auto memory, scratch files).

**Directory layout**:

```
~/.claude/{sessionId}/
├── session-memory/
│   ├── summary.md           # Conversation summary (after compaction)
│   ├── remembered_facts.md  # User-requested facts to remember
│   ├── context_*.md         # Additional context files
│   └── scratch/             # Temporary workspace files
├── plans/                   # Plan mode files (per-agent)
│   └── {agentId}/
│       └── plan.md
└── transcript.jsonl         # Full conversation transcript
```

**Session memory path function**:

```javascript
// ============================================
// getSessionMemoryDirectory - Compute session memory path
// Location: chunks.174.mjs:436-438
// ============================================

// ORIGINAL (for source lookup):
function hT6() {
    return kE(fJ(h6()), U6(), "session-memory") + DG
}

// READABLE (for understanding):
function getSessionMemoryDirectory() {
    return joinPath(getProjectRoot(), getSessionId(), "session-memory") + pathSeparator;
}

// Mapping: hT6->getSessionMemoryDirectory, kE->joinPath, fJ->getProjectRoot,
// h6->getClaudeDirectory, U6->getSessionId, DG->pathSeparator
```

**Path resolution**:
- `getProjectRoot()` -> `~/.claude/` (user home directory)
- `getSessionId()` -> Unique session identifier (e.g., `session-abc123`)
- Result: `~/.claude/session-abc123/session-memory/`

**Why this structure**:
- **Session isolation**: Each session has independent memory directory
- **Persistence**: Files survive process exit (written to disk)
- **Cleanup**: Old sessions can be deleted to free disk space

### 2.2 Session Memory Usage in Claude

**What it does**: Stores files that should persist across agent loop iterations within a session.

**Common use cases**:

| File | Purpose | Example |
|------|---------|---------|
| `summary.md` | Compacted conversation summary | Summary of 100+ message conversation |
| `remembered_facts.md` | User-requested persistent facts | "Project uses React 18.2" |
| `context_{topic}.md` | Topic-specific context | `context_api_design.md` |
| `scratch/temp_*.txt` | Temporary working files | Intermediate calculation results |

**v2.1.76 session name preservation**:

In v2.1.76, when compaction triggers, the session name is explicitly preserved:
- The session name (visible in UI and referenced by `/resume`) is saved before compaction begins
- After compaction writes the new summary, the session name is restored to the session metadata
- Previously, some compaction paths could reset the name to a default or empty string
- This matters especially for agent team sessions, which tend to run longer and are more likely to trigger compaction

**Why session name matters for teams**: Users often name sessions descriptively ("web-app team session") to find them later with `/resume`. Losing the name after compaction made it harder to resume long-running team sessions.

**File operations**:

```javascript
// Check if file is in session memory
function isSessionMemoryFile(filePath) {
    return resolvedPath(filePath).startsWith(getSessionMemoryDirectory());
}

// Read session memory file
let summaryPath = joinPath(getSessionMemoryDirectory(), "summary.md");
let summaryContent = readFileSync(summaryPath, "utf-8");
```

**Why session memory**:
- **Context preservation**: Facts and context survive conversation turns
- **Compact support**: Summaries reduce token usage after compaction
- **User control**: User can manually edit session memory files

**Limitation for teams**: Session memory is **per-session**, not **per-teammate**. Teammates don't have separate session memory directories — they share the team lead's session.

### 2.3 Session Memory Integration with Teams

**Problem**: How does session memory interact with agent teams?

**Current integration**: **Minimal** — session memory used only for team lead, not teammates.

**What's NOT in session memory**:
- Team config (stored in `~/.claude/teams/{teamName}/team.json`)
- Active teammate list (in-memory only, lost on exit)
- Teammate conversation history (ephemeral, not saved)
- Mailbox messages (stored in filesystem, not session memory)
- Task state (stored in `~/.claude/tasks/`, not session memory)

**What IS in session memory**:
- Team lead's conversation history (normal session memory behavior)
- Auto memory for team lead (if enabled)
- Plan files (in `plans/{agentId}/plan.md`, but separate from session-memory/)
- Session name (now preserved through compaction - v2.1.76)

**Why minimal integration**:
- **Stateless teammates**: Teammates designed to be ephemeral (spawn/kill without persistence)
- **Filesystem preference**: Team state stored in dedicated directories (teams/, tasks/)
- **Resume complexity**: Restoring active teammates requires complex checkpoint/restore logic

**Key insight**: Session memory is **conversation-focused** (text history, summaries), while team state is **coordination-focused** (config, tasks, messages). These are kept separate.

---

## 3. Team State Persistence Model

### 3.1 Filesystem-Backed Team State

**What it does**: Stores team state in filesystem directories that persist across sessions.

**Persistent team storage**:

```
~/.claude/
├── teams/
│   └── {teamName}/
│       ├── team.json              # Team config + member list
│       └── mailboxes/
│           ├── team-lead/
│           │   ├── message-001.json
│           │   └── message-002.json
│           ├── researcher/
│           │   └── message-001.json
│           └── backend-dev/
│               └── message-001.json
└── tasks/
    ├── 1.json   # Task ledger (shared across all teams)
    ├── 2.json
    └── tasks.lock
```

**Team config schema** (`team.json`):

```javascript
{
  "name": "web-app-team",
  "description": "Team for building web application",
  "createdAt": "2025-01-15T14:00:00.000Z",
  "members": [
    {
      "name": "team-lead",
      "type": "lead",
      "mode": "delegate",
      "active": true,
      "color": "#6366f1",
      "background": false
    },
    {
      "name": "researcher",
      "type": "in_process_teammate",
      "mode": "default",
      "active": false,
      "taskId": "3",
      "plan_mode_required": false,
      "color": "#8b5cf6",
      "awaitingPlanApproval": false,
      "background": false
    },
    {
      "name": "backend-dev",
      "type": "pane_teammate",
      "mode": "default",
      "active": true,
      "paneId": "pane-abc123",
      "backendType": "tmux",
      "color": "#10b981",
      "background": true
    }
  ]
}
```

**Field meanings**:

| Field | Type | Meaning | Persistent? |
|-------|------|---------|-------------|
| `name` | string | Agent name (unique within team) | Yes |
| `type` | string | `"lead"`, `"in_process_teammate"`, `"pane_teammate"` | Yes |
| `mode` | string | Permission mode (`"default"`, `"plan"`, `"delegate"`) | Yes |
| `active` | boolean | Is agent currently working (or idle)? | Yes |
| `taskId` | string | Claimed task ID (if any) | Yes |
| `plan_mode_required` | boolean | Must submit plan for approval | Yes |
| `paneId` | string | Terminal pane ID (pane teammates only) | Yes |
| `awaitingPlanApproval` | boolean | Waiting for lead to approve plan | Yes |
| `background` | boolean | Background worker (v2.1.76) | Yes |

**What persists across sessions**:
- Team membership roster
- Agent permissions (mode)
- Task assignments
- Mailbox messages
- Team configuration (name, description)
- Background agent flags (v2.1.76)

**What does NOT persist**:
- Active in-process teammates (process state lost)
- Agent conversation history (ephemeral)
- Current agent loop position (must restart from beginning)
- Pending tool executions (aborted on exit)

**Why filesystem persistence**:
- **Crash resilience**: Team state survives process crashes
- **Multi-process**: Pane-based teammates (separate processes) need shared state
- **Debuggability**: Can inspect team state by reading JSON files

### 3.2 In-Process vs. Pane-Based Persistence

**Key difference**: In-process teammates are **ephemeral**, pane-based teammates are **semi-persistent**.

**In-process teammate lifecycle**:

```
Session Start -> Spawn teammate -> Agent loop runs in-memory -> Session End -> Process exits
                                                                              |
                                                                    Teammate LOST (no checkpoint)
```

**Characteristics**:
- **Spawn time**: Fast (~100ms)
- **Memory footprint**: Shared with team lead process
- **Persistence**: None (pure in-memory)
- **Recovery**: Must respawn after restart

**Pane-based teammate lifecycle**:

```
Session Start -> Spawn pane -> New Claude process -> Agent loop -> Session End -> Pane exits
                               (separate process)                              |
                                                                    Pane LOST (process killed)
                                                                    BUT pane ID + config persisted
```

**Characteristics**:
- **Spawn time**: Slower (~1-2 seconds for pane creation)
- **Memory footprint**: Separate process (independent)
- **Persistence**: Pane ID stored in team config
- **Recovery**: Pane history viewable, but process must be respawned

**Why in-process teammates are ephemeral**:
- **Simplicity**: No checkpoint/restore logic needed
- **Fast iteration**: Spawn/kill quickly without saving state
- **Memory efficiency**: No serialization overhead

**Trade-off**: Ephemeral teammates require manual recreation after restart. Persistent teammates would need complex state serialization.

### 3.3 Mailbox vs. Session Memory

**Problem**: Where should messages be stored — mailbox or session memory?

**Solution**: Mailboxes (separate from session memory).

**Comparison**:

| Feature | Mailbox | Session Memory |
|---------|---------|----------------|
| Location | `~/.claude/teams/{teamName}/mailboxes/{agentName}/` | `~/.claude/{sessionId}/session-memory/` |
| Purpose | Inter-agent message delivery | Conversation context storage |
| Persistence | Across sessions | Across sessions |
| Format | JSON (structured messages) | Markdown (human-readable) |
| Access pattern | Polling (read + delete) | Direct file I/O |
| Multi-process | Yes (file locking) | No (single session) |

**Why separate mailboxes**:
- **Multi-process coordination**: Pane teammates need shared message queue
- **Polling model**: Messages consumed and marked as read (not append-only like session memory)
- **Structured data**: Messages are JSON objects with schema validation

**Why NOT in session memory**:
- **Session isolation**: Session memory is per-session, but teams span sessions (if resumed)
- **Message deletion**: Mailbox messages are consumed (deleted), session memory is append-only
- **Schema mismatch**: Session memory expects markdown files, mailboxes need JSON

---

## 4. Session Resume Limitations

### 4.1 Resume Workflow

**What it does**: Allows resuming a previous conversation session via `--resume` flag or `/resume` command.

**General resume behavior** (non-teams):

```bash
# Start session
claude code  # Creates session-abc123

# Exit (Ctrl+C)

# Resume later
claude code --resume session-abc123  # Loads transcript, continues conversation
```

**What's restored on resume**:
- Conversation history (from `transcript.jsonl`)
- Session memory files (`session-memory/*.md`)
- Auto memory state
- Plan mode state (if in plan mode when exited)
- Session name (preserved through compaction in v2.1.76)

**What's NOT restored on resume**:
- Active agent teams
- In-process teammates
- Background tasks
- Pending tool executions

### 4.2 Team Resume Limitation

**Problem**: What happens to active teams when resuming a session?

**Current behavior**: **Teams are NOT restored**.

**Example scenario**:

```
Session 1:
  User: "Create a team called web-app-team"
  Claude: [Creates team, spawns 2 in-process teammates]
  User exits (Ctrl+C)

Resume Session 1:
  claude code --resume session-abc123

  Result:
  - Conversation history restored (session name preserved - v2.1.76)
  - Team directory still exists (~/.claude/teams/web-app-team/)
  - Team config file persists
  - Mailbox messages persist
  - Tasks persist
  - Active teammates LOST (not respawned)
  - User must manually recreate team
```

**Why teams not restored**:
1. **In-process state loss**: In-process teammates are pure memory (no serialization)
2. **Pane state loss**: Pane teammates are separate processes (killed on exit)
3. **No checkpoint mechanism**: No code to snapshot teammate agent loop state
4. **Complexity**: Would require:
   - Serializing agent loop state (conversation history, pending tools)
   - Restoring mailbox poll positions
   - Reconnecting to panes (if pane-based)
   - Validating team config still valid

**Workaround**: User must manually call `TeamCreate` again after resume to respawn teammates.

### 4.3 Partial State Recovery

**What it does**: Even though teammates aren't restored, their **work products** persist.

**What remains after session exit**:

```
Filesystem state:
~/.claude/teams/web-app-team/
  ├── team.json               - Persists (member roster, config)
  └── mailboxes/
      ├── researcher/
      │   └── message-001.json - Persists (unread messages)
      └── backend-dev/
          └── message-001.json - Persists

~/.claude/tasks/
  ├── 1.json                   - Persists (task status, owner, blockedBy)
  ├── 2.json                   - Persists
  └── tasks.lock

Project files:
src/api/users.js               - Persists (code written by teammates)
```

**Recovery process** (manual):

1. **Resume session**: `claude code --resume session-abc123`
2. **Check team state**: `ls ~/.claude/teams/` (team directory exists)
3. **Inspect tasks**: Read `~/.claude/tasks/*.json` (see what was completed)
4. **Read mailboxes**: Check for undelivered messages
5. **Recreate team**: Call `TeamCreate` to respawn teammates
6. **Reassign tasks**: Teammates can claim tasks from ledger (work preserved)

**Why partial recovery is useful**:
- **Work not lost**: Code changes, task completions persist
- **Message queue intact**: Can resume communication where left off
- **Manual control**: User decides whether to respawn team or work solo

**Trade-off**: Requires user awareness and manual intervention. Fully automatic recovery would be more seamless but complex to implement.

### 4.4 Alternative: Manual Team Recreation

**What users do**: Instead of resuming, create a new team with same name.

**Workflow**:

```
Session 1:
  TeamCreate({ name: "web-app-team", description: "..." })
  [Teammates work on tasks]
  Exit

Session 2 (new session, no resume):
  TeamCreate({ name: "web-app-team", description: "..." })

  Result:
  - Team config OVERWRITTEN (members list reset)
  - Mailboxes RESET (old messages discarded)
  - Tasks PRESERVED (global ledger unchanged)
```

**Why this works**:
- **Task continuity**: Tasks are global (not per-team), so new teammates can pick up where old team left off
- **Fresh start**: No stale state from previous team incarnation
- **Simpler**: No complex resume logic needed

**Trade-off**: Loses unread mailbox messages and member metadata from previous session.

---

## 5. Storage Systems Comparison

### 5.1 Three Storage Systems

**Claude Code uses three independent storage systems for different purposes:**

| System | Location | Purpose | Persistence | Multi-Process |
|--------|----------|---------|-------------|---------------|
| **Session Memory** | `~/.claude/{sessionId}/session-memory/` | Conversation context | Across sessions | Single session |
| **Team State** | `~/.claude/teams/{teamName}/` | Team config + mailboxes | Across sessions | Multi-process |
| **Task Ledger** | `~/.claude/tasks/` | Global task list | Across sessions | Multi-process |

**Use case mapping**:

```
Conversation summary         -> Session Memory (summary.md)
Team member roster           -> Team State (team.json)
Inter-agent messages         -> Team State (mailboxes/)
Task assignments             -> Task Ledger (tasks/*.json)
Plan files                   -> Session directory (plans/{agentId}/plan.md)
Auto memory                  -> Session Memory (auto-memory/)
```

**Why three systems**:
- **Separation of concerns**: Conversation != Coordination != Task management
- **Different lifetimes**: Sessions are temporary, teams/tasks may span multiple sessions
- **Different access patterns**: Session memory is append-only, mailboxes are polling-based

### 5.2 Data Flow Between Systems

**How data moves**:

```
User input
  |
Team Lead Session Memory (conversation history)
  |
TeamCreate tool
  |
Team State (team.json created)
  |
Spawn teammates
  |
Task Ledger (teammate claims task)
  |
SendMessage tool
  |
Mailbox (message written to ~/.claude/teams/{teamName}/mailboxes/{receiver}/)
  |
Teammate polls mailbox
  |
TaskUpdate tool
  |
Task Ledger (task marked completed)
```

**Key insight**: Systems are **loosely coupled**. Session memory doesn't reference teams, teams don't reference session memory. Only the **agent loop logic** bridges them (tools read/write to both).

### 5.3 Storage Cleanup Strategies

**Covered in separate document**: [11_storage_cleanup_management.md](./11_storage_cleanup_management.md)

**Quick summary**:
- **Session memory**: Manual cleanup (delete old sessions via `rm -rf ~/.claude/{sessionId}`)
- **Team state**: Cleanup on team deletion (`TeamDelete` tool removes team directory)
- **Task ledger**: No automatic cleanup (tasks accumulate indefinitely)
- **Mailboxes**: Messages marked as read but not deleted (accumulate until team cleanup)

---

## 6. Recovery Mechanisms

### 6.1 Crash Recovery

**Problem**: What happens if Claude Code crashes while team is active?

**Current behavior**:

```
Scenario: Crash during agent loop
  Team lead: Running
  Teammate 1 (in-process): Running
  Teammate 2 (pane): Running

  -> System crashes (e.g., segfault, power loss)

  Result:
  - Team config: Persists (last saved state)
  - Task ledger: Persists (last committed task updates)
  - Mailboxes: Persist (messages written to disk)
  - In-process teammates: Lost (no checkpoint)
  - Pane teammates: Lost (process killed)
  - Pending tool executions: Lost (in-memory state)
```

**Recovery steps**:

1. **Restart Claude**: `claude code` (new session)
2. **Inspect state**: Check `~/.claude/teams/` and `~/.claude/tasks/`
3. **Verify data integrity**: Ensure JSON files not corrupted
4. **Manual recovery**: Recreate team if needed
5. **Resume work**: Teammates can reclaim tasks from ledger

**No automatic recovery**: User must manually restart team.

**Why no automatic recovery**:
- **Complexity**: Detecting crash vs. normal exit is non-trivial
- **State consistency**: Partial checkpoints may be inconsistent
- **Rare occurrence**: Crashes uncommon (not worth engineering effort)

### 6.2 Corrupted File Recovery

**Problem**: What if team config or task ledger file becomes corrupted?

**Detection**:

```javascript
// Reading team config
try {
    let config = JSON.parse(readFileSync(teamConfigPath, "utf-8"));
} catch (error) {
    console.error(`[TeammateTool] Failed to read team file for ${teamName}: ${error.message}`);
    return null;  // Treat as non-existent team
}
```

**Behavior**:
- **Parse failure**: Treated as missing team (ignored)
- **Schema validation**: No strict validation (accepts partial/invalid config)
- **No automatic repair**: No attempt to fix corruption

**Manual recovery**:

```bash
# Backup corrupted file
cp ~/.claude/teams/web-app-team/team.json ~/.claude/teams/web-app-team/team.json.bak

# Manually edit JSON to fix syntax errors
vim ~/.claude/teams/web-app-team/team.json

# Or delete and recreate team
rm -rf ~/.claude/teams/web-app-team/
# Then call TeamCreate tool again
```

**Why no automatic repair**:
- **Rare**: File corruption uncommon (modern filesystems are robust)
- **Data loss risk**: Automated repair could delete valid data
- **User control**: Manual editing safer

### 6.3 Lock File Cleanup

**Problem**: If process crashes, lock files may persist.

**Lock file locations**:
- `~/.claude/tasks/tasks.lock` - Global task ledger lock
- `~/.claude/teams/{teamName}/mailboxes/{agent}/inbox.lock` - Per-mailbox locks

**Stale lock detection**: `proper-lockfile` library handles stale lock detection via:
- Lock file timestamp
- PID validation (check if locking process still alive)

**Automatic cleanup**: `proper-lockfile` removes stale locks automatically on next lock attempt.

**Manual cleanup** (if needed):

```bash
# Remove stale task lock
rm ~/.claude/tasks/tasks.lock

# Remove stale mailbox locks
rm ~/.claude/teams/*/mailboxes/*/inbox.lock
```

**Why automatic cleanup works**: Filesystem locking libraries are designed to handle crashes gracefully.

---

## 7. Design Rationale & Trade-offs

### 7.1 Why Ephemeral Teammates?

**Problem**: Should teammates be persistent (survive restart) or ephemeral (must respawn)?

**Solution**: Ephemeral.

**Rationale**:
1. **Simplicity**: No checkpoint/restore logic needed
2. **Fast iteration**: Spawn/kill teammates quickly during development
3. **Stateless**: Teammates don't accumulate state that needs saving
4. **Work preservation**: File changes and task updates persist (teammates are just executors)

**Trade-offs**:
- **Manual recreation**: User must respawn teammates after restart
- **No conversation continuity**: Teammate conversation history lost
- **Startup overhead**: Must respawn all teammates on each session

**Alternative**: Persistent teammates (checkpoint agent loop state).
**Why not**: Would require:
- Serializing conversation history
- Saving pending tool execution state
- Restoring mailbox poll positions
- Complex state validation on resume

### 7.2 Why Separate Team Storage from Session Memory?

**Problem**: Should team state be part of session memory?

**Solution**: No — separate directories.

**Rationale**:
1. **Lifetime mismatch**: Teams may outlive sessions (if user wants to resume team later)
2. **Multi-session teams**: Same team used across multiple sessions
3. **Global tasks**: Task ledger shared across all sessions, not session-specific
4. **Schema mismatch**: Team config is JSON, session memory is markdown

**Trade-offs**:
- **No unified storage**: Must manage two storage systems
- **No automatic cleanup**: Team directories persist even after session ends
- **Manual coordination**: User must remember team names across sessions

**Alternative**: Store team state in session memory.
**Why not**: Would tie teams to specific sessions (can't resume team in new session).

### 7.3 Why No Automatic Team Resume?

**Problem**: Should teams be automatically restored when resuming a session?

**Solution**: No — manual recreation required.

**Rationale**:
1. **Complexity**: Restoring in-process teammates requires complex state serialization
2. **Pane reconnection**: Pane-based teammates are separate processes (hard to restore)
3. **User control**: User may not want to resume team (prefer solo work)
4. **Rare use case**: Most sessions are fresh starts, not resumes

**Trade-offs**:
- **User friction**: Must manually call TeamCreate after resume
- **Lost context**: Teammates don't remember previous conversation
- **Slower restart**: Must wait for teammates to respawn

**Alternative**: Automatic team restoration on resume.
**Why not**: Engineering effort not justified given rare use case and implementation complexity.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getSessionMemoryDirectory` (hT6) - Compute session memory path (chunks.174.mjs:436)
- `getSessionId` (U6) - Get current session ID (chunks.1.mjs:2425)
- `writeTeamConfig` (mSY) - Write team config to disk (chunks.141.mjs:534)
- `readTeamConfig` (M51) - Read team config from disk (chunks.131.mjs:2046)
- `getTeamConfigPath` (ul4) - Compute team config path (chunks.141.mjs:530)
- `getTeamsBaseDirectory` (QP) - Get teams base directory (chunks.1.mjs:4047)

---

## Cross-References

- [01_complete_chain_analysis.md](./01_complete_chain_analysis.md) - Team lifecycle (persistence points)
- [03_mailbox_and_locking.md](./03_mailbox_and_locking.md) - Mailbox persistence
- [08_task_dependency_resolution.md](./08_task_dependency_resolution.md) - Task ledger persistence
- [11_storage_cleanup_management.md](./11_storage_cleanup_management.md) - Cleanup strategies
- [team_config_schema.md](./team_config_schema.md) - Team config file format

---

## Appendix: Session Memory vs. Team Storage Summary

| Aspect | Session Memory | Team Storage |
|--------|----------------|--------------|
| **Path** | `~/.claude/{sessionId}/session-memory/` | `~/.claude/teams/{teamName}/` |
| **Content** | Markdown files (conversation context) | JSON files (config) + mailboxes |
| **Lifetime** | Session duration (or until manual cleanup) | Until team deleted |
| **Access** | Single session (team lead only) | Multi-process (all teammates) |
| **Resume** | Restored on `--resume` (name preserved v2.1.76) | NOT restored (manual recreation) |
| **Cleanup** | Manual (delete session directory) | Automatic on TeamDelete |
| **Purpose** | Preserve conversation context | Coordinate multi-agent work |
