# System Reminder Flow - Complete Integration Analysis

> Complete analysis of how system reminders flow from CLI → LLM Core → API
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-25.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `assembleAllAttachments` (_uY) - Main orchestrator at chunks.147.mjs:3
- `normalizeAttachmentForAPI` (Ui8) - Type converter at chunks.174.mjs:3
- `timedAttachmentProducer` (Hz) - Telemetry wrapper at chunks.147.mjs:20
- `wrapWithSystemReminderTags` (b5) - XML wrapper at chunks.173.mjs:2496
- `createUserMessage` (p1) - Message factory at chunks.173.mjs:1378

---

## Overview

System reminders are **injected messages that guide the LLM's behavior without being visible to the end user**. They appear as `isMeta: true` user messages in the conversation stream, carrying instructions, context, and state notifications.

### Key Design Principles

1. **Dual-Channel Architecture**: Users see chat messages; LLM sees chat + meta messages
2. **Producer Pattern**: Modular producers generate specific reminder types
3. **Priority Groups**: Producers run in parallel groups with dependencies
4. **isMeta Flag**: Single source of truth for UI visibility

---

## Architecture: Three-Layer Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LAYER 1: ATTACHMENT PRODUCTION                            │
│                    assembleAllAttachments (_uY)                              │
│                    chunks.147.mjs:3-18                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Group 1: User-Message-Dependent (Sequential)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ at_mentioned_files (RuY)                                            │    │
│  │ mcp_resources (SuY)                                                 │    │
│  │ agent_mentions (huY)                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼ (Await Group 1 completion)                                        │
│                                                                              │
│  Group 2 & 3: Always-Computed (Parallel)                                     │
│  ┌────────────────────────────────────┐ ┌────────────────────────────────┐  │
│  │ Group 2: Always                    │ │ Group 3: Main-Agent-Only       │  │
│  │                                    │ │                                │  │
│  │ • date_change                      │ │ • ide_selection                │  │
│  │ • ultrathink_effort                │ │ • ide_opened_file              │  │
│  │ • deferred_tools_delta             │ │ • output_style                 │  │
│  │ • mcp_instructions_delta           │ │ • diagnostics                  │  │
│  │ • changed_files                    │ │ • lsp_diagnostics              │  │
│  │ • nested_memory                    │ │ • unified_tasks                │  │
│  │ • dynamic_skill                    │ │ • async_hook_responses         │  │
│  │ • skill_listing                    │ │ • token_usage                  │  │
│  │ • ultra_claude_md                  │ │ • budget_usd                   │  │
│  │ • plan_mode                        │ │ • output_token_usage           │  │
│  │ • plan_mode_exit                   │ │ • verify_plan_reminder         │  │
│  │ • auto_mode                        │ │ • queued_commands              │  │
│  │ • auto_mode_exit                   │ │                                │  │
│  │ • todo_reminders                   │ │ (Skipped if subagent)          │  │
│  │ • teammate_mailbox (team mode)     │ └────────────────────────────────┘  │
│  │ • team_context (team mode)         │                                     │
│  │ • agent_pending_messages           │                                     │
│  │ • critical_system_reminder         │                                     │
│  └────────────────────────────────────┘                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼ (Array of typed attachment objects)
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LAYER 2: ATTACHMENT NORMALIZATION                         │
│                    normalizeAttachmentForAPI (Ui8)                           │
│                    chunks.174.mjs:3-469                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  57+ case switch statement                                                   │
│                                                                              │
│  Input: { type: "plan_mode", ...data }                                      │
│  Output: [{ type: "user", content: [...], isMeta: true }]                   │
│                                                                              │
│  Each case:                                                                  │
│  1. Extracts data from attachment                                           │
│  2. Builds content blocks (text, tool_result, etc.)                         │
│  3. Wraps with <system-reminder> tags (via b5)                              │
│  4. Returns array of TenguMessage objects                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼ (Array of message objects with isMeta: true)
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LAYER 3: MESSAGE STREAM INJECTION                         │
│                    Integrated in mainAgentLoopCore (omY)                     │
│                    chunks.148.mjs:900+                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Pre-turn attachment assembly:                                              │
│                                                                              │
│  const attachments = await assembleAllAttachments(                          │
│      userMessage,         // Current user message (if any)                  │
│      toolUseContext,      // Session context                                │
│      ideSelection,        // IDE state                                      │
│      pendingCommands,     // Queued commands                                │
│      messages,            // Conversation history                           │
│      sessionMemoryType    // "session_memory" or undefined                  │
│  );                                                                          │
│                                                                              │
│  // Prepend attachments before user message                                 │
│  messages = [...attachments, ...messages];                                  │
│                                                                              │
│  // Send to API (isMeta stripped by formatMessagesForAPI)                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LLM RECEIVES CONTEXT                                │
│                                                                              │
│  User sees: [User: "Fix the bug"] [Assistant: "..."]                        │
│  LLM sees: [Meta: "<system-reminder>Plan mode active...</system-reminder>"] │
│             [User: "Fix the bug"] [Assistant: "..."]                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Source Code: assembleAllAttachments (_uY)

```javascript
// ============================================
// assembleAllAttachments - Main orchestrator
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
async function assembleAllAttachments(
    userMessage,           // A: Current user message (if any)
    toolUseContext,        // q: Session context with options, agentId, etc.
    ideSelection,          // K: IDE selection state
    pendingCommands,       // Y: Queued commands from UI
    messages,              // z: Conversation history
    sessionMemoryType      // _: "session_memory" or undefined
) {
    // Global disable check
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // Create abort controller with 1-second timeout
    const abortController = createAbortController();
    const timeoutId = setTimeout((ctrl) => ctrl.abort(), 1000, abortController);

    // Extended context with abort signal
    const context = {
        ...toolUseContext,
        abortController
    };

    // Determine if this is the main agent (not a subagent)
    const isMainAgent = !toolUseContext.agentId;

    // Group 1: User-message-dependent (sequential)
    // Only computed if there's a user message
    const userDependentProducers = userMessage ? [
        timedAttachmentProducer("at_mentioned_files", () => produceAtMentionedFiles(userMessage, context)),
        timedAttachmentProducer("mcp_resources", () => produceMcpResources(userMessage, context)),
        timedAttachmentProducer("agent_mentions", () => Promise.resolve(produceAgentMentions(userMessage, toolUseContext.options.agentDefinitions.activeAgents)))
    ] : [];

    const userDependentResults = await Promise.all(userDependentProducers);

    // Group 2: Always-computed (parallel with Group 3)
    const alwaysComputedProducers = [
        timedAttachmentProducer("date_change", () => Promise.resolve(produceDateChange())),
        timedAttachmentProducer("ultrathink_effort", () => Promise.resolve(produceUltrathinkEffort(userMessage))),
        timedAttachmentProducer("deferred_tools_delta", () => Promise.resolve(produceDeferredToolsDelta(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages))),
        timedAttachmentProducer("mcp_instructions_delta", () => Promise.resolve(produceMcpInstructionsDelta(toolUseContext.options.mcpClients, toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages))),
        timedAttachmentProducer("changed_files", () => produceChangedFiles(context)),
        timedAttachmentProducer("nested_memory", () => produceNestedMemory(context)),
        timedAttachmentProducer("dynamic_skill", () => produceDynamicSkill(context)),
        timedAttachmentProducer("skill_listing", () => produceSkillListing(context)),
        timedAttachmentProducer("ultra_claude_md", async () => produceUltraClaudeMd(messages)),
        timedAttachmentProducer("plan_mode", () => producePlanMode(messages, toolUseContext)),
        timedAttachmentProducer("plan_mode_exit", () => producePlanModeExit(toolUseContext)),
        timedAttachmentProducer("auto_mode", () => produceAutoMode(messages, toolUseContext)),
        timedAttachmentProducer("auto_mode_exit", () => produceAutoModeExit(toolUseContext)),
        timedAttachmentProducer("todo_reminders", () => isTaskSystemEnabled() ? produceTaskReminders(messages, toolUseContext) : produceTodoReminders(messages, toolUseContext)),
        // Team mode producers (conditional)
        ...(isTeamMode() ? [
            ...(sessionMemoryType === "session_memory" ? [] : [timedAttachmentProducer("teammate_mailbox", async () => produceTeammateMailbox(toolUseContext))]),
            timedAttachmentProducer("team_context", async () => produceTeamContext(messages ?? []))
        ] : []),
        timedAttachmentProducer("agent_pending_messages", async () => produceAgentPendingMessages(toolUseContext)),
        timedAttachmentProducer("critical_system_reminder", () => Promise.resolve(produceCriticalSystemReminder(toolUseContext)))
    ];

    // Group 3: Main-agent-only (parallel with Group 2)
    // Skipped if this is a subagent
    const mainAgentOnlyProducers = isMainAgent ? [
        timedAttachmentProducer("ide_selection", async () => produceIdeSelection(ideSelection, toolUseContext)),
        timedAttachmentProducer("ide_opened_file", async () => produceIdeOpenedFile(ideSelection, toolUseContext)),
        timedAttachmentProducer("output_style", async () => Promise.resolve(produceOutputStyle())),
        timedAttachmentProducer("diagnostics", async () => produceDiagnostics(toolUseContext)),
        timedAttachmentProducer("lsp_diagnostics", async () => produceLspDiagnostics(toolUseContext)),
        timedAttachmentProducer("unified_tasks", async () => produceUnifiedTasks(toolUseContext)),
        timedAttachmentProducer("async_hook_responses", async () => produceAsyncHookResponses()),
        timedAttachmentProducer("token_usage", async () => Promise.resolve(produceTokenUsage(messages ?? [], toolUseContext.options.mainLoopModel))),
        timedAttachmentProducer("budget_usd", async () => Promise.resolve(produceBudgetUsd(toolUseContext.options.maxBudgetUsd))),
        timedAttachmentProducer("output_token_usage", async () => Promise.resolve(produceOutputTokenUsage())),
        timedAttachmentProducer("verify_plan_reminder", async () => produceVerifyPlanReminder(messages, toolUseContext)),
        timedAttachmentProducer("queued_commands", () => produceQueuedCommands(pendingCommands))
    ] : [];

    // Execute Groups 2 and 3 in parallel
    const [group2Results, group3Results] = await Promise.all([
        Promise.all(alwaysComputedProducers),
        Promise.all(mainAgentOnlyProducers)
    ]);

    // Clear timeout
    clearTimeout(timeoutId);

    // Combine all results, flatten, and filter
    return [
        ...userDependentResults.flat(),
        ...group2Results.flat(),
        ...group3Results.flat()
    ].filter(attachment => attachment !== undefined && attachment !== null);
}

// Mapping: _uY→assembleAllAttachments, A→userMessage, q→toolUseContext, K→ideSelection,
//   Y→pendingCommands, z→messages, _→sessionMemoryType, t6→parseBoolean,
//   sK→createAbortController, Hz→timedAttachmentProducer, H→isMainAgent,
//   J→userDependentResults, M→alwaysComputedProducers, D→mainAgentOnlyProducers,
//   X→group2Results, P→group3Results, E7→isTeamMode, r$→isTaskSystemEnabled
```

**Why this approach:**
- **Timeout protection**: 1-second timeout prevents producers from blocking indefinitely
- **Dependency ordering**: User-dependent producers complete before Groups 2/3 start
- **Parallel execution**: Groups 2 and 3 run concurrently for efficiency
- **Conditional producers**: Team mode and main-agent-only producers are conditional
- **Error isolation**: Each producer wrapped in `timedAttachmentProducer` catches errors

---

## timedAttachmentProducer (Hz) - Telemetry Wrapper

```javascript
// ============================================
// timedAttachmentProducer - Telemetry wrapper
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
    const startTime = Date.now();

    try {
        const attachments = await producer();
        const duration = Date.now() - startTime;

        // Sample 5% of successful productions for telemetry
        if (Math.random() < 0.05) {
            // Calculate total size of non-null attachments
            const totalBytes = attachments
                .filter(a => a !== undefined && a !== null)
                .reduce((sum, attachment) => sum + calculateAttachmentSize(attachment), 0);

            trackEvent("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                attachment_size_bytes: totalBytes,
                attachment_count: attachments.length
            });
        }

        return attachments;

    } catch (error) {
        const duration = Date.now() - startTime;

        // Sample 5% of errors for telemetry
        if (Math.random() < 0.05) {
            trackEvent("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                error: true
            });
        }

        // Log error and return empty array (don't break other producers)
        reportError(error);
        debugLog(`Attachment error in ${label}`, error);
        return [];
    }
}

// Mapping: Hz→timedAttachmentProducer, A→label, q→producer, K→startTime,
//   Y→attachments, z→duration, d→trackEvent, B6→calculateAttachmentSize,
//   _6→reportError, jV→debugLog
```

---

## Complete Attachment Producer Reference

### Group 1: User-Message-Dependent

| Producer | Symbol | Description | Trigger |
|----------|--------|-------------|---------|
| `at_mentioned_files` | RuY | Files referenced with @filename | User message contains @file |
| `mcp_resources` | SuY | MCP server resources | User message contains resource ref |
| `agent_mentions` | huY | Agent references (@agent-name) | User message contains @agent |

### Group 2: Always-Computed

| Producer | Symbol | Description | Condition |
|----------|--------|-------------|-----------|
| `date_change` | fuY | Date change notification | Date changed since last turn |
| `ultrathink_effort` | TuY | Extended thinking config | High effort mode |
| `deferred_tools_delta` | xE1 | Tool availability changes | Tool set changed |
| `mcp_instructions_delta` | uE1 | MCP instructions changes | MCP config changed |
| `changed_files` | CuY | Recently modified files | Files modified |
| `nested_memory` | IuY | Nested MEMORY.md content | Memory files exist |
| `dynamic_skill` | BuY | Dynamic skill loading | Skills available |
| `skill_listing` | guY | Available slash commands | Skills available |
| `ultra_claude_md` | VuY | CLAUDE.md content | CLAUDE.md exists |
| `plan_mode` | DuY | Plan mode instructions | Permission mode = "plan" |
| `plan_mode_exit` | XuY | Plan mode exit reminder | Exiting plan mode |
| `auto_mode` | ZuY | Auto mode instructions | Auto mode active |
| `auto_mode_exit` | GuY | Auto mode exit reminder | Exiting auto mode |
| `todo_reminders` | auY/ruY | Task/todo list content | Tasks/todos exist |
| `teammate_mailbox` | euY | Team mailbox messages | Team mode active |
| `team_context` | AmY | Team identity/resources | Team mode active |
| `agent_pending_messages` | $uY | Pending coordinator messages | Agent has pending work |
| `critical_system_reminder` | vuY | Critical notifications | Critical state |

### Group 3: Main-Agent-Only

| Producer | Symbol | Description | Condition |
|----------|--------|-------------|-----------|
| `ide_selection` | kuY | IDE text selection | IDE connected + selection |
| `ide_opened_file` | LuY | IDE open file info | IDE connected |
| `output_style` | NuY | Output format preference | Style configured |
| `diagnostics` | cuY | IDE diagnostics | IDE connected |
| `lsp_diagnostics` | luY | LSP errors/warnings | LSP running |
| `unified_tasks` | suY | Unified task view | Tasks configured |
| `async_hook_responses` | tuY | Hook async responses | Hooks pending |
| `token_usage` | qmY | Current token count | Always |
| `budget_usd` | YmY | Cost budget status | Budget set |
| `output_token_usage` | KmY | Output token count | Always |
| `verify_plan_reminder` | _mY | Plan verification prompt | Plan created |
| `queued_commands` | OuY | Queued slash commands | Commands queued |

---

## normalizeAttachmentForAPI (Ui8) - Type Converter

```javascript
// ============================================
// normalizeAttachmentForAPI - Central type dispatcher
// Location: chunks.174.mjs:3-469
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (!A) return [];
    switch (A.type) {
        case "plan_mode":
            return b5(A.content);
        case "token_usage":
            return b5(`Token usage: ${A.inputTokens} / ${A.maxTokens}`);
        case "todo":
        case "todo_reminders":
            return b5(formatTodoList(A.items));
        // ... 57+ more cases
        default:
            jV("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${A.type}`));
            return [];
    }
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    if (!attachment) return [];

    switch (attachment.type) {
        // Mode control types
        case "plan_mode":
            return wrapWithSystemReminderTags(attachment.content);
        case "plan_mode_exit":
            return wrapWithSystemReminderTags(PLAN_MODE_EXIT_REMINDER);
        case "auto_mode":
            return wrapWithSystemReminderTags(attachment.content);
        case "auto_mode_exit":
            return wrapWithSystemReminderTags(AUTO_MODE_EXIT_REMINDER);

        // Status/budget types
        case "token_usage":
            return wrapWithSystemReminderTags(
                formatTokenUsage(attachment.inputTokens, attachment.maxTokens, attachment.model)
            );
        case "budget_usd":
            return wrapWithSystemReminderTags(
                formatBudgetStatus(attachment.maxBudgetUsd, attachment.currentSpend)
            );
        case "output_token_usage":
            return wrapWithSystemReminderTags(
                formatOutputTokenUsage(attachment.outputTokens)
            );

        // Task/todo types
        case "todo":
        case "todo_reminders":
            return wrapWithSystemReminderTags(
                formatTodoList(attachment.items)
            );
        case "unified_tasks":
            return wrapWithSystemReminderTags(
                formatUnifiedTasks(attachment.tasks)
            );

        // Team types
        case "teammate_mailbox":
            return wrapWithSystemReminderTags(
                formatMailboxMessages(attachment.messages)
            );
        case "team_context":
            return wrapWithSystemReminderTags(
                formatTeamContext(attachment.teamName, attachment.resources)
            );
        case "agent_pending_messages":
            return attachment.messages.map(msg => ({
                type: "user",
                content: msg.content,
                isMeta: true
            }));

        // IDE types
        case "ide_selection":
            return wrapWithSystemReminderTags(
                formatIdeSelection(attachment.file, attachment.selection)
            );
        case "ide_opened_file":
            return wrapWithSystemReminderTags(
                formatIdeOpenedFile(attachment.files)
            );
        case "diagnostics":
        case "lsp_diagnostics":
            return wrapWithSystemReminderTags(
                formatDiagnostics(attachment.diagnostics)
            );

        // Memory types
        case "nested_memory":
        case "ultra_claude_md":
            return attachment.content.map(block => ({
                type: "user",
                content: [block],
                isMeta: true
            }));

        // File types
        case "changed_files":
            return wrapWithSystemReminderTags(
                formatChangedFiles(attachment.files)
            );
        case "at_mentioned_files":
            return attachment.files.map(file => ({
                type: "user",
                content: [{ type: "text", text: formatFileContent(file) }],
                isMeta: true
            }));

        // MCP types
        case "mcp_resources":
            return wrapWithSystemReminderTags(
                formatMcpResources(attachment.resources)
            );
        case "mcp_instructions_delta":
            return wrapWithSystemReminderTags(
                formatMcpInstructions(attachment.instructions)
            );

        // Skill types
        case "skill_listing":
            return wrapWithSystemReminderTags(
                formatSkillListing(attachment.skills)
            );
        case "dynamic_skill":
            return wrapWithSystemReminderTags(
                formatDynamicSkill(attachment.skill)
            );
        case "queued_command":
            return [{
                type: "user",
                content: attachment.prompt,
                isMeta: attachment.isMeta ?? true
            }];

        // Other types
        case "date_change":
            return wrapWithSystemReminderTags(
                formatDateChange(attachment.oldDate, attachment.newDate)
            );
        case "critical_system_reminder":
            return wrapWithSystemReminderTags(attachment.content);
        case "verify_plan_reminder":
            return wrapWithSystemReminderTags(VERIFY_PLAN_REMINDER);

        default:
            debugLog("normalizeAttachmentForAPI", new Error(`Unknown attachment type: ${attachment.type}`));
            return [];
    }
}

// Mapping: Ui8→normalizeAttachmentForAPI, A→attachment, b5→wrapWithSystemReminderTags,
//   jV→debugLog
```

---

## wrapWithSystemReminderTags (b5) - XML Wrapper

```javascript
// ============================================
// wrapWithSystemReminderTags - XML tag wrapper
// Location: chunks.173.mjs:2496
// ============================================

// ORIGINAL (for source lookup):
function b5(A) {
    return [{
        type: "user",
        content: [{
            type: "text",
            text: `<system-reminder>
${A}
</system-reminder>`
        }],
        isMeta: !0
    }]
}

// READABLE (for understanding):
function wrapWithSystemReminderTags(content) {
    return [{
        type: "user",
        content: [{
            type: "text",
            text: `<system-reminder>
${content}
</system-reminder>`
        }],
        isMeta: true  // Hidden from UI, visible to LLM
    }];
}

// Mapping: b5→wrapWithSystemReminderTags, A→content
```

**Why XML tags:**
- **Clear delimitation**: LLM knows where reminder starts/ends
- **Type identification**: Parser can extract reminder type
- **Consistent format**: All reminders use same wrapper
- **Non-invasive**: Doesn't interfere with user message parsing

---

## Integration with Agent Loop

### Pre-Turn Attachment Assembly

```javascript
// ============================================
// Pre-turn attachment assembly in mainAgentLoopCore
// Location: chunks.148.mjs:900-950
// ============================================

// Inside the turn loop:
async function* mainAgentLoopCore(params, progressMessages) {
    // ... state initialization ...

    while (true) {
        // Extract state for this turn
        let { messages, toolUseContext } = state;

        // Trigger skill prefetch (background)
        let prefetchPromise = skillDiscoveryPrefetch?.(null, messages, toolUseContext);

        // Yield stream start event
        yield { type: "stream_request_start" };

        // Pre-compact attachments trigger
        let preCompactTrigger = getRelevantMemoriesTrigger(messages, toolUseContext);

        // Micro-compact: Remove consecutive duplicate messages
        messages = (await helpers.microcompact(messages, toolUseContext, querySource)).messages;

        // Auto-compact check (if threshold exceeded)
        let { compactionResult, consecutiveFailures } = await helpers.autocompact(
            messages,
            toolUseContext,
            { systemPrompt, userContext, systemContext },
            querySource,
            autoCompactTracking
        );

        // If compacted, yield summary messages
        if (compactionResult) {
            for (let summaryMsg of compactionResult.summaryMessages) {
                yield summaryMsg;
            }
            messages = compactionResult.summaryMessages;
        }

        // ... continue with LLM request ...
    }
}
```

---

## Attachment Priority and Ordering

### Priority Classes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT PRIORITY ORDER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. CRITICAL (always shown, first)                                          │
│     • critical_system_reminder                                               │
│     • date_change                                                            │
│                                                                              │
│  2. MODE CONTROL (affects LLM behavior)                                     │
│     • plan_mode                                                              │
│     • plan_mode_exit                                                         │
│     • auto_mode                                                              │
│     • auto_mode_exit                                                         │
│     • ultrathink_effort                                                      │
│                                                                              │
│  3. CONTEXT (provides information)                                          │
│     • nested_memory                                                          │
│     • ultra_claude_md                                                        │
│     • skill_listing                                                          │
│     • dynamic_skill                                                          │
│     • mcp_instructions_delta                                                 │
│     • deferred_tools_delta                                                   │
│                                                                              │
│  4. FILES (user-referenced or changed)                                      │
│     • at_mentioned_files                                                     │
│     • mcp_resources                                                          │
│     • changed_files                                                          │
│     • ide_selection                                                          │
│     • ide_opened_file                                                        │
│                                                                              │
│  5. TASKS (todo/task status)                                                │
│     • todo_reminders                                                         │
│     • unified_tasks                                                          │
│     • queued_commands                                                        │
│     • agent_pending_messages                                                 │
│                                                                              │
│  6. TEAM (collaboration context)                                            │
│     • teammate_mailbox                                                       │
│     • team_context                                                           │
│     • agent_mentions                                                         │
│                                                                              │
│  7. STATUS (usage/budget - last)                                            │
│     • token_usage                                                            │
│     • budget_usd                                                             │
│     • output_token_usage                                                     │
│     • diagnostics                                                            │
│     • lsp_diagnostics                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Ordering Rationale

1. **Critical first**: System-level notifications must be seen
2. **Mode control early**: LLM needs to know constraints before acting
3. **Context in middle**: Provides background for decisions
4. **Files before actions**: LLM knows what it's working with
5. **Tasks late**: Current state of work items
6. **Team context**: Collaboration awareness
7. **Status last**: Usage info doesn't affect behavior

---

## Error Handling

### Producer Error Isolation

```javascript
// Each producer is wrapped in try-catch via timedAttachmentProducer
// If a producer fails:
// 1. Error is logged
// 2. Empty array is returned
// 3. Other producers continue unaffected

// Example: If produceNestedMemory fails:
// - Telemetry event with error: true
// - Debug log with error details
// - Return [] instead of crashing
// - Other attachments still process normally
```

### Timeout Protection

```javascript
// 1-second global timeout for all attachment production
const abortController = createAbortController();
setTimeout((ctrl) => ctrl.abort(), 1000, abortController);

// If timeout triggers:
// - AbortController.signal.aborted becomes true
// - In-flight producers may receive abort signal
// - Function returns whatever was collected before timeout
```

---

## Source References

| Component | File | Key Functions |
|-----------|------|---------------|
| Assembly | chunks.147.mjs | `assembleAllAttachments` (_uY), `timedAttachmentProducer` (Hz) |
| Normalization | chunks.174.mjs | `normalizeAttachmentForAPI` (Ui8) |
| XML Wrapper | chunks.173.mjs | `wrapWithSystemReminderTags` (b5), `createUserMessage` (p1) |
| Agent Loop | chunks.148.mjs | `mainAgentLoopCore` (omY) - attachment injection |
| Producers | chunks.147.mjs | RuY, SuY, huY, CuY, IuY, BuY, guY, DuY, etc. |

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - Full system reminder flow documented