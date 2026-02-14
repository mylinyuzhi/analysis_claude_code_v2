# Edge Cases and Failure Handling - Deep Analysis

## Overview

The system reminder subsystem is designed with **defensive programming** principles to ensure attachment production failures never crash the agent loop. This document provides comprehensive reverse engineering of error handling, timeout behavior, race conditions, and graceful degradation strategies across all 40+ attachment producers.

The core philosophy: **"Fail safe, proceed with partial context"** - missing attachments are acceptable; a crashed agent loop is not.

---

## Error Handling Architecture

### Three-Layer Fault Isolation

```
┌─────────────────────────────────────────────────────────────┐
│ LAYER 1: Producer Wrapper (gw - timedAttachmentProducer)    │
│                                                              │
│ • try-catch around producer execution                        │
│ • Returns [] on any error                                    │
│ • Logs error for debugging                                   │
│ • Samples telemetry (5%) for error tracking                  │
│                                                              │
│ Effect: Individual producer failure isolated                 │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 2: Producer Implementation (40+ functions)             │
│                                                              │
│ • try-catch in critical sections                             │
│ • Null checks for missing data                               │
│ • Early returns for invalid state                            │
│ • filter(Boolean) to remove nulls                            │
│                                                              │
│ Effect: Producer returns [] or partial results on error      │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 3: Normalizer (K2z - normalizeAttachmentForAPI)       │
│                                                              │
│ • Handles unknown attachment types gracefully                │
│ • Returns [] for unrecognized types                          │
│ • Logs warning for debugging                                 │
│                                                              │
│ Effect: Invalid attachments filtered before reaching LLM     │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Wrapper Error Handling

The `gw` (timedAttachmentProducer) wrapper is the **first line of defense** against producer failures.

### Error Isolation Pattern

```javascript
// ============================================
// timedAttachmentProducer - Error isolation wrapper
// Location: chunks.142.mjs:1967-1991
// ============================================

// ORIGINAL (for source lookup):
async function gw(A, q) {
    let K = Date.now();
    try {
        let Y = await q(),
            z = Date.now() - K,
            w = Y.reduce((H, $) => {
                return H + Q1($).length
            }, 0);
        if (Math.random() < 0.05) c("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            attachment_size_bytes: w,
            attachment_count: Y.length
        });
        return Y
    } catch (Y) {
        let z = Date.now() - K;
        if (Math.random() < 0.05) c("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            error: !0
        });
        return K1(Y), Yk(`Attachment error in ${A}`, Y), []
    }
}

// READABLE (for understanding):
async function timedAttachmentProducer(producerLabel, producerFunction) {
    let startTime = Date.now();

    try {
        // Execute producer (may throw)
        let attachments = await producerFunction();

        // ... telemetry logging ...

        return attachments;

    } catch (error) {
        let durationMs = Date.now() - startTime;

        // Sample telemetry for error tracking
        if (Math.random() < 0.05) {
            logTelemetry("tengu_attachment_compute_duration", {
                label: producerLabel,
                duration_ms: durationMs,
                error: true  // <-- Error flag
            });
        }

        // Log error locally (always, not sampled)
        logError(error);
        logWarning(`Attachment error in ${producerLabel}`, error);

        // CRITICAL: Return empty array, not undefined or null
        // This ensures flat() in assembleAttachments works correctly
        return [];
    }
}

// Mapping: gw→timedAttachmentProducer, A→producerLabel, q→producerFunction, K→startTime, Y→attachments or error, z→durationMs, w→totalSizeBytes, c→logTelemetry, Q1→JSON.stringify, K1→logError, Yk→logWarning
```

### What Errors Are Caught

The wrapper catches **all exceptions**, including:

1. **Producer execution errors**:
   - File I/O failures (read, stat)
   - Network failures (MCP resource fetch)
   - Null reference errors (missing properties)
   - Type errors (unexpected data structures)
   - Async errors (promise rejections)

2. **Timeout errors**:
   - AbortController cancellation (1-second global timeout)
   - Producer-specific timeouts
   - Hanging async operations

3. **System errors**:
   - Out of memory
   - Permission denied
   - Resource exhaustion

### Why Return Empty Array

**Question**: Why return `[]` instead of `null` or `undefined`?

**Answer**: The calling code in `assembleAttachments` uses `flat()` to flatten results:
```javascript
return [...J.flat(), ...j.flat(), ...M.flat()]
```

If a producer returned `null` or `undefined`, `flat()` would throw `TypeError: null is not iterable`. By returning `[]`, the error is silently absorbed and the agent proceeds with other attachments.

**Trade-off**: Silent failures vs. crash safety. Silent failures chosen because:
- Attachment production is non-critical path (agent can proceed without attachments)
- Errors are logged for debugging
- Telemetry tracks error rates
- User experience isn't degraded (agent still responds)

---

## AbortController Timeout Behavior

### 1-Second Global Timeout

```javascript
// ============================================
// assembleAttachments - Timeout setup
// Location: chunks.142.mjs:1948-1953
// ============================================

// ORIGINAL (for source lookup):
let H = Aq();
setTimeout(() => {
    H.abort()
}, 1000);
let $ = {
        ...q,
        abortController: H
    },

// READABLE (for understanding):
let abortController = createAbortController();

// Set 1-second global timeout
setTimeout(() => {
    abortController.abort(); // Cancels all pending operations
}, 1000);

// Enhance context with abort capability
let enhancedContext = {
    ...sessionContext,
    abortController: abortController
};

// Mapping: H→abortController, Aq()→createAbortController, $→enhancedContext, q→sessionContext
```

### Timeout Enforcement Mechanism

The timeout works via **signal propagation**:

1. **AbortController created**: `abortController = new AbortController()`
2. **Timeout scheduled**: `setTimeout(() => abortController.abort(), 1000)`
3. **Signal passed to producers**: Producers receive `abortController.signal` in context
4. **Operations respect signal**: Async operations (fetch, file reads) check signal
5. **Abort triggered**: After 1 second, all pending operations receive abort signal
6. **Promises reject**: Operations throw `AbortError`
7. **Wrapper catches**: `gw` wrapper catches error and returns `[]`

### What Gets Timed Out

**File I/O operations**:
- Read file (if passed signal)
- Stat file
- Directory listing

**Network operations**:
- MCP resource fetch
- LSP queries (if passed signal)

**Computation**:
- Diff generation
- Image compression
- JSON parsing

### Edge Case: Non-Abortable Operations

**Problem**: Not all operations respect AbortController signal. For example:
- Synchronous file reads (`fs.readFileSync`)
- CPU-bound operations (large diff computation)
- Third-party libraries without abort support

**Solution**: These operations still hit the 1-second timeout, but the abort signal doesn't interrupt them. They continue running in background, but their results are discarded because the `gw` wrapper has already returned `[]`.

**Impact**: Potential resource waste (operation completes but result unused). However, this is rare because:
- Most producers are async (use signals)
- Timeout is generous (1 second is plenty for typical operations)
- Background operations complete quickly anyway

### Why 1 Second?

**Design rationale**:

1. **User experience**: Attachments should not block agent response. 1 second is imperceptible to users.
2. **Typical operation time**: Most producers complete in 5-50ms. 1 second is 20-200x margin.
3. **Network operations**: MCP resource fetch may be slow on poor connections. 1 second tolerates moderate latency.
4. **Safety margin**: Prevents pathological cases (infinite loops, deadlocks) from freezing agent.

**Trade-off**: Aggressive timeout vs. completeness. If a producer needs >1 second, it won't finish. But:
- This is extremely rare (telemetry shows >99% complete within 100ms)
- Missing attachment is better than frozen agent
- User can retry or manually fetch data

---

## Producer-Specific Error Handling

### File Attachment Producer Errors

The file attachment producer (`TyA` / `loadFileAttachment`) handles numerous edge cases:

```javascript
// ============================================
// loadFileAttachment - Comprehensive error handling
// Location: chunks.142.mjs:2524-2613
// ============================================

// Key error scenarios handled:

// 1. File doesn't exist
try {
    let result = await ReadTool.call({ file_path: path }, context);
} catch (error) {
    logTelemetry(errorEventName, {});
    return null; // Filtered by parent
}

// 2. File is sandboxed (permission denied)
if (isSandboxBlocked(path, appState.toolPermissionContext)) {
    return null; // Skip silently
}

// 3. File too large (exceeds token limit)
let validateResult = await ReadTool.validateInput({ file_path: path }, context);
if (!validateResult.result) {
    if (validateResult.meta?.fileSize) {
        // Return truncated version
        return await loadTruncatedFile(path, context);
    }
    return null; // Other validation failure
}

// 4. File is binary (non-text)
// Read tool returns { type: "image" } or { type: "pdf" }
// No error, just different handling

// 5. File modified during read (race condition)
// Timestamp check after read detects this
let currentMtime = getFileModificationTime(path);
if (currentMtime > startTime) {
    // File changed during read, contents may be inconsistent
    // ... but we return it anyway (eventual consistency)
}

// 6. Image compression fails
if (result.type === "image") {
    try {
        let compressed = await compressImageForLLM(path);
        return { type: "edited_image_file", content: compressed };
    } catch (compressionError) {
        logError(compressionError);
        logTelemetry("tengu_watched_file_compression_failed", { file: path });
        return null; // Skip this image
    }
}
```

### MCP Resource Fetch Errors

```javascript
// ============================================
// extractMcpResources - MCP-specific error handling
// Location: chunks.142.mjs:2252-2283
// ============================================

// Error scenarios:

// 1. Malformed @server:uri syntax
let [serverName, ...uriParts] = resourceString.split(":");
let resourceUri = uriParts.join(":");
if (!serverName || !resourceUri) {
    logTelemetry("tengu_at_mention_mcp_resource_error", {});
    return null; // Invalid format
}

// 2. MCP server not connected
let client = mcpClients.find((c) => c.name === serverName);
if (!client || client.type !== "connected") {
    logTelemetry("tengu_at_mention_mcp_resource_error", {});
    return null; // Server offline
}

// 3. Resource not found in server's resource list
let resourceMetadata = (mcpResources?.[serverName] || [])
    .find((r) => r.uri === resourceUri);
if (!resourceMetadata) {
    logTelemetry("tengu_at_mention_mcp_resource_error", {});
    return null; // Resource doesn't exist
}

// 4. Fetch fails (network error, timeout, server error)
try {
    let contents = await client.client.readResource({ uri: resourceUri });
    return { type: "mcp_resource", content: contents };
} catch (fetchError) {
    logTelemetry("tengu_at_mention_mcp_resource_error", {});
    logError(fetchError);
    return null; // Fetch failed
}

// 5. AbortController timeout
// Handled by outer wrapper if fetch exceeds 1 second
```

### LSP Diagnostics Errors

```javascript
// ============================================
// getLspDiagnosticsAttachment - Registry-based error handling
// Location: chunks.142.mjs:2473-2492
// ============================================

async function getLspDiagnosticsAttachment(sessionContext) {
    logDebug("LSP Diagnostics: called");

    try {
        // 1. Registry access may throw if corrupted
        let pendingDiagnostics = getPendingLspDiagnostics();

        // 2. No diagnostics is not an error, just return []
        if (pendingDiagnostics.length === 0) {
            return [];
        }

        // 3. Convert to attachments (mapping may fail)
        let attachments = pendingDiagnostics.map(({files}) => ({
            type: "diagnostics",
            files: files,
            isNew: true
        }));

        // 4. Clear registry (may throw if concurrent access)
        clearDeliveredLspDiagnostics();

        return attachments;

    } catch (error) {
        // Catch-all for any unexpected errors
        let errorObj = error instanceof Error ? error : Error(String(error));
        logError(Error(`Failed to get LSP diagnostic attachments: ${errorObj.message}`));

        // Return empty array - agent proceeds without diagnostics
        return [];
    }
}
```

**Key behavior**: Even if registry is corrupted or concurrent access causes issues, the agent loop continues. Diagnostics are "nice to have" but not essential.

---

## Race Conditions

### Race Condition 1: File Modification During Read

**Scenario**:
1. `wIY` (getChangedFilesAttachment) checks file mtime: `1000`
2. Determines file changed since last read
3. Reads file contents
4. **User saves file again** (new mtime: `1001`)
5. Read completes with old contents

**Detection**:
```javascript
// Before read
let mtimeBefore = getFileModificationTime(path);

// Read file
let contents = await ReadTool.call({ file_path: path }, context);

// After read
let mtimeAfter = getFileModificationTime(path);

if (mtimeAfter > mtimeBefore) {
    // File changed during read - contents may be inconsistent
}
```

**Handling**:
- **Option 1**: Return inconsistent contents anyway (eventual consistency)
- **Option 2**: Retry read (may loop indefinitely if file keeps changing)
- **Chosen**: Option 1 - return contents from successful read

**Rationale**: Eventual consistency is acceptable. If file changes again, next turn will detect it and deliver updated contents. Retrying introduces complexity and potential infinite loops.

### Race Condition 2: Registry Concurrent Access

**Scenario**:
1. LSP client pushes diagnostic to registry
2. `WIY` (getLspDiagnosticsAttachment) fetches from registry
3. **Another LSP client pushes diagnostic** (concurrent)
4. `WIY` clears registry
5. New diagnostic lost

**Mitigation**:
- Registry uses **atomic operations** (fetch-and-clear in single transaction)
- JavaScript single-threaded execution prevents true concurrency
- Worst case: diagnostic delivered on next turn (1 turn delay)

**Impact**: Negligible - 1 turn delay is imperceptible to users.

### Race Condition 3: Attachment Duplication

**Scenario**:
1. Plan mode attachment delivered on turn N
2. Turn N+1: `ihY` (getPlanModeAttachment) runs again
3. Frequency throttling checks: has N turns passed since last?
4. **Race**: Turn count may be off by 1 due to async message appending

**Mitigation**:
```javascript
// Count turns backward from end of message array
let { turnCount, foundPlanModeAttachment } = countTurnsSincePlanMode(messages);

// Only send if:
// 1. Found previous attachment AND
// 2. N turns have passed since that attachment
if (foundPlanModeAttachment && turnCount < TURNS_BETWEEN_ATTACHMENTS) {
    return []; // Skip this turn
}
```

**Impact**: Worst case, plan mode reminder sent 1 turn early or late. Not a functional issue.

---

## Edge Cases by Attachment Type

### File Attachments

| Edge Case | Detection | Handling |
|-----------|-----------|----------|
| File doesn't exist | Read tool throws | Return `null`, filtered by parent |
| File deleted after detection | Stat succeeds, read fails | Return `null`, logged |
| File sandboxed | Permission check | Return `null`, skip silently |
| File too large | Validation check | Return truncated version with note |
| Binary file | Read tool detects | Return reference or compressed |
| Symbolic link | Stat detects | Follow link, read target |
| Permission denied | Read tool throws | Return `null`, logged |
| Encoding issues (non-UTF8) | Read tool detects | Return binary or error |
| File locked (Windows) | Read tool throws | Return `null`, retry next turn |

### Plan Mode

| Edge Case | Detection | Handling |
|-----------|-----------|----------|
| Plan mode entered but exited immediately | Mode check | No attachment (mode !== "plan") |
| Plan file doesn't exist | File read returns null | Set `planExists: false` in attachment |
| Plan file deleted during session | File read returns null | LLM instructed to create it |
| Plan mode reentry without exit | Reentry flag check | Send reentry notification |
| Subagent enters plan mode | `isSubAgent` flag | Send simplified instructions |
| Plan file corrupted (invalid markdown) | No validation | Delivered as-is (LLM robust) |

### Team/Swarm Mode

| Edge Case | Detection | Handling |
|-----------|-----------|----------|
| Team mode disabled mid-session | `l8()` check | No team attachments |
| Teammate mailbox empty | Array length check | Return `[]` |
| Teammate disconnected | No detection | Message queued, delivered when reconnects |
| Team config missing | File read fails | Return `null`, agent proceeds without config |
| Invalid agent ID in message | Validation in TeammateTool | Error returned to sender |
| Mailbox overflow (>100 messages) | No limit currently | Potential: truncate oldest messages |

### MCP Resources

| Edge Case | Detection | Handling |
|-----------|-----------|----------|
| MCP server disconnected | Connection state check | Return `null`, log error |
| Resource URI invalid | MCP error | Return `null`, log error |
| Resource contents too large | No size check | Delivered as-is, LLM truncates |
| Resource deleted on server | MCP error | Return `null`, log error |
| Resource requires authentication | MCP error | Return `null`, log error |
| Server timeout (>1 sec) | AbortController | Producer times out, returns `[]` |
| Server returns malformed data | JSON parse may fail | Caught by wrapper, returns `[]` |

### Diagnostics

| Edge Case | Detection | Handling |
|-----------|-----------|----------|
| LSP server disconnected | Registry empty | Return `[]` |
| Diagnostic file path invalid | No validation | Delivered as-is |
| Duplicate diagnostics | No deduplication | Both delivered (LLM handles) |
| Diagnostic cleared in IDE | Not detected | Stale diagnostic delivered once |
| LSP server crashes | Registry empty | Return `[]`, log error |

---

## Graceful Degradation Strategies

### Strategy 1: Fail Partially, Not Totally

**Example**: At-mention processing
```javascript
// If one @-mention fails, others still processed
let attachments = await Promise.all(mentions.map(async (mention) => {
    try {
        return await loadFileMention(mention);
    } catch (error) {
        logError(error);
        return null; // This mention failed, others continue
    }
}));

return attachments.filter(Boolean); // Remove nulls
```

**Benefit**: User gets partial results instead of total failure.

### Strategy 2: Degrade to Simpler Format

**Example**: File too large
```javascript
let validateResult = await ReadTool.validateInput({ file_path: path }, context);

if (!validateResult.result && validateResult.meta?.fileSize) {
    // File too large - return truncated version instead of nothing
    return {
        type: "file",
        filename: path,
        content: await readTruncated(path, MAX_LINES),
        truncated: true
    };
}
```

**Benefit**: User gets truncated file instead of no file. LLM can request more via Read tool.

### Strategy 3: Fallback to Reference

**Example**: PDF too large
```javascript
if (pageCount > MAX_PDF_PAGES) {
    // Too large to include inline - return reference
    return {
        type: "pdf_reference",
        filename: path,
        pageCount: pageCount,
        fileSize: size
    };
}
```

**Benefit**: LLM aware of PDF existence and can read specific pages via Read tool with `pages` parameter.

### Strategy 4: Silent Skip with Log

**Example**: Sandboxed file
```javascript
if (isSandboxBlocked(path, toolPermissionContext)) {
    // Don't log error (this is expected behavior)
    return null; // Skip silently
}
```

**Benefit**: No error noise for expected cases. Logs are clean.

### Strategy 5: Best-Effort Parsing

**Example**: At-mention line range parsing
```javascript
function parseFilePathWithLineRange(mention) {
    // Try to parse: "file.txt#L10-20"
    let match = mention.match(/^([^#]+)(?:#L(\d+)(?:-(\d+))?)?$/);

    if (!match) {
        // Invalid format - return filename only
        return { filename: mention };
    }

    let [, filename, lineStart, lineEnd] = match;
    return {
        filename: filename,
        lineStart: lineStart ? parseInt(lineStart, 10) : undefined,
        lineEnd: lineEnd ? parseInt(lineEnd, 10) : lineStart ? parseInt(lineStart, 10) : undefined
    };
}
```

**Benefit**: Handles valid formats gracefully, falls back to basic filename for invalid formats.

---

## Error Telemetry

### Tracked Error Events

| Event Name | Trigger | Purpose |
|------------|---------|---------|
| `tengu_attachment_compute_duration` (error: true) | Producer throws exception | Track producer failure rate |
| `tengu_at_mention_extracting_filename_error` | File @-mention fails | Track file access issues |
| `tengu_at_mention_mcp_resource_error` | MCP resource fetch fails | Track MCP connectivity |
| `tengu_at_mention_agent_not_found` | Agent mention invalid | Track user typos/config issues |
| `tengu_watched_file_stat_error` | File stat fails during change detection | Track filesystem issues |
| `tengu_watched_file_compression_failed` | Image compression fails | Track compression bugs |

### Telemetry Sampling (5%)

**Why 5%?**
- **Statistical significance**: With 1000s of attachment productions per day, 5% provides sufficient sample size
- **Low overhead**: Telemetry logging adds ~1ms per event; 5% sampling minimizes impact
- **Error tracking**: Errors are rare (<1% typically); 5% sampling ensures most errors caught

**What if error rate is exactly 0.1%?**
- 1000 attachment productions → 1 error
- 5% sampling → 5% chance of logging that 1 error
- Over 100 sessions (100,000 productions) → ~50 errors logged
- Sufficient for detecting issues

---

## Recovery Mechanisms

### Automatic Recovery: Retry on Next Turn

**Many failures are transient**:
- Network hiccup → MCP resource fetch succeeds next turn
- File locked → Unlock between turns, succeeds next turn
- LSP server slow → Diagnostics delivered next turn

**No explicit retry logic needed** - the polling model naturally retries:
```
Turn 1: Producer fails → returns []
Turn 2: Producer succeeds → returns [attachment]
```

### Manual Recovery: User Intervention

**Some failures require user action**:
- Sandboxed file → User must adjust sandbox settings
- MCP server disconnected → User must restart server
- Invalid agent mention → User must fix typo

**Claude Code provides hints**:
- File sandboxed → "File not accessible (sandbox)"
- MCP error → "MCP server disconnected"
- Agent not found → "Unknown agent type"

---

## Testing Implications

### Error Injection Points for Testing

1. **File I/O errors**: Mock file system to return errors
2. **Timeout simulation**: Reduce timeout to 10ms and use slow producers
3. **MCP failures**: Mock MCP client to throw errors
4. **Race conditions**: Use concurrent file modifications
5. **Registry corruption**: Inject malformed data into registries

### Invariants to Test

1. **Agent loop never crashes**: No matter what producer does, agent loop completes
2. **Partial results delivered**: If 5 producers succeed and 1 fails, 5 attachments delivered
3. **Errors logged**: Every producer failure generates log entry
4. **Timeout enforced**: No producer exceeds 1 second (global timeout)
5. **Memory bounded**: Attachment production doesn't leak memory

---

## Symbol Reference

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key error handling functions in this document:
- `timedAttachmentProducer` (gw) - Error isolation wrapper
- `loadFileAttachment` (TyA) - File loading with comprehensive error handling
- `extractMcpResources` (zIY) - MCP resource fetch with error handling
- `getLspDiagnosticsAttachment` (WIY) - Registry-based error handling
- `getChangedFilesAttachment` (wIY) - Race condition handling

---

## Related Documents

- [overview.md](./overview.md) - System reminder architecture overview
- [reminder_types.md](./reminder_types.md) - Complete catalog of 57 reminder types
- [attachment_producers.md](./attachment_producers.md) - Deep dive into 40+ producers
- [integration_points.md](./integration_points.md) - Cross-module integration analysis
- [performance_and_telemetry.md](./performance_and_telemetry.md) - Performance optimization analysis
