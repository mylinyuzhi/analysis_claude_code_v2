# SDK UI Linkage — Stream Events → UI State

## Overview

The SDK stream events don't just carry data — they drive a state machine that controls what the interactive CLI renders in real time. This document analyzes the `handleToolUseStream` function (`xN6`) in `chunks.173.mjs`, which is the **central dispatcher** that transforms raw Claude API streaming events into:

1. **UI state transitions** — what animation/indicator to show (thinking, responding, tool-input, etc.)
2. **Incremental text output** — each text delta appended to the visible response
3. **Tool use tracking** — building the in-progress tool invocation list
4. **Thinking content** — displaying extended thinking in real time

> **See also:** [sdk_ui_state_machine.md](./sdk_ui_state_machine.md) for a complete state machine reference with state transition diagrams and callback interface documentation.

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
    // ... rest of function
}

// READABLE (for understanding):
function handleToolUseStream(event, onEvent, onDeltaText, updateUIState, updateToolUses,
                             onTombstone, onThinking, onTTFT, textAccumulator) {
    // Non-streaming events handled first
    if (event.type !== "stream_event" && event.type !== "stream_request_start") {
        // Tombstone = message replacement signal
        if (event.type === "tombstone") {
            onTombstone?.(event.message);
            return;
        }
        // Tool use summaries are silently consumed
        if (event.type === "tool_use_summary") return;

        // Assistant message complete = check for thinking content
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
        // Clear text accumulator, pass event to collector
        textAccumulator?.(() => null);
        onEvent(event);
        return;
    }
    // ... streaming event handling continues
}

// Mapping: xN6→handleToolUseStream, A→event, q→onEvent, K→onDeltaText, Y→updateUIState,
//          z→updateToolUses, _→onTombstone, w→onThinking, O→onTTFT, $→textAccumulator
```

### Parameter Analysis

| Parameter | Obfuscated | Type | Purpose |
|-----------|------------|------|---------|
| `event` | `A` | StreamEvent | The incoming stream event object |
| `onEvent` | `q` | `(event) => void` | Callback to collect non-streaming events |
| `onDeltaText` | `K` | `(text: string) => void` | Callback for text/JSON/thinking deltas |
| `updateUIState` | `Y` | `(state: string) => void` | Driver for UI state machine |
| `updateToolUses` | `z` | `(updater) => void` | Updates in-progress tool use list |
| `onTombstone` | `_` | `(message) => void` | Handles message replacement events |
| `onThinking` | `w` | `(updater) => void` | Updates thinking panel on completion |
| `onTTFT` | `O` | `({ttftMs}) => void` | Captures time-to-first-token |
| `textAccumulator` | `$` | `(updater) => void` | Optional running text accumulator |

### Event Type Routing

```javascript
// ============================================
// handleToolUseStream - Event type routing logic
// Location: chunks.173.mjs:2384-2488
// ============================================

// Branch 1: stream_request_start
if (event.type === "stream_request_start") {
    updateUIState("requesting");  // Y("requesting")
    return;
}

// Branch 2: message_start (for TTFT)
if (event.event.type === "message_start") {
    if (event.ttftMs != null) {
        onTTFT?.({ ttftMs: event.ttftMs });
    }
}

// Branch 3: message_stop
if (event.event.type === "message_stop") {
    updateUIState("tool-use");
    updateToolUses(() => []);  // Clear tool use list
    return;
}

// Branch 4: content_block_start (main switch)
switch (event.event.content_block.type) {
    case "thinking":
    case "redacted_thinking":
        updateUIState("thinking");
        return;
    case "text":
        updateUIState("responding");
        return;
    case "tool_use":
        updateUIState("tool-input");
        // Add tool use to tracking list
        updateToolUses((list) => [...list, {
            index: event.event.index,
            contentBlock: event.event.content_block,
            unparsedToolInput: ""
        }]);
        return;
    // ... other content block types
}

// Branch 5: content_block_delta (delta handling)
switch (event.event.delta.type) {
    case "text_delta":
        onDeltaText(event.event.delta.text);
        textAccumulator?.((acc) => (acc ?? "") + event.event.delta.text);
        return;
    case "input_json_delta":
        onDeltaText(event.event.delta.partial_json);
        // Update tool use's unparsed input
        updateToolUses((list) => {
            let toolUse = list.find((t) => t.index === event.event.index);
            if (!toolUse) return list;
            return [...list.filter((t) => t !== toolUse), {
                ...toolUse,
                unparsedToolInput: toolUse.unparsedToolInput + event.event.delta.partial_json
            }];
        });
        return;
    case "thinking_delta":
        onDeltaText(event.event.delta.thinking);
        return;
}
```

---

## The UI State Machine

The UI indicator cycles through these states driven by stream events:

```
                    ┌─────────────────────────────────────────────┐
                    │            UI State Machine                 │
                    │                                             │
  stream_request_start ──► "requesting"                          │
                    │                                             │
  content_block_start (thinking/redacted_thinking) ──► "thinking"│
                    │                                             │
  content_block_start (text) ──► "responding"                    │
  message_delta ──► "responding"                                 │
  (default) ──► "responding"                                     │
                    │                                             │
  content_block_start (tool_use/server_tool) ──► "tool-input"   │
  content_block_start (result types) ──► "tool-input"            │
                    │                                             │
  message_stop ──► "tool-use" (then clears tool uses list)       │
                    │                                             │
                    └─────────────────────────────────────────────┘
```

**State semantics:**
- `"requesting"` — Waiting for first byte from API (spinner: "Thinking...")
- `"thinking"` — Extended thinking content block streaming (spinner: "Thinking deeply...")
- `"responding"` — Text content streaming (live text output)
- `"tool-input"` — Tool input JSON streaming (spinner: "Using Bash...")
- `"tool-use"` — Tool execution phase (spinner: "Running tool...")

### Complete State Transition Table

| Current State | Event | Next State | Action |
|--------------|-------|------------|--------|
| (any) | `stream_request_start` | `"requesting"` | Show "Thinking..." spinner |
| `"requesting"` | `content_block_start(thinking)` | `"thinking"` | Show thinking panel |
| `"requesting"` | `content_block_start(text)` | `"responding"` | Begin text output |
| `"requesting"` | `content_block_start(tool_use)` | `"tool-input"` | Begin tool JSON display |
| `"thinking"` | `content_block_stop` | (back to parent) | End thinking display |
| `"thinking"` | `content_block_start(text)` | `"responding"` | Transition to text |
| `"responding"` | `content_block_start(tool_use)` | `"tool-input"` | Begin tool input |
| `"tool-input"` | `content_block_stop` | `"responding"` | Return to text/next |
| (any) | `message_stop` | `"tool-use"` | Execute queued tools |
| `"tool-use"` | (tool completion) | `"idle"` | Clear tool list |

### Stream Event → UI State Mapping

| Claude API Event | UI State | Display Behavior |
|-----------------|----------|------------------|
| `message_start` | `"requesting"` | Initial spinner |
| `content_block_start.type="thinking"` | `"thinking"` | Thinking panel with streaming content |
| `content_block_start.type="redacted_thinking"` | `"thinking"` | Thinking panel with "..." placeholder |
| `content_block_start.type="text"` | `"responding"` | Streaming text output |
| `content_block_start.type="tool_use"` | `"tool-input"` | Tool name + JSON input spinner |
| `content_block_start.type="server_tool` | `"tool-input"` | Server-side tool indicator |
| `content_block_delta.type="text_delta"` | `"responding"` | Append text to output |
| `content_block_delta.type="input_json_delta"` | `"tool-input"` | Accumulate tool JSON |
| `content_block_delta.type="thinking_delta"` | `"thinking"` | Append to thinking panel |
| `content_block_stop` | (context-dependent) | End current block |
| `message_stop` | `"tool-use"` | Tools execute, then clear |

**TTFT (Time-to-First-Token) Metric:**
When `message_start` event arrives with `ttftMs`, the `onTTFT` callback is invoked. This allows the UI to display latency metrics:
```javascript
if (event.event.type === "message_start") {
    if (event.ttftMs != null) {
        onTTFT?.({ ttftMs: event.ttftMs });  // ~150-500ms typical
    }
}
```

---

## handleToolUseStream (xN6) — Full Analysis

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
        // ... content_block_stop case omitted
    }
}

// READABLE (for understanding):
function handleToolUseStream(
    event,             // A: The stream event to process
    onNonStreamEvent,  // q: Handler for non-streaming event types
    onDeltaText,       // K: Callback to append text/JSON/thinking content
    updateUIState,     // Y: Drives UI state machine
    updateToolUses,    // z: Updates in-progress tool use list
    onTombstone,       // _: Handles message tombstone (replacement)
    onThinking,        // w: Updates thinking state after message completion
    onTTFT,            // O: Reports time-to-first-token metric
    onRawText          // $: Optional callback for raw accumulated text
) {
    // ─── Non-streaming event types ────────────────────────────────────────
    if (event.type !== "stream_event" && event.type !== "stream_request_start") {
        if (event.type === "tombstone") {
            // Tombstone: the previous message was replaced. Notify UI.
            onTombstone?.(event.message);
            return;
        }
        if (event.type === "tool_use_summary") return;  // Internal: skip
        if (event.type === "assistant") {
            // For completed assistant messages: check for thinking block
            let thinkingBlock = event.message.content.find((block) => block.type === "thinking");
            if (thinkingBlock?.type === "thinking") {
                // Notify thinking panel: streaming ended, show final content
                onThinking?.(() => ({
                    thinking: thinkingBlock.thinking,
                    isStreaming: false,
                    streamingEndedAt: Date.now()
                }));
            }
        }
        onRawText?.(() => null);  // Clear raw text accumulator
        onNonStreamEvent(event);  // Pass to general event handler
        return;
    }

    // ─── stream_request_start ─────────────────────────────────────────────
    if (event.type === "stream_request_start") {
        updateUIState("requesting");  // Show "Thinking..." spinner
        return;
    }

    // ─── message_start (with TTFT metric) ──────────────────────────────────
    if (event.event.type === "message_start") {
        if (event.ttftMs != null) {
            onTTFT?.({ ttftMs: event.ttftMs });  // Report time-to-first-token
        }
    }

    // ─── message_stop ─────────────────────────────────────────────────────
    if (event.event.type === "message_stop") {
        updateUIState("tool-use");  // Transition to tool execution phase
        updateToolUses(() => []);   // Clear the in-progress tool list
        return;
    }

    // ─── content_block_start ──────────────────────────────────────────────
    switch (event.event.type) {
        case "content_block_start":
            onRawText?.(() => null);  // Clear raw text for new block
            switch (event.event.content_block.type) {
                case "thinking":
                case "redacted_thinking":
                    updateUIState("thinking");  // "Thinking deeply..." indicator
                    return;

                case "text":
                    updateUIState("responding");  // Start showing text output
                    return;

                case "tool_use": {
                    updateUIState("tool-input");  // "Using Bash..." with spinner
                    let contentBlock = event.event.content_block;
                    let blockIndex = event.event.index;
                    // Add new tool to the in-progress list
                    updateToolUses((prevTools) => [
                        ...prevTools,
                        { index: blockIndex, contentBlock, unparsedToolInput: "" }
                    ]);
                    return;
                }

                // Server-side tool types (all show "tool-input" state):
                case "server_tool_use":        // Anthropic server-managed tools
                case "web_search_tool_result": // Web search results
                case "code_execution_tool_result": // Code execution
                case "mcp_tool_use":           // MCP tool invocations
                case "mcp_tool_result":        // MCP tool results
                case "container_upload":       // Container uploads
                case "web_fetch_tool_result":  // Web fetch results
                case "bash_code_execution_tool_result": // Bash execution results
                case "text_editor_code_execution_tool_result": // Text editor execution
                case "tool_search_tool_result": // Tool search results
                case "compaction":             // Context compaction block
                    updateUIState("tool-input");
                    return;
            }
            break;

        // ─── content_block_delta ──────────────────────────────────────────
        case "content_block_delta":
            switch (event.event.delta.type) {
                case "text_delta": {
                    // Append text to the visible response buffer
                    let text = event.event.delta.text;
                    onDeltaText(text);
                    onRawText?.((prev) => (prev ?? "") + text);  // Track raw text
                    return;
                }

                case "input_json_delta": {
                    // Append partial JSON to tool input
                    let partialJson = event.event.delta.partial_json;
                    let blockIndex = event.event.index;
                    onDeltaText(partialJson);  // Also notify for display
                    updateToolUses((prevTools) => {
                        let tool = prevTools.find((t) => t.index === blockIndex);
                        if (!tool) return prevTools;
                        return [
                            ...prevTools.filter((t) => t !== tool),
                            { ...tool, unparsedToolInput: tool.unparsedToolInput + partialJson }
                        ];
                    });
                    return;
                }

                case "thinking_delta":
                    // Append thinking content (shown in thinking panel)
                    onDeltaText(event.event.delta.thinking);
                    return;

                case "signature_delta":
                    // Thinking signature - not streamed to UI, used for verification
                    return;

                default:
                    return;
            }

        case "content_block_stop":
            return;  // No UI action needed

        case "message_delta":
            updateUIState("responding");  // Ensure UI shows responding state
            return;

        default:
            updateUIState("responding");
            return;
    }
}

// Mapping: xN6→handleToolUseStream, A→event, q→onNonStreamEvent, K→onDeltaText, Y→updateUIState, z→updateToolUses, _→onTombstone, w→onThinking, O→onTTFT, $→onRawText
```

---

## Content Block Streaming Lifecycle

Each content block (text, tool_use, thinking) follows this lifecycle:

```
content_block_start  → register block + update UI state
    │
    ├── (text block)
    │   └── content_block_delta (text_delta × N)  → onDeltaText(text)
    │
    ├── (tool_use block)
    │   ├── content_block_delta (input_json_delta × N) → onDeltaText + updateToolUses
    │   └── [when complete] → JSON.parse(unparsedToolInput) in agent loop
    │
    └── (thinking block)
        └── content_block_delta (thinking_delta × N) → onDeltaText(thinking)
            + content_block_delta (signature_delta × 1) → onDeltaText(signature)

content_block_stop  → no action (block boundary marker only)
```

### Tool Input JSON Accumulation

**What it does:** Streams the tool input JSON character by character (or chunk by chunk). The accumulated string is stored in `unparsedToolInput` on the tool use entry.

**How it works:**
1. `content_block_start` (tool_use): Creates entry `{ index, contentBlock, unparsedToolInput: "" }`
2. Each `input_json_delta`: Finds entry by `index`, appends `partial_json` to `unparsedToolInput`
3. After `content_block_stop` (handled by agent loop): `JSON.parse(unparsedToolInput)` gives final tool input

**Why accumulate as string, not parse incrementally:**
JSON is not streamable in its standard form. The API streams partial JSON that may be syntactically invalid mid-stream (e.g., `{"command": "ls`). Accumulating as a string and parsing at the end is simpler and more reliable than incremental JSON parsing.

---

## Thinking Mode UI Integration

### Three Phases of Thinking Display

1. **Streaming phase** (while `thinking_delta` events arrive):
   - `onThinking` is NOT called yet
   - The raw `onDeltaText` callback receives thinking text
   - UI shows "Thinking deeply..." indicator with live content

2. **Transition phase** (at `message_stop`):
   - UI state transitions to `"tool-use"`
   - Tool uses list cleared

3. **Completion phase** (when full `assistant` message arrives after streaming):
   - `handleStreamEvent` detects `type === "assistant"` event
   - Finds the `thinking` content block in the completed message
   - Calls `onThinking(() => ({ thinking: "...", isStreaming: false, streamingEndedAt: Date.now() }))`
   - UI transitions from "live streaming" to "finished, collapsible" thinking display

```javascript
// When completed assistant message arrives (not stream_event):
if (event.type === "assistant") {
    let thinkingBlock = event.message.content.find((block) => block.type === "thinking");
    if (thinkingBlock?.type === "thinking") {
        onThinking?.(() => ({
            thinking: thinkingBlock.thinking,
            isStreaming: false,
            streamingEndedAt: Date.now()
        }));
    }
}
```

**Key insight:** The thinking content is displayed twice: once during streaming (via `onDeltaText`) for live updates, and once from the completed message (via `onThinking`) to set `isStreaming: false`. This allows the UI to:
- Show a live streaming indicator during streaming
- Switch to a final "collapsible" view when complete
- The `streamingEndedAt` timestamp is used for animation timing

---

## Tombstone Mechanism

**What it does:** A "tombstone" event means a previously-emitted message was superseded by a new version. This happens when a compaction event replaces earlier messages.

```javascript
if (event.type === "tombstone") {
    onTombstone?.(event.message);  // message = the replacement message
    return;
}
```

The `onTombstone` callback allows the UI to:
1. Remove the tombstoned message from the visible conversation
2. Show the replacement message instead

---

## Non-Interactive SDK Mode: No UI State

In SDK mode (non-interactive), the `handleStreamEvent` function is still called, but the callbacks (`updateUIState`, `updateToolUses`, etc.) are no-ops or null. Only the `onDeltaText` and `onNonStreamEvent` callbacks matter — they accumulate the response text for the final `result` message.

**Why the same function handles both modes:** This is a key architectural decision — the stream event processing logic is identical for interactive and non-interactive modes. The callbacks are the only difference. This ensures behavioral parity and reduces duplication.

---

## SDK Mode Differences: Interactive vs Non-Interactive

### Overview

The `isNonInteractive` flag (q7) fundamentally changes how the UI state machine and event handling work. SDK clients must understand these differences to properly reconstruct interactive-like experiences.

### Permission Handling Differences

**Interactive Mode:**
- User sees terminal UI prompt with options
- `y/n` keyboard input for allow/deny
- Ctrl+C to abort permission request
- Real-time permission state updates in UI

**SDK Mode:**
- Permission requests sent as `control_request` messages
- Client must respond with `control_response`
- `abortSignal` for cancellation (no Ctrl+C)
- Permission state managed externally

```javascript
// ============================================
// Permission request handling in SDK mode
// Location: chunks.179.mjs (permission flow)
// ============================================

// Interactive mode: Direct user input
if (!isNonInteractive()) {
    let response = await showPermissionPrompt(permissionRequest);
    return response;
}

// SDK mode: Send control_request, await control_response
if (isNonInteractive()) {
    let requestId = generateUUID();
    outputQueue.enqueue({
        type: "control_request",
        request_id: requestId,
        request: {
            subtype: "can_use_tool",
            tool_name: toolName,
            input: toolInput,
            tool_use_id: toolUseId
        }
    });
    // Await response from SDK client
    return await pendingRequests.waitFor(requestId);
}
```

### Event Streaming Differences

| Event Type | Interactive Mode | SDK Mode |
|------------|------------------|----------|
| `stream_request_start` | Triggers spinner | No action (buffer only) |
| `content_block_delta` | Real-time text display | Buffer for final output |
| `tool_use` | UI preview | Sent as NDJSON event |
| `tool_result` | UI rendering | Sent as NDJSON event |
| `system.status` | UI status bar | Sent as `system` event |

### Progress Reporting Architecture

```
INTERACTIVE MODE:
Agent Loop → Ink/React → Terminal → User sees spinner/text
                     │
                     └── Real-time cursor positioning, animations

SDK MODE:
Agent Loop → AsyncQueue → stdout NDJSON → SDK client processes events
                     │
                     └── No terminal UI, just JSON serialization
```

### Status Events in SDK Mode

SDK mode introduces additional status events that replace UI elements:

#### Token Usage Status
```javascript
// Replaces token count in UI status bar
{
    "type": "system",
    "subtype": "status",
    "status": {
        "token_usage": {
            "used": 45000,
            "limit": 200000,
            "percentage": 22.5
        }
    },
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

#### Compact Status
```javascript
// Replaces "Compacting..." UI message
{
    "type": "system",
    "subtype": "status_change",
    "status": "compacting",
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}

// Progress events during compaction
{ "type": "stream_event", "event": { "type": "compact_start" } }
{ "type": "stream_event", "event": { "type": "compact_progress", "phase": "summarizing" } }
{ "type": "stream_event", "event": { "type": "compact_end" } }
```

#### Rate Limit Status (v2.1.76)
```javascript
// New in v2.1.76: Rate limit information
{
    "type": "rate_limit",
    "info": {
        "requests_remaining": 42,
        "requests_reset_at": "2025-03-15T12:00:00Z",
        "tokens_remaining": 100000
    },
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

### Error Handling Differences

**Interactive Mode:**
- Errors shown as formatted terminal messages
- User-friendly hints with suggestions
- Stack traces optionally displayed
- Color-coded severity levels

**SDK Mode:**
- Errors as structured JSON objects
- Machine-parseable error codes
- `is_error: true` flag in result
- Full stack traces for debugging

```javascript
// SDK error format
{
    "type": "result",
    "subtype": "error_during_execution",
    "is_error": true,
    "result": "Error: Network timeout",
    "errors": [{
        "code": "NETWORK_TIMEOUT",
        "message": "Request timed out after 30000ms",
        "stack": "Error: Request timed out\n    at ..."
    }],
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

### Attachment Differences

System reminder attachments behave differently in SDK mode:

| Attachment Type | Interactive | SDK Mode |
|-----------------|-------------|----------|
| **IDE selection** | Real-time query | Must be client-provided |
| **Diagnostics** | LSP server query | Cached or client-provided |
| **Token usage** | UI status bar | `system.status` event |
| **Queued commands** | Immediate execution | Attached to next message |
| **Todo reminders** | Periodic UI updates | `system` message events |

### Hook Execution Differences

```javascript
// ============================================
// Hook handling in SDK mode
// Location: chunks.147.mjs (hook callbacks)
// ============================================

// Interactive mode: Execute hook, show output in terminal
// SDK mode: Execute hook, send progress as events

// Hook start event (both modes):
{ "type": "system", "subtype": "hook_started", "hook_id": "...", "hook_name": "..." }

// Hook progress (SDK mode - streamed as events):
{ "type": "system", "subtype": "hook_progress", "stdout": "...", "stderr": "..." }

// Hook complete (both modes):
{ "type": "system", "subtype": "hook_response", "outcome": "allow", ... }
```

### MCP Integration Differences

| Aspect | Interactive Mode | SDK Mode |
|--------|------------------|----------|
| Server discovery | Local config files | Via `initialize` request |
| Tool execution | Direct server process | Routed through SDK channel |
| Resource access | Local file paths | Virtual paths through SDK |
| Permission prompts | Terminal UI | `control_request` to client |

```javascript
// SDK MCP server registration
{
    "type": "control_request",
    "request": {
        "subtype": "initialize",
        "sdkMcpServers": ["filesystem", "github"]
    }
}
```

### Streaming Output Format Comparison

| `--output-format` | Interactive | SDK Mode | Content |
|-------------------|-------------|----------|---------|
| `text` | Terminal text | stdout text | Final result only |
| `json` | Not used | Single JSON object | Final result with metadata |
| `stream-json` | Not used | NDJSON events | All events in real-time |

### Key Architectural Insight

The same `handleToolUseStream` function handles both modes because:

1. **Code reuse:** Core streaming logic is identical
2. **Behavioral parity:** SDK clients get same events as interactive
3. **Testing simplicity:** Same tests cover both modes
4. **Callback abstraction:** Only callbacks differ, not core logic

```javascript
// The callback pattern enables mode switching
const interactiveCallbacks = {
    updateUIState: setUIState,
    updateToolUses: setToolUses,
    onDeltaText: appendText,
    onTTFT: setTTFT
};

const sdkCallbacks = {
    updateUIState: () => {}, // No-op: no UI
    updateToolUses: () => {}, // No-op: no UI
    onDeltaText: bufferText,  // Buffer for final result
    onTTFT: null              // No TTFT display
};

// Same function, different callbacks
handleToolUseStream(event, ...interactiveCallbacks);  // Interactive
handleToolUseStream(event, ...sdkCallbacks);          // SDK
```

---

## Server-Side Tool Types (11 Variants)

In `content_block_start`, the following server-managed content block types all trigger `"tool-input"` UI state:

| Block Type | Description |
|---|---|
| `server_tool_use` | Generic Anthropic server-managed tool |
| `web_search_tool_result` | Web search (Anthropic-hosted) |
| `code_execution_tool_result` | Code execution sandbox (Anthropic-hosted) |
| `mcp_tool_use` | MCP protocol tool invocation |
| `mcp_tool_result` | MCP protocol tool response |
| `container_upload` | File upload to container |
| `web_fetch_tool_result` | URL fetch result |
| `bash_code_execution_tool_result` | Bash sandbox execution |
| `text_editor_code_execution_tool_result` | Text editor code execution |
| `tool_search_tool_result` | Tool discovery search |
| `compaction` | Context compaction (internal) |

These are all handled identically from the UI perspective — they show `"tool-input"` state — but they have different semantic meanings at the agent loop level.

---

## onDeltaText Callback Usage by Delta Type

The `onDeltaText` callback is called for multiple delta types, but serves different purposes:

| Delta type | Content sent to onDeltaText | UI purpose |
|---|---|---|
| `text_delta` | Readable text | Append to assistant response text |
| `input_json_delta` | Partial JSON string | Show tool input preview (truncated) |
| `thinking_delta` | Thinking text | Display in thinking panel |
| `signature_delta` | Base64 signature data | Not displayed (internal) |

The callback is typically wired to a state setter like `(text) => setResponseText(prev => prev + text)` in the React component. The `input_json_delta` is a secondary notification — the primary update goes to `updateToolUses` which accumulates the full JSON for parsing.

---

## UI Rendering Pipeline: Interactive Mode

In the interactive terminal UI (using Ink/React), the stream event processing creates this pipeline:

```
WebSocket/LLM API
    │
    ▼ stream events
handleToolUseStream (xN6) in chunks.173.mjs
    │
    ├── updateUIState("thinking") ──► React setState → ThinkingSpinner renders
    │
    ├── onDeltaText(chunk) ──────────► React setState → StreamingText renders (char by char)
    │
    ├── updateToolUses(setter) ──────► React setState → ToolUsePreview renders
    │
    ├── onTTFT({ ttftMs }) ──────────► React setState → LatencyMetric displays
    │
    └── onNonStreamEvent(msg) ───────► message added to conversation history → re-render

Ink rendering loop:
    React state changes → terminal reconciliation → cursor positioning → text output
```

### React/Ink Component Architecture

The UI is built with React components rendered through Ink (React for CLI):

```javascript
// Simplified component hierarchy
<App>
  <ConversationHistory messages={messages} />
  <StreamingIndicator state={uiState} toolName={currentToolName} />
  <ToolProgressPreview toolUses={toolUses} />
  <ThinkingPanel thinking={thinkingContent} isStreaming={isThinkingStreaming} />
  <ResponseText content={streamedText} />
</App>
```

**State hooks wired to handleToolUseStream callbacks:**

```javascript
// In the main CLI component
const [uiState, setUIState] = useState("idle");           // → updateUIState
const [toolUses, setToolUses] = useState([]);             // → updateToolUses
const [streamedText, setStreamedText] = useState("");     // → onDeltaText
const [thinkingContent, setThinkingContent] = useState(null); // → onThinking
const [ttftMs, setTTFT] = useState(null);                 // → onTTFT

// handleToolUseStream is called with these setters:
handleToolUseStream(
    event,
    onNonStreamEvent,     // Adds message to conversation
    (text) => setStreamedText(prev => prev + text),  // onDeltaText
    setUIState,           // "thinking" | "responding" | "tool-input" | "tool-use"
    setToolUses,          // Array of { index, contentBlock, unparsedToolInput }
    onTombstone,          // Replace tombstoned message
    onThinking,           // Update thinking panel
    ({ ttftMs }) => setTTFT(ttftMs),  // Report latency
    null                  // onRawText (optional, for debugging)
);
```

**Terminal output during streaming:**
```
● Thinking deeply...     ← "thinking" state (spinner)
  [thinking content]     ← hidden or collapsed by default

● Responding:            ← "responding" state
  The answer is 42.      ← streamed char by char via onDeltaText

● Using Bash:            ← "tool-input" state
  ls -la                 ← tool input preview (partial JSON)

● Running tool...        ← "tool-use" state (executing)
```

### Detailed Component Hierarchy with Symbol References

The actual component hierarchy is more complex than the simplified version shown above. Here's the complete hierarchy with symbol mappings:

```
App (Yj → AppStateProvider)
├── ConversationHistory
│   ├── MessageList
│   │   ├── UserMessage
│   │   │   └── FormattedUserContent
│   │   └── AssistantMessage
│   │       ├── ThinkingBlock (if thinking)
│   │       ├── TextContent
│   │       └── ToolUseMessage[]
│   │           ├── ToolInputPreview
│   │           └── ToolResultDisplay
│   └── StreamingMessage (during active response)
│       ├── StreamingIndicator (BYq → BashOutputRenderer for tools)
│       ├── StreamingText
│       └── ToolProgressPreview
│
├── StatusIndicator (FWq → IdeSelectionIndicator)
│   └── ConnectionStatus (Rf1 → getIdeConnectionStatus)
│
├── DialogSystem
│   ├── PermissionPrompt (when permission needed)
│   └── ConfirmationDialog (for destructive actions)
│
└── InputArea
    ├── TextInput
    └── SlashCommandAutocomplete
```

**Key component symbols:**

| Component | Symbol | Location | Purpose |
|-----------|--------|----------|---------|
| `AppStateProvider` | Yj | chunks.148.mjs:2544 | Global state context |
| `BashOutputRenderer` | BYq | chunks.162.mjs:3 | Shell output detail panel |
| `IdeSelectionIndicator` | FWq | chunks.182.mjs:1514 | Status bar for IDE selection |
| `getIdeConnectionStatus` | Rf1 | chunks.182.mjs:1500 | Hook for IDE connection |
| `ScrollContainer` | mx1 | chunks.76.mjs:524 | Scroll context provider |
| `ToolResultDisplay` | z5 | chunks.130.mjs | Tool result rendering |
| `StatusIndicator` | rK1 | chunks.130.mjs | Status indicator component |

### Interactive Element Behavior in Non-Interactive Mode

In SDK mode, interactive UI elements behave differently:

| Element | Interactive Mode | SDK Mode |
|---------|------------------|----------|
| **Permission Prompt** | Terminal dialog with y/n | `control_request` message to SDK client |
| **Text Input** | Readline with history | stdin stream (JSON messages) |
| **Slash Command Autocomplete** | Tab completion | No autocomplete; commands via message |
| **Progress Spinner** | Animated in terminal | `stream_event` with state |
| **Diff Preview** | Side-by-side in terminal | Included in `tool_result` event |
| **Error Display** | Styled terminal output | `system.error` event |

**Key insight:** In SDK mode, all interactive elements are replaced with message-based equivalents. The SDK client is responsible for rendering any UI.

### Streaming Text Rendering Pipeline

The text streaming pipeline differs significantly between modes:

```
INTERACTIVE MODE:
API stream → handleToolUseStream → onDeltaText → setState → React re-render → Ink → Terminal

SDK MODE (stream-json):
API stream → handleToolUseStream → outputWriter.write({type: "stream_event", ...}) → stdout → SDK client

SDK MODE (text):
API stream → handleToolUseStream → onDeltaText → buffer accumulation → final result.output
```

**Streaming text accumulation:**

```javascript
// Interactive mode: Immediate React state update
const onDeltaText = (text) => {
    setStreamedText(prev => prev + text);  // Triggers re-render
};

// SDK text mode: Buffer for final output
let outputBuffer = "";
const onDeltaText = (text) => {
    outputBuffer += text;  // No re-render, accumulate
};
// After stream complete: result.result = outputBuffer;
```

### Tool Indicator Animations

The UI state machine drives tool indicator animations:

| State | Indicator | Animation |
|-------|-----------|-----------|
| `idle` | None | Static cursor |
| `requesting` | ● Thinking... | Spinner (dots cycle) |
| `thinking` | ● Thinking deeply... | Spinner with brain icon |
| `responding` | ● Responding | Streaming text indicator |
| `tool-input` | ● Using {tool}... | Tool name + partial JSON preview |
| `tool-use` | ● Running tool... | Progress bar if available |

**State transition triggers:**

```javascript
// State transitions from stream events
switch (event.event.type) {
    case "message_start":
        updateUIState("requesting");
        break;
    case "content_block_start":
        if (block.type === "thinking") updateUIState("thinking");
        if (block.type === "text") updateUIState("responding");
        if (block.type === "tool_use") updateUIState("tool-input");
        break;
    case "content_block_stop":
        if (wasToolUse) updateUIState("tool-use");
        break;
    case "message_stop":
        updateUIState("idle");
        break;
}
```

---

## UI Rendering in Non-Interactive (SDK) Mode

In SDK/print mode, there is no terminal UI. Instead, stream events are serialized to JSON and written to stdout:

```
handleToolUseStream (xN6)
    │
    ▼ (if --output-format=stream-json AND verbose)
    └── outputWriter.write({ type: "stream_event", event: rawEvent, ... })
            │
            ▼
          stdout (NDJSON)
```

The SDK client (TypeScript/Python) then reconstructs the streaming experience on its own side by processing these `stream_event` messages.

**For text output format**, the stream events are NOT written to stdout. Instead, the `onDeltaText` callback accumulates text into a buffer, which eventually becomes `result.result` in the final output.

### SDK Client Reconstruction Pattern

When building an SDK client, the pattern for reconstructing the UI is:

```javascript
// TypeScript SDK client pseudo-code
for await (const line of process.stdout) {
    const event = JSON.parse(line);

    if (event.type === "stream_event") {
        // Reconstruct UI state machine
        switch (event.event.type) {
            case "content_block_start":
                if (event.event.content_block.type === "text") {
                    // Start accumulating text
                }
                if (event.event.content_block.type === "tool_use") {
                    // Start accumulating tool input JSON
                }
                break;
            case "content_block_delta":
                if (event.event.delta.type === "text_delta") {
                    // Append to accumulated text
                }
                break;
        }
    }

    if (event.type === "result") {
        // Final result - conversation complete
        console.log(event.result);
    }
}
```

---

## Summary: Data Flow Through the UI

```
Claude API sends streaming events
           │
           ▼
   AgentLoop receives stream_event messages
           │
           ▼ yields to outer loop
   Output Stream (stdout if stream-json, or buffer)
           │
           ▼
   handleToolUseStream (xN6) called with each event:
     ┌─────────────────────────────────────────────┐
     │ event.type === "stream_event"               │
     │   event.event.type === "message_start"      │→ onTTFT({ ttftMs })
     │   event.event.type === "content_block_start" │
     │     .content_block.type === "text"          │→ updateUIState("responding")
     │     .content_block.type === "tool_use"      │→ updateUIState("tool-input") + addTool
     │     .content_block.type === "thinking"      │→ updateUIState("thinking")
     │                                             │
     │   event.event.type === "content_block_delta"│
     │     .delta.type === "text_delta"            │→ onDeltaText(text) + onRawText(text)
     │     .delta.type === "input_json_delta"      │→ onDeltaText + accumulate JSON
     │     .delta.type === "thinking_delta"        │→ onDeltaText(thinking)
     │                                             │
     │   event.event.type === "message_stop"       │→ updateUIState("tool-use") + clearTools
     │                                             │
     │ event.type === "stream_request_start"       │→ updateUIState("requesting")
     │                                             │
     │ event.type === "assistant"                  │→ onThinking(final) + onNonStreamEvent
     │ event.type === "tombstone"                  │→ onTombstone(replacement)
     └─────────────────────────────────────────────┘
```

---

## Callback Parameter Summary

| Callback | Parameter Type | Purpose |
|----------|---------------|---------|
| `onNonStreamEvent` | `(event: Event) => void` | Process completed messages (user/assistant) |
| `onDeltaText` | `(text: string) => void` | Append streaming text/JSON/thinking |
| `updateUIState` | `(state: UIState) => void` | Drive spinner/indicator state |
| `updateToolUses` | `(setter: (prev) => ToolUse[]) => void` | Manage in-progress tool list |
| `onTombstone` | `(message: Message) => void` | Handle message replacement |
| `onThinking` | `(setter: () => ThinkingState) => void` | Update thinking panel on completion |
| `onTTFT` | `({ ttftMs: number }) => void` | Report time-to-first-token metric |
| `onRawText` | `(setter: (prev) => string) => void` | Track raw accumulated text (optional) |

---

## AppStateProvider: React Context Architecture

### Context Hierarchy

The UI state management uses a custom React context system built on top of React's context API. The `AppStateProvider` (Yj) wraps the entire application and provides global state access through hooks.

```javascript
// ============================================
// AppStateProvider - Global state context for CLI UI
// Location: chunks.148.mjs:2544-2580
// ============================================

// ORIGINAL (for source lookup):
function Yj(A) {
    let q = A6(13),
        { children: K, initialState: Y, onChangeAppState: z } = A;
    if (wD.useContext(rKq)) throw Error("AppStateProvider can not be nested within another AppStateProvider");
    let w;
    if (q[0] !== Y || q[1] !== z) w = () => WX1(Y ?? z16(), z), q[0] = Y, q[1] = z, q[2] = w;
    else w = q[2];
    let [O] = wD.useState(w);
    // ... memoization and effect handling ...
    let D;
    if (q[10] !== O || q[11] !== M) D = wD.default.createElement(rKq.Provider, { value: !0 },
        wD.default.createElement(XU6.Provider, { value: O }, M)), q[10] = O, q[11] = M, q[12] = D;
    return D;
}

// READABLE (for understanding):
function AppStateProvider({ children, initialState, onChangeAppState }) {
    // Guard against nested providers
    if (useContext(IsNestedContext)) {
        throw Error("AppStateProvider can not be nested within another AppStateProvider");
    }

    // Create the store on first render
    const [store] = useState(() => createStore(initialState ?? getDefaultState(), onChangeAppState));

    // Memoized context value
    return (
        <IsNestedContext.Provider value={true}>
            <AppStateContext.Provider value={store}>
                {children}
            </AppStateContext.Provider>
        </IsNestedContext.Provider>
    );
}

// Mapping: Yj→AppStateProvider, XU6→AppStateContext, rKq→IsNestedContext, wD→React, A6→useMemoArray, WX1→createStore, z16→getDefaultState
```

### State Hook Functions

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| `XU6` | AppStateContext | React context holding the global store |
| `rKq` | IsNestedContext | Boolean context to detect nested providers |
| `Bp8` | useAppStateContext | Returns the full store object |
| `M1` | useAppState | Selector-based state subscription |
| `xA` | useSetAppState | Returns the `setState` function |
| `FQ6` | useAppStateOptional | Optional state access (returns undefined if no provider) |

### useAppState Selector Pattern

**What it does:** Provides optimized state subscriptions through selectors. Only re-renders when the selected slice changes.

**How it works:**
1. Takes a selector function that receives the full state and returns a slice
2. Uses `useSyncExternalStore` for React 18 concurrent safety
3. Throws error if selector returns the original state (prevents accidental full subscriptions)

```javascript
// ============================================
// useAppState - Optimized state selector hook
// Location: chunks.148.mjs:2598-2610
// ============================================

// ORIGINAL (for source lookup):
function M1(A) {
    let q = A6(3),
        K = Bp8(),
        Y;
    if (q[0] !== A || q[1] !== K) Y = () => {
        let _ = K.getState(),
            w = A(_);
        if (_ === w) throw Error(`Your selector in \`useAppState(${A.toString()})\` returned the original state, which is not allowed.`);
        return w
    }, q[0] = A, q[1] = K, q[2] = Y;
    else Y = q[2];
    let z = Y;
    return wD.useSyncExternalStore(K.subscribe, z, z)
}

// READABLE (for understanding):
function useAppState(selector) {
    const store = useAppStateContext();

    // Memoize the snapshot getter
    const getSnapshot = useMemo(() => {
        return () => {
            const state = store.getState();
            const slice = selector(state);
            // Prevent full-state subscription (breaks optimization)
            if (state === slice) {
                throw Error(`Your selector in \`useAppState(${selector.toString()})\` returned the original state, which is not allowed.`);
            }
            return slice;
        };
    }, [selector, store]);

    // Subscribe to store changes
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

// Mapping: M1→useAppState, A→selector, K→store, Bp8→useAppStateContext, A6→useMemoArray, wD→React
```

### Default State Shape

```javascript
// ============================================
// getDefaultState (z16) - Initial app state
// Location: chunks.148.mjs:2456-2529
// ============================================

// Key state slices relevant to UI rendering:
{
    messages: [],                    // Conversation history
    toolPermissionContext: {
        mode: "ask",                 // ask | accept-all | accept-some
        isBypassPermissionsModeAvailable: false
    },
    workerSandboxPermissions: {
        queue: [],                   // Pending sandbox requests
        selectedIndex: 0
    },
    pendingWorkerRequest: null,
    pendingSandboxRequest: null,
    promptSuggestion: {
        text: null,                  // Follow-up prompt hint
        promptId: null,
        shownAt: 0,
        acceptedAt: 0
    },
    speculation: { status: "idle" }, // Speculative execution state
    skillImprovement: { suggestion: null },
    prStatus: {
        number: null,                // PR tracking
        url: null,
        reviewState: null
    },
    authVersion: 0,
    initialMessage: null,
    effortValue: undefined,          // Model effort setting
    activeOverlays: new Set()        // Modal/overlay stack
}
```

---

## Terminal Rendering Specifics

### ANSI Code Handling

The terminal output uses ANSI escape codes for formatting. The CLI includes an ANSI parser that handles color codes and cursor positioning.

```javascript
// ============================================
// ANSI token handling in terminal output
// Location: chunks.149.mjs:688-695
// ============================================

// ORIGINAL (for source lookup):
if ($.type !== "ansi") break;
// ... process non-ANSI token ...

if ($.type === "ansi") this.codes.push($), this.stringPos += $.code.length, this.tokenIdx++;

// READABLE (for understanding):
// ANSI tokens are collected and rendered as terminal escape sequences
// Example ANSI codes used:
// - \x1b[1m    Bold
// - \x1b[90m   Dim/bright black (gray)
// - \x1b[32m   Green
// - \x1b[33m   Yellow
// - \x1b[34m   Blue
// - \x1b[35m   Magenta
// - \x1b[36m   Cyan
// - \x1b[0m    Reset
```

### Terminal Detection and Setup

The CLI detects the terminal type and adapts behavior accordingly:

```javascript
// ============================================
// Terminal-specific setup detection
// Location: chunks.180.mjs:87-96
// ============================================

// ORIGINAL (for source lookup):
if (Q8.terminal === "Apple_Terminal") {
    // Apple Terminal specific: Option as Meta key
}
if (["light", "light-daltonized", "light-ansi"].includes(q)) {
    // Light theme color adjustments
}

// READABLE (for understanding):
if (terminalInfo.terminal === "Apple_Terminal") {
    // Use Option+Enter for newlines instead of Shift+Enter
    // Enable visual bell instead of audio bell
}
```

### Terminal Types Supported

| Terminal | Multi-line Key | Special Handling |
|----------|---------------|------------------|
| Apple_Terminal | Option+Enter | Option as Meta key setup |
| iTerm2 | Shift+Enter | Standard |
| vscode | Shift+Enter | 'code' command integration |
| Alacritty | Shift+Enter | Standard |
| Kitty | Shift+Enter | Standard |
| Windows Terminal | Shift+Enter | Standard |

### Spinner Animation States

The UI uses different spinner states based on the `uiState`:

```javascript
// ============================================
// Spinner display logic
// Location: chunks.196.mjs:305
// ============================================

// ORIGINAL (for source lookup):
QV6 = (!j8 || j8.showSpinner === !0) && a8.length === 0 && zA.length === 0 && (Bq || YA || oi || qY4() > 0) && !X6 && !C2 && (!aZ || Wz)

// READABLE (for understanding):
const showSpinner =
    (permissionPrompt?.showSpinner !== false) &&     // Not hidden by permission prompt
    userMessages.length === 0 &&                     // Not waiting for user input
    toolResults.length === 0 &&                      // Not displaying tool results
    (isThinking || isResponding || hasToolInput || pendingTools > 0) &&  // Active state
    !isAborted &&                                    // Not aborted
    !isPermissionToolComplete &&                     // Not showing permission tool
    (!isCompactMode || allowCompactSpinner);         // Compact mode check

// Spinner text by state:
const spinnerText = {
    "requesting": "Thinking...",       // API request in progress
    "thinking": "Thinking deeply...",  // Extended thinking block
    "responding": null,                // Text output (no spinner)
    "tool-input": `Using ${toolName}...`, // Tool input streaming
    "tool-use": "Running tool..."      // Tool execution
};
```

---

## SDK Client Reconstruction Guide

### Complete Event Processing Pattern

When building an SDK client, the following pattern enables full reconstruction of the interactive experience:

```typescript
// TypeScript SDK client event processor
interface UIState {
    messages: Message[];
    uiState: "idle" | "requesting" | "thinking" | "responding" | "tool-input" | "tool-use";
    streamedText: string;
    toolUses: ToolUseEntry[];
    thinkingContent: ThinkingState | null;
    ttftMs: number | null;
}

interface ToolUseEntry {
    index: number;
    contentBlock: { type: "tool_use"; id: string; name: string };
    unparsedToolInput: string;
}

function processStreamEvent(event: NDJSONEvent, state: UIState): UIState {
    // Non-streaming events
    if (event.type !== "stream_event" && event.type !== "stream_request_start") {
        if (event.type === "tombstone") {
            // Replace the previous message
            return { ...state, messages: [...state.messages.slice(0, -1), event.message] };
        }
        if (event.type === "assistant") {
            const thinkingBlock = event.message.content.find(b => b.type === "thinking");
            if (thinkingBlock) {
                return {
                    ...state,
                    thinkingContent: {
                        thinking: thinkingBlock.thinking,
                        isStreaming: false,
                        streamingEndedAt: Date.now()
                    }
                };
            }
        }
        return state;
    }

    // stream_request_start
    if (event.type === "stream_request_start") {
        return { ...state, uiState: "requesting" };
    }

    // message_start with TTFT
    if (event.event?.type === "message_start" && event.ttftMs != null) {
        return { ...state, ttftMs: event.ttftMs };
    }

    // message_stop
    if (event.event?.type === "message_stop") {
        return { ...state, uiState: "tool-use", toolUses: [] };
    }

    // content_block_start
    if (event.event?.type === "content_block_start") {
        const blockType = event.event.content_block.type;
        switch (blockType) {
            case "thinking":
            case "redacted_thinking":
                return { ...state, uiState: "thinking" };
            case "text":
                return { ...state, uiState: "responding", streamedText: "" };
            case "tool_use":
                return {
                    ...state,
                    uiState: "tool-input",
                    toolUses: [...state.toolUses, {
                        index: event.event.index,
                        contentBlock: event.event.content_block,
                        unparsedToolInput: ""
                    }]
                };
            default:
                // Server-side tool types
                if (["server_tool_use", "mcp_tool_use", "web_search_tool_result"].includes(blockType)) {
                    return { ...state, uiState: "tool-input" };
                }
        }
    }

    // content_block_delta
    if (event.event?.type === "content_block_delta") {
        const deltaType = event.event.delta.type;
        switch (deltaType) {
            case "text_delta":
                return { ...state, streamedText: state.streamedText + event.event.delta.text };
            case "input_json_delta":
                const idx = event.event.index;
                return {
                    ...state,
                    toolUses: state.toolUses.map(t =>
                        t.index === idx
                            ? { ...t, unparsedToolInput: t.unparsedToolInput + event.event.delta.partial_json }
                            : t
                    )
                };
            case "thinking_delta":
                return { ...state, streamedText: state.streamedText + event.event.delta.thinking };
        }
    }

    return state;
}
```

### Reconstructing the UI Display

```typescript
// Render function for SDK client UI
function renderUI(state: UIState): string {
    const lines: string[] = [];

    // Spinner
    if (state.uiState === "requesting") {
        lines.push("● Thinking...");
    } else if (state.uiState === "thinking") {
        lines.push("● Thinking deeply...");
    } else if (state.uiState === "tool-input") {
        const toolName = state.toolUses[0]?.contentBlock.name ?? "tool";
        lines.push(`● Using ${toolName}...`);
    } else if (state.uiState === "tool-use") {
        lines.push("● Running tool...");
    }

    // Streamed text (if responding)
    if (state.uiState === "responding" && state.streamedText) {
        lines.push(state.streamedText);
    }

    // Tool input preview
    if (state.uiState === "tool-input" && state.toolUses.length > 0) {
        const input = state.toolUses[0].unparsedToolInput;
        if (input.length > 0) {
            lines.push(`  ${input.slice(0, 50)}${input.length > 50 ? "..." : ""}`);
        }
    }

    // TTFT metric (optional display)
    if (state.ttftMs !== null) {
        lines.push(`  [TTFT: ${state.ttftMs}ms]`);
    }

    return lines.join("\n");
}
```

### Key Algorithm: Incremental JSON Accumulation

**What it does:** The `input_json_delta` events stream partial JSON that may be syntactically invalid. The algorithm accumulates the string and parses only when the full input is received.

**How it works:**
1. Each `input_json_delta` appends `partial_json` to `unparsedToolInput`
2. No parsing occurs during streaming (JSON may be incomplete)
3. The `content_block_stop` event signals the input is complete
4. At that point, `JSON.parse(unparsedToolInput)` yields the tool input object

**Why this approach:**
- Simpler than incremental JSON parsing
- Handles malformed input gracefully
- Allows UI preview of partial JSON
- Matches the API's streaming behavior

**Key insight:** The API streams JSON character-by-character in some cases, so `partial_json` might be `"{"`, then `"command"`, then `": "`, then `"ls"`. The accumulation pattern ensures the final parse succeeds regardless of chunk boundaries.

---

## System Reminder Integration

### XML Tag Wrapping Functions

The SDK uses two functions to wrap content in `<system-reminder>` XML tags for API injection. These are used when system reminders need to be injected into the conversation context.

#### wrapInXmlTag (af)

**What it does:** Wraps a single content string in `<system-reminder>` XML tags.

**Location:** `chunks.173.mjs:2490-2494`

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

**Usage scenarios:**
1. **Thinking content injection** - When extended thinking needs to be captured as a reminder
2. **Tool result context** - When tool results need to be preserved in context
3. **Permission state** - When permission decisions affect future behavior

#### wrapWithSystemReminderTags (b5)

**What it does:** Wraps an array of messages with `<system-reminder>` tags, handling both string and array content types.

**Location:** `chunks.173.mjs:2496-2523`

```javascript
// ============================================
// wrapWithSystemReminderTags - Wraps message arrays with XML tags
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

**Key design decisions:**
1. **Selective wrapping** - Only `text` type blocks are wrapped; `tool_use`, `thinking`, etc. are preserved as-is
2. **Recursive structure** - Handles both string content and array content (API supports both)
3. **Immutable pattern** - Creates new objects rather than mutating, enabling safe state updates

### Cross-Reference to System Reminder Module

For comprehensive system reminder type definitions and injection points, see:
- [../04_system_reminder/overview.md](../04_system_reminder/overview.md) - System reminder architecture
- [../04_system_reminder/types_mode_control.md](../04_system_reminder/types_mode_control.md) - Permission mode reminders
- [../04_system_reminder/types_hooks.md](../04_system_reminder/types_hooks.md) - Hook-related reminders

---

## Summary: Complete UI State Machine

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
│   SYSTEM REMINDER INTEGRATION:                                               │
│   • wrapInXmlTag(af) — Wrap single content                                   │
│   • wrapWithSystemReminderTags(b5) — Wrap message arrays                     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Cross-References

- **SDK Overview**: [overview.md](./overview.md)
- **Streaming Protocol**: [streaming_protocol.md](./streaming_protocol.md)
- **UI State Machine**: [sdk_ui_state_machine.md](./sdk_ui_state_machine.md)
- **Transport Layer**: [transport_layer.md](./transport_layer.md)
- **System Reminders**: [../04_system_reminder/overview.md](../04_system_reminder/overview.md)
