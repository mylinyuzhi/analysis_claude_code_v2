# Session Memory Extraction System (v2.1.7)

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Overview

**Critical Insight**: Session Memory is NOT just about reading a cached file. It's a **two-phase system** with a background extraction agent that proactively maintains the summary.

The Session Memory system consists of:
1. **Phase 1: Background Extraction** - A forked agent that periodically extracts summaries (USES LLM)
2. **Phase 2: Session Memory Compact** - Uses the pre-computed summary when compaction triggers (NO LLM)

This design separates the cost of summary generation from the critical path of compaction.

---

## Two-Phase Architecture

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    SESSION MEMORY TWO-PHASE ARCHITECTURE                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  ┌─────────────────────────────────────────────────────────────────────────┐ ║
║  │  PHASE 1: BACKGROUND EXTRACTION (Proactive, uses LLM)                   │ ║
║  │  ────────────────────────────────────────────────────────────────────── │ ║
║  │  Location: chunks.144.mjs (nF7 function)                                │ ║
║  │  Trigger: Token threshold OR tool call threshold during conversation    │ ║
║  │  Action: Spawns FORKED AGENT to update ~/.claude/<session>/summary.md   │ ║
║  │  LLM Call: YES (but runs asynchronously in background)                  │ ║
║  │  Cost: Tokens consumed during normal conversation (not at compact time) │ ║
║  └─────────────────────────────────────────────────────────────────────────┘ ║
║                                       │                                       ║
║                                       │ Creates/Updates                       ║
║                                       ▼                                       ║
║                    ┌──────────────────────────────────────┐                  ║
║                    │  ~/.claude/<session>/session-memory/ │                  ║
║                    │  └── summary.md                      │                  ║
║                    │      (incrementally updated)         │                  ║
║                    │      + lastSummarizedId tracking     │                  ║
║                    └──────────────────────────────────────┘                  ║
║                                       │                                       ║
║                                       │ Read when needed                      ║
║                                       ▼                                       ║
║  ┌─────────────────────────────────────────────────────────────────────────┐ ║
║  │  PHASE 2: SESSION MEMORY COMPACT (Reactive, no LLM)                     │ ║
║  │  ────────────────────────────────────────────────────────────────────── │ ║
║  │  Location: chunks.132.mjs (sF1 function)                                │ ║
║  │  Trigger: Auto-compact threshold exceeded                               │ ║
║  │  Action: Read cached summary + keep recent messages                     │ ║
║  │  LLM Call: NO (uses pre-computed result from Phase 1)                   │ ║
║  │  Cost: Zero tokens (instant compaction)                                 │ ║
║  └─────────────────────────────────────────────────────────────────────────┘ ║
║                                                                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## Phase 1: Background Extraction Agent

### Trigger Conditions

The background extraction is triggered by `lF7` (shouldTriggerExtraction) function:

```javascript
// ============================================
// shouldTriggerExtraction - Check if background extraction should run
// Location: chunks.144.mjs:2434-2456
// ============================================

// ORIGINAL (for source lookup):
function lF7(A) {
  let B = [...A].reverse().find((I) => I.type === "assistant")?.uuid;
  if (B && B !== gG9) {
    let I = sH(A);
    if (I > 0) Hs2(I);
    let D = oeB(A);
    if (D > 0) Es2(D);
    gG9 = B
  }
  if (!$s2()) {
    if (!Us2()) return !1;
    Cs2()
  }
  let G = qs2(),
    Y = pF7(A, hG9) >= Ns2(),
    J = DuA(A);
  if (G && Y || G && !J) {
    let I = A[A.length - 1];
    if (I?.uuid) hG9 = I.uuid;
    return !0
  }
  return !1
}

// READABLE (for understanding):
function shouldTriggerExtraction(messages) {
  // Track last processed assistant message to avoid re-processing
  const lastAssistantUuid = messages.reverse().find(m => m.type === "assistant")?.uuid;
  if (lastAssistantUuid && lastAssistantUuid !== lastProcessedAssistantId) {
    // Update token/tool counts
    const tokenCount = countTokens(messages);
    if (tokenCount > 0) updateTokenTracker(tokenCount);
    const toolCount = countToolCalls(messages);
    if (toolCount > 0) updateToolTracker(toolCount);
    lastProcessedAssistantId = lastAssistantUuid;
  }

  // Check if initialization threshold met
  if (!hasReachedInitThreshold()) {
    if (!hasEnoughTokensToInit()) return false;
    markInitialized();
  }

  // Decision logic
  const hasEnoughTokens = hasAccumulatedEnoughTokens();      // G: >= minimumTokensBetweenUpdate
  const hasEnoughToolCalls = countToolCallsSince(lastExtractedId) >= toolCallsBetweenUpdates;  // Y
  const isNotCompacting = !isCurrentlyCompacting();          // !J

  // Trigger if:
  // - (enough tokens AND enough tool calls) OR
  // - (enough tokens AND not currently compacting)
  if ((hasEnoughTokens && hasEnoughToolCalls) || (hasEnoughTokens && isNotCompacting)) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.uuid) lastTriggeredMessageId = lastMessage.uuid;
    return true;
  }
  return false;
}

// Mapping: lF7→shouldTriggerExtraction, gG9→lastProcessedAssistantId, sH→countTokens,
//          Hs2→updateTokenTracker, oeB→countToolCalls, Es2→updateToolTracker,
//          $s2→hasReachedInitThreshold, Us2→hasEnoughTokensToInit, Cs2→markInitialized,
//          qs2→hasAccumulatedEnoughTokens, pF7→countToolCallsSince, hG9→lastExtractedId,
//          Ns2→toolCallsBetweenUpdates, DuA→isCurrentlyCompacting
```

### Trigger Configuration

```javascript
// ============================================
// Session Memory Config Defaults
// Location: chunks.144.mjs:2488-2493
// ============================================

const SESSION_MEMORY_CONFIG = {
  minimumMessageTokensToInit: 5000,    // WhA.minimumMessageTokensToInit
  minimumTokensBetweenUpdate: 5000,    // Tokens accumulated before next extraction
  toolCallsBetweenUpdates: 10,         // Tool calls required between extractions
};
```

**When Extraction Triggers:**
1. **Initial trigger**: After `minimumMessageTokensToInit` (5000) tokens in conversation
2. **Subsequent triggers**: When BOTH conditions met:
   - `minimumTokensBetweenUpdate` (5000) tokens accumulated since last extraction
   - `toolCallsBetweenUpdates` (10) tool calls since last extraction
3. **Alternative trigger**: Enough tokens AND not currently compacting

### The Extraction Agent (nF7)

```javascript
// ============================================
// sessionMemoryExtractor - Background agent that updates summary
// Location: chunks.144.mjs:2547-2586
// ============================================

// ORIGINAL (for source lookup):
nF7 = ev(async function (A) {
  let {
    messages: Q,
    toolUseContext: B,
    querySource: G
  } = A;
  if (G !== "repl_main_thread") return;
  if (!lF7(Q)) return;
  Is2();
  let Z = lkA(B),
    {
      memoryPath: Y,
      currentMemory: J
    } = await iF7(Z),
    X = await Ms2(J, Y);
  await sc({
    promptMessages: [H0({
      content: X
    })],
    cacheSafeParams: T3A(A),
    canUseTool: aF7(Y),
    querySource: "session_memory",
    forkLabel: "session_memory",
    overrides: {
      readFileState: Z.readFileState
    }
  });
  let I = Q[Q.length - 1],
    D = I ? Jd(I) : void 0,
    W = Fs2();
  l("tengu_session_memory_extraction", {
    input_tokens: D?.input_tokens,
    output_tokens: D?.output_tokens,
    cache_read_input_tokens: D?.cache_read_input_tokens ?? void 0,
    cache_creation_input_tokens: D?.cache_creation_input_tokens ?? void 0,
    config_min_message_tokens_to_init: W.minimumMessageTokensToInit,
    config_min_tokens_between_update: W.minimumTokensBetweenUpdate,
    config_tool_calls_between_updates: W.toolCallsBetweenUpdates
  }), zs2(), oF7(Q), Ds2()
})

// READABLE (for understanding):
const sessionMemoryExtractor = debounced(async function(params) {
  const { messages, toolUseContext, querySource } = params;

  // CRITICAL: Only run for main REPL thread, not subagents
  if (querySource !== "repl_main_thread") return;

  // Check extraction trigger conditions
  if (!shouldTriggerExtraction(messages)) return;

  // Mark extraction in progress (prevents concurrent extractions)
  markSessionMemoryUpdateStart();  // Is2()

  // Get context for file operations
  const context = createToolContext(toolUseContext);

  // Read or initialize the memory file
  const { memoryPath, currentMemory } = await readOrInitializeMemoryFile(context);

  // Build the extraction prompt (includes current memory + instructions)
  const extractionPrompt = await buildExtractionPrompt(currentMemory, memoryPath);

  // SPAWN FORKED SUBAGENT - This is the LLM call!
  await forkSubagent({
    promptMessages: [createUserMessage({ content: extractionPrompt })],
    cacheSafeParams: extractCacheSafeParams(params),
    canUseTool: createToolRestrictor(memoryPath),  // ONLY Edit tool on summary.md allowed!
    querySource: "session_memory",
    forkLabel: "session_memory",
    overrides: {
      readFileState: context.readFileState
    }
  });

  // Log telemetry
  const lastMessage = messages[messages.length - 1];
  const usage = lastMessage ? extractUsageStats(lastMessage) : undefined;
  const config = getSessionMemoryConfig();
  logTelemetry("tengu_session_memory_extraction", {
    input_tokens: usage?.input_tokens,
    output_tokens: usage?.output_tokens,
    cache_read_input_tokens: usage?.cache_read_input_tokens ?? undefined,
    cache_creation_input_tokens: usage?.cache_creation_input_tokens ?? undefined,
    config_min_message_tokens_to_init: config.minimumMessageTokensToInit,
    config_min_tokens_between_update: config.minimumTokensBetweenUpdate,
    config_tool_calls_between_updates: config.toolCallsBetweenUpdates
  });

  // Reset token accumulator for next extraction cycle
  resetTokenAccumulator();  // zs2()

  // Track which message was last summarized
  updateLastSummarizedId(messages);  // oF7()

  // Mark extraction complete
  markSessionMemoryUpdateEnd();  // Ds2()
});

// Mapping: nF7→sessionMemoryExtractor, ev→debounced, G→querySource, lF7→shouldTriggerExtraction,
//          Is2→markSessionMemoryUpdateStart, lkA→createToolContext, iF7→readOrInitializeMemoryFile,
//          Ms2→buildExtractionPrompt, sc→forkSubagent, H0→createUserMessage, T3A→extractCacheSafeParams,
//          aF7→createToolRestrictor, Jd→extractUsageStats, Fs2→getSessionMemoryConfig,
//          l→logTelemetry, zs2→resetTokenAccumulator, oF7→updateLastSummarizedId, Ds2→markSessionMemoryUpdateEnd
```

### Tool Permission Restriction

The forked agent can ONLY use the Edit tool on the summary.md file:

```javascript
// ============================================
// createToolRestrictor - Restrict forked agent to only Edit on summary.md
// Location: chunks.144.mjs:2498-2514
// ============================================

// ORIGINAL (for source lookup):
function aF7(A) {
  return async (Q, B) => {
    if (Q.name === I8 && typeof B === "object" && B !== null && "file_path" in B) {
      if (B.file_path === A) return {
        behavior: "allow",
        updatedInput: B
      }
    }
    return {
      behavior: "deny",
      message: `only ${I8} on ${A} is allowed`,
      decisionReason: {
        type: "other",
        reason: `only ${I8} on ${A} is allowed`
      }
    }
  }
}

// READABLE (for understanding):
function createToolRestrictor(allowedFilePath) {
  return async (toolCall, input) => {
    // Only allow Edit tool
    if (toolCall.name === "Edit" &&
        typeof input === "object" &&
        input !== null &&
        "file_path" in input) {
      // Only allow editing the specific summary file
      if (input.file_path === allowedFilePath) {
        return {
          behavior: "allow",
          updatedInput: input
        };
      }
    }

    // Deny everything else
    return {
      behavior: "deny",
      message: `only Edit on ${allowedFilePath} is allowed`,
      decisionReason: {
        type: "other",
        reason: `only Edit on ${allowedFilePath} is allowed`
      }
    };
  };
}

// Mapping: aF7→createToolRestrictor, A→allowedFilePath, I8→"Edit"
```

### Memory File Initialization

```javascript
// ============================================
// readOrInitializeMemoryFile - Read existing or create new memory file
// Location: chunks.144.mjs:2458-2483
// ============================================

// ORIGINAL (for source lookup):
async function iF7(A) {
  let Q = vA(),
    B = lz1();
  if (!Q.existsSync(B)) Q.mkdirSync(B, {
    mode: 448
  });
  let G = VhA();
  if (!Q.existsSync(G)) {
    let X = await vL0();
    bB(G, X, {
      encoding: "utf-8",
      flush: !1,
      mode: 384
    })
  }
  let Z = await v5.call({
      file_path: G
    }, A),
    Y = "",
    J = Z.data;
  if (J.type === "text") Y = J.file.content;
  return {
    memoryPath: G,
    currentMemory: Y
  }
}

// READABLE (for understanding):
async function readOrInitializeMemoryFile(context) {
  const fs = getFileSystem();
  const sessionMemoryDir = getSessionMemoryDir();  // ~/.claude/<session>/session-memory/

  // Create directory if not exists
  if (!fs.existsSync(sessionMemoryDir)) {
    fs.mkdirSync(sessionMemoryDir, { mode: 0o700 });  // 448 = 0o700
  }

  const summaryPath = getSummaryFilePath();  // ~/.claude/<session>/session-memory/summary.md

  // Initialize with default template if not exists
  if (!fs.existsSync(summaryPath)) {
    const defaultTemplate = await getDefaultTemplate();
    writeFileSync(summaryPath, defaultTemplate, {
      encoding: "utf-8",
      flush: false,
      mode: 0o600  // 384 = 0o600
    });
  }

  // Read current content using Read tool
  const readResult = await ReadTool.call({ file_path: summaryPath }, context);
  let currentMemory = "";
  const data = readResult.data;
  if (data.type === "text") {
    currentMemory = data.file.content;
  }

  return {
    memoryPath: summaryPath,
    currentMemory
  };
}

// Mapping: iF7→readOrInitializeMemoryFile, vA→getFileSystem, lz1→getSessionMemoryDir,
//          VhA→getSummaryFilePath, vL0→getDefaultTemplate, bB→writeFileSync, v5→ReadTool
```

---

## Phase 2: Session Memory Compact

When auto-compact triggers, Session Memory Compact reads the pre-computed summary:

```javascript
// ============================================
// sessionMemoryCompact - Use cached summary (no LLM call)
// Location: chunks.132.mjs:1392-1422
// ============================================

// See implementation.md for full code

// Key points:
// 1. Check if Session Memory Compact is enabled (feature flags)
// 2. Wait for any pending background extraction to complete
// 3. Read cached summary from summary.md
// 4. Find messages AFTER lastSummarizedId (these are "recent" messages)
// 5. Return: cached_summary + recent_messages
// 6. NO LLM CALL!
```

### The lastSummarizedId Tracking

```javascript
// ============================================
// updateLastSummarizedId - Track which message was last included in summary
// Location: chunks.144.mjs:2517-2522
// ============================================

// ORIGINAL (for source lookup):
function oF7(A) {
  if (!DuA(A)) {
    let Q = A[A.length - 1];
    if (Q?.uuid) oEA(Q.uuid)
  }
}

// READABLE (for understanding):
function updateLastSummarizedId(messages) {
  // Don't update if currently compacting (avoid race conditions)
  if (!isCurrentlyCompacting(messages)) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.uuid) {
      setLastSummarizedId(lastMessage.uuid);  // oEA()
    }
  }
}

// Mapping: oF7→updateLastSummarizedId, DuA→isCurrentlyCompacting, oEA→setLastSummarizedId
```

---

## Timeline Visualization

```
═══════════════════════════════════════════════════════════════════════════════
                           NORMAL CONVERSATION FLOW
═══════════════════════════════════════════════════════════════════════════════

Time ──────────────────────────────────────────────────────────────────────────►

User    Asst    User    Tools...  Asst    User    Tools...  Asst    User
 [1]     [2]     [3]     [4-8]     [9]    [10]    [11-15]   [16]    [17]
  │                                  │                        │
  │                                  │                        │
  ▼                                  ▼                        ▼
┌──────────────┐           ┌──────────────────┐     ┌──────────────────┐
│ Background   │           │ EXTRACTION       │     │ EXTRACTION       │
│ Check:       │           │ TRIGGERS!        │     │ TRIGGERS!        │
│ - 2000 tokens│           │ - 5000+ tokens   │     │ - 5000+ tokens   │
│ - Skip       │           │ - 10+ tool calls │     │ - 10+ tool calls │
└──────────────┘           └────────┬─────────┘     └────────┬─────────┘
                                    │                        │
                                    ▼                        ▼
                           ┌──────────────────┐     ┌──────────────────┐
                           │ Forked Agent:    │     │ Forked Agent:    │
                           │ (LLM Call)       │     │ (LLM Call)       │
                           │ Read summary.md  │     │ Read summary.md  │
                           │ Update with 1-9  │     │ Update with 1-16 │
                           │ Write summary.md │     │ Write summary.md │
                           │ lastSummarizedId │     │ lastSummarizedId │
                           │   = msg[9].uuid  │     │   = msg[16].uuid │
                           └──────────────────┘     └──────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                           AUTO-COMPACT TRIGGERED
═══════════════════════════════════════════════════════════════════════════════

... many more messages, context threshold exceeded ...

Messages: [1] [2] [3] ... [16] [17] [18] [19] ... [50]  ← THRESHOLD HIT!
                           │
                           │ lastSummarizedId = msg[16].uuid
                           │ summary.md contains summary of msgs 1-16
                           │
                           ▼
          ┌────────────────────────────────────────────────┐
          │         SESSION MEMORY COMPACT                  │
          │         ─────────────────────────               │
          │  1. Read summary.md (contains msgs 1-16)        │
          │  2. Find lastSummarizedId = msg[16].uuid        │
          │  3. Keep messages 17-50 (not yet summarized)    │
          │  4. Return: [summary of 1-16] + [msgs 17-50]    │
          │                                                  │
          │  ★ NO NEW LLM CALL! Uses cached summary! ★      │
          └────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                           POST-COMPACTION STATE
═══════════════════════════════════════════════════════════════════════════════

New conversation state:
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Boundary Marker]                                                            │
│ [Summary Message: "# Session Title... (summary of msgs 1-16)"]              │
│ [Message 17]                                                                 │
│ [Message 18]                                                                 │
│ ...                                                                          │
│ [Message 50]                                                                 │
│ [Restored Files/Todos/Plans]                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Comparison: Session Memory vs Full Compact

| Aspect | Session Memory Compact | Full Compact |
|--------|----------------------|--------------|
| **When LLM called** | During conversation (background) | At compaction time |
| **Compact latency** | Instant (read file) | Seconds (streaming) |
| **Token cost at compact** | 0 | High (summarize everything) |
| **Summary freshness** | Possibly stale by a few messages | Always current |
| **Failure handling** | Falls through to Full Compact | Error notification |
| **Feature flag** | Required (`tengu_session_memory` + `tengu_sm_compact`) | Always available |

---

## Key Functions Summary

| Function | Obfuscated | Phase | Purpose | Location |
|----------|------------|-------|---------|----------|
| shouldTriggerExtraction | lF7 | 1 | Check if background extraction should run | chunks.144.mjs:2434 |
| sessionMemoryExtractor | nF7 | 1 | Background agent that updates summary | chunks.144.mjs:2547 |
| readOrInitializeMemoryFile | iF7 | 1 | Read/create summary.md | chunks.144.mjs:2458 |
| createToolRestrictor | aF7 | 1 | Restrict agent to Edit on summary.md | chunks.144.mjs:2498 |
| updateLastSummarizedId | oF7 | 1 | Track last summarized message | chunks.144.mjs:2517 |
| sessionMemoryCompact | sF1 | 2 | Use cached summary for compact | chunks.132.mjs:1392 |
| waitForPendingSessionMemoryUpdate | Ws2 | 2 | Wait for extraction to complete | chunks.132.mjs (dispatcher) |
| setLastSummarizedId | oEA | Both | Set/clear the tracking ID | chunks.132.mjs:1525 |

---

## State Variables

```javascript
// Background extraction state (chunks.144.mjs)
hG9 = undefined;  // lastTriggeredMessageId - Last message that triggered extraction
gG9 = undefined;  // lastProcessedAssistantId - Last assistant message processed

// Session memory compact state (chunks.132.mjs via dispatcher.ts)
lastSummarizedId = undefined;           // Tracks which message was last summarized
pendingSessionMemoryUpdateStartedAt;    // Timestamp when extraction started

// Timeouts
SESSION_MEMORY_WAIT_TIMEOUT_MS = 15000; // q97 - Max wait for pending extraction
SESSION_MEMORY_STALE_UPDATE_MS = 60000; // N97 - Consider extraction stale after this
```

---

## Why This Design?

### Benefits

1. **Cost Amortization**: LLM calls for summarization happen incrementally during conversation, not all at once when compaction is needed

2. **Latency Reduction**: When compaction triggers (critical path), the summary is already computed - just read a file

3. **Graceful Degradation**: If background extraction fails or is disabled, Full Compact still works as fallback

4. **Incremental Updates**: Each extraction builds on the previous summary, maintaining context continuity

### Trade-offs

1. **Staleness**: Summary may be behind by several messages (gap between lastSummarizedId and current)

2. **Complexity**: Two-phase system is more complex than direct summarization

3. **Resource Usage**: Background LLM calls consume tokens even when compaction may not be needed

4. **Feature Flag Dependency**: Requires both `tengu_session_memory` and `tengu_sm_compact` flags

---

## Telemetry Events

| Event | When Fired | Key Fields |
|-------|------------|------------|
| `tengu_session_memory_extraction` | After background extraction | input_tokens, output_tokens, config values |
| `tengu_sm_compact_empty_template` | Template has no content | - |
| `tengu_sm_compact_summarized_id_not_found` | lastSummarizedId not in messages | - |
| `tengu_sm_compact_resumed_session` | No previous extraction found | - |
| `tengu_sm_compact_threshold_exceeded` | Post-compact still too large | postCompactTokenCount, autoCompactThreshold |
