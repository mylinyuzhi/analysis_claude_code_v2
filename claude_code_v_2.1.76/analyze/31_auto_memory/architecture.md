# Auto Memory Architecture

## Module Overview

Auto Memory provides Claude Code with persistent, cross-session knowledge storage through a hierarchical memory system centered around `MEMORY.md` files and optional topic files.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Auto memory symbols

Key functions:
- `getAutoMemory` (`ID1`) - Main async entry point (chunks.84.mjs:382)
- `buildMemoryPrompt` (`Q14`) - Constructs system prompt section (chunks.84.mjs:290)
- `buildMemoryIndex` (`U14`) - File-based memory prompt (chunks.84.mjs:324)
- `buildAutoMemoryPromptSimple` (`uv9`) - Simple prompt builder (chunks.84.mjs:367)
- `buildBackgroundAgentMemoryPrompt` (`xv9`) - Background agent prompt (chunks.84.mjs:329)
- `buildSearchContextSection` (`Dt`) - Search guidance builder (chunks.84.mjs:373)
- `ensureMemoryDirExists` (`CD1`) - Async directory creation (chunks.84.mjs:261)
- `recordMemoryDirLoadMetrics` (`DF6`) - Telemetry recording (chunks.84.mjs:273)
- `isAutoMemoryEnabled` (`Z3`) - Feature toggle check (chunks.50.mjs:2401)
- `getAutoMemoryDirectory` (`uH`) - Resolves memory directory path (chunks.50.mjs:2468, lazy)
- `getHomeDirectory` (`Ma`) - Home or remote memory base (chunks.50.mjs:2411)
- `isAutoMemoryPath` (`Da`) - Path validation (chunks.50.mjs:2451)
- `validateMemoryPath` (`QJ7`) - Path validation with security checks (chunks.50.mjs:2416)
- `getCustomMemoryDirectory` (`gG3`) - Custom directory from settings (chunks.50.mjs:2434)
- `getCoworkMemoryPathOverride` (`UJ7`) - Cowork memory path override (chunks.50.mjs:2430)
- `getCurrentContextPath` (`FG3`) - Current context path (chunks.50.mjs:2443)
- `buildStalenessWarning` (`Cz8`) - Staleness warning message (chunks.50.mjs:2487)
- `formatStalenessReminder` (`lJ7`) - System-reminder wrapper (chunks.50.mjs:2493)

Key constants:
- `MEMORY_MD_FILENAME` (`o2` / `BG3`) - "MEMORY.md" (chunks.84.mjs:415 / chunks.50.mjs:2457)
- `MEMORY_MAX_LINES` (`uj`) - 200 (chunks.84.mjs:417)
- `AUTO_MEMORY_DISPLAY_NAME` (`p14`) - "auto memory" (chunks.84.mjs:419)
- `MEMORY_DIR_EXISTS_HINT` (`Uf8`) - Directory exists hint (chunks.84.mjs:423)
- `DUAL_MEMORY_DIR_EXISTS_HINT` (`pf8`) - Dual memory hint (chunks.84.mjs:425)
- `MEMORY_SUBDIR_NAME` (`mG3`) - "memory" (chunks.50.mjs:2455)

## Related Documentation (Phase 4 - Detailed Implementation)

> For in-depth technical analysis of specific subsystems:
> - [15_write_edit_integration.md](./15_write_edit_integration.md) - Permission flow, concurrent access
> - [16_error_handling_recovery.md](./16_error_handling_recovery.md) - Dual limits, error paths
> - [17_tui_integration.md](./17_tui_integration.md) - TUI modal, settings toggle
> - [18_system_reminder_generation.md](./18_system_reminder_generation.md) - Prompt injection mechanism
> - [19_telemetry_monitoring.md](./19_telemetry_monitoring.md) - Analytics events
> - [20_feature_flag_rollout.md](./20_feature_flag_rollout.md) - 5-level priority chain
> - [21_implementation_vs_official_docs.md](./21_implementation_vs_official_docs.md) - Discrepancies catalog

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

**Custom Directory Support** (v2.1.59):
When `autoMemoryDirectory` is set in user settings, it overrides the default project-hash path:

```
Custom path set: ~/team-memory/
  → Memory: ~/team-memory/MEMORY.md
  (instead of ~/.claude/projects/{hash}/memory/MEMORY.md)
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
│  3. Call getAutoMemory() (ID1)                        │
│     │                                                  │
│     ├──> Check: isAutoMemoryEnabled()? (Z3)          │
│     │    - NO → Return null (skip memory)            │
│     │    - YES → Continue                             │
│     │                                                  │
│     ▼                                                  │
│  4. Call buildMemoryPrompt() (Q14)                    │
│     │                                                  │
│     ├──> Create memory directory if missing (CD1)     │
│     ├──> Read MEMORY.md (o2) from disk               │
│     ├──> Check last-modified timestamp (v2.1.74)     │
│     ├──> Split into lines                             │
│     ├──> Check if > 200 lines (uj)                    │
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
// getAutoMemory - Main async entry point for auto memory system
// Location: chunks.84.mjs:382-411
// ============================================

// ORIGINAL (for source lookup):
async function ID1() {
    let A = Z3(),
        q = w8("tengu_swinburne_dune", !1);
    if (F14.isTeamMemoryEnabled()) {
        let K = uH(),
            Y = F14.getTeamMemPath();
        if (await CD1(Y), DF6(K, { memory_type: "auto" }), DF6(Y, { memory_type: "team" }),
            w8("tengu_passport_quail", !1)) return Qf8.buildExtractModeTypedCombinedPrompt();
        if (q) return Qf8.buildTypedCombinedMemoryPrompt();
        return Qf8.buildCombinedMemoryPrompt()
    }
    if (A) {
        let K = uH();
        if (await CD1(K), DF6(K, { memory_type: "auto" }), w8("tengu_passport_quail", !1))
            return xv9("auto memory", K).join("\n");
        if (q) return U14("auto memory", K).join("\n");
        return uv9()
    }
    if (d("tengu_memdir_disabled", {
        disabled_by_env_var: t6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
        disabled_by_setting: !t6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) && mA().autoMemoryEnabled === !1
    }), w8("tengu_herring_clock", !1)) d("tengu_team_memdir_disabled", {});
    return null
}

// READABLE (for understanding):
async function getAutoMemory() {
    // Check if auto memory is enabled
    const isEnabled = isAutoMemoryEnabled();
    const useFileBasedFormat = getFeatureFlag("tengu_swinburne_dune", false);

    // Branch 1: Team memory enabled (dual memory system)
    if (isTeamMemoryEnabled()) {
        const userMemoryDir = getAutoMemoryDirectory();
        const teamMemoryDir = getTeamMemoryPath();

        // Ensure both directories exist
        await ensureMemoryDirExists(teamMemoryDir);

        // Record telemetry for both directories
        recordMemoryDirLoadMetrics(userMemoryDir, { memory_type: "auto" });
        recordMemoryDirLoadMetrics(teamMemoryDir, { memory_type: "team" });

        // Return appropriate prompt format based on flags
        if (getFeatureFlag("tengu_passport_quail", false)) {
            return buildExtractModeTypedCombinedPrompt(); // Background agent mode
        }
        if (useFileBasedFormat) {
            return buildTypedCombinedMemoryPrompt(); // File-based format
        }
        return buildCombinedMemoryPrompt(); // Default dual prompt
    }

    // Branch 2: Single memory (auto memory only)
    if (isEnabled) {
        const memoryDir = getAutoMemoryDirectory();
        await ensureMemoryDirExists(memoryDir);
        recordMemoryDirLoadMetrics(memoryDir, { memory_type: "auto" });

        // Return appropriate format
        if (getFeatureFlag("tengu_passport_quail", false)) {
            return buildBackgroundAgentMemoryPrompt("auto memory", memoryDir);
        }
        if (useFileBasedFormat) {
            return buildMemoryIndex("auto memory", memoryDir);
        }
        return buildAutoMemoryPromptSimple(); // Default simple prompt
    }

    // Branch 3: Memory disabled - log telemetry and return null
    recordTelemetry("tengu_memdir_disabled", {
        disabled_by_env_var: isTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
        disabled_by_setting: !isTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) &&
                             getUserSettings().autoMemoryEnabled === false
    });

    // Also log team memory disabled if flag is set
    if (getFeatureFlag("tengu_herring_clock", false)) {
        recordTelemetry("tengu_team_memdir_disabled", {});
    }

    return null;
}

// Mapping:
// ID1 → getAutoMemory
// Z3 → isAutoMemoryEnabled
// uH → getAutoMemoryDirectory
// CD1 → ensureMemoryDirExists
// DF6 → recordMemoryDirLoadMetrics
// w8 → getFeatureFlag
// mA → getUserSettings
// t6 → isTruthy
// uv9 → buildAutoMemoryPromptSimple
// U14 → buildMemoryIndex
// xv9 → buildBackgroundAgentMemoryPrompt

**What it does**: Main async entry point that determines memory configuration, ensures directories exist, and returns the appropriate memory prompt.

**How it works**:
1. Check if auto memory is enabled via `Z3()` (isAutoMemoryEnabled)
2. Check feature flags for format selection (`tengu_swinburne_dune`, `tengu_passport_quail`)
3. If team memory enabled:
   - Handle dual memory system (user + team)
   - Return combined prompt
4. If single memory enabled:
   - Create directory if needed
   - Return appropriate prompt format
5. If disabled:
   - Log telemetry with reason
   - Return null

**Why this approach**:
- **Async first**: Directory creation requires async operations
- **Feature flag driven**: Different prompt formats for different use cases
- **Team memory support**: Handles both single and dual memory modes
- **Graceful degradation**: Returns null cleanly when disabled

---

## 3. Enable/Disable Logic

### 3.1 Priority Chain

// ============================================
// isAutoMemoryEnabled - Determine if auto memory is active
// Location: chunks.50.mjs:2401-2408
// ============================================

// ORIGINAL (for source lookup):
function Z3() {
    let A = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
    if (t6(A)) return !1;
    if (xz(A)) return !0;
    if (t6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return !1;
    let q = mA();
    if (q.autoMemoryEnabled !== void 0) return q.autoMemoryEnabled;
    return !0
}

// READABLE (for understanding):
function isAutoMemoryEnabled() {
    let disableEnvVar = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;

    // Priority 1: Explicit disable via env var (truthy value like "1", "true")
    if (isTruthy(disableEnvVar)) return false;

    // Priority 2: Explicit enable via env var (falsy non-empty like "0", "false")
    if (isFalsy(disableEnvVar)) return true;

    // Priority 3: Remote mode requires memory dir
    if (isTruthy(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return false;  // Remote without memory dir = disable
    }

    // Priority 4: User setting in config
    let settings = getUserSettings();
    if (settings.autoMemoryEnabled !== undefined) {
        return settings.autoMemoryEnabled;
    }

    // Priority 5: Default to enabled
    return true;
}

// Mapping:
// Z3 → isAutoMemoryEnabled
// t6 → isTruthy
// xz → isFalsy
// mA → getUserSettings

**Decision order** (highest priority first):
```
1. CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 → Disable (truthy)
2. CLAUDE_CODE_DISABLE_AUTO_MEMORY=0 → Enable (falsy non-empty)
3. Remote mode + no CLAUDE_CODE_REMOTE_MEMORY_DIR → Disable
4. User setting: autoMemoryEnabled=true/false → Use setting
5. Default → Enabled (true)
```

**Use cases**:
- **Environment override**: Testing, CI/CD, enterprise control
- **Remote mode handling**: Requires explicit memory directory for remote agents
- **User preference**: Per-user toggle in settings UI

---

## 4. Directory Resolution

### 4.1 Auto Memory Directory Path

// ============================================
// getAutoMemoryDirectory - Resolve auto memory directory (lazy-evaluated)
// Location: chunks.50.mjs:2468-2473
// ============================================

// The actual implementation uses lazy evaluation via e1() memoization helper
// uH = e1(() => {...}, () => getCurrentContextPath())

// READABLE (for understanding):
function getAutoMemoryDirectory() {
    // Priority 1: Cowork memory path override (team shared storage)
    const coworkOverride = getCoworkMemoryPathOverride();
    if (coworkOverride) return coworkOverride;

    // Priority 2: Custom directory from settings (v2.1.59)
    const customDir = getCustomMemoryDirectory();
    if (customDir) return customDir;

    // Priority 3: Default project-hash based path
    const homeDir = getHomeDirectory();
    const projectsDir = joinPath(homeDir, "projects");
    return (joinPath(projectsDir,
                     hashPath(getCurrentContextPath()),
                     "memory") + pathSeparator).normalize("NFC");
}

// Actual source (lazy evaluation wrapper):
// uH = e1(() => {
//     let A = UJ7() ?? gG3();
//     if (A) return A;
//     let q = wz1(Ma(), "projects");
//     return (wz1(q, BD(FG3()), mG3) + pJ7).normalize("NFC")
// }, () => qY())

// Mapping:
// uH → getAutoMemoryDirectory
// UJ7 → getCoworkMemoryPathOverride
// gG3 → getCustomMemoryDirectory
// Ma → getHomeDirectory
// wz1 → joinPath
// BD → hashPath
// FG3 → getCurrentContextPath
// mG3 → "memory"
// pJ7 → pathSeparator
// e1 → memoize (lazy evaluation helper)

**Path construction**:
```
Priority 1: CLAUDE_COWORK_MEMORY_PATH_OVERRIDE env var
Priority 2: autoMemoryDirectory setting
Priority 3: {home}/projects/{projectId}/memory/
```

**Components**:
- `{home}`: From `Ma()` (getHomeDirectory) - `~/.claude/` or `CLAUDE_CODE_REMOTE_MEMORY_DIR`
- `{projectId}`: Hash of current context path (CWD)
- `memory`: Fixed subdirectory name

**Example paths**:
```
~/.claude/projects/abc123/memory/
/remote/claude/projects/abc123/memory/
~/team-memory/  (with autoMemoryDirectory setting)
```

---

### 4.2 Home Directory Resolution

// ============================================
// getHomeDirectory - Get home or remote memory base
// Location: chunks.50.mjs:2411-2414
// ============================================

// ORIGINAL (for source lookup):
function Ma() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    return c8()
}

// READABLE (for understanding):
function getHomeDirectory() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    }
    return getLocalHomeDirectory();  // ~/.claude/
}

// Mapping: Ma → getHomeDirectory, c8 → getLocalHomeDirectory

**Two modes**:
1. **Local**: `~/.claude/` (default)
2. **Remote**: Custom path via `CLAUDE_CODE_REMOTE_MEMORY_DIR` environment variable

**Remote use case**: SSH sessions, cloud agents, shared storage

---

## 5. Integration Points

### 5.1 System Prompt Component Registration

**CORRECTION (2026-03-29)**: Memory is NOT registered as a "dynamic variable". It is registered as a static system prompt component with key `"memory"` (not `"auto_memory"`).

**Actual Location**: `chunks.168.mjs:2153` (inside `buildSystemPrompt` function `R0`)

```javascript
// Actual source: chunks.168.mjs:2153
j = [AF("memory", () => ID1()),    // key = "memory", cacheBreak = false
     AF("ant_model_override", ...), ...]
J = await B8q(j)   // evaluates and caches all components
```

**Component behavior** (`AF` = `createStaticSystemPromptComponent`):
- `cacheBreak: false` — value is CACHED in `v1.systemPromptSectionCache`
- First turn: `ID1()` called, result cached under `"memory"`
- Subsequent turns: cache HIT returned without calling `ID1()` again
- Cache invalidated by `RT6()` on worktree/session reset

**Editable by agent**: Agent can modify MEMORY.md via Write/Edit tools; changes appear in the system prompt on next session start (or after `RT6()` cache clear).

---

### 5.2 Write Tool Whitelisting

**Location**: chunks.174.mjs (permission validation)

Memory files are automatically whitelisted for write operations via `Da()` (isAutoMemoryPath):

```javascript
// ============================================
// isAutoMemoryPath - Check if path is within auto memory directory
// Location: chunks.50.mjs:2451-2452
// ============================================

// ORIGINAL (for source lookup):
function Da(A) {
    return Sz8(A).startsWith(uH())
}

// READABLE (for understanding):
function isAutoMemoryPath(filePath) {
    return normalizePath(filePath).startsWith(getAutoMemoryDirectory());
}

// Mapping: Da → isAutoMemoryPath, Sz8 → normalizePath, uH → getAutoMemoryDirectory
```

**Effect**: Agent can freely update MEMORY.md and topic files without permission prompts.

> **For detailed analysis**, see [15_write_edit_integration.md](./15_write_edit_integration.md) - Complete permission flow, concurrent access analysis, and verification tests.

---

## 6. Freshness Tracking (v2.1.76)

### 6.1 Staleness Detection System

The memory system includes staleness detection to warn agents when memory may be outdated:

// ============================================
// Staleness Detection Functions
// Location: chunks.50.mjs:2476-2498
// ============================================

// ORIGINAL (for source lookup):
function dJ7(A) {
    return Math.max(0, Math.floor((Date.now() - A) / 86400000))
}
function cJ7(A) {
    let q = dJ7(A);
    if (q === 0) return "today";
    if (q === 1) return "yesterday";
    return `${q} days ago`
}
function Cz8(A) {
    let q = dJ7(A);
    if (q <= 1) return "";
    return `This memory is ${q} days old. ` + "Memories are point-in-time observations..."
}
function lJ7(A) {
    let q = Cz8(A);
    if (!q) return "";
    return `<system-reminder>${q}</system-reminder>\n`
}

// READABLE (for understanding):
function getDaysSinceTimestamp(timestamp) {
    return Math.max(0, Math.floor((Date.now() - timestamp) / 86400000));
}

function formatRelativeTime(timestamp) {
    const days = getDaysSinceTimestamp(timestamp);
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    return `${days} days ago`;
}

function buildStalenessWarning(timestamp) {
    const days = getDaysSinceTimestamp(timestamp);
    if (days <= 1) return "";  // Fresh - no warning

    return `This memory is ${days} days old. ` +
           "Memories are point-in-time observations, not live state — " +
           "claims about code behavior or file:line citations may be outdated. " +
           "Verify against current code before asserting as fact.";
}

function formatStalenessReminder(timestamp) {
    const warning = buildStalenessWarning(timestamp);
    if (!warning) return "";
    return `<system-reminder>${warning}</system-reminder>\n`;
}

// Mapping:
// dJ7 → getDaysSinceTimestamp
// cJ7 → formatRelativeTime
// Cz8 → buildStalenessWarning
// lJ7 → formatStalenessReminder

**Purpose**:
- **Freshness awareness**: Agents know when memory was last updated
- **Verification prompt**: Encourages checking outdated claims
- **System reminder format**: Staleness warnings injected as system reminders

**Warning threshold**: Only warns if memory is > 1 day old

---

## 7. Design Trade-offs

### 7.1 200-Line Limit

**Decision**: Hard limit MEMORY.md to 200 lines in system prompt

**Rationale**:
- **Context window preservation**: Prevents memory from consuming entire prompt budget
- **Forces organization**: Encourages hierarchical topic file structure
- **Faster loading**: Smaller file = faster disk I/O
- **Better signal-to-noise**: Index-style content is more useful than verbose notes

**Alternative considered**: Dynamic limit based on available context
- **Rejected**: Adds complexity, unpredictable behavior, harder to debug

> **For detailed analysis**, see [16_error_handling_recovery.md](./16_error_handling_recovery.md) - Dual file size limits (200 lines + 40000 chars), truncation logic, and error scenarios.

---

### 7.2 Topic Files On-Demand

**Decision**: Only load topic files when agent explicitly reads them

**Rationale**:
- **Scalability**: Can have hundreds of topic files without bloating prompt
- **Selective retrieval**: Agent chooses what's relevant
- **Search optimization**: Use Grep tool for efficient topic discovery

**Alternative considered**: Auto-load all topic files
- **Rejected**: Would quickly exceed context limits, no selectivity

---

### 7.3 Session-Level Caching with Context-Based Invalidation

**CORRECTION (2026-03-29)**: Prior analysis incorrectly stated "no caching". The actual implementation caches memory content per session.

**Actual decision**: Memory is registered as a static system prompt component (`AF("memory", () => ID1())` with `cacheBreak: false`). The value is cached in `v1.systemPromptSectionCache` after the first evaluation.

**How it works:**
- First turn: `ID1()` called → reads MEMORY.md from disk → result cached under key `"memory"`
- Subsequent turns: `B8q()` checks cache → cache HIT → returns cached value without disk read
- Cache cleared by `RT6()` when: worktree created/reset, full session reset via `gl()`

**Two-path architecture:**
- **Static path (cached)**: MEMORY.md content in system prompt — refreshed only on context change
- **Dynamic path (per-turn, `tengu_moth_copse`)**: `zqq()` → concurrent semantic search → `relevant_memories` injected post-turn as user messages

**Rationale for caching:**
- **Performance**: Avoids repeated disk I/O for unchanged content
- **Consistency**: Prevents partial state if MEMORY.md is being written mid-session
- The `relevant_memories` dynamic path provides fresh semantic memory lookup each turn

> **For detailed analysis**, see [39_agent_loop_integration_deep_dive.md](./39_agent_loop_integration_deep_dive.md) - Complete system prompt caching architecture with source code.

**Trade-off**: Agent won't see mid-session MEMORY.md changes in the system prompt until context reset. Mitigated by `relevant_memories` dynamic path for fresh semantic lookup.

---

## 8. Multi-Agent Considerations

When multiple agents collaborate (via Agent Teams), memory sharing and isolation become critical. For complete details, see [multi_agent_memory.md](./multi_agent_memory.md).

### 8.1 Memory Isolation Model

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

### 8.2 Shared Memory Benefits and Risks

**Benefits**:
- Knowledge accumulates across all agents (debugging notes, patterns)
- Patterns discovered by any agent benefit the team
- No synchronization overhead (file system handles it)

**Risks**:
- Write conflicts possible (last-write-wins)
- No privacy (all agents see all memory)
- Large teams may overwhelm single MEMORY.md

### 8.3 Write Conflict Mitigation

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

## 9. Remote Memory Architecture

Remote memory enables sharing memory across machines via network storage. For complete details, see [remote_memory_sync.md](./remote_memory_sync.md).

### 9.1 Remote Override Mechanism

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

### 9.2 Supported Storage Types

| Storage | Latency | Use Case |
|---------|---------|----------|
| **NFS** | <10ms | Production teams, always-on servers |
| **SMB/CIFS** | <20ms | Windows shares, cross-platform teams |
| **SSHFS** | 10-50ms | Remote development, SSH workflows |
| **Dropbox/Drive** | 1-60s | Personal multi-machine (sync lag OK) |

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
7. **Custom Directory**: `autoMemoryDirectory` setting for team/custom workflows (v2.1.59)
8. **Freshness Tracking**: Last-modified timestamps for staleness detection (v2.1.74)

**Key architectural insight**: The system balances **persistent knowledge** with **context window efficiency** by using MEMORY.md as a lightweight index and delegating detailed content to searchable topic files.

---

## 10. Cross-Module Integration

Auto Memory integrates with several other Claude Code modules:

### 10.1 System Reminder (04_system_reminder)

**Integration points**:

1. **Dynamic Variable Registration**: Memory registered as `auto_memory` dynamic variable
   - Location: chunks.169.mjs:231, 246
   - Evaluated fresh on every turn via `getAutoMemory()` (`ID1`)

2. **Attachment Types**:
   - `nested_memory` - Individual memory files loaded via CLAUDE.md includes
   - `relevant_memories` - Related memory files with staleness timestamps

3. **Normalization Flow**:
   ```
   produceRelevantMemories (buY)
           │
           ▼
   { type: "relevant_memories", memories: [...] }
           │
           ▼
   normalizeAttachmentForAPI (Ui8) - chunks.174.mjs:172-184
           │
           ├── buildStalenessWarning (Cz8)
           ├── formatRelativeTime (cJ7)
           └── wrapWithSystemReminderTags (b5)
           │
           ▼
   <system-reminder>Memory content...</system-reminder>
   ```

**Cross-reference**: [../04_system_reminder/types_skills_memory.md](../04_system_reminder/types_skills_memory.md)

### 10.2 Background Agents (26_background_agents)

**Feature flag**: `tengu_passport_quail`

**Behavior when enabled**:
- Main agent cannot write to memory files directly
- Extraction subagent spawned after completion
- Uses `buildBackgroundAgentMemoryPrompt` (`xv9`) for single memory
- Uses `buildExtractModeTypedCombinedPrompt` (`bv9`) for team memory

**Extraction prompts**:
- `DKq` - Standard extraction
- `XKq` - File-based extraction
- `PKq` - Team extraction
- `WKq` - Team file-based extraction

**Cross-reference**: [25_background_agent_memory.md](./25_background_agent_memory.md)

### 10.3 Task System (13_task_system)

Memory vs Task decision guidance:

| Use Memory When | Use Tasks When |
|-----------------|----------------|
| Cross-session knowledge | Session-specific tracking |
| User preferences | Step-by-step progress |
| Project patterns | Temporary state |
| Architectural decisions | Work breakdown |

**Prompt guidance** (included in memory prompts):
```
"When to use or update tasks instead of memory:
 - When you need to break work into discrete steps or track progress,
   use tasks instead of saving to memory."
```

### 10.4 Plan Mode (12_plan_mode)

**Integration**:
- Memory content loaded before plan creation
- Agent can reference past patterns when designing plans
- Plan decisions can be saved to memory for future sessions

**Prompt guidance**:
```
"When to use or update a plan instead of memory:
 - If you are about to start a non-trivial implementation task,
   use a Plan rather than saving to memory."
```

### 10.5 MCP Protocol (06_mcp)

**Remote memory support**:

**Environment variable**: `CLAUDE_CODE_REMOTE_MEMORY_DIR`

**Use cases**:
- Shared team memory via network storage
- SSH session persistence
- Cloud agent memory synchronization

**Implementation**:
```javascript
function getHomeDirectory() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    }
    return getLocalHomeDirectory();
}
```

**Cross-reference**: [remote_memory_sync.md](./remote_memory_sync.md)
