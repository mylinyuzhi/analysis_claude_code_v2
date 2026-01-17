# Compact System Implementation (v2.1.7)

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Overview

The Compact system in Claude Code manages conversation summarization and context window optimization. It allows long conversations to be compressed into summaries while preserving important context, preventing context overflow and maintaining conversation continuity.

**Key Features:**
- Three-tier compaction architecture (Micro-Compact → Session Memory → Full Compact)
- Intelligent threshold-based triggering
- Context preservation (files, todos, plans, skills, task status)
- PreCompact hooks for extensibility
- Customizable via environment variables

### High-Level Algorithm Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPACT SYSTEM ALGORITHM (v2.1.7)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. TOKEN CHECK                                                             │
│     │                                                                       │
│     ├─► Get current token count from messages                               │
│     ├─► Calculate threshold via ic() (calculateThresholds)                  │
│     └─► If below auto-compact threshold → EXIT (no compaction needed)       │
│                                                                             │
│  2. SESSION MEMORY COMPACT (sF1)        [NEW in 2.1.x - Fastest]           │
│     │                                                                       │
│     ├─► Check feature flags (tengu_session_memory + tengu_sm_compact)       │
│     ├─► Read cached summary from session-memory/summary.md                  │
│     ├─► If template empty or cache miss → fall through to next tier         │
│     ├─► Build compact result with cached summary + recent messages          │
│     └─► If post-compact tokens < threshold → Return result                  │
│                                                                             │
│  3. FULL COMPACT (cF1)                  [Slow, Requires LLM Call]          │
│     │                                                                       │
│     ├─► Run PreCompact hooks (sU0)                                         │
│     ├─► Build summary request with custom instructions                      │
│     ├─► Stream summary from LLM via H97()                                  │
│     ├─► Validate response, retry up to K97 (2) times if needed             │
│     │                                                                       │
│     ├─► CONTEXT RESTORATION:                                               │
│     │   ├─► Re-read up to I97 (5) recent files (D97: 50k token budget)    │
│     │   ├─► Restore todo list (z97)                                        │
│     │   ├─► Restore plan file if exists (xL0)                              │
│     │   ├─► Restore invoked skills ($97) - NEW                             │
│     │   └─► Restore task status (C97) - NEW                                │
│     │                                                                       │
│     ├─► Create boundary marker                                              │
│     ├─► Run SessionStart hooks                                             │
│     └─► Log telemetry                                                      │
│                                                                             │
│  4. MICRO-COMPACT (lc)                  [Fast, No API Call - On-demand]    │
│     │                                                                       │
│     ├─► Triggered separately when processing messages                       │
│     ├─► Scan for tool_use/tool_result pairs                                │
│     ├─► Keep last S97 (3) tool results uncompressed                        │
│     ├─► If savings >= T97 (20k tokens):                                    │
│     │   └─► Replace old tool_result content with "[cleared]"               │
│     └─► Return modified messages                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Constants Summary

| Category | Constant | Value | Description |
|----------|----------|-------|-------------|
| **Thresholds** | uL0 | 13,000 | Minimum tokens to preserve |
| | c97 | 20,000 | Warning threshold offset |
| | p97 | 20,000 | Error threshold offset |
| | mL0 | 3,000 | Minimum blocking limit offset |
| **Micro-Compact** | T97 | 20,000 | Minimum savings required |
| | P97 | 40,000 | Default threshold |
| | S97 | 3 | Recent tool results to keep |
| | _s2 | 2,000 | Estimated tokens per image |
| **Context Restore** | I97 | 5 | Maximum files to restore |
| | W97 | 5,000 | Maximum tokens per file |
| | D97 | 50,000 | Total file token budget |
| **Retry** | K97 | 2 | Max summary retry attempts |

---

## Three-Tier Compaction Architecture

Claude Code v2.1.7 implements a **three-tier compaction system**:

### Tier Comparison

| Aspect | Session Memory (sF1) | Full Compact (cF1) | Micro-Compact (lc) |
|--------|---------------------|--------------------|--------------------|
| **Priority** | 1st (preferred) | 2nd (fallback) | Separate trigger |
| **API Call** | NO (uses cache) | YES (LLM streaming) | NO (local) |
| **Scope** | Full conversation | Full conversation | Tool results only |
| **Speed** | Fast | Slow (~seconds) | Fast |
| **Creates Summary** | Uses cached | LLM-generated | No (truncates) |
| **Feature Flag** | Required | Always available | Can be disabled |

### Decision Flow

```
                      Token Count Check
                           │
                           ▼
                  isAboveAutoCompactThreshold?
                      │           │
                     YES          NO → Return (no compact)
                      │
                      ▼
           ┌─────────────────────┐
           │ Try Session Memory  │
           │ Compact (sF1)       │
           └──────────┬──────────┘
                      │
                 Success?
                │        │
               YES       NO (feature disabled, empty template, etc.)
                │        │
                ▼        ▼
             Return   Full Compact (cF1)
                           │
                           ▼
              ┌──────────────────────┐
              │ Run PreCompact hooks │
              └──────────┬───────────┘
                         ▼
              ┌──────────────────────┐
              │ Stream summary from  │
              │ LLM (H97)            │
              └──────────┬───────────┘
                         ▼
              ┌──────────────────────┐
              │ Restore context      │
              │ (files/todos/plans)  │
              └──────────┬───────────┘
                         ▼
                      Return
```

---

## 1. Auto-Compact Dispatcher

The main entry point for automatic compaction is `ys2` (autoCompactDispatcher).

```javascript
// ============================================
// autoCompactDispatcher - Main entry point for auto-compaction
// Location: chunks.132.mjs:1511-1535
// ============================================

// ORIGINAL (for source lookup):
async function ys2(A, Q, B) {
  if (a1(process.env.DISABLE_COMPACT)) return {
    wasCompacted: !1
  };
  if (!await l97(A, B)) return {
    wasCompacted: !1
  };
  let Z = await sF1(A, Q.agentId, xs2());
  if (Z) return {
    wasCompacted: !0,
    compactionResult: Z
  };
  try {
    let Y = await cF1(A, Q, !0, void 0, !0);
    return oEA(void 0), {
      wasCompacted: !0,
      compactionResult: Y
    }
  } catch (Y) {
    if (!sUA(Y, vkA)) e(Y instanceof Error ? Y : Error(String(Y)));
    return {
      wasCompacted: !1
    }
  }
}

// READABLE (for understanding):
async function autoCompactDispatcher(messages, sessionContext, sessionMemoryType) {
  // Check if compaction is completely disabled
  if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false };
  }

  // Check if we should trigger auto-compact (threshold + feature checks)
  if (!await shouldTriggerAutoCompact(messages, sessionMemoryType)) {
    return { wasCompacted: false };
  }

  // TIER 1: Try Session Memory Compact first (fastest, uses cached summary)
  let sessionMemoryResult = await sessionMemoryCompact(messages, sessionContext.agentId, getAutoCompactTarget());
  if (sessionMemoryResult) {
    return {
      wasCompacted: true,
      compactionResult: sessionMemoryResult
    };
  }

  // TIER 2: Fall back to Full Compact (slow, requires LLM call)
  try {
    let fullCompactResult = await fullCompact(messages, sessionContext, true, undefined, true);
    // Clear the last summarized message ID after full compact
    setLastSummarizedId(undefined);
    return {
      wasCompacted: true,
      compactionResult: fullCompactResult
    };
  } catch (error) {
    // Suppress expected "API aborted" errors, log others
    if (!isExpectedError(error, API_ABORT_ERROR)) {
      logError(error instanceof Error ? error : Error(String(error)));
    }
    return { wasCompacted: false };
  }
}

// Mapping: ys2→autoCompactDispatcher, a1→parseBoolean, l97→shouldTriggerAutoCompact,
//          sF1→sessionMemoryCompact, xs2→getAutoCompactTarget, cF1→fullCompact,
//          oEA→setLastSummarizedId, sUA→isExpectedError, vkA→API_ABORT_ERROR, e→logError
```

**Algorithm Logic:**
1. **Disable Check**: Exit early if `DISABLE_COMPACT` env var is set
2. **Threshold Check**: Only proceed if `shouldTriggerAutoCompact()` returns true
3. **Session Memory First**: Try the fastest option (cached summary)
4. **Full Compact Fallback**: If session memory fails, use LLM-based summarization
5. **Error Handling**: Suppress expected abort errors, log unexpected ones

---

## 2. Threshold Calculation

The `ic` function (calculateThresholds) determines when compaction should trigger.

```javascript
// ============================================
// calculateThresholds - Determine compaction trigger conditions
// Location: chunks.132.mjs:1472-1493
// ============================================

// ORIGINAL (for source lookup):
function ic(A) {
  let Q = xs2(),
    B = nc() ? Q : q3A(),
    G = Math.max(0, Math.round((B - A) / B * 100)),
    Z = B - c97,
    Y = B - p97,
    J = A >= Z,
    X = A >= Y,
    I = nc() && A >= Q,
    D = q3A() - mL0,
    W = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE,
    K = W ? parseInt(W, 10) : NaN,
    V = !isNaN(K) && K > 0 ? K : D,
    F = A >= V;
  return {
    percentLeft: G,
    isAboveWarningThreshold: J,
    isAboveErrorThreshold: X,
    isAboveAutoCompactThreshold: I,
    isAtBlockingLimit: F
  }
}

// READABLE (for understanding):
function calculateThresholds(currentTokenCount) {
  let autoCompactTarget = getAutoCompactTarget();

  // If auto-compact enabled, use target; otherwise use full available space
  let effectiveLimit = isAutoCompactEnabled() ? autoCompactTarget : calculateAvailableTokens();

  // Calculate percentage of context remaining
  let percentLeft = Math.max(0, Math.round((effectiveLimit - currentTokenCount) / effectiveLimit * 100));

  // Warning threshold: 20k tokens before limit
  let warningThreshold = effectiveLimit - WARNING_THRESHOLD_OFFSET;  // c97 = 20000

  // Error threshold: 20k tokens before limit
  let errorThreshold = effectiveLimit - ERROR_THRESHOLD_OFFSET;      // p97 = 20000

  // Check threshold conditions
  let isAboveWarningThreshold = currentTokenCount >= warningThreshold;
  let isAboveErrorThreshold = currentTokenCount >= errorThreshold;

  // Auto-compact triggers when enabled AND above target
  let isAboveAutoCompactThreshold = isAutoCompactEnabled() && currentTokenCount >= autoCompactTarget;

  // Blocking limit with optional override
  let defaultBlockingLimit = calculateAvailableTokens() - MINIMUM_BLOCKING_OFFSET;  // mL0 = 3000
  let overrideValue = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE;
  let parsedOverride = overrideValue ? parseInt(overrideValue, 10) : NaN;
  let blockingLimit = !isNaN(parsedOverride) && parsedOverride > 0 ? parsedOverride : defaultBlockingLimit;
  let isAtBlockingLimit = currentTokenCount >= blockingLimit;

  return {
    percentLeft,
    isAboveWarningThreshold,
    isAboveErrorThreshold,
    isAboveAutoCompactThreshold,
    isAtBlockingLimit
  };
}

// Mapping: ic→calculateThresholds, A→currentTokenCount, Q→autoCompactTarget,
//          xs2→getAutoCompactTarget, nc→isAutoCompactEnabled, q3A→calculateAvailableTokens,
//          c97→WARNING_THRESHOLD_OFFSET, p97→ERROR_THRESHOLD_OFFSET, mL0→MINIMUM_BLOCKING_OFFSET
```

**Key Decision Points:**
- **Warning Threshold**: `contextLimit - 20,000` tokens → Show warning UI
- **Error Threshold**: `contextLimit - 20,000` tokens → Show error UI
- **Auto-Compact Threshold**: `contextLimit - 13,000` tokens → Trigger auto-compact
- **Blocking Limit**: `contextLimit - 3,000` tokens → Block further input

**Why these values?**
- 20k buffer ensures room for the next response without immediate re-compaction
- 13k auto-compact trigger gives adequate space for summary + restored context
- 3k blocking limit prevents context overflow while allowing essential operations

---

## 3. Session Memory Compact (NEW in 2.1.x)

Session Memory Compact is a new optimization that uses cached summaries instead of making LLM calls.

```javascript
// ============================================
// sessionMemoryCompact - Use cached session summary for fast compaction
// Location: chunks.132.mjs:1392-1422
// ============================================

// ORIGINAL (for source lookup):
async function sF1(A, Q, B) {
  if (!rF1()) return null;
  await h97(), await Ws2();
  let G = Xs2(),
    Z = Ks2();
  if (!Z) return null;
  if (await Os2(Z)) return l("tengu_sm_compact_empty_template", {}), null;
  try {
    let Y;
    if (G) {
      if (Y = A.findIndex((F) => F.uuid === G), Y === -1) return l("tengu_sm_compact_summarized_id_not_found", {}), null
    } else Y = A.length - 1, l("tengu_sm_compact_resumed_session", {});
    let J = m97(A, Y),
      X = A.slice(J),
      I = await WU("compact"),
      D = Bw(q0()),
      W = d97(A, Z, X, I, D, Q),
      K = FHA(W),
      V = FhA(K);
    if (B !== void 0 && V >= B) return l("tengu_sm_compact_threshold_exceeded", {
      postCompactTokenCount: V,
      autoCompactThreshold: B
    }), null;
    return {
      ...W,
      postCompactTokenCount: V
    }
  } catch {
    return null
  }
}

// READABLE (for understanding):
async function sessionMemoryCompact(messages, agentId, autoCompactThreshold) {
  // Check if session memory compact feature is enabled
  if (!isSessionMemoryCompactEnabled()) {
    return null;
  }

  // Initialize config and wait for any pending operations
  await initSessionMemoryConfig();
  await waitForPendingCompact();

  // Get last summarized message ID and read cached summary
  let lastSummarizedId = getLastSummarizedId();
  let cachedSummary = readSessionMemoryFile();

  if (!cachedSummary) {
    return null;  // No cached summary available
  }

  // Check if template is empty (default template with no content)
  if (await isTemplateEmpty(cachedSummary)) {
    logTelemetry("tengu_sm_compact_empty_template", {});
    return null;
  }

  try {
    let startIndex;

    if (lastSummarizedId) {
      // Find where we left off
      startIndex = messages.findIndex((msg) => msg.uuid === lastSummarizedId);
      if (startIndex === -1) {
        logTelemetry("tengu_sm_compact_summarized_id_not_found", {});
        return null;
      }
    } else {
      // No previous summary marker, start from end (resumed session)
      startIndex = messages.length - 1;
      logTelemetry("tengu_sm_compact_resumed_session", {});
    }

    // Calculate which messages to keep (from startIndex forward)
    let compactStartIndex = calculateCompactStartIndex(messages, startIndex);
    let messagesToKeep = messages.slice(compactStartIndex);

    // Run SessionStart hooks (even for session memory compact)
    let hookResults = await executePluginHooksForEvent("compact");

    // Generate conversation ID for boundary marker
    let conversationId = generateConversationId(getAgentId());

    // Build the compact result using cached summary
    let compactResult = buildSessionMemoryCompactResult(
      messages,
      cachedSummary,
      messagesToKeep,
      hookResults,
      conversationId,
      agentId
    );

    // Flatten result to check token count
    let flattenedMessages = flattenCompactResult(compactResult);
    let postCompactTokenCount = estimateTokensWithSafetyMargin(flattenedMessages);

    // Verify we're actually under the threshold
    if (autoCompactThreshold !== undefined && postCompactTokenCount >= autoCompactThreshold) {
      logTelemetry("tengu_sm_compact_threshold_exceeded", {
        postCompactTokenCount,
        autoCompactThreshold
      });
      return null;  // Fall through to full compact
    }

    return {
      ...compactResult,
      postCompactTokenCount
    };
  } catch {
    return null;  // Any error falls through to full compact
  }
}

// Mapping: sF1→sessionMemoryCompact, rF1→isSessionMemoryCompactEnabled, h97→initSessionMemoryConfig,
//          Ws2→waitForPendingCompact, Xs2→getLastSummarizedId, Ks2→readSessionMemoryFile,
//          Os2→isTemplateEmpty, m97→calculateCompactStartIndex, WU→executePluginHooksForEvent,
//          Bw→generateConversationId, q0→getAgentId, d97→buildSessionMemoryCompactResult,
//          FHA→flattenCompactResult, FhA→estimateTokensWithSafetyMargin
```

**Why Session Memory Compact?**
- **Speed**: No LLM API call needed - uses previously generated summary
- **Cost**: Zero API tokens consumed
- **Consistency**: Summary is maintained incrementally during the session

**When it fails (falls through to full compact):**
- Feature flags not enabled
- No cached summary file exists
- Template is empty (default state)
- Last summarized ID not found in messages
- Post-compact tokens still exceed threshold

---

## 4. Full Compact

The main LLM-based compaction function that generates a comprehensive summary.

```javascript
// ============================================
// fullCompact - Generate LLM-based conversation summary
// Location: chunks.132.mjs:489-579
// ============================================

// ORIGINAL (for source lookup):
async function cF1(A, Q, B, G, Z = !1) {
  try {
    if (A.length === 0) throw Error(DhA);
    let Y = HKA(A),
      J = er2(A),
      X = {};
    try {
      X = As2(J)
    } catch (AA) {
      e(AA)
    }
    let I = await Q.getAppState();
    q71(I.toolPermissionContext, "summary"), Q.setSpinnerColor?.("claudeBlue_FOR_SYSTEM_SPINNER"), Q.setSpinnerShimmerColor?.("claudeBlueShimmer_FOR_SYSTEM_SPINNER"), Q.setSpinnerMessage?.("Running PreCompact hooks..."), Q.setSDKStatus?.("compacting");
    let D = await sU0({
      trigger: Z ? "auto" : "manual",
      customInstructions: G ?? null
    }, Q.abortController.signal);
    // ... continues with summary generation
  }
}

// READABLE (for understanding):
async function fullCompact(messages, context, preserveHistory, customInstructions, isAuto = false) {
  try {
    // Validate we have messages to compact
    if (messages.length === 0) {
      throw Error(NOT_ENOUGH_MESSAGES_ERROR);  // DhA
    }

    // Get pre-compact token count for telemetry
    let preCompactTokenCount = getLastAssistantTokenCount(messages);

    // Build token accounting for telemetry
    let messageAccounting = buildMessageAccounting(messages);
    let accountingMetrics = {};
    try {
      accountingMetrics = buildAccountingMetrics(messageAccounting);
    } catch (error) {
      logError(error);
    }

    // Get app state and validate permissions
    let appState = await context.getAppState();
    validateToolPermissions(appState.toolPermissionContext, "summary");

    // Update UI spinners
    context.setSpinnerColor?.("claudeBlue_FOR_SYSTEM_SPINNER");
    context.setSpinnerShimmerColor?.("claudeBlueShimmer_FOR_SYSTEM_SPINNER");
    context.setSpinnerMessage?.("Running PreCompact hooks...");
    context.setSDKStatus?.("compacting");

    // PHASE 1: Execute PreCompact hooks
    let hookResults = await executePreCompactHooks({
      trigger: isAuto ? "auto" : "manual",
      customInstructions: customInstructions ?? null
    }, context.abortController.signal);

    // Merge hook-provided custom instructions
    if (hookResults.newCustomInstructions) {
      customInstructions = customInstructions
        ? `${customInstructions}\n\n${hookResults.newCustomInstructions}`
        : hookResults.newCustomInstructions;
    }
    let userDisplayMessage = hookResults.userDisplayMessage;

    // Update UI for summary generation
    context.setStreamMode?.("requesting");
    context.setResponseLength?.(() => 0);
    context.setSpinnerMessage?.("Compacting conversation");

    // PHASE 2: Build summary request
    let summaryPrompt = buildCompactInstructions(customInstructions);
    let summaryRequest = createUserMessage({ content: summaryPrompt });

    // PHASE 3: Stream summary from LLM
    let summaryResponse = await generateConversationSummary({
      messages,
      summaryRequest,
      appState,
      context,
      preCompactTokenCount
    });

    // PHASE 4: Validate summary response
    let summaryText = extractTextContent(summaryResponse);
    if (!summaryText) {
      logTelemetry("tengu_compact_failed", { reason: "no_summary", preCompactTokenCount });
      throw Error("Failed to generate conversation summary - response did not contain valid text content");
    }
    if (summaryText.startsWith(API_ERROR_PREFIX)) {
      logTelemetry("tengu_compact_failed", { reason: "api_error", preCompactTokenCount });
      throw Error(summaryText);
    }
    if (summaryText.startsWith(PROMPT_TOO_LONG_PREFIX)) {
      logTelemetry("tengu_compact_failed", { reason: "prompt_too_long", preCompactTokenCount });
      throw Error(CONVERSATION_TOO_LONG_ERROR);
    }

    // PHASE 5: Restore context
    let previousReadState = cloneReadFileState(context.readFileState);
    context.readFileState.clear();

    let [restoredFiles, taskStatuses] = await Promise.all([
      restoreRecentFilesAfterCompact(previousReadState, context, MAX_FILES_TO_RESTORE),
      createTaskStatusAttachments(context)
    ]);

    let attachments = [...restoredFiles, ...taskStatuses];

    // Add todo list attachment
    let todoAttachment = createTodoAttachment(context.agentId ?? getAgentId());
    if (todoAttachment) attachments.push(todoAttachment);

    // Add plan file reference if exists
    let planAttachment = createPlanFileReferenceAttachment(context.agentId);
    if (planAttachment) attachments.push(planAttachment);

    // Add invoked skills attachment (NEW in 2.1.x)
    let skillsAttachment = createInvokedSkillsAttachment();
    if (skillsAttachment) attachments.push(skillsAttachment);

    // PHASE 6: Run SessionStart hooks
    context.setSpinnerMessage?.("Running SessionStart hooks...");
    let sessionStartHookResults = await executePluginHooksForEvent("compact");

    // PHASE 7: Calculate post-compact metrics
    let postCompactTokenCount = countTotalTokens([summaryResponse]);
    let usageStats = extractUsageStats(summaryResponse);

    // PHASE 8: Log telemetry
    logTelemetry("tengu_compact", {
      preCompactTokenCount,
      postCompactTokenCount,
      compactionInputTokens: usageStats?.input_tokens,
      compactionOutputTokens: usageStats?.output_tokens,
      compactionCacheReadTokens: usageStats?.cache_read_input_tokens ?? 0,
      compactionCacheCreationTokens: usageStats?.cache_creation_input_tokens ?? 0,
      compactionTotalTokens: usageStats
        ? usageStats.input_tokens + (usageStats.cache_creation_input_tokens ?? 0) + (usageStats.cache_read_input_tokens ?? 0) + usageStats.output_tokens
        : 0,
      ...accountingMetrics
    });

    // Create boundary marker and format summary
    let boundaryMarker = createBoundaryMarker(isAuto ? "auto" : "manual", preCompactTokenCount ?? 0);
    let conversationId = generateConversationId(getAgentId());
    let summaryMessages = [createUserMessage({
      content: formatSummaryContent(summaryText, preserveHistory, conversationId),
      isCompactSummary: true,
      isVisibleInTranscriptOnly: true
    })];

    return {
      boundaryMarker,
      summaryMessages,
      attachments,
      hookResults: sessionStartHookResults,
      userDisplayMessage,
      preCompactTokenCount,
      postCompactTokenCount,
      compactionUsage: usageStats
    };
  } catch (error) {
    handleCompactError(error, context);
    throw error;
  } finally {
    // Reset UI state
    context.setStreamMode?.("requesting");
    context.setResponseLength?.(() => 0);
    context.setSpinnerMessage?.(null);
    context.setSDKStatus?.(null);
    context.setSpinnerColor?.(null);
    context.setSpinnerShimmerColor?.(null);
  }
}

// Mapping: cF1→fullCompact, DhA→NOT_ENOUGH_MESSAGES_ERROR, HKA→getLastAssistantTokenCount,
//          er2→buildMessageAccounting, As2→buildAccountingMetrics, q71→validateToolPermissions,
//          sU0→executePreCompactHooks, xZ0→buildCompactInstructions, H0→createUserMessage,
//          H97→generateConversationSummary, Xt→extractTextContent, E97→restoreRecentFilesAfterCompact,
//          C97→createTaskStatusAttachments, z97→createTodoAttachment, xL0→createPlanFileReferenceAttachment,
//          $97→createInvokedSkillsAttachment, WU→executePluginHooksForEvent, sH→countTotalTokens,
//          Jd→extractUsageStats, pF1→createBoundaryMarker, Bw→generateConversationId, u51→formatSummaryContent
```

**8-Phase Full Compact Process:**
1. **Validate** - Ensure messages exist, get pre-compact token count
2. **PreCompact Hooks** - Execute user-defined hooks, collect custom instructions
3. **Build Request** - Create summary prompt with any custom instructions
4. **Stream Summary** - Send to LLM and stream response
5. **Validate Response** - Check for errors or truncation
6. **Restore Context** - Re-read files, todos, plans, skills
7. **Post-Compact Hooks** - Execute SessionStart hooks
8. **Telemetry** - Log metrics for monitoring

---

## 5. Summary Generation

The `H97` function streams the summary from the LLM with retry logic.

```javascript
// ============================================
// generateConversationSummary - Stream summary from LLM
// Location: chunks.132.mjs:590-652
// ============================================

// ORIGINAL (for source lookup):
async function H97({
  messages: A,
  summaryRequest: Q,
  appState: B,
  context: G,
  preCompactTokenCount: Z
}) {
  let Y = ZZ("tengu_compact_streaming_retry", !1),
    J = Y ? K97 : 1;
  for (let X = 1; X <= J; X++) {
    let I = !1,
      D;
    G.setResponseLength?.(() => 0);
    let K = oHA({
      messages: FI([..._x(A), Q]),
      systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."],
      maxThinkingTokens: 0,
      tools: Wi([v5, ...B.mcp.tools], "name"),
      signal: G.abortController.signal,
      options: {
        // ... LLM options
        querySource: "compact",
      }
    })[Symbol.asyncIterator]();
    // ... streaming logic with retry
  }
}

// READABLE (for understanding):
async function generateConversationSummary({
  messages,
  summaryRequest,
  appState,
  context,
  preCompactTokenCount
}) {
  // Check if streaming retry is enabled via feature flag
  let retryEnabled = getFeatureFlag("tengu_compact_streaming_retry", false);
  let maxAttempts = retryEnabled ? MAX_SUMMARY_RETRIES : 1;  // K97 = 2

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let hasStartedStreaming = false;
    let assistantResponse;

    context.setResponseLength?.(() => 0);

    // Create streaming LLM session for summary generation
    let llmSession = createStreamingLLMSession({
      messages: normalizeAttachmentsToAPI([...extractMessageHistory(messages), summaryRequest]),
      systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."],
      maxThinkingTokens: 0,  // No extended thinking for summaries
      // Include Read tool + MCP tools (for potential file access during summary)
      tools: deduplicateByName([ReadTool, ...appState.mcp.tools], "name"),
      signal: context.abortController.signal,
      options: {
        async getToolPermissionContext() {
          return (await context.getAppState()).toolPermissionContext;
        },
        model: context.options.mainLoopModel,
        toolChoice: undefined,  // Let LLM decide
        isNonInteractiveSession: context.options.isNonInteractiveSession,
        hasAppendSystemPrompt: !!context.options.appendSystemPrompt,
        maxOutputTokensOverride: MAX_COMPACT_OUTPUT_TOKENS,  // nU1
        querySource: "compact",  // Mark as compaction request
        agents: context.options.agentDefinitions.activeAgents,
        mcpTools: []
      }
    })[Symbol.asyncIterator]();

    // Stream and process response
    let streamResult = await llmSession.next();
    while (!streamResult.done) {
      let event = streamResult.value;

      // Detect when streaming starts
      if (!hasStartedStreaming &&
          event.type === "stream_event" &&
          event.event.type === "content_block_start" &&
          event.event.content_block.type === "text") {
        hasStartedStreaming = true;
        context.setStreamMode?.("responding");
      }

      // Track response length for UI
      if (event.type === "stream_event" &&
          event.event.type === "content_block_delta" &&
          event.event.delta.type === "text_delta") {
        let deltaLength = event.event.delta.text.length;
        context.setResponseLength?.((current) => current + deltaLength);
      }

      // Capture final assistant response
      if (event.type === "assistant") {
        assistantResponse = event;
      }

      streamResult = await llmSession.next();
    }

    // Success - return the response
    if (assistantResponse) {
      return assistantResponse;
    }

    // Retry logic
    if (attempt < maxAttempts) {
      logTelemetry("tengu_compact_streaming_retry", {
        attempt,
        preCompactTokenCount,
        hasStartedStreaming
      });
      await sleep(calculateBackoff(attempt), context.abortController.signal);
      continue;
    }

    // All retries exhausted
    logTelemetry("tengu_compact_failed", {
      reason: "no_streaming_response",
      preCompactTokenCount,
      hasStartedStreaming,
      retryEnabled,
      attempts: attempt
    });
    throw Error(COMPACTION_INTERRUPTED_ERROR);
  }

  throw Error(COMPACTION_INTERRUPTED_ERROR);
}

// Mapping: H97→generateConversationSummary, ZZ→getFeatureFlag, K97→MAX_SUMMARY_RETRIES,
//          oHA→createStreamingLLMSession, FI→normalizeAttachmentsToAPI, _x→extractMessageHistory,
//          Wi→deduplicateByName, v5→ReadTool, nU1→MAX_COMPACT_OUTPUT_TOKENS, fSA→calculateBackoff,
//          QKA→sleep, Bs2→COMPACTION_INTERRUPTED_ERROR
```

**Key Insights:**
- **Retry Logic**: Up to 2 retries if feature flag enabled
- **Tools Available**: Read tool + MCP tools for potential file access
- **Query Source**: Marked as "compact" for downstream handling
- **No Extended Thinking**: `maxThinkingTokens: 0` for faster summaries

---

## 6. PreCompact Hooks

PreCompact hooks allow customization of the compaction process.

```javascript
// ============================================
// executePreCompactHooks - Run hooks before compaction
// Location: chunks.120.mjs:2173-2202
// ============================================

// ORIGINAL (for source lookup):
async function sU0(A, Q, B = fO) {
  let G = {
      ...jE(void 0),
      hook_event_name: "PreCompact",
      trigger: A.trigger,
      custom_instructions: A.customInstructions
    },
    Z = await pU0({
      hookInput: G,
      matchQuery: A.trigger,
      signal: Q,
      timeoutMs: B
    });
  if (Z.length === 0) return {};
  let Y = Z.filter((X) => X.succeeded && X.output.trim().length > 0).map((X) => X.output.trim()),
    J = [];
  for (let X of Z)
    if (X.succeeded)
      if (X.output.trim()) J.push(`PreCompact [${X.command}] completed successfully: ${X.output.trim()}`);
      else J.push(`PreCompact [${X.command}] completed successfully`);
  else if (X.output.trim()) J.push(`PreCompact [${X.command}] failed: ${X.output.trim()}`);
  else J.push(`PreCompact [${X.command}] failed`);
  return {
    newCustomInstructions: Y.length > 0 ? Y.join("\n\n") : void 0,
    userDisplayMessage: J.length > 0 ? J.join("\n") : void 0
  }
}

// READABLE (for understanding):
async function executePreCompactHooks(params, signal, timeoutMs = DEFAULT_HOOK_TIMEOUT) {
  // Build hook input with environment context
  let hookInput = {
    ...createHookEnvironmentContext(undefined),
    hook_event_name: "PreCompact",
    trigger: params.trigger,           // "auto" or "manual"
    custom_instructions: params.customInstructions
  };

  // Execute all matching PreCompact hooks
  let hookResults = await executeHooksOutsideREPL({
    hookInput,
    matchQuery: params.trigger,
    signal,
    timeoutMs
  });

  // If no hooks configured, return empty
  if (hookResults.length === 0) {
    return {};
  }

  // Collect successful outputs as custom instructions
  let successfulOutputs = hookResults
    .filter((result) => result.succeeded && result.output.trim().length > 0)
    .map((result) => result.output.trim());

  // Build user display messages
  let displayMessages = [];
  for (let result of hookResults) {
    if (result.succeeded) {
      if (result.output.trim()) {
        displayMessages.push(`PreCompact [${result.command}] completed successfully: ${result.output.trim()}`);
      } else {
        displayMessages.push(`PreCompact [${result.command}] completed successfully`);
      }
    } else {
      if (result.output.trim()) {
        displayMessages.push(`PreCompact [${result.command}] failed: ${result.output.trim()}`);
      } else {
        displayMessages.push(`PreCompact [${result.command}] failed`);
      }
    }
  }

  return {
    newCustomInstructions: successfulOutputs.length > 0 ? successfulOutputs.join("\n\n") : undefined,
    userDisplayMessage: displayMessages.length > 0 ? displayMessages.join("\n") : undefined
  };
}

// Mapping: sU0→executePreCompactHooks, fO→DEFAULT_HOOK_TIMEOUT, jE→createHookEnvironmentContext,
//          pU0→executeHooksOutsideREPL
```

**Hook Configuration (from chunks.143.mjs):**
```yaml
PreCompact:
  summary: "Before conversation compaction"
  exit_code_behavior:
    0: stdout appended as custom compact instructions
    2: block compaction
    other: show stderr to user, continue with compaction
  matcher:
    trigger: ["manual", "auto"]
```

**Use Cases:**
- Inject custom summarization instructions
- Save state before compaction
- Block compaction under certain conditions (exit code 2)

---

## 7. Post-Compact Context Restoration

After compaction, important context is restored.

### Todo List Restoration

```javascript
// ============================================
// createTodoAttachment - Preserve todo list after compaction
// Location: chunks.132.mjs:677-686
// ============================================

// ORIGINAL (for source lookup):
function z97(A) {
  let Q = Cb(A);
  if (Q.length === 0) return null;
  return X4({
    type: "todo",
    content: Q,
    itemCount: Q.length,
    context: "post-compact"
  })
}

// READABLE (for understanding):
function createTodoAttachment(agentId) {
  let todoItems = getTodoItems(agentId);
  if (todoItems.length === 0) {
    return null;
  }
  return wrapAttachmentToMessage({
    type: "todo",
    content: todoItems,
    itemCount: todoItems.length,
    context: "post-compact"  // Marks this as post-compaction restoration
  });
}

// Mapping: z97→createTodoAttachment, Cb→getTodoItems, X4→wrapAttachmentToMessage
```

### Plan File Restoration

```javascript
// ============================================
// createPlanFileReferenceAttachment - Preserve plan file after compaction
// Location: chunks.132.mjs:688-697
// ============================================

// ORIGINAL (for source lookup):
function xL0(A) {
  let Q = AK(A);
  if (!Q) return null;
  let B = dC(A);
  return X4({
    type: "plan_file_reference",
    planFilePath: B,
    planContent: Q
  })
}

// READABLE (for understanding):
function createPlanFileReferenceAttachment(agentId) {
  let planContent = readPlanFile(agentId);
  if (!planContent) {
    return null;
  }
  let planFilePath = getPlanFilePath(agentId);
  return wrapAttachmentToMessage({
    type: "plan_file_reference",
    planFilePath: planFilePath,
    planContent: planContent
  });
}

// Mapping: xL0→createPlanFileReferenceAttachment, AK→readPlanFile, dC→getPlanFilePath, X4→wrapAttachmentToMessage
```

### Invoked Skills Restoration (NEW in 2.1.x)

```javascript
// ============================================
// createInvokedSkillsAttachment - Preserve skill invocation history
// Location: chunks.132.mjs:699-711
// ============================================

// ORIGINAL (for source lookup):
function $97() {
  let A = zf0();
  if (A.size === 0) return null;
  let Q = Array.from(A.values()).sort((B, G) => G.invokedAt - B.invokedAt).map((B) => ({
    name: B.skillName,
    path: B.skillPath,
    content: B.content
  }));
  return X4({
    type: "invoked_skills",
    skills: Q
  })
}

// READABLE (for understanding):
function createInvokedSkillsAttachment() {
  let invokedSkillsMap = getInvokedSkillsHistory();
  if (invokedSkillsMap.size === 0) {
    return null;
  }

  // Sort by most recently invoked
  let sortedSkills = Array.from(invokedSkillsMap.values())
    .sort((a, b) => b.invokedAt - a.invokedAt)
    .map((skill) => ({
      name: skill.skillName,
      path: skill.skillPath,
      content: skill.content
    }));

  return wrapAttachmentToMessage({
    type: "invoked_skills",
    skills: sortedSkills
  });
}

// Mapping: $97→createInvokedSkillsAttachment, zf0→getInvokedSkillsHistory, X4→wrapAttachmentToMessage
```

### Task Status Restoration (NEW in 2.1.x)

```javascript
// ============================================
// createTaskStatusAttachments - Preserve background task statuses
// Location: chunks.132.mjs:713-730
// ============================================

// ORIGINAL (for source lookup):
async function C97(A) {
  let Q = await A.getAppState();
  return Object.values(Q.tasks).filter((G) => G.type === "local_agent").flatMap((G) => {
    if (G.retrieved) return [];
    let { status: Z } = G;
    if (Z === "completed" || Z === "failed" || Z === "killed") return [X4({
      type: "task_status",
      taskId: G.agentId,
      taskType: "local_agent",
      description: G.description,
      status: Z,
      deltaSummary: G.error ?? null
    })];
    return []
  })
}

// READABLE (for understanding):
async function createTaskStatusAttachments(context) {
  let appState = await context.getAppState();

  return Object.values(appState.tasks)
    .filter((task) => task.type === "local_agent")
    .flatMap((task) => {
      // Skip already retrieved tasks
      if (task.retrieved) {
        return [];
      }

      let { status } = task;

      // Only include completed/failed/killed tasks
      if (status === "completed" || status === "failed" || status === "killed") {
        return [wrapAttachmentToMessage({
          type: "task_status",
          taskId: task.agentId,
          taskType: "local_agent",
          description: task.description,
          status: status,
          deltaSummary: task.error ?? null
        })];
      }

      return [];
    });
}

// Mapping: C97→createTaskStatusAttachments, X4→wrapAttachmentToMessage
```

**Why restore these?**
- **Todos**: Maintain task continuity across compaction boundary
- **Plan**: Preserve agent strategy and plan mode state
- **Skills**: Remember what skills were invoked (useful for context)
- **Task Status**: Maintain background agent orchestration state

### File Restoration Mechanism (E97)

The file restoration system re-reads recently-accessed files after compaction.

```javascript
// ============================================
// restoreFilesPostCompact - Re-read files after compaction
// Location: chunks.132.mjs:654-675
// ============================================

// ORIGINAL (for source lookup):
async function E97(A, Q, B) {
  let G = Object.entries(A).map(([J, X]) => ({
      filename: J,
      ...X
    })).filter((J) => !U97(J.filename, Q.agentId)).sort((J, X) => X.timestamp - J.timestamp).slice(0, B),
    Z = await Promise.all(G.map(async (J) => {
      let X = await TL0(J.filename, {
        ...Q,
        fileReadingLimits: {
          maxTokens: W97
        }
      }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
      return X ? X4(X) : null
    })),
    Y = 0;
  return Z.filter((J) => {
    if (J === null) return !1;
    let X = l7(eA(J));
    if (Y + X <= D97) return Y += X, !0;
    return !1
  })
}

// READABLE (for understanding):
async function restoreFilesPostCompact(readFileStateMap, sessionContext, maxFilesToRestore) {
  // Step 1: Convert map entries to file objects with metadata
  let fileList = Object.entries(readFileStateMap)
    .map(([filename, metadata]) => ({ filename, ...metadata }))
    // Step 2: Exclude files that shouldn't be restored
    .filter((file) => !shouldExcludeFromRestore(file.filename, sessionContext.agentId))
    // Step 3: Sort by most recent first
    .sort((a, b) => b.timestamp - a.timestamp)
    // Step 4: Take top N files (I97 = 5)
    .slice(0, maxFilesToRestore);

  // Step 5: Re-read each file with strict token limit
  let restoredAttachments = await Promise.all(
    fileList.map(async (file) => {
      let result = await readFileForRestore(file.filename, {
        ...sessionContext,
        fileReadingLimits: { maxTokens: 5000 }  // W97 = 5000 per file
      }, "tengu_post_compact_file_restore_success",
         "tengu_post_compact_file_restore_error",
         "compact");
      return result ? wrapAttachmentToMessage(result) : null;
    })
  );

  // Step 6: Filter by accumulated token budget (D97 = 50,000 total)
  let accumulatedTokens = 0;
  return restoredAttachments.filter((attachment) => {
    if (attachment === null) return false;
    let tokenCount = countTokens(JSON.stringify(attachment));
    if (accumulatedTokens + tokenCount <= 50000) {
      accumulatedTokens += tokenCount;
      return true;
    }
    return false;  // Exceeds budget, drop this file
  });
}

// Mapping: E97→restoreFilesPostCompact, A→readFileStateMap, Q→sessionContext, B→maxFilesToRestore,
//          G→fileList, Z→restoredAttachments, Y→accumulatedTokens, U97→shouldExcludeFromRestore,
//          TL0→readFileForRestore, W97→5000, D97→50000, X4→wrapAttachmentToMessage
```

### File Exclusion Filter (U97)

Determines which files should NOT be restored (to avoid duplication):

```javascript
// ============================================
// shouldExcludeFromRestore - Filters files that shouldn't be restored
// Location: chunks.132.mjs:732-747
// ============================================

// ORIGINAL (for source lookup):
function U97(A, Q) {
  let B = Yr(A);
  try {
    let G = Q ?? q0(),
      Z = Yr(Ir(G));
    if (B === Z) return !0
  } catch {}
  try {
    let G = Yr(dC(Q));
    if (B === G) return !0
  } catch {}
  try {
    if (new Set(sr2.map((Z) => Yr(MQA(Z)))).has(B)) return !0
  } catch {}
  return !1
}

// READABLE (for understanding):
function shouldExcludeFromRestore(filepath, agentId) {
  let normalizedPath = normalizePath(filepath);

  // Exclude 1: Agent's own transcript directory
  try {
    let agentIdToUse = agentId ?? getCurrentSessionId();
    let agentTranscriptDir = normalizePath(getAgentTranscriptDir(agentIdToUse));
    if (normalizedPath === agentTranscriptDir) return true;
  } catch {}

  // Exclude 2: Plan file for this agent (restored separately via xL0)
  try {
    let planFilePath = normalizePath(getPlanFilePath(agentId));
    if (normalizedPath === planFilePath) return true;
  } catch {}

  // Exclude 3: Skill directories (restored separately via $97)
  try {
    let skillPaths = new Set(skillDirectories.map((dir) => normalizePath(getSkillDirPath(dir))));
    if (skillPaths.has(normalizedPath)) return true;
  } catch {}

  return false;  // Not excluded, can be restored
}

// Mapping: U97→shouldExcludeFromRestore, Yr→normalizePath, q0→getCurrentSessionId,
//          Ir→getAgentTranscriptDir, dC→getPlanFilePath, sr2→skillDirectories, MQA→getSkillDirPath
```

**Why exclude these files?**
- **Agent transcript**: Would be redundant with current context
- **Plan file**: Already restored separately by `xL0()` with full content
- **Skill directories**: Already restored separately by `$97()` with invocation history

### File Reading for Restoration (TL0)

The actual file reading with special handling for large files:

```javascript
// ============================================
// readFileForRestore - Reads file with restoration-specific logic
// Location: chunks.132.mjs:3-85
// ============================================

// READABLE (for understanding - decision flow):
async function readFileForRestore(filepath, sessionContext, successEvent, errorEvent, mode) {
  // Check 1: Permission guard
  if (hasPermissionError(filepath, sessionContext.toolPermissionContext)) {
    return null;
  }

  // Check 2: Use cached content if file unchanged
  let previousRead = sessionContext.readFileState.get(filepath);
  if (previousRead && mode === "at-mention") {
    let currentTimestamp = getFileModTime(filepath);
    if (previousRead.timestamp === currentTimestamp) {
      logTelemetry(successEvent, {});
      return {
        type: "already_read_file",
        filename: filepath,
        content: { type: "text", file: { filePath: filepath, content: previousRead.content, ... } }
      };
    }
  }

  // Check 3: Validate file can be read
  let validation = await readFileTool.validateInput({ file_path: filepath }, sessionContext);
  if (!validation.result) {
    if (validation.meta?.fileSize) {
      // File exists but too large - create fallback
      return createFallbackReference(filepath, mode);
    }
    return null;
  }

  // Attempt full read
  try {
    let readResult = await readFileTool.call({ file_path: filepath }, sessionContext);
    logTelemetry(successEvent, {});
    return { type: "file", filename: filepath, content: readResult.data };
  } catch (error) {
    if (error instanceof FileTooLargeError) {
      return createFallbackReference(filepath, mode);
    }
    throw error;
  }
}

// Fallback for large files during compact mode:
function createFallbackReference(filepath, mode) {
  if (mode === "compact") {
    // During compact: create lightweight reference (no content)
    return {
      type: "compact_file_reference",
      filename: filepath
    };
  }
  // Other modes: try truncated read (first 2000 lines)
  return readFileTool.call({ file_path: filepath, limit: 2000 }, sessionContext);
}

// Mapping: TL0→readFileForRestore, nEA→hasPermissionError, v5→readFileTool, $71→FileTooLargeError
```

### Attachment Type Differences

| Type | When Created | Content Included | Display to User |
|------|--------------|------------------|-----------------|
| `file` | File read successfully within limits | Full file content | Shows file content |
| `compact_file_reference` | File too large during compact | NO content (just filepath) | "Note: file was read before compaction. Use Read tool if needed." |
| `already_read_file` | File unchanged from cached read | Cached content | Shows cached content |

### File Restoration Error Handling

The restoration system uses **non-blocking error handling**:

```
File Restoration Flow:
    │
    ├─ File 1: Success → Include in attachments
    ├─ File 2: Permission Error → return null → filtered out
    ├─ File 3: Success → Include in attachments
    ├─ File 4: Too Large → compact_file_reference → Include reference
    └─ File 5: Read Error → return null → filtered out

    Result: [File 1, File 3, File 4 reference]
    (Files 2 and 5 silently dropped, compaction continues)
```

**Telemetry Events:**
- `tengu_post_compact_file_restore_success` - File read succeeded
- `tengu_post_compact_file_restore_error` - File read failed
- `tengu_attachment_file_too_large` - File size exceeded limit

---

## 8. Plan Mode Integration

The compact system has extensive integration with plan mode to preserve planning context across compaction.

### Plan Mode Exit Detection (Y97)

```javascript
// ============================================
// countUserMessagesSincePlanModeExit - Detect plan mode transitions
// Location: chunks.132.mjs:264-272
// ============================================

// ORIGINAL (for source lookup):
function Y97(A) {
  let Q = 0;
  for (let B = A.length - 1; B >= 0; B--) {
    let G = A[B];
    if (G?.type === "user" && !(("isMeta" in G) && G.isMeta)) Q++;
    if (G?.type === "attachment" && G.attachment.type === "plan_mode_exit") return Q
  }
  return 0
}

// READABLE (for understanding):
function countUserMessagesSincePlanModeExit(messages) {
  let userMessageCount = 0;

  // Iterate backwards through messages
  for (let index = messages.length - 1; index >= 0; index--) {
    let message = messages[index];

    // Count non-meta user messages
    if (message?.type === "user" && !(("isMeta" in message) && message.isMeta)) {
      userMessageCount++;
    }

    // Stop when we find a plan_mode_exit attachment
    if (message?.type === "attachment" && message.attachment.type === "plan_mode_exit") {
      return userMessageCount;
    }
  }

  // No plan_mode_exit found
  return 0;
}

// Mapping: Y97→countUserMessagesSincePlanModeExit
```

### Plan Mode Exit Attachment Generation (T27)

When exiting plan mode, a special attachment is generated:

```javascript
// ============================================
// createPlanModeExitAttachment - Notifies when plan mode exits
// Location: chunks.131.mjs:3233-3244
// ============================================

// ORIGINAL (for source lookup):
async function T27(A) {
  if (!If0()) return [];
  if ((await A.getAppState()).toolPermissionContext.mode === "plan") return lw(!1), [];
  lw(!1);
  let B = dC(A.agentId),
    G = AK(A.agentId) !== null;
  return [{
    type: "plan_mode_exit",
    planFilePath: B,
    planExists: G
  }]
}

// READABLE (for understanding):
async function createPlanModeExitAttachment(sessionContext) {
  // Check if plan mode exit flag is set
  if (!isPlanModeExitFlagSet()) {
    return [];
  }

  // If still in plan mode, clear flag and return (no exit yet)
  if ((await sessionContext.getAppState()).toolPermissionContext.mode === "plan") {
    clearPlanModeExitFlag(false);
    return [];
  }

  // Clear the flag
  clearPlanModeExitFlag(false);

  // Get plan file info for this agent
  let planFilePath = getPlanFilePath(sessionContext.agentId);
  let planFileExists = readPlanFile(sessionContext.agentId) !== null;

  return [{
    type: "plan_mode_exit",
    planFilePath: planFilePath,
    planExists: planFileExists
  }];
}

// Mapping: T27→createPlanModeExitAttachment, If0→isPlanModeExitFlagSet, lw→clearPlanModeExitFlag,
//          dC→getPlanFilePath, AK→readPlanFile
```

### Plan File Helper Functions

```javascript
// ============================================
// getPlanFilePath - Constructs plan file path
// Location: chunks.86.mjs:58-62
// ============================================

// ORIGINAL (for source lookup):
function dC(A) {
  let Q = GY0(q0());
  if (!A) return tSA(NN(), `${Q}.md`);
  return tSA(NN(), `${Q}-agent-${A}.md`)
}

// READABLE (for understanding):
function getPlanFilePath(agentId) {
  let datePrefix = generateDatePrefix(getCurrentTime());  // e.g., "rustling-doodling-anchor"
  if (!agentId) {
    // Main agent: ~/.claude/plans/{datePrefix}.md
    return joinPath(getPlansDirectory(), `${datePrefix}.md`);
  }
  // Subagent: ~/.claude/plans/{datePrefix}-agent-{agentId}.md
  return joinPath(getPlansDirectory(), `${datePrefix}-agent-${agentId}.md`);
}

// Mapping: dC→getPlanFilePath, GY0→generateDatePrefix, q0→getCurrentTime,
//          tSA→joinPath, NN→getPlansDirectory


// ============================================
// readPlanFile - Reads plan file content
// Location: chunks.86.mjs:64-74
// ============================================

// ORIGINAL (for source lookup):
function AK(A) {
  let Q = dC(A);
  if (!vA().existsSync(Q)) return null;
  try {
    return vA().readFileSync(Q, { encoding: "utf-8" })
  } catch (B) {
    return e(B instanceof Error ? B : Error(String(B))), null
  }
}

// READABLE (for understanding):
function readPlanFile(agentId) {
  let filePath = getPlanFilePath(agentId);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return fs.readFileSync(filePath, { encoding: "utf-8" });
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
    return null;
  }
}

// Mapping: AK→readPlanFile, dC→getPlanFilePath, vA→fs, e→logError
```

### Plan Mode Attachment Tracking

To prevent attachment spam, the system tracks plan mode attachment frequency:

```javascript
// ============================================
// analyzeRecentPlanModeActivity - Tracks plan mode attachment history
// Location: chunks.131.mjs:3176-3193
// ============================================

// ORIGINAL (for source lookup):
function R27(A) {
  let Q = 0, B = !1;
  for (let G = A.length - 1; G >= 0; G--) {
    let Z = A[G];
    if (Z?.type === "assistant") {
      if (dF1(Z)) continue;
      Q++
    } else if (Z?.type === "attachment" && (Z.attachment.type === "plan_mode" || Z.attachment.type === "plan_mode_reentry")) {
      B = !0;
      break
    }
  }
  return { turnCount: Q, foundPlanModeAttachment: B }
}

// READABLE (for understanding):
function analyzeRecentPlanModeActivity(messages) {
  let assistantTurnCount = 0;
  let foundRecentPlanModeAttachment = false;

  for (let i = messages.length - 1; i >= 0; i--) {
    let message = messages[i];

    if (message?.type === "assistant") {
      if (isMetaOnlyMessage(message)) continue;
      assistantTurnCount++;
    } else if (message?.type === "attachment" &&
               (message.attachment.type === "plan_mode" ||
                message.attachment.type === "plan_mode_reentry")) {
      foundRecentPlanModeAttachment = true;
      break;
    }
  }

  return {
    turnCount: assistantTurnCount,
    foundPlanModeAttachment: foundRecentPlanModeAttachment
  };
}

// Mapping: R27→analyzeRecentPlanModeActivity, dF1→isMetaOnlyMessage


// ============================================
// countPlanModeAttachmentsSinceExit - Counts attachments since plan exit
// Location: chunks.131.mjs:3195-3205
// ============================================

// ORIGINAL (for source lookup):
function _27(A) {
  let Q = 0;
  for (let B = A.length - 1; B >= 0; B--) {
    let G = A[B];
    if (G?.type === "attachment") {
      if (G.attachment.type === "plan_mode_exit") break;
      if (G.attachment.type === "plan_mode") Q++
    }
  }
  return Q
}

// READABLE (for understanding):
function countPlanModeAttachmentsSinceExit(messages) {
  let planModeAttachmentCount = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    let message = messages[i];
    if (message?.type === "attachment") {
      // Stop counting at plan_mode_exit boundary
      if (message.attachment.type === "plan_mode_exit") break;
      if (message.attachment.type === "plan_mode") {
        planModeAttachmentCount++;
      }
    }
  }

  return planModeAttachmentCount;
}

// Mapping: _27→countPlanModeAttachmentsSinceExit
```

### Throttling Constants

```javascript
// Location: chunks.132.mjs:331-332
ar2 = {
  TURNS_BETWEEN_ATTACHMENTS: 5,           // Only inject plan reminder every 5 turns
  FULL_REMINDER_EVERY_N_ATTACHMENTS: 5    // Show full plan content every 5 reminders
}
```

### Plan Mode State Preservation Flow

```
Plan Mode → Implementation Mode Transition:
    │
    ├─ User approves plan (ExitPlanMode tool)
    │   │
    │   └─ T27() creates plan_mode_exit attachment
    │       └─ { type: "plan_mode_exit", planFilePath, planExists }
    │
    ├─ During implementation...
    │   │
    │   └─ R27() checks if plan_mode attachment needed
    │       └─ Uses turnCount and TURNS_BETWEEN_ATTACHMENTS throttling
    │
    └─ During compaction:
        │
        ├─ Y97() counts user messages since plan_mode_exit
        │   └─ Used to determine plan context freshness
        │
        └─ xL0() restores plan file reference
            └─ { type: "plan_file_reference", planFilePath, planContent }
```

**Why this integration matters:**
- Plan context must survive compaction for long implementation tasks
- Throttling prevents repetitive plan reminders
- Separate exit/entry tracking allows resuming plan mode mid-conversation

---

## 9. Micro-Compact (Tool Result Clearing)

Micro-compact is a fast, local operation that clears old tool results.

```javascript
// ============================================
// microCompactToolResults - Clear old tool results without LLM
// Location: chunks.132.mjs:1111-1224
// ============================================

// ORIGINAL (for source lookup - partial):
async function lc(A, Q, B) {
  if (nF1 = !1, a1(process.env.DISABLE_MICROCOMPACT)) return { messages: A };
  // ... tool scanning and clearing logic
}

// READABLE (for understanding):
async function microCompactToolResults(messages, threshold, context) {
  // Reset micro-compact flag
  microCompactOccurred = false;

  // Check if micro-compact is disabled
  if (parseBoolean(process.env.DISABLE_MICROCOMPACT)) {
    return { messages };
  }

  let hasExplicitThreshold = threshold !== undefined;
  let targetThreshold = hasExplicitThreshold ? threshold : DEFAULT_MICRO_THRESHOLD;  // P97 = 40000

  let toolUseIds = [];
  let toolResultTokens = new Map();

  // Phase 1: Collect tool_use/tool_result pairs for compactable tools
  for (let message of messages) {
    if ((message.type === "user" || message.type === "assistant") &&
        Array.isArray(message.message.content)) {
      for (let block of message.message.content) {
        // Track tool_use blocks for compactable tools
        if (block.type === "tool_use" && COMPACTABLE_TOOLS.has(block.name)) {
          if (!alreadyCompactedIds.has(block.id)) {
            toolUseIds.push(block.id);
          }
        }
        // Track corresponding tool_result blocks
        else if (block.type === "tool_result" && toolUseIds.includes(block.tool_use_id)) {
          let tokens = getCachedToolResultTokens(block.tool_use_id, block);
          toolResultTokens.set(block.tool_use_id, tokens);
        }
      }
    }
  }

  // Phase 2: Determine which tools to compact (keep last 3)
  let toolsToKeep = toolUseIds.slice(-KEEP_RECENT_TOOLS);  // S97 = 3
  let totalTokens = Array.from(toolResultTokens.values()).reduce((a, b) => a + b, 0);
  let tokensToSave = 0;
  let toolsToCompact = new Set();

  for (let toolId of toolUseIds) {
    if (toolsToKeep.includes(toolId)) continue;
    if (totalTokens - tokensToSave > targetThreshold) {
      toolsToCompact.add(toolId);
      tokensToSave += toolResultTokens.get(toolId) || 0;
    }
  }

  // Phase 3: Check if compaction is worthwhile
  if (!hasExplicitThreshold) {
    let currentTokens = countTotalTokens(messages);
    let thresholdCheck = calculateThresholds(currentTokens);
    if (!thresholdCheck.isAboveWarningThreshold || tokensToSave < MINIMUM_SAVINGS) {
      toolsToCompact.clear();
      tokensToSave = 0;
    }
  }

  // Phase 4: Clear memory attachments that are no longer needed
  // ... (memory attachment clearing logic)

  // Phase 5: Replace tool results with "[cleared]" marker
  let newMessages = [];
  for (let message of messages) {
    // ... (message processing with content replacement)
  }

  // Phase 6: Update tracking state
  for (let toolId of toolsToCompact) {
    alreadyCompactedIds.add(toolId);
  }

  if (toolsToCompact.size > 0) {
    logTelemetry("tengu_microcompact", {
      toolsCompacted: toolsToCompact.size,
      totalUncompactedTokens: totalTokens,
      tokensAfterCompaction: totalTokens - tokensToSave,
      tokensSaved: tokensToSave,
      triggerType: hasExplicitThreshold ? "manual" : "auto"
    });
    microCompactOccurred = true;
    notifyMicroCompactListeners();
    return { messages: newMessages };
  }

  return { messages: newMessages };
}

// Mapping: lc→microCompactToolResults, nF1→microCompactOccurred, a1→parseBoolean,
//          P97→DEFAULT_MICRO_THRESHOLD, S97→KEEP_RECENT_TOOLS, T97→MINIMUM_SAVINGS,
//          x97→COMPACTABLE_TOOLS, bL0→alreadyCompactedIds, k97→notifyMicroCompactListeners
```

**Compactable Tools (x97):**
- Read (`z3`)
- Bash (`X9`)
- Grep (`DI`)
- Glob (`lI`)
- WebSearch (`aR`)
- WebFetch (`cI`)
- Edit (`I8`)
- Write (`BY`)

**Micro-Compact Algorithm:**
1. Scan for tool_use/tool_result pairs
2. Keep last 3 tool results uncompressed
3. Only trigger if savings >= 20k tokens AND above warning threshold
4. Replace content with `"[Old tool result content cleared]"`
5. Track compacted IDs to avoid re-processing

### Read Tool State Cleanup

During micro-compact, Read tool file state is synchronized:

```javascript
// ============================================
// Read Tool State Cleanup in Micro-Compact
// Location: chunks.132.mjs:1197-1211
// ============================================

// READABLE (for understanding):
if (sessionContext && compactedToolIds.size > 0) {
  let compactedFilepaths = new Map();    // filepath → tool_use_id for compacted tools
  let keptFilepaths = new Set();         // filepaths for kept Read tools

  // Scan all messages to categorize Read tool operations
  for (let msg of messages) {
    if ((msg.type === "user" || msg.type === "assistant") &&
        Array.isArray(msg.message.content)) {
      for (let block of msg.message.content) {
        // Only care about Read tool
        if (block.type === "tool_use" && block.name === "Read") {
          let filepath = block.input?.file_path;
          if (typeof filepath === "string") {
            if (compactedToolIds.has(block.id)) {
              // This Read tool is being compacted
              compactedFilepaths.set(filepath, block.id);
            } else {
              // This Read tool is being kept
              keptFilepaths.add(filepath);
            }
          }
        }
      }
    }
  }

  // Clean up read file state for compacted-only files
  for (let [filepath] of compactedFilepaths) {
    if (!keptFilepaths.has(filepath)) {
      // File was only read by compacted tools, safe to remove from state
      sessionContext.readFileState.delete(filepath);
    }
  }
}

// Mapping: W→compactedToolIds, z3→"Read", F→compactedFilepaths, H→keptFilepaths
```

**Why this matters:**
- Prevents re-reading files that were already compacted away
- Keeps file state only if at least one Read tool using that file survives compaction
- Optimizes future Read tool calls by maintaining accurate state

### Read Tool Deduplication Tracking

The system also tracks duplicate file reads for optimization:

```javascript
// ============================================
// analyzeContentBlock - Tracks duplicate Read tool operations
// Location: chunks.132.mjs:391-425
// ============================================

// READABLE (for understanding - partial):
function analyzeContentBlock(block, message, stats, toolNameMap, filePathMap, duplicateTracking) {
  // ... (token counting)

  switch (block.type) {
    case "tool_use":
      if (block.name && block.id) {
        toolNameMap.set(block.id, block.name);

        // Special tracking for Read tool
        if (block.name === "Read" && block.input?.file_path) {
          filePathMap.set(block.id, String(block.input.file_path));
        }
      }
      break;

    case "tool_result":
      if (block.tool_use_id) {
        let toolName = toolNameMap.get(block.tool_use_id);

        // Track duplicate Read operations
        if (toolName === "Read") {
          let filepath = filePathMap.get(block.tool_use_id);
          if (filepath) {
            let existing = duplicateTracking.get(filepath) || { count: 0, totalTokens: 0 };
            duplicateTracking.set(filepath, {
              count: existing.count + 1,
              totalTokens: existing.totalTokens + tokenCount
            });
          }
        }
      }
      break;
  }
}

// Mapping: X97→analyzeContentBlock, Z→filePathMap, Y→duplicateTracking
```

**Duplicate savings calculation:**
```javascript
// If file read 3 times at 100 tokens per read:
// Duplicate savings = (100 * 3 / 3) * (3 - 1) = 200 tokens saved
duplicateTracking.forEach((stats, filepath) => {
  if (stats.count > 1) {
    let duplicateTokensSaved = Math.floor(stats.totalTokens / stats.count) * (stats.count - 1);
    result.duplicateFileReads.set(filepath, { count: stats.count, tokens: duplicateTokensSaved });
  }
});
```

### Tool Result Persistence (Large Results)

For very large tool results, content is persisted to disk:

```javascript
// ============================================
// persistLargeToolResult - Save large tool result to disk
// Location: chunks.89.mjs:2412-2443
// ============================================

// ORIGINAL (for source lookup):
async function Z4A(A, Q) {
  await K85();
  let B = Array.isArray(A), G = B ? "json" : "txt",
    Z = mX0(ZZ1(), `${Q}.${G}`), Y = B ? eA(A, null, 2) : A, J = !1;
  try {
    await D85(Z), J = !0
  } catch {}
  if (!J) {
    try {
      await I85(Z, Y, "utf-8")
    } catch (D) {
      let W = D instanceof Error ? D : Error(String(D));
      return e(W), { error: E85(W) }
    }
    k(`Persisted tool result to ${Z} (${xD(Y.length)})`)
  }
  let { preview: X, hasMore: I } = H85(Y, q42);
  return { filepath: Z, originalSize: Y.length, isJson: B, preview: X, hasMore: I }
}

// READABLE (for understanding):
async function persistLargeToolResult(content, toolUseId) {
  await ensureTempDirectory();

  // Determine file type based on content
  let isJson = Array.isArray(content);
  let fileExt = isJson ? "json" : "txt";
  let filepath = joinPath(getTempDir(), `${toolUseId}.${fileExt}`);
  let serializedContent = isJson ? JSON.stringify(content, null, 2) : content;

  // Check if file already exists (cached from previous compact)
  let fileExists = false;
  try {
    await stat(filepath);
    fileExists = true;
  } catch {}

  // Write if doesn't exist
  if (!fileExists) {
    try {
      await writeFile(filepath, serializedContent, "utf-8");
    } catch (error) {
      logError(error instanceof Error ? error : Error(String(error)));
      return { error: formatError(error) };
    }
    log(`Persisted tool result to ${filepath} (${formatBytes(serializedContent.length)})`);
  }

  // Create preview with truncation indicator
  let { preview, hasMore } = createPreview(serializedContent, MAX_PREVIEW_LENGTH);
  return {
    filepath: filepath,
    originalSize: serializedContent.length,
    isJson: isJson,
    preview: preview,
    hasMore: hasMore
  };
}

// Mapping: Z4A→persistLargeToolResult, K85→ensureTempDirectory, mX0→joinPath, ZZ1→getTempDir,
//          D85→stat, I85→writeFile, H85→createPreview, q42→MAX_PREVIEW_LENGTH
```

```javascript
// ============================================
// wrapTruncatedToolResult - Replace large result with file reference
// Location: chunks.89.mjs:2463-2483
// ============================================

// READABLE (for understanding):
async function wrapTruncatedToolResult(toolResultBlock, toolName, maxResultSize) {
  let content = toolResultBlock.content;
  if (!content) return toolResultBlock;

  // Skip if content contains images (preserve original)
  if (Array.isArray(content)) {
    if (content.some(item => typeof item === "object" && item.type === "image")) {
      return toolResultBlock;
    }
  }

  // Skip if content is within size limits
  let size = typeof content === "string" ? content.length : JSON.stringify(content).length;
  if (size <= (maxResultSize ?? DEFAULT_MAX_RESULT_SIZE)) {
    return toolResultBlock;
  }

  // Persist to disk and wrap with preview
  let persistResult = await persistLargeToolResult(content, toolResultBlock.tool_use_id);
  if (hasErrorResult(persistResult)) {
    return toolResultBlock;  // Return original on error
  }

  // Create replacement text with file reference
  let previewText = `═══════════════════════════════════════
Tool result saved to: ${persistResult.filepath}
Use Read to view
═══════════════════════════════════════`;

  logTelemetry("tengu_tool_result_persisted", {
    toolName: normalizeToolName(toolName),
    originalSizeBytes: persistResult.originalSize,
    persistedSizeBytes: previewText.length
  });

  return {
    ...toolResultBlock,
    content: previewText  // Replace with truncation message + filepath
  };
}

// Mapping: F85→wrapTruncatedToolResult, Z4A→persistLargeToolResult, Y4A→hasErrorResult, V85→formatTruncationMessage
```

**Tool Result Size Flow:**
```
Tool Returns Result
    │
    ├─ Size ≤ DEFAULT_MAX_RESULT_SIZE → Pass through unchanged
    │
    └─ Size > DEFAULT_MAX_RESULT_SIZE:
        │
        ├─ Contains images? → Pass through unchanged
        │
        └─ Persist to disk:
            ├─ Save to ~/.claude/temp/{tool_use_id}.txt or .json
            ├─ Create preview text with file reference
            ├─ Log telemetry: tengu_tool_result_persisted
            └─ Replace content with: "Tool result saved to: {filepath}\nUse Read to view"
```

---

## 10. /compact Slash Command

Manual compaction via `/compact` command.

```javascript
// ============================================
// compactSlashCommand - Manual compact trigger
// Location: chunks.136.mjs:2097-2150
// ============================================

// ORIGINAL (for source lookup):
EY7 = {
  type: "local",
  name: "compact",
  description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
  isEnabled: () => !a1(process.env.DISABLE_COMPACT),
  isHidden: !1,
  supportsNonInteractive: !0,
  argumentHint: "<optional custom summarization instructions>",
  async call(A, Q) {
    T9("compact");
    let { abortController: B, messages: G } = Q;
    if (G.length === 0) throw Error("No messages to compact");
    let Z = A.trim();
    try {
      if (!Z) {
        let K = await sF1(G, Q.agentId);
        if (K) {
          ZV.cache.clear?.(), GV.cache.clear?.();
          // ... return session memory compact result
        }
      }
      let J = (await lc(G, void 0, Q)).messages,
        X = await cF1(J, Q, !1, Z);
      // ... return full compact result
    } catch (Y) {
      // ... error handling
    }
  }
}

// READABLE (for understanding):
compactSlashCommand = {
  type: "local",
  name: "compact",
  description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
  isEnabled: () => !parseBoolean(process.env.DISABLE_COMPACT),
  isHidden: false,
  supportsNonInteractive: true,
  argumentHint: "<optional custom summarization instructions>",

  async call(args, context) {
    // Track command usage
    trackSlashCommandUsage("compact");

    let { abortController, messages } = context;

    if (messages.length === 0) {
      throw Error("No messages to compact");
    }

    let customInstructions = args.trim();

    try {
      // Without custom instructions, try Session Memory Compact first
      if (!customInstructions) {
        let sessionResult = await sessionMemoryCompact(messages, context.agentId);
        if (sessionResult) {
          // Clear caches after compaction
          claudeMdCache.cache.clear?.();
          skillsCache.cache.clear?.();

          let tip = getRandomTip("tip");
          let transcriptKeybind = getKeybindingDisplay("app:toggleTranscript", "Global", "ctrl+o");
          let hints = [
            ...context.options.verbose ? [] : [`(${transcriptKeybind} to see full summary)`],
            ...tip ? [tip] : []
          ];

          return {
            type: "compact",
            compactionResult: sessionResult,
            displayText: chalk.dim("Compacted " + hints.join("\n"))
          };
        }
      }

      // Run micro-compact first, then full compact
      let microCompactedMessages = (await microCompactToolResults(messages, undefined, context)).messages;
      let fullResult = await fullCompact(microCompactedMessages, context, false, customInstructions);

      // Clear last summarized ID
      setLastSummarizedId(undefined);

      // Clear caches
      claudeMdCache.cache.clear?.();
      skillsCache.cache.clear?.();

      let tip = getRandomTip("tip");
      let transcriptKeybind = getKeybindingDisplay("app:toggleTranscript", "Global", "ctrl+o");
      let hints = [
        ...context.options.verbose ? [] : [`(${transcriptKeybind} to see full summary)`],
        ...fullResult.userDisplayMessage ? [fullResult.userDisplayMessage] : [],
        ...tip ? [tip] : []
      ];

      return {
        type: "compact",
        compactionResult: fullResult,
        displayText: chalk.dim("Compacted " + hints.join("\n"))
      };
    } catch (error) {
      if (abortController.signal.aborted) {
        throw Error("Compaction canceled.");
      } else if (error instanceof Error && error.message === NOT_ENOUGH_MESSAGES_ERROR) {
        throw Error(NOT_ENOUGH_MESSAGES_ERROR);
      } else {
        logError(error instanceof Error ? error : Error(String(error)));
        throw Error(`Error during compaction: ${error}`);
      }
    }
  },

  userFacingName() {
    return "compact";
  }
};

// Mapping: EY7→compactSlashCommand, a1→parseBoolean, T9→trackSlashCommandUsage,
//          sF1→sessionMemoryCompact, lc→microCompactToolResults, cF1→fullCompact,
//          oEA→setLastSummarizedId, DhA→NOT_ENOUGH_MESSAGES_ERROR
```

**Usage:**
- `/compact` - Use default summarization
- `/compact focus on code changes` - Custom instructions for summary

---

## 11. Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DISABLE_COMPACT` | false | Completely disable all compaction |
| `DISABLE_AUTO_COMPACT` | false | Disable automatic compaction (manual still works) |
| `DISABLE_MICROCOMPACT` | false | Disable micro-compaction |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | - | Override target percentage (0-100) |
| `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | - | Override blocking limit calculation |

### User Settings

```javascript
L1().autoCompactEnabled  // User preference for auto-compact (default: true)
```

### Feature Flags

```javascript
ROA("tengu_session_memory")  // Enable session memory feature
ROA("tengu_sm_compact")      // Enable session memory compact
ZZ("tengu_compact_streaming_retry", false)  // Enable streaming retry
```

---

## 12. Telemetry Events

| Event | Trigger | Data |
|-------|---------|------|
| `tengu_compact` | Full compact completes | preCompactTokenCount, postCompactTokenCount, usage stats |
| `tengu_compact_failed` | Compact fails | reason, preCompactTokenCount |
| `tengu_compact_streaming_retry` | Retry attempt | attempt, preCompactTokenCount, hasStartedStreaming |
| `tengu_microcompact` | Micro-compact runs | toolsCompacted, tokensSaved, triggerType |
| `tengu_sm_compact_*` | Session memory events | Various (empty_template, threshold_exceeded, etc.) |
| `tengu_post_compact_file_restore_*` | File restoration | success/error per file |

---

## 13. Main Agent Loop Integration

The compact system is deeply integrated with the main agent loop in `chunks.134.mjs`.

### Integration Point in Query Loop

```javascript
// ============================================
// Compact Integration in Main Agent Loop
// Location: chunks.134.mjs:132-169
// ============================================

// ORIGINAL (for source lookup):
h6("query_microcompact_start");
let O = await lc(z, void 0, Y);
if (z = O.messages, O.compactionInfo?.systemMessage) yield O.compactionInfo.systemMessage;
h6("query_microcompact_end"), h6("query_autocompact_start");
let { compactionResult: L } = await ys2(z, Y, D);
if (h6("query_autocompact_end"), L) {
  let { preCompactTokenCount: zA, postCompactTokenCount: wA, compactionUsage: _A } = L;
  l("tengu_auto_compact_succeeded", {
    originalMessageCount: A.length,
    compactedMessageCount: L.summaryMessages.length + L.attachments.length + L.hookResults.length,
    preCompactTokenCount: zA, postCompactTokenCount: wA,
    // ... usage metrics
  });
  if (!$?.compacted) $ = { compacted: !0, turnId: X19(), turnCounter: 0 };
  let s = FHA(L);
  for (let t of s) yield t;
  z = s
}

// READABLE (for understanding):
// Phase 1: Micro-compact
timingMarker("query_microcompact_start");
let microResult = await microCompactToolResults(messages, undefined, toolUseContext);
messages = microResult.messages;
if (microResult.compactionInfo?.systemMessage) {
  yield microResult.compactionInfo.systemMessage;
}
timingMarker("query_microcompact_end");

// Phase 2: Auto-compact
timingMarker("query_autocompact_start");
let { compactionResult } = await autoCompactDispatcher(messages, toolUseContext, querySource);

if (timingMarker("query_autocompact_end"), compactionResult) {
  // Log success telemetry
  let { preCompactTokenCount, postCompactTokenCount, compactionUsage } = compactionResult;
  logTelemetry("tengu_auto_compact_succeeded", {
    originalMessageCount: originalMessages.length,
    compactedMessageCount: compactionResult.summaryMessages.length +
                          compactionResult.attachments.length +
                          compactionResult.hookResults.length,
    preCompactTokenCount,
    postCompactTokenCount,
    // ... usage metrics
  });

  // Track first compaction in this turn
  if (!autoCompactTracking?.compacted) {
    autoCompactTracking = { compacted: true, turnId: generateTurnId(), turnCounter: 0 };
  }

  // Convert result to message array and yield to stream
  let compactedMessages = flattenCompactResult(compactionResult);  // FHA
  for (let message of compactedMessages) {
    yield message;
  }
  messages = compactedMessages;
}

// Mapping: h6→timingMarker, lc→microCompactToolResults, ys2→autoCompactDispatcher,
//          FHA→flattenCompactResult, $→autoCompactTracking
```

### Query Loop Flow Diagram

```
Main Agent Loop (chunks.134.mjs)
    │
    ├─ Load messages: z = _x(A)
    │
    ├─ [TIMING] query_microcompact_start
    │   └─ Micro-Compact: lc(z, undefined, Y)
    │       └─ If systemMessage → yield to stream
    │
    ├─ [TIMING] query_microcompact_end → query_autocompact_start
    │   └─ Auto-Compact: ys2(z, Y, D)
    │       ├─ Check: env.DISABLE_COMPACT
    │       ├─ Check: l97() threshold exceeded?
    │       ├─ Try: sF1() session memory compact
    │       └─ Fallback: cF1() full compact
    │
    ├─ [TIMING] query_autocompact_end
    │   └─ If compactionResult:
    │       ├─ Log: tengu_auto_compact_succeeded
    │       ├─ Update: autoCompactTracking state
    │       ├─ Convert: FHA(result) → message array
    │       │   └─ [boundaryMarker, summaryMessages, messagesToKeep, attachments, hookResults]
    │       ├─ Yield: each message to stream
    │       └─ Update: z = compactedMessages
    │
    ├─ [TIMING] query_setup_start
    │   └─ Continue: tool schemas, message normalization
    │
    └─ API Call: oHA({ messages: FI(z, ...), ... })
```

---

## 14. Subagent Handling

Compact works with subagents through agent-specific context handling.

### Agent ID Passing

```javascript
// Session memory compact receives agentId
let Z = await sF1(A, Q.agentId, xs2());

// Plan file reference uses agentId
function xL0(A) {  // A = agentId
  let Q = AK(A);   // Read plan file for this agent
  if (!Q) return null;
  let B = dC(A);   // Get plan file path for this agent
  return X4({ type: "plan_file_reference", planFilePath: B, planContent: Q });
}
```

### Subagent Compact Behavior

1. **Same Global Settings**: Subagents use the same `DISABLE_COMPACT`, `DISABLE_AUTO_COMPACT` settings as main agent

2. **Agent-Isolated Context**: Each subagent has its own:
   - `agentId` for session memory lookup
   - Plan file path via `getPlanFilePath(agentId)`
   - Transcript path via `getTranscriptPath(agentId)`

3. **messagesToKeep Preservation**: When compact result is processed:

```javascript
// Location: chunks.112.mjs:2671-2684
if (K.type === "compact") {
  let F = {
    ...K.compactionResult,
    messagesToKeep: [...K.compactionResult.messagesToKeep ?? [], ...V]  // Preserve display text
  };
  return {
    messages: FHA(F),
    shouldQuery: false,
    command: I
  }
}
```

### Task Tool During Compact

When Task tool spawns subagents during compaction:
- The subagent gets its own isolated message history
- Parent's compaction doesn't affect spawned subagent
- Subagent can trigger its own compaction independently

---

## 15. System Reminder Transformation Pipeline

Post-compact content is transformed into system reminders for the API.

### Transformation Flow

```
CompactionResult
  ├── boundaryMarker (system boundary message)
  ├── summaryMessages (user type, isCompactSummary: true, isVisibleInTranscriptOnly: true)
  ├── attachments (file refs, edited files, todos, plans, skills, task status)
  └── hookResults (hook execution outputs)
        │
        ▼
FHA() reconstructs messages array
        │
        ▼
FI() normalizes for API (chunks.147.mjs:2876-2947)
  │
  ├── Filter: Remove progress/system/meta messages
  ├── Reorder: I$7() moves attachments next to tool results
  │
  └── For each attachment:
        │
        ▼
      q$7() converts attachment type (chunks.148.mjs:1-50)
        │
        ├── "file" → Tool call + result with file content
        ├── "compact_file_reference" → Note: file was read before compaction
        ├── "edited_text_file" → Note: file was modified
        ├── "todo" → Todo list content
        ├── "plan_file_reference" → Plan file content
        ├── "invoked_skills" → Skill invocation history
        └── "task_status" → Background task status
              │
              ▼
        q5() wraps in <system-reminder> tags (chunks.147.mjs:3218-3245)
              │
              ▼
        Merged with preceding user message or pushed standalone
              │
              ▼
_3A() injects CLAUDE.md context as system-reminder (chunks.133.mjs:2585-2598)
              │
              ▼
        Final API messages with <system-reminder>...</system-reminder> tags
```

### System Reminder Wrapper Function

```javascript
// ============================================
// System Reminder Tag Wrapper
// Location: chunks.147.mjs:3212-3245
// ============================================

// ORIGINAL (for source lookup):
function Yh(A) {
  return `<system-reminder>
${A}
</system-reminder>`
}

function q5(A) {
  return A.map((Q) => {
    if (typeof Q.message.content === "string") return {
      ...Q,
      message: { ...Q.message, content: Yh(Q.message.content) }
    };
    // ... handle array content
  })
}

// READABLE (for understanding):
function createSystemReminderTag(content) {
  return `<system-reminder>
${content}
</system-reminder>`;
}

function wrapMessagesInSystemReminders(messages) {
  return messages.map((msg) => {
    if (typeof msg.message.content === "string") {
      return {
        ...msg,
        message: {
          ...msg.message,
          content: createSystemReminderTag(msg.message.content)
        }
      };
    }
    // ... handle array content blocks
  });
}

// Mapping: Yh→createSystemReminderTag, q5→wrapMessagesInSystemReminders
```

### Attachment Type Conversion (q$7)

```javascript
// ============================================
// Attachment to System Reminder Conversion
// Location: chunks.148.mjs:1-50
// ============================================

// READABLE (for understanding):
function convertAttachmentToSystemReminders(attachment) {
  switch (attachment.type) {
    case "file":
      // Convert to tool_use + tool_result pair with file content
      return wrapInSystemReminder([
        createToolCall(ReadTool.name, { file_path: attachment.filename }),
        createToolResult(ReadTool, { content: attachment.content })
      ]);

    case "compact_file_reference":
      // Note that file was read before compaction
      return wrapInSystemReminder([
        createUserMessage({
          content: `Note: ${attachment.filename} was read before this conversation was compacted. Use the Read tool if you need to see its contents.`,
          isMeta: true
        })
      ]);

    case "todo":
      // Inject todo list as system reminder
      return wrapInSystemReminder([
        createUserMessage({
          content: formatTodoList(attachment.content),
          isMeta: true
        })
      ]);

    case "plan_file_reference":
      // Inject plan file content
      return wrapInSystemReminder([
        createUserMessage({
          content: `Plan file (${attachment.planFilePath}):\n${attachment.planContent}`,
          isMeta: true
        })
      ]);

    // ... other attachment types
  }
}
```

### isCompactSummary Flag Handling

The `isCompactSummary: true` flag has special handling:

1. **Transcript Rendering** (chunks.135.mjs:202-211):
   - Marked with `isReplay: false` to distinguish from user replays

2. **Prompt Detection** (chunks.148.mjs:1063-1074):
   - Explicitly skipped when finding user's actual prompt
   - Prevents AI summary from being treated as user intent

3. **API Normalization**:
   - Passed through but distinguished from actual user messages

---

## 16. Cross-References Summary

### With Main Agent Loop
- `ys2` called in chunks.134.mjs:136-138 after micro-compact
- Timing markers: `query_autocompact_start/end`
- Results yielded to message stream and update working messages

### With Subagents
- Agent ID passed to session memory compact: `sF1(A, Q.agentId, xs2())`
- Each agent has isolated plan files, transcripts
- Same global disable settings apply to all agents

### With Plan Mode
- `Y97` detects `plan_mode_exit` attachments
- `xL0` creates agent-specific plan file references
- Plan restored after compaction via attachment system

### With Tools
- Read tool available during summary generation
- Tool results are micro-compact targets
- `compact_file_reference` type for files read during compact

### With System Reminders
- `q$7` converts attachments to system-reminder wrapped messages
- `Yh` / `q5` wrap content in `<system-reminder>` XML tags
- `_3A` injects CLAUDE.md context as system-reminder

### With Hooks
- PreCompact hooks: `sU0` (chunks.120.mjs:2173-2202)
- SessionStart hooks: `WU("compact")` after compaction
- Hook outputs become custom summarization instructions

---

## Summary

The v2.1.7 Compact system is a sophisticated three-tier architecture:

1. **Session Memory Compact** (NEW) - Fastest, uses cached summaries
2. **Full Compact** - LLM-based summarization with 8-phase process
3. **Micro-Compact** - Fast tool result clearing

Key improvements over earlier versions:
- Session Memory feature for zero-cost compaction
- Invoked skills tracking and restoration
- Task status preservation for background agents
- Enhanced plan mode integration
- Improved retry logic for streaming summaries

The system is highly configurable via environment variables, user settings, and PreCompact hooks, making it adaptable to various use cases while maintaining conversation continuity.
