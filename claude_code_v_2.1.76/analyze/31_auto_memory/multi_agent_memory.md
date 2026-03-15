# Multi-Agent Memory - Isolation and Sharing Patterns

> **Module**: Auto Memory - Multi-Agent Scenarios
> **Source**: `chunks.87.mjs` (lines 2194-2221), Team context integration
> **Version**: Claude Code v2.1.76

---

## Table of Contents

1. [Overview](#1-overview)
2. [Memory Isolation Model](#2-memory-isolation-model)
3. [Directory Resolution Algorithm](#3-directory-resolution-algorithm)
4. [Shared Memory Scenarios](#4-shared-memory-scenarios)
5. [Memory Synchronization](#5-memory-synchronization)
6. [Team Context Integration](#6-team-context-integration)
7. [Use Cases and Trade-offs](#7-use-cases-and-trade-offs)
8. [Remote Memory in Multi-Agent Setups](#8-remote-memory-in-multi-agent-setups)
9. [Related Symbols](#9-related-symbols)

---

## 1. Overview

When multiple Claude Code agents collaborate (via Agent Teams), the memory system must handle questions about **isolation** (does each agent have private memory?) and **sharing** (can agents access shared project knowledge?).

### Key Questions

**Q: Do teammates share memory with the team lead?**
**A: Yes (by default)** - All agents in the same project directory share the same memory directory at `~/.claude/projects/{projectHash}/memory/`

**Q: Can teammates have private memory?**
**A: Not in current implementation** - Memory is scoped by project path, not agent ID

**Q: Do in-process vs pane-based teammates differ in memory access?**
**A: No** - Both backend types use the same memory directory resolution logic

**Q: Can I have per-agent memory?**
**A: Workaround available** - Use different working directories or remote memory paths per agent

---

## 2. Memory Isolation Model

### Default Model: Shared by Project

```
Project directory: /Users/alice/my-app/
  → Project hash: abc123def456
  → Memory dir: ~/.claude/projects/abc123def456/memory/

Team lead (working dir: /Users/alice/my-app/)
  → Memory: ~/.claude/projects/abc123def456/memory/  SAME

Teammate 1 (working dir: /Users/alice/my-app/)
  → Memory: ~/.claude/projects/abc123def456/memory/  SAME

Teammate 2 (working dir: /Users/alice/my-app/)
  → Memory: ~/.claude/projects/abc123def456/memory/  SAME
```

**Key insight**: Memory is tied to the **working directory path**, not the agent identity. All agents with the same `cwd` share memory.

### Alternative Model: Isolated by Agent (Manual Setup)

To achieve per-agent memory, use different working directories:

```
Team lead (cwd: /Users/alice/my-app/)
  → Memory: ~/.claude/projects/{hash1}/memory/

Teammate 1 (cwd: /Users/alice/my-app-agent1/)  # Symlink or git clone
  → Memory: ~/.claude/projects/{hash2}/memory/

Teammate 2 (cwd: /Users/alice/my-app-agent2/)  # Symlink or git clone
  → Memory: ~/.claude/projects/{hash3}/memory/
```

**Trade-off**: Requires manual directory setup, but provides complete memory isolation.

---

## 3. Directory Resolution Algorithm

### Step-by-Step Resolution

**Function: `getAutoMemoryDirectory` (mu1)**

```javascript
// ============================================
// getAutoMemoryDirectory - Resolve memory directory path
// Location: chunks.87.mjs:2213-2216
// ============================================

// ORIGINAL (for source lookup):
function mu1() {
    let A = cO6(ga(), "projects");
    return (cO6(A, dx(LU7()), kU7) + UN9).normalize("NFC")
}

// READABLE (for understanding):
function getAutoMemoryDirectory() {
    // Check for custom directory override first (v2.1.59)
    const settings = getUserSettings();
    if (settings.autoMemoryDirectory) {
        return settings.autoMemoryDirectory;
    }

    // Step 1: Get base home directory (with remote override support)
    let homeDir = getHomeDirectory();  // ga()

    // Step 2: Compute projects directory
    let projectsDir = path.join(homeDir, "projects");

    // Step 3: Get current working directory (or session context)
    let contextPath = getCurrentContextPath();  // LU7()

    // Step 4: Hash the context path to create stable project identifier
    let projectHash = hashPath(contextPath);  // dx(LU7())

    // Step 5: Build full memory directory path
    let memoryDir = path.join(projectsDir, projectHash, "memory");

    // Step 6: Normalize Unicode
    return (memoryDir + "/").normalize("NFC");
}

// Mapping: mu1→getAutoMemoryDirectory, ga→getHomeDirectory, cO6→path.join,
// dx→hashPath, LU7→getCurrentContextPath, kU7→"memory", UN9→"/"
```

### Resolution Examples

**Example 1: Standard setup**
```
cwd: /Users/alice/projects/my-app
homeDir: /Users/alice/.claude
contextPath: /Users/alice/projects/my-app
projectHash: a1b2c3d4e5f6g7h8
memoryDir: /Users/alice/.claude/projects/a1b2c3d4e5f6g7h8/memory
```

**Example 2: Remote memory**
```
cwd: /Users/alice/projects/my-app
CLAUDE_CODE_REMOTE_MEMORY_DIR: /mnt/shared-memory
contextPath: /Users/alice/projects/my-app
projectHash: a1b2c3d4e5f6g7h8
memoryDir: /mnt/shared-memory/projects/a1b2c3d4e5f6g7h8/memory
```

**Example 3: Custom directory (v2.1.59)**
```
autoMemoryDirectory: ~/team-memory/
memoryDir: ~/team-memory/  (no project hash, fixed path)
```

---

## 4. Shared Memory Scenarios

### Scenario 1: Team Lead + In-Process Teammates

```
Configuration:
- Team lead: main process
- Teammates: in-process backend (same Node.js process)
- All share: same cwd

Memory behavior:
- All agents read same MEMORY.md on session start
- Writes from any agent update shared MEMORY.md
- Race condition: simultaneous writes may conflict
- Next turn: all agents see updated content
```

**Use case**: Collaborative troubleshooting where all agents benefit from shared learnings.

### Scenario 2: Team Lead + Pane-Based Teammates

```
Configuration:
- Team lead: main tmux pane
- Teammates: separate tmux panes (separate processes)
- All share: same cwd

Memory behavior:
- Same as Scenario 1 - memory directory is identical
- File system handles synchronization
- Write conflicts possible if two agents write simultaneously
```

### Scenario 3: Distributed Team (Remote Workers)

```
Configuration:
- Team lead: Alice's laptop (/Users/alice/project)
- Teammate: Bob's laptop (/Users/bob/project)
- Different machines → different memory directories by default

Memory behavior:
- No shared memory - completely isolated
- Can enable sharing via CLAUDE_CODE_REMOTE_MEMORY_DIR on network storage
```

**To enable sharing**:
```bash
# On both machines, point to network share
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/nfs-share/.claude
```

---

## 5. Memory Synchronization

### Write Synchronization

**Current implementation: Last-write-wins (no explicit locking)**

```javascript
// Agent 1 writes:
fs.writeFileSync(memoryPath, content1);

// Agent 2 writes simultaneously:
fs.writeFileSync(memoryPath, content2);

// Result: Whichever write completes second wins
// Previous content is lost
```

**Conflict scenario**:
```
T0: MEMORY.md contains: "## Notes\n- Pattern A"
T1: Team lead reads MEMORY.md
T2: Teammate reads MEMORY.md
T3: Team lead writes: "## Notes\n- Pattern A\n- Pattern B"
T4: Teammate writes: "## Notes\n- Pattern A\n- Pattern C"
T5: Final content: "## Notes\n- Pattern A\n- Pattern C"  ← Pattern B lost!
```

**Mitigation strategies**:

**Strategy 1: Topic file separation (recommended)**
```
Instead of both writing to MEMORY.md:
- Team lead writes to: architecture.md
- Teammate writes to: debugging.md
- MEMORY.md just links to both (updated less frequently)
```

**Strategy 2: Read-before-write pattern**
```javascript
async function safeAppendMemory(newContent) {
    let current = fs.readFileSync(memoryPath, 'utf-8');
    let merged = mergeContent(current, newContent);
    fs.writeFileSync(memoryPath, merged);
}
```

### Read Synchronization

**No synchronization needed** - reads are always from current file state

```javascript
// buildMemoryPrompt is called at start of each turn
function buildMemoryPrompt() {
    let content = fs.readFileSync(memoryPath, 'utf-8');  // Always latest
    return formatPrompt(content);
}
```

---

## 6. Team Context Integration

### Current Behavior

Memory directory resolution does **not** currently factor in team context:

```javascript
// Hypothetical agent-aware resolution (NOT implemented):
function getMemoryDirectoryForAgent(agentId, teamName) {
    if (teamName && agentId !== TEAM_LEAD_ID) {
        return `${baseDir}/teams/${teamName}/agents/${agentId}/memory/`;
    }
    return `${baseDir}/projects/${projectHash}/memory/`;
}
```

**Why not implemented**:
- Shared memory is the common case (collaborative work)
- Isolated memory can be achieved via different working directories
- Complexity of synchronizing shared + isolated memory

---

## 7. Use Cases and Trade-offs

### Use Case 1: Shared Knowledge Base

**Setup**: All agents share same memory directory (default behavior)

**Pros**:
- Knowledge accumulates across all agents
- Patterns discovered by any agent benefit the team
- No synchronization overhead (file system handles it)

**Cons**:
- Write conflicts possible (last-write-wins)
- No privacy (all agents see all memory)
- Large teams may overwhelm single MEMORY.md

**Best for**: Small teams (2-3 agents), collaborative debugging, shared project knowledge

### Use Case 2: Isolated Agent Memory

**Setup**: Each agent has different working directory → different memory

**Pros**:
- No write conflicts (separate files)
- Privacy (agents don't see each other's notes)
- Specialized memory per agent role

**Cons**:
- No knowledge sharing (duplicated learnings)
- Manual setup required
- Sync overhead if sharing is needed

**Best for**: Large teams (5+ agents), role-specific agents (frontend/backend specialists)

### Use Case 3: Custom Directory for Shared Team Memory (v2.1.59)

**Setup**: All team members configure same `autoMemoryDirectory` in settings

```json
// ~/.claude/settings.json on all team machines
{
  "autoMemoryDirectory": "/mnt/team-share/claude-memory/"
}
```

**Pros**:
- Predictable, fixed path (no project hash required)
- Easy to audit and manage
- Works for custom team workflows

**Cons**:
- Requires manual directory configuration per developer
- All agents share same memory (may conflict for different projects)

---

## 8. Remote Memory in Multi-Agent Setups

### Configuration

```bash
# Point all agents to shared network location
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/nfs-share/.claude

# Agent 1 (Alice's machine):
# Resolves to: /mnt/nfs-share/projects/{projectHash}/memory/

# Agent 2 (Bob's machine):
# Resolves to: /mnt/nfs-share/projects/{projectHash}/memory/
#              SAME DIRECTORY
```

### Network Storage Requirements

| Storage Type | Supported | Latency | Recommended Use |
|--------------|-----------|---------|-----------------|
| **NFS** | Yes | <10ms | Production teams, always-on servers |
| **SMB/CIFS** | Yes | <20ms | Windows shares, cross-platform teams |
| **SSHFS** | Yes | 10-50ms | Remote development, SSH-based workflows |
| **Dropbox/Google Drive** | Limited | 1-60s | Personal multi-machine |
| **S3/GCS (direct)** | No | 100-500ms | Not POSIX-compliant, too slow |

### Distributed Team Example

```bash
# Shared NFS mount at /mnt/team-memory

# Team lead (Alice's laptop):
cd /Users/alice/my-app
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/team-memory
claude

# Teammate (Bob's laptop):
cd /Users/bob/my-app  # Same project, different clone
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/team-memory
claude

# Both agents share:
# /mnt/team-memory/projects/{same-project-hash}/memory/
```

---

## 9. Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `getAutoMemoryDirectory` (mu1) - Resolve memory directory path based on context
- `getHomeDirectory` (ga) - Get base home directory with remote override support
- `getCurrentContextPath` (LU7) - Get current working directory or session context path
- `hashPath` (dx) - Generate stable hash of path string for directory naming
- `isAutoMemoryEnabled` (y2) - Check if auto memory is enabled (respects remote mode)
- `buildMemoryPrompt` (m0A) - Build memory section of system prompt with truncation
- `MEMORY_MD_FILENAME` (Ua / pN9) - Constant "MEMORY.md"
- `MEMORY_MAX_LINES` (Qu1) - Constant 200 (truncation limit)

Cross-references:

- [architecture.md](./architecture.md) - Auto memory system architecture
- [usage_patterns.md](./usage_patterns.md) - Best practices for organizing memory
- [remote_memory_sync.md](./remote_memory_sync.md) - Detailed remote memory setup
- [30_agent_teams/agent_teams_architecture.md](../30_agent_teams/agent_teams_architecture.md) - Agent team context
