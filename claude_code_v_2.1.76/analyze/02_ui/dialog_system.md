# Dialog Priority System

> Related Symbols:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP, Permissions

Key functions in this document:
- `getInputDialogType` (f11) - Priority dispatcher for all interactive dialogs, chunks.188.mjs:304
- `handleCancel` (N11) - Cancel handler with per-dialog behavior, chunks.188.mjs:328
- `ToolPermissionDialog` (_Wq) - Tool use approval dialog, chunks.188.mjs:1197
- `SandboxPermissionDialog` (wUA) - Network/sandbox approval dialog, chunks.188.mjs:1168
- `CostWarningDialog` (dMq) - API cost threshold warning, chunks.188.mjs:1261
- `IDEOnboardingDialog` (Nx7) - IDE extension setup, chunks.188.mjs:1268
- `LSPRecommendationDialog` (kLq) - LSP plugin suggestion, chunks.188.mjs:1271
- `MessageSelectorDialog` (fMq) - Conversation history browser, chunks.188.mjs:1337
- `ElicitationRouter` (WWq) - MCP elicitation dialog router, chunks.188.mjs:1247
- `WorkerSandboxDialog` (wUA) - Worker process sandbox permission, chunks.188.mjs:1211
- `WorkerRequestDisplay` (nQA) - Passive worker request display, chunks.188.mjs:1205

---

## Table of Contents

- [1. Architecture Overview](#1-architecture-overview)
- [2. Priority Dispatcher (f11)](#2-priority-dispatcher-f11)
  - [2.1 Priority Order Analysis](#21-priority-order-analysis)
  - [2.2 Animation Gate](#22-animation-gate)
  - [2.3 Blocked State Tracking](#23-blocked-state-tracking)
- [3. Dialog Catalog](#3-dialog-catalog)
  - [3.1 Tool Permission Dialog (_Wq)](#31-tool-permission-dialog-_wq)
  - [3.2 Sandbox Permission Dialog (wUA)](#32-sandbox-permission-dialog-wua)
  - [3.3 Worker Sandbox Permission Dialog (wUA)](#33-worker-sandbox-permission-dialog-wua)
  - [3.4 Elicitation Router (WWq)](#34-elicitation-router-wwq)
  - [3.5 Cost Warning Dialog (dMq)](#35-cost-warning-dialog-dmq)
  - [3.6 IDE Onboarding Dialog (Nx7)](#36-ide-onboarding-dialog-nx7)
  - [3.7 LSP Recommendation Dialog (kLq)](#37-lsp-recommendation-dialog-klq)
  - [3.8 Message Selector (fMq)](#38-message-selector-fmq)
  - [3.9 Worker Request Display (nQA)](#39-worker-request-display-nqa)
- [4. Cancel Behavior Matrix](#4-cancel-behavior-matrix)
- [5. Queue Management](#5-queue-management)
  - [5.1 Tool Permission Queue](#51-tool-permission-queue)
  - [5.2 Sandbox Permission Queue](#52-sandbox-permission-queue)
  - [5.3 Elicitation Queue](#53-elicitation-queue)
  - [5.4 Worker Sandbox Permission Queue](#54-worker-sandbox-permission-queue)
- [6. Concurrency and Queuing Invariants](#6-concurrency-and-queuing-invariants)
- [7. UI Linkage: Dialogs ↔ Spinner](#7-ui-linkage-dialogs--spinner)

---

## 1. Architecture Overview

The dialog system manages all interactive overlays in Claude Code's terminal UI. Only **one dialog can be visible at a time**. When multiple dialogs are needed simultaneously, they queue up and display sequentially.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DIALOG PRIORITY SYSTEM                           │
│                                                                      │
│  Trigger: f11() called every render                                 │
│  Returns: dialog-type string or undefined                           │
│                                                                      │
│  Priority Queue (highest → lowest):                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  1. "message-selector"  ← User browsing conversation history │   │
│  │  2. [streaming paused]  ← W$=true: ALL dialogs blocked       │   │
│  │  3. "sandbox-permission"← Network access request (urgent)    │   │
│  │  ─────── Animation Gate: vK.shouldContinueAnimation ──────── │   │
│  │  4. "tool-permission"   ← Tool approval required             │   │
│  │  5. "worker-sandbox"    ← Worker network access              │   │
│  │  6. "elicitation"       ← MCP server user input request      │   │
│  │  7. "cost"              ← API cost threshold warning         │   │
│  │  8. "ide-onboarding"    ← IDE extension setup                │   │
│  │  9. "lsp-recommendation"← LSP plugin suggestion              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Active dialog → blocks all lower-priority dialogs                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Priority Dispatcher (f11)

```javascript
// ============================================
// getInputDialogType - Priority dispatcher
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
    return
}

// READABLE (for understanding):
function getInputDialogType() {
    // Tier 0: Absolute blocks (no dialog shown at all)
    if (isSearchingInputHistory || fullScreenOverlay) return; // Search overlay or full-screen
    if (isMessageSelectorVisible) return "message-selector";  // User triggered selector
    if (isPaused) return;                                     // Streaming paused

    // Tier 1: Security-critical (always show immediately)
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Tier 2: Animation gate (lower-priority dialogs wait for animation)
    const canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation;

    if (canShowLowerPriority && toolUseConfirmQueue[0])           return "tool-permission";
    if (canShowLowerPriority && workerSandboxPermissions.queue[0]) return "worker-sandbox-permission";
    if (canShowLowerPriority && elicitationState.queue[0])        return "elicitation";
    if (canShowLowerPriority && showCostWarning)                  return "cost";
    if (canShowLowerPriority && showIdeOnboarding)                return "ide-onboarding";
    if (canShowLowerPriority && lspRecommendation)                return "lsp-recommendation";

    return; // No dialog
}

// Mapping: f11→getInputDialogType, s_→isSearchingInputHistory, fz→fullScreenOverlay,
// o_→isMessageSelectorVisible, W$→isPaused, oq→sandboxPermissionQueue,
// vK→toolJSX, F7→toolUseConfirmQueue, Z1→workerSandboxPermissions,
// E1→elicitationState, Yx→showCostWarning, k1→showIdeOnboarding, w6→lspRecommendation
```

### 2.1 Priority Order Analysis

The priority order reflects security and usability tradeoffs:

| Priority | Type | Rationale |
|----------|------|-----------|
| Block-all | `isSearchingInputHistory` | User is actively typing in search - any dialog would disrupt |
| Block-all | `fullScreenOverlay` | Full-screen overlay (setup screens) - exclusive focus |
| 1 | `message-selector` | User explicitly triggered - must respond to their intent |
| Block-below | `isPaused` | Streaming paused prevents lower-priority dialogs to avoid stacking |
| 2 | `sandbox-permission` | Network access: security-critical, always shown immediately |
| Gate | animation gate | Ensures animations complete before interactive dialogs appear |
| 3 | `tool-permission` | Tool approval: blocks execution - high urgency |
| 4 | `worker-sandbox` | Worker network access: security for worker processes |
| 5 | `elicitation` | MCP input request: non-security, can wait |
| 6 | `cost` | Cost threshold: informational, low urgency |
| 7 | `ide-onboarding` | Optional setup: background info |
| 8 | `lsp-recommendation` | Suggestion: lowest priority |

**Why `sandbox-permission` is above the animation gate:**
Network/sandbox access requests are triggered by active tool execution, which is already underway. Delaying them for animation completion could mean tools time out. The animation gate only applies to "informational" dialogs.

### 2.2 Animation Gate

The animation gate (`canShowLowerPriority`) is a critical mechanism:

```javascript
const canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation;
```

This is `false` when:
- A local JSX command is active (`toolJSX` is set) AND
- `toolJSX.shouldContinueAnimation` is `false` (default for local JSX commands)

**Effect:** When a user runs `/help`, `/clear`, or other local JSX commands:
- Tool permissions queued during that time will NOT show until the command finishes
- Elicitation requests will NOT interrupt the user's reading
- The user sees only the command output until they close it

**Intentional design:** This prevents jarring UI flashes where a tool permission dialog appears over a half-rendered command output. The animation completes, then the queued dialog appears.

**`shouldContinueAnimation: true` case:** Some spinner states (streaming) set `shouldContinueAnimation: true`, meaning even during animation, the gate allows lower-priority dialogs to show. This is the common case during normal LLM streaming.

### 2.3 Blocked State Tracking

The dispatcher also calculates `V11` (blocked items):
```javascript
// chunks.188.mjs:319
let V11 = W$ && (oq[0] || F7[0] || Z1.queue[0] || E1.queue[0] || Yx);
```

`V11` is `true` when streaming is paused AND there are queued dialogs waiting. This is used to show a visual indicator: "N dialogs waiting." When the user unpauses, all queued dialogs will present in priority order.

---

## 3. Dialog Catalog

### 3.1 Tool Permission Dialog (_Wq)

**Trigger:** Agent loop requests execution of a tool that requires user confirmation (based on permission mode and tool settings).

**Render condition:** `XO === "tool-permission" && toolUseConfirmQueue[0]`

```javascript
// chunks.188.mjs:1197-1204
XO === "tool-permission" && V7.createElement(_Wq, {
    key: F7[0]?.toolUseID,             // Unique key per request
    onDone: () => f8(([k6, ...q8]) => q8), // Remove head: [head, ...rest] → rest
    onReject: rc,                       // Execute rejection flow
    toolUseConfirm: F7[0],             // Current request data
    toolUseContext: J0(W4, W4, O3 ?? Aq(), [], void 0, Y1),
    verbose: S,
    workerBadge: F7[0]?.workerBadge    // Shows which worker is asking
})
```

**What `toolUseConfirm` contains:**
```typescript
{
    toolUseID: string,          // The specific tool use instance
    toolName: string,           // Tool name (e.g., "Bash")
    input: object,              // Tool input arguments
    onAbort: () => void,        // Cancel this tool use
    recheckPermission: () => void, // Re-check after permission context changes
    workerBadge?: string        // Worker ID (for team mode)
}
```

**`onDone` flow:**
```javascript
// Remove head of queue: [approved, ...remaining] → remaining
f8(([approved, ...remaining]) => remaining)
```
After approval, the head is removed. If there are more queued requests, the next one appears automatically because `f11()` will return `"tool-permission"` again for `F7[0]`.

**`onReject` flow (`rc` callback):**
```javascript
// chunks.188.mjs:341-351
const rejectAndRestoreInput = useCallback(async () => {
    // Get the previous queued input
    let prevInput = await getPreviousQueuedMessage(inputValue, 0, async () => getAppState(), setAppState);
    if (!prevInput) return;
    // Restore the input box with the rejected command
    setInputValue(prevInput.text);
    setInputMode("prompt");
    if (prevInput.images.length > 0) addImages(prevInput.images);
}, [setAppState, setInputValue, setInputMode, inputValue, addImages]);
```

**Key behavior:** Rejection restores the user's original input text so they can modify it and re-submit, rather than losing their work.

**Spinner interaction:** `PG` (showSpinner) is `false` while tool permission queue is non-empty:
```javascript
PG = ... && F7.length === 0 && ...
```
The spinner hides because the execution is "waiting for user" rather than "waiting for LLM."

### 3.2 Sandbox Permission Dialog (wUA)

**Trigger:** The sandbox system attempts a network request to a domain not in the allowed list.

**Render condition:** `XO === "sandbox-permission" && sandboxPermissionQueue[0]`

```javascript
// chunks.188.mjs:1168-1196
XO === "sandbox-permission" && V7.createElement(wUA, {
    key: oq[0].hostPattern.host,
    hostPattern: oq[0].hostPattern,
    onUserResponse: (k6) => {
        let { allow: q8, persistToSettings: FA } = k6, Yq = oq[0];
        if (!Yq) return;
        let k7 = Yq.hostPattern.host;
        if (FA) {
            // Persist permission to local settings
            let X4 = { type: "addRules", rules: [{ toolName: xO, ruleContent: `domain:${k7}` }],
                       behavior: q8 ? "allow" : "deny", destination: "localSettings" };
            setAppState(p7 => ({ ...p7, toolPermissionContext: applyRule(p7.toolPermissionContext, X4) }));
            savePermission(X4);
            sandbox.refreshConfig();
        }
        // Resolve waiting promises for all entries with same host
        setSandboxPermissionQueue(queue =>
            queue.filter(entry => {
                if (entry.hostPattern.host === k7) { entry.resolvePromise(q8); return false; }
                return true;
            })
        )
    }
})
```

**`persistToSettings`:** When the user checks "Remember this decision," the rule is saved to `localSettings` via `savePermission(X4)`. This adds a `domain:hostname` rule to the tool permission context, so future requests to the same domain are auto-approved or auto-denied without prompting.

**Batch resolution:** Multiple sandbox requests to the same host (if queued) are all resolved at once via the `filter` that resolves all matching entries. This handles the case where a tool makes multiple requests to the same domain.

### 3.3 Worker Sandbox Permission Dialog (wUA)

**Trigger:** A worker process (background agent) requests network access in a team/swarm setup.

**Render condition:** `XO === "worker-sandbox-permission" && workerSandboxPermissions.queue[0]`

Uses the same `wUA` component as sandbox permissions but with additional:
- `workerName` in the queue entry (identifies which worker is asking)
- Calls `teamWorkerSandboxResponse(workerName, requestId, host, allow, teamName)` to notify the team coordinator
- Queue is stored in Zustand store (`workerSandboxPermissions.queue`), not local state

```javascript
// chunks.188.mjs:1211-1246
XO === "worker-sandbox-permission" && V7.createElement(wUA, {
    key: Z1.queue[0].requestId,
    hostPattern: { host: Z1.queue[0].host, port: undefined },
    onUserResponse: (k6) => {
        let { allow: q8, persistToSettings: FA } = k6, Yq = Z1.queue[0];
        if (!Yq) return;
        let k7 = Yq.host;
        if (bb4(Yq.workerName, Yq.requestId, k7, q8, J1?.teamName), FA && q8) {
            // Persist allow rule (never persist deny for workers)
            let X4 = { type: "addRules", rules: [...], behavior: "allow", destination: "localSettings" };
            setAppState(...); savePermission(X4); sandbox.refreshConfig();
        }
        setAppState(state => ({
            ...state,
            workerSandboxPermissions: {
                ...state.workerSandboxPermissions,
                queue: state.workerSandboxPermissions.queue.slice(1) // FIFO dequeue
            }
        }))
    }
})
```

**Why in Zustand vs. local state:** Worker requests come from background agents that don't have direct access to the REPL's React state. Zustand provides a centralized store that any part of the system can write to.

### 3.4 Elicitation Router (WWq)

See [elicitation_system.md](./elicitation_system.md) for complete analysis.

**Quick summary:**

**Trigger:** MCP server calls `elicitInput()`, which pushes to `elicitationState.queue`.

**Render condition:** `XO === "elicitation" && elicitationState.queue[0]`

```javascript
// chunks.188.mjs:1247-1260
XO === "elicitation" && V7.createElement(WWq, {
    event: E1.queue[0],
    onResponse: (k6, q8) => {
        let FA = E1.queue[0];
        if (FA) {
            setAppState(state => ({
                ...state,
                elicitation: { queue: state.elicitation.queue.slice(1) }
            }));
            FA.respond({ action: k6, content: q8 }); // Resolves MCP handler Promise
        }
    }
})
```

**Critical interaction:** Elicitation is blocked from cancel by `handleCancel`:
```javascript
if (focusedInputDialog === "elicitation") return; // NO-OP
```
The user must use the form's own Escape/Cancel button, which sends `{action: "cancel"}` to the MCP server gracefully.

### 3.5 Cost Warning Dialog (dMq)

**Trigger:** Session token count reaches 5x the threshold AND `hasAcknowledgedCostThreshold` is `false`.

```javascript
// chunks.188.mjs:368-372
useEffect(() => {
    if (tokenCount() >= 5 && !showCostWarning && !hasAcknowledgedCostThreshold) {
        trackEvent("tengu_cost_threshold_reached", {});
        if (shouldShowCostWarning()) setShowCostWarning(true);
    }
}, [messages, showCostWarning, hasAcknowledgedCostThreshold]);
```

**Render condition:** `XO === "cost"`

```javascript
// chunks.188.mjs:1261-1267
XO === "cost" && V7.createElement(dMq, {
    onDone: () => {
        setShowCostWarning(false);
        setHasAcknowledgedCostThreshold(true);  // Prevents re-triggering
        updateLocalSettings({ hasAcknowledgedCostThreshold: true }); // Persist
        trackEvent("tengu_cost_threshold_acknowledged", {});
    }
})
```

**Why `W0() >= 5` threshold:**
The cost counter (`W0()`) returns the number of turns since the session started. The threshold of 5 means the warning appears after ~5 user messages if the total token count per message is high. This is a proxy for "you've been using a lot of tokens."

**Acknowledgment persistence:** The `hasAcknowledgedCostThreshold` flag is saved to local settings. Once a user acknowledges the cost warning in a session, it never reappears (even across restarts until settings are cleared).

### 3.6 IDE Onboarding Dialog (Nx7)

**Trigger:** IDE extension is detected as missing and `showIdeOnboarding` is `true`.

**Render condition:** `XO === "ide-onboarding"`

```javascript
// chunks.188.mjs:1268-1270
XO === "ide-onboarding" && V7.createElement(Nx7, {
    onDone: () => setShowIdeOnboarding(false),
    installationStatus: ideInstallationStatus  // F6 = current IDE install state
})
```

**What `installationStatus` contains:** Information about which IDE (VS Code, Cursor, etc.) was detected and the current extension installation state. The dialog uses this to show tailored install instructions.

**Low priority rationale:** IDE onboarding is informational. It doesn't block tool execution or MCP servers. Showing it at the bottom of the priority list ensures it doesn't interrupt active work.

### 3.7 LSP Recommendation Dialog (kLq)

**Trigger:** LSP analysis detects that a language server plugin is available for the current file type.

**Render condition:** `XO === "lsp-recommendation"`

```javascript
// chunks.188.mjs:1271-1276
XO === "lsp-recommendation" && w6 && V7.createElement(kLq, {
    pluginName: w6.pluginName,
    pluginDescription: w6.pluginDescription,
    fileExtension: w6.fileExtension,
    handleResponse: r6,      // Callback: "install" or "dismiss"
    ...
})
```

**`w6` = `lspRecommendation`:** Set by `TLq()` hook (LSP recommendation engine). The engine checks if the user is working with files that have an associated LSP plugin available, and if so, recommends it once.

**Lowest priority:** This is a "nice to have" suggestion. It should never interrupt any actual work. If a tool permission and LSP recommendation are both queued, the user completes the tool permission first, then might see the LSP recommendation afterwards.

### 3.8 Message Selector (fMq)

**Trigger:** User presses the message selector keybinding (typically `Ctrl+R` or similar).

**Render condition:** `XO === "message-selector"` (highest priority after search/fullscreen blocks)

```javascript
// chunks.188.mjs:1337-...
XO === "message-selector" && V7.createElement(fMq, {
    messages: W4,
    normalizedMessageHistory: _D,
    onDone: Z$,                    // Submit handler (for restoring state)
    screen: y1,
    isAssistantResponding: _4,
    verbose: S,
    tools: bA,
    commands: RA,
    agentDefinitions: g,
    onOpenRateLimitOptions: wx,
    isMessageSelectorVisible: o_,
    ...
})
```

**What it does:** Shows a scrollable list of conversation history. The user can:
1. Browse past messages
2. Select a point to "restore" the conversation to
3. This triggers the "message restore" path in `handleSubmit`

**Why highest priority (after search):** The user explicitly triggered this with a keyboard shortcut. Any dialog appearing over it would be disorienting and disrespectful of their intent.

**`onDone: Z$`:** When the user selects a restoration point, the message selector calls `handleSubmit` with a `restoreState` parameter. This triggers the message restore flow which:
1. Truncates the conversation at the selected point
2. Optionally re-queries the agent with the truncated context
3. Updates todos and permission context to match the restore point

### 3.9 Worker Request Display (nQA)

**Not a dialog**, but a passive display that appears alongside dialogs:

```javascript
// chunks.188.mjs:1205-1213
q1 && V7.createElement(nQA, {
    toolName: q1.toolName,
    description: q1.description
})
t && V7.createElement(nQA, {
    toolName: "Network Access",
    description: `Waiting for leader to approve network access to ${t.host}`
})
```

**Render condition:** `pendingWorkerRequest` OR `pendingSandboxRequest` is set

**What it shows:** A passive banner "Worker X is waiting for the leader to approve [action]." This is visible to the team leader while they are in the middle of approving something else. It does NOT interact with the priority queue - it shows in addition to whatever dialog is active.

---

## 4. Cancel Behavior Matrix

The `handleCancel` function (`N11`) has distinct behavior for each dialog state:

```javascript
// ============================================
// handleCancel - Per-dialog cancel behavior
// Location: chunks.188.mjs:328-340
// ============================================

// Mapping: XO→focusedInputDialog, O7→streamMode, I6→isQueryInProgress,
// YK→resetLoadingState, F7→toolUseConfirmQueue, f8→setToolUseConfirmQueue,
// $O→remoteSession, O3→abortController
```

| `focusedInputDialog` | Escape/Cancel behavior | Rationale |
|---------------------|----------------------|-----------|
| `"elicitation"` | **NO-OP** | MCP server is waiting; use dialog's own cancel |
| `"tool-permission"` | `onAbort()` + clear queue | Abort the specific tool, resume session |
| `"sandbox-permission"` | Standard abort | Abort API call |
| `"worker-sandbox-permission"` | Standard abort | Abort API call |
| `"cost"` | Standard abort | Abort API call (user can dismiss later) |
| `"ide-onboarding"` | Standard abort | Abort API call |
| `"lsp-recommendation"` | Standard abort | Abort API call |
| `"message-selector"` | Standard abort | Close selector (state managed by fMq internally) |
| `undefined` + remote | `remoteSession.cancelRequest()` | Cancel remote request |
| `undefined` + local | `abortController.abort()` | Cancel streaming API call |

**Tool permission abort detail:**
```javascript
if (focusedInputDialog === "tool-permission") {
    toolUseConfirmQueue[0]?.onAbort(); // Calls tool use's own abort handler
    setToolUseConfirmQueue([]);         // Clear ALL queued permissions
    // Note: does NOT call abortController.abort()
    // The agent loop continues but this specific tool use is aborted
}
```

Aborting a tool permission does NOT cancel the entire agent loop. The agent receives an "aborted" result for that specific tool use and can continue processing.

---

## 5. Queue Management

### 5.1 Tool Permission Queue

**Storage:** Local React state `F7` / `setToolUseConfirmQueue` (`f8`)

**How items are added:**
```javascript
// From agent loop (via callback in toolUseContext):
gb4(f8) // Registers f8 as the setter for tool permission queue
```
The `gb4` function stores the `setToolUseConfirmQueue` callback in a module-level registry. The agent loop calls it when a tool requires permission.

**Queue item structure:**
```typescript
{
    toolUseID: string,
    toolName: string,
    input: object,
    onAbort: () => void,      // Called when user rejects
    recheckPermission: () => void, // Re-evaluate after permission change
    workerBadge?: string
}
```

**Processing:**
- Display: `F7[0]` (head of queue)
- On approve: `f8(([head, ...rest]) => rest)` (dequeue head)
- On abort: `F7[0].onAbort(); f8([])` (abort + clear all)

**`recheckPermission`:** After the user changes permission settings (e.g., grants "always allow" for a tool), the agent loop calls `recheckPermission` on all queued items. If a queued tool is now auto-approved, it removes itself from the queue without requiring further user interaction.

### 5.2 Sandbox Permission Queue

**Storage:** Local React state `oq` / `setSandboxPermissionQueue` (`j5`)

**How items are added:**
```javascript
// From sandbox.initialize() callback (cN):
setSandboxPermissionQueue(prev => [...prev, {
    hostPattern: requestedHostPattern,
    resolvePromise: resolve  // Resolves the sandbox check Promise
}])
```

**Processing:**
- Display: `oq[0]` (head of queue)
- On response: Filter out all entries with matching host, resolve their Promises
- Never clears the whole queue at once (only resolved entries are removed)

### 5.3 Elicitation Queue

See [elicitation_system.md](./elicitation_system.md) for full detail.

**Storage:** Zustand store `elicitation.queue`

**How items are added:** Via `registerElicitationHandler` on MCP client connection.

**Processing:**
- Display: `E1.queue[0]`
- On response: `queue.slice(1)` (remove head) + `currentEvent.respond({action, content})`

### 5.4 Worker Sandbox Permission Queue

**Storage:** Zustand store `workerSandboxPermissions.queue`

**How items are added:** Worker processes send sandbox requests via the team coordination protocol, which pushes to the Zustand store.

**Processing:**
- Display: `Z1.queue[0]`
- On response: `queue.slice(1)` + `teamWorkerSandboxResponse(...)`

---

## 6. Concurrency and Queuing Invariants

The dialog system maintains several invariants:

**Invariant 1: Single active dialog**
Only one dialog type is active at a time. `f11()` returns at most one value per render cycle.

**Invariant 2: Queue ordering**
Each queue type (tool permission, sandbox, elicitation) is FIFO. The head (`queue[0]`) is always the oldest pending request.

**Invariant 3: No cross-queue starvation**
Higher-priority queues (sandbox) can preempt lower-priority queues (elicitation). When a sandbox request arrives while elicitation is showing, the elicitation remains visible until the user responds, THEN the sandbox dialog appears. The system does NOT interrupt mid-dialog.

**Invariant 4: Tool permission timing**
```javascript
// fY.current = when current tool permission dialog opened
// OY.current += time spent in tool-permission dialogs
// These are used to exclude tool-permission wait time from the "30 second query" calculation
```
Time spent waiting for user tool approval is subtracted from the "this query took too long" calculation, ensuring users aren't notified about slow queries when the slowness was their own approval delay.

---

## 7. UI Linkage: Dialogs ↔ Spinner

The dialog state is tightly linked to the spinner display:

```javascript
// PG (showSpinner) calculation:
PG = (!vK || vK.showSpinner === !0)     // Not blocked by local JSX
  && F7.length === 0                     // No tool permission queued
  && (_4 || Wz || L9 || xp7() > 0)     // Is loading, has user input, has running tasks, or has queued commands
  && !q1                                // No pending worker request
  && !MG                                // Not in "tool-only" mode
```

**Dialog → spinner interaction summary:**

| Dialog Active | Spinner Shows? | Explanation |
|--------------|---------------|-------------|
| tool-permission | No | `F7.length > 0` disables spinner |
| sandbox-permission | Yes | Spinner shows "waiting" while dialog is visible |
| worker-sandbox | Yes | Same as sandbox |
| elicitation | Yes (if loading) | Elicitation can appear during streaming |
| cost | Yes (if loading) | Cost warning can appear during streaming |
| ide-onboarding | Yes (if loading) | Background info |
| lsp-recommendation | Yes (if loading) | Suggestion info |
| None | Yes (if `_4` true) | Normal loading state |

**Key insight:** The tool permission dialog is the ONLY dialog that stops the spinner. This is intentional: tool permissions are "blocking" - the agent loop is literally paused waiting for user input. All other dialogs are "non-blocking" - the agent loop (or something else) is still running in the background.

**`Gw` (hasActiveDialogs):**
```javascript
Gw = F7.length > 0 || oq.length > 0 || E1.queue.length > 0 || Z1.queue.length > 0
```
This flag tracks whether ANY queue has items. It's used in:
1. `RP` (session feedback) - suppress feedback prompt while dialogs are active
2. `I1` (turn tracking) - don't count turns while waiting for user input
3. `PG` (spinner visibility) - only tool permissions suppress spinner

The distinction between `Gw` (any dialog) and `F7.length > 0` (tool permission only) in the spinner calculation is intentional and meaningful.
