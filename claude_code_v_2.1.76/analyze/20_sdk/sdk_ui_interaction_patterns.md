# SDK UI Interaction Patterns

## Overview

This document provides a comprehensive analysis of UI interaction patterns in SDK mode, covering the complete lifecycle from initial state to final result. It bridges the state machine (sdk_ui_state_machine.md), component rendering (sdk_ui_components.md), and event flow (ui_linkage.md) into a unified interaction model.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI rendering symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Stream event processing

Key functions in this document:
- `handleToolUseStream` (xN6) - Central stream event → UI state dispatcher
- `SpinnerController` - Controls loading indicator visibility
- `ThinkingPanel` - Extended thinking display
- `StreamingTextDisplay` - Text delta accumulator
- `ToolUseIndicator` - Tool invocation preview

---

## Complete Interaction Lifecycle

### Phase 1: Session Initialization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SESSION INITIALIZATION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  SDK Client                         Claude Code Binary                       │
│       │                                    │                                  │
│       │  spawn process                     │                                  │
│       │  CLAUDE_CODE_ENTRYPOINT=sdk-ts     │                                  │
│       │ ─────────────────────────────────► │                                  │
│       │                                    │                                  │
│       │  system/init message               │                                  │
│       │ ◄───────────────────────────────── │                                  │
│       │  {                                 │                                  │
│       │    type: "system",                 │                                  │
│       │    subtype: "init",                │                                  │
│       │    cwd: "/path/to/project",        │                                  │
│       │    session_id: "uuid",             │                                  │
│       │    tools: ["Bash", "Read", ...],   │                                  │
│       │    mcp_servers: [...]              │                                  │
│       │  }                                 │                                  │
│       │                                    │                                  │
│       │  control_request (initialize)      │                                  │
│       │ ─────────────────────────────────► │                                  │
│       │  {                                 │                                  │
│       │    subtype: "initialize",          │                                  │
│       │    hooks: {...},                   │                                  │
│       │    promptSuggestions: true         │                                  │
│       │  }                                 │                                  │
│       │                                    │                                  │
│       │  control_response                  │                                  │
│       │ ◄───────────────────────────────── │                                  │
│       │                                    │                                  │
│       ▼                                    ▼                                  │
│                                                                               │
│  UI State: IDLE → Ready for user input                                       │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 2: User Message Processing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        USER MESSAGE PROCESSING                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  SDK Client sends user message                                               │
│       │                                                                       │
│       │  {"type":"user","message":{"role":"user","content":"..."}}           │
│       │                                                                       │
│       ▼                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    ATTACHMENT ASSEMBLY                               │    │
│  │  (chunks.147.mjs:assembleAllAttachments)                             │    │
│  │                                                                      │    │
│  │  Parallel Producer Execution:                                        │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │    │
│  │  │ Group 1         │  │ Group 2         │  │ Group 3         │     │    │
│  │  │ (User-dependent)│  │ (Always)        │  │ (Main-agent)    │     │    │
│  │  │ • at_mentions   │  │ • changed_files │  │ • ide_selection │     │    │
│  │  │ • mcp_resources │  │ • nested_memory │  │ • diagnostics   │     │    │
│  │  │ • agent_mentions│  │ • plan_mode     │  │ • token_usage   │     │    │
│  │  └─────────────────┘  │ • todos        │  └─────────────────┘     │    │
│  │                       │ • skills       │                          │    │
│  │                       └─────────────────┘                          │    │
│  └──────────────────────────────┬──────────────────────────────────────┘    │
│                                 │                                             │
│                                 ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    ATTACHMENT NORMALIZATION                          │    │
│  │  (chunks.174.mjs:normalizeAttachmentForAPI)                          │    │
│  │                                                                      │    │
│  │  57+ case switch statement:                                          │    │
│  │  • Convert typed attachments → user messages with isMeta: true      │    │
│  │  • Wrap text content in <system-reminder> XML tags                  │    │
│  │  • Return array of formatted messages                               │    │
│  └──────────────────────────────┬──────────────────────────────────────┘    │
│                                 │                                             │
│                                 ▼                                             │
│  API Request Construction (messages + system prompt)                         │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 3: Streaming Response

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        STREAMING RESPONSE FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  UI State Machine Transitions:                                               │
│                                                                               │
│  ┌──────────┐    stream_request_start    ┌────────────┐                     │
│  │   IDLE   │ ─────────────────────────► │ REQUESTING │                     │
│  └──────────┘                             └─────┬──────┘                     │
│                                                 │                            │
│                      ┌──────────────────────────┼──────────────────────────┐ │
│                      │                          │                          │ │
│                      ▼                          ▼                          ▼ │
│               ┌───────────┐            ┌───────────┐             ┌─────────┐│
│               │  THINKING │            │ RESPONDING│             │ TOOL-   ││
│               │           │            │           │             │ INPUT   ││
│               │ thinking_ │            │ text_     │             │ input_  ││
│               │ delta     │            │ delta     │             │ json_   ││
│               │ events    │            │ events    │             │ delta   ││
│               └─────┬─────┘            └─────┬─────┘             └────┬────┘│
│                     │                        │                        │     │
│                     │                        │                        │     │
│                     └────────────────────────┴────────────────────────┘     │
│                                              │                               │
│                                              ▼                               │
│                                       ┌───────────┐                          │
│                                       │ TOOL-USE  │                          │
│                                       │           │                          │
│                                       │ message_  │                          │
│                                       │ stop      │                          │
│                                       └─────┬─────┘                          │
│                                             │                                 │
│                                             ▼                                 │
│                                        ┌──────────┐                           │
│                                        │   IDLE   │                           │
│                                        └──────────┘                           │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## State Machine Event Mapping

### Complete Event → State → Action Table

| Event Type | From State | To State | UI Action | Callback |
|------------|------------|----------|-----------|----------|
| `stream_request_start` | idle | requesting | Show "Thinking..." spinner | `updateUIState("requesting")` |
| `content_block_start(thinking)` | requesting | thinking | Show thinking panel | `updateUIState("thinking")` |
| `content_block_start(text)` | requesting | responding | Start text output | `updateUIState("responding")` |
| `content_block_start(tool_use)` | requesting | tool-input | Show tool preview | `updateUIState("tool-input")`, `setToolUses(...)` |
| `thinking_delta` | thinking | thinking | Append to thinking panel | `onDeltaText(thinking)` |
| `text_delta` | responding | responding | Append text to display | `onDeltaText(text)`, `textAccumulator(...)` |
| `input_json_delta` | tool-input | tool-input | Update tool JSON preview | `onDeltaText(json)`, `updateToolUses(...)` |
| `message_stop` | * | tool-use | Execute tools | `updateUIState("tool-use")`, `setToolUses([])` |
| `message_delta` | * | responding | Continue text output | `updateUIState("responding")` |
| `assistant` (complete) | * | idle | Display complete message | `onThinking(complete)` |

---

## Component Interaction Patterns

### Pattern 1: Text Streaming

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TEXT STREAMING PATTERN                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Claude API                                                                  │
│       │                                                                       │
│       │  content_block_delta: { type: "text_delta", text: "Hello" }         │
│       │                                                                       │
│       ▼                                                                       │
│  handleToolUseStream (xN6)                                                   │
│       │                                                                       │
│       │  switch (event.event.delta.type) {                                   │
│       │    case "text_delta":                                                │
│       │      let text = event.event.delta.text;  // "Hello"                 │
│       │      onDeltaText(text);                  // Display callback         │
│       │      textAccumulator((prev) => prev + text);  // Raw text tracking  │
│       │      return;                                                         │
│       │  }                                                                   │
│       │                                                                       │
│       ▼                                                                       │
│  SDK Client Display                                                          │
│       │                                                                       │
│       │  onDeltaText("Hello") → Append to display buffer                    │
│       │  textAccumulator((prev) => "" + "Hello") → Track raw text           │
│       │                                                                       │
│       ▼                                                                       │
│  Next event: content_block_delta: { type: "text_delta", text: " world" }    │
│       │                                                                       │
│       │  onDeltaText(" world") → Append " world" to buffer                  │
│       │  textAccumulator((prev) => "Hello" + " world") → "Hello world"      │
│       │                                                                       │
│       ▼                                                                       │
│  Display: "Hello world" (streaming in real time)                             │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pattern 2: Thinking Panel with Auto-Hide

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THINKING PANEL AUTO-HIDE PATTERN                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  State Management (React hooks pattern):                                     │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  const [thinkingState, setThinkingState] = useState(null);          │    │
│  │                                                                      │    │
│  │  // thinkingState structure:                                         │    │
│  │  // {                                                               │    │
│  │  //   thinking: string,        // Accumulated thinking content      │    │
│  │  //   isStreaming: boolean,    // true during, false after         │    │
│  │  //   streamingEndedAt: number  // Unix timestamp when ended       │    │
│  │  // }                                                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  Event Flow:                                                                 │
│                                                                               │
│  1. content_block_start(thinking)                                            │
│     → setThinkingState({ thinking: "", isStreaming: true })                  │
│     → Display: Show thinking panel with streaming indicator                  │
│                                                                               │
│  2. content_block_delta(thinking_delta)                                      │
│     → setThinkingState(prev => ({                                            │
│           ...prev,                                                           │
│           thinking: prev.thinking + delta.thinking                           │
│         }))                                                                  │
│     → Display: Update thinking content in real time                          │
│                                                                               │
│  3. assistant event with thinking block                                       │
│     → setThinkingState(() => ({                                              │
│           thinking: block.thinking,  // Complete, canonical content          │
│           isStreaming: false,                                                 │
│           streamingEndedAt: Date.now()                                        │
│         }))                                                                  │
│     → Display: Final thinking content, start 30s timer                       │
│                                                                               │
│  4. Auto-hide after 30 seconds                                                │
│     → useEffect detects streamingEndedAt                                     │
│     → Calculate: timeRemaining = 30000 - (now - streamingEndedAt)            │
│     → setTimeout(setThinkingState, timeRemaining, null)                      │
│     → Display: Hide thinking panel                                           │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  // Auto-hide effect (from source)                                   │    │
│  │  useEffect(() => {                                                   │    │
│  │    if (thinkingState && !thinkingState.isStreaming &&                │    │
│  │        thinkingState.streamingEndedAt) {                             │    │
│  │      let timeRemaining = 30000 -                                     │    │
│  │        (Date.now() - thinkingState.streamingEndedAt);                │    │
│  │      if (timeRemaining > 0) {                                        │    │
│  │        const timer = setTimeout(setThinkingState, timeRemaining, null);│  │
│  │        return () => clearTimeout(timer);                             │    │
│  │      } else {                                                        │    │
│  │        setThinkingState(null);  // Already past 30s                  │    │
│  │      }                                                               │    │
│  │    }                                                                 │    │
│  │  }, [thinkingState]);                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pattern 3: Multi-Tool Parallel Execution

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MULTI-TOOL PARALLEL EXECUTION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Scenario: Claude invokes Read on 3 files in parallel                        │
│                                                                               │
│  Timeline:                                                                   │
│  ──────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│  T=0ms:   content_block_start(index=0, tool_use, name="Read")               │
│           → toolUses = [{ index: 0, contentBlock: {...}, unparsedInput: ""}]│
│           → UI State: tool-input                                            │
│           → Display: "Using Read..."                                        │
│                                                                               │
│  T=5ms:   content_block_start(index=1, tool_use, name="Read")               │
│           → toolUses = [                                                     │
│               { index: 0, ... },                                            │
│               { index: 1, contentBlock: {...}, unparsedInput: ""}           │
│             ]                                                                │
│           → Display: "Using Read..." (both tools)                           │
│                                                                               │
│  T=10ms:  content_block_start(index=2, tool_use, name="Bash")               │
│           → toolUses = [                                                     │
│               { index: 0, ... },                                            │
│               { index: 1, ... },                                            │
│               { index: 2, contentBlock: {...}, unparsedInput: ""}           │
│             ]                                                                │
│           → Display: "Using Read..." (3 tools)                             │
│                                                                               │
│  T=15ms:  input_json_delta(index=0, partial_json='{"file_path": "/a')       │
│           → Find tool with index 0                                          │
│           → Update: toolUses[0].unparsedInput += '{"file_path": "/a'        │
│           → Display: Preview JSON for tool 0                                │
│                                                                               │
│  T=20ms:  input_json_delta(index=1, partial_json='{"file_path": "/b')       │
│           → Find tool with index 1                                          │
│           → Update: toolUses[1].unparsedInput += '{"file_path": "/b'        │
│           → Display: Preview JSON for tool 1                                │
│                                                                               │
│  T=25ms:  input_json_delta(index=0, partial_json='"},')                     │
│           → Update: toolUses[0].unparsedInput = '{"file_path": "/a"},'      │
│           → Display: Complete JSON for tool 0                               │
│                                                                               │
│  T=50ms:  message_stop                                                       │
│           → UI State: tool-use                                              │
│           → setToolUses([])  // Clear tool preview list                     │
│           → Display: Execute tools...                                       │
│                                                                               │
│  ──────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│  Key Implementation Detail:                                                  │
│                                                                               │
│  The `index` field in events is the **content block index**, not the         │
│  tool position. This allows correct correlation even when tools are          │
│  interleaved with other content blocks (thinking, text).                     │
│                                                                               │
│  ```javascript                                                               │
│  // handleToolUseStream - input_json_delta handling                          │
│  case "input_json_delta": {                                                  │
│    let partialJson = event.event.delta.partial_json;                         │
│    let blockIndex = event.event.index;  // Key: use index to find tool       │
│                                                                              │
│    onDeltaText(partialJson);  // Show JSON in output                         │
│                                                                              │
│    updateToolUses((currentTools) => {                                        │
│      // Find the tool with matching index                                   │
│      let tool = currentTools.find((t) => t.index === blockIndex);           │
│      if (!tool) return currentTools;  // No matching tool, skip             │
│                                                                              │
│      // Update only this tool's accumulated JSON                            │
│      return [                                                                │
│        ...currentTools.filter((t) => t !== tool),                           │
│        { ...tool, unparsedToolInput: tool.unparsedToolInput + partialJson } │
│      ];                                                                      │
│    });                                                                       │
│    return;                                                                   │
│  }                                                                           │
│  ```                                                                         │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pattern 4: Permission Request Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PERMISSION REQUEST FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Decision Tree:                                                              │
│                                                                               │
│  Tool execution requested                                                    │
│       │                                                                       │
│       ├── Tool requires permission?                                          │
│       │   │                                                                   │
│       │   ├── NO → Execute directly                                          │
│       │   │                                                                   │
│       │   └── YES:                                                           │
│       │       │                                                               │
│       │       ├── permissionPromptToolName set?                              │
│       │       │   │                                                           │
│       │       │   ├── YES: Use MCP permission tool                           │
│       │       │   │   └── Call MCP tool via sendMcpMessage                   │
│       │       │   │       └── handlePermissionPromptToolResult()             │
│       │       │   │                                                           │
│       │       │   └── NO: Use standard control_request flow                  │
│       │       │       └── sendRequest({ subtype: "can_use_tool", ... })      │
│       │       │           └── Wait for control_response                      │
│       │       │                                                               │
│       │       └── Process permission result                                  │
│       │           ├── "allow" → Execute tool                                 │
│       │           ├── "deny" → Return denial message                         │
│       │           └── "error" → Handle error                                 │
│       │                                                                       │
│       └── Execute tool based on permission result                            │
│                                                                               │
│  ──────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│  Control Request/Response Flow:                                              │
│                                                                               │
│  Claude Code                                      SDK Client                 │
│       │                                                │                      │
│       │  control_request                              │                      │
│       │  {                                            │                      │
│       │    type: "control_request",                   │                      │
│       │    request_id: "uuid",                        │                      │
│       │    request: {                                 │                      │
│       │      subtype: "can_use_tool",                 │                      │
│       │      tool_name: "Bash",                       │                      │
│       │      input: { command: "ls -la" },            │                      │
│       │      tool_use_id: "tu_xxx",                   │                      │
│       │      permission_suggestions: [...]            │                      │
│       │    }                                         │                      │
│       │  }                                           │                      │
│       │ ────────────────────────────────────────────►│                      │
│       │                                                │                      │
│       │                                                ├── Display dialog    │
│       │                                                │   to user           │
│       │                                                │                      │
│       │                                                ├── User decides:     │
│       │                                                │   Allow or Deny     │
│       │                                                │                      │
│       │  control_response                              │                      │
│       │  {                                            │                      │
│       │    type: "control_response",                   │                      │
│       │    response: {                                 │                      │
│       │      request_id: "uuid",                       │                      │
│       │      subtype: "success",                       │                      │
│       │      response: {                               │                      │
│       │        behavior: "allow" | "deny",             │                      │
│       │        message: "Optional message"             │                      │
│       │      }                                         │                      │
│       │    }                                          │                      │
│       │  }                                           │                      │
│       │ ◄────────────────────────────────────────────│                      │
│       │                                                │                      │
│       ▼                                                ▼                      │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## System Reminder Integration

### XML Tag Wrapping in SDK Mode

```javascript
// ============================================
// wrapInXmlTag - Creates <system-reminder> XML wrapper
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
    return `<system-reminder>\n${content}\n</system-reminder>`;
}

// Mapping: af→wrapInXmlTag, A→content
```

### When System Reminders Are Injected

System reminders are injected as **user-role messages with `isMeta: true`** at these points:

| Injection Point | Content Type | Purpose |
|-----------------|--------------|---------|
| Pre-API call | Various | Context for model |
| Post-compact | Summary | Preserved context |
| Tool result | Permission decision | Future behavior guidance |
| Thinking injection | Extended thinking | Context persistence |

### SDK vs CLI System Reminder Differences

| Aspect | CLI Mode | SDK Mode |
|--------|----------|----------|
| Display | Hidden from chat UI | Included in stream events |
| Injection timing | Same | Same |
| XML wrapping | Same | Same |
| Content | User-facing tips | Programmatic guidance |

---

## Spinner Visibility Logic

### Complete Decision Tree

```javascript
// ============================================
// SpinnerController - Complete display conditions
// Location: chunks.196.mjs:305 (inferred from state management)
// ============================================

function SpinnerController({
    uiState,
    toolUses,
    thinkingState,
    permissionPrompt,
    userMessages,
    toolResults,
    isAborted,
    isCompactMode,
    allowCompactSpinner
}) {
    // Primary condition: Are we in an active state?
    const isActiveState = ["requesting", "thinking", "tool-input", "tool-use"]
        .includes(uiState);

    // Permission prompt override
    const showSpinnerFromPermission = permissionPrompt?.showSpinner !== false;

    // No content to display yet
    const noContentDisplayed = userMessages.length === 0 && toolResults.length === 0;

    // Active processing indicator
    const isProcessing = isActiveState || thinkingState?.isStreaming || toolUses.length > 0;

    // Compact mode handling
    const compactModeOk = !isCompactMode || allowCompactSpinner;

    // Final decision
    const showSpinner =
        showSpinnerFromPermission &&
        noContentDisplayed &&
        isProcessing &&
        !isAborted &&
        compactModeOk;

    if (!showSpinner) return null;

    // Determine spinner text based on state
    return <Spinner text={getSpinnerText(uiState, toolUses)} />;
}

function getSpinnerText(uiState, toolUses) {
    switch (uiState) {
        case "requesting":
            return "Thinking...";
        case "thinking":
            return "Thinking deeply...";
        case "tool-input":
            return `Using ${toolUses[0]?.contentBlock?.name ?? "tool"}...`;
        case "tool-use":
            return "Running tool...";
        default:
            return null;
    }
}
```

---

## Error State Handling

### Error Event Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ERROR STATE HANDLING                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Error Categories:                                                           │
│                                                                               │
│  1. Connection Errors (WebSocket)                                            │
│     → Automatic reconnection with exponential backoff                        │
│     → Max 10 minutes total reconnection time                                 │
│     → State: "reconnecting" → "connected" or "closed"                        │
│                                                                               │
│  2. Stream Errors (stdin closed, parse errors)                               │
│     → Session termination                                                    │
│     → Error result message sent to client                                    │
│                                                                               │
│  3. Permission Errors (tool denied)                                          │
│     → Error result message                                                   │
│     → Agent can adapt and continue                                           │
│                                                                               │
│  4. Timeout Errors (control request timeout)                                 │
│     → AbortError thrown                                                      │
│     → Request cancelled                                                      │
│                                                                               │
│  5. Execution Errors (agent loop exceptions)                                 │
│     → Error result message                                                   │
│     → Session terminates                                                     │
│                                                                               │
│  ──────────────────────────────────────────────────────────────────────────  │
│                                                                               │
│  Error Result Message Format:                                                │
│                                                                               │
│  {                                                                           │
│    "type": "result",                                                         │
│    "subtype": "error_during_execution",                                      │
│    "is_error": true,                                                         │
│    "errors": ["Error message 1", "Error message 2"],                         │
│    "duration_ms": 5000,                                                      │
│    "num_turns": 3,                                                           │
│    "session_id": "uuid",                                                     │
│    "total_cost_usd": 0.05                                                    │
│  }                                                                           │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## v2.1.76 New Event Types

### rate_limit Event

```javascript
// ============================================
// rate_limit_event schema
// Location: chunks.131.mjs:2603-2608
// ============================================

// Emitted when API rate limit headers change
{
    "type": "rate_limit_event",
    "rate_limit_info": {
        "requests_remaining": 50,
        "requests_reset_at": "2024-01-15T10:30:00Z",
        "tokens_remaining": 100000,
        "tokens_reset_at": "2024-01-15T10:30:00Z"
    },
    "uuid": "<uuid>",
    "session_id": "<session-uuid>"
}
```

**Client Integration:**
```python
async def handle_rate_limit(event):
    info = event['rate_limit_info']
    if info['requests_remaining'] < 10:
        logger.warning(f"Low request budget: {info['requests_remaining']} remaining")
        await asyncio.sleep(60)  # Backoff
```

### prompt_suggestion Event

```javascript
// ============================================
// prompt_suggestion schema
// Location: chunks.131.mjs:2828-2833
// ============================================

// Emitted after each turn when promptSuggestions is enabled
{
    "type": "prompt_suggestion",
    "suggestion": "What else would you like me to help with?",
    "uuid": "<uuid>",
    "session_id": "<session-uuid>"
}
```

**When emitted:**
- After each completed agent turn
- When `initialize` request has `promptSuggestions: true`
- AND `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION !== "false"`

### auth_status Event

```javascript
// ============================================
// auth_status schema
// Location: chunks.131.mjs:2754-2761
// ============================================

// Emitted when authentication state changes
{
    "type": "auth_status",
    "isAuthenticating": false,
    "output": ["Login successful"],
    "error": null,  // Optional error string
    "uuid": "<uuid>",
    "session_id": "<session-uuid>"
}
```

---

## Cross-References

- **State Machine**: [sdk_ui_state_machine.md](./sdk_ui_state_machine.md)
- **Components**: [sdk_ui_components.md](./sdk_ui_components.md)
- **Event Linkage**: [ui_linkage.md](./ui_linkage.md)
- **Streaming Protocol**: [streaming_protocol.md](./streaming_protocol.md)
- **System Reminders**: [../04_system_reminder/overview.md](../04_system_reminder/overview.md)
- **Transport Layer**: [transport_layer.md](./transport_layer.md)