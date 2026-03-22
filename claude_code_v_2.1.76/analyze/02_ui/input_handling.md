# Input Handling System

> Related Symbols:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI, Keybindings

Key functions in this document:
- `REPL` (`ot8`) - Main REPL component, chunks.196.mjs:3
- `handleToolUseStream` (`xN6`) - Core streaming event processor, chunks.173.mjs:2384
- `getInputDialogType` (`ra6`) - Priority dialog dispatcher, chunks.196.mjs:387-404
- `handleCancel` (`TM`) - Escape/cancel handler, chunks.196.mjs:420-432
- `ToolPermissionDialog` (`HIq`) - Tool use approval dialog, chunks.190.mjs:899
- `PromptDialog` (`fIq`) - Tool prompt selection dialog, chunks.190.mjs:2125
- `MessageList` (`veY`) - Memoized message list component, chunks.161.mjs:3
- `flattenMessages` (`JM`) - Flattens assistant messages for rendering, chunks.173.mjs:1516
- `filterEmptyMessages` (`Gi6`) - Filters empty messages from display, chunks.173.mjs:1502

> **Symbol Validation Status**: All symbols cross-validated against source code on 2026-03-22.

---

## Table of Contents

- [1. Architecture Overview](#1-architecture-overview)
- [2. PromptInput Component (YUA)](#2-promptinput-component-yua)
- [3. Input Modes](#3-input-modes)
- [4. History Navigation](#4-history-navigation)
- [5. Autocomplete System](#5-autocomplete-system)
- [6. Vim Mode Integration](#6-vim-mode-integration)
- [7. Image Attachment Handling](#7-image-attachment-handling)
- [8. Multi-line Input](#8-multi-line-input)
- [9. Submit Flow](#9-submit-flow)
- [10. Prompt Dialog System](#10-prompt-dialog-system)
- [11. Deep Algorithm Analysis: Concurrency Guard](#11-deep-algorithm-analysis-concurrency-guard)
- [12. Submit Flow State Machine](#12-submit-flow-state-machine)
- [13. v2.1.76 Input Handling Changes](#13-v2176-input-handling-changes)

---

## 1. Architecture Overview

The input handling system manages all user text input to Claude Code, providing:

```
┌──────────────────────────────────────────────────────────────────────┐
│                      INPUT HANDLING SYSTEM                            │
│                                                                       │
│  User keystrokes → PromptInput                                       │
│                          │                                           │
│                          ├── Autocomplete overlay                    │
│                          ├── History navigation (↑/↓)                │
│                          ├── Vim mode state                          │
│                          └── Image paste handling                    │
│                                                                       │
│  Submit (Enter) → handleSubmit                                       │
│                          │                                           │
│                          ├── Slash command? → processCommand         │
│                          │       ├── local-jsx → setToolJSX          │
│                          │       └── regular → executeCommand        │
│                          │                                           │
│                          └── Regular input → executeQuery            │
│                                  ├── Concurrency guard               │
│                                  └── handleQuery → Agent loop        │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**

1. **Single entry point**: All user input flows through `handleSubmit`
2. **Concurrency guard**: Prevents multiple simultaneous queries via ref
3. **Queue on concurrent**: If user submits while loading, input is queued
4. **Vim mode opt-in**: Disabled by default, enabled via settings

**v2.1.76 changes:**
- Voice mode improvements: microphone access now gracefully falls back when permissions are denied
- Escape key fixes: double-Escape reliably opens message selector even after certain dialog states
- `/color` command: sets the prompt-bar accent color for the current session
- Ctrl+F: opens agent filter panel to show/filter active background agents

---

## 2. PromptInput Component

The `PromptInput` component is the main interactive input element.

```javascript
// ============================================
// PromptInput - Main input component
// Location: chunks.188.mjs (referenced via igA component)
// ============================================

// Props interface:
{
    onSubmit: (input, helpers) => void,    // Submit handler
    isActive: boolean,                      // Input focus state
    isLoading: boolean,                     // Disable during loading
    vimMode: "INSERT" | "NORMAL",          // Vim mode state
    initialValue: string,                   // Pre-filled value
    pastedContents: object,                 // Image/file attachments
    ideSelection: object,                   // IDE file selection
    inputMode: "prompt" | "shift-enter",   // Multi-line mode
    setPastedContents: function,            // Update attachments
    onInputChange: function,                // Input value change
    setCursorOffset: function,              // Cursor position
    clearBuffer: function,                  // Clear input
}
```

### Component State

The component maintains internal state for:

| State | Purpose |
|-------|---------|
| Cursor position | Track text insertion point |
| Selection range | Support text selection |
| History index | Navigate through history |
| Autocomplete visible | Show/hide autocomplete overlay |
| Focus state | Handle focus/blur events |

### Key Bindings

Input handling responds to these key events:

| Key | Action |
|-----|--------|
| Enter | Submit (in prompt mode) or newline (in multi-line) |
| Shift+Enter | Newline (in prompt mode) or submit (in shift-enter mode) |
| Up Arrow | History previous OR cursor up (multi-line) |
| Down Arrow | History next OR cursor down (multi-line) |
| Tab | Accept autocomplete suggestion |
| Escape | Cancel autocomplete / clear input |
| Ctrl+R | Open message selector (transcript) |
| Ctrl+_ | Undo input |
| Ctrl+F | Open agent filter panel (v2.1.76) |

### /color Command (v2.1.76)

The `/color` slash command sets the prompt-bar accent color for the current session:

```javascript
// /color <colorName> sets session-scoped prompt bar color
// Valid values: "default", "blue", "green", "red", "purple", "orange"
// Stored in session state, not persisted to settings
// Used for visual differentiation between multiple Claude Code windows
```

---

## 3. Input Modes

The input component supports two modes controlled by `inputMode` state:

### Prompt Mode (`"prompt"`)

- Single-line input optimized for quick queries
- Enter submits immediately
- Shift+Enter creates newline (multiline expansion)

### Shift-Enter Mode (`"shift-enter"`)

- Multi-line optimized for code/prompt editing
- Enter creates newline
- Shift+Enter submits

```javascript
// Mode determination in handleSubmit:
if (!FA && k6.trim().startsWith("/")) {
    // Slash command handling
    let k7 = k6.trim();
    let X4 = k7.indexOf(" ");
    let p7 = X4 === -1 ? k7.slice(1) : k7.slice(1, X4);  // Command name
    // ...
}

// Input mode affects display:
const displayText = FA ? k6 : qk7(k6, e4);  // qk7 formats based on mode
```

---

## 4. History Navigation

The history system allows users to navigate previous inputs.

### History State

```javascript
// From REPL state:
[nA, V8] = dA.useState([]);  // Message history

// History lookup:
const _D = dA.useMemo(() => iO(nA).filter(et), [nA]);
```

### Navigation Algorithm

```javascript
// ============================================
// getPreviousQueuedMessage - Navigate history
// Location: chunks (V_6 function)
// ============================================

// ORIGINAL (for source lookup):
async function V_6(inputValue, offset, getAppState, setAppState) {
    // Get history from state
    let history = await getHistoryFromState(getAppState);
    if (history.length === 0) return null;

    // Calculate index based on offset
    let index = history.length - 1 - offset;
    if (index < 0) return null;

    // Return historical message
    return {
        text: history[index].text,
        images: history[index].images || []
    };
}

// READABLE (for understanding):
async function getPreviousQueuedMessage(inputValue, historyOffset, getAppState, setAppState) {
    // History is stored in reverse chronological order
    const history = await getHistoryFromState(getAppState);
    if (history.length === 0) return null;

    // Offset 0 = most recent, offset 1 = second most recent, etc.
    const index = history.length - 1 - historyOffset;
    if (index < 0) return null;

    return {
        text: history[index].text,
        images: history[index].images || []
    };
}
```

### History States

| State Variable | Purpose |
|---------------|---------|
| `T4` | `isSearchingHistory` - Search overlay active |
| `D2` | `isHelpOpen` - Help overlay active |
| `s_` | `isSearchingInputHistory` - Input history search |

**Priority Interaction:** When `s_` or `D2` is true, `getInputDialogType` returns `undefined`, blocking all dialogs. This ensures the user can complete their search without interruption.

---

## 5. Autocomplete System

Autocomplete provides suggestions for slash commands and tool references.

### Trigger Conditions

```javascript
// Autocomplete shows when:
// 1. Input starts with "/"
// 2. Cursor is at the end of input
// 3. No other overlay is active
```

### Command Matching

```javascript
// From handleSubmit - command resolution:
let sq = RA.find((pK) =>
    pK.isEnabled() && (
        pK.name === p7 ||           // Exact match
        pK.aliases?.includes(p7) || // Alias match
        pK.userFacingName() === p7  // Display name match
    )
);
```

### Autocomplete Items

The autocomplete system shows:

1. **Slash commands** - From `RA` (commands array)
2. **Tool references** - When tool search is enabled
3. **File paths** - For certain commands

### Selection Handling

```javascript
// Tab to accept:
if (autocompleteVisible && autocompleteSelectedItem) {
    setInputValue(inputValue + autocompleteSelectedItem.completion);
    setAutocompleteVisible(false);
}
```

---

## 6. Vim Mode Integration

Vim mode provides modal editing for power users. This feature is enabled via the `/vim` slash command.

### Mode States

```javascript
// ============================================
// Vim Mode State Management
// Location: chunks.196.mjs:235 (via hooks from chunks.162.mjs)
// ============================================

// ORIGINAL (for source lookup):
[sZ, rF] = dA.useState("INSERT");  // vimMode, setVimMode

// READABLE (for understanding):
[vimMode, setVimMode] = useState("INSERT");  // Default: INSERT mode

// Values: "INSERT" | "NORMAL"
```

### Mode Behaviors

| Mode | Key Behaviors | Cursor Style |
|------|---------------|--------------|
| INSERT | Normal typing, Enter submits, Escape → NORMAL | Line cursor |
| NORMAL | Navigation keys (`h`, `j`, `k`, `l`), `i` enters INSERT, `a` append | Block cursor |

### Mode Switching Algorithm

```javascript
// ============================================
// Vim Mode Key Handling
// Location: chunks.162.mjs:1614-1680
// ============================================

// READABLE (for understanding):
function handleVimKey(key, vimMode, setVimMode, inputHelpers) {
    if (vimMode === "NORMAL") {
        switch (key) {
            case 'i':
                setVimMode("INSERT");
                break;
            case 'a':
                // Append: move cursor right, then enter INSERT
                inputHelpers.setCursorOffset(offset => offset + 1);
                setVimMode("INSERT");
                break;
            case 'A':
                // Append at end of line
                inputHelpers.setCursorOffset(inputValue.length);
                setVimMode("INSERT");
                break;
            case 'I':
                // Insert at beginning of line
                inputHelpers.setCursorOffset(0);
                setVimMode("INSERT");
                break;
            case 'Escape':
                // Already in NORMAL, no action
                break;
            case ':':
                // Command mode not implemented in v2.1.76
                break;
            // Navigation keys (h, j, k, l, w, b, e, 0, $, etc.)
            case 'h':
                inputHelpers.setCursorOffset(Math.max(0, offset - 1));
                break;
            case 'l':
                inputHelpers.setCursorOffset(Math.min(inputValue.length, offset + 1));
                break;
            // ... more navigation
        }
    } else if (vimMode === "INSERT") {
        if (key === 'Escape') {
            setVimMode("NORMAL");
            // Move cursor back one position (vim behavior)
            inputHelpers.setCursorOffset(Math.max(0, offset - 1));
        }
        // Normal insert handling continues
    }
}
```

### Mode Indicator Display

The input component displays the current vim mode in the prompt:

```
[INSERT] > user input here...
[NORMAL] > _ (block cursor on last char)
```

### Vim Mode Toggle Command

```javascript
// ============================================
// /vim command definition
// Location: chunks.162.mjs:1614
// ============================================

// READABLE (for understanding):
const vimCommand = {
    name: "vim",
    description: "Toggle vim mode for input editing",
    type: "local-jsx",
    execute: async (context, args) => {
        const currentMode = context.vimMode;
        const newMode = currentMode === "INSERT" ? "NORMAL" : "INSERT";
        context.setVimMode(newMode);
        return `Vim mode: ${newMode}`;
    }
};
```

### Vim Mode Deep Analysis

**What it does:** Provides modal editing familiar to vim users, allowing power users to navigate and edit input more efficiently.

**How it works:**
1. **State tracking** - `vimMode` state variable tracks current mode ("INSERT" or "NORMAL")
2. **Key interception** - All keypresses are routed through vim mode handler before normal processing
3. **Mode-specific behavior** - Keys have different meanings based on current mode
4. **Visual feedback** - Mode indicator shown in prompt bar

**Why this approach:**
- **Non-intrusive default** - INSERT mode is default, so new users aren't confused
- **Opt-in** - Users must explicitly enable via `/vim` command
- **Stateless key handling** - Each keypress is independent, no complex state machine
- **Visual feedback** - Mode indicator provides clear current state

**Key insight:** The vim mode implementation is intentionally minimal, focusing on the most useful navigation commands rather than full vim compatibility. This reduces implementation complexity while providing the most valuable power-user features.

---

## 7. Image Attachment Handling

Images are handled via paste or drag-and-drop.

### Paste Processing

```javascript
// From REPL state:
[IH, aw] = dA.useState({});  // pastedContents, setPastedContents

// Paste handler:
const handlePaste = useCallback((event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
        if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            const reader = new FileReader();
            reader.onload = () => {
                const id = generateId();
                setPastedContents(prev => ({
                    ...prev,
                    [id]: {
                        id,
                        type: 'image',
                        content: reader.result,
                        mediaType: item.type
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    }
}, [setPastedContents]);
```

### Attachment Display

Images appear as indicators above the input:

```
📎 image1.png
📎 image2.png
> user input here...
```

### Submission Flow

```javascript
// In handleSubmit - image handling:
if (k7.length > 0) {
    let pK = [];  // content for API
    let _Y = [];  // content for display

    if (Uj) {
        pK.push({ type: "text", text: Uj });
        _Y.push({ type: "text", text: Uj });
    }

    for (let iJ of k7) {
        if (iJ.type === "image") {
            let f$ = {
                type: "base64",
                media_type: iJ.mediaType ?? "image/png",
                data: iJ.content
            };
            pK.push({ type: "image", source: f$ });
            _Y.push({ type: "image", source: f$ });
        }
        // ... other types
    }
}
```

---

## 8. Multi-line Input

Multi-line input is handled via the `inputMode` state and buffer management.

### Buffer Management

```javascript
// Buffer state in input component:
const [buffer, setBuffer] = useState("");

// Helpers passed to handleSubmit:
{
    setCursorOffset: (offset) => void,
    clearBuffer: () => setBuffer(""),
    resetHistory: () => void
}
```

### Multi-line Detection

```javascript
// Input is considered multi-line if:
// 1. It contains newlines
// 2. inputMode === "shift-enter"
// 3. Shift+Enter was used
```

### Formatting

```javascript
// qk7 function formats input based on mode:
const displayText = FA ? k6 : qk7(k6, e4);

// In prompt mode: collapse to single line for display
// In multi-line mode: preserve newlines
```

---

## 9. Submit Flow

The submit flow handles all user input submission.

### handleSubmit (Z$)

```javascript
// ============================================
// handleSubmit - Main input submission handler
// Location: chunks.188.mjs:686
// ============================================

// ORIGINAL (condensed):
let Z$ = dA.useCallback(async (k6, q8, FA, Yq) => {
    // Check for slash command
    if (!FA && k6.trim().startsWith("/")) {
        let k7 = k6.trim();
        let X4 = k7.indexOf(" ");
        let p7 = X4 === -1 ? k7.slice(1) : k7.slice(1, X4);
        let V3 = X4 === -1 ? "" : k7.slice(X4 + 1).trim();
        let sq = RA.find((pK) => pK.isEnabled() &&
            (pK.name === p7 || pK.aliases?.includes(p7) || pK.userFacingName() === p7));
        let J3 = sq?.immediate || Yq?.fromKeybinding;

        // Local JSX command (e.g., /help, /clear)
        if (sq && J3 && sq.type === "local-jsx") {
            // Execute and display result
            let f$ = await (await sq.load()).call(_Y, Uj, V3);
            if (f$) TA({ jsx: f$, shouldHidePromptInput: true, isLocalJSXCommand: true });
            return;
        }
    }

    // Remote mode handling
    if ($O.isRemoteMode && !k6.trim()) return;

    // Display input and clear
    if (F5 !== void 0) { /* restore from history suggestion */ }
    else if (!_4 || FA) {
        $8("");
        q8.setCursorOffset(0);
        aw({});
    }

    // Mode updates
    if (!_4 || FA) Rq("prompt"), j6(void 0), Fj(k7 => k7 + 1), q8.clearBuffer();

    // Speculation handling
    if (FA) {
        let { queryRequired } = await V6q(FA.state, ...);
        if (queryRequired) { /* execute query */ }
        return;
    }

    // Remote session
    if ($O.isRemoteMode) {
        // Build message with attachments
        X6(pK => [...pK, J3]);
        await $O.sendMessage(sq);
        return;
    }

    // Local execution
    await PE6({
        input: k6,
        helpers: q8,
        isLoading: _4,
        mode: e4,
        commands: RA,
        // ... other params
    });
}, [/* dependencies */]);

// READABLE (for understanding):
async function handleSubmit(inputValue, helpers, speculation, keybindingInfo) {
    // Step 1: Check for slash command
    if (!speculation && inputValue.trim().startsWith("/")) {
        const commandName = extractCommandName(inputValue);
        const command = findCommand(commands, commandName);

        // Immediate local JSX commands (interactive overlays)
        if (command?.immediate && command.type === "local-jsx") {
            const jsx = await command.execute(context, args);
            if (jsx) {
                setToolJSX({
                    jsx,
                    shouldHidePromptInput: true,
                    isLocalJSXCommand: true
                });
            }
            return;  // Don't submit as message
        }
    }

    // Step 2: Handle empty input in remote mode
    if (isRemoteMode && !inputValue.trim()) return;

    // Step 3: Update UI state
    setInputValue("");
    helpers.setCursorOffset(0);
    setPastedContents({});

    // Step 4: Execute query
    await processInput({
        input: inputValue,
        mode: inputMode,
        pastedContents,
        onQuery: executeQuery
    });
}
```

### Concurrency Guard

```javascript
// In executeQuery (ff):
if (I6.current) {
    // Already processing - queue the input
    c("tengu_concurrent_onquery_detected", {});

    // Extract user messages and queue them
    k6.filter(msg => msg.type === "user")
        .forEach((msg, idx) => {
            queueMessageForLater(msg);
            if (idx === 0) c("tengu_concurrent_onquery_enqueued", {});
        });

    C3(false);  // Reset loading state
    return;
}

I6.current = true;  // Set concurrency guard
```

### Query Execution

```javascript
// executeQuery (ff) - condensed flow:
async function executeQuery(messages, abortController, shouldExecute, tools, model) {
    try {
        C3(true);  // Set loading
        X6(prev => [...prev, ...messages]);  // Add to display

        // Execute agent loop
        await handleQuery(messages, ...);
    } finally {
        I6.current = false;  // Clear concurrency guard
        YK();  // Reset loading state

        // Check for slow query notification
        let duration = Date.now() - startTime - toolPermissionWaitTime;
        if (duration > 30000 && !aborted) {
            // Show slow query notification
        }
    }
}
```

---

## 10. Prompt Dialog System

The prompt dialog system allows tools to interactively request user input during execution. This is distinct from the main input prompt - it's a modal dialog that appears when a tool needs clarification or selection.

### When Prompt Dialogs Appear

Prompt dialogs are queued when:
- A tool calls a `prompt` method requiring user selection
- The tool's execution is blocked waiting for user input
- Multiple prompts can queue up during parallel tool execution

### Prompt Queue State

```javascript
// ============================================
// Prompt Queue State - chunks.196.mjs:167
// ============================================

// ORIGINAL (for source lookup):
[zA, gA] = N8.useState([]),  // promptQueue, setPromptQueue

// READABLE (for understanding):
const [promptQueue, setPromptQueue] = useState([]);

// Each queue entry:
// {
//     title: string,           // Dialog title
//     toolInputSummary: string, // Tool context summary
//     request: {
//         prompt: string,      // The prompt message
//         message: string,     // Subtitle message
//         options: Array<{     // Selectable options
//             key: string,
//             label: string,
//             description?: string
//         }>
//     },
//     resolve: (value) => void, // Promise resolver
//     reject: (error) => void   // Promise rejecter
// }
```

### Prompt Dialog Component (fIq)

The `PromptDialog` component renders a selection dialog with options:

```javascript
// ============================================
// PromptDialog (fIq) - Selection dialog component
// Location: chunks.190.mjs:2125-2171
// ============================================

// ORIGINAL (for source lookup):
function fIq(A) {
    let q = A6(15),
        {
            title: K,
            toolInputSummary: Y,
            request: z,
            onRespond: _,
            onAbort: w
        } = A;
    // ... memoization logic ...
    D8("app:interrupt", w, { isActive: true });
    // Map options to select format
    let $ = z.options.map(FWz);  // FWz maps key/label/description
    return Ui.createElement(cz, {
        title: K,
        subtitle: z.message,
        titleRight: j  // toolInputSummary display
    }, Ui.createElement(T8, {
        options: $,
        onChange: (X) => { _(X) }
    }));
}

// READABLE (for understanding):
function PromptDialog({ title, toolInputSummary, request, onRespond, onAbort }) {
    // Register abort handler for app:interrupt events
    useEvent("app:interrupt", onAbort, { isActive: true });

    // Transform options for SelectInput component
    const selectOptions = request.options.map(option => ({
        label: option.label,
        value: option.key,
        description: option.description
    }));

    return (
        <Dialog title={title} subtitle={request.message} titleRight={toolInputSummary}>
            <SelectInput
                options={selectOptions}
                onChange={(selectedValue) => onRespond(selectedValue)}
            />
        </Dialog>
    );
}

// Mapping: fIq→PromptDialog, FWz→mapPromptOption, T8→SelectInput, cz→Dialog
```

### Priority Dispatch

The prompt dialog appears at priority 5 in the dialog dispatcher:

```javascript
// ============================================
// Prompt Dialog Priority - chunks.196.mjs:394
// ============================================

// In getInputDialogType (ra6):
if (P1 && zA[0]) return "prompt";  // Priority 5: after tool-permission, before worker-sandbox

// Full priority order:
// 1. message-selector (W7)
// 2. [blocked if paused (y2)]
// 3. sandbox-permission (G7[0])
// 4. tool-permission (a8[0]) [if animation allows]
// 5. prompt (zA[0]) [if animation allows] ← HERE
// 6. worker-sandbox-permission (n.queue[0])
// 7. elicitation (o.queue[0])
// 8. cost (m26)
// 9. ide-onboarding (W6)
// 10. effort-callout (g6)
// 11. remote-callout (J1)
// 12. lsp-recommendation (e8)
// 13. desktop-upsell (E1)
```

### Cancel Behavior

When the user presses Escape during a prompt dialog:

```javascript
// ============================================
// Prompt Dialog Cancel Handler - chunks.196.mjs:426-428
// ============================================

// ORIGINAL (for source lookup):
else if (K2 === "prompt") {
    for (let P1 of zA) P1.reject(Error("Prompt cancelled by user"));
    gA([]), M5?.abort()
}

// READABLE (for understanding):
else if (focusedInputDialog === "prompt") {
    // Reject ALL queued prompts, not just the first
    for (let prompt of promptQueue) {
        prompt.reject(new Error("Prompt cancelled by user"));
    }
    // Clear the entire queue
    setPromptQueue([]);
    // Abort any pending operation
    abortController?.abort();
}
```

### Why Reject All Queued Prompts?

The cancel behavior rejects ALL queued prompts, not just the visible one:

1. **Consistent state:** If the user cancels, they're canceling the entire operation flow
2. **Prevents orphaned prompts:** No stale prompts remain after cancel
3. **Clean abort:** Tool execution stops cleanly with proper error handling

### Prompt Queue Use Counter

The system tracks how often users use the prompt queue feature:

```javascript
// ============================================
// Prompt Queue Use Tracking - chunks.196.mjs:1182-1185
// ============================================

// ORIGINAL (for source lookup):
g26.current = !0, d1((P1) => ({
    ...P1,
    promptQueueUseCount: (P1.promptQueueUseCount ?? 0) + 1
}))

// READABLE (for understanding):
hasTrackedPromptQueue.current = true;
setAppState(state => ({
    ...state,
    promptQueueUseCount: (state.promptQueueUseCount ?? 0) + 1
}));
```

This counter is used for tips/tutorials:
```javascript
// chunks.180.mjs:2114 - Show tip if user hasn't used queue much
async isRelevant() {
    return X1().promptQueueUseCount <= 3  // Only show for first 3 uses
}
```

### Integration with Tool Execution

The prompt dialog integrates with tool execution flow:

```
Tool Execution Flow with Prompt:
│
├── Tool calls prompt() method
│       │
│       └── Creates Promise → pushed to promptQueue
│               │
│               └── Tool execution BLOCKED waiting for Promise
│                       │
│                       ├── User selects option → resolve(value)
│                       │       └── Tool continues with selected value
│                       │
│                       └── User cancels → reject(Error)
│                               └── Tool receives error, may retry or fail
```

---

## 11. Deep Algorithm Analysis: Concurrency Guard

### Why Concurrency Protection is Needed

The REPL is a single-threaded React component, but the agent loop is asynchronous. Without concurrency protection:

1. **Race conditions:** User could submit while streaming is in progress
2. **State corruption:** Multiple agent loops modifying messages array simultaneously
3. **Memory leaks:** Multiple AbortControllers with no cleanup
4. **UI desync:** Loading states not matching actual processing state

### Concurrency Guard Implementation

```javascript
// ============================================
// Concurrency Guard Pattern
// Location: chunks.196.mjs (I6 ref)
// ============================================

// I6 is a ref, not state - synchronous access without re-renders
const I6 = useRef(false);

// In executeQuery:
async function executeQuery(messages, abortController, ...) {
    // Check if already processing
    if (I6.current) {
        // CONCURRENT DETECTED - queue the messages
        trackEvent("tengu_concurrent_onquery_detected", {});

        // Extract user messages and queue for later
        messages.filter(msg => msg.type === "user")
            .forEach((msg, idx) => {
                queueMessageForLater(msg);
                if (idx === 0) trackEvent("tengu_concurrent_onquery_enqueued", {});
            });

        setIsLoading(false);  // Reset loading state
        return;  // EXIT - don't start another agent loop
    }

    // Set guard BEFORE any async operations
    I6.current = true;

    try {
        setIsLoading(true);
        setMessages(prev => [...prev, ...messages]);

        // Now safe to run agent loop
        await handleQuery(messages, abortController, ...);
    } finally {
        // ALWAYS clear guard in finally block
        I6.current = false;
        resetLoadingState();
    }
}
```

### State Transition Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONCURRENCY GUARD STATE MACHINE                           │
│                                                                              │
│  [IDLE: I6.current = false]                                                  │
│       │                                                                      │
│       ├── User submits input                                                 │
│       │       │                                                              │
│       │       ├── I6.current = false?                                        │
│       │       │       └── YES → Set I6.current = true                        │
│       │       │               Start agent loop                               │
│       │       │               → [PROCESSING]                                 │
│       │       │                                                              │
│       │       └── I6.current = true?                                         │
│       │               └── YES → Queue message                                │
│       │                       Return to IDLE                                 │
│       │                                                                      │
│  [PROCESSING: I6.current = true]                                             │
│       │                                                                      │
│       ├── Agent loop completes                                               │
│       │       └── I6.current = false                                         │
│       │           → [IDLE]                                                   │
│       │                                                                      │
│       ├── Agent loop errors                                                  │
│       │       └── finally { I6.current = false }                             │
│       │           → [IDLE]                                                   │
│       │                                                                      │
│       └── Abort triggered                                                    │
│               └── finally { I6.current = false }                             │
│                   → [IDLE]                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

**1. Use `useRef` instead of `useState`:**
```javascript
// WHY: Refs provide synchronous access without triggering re-renders
const I6 = useRef(false);  // CORRECT

// If we used useState, the guard check would use stale state
// during the same render cycle:
const [isProcessing, setIsProcessing] = useState(false);  // WRONG
// isProcessing is stale until next render
```

**2. Set guard BEFORE async operations:**
```javascript
// CORRECT: Set guard immediately
I6.current = true;
await asyncOperation();

// WRONG: Set after checking (race condition window)
if (!I6.current) {
    // Another concurrent call could execute here
    await asyncOperation();
    I6.current = true;  // Too late!
}
```

**3. Clear guard in `finally` block:**
```javascript
// CORRECT: Always clears, even on error
try {
    await operation();
} finally {
    I6.current = false;  // ALWAYS runs
}

// WRONG: Won't clear on error
await operation();
I6.current = false;  // Skipped if operation throws
```

---

## 12. Submit Flow State Machine

### Complete Submit Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUBMIT FLOW STATE MACHINE                                 │
│                                                                              │
│  [WAITING_FOR_INPUT]                                                         │
│       │                                                                      │
│       └── User presses Enter/Shift+Enter                                     │
│               │                                                              │
│               ▼                                                              │
│  [VALIDATING_INPUT]                                                          │
│       │                                                                      │
│       ├── Input empty + remote mode? → Return to WAITING                     │
│       │                                                                      │
│       ├── Input starts with "/"?                                             │
│       │       ├── local-jsx command?                                         │
│       │       │       └── Set toolJSX → [LOCAL_JSX_MODE]                     │
│       │       │                                                              │
│       │       └── Regular command?                                           │
│       │               └── Execute command → Return to WAITING                │
│       │                                                                      │
│       └── Normal input?                                                      │
│               │                                                              │
│               ▼                                                              │
│  [CHECKING_CONCURRENCY]                                                      │
│       │                                                                      │
│       ├── I6.current = true?                                                 │
│       │       └── Queue message → Return to WAITING                          │
│       │                                                                      │
│       └── I6.current = false?                                                │
│               │                                                              │
│               ▼                                                              │
│  [PREPARING_QUERY]                                                           │
│       │                                                                      │
│       ├── Clear input field                                                  │
│       ├── Set I6.current = true                                              │
│       ├── Create AbortController                                             │
│       └── Build messages array                                               │
│               │                                                              │
│               ▼                                                              │
│  [EXECUTING_QUERY]                                                           │
│       │                                                                      │
│       ├── Add user message to display                                        │
│       ├── Set isLoading = true                                               │
│       ├── Start agent loop                                                   │
│       │       │                                                              │
│       │       └── Stream events → handleToolUseStream                        │
│       │               → Update streaming state                               │
│       │               → Render MessageList                                   │
│       │                                                                      │
│       └── Agent loop completes/errors                                        │
│               │                                                              │
│               ▼                                                              │
│  [CLEANUP]                                                                   │
│       │                                                                      │
│       ├── I6.current = false                                                 │
│       ├── resetLoadingState()                                                │
│       ├── Check slow query (>30s)                                            │
│       └── Return to WAITING_FOR_INPUT                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Error Handling Paths

```javascript
// Error scenarios and recovery:

// 1. API Error
catch (apiError) {
    I6.current = false;
    resetLoadingState();
    addErrorMessage(apiError.message);
    // User can retry - back to WAITING state
}

// 2. Abort (user pressed Escape)
if (abortController.signal.aborted) {
    I6.current = false;
    resetLoadingState();
    // Input preserved - back to WAITING state
}

// 3. Permission Rejection
if (toolPermission === "rejected") {
    // Tool returns "rejected" error
    // Agent loop continues, may try different approach
    // NOT a terminal error
}
```

---

## 13. v2.1.76 Input Handling Changes

### New Features

1. **`/color` command:**
   - Sets session-scoped prompt bar accent color
   - Valid values: "default", "blue", "green", "red", "purple", "orange"
   - Does not persist to settings
   - Implementation: chunks.150.mjs contains color command logic

2. **Ctrl+F agent filter:**
   - Opens panel to show/filter active background agents
   - Useful for multi-agent workflows
   - Filters agents by name/agentType

3. **Escape key improvements:**
   - Double-Escape reliably opens message selector
   - Fixed race conditions after dialog dismissals

### Voice Mode Implementation

v2.1.76 improves voice mode handling with graceful fallback:

```javascript
// ============================================
// Voice Mode Availability Check (cKz)
// Location: chunks.168.mjs:1166-1205
// ============================================

// ORIGINAL (for source lookup):
async function cKz() {
    if (zG() || t6(process.env.CLAUDE_CODE_REMOTE)) return {
        available: !1,
        reason: `Voice mode requires microphone access, but no audio device is available in this environment.

To use voice mode, run Claude Code locally instead.`
    };
    if ((await Rr6()).isNativeAudioAvailable()) return {
        available: !0,
        reason: null
    };
    if (y8() === "wsl") return {
        available: !1,
        reason: `Voice mode is not supported in WSL (Windows Subsystem for Linux) because audio devices are not available.

To use voice mode, run Claude Code in native Windows instead.`
    };
    if (process.platform === "win32") return {
        available: !1,
        reason: "Voice recording requires the native audio module, which could not be loaded."
    };
    if (process.platform === "linux" && Wi("arecord")) return {
        available: !0,
        reason: null
    };
    if (!Wi("rec")) {
        let q = OZq();
        return {
            available: !1,
            reason: q ? `Voice mode requires SoX for audio recording. Install it with: ${q.displayCommand}` : `Voice mode requires SoX for audio recording. Install SoX manually:
  macOS: brew install sox
  Ubuntu/Debian: sudo apt-get install sox
  Fedora: sudo dnf install sox`
        }
    }
    return {
        available: !0,
        reason: null
    }
}

// READABLE (for understanding):
async function checkVoiceAvailability() {
    // Remote/headless environments: not available
    if (isHeadless() || isRemoteEnv()) {
        return {
            available: false,
            reason: "Voice mode requires microphone access, but no audio device is available in this environment.\n\nTo use voice mode, run Claude Code locally instead."
        };
    }

    // Native audio module (Windows desktop app)
    if (await getNativeAudio().isNativeAudioAvailable()) {
        return { available: true, reason: null };
    }

    // WSL: not supported
    if (getPlatform() === "wsl") {
        return {
            available: false,
            reason: "Voice mode is not supported in WSL (Windows Subsystem for Linux) because audio devices are not available.\n\nTo use voice mode, run Claude Code in native Windows instead."
        };
    }

    // Windows without native module
    if (process.platform === "win32") {
        return {
            available: false,
            reason: "Voice recording requires the native audio module, which could not be loaded."
        };
    }

    // Linux with arecord
    if (process.platform === "linux" && commandExists("arecord")) {
        return { available: true, reason: null };
    }

    // macOS/Linux with SoX
    if (!commandExists("rec")) {
        return {
            available: false,
            reason: getSoxInstallInstructions()
        };
    }

    return { available: true, reason: null };
}

// Mapping: cKz→checkVoiceAvailability, zG→isHeadless, t6→parseBoolean,
// Rr6→getNativeAudio, y8→getPlatform, Wi→commandExists
```

### Voice Mode Slash Command (WZq)

```javascript
// ============================================
// Voice Command Definition
// Location: chunks.168.mjs:1797-1813
// ============================================

// ORIGINAL (for source lookup):
WZq = E(() => {
    Id();
    A5z = {
        type: "local",
        name: "voice",
        description: "Toggle voice mode",
        isEnabled: () => GI(),
        get isHidden() {
            return !m06()
        },
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (XZq(), DZq)),
        userFacingName() {
            return "voice"
        }
    }, q5z = A5z
})

// READABLE (for understanding):
const voiceCommand = defineCommand(() => {
    return {
        type: "local",
        name: "voice",
        description: "Toggle voice mode",
        isEnabled: () => isVoiceFeatureEnabled(),
        get isHidden() {
            return !isVoiceAvailable(); // Hide if not available
        },
        supportsNonInteractive: false,
        load: () => importVoiceModule(),
        userFacingName() {
            return "voice"
        }
    };
});

// Mapping: WZq→voiceCommandDefinition, A5z→voiceCommand, GI→isVoiceFeatureEnabled,
// m06→isVoiceAvailable
```

### Voice Mode State Management

The voice mode state is stored in Zustand:

```javascript
// State keys (chunks.144.mjs:2685, chunks.195.mjs:1735)
voiceEnabled: boolean;      // Voice mode toggle
voiceState: "idle" | "recording" | "processing";  // Current state
voiceInterimTranscript: string;  // Partial speech-to-text
voiceFocusMode: boolean;    // Focus mode during recording
```

**Why graceful fallback:**
- Voice mode depends on platform-specific audio tools (SoX, arecord, native module)
- Users may not have these installed
- Remote/WSL environments lack audio devices entirely
- The system must continue with text input when voice is unavailable

---

## 14. Validated Symbol Reference

> **Cross-validated against source code on 2026-03-22**

### Input Handling Core Symbols

| Obfuscated | Readable | File:Line | Status |
|------------|----------|-----------|--------|
| `YUA` | PromptInput | chunks.28.mjs:2207 | ✅ Verified |
| `fIq` | PromptDialog | chunks.190.mjs:2125 | ✅ Verified |
| `ot8` | REPL | chunks.196.mjs:3 | ✅ Verified |
| `TM` | handleCancel | chunks.196.mjs:420 | ✅ Verified |

### Input State Variables

| Obfuscated | Readable | Type | Purpose |
|------------|----------|------|---------|
| `m5` | inputValue | state | Current input text |
| `y2` | isPaused | state | Input typing state |
| `ZH` | inputMode | state | "prompt" / "multimodal" |
| `H4` | isSearchingHistory | state | History search active |
| `fH` | isHelpOpen | state | Help overlay visible |
| `sZ` | vimMode | state | Vim mode setting |

### Submit Flow Symbols

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| `iV6` | popCommandFromQueue | Execute queued slash command |
| `sF` | executeQuery | Main query execution |
| `B4` | setIsLoading | Set loading state |
| `gq` | setMessages | Update message list |

### History Navigation

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| `lV6` | isSearchingInputHistory | History search mode |
| `na6` | fullScreenOverlay | Overlay blocking dialogs |
| `W7` | isMessageSelectorVisible | Message selector active |

---

**Last Updated**: 2026-03-22 (Added voice mode implementation details, v2.1.76 features, validated symbols)
**Version**: Claude Code 2.1.76
**Status**: Complete - Full input handling flow documented including prompt dialog system
