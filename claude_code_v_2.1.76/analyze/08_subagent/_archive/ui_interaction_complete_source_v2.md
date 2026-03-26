# Subagent UI Interaction Complete Source Restoration (Claude Code 2.1.76)

> Complete source-level analysis of UI components for subagent interaction.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `Vc4` - AgentStatusComponent — `chunks.133.mjs:124`
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`

---

## UI Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TUI Root (App)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        MessageArea                                    │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ AssistantMessage                                                 ││    │
│  │  │  └─ ToolUseContent                                              ││    │
│  │  │      └─ AgentStatusComponent (Vc4)                              ││    │
│  │  │          ├─ TreePrefix ("├─" / "└─")                           ││    │
│  │  │          ├─ AgentTypeBadge                                       ││    │
│  │  │          ├─ Description                                           ││    │
│  │  │          ├─ Stats (tool use count, tokens)                      ││    │
│  │  │          └─ StatusIndicator                                      ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        StatusLine                                    │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ BackgroundAgentIndicator                                         ││    │
│  │  │  • Running agent count                                          ││    │
│  │  │  • "Ctrl+C to cancel" hint                                      ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        TaskListModal (on /tasks)                     │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ TaskListRow[]                                                   ││    │
│  │  │  ├─ StatusIcon ◐ ✓ ✗ ○                                         ││    │
│  │  │  ├─ Description                                                 ││    │
│  │  │  └─ ActionHints ([x: stop] [f: foreground])                    ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## AgentStatusComponent (Vc4)

### What it does

Renders the visual representation of a subagent in the conversation tree. Shows agent type, description, statistics, and status.

### Source Code

```javascript
// ============================================
// Vc4 - AgentStatusComponent - Render agent status in tree
// Location: chunks.133.mjs:124-201
// ============================================

// ORIGINAL (for source lookup):
function Vc4(A) {
    let q = A6(33),
        {
            agentType: K,
            description: Y,
            descriptionColor: z,
            taskDescription: _,
            toolUseCount: w,
            tokens: O,
            color: $,
            isLast: H,
            isResolved: j,
            isAsync: J,
            lastToolInfo: M,
            hideType: D
        } = A,
        X = J === void 0 ? !1 : J,
        P = D === void 0 ? !1 : P,
        W = H ? "└─" : "├─",
        Z = X && j,
        G;
    if (q[0] !== Z || q[1] !== j || q[2] !== M || q[3] !== _) G = () => {
        if (!j) return M || "Initializing…";
        if (Z) return _ ?? "Running in the background";
        return "Done"
    }, q[0] = Z, q[1] = j, q[2] = M, q[3] = _, q[4] = G;
    else G = q[4];
    let f = G,
        v = !j,
        N;
    if (q[5] !== K || q[6] !== $ || q[7] !== Y || q[8] !== z || q[9] !== P) N = P ? w9.createElement(T, {
        bold: !0
    }, Y || K) : w9.createElement(w9.Fragment, null, w9.createElement(T, {
        bold: !0,
        backgroundColor: $,
        color: $ ? "inverseText" : void 0
    }, K), Y && w9.createElement(w9.Fragment, null, " (", w9.createElement(T, {
        backgroundColor: z,
        color: z ? "inverseText" : void 0
    }, Y), ")")), q[5] = K, q[6] = $, q[7] = Y, q[8] = z, q[9] = P, q[10] = N;
    else N = q[10];
    let V;
    if (q[11] !== Z || q[12] !== O || q[13] !== w) V = !Z && w9.createElement(w9.Fragment, null, " · ", w, " tool ", w === 1 ? "use" : "uses", O !== null && w9.createElement(w9.Fragment, null, " · ", fq(O), " tokens")), q[11] = Z, q[12] = O, q[13] = w, q[14] = V;
    else V = q[14];
    let L;
    if (q[15] !== v || q[16] !== N || q[17] !== V || q[18] !== W) L = w9.createElement(m, {
        paddingLeft: 3
    }, w9.createElement(T, {
        dimColor: v
    }, W, " ", N, V)), q[15] = v, q[16] = N, q[17] = V, q[18] = W, q[19] = L;
    else L = q[19];
    let h = !j,
        R = H ? " " : "│",
        u;
    if (q[20] !== h || q[21] !== R) u = w9.createElement(T, {
        dimColor: h
    }, R), q[20] = h, q[21] = R, q[22] = u;
    else u = q[22];
    let I;
    if (q[23] !== f) I = f(), q[23] = f, q[24] = I;
    else I = q[24];
    let g;
    if (q[25] !== I) g = w9.createElement(t1, null, w9.createElement(T, {
        dimColor: !0
    }, I)), q[25] = I, q[26] = g;
    else g = q[26];
    let B;
    if (q[27] !== u || q[28] !== g) B = w9.createElement(m, {
        paddingLeft: 3,
        flexDirection: "row"
    }, u, g), q[27] = u, q[28] = g, q[29] = B;
    else B = q[29];
    let b;
    if (q[30] !== B || q[31] !== L) b = w9.createElement(m, {
        flexDirection: "column"
    }, L, B), q[30] = B, q[31] = L, q[32] = b;
    else b = q[32];
    return b
}

// READABLE (for understanding):
function AgentStatusComponent(props) {
    // Memoization cache (33 slots)
    let cache = useMemoCache(33);

    let {
        agentType,           // "general-purpose", "Explore", "Plan", etc.
        description,         // Short description from AgentTool call
        descriptionColor,    // Optional custom color
        taskDescription,     // Detailed task description
        toolUseCount,        // Number of tool calls made
        tokens,              // Token usage count
        color,               // Agent's custom color from definition
        isLast,              // Whether last in list (affects tree prefix)
        isResolved,          // Whether agent completed
        isAsync,             // Whether running asynchronously
        lastToolInfo,        // Most recent tool info string
        hideType             // Hide agent type badge
    } = props;

    // Default values
    isAsync = isAsync ?? false;
    hideType = hideType ?? false;

    // Tree prefix: "└─" for last sibling, "├─" for others
    let treePrefix = isLast ? "└─" : "├─";

    // Backgrounded means: async AND resolved (mid-run backgrounding)
    let isBackgrounded = isAsync && isResolved;

    // STATUS TEXT DETERMINATION (memoized)
    let statusText = useMemoize(() => {
        if (!isResolved) {
            return lastToolInfo || "Initializing…";
        }
        if (isBackgrounded) {
            return taskDescription ?? "Running in the background";
        }
        return "Done";
    }, [isBackgrounded, isResolved, lastToolInfo, taskDescription]);

    let isRunning = !isResolved;

    // TYPE BADGE RENDERING (memoized)
    let typeBadge = useMemoize(() => {
        if (hideType) {
            // Just description, bold
            return createElement(Text, { bold: true }, description || agentType);
        }
        // Type badge with optional description
        return createElement(Fragment, null,
            createElement(Text, {
                bold: true,
                backgroundColor: color,
                color: color ? "inverseText" : undefined
            }, agentType),
            description && createElement(Fragment, null,
                " (",
                createElement(Text, {
                    backgroundColor: descriptionColor,
                    color: descriptionColor ? "inverseText" : undefined
                }, description),
                ")"
            )
        );
    }, [agentType, color, description, descriptionColor, hideType]);

    // STATISTICS RENDERING (memoized)
    let stats = useMemoize(() => {
        if (isBackgrounded) return null;  // Don't show stats for backgrounded

        return createElement(Fragment, null,
            " · ", toolUseCount, " tool ", toolUseCount === 1 ? "use" : "uses",
            tokens !== null && createElement(Fragment, null,
                " · ", formatTokens(tokens), " tokens"
            )
        );
    }, [isBackgrounded, toolUseCount, tokens]);

    // MAIN ROW (tree prefix + type badge + stats)
    let mainRow = useMemoize(() => {
        return createElement(Box, { paddingLeft: 3 },
            createElement(Text, { dimColor: isRunning },
                treePrefix, " ", typeBadge, stats
            )
        );
    }, [isRunning, typeBadge, stats, treePrefix]);

    // VERTICAL CONNECTOR
    let connector = isLast ? " " : "│";

    // STATUS ROW
    let statusRow = useMemoize(() => {
        return createElement(Box, { paddingLeft: 3, flexDirection: "row" },
            createElement(Text, { dimColor: isRunning }, connector),
            createElement(Box, { marginRight: 1 },
                createElement(Text, { dimColor: true }, statusText)
            )
        );
    }, [isRunning, connector, statusText]);

    // FINAL CONTAINER
    return createElement(Box, { flexDirection: "column" },
        mainRow,
        statusRow
    );
}

// Mapping: Vc4→AgentStatusComponent, K→agentType, Y→description, z→descriptionColor,
//          _→taskDescription, w→toolUseCount, O→tokens, $→color, H→isLast,
//          j→isResolved, J→isAsync, M→lastToolInfo, D→hideType,
//          A6→useMemoCache, w9→React, T→Text, m→Box, t1→Box with margin
```

### Props Interface

```typescript
interface AgentStatusProps {
    agentType: string;           // Agent type identifier
    description: string;         // Short description (3-5 words)
    descriptionColor?: string;   // Custom color for description text
    taskDescription?: string;    // Detailed task description
    toolUseCount: number;        // Cumulative tool call count
    tokens: number;              // Cumulative token usage
    color?: string;              // Badge color from agent definition
    isLast: boolean;             // Last sibling in tree (affects prefix)
    isResolved: boolean;         // Agent has completed
    isAsync: boolean;            // Running asynchronously
    lastToolInfo?: string;       // Current tool info (e.g., "Running Grep...")
    hideType?: boolean;          // Hide type badge
}
```

### Visual Output Examples

```
Running agent:
├─ general-purpose (Find API usages) · 5 tool uses · 12345 tokens
│  Running Grep for "createTaskId"...

Completed agent:
└─ Plan (Design auth system) · 15 tool uses · 45678 tokens
   Done

Backgrounded agent:
├─ Explore (Search codebase)
│  Running in the background
```

---

## Kill All Flow (Ctrl+F)

### Keyboard Binding

**Location:** chunks.89.mjs:2634

```javascript
// ORIGINAL:
"ctrl+f": "chat:killAgents"

// This binds Ctrl+F to the "chat:killAgents" action in Chat context
```

### Kill Handler Implementation

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all local_agent tasks
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
            // x66 triggers abort signal for this task
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal
```

### Trigger Abort Signal (x66)

```javascript
// ============================================
// x66 - triggerAbortSignal - Trigger abort for a task
// Location: chunks.146.mjs:2012-2027
// ============================================

// ORIGINAL (for source lookup):
function x66(A, q) {
    let K = !1;
    if (i9(A, q, (Y) => {
            if (Y.status !== "running") return Y;
            return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
                ...Y,
                status: "killed",
                endTime: Date.now(),
                messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                selectedAgent: void 0
            }
        }), K) $O(A);
    return K
}

// READABLE (for understanding):
function triggerAbortSignal(taskId, setAppState) {
    let wasKilled = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only kill running tasks
        if (task.status !== "running") return task;

        wasKilled = true;

        // Trigger the abort controller
        task.abortController?.abort();

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message for memory
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear control objects
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Remove from active tracking
    if (wasKilled) {
        removeActiveAgent(taskId);
    }

    return wasKilled;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, i9→atomicUpdateTask,
//          Y→task, K→wasKilled, $O→removeActiveAgent
```

---

## Kill Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    User Presses Ctrl+F with Running Agents                   │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Execute Kill All                                        │
│                                                                              │
│  1. telemetry("tengu_cancel", { source: "kill_agents" })                   │
│  2. U4q(tasks, setAppState)  // Trigger abort for all local_agent          │
│  3. For each killed agent:                                                   │
│     a. x66(taskId, setAppState)  // Abort and set status: "killed"         │
│     b. d4q(taskId, setAppState)  // Set notified: true                     │
│     c. Collect description for notification                                 │
│  4. Show notification with killed agent names                               │
└─────────────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      UI Updates                                              │
│                                                                              │
│  • Status line cleared (no more running agents)                             │
│  • Task list shows killed status (○)                                        │
│  • Notification: "Background agent 'X' was stopped by the user."           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Status Line Integration

### hasRunningLocalAgents Check

```javascript
// ============================================
// hasRunningLocalAgents - State selector
// Location: chunks.192.mjs:475 (inferred)
// ============================================

// ORIGINAL (for source lookup):
let l = Object.values(j).some((O6) => O6.type === "local_agent" && O6.status === "running");

// READABLE (for understanding):
let hasRunningLocalAgents = Object.values(tasks).some(
    (task) => task.type === "local_agent" && task.status === "running"
);
```

### Status Line Display Format

```
┌──────────────────────────────────────────────────────────────────┐
│ 2 running • Ctrl+C to cancel                                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Task List Modal

### Task Status Icons

| Status | Icon | Animation | Color |
|--------|------|-----------|-------|
| `pending` | ○ | None | Dim |
| `running` | ◐ | Spinner | Yellow |
| `completed` | ✓ | None | Green |
| `failed` | ✗ | None | Red |
| `killed` | ○ | None | Dim |

### Action Availability

| Task Type | Kill (`x`) | Foreground (`f`) |
|-----------|------------|------------------|
| `local_agent` | ✓ running | ✗ |
| `local_bash` | ✓ running | ✗ |
| `in_process_teammate` | ✓ running | ✓ running |
| `remote_agent` | ✓ running | ✗ |
| `local_workflow` | ✓ running | ✗ |

---

## UI State Machine

### Agent Display States

```
                          ┌─────────────┐
                          │  Created    │
                          │  (pending)  │
                          └──────┬──────┘
                                 │ spawn
                                 ▼
                          ┌─────────────┐
                 ┌────────│  Running    │────────┐
                 │        │  (active)   │        │
                 │        └──────┬──────┘        │
                 │               │               │
        mid-run  │               │ complete      │ background
        bg       │               │               │ (run_in_bg)
                 │               ▼               │
                 │        ┌─────────────┐        │
                 │        │ Completed   │        │
                 │        │ (done)      │        │
                 │        └─────────────┘        │
                 │                               │
                 ▼                               ▼
          ┌─────────────┐                 ┌─────────────┐
          │ Backgrounded│                 │ Background  │
          │ (running)   │                 │ Launched    │
          └──────┬──────┘                 └──────┬──────┘
                 │                               │
                 │ complete                      │ complete
                 ▼                               ▼
          ┌─────────────┐                 ┌─────────────┐
          │ Background  │                 │ Background  │
          │ Completed   │                 │ Completed   │
          └─────────────┘                 └─────────────┘
```

### Display Logic

| isResolved | isAsync | Status | Display Text |
|------------|---------|--------|--------------|
| `false` | `false` | Running | `lastToolInfo \|\| "Initializing…"` |
| `false` | `true` | Background Running | `lastToolInfo \|\| "Running..."` |
| `true` | `false` | Completed | `"Done"` |
| `true` | `true` | Background Completed | `taskDescription \|\| "Running in background"` |

---

## v2.1.76 UI Changes

### New Features

1. **Ctrl+F Kill All** - Explicit shortcut for killing all background agents
2. **Partial Results on Kill** - Output preserved when task killed
3. **Background Field** - Distinguishes explicit vs converted background tasks
4. **Mid-Run Backgrounding** - Seamless sync→async transition

### UI Indicator Enhancements

```
v2.1.76 Status Line:
┌──────────────────────────────────────────────────────────────────┐
│ 2 running • Ctrl+C to cancel                                      │
│              └─────────────────────┘                              │
│                 Interactive hint                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Vc4` | AgentStatusComponent | chunks.133.mjs:124 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |

---

## Related Documents

- [ui_design_complete.md](./ui_design_complete.md) - Visual design specifications
- [execution_flow_deep_dive.md](./execution_flow_deep_dive.md) - Execution flow
- [../26_background_agents/ui_design_complete.md](../26_background_agents/ui_design_complete.md) - Background agents UI