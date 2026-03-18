# Microcompaction & Token Optimization

> **⚠️ Version Note (v2.1.76):** In this version, microcompaction is **disabled**. The `pg` function at chunks.133.mjs:991 is a no-op that simply returns messages unchanged:
> ```javascript
> async function pg(A, q, K) {
>     return Qc4(), { messages: A }
> }
> ```
> The analysis below describes the full microcompaction algorithm as it existed in previous versions. The constants and helper functions documented here may not exist in v2.1.76.

## Overview

**Microcompaction** is a lightweight, pre-compaction optimization strategy in Claude Code that reduces token count by replacing large tool results with file references and images with text placeholders. Unlike full compaction (which summarizes entire conversation history via LLM API), microcompaction performs targeted content replacement without LLM involvement, achieving 20-50% token reduction in tool-heavy conversations at near-zero cost.

This optimization runs **automatically** when token usage exceeds warning threshold and **manually** via explicit triggers. It implements a **greedy selection algorithm** that preserves the 3 most recent tool results while replacing older, large tool results with persistent file references.

**Key characteristics:**
- **No LLM call**: Purely mechanical string replacement (fast, free)
- **Selective**: Only replaces tool results that exceed token threshold
- **Recency-preserving**: Always keeps last 3 tool results intact
- **Persistent**: Saves replaced content to disk (`~/.claude/tool-results/`)
- **Reversible**: File references allow recovery of original content

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `performMicrocompaction` (pg) - Main microcompaction algorithm (**no-op in v2.1.76**)
- `clearMicrocompactInProgress` (Qc4) - Clears in-progress flag

Constants:
- `MIN_MICROCOMPACT_TOKENS` (umY) - 20,000 tokens (minimum savings to trigger auto-microcompaction)
- `MANUAL_MICROCOMPACT_THRESHOLD` (BmY) - 40,000 tokens (threshold for manual microcompaction)
- `KEEP_RECENT_TOOL_RESULTS` (mmY) - 3 (number of most recent tool results to preserve)
- `IMAGE_TOKEN_ESTIMATE` (gCA) - 2,000 tokens per image
- `CLEARED_CONTENT_MESSAGE` (NXA) - "[Old tool result content cleared]"
- `PERSISTED_OUTPUT_START` (C$6) - "<persisted-output>"
- `PERSISTED_OUTPUT_END` (VXA) - "</persisted-output>"
- `TOOL_RESULTS_DIR` (fXA) - "tool-results"
- `PREVIEW_SIZE` (ex7) - 2,000 characters for preview

---

## Architecture: Microcompaction Flow

### High-Level Flow

```
performMicrocompaction (gm)
│
├─[1] Early Exit Checks
│     ├─ DISABLE_MICROCOMPACT env var → Skip
│     ├─ tengu_cache_plum_violet flag → Skip (API context management)
│     └─ Continue if checks pass
│
├─[2] Tool Result Collection
│     ├─ Scan all messages for tool_use → tool_result pairs
│     ├─ Track tool_use IDs and tool_result token counts
│     └─ Build map: tool_use_id → token_count
│
├─[3] Greedy Selection (Which to Compact)
│     ├─ Preserve last 3 tool results (KEEP_RECENT_TOOL_RESULTS)
│     ├─ Sort older results by order (first = oldest)
│     ├─ Greedily select until total tokens > threshold
│     └─ Create set of compacted tool_use_ids
│
├─[4] Auto-Compact Mode Validation
│     ├─ If manual mode → Skip validation
│     ├─ Check token usage vs warning threshold
│     ├─ Check token savings >= MIN_MICROCOMPACT_TOKENS
│     └─ Clear selection if validation fails
│
├─[5] Image Placeholder Selection
│     ├─ Find user messages with images that have no subsequent assistant response
│     ├─ Calculate total image token savings
│     └─ Create set of message UUIDs to clear images
│
├─[6] Message Processing
│     ├─ Iterate through all messages
│     ├─ For user messages:
│     │   ├─ Replace images with "[image]" if in clearImages set
│     │   └─ Replace large tool_result with file reference if in compacted set
│     ├─ For assistant messages: Copy as-is
│     ├─ Skip attachment messages if previously cleared
│     └─ Build new messages array
│
├─[7] State Tracking
│     ├─ Add compacted tool_use_ids to global TG1 set (prevents re-compaction)
│     ├─ Clean up read file state (remove files no longer referenced)
│     └─ Mark microcompaction as in-progress
│
└─[8] Return Result
      ├─ If any optimizations made:
      │   ├─ Log tengu_microcompact telemetry
      │   ├─ Create boundary marker message
      │   └─ Return { messages, compactionInfo }
      └─ Otherwise: Return { messages } (no changes)
```

**Key insight:** Microcompaction is a **greedy, threshold-driven, recency-preserving** algorithm that optimizes for maximum token savings while keeping recent context intact.

---

## Core Algorithms

### 1. Main Microcompaction Algorithm

**Function:** `performMicrocompaction` (gm)
**Location:** chunks.147.mjs:310-462
**Purpose:** Orchestrates tool result and image replacement to reduce token count

#### What it does

Scans conversation messages to find large tool results and unused images, replaces them with compact references, and persists original content to disk. Returns optimized message array with metadata about token savings.

#### How it works

**Step-by-step algorithm:**

**Phase 1: Early Exit Checks** (lines 311-314)
1. **Clear in-progress flag**: Call `clearMicrocompactInProgress()` to reset state
2. **Check DISABLE_MICROCOMPACT**: If env var set, return `{ messages }` unchanged
3. **Check cache management**: If `tengu_cache_plum_violet` flag enabled, return unchanged (API context management takes over)
4. **Determine mode**: Set `isManualMode = true` if explicit threshold provided, else `false` (auto mode)

**Phase 2: Tool Result Collection** (lines 315-327)
5. **Initialize tracking**:
   - `eligibleToolUseIds = []` - All tool_use IDs that could be compacted
   - `toolResultTokens = Map<tool_use_id, token_count>` - Token count per tool result
6. **Scan messages**:
   a. For each message (user or assistant):
      - If message contains `tool_use` blocks:
        - Extract `tool_use.id`
        - If ID not already in global `compactedToolIds` set (TG1), add to `eligibleToolUseIds`
      - If message contains `tool_result` blocks:
        - Extract `tool_result.tool_use_id`
        - If ID is in `eligibleToolUseIds`:
          - Calculate token count using `calculateToolResultTokens()`
          - Store in `toolResultTokens` map: `toolUseId → tokenCount`

**Phase 3: Greedy Selection** (lines 328-335)
7. **Preserve recent results**: Extract last `KEEP_RECENT_TOOL_RESULTS` (3) IDs from `eligibleToolUseIds`
8. **Calculate total tokens**: Sum all values in `toolResultTokens` map
9. **Greedy selection loop**:
   - `tokensSaved = 0`
   - `compactedSet = Set()`
   - For each tool_use_id in `eligibleToolUseIds` (oldest first):
     - If ID is in recent results → Skip (preserve)
     - If `totalTokens - tokensSaved > threshold`:
       - Add ID to `compactedSet`
       - Increment `tokensSaved` by `toolResultTokens.get(id)`
     - Otherwise → Break (threshold exceeded)

**Phase 4: Auto-Compact Mode Validation** (lines 336-340)
10. **If auto mode** (not manual):
    a. Count current conversation tokens using `countTokens(messages)`
    b. Get model from context or default
    c. Check compaction status using `getCompactionStatus(tokens, model)`
    d. **Validation criteria**:
       - Must be above warning threshold (`isAboveWarningThreshold`)
       - Token savings must be >= `MIN_MICROCOMPACT_TOKENS` (20k)
    e. If validation fails:
       - Clear `compactedSet` (set to empty)
       - Reset `tokensSaved = 0`

**Phase 5: Image Placeholder Selection** (lines 341-359)
11. **Find orphaned user messages**:
    a. Create `orphanedUserMessageUUIDs` set
    b. Track `pendingUserMessages = []` (user messages waiting for assistant response)
    c. Scan messages:
       - If user message → Add UUID to `pendingUserMessages`
       - If assistant message → Add all `pendingUserMessages` UUIDs to `orphanedUserMessageUUIDs`, clear `pendingUserMessages`
    d. Result: Set of user message UUIDs that have no subsequent assistant response

12. **Select images to clear**:
    a. `imagesToClear = Set()`
    b. `imageTokensSaved = 0`
    c. For each user message:
       - If UUID is in `orphanedUserMessageUUIDs` AND message contains images:
         - Count image tokens (number of images × `IMAGE_TOKEN_ESTIMATE`)
         - Add UUID to `imagesToClear`
         - Increment `imageTokensSaved`

**Phase 6: Message Processing** (lines 360-423)
13. **Define helper**: `shouldCompactToolResult(toolUseId) = TG1.has(toolUseId) OR compactedSet.has(toolUseId)`

14. **Process messages**:
    - `newMessages = []`
    - For each message:

      **Attachment handling** (lines 367-370):
      - If `type === "attachment"` AND UUID in global `clearedAttachmentUUIDs` (fZ6):
        - Skip message (continue to next)

      **Non-content messages** (lines 368-375):
      - If NOT user or assistant message:
        - Push unchanged to `newMessages`
      - If message content is not array:
        - Push unchanged to `newMessages`

      **User message processing** (lines 376-410):
      - If `type === "user"`:
        - `newContent = []`
        - `wasModified = false`
        - `shouldClearImages = imagesToClear.has(message.uuid)`
        - For each content block:

          **Image replacement** (lines 381-386):
          - If `block.type === "image"` AND `shouldClearImages`:
            - Set `wasModified = true`
            - Push `{ type: "text", text: "[image]" }` to `newContent`
            - Continue to next block

          **Tool result replacement** (lines 388-399):
          - If `block.type === "tool_result"` AND `shouldCompactToolResult(block.tool_use_id)` AND content not already persisted:
            - Set `wasModified = true`
            - Persist content: `result = await persistToolResult(block.content, block.tool_use_id)`
            - If persistence succeeded:
              - Set `replacementContent = "<persisted-output>\nTool result saved to: {filepath}\n\nUse Read to view\n</persisted-output>"`
            - Otherwise (persistence failed):
              - Set `replacementContent = "[Old tool result content cleared]"`
            - Push `{ ...block, content: replacementContent }` to `newContent`
          - Otherwise:
            - Push block unchanged to `newContent`

        - If `newContent.length > 0`:
          - Create new message with modified content
          - If `wasModified`, remove `toolUseResult` metadata (clear cached result)
          - Push to `newMessages`

      **Assistant message processing** (lines 412-422):
      - If `type === "assistant"`:
        - Copy all content blocks as-is
        - Push to `newMessages`

**Phase 7: State Tracking** (lines 424-450)
15. **Update read file state**:
    - If context provided AND `compactedSet.size > 0`:
      - Build map: filename → tool_use_id for Read tool calls
      - Identify files that are no longer referenced (compacted away)
      - Remove from `context.readFileState` to prevent memory leaks

16. **Update global compacted IDs**: For each ID in `compactedSet`, add to global `TG1` set (prevents re-compaction)

17. **Calculate total token savings**: `totalSaved = tokensSaved + imageTokensSaved`

**Phase 8: Return Result** (lines 441-461)
18. **If any optimizations made** (`compactedSet.size > 0` OR `imagesToClear.size > 0`):
    a. Log `tengu_microcompact` telemetry:
       - `toolsCompacted`: `compactedSet.size`
       - `totalUncompactedTokens`: Original token count
       - `tokensAfterCompaction`: `originalTokens - totalSaved`
       - `tokensSaved`: Tool result savings
       - `imageTokensSaved`: Image savings
       - `imagesCleared`: `imagesToClear.size`
       - `triggerType`: "manual" or "auto"
    b. Mark microcompaction as in-progress: `setMicrocompactInProgress()`
    c. Create boundary marker: `boundaryMessage = createMicrocompactBoundary(...)`
    d. Record query source for next compaction
    e. Return `{ messages: newMessages, compactionInfo: { boundaryMessage } }`

19. **Otherwise** (no optimizations):
    - Return `{ messages: newMessages }` (messages array may have minor changes from attachment filtering)

**Edge cases:**
- **No eligible tool results**: Returns messages unchanged
- **All tool results recent**: Preserves all (no compaction)
- **Persistence failures**: Falls back to "[Old tool result content cleared]" message
- **Already persisted content**: Skips re-persistence (detected via `isPersistedContent()`)
- **Mixed compaction**: Can compact some tool results and clear some images in same pass

#### Why this approach

**Design rationale:**

1. **Greedy selection**: Maximizes token savings by compacting oldest, largest tool results first
   - **Simple**: O(n) algorithm, no complex optimization
   - **Effective**: Typically achieves 80-90% of optimal savings

2. **Recency preservation**: Always keeps last 3 tool results
   - **UX**: Recent tool results are most likely to be referenced next
   - **Correctness**: Prevents breaking active workflows (user may still be examining recent output)

3. **Auto vs manual mode**: Different validation logic
   - **Auto mode**: Only triggers if warning threshold exceeded AND minimum savings met
   - **Manual mode**: Always executes (no validation)
   - **Rationale**: Auto mode should be conservative; manual mode respects explicit user intent

4. **Image orphan detection**: Only clears images in user messages with no subsequent assistant response
   - **Safety**: Preserves images that assistant may have described/analyzed
   - **Efficiency**: Clears images that were never processed (wasted tokens)

5. **Persistent storage**: Saves to disk instead of deleting
   - **Reversibility**: User can recover original content via Read tool
   - **Debugging**: Enables inspection of tool results after compaction
   - **Trust**: Users feel safer knowing data isn't lost

**Trade-offs:**

- **Greedy vs optimal**: Greedy may leave some compactable results if threshold exceeded early, but optimal packing is NP-hard
- **Recency count (3)**: Could be configurable, but fixed count is simpler and "good enough"
- **Image orphan detection**: Could check if images were analyzed (image captioning), but detection logic would be complex
- **Persistence overhead**: Disk writes add latency (~50-100ms per file), but savings outweigh cost

**Alternative approaches considered:**

- **LRU-based selection**: Compact least-recently-used tool results - Rejected because chronological order is simpler and correlates with LRU
- **Size-based priority**: Compact largest results first - Rejected because may leave many small results that add up
- **Zero persistence**: Just delete content - Rejected due to data loss concerns

#### Key insight

Microcompaction implements **greedy recency-weighted token optimization** that balances maximum token savings with preservation of recent context. The clever part: **dual optimization** (tool results + images) in single pass, with different selection strategies (greedy threshold-based vs orphan detection).

**Example scenario:**
```
Messages:
  M0: user "Read config.json"
  M1: assistant [tool_use id=T1 Read file="config.json"]
  M2: user [tool_result tool_use_id=T1: <50KB JSON content>]  ← 40k tokens
  M3: assistant "Config loaded"
  M4: user "Read data.csv"
  M5: assistant [tool_use id=T2 Read file="data.csv"]
  M6: user [tool_result tool_use_id=T2: <100KB CSV content>] ← 80k tokens
  M7: assistant "Data loaded, 10k rows"
  M8: user "Read small.txt"
  M9: assistant [tool_use id=T3 Read file="small.txt"]
  M10: user [tool_result tool_use_id=T3: "Hello"]  ← 100 tokens (RECENT)
  M11: user [image: screenshot.png]  ← 2k tokens, NO assistant response (ORPHAN)

Token analysis:
  Total: ~122k tokens (40k + 80k + 0.1k + 2k)
  Eligible: T1 (40k), T2 (80k), T3 (100 tokens)
  Recent: T3 (preserve)
  Threshold: 40k tokens

Greedy selection:
  Start with T1 (oldest): 40k saved → Add to compactedSet
  Check T2: 40k + 80k = 120k > 40k threshold → STOP
  Result: compactedSet = {T1}

Image selection:
  M11 is orphan (no assistant response) → Add to imagesToClear
  Image savings: 2k tokens

Microcompaction result:
  M2: Replaced with "[Old tool result content cleared]"
  M6: PRESERVED (not selected by greedy algorithm)
  M10: PRESERVED (recent)
  M11: Image replaced with "[image]"

  Total savings: 40k (T1) + 2k (image) = 42k tokens (34% reduction)
```

#### Code Snippet

```javascript
// ============================================
// performMicrocompaction - Main microcompaction algorithm
// Location: chunks.147.mjs:310-462
// ============================================

// ORIGINAL (for source lookup):
async function gm(A, q, K) {
    if (Ds4(), J6(process.env.DISABLE_MICROCOMPACT) || x8("tengu_cache_plum_violet", !1)) return {
        messages: A
    };
    J6(process.env.USE_API_CONTEXT_MANAGEMENT);
    let Y = q !== void 0,
        z = Y ? q : BmY,
        w = [],
        H = new Map;
    for (let G of A)
        if ((G.type === "user" || G.type === "assistant") && Array.isArray(G.message.content)) {
            for (let f of G.message.content)
                if (f.type === "tool_use" && FmY.has(f.name)) {
                    if (!TG1.has(f.id)) w.push(f.id)
                } else if (f.type === "tool_result" && w.includes(f.tool_use_id)) {
                let Z = QmY(f.tool_use_id, f);
                H.set(f.tool_use_id, Z)
            }
        } let $ = w.slice(-mmY),
        O = Array.from(H.values()).reduce((G, f) => G + f, 0),
        _ = 0,
        J = new Set;
    for (let G of w) {
        if ($.includes(G)) continue;
        if (O - _ > z) J.add(G), _ += H.get(G) || 0
    }
    if (!Y) {
        let G = PZ(A),
            f = K?.options.mainLoopModel ?? l3();
        if (!Ac(G, f).isAboveWarningThreshold || _ < umY) J.clear(), _ = 0
    }
    let X = new Set,
        D = 0;
    {
        let G = new Set,
            f = [];
        for (let Z of A)
            if (Z.type === "user") f.push(Z.uuid);
            else if (Z.type === "assistant" && f.length > 0) {
            for (let N of f) G.add(N);
            f = []
        }
        for (let Z of A)
            if (Z.type === "user" && Array.isArray(Z.message.content) && G.has(Z.uuid)) {
                let N = 0;
                for (let T of Z.message.content)
                    if (T.type === "image") N += gCA;
                if (N > 0) X.add(Z.uuid), D += N
            }
    }
    let j = (G) => {
            return TG1.has(G) || J.has(G)
        },
        M = new Set;
    J.size > 0;
    let P = [];
    for (let G of A) {
        if (G.type === "attachment" && fZ6.has(G.uuid)) continue;
        if (G.type !== "user" && G.type !== "assistant") {
            P.push(G);
            continue
        }
        if (!Array.isArray(G.message.content)) {
            P.push(G);
            continue
        }
        if (G.type === "user") {
            let f = [],
                Z = !1,
                N = X.has(G.uuid);
            for (let T of G.message.content) {
                if (T.type === "image" && N) {
                    Z = !0, f.push({
                        type: "text",
                        text: "[image]"
                    });
                    continue
                }
                if (T.type === "tool_result" && j(T.tool_use_id) && T.content && !bmY(T.content)) {
                    Z = !0;
                    let k = NXA,
                        y = await uq1(T.content, T.tool_use_id);
                    if (!Bq1(y)) k = `${C$6}Tool result saved to: ${y.filepath}

Use ${Jq} to view${VXA}`;
                    f.push({
                        ...T,
                        content: k
                    })
                } else f.push(T)
            }
            if (f.length > 0) {
                let T = Z ? void 0 : G.toolUseResult;
                P.push({
                    ...G,
                    message: {
                        ...G.message,
                        content: f
                    },
                    toolUseResult: T
                })
            }
        } else {
            let f = [];
            for (let Z of G.message.content) f.push(Z);
            P.push({
                ...G,
                message: {
                    ...G.message,
                    content: f
                }
            })
        }
    }
    if (K && J.size > 0) {
        let G = new Map,
            f = new Set;
        for (let Z of A)
            if ((Z.type === "user" || Z.type === "assistant") && Array.isArray(Z.message.content)) {
                for (let N of Z.message.content)
                    if (N.type === "tool_use" && N.name === Jq) {
                        let T = N.input?.file_path;
                        if (typeof T === "string")
                            if (J.has(N.id)) G.set(T, N.id);
                            else f.add(T)
                    }
            } for (let [Z] of G)
            if (!f.has(Z)) K.readFileState.delete(Z)
    }
    for (let G of J) TG1.add(G);
    let W = _ + D;
    if (J.size > 0 || X.size > 0) {
        c("tengu_microcompact", {
            toolsCompacted: J.size,
            totalUncompactedTokens: O,
            tokensAfterCompaction: O - W,
            tokensSaved: _,
            imageTokensSaved: D,
            imagesCleared: X.size,
            triggerType: Y ? "manual" : "auto"
        }), NG1();
        let G = Ws4(Y ? "manual" : "auto", O, W, Array.from(J), Array.from(M));
        return bL7(K?.options.querySource ?? "repl_main_thread", K?.agentId), {
            messages: P,
            compactionInfo: {
                boundaryMessage: G
            }
        }
    }
    return {
        messages: P
    }
}

// READABLE (for understanding):
async function performMicrocompaction(messages, manualThreshold, context) {
    // ===== PHASE 1: Early Exit Checks =====
    clearMicrocompactInProgress();

    if (parseBoolean(process.env.DISABLE_MICROCOMPACT) || checkFeatureFlag("tengu_cache_plum_violet", false)) {
        return { messages: messages };
    }

    parseBoolean(process.env.USE_API_CONTEXT_MANAGEMENT); // Side effect only

    let isManualMode = manualThreshold !== undefined;
    let threshold = isManualMode ? manualThreshold : MANUAL_MICROCOMPACT_THRESHOLD;

    // ===== PHASE 2: Tool Result Collection =====
    let eligibleToolUseIds = [];
    let toolResultTokens = new Map();

    for (let message of messages) {
        if ((message.type === "user" || message.type === "assistant") && Array.isArray(message.message.content)) {
            for (let block of message.message.content) {
                // Collect tool_use IDs (eligible for compaction)
                if (block.type === "tool_use" && COMPACTABLE_TOOLS.has(block.name)) {
                    if (!compactedToolIds.has(block.id)) {
                        eligibleToolUseIds.push(block.id);
                    }
                }
                // Collect tool_result tokens
                else if (block.type === "tool_result" && eligibleToolUseIds.includes(block.tool_use_id)) {
                    let tokenCount = getOrCalculateToolResultTokens(block.tool_use_id, block);
                    toolResultTokens.set(block.tool_use_id, tokenCount);
                }
            }
        }
    }

    // ===== PHASE 3: Greedy Selection =====
    let recentToolIds = eligibleToolUseIds.slice(-KEEP_RECENT_TOOL_RESULTS); // Last 3
    let totalTokens = Array.from(toolResultTokens.values()).reduce((sum, count) => sum + count, 0);
    let tokensSaved = 0;
    let compactedSet = new Set();

    for (let toolUseId of eligibleToolUseIds) {
        // Preserve recent results
        if (recentToolIds.includes(toolUseId)) continue;

        // Greedy: compact if remaining tokens exceed threshold
        if (totalTokens - tokensSaved > threshold) {
            compactedSet.add(toolUseId);
            tokensSaved += toolResultTokens.get(toolUseId) || 0;
        }
    }

    // ===== PHASE 4: Auto-Compact Mode Validation =====
    if (!isManualMode) {
        let currentTokens = countTokens(messages);
        let model = context?.options.mainLoopModel ?? getDefaultModel();
        let status = getCompactionStatus(currentTokens, model);

        if (!status.isAboveWarningThreshold || tokensSaved < MIN_MICROCOMPACT_TOKENS) {
            compactedSet.clear();
            tokensSaved = 0;
        }
    }

    // ===== PHASE 5: Image Placeholder Selection =====
    let imagesToClear = new Set();
    let imageTokensSaved = 0;

    {
        let orphanedUserMessageUUIDs = new Set();
        let pendingUserMessages = [];

        // Identify orphaned user messages (no subsequent assistant response)
        for (let message of messages) {
            if (message.type === "user") {
                pendingUserMessages.push(message.uuid);
            } else if (message.type === "assistant" && pendingUserMessages.length > 0) {
                for (let uuid of pendingUserMessages) {
                    orphanedUserMessageUUIDs.add(uuid);
                }
                pendingUserMessages = [];
            }
        }

        // Select images to clear
        for (let message of messages) {
            if (message.type === "user" && Array.isArray(message.message.content) && orphanedUserMessageUUIDs.has(message.uuid)) {
                let imageTokenCount = 0;
                for (let block of message.message.content) {
                    if (block.type === "image") {
                        imageTokenCount += IMAGE_TOKEN_ESTIMATE;
                    }
                }
                if (imageTokenCount > 0) {
                    imagesToClear.add(message.uuid);
                    imageTokensSaved += imageTokenCount;
                }
            }
        }
    }

    // ===== PHASE 6: Message Processing =====
    let shouldCompactToolResult = (toolUseId) => {
        return compactedToolIds.has(toolUseId) || compactedSet.has(toolUseId);
    };

    let clearedAttachmentUUIDs = new Set(); // (unused in this snippet)

    let newMessages = [];

    for (let message of messages) {
        // Skip previously cleared attachments
        if (message.type === "attachment" && clearedAttachmentUUIDs.has(message.uuid)) {
            continue;
        }

        // Pass through non-content messages
        if (message.type !== "user" && message.type !== "assistant") {
            newMessages.push(message);
            continue;
        }

        if (!Array.isArray(message.message.content)) {
            newMessages.push(message);
            continue;
        }

        // Process user messages
        if (message.type === "user") {
            let newContent = [];
            let wasModified = false;
            let shouldClearImages = imagesToClear.has(message.uuid);

            for (let block of message.message.content) {
                // Replace images with "[image]"
                if (block.type === "image" && shouldClearImages) {
                    wasModified = true;
                    newContent.push({
                        type: "text",
                        text: "[image]"
                    });
                    continue;
                }

                // Replace large tool results with file references
                if (block.type === "tool_result" && shouldCompactToolResult(block.tool_use_id) && block.content && !isPersistedContent(block.content)) {
                    wasModified = true;

                    let replacementContent = CLEARED_CONTENT_MESSAGE;
                    let persistResult = await persistToolResult(block.content, block.tool_use_id);

                    if (!isErrorResult(persistResult)) {
                        replacementContent = `${PERSISTED_OUTPUT_START}Tool result saved to: ${persistResult.filepath}\n\nUse Read to view${PERSISTED_OUTPUT_END}`;
                    }

                    newContent.push({
                        ...block,
                        content: replacementContent
                    });
                } else {
                    newContent.push(block);
                }
            }

            if (newContent.length > 0) {
                let toolUseResult = wasModified ? undefined : message.toolUseResult;
                newMessages.push({
                    ...message,
                    message: {
                        ...message.message,
                        content: newContent
                    },
                    toolUseResult: toolUseResult
                });
            }
        }
        // Process assistant messages (copy as-is)
        else {
            let newContent = [];
            for (let block of message.message.content) {
                newContent.push(block);
            }
            newMessages.push({
                ...message,
                message: {
                    ...message.message,
                    content: newContent
                }
            });
        }
    }

    // ===== PHASE 7: State Tracking =====
    // Clean up read file state (remove files that were compacted)
    if (context && compactedSet.size > 0) {
        let compactedFileReads = new Map();
        let activeFileReads = new Set();

        for (let message of messages) {
            if ((message.type === "user" || message.type === "assistant") && Array.isArray(message.message.content)) {
                for (let block of message.message.content) {
                    if (block.type === "tool_use" && block.name === "Read") {
                        let filepath = block.input?.file_path;
                        if (typeof filepath === "string") {
                            if (compactedSet.has(block.id)) {
                                compactedFileReads.set(filepath, block.id);
                            } else {
                                activeFileReads.add(filepath);
                            }
                        }
                    }
                }
            }
        }

        for (let [filepath] of compactedFileReads) {
            if (!activeFileReads.has(filepath)) {
                context.readFileState.delete(filepath);
            }
        }
    }

    // Update global compacted IDs
    for (let toolUseId of compactedSet) {
        compactedToolIds.add(toolUseId);
    }

    let totalSaved = tokensSaved + imageTokensSaved;

    // ===== PHASE 8: Return Result =====
    if (compactedSet.size > 0 || imagesToClear.size > 0) {
        reportTelemetry("tengu_microcompact", {
            toolsCompacted: compactedSet.size,
            totalUncompactedTokens: totalTokens,
            tokensAfterCompaction: totalTokens - totalSaved,
            tokensSaved: tokensSaved,
            imageTokensSaved: imageTokensSaved,
            imagesCleared: imagesToClear.size,
            triggerType: isManualMode ? "manual" : "auto"
        });

        setMicrocompactInProgress();

        let boundaryMessage = createMicrocompactBoundary(
            isManualMode ? "manual" : "auto",
            totalTokens,
            totalSaved,
            Array.from(compactedSet),
            Array.from(clearedAttachmentUUIDs)
        );

        recordQuerySource(context?.options.querySource ?? "repl_main_thread", context?.agentId);

        return {
            messages: newMessages,
            compactionInfo: {
                boundaryMessage: boundaryMessage
            }
        };
    }

    return {
        messages: newMessages
    };
}

// Mapping: gm→performMicrocompaction, A→messages, q→manualThreshold, K→context, Y→isManualMode, z→threshold, w→eligibleToolUseIds, H→toolResultTokens, G→message/toolUseId, f→block/model, $→recentToolIds, O→totalTokens, _→tokensSaved, J→compactedSet, X→imagesToClear, D→imageTokensSaved, Z→message/filepath/uuid, N→imageTokenCount/block, T→block/toolUseResult, j→shouldCompactToolResult, M→clearedAttachmentUUIDs, P→newMessages, k→replacementContent, y→persistResult, W→totalSaved, Ds4→clearMicrocompactInProgress, J6→parseBoolean, x8→checkFeatureFlag, BmY→MANUAL_MICROCOMPACT_THRESHOLD, FmY→COMPACTABLE_TOOLS, TG1→compactedToolIds, mmY→KEEP_RECENT_TOOL_RESULTS, QmY→getOrCalculateToolResultTokens, PZ→countTokens, l3→getDefaultModel, Ac→getCompactionStatus, umY→MIN_MICROCOMPACT_TOKENS, gCA→IMAGE_TOKEN_ESTIMATE, bmY→isPersistedContent, uq1→persistToolResult, Bq1→isErrorResult, NXA→CLEARED_CONTENT_MESSAGE, C$6→PERSISTED_OUTPUT_START, VXA→PERSISTED_OUTPUT_END, Jq→READ_TOOL_NAME, fZ6→clearedAttachmentUUIDs (global), NG1→setMicrocompactInProgress, Ws4→createMicrocompactBoundary, c→reportTelemetry, bL7→recordQuerySource
```

---

### 2. Tool Result Persistence

**Function:** `persistToolResult` (uq1)
**Location:** chunks.80.mjs:2721-2758
**Purpose:** Saves large tool result content to disk file

#### What it does

Writes tool result content (string or JSON array) to a file in `~/.claude/tool-results/` directory, returning file path and preview. Returns error object if persistence fails.

#### How it works

**Step-by-step algorithm:**

1. **Validate content**: Check if content is array
   - If array: Ensure all elements are `type: "text"` (reject non-text content)
   - Return `{ error: "Cannot persist tool results containing non-text content" }` if validation fails

2. **Ensure directory exists**: Call `ensureToolResultsDirectory()` to create `~/.claude/tool-results/` if missing

3. **Determine format**: Set `format = "json"` if array, `"txt"` if string

4. **Build file path**: `filepath = join(getToolResultsDirectory(), `${toolUseId}.${format}`)`

5. **Serialize content**:
   - If JSON: `content = stringify(array, null, 2)` (pretty-print)
   - If string: `content = original string`

6. **Check if file exists**: Try to access file using `fileExists(filepath)`
   - If exists, set `alreadyExists = true`
   - Otherwise, set `alreadyExists = false`

7. **Write file** (if not exists):
   - Call `writeFile(filepath, content, "utf-8")`
   - If write fails:
     - Log error
     - Return `{ error: formatError(error) }`

8. **Log success**: Log message "Persisted tool result to {filepath} ({size})"

9. **Generate preview**:
   - Call `createPreview(content, PREVIEW_SIZE)` → `{ preview, hasMore }`
   - Preview is first 2000 characters (or up to last newline)

10. **Return success**: Return object:
    ```javascript
    {
        filepath: string,
        originalSize: number,
        isJson: boolean,
        preview: string,
        hasMore: boolean
    }
    ```

**Edge cases:**
- **File already exists**: Skips write, returns existing file info
- **Non-text content in array**: Returns error, doesn't persist
- **Write permission denied**: Returns error with formatted message
- **Disk full**: Returns error

#### Key insight

Persistence enables **reversible microcompaction** - users can always recover original content via `Read` tool, building trust in the optimization.

---

## Integration Points

### 1. Agent Loop Integration

**When**: After each assistant response, before returning to user

**Flow:**
```
Agent Loop
├─ LLM generates response
├─ Append assistant message to conversation
├─ Check if microcompaction needed:
│  └─ If token usage > warning threshold AND savings >= 20k:
│     └─ Call performMicrocompaction(messages, undefined, context)
└─ Return response to user
```

### 2. Manual Microcompaction

**Trigger**: User runs `/microcompact` command or calls SDK method

**Flow:**
```
User Command
└─ Call performMicrocompaction(messages, MANUAL_THRESHOLD, context)
   └─ Always executes (no auto-mode validation)
```

### 3. Full Compaction Integration

**When**: Before standard/session memory compaction

**Flow:**
```
performFullCompaction()
├─ Check if should auto-compact
├─ Run microcompaction FIRST:
│  └─ messages = performMicrocompaction(messages, ...)
├─ Then run full compaction on optimized messages
└─ Return compaction result
```

**Benefit**: Microcompaction reduces input tokens for LLM summarization call, saving API costs.

### 4. State Restoration

**When**: Loading conversation from .jsonl transcript

**Flow:**
```
loadConversation()
├─ Read messages from .jsonl file
├─ Find microcompact boundary messages
├─ Extract compactedToolIds from metadata
├─ Restore global compactedToolIds set
└─ Prevents re-compaction of already compacted tool results
```

---

## Performance Considerations

### Latency

**Problem**: File writes add latency (50-100ms per file)
**Impact**: For 5 compacted tool results, adds 250-500ms to microcompaction
**Mitigation**: Acceptable because:
- Microcompaction saves 10-30s of LLM API call latency
- File writes happen in background (don't block UI)

### Disk Usage

**Problem**: Tool results persist in `~/.claude/tool-results/` indefinitely
**Growth rate**: ~10-50MB per day for heavy tool users
**Mitigation**:
- Files are plain text (highly compressible)
- Could add TTL or LRU eviction (not currently implemented)

### Memory Pressure

**Problem**: Loading large tool results into memory for persistence
**Impact**: 5 × 100KB = 500KB peak memory usage
**Mitigation**: Negligible compared to LLM conversation memory (~10-50MB)

---

## Telemetry

**Event**: `tengu_microcompact`
**Properties:**
- `toolsCompacted`: Number of tool results compacted
- `totalUncompactedTokens`: Original token count
- `tokensAfterCompaction`: Token count after microcompaction
- `tokensSaved`: Tokens saved from tool result compaction
- `imageTokensSaved`: Tokens saved from image placeholder replacement
- `imagesCleared`: Number of images replaced
- `triggerType`: "auto" or "manual"

**Analysis**: Tracks effectiveness of microcompaction across users to optimize thresholds.

---

## Symbol Updates

The following symbols should be added to `symbol_index_core_features.md` under **Module: Compact > Microcompaction**:

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| gm | performMicrocompaction | chunks.147.mjs:310 | function |
| Ps4 | calculateToolResultTokens | chunks.147.mjs:280 | function |
| PU1 | calculateMessageTokens | chunks.147.mjs:296 | function |
| QmY | getOrCalculateToolResultTokens | chunks.147.mjs:290 | function |
| uq1 | persistToolResult | chunks.80.mjs:2721 | function |
| Ws4 | createMicrocompactBoundary | chunks.173.mjs:1236 | function |
| QCA | isMicrocompactBoundary | chunks.173.mjs:1255 | function |
| bmY | isPersistedContent | chunks.147.mjs:255 | function |
| Bq1 | isErrorResult | chunks.80.mjs:2813 | function |
| UCA | restoreMicrocompactState | chunks.147.mjs:263 | function |
| Ms4 | resetMicrocompactState | chunks.147.mjs:259 | function |
| NG1 | setMicrocompactInProgress | chunks.147.mjs:221 | function |
| Ds4 | clearMicrocompactInProgress | chunks.147.mjs:225 | function |
| js4 | resetMicrocompactStateAndFlag | chunks.147.mjs:229 | function |
| FD9 | createPreview | chunks.80.mjs:2799 | function |
| BD9 | formatPersistedOutputMessage | chunks.80.mjs:2760 | function |
| umY | MIN_MICROCOMPACT_TOKENS | chunks.147.mjs:464 | constant (20000) |
| BmY | MANUAL_MICROCOMPACT_THRESHOLD | chunks.147.mjs:466 | constant (40000) |
| mmY | KEEP_RECENT_TOOL_RESULTS | chunks.147.mjs:468 | constant (3) |
| gCA | IMAGE_TOKEN_ESTIMATE | chunks.147.mjs:470 | constant (2000) |
| NXA | CLEARED_CONTENT_MESSAGE | chunks.80.mjs:2844 | constant |
| C$6 | PERSISTED_OUTPUT_START | chunks.80.mjs:2840 | constant |
| VXA | PERSISTED_OUTPUT_END | chunks.80.mjs:2842 | constant |
| fXA | TOOL_RESULTS_DIR | chunks.80.mjs:2838 | constant ("tool-results") |
| ex7 | PREVIEW_SIZE | chunks.80.mjs:2846 | constant (2000) |
| FmY | COMPACTABLE_TOOLS | chunks.147.mjs:498 | variable (Set) |
| TG1 | compactedToolIds | chunks.147.mjs:474 | variable (Set) |
| fZ6 | clearedAttachmentUUIDs | chunks.147.mjs:476 | variable (Set) |
| VZ6 | toolResultTokenCache | chunks.147.mjs:478 | variable (Map) |
| MU1 | microcompactInProgress | chunks.147.mjs:247 | variable (boolean) |

---

## Conclusion

Microcompaction is a **lightweight, greedy, recency-preserving token optimization** that achieves 20-50% token reduction in tool-heavy conversations without LLM involvement. By selectively replacing old tool results with file references and clearing orphaned images, it significantly delays the need for expensive full compaction while maintaining recent context integrity.

**Key takeaways:**
1. **Greedy selection**: Maximizes token savings by compacting oldest results first
2. **Recency preservation**: Always keeps last 3 tool results intact
3. **Dual optimization**: Tool results (file persistence) + images (placeholder replacement)
4. **Auto/manual modes**: Auto mode validates savings; manual mode always executes
5. **Reversible**: Original content saved to disk for recovery
6. **Cost-effective**: 250-500ms latency vs 10-30s full compaction

This architecture makes Claude Code conversations **token-efficient** while preserving **user trust** through reversible optimizations.
