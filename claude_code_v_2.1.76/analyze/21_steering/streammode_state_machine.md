# StreamMode State Machine - Complete Analysis

## Overview

The `streamMode` state machine controls the visual feedback during LLM streaming, spinner animation, and cancel indicator visibility in Claude Code v2.1.76. This document provides source-level analysis of all state transitions and their effects.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Steering section)

Key symbols in this document:
- `streamMode` (d7) - State variable holding current stream state
- `setStreamMode` (W4) - State setter function
- `streamModeRef` (Dz) - Ref for callback access to current state
- `showSpinner` (QV6) - Computed visibility for spinner

---

## 1. State Definition

### 1.1 State Variable Declaration

```javascript
// ============================================
// streamMode state - Controls streaming UI feedback
// Location: chunks.196.mjs:96-97
// ============================================

// ORIGINAL (for source lookup):
let [d7, W4] = N8.useState("responding"), Dz = N8.useRef(d7);
Dz.current = d7;

// READABLE (for understanding):
const [streamMode, setStreamMode] = useState("responding");
const streamModeRef = useRef(streamMode);
streamModeRef.current = streamMode;  // Keep ref in sync for callbacks

// Mapping: d7→streamMode, W4→setStreamMode, Dz→streamModeRef, N8→React
```

**Why both state and ref?**
- `streamMode` state triggers React re-renders for UI updates
- `streamModeRef` allows callbacks to access current value without re-registration

---

## 2. State Values

### 2.1 Complete State Enumeration

| Value | Meaning | Spinner Text | Animation |
|-------|---------|--------------|-----------|
| `"requesting"` | Waiting for first API token | "Waiting for Claude..." | Bouncing animation |
| `"thinking"` | Extended thinking active | "Thinking..." | Pulsing color |
| `"responding"` | Text streaming from API | "Claude is responding..." | Scrolling |
| `"tool-input"` | Building tool arguments | "Generating tool args..." | Scrolling |
| `"tool-use"` | Tool executing | "Running [tool_name]..." | Sine wave pulse |

### 2.2 State Type Definition (Inferred)

```typescript
type StreamMode =
  | "requesting"   // API request sent, awaiting first token
  | "thinking"     // Extended thinking block active
  | "responding"   // Text content streaming
  | "tool-input"   // Tool use block being generated
  | "tool-use";    // Tool being executed
```

---

## 3. State Transitions

### 3.1 Transition Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STREAMMODE STATE MACHINE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Initial Query Submitted]                                          │
│         │                                                           │
│         ▼                                                           │
│  ┌─────────────┐                                                    │
│  │ requesting  │  ← setStreamMode("requesting")                    │
│  └──────┬──────┘                                                    │
│         │                                                           │
│         │ First token received OR                                   │
│         │ content_block_start.type === "text"                      │
│         ▼                                                           │
│  ┌─────────────┐                                                    │
│  │ responding  │  ← setStreamMode("responding")                    │
│  └──────┬──────┘                                                    │
│         │                                                           │
│         │ content_block_start.type === "thinking"                  │
│         ▼                                                           │
│  ┌─────────────┐                                                    │
│  │  thinking   │  ← Detected thinking block                         │
│  └──────┬──────┘                                                    │
│         │                                                           │
│         │ content_block_start.type === "tool_use"                  │
│         ▼                                                           │
│  ┌─────────────┐                                                    │
│  │ tool-input  │  ← Tool arguments being generated                  │
│  └──────┬──────┘                                                    │
│         │                                                           │
│         │ Tool input complete, execution begins                     │
│         ▼                                                           │
│  ┌─────────────┐                                                    │
│  │  tool-use   │  ← Tool execution in progress                      │
│  └──────┬──────┘                                                    │
│         │                                                           │
│         │ Tool result received, next content block                  │
│         │                                                           │
│         └──────────────► Back to responding/thinking/tool-input     │
│                                                                     │
│  [Stream Complete] ──► State remains at last value                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Transition Triggers

#### Initial: Set to "requesting"

```javascript
// ============================================
// setStreamMode("requesting") - Query start
// Location: chunks.147.mjs:1495, 1604, 1630, 1726
// ============================================

// ORIGINAL (for source lookup):
q.setStreamMode?.("requesting"), q.setResponseLength?.(() => 0), q.onCompactProgress?.({
    type: "compact_start"
});

// READABLE (for understanding):
toolUseContext.setStreamMode?.("requesting");
toolUseContext.setResponseLength?.(() => 0);
toolUseContext.onCompactProgress?.({ type: "compact_start" });

// Mapping: q→toolUseContext
```

**Triggered by:**
- Compact operation start
- Manual compact trigger
- Reactive compact on prompt too long

#### Transition to "responding"

```javascript
// ============================================
// setStreamMode("responding") - First text block
// Location: chunks.147.mjs:1828
// ============================================

// ORIGINAL (for source lookup):
if (!J && G.type === "stream_event" && G.event.type === "content_block_start" && G.event.content_block.type === "text") J = !0, Y.setStreamMode?.("responding");

// READABLE (for understanding):
if (!hasResponded &&
    event.type === "stream_event" &&
    event.event.type === "content_block_start" &&
    event.event.content_block.type === "text") {
    hasResponded = true;
    toolUseContext.setStreamMode?.("responding");
}

// Mapping: J→hasResponded, G→event, Y→toolUseContext
```

**Triggered by:**
- API stream event with `content_block_start`
- Content block type is `"text"`

---

## 4. Spinner Visibility Logic

### 4.1 showSpinner Computation

```javascript
// ============================================
// showSpinner - Computed visibility
// Location: chunks.196.mjs:305
// ============================================

// ORIGINAL (for source lookup):
QV6 = (!j8 || j8.showSpinner === !0) && a8.length === 0 && zA.length === 0 && (Bq || YA || oi || qY4() > 0) && !X6 && !C2 && (!aZ || Wz)

// READABLE (for understanding):
const showSpinner =
    (!localJSXCommand || localJSXCommand.showSpinner === true) &&  // Not hidden by JSX command
    toolUseConfirmQueue.length === 0 &&                            // No pending tool confirmations
    permissionDialogQueue.length === 0 &&                           // No permission dialogs
    (isLoading || hasResponse || isThinking || queueLength > 0) &&  // Active state
    !hasError &&                                                    // No error state
    !isWaitingForBrowserTool &&                                     // Not waiting for browser
    (!isCompactMode || compactComplete);                            // Compact mode check

// Mapping: QV6→showSpinner, j8→localJSXCommand, a8→toolUseConfirmQueue,
//   zA→permissionDialogQueue, Bq→isLoading, YA→hasResponse, oi→isThinking,
//   qY4→getQueueLength, X6→hasError, C2→isWaitingForBrowserTool,
//   aZ→isCompactMode, Wz→compactComplete
```

### 4.2 Visibility Conditions Breakdown

| Condition | Variable | Meaning |
|-----------|----------|---------|
| `!localJSXCommand \|\| showSpinner === true` | `!j8 \|\| j8.showSpinner` | Not blocked by local JSX |
| `toolUseConfirmQueue.length === 0` | `a8.length === 0` | No pending tool confirms |
| `permissionDialogQueue.length === 0` | `zA.length === 0` | No permission dialogs |
| `isLoading \|\| hasResponse \|\| isThinking \|\| queueLength > 0` | `Bq \|\| YA \|\| oi \|\| qY4() > 0` | Active stream or queued commands |
| `!hasError` | `!X6` | No error state |
| `!isWaitingForBrowserTool` | `!C2` | Not waiting for browser tool |
| `!isCompactMode \|\| compactComplete` | `!aZ \|\| Wz` | Compact mode handled |

---

## 5. Spinner Animation by Mode

### 5.1 Animation Parameters

```javascript
// ============================================
// Spinner animation parameters by mode
// Location: chunks.113.mjs:727-732
// ============================================

// ORIGINAL (for source lookup):
let b = A === "requesting" ? 50 : 200,  // Speed multiplier
    r = q ? -100 : I ? -100 : A === "requesting" ? U % Q - 10 : p + 10 - U % Q,
    e = q ? 0 : A === "tool-use" ? (Math.sin(N / 1000 * Math.PI) + 1) / 2 : 0;

// READABLE (for understanding):
const speedMultiplier = mode === "requesting" ? 50 : 200;  // Faster for requesting

// Position calculation varies by mode:
const position = isDone ? -100 :
                 isStalled ? -100 :
                 mode === "requesting" ? (frameCount % textWidth) - 10 :
                 textWidth + 10 - (frameCount % textWidth);

// Pulse intensity for tool-use mode:
const pulseIntensity = isDone ? 0 :
                       mode === "tool-use" ? (Math.sin(time / 1000 * Math.PI) + 1) / 2 :
                       0;

// Mapping: A→mode, b→speedMultiplier, q→isDone, I→isStalled,
//   r→position, e→pulseIntensity, N→time
```

### 5.2 Animation Behavior by Mode

| Mode | Speed | Animation Type | Visual Effect |
|------|-------|----------------|---------------|
| `requesting` | 50ms | Bouncing | Text scrolls left, wraps around |
| `thinking` | 200ms | Color pulse | Pulsing color gradient |
| `responding` | 200ms | Scrolling | Text scrolls right |
| `tool-input` | 200ms | Scrolling | Text scrolls right |
| `tool-use` | 200ms | Sine pulse | Opacity/size pulse |

---

## 6. Integration with Steering

### 6.1 Cancel Visibility

The `streamMode` affects when the cancel indicator is visible:

```javascript
// Location: chunks.193.mjs:2621

// isStreaming = abortSignal defined AND not aborted
const isStreaming = abortSignal !== undefined && !abortSignal.aborted;

// showCancelIndicator computed from isStreaming, queue status, etc.
const showCancelIndicator = isStreaming || hasQueuedCommands || hasRunningAgents;
```

### 6.2 StreamMode in Telemetry

```javascript
// Telemetry event includes streamMode
telemetry("tengu_cancel", {
    source: "escape" | "interrupt_on_submit" | "kill_agents",
    streamMode: streamMode  // Current state at time of cancel
});
```

---

## 7. Extended Thinking Integration

### 7.1 Thinking Mode Detection

```javascript
// ============================================
// Thinking mode display
// Location: chunks.113.mjs:754
// ============================================

// ORIGINAL (for source lookup):
let o = G === "thinking" ? `thinking${f}` : typeof G === "number" ? `thought for ${Math.max(1,Math.round(G/1000))}s` : null;

// READABLE (for understanding):
const thinkingDisplay = thinkingDuration === "thinking" ?
    `thinking${budgetText}` :
    typeof thinkingDuration === "number" ?
    `thought for ${Math.max(1, Math.round(thinkingDuration / 1000))}s` :
    null;

// Mapping: o→thinkingDisplay, G→thinkingDuration, f→budgetText
```

### 7.2 Thinking Duration Display

| Condition | Display |
|-----------|---------|
| `thinkingDuration === "thinking"` | "thinking" + budget suffix |
| `typeof thinkingDuration === "number"` | "thought for Xs" |
| `thinkingDuration === null` | No display |

---

## 8. Related Components

### 8.1 Spinner Component (jZ4)

The spinner component receives the streamMode and renders appropriate UI:

```javascript
// ============================================
// Spinner component invocation
// Location: chunks.196.mjs:1454-1468
// ============================================

// ORIGINAL (for source lookup):
QV6 && b8.createElement(jZ4, {
    mode: d7,
    spinnerTip: K6,
    responseLengthRef: mO,
    // ... other props
})

// READABLE (for understanding):
showSpinner && React.createElement(SpinnerComponent, {
    mode: streamMode,
    spinnerTip: tipText,
    responseLengthRef: responseLengthRef,
    // ... other props
})

// Mapping: QV6→showSpinner, jZ4→SpinnerComponent, d7→streamMode, K6→tipText
```

---

## 9. State Flow During Typical Query

```
User submits query
       │
       ▼
┌─────────────────┐
│  "requesting"   │ ← setStreamMode("requesting")
│  (50ms speed)   │
└────────┬────────┘
         │ API returns first token
         ▼
┌─────────────────┐
│  "responding"   │ ← setStreamMode("responding")
│  (200ms speed)  │
└────────┬────────┘
         │ Claude starts thinking
         ▼
┌─────────────────┐
│   "thinking"    │ ← thinking block detected
│  (color pulse)  │
└────────┬────────┘
         │ Claude generates tool_use
         ▼
┌─────────────────┐
│  "tool-input"   │ ← tool_use block started
│  (200ms speed)  │
└────────┬────────┘
         │ Tool execution begins
         ▼
┌─────────────────┐
│   "tool-use"    │ ← tool executing
│  (sine pulse)   │
└────────┬────────┘
         │ Tool result received
         │
         └──────────────► Back to "responding"
```

---

## 10. Source Code Reference

| File | Lines | Content |
|------|-------|---------|
| chunks.196.mjs | 96-97 | streamMode state definition |
| chunks.196.mjs | 305 | showSpinner computation |
| chunks.147.mjs | 1495, 1604, 1630, 1726 | setStreamMode("requesting") |
| chunks.147.mjs | 1828 | setStreamMode("responding") |
| chunks.113.mjs | 727-732 | Animation parameters |
| chunks.113.mjs | 754 | Thinking display |
| chunks.113.mjs | 401 | "tool-use" mode handling |

---

**Last Updated**: 2026-03-24
**Version**: Claude Code 2.1.76