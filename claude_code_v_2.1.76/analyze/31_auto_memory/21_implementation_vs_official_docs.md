# Implementation vs Official Documentation Comparison

## Overview

This document catalogs discrepancies between the source code implementation and the official documentation for auto memory. Understanding these differences is critical for accurate system understanding and avoiding incorrect assumptions based solely on documentation.

**Key insight**: The implementation contains several undocumented behaviors, dual-limit systems, and edge cases that are not mentioned in official documentation.

---

## Methodology

### Official Documentation Sources

1. **Official LLMs.txt**: https://code.claude.com/docs/llms.txt
2. **GitHub README**: https://github.com/anthropics/claude-code
3. **In-product help**: `/help` command output
4. **System prompt**: Dynamic "auto memory" section shown to LLM

### Source Code Analysis

- **Primary location**: chunks.87.mjs (lines 2194-2312)
- **Secondary locations**: chunks.155.mjs, chunks.169.mjs, chunks.174.mjs, chunks.88.mjs, chunks.160.mjs
- **Version**: Claude Code v2.1.38

---

## Discrepancy 1: Dual File Size Limits

### What Official Docs Say

**Official documentation** (system prompt):
```markdown
`MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated, so keep it concise
```

**Implication**: Only one limit exists (200 lines)

### What Implementation Does

**Implementation** (chunks.87.mjs + chunks.88.mjs):
```javascript
// Limit 1: Line limit (hard truncation)
const MEMORY_MAX_LINES = 200; // chunks.87.mjs:2312
if (lines.length > 200) {
  // Truncate to 200 lines + append warning
}

// Limit 2: Character limit (soft warning)
const MEMORY_FILE_SIZE_WARNING_THRESHOLD = 40000; // chunks.88.mjs:2530
if (content.length > 40000) {
  // Display TUI warning banner
}
```

### Discrepancy Details

| Aspect | Official Docs | Implementation |
|--------|---------------|----------------|
| **Limits mentioned** | 1 limit (200 lines) | 2 limits (200 lines + 40000 chars) |
| **Line limit enforcement** | Truncation | ✅ Matches - Truncation with warning |
| **Character limit** | Not mentioned | ⚠️ Missing - TUI warning banner |
| **Warning format** | Not shown | ⚠️ Missing - Specific message template |

**Impact**: Users may create files that pass the line limit but trigger TUI warnings

**Why this matters**:
- Files with long lines (e.g., minified JSON) can be under 200 lines but over 40000 chars
- TUI performance degrades with large files, even if lines are within limit
- Users unaware of character limit may be confused by TUI warnings

**Recommendation**: Add character limit to official documentation

---

## Discrepancy 2: Permission System Bypass

### What Official Docs Say

**Official documentation**: (No mention of permission system)

**Implication**: Users might assume Write/Edit tools require permission prompts

### What Implementation Does

**Implementation** (chunks.174.mjs:933-940):
```javascript
// Write tool permission validator
if (isAutoMemoryPath(filePath)) {
  return {
    decision: "allow",
    reason: "auto memory files are allowed"
  };
}
// NO user prompt displayed
```

### Discrepancy Details

| Aspect | Official Docs | Implementation |
|--------|---------------|----------------|
| **Permission prompts** | Not mentioned | ⚠️ Bypassed for auto memory paths |
| **Auto-approval reason** | Not documented | ⚠️ "auto memory files are allowed" |
| **Security implications** | Not discussed | ⚠️ Agent can write freely within memory dir |

**Impact**: Agents can modify memory files without user confirmation

**Why this matters**:
- Users may not realize agents have unrestricted write access to memory directory
- Malicious prompts could potentially abuse this (though limited to memory directory)
- Transparency: Users should be informed of permission bypass

**Recommendation**: Document permission bypass behavior in official docs

**Security note**: Permission bypass is **safe by design** because:
- Memory directory is scoped to project
- Directory path is user-controlled (via `CLAUDE_CODE_REMOTE_MEMORY_DIR` or default)
- Content doesn't execute code
- Similar to how agents can freely edit project files

---

## Discrepancy 3: Error Handling is Silent

### What Official Docs Say

**Official documentation**: (No mention of error handling)

**Implication**: Users might assume errors would be surfaced

### What Implementation Does

**Implementation** (chunks.87.mjs:2263-2271):
```javascript
// Directory creation error - silent
try {
  fs.mkdirSync(memoryDir, { recursive: true });
} catch {
  // Silent failure
}

// File read error - returns empty state
try {
  const content = fs.readFileSync(memoryPath, "utf8");
} catch {
  return emptyStateMessage;
}
```

### Discrepancy Details

| Error Type | Official Docs | Implementation |
|------------|---------------|----------------|
| **Directory creation fails** | Not mentioned | ⚠️ Silent failure, continues |
| **File read fails** | Not mentioned | ⚠️ Returns empty state message |
| **Permission denied** | Not mentioned | ⚠️ Silent, shows empty state |
| **I/O errors** | Not mentioned | ⚠️ Silent, shows empty state |

**Impact**: Users may not know when memory system encounters errors

**Why this matters**:
- File permissions issues go unnoticed
- Disk full errors are silent
- Users may think memory is empty when actually file is unreadable

**Example scenario**:
```bash
# User creates MEMORY.md but accidentally removes read permissions
chmod 000 ~/.claude/projects/*/memory/MEMORY.md

# Agent sees: "Your MEMORY.md is currently empty..."
# User thinks: "Why isn't my memory being saved?"
# Actual issue: File exists but is unreadable (silent permission error)
```

**Recommendation**: Add error visibility or diagnostic mode

**Alternative approaches** (not implemented):
- Log errors to `~/.claude/logs/` for debugging
- Show error count in TUI footer (e.g., "Auto memory: 3 errors")
- Add diagnostic command (e.g., `/memory --check`)

---

## Discrepancy 4: Telemetry Tracking

### What Official Docs Say

**Official documentation**: (No mention of telemetry)

**Implication**: Users may not know usage is tracked

### What Implementation Does

**Implementation** (chunks.87.mjs:2282-2287, chunks.155.mjs:565-567):
```javascript
// Event 1: Memory loaded (every turn)
recordTelemetryEvent("tengu_memdir_loaded", {
  content_length, line_count, was_truncated,
  memory_type, total_file_count, total_subdir_count
});

// Event 2: Toggle action
recordTelemetryEvent("tengu_auto_memory_toggled", {
  enabled: newValue
});

// Event 3: Disabled state
recordTelemetryEvent("tengu_memdir_disabled", {
  disabled_by_env_var, disabled_by_setting
});
```

### Discrepancy Details

| Aspect | Official Docs | Implementation |
|--------|---------------|----------------|
| **Telemetry events** | Not mentioned | ⚠️ 3 events tracked |
| **Data collected** | Not mentioned | ⚠️ File sizes, counts, toggle actions |
| **Privacy implications** | Not discussed | ⚠️ Metadata tracked (not content) |
| **Opt-out** | Not documented | ⚠️ No standard telemetry opt-out applies |

**Impact**: Users unaware that memory usage is tracked

**Why this matters**:
- **Privacy transparency**: Users should know what data is collected
- **Product analytics**: Telemetry enables feature improvements
- **Compliance**: Some jurisdictions require disclosure of telemetry

**What IS tracked**:
- ✅ File sizes (character count, line count)
- ✅ Directory structure (file count, subdirectory count)
- ✅ Truncation events (how often limit exceeded)
- ✅ Toggle actions (enable/disable frequency)

**What is NOT tracked**:
- ❌ File content (memory content remains private)
- ❌ File names (topic file names not logged)
- ❌ Identifiable information (beyond standard telemetry)

**Recommendation**: Add telemetry disclosure to official docs and privacy policy

---

## Discrepancy 5: Feature Flag Priority Chain

### What Official Docs Say

**Official documentation** (mentioned):
```
You can disable auto memory by setting CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

**Implication**: Only environment variable controls feature

### What Implementation Does

**Implementation** (chunks.87.mjs:2194-2221):
```javascript
function isAutoMemoryEnabled() {
  // Priority 1: Explicit env var disable
  if (process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY === "1") return false;

  // Priority 2: Explicit env var enable
  if (process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY === "0") return true;

  // Priority 3: Remote mode requires explicit directory
  if (isRemoteMode() && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return false;

  // Priority 4: User setting preference
  if (userSettings.autoMemoryEnabled !== undefined) return userSettings.autoMemoryEnabled;

  // Priority 5: Feature flag default
  return getFeatureFlag("tengu_oboe");
}
```

### Discrepancy Details

| Aspect | Official Docs | Implementation |
|--------|---------------|----------------|
| **Control mechanisms** | 1 (env var) | ⚠️ 5 priority levels |
| **User setting** | Not mentioned | ⚠️ TUI toggle persists preference |
| **Remote mode check** | Mentioned separately | ⚠️ Integrated into priority chain |
| **Feature flag** | Not mentioned | ⚠️ Codename "tengu_oboe" |
| **Enable via env var** | Not documented | ⚠️ `DISABLE=0` enables |

**Impact**: Users may not know about TUI toggle or feature flag control

**Why this matters**:
- **User control**: TUI toggle is primary user-facing control
- **Gradual rollout**: Feature flag enables cohort-based deployment
- **Corporate policy**: Env var enables organization-wide disable
- **Remote mode**: Implicit disable if no directory specified

**Example scenario**:
```bash
# User expects this to enable:
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=0

# But official docs only mention:
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1  # Disable

# The enable behavior (=0) is undocumented
```

**Recommendation**: Document full priority chain and all control mechanisms

---

## Discrepancy 6: Remote Mode Requirements

### What Official Docs Say

**Official documentation** (mentioned):
```
Set CLAUDE_CODE_REMOTE_MEMORY_DIR to specify a shared memory directory for remote/distributed setups
```

**Implication**: Environment variable is optional (for advanced use cases)

### What Implementation Does

**Implementation** (chunks.87.mjs:2210-2212):
```javascript
// If remote mode but no directory specified, DISABLE auto memory
if (isRemoteMode() && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
  return false;  // Auto memory disabled
}
```

### Discrepancy Details

| Aspect | Official Docs | Implementation |
|--------|---------------|----------------|
| **Remote mode behavior** | "Specify directory" | ⚠️ Directory REQUIRED, not optional |
| **Default behavior** | Not specified | ⚠️ Auto memory disabled if no dir |
| **Error message** | Not mentioned | ⚠️ No error, silently disabled |

**Impact**: Users in remote mode may not realize why auto memory is disabled

**Why this matters**:
- **Intentionality**: Forces users to explicitly opt-in for remote memory
- **Safety**: Prevents accidental writes to local paths in remote context
- **Transparency**: No error message explains why feature is disabled

**Example scenario**:
```bash
# User starts remote session
# Assumes auto memory works automatically
# Reality: Auto memory is disabled (no directory specified)

# Agent sees: (no auto memory section in system prompt)
# User thinks: "Why isn't auto memory working?"
# Actual issue: Remote mode requires explicit directory
```

**Recommendation**:
- Add error message or TUI notification explaining requirement
- Document remote mode behavior more clearly
- Consider default to user home directory (with warning)

---

## Summary Table

### All Discrepancies at a Glance

| # | Discrepancy | Official Docs | Implementation | Impact | Severity |
|---|-------------|---------------|----------------|--------|----------|
| 1 | **Dual file size limits** | 200-line limit only | 200-line + 40000-char limits | TUI warnings not explained | Medium |
| 2 | **Permission bypass** | Not mentioned | Auto memory paths bypass prompts | Users unaware of auto-approval | Medium |
| 3 | **Silent error handling** | Not mentioned | All errors caught, empty state shown | Errors go unnoticed | High |
| 4 | **Telemetry tracking** | Not mentioned | 3 events tracked every turn/toggle | Privacy disclosure gap | Medium |
| 5 | **Feature flag priority** | Env var only | 5-level priority chain | Users miss TUI toggle option | High |
| 6 | **Remote mode requirement** | Directory optional | Directory REQUIRED or disabled | Silent disable confuses users | High |

**Severity definitions**:
- **High**: Behavior significantly differs, causes user confusion or errors
- **Medium**: Important detail omitted, but discoverable through use
- **Low**: Minor implementation detail, minimal user impact

---

## Verification Against Official Docs

### Test 1: Verify Dual Limits (Discrepancy #1)

**Setup**:
```bash
# Create file with 50 lines, 50000 characters (long lines)
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
for i in {1..50}; do
  printf "# Line %d: %s\n" "$i" "$(yes "x" | head -980 | tr -d '\n')"
done > "$MEMORY_PATH"
```

**Official docs prediction**: File within 200-line limit, no warnings

**Implementation reality**:
- System prompt: No truncation (50 < 200 lines)
- TUI: ⚠️ Warning banner (50000 > 40000 chars)

**Result**: ✅ Confirms discrepancy #1

---

### Test 2: Verify Permission Bypass (Discrepancy #2)

**Steps**:
1. Ask agent: "Create MEMORY.md with content: # Test"
2. Observe permission prompt

**Official docs prediction**: No explicit behavior documented

**Implementation reality**: No permission prompt (bypassed)

**Result**: ✅ Confirms discrepancy #2

---

### Test 3: Verify Silent Errors (Discrepancy #3)

**Setup**:
```bash
# Create unreadable MEMORY.md
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
echo "# Secret content" > "$MEMORY_PATH"
chmod 000 "$MEMORY_PATH"
```

**Official docs prediction**: No explicit error handling documented

**Implementation reality**: Agent sees "Your MEMORY.md is currently empty" (silent error)

**Result**: ✅ Confirms discrepancy #3

---

### Test 4: Verify Telemetry (Discrepancy #4)

**Setup**:
```bash
export CLAUDE_CODE_TELEMETRY_LOG=1
export CLAUDE_CODE_TELEMETRY_LOG_FILE=/tmp/telemetry.log
```

**Steps**:
1. Start conversation, send message
2. Check telemetry log

**Official docs prediction**: No telemetry mentioned

**Implementation reality**:
```bash
grep "tengu_memdir_loaded" /tmp/telemetry.log
# Output: Event logged with full payload
```

**Result**: ✅ Confirms discrepancy #4

---

### Test 5: Verify Feature Flag Priority (Discrepancy #5)

**Steps**:
1. No env var, no user setting
2. Check if auto memory is enabled

**Official docs prediction**: Env var is only control mechanism

**Implementation reality**:
- Feature flag "tengu_oboe" determines default
- User can toggle via `/memory` (Priority 4)
- Env var is just one of 5 priorities

**Result**: ✅ Confirms discrepancy #5

---

### Test 6: Verify Remote Mode Requirement (Discrepancy #6)

**Steps**:
1. Start remote session without `CLAUDE_CODE_REMOTE_MEMORY_DIR`
2. Ask agent if auto memory is enabled

**Official docs prediction**: Directory is optional for remote setups

**Implementation reality**: Auto memory disabled (directory REQUIRED)

**Result**: ✅ Confirms discrepancy #6

---

## Recommendations for Official Docs

### High Priority Updates

1. **Document dual file size limits**:
   ```markdown
   MEMORY.md has two limits:
   - Line limit: 200 lines (hard truncation with warning)
   - Character limit: 40000 characters (TUI performance warning)
   ```

2. **Document silent error handling**:
   ```markdown
   If MEMORY.md cannot be read (permissions, I/O errors), the system
   silently shows an empty state message. Check file permissions if
   memory appears empty unexpectedly.
   ```

3. **Document feature flag priority chain**:
   ```markdown
   Auto memory can be controlled via (in priority order):
   1. CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 (disable)
   2. CLAUDE_CODE_DISABLE_AUTO_MEMORY=0 (enable)
   3. Remote mode (requires CLAUDE_CODE_REMOTE_MEMORY_DIR)
   4. User setting (toggle via /memory command)
   5. Feature flag default (research preview)
   ```

4. **Document remote mode requirement**:
   ```markdown
   In remote mode, auto memory is DISABLED by default unless
   CLAUDE_CODE_REMOTE_MEMORY_DIR is explicitly set. This is a safety
   measure to prevent unintended local writes.
   ```

### Medium Priority Updates

5. **Document permission bypass**:
   ```markdown
   Auto memory files bypass permission prompts. Agents can freely
   read and write files within the memory directory without user
   confirmation (similar to project files).
   ```

6. **Document telemetry**:
   ```markdown
   Auto memory usage metrics are tracked (file sizes, toggle actions,
   disable reasons). File content is never logged. Standard Claude Code
   telemetry opt-out applies.
   ```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions analyzed:
- `isAutoMemoryEnabled` (y2) - Feature flag priority chain
- `buildMemoryPrompt` (m0A) - Truncation and error handling
- `getLargeMemoryFiles` (DK1) - Character limit detection
- `recordMemoryDirLoadMetrics` (cN9) - Telemetry collection

---

## Key Takeaways

1. **Implementation is richer than docs**: Multiple undocumented behaviors exist
2. **Dual limits system**: Line limit (docs) + character limit (undocumented)
3. **Silent error handling**: All errors caught, may confuse users
4. **Privacy gap**: Telemetry tracking not disclosed in docs
5. **Complex priority chain**: 5 levels vs 1 documented control mechanism
6. **Remote mode strictness**: Directory required, not optional

**Why these discrepancies exist**:
- **Rapid iteration**: Implementation evolves faster than documentation
- **Research preview status**: Features stabilize before comprehensive docs
- **Internal telemetry**: Analytics infrastructure not user-facing
- **Safety defaults**: Remote mode requirement added for security

**Impact on users**:
- ⚠️ **Confusion**: Unexpected behaviors (TUI warnings, silent disables)
- ⚠️ **Discovery**: Users miss TUI toggle option
- ⚠️ **Debugging**: Silent errors make troubleshooting difficult
- ✅ **Safety**: Conservative defaults prevent data loss

**Recommendation**: Update official docs to match implementation before exiting research preview.
