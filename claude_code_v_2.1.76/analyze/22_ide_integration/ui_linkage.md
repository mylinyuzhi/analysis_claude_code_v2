# IDE Integration UI Linkage (Claude Code 2.1.38)

## Overview

This document covers all UI components and React hooks that connect the IDE integration layer to the visible Claude Code interface. The IDE integration surfaces in five places: the status bar selection indicator, the diff display routing, the onboarding dialog, status notifications, and the IDEOnboardingDialog dialog triggered from the priority dialog system.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - IDE Integration, UI Components
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP)

Key UI symbols in this document:
- `IdeSelectionIndicator` (FWq) - Status bar "⧉ N lines selected" badge
- `getIdeConnectionStatus` (Rf1) - React hook returning "connected"/"disconnected"/null
- `IDEDiffHandler` (MPq) - React hook orchestrating IDE diff vs terminal diff routing
- `IDEOnboardingDialog` (Nx7) - First-run onboarding dialog component
- `useIdeStatusMonitoring` (dLq) - Hook producing 4 IDE-related notifications
- `useIdeSelection` (fVq) - Hook subscribing to selection_changed MCP notifications
- `REPL` (TUA) - Main component that wires all IDE hooks together

---

## Component Map

```
REPL (TUA) [chunks.188.mjs]
  │
  ├─ fVq (useIdeSelection)              → updates K6 (ideSelection state)
  │    └─ listens on: oMz (selectionChangedSchema)
  │
  ├─ dLq (useIdeStatusMonitoring)       → calls addNotification()
  │    └─ 4 effects: hint / disconnected / jetbrains / install-error
  │
  ├─ Fx7 (handleIdeAutoInstallation)    → sets F6 (installStatus), calls o1(true) for onboarding
  │    ├─ HD9 (installIdeExtension)
  │    └─ Ex7 (waitForIdeConnection)   → updates dynamic MCP config
  │
  ├─ Header [chunks.188.mjs:1063]
  │    └─ FWq (IdeSelectionIndicator)  → renders "⧉ 3 lines selected"
  │
  ├─ DialogsOverlay [chunks.188.mjs:1068]
  │    └─ "ide-onboarding" → Nx7 (IDEOnboardingDialog)
  │
  └─ EditTool rendering
       └─ MPq (IDEDiffHandler)         → calls aJz (openDiffInIde) or terminal diff
```

---

## 1. Status Bar: IDE Selection Indicator

### Component: `IdeSelectionIndicator` (FWq)

**Location:** `chunks.182.mjs:1514-1545`

**Rendered inside:** The right-side status bar area (confirmed at `chunks.182.mjs:1701` where `FWq` is rendered with `ideSelection` and `mcpClients` props).

```javascript
// ============================================
// IdeSelectionIndicator - IDE context badge in status bar
// Location: chunks.182.mjs:1514-1545
// ============================================

// ORIGINAL (for source lookup):
function FWq(A) {
    let q = e(7), { ideSelection: K, mcpClients: Y } = A,
        z = Rf1(Y),
        w = z === "connected" && (K?.filePath || K?.text && K.lineCount > 0);
    if (z === null || !w || !K) return null;
    if (K.text && K.lineCount > 0) {
        let H = K.lineCount === 1 ? "line" : "lines", $;
        if (q[0] !== K.lineCount || q[1] !== H)
            $ = xc1.createElement(V, { color: "ide", key: "selection-indicator" },
                "⧉ ", K.lineCount, " ", H, " selected"), q[0] = K.lineCount, q[1] = H, q[2] = $;
        else $ = q[2];
        return $
    }
    if (K.filePath) {
        let H; if (q[3] !== K.filePath) H = bDz(K.filePath), q[3] = K.filePath, q[4] = H;
        else H = q[4];
        let $; if (q[5] !== H)
            $ = xc1.createElement(V, { color: "ide", key: "selection-indicator" }, "⧉ In ", H),
            q[5] = H, q[6] = $;
        else $ = q[6];
        return $
    }
}

// READABLE (for understanding):
function IdeSelectionIndicator({ ideSelection, mcpClients }) {
    let ideStatus = getIdeConnectionStatus(mcpClients); // "connected" | "disconnected" | null
    let hasActiveContent = ideStatus === "connected" &&
        (ideSelection?.filePath || (ideSelection?.text && ideSelection.lineCount > 0));

    if (ideStatus === null || !hasActiveContent || !ideSelection) return null;

    // Priority 1: Text selected → show line count
    if (ideSelection.text && ideSelection.lineCount > 0) {
        let unit = ideSelection.lineCount === 1 ? "line" : "lines";
        return <Text color="ide">⧉ {ideSelection.lineCount} {unit} selected</Text>;
    }
    // Priority 2: Cursor in file → show filename
    if (ideSelection.filePath) {
        let filename = basename(ideSelection.filePath);
        return <Text color="ide">⧉ In {filename}</Text>;
    }
}

// Mapping: FWq→IdeSelectionIndicator, Rf1→getIdeConnectionStatus, bDz→basename, V→Text
```

**State machine:**
```
ideStatus = null       → render nothing (no IDE configured)
ideStatus = "disconnected" → render nothing (IDE was configured but disconnected)
ideStatus = "connected" AND no active content → render nothing
ideStatus = "connected" AND lineCount > 0 → "⧉ 3 lines selected"
ideStatus = "connected" AND filePath only → "⧉ In myfile.ts"
```

**Why `color: "ide"`:** The IDE context badge uses a distinct "ide" color theme (typically blue/cyan) to visually distinguish it from other status bar elements, signaling to users that Claude Code is "seeing" their IDE context.

### Hook: `getIdeConnectionStatus` (Rf1)

**Location:** `chunks.182.mjs:1500-1506`

```javascript
// ============================================
// getIdeConnectionStatus - Memoized IDE connection state hook
// Location: chunks.182.mjs:1500-1506
// ============================================

// ORIGINAL (for source lookup):
function Rf1(A) {
    return mWq.useMemo(() => {
        let q = A?.find((K) => K.name === "ide");
        if (!q) return null;
        return q.type === "connected" ? "connected" : "disconnected"
    }, [A])
}

// READABLE (for understanding):
function getIdeConnectionStatus(mcpClients) {
    return useMemo(() => {
        let ideClient = mcpClients?.find(c => c.name === "ide");
        if (!ideClient) return null;         // "ide" server never in config
        return ideClient.type === "connected" ? "connected" : "disconnected";
    }, [mcpClients]);
}

// Mapping: Rf1→getIdeConnectionStatus, mWq→React
```

Used by `IdeSelectionIndicator` and `useIdeStatusMonitoring` to drive display logic.

---

## 2. Edit Tool: IDE Diff Routing

### Hook: `IDEDiffHandler` (MPq)

**Location:** `chunks.180.mjs:3-63`

This hook is called by the edit tool UI component whenever the model proposes a file change. It decides whether to show the diff in the IDE or fall back to terminal rendering.

```javascript
// ============================================
// IDEDiffHandler - Routes diff display to IDE or terminal
// Location: chunks.180.mjs:3-63
// ============================================

// ORIGINAL (for source lookup):
function MPq({ onChange: A, toolUseContext: q, filePath: K, edits: Y, editMode: z }) {
    let w = Qc.useRef(!1), [H, $] = Qc.useState(!1),
        O = Qc.useMemo(() => nJz().slice(0, 6), []),
        _ = Qc.useMemo(() => `✻ [Claude Code] ${rJz(K)} (${O}) ⧉`, [K, O]),
        J = N$6(q.options.mcpClients) && f6().diffTool === "auto" && !K.endsWith(".ipynb"),
        X = T$6(q.options.mcpClients) ?? "IDE";
    async function D() {
        if (!J) return;
        try {
            c("tengu_ext_will_show_diff", {});
            let { oldContent: j, newContent: M } = await aJz(K, Y, q, _);
            if (w.current) return;
            c("tengu_ext_diff_accepted", {});
            let P = oJz(K, j, M, z);
            if (P.length === 0) {
                c("tengu_ext_diff_rejected", {});
                let W = iV(q.options.mcpClients);
                if (W) await aQA(_, W);
                A({ type: "reject" }, { file_path: K, edits: Y });
                return
            }
            A({ type: "accept-once" }, { file_path: K, edits: P })
        } catch (j) { K1(j), $(!0) }
    }
    return Qc.useEffect(() => { return D(), () => { w.current = !0 } }, []), {
        closeTabInIDE() {
            let j = iV(q.options.mcpClients);
            if (!j) return Promise.resolve();
            return aQA(_, j)
        },
        showingDiffInIDE: J && !H,
        ideName: X,
        hasError: H
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
            // BLOCKING: waits for user to accept/reject in IDE
            let { oldContent, newContent } = await openDiffInIde(filePath, edits, toolUseContext, tabName);
            if (cleanupRef.current) return; // component unmounted

            logEvent("tengu_ext_diff_accepted");
            let finalEdits = computeDiffEdits(filePath, oldContent, newContent, editMode);
            if (finalEdits.length === 0) {
                // User didn't actually change anything → treat as rejection
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
        return () => { cleanupRef.current = true; }; // cleanup flag for unmount
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

// Mapping: MPq→IDEDiffHandler, N$6→hasConnectedIde, T$6→getIdeName, aJz→openDiffInIde
//          oJz→computeDiffEdits, aQA→closeDiffTab, iV→findConnectedIdeClient
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

**Why `!filePath.endsWith(".ipynb")`:** The VS Code diff viewer can show Jupyter notebooks, but Claude Code's diffing logic operates on raw JSON which doesn't produce meaningful diffs for notebooks. Terminal rendering uses specialized notebook diff logic instead.

---

## 3. Main REPL: IDE Hook Wiring

**Location:** `chunks.188.mjs` (REPL component)

The REPL component initializes all IDE integration hooks and passes data down to child components:

### State Variables

```javascript
// K6 = ideSelection state (updated by fVq hook)
// F6 = ideInstallationStatus state (updated by handleIdeAutoInstallation)
// p1 = mcpClients (from session state)
// o1 = setShowIdeOnboarding (boolean toggle)
```

### Hook Initialization Order

```javascript
// Location: chunks.188.mjs initialization sequence
fVq(p1, setK6)      // Step 1: Subscribe to IDE selection notifications
dLq({ ideSelection: K6, mcpClients: p1, ideInstallationStatus: F6 })  // Step 2: Monitor status
// ... (handleIdeAutoInstallation runs inside IDE auto-connect setup hook)
```

### Dialog Priority System

The `getInputDialogType` function (`f11`, chunks.188.mjs:304) determines which dialog is shown. IDE onboarding is triggered via `XO === "ide-onboarding"`:

```javascript
// Location: chunks.188.mjs:1268
XO === "ide-onboarding" && createElement(Nx7, {
    onDone: () => o1(false),
    installationStatus: F6
})
```

The `setShowIdeOnboarding(true)` call sets `o1(true)` which causes `getInputDialogType` to return `"ide-onboarding"`, activating the `IDEOnboardingDialog`.

---

## 4. Onboarding Dialog: `IDEOnboardingDialog` (Nx7)

**Location:** `chunks.188.mjs:1268` (render), `chunks.80.mjs` (component definition area)

### Component Structure

```javascript
// ============================================
// IDEOnboardingDialog (Nx7) - First-run IDE setup wizard
// Location: chunks.80.mjs:1196-1276 (approx)
// ============================================

// ORIGINAL (for source lookup):
function Nx7(A) {
    let q = e(23), { onDone: K, installationStatus: Y } = A;
    aX9();  // Mark onboarding as shown immediately
    let z; // keyboard handler: both yes/no → K (onDone)
    if (q[0] !== K) z = { "confirm:yes": K, "confirm:no": K }, q[0] = K, q[1] = z;
    else z = q[1];
    c7(z, w);  // Register keyboard handler
    let H;
    if (q[3] !== Y?.ideType) H = Y?.ideType ?? Q01(), q[3] = Y?.ideType, q[4] = H;
    else H = q[4];
    let $ = H,
        O = Oh($),          // isJetBrainsIde
        _ = S_($),          // getIdeDisplayName (e.g. "VS Code", "Cursor")
        J = _, X = Y?.installedVersion,
        D = O ? "plugin" : "extension",   // terminology
        j = xA.platform === "darwin" ? "Cmd+Option+K" : "Ctrl+Alt+K";
    // ... renders welcome + feature list + confirm dialog
}

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

    // Renders:
    // "Claude Code is now connected to VS Code (extension v2.1.38)"
    // "You can now:"
    // "  • Open files and navigate to specific lines"
    // "  • Share selected code context with Claude"
    // "  • Review proposed changes in VS Code diff viewer"
    // "  • Use Cmd+Option+K to open Claude Code from VS Code"
}
```

**Behavior details:**
- `markIdeOnboardingAsShown()` is called at render time, not on dismiss — ensures it only appears once even if the user closes the terminal mid-dialog
- Both "yes" and "no" keyboard paths call `onDone` — the dialog is purely informational, there's no action to confirm
- `isJetBrains` controls vocabulary: JetBrains uses "plugin", VSCode family uses "extension"

---

## 5. Status Notifications: `useIdeStatusMonitoring` (dLq)

**Location:** `chunks.187.mjs:2265-2337`

This hook produces non-blocking status bar notifications. It does NOT use the dialog system — instead it calls `addNotification()` from the notification queue.

### Four Notification Effects

```javascript
// ============================================
// useIdeStatusMonitoring - 4 notification effects
// Location: chunks.187.mjs:2265-2337
// ============================================

// ORIGINAL (for source lookup) - Effect 1:
if (q[2] !== w || q[3] !== H || q[4] !== j) M = () => {
    if (Nq()) return;  // Skip in dev mode
    if (bX() || H !== null || j) return;  // Skip: IDE env detected, or status known, or JetBrains error
    Ub1(!0).then((k) => {
        let y = k[0]?.name;
        if (y) w({
            key: "ide-status-hint",
            text: `${l1.circle} /ide for ${y}`,
            priority: "low"
        })
    })
}, P = [w, H, j];

// ORIGINAL - Effect 2 (disconnect):
W = () => {
    if (Nq()) return;
    if (D || j || H !== "disconnected") return;
    w({ key: "ide-status-disconnected", text: `${l1.circle} IDE disconnected`,
        color: "error", priority: "medium" })
};

// ORIGINAL - Effect 3 (JetBrains plugin):
f = () => {
    if (Nq()) return;
    if (!j) return;
    w({ key: "ide-status-jetbrains-disconnected",
        text: "IDE plugin not connected · /status for info", priority: "medium" })
};

// ORIGINAL - Effect 4 (install error):
N = () => {
    if (Nq()) return;
    if (!D) return;
    w({ key: "ide-status-install-error",
        text: "IDE extension install failed (see /status for info)",
        color: "error", priority: "medium" })
};

// READABLE (for understanding):
function useIdeStatusMonitoring({ ideSelection, mcpClients, ideInstallationStatus }) {
    let { addNotification } = useNotifications();
    let ideStatus = getIdeConnectionStatus(mcpClients);  // "connected"/"disconnected"/null
    let isJetBrains = ideInstallationStatus ? isJetBrainsIde(ideInstallationStatus?.ideType) : false;
    let installError = ideInstallationStatus?.error || isJetBrains;
    let hasSelection = ideStatus === "connected" && (ideSelection?.filePath || ideSelection?.text);
    let emptyConnection = ideStatus === "connected" && !hasSelection;
    let vsCodeInstallError = installError && !isJetBrains && !emptyConnection && !hasSelection;
    let jetBrainsPluginError = installError && isJetBrains && !emptyConnection && !hasSelection;

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
//          Rf1→getIdeConnectionStatus, Oh→isJetBrainsIde, w→addNotification, l1.circle→"⊙"
```

**Notification priority logic:**
- `"low"` priority: hint only, shown in dimmer color, easily dismissed
- `"medium"` with `color: "error"`: prominent error state, persistent until acknowledged

**Effect 1 trigger conditions (hint):**
- NOT in dev mode
- NOT already detected as IDE environment (`TERM_PROGRAM=vscode` etc.)
- `ideStatus === null` (no "ide" MCP server in config at all)
- NOT a JetBrains plugin error (already handled by Effect 3)
- An IDE is actually discoverable via port file scanning

---

## 6. Selection Hook Data Flow

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

Initial/reset state: `{ lineCount: 0, lineStart: undefined, text: undefined, filePath: undefined }`

---

## 7. Diff Display State Machine

```
EditTool renders
    │
    └─ MPq (IDEDiffHandler) called with { filePath, edits, toolUseContext, editMode }
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
                   └─ useEffect fires → aJz("openDiff", ...) [BLOCKING]
                          │
                          ├─ FILE_SAVED → newContent = user's saved version
                          │       → onChange({ type: "accept-once" }, { edits: computedEdits })
                          │
                          ├─ TAB_CLOSED → newContent = proposed version
                          │       → onChange({ type: "accept-once" }, { edits: proposedEdits })
                          │
                          ├─ DIFF_REJECTED → newContent = originalContent
                          │       → onChange({ type: "reject" })
                          │
                          └─ error → setHasError(true)
                                  → returns { showingDiffInIDE: false, hasError: true }
                                  → EditTool falls back to terminal diff
```

**Fallback behavior:** If `openDiff` throws (IDE disconnected, timeout, etc.), `hasError` is set to `true` and `showingDiffInIDE` becomes `false`. The EditTool component then renders the terminal diff view — the user always gets _some_ way to review the proposed change.

---

## 8. IDE Context in System Prompt

The selection data from `useIdeSelection` flows into the system prompt via the attachment system. When `ideSelection.text` and `ideSelection.lineCount > 0`, a system reminder attachment is built containing the selected code snippet tagged with file path and line range. This allows Claude to reference the exact code the user is looking at.

(Deep analysis of system prompt attachment building is in `04_system_reminder/`)

---

## Symbol Reference

New symbols discovered in this analysis — added to `symbol_index_infra_integration.md`:

- `FWq` (IdeSelectionIndicator) - chunks.182.mjs:1514 - component
- `Rf1` (getIdeConnectionStatus) - chunks.182.mjs:1500 - function (hook)
- `MPq` (IDEDiffHandler) - chunks.180.mjs:3 - function (hook)
- `Nx7` (IDEOnboardingDialog) - chunks.188.mjs:1268 / chunks.80.mjs - component
- `dLq` (useIdeStatusMonitoring) - chunks.187.mjs:2265 - function (hook)
- `aVq` (syncPermissionModeToIde) - chunks.186.mjs:1736 - function (hook)
- `aJz` (openDiffInIde) - chunks.180.mjs:78 - function (async)
- `aQA` (closeDiffTab) - chunks.180.mjs:132 - function (async)
- `lo4` (executeMcpTool) - chunks.145.mjs:1676 - function (async)
- `KI` (DiagnosticsManager) - chunks.146.mjs:3 - class
- `eJz` (isFileSaved) - chunks.180.mjs:151 - function
- `sJz` (isTabClosed) - chunks.180.mjs:143 - function
- `tJz` (isDiffRejected) - chunks.180.mjs:147 - function
- `Fx7` (handleIdeAutoInstallation) - chunks.80.mjs:1880 - function (async)
- `HD9` (installIdeExtension) - chunks.80.mjs:1664 - function (async)
- `Ex7` (waitForIdeConnection) - chunks.80.mjs:1563 - function (async)
- `kx7` (checkExtensionInstalled) - chunks.80.mjs:1652 - function (async)
- `Ub1` (detectAvailableIDEs) - chunks.80.mjs:1578 - function (async)
- `zD9` (installAndReturnStatus) - chunks.80.mjs:1538 - function (async)
- `T$6` (getIdeName) - chunks.80.mjs:1842 - function
- `DXA` (getIdeDisplayName) - chunks.80.mjs:1847 - function
- `N$6` (hasConnectedIde) - chunks.80.mjs:1648 - function
- `U01` (IDE_CONFIG_MAP) - chunks.80.mjs:1953 - object (18 IDEs)
- `Qb1` (isVsCodeRunning) - chunks.80.mjs:2081 - function (memoized)
- `gb1` (isJetBrainsRunning) - chunks.80.mjs:2083 - function (memoized)
- `bX` (isIdeEnvironment) - chunks.80.mjs:2085 - function (memoized)
- `OD9` (findVsCodeBinaryFromParentProcess) - chunks.80.mjs:1718 - function
- `P$6` (hasIdeOnboardingBeenShown) - chunks.80.mjs:1292 - function
- `aX9` (markIdeOnboardingAsShown) - chunks.80.mjs:1298 - function
- `f$6` (isVsCodeIde) - chunks.80.mjs:1380 - function
- `Oh` (isJetBrainsIde) - chunks.80.mjs:1386 - function
- `Q01` (getDefaultIdeType) - chunks.80.mjs:1392 - function
- `wD9` (VSCODE_EXTENSION_ID) - chunks.80.mjs:1922 - constant (`"anthropic.claude-code"`)
- `oJz` (computeDiffEdits) - chunks.180.mjs:65 - function
- `nJz` (generateRandomId) - chunks.180.mjs (used in tabId generation) - function
- `rJz` (getFileBasename for tab) - chunks.180.mjs (used in tabName) - function
