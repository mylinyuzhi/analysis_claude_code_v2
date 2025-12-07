# Compact System Implementation

## Overview

The Compact system in Claude Code manages conversation summarization and context window optimization. It allows long conversations to be compressed into summaries while preserving important context, preventing context overflow and maintaining conversation continuity.

**Key Features:**
- Two-tier compaction architecture (Micro-Compact + Full Compact)
- Intelligent message selection and filtering
- Multi-round compression with boundary markers
- Context preservation (files, todos, plans)
- Customizable via hooks and environment variables

### High-Level Algorithm Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPACT SYSTEM ALGORITHM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. TOKEN CHECK                                                              │
│     │                                                                        │
│     ├─► Get current token count from latest assistant message (ZK)          │
│     ├─► Calculate threshold: contextLimit - 13000 (aI2)                     │
│     └─► If below threshold → EXIT (no compaction needed)                    │
│                                                                              │
│  2. MICRO-COMPACT ATTEMPT (Si)                   [Fast, No API Call]        │
│     │                                                                        │
│     ├─► Scan messages for tool_use/tool_result pairs                        │
│     ├─► Keep last 3 tool results uncompressed                               │
│     ├─► Calculate potential token savings                                    │
│     ├─► If savings >= 20000 tokens:                                         │
│     │   └─► Replace old tool_result content with "[cleared]"                │
│     └─► If micro-compact sufficient → EXIT                                  │
│                                                                              │
│  3. FULL COMPACT (j91)                           [Slow, Requires LLM]       │
│     │                                                                        │
│     ├─► Run PreCompact hooks                                                │
│     ├─► Extract messages from last boundary marker (nk)                     │
│     ├─► Filter and normalize messages for LLM (WZ)                          │
│     ├─► Send to Claude with summarization prompt (R91)                      │
│     ├─► Validate response, extract summary text                             │
│     │                                                                        │
│     ├─► CONTEXT RESTORATION:                                                │
│     │   ├─► Re-read up to 5 recent files (50k token budget)                │
│     │   ├─► Restore todo list                                               │
│     │   └─► Restore plan file (if in plan mode)                            │
│     │                                                                        │
│     ├─► Create boundary marker (S91) with metadata                          │
│     ├─► Format summary message (T91) with continue instruction              │
│     ├─► Run SessionStart hooks                                              │
│     └─► Log telemetry                                                       │
│                                                                              │
│  4. OUTPUT STRUCTURE                                                         │
│     │                                                                        │
│     └─► [Old Messages] → [Boundary] → [Summary] → [Files] → [Todos] → [Plan]│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Constants Summary

| Category | Constant | Value | Description |
|----------|----------|-------|-------------|
| **Thresholds** | FREE_SPACE_BUFFER | 13,000 | Triggers auto-compact when this much space left |
| | WARNING_THRESHOLD | 20,000 | Show warning when this close to limit |
| | ERROR_THRESHOLD | 20,000 | Show error when this close to limit |
| **Micro-Compact** | MIN_TOKENS_TO_SAVE | 20,000 | Minimum savings required |
| | KEEP_LAST_N_TOOLS | 3 | Recent tool results to preserve |
| | TOKENS_PER_IMAGE | 2,000 | Fixed estimate per image |
| **Context Restore** | MAX_FILES | 5 | Maximum files to restore |
| | TOKENS_PER_FILE | 5,000 | Maximum tokens per file |
| | TOTAL_FILE_BUDGET | 50,000 | Total token budget for files |
| **Safety** | SAFETY_MULTIPLIER | 1.33x | Applied to token estimates |

---

## Two-Tier Compaction Architecture

Claude Code implements a **two-tier compaction system** that optimizes for both speed and thoroughness:

### Tier Comparison

| Aspect | Micro-Compact (`Si`) | Full Compact (`j91`) |
|--------|---------------------|---------------------|
| **Entry Function** | `Si()` chunks.107.mjs:1440 | `j91()` chunks.107.mjs:1120 |
| **Trigger** | First attempt (automatic) | Fallback when micro fails |
| **API Call** | NO (local processing) | YES (Claude summarization) |
| **Scope** | Tool results only | Full conversation |
| **Speed** | Fast (~milliseconds) | Slow (~seconds) |
| **Creates Summary** | No (truncates content) | Yes (LLM-generated) |
| **Token Savings** | Partial | Significant |

### Decision Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Token Count Check                         │
│                          │                                   │
│                          ▼                                   │
│              isAboveAutoCompactThreshold?                    │
│                    │           │                             │
│                   YES          NO → Return (no compact)      │
│                    │                                         │
│                    ▼                                         │
│           ┌─────────────────┐                                │
│           │ Try Micro-Compact │                              │
│           │     Si()         │                               │
│           └────────┬────────┘                                │
│                    │                                         │
│               Success?                                       │
│              │        │                                      │
│             YES       NO                                     │
│              │        │                                      │
│              ▼        ▼                                      │
│           Return   Full Compact (j91)                        │
│                         │                                    │
│                         ▼                                    │
│              ┌──────────────────┐                            │
│              │ Run PreCompact   │                            │
│              │ hooks            │                            │
│              └────────┬─────────┘                            │
│                       ▼                                      │
│              ┌──────────────────┐                            │
│              │ Send to Claude   │                            │
│              │ for summarization│                            │
│              └────────┬─────────┘                            │
│                       ▼                                      │
│              ┌──────────────────┐                            │
│              │ Create boundary  │                            │
│              │ marker (S91)     │                            │
│              └────────┬─────────┘                            │
│                       ▼                                      │
│              ┌──────────────────┐                            │
│              │ Restore context  │                            │
│              │ (files/todos)    │                            │
│              └────────┬─────────┘                            │
│                       ▼                                      │
│                    Return                                    │
└─────────────────────────────────────────────────────────────┘
```

### Main Dispatcher Function: `sI2()`

```javascript
// ============================================
// autoCompactDispatcher - Main entry point for auto-compaction (two-tier)
// Location: chunks.107.mjs:1707-1731
// ============================================

// ORIGINAL (for source lookup):
async function sI2(A, Q, B) { if (Y0(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 }; if (!await tD5(A, B)) return { wasCompacted: !1 }; let Z = await f91(A, Q.agentId, aI2()); if (Z) return { wasCompacted: !0, compactionResult: Z }; try { return { wasCompacted: !0, compactionResult: await j91(A, Q, !0, void 0, !0) } } catch (I) { if (!GKA(I, pMA)) AA(I instanceof Error ? I : Error(String(I))); return { wasCompacted: !1 } } }

// READABLE (for understanding):
async function autoCompactDispatcher(messages, sessionContext, sessionMemoryType) {
  // Check if compaction is disabled via environment
  if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false };
  }

  // Check if we should trigger auto-compact (threshold check)
  if (!await shouldTriggerAutoCompact(messages, sessionMemoryType)) {
    return { wasCompacted: false };
  }

  // TIER 1: Try micro-compact first (fast, no API call)
  // Only compresses tool_result blocks, keeps last 3 uncompressed
  let microResult = await tryMicroCompact(messages, sessionContext.agentId, getAutoCompactThreshold());
  if (microResult) {
    return { wasCompacted: true, compactionResult: microResult };
  }

  // TIER 2: Fall back to full compact (slow, requires API call)
  // Sends entire conversation to LLM for summarization
  try {
    return {
      wasCompacted: true,
      compactionResult: await fullCompact(messages, sessionContext, true, undefined, true)
    };
  } catch (error) {
    // Suppress expected "prompt_too_long" errors, log others
    if (!isExpectedError(error, "prompt_too_long")) {
      logError(error instanceof Error ? error : Error(String(error)));
    }
    return { wasCompacted: false };
  }
}

// Mapping: sI2→autoCompactDispatcher, Y0→parseBoolean, tD5→shouldTriggerAutoCompact,
//          f91→tryMicroCompact, aI2→getAutoCompactThreshold, j91→fullCompact,
//          GKA→isExpectedError, pMA→"prompt_too_long", AA→logError
```

**Algorithm Logic:**
1. **Disable Check**: Exit early if `DISABLE_COMPACT` env var is set
2. **Threshold Check**: Only proceed if token count exceeds auto-compact threshold
3. **Two-Tier Attempt**: Try micro-compact first (cheap), fall back to full compact (expensive)
4. **Error Handling**: Suppress expected errors (prompt_too_long), log unexpected ones

---

## Compact Trigger Strategy

### Three-Tier Threshold System

Claude Code uses a **three-tier threshold system** to manage context window usage:

```
┌─────────────────────────────────────────────────────────────┐
│                     Context Window                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│  │        Used Tokens           Available Space         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│                      ▲                  ▲              ▲     │
│                      │                  │              │     │
│              Auto-Compact         Warning          Error     │
│              Threshold           Threshold       Threshold   │
│           (contextLimit-13k)  (contextLimit-20k)(contextLimit-20k)
└─────────────────────────────────────────────────────────────┘
```

### Threshold Constants

**Location:** chunks.107.mjs:1733-1737

| Constant | Value | Purpose |
|----------|-------|---------|
| `zQ0` | 13,000 | FREE_SPACE_BUFFER - minimum tokens to keep available |
| `rD5` | 20,000 | WARNING_THRESHOLD - tokens from limit before warning |
| `oD5` | 20,000 | ERROR_THRESHOLD - tokens from limit before error |

### Threshold Calculation Function: `x1A()`

```javascript
// ============================================
// calculateThresholds - Computes all three threshold states from token count
// Location: chunks.107.mjs:1677-1691
// ============================================

// ORIGINAL (for source lookup):
function x1A(A) { let Q = aI2(), B = b1A() ? Q : TYA(), G = Math.max(0, Math.round((B - A) / B * 100)), Z = B - rD5, I = B - oD5, Y = A >= Z, J = A >= I, W = b1A() && A >= Q; return { percentLeft: G, isAboveWarningThreshold: Y, isAboveErrorThreshold: J, isAboveAutoCompactThreshold: W } }

// READABLE (for understanding):
function calculateThresholds(usedTokens) {
  let autoCompactThreshold = getAutoCompactThreshold();
  // Effective limit depends on auto-compact setting
  let contextLimit = isAutoCompactEnabled() ? autoCompactThreshold : getTotalContextLimit();
  let percentRemaining = Math.max(0, Math.round((contextLimit - usedTokens) / contextLimit * 100));

  // Calculate threshold levels (both warning and error use 20k buffer)
  let warningLevel = contextLimit - WARNING_THRESHOLD;        // contextLimit - 20000
  let errorLevel = contextLimit - ERROR_THRESHOLD;            // contextLimit - 20000
  let isAboveWarning = usedTokens >= warningLevel;
  let isAboveError = usedTokens >= errorLevel;
  // Auto-compact only triggers if feature is enabled AND threshold exceeded
  let isAboveAutoCompact = isAutoCompactEnabled() && usedTokens >= autoCompactThreshold;

  return {
    percentLeft: percentRemaining,
    isAboveWarningThreshold: isAboveWarning,
    isAboveErrorThreshold: isAboveError,
    isAboveAutoCompactThreshold: isAboveAutoCompact
  };
}

// Mapping: x1A→calculateThresholds, aI2→getAutoCompactThreshold, b1A→isAutoCompactEnabled,
//          TYA→getTotalContextLimit, rD5→WARNING_THRESHOLD(20000), oD5→ERROR_THRESHOLD(20000)
```

**Algorithm Logic:**
- **Context Limit Selection**: Uses autoCompactThreshold as effective limit when auto-compact enabled, otherwise full context limit
- **Percentage Calculation**: `(limit - used) / limit * 100`, clamped to 0 minimum
- **Three Independent Checks**: Warning, Error, AutoCompact - each can be true independently

### Dynamic Auto-Compact Threshold: `aI2()`

```javascript
// ============================================
// getAutoCompactThreshold - Returns token limit that triggers auto-compaction
// Location: chunks.107.mjs:1663-1674
// ============================================

// ORIGINAL (for source lookup):
function aI2() { let A = TYA(), Q = A - zQ0, B = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE; if (B) { let G = parseFloat(B); if (!isNaN(G) && G > 0 && G <= 100) { let Z = Math.floor(A * (G / 100)); return Math.min(Z, Q) } } return Q }

// READABLE (for understanding):
function getAutoCompactThreshold() {
  let totalContextLimit = getTotalContextLimit();
  let defaultThreshold = totalContextLimit - FREE_SPACE_BUFFER;  // contextLimit - 13000

  // Check for environment variable override (percentage of context)
  let percentOverride = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
  if (percentOverride) {
    let percentage = parseFloat(percentOverride);
    if (!isNaN(percentage) && percentage > 0 && percentage <= 100) {
      let customThreshold = Math.floor(totalContextLimit * (percentage / 100));
      // Never exceed default threshold (ensures 13k buffer minimum)
      return Math.min(customThreshold, defaultThreshold);
    }
  }

  return defaultThreshold;
}

// Mapping: aI2→getAutoCompactThreshold, TYA→getTotalContextLimit, zQ0→FREE_SPACE_BUFFER(13000)
```

**Algorithm Logic:**
- **Default Formula**: `threshold = contextLimit - 13000` (always keep 13k tokens free)
- **Override Formula**: `threshold = contextLimit * (PCT/100)`, capped at default
- **Example**: With 200k context, default threshold = 187k. Override 80% = 160k

### Token Counting Functions

#### Total Token Count: `ZK()`

```javascript
// ============================================
// countTotalTokens - Gets actual token count from API usage metadata
// Location: chunks.106.mjs:3551-3560
// ============================================

// ORIGINAL (for source lookup):
function ZK(A) { let Q = A.length - 1; while (Q >= 0) { let B = A[Q], G = B ? C91(B) : void 0; if (G) return E91(G); Q-- } return 0 }

// READABLE (for understanding):
function countTotalTokens(messages) {
  // Walk backwards through messages to find latest usage info
  // (Most recent assistant message contains cumulative token count)
  let index = messages.length - 1;
  while (index >= 0) {
    let message = messages[index];
    let usage = message ? extractUsageInfo(message) : undefined;
    if (usage) return calculateTotalTokenCount(usage);
    index--;
  }
  return 0;  // No usage info found
}

// Mapping: ZK→countTotalTokens, C91→extractUsageInfo, E91→calculateTotalTokenCount
```

**Algorithm Logic:**
- **Backward Scan**: Searches from newest to oldest message
- **Usage Extraction**: Each assistant message has `usage` metadata from API response
- **Cumulative Count**: Returns input + output + cache tokens

#### Approximate Token Counter: `gG()`

```javascript
// ============================================
// approximateTokenCount - Quick estimate without API call
// Location: chunks.88.mjs:385-387
// ============================================

// ORIGINAL (for source lookup):
function gG(A) { return Math.round(A.length / 4) }

// READABLE (for understanding):
function approximateTokenCount(text) {
  return Math.round(text.length / 4);  // Rough estimate: 1 token ≈ 4 characters
}

// Mapping: gG→approximateTokenCount
```

**Algorithm Logic:**
- **Heuristic**: English text averages ~4 characters per token
- **Use Case**: Quick local estimates before actual API token counting
- **Accuracy**: Rough, may underestimate code/punctuation-heavy text

---

## Message Selection Deep Dive

### How Messages Are Selected for Compaction

The compaction process uses two key functions to prepare messages:

1. **`nk()`** - Extracts messages from last boundary marker
2. **`WZ()`** - Filters and normalizes messages for summarization

### Boundary Extraction: `nk()`

```javascript
// ============================================
// keepMessagesAfterLastBoundary - Extracts messages from last compaction point
// Location: chunks.154.mjs:438-442
// ============================================

// ORIGINAL (for source lookup):
function nk(A) { let Q = yb3(A); if (Q === -1) return A; return A.slice(Q) }

// READABLE (for understanding):
function keepMessagesAfterLastBoundary(messages) {
  let lastBoundaryIndex = findLastBoundaryMarkerIndex(messages);
  if (lastBoundaryIndex === -1) {
    return messages;  // No previous compaction, return all messages
  }
  return messages.slice(lastBoundaryIndex);  // Return messages from boundary onward (inclusive)
}

// Mapping: nk→keepMessagesAfterLastBoundary, yb3→findLastBoundaryMarkerIndex
```

**Algorithm Logic:**
- **Purpose**: Ensures only messages after last compaction are re-summarized
- **Includes Boundary**: The boundary message itself is included (contains previous summary)
- **First Compaction**: Returns all messages if no boundary exists

**Boundary Marker Detection: `lh()`**

```javascript
// ============================================
// isBoundaryMarker - Checks if message is a compaction boundary
// Location: chunks.154.mjs:433-435
// ============================================

// ORIGINAL (for source lookup):
function lh(A) { return A?.type === "system" && A.subtype === "compact_boundary" }

// READABLE (for understanding):
function isBoundaryMarker(message) {
  return message?.type === "system" && message.subtype === "compact_boundary";
}

// Mapping: lh→isBoundaryMarker
```

**Boundary Marker Structure:**
- `type`: "system" (not shown to user)
- `subtype`: "compact_boundary" (unique identifier)
- `compactMetadata`: Contains trigger type and pre-compact token count

### Message Filtering: `WZ()`

```javascript
// ============================================
// filterAndNormalizeMessages - Prepares messages for LLM summarization
// Location: chunks.153.mjs:2547-2607
// ============================================

// READABLE PSEUDOCODE:
function filterAndNormalizeMessages(messages, excludePatterns = []) {
  // Step 1: Reorder messages to attach attachments to related messages
  let normalized = reorganizeAttachments(messages);

  let result = [];

  // Step 2: Filter out unwanted message types
  normalized = normalized.filter((msg) => {
    // EXCLUDE: progress messages
    if (msg.type === "progress") return false;

    // EXCLUDE: system messages
    if (msg.type === "system") return false;

    // EXCLUDE: synthetic API error messages
    if (isSyntheticErrorMessage(msg)) return false;

    return true;
  });

  // Step 3: Process and merge messages
  for (let msg of normalized) {
    switch (msg.type) {
      case "user": {
        let lastMsg = getLastMessage(result);
        if (lastMsg?.type === "user") {
          // Merge consecutive user messages
          result[result.indexOf(lastMsg)] = mergeUserMessages(lastMsg, msg);
          continue;
        }
        result.push(msg);
        continue;
      }

      case "assistant": {
        // Normalize tool_use inputs and merge if same ID
        let normalized = { ...msg, message: { ...msg.message, /* normalized content */ } };

        // Find and merge with last assistant message if same ID
        for (let i = result.length - 1; i >= 0; i--) {
          let existing = result[i];
          if (existing.type !== "assistant" && !isSkippable(existing)) break;
          if (existing.type === "assistant") {
            if (existing.message.id === normalized.message.id) {
              result[i] = mergeAssistantMessages(existing, normalized);
              continue;
            }
            break;
          }
        }
        result.push(normalized);
        continue;
      }

      case "attachment": {
        // Convert attachment to system messages and attach to previous user message
        let systemMessages = convertAttachmentToSystemMessages(msg.attachment);
        let lastMsg = getLastMessage(result);
        if (lastMsg?.type === "user") {
          result[result.indexOf(lastMsg)] = mergeAttachments(lastMsg, systemMessages);
          continue;
        }
        result.push(...systemMessages);
        continue;
      }
    }
  }

  // Step 4: Filter trailing thinking-only blocks
  return filterTrailingThinkingBlocks(result);
}
```

### Message Type Handling Summary

| Message Type | Included | Handling |
|--------------|----------|----------|
| `user` | YES | Merged with consecutive user messages |
| `assistant` | YES | Merged by ID, tool inputs normalized |
| `attachment` | YES | Converted to system messages |
| `tool_result` | YES (within user) | Included in user message content |
| `progress` | NO | Filtered out |
| `system` | NO | Filtered out (except boundary markers) |
| Synthetic errors | NO | Filtered via `wb3()` predicate |
| Thinking-only | NO | Filtered via `NQ0()` predicate |

### Filtering Predicates

```javascript
// ============================================
// Message Filter Predicates - Determine what gets included in summarization
// Location: chunks.153.mjs:2400-2450
// ============================================

// isUserMessageVisible - Controls user message inclusion
// ORIGINAL: function u59(A, Q) { if (A.type !== "user") return !0; if (A.isMeta) return !1; if (A.isVisibleInTranscriptOnly && !Q) return !1; return !0 }
function isUserMessageVisible(message, includeTranscriptOnly) {
  if (message.type !== "user") return true;           // Include non-user types
  if (message.isMeta) return false;                   // Exclude meta messages (internal)
  if (message.isVisibleInTranscriptOnly && !includeTranscriptOnly) return false;
  return true;
}

// isThinkingOnlyBlock - Detects assistant messages with only thinking content
// ORIGINAL: function NQ0(A) { if (A.type !== "assistant") return !1; if (!Array.isArray(A.message.content)) return !1; return A.message.content.every((B) => B.type === "thinking") }
function isThinkingOnlyBlock(message) {
  if (message.type !== "assistant") return false;
  if (!Array.isArray(message.message.content)) return false;
  // True if ALL content blocks are thinking blocks (no text output)
  return message.message.content.every((block) => block.type === "thinking");
}

// isSyntheticErrorMessage - Detects placeholder error messages
// ORIGINAL: function wb3(A) { return A.type === "assistant" && A.isApiErrorMessage === !0 && A.message.model === "<synthetic>" }
function isSyntheticErrorMessage(message) {
  return message.type === "assistant" &&
         message.isApiErrorMessage === true &&
         message.message.model === "<synthetic>";  // Not from real API
}

// Mapping: u59→isUserMessageVisible, NQ0→isThinkingOnlyBlock, wb3→isSyntheticErrorMessage
```

**Filtering Logic Summary:**
| Predicate | Purpose | Excludes |
|-----------|---------|----------|
| `isUserMessageVisible` | Hide internal messages | Meta messages, transcript-only in some contexts |
| `isThinkingOnlyBlock` | Remove pure-thinking responses | Assistant messages with no visible output |
| `isSyntheticErrorMessage` | Remove fake errors | Placeholder messages from error handling |

---

## Multi-Round Compression

### How Previous Summaries Are Handled

When a conversation has been compacted before, the system handles subsequent compactions through **boundary markers**:

```
┌─────────────────────────────────────────────────────────────┐
│                   FIRST COMPACTION                           │
│                                                              │
│  [Message 1] [Message 2] ... [Message N]                     │
│                      │                                       │
│                      ▼                                       │
│              LLM Summarization                               │
│                      │                                       │
│                      ▼                                       │
│  [Boundary₁] [Summary₁] [Restored Context]                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  SECOND COMPACTION                           │
│                                                              │
│  [Boundary₁] [Summary₁] [New Message 1] ... [New Message M]  │
│                      │                                       │
│                      ▼                                       │
│          nk() extracts from Boundary₁ onward                 │
│                      │                                       │
│                      ▼                                       │
│  [Summary₁] [New Message 1] ... [New Message M]              │
│                      │                                       │
│                      ▼                                       │
│              LLM Summarization                               │
│                      │                                       │
│                      ▼                                       │
│  [Boundary₂] [Summary₂] [Restored Context]                   │
└─────────────────────────────────────────────────────────────┘
```

### Key Insight: Summary Chaining

**Previous summaries ARE included in subsequent summarization:**

1. `nk()` extracts messages starting from the last boundary marker
2. The old summary message (with `isCompactSummary: true`) is included
3. Claude receives both the old summary AND new messages
4. Claude generates a new summary incorporating both

### Pros and Cons

| Pros | Cons |
|------|------|
| Continuous context chain | Summary-of-summary may drift from original |
| Prior summary informs new summary | Token overhead from including old summary |
| No information loss from old summaries | Potential for compression artifacts |
| Maintains conversation continuity | Older context may become increasingly abstract |

### Summary Content Handling: `MD5()`

```javascript
// ============================================
// cleanupSummaryTags - Normalizes LLM summary output format
// Location: chunks.107.mjs:735-752
// ============================================

// ORIGINAL (for source lookup):
function MD5(A) { let Q = A, B = Q.match(/<analysis>([\s\S]*?)<\/analysis>/); B && (Q = Q.replace(/<analysis>[\s\S]*?<\/analysis>/, `Analysis:\n${B[1].trim()}`)); let G = Q.match(/<summary>([\s\S]*?)<\/summary>/); return G && (Q = Q.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:\n${G[1].trim()}`)), Q = Q.replace(/\n\n+/g, `\n\n`), Q.trim() }

// READABLE (for understanding):
function cleanupSummaryTags(rawSummary) {
  let result = rawSummary;

  // Transform <analysis>...</analysis> to "Analysis:\n..."
  let analysisMatch = result.match(/<analysis>([\s\S]*?)<\/analysis>/);
  if (analysisMatch) {
    result = result.replace(/<analysis>[\s\S]*?<\/analysis>/, `Analysis:\n${analysisMatch[1].trim()}`);
  }

  // Transform <summary>...</summary> to "Summary:\n..."
  let summaryMatch = result.match(/<summary>([\s\S]*?)<\/summary>/);
  if (summaryMatch) {
    result = result.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:\n${summaryMatch[1].trim()}`);
  }

  // Collapse multiple newlines to double newline
  return result.replace(/\n\n+/g, '\n\n').trim();
}

// Mapping: MD5→cleanupSummaryTags
```

**Algorithm Logic:**
- **Tag Normalization**: Converts XML-style tags to plain text headers
- **Whitespace Cleanup**: Normalizes paragraph spacing
- **Preserves Content**: Only changes format, not substance

### Summary Message Generation: `T91()`

```javascript
// ============================================
// formatSummaryContent - Creates the user-visible summary message
// Location: chunks.107.mjs:754-760
// ============================================

// ORIGINAL (for source lookup):
function T91(A, Q) { let G = `This session is being continued from a previous conversation that ran out of context. The conversation is summarized below:\n${MD5(A)}.`; if (Q) return `${G}\nPlease continue the conversation from where we left it off without asking the user any further questions. Continue with the last task that you were asked to work on.`; return G }

// READABLE (for understanding):
function formatSummaryContent(summaryText, continueWithoutAsking) {
  let baseContent = `This session is being continued from a previous conversation that ran out of context. The conversation is summarized below:
${cleanupSummaryTags(summaryText)}.`;

  if (continueWithoutAsking) {
    // Auto-compact: instruct to continue without user interaction
    return `${baseContent}
Please continue the conversation from where we left it off without asking the user any further questions. Continue with the last task that you were asked to work on.`;
  }

  return baseContent;
}

// Mapping: T91→formatSummaryContent, MD5→cleanupSummaryTags
```

**Algorithm Logic:**
- **Base Message**: Always includes context explanation + cleaned summary
- **Auto-Continue**: When `continueWithoutAsking=true`, adds instruction to resume work
- **Use Cases**: Manual compact (no continue instruction) vs Auto-compact (with continue instruction)

---

## Context Preservation

### What Gets Preserved After Compaction

After compaction, the following context is automatically restored:

| Category | Function | Limit | Description |
|----------|----------|-------|-------------|
| Recent files | `bD5()` | 5 files, 50k tokens total | Most recently read files |
| Todo list | `fD5()` | All items | Current session todos |
| Plan file | `XQ0()` | Full content | Current plan if in plan mode |
| Boundary | `S91()` | 1 marker | Compaction metadata |

### File Read Restoration: `bD5()`

```javascript
// ============================================
// restoreFileReads - Re-reads recently accessed files after compaction
// Location: chunks.107.mjs:1248-1269
// ============================================

// ORIGINAL (for source lookup):
async function bD5(A, Q, B) { let G = Object.entries(A).map(([Y, J]) => ({ filename: Y, ...J })).filter((Y) => !hD5(Y.filename, Q.agentId)).sort((Y, J) => J.timestamp - Y.timestamp).slice(0, B), Z = await Promise.all(G.map(async (Y) => { let J = await VQ0(Y.filename, { ...Q, fileReadingLimits: { maxTokens: yD5 } }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact"); return J ? l9(J) : null })), I = 0; return Z.filter((Y) => { if (Y === null) return !1; let J = gG(JSON.stringify(Y)); if (I + J <= kD5) return I += J, !0; return !1 }) }

// READABLE (for understanding):
async function restoreFileReads(readFileState, sessionContext, maxFiles) {
  // Step 1: Convert read file state to array, filter agent files, sort by recency
  let fileEntries = Object.entries(readFileState)
    .map(([filename, metadata]) => ({ filename, ...metadata }))
    .filter((entry) => !isAgentFile(entry.filename, sessionContext.agentId))
    .sort((a, b) => b.timestamp - a.timestamp)  // Most recent first
    .slice(0, maxFiles);  // Limit to 5 files

  // Step 2: Re-read files with per-file token limits
  let restoredFiles = await Promise.all(
    fileEntries.map(async (entry) => {
      let fileContent = await readFileWithLimits(entry.filename, {
        ...sessionContext,
        fileReadingLimits: { maxTokens: 5000 }  // 5k tokens max per file
      });
      return fileContent ? createAttachment(fileContent) : null;
    })
  );

  // Step 3: Apply total token budget constraint
  let totalTokens = 0;
  return restoredFiles.filter((file) => {
    if (file === null) return false;
    let fileTokens = approximateTokenCount(JSON.stringify(file));
    if (totalTokens + fileTokens <= 50000) {  // 50k total budget
      totalTokens += fileTokens;
      return true;
    }
    return false;  // Exceeds budget, skip this file
  });
}

// Mapping: bD5→restoreFileReads, hD5→isAgentFile, VQ0→readFileWithLimits, l9→createAttachment, gG→approximateTokenCount
// Constants: _D5=5 (maxFiles), yD5=5000 (tokensPerFile), kD5=50000 (totalBudget)
```

**Algorithm Logic:**
1. **Selection**: Filter out agent-related files, sort by access time
2. **Truncation**: Each file limited to 5k tokens
3. **Budget Control**: Total restored files capped at 50k tokens
4. **Priority**: Most recently accessed files restored first

### Todo List Restoration: `fD5()`

```javascript
// ============================================
// restoreTodoList - Reattaches current todo list after compaction
// Location: chunks.107.mjs:1271-1280
// ============================================

// ORIGINAL (for source lookup):
function fD5(A) { let Q = Nh(A); if (Q.length === 0) return null; return l9({ type: "todo", content: Q, itemCount: Q.length, context: "post-compact" }) }

// READABLE (for understanding):
function restoreTodoList(agentId) {
  let todos = readTodosFromFile(agentId);
  if (todos.length === 0) return null;  // No todos to restore
  return createAttachment({
    type: "todo",
    content: todos,
    itemCount: todos.length,
    context: "post-compact"
  });
}

// Mapping: fD5→restoreTodoList, Nh→readTodosFromFile, l9→createAttachment
```

**Algorithm Logic:**
- **Source**: Reads from todo file (persisted to disk)
- **Skip Empty**: Returns null if no todos exist
- **Attachment Type**: Creates special "todo" attachment for context injection

### Plan File Restoration: `XQ0()`

```javascript
// ============================================
// restorePlanFile - Reattaches current plan file if in plan mode
// Location: chunks.107.mjs:1282-1291
// ============================================

// ORIGINAL (for source lookup):
function XQ0(A) { let Q = xU(A); if (!Q) return null; let B = yU(A); return l9({ type: "plan_file_reference", planFilePath: B, planContent: Q }) }

// READABLE (for understanding):
function restorePlanFile(agentId) {
  let planContent = readPlanFile(agentId);
  if (!planContent) return null;  // No active plan
  let planPath = getPlanFilePath(agentId);
  return createAttachment({
    type: "plan_file_reference",
    planFilePath: planPath,
    planContent: planContent
  });
}

// Mapping: XQ0→restorePlanFile, xU→readPlanFile, yU→getPlanFilePath, l9→createAttachment
```

**Algorithm Logic:**
- **Plan Mode Check**: Only restores if plan file exists
- **Full Content**: Includes complete plan text (no truncation)
- **Path Reference**: Includes file path for user context

### Message Reconstruction Order

After compaction, messages are reconstructed in this order:

```
[Old messages before boundary (kept as history)]
    ↓
[Boundary Marker] ← S91() - marks compaction point
    ↓
[Summary Message] ← T91() - LLM-generated summary with isCompactSummary: true
    ↓
[Restored File Reads] ← bD5() - up to 5 files
    ↓
[Todo List] ← fD5() - current todos
    ↓
[Plan File] ← XQ0() - current plan
    ↓
[Hook Results] ← PostCompact hook outputs
    ↓
[New Messages] ← Messages created after compaction trigger
```

---

## Tool Call Result Handling

### Micro-Compact: Tool Result Compression

The micro-compact system specifically targets **tool_result** blocks to reduce token usage without requiring a full LLM summarization.

### Micro-Compact Function: `Si()`

```javascript
// ============================================
// microCompactToolResults - Compresses old tool results without LLM call
// Location: chunks.107.mjs:1440-1545
// ============================================

// READABLE PSEUDOCODE (full original too long to inline):
async function microCompactToolResults(messages, tokenThreshold, readFileState) {
  // Constants
  const MIN_TOKENS_TO_SAVE = 20000;     // mD5
  const KEEP_LAST_N_TOOLS = 3;          // cD5
  const TOKENS_PER_IMAGE = 2000;        // lI2

  // Step 1: Scan for tool_use and tool_result pairs
  let toolUseIds = [];
  let toolResultTokens = new Map();

  for (let msg of messages) {
    if ((msg.type === "user" || msg.type === "assistant") && Array.isArray(msg.message.content)) {
      for (let block of msg.message.content) {
        // Track tool_use blocks for eligible tools
        if (block.type === "tool_use" && ELIGIBLE_TOOLS.has(block.name)) {
          if (!ALREADY_COMPACTED.has(block.id)) {
            toolUseIds.push(block.id);
          }
        }
        // Calculate token count for matching tool_result blocks
        else if (block.type === "tool_result" && toolUseIds.includes(block.tool_use_id)) {
          let tokens = calculateToolResultTokens(block);
          toolResultTokens.set(block.tool_use_id, tokens);
        }
      }
    }
  }

  // Step 2: Identify which tool results to KEEP (last 3)
  let toKeep = toolUseIds.slice(-KEEP_LAST_N_TOOLS);

  // Step 3: Calculate potential savings
  let totalTokens = Array.from(toolResultTokens.values()).reduce((sum, t) => sum + t, 0);
  let toCompress = new Set();
  let savings = 0;

  for (let id of toolUseIds) {
    if (toKeep.includes(id)) continue;  // Skip last 3
    if (totalTokens - savings > tokenThreshold) {
      toCompress.add(id);
      savings += toolResultTokens.get(id) || 0;
    }
  }

  // Step 4: Check if compression is worthwhile
  if (savings < MIN_TOKENS_TO_SAVE) {
    return null;  // Not enough savings, skip micro-compact
  }

  // Step 5: Replace old tool_result content
  let compressedMessages = messages.map((msg) => {
    if (msg.type === "user") {
      let newContent = msg.message.content.map((block) => {
        if (block.type === "tool_result" && toCompress.has(block.tool_use_id)) {
          return {
            ...block,
            content: "[Old tool result content cleared]"  // TRUNCATE!
          };
        }
        return block;
      });
      return { ...msg, message: { ...msg.message, content: newContent } };
    }
    return msg;
  });

  // Step 6: Track what was compacted
  for (let id of toCompress) {
    ALREADY_COMPACTED.add(id);  // DQ0 set
  }

  return {
    messages: compressedMessages,
    toolsCompacted: toCompress.size,
    tokensSaved: savings
  };
}
```

**Micro-Compact Algorithm Visualization:**

```
BEFORE MICRO-COMPACT:
┌──────────────────────────────────────────────────────────────────────────┐
│ Message History                                                           │
├──────────────────────────────────────────────────────────────────────────┤
│ [tool_use: Read file.ts]        → [tool_result: 5000 tokens] ← COMPRESS │
│ [tool_use: Read config.json]    → [tool_result: 3000 tokens] ← COMPRESS │
│ [tool_use: Grep "function"]     → [tool_result: 2000 tokens] ← COMPRESS │
│ [tool_use: Read test.ts]        → [tool_result: 4000 tokens] ← KEEP (3) │
│ [tool_use: Edit main.ts]        → [tool_result: 1000 tokens] ← KEEP (2) │
│ [tool_use: Bash "npm test"]     → [tool_result: 2000 tokens] ← KEEP (1) │
└──────────────────────────────────────────────────────────────────────────┘
Total: 17000 tokens in tool results

AFTER MICRO-COMPACT:
┌──────────────────────────────────────────────────────────────────────────┐
│ [tool_use: Read file.ts]        → "[Old tool result content cleared]"   │
│ [tool_use: Read config.json]    → "[Old tool result content cleared]"   │
│ [tool_use: Grep "function"]     → "[Old tool result content cleared]"   │
│ [tool_use: Read test.ts]        → [tool_result: 4000 tokens] (intact)   │
│ [tool_use: Edit main.ts]        → [tool_result: 1000 tokens] (intact)   │
│ [tool_use: Bash "npm test"]     → [tool_result: 2000 tokens] (intact)   │
└──────────────────────────────────────────────────────────────────────────┘
Savings: 10000 tokens (5000 + 3000 + 2000)
```

**Key Algorithm Properties:**
1. **Idempotent**: `ALREADY_COMPACTED` set prevents re-compressing same tool results
2. **LRU-like**: Always keeps the N most recent tool results intact
3. **Threshold-gated**: Only triggers if savings >= 20000 tokens (avoids thrashing)
4. **Non-destructive to tool_use**: Only modifies tool_result blocks, preserves tool_use for context

### Token Counting for Tool Results: `iI2()` and `EQ0()`

```javascript
// ============================================
// countToolResultTokens - Counts tokens in a single tool_result block
// Location: chunks.107.mjs:1400-1415
// ============================================

// ORIGINAL (for source lookup):
function iI2(A) { if (!A.content) return 0; if (typeof A.content === "string") return gG(A.content); return A.content.reduce((Q, B) => { if (B.type === "text") return Q + gG(B.text); else if (B.type === "image") return Q + lI2; return Q }, 0) }

// READABLE (for understanding):
function countToolResultTokens(toolResult) {
  if (!toolResult.content) return 0;

  // Simple string content
  if (typeof toolResult.content === "string") {
    return approximateTokenCount(toolResult.content);  // length / 4
  }

  // Array of content blocks (text, images)
  return toolResult.content.reduce((total, block) => {
    if (block.type === "text") return total + approximateTokenCount(block.text);
    else if (block.type === "image") return total + TOKENS_PER_IMAGE;  // 2000 fixed
    return total;
  }, 0);
}

// Mapping: iI2→countToolResultTokens, gG→approximateTokenCount, lI2→TOKENS_PER_IMAGE(2000)
```

```javascript
// ============================================
// countMessageTokensWithSafetyMargin - Total tokens with 1.33x safety buffer
// Location: chunks.107.mjs:1417-1427
// ============================================

// ORIGINAL (for source lookup):
function EQ0(A) { let Q = 0; for (let B of A) { if (B.type !== "user" && B.type !== "assistant") continue; if (!Array.isArray(B.message.content)) continue; for (let G of B.message.content) { if (G.type === "text") Q += gG(G.text); else if (G.type === "tool_result") Q += iI2(G); else if (G.type === "image") Q += lI2; else Q += gG(JSON.stringify(G)) } } return Math.ceil(Q * 1.3333333333333333) }

// READABLE (for understanding):
function countMessageTokensWithSafetyMargin(messages) {
  let totalTokens = 0;

  for (let message of messages) {
    // Only count user and assistant messages
    if (message.type !== "user" && message.type !== "assistant") continue;
    if (!Array.isArray(message.message.content)) continue;

    for (let block of message.message.content) {
      if (block.type === "text") totalTokens += approximateTokenCount(block.text);
      else if (block.type === "tool_result") totalTokens += countToolResultTokens(block);
      else if (block.type === "image") totalTokens += TOKENS_PER_IMAGE;
      else totalTokens += approximateTokenCount(JSON.stringify(block));  // Fallback
    }
  }

  // Apply 1.33x safety multiplier to avoid underestimation
  return Math.ceil(totalTokens * 1.3333333333333333);
}

// Mapping: EQ0→countMessageTokensWithSafetyMargin, iI2→countToolResultTokens, gG→approximateTokenCount
```

**Algorithm Logic:**
- **Per-Block Counting**: Different strategies for text, images, tool results
- **Image Fixed Cost**: 2000 tokens per image (conservative estimate)
- **Safety Multiplier**: 1.33x buffer accounts for tokenization variance
- **Fallback**: Unknown block types serialized and estimated

### Micro-Compact Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `mD5` | 20,000 | Minimum tokens to save before micro-compact worthwhile |
| `dD5` | 40,000 | Default token threshold for tool result compression |
| `cD5` | 3 | Number of recent tool results to KEEP uncompressed |
| `lI2` | 2,000 | Token estimate for single image in tool_result |

### Tool Result Registries

| Registry | Type | Purpose |
|----------|------|---------|
| `pD5` | Set | Eligible tool names for compression |
| `DQ0` | Set | Tool_use IDs that have been compacted (prevents re-compression) |
| `pI2` | Map | Token count cache per tool_use_id |
| `CQ0` | Set | Conversations that have been micro-compacted |
| `HQ0` | Set | Memory attachment tracking |

---

## /compact Command Implementation

### Manual Compaction Function: `j91()`

```javascript
// ============================================
// fullCompact - Complete LLM-based conversation summarization
// Location: chunks.107.mjs:1120-1237
// ============================================

// ORIGINAL: See chunks.107.mjs:1120-1237 (function too long to inline)

// READABLE (for understanding):
async function fullCompact(messages, sessionContext, continueWithoutAsking, customInstructions, isAutoTrigger = false) {
  try {
    // === PHASE 1: Validation & Setup ===
    if (messages.length === 0) {
      throw Error("Not enough messages to compact.");
    }

    let preCompactTokenCount = countTotalTokens(messages);
    let metrics = extractMetrics(messages);

    // === PHASE 2: Run PreCompact Hooks ===
    sessionContext.setSpinnerMessage?.("Running PreCompact hooks...");
    sessionContext.setSDKStatus?.("compacting");

    let hookResult = await runPreCompactHooks({
      trigger: isAutoTrigger ? "auto" : "manual",
      customInstructions: customInstructions ?? null,
      sessionId: sessionContext.agentId
    }, sessionContext.abortController.signal);

    // Merge hook-provided instructions
    if (hookResult.newCustomInstructions) {
      customInstructions = customInstructions
        ? `${customInstructions}\n\n${hookResult.newCustomInstructions}`
        : hookResult.newCustomInstructions;
    }

    // === PHASE 3: Generate Summary via LLM ===
    sessionContext.setSpinnerMessage?.("Compacting conversation");

    let prompt = getSummarizationPrompt(customInstructions);
    let promptMessage = createMetaBlock({ content: prompt });

    // Prepare messages: extract from boundary + add prompt
    let messagesToSummarize = filterAndNormalizeMessages([
      ...keepMessagesAfterLastBoundary(messages),
      promptMessage
    ]);

    // Stream response from small fast model
    let response = await streamSummarizationRequest({
      messages: messagesToSummarize,
      systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."],
      model: getSmallFastModel(),  // k3() - uses cheaper model for compaction
      maxThinkingTokens: 0  // No thinking needed for summarization
    });

    // === PHASE 4: Validate Response ===
    let summaryText = extractTextFromResponse(response);
    if (!summaryText) {
      logTelemetry("tengu_compact_failed", { reason: "no_summary" });
      throw Error("Failed to generate conversation summary");
    }
    if (summaryText.startsWith(API_ERROR_PREFIX)) {
      logTelemetry("tengu_compact_failed", { reason: "api_error" });
      throw Error(summaryText);
    }

    // === PHASE 5: Restore Context ===
    let fileState = cloneReadFileState(sessionContext.readFileState);
    sessionContext.readFileState.clear();

    let attachments = await restoreFileReads(fileState, sessionContext, 5);

    let todoAttachment = restoreTodoList(sessionContext.agentId);
    if (todoAttachment) attachments.push(todoAttachment);

    let planAttachment = restorePlanFile(sessionContext.agentId);
    if (planAttachment) attachments.push(planAttachment);

    // === PHASE 6: Run SessionStart Hooks ===
    sessionContext.setSpinnerMessage?.("Running SessionStart hooks...");
    let sessionStartHookResults = await runSessionStartHooks("compact");

    // === PHASE 7: Create Output ===
    let boundaryMarker = createBoundaryMarker(
      isAutoTrigger ? "auto" : "manual",
      preCompactTokenCount ?? 0
    );

    let summaryMessages = [createMetaBlock({
      content: formatSummaryContent(summaryText, continueWithoutAsking),
      isCompactSummary: true,
      isVisibleInTranscriptOnly: true
    })];

    // === PHASE 8: Log Telemetry ===
    let postCompactTokenCount = countTotalTokens([response]);
    logTelemetry("tengu_compact", {
      preCompactTokenCount,
      postCompactTokenCount,
      ...metrics
    });

    return {
      boundaryMarker,
      summaryMessages,
      attachments,
      hookResults: sessionStartHookResults,
      userDisplayMessage: hookResult.userDisplayMessage,
      preCompactTokenCount,
      postCompactTokenCount
    };

  } catch (error) {
    handleCompactError(error, sessionContext);
    throw error;
  } finally {
    // Reset UI state
    sessionContext.setStreamMode?.("requesting");
    sessionContext.setSpinnerMessage?.(null);
    sessionContext.setSDKStatus?.(null);
  }
}

// Key Mappings:
// j91→fullCompact, ZK→countTotalTokens, R91→getSummarizationPrompt, R0→createMetaBlock
// WZ→filterAndNormalizeMessages, nk→keepMessagesAfterLastBoundary, k3→getSmallFastModel
// bD5→restoreFileReads, fD5→restoreTodoList, XQ0→restorePlanFile, S91→createBoundaryMarker
// T91→formatSummaryContent, FQ0→runPreCompactHooks, wq→runSessionStartHooks
```

**Algorithm Overview (8 Phases):**

| Phase | Operation | Key Function |
|-------|-----------|--------------|
| 1 | Validation & Setup | Validate messages, count tokens |
| 2 | PreCompact Hooks | Run user-defined hooks, merge custom instructions |
| 3 | LLM Summarization | Stream summary from small fast model |
| 4 | Response Validation | Check for errors, extract summary text |
| 5 | Context Restoration | Re-read files (5 max), todos, plan |
| 6 | SessionStart Hooks | Run post-compact hooks |
| 7 | Output Construction | Create boundary marker, format summary |
| 8 | Telemetry | Log token counts, usage metrics |

### Compaction Process Summary

1. **Validate** messages exist
2. **Count** pre-compaction tokens
3. **Run** PreCompact hooks
4. **Generate** summary using small fast model (not main model)
5. **Restore** important context (files, todos, plans)
6. **Run** SessionStart hooks
7. **Create** boundary marker and summary messages
8. **Log** telemetry
9. **Return** compaction result

### Boundary Marker: `S91()`

```javascript
// ============================================
// createBoundaryMarker - Creates compaction point marker for multi-round tracking
// Location: chunks.154.mjs:395-409
// ============================================

// ORIGINAL (for source lookup):
function S91(A, Q) { return { type: "system", subtype: "compact_boundary", content: "Conversation compacted", isMeta: !1, timestamp: new Date().toISOString(), uuid: nO(), level: "info", compactMetadata: { trigger: A, preTokens: Q } } }

// READABLE (for understanding):
function createBoundaryMarker(triggerType, preCompactTokenCount) {
  return {
    type: "system",                    // System message (not shown to user)
    subtype: "compact_boundary",       // Unique identifier for boundary detection
    content: "Conversation compacted",
    isMeta: false,
    timestamp: new Date().toISOString(),
    uuid: generateUUID(),
    level: "info",
    compactMetadata: {
      trigger: triggerType,            // "auto" or "manual"
      preTokens: preCompactTokenCount  // Token count before compaction
    }
  };
}

// Mapping: S91→createBoundaryMarker, nO→generateUUID
```

**Boundary Marker Properties:**
| Property | Value | Purpose |
|----------|-------|---------|
| `type` | "system" | Hidden from user display |
| `subtype` | "compact_boundary" | Detection key for `lh()` / `isBoundaryMarker()` |
| `compactMetadata.trigger` | "auto" / "manual" | Track compaction source |
| `compactMetadata.preTokens` | number | Track token reduction |

---

## Complete Summarization Prompt

### Prompt Template: `R91()`

```javascript
// ============================================
// getSummarizationPrompt - Generates the LLM prompt for conversation summarization
// Location: chunks.107.mjs:537-733
// ============================================

// ORIGINAL: See chunks.107.mjs:537-733 (prompt template too long to inline)

// READABLE (for understanding):
function getSummarizationPrompt(customInstructions) {
  const BASE_PROMPT = `Your task is to create a detailed summary of the conversation so far...
[PROMPT CONTENT - See below for full structure]
...Please provide your summary based on the conversation so far.`;

  if (!customInstructions || customInstructions.trim() === "") {
    return BASE_PROMPT;
  }

  // Append custom instructions from PreCompact hooks
  return `${BASE_PROMPT}\n\nAdditional Instructions:\n${customInstructions}`;
}

// Mapping: R91→getSummarizationPrompt
```

**Full Prompt Structure:**

The summarization prompt instructs Claude to:

1. **Wrap analysis in `<analysis>` tags** - Organize thoughts before summarizing
2. **Chronologically analyze** each message, identifying:
   - User's explicit requests and intents
   - Claude's approach to addressing requests
   - Key decisions, technical concepts, code patterns
   - Specific details (file names, code snippets, function signatures)
   - Errors encountered and fixes applied
   - User feedback (especially corrections)

**Required Summary Sections:**

| # | Section | Content |
|---|---------|---------|
| 1 | Primary Request and Intent | User's explicit requests in detail |
| 2 | Key Technical Concepts | Technologies and frameworks discussed |
| 3 | Files and Code Sections | Files examined/modified with code snippets |
| 4 | Errors and Fixes | Problems encountered and solutions |
| 5 | Problem Solving | Troubleshooting documentation |
| 6 | All User Messages | Non-tool-result user messages (critical for intent) |
| 7 | Pending Tasks | Outstanding work items |
| 8 | Current Work | What was being worked on immediately before |
| 9 | Optional Next Step | Recommended continuation (with verbatim quotes) |

**Key Design Decisions:**
- Uses `<analysis>` tags for structured reasoning
- Emphasizes verbatim quotes to prevent task drift
- Prioritizes recent messages over older context
- Includes custom instructions from PreCompact hooks

---

## Configuration Options

### Environment Variables

```bash
# Disable all compaction
DISABLE_COMPACT=1

# Override auto-compact threshold (percentage of context)
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80

# Disable micro-compaction only (via experiment flag)
# BZ("cc_microcompact_ext", "mc_disabled", false)
```

### Settings

```json
{
  "autoCompactEnabled": true
}
```

Retrieved via `N1().autoCompactEnabled`

### Experiment Flags

```javascript
BZ("cc_microcompact_ext", "mc_disabled", false)
```

Controls micro-compaction behavior.

---

## PreCompact Hooks

### Hook Registry

**Location:** chunks.107.mjs:1011 and 1059

```javascript
{
  SessionStart: [],
  SessionEnd: [],
  Stop: [],
  SubagentStart: [],
  SubagentStop: [],
  PreCompact: [],       // ← Runs BEFORE compaction
  PermissionRequest: []
}
```

### Hook Execution

**Location:** chunks.107.mjs:1132-1137

```javascript
let X = await FQ0({
  trigger: Z ? "auto" : "manual",
  customInstructions: G ?? null,
  sessionId: Q.agentId
}, Q.abortController.signal);
```

**Hook Context:**
```javascript
{
  trigger: "auto" | "manual",
  customInstructions: string | null,
  sessionId: string
}
```

### Hook Results

PreCompact hooks can:
- Add custom instructions to compaction prompt (`newCustomInstructions`)
- Provide user display message (`userDisplayMessage`)
- Influence summary generation

---

## Telemetry Events

### Full Compact Telemetry: `tengu_compact`

```javascript
GA("tengu_compact", {
  preCompactTokenCount: I,
  postCompactTokenCount: v,
  compactionInputTokens: x?.input_tokens,
  compactionOutputTokens: x?.output_tokens,
  compactionCacheReadTokens: x?.cache_read_input_tokens ?? 0,
  compactionCacheCreationTokens: x?.cache_creation_input_tokens ?? 0,
  compactionTotalTokens: x ? x.input_tokens + (x.cache_creation_input_tokens ?? 0) + (x.cache_read_input_tokens ?? 0) + x.output_tokens : 0,
  ...metrics
});
```

### Micro-Compact Telemetry: `tengu_microcompact`

```javascript
GA("tengu_microcompact", {
  toolsCompacted: compressedTools.size,
  totalUncompactedTokens: totalTokens,
  tokensAfterCompaction: totalTokens - savedTokens,
});
```

### Failure Telemetry: `tengu_compact_failed`

| Reason | Description |
|--------|-------------|
| `no_summary` | LLM didn't generate summary |
| `api_error` | API returned error |
| `prompt_too_long` | Prompt exceeded limits |

### Threshold Exceeded: `tengu_sm_compact_threshold_exceeded`

Logged when post-compaction token count still exceeds threshold.

---

## Constants Reference

### Threshold Constants

| Constant | Obfuscated | Value | Description |
|----------|------------|-------|-------------|
| FREE_SPACE_BUFFER | `zQ0` | 13,000 | Minimum tokens to keep available |
| WARNING_THRESHOLD | `rD5` | 20,000 | Tokens from limit before warning |
| ERROR_THRESHOLD | `oD5` | 20,000 | Tokens from limit before error |

### Micro-Compact Constants

| Constant | Obfuscated | Value | Description |
|----------|------------|-------|-------------|
| MIN_TOKENS_TO_SAVE | `mD5` | 20,000 | Min savings before micro-compact |
| DEFAULT_TOKEN_THRESHOLD | `dD5` | 40,000 | Default micro-compact threshold |
| KEEP_LAST_N_TOOLS | `cD5` | 3 | Tool results to keep uncompressed |
| TOKENS_PER_IMAGE | `lI2` | 2,000 | Token estimate per image |

### Context Restoration Constants

| Constant | Obfuscated | Value | Description |
|----------|------------|-------|-------------|
| MAX_FILES_TO_RESTORE | `_D5` | 5 | Maximum files to restore |
| MAX_TOKENS_PER_FILE | `yD5` | 5,000 | Token limit per file |
| TOTAL_FILE_TOKEN_BUDGET | `kD5` | 50,000 | Total token budget for files |

### Timing Constants

| Constant | Obfuscated | Value | Description |
|----------|------------|-------|-------------|
| SUMMARY_WRITE_MAX_WAIT | `gD5` | 15,000 | Max wait for summary write (ms) |
| SUMMARY_WRITE_TIMEOUT | `uD5` | 60,000 | Timeout for summary write (ms) |

---

## Related Symbols

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `fullCompact` (j91) - Full LLM summarization
- `autoCompactDispatcher` (sI2) - Main auto-compact entry point
- `microCompactToolResults` (Si) - Tool result compression
- `shouldTriggerAutoCompact` (tD5) - Threshold check
- `calculateThresholds` (x1A) - Three-tier threshold calculation
- `getAutoCompactThreshold` (aI2) - Dynamic threshold getter
- `keepMessagesAfterLastBoundary` (nk) - Boundary extraction
- `filterAndNormalizeMessages` (WZ) - Message filtering for summarization
- `createBoundaryMarker` (S91) - Compact boundary creation
- `formatSummaryContent` (T91) - Summary message formatting
- `getSummarizationPrompt` (R91) - Full compaction prompt template
- `restoreFileReads` (bD5) - Post-compact file restoration
- `restoreTodoList` (fD5) - Post-compact todo restoration
- `restorePlanFile` (XQ0) - Post-compact plan restoration
- `countTotalTokens` (ZK) - Token counting from usage info
- `approximateTokenCount` (gG) - Quick token estimate (length/4)

---

## Summary

The Compact system provides sophisticated conversation management through:

1. **Two-Tier Architecture**: Micro-compact (fast, tool results only) → Full compact (slow, LLM summarization)
2. **Intelligent Triggering**: Three-tier threshold system with configurable override
3. **Smart Message Selection**: Boundary-aware extraction, filtering, and normalization
4. **Multi-Round Support**: Summary chaining with boundary markers
5. **Context Preservation**: Restores files (5 max, 50k tokens), todos, and plans
6. **Tool Result Handling**: Keeps last 3 results, compresses older ones
7. **Customizable**: Hooks, environment variables, and experiment flags
8. **Observable**: Comprehensive telemetry for monitoring

**Key Benefits:**
- Prevents context overflow
- Maintains conversation continuity
- Preserves important context
- Efficient token usage
- Customizable via hooks
- Observable via telemetry
