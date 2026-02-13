# Auto Memory Architecture

## Module Overview

Auto Memory provides Claude Code with persistent, cross-session knowledge storage through a hierarchical memory system centered around `MEMORY.md` files and optional topic files.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Auto memory symbols

Key functions:
- `getAutoMemory` (F0A) - Main entry point
- `buildMemoryPrompt` (m0A) - Constructs system prompt section
- `isAutoMemoryEnabled` (y2) - Feature toggle check
- `getAutoMemoryDirectory` (mu1) - Resolves memory directory path

---

## 1. System Architecture Overview

### 1.1 Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                AUTO MEMORY ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │ MEMORY.md    │────────>│ System Prompt│                │
│  │ (200 lines)  │ Inject  │ (Dynamic Var)│                │
│  └──────┬───────┘         └──────────────┘                │
│         │                                                   │
│         │ Links to                                          │
│         ▼                                                   │
│  ┌──────────────┐         ┌──────────────┐                │
│  │ Topic Files  │◄────────│ Read Tool    │                │
│  │ (debugging.  │ On-     │ (Agent reads │                │
│  │  patterns.md)│ demand  │  when needed)│                │
│  └──────────────┘         └──────────────┘                │
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │ Write/Edit   │────────>│ Memory Files │                │
│  │ Tools        │ Update  │ (Whitelist)  │                │
│  └──────────────┘         └──────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Design Principles**:
1. **MEMORY.md as Index**: Keep concise (≤200 lines), link to details
2. **Topic Files for Depth**: Detailed content in separate markdown files
3. **Dynamic Loading**: Read from disk every turn (always fresh)
4. **Scope Isolation**: User/Project/Local scopes for different use cases
5. **Minimal Overhead**: Only MEMORY.md injected, topics loaded on-demand

---

### 1.2 File Hierarchy

```
Memory System File Structure:

~/.claude/agent-memory/                     # User scope
  └── {agent-type}/                         # e.g., "claude-code-main"
      ├── MEMORY.md                         # Main index (auto-loaded)
      ├── debugging.md                      # Topic file (manual load)
      ├── patterns.md
      └── ...

.claude/agent-memory/                       # Project scope
  └── {agent-type}/
      ├── MEMORY.md
      └── topic files...

.claude/agent-memory-local/                 # Local scope
  └── {agent-type}/
      ├── MEMORY.md
      └── topic files...
```

---

## 2. Memory Lifecycle

### 2.1 Turn-by-Turn Flow

```
┌────────────────────────────────────────────────────────┐
│          MEMORY LIFECYCLE (PER TURN)                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  1. User sends message                                 │
│     │                                                  │
│     ▼                                                  │
│  2. System prompt builder starts                       │
│     │                                                  │
│     ▼                                                  │
│  3. Call getAutoMemory() (F0A)                        │
│     │                                                  │
│     ├──> Check: isAutoMemoryEnabled()?                │
│     │    - NO → Return null (skip memory)            │
│     │    - YES → Continue                             │
│     │                                                  │
│     ▼                                                  │
│  4. Call buildMemoryPrompt() (m0A)                    │
│     │                                                  │
│     ├──> Create memory directory if missing           │
│     ├──> Read MEMORY.md from disk                    │
│     ├──> Split into lines                             │
│     ├──> Check if > 200 lines                         │
│     │    - YES → Truncate + warning                   │
│     │    - NO → Use full content                      │
│     ├──> Format as markdown section                   │
│     │                                                  │
│     ▼                                                  │
│  5. Inject into system prompt                         │
│     │                                                  │
│     ▼                                                  │
│  6. Send to LLM API                                   │
│     │                                                  │
│     ▼                                                  │
│  7. Agent processes request                           │
│     │                                                  │
│     ├──> (Optional) Agent updates MEMORY.md          │
│     │    via Write/Edit tools                         │
│     │                                                  │
│     ▼                                                  │
│  8. Response complete                                 │
│     │                                                  │
│     └──> Next turn: Repeat from step 1               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

### 2.2 Entry Point Implementation

// ============================================
// getAutoMemory - Main entry point for auto memory system
// Location: chunks.87.mjs:2299-2307
// ============================================

// ORIGINAL (for source lookup):
function F0A() {
    if (y2()) return m0A({
        displayName: "auto memory",
        memoryDir: mu1()
    });
    return c("tengu_memdir_disabled", {
        disabled_by_env_var: J6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
        disabled_by_setting: !J6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) && l4().autoMemoryEnabled === !1
    }), null
}

// READABLE (for understanding):
function getAutoMemory() {
    if (isAutoMemoryEnabled()) {
        return buildMemoryPrompt({
            displayName: "auto memory",
            memoryDir: getAutoMemoryDirectory()
        });
    }

    // Telemetry tracking for disabled memory
    recordTelemetry("tengu_memdir_disabled", {
        disabled_by_env_var: isEnvVarSet(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
        disabled_by_setting: !isEnvVarSet(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) &&
                             getUserSettings().autoMemoryEnabled === false
    });

    return null;  // Memory disabled, return nothing
}

// Mapping:
// F0A → getAutoMemory
// y2 → isAutoMemoryEnabled
// m0A → buildMemoryPrompt
// mu1 → getAutoMemoryDirectory
// c → recordTelemetry
// J6 → isEnvVarSet
// l4 → getUserSettings

**What it does**: Determines if memory is enabled, builds the memory section if yes, returns null if disabled.

**How it works**:
1. Check if auto memory feature is enabled via `isAutoMemoryEnabled()`
2. If enabled:
   - Call `buildMemoryPrompt()` with display name and directory path
   - Return formatted memory section for system prompt
3. If disabled:
   - Log telemetry with reason (env var vs user setting)
   - Return null (memory skipped)

**Why this approach**:
- **Single source of truth**: All memory logic funnels through one function
- **Telemetry awareness**: Track why memory is disabled for debugging
- **Graceful degradation**: Returns null cleanly when disabled

---

## 3. Enable/Disable Logic

### 3.1 Priority Chain

// ============================================
// isAutoMemoryEnabled - Determine if auto memory is active
// Location: chunks.87.mjs:2194-2202
// ============================================

// ORIGINAL (for source lookup):
function y2() {
    let A = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
    if (J6(A)) return !1;
    if (FY(A)) return !0;
    if (J6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return !1;
    let q = l4();
    if (q.autoMemoryEnabled !== void 0) return q.autoMemoryEnabled;
    return x8("tengu_oboe", !1)
}

// READABLE (for understanding):
function isAutoMemoryEnabled() {
    let disableEnvVar = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;

    // Priority 1: Explicit disable via env var
    if (isEmpty(disableEnvVar)) return false;

    // Priority 2: Explicit enable via env var (override)
    if (isTruthy(disableEnvVar)) return true;

    // Priority 3: Remote mode requires memory dir
    if (isEmpty(process.env.CLAUDE_CODE_REMOTE) &&
        !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return false;  // Remote without memory dir = disable
    }

    // Priority 4: User setting in config
    let settings = getUserSettings();
    if (settings.autoMemoryEnabled !== undefined) {
        return settings.autoMemoryEnabled;
    }

    // Priority 5: Feature flag default
    return getFeatureFlag("tengu_oboe", false);
}

// Mapping:
// y2 → isAutoMemoryEnabled
// A → disableEnvVar
// J6 → isEmpty
// FY → isTruthy
// l4 → getUserSettings
// x8 → getFeatureFlag

**Decision order** (highest priority first):
```
1. CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 → Disable
2. CLAUDE_CODE_DISABLE_AUTO_MEMORY=0 → Enable (override)
3. Remote mode + no CLAUDE_CODE_REMOTE_MEMORY_DIR → Disable
4. User setting: autoMemoryEnabled=true/false → Use setting
5. Feature flag: "tengu_oboe" → Default (false)
```

**Use cases**:
- **Environment override**: Testing, CI/CD, enterprise control
- **Remote mode handling**: Requires explicit memory directory for remote agents
- **User preference**: Per-user toggle in settings UI
- **Feature flag**: Gradual rollout control

---

## 4. Directory Resolution

### 4.1 Auto Memory Directory Path

// ============================================
// getAutoMemoryDirectory - Resolve auto memory directory
// Location: chunks.87.mjs:2213-2215
// ============================================

// ORIGINAL (for source lookup):
function mu1() {
    let A = cO6(ga(), "projects");
    return (cO6(A, dx(LU7()), kU7) + UN9).normalize("NFC")
}

// READABLE (for understanding):
function getAutoMemoryDirectory() {
    let homeDir = joinPath(getHomeDirectory(), "projects");
    return (joinPath(homeDir,
                     sanitizeProjectName(getProjectIdentifier()),
                     "memory") + pathSeparator).normalize("NFC");
}

// Mapping:
// mu1 → getAutoMemoryDirectory
// cO6 → joinPath
// ga → getHomeDirectory
// dx → sanitizeProjectName
// LU7 → getProjectIdentifier
// kU7 → "memory"
// UN9 → pathSeparator

**Path construction**:
```
{home}/projects/{projectId}/memory/
```

**Components**:
- `{home}`: From `getHomeDirectory()` - `~/.claude/` or `CLAUDE_CODE_REMOTE_MEMORY_DIR`
- `{projectId}`: Sanitized project identifier (CWD or git repo name)
- `memory`: Fixed subdirectory name

**Example paths**:
```
~/.claude/projects/myproject/memory/
/remote/claude/projects/myproject/memory/
```

---

### 4.2 Home Directory Resolution

// ============================================
// getHomeDirectory - Get home or remote memory base
// Location: chunks.87.mjs:2204-2207
// ============================================

// ORIGINAL (for source lookup):
function ga() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    return O8()
}

// READABLE (for understanding):
function getHomeDirectory() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    }
    return getLocalHomeDirectory();  // ~/.claude/
}

// Mapping: ga → getHomeDirectory, O8 → getLocalHomeDirectory

**Two modes**:
1. **Local**: `~/.claude/` (default)
2. **Remote**: Custom path via `CLAUDE_CODE_REMOTE_MEMORY_DIR` environment variable

**Remote use case**: SSH sessions, cloud agents, shared storage

---

## 5. Integration Points

### 5.1 System Prompt Registration

**Location**: chunks.169.mjs:231, 246

Memory is registered as a **dynamic variable** in system prompt:

```javascript
wc("auto_memory",
   () => F0A(),
   "MEMORY.md is read from disk each turn and can be edited by the model")
```

**Dynamic variable behavior**:
- **Re-evaluated every turn**: Calls `F0A()` before each API request
- **Fresh from disk**: Always gets latest file contents
- **Editable by agent**: Can be modified via Write/Edit tools

---

### 5.2 Write Tool Whitelisting

**Location**: chunks.174.mjs:933-940

Memory files are automatically whitelisted for write operations:

```javascript
if (isMemoryFile(filePath)) {
    return {
        behavior: "allow",
        updatedInput: input,
        decisionReason: {
            type: "other",
            reason: "Agent memory files are allowed for writing"
        }
    };
}
```

**Effect**: Agent can freely update MEMORY.md and topic files without permission prompts.

---

## 6. Design Trade-offs

### 6.1 200-Line Limit

**Decision**: Hard limit MEMORY.md to 200 lines in system prompt

**Rationale**:
- **Context window preservation**: Prevents memory from consuming entire prompt budget
- **Forces organization**: Encourages hierarchical topic file structure
- **Faster loading**: Smaller file = faster disk I/O
- **Better signal-to-noise**: Index-style content is more useful than verbose notes

**Alternative considered**: Dynamic limit based on available context
- **Rejected**: Adds complexity, unpredictable behavior, harder to debug

---

### 6.2 Topic Files On-Demand

**Decision**: Only load topic files when agent explicitly reads them

**Rationale**:
- **Scalability**: Can have hundreds of topic files without bloating prompt
- **Selective retrieval**: Agent chooses what's relevant
- **Search optimization**: Use Grep tool for efficient topic discovery

**Alternative considered**: Auto-load all topic files
- **Rejected**: Would quickly exceed context limits, no selectivity

---

### 6.3 Disk Read Every Turn

**Decision**: Read MEMORY.md from disk on every turn (no caching)

**Rationale**:
- **Always fresh**: Captures latest changes immediately
- **Multi-agent safe**: Different agents can update same memory
- **Simple**: No cache invalidation complexity

**Trade-off**: Disk I/O overhead (~1-5ms per turn)

---

## 7. Multi-Agent Considerations

When multiple agents collaborate (via Agent Teams), memory sharing and isolation become critical. For complete details, see [multi_agent_memory.md](./multi_agent_memory.md).

### 7.1 Memory Isolation Model

**Default behavior**: All agents in the same project directory share the same memory.

```
Team lead (cwd: /Users/alice/my-app/)
  → Memory: ~/.claude/projects/{hash}/memory/

Teammate 1 (cwd: /Users/alice/my-app/)
  → Memory: ~/.claude/projects/{hash}/memory/  ← SAME

Teammate 2 (cwd: /Users/alice/my-app/)
  → Memory: ~/.claude/projects/{hash}/memory/  ← SAME
```

**Why**: Memory directory is computed from `process.cwd()`, not agent ID. All agents with same working directory resolve to same hash.

### 7.2 Shared Memory Benefits and Risks

**Benefits**:
- ✅ Knowledge accumulates across all agents (debugging notes, patterns)
- ✅ Patterns discovered by any agent benefit the team
- ✅ No synchronization overhead (file system handles it)

**Risks**:
- ❌ Write conflicts possible (last-write-wins)
- ❌ No privacy (all agents see all memory)
- ❌ Large teams may overwhelm single MEMORY.md

### 7.3 Write Conflict Mitigation

**Strategy 1: Topic file separation** (Recommended)
```
Agent 1 writes to: debugging.md
Agent 2 writes to: architecture.md
→ No conflict (different files)
```

**Strategy 2: MEMORY.md as index only**
```
MEMORY.md updated infrequently (just links)
Topic files updated frequently (actual content)
→ Reduced conflict probability
```

**Strategy 3: Isolated memory per agent** (Manual setup)
```
Agent 1: cwd = /app/agent1/ → memory hash1/
Agent 2: cwd = /app/agent2/ → memory hash2/
→ Complete isolation, no sharing
```

See [multi_agent_memory.md](./multi_agent_memory.md) for detailed isolation strategies and use cases.

---

## 8. Remote Memory Architecture

Remote memory enables sharing memory across machines via network storage. For complete details, see [remote_memory_sync.md](./remote_memory_sync.md).

### 8.1 Remote Override Mechanism

**Environment variable**: `CLAUDE_CODE_REMOTE_MEMORY_DIR`

```javascript
function getHomeDirectory() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;  // Override
    }
    return os.homedir();  // Default ~/.
}
```

**Effect**: All memory operations use remote path as base instead of `~/.claude/`

### 8.2 Directory Resolution with Remote

```bash
# Without remote override
CLAUDE_CODE_REMOTE_MEMORY_DIR=  # unset
→ Memory: /Users/alice/.claude/projects/{hash}/memory/

# With remote override
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/nfs-share
→ Memory: /mnt/nfs-share/projects/{hash}/memory/
```

**Key insight**: Project hash still computed from **local** cwd, so all agents working on same project (even on different machines) resolve to same remote memory directory.

### 8.3 Supported Storage Types

| Storage | Latency | Use Case |
|---------|---------|----------|
| **NFS** | <10ms | Production teams, always-on servers |
| **SMB/CIFS** | <20ms | Windows shares, cross-platform teams |
| **SSHFS** | 10-50ms | Remote development, SSH workflows |
| **Dropbox/Drive** | 1-60s | Personal multi-machine (sync lag OK) |

### 8.4 Synchronization Behavior

**Read**: Always from disk, no caching (agents see latest changes next turn)

**Write**: Direct `fs.writeFileSync` (no locking)

**Conflicts**: Last-write-wins (earlier writes lost)

**Network failure**: Unhandled (agent crashes if remote unavailable)

### 8.5 Distributed Team Example

```
Team Lead (Laptop, NFS server)
  └─> Exports: /Users/alice/.claude/

Teammate 1 (AWS VM)
  └─> Mounts: /mnt/shared-memory
  └─> export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/shared-memory

Teammate 2 (AWS VM)
  └─> Mounts: /mnt/shared-memory
  └─> export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/shared-memory

→ All three agents share same memory on NFS
```

See [remote_memory_sync.md](./remote_memory_sync.md) for setup guides, performance considerations, and error handling.

---

## Summary

The Auto Memory architecture provides **persistent cross-session knowledge** through:

1. **MEMORY.md as Index**: 200-line limit forces concise, hierarchical organization
2. **Topic Files for Details**: On-demand loading via Read tool
3. **Dynamic Loading**: Fresh from disk every turn
4. **Scope Flexibility**: User/Project/Local isolation
5. **Whitelisted Writes**: Agent can freely update memory files
6. **Telemetry Aware**: Tracks enable/disable reasons

**Key architectural insight**: The system balances **persistent knowledge** with **context window efficiency** by using MEMORY.md as a lightweight index and delegating detailed content to searchable topic files.
