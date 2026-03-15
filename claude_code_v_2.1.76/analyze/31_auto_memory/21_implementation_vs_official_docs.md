# Implementation vs Official Documentation Comparison

## Overview

This document catalogs discrepancies between the source code implementation and the official documentation for auto memory. Understanding these differences is critical for accurate system understanding and avoiding incorrect assumptions based solely on documentation.

**Key insight**: The implementation contains several undocumented behaviors, dual-limit systems, and edge cases that are not mentioned in official documentation.

**Version**: Claude Code v2.1.76

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
- **Version**: Claude Code v2.1.76

---

## Discrepancy 1: Dual File Size Limits

### What Official Docs Say

**Official documentation** (system prompt):
```markdown
`MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated, so keep it concise
```

**Implication**: Only one limit exists (200 lines)

### What Implementation Does

```javascript
// Limit 1: Line limit (hard truncation)
const MEMORY_MAX_LINES = 200; // chunks.87.mjs:2312
if (lines.length > 200) { /* Truncate to 200 lines + append warning */ }

// Limit 2: Character limit (soft warning)
const MEMORY_FILE_SIZE_WARNING_THRESHOLD = 40000; // chunks.88.mjs:2530
if (content.length > 40000) { /* Display TUI warning banner */ }
```

### Discrepancy Details

| Aspect | Official Docs | Implementation |
|--------|---------------|----------------|
| **Limits mentioned** | 1 limit (200 lines) | 2 limits (200 lines + 40000 chars) |
| **Line limit enforcement** | Truncation | Matches - Truncation with warning |
| **Character limit** | Not mentioned | Missing - TUI warning banner |
| **Warning format** | Not shown | Missing - Specific message template |

**Impact**: Users may create files that pass the line limit but trigger TUI warnings (e.g., files with very long lines — minified JSON, base64 data)

**Recommendation**: Add character limit to official documentation

---

## Discrepancy 2: Permission System Bypass

### What Official Docs Say

**Official documentation**: (No mention of permission system)

### What Implementation Does

```javascript
// Write tool permission validator (chunks.174.mjs:933-940)
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
| **Permission prompts** | Not mentioned | Bypassed for auto memory paths |
| **Auto-approval reason** | Not documented | "auto memory files are allowed" |
| **Security implications** | Not discussed | Agent can write freely within memory dir |

**Security note**: Permission bypass is **safe by design** because:
- Memory directory is scoped to project
- Directory path is user-controlled (via `CLAUDE_CODE_REMOTE_MEMORY_DIR`, `autoMemoryDirectory`, or default)
- Content doesn't execute code
- Similar to how agents can freely edit project files

**Recommendation**: Document permission bypass behavior in official docs

---

## Discrepancy 3: Error Handling is Silent

### What Official Docs Say

**Official documentation**: (No mention of error handling)

### What Implementation Does

```javascript
// Directory creation error - silent
try {
  fs.mkdirSync(memoryDir, { recursive: true });
} catch { /* Silent failure */ }

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
| **Directory creation fails** | Not mentioned | Silent failure, continues |
| **File read fails** | Not mentioned | Returns empty state message |
| **Permission denied** | Not mentioned | Silent, shows empty state |
| **I/O errors** | Not mentioned | Silent, shows empty state |

**Why this matters**:
- File permissions issues go unnoticed
- Disk full errors are silent
- Users may think memory is empty when actually file is unreadable

**Example scenario**:
```bash
# User accidentally removes read permissions
chmod 000 ~/.claude/projects/*/memory/MEMORY.md

# Agent sees: "Your MEMORY.md is currently empty..."
# User thinks: "Why isn't my memory being saved?"
# Actual issue: File exists but is unreadable (silent permission error)
```

**Recommendation**: Add error visibility or diagnostic mode

---

## Discrepancy 4: Telemetry Tracking

### What Official Docs Say

**Official documentation**: (No mention of telemetry)

### What Implementation Does

```javascript
// Event 1: Memory loaded (every turn)
recordTelemetryEvent("tengu_memdir_loaded", {
  content_length, line_count, was_truncated,
  memory_type, total_file_count, total_subdir_count
});

// Event 2: Toggle action
recordTelemetryEvent("tengu_auto_memory_toggled", { enabled: newValue });

// Event 3: Disabled state
recordTelemetryEvent("tengu_memdir_disabled", {
  disabled_by_env_var, disabled_by_setting
});
```

### Discrepancy Details

| Aspect | Official Docs | Implementation |
|--------|---------------|----------------|
| **Telemetry events** | Not mentioned | 3 events tracked |
| **Data collected** | Not mentioned | File sizes, counts, toggle actions |
| **Privacy implications** | Not discussed | Metadata tracked (not content) |

**What IS tracked**:
- File sizes (character count, line count)
- Directory structure (file count, subdirectory count)
- Truncation events (how often limit exceeded)
- Toggle actions (enable/disable frequency)

**What is NOT tracked**:
- File content (memory content remains private)
- File names (topic file names not logged)
- Identifiable information (beyond standard telemetry)

**Recommendation**: Add telemetry disclosure to official docs and privacy policy

---

## Discrepancy 5: Feature Flag Priority Chain

### What Official Docs Say

```
You can disable auto memory by setting CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

**Implication**: Only environment variable controls feature

### What Implementation Does

```javascript
function isAutoMemoryEnabled() {
  if (process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY === "1") return false; // Priority 1
  if (process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY === "0") return true;  // Priority 2
  if (isRemoteMode() && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return false; // Priority 3
  if (userSettings.autoMemoryEnabled !== undefined) return userSettings.autoMemoryEnabled; // Priority 4
  return getFeatureFlag("tengu_oboe"); // Priority 5
}
```

### Discrepancy Details

| Aspect | Official Docs | Implementation |
|--------|---------------|----------------|
| **Control mechanisms** | 1 (env var) | 5 priority levels |
| **User setting** | Not mentioned | TUI toggle persists preference |
| **Remote mode check** | Mentioned separately | Integrated into priority chain |
| **Feature flag** | Not mentioned | Codename "tengu_oboe" |
| **Enable via env var** | Not documented | `DISABLE=0` enables |

**Recommendation**: Document full priority chain and all control mechanisms

---

## Discrepancy 6: Remote Mode Requirements

### What Official Docs Say

```
Set CLAUDE_CODE_REMOTE_MEMORY_DIR to specify a shared memory directory for remote/distributed setups
```

**Implication**: Environment variable is optional (for advanced use cases)

### What Implementation Does

```javascript
// If remote mode but no directory specified, DISABLE auto memory
if (isRemoteMode() && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
  return false;  // Auto memory disabled
}
```

### Discrepancy Details

| Aspect | Official Docs | Implementation |
|--------|---------------|----------------|
| **Remote mode behavior** | "Specify directory" | Directory REQUIRED, not optional |
| **Default behavior** | Not specified | Auto memory disabled if no dir |
| **Error message** | Not mentioned | No error, silently disabled |

**Recommendation**:
- Add error message or TUI notification explaining requirement
- Document remote mode behavior more clearly

---

## Discrepancy 7: autoMemoryDirectory Setting (v2.1.59 — Underdocumented)

### What Official Docs Say

Some documentation mentions the `CLAUDE_CODE_REMOTE_MEMORY_DIR` environment variable for remote memory, but does not document the `autoMemoryDirectory` settings field.

### What Implementation Does

```javascript
// getAutoMemoryDirectory (v2.1.59+)
function getAutoMemoryDirectory() {
  // NEW in v2.1.59: Check settings for custom directory first
  const settings = getUserSettings();
  if (settings.autoMemoryDirectory) {
    return settings.autoMemoryDirectory;
  }
  // ... fall through to project-hash computation
}
```

The `autoMemoryDirectory` field in `~/.claude/settings.json` allows users to specify a custom memory directory that completely bypasses the project-hash computation. This is different from `CLAUDE_CODE_REMOTE_MEMORY_DIR` (which replaces the home directory base while still using the project hash).

| Aspect | Official Docs | Implementation |
|--------|---------------|----------------|
| **autoMemoryDirectory setting** | Not mentioned | Overrides entire directory computation |
| **Priority vs env var** | N/A | Settings-level override between env var and hash computation |
| **Use case** | Not documented | Shared team directory without needing project hash coordination |

**Recommendation**: Document the `autoMemoryDirectory` setting with examples for team use cases.

---

## Discrepancy 8: Freshness Timestamp (v2.1.74 — New in v2.1.76)

### What Official Docs Say

No mention of timestamp injection in the system prompt.

### What Implementation Does

In v2.1.74 (included in v2.1.76), a `Last updated` timestamp is injected into the memory prompt header via `fs.statSync()` on the MEMORY.md file:

```javascript
try {
  const stat = fs.statSync(memoryFilePath);
  promptSection += `Last updated: ${stat.mtime.toISOString()}\n\n`;
} catch { /* Skip if file doesn't exist */ }
```

This gives agents explicit freshness information to guide maintenance decisions.

| Aspect | Official Docs | Implementation |
|--------|---------------|----------------|
| **Timestamp injection** | Not mentioned | `Last updated:` line in prompt header |
| **Freshness guidance** | Not mentioned | Agents can reason about memory staleness |
| **Agent behavior** | Not mentioned | Agents may suggest review for stale memory |

**Recommendation**: Document timestamp feature and its intent for agent-driven maintenance.

---

## Summary Table

### All Discrepancies at a Glance

| # | Discrepancy | Official Docs | Implementation | Severity |
|---|-------------|---------------|----------------|----------|
| 1 | **Dual file size limits** | 200-line limit only | 200-line + 40000-char limits | Medium |
| 2 | **Permission bypass** | Not mentioned | Auto memory paths bypass prompts | Medium |
| 3 | **Silent error handling** | Not mentioned | All errors caught, empty state shown | High |
| 4 | **Telemetry tracking** | Not mentioned | 3 events tracked every turn/toggle | Medium |
| 5 | **Feature flag priority** | Env var only | 5-level priority chain | High |
| 6 | **Remote mode requirement** | Directory optional | Directory REQUIRED or disabled | High |
| 7 | **autoMemoryDirectory setting** | Not mentioned | Full directory override via settings | Medium |
| 8 | **Freshness timestamp** (v2.1.74) | Not mentioned | `Last updated:` injected in prompt | Low |

**Severity definitions**:
- **High**: Behavior significantly differs, causes user confusion or errors
- **Medium**: Important detail omitted, but discoverable through use
- **Low**: Minor implementation detail, minimal user impact

---

## Recommendations for Official Docs

### High Priority Updates

1. **Document dual file size limits**: Both 200-line (hard) and 40000-char (soft) limits

2. **Document silent error handling**: File permissions issues silently produce empty state

3. **Document feature flag priority chain**: Full 5-level priority, not just env var

4. **Document remote mode requirement**: Directory REQUIRED (not optional) in remote mode

### Medium Priority Updates

5. **Document autoMemoryDirectory setting** (v2.1.59): Custom directory override with examples

6. **Document permission bypass**: Auto memory files bypass Write/Edit permission prompts

7. **Document telemetry**: What is tracked, what is not, and privacy guarantees

### Low Priority Updates

8. **Document freshness timestamps** (v2.1.74): `Last updated:` in system prompt

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions analyzed:
- `isAutoMemoryEnabled` (y2) - Feature flag priority chain
- `buildMemoryPrompt` (m0A) - Truncation, timestamps, and error handling
- `getAutoMemoryDirectory` (mu1) - Custom directory resolution (v2.1.59)
- `getLargeMemoryFiles` (DK1) - Character limit detection
- `recordMemoryDirLoadMetrics` (cN9) - Telemetry collection

---

## Key Takeaways

1. **Implementation is richer than docs**: Multiple undocumented behaviors exist
2. **Dual limits system**: Line limit (docs) + character limit (undocumented)
3. **Silent error handling**: All errors caught, may confuse users
4. **Complex priority chain**: 5 levels vs 1 documented control mechanism
5. **Remote mode strictness**: Directory required, not optional
6. **New v2.1.59 setting**: `autoMemoryDirectory` bypasses hash computation entirely
7. **New v2.1.74 feature**: Freshness timestamp injected into prompt header

**Why these discrepancies exist**:
- **Rapid iteration**: Implementation evolves faster than documentation
- **Research preview status**: Features stabilize before comprehensive docs
- **Internal telemetry**: Analytics infrastructure not user-facing
- **Safety defaults**: Remote mode requirement added for security

**Recommendation**: Update official docs to match implementation before exiting research preview.
