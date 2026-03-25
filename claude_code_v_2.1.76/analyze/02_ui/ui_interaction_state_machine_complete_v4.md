# UI Interaction State Machine Complete v4 (Claude Code 2.1.76)

> Complete UI state machine analysis with source-level restoration and interaction patterns.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.
> **Analysis Depth**: Source-level restoration with state transition diagrams.
> **Integration**: Full keyboard input handling and streaming display patterns.

---

## Table of Contents

1. [State Variables](#1-state-variables)
2. [State Machine Diagram](#2-state-machine-diagram)
3. [State Transitions](#3-state-transitions)
4. [Input Handling](#4-input-handling)
5. [Streaming Display](#5-streaming-display)
6. [Message Management](#6-message-management)
7. [Tool Execution UI](#7-tool-execution-ui)

---

## 1. State Variables

### 1.1 Core UI State

```javascript
// ============================================
// UI State Variables - REPL component
// Location: chunks.196.mjs:96-100
// ============================================

// ORIGINAL (for source lookup):
let [d7, W4] = N8.useState("responding"), Dz = N8.useRef(d7);
Dz.current = d7;
let [JK, F3] = N8.useState([]), [MK, k3] = N8.useState(null);

// READABLE (for understanding):
// Primary UI state: "responding" | "thinking" | "tool-use"
let [uiState, setUIState] = useState("responding");

// Ref for synchronous access in non-React callbacks
let uiStateRef = useRef(uiState);
uiStateRef.current = uiState;

// Active tool executions during streaming
let [toolUses, setToolUses] = useState([]);

// Thinking state for extended thinking display
let [thinkingState, setThinkingState] = useState(null);
// thinkingState: { thinking: string, isStreaming: boolean, streamingEndedAt: number } | null

// Mapping: d7→uiState, W4→setUIState, Dz→uiStateRef, JK→toolUses, F3→setToolUses, MK→thinkingState, k3→setThinkingState
```

### 1.2 Message State

```javascript
// ============================================
// Message State Management
// Location: chunks.196.mjs:173-183
// ============================================

// ORIGINAL (for source lookup):
let [u7, Xz] = N8.useState(Y ?? []), iY = N8.useRef(u7);
let gq = N8.useCallback((P1) => {
    let Y8 = typeof P1 === "function" ? P1(iY.current) : P1;
    iY.current = Y8, Xz(Y8)
}, []);

// READABLE (for understanding):
// Message list state
let [messages, setMessages] = useState(initialMessages ?? []);

// Ref for async access (streaming callbacks)
let messagesRef = useRef(messages);

// Update function supporting both functional and direct updates
let updateMessages = useCallback((updater) => {
    let newMessages = typeof updater === "function"
        ? updater(messagesRef.current)
        : updater;

    // Sync ref before state update for async access
    messagesRef.current = newMessages;
    setMessages(newMessages);
}, []);

// Deferred rendering for performance
let deferredMessages = useDeferredValue(messages);

// Track deferred delta for logging
let messageDelta = messages.length - deferredMessages.length;
if (messageDelta > 0) {
    debugLog(`[useDeferredValue] Messages deferred by ${messageDelta}`);
}

// Mapping: u7→messages, Xz→setMessages, iY→messagesRef, gq→updateMessages
```

### 1.3 Input State

```javascript
// ============================================
// Input State Variables
// Location: chunks.196.mjs:185-200
// ============================================

// READABLE (for understanding):
// Current input buffer
let [inputBuffer, setInputBuffer] = useState(() => initializeInputBuffer());

// Track if input has content
let [hasInput, setHasInput] = useState(false);

// Input ref for cursor management
let inputRef = useRef(null);

// Pending local JSX command
let [localJSXCommand, setLocalJSXCommand] = useState(null);

// Update input with typing indicator
let updateInput = useCallback((newInput) => {
    // Clear any pending jump if transitioning from empty to content
    if (inputBufferRef.current === "" && newInput !== "") {
        clearPendingJump();
    }

    setInputBuffer(newInput);
    setHasInput(newInput.trim().length > 0);
}, [setHasInput, clearPendingJump]);

// Debounce typing indicator
useEffect(() => {
    if (inputBuffer.trim().length === 0) return;

    let timeout = setTimeout(() => setHasInput(false), TYPING_TIMEOUT_MS);
    return () => clearTimeout(timeout);
}, [inputBuffer]);
```

---

## 2. State Machine Diagram

### 2.1 Primary State Machine

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              UI STATE MACHINE                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │   START     │
                                    └──────┬──────┘
                                           │
                                           ▼
                                   ┌───────────────┐
                           ┌───────│  responding   │◄─────────────────────────────┐
                           │       │               │                              │
                           │       └───────┬───────┘                              │
                           │               │                                      │
                           │               │ user input (Enter)                   │
                           │               │                                      │
                           │               ▼                                      │
                           │       ┌───────────────┐                              │
                           │       │   thinking    │◄────────────┐                │
                           │       │               │             │                │
                           │       └───────┬───────┘             │                │
                           │               │                     │                │
                           │               ├─────────────────────┤                │
                           │               │                     │                │
                           │    no tools   │   tool_use          │ tools complete │
                           │               │                     │                │
                           │               ▼                     ▼                │
                           │               │             ┌───────────────┐        │
                           │               │             │   tool-use    │────────┘
                           │               │             │               │
                           │               │             └───────────────┘
                           │               │
                           │               ▼
                           │       ┌───────────────┐
                           └──────►│    DONE       │
                                   └───────────────┘


State Descriptions:
┌──────────────┬─────────────────────────────────────────────────────────────────┐
│ State        │ Description                                                      │
├──────────────┼─────────────────────────────────────────────────────────────────┤
│ responding   │ Idle state - accepting user input, showing conversation history  │
│ thinking     │ LLM is streaming response - input disabled, spinner active       │
│ tool-use     │ Tools being executed - progress shown, can interrupt some tools  │
│ DONE         │ Final state - turn complete, may auto-continue if tools called   │
└──────────────┴─────────────────────────────────────────────────────────────────┘
```

### 2.2 Extended State Transitions

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         EXTENDED STATE TRANSITIONS                               │
└─────────────────────────────────────────────────────────────────────────────────┘

responding ────────────────────────────────────────────────────────────────────────
    │
    ├─── user types in input ───────────► Update inputBuffer state
    │                                          │
    │                                          ▼
    │                                    setHasInput(true)
    │                                          │
    │                                          ▼
    │                                    Debounce typing indicator
    │
    ├─── user presses Enter ────────────► handleSubmit()
    │     │                                    │
    │     │                                    ▼
    │     │                              Build message with attachments
    │     │                                    │
    │     │                                    ▼
    │     │                              setUIState("thinking")
    │     │                                    │
    │     │                                    ▼
    │     │                              Call mainAgentLoop()
    │     │
    │     └─── input empty ──────────────► Ignore (or handle special command)
    │
    └─── user presses Escape ───────────► Clear inputBuffer

thinking ─────────────────────────────────────────────────────────────────────────
    │
    ├─── stream_event: content_block_start ────► Initialize content block
    │       │                                         │
    │       │                                         ▼
    │       │                                  If tool_use: setUIState("tool-use")
    │       │                                         │
    │       │                                         ▼
    │       │                                  Add to toolUses state
    │
    ├─── stream_event: content_block_delta ────► Accumulate content
    │       │                                         │
    │       │                                         ▼
    │       │                                  Update message preview
    │
    ├─── stream_event: message_delta ──────────► Update usage, check stop reason
    │
    ├─── message: assistant ─────────────────► Append to messages
    │
    └─── stream_event: message_stop ──────────► Finalize stream
                                                  │
                                                  ▼
                                           If tools called: continue
                                           If no tools: setUIState("responding")

tool-use ─────────────────────────────────────────────────────────────────────────
    │
    ├─── tool progress event ─────────────► Update toolUses[].progress
    │
    ├─── tool result event ───────────────► Update toolUses[].results
    │
    ├─── tool complete ───────────────────► Yield result, remove from toolUses
    │
    ├─── user presses Ctrl+C ─────────────► Check interruptBehavior
    │       │                                         │
    │       │                                         ▼
    │       │                                  If "cancel": abort tool
    │       │                                  If "block": show dialog
    │
    └─── all tools complete ──────────────► setUIState("thinking")
                                                  │
                                                  ▼
                                           Continue to next turn
```

---

## 3. State Transitions

### 3.1 Transition Functions

```javascript
// ============================================
// State Transition Functions
// ============================================

// Transition: responding → thinking
function startThinking(userMessage) {
    setUIState("thinking");
    setToolUses([]);

    // Build message with attachments
    let message = buildUserMessage(userMessage, {
        attachments: currentAttachments,
        isMeta: false
    });

    // Add to messages
    updateMessages(prev => [...prev, message]);

    // Start agent loop
    startAgentLoop(message);
}

// Transition: thinking → tool-use
function handleToolUseDetected(toolUseBlock) {
    setUIState("tool-use");

    // Add to tool uses
    setToolUses(prev => [...prev, {
        id: toolUseBlock.id,
        name: toolUseBlock.name,
        input: toolUseBlock.input,
        status: "pending",
        progress: [],
        results: []
    }]);
}

// Transition: tool-use → thinking
function handleToolComplete(toolId, results) {
    setToolUses(prev => prev.filter(t => t.id !== toolId));

    // If no more tools, transition back to thinking
    let remaining = toolUsesRef.current.filter(t => t.status !== "completed");
    if (remaining.length === 0) {
        setUIState("thinking");
    }
}

// Transition: thinking → responding
function handleTurnComplete() {
    setUIState("responding");
    setThinkingState(null);
    setToolUses([]);
}

// Transition: any → responding (on error)
function handleError(error) {
    setUIState("responding");
    // Show error in messages
    updateMessages(prev => [...prev, createErrorMessage(error)]);
}
```

### 3.2 Interruptible Tools

Some tools can be interrupted mid-execution by Ctrl+C:

```javascript
// ============================================
// Interrupt Handling
// ============================================

// Tool interrupt behaviors
const INTERRUPT_BEHAVIORS = {
    // Cancel: Tool can be safely cancelled
    "cancel": ["Read", "Grep", "Glob", "WebFetch", "WebSearch"],

    // Block: Tool cannot be interrupted (may corrupt state)
    "block": ["Write", "Edit", "Bash", "NotebookEdit"]
};

function handleInterrupt() {
    let currentTools = toolUsesRef.current;

    // Check if all executing tools are cancellable
    let allCancellable = currentTools.every(tool =>
        INTERRUPT_BEHAVIORS.cancel.includes(tool.name)
    );

    if (allCancellable) {
        // Abort all tools
        abortController.abort("interrupt");
        setToolUses([]);
        setUIState("responding");
    } else {
        // Show interrupt dialog
        showInterruptDialog({
            message: "Some tools cannot be safely interrupted",
            options: ["Wait for completion", "Force abort (may corrupt)"]
        });
    }
}
```

---

## 4. Input Handling

### 4.1 Keyboard Event Processing

```javascript
// ============================================
// Keyboard Event Handling
// Location: chunks.196.mjs (REPL component)
// ============================================

// READABLE (for understanding):
function handleKeyDown(event) {
    // Ctrl+C: Interrupt
    if (event.ctrlKey && event.key === "c") {
        event.preventDefault();

        if (uiStateRef.current !== "responding") {
            handleInterrupt();
        }
        return;
    }

    // Escape: Clear input or cancel
    if (event.key === "Escape") {
        event.preventDefault();

        if (inputBuffer.length > 0) {
            setInputBuffer("");
        } else {
            // Maybe exit special mode
            handleEscape();
        }
        return;
    }

    // Enter: Submit message
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        if (uiStateRef.current === "responding" && inputBuffer.trim()) {
            handleSubmit(inputBuffer);
        }
        return;
    }

    // Arrow Up/Down: Navigate history
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        navigateHistory(event.key === "ArrowUp" ? -1 : 1);
        return;
    }

    // Tab: Autocomplete
    if (event.key === "Tab") {
        event.preventDefault();
        handleAutocomplete();
        return;
    }
}
```

### 4.2 Input State Machine

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           INPUT STATE MACHINE                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

Input States:
- empty: No input content
- typing: User is actively typing
- hasContent: Input has content but user stopped typing
- submitting: Input is being submitted

State Transitions:
                                    ┌───────────────┐
                                    │     empty     │
                                    └───────┬───────┘
                                            │
                            user types      │
                            ───────────────►│
                                            │
                                            ▼
                                    ┌───────────────┐
                            ┌───────│    typing     │◄──────┐
                            │       └───────┬───────┘       │
                            │               │               │
                timeout     │               │ user types    │
                (no input)  │               │               │
                            │               ▼               │
                            │       ┌───────────────┐       │
                            └───────│  hasContent   │───────┘
                                    └───────┬───────┘
                                            │
                            user presses    │
                            Enter           │
                            ───────────────►│
                                            │
                                            ▼
                                    ┌───────────────┐
                                    │  submitting   │
                                    └───────┬───────┘
                                            │
                            submitted       │
                            ───────────────►│
                                            │
                                            ▼
                                    ┌───────────────┐
                                    │     empty     │
                                    └───────────────┘
```

---

## 5. Streaming Display

### 5.1 SSE Event to UI State Mapping

```javascript
// ============================================
// SSE Event Handling for UI
// ============================================

function handleStreamEvent(event) {
    switch (event.type) {
        case "stream_event":
            handleSSEEvent(event.event);
            break;

        case "message":
            handleMessage(event.message);
            break;
    }
}

function handleSSEEvent(sseEvent) {
    switch (sseEvent.type) {
        case "message_start":
            // Initialize message state
            setCurrentMessage({
                id: sseEvent.message.id,
                role: "assistant",
                content: []
            });
            break;

        case "content_block_start":
            let block = sseEvent.content_block;

            if (block.type === "tool_use") {
                // Transition to tool-use state
                setUIState("tool-use");

                // Add tool to active tools
                setToolUses(prev => [...prev, {
                    id: block.id,
                    name: block.name,
                    input: "",  // Accumulated via deltas
                    status: "pending",
                    progress: [],
                    results: []
                }]);
            } else if (block.type === "thinking") {
                // Initialize thinking state
                setThinkingState({
                    thinking: "",
                    isStreaming: true,
                    streamingEndedAt: null
                });
            }
            break;

        case "content_block_delta":
            let delta = sseEvent.delta;

            if (delta.type === "text_delta") {
                // Update message content
                updateCurrentMessage(prev => ({
                    ...prev,
                    content: appendText(prev.content, delta.text)
                }));
            } else if (delta.type === "input_json_delta") {
                // Update tool input
                setToolUses(prev => prev.map(tool =>
                    tool.id === sseEvent.index
                        ? { ...tool, input: tool.input + delta.partial_json }
                        : tool
                ));
            } else if (delta.type === "thinking_delta") {
                // Update thinking content
                setThinkingState(prev => ({
                    ...prev,
                    thinking: prev.thinking + delta.thinking
                }));
            }
            break;

        case "content_block_stop":
            // Finalize content block
            if (contentBlocks[sseEvent.index]?.type === "thinking") {
                setThinkingState(prev => ({
                    ...prev,
                    isStreaming: false,
                    streamingEndedAt: Date.now()
                }));
            }
            break;

        case "message_delta":
            // Update usage
            setUsage(prev => mergeUsage(prev, sseEvent.usage));

            // Handle stop reasons
            if (sseEvent.delta.stop_reason === "max_tokens") {
                handleError(new Error("max_output_tokens exceeded"));
            }
            break;

        case "message_stop":
            // Stream complete
            break;
    }
}

function handleMessage(message) {
    if (message.type === "assistant") {
        // Append complete message to list
        updateMessages(prev => [...prev, message]);
    } else if (message.type === "user" && message.isMeta) {
        // System reminder - append as meta message
        updateMessages(prev => [...prev, message]);
    }
}
```

### 5.2 Streaming Display Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        STREAMING DISPLAY ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────────────────┘

mainAgentLoop yields event
        │
        ▼
┌───────────────────┐
│ handleStreamEvent │
└─────────┬─────────┘
          │
          ├─── stream_event ────────────────────────────────────┐
          │                                                      │
          │                                                      ▼
          │                                    ┌─────────────────────────────────┐
          │                                    │       SSE Event Handler          │
          │                                    │                                  │
          │                                    │  message_start                   │
          │                                    │  ├── Initialize message state    │
          │                                    │  │                               │
          │                                    │  content_block_start             │
          │                                    │  ├── Create block placeholder   │
          │                                    │  ├── If tool_use: setUIState    │
          │                                    │  │                               │
          │                                    │  content_block_delta             │
          │                                    │  ├── Accumulate text/json       │
          │                                    │  ├── Update toolUses            │
          │                                    │  │                               │
          │                                    │  content_block_stop              │
          │                                    │  ├── Finalize block             │
          │                                    │  │                               │
          │                                    │  message_delta                   │
          │                                    │  ├── Update usage               │
          │                                    │  │                               │
          │                                    │  message_stop                    │
          │                                    │  └── Stream complete            │
          │                                    └─────────────────────────────────┘
          │
          └─── message ────────────────────────────────────────────┐
                                                                     │
                                                                     ▼
                                            ┌─────────────────────────────────┐
                                            │     Message Handler             │
                                            │                                 │
                                            │  type: "assistant"              │
                                            │  └── Append to messages list   │
                                            │                                 │
                                            │  type: "user" && isMeta         │
                                            │  └── System reminder           │
                                            │      (hidden from user)        │
                                            └─────────────────────────────────┘
```

---

## 6. Message Management

### 6.1 Message State Updates

```javascript
// ============================================
// Message State Updates
// ============================================

// Add user message
function addUserMessage(content, { attachments = [], isMeta = false } = {}) {
    let message = {
        type: "user",
        uuid: generateUUID(),
        timestamp: Date.now(),
        message: {
            role: "user",
            content: buildContentArray(content, attachments),
            isMeta
        }
    };

    updateMessages(prev => [...prev, message]);
    return message;
}

// Add assistant message
function addAssistantMessage(content, { thinking, toolUses } = {}) {
    let message = {
        type: "assistant",
        uuid: generateUUID(),
        timestamp: Date.now(),
        message: {
            role: "assistant",
            content: buildAssistantContent(content, thinking, toolUses)
        }
    };

    updateMessages(prev => [...prev, message]);
    return message;
}

// Remove message pair (for tombstone/undo)
function removeMessagePair(assistantUuid) {
    updateMessages(prev => {
        let assistantIndex = prev.findIndex(m => m.uuid === assistantUuid);
        if (assistantIndex === -1) return prev;

        let userIndex = assistantIndex - 1;
        if (userIndex < 0 || prev[userIndex].type !== "user") return prev;

        return prev.filter((_, i) => i !== userIndex && i !== assistantIndex);
    });
}

// Replace last assistant message (for tool result)
function replaceLastAssistant(newContent) {
    updateMessages(prev => {
        let lastAssistant = prev.findLastIndex(m => m.type === "assistant");
        if (lastAssistant === -1) return prev;

        return prev.map((m, i) =>
            i === lastAssistant
                ? { ...m, message: { ...m.message, content: newContent } }
                : m
        );
    });
}
```

### 6.2 Message Rendering

```javascript
// ============================================
// Message Rendering with Deferred Value
// ============================================

function MessageList() {
    let messages = useAppState(state => state.messages);
    let deferredMessages = useDeferredValue(messages);

    // Show count of deferred messages
    let delta = messages.length - deferredMessages.length;

    return (
        <Box flexDirection="column">
            {delta > 0 && (
                <Text dimColor>
                    Rendering {delta} new messages...
                </Text>
            )}

            {deferredMessages.map(message => (
                <MessageItem key={message.uuid} message={message} />
            ))}
        </Box>
    );
}

function MessageItem({ message }) {
    switch (message.type) {
        case "user":
            return <UserMessage message={message} />;
        case "assistant":
            return <AssistantMessage message={message} />;
        case "attachment":
            return <SystemReminder message={message} />;
        default:
            return null;
    }
}

function AssistantMessage({ message }) {
    let { content, thinking, toolUses } = message.message;

    return (
        <Box flexDirection="column">
            {thinking && <ThinkingBlock thinking={thinking} />}
            {content.map((block, i) => (
                <ContentBlock key={i} block={block} />
            ))}
            {toolUses?.map(toolUse => (
                <ToolUseProgress key={toolUse.id} toolUse={toolUse} />
            ))}
        </Box>
    );
}
```

---

## 7. Tool Execution UI

### 7.1 Tool Progress Display

```javascript
// ============================================
// Tool Progress Display
// ============================================

function ToolUseProgress({ toolUse }) {
    let { name, input, status, progress, results } = toolUse;

    return (
        <Box flexDirection="column" borderStyle="round" borderColor="blue">
            {/* Tool header */}
            <Text bold color="blue">
                {name} {status === "pending" ? "⏳" : status === "executing" ? "⚙️" : "✓"}
            </Text>

            {/* Input preview */}
            <Text dimColor>
                {truncate(JSON.stringify(input), 50)}
            </Text>

            {/* Progress items */}
            {progress.map((item, i) => (
                <Text key={i} dimColor>
                    {item.type}: {item.message}
                </Text>
            ))}

            {/* Results */}
            {results.length > 0 && (
                <Box flexDirection="column">
                    {results.map((result, i) => (
                        <ToolResult key={i} result={result} />
                    ))}
                </Box>
            )}
        </Box>
    );
}

function ToolResult({ result }) {
    let { type, content, is_error } = result;

    return (
        <Box>
            <Text color={is_error ? "red" : "green"}>
                {is_error ? "✗" : "✓"}
            </Text>
            <Text>
                {truncate(content, 100)}
            </Text>
        </Box>
    );
}
```

### 7.2 Parallel Tool Execution Visualization

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    PARALLEL TOOL EXECUTION UI                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

User sees during parallel execution:

┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🔧 Tool Execution (3 running)                                                    │
│                                                                                  │
│ ┌─────────────────────────────────┐ ┌─────────────────────────────────┐         │
│ │ ⚙️ Read(file1.ts)               │ │ ⚙️ Grep("pattern")              │         │
│ │ Status: executing               │ │ Status: executing               │         │
│ │ Progress: Reading lines 1-100...│ │ Progress: Searching files...    │         │
│ └─────────────────────────────────┘ └─────────────────────────────────┘         │
│                                                                                  │
│ ┌─────────────────────────────────┐                                              │
│ │ ⚙️ Glob("*.ts")                 │                                              │
│ │ Status: executing               │                                              │
│ │ Progress: Found 15 files...     │                                              │
│ └─────────────────────────────────┘                                              │
└─────────────────────────────────────────────────────────────────────────────────┘

After completion:

┌─────────────────────────────────────────────────────────────────────────────────┐
│ ✓ Tool Execution Complete                                                        │
│                                                                                  │
│ ✓ Read(file1.ts) - 150 lines read                                               │
│ ✓ Grep("pattern") - 5 matches found                                             │
│ ✓ Glob("*.ts") - 23 files matched                                               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution (Agent Loop, LLM API)
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features (Compact, Thinking)
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - UI Components

Key symbols in this document:
- `uiState` (d7) - Primary UI state at chunks.196.mjs:96
- `setUIState` (W4) - State setter at chunks.196.mjs:96
- `uiStateRef` (Dz) - Ref for async access at chunks.196.mjs:97
- `toolUses` (JK) - Active tool executions at chunks.196.mjs:99
- `thinkingState` (MK) - Thinking display state at chunks.196.mjs:100
- `messages` (u7) - Message list state at chunks.196.mjs:173
- `updateMessages` (gq) - Message update function at chunks.196.mjs:173

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All UI interaction patterns documented with source verification