# SDK UI Components — Detailed Component Analysis

## Overview

This document provides a comprehensive analysis of the UI components used in SDK mode. These components are driven by the state machine defined in [sdk_ui_state_machine.md](./sdk_ui_state_machine.md) and receive events through [ui_linkage.md](./ui_linkage.md).

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI rendering symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Stream event processing

Key functions in this document:
- `handleToolUseStream` (xN6) - Central stream event dispatcher
- `wrapInXmlTag` (af) - Creates `<system-reminder>` XML wrapper
- `wrapWithSystemReminderTags` (b5) - Wraps message arrays with XML tags

---

## UI Component Architecture

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SDK UI Container                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    SpinnerController                             │    │
│  │  States: requesting | thinking | tool-input | tool-use          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                   ThinkingPanel                                   │    │
│  │  Displays: extended thinking content                              │    │
│  │  State: { thinking, isStreaming, streamingEndedAt }              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                 StreamingTextDisplay                              │    │
│  │  Callback: onDeltaText(text)                                      │    │
│  │  Accumulator: textAccumulator((prev) => prev + text)             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                   ToolUseIndicator                                │    │
│  │  States: tool-input (JSON streaming) | tool-use (execution)      │    │
│  │  Content: tool name + partial JSON preview                       │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                PermissionPromptDialog                             │    │
│  │  Triggered by: control_request (subtype: can_use_tool)           │    │
│  │  Response: control_response (behavior: allow | deny)             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component 1: SpinnerController

### Purpose

Displays a spinner animation with context-aware text based on the current UI state.

### State Mapping

| UI State | Spinner Text | Animation |
|----------|--------------|-----------|
| `requesting` | "Thinking..." | Simple spinner |
| `thinking` | "Thinking deeply..." | Brain icon + spinner |
| `tool-input` | "Using {tool_name}..." | Tool-specific spinner |
| `tool-use` | "Running tool..." | Execution spinner |
| `responding` | (no spinner) | N/A - text output mode |

### Implementation Pattern

```javascript
// ============================================
// SpinnerController - Determines when to show spinner
// Location: chunks.196.mjs:305
// ============================================

// ORIGINAL (for source lookup):
const showSpinner =
    (permissionPrompt?.showSpinner !== false) &&
    userMessages.length === 0 &&
    toolResults.length === 0 &&
    (isThinking || isResponding || hasToolInput || pendingTools > 0) &&
    !isAborted &&
    !isPermissionToolComplete &&
    (!isCompactMode || allowCompactSpinner);

// READABLE (for understanding):
function SpinnerController({ uiState, toolUses, isAborted }) {
    const showSpinner =
        uiState !== "idle" &&
        uiState !== "responding" &&  // No spinner during text output
        !isAborted;

    const getSpinnerText = () => {
        switch (uiState) {
            case "requesting":
                return "Thinking...";
            case "thinking":
                return "Thinking deeply...";
            case "tool-input":
                const toolName = toolUses[0]?.contentBlock?.name ?? "tool";
                return `Using ${toolName}...`;
            case "tool-use":
                return "Running tool...";
            default:
                return null;
        }
    };

    if (!showSpinner) return null;
    return <Spinner text={getSpinnerText()} />;
}
```

---

## Component 2: ThinkingPanel

### Purpose

Displays extended thinking content in real time. Shows streaming thinking deltas during API response, and preserves final thinking content after message completion.

### State Structure

```typescript
interface ThinkingState {
    thinking: string;           // Accumulated thinking content
    isStreaming: boolean;       // true during streaming, false after
    streamingEndedAt: number;   // Unix timestamp when streaming ended
}
```

### Event Handlers

```javascript
// ============================================
// ThinkingPanel event handling
// ============================================

// During streaming: content_block_delta (thinking_delta)
function handleThinkingDelta(thinkingDelta, thinkingState, setThinkingState) {
    setThinkingState((prev) => ({
        ...prev,
        thinking: (prev?.thinking ?? "") + thinkingDelta,
        isStreaming: true
    }));
}

// After message completion: assistant event with thinking block
function handleAssistantMessage(message, setThinkingState) {
    const thinkingBlock = message.content.find((block) => block.type === "thinking");
    if (thinkingBlock?.type === "thinking") {
        setThinkingState(() => ({
            thinking: thinkingBlock.thinking,
            isStreaming: false,
            streamingEndedAt: Date.now()
        }));
    }
}
```

### Location in Source

```javascript
// ============================================
// ThinkingPanel state management
// Location: chunks.196.mjs:96-105
// ============================================

// ORIGINAL (for source lookup):
let [d7, W4] = N8.useState("responding"), Dz = N8.useRef(d7);
Dz.current = d7;
let [JK, F3] = N8.useState([]), [MK, k3] = N8.useState(null);
N8.useEffect(() => {
    if (MK && !MK.isStreaming && MK.streamingEndedAt) {
        let Y8 = 30000 - (Date.now() - MK.streamingEndedAt);
        // ... timer logic for hiding thinking panel after 30s
    }
}, [MK]);

// READABLE (for understanding):
// React hooks for UI state and thinking content
const [uiState, setUIState] = useState("responding");
const uiStateRef = useRef(uiState);
uiStateRef.current = uiState;

const [toolUses, setToolUses] = useState([]);
const [thinkingState, setThinkingState] = useState(null);

// Auto-hide thinking panel after 30 seconds
useEffect(() => {
    if (thinkingState && !thinkingState.isStreaming && thinkingState.streamingEndedAt) {
        const timeRemaining = 30000 - (Date.now() - thinkingState.streamingEndedAt);
        // Schedule hide after timeRemaining ms
    }
}, [thinkingState]);

// Mapping: d7→uiState, W4→setUIState, JK→toolUses, F3→setToolUses, MK→thinkingState, k3→setThinkingState
```

### Display Behavior

1. **During streaming** (`isStreaming: true`):
   - Show thinking content with streaming indicator
   - Update in real time as `thinking_delta` events arrive

2. **After completion** (`isStreaming: false`):
   - Show final thinking content
   - Auto-hide after 30 seconds from `streamingEndedAt`

---

## Component 3: StreamingTextDisplay

### Purpose

Displays streaming text content from `text_delta` events. This is the main response output component.

### Callback Interface

```typescript
// Main callback for text deltas
type OnDeltaText = (text: string) => void;

// Optional text accumulator for reconstruction
type TextAccumulator = (updater: (prev: string | null) => string) => void;
```

### Implementation

```javascript
// ============================================
// StreamingTextDisplay implementation pattern
// ============================================

function StreamingTextDisplay() {
    const [displayText, setDisplayText] = useState("");

    // Called by handleToolUseStream for each text_delta
    const onDeltaText = useCallback((text) => {
        setDisplayText((prev) => prev + text);
    }, []);

    // Optional: Track raw accumulated text
    const onRawText = useCallback((updater) => {
        // updater: (prev) => prev + newText
        // or: updater: () => null (clear)
    }, []);

    return (
        <div className="streaming-text">
            {displayText}
        </div>
    );
}
```

### Event Flow

```
Claude API text_delta event
    │
    ├── event.delta.text: "Hello"
    │
    ▼
handleToolUseStream (xN6)
    │
    ├── onDeltaText("Hello")
    │   └── Appends to display buffer
    │
    └── textAccumulator((prev) => prev + "Hello")
        └── Tracks raw text (optional)
```

---

## Component 4: ToolUseIndicator

### Purpose

Displays tool invocation progress, including:
1. Tool name and input JSON preview during streaming (`tool-input` state)
2. Tool execution status during execution (`tool-use` state)

### Tool Use Entry Structure

```typescript
interface ToolUseEntry {
    index: number;                          // Content block index
    contentBlock: {
        type: "tool_use";
        id: string;                         // Tool use ID
        name: string;                       // Tool name (e.g., "Bash", "Read")
        input?: object;                     // Parsed input (after completion)
    };
    unparsedToolInput: string;              // Accumulated JSON string during streaming
}
```

### State Management

```javascript
// ============================================
// ToolUseIndicator state management
// ============================================

// toolUses is an array managed with React-style setter
const [toolUses, setToolUses] = useState<ToolUseEntry[]>([]);

// Adding a new tool use (from content_block_start)
function handleToolUseStart(contentBlock, index) {
    setToolUses((prev) => [
        ...prev,
        {
            index: index,
            contentBlock: contentBlock,
            unparsedToolInput: ""
        }
    ]);
}

// Accumulating JSON input (from input_json_delta)
function handleJsonDelta(partialJson, index) {
    setToolUses((prev) => {
        const tool = prev.find((t) => t.index === index);
        if (!tool) return prev;
        return [
            ...prev.filter((t) => t !== tool),
            {
                ...tool,
                unparsedToolInput: tool.unparsedToolInput + partialJson
            }
        ];
    });
}

// Clearing tool uses (from message_stop)
function handleMessageStop() {
    setToolUses([]);  // Clear the list
}
```

### Display Implementation

```javascript
// ============================================
// ToolUseIndicator display logic
// ============================================

function ToolUseIndicator({ toolUses, uiState }) {
    if (toolUses.length === 0) return null;

    return (
        <div className="tool-use-indicator">
            {toolUses.map((toolUse) => (
                <div key={toolUse.contentBlock.id}>
                    <span className="tool-name">
                        {toolUse.contentBlock.name}
                    </span>
                    {uiState === "tool-input" && (
                        <span className="tool-input-preview">
                            {toolUse.unparsedToolInput.slice(0, 50)}
                            {toolUse.unparsedToolInput.length > 50 ? "..." : ""}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
```

---

## Component 5: PermissionPromptDialog

### Purpose

Displays permission requests to the SDK client. Triggered by `control_request` messages with `subtype: "can_use_tool"`.

### Message Flow

```
Tool requires permission
    │
    ├── Claude Code sends control_request
    │   {
    │     type: "control_request",
    │     request_id: "uuid",
    │     request: {
    │       subtype: "can_use_tool",
    │       tool_name: "Bash",
    │       input: { command: "rm -rf /tmp/test" },
    │       tool_use_id: "tu_xxx"
    │     }
    │   }
    │
    ▼
SDK Client displays dialog
    │
    ├── User decision: Allow or Deny
    │
    ▼
SDK Client sends control_response
    {
      type: "control_response",
      response: {
        request_id: "uuid",
        subtype: "success",
        response: {
          behavior: "allow" | "deny",
          message: "Optional message"
        }
      }
    }
```

### Permission Suggestions

The `control_request` includes pre-computed permission rule suggestions:

```javascript
{
    "permission_suggestions": [
        {
            "rule": "allow",
            "type": "tool",
            "value": "Bash",
            "scope": "session"
        }
    ],
    "blocked_path": "/path/to/file",  // Optional
    "decision_reason": {               // Optional
        "type": "hook",
        "hookName": "PreToolUse:Bash"
    }
}
```

---

## React-style State Management Pattern

### The Setter Pattern

All state updates use the React-style setter pattern for safe concurrent updates:

```javascript
// Setter function signature
type Setter<T> = (updater: T | ((prev: T) => T)) => void;

// Usage examples
setState(newValue);                  // Direct value
setState((prev) => prev + increment); // Updater function

// In handleToolUseStream:
updateToolUses((prev) => [...prev, newToolUse]);     // Add
updateToolUses((prev) => prev.filter(...));          // Filter
updateToolUses(() => []);                              // Clear
```

### Why This Pattern

1. **Avoids stale closures** - The updater receives current state at call time
2. **Enables atomic updates** - Multiple updates in the same tick don't conflict
3. **Compatible with React** - Works with `useState` setter pattern
4. **Testable** - Easy to mock and verify state transitions

---

## Multi-Tool Parallel Execution UI

### Scenario

When multiple tools are invoked in parallel, the UI must handle:

1. **Multiple tool-input states** - Each tool has its own JSON stream
2. **Parallel updates** - `input_json_delta` events arrive interleaved
3. **Completion order** - Tools may complete in any order

### Implementation

```javascript
// ============================================
// Multi-tool state management
// ============================================

function handleToolUseStream(event, onEvent, onDeltaText, updateUIState, updateToolUses, ...) {
    // ...
    case "content_block_delta":
        switch (event.event.delta.type) {
            case "input_json_delta": {
                let partialJson = event.event.delta.partial_json;
                let blockIndex = event.event.index;  // Key for identifying which tool

                onDeltaText(partialJson);
                updateToolUses((prevTools) => {
                    // Find the specific tool by index
                    let tool = prevTools.find((t) => t.index === blockIndex);
                    if (!tool) return prevTools;  // No matching tool

                    // Update only this tool's input
                    return [
                        ...prevTools.filter((t) => t !== tool),
                        { ...tool, unparsedToolInput: tool.unparsedToolInput + partialJson }
                    ];
                });
                return;
            }
        }
}
```

### UI Display for Multiple Tools

```javascript
function MultiToolIndicator({ toolUses }) {
    return (
        <div>
            {toolUses.map((toolUse, idx) => (
                <ToolCard key={toolUse.contentBlock.id}>
                    <span>{idx + 1}. {toolUse.contentBlock.name}</span>
                    <JsonPreview>
                        {toolUse.unparsedToolInput}
                    </JsonPreview>
                </ToolCard>
            ))}
        </div>
    );
}
```

---

## Integration with System Reminders

### XML Tag Wrapping

When content needs to be preserved as a system reminder, use the wrapping functions:

```javascript
// For single content
const wrapped = wrapInXmlTag(content);
// Result: `<system-reminder>\n${content}\n</system-reminder>`

// For message arrays
const wrappedMessages = wrapWithSystemReminderTags(messages);
// Each text block in each message is wrapped
```

### Use Cases

1. **Thinking content preservation** - Extended thinking can be injected as a reminder
2. **Tool result context** - Tool results that need to persist in context
3. **Permission state** - Decisions that affect future tool calls

See [../04_system_reminder/overview.md](../04_system_reminder/overview.md) for complete system reminder documentation.

---

## Summary: Component Quick Reference

| Component | Trigger | State | Output |
|-----------|---------|-------|--------|
| SpinnerController | UI state change | `requesting`, `thinking`, `tool-input`, `tool-use` | Spinner with context text |
| ThinkingPanel | `thinking_delta` events | `{ thinking, isStreaming, streamingEndedAt }` | Thinking content display |
| StreamingTextDisplay | `text_delta` events | Accumulated string | Response text |
| ToolUseIndicator | `content_block_start (tool_use)` | `ToolUseEntry[]` | Tool name + JSON preview |
| PermissionPromptDialog | `control_request (can_use_tool)` | Permission decision | `control_response` |

---

## Deep Analysis: React/Ink Component Integration

### Component Architecture with Ink

The SDK UI uses Ink (React for CLI) to render interactive components. The main REPL component manages all UI state through React hooks.

#### Source-Level Hook Analysis

**Location:** `chunks.196.mjs:96-108`

```javascript
// ============================================
// REPL Component - Core UI state hooks
// Location: chunks.196.mjs:96-108
// ============================================

// ORIGINAL (for source lookup):
let [d7, W4] = N8.useState("responding"), Dz = N8.useRef(d7);
Dz.current = d7;
let [JK, F3] = N8.useState([]), [MK, k3] = N8.useState(null);
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
// UI State: 'requesting' | 'thinking' | 'responding' | 'tool-input' | 'tool-use'
const [uiState, setUIState] = useState("responding");
const uiStateRef = useRef(uiState);
uiStateRef.current = uiState;  // Keep ref in sync for non-React code

// Tool uses being streamed
const [toolUses, setToolUses] = useState([]);

// Extended thinking state
const [thinkingState, setThinkingState] = useState(null);

// Auto-hide thinking panel after 30 seconds
useEffect(() => {
    if (thinkingState && !thinkingState.isStreaming && thinkingState.streamingEndedAt) {
        const timeRemaining = 30000 - (Date.now() - thinkingState.streamingEndedAt);
        if (timeRemaining > 0) {
            const timer = setTimeout(setThinkingState, timeRemaining, null);
            return () => clearTimeout(timer);
        } else {
            setThinkingState(null);  // Already past 30s
        }
    }
}, [thinkingState]);

// Mapping: d7→uiState, W4→setUIState, Dz→uiStateRef, JK→toolUses, F3→setToolUses,
//          MK→thinkingState, k3→setThinkingState, Y8→timeRemaining, V8→timer
```

### Why These Specific Patterns?

**1. Dual State/Ref Pattern (uiState + uiStateRef)**

The `uiState` is stored in both a state variable and a ref. This is necessary because:
- Non-React code (stream handlers) needs to read the current state without triggering re-renders
- React components need the state for rendering
- The ref provides synchronous access for callback-based code

**2. ThinkingPanel Auto-Hide Mechanism**

**Algorithm:**
```
1. On thinkingState change:
   ├── Check if thinkingState exists AND streaming has ended
   │   └── Calculate: timeRemaining = 30000 - (now - streamingEndedAt)
   │       ├── If timeRemaining > 0: Schedule hide after timeRemaining ms
   │       └── If timeRemaining <= 0: Hide immediately (already past 30s)
   └── Return cleanup function to clear timeout
```

**Why 30 seconds?**
- Extended thinking content can be large (thousands of tokens)
- Keeping it visible clutters the UI after the user has read it
- 30s provides enough time to review without permanent screen occupation

**3. Setter Pattern for State Updates**

All state updates use the functional setter pattern:
```javascript
setToolUses((prev) => [...prev, newTool]);  // ✅ Correct
setToolUses([...toolUses, newTool]);        // ❌ May use stale closure
```

This is critical in async event handlers where the closure may have captured stale state.

---

## Detailed Component: SpinnerController

### Complete Display Logic

**Location:** Inferred from chunks.196.mjs state management

```javascript
// ============================================
// SpinnerController - Complete display conditions
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

### State-to-Spinner Mapping

| State | Text | Visual | Trigger |
|-------|------|--------|---------|
| `requesting` | "Thinking..." | Simple spinner | `stream_request_start` event |
| `thinking` | "Thinking deeply..." | Brain icon + spinner | `content_block_start(thinking)` |
| `tool-input` | "Using {tool}..." | Tool spinner | `content_block_start(tool_use)` |
| `tool-use` | "Running tool..." | Execution spinner | `message_stop` event |
| `responding` | (none) | N/A | Text output mode - no spinner |

---

## Detailed Component: ThinkingPanel

### State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                    ThinkingPanel States                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  NULL (hidden) ──► STREAMING ──► COMPLETED ──► NULL (hidden)│
│        ▲                 │              │           ▲       │
│        │                 │              │           │       │
│        │                 ▼              ▼           │       │
│        │         thinking_delta    assistant event  │       │
│        │         events arrive     with thinking    │       │
│        │                                       block │       │
│        │                                            │       │
│        └────────────────────────────────────────────┘       │
│                        30s auto-hide                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Extended Thinking Content Handling

**During streaming:**
```javascript
// content_block_delta with thinking_delta
{
    "type": "stream_event",
    "event": {
        "type": "content_block_delta",
        "index": 0,
        "delta": {
            "type": "thinking_delta",
            "thinking": "Let me analyze..."
        }
    }
}
```

**After completion:**
```javascript
// assistant event with thinking block
{
    "type": "assistant",
    "message": {
        "content": [
            { "type": "thinking", "thinking": "Complete thinking..." },
            { "type": "text", "text": "Here's my response..." }
        ]
    }
}
```

### Why This Dual Approach?

1. **Streaming thinking_delta events** provide real-time feedback during extended thinking
2. **Assistant event with thinking block** provides the canonical, complete thinking content
3. The streaming approach shows partial progress; the assistant event confirms the final content

---

## Multi-Tool Parallel Execution: Complete Analysis

### Scenario: Multiple Tools Invoked Simultaneously

When Claude invokes multiple tools in parallel (e.g., Read 3 files), the UI must handle:

1. Multiple `content_block_start` events (one per tool)
2. Interleaved `input_json_delta` events (indexed by `event.index`)
3. Single `message_stop` event (all tools complete)

### State Evolution Example

```
Time →
─────────────────────────────────────────────────────────────────►

Event 1: content_block_start (index=0, tool_use, name="Read")
    State: toolUses = [{index: 0, contentBlock: {...}, unparsedToolInput: ""}]

Event 2: content_block_start (index=1, tool_use, name="Read")
    State: toolUses = [{...index:0}, {...index:1}]

Event 3: input_json_delta (index=0, partial_json='{"file_path": "/a')
    State: toolUses = [{...index:0, unparsedToolInput: '{"file_path": "/a'}, {...index:1}]

Event 4: input_json_delta (index=1, partial_json='{"file_path": "/b')
    State: toolUses = [{...index:0}, {...index:1, unparsedToolInput: '{"file_path": "/b'}]

Event 5: input_json_delta (index=0, partial_json='"},')
    State: toolUses = [{...index:0, unparsedToolInput: '{"file_path": "/a"},'}, ...]

Event 6: content_block_start (index=2, tool_use, name="Bash")
    State: toolUses = [{...index:0}, {...index:1}, {...index:2}]

... more interleaved deltas ...

Event N: message_stop
    State: toolUses = [] (cleared)
    UI State: "tool-use" (tools now executing)
```

### Key Implementation Detail

The `index` field in events is the **content block index**, not the tool position. This allows correct correlation even when tools are interleaved with other content blocks (thinking, text).

```javascript
// ============================================
// Multi-tool JSON accumulation logic
// Location: chunks.173.mjs:2458-2469
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
case "input_json_delta": {
    let partialJson = event.event.delta.partial_json;
    let blockIndex = event.event.index;  // Key: use index to find correct tool

    onDeltaText(partialJson);  // Show JSON in output

    updateToolUses((currentTools) => {
        // Find the tool with matching index
        let tool = currentTools.find((t) => t.index === blockIndex);
        if (!tool) return currentTools;  // No matching tool, skip

        // Update only this tool's accumulated JSON
        return [
            ...currentTools.filter((t) => t !== tool),
            { ...tool, unparsedToolInput: tool.unparsedToolInput + partialJson }
        ];
    });
    return;
}

// Mapping: H→partialJson, j→blockIndex, J→currentTools, M→tool
```

### Why Filter + Replace Pattern?

The update pattern `filter(t => t !== tool)` + spread new object ensures:
1. **Immutable update** - React detects changes correctly
2. **Correct order** - Filter removes old, new object added at end
3. **No duplicates** - Old version is definitely removed

---

## Cross-References

- **UI State Machine**: [sdk_ui_state_machine.md](./sdk_ui_state_machine.md)
- **UI Linkage**: [ui_linkage.md](./ui_linkage.md)
- **Streaming Protocol**: [streaming_protocol.md](./streaming_protocol.md)
- **System Reminders**: [../04_system_reminder/overview.md](../04_system_reminder/overview.md)
- **Symbol Index**: [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)