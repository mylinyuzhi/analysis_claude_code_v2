# Subagent UI Interaction Complete (Claude Code 2.1.76)

> Complete source-level documentation of user interface interactions for subagents, including status display, keyboard shortcuts, and visual components.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `Vc4` - AgentStatusComponent — `chunks.133.mjs:124`
- `qh` - agentLoopRunner — `chunks.133.mjs:1565`
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`

---

## UI Component Architecture

### Component Hierarchy

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
│  │  │          ├─ Description                                          ││    │
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
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Agent Status Component (Vc4)

### Source Code

```javascript
// ============================================
// Vc4 - AgentStatusComponent - Render agent status in message
// Location: chunks.133.mjs:124-200
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
        P = D === void 0 ? !1 : D,
        W = H ? "└─" : "├─",
        Z = X && j,
        G;
    if (q[0] !== Z || q[1] !== j || q[2] !== M || q[3] !== _) G = () => {
        if (!j) return M || "Initializing…";
        if (Z) return _ ?? "Running in the background";
        return "Done"
    }, q[0] = Z, q[1] = j, q[2] = M, q[3] = _, q[4] = G;
    else G = q[4];
    // ... render logic continues
}

// READABLE (for understanding):
function AgentStatusComponent(props) {
    // Memoization cache
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
    let isAsyncMode = isAsync ?? false;
    let hideTypeBadge = hideType ?? false;

    // Tree prefix: "└─" for last sibling, "├─" for others
    let treePrefix = isLast ? "└─" : "├─";

    // Backgrounded means: async AND resolved (mid-run backgrounding)
    let isBackgrounded = isAsyncMode && isResolved;

    // Status text determination (memoized)
    let statusText = useMemoize(() => {
        if (!isResolved) {
            return lastToolInfo || "Initializing…";
        }
        if (isBackgrounded) {
            return taskDescription ?? "Running in the background";
        }
        return "Done";
    }, [isBackgrounded, isResolved, lastToolInfo, taskDescription]);

    // Render the component
    // ...
}

// Mapping: Vc4→AgentStatusComponent, K→agentType, Y→description, z→descriptionColor,
//          _→taskDescription, w→toolUseCount, O→tokens, $→color, H→isLast,
//          j→isResolved, J→isAsync, M→lastToolInfo, D→hideType
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
Running agent (not resolved):
├─ general-purpose (Find API usages) · 15 tool uses · 23451 tokens
│  Running Grep for "createTaskId"...

Completed agent (resolved):
├─ general-purpose (Find API usages) · 15 tool uses · 23451 tokens
│  Done

Backgrounded agent (async + resolved):
├─ general-purpose (Find API usages)
│  Running in the background

Last sibling in tree:
└─ Explore (Search for patterns) · 8 tool uses · 12345 tokens
   Done
```

---

## Status Line Integration

### Running Agent Count

```javascript
// ============================================
// hasRunningLocalAgents - State selector for status line
// Location: chunks.192.mjs:475 (inferred)
// ============================================

// ORIGINAL (for source lookup):
let l = Object.values(j).some((O6) => O6.type === "local_agent" && O6.status === "running");

// READABLE (for understanding):
let hasRunningLocalAgents = Object.values(tasks).some(
    (task) => task.type === "local_agent" && task.status === "running"
);

// Get count
let runningCount = Object.values(tasks).filter(
    (task) => task.type === "local_agent" && task.status === "running"
).length;
```

### Status Line Display Format

```
┌──────────────────────────────────────────────────────────────────┐
│ Status Line (with running agents)                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  2 running • Ctrl+C to cancel                                     │
│  └──────┘   └─────────────────────┘                              │
│   count        interactive hint                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Status Line (no running agents)                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  (normal status content - model, cwd, etc.)                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Visual Specifications

```
Running Count:
  Color: Yellow (warning)
  Format: "{count} running"

Separator:
  Text: " • "
  Color: Dim

Kill Hint:
  Text: "Ctrl+C to cancel"
  Color: Dim
  Interactive: Click/press triggers kill confirmation
```

---

## Keyboard Shortcuts

### Ctrl+C - Kill Current Agent

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CTRL+C HANDLER                                  │
└─────────────────────────────────────────────────────────────────────┘

User presses Ctrl+C
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Check: Is there a running foreground task?                         │
└─────────────────────────────────────────────────────────────────────┘
  │
  ├──────────────────────────────────────────────────────────┐
  │ YES                                                      │ NO
  ▼                                                          ▼
┌───────────────────────────────┐    ┌───────────────────────────────────┐
│ triggerAbortSignal (x66)      │    │ Show "No running tasks"           │
│ Mark task as killed           │    │ or exit session                   │
│ Show kill notification        │    │                                   │
└───────────────────────────────┘    └───────────────────────────────────┘
```

### Ctrl+F - Kill All Running Agents

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CTRL+F HANDLER (v2.1.76)                        │
└─────────────────────────────────────────────────────────────────────┘

User presses Ctrl+F
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ killAllLocalAgents (U4q)                                           │
│   Iterate all tasks                                                │
│   For each local_agent with status "running":                     │
│     triggerAbortSignal(taskId)                                    │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ markTaskKilled (d4q) for each                                      │
│   Update task status                                               │
│   Set notified: true                                               │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ User notification                                                   │
│   "Killed N running agents"                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Keyboard Shortcut Registry

```javascript
// Key bindings for subagent control
const SUBAGENT_KEYBINDINGS = {
    // Kill current foreground task
    "ctrl+c": {
        handler: "killCurrentTask",
        description: "Cancel current task or exit"
    },

    // Kill all running agents (v2.1.76)
    "ctrl+f": {
        handler: "killAllLocalAgents",
        description: "Kill all running background agents"
    }
};
```

---

## UI State Machine

### Agent Display States

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT DISPLAY STATE MACHINE                          │
└─────────────────────────────────────────────────────────────────────────────┘

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
                 │               │               │
                 ▼               ▼               ▼
          ┌───────────┐   ┌───────────┐   ┌───────────┐
          │ Background│   │ Completed │   │  Failed   │
          │ (async)   │   │  (done)   │   │  (error)  │
          └─────┬─────┘   └───────────┘   └───────────┘
                │
                │ complete
                ▼
          ┌───────────┐
          │ Completed │
          │ (notified)│
          └───────────┘
```

### Display Logic by State

| State | Tree Prefix | Badge | Status Text | Actions |
|-------|-------------|-------|-------------|---------|
| pending | "├─" | Type | "Initializing..." | None |
| running | "├─" | Type + stats | Last tool info | Kill available |
| backgrounded | "├─" | Type | Task description | Kill available |
| completed | "├─" | Type + stats | "Done" | None |
| failed | "├─" | Type | Error message | None |

---

## Visual Component Details

### Tree Prefix Rendering

```javascript
// Tree prefix indicates position in sibling list
const TREE_PREFIXES = {
    first: "├─",   // First or middle child
    last: "└─",    // Last child
    middle: "├─",  // Middle child
    only: "└─"     // Only child
};

// Example rendering
function renderTreePrefix(index, totalSiblings) {
    if (totalSiblings === 1) return "└─";  // Only child
    if (index === totalSiblings - 1) return "└─";  // Last
    return "├─";  // First or middle
}
```

### Badge Colors by Agent Type

```javascript
// Agent type badge colors
const AGENT_COLORS = {
    "general-purpose": "blue",
    "Explore": "green",
    "Plan": "purple",
    "statusline-setup": "orange",
    "claude-code-guide": "cyan"
};

// Custom color from agent definition
function getAgentColor(agentDefinition) {
    return agentDefinition.color ?? AGENT_COLORS[agentDefinition.agentType] ?? "default";
}
```

### Stats Display

```
┌──────────────────────────────────────────────────────────────────┐
│ Stats line format                                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  {tool_use_count} tool uses · {tokens} tokens                    │
│                                                                   │
│ Examples:                                                         │
│   15 tool uses · 23451 tokens                                     │
│   1 tool use · 500 tokens                                         │
│   150 tool uses · 150000 tokens                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Message Flow for UI Updates

```
┌─────────────────────────────────────────────────────────────────────┐
│                    UI UPDATE FLOW                                    │
└─────────────────────────────────────────────────────────────────────┘

Agent Loop (qh) yields message
  │
  ▼
Message processed by UI layer
  │
  ├──────────────────────────────────────────────────────────┐
  │                                                          │
  ▼                                                          ▼
┌───────────────────────────────┐    ┌───────────────────────────────────┐
│ ToolUseContent                │    │ AssistantMessage                   │
│   AgentStatusComponent (Vc4)  │    │   Text content                     │
│   Updated on each yield       │    │   Markdown rendered               │
└───────────────────────────────┘    └───────────────────────────────────┘
  │
  ▼
State updates trigger re-render
  │
  ├──────────────────────────────────────────────────────────┐
  │                                                          │
  ▼                                                          ▼
┌───────────────────────────────┐    ┌───────────────────────────────────┐
│ Status Line                   │    │ Task List (if open)               │
│   Update running count        │    │   Update task rows                │
│   Show/hide kill hint         │    │   Update progress indicators      │
└───────────────────────────────┘    └───────────────────────────────────┘
```

---

## Integration Points

| Module | Integration |
|--------|-------------|
| `01_cli` | Keyboard handlers, status line |
| `02_ui` | Component rendering |
| `08_subagent` | Agent status display |
| `26_background_agents` | Task list, kill controls |
| `04_system_reminder` | Task notifications |

---

## Summary

The subagent UI interaction provides:

1. **Visual status** - Agent type, description, stats in message
2. **Tree visualization** - Nested agent display with prefixes
3. **Real-time updates** - Progress and tool info on each turn
4. **Keyboard controls** - Ctrl+C kill current, Ctrl+F kill all
5. **Status line** - Running count with kill hint

The UI balances information density with readability, showing key metrics without overwhelming the user.