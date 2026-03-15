# Complete Auto Memory Lifecycle (Consolidated Reference)

## Overview

This document consolidates all auto memory flows into a single end-to-end reference, integrating concepts from files 15-21. It traces the complete journey from feature enablement through creation, updates, consumption, error handling, and TUI interactions.

**Purpose**: Serve as the definitive lifecycle reference for developers, combining all subsystem behaviors into cohesive scenarios.

---

## Lifecycle Stage 1: Feature Enablement

### Enable Decision Tree (5-Level Priority Chain)

```
User starts Claude Code
  │
  ├─> Check Priority 1: CLAUDE_CODE_DISABLE_AUTO_MEMORY=1?
  │   └─> YES → ❌ DISABLED (highest priority)
  │   └─> NO  → Continue to Priority 2
  │
  ├─> Check Priority 2: CLAUDE_CODE_DISABLE_AUTO_MEMORY=0?
  │   └─> YES → ✅ ENABLED (override)
  │   └─> NO  → Continue to Priority 3
  │
  ├─> Check Priority 3: Remote mode without directory?
  │   └─> YES → ❌ DISABLED (safety measure)
  │   └─> NO  → Continue to Priority 4
  │
  ├─> Check Priority 4: User setting (userSettings.autoMemoryEnabled)?
  │   └─> true  → ✅ ENABLED
  │   └─> false → ❌ DISABLED
  │   └─> undefined → Continue to Priority 5
  │
  └─> Check Priority 5: Feature flag (tengu_oboe)?
      └─> true  → ✅ ENABLED (gradual rollout)
      └─> false → ❌ DISABLED (research preview default)
```

**Source**: [20_feature_flag_rollout.md](./20_feature_flag_rollout.md)

**Telemetry**: If disabled, logs `tengu_memdir_disabled` event with reasons

---

## Lifecycle Stage 2: Directory Resolution

### Directory Path Construction

```
Feature enabled → Determine memory directory path
  │
  ├─> Is remote mode?
  │   └─> YES → Use CLAUDE_CODE_REMOTE_MEMORY_DIR
  │   └─> NO  → Continue
  │
  ├─> Project context exists?
  │   └─> YES → Hash project path
  │   │        ~/.claude/projects/{hash}/memory/
  │   └─> NO  → Use default
  │            ~/.claude/memory/
  │
  └─> Directory path resolved
```

**Path normalization**:
- `~` → Expand to home directory
- Relative paths → Resolve to absolute
- Trailing slashes → Remove
- Symbolic links → Resolve to target

**Source**: [15_write_edit_integration.md](./15_write_edit_integration.md) - Path normalization

---

## Lifecycle Stage 3: First Turn (Creation Flow)

### Turn 1: Initial Memory State

```
┌──────────────────────────────────────────────────┐
│ TURN 1: First conversation in new project       │
└──────────────────────────────────────────────────┘

Step 1: System prompt builder invokes getMemoryContext()
  ↓
Step 2: isAutoMemoryEnabled() → true
  ↓
Step 3: buildMemoryPrompt() starts
  ↓
Step 4: Directory creation attempt
  try {
    fs.mkdirSync(memoryDir, { recursive: true });
  } catch {
    // Silent failure (optimistic approach)
  }
  ↓
Step 5: File read attempt
  try {
    content = fs.readFileSync(memoryPath, "utf8");
  } catch (ENOENT) {
    // File doesn't exist → Return empty state message
    return emptyStateMessage;
  }
  ↓
Step 6: Empty state message injected into system prompt
  ## MEMORY.md

  Your MEMORY.md is currently empty. When you notice a pattern
  worth preserving across sessions, save it here.
  ↓
Step 7: LLM receives system prompt with empty state
  ↓
Step 8: Agent understands memory system exists but is empty
```

**Telemetry**: Logs `tengu_memdir_loaded` with:
```javascript
{
  content_length: 0,
  line_count: 0,
  was_truncated: false,
  memory_type: "auto",
  total_file_count: 0,
  total_subdir_count: 0
}
```

**Source**: [18_system_reminder_generation.md](./18_system_reminder_generation.md)

---

## Lifecycle Stage 4: Memory Write (Update Flow)

### User Request → Write Tool → File Updated

```
┌──────────────────────────────────────────────────┐
│ User: "Remember we use TypeScript for all files" │
└──────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────┐
│ Agent formulates Write tool call                 │
│ {                                                 │
│   tool: "Write",                                  │
│   file_path: "~/.claude/projects/X/memory/       │
│               MEMORY.md",                         │
│   content: "# Project Conventions\n\n            │
│             - TypeScript for all new files"       │
│ }                                                 │
└──────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────┐
│ Permission Validator (chunks.174.mjs:933-940)    │
│                                                   │
│ if (isAutoMemoryPath(file_path)) {               │
│   return {                                        │
│     decision: "allow",                            │
│     reason: "auto memory files are allowed"      │
│   };                                              │
│ }                                                 │
│                                                   │
│ Decision: ALLOW (no user prompt)                 │
└──────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────┐
│ Path validation: isAutoMemoryPath()              │
│                                                   │
│ 1. Normalize path:                                │
│    "~/.claude/projects/X/memory/MEMORY.md"       │
│    → "/Users/user/.claude/projects/X/memory/     │
│       MEMORY.md"                                  │
│                                                   │
│ 2. Get memory directory:                         │
│    getAutoMemoryDirectory()                      │
│    → "/Users/user/.claude/projects/X/memory/"    │
│                                                   │
│ 3. Prefix match:                                  │
│    normalized.startsWith(memoryDir) → true ✅    │
└──────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────┐
│ File system operation                            │
│                                                   │
│ fs.writeFileSync(                                 │
│   "/Users/user/.claude/projects/X/memory/        │
│    MEMORY.md",                                    │
│   "# Project Conventions\n\n                     │
│    - TypeScript for all new files",              │
│   "utf8"                                          │
│ );                                                │
│                                                   │
│ File created/updated successfully ✅             │
└──────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────┐
│ Agent response to user                           │
│ "I've saved that to memory. From now on,         │
│  I'll remember we use TypeScript."               │
└──────────────────────────────────────────────────┘
```

**Concurrent access behavior**:
- **No locking**: Last-write-wins if multiple agents write simultaneously
- **Risk**: Data loss in multi-agent scenarios
- **Mitigation**: Use separate memory directories per agent (default behavior)

**Source**: [15_write_edit_integration.md](./15_write_edit_integration.md)

---

## Lifecycle Stage 5: Next Turn (Consumption Flow)

### Turn 2: Memory Content Loaded

```
┌──────────────────────────────────────────────────┐
│ TURN 2: User asks "What language do we use?"     │
└──────────────────────────────────────────────────┘

Step 1: System prompt builder invokes getMemoryContext()
  ↓
Step 2: isAutoMemoryEnabled() → true
  ↓
Step 3: buildMemoryPrompt() starts
  ↓
Step 4: Directory already exists (from Turn 1)
  ↓
Step 5: File read (FRESH from disk, not cached)
  content = fs.readFileSync(memoryPath, "utf8");
  content = "# Project Conventions\n\n- TypeScript for all new files"
  ↓
Step 6: Unicode normalization
  content = content.normalize("NFC");
  // Ensures consistent character representation
  ↓
Step 7: Line count check
  lines = content.split("\n"); // ["# Project Conventions", "", "- TypeScript..."]
  lineCount = 3;

  if (lineCount > 200) {
    // Truncate (not triggered, 3 < 200)
  }
  ↓
Step 8: Telemetry logging
  recordMemoryDirLoadMetrics({
    content_length: 54,
    line_count: 3,
    was_truncated: false,
    memory_type: "auto",
    total_file_count: 1,     // MEMORY.md
    total_subdir_count: 0
  });
  ↓
Step 9: Build full system prompt section
  # auto memory

  You have a persistent auto memory directory at `...`.

  Guidelines:
  ...

  ## MEMORY.md

  # Project Conventions

  - TypeScript for all new files
  ↓
Step 10: LLM receives updated system prompt
  ↓
Step 11: Agent response
  "According to my memory, we use TypeScript for all new files."
```

**Source**: [18_system_reminder_generation.md](./18_system_reminder_generation.md)

**Telemetry**: `tengu_memdir_loaded` event logged every turn

---

## Lifecycle Stage 6: Error Handling (Truncation Scenario)

### File Exceeds 200 Lines

```
┌──────────────────────────────────────────────────┐
│ File grows to 250 lines over multiple updates   │
└──────────────────────────────────────────────────┘

Turn N: buildMemoryPrompt() executes
  ↓
Step 1: Read file
  content = fs.readFileSync(memoryPath, "utf8");
  ↓
Step 2: Line count check
  lines = content.split("\n");
  lineCount = 250;

  if (lineCount > MEMORY_MAX_LINES) { // 250 > 200 → true
    // TRIGGER TRUNCATION
  }
  ↓
Step 3: Truncate to first 200 lines
  truncatedLines = lines.slice(0, 200);
  truncatedContent = truncatedLines.join("\n");
  ↓
Step 4: Append warning message
  warningMessage = `

> WARNING: MEMORY.md is 250 lines (limit: 200).
  Only the first 200 lines were loaded.
  Move detailed content into separate topic files and keep MEMORY.md as a concise index.`;

  finalContent = truncatedContent + warningMessage;
  ↓
Step 5: Inject into system prompt
  ## MEMORY.md

  [Lines 1-200 of actual content]

  > WARNING: MEMORY.md is 250 lines (limit: 200).
    Only the first 200 lines were loaded...
  ↓
Step 6: Agent sees warning in system prompt
  ↓
Step 7: Agent should refactor
  - Create topic files (e.g., typescript.md, react.md)
  - Update MEMORY.md to link to topic files
  - Reduce to < 200 lines
```

**Telemetry**:
```javascript
{
  content_length: 15000,
  line_count: 250,
  was_truncated: true,  // ← Flag indicates truncation
  ...
}
```

**Source**: [16_error_handling_recovery.md](./16_error_handling_recovery.md)

---

## Lifecycle Stage 7: Character Limit Warning (TUI)

### File Exceeds 40000 Characters

```
┌──────────────────────────────────────────────────┐
│ File grows to 50KB (e.g., long lines, JSON)      │
└──────────────────────────────────────────────────┘

User opens /memory modal
  ↓
TUI startup: Check for large files
  largeFiles = getLargeMemoryFiles();
  // Scans all files in memory directory

  largeFiles.forEach(file => {
    if (file.content.length > 40000) {
      // Flag as oversized
    }
  });
  ↓
TUI displays warning banner
  ┌────────────────────────────────────────────┐
  │ ⚠️  Large memory files detected:           │
  │    - MEMORY.md (50000 characters,          │
  │      recommended: < 40000)                 │
  │                                            │
  │    Large files may impact TUI rendering   │
  │    performance. Consider splitting into   │
  │    smaller topic files.                   │
  ├────────────────────────────────────────────┤
  │ Auto-memory: [x] on  [ ] off               │
  │                                            │
  │ Select file or folder:                     │
  │ ┌────────────────────────────────────────┐ │
  │ │ auto memory entrypoint              ▼ │ │
  │ └────────────────────────────────────────┘ │
  └────────────────────────────────────────────┘
  ↓
User action: Manual refactoring required
  - No automatic fix (by design)
  - User decides how to split content
```

**Why no auto-fix?**
- Character limit is **soft warning** (informational)
- TUI performance varies by system
- User may have legitimate reasons for large files
- Automatic splitting could break structure

**Source**: [16_error_handling_recovery.md](./16_error_handling_recovery.md), [17_tui_integration.md](./17_tui_integration.md)

---

## Lifecycle Stage 8: TUI Interaction (Toggle Flow)

### User Toggles Auto Memory Off

```
┌──────────────────────────────────────────────────┐
│ User presses /memory in TUI                      │
└──────────────────────────────────────────────────┘
  ↓
TUI renders memoryEditorModal()
  - Loads current userSettings.autoMemoryEnabled
  - Displays current state: [x] on
  ↓
User clicks toggle switch
  ↓
handleAutoMemoryToggle() executes
  ├─> Calculate new state: !autoMemoryEnabled → false
  ├─> Update settings file:
  │   updateUserSettings("userSettings", {
  │     autoMemoryEnabled: false
  │   });
  │   // Writes to ~/.claude/settings.json
  │
  ├─> Log telemetry:
  │   recordTelemetryEvent("tengu_auto_memory_toggled", {
  │     enabled: false
  │   });
  │
  └─> Update UI state:
      setAutoMemoryEnabled(false);
      // Visual feedback: [ ] on  [x] off
  ↓
User closes modal
  ↓
Next turn: isAutoMemoryEnabled() checks priority chain
  Priority 1: Env var? → No
  Priority 2: Env var enable? → No
  Priority 3: Remote mode? → No
  Priority 4: User setting? → false ← MATCHES

  Return: false
  ↓
getMemoryContext() returns null
  // No memory section in system prompt
  ↓
Agent operates without memory context
```

**Telemetry**: `tengu_auto_memory_toggled` event with `enabled: false`

**Source**: [17_tui_integration.md](./17_tui_integration.md), [20_feature_flag_rollout.md](./20_feature_flag_rollout.md)

---

## Lifecycle Stage 9: External Editor Integration

### User Opens MEMORY.md in Editor

```
User presses /memory → Selects "auto memory entrypoint" → Clicks [Open]
  ↓
handleOpenSelection() executes
  ├─> Determine editor:
  │   editor = process.env.VISUAL ||
  │            process.env.EDITOR ||
  │            "vi";
  │
  ├─> Launch editor (synchronous blocking):
  │   spawn(editor, [memoryPath], {
  │     stdio: "inherit"  // Inherit TUI's I/O
  │   });
  │
  └─> TUI waits for editor to close
      (User cannot interact with TUI while editing)
  ↓
User edits file:
  # Project Conventions

  - TypeScript for all new files
  - React functional components preferred  ← NEW LINE ADDED
  - ESLint + Prettier configured
  ↓
User saves and closes editor
  ↓
TUI resumes, modal closes
  ↓
Next turn: Fresh file read picks up changes
  buildMemoryPrompt() reads updated content
  Agent sees new conventions
```

**Why synchronous?**
- **User intent**: Expects to edit NOW
- **Modal context**: Blocks other interactions anyway
- **No file watching needed**: Editor close = edit complete

**Source**: [17_tui_integration.md](./17_tui_integration.md)

---

## Lifecycle Stage 10: Remote Mode (Distributed Teams)

### Remote Session with Shared Memory

```
Team member starts remote session:
  export CLAUDE_CODE_REMOTE_MEMORY_DIR=/shared/nfs/team-memory/
  claude-code --remote
  ↓
isAutoMemoryEnabled() checks priority chain:
  Priority 3: Remote mode?
    YES → Check CLAUDE_CODE_REMOTE_MEMORY_DIR
      SET → Continue (enabled)
      NOT SET → Return false (disabled for safety)
  ↓
getAutoMemoryDirectory() returns:
  /shared/nfs/team-memory/
  ↓
Multiple team members read/write same directory:
  ┌─────────────┐      ┌─────────────┐
  │ Team Member │      │ Team Member │
  │      1      │      │      2      │
  └──────┬──────┘      └──────┬──────┘
         │                    │
         └────────┬───────────┘
                  │
          ┌───────▼────────┐
          │ /shared/nfs/   │
          │ team-memory/   │
          │  ├─ MEMORY.md  │
          │  └─ patterns.md│
          └────────────────┘
  ↓
Concurrent write risk:
  - No locking → Last-write-wins
  - Recommendation: Coordinate manually or use per-agent subdirectories
```

**Safety measure**: Remote mode REQUIRES explicit directory

**Source**: [20_feature_flag_rollout.md](./20_feature_flag_rollout.md) - Priority 3

---

## Complete Scenario: End-to-End Journey

### New Project → First Memory → Update → Refactor

```
DAY 1, Turn 1: Project initialization
  ├─> Feature enabled (flag default)
  ├─> Directory created: ~/.claude/projects/abc123/memory/
  ├─> No MEMORY.md → Empty state message
  └─> Agent learns about memory system

DAY 1, Turn 5: User request
  User: "Remember we use TypeScript"
  ├─> Agent writes MEMORY.md
  ├─> No permission prompt (bypassed)
  └─> File created: 3 lines, 54 chars

DAY 2, Turn 1: Next session
  ├─> Fresh file read (not cached)
  ├─> Content loaded into system prompt
  ├─> Telemetry: content_length=54, line_count=3
  └─> Agent recalls TypeScript preference

DAY 30, Turn 50: File grows
  ├─> MEMORY.md now 250 lines (exceeded limit)
  ├─> Truncation triggered
  ├─> Warning appended to system prompt
  ├─> Telemetry: was_truncated=true
  └─> Agent sees warning

DAY 30, Turn 51: Agent refactors
  ├─> Creates typescript.md, react.md, testing.md
  ├─> Updates MEMORY.md to be index (30 lines)
  ├─> No permission prompts (3 write operations)
  └─> Next turn: Truncation warning gone

DAY 60: User opens /memory
  ├─> TUI shows 4 files, 0 subdirectories
  ├─> No large file warning (under 40000 chars)
  ├─> User opens MEMORY.md in VS Code
  └─> Reviews and manually organizes content
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
  ↓
Turn 1: tengu_memdir_loaded (if enabled)
Turn 2: tengu_memdir_loaded
Turn 3: tengu_memdir_loaded
...
  ↓
User opens /memory and toggles off
  ↓
  → tengu_auto_memory_toggled { enabled: false }
  ↓
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
- [18_system_reminder_generation.md](./18_system_reminder_generation.md) - Prompt injection
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
2. **Every turn is fresh**: No caching, always read from disk
3. **Dual limits enforced**: 200 lines (hard) + 40000 chars (soft)
4. **Permission bypass**: Auto memory paths auto-approved
5. **Silent error handling**: All errors caught, empty state fallback
6. **Telemetry pervasive**: 3 events track full lifecycle
7. **User control**: TUI toggle, env var, feature flag
8. **Concurrent writes risky**: No locking, last-write-wins

This consolidated lifecycle reference ties together all subsystems into cohesive end-to-end scenarios. 🎯
