# SDK UI Linkage — Stream Events → UI State

## Overview

The SDK stream events don't just carry data — they drive a state machine that controls what the interactive CLI renders in real time. This document analyzes the `handleStreamEvent` function (`iW1`) in `chunks.173.mjs`, which is the **central dispatcher** that transforms raw Claude API streaming events into:

1. **UI state transitions** — what animation/indicator to show (thinking, responding, tool-input, etc.)
2. **Incremental text output** — each text delta appended to the visible response
3. **Tool use tracking** — building the in-progress tool invocation list
4. **Thinking content** — displaying extended thinking in real time

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI rendering symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Stream event processing

Key functions in this document:
- `handleStreamEvent` (iW1) - Central stream event → UI state dispatcher
- `onDeltaText` callback - Appends text/JSON/thinking deltas to display buffer
- `updateUIState` callback - Drives UI indicator state machine
- `updateToolUses` callback - Updates in-progress tool use list

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

---

## handleStreamEvent (iW1) — Full Analysis

```javascript
// ============================================
// handleStreamEvent - Central stream event → UI state dispatcher
// Location: chunks.173.mjs:390-488
// ============================================

// ORIGINAL (for source lookup):
function iW1(A, q, K, Y, z, w, H) {
    if (A.type !== "stream_event" && A.type !== "stream_request_start") {
        if (A.type === "tombstone") { w?.(A.message); return }
        if (A.type === "tool_use_summary") return;
        if (A.type === "assistant") {
            let $ = A.message.content.find((O) => O.type === "thinking");
            if ($ && $.type === "thinking") H?.(() => ({ thinking: $.thinking, isStreaming: !1, streamingEndedAt: Date.now() }))
        }
        q(A); return
    }
    if (A.type === "stream_request_start") { Y("requesting"); return }
    if (A.event.type === "message_stop") { Y("tool-use"), z(() => []); return }
    switch (A.event.type) {
        case "content_block_start":
            switch (A.event.content_block.type) {
                case "thinking":
                case "redacted_thinking": Y("thinking"); return;
                case "text": Y("responding"); return;
                case "tool_use": {
                    Y("tool-input");
                    let $ = A.event.content_block, O = A.event.index;
                    z((_) => [..._, { index: O, contentBlock: $, unparsedToolInput: "" }]);
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
                case "compaction": Y("tool-input"); return
            }
            break;
        case "content_block_delta":
            switch (A.event.delta.type) {
                case "text_delta": K(A.event.delta.text); return;
                case "input_json_delta": {
                    let $ = A.event.delta.partial_json, O = A.event.index;
                    K($), z((_) => {
                        let J = _.find((X) => X.index === O);
                        if (!J) return _;
                        return [..._.filter((X) => X !== J), { ...J, unparsedToolInput: J.unparsedToolInput + $ }]
                    }); return
                }
                case "thinking_delta": K(A.event.delta.thinking); return;
                case "signature_delta": K(A.event.delta.signature); return;
                default: return
            }
        case "content_block_stop": return;
        case "message_delta": Y("responding"); return;
        default: Y("responding"); return
    }
}

// READABLE (for understanding):
function handleStreamEvent(
    event,             // A: The stream event to process
    onNonStreamEvent,  // q: Handler for non-streaming event types
    onDeltaText,       // K: Callback to append text/JSON/thinking content
    updateUIState,     // Y: Drives UI state machine
    updateToolUses,    // z: Updates in-progress tool use list
    onTombstone,       // w: Handles message tombstone (replacement)
    onThinking         // H: Updates thinking state after message completion
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
        onNonStreamEvent(event);  // Pass to general event handler
        return;
    }

    // ─── stream_request_start ─────────────────────────────────────────────
    if (event.type === "stream_request_start") {
        updateUIState("requesting");  // Show "Thinking..." spinner
        return;
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
                case "text_delta":
                    // Append text to the visible response buffer
                    onDeltaText(event.event.delta.text);
                    return;

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
                    // Append thinking signature (verification data)
                    onDeltaText(event.event.delta.signature);
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

// Mapping: iW1→handleStreamEvent, A→event, q→onNonStreamEvent, K→onDeltaText, Y→updateUIState, z→updateToolUses, w→onTombstone, H→onThinking
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
handleStreamEvent (iW1) in chunks.173.mjs
    │
    ├── updateUIState("thinking") ──► React setState → ThinkingSpinner renders
    │
    ├── onDeltaText(chunk) ──────────► React setState → StreamingText renders (char by char)
    │
    ├── updateToolUses(setter) ──────► React setState → ToolUsePreview renders
    │
    └── onNonStreamEvent(msg) ───────► message added to conversation history → re-render

Ink rendering loop:
    React state changes → terminal reconciliation → cursor positioning → text output
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

---

## UI Rendering in Non-Interactive (SDK) Mode

In SDK/print mode, there is no terminal UI. Instead, stream events are serialized to JSON and written to stdout:

```
handleStreamEvent (iW1)
    │
    ▼ (if --output-format=stream-json AND verbose)
    └── outputWriter.write({ type: "stream_event", event: rawEvent, ... })
            │
            ▼
          stdout (NDJSON)
```

The SDK client (TypeScript/Python) then reconstructs the streaming experience on its own side by processing these `stream_event` messages.

**For text output format**, the stream events are NOT written to stdout. Instead, the `onDeltaText` callback accumulates text into a buffer, which eventually becomes `result.result` in the final output.

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
   handleStreamEvent (iW1) called with each event:
     ┌─────────────────────────────────────────────┐
     │ event.type === "stream_event"               │
     │   event.event.type === "content_block_start" │
     │     .content_block.type === "text"          │→ updateUIState("responding")
     │     .content_block.type === "tool_use"      │→ updateUIState("tool-input") + addTool
     │     .content_block.type === "thinking"      │→ updateUIState("thinking")
     │                                             │
     │   event.event.type === "content_block_delta"│
     │     .delta.type === "text_delta"            │→ onDeltaText(text)
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
