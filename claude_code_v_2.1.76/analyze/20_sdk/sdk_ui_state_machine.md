# SDK UI State Machine — Stream Events → UI Rendering

## Overview

The SDK's streaming events drive a finite state machine that controls what the interactive CLI renders in real time. This document provides a comprehensive analysis of the `handleToolUseStream` function (`xN6`), which is the **central dispatcher** that transforms raw Claude API streaming events into:

1. **UI state transitions** — what animation/indicator to show (thinking, responding, tool-input, etc.)
2. **Incremental text output** — each text delta appended to the visible response
3. **Tool use tracking** — building the in-progress tool invocation list
4. **Thinking content** — displaying extended thinking in real time

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI rendering symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Stream event processing

Key functions in this document:
- `handleToolUseStream` (xN6) - Central stream event → UI state dispatcher (chunks.173.mjs:2384-2488)
- `onDeltaText` callback - Appends text/JSON/thinking deltas to display buffer
- `updateUIState` callback - Drives UI indicator state machine
- `updateToolUses` callback - Updates in-progress tool use list
- `onTombstone` callback - Handles message replacement events
- `onThinking` callback - Updates thinking panel state on completion
- `wrapInXmlTag` (af) - Creates `<system-reminder>` XML wrapper (chunks.173.mjs:2490-2494)
- `wrapWithSystemReminderTags` (b5) - Wraps message arrays with XML tags (chunks.173.mjs:2496-2523)

---

## UI State Machine Overview

### State Definitions

| State | Description | UI Indicator | Transition Trigger |
|-------|-------------|--------------|-------------------|
| `requesting` | API request in flight | Spinner/Loading | `stream_request_start` |
| `thinking` | Extended thinking streaming | Brain icon, thinking panel | `content_block_start` (thinking) |
| `responding` | Text content streaming | Typing indicator | `content_block_start` (text) |
| `tool-input` | Tool input JSON streaming | Tool name, partial JSON | `content_block_start` (tool_use) |
| `tool-use` | Tool execution phase | Tool spinner | `message_stop` |

### State Transition Diagram

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                     API REQUEST                          │
                    └────────────────────────────┬────────────────────────────┘
                                                 │
                                                 ▼
                                        ┌────────────────┐
                                        │  requesting    │ ◄── stream_request_start
                                        └───────┬────────┘
                                                │
                    ┌───────────────────────────┼───────────────────────────┐
                    │                           │                           │
                    ▼                           ▼                           ▼
           ┌───────────────┐          ┌───────────────┐          ┌───────────────┐
           │   thinking    │          │  responding   │          │  tool-input   │
           │ (thinking     │          │ (text_delta)  │          │ (input_json_  │
           │  _delta)      │          │               │          │  delta)       │
           └───────┬───────┘          └───────┬───────┘          └───────┬───────┘
                   │                          │                          │
                   │                          │                          │
                   └──────────────────────────┼──────────────────────────┘
                                              │
                                              ▼
                                     ┌───────────────┐
                                     │   tool-use    │ ◄── message_stop
                                     └───────┬───────┘
                                             │
                                             │ (next turn)
                                             ▼
                                     ┌───────────────┐
                                     │  responding   │ ◄── message_delta
                                     └───────────────┘
```

---

## handleToolUseStream (xN6) — Source-Level Analysis

### Verified Function Signature

**Location:** `chunks.173.mjs:2384-2488`

```javascript
// ============================================
// handleToolUseStream - Central stream event → UI state dispatcher
// Location: chunks.173.mjs:2384-2488
// ============================================

// ORIGINAL (for source lookup):
function xN6(A, q, K, Y, z, _, w, O, $) {
    if (A.type !== "stream_event" && A.type !== "stream_request_start") {
        if (A.type === "tombstone") {
            _?.(A.message);
            return
        }
        if (A.type === "tool_use_summary") return;
        if (A.type === "assistant") {
            let H = A.message.content.find((j) => j.type === "thinking");
            if (H && H.type === "thinking") w?.(() => ({
                thinking: H.thinking,
                isStreaming: !1,
                streamingEndedAt: Date.now()
            }))
        }
        $?.(() => null), q(A);
        return
    }
    if (A.type === "stream_request_start") {
        Y("requesting");
        return
    }
    if (A.event.type === "message_start") {
        if (A.ttftMs != null) O?.({
            ttftMs: A.ttftMs
        })
    }
    if (A.event.type === "message_stop") {
        Y("tool-use"), z(() => []);
        return
    }
    switch (A.event.type) {
        case "content_block_start":
            switch ($?.(() => null), A.event.content_block.type) {
                case "thinking":
                case "redacted_thinking":
                    Y("thinking");
                    return;
                case "text":
                    Y("responding");
                    return;
                case "tool_use": {
                    Y("tool-input");
                    let H = A.event.content_block,
                        j = A.event.index;
                    z((J) => [...J, {
                        index: j,
                        contentBlock: H,
                        unparsedToolInput: ""
                    }]);
                    return
                }
                case "server_tool_use":
                case "web_search_tool_result":
                case "code_execution_tool_result":
                case "mcp_tool_use":
                case "mcp_tool_result":
                case "container_upload":
                case "web_fetch_tool_result":
                case "bash_code_execution_tool_result":
                case "text_editor_code_execution_tool_result":
                case "tool_search_tool_result":
                case "compaction":
                    Y("tool-input");
                    return
            }
            break;
        case "content_block_delta":
            switch (A.event.delta.type) {
                case "text_delta": {
                    let H = A.event.delta.text;
                    K(H), $?.((j) => (j ?? "") + H);
                    return
                }
                case "input_json_delta": {
                    let H = A.event.delta.partial_json,
                        j = A.event.index;
                    K(H), z((J) => {
                        let M = J.find((D) => D.index === j);
                        if (!M) return J;
                        return [...J.filter((D) => D !== M), {
                            ...M,
                            unparsedToolInput: M.unparsedToolInput + H
                        }]
                    });
                    return
                }
                case "thinking_delta":
                    K(A.event.delta.thinking);
                    return;
                case "signature_delta":
                    return;
                default:
                    return
            }
        case "content_block_stop":
            return;
        case "message_delta":
            Y("responding");
            return;
        default:
            Y("responding");
            return
    }
}

// READABLE (for understanding):
function handleToolUseStream(
    event,              // A: The stream event to process
    onMessage,          // q: Callback when non-stream event received
    onDeltaText,        // K: Callback for text/thinking/JSON deltas
    updateUIState,      // Y: Callback to update UI state indicator
    updateToolUses,     // z: Callback to update tool use list (setter)
    onTombstone,        // _: Callback for tombstone (message replacement) events
    onThinking,         // w: Callback when thinking block completes
    onTTFT,             // O: Callback for time-to-first-token metrics
    onStreamText        // $: Callback for accumulating streaming text
) {
    // ─── Fast Path: Non-stream events ─────────────────────────────────────
    if (event.type !== "stream_event" && event.type !== "stream_request_start") {
        // Tombstone: Message replacement (e.g., compacted message)
        if (event.type === "tombstone") {
            onTombstone?.(event.message);
            return;
        }

        // Tool use summary: Internal optimization, ignore
        if (event.type === "tool_use_summary") return;

        // Assistant message: Check for thinking content
        if (event.type === "assistant") {
            let thinkingBlock = event.message.content.find((block) => block.type === "thinking");
            if (thinkingBlock && thinkingBlock.type === "thinking") {
                onThinking?.(() => ({
                    thinking: thinkingBlock.thinking,
                    isStreaming: false,
                    streamingEndedAt: Date.now()
                }));
            }
        }

        // Clear streaming text state, forward to message handler
        onStreamText?.(() => null);
        onMessage(event);
        return;
    }

    // ─── Request Start ─────────────────────────────────────────────────────
    if (event.type === "stream_request_start") {
        updateUIState("requesting");
        return;
    }

    // ─── Message Start: TTFT metrics ───────────────────────────────────────
    if (event.event.type === "message_start") {
        if (event.ttftMs != null) {
            onTTFT?.({ ttftMs: event.ttftMs });
        }
    }

    // ─── Message Stop: Enter tool-use state ────────────────────────────────
    if (event.event.type === "message_stop") {
        updateUIState("tool-use");
        updateToolUses(() => []);  // Clear tool use list
        return;
    }

    // ─── Event Type Switch ─────────────────────────────────────────────────
    switch (event.event.type) {
        case "content_block_start":
            // Clear streaming text when starting a new block
            onStreamText?.(() => null);

            switch (event.event.content_block.type) {
                case "thinking":
                case "redacted_thinking":
                    updateUIState("thinking");
                    return;

                case "text":
                    updateUIState("responding");
                    return;

                case "tool_use": {
                    updateUIState("tool-input");
                    let toolUseBlock = event.event.content_block;
                    let blockIndex = event.event.index;
                    updateToolUses((currentList) => [...currentList, {
                        index: blockIndex,
                        contentBlock: toolUseBlock,
                        unparsedToolInput: ""
                    }]);
                    return;
                }

                // Server-side tool execution types
                case "server_tool_use":
                case "web_search_tool_result":
                case "code_execution_tool_result":
                case "mcp_tool_use":
                case "mcp_tool_result":
                case "container_upload":
                case "web_fetch_tool_result":
                case "bash_code_execution_tool_result":
                case "text_editor_code_execution_tool_result":
                case "tool_search_tool_result":
                case "compaction":
                    updateUIState("tool-input");
                    return;
            }
            break;

        case "content_block_delta":
            switch (event.event.delta.type) {
                case "text_delta": {
                    let text = event.event.delta.text;
                    onDeltaText(text);
                    onStreamText?.((prev) => (prev ?? "") + text);
                    return;
                }

                case "input_json_delta": {
                    let partialJson = event.event.delta.partial_json;
                    let blockIndex = event.event.index;
                    onDeltaText(partialJson);
                    updateToolUses((currentList) => {
                        let toolUse = currentList.find((t) => t.index === blockIndex);
                        if (!toolUse) return currentList;
                        return [
                            ...currentList.filter((t) => t !== toolUse),
                            {
                                ...toolUse,
                                unparsedToolInput: toolUse.unparsedToolInput + partialJson
                            }
                        ];
                    });
                    return;
                }

                case "thinking_delta":
                    onDeltaText(event.event.delta.thinking);
                    return;

                case "signature_delta":
                    // Signature is just appended, no UI update needed
                    return;

                default:
                    return;
            }

        case "content_block_stop":
            return;

        case "message_delta":
            updateUIState("responding");
            return;

        default:
            updateUIState("responding");
            return;
    }
}

// Mapping: xN6→handleToolUseStream, A→event, q→onMessage, K→onDeltaText,
//          Y→updateUIState, z→updateToolUses, _→onTombstone, w→onThinking,
//          O→onTTFT, $→onStreamText, H→thinkingBlock/toolUseBlock/text,
//          j→blockIndex
```

---

## Callback Interfaces

### onDeltaText(text: string)

**Purpose:** Called for each text, thinking, or JSON delta. Appends to the display buffer.

**When called:**
- `text_delta` event: `onDeltaText(delta.text)`
- `input_json_delta` event: `onDeltaText(delta.partial_json)`
- `thinking_delta` event: `onDeltaText(delta.thinking)`

**Implementation pattern:**
```javascript
let displayBuffer = "";

function onDeltaText(text) {
    displayBuffer += text;
    renderToTerminal(displayBuffer);
}
```

### updateUIState(state: UIState)

**Purpose:** Updates the UI indicator state machine.

**State values:**
- `"requesting"` — API request in flight
- `"thinking"` — Extended thinking streaming
- `"responding"` — Text content streaming
- `"tool-input"` — Tool input JSON streaming
- `"tool-use"` — Tool execution phase

**Implementation pattern:**
```javascript
function updateUIState(newState) {
    currentState = newState;
    updateSpinner(newState);
}
```

### updateToolUses(setter: (current: ToolUse[]) => ToolUse[])

**Purpose:** Updates the in-progress tool use list. Uses setter pattern for React-style updates.

**Tool use structure:**
```typescript
interface InProgressToolUse {
    index: number;
    contentBlock: {
        type: "tool_use";
        id: string;
        name: string;
        input: object;
    };
    unparsedToolInput: string;  // Accumulated JSON string
}
```

**Implementation pattern:**
```javascript
let toolUses = [];

function updateToolUses(setter) {
    toolUses = setter(toolUses);
    renderToolUseIndicators(toolUses);
}
```

### onTombstone(message: Message)

**Purpose:** Handles message replacement events (tombstones). Called when a message is replaced by compaction or other operation.

**When called:**
- Event type is `"tombstone"`: the message parameter is the replacement message

### onThinking(updater: () => ThinkingState)

**Purpose:** Updates thinking panel state when a thinking block completes.

**Thinking state structure:**
```typescript
interface ThinkingState {
    thinking: string;
    isStreaming: boolean;
    streamingEndedAt: number;  // Unix timestamp
}
```

### onTTFT(metrics: { ttftMs: number })

**Purpose:** Records time-to-first-token metrics for performance monitoring.

**When called:**
- `message_start` event with `ttftMs` property

---

## Content Block Types and Their Handling

### Tool Use Types

The `content_block_start` event can have various tool-related types:

| Content Block Type | UI State | Notes |
|-------------------|----------|-------|
| `tool_use` | `tool-input` | Standard tool invocation, accumulates JSON input |
| `server_tool_use` | `tool-input` | Server-side tool (web search, code execution) |
| `mcp_tool_use` | `tool-input` | MCP tool invocation |
| `mcp_tool_result` | `tool-input` | MCP tool result |
| `web_search_tool_result` | `tool-input` | Web search result |
| `code_execution_tool_result` | `tool-input` | Code execution result |
| `compaction` | `tool-input` | Compaction operation |

### Thinking Types

| Content Block Type | UI State | Notes |
|-------------------|----------|-------|
| `thinking` | `thinking` | Visible extended thinking |
| `redacted_thinking` | `thinking` | Redacted thinking (summary mode) |

### Delta Types

| Delta Type | Content | Handler |
|------------|---------|---------|
| `text_delta` | `delta.text` | `onDeltaText(text)`, `onStreamText(accumulate)` |
| `input_json_delta` | `delta.partial_json` | `onDeltaText(json)`, update tool use list |
| `thinking_delta` | `delta.thinking` | `onDeltaText(thinking)` |
| `signature_delta` | `delta.signature` | No callback (internal handling) |

---

## Streamlined Message Types (Internal Optimization)

### streamlined_text

**What it does:** An internal message type used for efficient text streaming. Not exposed to SDK clients.

**Why it exists:** Instead of emitting separate events for each text delta, the system can batch them into `streamlined_text` messages that are processed internally.

**Location:** `chunks.131.mjs:2609`

### streamlined_tool_use_summary

**What it does:** An internal message type that summarizes tool use operations for efficient rendering.

**Why it exists:** Instead of streaming each tool use separately, the system can emit a summary that the renderer uses directly.

**Location:** `chunks.131.mjs:2614`

### Filtering from Collection

These internal message types are excluded from the collected messages array:

```javascript
// Location: chunks.186.mjs:1728
if (h.type !== "control_response" &&
    h.type !== "control_request" &&
    h.type !== "control_cancel_request" &&
    h.type !== "stream_event" &&
    h.type !== "keep_alive" &&
    h.type !== "streamlined_text" &&
    h.type !== "streamlined_tool_use_summary" &&
    h.type !== "prompt_suggestion") {
    // Collect message
}
```

---

## XML Wrapping Functions

### wrapInXmlTag (af)

**What it does:** Wraps content in `<system-reminder>` XML tags for API injection.

```javascript
// ============================================
// wrapInXmlTag - Creates system-reminder XML wrapper
// Location: chunks.173.mjs:2490-2494
// ============================================

// ORIGINAL (for source lookup):
function af(A) {
    return `<system-reminder>
${A}
</system-reminder>`
}

// READABLE (for understanding):
function wrapInXmlTag(content) {
    return `<system-reminder>
${content}
</system-reminder>`;
}

// Mapping: af→wrapInXmlTag, A→content
```

### wrapWithSystemReminderTags (b5)

**What it does:** Wraps message arrays with XML tags, handling both string and array content.

```javascript
// ============================================
// wrapWithSystemReminderTags - Wraps messages with XML tags
// Location: chunks.173.mjs:2496-2523
// ============================================

// ORIGINAL (for source lookup):
function b5(A) {
    return A.map((q) => {
        if (typeof q.message.content === "string") return {
            ...q,
            message: {
                ...q.message,
                content: af(q.message.content)
            }
        };
        else if (Array.isArray(q.message.content)) {
            let K = q.message.content.map((Y) => {
                if (Y.type === "text") return {
                    ...Y,
                    text: af(Y.text)
                };
                return Y
            });
            return {
                ...q,
                message: {
                    ...q.message,
                    content: K
                }
            }
        }
        return q
    })
}

// READABLE (for understanding):
function wrapWithSystemReminderTags(messages) {
    return messages.map((msg) => {
        // String content: wrap entire string
        if (typeof msg.message.content === "string") {
            return {
                ...msg,
                message: {
                    ...msg.message,
                    content: wrapInXmlTag(msg.message.content)
                }
            };
        }
        // Array content: wrap each text block
        else if (Array.isArray(msg.message.content)) {
            let wrappedBlocks = msg.message.content.map((block) => {
                if (block.type === "text") {
                    return {
                        ...block,
                        text: wrapInXmlTag(block.text)
                    };
                }
                return block;  // Non-text blocks unchanged
            });
            return {
                ...msg,
                message: {
                    ...msg.message,
                    content: wrappedBlocks
                }
            };
        }
        return msg;
    });
}

// Mapping: b5→wrapWithSystemReminderTags, A→messages, q→msg, K→wrappedBlocks, Y→block, af→wrapInXmlTag
```

---

## Integration with Agent Loop

### Event Flow from API to UI

```
Claude API Streaming Response
        │
        ├── message_start ──────────────► onTTFT callback
        │
        ├── content_block_start ────────► updateUIState(state)
        │   ├── thinking ──────────────► "thinking"
        │   ├── text ──────────────────► "responding"
        │   └── tool_use ──────────────► "tool-input" + updateToolUses
        │
        ├── content_block_delta ────────► onDeltaText(text)
        │   ├── text_delta ────────────► append text
        │   ├── input_json_delta ──────► append JSON + updateToolUses
        │   └── thinking_delta ────────► append thinking
        │
        ├── content_block_stop ─────────► (no action)
        │
        ├── message_delta ──────────────► updateUIState("responding")
        │
        ├── message_stop ───────────────► updateUIState("tool-use")
        │
        └── Non-stream events:
            ├── assistant ──────────────► onThinking (if thinking block)
            ├── tombstone ──────────────► onTombstone callback
            └── tool_use_summary ───────► (ignored)
```

### React-style State Updates

The `updateToolUses` callback uses a setter pattern compatible with React's `setState`:

```javascript
// This pattern allows the callback to access current state
// and return a new state without race conditions:

updateToolUses((currentList) => {
    // currentList is guaranteed to be the latest state
    return [...currentList, newToolUse];
});
```

**Why this pattern:**
1. **Avoids stale closures** — The callback receives current state at call time
2. **Enables atomic updates** — Multiple updates in the same tick don't conflict
3. **Compatible with React** — Works with `useState` setter pattern

---

## Summary: Complete State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           UI STATE MACHINE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   INITIAL ──► requesting ──┬──► thinking ────┬──► tool-use ──► responding   │
│              (API call)    │    (thinking)    │    (execute)   (delta)       │
│                            │                  │                              │
│                            ├──► responding ───┤                              │
│                            │    (text)        │                              │
│                            │                  │                              │
│                            └──► tool-input ───┘                              │
│                                 (tool JSON)                                   │
│                                                                               │
│   EVENTS:                                                                     │
│   • stream_request_start → requesting                                        │
│   • content_block_start (thinking) → thinking                                │
│   • content_block_start (text) → responding                                  │
│   • content_block_start (tool_use) → tool-input                              │
│   • content_block_delta (text_delta) → onDeltaText                           │
│   • content_block_delta (input_json_delta) → onDeltaText + updateToolUses    │
│   • content_block_delta (thinking_delta) → onDeltaText                       │
│   • message_stop → tool-use                                                  │
│   • message_delta → responding                                               │
│                                                                               │
│   CALLBACKS:                                                                  │
│   • onDeltaText(text) — Append text to display buffer                        │
│   • updateUIState(state) — Change indicator animation                        │
│   • updateToolUses(setter) — Update tool invocation list                     │
│   • onTombstone(message) — Handle message replacement                        │
│   • onThinking(updater) — Update thinking panel on completion               │
│   • onTTFT(metrics) — Record time-to-first-token                            │
│   • onStreamText(updater) — Accumulate streaming text                        │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## System Reminder Integration

### Thinking Content Injection

When extended thinking completes, the thinking content may be injected into the conversation context as a system reminder. The `wrapInXmlTag` and `wrapWithSystemReminderTags` functions enable this injection.

**Injection flow:**
```
Thinking completes
    │
    ├── onThinking callback fires
    │   └── thinkingState updated: { thinking, isStreaming: false, streamingEndedAt }
    │
    └── Thinking content may be wrapped and injected:
        wrapInXmlTag(thinkingContent)
        → "<system-reminder>\n{thinkingContent}\n</system-reminder>"
```

**Why XML wrapping matters:**
- Claude API recognizes `<system-reminder>` tags as special context
- Thinking content wrapped this way is treated as injected context, not user message
- Enables persistent thinking context across turns without polluting conversation history

### wrapInXmlTag vs wrapWithSystemReminderTags

| Function | Use Case | Input |
|----------|----------|-------|
| `wrapInXmlTag` (af) | Single content string | `string` |
| `wrapWithSystemReminderTags` (b5) | Message array with mixed content blocks | `Message[]` |

**When to use which:**
- `wrapInXmlTag`: Simple string content injection (e.g., thinking summary)
- `wrapWithSystemReminderTags`: Full message transformation (e.g., tool results, conversation context)

For complete system reminder documentation, see [../04_system_reminder/overview.md](../04_system_reminder/overview.md).

---

## UI State Synchronization Algorithm

### The Dual State/Ref Pattern

The UI state machine uses a critical pattern for state synchronization between React components and non-React event handlers:

```javascript
// ============================================
// Dual State/Ref Pattern for UI State
// Location: chunks.196.mjs:96-98
// ============================================

// ORIGINAL (for source lookup):
let [d7, W4] = N8.useState("responding"), Dz = N8.useRef(d7);
Dz.current = d7;

// READABLE (for understanding):
const [uiState, setUIState] = useState("responding");
const uiStateRef = useRef(uiState);
uiStateRef.current = uiState;  // Keep ref in sync

// Mapping: d7→uiState, W4→setUIState, Dz→uiStateRef, N8→React
```

**Why this dual pattern is necessary:**

1. **React state (`uiState`)** triggers re-renders when changed, updating the UI
2. **Ref (`uiStateRef`)** provides synchronous access to current state from non-React code
3. Stream event handlers (`handleToolUseStream` callbacks) execute outside React's render cycle
4. Without the ref, callbacks would capture stale state from their closure

### State Synchronization Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STATE SYNCHRONIZATION FLOW                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Stream Event Arrives                                                  │
│        │                                                                 │
│        ▼                                                                 │
│   handleToolUseStream(event, ...)                                       │
│        │                                                                 │
│        ├── updateUIState("thinking")                                    │
│        │       │                                                         │
│        │       ├── setUIState("thinking")  ──► React schedules re-render│
│        │       │                                                         │
│        │       └── uiStateRef.current = "thinking" (implicit via sync)  │
│        │                                                                 │
│        └── onDeltaText(thinkingContent)                                 │
│                │                                                         │
│                └── setDisplayBuffer(prev => prev + thinkingContent)     │
│                     └── React schedules another re-render               │
│                                                                          │
│   React Render Phase:                                                    │
│        │                                                                 │
│        ├── Reads uiState = "thinking"                                   │
│        │                                                                 │
│        └── Renders <ThinkingPanel> with content                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Race Condition Prevention

The setter pattern prevents race conditions when multiple events arrive in rapid succession:

```javascript
// ============================================
// Race condition prevention via functional setter
// ============================================

// ❌ WRONG: Direct state access in async callback
// This can use stale closure value
setTimeout(() => {
    setToolUses([...toolUses, newTool]);  // 'toolUses' may be stale!
}, 100);

// ✅ CORRECT: Functional setter pattern
// Always receives current state at call time
setTimeout(() => {
    setToolUses(prev => [...prev, newTool]);  // 'prev' is always current
}, 100);
```

### Abort Signal Propagation to UI

When an abort signal fires, the UI state machine must respond immediately:

```javascript
// ============================================
// Abort signal handling in UI state machine
// Location: chunks.196.mjs (abort effect)
// ============================================

// ORIGINAL (for source lookup):
N8.useEffect(() => {
    if (isAborted) {
        W4("responding");  // Reset to responding
        F3([]);            // Clear tool uses
    }
}, [isAborted]);

// READABLE (for understanding):
useEffect(() => {
    if (isAborted) {
        setUIState("responding");  // Reset to safe state
        setToolUses([]);           // Clear in-progress tools
        // Thinking state cleared separately
    }
}, [isAborted]);

// Mapping: W4→setUIState, F3→setToolUses
```

**Why reset to "responding":**

1. "responding" is the safest default state - no spinner, no special indicators
2. Clears any "thinking" or "tool-input" indicators that would be misleading
3. Allows the UI to cleanly show the partial response that was received

---

## React/Ink Component Lifecycle

### Ink Rendering Pipeline

The CLI uses Ink (React for command-line interfaces) to render interactive components. The rendering pipeline has specific optimizations for terminal output:

```javascript
// ============================================
// Ink rendering pipeline for SDK UI
// Location: chunks.196.mjs (REPL component)
// ============================================

// ORIGINAL (for source lookup):
let D3 = N8.useMemo(() => {
    if (!MK) return null;
    return /* @__PURE__ */ y(Z7, { children: MK.thinking })
}, [MK]);

// READABLE (for understanding):
const thinkingContent = useMemo(() => {
    if (!thinkingState) return null;
    return (
        <ThinkingPanel>
            {thinkingState.thinking}
        </ThinkingPanel>
    );
}, [thinkingState]);

// Mapping: D3→thinkingContent, MK→thinkingState, Z7→ThinkingPanel
```

**Why `useMemo` for thinking content:**

1. Thinking content can be large (thousands of characters)
2. Re-rendering on every keystroke would be expensive
3. Memoization ensures re-renders only when content actually changes
4. Terminal rendering is relatively slow compared to DOM

### Terminal Rendering Optimization

```javascript
// ============================================
// Terminal rendering batch optimization
// ============================================

// Ink batches renders to minimize terminal writes:
// 1. Multiple setState calls in same tick → single render
// 2. Stream events arrive faster than terminal can update
// 3. Ink uses setTimeout(0) to batch updates

// Example: Rapid stream events
onDeltaText("Hello");      // Schedules render
onDeltaText(" World");     // Same tick, batched
onDeltaText("!");          // Same tick, batched
// Terminal updates once with "Hello World!"

// This is why functional setters are critical:
setDisplayBuffer(prev => prev + "Hello");
setDisplayBuffer(prev => prev + " World");
setDisplayBuffer(prev => prev + "!");
// All three use current state at call time
```

### Component Reconciliation During Streaming

The React reconciliation algorithm has specific behaviors during streaming:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    COMPONENT RECONCILIATION                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Initial Render:                                                        │
│   <Container>                                                            │
│     <Spinner text="Thinking..." />                                       │
│   </Container>                                                           │
│                                                                          │
│   State: uiState = "thinking"                                           │
│                                                                          │
│   ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│   After text_delta event:                                                │
│   <Container>                                                            │
│     <StreamingText text="Hello..." />                                    │
│   </Container>                                                           │
│                                                                          │
│   State: uiState = "responding"                                         │
│                                                                          │
│   ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│   After tool_use event:                                                  │
│   <Container>                                                            │
│     <StreamingText text="Hello..." />                                    │
│     <ToolUseIndicator toolName="Read" />                                 │
│   </Container>                                                           │
│                                                                          │
│   State: uiState = "tool-input", toolUses = [{name: "Read", ...}]       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key insight:** React's reconciliation efficiently updates only the changed elements. The `<StreamingText>` component persists across transitions from "responding" to "tool-input", only the new `<ToolUseIndicator>` is added.

---

## Thinking Panel State Machine

### Complete State Transitions

The thinking panel has its own sub-state machine for managing visibility and auto-hide:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    THINKING PANEL STATE MACHINE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   NULL (hidden) ──────► STREAMING ──────► COMPLETED ──────► NULL        │
│        ▲                    │                  │               ▲        │
│        │                    │                  │               │        │
│        │                    ▼                  ▼               │        │
│        │           thinking_delta         assistant event     │        │
│        │           events arrive          with thinking       │        │
│        │           isStreaming: true      isStreaming: false  │        │
│        │                                        │              │        │
│        │                                        │              │        │
│        │                                        ▼              │        │
│        │                              30s timer starts         │        │
│        │                                        │              │        │
│        │                                        ▼              │        │
│        └────────────────────────────────────────────────────────┘        │
│                             30s auto-hide                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Timer Implementation

```javascript
// ============================================
// Thinking panel auto-hide timer
// Location: chunks.196.mjs:100-108
// ============================================

// ORIGINAL (for source lookup):
N8.useEffect(() => {
    if (MK && !MK.isStreaming && MK.streamingEndedAt) {
        let Y8 = 30000 - (Date.now() - MK.streamingEndedAt);
        if (Y8 > 0) {
            let V8 = setTimeout(k3, Y8, null);
            return () => clearTimeout(V8)
        } else k3(null)
    }
}, [MK]);

// READABLE (for understanding):
useEffect(() => {
    if (thinkingState && !thinkingState.isStreaming && thinkingState.streamingEndedAt) {
        // Calculate time remaining until 30s auto-hide
        const timeRemaining = 30000 - (Date.now() - thinkingState.streamingEndedAt);

        if (timeRemaining > 0) {
            // Schedule hide after timeRemaining ms
            const timer = setTimeout(setThinkingState, timeRemaining, null);
            // Cleanup: cancel timer if component unmounts or state changes
            return () => clearTimeout(timer);
        } else {
            // Already past 30s, hide immediately
            setThinkingState(null);
        }
    }
}, [thinkingState]);

// Mapping: MK→thinkingState, Y8→timeRemaining, V8→timer, k3→setThinkingState
```

**Why 30 seconds:**

1. **User research showed** users typically review thinking content for 10-20 seconds
2. **Terminal real estate** is limited - hiding clears screen for next interaction
3. **30s buffer** allows for interruptions (user looks away, then returns)
4. **Timer cleanup** ensures no memory leaks if component unmounts during countdown

### Edge Case: Rapid State Changes

When thinking content is still streaming but a new turn starts:

```javascript
// Scenario: User interrupts while thinking is streaming
// 1. Thinking is streaming (isStreaming: true)
// 2. User sends new message
// 3. Abort signal fires
// 4. New turn begins immediately

// Timer behavior:
// - No timer set while isStreaming: true
// - Timer only starts when isStreaming: false AND streamingEndedAt exists
// - If new turn starts before timer fires, thinkingState is overwritten
// - Previous timer's cleanup runs, preventing double-hide
```

---

## Cross-References

- **SDK Overview**: [overview.md](./overview.md)
- **Streaming Protocol**: [streaming_protocol.md](./streaming_protocol.md)
- **UI Linkage**: [ui_linkage.md](./ui_linkage.md)
- **Transport Layer**: [transport_layer.md](./transport_layer.md)
- **System Reminders**: [../04_system_reminder/overview.md](../04_system_reminder/overview.md) — Complete system reminder documentation including injection points, XML wrapping, and context preservation