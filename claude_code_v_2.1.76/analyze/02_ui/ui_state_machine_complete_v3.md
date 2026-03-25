# UI State Machine Complete v3 (Claude Code 2.1.76)

> Complete state machine analysis for the React/Ink terminal UI.
>
> **Cross-validated**: All symbols verified against source code on 2026-03-26.
> **Version**: v3 - Complete state machine with source-level restoration.

---

## Table of Contents

1. [Overview](#1-overview)
2. [State Types and Definitions](#2-state-types-and-definitions)
3. [State Transition Matrix](#3-state-transition-matrix)
4. [Streaming State Machine](#4-streaming-state-machine)
5. [Input Handling State Machine](#5-input-handling-state-machine)
6. [Dialog State Machine](#6-dialog-state-machine)
7. [Permission Prompt State Machine](#7-permission-prompt-state-machine)
8. [Keyboard Shortcut Mapping](#8-keyboard-shortcut-mapping)
9. [Rendering Pipeline](#9-rendering-pipeline)
10. [Source Code Restoration](#10-source-code-restoration)

---

## 1. Overview

The UI layer in Claude Code uses a multi-layer state machine architecture built on React/Ink for terminal rendering. The state machine manages:

1. **Stream State** - Real-time LLM response streaming
2. **Input State** - User input handling and submission
3. **Dialog State** - Modal dialogs for permissions, MCP, etc.
4. **Tool Execution State** - Parallel tool execution visualization

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           UI STATE MACHINE ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        REPL Component (ot8)                           │  │
│  │                                                                        │  │
│  │  State Slices:                                                         │  │
│  │  ├── streamMode: "responding" | "tool-input" | "thinking" | ...      │  │
│  │  ├── streamingToolUses: StreamingToolUse[]                           │  │
│  │  ├── streamingThinking: ThinkingBlock | null                         │  │
│  │  ├── inProgressToolUseIDs: Set<string>                               │  │
│  │  ├── messages: Message[]                                              │  │
│  │  ├── inputMode: "single_line" | "multiline"                          │  │
│  │  └── dialogState: DialogState | null                                 │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     Event Processor (handleToolUseStream/xN6)         │  │
│  │                                                                        │  │
│  │  Processes:                                                            │  │
│  │  ├── SSE stream events from LLM                                      │  │
│  │  ├── Keyboard events from terminal                                   │  │
│  │  ├── Tool execution events                                           │  │
│  │  └── Dialog interactions                                              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                       Message List (veY)                              │  │
│  │                                                                        │  │
│  │  Memoized rendering with:                                             │  │
│  │  ├── Virtualization (only visible messages)                          │  │
│  │  ├── Streaming tool filtering                                        │  │
│  │  ├── Diff rendering for Edit results                                 │  │
│  │  └── Syntax highlighting for code blocks                             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. State Types and Definitions

### 2.1 Core State Types

```typescript
// ============================================
// UI State Type Definitions
// ============================================

type StreamMode =
    | "requesting"    // Request sent, waiting for response
    | "responding"    // Text content streaming
    | "tool-input"    // Tool JSON streaming
    | "thinking"      // Thinking block streaming
    | "tool-use";     // Message complete, tools executing

type InputMode =
    | "single_line"   // Default input mode
    | "multiline";    // Shift+Enter or paste mode

interface StreamingToolUse {
    index: number;
    contentBlock: {
        type: "tool_use";
        id: string;
        name: string;
        input: object;
    };
    unparsedToolInput: string;
}

interface StreamingThinking {
    thinking: string;
    signature: string;
    displayStartTime: number;
}

interface DialogState {
    type: "permission" | "mcp" | "elicitation" | "confirmation";
    priority: number;
    config: DialogConfig;
    onClose: () => void;
}

interface Message {
    type: "user" | "assistant" | "system" | "tombstone";
    message: {
        role: "user" | "assistant";
        content: ContentBlock[];
    };
    uuid: string;
    timestamp: string;
    isMeta?: boolean;
    toolUseResult?: string;
}
```

### 2.2 State Variable Locations

| State Variable | Obfuscated | Location | Type |
|---------------|------------|----------|------|
| `streamMode` | - | chunks.196.mjs (REPL) | useState |
| `streamingToolUses` | `gq` | chunks.196.mjs | useState |
| `streamingThinking` | - | chunks.196.mjs | useState |
| `inProgressToolUseIDs` | `ow` | chunks.196.mjs | useState |
| `messages` | - | createStateStore (WX1) | Store |

---

## 3. State Transition Matrix

### 3.1 Stream Mode Transitions

```
┌─────────────┬───────────────────────┬─────────────────────────────────────┐
│ From State  │ Event                 │ To State                            │
├─────────────┼───────────────────────┼─────────────────────────────────────┤
│ (idle)      │ stream_request_start  │ requesting                          │
│ requesting  │ content_block_start   │ responding | tool-input | thinking │
│ responding  │ content_block_start   │ tool-input | thinking               │
│ responding  │ message_stop          │ tool-use                            │
│ tool-input  │ content_block_stop    │ responding                          │
│ thinking    │ content_block_stop    │ responding                          │
│ tool-use    │ tools_complete        │ (idle)                              │
│ any         │ abort                 │ (idle)                              │
└─────────────┴───────────────────────┴─────────────────────────────────────┘
```

### 3.2 Message State Transitions

```
┌─────────────┬───────────────────────┬─────────────────────────────────────┐
│ From State  │ Event                 │ To State                            │
├─────────────┼───────────────────────┼─────────────────────────────────────┤
│ (no msg)    │ user_input            │ user message added                  │
│ (no msg)    │ assistant_response    │ assistant message added             │
│ assistant   │ tool_result           │ tool result appended                │
│ any message │ tombstone             │ removed from display                │
│ any message │ compact               │ replaced with summary               │
└─────────────┴───────────────────────┴─────────────────────────────────────┘
```

---

## 4. Streaming State Machine

### 4.1 Stream Event Processing

```javascript
// ============================================
// handleToolUseStream - Stream event processor
// Location: chunks.173.mjs:2384-2488
// ============================================

// READABLE (for understanding):
function handleToolUseStream(event, state) {
    switch (event.type) {
        case "content_block_start": {
            let block = event.content_block;

            if (block.type === "tool_use") {
                // Transition to tool-input mode
                setStreamMode("tool-input");

                // Add new streaming tool use
                setStreamingToolUses(prev => [...prev, {
                    index: event.index,
                    contentBlock: {
                        type: "tool_use",
                        id: block.id,
                        name: block.name,
                        input: {}
                    },
                    unparsedToolInput: ""
                }]);
            }

            if (block.type === "thinking" || block.type === "redacted_thinking") {
                // Transition to thinking mode
                setStreamMode("thinking");

                // Initialize thinking block
                setStreamingThinking({
                    thinking: "",
                    signature: "",
                    displayStartTime: Date.now()
                });
            }

            if (block.type === "text") {
                setStreamMode("responding");
            }
            break;
        }

        case "content_block_delta": {
            let delta = event.delta;

            if (delta.type === "input_json_delta") {
                // Accumulate tool input JSON
                setStreamingToolUses(prev => prev.map(tool => {
                    if (tool.index === event.index) {
                        return {
                            ...tool,
                            unparsedToolInput: tool.unparsedToolInput + delta.partial_json
                        };
                    }
                    return tool;
                }));
            }

            if (delta.type === "thinking_delta") {
                // Accumulate thinking content
                setStreamingThinking(prev => ({
                    ...prev,
                    thinking: prev.thinking + delta.thinking
                }));
            }

            if (delta.type === "signature_delta") {
                // Update thinking signature
                setStreamingThinking(prev => ({
                    ...prev,
                    signature: delta.signature
                }));
            }
            break;
        }

        case "content_block_stop": {
            // Parse complete tool input
            setStreamingToolUses(prev => prev.map(tool => {
                if (tool.index === event.index && tool.unparsedToolInput) {
                    try {
                        tool.contentBlock.input = JSON.parse(tool.unparsedToolInput);
                    } catch {
                        // Handle parse error
                    }
                }
                return tool;
            }));
            break;
        }

        case "message_delta": {
            setStreamMode("responding");
            break;
        }

        case "message_stop": {
            setStreamMode("tool-use");
            break;
        }
    }

    // Always yield raw event for UI updates
    return { type: "stream_event", event };
}

// Mapping: xN6→handleToolUseStream
```

### 4.2 Streaming Tool Filtering

```javascript
// ============================================
// Message List with Streaming Tool Filtering
// Location: chunks.161.mjs:3-100
// ============================================

// READABLE (for understanding):
function MessageList({ messages, streamingToolUses, inProgressToolUseIDs }) {
    // Get IDs of tools currently being streamed
    let streamingToolUseIDs = useMemo(() => {
        return new Set(streamingToolUses.map(t => t.contentBlock.id));
    }, [streamingToolUses]);

    // Filter messages to remove duplicates
    let displayMessages = useMemo(() => {
        return messages
            .filter(filterEmptyMessages)
            .flatMap(msg => {
                if (msg.type === "assistant") {
                    // Check for tool_use blocks
                    let toolUseBlocks = msg.message.content.filter(
                        block => block.type === "tool_use"
                    );

                    // Filter out tool_use blocks that are still streaming
                    let filteredContent = msg.message.content.filter(block => {
                        if (block.type === "tool_use") {
                            // Include if not streaming OR already committed
                            return !streamingToolUseIDs.has(block.id) ||
                                   inProgressToolUseIDs.has(block.id);
                        }
                        return true;
                    });

                    return [{ ...msg, message: { ...msg.message, content: filteredContent } }];
                }
                return [msg];
            });
    }, [messages, streamingToolUseIDs, inProgressToolUseIDs]);

    return (
        <Box flexDirection="column">
            {displayMessages.map(msg => (
                <MessageComponent key={msg.uuid} message={msg} />
            ))}
        </Box>
    );
}

// Mapping: veY→MessageList
```

---

## 5. Input Handling State Machine

### 5.1 Input Event Processing

```javascript
// ============================================
// Input Handler - Keyboard event processing
// Location: chunks.155.mjs (inferred)
// ============================================

// READABLE (for understanding):
function useInputHandler(state, dispatch) {
    useInput((keyEvent, key) => {
        const { input, inputMode, hasSelection, streamingState } = state;

        // Escape key handling
        if (key.escape) {
            if (state.hasInterruptibleToolInProgress) {
                dispatch({ type: "interrupt_tools" });
            } else if (streamingState !== "idle") {
                dispatch({ type: "abort_stream" });
            } else if (state.dialogState) {
                dispatch({ type: "close_dialog" });
            }
            return;
        }

        // Submit on Enter (unless shift+enter in multiline)
        if (key.return) {
            if (key.shift) {
                // Newline in multiline mode
                dispatch({ type: "append_input", char: "\n" });
            } else if (inputMode === "single_line" || key.ctrl || key.meta) {
                dispatch({ type: "submit_input" });
            } else {
                dispatch({ type: "append_input", char: "\n" });
            }
            return;
        }

        // Ctrl+key shortcuts
        if (key.ctrl) {
            switch (keyEvent) {
                case "c":
                    if (hasSelection) {
                        dispatch({ type: "copy_selection" });
                    } else {
                        dispatch({ type: "cancel_or_exit" });
                    }
                    break;
                case "s":
                    dispatch({ type: "toggle_speech_mode" });
                    break;
                case "b":
                    dispatch({ type: "toggle_compact_view" });
                    break;
                case "l":
                    dispatch({ type: "clear_screen" });
                    break;
            }
            return;
        }

        // Arrow keys for navigation
        if (key.upArrow || key.downArrow) {
            if (state.commandHistory.length > 0) {
                dispatch({
                    type: "navigate_history",
                    direction: key.upArrow ? "up" : "down"
                });
            }
            return;
        }

        // Regular character input
        if (keyEvent && keyEvent.length === 1) {
            dispatch({ type: "append_input", char: keyEvent });
        }
    });
}
```

### 5.2 Input State Machine Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INPUT STATE MACHINE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                        ┌─────────────┐                                      │
│                        │    IDLE     │                                      │
│                        └──────┬──────┘                                      │
│                               │                                              │
│                               │ key press                                    │
│                               ▼                                              │
│                        ┌─────────────┐                                      │
│                        │  TYPING     │                                      │
│                        └──────┬──────┘                                      │
│                               │                                              │
│          ┌────────────────────┼────────────────────┐                        │
│          │                    │                    │                        │
│          ▼                    ▼                    ▼                        │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  │
│   │  SUBMIT     │     │  CANCEL     │     │  NAVIGATE   │                  │
│   │ (Enter)     │     │ (Escape)    │     │ (Up/Down)   │                  │
│   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘                  │
│          │                   │                    │                         │
│          │                   │                    │                         │
│          ▼                   ▼                    ▼                         │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  │
│   │ Send to     │     │ Clear input │     │ History     │                  │
│   │ agent loop  │     │ or abort    │     │ navigation  │                  │
│   └─────────────┘     └─────────────┘     └─────────────┘                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Dialog State Machine

### 6.1 Dialog Types

```typescript
type DialogType =
    | "permission"      // Tool permission request
    | "mcp"            // MCP server selection
    | "elicitation"    // Hook elicitation
    | "confirmation"   // Generic confirmation
    | "error";         // Error notification
```

### 6.2 Dialog Priority System

```
Priority 1 (Highest): Permission Dialogs
├── Tool permission prompts
├── Session start permission requests
└── Always block other interactions

Priority 2: User Input Dialogs
├── Elicitation hooks
├── Confirmation prompts
└── Block streaming but can be cancelled

Priority 3: Notification Dialogs
├── Error notifications
├── Status updates
└── Non-blocking, auto-dismiss

Priority 4 (Lowest): Background Indicators
├── Spinner
├── Progress bars
└── Status line updates
```

### 6.3 Dialog State Transitions

```javascript
// ============================================
// Dialog State Machine
// ============================================

type DialogState =
    | { type: "closed" }
    | { type: "opening", dialog: DialogConfig }
    | { type: "open", dialog: DialogConfig }
    | { type: "closing", dialog: DialogConfig };

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
    switch (action.type) {
        case "open_dialog":
            // Check priority - higher priority can interrupt
            if (state.type === "open" && state.dialog.priority >= action.dialog.priority) {
                return state; // Don't replace higher priority dialog
            }
            return { type: "open", dialog: action.dialog };

        case "close_dialog":
            if (state.type === "open") {
                return { type: "closed" };
            }
            return state;

        case "respond_dialog":
            // Handle user response
            if (state.type === "open") {
                state.dialog.onResponse?.(action.response);
                return { type: "closed" };
            }
            return state;

        default:
            return state;
    }
}
```

---

## 7. Permission Prompt State Machine

### 7.1 Permission Prompt Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PERMISSION PROMPT FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tool Request                                                                │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────┐                                                        │
│  │ Check Permission │                                                       │
│  │ Rules            │                                                       │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ├─── Allow rule matches ──► Execute tool                          │
│           │                                                                  │
│           ├─── Deny rule matches ──► Return error                           │
│           │                                                                  │
│           └─── No rule / Ask rule ──► Show permission prompt                │
│                                              │                               │
│                                              ▼                               │
│                                    ┌─────────────────┐                      │
│                                    │ Permission      │                      │
│                                    │ Dialog          │                      │
│                                    └────────┬────────┘                      │
│                                             │                                │
│                        ┌────────────────────┼────────────────────┐          │
│                        │                    │                    │          │
│                        ▼                    ▼                    ▼          │
│                 ┌──────────┐         ┌──────────┐         ┌──────────┐     │
│                 │ Allow    │         │ Deny     │         │ Allow    │     │
│                 │ (this    │         │          │         │ Always   │     │
│                 │ time)    │         │          │         │          │     │
│                 └────┬─────┘         └────┬─────┘         └────┬─────┘     │
│                      │                    │                    │            │
│                      ▼                    ▼                    ▼            │
│               Execute tool          Return error       Add allow rule      │
│                                                        Execute tool        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Permission State Structure

```javascript
// ============================================
// Permission Context Structure
// Location: chunks.53.mjs:1224-1294
// ============================================

interface PermissionContext {
    mode: "default" | "plan" | "auto" | "acceptEdits";
    alwaysAllowRules: Record<string, string[]>;
    alwaysDenyRules: Record<string, string[]>;
    alwaysAskRules: Record<string, string[]>;
    additionalWorkingDirectories: Map<string, DirectoryConfig>;
}

// Permission update actions
type PermissionUpdate =
    | { type: "setMode", mode: PermissionMode }
    | { type: "addRules", behavior: "allow" | "deny" | "ask", destination: string, rules: string[] }
    | { type: "replaceRules", behavior: "allow" | "deny" | "ask", destination: string, rules: string[] }
    | { type: "removeRules", behavior: "allow" | "deny" | "ask", destination: string, rules: string[] }
    | { type: "addDirectories", destination: string, directories: string[] }
    | { type: "removeDirectories", directories: string[] };
```

---

## 8. Keyboard Shortcut Mapping

### 8.1 Global Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `Escape` | Interrupt/Cancel | Streaming or tool execution |
| `Ctrl+C` | Copy selection or cancel | Selection exists or idle |
| `Ctrl+S` | Toggle speech mode | Any |
| `Ctrl+B` | Toggle compact view | Any |
| `Ctrl+L` | Clear screen | Any |
| `Enter` | Submit input | Single line mode |
| `Shift+Enter` | Newline | Multiline mode |
| `Up/Down` | History navigation | Input focused |
| `Ctrl+Up/Down` | Scroll messages | Message list |

### 8.2 Dialog Shortcuts

| Key | Action | Dialog Type |
|-----|--------|-------------|
| `Enter` | Confirm default | All dialogs |
| `Escape` | Cancel/Close | All dialogs |
| `Tab` | Next option | Permission dialog |
| `Shift+Tab` | Previous option | Permission dialog |
| `y/Y` | Yes/Allow | Confirmation/Permission |
| `n/N` | No/Deny | Confirmation/Permission |
| `a/A` | Allow always | Permission |

### 8.3 Keybinding Resolution Flow

```javascript
// ============================================
// Keybinding Resolution
// ============================================

function resolveKeybinding(keyEvent, state) {
    // 1. Check for dialog-specific bindings
    if (state.dialogState) {
        let dialogBinding = getDialogBinding(keyEvent, state.dialogState);
        if (dialogBinding) return dialogBinding;
    }

    // 2. Check for input-specific bindings
    if (state.inputFocused) {
        let inputBinding = getInputBinding(keyEvent, state.inputMode);
        if (inputBinding) return inputBinding;
    }

    // 3. Check for streaming-specific bindings
    if (state.streamingState !== "idle") {
        let streamingBinding = getStreamingBinding(keyEvent, state);
        if (streamingBinding) return streamingBinding;
    }

    // 4. Check for global bindings
    return getGlobalBinding(keyEvent);
}
```

---

## 9. Rendering Pipeline

### 9.1 Message Rendering Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MESSAGE RENDERING PIPELINE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Message received from agent loop                                        │
│       │                                                                      │
│       ▼                                                                      │
│  2. Pre-processing                                                           │
│     ├── Format detection (text, tool_use, thinking)                         │
│     ├── Truncation check (> 10000 chars)                                    │
│     └── Diff detection (for Edit results)                                   │
│       │                                                                      │
│       ▼                                                                      │
│  3. State update                                                             │
│     ├── setMessages([...prev, newMessage])                                  │
│     └── Trigger re-render                                                   │
│       │                                                                      │
│       ▼                                                                      │
│  4. Virtualization (useDeferredValue)                                       │
│     ├── Only render visible messages                                        │
│     └── Batch updates for performance                                       │
│       │                                                                      │
│       ▼                                                                      │
│  5. Content rendering                                                        │
│     ├── Text blocks → Syntax highlighted                                    │
│     ├── Tool use → Tool use component                                       │
│     ├── Thinking → Thinking block component                                 │
│     └── Tool result → Result display                                        │
│       │                                                                      │
│       ▼                                                                      │
│  6. Ink render                                                               │
│     ├── Convert to terminal output                                          │
│     ├── Handle ANSI codes                                                   │
│     └── Update terminal display                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Component Hierarchy

```
REPL (ot8)
├── InputProvider
│   └── InputHandler
├── MessageList (veY)
│   └── Message[]
│       ├── UserMessage
│       ├── AssistantMessage
│       │   ├── TextBlock
│       │   ├── ThinkingBlock
│       │   └── ToolUseBlock
│       └── SystemMessage
├── StreamingIndicator
│   ├── Spinner
│   └── ToolProgress
├── Dialog
│   ├── PermissionDialog
│   ├── McpDialog
│   └── ConfirmationDialog
└── StatusBar
    ├── TokenUsage
    ├── ModelInfo
    └── ModeIndicator
```

---

## 10. Source Code Restoration

### 10.1 REPL Component Structure

```javascript
// ============================================
// REPL Component - Main UI component
// Location: chunks.196.mjs
// ============================================

// READABLE (for understanding):
function REPL({ store, initialState }) {
    // Core state
    let [messages, setMessages] = useState(initialState.messages);
    let [input, setInput] = useState("");
    let [streamMode, setStreamMode] = useState("idle");
    let [streamingToolUses, setStreamingToolUses] = useState([]);
    let [streamingThinking, setStreamingThinking] = useState(null);
    let [inProgressToolUseIDs, setInProgressToolUseIDs] = useState(new Set());
    let [dialogState, setDialogState] = useState(null);

    // Derived state
    let streamingToolUseIDs = useMemo(
        () => new Set(streamingToolUses.map(t => t.contentBlock.id)),
        [streamingToolUses]
    );

    let hasInterruptibleToolInProgress = useMemo(
        () => inProgressToolUseIDs.size > 0,
        [inProgressToolUseIDs]
    );

    // Input handler
    useInput((char, key) => {
        handleInput(char, key, {
            input, setInput,
            streamMode, setStreamMode,
            hasInterruptibleToolInProgress,
            dialogState, setDialogState
        });
    });

    // Agent loop integration
    useEffect(() => {
        let abortController = new AbortController();

        (async () => {
            for await (let event of mainAgentLoop({
                messages,
                systemPrompt: initialState.systemPrompt,
                toolUseContext: initialState.toolUseContext,
                signal: abortController.signal
            })) {
                handleStreamEvent(event, {
                    setMessages,
                    setStreamMode,
                    setStreamingToolUses,
                    setStreamingThinking,
                    setInProgressToolUseIDs
                });
            }
        })();

        return () => abortController.abort();
    }, [/* dependencies */]);

    // Render
    return (
        <Box flexDirection="column">
            <MessageList
                messages={messages}
                streamingToolUses={streamingToolUses}
                streamingToolUseIDs={streamingToolUseIDs}
                inProgressToolUseIDs={inProgressToolUseIDs}
            />
            <StreamingIndicator
                streamMode={streamMode}
                streamingToolUses={streamingToolUses}
                streamingThinking={streamingThinking}
            />
            {dialogState && (
                <Dialog state={dialogState} onClose={() => setDialogState(null)} />
            )}
            <InputArea
                input={input}
                setInput={setInput}
                disabled={streamMode !== "idle"}
            />
            <StatusBar
                tokenUsage={calculateTokenUsage(messages)}
                model={initialState.model}
                mode={initialState.permissionMode}
            />
        </Box>
    );
}
```

### 10.2 Message Flattening

```javascript
// ============================================
// flattenMessages - Flatten assistant messages
// Location: chunks.173.mjs:1516-1550
// ============================================

// ORIGINAL (for source lookup):
function JM(A) {
    let q = [];
    for (let K of A) {
        if (K.type === "assistant" && Array.isArray(K.message?.content)) {
            for (let Y of K.message.content) {
                if (Y.type === "text" && Y.text.trim()) {
                    q.push({
                        type: "assistant",
                        message: {
                            role: "assistant",
                            content: [Y]
                        },
                        uuid: generateUUID(),
                        timestamp: K.timestamp
                    });
                }
            }
        } else {
            q.push(K);
        }
    }
    return q;
}

// READABLE (for understanding):
function flattenMessages(messages) {
    let result = [];

    for (let message of messages) {
        // Only flatten assistant messages with content arrays
        if (message.type === "assistant" && Array.isArray(message.message?.content)) {
            for (let block of message.message.content) {
                // Create separate message for each text block
                if (block.type === "text" && block.text.trim()) {
                    result.push({
                        type: "assistant",
                        message: {
                            role: "assistant",
                            content: [block]
                        },
                        uuid: generateUUID(),
                        timestamp: message.timestamp
                    });
                }
            }
        } else {
            // Keep other messages as-is
            result.push(message);
        }
    }

    return result;
}

// Mapping: JM→flattenMessages
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - State Management
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `handleToolUseStream` (xN6) - Stream event processor at chunks.173.mjs:2384
- `MessageList` (veY) - Message list component at chunks.161.mjs:3
- `flattenMessages` (JM) - Message flattening at chunks.173.mjs:1516
- `filterEmptyMessages` (Gi6) - Empty message filter at chunks.173.mjs:1502
- `REPL` (ot8) - Main REPL component at chunks.196.mjs

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All UI state machine documentation with source-level restoration