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
- `isSelectableMessage` (XV6) - Filter for rewindable user messages
- `isOnlyOneMessageAfterIndex` (YI1) - Fast-path restore check
- `getMessagesDiffStats` (KXz) - Compute diff stats between messages

---

## Table of Contents

1. [Entry Points](#1-entry-points)
2. [RewindMessageSelector Component](#2-rewindmessageselector-component-zs8)
3. [Message List Rendering](#3-message-list-rendering)
4. [Restore Options Menu](#4-restore-options-menu)
5. [Keyboard Navigation](#5-keyboard-navigation)
6. [Helper Components](#6-helper-components)
7. [State Management](#7-state-management)
8. [Fast-Path Optimization](#8-fast-path-optimization)

---

## 1. Entry Points

The rewind UI can be triggered in two ways:

### 1a. Keyboard: Esc + Esc (Double Escape)

Pressing `Esc` twice opens the message selector. This is handled at the app-level keyboard context:
- First `Esc` sends the `"confirm:no"` action (cancel in-progress operations)
- Second `Esc` (when no other modal is open) triggers `openMessageSelector()`

The `D8` function registers the `"confirm:no"` action handler within the component.

### 1b. Slash Command: `/rewind` (alias: `/checkpoint`)

```javascript
// ============================================
// rewindCommandDefinition - Slash command registration
// Location: chunks.165.mjs:699-710
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
const rewindCommandDefinition = {
    description: "Restore the code and/or conversation to a previous point",
    name: "rewind",
    aliases: ["checkpoint"],
    userFacingName: () => "rewind",
    argumentHint: "",
    isEnabled: () => true,
    type: "local",
    isHidden: false,
    supportsNonInteractive: false,
    load: () => Promise.resolve().then(() => rewindCommandModule)
};

// Mapping: _Az→rewindCommandDefinition, pXq→rewindCommandModule
```

**Command Handler (zAz):**

```javascript
// ============================================
// rewindCommandHandler - Handler for /rewind command
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
    if (context.openMessageSelector) {
        context.openMessageSelector();
    }
    return { type: "skip" };  // Don't submit a message
}

// Mapping: zAz→rewindCommandHandler, q→context
```

---

## 2. RewindMessageSelector Component (zs8)

**Location:** chunks.185.mjs:1179-1469

The main React component that renders the message selection UI and restore options.

```javascript
// ============================================
// RewindMessageSelector - Main component for rewind UI
// Location: chunks.185.mjs:1179-1469
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
    // ... (continues with rendering logic)
}

// READABLE (for understanding):
function RewindMessageSelector({
    messages,           // All conversation messages
    onPreRestore,       // Callback before restore starts
    onRestoreMessage,   // Callback to restore conversation
    onRestoreCode,      // Callback to restore files
    onSummarize,        // Callback to summarize from point
    onClose             // Callback to close the UI
}) {
    // Access fileHistory from global state
    let fileHistory = useSelector((state) => state.fileHistory);

    // Error state
    let [error, setError] = useState(undefined);

    // Is checkpointing enabled?
    let checkpointingEnabled = isFileCheckpointingEnabled();

    // Memoized UUID for "current prompt" placeholder
    let currentPromptUuid = useMemo(generateUuidMemo, []);

    // Build selectable message list
    // 1. Filter to user messages (exclude tool_result, meta, etc.)
    // 2. Add a "current prompt" placeholder at the end
    let selectableMessages = useMemo(() => [
        ...messages.filter(isSelectableMessage),
        {
            ...createUserMessage({ content: "" }),
            uuid: currentPromptUuid
        }
    ], [messages, currentPromptUuid]);

    // Currently highlighted message index
    let [highlightedIndex, setHighlightedIndex] = useState(selectableMessages.length - 1);

    // Scroll window calculation (centers highlighted message)
    let scrollOffset = Math.max(0, Math.min(
        highlightedIndex - Math.floor(VISIBLE_MESSAGE_COUNT / 2),
        selectableMessages.length - VISIBLE_MESSAGE_COUNT
    ));

    // Can we rewind? (Need at least one message)
    let canRewind = selectableMessages.length > 1;

    // Selected message for restore options
    let [selectedMessage, setSelectedMessage] = useState(undefined);

    // Diff stats for selected message
    let [diffStats, setDiffStats] = useState(undefined);

    // Loading state
    let [isLoading, setIsLoading] = useState(false);

    // Operation type being performed
    let [operationType, setOperationType] = useState(null);

    // Focused restore option
    let [focusedOption, setFocusedOption] = useState("both");

    // Summarize context input
    let [summarizeContext, setSummarizeContext] = useState("");

    // ... (rendering logic continues)
}

// Mapping: zs8→RewindMessageSelector, A→messages, q→onPreRestore, K→onRestoreMessage,
//          Y→onRestoreCode, z→onSummarize, _→onClose, M1→useSelector, iz→isFileCheckpointingEnabled,
//          XV6→isSelectableMessage, p1→createUserMessage, Ys8→VISIBLE_MESSAGE_COUNT
```

### Props Interface

```typescript
interface RewindMessageSelectorProps {
    messages: TenguMessage[];           // All messages in conversation
    onPreRestore: () => void;           // Called before any restore operation
    onRestoreMessage: (message: TenguMessage) => Promise<void>;  // Slice conversation
    onRestoreCode: (message: TenguMessage) => Promise<void>;     // Restore files
    onSummarize: (message: TenguMessage, context?: string) => Promise<void>;  // Summarize
    onClose: () => void;                // Close the UI
}
```

---

## 3. Message List Rendering

### Filtering: isSelectableMessage (XV6)

**Location:** chunks.185.mjs:1692-1702

```javascript
// ============================================
// isSelectableMessage - Filter for rewindable messages
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

    // Exclude tool_result messages (these are part of assistant responses)
    if (Array.isArray(message.message.content)
        && message.message.content[0]?.type === "tool_result") {
        return false;
    }

    // Exclude empty messages
    if (isEmptyMessage(message)) return false;

    // Exclude meta messages (system reminders, etc.)
    if (message.isMeta) return false;

    // Extract text content
    let content = message.message.content;
    let lastBlock = typeof content === "string" ? null : content[content.length - 1];
    let text = typeof content === "string"
        ? content.trim()
        : (lastBlock && isTextBlock(lastBlock) ? lastBlock.text.trim() : "");

    // Exclude messages containing special XML tags
    // These indicate internal operations, not user prompts
    const EXCLUDED_TAGS = [
        "<bash-input>",      // Bash command execution
        "<command-name>",    // Slash command
        "<bash-tool-call>",  // Tool call from bash
        "<init-command>",    // Init command
        "<memory-edit>",     // Memory edit
        "<synthesis>",       // Synthesis operation
        "<agent-memory"      // Agent memory operation
    ];

    for (let tag of EXCLUDED_TAGS) {
        if (text.indexOf(tag) !== -1) return false;
    }

    return true;
}

// Mapping: XV6→isSelectableMessage, A→message, Hz6→isEmptyMessage, Yhq→isTextBlock
//          WP→"bash-input", oA6→"command-name", rHA→"bash-tool-call", etc.
```

**What gets excluded:**
1. Non-user messages (assistant, system, etc.)
2. Tool result messages (continuations of previous prompts)
3. Empty messages
4. Meta messages (system reminders, hooks output)
5. Internal operations (bash-input, slash commands, memory edits, etc.)

### Scroll Window Calculation

```javascript
// Visible messages per page
const VISIBLE_MESSAGE_COUNT = 7;  // Ys8

// Calculate scroll offset to center highlighted message
let scrollOffset = Math.max(0, Math.min(
    highlightedIndex - Math.floor(VISIBLE_MESSAGE_COUNT / 2),
    selectableMessages.length - VISIBLE_MESSAGE_COUNT
));

// Render only visible slice
selectableMessages.slice(scrollOffset, scrollOffset + VISIBLE_MESSAGE_COUNT).map(...)
```

### Diff Stats Per Message

Each message in the list shows diff stats for files changed between that message and the next:

```javascript
// Calculate diff stats for each message
useEffect(() => {
    async function computeAllDiffStats() {
        if (!checkpointingEnabled) return;

        Promise.all(selectableMessages.map(async (msg, index) => {
            if (msg.uuid !== currentPromptUuid) {
                let hasSnapshot = snapshotExistsForMessage(fileHistory, msg.uuid);
                let nextMsg = selectableMessages.at(index + 1);
                let nextUuid = nextMsg?.uuid !== currentPromptUuid ? nextMsg?.uuid : undefined;

                let stats = hasSnapshot
                    ? getMessagesDiffStats(messages, msg.uuid, nextUuid)
                    : undefined;

                if (stats !== undefined) {
                    setDiffStatsCache((cache) => ({
                        ...cache,
                        [index]: stats
                    }));
                } else {
                    setDiffStatsCache((cache) => ({
                        ...cache,
                        [index]: undefined
                    }));
                }
            }
        }));
    }
    computeAllDiffStats();
}, [selectableMessages, messages, fileHistory, checkpointingEnabled]);
```

### getMessagesDiffStats (KXz)

**Location:** chunks.185.mjs:1659-1690

```javascript
// ============================================
// getMessagesDiffStats - Compute diff stats between messages
// Location: chunks.185.mjs:1659-1690
// ============================================

// ORIGINAL (for source lookup):
function KXz(A, q, K) {
    let Y = A.findIndex(($) => $.uuid === q);
    if (Y === -1) return;
    let z = K ? A.findIndex(($) => $.uuid === K) : A.length;
    if (z === -1) z = A.length;
    let _ = [],
        w = 0,
        O = 0;
    for (let $ = Y + 1; $ < z; $++) {
        let H = A[$];
        if (!H || !wl6(H)) continue;
        let j = H.toolUseResult;
        if (!j || !j.filePath || !j.structuredPatch) continue;
        if (!_.includes(j.filePath)) _.push(j.filePath);
        try {
            if ("type" in j && j.type === "create") w += j.content.split(/\r?\n/).length;
            else
                for (let J of j.structuredPatch) {
                    let M = J.lines.filter((X) => X.startsWith("+")).length,
                        D = J.lines.filter((X) => X.startsWith("-")).length;
                    w += M, O += D
                }
        } catch {
            continue
        }
    }
    return {
        filesChanged: _,
        insertions: w,
        deletions: O
    }
}

// READABLE (for understanding):
function getMessagesDiffStats(messages, startMessageId, endMessageId) {
    // Find message indices
    let startIndex = messages.findIndex((m) => m.uuid === startMessageId);
    if (startIndex === -1) return undefined;

    let endIndex = endMessageId
        ? messages.findIndex((m) => m.uuid === endMessageId)
        : messages.length;
    if (endIndex === -1) endIndex = messages.length;

    let filesChanged = [],
        insertions = 0,
        deletions = 0;

    // Scan messages between start and end
    for (let i = startIndex + 1; i < endIndex; i++) {
        let message = messages[i];
        if (!message || !isToolUseMessage(message)) continue;

        let toolResult = message.toolUseResult;
        if (!toolResult || !toolResult.filePath || !toolResult.structuredPatch) continue;

        // Track unique files
        if (!filesChanged.includes(toolResult.filePath)) {
            filesChanged.push(toolResult.filePath);
        }

        try {
            // Handle file creation
            if ("type" in toolResult && toolResult.type === "create") {
                insertions += toolResult.content.split(/\r?\n/).length;
            } else {
                // Count +/- lines from structured patch
                for (let hunk of toolResult.structuredPatch) {
                    let added = hunk.lines.filter((line) => line.startsWith("+")).length;
                    let removed = hunk.lines.filter((line) => line.startsWith("-")).length;
                    insertions += added;
                    deletions += removed;
                }
            }
        } catch {
            continue;
        }
    }

    return { filesChanged, insertions, deletions };
}

// Mapping: KXz→getMessagesDiffStats, A→messages, q→startMessageId, K→endMessageId,
//          wl6→isToolUseMessage, _→filesChanged, w→insertions, O→deletions
```

**Key insight:** This function extracts diff stats from the `structuredPatch` field on tool results, which is computed during tool execution. This is more accurate than `calculateFileDiffStats` which compares files on disk.

---

## 4. Restore Options Menu

### generateRestoreOptions (g)

**Location:** chunks.185.mjs:1207-1235

```javascript
// ============================================
// generateRestoreOptions - Build restore option list
// Location: chunks.185.mjs:1207-1235
// ============================================

// ORIGINAL (for source lookup):
function g(z6) {
    let N6 = z6 ? [{
        value: "both",
        label: "Restore code and conversation"
    }, {
        value: "conversation",
        label: "Restore conversation"
    }, {
        value: "code",
        label: "Restore code"
    }] : [{
        value: "conversation",
        label: "Restore conversation"
    }];
    return N6.push({
        value: "summarize",
        label: "Summarize from here",
        type: "input",
        placeholder: "add context (optional)",
        initialValue: "",
        onChange: I,
        allowEmptySubmitToCancel: !0,
        showLabelWithValue: !0,
        labelValueSeparator: ": "
    }), N6.push({
        value: "nevermind",
        label: "Never mind"
    }), N6
}

// READABLE (for understanding):
function generateRestoreOptions(hasCodeChanges) {
    let options = [];

    if (hasCodeChanges) {
        // Full option set when files have changed
        options = [
            { value: "both", label: "Restore code and conversation" },
            { value: "conversation", label: "Restore conversation" },
            { value: "code", label: "Restore code" }
        ];
    } else {
        // Only conversation options when no code changes
        options = [
            { value: "conversation", label: "Restore conversation" }
        ];
    }

    // Add summarize option with input field
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

    // Add cancel option
    options.push({
        value: "nevermind",
        label: "Never mind"
    });

    return options;
}

// Mapping: g→generateRestoreOptions, z6→hasCodeChanges, N6→options, I→setSummarizeContext
```

**Option Behavior:**

| Option | Code Changes? | Action |
|--------|---------------|--------|
| "both" | Required | Restore files + slice conversation |
| "conversation" | Any | Slice conversation (files unchanged) |
| "code" | Required | Restore files (conversation unchanged) |
| "summarize" | Any | Compact messages from start to selected |
| "nevermind" | Any | Cancel, close options menu |

### handleMessageSelection (b)

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

    // Message no longer in list? Close
    if (!messages.includes(message)) {
        onClose();
        return;
    }

    // Checkpointing disabled? Fast-path restore
    if (!checkpointingEnabled) {
        await fastPathRestore(message);
        return;
    }

    // Get diff stats for this message
    let diffStats = getDryRunDiffStats(fileHistory, message.uuid);
    let hasNoCodeChanges = !diffStats?.filesChanged || diffStats.filesChanged.length === 0;

    // Check if only trivial messages after this point
    let onlyTrivialAfter = isOnlyOneMessageAfterIndex(messages, messageIndex);

    // Fast-path: no code changes AND only trivial messages after
    // Skip options menu, restore directly
    if (hasNoCodeChanges && onlyTrivialAfter) {
        await fastPathRestore(message);
    } else {
        // Show options menu
        setSelectedMessage(message);
        setDiffStats(diffStats);
    }
}

// Mapping: b→handleMessageSelection, z6→message, A→messages, N6→messageIndex,
//          H→checkpointingEnabled, w→fileHistory, eN1→getDryRunDiffStats,
//          YI1→isOnlyOneMessageAfterIndex, Z→setSelectedMessage, f→setDiffStats
```

### handleRestoreOptionSelected (p)

**Location:** chunks.185.mjs:1269-1320

```javascript
// ============================================
// handleRestoreOptionSelected - Dispatch restore action
// Location: chunks.185.mjs:1269-1320
// ============================================

// ORIGINAL (for source lookup):
async function p(z6) {
    if (d("tengu_message_selector_restore_option_selected", {
            option: z6
        }), !W) {
        $("Message not found.");
        return
    }
    if (z6 === "nevermind") {
        Z(void 0);
        return
    }
    if (z6 === "summarize") {
        q(), N(!0), L("summarize"), $(void 0);
        try {
            let n = u.trim() || void 0;
            await z(W, n), N(!1), L(null), Z(void 0), _()
        } catch (n) {
            _6(n), N(!1), L(null), Z(void 0), $(`Failed to summarize:
${n}`)
        }
        return
    }
    q(), N(!0), $(void 0);
    let N6 = null,
        $6 = null;
    if (z6 === "code" || z6 === "both") try {
        await Y(W)
    } catch (n) {
        N6 = n, _6(N6)
    }
    if (z6 === "conversation" || z6 === "both") try {
        await K(W)
    } catch (n) {
        $6 = n, _6($6)
    }
    if (N(!1), Z(void 0), $6 && N6) $(`Failed to restore the conversation and code:
${$6}
${N6}`);
    else if ($6) $(`Failed to restore the conversation:
${$6}`);
    else if (N6) $(`Failed to restore the code:
${N6}`);
    else _()
}

// READABLE (for understanding):
async function handleRestoreOptionSelected(option) {
    telemetry("tengu_message_selector_restore_option_selected", { option });

    if (!selectedMessage) {
        setError("Message not found.");
        return;
    }

    // Cancel
    if (option === "nevermind") {
        setSelectedMessage(undefined);
        return;
    }

    // Summarize
    if (option === "summarize") {
        onPreRestore();
        setIsLoading(true);
        setOperationType("summarize");
        setError(undefined);

        try {
            let context = summarizeContext.trim() || undefined;
            await onSummarize(selectedMessage, context);
            setIsLoading(false);
            setOperationType(null);
            setSelectedMessage(undefined);
            onClose();
        } catch (err) {
            logError(err);
            setIsLoading(false);
            setOperationType(null);
            setSelectedMessage(undefined);
            setError(`Failed to summarize:\n${err}`);
        }
        return;
    }

    // Code/Conversation restore
    onPreRestore();
    setIsLoading(true);
    setError(undefined);

    let codeError = null;
    let conversationError = null;

    // Restore code (if requested)
    if (option === "code" || option === "both") {
        try {
            await onRestoreCode(selectedMessage);
        } catch (err) {
            codeError = err;
            logError(codeError);
        }
    }

    // Restore conversation (if requested)
    if (option === "conversation" || option === "both") {
        try {
            await onRestoreMessage(selectedMessage);
        } catch (err) {
            conversationError = err;
            logError(conversationError);
        }
    }

    setIsLoading(false);
    setSelectedMessage(undefined);

    // Report errors
    if (conversationError && codeError) {
        setError(`Failed to restore the conversation and code:\n${conversationError}\n${codeError}`);
    } else if (conversationError) {
        setError(`Failed to restore the conversation:\n${conversationError}`);
    } else if (codeError) {
        setError(`Failed to restore the code:\n${codeError}`);
    } else {
        onClose();
    }
}

// Mapping: p→handleRestoreOptionSelected, z6→option, W→selectedMessage,
//          q→onPreRestore, K→onRestoreMessage, Y→onRestoreCode, z→onSummarize,
//          _→onClose, N→setIsLoading, L→setOperationType, Z→setSelectedMessage
```

---

## 5. Keyboard Navigation

### Keybinding Registration

```javascript
// ============================================
// Keyboard bindings for MessageSelector context
// Location: chunks.185.mjs:1329-1341
// ============================================

// Register "confirm:no" handler (Esc key)
D8("confirm:no", handleCancel, {
    context: "Confirmation",
    isActive: !selectedMessage  // Only when options menu not shown
});

// Register messageSelector actions
tA({
    "messageSelector:up": moveUp,
    "messageSelector:down": moveDown,
    "messageSelector:top": jumpToTop,
    "messageSelector:bottom": jumpToBottom,
    "messageSelector:select": selectHighlighted
}, {
    context: "MessageSelector",
    isActive: !isLoading && !error && !selectedMessage && canRewind
});
```

### Keybinding Definitions (chunks.89.mjs:2744-2763)

```javascript
// ============================================
// Keybinding definitions for MessageSelector
// Location: chunks.89.mjs:2744-2763
// ============================================

{
    context: "MessageSelector",
    bindings: {
        up: "messageSelector:up",
        down: "messageSelector:down",
        k: "messageSelector:up",        // Vim-style
        j: "messageSelector:down",      // Vim-style
        "ctrl+p": "messageSelector:up", // Emacs-style
        "ctrl+n": "messageSelector:down", // Emacs-style
        "ctrl+up": "messageSelector:top",
        "shift+up": "messageSelector:top",
        "meta+up": "messageSelector:top",
        "shift+k": "messageSelector:top",  // Vim-style
        "ctrl+down": "messageSelector:bottom",
        "shift+down": "messageSelector:bottom",
        "meta+down": "messageSelector:bottom",
        "shift+j": "messageSelector:bottom",  // Vim-style
        enter: "messageSelector:select"
    }
}
```

### Action Handlers

```javascript
// Move selection up
let moveUp = useCallback(() => setHighlightedIndex((i) => Math.max(0, i - 1)), []);

// Move selection down
let moveDown = useCallback(
    () => setHighlightedIndex((i) => Math.min(selectableMessages.length - 1, i + 1)),
    [selectableMessages.length]
);

// Jump to first message
let jumpToTop = useCallback(() => setHighlightedIndex(0), []);

// Jump to last message
let jumpToBottom = useCallback(
    () => setHighlightedIndex(selectableMessages.length - 1),
    [selectableMessages.length]
);

// Select highlighted message
let selectHighlighted = useCallback(() => {
    let message = selectableMessages[highlightedIndex];
    if (message) handleMessageSelection(message);
}, [selectableMessages, highlightedIndex, handleMessageSelection]);
```

---

## 6. Helper Components

### DiffStatsPreview (qXz)

**Location:** chunks.185.mjs:1471-1518

Displays "The code will be restored +N -M in file.ts":

```javascript
// ============================================
// DiffStatsPreview - Display diff stats for restore
// Location: chunks.185.mjs:1471-1518
// ============================================

function DiffStatsPreview({ diffStatsForRestore }) {
    if (diffStatsForRestore === undefined) return;

    if (!diffStatsForRestore.filesChanged || !diffStatsForRestore.filesChanged[0]) {
        return <Text dimColor>The code has not changed (nothing will be restored).</Text>;
    }

    let numFiles = diffStatsForRestore.filesChanged.length;
    let fileName;

    if (numFiles === 1) {
        fileName = path.basename(diffStatsForRestore.filesChanged[0]);
    } else if (numFiles === 2) {
        fileName = `${path.basename(diffStatsForRestore.filesChanged[0])} and ${path.basename(diffStatsForRestore.filesChanged[1])}`;
    } else {
        fileName = `${path.basename(diffStatsForRestore.filesChanged[0])} and ${numFiles - 1} other files`;
    }

    return (
        <Text dimColor>
            The code will be restored <DiffStatsDisplay diffStats={diffStatsForRestore} /> in {fileName}.
        </Text>
    );
}
```

### DiffStatsDisplay (zhq)

**Location:** chunks.185.mjs:1520-1540

Displays colored +/- counts:

```javascript
// ============================================
// DiffStatsDisplay - Colored +N -M display
// Location: chunks.185.mjs:1520-1540
// ============================================

function DiffStatsDisplay({ diffStats }) {
    if (!diffStats || !diffStats.filesChanged) return;

    return (
        <>
            <Text color="diffAddedWord">+{diffStats.insertions} </Text>
            <Text color="diffRemovedWord">-{diffStats.deletions}</Text>
        </>
    );
}
```

### Khq - UserMessagePreview

**Location:** chunks.185.mjs:1542-1657

Renders a preview of the user message with special handling for different message types:

```javascript
// ============================================
// UserMessagePreview - Render message preview
// Location: chunks.185.mjs:1542-1657
// ============================================

function UserMessagePreview({ userMessage, color, dimColor, isCurrent, paddingRight }) {
    let { columns } = useTerminalSize();

    // Special rendering for "current prompt" placeholder
    if (isCurrent) {
        return (
            <Box width="100%">
                <Text italic color={color} dimColor={dimColor}>(current)</Text>
            </Box>
        );
    }

    let content = userMessage.message.content;
    let lastBlock = typeof content === "string" ? null : content[content.length - 1];

    // Extract text
    let text = typeof content === "string"
        ? content.trim()
        : (lastBlock && isTextBlock(lastBlock) ? lastBlock.text.trim() : "(no prompt)");

    let normalizedText = normalizeText(text);

    // Empty message
    if (isEmptyText(normalizedText)) {
        return (
            <Box flexDirection="row" width="100%">
                <Text italic color={color} dimColor={dimColor}>((empty message))</Text>
            </Box>
        );
    }

    // Bash command
    if (normalizedText.includes("<bash-input>")) {
        let command = extractTagContent(normalizedText, "bash-input");
        if (command) {
            return (
                <Box flexDirection="row" width="100%">
                    <Text color="bashBorder">!</Text>
                    <Text color={color} dimColor={dimColor}> {command}</Text>
                </Box>
            );
        }
    }

    // Slash command
    if (normalizedText.includes("<command-name>")) {
        let cmdName = extractTagContent(normalizedText, "command-name");
        let cmdArgs = extractTagContent(normalizedText, "command-args");
        let isSkill = extractTagContent(normalizedText, "skill-format") === "true";

        if (cmdName) {
            if (isSkill) {
                return <Text color={color} dimColor={dimColor}>Skill({cmdName})</Text>;
            } else {
                return <Text color={color} dimColor={dimColor}>/{cmdName} {cmdArgs}</Text>;
            }
        }
    }

    // Regular message - truncate and wrap
    let displayText = paddingRight
        ? truncateText(normalizedText, columns - paddingRight, true)
        : normalizedText.slice(0, 500).split("\n").slice(0, 4).join("\n");

    return (
        <Box flexDirection="row" width="100%">
            <Text color={color} dimColor={dimColor}>{displayText}</Text>
        </Box>
    );
}
```

---

## 7. State Management

### Component State

```javascript
// State declarations from RewindMessageSelector

// Error message to display
let [error, setError] = useState(undefined);

// Currently selected message for restore options
let [selectedMessage, setSelectedMessage] = useState(undefined);

// Diff stats for selected message
let [diffStats, setDiffStats] = useState(undefined);

// Loading state during restore/summarize
let [isLoading, setIsLoading] = useState(false);

// Current operation type (for UI display)
let [operationType, setOperationType] = useState(null);

// Focused restore option
let [focusedOption, setFocusedOption] = useState("both");

// Context input for summarize
let [summarizeContext, setSummarizeContext] = useState("");

// Currently highlighted message index
let [highlightedIndex, setHighlightedIndex] = useState(selectableMessages.length - 1);

// Cache of diff stats per message index
let [diffStatsCache, setDiffStatsCache] = useState({});
```

### External State Access

```javascript
// Access fileHistory from global state via Zustand selector
let fileHistory = useSelector((state) => state.fileHistory);
```

---

## 8. Fast-Path Optimization

### isOnlyOneMessageAfterIndex (YI1)

**Location:** chunks.185.mjs:1704-1724

```javascript
// ============================================
// isOnlyOneMessageAfterIndex - Check for fast-path restore
// Location: chunks.185.mjs:1704-1724
// ============================================

// ORIGINAL (for source lookup):
function YI1(A, q) {
    for (let K = q + 1; K < A.length; K++) {
        let Y = A[K];
        if (!Y) continue;
        if (Hz6(Y)) continue;
        if (wl6(Y)) continue;
        if (Y.type === "progress") continue;
        if (Y.type === "system") continue;
        if (Y.type === "attachment") continue;
        if (Y.type === "user" && Y.isMeta) continue;
        if (Y.type === "assistant") {
            let z = Y.message.content;
            if (Array.isArray(z)) {
                if (z.some((w) => w.type === "text" && w.text.trim() || w.type === "tool_use")) return !1
            }
            continue
        }
        if (Y.type === "user") return !1
    }
    return !0
}

// READABLE (for understanding):
function isOnlyOneMessageAfterIndex(messages, targetIndex) {
    // Scan all messages after targetIndex
    for (let i = targetIndex + 1; i < messages.length; i++) {
        let message = messages[i];

        if (!message) continue;

        // Skip empty messages
        if (isEmptyMessage(message)) continue;

        // Skip tool_use messages (these are part of assistant responses)
        if (isToolUseMessage(message)) continue;

        // Skip trivial message types
        if (message.type === "progress") continue;
        if (message.type === "system") continue;
        if (message.type === "attachment") continue;

        // Skip meta user messages
        if (message.type === "user" && message.isMeta) continue;

        // Check assistant messages for content
        if (message.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // If assistant has any text or tool_use, it's a real response
                let hasRealContent = content.some(
                    (block) => (block.type === "text" && block.text.trim())
                            || block.type === "tool_use"
                );
                if (hasRealContent) return false;
            }
            continue;
        }

        // Any other user message is significant
        if (message.type === "user") return false;
    }

    // Only trivial messages found after target
    return true;
}

// Mapping: YI1→isOnlyOneMessageAfterIndex, A→messages, q→targetIndex,
//          Hz6→isEmptyMessage, wl6→isToolUseMessage
```

**What is considered "trivial":**
- `progress` messages (loading indicators)
- `system` messages
- `attachment` messages
- Meta `user` messages
- Empty `assistant` messages

**Why this optimization:**
When the user selects the last user message (or only trivial messages follow), there's nothing meaningful to restore. The UI can skip the options menu and restore directly, saving a click.

---

## Summary: UI State Machine

```
┌─────────────────────────────────────────────────────────────────────┐
│                    REWIND UI STATE MACHINE                           │
└─────────────────────────────────────────────────────────────────────┘

Initial State: Closed

User triggers /rewind or Esc+Esc
        │
        ▼
┌───────────────────────────────────┐
│  State: MESSAGE_LIST              │
│                                   │
│  • Show scrollable message list   │
│  • Highlighted index = last       │
│  • Compute diff stats in bg       │
│                                   │
│  Keyboard:                        │
│  • up/down: navigate list         │
│  • enter: select message          │
│  • esc: close                     │
└───────────────────────────────────┘
        │
        │ User presses Enter
        ▼
┌───────────────────────────────────┐
│  Check: Fast-path eligible?       │
│                                   │
│  • No code changes?               │
│  • Only trivial messages after?   │
└───────────────────────────────────┘
        │
   ┌────┴────┐
   │         │
   ▼         ▼
  Yes        No
   │         │
   │         ▼
   │  ┌───────────────────────────────────┐
   │  │  State: OPTIONS_MENU              │
   │  │                                   │
   │  │  • Show restore options           │
   │  │  • Diff stats preview             │
   │  │  • Summarize input field          │
   │  │                                   │
   │  │  Keyboard:                        │
   │  │  • up/down: navigate options      │
   │  │  • enter: select option           │
   │  │  • esc: back to message list      │
   │  └───────────────────────────────────┘
   │         │
   │         │ User selects option
   │         ▼
   │  ┌───────────────────────────────────┐
   │  │  State: LOADING                   │
   │  │                                   │
   │  │  • Show "Restoring..."            │
   │  │  • Execute restore/summarize      │
   │  │  • Handle errors                  │
   │  └───────────────────────────────────┘
   │         │
   └─────────┤
             │
             ▼
    ┌───────────────────────────────────┐
    │  State: CLOSED                    │
    │                                   │
    │  • Call onClose callback          │
    │  • Return to main conversation    │
    └───────────────────────────────────┘
```

---

## 9. Helper Functions from Other Modules

The rewind UI uses helper functions from `chunks.173.mjs` to filter and identify message types.

### isEmptyMessage (Hz6)

**Location:** chunks.173.mjs:1275-1277

```javascript
// ============================================
// isEmptyMessage - Check if message has empty content
// Location: chunks.173.mjs:1275-1277
// ============================================

// ORIGINAL (for source lookup):
function Hz6(A) {
    return A.type !== "progress" && A.type !== "attachment" && A.type !== "system" && Array.isArray(A.message.content) && A.message.content[0]?.type === "text" && TF6.has(A.message.content[0].text)
}

// READABLE (for understanding):
function isEmptyMessage(message) {
    // Exclude non-content message types
    if (message.type === "progress") return false;
    if (message.type === "attachment") return false;
    if (message.type === "system") return false;

    // Check if content is an array with a text block
    if (!Array.isArray(message.message.content)) return false;
    let firstBlock = message.message.content[0];
    if (firstBlock?.type !== "text") return false;

    // Check if text is in the known empty strings set
    return EMPTY_MESSAGE_STRINGS.has(firstBlock.text);
}

// Mapping: Hz6→isEmptyMessage, A→message, TF6→EMPTY_MESSAGE_STRINGS
```

**What it does:** Identifies messages that have no meaningful content (empty text blocks).

**How it works:**
1. Excludes `progress`, `attachment`, and `system` type messages (they're not empty, just special)
2. Checks if the first content block is text
3. Checks if the text is in a predefined set of empty strings

**Used by:** `isSelectableMessage` and `isOnlyOneMessageAfterIndex` to filter out empty messages.

### isToolUseMessage (wl6)

**Location:** chunks.173.mjs:1587-1589

```javascript
// ============================================
// isToolUseMessage - Check if message is a tool_result
// Location: chunks.173.mjs:1587-1589
// ============================================

// ORIGINAL (for source lookup):
function wl6(A) {
    return A.type === "user" && (Array.isArray(A.message.content) && A.message.content[0]?.type === "tool_result" || Boolean(A.toolUseResult))
}

// READABLE (for understanding):
function isToolUseMessage(message) {
    if (message.type !== "user") return false;

    // Check if content array has tool_result as first element
    if (Array.isArray(message.message.content) &&
        message.message.content[0]?.type === "tool_result") {
        return true;
    }

    // Or if it has a toolUseResult property
    return Boolean(message.toolUseResult);
}

// Mapping: wl6→isToolUseMessage, A→message
```

**What it does:** Identifies user messages that contain tool results (continuations of assistant responses).

**Why this matters:**
- Tool result messages are not independent user prompts
- They're part of the previous assistant's tool use flow
- Selecting them for rewind would be confusing (they're not real conversation turns)

**Used by:** `isSelectableMessage` and `isOnlyOneMessageAfterIndex` to filter out tool result messages.

### Yhq - isTextBlock

**Location:** chunks.185.mjs:1175-1177

```javascript
// ============================================
// isTextBlock - Check if content block is text type
// Location: chunks.185.mjs:1175-1177
// ============================================

// ORIGINAL (for source lookup):
function Yhq(A) {
    return A.type === "text"
}

// READABLE (for understanding):
function isTextBlock(block) {
    return block.type === "text";
}

// Mapping: Yhq→isTextBlock, A→block
```

**What it does:** Simple type guard for text content blocks.

**Used by:** `isSelectableMessage` and `UserMessagePreview` to extract text from content blocks.

---

## 10. Related Symbols Summary

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Rewind module section

Key UI symbols in this document:
- `RewindMessageSelector` (zs8) - Main component — chunks.185.mjs:1179-1469
- `generateRestoreOptions` (g) - Build option list — chunks.185.mjs:1207-1235
- `handleMessageSelection` (b) - Process selection — chunks.185.mjs:1248-1268
- `handleRestoreOptionSelected` (p) - Dispatch action — chunks.185.mjs:1269-1312
- `DiffStatsPreview` (qXz) - Preview display — chunks.185.mjs:1471-1518
- `getMessagesDiffStats` (KXz) - Compute diff stats — chunks.185.mjs:1659-1690
- `isSelectableMessage` (XV6) - Filter messages — chunks.185.mjs:1692-1702
- `isOnlyOneMessageAfterIndex` (YI1) - Fast-path check — chunks.185.mjs:1704-1724
- `isEmptyMessage` (Hz6) - Empty check — chunks.173.mjs:1275-1277
- `isToolUseMessage` (wl6) - Tool result check — chunks.173.mjs:1587-1589
- `isTextBlock` (Yhq) - Text block check — chunks.185.mjs:1175-1177
- `VISIBLE_MESSAGE_COUNT` (Ys8) = 7 — chunks.185.mjs:1730

---

## Version History

| Version | Changes |
|---------|---------|
| v2.1.76 | Added Hz6/wl6 helper function documentation; Verified all symbol line numbers; Added Yhq documentation |