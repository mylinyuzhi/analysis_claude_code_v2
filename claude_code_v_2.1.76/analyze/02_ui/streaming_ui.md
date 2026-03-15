# Streaming UI State

> Related Symbols:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - LLM API

Key functions in this document:
- `handleToolUseStream` (iW1) - Core streaming event processor, chunks.173.mjs:390
- `handleToolUseStreamCallback` (T11) - React state adapter for streaming, chunks.188.mjs:542
- `setStreamingToolUses` (xq) - Update streaming tool state, chunks.188.mjs:87
- `setStreamMode` (tK) - Update stream mode state, chunks.188.mjs:87
- `setStreamingThinking` (R4) - Update thinking state, chunks.188.mjs:87

---

## Table of Contents

- [1. Architecture Overview](#1-architecture-overview)
- [2. Streaming State Variables](#2-streaming-state-variables)
- [3. Stream Mode States](#3-stream-mode-states)
- [4. Streaming Tool Uses (gq)](#4-streaming-tool-uses-gq)
- [5. Thinking Block Lifecycle](#5-thinking-block-lifecycle)
- [6. Event Processing Flow](#6-event-processing-flow)
- [7. Partial Input Display](#7-partial-input-display)
- [8. Message Commit Flow](#8-message-commit-flow)
- [9. In-Progress Tool Tracking](#9-in-progress-tool-tracking)

---

## 1. Architecture Overview

The streaming UI system handles real-time display of LLM responses as they arrive.

```
┌──────────────────────────────────────────────────────────────────────┐
│                      STREAMING UI SYSTEM                              │
│                                                                       │
│  LLM Stream Events                                                    │
│       │                                                               │
│       ▼                                                               │
│  handleToolUseStream (iW1)                                           │
│       │                                                               │
│       ├── content_block_start → setStreamMode, setStreamingToolUses │
│       ├── content_block_delta → update response length              │
│       ├── thinking_delta → setStreamingThinking                     │
│       ├── message_delta → setStreamMode("responding")               │
│       └── complete message → setMessages                             │
│                                                                       │
│  State Slices:                                                        │
│  ├── O7 (streamMode) - "responding" | "tool_use" | "reasoning"      │
│  ├── gq (streamingToolUses) - Array of partial tool inputs          │
│  ├── U8 (streamingThinking) - Thinking block state                  │
│  └── ow (inProgressToolUseIDs) - Set of active tool use IDs         │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**

1. **Streaming state is separate from messages** - Partial content is not added to messages
2. **Filtering prevents duplicates** - Streaming tools are filtered if already committed
3. **30-second thinking fade** - Thinking blocks disappear after display period
4. **Deferred value for messages** - Message updates are deferred for input responsiveness

**v2.1.76 changes:**
- **Transcript auto-scroll fix after selecting text**: Previously, auto-scroll would not resume properly after the user selected text in the transcript view. This is now fixed — auto-scroll re-engages when text selection is released.
- **CJK wide character layout fix**: CJK (Chinese/Japanese/Korean) characters are double-width in monospace terminals. The layout engine now correctly accounts for the 2-column width of CJK characters when calculating line wrapping and column alignment in streamed output.
- **Memory leak fix in streaming buffers**: When a generator (streaming response) is terminated early (e.g., via abort), intermediate streaming buffers are now explicitly released rather than retained until GC. This was a memory leak in high-frequency streaming scenarios.

---

## 2. Streaming State Variables

### Core State

```javascript
// From REPL state (chunks.188.mjs:87):
let [O7, tK] = dA.useState("responding");     // streamMode, setStreamMode
let [gq, xq] = dA.useState([]);               // streamingToolUses, setStreamingToolUses
let [U8, R4] = dA.useState(null);             // streamingThinking, setStreamingThinking
let [ow, r_] = dA.useState(new Set());        // inProgressToolUseIDs, setInProgressToolUseIDs
```

### Derived State

```javascript
// Streaming tool use IDs (for filtering):
let Y1 = dA.useMemo(() => new Set(gq.map(V8z)), [gq]);
// V8z extracts contentBlock.id from streaming tool entry
```

### State Relationships

| State | Contains | When Cleared |
|-------|----------|--------------|
| `streamMode` | Current mode string | Reset after query |
| `streamingToolUses` | Partial tool use objects | Reset after query |
| `streamingThinking` | Thinking block + metadata | 30s after streaming ends |
| `inProgressToolUseIDs` | Set of tool use IDs | Updated during execution |

---

## 3. Stream Mode States

The `streamMode` tracks what the LLM is currently outputting.

### Mode Values

| Mode | Meaning | Trigger |
|------|---------|---------|
| `"responding"` | Text content | `message_delta` event |
| `"tool_use"` | Tool call | `content_block_start` with type tool_use |
| `"reasoning"` | Thinking block | `content_block_start` with type thinking |

### Mode Transitions

```
"responding" ←→ "tool_use" ←→ "responding"
       ↑              ↑
       └── "reasoning" ──┘
```

### Mode Setting

```javascript
// In handleToolUseStream (iW1):
// From chunks.173.mjs:390

case "content_block_start":
    if (event.content_block.type === "tool_use") {
        setStreamMode("tool_use");
        // Add to streamingToolUses
    }
    if (event.content_block.type === "thinking") {
        setStreamMode("reasoning");
    }
    break;

case "message_delta":
    setStreamMode("responding");
    break;
```

---

## 4. Streaming Tool Uses (gq)

The `streamingToolUses` array holds tool uses that are still being streamed.

### Entry Structure

```typescript
interface StreamingToolUse {
    index: number;              // Position in current LLM response
    contentBlock: {
        type: "tool_use";
        id: string;             // Tool use ID
        name: string;           // Tool name (e.g., "Bash")
        input: object;          // Empty initially, filled as streaming progresses
    };
    unparsedToolInput: string;  // Partial JSON being accumulated
}
```

### Adding Entries

```javascript
// In handleToolUseStream (iW1):
// When content_block_start with tool_use:

setStreamingToolUses(prev => [...prev, {
    index: event.index,
    contentBlock: event.content_block,  // Contains id, name, empty input
    unparsedToolInput: ""
}]);
```

### Updating Partial Input

```javascript
// When content_block_delta with input_delta:
setStreamingToolUses(prev => prev.map(entry => {
    if (entry.index === event.index) {
        return {
            ...entry,
            unparsedToolInput: entry.unparsedToolInput + event.delta
        };
    }
    return entry;
}));
```

### Filtering in MessageList

```javascript
// ============================================
// Filter streaming tools that are already committed
// Location: chunks.161.mjs:693-706
// ============================================

// ORIGINAL (for source lookup):
if (q[5] !== _ || q[6] !== g || q[7] !== M) {
    let j6;
    if (q[9] !== _ || q[10] !== g) j6 = (M6) => {
        if (_.has(M6.contentBlock.id)) return !1;
        if (g.some((N6) => N6.type === "assistant" &&
            N6.message.content[0].type === "tool_use" &&
            N6.message.content[0].id === M6.contentBlock.id)) return !1;
        return !0
    }, q[9] = _, q[10] = g, q[11] = j6;
    else j6 = q[11];
    O1 = M.filter(j6), q[5] = _, q[6] = g, q[7] = M, q[8] = O1
} else O1 = q[8];

// READABLE (for understanding):
const activeStreamingTools = streamingToolUses.filter(tool => {
    // Remove if already in inProgressToolUseIDs (completed streaming)
    if (inProgressToolUseIDs.has(tool.contentBlock.id)) return false;

    // Remove if already in committed messages
    if (messages.some(msg =>
        msg.type === "assistant" &&
        msg.message.content[0]?.type === "tool_use" &&
        msg.message.content[0].id === tool.contentBlock.id
    )) return false;

    return true;
});
```

---

## 5. Thinking Block Lifecycle

Thinking blocks have special lifecycle management with a 30-second display timer.

### State Structure

```typescript
interface StreamingThinking {
    thinking: string;           // Accumulated thinking text
    isStreaming: boolean;       // Still receiving data
    streamingEndedAt?: number;  // Timestamp when streaming ended
}
```

### Streaming Phase

```javascript
// When thinking_delta events arrive:
setStreamingThinking(prev => ({
    ...prev,
    thinking: prev.thinking + event.thinking,
    isStreaming: true
}));
```

### End Phase

```javascript
// When assistant message with thinking arrives:
// From chunks.173.mjs:397-400
if (A.type === "assistant") {
    let $ = A.message.content.find((O) => O.type === "thinking");
    if ($ && $.type === "thinking") {
        H?.(() => ({
            thinking: $.thinking,
            isStreaming: false,
            streamingEndedAt: Date.now()
        }));
    }
}
```

### 30-Second Timer

```javascript
// ============================================
// Thinking block 30-second display timer
// Location: chunks.188.mjs:88-98
// ============================================

// ORIGINAL (for source lookup):
dA.useEffect(() => {
    if (U8 && !U8.isStreaming && U8.streamingEndedAt) {
        let q8 = 30000 - (Date.now() - U8.streamingEndedAt);
        if (q8 > 0) {
            let FA = setTimeout(() => {
                R4(null)
            }, q8);
            return () => clearTimeout(FA)
        } else R4(null)
    }
}, [U8]);

// READABLE (for understanding):
useEffect(() => {
    if (!streamingThinking || streamingThinking.isStreaming || !streamingThinking.streamingEndedAt) {
        return;
    }

    // Calculate remaining display time
    const elapsed = Date.now() - streamingThinking.streamingEndedAt;
    const remainingMs = 30000 - elapsed;

    if (remainingMs > 0) {
        // Set timer to clear after remaining time
        const timer = setTimeout(() => {
            setStreamingThinking(null);
        }, remainingMs);
        return () => clearTimeout(timer);
    } else {
        // Already expired, clear immediately
        setStreamingThinking(null);
    }
}, [streamingThinking]);
```

**Why 30 seconds?** This gives users time to read the thinking content without it permanently cluttering the conversation. In transcript mode, thinking is preserved.

### MessageList Thinking Detection

```javascript
// ============================================
// Check if thinking should display
// Location: chunks.161.mjs:624-637
// ============================================

// Determine if streaming thinking is visible:
let x;  // showThinking
A: {
    if (!T) { x = !1; break A; }
    if (T.isStreaming) { x = !0; break A; }
    if (T.streamingEndedAt) {
        x = Date.now() - T.streamingEndedAt < 30000;
        break A;
    }
    x = !1;
}
```

---

## 6. Event Processing Flow

### handleToolUseStreamCallback (T11)

```javascript
// ============================================
// React state adapter for streaming events
// Location: chunks.188.mjs:542-548
// ============================================

// ORIGINAL (for source lookup):
let T11 = dA.useCallback((k6) => {
    iW1(k6, (q8) => {
        if (cR(q8)) X6(() => [q8]);
        else X6((FA) => [...FA, q8])
    }, (q8) => p2((FA) => FA + q8.length), tK, xq, (q8) => {
        X6((FA) => FA.filter((Yq) => Yq !== q8)), rmA(q8.uuid)
    }, R4)
}, [X6, p2, tK, xq, R4]);

// READABLE (for understanding):
const handleToolUseStreamCallback = useCallback((event) => {
    handleToolUseStream(
        event,
        // onMessage: Add to messages
        (msg) => {
            if (isTombstone(msg)) {
                setMessages(() => [msg]);  // Replace all for tombstone
            } else {
                setMessages(prev => [...prev, msg]);
            }
        },
        // onResponseLength: Accumulate character count
        (delta) => updateResponseLength(len => len + delta.length),
        // setStreamMode
        setStreamMode,
        // setStreamingToolUses
        setStreamingToolUses,
        // onRemoveMessage: Filter out removed message
        (msg) => {
            setMessages(prev => prev.filter(m => m !== msg));
            removeMessageFromHistory(msg.uuid);
        },
        // setStreamingThinking
        setStreamingThinking
    );
}, [setMessages, updateResponseLength, setStreamMode, setStreamingToolUses, setStreamingThinking]);
```

### handleToolUseStream (iW1) Core Logic

```javascript
// ============================================
// Core streaming event processor
// Location: chunks.173.mjs:390
// ============================================

function handleToolUseStream(event, onMessage, onResponseLength, setStreamMode, setStreamingToolUses, onRemoveMessage, setStreamingThinking) {
    // Event type routing
    if (event.type !== "stream_event" && event.type !== "stream_request_start") {
        if (event.type === "tombstone") {
            onRemoveMessage?.(event.message);
            return;
        }
        if (event.type === "tool_use_summary") return;
        if (event.type === "assistant") {
            let thinking = event.message.content.find(block => block.type === "thinking");
            if (thinking && thinking.type === "thinking") {
                setStreamingThinking?.(() => ({
                    thinking: thinking.thinking,
                    isStreaming: false,
                    streamingEndedAt: Date.now()
                }));
            }
            return;
        }
    }

    // Handle stream_event types...
    switch (event.event_type) {
        case "content_block_start":
            if (event.content_block.type === "tool_use") {
                setStreamMode("tool_use");
                setStreamingToolUses(prev => [...prev, {
                    index: event.index,
                    contentBlock: event.content_block,
                    unparsedToolInput: ""
                }]);
            }
            if (event.content_block.type === "thinking") {
                setStreamMode("reasoning");
                setStreamingThinking({ thinking: "", isStreaming: true });
            }
            break;

        case "content_block_delta":
            if (event.delta.type === "input_json_delta") {
                // Accumulate tool input
                setStreamingToolUses(prev => prev.map(entry =>
                    entry.index === event.index
                        ? { ...entry, unparsedToolInput: entry.unparsedToolInput + event.delta.partial_json }
                        : entry
                ));
            }
            if (event.delta.type === "thinking_delta") {
                setStreamingThinking(prev => ({
                    ...prev,
                    thinking: prev.thinking + event.delta.thinking,
                    isStreaming: true
                }));
            }
            if (event.delta.type === "text_delta") {
                onResponseLength(event.delta.text);
            }
            break;

        case "message_delta":
            setStreamMode("responding");
            break;
    }
}
```

---

## 7. Partial Input Display

When a tool use is still streaming (input JSON is incomplete), the UI renders a "partial" indicator showing the accumulated JSON so far:

```javascript
// StreamingToolUseCard rendering:
{
    type: "tool_use",
    id: streamingTool.contentBlock.id,
    name: streamingTool.contentBlock.name,
    input: tryParsePartialJSON(streamingTool.unparsedToolInput) ?? {}
}
```

**Why show partial input?** Users can see what arguments Claude is building before execution begins. For long `Bash` commands or file writes, this gives early feedback and allows the user to understand what's about to happen.

**CJK character width (v2.1.76 fix):** When streaming text contains CJK characters, the layout calculation now uses `getStringWidth()` (from the `string-width` library) rather than `.length`. This correctly reports CJK characters as width 2, preventing the streamed text from overflowing its allocated column width in the terminal.

---

## 8. Message Commit Flow

When a streaming response completes, the sequence is:

```
1. message_stop event arrives
   → setStreamMode("responding")

2. Complete assistant message emitted from agent loop
   → handleToolUseStream dispatches to onMessage
   → setMessages(prev => [...prev, assistantMsg])

3. Tool use input is now in the committed message
   → streamingToolUses entries become stale (already in messages)
   → MessageList filter removes them

4. resetLoadingState() called on query completion
   → setStreamingToolUses([])   (cleanup)
   → setStreamMode("responding") (reset)
```

**Auto-scroll behavior (v2.1.76 fix):** After the user selects text in the transcript, the transcript's auto-scroll was previously disabled permanently. The fix detects when selection is released (`selectionchange` event with empty selection range) and re-enables auto-scroll. This ensures new streaming content continues to scroll into view after the user finishes reading.

---

## 9. In-Progress Tool Tracking

The `inProgressToolUseIDs` set tracks which tool uses are currently executing (after streaming input is complete, before result arrives):

```javascript
// When tool execution starts:
setInProgressToolUseIDs(prev => new Set([...prev, toolUseId]));

// When tool execution completes:
setInProgressToolUseIDs(prev => {
    const next = new Set(prev);
    next.delete(toolUseId);
    return next;
});
```

### Purpose of In-Progress Tracking

1. **Filter streaming display**: If `toolUseId` is in `inProgressToolUseIDs`, it was already committed from streaming (input complete) and should NOT appear in `streamingToolUses` anymore
2. **Spinner calculation**: `ow` (inProgressToolUseIDs) contributes to the loading indicator
3. **Tool-only mode detection**: When ALL pending tools are in `inProgressToolUseIDs`, the "tool-only mode" spinner logic applies

### Relationship to streamingToolUses

```
streamingToolUses → input still arriving via SSE
inProgressToolUseIDs → input complete, tool executing, result not yet received
committed messages → result received, tool use fully resolved
```

The three states are mutually exclusive for any given tool use ID.
