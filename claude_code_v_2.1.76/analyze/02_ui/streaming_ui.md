# Streaming UI State

> Related Symbols:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - LLM API

Key functions in this document:
- `handleToolUseStream` (`xN6`) - Core streaming event processor, chunks.173.mjs:2384-2480
- `MessageList` (`veY`) - Memoized message list with streaming tool filtering, chunks.161.mjs:3
- `setStreamingToolUses` - Update streaming tool state (internal React state)
- `setStreamMode` - Update stream mode state (internal React state)
- `setStreamingThinking` - Update thinking state (internal React state)

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
- [10. System Reminder Integration During Streaming](#10-system-reminder-integration-during-streaming)
- [11. Complete Streaming State Machine](#11-complete-streaming-state-machine)
- [12. Performance Optimization Details](#12-performance-optimization-details)
- [13. Memory Leak Fix (v2.1.76)](#13-memory-leak-fix-v2176)

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
│  handleToolUseStream (xN6)                                           │
│       │                                                               │
│       ├── content_block_start → setStreamMode, setStreamingToolUses │
│       ├── content_block_delta → update response length              │
│       ├── thinking_delta → setStreamingThinking                     │
│       ├── message_delta → setStreamMode("responding")               │
│       └── complete message → setMessages                             │
│                                                                       │
│  State Slices (REPL component ot8, chunks.196.mjs):                  │
│  ├── streamMode - "responding" | "tool-input" | "thinking"          │
│  ├── streamingToolUses - Array of partial tool inputs               │
│  ├── streamingThinking - Thinking block state                       │
│  └── inProgressToolUseIDs (ow) - Set of active tool use IDs         │
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

The streaming state variables are managed within the REPL component (`ot8`, chunks.196.mjs):

```javascript
// From REPL state (chunks.196.mjs):
let [streamMode, setStreamMode] = useState("responding");
let [streamingToolUses, setStreamingToolUses] = useState([]);
let [streamingThinking, setStreamingThinking] = useState(null);
let [inProgressToolUseIDs, setInProgressToolUseIDs] = useState(new Set());
```

### Derived State

```javascript
// Streaming tool use IDs (for filtering):
let streamingToolUseIDs = useMemo(() => new Set(streamingToolUses.map(t => t.contentBlock.id)), [streamingToolUses]);
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

| Mode | Meaning | Trigger Event |
|------|---------|---------------|
| `"responding"` | Text content streaming | `content_block_start` with type `text`, or `message_delta` |
| `"tool-input"` | Tool call JSON streaming | `content_block_start` with type `tool_use` |
| `"thinking"` | Thinking block streaming | `content_block_start` with type `thinking` or `redacted_thinking` |
| `"requesting"` | Request starting | `stream_request_start` event |
| `"tool-use"` | Message complete, tools pending | `message_stop` event |

### Mode Transitions

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    ▼                                     │
            ┌───────────────┐                            │
            │ "requesting"  │ ← stream_request_start     │
            └───────┬───────┘                            │
                    │                                     │
                    ▼                                     │
            ┌───────────────┐                            │
            │ "responding"  │ ← text content             │
            └───────┬───────┘                            │
                    │                                     │
          ┌────────┼────────┐                            │
          ▼        ▼        ▼                            │
   ┌──────────┐ ┌──────────┐ ┌────────────┐              │
   │"thinking"│ │"tool-    │ │  "respond- │              │
   │          │ │ input"   │ │    ing"    │              │
   └────┬─────┘ └────┬─────┘ └─────┬──────┘              │
        │            │             │                      │
        └────────────┴─────────────┘                      │
                     │                                     │
                     ▼                                     │
            ┌───────────────┐                            │
            │  "tool-use"   │ ← message_stop             │
            └───────────────┘                            │
```

### Mode Setting

```javascript
// In handleToolUseStream (xN6):
// From chunks.173.mjs:2384-2480

case "content_block_start":
    if (event.content_block.type === "tool_use") {
        setStreamMode("tool-input");
        // Add to streamingToolUses
    }
    if (event.content_block.type === "thinking") {
        setStreamMode("thinking");
    }
    break;

case "message_stop":
    setStreamMode("tool-use");  // After message completes
    break;
```

---

## 4. Streaming Tool Uses

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
// In handleToolUseStream (xN6):
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
// From chunks.173.mjs:2391-2397
if (event.type === "assistant") {
    let thinking = event.message.content.find((block) => block.type === "thinking");
    if (thinking && thinking.type === "thinking") {
        setStreamingThinking?.(() => ({
            thinking: thinking.thinking,
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
// Location: REPL component (chunks.196.mjs)
// ============================================

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

### handleToolUseStream Callback Usage

The `handleToolUseStream` function (`xN6`) is called from multiple places with React state callbacks:

```javascript
// Example callback registration (from chunks.196.mjs:695):
handleToolUseStream(event,
    (msg) => setMessages(prev => [...prev, msg]),  // onMessage
    (text) => updateResponseLength(len => len + text.length),  // onResponseLength
    setStreamMode,  // setStreamMode
    setStreamingToolUses,  // setStreamingToolUses
    (msg) => removeMessage(msg),  // onRemoveMessage
    setStreamingThinking  // setStreamingThinking
);
```

### handleToolUseStream (`xN6`) Core Logic

**Validated Parameters (from chunks.173.mjs:2384):**
- `A` = event - The streaming event object
- `q` = onMessage - Callback to add message to state
- `K` = onResponseLength - Callback to update response length counter
- `Y` = setStreamMode - React state setter for stream mode
- `z` = setStreamingToolUses - React state setter for streaming tools
- `_` = onRemoveMessage - Callback to remove a message (for tombstone events)
- `w` = setStreamingThinking - React state setter for thinking state
- `O` = setTTFT - Optional: Set time-to-first-token metric
- `$` = setPartialText - Optional: Set partial streaming text for display

```javascript
// ============================================
// handleToolUseStream (xN6) - Core streaming event processor
// Location: chunks.173.mjs:2384-2488 (VALIDATED)
// ============================================

// ORIGINAL (for source lookup):
function xN6(A, q, K, Y, z, _, w, O, $) {
    if (A.type !== "stream_event" && A.type !== "stream_request_start") {
        if (A.type === "tombstone") { _?.(A.message); return }
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
    if (A.type === "stream_request_start") { Y("requesting"); return }
    if (A.event.type === "message_start") {
        if (A.ttftMs != null) O?.({ ttftMs: A.ttftMs })
    }
    if (A.event.type === "message_stop") { Y("tool-use"), z(() => []); return }
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
                    let H = A.event.content_block, j = A.event.index;
                    z((J) => [...J, { index: j, contentBlock: H, unparsedToolInput: "" }]);
                    return
                }
                // Additional block types (v2.1.76):
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
                    let H = A.event.delta.partial_json, j = A.event.index;
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

// Mapping: xN6→handleToolUseStream, A→event, q→onMessage, K→onResponseLength,
// Y→setStreamMode, z→setStreamingToolUses, _→onRemoveMessage, w→setStreamingThinking,
// O→setTTFT, $→setPartialText
```

### handleToolUseStream Deep Algorithm Analysis

**What it does:** Routes streaming events from the LLM API to appropriate React state updates, managing the complex state machine of streaming tool inputs, thinking blocks, and text content.

**How it works:**

1. **Type routing (outer switch)** - First checks event type to determine processing path
2. **Content block routing (inner switch)** - For `content_block_start` and `content_block_delta`, routes by block type
3. **State isolation** - Each state setter is called independently to prevent batch update issues
4. **Optional callbacks** - Uses `?.()` optional chaining for callbacks that may not be provided

**Event Routing Decision Tree:**

```
handleToolUseStream(event)
    │
    ├─ event.type === "stream_event" || "stream_request_start"
    │   │
    │   ├─ event.type === "stream_request_start"
    │   │   └─ setStreamMode("requesting")
    │   │
    │   ├─ event.event.type === "message_start"
    │   │   └─ setTTFT(event.ttftMs) [if present]
    │   │
    │   ├─ event.event.type === "message_stop"
    │   │   ├─ setStreamMode("tool-use")
    │   │   └─ setStreamingToolUses([])  // Clear all streaming tools
    │   │
    │   └─ switch(event.event.type)
    │       │
    │       ├─ case "content_block_start"
    │       │   │
    │       │   ├─ "thinking" / "redacted_thinking"
    │       │   │   └─ setStreamMode("thinking")
    │       │   │
    │       │   ├─ "text"
    │       │   │   └─ setStreamMode("responding")
    │       │   │
    │       │   ├─ "tool_use"
    │       │   │   ├─ setStreamMode("tool-input")
    │       │   │   └─ setStreamingToolUses([...prev, newEntry])
    │       │   │
    │       │   └─ [11 other block types] → setStreamMode("tool-input")
    │       │
    │       ├─ case "content_block_delta"
    │       │   │
    │       │   ├─ "text_delta"
    │       │   │   ├─ onResponseLength(text)
    │       │   │   └─ setPartialText(prev + text)
    │       │   │
    │       │   ├─ "input_json_delta"
    │       │   │   ├─ onResponseLength(partial_json)
    │       │   │   └─ Update streamingToolUses[index].unparsedToolInput
    │       │   │
    │       │   ├─ "thinking_delta"
    │       │   │   └─ onResponseLength(thinking)
    │       │   │
    │       │   └─ "signature_delta" → no-op
    │       │
    │       ├─ case "content_block_stop" → no-op
    │       │
    │       └─ case "message_delta"
    │           └─ setStreamMode("responding")
    │
    └─ else (non-streaming event types)
        │
        ├─ event.type === "tombstone"
        │   └─ onRemoveMessage(event.message)
        │
        ├─ event.type === "tool_use_summary" → no-op
        │
        ├─ event.type === "assistant"
        │   └─ Find thinking block, update streamingThinking state
        │
        └─ default
            ├─ setPartialText(null)
            └─ onMessage(event)  // Add to messages array
```

**Why this approach:**

- **Separation of concerns** - Event routing is separate from state updates
- **Immutability** - State updates use spread operators and filter/map
- **Optional chaining** - Prevents errors when callbacks aren't provided
- **Early returns** - Each case returns immediately for clarity

**Key insight:** The function has two distinct paths: streaming events (incremental updates) and non-streaming events (complete messages). The streaming path updates transient state (`streamingToolUses`, `streamingThinking`), while non-streaming events commit directly to the messages array.

### v2.1.76 Content Block Types Reference

The streaming handler now supports 11 additional content block types beyond `tool_use`:

| Block Type | Purpose | Source |
|------------|---------|--------|
| `server_tool_use` | Server-side tool invocation | Claude API extended |
| `web_search_tool_result` | Web search results | Built-in web search |
| `code_execution_tool_result` | Code execution output | Code interpreter |
| `mcp_tool_use` | MCP tool invocation | MCP protocol |
| `mcp_tool_result` | MCP tool response | MCP protocol |
| `container_upload` | Container file upload | Container execution |
| `web_fetch_tool_result` | Web fetch results | Built-in web fetch |
| `bash_code_execution_tool_result` | Bash execution output | Code execution |
| `text_editor_code_execution_tool_result` | Editor execution output | Code execution |
| `tool_search_tool_result` | Tool search results | Tool discovery |
| `compaction` | Compaction event | Context management |

All these types trigger `setStreamMode("tool-input")` to indicate tool-like processing is happening.

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

---

## 10. System Reminder Integration During Streaming

### Streaming State and isMeta Messages

System reminders (isMeta messages) can be injected during streaming:

```javascript
// ============================================
// System reminder injection during streaming
// Location: chunks.173.mjs
// ============================================

// When system reminders arrive during streaming:
// 1. They are added to messages array with isMeta: true
// 2. They pass through normalizeMessages unchanged
// 3. They are filtered by shouldShowMessageInChat
// 4. They do NOT affect streamingToolUses state

// Example: Token budget reminder during long streaming
{
    type: "user",
    message: {
        content: [{ type: "text", text: "<system-reminder>Token usage: 50k/200k</system-reminder>" }]
    },
    isMeta: true,  // This causes it to be hidden in UI
    isVisibleInTranscriptOnly: false
}
```

### Streaming Context Updates

System reminders can update context that affects streaming behavior:

```javascript
// From 04_system_reminder - context updates during streaming
// These updates can affect:
// 1. Permission context (may trigger permission recheck)
// 2. Token budget (may trigger compaction warning)
// 3. Mode changes (may affect auto-approve behavior)

// Example: Permission context update from hook
if (hookResult.updatedPermissions) {
    setAppState((state) => ({
        ...state,
        toolPermissionContext: applyRule(state.toolPermissionContext, hookResult.updatedPermissions)
    }));
}
```

### Attachment Producers and Streaming

```javascript
// ============================================
// Attachment producers during streaming
// Location: chunks.142.mjs
// ============================================

// Attachment producers generate system reminder attachments
// These are processed in the normalization stage (WJ)

// Types of attachment producers:
// 1. Tool result attachments (file reads, etc.)
// 2. Hook output attachments (PreToolUse/PostToolUse)
// 3. Plan mode attachments
// 4. Task reminder attachments

// Attachment processing in normalizeMessages:
case "attachment": {
    let converted = normalizeAttachmentForAPI(msg.attachment);
    let lastUserMsg = getLastMessage(normalized);
    if (lastUserMsg?.type === "user") {
        // Merge into preceding user message
        mergeUserMessages(lastUserMsg, converted);
    } else {
        normalized.push(...converted);
    }
}
```

---

## 11. Complete Streaming State Machine

### State Transition Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STREAMING STATE MACHINE                           │
│                                                                      │
│  Initial State:                                                      │
│  streamMode = "responding"                                           │
│  streamingToolUses = []                                              │
│  streamingThinking = null                                            │
│  inProgressToolUseIDs = Set()                                        │
│                                                                      │
│  Events:                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ stream_request_start                                             ││
│  │ └── streamMode = "requesting"                                    ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ content_block_start                                              ││
│  │ ├── type: "tool_use" → streamMode="tool-input"                  ││
│  │ │                    → add to streamingToolUses                  ││
│  │ ├── type: "thinking" → streamMode="thinking"                    ││
│  │ │                      → setStreamingThinking({isStreaming:true})││
│  │ └── type: "text" → streamMode="responding"                      ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ content_block_delta                                              ││
│  │ ├── input_json_delta → update streamingToolUses[].unparsedInput ││
│  │ ├── thinking_delta → onResponseLength(thinking)                 ││
│  │ └── text_delta → onResponseLength(text)                         ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ assistant (complete message)                                     ││
│  │ └── If has thinking block:                                      ││
│  │     setStreamingThinking({                                      ││
│  │       thinking: content,                                        ││
│  │       isStreaming: false,                                       ││
│  │       streamingEndedAt: Date.now()                              ││
│  │     })                                                          ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### State Consistency Invariants

1. **Single source of truth**: Each tool use ID exists in exactly ONE of:
   - `streamingToolUses` (input streaming)
   - `inProgressToolUseIDs` (executing)
   - `messages` (completed)

2. **No orphaned thinking**: `streamingThinking` is cleared after 30 seconds

3. **Mode transitions**: `streamMode` always reflects the current content type

### Error Recovery

```javascript
// When streaming errors occur:
// 1. resetLoadingState() clears all streaming state
// 2. Error message added to messages
// 3. Spinner hidden
// 4. Input re-enabled

const resetLoadingState = useCallback(() => {
    setIsLoading(false);
    setUserInputOnProcessing(undefined);
    responseLength.current = 0;
    setStreamingToolUses([]);
    setSpinnerText(null);
    setSpinnerColor(null);
    setSpinnerShimmer(null);
    refreshSpinnerTip();
    clearPendingBackgroundIndicator();
}, []);
```

### Streaming State Machine Deep Analysis

**What it does:** Manages the real-time display of LLM streaming responses, ensuring consistent state across streaming tool uses, thinking blocks, and committed messages while preventing duplicate displays.

**How it works:**
1. **Event-driven state updates** - Each SSE event triggers specific state transitions
2. **Triple-buffer pattern** - Tool uses exist in one of three mutually exclusive states:
   - `streamingToolUses` (input JSON still arriving)
   - `inProgressToolUseIDs` (input complete, tool executing)
   - `messages` (result received, fully committed)
3. **Filtering at render time** - MessageList filters out streaming tools that have moved to in-progress or committed
4. **Thinking block lifecycle** - Special 30-second timer for thinking display after streaming ends

**Why this approach:**
- **Separation of concerns** - Streaming state is separate from messages to avoid partial updates causing re-renders
- **No duplicate display** - The invariant that each tool ID is in exactly one collection prevents showing the same tool twice
- **Deferred values** - React's `useDeferredValue` for messages keeps input responsive during heavy streaming
- **Memory safety** - 30-second thinking timer prevents indefinite memory retention

**Key insight:** The `streamingToolUses` array is NOT cleared when the message is committed—it's cleared by `resetLoadingState()`. The filtering at render time prevents duplicates while allowing the streaming state to persist briefly for UI continuity. This is a deliberate design choice to avoid flickering during the transition from streaming to committed.

---

## 12. Performance Optimization Details

### React Compiler Cache Pattern

```javascript
// The e(N) pattern uses flat arrays for memoization:
// This is seen in the MessageList component

let cache = useCache(111);  // chunks.161.mjs uses 111 slots

// Cache slot usage:
// cache[0] = messages
// cache[1] = filtered messages result
// cache[2] = tool use IDs Set
// ... (each computed value gets a slot)

// Check if recomputation needed:
if (cache[0] !== messages) {
    cache[1] = computeFilteredMessages(messages);
    cache[0] = messages;
}
```

### Streaming Tool Use Filtering

```javascript
// From chunks.161.mjs - filter streaming tools that are already committed
// This is the verified implementation:

const activeStreamingTools = streamingToolUses.filter((tool) => {
    // Remove if already in inProgressToolUseIDs (completed streaming)
    if (inProgressToolUseIDs.has(tool.contentBlock.id)) return false;

    // Remove if already in committed messages
    if (messages.some((msg) =>
        msg.type === "assistant" &&
        msg.message.content[0]?.type === "tool_use" &&
        msg.message.content[0].id === tool.contentBlock.id
    )) return false;

    return true;
});
```

### Deferred Value Usage

```javascript
// Messages use deferred value to keep input responsive
let deferredMessages = useDeferredValue(messages);

// This means:
// 1. Input box updates immediately (high priority)
// 2. Message list updates slightly later (low priority)
// 3. User can continue typing during heavy streaming
```

---

## 13. Memory Leak Fix (v2.1.76)

### Problem Description

When streaming generators are terminated early (abort scenarios), the intermediate streaming buffers were not being explicitly released. This caused:

1. `streamingToolUses` array retained partial tool use objects
2. `streamingThinking` state retained thinking blocks
3. Response length accumulators kept growing
4. Spinner state variables were not reset

### Root Cause Analysis

The streaming state is updated during normal streaming flow:
```javascript
// During streaming:
setStreamingToolUses(prev => [...prev, newToolUse]);  // Accumulate
setStreamingThinking({ thinking, isStreaming: true }); // Set
responseLength.current += delta.length;                // Grow
```

But on abort, the cleanup was incomplete:
```javascript
// Before fix - incomplete cleanup:
setIsLoading(false);
abortController.abort();
// streamingToolUses, streamingThinking, responseLength NOT cleared
```

### Solution: Comprehensive resetLoadingState

```javascript
// ============================================
// resetLoadingState (YK) - Complete cleanup on abort
// Location: chunks.196.mjs:218
// ============================================

// ORIGINAL (for source lookup):
let YK = dA.useCallback(() => {
    C3(!1),           // setIsLoading(false)
    ZY(void 0),       // setUserInputOnProcessing(undefined)
    Qj.current = 0,   // responseLength = 0
    xq([]),           // setStreamingToolUses([])
    S3(null),         // setSpinnerText(null)
    OO(null),         // setSpinnerColor(null)
    xH(null),         // setSpinnerShimmer(null)
    l7(),             // refreshSpinnerTip()
    PB1()             // clearPendingBackgroundIndicator()
}, [C3, l7]);

// READABLE (for understanding):
const resetLoadingState = useCallback(() => {
    // Core loading state
    setIsLoading(false);
    setUserInputOnProcessing(undefined);

    // Streaming buffers (MEMORY LEAK FIX)
    responseLength.current = 0;
    setStreamingToolUses([]);       // Clear partial tool uses
    setSpinnerText(null);           // Clear spinner state
    setSpinnerColor(null);
    setSpinnerShimmer(null);

    // Tips and indicators
    refreshSpinnerTip();
    clearPendingBackgroundIndicator();
}, [setIsLoading, refreshSpinnerTip]);
```

### When resetLoadingState is Called

```javascript
// In handleCancel (TM) - chunks.196.mjs:420:
function handleCancel() {
    // ...
    resetLoadingState();  // dE()
    // ...
}

// In executeQuery finally block - chunks.188.mjs:
async function executeQuery(...) {
    try {
        // ... streaming ...
    } finally {
        resetLoadingState();  // Always cleanup
    }
}

// On streaming error:
catch (error) {
    resetLoadingState();
    setMessages(prev => [...prev, createErrorMessage(error)]);
}
```

### Memory Impact Analysis

**Before fix (memory leak scenario):**
1. User starts streaming with tool use
2. Tool use JSON accumulates in `streamingToolUses`
3. User presses Escape (abort)
4. `streamingToolUses` retains partial JSON
5. Repeat 100 times → 100 partial objects retained
6. GC eventually collects, but memory spikes during session

**After fix:**
1. User starts streaming with tool use
2. Tool use JSON accumulates in `streamingToolUses`
3. User presses Escape (abort)
4. `resetLoadingState()` immediately clears `streamingToolUses`
5. Memory returns to baseline immediately

### Related Cleanup Functions

```javascript
// Spinner-specific cleanup:
const refreshSpinnerTip = useCallback(() => {
    // Fetch new tip from tip provider
    // Clear any stale tip state
}, []);

// Background indicator cleanup:
const clearPendingBackgroundIndicator = useCallback(() => {
    // Clear pending background task notification
    // Reset background task state
}, []);
```

---

## 14. Complete Event Type Reference

### handleToolUseStream Event Types

The `xN6` function handles multiple event types from the LLM streaming API:

#### Non-Streaming Events (Immediate Processing)

| Event Type | Action | Line |
|------------|--------|------|
| `tombstone` | Remove message via callback | 2386-2388 |
| `tool_use_summary` | Return immediately (no UI update) | 2390 |
| `assistant` (complete message) | Extract thinking, call onMessage | 2391-2400 |
| `stream_request_start` | Set mode to "requesting" | 2402-2404 |

#### Streaming Events (State Updates)

| Event Type | Sub-Type | Action | Line |
|------------|----------|--------|------|
| `message_start` | - | Set TTFT if available | 2406-2409 |
| `message_stop` | - | Set mode "tool-use", clear streaming tools | 2411-2413 |
| `content_block_start` | `thinking` / `redacted_thinking` | Set mode "thinking" | 2418-2421 |
| `content_block_start` | `text` | Set mode "responding" | 2422-2424 |
| `content_block_start` | `tool_use` | Set mode "tool-input", add to streamingToolUses | 2425-2434 |
| `content_block_start` | Other types (v2.1.76) | Set mode "tool-input" | 2436-2448 |
| `content_block_delta` | `text_delta` | Update response length, partial text | 2453-2456 |
| `content_block_delta` | `input_json_delta` | Accumulate tool input JSON | 2458-2469 |
| `content_block_delta` | `thinking_delta` | Update response length | 2471-2472 |
| `content_block_delta` | `signature_delta` | No action | 2474-2475 |
| `content_block_stop` | - | No action | 2479-2480 |
| `message_delta` | - | Set mode "responding" | 2481-2482 |
| Default | - | Set mode "responding" | 2484-2485 |

#### v2.1.76 New Content Block Types

```javascript
// Additional block types that trigger "tool-input" mode:
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
```

These extended types support the agentic tool use system, where tools can trigger other tools or receive results from various sources.

---

## 15. Deep Algorithm Analysis

### Streaming State Machine Invariants

The streaming state machine maintains several critical invariants:

#### Invariant 1: Single Location for Each Tool Use ID

```
┌─────────────────────────────────────────────────────────────────────┐
│           TOOL USE ID LOCATION INVARIANT                             │
│                                                                      │
│  At any point in time, a tool use ID exists in EXACTLY ONE of:      │
│                                                                      │
│  1. streamingToolUses (JK)                                           │
│     └── Input JSON is still being streamed                          │
│     └── content_block_delta with input_json_delta events arriving   │
│                                                                      │
│  2. inProgressToolUseIDs (n4)                                        │
│     └── Input complete, tool is executing                           │
│     └── Waiting for tool result from tool executor                  │
│                                                                      │
│  3. messages (u7) - committed                                        │
│     └── Tool use complete with result                               │
│     └── Present in assistant message content array                  │
│                                                                      │
│  State transitions are UNIDIRECTIONAL:                              │
│  streamingToolUses → inProgressToolUseIDs → messages                │
└─────────────────────────────────────────────────────────────────────┘
```

**Why this matters:** The MessageList filter relies on this invariant to avoid showing duplicate tool uses. If a tool use ID appears in multiple places simultaneously, the UI would show duplicates.

#### Invariant 2: Thinking Block 30-Second Display Window

```javascript
// chunks.196.mjs:99-106
N8.useEffect(() => {
    if (MK && !MK.isStreaming && MK.streamingEndedAt) {
        let Y8 = 30000 - (Date.now() - MK.streamingEndedAt);
        if (Y8 > 0) {
            let V8 = setTimeout(k3, Y8, null);
            return () => clearTimeout(V8)
        } else k3(null)
    }
}, [MK]);
```

**The 30-second window:**
- Starts when `streamingEndedAt` is set (message complete)
- Ends when `Date.now() - streamingEndedAt >= 30000`
- Timer is set for remaining time if partially elapsed
- Thinking is cleared immediately if already expired

**Why 30 seconds?**
1. **User reading time:** Extended thinking blocks can be long; users need time to read
2. **Not permanent:** Thinking is auxiliary info, not part of permanent transcript (in chat view)
3. **Transcript preservation:** In transcript mode, thinking is preserved regardless of timer

#### Invariant 3: Mode Reflects Current Content Type

```
┌─────────────────────────────────────────────────────────────────────┐
│                 STREAM MODE TRANSITION TABLE                         │
│                                                                      │
│  Current Mode    Event                      New Mode                │
│  ─────────────── ────────────────────────── ──────────────          │
│  any             stream_request_start       "requesting"            │
│  any             content_block_start:text   "responding"            │
│  any             content_block_start:tool   "tool-input"            │
│  any             content_block_start:think  "thinking"              │
│  any             message_stop               "tool-use"              │
│  any             message_delta              "responding"            │
│  any             default case               "responding"            │
│                                                                      │
│  Note: "requesting" only appears briefly at request start           │
│  Note: "tool-use" indicates message complete, tools may execute     │
└─────────────────────────────────────────────────────────────────────┘
```

### Error Recovery Flow

When streaming errors occur, the cleanup sequence is:

```
1. Error caught in executeQuery catch block
   ↓
2. resetLoadingState() called
   ├── setIsLoading(false)
   ├── setUserInputOnProcessing(undefined)
   ├── responseLength.current = 0
   ├── setStreamingToolUses([])
   ├── setSpinnerText(null)
   ├── setSpinnerColor(null)
   ├── setSpinnerShimmer(null)
   ├── refreshSpinnerTip()
   └── clearPendingBackgroundIndicator()
   ↓
3. Error message added to messages
   └── setMessages(prev => [...prev, createErrorMessage(error)])
   ↓
4. Input re-enabled, user can retry
```

### Partial JSON Accumulation Strategy

```javascript
// When input_json_delta events arrive:
z((J) => {
    let M = J.find((D) => D.index === j);
    if (!M) return J;  // No entry for this index, skip
    return [...J.filter((D) => D !== M), {
        ...M,
        unparsedToolInput: M.unparsedToolInput + H
    }]
});
```

**Key design decisions:**

1. **Accumulate, don't parse:** The `unparsedToolInput` string accumulates partial JSON. Parsing happens later by the UI component.

2. **Replace entire entry:** The filter + spread pattern creates a new array with the updated entry, maintaining React immutability.

3. **Index-based matching:** Multiple tool uses can stream simultaneously (rare but possible). The `index` field identifies which tool use to update.

4. **No parse errors:** Partial JSON is never parsed during streaming. If the JSON is malformed when complete, the tool executor handles the error, not the UI.

### Partial JSON Accumulation Deep Analysis

**What it does:** Accumulates fragmented JSON deltas into a complete tool input string, enabling real-time display of tool arguments as they stream from the LLM.

**How it works:**

```javascript
// ============================================
// Partial JSON Accumulation Algorithm
// Location: chunks.173.mjs:2458-2469
// ============================================

// ORIGINAL (for source lookup):
case "input_json_delta": {
    let H = A.event.delta.partial_json, j = A.event.index;
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

// READABLE (for understanding):
function accumulatePartialJSON(delta, index, setStreamingToolUses) {
    const partialJSON = delta.partial_json;

    setStreamingToolUses(prevToolUses => {
        // Step 1: Find the entry matching this content block index
        const matchingEntry = prevToolUses.find(entry => entry.index === index);

        if (!matchingEntry) {
            // Defensive: ignore orphaned delta (shouldn't happen)
            return prevToolUses;
        }

        // Step 2: Create updated entry with accumulated JSON
        const updatedEntry = {
            ...matchingEntry,
            unparsedToolInput: matchingEntry.unparsedToolInput + partialJSON
        };

        // Step 3: Return new array with updated entry (React immutability)
        return [
            ...prevToolUses.filter(entry => entry !== matchingEntry),
            updatedEntry
        ];
    });
}

// Mapping: H→partialJSON, j→index, z→setStreamingToolUses, J→prevToolUses, M→matchingEntry
```

**Why this approach:**

1. **Append-only accumulation:** Each `input_json_delta` contains a fragment (1-50 chars typically). Concatenating is O(1) per fragment.

2. **Array replacement pattern:** React state requires new object references. The `filter + spread` pattern creates a new array while preserving all other entries.

3. **Index-based routing:** Multiple tool uses can stream in parallel (e.g., Claude decides to call 3 tools at once). The `index` matches deltas to the correct tool.

4. **No parsing during streaming:** Parsing partial JSON would fail. The unparsed string is stored until the complete message arrives.

**Key insight:** The `unparsedToolInput` field is essentially a StringBuilder for JSON. It accumulates all fragments until the message is complete, at which point the tool executor parses it. This design avoids:
- Parse errors on incomplete JSON
- Memory overhead of intermediate parsed objects
- Race conditions between streaming and parsing

---

## 16. handleToolUseStream (xN6) Source-Level Analysis

### Complete Function Signature and Parameters

```javascript
// ============================================
// handleToolUseStream (xN6) - Complete streaming event processor
// Location: chunks.173.mjs:2384-2488
// ============================================

// ORIGINAL (for source lookup):
function xN6(A, q, K, Y, z, _, w, O, $) {
    // A = event (stream event object)
    // q = onMessage (callback to add message to state)
    // K = onResponseText (callback for text deltas)
    // Y = setStreamMode (setter for streamMode state)
    // z = setStreamingToolUses (setter for streamingToolUses state)
    // _ = onTombstone (callback for tombstone messages)
    // w = setStreamingThinking (setter for thinking state)
    // O = onTTFT (callback for time-to-first-token metrics)
    // $ = setStreamingText (setter for streaming text state)
}

// READABLE (for understanding):
function handleToolUseStream(
    event,
    onMessage,
    onResponseText,
    setStreamMode,
    setStreamingToolUses,
    onTombstone,
    setStreamingThinking,
    onTTFT,
    setStreamingText
) {
    // ... implementation
}
```

### Event Type Routing Algorithm

**What it does:** Routes incoming events to appropriate state updates based on event type, maintaining streaming state consistency.

**How it works:**

```
┌──────────────────────────────────────────────────────────────────────┐
│                EVENT ROUTING DECISION TREE                            │
│                                                                       │
│  event.type?                                                         │
│  ├── "stream_event" or "stream_request_start" ──────────────────────│
│  │   ├── "stream_request_start" → setStreamMode("requesting")        │
│  │   └── event.event.type?                                           │
│  │       ├── "message_start" → onTTFT(ttftMs) if present            │
│  │       ├── "message_stop" → setStreamMode("tool-use"), clear tools│
│  │       └── switch(event.event.type)                                │
│  │           ├── "content_block_start"                               │
│  │           │   ├── "thinking"/"redacted_thinking" → mode="thinking"│
│  │           │   ├── "text" → mode="responding"                      │
│  │           │   ├── "tool_use" → mode="tool-input", add tool entry  │
│  │           │   └── server_tool_use/mcp_tool_use/etc → "tool-input" │
│  │           ├── "content_block_delta"                                │
│  │           │   ├── "text_delta" → onResponseText(text)             │
│  │           │   ├── "input_json_delta" → accumulate partial JSON    │
│  │           │   ├── "thinking_delta" → onResponseText(thinking)     │
│  │           │   └── "signature_delta" → (no-op)                     │
│  │           ├── "content_block_stop" → (no-op)                      │
│  │           ├── "message_delta" → setStreamMode("responding")       │
│  │           └── default → setStreamMode("responding")               │
│  │                                                                   │
│  └── Other types (non-streaming)                                     │
│      ├── "tombstone" → onTombstone(message)                          │
│      ├── "tool_use_summary" → (no-op, return)                        │
│      ├── "assistant" → check for thinking block, update state        │
│      └── default → onMessage(event)                                  │
└──────────────────────────────────────────────────────────────────────┘
```

### Complete Source with Annotation

```javascript
// ============================================
// handleToolUseStream - Complete annotated source
// Location: chunks.173.mjs:2384-2488
// ============================================

function xN6(A, q, K, Y, z, _, w, O, $) {
    // ==========================================
    // PHASE 1: Non-streaming event handling
    // ==========================================
    if (A.type !== "stream_event" && A.type !== "stream_request_start") {
        // Tombstone: Message deleted from history (e.g., after compact)
        if (A.type === "tombstone") {
            _?.(A.message);  // Notify tombstone handler
            return;
        }

        // Tool use summary: Metrics about completed tool (no UI action needed)
        if (A.type === "tool_use_summary") return;

        // Assistant message (complete, non-streaming)
        if (A.type === "assistant") {
            // Check if this message contains a thinking block
            let H = A.message.content.find((j) => j.type === "thinking");
            if (H && H.type === "thinking") {
                // Update thinking state with complete thinking content
                w?.(() => ({
                    thinking: H.thinking,
                    isStreaming: false,
                    streamingEndedAt: Date.now()
                }));
            }
        }

        // Default: Forward to message handler, clear streaming text
        $?.(() => null);
        q(A);
        return;
    }

    // ==========================================
    // PHASE 2: Request lifecycle events
    // ==========================================
    if (A.type === "stream_request_start") {
        Y("requesting");  // New API request starting
        return;
    }

    // TTFT (Time To First Token) metrics
    if (A.event.type === "message_start") {
        if (A.ttftMs != null) {
            O?.({ ttftMs: A.ttftMs });  // Report latency metric
        }
    }

    // Message complete - switch to tool-use mode for processing
    if (A.event.type === "message_stop") {
        Y("tool-use");
        z(() => []);  // Clear streaming tool uses
        return;
    }

    // ==========================================
    // PHASE 3: Content block events (main streaming)
    // ==========================================
    switch (A.event.type) {
        case "content_block_start":
            // Clear streaming text when new block starts
            $?.(() => null);

            switch (A.event.content_block.type) {
                case "thinking":
                case "redacted_thinking":
                    Y("thinking");  // Extended thinking in progress
                    return;

                case "text":
                    Y("responding");  // Text response streaming
                    return;

                case "tool_use": {
                    Y("tool-input");  // Tool input being streamed

                    // Create new streaming tool use entry
                    let H = A.event.content_block;  // { type, id, name, input }
                    let j = A.event.index;          // Position in response

                    z((J) => [...J, {
                        index: j,
                        contentBlock: H,
                        unparsedToolInput: ""
                    }]);
                    return;
                }

                // v2.1.76: Additional tool types treated as tool-input mode
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
                    return;
            }
            break;

        case "content_block_delta":
            switch (A.event.delta.type) {
                case "text_delta": {
                    let H = A.event.delta.text;
                    K(H);  // Forward text to response handler
                    $?.((j) => (j ?? "") + H);  // Accumulate streaming text
                    return;
                }

                case "input_json_delta": {
                    let H = A.event.delta.partial_json;
                    let j = A.event.index;

                    K(H);  // Forward to response handler (for activity tracking)

                    // Accumulate partial JSON for this tool
                    z((J) => {
                        let M = J.find((D) => D.index === j);
                        if (!M) return J;  // Entry not found, skip

                        // Create updated entry with appended JSON
                        return [...J.filter((D) => D !== M), {
                            ...M,
                            unparsedToolInput: M.unparsedToolInput + H
                        }];
                    });
                    return;
                }

                case "thinking_delta":
                    K(A.event.delta.thinking);  // Forward thinking text
                    return;

                case "signature_delta":
                    // No action needed for signature deltas
                    return;

                default:
                    return;
            }

        case "content_block_stop":
            // No action needed - complete blocks handled elsewhere
            return;

        case "message_delta":
            Y("responding");  // Return to responding mode
            return;

        default:
            Y("responding");  // Default to responding mode
            return;
    }
}

// Mapping: xN6→handleToolUseStream, A→event, q→onMessage, K→onResponseText,
//          Y→setStreamMode, z→setStreamingToolUses, _→onTombstone,
//          w→setStreamingThinking, O→onTTFT, $→setStreamingText
```

### Key Design Decisions

**Why this approach:**

1. **Early return pattern:** Each event type has a clear exit point, preventing fall-through bugs
2. **Switch on nested type:** The `event.event.type` and `event.event.content_block.type` structure follows the actual API response shape
3. **Optional chaining for callbacks:** `?.()` allows missing handlers without errors
4. **Array spread for immutability:** React state updates require new references

**Key insight:** The function is essentially a **state machine router**. It doesn't maintain state itself but dispatches to the appropriate state setters based on event type. This separation allows the state to live in React hooks while the routing logic is a pure function.

### v2.1.76 Content Block Types Reference

The following content block types were added in v2.1.76 to support expanded tool capabilities:

| Type | Purpose | Source |
|------|---------|--------|
| `server_tool_use` | Server-side tool execution (Claude API built-in tools) | Claude API streaming |
| `web_search_tool_result` | Results from web search tool | Claude API streaming |
| `code_execution_tool_result` | Code execution sandbox results | Claude API streaming |
| `mcp_tool_use` | MCP server tool invocation | MCP protocol |
| `mcp_tool_result` | Result from MCP server tool | MCP protocol |
| `container_upload` | Container/sandbox file upload operations | Sandbox system |
| `web_fetch_tool_result` | Results from web fetch operations | Web fetch tool |
| `bash_code_execution_tool_result` | Bash command execution results | Bash tool |
| `text_editor_code_execution_tool_result` | Text editor operations results | Editor tool |
| `tool_search_tool_result` | Tool discovery search results | Tool search |
| `compaction` | Auto-compaction events | Compaction system |

**Handling logic:** All these types are treated the same as `tool_use` - they trigger `setStreamMode("tool-input")` to display the tool-input spinner while the operation is in progress. The actual result processing happens when the complete message arrives.

---

## 17. Cross-Module Streaming Integration

### Integration with 03_llm_core

```
┌──────────────────────────────────────────────────────────────────────┐
│           LLM API → UI STREAMING INTEGRATION                          │
│                                                                       │
│  LLM API (chunks.107.mjs)                                            │
│  ├── streamMessages() returns AsyncIterable<StreamEvent>             │
│  │                                                                   │
│  └── Event Types:                                                    │
│      ├── stream_request_start (API call initiated)                   │
│      ├── message_start (response beginning)                          │
│      ├── content_block_start (new block: text/tool/thinking)        │
│      ├── content_block_delta (text/json/thinking deltas)             │
│      ├── content_block_stop (block complete)                         │
│      ├── message_delta (response status change)                      │
│      └── message_stop (response complete)                            │
│                                                                       │
│  handleToolUseStream (xN6)                                           │
│  ├── Routes events to state setters                                  │
│  └── State updates trigger React re-renders                          │
│                                                                       │
│  UI State Updates:                                                    │
│  ├── setStreamMode("responding"/"tool-input"/"thinking")            │
│  ├── setStreamingToolUses([...])                                     │
│  ├── setStreamingThinking({thinking, isStreaming})                   │
│  └── onResponseText(delta) → responseLength accumulation             │
└──────────────────────────────────────────────────────────────────────┘
```

### Integration with 04_system_reminder

During streaming, system reminders can be injected:

```javascript
// Attachment injection during streaming (from 04_system_reminder)
// When streaming is in progress, new attachments are queued

// In REPL component:
useEffect(() => {
    if (!isLoading) return;

    // Attachment producer runs during streaming
    const attachmentPromise = assembleAllAttachments(context);

    // Attachments injected as they arrive
    attachmentPromise.then(attachments => {
        setMessages(prev => [
            ...prev,
            ...attachments.map(normalizeAttachmentForAPI)
        ]);
    });
}, [isLoading]);
```

### Integration with 05_tools

Tool permission dialogs interrupt streaming:

```javascript
// In REPL component - tool permission queue
[a8, $A] = useState([]);  // toolUseConfirmQueue, setToolUseConfirmQueue

// When tool permission needed during streaming:
// 1. setStreamMode continues showing current content
// 2. Tool permission dialog overlays
// 3. User accepts/rejects
// 4. Streaming resumes or aborts

// In handleCancel (TM):
if (focusedInputDialog === "tool-permission") {
    a8[0]?.onAbort();  // Call abort handler
    $A([]);            // Clear queue
}
```

---

## 18. v2.1.76 Streaming-Specific Changes

### New Content Block Types

v2.1.76 adds support for additional content block types in `content_block_start`:

| Type | Purpose | UI Mode |
|------|---------|---------|
| `server_tool_use` | Server-side tool execution | tool-input |
| `web_search_tool_result` | Web search results | tool-input |
| `code_execution_tool_result` | Code execution output | tool-input |
| `mcp_tool_use` | MCP tool invocation | tool-input |
| `mcp_tool_result` | MCP tool response | tool-input |
| `container_upload` | Container file upload | tool-input |
| `web_fetch_tool_result` | Web fetch results | tool-input |
| `bash_code_execution_tool_result` | Bash execution output | tool-input |
| `text_editor_code_execution_tool_result` | Editor execution | tool-input |
| `tool_search_tool_result` | Tool search results | tool-input |
| `compaction` | Auto-compact operation | tool-input |

These are all routed to `setStreamMode("tool-input")` but may have different display treatments in the UI.

### Performance Improvements

1. **Spinner isolation:** The spinner animation runs on a 50ms timer independent of message list renders
2. **Streaming text accumulator:** The `setStreamingText` callback (`$`) allows text accumulation without triggering message list re-renders
3. **Partial JSON optimization:** The filter + spread pattern in `input_json_delta` handling minimizes array allocations

---

## 19. Deep Algorithm Analysis: handleToolUseStream Event Router

### Event Routing Decision Tree

The `handleToolUseStream` function (`xN6`) implements a hierarchical event router with the following decision structure:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EVENT ROUTING DECISION TREE                               │
│                                                                              │
│  INCOMING EVENT (A)                                                          │
│       │                                                                      │
│       ├── type === "tombstone"?                                              │
│       │       └── YES → _?.(A.message) [handleTombstone], RETURN            │
│       │                                                                      │
│       ├── type === "tool_use_summary"?                                       │
│       │       └── YES → RETURN [no UI action needed]                         │
│       │                                                                      │
│       ├── type === "assistant"?                                              │
│       │       └── YES → Check for thinking block, update state, RETURN      │
│       │                                                                      │
│       ├── type === "stream_request_start"?                                   │
│       │       └── YES → Y("requesting"), RETURN                             │
│       │                                                                      │
│       ├── type === "stream_event"?                                           │
│       │       │                                                              │
│       │       ├── event.type === "message_start"?                            │
│       │       │       └── YES → Record TTFT if present, CONTINUE            │
│       │       │                                                              │
│       │       ├── event.type === "message_stop"?                             │
│       │       │       └── YES → Y("tool-use"), z([]), RETURN                │
│       │       │                                                              │
│       │       └── Switch on event.type:                                      │
│       │               │                                                      │
│       │               ├── "content_block_start"                              │
│       │               │       │                                              │
│       │               │       ├── type === "thinking" / "redacted_thinking"  │
│       │               │       │       └── Y("thinking"), RETURN             │
│       │               │       │                                              │
│       │               │       ├── type === "text"                            │
│       │               │       │       └── Y("responding"), RETURN           │
│       │               │       │                                              │
│       │               │       ├── type === "tool_use"                        │
│       │               │       │       └── Y("tool-input"),                  │
│       │               │       │          z([...J, newToolUseEntry]), RETURN  │
│       │               │       │                                              │
│       │               │       └── [11 other types] → Y("tool-input"), RETURN│
│       │               │                                                      │
│       │               ├── "content_block_delta"                              │
│       │               │       │                                              │
│       │               │       ├── delta.type === "text_delta"               │
│       │               │       │       └── K(H), $?.(text + H), RETURN       │
│       │               │       │                                              │
│       │               │       ├── delta.type === "input_json_delta"         │
│       │               │       │       └── K(H), update streamingToolUses    │
│       │               │       │          at index j, RETURN                  │
│       │               │       │                                              │
│       │               │       ├── delta.type === "thinking_delta"           │
│       │               │       │       └── K(thinking), RETURN               │
│       │               │       │                                              │
│       │               │       └── delta.type === "signature_delta"          │
│       │               │               └── RETURN [no-op]                    │
│       │               │                                                      │
│       │               ├── "content_block_stop"                               │
│       │               │       └── RETURN [no-op for now]                    │
│       │               │                                                      │
│       │               ├── "message_delta"                                    │
│       │               │       └── Y("responding"), RETURN                   │
│       │               │                                                      │
│       │               └── default                                            │
│       │                       └── Y("responding"), RETURN                   │
│       │                                                                      │
│       └── [other types]                                                      │
│               └── $?.(() => null), q(A) [pass to message handler]           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

Legend:
  A = event object
  Y = setStreamMode
  z = setStreamingToolUses
  K = onTextDelta callback
  $ = setStreamingText
  _ = onTombstone callback
  q = onMessage callback
```

### State Transition Invariants

The streaming state machine maintains these critical invariants:

**Invariant 1: Tool Use Index Consistency**
```
When streamingToolUses[n] exists:
  - streamingToolUses[n].index === the event.index from content_block_start
  - streamingToolUses[n].contentBlock.id === the tool use ID
  - streamingToolUses[n].unparsedToolInput is the accumulated JSON string
```

**Invariant 2: Mode Reflects Current Content**
```
streamMode ∈ {"responding", "tool-input", "thinking", "requesting", "tool-use"}

mode → content_type mapping:
  "responding"   → text_delta or message_delta
  "tool-input"   → tool_use block or input_json_delta
  "thinking"     → thinking block or thinking_delta
  "requesting"   → stream_request_start (transient)
  "tool-use"     → message_stop (awaiting tool execution)
```

**Invariant 3: Streaming Thinking Expiry**
```
When streamingThinking.isStreaming === false AND streamingThinking.streamingEndedAt exists:
  - Timer is set for (30000 - (Date.now() - streamingEndedAt)) ms
  - After timer: streamingThinking === null
```

### Performance Characteristics

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Event routing (switch) | O(1) | O(1) |
| Tool use array update | O(n) | O(n) where n = concurrent tool uses |
| Streaming tool filter | O(n*m) | O(m) where m = streamingToolUses length |
| Text accumulation | O(1) amortized | O(k) where k = accumulated text length |

### Error Handling Strategy

The function uses fail-safe defaults:

1. **Unknown event types** → Route to default case, set mode "responding"
2. **Missing tool use entry** → Return unchanged array (no error)
3. **Null streamingText** → Create new string from delta
4. **Invalid JSON delta** → Accumulate anyway (parse happens later)

---

**Last Updated**: 2026-03-22 (Enhanced with event routing decision tree, invariants, performance analysis)
**Version**: Claude Code 2.1.76
**Status**: Complete - Full streaming event processing documented
