# Compact Integration - Subagent Token Management (Claude Code 2.1.38)

> Deep analysis of how compaction is triggered and handled within subagent execution

---

## Table of Contents

1. [Overview](#overview)
2. [Token Counting in Subagent Loop](#token-counting-in-subagent-loop)
3. [Compaction Trigger](#compaction-trigger)
4. [In-Process Teammate Compaction](#in-process-teammate-compaction)
5. [File Read Tracking Isolation](#file-read-tracking-isolation)
6. [Cross-References](#cross-references)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Compact section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `agentLoopRunner` (dR) - Core agent loop that contains compaction trigger logic
- `autoCompactDispatcher` (fs4) - Top-level auto-compaction orchestrator
- `performSessionMemoryCompaction` (vZ6) - Session memory-based compaction
- `performFullCompaction` (AW1) - Standard LLM-based compaction
- `inProcessAgentRunner` (GVY) - Teammate runner with integrated compaction
- `estimateTokenCount` (PU1) - Token counting function
- `shouldAutoCompact` - Determines if compaction is needed

---

## 1. Overview

Subagents face the same token pressure as the main session - conversation history grows with each turn, eventually approaching the model's context window limit. The compaction system must handle this within the subagent's execution context.

**Key differences from main session compaction:**

| Aspect | Main Session | Subagent |
|--------|--------------|----------|
| Trigger point | After each LLM turn | After each tool execution in agent loop |
| Token counting | Full message history | Subagent's message array only |
| Session memory | Available | Only if enabled and configured |
| File read tracking | Single `readFileState` | Cloned per subagent |
| Hook execution | Full hook system | Subagent-aware hooks |

---

## 2. Token Counting in Subagent Loop

### Where Tokens Are Counted

The `agentLoopRunner` (dR) contains the compaction trigger logic:

```javascript
// ============================================
// Token counting location in agentLoopRunner
// Location: chunks.130.mjs:2020-2035
// ============================================

// Within the main execution loop, before each LLM call:
// ORIGINAL (for source lookup):
let X = PU1(N);

// READABLE (for understanding):
let currentTokenCount = estimateTokenCount(messages);

// Mapping: X->currentTokenCount, PU1->estimateTokenCount, N->messages
```

### Token Counting Mechanism

The `estimateTokenCount` function uses a tokenizer to count tokens in the message array:

```javascript
// ============================================
// estimateTokenCount - Count tokens in messages
// Location: chunks.147.mjs:296-320
// ============================================

// The function:
// 1. Serializes messages to the format sent to the API
// 2. Uses the tiktoken library (or approximation) to count tokens
// 3. Returns the total token count

// This includes:
// - System prompt tokens
// - User message tokens
// - Assistant message tokens (including thinking blocks)
// - Tool use/result tokens
```

### Token Threshold Values

```javascript
// Threshold values used in compaction decisions:
// These are model-dependent but typically:

const COMPACT_THRESHOLDS = {
    // Trigger compaction when tokens exceed this percentage of model limit
    autoCompactRatio: 0.8,  // 80% of model limit

    // Minimum tokens to keep after compaction
    minTokensAfterCompaction: 10000,

    // Maximum tokens to keep after compaction
    maxTokensAfterCompaction: 40000,

    // Session memory compaction thresholds
    sessionMemoryMinTokens: 10000,
    sessionMemoryMaxTokens: 40000,
    sessionMemoryMinTextBlockMessages: 5
};
```

---

## 3. Compaction Trigger

### Call Site in Agent Loop

```javascript
// ============================================
// Compaction trigger in agentLoopRunner
// Location: chunks.130.mjs:2020-2040
// ============================================

// ORIGINAL (for source lookup):
// Within the main execution flow:

// READABLE (for understanding):
async function* agentLoopRunner(config) {
    // ... initialization ...

    // Main execution loop
    while (!abortController.signal.aborted) {
        // Check token count
        let currentTokens = estimateTokenCount(messages);

        // Check if compaction is needed
        if (await shouldAutoCompact(messages, model, sessionMemoryType)) {
            let compactResult = await autoCompactDispatcher(
                messages,
                sessionContext,
                sessionMemoryType
            );

            if (compactResult.wasCompacted) {
                messages = compactResult.compactionResult.messages;
                // Record compaction event
            }
        }

        // ... continue with LLM call ...
    }
}
```

### `shouldAutoCompact` Decision Logic

```javascript
// ============================================
// shouldAutoCompact - Determine if compaction is needed
// Location: chunks.107.mjs (referenced)
// ============================================

// READABLE (for understanding):
async function shouldAutoCompact(messages, model, sessionMemoryType) {
    // 1. Check if compaction is disabled
    if (parseBoolean(process.env.DISABLE_COMPACT)) return false;

    // 2. Get token limit for the model
    let modelLimit = getModelTokenLimit(model);
    let threshold = modelLimit * 0.8; // 80% threshold

    // 3. Count current tokens
    let currentTokens = estimateTokenCount(messages);

    // 4. Return true if exceeding threshold
    return currentTokens >= threshold;
}
```

### `autoCompactDispatcher` Flow

```javascript
// ============================================
// autoCompactDispatcher - Top-level compaction orchestrator
// Location: chunks.147.mjs:778-820
// ============================================

// ORIGINAL (for source lookup):
async function fs4(A, Q, B) {
    if (Y0(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };
    // ... compaction logic
}

// READABLE (for understanding):
async function autoCompactDispatcher(messages, sessionContext, sessionMemoryType) {
    // 1. Check for disabled compaction
    if (parseBoolean(process.env.DISABLE_COMPACT)) {
        return { wasCompacted: false };
    }

    // 2. Try session memory compaction first (if available)
    if (sessionMemoryType === "session_memory") {
        let smResult = await performSessionMemoryCompaction(messages, sessionContext.agentId);
        if (smResult) {
            return { wasCompacted: true, compactionResult: smResult };
        }
    }

    // 3. Fall back to standard LLM-based compaction
    try {
        let standardResult = await performFullCompaction(messages, sessionContext);
        return { wasCompacted: true, compactionResult: standardResult };
    } catch (err) {
        return { wasCompacted: false };
    }
}

// Mapping: fs4->autoCompactDispatcher, A->messages, Q->sessionContext, B->sessionMemoryType
```

### `sessionMemoryType` Parameter Behavior

The `sessionMemoryType` parameter controls which compaction path is attempted:

| Value | Compaction Path | Notes |
|-------|-----------------|-------|
| `"session_memory"` | Session memory first, then standard | Requires enabled session memory feature |
| `"standard"` | Standard LLM-based only | Always available |
| `undefined` | Standard LLM-based only | Default behavior |

---

## 4. In-Process Teammate Compaction

### `inProcessAgentRunner` (GVY) Compaction

In-process teammates run a more complex loop that includes compaction:

```javascript
// ============================================
// Compaction in inProcessAgentRunner
// Location: chunks.131.mjs:348-450
// ============================================

// ORIGINAL (for source lookup):
async function GVY(A) {
    // ... initialization ...

    while (!abortController.signal.aborted) {
        // Create per-round abort controller
        let workAbortController = new AbortController();

        // Check token count and compact if needed
        let tokenCount = PU1(messages);
        if (tokenCount > getCompactionThreshold()) {
            let compacted = await AW1(messages, context);
            messages = compacted.messages;
        }

        // Run agent loop
        for await (let msg of dR({ ... })) {
            // ... collect messages
        }

        // Mark idle, poll for next message
        // ...
    }
}

// READABLE (for understanding):
async function inProcessAgentRunner(config) {
    // ... initialization ...

    // Main teammate loop
    while (!abortController.signal.aborted) {
        // Create per-round abort controller for this work item
        let workAbortController = new AbortController();

        // Check if compaction is needed
        let tokenCount = estimateTokenCount(messages);
        if (tokenCount > getCompactionThreshold()) {
            // Perform compaction
            let compactResult = await performFullCompaction(messages, teammateContext);
            if (compactResult) {
                messages = compactResult.messages;
            }
        }

        // Run the agent loop for this round
        for await (let message of agentLoopRunner({ ... })) {
            // Collect messages and update state
        }

        // Broadcast idle status
        // Poll for next message (WVY)
        // Handle incoming messages
    }
}

// Mapping: GVY->inProcessAgentRunner, PU1->estimateTokenCount, AW1->performFullCompaction,
//          dR->agentLoopRunner, WVY->pollForNextMessage
```

### Different Handling for Teammates

In-process teammates have unique compaction considerations:

| Consideration | Handling |
|---------------|----------|
| Long-running sessions | Compaction happens between work items, not during |
| Preserved context | Keep mailbox messages, team configuration |
| Session notes | Teammate may have its own session memory |
| Cleanup on shutdown | Preserved transcript for resume |

---

## 5. File Read Tracking Isolation

### Why Isolation is Needed

Each subagent needs its own `readFileState` for proper file operation tracking:

```javascript
// ============================================
// readFileState cloning for isolation
// Location: chunks.130.mjs:2076-2078
// ============================================

// ORIGINAL (for source lookup):
let T = new Map(K.readFileState);

// READABLE (for understanding):
let clonedReadFileState = new Map(parentToolUseContext.readFileState);

// Mapping: T->clonedReadFileState, K->parentToolUseContext
```

### Problems Without Isolation

**Scenario 1: False concurrent edit detection**
1. Parent reads `config.json`
2. Parent spawns subagent to analyze `config.json`
3. Subagent reads `config.json` → if sharing state, this looks like concurrent read
4. Parent tries to edit `config.json` → falsely warned about concurrent modification

**Scenario 2: Lost file tracking**
1. Subagent reads many files during its task
2. Subagent completes and exits
3. If sharing state, parent now has "stale" reads recorded
4. Parent might skip re-reading files it needs

### Isolated State Benefits

| Benefit | Explanation |
|---------|-------------|
| Accurate concurrent edit detection | Each agent tracks only its own reads |
| Independent operation | Subagent can read files without affecting parent |
| Clean resume | Transcript contains accurate per-agent state |
| Proper cleanup | Subagent state is discarded when subagent exits |

### How Isolation Works in Compaction

During compaction, file read state is preserved differently:

```javascript
// ============================================
// File read state preservation during compaction
// Location: chunks.107.mjs (referenced)
// ============================================

// During compaction, the system:
// 1. Collects files to keep (recently read, referenced in plan, etc.)
// 2. Preserves those in the compacted context
// 3. Does NOT modify readFileState directly

// After compaction:
// - readFileState still tracks what the agent has read
// - Compaction only affects message history, not file tracking state
```

---

## 6. Cross-References

### Related Documentation

- **[../07_compact/session_memory_compaction.md](../07_compact/session_memory_compaction.md)** - Session memory compaction deep dive
- **[tools_integration.md](./tools_integration.md)** - How readFileState is cloned for subagents
- **[execution_flow_deep_dive.md](./execution_flow_deep_dive.md)** - Agent loop execution details
- **[transcript_and_resume_system.md](./transcript_and_resume_system.md)** - How transcripts handle compacted history

### Symbol References

| Symbol | Location | Description |
|--------|----------|-------------|
| `dR` | chunks.130.mjs:1961 | Agent loop runner with compaction trigger |
| `fs4` | chunks.147.mjs:778 | Auto-compact dispatcher |
| `vZ6` | chunks.147.mjs:651 | Session memory compaction |
| `AW1` | chunks.146.mjs:2325 | Full (LLM-based) compaction |
| `GVY` | chunks.131.mjs:348 | In-process teammate runner |
| `PU1` | chunks.147.mjs:296 | Token estimation function |

---

## Summary

Subagent compaction follows the same principles as main session compaction but with key adaptations:

1. **Integrated trigger** - Compaction check happens within the agent loop before each LLM turn
2. **Session memory priority** - When available, session memory compaction is preferred (no LLM call needed)
3. **Teammate handling** - In-process teammates compact between work items, preserving team context
4. **File state isolation** - Each subagent has independent `readFileState`, unaffected by compaction
5. **Transcript continuity** - Compaction results are recorded to the transcript for resume support

This design ensures subagents can handle long-running tasks without running out of context, while maintaining proper isolation from parent state.