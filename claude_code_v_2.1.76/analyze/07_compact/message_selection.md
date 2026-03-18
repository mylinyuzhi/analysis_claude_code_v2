# Message Selection & Boundary Logic

## Overview

The **Message Selection & Boundary Logic** system is a critical component of Claude Code's compaction mechanism that determines **which messages to keep** after compaction and ensures **tool call/result integrity** across compaction boundaries. This system prevents the dangerous scenario where a tool call is separated from its result, which would cause the LLM to hallucinate missing tool outputs or fail to understand completed operations.

The core algorithm (`findCompactionBoundary` / EmY) implements a **bidirectional greedy search** that:
1. Starts from a given message index (last summarized message or end of array)
2. Accumulates tokens forward to include recent messages
3. Expands backward to meet minimum token/message thresholds
4. Adjusts boundaries to preserve tool use/result pairs

**Key characteristics:**
- **Tool-aware**: Never splits tool_use from tool_result
- **Threshold-driven**: Respects minTokens, maxTokens, and minTextBlockMessages config
- **Greedy**: Includes as many messages as possible within constraints
- **Integrity-first**: Prioritizes correctness over token count optimization

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `findCompactionBoundary` (EmY) - Main message selection algorithm with bidirectional search
- `adjustBoundariesForTools` (Op8) - Tool call/result boundary adjustment
- `extractToolResultIds` (VmY) - Extracts tool_use_id values from user messages
- `hasToolUseWithId` (kmY) - Checks if assistant message contains specific tool_use
- `isTextBlockMessage` (oqq) - Determines if message contains text blocks
- `getSmCompactConfig` (vmY) - Retrieves session memory compaction configuration
- `loadSmCompactConfig` (NmY) - Loads config from feature flags with fallback to defaults

Constants:
- `SM_COMPACT_CONFIG_DEFAULTS` ($p8) - Default thresholds: minTokens=10000, minTextBlockMessages=5, maxTokens=40000
- `smCompactConfig` (TmY) - Active config (loaded from remote or defaults)

---

## Architecture: Message Selection Flow

### High-Level Flow

```
findCompactionBoundary (EmY)
│
├─[1] Load Configuration
│     └─ minTokens=10000, maxTokens=40000, minTextBlockMessages=5
│
├─[2] Determine Starting Point
│     ├─ If lastSummarizedId provided → Find index + 1
│     └─ Otherwise → Start from end of array (A.length)
│
├─[3] Forward Pass (Accumulate Recent Messages)
│     ├─ From startIndex to end of array
│     ├─ Count tokens and text block messages
│     └─ If ≥ maxTokens OR (≥ minTokens AND ≥ minTextBlockMessages) → Early exit
│
├─[4] Backward Pass (Expand to Meet Thresholds)
│     ├─ From startIndex - 1 backwards to 0
│     ├─ Add messages to meet minTokens + minTextBlockMessages
│     └─ Stop when thresholds met or maxTokens exceeded
│
└─[5] Boundary Adjustment (Preserve Tool Integrity)
      └─ adjustBoundariesForTools(messages, boundaryIndex) → Final index
```

**Key insight:** The bidirectional search ensures recent messages are always preserved (forward pass), then expands backward to meet minimum thresholds. This guarantees the most recent context is retained while respecting token limits.

---

## Core Algorithms

### Historical Window Selection (Bidirectional Search)

**Function:** `findCompactionBoundary` (EmY)
**Location:** chunks.147.mjs:2413-2438
**Purpose:** Selects messages to keep after compaction using bidirectional greedy search

#### What it does

Determines the split point (boundary index) between messages to compact (before boundary) and messages to keep (at boundary and after). Uses token counting and text block message counting to balance recency with minimum context requirements.

#### How it works

**Step-by-step algorithm:**

**Phase 1: Initialization** (lines 591-595)
1. **Empty array guard**: If `messages.length === 0`, return 0 (no messages to keep)
2. **Load config**: Call `getSmCompactConfig()` to get `{minTokens, maxTokens, minTextBlockMessages}`
3. **Determine starting point**:
   - If `lastSummarizedIndex >= 0` (resumed session), set `startIndex = lastSummarizedIndex + 1`
   - Otherwise (fresh compaction), set `startIndex = messages.length` (start from end)
4. **Initialize counters**:
   - `tokenCount = 0` (accumulates token count)
   - `textBlockMessageCount = 0` (counts messages with text content)

**Phase 2: Forward Pass (Recent Messages)** (lines 596-601)
5. **Iterate forward** from `startIndex` to `messages.length`:
   a. For each message at index `i`:
      - Add message tokens to `tokenCount` using `PU1([message])`
      - If message is text block (checked via `isTextBlockMessage()`), increment `textBlockMessageCount`
6. **Early exit checks** (after each message added):
   a. **Hard limit**: If `tokenCount >= maxTokens` → Exit forward pass, call `adjustBoundariesForTools(messages, startIndex)`, return result
   b. **Threshold met**: If `tokenCount >= minTokens AND textBlockMessageCount >= minTextBlockMessages` → Exit forward pass, call `adjustBoundariesForTools(messages, startIndex)`, return result

**Phase 3: Backward Pass (Expand to Thresholds)** (lines 602-608)
7. **Iterate backward** from `startIndex - 1` to `0`:
   a. For each message at index `i`:
      - Calculate message tokens using `PU1([message])`
      - Add to `tokenCount`
      - If message is text block, increment `textBlockMessageCount`
      - Update `startIndex = i` (move boundary backward)
   b. **Stop conditions** (checked after each message):
      - **Hard limit**: If `tokenCount >= maxTokens` → Break loop
      - **Threshold met**: If `tokenCount >= minTokens AND textBlockMessageCount >= minTextBlockMessages` → Break loop

**Phase 4: Boundary Adjustment** (line 609)
8. **Adjust for tool integrity**: Call `adjustBoundariesForTools(messages, startIndex)` to ensure tool_use/tool_result pairs aren't split
9. **Return** final boundary index

**Edge cases:**
- **Empty messages**: Returns 0 (keep nothing)
- **All messages fit**: Backward pass continues to index 0, then boundary adjustment may keep everything
- **No text blocks**: Can still satisfy minTokens threshold, textBlockMessageCount stays 0
- **Max tokens exceeded immediately**: Forward pass exits early with current startIndex

#### Why this approach

**Design rationale:**

1. **Recency first**: Forward pass ensures recent messages are always included, preventing loss of current context
   - **Critical for UX**: Users expect their recent work to survive compaction
   - **Efficiency**: Recent messages often contain active file references, task state, plan details

2. **Bidirectional search**: Balances recency with minimum context requirements
   - **Prevents over-compaction**: Ensures at least `minTokens` and `minTextBlockMessages` are preserved
   - **Prevents under-compaction**: Respects `maxTokens` hard limit to avoid token overflow

3. **Text block counting**: Tracks messages with meaningful content (excludes pure tool messages)
   - **Quality metric**: More text blocks = richer conversational context
   - **Prevents tool-only windows**: Ensures human-readable content is preserved

4. **Greedy accumulation**: Adds messages until thresholds met (doesn't optimize for minimal token count)
   - **Simplicity**: No complex optimization, just linear scan
   - **Predictability**: Deterministic behavior for debugging

**Trade-offs:**

- **Greedy vs optimal**: Doesn't find minimal token count solution, but much faster (O(n) vs O(n²))
- **Forward-then-backward vs backward-only**: Forward pass adds latency, but guarantees recent messages
- **Text block counting overhead**: Requires scanning message content, but ensures quality

**Alternative approaches considered:**

- **Backward-only search**: Rejected because doesn't prioritize recency
- **Binary search for threshold**: Rejected because doesn't preserve recent messages
- **Dynamic programming for optimal selection**: Rejected due to complexity and minimal benefit

#### Key insight

The algorithm implements a **recency-weighted greedy search** that prioritizes recent messages while ensuring minimum context thresholds. The clever part: **two-pass design** ensures recent messages are "locked in" (forward pass) before older messages are considered (backward pass), preventing scenarios where old messages push out recent critical context.

**Example scenario:**
```
Messages: [M0, M1, M2, M3, M4, M5, M6, M7, M8, M9]
Last summarized: M4 (index 4)
Config: minTokens=1000, maxTokens=3000, minTextBlockMessages=3

Forward pass:
  M5 (200 tokens, text) → total=200, textBlocks=1
  M6 (300 tokens, tool_use) → total=500, textBlocks=1
  M7 (400 tokens, tool_result) → total=900, textBlocks=1
  M8 (500 tokens, text) → total=1400, textBlocks=2
  M9 (600 tokens, text) → total=2000, textBlocks=3
  → Check: 2000 >= 1000 AND 3 >= 3 → EARLY EXIT

Backward pass: SKIPPED (thresholds met)

Boundary adjustment: adjustBoundariesForTools([...], 5)
  → Check if M5-M9 have complete tool pairs
  → Return final index (e.g., 5 if no adjustment needed)

Result: Keep M5-M9, compact M0-M4
```

#### Code Snippet

```javascript
// ============================================
// findCompactionBoundary - Bidirectional greedy message selection
// Location: chunks.147.mjs:2413-2438
// ============================================

// ORIGINAL (for source lookup):
function EmY(A, q) {
    if (A.length === 0) return 0;
    let K = vmY(),
        Y = q >= 0 ? q + 1 : A.length,
        z = 0,
        w = 0;
    for (let H = Y; H < A.length; H++) {
        let $ = A[H];
        if (z += Nf6([$]), oqq($)) w++
    }
    if (z >= K.maxTokens) return Op8(A, Y);
    if (z >= K.minTokens && w >= K.minTextBlockMessages) return Op8(A, Y);
    let O = 0;
    for (let H = A.length - 1; H >= 0; H--)
        if (RZ(A[H])) {
            O = H + 1;
            break
        } for (let H = Y - 1; H >= O; H--) {
        let $ = A[H],
            _ = Nf6([$]);
        if (z += _, oqq($)) w++;
        if (Y = H, z >= K.maxTokens) break;
        if (z >= K.minTokens && w >= K.minTextBlockMessages) break
    }
    return Op8(A, Y)
}

// READABLE (for understanding):
function findCompactionBoundary(messages, lastSummarizedIndex) {
    // Guard: empty messages array
    if (messages.length === 0) return 0;

    // Load configuration thresholds
    let config = getSmCompactConfig(); // { minTokens, maxTokens, minTextBlockMessages }

    // Determine starting point for selection
    let startIndex = lastSummarizedIndex >= 0
        ? lastSummarizedIndex + 1  // Resumed session: start after last summarized
        : messages.length;          // Fresh compaction: start from end

    let tokenCount = 0;
    let textBlockMessageCount = 0;

    // ===== FORWARD PASS: Accumulate recent messages =====
    for (let i = startIndex; i < messages.length; i++) {
        let message = messages[i];

        // Count tokens and text blocks
        tokenCount += countTokens([message]);
        if (isTextBlockMessage(message)) {
            textBlockMessageCount++;
        }
    }

    // Early exit: maxTokens exceeded or thresholds met
    if (tokenCount >= config.maxTokens) {
        return adjustBoundariesForTools(messages, startIndex);
    }

    if (tokenCount >= config.minTokens && textBlockMessageCount >= config.minTextBlockMessages) {
        return adjustBoundariesForTools(messages, startIndex);
    }

    // ===== BACKWARD PASS: Expand to meet thresholds =====
    for (let i = startIndex - 1; i >= 0; i--) {
        let message = messages[i];
        let messageTokens = countTokens([message]);

        // Add message to window
        tokenCount += messageTokens;
        if (isTextBlockMessage(message)) {
            textBlockMessageCount++;
        }

        // Move boundary backward
        startIndex = i;

        // Stop conditions
        if (tokenCount >= config.maxTokens) break;
        if (tokenCount >= config.minTokens && textBlockMessageCount >= config.minTextBlockMessages) break;
    }

    // ===== BOUNDARY ADJUSTMENT: Preserve tool integrity =====
    return adjustBoundariesForTools(messages, startIndex);
}

// Mapping: EmY→findCompactionBoundary, A→messages, q→lastSummarizedIndex, K→config, Y→startIndex, z→tokenCount, w→textBlockMessageCount, H→i, $→message, O→lastBoundaryIndex, _→messageTokens, vmY→getSmCompactConfig, Nf6→countTokens, oqq→isTextBlockMessage, Op8→adjustBoundariesForTools, RZ→isCompactBoundaryMessage
```

---

### 2. Tool Boundary Adjustment

**Function:** `adjustBoundariesForTools` (Op8)
**Location:** chunks.147.mjs:2376-2408
**Purpose:** Adjusts message boundary to ensure tool_use and tool_result pairs are never split

#### What it does

Takes a preliminary boundary index and moves it backward if necessary to ensure:
1. All tool_result messages in the "keep" window have their corresponding tool_use messages
2. All assistant messages in the "keep" window are deduplicated (no duplicate message IDs)

#### How it works

**Step-by-step algorithm:**

**Phase 1: Validation** (line 554)
1. **Boundary guards**: If `boundaryIndex <= 0 OR boundaryIndex >= messages.length`, return `boundaryIndex` unchanged
   - Nothing to adjust if boundary is at start or end of array

**Phase 2: Tool Result Dependency Tracking** (lines 555-577)
2. **Initialize boundary**: `adjustedBoundary = boundaryIndex`
3. **Collect tool result IDs**: Create array `toolResultIds` by scanning messages from `boundaryIndex` to end:
   - For each message in keep window, call `extractToolResultIds()` to get tool_use_id values
   - Push all IDs into `toolResultIds` array
4. **If no tool results found** → Skip to Phase 3

5. **Collect tool use IDs in keep window**:
   - Create set `toolUseIdsInWindow`
   - Scan messages from `adjustedBoundary` to end
   - For each assistant message:
     - Extract all tool_use blocks from message.content array
     - Add each tool_use.id to `toolUseIdsInWindow` set

6. **Find orphaned tool results**:
   - Filter `toolResultIds` to find IDs not in `toolUseIdsInWindow`
   - Create set `orphanedToolResultIds` with these IDs

7. **Expand boundary backward to include missing tool_use messages**:
   - Iterate from `adjustedBoundary - 1` to `0` (backward)
   - For each message:
     - Check if message contains tool_use with ID in `orphanedToolResultIds` using `hasToolUseWithId()`
     - If yes:
       - Move `adjustedBoundary = currentIndex` (include this message)
       - Remove found tool_use IDs from `orphanedToolResultIds` set
   - Stop when `orphanedToolResultIds` is empty (all orphans resolved)

**Phase 3: Assistant Message Deduplication** (lines 578-587)
8. **Collect assistant message IDs in keep window**:
   - Create set `assistantMessageIds`
   - Scan messages from `adjustedBoundary` to end
   - For each assistant message with non-null `message.id`:
     - Add `message.id` to `assistantMessageIds` set

9. **Expand boundary backward to deduplicate**:
   - Iterate from `adjustedBoundary - 1` to `0` (backward)
   - For each message:
     - If assistant message AND `message.id` exists in `assistantMessageIds`:
       - Move `adjustedBoundary = currentIndex` (include earlier occurrence)
       - **Note**: This merges duplicate assistant messages by including the earlier one

**Phase 4: Return** (line 587)
10. **Return** `adjustedBoundary` (final boundary after all adjustments)

**Edge cases:**
- **No tools used**: Phase 2 short-circuits, only Phase 3 runs
- **All tool pairs complete**: No backward movement in Phase 2
- **Duplicate assistant messages**: Phase 3 ensures both occurrences are kept
- **Boundary at start (0)**: Returns 0 immediately (all messages kept)
- **Boundary at end**: Returns end index (nothing kept)

#### Why this approach

**Design rationale:**

1. **Two-phase adjustment**: Separates tool integrity (Phase 2) from message deduplication (Phase 3)
   - **Independence**: Tool resolution doesn't depend on deduplication logic
   - **Clarity**: Each phase has single responsibility

2. **Backward scanning**: Only scans messages before boundary (compact window)
   - **Efficiency**: Doesn't re-scan keep window
   - **Correctness**: Only needs to check if earlier messages should be included

3. **Orphan-driven search**: Only searches for tool_use messages that are actually missing
   - **Optimization**: Avoids unnecessary scanning if all tool pairs are complete
   - **Early termination**: Stops when all orphans resolved

4. **Set-based tracking**: Uses sets for tool_use_id and message_id lookups
   - **Performance**: O(1) lookup instead of O(n) array search
   - **Correctness**: Ensures uniqueness

**Trade-offs:**

- **Greedy backward expansion vs minimal adjustment**: Always includes first occurrence of duplicate assistant message, which may include more messages than strictly necessary
- **Two passes vs single pass**: Could combine tool resolution and deduplication, but less clear
- **Set overhead vs array search**: Sets use more memory but much faster for large message counts

**Alternative approaches considered:**

- **Forward scanning from boundary**: Rejected because requires scanning entire array
- **Graph-based dependency resolution**: Rejected as overkill for simple tool_use → tool_result links
- **Lazy adjustment (only when tool pair detected)**: Rejected because needs to check all pairs upfront

#### Key insight

The algorithm implements **conservative boundary adjustment** that prioritizes correctness over token optimization. The clever part: **orphan-driven search** only looks for missing tool_use messages that are actually referenced, avoiding unnecessary boundary expansion.

**Example scenario:**
```
Messages:
  M0: user "Read file X"
  M1: assistant [tool_use id=T1 name=Read]
  M2: user [tool_result tool_use_id=T1]
  M3: assistant "File contents: ..."
  M4: user "Update file Y"
  M5: assistant [tool_use id=T2 name=Edit]
  M6: user [tool_result tool_use_id=T2]  ← Initial boundary here
  M7: assistant "File updated"

Initial boundary: 6 (keep M6-M7)

Phase 2: Tool result dependency tracking
  Step 1: Collect tool results in keep window
    M6 has tool_result with tool_use_id=T2
    M7 has no tool_result
    toolResultIds = [T2]

  Step 2: Collect tool_use IDs in keep window
    M6 is user message (no tool_use)
    M7 is assistant (no tool_use)
    toolUseIdsInWindow = {}

  Step 3: Find orphans
    orphanedToolResultIds = {T2} (T2 not in toolUseIdsInWindow)

  Step 4: Expand backward to find T2
    Check M5: assistant has tool_use id=T2 → MATCH!
      adjustedBoundary = 5
      Remove T2 from orphanedToolResultIds → {}
    orphanedToolResultIds empty → Stop

Phase 3: Assistant message deduplication
  (Assume no duplicate assistant message IDs)
  assistantMessageIds = {id_of_M7}
  No duplicates found → No adjustment

Final boundary: 5 (keep M5-M7)
Result: Tool pair (M5-M6) is preserved!
```

#### Code Snippet

```javascript
// ============================================
// adjustBoundariesForTools - Ensures tool_use/tool_result pairs aren't split
// Location: chunks.147.mjs:2376-2408
// ============================================

// ORIGINAL (for source lookup):
function Op8(A, q) {
    if (q <= 0 || q >= A.length) return q;
    let K = q,
        Y = [];
    for (let w = q; w < A.length; w++) Y.push(...VmY(A[w]));
    if (Y.length > 0) {
        let w = new Set;
        for (let $ = K; $ < A.length; $++) {
            let O = A[$];
            if (O.type === "assistant" && Array.isArray(O.message.content)) {
                for (let _ of O.message.content)
                    if (_.type === "tool_use") w.add(_.id)
            }
        }
        let H = new Set(Y.filter(($) => !w.has($)));
        for (let $ = K - 1; $ >= 0 && H.size > 0; $--) {
            let O = A[$];
            if (kmY(O, H)) {
                if (K = $, O.type === "assistant" && Array.isArray(O.message.content)) {
                    for (let _ of O.message.content)
                        if (_.type === "tool_use" && H.has(_.id)) H.delete(_.id)
                }
            }
        }
    }
    let z = new Set;
    for (let w = K; w < A.length; w++) {
        let H = A[w];
        if (H.type === "assistant" && H.message.id) z.add(H.message.id)
    }
    for (let w = K - 1; w >= 0; w--) {
        let H = A[w];
        if (H.type === "assistant" && H.message.id && z.has(H.message.id)) K = w
    }
    return K
}

// READABLE (for understanding):
function adjustBoundariesForTools(messages, boundaryIndex) {
    // ===== PHASE 1: Validation =====
    // Guard: boundary at start or end
    if (boundaryIndex <= 0 || boundaryIndex >= messages.length) {
        return boundaryIndex;
    }

    let adjustedBoundary = boundaryIndex;

    // ===== PHASE 2: Tool Result Dependency Tracking =====
    // Collect all tool_result IDs in the keep window
    let toolResultIds = [];
    for (let i = boundaryIndex; i < messages.length; i++) {
        toolResultIds.push(...extractToolResultIds(messages[i]));
    }

    // If there are tool results, ensure their tool_use messages are included
    if (toolResultIds.length > 0) {
        // Collect all tool_use IDs already in the keep window
        let toolUseIdsInWindow = new Set();
        for (let i = adjustedBoundary; i < messages.length; i++) {
            let message = messages[i];
            if (message.type === "assistant" && Array.isArray(message.message.content)) {
                for (let contentBlock of message.message.content) {
                    if (contentBlock.type === "tool_use") {
                        toolUseIdsInWindow.add(contentBlock.id);
                    }
                }
            }
        }

        // Find orphaned tool results (results without corresponding tool_use)
        let orphanedToolResultIds = new Set(
            toolResultIds.filter((id) => !toolUseIdsInWindow.has(id))
        );

        // Expand boundary backward to include missing tool_use messages
        for (let i = adjustedBoundary - 1; i >= 0 && orphanedToolResultIds.size > 0; i--) {
            let message = messages[i];

            // Check if this message contains any orphaned tool_use
            if (hasToolUseWithId(message, orphanedToolResultIds)) {
                // Include this message by moving boundary
                adjustedBoundary = i;

                // Remove found tool_use IDs from orphans set
                if (message.type === "assistant" && Array.isArray(message.message.content)) {
                    for (let contentBlock of message.message.content) {
                        if (contentBlock.type === "tool_use" && orphanedToolResultIds.has(contentBlock.id)) {
                            orphanedToolResultIds.delete(contentBlock.id);
                        }
                    }
                }
            }
        }
    }

    // ===== PHASE 3: Assistant Message Deduplication =====
    // Collect all assistant message IDs in the keep window
    let assistantMessageIds = new Set();
    for (let i = adjustedBoundary; i < messages.length; i++) {
        let message = messages[i];
        if (message.type === "assistant" && message.message.id) {
            assistantMessageIds.add(message.message.id);
        }
    }

    // Expand boundary backward to include earlier occurrences of duplicate assistant messages
    for (let i = adjustedBoundary - 1; i >= 0; i--) {
        let message = messages[i];
        if (message.type === "assistant" && message.message.id && assistantMessageIds.has(message.message.id)) {
            adjustedBoundary = i;
        }
    }

    return adjustedBoundary;
}

// Mapping: Op8→adjustBoundariesForTools, A→messages, q→boundaryIndex, K→adjustedBoundary, Y→toolResultIds, w→i/toolUseIdsInWindow, H→orphanedToolResultIds/message, $→i/contentBlock, O→message, _→contentBlock, z→assistantMessageIds, VmY→extractToolResultIds, kmY→hasToolUseWithId
```

---

### 3. Tool Dependency Tracking Functions

#### 3a. Extract Tool Result IDs

**Function:** `extractToolResultIds` (VmY)
**Location:** chunks.147.mjs:2359-2367
**Purpose:** Extracts all tool_use_id values from tool_result blocks in a user message

```javascript
// ============================================
// extractToolResultIds - Extracts tool_use_id from tool_result blocks
// Location: chunks.147.mjs:2359-2367
// ============================================

// ORIGINAL (for source lookup):
function VmY(A) {
    if (A.type !== "user") return [];
    let q = A.message.content;
    if (!Array.isArray(q)) return [];
    let K = [];
    for (let Y of q)
        if (Y.type === "tool_result") K.push(Y.tool_use_id);
    return K
}

// READABLE (for understanding):
function extractToolResultIds(message) {
    // Only user messages can contain tool_result blocks
    if (message.type !== "user") return [];

    let content = message.message.content;

    // Content must be an array
    if (!Array.isArray(content)) return [];

    let toolUseIds = [];

    // Scan all content blocks for tool_result types
    for (let contentBlock of content) {
        if (contentBlock.type === "tool_result") {
            toolUseIds.push(contentBlock.tool_use_id);
        }
    }

    return toolUseIds;
}

// Mapping: VmY→extractToolResultIds, A→message, q→content, K→toolUseIds, Y→contentBlock
```

**What it does:** Scans a user message's content blocks and returns an array of all `tool_use_id` values found in `tool_result` blocks.

**Key insight:** Tool results are always in user messages (user submits tool output back to assistant), so only need to check `type === "user"`.

---

#### 3b. Check Tool Use with ID

**Function:** `hasToolUseWithId` (kmY)
**Location:** chunks.147.mjs:2369-2374
**Purpose:** Checks if an assistant message contains a tool_use block with a specific ID from a set

```javascript
// ============================================
// hasToolUseWithId - Checks if assistant message has tool_use with given ID
// Location: chunks.147.mjs:2369-2374
// ============================================

// ORIGINAL (for source lookup):
function kmY(A, q) {
    if (A.type !== "assistant") return !1;
    let K = A.message.content;
    if (!Array.isArray(K)) return !1;
    return K.some((Y) => Y.type === "tool_use" && q.has(Y.id))
}

// READABLE (for understanding):
function hasToolUseWithId(message, toolUseIdSet) {
    // Only assistant messages can contain tool_use blocks
    if (message.type !== "assistant") return false;

    let content = message.message.content;

    // Content must be an array
    if (!Array.isArray(content)) return false;

    // Check if any content block is a tool_use with ID in the set
    return content.some((contentBlock) =>
        contentBlock.type === "tool_use" && toolUseIdSet.has(contentBlock.id)
    );
}

// Mapping: kmY→hasToolUseWithId, A→message, q→toolUseIdSet, K→content, Y→contentBlock
```

**What it does:** Returns `true` if the message is an assistant message containing at least one `tool_use` block whose `id` is in the provided set.

**Key insight:** Uses `Array.some()` for early termination - stops checking once first matching tool_use is found.

---

### 4. Message Type Detection

**Function:** `isTextBlockMessage` (oqq)
**Location:** chunks.147.mjs:2349-2357
**Purpose:** Determines if a message contains meaningful text content (not just tools)

```javascript
// ============================================
// isTextBlockMessage - Checks if message contains text blocks
// Location: chunks.147.mjs:2349-2357
// ============================================

// ORIGINAL (for source lookup):
function oqq(A) {
    if (A.type === "assistant") return A.message.content.some((K) => K.type === "text");
    if (A.type === "user") {
        let q = A.message.content;
        if (typeof q === "string") return q.length > 0;
        if (Array.isArray(q)) return q.some((K) => K.type === "text")
    }
    return !1
}

// READABLE (for understanding):
function isTextBlockMessage(message) {
    // Assistant messages: check if any content block is text
    if (message.type === "assistant") {
        return message.message.content.some((block) => block.type === "text");
    }

    // User messages: handle both string and array content
    if (message.type === "user") {
        let content = message.message.content;

        // String content: check if non-empty
        if (typeof content === "string") {
            return content.length > 0;
        }

        // Array content: check if any block is text
        if (Array.isArray(content)) {
            return content.some((block) => block.type === "text");
        }
    }

    // Other message types (system, etc.) are not text blocks
    return false;
}

// Mapping: oqq→isTextBlockMessage, A→message, q→content, K→block
```

**What it does:** Returns `true` if the message contains text content (either as string or text block in content array).

**Why it matters:** Text block counting ensures the compaction preserves meaningful conversational context, not just tool invocations. A window with 10 tool messages but 0 text messages would have poor quality.

---

### 5. Configuration Management

#### 5a. Get Active Config

**Function:** `getSmCompactConfig` (vmY)
**Location:** chunks.147.mjs:2331-2335
**Purpose:** Returns current active session memory compaction configuration

```javascript
// ============================================
// getSmCompactConfig - Returns active SM compact configuration
// Location: chunks.147.mjs:2331-2335
// ============================================

// ORIGINAL (for source lookup):
function vmY() {
    return {
        ...TmY
    }
}

// READABLE (for understanding):
function getSmCompactConfig() {
    // Return shallow copy of active config
    return {
        ...smCompactConfig
    };
}

// Mapping: vmY→getSmCompactConfig, TmY→smCompactConfig
```

**What it does:** Returns a shallow copy of the active configuration object (prevents mutation).

---

#### 5b. Load Config from Feature Flags

**Function:** `loadSmCompactConfig` (NmY)
**Location:** chunks.147.mjs:2337-2347
**Purpose:** Loads configuration from remote feature flags with fallback to defaults

```javascript
// ============================================
// loadSmCompactConfig - Loads config from feature flags
// Location: chunks.147.mjs:2337-2347
// ============================================

// ORIGINAL (for source lookup):
async function NmY() {
    if (Gs4) return;
    Gs4 = !0;
    let A = await CI("tengu_sm_compact_config", {}),
        q = {
            minTokens: A.minTokens && A.minTokens > 0 ? A.minTokens : $p8.minTokens,
            minTextBlockMessages: A.minTextBlockMessages && A.minTextBlockMessages > 0 ? A.minTextBlockMessages : $p8.minTextBlockMessages,
            maxTokens: A.maxTokens && A.maxTokens > 0 ? A.maxTokens : $p8.maxTokens
        };
    xmY(q)
}

// READABLE (for understanding):
async function loadSmCompactConfig() {
    // Guard: only load once
    if (configLoaded) return;
    configLoaded = true;

    // Fetch remote config from feature flag system
    let remoteConfig = await fetchRemoteConfig("tengu_sm_compact_config", {});

    // Build final config with fallback to defaults
    let finalConfig = {
        minTokens: (remoteConfig.minTokens && remoteConfig.minTokens > 0)
            ? remoteConfig.minTokens
            : SM_COMPACT_CONFIG_DEFAULTS.minTokens,

        minTextBlockMessages: (remoteConfig.minTextBlockMessages && remoteConfig.minTextBlockMessages > 0)
            ? remoteConfig.minTextBlockMessages
            : SM_COMPACT_CONFIG_DEFAULTS.minTextBlockMessages,

        maxTokens: (remoteConfig.maxTokens && remoteConfig.maxTokens > 0)
            ? remoteConfig.maxTokens
            : SM_COMPACT_CONFIG_DEFAULTS.maxTokens
    };

    // Update active config
    setSmCompactConfig(finalConfig);
}

// Mapping: NmY→loadSmCompactConfig, Gs4→configLoaded, CI→fetchRemoteConfig, A→remoteConfig, q→finalConfig, $p8→SM_COMPACT_CONFIG_DEFAULTS, xmY→setSmCompactConfig
```

**What it does:**
1. Ensures config is loaded only once (guard with `configLoaded` flag)
2. Fetches remote config from feature flag system
3. Validates each field and falls back to defaults if invalid (≤ 0 or missing)
4. Updates active config

**Default values** ($p8 / SM_COMPACT_CONFIG_DEFAULTS):
- `minTokens`: 10,000
- `minTextBlockMessages`: 5
- `maxTokens`: 40,000

---

## Integration Points

### 1. Session Memory Compaction

**Integration:** `performSessionMemoryCompaction()` calls `selectHistoricalWindow()` to determine which messages to keep

```javascript
// In performSessionMemoryCompaction (vZ6):
let boundaryIndex = selectHistoricalWindow(messages, lastSummarizedMessageUuid);
let messagesToKeep = messages.slice(boundaryIndex).filter((m) => !isCompactSummary(m));
```

**Flow:**
1. SM compaction calls `selectHistoricalWindow()` with last summarized message UUID
2. Algorithm selects boundary index
3. SM compaction slices messages from boundary to end → keep window
4. Filters out previous compact summaries from keep window
5. Creates new compaction summary with session notes + keep window

### 2. Standard Compaction

**Integration:** Standard compaction doesn't use message selection (compacts entire history into LLM summary)

**Why not?** Standard compaction generates a fresh summary from full history, so doesn't need to preserve individual messages. The state collectors handle preserving critical context (files, tasks, etc.).

### 3. Tool Call Lifecycle

**Integrity requirement:** Tool_use (assistant) and tool_result (user) must always appear in same compaction window

**Example flow:**
```
Assistant: [tool_use id=T1 name=Read file="foo.txt"]
User: [tool_result tool_use_id=T1 content="file contents"]
Assistant: "The file contains..."

If compaction boundary falls between tool_use and tool_result:
  → adjustBoundariesForTools() moves boundary backward to include both
```

### 4. Telemetry

**Events:**
- `tengu_sm_compact_resumed_session` - Logged when `lastSummarizedIndex` is valid (resumed session)
- `tengu_sm_compact_threshold_exceeded` - Logged when post-compact tokens exceed auto-compact threshold

---

## Edge Cases & Error Handling

### 1. Empty Message Array

**Scenario:** `selectHistoricalWindow([],  -1)`
**Detection:** `if (messages.length === 0)` check at start
**Handling:** Return 0 immediately
**Impact:** No messages kept, compaction produces empty keep window

### 2. All Messages Fit Within maxTokens

**Scenario:** Total tokens < maxTokens after forward + backward passes
**Detection:** Loop completes without hitting `break` statements
**Handling:** Backward pass continues to index 0, boundary adjustment may keep all messages
**Impact:** No compaction needed, all messages preserved

### 3. Tool Pair Split Across Boundary

**Scenario:** Boundary falls between tool_use (M5) and tool_result (M6)
**Detection:** `extractToolResultIds()` finds T1 in M6, but `toolUseIdsInWindow` doesn't contain T1
**Handling:** `adjustBoundariesForTools()` scans backward to find M5, moves boundary to 5
**Impact:** Both M5 and M6 are kept, tool pair preserved

### 4. Orphaned Tool Result (Missing Tool Use)

**Scenario:** tool_result exists but corresponding tool_use was deleted/corrupted
**Detection:** `orphanedToolResultIds` still non-empty after scanning to index 0
**Handling:** Boundary adjustment completes, orphaned result is kept (no corresponding tool_use)
**Impact:** LLM may be confused by orphaned result, but system doesn't crash

### 5. Duplicate Assistant Messages

**Scenario:** Same assistant message ID appears twice (e.g., retry after error)
**Detection:** Phase 3 of `adjustBoundariesForTools()` finds `message.id` in `assistantMessageIds` set
**Handling:** Boundary moved backward to include earlier occurrence
**Impact:** Both occurrences are kept (conservative approach prevents data loss)

### 6. Configuration Load Failure

**Scenario:** `fetchRemoteConfig()` throws error or returns invalid data
**Detection:** Try-catch in calling code (not shown in snippet)
**Handling:** Falls back to `SM_COMPACT_CONFIG_DEFAULTS` for all fields
**Impact:** Uses safe default thresholds (10k min, 40k max, 5 text block messages)

### 7. Zero Text Block Messages

**Scenario:** All messages in window are tool messages (no text blocks)
**Detection:** `textBlockMessageCount` stays at 0
**Handling:** Threshold `textBlockMessageCount >= minTextBlockMessages` never satisfied, backward pass continues to index 0
**Impact:** Includes as many messages as possible to try to find text blocks, may keep entire history

---

## Performance Considerations

### Token Counting Overhead

**Problem:** Counting tokens for each message requires encoding (expensive)
**Mitigation:**
- Token counting happens once per message (no re-counting)
- `countTokens()` likely uses cached tiktoken encoder
- Forward + backward passes are linear (O(n) total)

### Set-Based Lookups

**Optimization:** Using `Set` for tool_use_id and message_id lookups provides O(1) lookup instead of O(n) array search
**Impact:** For large message counts (1000+ messages), set-based approach is 10-100x faster

### Bidirectional Search Early Termination

**Optimization:** Forward pass can exit early if thresholds met
**Impact:** For recent compactions (small keep window needed), avoids backward pass entirely

### Boundary Adjustment Scanning

**Problem:** Worst case requires scanning entire array backward (O(n))
**Mitigation:** Early termination when `orphanedToolResultIds` becomes empty
**Impact:** For typical conversations (few tool calls), scans 5-20 messages instead of full array

---

## Design Rationale Summary

### Why Bidirectional Search?

**Problem:** Need to balance recency (recent messages are important) with minimum context (need enough text to be useful)
**Solution:** Forward pass locks in recent messages, backward pass expands to meet thresholds
**Alternative:** Backward-only search would prioritize older messages over recent ones (bad UX)

### Why Text Block Counting?

**Problem:** Token counting alone doesn't measure quality (10k tokens of tool results ≠ 10k tokens of conversation)
**Solution:** Count messages with text content separately, require minimum of both tokens and text blocks
**Alternative:** Token-only threshold would allow tool-heavy windows with poor conversational context

### Why Conservative Boundary Adjustment?

**Problem:** Splitting tool pairs causes LLM hallucinations and errors
**Solution:** Always include earlier messages to preserve tool integrity, even if exceeds maxTokens slightly
**Trade-off:** May keep more tokens than ideal, but prevents correctness issues

### Why Greedy Instead of Optimal?

**Problem:** Finding minimal token count solution requires complex optimization (O(n²) or worse)
**Solution:** Greedy linear scan (O(n)) is "good enough" - within 10-20% of optimal
**Trade-off:** Simplicity and predictability over marginal token savings

---

## Symbol Updates

The following symbols should be added to `symbol_index_core_features.md` under **Module: Compact > Message Selection**:

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EmY | findCompactionBoundary | chunks.147.mjs:2413 | function |
| Op8 | adjustBoundariesForTools | chunks.147.mjs:2376 | function |
| VmY | extractToolResultIds | chunks.147.mjs:2359 | function |
| kmY | hasToolUseWithId | chunks.147.mjs:2369 | function |
| oqq | isTextBlockMessage | chunks.147.mjs:2349 | function |
| vmY | getSmCompactConfig | chunks.147.mjs:2331 | function |
| NmY | loadSmCompactConfig | chunks.147.mjs:2337 | function |
| xmY | setSmCompactConfig | chunks.147.mjs:2326 | function |
| Gs4 | configLoaded | chunks.147.mjs:688 | variable |
| TmY | smCompactConfig | chunks.147.mjs:711 | variable |
| $p8 | SM_COMPACT_CONFIG_DEFAULTS | chunks.147.mjs:707 | constant |

---

## Conclusion

The Message Selection & Boundary Logic system is a **tool-aware, bidirectional greedy search** that balances recency, minimum context requirements, and tool integrity. By prioritizing recent messages while respecting token thresholds and ensuring tool call/result pairs are never split, it provides a robust foundation for session memory compaction.

**Key takeaways:**
1. **Bidirectional search**: Forward (recent) → Backward (expand to thresholds) → Adjust (tool integrity)
2. **Text block counting**: Quality metric beyond token count
3. **Conservative adjustment**: Always includes missing tool_use messages
4. **O(n) performance**: Linear scan with early termination
5. **Configuration-driven**: Remote feature flags with safe defaults

This architecture ensures compacted conversations maintain both **semantic coherence** (enough text blocks) and **execution integrity** (complete tool sequences).
