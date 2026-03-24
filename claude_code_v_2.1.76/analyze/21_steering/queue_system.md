# Queue System - Detailed Analysis

## Overview

This document provides a comprehensive analysis of the legacy queue system in Claude Code v2.1.76, which handles command queueing for steering and interrupt workflows.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Steering section)

Key functions in this document:
- `isPromptQueueingEnabled` (d36) - Check if legacy queue has items
- `enqueueToLegacyQueue` (_0) - Add command to queue
- `enqueueTaskNotification` (w0) - Add task notification to queue
- `clearAgentNotifications` (_Y4) - Clear the queue
- `legacyQueueArray` (xY) - The underlying array

---

## 1. Queue Architecture

### 1.1 Data Structure

The legacy queue is a simple JavaScript array with priority-based ordering:

```javascript
// ============================================
// Legacy queue array definition
// Location: chunks.90.mjs:2970
// ============================================

// ORIGINAL (for source lookup):
xY = [], e94 = Object.freeze([]), VV8 = new Set;

// READABLE (for understanding):
let legacyQueueArray = [];           // xY - Main queue storage
let frozenQueueSnapshot = Object.freeze([]);  // e94 - Immutable snapshot
let queueSubscribers = new Set();    // VV8 - Change notification subscribers

// Mapping: xY→legacyQueueArray, e94→frozenQueueSnapshot, VV8→queueSubscribers
```

### 1.2 Priority System

```javascript
// ============================================
// Priority values for queue ordering
// Location: chunks.90.mjs:2971-2975
// ============================================

// ORIGINAL (for source lookup):
RW6 = {
    now: 0,
    next: 1,
    later: 2
};

// READABLE (for understanding):
const PRIORITY_VALUES = {
    now: 0,    // Process immediately (highest priority)
    next: 1,   // Process next
    later: 2   // Process later (lowest priority)
};

// Mapping: RW6→PRIORITY_VALUES
```

**Priority Ordering**:
- Lower number = Higher priority
- `now` (0) > `next` (1) > `later` (2)

---

## 2. Core Queue Functions

### 2.1 Check Queue Status

```javascript
// ============================================
// isPromptQueueingEnabled - Check if queue has items
// Location: chunks.90.mjs:2812-2814
// ============================================

// ORIGINAL (for source lookup):
function d36() {
    return xY.length > 0
}

// READABLE (for understanding):
function isPromptQueueingEnabled() {
    return legacyQueueArray.length > 0;
}

// Mapping: d36→isPromptQueueingEnabled, xY→legacyQueueArray
```

**Usage**: Called by `handleCancelPress` to determine if Escape should pop the queue instead of cancelling.

### 2.2 Get Queue Length

```javascript
// ============================================
// getLegacyQueueLength - Get queue size
// Location: chunks.90.mjs:2808-2810
// ============================================

// ORIGINAL (for source lookup):
function qY4() {
    return xY.length
}

// READABLE (for understanding):
function getLegacyQueueLength() {
    return legacyQueueArray.length;
}

// Mapping: qY4→getLegacyQueueLength, xY→legacyQueueArray
```

### 2.3 Enqueue Command (Next Priority)

```javascript
// ============================================
// enqueueToLegacyQueue - Add command with "next" priority
// Location: chunks.90.mjs:2816-2821
// ============================================

// ORIGINAL (for source lookup):
function _0(A) {
    xY.push({
        ...A,
        priority: A.priority ?? "next"
    }), Qt(), U36("enqueue", typeof A.value === "string" ? A.value : void 0)
}

// READABLE (for understanding):
function enqueueToLegacyQueue(command) {
    legacyQueueArray.push({
        ...command,
        priority: command.priority ?? "next"  // Default to "next"
    });
    notifySubscribers();  // Qt()
    logQueueEvent("enqueue", typeof command.value === "string" ? command.value : void 0);
}

// Mapping: _0→enqueueToLegacyQueue, xY→legacyQueueArray, Qt→notifySubscribers,
//   U36→logQueueEvent, A→command
```

### 2.4 Enqueue Task Notification (Later Priority)

```javascript
// ============================================
// enqueueTaskNotification - Add with "later" priority
// Location: chunks.90.mjs:2823-2828
// ============================================

// ORIGINAL (for source lookup):
function w0(A) {
    xY.push({
        ...A,
        priority: A.priority ?? "later"
    }), Qt(), U36("enqueue", typeof A.value === "string" ? A.value : void 0)
}

// READABLE (for understanding):
function enqueueTaskNotification(command) {
    legacyQueueArray.push({
        ...command,
        priority: command.priority ?? "later"  // Default to "later"
    });
    notifySubscribers();
    logQueueEvent("enqueue", typeof command.value === "string" ? command.value : void 0);
}

// Mapping: w0→enqueueTaskNotification, xY→legacyQueueArray
```

**Difference between `_0` and `w0`**:
| Function | Default Priority | Use Case |
|----------|-----------------|----------|
| `_0` (enqueueToLegacyQueue) | `"next"` (1) | User-enqueued commands, interrupt-on-submit |
| `w0` (enqueueTaskNotification) | `"later"` (2) | Task notifications, agent kill messages |

### 2.5 Clear Queue

```javascript
// ============================================
// clearAgentNotifications - Clear the queue
// Location: chunks.90.mjs:2885-2888
// ============================================

// ORIGINAL (for source lookup):
function _Y4() {
    if (xY.length === 0) return;
    xY.length = 0, Qt()
}

// READABLE (for understanding):
function clearAgentNotifications() {
    if (legacyQueueArray.length === 0) return;
    legacyQueueArray.length = 0;  // Clear array in-place
    notifySubscribers();
}

// Mapping: _Y4→clearAgentNotifications, xY→legacyQueueArray, Qt→notifySubscribers
```

---

## 3. Dequeue Operations

### 3.1 Dequeue Highest Priority

```javascript
// ============================================
// dequeueHighestPriority - Remove and return highest priority item
// Location: chunks.90.mjs:2830-2840
// ============================================

// ORIGINAL (for source lookup):
function lP1() {
    if (xY.length === 0) return;
    let A = 0,
        q = RW6[xY[0].priority ?? "next"];
    for (let Y = 1; Y < xY.length; Y++) {
        let z = RW6[xY[Y].priority ?? "next"];
        if (z < q) A = Y, q = z
    }
    let [K] = xY.splice(A, 1);
    return Qt(), U36("dequeue"), K
}

// READABLE (for understanding):
function dequeueHighestPriority() {
    if (legacyQueueArray.length === 0) return;

    // Find index of highest priority item (lowest number)
    let highestIndex = 0;
    let highestPriority = PRIORITY_VALUES[legacyQueueArray[0].priority ?? "next"];

    for (let i = 1; i < legacyQueueArray.length; i++) {
        const priority = PRIORITY_VALUES[legacyQueueArray[i].priority ?? "next"];
        if (priority < highestPriority) {
            highestIndex = i;
            highestPriority = priority;
        }
    }

    // Remove and return the item
    const [item] = legacyQueueArray.splice(highestIndex, 1);
    notifySubscribers();
    logQueueEvent("dequeue");
    return item;
}

// Mapping: lP1→dequeueHighestPriority, xY→legacyQueueArray, RW6→PRIORITY_VALUES,
//   Qt→notifySubscribers, U36→logQueueEvent
```

### 3.2 Peek Highest Priority

```javascript
// ============================================
// peekHighestPriority - Get highest priority item without removing
// Location: chunks.90.mjs:2842-2851
// ============================================

// ORIGINAL (for source lookup):
function KY4() {
    if (xY.length === 0) return;
    let A = 0,
        q = RW6[xY[0].priority ?? "next"];
    for (let K = 1; K < xY.length; K++) {
        let Y = RW6[xY[K].priority ?? "next"];
        if (Y < q) A = K, q = Y
    }
    return xY[A]
}

// READABLE (for understanding):
function peekHighestPriority() {
    if (legacyQueueArray.length === 0) return;

    let highestIndex = 0;
    let highestPriority = PRIORITY_VALUES[legacyQueueArray[0].priority ?? "next"];

    for (let i = 1; i < legacyQueueArray.length; i++) {
        const priority = PRIORITY_VALUES[legacyQueueArray[i].priority ?? "next"];
        if (priority < highestPriority) {
            highestIndex = i;
            highestPriority = priority;
        }
    }

    return legacyQueueArray[highestIndex];  // Don't remove, just return
}

// Mapping: KY4→peekHighestPriority
```

---

## 4. Pop and Merge Operations

### 4.1 Pop All Editable Commands

```javascript
// ============================================
// popAndMergeQueuedCommands - Merge queue into input box
// Location: chunks.90.mjs:2922-2950
// ============================================

// ORIGINAL (for source lookup):
function nP1(A, q) {
    if (xY.length === 0) return;
    let {
        editable: K = [],
        nonEditable: Y = []
    } = t94([...xY], (H) => Ut(H) ? "editable" : "nonEditable");
    if (K.length === 0) return;
    let z = K.map((H) => TB9(H.value)),
        _ = [...z, A].filter(Boolean).join(`
`),
        w = z.join(`
`).length;
    // ... cursor offset calculation ...
    for (let H of K) U36("popAll", typeof H.value === "string" ? H.value : void 0);
    return xY.length = 0, xY.push(...Y), Qt(), {
        text: _,
        cursorOffset: w,
        images: O
    }
}

// READABLE (for understanding):
function popAndMergeQueuedCommands(currentInput, cursorOffset) {
    if (legacyQueueArray.length === 0) return;

    // Separate editable and non-editable commands
    const { editable = [], nonEditable = [] } = partition(
        [...legacyQueueArray],
        cmd => isEditable(cmd) ? "editable" : "nonEditable"
    );

    if (editable.length === 0) return;

    // Extract text values from editable commands
    const textValues = editable.map(cmd => extractText(cmd.value));
    const mergedText = [...textValues, currentInput]
        .filter(Boolean)
        .join("\n");

    // Calculate new cursor position
    const cursorPos = textValues.join("\n").length;

    // Log pop events
    for (const cmd of editable) {
        logQueueEvent("popAll", typeof cmd.value === "string" ? cmd.value : void 0);
    }

    // Update queue: clear all, add back non-editable
    legacyQueueArray.length = 0;
    legacyQueueArray.push(...nonEditable);
    notifySubscribers();

    return {
        text: mergedText,
        cursorOffset: cursorPos,
        images: collectedImages
    };
}

// Mapping: nP1→popAndMergeQueuedCommands, xY→legacyQueueArray, t94→partition,
//   Ut→isEditable, TB9→extractText, U36→logQueueEvent, Qt→notifySubscribers
```

---

## 5. Subscriber Notification System

### 5.1 Subscribe to Queue Changes

```javascript
// ============================================
// subscribeToQueueChanges - Register change listener
// Location: chunks.90.mjs:2794-2800
// ============================================

// ORIGINAL (for source lookup):
function hW6(A) {
    return VV8.add(A), () => {
        VV8.delete(A)
    }
}

// READABLE (for understanding):
function subscribeToQueueChanges(callback) {
    queueSubscribers.add(callback);
    return () => {
        queueSubscribers.delete(callback);  // Unsubscribe function
    };
}

// Mapping: hW6→subscribeToQueueChanges, VV8→queueSubscribers
```

### 5.2 Notify All Subscribers

```javascript
// ============================================
// notifySubscribers - Call all registered callbacks
// Location: chunks.90.mjs:2789-2792
// ============================================

// ORIGINAL (for source lookup):
function Qt() {
    e94 = Object.freeze([...xY]);
    for (let A of VV8) A()
}

// READABLE (for understanding):
function notifySubscribers() {
    frozenQueueSnapshot = Object.freeze([...legacyQueueArray]);  // Immutable copy
    for (const callback of queueSubscribers) {
        callback();
    }
}

// Mapping: Qt→notifySubscribers, e94→frozenQueueSnapshot, xY→legacyQueueArray, VV8→queueSubscribers
```

---

## 6. Integration with Steering

### 6.1 Queue Check in Cancel Handler

```javascript
// Location: chunks.193.mjs:2614-2618

if (d36()) {  // isPromptQueueingEnabled() - checks xY.length > 0
    if (O) {   // if popCommandFromQueue exists
        O();   // popCommandFromQueue() - merge queue into input box
        return
    }
}
```

**Behavior Flow**:
```
User presses Escape:
    │
    ├── isStreaming? ──YES──► abort stream, return
    │
    └── isStreaming? ──NO───► check queue
                                │
                                ├── queue empty? ──► cancel (no-op)
                                │
                                └── queue has items? ──► pop into input box
                                                          (user can edit before submitting)
```

### 6.2 Enqueue on Interrupt-on-Submit

```javascript
// Location: chunks.194.mjs:445-451

if (state.hasInterruptibleToolInProgress) {
    state.abortController?.abort("interrupt");
    _0({  // enqueueToLegacyQueue
        value: inputText.trim(),
        mode: currentMode,
        pastedContents: pastedContent,
        skipSlashCommands: skipFlag,
        uuid: generateUUID()
    });
    // ... clear input, reset state
}
```

---

## 7. Complete Symbol Reference

| Symbol | Readable | Location | Type | Description |
|--------|----------|----------|------|-------------|
| xY | legacyQueueArray | chunks.90.mjs:2970 | array | Main queue storage |
| e94 | frozenQueueSnapshot | chunks.90.mjs:2970 | array | Immutable snapshot |
| VV8 | queueSubscribers | chunks.90.mjs:2970 | Set | Change listeners |
| RW6 | PRIORITY_VALUES | chunks.90.mjs:2971 | object | Priority value map |
| d36 | isPromptQueueingEnabled | chunks.90.mjs:2812 | function | Check queue has items |
| qY4 | getLegacyQueueLength | chunks.90.mjs:2808 | function | Get queue size |
| _0 | enqueueToLegacyQueue | chunks.90.mjs:2816 | function | Add with "next" priority |
| w0 | enqueueTaskNotification | chunks.90.mjs:2823 | function | Add with "later" priority |
| lP1 | dequeueHighestPriority | chunks.90.mjs:2830 | function | Remove highest priority |
| KY4 | peekHighestPriority | chunks.90.mjs:2842 | function | View highest priority |
| _Y4 | clearAgentNotifications | chunks.90.mjs:2885 | function | Clear all items |
| nP1 | popAndMergeQueuedCommands | chunks.90.mjs:2922 | function | Merge into input |
| Qt | notifySubscribers | chunks.90.mjs:2789 | function | Notify listeners |
| hW6 | subscribeToQueueChanges | chunks.90.mjs:2794 | function | Register listener |
| U36 | logQueueEvent | chunks.90.mjs | function | Telemetry logging |

---

## 8. Related Documentation

- [interrupt_flow.md](./interrupt_flow.md) - Complete interrupt lifecycle
- [implementation.md](./implementation.md) - Core steering logic
- [algorithms.md](./algorithms.md) - Algorithm deep analysis

---

**Last Updated**: 2026-03-24
**Version**: Claude Code 2.1.76