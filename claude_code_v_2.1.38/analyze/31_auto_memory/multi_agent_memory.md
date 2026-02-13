# Multi-Agent Memory - Isolation and Sharing Patterns

> **Module**: Auto Memory - Multi-Agent Scenarios
> **Source**: `chunks.87.mjs` (lines 2194-2221), Team context integration
> **Version**: Claude Code 2.1.38

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
  → Memory: ~/.claude/projects/abc123def456/memory/  ✅ SAME

Teammate 1 (working dir: /Users/alice/my-app/)
  → Memory: ~/.claude/projects/abc123def456/memory/  ✅ SAME

Teammate 2 (working dir: /Users/alice/my-app/)
  → Memory: ~/.claude/projects/abc123def456/memory/  ✅ SAME
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

    // Step 6: Normalize Unicode (handles special characters consistently)
    return memoryDir.normalize("NFC");
}

// Mapping: mu1→getAutoMemoryDirectory, ga→getHomeDirectory, cO6→path.join, dx→hashPath, LU7→getCurrentContextPath, kU7→"memory", UN9→"/", A→homeDir
```

### Key Components

**1. getHomeDirectory (ga)**
```javascript
function getHomeDirectory() {
    // Check for remote memory override
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    }

    // Default: User's home directory (~)
    return os.homedir();
}
```

**Why important**: `CLAUDE_CODE_REMOTE_MEMORY_DIR` allows pointing all agents to a shared network location.

**2. getCurrentContextPath (LU7)**
```javascript
function getCurrentContextPath() {
    // Try to get session-specific context (for subagents)
    let sessionContext = getSessionContext();
    if (sessionContext?.contextPath) {
        return sessionContext.contextPath;
    }

    // Fall back to current working directory
    return process.cwd();
}
```

**Why important**: This is where agent identity *could* affect memory (via session context), but currently it just uses `cwd`.

**3. hashPath (dx)**
```javascript
function hashPath(path) {
    // Create stable hash of path string
    // Ensures same path always maps to same directory
    return crypto.createHash('sha256').update(path).digest('hex').substring(0, 16);
}
```

**Why important**: Hashing prevents special characters in path from breaking file system operations.

### Resolution Examples

**Example 1: Standard setup**
```
cwd: /Users/alice/projects/my-app
homeDir: /Users/alice
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

**Example 3: Different working directories (isolated memory)**
```
Team lead:
  cwd: /Users/alice/my-app
  memoryDir: ~/.claude/projects/{hash-of-/Users/alice/my-app}/memory

Teammate:
  cwd: /Users/alice/my-app-teammate1
  memoryDir: ~/.claude/projects/{hash-of-/Users/alice/my-app-teammate1}/memory
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
✅ All agents read same MEMORY.md on session start
✅ Writes from any agent update shared MEMORY.md
⚠️  Race condition: simultaneous writes may conflict
✅ Next turn: all agents see updated content
```

**Use case**: Collaborative troubleshooting where all agents benefit from shared learnings.

**Example workflow**:
```
1. Team lead reads MEMORY.md, sees: "API uses GraphQL"
2. Teammate 1 discovers new pattern: "GraphQL errors use { code, message } format"
3. Teammate 1 writes to memory/api_patterns.md
4. Team lead's next turn: reads updated api_patterns.md
5. Both agents now have same knowledge
```

### Scenario 2: Team Lead + Pane-Based Teammates

```
Configuration:
- Team lead: main tmux pane
- Teammates: separate tmux panes (separate processes)
- All share: same cwd

Memory behavior:
✅ Same as Scenario 1 - memory directory is identical
✅ File system handles synchronization
⚠️  Write conflicts possible if two agents write simultaneously
```

**File locking behavior**:
- Node.js `fs.writeFileSync` is atomic for small files (<4KB on most systems)
- Large files may have partial writes if interrupted
- No built-in locking mechanism in current implementation

### Scenario 3: Distributed Team (Remote Workers)

```
Configuration:
- Team lead: Alice's laptop (/Users/alice/project)
- Teammate: Bob's laptop (/Users/bob/project)
- Different machines → different memory directories by default

Memory behavior:
❌ No shared memory - completely isolated
✅ Can enable sharing via CLAUDE_CODE_REMOTE_MEMORY_DIR on network storage
```

**To enable sharing**:
```bash
# On both machines, point to network share
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/nfs-share/.claude

# Now both resolve to:
# /mnt/nfs-share/projects/{same-project-hash}/memory/
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

→ Reduces conflict probability
```

**Strategy 2: Read-before-write pattern**
```javascript
async function safeAppendMemory(newContent) {
    // Read current content
    let current = fs.readFileSync(memoryPath, 'utf-8');

    // Merge with new content (detect conflicts)
    let merged = mergeContent(current, newContent);

    // Write merged result
    fs.writeFileSync(memoryPath, merged);
}
```

**Strategy 3: Git-based synchronization (future enhancement)**
```
After each memory write:
1. git add memory/
2. git commit -m "Memory update: {summary}"
3. git pull --rebase
4. git push

→ Git handles conflict resolution
```

### Read Synchronization

**No synchronization needed** - reads are always from current file state

```javascript
// buildMemoryPrompt is called at start of each turn
function buildMemoryPrompt() {
    // Reads file from disk (always latest version)
    let content = fs.readFileSync(memoryPath, 'utf-8');
    return formatPrompt(content);
}
```

**Implication**: Agents always see the latest memory state at turn start, even if another agent modified it mid-session.

---

## 6. Team Context Integration

### Current Behavior

Memory directory resolution does **not** currently factor in team context:

```javascript
// Hypothetical agent-aware resolution (NOT implemented):
function getMemoryDirectoryForAgent(agentId, teamName) {
    if (teamName && agentId !== TEAM_LEAD_ID) {
        // Teammate-specific memory
        return `${baseDir}/teams/${teamName}/agents/${agentId}/memory/`;
    }
    // Team lead or solo agent - project-scoped memory
    return `${baseDir}/projects/${projectHash}/memory/`;
}
```

**Why not implemented**:
- Shared memory is the common case (collaborative work)
- Isolated memory can be achieved via different working directories
- Complexity of synchronizing shared + isolated memory

### Potential Future Enhancement

**Hybrid model**: Shared project memory + private agent memory

```
Project memory (shared):
  ~/.claude/projects/{hash}/memory/MEMORY.md
  ~/.claude/projects/{hash}/memory/architecture.md

Agent memory (private):
  ~/.claude/projects/{hash}/agents/{agentId}/private-notes.md

System prompt:
## Shared Memory
[MEMORY.md content]

## Private Notes (visible only to you)
[private-notes.md content]
```

**Use case**: Team lead has private strategy notes not visible to teammates.

---

## 7. Use Cases and Trade-offs

### Use Case 1: Shared Knowledge Base

**Setup**: All agents share same memory directory (default behavior)

**Pros**:
- ✅ Knowledge accumulates across all agents
- ✅ Patterns discovered by any agent benefit the team
- ✅ No synchronization overhead (file system handles it)

**Cons**:
- ❌ Write conflicts possible (last-write-wins)
- ❌ No privacy (all agents see all memory)
- ❌ Large teams may overwhelm single MEMORY.md

**Best for**:
- Small teams (2-3 agents)
- Collaborative debugging
- Shared project knowledge

**Example**:
```
Team lead discovers: "Database migrations use Prisma"
Teammate reads this, adds: "Migration rollback: `bun run prisma migrate rollback`"
Both agents now have complete migration knowledge
```

### Use Case 2: Isolated Agent Memory

**Setup**: Each agent has different working directory → different memory

**Pros**:
- ✅ No write conflicts (separate files)
- ✅ Privacy (agents don't see each other's notes)
- ✅ Specialized memory per agent role

**Cons**:
- ❌ No knowledge sharing (duplicated learnings)
- ❌ Manual setup required (symlinks or multiple clones)
- ❌ Sync overhead if sharing is needed

**Best for**:
- Large teams (5+ agents)
- Role-specific agents (frontend specialist, backend specialist)
- Competitive scenarios (e.g., multiple agents proposing different solutions)

**Example**:
```
Frontend agent (cwd: /app/frontend/)
  → Memory: ~/.claude/projects/{hash-frontend}/memory/
  → Contains: React patterns, CSS conventions

Backend agent (cwd: /app/backend/)
  → Memory: ~/.claude/projects/{hash-backend}/memory/
  → Contains: API patterns, database schemas

No overlap, no conflicts
```

### Use Case 3: Hybrid (Shared + Isolated)

**Setup**: Use remote memory for shared, local for private

```bash
# Shared memory on network storage
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/shared/.claude

# Each agent also has local ~/.claude/... for private notes
```

**Pros**:
- ✅ Share common knowledge
- ✅ Keep private notes isolated
- ✅ Flexible per-file control

**Cons**:
- ❌ Complex setup
- ❌ Must manually decide shared vs private
- ❌ Synchronization complexity

**Implementation** (requires code changes):
```javascript
// Load both shared and local memory
let sharedMemory = loadMemory(REMOTE_MEMORY_DIR);
let privateMemory = loadMemory(LOCAL_MEMORY_DIR);

// Inject both into system prompt
return `
## Shared Team Memory
${sharedMemory}

## Private Agent Notes
${privateMemory}
`;
```

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
#              ^^^^^^^^^^^^^^^^^^^^^ SAME DIRECTORY
```

### Network Storage Requirements

**Supported**:
- ✅ NFS (Network File System)
- ✅ SMB/CIFS (Windows shares)
- ✅ SSHFS (SSH filesystem)
- ✅ Distributed filesystems (GlusterFS, Ceph)

**Requirements**:
- Sub-10ms read latency (memory loaded at every turn)
- Atomic small file writes (<4KB)
- POSIX-compliant file locking (for future enhancements)

**Not recommended**:
- ❌ Object storage (S3, GCS) without FUSE mount
- ❌ High-latency network (>100ms) - slows down turn start
- ❌ Unreliable connections (frequent disconnects)

### Synchronization Behavior

```
Agent 1 writes to: /mnt/shared/projects/{hash}/memory/MEMORY.md
  → NFS flushes to server
  → Server updates file timestamp

Agent 2 starts new turn:
  → buildMemoryPrompt() reads from /mnt/shared/projects/{hash}/memory/MEMORY.md
  → NFS fetches latest from server
  → Agent 2 sees Agent 1's changes

Latency: ~10-50ms depending on network
```

**Cache coherency**: NFS/SSHFS handle cache invalidation automatically. Agents always read latest content.

### Example: Distributed Team Setup

```bash
# Shared NFS mount at /mnt/team-memory

# Team lead (Alice's laptop):
cd /Users/alice/my-app
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/team-memory
claude

# Teammate 1 (Bob's laptop):
cd /Users/bob/my-app  # Same project, different clone
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/team-memory
claude --agent-id teammate-1 --agent-name bob

# Teammate 2 (Charlie's server):
cd /home/charlie/my-app
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/team-memory
claude --agent-id teammate-2 --agent-name charlie

# All three agents share:
# /mnt/team-memory/projects/{same-project-hash}/memory/
```

**Verification**:
```bash
# On any machine:
ls -la /mnt/team-memory/projects/*/memory/
# Should show same directory and files visible to all agents
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
- [remote_memory_sync.md](./remote_memory_sync.md) - Detailed remote memory setup (Phase 3)
- [30_agent_teams/agent_teams_architecture.md](../30_agent_teams/agent_teams_architecture.md) - Agent team context
