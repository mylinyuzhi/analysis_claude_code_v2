# Keyboard Shortcuts Complete (Claude Code 2.1.76)

> Complete documentation of keyboard shortcuts for subagent and background agent interaction.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `U4q` - Kill all local agents — `chunks.146.mjs:2029`
- `x66` - Trigger abort signal — `chunks.146.mjs:2012`

---

## Global Shortcuts

### When Background Agents Running

| Shortcut | Action | Implementation |
|----------|--------|----------------|
| `Ctrl+C` | Show kill confirmation | Checks `hasRunningLocalAgents` |
| `Ctrl+F` | Execute kill all | Calls `U4q` (killAllLocalAgents) |

### Ctrl+C → Ctrl+F Kill Flow

```
User presses Ctrl+C
        │
        ▼
┌───────────────────────────────────────────┐
│ Check: hasRunningLocalAgents()            │
│ Object.values(tasks).some(                │
│   t => t.type === "local_agent"           │
│        && t.status === "running"          │
│ )                                         │
└───────────────────┬───────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼ No                    ▼ Yes
┌───────────────┐       ┌───────────────────────────────────┐
│ Cancel stream │       │ Show confirmation message:        │
│ (normal Ctrl) │       │ "Press Ctrl+F to stop background  │
│               │       │  agents"                          │
└───────────────┘       │ (timeout: 5 seconds)              │
                        └───────────────────┬───────────────┘
                                            │
                                ┌───────────┴───────────┐
                                │                       │
                                ▼ Timeout               ▼ Ctrl+F
                        ┌───────────────┐       ┌───────────────────┐
                        │ Revert to     │       │ Execute killAll:  │
                        │ normal        │       │ 1. U4q(tasks)     │
                        │ behavior      │       │ 2. d4q(taskId)    │
                        └───────────────┘       │ 3. notify user    │
                                                └───────────────────┘
```

---

## Task List Modal Shortcuts

### Opening Task List

| Method | Action |
|--------|--------|
| `/tasks` | Open task list modal |
| Click status line | Open task list modal |

### Navigation in Task List

| Key | Action |
|-----|--------|
| `↑` / `k` | Move selection up |
| `↓` / `j` | Move selection down |
| `Enter` | View task details |
| `Escape` | Close modal |

### Task Actions

| Key | Action | Available When |
|-----|--------|----------------|
| `x` | Kill selected task | `task.status === "running"` |
| `f` | Foreground teammate | `task.type === "in_process_teammate"` |

### Action Availability Matrix

| Task Type | `x` (Kill) | `f` (Foreground) |
|-----------|------------|------------------|
| `local_agent` | ✓ (running) | ✗ |
| `local_bash` | ✓ (running) | ✗ |
| `in_process_teammate` | ✓ (running) | ✓ (running) |
| `local_workflow` | ✓ (running) | ✗ |
| `remote_agent` | ✓ (running) | ✗ |

---

## Status Line Shortcuts

### Interactive Elements

```
┌──────────────────────────────────────────────────────────────────┐
│ Status Line                                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  2 running • Ctrl+C to cancel                                     │
│  └──────┘   └─────────────────────┘                              │
│   count        interactive hint (clickable)                       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Click Behavior

| Element | Click Action |
|---------|--------------|
| Running count | Open task list modal |
| "Ctrl+C to cancel" | Open task list modal |

---

## Kill Handler Implementation

### Kill All Local Agents (U4q)

```javascript
// ============================================
// U4q - Kill all local agents
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllLocalAgents(tasks, setAppState) {
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            // Trigger abort signal for this task
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId,
//          Y→task, x66→triggerAbortSignal
```

### Trigger Abort Signal (x66)

```javascript
// ============================================
// x66 - Trigger abort signal for task
// Location: chunks.146.mjs:2012-2016
// ============================================

// ORIGINAL (for source lookup):
function x66(A, q) {
    let K = !1;
    if (i9(A, q, (Y) => {
            if (Y.status !== "running") return Y;
            return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
                ...Y,
                // ...
            }
        }), K) $O(A);
    return K
}

// READABLE (for understanding):
function triggerAbortSignal(taskId, setAppState) {
    let wasRunning = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;  // Not running, no change

        wasRunning = true;

        // Abort the controller
        task.abortController?.abort();

        // Run cleanup
        task.unregisterCleanup?.();

        return {
            ...task,
            // Cleanup state updates
        };
    });

    // If task was running, trigger notification
    if (wasRunning) {
        notifyTaskAborted(taskId);
    }

    return wasRunning;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasRunning,
//          i9→atomicUpdateTask, Y→task, $O→notifyTaskAborted
```

---

## Task Kill Routing

### Kill by Task Type

```javascript
// ============================================
// Kill routing based on task type
// Location: chunks.162.mjs (inferred)
// ============================================

// READABLE (for understanding):
function handleTaskKill(task, setAppState) {
    switch (task.type) {
        case "local_bash":
            // Kill bash process
            killBashTask(task.id);  // wQ6 - chunks.95.mjs:1918
            break;

        case "local_agent":
            // Kill agent via abort signal
            triggerAbortSignal(task.id, setAppState);  // x66
            markTaskKilled(task.id, setAppState);       // d4q
            break;

        case "in_process_teammate":
            // Kill teammate
            killInProcessTeammate(task.id);  // bZ1 - chunks.113.mjs:1272
            break;

        case "local_workflow":
            // Kill workflow
            killWorkflowTask(task.id, setAppState);
            break;

        case "remote_agent":
            // Kill remote session
            killRemoteAgentTask(task.id);
            break;

        default:
            k(`Unknown task type for kill: ${task.type}`);
    }
}
```

---

## Confirmation Message System

### Kill Confirmation Display

```javascript
// ============================================
// Kill confirmation message
// Location: chunks.193.mjs:2605-2656
// ============================================

// READABLE (for understanding):
function showKillConfirmation(timeout) {
    // Add temporary notification
    addNotification({
        key: "kill-agents-confirm",
        text: "Press Ctrl+F again to stop background agents",
        priority: "immediate",
        timeoutMs: timeout  // Typically 5000ms
    });
}
```

### Notification After Kill

```javascript
// READABLE (for understanding):
function notifyKillResult(killedTasks) {
    if (killedTasks.length === 0) return;

    let message;
    if (killedTasks.length === 1) {
        message = `Background agent "${killedTasks[0].description}" was stopped by the user.`;
    } else {
        message = `${killedTasks.length} background agents were stopped by the user.`;
    }

    addNotification({
        value: message,
        mode: "task-notification"
    });
}
```

---

## Keybinding Configuration

### User Customization

Keybindings can be customized via `~/.claude/keybindings.json`:

```json
{
  "bindings": {
    "kill-all-agents": "ctrl+f",
    "task-list": "ctrl+t"
  }
}
```

### Available Bindings for Background Agents

| Binding Name | Default | Description |
|--------------|---------|-------------|
| `kill-all-agents` | `Ctrl+F` | Kill all running background agents |
| `task-list` | `/tasks` | Open task list modal |

---

## Status Icons in Task List

### Icon Definitions

| Status | Icon | Animation | Color |
|--------|------|-----------|-------|
| `pending` | ○ | None | Dim |
| `running` | ◐ | Spinner | Yellow |
| `completed` | ✓ | None | Green |
| `failed` | ✗ | None | Red |
| `killed` | ○ | None | Dim |

### Animation Cycle for Running

```
Running spinner animation:
◐ → ◑ → ◒ → ◓ → ◐ (loops)

Frame duration: ~200ms
```

---

## Cross-Feature Integration

### Integration with System Reminders

```
Keyboard Shortcut (Ctrl+F)
        │
        ▼
killAllLocalAgents (U4q)
        │
        ├── For each task:
        │   │
        │   ├── triggerAbortSignal (x66)
        │   │   └── AbortController.abort()
        │   │
        │   └── markTaskKilled (d4q)
        │       └── Sets status: "killed"
        │       └── Sets notified: true
        │
        └── notifyKillResult()
            └── addNotification()
                └── Shown in TUI
```

### Integration with Telemetry

```javascript
// Telemetry event sent on kill
sendTelemetry({
    type: "system",
    subtype: "task_killed",
    task_id: taskId,
    source: "keyboard_shortcut"  // or "task_list" or "status_line"
});
```

---

## v2.1.76 Changes

### New Features

1. **Ctrl+F Kill All** - Explicit shortcut for killing all background agents
2. **Two-Stage Confirmation** - Safety mechanism to prevent accidental kills
3. **Partial Results Preserved** - Output file preserved on kill
4. **Improved Notification** - Better messaging for kill events

### Keybinding Migration

```
v2.1.75 and earlier:
- Ctrl+C would immediately cancel stream OR kill agents (ambiguous)

v2.1.76:
- Ctrl+C shows confirmation first
- Ctrl+F executes kill (explicit)
- Clearer intent separation
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `wQ6` | killBashTask | chunks.95.mjs:1918 | ✓ Verified |
| `bZ1` | killInProcessTeammate | chunks.113.mjs:1272 | ✓ Verified |

---

## Related Documents

- [ui_design_complete.md](./ui_design_complete.md) - UI design
- [kill_handlers_source_restored.md](./kill_handlers_source_restored.md) - Kill handlers
- [task_management_source_restored.md](../08_subagent/task_management_source_restored.md) - Task management
- [../32_keybindings/](../32_keybindings/) - Keybinding configuration