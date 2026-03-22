# LLM Core: UI Linkage (Claude Code 2.1.76)

> Complete pipeline from user input → LLM API streaming → React state updates → Terminal UI rendering.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, LLM API)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Steering, Stream events)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (UI Components)

Key functions in this document:
- `onQuery` (ff) - REPL entry point for user message submission
- `handleQuery` (oc) - Executes agent loop with full context
- `handleStreamedEvent` (T11) - Callback receiving events from agent loop
- `processStreamEvent` (iW1) - Routes stream events to correct React state setters
- `mainAgentLoop` (ZR) - Core async generator yielding stream events
- `SessionLogRenderer` (KYq) - Transcript display component
- `AssistantMessageRenderer` (Yd1) - Per-message display component
- `MessageTranscript` (g91) - Full conversation history renderer

---

## Architecture Overview

The UI linkage connects the React terminal UI to the async generator LLM streaming pipeline:

```
[Terminal Input Box]
        │ onSubmit
        ▼
[REPL Component]
  onQuery callback (ff)
        │ submitQuery
        ▼
[Message State Update]
  setMessages([...existing, userMessage])
        │ executeQuery
        ▼
[Agent Loop Integration]
  Build system prompt + tool context
  for await (event of mainAgentLoop) {
    handleStreamedEvent(event)
  }
        │ ZR yields stream events
        ▼
[LLM Streaming]
  for await (event of AnthropicAPI.stream()) {
    yield events back to agent loop
  }
        │ yielded events
        ▼
[handleStreamedEvent]
  calls processStreamEvent
        │ dispatches to state setters
        ▼
[React State Updates]
  setMessages((m) => [...m, event])         ← full message: re-render
  setStreamMode("thinking"|"responding"...)  ← status bar update
        │ React reconciliation
        ▼
[Component Re-renders]
  SessionLogRenderer
    └── MessageTranscript
          ├── AssistantMessageRenderer
          └── ToolResultBlock renderer
```

---

## Stage 1: User Input → Query Submission

### onQuery - REPL query entry point

**What it does:** Receives user-submitted messages, prevents concurrent queries, updates UI state, and delegates to `handleQuery`.

**How it works:**

1. **Proactive mode abort**: If proactive mode is active, terminates it before proceeding
2. **Concurrency guard**: Checks `isQueryInProgress.current` (a `useRef`). If a query is running, enqueues the new message and returns
3. **Loading state**: Sets `isQueryInProgress.current = true`, calls `setIsLoading(true)`, appends user messages
4. **State sync**: Waits for React state flush via `new Promise` to ensure appended message is visible
5. **beforeQueryHook**: Runs hook if provided, abort if returns false
6. **Delegates to handleQuery**: Calls `oc` with complete message history

**Why this approach:**
- The `new Promise` wrapping `setMessages` flushes React's state batch before proceeding
- Using `useRef` for `isQueryInProgress` (not `useState`) avoids re-renders and prevents races

---

## Stage 2: Context Building → Agent Loop Entry

### handleQuery - Agent loop integration

**What it does:** Builds the full execution context and feeds messages into the main agent loop generator.

**How it works:**

1. **MCP session start**: Notifies MCP clients that a query has started
2. **User input logging**: Logs the user's input text for diagnostics
3. **Tool use context building**: Calls `J0` (getToolUseContext) to build permission context
4. **Parallel context loading** via `Promise.all`:
   - `loadFileHistoryContext` — git status, changed files
   - `buildSystemPrompt` (dZ) — assembles the system prompt
   - `loadInputContext` — user config, language preferences
   - `loadSystemContext` — platform info, environment
5. **System prompt composition**: Combines custom + default system prompt
6. **Agent loop execution**: `for await (let event of ZR({...})) handleStreamedEvent(event)`
7. **Post-query cleanup**: Resets loading state, runs profiling report

**Key insight:** The `for await` loop over `ZR` is intentionally synchronous-per-event. Each event is fully processed by `handleStreamedEvent` before the next event is pulled. This ensures React state updates happen in strict event-arrival order.

---

## Stage 3: Stream Events → React State

### handleStreamedEvent - Stream event dispatcher

**What it does:** The bridge between agent loop's yielded events and React state setters. Each event from the loop passes through this function.

**How it works:**

Delegates to `processStreamEvent` which dispatches each event to appropriate React state setters:
- `setMessages()` for complete messages
- `updateTokenCounter()` for streaming chunks
- `setStreamMode()` for mode transitions
- `setStreamingToolUses()` for tool input previews

### processStreamEvent - Event routing to state

**What it does:** Maps each event type from the agent loop to specific React state mutations.

**Tier 1: Complete events** (add to messages state, trigger full re-render)
- `type: "assistant"` — A complete LLM message
- `type: "user"` — Tool result or user-injected message
- `type: "tombstone"` — A message that was retracted

**Tier 2: Stream events** (update transient state only)
- `type: "stream_request_start"` → `setStreamMode("requesting")`
- `content_block_start` (text) → `setStreamMode("responding")`
- `content_block_start` (thinking) → `setStreamMode("thinking")`
- `content_block_start` (tool_use) → `setStreamMode("tool-input")`, create streaming tool entry
- `content_block_delta` (text) → `onStreamingChunk(text)` (token counter)
- `content_block_delta` (input_json) → append to `streamingToolUses`

**Why `content_block_stop` does NOT trigger a re-render:**

When a content block finishes, `processStreamEvent` returns early on `content_block_stop` — it does NOT call `onMessageUpdate`. The actual re-render happens when `llmRequestGenerator` yields the complete assistant message. That complete message arrives as a Tier 1 `"assistant"` event and triggers the re-render.

---

## Stage 4: Stream State Machine

The `streamMode` state variable drives which loading indicator is shown:

| State | Trigger | UI Effect |
|-------|---------|-----------|
| `"requesting"` | `stream_request_start` | Shows "..." waiting indicator |
| `"thinking"` | `content_block_start` (thinking) | Shows thinking animation |
| `"responding"` | `content_block_start` (text) | Shows response streaming |
| `"tool-input"` | `content_block_start` (tool_use) | Shows "Building tool input..." |
| `"tool-use"` | `message_stop` | Shows "Executing tool..." |
| `null` | Initial / after query ends | No indicator |

---

## Stage 5: UI Rendering Components

### SessionLogRenderer (KYq)

**What it does:** The top-level component that displays the conversation transcript. Receives `messages` as a prop and renders all messages in order.

**How it reacts to streaming:**

The component uses React's memo cache pattern. When `messages` array reference changes (which happens every time `setMessages` is called), the `MessageTranscript` element is only recreated.

### AssistantMessageRenderer (Yd1)

**What it does:** Renders a single assistant message text with optional bold/dim styling and subtitle.

### BashOutputRenderer (BYq)

**What it does:** Shows shell execution output in a detail panel. Uses polling to refresh content while a shell is still running.

**How it connects to streaming:**
1. Shell execution results are written to disk by the BashTool
2. When the complete tool result arrives, shell status changes from `"running"` to `"completed"`
3. BashOutputRenderer reads final output from disk and renders it
4. While `"running"`, it polls on a 1-second timer

---

## Complete Event Sequence (Example: Text Response)

```
User types: "what is 2+2?"
           ▼
onQuery → handleQuery → buildSystemPrompt → mainAgentLoop

EVENT 1: { type: "stream_request_start" }
  → setStreamMode("requesting")

EVENT 2: { type: "stream_event", event: { type: "content_block_start", content_block: {type:"text"} } }
  → setStreamMode("responding")

EVENT 3-N: { type: "stream_event", event: { type: "content_block_delta", delta: {type:"text_delta", text:"..."} } }
  → onStreamingChunk("...")

EVENT N+1: { type: "stream_event", event: { type: "message_stop" } }
  → setStreamMode("tool-use"), setStreamingToolUses([])

EVENT N+2: { type: "assistant", message: {content:[{type:"text",text:"2+2=4"}]} }
  → setMessages([...existing, event])
  ← React re-renders: "2+2=4" appears in conversation

Finally: resetLoadingState(), setIsLoading(false), setStreamMode(null)
```

---

## Architecture Trade-offs

### React Memo Cache Pattern

All Ink components use `useMemoCache` (from React compiler) instead of `useMemo`:
- **Pro**: Zero allocation cost per render hit (cache slot read is O(1))
- **Con**: More verbose code

### Streaming Architecture: Discrete Messages vs. True Streaming

Uses **discrete complete messages** rather than mutable streaming state:
- **Pro**: Simple React reconciliation
- **Pro**: Each message has stable `uuid` for efficient list rendering
- **Con**: For long responses, there are N re-renders, not continuous streaming

### Concurrent Query Prevention

The `isQueryInProgress` `useRef` (not `useState`) is the critical concurrency guard:
- `useRef` values are synchronous and don't trigger re-renders
- Ideal for guards that need immediate checking within event handlers

### Tombstone Mechanism

Messages can be removed mid-display via the `"tombstone"` event type:
- Handles scenarios where tool use failed and its result needs retraction
- Handles compact replacing conversation history
- Also handles agent timeout causing partial response withdrawal

---

## Summary

The UI linkage represents a sophisticated pipeline that:

1. **Captures user input** through the REPL component
2. **Prevents concurrency** using synchronous `useRef` guards
3. **Builds execution context** in parallel for performance
4. **Streams events** incrementally from the agent loop
5. **Routes events** to appropriate React state setters
6. **Triggers re-renders** only when appropriate (complete messages, not deltas)
7. **Displays results** via optimized terminal components

The key insight is that while the LLM is streaming, the UI displays progress via state machine (streamMode) and preview state (streamingToolUses), but actual message rendering only happens on complete message arrival.

---

## Cross-Feature Linkages

### Integration with Agent Loop (03_llm_core/agent_loop.md)

**Event Source:**
The UI receives events from the main agent loop async generator:

```javascript
// In handleQuery (oc):
for await (let event of mainAgentLoop({...})) {
    handleStreamedEvent(event);
}
```

**Event Types from Agent Loop:**
| Event Type | Source in Agent Loop | UI Effect |
|------------|---------------------|-----------|
| `stream_request_start` | Before API call | Shows requesting indicator |
| `stream_event` | Direct from API SSE | Updates streaming state |
| `assistant` | After API response complete | Adds message to transcript |
| `user` | Tool result injection | Adds tool result to transcript |
| `tombstone` | Message removal | Removes message from transcript |
| `system` | System notifications | Shows system message |

### Integration with Streaming (03_llm_core/stream_processing.md)

**SSE Event Processing:**
The streaming module converts raw SSE events into agent loop events:

```
Anthropic API SSE
    ↓
streamingQueryCore (mGq)
    ↓
Yields stream_event objects
    ↓
mainAgentLoop (ZR) yields to UI
    ↓
handleStreamedEvent (T11) processes
```

**Delta Assembly:**
For tool_use blocks, the streaming module assembles partial JSON:

```javascript
// In streamingQueryCore:
if (event.type === "content_block_delta" && event.delta.type === "input_json_delta") {
    // Append to accumulating JSON string
    streamingToolInputJson += event.delta.partial_json;
    // Yield preview event
    yield { type: "stream_event", event: {...} };
}
```

### Integration with Tools (05_tools)

**Tool Execution UI Flow:**

```
User sees: "Building tool input..."
    ↓ (streaming completes JSON)
setStreamMode("tool-use")
    ↓ (tool execution starts)
User sees: "Executing tool..."
    ↓ (tool completes)
Tool result arrives as "user" event
    ↓
Message added to transcript
```

**Bash Output Polling:**
For long-running Bash commands, the UI polls for output:

```javascript
// In BashOutputRenderer (BYq):
useEffect(() => {
    if (status === "running") {
        const interval = setInterval(() => {
            // Read output file from disk
            refreshOutput();
        }, 1000);
        return () => clearInterval(interval);
    }
}, [status]);
```

### Integration with System Reminders (04_system_reminder)

**Attachment Injection Flow:**

```
mainAgentLoop yields user event with attachments
    ↓
handleStreamedEvent receives event
    ↓
processStreamEvent adds to messages state
    ↓
SessionLogRenderer displays as system-reminder
```

**Meta Message Display:**
Attachments with `isMeta: true` are displayed differently:
- No user attribution
- Styled as system information
- Can be collapsed in UI

### Integration with Compact (07_compact)

**Compaction UI Notification:**
When compaction occurs, the UI shows a notification:

```
checkAndTriggerAutoCompact (fs4)
    ↓ (triggers compaction)
Yields compaction events
    ↓
UI shows: "Compressing conversation..."
    ↓ (compaction complete)
New summary message appears
```

**Tombstone for Compaction:**
After compaction, old messages may be replaced:

```javascript
// Agent loop yields tombstone events:
yield { type: "tombstone", uuids: [...removedMessageUuids] };

// UI removes messages:
setMessages(prev => prev.filter(m => !uuids.includes(m.uuid)));
```

### Integration with Proactive Mode

**Proactive Mode Abort:**
When user submits input during proactive mode:

```javascript
// In onQuery (ff):
if (proactiveController) {
    proactiveController.abort();
    setProactiveMode(false);
}
```

**Proactive Prompt Display:**
Proactive prompts are enqueued if a query is in progress:

```javascript
// In onQuery:
if (isQueryInProgress.current) {
    setQueuedPrompt(userInput);
    return;
}
```

### Integration with Plan Mode (06_plan_mode)

**Plan Mode State Indicators:**
The UI shows plan mode status:

| State | UI Indicator |
|-------|-------------|
| In plan mode | Status bar shows "Plan mode" |
| Plan file exists | Path shown in status |
| Exit requested | Shows "Exiting plan mode..." |

### Integration with Background Tasks (08_background_tasks)

**Task Status Display:**
Background task status appears in the UI:

```
Task started
    ↓
UI shows: "Task 123 started (type: shell)"
    ↓ (task runs in background)
User can continue conversation
    ↓
TaskOutput tool fetches result
```

---

## React State Management

### State Variables

| State | Type | Purpose |
|-------|------|---------|
| `messages` | `Message[]` | Conversation transcript |
| `isLoading` | `boolean` | Query in progress flag |
| `streamMode` | `string \| null` | Current streaming state |
| `streamingToolUses` | `Map<string, ToolUse>` | Tool inputs being streamed |
| `queuedPrompt` | `string \| null` | Enqueued user input |
| `proactiveMode` | `boolean` | Proactive mode active |
| `tokenCounter` | `number` | Tokens streamed this turn |

### State Update Patterns

**Batching Strategy:**
React batches state updates within event handlers:

```javascript
// These updates are batched:
setStreamMode("responding");
updateTokenCounter(prev => prev + chunk.length);
setStreamingToolUses(prev => new Map(prev).set(id, toolUse));
// Only one re-render occurs
```

**Immutable Updates:**
All state updates use immutable patterns:

```javascript
// Add message:
setMessages(prev => [...prev, newMessage]);

// Remove message:
setMessages(prev => prev.filter(m => m.uuid !== removedUuid));

// Update streaming tool:
setStreamingToolUses(prev => {
    const next = new Map(prev);
    next.set(toolId, { ...prev.get(toolId), inputJson: accumulated });
    return next;
});
```

---

## Component Hierarchy

```
App (Root)
├── REPL (Input handling)
│   ├── InputBox (Text entry)
│   └── onQuery callback
│
├── SessionLogRenderer (KYq)
│   ├── MessageTranscript (g91)
│   │   ├── UserMessageRenderer
│   │   ├── AssistantMessageRenderer (Yd1)
│   │   ├── ToolUseBlockRenderer
│   │   └── ToolResultBlockRenderer
│   │
│   └── StreamingIndicator
│       ├── RequestingIndicator
│       ├── ThinkingIndicator
│       ├── RespondingIndicator
│       └── ToolExecutionIndicator
│
├── StatusBar
│   ├── ModelIndicator
│   ├── TokenUsageDisplay
│   ├── PlanModeIndicator
│   └── BackgroundTaskStatus
│
└── DetailPanels
    ├── BashOutputRenderer (BYq)
    ├── ImagePreviewRenderer
    └── PdfPageRenderer
```

---

## Performance Optimizations

### Message List Virtualization

The `MessageTranscript` component uses key-based rendering for efficiency:

```javascript
// Messages are rendered with stable keys:
messages.map(message => (
    <MessageRenderer key={message.uuid} message={message} />
));
```

React's reconciliation efficiently updates only changed messages.

### Debounced Token Counter

The token counter updates are debounced to prevent excessive re-renders:

```javascript
// Token counter uses functional update
updateTokenCounter(prev => prev + chunkText.length);
// UI only re-renders on complete messages
```

### Streaming Tool Preview

Tool input JSON is assembled in streaming state, not messages:

```javascript
// During streaming:
streamingToolUses.set(toolId, {
    id: toolId,
    name: toolName,
    inputJson: partialJson  // Accumulated incrementally
});

// Only when complete:
// ToolUse is added to message content
```

This prevents re-rendering the entire transcript for each JSON delta.

---

## Error Handling

### Query Error Recovery

When an error occurs during query execution:

```javascript
// In handleQuery:
try {
    for await (let event of mainAgentLoop(...)) {
        handleStreamedEvent(event);
    }
} catch (error) {
    // Add error message to transcript
    setMessages(prev => [...prev, {
        type: "system",
        subtype: "error",
        content: error.message
    }]);
} finally {
    // Always reset loading state
    setIsLoading(false);
    setStreamMode(null);
}
```

### Tombstone Mechanism (VERIFIED)

> **Source:** `chunks.148.mjs:1063-1071`

Tombstones remove orphaned messages from the UI when context overflow triggers a reset:

```javascript
// ============================================
// Tombstone event generation — orphaned message cleanup
// Location: chunks.148.mjs:1063-1071
// ============================================

// ORIGINAL:
if (D6) {
    for (let u6 of e) yield {
        type: "tombstone",
        message: u6
    };
    if (d("tengu_orphaned_messages_tombstoned", {
        orphanedMessageCount: e.length,
        queryChainId: u,
        queryDepth: R.depth
    }),
    e.length = 0, Y6.length = 0, H6.length = 0, J6 = !1, s)
        s.discard(), s = new ui6(X.options.tools, _, X)
}

// READABLE:
if (contextOverflowDetected) {
    // Yield tombstone for every orphaned message
    for (let msg of orphanedMessages) yield {
        type: "tombstone",
        message: msg
    };
    logEvent("tengu_orphaned_messages_tombstoned", {
        orphanedMessageCount: orphanedMessages.length,
        queryChainId: chainId,
        queryDepth: recursionState.depth
    });
    // Reset all message buffers
    orphanedMessages.length = 0;
    toolResults.length = 0;
    assistantMessages.length = 0;
    hasCompletedToolExecution = false;
    // Reset streaming tool executor
    if (streamingToolExecutor) {
        streamingToolExecutor.discard();
        streamingToolExecutor = new StreamingToolExecutor(tools, canUseTool, context);
    }
}

// Mapping: D6→contextOverflowDetected, e→orphanedMessages, u→chainId,
//   R→recursionState, ui6→StreamingToolExecutor, s→streamingToolExecutor
```

**Tombstone lifecycle:**

```
Context overflow detected (D6 = true)
  │
  ├── For each orphaned message → yield { type: "tombstone", message }
  │   └── UI: setMessages(prev => prev.filter(m => m.uuid !== tombstone.message.uuid))
  │
  ├── Emit tengu_orphaned_messages_tombstoned telemetry
  │
  ├── Clear all buffers (orphanedMessages, toolResults, assistantMessages)
  │
  └── Reset StreamingToolExecutor → new instance with clean state
```

### Stream Mode State Transitions (VERIFIED)

> **Source:** `chunks.147.mjs:1828-1831`

```javascript
// Location: chunks.147.mjs:1828-1831

// ORIGINAL:
if (!J && G.type === "stream_event" &&
    G.event.type === "content_block_start" &&
    G.event.content_block.type === "text") {
    J = !0, Y.setStreamMode?.("responding")
}
if (G.type === "stream_event" &&
    G.event.type === "content_block_delta" &&
    G.event.delta.type === "text_delta") {
    let f = G.event.delta.text.length;
    Y.setResponseLength?.((v) => v + f)
}

// READABLE:
// Transition: "requesting" → "responding" on first text block
if (!hasStartedResponding && event.type === "stream_event" &&
    event.event.type === "content_block_start" &&
    event.event.content_block.type === "text") {
    hasStartedResponding = true;
    toolUseContext.setStreamMode?.("responding");
}
// Accumulate response length for each text delta
if (event.type === "stream_event" &&
    event.event.type === "content_block_delta" &&
    event.event.delta.type === "text_delta") {
    let charCount = event.event.delta.text.length;
    toolUseContext.setResponseLength?.((prev) => prev + charCount);
}
```

**State machine:**

```
Query submitted
  └── setStreamMode("requesting")       ← set by REPL before calling agent loop

First text content_block_start event
  └── setStreamMode("responding")        ← set inside streaming loop (J flag)

Each text_delta event
  └── setResponseLength(prev + charCount) ← accumulate for UI display

Stream complete / Error
  └── setStreamMode(null)                ← reset in finally block
```

### Stream Event Types Yielded by Agent Loop

| Event Type | Source | UI Handler |
|------------|--------|------------|
| `stream_request_start` | Agent loop start | `setStreamMode("requesting")` |
| `stream_event` (content_block_start, text) | mGq SSE | `setStreamMode("responding")` |
| `stream_event` (content_block_delta, text_delta) | mGq SSE | `setResponseLength(updater)` |
| `stream_event` (content_block_start, thinking) | mGq SSE | `setStreamMode("thinking")` |
| `stream_event` (content_block_start, tool_use) | mGq SSE | `setStreamMode("tool-input")` |
| `assistant` | Completed content block | `setMessages([...prev, event])` |
| `user` (tool_result) | Tool execution complete | `setMessages([...prev, event])` |
| `tombstone` | Context overflow | `setMessages(prev => filter(...))` |
| `system` (retry) | _P1 retry event | Show retry indicator |

---

## Telemetry Events

### UI Interaction Events

```javascript
// Query submission:
logEvent("tengu_query_submitted", {
    messageLength: userMessage.length,
    hasAttachments: boolean
});

// Streaming events:
logEvent("tengu_stream_event", {
    type: eventType,
    blockType: contentBlockType
});

// Orphaned messages tombstoned (context overflow):
logEvent("tengu_orphaned_messages_tombstoned", {
    orphanedMessageCount: number,
    queryChainId: string,
    queryDepth: number
});
```

### Performance Metrics

```javascript
// UI rendering metrics:
logEvent("tengu_message_render_time", {
    messageCount: messages.length,
    renderTimeMs: duration
});
```
