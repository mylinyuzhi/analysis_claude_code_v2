# Todo List Implementation - Comprehensive Analysis (v2.1.7)

## Executive Summary

The TodoWrite tool provides a structured task tracking system for Claude Code sessions. It enables the assistant to break down complex tasks, track progress, and demonstrate thoroughness to users. This document provides an in-depth analysis of the v2.1.7 implementation, including trigger mechanisms, persistence, UI rendering, system reminders, and cross-module interactions with Plan Mode.

**Key Changes from v2.0.59:**
- Reminder threshold changed from 7 to **10 turns**
- Tasks v2 system added (migration support, currently disabled)
- Symbol names changed (e.g., `BY` → `Bm` for tool name)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `TodoWriteTool` (vD) - Main tool object
- `TODOWRITE_TOOL_NAME` (Bm) - Tool name constant
- `generateTodoReminderAttachments` (t27) - Reminder generator
- `countTurnsSinceLastTodo` (s27) - Turn counter
- `TodoListComponent` (Ns) - UI component

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           TodoWrite Tool Architecture                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TRIGGER LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────┐   ┌─────────────────────────────────────────┐ │
│  │ System Prompt Integration   │   │        Tool Prompt (KCB)                │ │
│  │ chunks.146.mjs:2497-2588    │   │        chunks.59.mjs:4-186              │ │
│  │                             │   │                                         │ │
│  │ "# Task Management          │   │ • When to Use (7 scenarios)             │ │
│  │  You have access to the     │   │ • When NOT to Use (4 scenarios)         │ │
│  │  TodoWrite tools..."        │   │ • Examples with reasoning               │ │
│  └─────────────────────────────┘   │ • Task state management rules           │ │
│                                     └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TOOL EXECUTION LAYER                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                     TodoWrite Tool (vD)                                 │   │
│  │                     chunks.59.mjs:402-481                               │   │
│  │                                                                          │   │
│  │  call({ todos: A }, Q) {                                                │   │
│  │    1. Get current todos: (await Q.getAppState()).todos[Q.agentId]       │   │
│  │    2. Auto-cleanup: if all completed → clear list                       │   │
│  │    3. Update state: Q.setAppState(...)                                  │   │
│  │    4. Return: { data: { oldTodos, newTodos } }                          │   │
│  │  }                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                          │
                      ┌───────────────────┼───────────────────┐
                      ▼                   ▼                   ▼
┌──────────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│     STATE UPDATE         │  │   FILE PERSISTENCE   │  │   UI NOTIFICATION    │
│                          │  │                      │  │                      │
│ appState.todos[agentId]  │  │ ~/.claude/todos/     │  │ React re-render      │
│ in chunks.135.mjs        │  │ {userId}-agent-      │  │ via setAppState      │
│                          │  │ {agentId}.json       │  │                      │
└──────────────────────────┘  └──────────────────────┘  └──────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              UI RENDERING LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────┐ │
│  │ Ns Component            │  │ Spinner Integration     │  │ Ctrl+T Toggle   │ │
│  │ chunks.107.mjs:1804     │  │ shows activeForm        │  │                 │ │
│  │                         │  │                         │  │                 │ │
│  │ Renders todo list:      │  │ Shows active task:      │  │ showExpandedTodos│ │
│  │ ☑ Completed (dim)       │  │ "Implementing..."       │  │ state toggle    │ │
│  │ ☐ In Progress (bold)    │  │ "Running tests..."      │  │                 │ │
│  │ ☐ Pending               │  │                         │  │                 │ │
│  └─────────────────────────┘  └─────────────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM REMINDER LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ t27 (generateTodoReminderAttachments) - chunks.132.mjs:117-133         │   │
│  │                                                                          │   │
│  │ if (turnsSinceTodoWrite >= 10 && turnsSinceLastReminder >= 10) {        │   │
│  │   return [{ type: "todo_reminder", content: todos, itemCount }]         │   │
│  │ }                                                                        │   │
│  │                                                                          │   │
│  │ Converted to system message in chunks.148.mjs:105-119                   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. LLM Compliance Enforcement Mechanisms

This section analyzes how Claude Code ensures the LLM consistently uses TodoWrite and doesn't ignore task tracking. The system employs a **5-layer enforcement strategy** combining upfront guidance, runtime reminders, and feedback loops.

### Multi-Layer Enforcement Strategy

| Layer | Location | Mechanism | Strength |
|-------|----------|-----------|----------|
| System Prompt Core | chunks.146.mjs:2497-2541 | "VERY frequently", "EXTREMELY", "unacceptable" | CRITICAL |
| System Prompt Footer | chunks.146.mjs:2587-2588 | "IMPORTANT: Always use" | HIGH |
| Tool Prompt | chunks.59.mjs:4-186 | 180+ lines of guidelines with examples | HIGH |
| Auto-Reminder | chunks.132.mjs:117-133 | After **10 turns** inactivity | MEDIUM |
| Tool Result | chunks.59.mjs:477-479 | "Continue to use todo list" | LOW |

### Strong Language Analysis

The system prompt uses deliberately strong language to ensure LLM compliance:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    ENFORCEMENT LANGUAGE ANALYSIS                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  PHRASE                                    │ ENFORCEMENT TYPE                   │
│  ─────────────────────────────────────────┼──────────────────────────────────── │
│  "Use these tools VERY frequently"        │ Frequency mandate (all caps)       │
│  "EXTREMELY helpful for planning"         │ Emphasis (all caps)                │
│  "may forget...unacceptable"              │ Negative consequence framing       │
│  "It is critical that you mark..."        │ Urgency language                   │
│  "IMPORTANT: Always use"                  │ Absolute requirement (all caps)    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Psychological Reinforcement Patterns

1. **Negative Consequence Framing**
   - "If you do not use this tool when planning, you may forget to do important tasks - and that is unacceptable"
   - Creates accountability and fear of failure

2. **Responsibility Assignment**
   - "giving the user visibility into your progress"
   - Associates todo usage with user satisfaction

3. **Hidden Meta-Messages**
   - Reminders sent with `isMeta: true` are invisible to users
   - "Make sure that you NEVER mention this reminder to the user"
   - Allows psychological reinforcement without disrupting user experience

4. **Immediate Gratification Feedback**
   - Tool result: "Todos have been modified successfully. Ensure that you continue to use the todo list"
   - Positive reinforcement after each use

---

## 3. TodoWrite Tool Definition

### 3.1 Tool Name Constant

```javascript
// ============================================
// TODOWRITE_TOOL_NAME - Tool name constant
// Location: chunks.59.mjs:224
// ============================================

// ORIGINAL (for source lookup):
Bm = "TodoWrite"

// READABLE (for understanding):
TODOWRITE_TOOL_NAME = "TodoWrite"

// Mapping: Bm→TODOWRITE_TOOL_NAME
```

### 3.2 Status Enum and Schema

```javascript
// ============================================
// todoStatusEnum, todoItemSchema, todoArraySchema - Schema definitions
// Location: chunks.59.mjs:195-202
// ============================================

// ORIGINAL (for source lookup):
a10 = w(() => {
  j9();
  NX8 = m.enum(["pending", "in_progress", "completed"]), wX8 = m.object({
    content: m.string().min(1, "Content cannot be empty"),
    status: NX8,
    activeForm: m.string().min(1, "Active form cannot be empty")
  }), jIA = m.array(wX8)
})

// READABLE (for understanding):
initTodoSchemas = lazy(() => {
  initZod();
  todoStatusEnum = zod.enum(["pending", "in_progress", "completed"]);
  todoItemSchema = zod.object({
    content: zod.string().min(1, "Content cannot be empty"),
    status: todoStatusEnum,
    activeForm: zod.string().min(1, "Active form cannot be empty")
  });
  todoArraySchema = zod.array(todoItemSchema);
})

// Mapping: a10→initTodoSchemas, NX8→todoStatusEnum, wX8→todoItemSchema, jIA→todoArraySchema, m→zod
```

### 3.3 Input/Output Schemas

```javascript
// ============================================
// todoWriteInputSchema, todoWriteOutputSchema - I/O schemas
// Location: chunks.59.mjs:397-401
// ============================================

// ORIGINAL (for source lookup):
SX8 = m.strictObject({
  todos: jIA.describe("The updated todo list")
}), xX8 = m.object({
  oldTodos: jIA.describe("The todo list before the update"),
  newTodos: jIA.describe("The todo list after the update")
})

// READABLE (for understanding):
todoWriteInputSchema = zod.strictObject({
  todos: todoArraySchema.describe("The updated todo list")
});
todoWriteOutputSchema = zod.object({
  oldTodos: todoArraySchema.describe("The todo list before the update"),
  newTodos: todoArraySchema.describe("The todo list after the update")
});

// Mapping: SX8→todoWriteInputSchema, xX8→todoWriteOutputSchema, jIA→todoArraySchema
```

### 3.4 Tool Object Definition

```javascript
// ============================================
// TodoWriteTool - Complete tool object
// Location: chunks.59.mjs:402-481
// ============================================

// ORIGINAL (for source lookup):
vD = {
  name: Bm,
  maxResultSizeChars: 1e5,
  strict: !0,
  input_examples: [{
    todos: [{
      content: "Fix the login bug",
      status: "pending",
      activeForm: "Fixing the login bug"
    }]
  }, {
    todos: [{
      content: "Implement feature",
      status: "completed",
      activeForm: "Implementing feature"
    }, {
      content: "Write unit tests",
      status: "in_progress",
      activeForm: "Writing unit tests"
    }]
  }],
  async description() {
    return VCB
  },
  async prompt() {
    return KCB
  },
  inputSchema: SX8,
  outputSchema: xX8,
  userFacingName() {
    return ""
  },
  isEnabled() {
    return !Gm()
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
  renderToolUseMessage: HCB,
  renderToolUseProgressMessage: ECB,
  renderToolUseRejectedMessage: zCB,
  renderToolUseErrorMessage: $CB,
  renderToolResultMessage: CCB,
  async call({
    todos: A
  }, Q) {
    let B = await Q.getAppState(),
      G = Q.agentId ?? q0(),
      Z = B.todos[G] ?? [],
      Y = A.every((J) => J.status === "completed") ? [] : A;
    return Q.setAppState((J) => ({
      ...J,
      todos: {
        ...J.todos,
        [G]: Y
      }
    })), {
      data: {
        oldTodos: Z,
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

// READABLE (for understanding):
TodoWriteTool = {
  name: TODOWRITE_TOOL_NAME,           // "TodoWrite"
  maxResultSizeChars: 100000,
  strict: true,
  input_examples: [
    // Example 1: Single pending task
    { todos: [{ content: "Fix the login bug", status: "pending", activeForm: "Fixing the login bug" }] },
    // Example 2: Mixed statuses
    { todos: [
      { content: "Implement feature", status: "completed", activeForm: "Implementing feature" },
      { content: "Write unit tests", status: "in_progress", activeForm: "Writing unit tests" }
    ]}
  ],

  async description() { return SHORT_DESCRIPTION },  // Brief description
  async prompt() { return TOOL_PROMPT },             // 180+ line guidelines

  inputSchema: todoWriteInputSchema,
  outputSchema: todoWriteOutputSchema,

  userFacingName() { return "" },                    // Empty = silent tool
  isEnabled() { return !isTasksV2Enabled() },       // Always true (Gm returns false)
  isConcurrencySafe() { return false },             // Cannot run in parallel
  isReadOnly() { return false },                    // Modifies state

  async checkPermissions(input) {
    return { behavior: "allow", updatedInput: input }  // Always allowed
  },

  // All render functions return null (silent operation)
  renderToolUseMessage: () => null,
  renderToolUseProgressMessage: () => null,
  renderToolUseRejectedMessage: () => null,
  renderToolUseErrorMessage: () => null,
  renderToolResultMessage: () => null,

  async call({ todos }, context) {
    const appState = await context.getAppState();
    const agentId = context.agentId ?? getSessionId();
    const oldTodos = appState.todos[agentId] ?? [];

    // Auto-cleanup: clear list if all todos are completed
    const newTodos = todos.every(t => t.status === "completed") ? [] : todos;

    // Update app state
    context.setAppState(state => ({
      ...state,
      todos: { ...state.todos, [agentId]: newTodos }
    }));

    return { data: { oldTodos, newTodos: todos } };
  },

  mapToolResultToToolResultBlockParam(data, toolUseId) {
    return {
      tool_use_id: toolUseId,
      type: "tool_result",
      content: "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable"
    }
  }
}

// Mapping: vD→TodoWriteTool, Bm→TODOWRITE_TOOL_NAME, Gm→isTasksV2Enabled, q0→getSessionId,
//          VCB→SHORT_DESCRIPTION, KCB→TOOL_PROMPT, SX8→todoWriteInputSchema, xX8→todoWriteOutputSchema
```

**Key Design Decisions:**

1. **Always Enabled**: `isEnabled()` returns `!Gm()` where `Gm()` always returns `false`, making TodoWrite always enabled

2. **Auto-Cleanup**: When all todos are completed, the list is automatically cleared (set to empty array)

3. **Silent Operation**: All render functions return `null`, making tool execution invisible to the user

4. **Positive Reinforcement**: Tool result message explicitly encourages continued use

5. **Per-Agent Isolation**: Todos are stored per `agentId`, enabling subagent isolation

---

## 4. System Prompt Integration

### 4.1 Task Management Section

**Location:** `chunks.146.mjs:2497-2541`

```javascript
// ============================================
// System Prompt - Task Management Section
// Location: chunks.146.mjs:2497-2541
// ============================================

// ORIGINAL (obfuscated template):
${W.has(vD.name)?`# Task Management
You have access to the ${vD.name} tools to help you manage and plan tasks. Use these tools VERY frequently to ensure that you are tracking your tasks and giving the user visibility into your progress.
These tools are also EXTREMELY helpful for planning tasks, and for breaking down larger complex tasks into smaller steps. If you do not use this tool when planning, you may forget to do important tasks - and that is unacceptable.

It is critical that you mark todos as completed as soon as you are done with a task. Do not batch up multiple tasks before marking them as completed.

Examples:

<example>
user: Run the build and fix any type errors
assistant: I'm going to use the ${vD.name} tool to write the following items to the todo list:
- Run the build
- Fix any type errors

I'm now going to run the build using ${X9}.

Looks like I found 10 type errors. I'm going to use the ${vD.name} tool to write 10 items to the todo list.

marking the first todo as in_progress

Let me start working on the first item...

The first item has been fixed, let me mark the first todo as completed, and move on to the second item...
..
..
</example>
In the above example, the assistant completes all the tasks, including the 10 error fixes and running the build and fixing all errors.

<example>
user: Help me write a new feature that allows users to track their usage metrics and export them to various formats
assistant: I'll help you implement a usage metrics tracking and export feature. Let me first use the ${vD.name} tool to plan this task.
Adding the following todos to the todo list:
1. Research existing metrics tracking in the codebase
2. Design the metrics collection system
3. Implement core metrics tracking functionality
4. Create export functionality for different formats

Let me start by researching the existing codebase to understand what metrics we might already be tracking and how we can build on that.

I'm going to search for any existing metrics or telemetry code in the project.

I've found some existing telemetry code. Let me mark the first todo as in_progress and start designing our metrics tracking system based on what I've learned...

[Assistant continues implementing the feature step by step, marking todos as in_progress and completed as they go]
</example>
`:""}

// READABLE VERSION:
${availableTools.has("TodoWrite") ? `# Task Management
You have access to the TodoWrite tools to help you manage and plan tasks.
Use these tools VERY frequently to ensure that you are tracking your tasks
and giving the user visibility into your progress.

These tools are also EXTREMELY helpful for planning tasks, and for breaking
down larger complex tasks into smaller steps. If you do not use this tool
when planning, you may forget to do important tasks - and that is unacceptable.

It is critical that you mark todos as completed as soon as you are done with
a task. Do not batch up multiple tasks before marking them as completed.

[Examples showing proper todo usage patterns...]
` : ""}

// Mapping: W→availableTools, vD.name→"TodoWrite", X9→BASH_TOOL_NAME
```

### 4.2 System Prompt Footer Reminder

**Location:** `chunks.146.mjs:2587-2588`

```javascript
// ============================================
// System Prompt Footer - TodoWrite Reminder
// Location: chunks.146.mjs:2587-2588
// ============================================

// ORIGINAL:
W.has(vD.name) ? `
IMPORTANT: Always use the ${vD.name} tool to plan and track tasks throughout the conversation.` : ""

// READABLE:
availableTools.has("TodoWrite") ? `
IMPORTANT: Always use the TodoWrite tool to plan and track tasks throughout the conversation.` : ""

// Mapping: W→availableTools, vD.name→"TodoWrite"
```

### 4.3 Doing Tasks Section Reference

**Location:** `chunks.146.mjs:2555-2556`

```javascript
// ============================================
// System Prompt - Doing Tasks Section (TodoWrite reference)
// Location: chunks.146.mjs:2555-2556
// ============================================

// ORIGINAL:
- ${W.has(vD.name)?`Use the ${vD.name} tool to plan the task if required`:""}

// READABLE:
- ${availableTools.has("TodoWrite") ? `Use the TodoWrite tool to plan the task if required` : ""}

// Mapping: W→availableTools, vD.name→"TodoWrite"
```

---

## 5. Tool Prompt (Full Guidelines)

### 5.1 Complete Tool Description

**Location:** `chunks.59.mjs:4-186` (KCB variable)

The tool prompt is a comprehensive 180+ line document that includes:

**Section 1: Introduction**
```
Use this tool to create and manage a structured task list for your current coding session.
This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the task and overall progress of their requests.
```

**Section 2: When to Use This Tool (7 scenarios)**
1. Complex multi-step tasks - When a task requires 3 or more distinct steps
2. Non-trivial and complex tasks - Tasks requiring careful planning
3. User explicitly requests todo list
4. User provides multiple tasks (numbered or comma-separated)
5. After receiving new instructions - Immediately capture requirements
6. When starting work on a task - Mark as in_progress BEFORE beginning
7. After completing a task - Mark as completed and add follow-up tasks

**Section 3: When NOT to Use This Tool (4 scenarios)**
1. Single, straightforward task
2. Trivial task with no organizational benefit
3. Task can be completed in less than 3 trivial steps
4. Purely conversational or informational task

**Section 4: Examples with Reasoning**
- Dark mode toggle example (multi-step feature)
- Function rename example (search first, then track)
- E-commerce features example (multiple complex features)
- React optimization example (analyze first, then track)

**Section 5: Counter-Examples**
- "Hello World" question (trivial)
- Git status explanation (informational)
- Adding a comment (single action)
- Running npm install (single command)

**Section 6: Task States and Management**

```
1. **Task States**: Use these states to track progress:
   - pending: Task not yet started
   - in_progress: Currently working on (limit to ONE task at a time)
   - completed: Task finished successfully

   **IMPORTANT**: Task descriptions must have two forms:
   - content: The imperative form (e.g., "Run tests", "Build the project")
   - activeForm: The present continuous form (e.g., "Running tests", "Building the project")

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

When in doubt, use this tool. Being proactive with task management demonstrates
attentiveness and ensures you complete all requirements successfully.
```

---

## 6. Todo Reminder System

### 6.1 Turn Counter Function

```javascript
// ============================================
// countTurnsSinceLastTodo - Analyzes message history for todo activity
// Location: chunks.132.mjs:96-115
// ============================================

// ORIGINAL (for source lookup):
function s27(A) {
  let Q = -1,
    B = -1,
    G = 0,
    Z = 0;
  for (let Y = A.length - 1; Y >= 0; Y--) {
    let J = A[Y];
    if (J?.type === "assistant") {
      if (dF1(J)) continue;
      if (Q === -1 && "message" in J && Array.isArray(J.message?.content) && J.message.content.some((X) => X.type === "tool_use" && X.name === "TodoWrite")) Q = Y;
      if (Q === -1) G++;
      if (B === -1) Z++
    } else if (B === -1 && J?.type === "attachment" && J.attachment.type === "todo_reminder") B = Y;
    if (Q !== -1 && B !== -1) break
  }
  return {
    turnsSinceLastTodoWrite: G,
    turnsSinceLastReminder: Z
  }
}

// READABLE (for understanding):
function countTurnsSinceLastTodo(messages) {
  let lastTodoWriteIndex = -1;
  let lastReminderIndex = -1;
  let turnsSinceLastTodoWrite = 0;
  let turnsSinceLastReminder = 0;

  // Scan messages from most recent to oldest
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];

    if (message?.type === "assistant") {
      // Skip summarized/compacted messages
      if (isSummarizedMessage(message)) continue;

      // Check for TodoWrite tool usage
      if (lastTodoWriteIndex === -1 &&
          "message" in message &&
          Array.isArray(message.message?.content) &&
          message.message.content.some(c => c.type === "tool_use" && c.name === "TodoWrite")) {
        lastTodoWriteIndex = i;
      }

      // Count turns since last TodoWrite
      if (lastTodoWriteIndex === -1) turnsSinceLastTodoWrite++;
      // Count turns since last reminder
      if (lastReminderIndex === -1) turnsSinceLastReminder++;
    }
    // Check for existing reminder attachments
    else if (lastReminderIndex === -1 &&
             message?.type === "attachment" &&
             message.attachment.type === "todo_reminder") {
      lastReminderIndex = i;
    }

    // Stop searching once both found
    if (lastTodoWriteIndex !== -1 && lastReminderIndex !== -1) break;
  }

  return {
    turnsSinceLastTodoWrite,
    turnsSinceLastReminder
  };
}

// Mapping: s27→countTurnsSinceLastTodo, A→messages, dF1→isSummarizedMessage
```

### 6.2 Reminder Generator Function

```javascript
// ============================================
// generateTodoReminderAttachments - Creates reminder when threshold exceeded
// Location: chunks.132.mjs:117-133
// ============================================

// ORIGINAL (for source lookup):
async function t27(A, Q) {
  if (!Q.options.tools.some((Z) => Z.name === Bm)) return [];
  if (!A || A.length === 0) return [];
  let {
    turnsSinceLastTodoWrite: B,
    turnsSinceLastReminder: G
  } = s27(A);
  if (B >= nr2.TURNS_SINCE_WRITE && G >= nr2.TURNS_BETWEEN_REMINDERS) {
    let Z = Cb(Q.agentId ?? q0());
    return [{
      type: "todo_reminder",
      content: Z,
      itemCount: Z.length
    }]
  }
  return []
}

// READABLE (for understanding):
async function generateTodoReminderAttachments(messages, sessionContext) {
  // Only generate reminders if TodoWrite tool is available
  if (!sessionContext.options.tools.some(t => t.name === TODOWRITE_TOOL_NAME)) {
    return [];
  }

  // No reminders for empty conversations
  if (!messages || messages.length === 0) return [];

  // Analyze message history
  const { turnsSinceLastTodoWrite, turnsSinceLastReminder } = countTurnsSinceLastTodo(messages);

  // Check if thresholds exceeded (both must be >= 10)
  if (turnsSinceLastTodoWrite >= TODO_REMINDER_CONSTANTS.TURNS_SINCE_WRITE &&
      turnsSinceLastReminder >= TODO_REMINDER_CONSTANTS.TURNS_BETWEEN_REMINDERS) {

    // Get current todos from storage
    const currentTodos = readTodosFromFile(sessionContext.agentId ?? getSessionId());

    return [{
      type: "todo_reminder",
      content: currentTodos,
      itemCount: currentTodos.length
    }];
  }

  return [];
}

// Mapping: t27→generateTodoReminderAttachments, A→messages, Q→sessionContext, Bm→TODOWRITE_TOOL_NAME,
//          s27→countTurnsSinceLastTodo, nr2→TODO_REMINDER_CONSTANTS, Cb→readTodosFromFile, q0→getSessionId
```

### 6.3 Reminder Constants

```javascript
// ============================================
// TODO_REMINDER_CONSTANTS - Reminder timing configuration
// Location: chunks.132.mjs:327-330
// ============================================

// ORIGINAL (for source lookup):
nr2 = {
  TURNS_SINCE_WRITE: 10,
  TURNS_BETWEEN_REMINDERS: 10
}

// READABLE (for understanding):
TODO_REMINDER_CONSTANTS = {
  TURNS_SINCE_WRITE: 10,       // Remind after 10 turns without TodoWrite
  TURNS_BETWEEN_REMINDERS: 10  // Minimum 10 turns between reminders
}

// Mapping: nr2→TODO_REMINDER_CONSTANTS
```

**Key Insight - Threshold Change:**
In v2.0.59, the threshold was 7 turns. In v2.1.7, it's increased to **10 turns**, making reminders less frequent.

---

## 7. Attachment-to-Message Conversion

### 7.1 "todo" Type Attachment

```javascript
// ============================================
// convertTodoAttachment - Converts todo attachment to system message
// Location: chunks.148.mjs:66-76
// ============================================

// ORIGINAL (for source lookup):
case "todo":
  if (A.itemCount === 0) return q5([H0({
    content: `This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the ${Bm} tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.`,
    isMeta: !0
  })]);
  else return q5([H0({
    content: `Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:

${eA(A.content)}. Continue on with the tasks at hand if applicable.`,
    isMeta: !0
  })]);

// READABLE (for understanding):
case "todo":
  if (attachment.itemCount === 0) {
    // Empty todo list - gentle reminder
    return wrapInSystemReminder([createMetaBlock({
      content: `This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the TodoWrite tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.`,
      isMeta: true  // Hidden from user
    })]);
  } else {
    // Todo list has items - show current state
    return wrapInSystemReminder([createMetaBlock({
      content: `Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:

${JSON.stringify(attachment.content)}. Continue on with the tasks at hand if applicable.`,
      isMeta: true  // Hidden from user
    })]);
  }

// Mapping: A→attachment, q5→wrapInSystemReminder, H0→createMetaBlock, Bm→"TodoWrite", eA→JSON.stringify
```

### 7.2 "todo_reminder" Type Attachment

```javascript
// ============================================
// convertTodoReminderAttachment - Converts reminder attachment to system message
// Location: chunks.148.mjs:105-119
// ============================================

// ORIGINAL (for source lookup):
case "todo_reminder": {
  let B = A.content.map((Z, Y) => `${Y+1}. [${Z.status}] ${Z.content}`).join(`
`),
    G = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
  if (B.length > 0) G += `

Here are the existing contents of your todo list:

[${B}]`;
  return q5([H0({
    content: G,
    isMeta: !0
  })])
}

// READABLE (for understanding):
case "todo_reminder": {
  // Format todos as numbered list with status
  const formattedTodos = attachment.content
    .map((todo, index) => `${index+1}. [${todo.status}] ${todo.content}`)
    .join('\n');

  // Build reminder message
  let reminderMessage = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;

  // Append existing todos if any
  if (formattedTodos.length > 0) {
    reminderMessage += `

Here are the existing contents of your todo list:

[${formattedTodos}]`;
  }

  return wrapInSystemReminder([createMetaBlock({
    content: reminderMessage,
    isMeta: true  // Hidden from user
  })]);
}

// Mapping: A→attachment, q5→wrapInSystemReminder, H0→createMetaBlock
```

---

## 8. Agent Loop Integration

### 8.1 Attachment Generation Pipeline

```javascript
// ============================================
// generateAllAttachments - Registers todo_reminders in attachment pipeline
// Location: chunks.131.mjs:3134
// ============================================

// ORIGINAL (for source lookup):
K = [fJ("changed_files", () => m27(X)), fJ("nested_memory", () => d27(X)), fJ("ultra_claude_md", async () => v27(Z)), fJ("plan_mode", () => j27(Z, Q)), fJ("plan_mode_exit", () => T27(Q)), fJ("delegate_mode", () => P27(Q)), fJ("delegate_mode_exit", () => Promise.resolve(S27())), fJ("todo_reminders", () => t27(Z, Q)), ...[], fJ("collab_notification", async () => B97()), fJ("critical_system_reminder", () => Promise.resolve(x27(Q)))]

// READABLE (for understanding):
coreAttachments = [
  wrapWithErrorHandling("changed_files", () => generateChangedFilesAttachment(context)),
  wrapWithErrorHandling("nested_memory", () => generateNestedMemoryAttachment(context)),
  wrapWithErrorHandling("ultra_claude_md", async () => generateClaudeMdAttachment(messages)),
  wrapWithErrorHandling("plan_mode", () => generatePlanModeAttachment(messages, sessionContext)),
  wrapWithErrorHandling("plan_mode_exit", () => generatePlanModeExitAttachment(sessionContext)),
  wrapWithErrorHandling("delegate_mode", () => generateDelegateModeAttachment(sessionContext)),
  wrapWithErrorHandling("delegate_mode_exit", () => Promise.resolve(generateDelegateModeExitAttachment())),
  wrapWithErrorHandling("todo_reminders", () => generateTodoReminderAttachments(messages, sessionContext)),  // ← TODO REMINDERS
  ...[],
  wrapWithErrorHandling("collab_notification", async () => generateCollabNotificationAttachment()),
  wrapWithErrorHandling("critical_system_reminder", () => Promise.resolve(generateCriticalSystemReminderAttachment(sessionContext)))
]

// Mapping: K→coreAttachments, fJ→wrapWithErrorHandling, t27→generateTodoReminderAttachments,
//          Z→messages, Q→sessionContext, X→context
```

**Key Insight - Priority Group:**
Todo reminders are in the **Core attachment priority group** alongside:
- plan_mode
- plan_mode_exit
- delegate_mode
- delegate_mode_exit
- collab_notification
- critical_system_reminder

This ensures todos and plan mode attachments are generated together, enabling tight integration.

---

## 9. Todo Persistence

### 9.1 Directory and Path Functions

```javascript
// ============================================
// getTodosDirectory - Returns todos storage directory
// Location: chunks.86.mjs:888-892
// ============================================

// ORIGINAL (for source lookup):
function FY0() {
  let A = N71(zQ(), "todos");
  if (!vA().existsSync(A)) vA().mkdirSync(A);
  return A
}

// READABLE (for understanding):
function getTodosDirectory() {
  const todosDir = path.join(getClaudeDataDir(), "todos");  // ~/.claude/todos/
  if (!fs().existsSync(todosDir)) {
    fs().mkdirSync(todosDir);
  }
  return todosDir;
}

// Mapping: FY0→getTodosDirectory, N71→path.join, zQ→getClaudeDataDir, vA→fs
```

```javascript
// ============================================
// getTodoFilePath - Returns todo file path for agent
// Location: chunks.86.mjs:894-897
// ============================================

// ORIGINAL (for source lookup):
function Ir(A) {
  let Q = `${q0()}-agent-${A}.json`;
  return N71(FY0(), Q)
}

// READABLE (for understanding):
function getTodoFilePath(agentId) {
  const filename = `${getSessionId()}-agent-${agentId}.json`;
  return path.join(getTodosDirectory(), filename);
}

// Mapping: Ir→getTodoFilePath, A→agentId, q0→getSessionId, N71→path.join, FY0→getTodosDirectory
```

### 9.2 Read/Write Functions

```javascript
// ============================================
// readTodosFromFile - Reads todos from JSON file
// Location: chunks.86.mjs:899-901 + 927-937
// ============================================

// ORIGINAL (for source lookup):
function Cb(A) {
  return M12(Ir(A))
}

function M12(A) {
  if (!vA().existsSync(A)) return [];
  try {
    let Q = AQ(vA().readFileSync(A, {
      encoding: "utf-8"
    }));
    return jIA.parse(Q)
  } catch (Q) {
    return e(Q instanceof Error ? Q : Error(String(Q))), []
  }
}

// READABLE (for understanding):
function readTodosFromFile(agentId) {
  return readJsonFile(getTodoFilePath(agentId));
}

function readJsonFile(filePath) {
  if (!fs().existsSync(filePath)) return [];
  try {
    const content = JSON.parse(fs().readFileSync(filePath, { encoding: "utf-8" }));
    return todoArraySchema.parse(content);  // Validate with Zod schema
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
    return [];  // Return empty on error
  }
}

// Mapping: Cb→readTodosFromFile, M12→readJsonFile, Ir→getTodoFilePath, vA→fs, AQ→JSON.parse, jIA→todoArraySchema, e→logError
```

```javascript
// ============================================
// writeTodosToFile - Writes todos to JSON file
// Location: chunks.86.mjs:903-905 + 939-945
// ============================================

// ORIGINAL (for source lookup):
function d9A(A, Q) {
  R12(A, Ir(Q))
}

function R12(A, Q) {
  try {
    yR(Q, eA(A, null, 2))
  } catch (B) {
    e(B instanceof Error ? B : Error(String(B)))
  }
}

// READABLE (for understanding):
function writeTodosToFile(todos, agentId) {
  writeJsonFile(todos, getTodoFilePath(agentId));
}

function writeJsonFile(data, filePath) {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
  }
}

// Mapping: d9A→writeTodosToFile, R12→writeJsonFile, Ir→getTodoFilePath, yR→writeFileSync, eA→JSON.stringify, e→logError
```

---

## 10. UI Rendering

### 10.1 Todo List Component

```javascript
// ============================================
// TodoListComponent - Renders todo list in terminal
// Location: chunks.107.mjs:1804-1838
// ============================================

// ORIGINAL (for source lookup):
function Ns({
  todos: A,
  isStandalone: Q = !1
}) {
  if (A.length === 0) return null;
  let B = jX.createElement(jX.Fragment, null, A.map((G, Z) => {
    let Y = G.status === "completed" ? tA.checkboxOn : tA.checkboxOff;
    return jX.createElement(T, {
      key: Z
    }, jX.createElement(C, {
      dimColor: G.status === "completed"
    }, Y, " "), jX.createElement(C, {
      bold: G.status === "in_progress",
      dimColor: G.status === "completed",
      strikethrough: G.status === "completed"
    }, G.content))
  }));
  if (Q) return jX.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    marginLeft: 2
  }, jX.createElement(T, null, jX.createElement(C, {
    bold: !0,
    dimColor: !0
  }, "Todos"), jX.createElement(C, {
    dimColor: !0
  }, " · ", jX.createElement(F0, {
    shortcut: "ctrl+t",
    action: "hide todos",
    bold: !0
  }))), B);
  return jX.createElement(T, {
    flexDirection: "column"
  }, B)
}

// READABLE (for understanding):
function TodoListComponent({ todos, isStandalone = false }) {
  // Return nothing if no todos
  if (todos.length === 0) return null;

  // Render todo items
  const todoItems = React.createElement(React.Fragment, null,
    todos.map((todo, index) => {
      // Choose checkbox icon based on status
      const checkbox = todo.status === "completed" ? icons.checkboxOn : icons.checkboxOff;

      return React.createElement(Box, { key: index },
        // Checkbox icon
        React.createElement(Text, { dimColor: todo.status === "completed" }, checkbox, " "),
        // Todo content with styling
        React.createElement(Text, {
          bold: todo.status === "in_progress",      // Bold for in-progress
          dimColor: todo.status === "completed",    // Dim for completed
          strikethrough: todo.status === "completed" // Strikethrough for completed
        }, todo.content)
      );
    })
  );

  // Standalone mode: show header with keyboard shortcut
  if (isStandalone) {
    return React.createElement(Box, {
      flexDirection: "column",
      marginTop: 1,
      marginLeft: 2
    },
      React.createElement(Box, null,
        React.createElement(Text, { bold: true, dimColor: true }, "Todos"),
        React.createElement(Text, { dimColor: true }, " · ",
          React.createElement(KeyboardShortcut, {
            shortcut: "ctrl+t",
            action: "hide todos",
            bold: true
          })
        )
      ),
      todoItems
    );
  }

  // Inline mode: just render items
  return React.createElement(Box, { flexDirection: "column" }, todoItems);
}

// Mapping: Ns→TodoListComponent, A→todos, Q→isStandalone, jX→React, T→Box, C→Text, tA→icons, F0→KeyboardShortcut
```

### 10.2 Status Icon Function

```javascript
// ============================================
// getStatusIcon - Returns icon and color for task status
// Location: chunks.107.mjs:1857-1872
// ============================================

// ORIGINAL (for source lookup):
function Yx5(A) {
  switch (A) {
    case "completed":
      return {
        icon: tA.tick, color: "success"
      };
    case "in_progress":
      return {
        icon: tA.squareSmallFilled, color: "claude"
      };
    case "pending":
      return {
        icon: tA.squareSmall, color: void 0
      }
  }
}

// READABLE (for understanding):
function getStatusIcon(status) {
  switch (status) {
    case "completed":
      return { icon: icons.tick, color: "success" };        // ✓ green
    case "in_progress":
      return { icon: icons.squareSmallFilled, color: "claude" };  // ■ claude color
    case "pending":
      return { icon: icons.squareSmall, color: undefined }; // □ default color
  }
}

// Mapping: Yx5→getStatusIcon, A→status, tA→icons
```

### 10.3 Visual Styling Summary

| Status | Checkbox | Text Style | Color |
|--------|----------|------------|-------|
| `pending` | ☐ (empty) | Normal | Default |
| `in_progress` | ☐ (empty) | **Bold** | Default |
| `completed` | ☑ (checked) | ~~Strikethrough~~ | Dimmed |

---

## 11. Tasks v2 System (New in 2.1.x)

Claude Code v2.1.x introduces a new "Tasks v2" system that provides enhanced task tracking with additional features like blocking dependencies. However, this feature is **currently disabled** via a feature flag.

### 11.1 Feature Gate

```javascript
// ============================================
// isTasksV2Enabled - Feature gate for Tasks v2 (always returns false)
// Location: chunks.59.mjs:242-244
// ============================================

// ORIGINAL (for source lookup):
function Gm() {
  return !1
}

// READABLE (for understanding):
function isTasksV2Enabled() {
  return false;  // Tasks v2 is currently disabled
}

// Mapping: Gm→isTasksV2Enabled
```

**Key Insight:** The TodoWrite tool's `isEnabled()` returns `!isTasksV2Enabled()`, meaning:
- When Tasks v2 is disabled (current state): TodoWrite is **enabled**
- When Tasks v2 is enabled (future): TodoWrite would be **disabled** (replaced by Tasks v2)

### 11.2 Task List ID

```javascript
// ============================================
// getTaskListId - Returns the task list identifier
// Location: chunks.59.mjs:269-271
// ============================================

// ORIGINAL (for source lookup):
function PIA() {
  return process.env.CLAUDE_CODE_TASK_LIST_ID || UCB() || q0()
}

// READABLE (for understanding):
function getTaskListId() {
  // Priority: env var > custom ID > session ID
  return process.env.CLAUDE_CODE_TASK_LIST_ID || getCustomTaskListId() || getSessionId();
}

// Mapping: PIA→getTaskListId, UCB→getCustomTaskListId, q0→getSessionId
```

### 11.3 Read Tasks from File

```javascript
// ============================================
// readTasksFromFile - Reads Tasks v2 data from file
// Location: chunks.59.mjs:336-352
// ============================================

// ORIGINAL (for source lookup):
function RBA(A) {
  let Q = La(A);
  if (!TIA(Q)) return [];
  try {
    let B = vA().readFileSync(Q, {
      encoding: "utf-8"
    });
    return jX8.parse(AQ(B)).tasks ?? []
  } catch (B) {
    return e(B instanceof Error ? B : Error(String(B))), []
  }
}

// READABLE (for understanding):
function readTasksFromFile(taskListId) {
  const filePath = getTaskListFilePath(taskListId);
  if (!fileExists(filePath)) return [];
  try {
    const content = fs().readFileSync(filePath, { encoding: "utf-8" });
    return taskListSchema.parse(JSON.parse(content)).tasks ?? [];
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
    return [];
  }
}

// Mapping: RBA→readTasksFromFile, A→taskListId, La→getTaskListFilePath, TIA→fileExists, vA→fs, jX8→taskListSchema, AQ→JSON.parse, e→logError
```

### 11.4 Migration Function

```javascript
// ============================================
// migrateTodosToV2 - Migrates v1 todos to Tasks v2 format
// Location: chunks.86.mjs:947-968
// ============================================

// ORIGINAL (for source lookup):
function HY0() {
  if (!Gm()) return;
  let A = q0(),
    Q = PIA(),
    B = RBA(Q);
  if (B.length > 0) {
    k(`[Todo Migration] Skipping migration - ${B.length} tasks already exist`);
    return
  }
  let G = Cb(A);
  if (G.length === 0) return;
  k(`[Todo Migration] Migrating ${G.length} todos to v2`);
  for (let Z of G) _CB(Q, {
    subject: Z.content,
    description: "",
    activeForm: Z.activeForm,
    status: Z.status,
    blocks: [],
    blockedBy: []
  });
  d9A([], A), k(`[Todo Migration] Successfully migrated ${G.length} todos to v2`)
}

// READABLE (for understanding):
function migrateTodosToV2() {
  // Only migrate if Tasks v2 is enabled
  if (!isTasksV2Enabled()) return;

  const sessionId = getSessionId();
  const taskListId = getTaskListId();
  const existingTasks = readTasksFromFile(taskListId);

  // Skip if tasks already exist
  if (existingTasks.length > 0) {
    log(`[Todo Migration] Skipping migration - ${existingTasks.length} tasks already exist`);
    return;
  }

  const oldTodos = readTodosFromFile(sessionId);
  if (oldTodos.length === 0) return;

  log(`[Todo Migration] Migrating ${oldTodos.length} todos to v2`);

  // Migrate each todo to Tasks v2 format
  for (const todo of oldTodos) {
    createTask(taskListId, {
      subject: todo.content,
      description: "",
      activeForm: todo.activeForm,
      status: todo.status,
      blocks: [],      // New: blocking relationships
      blockedBy: []    // New: blocked-by relationships
    });
  }

  // Clear old todos after successful migration
  writeTodosToFile([], sessionId);
  log(`[Todo Migration] Successfully migrated ${oldTodos.length} todos to v2`);
}

// Mapping: HY0→migrateTodosToV2, Gm→isTasksV2Enabled, q0→getSessionId, PIA→getTaskListId,
//          RBA→readTasksFromFile, Cb→readTodosFromFile, _CB→createTask, d9A→writeTodosToFile, k→log
```

### 11.5 Tasks v2 Enhanced Schema

The Tasks v2 system extends the todo item with additional fields:

| Field | Type | Description |
|-------|------|-------------|
| `subject` | string | Task title (maps from `content`) |
| `description` | string | Extended description |
| `activeForm` | string | Present continuous form |
| `status` | enum | pending/in_progress/completed |
| `blocks` | string[] | **NEW:** IDs of tasks this blocks |
| `blockedBy` | string[] | **NEW:** IDs of tasks blocking this |

---

## 12. Plan Mode Interaction

### 12.1 Core Attachment Priority Group

Both TodoWrite reminders and Plan Mode attachments are in the **Core attachment priority group**:

```javascript
// Location: chunks.131.mjs:3134
coreAttachments = [
  // ...
  wrapWithErrorHandling("plan_mode", () => generatePlanModeAttachment(...)),
  wrapWithErrorHandling("plan_mode_exit", () => generatePlanModeExitAttachment(...)),
  // ...
  wrapWithErrorHandling("todo_reminders", () => generateTodoReminderAttachments(...)),
  // ...
]
```

This ensures:
1. Plan mode instructions and todo reminders are generated in the same pass
2. Both are present in system context simultaneously
3. Cross-references between plan and todos work correctly

### 12.2 Plan Mode Exit Recommendation

When exiting plan mode, the system explicitly recommends updating the todo list:

```javascript
// Location: chunks.143.mjs:450 (Plan mode exit tool result)
"User has approved your plan. Start with updating your todo list if applicable"
```

This creates a workflow:
1. **Plan Mode**: Design and document implementation approach
2. **Exit Plan Mode**: Get user approval
3. **TodoWrite**: Break down plan into actionable todos
4. **Execute**: Work through todos one by one

### 12.3 TodoWrite Always Enabled

Unlike some tools that are disabled in plan mode (Edit, Write), TodoWrite remains **always enabled**:

```javascript
// chunks.59.mjs:434-436
isEnabled() {
  return !Gm()  // Gm() returns false, so TodoWrite is always enabled
}
```

However, in practice:
- During plan mode, the assistant focuses on research and planning
- Todos are typically created **after** exiting plan mode
- The plan provides the structure, todos provide the tracking

---

## 13. Post-Compact Todo Restore

When message compaction occurs, todos are preserved and restored to ensure continuity.

### 13.1 Post-Compact Attachment Generation

```javascript
// ============================================
// createTodoAttachment - Restores todos after compaction
// Location: chunks.132.mjs:677-686
// ============================================

// ORIGINAL (for source lookup):
function z97(A) {
  let Q = Cb(A);
  if (!Q || Q.length === 0) return null;
  return X4({
    type: "todo",
    content: Q,
    itemCount: Q.length
  })
}

// READABLE (for understanding):
function createTodoAttachment(agentId) {
  const currentTodos = readTodosFromFile(agentId);
  if (!currentTodos || currentTodos.length === 0) return null;

  return wrapAttachmentToMessage({
    type: "todo",
    content: currentTodos,
    itemCount: currentTodos.length
  });
}

// Mapping: z97→createTodoAttachment, A→agentId, Cb→readTodosFromFile, X4→wrapAttachmentToMessage
```

### 13.2 Compact Flow Integration

The `z97` function is called during the post-compact attachment generation phase to ensure todos are included in the compacted conversation context.

---

## 14. Key Insights

### 14.1 Trigger Mechanism Summary

| Trigger Source | Location | When Triggered |
|----------------|----------|----------------|
| System Prompt | chunks.146.mjs:2497-2541 | Every API call |
| System Prompt Footer | chunks.146.mjs:2587-2588 | Every API call |
| Tool Prompt | chunks.59.mjs:4-186 | When tool definition requested |
| Auto-Reminder | chunks.132.mjs:117-133 | After 10 turns inactivity |
| Tool Result | chunks.59.mjs:477-479 | After each TodoWrite call |

### 14.2 Persistence Guarantees

- **File Format:** JSON with Zod schema validation
- **Location:** `~/.claude/todos/{sessionId}-agent-{agentId}.json`
- **Error Handling:** Returns empty array on read errors
- **Compaction Survival:** Todos restored via `createTodoAttachment`

### 14.3 TodoRead Methods

There is no explicit "TodoRead" tool. Instead, todos are read through:

1. **"todo" attachment** - Triggered on todo state changes
2. **"todo_reminder" attachment** - Triggered after 10+ turns of inactivity
3. **Post-compaction restore** - Via `createTodoAttachment` function
4. **`/todos` slash command** - For user visibility (UI only)

### 14.4 UI Integration

| Component | Location | Function |
|-----------|----------|----------|
| TodoListComponent | chunks.107.mjs:1804-1838 | Renders todo list |
| getStatusIcon | chunks.107.mjs:1857-1872 | Status → icon/color |
| Ctrl+T Toggle | chunks.107.mjs | Show/hide expanded todos |
| Spinner activeForm | - | Shows current in_progress task |

### 14.5 System Reminder Behavior

- **Frequency:** Every 10 turns without TodoWrite usage
- **Cooldown:** Minimum 10 turns between reminders
- **Visibility:** Hidden from user (`isMeta: true`)
- **Content:** Gentle suggestion + current todo list

---

## 15. Version Changes from 2.0.59

| Aspect | v2.0.59 | v2.1.7 |
|--------|---------|--------|
| Reminder threshold | 7 turns | **10 turns** |
| Tool name symbol | `BY` | `Bm` |
| Tasks v2 system | Not present | Added (disabled) |
| Migration support | No | Yes (`migrateTodosToV2`) |

---

## 16. Symbol Reference

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Bm | TODOWRITE_TOOL_NAME | chunks.59.mjs:224 | constant |
| vD | TodoWriteTool | chunks.59.mjs:402-481 | object |
| KCB | todoWriteToolPrompt | chunks.59.mjs:4-186 | constant |
| NX8 | todoStatusEnum | chunks.59.mjs:197 | enum |
| wX8 | todoItemSchema | chunks.59.mjs:197-201 | object |
| jIA | todoArraySchema | chunks.59.mjs:201 | array |
| SX8 | todoWriteInputSchema | chunks.59.mjs:397-398 | object |
| xX8 | todoWriteOutputSchema | chunks.59.mjs:399-401 | object |
| Gm | isTasksV2Enabled | chunks.59.mjs:242-244 | function |
| s27 | countTurnsSinceLastTodo | chunks.132.mjs:96-115 | function |
| t27 | generateTodoReminderAttachments | chunks.132.mjs:117-133 | function |
| nr2 | TODO_REMINDER_CONSTANTS | chunks.132.mjs:327-330 | object |
| Ns | TodoListComponent | chunks.107.mjs:1804-1838 | function |
| Yx5 | getStatusIcon | chunks.107.mjs:1857-1872 | function |
| FY0 | getTodosDirectory | chunks.86.mjs:888-892 | function |
| Ir | getTodoFilePath | chunks.86.mjs:894-897 | function |
| Cb | readTodosFromFile | chunks.86.mjs:899-901 | function |
| d9A | writeTodosToFile | chunks.86.mjs:903-905 | function |
| M12 | readJsonFile | chunks.86.mjs:927-937 | function |
| R12 | writeJsonFile | chunks.86.mjs:939-945 | function |
| HY0 | migrateTodosToV2 | chunks.86.mjs:947-968 | function |
| PIA | getTaskListId | chunks.59.mjs:269-271 | function |
| RBA | readTasksFromFile | chunks.59.mjs:336-352 | function |
| _CB | createTask | chunks.59.mjs:312-333 | function |
| z97 | createTodoAttachment | chunks.132.mjs:677-686 | function |
| E97 | restoreRecentFilesAfterCompact | chunks.132.mjs:654-675 | function |
| xL0 | createPlanFileReferenceAttachment | chunks.132.mjs:688-697 | function |
| $97 | createInvokedSkillsAttachment | chunks.132.mjs:699-711 | function |
| C97 | createTaskStatusAttachments | chunks.132.mjs:713-730 | function |
| U97 | shouldExcludeFileFromRestore | chunks.132.mjs:732-747 | function |
| Y97 | countUserMessagesSincePlanModeExit | chunks.132.mjs:264-272 | function |
| r77 | processUserInputQuery | chunks.134.mjs:2636-2664 | function |

---

## 17. Main Agent Loop Integration (Detailed)

This section documents how TodoWrite integrates with the main agent execution loop.

### 17.1 Todos Passed to Query Processor

```javascript
// ============================================
// processUserInputQuery - Main query processing with todos
// Location: chunks.134.mjs:2640-2642
// ============================================

// ORIGINAL (for source lookup):
let z = await Z.getAppState(),
  $ = await r77(A, Q, B, G, Z, Y, J, X, D, W, K, V, F, z.todos[Z.agentId ?? q0()], H);

// READABLE (for understanding):
const appState = await sessionContext.getAppState();
const queryResult = await processUserInputQuery(
  input,                           // A - user input
  inputType,                       // Q - type ("prompt", etc.)
  messages,                        // B - message history
  ...otherParams,
  appState.todos[sessionContext.agentId ?? getSessionId()],  // H - current todos
  canUseTool                       // permission check function
);

// Mapping: z→appState, r77→processUserInputQuery, Z→sessionContext, q0→getSessionId
```

**Key Insight:** Todos for the current agent are passed directly to the query processor, making them available during user input processing.

### 17.2 State Change Hook for Persistence

```javascript
// ============================================
// AppState Change Listener - Triggers todo persistence
// Location: chunks.155.mjs:2274-2275
// ============================================

// ORIGINAL (for source lookup):
if (Q !== null && A.todos !== Q.todos)
  for (let B in A.todos) d9A(A.todos[B], B);

// READABLE (for understanding):
// When appState changes, check if todos changed
if (previousState !== null && newState.todos !== previousState.todos) {
  // Persist todos for each agent that has changes
  for (const agentId in newState.todos) {
    writeTodosToFile(newState.todos[agentId], agentId);
  }
}

// Mapping: Q→previousState, A→newState, d9A→writeTodosToFile, B→agentId
```

**Key Insight:** This ensures todos are persisted to disk whenever they change in appState, without explicit save calls.

### 17.3 Complete Tool Call Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       TodoWrite Tool Call Flow                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  1. LLM generates tool_use block with name="TodoWrite"                          │
│     ↓                                                                           │
│  2. Tool executor receives call: { todos: [...] }                               │
│     ↓                                                                           │
│  3. TodoWriteTool.call() executes (chunks.59.mjs:454-473):                      │
│     a. Get current appState: await context.getAppState()                        │
│     b. Get agentId: context.agentId ?? getSessionId()                           │
│     c. Get old todos: appState.todos[agentId] ?? []                             │
│     d. Auto-cleanup: if all completed → set to []                               │
│     e. Update state: context.setAppState(...)                                   │
│     ↓                                                                           │
│  4. setAppState triggers state change listener (chunks.155.mjs:2274-2275):      │
│     a. Detect todos changed: A.todos !== Q.todos                                │
│     b. For each agentId: d9A(todos, agentId)                                    │
│     ↓                                                                           │
│  5. d9A() persists to file (chunks.86.mjs:903-905):                             │
│     → ~/.claude/todos/${sessionId}-agent-${agentId}.json                        │
│     ↓                                                                           │
│  6. React re-renders UI with new todos                                          │
│     ↓                                                                           │
│  7. Tool result returned to LLM:                                                │
│     "Todos have been modified successfully..."                                  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 18. Subagent Todo Handling

Each subagent maintains its own isolated todo list, enabling parallel task tracking.

### 18.1 Per-AgentId Isolation

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        AppState.todos Structure                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  appState.todos = {                                                             │
│    "main-session-id": [                  // Main agent todos                    │
│      { content: "Task 1", status: "completed", activeForm: "..." },             │
│      { content: "Task 2", status: "in_progress", activeForm: "..." }            │
│    ],                                                                           │
│    "subagent-explore-abc123": [          // Explore subagent todos              │
│      { content: "Search codebase", status: "completed", activeForm: "..." }     │
│    ],                                                                           │
│    "subagent-plan-def456": [             // Plan subagent todos                 │
│      { content: "Design approach", status: "in_progress", activeForm: "..." }   │
│    ]                                                                            │
│  }                                                                              │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 18.2 File Storage Pattern

```
~/.claude/todos/
├── abc123xyz-agent-abc123xyz.json           # Main agent (sessionId = agentId)
├── abc123xyz-agent-subagent-explore-1.json  # Explore subagent
├── abc123xyz-agent-subagent-plan-2.json     # Plan subagent
└── abc123xyz-agent-subagent-bash-3.json     # Bash subagent
```

**Filename Format:** `${sessionId}-agent-${agentId}.json`

### 18.3 Subagent UI Rendering

```javascript
// ============================================
// AgentCard Todo Display - Shows todos per agent
// Location: chunks.143.mjs:236
// ============================================

// ORIGINAL (for source lookup):
let [Y] = a0(), J = Y.todos[A.agentId] ?? [], X = J.filter((z) => z.status === "completed").length

// READABLE (for understanding):
const [appState] = useAppState();
const agentTodos = appState.todos[agent.agentId] ?? [];
const completedCount = agentTodos.filter(t => t.status === "completed").length;

// Display: "Tasks (3/5)" showing completed/total

// Mapping: Y→appState, a0→useAppState, A.agentId→agent.agentId, J→agentTodos, X→completedCount
```

### 18.4 Subagent Todo Reminders

Todo reminders are generated per-agent based on that agent's message history:

```javascript
// chunks.132.mjs:125
let Z = Cb(Q.agentId ?? q0());  // Load todos for THIS agent

// chunks.132.mjs:117-118
if (!Q.options.tools.some((Z) => Z.name === Bm)) return [];  // Check tool availability
```

**Key Insight:** Each subagent gets its own reminder cycle based on its own turn count.

---

## 19. Complete Post-Compact Restoration Flow

When message compaction occurs, multiple context elements are restored, including todos.

### 19.1 Compaction Restoration Order

```javascript
// ============================================
// fullCompact - Post-compact attachment generation
// Location: chunks.132.mjs:537-542
// ============================================

// ORIGINAL (for source lookup):
let [z, $] = await Promise.all([E97(E, Q, I97), C97(Q)]), O = [...z, ...$], L = z97(Q.agentId ?? q0());
if (L) O.push(L);
let M = xL0(Q.agentId);
if (M) O.push(M);
let _ = $97();
if (_) O.push(_);

// READABLE (for understanding):
// 1. Restore recent files + task status attachments (parallel)
const [recentFiles, taskStatuses] = await Promise.all([
  restoreRecentFilesAfterCompact(readFileState, context, MAX_FILES_TO_RESTORE),  // E97
  createTaskStatusAttachments(context)                                            // C97
]);

let attachments = [...recentFiles, ...taskStatuses];

// 2. Restore todos
const todoAttachment = createTodoAttachment(context.agentId ?? getSessionId());  // z97
if (todoAttachment) attachments.push(todoAttachment);

// 3. Restore plan file reference
const planAttachment = createPlanFileReferenceAttachment(context.agentId);  // xL0
if (planAttachment) attachments.push(planAttachment);

// 4. Restore invoked skills
const skillsAttachment = createInvokedSkillsAttachment();  // $97
if (skillsAttachment) attachments.push(skillsAttachment);

// Mapping: E97→restoreRecentFilesAfterCompact, C97→createTaskStatusAttachments, z97→createTodoAttachment,
//          xL0→createPlanFileReferenceAttachment, $97→createInvokedSkillsAttachment
```

### 19.2 Todo Attachment with Post-Compact Context

```javascript
// ============================================
// createTodoAttachment - Restores todos with context marker
// Location: chunks.132.mjs:677-686
// ============================================

// ORIGINAL (for source lookup):
function z97(A) {
  let Q = Cb(A);
  if (Q.length === 0) return null;
  return X4({
    type: "todo",
    content: Q,
    itemCount: Q.length,
    context: "post-compact"  // ← Marks as post-compaction restore
  })
}

// READABLE (for understanding):
function createTodoAttachment(agentId) {
  const currentTodos = readTodosFromFile(agentId);
  if (currentTodos.length === 0) return null;

  return wrapAttachmentToMessage({
    type: "todo",
    content: currentTodos,
    itemCount: currentTodos.length,
    context: "post-compact"  // Signal that this is a restoration
  });
}

// Mapping: z97→createTodoAttachment, Cb→readTodosFromFile, X4→wrapAttachmentToMessage
```

### 19.3 File Exclusion from Restore

The todo file itself is excluded from file restoration to prevent duplication:

```javascript
// ============================================
// shouldExcludeFileFromRestore - Excludes todo and plan files
// Location: chunks.132.mjs:732-747
// ============================================

// ORIGINAL (for source lookup):
function U97(A, Q) {
  let B = Yr(A);
  try {
    let G = Q ?? q0(),
      Z = Yr(Ir(G));  // Get todo file path
    if (B === Z) return !0  // Exclude if it's the todo file
  } catch {}
  try {
    let G = Yr(dC(Q));  // Get plan file path
    if (B === G) return !0  // Exclude if it's the plan file
  } catch {}
  // ... more exclusions
  return !1
}

// READABLE (for understanding):
function shouldExcludeFileFromRestore(filename, agentId) {
  const normalizedPath = normalizePath(filename);

  // Exclude todo file
  const todoFilePath = normalizePath(getTodoFilePath(agentId ?? getSessionId()));
  if (normalizedPath === todoFilePath) return true;

  // Exclude plan file
  const planFilePath = normalizePath(getPlanFilePath(agentId));
  if (normalizedPath === planFilePath) return true;

  // ... more exclusions for memory files
  return false;
}

// Mapping: U97→shouldExcludeFileFromRestore, Yr→normalizePath, Ir→getTodoFilePath, dC→getPlanFilePath
```

---

## 20. Enhanced Plan Mode Interaction

### 20.1 TodoWrite Availability in Plan Mode

**Important:** TodoWrite is NOT explicitly disabled during plan mode. The tool remains available, but the workflow naturally defers todo creation until after planning.

```javascript
// chunks.59.mjs:434-436
isEnabled() {
  return !Gm()  // Gm() always returns false → TodoWrite always enabled
}
```

### 20.2 Plan Approval → Todo Update Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       Plan Mode → Todo Update Flow                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  1. User enters plan mode (EnterPlanMode tool)                                  │
│     ↓                                                                           │
│  2. Agent explores codebase, designs approach                                   │
│     • TodoWrite available but typically not used (focus on planning)            │
│     ↓                                                                           │
│  3. Agent writes plan to file, calls ExitPlanMode                               │
│     ↓                                                                           │
│  4. System generates exit message (chunks.119.mjs:2595):                        │
│     "User has approved your plan. You can now start coding.                     │
│      Start with updating your todo list if applicable"  ← EXPLICIT GUIDANCE    │
│     ↓                                                                           │
│  5. plan_mode_exit attachment injected (chunks.148.mjs:198-205):                │
│     "You have exited plan mode. You can now make edits..."                      │
│     ↓                                                                           │
│  6. Agent creates todos based on plan (typically first action)                  │
│     ↓                                                                           │
│  7. Todo reminder cycle resumes (10 turn threshold)                             │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 20.3 Plan Mode Exit Detection

```javascript
// ============================================
// countUserMessagesSincePlanModeExit - Tracks turns since plan exit
// Location: chunks.132.mjs:264-272
// ============================================

// ORIGINAL (for source lookup):
function Y97(A) {
  let Q = 0;
  for (let B = A.length - 1; B >= 0; B--) {
    let G = A[B];
    if (G?.type === "user" && !(("isMeta" in G) && G.isMeta)) Q++;
    if (G?.type === "attachment" && G.attachment.type === "plan_mode_exit") return Q
  }
  return 0
}

// READABLE (for understanding):
function countUserMessagesSincePlanModeExit(messages) {
  let userMessageCount = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];

    // Count non-meta user messages
    if (message?.type === "user" && !("isMeta" in message && message.isMeta)) {
      userMessageCount++;
    }

    // Stop at plan_mode_exit attachment
    if (message?.type === "attachment" && message.attachment.type === "plan_mode_exit") {
      return userMessageCount;
    }
  }

  return 0;  // No plan_mode_exit found
}

// Mapping: Y97→countUserMessagesSincePlanModeExit, A→messages
```

### 20.4 Separate Throttling Systems

Plan mode and todo reminders have **independent throttling**:

| System | Constant | Value | Purpose |
|--------|----------|-------|---------|
| Plan Mode | `ar2.TURNS_BETWEEN_ATTACHMENTS` | 5 | Space between plan reminders |
| Todo Reminder | `nr2.TURNS_SINCE_WRITE` | 10 | Turns without TodoWrite |
| Todo Reminder | `nr2.TURNS_BETWEEN_REMINDERS` | 10 | Space between todo reminders |

### 20.5 Attachment Generation Order

Both plan_mode and todo_reminders are in the **Core attachment group** (chunks.131.mjs:3134):

```javascript
K = [
  fJ("changed_files", () => m27(X)),
  fJ("nested_memory", () => d27(X)),
  fJ("ultra_claude_md", async () => v27(Z)),
  fJ("plan_mode", () => j27(Z, Q)),            // Plan mode attachment
  fJ("plan_mode_exit", () => T27(Q)),          // Plan mode exit attachment
  fJ("delegate_mode", () => P27(Q)),
  fJ("delegate_mode_exit", () => Promise.resolve(S27())),
  fJ("todo_reminders", () => t27(Z, Q)),       // Todo reminders attachment
  fJ("collab_notification", async () => B97()),
  fJ("critical_system_reminder", () => Promise.resolve(x27(Q)))
]
```

**Key Insight:** All core attachments are computed in parallel, but independently. Plan mode status does NOT affect todo reminder generation - they coexist.

---

## 21. Data Flow Diagrams

### 21.1 TodoWrite Tool Execution Flow

```
User Input → LLM generates tool_use
                    ↓
            ┌───────────────────┐
            │  Tool Executor    │
            │  (parallel safe)  │
            └─────────┬─────────┘
                      ↓
            ┌───────────────────┐
            │  TodoWriteTool    │
            │  .call()          │
            └─────────┬─────────┘
                      ↓
         ┌────────────┼────────────┐
         ↓            ↓            ↓
┌─────────────┐ ┌───────────┐ ┌─────────────┐
│ getAppState │ │  agentId  │ │  Auto-clean │
│   .todos    │ │ fallback  │ │ if all done │
└──────┬──────┘ └─────┬─────┘ └──────┬──────┘
       └──────────────┼──────────────┘
                      ↓
            ┌───────────────────┐
            │  setAppState()    │
            │  todos[agentId]   │
            └─────────┬─────────┘
                      ↓
         ┌────────────┼────────────┐
         ↓            ↓            ↓
┌─────────────┐ ┌───────────┐ ┌─────────────┐
│ State Hook  │ │ UI Update │ │ Tool Result │
│ → Persist   │ │ (React)   │ │ → LLM       │
└─────────────┘ └───────────┘ └─────────────┘
```

### 21.2 System Reminder Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          System Reminder Flow                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Turn N begins                                                                  │
│       ↓                                                                         │
│  generateAllAttachments() called (chunks.131.mjs:3121)                          │
│       ↓                                                                         │
│  fJ("todo_reminders", () => t27(messages, context)) called                      │
│       ↓                                                                         │
│  t27() checks (chunks.132.mjs:117-133):                                         │
│   1. Is TodoWrite tool available? → No? Return []                               │
│   2. Has any message history? → No? Return []                                   │
│   3. Call s27() to count turns                                                  │
│       ↓                                                                         │
│  s27() scans messages backward (chunks.132.mjs:96-115):                         │
│   - Find last TodoWrite tool_use → count turns since                            │
│   - Find last todo_reminder attachment → count turns since                      │
│       ↓                                                                         │
│  Check thresholds:                                                              │
│   - turnsSinceLastTodoWrite >= 10? AND                                          │
│   - turnsSinceLastReminder >= 10?                                               │
│       ↓ YES                              ↓ NO                                   │
│  Load todos: Cb(agentId)            Return []                                   │
│       ↓                                                                         │
│  Return [{ type: "todo_reminder", content: todos, itemCount }]                  │
│       ↓                                                                         │
│  Attachment converted to system message (chunks.148.mjs:105-119)                │
│       ↓                                                                         │
│  Message injected with isMeta: true (hidden from user)                          │
│       ↓                                                                         │
│  LLM receives reminder: "The TodoWrite tool hasn't been used recently..."       │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 22. Additional Symbol Reference

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| r77 | processUserInputQuery | chunks.134.mjs:2636-2664 | function |
| E97 | restoreRecentFilesAfterCompact | chunks.132.mjs:654-675 | function |
| C97 | createTaskStatusAttachments | chunks.132.mjs:713-730 | function |
| U97 | shouldExcludeFileFromRestore | chunks.132.mjs:732-747 | function |
| xL0 | createPlanFileReferenceAttachment | chunks.132.mjs:688-697 | function |
| $97 | createInvokedSkillsAttachment | chunks.132.mjs:699-711 | function |
| Y97 | countUserMessagesSincePlanModeExit | chunks.132.mjs:264-272 | function |
| ar2 | PLAN_MODE_CONSTANTS | chunks.132.mjs:330-333 | object |
| I97 | MAX_FILES_TO_RESTORE | chunks.132.mjs:749 | constant (5) |
| D97 | TOTAL_TOKEN_BUDGET_FOR_RESTORE | chunks.132.mjs:TBD | constant (50000) |
| W97 | MAX_TOKENS_PER_FILE | chunks.132.mjs:TBD | constant (5000) |
| fe8 | migrateLegacyTodos | chunks.86.mjs:915-925 | function |
| wCB | addTodoStateListener | chunks.59.mjs:232-234 | function |
| LCB | notifyTodoStateListeners | chunks.59.mjs:236-240 | function |
| OCB | clearCompletedTasksAfterDelay | chunks.107.mjs:1931 | function |
