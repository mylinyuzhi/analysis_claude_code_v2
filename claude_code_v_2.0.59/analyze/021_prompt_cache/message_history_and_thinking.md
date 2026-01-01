# Message History and Thinking Blocks

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

## Executive Summary

This document covers how Claude Code handles message history when communicating with the Claude LLM API, with special focus on:
- **Thinking blocks** and their **signatures**
- **Ultrathink mode** (extended reasoning)
- **Compaction behavior** and thinking block preservation

---

## 1. Message History Structure

### API Endpoint and Request Flow

Claude Code sends message history to the Claude API via the `/v1/messages` endpoint using streaming:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Message Flow to Claude API                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User/Assistant Messages                                                     │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────┐                                                         │
│  │ Normalization   │◄── WZ() function                                        │
│  │ (WZ)            │    - Deep clone messages                                │
│  └────────┬────────┘    - Filter trailing thinking blocks                   │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                         │
│  │ Cache Control   │◄── mv3() function                                       │
│  │ Application     │    - Add cache_control to last 2 messages              │
│  └────────┬────────┘    - Exclude thinking blocks from cache                │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         API Request Payload                          │    │
│  │  {                                                                   │    │
│  │    model: "claude-sonnet-4-...",                                     │    │
│  │    system: [...],                                                    │    │
│  │    messages: [                                                       │    │
│  │      { role: "user", content: [...] },                              │    │
│  │      { role: "assistant", content: [                                │    │
│  │        { type: "thinking", thinking: "...", signature: "..." },     │    │
│  │        { type: "text", text: "..." }                                │    │
│  │      ]},                                                             │    │
│  │      ...                                                             │    │
│  │    ],                                                                │    │
│  │    thinking: { budget_tokens: 31999, type: "enabled" },             │    │
│  │    max_tokens: ...                                                   │    │
│  │  }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                         │
│  │ POST /v1/messages│                                                        │
│  │ (streaming)     │                                                         │
│  └─────────────────┘                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Message Format

Each message follows the Anthropic API structure:

```javascript
{
  role: "user" | "assistant",
  content: ContentBlock[]  // Array of content blocks
}
```

### Content Block Types

| Block Type | Description | Included in API? |
|------------|-------------|------------------|
| `text` | Regular text content | Yes |
| `thinking` | Extended thinking content with signature | Yes |
| `redacted_thinking` | Redacted thinking (privacy) | Yes |
| `tool_use` | Tool invocation request | Yes |
| `tool_result` | Tool execution result | Yes |

**Key insight:** All content block types, including `thinking` and `redacted_thinking`, ARE included in the message history sent to Claude API. Only `cache_control` is excluded from thinking blocks.

---

## 2. Thinking Block Architecture

### Block Structure

A thinking block has the following structure:

```javascript
{
  type: "thinking",
  thinking: "The detailed reasoning content...",
  signature: "base64-encoded-signature..."  // Added after streaming completes
}
```

### Signature Field

The `signature` is a cryptographic field on thinking blocks:

**How it arrives:**
1. During streaming, thinking content arrives via `thinking_delta` events
2. After thinking content completes, the `signature_delta` event provides the signature
3. Signature is accumulated on the block: `block.signature = delta.signature`

```javascript
// ============================================
// Signature handling during streaming
// Location: chunks.153.mjs:185-191
// ============================================

// ORIGINAL (for source lookup):
case "signature_delta":
  if (FA.type !== "thinking") throw GA("tengu_streaming_error", {
    error_type: "content_block_type_mismatch_thinking_signature",
    expected_type: "thinking",
    actual_type: FA.type
  }), Error("Content block is not a thinking block");
  FA.signature = IA.delta.signature;
  break;

// READABLE (for understanding):
case "signature_delta":
  if (currentBlock.type !== "thinking") {
    throw new Error("Content block is not a thinking block");
  }
  // Assign the signature to the thinking block
  currentBlock.signature = event.delta.signature;
  break;

// Mapping: FA→currentBlock, IA→event
```

**Purpose of signature:**
- Cryptographic verification of thinking content
- Ensures thinking content integrity
- Part of Anthropic's safety mechanisms

### Thinking Blocks in Message History

**Critical finding:** Thinking blocks ARE included when sending messages to Claude API.

```javascript
// ============================================
// formatAssistantMessageWithCache - Includes thinking blocks in content
// Location: chunks.152.mjs:2793-2817
// ============================================

// ORIGINAL (for source lookup):
function uv3(A, Q = !1, B) {
  if (Q)
    // ... (cache window handling)
    else return {
      role: "assistant",
      content: A.message.content.map((G, Z) => ({
        ...G,  // Includes thinking blocks!
        // Only cache_control is excluded from thinking/redacted_thinking
        ...Z === A.message.content.length - 1 && G.type !== "thinking" && G.type !== "redacted_thinking" ? B ? {
          cache_control: jSA()
        } : {} : {}
      }))
    };
  // ...
}

// READABLE (for understanding):
function formatAssistantMessageWithCache(normalizedMessage, isInCacheWindow, cachingEnabled) {
  if (isInCacheWindow) {
    return {
      role: "assistant",
      content: normalizedMessage.message.content.map((block, index) => ({
        ...block,  // All blocks including thinking are preserved!
        // cache_control only added to non-thinking blocks
        ...(index === content.length - 1 &&
            block.type !== "thinking" &&
            block.type !== "redacted_thinking"
          ? (cachingEnabled ? { cache_control: buildCacheControlObject() } : {})
          : {})
      }))
    };
  }
  // Return as-is for non-cache-window messages
  return { role: "assistant", content: normalizedMessage.message.content };
}

// Mapping: uv3→formatAssistantMessageWithCache, A→normalizedMessage, Q→isInCacheWindow, B→cachingEnabled
```

---

## 3. Thinking Block Filtering

### Trailing Block Removal (xb3)

Before sending to API, the `xb3()` function removes only **trailing** thinking blocks from the **last** assistant message:

```javascript
// ============================================
// filterTrailingThinkingBlocks - Remove trailing thinking from final message
// Location: chunks.154.mjs:499-529
// ============================================

// ORIGINAL (for source lookup):
function xb3(A) {
  let Q = A[A.length - 1];
  if (!Q || Q.type !== "assistant") return A;
  let B = Q.message.content,
    G = B[B.length - 1];
  if (!G || !pE9(G)) return A;
  let Z = B.length - 1;
  while (Z >= 0) {
    let J = B[Z];
    if (!J || !pE9(J)) break;
    Z--
  }
  GA("tengu_filtered_trailing_thinking_block", {
    messageUUID: Q.uuid,
    blocksRemoved: B.length - Z - 1,
    remainingBlocks: Z + 1
  });
  let I = Z < 0 ? [{
      type: "text",
      text: "[No message content]",
      citations: []
    }] : B.slice(0, Z + 1),
    Y = [...A];
  return Y[A.length - 1] = {
    ...Q,
    message: {
      ...Q.message,
      content: I
    }
  }, Y
}

// READABLE (for understanding):
function filterTrailingThinkingBlocks(messages) {
  let lastMessage = messages[messages.length - 1];

  // Only process assistant messages
  if (!lastMessage || lastMessage.type !== "assistant") return messages;

  let contentBlocks = lastMessage.message.content;
  let lastBlock = contentBlocks[contentBlocks.length - 1];

  // If last block is not thinking, no filtering needed
  if (!lastBlock || !isThinkingBlock(lastBlock)) return messages;

  // Find last non-thinking block index
  let lastNonThinkingIndex = contentBlocks.length - 1;
  while (lastNonThinkingIndex >= 0) {
    let block = contentBlocks[lastNonThinkingIndex];
    if (!block || !isThinkingBlock(block)) break;
    lastNonThinkingIndex--;
  }

  // Log telemetry
  trackEvent("tengu_filtered_trailing_thinking_block", {
    messageUUID: lastMessage.uuid,
    blocksRemoved: contentBlocks.length - lastNonThinkingIndex - 1,
    remainingBlocks: lastNonThinkingIndex + 1
  });

  // Build filtered content
  let filteredContent = lastNonThinkingIndex < 0
    ? [{ type: "text", text: "[No message content]", citations: [] }]  // All thinking case
    : contentBlocks.slice(0, lastNonThinkingIndex + 1);

  // Return updated messages array
  let updatedMessages = [...messages];
  updatedMessages[messages.length - 1] = {
    ...lastMessage,
    message: { ...lastMessage.message, content: filteredContent }
  };
  return updatedMessages;
}

// Mapping: xb3→filterTrailingThinkingBlocks, A→messages, Q→lastMessage, B→contentBlocks, pE9→isThinkingBlock
```

### Thinking Block Detection

```javascript
// ============================================
// isThinkingBlock - Check if block is thinking type
// Location: chunks.154.mjs:495-496
// ============================================

// ORIGINAL (for source lookup):
function pE9(A) {
  return A.type === "thinking" || A.type === "redacted_thinking"
}

// READABLE (for understanding):
function isThinkingBlock(block) {
  return block.type === "thinking" || block.type === "redacted_thinking"
}

// Mapping: pE9→isThinkingBlock, A→block
```

### Filtering Behavior Summary

```
Message with content blocks: [thinking, text, tool_use, thinking, thinking]
                                                         ↑       ↑
                                              Trailing thinking blocks
After xb3(): [thinking, text, tool_use]
              ↑
              This thinking block is PRESERVED (not trailing)
```

**Key insight:** Only trailing thinking blocks are removed. Non-trailing thinking blocks in the conversation history are preserved and sent to the API.

---

## 4. Ultrathink Mode

### What is Ultrathink?

Ultrathink is an extended reasoning mode that allocates a larger thinking token budget (31,999 tokens) for complex tasks.

### Trigger Keywords

Ultrathink is triggered by specific keywords in user messages:

```javascript
// ============================================
// isUltrathinkKeyword - Check for ultrathink trigger
// Location: chunks.70.mjs:2195-2198
// ============================================

// ORIGINAL (for source lookup):
function WrA(A) {
  let Q = A.toLowerCase();
  return Q === "ultrathink" || Q === "think ultra hard" || Q === "think ultrahard"
}

// READABLE (for understanding):
function isUltrathinkKeyword(text) {
  let lowerText = text.toLowerCase();
  return lowerText === "ultrathink" ||
         lowerText === "think ultra hard" ||
         lowerText === "think ultrahard"
}

// Mapping: WrA→isUltrathinkKeyword, A→text, Q→lowerText
```

**Trigger keywords (case-insensitive):**
- `ultrathink`
- `think ultra hard`
- `think ultrahard`

### Token Budget

```javascript
// ============================================
// THINKING_BUDGETS - Thinking token constants
// Location: chunks.70.mjs:2330-2333
// ============================================

// ORIGINAL (for source lookup):
zm1 = {
  ULTRATHINK: 31999,
  NONE: 0
}

// READABLE (for understanding):
const THINKING_BUDGETS = {
  ULTRATHINK: 31999,  // Maximum thinking tokens for ultrathink mode
  NONE: 0             // No thinking budget
}

// Mapping: zm1→THINKING_BUDGETS
```

### Budget Calculation

The thinking budget is calculated from all user messages:

```javascript
// ============================================
// calculateMaxThinkingBudget - Determine thinking token budget
// Location: chunks.70.mjs:2228-2238
// ============================================

// ORIGINAL (for source lookup):
function Xf(A, Q) {
  if (process.env.MAX_THINKING_TOKENS) {
    let B = parseInt(process.env.MAX_THINKING_TOKENS, 10);
    if (B > 0) GA("tengu_thinking", {
      provider: _R(),
      tokenCount: B
    });
    return B
  }
  return Math.max(...A.filter((B) => B.type === "user" && !B.isMeta).map(zU6), Q ?? 0)
}

// READABLE (for understanding):
function calculateMaxThinkingBudget(messages, defaultBudget) {
  // Check for environment variable override
  if (process.env.MAX_THINKING_TOKENS) {
    let tokenCount = parseInt(process.env.MAX_THINKING_TOKENS, 10);
    if (tokenCount > 0) {
      trackEvent("tengu_thinking", { provider: getProvider(), tokenCount });
    }
    return tokenCount;
  }

  // Calculate from messages: find max thinking tokens across all user messages
  return Math.max(
    ...messages
      .filter((msg) => msg.type === "user" && !msg.isMeta)
      .map(extractMessageThinkingTokens),
    defaultBudget ?? 0
  );
}

// Mapping: Xf→calculateMaxThinkingBudget, A→messages, Q→defaultBudget, zU6→extractMessageThinkingTokens
```

### Ultrathink Detection in Text

```javascript
// ============================================
// parseUltrathinkFromText - Detect ultrathink keyword in message text
// Location: chunks.70.mjs:2275-2281
// ============================================

// ORIGINAL (for source lookup):
function Ae(A) {
  let Q = /\bultrathink\b/i.test(A);
  return {
    tokens: Q ? zm1.ULTRATHINK : zm1.NONE,
    level: Q ? "high" : "none"
  }
}

// READABLE (for understanding):
function parseUltrathinkFromText(text) {
  let hasUltrathink = /\bultrathink\b/i.test(text);
  return {
    tokens: hasUltrathink ? THINKING_BUDGETS.ULTRATHINK : THINKING_BUDGETS.NONE,
    level: hasUltrathink ? "high" : "none"
  }
}

// Mapping: Ae→parseUltrathinkFromText, A→text, Q→hasUltrathink, zm1→THINKING_BUDGETS
```

### API Integration

When thinking budget > 0, the API request includes:

```javascript
// ============================================
// Thinking configuration in API request
// Location: chunks.153.mjs:52-55
// ============================================

// ORIGINAL (for source lookup):
let o = B > 0 ? {
  budget_tokens: k,
  type: "enabled"
} : void 0

// READABLE (for understanding):
let thinkingConfig = thinkingBudget > 0 ? {
  budget_tokens: adjustedBudget,  // Up to 31999 for ultrathink
  type: "enabled"
} : undefined;

// Mapping: o→thinkingConfig, B→thinkingBudget, k→adjustedBudget
```

### Environment Variable Override

You can override the thinking budget with:

```bash
MAX_THINKING_TOKENS=50000 claude
```

This bypasses keyword detection and sets a fixed budget.

---

## 5. Compaction Behavior

### Context Management During Compaction

When compaction occurs, thinking blocks can be preserved via API directives:

```javascript
// ============================================
// buildContextManagementEdits - Configure thinking preservation
// Location: chunks.60.mjs:392-445
// ============================================

// ORIGINAL (for source lookup):
function bCB(A) {
  let { hasThinking: Q = !1 } = A ?? {}, B = BZ("preserve_thinking", "enabled", !1);
  if (!B) return;
  // ... tool clearing logic ...
  if (B && Q) {
    let Y = { type: "clear_thinking_20251015", keep: "all" };
    I.push(Y)
  }
  return I.length > 0 ? { edits: I } : void 0
}

// READABLE (for understanding):
function buildContextManagementEdits(config) {
  let { hasThinking = false } = config ?? {};
  let preserveThinkingEnabled = getFeatureFlag("preserve_thinking", "enabled", false);

  if (!preserveThinkingEnabled) return undefined;

  let edits = [];

  // Preserve thinking blocks during compaction
  if (preserveThinkingEnabled && hasThinking) {
    let thinkingEdit = {
      type: "clear_thinking_20251015",
      keep: "all"  // Preserve all thinking content
    };
    edits.push(thinkingEdit);
  }

  return edits.length > 0 ? { edits } : undefined;
}

// Mapping: bCB→buildContextManagementEdits, A→config, Q→hasThinking, B→preserveThinkingEnabled
```

### Compaction Effects Summary

| Aspect | Behavior |
|--------|----------|
| **Thinking blocks** | Preserved when `preserve_thinking` flag enabled |
| **Signatures** | Follow same preservation as thinking blocks |
| **Budget reset** | Recalculated from compacted messages |
| **Ultrathink trigger** | Fresh budget if keyword appears in new messages |

### Context Management Directive

When thinking preservation is enabled, the API receives:

```javascript
{
  context_management: {
    edits: [
      { type: "clear_thinking_20251015", keep: "all" }
    ]
  }
}
```

This instructs Claude to preserve thinking content during context management operations.

---

## 6. Complete Message Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Complete Message History Flow                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [Conversation History]                                                      │
│      │                                                                       │
│      ├── Message 1: { role: "user", content: [...] }                        │
│      ├── Message 2: { role: "assistant", content: [                         │
│      │                 { type: "thinking", thinking: "...", signature: ""},  │
│      │                 { type: "text", text: "..." }                        │
│      │               ]}                                                      │
│      ├── Message 3: { role: "user", content: [..., "ultrathink"] }          │
│      └── ...                                                                 │
│           │                                                                  │
│           ▼                                                                  │
│      ┌────────────────────────────────────────┐                             │
│      │ 1. Calculate Thinking Budget           │                             │
│      │    - Scan for "ultrathink" keyword     │                             │
│      │    - Budget = 31,999 if found          │                             │
│      └────────────────────────────────────────┘                             │
│           │                                                                  │
│           ▼                                                                  │
│      ┌────────────────────────────────────────┐                             │
│      │ 2. Normalize Messages (WZ)             │                             │
│      │    - Deep clone messages               │                             │
│      │    - Call xb3() to filter trailing     │                             │
│      │      thinking from last message        │                             │
│      └────────────────────────────────────────┘                             │
│           │                                                                  │
│           ▼                                                                  │
│      ┌────────────────────────────────────────┐                             │
│      │ 3. Apply Cache Control (mv3)           │                             │
│      │    - Add cache_control to last 2 msgs  │                             │
│      │    - Skip thinking blocks for cache    │                             │
│      └────────────────────────────────────────┘                             │
│           │                                                                  │
│           ▼                                                                  │
│      ┌────────────────────────────────────────┐                             │
│      │ 4. Build API Request                   │                             │
│      │    {                                   │                             │
│      │      model: "...",                     │                             │
│      │      messages: [...],  // Includes     │                             │
│      │                        // thinking!    │                             │
│      │      thinking: {                       │                             │
│      │        budget_tokens: 31999,           │                             │
│      │        type: "enabled"                 │                             │
│      │      },                                │                             │
│      │      context_management: {...}         │                             │
│      │    }                                   │                             │
│      └────────────────────────────────────────┘                             │
│           │                                                                  │
│           ▼                                                                  │
│      ┌────────────────────────────────────────┐                             │
│      │ 5. Streaming Response                  │                             │
│      │    - content_block_start (thinking)    │                             │
│      │    - thinking_delta (content)          │                             │
│      │    - signature_delta (signature)       │                             │
│      │    - content_block_stop                │                             │
│      │    - content_block_start (text)        │                             │
│      │    - text_delta                        │                             │
│      │    - message_stop                      │                             │
│      └────────────────────────────────────────┘                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Files Reference

| File | Lines | Content |
|------|-------|---------|
| chunks.153.mjs | 3-250 | Main streaming query function (`$E9`) |
| chunks.153.mjs | 185-191 | Signature delta handling |
| chunks.152.mjs | 2793-2817 | formatAssistantMessageWithCache (`uv3`) |
| chunks.154.mjs | 495-496 | isThinkingBlock (`pE9`) |
| chunks.154.mjs | 499-529 | filterTrailingThinkingBlocks (`xb3`) |
| chunks.70.mjs | 2195-2198 | isUltrathinkKeyword (`WrA`) |
| chunks.70.mjs | 2228-2238 | calculateMaxThinkingBudget (`Xf`) |
| chunks.70.mjs | 2275-2281 | parseUltrathinkFromText (`Ae`) |
| chunks.70.mjs | 2330-2333 | THINKING_BUDGETS constant (`zm1`) |
| chunks.60.mjs | 392-445 | buildContextManagementEdits (`bCB`) |

---

## Related Documents

- [prompt_cache_overview.md](./prompt_cache_overview.md) - Prompt caching architecture
- [cache_control_implementation.md](./cache_control_implementation.md) - Cache control code details
- [cache_strategies.md](./cache_strategies.md) - Caching optimization strategies
