# Memory Context Architecture (v2.1.7)

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Overview

Claude Code implements a sophisticated memory management system to handle long conversations while staying within model context limits. The system has multiple layers:

1. **Token Counting** - Track token usage by message type
2. **Threshold Detection** - Determine when compaction is needed
3. **Micro-compaction** - Fast, local cleanup of old tool results
4. **Session Memory Compact** - Cache-based fast compaction (NEW in 2.1.x)
5. **Full Compaction** - LLM-based summarization
6. **Message Flattening** - Consolidate messages for API calls

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Memory Context System (v2.1.7)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    Token Accounting (various functions)                 │ │
│  │  Tracks: humanMessages, assistantMessages, toolRequests,               │ │
│  │          toolResults, attachments, duplicateFileReads                  │ │
│  └──────────────────────────────┬─────────────────────────────────────────┘ │
│                                 │                                            │
│                                 ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                   Threshold Detection (ic)                              │ │
│  │  uL0 = 13000 (compact trigger offset)                                  │ │
│  │  c97 = 20000 (warning threshold offset)                                │ │
│  │  p97 = 20000 (error threshold offset)                                  │ │
│  │  mL0 = 3000  (blocking limit offset)                                   │ │
│  └──────────────────────────────┬─────────────────────────────────────────┘ │
│                                 │                                            │
│           ┌─────────────────────┼─────────────────────┐                     │
│           ▼                     ▼                     ▼                     │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐           │
│  │ Micro-compact   │   │ Session Memory  │   │ Full Compact    │           │
│  │ (lc)            │   │ (sF1) NEW       │   │ (cF1)           │           │
│  │ - Local ops     │   │ - Cache-based   │   │ - LLM call      │           │
│  │ - No API call   │   │ - No API call   │   │ - Streaming     │           │
│  │ - Tool results  │   │ - Fast fallback │   │ - Full summary  │           │
│  └─────────────────┘   └─────────────────┘   └─────────────────┘           │
│           │                     │                     │                     │
│           └─────────────────────┼─────────────────────┘                     │
│                                 ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                 Context Restoration Layer                               │ │
│  │  - Recent files (E97): up to 5 files, 50k token budget                │ │
│  │  - Todo list (z97): all items with "post-compact" context             │ │
│  │  - Plan file (xL0): path and content                                  │ │
│  │  - Invoked skills ($97): sorted by recency - NEW                      │ │
│  │  - Task status (C97): background agent states - NEW                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Token Counting

### Token Estimation with Safety Margin

```javascript
// ============================================
// estimateTokensWithSafetyMargin - Estimate tokens with 1.33x safety factor
// Location: chunks.132.mjs:1087-1099
// ============================================

// ORIGINAL (for source lookup):
function FhA(A) {
  let Q = 0;
  for (let B of A) {
    if (B.type !== "user" && B.type !== "assistant") continue;
    if (!Array.isArray(B.message.content)) continue;
    for (let G of B.message.content)
      if (G.type === "text") Q += l7(G.text);
      else if (G.type === "tool_result") Q += js2(G);
    else if (G.type === "image") Q += _s2;
    else Q += l7(eA(G))
  }
  return Math.ceil(Q * 1.3333333333333333)
}

// READABLE (for understanding):
function estimateTokensWithSafetyMargin(messages) {
  let rawTokenCount = 0;

  for (let message of messages) {
    // Only count user and assistant messages
    if (message.type !== "user" && message.type !== "assistant") continue;
    if (!Array.isArray(message.message.content)) continue;

    for (let block of message.message.content) {
      if (block.type === "text") {
        rawTokenCount += countTokens(block.text);
      } else if (block.type === "tool_result") {
        rawTokenCount += countMessageTokens(block);
      } else if (block.type === "image") {
        rawTokenCount += TOKENS_PER_IMAGE;  // _s2 = 2000
      } else {
        // Fallback: stringify and count
        rawTokenCount += countTokens(JSON.stringify(block));
      }
    }
  }

  // Apply 1.33x safety margin (accounts for tokenization variance)
  return Math.ceil(rawTokenCount * 1.3333333333333333);
}

// Mapping: FhA→estimateTokensWithSafetyMargin, l7→countTokens, js2→countMessageTokens,
//          _s2→TOKENS_PER_IMAGE, eA→JSON.stringify
```

**Why 1.33x Safety Margin?**
- Token counting is an estimate, not exact
- Different tokenizers have variance
- Better to overestimate than underestimate (prevents overflow)
- 33% buffer provides sufficient margin for most cases

### Message Token Counting

```javascript
// ============================================
// countMessageTokens - Count tokens in a message/tool result
// Location: chunks.132.mjs:1071-1079
// ============================================

// ORIGINAL (for source lookup):
function js2(A) {
  if (!A.content) return 0;
  if (typeof A.content === "string") return l7(A.content);
  return A.content.reduce((Q, B) => {
    if (B.type === "text") return Q + l7(B.text);
    else if (B.type === "image") return Q + _s2;
    return Q
  }, 0)
}

// READABLE (for understanding):
function countMessageTokens(messageOrToolResult) {
  if (!messageOrToolResult.content) {
    return 0;
  }

  // String content
  if (typeof messageOrToolResult.content === "string") {
    return countTokens(messageOrToolResult.content);
  }

  // Array content (multimodal)
  return messageOrToolResult.content.reduce((total, block) => {
    if (block.type === "text") {
      return total + countTokens(block.text);
    } else if (block.type === "image") {
      return total + TOKENS_PER_IMAGE;  // _s2 = 2000 fixed estimate
    }
    return total;
  }, 0);
}

// Mapping: js2→countMessageTokens, l7→countTokens, _s2→TOKENS_PER_IMAGE
```

### Cached Tool Result Token Lookup

```javascript
// ============================================
// getCachedToolResultTokens - Cache token counts for tool results
// Location: chunks.132.mjs:1081-1085
// ============================================

// ORIGINAL (for source lookup):
function y97(A, Q) {
  let B = Rs2.get(A);
  if (B === void 0) B = js2(Q), Rs2.set(A, B);
  return B
}

// READABLE (for understanding):
function getCachedToolResultTokens(toolUseId, toolResult) {
  let cachedCount = toolResultTokenCache.get(toolUseId);
  if (cachedCount === undefined) {
    cachedCount = countMessageTokens(toolResult);
    toolResultTokenCache.set(toolUseId, cachedCount);
  }
  return cachedCount;
}

// Mapping: y97→getCachedToolResultTokens, Rs2→toolResultTokenCache, js2→countMessageTokens
```

**Why Cache?**
- Tool results can be large (file contents, command output)
- Counting tokens repeatedly is expensive
- Cache by tool_use_id since content doesn't change

---

## 2. Threshold Detection

### Available Token Calculation

```javascript
// ============================================
// calculateAvailableTokens - Get context limit minus reserved space
// Location: chunks.132.mjs:1452-1456
// ============================================

// ORIGINAL (for source lookup):
function q3A() {
  let A = B5(),
    Q = dL0(A);
  return Jq(A, SM()) - Q
}

// READABLE (for understanding):
function calculateAvailableTokens() {
  let modelId = getCurrentModelId();
  let reservedOutputTokens = getReservedOutputTokens(modelId);
  return getModelContextLimit(modelId, getConfig()) - reservedOutputTokens;
}

// Mapping: q3A→calculateAvailableTokens, B5→getCurrentModelId, dL0→getReservedOutputTokens,
//          Jq→getModelContextLimit, SM→getConfig
```

### Auto-Compact Target Calculation

```javascript
// ============================================
// getAutoCompactTarget - Calculate when auto-compact should trigger
// Location: chunks.132.mjs:1458-1470
// ============================================

// ORIGINAL (for source lookup):
function xs2() {
  let A = q3A(),
    Q = A - uL0,
    B = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
  if (B) {
    let G = parseFloat(B);
    if (!isNaN(G) && G > 0 && G <= 100) {
      let Z = Math.floor(A * (G / 100));
      return Math.min(Z, Q)
    }
  }
  return Q
}

// READABLE (for understanding):
function getAutoCompactTarget() {
  let availableTokens = calculateAvailableTokens();

  // Default: available minus preserve buffer (13k)
  let defaultTarget = availableTokens - PRESERVE_BUFFER;  // uL0 = 13000

  // Check for percentage override
  let overrideEnv = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
  if (overrideEnv) {
    let percentage = parseFloat(overrideEnv);
    if (!isNaN(percentage) && percentage > 0 && percentage <= 100) {
      let overrideTarget = Math.floor(availableTokens * (percentage / 100));
      // Use smaller of override and default (safety)
      return Math.min(overrideTarget, defaultTarget);
    }
  }

  return defaultTarget;
}

// Mapping: xs2→getAutoCompactTarget, q3A→calculateAvailableTokens, uL0→PRESERVE_BUFFER
```

**CLAUDE_AUTOCOMPACT_PCT_OVERRIDE Example:**
- If set to `80`, auto-compact triggers at 80% of context limit
- If set to `50`, auto-compact triggers at 50% (more aggressive)
- Always capped at `contextLimit - 13000` for safety

### Auto-Compact Enable Check

```javascript
// ============================================
// isAutoCompactEnabled - Check if auto-compact should run
// Location: chunks.132.mjs:1495-1499
// ============================================

// ORIGINAL (for source lookup):
function nc() {
  if (a1(process.env.DISABLE_COMPACT)) return !1;
  if (a1(process.env.DISABLE_AUTO_COMPACT)) return !1;
  return L1().autoCompactEnabled
}

// READABLE (for understanding):
function isAutoCompactEnabled() {
  // Check environment overrides first
  if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return false;
  }
  if (parseBoolean(process.env.DISABLE_AUTO_COMPACT)) {
    return false;
  }

  // Check user preference
  return getUserSettings().autoCompactEnabled;
}

// Mapping: nc→isAutoCompactEnabled, a1→parseBoolean, L1→getUserSettings
```

**Priority Order:**
1. `DISABLE_COMPACT` env var (disables all compaction)
2. `DISABLE_AUTO_COMPACT` env var (disables only auto)
3. User setting `autoCompactEnabled` (default: true)

---

## 3. Threshold States

The `ic` function returns multiple threshold states:

| State | Calculation | UI Effect |
|-------|-------------|-----------|
| `percentLeft` | `(limit - current) / limit * 100` | Progress indicator |
| `isAboveWarningThreshold` | `current >= (limit - 20k)` | Yellow warning |
| `isAboveErrorThreshold` | `current >= (limit - 20k)` | Red error |
| `isAboveAutoCompactThreshold` | `enabled && current >= target` | Triggers auto-compact |
| `isAtBlockingLimit` | `current >= (limit - 3k)` | Blocks further input |

```
Context Limit ─────────────────────────────────────────────────────► 200k tokens
                                                                    │
Blocking Limit (contextLimit - 3k) ────────────────────────────────►│
                                                                    │ ◄── mL0
Error Threshold (contextLimit - 20k) ──────────────────────────►    │
                                                                │   │ ◄── p97
Warning Threshold (contextLimit - 20k) ────────────────────────►│   │
                                                                │   │ ◄── c97
Auto-Compact Target (contextLimit - 13k) ─────────────────────►│   │
                                                               │   │ ◄── uL0
                                                               │   │
                                    Current Token Count ───────┼───┘
                                                               │
                                                    (triggers auto-compact)
```

---

## 4. Micro-Compaction State

Micro-compaction tracks which tool results have been cleared:

```javascript
// State variables (chunks.132.mjs:1272)
x97 = new Set([z3, X9, DI, lI, aR, cI, I8, BY])  // COMPACTABLE_TOOLS
bL0 = new Set()  // compactedToolIds (already cleared)
fL0 = new Set()  // clearedMemoryUuids (memory attachments cleared)
Rs2 = new Map()  // toolResultTokenCache (tool_use_id → token count)
nF1 = false      // microCompactOccurred (flag for UI)
iF1 = []         // microCompactListeners (callbacks)
```

### Compactable Tools

| Obfuscated | Tool Name | Why Compactable |
|------------|-----------|-----------------|
| z3 | Read | File contents can be large |
| X9 | Bash | Command output can be extensive |
| DI | Grep | Search results may be large |
| lI | Glob | File lists can be long |
| aR | WebSearch | Search results are verbose |
| cI | WebFetch | Web content can be large |
| I8 | Edit | Diff output is verbose |
| BY | Write | File content echoed back |

### Micro-Compact Algorithm

```
1. Scan messages for tool_use blocks where tool.name is in COMPACTABLE_TOOLS
2. Collect corresponding tool_result blocks
3. Keep last 3 tool results (S97 = 3) uncompressed
4. Calculate potential token savings
5. If savings >= 20k (T97) AND above warning threshold:
   a. Replace tool_result content with "[Old tool result content cleared]"
   b. Save original content to file for potential retrieval
   c. Track cleared IDs in compactedToolIds Set
6. Clear old memory attachments
7. Return modified messages
```

---

## 5. Session Memory Architecture (NEW in 2.1.x)

Session Memory provides a fast, cache-based compaction alternative.

### Session Memory File Structure

```
~/.claude/<session-id>/session-memory/
├── summary.md       # Cached session summary (updated incrementally)
├── config/
│   ├── template.md  # Custom template (optional)
│   └── prompt.md    # Custom prompt (optional)
```

### Default Template (w97)

```markdown
# Session Title
_A short and distinctive 5-10 word descriptive title for the session. Super info dense, no filler_

# Current State
_What is actively being worked on right now? Pending tasks not yet completed. Immediate next steps._

# Task specification
_What did the user ask to build? Any design decisions or other explanatory context_

# Files and Functions
_What are the important files? In short, what do they contain and why are they relevant?_

# Workflow
_What bash commands are usually run and in what order? How to interpret their output if not obvious?_

# Errors & Corrections
_Errors encountered and how they were fixed. What did the user correct? What approaches failed and should not be tried again?_

# Codebase and System Documentation
_What are the important system components? How do they work/fit together?_

# Learnings
_What has worked well? What has not? What to avoid? Do not duplicate items from other sections_

# Key results
_If the user asked a specific output such as an answer to a question, a table, or other document, repeat the exact result here_

# Worklog
_Step by step, what was attempted, done? Very terse summary for each step_
```

### Session Memory Config (oF1)

```javascript
oF1 = {
  minTokens: 10000,           // Minimum tokens before session memory kicks in
  minTextBlockMessages: 5,    // Minimum text messages required
  maxTokens: 40000            // Maximum tokens for session memory compact
}
```

### Session Memory Compact Decision Tree

```
isSessionMemoryCompactEnabled? ─── NO ───► Return null (fall to full compact)
         │
        YES
         ▼
Read cached summary file (Ks2) ─── null ───► Return null
         │
    has content
         ▼
Is template empty? (Os2) ─── YES ───► Log + Return null
         │
        NO
         ▼
Find last summarized position ─── not found ───► Log + Return null
         │
       found
         ▼
Calculate messages to keep (m97)
         │
         ▼
Build compact result with cached summary
         │
         ▼
Check post-compact tokens < threshold? ─── NO ───► Return null
         │
        YES
         ▼
Return session memory compact result
```

---

## 6. Full Compaction Context Limits

### File Restoration Limits

| Constant | Value | Purpose |
|----------|-------|---------|
| I97 | 5 | Maximum files to restore |
| D97 | 50000 | Total token budget for all files |
| W97 | 5000 | Maximum tokens per individual file |

### File Selection Algorithm

```javascript
// E97 (restoreRecentFilesAfterCompact) algorithm:

1. Get all files from readFileState
2. Filter out excluded files (transcript, plan, CLAUDE.md)
3. Sort by timestamp (most recent first)
4. Take first 5 files (I97)
5. For each file:
   a. Read content with 5k token limit (W97)
   b. Add to running token total
   c. If total exceeds 50k budget (D97), stop
6. Return file attachments
```

### Files Excluded from Restoration

```javascript
function U97(filePath, agentId) {
  // Exclude transcript file
  if (filePath === getTranscriptPath(agentId)) return true;

  // Exclude plan file
  if (filePath === getPlanFilePath(agentId)) return true;

  // Exclude CLAUDE.md files (already in system prompt)
  if (filePath.endsWith("/CLAUDE.md")) return true;

  return false;
}
```

---

## 7. Message Flattening

Before sending to the API, messages are flattened and normalized.

### Flattening Rules

1. **Filter out internal messages:**
   - Progress messages
   - System-only messages
   - Invisible attachments

2. **Merge consecutive same-role messages:**
   - Multiple user messages → single user message
   - Multiple assistant messages → single assistant message

3. **Validate tool_use/tool_result pairs:**
   - Every tool_use must have corresponding tool_result
   - Every tool_result must have corresponding tool_use

4. **Normalize content blocks:**
   - Convert internal formats to API format
   - Strip metadata not needed by API

### API Message Format

```typescript
interface APIMessage {
  role: "user" | "assistant";
  content: string | ContentBlock[];
}

interface ContentBlock {
  type: "text" | "image" | "tool_use" | "tool_result";
  // ... type-specific fields
}
```

---

## 8. System Reminder Integration

### System Reminder Construction

When messages are sent to the API, system reminders are constructed:

```javascript
// _3A (prependSystemReminderWithContext) - chunks.133.mjs:2585-2598
function prependSystemReminderWithContext(messageList, contextMap) {
  if (Object.entries(contextMap).length === 0) {
    return messageList;
  }

  return [createMessage({
    content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(contextMap).map(([title, content]) => `# ${title}
${content}`).join("\n")}

      IMPORTANT: this context may or may not be relevant to your tasks...
</system-reminder>
`,
    isMeta: true
  }), ...messageList];
}
```

### Context Sources

| Source | When Included | Token Limit |
|--------|---------------|-------------|
| CLAUDE.md files | Always | 40k total |
| IDE selection | When available | Variable |
| Recent files | Post-compact | 50k total |
| Todo list | When items exist | Unlimited |
| Plan file | When in plan mode | Unlimited |

---

## 9. Key Functions Summary

| Function | Obfuscated | Purpose | Location |
|----------|------------|---------|----------|
| calculateAvailableTokens | q3A | Get usable context space | chunks.132.mjs:1452 |
| getAutoCompactTarget | xs2 | Calculate compact trigger point | chunks.132.mjs:1458 |
| calculateThresholds | ic | Determine all threshold states | chunks.132.mjs:1472 |
| isAutoCompactEnabled | nc | Check if auto-compact allowed | chunks.132.mjs:1495 |
| shouldTriggerAutoCompact | l97 | Full check for auto-compact | chunks.132.mjs:1501 |
| autoCompactDispatcher | ys2 | Main auto-compact entry point | chunks.132.mjs:1511 |
| sessionMemoryCompact | sF1 | Cache-based fast compact | chunks.132.mjs:1392 |
| fullCompact | cF1 | LLM-based summarization | chunks.132.mjs:489 |
| microCompactToolResults | lc | Clear old tool results | chunks.132.mjs:1111 |
| generateConversationSummary | H97 | Stream summary from LLM | chunks.132.mjs:590 |
| estimateTokensWithSafetyMargin | FhA | Count tokens with 1.33x safety | chunks.132.mjs:1087 |
| countMessageTokens | js2 | Count tokens in a message | chunks.132.mjs:1071 |
| restoreRecentFilesAfterCompact | E97 | Re-read recent files | chunks.132.mjs:654 |

---

## 10. Constants Table

### Threshold Constants

| Obfuscated | Value | Purpose |
|------------|-------|---------|
| uL0 | 13,000 | Tokens to preserve (auto-compact trigger offset) |
| c97 | 20,000 | Warning threshold offset from limit |
| p97 | 20,000 | Error threshold offset from limit |
| mL0 | 3,000 | Blocking limit offset from limit |

### Micro-Compact Constants

| Obfuscated | Value | Purpose |
|------------|-------|---------|
| T97 | 20,000 | Minimum token savings to trigger |
| P97 | 40,000 | Default micro-compact threshold |
| S97 | 3 | Number of recent tool results to keep |
| _s2 | 2,000 | Estimated tokens per image |

### File Restoration Constants

| Obfuscated | Value | Purpose |
|------------|-------|---------|
| I97 | 5 | Maximum files to restore |
| D97 | 50,000 | Total token budget for files |
| W97 | 5,000 | Maximum tokens per file |

### Session Memory Constants

| Obfuscated | Value | Purpose |
|------------|-------|---------|
| minTokens | 10,000 | Minimum tokens for SM compact |
| minTextBlockMessages | 5 | Minimum text messages required |
| maxTokens | 40,000 | Maximum tokens for SM compact |
| Ls2 | 2,000 | Per-section token limit in template |

### Retry Constants

| Obfuscated | Value | Purpose |
|------------|-------|---------|
| K97 | 2 | Maximum summary generation retries |
| q97 | 15,000 | Wait timeout for pending compact (ms) |
| N97 | 60,000 | Max wait for compact lock (ms) |

---

## 11. Memory Management Best Practices

### When Auto-Compact Triggers

1. Token count exceeds `contextLimit - 13000`
2. Auto-compact is enabled (user setting + no env override)
3. Not in session_memory type mode

### Optimal Configuration

| Use Case | Recommendation |
|----------|----------------|
| Long coding sessions | Default settings, let auto-compact handle |
| Short interactions | Consider `DISABLE_AUTO_COMPACT=true` |
| Memory-constrained | Lower `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` (e.g., 70) |
| Large file operations | Expect frequent micro-compaction |

### Debugging Token Issues

1. Check `tengu_compact` telemetry events for token counts
2. Monitor `percentLeft` in threshold calculations
3. Review `tengu_microcompact` events for tool clearing
4. Verify file restoration with `tengu_post_compact_file_restore_*` events

---

## Summary

The v2.1.7 memory architecture provides:

1. **Multi-tier compaction** - Session Memory → Full Compact → Micro-Compact
2. **Intelligent thresholds** - Warning/Error/Blocking limits
3. **Context preservation** - Files, todos, plans, skills, task status
4. **Configurability** - Environment variables and user settings
5. **Observability** - Comprehensive telemetry events

Key improvements over earlier versions:
- Session Memory feature for zero-cost compaction
- Invoked skills tracking
- Background task status preservation
- Improved token counting with caching
- Enhanced retry logic for streaming
