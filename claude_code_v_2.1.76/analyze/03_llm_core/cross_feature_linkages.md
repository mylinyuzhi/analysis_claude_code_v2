# LLM Core: Cross-Feature Linkages (Claude Code 2.1.76)

> Complete analysis of how LLM core integrates with other modules: system reminders, compact, tools, hooks, and UI components.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## Overview

The LLM core is the central hub of Claude Code, connecting to virtually every other module:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LLM CORE CROSS-FEATURE INTEGRATION                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌─────────────────────┐                             │
│                          │     LLM CORE        │                             │
│                          │  (03_llm_core)      │                             │
│                          └──────────┬──────────┘                             │
│                                     │                                        │
│     ┌───────────────┬───────────────┼───────────────┬───────────────┐       │
│     │               │               │               │               │       │
│     ▼               ▼               ▼               ▼               ▼       │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│ │04_system_ │ │ 07_compact│ │ 05_tools  │ │ 12_hooks  │ │ 01_CLI/   │      │
│ │ reminder  │ │           │ │           │ │           │ │ UI        │      │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘      │
│                                                                              │
│     ┌───────────────┬───────────────┼───────────────┬───────────────┐       │
│     │               │               │               │               │       │
│     ▼               ▼               ▼               ▼               ▼       │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│ │ 06_mcp    │ │ 16_thinking│ │ 08_subagent│ │ 09_skills │ │ 17_telemetry│    │
│ │           │ │           │ │           │ │           │ │           │      │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration with 04_system_reminder

### Overview

The system reminder module produces contextual attachments that are injected into the LLM conversation as user messages. This integration happens at several key points in the agent loop.

### Attachment Producer Pipeline

The `assembleAllAttachments` function orchestrates all attachment producers in three groups:

```javascript
// ============================================
// assembleAllAttachments - Main attachment orchestrator
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A) {
    let {
        toolUseContext: q,
        messages: K,
        sessionContext: Y,
        querySource: z,
        autoCompactTracking: _
    } = A, w = Y.agentId ?? R1(), O = q.options.tools;
    if (z === "repl_main_thread" || z.startsWith("agent:")) {
        let $ = [HuY, IuY, ...];
        // ... Group 1: User-dependent producers (if @mentions)
    }
    let $ = await Promise.all([          // Group 2: Always-computed (parallel)
        Hz("changed_files", () => KuY(K, Y)),
        Hz("nested_memory", () => MuY(Y)),
        Hz("todo_reminder", () => ruY(K, q)),
        Hz("task_reminder", () => auY(K, q)),
        ...
    ]);
    let H = [                             // Group 3: Conditional producers
        () => DuY(K, Y),                  // plan_mode
        () => XuY(Y),                     // plan_mode_exit
        () => ZuY(K, Y),                  // auto_mode
        ...
    ];
    return combineAndFilter($, H);
}

// READABLE (for understanding):
async function assembleAllAttachments(params) {
    let { toolUseContext, messages, sessionContext, querySource, autoCompactTracking } = params;
    let agentId = sessionContext.agentId ?? getSessionId();
    let tools = toolUseContext.options.tools;

    // Group 1: User-dependent producers (only if @mentions in user message)
    if (querySource === "repl_main_thread" || querySource.startsWith("agent:")) {
        let userDependentProducers = [
            getUserMentionProducers(...),
            // Only runs when @mentions are detected
        ];
        // ...
    }

    // Group 2: Always-computed producers (parallel execution)
    let alwaysComputed = await Promise.all([
        timedAttachmentProducer("changed_files", () => getChangedFilesAttachment(messages, sessionContext)),
        timedAttachmentProducer("nested_memory", () => getNestedMemoryAttachment(sessionContext)),
        timedAttachmentProducer("todo_reminder", () => getTodoReminderAttachment(messages, toolUseContext)),
        timedAttachmentProducer("task_reminder", () => getTaskReminderAttachment(messages, toolUseContext)),
        timedAttachmentProducer("async_hook_response", () => getAsyncHookResponseAttachments()),
        timedAttachmentProducer("deferred_tools_delta", () => getDeferredToolsDelta(sessionContext)),
        timedAttachmentProducer("mcp_restart_state", () => getMcpRestartState()),
        // ... more producers
    ]);

    // Group 3: Conditional producers (based on mode, state, etc.)
    let conditionalProducers = [
        () => getPlanModeAttachment(messages, sessionContext),      // DuY
        () => getPlanModeExitAttachment(sessionContext),            // XuY
        () => getAutoModeAttachment(messages, sessionContext),      // ZuY
        () => getAutoModeExitAttachment(sessionContext),            // GuY
        () => getDateChangeAttachment(),                             // fuY
        () => getEditedTextFileAttachment(messages),                 // TuY
        () => getToolMemoryAttachment(messages, sessionContext),     // VuY
        () => getBackgroundAgentStatusAttachment(),                  // suY
    ];

    // Execute conditional producers sequentially
    let conditionalResults = [];
    for (let producer of conditionalProducers) {
        let result = await producer();
        conditionalResults.push(...result);
    }

    // Combine all results, filter empty arrays
    return [...alwaysComputed.flat(), ...conditionalResults].filter(Boolean);
}

// Mapping: _uY→assembleAllAttachments, Hz→timedAttachmentProducer,
//   DuY→getPlanModeAttachment, XuY→getPlanModeExitAttachment,
//   ruY→getTodoReminderAttachment, auY→getTaskReminderAttachment
```

### Key Attachment Producers

#### plan_mode Attachment (DuY)

**What it does:**
Produces the plan mode reminder attachment that keeps the agent aligned with the current plan.

**Source Code:**

```javascript
// ============================================
// getPlanModeAttachment - Produces plan mode reminder
// Location: chunks.147.mjs:136-168
// ============================================

// ORIGINAL (for source lookup):
async function DuY(A, q) {
    let Y = q.getAppState().toolPermissionContext;
    if (Y.mode !== "plan") return [];
    if (A && A.length > 0) {
        let { turnCount: H, foundPlanModeAttachment: j } = JuY(A);
        if (j && H < t4q.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    let z = Fj(q.agentId), _ = sJ(q.agentId), w = [];
    if (Y.prePlanMode === "ultraplan") return w.push({
        type: "plan_mode", reminderType: "ultraplan-complete",
        isSubAgent: !!q.agentId, planFilePath: z, planExists: _ !== null
    }), w;
    if (nk6() && _ !== null) w.push({ type: "plan_mode_reentry", planFilePath: z }), HV(!1);
    let $ = (MuY(A ?? []) + 1) % t4q.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return w.push({
        type: "plan_mode", reminderType: $,
        isSubAgent: !!q.agentId, planFilePath: z, planExists: _ !== null
    }), w
}

// READABLE (for understanding):
async function getPlanModeAttachment(messages, sessionContext) {
    let permissionContext = sessionContext.getAppState().toolPermissionContext;

    // Only produce if in plan mode
    if (permissionContext.mode !== "plan") return [];

    // Throttle: Check if recent attachment exists
    if (messages && messages.length > 0) {
        let { turnCount, foundPlanModeAttachment } = countTurnsSincePlanModeAttachment(messages);
        if (foundPlanModeAttachment && turnCount < TURNS_BETWEEN_ATTACHMENTS) {
            return [];  // Skip, too recent
        }
    }

    let planFilePath = getPlanFilePath(sessionContext.agentId);
    let planExists = checkPlanExists(sessionContext.agentId);
    let attachments = [];

    // Special handling for ultraplan mode
    if (permissionContext.prePlanMode === "ultraplan") {
        attachments.push({
            type: "plan_mode",
            reminderType: "ultraplan-complete",
            isSubAgent: !!sessionContext.agentId,
            planFilePath,
            planExists
        });
        return attachments;
    }

    // Plan reentry if plan exists and feature enabled
    if (isPlanReentryEnabled() && planExists !== null) {
        attachments.push({
            type: "plan_mode_reentry",
            planFilePath
        });
        clearPlanReentryFlag(false);
    }

    // Determine reminder type (full or sparse)
    let attachmentCount = countPlanModeAttachments(messages ?? []);
    let reminderType = (attachmentCount + 1) % FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
        ? "full"
        : "sparse";

    attachments.push({
        type: "plan_mode",
        reminderType,
        isSubAgent: !!sessionContext.agentId,
        planFilePath,
        planExists
    });

    return attachments;
}

// Mapping: DuY→getPlanModeAttachment, JuY→countTurnsSincePlanModeAttachment,
//   Fj→getPlanFilePath, sJ→checkPlanExists, nk6→isPlanReentryEnabled,
//   t4q→PLAN_MODE_CONSTANTS, MuY→countPlanModeAttachments
```

**Throttling Logic:**
- Attachments are throttled to avoid repetition
- `TURNS_BETWEEN_ATTACHMENTS` controls minimum turns between attachments
- `FULL_REMINDER_EVERY_N_ATTACHMENTS` controls how often full reminder is sent

#### todo_reminder Attachment (ruY)

**What it does:**
Reminds the model of the current todo list state when the Todo tool hasn't been used recently.

**Source Code:**

```javascript
// ============================================
// getTodoReminderAttachment - Produces todo list reminder
// Location: chunks.147.mjs:972-989
// ============================================

// ORIGINAL (for source lookup):
async function ruY(A, q) {
    if (!q.options.tools.some((z) => z3(z, MB))) return [];
    if (CE1 && q.options.tools.some((z) => z3(z, CE1))) return [];
    if (!A || A.length === 0) return [];
    let { turnsSinceLastTodoWrite: K, turnsSinceLastReminder: Y } = nuY(A);
    if (K >= IE1.TURNS_SINCE_WRITE && Y >= IE1.TURNS_BETWEEN_REMINDERS) {
        let z = q.agentId ?? R1(), w = q.getAppState().todos[z] ?? [];
        return [{ type: "todo_reminder", content: w, itemCount: w.length }]
    }
    return []
}

// READABLE (for understanding):
async function getTodoReminderAttachment(messages, toolUseContext) {
    // Prerequisite: TodoWrite tool must be available
    if (!toolUseContext.options.tools.some((t) => isTool(t, TODO_WRITE_TOOL))) {
        return [];
    }

    // Skip if using Task tool (alternative task management)
    if (TASK_TOOL && toolUseContext.options.tools.some((t) => isTool(t, TASK_TOOL))) {
        return [];
    }

    // Need message history to check
    if (!messages || messages.length === 0) return [];

    // Count turns since last todo write and reminder
    let { turnsSinceLastTodoWrite, turnsSinceLastReminder } = countTurnsSinceTodoAction(messages);

    // Only remind if:
    // 1. Haven't written todo recently (TURNS_SINCE_WRITE threshold)
    // 2. Haven't reminded recently (TURNS_BETWEEN_REMINDERS threshold)
    if (turnsSinceLastTodoWrite >= TURNS_SINCE_WRITE &&
        turnsSinceLastReminder >= TURNS_BETWEEN_REMINDERS) {

        let agentId = toolUseContext.agentId ?? getSessionId();
        let todos = toolUseContext.getAppState().todos[agentId] ?? [];

        return [{
            type: "todo_reminder",
            content: todos,
            itemCount: todos.length
        }];
    }

    return [];
}

// Mapping: ruY→getTodoReminderAttachment, MB→TODO_WRITE_TOOL, CE1→TASK_TOOL,
//   nuY→countTurnsSinceTodoAction, IE1→TODO_CONSTANTS, z3→isTool, R1→getSessionId
```

**Throttling Constants:**

| Constant | Value | Purpose |
|----------|-------|---------|
| `TURNS_SINCE_WRITE` | 3 | Minimum turns after TodoWrite before reminding |
| `TURNS_BETWEEN_REMINDERS` | 2 | Minimum turns between todo reminders |

#### task_reminder Attachment (auY)

**What it does:**
Reminds the model of active background tasks when Task tool hasn't been used recently.

**Source Code:**

```javascript
// ============================================
// getTaskReminderAttachment - Produces background task reminder
// Location: chunks.147.mjs:1013-1031
// ============================================

// ORIGINAL (for source lookup):
async function auY(A, q) {
    if (!r$()) return [];
    if (CE1 && q.options.tools.some((z) => z3(z, CE1))) return [];
    if (!q.options.tools.some((z) => z3(z, ck))) return [];
    if (!A || A.length === 0) return [];
    let { turnsSinceLastTaskManagement: K, turnsSinceLastReminder: Y } = ouY(A);
    if (K >= IE1.TURNS_SINCE_WRITE && Y >= IE1.TURNS_BETWEEN_REMINDERS) {
        let z = await DX(jf());
        return [{ type: "task_reminder", content: z, itemCount: z.length }]
    }
    return []
}

// READABLE (for understanding):
async function getTaskReminderAttachment(messages, toolUseContext) {
    // Prerequisite: Background agents feature must be enabled
    if (!isBackgroundAgentEnabled()) return [];

    // Skip if using alternative task management
    if (TASK_TOOL && toolUseContext.options.tools.some((t) => isTool(t, TASK_TOOL))) {
        return [];
    }

    // Task tool must be available
    if (!toolUseContext.options.tools.some((t) => isTool(t, TASK_TOOL_NAME))) {
        return [];
    }

    if (!messages || messages.length === 0) return [];

    let { turnsSinceLastTaskManagement, turnsSinceLastReminder } =
        countTurnsSinceTaskAction(messages);

    if (turnsSinceLastTaskManagement >= TURNS_SINCE_WRITE &&
        turnsSinceLastReminder >= TURNS_BETWEEN_REMINDERS) {

        let tasks = await getActiveBackgroundTasks(getTaskRegistry());

        return [{
            type: "task_reminder",
            content: tasks,
            itemCount: tasks.length
        }];
    }

    return [];
}

// Mapping: auY→getTaskReminderAttachment, r$→isBackgroundAgentEnabled,
//   ck→TASK_TOOL_NAME, ouY→countTurnsSinceTaskAction, DX→getActiveBackgroundTasks
```

### Attachment Types Summary

| Type | Producer | Purpose | Throttled |
|------|----------|---------|-----------|
| `plan_mode` | DuY | Plan mode context | Yes (by turn count) |
| `plan_mode_reentry` | DuY | Plan file re-entry | No |
| `plan_mode_exit` | XuY | Exit plan mode | No |
| `todo_reminder` | ruY | Todo list state | Yes (by turns since write) |
| `task_reminder` | auY | Background task list | Yes (by turns since write) |
| `auto_mode` | ZuY | Auto mode context | Yes |
| `auto_mode_exit` | GuY | Exit auto mode | No |
| `changed_files` | KuY | Git status changes | No |
| `nested_memory` | MuY | Nested agent memory | No |
| `deferred_tools_delta` | - | MCP tool availability changes | No |
| `async_hook_response` | tuY | Background hook results | No |
| `date_change` | fuY | Date rollover notification | No |
| `edited_text_file` | TuY | Recent file edits | No |

### Attachment Injection Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT INJECTION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  mainAgentLoop (Yh)                                                          │
│      │                                                                        │
│      ├── Turn Start: No attachment injection yet                             │
│      │                                                                        │
│      ├── Tool Execution Complete                                              │
│      │   │                                                                    │
│      │   └── assembleAllAttachments (_uY)                                     │
│      │       ├── Group 1: User-dependent producers                           │
│      │       │   └── Only if @mentions in user message                       │
│      │       ├── Group 2: Always-computed producers (parallel)               │
│      │       │   ├── changed_files (git status)                              │
│      │       │   ├── nested_memory                                           │
│      │       │   ├── todo_reminder                                           │
│      │       │   └── task_reminder                                           │
│      │       └── Group 3: Conditional producers                              │
│      │           └── Based on turn count, throttle state                     │
│      │                                                                        │
│      ├── normalizeAttachmentForAPI (Ui8)                                     │
│      │   └── Convert typed attachments to API messages                       │
│      │                                                                        │
│      └── Inject into message history                                         │
│           └── As user message with <system-reminder> tags                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Functions

| Function | Obfuscated | File:Line | Purpose |
|----------|------------|-----------|---------|
| `assembleAllAttachments` | `_uY` | chunks.147.mjs:3-18 | Main orchestrator for attachment production |
| `timedAttachmentProducer` | `Hz` | chunks.147.mjs:20+ | Telemetry wrapper for producers |
| `normalizeAttachmentForAPI` | `Ui8` | chunks.174.mjs:3-469 | Converts typed attachments to API messages |
| `createUserMessage` | `p1` | chunks.173.mjs:1378+ | Creates attachment message structure |
| `wrapWithSystemReminderTags` | `b5` | chunks.147.mjs | Wraps content in `<system-reminder>` tags |
| `getPlanModeAttachment` | `DuY` | chunks.147.mjs:136-168 | Plan mode reminder |
| `getTodoReminderAttachment` | `ruY` | chunks.147.mjs:972-989 | Todo list reminder |
| `getTaskReminderAttachment` | `auY` | chunks.147.mjs:1013-1031 | Background task reminder |

### Attachment Types Preserved During Compaction

When auto-compact triggers, certain attachment types are preserved:

```javascript
const PRESERVED_ATTACHMENT_TYPES = [
    "plan_mode",           // Plan file content
    "plan_mode_reentry",   // Plan mode context
    "todo_reminder",       // Todo list state
    "task_reminder",       // Task list state
    "edited_text_file",    // File edit records
];
```

### Integration Points in Code

```javascript
// In mainAgentLoopCore (omY) - after tool execution
// Attachments are assembled and injected into context

// Location: chunks.148.mjs (approximate)
let attachments = await assembleAllAttachments({
    toolUseContext,
    messages: mutableMessages,
    sessionContext,
    querySource,
    autoCompactTracking
});

for (let attachment of attachments) {
    let normalizedAttachment = normalizeAttachmentForAPI(attachment);
    mutableMessages.push(normalizedAttachment);
}
```

---

## Integration with 07_compact

### Overview

The compact module integrates at two levels: proactive (pre-query) and reactive (error recovery).

### Proactive Integration (Pre-Query)

```
mainAgentLoop (Yh)
    │
    ├── Turn Start
    │   │
    │   ├── K5("query_microcompact_start")
    │   │   │
    │   │   └── microcompact (pg)
    │   │       └── Remove consecutive duplicate messages
    │   │
    │   ├── K5("query_autocompact_start")
    │   │   │
    │   │   └── autoCompact (sqq)
    │   │       ├── Check token threshold
    │   │       ├── If over: generate summary
    │   │       └── Replace messages with summary + attachments
    │   │
    │   └── K5("query_autocompact_end")
    │
    └── Continue to LLM query
```

### Reactive Integration (Error Recovery)

When `context_length_exceeded` error occurs:

```
withApiRetry (_P1)
    │
    └── On error:
        ├── parseContextOverflowError ($54)
        │   └── Extract inputTokens, contextLimit
        │
        ├── Calculate available space
        │   └── available = contextLimit - inputTokens - 1000
        │
        ├── If available < FLOOR_OUTPUT_TOKENS
        │   └── Cannot recover, throw error
        │
        └── Else:
            └── Set maxTokensOverride, retry
```

### Shared State

```javascript
autoCompactTracking = {
    compacted: true,              // Has compaction occurred?
    turnId: "uuid",               // Unique ID for this compaction
    turnCounter: 0,               // Turns since compaction
    consecutiveFailures: 0,       // Failed compaction attempts
    previousCompactTurnId: "uuid" // Previous compaction turn ID
};
```

---

## Integration with 05_tools

### Tool Schema Building

Before each API request, tool schemas are built from registered tools:

```javascript
// In streamingQueryCore (mGq) - chunks.171.mjs:40-48
let toolSchemas = await Promise.all(filteredTools.map((tool) =>
    buildToolSchema(tool, {
        getToolPermissionContext,
        tools: allTools,
        agents,
        allowedAgentTypes,
        model,
        betas,
        deferLoading: useDynamicLoading && isDeferredTool(tool)
    })
));
```

### Tool Dispatcher Integration

When the LLM returns tool_use blocks:

```
tool_use block from LLM
    │
    └── toolDispatcher (Wi6)
        │
        ├── Lookup tool by name
        │
        ├── validateInput (tool-specific)
        │   └── Check input against schema
        │
        ├── checkPermissions
        │   ├── Check permission rules
        │   ├── Check auto-allow status
        │   └── Ask user if needed
        │
        ├── executePreToolHooks
        │   └── Run hook chain
        │
        ├── tool.call(input, context)
        │   └── Execute tool implementation
        │
        ├── executePostToolHooks
        │   └── Run hook chain
        │
        └── Return tool_result
```

### Streaming Tool Executor

For parallel tool execution during streaming:

```javascript
// StreamingToolExecutor class (ui6) - chunks.148.mjs:3-228

class StreamingToolExecutor {
    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        this.tools = [];
    }

    addTool(toolUse, assistantMessage) {
        // Queue tool for execution
        let tool = this.toolDefinitions.find(t => t.name === toolUse.name);
        if (!tool) {
            // Error: unknown tool
            this.tools.push({
                id: toolUse.id,
                status: "completed",
                results: [createToolNotFoundError(toolUse.name)]
            });
            return;
        }

        // Parse and validate input
        let parsedInput = tool.inputSchema.safeParse(toolUse.input);

        this.tools.push({
            id: toolUse.id,
            block: toolUse,
            status: "queued",
            isConcurrencySafe: tool.isConcurrencySafe?.(parsedInput.data)
        });

        this.processQueue();
    }

    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
    }

    async processQueue() {
        for (let tool of this.tools) {
            if (tool.status !== "queued") continue;
            if (this.canExecuteTool(tool.isConcurrencySafe)) {
                await this.executeTool(tool);
            } else if (!tool.isConcurrencySafe) {
                break;  // Wait for non-concurrent tool to complete
            }
        }
    }

    *getCompletedResults() {
        for (let tool of this.tools) {
            if (tool.status === "completed" && tool.results) {
                tool.status = "yielded";
                for (let result of tool.results) {
                    yield { message: result, newContext: this.toolUseContext };
                }
            }
        }
    }
}
```

---

## Integration with 12_hooks

### Hook Execution Points

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         HOOK INTEGRATION POINTS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Pre-Query Hooks                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ • Before each LLM request (optional)                                 │   │
│  │ • Can modify messages or abort request                                │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Pre-Tool Hooks                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ • Before tool execution in executeToolCore (fxY)                     │   │
│  │ • Can modify input, abort, or add metadata                           │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Post-Tool Hooks                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ • After tool execution in executeToolCore (fxY)                      │   │
│  │ • Can modify result, add metadata                                    │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Notification Hooks                                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ • On completion, error, or other events                              │   │
│  │ • Read-only, for logging/notifications                               │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Hook Execution in executeToolCore

```javascript
// In executeToolCore (fxY) - chunks.146.mjs:442+
async function executeToolCore(tool, input, context) {
    try {
        // 1. Pre-tool hooks
        let hookResult = await executePreToolHooks(tool, input, context);
        if (hookResult.shouldAbort) {
            return createAbortResult(input.id, hookResult.reason);
        }

        // 2. Permission check
        let permissionResult = await checkToolPermission(tool, input, context);
        if (permissionResult.denied) {
            return createDeniedResult(input.id, permissionResult.reason);
        }

        // 3. Execute tool
        let result = await tool.call(input, context);

        // 4. Post-tool hooks
        let postHookResult = await executePostToolHooks(tool, input, result, context);
        if (postHookResult.modifiedResult) {
            result = postHookResult.modifiedResult;
        }

        return result;

    } catch (error) {
        // Error isolation - return error result, don't crash
        return createErrorResult(input.id, error.message);
    }
}
```

---

## Integration with 06_mcp

### MCP Tool Registration

MCP tools are registered and made available to the LLM:

```javascript
// MCP tools are included in the tool list sent to API
let allTools = [
    ...builtinTools,      // Read, Write, Edit, etc.
    ...mcpTools,          // Tools from MCP servers
    ...agentTools         // Agent, Task tools
];

// MCP tool schemas include server metadata
let mcpToolSchema = {
    name: tool.name,
    description: tool.description,
    input_schema: tool.inputSchema,
    // MCP-specific fields
    isMcp: true,
    serverName: tool.serverName
};
```

### MCP Instructions in System Prompt

```javascript
// In buildSystemPrompt (R0) - chunks.168.mjs
// MCP instructions section is added dynamically

let mcpInstructionsSection = buildMcpInstructionsSection(mcpServers);

// Content example:
// # MCP Server Instructions
//
// The following MCP servers have provided instructions:
//
// ## filesystem
// [Server-specific instructions]
```

---

## Integration with 16_thinking_mode

### Thinking Configuration Flow

```
User request with thinking enabled
    │
    ├── In streamingQueryCore (mGq)
    │   │
    │   ├── supportsThinking(model)? (QG7)
    │   │   └── Check model supports thinking
    │   │
    │   ├── supportsAdaptiveThinking(model)? (I21)
    │   │   └── Check model supports adaptive
    │   │
    │   ├── If adaptive:
    │   │   └── thinking: { type: "adaptive" }
    │   │
    │   └── If enabled:
    │       ├── getThinkingBudgetLimits(model) (oa)
    │       │   └── Get model-specific limits
    │       │
    │       └── thinking: { type: "enabled", budget_tokens: N }
    │
    └── API request includes thinking config
```

### Temperature Exclusion

When thinking is enabled, temperature is excluded:

```javascript
// In request parameter builder - chunks.171.mjs:156
let temperature = !isThinkingEnabled ? temperatureOverride ?? 1 : undefined;

// Only include temperature when thinking is disabled
if (temperature !== undefined) {
    requestParams.temperature = temperature;
}
```

---

## Integration with 17_telemetry

### Key Telemetry Events

```javascript
// API Request Events
logEvent("api_request_sent", {
    model: string,
    messagesLength: number,
    betas: string[],
    thinkingType: string,
    effortValue: number,
    fastMode: boolean
});

// Streaming Events
logEvent("tengu_streaming_stall", {
    stall_duration_ms: number,
    stall_count: number,
    event_type: string,
    model: string
});

// Error Events
logEvent("tengu_api_retry", {
    attempt: number,
    delayMs: number,
    error: string,
    status: number
});

// Context Overflow Events
logEvent("tengu_max_tokens_context_overflow_adjustment", {
    inputTokens: number,
    contextLimit: number,
    adjustedMaxTokens: number,
    attempt: number
});

// Compaction Events
logEvent("tengu_auto_compact_succeeded", {
    originalMessageCount: number,
    compactedMessageCount: number,
    preCompactTokenCount: number,
    postCompactTokenCount: number
});
```

---

## Integration with 01_CLI/UI

### Event Flow to UI

```
streamingQueryCore (mGq) yields events
    │
    ├── mainAgentLoop (Yh) passes through
    │
    └── handleStreamedEvent (T11) in REPL component
        │
        └── processStreamEvent (iW1)
            │
            ├── type: "assistant" → add to messages state
            ├── type: "user" → add to messages state
            ├── type: "stream_event" → update streaming state
            │   ├── content_block_start → setStreamMode()
            │   ├── content_block_delta → onStreamingChunk()
            │   └── message_stop → reset streaming state
            │
            └── React re-renders UI
```

### State Updates

| Event Type | State Update | UI Effect |
|------------|--------------|-----------|
| `stream_request_start` | `setStreamMode("requesting")` | Shows requesting indicator |
| `content_block_start` (text) | `setStreamMode("responding")` | Shows response streaming |
| `content_block_start` (thinking) | `setStreamMode("thinking")` | Shows thinking animation |
| `content_block_start` (tool_use) | `setStreamMode("tool-input")` | Shows "Building tool input..." |
| `content_block_stop` | No immediate update | Waiting for complete message |
| `assistant` | `setMessages([...prev, event])` | Adds to transcript |
| `tombstone` | `setMessages(prev => filter...)` | Removes from transcript |

---

## Summary

The LLM core's cross-feature integration enables:

1. **Context injection** via system reminders (04_system_reminder)
2. **Token management** via compaction (07_compact)
3. **Tool execution** via dispatcher and streaming executor (05_tools)
4. **Extensibility** via hooks (12_hooks)
5. **External tools** via MCP integration (06_mcp)
6. **Reasoning** via thinking mode (16_thinking_mode)
7. **Observability** via telemetry (17_telemetry)
8. **User feedback** via UI events (01_CLI)

These integrations are carefully designed to be:
- **Non-blocking**: Attachments, compaction, and hooks are async
- **Error-isolated**: Failures in one integration don't crash the core
- **Observable**: All integration points emit telemetry
- **Configurable**: Most integrations have feature flags or settings