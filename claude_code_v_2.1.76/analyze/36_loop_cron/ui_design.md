# Loop/Cron UI Design

> **Module**: Loop/Cron Scheduling System - UI Design
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.145.mjs:850-910`

---

## Table of Contents

1. [UI Rendering Functions](#1-ui-rendering-functions)
2. [Tool Message Flow](#2-tool-message-flow)
3. [Display States](#3-display-states)
4. [Component Details](#4-component-details)
5. [/loop Command Interaction](#5-loop-command-interaction)
6. [Missed Task Notification UI](#6-missed-task-notification-ui)
7. [React Hook Integration](#7-react-hook-integration)
8. [Error State Handling](#8-error-state-handling)
9. [Complete Interaction Sequences](#9-complete-interaction-sequences)
10. [Terminal UI Color and Styling](#10-terminal-ui-color-and-styling)
11. [Telemetry Events](#11-telemetry-events)
12. [Text Truncation Utility (R3)](#12-text-truncation-utility-r3)
13. [Ink Component Hierarchy](#13-ink-component-hierarchy)
14. [Progress and Rejection Messages](#14-progress-and-rejection-messages)

---

## 1. UI Rendering Functions

### Function Overview

Each tool defines rendering functions for different UI states:

| Tool | renderToolUseMessage | renderToolResultMessage | renderToolUseProgressMessage |
|------|---------------------|------------------------|------------------------------|
| CronCreate | `z7q` | `_7q` | `xT6` (null) |
| CronDelete | `w7q` | `O7q` | `xT6` (null) |
| CronList | `$7q` (empty) | `H7q` | `xT6` (null) |

### renderToolUseMessage for CronCreate (z7q)

**What it does:** Formats the tool use message shown when CronCreate is invoked.

**Location:** chunks.145.mjs:850-852

```javascript
// ============================================
// renderCronCreateUseMessage - Format tool invocation display
// Location: chunks.145.mjs:850-852
// ============================================

// ORIGINAL (for source lookup):
function z7q(A) {
    return `${A.cron??""}${A.prompt?`: ${R3(A.prompt,60,!0)}`:""}`
}

// READABLE (for understanding):
function renderCronCreateUseMessage(input) {
    // Format: "*/5 * * * *: /check-status" (truncated to 60 chars)
    const cron = input.cron ?? "";
    const prompt = input.prompt
        ? `: ${truncate(input.prompt, 60, true)}`  // R3 = truncate
        : "";
    return `${cron}${prompt}`;
}

// Mapping: z7q→renderCronCreateUseMessage, R3→truncate
```

**Display Examples:**

| Input | Output |
|-------|--------|
| `{cron: "*/5 * * * *", prompt: "/check-status"}` | `*/5 * * * *: /check-status` |
| `{cron: "0 9 * * 1-5", prompt: "Run morning tests for the deployment pipeline"}` | `0 9 * * 1-5: Run morning tests for the deployment pipe…` |

### renderToolResultMessage for CronCreate (_7q)

**What it does:** Renders the confirmation message when a job is successfully scheduled.

**Location:** chunks.145.mjs:854-860

```javascript
// ============================================
// renderCronCreateResultMessage - Format success display
// Location: chunks.145.mjs:854-860
// ============================================

// ORIGINAL (for source lookup):
function _7q(A) {
    return BZ.default.createElement(t1, null, BZ.default.createElement(T, null, "Scheduled ", BZ.default.createElement(T, {
        bold: !0
    }, A.id), " ", BZ.default.createElement(T, {
        dimColor: !0
    }, "(", A.humanSchedule, ")")))
}

// READABLE (for understanding):
function renderCronCreateResultMessage(result) {
    return (
        <Box>
            <Text>
                Scheduled <Text bold>{result.id}</Text>{" "}
                <Text dimColor>({result.humanSchedule})</Text>
            </Text>
        </Box>
    );
}

// Mapping: _7q→renderCronCreateResultMessage, BZ→React, t1→Box, T→Text
```

**Display Output:**

```
Scheduled abc12345 (Every 5 minutes)
```

### renderToolUseMessage for CronDelete (w7q)

**Location:** chunks.145.mjs:862-864

```javascript
// ============================================
// renderCronDeleteUseMessage - Format delete request display
// Location: chunks.145.mjs:862-864
// ============================================

// ORIGINAL (for source lookup):
function w7q(A) {
    return A.id ?? ""
}

// READABLE (for understanding):
function renderCronDeleteUseMessage(input) {
    // Just show the job ID
    return input.id ?? "";
}
```

**Display Output:**

```
abc12345
```

### renderToolResultMessage for CronDelete (O7q)

**Location:** chunks.145.mjs:866-870

```javascript
// ============================================
// renderCronDeleteResultMessage - Format cancellation confirmation
// Location: chunks.145.mjs:866-870
// ============================================

// ORIGINAL (for source lookup):
function O7q(A) {
    return BZ.default.createElement(t1, null, BZ.default.createElement(T, null, "Cancelled ", BZ.default.createElement(T, {
        bold: !0
    }, A.id)))
}

// READABLE (for understanding):
function renderCronDeleteResultMessage(result) {
    return (
        <Box>
            <Text>
                Cancelled <Text bold>{result.id}</Text>
            </Text>
        </Box>
    );
}

// Mapping: O7q→renderCronDeleteResultMessage
```

**Display Output:**

```
Cancelled abc12345
```

### renderToolUseMessage for CronList ($7q)

**Location:** chunks.145.mjs:872-874

```javascript
// ============================================
// renderCronListUseMessage - Empty (no input parameters)
// Location: chunks.145.mjs:872-874
// ============================================

// ORIGINAL (for source lookup):
function $7q() {
    return ""
}

// READABLE (for understanding):
function renderCronListUseMessage() {
    // No input to display
    return "";
}
```

### renderToolResultMessage for CronList (H7q)

**Location:** chunks.145.mjs:876-887

```javascript
// ============================================
// renderCronListResultMessage - Format job list display
// Location: chunks.145.mjs:876-887
// ============================================

// ORIGINAL (for source lookup):
function H7q(A) {
    if (A.jobs.length === 0) return BZ.default.createElement(t1, null, BZ.default.createElement(T, {
        dimColor: !0
    }, "No scheduled jobs"));
    return BZ.default.createElement(t1, null, A.jobs.map((q) => BZ.default.createElement(T, {
        key: q.id
    }, BZ.default.createElement(T, {
        bold: !0
    }, q.id), " ", BZ.default.createElement(T, {
        dimColor: !0
    }, q.humanSchedule))))
}

// READABLE (for understanding):
function renderCronListResultMessage(result) {
    // Empty state
    if (result.jobs.length === 0) {
        return (
            <Box>
                <Text dimColor>No scheduled jobs</Text>
            </Box>
        );
    }

    // List all jobs
    return (
        <Box>
            {result.jobs.map(job => (
                <Text key={job.id}>
                    <Text bold>{job.id}</Text>{" "}
                    <Text dimColor>{job.humanSchedule}</Text>
                </Text>
            ))}
        </Box>
    );
}

// Mapping: H7q→renderCronListResultMessage
```

**Display Output (with jobs):**

```
abc12345 Every 5 minutes
def67890 Weekdays at 9:00 AM
ghi24680 Tomorrow at 2:30 PM
```

**Display Output (empty):**

```
No scheduled jobs
```

### Common Functions

#### renderToolUseProgressMessage (xT6)

**Location:** chunks.145.mjs:889-891

```javascript
// ORIGINAL (for source lookup):
function xT6() {
    return null
}

// READABLE (for understanding):
function renderToolUseProgressMessage() {
    // No progress indicator for cron tools (fast operations)
    return null;
}
```

#### renderToolUseRejectedMessage (uT6)

**Location:** chunks.145.mjs:893-895

```javascript
// ORIGINAL (for source lookup):
function uT6() {
    return BZ.default.createElement(T3, null)
}

// READABLE (for understanding):
function renderToolUseRejectedMessage() {
    // Standard rejection spinner
    return <Spinner />;
}
```

#### renderToolUseErrorMessage (mT6)

**Location:** chunks.145.mjs:897-904

```javascript
// ORIGINAL (for source lookup):
function mT6(A, { verbose: q }) {
    return BZ.default.createElement(eK, {
        result: A,
        verbose: q
    })
}

// READABLE (for understanding):
function renderToolUseErrorMessage(error, { verbose }) {
    // Standard error display component
    return <ErrorDisplay result={error} verbose={verbose} />;
}
```

---

## 2. Tool Message Flow

### CronCreate Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        USER/ACTION                                           │
│                     Agent calls CronCreate                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TOOL USE DISPLAY                                      │
│                     renderToolUseMessage (z7q)                               │
│                                                                              │
│     "*/5 * * * *: /check-status"                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PROCESSING                                            │
│                     validateInput → call                                     │
│                                                                              │
│     • Parse cron expression                                                 │
│     • Check max jobs limit                                                  │
│     • Create task in storage                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TOOL RESULT DISPLAY                                   │
│                     renderToolResultMessage (_7q)                            │
│                                                                              │
│     "Scheduled abc12345 (Every 5 minutes)"                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LLM-BOUND RESULT                                      │
│                     mapToolResultToToolResultBlockParam                      │
│                                                                              │
│     "Scheduled recurring job abc12345 (Every 5 minutes).                    │
│      Session-only (not written to disk, dies when Claude exits).            │
│      Auto-expires after 3 days. Use CronDelete to cancel sooner."           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CronDelete Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TOOL USE DISPLAY                                      │
│                     renderToolUseMessage (w7q)                               │
│                                                                              │
│     "abc12345"                                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TOOL RESULT DISPLAY                                   │
│                     renderToolResultMessage (O7q)                            │
│                                                                              │
│     "Cancelled abc12345"                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CronList Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TOOL USE DISPLAY                                      │
│                     renderToolUseMessage ($7q)                               │
│                                                                              │
│     (empty string)                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TOOL RESULT DISPLAY                                   │
│                     renderToolResultMessage (H7q)                            │
│                                                                              │
│     "abc12345 Every 5 minutes                                                │
│      def67890 Weekdays at 9:00 AM"                                          │
│                                                                              │
│     OR (if empty):                                                          │
│     "No scheduled jobs" (dimmed)                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Display States

### CronCreate States

| State | Function | Display |
|-------|----------|---------|
| Invoking | `z7q` | `*/5 * * * *: /check-status` |
| Processing | `xT6` | (nothing - fast operation) |
| Success | `_7q` | `Scheduled abc12345 (Every 5 minutes)` |
| Rejected | `uT6` | Spinner |
| Error | `mT6` | Error message |

### CronDelete States

| State | Function | Display |
|-------|----------|---------|
| Invoking | `w7q` | `abc12345` |
| Success | `O7q` | `Cancelled abc12345` |
| Error | `mT6` | `No scheduled job with id 'abc12345'` |

### CronList States

| State | Function | Display |
|-------|----------|---------|
| Invoking | `$7q` | (empty) |
| Success (jobs) | `H7q` | List of jobs |
| Success (empty) | `H7q` | `No scheduled jobs` (dimmed) |

---

## 4. Component Details

### Text Styling

The UI uses Ink (React for CLI) with standard text styling:

```javascript
<Text bold>ID</Text>              // Bold text for job IDs
<Text dimColor>(Every 5 min)</Text>  // Dimmed for secondary info
<Text>Regular text</Text>            // Default styling
```

### Box Layout

```javascript
<Box>
    {/* Content wraps in a flex container */}
</Box>
```

### Job ID Format

Job IDs are 8-character hexadecimal strings generated from UUIDs:

```javascript
// Generation (chunks.145.mjs:752)
const id = crypto.randomUUID().slice(0, 8);  // e.g., "abc12345"
```

### Human Schedule Formatting

The `humanSchedule` field is generated by `formatCronHumanReadable` (CT6):

| Cron Expression | Human Schedule |
|-----------------|----------------|
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour |
| `0 9 * * *` | Every day at 9:00 AM |
| `0 9 * * 1-5` | Weekdays at 9:00 AM |
| `30 14 28 2 *` | Feb 28 at 2:30 PM |

### Truncation

Prompts are truncated to 60 characters with ellipsis:

```javascript
// R3 function (not shown, imported from another module)
truncate(prompt, 60, true)  // true = add ellipsis
```

---

## UI Mockups

### CronCreate Success

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Tool: CronCreate                                               │
│  Input: */5 * * * *: /check-status                              │
│                                                                 │
│  Result: Scheduled abc12345 (Every 5 minutes)                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### CronList with Jobs

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Tool: CronList                                                 │
│                                                                 │
│  Result:                                                        │
│    abc12345 Every 5 minutes                                     │
│    def67890 Weekdays at 9:00 AM                                 │
│    ghi24680 Tomorrow at 2:30 PM                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### CronList Empty

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Tool: CronList                                                 │
│                                                                 │
│  Result: No scheduled jobs                                      │
│          (dimmed text)                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### CronDelete Success

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Tool: CronDelete                                               │
│  Input: abc12345                                                │
│                                                                 │
│  Result: Cancelled abc12345                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. /loop Command Interaction

### User Input Parsing Flow

The `/loop` command provides a user-friendly interface for creating recurring tasks. The parsing flow:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        USER INPUT                                             │
│                     /loop 5m /check-status                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SKILL REGISTRATION                                     │
│                     registerLoopSkill (gJz)                                   │
│                                                                              │
│  • name: "loop"                                                              │
│  • isEnabled: isKairosCronEnabled()                                          │
│  • argumentHint: "[interval] <prompt>"                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INPUT PARSING (BJz)                                    │
│                     buildLoopPrompt(trimmedInput)                             │
│                                                                              │
│  Rules (in priority order):                                                 │
│  1. Leading token matches ^\d+[smhd]$ → that's the interval                 │
│  2. Trailing "every N unit" → extract interval from end                     │
│  3. Default: 10m interval, entire input is prompt                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INTERVAL → CRON CONVERSION                             │
│                                                                              │
│  | Input    | Cron Expression   |                                            │
│  |----------|-------------------|                                            │
│  | 5m       | */5 * * * *       |                                            │
│  | 2h       | 0 */2 * * *       |                                            │
│  | 1d       | 0 0 */1 * *       |                                            │
│  | 30s      | */1 * * * *       | (ceil(30/60) = 1 min)                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AGENT INSTRUCTION                                      │
│                     Prompt instructs LLM to call CronCreate                  │
│                                                                              │
│  Call CronCreate with:                                                       │
│  • cron: "*/5 * * * *"                                                       │
│  • prompt: "/check-status"                                                   │
│  • recurring: true                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        USER CONFIRMATION                                      │
│                     Agent confirms to user:                                   │
│                                                                              │
│  "Scheduled job abc12345 (Every 5 minutes).                                  │
│   Auto-expires after 3 days. Use CronDelete to cancel."                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### /loop Command Examples

| User Input | Parsed Interval | Parsed Prompt | Cron Expression |
|------------|-----------------|---------------|-----------------|
| `/loop 5m /babysit-prs` | 5m | `/babysit-prs` | `*/5 * * * *` |
| `/loop 30m check the deploy` | 30m | `check the deploy` | `*/30 * * * *` |
| `/loop check the deploy every 20m` | 20m | `check the deploy` | `*/20 * * * *` |
| `/loop check the deploy` | 10m (default) | `check the deploy` | `*/10 * * * *` |
| `/loop check every PR` | 10m (default) | `check every PR` | `*/10 * * * *` |
| `/loop 5m` | - | (empty) | Shows usage |

### Usage Message

**Location:** chunks.181.mjs:1669-1682

```javascript
// ============================================
// USAGE_MESSAGE - Help text for /loop command
// Location: chunks.181.mjs:1669-1682
// ============================================

const USAGE_MESSAGE = `Usage: /loop [interval] <prompt>

Run a prompt or slash command on a recurring interval.

Intervals: Ns, Nm, Nh, Nd (e.g. 5m, 30m, 2h, 1d). Minimum granularity is 1 minute.
If no interval is specified, defaults to 10m.

Examples:
  /loop 5m /babysit-prs
  /loop 30m check the deploy
  /loop 1h /standup 1
  /loop check the deploy          (defaults to 10m)
  /loop check the deploy every 20m`;
```

---

## 6. Missed Task Notification UI

### Missed One-Shot Task Display

When Claude restarts and finds missed one-shot tasks, the UI displays:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MISSED TASK NOTIFICATION                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  The following one-shot scheduled task was missed while Claude was          │
│  not running. It has already been removed from                              │
│  .claude/scheduled_tasks.json.                                              │
│                                                                              │
│  Do NOT execute this prompt yet. First use the AskUserQuestion tool to      │
│  ask whether to run it now. Only execute if the user confirms.              │
│                                                                              │
│  [Tomorrow at 2:30 PM, created 3/22/2026, 10:30:00 AM]                     │
│  ```                                                                         │
│  Check the deployment status                                                │
│  ```                                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Multiple Missed Tasks

When multiple tasks are missed:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MULTIPLE MISSED TASKS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  The following one-shot scheduled tasks were missed while Claude was        │
│  not running. They have already been removed from                          │
│  .claude/scheduled_tasks.json.                                              │
│                                                                              │
│  Do NOT execute these prompts yet. First use the AskUserQuestion tool to    │
│  ask whether to run each one now. Only execute if the user confirms.        │
│                                                                              │
│  [Tomorrow at 2:30 PM, created 3/22/2026, 10:30:00 AM]                     │
│  ```                                                                         │
│  Check the deployment status                                                │
│  ```                                                                         │
│                                                                              │
│  [Weekdays at 9:00 AM, created 3/21/2026, 2:15:00 PM]                      │
│  ```                                                                         │
│  Run morning tests                                                          │
│  ```                                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. React Hook Integration

### useCronScheduler Hook

**Location:** chunks.195.mjs:1956-1985

The UI layer initializes the scheduler via React hooks:

```javascript
// ============================================
// useCronScheduler - React hook for cron scheduler
// Location: chunks.195.mjs:1956-1985
// ============================================

// ORIGINAL (for source lookup):
function someHook({
    isLoading: A,
    assistantMode: q = !1
}) {
    let K = vb1.useRef(A);
    K.current = A;
    let Y = S5(), z = xA();
    vb1.useEffect(() => {
        if (!kR()) return;
        let _ = (O) => w0({
                value: O,
                mode: "prompt",
                priority: "later",
                isMeta: !0,
                workload: rA1
            }),
            w = Ds8({
                onFire: _,
                onFireTask: (O) => {
                    if (O.agentId) {
                        let $ = _g(O.agentId, Y.getState().tasks);
                        if ($ && !LJ6($.status)) {
                            tQ6($.id, O.prompt, z);
                            return
                        }
                        k(`[ScheduledTasks] teammate ${O.agentId} gone, removing orphaned cron ${O.id}`), yz6([O.id]);
                        return
                    }
                    _(O.prompt)
                },
                isLoading: () => K.current,
                assistantMode: q,
                getJitterConfig: Ws8,
                isKilled: () => !kR()
            });
        return w.start(), () => w.stop()
    }, [q])
}

// READABLE (for understanding):
function useCronScheduler({ isLoading, assistantMode = false }) {
    // Keep isLoading ref current
    const isLoadingRef = useRef(isLoading);
    isLoadingRef.current = isLoading;

    const store = useStore();
    const dispatch = useDispatch();

    useEffect(() => {
        // Skip if cron feature disabled
        if (!isKairosCronEnabled()) return;

        // Fire callback: inject prompt into message queue
        const firePrompt = (prompt) => enqueueMessage({
            value: prompt,
            mode: "prompt",
            priority: "later",
            isMeta: true,
            workload: WORKLOAD_TYPE_CRON
        });

        // Create scheduler
        const scheduler = createCronScheduler({
            onFire: firePrompt,

            // Handle teammate tasks specially
            onFireTask: (task) => {
                if (task.agentId) {
                    // Find the teammate task
                    const teammateTask = findTaskById(task.agentId, store.getState().tasks);
                    if (teammateTask && !isTaskTerminal(teammateTask.status)) {
                        // Route to teammate's task queue
                        dispatchTaskPrompt(teammateTask.id, task.prompt, dispatch);
                        return;
                    }
                    // Teammate gone, cleanup
                    log(`[ScheduledTasks] teammate ${task.agentId} gone, removing orphaned cron ${task.id}`);
                    deleteCronTasks([task.id]);
                    return;
                }
                // Regular task: just fire the prompt
                firePrompt(task.prompt);
            },

            isLoading: () => isLoadingRef.current,
            assistantMode,
            getJitterConfig: getCronJitterConfig,
            isKilled: () => !isKairosCronEnabled()
        });

        // Start scheduler, return cleanup
        scheduler.start();
        return () => scheduler.stop();
    }, [assistantMode]);
}

// Mapping: vb1→React, kR→isKairosCronEnabled, Ds8→createCronScheduler,
//          w0→enqueueMessage, rA1→WORKLOAD_TYPE_CRON, Ws8→getCronJitterConfig
//          S5→useStore, xA→useDispatch, _g→findTaskById, LJ6→isTaskTerminal
//          tQ6→dispatchTaskPrompt, yz6→deleteCronTasks
```

### Hook Integration Points

| Integration | Description |
|------------|-------------|
| `useRef(isLoading)` | Track loading state without re-renders |
| `useStore()` | Access Redux store for task lookup |
| `useDispatch()` | Dispatch actions to teammate queues |
| `useEffect(..., [assistantMode])` | Re-initialize on mode change |

### Hook State Management

The hook maintains several pieces of state through closure and refs:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    useCronScheduler STATE DIAGRAM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  isLoadingRef (useRef)                                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  .current → boolean                                                   │   │
│  │  • Updated on every render                                           │   │
│  │  • Used by scheduler to skip firing when busy                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  store (useStore)                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  .getState().tasks → Task[]                                          │   │
│  │  • Used to find teammate tasks by agentId                            │   │
│  │  • Checked for terminal status before routing prompts                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  dispatch (useDispatch)                                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  • dispatchTaskPrompt(taskId, prompt, dispatch)                      │   │
│  │  • Routes cron prompt to teammate's message queue                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  scheduler (createCronScheduler)                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Internal State:                                                      │   │
│  │  • durableTasks[] - Cached durable tasks from file                   │   │
│  │  • nextFireTimes (Map) - jobId → nextFireTime with jitter            │   │
│  │  • firingJobs (Set) - Jobs currently firing                          │   │
│  │  • seenJobs (Set) - Jobs processed at least once                     │   │
│  │  • intervalHandle - setInterval for 1s scheduler loop                │   │
│  │  • fileWatcher - FSWatcher for scheduled_tasks.json                  │   │
│  │  • hasLock - Whether this session holds the scheduler lock           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Scheduler Lifecycle in React

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REACT LIFECYCLE INTEGRATION                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Component Mount                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  1. isKairosCronEnabled() check                                       │  │
│  │     └─→ If false: early return, no scheduler                          │  │
│  │  2. createCronScheduler(options)                                      │  │
│  │     └─→ Returns { start, stop, getNextFireTime }                      │  │
│  │  3. scheduler.start()                                                  │  │
│  │     └─→ Starts 1s interval loop                                       │  │
│  │     └─→ Acquires lock (durable tasks only)                            │  │
│  │     └─→ Starts file watcher (durable tasks only)                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Component Unmount (cleanup)                                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  1. scheduler.stop()                                                   │  │
│  │     └─→ Sets isRunning = false                                         │  │
│  │     └─→ clearInterval(intervalHandle)                                  │  │
│  │     └─→ fileWatcher?.close()                                           │  │
│  │     └─→ releaseSchedulerLock() if held                                 │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  assistantMode Change (dependency)                                           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  • Triggers useEffect re-run                                           │  │
│  │  • Old scheduler stopped, new one created                             │  │
│  │  • Affects lock acquisition behavior                                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Message Injection Flow

When a cron job fires, the hook injects a message into the agent's queue:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MESSAGE INJECTION FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Scheduler detects fire time                                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  now >= nextFireTime (with jitter)                                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  onFireTask(job) called                                                │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  if (job.agentId) {                                              │  │  │
│  │  │    // Teammate-owned job                                         │  │  │
│  │  │    task = findTaskById(job.agentId, store.tasks)                 │  │  │
│  │  │    if (task && !isTaskTerminal(task.status)) {                   │  │  │
│  │  │      dispatchTaskPrompt(task.id, job.prompt, dispatch)           │  │  │
│  │  │    } else {                                                       │  │  │
│  │  │      deleteCronTasks([job.id])  // Orphaned                       │  │  │
│  │  │    }                                                              │  │  │
│  │  │  } else {                                                         │  │  │
│  │  │    // Main agent job                                              │  │  │
│  │  │    onFire(job.prompt)                                             │  │  │
│  │  │  }                                                                │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  enqueueMessage({                                                      │  │
│  │    value: prompt,                                                      │  │
│  │    mode: "prompt",                                                     │  │
│  │    priority: "later",    ← Wait until REPL idle                       │  │
│  │    isMeta: true,         ← Hidden from UI transcript                  │  │
│  │    workload: "cron"      ← Telemetry classification                   │  │
│  │  })                                                                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Agent Loop processes message when idle                               │  │
│  │  • Prompt executed as if user typed it                                │  │
│  │  • No visible UI trace (isMeta: true)                                 │  │
│  │  • Telemetry event: tengu_scheduled_task_fire                         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Symbol Mappings for Hook

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `yvz` | useCronScheduler | chunks.195.mjs:1948-1986 | React hook function name |
| `vb1` | React | chunks.195.mjs:1988 | React library reference |
| `S5` | useStore | chunks.195.mjs:1954 | Redux store hook |
| `xA` | useDispatch | chunks.195.mjs:1955 | Redux dispatch hook |
| `w0` | enqueueMessage | chunks.90.mjs:2823-2827 | Message queue dispatch |
| `_g` | findTaskById | chunks.113.mjs:1370-1377 | Task lookup by ID |
| `LJ6` | isTaskTerminal | chunks.41.mjs:2402-2404 | Check if task is done |
| `tQ6` | dispatchTaskPrompt | chunks.113.mjs:1357-1367 | Route prompt to task |
| `kR` | isKairosCronEnabled | chunks.91.mjs:186-188 | Feature flag check |
| `Ds8` | createCronScheduler | chunks.186.mjs:110-248 | Scheduler factory |
| `Ws8` | getCronJitterConfig | chunks.186.mjs:288-292 | Jitter configuration |
| `rA1` | WORKLOAD_TYPE_CRON | chunks.18.mjs:1894 | "cron" workload type |

### Teammate Task Routing Functions

#### isTaskTerminal (LJ6)

**Location:** chunks.41.mjs:2402-2404

```javascript
// ============================================
// isTaskTerminal - Check if task is in terminal state
// Location: chunks.41.mjs:2402-2404
// ============================================

// ORIGINAL (for source lookup):
function LJ6(A) {
    return A === "completed" || A === "failed" || A === "killed"
}

// READABLE (for understanding):
function isTaskTerminal(status) {
    return status === "completed" || status === "failed" || status === "killed";
}

// Mapping: LJ6→isTaskTerminal, A→status
```

**Why this matters:** Tasks in terminal states cannot receive new messages. The scheduler uses this to detect orphaned crons when the teammate has finished.

#### findTaskById (_g)

**Location:** chunks.113.mjs:1370-1377

```javascript
// ============================================
// findTaskById - Find teammate task by agent ID
// Location: chunks.113.mjs:1370-1377
// ============================================

// ORIGINAL (for source lookup):
function _g(A, q) {
    let K;
    for (let Y of Object.values(q))
        if (M$(Y) && Y.identity.agentId === A) {
            if (Y.status === "running") return Y;
            if (!K) K = Y
        } return K
}

// READABLE (for understanding):
function findTaskById(agentId, tasks) {
    let firstMatch;
    for (let task of Object.values(tasks)) {
        // M$ = isTeammateTask helper
        if (isTeammateTask(task) && task.identity.agentId === agentId) {
            // Prefer running tasks over other active states
            if (task.status === "running") return task;
            if (!firstMatch) firstMatch = task;
        }
    }
    return firstMatch;
}

// Mapping: _g→findTaskById, A→agentId, q→tasks, M$→isTeammateTask
```

**Key insight:** The function prefers "running" tasks over other states (like "pending"). This ensures prompts go to the actively processing teammate.

#### dispatchTaskPrompt (tQ6)

**Location:** chunks.113.mjs:1357-1367

```javascript
// ============================================
// dispatchTaskPrompt - Route prompt to teammate's message queue
// Location: chunks.113.mjs:1357-1367
// ============================================

// ORIGINAL (for source lookup):
function tQ6(A, q, K) {
    i9(A, K, (Y) => {
        if (LJ6(Y.status)) return k(`Dropping message for teammate task ${A}: task status is "${Y.status}"`), Y;
        return {
            ...Y,
            pendingUserMessages: [...Y.pendingUserMessages, q],
            messages: [...Y.messages ?? [], p1({
                content: q
            })]
        }
    })
}

// READABLE (for understanding):
function dispatchTaskPrompt(taskId, prompt, dispatch) {
    updateTask(taskId, dispatch, (task) => {
        // Safety check: don't add messages to terminal tasks
        if (isTaskTerminal(task.status)) {
            log(`Dropping message for teammate task ${taskId}: task status is "${task.status}"`);
            return task; // Return unchanged
        }
        // Add prompt to both pending queue and message history
        return {
            ...task,
            pendingUserMessages: [...task.pendingUserMessages, prompt],
            messages: [...task.messages ?? [], createUserMessage({
                content: prompt
            })]
        };
    });
}

// Mapping: tQ6→dispatchTaskPrompt, A→taskId, q→prompt, K→dispatch
// Mapping: i9→updateTask, LJ6→isTaskTerminal, k→log, p1→createUserMessage
```

**Why dual storage:** The prompt is added to both `pendingUserMessages` (for processing) and `messages` (for transcript/history).

---

## 8. Error State Handling

### Error Types and UI Display

The cron tools handle several error scenarios with specific error codes:

#### CronCreate Errors

| ErrorCode | Condition | Error Message | UI Display |
|-----------|-----------|---------------|------------|
| 1 | Invalid cron syntax | `Invalid cron expression '${cron}'. Expected 5 fields: M H DoM Mon DoW.` | Error display with syntax hint |
| 2 | No future matches | `Cron expression '${cron}' does not match any calendar date in the next year.` | Error display with date hint |
| 3 | Max jobs exceeded | `Too many scheduled jobs (max 50). Cancel one first.` | Error display with limit hint |
| 4 | Durable + teammate | `durable crons are not supported for teammates...` | Error display with context |

#### CronDelete Errors

| ErrorCode | Condition | Error Message | UI Display |
|-----------|-----------|---------------|------------|
| 1 | Job not found | `No scheduled job with id '${id}'` | Error display |
| 2 | Wrong owner | `Cannot delete cron job '${id}': owned by another agent` | Error display (team mode) |

### Error Display Implementation

**Location:** chunks.145.mjs:897-904

```javascript
// ============================================
// renderToolUseErrorMessage - Error display component
// Location: chunks.145.mjs:897-904
// ============================================

// ORIGINAL (for source lookup):
function mT6(A, { verbose: q }) {
    return BZ.default.createElement(eK, {
        result: A,
        verbose: q
    })
}

// READABLE (for understanding):
function renderToolUseErrorMessage(error, { verbose }) {
    // eK is a standard ErrorDisplay component that:
    // 1. Shows error message in red
    // 2. Includes errorCode if present
    // 3. Shows stack trace in verbose mode
    return <ErrorDisplay result={error} verbose={verbose} />;
}

// Mapping: mT6→renderToolUseErrorMessage, eK→ErrorDisplay
```

### Error State Mockups

#### CronCreate Validation Error

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Tool: CronCreate                                               │
│  Input: */5 * * *: /check-status                                │
│                                                                 │
│  Error: Invalid cron expression '*/5 * * *'. Expected 5        │
│         fields: M H DoM Mon DoW.                                │
│                                                                 │
│         (shown in red/dimmed text)                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### CronDelete Not Found Error

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Tool: CronDelete                                               │
│  Input: nonexistent                                             │
│                                                                 │
│  Error: No scheduled job with id 'nonexistent'                  │
│                                                                 │
│         (shown in red/dimmed text)                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Complete Interaction Sequences

### Sequence 1: Creating a Recurring Job via /loop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ USER INPUT                                                                   │
│ > /loop 5m check the deployment status                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ SKILL PARSING                                                                │
│                                                                              │
│ registerLoopSkill (gJz) detects /loop command                                │
│ buildLoopPrompt (BJz) parses:                                                │
│   - Interval: 5m → "*/5 * * * *"                                             │
│   - Prompt: "check the deployment status"                                    │
│                                                                              │
│ Returns prompt instructing LLM to call CronCreate                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ TOOL INVOCATION                                                              │
│                                                                              │
│ CronCreate {                                                                 │
│   cron: "*/5 * * * *",                                                       │
│   prompt: "check the deployment status",                                     │
│   recurring: true                                                            │
│ }                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ VALIDATION                                                                   │
│                                                                              │
│ ✓ parseCronExpression("*/5 * * * *") → valid                                │
│ ✓ getNextCronMatch(...) → returns timestamp (not null)                      │
│ ✓ getAllCronTasks().length < 50 → true (under limit)                        │
│ ✓ No teammate context → durable allowed                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK CREATION                                                                │
│                                                                              │
│ createCronTask("*/5 * * * *", "check the deployment status", true, false)   │
│                                                                              │
│ Creates task: {                                                              │
│   id: "a3f2c1b9",                                                            │
│   cron: "*/5 * * * *",                                                       │
│   prompt: "check the deployment status",                                     │
│   createdAt: 1711190400000,                                                  │
│   recurring: true                                                            │
│ }                                                                            │
│                                                                              │
│ Stored in sessionCronTasks[] (memory, not durable)                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ RESULT                                                                       │
│                                                                              │
│ UI Display: "Scheduled a3f2c1b9 (Every 5 minutes)"                          │
│                                                                              │
│ LLM Result: "Scheduled recurring job a3f2c1b9 (Every 5 minutes).            │
│              Session-only (not written to disk, dies when Claude exits).     │
│              Auto-expires after 3 days. Use CronDelete to cancel sooner."    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCHEDULER INTEGRATION                                                        │
│                                                                              │
│ createCronScheduler (Ds8) calculates next fire time:                        │
│   - Base time: next :00, :05, :10, :15, etc.                                 │
│   - Jitter: hash("a3f2c1b9") * 0.1 * 5min ≈ 0-30 seconds                    │
│   - Scheduled: next_fire_time stored in Map                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Sequence 2: Cron Job Firing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCHEDULER TICK (every 1 second)                                              │
│                                                                              │
│ createCronScheduler.checkAndFire()                                           │
│   - Check isLoading() → false (agent idle)                                   │
│   - Check isKilled() → false (feature enabled)                               │
│   - Compare Date.now() >= scheduled_time                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ FIRE TRIGGERED                                                               │
│                                                                              │
│ onFire("check the deployment status")                                        │
│                                                                              │
│ Emits telemetry:                                                             │
│   d("tengu_scheduled_task_fire", {                                          │
│       recurring: true,                                                       │
│       taskId: "a3f2c1b9"                                                     │
│   })                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ MESSAGE INJECTION                                                            │
│                                                                              │
│ enqueueMessage({                                                             │
│     mode: "prompt",                                                          │
│     value: "check the deployment status",                                    │
│     uuid: "new-uuid-here",                                                   │
│     priority: "later",         // Wait until idle                            │
│     isMeta: true,             // Hidden from UI transcript                   │
│     workload: "cron"          // Workload classification                     │
│ })                                                                           │
│                                                                              │
│ triggerProcessing() // Wake up agent loop                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ RESCHEDULE                                                                   │
│                                                                              │
│ For recurring tasks:                                                         │
│   - Calculate next fire time                                                 │
│   - Apply jitter again                                                       │
│   - Update Map entry                                                         │
│                                                                              │
│ Check expiry:                                                                │
│   - If createdAt + 3 days < now → delete after this fire                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Terminal UI Color and Styling

### Ink Component Styling

The UI uses Ink (React for CLI) components with specific styling:

```javascript
// Text styling constants
<Text bold>              // Bold text (job IDs, success indicators)
<Text dimColor>          // Dimmed text (human schedules, hints)
<Text color="red">       // Error messages (via ErrorDisplay)
<Text>                   // Default text
```

### Color-coded Display

| Element | Style | Example |
|---------|-------|---------|
| Job ID | Bold | **a3f2c1b9** |
| Human Schedule | Dimmed | (Every 5 minutes) |
| Success prefix | Bold | Scheduled |
| Cancel prefix | Bold | Cancelled |
| Error message | Red/DImmed | Invalid cron expression... |
| Empty state | Dimmed | No scheduled jobs |

### Terminal Output Examples

#### Successful CronCreate (ANSI)

```
\033[1mScheduled\033[0m \033[1ma3f2c1b9\033[0m \033[2m(Every 5 minutes)\033[0m
     ↑ bold              ↑ bold (ID)            ↑ dimmed
```

#### Error Display (ANSI)

```
\033[31mError:\033[0m Invalid cron expression '*/5 * * *'.
        ↑ red
Expected 5 fields: M H DoM Mon DoW.
```

---

## 11. Telemetry Events

### Event Types

| Event Name | When Fired | Properties |
|------------|------------|------------|
| `tengu_scheduled_task_fire` | Job fires | `{ recurring, taskId }` |
| `tengu_scheduled_task_missed` | Missed one-shot detected | `{ count, taskIds }` |
| `tengu_scheduled_task_expired` | Recurring task expires after 3 days | `{ taskId, ageHours }` |

### Telemetry Code Locations

**Location:** chunks.186.mjs:133-138, 154-157, 161-165

```javascript
// ============================================
// Telemetry Events - Scheduled task lifecycle
// Location: chunks.186.mjs
// ============================================

// Task fires (line 154-157)
d("tengu_scheduled_task_fire", {
    recurring: task.recurring ?? false,
    taskId: task.id
});

// Missed one-shot tasks detected (line 133-138)
d("tengu_scheduled_task_missed", {
    count: missedTasks.length,
    taskIds: missedTasks.map(t => t.id).join(",")
});

// Task expires after 3 days (line 161-165)
d("tengu_scheduled_task_expired", {
    taskId: task.id,
    ageHours: Math.floor((now - task.createdAt) / 1000 / 60 / 60)
});

// Mapping: d→emitTelemetry
```

---

## 12. Text Truncation Utility (R3)

### truncate Function

**What it does:** Truncates text to a specified length with optional newline truncation and ellipsis. Used throughout cron UI rendering to keep output concise.

**Location:** chunks.41.mjs:1965-1977

```javascript
// ============================================
// truncate - Truncate text with ellipsis
// Location: chunks.41.mjs:1965-1977
// ============================================

// ORIGINAL (for source lookup):
function R3(A, q, K = !1) {
    let Y = A;
    if (K) {
        let z = A.indexOf(`
`);
        if (z !== -1) {
            if (Y = A.substring(0, z), f8(Y) + 1 > q) return jq(Y, q);
            return `${Y}…`
        }
    }
    if (f8(Y) <= q) return Y;
    return jq(Y, q)
}

// READABLE (for understanding):
function truncate(text, maxLength, truncateAtNewline = false) {
    let result = text;

    if (truncateAtNewline) {
        // Check for newline and truncate there first
        let newlineIndex = text.indexOf('\n');
        if (newlineIndex !== -1) {
            result = text.substring(0, newlineIndex);
            // Check if length after truncating at newline still exceeds maxLength
            if (stringWidth(result) + 1 > maxLength) {
                return truncateToWidth(result, maxLength);
            }
            return `${result}…`;
        }
    }

    // No newline or not truncating at newline - check width
    if (stringWidth(result) <= maxLength) {
        return result;
    }
    return truncateToWidth(result, maxLength);
}

// Mapping: R3→truncate, A→text, q→maxLength, K→truncateAtNewline
//          f8→stringWidth (Unicode-aware width calculation), jq→truncateToWidth
```

### Key Parameters

| Parameter | Obfuscated | Description |
|-----------|------------|-------------|
| `text` | `A` | Input text to truncate |
| `maxLength` | `q` | Maximum visible width (not byte length) |
| `truncateAtNewline` | `K` | If true, truncate at first newline if found |

### Unicode Width Handling

The function uses `f8` (stringWidth) which properly handles:
- **East Asian Wide characters** (CJK) count as 2 columns
- **Emoji** count as 2 columns
- **Control characters** count as 0 columns
- **ANSI escape codes** are stripped before counting

### Usage in Cron Tools

| Tool | Max Length | Truncate at Newline | Example |
|------|------------|---------------------|---------|
| CronCreate use message | 60 chars | true | `*/5 * * * *: check the deplo…` |
| CronList result | 80 chars | true | `a3f2c1b9 — Every 5 minutes: check the deployment…` |

### Truncation Decision Logic

```
┌─────────────────────────────────────────────────────────────────┐
│                     TRUNCATION FLOW                              │
│                                                                  │
│  Input: "check the deployment status\nmore text", maxLength: 20 │
│                                                                  │
│  1. truncateAtNewline = true                                    │
│  2. Find newline at position 26                                  │
│  3. Truncate to "check the deployment status"                   │
│  4. Check width: 26 > 20 → needs further truncation             │
│  5. truncateToWidth: "check the deplo…" (17 chars + …)          │
│                                                                  │
│  Result: "check the deplo…"                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Ink Component Hierarchy

### React Component Tree

The cron tools use Ink (React for CLI) for rendering:

```
<App>
  └── <ToolUseMessage tool={CronCreateTool}>
        └── renderToolUseMessage (z7q)
              └── <Text>*/5 * * * *: check the deployment...</Text>

  └── <ToolResultMessage result={result}>
        └── renderToolResultMessage (_7q)
              └── <ScheduledIndicator>
                    ├── <Text>Scheduled </Text>
                    ├── <Text bold>{id}</Text>
                    └── <Text dimColor>({humanSchedule})</Text>
```

### Component Details

#### ScheduledIndicator Component

**Obfuscated Name:** Rendered by `_7q`
**Location:** chunks.145.mjs:854-860

```javascript
// ============================================
// ScheduledIndicator - Success display for CronCreate
// Location: chunks.145.mjs:854-860
// ============================================

// ORIGINAL (for source lookup):
function _7q(A) {
    return BZ.default.createElement(t1, null,
        BZ.default.createElement(T, null, "Scheduled ",
            BZ.default.createElement(T, { bold: !0 }, A.id), " ",
            BZ.default.createElement(T, { dimColor: !0 }, "(", A.humanSchedule, ")")
        )
    )
}

// READABLE (for understanding):
function renderCronCreateResultMessage(result) {
    return React.createElement(Box, null,
        React.createElement(Text, null, "Scheduled ",
            React.createElement(Text, { bold: true }, result.id), " ",
            React.createElement(Text, { dimColor: true }, "(", result.humanSchedule, ")")
        )
    );
}

// Mapping: _7q→renderCronCreateResultMessage, BZ→React, t1→Box, T→Text
```

#### CancelledIndicator Component

**Obfuscated Name:** Rendered by `O7q`
**Location:** chunks.145.mjs:866-870

```javascript
// ============================================
// CancelledIndicator - Success display for CronDelete
// Location: chunks.145.mjs:866-870
// ============================================

// ORIGINAL (for source lookup):
function O7q(A) {
    return BZ.default.createElement(t1, null,
        BZ.default.createElement(T, null, "Cancelled ",
            BZ.default.createElement(T, { bold: !0 }, A.id)
        )
    )
}

// READABLE (for understanding):
function renderCronDeleteResultMessage(result) {
    return React.createElement(Box, null,
        React.createElement(Text, null, "Cancelled ",
            React.createElement(Text, { bold: true }, result.id)
        )
    );
}

// Mapping: O7q→renderCronDeleteResultMessage
```

#### CronJobsList Component

**Obfuscated Name:** Rendered by `H7q`
**Location:** chunks.145.mjs:876-887

```javascript
// ============================================
// CronJobsList - Display list of scheduled jobs
// Location: chunks.145.mjs:876-887
// ============================================

// ORIGINAL (for source lookup):
function H7q(A) {
    return BZ.default.createElement(t1, null,
        A.jobs.map((K) =>
            BZ.default.createElement(T, { key: K.id },
                K.id, " — ", K.humanSchedule,
                K.recurring ? " (recurring)" : " (one-shot)",
                K.durable === !1 ? " [session-only]" : "",
                ": ", R3(K.prompt, 80, !0)
            )
        )
    )
}

// READABLE (for understanding):
function renderCronListResultMessage(result) {
    return React.createElement(Box, { flexDirection: "column" },
        result.jobs.map(job =>
            React.createElement(Text, { key: job.id },
                job.id, " — ", job.humanSchedule,
                job.recurring ? " (recurring)" : " (one-shot)",
                job.durable === false ? " [session-only]" : "",
                ": ", truncate(job.prompt, 80, true)
            )
        )
    );
}

// Mapping: H7q→renderCronListResultMessage
```

### Ink Component Reference

| Component | Obfuscated | Purpose |
|-----------|------------|---------|
| `<Box>` | `t1` | Container with flexbox layout |
| `<Text>` | `T` | Text with styling props |
| `bold` prop | `bold: !0` | Bold text styling |
| `dimColor` prop | `dimColor: !0` | Dimmed text styling |
| `color` prop | `color: "red"` | Colored text (errors) |

---

## 14. Progress and Rejection Messages

### Progress Message (xT6)

**What it does:** Renders during tool execution (null for cron tools - no progress shown).

**Location:** chunks.145.mjs:889-891

```javascript
// ORIGINAL (for source lookup):
function xT6() {
    return null
}

// READABLE (for understanding):
function renderToolUseProgressMessage() {
    return null;  // Cron tools don't show progress
}
```

### Rejection Message (uT6)

**What it does:** Renders when validation fails.

**Location:** chunks.145.mjs:893-895

```javascript
// ORIGINAL (for source lookup):
function uT6(A) {
    return BZ.default.createElement(eK, { error: A.message })
}

// READABLE (for understanding):
function renderToolUseRejectedMessage(validationResult) {
    return React.createElement(ErrorDisplay, { error: validationResult.message });
}

// Mapping: uT6→renderToolUseRejectedMessage, eK→ErrorDisplay
```

### Error Message (mT6)

**What it does:** Renders when an unexpected error occurs.

**Location:** chunks.145.mjs:897-904

```javascript
// ORIGINAL (for source lookup):
function mT6(A) {
    return BZ.default.createElement(t1, null,
        BZ.default.createElement(T, { dimColor: !0 }, "Error: ", A.message)
    )
}

// READABLE (for understanding):
function renderToolUseErrorMessage(error) {
    return React.createElement(Box, null,
        React.createElement(Text, { dimColor: true }, "Error: ", error.message)
    );
}

// Mapping: mT6→renderToolUseErrorMessage
```

---

## 15. T3 Spinner Component Deep Dive

### What T3 Does

**Location:** chunks.89.mjs:2585-2593

The `T3` function is a React component that renders a minimal "spinner" or empty state indicator. It's used when a tool invocation is rejected or needs to indicate an empty/loading state.

```javascript
// ============================================
// T3 - Spinner/Empty state component
// Location: chunks.89.mjs:2585-2593
// ============================================

// ORIGINAL (for source lookup):
function T3() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel"))
        q = _p6.createElement(t1, {
            height: 1
        }, _p6.createElement(CB, null)),
        A[0] = q;
    else q = A[0];
    return q
}

// READABLE (for understanding):
function SpinnerComponent() {
    // React memo cache for performance
    const cache = useMemo(1);
    let element;

    if (cache[0] === Symbol.for("react.memo_cache_sentinel")) {
        // Create new element: Box with height 1 containing spinner
        element = React.createElement(Box, { height: 1 },
            React.createElement(Spinner, null)  // CB is the actual spinner
        );
        cache[0] = element;
    } else {
        element = cache[0];
    }

    return element;
}

// Mapping: T3→SpinnerComponent, A6→useMemo, t1→Box, CB→Spinner
```

### Why T3 Uses Memoization

The component uses React's memo cache pattern for performance:
1. **Single instance creation** - The spinner element is created once and reused
2. **Symbol-based cache sentinel** - Uses `Symbol.for("react.memo_cache_sentinel")` to detect uninitialized cache
3. **Minimal re-renders** - Returns cached element on subsequent renders

### When T3 is Used in Cron Tools

| Function | Obfuscated | Use Case |
|----------|------------|----------|
| renderToolUseRejectedMessage | `uT6` | Shows spinner when validation fails |
| (general) | - | Loading states in other tools |

---

## 16. Complete User Interaction Flows

### Flow 1: User Creates Job via /loop Command

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ USER TYPES: /loop 5m check the deploy status                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ SKILL REGISTRATION CHECK                                                     │
│                                                                              │
│   registerLoopSkill (gJz) registered at startup:                            │
│   • name: "loop"                                                             │
│   • isEnabled: isKairosCronEnabled() → true                                 │
│   • argumentHint: "[interval] <prompt>"                                      │
│                                                                              │
│   Skill found in lPq (registeredSkills array)                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ PROMPT GENERATION (getPromptForCommand)                                      │
│                                                                              │
│   buildLoopPrompt("5m check the deploy status")                             │
│                                                                              │
│   Parsing rules applied:                                                     │
│   1. Leading token "5m" matches ^\d+[smhd]$ → interval                      │
│   2. Remaining "check the deploy status" → prompt                           │
│                                                                              │
│   Returns prompt text instructing LLM to call CronCreate                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ LLM RECEIVES INSTRUCTION                                                     │
│                                                                              │
│   "Call CronCreate with:                                                     │
│    • cron: '*/5 * * * *'                                                     │
│    • prompt: 'check the deploy status'                                       │
│    • recurring: true"                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ TOOL EXECUTION                                                               │
│                                                                              │
│   CronCreate.validateInput({cron: "*/5 * * * *", ...})                      │
│   ├─ parseCronExpression("*/5 * * * *") → valid                             │
│   ├─ getNextCronMatch(...) → returns future timestamp                       │
│   └─ getAllCronTasks().length < 50 → OK                                     │
│                                                                              │
│   CronCreate.call({cron: "*/5 * * * *", prompt: "...", recurring: true})    │
│   ├─ createCronTask(...) → returns "abc12345"                               │
│   └─ setScheduledTasksEnabled(true)                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ UI DISPLAY                                                                   │
│                                                                              │
│   Tool Use: "*/5 * * * *: check the deploy status"                          │
│   Result: "Scheduled abc12345 (Every 5 minutes)"                            │
│                                                                              │
│   Terminal shows:                                                            │
│   ┌──────────────────────────────────────────────┐                          │
│   │ Scheduled abc12345 (Every 5 minutes)        │                          │
│   └──────────────────────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ LLM CONFIRMS TO USER                                                         │
│                                                                              │
│   "I've scheduled job abc12345 to run every 5 minutes.                      │
│    It will auto-expire after 3 days. Use /CronDelete abc12345 to cancel."   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Flow 2: Cron Job Fires

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCHEDULER LOOP (every 1000ms)                                                │
│                                                                              │
│   createCronScheduler.checkFireConditions():                                │
│   • isLoading() → false (agent idle)                                        │
│   • isKilled() → false (feature still enabled)                              │
│   • now >= scheduledTime for task abc12345 → FIRE!                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ ONFIRE CALLBACK EXECUTION                                                    │
│                                                                              │
│   onFire("check the deploy status")                                          │
│                                                                              │
│   enqueueMessage({                                                           │
│       mode: "prompt",                                                        │
│       value: "check the deploy status",                                      │
│       uuid: generateUUID(),                                                  │
│       priority: "later",        ← Wait until idle                           │
│       isMeta: true,            ← Hidden from UI transcript                  │
│       workload: "cron"         ← Classification                             │
│   })                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ AGENT LOOP PROCESSING                                                        │
│                                                                              │
│   Message enters queue with priority="later"                                 │
│   Agent finishes current turn                                                │
│   Agent checks queue → finds cron message                                   │
│   Agent processes "check the deploy status" as if user typed it             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ NEXT SCHEDULE TIME CALCULATION                                               │
│                                                                              │
│   Recurring task:                                                            │
│   calculateNextRecurringTime(cron, now, taskId, jitterConfig)               │
│   ├─ getNextCronMatch(cron, now) → base time                                │
│   ├─ hashJobId(taskId) → 0.0-1.0 hash value                                 │
│   └─ Add jitter: min(hash * 0.1 * period, 900000)                           │
│                                                                              │
│   Store new scheduledTime in Map                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Flow 3: Missed One-Shot Task Detection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CLAUDE RESTARTS                                                              │
│                                                                              │
│   Scheduler.start() called                                                   │
│   readDurableTasks() → loads .claude/scheduled_tasks.json                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ MISSED TASK DETECTION                                                        │
│                                                                              │
│   findMissedOneShots(durableTasks, now):                                    │
│   for each task:                                                             │
│       if task.recurring → skip                                              │
│       scheduledTime = getNextCronMatch(task.cron, task.createdAt)           │
│       if scheduledTime < now → MISSED!                                       │
│                                                                              │
│   Result: [task1, task2] (missed one-shots)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ NOTIFICATION TO AGENT                                                        │
│                                                                              │
│   formatMissedTasksMessage(missedTasks) → formatted message                 │
│                                                                              │
│   "The following one-shot scheduled task was missed while Claude was        │
│    not running. It has already been removed from                           │
│    .claude/scheduled_tasks.json.                                            │
│                                                                              │
│    Do NOT execute this prompt yet. First use the AskUserQuestion tool to   │
│    ask whether to run it now. Only execute if the user confirms."          │
│                                                                              │
│   onFire(formattedMessage) → injects as meta message                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ CLEANUP                                                                       │
│                                                                              │
│   deleteCronTasks(missedTaskIds) → removes from durable storage             │
│   (Tasks already "consumed" - can't fire again)                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Flow 4: Teammate-Owned Cron Task Firing

This flow documents how cron tasks owned by teammates (in team mode) are routed when they fire.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TEAM MODE CONTEXT                                                            │
│                                                                              │
│   User invoked: /loop 5m check teammate's task status                        │
│   Tool context includes: agentId = "teammate-001"                            │
│   (The teammate's ID is captured when creating the cron task)               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ CRON TASK CREATION (with agentId)                                            │
│                                                                              │
│   CronCreate.call({                                                          │
│       cron: "*/5 * * * *",                                                   │
│       prompt: "check teammate's task status",                                │
│       recurring: true                                                        │
│   })                                                                         │
│                                                                              │
│   Task stored with:                                                          │
│   {                                                                          │
│       id: "teammate-cron-001",                                               │
│       cron: "*/5 * * * *",                                                   │
│       prompt: "check teammate's task status",                                │
│       agentId: "teammate-001",  ← Owner reference                           │
│       recurring: true                                                        │
│   }                                                                          │
│                                                                              │
│   Note: Durable=false for teammate tasks (session-only)                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCHEDULER TICK - TASK FIRE TIME                                              │
│                                                                              │
│   onFireTask(task) called with:                                             │
│   {                                                                          │
│       id: "teammate-cron-001",                                               │
│       agentId: "teammate-001",                                               │
│       prompt: "check teammate's task status"                                 │
│   }                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ TEAMMATE ROUTING DECISION                                                    │
│                                                                              │
│   if (task.agentId) {                                                        │
│       // Find the teammate task                                              │
│       const teammateTask = findTaskById(task.agentId, store.getState());   │
│                                                                              │
│       if (teammateTask && !isTaskTerminal(teammateTask.status)) {           │
│           // Teammate still active → Route to teammate                       │
│           dispatchTaskPrompt(teammateTask.id, task.prompt, dispatch);       │
│           return;                                                            │
│       }                                                                      │
│                                                                              │
│       // Teammate gone → Orphaned cron cleanup                               │
│       log(`[ScheduledTasks] teammate ${task.agentId} gone,                   │
│             removing orphaned cron ${task.id}`);                             │
│       deleteCronTasks([task.id]);                                            │
│       return;                                                                │
│   }                                                                          │
│   // Fall through to normal fire                                             │
│   onFire(task.prompt);                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│ TEAMMATE ACTIVE               │   │ TEAMMATE GONE (ORPHANED)      │
│                               │   │                               │
│ dispatchTaskPrompt(           │   │ log("orphaned cron")          │
│   teammateTask.id,            │   │ deleteCronTasks([task.id])    │
│   task.prompt,                │   │                               │
│   dispatch                    │   │ No prompt fired               │
│ )                             │   │ Task removed silently         │
│                               │   │                               │
│ Prompt injected into          │   │ Telemetry: task expired       │
│ teammate's message queue      │   │ (no specific orphan event)    │
│                               │   │                               │
│ Teammate executes prompt      │   │                               │
└───────────────────────────────┘   └───────────────────────────────┘
```

#### Teammate Routing Implementation Details

**Location:** chunks.195.mjs:1970-1978

```javascript
// ============================================
// Teammate Task Routing - onFireTask callback
// Location: chunks.195.mjs:1970-1978
// ============================================

// ORIGINAL (for source lookup):
onFireTask: (O) => {
    if (O.agentId) {
        let $ = _g(O.agentId, Y.getState().tasks);
        if ($ && !LJ6($.status)) {
            tQ6($.id, O.prompt, z);
            return
        }
        k(`[ScheduledTasks] teammate ${O.agentId} gone, removing orphaned cron ${O.id}`);
        yz6([O.id]);
        return
    }
    _(O.prompt)
}

// READABLE (for understanding):
onFireTask: (task) => {
    // Check if this task belongs to a teammate
    if (task.agentId) {
        // Look up the teammate task in the store
        const teammateTask = findTaskById(task.agentId, store.getState().tasks);

        // Check if teammate is still active
        if (teammateTask && !isTaskTerminal(teammateTask.status)) {
            // Teammate alive: route prompt to their queue
            dispatchTaskPrompt(teammateTask.id, task.prompt, dispatch);
            return;
        }

        // Teammate gone: cleanup orphaned cron
        log(`[ScheduledTasks] teammate ${task.agentId} gone, removing orphaned cron ${task.id}`);
        deleteCronTasks([task.id]);
        return;
    }

    // No teammate owner: fire to main agent
    firePrompt(task.prompt);
}

// Mapping: O→task, _g→findTaskById, Y→store, LJ6→isTaskTerminal,
//          tQ6→dispatchTaskPrompt, z→dispatch, k→log, yz6→deleteCronTasks
```

#### Key Functions for Teammate Routing

| Function | Obfuscated | Purpose | Location |
|----------|------------|---------|----------|
| `findTaskById` | `_g` | Find task by agentId in store | chunks.195.mjs |
| `isTaskTerminal` | `LJ6` | Check if task status is terminal (done/failed) | chunks.84.mjs |
| `dispatchTaskPrompt` | `tQ6` | Dispatch prompt to teammate's task queue | chunks.195.mjs |
| `deleteCronTasks` | `yz6` | Remove cron tasks from storage | chunks.145.mjs |
| `getTeammateContext` | `iM` | Get current teammate context for permission checks | chunks.84.mjs |

#### Terminal Task Statuses

A teammate task is considered "terminal" (gone) if its status is:

```javascript
// Terminal statuses mean the teammate has finished
const TERMINAL_STATUSES = [
    "completed",    // Successfully finished
    "failed",       // Errored out
    "cancelled",    // User cancelled
    "timeout"       // Timed out
];

function isTaskTerminal(status) {
    return TERMINAL_STATUSES.includes(status);
}
```

#### Permission Model for Cron Operations

**Location:** chunks.145.mjs:1107-1123

When a teammate tries to delete a cron job:

```javascript
// ============================================
// CronDelete Permission Check (Team Mode)
// Location: chunks.145.mjs:1107-1123
// ============================================

// ORIGINAL (for source lookup):
let Y = iM();
if (Y && K.agentId !== Y.agentId) return {
    result: !1,
    message: `Cannot delete cron job '${A.id}': owned by another agent`,
    errorCode: 2
};

// READABLE (for understanding):
const teammateContext = getTeammateContext();

// If we're in a teammate context, check ownership
if (teammateContext && job.agentId !== teammateContext.agentId) {
    return {
        result: false,
        message: `Cannot delete cron job '${input.id}': owned by another agent`,
        errorCode: 2  // Permission denied error code
    };
}

// Mapping: Y→teammateContext, iM→getTeammateContext, K→job, A→input
```

#### UI Display for Teammate Tasks

When listing cron jobs in team mode:

```
┌─────────────────────────────────────────────────────────────────┐
│ CronList (as teammate)                                          │
│                                                                 │
│ abc12345 — Every 5 minutes (recurring) [session-only]          │
│           : check the deployment status                         │
│                                                                 │
│ (Only shows tasks owned by current teammate)                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ CronList (as team lead)                                         │
│                                                                 │
│ abc12345 — Every 5 minutes (recurring) [session-only]          │
│           [owner: teammate-001]                                 │
│           : check the deployment status                         │
│                                                                 │
│ def67890 — Every 10 minutes (recurring)                        │
│           : monitor background tasks                            │
│                                                                 │
│ (Team lead sees all tasks, including ownership)                │
└─────────────────────────────────────────────────────────────────┘
```

#### Orphaned Cron Cleanup Scenarios

| Scenario | Detection | Action |
|----------|-----------|--------|
| Teammate completed task | `isTaskTerminal(status) === true` | Delete cron, log message |
| Teammate crashed | Task removed from store | `findTaskById` returns null |
| Teammate cancelled | Status = "cancelled" | `isTaskTerminal` returns true |
| Team lead cancelled teammate | Task removed from store | `findTaskById` returns null |
| Session ended (teammate) | Session state cleared | Task not found in store |

---

## 17. Terminal ANSI Styling Details

### Ink Component Styling Props

| Prop | Values | Effect |
|------|--------|--------|
| `bold` | `true` / `false` | ANSI bold (1) |
| `dimColor` | `true` / `false` | ANSI dim (2) |
| `color` | "red", "green", "yellow", "blue", "magenta", "cyan", "white" | ANSI foreground color (30-37) |
| `bgColor` | Same as color | ANSI background color (40-47) |
| `inverse` | `true` / `false` | Swap foreground/background (7) |
| `underline` | `true` / `false` | ANSI underline (4) |
| `strikethrough` | `true` / `false` | ANSI strikethrough (9) |

### Cron UI Styling Examples

```javascript
// Job ID - bold for emphasis
<Text bold>{job.id}</Text>
// ANSI: \x1b[1mabc12345\x1b[0m

// Human schedule - dimmed for secondary info
<Text dimColor>({job.humanSchedule})</Text>
// ANSI: \x1b[2m(Every 5 minutes)\x1b[0m

// Error message - red for visibility
<Text color="red">Error: {error.message}</Text>
// ANSI: \x1b[31mError: Invalid cron expression\x1b[0m

// Empty state - dimmed
<Text dimColor>No scheduled jobs</Text>
// ANSI: \x1b[2mNo scheduled jobs\x1b[0m
```

### Box Layout Props

| Prop | Values | Effect |
|------|--------|--------|
| `height` | number | Fixed height in lines |
| `width` | number | Fixed width in columns |
| `flexDirection` | "row" / "column" | Flex layout direction |
| `justifyContent` | "flex-start" / "center" / "flex-end" | Main axis alignment |
| `alignItems` | "flex-start" / "center" / "flex-end" | Cross axis alignment |
| `padding` | number | Padding on all sides |
| `margin` | number | Margin on all sides |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Loop/Cron System section

### UI Rendering Functions (Section 1-4)
- `z7q` - renderCronCreateUseMessage
- `_7q` - renderCronCreateResultMessage
- `w7q` - renderCronDeleteUseMessage
- `O7q` - renderCronDeleteResultMessage
- `$7q` - renderCronListUseMessage
- `H7q` - renderCronListResultMessage
- `xT6` - renderToolUseProgressMessage
- `uT6` - renderToolUseRejectedMessage
- `mT6` - renderToolUseErrorMessage
- `CT6` - formatCronHumanReadable
- `R3` - truncate function
- `T3` - SpinnerComponent (chunks.89.mjs:2585)
- `CB` - Spinner (inner spinner component)
- `eK` - ErrorDisplay component

### /loop Command Interaction (Section 5)
- `gJz` (registerLoopSkill) - Loop skill registration
- `BJz` (buildLoopPrompt) - Loop prompt builder
- `kR` (isKairosCronEnabled) - Feature flag check
- `no6` (DEFAULT_LOOP_INTERVAL) - "10m" default
- `mJz` (LOOP_USAGE_MESSAGE) - Usage help text

### React Hook Integration (Section 7)
- `Ds8` (createCronScheduler) - Scheduler factory
- `w0` (enqueueMessage) - Message queue injection
- `rA1` (WORKLOAD_TYPE_CRON) - "cron" workload type
- `Ws8` (getCronJitterConfig) - Jitter configuration
- `S5` (useStore) - Redux store hook
- `xA` (useDispatch) - Redux dispatch hook
- `_g` (findTaskById) - Teammate task lookup
- `LJ6` (isTaskTerminal) - Check if task is terminal
- `tQ6` (dispatchTaskPrompt) - Route prompt to teammate
- `yz6` (deleteCronTasks) - Remove cron tasks

### Teammate Routing (Flow 4)
- `iM` (getTeammateContext) - Get current teammate context
- `_g` (findTaskById) - Find task by agentId
- `LJ6` (isTaskTerminal) - Check terminal status
- `tQ6` (dispatchTaskPrompt) - Route prompt to teammate's queue
- `yz6` (deleteCronTasks) - Delete orphaned cron tasks

### Telemetry (Section 11)
- `d` - emitTelemetry function

---

## 18. useScheduledTasks Hook - Complete Implementation

### Hook Signature

**Location:** chunks.195.mjs:1948-1985

```javascript
// ============================================
// useScheduledTasks - React hook for cron scheduling in UI
// Location: chunks.195.mjs:1948-1985
// ============================================

// ORIGINAL (for source lookup):
function yvz({
    isLoading: A,
    assistantMode: q = !1
}) {
    let K = vb1.useRef(A);
    K.current = A;
    let Y = S5(),
        z = xA();
    vb1.useEffect(() => {
        if (!kR()) return;
        let _ = (O) => w0({
                value: O,
                mode: "prompt",
                priority: "later",
                isMeta: !0,
                workload: rA1
            }),
            w = Ds8({
                onFire: _,
                onFireTask: (O) => {
                    if (O.agentId) {
                        let $ = _g(O.agentId, Y.getState().tasks);
                        if ($ && !LJ6($.status)) {
                            tQ6($.id, O.prompt, z);
                            return
                        }
                        k(`[ScheduledTasks] teammate ${O.agentId} gone, removing orphaned cron ${O.id}`), yz6([O.id]);
                        return
                    }
                    _(O.prompt)
                },
                isLoading: () => K.current,
                assistantMode: q,
                getJitterConfig: Ws8,
                isKilled: () => !kR()
            });
        return w.start(), () => w.stop()
    }, [q])
}

// READABLE (for understanding):
function useScheduledTasks({
    isLoading,
    assistantMode = false
}) {
    // Keep ref to current loading state (for callback access)
    const isLoadingRef = React.useRef(isLoading);
    isLoadingRef.current = isLoading;

    // Redux hooks
    const store = useStore();
    const dispatch = useDispatch();

    React.useEffect(() => {
        // Feature flag check
        if (!isKairosCronEnabled()) return;

        // Message enqueuer helper
        const enqueuePrompt = (prompt) => enqueueMessage({
            value: prompt,
            mode: "prompt",
            priority: "later",
            isMeta: true,
            workload: WORKLOAD_TYPE_CRON
        });

        // Create scheduler
        const scheduler = createCronScheduler({
            // Regular fire: inject prompt into message queue
            onFire: enqueuePrompt,

            // Teammate-aware fire handler
            onFireTask: (task) => {
                if (task.agentId) {
                    // Find teammate task
                    const teammateTask = findTaskById(task.agentId, store.getState().tasks);

                    if (teammateTask && !isTaskTerminal(teammateTask.status)) {
                        // Teammate active: route to their queue
                        dispatchTaskPrompt(teammateTask.id, task.prompt, dispatch);
                        return;
                    }

                    // Teammate gone: cleanup orphaned cron
                    log(`[ScheduledTasks] teammate ${task.agentId} gone, removing orphaned cron ${task.id}`);
                    deleteCronTasks([task.id]);
                    return;
                }

                // No teammate: fire to main agent
                enqueuePrompt(task.prompt);
            },

            // Loading state getter (prevents fire during active queries)
            isLoading: () => isLoadingRef.current,

            // Assistant mode flag (different behavior)
            assistantMode,

            // Dynamic jitter config from feature flag
            getJitterConfig: getCronJitterConfig,

            // Kill check (stops scheduler when feature disabled)
            isKilled: () => !isKairosCronEnabled()
        });

        // Start scheduler
        scheduler.start();

        // Cleanup on unmount
        return () => scheduler.stop();
    }, [assistantMode]);  // Re-run when assistantMode changes
}

// Mapping: yvz→useScheduledTasks, A→isLoading, q→assistantMode, K→isLoadingRef
// Mapping: vb1→React, S5→useStore, xA→useDispatch, kR→isKairosCronEnabled
// Mapping: w0→enqueueMessage, Ds8→createCronScheduler, rA1→WORKLOAD_TYPE_CRON
// Mapping: _g→findTaskById, LJ6→isTaskTerminal, tQ6→dispatchTaskPrompt, yz6→deleteCronTasks
// Mapping: Ws8→getCronJitterConfig
```

### Hook Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `isLoading` | boolean | required | Whether the agent is currently processing |
| `assistantMode` | boolean | false | If true, different scheduler behavior |

### Hook Behavior

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    useScheduledTasks Hook Lifecycle                          │
└─────────────────────────────────────────────────────────────────────────────┘

Component Mount
       │
       ▼
┌──────────────────┐
│ isKairosCron     │──── false ────▶ Return (no scheduler)
│ Enabled()?       │
└────────┬─────────┘
         │ true
         ▼
┌──────────────────────────────────────────────────────────┐
│ createCronScheduler({                                     │
│   onFire: (prompt) => enqueueMessage({...}),             │
│   onFireTask: (task) => {                                │
│     if (task.agentId) {                                  │
│       // Teammate routing logic                          │
│     } else {                                             │
│       enqueuePrompt(prompt)                              │
│     }                                                    │
│   },                                                     │
│   isLoading: () => isLoadingRef.current,                 │
│   ...                                                    │
│ })                                                       │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│ scheduler.start()│
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│ SCHEDULER RUNNING                                         │
│                                                           │
│ • Every 1 second: checkTasks()                           │
│ • If task fire time && !isLoading:                       │
│   → onFire/onFireTask called                             │
│ • Message enqueued with priority="later"                 │
│                                                           │
│ If assistantMode changes:                                │
│   → useEffect re-runs                                     │
│   → Old scheduler stopped, new one created               │
└──────────────────────────────────────────────────────────┘
         │
         ▼
Component Unmount
         │
         ▼
┌──────────────────┐
│ scheduler.stop() │
│                  │
│ • Clear timers   │
│ • Release lock   │
│ • Close watcher  │
└──────────────────┘
```

### Message Injection Details

When a cron task fires, the prompt is injected into the message queue:

```javascript
enqueueMessage({
    value: prompt,           // The scheduled prompt
    mode: "prompt",          // Type of message
    priority: "later",       // "later" = won't interrupt current work
    isMeta: true,            // Hidden from user in transcript
    workload: "cron"         // Workload classification
});
```

**Priority Behavior:**
- `"later"` priority means the prompt waits until the agent is idle
- The REPL checks `isLoading` state before processing queued messages
- Prevents cron tasks from interrupting active agent work

### Redux Integration

The hook uses Redux for:
1. **Store access** (`useStore`) - Look up teammate tasks
2. **Dispatch** (`useDispatch`) - Route prompts to teammate queues

```javascript
// Teammate task lookup
const store = useStore();
const teammateTask = findTaskById(agentId, store.getState().tasks);

// Dispatch to teammate's queue
const dispatch = useDispatch();
dispatchTaskPrompt(teammateTask.id, prompt, dispatch);
```

### Related Symbols

- `useScheduledTasks` (yvz) - Main hook
- `createCronScheduler` (Ds8) - Scheduler factory
- `enqueueMessage` (w0) - Message queue injection
- `WORKLOAD_TYPE_CRON` (rA1) - "cron" workload constant
- `isKairosCronEnabled` (kR) - Feature flag check
- `getCronJitterConfig` (Ws8) - Dynamic jitter config
- `useStore` (S5) - Redux store hook
- `useDispatch` (xA) - Redux dispatch hook
- `findTaskById` (_g) - Teammate lookup
- `isTaskTerminal` (LJ6) - Terminal status check
- `dispatchTaskPrompt` (tQ6) - Route to teammate
- `deleteCronTasks` (yz6) - Delete orphaned crons

---

**Last Updated**: 2026-03-23
**Version**: Claude Code 2.1.76
**Status**: Complete - Source verified with interaction sequences, error handling, teammate routing flows, and useScheduledTasks hook implementation