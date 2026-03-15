# Auto Memory Quick Reference Guide

## Developer's Cheat Sheet

**Purpose**: Fast lookup for common scenarios, troubleshooting, and key implementation details.

**Version**: Claude Code v2.1.76

---

## Key Constants

| Constant | Value | Purpose | Location |
|----------|-------|---------|----------|
| `MEMORY_MAX_LINES` (Qu1) | 200 | Line limit (hard truncation) | chunks.87.mjs:2312 |
| `MEMORY_FILE_SIZE_WARNING_THRESHOLD` (Cp) | 40000 | Character limit (TUI warning) | chunks.88.mjs:2530 |
| `MEMORY_MD_FILENAME` (Ua, pN9) | "MEMORY.md" | Filename constant | chunks.87.mjs:2229, 2310 |

---

## Enable/Disable Quick Check

### Priority Chain (Highest to Lowest)

```bash
# Priority 1: Force disable (highest)
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1

# Priority 2: Force enable (overrides flag/setting)
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=0

# Priority 3: Remote mode (requires directory)
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/path/to/shared/memory/

# Priority 4: User setting (TUI toggle)
# Stored in: ~/.claude/settings.json
# {
#   "userSettings": {
#     "autoMemoryEnabled": true,
#     "autoMemoryDirectory": "/custom/path/"  # v2.1.59
#   }
# }

# Priority 5: Feature flag (gradual rollout)
# Default: false (research preview)
```

### Quick Test

```bash
# Check if enabled (ask agent)
# "Do you have auto memory enabled?"

# Check directory exists
ls -la ~/.claude/projects/*/memory/

# Check settings file
cat ~/.claude/settings.json | grep -E "autoMemory"
```

---

## Common File Paths

```bash
# Project memory (default — hash-based)
~/.claude/projects/{hash}/memory/MEMORY.md
~/.claude/projects/{hash}/memory/debugging.md
~/.claude/projects/{hash}/memory/patterns.md

# Custom directory (v2.1.59 — if autoMemoryDirectory is set)
{autoMemoryDirectory}/MEMORY.md

# Remote memory (if CLAUDE_CODE_REMOTE_MEMORY_DIR is set)
$CLAUDE_CODE_REMOTE_MEMORY_DIR/projects/{hash}/memory/MEMORY.md

# User settings
~/.claude/settings.json
```

---

## Common Scenarios

### Scenario 1: Enable Auto Memory

```bash
# Method 1: TUI toggle (recommended)
# 1. Press /memory
# 2. Toggle "Auto-memory" to ON
# 3. Close modal

# Method 2: Environment variable
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=0

# Method 3: Edit settings file
# Set "autoMemoryEnabled": true in ~/.claude/settings.json
```

---

### Scenario 2: Disable Auto Memory

```bash
# Method 1: TUI toggle
# 1. Press /memory
# 2. Toggle "Auto-memory" to OFF

# Method 2: Environment variable (highest priority)
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

---

### Scenario 3: Set Custom Memory Directory (v2.1.59)

```bash
# Set a fixed directory for all projects
# Edit ~/.claude/settings.json:
# {
#   "userSettings": {
#     "autoMemoryEnabled": true,
#     "autoMemoryDirectory": "/team-share/memory/"
#   }
# }

# Benefit: All Claude Code instances with the same setting
# share memory without needing a project hash.
```

---

### Scenario 4: Enable Remote Shared Memory

```bash
# Set up shared directory (NFS, SSHFS, Dropbox, etc.)
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/shared/team-memory/

# Verify directory is accessible
ls -la $CLAUDE_CODE_REMOTE_MEMORY_DIR

# Start Claude Code
claude
# All agents with same cwd will resolve to same memory directory
```

---

### Scenario 5: Fix "File Too Large" (> 200 lines)

```bash
# Diagnosis
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
LINE_COUNT=$(wc -l < "$MEMORY_PATH")
echo "Line count: $LINE_COUNT (limit: 200)"

# Solution: Refactor into topic files
# 1. Identify verbose sections in MEMORY.md
# 2. Create topic files (typescript.md, react.md, etc.)
# 3. Replace verbose sections with concise links:
#    - TypeScript conventions -> [typescript.md](typescript.md)
```

---

### Scenario 6: Fix TUI Warning (> 40000 chars)

```bash
# Diagnosis
CHAR_COUNT=$(wc -c < "$MEMORY_PATH")
echo "Character count: $CHAR_COUNT (recommended: < 40000)"

# Solution: Same as Scenario 5 (split into topic files)
# TUI warning is informational - doesn't block functionality
```

---

### Scenario 7: Debug "Memory Not Loading"

```bash
# Checklist:
# 1. Check if enabled
cat ~/.claude/settings.json | grep autoMemoryEnabled

# 2. Check environment variables
env | grep CLAUDE_CODE_DISABLE_AUTO_MEMORY

# 3. Check file exists and is readable
ls -la ~/.claude/projects/*/memory/MEMORY.md
cat ~/.claude/projects/*/memory/MEMORY.md

# 4. Check file permissions
stat ~/.claude/projects/*/memory/MEMORY.md

# 5. Check for remote mode requirement
#    If running remote session, must set CLAUDE_CODE_REMOTE_MEMORY_DIR

# 6. Enable telemetry logging to see events
export CLAUDE_CODE_TELEMETRY_LOG=1
export CLAUDE_CODE_TELEMETRY_LOG_FILE=/tmp/telemetry.log
# Check for tengu_memdir_loaded or tengu_memdir_disabled events
grep "tengu_memdir" /tmp/telemetry.log | jq .
```

---

### Scenario 8: Understand Freshness (v2.1.74)

In v2.1.76, the memory prompt header includes a `Last updated` timestamp:

```markdown
Last updated: 2026-01-15T09:22:15.000Z

## MEMORY.md

# Project Conventions
...
```

```bash
# Check file modification time
stat ~/.claude/projects/*/memory/MEMORY.md

# If timestamp is very old (months), ask agent to review memory
# Agent guidance:
# - < 1 week: Trust memory, no review needed
# - 1-4 weeks: Minor updates may be warranted
# - > 1 month: Suggest review of entries
```

---

## Telemetry Events Reference

### Event 1: `tengu_memdir_loaded`

**When**: Every turn (if auto memory enabled)

**Payload**:
```javascript
{
  content_length: number,      // Character count
  line_count: number,          // Line count
  was_truncated: boolean,      // > 200 lines?
  memory_type: "auto" | "agent",
  total_file_count: number,    // Files in directory
  total_subdir_count: number   // Subdirectories
}
```

### Event 2: `tengu_auto_memory_toggled`

**When**: User toggles in TUI `/memory` modal

**Payload**: `{ enabled: boolean }`

### Event 3: `tengu_memdir_disabled`

**When**: Every turn (if auto memory disabled)

**Payload**: `{ disabled_by_env_var: boolean, disabled_by_setting: boolean }`

---

## Code Locations Quick Reference

### Core Functions

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `isAutoMemoryEnabled` | y2 | chunks.87.mjs:2194-2221 | 5-level priority check |
| `getAutoMemoryDirectory` | mu1 | chunks.87.mjs:2213 | Resolve directory path (v2.1.59: checks autoMemoryDirectory first) |
| `getMemoryContext` | F0A | chunks.87.mjs:2299 | Main entry point |
| `buildMemoryPrompt` | m0A | chunks.87.mjs:2257 | Build system prompt section (v2.1.74: adds timestamp) |
| `isAutoMemoryPath` | Fu1 | chunks.87.mjs:2223 | Permission validator |
| `recordMemoryDirLoadMetrics` | cN9 | chunks.87.mjs:2240 | Telemetry collector |
| `getLargeMemoryFiles` | DK1 | chunks.88.mjs:2439 | TUI warning detector |
| `memoryEditorModal` | toY | chunks.155.mjs:714 | TUI modal component |
| `updateUserSettings` | Z7 | chunks.40.mjs:849 | Settings persistence |
| `getHomeDirectory` | ga | chunks.87.mjs:2204-2207 | Remote memory override |

### Permission Validators

```javascript
// Write tool (chunks.174.mjs:933-940)
if (isAutoMemoryPath(filePath)) {
  return { decision: "allow", reason: "auto memory files are allowed" };
}

// Read tool (chunks.174.mjs:1034-1040)
if (isAutoMemoryPath(filePath)) {
  return { decision: "allow", reason: "auto memory files are allowed" };
}
```

### Dynamic Variable Registration

```javascript
// chunks.169.mjs:246
registerDynamicVariable(
  "auto_memory",
  () => getMemoryContext(),
  "MEMORY.md is read from disk each turn"
);
```

---

## Troubleshooting

### Problem: "Memory appears empty but file exists"

**Most likely cause**: File permission error

```bash
# Check permissions
ls -la ~/.claude/projects/*/memory/MEMORY.md
# Should be readable (e.g., -rw-r--r--)

# Fix permissions
chmod 644 ~/.claude/projects/*/memory/MEMORY.md
```

### Problem: "Truncation warning every turn"

**Cause**: File exceeds 200 lines

**Solution**: Refactor into topic files. Keep MEMORY.md as concise index (<200 lines).

### Problem: "Changes not appearing next turn"

**Possible causes**:
1. File write failed (permission denied) — check directory permissions
2. Wrong file path — agent may have written to different location
3. Remote mode without directory set

### Problem: "Concurrent writes losing data"

**Cause**: No locking mechanism (last-write-wins)

**Solutions**:
- Use separate topic files per agent (architecture.md, debugging.md)
- Coordinate writes manually
- Use custom `autoMemoryDirectory` per agent role (v2.1.59)

### Problem: "Custom directory not taking effect" (v2.1.59)

```bash
# Verify settings file
cat ~/.claude/settings.json | jq '.userSettings.autoMemoryDirectory'

# Ensure autoMemoryEnabled is also true
cat ~/.claude/settings.json | jq '.userSettings.autoMemoryEnabled'

# Verify the directory exists
ls -la $(cat ~/.claude/settings.json | jq -r '.userSettings.autoMemoryDirectory')
```

---

## Best Practices Summary

**DO**:
- Keep MEMORY.md concise (<200 lines)
- Use topic files for detailed content
- Organize semantically, not chronologically
- Use Write/Edit tools to update memory
- Verify against project docs before writing
- Save stable patterns confirmed across sessions
- Use `autoMemoryDirectory` for team-shared memory (v2.1.59)
- Check `Last updated` timestamp for freshness (v2.1.74)

**DON'T**:
- Put session-specific state in memory
- Exceed 200 lines (triggers truncation)
- Exceed 40000 chars (triggers TUI warning)
- Write speculative conclusions
- Duplicate CLAUDE.md instructions
- Forget to refactor when warned

---

## Documentation Index

### Phase 4 - Detailed Implementation
- **[15_write_edit_integration.md](./15_write_edit_integration.md)** - Permission flow, concurrent access
- **[16_error_handling_recovery.md](./16_error_handling_recovery.md)** - Dual limits, error paths
- **[17_tui_integration.md](./17_tui_integration.md)** - TUI modal, settings toggle
- **[18_system_reminder_generation.md](./18_system_reminder_generation.md)** - Prompt injection, hot-reload
- **[19_telemetry_monitoring.md](./19_telemetry_monitoring.md)** - Analytics events
- **[20_feature_flag_rollout.md](./20_feature_flag_rollout.md)** - 5-level priority
- **[21_implementation_vs_official_docs.md](./21_implementation_vs_official_docs.md)** - Discrepancies
- **[22_complete_lifecycle_consolidated.md](./22_complete_lifecycle_consolidated.md)** - End-to-end flows

### Phase 1-3 - Foundational Documentation
- [README.md](./README.md) - Module overview
- [architecture.md](./architecture.md) - System overview
- [loading_mechanism.md](./loading_mechanism.md) - Loading algorithm
- [usage_patterns.md](./usage_patterns.md) - Best practices
- [multi_agent_memory.md](./multi_agent_memory.md) - Isolation strategies
- [remote_memory_sync.md](./remote_memory_sync.md) - Distributed setups
- [topic_file_templates.md](./topic_file_templates.md) - Reusable templates
- [memory_maintenance.md](./memory_maintenance.md) - Refactoring workflows

---

## Quick Links

- **Symbol Index**: [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
- **Official Docs**: https://code.claude.com/docs/llms.txt
- **GitHub**: https://github.com/anthropics/claude-code

---

**Last Updated**: 2026-03-15 (Claude Code v2.1.76)

**Documentation Coverage**: 95%+

**Quick Help**: For detailed analysis, see individual Phase 4 files (15-22). For quick lookup, use this guide.
