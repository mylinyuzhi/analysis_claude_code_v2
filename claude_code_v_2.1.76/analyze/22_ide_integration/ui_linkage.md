# IDE Integration UI Linkage (Claude Code 2.1.76)

## Overview

This document covers all UI components and React hooks that connect the IDE integration layer to the visible Claude Code interface. The IDE integration surfaces in five places: the status bar selection indicator, the diff display routing, the onboarding dialog, status notifications, and the IDEOnboardingDialog dialog triggered from the priority dialog system.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - IDE Integration, UI Components
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP)

Key UI symbols in this document:
- `IdeSelectionIndicator` (dIq) - Status bar "⧉ N lines selected" badge (chunks.191.mjs:7)
- `getIdeConnectionStatus` (LV6) - React hook returning "connected"/"disconnected"/null (chunks.190.mjs:2902)
- `IDEDiffHandler` (pSq) - React component orchestrating IDE diff vs terminal diff routing
- `IDEOnboardingDialog` (Nx7) - First-run onboarding dialog component
- `useIdeStatusMonitoring` (dLq) - Hook producing 4 IDE-related notifications
- `REPL` (TUA) - Main component that wires all IDE hooks together

> **Note:** Previous documentation incorrectly mapped `FWq` to IdeSelectionIndicator and `Rf1` to getIdeConnectionStatus. The correct symbols are `dIq` and `LV6` respectively. Also, `fVq` was incorrectly mapped to useIdeSelection - `fVq` in chunks.178.mjs:729 is a module initializer for tool display names.

---

## Component Map

```
REPL (TUA) [chunks.188.mjs]
  │
  ├─ (selection tracking via MCP notifications)
  │    └─ updates ideSelection state
  │
  ├─ dLq (useIdeStatusMonitoring)       → calls addNotification()
  │    └─ 4 effects: hint / disconnected / jetbrains / install-error
  │
  ├─ Fx7 (handleIdeAutoInstallation)    → sets installStatus, calls onboarding
  │    ├─ HD9 (installIdeExtension)
  │    └─ Ex7 (waitForIdeConnection)   → updates dynamic MCP config
  │
  ├─ Header [chunks.188.mjs:1063]
  │    └─ dIq (IdeSelectionIndicator)  → renders "⧉ 3 lines selected"
  │
  ├─ DialogsOverlay [chunks.188.mjs:1068]
  │    └─ "ide-onboarding" → Nx7 (IDEOnboardingDialog)
  │
  └─ EditTool rendering
       └─ pSq (IDEDiffHandler)         → calls openDiffInIde or terminal diff
```

---

## 1. Status Bar: IDE Selection Indicator

### Component: `IdeSelectionIndicator` (dIq)

**Location:** `chunks.191.mjs:7-42`

**Rendered inside:** The right-side status bar area.

```javascript
// ============================================
// IdeSelectionIndicator - IDE context badge in status bar
// Location: chunks.191.mjs:7-42
// ============================================

// ORIGINAL (for source lookup):
function dIq(A) {
    let q = A6(7), { ideSelection: K, mcpClients: Y } = A,
        { status: z } = LV6(Y),
        _ = z === "connected" && (K?.filePath || K?.text && K.lineCount > 0);
    if (z === null || !_ || !K) return null;
    if (K.text && K.lineCount > 0) {
        let w = K.lineCount === 1 ? "line" : "lines";
        return fa6.createElement(T, { color: "ide" }, "⧉ ", K.lineCount, " ", w, " selected");
    }
    if (K.filePath) {
        return fa6.createElement(T, { color: "ide" }, "⧉ In ", basename(K.filePath));
    }
}

// READABLE (for understanding):
function IdeSelectionIndicator({ ideSelection, mcpClients }) {
    let { status } = getIdeConnectionStatus(mcpClients); // "connected" | "disconnected" | null
    let hasActiveContent = status === "connected" &&
        (ideSelection?.filePath || (ideSelection?.text && ideSelection.lineCount > 0));

    if (status === null || !hasActiveContent || !ideSelection) return null;

    // Priority 1: Text selected → show line count
    if (ideSelection.text && ideSelection.lineCount > 0) {
        let unit = ideSelection.lineCount === 1 ? "line" : "lines";
        return <Text color="ide">⧉ {ideSelection.lineCount} {unit} selected</Text>;
    }
    // Priority 2: Cursor in file → show filename
    if (ideSelection.filePath) {
        return <Text color="ide">⧉ In {basename(ideSelection.filePath)}</Text>;
    }
}

// Mapping: dIq→IdeSelectionIndicator, LV6→getIdeConnectionStatus, A6→useMemoArray,
//          K→ideSelection, Y→mcpClients, z→status, T→Text, fa6→React
```

**State machine:**
```
status = null           → render nothing (no IDE configured)
status = "disconnected" → render nothing (IDE was configured but disconnected)
status = "connected" AND no active content → render nothing
status = "connected" AND lineCount > 0 → "⧉ 3 lines selected"
status = "connected" AND filePath only → "⧉ In myfile.ts"
```

**Why `color: "ide"`:** The IDE context badge uses a distinct "ide" color theme (typically blue/cyan) to visually distinguish it from other status bar elements, signaling to users that Claude Code is "seeing" their IDE context.

### Hook: `getIdeConnectionStatus` (LV6)

**Location:** `chunks.190.mjs:2902`

```javascript
// ============================================
// getIdeConnectionStatus - Memoized IDE connection state hook
// Location: chunks.190.mjs:2902
// ============================================

// READABLE (for understanding):
function getIdeConnectionStatus(mcpClients) {
    return useMemo(() => {
        let ideClient = mcpClients?.find(c => c.name === "ide");
        if (!ideClient) return { status: null, ideName: null };
        return {
            status: ideClient.type === "connected" ? "connected" : "disconnected",
            ideName: ideClient.ideKind ?? null
        };
    }, [mcpClients]);
}

// Mapping: LV6→getIdeConnectionStatus
```

---

## 2. Edit Tool: IDE Diff Routing

### Component: `IDEDiffHandler` (pSq)

**Location:** `chunks.188.mjs:880-940`

This component orchestrates diff display routing. It decides whether to show the diff in the IDE (via MCP `openDiff` tool) or fall back to terminal rendering.

```javascript
// ============================================
// IDEDiffHandler - Routes diff display to IDE or terminal
// Location: chunks.188.mjs:880-940
// ============================================

// ORIGINAL (for source lookup):
function pSq({
    onChange: A,
    toolUseContext: q,
    filePath: K,
    edits: Y,
    editMode: z
}) {
    let _ = gi.useRef(!1),
        [w, O] = gi.useState(!1),
        $ = gi.useMemo(() => NPz().slice(0, 6), []),
        H = gi.useMemo(() => `✻ [Claude Code] ${VPz(K)} (${$}) ⧉`, [K, $]),
        j = L$1(q.options.mcpClients) && X1().diffTool === "auto" && !K.endsWith(".ipynb"),
        J = R$1(q.options.mcpClients) ?? "IDE";
    async function M() {
        if (!j) return;
        try {
            d("tengu_ext_will_show_diff", {});
            let {
                oldContent: D,
                newContent: X
            } = await EPz(K, Y, q, H);
            if (_.current) return;
            d("tengu_ext_diff_accepted", {});
            let P = kPz(K, D, X, z);
            if (P.length === 0) {
                d("tengu_ext_diff_rejected", {});
                let W = Gv(q.options.mcpClients);
                if (W) await Cs8(H, W);
                A({
                    type: "reject"
                }, {
                    file_path: K,
                    edits: Y
                });
                return
            }
            A({
                type: "accept-once"
            }, {
                file_path: K,
                edits: P
            })
        } catch (D) {
            _6(D), O(!0)
        }
    }
    return gi.useEffect(() => {
        return M(), () => {
            _.current = !0
        }
    }, []), {
        closeTabInIDE() {
            let D = Gv(q.options.mcpClients);
            if (!D) return Promise.resolve();
            return Cs8(H, D)
        },
        showingDiffInIDE: j && !w,
        ideName: J,
        hasError: w
    }
}

// READABLE (for understanding):
function IDEDiffHandler({ onChange, toolUseContext, filePath, edits, editMode }) {
    let cleanupRef = useRef(false);
    let [hasError, setHasError] = useState(false);

    // Generate stable unique 6-char ID to prevent tab name collisions
    let tabId = useMemo(() => generateRandomId().slice(0, 6), []);
    let tabName = useMemo(
        () => `✻ [Claude Code] ${basename(filePath)} (${tabId}) ⧉`,
        [filePath, tabId]
    );

    // Enable IDE diff only when: IDE connected + diffTool=auto + not Jupyter notebook
    let useIdeDiff = hasConnectedIde(toolUseContext.options.mcpClients)
        && getSettings().diffTool === "auto"
        && !filePath.endsWith(".ipynb");

    let ideName = getIdeName(toolUseContext.options.mcpClients) ?? "IDE";

    async function showDiffAndHandleResponse() {
        if (!useIdeDiff) return; // IDE diff not available → terminal handles it

        try {
            logEvent("tengu_ext_will_show_diff");
            let { oldContent, newContent } = await openDiffInIde(filePath, edits, toolUseContext, tabName);

            if (cleanupRef.current) return; // Component unmounted

            logEvent("tengu_ext_diff_accepted");
            let finalEdits = computeDiffEdits(filePath, oldContent, newContent, editMode);

            if (finalEdits.length === 0) {
                // User rejected the diff
                logEvent("tengu_ext_diff_rejected");
                let ideClient = findConnectedIdeClient(toolUseContext.options.mcpClients);
                if (ideClient) await closeDiffTab(tabName, ideClient);
                onChange({ type: "reject" }, { file_path: filePath, edits });
                return;
            }

            onChange({ type: "accept-once" }, { file_path: filePath, edits: finalEdits });
        } catch (error) {
            logError(error);
            setHasError(true);
        }
    }

    useEffect(() => {
        showDiffAndHandleResponse();
        return () => { cleanupRef.current = true; };
    }, []);

    return {
        closeTabInIDE: () => {
            let ideClient = findConnectedIdeClient(toolUseContext.options.mcpClients);
            if (!ideClient) return Promise.resolve();
            return closeDiffTab(tabName, ideClient);
        },
        showingDiffInIDE: useIdeDiff && !hasError,
        ideName,
        hasError
    };
}

// Mapping: pSq→IDEDiffHandler, L$1→hasConnectedIde, X1→getSettings, R$1→getIdeName
//          EPz→openDiffInIde, kPz→computeDiffEdits, Gv→findConnectedIdeClient, Cs8→closeDiffTab
```

**Decision flow:**

```
useIdeDiff = hasConnectedIde AND diffTool="auto" AND not .ipynb
│
├─ true: call openDiffInIde() [BLOCKING]
│    │
│    ├─ FILE_SAVED → use saved content
│    ├─ TAB_CLOSED → use proposed content
│    └─ DIFF_REJECTED → keep original, emit reject
│
└─ false: return showingDiffInIDE=false
          → EditTool renders terminal diff instead
```

---

## 3. Onboarding Dialog: `IDEOnboardingDialog` (Nx7)

**Location:** `chunks.188.mjs:1268` (render), `chunks.80.mjs` (component definition area)

```javascript
// ============================================
// IDEOnboardingDialog (Nx7) - First-run IDE setup wizard
// Location: chunks.80.mjs:1196-1276 (approx)
// ============================================

// READABLE (for understanding):
function IDEOnboardingDialog({ onDone, installationStatus }) {
    // Immediately mark onboarding as shown (even if user dismisses)
    markIdeOnboardingAsShown();

    // Register keyboard: both Enter/Y/N dismiss the dialog
    useKeyboardHandler({ "confirm:yes": onDone, "confirm:no": onDone });

    let ideType = installationStatus?.ideType ?? getDefaultIdeType();
    let isJetBrains = isJetBrainsIde(ideType);
    let ideName = getIdeDisplayName(ideType);         // e.g. "VS Code", "Cursor", "IntelliJ IDEA"
    let installedVersion = installationStatus?.installedVersion;
    let pluginOrExtension = isJetBrains ? "plugin" : "extension";
    let shortcut = process.platform === "darwin" ? "Cmd+Option+K" : "Ctrl+Alt+K";
    // ...renders welcome + feature list + confirm dialog
}

// Mapping: Nx7→IDEOnboardingDialog, aX9→markIdeOnboardingAsShown, Oh→isJetBrainsIde
//   S_→getIdeDisplayName, Q01→getDefaultIdeType
```

**Behavior details:**
- `markIdeOnboardingAsShown()` is called at render time, not on dismiss — ensures it only appears once even if the user closes the terminal mid-dialog
- Both "yes" and "no" keyboard paths call `onDone` — the dialog is purely informational, there's no action to confirm
- `isJetBrains` controls vocabulary: JetBrains uses "plugin", VSCode family uses "extension"

---

## 4. Status Notifications: `useIdeStatusMonitoring` (dLq)

**Location:** `chunks.187.mjs:2265-2337`

This hook produces non-blocking status bar notifications. It does NOT use the dialog system — instead it calls `addNotification()` from the notification queue.

### Four Notification Effects

```javascript
// ============================================
// useIdeStatusMonitoring - 4 notification effects
// Location: chunks.187.mjs:2265-2337
// ============================================

// READABLE (for understanding):
function useIdeStatusMonitoring({ ideSelection, mcpClients, ideInstallationStatus }) {
    let { addNotification } = useNotifications();
    let ideStatus = getIdeConnectionStatus(mcpClients);
    let isJetBrains = ideInstallationStatus ? isJetBrainsIde(ideInstallationStatus?.ideType) : false;
    let installError = ideInstallationStatus?.error || isJetBrains;

    // Effect 1: Hint that IDE integration is available but not connected
    useEffect(() => {
        if (isDev()) return;
        if (isIdeEnv() || ideStatus !== null || jetBrainsPluginError) return;
        detectAvailableIDEs(true).then(ides => {
            let ideName = ides[0]?.name;
            if (ideName) addNotification({
                key: "ide-status-hint",
                text: `⊙ /ide for ${ideName}`,
                priority: "low"
            });
        });
    }, [addNotification, ideStatus, jetBrainsPluginError]);

    // Effect 2: IDE was connected but disconnected
    useEffect(() => {
        if (isDev()) return;
        if (vsCodeInstallError || jetBrainsPluginError || ideStatus !== "disconnected") return;
        addNotification({ key: "ide-status-disconnected", text: "⊙ IDE disconnected",
            color: "error", priority: "medium" });
    }, [addNotification, ideStatus, vsCodeInstallError, jetBrainsPluginError]);

    // Effect 3: JetBrains plugin connection issue
    useEffect(() => {
        if (isDev()) return;
        if (!jetBrainsPluginError) return;
        addNotification({ key: "ide-status-jetbrains-disconnected",
            text: "IDE plugin not connected · /status for info", priority: "medium" });
    }, [addNotification, jetBrainsPluginError]);

    // Effect 4: VSCode extension install failed
    useEffect(() => {
        if (isDev()) return;
        if (!vsCodeInstallError) return;
        addNotification({ key: "ide-status-install-error",
            text: "IDE extension install failed (see /status for info)",
            color: "error", priority: "medium" });
    }, [addNotification, vsCodeInstallError]);
}

// Mapping: dLq→useIdeStatusMonitoring, Nq→isDev, bX→isIdeEnv, Ub1→detectAvailableIDEs
//          Rf1→getIdeConnectionStatus, Oh→isJetBrainsIde, w→addNotification
```

---

## 5. Selection Hook Data Flow

```
IDE Extension
    │ MCP notification: selection_changed
    ▼
fVq (useIdeSelection)   [chunks.186.mjs:410]
    │ calls onSelectionChange callback
    ▼
REPL state: K6 (ideSelection)   [chunks.188.mjs]
    │
    ├─► FWq (IdeSelectionIndicator)   → renders "⧉ 3 lines selected"
    │      in: Header status bar
    │
    ├─► dLq (useIdeStatusMonitoring)  → drives notification effects
    │      input: ideSelection, mcpClients, installationStatus
    │
    └─► System prompt injection        [via buildSystemPrompt / attachments]
           → "User has selected 3 lines in foo.ts: ..."
```

### Selection State Shape

```typescript
type IdeSelection = {
    lineCount: number;      // 0 when no selection; >0 when text selected
    lineStart: number | undefined;   // 0-based line number of selection start
    text: string | undefined;        // selected text content
    filePath: string | undefined;    // absolute path to active file
};
```

---

## 6. Diff Display State Machine

```
EditTool renders
    │
    └─ pSq (IDEDiffHandler) called with { filePath, edits, toolUseContext, editMode }
           │
           ├─ useIdeDiff = hasConnectedIde AND diffTool="auto" AND not .ipynb
           │
           ├─ useIdeDiff=false:
           │       │
           │       └─ returns { showingDiffInIDE: false }
           │              → EditTool uses terminal diff renderer (DiffViewer)
           │
           └─ useIdeDiff=true:
                   │
                   └─ useEffect fires → EPz("openDiff", ...) [BLOCKING]
                          │
                          ├─ FILE_SAVED → onChange({ type: "accept-once" })
                          ├─ TAB_CLOSED → onChange({ type: "accept-once" })
                          ├─ DIFF_REJECTED → onChange({ type: "reject" })
                          └─ error → setHasError(true) → terminal diff fallback
```

---

## 7. Deep UI Component Analysis

### openDiffInIde (EPz) Implementation

**What it does**: Calls the IDE's `openDiff` MCP tool, waits for user response, and returns the final content states.

**Location:** `chunks.188.mjs:955-1011`

```javascript
// ============================================
// openDiffInIde - Opens diff view in IDE and waits for user response
// Location: chunks.188.mjs:955-1011
// ============================================

// ORIGINAL (for source lookup):
async function EPz(A, q, K, Y) {
    let z = !1,
        _ = L4(A),
        w = "";
    try {
        w = IM(_)
    } catch (H) {
        if (H.code !== "ENOENT") throw H
    }
    async function O() {
        if (z) return;
        z = !0;
        try {
            await Cs8(Y, $)
        } catch (H) {
            _6(H)
        }
        process.off("beforeExit", O), K.abortController.signal.removeEventListener("abort", O)
    }
    K.abortController.signal.addEventListener("abort", O), process.on("beforeExit", O);
    let $ = Gv(K.options.mcpClients);
    try {
        let {
            updatedFile: H
        } = Qx6({
            filePath: _,
            fileContents: w,
            edits: q
        });
        if (!$ || $.type !== "connected") throw Error("IDE client not available");
        let j = _,
            J = $.config.ideRunningInWindows === !0;
        if (y8() === "wsl" && J && process.env.WSL_DISTRO_NAME) j = new nD6(process.env.WSL_DISTRO_NAME).toIDEPath(_);
        let M = await pC("openDiff", {
                old_file_path: j,
                new_file_path: j,
                new_file_contents: H,
                tab_name: Y
            }, $),
            D = Array.isArray(M) ? M : [M];
        if (RPz(D)) return O(), {
            oldContent: w,
            newContent: D[1].text
        };
        else if (yPz(D)) return O(), {
            oldContent: w,
            newContent: H
        };
        else if (LPz(D)) return O(), {
            oldContent: w,
            newContent: w
        };
        throw Error("Not accepted")
    } catch (H) {
        throw _6(H), O(), H
    }
}

// READABLE (for understanding):
async function openDiffInIde(filePath, edits, toolUseContext, tabName) {
    let isClosed = false;
    let absolutePath = resolvePath(filePath);
    let oldContent = "";

    // Step 1: Read current file content (old content)
    try {
        oldContent = fs.readFileSync(absolutePath, "utf-8");
    } catch (err) {
        if (err.code !== "ENOENT") throw err;
        // File doesn't exist - will be created
    }

    // Step 2: Setup cleanup handlers
    async function cleanup() {
        if (isClosed) return;
        isClosed = true;
        try {
            await closeDiffTab(tabName, ideClient);
        } catch (err) {
            logError(err);
        }
        process.off("beforeExit", cleanup);
        toolUseContext.abortController.signal.removeEventListener("abort", cleanup);
    }

    // Register cleanup on abort or process exit
    toolUseContext.abortController.signal.addEventListener("abort", cleanup);
    process.on("beforeExit", cleanup);

    // Step 3: Find connected IDE client
    let ideClient = findConnectedIdeClient(toolUseContext.options.mcpClients);

    try {
        // Step 4: Apply proposed edits to get new content
        let { updatedFile: newContent } = applyEdits({
            filePath: absolutePath,
            fileContents: oldContent,
            edits: edits
        });

        if (!ideClient || ideClient.type !== "connected") {
            throw new Error("IDE client not available");
        }

        // Step 5: Handle WSL path translation
        let ideFilePath = absolutePath;
        let isIdeOnWindows = ideClient.config.ideRunningInWindows === true;

        if (isWsl() && isIdeOnWindows && process.env.WSL_DISTRO_NAME) {
            // Convert WSL path to Windows path for IDE
            ideFilePath = new WslPathConverter(process.env.WSL_DISTRO_NAME).toIDEPath(absolutePath);
        }

        // Step 6: Call IDE MCP tool with blocking wait
        let response = await callMcpTool("openDiff", {
            old_file_path: ideFilePath,
            new_file_path: ideFilePath,
            new_file_contents: newContent,
            tab_name: tabName
        }, ideClient);

        let responseArray = Array.isArray(response) ? response : [response];

        // Step 7: Parse response type
        if (isFileSavedResponse(responseArray)) {
            // FILE_SAVED: User accepted and saved the file
            cleanup();
            return {
                oldContent: oldContent,
                newContent: responseArray[1].text  // User's saved content
            };
        } else if (isTabClosedResponse(responseArray)) {
            // TAB_CLOSED: User closed tab (treated as acceptance)
            cleanup();
            return {
                oldContent: oldContent,
                newContent: newContent  // Use proposed content
            };
        } else if (isDiffRejectedResponse(responseArray)) {
            // DIFF_REJECTED: User clicked reject button
            cleanup();
            return {
                oldContent: oldContent,
                newContent: oldContent  // Keep original
            };
        }

        throw new Error("Not accepted");

    } catch (err) {
        logError(err);
        cleanup();
        throw err;
    }
}

// Response type detection helpers:
function isTabClosedResponse(arr) {
    return Array.isArray(arr) && arr[0]?.type === "text" && arr[0].text === "TAB_CLOSED";
}

function isDiffRejectedResponse(arr) {
    return Array.isArray(arr) && arr[0]?.type === "text" && arr[0].text === "DIFF_REJECTED";
}

function isFileSavedResponse(arr) {
    return Array.isArray(arr) && arr[0]?.type === "text" && arr[0].text === "FILE_SAVED"
        && typeof arr[1]?.text === "string";
}

// Mapping: EPz→openDiffInIde, L4→resolvePath, IM→readFileSync, Cs8→closeDiffTab,
//          Gv→findConnectedIdeClient, Qx6→applyEdits, pC→callMcpTool, y8→isWsl,
//          yPz→isTabClosedResponse, LPz→isDiffRejectedResponse, RPz→isFileSavedResponse
```

**Why BLOCKING matters:**

The `openDiff` call is deliberately blocking:
1. Claude Code cannot proceed while diff is open
2. User must accept/reject before conversation continues
3. Prevents Claude from making additional changes while user reviews

This is different from non-blocking notifications where Claude Code continues processing.

### IDEDiffHandler Response Processing

```javascript
// ============================================
// computeDiffEdits - Extract final edits from user-modified content
// Location: chunks.188.mjs (helper function)
// ============================================

// READABLE (for understanding):
function computeDiffEdits(filePath, oldContent, newContent, editMode) {
    // User may have modified the proposed content in the IDE
    // Need to compute what edits to actually apply

    if (editMode === "create_file") {
        // Creating new file - use the new content directly
        return [{ old_string: "", new_string: newContent }];
    }

    // For edit mode, compute the diff between old and user-modified new
    // This allows user to tweak Claude's proposed changes
    return computeDiffEditsFromContent(oldContent, newContent);
}
```

**Why user-modified content is supported:**

Users can edit the proposed changes directly in the IDE diff view:
1. IDE shows left (old) and right (new with proposed changes)
2. User can modify the right side
3. When saved, the user's modifications are captured
4. Claude Code applies the user's version, not just the original proposal

This creates a collaborative editing flow where user refinement is natural.

### closeDiffTab (Cs8) Implementation

**What it does**: Closes the diff tab in IDE after user accepts/rejects.

**Location:** `chunks.65.mjs` (helper function area)

```javascript
// ============================================
// closeDiffTab - Close diff tab in IDE
// Location: chunks.65.mjs (approx)
// ============================================

// READABLE (for understanding):
async function closeDiffTab(tabName, ideClient) {
    try {
        await ideClient.callTool("closeDiff", { tabName });
    } catch (error) {
        // Silently ignore - tab may already be closed
    }
}

// Mapping: Cs8→closeDiffTab
```

**Why silent failure:**

Closing the diff tab is best-effort:
1. User may have already closed it manually
2. IDE may have auto-closed after save
3. Failure to close shouldn't block the edit operation

---

## 8. IDE Selection Notification Flow

### Selection Changed Schema

**Location:** `chunks.194.mjs:1032`

```javascript
// ============================================
// selectionChangedSchema - Zod validation for selection notification
// Location: chunks.194.mjs:1032 (approx)
// ============================================

// READABLE (for understanding):
const selectionChangedSchema = z.object({
    params: z.object({
        lineCount: z.number(),
        lineStart: z.number().optional(),
        text: z.string().optional(),
        filePath: z.string().optional(),
        characterStart: z.number().optional(),
        characterEnd: z.number().optional()
    })
});

// This validates the MCP notification payload before it reaches React state
```

### Selection State Update Cycle

```
User selects text in IDE
    │
    └─ IDE extension sends MCP notification: selection_changed
           │
           ▼
MCP client receives notification
    │
    └─ useIdeSelection hook (fVq) parses and validates
           │
           ▼
onSelectionChange callback fires
    │
    └─ REPL state: ideSelection updated
           │
           ├─ IdeSelectionIndicator re-renders with new content
           │
           └─ System prompt builder includes selection context
```

### Selection Injection into System Prompts

**What it does:** Selection context is formatted and injected into the model's context window.

```javascript
// ============================================
// getIdeSelectionAttachment - Format selection for system reminder
// Location: chunks.147.mjs (approx)
// ============================================

// READABLE (for understanding):
function getIdeSelectionAttachment(ideSelection) {
    // Guard: No selection or empty selection
    if (!ideSelection?.text || ideSelection.lineCount === 0) {
        return null;
    }

    // Build context string
    let context = `User has selected ${ideSelection.lineCount} lines`;

    if (ideSelection.filePath) {
        let filename = path.basename(ideSelection.filePath);
        context += ` in ${filename}`;

        if (ideSelection.lineStart !== undefined) {
            // Convert 0-based to 1-based for user display
            context += ` starting at line ${ideSelection.lineStart + 1}`;
        }
    }

    context += `:\n\n${ideSelection.text}`;

    return {
        type: "ide_selection",
        content: context,
        priority: "high"  // High priority = always included
    };
}
```

**Example formatted output:**
```
User has selected 3 lines in utils.ts starting at line 15:

export function processData(input: string) {
    return input.trim().toLowerCase();
}
```

---

## 9. Error Recovery and Fallback

### IDEDiffHandler Error States

```javascript
// State machine for diff display errors

// Normal flow:
showingDiffInIDE: true, hasError: false
    → Diff shows in IDE, user interacts

// IDE disconnected during diff:
showingDiffInIDE: false, hasError: true
    → Fallback to terminal diff

// openDiff tool threw exception:
showingDiffInIDE: false, hasError: true
    → setHasError(true), terminal diff renders

// Component unmounted during openDiff call:
cleanupRef.current: true
    → Early return, onChange not called
```

### Cleanup on Unmount

```javascript
// IDEDiffHandler cleanup pattern
useEffect(() => {
    showDiffAndHandleResponse();
    return () => {
        cleanupRef.current = true;  // Signal abort
    };
}, []);
```

**Why cleanup matters:**

1. User might cancel the entire operation (Ctrl+C)
2. Session might end while diff is open
3. Component re-renders shouldn't re-trigger openDiff
4. Prevents `onChange` being called on unmounted component

---

## 10. IDE Onboarding Flow

### IDEOnboardingDialog Trigger Conditions

```
Session start
    │
    ├─ isDev() === true? → Skip onboarding (developer mode)
    │
    ├─ hasIdeOnboardingDialogBeenShown() === true? → Skip (already shown)
    │
    └─ IDE detected in process tree?
           │
           ├─ Yes → Show onboarding dialog
           │         └─ markIdeOnboardingAsShown() called immediately
           │
           └─ No → Wait for /ide command or auto-detect
```

### Auto-Installation Flow

```
IDE detected
    │
    ├─ isVSCodeFamily(ideType)?
    │       │
    │       ├─ Check if extension installed: code --list-extensions
    │       │       │
    │       │       ├─ Not installed → Install via code --install-extension
    │       │       │
    │       │       └─ Installed → Check version, prompt update if outdated
    │       │
    │       └─ After install → Trigger onboarding dialog
    │
    └─ isJetBrainsFamily(ideType)?
            │
            └─ JetBrains plugins require manual install
                    │
                    └─ Show instructions with plugin marketplace link
```

### markIdeOnboardingAsShown Implementation

**What it does:** Persists that onboarding has been shown, preventing future auto-display.

```javascript
// ============================================
// markIdeOnboardingAsShown - Persist onboarding state
// Location: chunks.187.mjs (approx)
// ============================================

// READABLE (for understanding):
function markIdeOnboardingAsShown() {
    // Writes to persistent storage (e.g., ~/.claude/settings.json)
    let settings = readSettings();
    settings.hasShownIdeOnboarding = true;
    writeSettings(settings);
}
```

**Why immediate persistence:**

Called at render time, not on dismiss:
1. User might close terminal mid-dialog
2. Process might crash
3. Prevents repeated onboarding on restart
4. User can still run `/ide` to reconfigure

---

## 11. Complete IDE Onboarding State Machine

### State Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    IDE Onboarding State Machine                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Initial State: CHECK_ENVIRONMENT                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Check: isDev()? → Skip onboarding                                   │    │
│  │ Check: hasShownIdeOnboarding? → Skip onboarding                     │    │
│  │ Check: isIdeEnv()? → Proceed to detect                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  State: DETECT_IDE                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ detectAvailableIDEs() → Scan process tree for known IDEs           │    │
│  │                                                                      │    │
│  │ Known IDEs:                                                          │    │
│  │   - VS Code: electron + "Visual Studio Code"                       │    │
│  │   - Cursor: electron + "Cursor"                                     │    │
│  │   - Windsurf: electron + "Windsurf"                                 │    │
│  │   - JetBrains: java + "idea", "pycharm", "webstorm", etc.          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│           ┌───────────────┴───────────────┐                                 │
│           │                               │                                  │
│           ▼                               ▼                                  │
│  ┌─────────────────────┐       ┌─────────────────────┐                     │
│  │ VS Code Family      │       │ JetBrains IDE       │                     │
│  │ (VS Code, Cursor,   │       │ (IntelliJ, PyCharm, │                     │
│  │  Windsurf, etc.)    │       │  WebStorm, etc.)    │                     │
│  └─────────┬───────────┘       └─────────┬───────────┘                     │
│            │                             │                                   │
│            ▼                             ▼                                  │
│  ┌─────────────────────┐       ┌─────────────────────┐                     │
│  │ AUTO_INSTALL        │       │ MANUAL_INSTALL      │                     │
│  │                     │       │                     │                     │
│  │ Check if extension  │       │ JetBrains plugins   │                     │
│  │ already installed:  │       │ require manual      │                     │
│  │                     │       │ install via IDE     │                     │
│  │ code --list-        │       │ marketplace         │                     │
│  │ extensions | grep   │       │                     │                     │
│  │ claude-code         │       │ Show instructions   │                     │
│  │                     │       │ with link to        │                     │
│  │ If not:             │       │ plugin marketplace  │                     │
│  │   code --install-   │       │                     │                     │
│  │   extension         │       │                     │                     │
│  │   anthropic.claude- │       │                     │                     │
│  │   code              │       │                     │                     │
│  └─────────┬───────────┘       └─────────┬───────────┘                     │
│            │                             │                                   │
│            └──────────────┬──────────────┘                                 │
│                           │                                                  │
│                           ▼                                                  │
│  State: SHOW_ONBOARDING_DIALOG                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ IDEOnboardingDialog (Nx7) renders                                   │    │
│  │                                                                      │    │
│  │ Content:                                                             │    │
│  │   - Welcome message                                                  │    │
│  │   - Feature list (selection context, diff preview, diagnostics)     │    │
│  │   - Keyboard shortcut (Cmd/Ctrl + Option/Alt + K)                   │    │
│  │   - "Press Enter to continue"                                        │    │
│  │                                                                      │    │
│  │ Side effect: markIdeOnboardingAsShown() called immediately          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  State: WAIT_FOR_IDE_CONNECTION                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Extension/plugin starts MCP server                                  │    │
│  │ Claude Code connects as MCP client                                  │    │
│  │                                                                      │    │
│  │ Wait timeout: 30 seconds                                            │    │
│  │ If timeout: Show "Connection failed" notification                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           ▼                                                  │
│  State: CONNECTED                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ IDE integration fully active                                        │    │
│  │                                                                      │    │
│  │ Status bar shows: "⧉ In myfile.ts" or "⧉ 3 lines selected"         │    │
│  │ Diff operations route to IDE                                        │    │
│  │ Diagnostics sync with IDE LSP                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### IDE Detection Algorithm

**Location:** `chunks.65.mjs` (IDE_CONFIG definition)

```javascript
// ============================================
// IDE detection configuration and algorithm
// Location: chunks.65.mjs (IDE_CONFIG - gX6)
// ============================================

// IDE detection patterns:
const IDE_CONFIG = {
    "vscode": {
        processNames: ["electron", "code"],
        windowTitles: ["Visual Studio Code", "VS Code"],
        extensionId: "anthropic.claude-code",
        installCommand: "code --install-extension"
    },
    "cursor": {
        processNames: ["electron", "cursor"],
        windowTitles: ["Cursor"],
        extensionId: "anthropic.claude-code",  // Same extension
        installCommand: "cursor --install-extension"
    },
    "windsurf": {
        processNames: ["electron", "windsurf"],
        windowTitles: ["Windsurf"],
        extensionId: "anthropic.claude-code",
        installCommand: "windsurf --install-extension"
    },
    "intellij": {
        processNames: ["java"],
        windowTitles: ["IntelliJ IDEA"],
        pluginId: "claude-code-jetbrains-plugin",
        requiresManualInstall: true
    },
    "pycharm": {
        processNames: ["java"],
        windowTitles: ["PyCharm"],
        pluginId: "claude-code-jetbrains-plugin",
        requiresManualInstall: true
    }
    // ... other JetBrains IDEs
};

// Detection algorithm:
// 1. Scan process tree for matching process names
// 2. Check window titles for matching strings
// 3. Return first match (priority: VS Code family first, then JetBrains)
// 4. VS Code family uses same extension, JetBrains uses unified plugin
```

---

## 12. Selection Indicator State Transitions

### Visual State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Selection Indicator States                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  State: HIDDEN                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Conditions:                                                          │    │
│  │   - IDE not connected (status === null)                             │    │
│  │   - IDE disconnected (status === "disconnected")                    │    │
│  │   - No file open and no selection                                   │    │
│  │                                                                      │    │
│  │ Render: null (nothing shown in status bar)                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           │ IDE connects                                     │
│                           │ + file opened OR text selected                  │
│                           ▼                                                  │
│  State: FILE_CONTEXT                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Condition: IDE connected + cursor in file (no selection)           │    │
│  │                                                                      │    │
│  │ Display: "⧉ In myfile.ts"                                           │    │
│  │ Color: ide (blue/cyan)                                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           │ User selects text                                │
│                           ▼                                                  │
│  State: SELECTION_CONTEXT                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Condition: IDE connected + text selected (lineCount > 0)           │    │
│  │                                                                      │    │
│  │ Display: "⧉ 3 lines selected"                                       │    │
│  │ Color: ide (blue/cyan)                                              │    │
│  │                                                                      │    │
│  │ Note: Selection takes priority over file context                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           │                                                  │
│                           │ User clears selection                            │
│                           │ (Escape or click elsewhere)                     │
│                           ▼                                                  │
│  State: FILE_CONTEXT (back to file)                                         │
│                                                                              │
│  Transitions to HIDDEN when:                                                 │
│    - IDE disconnects                                                        │
│    - User closes all files                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Selection Data Flow

```
IDE Editor
    │
    │ User selects text
    ▼
IDE Extension
    │
    │ MCP notification: selection_changed
    │ { lineCount, lineStart, text, filePath }
    ▼
MCP Transport (SSE/WebSocket)
    │
    │ JSON-RPC notification
    ▼
Claude Code MCP Client
    │
    │ onNotification handler
    ▼
useIdeSelection hook (React state)
    │
    │ setState({ ideSelection: {...} })
    ▼
React Re-render
    │
    ├─► IdeSelectionIndicator
    │     └── Status bar badge updates
    │
    └─► System Prompt Builder
          └── Selection context injected into LLM context
```

---

## 13. Status Notification Types

### Four Notification Types

| Key | Text | Priority | Trigger |
|-----|------|----------|---------|
| `ide-status-hint` | "⊙ /ide for VS Code" | low | IDE detected but not connected |
| `ide-status-disconnected` | "⊙ IDE disconnected" | medium | IDE was connected, now disconnected |
| `ide-status-jetbrains-disconnected` | "IDE plugin not connected · /status for info" | medium | JetBrains plugin issue |
| `ide-status-install-error` | "IDE extension install failed (see /status)" | medium | VS Code extension install error |

### Notification Lifecycle

```
Notification Shown
    │
    ├─► User dismisses (Enter/Esc) → Notification removed
    │
    ├─► New notification replaces it → Previous notification removed
    │
    └─► Condition clears → Notification removed
        (e.g., IDE reconnects → "disconnected" notification removed)
```

---

## 14. Related Documents

- [overview.md](./overview.md) - IDE integration architecture overview
- [connection_lifecycle.md](./connection_lifecycle.md) - IDE connection management
- [diagnostics_manager.md](./diagnostics_manager.md) - Diagnostic baseline and delta
- [ide_tools.md](./ide_tools.md) - MCP tools including openDiff
- [cross_module_integration.md](./cross_module_integration.md) - Cross-module integration
- [../04_system_reminder/implementation.md](../04_system_reminder/implementation.md) - System reminder architecture
