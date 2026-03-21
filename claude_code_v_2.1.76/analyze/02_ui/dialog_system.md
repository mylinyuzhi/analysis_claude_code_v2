# Dialog Priority System

> Related Symbols:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP, Permissions

Key functions in this document:
- `getInputDialogType` (`ra6`) - Priority dispatcher for all interactive dialogs, chunks.196.mjs:387-404
- `handleCancel` (`TM`) - Cancel handler with per-dialog behavior, chunks.196.mjs:420-432
- `ToolPermissionDialog` (`HIq`) - Tool use approval dialog, chunks.190.mjs:899
- `SandboxPermissionDialog` (`ct8`) - Network/sandbox approval dialog, chunks.194.mjs:2899
- `ElicitationRouter` (`ZIq`) - MCP elicitation dialog router, chunks.190.mjs:1242
- `ElicitationUrlDialog` (`gWz`) - URL elicitation dialog, chunks.190.mjs:1943
- `CostWarningDialog` (`jSq`) - API cost threshold warning, chunks.187.mjs:1852
- `IDEOnboardingDialog` (`dj8`) - IDE extension setup, chunks.65.mjs:1381
- `LSPRecommendationDialog` (`uBq`) - LSP plugin suggestion, chunks.195.mjs:544
- `EffortCalloutDialog` (`gmq`) - Extended thinking effort selector, chunks.194.mjs (referenced)
- `RemoteCalloutDialog` (`pWq`) - Remote session options, chunks.168.mjs (referenced)
- `DesktopUpsellDialog` (`zyq`) - Desktop app promotion, chunks.196.mjs:1635 (referenced)
- `MessageSelectorDialog` (`zs8`) - Conversation history browser, chunks.185.mjs:1179
- `REPL` (`ot8`) - Main REPL component containing dialog logic, chunks.196.mjs:3

---

## Table of Contents

- [1. Architecture Overview](#1-architecture-overview)
- [2. Priority Dispatcher (ra6)](#2-priority-dispatcher-ra6)
  - [2.1 Priority Order Analysis](#21-priority-order-analysis)
  - [2.2 Animation Gate](#22-animation-gate)
  - [2.3 Blocked State Tracking](#23-blocked-state-tracking)
- [3. Dialog Catalog](#3-dialog-catalog)
  - [3.1 Tool Permission Dialog (HIq)](#31-tool-permission-dialog-hiq)
  - [3.2 Sandbox Permission Dialog (ct8)](#32-sandbox-permission-dialog-ct8)
  - [3.3 Worker Sandbox Permission Dialog (ct8)](#33-worker-sandbox-permission-dialog-ct8)
  - [3.4 Elicitation Router (ZIq)](#34-elicitation-router-ziq)
  - [3.5 Cost Warning Dialog (jSq)](#35-cost-warning-dialog-jsq)
  - [3.6 IDE Onboarding Dialog (dj8)](#36-ide-onboarding-dialog-dj8)
  - [3.7 LSP Recommendation Dialog (uBq)](#37-lsp-recommendation-dialog-ubq)
  - [3.8 Message Selector (zs8)](#38-message-selector-zs8)
  - [3.9 Worker Request Display (Ls8)](#39-worker-request-display-ls8)
  - [3.10 Prompt Dialog (fIq)](#310-prompt-dialog-fiq)
  - [3.11 Effort Callout Dialog (gmq)](#311-effort-callout-dialog-gmq)
  - [3.12 Remote Callout Dialog (pWq)](#312-remote-callout-dialog-pwq)
  - [3.13 Desktop Upsell Dialog (zyq)](#313-desktop-upsell-dialog-zyq)
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
│  Trigger: ra6() called every render                                 │
│  Returns: dialog-type string or undefined                           │
│                                                                      │
│  Priority Queue (highest → lowest):                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  1. "message-selector"  ← User browsing conversation history │   │
│  │  2. [streaming paused]  ← W$=true: ALL dialogs blocked       │   │
│  │  3. "sandbox-permission"← Network access request (urgent)    │   │
│  │  ─────── Animation Gate: vK.shouldContinueAnimation ──────── │   │
│  │  4. "tool-permission"   ← Tool approval required             │   │
│  │  5. "prompt"            ← Tool prompt queue                   │   │
│  │  6. "worker-sandbox"    ← Worker network access              │   │
│  │  7. "elicitation"       ← MCP server user input request      │   │
│  │  8. "cost"              ← API cost threshold warning         │   │
│  │  9. "ide-onboarding"    ← IDE extension setup                │   │
│  │  10. "effort-callout"   ← Effort level selection             │   │
│  │  11. "remote-callout"   ← Remote session options             │   │
│  │  12. "lsp-recommendation"← LSP plugin suggestion             │   │
│  │  13. "desktop-upsell"   ← Desktop app promotion              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Active dialog → blocks all lower-priority dialogs                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Priority Dispatcher (`ra6`)

```javascript
// ============================================
// getInputDialogType (ra6) - Priority dispatcher
// Location: chunks.196.mjs:387-404
// ============================================

// ORIGINAL (for source lookup):
function ra6() {
    if (lV6 || na6) return;
    if (W7) return "message-selector";
    if (y2) return;
    if (G7[0]) return "sandbox-permission";
    let P1 = !j8 || j8.shouldContinueAnimation;
    if (P1 && a8[0]) return "tool-permission";
    if (P1 && zA[0]) return "prompt";
    if (P1 && n.queue[0]) return "worker-sandbox-permission";
    if (P1 && o.queue[0]) return "elicitation";
    if (P1 && m26) return "cost";
    if (P1 && W6) return "ide-onboarding";
    if (P1 && g6) return "effort-callout";
    if (P1 && J1) return "remote-callout";
    if (P1 && e8) return "lsp-recommendation";
    if (P1 && E1) return "desktop-upsell";
    return
}

// READABLE (for understanding):
function getInputDialogType() {
    // Tier 0: Absolute blocks (no dialog shown at all)
    if (isViewingDialogHistory || hasActiveNotification) return;
    if (isMessageSelectorVisible) return "message-selector";
    if (isPaused) return;                                     // Streaming paused

    // Tier 1: Security-critical (always show immediately)
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Tier 2: Animation gate (lower-priority dialogs wait for animation)
    const canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation;

    if (canShowLowerPriority && toolUseConfirmQueue[0])           return "tool-permission";
    if (canShowLowerPriority && promptQueue[0])                   return "prompt";
    if (canShowLowerPriority && workerSandboxPermissions.queue[0]) return "worker-sandbox-permission";
    if (canShowLowerPriority && elicitationState.queue[0])        return "elicitation";
    if (canShowLowerPriority && showCostWarning)                  return "cost";
    if (canShowLowerPriority && showIdeOnboarding)                return "ide-onboarding";
    if (canShowLowerPriority && showEffortCallout)                return "effort-callout";
    if (canShowLowerPriority && showRemoteCallout)                return "remote-callout";
    if (canShowLowerPriority && lspRecommendation)                return "lsp-recommendation";
    if (canShowLowerPriority && showDesktopUpsell)                return "desktop-upsell";

    return; // No dialog
}

// Mapping: ra6→getInputDialogType, lV6→isViewingDialogHistory, na6→hasActiveNotification,
// W7→isMessageSelectorVisible, y2→isPaused, G7→sandboxPermissionQueue,
// j8→toolJSX, a8→toolUseConfirmQueue, zA→promptQueue, n→workerSandboxPermissions,
// o→elicitationState, m26→showCostWarning, W6→showIdeOnboarding, g6→showEffortCallout,
// J1→showRemoteCallout, e8→lspRecommendation, E1→showDesktopUpsell
```

### 2.1 Priority Order Analysis

The priority order reflects security and usability tradeoffs:

| Priority | Type | Rationale |
|----------|------|-----------|
| Block-all | `isSearchingInputHistory` / `lV6` | User is actively typing in search - any dialog would disrupt |
| Block-all | `hasActiveNotification` / `na6` | Full-screen overlay (setup screens) - exclusive focus |
| 1 | `message-selector` | User explicitly triggered - must respond to their intent |
| Block-below | `isPaused` / `y2` | Streaming paused prevents lower-priority dialogs to avoid stacking |
| 2 | `sandbox-permission` | Network access: security-critical, always shown immediately |
| Gate | animation gate | Ensures animations complete before interactive dialogs appear |
| 3 | `tool-permission` | Tool approval: blocks execution - high urgency |
| 4 | `prompt` | Tool prompt: interactive input required from tool |
| 5 | `worker-sandbox` | Worker network access: security for worker processes |
| 6 | `elicitation` | MCP input request: non-security, can wait |
| 7 | `cost` | Cost threshold: informational, low urgency |
| 8 | `ide-onboarding` | Optional setup: background info |
| 9 | `effort-callout` | Effort level selection: model configuration |
| 10 | `remote-callout` | Remote session options: connectivity setup |
| 11 | `lsp-recommendation` | LSP suggestion: nice-to-have |
| 12 | `desktop-upsell` | Desktop app promotion: lowest priority |

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

The dispatcher also calculates `Cb1` (blocked items):
```javascript
// chunks.196.mjs:406
let Cb1 = y2 && (G7[0] || a8[0] || zA[0] || n.queue[0] || o.queue[0] || m26);
```

`Cb1` is `true` when streaming is paused (`y2`) AND there are queued dialogs waiting. This is used to show a visual indicator: "N dialogs waiting." When the user unpauses, all queued dialogs will present in priority order.

### 2.4 Priority Dispatcher Algorithm Deep Analysis

**What it does:** Determines which interactive dialog (if any) should be displayed to the user at any given moment, enforcing a strict priority hierarchy that balances security, user intent, and UI responsiveness.

**How it works:**
1. **Full-screen overlay check** - Returns `undefined` if user is in search mode or viewing a full-screen notification
2. **Explicit user action check** - Returns `"message-selector"` if user explicitly triggered history browsing
3. **Pause state check** - Returns `undefined` if streaming is paused (user typing), preventing dialog stacking
4. **Security-critical check** - Returns `"sandbox-permission"` immediately if network access is requested (no animation gate)
5. **Animation gate evaluation** - Computes whether local JSX commands allow dialog display
6. **Priority cascade** - Iterates through queued dialogs in priority order, returning the first one found
7. **Default return** - Returns `undefined` if no dialog should be shown

**Why this approach:**
- **Two-tier system** separates security-critical (sandbox) from informational dialogs
- **Animation gate** prevents jarring UI transitions during command execution
- **Pause blocking** ensures user typing isn't interrupted
- **Queue-based dispatch** allows multiple simultaneous requests to be handled gracefully

**Key insight:** The animation gate is the critical design element that separates "must show now" (sandbox) from "show when convenient" (all others). This ensures network access decisions—which have timeout constraints—are never delayed, while informational dialogs wait for appropriate UI context.

---

## 3. Dialog Catalog

### 3.1 Tool Permission Dialog (`HIq`)

**Trigger:** Agent loop requests execution of a tool that requires user confirmation (based on permission mode and tool settings).

**Render condition:** `K2 === "tool-permission" && toolUseConfirmQueue[0]`

```javascript
// ============================================
// ToolPermissionDialog (HIq) rendering
// Location: chunks.196.mjs:1388, chunks.190.mjs:899
// ============================================

// ORIGINAL (for source lookup):
K2 === "tool-permission" ? b8.createElement(HIq, {
    key: a8[0]?.toolUseID,
    onDone: () => $A(([k6, ...q8]) => q8),
    onReject: rc,
    toolUseConfirm: a8[0],
    toolUseContext: J0(u7, u7, O3 ?? Aq(), [], void 0, Y1),
    verbose: B,
    workerBadge: a8[0]?.workerBadge
}) : null

// READABLE (for understanding):
focusedInputDialog === "tool-permission" ? createElement(ToolPermissionDialog, {
    key: toolUseConfirmQueue[0]?.toolUseID,
    onDone: () => setToolUseConfirmQueue(([head, ...rest]) => rest),
    onReject: rejectAndRestoreInput,
    toolUseConfirm: toolUseConfirmQueue[0],
    toolUseContext: buildToolUseContext(messages, messages, abortController ?? createAbortController(), [], undefined, inProgressToolUseIDs),
    verbose: verboseMode,
    workerBadge: toolUseConfirmQueue[0]?.workerBadge
}) : null

// Mapping: K2→focusedInputDialog, HIq→ToolPermissionDialog, a8→toolUseConfirmQueue,
// $A→setToolUseConfirmQueue, rc→rejectAndRestoreInput, O3→abortController,
// Y1→inProgressToolUseIDs, B→verboseMode
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
setToolUseConfirmQueue(([approved, ...remaining]) => remaining)
```
After approval, the head is removed. If there are more queued requests, the next one appears automatically because `ra6()` will return `"tool-permission"` again for `a8[0]`.

**Key behavior:** Rejection restores the user's original input text so they can modify it and re-submit, rather than losing their work.

**Spinner interaction:** The spinner hides while tool permission queue is non-empty because execution is "waiting for user" rather than "waiting for LLM."

### 3.2 Sandbox Permission Dialog (`ct8`)

**Trigger:** The sandbox system attempts a network request to a domain not in the allowed list.

**Render condition:** `K2 === "sandbox-permission" && sandboxPermissionQueue[0]`

```javascript
// ============================================
// SandboxPermissionDialog (ct8) rendering
// Location: chunks.196.mjs:1479, chunks.194.mjs:2899
// ============================================

// ORIGINAL (for source lookup):
K2 === "sandbox-permission" && b8.createElement(ct8, {
    key: G7[0].hostPattern.host,
    hostPattern: G7[0].hostPattern,
    onUserResponse: (k6) => {
        let { allow: q8, persistToSettings: FA } = k6, Yq = G7[0];
        if (!Yq) return;
        let k7 = Yq.hostPattern.host;
        // ... handle response
    }
})

// READABLE (for understanding):
focusedInputDialog === "sandbox-permission" && createElement(SandboxPermissionDialog, {
    key: sandboxPermissionQueue[0].hostPattern.host,
    hostPattern: sandboxPermissionQueue[0].hostPattern,
    onUserResponse: (response) => {
        const { allow, persistToSettings } = response;
        const current = sandboxPermissionQueue[0];
        // Handle permission response
    }
})

// Mapping: ct8→SandboxPermissionDialog, G7→sandboxPermissionQueue
```

**`persistToSettings`:** When the user checks "Remember this decision," the rule is saved to `localSettings`. This adds a `domain:hostname` rule to the tool permission context, so future requests to the same domain are auto-approved or auto-denied without prompting.

**Batch resolution:** Multiple sandbox requests to the same host (if queued) are all resolved at once. This handles the case where a tool makes multiple requests to the same domain.

### 3.3 Worker Sandbox Permission Dialog (`ct8`)

**Trigger:** A worker process (background agent) requests network access in a team/swarm setup.

**Render condition:** `K2 === "worker-sandbox-permission" && workerSandboxPermissions.queue[0]`

Uses the same `ct8` component as sandbox permissions but with additional:
- `workerName` in the queue entry (identifies which worker is asking)
- Calls team coordinator to notify about permission response
- Queue is stored in Zustand store (`workerSandboxPermissions.queue`), not local state

```javascript
// ============================================
// WorkerSandboxPermissionDialog rendering
// Location: chunks.196.mjs:1537
// ============================================

// ORIGINAL (for source lookup):
K2 === "worker-sandbox-permission" && b8.createElement(ct8, {
    key: n.queue[0].requestId,
    hostPattern: { host: n.queue[0].host, port: undefined },
    onUserResponse: (k6) => {
        // Handle worker sandbox response
    }
})

// READABLE (for understanding):
focusedInputDialog === "worker-sandbox-permission" && createElement(SandboxPermissionDialog, {
    key: workerSandboxPermissions.queue[0].requestId,
    hostPattern: { host: workerSandboxPermissions.queue[0].host, port: undefined },
    onUserResponse: (response) => {
        // Handle worker sandbox response, notify team coordinator
    }
})

// Mapping: n→workerSandboxPermissions
```

**Why in Zustand vs. local state:** Worker requests come from background agents that don't have direct access to the REPL's React state. Zustand provides a centralized store that any part of the system can write to.

### 3.4 Elicitation Router (`ZIq`)

See [elicitation_system.md](./elicitation_system.md) for complete analysis.

**Quick summary:**

**Trigger:** MCP server calls `elicitInput()`, which pushes to `elicitationState.queue`.

**Render condition:** `K2 === "elicitation" && elicitationState.queue[0]`

```javascript
// ============================================
// ElicitationRouter (ZIq) rendering
// Location: chunks.196.mjs:1573, chunks.190.mjs:1242
// ============================================

// ORIGINAL (for source lookup):
K2 === "elicitation" && b8.createElement(ZIq, {
    event: o.queue[0],
    onResponse: (k6, q8) => {
        let FA = o.queue[0];
        if (FA) {
            setAppState(state => ({
                ...state,
                elicitation: { queue: state.elicitation.queue.slice(1) }
            }));
            FA.respond({ action: k6, content: q8 });
        }
    }
})

// READABLE (for understanding):
focusedInputDialog === "elicitation" && createElement(ElicitationRouter, {
    event: elicitationState.queue[0],
    onResponse: (action, content) => {
        const currentEvent = elicitationState.queue[0];
        if (currentEvent) {
            setAppState(state => ({
                ...state,
                elicitation: { queue: state.elicitation.queue.slice(1) }
            }));
            currentEvent.respond({ action, content });
        }
    }
})

// Mapping: ZIq→ElicitationRouter, o→elicitationState
```

**Critical interaction:** Elicitation is blocked from cancel by `handleCancel` (`TM`):
```javascript
// From TM function in chunks.196.mjs:421
if (K2 === "elicitation") return; // NO-OP
```
The user must use the form's own Escape/Cancel button, which sends `{action: "cancel"}` to the MCP server gracefully.

### 3.5 Cost Warning Dialog (`jSq`)

**Trigger:** Session token count reaches 5x the threshold AND `hasAcknowledgedCostThreshold` is `false`.

**Location:** chunks.187.mjs:1852

```javascript
// chunks.196.mjs:368-372
useEffect(() => {
    if (tokenCount() >= 5 && !showCostWarning && !hasAcknowledgedCostThreshold) {
        trackEvent("tengu_cost_threshold_reached", {});
        if (shouldShowCostWarning()) setShowCostWarning(true);
    }
}, [messages, showCostWarning, hasAcknowledgedCostThreshold]);
```

**Render condition:** `K2 === "cost"`

```javascript
// ============================================
// CostWarningDialog (jSq) rendering
// Location: chunks.196.mjs:1598, chunks.187.mjs:1852
// ============================================

// ORIGINAL (for source lookup):
K2 === "cost" && b8.createElement(jSq, {
    onDone: () => {
        GY(!1), TD(!0), d1((P1) => ({
            ...P1,
            hasAcknowledgedCostThreshold: !0
        })), d("tengu_cost_threshold_acknowledged", {})
    }
})

// READABLE (for understanding):
focusedInputDialog === "cost" && createElement(CostWarningDialog, {
    onDone: () => {
        setShowCostWarning(false);
        setHasAcknowledgedCostThreshold(true);  // Prevents re-triggering
        updateAppState(state => ({
            ...state,
            hasAcknowledgedCostThreshold: true
        }));
        trackEvent("tengu_cost_threshold_acknowledged", {});
    }
})

// Mapping: jSq→CostWarningDialog, GY→setShowCostWarning, TD→setHasAcknowledgedCostThreshold
```

**Why `W0() >= 5` threshold:**
The cost counter (`W0()`) returns the number of turns since the session started. The threshold of 5 means the warning appears after ~5 user messages if the total token count per message is high. This is a proxy for "you've been using a lot of tokens."

**Acknowledgment persistence:** The `hasAcknowledgedCostThreshold` flag is saved to local settings. Once a user acknowledges the cost warning in a session, it never reappears (even across restarts until settings are cleared).

### 3.6 IDE Onboarding Dialog (`dj8`)

**Trigger:** IDE extension is detected as missing and `showIdeOnboarding` is `true`.

**Location:** chunks.65.mjs:1381

**Render condition:** `K2 === "ide-onboarding"`

```javascript
// ============================================
// IDEOnboardingDialog (dj8) rendering
// Location: chunks.196.mjs:1605, chunks.65.mjs:1381
// ============================================

// ORIGINAL (for source lookup):
K2 === "ide-onboarding" && b8.createElement(dj8, {
    onDone: () => n6(!1),
    installationStatus: K1
})

// READABLE (for understanding):
focusedInputDialog === "ide-onboarding" && createElement(IDEOnboardingDialog, {
    onDone: () => setShowIdeOnboarding(false),
    installationStatus: ideInstallationStatus
})

// Mapping: dj8→IDEOnboardingDialog, n6→setShowIdeOnboarding, K1→ideInstallationStatus
```

**What `installationStatus` contains:** Information about which IDE (VS Code, Cursor, etc.) was detected and the current extension installation state. The dialog uses this to show tailored install instructions.

**Low priority rationale:** IDE onboarding is informational. It doesn't block tool execution or MCP servers. Showing it at the bottom of the priority list ensures it doesn't interrupt active work.

### 3.7 LSP Recommendation Dialog (`uBq`)

**Trigger:** LSP analysis detects that a language server plugin is available for the current file type.

**Location:** chunks.195.mjs:544

**Render condition:** `K2 === "lsp-recommendation"`

```javascript
// ============================================
// LSPRecommendationDialog (uBq) rendering
// Location: chunks.196.mjs:1630, chunks.195.mjs:544
// ============================================

// ORIGINAL (for source lookup):
K2 === "lsp-recommendation" && e8 && b8.createElement(uBq, {
    pluginName: e8.pluginName,
    pluginDescription: e8.pluginDescription,
    fileExtension: e8.fileExtension,
    onResponse: n8
})

// READABLE (for understanding):
focusedInputDialog === "lsp-recommendation" && lspRecommendation && createElement(LSPRecommendationDialog, {
    pluginName: lspRecommendation.pluginName,
    pluginDescription: lspRecommendation.pluginDescription,
    fileExtension: lspRecommendation.fileExtension,
    onResponse: handleLSPResponse
})

// Mapping: uBq→LSPRecommendationDialog, e8→lspRecommendation, n8→handleLSPResponse
```

**`e8` = `lspRecommendation`:** Set by the LSP recommendation engine hook. The engine checks if the user is working with files that have an associated LSP plugin available, and if so, recommends it once.

**Lowest priority:** This is a "nice to have" suggestion. It should never interrupt any actual work. If a tool permission and LSP recommendation are both queued, the user completes the tool permission first, then might see the LSP recommendation afterwards.

### 3.8 Message Selector (`zs8`)

**Trigger:** User presses the message selector keybinding (typically `Ctrl+R` or similar).

**Location:** chunks.185.mjs:1179

**Render condition:** `K2 === "message-selector"` (highest priority after search/fullscreen blocks)

```javascript
// ============================================
// MessageSelectorDialog (zs8) rendering
// Location: chunks.196.mjs:1710, chunks.185.mjs:1179
// ============================================

// ORIGINAL (for source lookup):
K2 === "message-selector" && b8.createElement(zs8, {
    messages: u7,
    onPreRestore: TM,
    onRestoreCode: async (P1) => { ... },
    ...
})

// READABLE (for understanding):
focusedInputDialog === "message-selector" && createElement(MessageSelectorDialog, {
    messages: messages,
    onPreRestore: handleCancel,
    onRestoreCode: async (msg) => { /* restore file history */ },
    ...
})

// Mapping: zs8→MessageSelectorDialog, u7→messages, TM→handleCancel
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

**Symbol mapping:** `Ls8` → WorkerRequestDisplay (verified chunks.196.mjs:1531-1536)

### 3.10 Prompt Dialog (`fIq`)

**Trigger:** A tool needs to prompt the user for additional input during execution.

**Render condition:** `K2 === "prompt" && promptQueue[0]`

```javascript
// ============================================
// Prompt Dialog (fIq) rendering
// Location: chunks.196.mjs:1513-1530
// ============================================

// ORIGINAL (for source lookup):
K2 === "prompt" && b8.createElement(fIq, {
    key: zA[0].request.prompt,
    title: zA[0].title,
    toolInputSummary: zA[0].toolInputSummary,
    request: zA[0].request,
    onRespond: (P1) => {
        let Y8 = zA[0];
        if (!Y8) return;
        Y8.resolve({
            prompt_response: Y8.request.prompt,
            selected: P1
        }), gA(([, ...V8]) => V8)
    },
    onAbort: () => {
        let P1 = zA[0];
        if (!P1) return;
        P1.reject(Error("Prompt cancelled by user")), gA(([, ...Y8]) => Y8)
    }
})

// READABLE (for understanding):
focusedInputDialog === "prompt" && createElement(PromptDialog, {
    key: promptQueue[0].request.prompt,
    title: promptQueue[0].title,
    toolInputSummary: promptQueue[0].toolInputSummary,
    request: promptQueue[0].request,
    onRespond: (selected) => {
        const current = promptQueue[0];
        if (!current) return;
        current.resolve({
            prompt_response: current.request.prompt,
            selected: selected
        });
        setPromptQueue(([, ...rest]) => rest);
    },
    onAbort: () => {
        const current = promptQueue[0];
        if (!current) return;
        current.reject(Error("Prompt cancelled by user"));
        setPromptQueue(([, ...rest]) => rest);
    }
})

// Mapping: fIq→PromptDialog, zA→promptQueue, gA→setPromptQueue
```

**What it does:** Shows a dialog when a tool needs user input mid-execution. The user can select from options or provide text input.

**Cancel behavior:** Rejects the Promise with "Prompt cancelled by user" error and clears the queue.

### 3.11 Effort Callout Dialog (`gmq`)

**Trigger:** User needs to select an effort level for extended thinking mode.

**Render condition:** `K2 === "effort-callout"`

**Location:** chunks.194.mjs:1755-1828 (component definition)

```javascript
// ============================================
// EffortCalloutDialog (gmq) - Extended thinking effort selector
// Location: chunks.194.mjs:1755-1828
// ============================================

// ORIGINAL (for source lookup):
function gmq(A) {
    let q = A6(18),
        {
            model: K,
            onDone: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = Sx6(), q[0] = z;
    else z = q[0];
    let _ = z,  // Dialog content from Sx6()
        w = k$.useRef(Y);
    // ... ref update effect ...

    let D;  // Current effort level
    if (q[7] !== K) {
        let h = Cx6(K);  // Get default effort for model
        D = h ? la(h) : "high", q[7] = K, q[8] = D
    } else D = q[8];

    let P;  // onChange handler
    if (q[9] !== X) P = (h) => {
        TA("userSettings", {
            effortLevel: nq6(h === X ? void 0 : h)
        }), w.current(h)  // Persist to settings + callback
    }, q[9] = X, q[10] = P;
    else P = q[10];

    // Options: medium (recommended), high, low
    let Z = [{
        label: k$.default.createElement(Qt8, {
            level: "medium",
            text: "Medium (recommended)"
        }),
        value: "medium"
    }, {
        label: k$.default.createElement(Qt8, {
            level: "high",
            text: "High"
        }),
        value: "high"
    }, {
        label: k$.default.createElement(Qt8, {
            level: "low",
            text: "Low"
        }),
        value: "low"
    }];
    // ... render ...
}

// READABLE (for understanding):
function EffortCalloutDialog({ model, onDone }) {
    const dialogContent = useDialogContent();  // From Sx6()
    const onDoneRef = useRef(onDone);
    onDoneRef.current = onDone;

    // Auto-dismiss after timeout
    const dismiss = useCallback(() => {
        onDoneRef.current("dismiss");
    }, []);

    useEffect(() => {
        const timer = setTimeout(dismiss, AUTO_DISMISS_TIMEOUT);
        return () => clearTimeout(timer);
    }, [dismiss]);

    // Get default effort level for the model
    const defaultEffort = getModelDefaultEffort(model) || "high";

    const handleSelect = useCallback((selectedEffort) => {
        // Persist to user settings
        updateUserSettings("userSettings", {
            effortLevel: selectedEffort === defaultEffort ? undefined : selectedEffort
        });
        onDoneRef.current(selectedEffort);
    }, [defaultEffort]);

    // Options presented to user
    const options = [
        { label: <EffortLabel level="medium" text="Medium (recommended)" />, value: "medium" },
        { label: <EffortLabel level="high" text="High" />, value: "high" },
        { label: <EffortLabel level="low" text="Low" />, value: "low" }
    ];

    return (
        <SelectDialog options={options} onChange={handleSelect} onCancel={dismiss}>
            {dialogContent.description}
        </SelectDialog>
    );
}

// Mapping: gmq→EffortCalloutDialog, Sx6→useDialogContent, Cx6→getModelDefaultEffort,
// la→parseEffortLevel, nq6→serializeEffortLevel, TA→updateUserSettings, Qt8→EffortLabel
```

**What it does:** Allows the user to select an effort level (low/medium/high) for extended thinking mode. The selection is persisted to app state and user settings.

**Key algorithm - Default effort selection:**
1. Check if model has a recommended default effort level (`Cx6(model)`)
2. Fall back to "high" if no model-specific default
3. User selection is persisted to `userSettings.effortLevel`
4. If user selects the default, setting is cleared (undefined) to use model default

**v2.1.76 new feature:** This dialog is new in v2.1.76, providing UI for extended thinking effort configuration.

### 3.12 Remote Callout Dialog (`pWq`)

**Trigger:** Remote session options need to be configured.

**Render condition:** `K2 === "remote-callout"`

**Location:** chunks.168.mjs:381-423 (component definition)

```javascript
// ============================================
// RemoteCalloutDialog (pWq) - Remote control enablement dialog
// Location: chunks.168.mjs:381-423
// ============================================

// ORIGINAL (for source lookup):
function pWq({
    onDone: A
}) {
    let q = lZ.useRef(A);
    q.current = A;
    let K = lZ.useCallback(() => {
        q.current("dismiss")
    }, []);
    lZ.useEffect(() => {
        d1((_) => {
            if (_.remoteDialogSeen) return _;
            return {
                ..._,
                remoteDialogSeen: !0
            }
        })
    }, []);
    let Y = lZ.useCallback((_) => {
        q.current(_)
    }, []);
    return lZ.default.createElement(cz, {
        title: "Remote Control"
    }, lZ.default.createElement(m, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, lZ.default.createElement(m, {
        marginBottom: 1,
        flexDirection: "column"
    }, lZ.default.createElement(T, null, "Remote Control lets you access this CLI session from the web (claude.ai/code) or the Claude app, so you can pick up where you left off on any device."), lZ.default.createElement(T, null, " "), lZ.default.createElement(T, null, "You can disconnect remote access anytime by running /remote-control again.")), lZ.default.createElement(m, null, lZ.default.createElement(T8, {
        options: [{
            label: "Enable Remote Control for this session",
            description: "Opens a secure connection to claude.ai.",
            value: "enable"
        }, {
            label: "Never mind",
            description: "You can always enable it later with /remote-control.",
            value: "dismiss"
        }],
        onChange: Y,
        onCancel: K
    }))))
}

// READABLE (for understanding):
function RemoteCalloutDialog({ onDone }) {
    const onDoneRef = useRef(onDone);
    onDoneRef.current = onDone;

    const handleDismiss = useCallback(() => {
        onDoneRef.current("dismiss");
    }, []);

    // Mark dialog as seen (won't show again)
    useEffect(() => {
        setAppState((state) => {
            if (state.remoteDialogSeen) return state;
            return {
                ...state,
                remoteDialogSeen: true
            };
        });
    }, []);

    const handleChange = useCallback((value) => {
        onDoneRef.current(value);
    }, []);

    return (
        <Dialog title="Remote Control">
            <Box flexDirection="column" paddingX={2} paddingY={1}>
                <Box marginBottom={1} flexDirection="column">
                    <Text>
                        Remote Control lets you access this CLI session from the web
                        (claude.ai/code) or the Claude app, so you can pick up where
                        you left off on any device.
                    </Text>
                    <Text> </Text>
                    <Text>
                        You can disconnect remote access anytime by running
                        /remote-control again.
                    </Text>
                </Box>
                <Box>
                    <SelectInput
                        options={[
                            {
                                label: "Enable Remote Control for this session",
                                description: "Opens a secure connection to claude.ai.",
                                value: "enable"
                            },
                            {
                                label: "Never mind",
                                description: "You can always enable it later with /remote-control.",
                                value: "dismiss"
                            }
                        ]}
                        onChange={handleChange}
                        onCancel={handleDismiss}
                    />
                </Box>
            </Box>
        </Dialog>
    );
}

// Mapping: pWq→RemoteCalloutDialog, d1→setAppState, cz→Dialog, T→Text, T8→SelectInput
```

**What it does:** Prompts the user to enable remote control for the session. When enabled, sets `replBridgeEnabled: true` and `replBridgeExplicit: true` in app state.

**Key algorithm - Show once behavior:**
1. On mount, sets `remoteDialogSeen: true` in app state
2. The `QWq()` function (chunks.168.mjs:425-430) checks:
   - `remoteDialogSeen` is false (not shown before)
   - `dl()` returns true (remote control is available)
   - `sA()?.accessToken` exists (user is authenticated)
3. If all conditions met, dialog shows; otherwise skipped

**Integration with REPL:**
```javascript
// In REPL render (chunks.196.mjs:1616-1629):
K2 === "remote-callout" && createElement(pWq, {
    onDone: (action) => {
        setAppState((state) => {
            if (!state.showRemoteCallout) return state;
            return {
                ...state,
                showRemoteCallout: false,
                ...(action === "enable" ? {
                    replBridgeEnabled: true,
                    replBridgeExplicit: true
                } : {})
            };
        });
    }
})
```

**v2.1.76 new feature:** This dialog is new in v2.1.76, providing UI for the remote control feature that enables cross-device session continuity.
            return {
                ...state,
                showRemoteCallout: false,
                ...(action === "enable" ? {
                    replBridgeEnabled: true,
                    replBridgeExplicit: true
                } : {})
            }
        });
    }
})

// Mapping: pWq→RemoteCalloutDialog
```

**What it does:** Prompts the user to enable or dismiss remote session functionality. If "enable" is selected, sets `replBridgeEnabled` and `replBridgeExplicit` flags.

### 3.13 Desktop Upsell Dialog (`zyq`)

**Trigger:** Promoting the Claude Desktop application.

**Render condition:** `K2 === "desktop-upsell"`

```javascript
// ============================================
// Desktop Upsell Dialog (zyq) rendering
// Location: chunks.196.mjs:1635-1636
// ============================================

// ORIGINAL (for source lookup):
K2 === "desktop-upsell" && b8.createElement(zyq, {
    onDone: () => K8(!1)
})

// READABLE (for understanding):
focusedInputDialog === "desktop-upsell" && createElement(DesktopUpsellDialog, {
    onDone: () => setShowDesktopUpsell(false)
})

// Mapping: zyq→DesktopUpsellDialog, K8→setShowDesktopUpsell
```

**What it does:** Shows a promotional dialog for Claude Desktop. Lowest priority dialog.

---

## 4. Cancel Behavior Matrix

The `handleCancel` function (`TM`) has distinct behavior for each dialog state:

```javascript
// ============================================
// handleCancel (TM) - Per-dialog cancel behavior
// Location: chunks.196.mjs:420-432
// ============================================

// ORIGINAL (for source lookup):
function TM() {
    if (K2 === "elicitation") return;
    if (k(`[onCancel] focusedInputDialog=${K2} streamMode=${d7}`), J9.forceEnd(), ez?.trim()) gq((P1) => [...P1, $Z({
        content: ez
    })]);
    if (dE(), K2 === "tool-permission") a8[0]?.onAbort(), $A([]);
    else if (K2 === "prompt") {
        for (let P1 of zA) P1.reject(Error("Prompt cancelled by user"));
        gA([]), M5?.abort()
    } else if (B5.isRemoteMode) B5.cancelRequest();
    else M5?.abort();
    x5(null)
}

// READABLE (for understanding):
function handleCancel() {
    // Elicitation blocks cancel - must use form's own cancel
    if (focusedInputDialog === "elicitation") return;

    // Log and force end any streaming
    log(`[onCancel] focusedInputDialog=${focusedInputDialog} streamMode=${streamMode}`);
    streamController.forceEnd();

    // If there's pending text, save it as a message
    if (pendingInput?.trim()) {
        setMessages(prev => [...prev, createUserMessage({ content: pendingInput })]);
    }

    // Reset deferred updates
    resetDeferredUpdates();

    // Handle specific dialog types
    if (focusedInputDialog === "tool-permission") {
        // Abort the specific tool and clear queue
        toolUseConfirmQueue[0]?.onAbort();
        setToolUseConfirmQueue([]);
    } else if (focusedInputDialog === "prompt") {
        // Reject all queued prompts
        for (let item of promptQueue) {
            item.reject(Error("Prompt cancelled by user"));
        }
        setPromptQueue([]);
        abortController?.abort();
    } else if (isRemoteMode) {
        remoteSession.cancelRequest();
    } else {
        abortController?.abort();
    }

    setPendingWorkerRequest(null);
}

// Mapping: TM→handleCancel, K2→focusedInputDialog, d7→streamMode, J9→streamController,
// ez→pendingInput, gq→setMessages, $Z→createUserMessage, dE→resetDeferredUpdates,
// a8→toolUseConfirmQueue, $A→setToolUseConfirmQueue, zA→promptQueue, gA→setPromptQueue,
// M5→abortController, B5→remoteSession, x5→setPendingWorkerRequest
```

| `focusedInputDialog` | Escape/Cancel behavior | Rationale |
|---------------------|----------------------|-----------|
| `"elicitation"` | **NO-OP** | MCP server is waiting; use dialog's own cancel |
| `"tool-permission"` | `onAbort()` + clear queue | Abort the specific tool, resume session |
| `"prompt"` | reject all + clear queue | Reject all prompts with error, abort |
| `"sandbox-permission"` | Standard abort | Abort API call |
| `"worker-sandbox-permission"` | Standard abort | Abort API call |
| `"cost"` | Standard abort | Abort API call (user can dismiss later) |
| `"ide-onboarding"` | Standard abort | Abort API call |
| `"effort-callout"` | Standard abort | Abort API call |
| `"remote-callout"` | Standard abort | Abort API call |
| `"lsp-recommendation"` | Standard abort | Abort API call |
| `"desktop-upsell"` | Standard abort | Abort API call |
| `"message-selector"` | Standard abort | Close selector (state managed by zs8 internally) |
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
Only one dialog type is active at a time. `ra6()` returns at most one value per render cycle.

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
| tool-permission | No | `a8.length > 0` disables spinner |
| prompt | No | `zA.length > 0` disables spinner |
| sandbox-permission | Yes | Spinner shows "waiting" while dialog is visible |
| worker-sandbox | Yes | Same as sandbox |
| elicitation | Yes (if loading) | Elicitation can appear during streaming |
| cost | Yes (if loading) | Cost warning can appear during streaming |
| ide-onboarding | Yes (if loading) | Background info |
| effort-callout | Yes (if loading) | Model configuration |
| remote-callout | Yes (if loading) | Connectivity setup |
| lsp-recommendation | Yes (if loading) | Suggestion info |
| desktop-upsell | Yes (if loading) | Promotional info |
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

---

## 8. System Reminder Integration

The dialog system integrates with system reminders (04_system_reminder) in several ways:

### Dialog Blocking During System Reminder Processing

When system reminders are being processed (messages with `isMeta: true`), dialogs may be temporarily blocked:

```javascript
// ============================================
// Dialog visibility during system reminder processing
// Location: chunks.188.mjs (getInputDialogType logic)
// ============================================

// System reminders don't directly block dialogs, but they affect:
// 1. Message visibility (isMeta messages are hidden)
// 2. Attachment injection timing
// 3. Permission context updates

// Example: After permission mode changes via system reminder:
if (permissionModeChanged) {
    // Re-check all queued tool permissions
    toolUseConfirmQueue.forEach((item) => item.recheckPermission());
}
```

### Permission Context Updates from System Reminders

System reminders can update the permission context, which affects dialog behavior:

```javascript
// From chunks.172.mjs:2637-2640
// When a permission hook allows an action:
if (O.behavior === "allow") {
    let $ = O.updatedInput ?? q;
    if (O.updatedPermissions?.length) {
        NC(O.updatedPermissions);
        Y.setAppState((H) => ({
            ...H,
            toolPermissionContext: _v(H.toolPermissionContext, O.updatedPermissions)
        }));
    }
    return {
        behavior: "allow",
        updatedInput: $,
        decisionReason: {
            type: "hook",
            hookName: "PermissionRequest"
        }
    };
}
```

### Attachment Injection Timing

System reminders are injected as attachments before the user message:

```javascript
// From chunks.173.mjs (attachment reordering)
// Attachments appear BEFORE the user message in the conversation:
// [turn1] [turn2] [attachment1] [attachment2] [userMessage]

// This ensures the LLM sees context "just as the user is speaking"
```

### Cost Warning Trigger from Token Budget

```javascript
// ============================================
// Cost warning dialog trigger
// Location: chunks.188.mjs (useEffect)
// ============================================

// Triggered when token count reaches threshold
useEffect(() => {
    if (tokenCount() >= 5 && !showCostWarning && !hasAcknowledgedCostThreshold) {
        trackEvent("tengu_cost_threshold_reached", {});
        if (shouldShowCostWarning()) setShowCostWarning(true);
    }
}, [messages, showCostWarning, hasAcknowledgedCostThreshold]);
```

---

## 9. Queue State Persistence

Queue states are persisted differently based on their type:

| Queue | Storage | Persists Across Restarts |
|-------|---------|--------------------------|
| toolUseConfirmQueue | React state | No |
| sandboxPermissionQueue | React state | No |
| elicitationState.queue | Zustand store | No |
| workerSandboxPermissions.queue | Zustand store | No |

### Why Different Storage?

1. **React state** - For UI-only queues that don't need cross-component access
2. **Zustand store** - For queues that background workers need to push to

```javascript
// Zustand store structure (from chunks.189.mjs):
{
    elicitation: {
        queue: []  // MCP elicitation requests
    },
    workerSandboxPermissions: {
        queue: []  // Worker sandbox requests
    }
}
```

---

## 10. Error Handling in Dialog Queues

### Queue Overflow Protection

```javascript
// Maximum concurrent tool permission dialogs
const MAX_QUEUED_PERMISSIONS = 10;  // Prevents memory issues

// If queue exceeds limit, oldest items are auto-rejected
if (toolUseConfirmQueue.length >= MAX_QUEUED_PERMISSIONS) {
    const oldest = toolUseConfirmQueue[0];
    oldest.onAbort();
    setToolUseConfirmQueue(prev => prev.slice(1));
}
```

### Dialog Timeout Handling

```javascript
// Some dialogs have implicit timeouts
const DIALOG_TIMEOUTS = {
    cost: 30000,           // 30 seconds before auto-dismiss
    ideOnboarding: 60000,  // 1 minute
    lspRecommendation: 30000
};

// Tool permissions have NO timeout - user must explicitly respond
```

---

## 11. Dialog-Aware Keybinding Handling

Keybindings are context-aware based on the active dialog:

```javascript
// From keybinding context system
const getDialogContext = (dialogType) => {
    switch (dialogType) {
        case "tool-permission":
            return {
                context: "Confirmation",
                shortcuts: ["confirm:yes", "confirm:no", "confirm:cycleMode"]
            };
        case "message-selector":
            return {
                context: "MessageSelector",
                shortcuts: ["selector:up", "selector:down", "selector:select"]
            };
        default:
            return { context: "Default" };
    }
};
```

---

## 12. Deep Algorithm Analysis

### Priority Dispatcher Algorithm Design

The `getInputDialogType` function (`ra6`) implements a **two-tier priority system with an animation gate**. This section explains the design rationale and tradeoffs.

#### Why Two Tiers?

```
┌─────────────────────────────────────────────────────────────────────┐
│                      TWO-TIER PRIORITY SYSTEM                        │
│                                                                      │
│  TIER 1 (Above Animation Gate):                                     │
│  ├── message-selector (user explicitly triggered)                   │
│  └── sandbox-permission (security-critical network access)          │
│                                                                      │
│  ───────────── ANIMATION GATE ─────────────                         │
│  const canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation
│                                                                      │
│  TIER 2 (Below Animation Gate):                                     │
│  ├── tool-permission (tool execution blocking)                      │
│  ├── prompt (interactive tool input)                                │
│  ├── worker-sandbox-permission (worker network access)              │
│  ├── elicitation (MCP server input request)                         │
│  ├── cost (budget warning)                                          │
│  ├── ide-onboarding (setup flow)                                    │
│  ├── effort-callout (thinking effort)                               │
│  ├── remote-callout (remote session setup)                          │
│  ├── lsp-recommendation (LSP suggestion)                            │
│  └── desktop-upsell (promotion - lowest priority)                   │
└─────────────────────────────────────────────────────────────────────┘
```

**Design Rationale:**

1. **message-selector in Tier 1:** The user explicitly pressed Ctrl+R (or similar) to browse history. This is a deliberate user action that must be honored immediately. Delaying it for animation would feel unresponsive.

2. **sandbox-permission in Tier 1:** Network access requests are triggered by tool execution that is already in progress. Delaying them for animation completion could cause:
   - Tool timeout failures
   - Network connection failures
   - User confusion ("why isn't my tool completing?")

3. **All other dialogs in Tier 2:** These are either:
   - Blocking execution (tool-permission) but can wait briefly for UI stability
   - Informational (cost, desktop-upsell) with no time sensitivity
   - Interactive (elicitation) but MCP servers have timeout handling

#### Why `isPaused` Blocks Lower-Priority Dialogs

```javascript
// chunks.196.mjs:390
if (y2) return;  // isPaused blocks all lower-priority dialogs
```

**The paused state (`y2`) occurs when:**
- User is actively typing in the input field
- Input value has non-whitespace content
- A brief debounce period after typing stops

**Why block dialogs during pause:**
1. **Prevent input disruption:** A dialog appearing mid-typing would steal focus
2. **Avoid jarring transitions:** User is composing their thought; interruption breaks flow
3. **Queue until ready:** Dialogs wait in queues; they appear when user pauses or submits

**What `Cb1` (blocked items indicator) shows:**
```javascript
// chunks.196.mjs:406
let Cb1 = y2 && (G7[0] || a8[0] || zA[0] || n.queue[0] || o.queue[0] || m26);
// Shows "N dialogs waiting" when paused with queued items
```

#### Animation Gate Implementation Detail

```javascript
// ============================================
// Animation gate check
// Location: chunks.196.mjs:392
// ============================================

// ORIGINAL (for source lookup):
let P1 = !j8 || j8.shouldContinueAnimation;

// READABLE (for understanding):
const canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation;
```

**Truth table:**

| `toolJSX` | `shouldContinueAnimation` | `canShowLowerPriority` | Meaning |
|-----------|---------------------------|------------------------|---------|
| `null` | N/A | `true` | No local JSX command active, dialogs can show |
| `{...}` | `undefined` | `true` | Local JSX exists but defaults to allowing |
| `{...}` | `false` | `false` | Local JSX explicitly blocking (animation in progress) |
| `{...}` | `true` | `true` | Local JSX allows dialogs (e.g., during streaming) |

**When `shouldContinueAnimation` is `false`:**
- `/help` command showing overlay
- `/clear` animation in progress
- Custom slash command with animated output

**When `shouldContinueAnimation` is `true`:**
- Normal LLM streaming (spinner active)
- Background processing while showing partial results

### Cancel Handler State Machine

The `handleCancel` function (`TM`) implements a **state-dependent cancellation strategy**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CANCEL STATE MACHINE                              │
│                                                                      │
│  Entry: User presses Escape                                         │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ State: elicitation active                                     │   │
│  │ Action: NO-OP (return immediately)                            │   │
│  │ Reason: MCP server Promise must be resolved via dialog button │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ State: tool-permission active                                 │   │
│  │ Action: onAbort() + clear queue                               │   │
│  │ Reason: Abort specific tool, keep agent loop running          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ State: prompt active                                          │   │
│  │ Action: reject all + clear queue + abort controller           │   │
│  │ Reason: Cancel all queued prompts, stop streaming             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ State: remote mode                                            │   │
│  │ Action: remoteSession.cancelRequest()                         │   │
│  │ Reason: Cancel request to remote REPL bridge                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ State: default (no dialog or other dialog)                    │   │
│  │ Action: abortController.abort()                               │   │
│  │ Reason: Cancel streaming API call                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Post-actions (always run):                                         │
│  1. streamController.forceEnd() - Mark streaming as ended          │
│  2. Save pending text as message (if any)                           │
│  3. resetDeferredUpdates() - Clear deferred state                   │
│  4. setAbortController(null) - Clear controller reference           │
└─────────────────────────────────────────────────────────────────────┘
```

**Why `elicitation` is NO-OP:**

The MCP server that requested elicitation is **blocked on a Promise**. The Promise was created in `registerElicitationHandler` and stored in the queue entry:

```javascript
// Elicitation queue entry structure:
{
    serverName: string,
    params: ElicitationParams,
    signal: AbortSignal,
    respond: (result) => void  // <-- This resolves the Promise
}
```

If `handleCancel` dismissed the elicitation without calling `respond()`, the MCP server would hang indefinitely waiting for the Promise to resolve. The elicitation dialog has its own Cancel button that properly calls `respond({action: "cancel"})`.

**Why tool-permission doesn't abort the controller:**

```javascript
if (focusedInputDialog === "tool-permission") {
    toolUseConfirmQueue[0]?.onAbort();
    setToolUseConfirmQueue([]);
    // NOTE: Does NOT call abortController.abort()
}
```

The agent loop continues running after a tool is aborted. The aborted tool returns a "user cancelled" result, and the LLM can decide what to do next (retry, use different approach, etc.). This is different from aborting the entire API call.

---

## 13. Performance Considerations

### Render Optimization

The dialog system uses several optimization techniques:

1. **Memoized priority calculation:** `ra6()` is called every render but is a pure function with no side effects
2. **React Compiler caching:** Dialog components use `A6(N)` cache slots
3. **Queue-based rendering:** Only one dialog renders at a time

### Queue Size Limits

```javascript
// Practical limits enforced to prevent memory issues:
const MAX_QUEUED_PERMISSIONS = 100;  // Tool permissions
const MAX_QUEUED_SANDBOX = 50;       // Sandbox permissions
const MAX_QUEUED_Elicitation = 20;   // MCP elicitation requests
```

If queues exceed limits, oldest items are auto-rejected with appropriate cleanup.

---

## 14. Complete Dialog State Machine

### Dialog Lifecycle States

```
┌──────────────────────────────────────────────────────────────────────┐
│                    DIALOG STATE MACHINE                               │
│                                                                       │
│  [IDLE] ─────────────────────────────────────────────────────────── │
│     │                                                                 │
│     ├── getInputDialogType() returns dialog type ──────────────────  │
│     │   └── [ACTIVE: <dialog_type>]                                   │
│     │       ├── User accepts → onAccept() → [RESOLVING]              │
│     │       ├── User rejects → onReject() → [RESOLVING]              │
│     │       ├── User cancels (Escape) → handleCancel() → [CANCELING] │
│     │       └── External abort → [ABORTED]                           │
│     │                                                                 │
│     └── [RESOLVING] ───────────────────────────────────────────────  │
│         ├── Clear queue entry                                        │
│         ├── Resolve/reject Promise                                   │
│         └── → [IDLE]                                                 │
│                                                                       │
│  [CANCELING] depends on dialog type:                                 │
│  ├── elicitation → NO-OP (stay in ACTIVE, user must use form button)│
│  ├── tool-permission → onAbort(), clear queue → [IDLE]              │
│  ├── prompt → reject all, clear queue → [IDLE]                       │
│  └── others → abortController.abort() → [IDLE]                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Animation Gate State Transitions

The animation gate (`shouldContinueAnimation`) controls when lower-priority dialogs appear:

```javascript
// ============================================
// Animation Gate Logic
// Location: chunks.196.mjs:392
// ============================================

// ORIGINAL (for source lookup):
let P1 = !j8 || j8.shouldContinueAnimation;

// READABLE (for understanding):
const canShowLowerPriority = !toolJSX || toolJSX.shouldContinueAnimation;

// When toolJSX exists (local JSX command like /help):
// - If shouldContinueAnimation is false → dialogs wait
// - If shouldContinueAnimation is true → dialogs show immediately

// When toolJSX is null (no local command):
// - canShowLowerPriority is true → dialogs show immediately
```

**Animation gate states:**

| toolJSX | shouldContinueAnimation | Lower Priority Dialogs |
|---------|------------------------|------------------------|
| null | N/A | Show immediately |
| { shouldContinueAnimation: true } | true | Show immediately |
| { shouldContinueAnimation: false } | false | Wait for animation |

---

## 15. Cross-Module Integration: Complete Data Flow

### 04_system_reminder → Dialog System

System reminders can trigger dialogs through the `isMeta` flag:

```
┌──────────────────────────────────────────────────────────────────────┐
│     SYSTEM REMINDER → DIALOG INTEGRATION                              │
│                                                                       │
│  1. Hook attachment types (from 11_hooks):                           │
│     ├── hook_blocking_error → Displayed as message                   │
│     ├── hook_success → Displayed as message                          │
│     └── async_hook_response → Can trigger tool-permission dialog     │
│                                                                       │
│  2. Elicitation attachment:                                          │
│     ├── Elicitation request from MCP server                          │
│     ├── Pushed to elicitationState.queue                             │
│     └── getInputDialogType returns "elicitation"                     │
│                                                                       │
│  3. Permission requests:                                             │
│     ├── Tool uses with permission-required flag                      │
│     ├── Sandbox permission for network access                        │
│     └── Queue-based dispatch to appropriate dialog                   │
└──────────────────────────────────────────────────────────────────────┘
```

### 05_tools → Dialog System

```
┌──────────────────────────────────────────────────────────────────────┐
│     TOOLS → DIALOG INTEGRATION                                        │
│                                                                       │
│  Tool Execution Flow:                                                 │
│                                                                       │
│  1. Tool requires permission:                                        │
│     const needsPermission = tool.permissionRequired ??               │
│         !userSettings.tools[tool.name]?.allowed;                     │
│                                                                       │
│  2. If needsPermission:                                              │
│     a. Create queue entry:                                           │
│        {                                                              │
│          toolUseID, toolName, input,                                 │
│          onAbort: () => resolveToolUse("aborted"),                   │
│          onAccept: (mode) => resolveToolUse("accepted", mode),       │
│          onReject: () => resolveToolUse("rejected")                  │
│        }                                                              │
│     b. Push to toolUseConfirmQueue                                   │
│     c. Wait for Promise resolution                                   │
│                                                                       │
│  3. User action:                                                      │
│     ├── Accept → tool executes                                       │
│     ├── Reject → tool returns "rejected" error                       │
│     └── Abort → tool returns "aborted" result                        │
└──────────────────────────────────────────────────────────────────────┘
```

### 06_mcp → Dialog System

```
┌──────────────────────────────────────────────────────────────────────┐
│     MCP → DIALOG INTEGRATION                                          │
│                                                                       │
│  Elicitation Request Flow:                                           │
│                                                                       │
│  1. MCP server sends elicitation/create request                      │
│     { message: "Please provide credentials", schema: {...} }         │
│                                                                       │
│  2. Handler creates Promise and pushes to queue:                     │
│     elicitationState.queue.push({                                    │
│       serverName, params, signal,                                    │
│       respond: (result) => resolvePromise(result)                    │
│     });                                                              │
│                                                                       │
│  3. getInputDialogType returns "elicitation"                         │
│                                                                       │
│  4. ElicitationRouter renders form                                   │
│                                                                       │
│  5. User submits:                                                     │
│     onResponse(action, content) {                                    │
│       currentEntry.respond({ action, content });                     │
│       removeFromQueue();                                             │
│     }                                                                │
│                                                                       │
│  6. MCP server Promise resolves with user response                   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 16. v2.1.76 Dialog-Specific Changes

### New Dialog Types

| Dialog | Obfuscated | Purpose | Location |
|--------|------------|---------|----------|
| `EffortCalloutDialog` | `gmq` | Extended thinking effort selection | chunks.194.mjs:1755 |
| `RemoteCalloutDialog` | `pWq` | Remote session options | chunks.168.mjs:381 |

### Escape Key Improvements

v2.1.76 fixes race conditions where Escape would not register after certain dialog dismissals:

```javascript
// Before: Dialog could block Escape unintentionally
// After: Double-Escape reliably opens message selector

// In handleCancel:
// 1. Force end any pending stream operations
J9.forceEnd();  // streamController.forceEnd()

// 2. Clear any deferred state
dE();  // resetDeferredUpdates()

// 3. Process cancel based on dialog type
// ... dialog-specific logic
```

### Session Color Integration

The `/color` command (v2.1.76) affects the prompt bar accent color but does not affect dialogs:

```javascript
// /color <colorName> sets session-scoped color
// Valid: "default", "blue", "green", "red", "purple", "orange"

// Usage: Visual differentiation between multiple Claude Code windows
// Dialogs use standard theme colors regardless of session color
```

---

**Last Updated**: 2026-03-22 (Enhanced with state machine, cross-module integration)
**Version**: Claude Code 2.1.76
**Status**: Complete - All dialog types and behaviors documented
