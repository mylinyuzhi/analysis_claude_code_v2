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
