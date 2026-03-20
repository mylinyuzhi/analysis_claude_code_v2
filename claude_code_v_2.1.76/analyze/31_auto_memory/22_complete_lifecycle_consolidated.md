# Complete Auto Memory Lifecycle (Consolidated Reference)

## Overview

This document consolidates all auto memory flows into a single end-to-end reference, integrating concepts from files 15-21. It traces the complete journey from feature enablement through creation, updates, consumption, error handling, and TUI interactions.

**Purpose**: Serve as the definitive lifecycle reference for developers, combining all subsystem behaviors into cohesive scenarios.

**Version**: Claude Code v2.1.76

---

## Lifecycle Stage 1: Feature Enablement

### Enable Decision Tree (Priority Chain)

// ============================================
// isAutoMemoryEnabled - Enable/disable logic
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

```
User starts Claude Code
  |
  +-> Check Priority 1: CLAUDE_CODE_DISABLE_AUTO_MEMORY=1? (truthy)
  |   +-> YES -> DISABLED (highest priority)
  |   +-> NO  -> Continue to Priority 2
  |
  +-> Check Priority 2: CLAUDE_CODE_DISABLE_AUTO_MEMORY=0? (falsy non-empty)
  |   +-> YES -> ENABLED (override)
  |   +-> NO  -> Continue to Priority 3
  |
  +-> Check Priority 3: Remote mode without directory?
  |   +-> YES -> DISABLED (safety measure)
  |   +-> NO  -> Continue to Priority 4
  |
  +-> Check Priority 4: User setting (userSettings.autoMemoryEnabled)?
  |   +-> true      -> ENABLED
  |   +-> false     -> DISABLED
  |   +-> undefined -> Continue to Priority 5
  |
  +-> Check Priority 5: Default
      +-> ENABLED (true - default enabled in v2.1.76)
```

**Source**: [20_feature_flag_rollout.md](./20_feature_flag_rollout.md)

**Telemetry**: If disabled, logs `tengu_memdir_disabled` event with reasons

---

## Lifecycle Stage 2: Directory Resolution

### Directory Path Construction

// ============================================
// getAutoMemoryDirectory - Directory resolution (lazy-evaluated)
// Location: chunks.50.mjs:2468-2473
// ============================================

```
Feature enabled -> Determine memory directory path (uH)
  |
  +-> Check Priority 1: CLAUDE_COWORK_MEMORY_PATH_OVERRIDE? (UJ7)
  |   +-> SET -> Use cowork override (team shared storage)
  |   +-> NOT SET -> Continue
  |
  +-> Check Priority 2: autoMemoryDirectory setting? (gG3)
  |   +-> SET -> Use custom directory (v2.1.59)
  |   +-> NOT SET -> Continue
  |
  +-> Check Priority 3: CLAUDE_CODE_REMOTE_MEMORY_DIR? (Ma)
  |   +-> SET -> Use as base instead of ~/.claude/
  |   +-> NOT SET -> Use os.homedir()/.claude/ as base
  |
  +-> Compute project hash from getCurrentContextPath() (FG3)
  |
  +-> Assemble: {baseDir}/projects/{projectHash}/memory/
  |
  +-> Normalize Unicode (NFC) + ensure trailing slash
```

**Source**: [architecture.md](./architecture.md), [multi_agent_memory.md](./multi_agent_memory.md)

---

## Lifecycle Stage 3: First Turn (Creation Flow)

### Turn 1: Initial Memory State

// ============================================
// getAutoMemory - Main async entry point
// Location: chunks.84.mjs:382-411
// ============================================

```
TURN 1: First conversation in new project

Step 1: System prompt builder invokes getAutoMemory() (ID1)
Step 2: isAutoMemoryEnabled() (Z3) -> true
Step 3: ensureMemoryDirExists() (CD1) - async directory creation
   try {
     await fs.mkdir(memoryDir);
   } catch {
     // Silent failure (optimistic approach)
   }
Step 4: recordMemoryDirLoadMetrics() (DF6) - log telemetry
Step 5: buildAutoMemoryPromptSimple() (uv9) or buildMemoryPrompt() (Q14)
Step 6: File read attempt
   try {
     content = fs.readFileSync(memoryPath, "utf8");
   } catch (ENOENT) {
     // File doesn't exist -> Return empty state message
     return emptyStateMessage;
   }
Step 7: Empty state message injected into system prompt
   ## MEMORY.md

   Your MEMORY.md is currently empty. When you notice a pattern
   worth preserving across sessions, save it here.
Step 8: LLM receives system prompt with empty state
Step 9: Agent understands memory system exists but is empty
```

**Telemetry**: Logs `tengu_memdir_loaded` with `content_length: 0, line_count: 0, was_truncated: false`

**Source**: [18_system_reminder_generation.md](./18_system_reminder_generation.md)

---

## Lifecycle Stage 4: Memory Write (Update Flow)

### User Request → Write Tool → File Updated

```
User: "Remember we use TypeScript for all files"
  |
Agent formulates Write tool call
   { tool: "Write", file_path: "~/.claude/projects/X/memory/MEMORY.md",
     content: "# Project Conventions\n\n- TypeScript for all new files" }
  |
Permission Validator
   if (isAutoMemoryPath(file_path)) {  // Da() at chunks.50.mjs:2451
     return { decision: "allow", reason: "auto memory files are allowed" };
   }
   Decision: ALLOW (no user prompt)
  |
Path validation: isAutoMemoryPath() (Da)
   1. Normalize path: "~/.claude/projects/X/memory/MEMORY.md"
      -> "/Users/user/.claude/projects/X/memory/MEMORY.md"
   2. Get memory directory: getAutoMemoryDirectory() (uH)
      -> "/Users/user/.claude/projects/X/memory/"
   3. Prefix match: normalized.startsWith(memoryDir) -> true
  |
File system operation
   fs.writeFileSync("/Users/user/.claude/projects/X/memory/MEMORY.md",
                    "# Project Conventions\n\n- TypeScript for all new files", "utf8");
   File created/updated successfully
  |
Agent response to user:
   "I've saved that to memory. From now on, I'll remember we use TypeScript."
```

**Concurrent access behavior**:
- **No locking**: Last-write-wins if multiple agents write simultaneously
- **Risk**: Data loss in multi-agent scenarios
- **Mitigation**: Use separate topic files per agent, or separate memory directories

**Source**: [15_write_edit_integration.md](./15_write_edit_integration.md)

---

## Lifecycle Stage 5: Next Turn (Consumption Flow)

### Turn 2: Memory Content Loaded with Timestamp

```
TURN 2: User asks "What language do we use?"

Step 1: System prompt builder invokes getMemoryContext()
Step 2: isAutoMemoryEnabled() -> true
Step 3: buildMemoryPrompt() starts
Step 4: Directory already exists (from Turn 1)
Step 5: File stat for timestamp (v2.1.74)
   stat = fs.statSync(memoryPath);
   promptSection += "Last updated: 2026-03-14T15:22:00.000Z\n\n"
Step 6: File read (FRESH from disk, not cached)
   content = fs.readFileSync(memoryPath, "utf8");
   content = "# Project Conventions\n\n- TypeScript for all new files"
Step 7: Unicode normalization
   content = content.normalize("NFC");
Step 8: Line count check
   lines = content.split("\n"); // 3 lines
   if (3 > 200) { /* No truncation */ }
Step 9: Telemetry logging
   recordMemoryDirLoadMetrics({
     content_length: 54, line_count: 3, was_truncated: false,
     memory_type: "auto", total_file_count: 1, total_subdir_count: 0
   });
Step 10: Build full system prompt section
   # auto memory
   ...guidelines...
   Last updated: 2026-03-14T15:22:00.000Z
   ## MEMORY.md
   # Project Conventions
   - TypeScript for all new files
Step 11: Agent response
   "According to my memory, we use TypeScript for all new files."
```

**Source**: [18_system_reminder_generation.md](./18_system_reminder_generation.md)

---

## Lifecycle Stage 6: Error Handling (Truncation Scenario)

### File Exceeds 200 Lines

```
File grows to 250 lines over multiple updates

Turn N: buildMemoryPrompt() executes
Step 1: Read file
   content = fs.readFileSync(memoryPath, "utf8");
Step 2: Line count check
   lines = content.split("\n");
   lineCount = 250;
   if (250 > 200) { /* TRIGGER TRUNCATION */ }
Step 3: Truncate to first 200 lines
   truncatedContent = lines.slice(0, 200).join("\n");
Step 4: Append warning message
   warningMessage = "\n\n> WARNING: MEMORY.md is 250 lines (limit: 200).\n  Only the first 200 lines were loaded.\n  Move detailed content into separate topic files..."
   finalContent = truncatedContent + warningMessage;
Step 5: Inject into system prompt
   ## MEMORY.md
   [Lines 1-200 of actual content]
   > WARNING: MEMORY.md is 250 lines (limit: 200).
     Only the first 200 lines were loaded...
Step 6: Agent sees warning, should refactor:
   - Create topic files (e.g., typescript.md, react.md)
   - Update MEMORY.md to link to topic files
   - Reduce to < 200 lines
```

**Telemetry**: `tengu_memdir_loaded` with `was_truncated: true`

**Source**: [16_error_handling_recovery.md](./16_error_handling_recovery.md)

---

## Lifecycle Stage 7: Character Limit Warning (TUI)

### File Exceeds 40000 Characters

```
File grows to 50KB (e.g., long lines, embedded JSON)

User opens /memory modal
  |
TUI startup: Check for large files
   largeFiles = getLargeMemoryFiles();
   if (file.content.length > 40000) { /* Flag as oversized */ }
  |
TUI displays warning banner:
   +------------------------------------------+
   | Large memory files detected:             |
   |    - MEMORY.md (50000 characters,        |
   |      recommended: < 40000)               |
   |                                          |
   |    Large files may impact TUI rendering  |
   |    performance.                          |
   +------------------------------------------+
   | Auto-memory: [x] on  [ ] off             |
   +------------------------------------------+
  |
User action: Manual refactoring required
   - No automatic fix (by design)
   - User decides how to split content
```

**Why no auto-fix?**: Character limit is a soft warning — TUI performance varies by system; automatic splitting could break content structure.

**Source**: [16_error_handling_recovery.md](./16_error_handling_recovery.md), [17_tui_integration.md](./17_tui_integration.md)

---

## Lifecycle Stage 8: TUI Interaction (Toggle Flow)

### User Toggles Auto Memory Off

```
User presses /memory in TUI
  |
TUI renders memoryEditorModal()
   - Loads current userSettings.autoMemoryEnabled
   - Displays current state: [x] on
  |
User clicks toggle switch
  |
handleAutoMemoryToggle() executes:
   1. Calculate new state: !autoMemoryEnabled -> false
   2. Update settings file: updateUserSettings("userSettings", { autoMemoryEnabled: false })
      Writes to ~/.claude/settings.json
   3. Log telemetry: recordTelemetryEvent("tengu_auto_memory_toggled", { enabled: false })
   4. Update UI state: setAutoMemoryEnabled(false)
      Visual feedback: [ ] on  [x] off
  |
User closes modal
  |
Next turn: isAutoMemoryEnabled() checks priority chain
   Priority 4: userSettings.autoMemoryEnabled = false -> MATCHES
   Return: false
  |
getMemoryContext() returns null
   No memory section in system prompt
  |
Agent operates without memory context
```

**Telemetry**: `tengu_auto_memory_toggled` event with `enabled: false`

**Source**: [17_tui_integration.md](./17_tui_integration.md), [20_feature_flag_rollout.md](./20_feature_flag_rollout.md)

---

## Lifecycle Stage 9: Custom Directory Setup (v2.1.59)

### Using autoMemoryDirectory Setting

```
User configures custom memory directory
   ~/.claude/settings.json:
   { "userSettings": { "autoMemoryDirectory": "/team-share/memory/" } }
  |
getAutoMemoryDirectory() resolution:
   if (settings.autoMemoryDirectory) {
     return settings.autoMemoryDirectory; // "/team-share/memory/"
   }
   // Skip project-hash computation entirely
  |
All agents configured with same autoMemoryDirectory share memory:
   Agent 1 (project A) -> /team-share/memory/MEMORY.md
   Agent 2 (project B) -> /team-share/memory/MEMORY.md (SAME FILE!)
  |
Permission bypass still applies:
   isAutoMemoryPath("/team-share/memory/MEMORY.md")
   normalizedPath.startsWith(mu1()) -> true
   Decision: ALLOW
```

**Use case**: Shared team knowledge base without NFS/SSHFS setup — any writable shared path works.

**Source**: [multi_agent_memory.md](./multi_agent_memory.md)

---

## Lifecycle Stage 10: Remote Mode (Distributed Teams)

### Remote Session with Shared Memory

```
Team member starts remote session:
   export CLAUDE_CODE_REMOTE_MEMORY_DIR=/shared/nfs/team-memory/
  |
isAutoMemoryEnabled() checks priority chain:
   Priority 3: Remote mode?
     YES -> Check CLAUDE_CODE_REMOTE_MEMORY_DIR
       SET -> Continue (enabled)
       NOT SET -> Return false (disabled for safety)
  |
getAutoMemoryDirectory() returns:
   base = CLAUDE_CODE_REMOTE_MEMORY_DIR  // "/shared/nfs/team-memory/"
   hash = hashPath(getCurrentContextPath())
   -> "/shared/nfs/team-memory/projects/{hash}/memory/"
  |
Multiple team members with same project cwd read/write same directory:
   Agent 1 (Alice's machine) -> /shared/nfs/team-memory/projects/{hash}/memory/
   Agent 2 (Bob's machine)   -> /shared/nfs/team-memory/projects/{hash}/memory/
                                SAME DIRECTORY
  |
Concurrent write risk:
   No locking -> Last-write-wins
   Recommendation: Coordinate via topic files per agent
```

**Safety measure**: Remote mode REQUIRES explicit directory

**Source**: [remote_memory_sync.md](./remote_memory_sync.md), [20_feature_flag_rollout.md](./20_feature_flag_rollout.md)

---

## Complete Scenario: End-to-End Journey

### New Project → First Memory → Update → Refactor

```
DAY 1, Turn 1: Project initialization
   Feature enabled (flag default / user setting)
   Directory created: ~/.claude/projects/abc123/memory/
   No MEMORY.md -> Empty state message
   Agent learns about memory system

DAY 1, Turn 5: User request
   User: "Remember we use TypeScript"
   Agent writes MEMORY.md (no permission prompt - bypassed)
   File created: 3 lines, 54 chars

DAY 2, Turn 1: Next session
   Fresh file read (not cached)
   Last updated: 2026-03-14T15:22:00.000Z included in prompt
   Content loaded into system prompt
   Agent recalls TypeScript preference

DAY 30, Turn 50: File grows
   MEMORY.md now 250 lines (exceeded limit)
   Truncation triggered
   Warning appended to system prompt
   Telemetry: was_truncated=true
   Agent sees warning

DAY 30, Turn 51: Agent refactors
   Creates typescript.md, react.md, testing.md (3 writes, no prompts)
   Updates MEMORY.md to be index (30 lines)
   Next turn: Truncation warning gone

DAY 60: User opens /memory
   TUI shows 4 files, 0 subdirectories
   No large file warning (under 40000 chars)
   User opens MEMORY.md in VS Code via TUI
   Reviews and organizes content
```

---

## Error Scenarios Consolidated

### Scenario Matrix

| Error Type | Detection | Recovery | User Impact | Source File |
|------------|-----------|----------|-------------|-------------|
| **File > 200 lines** | Line count check | Auto-truncate + warning | Sees warning in prompt | 16_error_handling |
| **File > 40000 chars** | TUI scan | TUI banner only | Manual fix required | 16_error_handling |
| **Directory creation fails** | mkdir catch | Silent continue | Empty state shown | 16_error_handling |
| **File read fails** | readFileSync catch | Empty state message | Appears empty | 16_error_handling |
| **Permission denied** | readFileSync catch | Empty state message | Silent failure | 16_error_handling |
| **Concurrent writes** | No detection | Last-write-wins | Data loss risk | 15_write_edit |
| **Remote mode no dir** | Priority 3 check | Disable feature | No memory loaded | 20_feature_flag |

---

## Telemetry Event Timeline

### Events Logged Per Session

```
Session start
  |
Turn 1: tengu_memdir_loaded (if enabled)
Turn 2: tengu_memdir_loaded
Turn 3: tengu_memdir_loaded
...
  |
User opens /memory and toggles off
  -> tengu_auto_memory_toggled { enabled: false }
  |
Turn 4: tengu_memdir_disabled { disabled_by_setting: true }
Turn 5: tengu_memdir_disabled
...
```

**Source**: [19_telemetry_monitoring.md](./19_telemetry_monitoring.md)

---

## Related Documentation

### Phase 4 Deep Dives
- [15_write_edit_integration.md](./15_write_edit_integration.md) - Permission flow, concurrent access
- [16_error_handling_recovery.md](./16_error_handling_recovery.md) - Dual limits, error paths
- [17_tui_integration.md](./17_tui_integration.md) - TUI modal, settings toggle
- [18_system_reminder_generation.md](./18_system_reminder_generation.md) - Prompt injection, hot-reload
- [19_telemetry_monitoring.md](./19_telemetry_monitoring.md) - Analytics events
- [20_feature_flag_rollout.md](./20_feature_flag_rollout.md) - 5-level priority chain
- [21_implementation_vs_official_docs.md](./21_implementation_vs_official_docs.md) - Discrepancies

### Phase 1-3 Foundations
- [architecture.md](./architecture.md) - System overview
- [loading_mechanism.md](./loading_mechanism.md) - Loading algorithm
- [usage_patterns.md](./usage_patterns.md) - Best practices
- [multi_agent_memory.md](./multi_agent_memory.md) - Isolation strategies
- [remote_memory_sync.md](./remote_memory_sync.md) - Distributed setups

---

## Key Takeaways

1. **5-stage lifecycle**: Enable → Resolve directory → Create → Update → Consume
2. **Every turn is fresh**: No caching, always read from disk (hot-reload at turn boundary)
3. **Dual limits enforced**: 200 lines (hard) + 40000 chars (soft)
4. **Permission bypass**: Auto memory paths auto-approved
5. **Silent error handling**: All errors caught, empty state fallback
6. **Telemetry pervasive**: 3 events track full lifecycle
7. **User control**: TUI toggle, env var, feature flag, autoMemoryDirectory (v2.1.59)
8. **Freshness timestamps** (v2.1.74): `Last updated:` in every prompt header
9. **Concurrent writes risky**: No locking, last-write-wins

This consolidated lifecycle reference ties together all subsystems into cohesive end-to-end scenarios.
