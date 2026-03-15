# Edge Cases & Failure Recovery

## Overview

The Compact feature implements comprehensive **error handling and recovery** strategies to ensure conversation continuity even when compaction encounters failures. This document catalogs edge cases, failure scenarios, and recovery mechanisms across all compaction subsystems: standard compaction, session memory compaction, microcompaction, message selection, state preservation, and hooks.

**Design philosophy:** **Graceful degradation** - When compaction fails, the system falls back to safer alternatives rather than crashing:
- Session memory fails → Standard compaction
- Standard compaction fails → Return `wasCompacted: false`, retry on next turn
- State collector fails → Skip that state type, preserve others
- Hook fails → Log error, continue compaction

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions referenced:
- `autoCompactDispatcher` (fs4) - Top-level error handling and fallback logic
- `performFullCompaction` (AW1) - Try-catch wrapper for full compaction lifecycle
- `performSessionMemoryCompaction` (vZ6) - Null-safe session memory path
- `generateConversationSummary` (ga4) - Retry logic for LLM API calls
- `selectHistoricalWindow` (lmY) - Tool boundary adjustment for incomplete sequences
- `adjustBoundariesForTools` (pCA) - Orphan detection and recovery

---

## Edge Case Taxonomy

### Category 1: Dispatcher-Level Failures

**Scope:** Entire compaction process fails
**Recovery:** Return `wasCompacted: false`, retry later

### Category 2: Path-Specific Failures

**Scope:** One compaction path fails (session memory OR standard)
**Recovery:** Fallback to alternative path

### Category 3: Component-Level Failures

**Scope:** Individual component fails (state collector, hook, tool result persistence)
**Recovery:** Skip failed component, continue with successful components

### Category 4: Data Integrity Failures

**Scope:** Input data malformed or inconsistent
**Recovery:** Validate and sanitize, or skip invalid data

---

## Failure Scenarios

### 1. Corrupted Session Notes Recovery

**Scenario:** Session notes file exists but contains invalid/corrupted data

**Locations:**
- `performSessionMemoryCompaction()` (vZ6) - chunks.147.mjs:651-680
- `isEmptyTemplate()` (_s4) - Checks if session notes are unmodified template

**Detection:**
1. File exists at session notes path
2. File read succeeds
3. Content parsing succeeds
4. But: `isEmptyTemplate()` returns `true` (notes never filled in) OR template parsing fails

**Recovery Flow:**
```javascript
async function performSessionMemoryCompaction(messages, agentId, threshold) {
    if (!isSessionMemoryCompactEnabled()) return null;

    await loadSmCompactConfig();
    await loadSessionMemoryTemplate();

    let lastSummarizedId = getLastSummarizedMessageId();
    let sessionNotesPath = getSessionNotesPath();

    if (!sessionNotesPath) {
        reportTelemetry("tengu_sm_compact_no_session_memory", {});
        return null;  // ← Recovery: Return null → fallback to standard compaction
    }

    if (await isEmptyTemplate(sessionNotesPath)) {
        reportTelemetry("tengu_sm_compact_empty_template", {});
        return null;  // ← Recovery: Return null → fallback to standard compaction
    }

    try {
        // ... session memory compaction logic ...
    } catch (error) {
        // Error logged by caller
        return null;  // ← Recovery: Return null → fallback to standard compaction
    }
}
```

**Telemetry:**
- `tengu_sm_compact_no_session_memory` - No session notes file found
- `tengu_sm_compact_empty_template` - Session notes are unmodified template
- `tengu_sm_compact_failed` - Unexpected error during session memory compaction

**Impact:** Falls back to standard compaction (slower, more expensive, but always works)

**Prevention:** Regular template validation, user warnings if notes haven't been updated

---

### 2. Resumed Sessions Without Prior Summary

**Scenario:** User resumes session, but no `lastSummarizedMessageId` exists (fresh session or summary lost)

**Location:** `performSessionMemoryCompaction()` (vZ6) - chunks.147.mjs:660-662

**Detection:**
- `lastSummarizedId = getLastSummarizedMessageId()` returns `null` or `undefined`

**Recovery Flow:**
```javascript
let lastSummarizedIndex;
if (lastSummarizedId) {
    lastSummarizedIndex = messages.findIndex((m) => m.uuid === lastSummarizedId);
    if (lastSummarizedIndex === -1) {
        reportTelemetry("tengu_sm_compact_summarized_id_not_found", {});
        return null;  // ← Recovery: ID not found → fallback
    }
} else {
    // No prior summary → start from end (most recent message)
    lastSummarizedIndex = messages.length - 1;
    reportTelemetry("tengu_sm_compact_resumed_session", {});
}
```

**Behavior:**
- If resuming without prior summary: Start boundary at end of array (keep all messages)
- This effectively triggers immediate compaction since `selectHistoricalWindow()` will find all messages exceed thresholds

**Telemetry:**
- `tengu_sm_compact_resumed_session` - Resumed session without prior summary (warning, expected on first compaction)
- `tengu_sm_compact_summarized_id_not_found` - Summary ID exists but message not found (error, data loss)

**Impact:** Slightly larger keep window on first compaction of resumed session

---

### 3. Token Estimation Inaccuracy

**Scenario:** Estimated token count differs significantly from actual token count reported by LLM API

**Location:** All token counting functions (PU1, Ev, PZ)

**Problem:**
- Token estimation uses heuristics (character count × 1.33)
- Actual tokenization may vary (special characters, Unicode, formatting)
- Result: Compaction may trigger too early/late

**Detection:**
- Compare `preCompactTokenCount` (estimated) with `compactionInputTokens` (actual from LLM API)
- If difference > 20%, token estimation is inaccurate

**Recovery Flow:**
```javascript
// Compaction uses conservative buffers to handle inaccuracy
let threshold = getAutoCompactThreshold(model);  // Typically contextWindow - 13000
let warningThreshold = threshold - 20000;

// Double buffer protection:
// 1. MAX_COMPACT_BUFFER (20k) - Space for LLM response
// 2. AUTO_COMPACT_BUFFER_OFFSET (13k) - Safety margin for estimation error

if (estimatedTokens >= threshold) {
    // Trigger compaction with significant margin
    // Even if estimate is 15% low, still have 10k+ buffer before hard limit
}
```

**Mitigation:**
- Conservative thresholds (trigger at 80% of hard limit)
- Multiple buffer layers (response buffer + estimation error buffer)
- Post-compaction validation (check if post-compact tokens still exceed threshold)

**Telemetry:** Captured in `tengu_compact` event:
```javascript
{
    preCompactTokenCount: <estimated>,
    compactionInputTokens: <actual from API>,
    estimationError: actual - estimated
}
```

**Impact:** May trigger compaction 5-10k tokens early/late, but buffers prevent overflow

---

### 4. Compaction Failure Mid-Process

**Scenario:** LLM API call fails during summary generation, or state collector throws exception

**Location:** `performFullCompaction()` (AW1) - chunks.146.mjs:2428-2434

**Detection:**
- LLM API returns error (rate limit, timeout, server error)
- State collector throws exception (file read failure, OOM)
- Hook execution fails critically

**Recovery Flow:**
```javascript
async function performFullCompaction(...) {
    try {
        // ... 8-step lifecycle ...

        let summaryResponse = await generateConversationSummary(...);
        let summaryText = extractTextFromMessage(summaryResponse);

        if (!summaryText) {
            throw Error("Failed to generate conversation summary - no valid text content");
        }

        if (summaryText.startsWith(API_ERROR_PREFIX)) {
            throw Error(summaryText);  // ← LLM API error
        }

        // ... state collection ...
        let [fileAttachments, taskAttachments] = await Promise.all([
            collectFilesToKeep(...),  // ← Can throw
            collectTasksToKeep(...)   // ← Can throw
        ]);

        // ... rest of lifecycle ...

    } catch (error) {
        handleCompactionError(error, context);  // ← Logs error
        throw error;  // ← Re-throw to caller (dispatcher)
    } finally {
        // Always clean up: reset stream mode, fire compact_end event, clear SDK status
        context.setStreamMode?.("requesting");
        context.setResponseLength?.(() => 0);
        context.onCompactProgress?.({ type: "compact_end" });
        context.setSDKStatus?.(null);
    }
}
```

**Caller handling (autoCompactDispatcher):**
```javascript
try {
    let standardResult = await performFullCompaction(...);
    return { wasCompacted: true, compactionResult: standardResult };
} catch (error) {
    if (!matchesErrorType(error, ExpectedCompactionError)) {
        logError(error);  // ← Log unexpected errors
    }
    return { wasCompacted: false };  // ← Graceful return
}
```

**Telemetry:**
- `tengu_compact_failed` - Logged with `reason`:
  - `"no_summary"` - LLM returned empty response
  - `"api_error"` - LLM API error
  - `"prompt_too_long"` - Conversation exceeds context window

**Impact:**
- Compaction aborted, conversation continues without compaction
- Will retry on next turn (when token count increases further)
- User sees error message (if not ExpectedCompactionError)

**Rollback:** No explicit rollback needed - conversation history unchanged (compaction only creates new messages, doesn't modify existing)

---

### 5. Empty or Malformed Templates

**Scenario:** Session memory template file is empty, malformed JSON, or has invalid structure

**Location:** `loadSessionMemoryTemplate()` - Template loading functions

**Detection:**
1. Template file doesn't exist
2. Template file exists but is empty
3. Template file contains invalid Markdown structure

**Recovery Flow:**
```javascript
async function loadSessionMemoryTemplate() {
    let customTemplatePath = getCustomTemplatePath();

    if (fs.existsSync(customTemplatePath)) {
        try {
            let template = await readFile(customTemplatePath, "utf-8");
            if (template.trim().length === 0) {
                logWarning("Custom template is empty, using default");
                return DEFAULT_TEMPLATE;  // ← Fallback to default
            }
            return template;
        } catch (error) {
            logError("Failed to read custom template:", error);
            return DEFAULT_TEMPLATE;  // ← Fallback to default
        }
    }

    return DEFAULT_TEMPLATE;  // ← Default if custom doesn't exist
}
```

**Default Template Structure:**
```markdown
# Session Title
# Current State
# Task specification
# Files and Functions
# Workflow
# Errors & Corrections
# Codebase and System Documentation
# Learnings
# Key results
# Worklog
```

**Validation:**
- Checks for required section headers
- Validates Markdown structure
- Ensures minimum length (> 0 characters)

**Impact:** Falls back to default template (safe, well-tested)

**Prevention:** Template schema validation on save, user warnings on malformed templates

---

### 6. Tool Dependency Tracking Failures

**Scenario:** Tool_use and tool_result messages are mismatched or incomplete

**Sub-scenarios:**
1. **Orphaned tool_result** - tool_result exists, but corresponding tool_use was deleted
2. **Orphaned tool_use** - tool_use exists, but tool_result never arrived
3. **Duplicate tool_use IDs** - Multiple tool_use blocks share same ID

**Location:** `adjustBoundariesForTools()` (pCA) - chunks.147.mjs:553-588

**Detection & Recovery:**

**Orphaned tool_result:**
```javascript
// Collect tool_result IDs in keep window
let toolResultIds = [];
for (let i = boundaryIndex; i < messages.length; i++) {
    toolResultIds.push(...extractToolResultIds(messages[i]));
}

// Find tool_use IDs in keep window
let toolUseIdsInWindow = new Set();
for (let i = boundaryIndex; i < messages.length; i++) {
    // ... extract tool_use IDs ...
}

// Find orphaned tool results (results without corresponding tool_use)
let orphanedToolResultIds = toolResultIds.filter(id => !toolUseIdsInWindow.has(id));

// Expand boundary backward to include missing tool_use messages
for (let i = boundaryIndex - 1; i >= 0 && orphanedToolResultIds.size > 0; i--) {
    if (hasToolUseWithId(messages[i], orphanedToolResultIds)) {
        boundaryIndex = i;  // ← Recovery: Include earlier message
        // Remove found IDs from orphans
        orphanedToolResultIds.delete(foundId);
    }
}

// If orphanedToolResultIds still non-empty after scan to index 0:
// → Orphaned result truly has no tool_use (data loss/corruption)
// → Keep orphaned result anyway (conservative approach)
```

**Orphaned tool_use:**
- Not explicitly detected (forward-looking dependency)
- If user message contains tool_use but no subsequent tool_result:
  - LLM will detect missing result and may hallucinate or request re-execution
  - No automatic recovery (requires user intervention)

**Duplicate tool_use IDs:**
- Handled by Map structure (last ID wins)
- Phase 3 of `adjustBoundariesForTools()` deduplicates assistant messages by message.id

**Telemetry:** Not explicitly tracked (silent recovery)

**Impact:**
- Orphaned tool_result: Boundary moved backward → Larger keep window
- Orphaned tool_use: LLM may be confused, but system doesn't crash

**Prevention:**
- Tool execution system ensures tool_use → tool_result pairs are atomically added
- Message UUID validation prevents duplicate IDs

---

## Component-Specific Error Handling

### State Collectors

**File Collector Failures:**
```javascript
let fileAttachments = await Promise.all(
    selectedFiles.map(async (file) => {
        let content = await readFileForAttachment(file.filename, ...);
        return content ? createAttachmentMessage(content) : null;
        //         ↑ Recovery: Return null if read fails
    })
);

// Filter out null results
return fileAttachments.filter((attachment) => attachment !== null);
//                      ↑ Recovery: Skip failed files, keep successful ones
```

**Impact:** Partial file preservation (some files lost, but compaction succeeds)

**Task Collector Failures:**
```javascript
async function collectTasksToKeep(context) {
    let appState = await context.getAppState();  // ← Can throw
    // ... collect tasks ...
}
```

**If `getAppState()` throws:** Exception bubbles up to `performFullCompaction()` → Entire compaction fails

**Mitigation:** Caller wraps in try-catch, falls back to `wasCompacted: false`

---

### Microcompaction Errors

**Tool Result Persistence Failure:**
```javascript
let persistResult = await persistToolResult(content, toolUseId);

if (isErrorResult(persistResult)) {
    // ← Recovery: Use fallback message instead of file reference
    replacementContent = CLEARED_CONTENT_MESSAGE;  // "[Old tool result content cleared]"
} else {
    replacementContent = `<persisted-output>Tool result saved to: ${persistResult.filepath}</persisted-output>`;
}
```

**Impact:** Loses original tool result content (can't recover), but compaction continues

---

### Hook Execution Errors

**Hook Timeout:**
```javascript
let timeoutSignal = AbortSignal.timeout(5000);  // 5-second timeout

try {
    let result = await hook.callback(hookInput, toolUseID, timeoutSignal, index);
} catch (error) {
    // ← Recovery: Log error, return failed result
    return {
        command: "callback",
        succeeded: false,
        output: error.message
    };
}
```

**Impact:** Hook failure logged, compaction continues with other hooks

**All Hooks Fail:**
- PreCompact: `newCustomInstructions` undefined → Standard summary generated
- SessionStart: No additional context → Clean compaction

---

## Validation & Sanitization

### Message Validation

**Empty messages array:**
```javascript
if (messages.length === 0) {
    throw Error("Cannot compact empty messages array");
}
```

**Recovery:** Throws immediately (compaction can't proceed)

### Token Count Validation

**Negative or NaN token counts:**
```javascript
let tokenCount = Math.max(0, Math.ceil(estimatedTokens * 1.3333));
//                ↑ Recovery: Clamp to 0 minimum
```

### File Path Validation

**Invalid or malicious file paths:**
```javascript
let resolvedPath = path.resolve(basePath, relativePath);

if (!resolvedPath.startsWith(basePath)) {
    throw Error("Path traversal detected");  // ← Security: Reject malicious paths
}
```

---

## Retry Strategies

### LLM API Retry

**Location:** `generateConversationSummary()` (ga4) - chunks.146.mjs:2603-2655

**Strategy:** Retry streaming with fresh API call
```javascript
let retryEnabled = checkFeatureFlag("tengu_compact_streaming_retry", false);
let maxRetries = retryEnabled ? MAX_COMPACT_RETRIES : 1;

for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // ... attempt streaming summarization ...

    if (assistantMessage) {
        return assistantMessage;  // ← Success
    }

    if (attempt < maxRetries) {
        reportTelemetry("tengu_compact_streaming_retry", { attempt });
        continue;  // ← Retry
    }
}

throw Error("Failed after retries");
```

**Retry Count:** Default 2 retries (3 total attempts)

**Telemetry:** `tengu_compact_streaming_retry` logged on each retry

---

## User-Facing Error Messages

### Compaction Aborted

**Scenario:** Compaction fails due to LLM API error

**User Message:**
```
⚠️ Compaction failed: [error message]

The conversation will continue without compaction. Compaction will retry automatically when token limits are approached again.
```

### Session Memory Unavailable

**Scenario:** Session memory compaction fails, falling back to standard

**User Message:**
```
ℹ️ Session memory compaction unavailable, using standard compaction.

This may take 10-30 seconds longer than session memory compaction.
```

### Hook Failure

**Scenario:** PreCompact hook fails

**User Message:**
```
⚠️ PreCompact [hook_name] failed: [error message]

Compaction will proceed with default behavior.
```

---

## Symbol Updates

No new symbols needed (all error handling is embedded in existing functions).

---

## Conclusion

The Compact feature implements **comprehensive error handling** with **graceful degradation** at every level:

1. **Dispatcher level**: Session memory → Standard → No compaction
2. **Component level**: Skip failed collectors, continue with successful ones
3. **Data level**: Validate and sanitize, reject malicious input
4. **Retry level**: Retry LLM API calls, timeout protection for hooks

**Key takeaway:** **Conversation continuity is prioritized over perfect compaction** - better to skip compaction and continue conversation than to crash on error.
