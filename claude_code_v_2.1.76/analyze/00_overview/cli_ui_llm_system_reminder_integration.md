# System Reminder Integration - CLI/UI/LLM Complete Analysis (Claude Code v2.1.76)

> Complete integration analysis of System Reminders across CLI, UI, and LLM Core modules.
>
> **Cross-validated**: All symbol mappings verified against source code on 2026-03-26.
> **Source-Level**: Includes both original obfuscated and readable pseudocode.

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

## 1. Architecture Overview

### 1.1 Three-Layer Pipeline

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

## 2. CLI Integration

### 2.1 Mode-Based Attachment Selection

```javascript
// ============================================
// Permission Mode to Reminder Mapping
// Location: chunks.197.mjs
// ============================================

// READABLE (for understanding):
function resolvePermissionMode(options) {
    // Check for bypass mode flag
    if (options.dangerouslySkipPermissions) {
        return "bypassPermissions";
    }

    // Check for plan mode
    if (options.plan) {
        return "plan";
    }

    // Default mode
    return "default";
}

// Mode affects attachment production:
// | Permission Mode | Trigger | Attachment Types |
// |-----------------|---------|------------------|
// | default         | Normal  | Standard reminders |
// | plan            | --plan  | plan_mode, plan_mode_reentry |
// | bypassPermissions | --dangerously-skip | No permission prompts |
```

### 2.2 Plan Mode Attachment Producer

```javascript
// ============================================
// producePlanModeAttachment (DuY) - Plan mode producer
// Location: chunks.147.mjs:136-168
// ============================================

// ORIGINAL (for source lookup):
async function DuY(A, q) {
    let Y = q.getAppState().toolPermissionContext;
    if (Y.mode !== "plan") return [];
    if (A && A.length > 0) {
        let { turnCount: H, foundPlanModeAttachment: j } = JuY(A);
        if (j && H < t4q.TURNS_BETWEEN_ATTACHMENTS) return [];
    }
    let z = Fj(q.agentId),
        _ = sJ(q.agentId),
        w = [];
    if (Y.prePlanMode === "ultraplan") return w.push({
        type: "plan_mode",
        reminderType: "ultraplan-complete",
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: _ !== null
    }), w;
    if (nk6() && _ !== null) w.push({
        type: "plan_mode_reentry",
        planFilePath: z
    }), HV(!1);
    let $ = (MuY(A ?? []) + 1) % t4q.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return w.push({
        type: "plan_mode",
        reminderType: $,
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: _ !== null
    }), w
}

// READABLE (for understanding):
async function producePlanModeAttachment(messageHistory, sessionContext) {
    let permissionContext = sessionContext.getAppState().toolPermissionContext;

    // Only produce if in plan mode
    if (permissionContext.mode !== "plan") {
        return [];
    }

    // Throttling: Don't attach every turn
    if (messageHistory && messageHistory.length > 0) {
        let { turnCount, foundPlanModeAttachment } = analyzeRecentMessages(messageHistory);
        if (foundPlanModeAttachment && turnCount < TURNS_BETWEEN_ATTACHMENTS) {
            return [];  // Skip, recent attachment exists
        }
    }

    let planFilePath = getPlanFilePath(sessionContext.agentId);
    let planExists = getExistingPlanContent(sessionContext.agentId) !== null;
    let attachments = [];

    // Ultraplan variant
    if (permissionContext.prePlanMode === "ultraplan") {
        attachments.push({
            type: "plan_mode",
            reminderType: "ultraplan-complete",
            isSubAgent: !!sessionContext.agentId,
            planFilePath: planFilePath,
            planExists: planExists
        });
        return attachments;
    }

    // Re-entry variant (returning to plan mode with existing plan)
    if (isReEnteringPlanMode() && planExists !== null) {
        attachments.push({
            type: "plan_mode_reentry",
            planFilePath: planFilePath
        });
        clearReEntryFlag();
    }

    // Full vs sparse variant rotation
    let reminderType = (countRecentPlanAttachments(messageHistory ?? []) + 1) %
                       FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
                       ? "full" : "sparse";

    attachments.push({
        type: "plan_mode",
        reminderType: reminderType,
        isSubAgent: !!sessionContext.agentId,
        planFilePath: planFilePath,
        planExists: planExists
    });

    return attachments;
}

// Mapping: DuY→producePlanModeAttachment, t4q→constants, JuY→analyzeRecentMessages,
//          Fj→getPlanFilePath, sJ→getExistingPlanContent, MuY→countRecentPlanAttachments
```

---

## 3. UI Integration

### 3.1 isMeta Flag - UI Visibility Control

The `isMeta: true` flag on messages controls UI visibility:

```javascript
// ============================================
// createUserMessage (p1) - Message factory with isMeta
// Location: chunks.173.mjs:1378-1412
// ============================================

// ORIGINAL (for source lookup):
function p1(A) {
    return {
        type: "user",
        role: "user",
        content: A.content,
        uuid: A.uuid ?? crypto.randomUUID(),
        isMeta: A.isMeta ?? !1,
        ...A
    }
}

// READABLE (for understanding):
function createUserMessage(params) {
    return {
        type: "user",
        role: "user",
        content: params.content,
        uuid: params.uuid ?? crypto.randomUUID(),
        isMeta: params.isMeta ?? false,  // Controls UI visibility
        ...params
    };
}

// Mapping: p1→createUserMessage
```

### 3.2 Message Filtering in UI

```javascript
// ============================================
// Message filtering - UI display logic
// ============================================

// READABLE (for understanding):
function filterMessagesForDisplay(messages) {
    return messages.filter(message => {
        // Hide meta messages from user-visible chat
        if (message.isMeta) {
            return false;
        }
        return true;
    });
}

// UI shows: [User: "Fix the bug"] [Assistant: "..."]
// LLM sees: [Meta: "<system-reminder>..."] [User: "Fix the bug"] [Assistant: "..."]
```

---

## 4. LLM Core Integration

### 4.1 Attachment Assembly in Turn Loop

```javascript
// ============================================
// Attachment assembly in mainAgentLoopCore
// Location: chunks.148.mjs:900-920
// ============================================

// READABLE (for understanding):
// In mainAgentLoopCore, before each LLM request:

// Assemble system reminder attachments
let attachments = await assembleAllAttachments(
    userMessage,           // Current user message (if any)
    turnState.toolUseContext,  // Session context
    ideSelection,          // IDE selection state
    pendingCommands,       // Queued commands from UI
    turnState.messages,    // Conversation history
    sessionMemoryType      // "session_memory" or undefined
);

// Prepend attachments to messages
let requestMessages = [
    ...attachments,        // System reminders first
    ...turnState.messages  // Then conversation history
];

// Send to LLM API
for await (let event of callModel({
    messages: requestMessages,
    systemPrompt: systemPrompt,
    tools: tools,
    model: model
})) {
    yield event;
}
```

### 4.2 normalizeAttachmentForAPI (Ui8)

```javascript
// ============================================
// normalizeAttachmentForAPI (Ui8) - Type converter
// Location: chunks.174.mjs:3-100
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
...
</system-reminder>`,
            isMeta: !0
        })]
    }
    switch (A.type) {
        case "directory":
            return b5([nr6(J4.name, {
                command: `ls ${j4([A.path])}`,
                description: `Lists files in ${A.path}`
            }), ir6(J4, {
                stdout: A.content,
                stderr: "",
                interrupted: !1
            })]);
        case "edited_text_file":
            return b5([p1({
                content: `Note: ${A.filename} was modified...
${A.snippet}`,
                isMeta: !0
            })]);
        case "file": {
            // Handle file types: image, text, notebook, pdf
        }
        case "plan_mode": {
            // Handle plan mode variants: full, sparse, ultraplan-complete
        }
        // ... 57+ more cases
    }
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Team mode attachments (special handling)
    if (isTeamMode()) {
        if (attachment.type === "teammate_mailbox") {
            return [createUserMessage({
                content: formatTeammateMessages(attachment.messages),
                isMeta: true
            })];
        }
        if (attachment.type === "team_context") {
            return [createUserMessage({
                content: buildTeamContextContent(attachment),
                isMeta: true
            })];
        }
    }

    // Main switch for all attachment types
    switch (attachment.type) {
        case "directory":
            return wrapWithSystemReminderTags([
                createToolCallMessage("Bash", {
                    command: `ls ${escapeShellArg(attachment.path)}`,
                    description: `Lists files in ${attachment.path}`
                }),
                createToolResultMessage("Bash", {
                    stdout: attachment.content,
                    stderr: "",
                    interrupted: false
                })
            ]);

        case "edited_text_file":
            return wrapWithSystemReminderTags([
                createUserMessage({
                    content: `Note: ${attachment.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
${attachment.snippet}`,
                    isMeta: true
                })
            ]);

        case "file":
            // Handle different file content types
            switch (attachment.content.type) {
                case "image":
                    return wrapWithSystemReminderTags([
                        createToolCallMessage("Read", { file_path: attachment.filename }),
                        createToolResultMessage("Read", attachment.content)
                    ]);
                case "text":
                    return wrapWithSystemReminderTags([
                        createToolCallMessage("Read", { file_path: attachment.filename }),
                        createToolResultMessage("Read", attachment.content),
                        ...(attachment.truncated ? [
                            createUserMessage({
                                content: `Note: The file ${attachment.filename} was too large and has been truncated to the first 2000 lines. Don't tell the user about this truncation. Use Read to read more of the file if you need.`,
                                isMeta: true
                            })
                        ] : [])
                    ]);
                // ... notebook, pdf cases
            }
            break;

        case "plan_mode":
            return wrapWithSystemReminderTags([
                createUserMessage({
                    content: buildPlanModeContent(attachment),
                    isMeta: true
                })
            ]);

        case "token_usage":
            return wrapWithSystemReminderTags([
                createUserMessage({
                    content: buildTokenUsageContent(attachment),
                    isMeta: true
                })
            ]);

        // ... 50+ more cases
    }
}

// Mapping: Ui8→normalizeAttachmentForAPI, E7→isTeamMode, p1→createUserMessage,
//          b5→wrapWithSystemReminderTags, nr6→createToolCallMessage, ir6→createToolResultMessage
```

---

## 5. Attachment Type Categories

### 5.1 Complete Type Catalog

| Category | Types | Trigger | Source Location |
|----------|-------|---------|-----------------|
| **User-Dependent** | at_mentioned_files, mcp_resources, agent_mentions | User message content | Group 1 |
| **Mode Control** | plan_mode, plan_mode_exit, plan_mode_reentry, auto_mode, auto_mode_exit | Permission mode | Group 2 |
| **Team Mode** | teammate_mailbox, team_context | Team mode enabled | Group 2 |
| **IDE Integration** | ide_selection, ide_opened_file, diagnostics, lsp_diagnostics | IDE connection | Group 3 |
| **Status/Budget** | token_usage, budget_usd, output_token_usage | Every turn | Group 3 |
| **Memory** | nested_memory, dynamic_skill, skill_listing, relevant_memories | Memory enabled | Group 2 |
| **Hooks** | async_hook_responses, critical_system_reminder, hook_blocking_error | Hook execution | Groups 2/3 |
| **Task Management** | todo, todo_reminder, task_reminder, task_status, task_progress | Todo/task system | Group 2 |
| **File Context** | directory, file, edited_text_file, compact_file_reference, pdf_reference | File operations | Group 1 |
| **Silent** | already_read_file, command_permissions, edited_image_file, hook_cancelled | Internal state | All groups |

### 5.2 Producer Execution Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PRODUCER EXECUTION STRATEGY                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  GROUP 1: User-Message-Dependent                                            │
│  ───────────────────────────────────                                        │
│  Execution: SEQUENTIAL (await all before continuing)                        │
│  Reason: Dependencies on parsed user message content                        │
│  Timeout: 1 second total (shared with all groups)                           │
│                                                                              │
│  GROUP 2: Always-Computed                                                   │
│  ───────────────────────────                                                │
│  Execution: PARALLEL (Promise.all)                                          │
│  Reason: No dependencies between producers                                  │
│  Scope: All agents (main + subagents)                                       │
│                                                                              │
│  GROUP 3: Main-Agent-Only                                                   │
│  ─────────────────────────                                                  │
│  Execution: PARALLEL (Promise.all)                                          │
│  Reason: No dependencies, but skipped for subagents                         │
│  Scope: Main agent only (skipped if toolUseContext.agentId is set)          │
│                                                                              │
│  TIMEOUT HANDLING                                                           │
│  ─────────────────                                                          │
│  Total timeout: 1 second                                                    │
│  On timeout: Return partial results (already completed)                     │
│  Error handling: Each producer catches its own errors, returns []           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. wrapWithSystemReminderTags (b5)

### 6.1 XML Wrapper Implementation

```javascript
// ============================================
// wrapWithSystemReminderTags (b5) - XML wrapper
// Location: chunks.173.mjs:2496-2523
// ============================================

// ORIGINAL (for source lookup):
function b5(A) {
    return A.map(q => ({
        ...q,
        content: [{
            type: "text",
            text: `<system-reminder>
${q.content.map(K => K.type === "text" ? K.text : "").join("\n")}
</system-reminder>`
        }, ...q.content.filter(K => K.type !== "text")],
        isMeta: !0
    }))
}

// READABLE (for understanding):
function wrapWithSystemReminderTags(messages) {
    return messages.map(message => ({
        ...message,
        content: [
            // Wrap text content in XML tags
            {
                type: "text",
                text: `<system-reminder>
${message.content
    .filter(block => block.type === "text")
    .map(block => block.text)
    .join("\n")}
</system-reminder>`
            },
            // Preserve non-text content (images, tool results, etc.)
            ...message.content.filter(block => block.type !== "text")
        ],
        isMeta: true  // Mark as meta for UI filtering
    }));
}

// Mapping: b5→wrapWithSystemReminderTags
```

### 6.2 Why XML Tags?

**Rationale:**
1. Clear delineation of system content vs user content
2. LLM can easily parse and identify system instructions
3. Consistent format across all reminder types
4. Enables structured parsing if needed

---

## 7. Integration Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE INTEGRATION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI FLAGS                                                                   │
│  ├─ --plan → permissionContext.mode = "plan"                                │
│  ├─ --dangerously-skip-permissions → mode = "bypassPermissions"             │
│  ├─ --agent → agentId set, affects Group 3 inclusion                        │
│  └─ --team-name → team mode enabled                                         │
│         │                                                                    │
│         ▼                                                                    │
│  SESSION STATE (toolUseContext)                                             │
│  ├─ permissionContext                                                       │
│  ├─ agentId                                                                 │
│  ├─ options.mcpClients                                                      │
│  └─ options.agentDefinitions                                                │
│         │                                                                    │
│         ▼                                                                    │
│  UI STATE                                                                    │
│  ├─ ideSelection (IDE context)                                              │
│  ├─ pendingCommands (queued messages)                                       │
│  └─ messages (conversation history)                                         │
│         │                                                                    │
│         ▼                                                                    │
│  assembleAllAttachments (_uY)                                               │
│  ├─ Group 1: Sequential user-dependent                                      │
│  ├─ Group 2: Parallel always-computed                                       │
│  └─ Group 3: Parallel main-agent-only                                       │
│         │                                                                    │
│         ▼                                                                    │
│  normalizeAttachmentForAPI (Ui8)                                            │
│  ├─ 57+ type handlers                                                       │
│  ├─ Wrap with XML tags                                                      │
│  └─ Set isMeta: true                                                        │
│         │                                                                    │
│         ▼                                                                    │
│  mainAgentLoopCore (omY)                                                    │
│  ├─ Prepend attachments to messages                                         │
│  └─ Send to LLM API                                                         │
│         │                                                                    │
│         ▼                                                                    │
│  UI RENDERING                                                               │
│  ├─ Filter isMeta messages from display                                     │
│  └─ Show user-visible messages only                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Related Documents

> System Reminder Module:
> - [04_system_reminder/README.md](../04_system_reminder/README.md) - Module hub
> - [attachment_producers.md](../04_system_reminder/attachment_producers.md) - Producer details
> - [reminder_types.md](../04_system_reminder/reminder_types.md) - Type catalog

> CLI Integration:
> - [01_cli/system_reminder_integration.md](../01_cli/system_reminder_integration.md) - CLI integration

> LLM Core Integration:
> - [03_llm_core/system_reminder_flow.md](../03_llm_core/system_reminder_flow.md) - Flow analysis

> Joint Analysis:
> - [cli_ui_llm_joint_complete_v4.md](../00_overview/cli_ui_llm_joint_complete_v4.md) - Complete joint analysis

> Symbol Index:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols