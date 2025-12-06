# Todo List Implementation

## Overview

The TodoWrite tool provides a structured task tracking system for Claude Code sessions. It enables the assistant to break down complex tasks, track progress, and demonstrate thoroughness to users.

## TodoWrite Tool Implementation

### Tool Definition

**From chunks.60.mjs:1124-1212:**
```javascript
QEB = "TodoWrite"

BY = {
  name: QEB,
  strict: !0,
  input_examples: [{
    todos: [{
      content: "Implement user authentication",
      status: "in_progress",
      activeForm: "Implementing user authentication"
    }, {
      content: "Write unit tests",
      status: "pending",
      activeForm: "Writing unit tests"
    }]
  }],

  async description() {
    return aCB
  },

  async prompt() {
    return nCB
  },

  inputSchema: JJ6,
  outputSchema: WJ6,

  userFacingName() {
    return ""
  },

  isEnabled() {
    return !0
  },

  isConcurrencySafe() {
    return !1
  },

  isReadOnly() {
    return !1
  },

  async checkPermissions(A) {
    return {
      behavior: "allow",
      updatedInput: A
    }
  },

  renderToolUseMessage: rCB,
  renderToolUseProgressMessage: oCB,
  renderToolUseRejectedMessage: tCB,
  renderToolUseErrorMessage: eCB,
  renderToolResultMessage: AEB,

  async call({
    todos: A
  }, Q) {
    let G = (await Q.getAppState()).todos[Q.agentId] ?? [],
        Z = A.every((I) => I.status === "completed") ? [] : A;
    return Q.setAppState((I) => ({
      ...I,
      todos: {
        ...I.todos,
        [Q.agentId]: Z
      }
    })), {
      data: {
        oldTodos: G,
        newTodos: A
      }
    }
  },

  mapToolResultToToolResultBlockParam(A, Q) {
    return {
      tool_use_id: Q,
      type: "tool_result",
      content: "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable"
    }
  }
}
```

**Key Properties:**
- **Not concurrency safe**: `isConcurrencySafe() { return !1 }`
- **Auto-allowed**: `checkPermissions` returns "allow" without prompting
- **State management**: Stores todos per agent ID in app state
- **Auto-cleanup**: If all todos are completed, clears the list
- **Non-strict**: User-facing name is empty (hidden from user)

### Tool Description

**From chunks.60.mjs:901:**
```javascript
aCB = "Update the todo list for the current session. To be used proactively and often to track progress and pending tasks. Make sure that at least one task is in_progress at all times. Always provide both content (imperative) and activeForm (present continuous) for each task."
```

**Short Description Requirements:**
- Update session todo list
- Use proactively and often
- **At least one task must be in_progress at all times**
- Both `content` and `activeForm` required for each task

## Todo State Structure

### Schema Definition

**From chunks.60.mjs:1095-1102:**
```javascript
Lh1 = L(() => {
  Q2();
  IJ6 = j.enum(["pending", "in_progress", "completed"]),
  YJ6 = j.object({
    content: j.string().min(1, "Content cannot be empty"),
    status: IJ6,
    activeForm: j.string().min(1, "Active form cannot be empty")
  }),
  V7A = j.array(YJ6)
})
```

**Input Schema:**
```javascript
JJ6 = j.strictObject({
  todos: V7A.describe("The updated todo list")
})
```

**Output Schema:**
```javascript
WJ6 = j.object({
  oldTodos: V7A.describe("The todo list before the update"),
  newTodos: V7A.describe("The todo list after the update")
})
```

### Todo Item Structure

Each todo item has three required fields:

```typescript
interface TodoItem {
  content: string;      // Imperative form: "Run tests"
  status: "pending" | "in_progress" | "completed";
  activeForm: string;   // Present continuous: "Running tests"
}
```

**Example:**
```json
{
  "content": "Implement user authentication",
  "status": "in_progress",
  "activeForm": "Implementing user authentication"
}
```

## Status Values

### Three Status States

**From chunks.60.mjs:1097:**
```javascript
IJ6 = j.enum(["pending", "in_progress", "completed"])
```

1. **pending**: Task not yet started
2. **in_progress**: Currently working on (only ONE task should be in_progress)
3. **completed**: Task finished successfully

### Status Transition Rules

**From the prompt (chunks.60.mjs:1051-1085):**

```
1. **Task States**: Use these states to track progress:
   - pending: Task not yet started
   - in_progress: Currently working on (limit to ONE task at a time)
   - completed: Task finished successfully

   **IMPORTANT**: Task descriptions must have two forms:
   - content: The imperative form describing what needs to be done (e.g., "Run tests", "Build the project")
   - activeForm: The present continuous form shown during execution (e.g., "Running tests", "Building the project")

2. **Task Management**:
   - Update task status in real-time as you work
   - Mark tasks complete IMMEDIATELY after finishing (don't batch completions)
   - Exactly ONE task must be in_progress at any time (not less, not more)
   - Complete current tasks before starting new ones
   - Remove tasks that are no longer relevant from the list entirely

3. **Task Completion Requirements**:
   - ONLY mark a task as completed when you have FULLY accomplished it
   - If you encounter errors, blockers, or cannot finish, keep the task as in_progress
   - When blocked, create a new task describing what needs to be resolved
   - Never mark a task as completed if:
     - Tests are failing
     - Implementation is partial
     - You encountered unresolved errors
     - You couldn't find necessary files or dependencies

4. **Task Breakdown**:
   - Create specific, actionable items
   - Break complex tasks into smaller, manageable steps
   - Use clear, descriptive task names
   - Always provide both forms:
     - content: "Fix authentication bug"
     - activeForm: "Fixing authentication bug"
```

## Todo State Management Rules

### State Management Implementation

**From chunks.60.mjs:1186-1203:**
```javascript
async call({
  todos: A
}, Q) {
  let G = (await Q.getAppState()).todos[Q.agentId] ?? [],
      Z = A.every((I) => I.status === "completed") ? [] : A;

  return Q.setAppState((I) => ({
    ...I,
    todos: {
      ...I.todos,
      [Q.agentId]: Z
    }
  })), {
    data: {
      oldTodos: G,
      newTodos: A
    }
  }
}
```

**State Management Logic:**
1. Retrieve current todos for agent from app state
2. Check if all new todos are completed
3. If all completed, clear the todo list (set to `[]`)
4. Otherwise, update todos for this agent
5. Return both old and new todos for comparison

### Per-Agent State

Todos are stored per agent ID:
```javascript
todos: {
  [agentId1]: [...],
  [agentId2]: [...],
  [mainThread]: [...]
}
```

This allows:
- Main thread and subagents to have separate todo lists
- No interference between parallel agents
- Proper cleanup when agents complete

### Auto-Cleanup

**From chunks.60.mjs:1190:**
```javascript
Z = A.every((I) => I.status === "completed") ? [] : A;
```

If all todos are completed, the list is automatically cleared. This prevents accumulation of completed tasks.

## UI Rendering of Todos

### Render Functions

**From chunks.60.mjs:1104-1123:**
```javascript
function rCB() {
  return null
}

function oCB() {
  return null
}

function tCB() {
  return null
}

function eCB() {
  return null
}

function AEB() {
  return null
}
```

All render functions return `null`, meaning:
- No visual feedback when tool is used
- No progress messages
- No error/rejection messages
- Tool operates silently in the background

### Actual UI Rendering

Todo UI is rendered elsewhere in the codebase (not in tool definition). The tool only manages state; the UI reads from app state and displays todos.

## Debounce Implementation for Todo Updates

**From chunks.60.mjs:1213-1254:**
```javascript
// ============================================
// BEB - Debounce function with leading/trailing edges
// Location: chunks.60.mjs:1213
// ============================================
function BEB(func, delay, {
  signal,
  edges
} = {}) {
  let context = undefined,
    args = null,
    hasLeading = edges != null && edges.includes("leading"),
    hasTrailing = edges == null || edges.includes("trailing"),
    executeTrailing = () => {
      if (args !== null) func.apply(context, args), context = undefined, args = null
    },
    onTimeout = () => {
      if (hasTrailing) executeTrailing();
      cleanup()
    },
    timeoutId = null,
    scheduleTimeout = () => {
      if (timeoutId != null) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        timeoutId = null, onTimeout()
      }, delay)
    },
    cancel = () => {
      if (timeoutId !== null) clearTimeout(timeoutId), timeoutId = null
    },
    cleanup = () => {
      cancel(), context = undefined, args = null
    },
    flush = () => {
      cancel(), executeTrailing()
    },
    debouncedFn = function(...fnArgs) {
      if (signal?.aborted) return;
      context = this, args = fnArgs;
      let isFirstCall = timeoutId == null;
      if (scheduleTimeout(), hasLeading && isFirstCall) executeTrailing()
    };

  return debouncedFn.schedule = scheduleTimeout,
    debouncedFn.cancel = cleanup,
    debouncedFn.flush = flush,
    signal?.addEventListener("abort", cleanup, { once: !0 }),
    debouncedFn
}

// ============================================
// ZEB - Simplified debounce wrapper
// Location: chunks.60.mjs:1258
// ============================================
function ZEB(func, delay = 0, options = {}) {
  if (typeof options !== "object") options = {};

  let {
    signal,
    leading = false,
    trailing = true,
    maxWait
  } = options,
    edges = Array(2);

  if (leading) edges[0] = "leading";
  if (trailing) edges[1] = "trailing";

  let lastResult = undefined,
    lastCallTime = null,
    debouncedCore = BEB(function(...args) {
      lastResult = func.apply(this, args), lastCallTime = null
    }, delay, {
      signal,
      edges
    }),
    debouncedFn = function(...args) {
      if (maxWait != null) {
        if (lastCallTime === null) lastCallTime = Date.now();
        else if (Date.now() - lastCallTime >= maxWait) {
          return lastResult = func.apply(this, args),
            lastCallTime = Date.now(),
            debouncedCore.cancel(),
            debouncedCore.schedule(),
            lastResult
        }
      }
      return debouncedCore.apply(this, args), lastResult
    },
    flush = () => {
      return debouncedCore.flush(), lastResult
    };

  return debouncedFn.cancel = debouncedCore.cancel,
    debouncedFn.flush = flush,
    debouncedFn
}

// ============================================
// Mh1 - Throttle function wrapper
// Location: chunks.60.mjs:1293
// ============================================
function Mh1(func, delay = 0, options = {}) {
  if (typeof options !== "object") options = {};

  let {
    leading = true,
    trailing = true,
    signal
  } = options;

  return ZEB(func, delay, {
    leading,
    trailing,
    maxWait: delay,
    signal
  });
}
```

**Debounce Features:**
- **Leading/trailing edges**: Control when function executes
- **maxWait**: Force execution after maximum wait time
- **AbortSignal support**: Cancel on signal abort
- **Flush**: Execute pending call immediately
- **Cancel**: Clear pending calls

**Usage for Todo Updates:**
- Prevents excessive state updates
- Batches rapid todo modifications
- Improves performance during complex task sequences

## TodoWrite Prompt and Usage Guidelines

### Full Prompt Text

**From chunks.60.mjs:903-1086 (nCB variable):**

```markdown
Use this tool to create and manage a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the task and overall progress of their requests.

## When to Use This Tool
Use this tool proactively in these scenarios:

1. Complex multi-step tasks - When a task requires 3 or more distinct steps or actions
2. Non-trivial and complex tasks - Tasks that require careful planning or multiple operations
3. User explicitly requests todo list - When the user directly asks you to use the todo list
4. User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)
5. After receiving new instructions - Immediately capture user requirements as todos
6. When you start working on a task - Mark it as in_progress BEFORE beginning work. Ideally you should only have one todo as in_progress at a time
7. After completing a task - Mark it as completed and add any new follow-up tasks discovered during implementation

## When NOT to Use This Tool

Skip using this tool when:
1. There is only a single, straightforward task
2. The task is trivial and tracking it provides no organizational benefit
3. The task can be completed in less than 3 trivial steps
4. The task is purely conversational or informational

NOTE that you should not use this tool if there is only one trivial task to do. In this case you are better off just doing the task directly.
```

### Examples of When to Use

**Example 1: Dark Mode Implementation**
```
User: I want to add a dark mode toggle to the application settings. Make sure you run the tests and build when you're done!