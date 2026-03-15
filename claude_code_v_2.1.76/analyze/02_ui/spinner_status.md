# Spinner and Status System

> Related Symbols:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI, Status Line

Key functions in this document:
- `PG` - showSpinner calculation, chunks.188.mjs:231
- `Gw` - hasActiveDialogs flag, chunks.188.mjs:232
- `resetLoadingState` (YK) - Post-query cleanup, chunks.188.mjs:218
- `setIsLoading` (C3) - Loading state setter with timing, chunks.188.mjs:99
- `getSpinnerText` - Generate spinner activity text, chunks
- `HO` - Spinner tip from feature system, chunks.188.mjs:168

---

## Table of Contents

- [1. Architecture Overview](#1-architecture-overview)
- [2. Spinner Visibility Logic (PG)](#2-spinner-visibility-logic-pg)
- [3. Has Active Dialogs (Gw)](#3-has-active-dialogs-gw)
- [4. Status Text Generation](#4-status-text-generation)
- [5. Loading State Machine](#5-loading-state-machine)
- [6. Activity Descriptions](#6-activity-descriptions)
- [7. Timing and Performance](#7-timing-and-performance)

---

## 1. Architecture Overview

The spinner/status system provides visual feedback during LLM operations and tool execution.

```
┌──────────────────────────────────────────────────────────────────────┐
│                    SPINNER / STATUS SYSTEM                            │
│                                                                       │
│  Show/Hide Decision:                                                  │
│  PG = (!vK || vK.showSpinner) && F7.length === 0 && ...              │
│                                                                       │
│  Status Sources:                                                      │
│  ├── gj (spinnerText) - "Compacting conversation"                    │
│  ├── eK (spinnerColor) - "claudeBlue_FOR_SYSTEM_SPINNER"             │
│  ├── HD (spinnerShimmer) - Animation color                           │
│  └── HO (tip) - Feature-generated tip text                           │
│                                                                       │
│  Activity Tracking:                                                   │
│  ├── Response length (Qj.current) - Characters streamed             │
│  ├── Tool progress - From hook_progress messages                     │
│  └── Background tasks - D1 (tasks) with status "running"             │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**

1. **Tool permissions hide spinner** - User is expected to act, not wait
2. **Background tasks show spinner** - Tasks running independently
3. **Deferred updates** - Response length updates are batched
4. **Tip rotation** - Feature system provides contextual tips

> **v2.1.76 change:** The spinner animation is now isolated to a dedicated 50ms animation loop rather than being rendered inline with the main message pipeline. This prevents unnecessary re-renders of the entire message list on each spinner frame tick.

---

## 2. Spinner Visibility Logic (PG)

The spinner visibility is determined by a compound boolean expression.

```javascript
// ============================================
// showSpinner calculation
// Location: chunks.188.mjs:231
// ============================================

// ORIGINAL (for source lookup):
let PG = (!vK || vK.showSpinner === !0) && F7.length === 0 && (_4 || Wz || L9 || xp7() > 0) && !q1 && !MG;

// READABLE (for understanding):
const showSpinner =
    // Condition 1: Not blocked by local JSX command
    (!toolJSX || toolJSX.showSpinner === true)
    &&
    // Condition 2: No tool permission dialog queued
    toolUseConfirmQueue.length === 0
    &&
    // Condition 3: At least one active operation
    (isLoading || hasUserInput || hasRunningTasks || hasQueuedCommands() > 0)
    &&
    // Condition 4: No pending worker request
    !pendingWorkerRequest
    &&
    // Condition 5: Not in tool-only mode (all tools are tool-permission-only)
    !isToolOnlyMode;
```

### Condition Analysis

| Condition | Purpose | Why |
|-----------|---------|-----|
| `!vK \|\| vK.showSpinner` | Not blocked by local JSX | Local JSX commands (like /help) control their own display |
| `F7.length === 0` | No tool permissions | User is waiting to act, not for LLM |
| `_4 \|\| Wz \|\| L9 \|\| xp7() > 0` | Has active operation | Something is actually happening |
| `!q1` | No pending worker | Worker is waiting for leader response |
| `!MG` | Not tool-only mode | Special mode where only tools are running |

### Tool-Only Mode (MG)

```javascript
// Tool-only mode detection:
let Ww = W4.findLast((k6) => k6.type === "assistant");
let JO = Ww?.type === "assistant" ? Ww.message.content.filter(
    (k6) => k6.type === "tool_use" && ow.has(k6.id)
) : [];
let MG = JO.length > 0 && JO.every(
    (k6) => k6.type === "tool_use" && k6.name === dBA  // dBA = tool-permission-only tool name
);
```

**What this means:** When all pending tools are "permission-only" tools (tools that require permission for every use), the spinner is hidden because execution is blocked waiting for user action, not waiting for LLM.

---

## 3. Has Active Dialogs (Gw)

The `Gw` flag tracks whether ANY dialog queue has items.

```javascript
// ============================================
// hasActiveDialogs calculation
// Location: chunks.188.mjs:232
// ============================================

// ORIGINAL (for source lookup):
let Gw = F7.length > 0 || oq.length > 0 || E1.queue.length > 0 || Z1.queue.length > 0;

// READABLE (for understanding):
const hasActiveDialogs =
    toolUseConfirmQueue.length > 0 ||           // Tool permissions
    sandboxPermissionQueue.length > 0 ||        // Sandbox permissions
    elicitationState.queue.length > 0 ||        // MCP elicitation
    workerSandboxPermissions.queue.length > 0;  // Worker sandbox
```

### Usage of Gw

`Gw` is used in several places:

1. **Session feedback suppression** - Don't show feedback prompt while dialogs active
2. **Turn tracking** - Don't count turns while waiting for user input
3. **Idle notification suppression** - Don't notify about idle while dialogs pending

```javascript
// Session feedback:
let RP = BVq(W4, _4, X2, "session", Gw);
// Gw suppresses feedback prompt

// Turn tracking:
let I1 = FVq(W4, _4, Gw);
// Gw affects turn counting
```

### PG vs Gw Distinction

| Flag | Meaning | Spinner Shows? |
|------|---------|----------------|
| `PG` (showSpinner) | Loading/activity state | Yes (if true) |
| `Gw` (hasActiveDialogs) | Any dialog queued | Only tool permissions affect spinner |

**Key insight:** Only `F7.length > 0` (tool permissions) affects the spinner. Sandbox permissions, elicitation, etc. allow the spinner to show because the agent loop is still running in the background.

---

## 4. Status Text Generation

The status text shown with the spinner comes from multiple sources.

### Primary Status Text (gj)

```javascript
// From REPL state:
[gj, S3] = dA.useState(null);  // spinnerText, setSpinnerText

// Set during compact:
onCompactProgress: (p7) => {
    switch (p7.type) {
        case "hooks_start":
            S3(p7.hookType === "pre_compact" ? "Running PreCompact hooks..." : "Running SessionStart hooks...");
            break;
        case "compact_start":
            S3("Compacting conversation");
            break;
        case "compact_end":
            S3(null);
            break;
    }
}
```

### Spinner Colors (eK, HD)

```javascript
// From REPL state:
[eK, OO] = dA.useState(null);   // spinnerColor
[HD, xH] = dA.useState(null);   // spinnerShimmer

// Set during compact:
case "hooks_start":
    OO("claudeBlue_FOR_SYSTEM_SPINNER");
    xH("claudeBlueShimmer_FOR_SYSTEM_SPINNER");
    break;
case "compact_end":
    OO(null);
    xH(null);
    break;
```

### Spinner Tips (HO)

```javascript
// From REPL state:
let {
    tip: HO,        // Current tip text
    dismissTip: U2  // Dismiss handler
} = Gfq({
    inputValue: K8,
    isAssistantResponding: _4
});
```

The tip system generates contextual tips based on user activity and preferences.

---

## 5. Loading State Machine

The loading state transitions follow a specific pattern.

### State Variables

```javascript
[_4, Az] = dA.useState(N?.hasInitialPrompt ?? false);  // isLoading
[Wz, ZY] = dA.useState(void 0);                        // userInputOnProcessing
$Y = dA.useRef(0);   // queryStartTime
OY = dA.useRef(0);   // toolPermissionWaitTime
```

### Transition Functions

```javascript
// ============================================
// setIsLoading (C3) - Loading state setter with timing
// Location: chunks.188.mjs:99
// ============================================

// ORIGINAL (for source lookup):
let C3 = dA.useCallback((k6) => {
    if (Az(k6), k6) $Y.current = Date.now(), OY.current = 0, fY.current = null
}, []);

// READABLE (for understanding):
const setIsLoading = useCallback((loading) => {
    setIsLoadingState(loading);

    if (loading) {
        // Reset timing on start
        queryStartTime.current = Date.now();
        toolPermissionWaitTime.current = 0;
        toolPermissionStartTime.current = null;
    }
}, []);
```

### Timing Tracking

```javascript
// Tool permission timing (tracked separately):
useEffect(() => {
    if (!_4) return;

    let isToolPermission = XO === "tool-permission";
    let now = Date.now();

    if (isToolPermission && fY.current === null) {
        // Tool permission dialog just opened
        fY.current = now;
    } else if (!isToolPermission && fY.current !== null) {
        // Tool permission dialog just closed
        OY.current += now - fY.current;
        fY.current = null;
    }
}, [XO, _4]);
```

**Why track tool permission time separately?** The "slow query" notification (30 seconds) should NOT include time spent waiting for user to approve tools. The user is the bottleneck, not the LLM.

### Reset Function

```javascript
// ============================================
// resetLoadingState (YK) - Post-query cleanup
// Location: chunks.188.mjs:218
// ============================================

// ORIGINAL (for source lookup):
let YK = dA.useCallback(() => {
    C3(!1), ZY(void 0), Qj.current = 0, xq([]), S3(null), OO(null), xH(null), l7(), PB1()
}, [C3, l7]);

// READABLE (for understanding):
const resetLoadingState = useCallback(() => {
    setIsLoading(false);
    setUserInputOnProcessing(undefined);
    responseLength.current = 0;
    setStreamingToolUses([]);
    setSpinnerText(null);
    setSpinnerColor(null);
    setSpinnerShimmer(null);
    refreshSpinnerTip();  // l7
    clearPendingBackgroundIndicator();  // PB1
}, [setIsLoading, refreshSpinnerTip]);
```

---

## 6. Activity Descriptions

Activity descriptions provide context about what's happening.

### Response Length Tracking

```javascript
// From REPL state:
Qj = dA.useRef(0);  // responseLength

// Updated during streaming:
setResponseLength: (delta) => p2((FA) => FA + delta.length)

// In handleToolUseStreamCallback:
iW1(k6,
    (q8) => { /* message handler */ },
    (q8) => p2((FA) => FA + q8.length),  // Response length accumulator
    tK,  // setStreamMode
    xq,  // setStreamingToolUses
    // ...
);
```

### Stop Hook Status

```javascript
// ============================================
// Stop hook status calculation
// Location: chunks.188.mjs:1016-1035
// ============================================

let Hx = dA.useMemo(() => {
    if (!_4) return null;

    // Find stop hook progress messages
    let k6 = W4.filter((J3) =>
        J3.type === "progress" &&
        J3.data.type === "hook_progress" &&
        (J3.data.hookEvent === "Stop" || J3.data.hookEvent === "SubagentStop")
    );

    if (k6.length === 0) return null;

    // Get unique tool use IDs
    let q8 = [...new Set(k6.map((J3) => J3.toolUseID))];
    let FA = q8[q8.length - 1];  // Most recent

    // Check if summary already shown
    if (W4.some((J3) =>
        J3.type === "system" &&
        J3.subtype === "stop_hook_summary" &&
        J3.toolUseID === FA
    )) return null;

    // Count completed hooks
    let k7 = k6.filter((J3) => J3.toolUseID === FA);
    let X4 = k7.length;
    let p7 = W4.filter((J3) => {
        if (J3.type !== "attachment") return false;
        let pK = J3.attachment;
        return (pK.hookEvent === "Stop" || pK.hookEvent === "SubagentStop") &&
               pK.toolUseID === FA;
    }).length;

    // Get status message if available
    let V3 = k7.find((J3) => J3.data.statusMessage)?.data.statusMessage;
    if (V3) return X4 === 1 ? `${V3}...` : `${V3}... ${p7}/${X4}`;

    // Default message
    let sq = k7[0]?.data.hookEvent === "SubagentStop" ? "subagent stop" : "stop";
    return X4 === 1 ? `running ${sq} hook` : `running stop hooks... ${p7}/${X4}`;
}, [W4, _4]);
```

### Background Task Status

```javascript
// Check for running background tasks:
let L9 = dv(D1).some((k6) => k6.status === "running");

// If tasks complete while loading was true:
useEffect(() => {
    if (!L9 && J2.current !== null) {
        let k6 = Date.now() - J2.current;
        J2.current = null;
        X6((q8) => [...q8, cmA(k6)]);  // Add duration message
    }
}, [L9, X6]);
```

---

## 7. Timing and Performance

### Slow Query Detection

```javascript
// In executeQuery finally block:
let sq = Date.now() - $Y.current - OY.current;  // Total time minus tool permission wait

if (sq > 30000 && !q8.signal.aborted && !G1) {
    // Not aborted, not proactive mode
    if (dv(M1.getState().tasks).some((pK) => pK.status === "running")) {
        // Has running tasks - defer notification
        if (J2.current === null) J2.current = $Y.current;
    } else {
        // Add slow query notification to messages
        X6((pK) => [...pK, cmA(sq)]);
    }
}
```

**Why 30 seconds?** This is a threshold that indicates potential API issues or unusually complex processing. The notification lets users know the query is still active.

### Idle Notification

```javascript
// Idle detection (when NOT loading):
useEffect(() => {
    if (_4) return;
    if (X2 === 0) return;      // No turns yet
    if (wD === 0) return;      // No query completed yet

    let k6 = setTimeout(() => {
        if (KN1() > wD) return;  // Recent activity

        let FA = Date.now() - wD;
        if (!_4 && !vK && o5.current === void 0 &&
            FA >= f6().messageIdleNotifThresholdMs) {
            // Show idle notification
            Nm({
                message: "Claude is waiting for your input",
                notificationType: "idle_prompt"
            }, z1);
        }
    }, f6().messageIdleNotifThresholdMs);

    return () => clearTimeout(k6);
}, [_4, vK, X2, wD, z1]);
```

### Paused State with Pending Dialogs

```javascript
// V11 - blocked items indicator
let V11 = W$ && (oq[0] || F7[0] || Z1.queue[0] || E1.queue[0] || Yx);

// W$ = isPaused (streaming paused)
// Shows "N dialogs waiting" when paused with queued dialogs
```

---

## State Variables Reference

| Variable | Setter | Purpose |
|----------|--------|---------|
| `_4` | `C3` | Is loading flag |
| `PG` | (derived) | Show spinner |
| `Gw` | (derived) | Has active dialogs |
| `gj` | `S3` | Spinner text |
| `eK` | `OO` | Spinner color |
| `HD` | `xH` | Spinner shimmer color |
| `HO` | `Gfq` | Spinner tip |
| `Qj` | `p2` | Response length |
| `$Y` | - | Query start time (ref) |
| `OY` | - | Tool permission wait time (ref) |
| `fY` | - | Tool permission start time (ref) |
| `W$` | `c9` | Is paused (input typing) |
| `V11` | (derived) | Blocked items when paused |
