# Memory Context Architecture

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

## Overview

Claude Code implements a sophisticated memory management system to handle long conversations while staying within model context limits. The system has multiple layers:

1. **Token Counting** - Track token usage by message type
2. **Threshold Detection** - Determine when compaction is needed
3. **Micro-compaction** - Fast, local cleanup of old tool results
4. **Full Compaction** - LLM-based summarization with 9-section structure
5. **Nested Memory** - Cached session summaries to avoid repeated LLM calls
6. **Nested Memory File Watching** - Auto-attach relevant files when directories change
7. **Message Flattening** - Consolidate messages for API calls

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Memory Context System                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Token Accounting (yI2)                  │  │
│  │  Tracks: humanMessages, assistantMessages, toolRequests,│  │
│  │          toolResults, attachments, duplicateFileReads    │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Threshold Detection (x1A)                 │  │
│  │  zQ0 = 13000 (compact trigger)                           │  │
│  │  rD5 = 20000 (warning threshold)                         │  │
│  │  oD5 = 20000 (upper limit)                               │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│           ┌───────────────────┼───────────────────┐            │
│           ▼                                       ▼            │
│  ┌─────────────────────┐              ┌─────────────────────┐  │
│  │  Micro-compact (Si) │              │ Auto-Compact (sI2)  │  │
│  │  - Local operation  │              │ ┌─────────────────┐ │  │
│  │  - No API call      │              │ │ Nested Mem (f91)│ │  │
│  │  - Clears old tools │              │ │ - Cache lookup  │ │  │
│  │  - "[Cleared]" msg  │              │ │ - summary.md    │ │  │
│  └─────────────────────┘              │ └────────┬────────┘ │  │
│                                       │          │ miss     │  │
│                                       │          ▼          │  │
│                                       │ ┌─────────────────┐ │  │
│                                       │ │ Full (j91)      │ │  │
│                                       │ │ - LLM call      │ │  │
│                                       │ │ - 9-section sum │ │  │
│                                       │ │ - File restore  │ │  │
│                                       │ └─────────────────┘ │  │
│                                       └─────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Message Flattening (WZ)                     │  │
│  │  - Filter progress/system messages                       │  │
│  │  - Merge consecutive user/assistant messages             │  │
│  │  - Validate tool_use input schemas                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Nested Memory File Watching (qH5)               │  │
│  │  - nestedMemoryAttachmentTriggers Set                    │  │
│  │  - Watches file changes in directories                   │  │
│  │  - Creates nested_memory attachments                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Token Counting

### Token Accounting Function

```javascript
// ============================================
// buildTokenAccounting - Build token usage statistics
// Location: chunks.107.mjs:792-830
// ============================================

// ORIGINAL (for source lookup):
function yI2(A) {
  let Q = {
    toolRequests: new Map,
    toolResults: new Map,
    humanMessages: 0,
    assistantMessages: 0,
    localCommandOutputs: 0,
    other: 0,
    attachments: new Map,
    duplicateFileReads: new Map,
    total: 0
  },
  B = new Map,
  G = new Map,
  Z = new Map;

  return A.forEach((Y) => {
    if (Y.type === "attachment") {
      let J = Y.attachment.type || "unknown";
      Q.attachments.set(J, (Q.attachments.get(J) || 0) + 1)
    }
  }),

  WZ(A).forEach((Y) => {
    let { content: J } = Y.message;
    if (typeof J === "string") {
      let W = gG(J);
      if (Q.total += W, Y.type === "user" && J.includes("local-command-stdout"))
        Q.localCommandOutputs += W;
      else
        Q[Y.type === "user" ? "humanMessages" : "assistantMessages"] += W
    } else J.forEach((W) => TD5(W, Y, Q, B, G, Z))
  }),

  Z.forEach((Y, J) => {
    if (Y.count > 1) {
      let X = Math.floor(Y.totalTokens / Y.count) * (Y.count - 1);
      Q.duplicateFileReads.set(J, {
        count: Y.count,
        tokens: X
      })
    }
  }), Q
}

// READABLE (for understanding):
function buildTokenAccounting(messages) {
  let stats = {
    toolRequests: new Map(),      // tool name → token count
    toolResults: new Map(),       // tool name → token count
    humanMessages: 0,             // human message tokens
    assistantMessages: 0,         // assistant message tokens
    localCommandOutputs: 0,       // command output tokens
    other: 0,                     // images, documents, etc.
    attachments: new Map(),       // attachment type → count
    duplicateFileReads: new Map(),// file path → {count, tokens}
    total: 0                      // grand total
  };

  let toolUseIdToName = new Map();     // tool_use id → tool name
  let readToolIdToPath = new Map();    // tool_use id → file path
  let filePathReadCounts = new Map();  // file path → {count, totalTokens}

  // Count attachments
  messages.forEach((msg) => {
    if (msg.type === "attachment") {
      let attachType = msg.attachment.type || "unknown";
      stats.attachments.set(attachType, (stats.attachments.get(attachType) || 0) + 1);
    }
  });

  // Count tokens in flattened messages
  flattenMessages(messages).forEach((msg) => {
    let { content } = msg.message;
    if (typeof content === "string") {
      let tokens = countTokens(content);
      stats.total += tokens;
      if (msg.type === "user" && content.includes("local-command-stdout")) {
        stats.localCommandOutputs += tokens;
      } else {
        stats[msg.type === "user" ? "humanMessages" : "assistantMessages"] += tokens;
      }
    } else {
      content.forEach((block) =>
        countContentBlock(block, msg, stats, toolUseIdToName, readToolIdToPath, filePathReadCounts)
      );
    }
  });

  // Calculate duplicate file read overhead
  filePathReadCounts.forEach((info, filePath) => {
    if (info.count > 1) {
      let duplicateTokens = Math.floor(info.totalTokens / info.count) * (info.count - 1);
      stats.duplicateFileReads.set(filePath, {
        count: info.count,
        tokens: duplicateTokens
      });
    }
  });

  return stats;
}

// Mapping: yI2→buildTokenAccounting, WZ→flattenMessages, gG→countTokens,
// TD5→countContentBlock
```

### Token Distribution Analysis

```javascript
// ============================================
// buildTokenMetrics - Convert stats to percentages
// Location: chunks.107.mjs:891-918
// ============================================

// READABLE (for understanding):
function buildTokenMetrics(stats) {
  let metrics = {
    total_tokens: stats.total,
    human_message_tokens: stats.humanMessages,
    assistant_message_tokens: stats.assistantMessages,
    local_command_output_tokens: stats.localCommandOutputs,
    other_tokens: stats.other
  };

  // Add attachment counts
  stats.attachments.forEach((count, type) => {
    metrics[`attachment_${type}_count`] = count;
  });

  // Add tool token counts
  stats.toolRequests.forEach((tokens, name) => {
    metrics[`tool_request_${name}_tokens`] = tokens;
  });
  stats.toolResults.forEach((tokens, name) => {
    metrics[`tool_result_${name}_tokens`] = tokens;
  });

  // Calculate duplicate read overhead
  let duplicateTokens = [...stats.duplicateFileReads.values()]
    .reduce((sum, info) => sum + info.tokens, 0);

  metrics.duplicate_read_tokens = duplicateTokens;
  metrics.duplicate_read_file_count = stats.duplicateFileReads.size;

  // Calculate percentages if total > 0
  if (stats.total > 0) {
    metrics.human_message_percent = Math.round(stats.humanMessages / stats.total * 100);
    metrics.assistant_message_percent = Math.round(stats.assistantMessages / stats.total * 100);
    metrics.local_command_output_percent = Math.round(stats.localCommandOutputs / stats.total * 100);
    metrics.duplicate_read_percent = Math.round(duplicateTokens / stats.total * 100);

    let totalToolRequests = [...stats.toolRequests.values()].reduce((a, b) => a + b, 0);
    let totalToolResults = [...stats.toolResults.values()].reduce((a, b) => a + b, 0);
    metrics.tool_request_percent = Math.round(totalToolRequests / stats.total * 100);
    metrics.tool_result_percent = Math.round(totalToolResults / stats.total * 100);
  }

  return metrics;
}

// Mapping: xI2→buildTokenMetrics
```

**Key insight:** The duplicate file read tracking identifies files that have been read multiple times in a session. The overhead is calculated as `(totalTokens / count) * (count - 1)` - essentially the tokens that could be saved if the file were only read once.

---

## 2. Compaction Thresholds

```javascript
// Location: chunks.107.mjs:1733-1737

// ORIGINAL:
zQ0 = 13000   // Auto-compact trigger threshold
rD5 = 20000   // Warning threshold
oD5 = 20000   // Upper limit

// READABLE:
AUTO_COMPACT_TRIGGER = 13000;  // Start compaction when tokens exceed this
WARNING_THRESHOLD = 20000;     // Show user warning about context size
UPPER_LIMIT = 20000;           // Hard cap on context size
```

---

## 3. Micro-Compaction

Micro-compaction is a fast, local operation that clears old tool result content without making an API call.

```javascript
// ============================================
// microCompact - Clear old tool results locally
// Location: chunks.107.mjs:1440-1545
// ============================================

// ORIGINAL (for source lookup):
async function Si(A, Q, B) {
  if (x91 = !1, Y0(process.env.DISABLE_MICROCOMPACT)) return { messages: A };
  if (lD5(e1(), A)) return { messages: A };

  let G = Q !== void 0,
    Z = G ? Q : dD5,
    I = [],
    Y = new Map;

  // Collect tool results to potentially compact
  for (let D of A)
    if ((D.type === "user" || D.type === "assistant") && Array.isArray(D.message.content)) {
      for (let H of D.message.content)
        if (H.type === "tool_use" && pD5.has(H.name)) {
          if (!DQ0.has(H.id)) I.push(H.id)
        } else if (H.type === "tool_result" && I.includes(H.tool_use_id)) {
          let C = iD5(H.tool_use_id, H);
          Y.set(H.tool_use_id, C)
        }
    }

  let J = I.slice(-cD5),  // Keep last N tool results
    W = Array.from(Y.values()).reduce((D, H) => D + H, 0),
    X = 0,
    V = new Set;

  // Select tools to compact
  for (let D of I) {
    if (J.includes(D)) continue;  // Don't compact recent tools
    if (W - X > Z) V.add(D), X += Y.get(D) || 0
  }

  // ... rest of compaction logic
}

// READABLE (for understanding):
async function microCompact(messages, sessionContext, memoryType) {
  microCompactOccurred = false;

  // Skip if disabled
  if (parseBoolean(process.env.DISABLE_MICROCOMPACT)) {
    return { messages };
  }

  // Skip if not needed
  if (shouldSkipMicroCompact(getModel(), messages)) {
    return { messages };
  }

  let isManualTrigger = sessionContext !== undefined;
  let targetTokens = isManualTrigger ? sessionContext : DEFAULT_MICRO_COMPACT_THRESHOLD;

  let eligibleToolIds = [];
  let toolTokenCounts = new Map();

  // Identify compactable tool results
  for (let msg of messages) {
    if ((msg.type === "user" || msg.type === "assistant") && Array.isArray(msg.message.content)) {
      for (let block of msg.message.content) {
        if (block.type === "tool_use" && COMPACTABLE_TOOLS.has(block.name)) {
          if (!alreadyCompacted.has(block.id)) {
            eligibleToolIds.push(block.id);
          }
        } else if (block.type === "tool_result" && eligibleToolIds.includes(block.tool_use_id)) {
          let tokens = estimateToolResultTokens(block.tool_use_id, block);
          toolTokenCounts.set(block.tool_use_id, tokens);
        }
      }
    }
  }

  // Keep last N tool results (protected from compaction)
  let protectedToolIds = eligibleToolIds.slice(-KEEP_LAST_N_TOOLS);
  let totalUncompactedTokens = [...toolTokenCounts.values()].reduce((a, b) => a + b, 0);
  let tokensSaved = 0;
  let toCompact = new Set();

  // Select tools to compact
  for (let toolId of eligibleToolIds) {
    if (protectedToolIds.includes(toolId)) continue;  // Keep recent
    if (totalUncompactedTokens - tokensSaved > targetTokens) {
      toCompact.add(toolId);
      tokensSaved += toolTokenCounts.get(toolId) || 0;
    }
  }

  // Replace compacted tool results with placeholder
  let compactedMessages = [];
  for (let msg of messages) {
    if (msg.type !== "user" && msg.type !== "assistant") {
      compactedMessages.push(msg);
      continue;
    }
    if (msg.type === "user") {
      let newContent = [];
      for (let block of msg.message.content) {
        if (block.type === "tool_result" && shouldCompact(block.tool_use_id)) {
          newContent.push({
            ...block,
            content: "[Old tool result content cleared]"  // <-- Placeholder
          });
        } else {
          newContent.push(block);
        }
      }
      if (newContent.length > 0) {
        compactedMessages.push({
          ...msg,
          message: { ...msg.message, content: newContent }
        });
      }
    } else {
      compactedMessages.push(msg);
    }
  }

  // Also clear readFileState for compacted Read tool results
  if (memoryType && toCompact.size > 0) {
    // ... clear file state for compacted files
  }

  // Track compacted tool IDs
  for (let toolId of toCompact) {
    alreadyCompacted.add(toolId);
  }

  if (toCompact.size > 0) {
    trackTelemetry("tengu_microcompact", {
      toolsCompacted: toCompact.size,
      totalUncompactedTokens,
      tokensAfterCompaction: totalUncompactedTokens - tokensSaved,
      tokensSaved,
      triggerType: isManualTrigger ? "manual" : "auto"
    });
    microCompactOccurred = true;
    notifyCompactListeners();
    return { messages: compactedMessages };
  }

  return { messages: compactedMessages };
}

// Mapping: Si→microCompact, pD5→COMPACTABLE_TOOLS, DQ0→alreadyCompacted,
// cD5→KEEP_LAST_N_TOOLS, dD5→DEFAULT_MICRO_COMPACT_THRESHOLD
```

**How micro-compaction works:**
1. Identifies tool results from compactable tools (Read, Bash, etc.)
2. Keeps the N most recent tool results protected
3. Replaces old tool result content with `"[Old tool result content cleared]"`
4. Clears corresponding `readFileState` entries for Read tools
5. Tracks which tools have been compacted to avoid re-processing

---

## 4. Full Compaction (LLM-Based)

Full compaction uses an LLM call to generate a structured summary of the entire conversation. This is the fallback when nested memory cache is not available.

```javascript
// ============================================
// fullCompact - LLM-based conversation summarization
// Location: chunks.107.mjs:1120-1237
// ============================================

// ORIGINAL (for source lookup):
async function j91(A, Q, B, G, Z = !1) {
  try {
    if (A.length === 0) throw Error(cMA);
    let I = ZK(A),
      Y = yI2(A),
      J = {};
    try { J = xI2(Y) } catch (e) { AA(e) }
    let W = await Q.getAppState();
    P91(W.toolPermissionContext, "summary"),
    Q.setSpinnerMessage?.("Running PreCompact hooks...");
    let X = await FQ0({ trigger: Z ? "auto" : "manual", customInstructions: G ?? null, sessionId: Q.agentId }, Q.abortController.signal);
    // ... build summary request
    let H = RYA({
      messages: WZ([...nk(A), K]),
      systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."],
      maxThinkingTokens: 0,
      tools: [n8],
      signal: Q.abortController.signal,
      options: { model: k3(), querySource: "compact", ... }
    })[Symbol.asyncIterator]();
    // ... stream response and build summary
    let q = ji(U);  // Extract summary text
    Q.readFileState.clear();
    let N = await bD5(w, Q, _D5);  // Restore top 5 files
    // ... return compaction result
  }
}

// READABLE (for understanding):
async function fullCompact(messages, sessionContext, isInternal, customInstructions, isAutoTrigger = false) {
  try {
    if (messages.length === 0) {
      throw Error(EMPTY_MESSAGES_ERROR);
    }

    let preCompactTokenCount = countTotalTokens(messages);
    let tokenStats = buildTokenAccounting(messages);
    let tokenMetrics = {};
    try {
      tokenMetrics = buildTokenMetrics(tokenStats);
    } catch (e) { logError(e); }

    let appState = await sessionContext.getAppState();

    // UI updates
    sessionContext.setSpinnerMessage?.("Running PreCompact hooks...");
    sessionContext.setSDKStatus?.("compacting");

    // Run pre-compact hooks (allow custom instructions injection)
    let hookResult = await runPreCompactHooks({
      trigger: isAutoTrigger ? "auto" : "manual",
      customInstructions: customInstructions ?? null,
      sessionId: sessionContext.agentId
    }, sessionContext.abortController.signal);

    if (hookResult.newCustomInstructions) {
      customInstructions = customInstructions
        ? `${customInstructions}\n\n${hookResult.newCustomInstructions}`
        : hookResult.newCustomInstructions;
    }

    sessionContext.setSpinnerMessage?.("Compacting conversation");

    // Build compaction prompt
    let compactionPrompt = buildCompactionPrompt(customInstructions);
    let userMessage = createUserMessage({ content: compactionPrompt });

    // Send to LLM for summarization
    let streamIterator = createStreamingRequest({
      messages: flattenMessages([...getMessageHistory(messages), userMessage]),
      systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."],
      maxThinkingTokens: 0,
      tools: [SUMMARY_TOOL],  // Tool for structured output
      signal: sessionContext.abortController.signal,
      options: {
        model: getCurrentModel(),
        querySource: "compact",
        maxOutputTokensOverride: MAX_COMPACT_OUTPUT_TOKENS
      }
    })[Symbol.asyncIterator]();

    // Stream and collect response
    let assistantResponse;
    let streamStarted = false;
    let chunk = await streamIterator.next();
    while (!chunk.done) {
      let event = chunk.value;

      // Track streaming progress
      if (!streamStarted && event.type === "stream_event" &&
          event.event.type === "content_block_start" &&
          event.event.content_block.type === "text") {
        streamStarted = true;
        sessionContext.setStreamMode?.("responding");
      }

      if (event.type === "stream_event" &&
          event.event.type === "content_block_delta" &&
          event.event.delta.type === "text_delta") {
        let textLength = event.event.delta.text.length;
        sessionContext.setResponseLength?.((len) => len + textLength);
      }

      if (event.type === "assistant") {
        assistantResponse = event;
      }
      chunk = await streamIterator.next();
    }

    if (!assistantResponse) {
      throw Error("Failed to get summary response from streaming");
    }

    // Extract summary text
    let summaryText = extractTextFromResponse(assistantResponse);
    if (!summaryText) {
      throw Error("Failed to generate conversation summary - response did not contain valid text content");
    }

    // Clear old file state, restore top N files
    let oldFileState = cloneFileState(sessionContext.readFileState);
    sessionContext.readFileState.clear();

    let attachments = await restoreTopFiles(oldFileState, sessionContext, MAX_FILES_TO_RESTORE);

    // Restore todo list if exists
    let todoAttachment = getTodoAttachment(sessionContext.agentId);
    if (todoAttachment) attachments.push(todoAttachment);

    // Restore plan file reference if exists
    let planAttachment = getPlanFileAttachment(sessionContext.agentId);
    if (planAttachment) attachments.push(planAttachment);

    // Run post-compact hooks
    sessionContext.setSpinnerMessage?.("Running SessionStart hooks...");
    let sessionStartHookResults = await runSessionStartHooks("compact");

    let postCompactTokenCount = countTotalTokens([assistantResponse]);
    let usage = extractUsage(assistantResponse);

    // Track telemetry
    trackTelemetry("tengu_compact", {
      preCompactTokenCount,
      postCompactTokenCount,
      compactionInputTokens: usage?.input_tokens,
      compactionOutputTokens: usage?.output_tokens,
      ...tokenMetrics
    });

    // Build result
    let boundaryMarker = createCompactBoundary(isAutoTrigger ? "auto" : "manual", preCompactTokenCount ?? 0);
    let summaryMessages = [createUserMessage({
      content: formatSummaryWithPreamble(summaryText, isInternal),
      isCompactSummary: true,
      isVisibleInTranscriptOnly: true
    })];

    return {
      boundaryMarker,
      summaryMessages,
      attachments,
      hookResults: sessionStartHookResults,
      userDisplayMessage: hookResult.userDisplayMessage,
      preCompactTokenCount,
      postCompactTokenCount,
      compactionUsage: usage
    };
  } catch (error) {
    handleCompactError(error, sessionContext);
    throw error;
  } finally {
    // Reset UI state
    sessionContext.setStreamMode?.("requesting");
    sessionContext.setResponseLength?.(() => 0);
    sessionContext.setSpinnerMessage?.(null);
    sessionContext.setSDKStatus?.(null);
  }
}

// Mapping: j91→fullCompact, ZK→countTotalTokens, yI2→buildTokenAccounting,
// xI2→buildTokenMetrics, FQ0→runPreCompactHooks, R91→buildCompactionPrompt,
// WZ→flattenMessages, nk→getMessageHistory, RYA→createStreamingRequest,
// ji→extractTextFromResponse, GA2→cloneFileState, bD5→restoreTopFiles,
// fD5→getTodoAttachment, XQ0→getPlanFileAttachment, wq→runSessionStartHooks,
// C91→extractUsage, S91→createCompactBoundary, T91→formatSummaryWithPreamble
```

### Compaction Prompt Structure

The compaction prompt instructs the LLM to create a structured summary:

```javascript
// ============================================
// buildCompactionPrompt - Create summarization instructions
// Location: chunks.107.mjs:537-710
// ============================================

// READABLE (for understanding):
function buildCompactionPrompt(customInstructions) {
  if (!customInstructions || customInstructions.trim() === "") {
    return `Your task is to create a detailed summary of the conversation so far,
paying close attention to the user's explicit requests and your previous actions.

This summary should be thorough in capturing technical details, code patterns,
and architectural decisions that would be essential for continuing development
work without losing context.

Before providing your final summary, wrap your analysis in <analysis> tags...

Your summary should include the following sections:

1. Primary Request and Intent: What was the user's main goal?
2. Key Technical Concepts: Important patterns, technologies, decisions
3. Files and Code Sections: Specific file paths, line numbers, code changes
4. Errors and Fixes: Problems encountered and how they were resolved
5. Problem Solving: Current understanding, what was tried
6. All User Messages: Capture every user message chronologically
7. Pending Tasks: Work items that remain incomplete
8. Current Work: What was being worked on when context ran out
9. Optional Next Step: Suggested continuation action`;
  }

  // With custom instructions from hooks
  return `${basePrompt}

Additionally, consider these custom instructions when creating your summary:
${customInstructions}`;
}

// Mapping: R91→buildCompactionPrompt
```

### Summary Preamble

The summary is wrapped with a preamble that instructs the model to continue:

```javascript
// ============================================
// formatSummaryWithPreamble - Add context continuation message
// Location: chunks.107.mjs:754-760
// ============================================

// ORIGINAL (for source lookup):
function T91(A, Q) {
  let G = `This session is being continued from a previous conversation that ran out of context. The conversation is summarized below:
${MD5(A)}.`;
  if (Q) return `${G}
Please continue the conversation from where we left it off without asking the user any further questions. Continue with the last task that you were asked to work on.`;
  return G
}

// READABLE (for understanding):
function formatSummaryWithPreamble(summaryText, shouldContinue) {
  let preamble = `This session is being continued from a previous conversation that ran out of context. The conversation is summarized below:
${cleanupSummaryTags(summaryText)}.`;

  if (shouldContinue) {
    return `${preamble}
Please continue the conversation from where we left it off without asking the user any further questions. Continue with the last task that you were asked to work on.`;
  }
  return preamble;
}

// Mapping: T91→formatSummaryWithPreamble, MD5→cleanupSummaryTags
```

### Post-Compact File Restoration

After compaction, the top N most recently accessed files are restored:

```javascript
// ============================================
// restoreTopFiles - Re-attach recent files after compaction
// Location: chunks.107.mjs:1248-1269
// ============================================

// ORIGINAL (for source lookup):
async function bD5(A, Q, B) {
  let G = Object.entries(A).map(([Y, J]) => ({
      filename: Y,
      ...J
    })).filter((Y) => !hD5(Y.filename, Q.agentId))
    .sort((Y, J) => J.timestamp - Y.timestamp)
    .slice(0, B),
  // ... read files and return attachments
}

// READABLE (for understanding):
async function restoreTopFiles(oldFileState, sessionContext, maxFiles) {
  // Convert file state map to array, filter excluded files
  let fileEntries = Object.entries(oldFileState)
    .map(([filename, state]) => ({ filename, ...state }))
    .filter((entry) => !isExcludedFromRestore(entry.filename, sessionContext.agentId))
    .sort((a, b) => b.timestamp - a.timestamp)  // Most recent first
    .slice(0, maxFiles);  // Take top N (default: 5)

  // Read each file and create attachments
  let attachments = await Promise.all(fileEntries.map(async (entry) => {
    let content = await readFileForCompact(entry.filename, {
      ...sessionContext,
      fileReadingLimits: { maxTokens: MAX_FILE_RESTORE_TOKENS }  // 5000 tokens
    });
    return content ? createFileAttachment(content) : null;
  }));

  // Filter by total token budget
  let totalTokens = 0;
  return attachments.filter((attachment) => {
    if (attachment === null) return false;
    let tokens = countTokens(JSON.stringify(attachment));
    if (totalTokens + tokens <= MAX_RESTORE_TOTAL_TOKENS) {  // 50000 tokens
      totalTokens += tokens;
      return true;
    }
    return false;
  });
}

// Mapping: bD5→restoreTopFiles, hD5→isExcludedFromRestore, VQ0→readFileForCompact
// Constants: _D5=5 (max files), yD5=5000 (per-file tokens), kD5=50000 (total tokens)
```

**Key insight:** After full compaction:
1. All file state is cleared
2. The 5 most recently accessed files are restored (up to 5000 tokens each)
3. Total restored file content is capped at 50000 tokens
4. Todo list and plan file references are also restored as attachments

---

## 5. Nested Memory (Session Memory Cache)

Nested Memory is an optimization that caches conversation summaries to avoid repeated LLM calls. When a session continues, it can restore from the cached summary instead of re-summarizing.

```javascript
// ============================================
// tryNestedMemoryCache - Try to restore from cached summary
// Location: chunks.107.mjs:1621-1645
// ============================================

// ORIGINAL (for source lookup):
async function f91(A, Q, B) {
  if (!await b91()) return null;
  await dI2();
  let G = hI2(),
    Z = cI2();
  if (!G || !Z) return null;
  try {
    let I = A.findIndex((V) => V.uuid === G);
    if (I === -1) return null;
    let Y = A.slice(I + 1),
      J = sD5(A, Z, Y, Q),
      W = [J.boundaryMarker, ...J.summaryMessages, ...J.attachments, ...J.hookResults, ...Y],
      X = EQ0(W);
    if (B !== void 0 && X >= B) return GA("tengu_sm_compact_threshold_exceeded", {...}), null;
    return { ...J, postCompactTokenCount: X }
  } catch { return null }
}

// READABLE (for understanding):
async function tryNestedMemoryCache(messages, agentId, autoCompactThreshold) {
  // Check if nested memory feature is enabled
  if (!await isNestedMemoryEnabled()) {
    return null;
  }

  // Wait for any pending cache operations
  await waitForCacheLock();

  // Get cached boundary marker and summary content
  let boundaryUuid = getCachedBoundaryUuid();      // Last compaction point
  let cachedSummary = getCachedSummaryContent();   // Stored summary.md content

  if (!boundaryUuid || !cachedSummary) {
    return null;  // No cache available
  }

  try {
    // Find the boundary message in current messages
    let boundaryIndex = messages.findIndex((msg) => msg.uuid === boundaryUuid);
    if (boundaryIndex === -1) {
      return null;  // Boundary not found, cache is stale
    }

    // Get messages added since last compaction
    let newMessages = messages.slice(boundaryIndex + 1);

    // Rebuild compaction result from cached summary
    let cachedResult = rebuildFromCache(messages, cachedSummary, newMessages, agentId);

    // Calculate post-compact token count
    let resultMessages = [
      cachedResult.boundaryMarker,
      ...cachedResult.summaryMessages,
      ...cachedResult.attachments,
      ...cachedResult.hookResults,
      ...newMessages
    ];
    let postCompactTokenCount = countMessageTokens(resultMessages);

    // Check if result exceeds threshold (would trigger another compaction)
    if (autoCompactThreshold !== undefined && postCompactTokenCount >= autoCompactThreshold) {
      trackTelemetry("tengu_sm_compact_threshold_exceeded", {
        postCompactTokenCount,
        autoCompactThreshold
      });
      return null;  // Cache result too large, need fresh compaction
    }

    return {
      ...cachedResult,
      postCompactTokenCount
    };
  } catch {
    return null;
  }
}

// Mapping: f91→tryNestedMemoryCache, b91→isNestedMemoryEnabled, dI2→waitForCacheLock,
// hI2→getCachedBoundaryUuid, cI2→getCachedSummaryContent, sD5→rebuildFromCache,
// EQ0→countMessageTokens
```

### Cache Storage Path

```javascript
// ============================================
// getSessionMemorySummaryPath - Path to cached summary file
// Location: chunks.154.mjs:1501-1503
// ============================================

// ORIGINAL (for source lookup):
function k91() {
  return kVA(kJ1(), "summary.md")
}

function kJ1() {
  return kVA(cH(W0()), e1(), "session-memory")
}

// READABLE (for understanding):
function getSessionMemorySummaryPath() {
  return joinPath(getSessionMemoryDir(), "summary.md");
}

function getSessionMemoryDir() {
  return joinPath(resolveHomeDir(getClaudeDir()), getSessionId(), "session-memory");
}

// Path structure: ~/.claude/<session-id>/session-memory/summary.md

// Mapping: k91→getSessionMemorySummaryPath, kJ1→getSessionMemoryDir
```

### Rebuild From Cache

```javascript
// ============================================
// rebuildFromCache - Reconstruct compaction result from cached summary
// Location: chunks.107.mjs:1601-1619
// ============================================

// ORIGINAL (for source lookup):
function sD5(A, Q, B, G) {
  let Z = ZK(A),
    I = S91("auto", Z ?? 0),
    Y = [R0({
      content: T91(Q, !0),
      isCompactSummary: !0,
      isVisibleInTranscriptOnly: !0
    })],
    J = XQ0(G);
  return {
    boundaryMarker: I,
    summaryMessages: Y,
    attachments: J ? [J] : [],
    hookResults: [],
    messagesToKeep: B,
    preCompactTokenCount: Z,
    postCompactTokenCount: EQ0(Y)
  }
}

// READABLE (for understanding):
function rebuildFromCache(allMessages, cachedSummary, messagesToKeep, agentId) {
  let preCompactTokenCount = countTotalTokens(allMessages);

  // Create boundary marker
  let boundaryMarker = createCompactBoundary("auto", preCompactTokenCount ?? 0);

  // Create summary message from cached content
  let summaryMessages = [createUserMessage({
    content: formatSummaryWithPreamble(cachedSummary, true),
    isCompactSummary: true,
    isVisibleInTranscriptOnly: true
  })];

  // Restore plan file reference if exists
  let planAttachment = getPlanFileAttachment(agentId);

  return {
    boundaryMarker,
    summaryMessages,
    attachments: planAttachment ? [planAttachment] : [],
    hookResults: [],
    messagesToKeep,
    preCompactTokenCount,
    postCompactTokenCount: countMessageTokens(summaryMessages)
  };
}

// Mapping: sD5→rebuildFromCache, ZK→countTotalTokens, S91→createCompactBoundary,
// T91→formatSummaryWithPreamble, XQ0→getPlanFileAttachment, EQ0→countMessageTokens
```

**Key insight:** Nested Memory is currently disabled (`b91` returns `false`). When enabled, it would:
1. Store the compaction summary to `~/.claude/<session-id>/session-memory/summary.md`
2. On subsequent compaction triggers, check if cached summary is still valid
3. If valid, reconstruct the result without an LLM call
4. Only fall back to full LLM compaction if cache is stale or result would be too large

---

## 6. Nested Memory File Watching

The system can trigger nested memory attachments when files in watched directories change.

```javascript
// ============================================
// getNestedMemoryAttachments - Get pending nested memory file attachments
// Location: chunks.107.mjs:2152-2163
// ============================================

// ORIGINAL (for source lookup):
async function qH5(A) {
  let Q = await A.getAppState(),
    B = [];
  if (A.nestedMemoryAttachmentTriggers && A.nestedMemoryAttachmentTriggers.size > 0) {
    for (let G of A.nestedMemoryAttachmentTriggers) {
      let Z = ZY2(G, A, Q);
      B.push(...Z)
    }
    A.nestedMemoryAttachmentTriggers.clear()
  }
  return B
}

// READABLE (for understanding):
async function getNestedMemoryAttachments(sessionContext) {
  let appState = await sessionContext.getAppState();
  let attachments = [];

  // Check for pending file triggers
  if (sessionContext.nestedMemoryAttachmentTriggers &&
      sessionContext.nestedMemoryAttachmentTriggers.size > 0) {

    for (let filePath of sessionContext.nestedMemoryAttachmentTriggers) {
      let fileAttachments = collectNestedMemoryFiles(filePath, sessionContext, appState);
      attachments.push(...fileAttachments);
    }

    // Clear triggers after processing
    sessionContext.nestedMemoryAttachmentTriggers.clear();
  }

  return attachments;
}

// Mapping: qH5→getNestedMemoryAttachments, ZY2→collectNestedMemoryFiles
```

### Collecting Nested Memory Files

```javascript
// ============================================
// collectNestedMemoryFiles - Read files in nested directories
// Location: chunks.107.mjs:1981-2005
// ============================================

// ORIGINAL (for source lookup):
function ZY2(A, Q, B) {
  let G = [];
  try {
    if (!qT(A, B.toolPermissionContext)) return G;
    let Z = new Set,
      I = uQ(),
      Y = pZ2(A, Z);
    G.push(...qQ0(Y, Q));
    let { nestedDirs: J, cwdLevelDirs: W } = CH5(A, I);
    for (let X of J) {
      let V = lZ2(X, A, Z);
      G.push(...qQ0(V, Q))
    }
    for (let X of W) {
      let V = iZ2(X, A, Z);
      G.push(...qQ0(V, Q))
    }
  } catch (Z) { AA(Z) }
  return G
}

// READABLE (for understanding):
function collectNestedMemoryFiles(triggerPath, sessionContext, appState) {
  let attachments = [];

  try {
    // Check permission for this path
    if (!hasPermission(triggerPath, appState.toolPermissionContext)) {
      return attachments;
    }

    let processedPaths = new Set();
    let cwd = getCurrentWorkingDirectory();

    // Process files at trigger path
    let triggerFiles = getFilesAtPath(triggerPath, processedPaths);
    attachments.push(...addToReadState(triggerFiles, sessionContext));

    // Get nested and cwd-level directories
    let { nestedDirs, cwdLevelDirs } = getRelatedDirectories(triggerPath, cwd);

    // Process nested directories
    for (let nestedDir of nestedDirs) {
      let nestedFiles = getNestedFiles(nestedDir, triggerPath, processedPaths);
      attachments.push(...addToReadState(nestedFiles, sessionContext));
    }

    // Process cwd-level directories
    for (let cwdDir of cwdLevelDirs) {
      let cwdFiles = getCwdLevelFiles(cwdDir, triggerPath, processedPaths);
      attachments.push(...addToReadState(cwdFiles, sessionContext));
    }
  } catch (error) {
    logError(error);
  }

  return attachments;
}

// Mapping: ZY2→collectNestedMemoryFiles, qT→hasPermission, pZ2→getFilesAtPath,
// CH5→getRelatedDirectories, lZ2→getNestedFiles, iZ2→getCwdLevelFiles,
// qQ0→addToReadState
```

### Adding Files to Read State

```javascript
// ============================================
// addToReadState - Register files and create attachments
// Location: chunks.107.mjs:1965-1979
// ============================================

// ORIGINAL (for source lookup):
function qQ0(A, Q) {
  let B = [];
  for (let G of A)
    if (!Q.readFileState.has(G.path)) B.push({
      type: "nested_memory",
      path: G.path,
      content: G
    }), Q.readFileState.set(G.path, {
      content: G.content,
      timestamp: Date.now(),
      offset: void 0,
      limit: void 0
    });
  return B
}

// READABLE (for understanding):
function addToReadState(files, sessionContext) {
  let attachments = [];

  for (let file of files) {
    // Only process files not already in read state
    if (!sessionContext.readFileState.has(file.path)) {
      // Create nested memory attachment
      attachments.push({
        type: "nested_memory",
        path: file.path,
        content: file
      });

      // Register in read state to avoid re-processing
      sessionContext.readFileState.set(file.path, {
        content: file.content,
        timestamp: Date.now(),
        offset: undefined,
        limit: undefined
      });
    }
  }

  return attachments;
}

// Mapping: qQ0→addToReadState
```

**Key insight:** Nested memory file watching:
1. Tracks file changes via `nestedMemoryAttachmentTriggers` Set
2. When triggered, reads related files in nested and cwd-level directories
3. Registers files in `readFileState` to avoid duplicates
4. Creates `nested_memory` type attachments for injection into context

---

## 7. Auto-Compaction Dispatcher

```javascript
// ============================================
// autoCompactDispatcher - Main entry point for auto-compaction
// Location: chunks.107.mjs:1708-1731
// ============================================

// ORIGINAL (for source lookup):
async function sI2(A, Q, B) {
  if (Y0(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };
  if (!await tD5(A, B)) return { wasCompacted: !1 };

  let Z = await f91(A, Q.agentId, aI2());
  if (Z) return {
    wasCompacted: !0,
    compactionResult: Z
  };

  try {
    return {
      wasCompacted: !0,
      compactionResult: await j91(A, Q, !0, void 0, !0)
    }
  } catch (I) {
    if (!GKA(I, pMA)) AA(I instanceof Error ? I : Error(String(I)));
    return { wasCompacted: !1 }
  }
}

// READABLE (for understanding):
async function autoCompactDispatcher(messages, sessionContext, sessionMemoryType) {
  // Skip if compaction disabled
  if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false };
  }

  // Check if compaction is needed
  if (!await shouldTriggerCompaction(messages, sessionMemoryType)) {
    return { wasCompacted: false };
  }

  // Try cached nested memory first
  let cachedResult = await tryNestedMemoryCache(messages, sessionContext.agentId, getCurrentContext());
  if (cachedResult) {
    return {
      wasCompacted: true,
      compactionResult: cachedResult
    };
  }

  // Fall back to full LLM-based compaction
  try {
    return {
      wasCompacted: true,
      compactionResult: await fullCompact(messages, sessionContext, true, undefined, true)
    };
  } catch (error) {
    if (!isExpectedError(error, EXPECTED_ERROR_TYPES)) {
      logError(error instanceof Error ? error : Error(String(error)));
    }
    return { wasCompacted: false };
  }
}

// Mapping: sI2→autoCompactDispatcher, tD5→shouldTriggerCompaction,
// f91→tryNestedMemoryCache, j91→fullCompact
```

**Key insight:** The auto-compaction dispatcher tries two strategies:
1. First, check for cached nested memory (faster, no API call)
2. If cache miss, perform full LLM-based compaction (slower, requires API call)

---

## 5. Message Flattening

```javascript
// ============================================
// flattenMessages - Prepare messages for API
// Location: chunks.153.mjs:2547-2607
// ============================================

// ORIGINAL (for source lookup):
function WZ(A, Q = []) {
  let B = Nb3(A),
    G = [];
  return B.filter((Z) => {
    if (Z.type === "progress" || Z.type === "system" || wb3(Z)) return !1;
    return !0
  }).forEach((Z) => {
    switch (Z.type) {
      case "user": {
        let I = dC(G);
        if (I?.type === "user") {
          G[G.indexOf(I)] = Rb3(I, Z);  // Merge consecutive user messages
          return
        }
        G.push(Z);
        return
      }
      case "assistant": {
        // Validate and transform tool_use inputs
        let I = {
          ...Z,
          message: {
            ...Z.message,
            content: Z.message.content.map((Y) => {
              if (Y.type === "tool_use") {
                let J = Q.find((W) => W.name === Y.name);
                if (J) return {
                  ...Y,
                  input: RX9(J, Y.input)  // Validate input schema
                }
              }
              return Y
            })
          }
        };
        // Merge with previous assistant message if same ID
        for (let Y = G.length - 1; Y >= 0; Y--) {
          let J = G[Y];
          if (J.type !== "assistant" && !Ob3(J)) break;
          if (J.type === "assistant") {
            if (J.message.id === I.message.id) {
              G[Y] = Mb3(J, I);  // Merge same-ID assistant messages
              return
            }
            break
          }
        }
        G.push(I);
        return
      }
      case "attachment": {
        // Convert attachment to user message content
        let I = kb3(Z.attachment),
          Y = dC(G);
        if (Y?.type === "user") {
          G[G.indexOf(Y)] = I.reduce((J, W) => Lb3(J, W), Y);
          return
        }
        G.push(...I);
        return
      }
    }
  }), xb3(G)  // Final normalization
}

// READABLE (for understanding):
function flattenMessages(messages, toolSchemas = []) {
  let normalized = normalizeMessages(messages);
  let flattened = [];

  return normalized.filter((msg) => {
    // Filter out progress, system, and ephemeral messages
    if (msg.type === "progress" || msg.type === "system" || isEphemeral(msg)) {
      return false;
    }
    return true;
  }).forEach((msg) => {
    switch (msg.type) {
      case "user": {
        let lastMsg = lastElement(flattened);
        if (lastMsg?.type === "user") {
          // Merge consecutive user messages
          flattened[flattened.indexOf(lastMsg)] = mergeUserMessages(lastMsg, msg);
          return;
        }
        flattened.push(msg);
        return;
      }

      case "assistant": {
        // Validate tool_use inputs against schemas
        let validated = {
          ...msg,
          message: {
            ...msg.message,
            content: msg.message.content.map((block) => {
              if (block.type === "tool_use") {
                let schema = toolSchemas.find((s) => s.name === block.name);
                if (schema) {
                  return {
                    ...block,
                    input: validateAndTransformInput(schema, block.input)
                  };
                }
              }
              return block;
            })
          }
        };

        // Merge with previous assistant message if same message ID
        for (let i = flattened.length - 1; i >= 0; i--) {
          let prev = flattened[i];
          if (prev.type !== "assistant" && !isAttachment(prev)) break;
          if (prev.type === "assistant") {
            if (prev.message.id === validated.message.id) {
              flattened[i] = mergeAssistantMessages(prev, validated);
              return;
            }
            break;
          }
        }
        flattened.push(validated);
        return;
      }

      case "attachment": {
        // Convert attachment to user message content blocks
        let converted = attachmentToUserContent(msg.attachment);
        let lastMsg = lastElement(flattened);
        if (lastMsg?.type === "user") {
          flattened[flattened.indexOf(lastMsg)] = converted.reduce(
            (acc, block) => appendToUserMessage(acc, block),
            lastMsg
          );
          return;
        }
        flattened.push(...converted);
        return;
      }
    }
  }), finalNormalize(flattened);
}

// Mapping: WZ→flattenMessages, Nb3→normalizeMessages, wb3→isEphemeral,
// Rb3→mergeUserMessages, Mb3→mergeAssistantMessages, kb3→attachmentToUserContent
```

**How message flattening works:**
1. Filters out progress, system, and ephemeral messages
2. Merges consecutive user messages
3. Merges assistant messages with the same message ID (streaming chunks)
4. Validates tool_use inputs against schemas
5. Converts attachments to user message content blocks

---

## Key Functions Summary

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| buildTokenAccounting | yI2 | chunks.107.mjs:792-830 | Build token usage statistics |
| countContentBlock | TD5 | chunks.107.mjs:832-885 | Count tokens in content block |
| buildTokenMetrics | xI2 | chunks.107.mjs:891-918 | Convert stats to percentages |
| microCompact | Si | chunks.107.mjs:1440-1545 | Fast local compaction |
| fullCompact | j91 | chunks.107.mjs:1120-1237 | LLM-based summarization |
| tryNestedMemoryCache | f91 | chunks.107.mjs:1621-1645 | Restore from cached summary |
| rebuildFromCache | sD5 | chunks.107.mjs:1601-1619 | Reconstruct from cache |
| buildCompactionPrompt | R91 | chunks.107.mjs:537-710 | Create summarization instructions |
| formatSummaryWithPreamble | T91 | chunks.107.mjs:754-760 | Add continuation preamble |
| restoreTopFiles | bD5 | chunks.107.mjs:1248-1269 | Re-attach recent files |
| getNestedMemoryAttachments | qH5 | chunks.107.mjs:2152-2163 | Get pending nested memory files |
| collectNestedMemoryFiles | ZY2 | chunks.107.mjs:1981-2005 | Read files in nested dirs |
| addToReadState | qQ0 | chunks.107.mjs:1965-1979 | Register files and create attachments |
| autoCompactDispatcher | sI2 | chunks.107.mjs:1708-1731 | Main compaction entry point |
| flattenMessages | WZ | chunks.153.mjs:2547-2607 | Prepare messages for API |
| getSessionMemorySummaryPath | k91 | chunks.154.mjs:1501-1503 | Get summary cache path |
| createCompactBoundary | S91 | chunks.154.mjs:395-410 | Create boundary marker |

---

## Constants

| Constant | Obfuscated | Value | Purpose |
|----------|------------|-------|---------|
| AUTO_COMPACT_TRIGGER | zQ0 | 13000 | Start auto-compaction |
| WARNING_THRESHOLD | rD5 | 20000 | Show user warning |
| UPPER_LIMIT | oD5 | 20000 | Hard context cap |
| MAX_FILES_TO_RESTORE | _D5 | 5 | Files restored after compaction |
| MAX_FILE_RESTORE_TOKENS | yD5 | 5000 | Per-file token limit |
| MAX_RESTORE_TOTAL_TOKENS | kD5 | 50000 | Total restore token budget |
| CACHE_LOCK_TIMEOUT | gD5 | 15000 | Cache lock wait timeout (ms) |
| CACHE_OPERATION_TIMEOUT | uD5 | 60000 | Cache operation timeout (ms) |
