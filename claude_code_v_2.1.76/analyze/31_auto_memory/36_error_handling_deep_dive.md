# Auto Memory Error Handling Deep Dive

## Overview

The Auto Memory system implements comprehensive error handling across all operations. This document analyzes every error scenario, recovery mechanism, and graceful degradation pattern.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key error handling symbols:
- `isAutoMemoryEnabled` (`Z3`) - Enable check with multiple fallbacks
- `ensureMemoryDirExists` (`CD1`) - Directory creation with error catching
- `loadMemoryFileWithIncludeSupport` (`xD1`) - File loading with multiple error codes
- `searchMemoryFiles` (`a4q`) - Search with timeout and graceful degradation

---

## 1. Error Categories

### 1.1 Error Taxonomy

```
Memory Errors
├── Configuration Errors
│   ├── Memory disabled (env var)
│   ├── Memory disabled (user setting)
│   └── Invalid memory directory
├── File System Errors
│   ├── File not found (ENOENT)
│   ├── Permission denied (EACCES)
│   ├── Directory not found (ENOENT)
│   └── Is a directory (EISDIR)
├── Content Errors
│   ├── File too large (> 200 lines)
│   ├── Invalid frontmatter
│   └── Binary file (non-text extension)
├── Search Errors
│   ├── Timeout exceeded (5 seconds)
│   ├── LLM API failure
│   └── No matching files
└── Integration Errors
    ├── Dynamic variable registration failed
    └── Attachment normalization failed
```

---

## 2. Configuration Error Handling

### 2.1 Enable/Disable Priority Chain (Z3)

// ============================================
// isAutoMemoryEnabled - Multi-level fallback
// Location: chunks.50.mjs:2401-2409
// ============================================

// ORIGINAL (for source lookup):
function Z3() {
    let A = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
    if (t6(A)) return !1;
    if (xz(A)) return !0;
    if (t6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR)
        return !1;
    let q = mA();
    if (q.autoMemoryEnabled !== void 0)
        return q.autoMemoryEnabled;
    return !0
}

// READABLE (for understanding):
function isAutoMemoryEnabled() {
    const disableEnvVar = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;

    // Priority 1: Explicit disable
    if (isTruthy(disableEnvVar)) return false;

    // Priority 2: Explicit enable (override)
    if (isFalsy(disableEnvVar)) return true;

    // Priority 3: Remote mode without memory directory
    if (isTruthy(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return false;
    }

    // Priority 4: User setting
    const settings = getUserSettings();
    if (settings.autoMemoryEnabled !== undefined) {
        return settings.autoMemoryEnabled;
    }

    // Priority 5: Default enabled
    return true;
}

**Error scenarios handled:**

| Scenario | Result | Reason |
|----------|--------|--------|
| Env var = "1" | Disabled | CI/CD override |
| Env var = "0" | Enabled | Explicit enable |
| Remote mode, no dir | Disabled | Safety measure |
| Invalid user settings | Default enabled | Graceful fallback |

### 2.2 Telemetry on Disabled State

When memory is disabled, telemetry is recorded for debugging:

```javascript
// chunks.84.mjs:396-400
recordTelemetry("tengu_memdir_disabled", {
    disabled_by_env_var: isTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
    disabled_by_setting: !isTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) &&
                         getUserSettings().autoMemoryEnabled === false
});
```

---

## 3. File System Error Handling

### 3.1 Directory Creation (CD1)

// ============================================
// ensureMemoryDirExists - Directory creation with error catching
// Location: chunks.84.mjs:261-271
// ============================================

// ORIGINAL (for source lookup):
async function CD1(A) {
    try {
        await $1().promises.mkdir(A, {
            recursive: !0
        })
    } catch {}
}

// READABLE (for understanding):
async function ensureMemoryDirExists(memoryDir) {
    try {
        await getFileSystem().promises.mkdir(memoryDir, {
            recursive: true
        });
    } catch {
        // Silent catch - directory already exists or creation failed
        // Either way, we continue with memory loading
    }
}

**Error handling strategy:**

| Error Code | Handling | Result |
|------------|----------|--------|
| EEXIST | Silent catch | Directory exists, proceed |
| EACCES | Silent catch | Permission denied, try to read anyway |
| ENOENT | Silent catch | Parent missing, recursive should handle |
| Any other | Silent catch | Continue, will fail at read |

**Why silent catch:**
- Directory creation is best-effort
- If creation fails, file read will also fail and be handled
- Prevents cascading errors

### 3.2 File Loading (xD1)

// ============================================
// loadMemoryFileWithIncludeSupport - Comprehensive error handling
// Location: chunks.84.mjs:495-534
// ============================================

// ORIGINAL (for source lookup):
function xD1(A, q) {
    try {
        let Y = $1().readFileSync(A, { encoding: "utf-8" }),
            z = pv9(A).toLowerCase();
        if (z && !Uv9.has(z)) return k(`Skipping non-text file in @include: ${A}`), null;
        // ... processing ...
        return { path: A, type: q, content: $, ... };
    } catch (K) {
        let Y = K.code;
        if (Y === "ENOENT" || Y === "EISDIR") return null;
        if (Y === "EACCES") d("tengu_claude_md_permission_error", {
            is_access_error: 1,
            has_home_dir: A.includes(c8()) ? 1 : 0
        })
    }
    return null
}

// READABLE (for understanding):
function loadMemoryFileWithIncludeSupport(filePath, fileType) {
    try {
        // Step 1: Read file
        const rawContent = getFileSystem().readFileSync(filePath, { encoding: "utf-8" });

        // Step 2: Check extension
        const extension = getFileExtension(filePath).toLowerCase();
        if (extension && !ALLOWED_TEXT_EXTENSIONS.has(extension)) {
            logDebug(`Skipping non-text file in @include: ${filePath}`);
            return null;  // Silent skip for binary files
        }

        // Step 3: Process content...
        return { path: filePath, type: fileType, content: processedContent };

    } catch (error) {
        const errorCode = error.code;

        // File not found or is a directory - return null silently
        if (errorCode === "ENOENT" || errorCode === "EISDIR") {
            return null;
        }

        // Permission error - log telemetry and return null
        if (errorCode === "EACCES") {
            recordTelemetry("tengu_claude_md_permission_error", {
                is_access_error: 1,
                has_home_dir: filePath.includes(getHomeDir()) ? 1 : 0
            });
        }
    }

    return null;  // Default: return null for any unhandled error
}

**Error code handling:**

| Code | Meaning | Handling | User Impact |
|------|---------|----------|-------------|
| ENOENT | File not found | Return null | Memory file doesn't exist yet |
| EISDIR | Path is a directory | Return null | Invalid path configuration |
| EACCES | Permission denied | Log telemetry, return null | User needs to fix permissions |
| Other | Unknown error | Return null | Graceful degradation |

### 3.3 File Read in Prompt Builder (Q14)

// ============================================
// buildMemoryPrompt - Silent error handling for file read
// Location: chunks.84.mjs:290-322
// ============================================

// ORIGINAL (for source lookup):
function Q14(A) {
    // ...
    try { w = z.readFileSync(_, { encoding: "utf-8" }) } catch {}
    // ...
}

// READABLE (for understanding):
function buildMemoryPrompt({ displayName, memoryDir, extraGuidelines }) {
    const memoryFilePath = memoryDir + "MEMORY.md";
    let content = "";

    try {
        content = fs.readFileSync(memoryFilePath, { encoding: "utf-8" });
    } catch {
        // Silent catch - file doesn't exist or can't be read
        // Will show "Your MEMORY.md is currently empty" message
    }

    if (content.trim()) {
        // Has content - process it
    } else {
        // Empty or missing - show getting started message
    }
}

**Why silent catch:**
- Missing MEMORY.md is a valid state (first use)
- Shows helpful empty message instead of error
- User can start using memory immediately

---

## 4. Content Error Handling

### 4.1 Truncation Handling

When memory exceeds 200 lines:

```javascript
// chunks.84.mjs:303-312
const lines = content.trim().split("\n");
const wasTruncated = lines.length > MEMORY_MAX_LINES;

if (wasTruncated) {
    displayContent = lines.slice(0, MEMORY_MAX_LINES).join("\n") +
        `\n\n> WARNING: MEMORY.md is ${lines.length} lines (limit: ${MEMORY_MAX_LINES}). ` +
        `Only the first ${MEMORY_MAX_LINES} lines were loaded. ` +
        `Move detailed content into separate topic files and keep MEMORY.md as a concise index.`;
}
```

**Truncation message:**
- Warning is visible to the LLM
- Explains the limit clearly
- Provides actionable guidance (use topic files)

### 4.2 Invalid Frontmatter

When frontmatter parsing fails:

```javascript
// chunks.84.mjs:449-467 (dv9)
function extractFrontmatterPaths(content) {
    try {
        const { frontmatter, content: bodyContent } = parseFrontmatter(content);

        if (!frontmatter.paths) {
            return { content: bodyContent };  // No paths, just return content
        }

        // Process paths...
    } catch {
        // Parsing failed - treat as plain content
        return { content: content };
    }
}
```

**Graceful degradation:**
- If frontmatter is malformed, continue without it
- Content is still loaded, just without path filtering
- No user-facing error

### 4.3 Binary File Handling

Non-text files are skipped in @include:

```javascript
// chunks.84.mjs:500-501
const extension = getFileExtension(filePath).toLowerCase();
if (extension && !ALLOWED_TEXT_EXTENSIONS.has(extension)) {
    logDebug(`Skipping non-text file in @include: ${filePath}`);
    return null;
}
```

**Allowed extensions (Uv9):**
```javascript
const ALLOWED_TEXT_EXTENSIONS = new Set([
    ".md", ".txt", ".json", ".yaml", ".yml",
    ".js", ".ts", ".jsx", ".tsx", ".py", ".rb",
    // ... other text extensions
]);
```

---

## 5. Search Error Handling

### 5.1 Timeout Handling (5-second limit)

```javascript
// chunks.147.mjs:552-553
async function produceRelevantMemories(searchText, activeAgents, readFileState, toolContext) {
    const abortSignal = AbortSignal.timeout(5000);

    // All operations use this signal
    const results = await searchMemoryFiles(searchText, memoryDir, abortSignal, toolContext);
}
```

**Timeout behavior:**

| Phase | Timeout Behavior |
|-------|-----------------|
| File discovery | Cancelled, returns [] |
| LLM selection | Cancelled, returns [] |
| File reading | Cancelled, returns [] |
| Overall | Max 5 seconds, graceful empty |

### 5.2 LLM Selection Failure

```javascript
// chunks.146.mjs:2821-2868 (quY)
async function selectMemoriesWithLLM(searchText, memoryFiles, abortSignal, toolContext) {
    try {
        const response = await callLLM({ /* ... */ });
        return parseResponse(response);
    } catch {
        return [];  // Silent failure - no memories selected
    }
}
```

**Failure modes:**
- API timeout → Returns []
- Rate limit → Returns []
- Invalid response → Returns []
- Parse error → Returns []

### 5.3 File Discovery Errors

```javascript
// chunks.146.mjs:2784-2819 (AuY)
async function listAndRankMemoryFiles(memoryDir, abortSignal) {
    try {
        const allFiles = await recursiveReaddir(memoryDir, { recursive: true });
        // ... process files ...
    } catch {
        return [];  // Directory read failed - return empty
    }
}
```

**Individual file errors handled with Promise.allSettled:**

```javascript
const results = await Promise.allSettled(
    files.map(async (file) => {
        const stat = await fs.stat(file);
        return { file, mtimeMs: stat.mtimeMs };
    })
);

// Filter to successful results only
const valid = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
```

---

## 6. Integration Error Handling

### 6.1 Dynamic Variable Registration

If `getAutoMemory` fails, the dynamic variable system handles it gracefully:

```javascript
// The dynamic variable is registered with async handling
registerDynamicVariable("auto_memory",
    () => getAutoMemory(),
    "MEMORY.md is read from disk each turn"
);

// If getAutoMemory throws, it's caught and returns null
// The system prompt continues without memory content
```

### 6.2 Attachment Normalization

If memory attachment normalization fails:

```javascript
// chunks.174.mjs - relevant_memories case
case "relevant_memories":
    return wrapWithSystemReminderTags(
        attachment.memories.map((memory) => {
            // If this throws, the entire message set is invalid
            // But map() errors are caught at higher level
            return createUserMessage({ /* ... */ });
        })
    );
```

**Higher-level error boundary:**
```javascript
// Attachment assembly catches errors from all producers
try {
    const attachments = await produceAllAttachments();
    // ... normalize ...
} catch (error) {
    logError(error);
    // Continue without problematic attachments
}
```

---

## 7. Error Recovery Strategies

### 7.1 Automatic Recovery

| Error | Automatic Recovery |
|-------|-------------------|
| Directory missing | Auto-create with `recursive: true` |
| File missing | Show "empty" message |
| Permission denied | Log telemetry, continue |
| Timeout | Return empty results |
| Parse error | Use raw content |

### 7.2 User Action Required

| Error | User Action |
|-------|-------------|
| Persistent permission denied | Fix file/directory permissions |
| Invalid memory directory | Update `autoMemoryDirectory` setting |
| Remote memory unavailable | Check network/mount |
| Memory disabled unexpectedly | Check env var and settings |

### 7.3 No Recovery Needed

| Scenario | Behavior |
|----------|----------|
| Empty MEMORY.md | Normal first-use state |
| No topic files | Semantic search returns [] |
| Binary file in @include | Skipped silently |
| Memory > 200 lines | Truncated with warning |

---

## 8. Telemetry Events

### 8.1 Error Tracking Events

| Event | Trigger | Data |
|-------|---------|------|
| `tengu_memdir_disabled` | Memory disabled | `disabled_by_env_var`, `disabled_by_setting` |
| `tengu_claude_md_permission_error` | Permission denied | `is_access_error`, `has_home_dir` |
| `tengu_memdir_loaded` | Directory scanned | `file_count`, `subdir_count`, `memory_type` |

### 8.2 Usage for Debugging

Query telemetry to understand issues:

```sql
-- Find permission errors
SELECT * FROM telemetry
WHERE event = 'tengu_claude_md_permission_error'
AND timestamp > now() - interval '7 days';

-- Find why memory is disabled
SELECT * FROM telemetry
WHERE event = 'tengu_memdir_disabled'
AND timestamp > now() - interval '7 days';
```

---

## 9. Error Messages Reference

### 9.1 User-Visible Messages

| Message | Cause | Resolution |
|---------|-------|------------|
| "Your MEMORY.md is currently empty" | File missing or empty | Add content |
| "WARNING: MEMORY.md is N lines..." | Truncation | Use topic files |
| "Skipping non-text file" | Binary in @include | Remove reference |

### 9.2 Log Messages

| Log | Level | Meaning |
|-----|-------|---------|
| `Skipping non-text file in @include` | Debug | Binary file skipped |
| `Memory directory created` | Info | New directory created |
| `Permission error accessing memory` | Warning | User action needed |

---

## Summary

Auto Memory error handling provides:

1. **Silent failures** - Missing files are normal, not errors
2. **Graceful degradation** - System works with partial functionality
3. **Telemetry tracking** - Errors logged for analysis
4. **User guidance** - Truncation warnings, empty state messages
5. **No cascading errors** - Each error is contained

**Key principle**: Every error scenario has a defined fallback. The memory system never crashes the main conversation - it either works, works partially, or returns null silently.

---

## Related Documentation

- [16_error_handling_recovery.md](./16_error_handling_recovery.md) - Original error analysis
- [26_memory_extraction_mechanism.md](./26_memory_extraction_mechanism.md) - Extraction errors
- [29_semantic_memory_search.md](./29_semantic_memory_search.md) - Search timeout handling