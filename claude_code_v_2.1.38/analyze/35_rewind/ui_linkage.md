# UI Linkage - Rewind / Checkpointing (Module 35)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Rewind module section
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI rendering

Key UI components in this document:
- `RewindMessageSelector` (fMq) - Main React component — message list + restore options
- `calculateFileDiffBetweenMessages` (TJz) - Diff stats from structured patch data
- `generateRestoreOptions` (g) - Build option list based on checkpoint availability
- `handleRestoreOptionSelected` (x) - Dispatch restore/summarize callbacks

---

## 1. Entry Points

The rewind UI can be triggered in two ways:

### 1a. Keyboard: Esc + Esc (Double Escape)

Pressing `Esc` twice opens the message selector. This is handled at the app-level keyboard context:
- First `Esc` sends the `"confirm:no"` action (cancel in-progress operations)
- Second `Esc` (when no other modal is open) triggers `openMessageSelector()`

The `"confirm:no"` binding in `fMq` (`DA("confirm:no", l, { context: "Confirmation", isActive: !W })`) also closes the selector if a message is not yet selected — meaning Esc works as "back" within the selector too.

### 1b. Slash Command: `/rewind` (alias: `/checkpoint`)

```javascript
// ============================================
// handleRewindCommand - /rewind slash command handler
// Location: chunks.165.mjs:1137-1141
// ============================================

// ORIGINAL (for source lookup):
async function cqz(A, q) {
    if (u8("rewind"), q.openMessageSelector) q.openMessageSelector();
    return { type: "skip" }
}

// READABLE (for understanding):
async function handleRewindCommand(commandArgs, context) {
    trackEvent("rewind");
    if (context.openMessageSelector) context.openMessageSelector();
    return { type: "skip" }   // skip: no visible output in the conversation
}

// Mapping: cqz→handleRewindCommand, A→commandArgs, q→context, u8→trackEvent
```

The `openMessageSelector` is injected into the slash command context from the main app component. Returning `{ type: "skip" }` prevents any text from being added to the conversation.

---

## 2. Main UI Component: `RewindMessageSelector` (fMq)

**File**: chunks.178.mjs
**Type**: React functional component
**Rendering**: Ink/React terminal UI

### Component State

| State Variable | Readable Name | Initial | Purpose |
|---------------|---------------|---------|---------|
| `D, j` | `currentIndex, setCurrentIndex` | `messages.length - 1` | Which message row is highlighted |
| `W, G` | `selectedMessage, setSelectedMessage` | `undefined` | Which message was confirmed (opens option menu) |
| `f, Z` | `diffStats, setDiffStats` | `undefined` | Current highlighted message's diff preview |
| `N, T` | `isLoading, setIsLoading` | `false` | Loading spinner state |
| `k, y` | `loadingAction, setLoadingAction` | `null` | Which action is loading ("summarize", "code", "conversation") |
| `B, S` | `restoreMode, setRestoreMode` | `"both"` | The restore option selection |
| `m, b` | `summarizeContext, setSummarizeContext` | `""` | User-typed context for summarize |
| `$, O` | `errorMessage, setErrorMessage` | `undefined` | Error to show in the UI |

### Message Filtering and "Current" Message

```javascript
// ============================================
// Message list construction with virtual "current" entry
// Location: chunks.178.mjs (inside fMq)
// ============================================

// ORIGINAL:
let X = K_.useMemo(() => [...A.filter(Zc1), {
    ...c6({ content: "" }),
    uuid: J
}], [A, J]),

// READABLE:
let filteredMessages = useMemo(() => [
    ...messages.filter(isSelectableMessage),   // only user messages and certain tool results
    {
        ...createEmptyMessage({ content: "" }),  // virtual "current" entry
        uuid: currentUuid
    }
], [messages, currentUuid]);
```

A virtual "current" entry is appended at the bottom. This represents the **current state** — selecting it and choosing "Restore" is a no-op, but selecting "Summarize from here" on it compacts the entire conversation.

The initial `currentIndex` is `filteredMessages.length - 1`, meaning the selector opens with the **most recent** message highlighted.

### Scroll Window: `dQA = 7` Items Per Page

The visible portion of the message list is a sliding window of 7 items:

```
scrollOffset = max(0, min(currentIndex - floor(7/2), totalMessages - 7))
```

This keeps the highlighted item centered in the window as the user scrolls.

---

## 3. Keyboard Navigation

Keyboard bindings are registered via `c7` (multiple actions) and `DA` (single action):

```javascript
// ============================================
// Keyboard binding registration for MessageSelector
// Location: chunks.178.mjs:2473-2485
// ============================================

// ORIGINAL:
DA("confirm:no", l, { context: "Confirmation", isActive: !W }),
c7({
    "messageSelector:up": r,
    "messageSelector:down": s,
    "messageSelector:top": O1,
    "messageSelector:bottom": T1,
    "messageSelector:select": N1
}, { context: "MessageSelector", isActive: !N && !$ && !W && P });

// READABLE:
registerKeyBinding("confirm:no", closeCallback, { context: "Confirmation", isActive: !selectedMessage }),
registerGlobalKeyBindings({
    "messageSelector:up":     scrollUp,
    "messageSelector:down":   scrollDown,
    "messageSelector:top":    scrollToTop,
    "messageSelector:bottom": scrollToBottom,
    "messageSelector:select": confirmSelection
}, { context: "MessageSelector", isActive: !isLoading && !errorMessage && !selectedMessage && hasMultipleMessages });
```

| Action Key | Default Binding | Behavior |
|-----------|----------------|---------|
| `messageSelector:up` | ↑ / k | Move highlight up one row |
| `messageSelector:down` | ↓ / j | Move highlight down one row |
| `messageSelector:top` | Home / gg | Jump to first (oldest) message |
| `messageSelector:bottom` | End / G | Jump to last (most recent / current) |
| `messageSelector:select` | Enter | Confirm selection → show option menu |
| `confirm:no` | Esc | Close selector (if no message selected) |

**Active condition**: All navigation keys are disabled when:
- `isLoading = true` (a restore/summarize is in progress)
- `errorMessage` is set (error state shown)
- `selectedMessage` is set (option menu is open — different keys take over)
- `hasMultipleMessages = false` (only one message → nothing to navigate)

---

## 4. Diff Stats Preview

When navigating the message list, each highlighted row shows a diff stats preview:

```javascript
// ============================================
// calculateFileDiffBetweenMessages - Compute diff for a range
// Location: chunks.178.mjs:2803-2834
// ============================================

// ORIGINAL:
function TJz(A, q, K) {
    let Y = A.findIndex((O) => O.uuid === q);
    if (Y === -1) return;
    let z = K ? A.findIndex((O) => O.uuid === K) : A.length;
    if (z === -1) z = A.length;
    let w = [], H = 0, $ = 0;
    for (let O = Y + 1; O < z; O++) {
        let _ = A[O];
        if (!_ || !jJq(_)) continue;
        let J = _.toolUseResult;
        if (!J || !J.filePath || !J.structuredPatch) continue;
        if (!w.includes(J.filePath)) w.push(J.filePath);
        try {
            if ("type" in J && J.type === "create") H += J.content.split(/\r?\n/).length;
            else for (let X of J.structuredPatch) {
                let D = X.lines.filter((M) => M.startsWith("+")).length,
                    j = X.lines.filter((M) => M.startsWith("-")).length;
                H += D; $ += j;
            }
        } catch { continue }
    }
    return { filesChanged: w, insertions: H, deletions: $ }
}

// READABLE:
function calculateFileDiffBetweenMessages(messages, startMsgId, endMsgId) {
    let startIdx = messages.findIndex(m => m.uuid === startMsgId);
    if (startIdx === -1) return;
    let endIdx = endMsgId ? messages.findIndex(m => m.uuid === endMsgId) : messages.length;
    if (endIdx === -1) endIdx = messages.length;
    let changedFiles = [], totalAdditions = 0, totalDeletions = 0;
    for (let i = startIdx + 1; i < endIdx; i++) {
        let msg = messages[i];
        if (!msg || !isToolResultMessage(msg)) continue;
        let result = msg.toolUseResult;
        if (!result || !result.filePath || !result.structuredPatch) continue;
        if (!changedFiles.includes(result.filePath)) changedFiles.push(result.filePath);
        try {
            if ("type" in result && result.type === "create")
                totalAdditions += result.content.split(/\r?\n/).length;  // new file
            else for (let hunk of result.structuredPatch) {
                totalAdditions += hunk.lines.filter(l => l.startsWith("+")).length;
                totalDeletions += hunk.lines.filter(l => l.startsWith("-")).length;
            }
        } catch { continue }
    }
    return { filesChanged: changedFiles, insertions: totalAdditions, deletions: totalDeletions }
}

// Mapping: TJz→calculateFileDiffBetweenMessages, A→messages, q→startMsgId, K→endMsgId,
//          Y→startIdx, z→endIdx, w→changedFiles, H→totalAdditions, $→totalDeletions,
//          _→msg, J→toolUseResult, X→hunk, D→addedLines, j→removedLines, jJq→isToolResultMessage
```

**What this computes:** For the messages from `startMsgId+1` to `endMsgId` (exclusive), accumulate all file changes from embedded `structuredPatch` data. This is the **same patch data** that Claude's Edit tool writes into messages — the diff is already computed and stored, not re-derived from file contents.

**Why two diff approaches?**
- `TJz` reads diff from stored `structuredPatch` in messages — fast, no filesystem access
- `DF4` with `isDryRun=true` reads actual file contents — slower but authoritative

The UI uses `TJz` for the **live preview** as the user scrolls through messages, since it must respond immediately. `DF4` dry-run is used for the **pre-restore confirmation** check (validates the actual files match expectations).

---

## 5. Restore Options Menu

```javascript
// ============================================
// generateRestoreOptions - Build restore action list
// Location: chunks.178.mjs:2356-2384
// ============================================

// ORIGINAL:
function g(J1) {
    let D1 = J1 ? [
        { value: "both", label: "Restore code and conversation" },
        { value: "conversation", label: "Restore conversation" },
        { value: "code", label: "Restore code" }
    ] : [
        { value: "conversation", label: "Restore conversation" }
    ];
    return D1.push({
        value: "summarize", label: "Summarize from here",
        type: "input", placeholder: "add context (optional)", initialValue: "",
        onChange: b, allowEmptySubmitToCancel: true,
        showLabelWithValue: true, labelValueSeparator: ": "
    }), D1.push({ value: "nevermind", label: "Never mind" }), D1
}

// READABLE:
function generateRestoreOptions(hasCodeChanges) {
    let options = hasCodeChanges
        ? [{ value: "both",         label: "Restore code and conversation" },
           { value: "conversation", label: "Restore conversation" },
           { value: "code",         label: "Restore code" }]
        : [{ value: "conversation", label: "Restore conversation" }];
    options.push({
        value: "summarize", label: "Summarize from here",
        type: "input",                       // renders an inline text input
        placeholder: "add context (optional)",
        initialValue: "",
        onChange: setSummarizeContext,        // updates m/summarizeContext state
        allowEmptySubmitToCancel: true,       // Enter on empty dismisses the input
        showLabelWithValue: true,
        labelValueSeparator: ": "
    });
    options.push({ value: "nevermind", label: "Never mind" });
    return options;
}

// Mapping: g→generateRestoreOptions, J1→hasCodeChanges, D1→options, b→setSummarizeContext
```

**Dynamic options based on file history:**
- `hasCodeChanges = checkRewindCapability(snapshot).canRewind` — if the checkpoint system is enabled AND this message has a snapshot
- If `hasCodeChanges = false` (e.g., no file edits between now and that message), "Restore code" options are hidden — only conversation restore is offered

**Summarize option with inline input:**
The "Summarize from here" option is special — it has `type: "input"` which renders an interactive text box within the menu item. The user can type optional context to guide the summary (e.g., "focus on the auth issue we found"). This context is passed as `userContext` to `Fa4`.

---

## 6. Restore Action Dispatch — `handleRestoreOptionSelected` (x)

```javascript
// ============================================
// handleRestoreOptionSelected - Dispatch restore/summarize based on choice
// Location: chunks.178.mjs:2413-2456
// ============================================

// ORIGINAL:
async function x(J1) {
    if (c("tengu_message_selector_restore_option_selected", { option: J1 }), !W) {
        O("Message not found."); return
    }
    if (J1 === "nevermind") { G(void 0); return }
    if (J1 === "summarize") {
        q(), T(!0), y("summarize"), O(void 0);
        try {
            let E1 = m.trim() || void 0;
            await z(W, E1), T(!1), y(null), G(void 0), w()
        } catch (E1) { K1(E1), T(!1), y(null), O(`Failed to summarize:\n${E1}`) }
        return
    }
    q(), T(!0), O(void 0);
    let D1 = null, Z1 = null;
    if (J1 === "code" || J1 === "both") try { await Y(W) } catch (E1) { D1 = E1, K1(D1) }
    if (J1 === "conversation" || J1 === "both") try { await K(W) } catch (E1) { Z1 = E1, K1(Z1) }
    if (T(!1), G(void 0), Z1 && D1) O(`Failed to restore the conversation and code:\n${Z1}\n${D1}`);
    else if (Z1) O(`Failed to restore the conversation:\n${Z1}`);
    else if (D1) O(`Failed to restore the code:\n${D1}`);
    else w()
}

// READABLE:
async function handleRestoreOptionSelected(selectedOption) {
    telemetry("tengu_message_selector_restore_option_selected", { option: selectedOption });
    if (!selectedMessage) { setErrorMessage("Message not found."); return; }
    if (selectedOption === "nevermind") { setSelectedMessage(undefined); return; }
    if (selectedOption === "summarize") {
        preRestoreCallback();
        setIsLoading(true); setLoadingAction("summarize"); setErrorMessage(undefined);
        try {
            let ctx = summarizeContext.trim() || undefined;
            await summarizeCallback(selectedMessage, ctx);
            setIsLoading(false); setLoadingAction(null); setSelectedMessage(undefined); closeCallback();
        } catch (e) {
            logError(e); setIsLoading(false); setLoadingAction(null);
            setErrorMessage(`Failed to summarize:\n${e}`);
        }
        return;
    }
    preRestoreCallback();
    setIsLoading(true); setErrorMessage(undefined);
    let codeError = null, convError = null;
    if (selectedOption === "code" || selectedOption === "both")
        try { await restoreCodeCallback(selectedMessage); } catch (e) { codeError = e; logError(e); }
    if (selectedOption === "conversation" || selectedOption === "both")
        try { await restoreMessageCallback(selectedMessage); } catch (e) { convError = e; logError(e); }
    setIsLoading(false); setSelectedMessage(undefined);
    if (convError && codeError) setErrorMessage(`Failed to restore the conversation and code:\n${convError}\n${codeError}`);
    else if (convError) setErrorMessage(`Failed to restore the conversation:\n${convError}`);
    else if (codeError) setErrorMessage(`Failed to restore the code:\n${codeError}`);
    else closeCallback();
}

// Mapping: x→handleRestoreOptionSelected, J1→selectedOption, W→selectedMessage,
//          G→setSelectedMessage, O→setErrorMessage, q→preRestoreCallback, T→setIsLoading,
//          y→setLoadingAction, m→summarizeContext, z→summarizeCallback, w→closeCallback,
//          Y→restoreCodeCallback, K→restoreMessageCallback, D1→codeError, Z1→convError
```

### Dispatch Decision Tree

```
selectedOption
├── "nevermind"      → setSelectedMessage(undefined)  [close option menu, back to list]
├── "summarize"      → preRestoreCallback()
│                       → setIsLoading(true, "summarize")
│                       → await summarizeCallback(msg, ctx)
│                       → on success: closeCallback()
│                       → on error: setErrorMessage(...)
├── "code"           → preRestoreCallback()
│                       → await restoreCodeCallback(msg)
│                       → if error: show code error
│                       → if success: closeCallback()
├── "conversation"   → preRestoreCallback()
│                       → await restoreMessageCallback(msg)
│                       → if error: show conv error
│                       → if success: closeCallback()
└── "both"           → preRestoreCallback()
                        → await restoreCodeCallback(msg)   [continue even if fails]
                        → await restoreMessageCallback(msg) [continue even if fails]
                        → show combined error if both fail, single error if one fails
                        → closeCallback() if both succeed
```

**Error isolation for "both":** Code and conversation restore are called **sequentially with independent error capture**. If code restore fails, conversation restore still runs. The final error message reflects which parts failed.

---

## 7. Message List Rendering

The scrollable message list renders each item with:
- A pointer indicator (`▶`) for the currently highlighted row
- A `MessagePreview` component (`GMq`) showing the message text, truncated to fit
- An optional diff stats line below each message:

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

The `VMq` component (`DiffStats`) renders the `+insertions -deletions` in green/red coloring.

**Warning message** at the bottom (shown when message is not yet selected):
- If double-Esc is pending: `"Press [key] again to exit"`
- Otherwise: `"Enter to continue · Esc to exit"`

---

## 8. Complete User Interaction Flow

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
   - selectedMessage = highlighted message
   - generateRestoreOptions(canRewind) builds the option menu

5. Option menu appears:
   ┌──────────────────────────────────────┐
   │  Restore code and conversation       │ ← if canRewind
   │  Restore conversation                │
   │  Restore code                        │ ← if canRewind
   │  Summarize from here: [           ]  │ ← with inline input
   │  Never mind                          │
   └──────────────────────────────────────┘

6a. "Restore code and conversation":
    - restoreCodeCallback → kP6 → DF4 (physical file restore)
    - restoreMessageCallback → slice messages, restore todos/permissions, re-inject prompt
    - closeCallback() → selector unmounts

6b. "Restore conversation":
    - restoreMessageCallback only (no file restore)
    - closeCallback()

6c. "Restore code":
    - restoreCodeCallback only (no conversation change)
    - closeCallback()

6d. "Summarize from here [user types context]":
    - summarizeCallback(msg, ctx) → Fa4 (targeted compaction)
    - New messages = [boundaryMarker, ...kept, ...summary, ...attachments]
    - Re-inject original prompt into input
    - Show notification: "Conversation summarized (Ctrl+O for history)"
    - closeCallback()

6e. "Never mind":
    - setSelectedMessage(undefined) → back to message list (step 3)

7. Any Esc press (when at message list, not option menu):
    - closeCallback() → selector unmounts, return to normal input
```

---

## 9. After Summarize: Input Re-Injection

After both summarize and conversation restore, the original prompt text from the selected message is re-injected into the input field. This uses `extractMessageContent` (`ZQ1`) which parses inline tags:

- `<bash-input>` tag → inject into bash mode
- `<SKILL_COMMAND_TAG>` (slash command) → inject with args into prompt mode
- Plain text → inject into prompt mode

This design means the user is immediately ready to re-send the message (perhaps with modifications), making the "try again with a different approach" workflow seamless.

---

---

## 10. Double-Esc Mechanism — `doubleKeyPressHandler` (iS)

```javascript
// ============================================
// doubleKeyPressHandler - 800ms window double-press tracker
// Location: chunks.73.mjs:2527-2544
// ============================================

// ORIGINAL (for source lookup):
function iS(A, q, K) {
    let Y = uo.useRef(0), z = uo.useRef(void 0),
        w = uo.useCallback(() => {
            if (z.current) clearTimeout(z.current), z.current = void 0
        }, []);
    return uo.useEffect(() => { return () => { w() } }, [w]),
    uo.useCallback(() => {
        let H = Date.now();
        if (H - Y.current <= GE7 && z.current !== void 0) w(), A(!1), q();
        else K?.(), A(!0), w(), z.current = setTimeout(() => {
            A(!1), z.current = void 0
        }, GE7);
        Y.current = H
    }, [A, q, K, w])
}

// READABLE (for understanding):
function doubleKeyPressHandler(setPendingState, onDoublePress, onFirstPress) {
    let lastPressTime = useRef(0),
        pendingTimeoutId = useRef(undefined),
        clearPending = useCallback(() => {
            if (pendingTimeoutId.current) {
                clearTimeout(pendingTimeoutId.current);
                pendingTimeoutId.current = undefined;
            }
        }, []);
    useEffect(() => () => clearPending(), [clearPending]);
    return useCallback(() => {
        let now = Date.now();
        if (now - lastPressTime.current <= DOUBLE_PRESS_WINDOW_MS && pendingTimeoutId.current !== undefined) {
            // Second press within window: execute action
            clearPending();
            setPendingState(false);
            onDoublePress();
        } else {
            // First press: start pending window
            onFirstPress?.();
            setPendingState(true);
            clearPending();
            pendingTimeoutId.current = setTimeout(() => {
                setPendingState(false);
                pendingTimeoutId.current = undefined;
            }, DOUBLE_PRESS_WINDOW_MS);
        }
        lastPressTime.current = now;
    }, [setPendingState, onDoublePress, onFirstPress, clearPending])
}

// Mapping: iS→doubleKeyPressHandler, A→setPendingState, q→onDoublePress, K→onFirstPress,
//          Y→lastPressTime, z→pendingTimeoutId, w→clearPending, GE7→DOUBLE_PRESS_WINDOW_MS (800ms)
```

**The 800ms window (`GE7 = 800`):** After the first Esc press, the UI shows `"Press [Esc] again to exit"`. If a second Esc arrives within 800ms, `onDoublePress()` fires (opens message selector or closes selector). After 800ms with no second press, `setPendingState(false)` resets the indicator silently.

This same mechanism is used for other double-key interactions in the app (e.g., double-Ctrl+C to force exit).

---

## 11. `isSelectableMessage` (Zc1) — Message Filter Logic

```javascript
// ============================================
// isSelectableMessage - Determine if a message appears in the rewind list
// Location: chunks.178.mjs:2836-2846
// ============================================

// ORIGINAL (for source lookup):
function Zc1(A) {
    if (A.type !== "user") return !1;
    if (Array.isArray(A.message.content) && A.message.content[0]?.type === "tool_result") return !1;
    if (zP6(A)) return !1;
    if (A.isMeta) return !1;
    let q = A.message.content,
        K = typeof q === "string" ? null : q[q.length - 1],
        Y = typeof q === "string" ? q.trim() : K && ZMq(K) ? K.text.trim() : "";
    if (Y.indexOf(`<${Pw1}>`) !== -1 || Y.indexOf(`<${ao1}>`) !== -1 ||
        Y.indexOf(`<${a98}>`) !== -1 || Y.indexOf(`<${s98}>`) !== -1 ||
        Y.indexOf(`<${NO}>`) !== -1  || Y.indexOf(`<${JC}>`) !== -1 ||
        Y.indexOf(`<${qJ}`) !== -1) return !1;
    return !0
}

// READABLE (for understanding):
function isSelectableMessage(message) {
    if (message.type !== "user") return false;                          // Only user messages
    if (Array.isArray(message.message.content)
        && message.message.content[0]?.type === "tool_result") return false;  // Skip tool feedback turns
    if (isCompactSummaryMessage(message)) return false;                // Skip compact boundary markers
    if (message.isMeta) return false;                                  // Skip meta/system messages
    // Extract last text block
    let content = message.message.content;
    let lastBlock = typeof content === "string" ? null : content[content.length - 1];
    let text = typeof content === "string" ? content.trim()
        : lastBlock && isTextBlock(lastBlock) ? lastBlock.text.trim() : "";
    // Skip messages containing internal XML tags
    if (text.includes(`<${TOOL_USE_TAG}>`) ||
        text.includes(`<${TOOL_RESULT_TAG}>`) ||
        text.includes(`<${THINKING_TAG}>`) ||
        text.includes(`<${SYSTEM_TAG}>`) ||
        text.includes(`<${COMPACT_MARKER_TAG}>`) ||
        text.includes(`<${SKILL_COMMAND_TAG}>`) ||
        text.includes(`<${COMMAND_TAG}`)) return false;
    return true
}

// Mapping: Zc1→isSelectableMessage, zP6→isCompactSummaryMessage, Pw1/ao1/a98/s98/NO/JC/qJ→internal XML tags
```

**What gets filtered out:**
| Excluded | Reason |
|----------|--------|
| `type !== "user"` | Assistant messages and system messages are not restore points |
| `content[0].type === "tool_result"` | Injected tool-result feedback turns (not user prompts) |
| Compact boundary markers | Compact summary separators — restoring to these would be confusing |
| `isMeta = true` | Internal session management messages not shown to user |
| Internal XML tags | System-generated messages containing `<tool_use>`, `<thinking>`, etc. |

---

## 12. Diff Stats Cache — useEffect Population

The `diffStatsCache` (`j1`) is populated asynchronously when the message list changes:

```javascript
// Location: chunks.178.mjs:2486-2507
// Inside RewindMessageSelector (fMq)

let [diffStatsCache, setDiffStatsCache] = useState({});

useEffect(() => {
    async function computeAllDiffStats() {
        if (!isFileHistoryEnabled) return;   // skip if checkpointing disabled
        Promise.all(filteredMessages.map(async (message, index) => {
            if (message.uuid !== currentMessageUuid) {
                let hasCheckpoint = snapshotExistsForMessage(fileHistory, message.uuid);
                let nextMessage = filteredMessages.at(index + 1);
                // Calculate diff from this message to the next (or to end if last)
                let stats = hasCheckpoint
                    ? calculateFileDiffBetweenMessages(
                          messages,
                          message.uuid,
                          nextMessage?.uuid !== currentMessageUuid ? nextMessage?.uuid : undefined
                      )
                    : undefined;
                setDiffStatsCache(prev => ({ ...prev, [index]: stats }));
            }
        }))
    }
    computeAllDiffStats();
}, [filteredMessages, messages, currentMessageUuid, fileHistory, isFileHistoryEnabled]);
```

**Design notes:**
- Runs as a **fire-and-forget `Promise.all`** (no `await` at the top level) — stats are populated progressively
- Indexed by **position in the filtered message list**, not by messageId
- Each entry computes the diff from `message[i]` to `message[i+1]` (not from all messages to the end), so it shows "what changed in this message's response", not cumulative
- The last message's diff range ends at the current state (no `endMessageId` passed)
- If a message has no checkpoint (`hasCheckpoint = false`), its diff entry is `undefined` → renders "⚠ No code restore"

---

## 13. `preRestoreCallback` — Cancel In-Progress Operations

Before any restore or summarize action, `preRestoreCallback` (`N11` / `onPreRestore`) is called. This is the app's **interrupt/cancel handler**:

```javascript
// chunks.188.mjs:328-340 — the onPreRestore callback is the general cancel handler
function onPreRestore() {
    if (currentDialog === "elicitation") return;   // Don't interrupt elicitation flows
    logDebug(`[onCancel] focusedInputDialog=${currentDialog} streamMode=${streamMode}`);
    isCancelling.current = false;
    clearToolQueue();
    if (currentDialog === "tool-permission")
        pendingToolApprovals[0]?.onAbort();
        clearPendingApprovals();
    else if (isRemoteMode) remoteSession.cancelRequest();
    else abortController?.abort();                 // Abort ongoing LLM request
    if (shouldClearQueuedCommands()) {
        syncTodosOnCancel(sessionId, updateAppState);
        clearAgentState();
        updateAppState(s => s.queuedCommands.length === 0 ? s : { ...s, queuedCommands: [] });
    }
}
```

**Effect on ongoing operations:**
1. If Claude is mid-stream (generating): `abortController.abort()` cancels the fetch
2. If a tool-permission dialog is open: `onAbort()` rejects the approval
3. If remote mode: `remoteSession.cancelRequest()` sends cancel to remote
4. Queued commands are cleared

This ensures a clean state before the restore takes effect — no half-finished LLM responses or dangling tool executions.

---

## 14. Summarize Request Template — `buildSummarizeRequest` (BL7)

The "Summarize from here" action sends a specially crafted message to the LLM. `BL7` (chunks.76.mjs:115-196) builds the prompt:

```
You will create a detailed summary of the conversation above. The summary must:

1. Capture user's explicit requests and intents chronologically
2. Document technical concepts examined (files, code sections, error messages)
3. List errors encountered and how they were fixed
4. Outline pending tasks from the most recent Todo list
5. Describe the current state of the work
6. Include next steps if mentioned

[If additionalInstructions provided]:
Additional Instructions:
{userContext}

IMPORTANT: Do NOT use any tools. You MUST respond with ONLY the
<summary>...</summary> block as your text output.
```

The `<summary>` tag constraint forces the LLM output into a parseable format. After `Fa4` runs, the summary text is extracted from between the tags and stored as the replacement message.

**Why user context matters:** The optional context the user types into the "Summarize from here" input box is appended as `"Additional Instructions: {ctx}"`. This lets users direct what the summary focuses on — e.g., "focus on the database schema decisions" will cause the LLM to weight those parts of the conversation more heavily in the summary.

---

## 15. `extractMessageContent` (ZQ1) — Input Re-injection Parser

```javascript
// ============================================
// extractMessageContent - Extract text content for input re-injection
// Location: chunks.173.mjs:377-386
// ============================================

// ORIGINAL (for source lookup):
function ZQ1(A) {
    if (A.type !== "user") return null;
    let q = A.message.content;
    return J51(q)
}
function J51(A) {
    if (typeof A === "string") return A;
    if (Array.isArray(A)) return A.filter((q) => q.type === "text").map((q) => q.type === "text" ? q.text : "").join("\n").trim() || null;
    return null
}

// READABLE (for understanding):
function extractMessageContent(message) {
    if (message.type !== "user") return null;
    return extractTextBlocks(message.message.content)
}
function extractTextBlocks(content) {
    if (typeof content === "string") return content;
    if (Array.isArray(content))
        return content.filter(b => b.type === "text").map(b => b.text).join("\n").trim() || null;
    return null
}

// Mapping: ZQ1→extractMessageContent, J51→extractTextBlocks
```

**Content multi-format handling:**
- `string`: The entire content is the text
- `ContentBlock[]`: Filter for `{type: "text"}` blocks, join with newlines (strips `{type: "image"}`, `{type: "tool_result"}` blocks)

After extraction, the caller (`onRestoreMessage` / `onSummarize`) looks for inline tags:
- `<bash-input>content</bash-input>` → inject into bash mode
- `<SKILL_COMMAND_TAG>cmd</SKILL_COMMAND_TAG>` with optional `<command-args>` → inject as skill/slash command
- Plain text → inject into normal prompt mode

This means the user's original input — including bash commands and slash commands — is faithfully restored into the input field after a rewind.

---

---

## 16. Three Restore Modes — Conditional Rendering and Mode-Specific Descriptions

The restore UI has **two visual phases** after a message is selected:

### Phase 1: Message List (before selection)
Scrollable list of user prompts, each row showing diff stats. Pressing Enter advances to Phase 2.

### Phase 2: Restore Options (after selection)
The `kA` component (`RestoreOptionSelector`) renders a radio-style list. The options it shows depend on `t` (`hasCodeChanges`):

```javascript
// ============================================
// RestoreOptionSelector rendering
// Location: chunks.178.mjs:2553-2559
// ============================================

// ORIGINAL (for source lookup):
N && k === "summarize" ? vA.createElement(I, {
    flexDirection: "row", gap: 1
}, vA.createElement(c4, null), vA.createElement(V, null, "Summarizing…"))
: vA.createElement(kA, {
    isDisabled: N,
    options: g(!!t),
    defaultFocusValue: t ? "both" : "conversation",
    onFocus: (J1) => S(J1),
    onChange: (J1) => x(J1),
    onCancel: () => G(void 0)
})

// READABLE (for understanding):
isLoading && loadingAction === "summarize"
  ? createElement(Box, { flexDirection: "row", gap: 1 },
        createElement(Spinner, null),
        createElement(Text, null, "Summarizing…"))
  : createElement(RestoreOptionSelector, {
        isDisabled: isLoading,                    // grayed-out during code/conv restore
        options: generateRestoreOptions(!!hasCodeChanges),
        defaultFocusValue: hasCodeChanges ? "both" : "conversation",
        onFocus: (value) => setRestoreMode(value),   // visual-only, tracks hovered option
        onChange: (value) => handleRestoreOptionSelected(value),
        onCancel: () => setSelectedMessage(undefined)
    })

// Mapping: N→isLoading, k→loadingAction, c4→Spinner, kA→RestoreOptionSelector,
//          t→hasCodeChanges, S→setRestoreMode, x→handleRestoreOptionSelected, G→setSelectedMessage
```

### Mode-Specific Inline Descriptions

When an option is focused, an inline description appears **above the option list**:

```javascript
// ============================================
// ModeDescription - Context line above the option selector
// Location: chunks.178.mjs:2540-2549
// ============================================

// ORIGINAL (for source lookup):
B === "summarize"
  ? vA.createElement(V, { dimColor: !0 }, "Messages after this point will be summarized.")
  : B === "both" || B === "conversation"
  ? vA.createElement(V, { dimColor: !0 }, "The conversation will be forked.")
  : vA.createElement(V, { dimColor: !0 }, "The conversation will be unchanged."),

B !== "summarize" && (
  t && (B === "both" || B === "code")
    ? vA.createElement(NJz, { diffStatsForRestore: f })
    : vA.createElement(V, { dimColor: !0 }, "The code will be unchanged.")
)

// READABLE (for understanding):
// Line 1: Conversation effect description
restoreMode === "summarize"
  ? <Text dimColor>Messages after this point will be summarized.</Text>
  : restoreMode === "both" || restoreMode === "conversation"
  ? <Text dimColor>The conversation will be forked.</Text>
  : <Text dimColor>The conversation will be unchanged.</Text>

// Line 2: Code effect description (only if not "summarize")
if (restoreMode !== "summarize") {
  hasCodeChanges && (restoreMode === "both" || restoreMode === "code")
    ? <RestoreDiffStats diffStatsForRestore={selectedMessageDiffStats} />
    : <Text dimColor>The code will be unchanged.</Text>
}

// Mapping: B→restoreMode, t→hasCodeChanges, f→selectedMessageDiffStats,
//          NJz→RestoreDiffStats, V→Text
```

### Complete Mode × Description Matrix

| Mode focused | Conversation description | Code description |
|---|---|---|
| **`both`** | "The conversation will be forked." | `<RestoreDiffStats>` (shows exact file+line counts) |
| **`conversation`** | "The conversation will be forked." | "The code will be unchanged." |
| **`code`** | "The conversation will be unchanged." | `<RestoreDiffStats>` |
| **`summarize`** | "Messages after this point will be summarized." | *(hidden)* |
| **`nevermind`** | "The conversation will be unchanged." | "The code will be unchanged." |

**"Forked" vs "Unchanged":**
"The conversation will be forked" appears when the conversation history will actually change (mode `both` or `conversation`). "Unchanged" appears when conversation will stay as-is (mode `code` or `nevermind`). This terminology aligns with the official docs' framing of "branch off and try a different approach."

### `RestoreDiffStats` (NJz) — Pre-Restore Diff Preview

When the diff stats block is shown (mode = `both` or `code`, file history enabled), the `NJz` component reads the `f` (`selectedMessageDiffStats`) which was computed by `checkRewindCapability` (mMq) dry-run:

```javascript
// f is set via useEffect that calls mMq() in dry-run mode:
useEffect(() => {
    if (!W) { setDiffStats(undefined); return; }
    let messageId = W.uuid;
    mMq(messageId, appState, updateState, true).then(result => {
        setDiffStats(result);        // {canRewind, filesChanged, insertions, deletions}
    });
}, [W]);   // re-runs whenever selectedMessage changes
```

This means when the user first selects a message, `checkRewindCapability` is called in **dry-run mode** to compute the exact diff. This result powers both:
1. The `t` (`hasCodeChanges`) flag — determines which options to show
2. The `NJz` (`RestoreDiffStats`) component — shows `+N -M` counts per file

---

## 17. Full UI Layout — Complete Render Tree

The `RewindMessageSelector` renders as a vertical flex column:

```
┌─────────────────────────────────────────────────────┐
│  Rewind                    ← bold, "suggestion" color│
│  Error: [message]          ← red, only if errorMessage set
├─────────────────────────────────────────────────────┤
│  [PHASE 1: No message selected]                      │
│                                                      │
│    msg_0  fix auth bug in login.ts                   │
│           auth.ts +12 -3                             │
│                                                      │
│  ▶ msg_1  refactor db connection pool   ← selected  │
│           db.ts +45 -22, pool.ts +18 -5              │
│                                                      │
│    msg_2  add error handling for timeouts            │
│           api.ts +8 -0                               │
│                                                      │
│  Enter to continue · Esc to exit       ← italic dim  │
│  (or: "Press Esc again to exit"  when Esc pending)  │
├─────────────────────────────────────────────────────┤
│  [PHASE 2: Message selected, W is set]               │
│                                                      │
│  ┌──── selected message preview ───────────────┐    │
│  │  refactor db connection pool                │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  The conversation will be forked.      ← dim        │
│  db.ts +45 -22, pool.ts +18 -5         ← RestoreDiffStats
│                                                      │
│  ► Restore code and conversation        ← highlighted│
│    Restore conversation                              │
│    Restore code                                      │
│    Summarize from here: [____________]  ← input box │
│    Never mind                                        │
│                                                      │
│  ⚠ Rewinding does not affect files    ← dim warning │
│    edited manually or via bash.                      │
└─────────────────────────────────────────────────────┘
```

**Conditional elements:**
- `Error:` line → shown only if `errorMessage` is set (red text)
- Diff stats row per message → only if `isFileHistoryEnabled && hasDiffStats[i]`
- Message row height → 3 lines if file history enabled, else 2 lines
- "Restore code" options → only if `hasCodeChanges`; else only "Restore conversation" shown
- `RestoreDiffStats` → only for modes `both`/`code` with `hasCodeChanges`
- Warning banner → only if `hasCodeChanges`
- `Summarizing…` spinner → replaces option selector when `isLoading && loadingAction === "summarize"`
- "Enter to continue" hint → hidden if `errorMessage` or `!hasMultipleMessages`

---

## 18. Selector Title and Header Structure

```javascript
// ============================================
// Header rendering
// Location: chunks.178.mjs:2518-2525
// ============================================

// ORIGINAL (for source lookup):
vA.createElement(V, { bold: !0, color: "suggestion" }, "Rewind"),
$ && vA.createElement(vA.Fragment, null,
    vA.createElement(V, { color: "error" }, "Error: ", $)
),

// READABLE (for understanding):
createElement(Text, { bold: true, color: "suggestion" }, "Rewind"),
errorMessage && createElement(Fragment, null,
    createElement(Text, { color: "error" }, "Error: ", errorMessage)
)

// Mapping: V→Text, $→errorMessage
```

The header is always "**Rewind**" in bold suggestion-color (cyan). Errors are displayed immediately below in red.

---

## 19. Warning Reminder — "Does Not Affect Manually Edited Files"

```javascript
// ============================================
// FileHistoryWarning - Bash/manual edit caveat
// Location: chunks.178.mjs:2560-2565
// ============================================

// ORIGINAL (for source lookup):
t && vA.createElement(I, { marginBottom: 1 },
    vA.createElement(V, { dimColor: !0 },
        l1.warning, " Rewinding does not affect files edited manually or via bash."))

// READABLE (for understanding):
hasCodeChanges && createElement(Box, { marginBottom: 1 },
    createElement(Text, { dimColor: true },
        symbols.warning, " Rewinding does not affect files edited manually or via bash."))

// Mapping: t→hasCodeChanges, l1.warning→symbols.warning (⚠), I→Box, V→Text
```

**When shown:** Only when `hasCodeChanges = true` (file history enabled AND the selected message has a snapshot with actual file changes). The `⚠` symbol is rendered via `symbols.warning` from the icons module.

**When NOT shown:**
- `fileCheckpointingEnabled = false` → `hasCodeChanges` is always false
- Selected message has no code changes (docs-only edit session, etc.)
- User is hovering on "Never mind" or "conversation"-only modes (warning still shows — it's tied to `hasCodeChanges`, not to the current mode selection)

**Position:** Rendered **after** the option selector, with `marginBottom: 1` spacing.

---

## 20. `fileCheckpointingEnabled = false` — Full UI Changes

When `isFileHistoryEnabled` (`_`) is false, the UI degrades gracefully:

```javascript
// Title changes (chunks.178.mjs:2526-2527):
isFileHistoryEnabled
  ? "Restore the code and/or conversation to the point before…"
  : "Restore and fork the conversation to the point before…"

// Message row height (chunks.178.mjs:2576):
height: isFileHistoryEnabled ? 3 : 2   // no diff stats row when disabled

// Default focus (chunks.178.mjs:2557):
defaultFocusValue: hasCodeChanges ? "both" : "conversation"
// → always "conversation" when disabled (hasCodeChanges = _ && ... = false)

// Options shown (chunks.178.mjs:2356-2384):
hasCodeChanges = false → only shows: [Restore conversation, Summarize from here, Never mind]
// "Restore code and conversation" and "Restore code" are hidden
```

Summary of UI changes when disabled:

| Element | Enabled | Disabled |
|---------|---------|---------|
| Title | "Restore the code and/or conversation…" | "Restore and fork the conversation…" |
| Row height | 3 (message + diff stats) | 2 (message only) |
| Code options | Shown if `hasCodeChanges` | Always hidden |
| Default focus | "both" (if changes) | Always "conversation" |
| Warning banner | Shown if `hasCodeChanges` | Always hidden |
| Diff stats preview | Shown per row | Always hidden |
| Subtitle line 2 | RestoreDiffStats or "unchanged" | "The code will be unchanged." |

---

## 21. Post-Restore Notifications — Mode-by-Mode

| Mode | Notification shown? | Message |
|------|---------------------|---------|
| `both` | ❌ No | — |
| `conversation` | ❌ No | — |
| `code` | ❌ No | — |
| `summarize` | ✅ Yes (8s) | `"Conversation summarized ({Ctrl+O} for history)"` |

Only the summarize action shows a notification. Code/conversation restores close the selector silently (`closeCallback()` → `setShowMessageSelector(false)`).

**The summarize notification:**

```javascript
// chunks.188.mjs:1382-1387
let transcriptKey = getKeybinding("app:toggleTranscript", "Global", "ctrl+o");
showNotification({
    key: "summarize-ctrl-o-hint",
    text: `Conversation summarized (${transcriptKey} for history)`,
    priority: "medium",
    timeoutMs: 8000   // 8 seconds auto-dismiss
})
```

The `Ctrl+O` hint is dynamic — it reads the actual keybinding for `app:toggleTranscript`. If the user has rebound it, the correct key is shown. The notification hints that the original messages are still accessible via the transcript view (Ctrl+O), reassuring users that summarize is not destructive in terms of viewing history.

---

## 22. Modal / Dialog Mounting

The `RewindMessageSelector` is not rendered in a dedicated modal layer. It's mounted conditionally based on the `focusedDialog` value returned by the dialog arbitration function `f11()`.

### Dialog Arbitration — `f11()` (dialogArbiter)

```javascript
// ============================================
// dialogArbiter - Single source of truth for which dialog is shown
// Location: chunks.188.mjs:304-317
// ============================================

// ORIGINAL (for source lookup):
function f11() {
    if (s_ || fz) return;
    if (o_) return "message-selector";
    if (W$) return;
    if (oq[0]) return "sandbox-permission";
    let k6 = !vK || vK.shouldContinueAnimation;
    if (k6 && F7[0]) return "tool-permission";
    if (k6 && Z1.queue[0]) return "worker-sandbox-permission";
    if (k6 && E1.queue[0]) return "elicitation";
    if (k6 && Yx) return "cost";
    if (k6 && k1) return "ide-onboarding";
    if (k6 && w6) return "lsp-recommendation";
}

// READABLE (for understanding):
function dialogArbiter() {
    if (isLoading || isError) return undefined;           // [1] loading/error blocks ALL dialogs
    if (showMessageSelector) return "message-selector";   // [2] rewind selector: 2nd priority
    if (isStreaming) return undefined;                    // [3] streaming blocks remaining
    if (sandboxPermissionQueue[0]) return "sandbox-permission"; // [4]
    let animationSettled = !animationState || animationState.shouldContinueAnimation;
    if (animationSettled && toolPermissionQueue[0]) return "tool-permission";        // [5]
    if (animationSettled && workerSandboxQueue[0]) return "worker-sandbox-permission"; // [6]
    if (animationSettled && elicitationQueue[0]) return "elicitation";               // [7]
    if (animationSettled && showCostDialog) return "cost";                           // [8]
    if (animationSettled && showIdeOnboarding) return "ide-onboarding";              // [9]
    if (animationSettled && showLspRecommendation) return "lsp-recommendation";      // [10]
}

// Mapping: f11→dialogArbiter, s_→isLoading, fz→isError, o_→showMessageSelector,
//          W$→isStreaming, oq→sandboxPermissionQueue, k6→animationSettled,
//          vK→animationState, F7→toolPermissionQueue, Z1→workerSandboxQueue,
//          E1→elicitationQueue, Yx→showCostDialog, k1→showIdeOnboarding, w6→showLspRecommendation
```

### Priority Order Table

| Priority | Return Value | Condition | Notes |
|----------|-------------|-----------|-------|
| 1 | `undefined` | `isLoading || isError` | Blocks all dialogs — no interaction possible |
| 2 | `"message-selector"` | `showMessageSelector` | **Rewind UI** — highest interactive priority |
| 3 | `undefined` | `isStreaming` | Streaming response — only sandbox-permission allowed |
| 4 | `"sandbox-permission"` | `sandboxPermissionQueue[0]` | Active even during streaming |
| 5 | `"tool-permission"` | `toolPermissionQueue[0]` | Only shown when animation settled |
| 6 | `"worker-sandbox-permission"` | `workerSandboxQueue[0]` | Worker sandbox permission prompt |
| 7 | `"elicitation"` | `elicitationQueue[0]` | Elicitation request from tool |
| 8 | `"cost"` | `showCostDialog` | Cost confirmation dialog |
| 9 | `"ide-onboarding"` | `showIdeOnboarding` | First-time IDE setup |
| 10 | `"lsp-recommendation"` | `showLspRecommendation` | LSP install suggestion |

**Key insight for rewind**: Position #2 (after loading/error check) means the message selector will suppress tool-permission and elicitation dialogs. If the user triggers rewind in the middle of a pending tool approval, the tool approval is temporarily hidden until the selector closes. This is intentional — it prevents double-modals and keeps the UI interaction model clean.

### Conditional Render

```javascript
// chunks.188.mjs (render section)
currentDialog === "message-selector" && createElement(RewindMessageSelector, {
    messages: messageList,
    onPreRestore: handlePreRestore,       // N11 — abort LLM + clear tool queue
    onRestoreCode: async (msg) => { /* kP6 rewindHandler */ },
    onSummarize: async (msg, ctx) => { /* Fa4 summarizationEngineFunction */ },
    onRestoreMessage: async (msg) => { /* slice + set messages */ },
    onClose: () => setShowMessageSelector(false)
})
```

### Opening Guard

```javascript
// chunks.188.mjs:476-478
openMessageSelector: () => {
    if (!showingConfirmation) setShowMessageSelector(true)
}
```

The guard `!showingConfirmation` prevents opening the selector during an active confirmation dialog (e.g., when a tool permission is awaiting approval). Note: `showingConfirmation` is distinct from `sandboxPermissionQueue` — it refers to the generic yes/no confirmation dialog (`confirm:yes`/`confirm:no` keypresses).

---

## 23. `bE6()` / `randomUUID()` After Restore — Why a New UUID?

After `onRestoreMessage`, a new random UUID is generated:

```javascript
// chunks.188.mjs:1393
setMessages([...messagesToRestore]);
setRewindState(randomUUID());   // E5(bE6())
```

`E5` is `setRewindState` — a state setter tied to a "rewind marker" UUID. This UUID serves as a **cache invalidation key**: any downstream hooks or memoized values that depend on the rewind state will re-compute when this UUID changes.

This is necessary because `setMessages` and the rewind state may not trigger re-computation of all cached values (e.g., derived conversation statistics, token counts). The new UUID guarantees a clean slate for all listeners.

---

## 24. `$K1` / `syncTodosToStorage` After Conversation Restore

```javascript
// chunks.88.mjs:278-280
function syncTodosToStorage(todosArray, sessionId) {
    writeToFile(todosArray, getSessionFilePath(sessionId));
    refreshAppState();
}
```

Called as `$K1(selectedMessage.todos ?? [], currentSessionId)` in `onRestoreMessage`. This writes the restored todo list back to the session's `{sessionId}-agent.json` file so that the todo state persists correctly even if the app is closed immediately after the restore. Without this call, the in-memory todo state would be correct but the on-disk state would still reflect the newer (post-restore) todos.

---

## 25. Phase 1 Enter Callback — `U()` (messageSelectionCallback)

When the user presses `Enter` in Phase 1 (the message list), the `U()` callback is invoked. This is the critical branching point that determines whether Phase 2 (restore options menu) is shown, or whether the restore happens directly.

```javascript
// ============================================
// messageSelectionCallback - Phase 1 Enter handler in RewindMessageSelector
// Location: chunks.178.mjs:2388-2412
// ============================================

// ORIGINAL (for source lookup):
async function U(J1) {
    let D1 = A.indexOf(J1),
        Z1 = A.length - 1 - D1;
    if (c("tengu_message_selector_selected", {
            index_from_end: Z1,
            message_type: J1.type,
            is_current_prompt: false
        }),
        !A.includes(J1)) {
        w();
        return
    }
    if (_) {
        G(J1);
        let E1 = RP6(H, J1.uuid);
        Z(E1)
    } else {
        q(), T(true);
        try {
            await K(J1), T(false), w()
        } catch (E1) {
            K1(E1), T(false), O(`Failed to restore the conversation:\n${E1}`)
        }
    }
}

// READABLE (for understanding):
async function messageSelectionCallback(selectedMessage) {
    let selectedIndex = messages.indexOf(selectedMessage),
        indexFromEnd = messages.length - 1 - selectedIndex;

    // Always fire telemetry on Enter (before validity check)
    trackEvent("tengu_message_selector_selected", {
        index_from_end: indexFromEnd,
        message_type: selectedMessage.type,
        is_current_prompt: false
    });

    // Guard: message may have been removed between render and press
    if (!messages.includes(selectedMessage)) {
        closeSelector();
        return;
    }

    if (isFileHistoryEnabled) {
        // Path A: fileHistory ON → show Phase 2 (restore options)
        setSelectedMessage(selectedMessage);                          // G(J1)
        let dryRunStats = getDryRunDiffStats(fileHistory, selectedMessage.uuid); // RP6(H, J1.uuid)
        setDiffStats(dryRunStats);                                    // Z(E1)
    } else {
        // Path B: fileHistory OFF → skip Phase 2, restore conversation directly
        resetRestoreState();                                          // q()
        setIsLoading(true);                                           // T(true)
        try {
            await onRestoreMessage(selectedMessage);                  // K(J1)
            setIsLoading(false);
            closeSelector();
        } catch (error) {
            logError(error);
            setIsLoading(false);
            setErrorMessage(`Failed to restore the conversation:\n${error}`);
        }
    }
}

// Mapping: U→messageSelectionCallback, J1→selectedMessage, A→messages, D1→selectedIndex,
//          Z1→indexFromEnd, c→trackEvent, w→closeSelector, _→isFileHistoryEnabled,
//          G→setSelectedMessage, E1→(dryRunStats | error), RP6→getDryRunDiffStats,
//          H→fileHistory, Z→setDiffStats, q→resetRestoreState, T→setIsLoading,
//          K→onRestoreMessage, K1→logError, O→setErrorMessage
```

### Two-Path Decision Tree

```
User presses Enter on a message
         │
         ▼
  Fire telemetry event
  "tengu_message_selector_selected"
         │
         ▼
  message in list? ──No──► closeSelector()
         │
        Yes
         │
         ▼
  isFileHistoryEnabled?
    │             │
   Yes            No
    │             │
    ▼             ▼
  setSelectedMessage    resetState + setLoading(true)
  getDryRunDiffStats    await onRestoreMessage(msg)
  setDiffStats          setLoading(false) + closeSelector()
  → Phase 2 shown       [on error: setErrorMessage]
```

### Why `RP6` (getDryRunDiffStats) is called here

When transitioning from Phase 1 → Phase 2, `RP6` runs `DF4` with `isDryRun=true` against the `fileHistory` state. This pre-computes the diff stats that will be displayed in Phase 2's `RestoreDiffStats` component (`NJz`). The result is stored in the `diffStats` state variable (`f, Z`) so Phase 2 can render immediately without an async delay.

This is different from the `diffStatsCache` in the message list (§12), which pre-loads stats for all messages while the user is browsing. By the time the user presses Enter, the stats should already be cached — but `RP6` provides the authoritative result for the selected message's Phase 2 view.

### When `fileCheckpointingEnabled = false`

When file checkpointing is disabled (`isFileHistoryEnabled = false`), the selector skips Phase 2 entirely and calls `onRestoreMessage` directly. In this mode:
- No diff stats are shown (no file changes tracked)
- The restore options menu is never displayed
- The selector acts as a pure **conversation rewind** picker
- The only available action is "Restore conversation" (silently, no options to choose from)

This is consistent with the broader behavior when `fileCheckpointingEnabled = false` (see §20).

---

## See Also

- [35_rewind/overview.md](./overview.md) - Architecture and design rationale
- [35_rewind/implementation.md](./implementation.md) - Core algorithms and code analysis
- [07_compact/](../07_compact/) - The Fa4 function shared between /compact and Summarize
- [02_ui/](../02_ui/) - Ink/React terminal rendering pipeline
- [09_slash_command/](../09_slash_command/) - Slash command registration
