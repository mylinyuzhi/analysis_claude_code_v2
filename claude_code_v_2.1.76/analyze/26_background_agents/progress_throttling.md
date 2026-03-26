# Progress Throttling Algorithm (Claude Code 2.1.76)

> Deep analysis of how progress notifications are rate-limited to prevent context noise.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `countTurnsSinceLastProgress` (TIY) — chunks.144.mjs:832
- `getUnifiedTasksAttachment` (vIY) — chunks.142.mjs:2719

---

## Overview

Progress throttling prevents background task progress from flooding the LLM context. Without throttling, every LLM turn would include progress attachments for all running tasks, consuming tokens and creating noise.

---

## The Problem

### Without Throttling

```
Turn 1: <task_progress task_id="a1">Running step 1...</task_progress>
Turn 2: <task_progress task_id="a1">Running step 2...</task_progress>
Turn 3: <task_progress task_id="a1">Running step 3...</task_progress>
Turn 4: <task_progress task_id="a1">Running step 4...</task_progress>
...
Turn 20: <task_progress task_id="a1">Running step 20...</task_progress>
```

**Issues:**
1. **Context bloat** - Every turn adds more XML
2. **Redundancy** - Same task, minor updates
3. **Token waste** - Consumes API budget
4. **Noise** - Distracts from actual progress

### With Throttling (3-turn threshold)

```
Turn 1: <task_progress task_id="a1">Running step 1...</task_progress>  ← Shown (first)
Turn 2: (no progress for a1)                                           ← Skipped (turns=1)
Turn 3: (no progress for a1)                                           ← Skipped (turns=2)
Turn 4: <task_progress task_id="a1">Running step 4...</task_progress>  ← Shown (turns=3)
Turn 5: (no progress for a1)                                           ← Skipped (turns=1)
Turn 6: (no progress for a1)                                           ← Skipped (turns=2)
Turn 7: <task_progress task_id="a1">Running step 7...</task_progress>  ← Shown (turns=3)
```

**Benefits:**
1. **Token efficiency** - 3x fewer progress attachments
2. **Signal clarity** - Progress is meaningful, not noise
3. **User patience** - Matches attention span

---

## Algorithm Implementation

### countTurnsSinceLastProgress (TIY)

**Location:** chunks.144.mjs:832-860

**What it does:** Counts how many assistant turns have occurred since the last progress attachment for each task.

**How it works:**

```javascript
// ============================================
// countTurnsSinceLastProgress - Progress frequency calculator
// Location: chunks.144.mjs:832-860
// ============================================

// READABLE (for understanding):
function countTurnsSinceLastProgress(messages) {
    let turnsSinceProgress = new Map();  // taskId -> turn count
    let seenTasks = new Set();
    let turnCount = 0;

    // Iterate BACKWARDS from most recent message
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Count assistant turns (skip whitespace-only)
        if (message?.type === "assistant" && !isWhitespaceOnly(message)) {
            turnCount++;
        }
        // Found last progress reminder for a task
        else if (message?.type === "attachment" &&
                 message.attachment.type === "task_progress") {
            let taskId = message.attachment.taskId;
            if (!seenTasks.has(taskId)) {
                turnsSinceProgress.set(taskId, turnCount);
                seenTasks.add(taskId);
            }
        }
    }

    return turnsSinceProgress;
}

// Returns Map where:
// - taskId -> number of turns since last progress
// - Tasks not in map have never had progress shown (Infinity)
```

### Key Algorithm Insights

#### 1. Backward Iteration

**Why backward?**
- We only care about the **most recent** progress for each task
- Backward iteration finds it efficiently
- Stops checking a task once found

```javascript
// Backward iteration pattern
for (let i = messages.length - 1; i >= 0; i--) {
    // Process message...
}
```

#### 2. First-Found Wins

**Why `seenTasks` set?**
```javascript
if (!seenTasks.has(taskId)) {
    turnsSinceProgress.set(taskId, turnCount);
    seenTasks.add(taskId);
}
```

- Only the **first** progress found for each task matters
- Earlier progress entries are ignored
- This ensures we measure from the **most recent** progress

#### 3. Infinity for New Tasks

**Why return Map instead of defaulting to 0?**
- Tasks not in the map have **never** had progress shown
- Caller should treat these as `Infinity`
- Infinity ensures **first progress is always shown**

```javascript
// In getUnifiedTasksAttachment
let turns = turnsSinceProgress.get(taskId) ?? Infinity;
if (turns >= 3) {
    // Show progress
}
```

---

## Throttle Decision Logic

### In getUnifiedTasksAttachment

```javascript
// ============================================
// getUnifiedTasksAttachment - Build task attachments with throttling
// Location: chunks.142.mjs:2719-2800
// ============================================

// READABLE (for understanding):
function getUnifiedTasksAttachment(messages, tasks, setAppState) {
    let attachments = [];

    // Step 1: Count turns since last progress for each task
    let turnsSinceProgress = countTurnsSinceLastProgress(messages);

    // Step 2: Process each task
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.status === "running") {
            // Get turns since last progress (default Infinity for new tasks)
            let turns = turnsSinceProgress.get(taskId) ?? Infinity;

            // Throttle: only show if >= 3 turns
            if (turns >= 3) {
                attachments.push({
                    type: "task_progress",
                    taskId: taskId,
                    taskType: task.type,
                    message: task.progress?.summary ?? "Running..."
                });
            }
        }
        else if (isTerminalStatus(task.status) && !task.notified) {
            // Terminal status: always show task_status
            attachments.push({
                type: "task_status",
                taskId: taskId,
                taskType: task.type,
                status: task.status,
                description: task.description,
                // Include delta output from output file
                deltaSummary: readOutputFileDelta(taskId, task.outputOffset)
            });
        }
    }

    return attachments;
}
```

---

## Threshold Rationale

### Why 3 Turns?

**Analysis:**

| Threshold | Update Frequency | Token Usage | User Awareness |
|-----------|-----------------|-------------|----------------|
| 1 turn | Every turn | High | High (noisy) |
| 2 turns | Every other turn | Medium | Medium |
| **3 turns** | **Every 3rd turn** | **Low** | **Good** |
| 5 turns | Every 5th turn | Very low | Low |

**3-turn sweet spot:**
1. **Context efficiency** - ~66% token reduction vs. no throttle
2. **User patience** - 3 turns ≈ 1-2 minutes of agent work
3. **Progress visibility** - Still frequent enough to be useful
4. **Multiple tasks** - With 3 running tasks, one shows each turn

---

## Multi-Task Scenario

### Example: 3 Running Tasks

```
Turn 1: progress for A (turnsSince=∞), B (turnsSince=∞), C (turnsSince=∞)
        → Show all three (first time)

Turn 2: (no progress - turns for A,B,C all = 1)

Turn 3: (no progress - turns for A,B,C all = 2)

Turn 4: progress for A (turnsSince=3), B (turnsSince=3), C (turnsSince=3)
        → Show all three
```

**Result:** Each task gets progress shown every 3 turns.

### Example: Staggered Task Starts

```
Turn 1: Task A starts
        → progress for A (first time)

Turn 2: Task B starts
        → progress for B (first time), A skipped (turnsSince=1)

Turn 3: Task C starts
        → progress for C (first time), A skipped (turnsSince=2), B skipped (turnsSince=1)

Turn 4: progress for A (turnsSince=3)
        → Show A, B skipped (turnsSince=2), C skipped (turnsSince=1)

Turn 5: progress for B (turnsSince=3)
        → Show B, A skipped (turnsSince=1), C skipped (turnsSince=2)
```

**Result:** Tasks are naturally interleaved, avoiding all showing at once.

---

## Edge Cases

### No Previous Progress

When a task has never had progress shown:
- `turnsSinceProgress.get(taskId)` returns `undefined`
- Caller uses `?? Infinity` to default
- `Infinity >= 3` is true
- **First progress always shown**

### Empty Message History

When no messages exist:
- `turnCount` stays at 0
- Map is empty
- All tasks get `Infinity`
- **All running tasks show progress**

### Whitespace-Only Assistant Messages

These are skipped in turn counting:
```javascript
if (message?.type === "assistant" && !isWhitespaceOnly(message)) {
    turnCount++;
}
```

**Why:** Some assistant messages are empty or whitespace-only, representing internal operations. These shouldn't count as "turns" for throttling.

### Interleaved Progress from Different Tasks

The `seenTasks` set handles this:
```javascript
if (!seenTasks.has(taskId)) {
    turnsSinceProgress.set(taskId, turnCount);
    seenTasks.add(taskId);
}
```

- Each task is tracked independently
- Finding progress for task A doesn't affect counting for task B
- First progress found for each task wins

---

## Performance Analysis

### Time Complexity

**countTurnsSinceLastProgress:**
- O(n) where n = number of messages
- Single backward pass through message array
- Early termination not possible (need to find all tasks' last progress)

**Space Complexity:**
- O(m) where m = number of tasks with progress in history
- Map stores one entry per task with previous progress

### Optimization Opportunities

1. **Caching** - Cache the result between turns
2. **Early termination** - Stop once all known tasks found
3. **Sliding window** - Only search recent messages

**Current implementation:** Simple linear scan is fast enough for typical conversation lengths (hundreds of messages).

---

## Integration Points

### With System Reminder System

```
Main Loop (before LLM call)
    │
    ▼
getUnifiedTasksAttachment()
    │
    ├── countTurnsSinceLastProgress(messages)
    │
    ├── For each running task:
    │   ├── if turns >= 3: add task_progress
    │   └── update outputOffset
    │
    └── Return attachments
    │
    ▼
Inject as <system-reminder> into context
```

### With Progress Tracking

```
agentLoopRunner (subagent)
    │
    ├── Each turn: updateTaskProgress()
    │
    └── Progress stored in appState.tasks[id].progress
            │
            ▼
        getUnifiedTasksAttachment reads progress
        and decides whether to include based on throttle
```

---

## Configuration

### Hardcoded Threshold

The threshold (3 turns) is currently hardcoded:

```javascript
if (turns >= 3) {
    // Show progress
}
```

**Why not configurable:**
1. **Simplicity** - One less setting to manage
2. **Consistency** - All users get same experience
3. **Optimization** - 3 is empirically good

### Future Considerations

Possible enhancements:
1. **Per-task throttle** - Different rates for different task types
2. **Dynamic throttle** - Adjust based on task count
3. **User preference** - Allow configuration