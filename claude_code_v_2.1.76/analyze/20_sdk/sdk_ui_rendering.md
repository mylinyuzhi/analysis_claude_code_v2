# SDK UI Rendering — Output Formats and Client Integration

## Overview

SDK sessions produce output differently from interactive CLI sessions. This document covers the complete SDK rendering pipeline, including output format handling, streaming text rendering, thinking content display, and SDK client integration patterns.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - SDK transport symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Stream event processing

Key functions in this document:
- `handleToolUseStream` (xN6) - Central stream event → UI state dispatcher
- `outputFormatRouter` - Routes output based on format setting
- `wrapInXmlTag` (af) - Creates `<system-reminder>` XML wrapper
- `wrapWithSystemReminderTags` (b5) - Wraps message arrays with XML tags

---

## Output Format Architecture

### Three Output Format Modes

Claude Code supports three output format modes that fundamentally change how UI rendering works:

| Format | Description | Use Case | Output Destination |
|--------|-------------|----------|-------------------|
| `text` | Plain text output | Simple scripting | stdout (text only) |
| `json` | Single JSON result object | Programmatic parsing | stdout (JSON) |
| `stream-json` | NDJSON streaming | TypeScript/Python SDK | stdout (line-by-line JSON) |

### Output Format Selection Logic

```javascript
// ============================================
// outputFormatRouter - Routes output based on format setting
// Location: chunks.179.mjs (output processing section)
// ============================================

// ORIGINAL (for source lookup):
switch (outputFormat) {
    case "json":
        if (!finalResult || finalResult.type !== "result")
            throw Error("No messages returned");
        if (isVerbose) {
            print(stringify(allMessages) + '\n');
            break;
        }
        print(stringify(finalResult) + '\n');
        break;
    case "stream-json":
        // Already streamed during loop - no additional output needed
        break;
    default:
        // text mode
        if (!finalResult || finalResult.type !== "result")
            throw Error("No messages returned");
        switch (finalResult.subtype) {
            case "success":
                print(addNewlineIfNeeded(finalResult.result));
                break;
            case "error_max_turns":
                print(`Error: Reached max turns (${config.maxTurns})`);
                break;
            case "error_max_budget_usd":
                print(`Error: Reached max budget`);
                break;
            case "error_during_execution":
                print(finalResult.result + '\n');
                break;
        }
}

// Mapping: outputFormat→outputFormat, finalResult→finalResult, allMessages→allMessages,
//          print→stdout.write, stringify→JSON.stringify
```

**Why this approach:**
- `text` mode provides human-readable output for terminal users
- `json` mode enables simple programmatic access to the full result
- `stream-json` mode allows real-time processing by SDK clients

---

## Stream-JSON Message Types

### Complete Message Type Reference

The `stream-json` output format emits NDJSON messages. Each message has a `type` field that determines its structure and purpose:

#### System Messages

| Type | Subtype | Purpose | Key Fields |
|------|---------|---------|------------|
| `system` | `init` | Session initialization | `cwd`, `session_id`, `tools`, `mcp_servers`, `model` |
| `system` | `hook_started` | Hook execution begin | `hook_id`, `hook_name`, `hook_event` |
| `system` | `hook_progress` | Hook stdout/stderr | `hook_id`, `stdout`, `stderr` |
| `system` | `hook_response` | Hook execution complete | `hook_id`, `outcome`, `exit_code` |
| `system` | `status` | Permission mode change | `permissionMode` |
| `system` | `task_notification` | Background task status | `task_id`, `status`, `output_file` |
| `system` | `compact_boundary` | Compaction event | `compact_metadata` |
| `system` | `elicitation_complete` | MCP elicitation done | `mcp_server_name`, `elicitation_id` |

#### Assistant Messages

| Type | Purpose | Key Fields |
|------|---------|------------|
| `assistant` | Complete assistant turn | `message` (full API message) |
| `stream_event` | Raw API streaming event | `event` (message_start, content_block_delta, etc.) |
| `tool_use` | Tool invocation | `name`, `input`, `id` |
| `tool_result` | Tool execution result | `tool_use_id`, `content`, `is_error` |

#### Result Messages

| Type | Subtype | Purpose | Key Fields |
|------|---------|---------|------------|
| `result` | `success` | Normal completion | `result`, `num_turns`, `usage`, `total_cost_usd` |
| `result` | `error_max_turns` | Turn limit reached | `num_turns`, `errors` |
| `result` | `error_max_budget_usd` | Budget exceeded | `total_cost_usd`, `errors` |
| `result` | `error_during_execution` | Runtime error | `errors` |

#### SDK-Specific Messages (v2.1.76)

| Type | Purpose | Key Fields |
|------|---------|------------|
| `rate_limit` | API rate limit info | `info.requests_remaining`, `info.tokens_remaining` |
| `prompt_suggestion` | Predicted next prompt | `suggestion` |
| `auth_status` | Authentication state | `isAuthenticating`, `output`, `error` |

---

## Streamlined Output Format

### Internal Message Optimization

The SDK uses two internal message types for efficient streaming:

#### streamlined_text

**What it does:** Replaces full `assistant` messages with text-only content when `--output-format=stream-json` with streamlined mode enabled.

```javascript
// ============================================
// streamlined_text schema definition
// Location: chunks.131.mjs:2608-2613
// ============================================

// ORIGINAL (for source lookup):
Sd4 = F6(() => C.object({
    type: C.literal("streamlined_text"),
    text: C.string().describe("Text content preserved from the assistant message"),
    session_id: C.string(),
    uuid: N2()
}).describe("@internal Streamlined text message - replaces SDKAssistantMessage in streamlined output. Text content preserved, thinking and tool_use blocks removed."))

// READABLE (for understanding):
const StreamlinedTextSchema = z.lazy(() => z.object({
    type: z.literal("streamlined_text"),
    text: z.string().describe("Text content preserved from the assistant message"),
    session_id: z.string(),
    uuid: generateUUID()
}).describe("@internal Streamlined text message - replaces SDKAssistantMessage in streamlined output. Text content preserved, thinking and tool_use blocks removed."));

// Mapping: Sd4→StreamlinedTextSchema, C→zod, F6→z.lazy, N2→generateUUID
```

**Why this exists:** Full assistant messages can contain large thinking blocks and multiple tool_use blocks that consume significant tokens. `streamlined_text` extracts only the text content, reducing payload size by 70-90% in typical cases.

#### streamlined_tool_use_summary

**What it does:** Summarizes all tool invocations in a turn as a single cumulative string.

```javascript
// ============================================
// streamlined_tool_use_summary schema definition
// Location: chunks.131.mjs:2613-2618
// ============================================

// ORIGINAL (for source lookup):
Cd4 = F6(() => C.object({
    type: C.literal("streamlined_tool_use_summary"),
    tool_summary: C.string().describe('Summary of tool calls (e.g., "Read 2 files, wrote 1 file")'),
    session_id: C.string(),
    uuid: N2()
}).describe("@internal Streamlined tool use summary - replaces tool_use blocks in streamlined output with a cumulative summary string."))

// READABLE (for understanding):
const StreamlinedToolUseSummarySchema = z.lazy(() => z.object({
    type: z.literal("streamlined_tool_use_summary"),
    tool_summary: z.string().describe('Summary of tool calls (e.g., "Read 2 files, wrote 1 file")'),
    session_id: z.string(),
    uuid: generateUUID()
}).describe("@internal Streamlined tool use summary - replaces tool_use blocks in streamlined output with a cumulative summary string."));

// Mapping: Cd4→StreamlinedToolUseSummarySchema, C→zod, F6→z.lazy
```

**Example summary strings:**
- `"Read 2 files, wrote 1 file"`
- `"Executed 3 bash commands"`
- `"Read 5 files, edited 2 files, ran 1 bash command"`

---

## UI State Machine in SDK Context

### State Transitions for Streaming

The `handleToolUseStream` (xN6) function drives UI state transitions. In SDK mode, these states determine what gets rendered:

```
┌─────────────────────────────────────────────────────────────┐
│                    UI STATE MACHINE                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   INITIAL ──► requesting ──┬──► thinking ────┬──► tool-use │
│              (API call)     │    (thinking)    │    (execute)│
│                             │                  │             │
│                             ├──► responding ───┤             │
│                             │    (text)        │             │
│                             │                  │             │
│                             └──► tool-input ───┘             │
│                                  (tool JSON)                 │
│                                                               │
│   Each state emits specific message types:                   │
│   - requesting: stream_request_start                         │
│   - thinking: thinking_delta events                          │
│   - responding: text_delta events                            │
│   - tool-input: input_json_delta events                      │
│   - tool-use: tool_use, tool_result messages                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### State → Message Mapping

| UI State | Message Types Emitted | SDK Client Action |
|----------|----------------------|-------------------|
| `requesting` | `stream_request_start` | Show loading indicator |
| `thinking` | `thinking_delta` events | Display thinking panel |
| `responding` | `text_delta` events | Append text to display |
| `tool-input` | `input_json_delta` events | Show tool input preview |
| `tool-use` | `tool_use`, `tool_result` | Execute and display results |

---

## Callback Interface for SDK Clients

### onDeltaText(text: string)

**Purpose:** Called for each streaming text delta. SDK clients append to their display buffer.

**When called:**
- `text_delta` event: `onDeltaText(delta.text)`
- `input_json_delta` event: `onDeltaText(delta.partial_json)`
- `thinking_delta` event: `onDeltaText(delta.thinking)`

**Implementation pattern:**
```javascript
// TypeScript SDK client example
let displayBuffer = "";

function onDeltaText(text) {
    displayBuffer += text;
    renderToUI(displayBuffer);
}
```

### updateUIState(state: UIState)

**Purpose:** Updates the UI state machine for visual feedback.

**State values:**
- `"requesting"` — API request in flight, show spinner
- `"thinking"` — Extended thinking streaming, show brain icon
- `"responding"` — Text content streaming, show typing indicator
- `"tool-input"` — Tool input JSON streaming, show tool preview
- `"tool-use"` — Tool execution phase, show tool results

**Implementation pattern:**
```javascript
function updateUIState(newState) {
    switch (newState) {
        case "requesting":
            showSpinner();
            break;
        case "thinking":
            showThinkingPanel();
            break;
        case "responding":
            showTypingIndicator();
            break;
        case "tool-input":
            showToolPreview();
            break;
        case "tool-use":
            showToolResults();
            break;
    }
}
```

### updateToolUses(setter: (current: ToolUse[]) => ToolUse[])

**Purpose:** Updates the in-progress tool use list during streaming.

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

**React-style implementation:**
```javascript
const [toolUses, setToolUses] = useState<InProgressToolUse[]>([]);

function updateToolUses(setter) {
    setToolUses(prev => setter(prev));
}
```

---

## Rate Limit Event Handling

### rate_limit Event Structure (NEW v2.1.76)

```javascript
// ============================================
// rate_limit event schema
// Location: chunks.131.mjs:2603-2608
// ============================================

// ORIGINAL (for source lookup):
FfY = F6(() => C.object({
    type: C.literal("rate_limit_event"),
    rate_limit_info: BfY(),
    uuid: N2(),
    session_id: C.string()
}).describe("Rate limit event emitted when rate limit info changes."))

// READABLE (for understanding):
const RateLimitEventSchema = z.lazy(() => z.object({
    type: z.literal("rate_limit_event"),
    rate_limit_info: RateLimitInfoSchema,
    uuid: generateUUID(),
    session_id: z.string()
}).describe("Rate limit event emitted when rate limit info changes."));

// Mapping: FfY→RateLimitEventSchema, C→zod, F6→z.lazy, BfY→RateLimitInfoSchema
```

**RateLimitInfo structure:**
```typescript
interface RateLimitInfo {
    requests_remaining: number;
    requests_reset_at: string;  // ISO 8601 timestamp
    tokens_remaining?: number;
    tokens_reset_at?: string;   // ISO 8601 timestamp
}
```

### Client Integration Example

```javascript
// Python SDK client example
async def handle_rate_limit(event):
    info = event['rate_limit_info']

    if info['requests_remaining'] < 10:
        logger.warning(f"Low request budget: {info['requests_remaining']} remaining")
        await asyncio.sleep(60)  # Backoff

    if info.get('tokens_remaining', float('inf')) < 10000:
        logger.warning(f"Low token budget: {info['tokens_remaining']} remaining")
```

---

## Prompt Suggestion Event

### prompt_suggestion Event Structure

**What it does:** Provides a predicted next prompt after each turn. Only emitted when `promptSuggestions: true` in initialize request.

```javascript
{
    "type": "prompt_suggestion",
    "suggestion": "What else would you like me to help with?",
    "uuid": "<uuid>",
    "session_id": "<session-uuid>"
}
```

**When emitted:**
- After each completed agent turn
- When `sessionOptions.promptSuggestions` is true
- AND `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION !== "false"`

**Implementation note:** `prompt_suggestion` messages are excluded from the final JSON output (filtered in chunks.186.mjs:1728), so they don't appear in collected messages.

---

## SDK Client Integration Patterns

### TypeScript SDK Client

```typescript
import { ClaudeAgent } from '@anthropic-ai/claude-code-sdk';

async function streamWithUI() {
    const client = new ClaudeAgent();

    // Initialize session
    const session = await client.initialize({
        promptSuggestions: true
    });

    // Stream events
    for await (const event of client.stream('Your prompt here')) {
        switch (event.type) {
            case 'system':
                if (event.subtype === 'init') {
                    console.log('Session initialized:', event.session_id);
                }
                break;

            case 'assistant':
                // Full assistant message
                displayAssistantMessage(event.message);
                break;

            case 'stream_event':
                // Handle raw streaming events
                handleStreamEvent(event.event);
                break;

            case 'tool_use':
                displayToolInvocation(event.name, event.input);
                break;

            case 'tool_result':
                displayToolResult(event.tool_use_id, event.content);
                break;

            case 'rate_limit':
                handleRateLimit(event.info);
                break;

            case 'prompt_suggestion':
                displaySuggestion(event.suggestion);
                break;

            case 'result':
                if (event.subtype === 'success') {
                    console.log('Completed:', event.result);
                } else {
                    console.error('Error:', event.errors);
                }
                break;
        }
    }
}
```

### Python SDK Client

```python
from claude_code_sdk import ClaudeAgent

async def stream_with_ui():
    client = ClaudeAgent()

    # Stream events
    async for event in client.stream('Your prompt here'):
        if event['type'] == 'system' and event.get('subtype') == 'init':
            print(f"Session: {event['session_id']}")

        elif event['type'] == 'assistant':
            display_assistant_message(event['message'])

        elif event['type'] == 'stream_event':
            handle_stream_event(event['event'])

        elif event['type'] == 'tool_use':
            display_tool_invocation(event['name'], event['input'])

        elif event['type'] == 'tool_result':
            display_tool_result(event['tool_use_id'], event['content'])

        elif event['type'] == 'rate_limit':
            handle_rate_limit(event['info'])

        elif event['type'] == 'result':
            if event['subtype'] == 'success':
                print(f"Completed: {event['result']}")
            else:
                print(f"Error: {event.get('errors', [])}")
```

---

## Message Filtering for Collection

### Excluded Message Types

Certain message types are excluded from the collected messages array (used for `json` output format):

```javascript
// Location: chunks.186.mjs:1728
if (event.type !== "control_response" &&
    event.type !== "control_request" &&
    event.type !== "control_cancel_request" &&
    event.type !== "stream_event" &&
    event.type !== "keep_alive" &&
    event.type !== "streamlined_text" &&
    event.type !== "streamlined_tool_use_summary" &&
    event.type !== "prompt_suggestion") {
    // Collect message
    collectedMessages.push(event);
}
```

**Why these are excluded:**
- `control_response/request` — Protocol overhead, not semantic content
- `stream_event` — Raw streaming events, already processed into higher-level messages
- `keep_alive` — Heartbeat, no semantic content
- `streamlined_text/tool_use_summary` — Internal optimizations, replaced by full messages
- `prompt_suggestion` — UI hint, not part of conversation

---

## Error Output Formatting

### outputError Function (XI1)

**What it does:** Formats errors appropriately for the current output format.

```javascript
// ============================================
// outputError - Format error output for SDK mode
// Location: chunks.187.mjs:1347-1369
// ============================================

// ORIGINAL (for source lookup):
function XI1(A, q) {
    if (q === "stream-json") {
        let K = {
            type: "result",
            subtype: "error_during_execution",
            duration_ms: 0,
            duration_api_ms: 0,
            is_error: !0,
            num_turns: 0,
            stop_reason: null,
            session_id: R1(),
            total_cost_usd: 0,
            usage: gZ,
            modelUsage: {},
            permission_denials: [],
            uuid: WD(),
            errors: [A]
        };
        process.stdout.write(B6(K) + '\n')
    } else process.stderr.write(A + '\n')
}

// READABLE (for understanding):
function outputError(errorMessage, outputFormat) {
    if (outputFormat === "stream-json") {
        // Structured error result for machine parsing
        let errorResult = {
            type: "result",
            subtype: "error_during_execution",
            duration_ms: 0,
            duration_api_ms: 0,
            is_error: true,
            num_turns: 0,
            stop_reason: null,
            session_id: getSessionId(),
            total_cost_usd: 0,
            usage: emptyUsage,
            modelUsage: {},
            permission_denials: [],
            uuid: generateUUID(),
            errors: [errorMessage]
        };
        process.stdout.write(JSON.stringify(errorResult) + '\n');
    } else {
        // Plain text error for text mode
        process.stderr.write(errorMessage + '\n');
    }
}

// Mapping: XI1→outputError, A→errorMessage, q→outputFormat, R1→getSessionId,
//          gZ→emptyUsage, WD→generateUUID, B6→JSON.stringify
```

---

## System Reminder Integration in SDK Mode

### Thinking Content as System Reminders

In SDK mode, extended thinking content can be preserved across turns by wrapping it in `<system-reminder>` XML tags. This enables:

1. **Context persistence** — Thinking content survives message truncation
2. **Token efficiency** — Only essential thinking is preserved
3. **API compatibility** — Claude API recognizes system-reminder as injected context

### wrapInXmlTag and wrapWithSystemReminderTags Usage

The `wrapInXmlTag` (af) and `wrapWithSystemReminderTags` (b5) functions are used in SDK mode for:

| Use Case | Function | Example |
|----------|----------|---------|
| Thinking content injection | `wrapInXmlTag` | `wrapInXmlTag(thinkingContent)` → `<system-reminder>\n{content}\n</system-reminder>` |
| Tool result context | `wrapWithSystemReminderTags` | Transforms message arrays to wrap text blocks in XML |
| Permission state injection | `wrapInXmlTag` | Permission decisions that affect future tool calls |

### Integration Pattern

```javascript
// Thinking content injection in SDK mode
if (thinkingState && !thinkingState.isStreaming) {
    const wrappedThinking = wrapInXmlTag(thinkingState.thinking);
    // Inject as system reminder to next API call
    messages.push({
        role: "user",
        content: wrappedThinking
    });
}

// Tool result wrapping for context preservation
const wrappedResults = wrapWithSystemReminderTags(toolResultMessages);
// Each text block in each message is wrapped in <system-reminder> tags
```

### Message Filtering vs Context Preservation

When messages are collected for `json` output format, system-reminder-wrapped content is preserved:

```javascript
// Collected messages include wrapped content
// Location: chunks.186.mjs:1728
if (event.type !== "control_response" &&
    event.type !== "control_request" &&
    event.type !== "stream_event" &&
    event.type !== "keep_alive" &&
    event.type !== "streamlined_text" &&
    event.type !== "streamlined_tool_use_summary" &&
    event.type !== "prompt_suggestion") {
    // System-reminder wrapped content is collected normally
    collectedMessages.push(event);
}
```

For complete system reminder documentation, see [../04_system_reminder/overview.md](../04_system_reminder/overview.md).

---

## Cross-References

- **SDK Overview**: [overview.md](./overview.md)
- **Streaming Protocol**: [streaming_protocol.md](./streaming_protocol.md)
- **UI State Machine**: [sdk_ui_state_machine.md](./sdk_ui_state_machine.md)
- **Transport Layer**: [transport_layer.md](./transport_layer.md)
- **System Reminders**: [../04_system_reminder/overview.md](../04_system_reminder/overview.md) — Complete system reminder documentation including injection points, XML wrapping, and context preservation