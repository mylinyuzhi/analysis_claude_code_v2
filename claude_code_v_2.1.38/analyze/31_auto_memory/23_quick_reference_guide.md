# Auto Memory Quick Reference Guide

## Developer's Cheat Sheet

**Purpose**: Fast lookup for common scenarios, troubleshooting, and key implementation details.

---

## 🔑 Key Constants

| Constant | Value | Purpose | Location |
|----------|-------|---------|----------|
| `MEMORY_MAX_LINES` (Qu1) | 200 | Line limit (hard truncation) | chunks.87.mjs:2312 |
| `MEMORY_FILE_SIZE_WARNING_THRESHOLD` (Cp) | 40000 | Character limit (TUI warning) | chunks.88.mjs:2530 |
| `MEMORY_MD_FILENAME` (Ua, pN9) | "MEMORY.md" | Filename constant | chunks.87.mjs:2229, 2310 |

---

## 🚦 Enable/Disable Quick Check

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
{
  "userSettings": {
    "autoMemoryEnabled": true
  }
}

# Priority 5: Feature flag (gradual rollout)
# Default: false (research preview)
```

### Quick Test

```bash
# Check if enabled
# Start Claude Code and ask: "Do you have auto memory enabled?"

# Check directory exists
ls -la ~/.claude/projects/*/memory/

# Check settings file
cat ~/.claude/settings.json | grep autoMemoryEnabled
```

---

## 📂 Common File Paths

```bash
# Project memory (default)
~/.claude/projects/{hash}/memory/MEMORY.md
~/.claude/projects/{hash}/memory/debugging.md
~/.claude/projects/{hash}/memory/patterns.md

# User settings
~/.claude/settings.json

# Agent memory (multi-agent)
~/.claude/projects/{hash}/memory/agent_{name}/MEMORY.md

# Remote memory (if configured)
$CLAUDE_CODE_REMOTE_MEMORY_DIR/MEMORY.md
```

---

## 🛠️ Common Scenarios

### Scenario 1: Enable Auto Memory

```bash
# Method 1: TUI toggle (recommended)
# 1. Press /memory
# 2. Toggle "Auto-memory" to ON
# 3. Close modal

# Method 2: Environment variable
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=0

# Method 3: Edit settings file
echo '{"userSettings":{"autoMemoryEnabled":true}}' > ~/.claude/settings.json
```

---

### Scenario 2: Disable Auto Memory

```bash
# Method 1: TUI toggle
# 1. Press /memory
# 2. Toggle "Auto-memory" to OFF

# Method 2: Environment variable (highest priority)
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1

# Method 3: Edit settings file
# Set autoMemoryEnabled: false in ~/.claude/settings.json
```

---

### Scenario 3: Inspect Memory Content

```bash
# Read MEMORY.md
cat ~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md

# List all memory files
ls -la ~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/

# Check file size
wc -l ~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
wc -c ~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
```

---

### Scenario 4: Fix "File Too Large" (> 200 lines)

```bash
# Diagnosis
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
LINE_COUNT=$(wc -l < "$MEMORY_PATH")
echo "Line count: $LINE_COUNT (limit: 200)"

# Solution: Refactor into topic files
# 1. Identify sections in MEMORY.md
# 2. Extract sections into topic files (e.g., typescript.md, react.md)
# 3. Update MEMORY.md to be index with links

# Example:
echo "# Project Memory

## Conventions
- [TypeScript Conventions](./typescript.md)
- [React Patterns](./react.md)
- [Testing Guidelines](./testing.md)

## Quick Notes
- Always use ESLint
- Prettier configured
" > "$MEMORY_PATH"
```

---

### Scenario 5: Fix TUI Warning (> 40000 chars)

```bash
# Diagnosis
CHAR_COUNT=$(wc -c < "$MEMORY_PATH")
echo "Character count: $CHAR_COUNT (recommended: < 40000)"

# Solution: Same as Scenario 4 (split into topic files)
# TUI warning doesn't block functionality, but indicates performance risk
```

---

### Scenario 6: Enable Remote Shared Memory

```bash
# Set up shared directory (NFS, SSHFS, etc.)
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/shared/team-memory/

# Verify directory is accessible
ls -la $CLAUDE_CODE_REMOTE_MEMORY_DIR

# Start remote session
claude-code --remote

# All team members use same memory directory
```

---

### Scenario 7: Debug "Memory Not Loading"

```bash
# Checklist:
# 1. Check if enabled
#    Ask agent: "Is auto memory enabled?"

# 2. Check settings file
cat ~/.claude/settings.json | grep autoMemoryEnabled

# 3. Check environment variables
env | grep CLAUDE_CODE_DISABLE_AUTO_MEMORY

# 4. Check file exists and is readable
ls -la ~/.claude/projects/*/memory/MEMORY.md
cat ~/.claude/projects/*/memory/MEMORY.md

# 5. Check file permissions
stat ~/.claude/projects/*/memory/MEMORY.md

# 6. Check for remote mode requirement
#    If running remote session, must set CLAUDE_CODE_REMOTE_MEMORY_DIR

# 7. Enable telemetry logging to see events
export CLAUDE_CODE_TELEMETRY_LOG=1
export CLAUDE_CODE_TELEMETRY_LOG_FILE=/tmp/telemetry.log
# Check for tengu_memdir_loaded or tengu_memdir_disabled events
```

---

### Scenario 8: View Telemetry Events

```bash
# Enable telemetry logging
export CLAUDE_CODE_TELEMETRY_LOG=1
export CLAUDE_CODE_TELEMETRY_LOG_FILE=/tmp/telemetry.log

# Start conversation, send a message

# View logged events
grep "tengu_memdir" /tmp/telemetry.log | jq .

# Expected events:
# - tengu_memdir_loaded (if enabled, every turn)
# - tengu_memdir_disabled (if disabled, every turn)
# - tengu_auto_memory_toggled (when user toggles in TUI)
```

---

## 🔍 Troubleshooting

### Problem: "Memory appears empty but file exists"

**Possible causes**:
1. **File permission error** (most likely)
   ```bash
   # Check permissions
   ls -la ~/.claude/projects/*/memory/MEMORY.md
   # Should be readable (e.g., -rw-r--r--)

   # Fix permissions
   chmod 644 ~/.claude/projects/*/memory/MEMORY.md
   ```

2. **File is a directory** (rare)
   ```bash
   file ~/.claude/projects/*/memory/MEMORY.md
   # Should output: "ASCII text" or "UTF-8 Unicode text"
   # If outputs: "directory", then:
   rm -rf ~/.claude/projects/*/memory/MEMORY.md
   ```

3. **Silent error in reading**
   - Check telemetry log for `content_length: 0, line_count: 0`
   - Indicates read error caught silently

---

### Problem: "Truncation warning every turn"

**Cause**: File exceeds 200 lines

**Solution**:
```bash
# Refactor into topic files (see Scenario 4)
# Keep MEMORY.md as concise index (<200 lines)
```

---

### Problem: "TUI warning about large file"

**Cause**: File exceeds 40000 characters

**Solution**:
```bash
# Same as truncation: split into topic files
# TUI warning is informational, doesn't block functionality
```

---

### Problem: "Changes not appearing next turn"

**Possible causes**:
1. **File write failed** (permission denied)
   ```bash
   # Check directory permissions
   ls -lad ~/.claude/projects/*/memory/
   # Should be writable (e.g., drwxr-xr-x)
   ```

2. **Wrong file path** (agent wrote to different location)
   ```bash
   # Search for MEMORY.md files
   find ~/.claude -name "MEMORY.md"
   ```

3. **Remote mode but no directory set**
   ```bash
   # If running remote session, must set:
   export CLAUDE_CODE_REMOTE_MEMORY_DIR=/path/to/dir/
   ```

---

### Problem: "Concurrent writes losing data"

**Cause**: No locking mechanism (last-write-wins)

**Solution**:
```bash
# Option 1: Use separate memory directories per agent (default)
# Option 2: Coordinate writes manually (e.g., assign topic files per agent)
# Option 3: Use version control (git) for memory directory
cd ~/.claude/projects/*/memory/
git init
git add MEMORY.md
git commit -m "Initial memory"
# Resolve conflicts manually when they occur
```

---

## 📊 Telemetry Events Reference

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

**Use cases**:
- Track file growth over time
- Calculate truncation rate
- Monitor directory structure adoption

---

### Event 2: `tengu_auto_memory_toggled`

**When**: User toggles in TUI `/memory` modal

**Payload**:
```javascript
{
  enabled: boolean   // true=ON, false=OFF
}
```

**Use cases**:
- Track adoption rate
- Identify churn (users who disable after enabling)
- Measure toggle frequency

---

### Event 3: `tengu_memdir_disabled`

**When**: Every turn (if auto memory disabled)

**Payload**:
```javascript
{
  disabled_by_env_var: boolean,   // CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
  disabled_by_setting: boolean    // userSettings.autoMemoryEnabled=false
}
```

**Use cases**:
- Understand why users don't adopt
- Detect corporate policy enforcement (env var)
- Track feature flag coverage

---

## 🎯 Code Locations Quick Reference

### Core Functions

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `isAutoMemoryEnabled` | y2 | chunks.87.mjs:2194-2221 | 5-level priority check |
| `getAutoMemoryDirectory` | mu1 | chunks.87.mjs:2213 | Resolve directory path |
| `getMemoryContext` | F0A | chunks.87.mjs:2299 | Main entry point |
| `buildMemoryPrompt` | m0A | chunks.87.mjs:2257 | Build system prompt section |
| `isAutoMemoryPath` | Fu1 | chunks.87.mjs:2223 | Permission validator |
| `recordMemoryDirLoadMetrics` | cN9 | chunks.87.mjs:2240 | Telemetry collector |
| `getLargeMemoryFiles` | DK1 | chunks.88.mjs:2439 | TUI warning detector |
| `memoryEditorModal` | toY | chunks.155.mjs:714 | TUI modal component |
| `updateUserSettings` | Z7 | chunks.40.mjs:849 | Settings persistence |

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

## 🧪 Verification Commands

### Test 1: Feature Enabled?

```bash
# Start Claude Code and ask:
# "Do you have an 'auto memory' section in your system prompt?"
# Expected: Yes (if enabled) / No (if disabled)
```

---

### Test 2: Directory Exists?

```bash
ls -la ~/.claude/projects/*/memory/
# Expected: Directory exists with MEMORY.md file
```

---

### Test 3: File Within Limits?

```bash
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md

# Check line count
LINE_COUNT=$(wc -l < "$MEMORY_PATH")
echo "Lines: $LINE_COUNT / 200"

# Check character count
CHAR_COUNT=$(wc -c < "$MEMORY_PATH")
echo "Characters: $CHAR_COUNT / 40000"
```

---

### Test 4: Permission Bypass Works?

```bash
# In conversation, ask agent:
# "Create a MEMORY.md file with content: # Test"

# Expected: No permission prompt appears

# Verify:
cat ~/.claude/projects/*/memory/MEMORY.md
# Expected: Contains "# Test"
```

---

### Test 5: Telemetry Logging?

```bash
export CLAUDE_CODE_TELEMETRY_LOG=1
export CLAUDE_CODE_TELEMETRY_LOG_FILE=/tmp/telemetry.log

# Start conversation, send message

# Check log
grep "tengu_memdir_loaded" /tmp/telemetry.log | tail -1 | jq .
# Expected: Event with payload
```

---

## 📚 Documentation Index

### Phase 4 - Detailed Implementation
- **[15_write_edit_integration.md](./15_write_edit_integration.md)** - Permission flow, concurrent access (17KB)
- **[16_error_handling_recovery.md](./16_error_handling_recovery.md)** - Dual limits, error paths (18KB)
- **[17_tui_integration.md](./17_tui_integration.md)** - TUI modal, settings toggle (16KB)
- **[18_system_reminder_generation.md](./18_system_reminder_generation.md)** - Prompt injection (16KB)
- **[19_telemetry_monitoring.md](./19_telemetry_monitoring.md)** - Analytics events (17KB)
- **[20_feature_flag_rollout.md](./20_feature_flag_rollout.md)** - 5-level priority (15KB)
- **[21_implementation_vs_official_docs.md](./21_implementation_vs_official_docs.md)** - Discrepancies (16KB)
- **[22_complete_lifecycle_consolidated.md](./22_complete_lifecycle_consolidated.md)** - End-to-end flows (19KB)

### Phase 1-3 - Foundational Documentation
- [architecture.md](./architecture.md) - System overview
- [loading_mechanism.md](./loading_mechanism.md) - Loading algorithm
- [usage_patterns.md](./usage_patterns.md) - Best practices
- [multi_agent_memory.md](./multi_agent_memory.md) - Isolation strategies
- [remote_memory_sync.md](./remote_memory_sync.md) - Distributed setups
- [topic_file_templates.md](./topic_file_templates.md) - Reusable templates
- [memory_maintenance.md](./memory_maintenance.md) - Refactoring workflows

---

## 🎓 Best Practices Summary

### DO:
- ✅ Keep MEMORY.md concise (<200 lines)
- ✅ Use topic files for detailed content
- ✅ Organize semantically, not chronologically
- ✅ Use Write/Edit tools to update memory
- ✅ Verify against project docs before writing
- ✅ Save stable patterns confirmed across sessions

### DON'T:
- ❌ Put session-specific state in memory
- ❌ Exceed 200 lines (triggers truncation)
- ❌ Exceed 40000 chars (triggers TUI warning)
- ❌ Write speculative conclusions
- ❌ Duplicate CLAUDE.md instructions
- ❌ Forget to refactor when warned

---

## 🔗 Quick Links

- **Symbol Index**: [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
- **Official Docs**: https://code.claude.com/docs/llms.txt
- **GitHub**: https://github.com/anthropics/claude-code

---

**Last Updated**: 2024-02-14 (Claude Code v2.1.38)

**Documentation Coverage**: 95%+

**Quick Help**: For detailed analysis, see individual Phase 4 files (15-22). For quick lookup, use this guide. 🚀
