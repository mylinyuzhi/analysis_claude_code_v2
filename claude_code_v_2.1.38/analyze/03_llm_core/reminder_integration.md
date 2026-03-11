# Reminder Integration (Claude Code 2.1.38)

> Complete analysis of the system reminder/attachment system: how contextual information is produced, normalized, and injected into the conversation to provide the LLM with real-time context.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `assembleAttachments` (phY) - Main orchestrator for attachment production, chunks.142.mjs:1948
- `attachmentGenerator` (oP1) - Async generator that yields attachment messages, chunks.142.mjs:2494
- `wrapWithSystemReminderTags` (_9) - Wraps content in `<system-reminder>` tags, chunks.173.mjs:496
- `createAttachmentMessage` (kq) - Creates the attachment message structure, chunks.142.mjs:2615
- `timedAttachmentProducer` (gw) - Wraps producers with timing and error handling, chunks.142.mjs:1967
- `buildQueuedCommandsAttachment` (dhY) - Builds queued commands attachment, chunks.142.mjs:1993
- `countAssistantTurns` (chY) - Counts assistant turns for throttling, chunks.142.mjs:2003

---

## Architecture Overview

The reminder system provides contextual information to the LLM through "attachments" - special messages injected at specific points in the conversation:

```
┌────────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT PRODUCTION PIPELINE                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  Attachment Categories                           │  │
│  │                                                                  │  │
│  │  User-Dependent (if user input contains mentions):              │  │
│  │  ├── @file mentions ────► KIY (extractAtMentionedFiles)        │  │
│  │  ├── @mcp:// mentions ──► zIY (extractMcpResources)            │  │
│  │  └── @agent mentions ──► YIY (extractAgentMentions)            │  │
│  │                                                                  │  │
│  │  Always-Computed:                                                │  │
│  │  ├── Changed files ─────► wIY (getChangedFilesAttachment)      │  │
│  │  ├── Nested memory ─────► HIY (getNestedMemoryAttachments)     │  │
│  │  ├── Dynamic skills ────► $IY (getDynamicSkillAttachments)     │  │
│  │  ├── Plan mode ─────────► ihY (getPlanModeAttachment)          │  │
│  │  ├── Todo reminders ────► fIY/NIY (getTodo/TaskReminder)       │  │
│  │  └── Delegate mode ─────► rhY (getDelegateModeAttachment)      │  │
│  │                                                                  │  │
│  │  Main-Agent-Only:                                                │  │
│  │  ├── IDE selection ─────► ehY (getIdeSelectionAttachment)      │  │
│  │  ├── IDE opened file ──► qIY (getIdeOpenedFileAttachment)      │  │
│  │  ├── Diagnostics ───────► PIY (getDiagnosticsAttachment)       │  │
│  │  ├── LSP diagnostics ──► WIY (getLspDiagnosticsAttachment)     │  │
│  │  ├── Token usage ───────► RIY (getTokenUsageAttachment)        │  │
│  │  └── Budget USD ────────► yIY (getBudgetUsdAttachment)         │  │
│  │                                                                  │  │
│  │  Team/Swarm Mode:                                                │  │
│  │  ├── Teammate mailbox ─► kIY (getTeammateMailboxAttachment)    │  │
│  │  └── Team context ──────► LIY (getTeamContextAttachment)       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  phY (assembleAttachments)                       │  │
│  │                                                                  │  │
│  │  1. Run all producers in parallel via Promise.all()              │  │
│  │  2. Flatten results into single attachment array                 │  │
│  │  3. Return attachments for injection                            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  oP1 (attachmentGenerator)                       │  │
│  │                                                                  │  │
│  │  1. Call assembleAttachments()                                  │  │
│  │  2. Log telemetry                                               │  │
│  │  3. Wrap each attachment via kq()                               │  │
│  │  4. Yield as message for LLM context                            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Core Algorithms

### assembleAttachments - Main orchestrator

**What it does:**
The `assembleAttachments` (phY) function coordinates the production of all attachment types. It runs multiple producers in parallel and aggregates their results into a single array of attachment objects.

**How it works:**

1. **Early Exit Check**: If `CLAUDE_CODE_DISABLE_ATTACHMENTS` is set, returns empty array immediately.

2. **Abort Controller Setup**: Creates a 1-second timeout abort controller to prevent hanging on slow producers.

3. **Producer Categories**: Organizes producers into three groups:
   - **User-dependent**: Only run if user input contains relevant mentions
   - **Always-computed**: Run on every turn
   - **Main-agent-only**: Only run when not in a subagent context

4. **Parallel Execution**: Uses `Promise.all()` to run all producers concurrently.

5. **Result Aggregation**: Flattens all producer results into a single array.

```javascript
// ============================================
// assembleAttachments - Orchestrates all attachment producers
// Location: chunks.142.mjs:1948-1965
// ============================================

// ORIGINAL (for source lookup):
async function phY(A, q, K, Y, z, w) {
    if (J6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) return [];
    let H = Aq();
    setTimeout(() => { H.abort() }, 1000);
    let $ = { ...q, abortController: H },
        O = !q.agentId,
        _ = A ? [gw("at_mentioned_files", () => KIY(A, $)), gw("mcp_resources", () => zIY(A, $)), gw("agent_mentions", () => Promise.resolve(YIY(A, q.options.agentDefinitions.activeAgents)))] : [],
        J = await Promise.all(_),
        X = [gw("changed_files", () => wIY($)), gw("nested_memory", () => HIY($)), gw("dynamic_skill", () => $IY($)), gw("skill_listing", () => OIY($)), gw("ultra_claude_md", async () => thY(z)), gw("plan_mode", () => ihY(z, q)), gw("plan_mode_exit", () => nhY(q)), gw("delegate_mode", () => rhY(q)), gw("delegate_mode_exit", () => Promise.resolve(ohY())), gw("todo_reminders", () => jH() ? NIY(z, q) : fIY(z, q)), ...l8() ? [...w === "session_memory" ? [] : [gw("teammate_mailbox", async () => kIY(q))], gw("team_context", async () => LIY(z ?? []))] : [], gw("critical_system_reminder", () => Promise.resolve(ahY(q))), ...[]],
        D = O ? [gw("ide_selection", async () => ehY(K, q)), gw("ide_opened_file", async () => qIY(K, q)), gw("output_style", async () => Promise.resolve(shY())), gw("diagnostics", async () => PIY(q)), gw("lsp_diagnostics", async () => WIY(q)), gw("unified_tasks", async () => vIY(q, z)), gw("async_hook_responses", async () => EIY()), gw("token_usage", async () => Promise.resolve(RIY(z ?? [], q.options.mainLoopModel))), gw("budget_usd", async () => Promise.resolve(yIY(q.options.maxBudgetUsd))), gw("verify_plan_reminder", async () => SIY(z, q)), gw("queued_commands", async () => Promise.resolve(dhY(Y)))] : [],
        [j, M] = await Promise.all([Promise.all(X), Promise.all(D)]);
    return [...J.flat(), ...j.flat(), ...M.flat()]
}

// READABLE (for understanding):
async function assembleAttachments(atMentions, toolUseContext, ideContext, queuedCommands, messages, sessionMemoryType) {
    // Early exit if attachments disabled
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) {
        return [];
    }

    // Setup abort controller with 1-second timeout
    let abortController = createAbortController();
    setTimeout(() => { abortController.abort(); }, 1000);

    let contextWithAbort = { ...toolUseContext, abortController };
    let isMainAgent = !toolUseContext.agentId;  // No agentId means main agent

    // User-dependent producers (only if mentions present)
    let userDependentProducers = atMentions ? [
        timedProducer("at_mentioned_files", () => extractAtMentionedFiles(atMentions, contextWithAbort)),
        timedProducer("mcp_resources", () => extractMcpResources(atMentions, contextWithAbort)),
        timedProducer("agent_mentions", () => Promise.resolve(extractAgentMentions(atMentions, toolUseContext.options.agentDefinitions.activeAgents)))
    ] : [];
    let userDependentResults = await Promise.all(userDependentProducers);

    // Always-computed producers
    let alwaysComputedProducers = [
        timedProducer("changed_files", () => getChangedFilesAttachment(contextWithAbort)),
        timedProducer("nested_memory", () => getNestedMemoryAttachments(contextWithAbort)),
        timedProducer("dynamic_skill", () => getDynamicSkillAttachments(contextWithAbort)),
        timedProducer("skill_listing", () => getSkillListingAttachment(contextWithAbort)),
        timedProducer("ultra_claude_md", async () => getUltraClaudeMdAttachment(sessionMemoryType)),
        timedProducer("plan_mode", () => getPlanModeAttachment(messages, toolUseContext)),
        timedProducer("plan_mode_exit", () => getPlanModeExitAttachment(toolUseContext)),
        timedProducer("delegate_mode", () => getDelegateModeAttachment(toolUseContext)),
        timedProducer("delegate_mode_exit", () => Promise.resolve(getDelegateModeExitAttachment())),
        timedProducer("todo_reminders", () => isTaskSystemEnabled() ? getTaskReminderAttachment(messages, toolUseContext) : getTodoReminderAttachment(messages, toolUseContext)),
        // Team mode producers (conditional)
        ...(isAgentTeamsEnabled() ? [
            ...(sessionMemoryType === "session_memory" ? [] : [timedProducer("teammate_mailbox", async () => getTeammateMailboxAttachment(toolUseContext))]),
            timedProducer("team_context", async () => getTeamContextAttachment(messages ?? []))
        ] : []),
        timedProducer("critical_system_reminder", () => Promise.resolve(getCriticalSystemReminder(toolUseContext)))
    ];

    // Main-agent-only producers
    let mainAgentOnlyProducers = isMainAgent ? [
        timedProducer("ide_selection", async () => getIdeSelectionAttachment(ideContext, toolUseContext)),
        timedProducer("ide_opened_file", async () => getIdeOpenedFileAttachment(ideContext, toolUseContext)),
        timedProducer("output_style", async () => Promise.resolve(getOutputStyleAttachment())),
        timedProducer("diagnostics", async () => getDiagnosticsAttachment(toolUseContext)),
        timedProducer("lsp_diagnostics", async () => getLspDiagnosticsAttachment(toolUseContext)),
        timedProducer("unified_tasks", async () => getUnifiedTasksAttachment(toolUseContext, messages)),
        timedProducer("async_hook_responses", async () => getAsyncHookResponsesAttachment()),
        timedProducer("token_usage", async () => Promise.resolve(getTokenUsageAttachment(messages ?? [], toolUseContext.options.mainLoopModel))),
        timedProducer("budget_usd", async () => Promise.resolve(getBudgetUsdAttachment(toolUseContext.options.maxBudgetUsd))),
        timedProducer("verify_plan_reminder", async () => getVerifyPlanReminderAttachment(messages, toolUseContext)),
        timedProducer("queued_commands", async () => Promise.resolve(getQueuedCommandsAttachment(queuedCommands)))
    ] : [];

    // Execute all producers in parallel
    let [alwaysResults, mainAgentResults] = await Promise.all([
        Promise.all(alwaysComputedProducers),
        Promise.all(mainAgentOnlyProducers)
    ]);

    // Aggregate all results
    return [
        ...userDependentResults.flat(),
        ...alwaysResults.flat(),
        ...mainAgentResults.flat()
    ];
}

// Mapping: phY→assembleAttachments, A→atMentions, q→toolUseContext, K→ideContext,
//   Y→queuedCommands, z→messages, w→sessionMemoryType, gw→timedProducer,
//   KIY→extractAtMentionedFiles, zIY→extractMcpResources, YIY→extractAgentMentions,
//   wIY→getChangedFilesAttachment, HIY→getNestedMemoryAttachments, $IY→getDynamicSkillAttachments,
//   OIY→getSkillListingAttachment, thY→getUltraClaudeMdAttachment, ihY→getPlanModeAttachment,
//   nhY→getPlanModeExitAttachment, rhY→getDelegateModeAttachment, ohY→getDelegateModeExitAttachment,
//   jH→isTaskSystemEnabled, NIY→getTaskReminderAttachment, fIY→getTodoReminderAttachment,
//   l8→isAgentTeamsEnabled, kIY→getTeammateMailboxAttachment, LIY→getTeamContextAttachment,
//   ahY→getCriticalSystemReminder, ehY→getIdeSelectionAttachment, qIY→getIdeOpenedFileAttachment,
//   shY→getOutputStyleAttachment, PIY→getDiagnosticsAttachment, WIY→getLspDiagnosticsAttachment,
//   vIY→getUnifiedTasksAttachment, EIY→getAsyncHookResponsesAttachment, RIY→getTokenUsageAttachment,
//   yIY→getBudgetUsdAttachment, SIY→getVerifyPlanReminderAttachment, dhY→getQueuedCommandsAttachment,
//   J6→parseBoolean, Aq→createAbortController
```

**Why this approach:**
- **Parallel execution**: All producers run concurrently, minimizing total latency.
- **Abort timeout**: The 1-second timeout prevents a slow producer from blocking the entire conversation.
- **Categorization**: User-dependent producers are skipped when not needed, saving computation.
- **Main-agent isolation**: Some producers (like IDE selection) are only relevant to the main agent, not subagents.

**Key insight:** The attachment system is designed for resilience. Each producer is wrapped in `timedAttachmentProducer` (gw) which catches errors and returns an empty array on failure. This ensures that a single failing producer doesn't break the entire attachment pipeline.

---

### timedAttachmentProducer - Error handling wrapper

**What it does:**
Wraps an attachment producer with timing, error handling, and optional sampling for telemetry.

**How it works:**

```javascript
// ============================================
// timedAttachmentProducer - Wraps producers with timing and error handling
// Location: chunks.142.mjs:1967-1991
// ============================================

// ORIGINAL (for source lookup):
async function gw(A, q) {
    let K = Date.now();
    try {
        let Y = await q(),
            z = Date.now() - K,
            w = Y.reduce((H, $) => { return H + Q1($).length }, 0);
        if (Math.random() < 0.05) c("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            attachment_size_bytes: w,
            attachment_count: Y.length
        });
        return Y
    } catch (Y) {
        let z = Date.now() - K;
        if (Math.random() < 0.05) c("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            error: !0
        });
        return K1(Y), Yk(`Attachment error in ${A}`, Y), []
    }
}

// READABLE (for understanding):
async function timedAttachmentProducer(label, producer) {
    let startTime = Date.now();
    try {
        let attachments = await producer();
        let duration = Date.now() - startTime;

        // Calculate total size for telemetry
        let totalSize = attachments.reduce((sum, attachment) => {
            return sum + estimateSize(attachment).length;
        }, 0);

        // Sample 5% of calls for telemetry
        if (Math.random() < 0.05) {
            logEvent("tengu_attachment_compute_duration", {
                label,
                duration_ms: duration,
                attachment_size_bytes: totalSize,
                attachment_count: attachments.length
            });
        }

        return attachments;
    } catch (error) {
        let duration = Date.now() - startTime;
        if (Math.random() < 0.05) {
            logEvent("tengu_attachment_compute_duration", {
                label,
                duration_ms: duration,
                error: true
            });
        }
        recordError(error);
        logWarning(`Attachment error in ${label}`, error);
        return [];  // Return empty on error - never break the pipeline
    }
}

// Mapping: gw→timedAttachmentProducer, A→label, q→producer, c→logEvent,
//   Q1→estimateSize, K1→recordError, Yk→logWarning
```

---

### attachmentGenerator - Async generator for message injection

**What it does:**
The `attachmentGenerator` (oP1) is an async generator that produces attachment messages for injection into the conversation stream.

**How it works:**

```javascript
// ============================================
// attachmentGenerator - Yields attachment messages
// Location: chunks.142.mjs:2494-2501
// ============================================

// ORIGINAL (for source lookup):
async function* oP1(A, q, K, Y, z, w) {
    let H = await phY(A, q, K, Y, z, w);
    if (H.length === 0) return;
    c("tengu_attachments", {
        attachment_types: H.map(($) => $.type)
    });
    for (let $ of H) yield kq($)
}

// READABLE (for understanding):
async function* attachmentGenerator(atMentions, toolUseContext, ideContext, queuedCommands, messages, sessionMemoryType) {
    // Produce all attachments
    let attachments = await assembleAttachments(atMentions, toolUseContext, ideContext, queuedCommands, messages, sessionMemoryType);

    // Early exit if no attachments
    if (attachments.length === 0) return;

    // Log telemetry for what was produced
    logEvent("tengu_attachments", {
        attachment_types: attachments.map(a => a.type)
    });

    // Yield each attachment as a message
    for (let attachment of attachments) {
        yield createAttachmentMessage(attachment);
    }
}

// Mapping: oP1→attachmentGenerator, A→atMentions, q→toolUseContext, K→ideContext,
//   Y→queuedCommands, z→messages, w→sessionMemoryType, H→attachments, kq→createAttachmentMessage
```

---

## Attachment Types

### Attachment Object Structure

Each attachment is an object with at minimum a `type` field:

```typescript
type Attachment =
    | { type: "file", filename: string, content: FileContent }
    | { type: "at_mentioned_file", filename: string, content: FileContent, mention_type: "at-mention" }
    | { type: "already_read_file", filename: string, content: FileContent }
    | { type: "pdf_reference", filename: string, pageCount: number, fileSize: number }
    | { type: "changed_files", files: ChangedFileInfo[] }
    | { type: "nested_memory", path: string, content: MemoryContent }
    | { type: "dynamic_skill", skill_name: string, prompt: string }
    | { type: "skill_listing", skills: SkillInfo[] }
    | { type: "plan_mode", reminderType: "full" | "sparse" | "iterative", ... }
    | { type: "plan_mode_reentry", planFilePath: string }
    | { type: "plan_mode_exit", planFilePath: string, planExists: boolean }
    | { type: "delegate_mode", teamName: string, taskListPath: string }
    | { type: "delegate_mode_exit" }
    | { type: "todo_reminder", content: TodoItem[], itemCount: number }
    | { type: "task_reminder", content: TaskItem[], itemCount: number }
    | { type: "selected_lines_in_ide", ideName: string, lineStart: number, ... }
    | { type: "opened_file_in_ide", filename: string }
    | { type: "diagnostics", files: DiagnosticInfo[] }
    | { type: "unified_tasks", tasks: TaskInfo[] }
    | { type: "token_usage", inputTokens: number, outputTokens: number, ... }
    | { type: "budget_usd", budget: number }
    | { type: "queued_command", prompt: string, source_uuid: string }
    | { type: "teammate_mailbox", messages: MailboxMessage[] }
    | { type: "team_context", teamName: string, ... }
    | { type: "output_style", style: string }
    | { type: "critical_system_reminder", content: string }
    | { type: "hook_permission_decision", decision: string, toolUseID: string }
    | { type: "hook_stopped_continuation" }
    | { type: "edited_text_file", filename: string, content: string }
```

---

## Meta-Message Format

### wrapWithSystemReminderTags - Content wrapping

**What it does:**
Wraps content in `<system-reminder>` tags that signal to the LLM that this is contextual information.

**How it works:**

```javascript
// ============================================
// wrapWithSystemReminderTags - Wraps content in system-reminder tags
// Location: chunks.173.mjs:496-523
// ============================================

// ORIGINAL (for source lookup):
function _9(A) {
    return A.map((q) => {
        if (typeof q.message.content === "string") return {
            ...q,
            message: {
                ...q.message,
                content: tI(q.message.content)
            }
        };
        else if (Array.isArray(q.message.content)) {
            let K = q.message.content.map((Y) => {
                if (Y.type === "text") return {
                    ...Y,
                    text: tI(Y.text)
                };
                return Y
            });
            return { ...q, message: { ...q.message, content: K } }
        }
        return q
    })
}

// READABLE (for understanding):
function wrapWithSystemReminderTags(messages) {
    return messages.map((message) => {
        // String content: wrap directly
        if (typeof message.message.content === "string") {
            return {
                ...message,
                message: {
                    ...message.message,
                    content: wrapInXmlTag(message.message.content)
                }
            };
        }
        // Array content: wrap each text block
        else if (Array.isArray(message.message.content)) {
            let wrappedContent = message.message.content.map((block) => {
                if (block.type === "text") {
                    return {
                        ...block,
                        text: wrapInXmlTag(block.text)
                    };
                }
                return block;  // Non-text blocks unchanged
            });
            return {
                ...message,
                message: {
                    ...message.message,
                    content: wrappedContent
                }
            };
        }
        return message;
    });
}

// Mapping: _9→wrapWithSystemReminderTags, A→messages, q→message, tI→wrapInXmlTag
```

### wrapInXmlTag - XML tag helper

```javascript
// ============================================
// wrapInXmlTag - Wraps content in system-reminder XML tags
// Location: chunks.173.mjs:490-494
// ============================================

// ORIGINAL (for source lookup):
function tI(A) {
    return `<system-reminder>
${A}
</system-reminder>`
}

// READABLE (for understanding):
function wrapInXmlTag(content) {
    return `<system-reminder>
${content}
</system-reminder>`;
}

// Mapping: tI→wrapInXmlTag, A→content
```

---

## Specific Attachment Producers

### Plan Mode Attachments

Plan mode has three reminder types based on conversation state:

```javascript
// ============================================
// getPlanModeAttachment - Plan mode reminder producer
// Location: chunks.142.mjs:2034-2058
// ============================================

async function getPlanModeAttachment(messages, toolUseContext) {
    // Check if in plan mode
    let appState = await toolUseContext.getAppState();
    if (appState.toolPermissionContext.mode !== "plan") {
        return [];
    }

    // Check turn count since last plan attachment
    if (messages && messages.length > 0) {
        let { turnCount, foundPlanModeAttachment } = countTurnsSincePlanMode(messages);
        if (foundPlanModeAttachment && turnCount < PLAN_MODE_CONSTANTS.TURNS_BETWEEN_ATTACHMENTS) {
            return [];  // Skip - too recent
        }
    }

    let attachments = [];
    let planFilePath = getPlanFilePath(toolUseContext.agentId);
    let planExists = checkPlanExists(toolUseContext.agentId);

    // Plan mode reentry (if coming back to plan mode)
    if (shouldShowReentryReminder() && planExists !== null) {
        attachments.push({
            type: "plan_mode_reentry",
            planFilePath
        });
        markReentryReminderShown(false);
    }

    // Determine reminder type (full vs sparse)
    // Full reminder every N attachments, sparse in between
    let reminderNumber = (countPlanModeReminders(messages ?? []) + 1) % PLAN_MODE_CONSTANTS.FULL_REMINDER_EVERY_N_ATTACHMENTS;
    let reminderType = reminderNumber === 1 ? "full" : "sparse";

    attachments.push({
        type: "plan_mode",
        reminderType,
        isSubAgent: !!toolUseContext.agentId,
        planFilePath,
        planExists: planExists !== null
    });

    return attachments;
}
```

### Todo/Task Reminders

```javascript
// ============================================
// getTodoReminderAttachment - Todo list reminder producer
// Location: chunks.142.mjs:2645-2661
// ============================================

async function getTodoReminderAttachment(messages, toolUseContext) {
    // Check if TodoWrite tool is available
    if (!toolUseContext.options.tools.some(tool => tool.name === TOOL_NAME_TODO_WRITE)) {
        return [];
    }

    // Need messages to analyze
    if (!messages || messages.length === 0) {
        return [];
    }

    // Analyze turn history
    let { turnsSinceLastTodoWrite, turnsSinceLastReminder } = analyzeTodoUsageHistory(messages);

    // Check thresholds
    if (turnsSinceLastTodoWrite >= TODO_REMINDER_CONSTANTS.TURNS_SINCE_WRITE &&
        turnsSinceLastReminder >= TODO_REMINDER_CONSTANTS.TURNS_BETWEEN_REMINDERS) {

        let todos = getTodos(toolUseContext.agentId ?? generateAgentId());
        return [{
            type: "todo_reminder",
            content: todos,
            itemCount: todos.length
        }];
    }

    return [];
}
```

### Token Usage Attachment

```javascript
// ============================================
// getTokenUsageAttachment - Token usage stats producer
// Location: chunks.142.mjs:2815-2825
// ============================================

function getTokenUsageAttachment(messages, mainLoopModel) {
    // Calculate token stats from message history
    let tokenStats = calculateTokenStats(messages, mainLoopModel);

    return [{
        type: "token_usage",
        inputTokens: tokenStats.inputTokens,
        outputTokens: tokenStats.outputTokens,
        totalTokens: tokenStats.totalTokens,
        contextLimit: tokenStats.contextLimit,
        percentUsed: tokenStats.percentUsed
    }];
}
```

### Changed Files Attachment

```javascript
// ============================================
// getChangedFilesAttachment - Git changed files producer
// Location: chunks.142.mjs:2285-2335
// ============================================

async function getChangedFilesAttachment(toolUseContext) {
    try {
        let gitStatus = await getGitStatus();

        if (!gitStatus || gitStatus.length === 0) {
            return [];
        }

        // Group by status
        let modified = gitStatus.filter(f => f.status === "M");
        let added = gitStatus.filter(f => f.status === "A");
        let deleted = gitStatus.filter(f => f.status === "D");
        let untracked = gitStatus.filter(f => f.status === "??");

        return [{
            type: "changed_files",
            files: {
                modified: modified.map(f => f.path),
                added: added.map(f => f.path),
                deleted: deleted.map(f => f.path),
                untracked: untracked.map(f => f.path)
            },
            totalChanged: gitStatus.length
        }];
    } catch {
        return [];
    }
}
```

---

## Injection Timing

### When Attachments Are Produced

Attachments are produced at specific points in the conversation:

```
┌───────────────────────────────────────────────────────────────────┐
│                     ATTACHMENT INJECTION POINTS                    │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  1. After Tool Execution                                          │
│     ┌─────────────────────────────────────────────────────────┐   │
│     │ mainAgentLoop → oP1 called after tools complete         │   │
│     │                                                          │   │
│     │ Attachments appended to tool results:                   │   │
│     │ [...messages, ...assistantMessages, ...toolResults,     │   │
│     │  ...attachments]                                        │   │
│     └─────────────────────────────────────────────────────────┘   │
│                                                                    │
│  2. At Session Start                                              │
│     ┌─────────────────────────────────────────────────────────┐   │
│     │ Initial context injection on first query                │   │
│     │ - Git status                                            │   │
│     │ - Nested memory                                         │   │
│     │ - Skills                                                │   │
│     └─────────────────────────────────────────────────────────┘   │
│                                                                    │
│  3. On User Input with Mentions                                   │
│     ┌─────────────────────────────────────────────────────────┐   │
│     │ @file, @mcp://, @agent parsed from user input           │   │
│     │ injected before LLM request                             │   │
│     └─────────────────────────────────────────────────────────┘   │
│                                                                    │
│  4. On Mode Transitions                                           │
│     ┌─────────────────────────────────────────────────────────┐   │
│     │ - Enter plan mode → plan_mode attachment                │   │
│     │ - Exit plan mode → plan_mode_exit attachment            │   │
│     │ - Enter delegate mode → delegate_mode attachment        │   │
│     └─────────────────────────────────────────────────────────┘   │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

### Integration in mainAgentLoop

```javascript
// In mainAgentLoop (ZR), after tool execution:
// chunks.149.mjs:2104-2107

let queuedCommands = (await updatedContext.getAppState()).queuedCommands;
for await (let attachment of attachmentGenerator(null, updatedContext, null, queuedCommands, [...messagesForQuery, ...assistantMessages, ...toolResults], querySource)) {
    yield attachment;
    toolResults.push(attachment);  // Include in next LLM request
}

// Clear processed queued commands
let promptCommands = queuedCommands.filter(cmd => cmd.mode === "prompt");
if (promptCommands.length > 0) {
    clearProcessedCommands(promptCommands, updatedContext.setAppState);
}
```

---

## Constants and Configuration

```javascript
// Location: chunks.142.mjs (constants at end of file)

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

// Task reminder constants
const TASK_REMINDER_CONSTANTS = {
    TURNS_BETWEEN_REMINDERS: 10
};

// Task progress threshold
const TASK_PROGRESS_TURNS_THRESHOLD = 3;

// Maximum file lines for attachment
const MAX_FILE_LINES = 2000;

// Ultra-memory token cooldown
const ULTRAMEMORY_CONSTANTS = {
    TOKEN_COOLDOWN: 5000
};
```

---

## Summary

The reminder integration system provides real-time contextual information to the LLM through:

1. **Parallel producers** that run concurrently to minimize latency
2. **Error-resilient design** where each producer is wrapped with error handling
3. **Conditional execution** where user-dependent and main-agent-only producers are skipped when not applicable
4. **XML tag formatting** using `<system-reminder>` to clearly mark contextual content
5. **Strategic timing** where attachments are injected after tool execution to include the latest state

The attachment system is a key differentiator for Claude Code, providing context that the LLM wouldn't otherwise have access to, such as git status, IDE selections, diagnostics, and team collaboration state.