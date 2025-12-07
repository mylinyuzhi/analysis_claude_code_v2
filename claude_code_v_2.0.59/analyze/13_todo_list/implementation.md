# Todo List Implementation - Comprehensive Analysis

## Executive Summary

The TodoWrite tool provides a structured task tracking system for Claude Code sessions. It enables the assistant to break down complex tasks, track progress, and demonstrate thoroughness to users. This document provides an in-depth analysis of the implementation, including trigger mechanisms, persistence, UI rendering, and system reminders.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           TodoWrite Tool Architecture                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TRIGGER LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────┐   ┌─────────────────────────────────────────┐ │
│  │ System Prompt Integration   │   │        Tool Prompt (nCB)                │ │
│  │ chunks.152.mjs:2342-2435    │   │        chunks.60.mjs:903-1086           │ │
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
│  │                     TodoWrite Tool (BY)                                  │   │
│  │                     chunks.60.mjs:1141-1211                              │   │
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
│ in chunks.70.mjs         │  │ {session}-agent-     │  │ via setAppState      │
│                          │  │ {agent}.json         │  │                      │
└──────────────────────────┘  └──────────────────────┘  └──────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              UI RENDERING LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────┐ │
│  │ Yn Component            │  │ OO2 Spinner             │  │ Ctrl+T Toggle   │ │
│  │ chunks.118.mjs:1036     │  │ chunks.118.mjs:1317     │  │ chunks.142.mjs  │ │
│  │                         │  │                         │  │ :2475           │ │
│  │ Renders todo list:      │  │ Shows activeForm:       │  │                 │ │
│  │ ☑ Completed (dim)       │  │ "Implementing..."       │  │ showExpandedTodos│ │
│  │ ☐ In Progress (bold)    │  │ "Running tests..."      │  │ state toggle    │ │
│  │ ☐ Pending               │  │                         │  │                 │ │
│  └─────────────────────────┘  └─────────────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM REMINDER LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ _H5 (generateTodoReminders) - chunks.107.mjs:2379-2394                  │   │
│  │                                                                          │   │
│  │ if (turnsSinceTodoWrite >= 7 && turnsSinceLastReminder >= 3) {          │   │
│  │   return [{ type: "todo_reminder", content: todos, itemCount }]         │   │
│  │ }                                                                        │   │
│  │                                                                          │   │
│  │ Converted to system message in chunks.154.mjs:88-102                    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## LLM Compliance Enforcement Mechanisms

This section analyzes how Claude Code ensures the LLM consistently uses TodoWrite and doesn't ignore task tracking. The system employs a **5-layer enforcement strategy** combining upfront guidance, runtime reminders, and feedback loops.

### Multi-Layer Enforcement Strategy

| Layer | Location | Mechanism | Strength |
|-------|----------|-----------|----------|
| System Prompt Core | chunks.152.mjs:2342-2387 | "VERY frequently", "EXTREMELY", "unacceptable" | CRITICAL |
| System Prompt Footer | chunks.152.mjs:2434-2435 | "IMPORTANT: Always use" | HIGH |
| Tool Prompt | chunks.60.mjs:903-1086 | 180+ lines of guidelines with examples | HIGH |
| Auto-Reminder | chunks.107.mjs:2379-2394 | After 7 turns inactivity | MEDIUM |
| Tool Result | chunks.60.mjs:1195-1203 | "Continue to use todo list" | LOW |

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

### Complete System Prompt - Task Management Section

**Location:** `chunks.152.mjs:2342-2435`

```javascript
// ============================================
// System Prompt - Task Management Section
// Location: chunks.152.mjs:2342-2435
// ============================================

// ORIGINAL (obfuscated template):
${W.has(BY.name) ? `# Task Management
You have access to the ${BY.name} tools to help you manage and plan tasks. Use these tools VERY frequently to ensure that you are tracking your tasks and giving the user visibility into your progress.
These tools are also EXTREMELY helpful for planning tasks, and for breaking down larger complex tasks into smaller steps. If you do not use this tool when planning, you may forget to do important tasks - and that is unacceptable.

It is critical that you mark todos as completed as soon as you are done with a task. Do not batch up multiple tasks before marking them as completed.

Examples:

<example>
user: Run the build and fix any type errors
assistant: I'm going to use the ${BY.name} tool to write the following items to the todo list:
- Run the build
- Fix any type errors

I'm now going to run the build using ${C9}.

Looks like I found 10 type errors. I'm going to use the ${BY.name} tool to write 10 items to the todo list.

marking the first todo as in_progress

Let me start working on the first item...

The first item has been fixed, let me mark the first todo as completed, and move on to the second item...
..
..
</example>
` : ""}

// ... at end of system prompt (line 2434-2435):
${W.has(BY.name) ? `
IMPORTANT: Always use the ${BY.name} tool to plan and track tasks throughout the conversation.` : ""}

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
...
IMPORTANT: Always use the TodoWrite tool to plan and track tasks throughout
the conversation.` : ""}

// Mapping: W→availableTools, BY.name→"TodoWrite", C9→BASH_TOOL_NAME
```

### Reminder Injection Pipeline

When TodoWrite hasn't been used recently, the system automatically injects reminder messages:

```
┌────────────────────────────────────────────────────────────────────┐
│                    REMINDER ENFORCEMENT PIPELINE                    │
└────────────────────────────────────────────────────────────────────┘

TURN N: User sends message
         │
         ▼
┌─────────────────────────────────────┐
│ Attachment Generation Pipeline      │
│ (chunks.107.mjs:1826)               │
│                                     │
│ attachmentGenerators = [            │
│   wrapWithErrorHandling(            │
│     "todo_reminders",               │
│     () => _H5(messages, context)    │ ◄── Todo reminder generator
│   ),                                │
│   ...                               │
│ ]                                   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│ _H5(messages, context)              │
│ generateTodoReminders               │
│                                     │
│ 1. Call SH5(messages) to count:     │
│    - turnsSinceLastTodoWrite        │
│    - turnsSinceLastReminder         │
│                                     │
│ 2. Check thresholds:                │
│    turns >= 7 && reminder >= 3      │
│                                     │
│ 3. If triggered:                    │
│    - Read todos: Nh(agentId)        │
│    - Return todo_reminder attachment│
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│ kb3(attachment)                     │
│ convertAttachmentToSystemMessage    │
│ (chunks.154.mjs:88-102)             │
│                                     │
│ case "todo_reminder":               │
│   Format todos as numbered list     │
│   Create message:                   │
│   "The TodoWrite tool hasn't been   │
│    used recently..."                │
│   Wrap with isMeta: true            │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│ Inject into LLM context             │
│                                     │
│ <system-reminder>                   │
│ The TodoWrite tool hasn't been      │
│ used recently. If you're working    │
│ on tasks that would benefit from    │
│ tracking progress, consider using   │
│ the TodoWrite tool...               │
│                                     │
│ Here are the existing contents:     │
│ 1. [in_progress] Task A             │
│ 2. [pending] Task B                 │
│ </system-reminder>                  │
│                                     │
│ Hidden from user (isMeta: true)     │
└─────────────────────────────────────┘
```

### Reminder Message Content

**Location:** `chunks.154.mjs:88-102`

```javascript
// ============================================
// Todo Reminder Message Generation
// Location: chunks.154.mjs:88-102
// ============================================

// ORIGINAL (obfuscated):
case "todo_reminder": {
  let B = A.content.map((Z, I) => `${I+1}. [${Z.status}] ${Z.content}`).join(`
`),
    G = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
  if (B.length > 0) G += `

Here are the existing contents of your todo list:

[${B}]`;
  return NG([R0({
    content: G,
    isMeta: !0
  })])
}

// READABLE:
case "todo_reminder": {
  let formattedTodos = attachment.content.map((todo, index) =>
    `${index+1}. [${todo.status}] ${todo.content}`
  ).join('\n');

  let reminderMessage = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user`;

  if (formattedTodos.length > 0) {
    reminderMessage += `\n\nHere are the existing contents of your todo list:\n\n[${formattedTodos}]`;
  }

  return wrapInSystemReminder([createMetaBlock({
    content: reminderMessage,
    isMeta: true
  })])
}

// Mapping: A→attachment, B→formattedTodos, G→reminderMessage, NG→wrapInSystemReminder, R0→createMetaBlock, !0→true
```

### Contexts Where TodoWrite is Explicitly Disabled

In certain high-stakes operations, TodoWrite is explicitly prohibited to prevent interference:

**Location:** `chunks.71.mjs:827, 870`

```javascript
// During git commits (line 827):
"- NEVER use the ${BY.name} or ${A6} tools"

// During PR creation (line 870):
"- DO NOT use the ${BY.name} or ${A6} tools"

// Mapping: BY.name→"TodoWrite", A6→TASK_TOOL_NAME
```

This prevents the LLM from creating todos when it should focus on the atomic git/PR operation.

---

## Todo and Plan Mode Relationship

TodoWrite and Plan Mode serve complementary but distinct purposes in Claude Code's workflow.

### Key Distinction: isReadOnly Property

| Tool | isReadOnly | Implication |
|------|------------|-------------|
| TodoWrite | `false` | Modifies app state → **DISABLED in plan mode** |
| EnterPlanMode | `true` | Read-only → Allowed |
| ExitPlanMode | `false` | Writes plan → Requires user approval |

**Critical:** TodoWrite is automatically disabled in plan mode because it has `isReadOnly: false`.

### Plan Mode System Prompt

**Location:** `chunks.153.mjs:2890-2963`

```javascript
// ============================================
// Plan Mode System Prompt
// Location: chunks.153.mjs:2890-2963 (Sb3 function)
// ============================================

// ORIGINAL (obfuscated):
function Sb3(A) {
  let Z = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.`
  // ...
}

// READABLE:
function generateMainAgentPlanMode(config) {
  let planModeInstructions = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.`
  // ...
}

// Key phrase: "run any non-readonly tools" → This disables TodoWrite (isReadOnly: false)
```

### Mode Switching Logic

**Location:** `chunks.130.mjs:2407-2411`

```javascript
// ============================================
// EnterPlanMode Confirmation Handler
// Location: chunks.130.mjs:2407-2411
// ============================================

// When EnterPlanMode is confirmed by user:
A.onAllow({}, [{
  type: "setMode",
  mode: "plan",
  destination: "session"
}])

// This triggers the plan mode system prompt which disables non-readonly tools
```

### Comparison: TodoWrite vs Plan Mode

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    TodoWrite vs Plan Mode Comparison                             │
├────────────────────────────────┬────────────────────────────────────────────────┤
│ Aspect                         │ TodoWrite              │ Plan Mode             │
├────────────────────────────────┼────────────────────────┼───────────────────────┤
│ Purpose                        │ Track task progress    │ Design implementation │
│                                │ during execution       │ before execution      │
├────────────────────────────────┼────────────────────────┼───────────────────────┤
│ When Used                      │ During active work     │ Before coding starts  │
├────────────────────────────────┼────────────────────────┼───────────────────────┤
│ isReadOnly                     │ false                  │ N/A (mode, not tool)  │
├────────────────────────────────┼────────────────────────┼───────────────────────┤
│ Available in Plan Mode         │ NO (disabled)          │ N/A                   │
├────────────────────────────────┼────────────────────────┼───────────────────────┤
│ State Changes                  │ Yes (app state)        │ Only plan file        │
├────────────────────────────────┼────────────────────────┼───────────────────────┤
│ User Visibility                │ Spinner + UI list      │ Plan file content     │
├────────────────────────────────┼────────────────────────┼───────────────────────┤
│ Persistence Location           │ ~/.claude/todos/       │ ~/.claude/plans/      │
├────────────────────────────────┼────────────────────────┼───────────────────────┤
│ Granularity                    │ Individual tasks       │ Overall strategy      │
├────────────────────────────────┼────────────────────────┼───────────────────────┤
│ Lifecycle                      │ Session-scoped         │ Plan file persisted   │
└────────────────────────────────┴────────────────────────┴───────────────────────┘
```

### Workflow Integration

```
                    ┌────────────────────┐
                    │   User Request     │
                    └──────────┬─────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
    ┌─────────────────────┐         ┌─────────────────────┐
    │ Complex task needs  │         │ Simple task, can    │
    │ planning first      │         │ execute directly    │
    └──────────┬──────────┘         └──────────┬──────────┘
               │                               │
               ▼                               ▼
    ┌─────────────────────┐         ┌─────────────────────┐
    │ EnterPlanMode       │         │ Use TodoWrite to    │
    │ (plan mode active)  │         │ track tasks         │
    │                     │         │                     │
    │ • TodoWrite: OFF    │         │ • Create todo items │
    │ • Read-only tools   │         │ • Mark in_progress  │
    │ • Write plan file   │         │ • Mark completed    │
    └──────────┬──────────┘         └──────────┬──────────┘
               │                               │
               ▼                               │
    ┌─────────────────────┐                    │
    │ ExitPlanMode        │                    │
    │ (user approves)     │                    │
    └──────────┬──────────┘                    │
               │                               │
               ▼                               │
    ┌─────────────────────┐                    │
    │ Now TodoWrite is    │◄───────────────────┘
    │ available again     │
    │                     │
    │ Execute plan with   │
    │ todo tracking       │
    └─────────────────────┘
```

### Why TodoWrite is Disabled in Plan Mode

1. **Separation of Concerns**
   - Plan mode is for strategic thinking, not execution
   - Todos are for tracking execution progress, not planning

2. **Prevent Premature Action**
   - TodoWrite implies work is starting
   - Plan mode explicitly says "do not execute yet"

3. **Read-Only Constraint**
   - Plan mode only allows read-only operations + plan file editing
   - TodoWrite modifies app state → violates read-only constraint

4. **User Expectation**
   - User entering plan mode expects no side effects
   - Creating todos would be an unexpected side effect

---

## 1. TodoWrite Tool Definition

### 1.1 Tool Constants and Names

**Location:** `chunks.60.mjs:1124`

```javascript
// Obfuscated: QEB
// Readable: TODOWRITE_TOOL_NAME
QEB = "TodoWrite"
```

### 1.2 Schema Definitions

**Location:** `chunks.60.mjs:1095-1101`

```javascript
// ============================================
// Todo Schema Definitions
// Location: chunks.60.mjs:1095-1101
// ============================================

// Obfuscated: IJ6
// Readable: TodoStatusEnum
// Purpose: Defines valid status values for todo items
IJ6 = j.enum(["pending", "in_progress", "completed"])

// Obfuscated: YJ6
// Readable: TodoItemSchema
// Purpose: Schema for individual todo item
YJ6 = j.object({
  content: j.string().min(1, "Content cannot be empty"),
  status: IJ6,
  activeForm: j.string().min(1, "Active form cannot be empty")
})

// Obfuscated: V7A
// Readable: TodoArraySchema
// Purpose: Array of todo items
V7A = j.array(YJ6)
```

**TypeScript Equivalent:**

```typescript
type TodoStatus = "pending" | "in_progress" | "completed";

interface TodoItem {
  content: string;      // Imperative form: "Run tests", "Fix bug"
  status: TodoStatus;   // Current task state
  activeForm: string;   // Present continuous: "Running tests", "Fixing bug"
}

type TodoList = TodoItem[];
```

### 1.3 Input/Output Schemas

**Location:** `chunks.60.mjs:1136-1140`

```javascript
// ============================================
// Tool Input/Output Schemas
// Location: chunks.60.mjs:1136-1140
// ============================================

// Obfuscated: JJ6
// Readable: TodoWriteInputSchema
JJ6 = j.strictObject({
  todos: V7A.describe("The updated todo list")
})

// Obfuscated: WJ6
// Readable: TodoWriteOutputSchema
WJ6 = j.object({
  oldTodos: V7A.describe("The todo list before the update"),
  newTodos: V7A.describe("The todo list after the update")
})
```

### 1.4 Tool Description (Short Form)

**Location:** `chunks.60.mjs:901`

```javascript
// Obfuscated: aCB
// Readable: todoWriteDescription
aCB = "Update the todo list for the current session. To be used proactively and often to track progress and pending tasks. Make sure that at least one task is in_progress at all times. Always provide both content (imperative) and activeForm (present continuous) for each task."
```

### 1.5 Complete Tool Object

**Location:** `chunks.60.mjs:1141-1211`

```javascript
// ============================================
// BY (TodoWriteTool) - Complete Definition
// Location: chunks.60.mjs:1141-1211
// ============================================

BY = {
  // Tool identification
  name: QEB,           // "TodoWrite"
  strict: true,        // Strict input validation

  // Example input for model training/context
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

  // Prompt functions
  async description() {
    return aCB   // Short description
  },
  async prompt() {
    return nCB   // Full usage guidelines (180+ lines)
  },

  // Schemas
  inputSchema: JJ6,    // { todos: TodoItem[] }
  outputSchema: WJ6,   // { oldTodos, newTodos }

  // Visibility
  userFacingName() {
    return ""  // Hidden from user (empty name)
  },

  // Availability
  isEnabled() {
    return true  // Always enabled
  },

  // Concurrency
  isConcurrencySafe() {
    return false  // Not safe for concurrent calls
  },

  // Side effects
  isReadOnly() {
    return false  // Modifies state
  },

  // Permission checking - Always allowed
  async checkPermissions(input) {
    return {
      behavior: "allow",
      updatedInput: input
    }
  },

  // UI Render functions - All return null (silent operation)
  renderToolUseMessage: rCB,          // null
  renderToolUseProgressMessage: oCB,  // null
  renderToolUseRejectedMessage: tCB,  // null
  renderToolUseErrorMessage: eCB,     // null
  renderToolResultMessage: AEB,       // null

  // Main execution function
  async call({ todos: newTodos }, context) {
    // Step 1: Get current todos for this agent
    let currentTodos = (await context.getAppState()).todos[context.agentId] ?? [];

    // Step 2: Auto-cleanup - if all completed, clear the list
    let todosToStore = newTodos.every(item => item.status === "completed")
      ? []
      : newTodos;

    // Step 3: Update app state
    context.setAppState(state => ({
      ...state,
      todos: {
        ...state.todos,
        [context.agentId]: todosToStore
      }
    }));

    // Step 4: Return result
    return {
      data: {
        oldTodos: currentTodos,
        newTodos: newTodos
      }
    };
  },

  // Result message sent back to model
  mapToolResultToToolResultBlockParam(data, toolUseId) {
    return {
      tool_use_id: toolUseId,
      type: "tool_result",
      content: "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable"
    }
  }
}
```

### 1.6 Render Functions (All Silent)

**Location:** `chunks.60.mjs:1104-1122`

```javascript
// ============================================
// Render Functions - All return null
// The tool operates silently with no UI feedback
// Location: chunks.60.mjs:1104-1122
// ============================================

// Obfuscated: rCB - renderToolUseMessage
function rCB() { return null }

// Obfuscated: oCB - renderToolUseProgressMessage
function oCB() { return null }

// Obfuscated: tCB - renderToolUseRejectedMessage
function tCB() { return null }

// Obfuscated: eCB - renderToolUseErrorMessage
function eCB() { return null }

// Obfuscated: AEB - renderToolResultMessage
function AEB() { return null }
```

**Key Insight:** All render functions return `null`, meaning:
- No visual feedback when tool is invoked
- No progress indicators during execution
- No error/rejection messages displayed
- Tool operates completely in the background

---

## 2. Trigger Mechanism

### 2.1 System Prompt Integration

**Location:** `chunks.152.mjs:2342-2435`

The system prompt conditionally includes TodoWrite instructions when the tool is available:

```javascript
// ============================================
// System Prompt - Task Management Section
// Location: chunks.152.mjs:2342-2387
// Condition: W.has(BY.name) - TodoWrite is in available tools
// ============================================

${W.has(BY.name) ? `# Task Management
You have access to the ${BY.name} tools to help you manage and plan tasks. Use these tools VERY frequently to ensure that you are tracking your tasks and giving the user visibility into your progress.
These tools are also EXTREMELY helpful for planning tasks, and for breaking down larger complex tasks into smaller steps. If you do not use this tool when planning, you may forget to do important tasks - and that is unacceptable.

It is critical that you mark todos as completed as soon as you are done with a task. Do not batch up multiple tasks before marking them as completed.

Examples:

<example>
user: Run the build and fix any type errors
assistant: I'm going to use the ${BY.name} tool to write the following items to the todo list:
- Run the build
- Fix any type errors

I'm now going to run the build using ${C9}.

Looks like I found 10 type errors. I'm going to use the ${BY.name} tool to write 10 items to the todo list.

marking the first todo as in_progress

Let me start working on the first item...

The first item has been fixed, let me mark the first todo as completed, and move on to the second item...
..
..
</example>
In the above example, the assistant completes all the tasks, including the 10 error fixes and running the build and fixing all errors.

<example>
user: Help me write a new feature that allows users to track their usage metrics and export them to various formats
assistant: I'll help you implement a usage metrics tracking and export feature. Let me first use the ${BY.name} tool to plan this task.
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
` : ""}
```

### 2.2 System Prompt Footer Reminder

**Location:** `chunks.152.mjs:2434-2435`

```javascript
// Additional reminder at end of system prompt
${W.has(BY.name) ? `
IMPORTANT: Always use the ${BY.name} tool to plan and track tasks throughout the conversation.` : ""}
```

### 2.3 "Doing Tasks" Section Reference

**Location:** `chunks.152.mjs:2400`

```javascript
// Inside "Doing tasks" recommendations
- ${W.has(BY.name) ? `Use the ${BY.name} tool to plan the task if required` : ""}
```

### 2.4 Tool Prompt - Full Guidelines

**Location:** `chunks.60.mjs:903-1086` (nCB variable)

```javascript
// ============================================
// nCB (todoWritePrompt) - Full Tool Usage Guidelines
// Location: chunks.60.mjs:903-1086
// Approximately 180 lines of detailed instructions
// ============================================

nCB = `Use this tool to create and manage a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
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

## Examples of When to Use the Todo List

<example>
User: I want to add a dark mode toggle to the application settings. Make sure you run the tests and build when you're done!
Assistant: I'll help add a dark mode toggle to your application settings. Let me create a todo list to track this implementation.
*Creates todo list with the following items:*
1. Creating dark mode toggle component in Settings page
2. Adding dark mode state management (context/store)
3. Implementing CSS-in-JS styles for dark theme
4. Updating existing components to support theme switching
5. Running tests and build process, addressing any failures or errors that occur
*Begins working on the first task*

<reasoning>
The assistant used the todo list because:
1. Adding dark mode is a multi-step feature requiring UI, state management, and styling changes
2. The user explicitly requested tests and build be run afterward
3. The assistant inferred that tests and build need to pass by adding "Ensure tests and build succeed" as the final task
</reasoning>
</example>

<example>
User: Help me rename the function getCwd to getCurrentWorkingDirectory across my project
Assistant: Let me first search through your codebase to find all occurrences of 'getCwd'.
*Uses grep or search tools to locate all instances of getCwd in the codebase*
Assistant: I've found 15 instances of 'getCwd' across 8 different files. Let me create a todo list to track these changes.
*Creates todo list with specific items for each file that needs updating*

<reasoning>
The assistant used the todo list because:
1. First, the assistant searched to understand the scope of the task
2. Upon finding multiple occurrences across different files, it determined this was a complex task with multiple steps
3. The todo list helps ensure every instance is tracked and updated systematically
4. This approach prevents missing any occurrences and maintains code consistency
</reasoning>
</example>

## Examples of When NOT to Use the Todo List

<example>
User: How do I print 'Hello World' in Python?
Assistant: In Python, you can print "Hello World" with this simple code:
print("Hello World")

<reasoning>
The assistant did not use the todo list because this is a single, trivial task that can be completed in one step.
</reasoning>
</example>

<example>
User: Run npm install for me and tell me what happens.
Assistant: I'll run the npm install command for you.
*Executes: npm install*

<reasoning>
The assistant did not use the todo list because this is a single command execution with immediate results.
</reasoning>
</example>

## Task States and Management

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

When in doubt, use this tool. Being proactive with task management demonstrates attentiveness and ensures you complete all requirements successfully.
`
```

### 2.5 Contexts Where TodoWrite is Disabled

**Location:** `chunks.71.mjs:827, 870`

In certain contexts (git commit, PR creation), TodoWrite is explicitly disabled:

```javascript
// During git commits (line 827)
- NEVER use the ${BY.name} or ${A6} tools

// During PR creation (line 870)
- DO NOT use the ${BY.name} or ${A6} tools
```

---

## 3. Todo Persistence

### 3.1 File Storage Path

**Location:** `chunks.106.mjs:1847-1856`

```javascript
// ============================================
// x00 (getTodosDirectory) - Get todos storage directory
// Location: chunks.106.mjs:1847-1851
// Returns: ~/.claude/todos/
// ============================================
function x00() {
  let todosDir = G91(MQ(), "todos");  // MQ() = Claude data directory
  if (!RA().existsSync(todosDir)) {
    RA().mkdirSync(todosDir);
  }
  return todosDir;
}

// ============================================
// Ri (getTodoFilePath) - Get file path for agent's todos
// Location: chunks.106.mjs:1853-1856
// Returns: ~/.claude/todos/{sessionId}-agent-{agentId}.json
// ============================================
function Ri(agentId) {
  let filename = `${e1()}-agent-${agentId}.json`;  // e1() = current session ID
  return G91(x00(), filename);
}
```

**File Path Pattern:**
```
~/.claude/todos/{sessionId}-agent-{agentId}.json

Examples:
~/.claude/todos/abc123-agent-main.json
~/.claude/todos/abc123-agent-subagent-1.json
```

### 3.2 Reading Todos from File

**Location:** `chunks.106.mjs:1858-1894`

```javascript
// ============================================
// Nh (readTodosFromFile) - High-level read function
// Location: chunks.106.mjs:1858-1860
// ============================================
function Nh(agentId) {
  return hZ2(Ri(agentId));  // Read from file path
}

// ============================================
// hZ2 (parseJsonTodoFile) - Low-level file parsing
// Location: chunks.106.mjs:1885-1895
// ============================================
function hZ2(filePath) {
  // Return empty array if file doesn't exist
  if (!RA().existsSync(filePath)) return [];

  try {
    // Read and parse JSON
    let jsonContent = JSON.parse(RA().readFileSync(filePath, {
      encoding: "utf-8"
    }));

    // Validate against schema and return
    return V7A.parse(jsonContent);  // V7A = TodoArraySchema
  } catch (error) {
    // Log error and return empty array on failure
    return AA(error instanceof Error ? error : Error(String(error))), [];
  }
}
```

### 3.3 Writing Todos to File

**Location:** `chunks.106.mjs:1862-1903`

```javascript
// ============================================
// UYA (writeTodosToFile) - High-level write function
// Location: chunks.106.mjs:1862-1864
// ============================================
function UYA(todos, agentId) {
  gZ2(todos, Ri(agentId));  // Write to file path
}

// ============================================
// gZ2 (writeJsonTodoFile) - Low-level file writing
// Location: chunks.106.mjs:1897-1903
// ============================================
function gZ2(todos, filePath) {
  try {
    // Write with pretty formatting (2-space indent)
    L_(filePath, JSON.stringify(todos, null, 2));
  } catch (error) {
    // Log error on failure
    AA(error instanceof Error ? error : Error(String(error)));
  }
}
```

### 3.4 State Change → File Sync

**Location:** `chunks.156.mjs:2156-2161`

When app state changes, todos are automatically persisted:

```javascript
// ============================================
// State Change Handler - Auto-persist todos
// Location: chunks.156.mjs:2156-2161
// ============================================

// When showExpandedTodos changes, sync to settings
if (newState.showExpandedTodos !== oldState.showExpandedTodos &&
    getCurrentSettings().showExpandedTodos !== newState.showExpandedTodos) {
  saveSettings({
    ...getCurrentSettings(),
    showExpandedTodos: newState.showExpandedTodos
  });
}

// When todos change, persist each agent's todos to file
if (oldState !== null && newState.todos !== oldState.todos) {
  for (let agentId in newState.todos) {
    UYA(newState.todos[agentId], agentId);  // Write to file
  }
}
```

### 3.5 Session Migration

**Location:** `chunks.106.mjs:1873-1883`

When resuming a session, todos can be migrated:

```javascript
// ============================================
// vK5 (migrateTodosBetweenSessions) - Copy todos from old to new session
// Location: chunks.106.mjs:1873-1883
// ============================================
function vK5(oldSessionId, newSessionId) {
  let oldPath = G91(x00(), `${oldSessionId}-agent-${oldSessionId}.json`);
  let newPath = G91(x00(), `${newSessionId}-agent-${newSessionId}.json`);

  try {
    let todos = hZ2(oldPath);  // Read from old session
    if (todos.length === 0) return false;

    gZ2(todos, newPath);  // Write to new session
    return true;
  } catch (error) {
    return AA(error instanceof Error ? error : Error(String(error))), false;
  }
}
```

---

## 4. TodoRead - No Explicit Tool (Attachment-Based)

**Important:** There is **NO explicit "TodoRead" tool**. Instead, todos are communicated back to the model through **system attachments**.

### 4.1 Attachment Types for Todos

**Location:** `chunks.154.mjs:66-102`

```javascript
// ============================================
// Todo Attachment Conversion
// Location: chunks.154.mjs:66-102
// Purpose: Convert todo attachments to system messages
// ============================================

case "todo":
  // Empty todo list reminder
  if (attachment.itemCount === 0) {
    return createSystemMessage([createMetaBlock({
      content: `This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the ${BY.name} tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.`,
      isMeta: true
    })]);
  }
  // Non-empty todo list update
  else {
    return createSystemMessage([createMetaBlock({
      content: `Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:

${JSON.stringify(attachment.content)}. Continue on with the tasks at hand if applicable.`,
      isMeta: true
    })]);
  }

case "todo_reminder":
  // Format todos as numbered list
  let formattedTodos = attachment.content.map((todo, index) =>
    `${index + 1}. [${todo.status}] ${todo.content}`
  ).join('\n');

  let reminderMessage = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;

  // Append existing todos if any
  if (formattedTodos.length > 0) {
    reminderMessage += `

Here are the existing contents of your todo list:

[${formattedTodos}]`;
  }

  return createSystemMessage([createMetaBlock({
    content: reminderMessage,
    isMeta: true
  })]);
```

### 4.2 Post-Compaction Todo Restore

**Location:** `chunks.107.mjs:1271-1280`

After context compaction, todos are restored via attachment:

```javascript
// ============================================
// fD5 (postCompactTodoRestore) - Restore todos after compaction
// Location: chunks.107.mjs:1271-1280
// ============================================
function fD5(agentId) {
  let todos = Nh(agentId);  // Read from file

  if (todos.length === 0) return null;

  return createAttachment({
    type: "todo",
    content: todos,
    itemCount: todos.length,
    context: "post-compact"
  });
}
```

---

## 5. System Reminders

### 5.1 Reminder Constants

**Location:** `chunks.107.mjs:2610-2617`

```javascript
// ============================================
// GY2 (todoReminderConstants) - Timing configuration
// Location: chunks.107.mjs:2610-2613
// ============================================
GY2 = {
  TURNS_SINCE_WRITE: 7,       // Trigger reminder after 7 turns without TodoWrite
  TURNS_BETWEEN_REMINDERS: 3  // Wait 3 turns between consecutive reminders
}

// Related constant for plan mode
IH5 = {
  TURNS_BETWEEN_ATTACHMENTS: 5  // Plan mode attachment frequency
}
```

### 5.2 Turn Counter Function

**Location:** `chunks.107.mjs:2358-2377`

```javascript
// ============================================
// SH5 (countTurnsSinceTodoWrite) - Count turns since last TodoWrite
// Location: chunks.107.mjs:2358-2377
// Returns: { turnsSinceLastTodoWrite, turnsSinceLastReminder }
// ============================================
function SH5(messages) {
  let lastTodoWriteIndex = -1;      // Index of last TodoWrite tool use
  let lastReminderIndex = -1;        // Index of last todo_reminder attachment
  let turnsSinceTodoWrite = 0;       // Counter for turns since TodoWrite
  let turnsSinceReminder = 0;        // Counter for turns since reminder

  // Iterate backwards through messages
  for (let i = messages.length - 1; i >= 0; i--) {
    let message = messages[i];

    if (message?.type === "assistant") {
      // Skip certain message types
      if (NQ0(message)) continue;

      // Increment counters if not found yet
      if (lastTodoWriteIndex === -1) turnsSinceTodoWrite++;
      if (lastReminderIndex === -1) turnsSinceReminder++;

      // Check for TodoWrite tool use in message
      if (lastTodoWriteIndex === -1 &&
          "message" in message &&
          Array.isArray(message.message?.content) &&
          message.message.content.some(block =>
            block.type === "tool_use" && block.name === "TodoWrite"
          )) {
        lastTodoWriteIndex = i;
      }
    }
    // Check for todo_reminder attachment
    else if (lastReminderIndex === -1 &&
             message?.type === "attachment" &&
             message.attachment.type === "todo_reminder") {
      lastReminderIndex = i;
    }

    // Exit early if both found
    if (lastTodoWriteIndex !== -1 && lastReminderIndex !== -1) break;
  }

  return {
    turnsSinceLastTodoWrite: turnsSinceTodoWrite,
    turnsSinceLastReminder: turnsSinceReminder
  };
}
```

### 5.3 Reminder Generator Function

**Location:** `chunks.107.mjs:2379-2394`

```javascript
// ============================================
// _H5 (generateTodoReminders) - Generate todo_reminder attachments
// Location: chunks.107.mjs:2379-2394
// Trigger: 7+ turns since TodoWrite AND 3+ turns since last reminder
// ============================================
async function _H5(messages, context) {
  // Skip if no messages
  if (!messages || messages.length === 0) return [];

  // Count turns since last TodoWrite and last reminder
  let {
    turnsSinceLastTodoWrite,
    turnsSinceLastReminder
  } = SH5(messages);

  // Check if reminder should be generated
  if (turnsSinceLastTodoWrite >= GY2.TURNS_SINCE_WRITE &&
      turnsSinceLastReminder >= GY2.TURNS_BETWEEN_REMINDERS) {

    // Read current todos from file
    let currentTodos = Nh(context.agentId);

    // Return todo_reminder attachment
    return [{
      type: "todo_reminder",
      content: currentTodos,
      itemCount: currentTodos.length
    }];
  }

  return [];
}
```

### 5.4 Attachment Pipeline Integration

**Location:** `chunks.107.mjs:1826`

```javascript
// ============================================
// Attachment Generation Pipeline
// Location: chunks.107.mjs:1826
// _H5 is integrated as "todo_reminders" attachment generator
// ============================================
attachmentGenerators = [
  wrapWithErrorHandling("changed_files", () => wH5(messages)),
  wrapWithErrorHandling("nested_memory", () => qH5(messages)),
  wrapWithErrorHandling("ultra_claude_md", async () => DH5(config)),
  wrapWithErrorHandling("plan_mode", () => VH5(config, context)),
  wrapWithErrorHandling("todo_reminders", () => _H5(messages, context)),  // <-- Todo reminders
  wrapWithErrorHandling("teammate_mailbox", async () => vH5(context)),
  wrapWithErrorHandling("critical_system_reminder", () => Promise.resolve(FH5(context)))
]
```

### 5.5 Reminder Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Todo Reminder Generation Flow                            │
└─────────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────┐
                    │       Message History           │
                    │  [msg1, msg2, ... msgN]         │
                    └───────────────┬─────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │  SH5(messages)                  │
                    │  Count turns backwards:         │
                    │  - Find last TodoWrite tool_use │
                    │  - Find last todo_reminder      │
                    └───────────────┬─────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │  Check Conditions:              │
                    │                                 │
                    │  turnsSinceTodoWrite >= 7       │
                    │        AND                      │
                    │  turnsSinceReminder >= 3        │
                    └───────────────┬─────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌─────────────────────┐        ┌─────────────────────┐
        │  Conditions MET     │        │  Conditions NOT MET │
        │                     │        │                     │
        │  Nh(agentId)        │        │  return []          │
        │  Read todos from    │        │  (no reminder)      │
        │  file               │        │                     │
        └──────────┬──────────┘        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────────────────────────────────────┐
        │  Create todo_reminder attachment:                   │
        │  {                                                  │
        │    type: "todo_reminder",                           │
        │    content: [...currentTodos],                      │
        │    itemCount: currentTodos.length                   │
        │  }                                                  │
        └──────────────────────┬──────────────────────────────┘
                               │
                               ▼
        ┌─────────────────────────────────────────────────────┐
        │  Convert to system message (chunks.154.mjs:88-102): │
        │                                                     │
        │  "The TodoWrite tool hasn't been used recently...   │
        │   Here are the existing contents of your todo list: │
        │   1. [in_progress] Fix authentication bug           │
        │   2. [pending] Write unit tests"                    │
        └─────────────────────────────────────────────────────┘
```

---

## 6. UI Rendering

### 6.1 Todo List Component (Yn)

**Location:** `chunks.118.mjs:1036-1064`

```javascript
// ============================================
// Yn (TodoListComponent) - Renders todo list in terminal
// Location: chunks.118.mjs:1036-1064
// ============================================
function Yn({
  todos,              // Array of todo items
  isStandalone = false // Whether to show with header
}) {
  // Return null if no todos
  if (todos.length === 0) return null;

  // Render todo items
  let todoItems = React.createElement(React.Fragment, null,
    todos.map((todo, index) => {
      // Select checkbox icon based on status
      let checkboxIcon = todo.status === "completed"
        ? H1.checkboxOn   // ☑ (checked)
        : H1.checkboxOff; // ☐ (unchecked)

      return React.createElement(Box, { key: index },
        // Checkbox icon
        React.createElement(Text, {
          dimColor: todo.status === "completed"
        }, checkboxIcon, " "),

        // Todo content text
        React.createElement(Text, {
          bold: todo.status === "in_progress",           // Bold for in_progress
          dimColor: todo.status === "completed",         // Dim for completed
          strikethrough: todo.status === "completed"     // Strikethrough for completed
        }, todo.content)
      );
    })
  );

  // Standalone mode: include header
  if (isStandalone) {
    return React.createElement(Box, {
      flexDirection: "column",
      marginTop: 1,
      marginLeft: 2
    },
      React.createElement(Text, { bold: true, dimColor: true }, "Todos"),
      todoItems
    );
  }

  // Inline mode: just the list
  return React.createElement(Box, { flexDirection: "column" }, todoItems);
}
```

**Visual Output:**
```
Todos
  ☐ Fix authentication bug          (bold - in_progress)
  ☐ Write unit tests                 (normal - pending)
  ☑ Research existing code           (dim, strikethrough - completed)
```

### 6.2 Spinner with Todo Integration (OO2)

**Location:** `chunks.118.mjs:1317-1460`

```javascript
// ============================================
// OO2 (SpinnerWithTodos) - Spinner component showing activeForm
// Location: chunks.118.mjs:1317-1460
// ============================================
function OO2({
  mode,                    // Stream mode (thinking, streaming, etc.)
  elapsedTimeMs,           // Time elapsed
  spinnerTip,              // Optional tip to display
  currentResponseLength,   // Current response length
  overrideColor,           // Custom color
  overrideShimmerColor,    // Custom shimmer color
  overrideMessage,         // Custom message override
  spinnerSuffix,           // Suffix after message
  verbose,                 // Verbose mode
  todos,                   // Current todos array
  hasActiveTools = false   // Whether tools are running
}) {
  // ... initialization code ...

  // Find in-progress todo
  let inProgressTodo = todos?.find(todo => todo.status === "in_progress");

  // Find next pending todo
  let pendingTodo = todos?.find(todo => todo.status === "pending");

  // Determine spinner message:
  // Priority: overrideMessage > inProgressTodo.activeForm > defaultMessage
  let spinnerMessage = (overrideMessage ?? inProgressTodo?.activeForm ?? defaultMessage) + "…";

  // ... render spinner animation ...

  // Render expanded todos if enabled
  return React.createElement(Fragment, null,
    // Spinner with message
    React.createElement(Box, { /* ... */ },
      React.createElement(Text, { /* ... */ }, spinnerMessage)
    ),

    // Show expanded todos if setting enabled
    appState.showExpandedTodos && todos && todos.length > 0
      ? React.createElement(Box, {
          width: "100%",
          flexDirection: "column"
        },
        React.createElement(Indent, null,
          React.createElement(Yn, { todos: todos })
        ))
      : null,

    // Show next pending todo as tip
    pendingTodo || spinnerTip
      ? React.createElement(Box, { width: "100%" },
        React.createElement(Indent, null,
          React.createElement(Text, { dimColor: true },
            pendingTodo
              ? `Next: ${pendingTodo.content}`
              : `Tip: ${spinnerTip}`
          )))
      : null
  );
}
```

**Spinner Display Examples:**

Collapsed view (showExpandedTodos = false):
```
✻ Implementing user authentication…
  Next: Write unit tests
```

Expanded view (showExpandedTodos = true):
```
✻ Implementing user authentication…
  ☐ Implement user authentication     (bold)
  ☐ Write unit tests
  ☐ Add error handling
```

### 6.3 Keyboard Toggle (Ctrl+T)

**Location:** `chunks.142.mjs:2475-2486`

```javascript
// ============================================
// F69 (toggleTodosHandler) - Ctrl+T keyboard handler
// Location: chunks.142.mjs:2475-2486
// ============================================
function F69(todos) {
  let [appState, setAppState] = useAppState();  // OQ hook

  // Register keyboard handler
  useInput((input, key) => {
    if (key.ctrl && input === "t") {
      // Track analytics event
      GA("tengu_toggle_todos", {
        is_expanded: appState.showExpandedTodos,
        has_todos: todos && todos.length > 0
      });

      // Toggle showExpandedTodos state
      setAppState(state => ({
        ...state,
        showExpandedTodos: !state.showExpandedTodos
      }));
    }
  });
}
```

### 6.4 Keyboard Shortcut Display

**Location:** `chunks.118.mjs:1393-1396`

```javascript
// Shows keyboard hint in status bar
React.createElement(KeyboardShortcut, {
  shortcut: "ctrl+t",
  action: `${appState.showExpandedTodos ? "hide" : "show"} todos`,
  bold: true
})
```

**Display:**
```
ctrl+t show todos    (when collapsed)
ctrl+t hide todos    (when expanded)
```

### 6.5 Main App Todo Display

**Location:** `chunks.145.mjs:546, 614-631`

```javascript
// ============================================
// Main App - Todo Integration
// Location: chunks.145.mjs:546, 614-631
// ============================================

// Get todos for current agent
let currentTodos = appState.todos[agentId];  // line 546

// Render spinner with todos
isSpinnerActive && React.createElement(OO2, {
  mode: streamMode,
  spinnerTip: appState.spinnerTip,
  currentResponseLength: responseLength,
  overrideMessage: customMessage,
  spinnerSuffix: spinnerSuffix,
  verbose: verboseMode,
  elapsedTimeMs: elapsedTime,
  todos: currentTodos,              // Pass todos to spinner
  overrideColor: customColor,
  overrideShimmerColor: shimmerColor,
  hasActiveTools: activeTools.size > 0
});

// Render standalone todos when spinner is inactive
!isSpinnerActive && appState.showExpandedTodos && React.createElement(Box, {
  width: "100%",
  flexDirection: "column"
},
  React.createElement(Yn, {
    todos: currentTodos || [],
    isStandalone: true
  })
);
```

### 6.6 /todos Slash Command

**Location:** `chunks.149.mjs:2465-2516`

```javascript
// ============================================
// AD9 (TodosCommandComponent) - Renders for /todos command
// Location: chunks.149.mjs:2465-2478
// ============================================
function AD9() {
  let sessionId = e1();          // Get current session ID
  let todos = Nh(sessionId);     // Read todos from file

  // No todos message
  if (todos.length === 0) {
    return React.createElement(Text, null, "No todos currently tracked");
  }

  // Render todos with count
  return React.createElement(Box, { flexDirection: "column" },
    React.createElement(Text, null,
      React.createElement(Text, { bold: true },
        todos.length, " ", todos.length === 1 ? "todo" : "todos"
      ),
      React.createElement(Text, null, ":")
    ),
    React.createElement(Box, { marginTop: 1 },
      React.createElement(Yn, { todos: todos })
    )
  );
}

// ============================================
// Cx3 (/todos command definition)
// Location: chunks.149.mjs:2493-2516
// ============================================
Cx3 = {
  type: "local-jsx",
  name: "todos",
  description: "List current todo items",
  isEnabled: () => true,
  isHidden: false,

  async call(respond, { options: { isNonInteractiveSession } }) {
    if (isNonInteractiveSession) {
      // Non-interactive: render to string
      let output = await renderToString(React.createElement(AD9, null));
      return respond(output), null;
    }

    // Interactive: render component
    return React.createElement(CommandWrapper, { onComplete: respond },
      React.createElement(AD9, null)
    );
  },

  userFacingName() { return "todos" }
}
```

**Example /todos Output:**
```
3 todos:
  ☐ Fix authentication bug           (bold - in_progress)
  ☐ Write unit tests                  (normal - pending)
  ☑ Research existing code            (dim, strikethrough - completed)
```

### 6.7 Per-Agent Todos in Subagent View

**Location:** `chunks.142.mjs:1110, 1152-1159`

```javascript
// ============================================
// j89 (AgentDetailView) - Shows subagent todos
// Location: chunks.142.mjs:1110, 1152-1159
// ============================================

// Get todos for specific agent
let [appState] = useAppState();
let agentTodos = appState.todos[agent.agentId] ?? [];
let completedCount = agentTodos.filter(todo => todo.status === "completed").length;

// Render todos section if agent has todos
agentTodos.length > 0 && React.createElement(Box, {
  flexDirection: "column",
  marginTop: 1
},
  React.createElement(Text, { bold: true, dimColor: true },
    "Tasks (", completedCount, "/", agentTodos.length, ")"
  ),
  React.createElement(Yn, { todos: agentTodos })
)
```

**Subagent Display:**
```
Agent: explore-codebase
Status: Running
Tasks (1/3)
  ☑ Search for authentication code     (completed)
  ☐ Analyze error handling             (in_progress)
  ☐ Summarize findings                 (pending)
```

---

## 7. Data Flow Diagrams

### 7.1 TodoWrite Tool Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         TodoWrite Execution Flow                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────┐
│  Model Decision   │
│  (via prompts)    │
└─────────┬─────────┘
          │
          ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│  Tool Call: TodoWrite({ todos: [...] })                                       │
│                                                                               │
│  Input:                                                                       │
│  {                                                                            │
│    "todos": [                                                                 │
│      { "content": "Fix bug", "status": "in_progress", "activeForm": "..." }, │
│      { "content": "Add tests", "status": "pending", "activeForm": "..." }    │
│    ]                                                                          │
│  }                                                                            │
└───────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│  BY.call({ todos: newTodos }, context)                                        │
│                                                                               │
│  1. currentTodos = (await context.getAppState()).todos[context.agentId] ?? [] │
│                                                                               │
│  2. todosToStore = newTodos.every(t => t.status === "completed") ? [] : newTodos │
│                                                                               │
│  3. context.setAppState(state => ({                                           │
│       ...state,                                                               │
│       todos: { ...state.todos, [context.agentId]: todosToStore }              │
│     }))                                                                        │
│                                                                               │
│  4. return { data: { oldTodos: currentTodos, newTodos } }                     │
└───────────────────────────────────────────────────────────────────────────────┘
          │
          │  State Change Triggers:
          ├──────────────────────────────────────────────────────────────┐
          │                                                              │
          ▼                                                              ▼
┌─────────────────────────────┐                         ┌─────────────────────────┐
│    React Re-render          │                         │   File Persistence      │
│                             │                         │                         │
│  Components using OQ()      │                         │  UYA(todos, agentId)    │
│  detect state change and    │                         │  writes to:             │
│  re-render UI               │                         │  ~/.claude/todos/       │
│                             │                         │  {session}-agent-       │
│  • OO2 (Spinner)            │                         │  {agent}.json           │
│  • Yn (TodoList)            │                         │                         │
└─────────────────────────────┘                         └─────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│  Tool Result Message (returned to model):                                     │
│                                                                               │
│  "Todos have been modified successfully. Ensure that you continue to use     │
│   the todo list to track your progress. Please proceed with the current      │
│   tasks if applicable"                                                        │
└───────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 System Reminder Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       System Reminder Generation Flow                            │
└─────────────────────────────────────────────────────────────────────────────────┘

                       ┌─────────────────────────────────┐
                       │  Before Each Model Turn         │
                       │  (Attachment Generation)        │
                       └───────────────┬─────────────────┘
                                       │
                                       ▼
                       ┌─────────────────────────────────┐
                       │  _H5(messages, context)         │
                       │  generateTodoReminders          │
                       └───────────────┬─────────────────┘
                                       │
                                       ▼
                       ┌─────────────────────────────────┐
                       │  SH5(messages)                  │
                       │  Count turns:                   │
                       │  • Since last TodoWrite         │
                       │  • Since last todo_reminder     │
                       └───────────────┬─────────────────┘
                                       │
              ┌────────────────────────┴────────────────────────┐
              │                                                  │
              ▼                                                  ▼
┌─────────────────────────────┐               ┌─────────────────────────────┐
│  Conditions NOT MET         │               │  Conditions MET             │
│                             │               │  turns >= 7 && reminders >= 3│
│  return []                  │               │                             │
│  (no attachment)            │               │  Nh(agentId) → read todos   │
└─────────────────────────────┘               └───────────────┬─────────────┘
                                                              │
                                                              ▼
                                              ┌─────────────────────────────┐
                                              │  Create Attachment:         │
                                              │  {                          │
                                              │    type: "todo_reminder",   │
                                              │    content: todos,          │
                                              │    itemCount: n             │
                                              │  }                          │
                                              └───────────────┬─────────────┘
                                                              │
                                                              ▼
                                              ┌─────────────────────────────┐
                                              │  Convert to System Message  │
                                              │  (chunks.154.mjs:88-102)    │
                                              │                             │
                                              │  <system-reminder>          │
                                              │  The TodoWrite tool hasn't  │
                                              │  been used recently...      │
                                              │  </system-reminder>         │
                                              └─────────────────────────────┘
```

---

## 8. Symbol Mapping Reference

| Obfuscated | Readable Name | Location | Description |
|------------|---------------|----------|-------------|
| `BY` | TodoWriteTool | chunks.60.mjs:1141 | Main tool object |
| `QEB` | TODOWRITE_TOOL_NAME | chunks.60.mjs:1124 | Tool name constant "TodoWrite" |
| `nCB` | todoWritePrompt | chunks.60.mjs:903 | Full usage guidelines (~180 lines) |
| `aCB` | todoWriteDescription | chunks.60.mjs:901 | Short description |
| `IJ6` | TodoStatusEnum | chunks.60.mjs:1097 | Status enum ["pending", "in_progress", "completed"] |
| `YJ6` | TodoItemSchema | chunks.60.mjs:1097-1101 | Single todo item schema |
| `V7A` | TodoArraySchema | chunks.60.mjs:1101 | Array of todo items schema |
| `JJ6` | TodoWriteInputSchema | chunks.60.mjs:1136 | Tool input schema |
| `WJ6` | TodoWriteOutputSchema | chunks.60.mjs:1138-1140 | Tool output schema |
| `rCB` | renderToolUseMessage | chunks.60.mjs:1104 | Returns null (silent) |
| `oCB` | renderToolUseProgressMessage | chunks.60.mjs:1108 | Returns null (silent) |
| `tCB` | renderToolUseRejectedMessage | chunks.60.mjs:1112 | Returns null (silent) |
| `eCB` | renderToolUseErrorMessage | chunks.60.mjs:1116 | Returns null (silent) |
| `AEB` | renderToolResultMessage | chunks.60.mjs:1120 | Returns null (silent) |
| `Yn` | TodoListComponent | chunks.118.mjs:1036 | React component for todo list |
| `OO2` | SpinnerWithTodos | chunks.118.mjs:1317 | Spinner showing activeForm |
| `F69` | toggleTodosHandler | chunks.142.mjs:2475 | Ctrl+T keyboard handler |
| `Nh` | readTodosFromFile | chunks.106.mjs:1858 | High-level read function |
| `UYA` | writeTodosToFile | chunks.106.mjs:1862 | High-level write function |
| `hZ2` | parseJsonTodoFile | chunks.106.mjs:1885 | Low-level JSON parse |
| `gZ2` | writeJsonTodoFile | chunks.106.mjs:1897 | Low-level JSON write |
| `x00` | getTodosDirectory | chunks.106.mjs:1847 | Get ~/.claude/todos/ path |
| `Ri` | getTodoFilePath | chunks.106.mjs:1853 | Get agent-specific file path |
| `vK5` | migrateTodosBetweenSessions | chunks.106.mjs:1873 | Copy todos between sessions |
| `SH5` | countTurnsSinceTodoWrite | chunks.107.mjs:2358 | Count turns for reminder logic |
| `_H5` | generateTodoReminders | chunks.107.mjs:2379 | Generate todo_reminder attachments |
| `GY2` | todoReminderConstants | chunks.107.mjs:2610 | Reminder timing constants |
| `AD9` | TodosCommandComponent | chunks.149.mjs:2465 | /todos command render component |
| `Cx3` | todosSlashCommand | chunks.149.mjs:2493 | /todos command definition |
| `fD5` | postCompactTodoRestore | chunks.107.mjs:1271 | Restore todos after compaction |

---

## 9. Key Insights Summary

### 9.1 Trigger Mechanism
- **No automatic trigger** - Model decides based on prompt guidelines
- **Three prompt sources:**
  1. System prompt "Task Management" section (chunks.152.mjs:2342-2387)
  2. System prompt footer reminder (chunks.152.mjs:2434-2435)
  3. Tool prompt with detailed guidelines (chunks.60.mjs:903-1086)
- **Proactive reminders** after 7 turns of inactivity

### 9.2 Persistence
- **YES** - Todos are persisted to JSON files
- **Location:** `~/.claude/todos/{sessionId}-agent-{agentId}.json`
- **Auto-sync:** State changes trigger immediate file writes
- **Session migration:** Todos can be copied between sessions

### 9.3 TodoRead Tool
- **NO explicit TodoRead tool exists**
- **Reading methods:**
  1. `"todo"` attachment - state sync on change
  2. `"todo_reminder"` attachment - after 7+ turns inactive
  3. Post-compaction restore via `fD5()` function
  4. `/todos` slash command for user visibility

### 9.4 UI Integration
- **Component:** `Yn` renders checkbox list with status styling
- **Spinner:** `OO2` shows `activeForm` of in_progress todo
- **Toggle:** Ctrl+T toggles expanded/collapsed view
- **State:** `showExpandedTodos` in app state (persisted to settings)

### 9.5 System Reminders
- **Trigger:** 7+ turns without TodoWrite AND 3+ turns since last reminder
- **Constants:** `GY2.TURNS_SINCE_WRITE = 7`, `GY2.TURNS_BETWEEN_REMINDERS = 3`
- **Message:** Gentle reminder to use TodoWrite, includes current todo list
- **Privacy:** "Make sure that you NEVER mention this reminder to the user"

---

## 10. Supplementary Analysis

### 10.1 Tool Registration

**Location:** `chunks.146.mjs:891-892`

```javascript
// ============================================
// wY1 (getToolList) - Returns all available tools
// BY is included in the base tool set (not conditionally enabled)
// ============================================
function wY1() {
  return [
    jn,    // Read tool
    D9,    // Write tool
    zO,    // Glob tool
    Py,    // Grep tool
    gq,    // Bash tool
    n8,    // NotebookEdit tool
    lD,    // WebFetch tool
    QV,    // WebSearch tool
    kP,    // Edit tool
    nV,    // Task tool
    BY,    // TodoWrite tool <-- Always included
    ZSA,   // AskUserQuestion tool
    CY1,   // Skill tool
    HY1,   // SlashCommand tool
    Y71,   // KillShell tool
    ln,    // EnterPlanMode tool
    nn,    // ExitPlanMode tool
    cTA,   // AgentOutput tool
    ...Dx() ? [dW9, tW9, WX9, UX9] : [],  // MCP tools (conditional)
    ...process.env.ENABLE_LSP_TOOL ? [FV0] : [],  // LSP tool (env-dependent)
    Wh,    // BashOutput tool
    Xh     // Unknown tool
  ]
}

// DV0 (getEnabledToolNames) - Filters by isEnabled()
function DV0() {
  let tools = wY1(),
    enabledFlags = tools.map((tool) => tool.isEnabled());
  return tools.filter((tool, index) => enabledFlags[index]).map((tool) => tool.name)
}
```

### 10.2 Telemetry Events

**Location:** `chunks.142.mjs:2479-2482`

```javascript
// ============================================
// Telemetry - tengu_toggle_todos event
// Tracked when user presses Ctrl+T
// ============================================
GA("tengu_toggle_todos", {
  is_expanded: appState.showExpandedTodos,  // Current state before toggle
  has_todos: todos && todos.length > 0       // Whether any todos exist
})
```

| Event | Data Field | Description |
|-------|------------|-------------|
| `tengu_toggle_todos` | `is_expanded` | Boolean - state before toggle |
| | `has_todos` | Boolean - whether todos exist |

### 10.3 Feature Flags and Configuration

**Location:** `chunks.56.mjs:2657-2658`

```javascript
// Default Settings - No conditional logic to disable todos
{
  todoFeatureEnabled: !0,     // true - Always enabled
  showExpandedTodos: !1,      // false - Collapsed by default
}
```

### 10.4 State Initialization on Startup

**Location:** `chunks.158.mjs:352, 391-393`

```javascript
// ============================================
// Initial State Creation
// Todos are loaded from file on session start
// ============================================
let sessionId = e1();  // Get current session ID

let initialState = {
  todos: {
    [sessionId]: Nh(sessionId)  // Load from ~/.claude/todos/{sessionId}-agent-{sessionId}.json
  },
  showExpandedTodos: getCurrentSettings().showExpandedTodos ?? false,
};
```

**Startup Flow:**
```
1. Get session ID via e1()
        ↓
2. Call Nh(sessionId) to read file
        ↓
3. File doesn't exist? → return []
   File exists but parse fails? → log error, return []
   File valid? → return parsed todos
        ↓
4. Initialize state with loaded todos
```

### 10.5 Remote Session Integration

**Location:** `chunks.121.mjs:618-631`

```javascript
// Remote sessions maintain separate todoList
setAppState((state) => ({
  ...state,
  backgroundTasks: {
    [taskId]: {
      id: taskId,
      status: "starting",
      todoList: [],  // Separate todo list for remote session
      type: "remote_session",
      // ...
    }
  }
}));
```

**Todo extraction from session log (chunks.139.mjs:309-317):**

```javascript
// iO3 (extractTodosFromSessionLog)
function iO3(messages) {
  // Find last message with TodoWrite tool use
  let lastTodoWriteMessage = messages.findLast((msg) =>
    msg.type === "assistant" &&
    msg.message.content.some((block) =>
      block.type === "tool_use" && block.name === BY.name
    )
  );

  if (!lastTodoWriteMessage) return [];

  let toolUseBlock = lastTodoWriteMessage.message.content.find((block) =>
    block.type === "tool_use" && block.name === BY.name
  )?.input;

  if (!toolUseBlock) return [];

  let parseResult = BY.inputSchema.safeParse(toolUseBlock);
  return parseResult.success ? parseResult.data.todos : [];
}
```

**Progress display:** Shows "2/5" style (completed/total) for remote sessions.

### 10.6 Error Handling

**Location:** `chunks.1.mjs:3738-3752`

```javascript
// ============================================
// AA (logError) - Global error logging function
// ============================================
function AA(error) {
  try {
    // Skip in certain environments
    if (process.env.DISABLE_ERROR_REPORTING ||
        process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) {
      return;
    }

    let errorStack = error.stack || error.message;
    let errorData = {
      error: errorStack,
      timestamp: new Date().toISOString()
    };

    // Log to console
    g(`${error.name}: ${errorStack}`, { level: "error" });

    // Send to error reporting service
    Az0(errorData);
    IP9(ZP9(), { error: errorStack });
  } catch {
    // Silently ignore logging errors
  }
}
```

| Operation | Error Handling |
|-----------|----------------|
| File read (`hZ2`) | Returns `[]`, logs via `AA()` |
| File write (`gZ2`) | Silent failure, logs via `AA()` |
| Schema parse | Throws on invalid, caught by caller |
| Session migration | Returns `false`, logs via `AA()` |

### 10.7 Edge Cases and Limitations

#### Empty Array Handling
```javascript
let currentTodos = (await context.getAppState()).todos[context.agentId] ?? [];
// Missing agentId → defaults to empty array
```

#### Auto-Cleanup on All Completed
```javascript
let todosToStore = newTodos.every(item => item.status === "completed")
  ? []       // Clear if all completed
  : newTodos;
```

#### No Maximum Todo Items Limit
```javascript
V7A = j.array(YJ6)  // No .max() constraint - unlimited items
```

#### Schema Validation Requirements
```javascript
YJ6 = j.object({
  content: j.string().min(1),     // Non-empty required
  status: IJ6,                     // Must be valid enum
  activeForm: j.string().min(1)   // Non-empty required
})
// Invalid data → empty array returned (fail-safe)
```

### 10.8 Concurrency Safety Analysis

**Location:** `chunks.60.mjs:1169-1171`

```javascript
isConcurrencySafe() {
  return false  // Intentionally false
}
```

**Queue processing (chunks.146.mjs:1346-1367):**

```javascript
async processQueue() {
  for (let tool of this.tools) {
    if (tool.status !== "queued") continue;

    if (this.canExecuteTool(tool.isConcurrencySafe)) {
      await this.executeTool(tool);
    } else if (!tool.isConcurrencySafe) {
      break;  // Non-safe tool blocks entire queue
    }
  }
}
```

**Implications:**

| Aspect | Effect |
|--------|--------|
| Sequential Execution | TodoWrite blocks tool queue |
| No Race Conditions | Prevents concurrent state modifications |
| Predictable Order | Todos always written in call order |
| Performance Trade-off | Cannot parallelize with other tools |

### 10.9 Message Conversion Helpers

#### NG Function - System Reminder Wrapper

**Location:** `chunks.153.mjs:2856`

```javascript
// Wraps messages in <system-reminder> tags
function NG(messages) {
  return messages.map((msg) => ({
    ...msg,
    message: {
      ...msg.message,
      content: Qu(msg.message.content)  // Wrap in tags
    }
  }));
}

function Qu(text) {
  return `<system-reminder>\n${text}\n</system-reminder>`;
}
```

#### R0 Function - Meta Block Creator

**Location:** `chunks.153.mjs:2179`

```javascript
// Creates meta message blocks as "user" role messages
function R0({ content, isMeta, ... }) {
  return {
    type: "user",
    message: { role: "user", content: content },
    isMeta: isMeta,  // true = not shown to user
    uuid: generateUUID(),
    timestamp: new Date().toISOString()
  };
}
```

#### l9 Function - Attachment Creator

**Location:** `chunks.107.mjs:2349`

```javascript
function l9(attachmentData) {
  return {
    attachment: attachmentData,
    type: "attachment",
    uuid: ZH5(),
    timestamp: new Date().toISOString()
  };
}
```

### 10.10 File System Helpers

| Function | Location | Purpose |
|----------|----------|---------|
| `RA()` | chunks.1.mjs:737 | Returns file system operations object |
| `L_(path, content)` | chunks.154.mjs:2153 | Atomic file write with symlink handling |
| `MQ()` | chunks.1.mjs:886 | Returns `~/.claude` directory path |
| `e1()` | chunks.1.mjs:2473 | Returns current session ID |
| `G91(a, b)` | various | Path.join alias |

**Atomic Write Strategy:**
```javascript
function L_(filePath, content) {
  let tempPath = `${filePath}.tmp.${process.pid}.${Date.now()}`;
  try {
    writeFileSync(tempPath, content);
    renameSync(tempPath, filePath);  // Atomic rename
  } catch {
    writeFileSync(filePath, content);  // Fallback
  }
}
```

### 10.11 Checkbox Icons

**Location:** `chunks.16.mjs:814-889`

| Terminal | Completed | Pending/In Progress |
|----------|-----------|---------------------|
| Unicode-capable | ☒ | ☐ |
| ASCII fallback | [×] | [ ] |

```javascript
// Detection
H1 = AH1() ? unicodeIcons : asciiIcons;  // AH1() detects Unicode support
```

### 10.12 API Context Object

**Location:** `chunks.145.mjs:202-264`

```javascript
// Context passed to every tool's call() method
{
  // State management
  getAppState(): Promise<AppState>,
  setAppState: (updater) => void,

  // Identity
  agentId: string,

  // Configuration
  options: {
    tools: Array,
    mainLoopModel: string,
    mcpClients: Array,
    // ...
  },

  // UI callbacks
  setToolJSX: Function,
  addNotification: Function,
  setSpinnerMessage: Function,
  // ...

  // Subagent-specific
  isSubAgent: boolean,  // Only present for subagents
}
```

**SubAgent differences:**
- Most setters are no-ops
- Separate `agentId`
- `isSubAgent: true`
- Depth tracking for nested calls

### 10.13 Symbol Reference

> All symbol mappings are maintained in [`symbol_index.md`](../00_overview/symbol_index.md).
> See **Module: Todo List** section for complete todo-related symbol mappings.

Key symbols used in this document:
- `BY` → TodoWriteTool
- `QEB` → TODOWRITE_TOOL_NAME ("TodoWrite")
- `_H5` → generateTodoReminders
- `SH5` → countTurnsSinceTodoWrite
- `Nh` → readTodosFromFile
- `kb3` → convertAttachmentToSystemMessage

---

## 11. Summary: How LLM is Prevented from Ignoring Todos

This section consolidates the enforcement mechanisms that ensure consistent TodoWrite usage.

### 11.1 Upfront Enforcement (System Prompt)

The system prompt establishes strong expectations before any user interaction:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         UPFRONT ENFORCEMENT LAYERS                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  LAYER 1: System Prompt Core (chunks.152.mjs:2342-2387)                        │
│  ─────────────────────────────────────────────────────────────────────────────  │
│  • "Use these tools VERY frequently"                                           │
│  • "EXTREMELY helpful for planning"                                            │
│  • "may forget to do important tasks - and that is unacceptable"               │
│  • "It is critical that you mark todos as completed"                           │
│                                                                                 │
│  LAYER 2: System Prompt Footer (chunks.152.mjs:2434-2435)                      │
│  ─────────────────────────────────────────────────────────────────────────────  │
│  • "IMPORTANT: Always use the TodoWrite tool"                                  │
│                                                                                 │
│  LAYER 3: Tool Prompt (chunks.60.mjs:903-1086)                                 │
│  ─────────────────────────────────────────────────────────────────────────────  │
│  • 180+ lines of detailed guidelines                                           │
│  • "When to Use" (7 scenarios)                                                 │
│  • "When NOT to Use" (4 scenarios)                                             │
│  • Examples with <reasoning> tags                                              │
│  • Task state management rules                                                 │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Runtime Enforcement (Reminders)

After prolonged inactivity, the system injects hidden reminders:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         RUNTIME ENFORCEMENT MECHANISM                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  TRIGGER CONDITIONS:                                                            │
│  ─────────────────────────────────────────────────────────────────────────────  │
│  • 7+ assistant turns since last TodoWrite usage                               │
│  • 3+ assistant turns since last reminder                                      │
│  • Controlled by constants: GY2.TURNS_SINCE_WRITE, GY2.TURNS_BETWEEN_REMINDERS │
│                                                                                 │
│  REMINDER CONTENT:                                                              │
│  ─────────────────────────────────────────────────────────────────────────────  │
│  "The TodoWrite tool hasn't been used recently. If you're working on tasks     │
│   that would benefit from tracking progress, consider using the TodoWrite      │
│   tool to track progress. Also consider cleaning up the todo list if has       │
│   become stale and no longer matches what you are working on."                 │
│                                                                                 │
│  HIDDEN NATURE:                                                                 │
│  ─────────────────────────────────────────────────────────────────────────────  │
│  • Sent with isMeta: true (invisible to user)                                  │
│  • "Make sure that you NEVER mention this reminder to the user"                │
│  • Wrapped in <system-reminder> tags                                           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 11.3 Feedback Loop (Tool Result Message)

After each TodoWrite invocation, positive reinforcement is provided:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         FEEDBACK LOOP MECHANISM                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  TOOL RESULT MESSAGE (chunks.60.mjs:1195-1203):                                │
│  ─────────────────────────────────────────────────────────────────────────────  │
│  "Todos have been modified successfully. Ensure that you continue to use       │
│   the todo list to track your progress. Please proceed with the current        │
│   tasks if applicable"                                                          │
│                                                                                 │
│  REINFORCEMENT EFFECTS:                                                         │
│  ─────────────────────────────────────────────────────────────────────────────  │
│  • Confirms success (positive feedback)                                        │
│  • Reminds to "continue to use" (habit formation)                              │
│  • Prompts action on "current tasks" (maintains momentum)                      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 11.4 Complete Enforcement Timeline

```
                              USER SESSION TIMELINE
                              ════════════════════

  START                                                                      END
    │                                                                         │
    ▼                                                                         ▼
────┼─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬────────────┼────
    │         │         │         │         │         │         │            │
    │         │         │         │         │         │         │            │
    ▼         ▼         ▼         ▼         ▼         ▼         ▼            ▼

┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ SYSTEM │ │ TOOL   │ │ TODO   │ │ TOOL   │ │ 7 TURNS│ │ REMIND │ │ TOOL   │
│ PROMPT │ │ PROMPT │ │ WRITE  │ │ RESULT │ │ PASS   │ │ INJECT │ │ RESULT │
│        │ │        │ │ #1     │ │ MSG    │ │        │ │        │ │ MSG    │
│        │ │        │ │        │ │        │ │        │ │        │ │        │
│ VERY   │ │ 180+   │ │ LLM    │ │ Continue│ │ No todo│ │ Hidden │ │ Positive│
│ EXTREME│ │ lines  │ │ uses   │ │ using  │ │ usage  │ │ meta   │ │ reinforce│
│ IMPORT │ │ guide  │ │ todo   │ │ todos  │ │        │ │ message│ │        │
│        │ │        │ │        │ │        │ │        │ │        │ │        │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
    │          │          │          │          │          │          │
    └──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                         │  ENFORCEMENT        │
                         │  COVERAGE:          │
                         │  • Before: 100%     │
                         │  • During: 100%     │
                         │  • After: 100%      │
                         │                     │
                         └─────────────────────┘
```

### 11.5 Why This Works

1. **Priming Effect**
   - Strong language in system prompt creates initial expectation
   - "VERY", "EXTREMELY", "IMPORTANT" activate attention

2. **Consistency Pressure**
   - Tool prompt provides detailed examples
   - Creates mental model of "correct" behavior

3. **Negative Consequence Framing**
   - "may forget...unacceptable" creates fear of failure
   - Motivates proactive todo usage

4. **Invisible Reminders**
   - User never sees reminders → no embarrassment
   - LLM receives gentle course correction privately

5. **Positive Reinforcement**
   - Tool result confirms success
   - Creates reward cycle for continued usage

6. **Context Preservation**
   - Reminders include current todo list
   - Prevents context loss across conversation

### 11.6 Escape Hatches

TodoWrite enforcement is intentionally disabled in specific contexts:

| Context | Reason | Location |
|---------|--------|----------|
| Plan Mode | Strategic thinking, not execution | chunks.153.mjs:2890 |
| Git Commits | Atomic operation, no side effects | chunks.71.mjs:827 |
| PR Creation | Atomic operation, no side effects | chunks.71.mjs:870 |
| Trivial Tasks | <3 steps, overhead not justified | Tool prompt guidelines |

---

## 12. Key Insights Summary

### TodoWrite Tool
- **Always enabled** (`isEnabled() { return true }`)
- **Silent operation** (all render functions return `null`)
- **Auto-cleanup** when all todos completed
- **Per-agent isolation** via `agentId` key

### Persistence
- **Location:** `~/.claude/todos/{sessionId}-agent-{agentId}.json`
- **Format:** JSON array of `{ content, status, activeForm }`
- **Sync:** Immediate on state change
- **Validation:** Zod schema with fail-safe empty array

### Enforcement
- **5-layer strategy** from system prompt to tool result
- **7-turn threshold** for auto-reminder injection
- **3-turn cooldown** between reminders
- **Hidden meta-messages** invisible to users

### Plan Mode Relationship
- **TodoWrite disabled** in plan mode (isReadOnly: false)
- **Complementary purposes:** planning vs. execution tracking
- **Sequential workflow:** Plan first → exit → then use todos

### UI Integration
- **Spinner:** Shows `activeForm` of in_progress todo
- **List:** Checkbox icons with status styling
- **Toggle:** Ctrl+T to expand/collapse
- **Command:** `/todos` to view current list
