# Input Handling System

> Related Symbols:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI, Keybindings

Key functions in this document:
- `PromptInput` (YUA) - Main input component with autocomplete and history, chunks.188.mjs
- `handleSubmit` (Z$) - User input handler and slash command router, chunks.188.mjs:686
- `executeQuery` (ff) - Query dispatch with concurrency guard, chunks.188.mjs:589
- `handleQuery` (oc) - Agent loop orchestration, chunks.188.mjs:550
- `PE6` - Process input and dispatch to appropriate handler, chunks
- `V_6` - Get previous queued message for rejection restore, chunks
- `cJ` - Vim mode state (INSERT/NORMAL), chunks.188.mjs

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

---

## 1. Architecture Overview

The input handling system manages all user text input to Claude Code, providing:

```
┌──────────────────────────────────────────────────────────────────────┐
│                      INPUT HANDLING SYSTEM                            │
│                                                                       │
│  User keystrokes → PromptInput (YUA)                                 │
│                          │                                           │
│                          ├── Autocomplete overlay                    │
│                          ├── History navigation (↑/↓)                │
│                          ├── Vim mode state (cJ)                     │
│                          └── Image paste handling                    │
│                                                                       │
│  Submit (Enter) → handleSubmit (Z$)                                  │
│                          │                                           │
│                          ├── Slash command? → PE6                    │
│                          │       ├── local-jsx → setToolJSX          │
│                          │       └── regular → executeCommand        │
│                          │                                           │
│                          └── Regular input → executeQuery (ff)       │
│                                  ├── Concurrency guard (I6.current)  │
│                                  └── handleQuery (oc) → Agent loop   │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**

1. **Single entry point**: All user input flows through `handleSubmit`
2. **Concurrency guard**: Prevents multiple simultaneous queries via `I6.current`
3. **Queue on concurrent**: If user submits while loading, input is queued
4. **Vim mode opt-in**: Disabled by default, enabled via settings

**v2.1.76 changes:**
- Voice mode improvements: microphone access now gracefully falls back when permissions are denied
- Escape key fixes: double-Escape reliably opens message selector even after certain dialog states
- `/color` command: sets the prompt-bar accent color for the current session
- Ctrl+F: opens agent filter panel to show/filter active background agents

---

## 2. PromptInput Component (YUA)

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

Vim mode provides modal editing for power users.

### Mode States

```javascript
// From REPL state:
[cJ, lJ] = dA.useState("INSERT");  // vimMode, setVimMode

// Values: "INSERT" | "NORMAL"
```

### Mode Behaviors

| Mode | Key Behaviors |
|------|---------------|
| INSERT | Normal typing, Enter submits |
| NORMAL | Navigation keys, `i` enters INSERT, `:` for commands |

### Mode Switching

```javascript
// In key handler:
if (vimMode === "NORMAL") {
    switch (key) {
        case 'i':
            setVimMode("INSERT");
            break;
        case 'Escape':
            // Already in NORMAL, no action
            break;
        case ':':
            // Command mode (if implemented)
            break;
        // Navigation keys...
    }
} else if (vimMode === "INSERT") {
    if (key === 'Escape') {
        setVimMode("NORMAL");
    }
    // Normal insert handling...
}
```

### Mode Indicator

The input component displays the current vim mode:

```
[INSERT] > user input here...
[NORMAL] > _ (cursor on last char)
```

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
