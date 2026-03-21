# Reminder Integration (Claude Code 2.1.76)

> Complete analysis of the system reminder/attachment system: how contextual information is produced, normalized, and injected into the conversation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `assembleAllAttachments` (_uY) - Main orchestrator for attachment production (VERIFIED: chunks.147.mjs:3-18)
- `normalizeAttachmentForAPI` (Ui8) - Converts typed attachments to API messages (VERIFIED: chunks.174.mjs:3-469)
- `attachmentGenerator` (Vf6) - Async generator that yields attachment messages (VERIFIED: chunks.147.mjs:822-829)
- `createUserMessage` (p1) - Creates the attachment message structure (VERIFIED: chunks.173.mjs:1378+)
- `timedAttachmentProducer` (Hz) - Wraps producers with timing and error handling
- `wrapWithSystemReminderTags` (b5) - Wraps content in `<system-reminder>` tags

---

## Cross-Feature Linkages

### Integration with Agent Loop (mainAgentLoop)

The reminder system integrates deeply with the agent loop at several key points:

```
mainAgentLoop (Yh)
    │
    ├── Turn Start
    │   └── (No attachment injection yet - wait for tool execution)
    │
    ├── Tool Execution Complete
    │   │
    │   └── assembleAllAttachments (_uY)
    │       ├── Group 1: User-dependent producers
    │       │   └── Only if user message contains @mentions
    │       ├── Group 2: Always-computed producers (parallel)
    │       │   ├── changed_files (git status)
    │       │   ├── nested_memory
    │       │   ├── plan_mode reminders
    │       │   ├── todo_reminders
    │       │   └── team_context
    │       └── Group 3: Main-agent-only producers (parallel)
    │           ├── ide_selection
    │           ├── diagnostics
    │           ├── token_usage
    │           └── queued_commands
    │
    ├── normalizeAttachmentForAPI (Ui8)
    │   └── 57+ case switch statement
    │       └── Converts typed attachments → formatted messages
    │
    └── attachmentGenerator (Vf6)
        └── Yields messages for injection into conversation
            └── Inserted before next API call
```

### Message Flow Timing

```
Turn N:
  1. User message received
  2. Tool execution (if any tools called)
  3. [ATTACHMENT PRODUCTION] ← assembleAllAttachments called here
  4. Attachments normalized via Ui8
  5. Messages yielded via Vf6
  6. Next API call includes both tool results AND attachments
```

**Why this timing?** Attachments are produced after tool execution because:
1. Tool execution may modify files (changed_files attachment needs latest state)
2. Tool execution may change todo list (todo_reminder needs latest items)
3. Tool execution may change plan state (plan_mode attachment needs latest state)

### Integration with 04_system_reminder Module

The `03_llm_core/reminder_integration.md` document describes the **producer layer** (what attachments exist and how they're computed). The `04_system_reminder/` module describes the **normalization layer** (how attachments are formatted and injected).

**Key Cross-References:**
- **Producers** (this document): `_uY`, `Hz`, individual producer functions
- **Normalizers** (04_system_reminder): `Ui8`, `b5`, `p1`
- **Full architecture**: See [04_system_reminder/overview.md](../04_system_reminder/overview.md)

---

## Architecture Overview

The reminder system provides contextual information to the LLM through "attachments":

### Attachment Categories

**User-Dependent Producers (only if mentions present):**
- `@file mentions` ────► extractAtMentionedFiles
- `@mcp://` mentions ──► extractMcpResources
- `@agent mentions` ──► extractAgentMentions

**Always-Computed:**
- Changed files → getChangedFilesAttachment
- Nested memory → getNestedMemoryAttachments
- Dynamic skills → getDynamicSkillAttachments
- Plan mode → getPlanModeAttachment
- Todo reminders → getTodoReminderAttachment

**Main-Agent-Only:**
- IDE selection → getIdeSelectionAttachment
- IDE opened file → getIdeOpenedFileAttachment
- Diagnostics → getDiagnosticsAttachment
- LSP diagnostics → getLspDiagnosticsAttachment
- Token usage → getTokenUsageAttachment
- Budget USD → getBudgetUsdAttachment

**Team/Swarm Mode:**
- Teammate mailbox → getTeammateMailboxAttachment
- Team context → getTeamContextAttachment

---

## Core Algorithms

### assembleAllAttachments - Main orchestrator

**What it does:**
The `assembleAllAttachments` (_uY) function coordinates the production of all attachment types. It runs multiple producers in parallel and aggregates their results.

**Source Code (VERIFIED):**

```javascript
// ============================================
// assembleAllAttachments - Orchestrates parallel attachment production
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = {
            ...q,
            abortController: w
        },
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), Hz("mcp_resources", () => SuY(A, $)), Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents))), ...[]] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => Promise.resolve(fuY())), Hz("ultrathink_effort", () => Promise.resolve(TuY(A))), Hz("deferred_tools_delta", () => Promise.resolve(xE1(q.options.tools, q.options.mainLoopModel, z))), Hz("mcp_instructions_delta", () => Promise.resolve(uE1(q.options.mcpClients, q.options.tools, q.options.mainLoopModel, z))), Hz("changed_files", () => CuY($)), Hz("nested_memory", () => IuY($)), Hz("dynamic_skill", () => BuY($)), Hz("skill_listing", () => guY($)), Hz("ultra_claude_md", async () => VuY(z)), Hz("plan_mode", () => DuY(z, q)), Hz("plan_mode_exit", () => XuY(q)), Hz("auto_mode", () => ZuY(z, q)), Hz("auto_mode_exit", () => GuY(q)), Hz("todo_reminders", () => r$() ? auY(z, q) : ruY(z, q)), ...E7() ? [..._ === "session_memory" ? [] : [Hz("teammate_mailbox", async () => euY(q))], Hz("team_context", async () => AmY(z ?? []))] : [], Hz("agent_pending_messages", async () => $uY(q)), Hz("critical_system_reminder", () => Promise.resolve(vuY(q)))],
        D = H ? [Hz("ide_selection", async () => kuY(K, q)), Hz("ide_opened_file", async () => LuY(K, q)), Hz("output_style", async () => Promise.resolve(NuY())), Hz("diagnostics", async () => cuY(q)), Hz("lsp_diagnostics", async () => luY(q)), Hz("unified_tasks", async () => suY(q)), Hz("async_hook_responses", async () => tuY()), Hz("token_usage", async () => Promise.resolve(qmY(z ?? [], q.options.mainLoopModel))), Hz("budget_usd", async () => Promise.resolve(YmY(q.options.maxBudgetUsd))), Hz("output_token_usage", async () => Promise.resolve(KmY())), Hz("verify_plan_reminder", async () => _mY(z, q)), Hz("queued_commands", () => OuY(Y))] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}

// READABLE (for understanding):
async function assembleAllAttachments(userMessage, toolUseContext, ideContext, queuedCommands, messages, memoryType) {
    // 1. Early exit check
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // 2. Set up 1-second timeout abort controller
    let abortController = createAbortController();
    let timeout = setTimeout((ac) => ac.abort(), 1000, abortController);
    let contextWithAbort = {
        ...toolUseContext,
        abortController: abortController
    };

    // 3. Determine if this is main agent (not subagent)
    let isMainAgent = !toolUseContext.agentId;

    // 4. Group 1: User-dependent producers (sequential, await completion)
    let userDependentProducers = userMessage ? [
        timedProducer("at_mentioned_files", () => extractAtMentionedFiles(userMessage, contextWithAbort)),
        timedProducer("mcp_resources", () => extractMcpResources(userMessage, contextWithAbort)),
        timedProducer("agent_mentions", () => Promise.resolve(extractAgentMentions(userMessage, toolUseContext.options.agentDefinitions.activeAgents)))
    ] : [];
    let userDependentResults = await Promise.all(userDependentProducers);

    // 5. Group 2: Always-computed producers (parallel)
    let alwaysComputedProducers = [
        timedProducer("date_change", () => Promise.resolve(getDateChangeAttachment())),
        timedProducer("ultrathink_effort", () => Promise.resolve(getUltrathinkEffortAttachment(userMessage))),
        timedProducer("deferred_tools_delta", () => Promise.resolve(getDeferredToolsDelta(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages))),
        timedProducer("mcp_instructions_delta", () => Promise.resolve(getMcpInstructionsDelta(toolUseContext.options.mcpClients, toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages))),
        timedProducer("changed_files", () => getChangedFilesAttachment(contextWithAbort)),
        timedProducer("nested_memory", () => getNestedMemoryAttachment(contextWithAbort)),
        timedProducer("dynamic_skill", () => getDynamicSkillAttachment(contextWithAbort)),
        timedProducer("skill_listing", () => getSkillListingAttachment(contextWithAbort)),
        timedProducer("ultra_claude_md", async () => getUltraClaudeMdAttachment(messages)),
        timedProducer("plan_mode", () => getPlanModeAttachment(messages, toolUseContext)),
        timedProducer("plan_mode_exit", () => getPlanModeExitAttachment(toolUseContext)),
        timedProducer("auto_mode", () => getAutoModeAttachment(messages, toolUseContext)),
        timedProducer("auto_mode_exit", () => getAutoModeExitAttachment(toolUseContext)),
        timedProducer("todo_reminders", () => isSessionMemory() ? getSessionTodoAttachment(messages, toolUseContext) : getTodoReminderAttachment(messages, toolUseContext)),
        // Team mode additions
        ...(isTeamMode() ? [
            ...(memoryType === "session_memory" ? [] : [timedProducer("teammate_mailbox", async () => getTeammateMailboxAttachment(toolUseContext))]),
            timedProducer("team_context", async () => getTeamContextAttachment(messages ?? []))
        ] : []),
        timedProducer("agent_pending_messages", async () => getAgentPendingMessagesAttachment(toolUseContext)),
        timedProducer("critical_system_reminder", () => Promise.resolve(getCriticalSystemReminder(toolUseContext)))
    ];

    // 6. Group 3: Main-agent-only producers (parallel with Group 2)
    let mainAgentOnlyProducers = isMainAgent ? [
        timedProducer("ide_selection", async () => getIdeSelectionAttachment(ideContext, toolUseContext)),
        timedProducer("ide_opened_file", async () => getIdeOpenedFileAttachment(ideContext, toolUseContext)),
        timedProducer("output_style", async () => Promise.resolve(getOutputStyleAttachment())),
        timedProducer("diagnostics", async () => getDiagnosticsAttachment(toolUseContext)),
        timedProducer("lsp_diagnostics", async () => getLspDiagnosticsAttachment(toolUseContext)),
        timedProducer("unified_tasks", async () => getUnifiedTasksAttachment(toolUseContext)),
        timedProducer("async_hook_responses", async () => getAsyncHookResponsesAttachment()),
        timedProducer("token_usage", async () => Promise.resolve(getTokenUsageAttachment(messages ?? [], toolUseContext.options.mainLoopModel))),
        timedProducer("budget_usd", async () => Promise.resolve(getBudgetUsdAttachment(toolUseContext.options.maxBudgetUsd))),
        timedProducer("output_token_usage", async () => Promise.resolve(getOutputTokenUsageAttachment())),
        timedProducer("verify_plan_reminder", async () => getVerifyPlanReminderAttachment(messages, toolUseContext)),
        timedProducer("queued_commands", () => getQueuedCommandsAttachment(queuedCommands))
    ] : [];

    // 7. Run Groups 2 and 3 in parallel
    let [alwaysResults, mainAgentResults] = await Promise.all([
        Promise.all(alwaysComputedProducers),
        Promise.all(mainAgentOnlyProducers)
    ]);

    // 8. Clear timeout and aggregate results
    clearTimeout(timeout);
    return [
        ...userDependentResults.flat(),
        ...alwaysResults.flat(),
        ...mainAgentResults.flat()
    ].filter((item) => item !== undefined && item !== null);
}

// Mapping: _uY→assembleAllAttachments, A→userMessage, q→toolUseContext,
//   K→ideContext, Y→queuedCommands, z→messages, _→memoryType,
//   t6→parseBoolean, sK→createAbortController, Hz→timedProducer,
//   H→isMainAgent, j→userDependentProducers, M→alwaysComputedProducers,
//   D→mainAgentOnlyProducers
```

**How it works:**

1. **Early Exit Check**: If `CLAUDE_CODE_DISABLE_ATTACHMENTS` is set, returns empty array immediately.

2. **Abort Controller Setup**: Creates a 1-second timeout abort controller to prevent hanging on slow producers.

3. **Producer Categories**: Organizes producers into three groups:
   - **User-dependent** (Group 1): Only run if user input contains relevant mentions - MUST complete before Groups 2/3
   - **Always-computed** (Group 2): Run on every turn
   - **Main-agent-only** (Group 3): Only run when not in a subagent context - runs PARALLEL with Group 2

4. **Parallel Execution**: Uses `Promise.all()` to run Groups 2 and 3 concurrently.

5. **Result Aggregation**: Flattens all producer results into a single array, filtering null/undefined.

**Why this approach:**
- **Parallel execution**: Groups 2 and 3 run concurrently, minimizing total latency.
- **Abort timeout**: The 1-second timeout prevents a slow producer from blocking the entire conversation.
- **Sequential Group 1**: User-dependent producers must complete first because they may affect what other producers return.
- **Main-agent isolation**: Some producers (like IDE selection) are only relevant to the main agent, not subagents.

**Key insight:** The attachment system is designed for resilience. Each producer is wrapped in `timedAttachmentProducer` (Hz) which catches errors and returns an empty array on failure. This ensures that a single failing producer doesn't break the entire attachment pipeline.

---

### timedAttachmentProducer - Error handling wrapper

**What it does:**
Wraps an attachment producer with timing, error handling, and optional sampling for telemetry.

**Source Code (VERIFIED):**

```javascript
// ============================================
// timedAttachmentProducer - Wraps producers with error handling and telemetry
// Location: chunks.147.mjs:20-46
// ============================================

// ORIGINAL (for source lookup):
async function Hz(A, q) {
    let K = Date.now();
    try {
        let Y = await q(),
            z = Date.now() - K;
        if (Math.random() < 0.05) {
            let _ = Y.filter((w) => w !== void 0 && w !== null).reduce((w, O) => {
                return w + B6(O).length
            }, 0);
            d("tengu_attachment_compute_duration", {
                label: A,
                duration_ms: z,
                attachment_size_bytes: _,
                attachment_count: Y.length
            })
        }
        return Y
    } catch (Y) {
        let z = Date.now() - K;
        if (Math.random() < 0.05) d("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            error: !0
        });
        return _6(Y), jV(`Attachment error in ${A}`, Y), []
    }
}

// READABLE (for understanding):
async function timedAttachmentProducer(label, producer) {
    let startTime = Date.now();
    try {
        let result = await producer();
        let duration = Date.now() - startTime;

        // 5% sampling for telemetry
        if (Math.random() < 0.05) {
            let totalSize = result
                .filter((item) => item !== undefined && item !== null)
                .reduce((sum, item) => sum + JSON.stringify(item).length, 0);

            logEvent("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                attachment_size_bytes: totalSize,
                attachment_count: result.length
            });
        }
        return result;
    } catch (error) {
        let duration = Date.now() - startTime;
        if (Math.random() < 0.05) {
            logEvent("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                error: true
            });
        }
        reportError(error);
        logWarning(`Attachment error in ${label}`, error);
        return []; // Never break the pipeline
    }
}

// Mapping: Hz→timedAttachmentProducer, A→label, q→producer,
//   d→logEvent, B6→JSON.stringify, _6→reportError, jV→logWarning
```

**How it works:**

1. Records start time
2. Calls producer function
3. Calculates duration and size
4. Samples 5% of calls for telemetry
5. On error, catches exception and returns empty array (never breaks pipeline)

**Why 5% sampling:** Running telemetry on every attachment would add significant overhead and noise. 5% sampling provides statistically meaningful data without impacting performance.

---

### attachmentGenerator - Async generator for message injection

**What it does:**
The `attachmentGenerator` (oP1) is an async generator that produces attachment messages for injection into the conversation stream.

**How it works:**

1. Produce all attachments via `assembleAttachments()`
2. Log telemetry for what was produced
3. Yield each attachment as a message

---

## Attachment Types

Each attachment is an object with at minimum a `type` field:

```typescript
type Attachment =
    | { type: "file", filename: string, content: FileContent }
    | { type: "at_mentioned_file", filename: string, content: FileContent }
    | { type: "already_read_file", filename: string, content: FileContent }
    | { type: "pdf_reference", filename: string, pageCount: number }
    | { type: "changed_files", files: ChangedFileInfo[] }
    | { type: "nested_memory", path: string, content: MemoryContent }
    | { type: "dynamic_skill", skill_name: string, prompt: string }
    | { type: "plan_mode", reminderType: "full" | "sparse", ... }
    | { type: "todo_reminder", content: TodoItem[], itemCount: number }
    | { type: "task_reminder", content: TaskItem[], itemCount: number }
    | { type: "diagnostics", files: DiagnosticInfo[] }
    | { type: "token_usage", inputTokens: number, outputTokens: number }
    | { type: "budget_usd", budget: number }
    | { type: "queued_command", prompt: string, source_uuid: string }
```

---

## Meta-Message Format

### wrapWithSystemReminderTags - Content wrapping

**What it does:**
Wraps content in `<system-reminder>` tags that signal to the LLM that this is contextual information.

**How it works:**

1. Maps over messages array
2. For string content: wraps directly
3. For array content: wraps each text block
4. Non-text blocks pass through unchanged

---

## Specific Attachment Producers

### Producer Function Index (VERIFIED)

| Symbol | Producer Name | Location | Description |
|--------|---------------|----------|-------------|
| RuY | extractAtMentionedFiles | chunks.147.mjs:407 | Parse @file mentions from user message |
| SuY | extractMcpResources | chunks.147.mjs:464 | Extract @mcp:// resource references |
| huY | extractAgentMentions | chunks.147.mjs:450 | Parse @agent mentions |
| fuY | getDateChangeAttachment | chunks.147.mjs:237 | Detect date change since last turn |
| TuY | getUltrathinkEffortAttachment | chunks.147.mjs:248 | Get thinking effort level reminder |
| xE1 | getDeferredToolsDeltaAttachment | chunks.147.mjs:256 | Deferred tools available notification |
| uE1 | getMcpInstructionsDeltaAttachment | chunks.147.mjs:269 | MCP server instruction updates |
| CuY | getChangedFilesAttachment | chunks.147.mjs:497 | Git status of modified files |
| IuY | getNestedMemoryAttachment | chunks.147.mjs | CLAUDE.md memory files |
| BuY | getDynamicSkillAttachment | chunks.147.mjs | Dynamic skill prompts |
| guY | getSkillListingAttachment | chunks.147.mjs | Available skills list |
| VuY | getUltraClaudeMdAttachment | chunks.147.mjs | Ultra CLAUDE.md content |
| DuY | getPlanModeAttachment | chunks.147.mjs | Plan mode state reminder |
| XuY | getPlanModeExitAttachment | chunks.147.mjs | Plan mode exit notification |
| ZuY | getAutoModeAttachment | chunks.147.mjs | Auto mode state reminder |
| GuY | getAutoModeExitAttachment | chunks.147.mjs | Auto mode exit notification |
| ruY | getTodoReminderAttachment | chunks.147.mjs | Todo list reminder |
| auY | getSessionTodoAttachment | chunks.147.mjs | Session memory todo |
| euY | getTeammateMailboxAttachment | chunks.147.mjs | Team mailbox messages |
| AmY | getTeamContextAttachment | chunks.147.mjs | Team coordination context |
| $uY | getAgentPendingMessagesAttachment | chunks.147.mjs:70 | Agent pending messages |
| vuY | getCriticalSystemReminder | chunks.147.mjs | Critical system notifications |
| kuY | getIdeSelectionAttachment | chunks.147.mjs | IDE selected text |
| LuY | getIdeOpenedFileAttachment | chunks.147.mjs | IDE opened file |
| NuY | getOutputStyleAttachment | chunks.147.mjs | Output style preference |
| cuY | getDiagnosticsAttachment | chunks.147.mjs | IDE diagnostics |
| luY | getLspDiagnosticsAttachment | chunks.147.mjs | LSP diagnostics |
| suY | getUnifiedTasksAttachment | chunks.147.mjs | Unified task list |
| tuY | getAsyncHookResponsesAttachment | chunks.147.mjs | Async hook responses |
| qmY | getTokenUsageAttachment | chunks.147.mjs | Token usage stats |
| YmY | getBudgetUsdAttachment | chunks.147.mjs | USD budget tracking |
| KmY | getOutputTokenUsageAttachment | chunks.147.mjs | Output token usage |
| _mY | getVerifyPlanReminderAttachment | chunks.147.mjs | Plan verification reminder |
| OuY | getQueuedCommandsAttachment | chunks.147.mjs:48 | Queued commands |

### Plan Mode Attachments

Plan mode has three reminder types based on conversation state:
- **full**: Comprehensive reminder shown periodically
- **sparse**: Minimal reminder to save tokens
- **reentry**: Shown when returning to plan mode

### Todo/Task Reminders

Produced based on thresholds:
- `TURNS_SINCE_WRITE`: How many turns since last todo write (default: 10)
- `TURNS_BETWEEN_REMINDERS`: How many turns between reminder shows (default: 10)

### Token Usage Attachment

Calculates and displays:
- Input tokens used
- Output tokens used
- Total tokens
- Context limit percentage

### Changed Files Attachment

Git status grouped by:
- Modified files (M)
- Added files (A)
- Deleted files (D)
- Untracked files (??)

---

## Injection Timing

Attachments are produced at specific points:

1. **After Tool Execution**: mainAgentLoop → oP1 called after tools complete
2. **At Session Start**: Initial context injection on first query
3. **On User Input with Mentions**: @file, @mcp://, @agent parsed and injected
4. **On Mode Transitions**: Plan mode enter/exit, delegate mode changes

---

## Constants and Configuration

```javascript
// Plan mode constants
const PLAN_MODE_CONSTANTS = {
    TURNS_BETWEEN_ATTACHMENTS: 5,
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
};

// Todo reminder constants
const TODO_REMINDER_CONSTANTS = {
    TURNS_SINCE_WRITE: 10,
    TURNS_BETWEEN_REMINDERS: 10
};

// Maximum file lines for attachment
const MAX_FILE_LINES = 2000;
```

---

## Complete Attachment Producer Reference (VERIFIED)

### All Producers from Source (chunks.147.mjs:13-15)

**Group 1: User-Dependent Producers** (only if user message contains @mentions)

| Symbol | Producer Name | Description |
|--------|---------------|-------------|
| `RuY` | extractAtMentionedFiles | Parse `@file` mentions from user message |
| `SuY` | extractMcpResources | Extract `@mcp://` resource references |
| `huY` | extractAgentMentions | Parse `@agent` mentions for multi-agent |

**Group 2: Always-Computed Producers** (run on every turn)

| Symbol | Producer Name | Description |
|--------|---------------|-------------|
| `fuY` | getDateChangeAttachment | Detect date change since last turn |
| `TuY` | getUltrathinkEffortAttachment | Get thinking effort level reminder |
| `xE1` | getDeferredToolsDeltaAttachment | Deferred tools available notification |
| `uE1` | getMcpInstructionsDeltaAttachment | MCP server instruction updates |
| `CuY` | getChangedFilesAttachment | Git status of modified files |
| `IuY` | getNestedMemoryAttachment | CLAUDE.md memory files |
| `BuY` | getDynamicSkillAttachment | Dynamic skill prompts |
| `guY` | getSkillListingAttachment | Available skills list |
| `VuY` | getUltraClaudeMdAttachment | Ultra CLAUDE.md content |
| `DuY` | getPlanModeAttachment | Plan mode state reminder |
| `XuY` | getPlanModeExitAttachment | Plan mode exit notification |
| `ZuY` | getAutoModeAttachment | Auto mode state reminder |
| `GuY` | getAutoModeExitAttachment | Auto mode exit notification |
| `auY` | getSessionTodoAttachment | Session memory todo (when enabled) |
| `ruY` | getTodoReminderAttachment | Todo list reminder (standard) |
| `euY` | getTeammateMailboxAttachment | Team mailbox messages |
| `AmY` | getTeamContextAttachment | Team coordination context |
| `$uY` | getAgentPendingMessagesAttachment | Agent pending messages |
| `vuY` | getCriticalSystemReminder | Critical system notifications |

**Group 3: Main-Agent-Only Producers** (skipped for subagents)

| Symbol | Producer Name | Description |
|--------|---------------|-------------|
| `kuY` | getIdeSelectionAttachment | IDE selected text |
| `LuY` | getIdeOpenedFileAttachment | IDE opened file |
| `NuY` | getOutputStyleAttachment | Output style preference |
| `cuY` | getDiagnosticsAttachment | IDE diagnostics |
| `luY` | getLspDiagnosticsAttachment | LSP diagnostics |
| `suY` | getUnifiedTasksAttachment | Unified task list |
| `tuY` | getAsyncHookResponsesAttachment | Async hook responses |
| `qmY` | getTokenUsageAttachment | Token usage stats |
| `YmY` | getBudgetUsdAttachment | USD budget tracking |
| `KmY` | getOutputTokenUsageAttachment | Output token usage |
| `_mY` | getVerifyPlanReminderAttachment | Plan verification reminder |
| `OuY` | getQueuedCommandsAttachment | Queued commands |

---

## Attachment Type Reference

### All Attachment Types for Normalization (VERIFIED from source)

The `normalizeAttachmentForAPI` (Ui8) function in chunks.174.mjs:3-469 handles these attachment types:

#### File-Related Types

| Type | Description | Output Format |
|------|-------------|---------------|
| `file` | File read with @mention | Tool use/result blocks with Read tool format |
| `at_mentioned_file` | Parsed @file mention | Same as `file` type |
| `already_read_file` | Previously read file | Empty array (no output) |
| `edited_text_file` | File edit record | Meta message with diff snippet |
| `edited_image_file` | Image edit record | Empty array (no output) |
| `compact_file_reference` | File from compacted history | Meta message noting file was read before |
| `pdf_reference` | PDF file reference | Meta message with page count and usage instructions |
| `directory` | Directory listing | Tool use/result blocks with Bash ls command |

#### IDE Integration Types

| Type | Description | Output Format |
|------|-------------|---------------|
| `selected_lines_in_ide` | IDE selected text | Meta message with selected lines and range |
| `opened_file_in_ide` | IDE opened file | Meta message noting file opened |
| `diagnostics` | IDE diagnostics | Meta message with `<new-diagnostics>` XML tags |

#### Mode State Types

| Type | Description | Output Format |
|------|-------------|---------------|
| `plan_mode` | Plan mode state | Full/sparse/reentry reminder via Wzz |
| `plan_mode_reentry` | Returning to plan mode | Meta message with plan file info |
| `plan_mode_exit` | Exiting plan mode | Meta message confirming exit |
| `plan_file_reference` | Existing plan file | Meta message with plan contents |
| `auto_mode` | Auto mode state | Reminder via Lzz |
| `auto_mode_exit` | Exiting auto mode | Meta message confirming exit |

#### Task/Todo Types

| Type | Description | Output Format |
|------|-------------|---------------|
| `todo_reminder` | Todo items | Meta message with todo list |
| `task_reminder` | Task items | Meta message with task list (when tasks enabled) |
| `task_status` | Background task status | Meta message with task status |

#### Memory & Context Types

| Type | Description | Output Format |
|------|-------------|---------------|
| `nested_memory` | MEMORY.md content | Meta message with memory file contents |
| `relevant_memories` | Related memory files | Array of meta messages with memory contents |
| `dynamic_skill` | Dynamic skill prompt | Empty array (handled separately) |
| `skill_listing` | Available skills list | Meta message with skill list |
| `invoked_skills` | Previously invoked skills | Meta message with skill contents |

#### MCP & Agent Types

| Type | Description | Output Format |
|------|-------------|---------------|
| `mcp_resource` | MCP server resource | Meta message with resource contents |
| `mcp_instructions_delta` | MCP server instruction updates | Meta message with added/removed instructions |
| `agent_mention` | @agent mention for multi-agent | Meta message prompting agent invocation |
| `teammate_mailbox` | Team mailbox messages | Formatted team messages (team mode only) |
| `team_context` | Team coordination context | Team coordination reminder (team mode only) |

#### Token & Budget Types

| Type | Description | Output Format |
|------|-------------|---------------|
| `token_usage` | Token counts | Meta message with usage stats |
| `budget_usd` | USD budget tracking | Meta message with budget stats |
| `output_token_usage` | Output token usage | Meta message with turn/session stats |

#### Hook Types

| Type | Description | Output Format |
|------|-------------|---------------|
| `hook_blocking_error` | Hook blocking error | Meta message with error details |
| `hook_success` | Hook success notification | Meta message (SessionStart/UserPromptSubmit only) |
| `hook_additional_context` | Hook additional context | Meta message with context lines |
| `hook_stopped_continuation` | Hook stopped continuation | Meta message with stop reason |
| `hook_error_during_execution` | Hook execution error | Empty array (no output) |
| `hook_non_blocking_error` | Non-blocking hook error | Empty array (no output) |
| `hook_cancelled` | Hook cancelled | Empty array (no output) |
| `hook_system_message` | Hook system message | Empty array (no output) |
| `hook_permission_decision` | Hook permission decision | Empty array (no output) |
| `async_hook_response` | Async hook response | Meta messages from hook output |

#### Notification Types

| Type | Description | Output Format |
|------|-------------|---------------|
| `date_change` | Date changed since last turn | Meta message with new date |
| `ultrathink_effort` | Thinking effort level | Meta message with effort level |
| `deferred_tools_delta` | Deferred tools available | Meta message with added/removed tools |
| `queued_command` | Pending commands | Meta message with command prompt |
| `critical_system_reminder` | Critical notifications | Meta message with content |
| `compaction_reminder` | Auto-compact enabled | Meta message explaining compaction |
| `verify_plan_reminder` | Plan verification reminder | Meta message prompting verification |

#### Silent Types (Empty Output)

| Type | Description | Why Silent |
|------|-------------|------------|
| `context_efficiency` | Context efficiency metrics | Internal metrics, not shown to LLM |
| `command_permissions` | Command permission changes | Handled elsewhere |
| `structured_output` | Structured output data | Handled elsewhere |
| `autocheckpointing` | Auto-checkpoint status | Internal state |
| `background_task_status` | Background task status | Internal state |
| `todo` | Internal todo state | Handled via todo_reminder |
| `task_progress` | Task progress | Internal state |
| `output_style` | Output style notification | Handled separately |

### Normalization Function Architecture

```javascript
// ============================================
// normalizeAttachmentForAPI - Central dispatcher for attachment normalization
// Location: chunks.174.mjs:3-469
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (E7()) {
        // Team mode special handling
        if (A.type === "teammate_mailbox") return [p1({...})];
        if (A.type === "team_context") return [p1({...})];
    }
    switch (A.type) {
        case "directory": return b5([...]);
        case "edited_text_file": return b5([p1({...})]);
        case "file": { /* handle content.type: image, text, notebook, pdf */ }
        case "compact_file_reference": return b5([p1({...})]);
        case "pdf_reference": return b5([p1({...})]);
        case "selected_lines_in_ide": return b5([p1({...})]);
        case "opened_file_in_ide": return b5([p1({...})]);
        case "plan_file_reference": return b5([p1({...})]);
        case "invoked_skills": { /* format skill content */ }
        case "todo_reminder": { /* format todo list */ }
        case "task_reminder": { /* format task list */ }
        case "nested_memory": return b5([p1({...})]);
        case "relevant_memories": return b5(A.memories.map(...));
        case "dynamic_skill": return [];
        case "skill_listing": return b5([p1({...})]);
        case "queued_command": { /* handle array or string prompt */ }
        case "ultramemory": return b5([p1({...})]);
        case "output_style": { /* lookup style name */ }
        case "diagnostics": { /* format diagnostics summary */ }
        case "plan_mode": return Wzz(A);
        case "plan_mode_reentry": return b5([p1({...})]);
        case "plan_mode_exit": return b5([p1({...})]);
        case "auto_mode": return Lzz(A);
        case "auto_mode_exit": return b5([p1({...})]);
        case "critical_system_reminder": return b5([p1({...})]);
        case "mcp_resource": { /* handle MCP resource contents */ }
        case "agent_mention": return b5([p1({...})]);
        case "task_status": { /* format task status */ }
        case "async_hook_response": { /* extract hook output */ }
        case "token_usage": return [p1({...})];
        case "budget_usd": return [p1({...})];
        case "output_token_usage": return [p1({...})];
        case "hook_blocking_error": return [p1({...})];
        case "hook_success": { /* SessionStart/UserPromptSubmit only */ }
        case "hook_additional_context": return [p1({...})];
        case "hook_stopped_continuation": return [p1({...})];
        case "compaction_reminder": return b5([p1({...})]);
        case "context_efficiency": return [];
        case "date_change": return b5([p1({...})]);
        case "ultrathink_effort": return b5([p1({...})]);
        case "deferred_tools_delta": return b5([p1({...})]);
        case "mcp_instructions_delta": return b5([p1({...})]);
        case "verify_plan_reminder": return b5([p1({...})]);
        // Silent types
        case "already_read_file":
        case "command_permissions":
        case "edited_image_file":
        case "hook_cancelled":
        case "hook_error_during_execution":
        case "hook_non_blocking_error":
        case "hook_system_message":
        case "structured_output":
        case "hook_permission_decision":
            return [];
    }
    // Unknown type fallback
    if (["autocheckpointing", "background_task_status", "todo", "task_progress"].includes(A.type)) return [];
    return jV("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${A.type}`)), [];
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Team mode special handling first
    if (isTeamMode()) {
        if (attachment.type === "teammate_mailbox") return [createUserMessage({...})];
        if (attachment.type === "team_context") return [createUserMessage({...})];
    }

    switch (attachment.type) {
        // File-related types
        case "file":
        case "directory":
            // Return tool use/result blocks
        case "edited_text_file":
        case "pdf_reference":
            // Return meta messages

        // IDE integration
        case "selected_lines_in_ide":
        case "diagnostics":
            // Return formatted IDE context

        // Mode state
        case "plan_mode":
        case "auto_mode":
            // Return mode-specific reminders

        // Tasks and todos
        case "todo_reminder":
        case "task_reminder":
            // Return formatted lists

        // ... (see full table above)
    }
}

// Mapping: Ui8→normalizeAttachmentForAPI, b5→wrapWithSystemReminderTags,
//   p1→createUserMessage, E7→isTeamMode, Wzz→formatPlanModeReminder,
//   Lzz→formatAutoModeReminder, ir6→formatToolResult, nr6→formatToolUse
```

---

## Detailed Producer Implementations

### extractAtMentionedFiles (RuY) - @file mention parser

**What it does:**
Parses user messages for `@filename` mentions and extracts the file contents for injection into the conversation.

**Source Code (VERIFIED):**

```javascript
// ============================================
// extractAtMentionedFiles - Parses @file mentions from user message
// Location: chunks.147.mjs:407-448
// ============================================

// ORIGINAL (for source lookup):
async function RuY(A, q) {
    let K = FuY(A);
    if (K.length === 0) return [];
    let Y = q.getAppState();
    return (await Promise.all(K.map(async (_) => {
        try {
            let {
                filename: w,
                lineStart: O,
                lineEnd: $
            } = QuY(_), H = L4(w);
            if (rT6(H, Y.toolPermissionContext)) return null;
            try {
                if ((await qqq(H)).isDirectory()) try {
                    let J = await Aqq(H, { withFileTypes: !0 }),
                        M = 1000, D = J.length > 1000,
                        X = J.slice(0, 1000).map((W) => W.name);
                    if (D) X.push(`… and ${J.length-1000} more entries`);
                    return d("tengu_at_mention_extracting_directory_success", {}), {
                        type: "directory", path: H, content: X.join(`
`), displayPath: Bl(G1(), H)
                    }
                } catch { return null }
            } catch {}
            return await tF8(H, q, "tengu_at_mention_extracting_filename_success",
                "tengu_at_mention_extracting_filename_error", "at-mention",
                { offset: O, limit: $ && O ? $ - O + 1 : void 0 })
        } catch { d("tengu_at_mention_extracting_filename_error", {}) }
    }))).filter(Boolean)
}

// READABLE (for understanding):
async function extractAtMentionedFiles(userMessage, toolUseContext) {
    // 1. Parse @mentions from user message
    let mentions = parseAtMentions(userMessage);
    if (mentions.length === 0) return [];

    let appState = toolUseContext.getAppState();

    // 2. Process each mention in parallel
    return (await Promise.all(mentions.map(async (mention) => {
        try {
            let { filename, lineStart, lineEnd } = parseMentionRange(mention);
            let absolutePath = resolvePath(filename);

            // 3. Check permission
            if (isPathBlocked(absolutePath, appState.toolPermissionContext)) {
                return null;
            }

            // 4. Handle directory mentions
            try {
                if ((await stat(absolutePath)).isDirectory()) {
                    let entries = await readdir(absolutePath, { withFileTypes: true });
                    let MAX_ENTRIES = 1000;
                    let isTruncated = entries.length > MAX_ENTRIES;
                    let names = entries.slice(0, MAX_ENTRIES).map((e) => e.name);
                    if (isTruncated) {
                        names.push(`… and ${entries.length - MAX_ENTRIES} more entries`);
                    }
                    logEvent("tengu_at_mention_extracting_directory_success", {});
                    return {
                        type: "directory",
                        path: absolutePath,
                        content: names.join("\n"),
                        displayPath: getDisplayPath(getCwd(), absolutePath)
                    };
                }
            } catch {}

            // 5. Handle file mentions
            return await readFileWithTelemetry(
                absolutePath, toolUseContext,
                "tengu_at_mention_extracting_filename_success",
                "tengu_at_mention_extracting_filename_error",
                "at-mention",
                { offset: lineStart, limit: lineEnd && lineStart ? lineEnd - lineStart + 1 : undefined }
            );
        } catch {
            logEvent("tengu_at_mention_extracting_filename_error", {});
        }
    }))).filter(Boolean);
}

// Mapping: RuY→extractAtMentionedFiles, A→userMessage, q→toolUseContext,
//   K→mentions, Y→appState, FuY→parseAtMentions, QuY→parseMentionRange,
//   L4→resolvePath, rT6→isPathBlocked, qqq→stat, Aqq→readdir, Bl→getDisplayPath
```

**How it works:**

1. **Parse mentions**: Extracts `@filename` patterns from user message
2. **Permission check**: Blocks access to sandboxed paths
3. **Directory handling**: If path is a directory, lists contents (max 1000 entries)
4. **File handling**: Reads file content with optional line range support
5. **Parallel processing**: All mentions processed concurrently via `Promise.all`

**Why this approach:**
- **Line range support**: `@file:10-20` syntax allows specifying exact line ranges
- **Directory detection**: Automatically handles directory listings
- **Truncation protection**: Large directories are truncated with indicator
- **Permission integration**: Respects sandbox restrictions

---

### extractMcpResources (SuY) - @mcp:// resource handler

**What it does:**
Extracts `@mcp://server/resource` mentions and fetches the resource contents from MCP servers.

**Source Code (VERIFIED):**

```javascript
// ============================================
// extractMcpResources - Fetches @mcp:// resource mentions
// Location: chunks.147.mjs:464-495
// ============================================

// ORIGINAL (for source lookup):
async function SuY(A, q) {
    let K = puY(A);
    if (K.length === 0) return [];
    let Y = q.options.mcpClients || [];
    return (await Promise.all(K.map(async (_) => {
        try {
            let [w, ...O] = _.split(":"), $ = O.join(":");
            if (!w || !$) return d("tengu_at_mention_mcp_resource_error", {}), null;
            let H = Y.find((M) => M.name === w);
            if (!H || H.type !== "connected") return d("tengu_at_mention_mcp_resource_error", {}), null;
            let J = (q.options.mcpResources?.[w] || []).find((M) => M.uri === $);
            if (!J) return d("tengu_at_mention_mcp_resource_error", {}), null;
            try {
                let M = await H.client.readResource({ uri: $ });
                return d("tengu_at_mention_mcp_resource_success", {}), {
                    type: "mcp_resource",
                    server: w, uri: $,
                    name: J.name || $, description: J.description,
                    content: M
                }
            } catch (M) {
                return d("tengu_at_mention_mcp_resource_error", {}), _6(M), null
            }
        } catch {
            return d("tengu_at_mention_mcp_resource_error", {}), null
        }
    }))).filter((_) => _ !== null)
}

// READABLE (for understanding):
async function extractMcpResources(userMessage, toolUseContext) {
    // 1. Parse @mcp:// mentions
    let mcpMentions = parseMcpMentions(userMessage);
    if (mcpMentions.length === 0) return [];

    let mcpClients = toolUseContext.options.mcpClients || [];

    // 2. Process each mention in parallel
    return (await Promise.all(mcpMentions.map(async (mention) => {
        try {
            // 3. Parse "server:resource" format
            let [serverName, ...resourceParts] = mention.split(":");
            let resourceUri = resourceParts.join(":");

            if (!serverName || !resourceUri) {
                logEvent("tengu_at_mention_mcp_resource_error", {});
                return null;
            }

            // 4. Find connected MCP client
            let client = mcpClients.find((c) => c.name === serverName);
            if (!client || client.type !== "connected") {
                logEvent("tengu_at_mention_mcp_resource_error", {});
                return null;
            }

            // 5. Find resource definition
            let resourceDef = (toolUseContext.options.mcpResources?.[serverName] || [])
                .find((r) => r.uri === resourceUri);
            if (!resourceDef) {
                logEvent("tengu_at_mention_mcp_resource_error", {});
                return null;
            }

            // 6. Fetch resource contents
            try {
                let content = await client.client.readResource({ uri: resourceUri });
                logEvent("tengu_at_mention_mcp_resource_success", {});
                return {
                    type: "mcp_resource",
                    server: serverName,
                    uri: resourceUri,
                    name: resourceDef.name || resourceUri,
                    description: resourceDef.description,
                    content: content
                };
            } catch (error) {
                logEvent("tengu_at_mention_mcp_resource_error", {});
                reportError(error);
                return null;
            }
        } catch {
            logEvent("tengu_at_mention_mcp_resource_error", {});
            return null;
        }
    }))).filter((result) => result !== null);
}

// Mapping: SuY→extractMcpResources, A→userMessage, q→toolUseContext,
//   K→mcpMentions, Y→mcpClients, puY→parseMcpMentions, _6→reportError
```

**How it works:**

1. **Parse mentions**: Extracts `@mcp://server:resource` patterns
2. **Server lookup**: Finds the connected MCP client for the server name
3. **Resource lookup**: Validates resource exists in MCP resource list
4. **Content fetch**: Calls `readResource` on MCP client
5. **Error handling**: Returns null on any error, logs telemetry

**Key insight:** MCP resources are fetched in real-time, ensuring fresh data from the MCP server.

---

### getChangedFilesAttachment (CuY) - Git status tracker

**What it does:**
Tracks files that have been read during the session and detects if they were modified externally (by user or linter).

**Source Code (VERIFIED):**

```javascript
// ============================================
// getChangedFilesAttachment - Detects externally modified files
// Location: chunks.147.mjs:497-539
// ============================================

// ORIGINAL (for source lookup):
async function CuY(A) {
    let q = jB(A.readFileState);
    if (q.length === 0) return [];
    let K = A.getAppState();
    return (await Promise.all(q.map(async (z) => {
        let _ = A.readFileState.get(z);
        if (!_) return null;
        if (_.offset !== void 0 || _.limit !== void 0) return null;
        let w = L4(z);
        if (rT6(w, K.toolPermissionContext)) return null;
        try {
            if (Jh(w) <= _.timestamp) return null;
            let O = { file_path: w };
            if (!(await L9.validateInput(O, A)).result) return null;
            let H = await L9.call(O, A);
            if (H.data.type === "text") {
                let j = Bf7(_.content, H.data.file.content);
                if (j === "") return null;
                return { type: "edited_text_file", filename: w, snippet: j }
            }
            if (H.data.type === "image") try {
                let j = await XV8(w);
                return { type: "edited_image_file", filename: w, content: j }
            } catch (j) { return _6(j), d("tengu_watched_file_compression_failed", { file: w }), null }
        } catch { return A.readFileState.delete(z), null }
    }))).filter((z) => z !== null)
}

// READABLE (for understanding):
async function getChangedFilesAttachment(toolUseContext) {
    // 1. Get all tracked file paths
    let trackedPaths = getTrackedPaths(toolUseContext.readFileState);
    if (trackedPaths.length === 0) return [];

    let appState = toolUseContext.getAppState();

    // 2. Check each tracked file in parallel
    return (await Promise.all(trackedPaths.map(async (path) => {
        let readRecord = toolUseContext.readFileState.get(path);
        if (!readRecord) return null;

        // 3. Skip partial reads (with offset/limit)
        if (readRecord.offset !== undefined || readRecord.limit !== undefined) {
            return null;
        }

        let absolutePath = resolvePath(path);

        // 4. Check permission
        if (isPathBlocked(absolutePath, appState.toolPermissionContext)) {
            return null;
        }

        try {
            // 5. Check if file was modified since we read it
            if (getMtime(absolutePath) <= readRecord.timestamp) {
                return null; // Not modified
            }

            // 6. Validate we can still read the file
            let input = { file_path: absolutePath };
            if (!(await FileReadTool.validateInput(input, toolUseContext)).result) {
                return null;
            }

            // 7. Read current content
            let result = await FileReadTool.call(input, toolUseContext);

            // 8. For text files, compute diff snippet
            if (result.data.type === "text") {
                let diffSnippet = computeDiffSnippet(readRecord.content, result.data.file.content);
                if (diffSnippet === "") return null;
                return { type: "edited_text_file", filename: absolutePath, snippet: diffSnippet };
            }

            // 9. For image files, re-compress
            if (result.data.type === "image") {
                try {
                    let imageContent = await compressImage(absolutePath);
                    return { type: "edited_image_file", filename: absolutePath, content: imageContent };
                } catch (error) {
                    reportError(error);
                    logEvent("tengu_watched_file_compression_failed", { file: absolutePath });
                    return null;
                }
            }
        } catch {
            // File may have been deleted, remove from tracking
            toolUseContext.readFileState.delete(path);
            return null;
        }
    }))).filter((result) => result !== null);
}

// Mapping: CuY→getChangedFilesAttachment, A→toolUseContext,
//   q→trackedPaths, K→appState, jB→getTrackedPaths,
//   L4→resolvePath, rT6→isPathBlocked, Jh→getMtime,
//   L9→FileReadTool, Bf7→computeDiffSnippet, XV8→compressImage
```

**How it works:**

1. **Track read files**: The `readFileState` Map tracks every file read with timestamp
2. **Modification detection**: Compare `mtime` against stored timestamp
3. **Diff computation**: Only send changed portions to save tokens
4. **Image handling**: Re-compress modified images
5. **Cleanup**: Remove deleted files from tracking

**Why this approach:**
- **Token efficiency**: Only sends diff snippets, not full file content
- **Real-time awareness**: LLM knows when files were modified externally
- **Automatic cleanup**: Removes deleted files from tracking

---

## Integration with 04_system_reminder Module

### Cross-Reference

The `04_system_reminder/` module provides the **normalization layer** for attachments:

- **Producers** (this document): `_uY` (assembleAllAttachments), `Hz` (timedAttachmentProducer)
- **Normalizers** (04_system_reminder): `Ui8` (normalizeAttachmentForAPI), `b5` (wrapWithSystemReminderTags), `p1` (createUserMessage)

### Message Flow

```
User Message → Tool Execution → assembleAllAttachments (_uY)
                                    ↓
                            Parallel Producers (Hz)
                                    ↓
                         Raw Attachment Objects
                                    ↓
                    normalizeAttachmentForAPI (Ui8)
                                    ↓
                    wrapWithSystemReminderTags (b5)
                                    ↓
                        createUserMessage (p1)
                                    ↓
                    Injected into conversation
```

### Timing Constraints

**1-Second Abort Timeout:**

The attachment production has a strict 1-second timeout enforced by an AbortController:

```javascript
// In assembleAllAttachments (_uY):
let abortController = createAbortController();
let timeout = setTimeout((ac) => ac.abort(), 1000, abortController);
```

**Why 1 second?**
- **User experience**: Attachments shouldn't noticeably delay the LLM response
- **Safety margin**: Most producers complete in <100ms
- **Graceful degradation**: If timeout triggers, remaining producers are aborted and conversation continues

**Producer Response to Abort:**
Each producer receives the `abortController` in its context and should check `abortController.signal.aborted` before long operations.

---

### Normalization Layer Details

#### normalizeAttachmentForAPI (Ui8) - Complete Function Analysis

**What it does:**
The central dispatcher that converts typed attachment objects into formatted messages for the Anthropic API.

**Source Code (VERIFIED) - Key Switch Cases:**

```javascript
// ============================================
// normalizeAttachmentForAPI - Attachment to message converter
// Location: chunks.174.mjs:3-469
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (E7()) {
        if (A.type === "teammate_mailbox") return [p1({
            content: Kzz().formatTeammateMessages(A.messages),
            isMeta: !0
        })];
        if (A.type === "team_context") return [p1({
            content: `<system-reminder>
# Team Coordination
You are a teammate in team "${A.teamName}".
**Your Identity:**
- Name: ${A.agentName}
**Team Resources:**
- Team config: ${A.teamConfigPath}
- Task list: ${A.taskListPath}
**Team Leader:** The team lead's name is "team-lead".
...`, isMeta: !0
        })]
    }
    switch (A.type) {
        case "file": { /* handle content.type: image, text, notebook, pdf */ }
        case "edited_text_file":
            return b5([p1({
                content: `Note: ${A.filename} was modified...Here are the relevant changes:
${A.snippet}`,
                isMeta: !0
            })]);
        case "todo_reminder": {
            let K = A.content.map((z, _) => `${_+1}. [${z.status}] ${z.content}`).join(`
`);
            let Y = `The TodoWrite tool hasn't been used recently...`;
            if (K.length > 0) Y += `

Here are the existing contents of your todo list:

[${K}]`;
            return b5([p1({ content: Y, isMeta: !0 })])
        }
        case "plan_mode": return Wzz(A);
        case "plan_mode_reentry": /* format re-entry message */
        case "plan_mode_exit": /* format exit message */
        case "token_usage":
            return [p1({
                content: formatMeta(`Token usage: ${A.used}/${A.total}; ${A.remaining} remaining`),
                isMeta: !0
            })];
        // ... 50+ more cases
    }
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // 1. Team mode special handling first
    if (isTeamMode()) {
        if (attachment.type === "teammate_mailbox") {
            return [createUserMessage({
                content: formatTeammateMessages(attachment.messages),
                isMeta: true
            })];
        }
        if (attachment.type === "team_context") {
            return [createUserMessage({
                content: `<system-reminder>
# Team Coordination
You are a teammate in team "${attachment.teamName}".
...`,
                isMeta: true
            })];
        }
    }

    // 2. Switch on attachment type
    switch (attachment.type) {
        case "file":
            // Handle image, text, notebook, pdf content types
        case "edited_text_file":
            // Format external modification notice
        case "todo_reminder":
            // Format todo list with item count
        case "plan_mode":
            // Delegate to formatPlanModeReminder (Wzz)
        case "token_usage":
            // Format token usage stats
        // ... 50+ more cases
    }
}

// Mapping: Ui8→normalizeAttachmentForAPI, E7→isTeamMode, p1→createUserMessage,
//   b5→wrapWithSystemReminderTags, Wzz→formatPlanModeReminder, Kzz→getTeamFormatter
```

**Key Design Decisions:**

1. **Team mode first**: Team-specific attachments are handled before the switch statement
2. **Silent types**: Many attachment types return `[]` (no output) - they're tracked but not shown to LLM
3. **Meta flag**: Most attachments have `isMeta: true` to distinguish from user messages
4. **Tool result format**: File attachments use synthetic tool use/result blocks

---

#### wrapWithSystemReminderTags (b5) - XML Tag Wrapper

**What it does:**
Wraps content in `<system-reminder>` XML tags that signal contextual information to the LLM.

**Usage Pattern:**
```javascript
// Input: array of content blocks
// Output: array with each text block wrapped in <system-reminder> tags
return b5([
    createUserMessage({ content: "File content here...", isMeta: true })
]);
```

**Why XML tags:**
- **Clear boundaries**: LLM can distinguish system reminders from other content
- **Parsing safety**: XML structure prevents content from "escaping" the reminder
- **Semantic signaling**: Reminds LLM this is context, not direct user input

---

### formatToolResult (ir6) and formatToolUse (nr6)

**What they do:**
These helper functions create synthetic tool use/result blocks for file attachments.

```javascript
// ============================================
// formatToolResult - Creates tool result block
// Location: chunks.174.mjs:471-488
// ============================================

// ORIGINAL (for source lookup):
function ir6(A, q) {
    try {
        let K = A.mapToolResultToToolResultBlockParam(q, "1");
        if (Array.isArray(K.content) && K.content.some((Y) => Y.type === "image")) {
            return p1({ content: K.content, isMeta: !0 });
        }
        return p1({
            content: `Result of calling the ${A.name} tool: ${JSON.stringify(K.content)}`,
            isMeta: !0
        })
    } catch {
        return p1({ content: `Result of calling the ${A.name} tool: Error`, isMeta: !0 })
    }
}

// ============================================
// formatToolUse - Creates tool use block
// Location: chunks.174.mjs:490-495
// ============================================

// ORIGINAL (for source lookup):
function nr6(A, q) {
    return p1({
        content: `Called the ${A} tool with the following input: ${JSON.stringify(q)}`,
        isMeta: !0
    })
}

// Mapping: ir6→formatToolResult, nr6→formatToolUse, A→tool, q→result/input
```

**Why synthetic tool blocks:**
- **Consistency**: File reads look like actual tool calls
- **Context preservation**: Shows the LLM what operation produced the content
- **Image handling**: Images can be embedded in tool results

---

## Cross-Feature Linkages

### Integration with Agent Loop (mainAgentLoop)

**Call Site:**
The `assembleAllAttachments` function is called from within the main agent loop after tool execution completes:

```
mainAgentLoop (Yh)
    │
    ├── Tool Execution Phase
    │   └── Tools modify state (files, todos, plan)
    │
    ├── Attachment Production Phase
    │   └── assembleAllAttachments (_uY)
    │       ├── Reads modified state
    │       └── Produces attachment objects
    │
    ├── Normalization Phase
    │   └── normalizeAttachmentForAPI (Ui8)
    │       └── Converts to API messages
    │
    └── Message Injection Phase
        └── attachmentGenerator (Vf6)
            └── Yields messages for next API call
```

**Timing Rationale:**
Attachments are produced **after** tool execution because:
1. Tool execution may modify files → `changed_files` needs latest state
2. Tool execution may update todos → `todo_reminder` needs latest items
3. Tool execution may change plan → `plan_mode` needs latest state

### Integration with 05_tools Module

**File Read Tracking:**
When the Read tool (`L9`) reads a file, it registers the file in `readFileState`:

```javascript
// In FileReadTool.call:
toolUseContext.readFileState.set(filePath, {
    content: fileContent,
    timestamp: Date.now(),
    offset: readOffset,
    limit: readLimit
});
```

This state is then used by `getChangedFilesAttachment` (CuY) to detect external modifications.

### Integration with Plan Mode (06_plan_mode)

**Plan Mode Attachments:**
- `getPlanModeAttachment` (DuY) - Produces plan mode reminders
- `getPlanModeExitAttachment` (XuY) - Produces exit notification
- `formatPlanModeReminder` (Wzz) - Normalizes plan mode content

**Plan File Reference:**
When a plan file exists, it's attached via `plan_file_reference` type to maintain context across turns.

### Integration with Background Tasks (08_background_tasks)

**Task Status Attachments:**
Background task status changes produce `task_status` attachments:

```javascript
// Task status attachment structure:
{
    type: "task_status",
    taskId: string,
    taskType: string,
    description: string,
    status: "running" | "completed" | "failed" | "killed",
    deltaSummary?: string
}
```

**Notification Flow:**
```
Background Task completes
    ↓
TaskOutput tool queues notification
    ↓
queued_command attachment produced
    ↓
Injected into next turn
```

### Integration with MCP (10_mcp_protocol)

**MCP Resource Attachments:**
- `@mcp://` mentions trigger `extractMcpResources` (SuY)
- MCP server instructions are tracked via `getMcpInstructionsDeltaAttachment` (uE1)

**Deferred Tool Attachments:**
- `getDeferredToolsDeltaAttachment` (xE1) tracks MCP tools becoming available/unavailable

### Integration with Hooks (12_hooks)

**Hook Result Attachments:**
Hook execution results produce various attachment types:

| Hook Result | Attachment Type |
|-------------|-----------------|
| Blocking error | `hook_blocking_error` |
| Additional context | `hook_additional_context` |
| Stopped continuation | `hook_stopped_continuation` |
| Success message | `hook_success` (SessionStart/UserPromptSubmit only) |

**Async Hook Responses:**
Long-running hooks return async responses that become `async_hook_response` attachments.

### Integration with Compact (07_compact)

**Preserved Attachments:**
During compaction, certain attachment types are preserved:

```javascript
// Attachment types preserved during compaction:
const PRESERVED_TYPES = [
    "plan_mode",
    "todo_reminder",
    "task_reminder",
    "edited_text_file",
    "plan_file_reference"
];
```

**Compaction Reminder:**
When auto-compact is enabled, a `compaction_reminder` attachment is produced to inform the LLM about the mechanism.

---

## Summary

The reminder integration system provides real-time contextual information to the LLM through:

1. **Parallel producers** that run concurrently to minimize latency
2. **Error-resilient design** where each producer is wrapped with error handling
3. **Conditional execution** where user-dependent and main-agent-only producers are skipped when not applicable
4. **XML tag formatting** using `<system-reminder>` to clearly mark contextual content
5. **Strategic timing** where attachments are injected after tool execution to include the latest state

The attachment system is a key differentiator for Claude Code, providing context that the LLM wouldn't otherwise have access to.
