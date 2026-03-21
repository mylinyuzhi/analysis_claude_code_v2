# UI Linkage - Rewind / Checkpointing (Module 35)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Rewind module section
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI rendering

Key UI components in this document:
- `RewindMessageSelector` (zs8) - Main React component — message list + restore options
- `generateRestoreOptions` (g) - Build option list based on checkpoint availability
- `handleMessageSelection` (b) - Process message selection and show options
- `handleRestoreOptionSelected` (p) - Dispatch restore/summarize callbacks

---

## 1. Entry Points

The rewind UI can be triggered in two ways:

### 1a. Keyboard: Esc + Esc (Double Escape)

Pressing `Esc` twice opens the message selector. This is handled at the app-level keyboard context:
- First `Esc` sends the `"confirm:no"` action (cancel in-progress operations)
- Second `Esc` (when no other modal is open) triggers `openMessageSelector()`

### 1b. Slash Command: `/rewind` (alias: `/checkpoint`)

```javascript
// ============================================
// Rewind slash command definition
// Location: chunks.165.mjs:701-710
// ============================================

// ORIGINAL (for source lookup):
_Az = {
    description: "Restore the code and/or conversation to a previous point",
    name: "rewind",
    aliases: ["checkpoint"],
    userFacingName: () => "rewind",
    argumentHint: "",
    isEnabled: () => !0,
    type: "local",
    isHidden: !1,
    supportsNonInteractive: !1,
    load: () => Promise.resolve().then(() => pXq)
}

// READABLE (for understanding):
{
    description: "Restore the code and/or conversation to a previous point",
    name: "rewind",
    aliases: ["checkpoint"],
    userFacingName: () => "rewind",
    argumentHint: "",              // No arguments
    isEnabled: () => true,         // Always available
    type: "local",                 // Local command, not remote
    isHidden: false,
    supportsNonInteractive: false, // Requires interactive terminal
    load: () => Promise.resolve().then(() => commandModule)  // Lazy load
}
```

The `openMessageSelector` callback is injected into the slash command context from the main app component.

### 1c. Slash Command Handler: `rewindCommandHandler` (zAz)

**Location:** chunks.165.mjs:687-691

```javascript
// ============================================
// rewindCommandHandler - Execute /rewind slash command
// Location: chunks.165.mjs:687-691
// ============================================

// ORIGINAL (for source lookup):
async function zAz(A, q) {
    if (q.openMessageSelector) q.openMessageSelector();
    return {
        type: "skip"
    }
}

// READABLE (for understanding):
async function rewindCommandHandler(args, context) {
    // Open the message selector UI if available
    if (context.openMessageSelector) {
        context.openMessageSelector();
    }
    // Return "skip" to indicate no message should be sent to LLM
    return {
        type: "skip"
    };
}

// Mapping: zAz→rewindCommandHandler, A→args, q→context
```

**What it does:** Handles the `/rewind` (or `/checkpoint`) slash command by opening the message selector UI.

**How it works:**
1. Checks if `openMessageSelector` callback is available in context
2. Calls `openMessageSelector()` to show the rewind UI
3. Returns `{ type: "skip" }` to indicate no LLM message should be sent

**Why "skip" return type:** The rewind UI is an interactive overlay that doesn't require an LLM response. The "skip" type tells the command processor to not create a user message.

**Module structure:**
```javascript
// Location: chunks.165.mjs:685
pXq = {}  // rewindCommandModule - lazy-loaded container

// The command definition (_Az) references this module:
load: () => Promise.resolve().then(() => pXq)
```

---

## 2. Keyboard Bindings

### Message Selector Keybindings

**Location:** chunks.89.mjs:2747-2764

```javascript
// ============================================
// Message Selector keyboard bindings
// Location: chunks.89.mjs:2747-2764
// ============================================

{
    context: "MessageSelector",
    bindings: {
        up: "messageSelector:up",
        down: "messageSelector:down",
        k: "messageSelector:up",
        j: "messageSelector:down",
        "ctrl+p": "messageSelector:up",
        "ctrl+n": "messageSelector:down",
        "ctrl+up": "messageSelector:top",
        "shift+up": "messageSelector:top",
        "meta+up": "messageSelector:top",
        "shift+k": "messageSelector:top",
        "ctrl+down": "messageSelector:bottom",
        "shift+down": "messageSelector:bottom",
        "meta+down": "messageSelector:bottom",
        "shift+j": "messageSelector:bottom",
        enter: "messageSelector:select"
    }
}
```

### Keybinding Actions

| Action | Keys | Behavior |
|--------|------|----------|
| `messageSelector:up` | `↑`, `k`, `Ctrl+p` | Move selection up one message |
| `messageSelector:down` | `↓`, `j`, `Ctrl+n` | Move selection down one message |
| `messageSelector:top` | `Ctrl+↑`, `Shift+↑`, `⌘+↑`, `Shift+k` | Jump to first message |
| `messageSelector:bottom` | `Ctrl+↓`, `Shift+↓`, `⌘+↓`, `Shift+j` | Jump to last message |
| `messageSelector:select` | `Enter` | Select highlighted message |

### Cancel Actions

| Action | Keys | Behavior |
|--------|------|----------|
| `confirm:no` | `Esc` | Cancel/close message selector |
| - | `Ctrl+c` | Same as Esc (via terminal) |

**Why multiple keybindings:**
- Vim-style (`j`/`k`) for power users
- Arrow keys for intuitive navigation
- Ctrl variants for users who prefer them
- Shift/Ctrl+arrow for jump-to-edge (common in editors)

---

## 2. Main UI Component: `RewindMessageSelector` (zs8)

**File**: chunks.185.mjs:1179
**Type**: React functional component
**Rendering**: Ink/React terminal UI

```javascript
// ============================================
// RewindMessageSelector - Main component
// Location: chunks.185.mjs:1179-1350
// ============================================

// ORIGINAL (for source lookup):
function zs8({
    messages: A,
    onPreRestore: q,
    onRestoreMessage: K,
    onRestoreCode: Y,
    onSummarize: z,
    onClose: _
}) {
    let w = M1((z6) => z6.fileHistory),
        [O, $] = XH.useState(void 0),
        H = iz(),
        j = XH.useMemo(AXz, []),
        J = XH.useMemo(() => [...A.filter(XV6), {
            ...p1({
                content: ""
            }),
            uuid: j
        }], [A, j]),
        [M, D] = XH.useState(J.length - 1),
        X = Math.max(0, Math.min(M - Math.floor(Ys8 / 2), J.length - Ys8)),
        P = J.length > 1,
        [W, Z] = XH.useState(void 0),
        [G, f] = XH.useState(void 0),
        [v, N] = XH.useState(!1),
        [V, L] = XH.useState(null),
        [h, R] = XH.useState("both"),
        [u, I] = XH.useState("");
    // ... component body
}

// READABLE (for understanding):
function RewindMessageSelector({
    messages,
    onPreRestore,
    onRestoreMessage,
    onRestoreCode,
    onSummarize,
    onClose
}) {
    // File history state from React store
    let fileHistory = useStore((state) => state.fileHistory);

    // Error message state
    let [errorMessage, setErrorMessage] = useState(undefined);

    // Checkpointing enabled?
    let isCheckpointingEnabled = isFileCheckpointingEnabled();

    // Generate UUID for "current" virtual message
    let currentUuid = useMemo(generateUuid, []);

    // Filter to selectable messages + add virtual "current" entry
    let filteredMessages = useMemo(() => [
        ...messages.filter(isSelectableMessage),
        { ...createEmptyMessage({ content: "" }), uuid: currentUuid }
    ], [messages, currentUuid]);

    // Current highlight index
    let [currentIndex, setCurrentIndex] = useState(filteredMessages.length - 1);

    // Scroll window offset (7 items visible)
    let scrollOffset = Math.max(0, Math.min(
        currentIndex - Math.floor(VISIBLE_COUNT / 2),
        filteredMessages.length - VISIBLE_COUNT
    ));

    // Has multiple messages to select?
    let hasMultipleMessages = filteredMessages.length > 1;

    // Selected message (after Enter pressed)
    let [selectedMessage, setSelectedMessage] = useState(undefined);

    // Diff stats for selected message
    let [diffStats, setDiffStats] = useState(undefined);

    // Loading state
    let [isLoading, setIsLoading] = useState(false);

    // Which action is loading
    let [loadingAction, setLoadingAction] = useState(null);

    // Restore mode selection
    let [restoreMode, setRestoreMode] = useState("both");

    // Summarize context input
    let [summarizeContext, setSummarizeContext] = useState("");

    // ... component body continues
}

// Mapping: zs8→RewindMessageSelector, A→messages, q→onPreRestore, K→onRestoreMessage,
//          Y→onRestoreCode, z→onSummarize, _→onClose, w→fileHistory, O→errorMessage,
//          H→isCheckpointingEnabled, j→currentUuid, J→filteredMessages, M→currentIndex,
//          W→selectedMessage, G→diffStats, v→isLoading, V→loadingAction, h→restoreMode,
//          u→summarizeContext, iz→isFileCheckpointingEnabled, M1→useStore, XV6→isSelectableMessage
```

### Component Props

| Prop | Type | Purpose |
|------|------|---------|
| `messages` | Message[] | All messages in conversation |
| `onPreRestore` | () => void | Called before restore starts (cancels LLM stream) |
| `onRestoreMessage` | (msg) => Promise | Slice messages and restore state |
| `onRestoreCode` | (msg) => Promise | Restore files via rewindHandler |
| `onSummarize` | (msg, ctx?) => Promise | Run targeted summarization |
| `onClose` | () => void | Close the selector modal |

### Component State

| State Variable | Readable Name | Initial | Purpose |
|---------------|---------------|---------|---------|
| `O, $` | `errorMessage, setErrorMessage` | `undefined` | Error to show in UI |
| `M, D` | `currentIndex, setCurrentIndex` | `length - 1` | Highlighted row |
| `W, Z` | `selectedMessage, setSelectedMessage` | `undefined` | Confirmed selection |
| `G, f` | `diffStats, setDiffStats` | `undefined` | Diff preview data |
| `v, N` | `isLoading, setIsLoading` | `false` | Loading spinner |
| `V, L` | `loadingAction, setLoadingAction` | `null` | Which action loading |
| `h, R` | `restoreMode, setRestoreMode` | `"both"` | Selected restore option |
| `u, I` | `summarizeContext, setSummarizeContext` | `""` | User-typed context |

### Scroll Window: `Ys8 = 7` Items Per Page

The visible portion of the message list is a sliding window of 7 items:

```
scrollOffset = max(0, min(currentIndex - floor(7/2), totalMessages - 7))
```

This keeps the highlighted item centered in the window as the user scrolls.

---

## 3. Restore Options Generation — `generateRestoreOptions` (g)

**Location:** chunks.185.mjs:1207-1235

```javascript
// ============================================
// generateRestoreOptions - Build restore action list
// Location: chunks.185.mjs:1207-1235
// ============================================

// ORIGINAL (for source lookup):
function g(J1) {
    let N6 = J1 ? [
        { value: "both", label: "Restore code and conversation" },
        { value: "conversation", label: "Restore conversation" },
        { value: "code", label: "Restore code" }
    ] : [
        { value: "conversation", label: "Restore conversation" }
    ];
    N6.push({
        value: "summarize",
        label: "Summarize from here",
        type: "input",
        placeholder: "add context (optional)",
        initialValue: "",
        onChange: I,
        allowEmptySubmitToCancel: !0,
        showLabelWithValue: !0,
        labelValueSeparator: ": "
    });
    N6.push({ value: "nevermind", label: "Never mind" });
    return N6;
}

// READABLE (for understanding):
function generateRestoreOptions(hasCodeChanges) {
    let options = hasCodeChanges
        ? [
            { value: "both",         label: "Restore code and conversation" },
            { value: "conversation", label: "Restore conversation" },
            { value: "code",         label: "Restore code" }
        ]
        : [
            { value: "conversation", label: "Restore conversation" }
        ];

    // Summarize option with inline input
    options.push({
        value: "summarize",
        label: "Summarize from here",
        type: "input",
        placeholder: "add context (optional)",
        initialValue: "",
        onChange: setSummarizeContext,
        allowEmptySubmitToCancel: true,
        showLabelWithValue: true,
        labelValueSeparator: ": "
    });

    // Cancel option
    options.push({ value: "nevermind", label: "Never mind" });

    return options;
}

// Mapping: g→generateRestoreOptions, J1→hasCodeChanges, N6→options, I→setSummarizeContext
```

**Dynamic options based on file history:**
- `hasCodeChanges` = checkpointing is enabled AND this message has a snapshot with file changes
- If `hasCodeChanges = false`, "Restore code" options are hidden — only conversation restore is offered

**Summarize option with inline input:**
The "Summarize from here" option has `type: "input"` which renders an interactive text box. The user can type optional context to guide the summary.

---

## 4. Message Selection Handler — `handleMessageSelection` (b)

**Location:** chunks.185.mjs:1248-1268

```javascript
// ============================================
// handleMessageSelection - Process message selection
// Location: chunks.185.mjs:1248-1268
// ============================================

// ORIGINAL (for source lookup):
async function b(z6) {
    let N6 = A.indexOf(z6),
        $6 = A.length - 1 - N6;
    if (d("tengu_message_selector_selected", {
            index_from_end: $6,
            message_type: z6.type,
            is_current_prompt: !1
        }), !A.includes(z6)) {
        _();
        return
    }
    if (!H) {
        await B(z6);
        return
    }
    let n = eN1(w, z6.uuid),
        o = !n?.filesChanged || n.filesChanged.length === 0,
        a = YI1(A, N6);
    if (o && a) await B(z6);
    else Z(z6), f(n)
}

// READABLE (for understanding):
async function handleMessageSelection(message) {
    let messageIndex = messages.indexOf(message);
    let indexFromEnd = messages.length - 1 - messageIndex;

    telemetry("tengu_message_selector_selected", {
        index_from_end: indexFromEnd,
        message_type: message.type,
        is_current_prompt: false
    });

    // Message no longer exists?
    if (!messages.includes(message)) {
        onClose();
        return;
    }

    // Checkpointing disabled? Just restore conversation
    if (!isCheckpointingEnabled) {
        await handleRestoreMessage(message);
        return;
    }

    // Get diff stats via dry-run
    let diffResult = getDryRunDiffStats(fileHistory, message.uuid);

    // No file changes and only one message to remove?
    let noFileChanges = !diffResult?.filesChanged || diffResult.filesChanged.length === 0;
    let isSingleMessage = isOnlyOneMessageAfterIndex(messages, messageIndex);

    // Fast path: no file changes, just conversation restore
    if (noFileChanges && isSingleMessage) {
        await handleRestoreMessage(message);
    } else {
        // Show option menu
        setSelectedMessage(message);
        setDiffStats(diffResult);
    }
}

// Mapping: b→handleMessageSelection, z6→message, A→messages, N6→messageIndex,
//          $6→indexFromEnd, H→isCheckpointingEnabled, w→fileHistory,
//          n→diffResult, o→noFileChanges, a→isSingleMessage,
//          eN1→getDryRunDiffStats, YI1→isOnlyOneMessageAfterIndex,
//          B→handleRestoreMessage, Z→setSelectedMessage, f→setDiffStats
```

**Decision logic:**
1. If checkpointing is disabled → go straight to conversation restore
2. Run dry-run diff to check if any files changed
3. If no changes AND only one message to remove → fast path, skip option menu
4. Otherwise → show option menu with diff stats

---

## 5. Restore Option Handler — `handleRestoreOptionSelected` (p)

**Location:** chunks.185.mjs:1269-1320

```javascript
// ============================================
// handleRestoreOptionSelected - Dispatch restore/summarize
// Location: chunks.185.mjs:1269-1320
// ============================================

// ORIGINAL (for source lookup):
async function p(z6) {
    if (d("tengu_message_selector_restore_option_selected", { option: z6 }), !W) {
        O("Message not found.");
        return
    }
    if (z6 === "nevermind") {
        Z(void 0);
        return
    }
    if (z6 === "summarize") {
        q(), N(!0), L("summarize"), O(void 0);
        try {
            let n = u.trim() || void 0;
            await z(W, n), N(!1), L(null), Z(void 0), _()
        } catch (n) {
            _6(n), N(!1), L(null), O(`Failed to summarize:\n${n}`)
        }
        return
    }
    q(), N(!0), O(void 0);
    let N6 = null, $6 = null;
    if (z6 === "code" || z6 === "both") try { await Y(W) } catch (n) { N6 = n, _6(N6) }
    if (z6 === "conversation" || z6 === "both") try { await K(W) } catch (n) { $6 = n, _6($6) }
    if (N(!1), Z(void 0), $6 && N6) O(`Failed to restore the conversation and code:\n${$6}\n${N6}`);
    else if ($6) O(`Failed to restore the conversation:\n${$6}`);
    else if (N6) O(`Failed to restore the code:\n${N6}`);
    else _()
}

// READABLE (for understanding):
async function handleRestoreOptionSelected(selectedOption) {
    telemetry("tengu_message_selector_restore_option_selected", { option: selectedOption });

    if (!selectedMessage) {
        setErrorMessage("Message not found.");
        return;
    }

    // Cancel: go back to message list
    if (selectedOption === "nevermind") {
        setSelectedMessage(undefined);
        return;
    }

    // Summarize: run targeted compaction
    if (selectedOption === "summarize") {
        onPreRestore();
        setIsLoading(true);
        setLoadingAction("summarize");
        setErrorMessage(undefined);

        try {
            let ctx = summarizeContext.trim() || undefined;
            await onSummarize(selectedMessage, ctx);
            setIsLoading(false);
            setLoadingAction(null);
            setSelectedMessage(undefined);
            onClose();
        } catch (e) {
            logError(e);
            setIsLoading(false);
            setLoadingAction(null);
            setErrorMessage(`Failed to summarize:\n${e}`);
        }
        return;
    }

    // Restore operations
    onPreRestore();
    setIsLoading(true);
    setErrorMessage(undefined);

    let codeError = null;
    let conversationError = null;

    // Code restore
    if (selectedOption === "code" || selectedOption === "both") {
        try { await onRestoreCode(selectedMessage); }
        catch (e) { codeError = e; logError(e); }
    }

    // Conversation restore
    if (selectedOption === "conversation" || selectedOption === "both") {
        try { await onRestoreMessage(selectedMessage); }
        catch (e) { conversationError = e; logError(e); }
    }

    setIsLoading(false);
    setSelectedMessage(undefined);

    // Error handling
    if (conversationError && codeError) {
        setErrorMessage(`Failed to restore the conversation and code:\n${conversationError}\n${codeError}`);
    } else if (conversationError) {
        setErrorMessage(`Failed to restore the conversation:\n${conversationError}`);
    } else if (codeError) {
        setErrorMessage(`Failed to restore the code:\n${codeError}`);
    } else {
        onClose();
    }
}

// Mapping: p→handleRestoreOptionSelected, z6→selectedOption, W→selectedMessage,
//          Z→setSelectedMessage, O→setErrorMessage, q→onPreRestore,
//          N→setIsLoading, L→setLoadingAction, u→summarizeContext,
//          z→onSummarize, Y→onRestoreCode, K→onRestoreMessage, _→onClose
```

### Dispatch Decision Tree

```
selectedOption
├── "nevermind"      → setSelectedMessage(undefined)  [back to list]
├── "summarize"      → onPreRestore()
│                       → setIsLoading(true, "summarize")
│                       → await onSummarize(msg, ctx)
│                       → onClose() on success
│                       → setErrorMessage() on error
├── "code"           → onPreRestore()
│                       → await onRestoreCode(msg)
│                       → onClose() or show error
├── "conversation"   → onPreRestore()
│                       → await onRestoreMessage(msg)
│                       → onClose() or show error
└── "both"           → onPreRestore()
                        → await onRestoreCode(msg)      [continue even if fails]
                        → await onRestoreMessage(msg)   [continue even if fails]
                        → show combined error if both fail
                        → onClose() if both succeed
```

**Error isolation for "both":** Code and conversation restore are called **sequentially with independent error capture**. If code restore fails, conversation restore still runs.

---

## 6. Message List Rendering

The scrollable message list renders each item with:
- A pointer indicator (`▶`) for the currently highlighted row
- A `MessagePreview` component showing the message text, truncated to fit
- A diff stats line showing file changes

```
  ▶ fix the authentication bug in login.ts                   [highlighted]
      auth.ts +12 -3

    add error handling for API timeouts
      api.ts +8 -0, config.ts +2 -1

    refactor the database connection pool
      db.ts +45 -22, pool.ts +18 -5
```

**Diff display logic:**
- If `filesChanged.length === 1`: show `basename(path) +ins -del`
- If `filesChanged.length > 1`: show `N files changed +ins -del`
- If no code changes: show "No code changes"
- If no checkpoint available for this message: show ⚠️ "No code restore"

---

## 7. Complete User Interaction Flow

```
State: User is in the middle of a conversation

1. User presses Esc+Esc (or types /rewind)
   ├── App calls openMessageSelector()
   └── RewindMessageSelector renders

2. Message list appears:
   - All user messages listed, newest at bottom
   - Virtual "current" entry at bottom (selected by default)
   - Diff stats loaded asynchronously per message

3. User navigates with ↑/↓ keys
   - Highlighted row changes (currentIndex updates)
   - Diff stats preview shown for highlighted message

4. User presses Enter to select a message
   - handleMessageSelection() called
   - If checkpointing off OR no changes: fast path to restore
   - Otherwise: show option menu

5. Option menu appears:
   ┌──────────────────────────────────────┐
   │  Restore code and conversation       │ ← if hasCodeChanges
   │  Restore conversation                │
   │  Restore code                        │ ← if hasCodeChanges
   │  Summarize from here: [           ]  │ ← with inline input
   │  Never mind                          │
   └──────────────────────────────────────┘

6a. "Restore code and conversation":
    - onRestoreCode → sN1 (rewindHandler) → Zn4 (rewindAndRestoreFiles)
    - onRestoreMessage → slice messages, restore todos/permissions
    - onClose() → selector unmounts

6b. "Restore conversation":
    - onRestoreMessage only (no file restore)
    - onClose()

6c. "Restore code":
    - onRestoreCode only (no conversation change)
    - onClose()

6d. "Summarize from here [user types context]":
    - onSummarize(msg, ctx) → Fa4 (summarizationEngineFunction)
    - Creates compact_boundary marker
    - onClose()

6e. "Never mind":
    - setSelectedMessage(undefined) → back to message list

7. Any Esc press (when at message list, not option menu):
    - onClose() → selector unmounts, return to normal input
```

---

## 8. System Reminder Integration

After summarize, a `compact_boundary` system message is created to mark where the conversation was compacted. This message contains:
- The original message count
- Token counts before/after
- A link to the session transcript file
- The user-provided context (if any)

See [07_compact/](../07_compact/) for details on the summarization pipeline.

---

## 9. Message Filtering Logic

### isSelectableMessage (XV6)

The message list only shows certain message types. The filtering is done by `XV6` (isSelectableMessage):

**Location:** chunks.185.mjs:1692-1702

```javascript
// ============================================
// isSelectableMessage - Filter for selectable messages
// Location: chunks.185.mjs:1692-1702
// ============================================

// ORIGINAL (for source lookup):
function XV6(A) {
    if (A.type !== "user") return !1;
    if (Array.isArray(A.message.content) && A.message.content[0]?.type === "tool_result") return !1;
    if (Hz6(A)) return !1;
    if (A.isMeta) return !1;
    let q = A.message.content,
        K = typeof q === "string" ? null : q[q.length - 1],
        Y = typeof q === "string" ? q.trim() : K && Yhq(K) ? K.text.trim() : "";
    if (Y.indexOf(`<${WP}>`) !== -1 || Y.indexOf(`<${oA6}>`) !== -1 || Y.indexOf(`<${rHA}>`) !== -1 || Y.indexOf(`<${oHA}>`) !== -1 || Y.indexOf(`<${EH}>`) !== -1 || Y.indexOf(`<${vV}>`) !== -1 || Y.indexOf(`<${fj}`) !== -1) return !1;
    return !0
}

// READABLE (for understanding):
function isSelectableMessage(message) {
    // Must be a user message
    if (message.type !== "user") return false;
    // Skip tool_result messages (not user prompts)
    if (Array.isArray(message.message.content) && message.message.content[0]?.type === "tool_result") return false;
    // Skip compact summary messages
    if (isCompactSummary(message)) return false;
    // Skip meta messages (system reminders)
    if (message.isMeta) return false;

    // Check for special XML tags that indicate internal messages
    let content = message.message.content;
    let lastBlock = typeof content === "string" ? null : content[content.length - 1];
    let textContent = typeof content === "string" ? content.trim() : lastBlock?.text?.trim() || "";

    // Skip messages containing special internal tags
    // Actual tag values from chunks.14.mjs:627-663:
    //   WP="local-command-stdout", oA6="local-command-stderr"
    //   rHA="bash-stdout", oHA="bash-stderr"
    //   EH="task-notification", vV="tick", fj="teammate-message"
    const internalTags = [
        "<local-command-stdout>",  // WP - internal command output
        "<local-command-stderr>",  // oA6 - internal command errors
        "<bash-stdout>",           // rHA - bash command output
        "<bash-stderr>",           // oHA - bash command errors
        "<task-notification>",     // EH - task system notifications
        "<tick>",                  // vV - tick/debug markers
        "<teammate-message>"       // fj - teammate agent messages
    ];
    for (let tag of internalTags) {
        if (textContent.indexOf(tag) !== -1) return false;
    }

    return true;
}

// Mapping: XV6→isSelectableMessage, A→message, Hz6→isCompactSummary,
//          WP→"local-command-stdout", oA6→"local-command-stderr",
//          rHA→"bash-stdout", oHA→"bash-stderr", EH→"task-notification",
//          vV→"tick", fj→"teammate-message"
```

**Why these types:**
- **User messages** — These are the checkpoints where the user can restore to
- **compact_boundary** — Users can restore to a compaction point

**Excluded types:**
- `isMeta: true` user messages — These are system reminders injected into the conversation
- `toolUseResult` messages — These are tool outputs, not user prompts
- `assistant` messages — Restoration happens at user prompt boundaries
- `progress` messages — Transient status updates
- `system` messages (except compact_boundary) — System notifications

### Virtual "Current" Entry

The UI adds a virtual entry at the bottom of the list representing "current state":

```javascript
// Location: chunks.185.mjs:1191-1196
let filteredMessages = useMemo(() => [
    ...messages.filter(isSelectableMessage),
    { ...createEmptyMessage({ content: "" }), uuid: currentUuid }
], [messages, currentUuid]);
```

This allows the user to select "current" which is useful for:
- "Summarize from here" — Summarize everything before now
- "Restore code" — Restore files without removing any messages

---

## 10. Telemetry Events

The UI emits the following telemetry events:

| Event | When Triggered | Properties |
|-------|----------------|------------|
| `tengu_message_selector_opened` | Component mounts | (none) |
| `tengu_message_selector_selected` | User presses Enter on a message | `index_from_end`, `message_type`, `is_current_prompt` |
| `tengu_message_selector_restore_option_selected` | User picks an option | `option` |
| `tengu_message_selector_cancelled` | User presses Esc to close | (none) |

### Event Flow Example

```
User opens rewind UI:
  → tengu_message_selector_opened {}

User presses ↓ twice:
  (no events - navigation is local)

User presses Enter on 3rd message from end:
  → tengu_message_selector_selected {
        index_from_end: 3,
        message_type: "user",
        is_current_prompt: false
    }

User selects "Restore code and conversation":
  → tengu_message_selector_restore_option_selected { option: "both" }

User presses Esc instead:
  → tengu_message_selector_cancelled {}
```

---

## 11. Diff Preview Loading

The diff stats for each message are loaded asynchronously to avoid blocking the UI:

```javascript
// Location: chunks.185.mjs:1343-1363
useEffect(() => {
    async function loadDiffStats() {
        if (!isCheckpointingEnabled) return;

        Promise.all(filteredMessages.map(async (msg, index) => {
            if (msg.uuid !== currentUuid) {
                let snapshotExists = snapshotExistsForMessage(fileHistory, msg.uuid);
                let nextMsg = filteredMessages.at(index + 1);
                let stats = snapshotExists
                    ? getMessagesDiffStats(messages, msg.uuid, nextMsg?.uuid !== currentUuid ? nextMsg?.uuid : undefined)
                    : undefined;

                if (stats !== undefined) {
                    setDiffStatsByIndex(prev => ({ ...prev, [index]: stats }));
                } else {
                    setDiffStatsByIndex(prev => ({ ...prev, [index]: undefined }));
                }
            }
        }));
    }
    loadDiffStats();
}, [filteredMessages, messages, currentUuid, fileHistory, isCheckpointingEnabled]);
```

**Why async loading:**
- Calculating diff stats requires reading backup files from disk
- Loading all stats synchronously would delay the UI render
- Stats are cached in state after loading

---

## 12. Loading States and Error Handling

### Loading State Variables

The component tracks multiple loading states:

```javascript
// From chunks.185.mjs:1202-1205
let [isLoading, setIsLoading] = useState(false);       // General loading
let [loadingAction, setLoadingAction] = useState(null); // Which action is loading
let [errorMessage, setErrorMessage] = useState(undefined); // Error to display
let [restoreMode, setRestoreMode] = useState("both");  // Selected restore option
```

### Loading Actions

| Action | loadingAction Value | UI Feedback |
|--------|---------------------|-------------|
| Restore conversation | `null` | No specific spinner |
| Restore code | `null` | No specific spinner |
| Summarize | `"summarize"` | "Summarizing…" spinner |

### Loading UI

When `isLoading: true` and `loadingAction: "summarize"`:

```javascript
// From chunks.185.mjs:1406-1409
{isLoading && loadingAction === "summarize" ? (
    <Row>
        <Spinner />
        <Text>Summarizing…</Text>
    </Row>
) : (
    <OptionsSelector ... />
)}
```

### Error Display

Errors are shown inline in the UI:

```javascript
// From chunks.185.mjs:1377-1379
{errorMessage && (
    <Fragment>
        <Text color="error">Error: {errorMessage}</Text>
    </Fragment>
)}
```

**Error messages:**
- `"Message not found."` - Selected message no longer exists
- `"Failed to restore the conversation: ..."` - Restore failed
- `"Failed to restore the code: ..."` - Code restore failed
- `"Failed to summarize: ..."` - Summarization failed
- Combined errors for "both" restore

### Pre-Restore Callback

The `onPreRestore` callback is called before any restore operation:

```javascript
// From chunks.185.mjs:1240, 1281, 1291
q();  // onPreRestore callback
```

**What it does:**
1. Aborts any in-progress LLM stream
2. Clears tool permission queue
3. Clears queued commands
4. Prepares clean state for restoration

### Error Isolation Pattern

For "Restore code and conversation" option, errors are isolated:

```javascript
// From chunks.185.mjs:1292-1311
let codeError = null;
let conversationError = null;

// Try code restore
if (option === "code" || option === "both") {
    try { await onRestoreCode(selectedMessage); }
    catch (e) { codeError = e; logError(e); }
}

// Try conversation restore (continues even if code failed)
if (option === "conversation" || option === "both") {
    try { await onRestoreMessage(selectedMessage); }
    catch (e) { conversationError = e; logError(e); }
}

// Show combined error if both failed
if (conversationError && codeError) {
    setErrorMessage(`Failed to restore both:\n${conversationError}\n${codeError}`);
}
```

**Why this pattern:**
- User gets partial restore if one operation fails
- All errors are logged for debugging
- UI shows exactly what failed

---

## 13. Keyboard Navigation Details

### Keybinding Registration

Keybindings are registered with context isolation:

```javascript
// From chunks.185.mjs:1332-1341
useKeybindings({
    "messageSelector:up": moveUp,
    "messageSelector:down": moveDown,
    "messageSelector:top": jumpToTop,
    "messageSelector:bottom": jumpToBottom,
    "messageSelector:select": selectCurrent
}, {
    context: "MessageSelector",
    isActive: !isLoading && !errorMessage && !selectedMessage && hasMultipleMessages
});
```

### Cancel Keybinding

The cancel action uses a separate registration:

```javascript
// From chunks.185.mjs:1329-1331
registerAction("confirm:no", handleCancel, {
    context: "Confirmation",
    isActive: !selectedMessage
});
```

**Why separate:**
- `confirm:no` is a global action (Esc key)
- Different context prevents conflicts
- `isActive` ensures cancel only works when not in option menu

### Navigation Implementation

```javascript
// From chunks.185.mjs:1321-1324
const moveUp = useCallback(() => setCurrentIndex(i => Math.max(0, i - 1)), []);
const moveDown = useCallback(() => setCurrentIndex(i => Math.min(messages.length - 1, i + 1)), [messages.length]);
const jumpToTop = useCallback(() => setCurrentIndex(0), []);
const jumpToBottom = useCallback(() => setCurrentIndex(messages.length - 1), [messages.length]);
```

**All navigation is local state updates** - no async operations, instant response.

---

## 14. Virtual "Current" Entry

The UI adds a virtual entry representing "current state":

```javascript
// From chunks.185.mjs:1191-1196
let filteredMessages = useMemo(() => [
    ...messages.filter(isSelectableMessage),
    { ...createEmptyMessage({ content: "" }), uuid: currentUuid }
], [messages, currentUuid]);
```

**Why this entry:**
1. Allows "Summarize from here" at the current position
2. Allows "Restore code" without removing any messages
3. User sees "current" as an option in the list

**Rendering difference:**
- Regular messages show timestamp and preview
- Virtual "current" shows special indicator

---

## 15. Complete Keyboard Event Flow

This section documents the complete keyboard event handling from the keypress to the action.

### 15.1 Keyboard Event Processing Pipeline

```
User presses key
         │
         ▼
    Terminal input
         │
         ▼
    Ink keybinding handler
         │
         ├─> Check active context
         │     │
         │     ├─> "MessageSelector" context → messageSelector:* actions
         │     └─> "Confirmation" context → confirm:* actions
         │
         ├─> Check isActive condition
         │     │
         │     ├─> !isLoading && !errorMessage && !selectedMessage && hasMultipleMessages
         │     │
         │     └─> If false: ignore keypress
         │
         ▼
    Dispatch action
         │
         ▼
    Registered callback
         │
         ▼
    State update (React re-render)
```

### 15.2 Action Registration Code

**Location:** chunks.185.mjs:1329-1341

```javascript
// ============================================
// Keybinding registration for message selector
// Location: chunks.185.mjs:1329-1341
// ============================================

// ORIGINAL (for source lookup):
D8("confirm:no", U, {
    context: "Confirmation",
    isActive: !W
}), tA({
    "messageSelector:up": r,
    "messageSelector:down": e,
    "messageSelector:top": Y6,
    "messageSelector:bottom": H6,
    "messageSelector:select": J6
}, {
    context: "MessageSelector",
    isActive: !v && !O && !W && P
});

// READABLE (for understanding):
// Cancel keybinding (Esc)
registerAction("confirm:no", handleCancel, {
    context: "Confirmation",
    isActive: !selectedMessage  // Only when not in option menu
});

// Navigation keybindings
useKeybindings({
    "messageSelector:up": moveUp,
    "messageSelector:down": moveDown,
    "messageSelector:top": jumpToTop,
    "messageSelector:bottom": jumpToBottom,
    "messageSelector:select": selectCurrent
}, {
    context: "MessageSelector",
    isActive: !isLoading && !errorMessage && !selectedMessage && hasMultipleMessages
});

// Mapping: D8→registerAction, tA→useKeybindings, U→handleCancel, r→moveUp,
//          e→moveDown, Y6→jumpToTop, H6→jumpToBottom, J6→selectCurrent,
//          v→isLoading, O→errorMessage, W→selectedMessage, P→hasMultipleMessages
```

### 15.3 Navigation State Machine

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MESSAGE SELECTOR STATES                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   [IDLE] ────── Esc+Esc ──────> [MESSAGE_LIST_ACTIVE]               │
│                                      │                               │
│                                      │ ↑/↓/j/k                       │
│                                      │ (updates currentIndex)        │
│                                      ▼                               │
│                               [SCROLLING]                            │
│                                      │                               │
│                                      │ Enter                         │
│                                      ▼                               │
│                           ┌──────────┴──────────┐                    │
│                           │                     │                    │
│                    [FAST_PATH_RESTORE]    [OPTION_MENU_ACTIVE]       │
│                    (no file changes,      (show options)             │
│                     single message)             │                    │
│                           │                     │ ↑/↓                │
│                           │                     ▼                    │
│                           │              [SELECTING_OPTION]          │
│                           │                     │                    │
│                           │                     │ Enter              │
│                           │                     ▼                    │
│                           │           ┌────────┴────────┐            │
│                           │           │                 │            │
│                           │    [EXECUTING_RESTORE] [CANCELLED]       │
│                           │           │                 │            │
│                           └───────────┴─────────────────┘            │
│                                       │                              │
│                                       ▼                              │
│                                  [CLOSED] ───> Return to IDLE         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 15.4 Fast-Path Decision Tree

The fast-path optimization skips the option menu when the restore is trivial:

```
handleMessageSelection(message)
         │
         ├─> Checkpointing disabled?
         │     │
         │     └─> YES → Fast path: conversation restore only
         │
         ├─> Get dry-run diff stats
         │     │
         │     └─> filesChanged.length === 0?
         │           │
         │           └─> NO → Show option menu
         │
         ├─> Only one message after index?
         │     │
         │     └─> NO → Show option menu
         │
         └─> YES to both → Fast path: conversation restore only
```

**Code implementation:**

```javascript
// From handleMessageSelection at line 1263-1267
let diffResult = getDryRunDiffStats(fileHistory, message.uuid);
let noFileChanges = !diffResult?.filesChanged || diffResult.filesChanged.length === 0;
let isSingleMessage = isOnlyOneMessageAfterIndex(messages, messageIndex);

if (noFileChanges && isSingleMessage) {
    await handleRestoreMessage(message);  // Fast path
} else {
    setSelectedMessage(message);          // Show option menu
    setDiffStats(diffResult);
}
```

---

## 16. Virtual "Current" Entry Deep-Dive

The message list includes a virtual entry representing "current state" which deserves special attention.

### 16.1 Why a Virtual Entry?

The virtual "current" entry serves three purposes:

1. **"Summarize from here" at current position** - Users can compact everything before now without selecting an old message
2. **"Restore code" without removing messages** - Users can undo file changes but keep conversation
3. **Clear visual indicator** - Shows where new messages will appear

### 16.2 Virtual Entry Creation

**Location:** chunks.185.mjs:1191-1196

```javascript
// ============================================
// Virtual "current" entry creation
// Location: chunks.185.mjs:1191-1196
// ============================================

// ORIGINAL (for source lookup):
let J = XH.useMemo(() => [...A.filter(XV6), {
    ...p1({
        content: ""
    }),
    uuid: j
}], [A, j])

// READABLE (for understanding):
let filteredMessages = useMemo(() => [
    ...messages.filter(isSelectableMessage),  // All selectable user messages
    {
        ...createUserMessage({ content: "" }), // Empty user message
        uuid: currentUuid                       // Generated UUID for "current"
    }
], [messages, currentUuid]);

// Mapping: J→filteredMessages, A→messages, XV6→isSelectableMessage,
//          p1→createUserMessage, j→currentUuid
```

### 16.3 Special Handling for Virtual Entry

The virtual entry is handled differently in several places:

**1. Diff stats calculation:**
```javascript
// From line 1347-1351
if (msg.uuid !== currentUuid) {  // Skip virtual entry
    let snapshotExists = snapshotExistsForMessage(fileHistory, msg.uuid);
    // ... calculate diff stats
}
```

**2. Message selection:**
```javascript
// When selecting the virtual "current" entry:
// - No conversation restore (no messages to remove)
// - Code restore works normally
// - Summarize works (summarizes everything)
```

**3. Rendering:**
The virtual entry is rendered with a special indicator to distinguish it from real messages.

---

## 17. Accessibility Considerations

### 17.1 Screen Reader Support

The message selector uses semantic rendering:
- Each message is a selectable item
- The highlighted item has focus indication
- Status changes are announced

### 17.2 Keyboard-Only Navigation

All functionality is accessible via keyboard:
- `↑/↓` or `j/k` for navigation
- `Enter` for selection
- `Esc` for cancel/back
- `Shift+↑/↓` for jump to edge

### 17.3 Visual Indicators

The UI provides clear visual feedback:
- Highlighted row has `▶` pointer
- Diff stats show file change preview
- Loading spinner during operations
- Error messages in red

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Rewind module section
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI rendering

Key UI components:
- `RewindMessageSelector` (zs8) - chunks.185.mjs:1179 - Main React component
- `generateRestoreOptions` (g) - chunks.185.mjs:1207 - Build restore option list
- `handleMessageSelection` (b) - chunks.185.mjs:1248 - Process message selection
- `handleRestoreOptionSelected` (p) - chunks.185.mjs:1269 - Dispatch restore/summarize
- `isSelectableMessage` (XV6) - chunks.185.mjs:1692 - Filter for rewindable messages
- `isOnlyOneMessageAfterIndex` (YI1) - chunks.185.mjs:1704 - Fast-path check
- `getMessagesDiffStats` (KXz) - chunks.185.mjs:1659 - Compute diff stats for message range
- `VISIBLE_MESSAGE_COUNT` (Ys8) - chunks.185.mjs:1730 - Constant: 7 (messages per page)

Slash command handler:
- `rewindCommandHandler` (zAz) - chunks.165.mjs:687 - Opens message selector, returns "skip"
- `rewindCommandDefinition` (_Az) - chunks.165.mjs:699 - Command definition with aliases
- `rewindCommandModule` (pXq) - chunks.165.mjs:685 - Lazy-loaded module container

API handler:
- `handleRewindRequest` (thq) - chunks.187.mjs:1271 - SDK/CLI endpoint for rewind

Key file history functions:
- `isFileCheckpointingEnabled` (iz) - chunks.135.mjs:1977 - Master guard
- `getDryRunDiffStats` (eN1) - chunks.135.mjs:2107 - Preview diff stats
- `snapshotExistsForMessage` (tN1) - chunks.135.mjs:2102 - Check snapshot existence
- `hasChangesToRestore` (Wn4) - chunks.135.mjs:2114 - Check if files changed

---

## 17. State Management Integration

### 17.1 React Store Access Pattern

The RewindMessageSelector component accesses the FileHistory state through a Zustand-like store:

```javascript
// ============================================
// Store access in RewindMessageSelector
// Location: chunks.185.mjs:1187-1188
// ============================================

// ORIGINAL (for source lookup):
let w = M1((z6) => z6.fileHistory),

// READABLE (for understanding):
let fileHistory = useStore((state) => state.fileHistory);

// Mapping: w→fileHistory, M1→useStore, z6→state
```

**Why Zustand-like pattern:**
1. **Selective re-render** - Only re-renders when `fileHistory` changes
2. **No prop drilling** - Direct access to global state
3. **Type safety** - TypeScript can infer state shape

### 17.2 Functional State Updates

All state updates use functional updates to ensure atomicity:

```javascript
// From trackFileEdit (R66) at chunks.135.mjs:1988-2014
updateFileHistoryState((prevState) => {
    // Compute newState from prevState
    return {
        ...prevState,
        snapshots: [...prevState.snapshots.slice(0, -1), newSnapshot],
        trackedFiles: new Set(prevState.trackedFiles).add(normalizedPath)
    };
});
```

**Why functional updates:**
1. **Concurrency safety** - Multiple trackFileEdit calls can overlap safely
2. **React batching** - Compatible with React's automatic batching
3. **Undo/redo compatibility** - State history can be maintained

### 17.3 State Shape for FileHistory

```typescript
interface FileHistoryState {
    // Set of normalized file paths being tracked
    trackedFiles: Set<string>;

    // Array of message-level snapshots (max 100 in memory)
    snapshots: Snapshot[];

    // Monotonic counter incremented on each snapshot
    // Used as React key for reconciliation
    snapshotSequence: number;
}

interface Snapshot {
    // UUID of the user message this snapshot is associated with
    messageId: string;

    // Map of normalized path → backup record
    trackedFileBackups: {
        [normalizedPath: string]: BackupRecord | null;
    };

    // When this snapshot was created
    timestamp: Date;
}

interface BackupRecord {
    // Filename in ~/.claude/file-history/{sessionId}/
    // null means "file didn't exist at this point"
    backupFileName: string | null;

    // Version number (incremented each message the file changes)
    version: number;

    // When this backup was created
    backupTime: Date;
}
```

### 17.4 onPreRestore Callback Flow

The `onPreRestore` callback is critical for clean state restoration:

```javascript
// ============================================
// onPreRestore callback flow
// Location: Passed from app component to RewindMessageSelector
// ============================================

// Called BEFORE any restore operation
function onPreRestore() {
    // 1. Abort any in-progress LLM stream
    abortController.abort();

    // 2. Clear tool permission queue
    permissionQueue.clear();

    // 3. Clear queued commands
    commandQueue.clear();

    // 4. Set UI state to indicate restoration in progress
    setIsRestoring(true);
}
```

**Why this order:**
1. **LLM abort first** - Prevents race conditions with partial responses
2. **Permission queue second** - No new permissions during restore
3. **Command queue third** - No pending commands after restore
4. **UI state last** - Visual feedback to user

### 17.5 State Restoration Sequence

When user selects "Restore code and conversation":

```
1. onPreRestore()
   └─> Clear active operations

2. onRestoreCode(message)
   ├─> rewindHandler(message.uuid)
   │   └─> rewindAndRestoreFiles(fileHistory, snapshot, dryRun=false)
   │       ├─> For each tracked file:
   │       │   ├─> Delete if backupFileName === null
   │       │   └─> Restore from backup otherwise
   │       └─> Return { filesChanged, insertions, deletions }
   └─> File system is now at snapshot state

3. onRestoreMessage(message)
   ├─> Slice messages array at message index
   │   └─> messages = messages.slice(0, messageIndex)
   ├─> Restore auxiliary state:
   │   ├─> Todos (from snapshot.savedTodos)
   │   ├─> Permission mode (reset if changed)
   │   └─> Prompt text (re-inject to input)
   └─> Conversation is now at snapshot state

4. onClose()
   └─> Selector unmounts, return to normal input
```

### 17.6 React Reconciliation Optimization

The `snapshotSequence` counter provides a stable key for React reconciliation:

```javascript
// When creating a new snapshot:
newHistory = {
    ...currentHistory,
    snapshots: [...currentHistory.snapshots, newSnapshot],
    snapshotSequence: (currentHistory.snapshotSequence ?? 0) + 1
};

// In UI components, used as dependency:
useEffect(() => {
    // Re-run when snapshots change
    loadDiffStats();
}, [fileHistory.snapshotSequence]);
```

**Why not use `snapshots.length`:**
- `snapshots.length` can stay the same (old ones discarded)
- `snapshotSequence` always increments
- More reliable for detecting "something changed"

---

## 18. Cross-Feature Integration Reference

### Integration with System Reminder (04_system_reminder)

| Component | Integration |
|-----------|-------------|
| Session persistence | `recordFileHistorySnapshot` writes to JSONL |
| Session hydration | `hydrateFileHistoryFromSnapshots` restores state |
| Session migration | `migrateFileHistoryToNewSession` copies backups |

### Integration with Compact (07_compact)

| Component | Integration |
|-----------|-------------|
| "Summarize from here" | Calls `performPartialCompaction` |
| Boundary marker | `createCompactBoundary` creates system message |
| Summary LLM call | `generateSummaryWithLLM` generates summary |

### Integration with File Tools (05_tools)

| Tool | Integration |
|------|-------------|
| Write | `trackFileEdit` called before write |
| Edit | `trackFileEdit` called before edit |
| NotebookEdit | `trackFileEdit` called before cell edit |

---

## 19. See Also

- [implementation.md](./implementation.md) - Core implementation details
- [overview.md](./overview.md) - Feature overview and architecture
- [../04_system_reminder/](../04_system_reminder/) - Session persistence
- [../07_compact/](../07_compact/) - Compaction documentation
- [../15_state_management/](../15_state_management/) - React state schema
- [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Symbol mappings