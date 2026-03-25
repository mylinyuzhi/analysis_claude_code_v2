# CLI-System Reminder Integration

> How CLI flags and session state affect system reminder attachment production

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - System Reminder, CLI Module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent Loop, State Management

Key functions in this document:
- `normalizeAttachmentForAPI` (Ui8) - Converts attachments to API messages - chunks.174.mjs:3
- `producePlanModeAttachment` (DuY) - Plan mode attachment producer - chunks.147.mjs:136
- `produceAutoModeAttachment` (ZuY) - Auto mode attachment producer - chunks.147.mjs:214
- `produceTokenUsageAttachment` - Token usage stats - chunks.147.mjs:1113
- `produceBudgetAttachment` - Budget USD stats - chunks.147.mjs:1129

---

## Overview

The CLI layer integrates with the System Reminder module through:

1. **Mode Activation** - CLI flags set modes that determine attachment variants
2. **Permission Context** - Tool permission context influences reminder content
3. **Team Mode** - Team-related flags trigger teammate mailbox attachments
4. **Token Management** - Token usage attachments track context window

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   CLI → SYSTEM REMINDER INTEGRATION PIPELINE                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  CLI Flags       │    │  Session State    │    │  Permission      │     │
│  │  --plan          │    │  teamMode         │    │  Context         │     │
│  │  --agent         │    │  delegateMode     │    │  mode: default   │     │
│  │  --print         │    │  agentId          │    │  bypass          │     │
│  └────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘     │
│           │                        │                       │               │
│           └────────────────────────┼───────────────────────┘               │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │  Attachment Producers         │                       │
│                    │  (40+ producers)              │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│           ┌────────────────────────┼────────────────────────┐              │
│           │                        │                        │              │
│           ▼                        ▼                        ▼              │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│  │ Mode Control    │   │ Team Mode       │   │ Status/Budget   │          │
│  │ Attachments     │   │ Attachments     │   │ Attachments     │          │
│  │                 │   │                 │   │                 │          │
│  │ plan_mode       │   │ teammate_       │   │ token_usage     │          │
│  │ auto_mode       │   │ mailbox         │   │ budget_usd      │          │
│  │ delegate_mode   │   │ team_context    │   │ compaction_     │          │
│  └─────────────────┘   └─────────────────┘   │ reminder        │          │
│                                              └─────────────────┘          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Mode-Based Attachment Selection

### 1.1 Permission Mode to Reminder Mapping

The `toolPermissionContext.mode` determines which attachment variants are produced:

| Permission Mode | Trigger | Attachment Types |
|-----------------|---------|------------------|
| `default` | Normal operation | Standard reminders |
| `plan` | `--plan` flag or EnterPlanMode tool | `plan_mode`, `plan_mode_reentry`, `plan_file_reference` |
| `auto` | Auto mode activation | `auto_mode`, `auto_mode_exit` |
| `bypassPermissions` | `--dangerously-skip-permissions` | All tools allowed, no permission prompts |

**Source location:** `chunks.197.mjs` (mode resolution)

```javascript
// ============================================
// permissionModeResolution - Permission mode resolution from CLI flags
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
```

### 1.2 Plan Mode Attachment Producer

**Source location:** `chunks.147.mjs:136-168`

```javascript
// ============================================
// producePlanModeAttachment - Plan mode attachment producer
// Location: chunks.147.mjs:136-168
// ============================================

// ORIGINAL (for source lookup):
async function DuY(A, q) {
    let Y = q.getAppState().toolPermissionContext;
    if (Y.mode !== "plan") return [];
    if (A && A.length > 0) {
        let {
            turnCount: H,
            foundPlanModeAttachment: j
        } = JuY(A);
        if (j && H < t4q.TURNS_BETWEEN_ATTACHMENTS) return []
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

// Mapping: DuY→producePlanModeAttachment, A→messageHistory, q→sessionContext,
//          Y→permissionContext, JuY→analyzeRecentMessages, t4q.TURNS_BETWEEN_ATTACHMENTS→TURNS_BETWEEN_ATTACHMENTS,
//          Fj→getPlanFilePath, sJ→getExistingPlanContent, nk6→isReEnteringPlanMode, HV→clearReEntryFlag,
//          MuY→countRecentPlanAttachments
```

**Why three variants exist:**

1. **Full mode** - First plan mode entry, complete instructions (every N attachments)
2. **Sparse mode** - Subsequent turns, reduced token overhead
3. **Re-entry mode** - Returning to plan mode with existing plan file

---

## 2. Complete Attachment Type Reference

### 2.1 All Attachment Types (40+ types)

**Source location:** `chunks.147.mjs` and `chunks.174.mjs`

| Category | Type | Description | Source Location |
|----------|------|-------------|-----------------|
| **Mode Control** | `plan_mode` | Plan mode instructions | chunks.147.mjs:150 |
| | `plan_mode_reentry` | Return to plan mode | chunks.147.mjs:157 |
| | `plan_mode_exit` | Exit plan mode | chunks.147.mjs:177 |
| | `auto_mode` | Auto mode instructions | chunks.147.mjs:224 |
| | `auto_mode_exit` | Exit auto mode | chunks.147.mjs:233 |
| **Status** | `token_usage` | Token usage stats | chunks.147.mjs:1113 |
| | `budget_usd` | USD budget tracking | chunks.147.mjs:1129 |
| | `output_token_usage` | Output token counts | chunks.174.mjs:366 |
| | `compaction_reminder` | Auto-compact notification | chunks.174.mjs:398 |
| **Date/Time** | `date_change` | Date change notification | chunks.147.mjs:243 |
| **Effort** | `ultrathink_effort` | Reasoning effort level | chunks.147.mjs:251 |
| **Tools** | `deferred_tools_delta` | Deferred tools changes | chunks.147.mjs:264 |
| **MCP** | `mcp_instructions_delta` | MCP server instructions | chunks.147.mjs:279 |
| | `mcp_resource` | MCP resource content | chunks.147.mjs:481 |
| **Critical** | `critical_system_reminder` | Urgent system message | chunks.147.mjs:288 |
| **Style** | `output_style` | Output style active | chunks.147.mjs:297 |
| **IDE** | `selected_lines_in_ide` | User selected lines | chunks.147.mjs:312 |
| | `opened_file_in_ide` | User opened file | chunks.147.mjs:402 |
| **Memory** | `nested_memory` | Nested memory content | chunks.147.mjs:350 |
| | `relevant_memories` | Relevant memory files | chunks.147.mjs:587 |
| | `ultramemory` | Ultramemory content | chunks.174.mjs:223 |
| **Agent** | `agent_mention` | Agent invocation request | chunks.147.mjs:458 |
| **Files** | `file` | File content | chunks.174.mjs:55 |
| | `directory` | Directory listing | chunks.174.mjs:40 |
| | `edited_text_file` | Modified text file | chunks.147.mjs:518 |
| | `edited_image_file` | Modified image file | chunks.147.mjs:526 |
| | `pdf_reference` | PDF file reference | chunks.147.mjs:841 |
| | `already_read_file` | Previously read file | chunks.147.mjs:875 |
| | `compact_file_reference` | Compacted file ref | chunks.147.mjs:900 |
| **Skills** | `dynamic_skill` | Dynamic skill loaded | chunks.147.mjs:682 |
| | `skill_listing` | Available skills list | chunks.147.mjs:716 |
| | `invoked_skills` | Invoked skills list | chunks.174.mjs:117 |
| **Tasks** | `todo_reminder` | Todo list reminder | chunks.147.mjs:984 |
| | `task_reminder` | Task list reminder | chunks.147.mjs:1025 |
| | `task_status` | Task status update | chunks.147.mjs:1041 |
| **Hooks** | `async_hook_response` | Async hook response | chunks.147.mjs:1066 |
| | `hook_blocking_error` | Hook blocking error | chunks.174.mjs:373 |
| | `hook_success` | Hook success message | chunks.174.mjs:378 |
| | `hook_additional_context` | Hook context | chunks.174.mjs:385 |
| | `hook_stopped_continuation` | Hook stopped | chunks.174.mjs:393 |
| **Team** | `team_context` | Team context info | chunks.147.mjs:1099 |
| | `teammate_mailbox` | Team messages | chunks.174.mjs:5 |
| **Queue** | `queued_command` | Queued command | chunks.147.mjs:59 |
| **Diagnostics** | `diagnostics` | LSP diagnostics | chunks.174.mjs:236 |
| **Plan File** | `plan_file_reference` | Plan file content | chunks.147.mjs:1890 |

### 2.2 Attachment Type Categories

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ATTACHMENT TYPE CATEGORIES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MODE CONTROL (5 types)                                                      │
│  ├── plan_mode                                                               │
│  ├── plan_mode_reentry                                                       │
│  ├── plan_mode_exit                                                          │
│  ├── auto_mode                                                               │
│  └── auto_mode_exit                                                          │
│                                                                              │
│  STATUS/BUDGET (4 types)                                                     │
│  ├── token_usage                                                             │
│  ├── budget_usd                                                              │
│  ├── output_token_usage                                                      │
│  └── compaction_reminder                                                     │
│                                                                              │
│  FILES (7 types)                                                             │
│  ├── file                                                                    │
│  ├── directory                                                               │
│  ├── edited_text_file                                                        │
│  ├── edited_image_file                                                       │
│  ├── pdf_reference                                                           │
│  ├── already_read_file                                                       │
│  └── compact_file_reference                                                  │
│                                                                              │
│  TEAM MODE (2 types)                                                         │
│  ├── team_context                                                            │
│  └── teammate_mailbox                                                        │
│                                                                              │
│  HOOKS (5 types)                                                             │
│  ├── async_hook_response                                                     │
│  ├── hook_blocking_error                                                     │
│  ├── hook_success                                                            │
│  ├── hook_additional_context                                                 │
│  └── hook_stopped_continuation                                               │
│                                                                              │
│  TASKS/TODOS (3 types)                                                       │
│  ├── todo_reminder                                                           │
│  ├── task_reminder                                                           │
│  └── task_status                                                             │
│                                                                              │
│  MEMORY/SKILLS (5 types)                                                     │
│  ├── nested_memory                                                           │
│  ├── relevant_memories                                                       │
│  ├── ultramemory                                                             │
│  ├── dynamic_skill                                                           │
│  └── skill_listing                                                           │
│                                                                              │
│  OTHERS (10+ types)                                                          │
│  ├── date_change, ultrathink_effort, critical_system_reminder                │
│  ├── selected_lines_in_ide, opened_file_in_ide                               │
│  ├── mcp_resource, mcp_instructions_delta, deferred_tools_delta              │
│  ├── diagnostics, queued_command, agent_mention                              │
│  └── output_style, plan_file_reference                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Attachment Normalization

### 3.1 normalizeAttachmentForAPI (Ui8)

**What it does:** Converts internal attachment objects to API-ready user messages with XML tags.

**Location:** `chunks.174.mjs:3-469`

```javascript
// ============================================
// normalizeAttachmentForAPI - Converts attachment to message
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
...
</system-reminder>`,
            isMeta: !0
        })]
    }
    switch (A.type) {
        case "directory":
            return b5([nr6(J4.name, {...}), ir6(J4, {...})]);
        case "edited_text_file":
            return b5([p1({
                content: `Note: ${A.filename} was modified...`,
                isMeta: !0
            })]);
        case "token_usage":
            return [p1({
                content: af(`Token usage: ${A.used}/${A.total}; ${A.remaining} remaining`),
                isMeta: !0
            })];
        case "budget_usd":
            return [p1({
                content: af(`USD budget: $${A.used}/$${A.total}; $${A.remaining} remaining`),
                isMeta: !0
            })];
        case "compaction_reminder":
            return b5([p1({
                content: "Auto-compact is enabled...",
                isMeta: !0
            })]);
        // ... many more cases ...
    }
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Team mode special handling
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

**Your Identity:**
- Name: ${attachment.agentName}

**Team Resources:**
- Team config: ${attachment.teamConfigPath}
- Task list: ${attachment.taskListPath}

**Team Leader:** The team lead's name is "team-lead".
Read the team config to discover your teammates' names.
</system-reminder>`,
                isMeta: true
            })];
        }
    }

    switch (attachment.type) {
        // File attachments
        case "directory":
            return createToolPair(
                "Bash", { command: `ls ${attachment.path}` },
                { stdout: attachment.content, stderr: "", interrupted: false }
            );

        case "edited_text_file":
            return [createUserMessage({
                content: `Note: ${attachment.filename} was modified...
${attachment.snippet}`,
                isMeta: true
            })];

        // Status attachments
        case "token_usage":
            return [createUserMessage({
                content: formatMeta(`Token usage: ${attachment.used}/${attachment.total}; ${attachment.remaining} remaining`),
                isMeta: true
            })];

        case "budget_usd":
            return [createUserMessage({
                content: formatMeta(`USD budget: $${attachment.used}/$${attachment.total}; $${attachment.remaining} remaining`),
                isMeta: true
            })];

        case "compaction_reminder":
            return [createUserMessage({
                content: "Auto-compact is enabled. When the context window is nearly full, older messages will be automatically summarized...",
                isMeta: true
            })];

        // Plan mode attachments
        case "plan_mode":
            return planModeReminderDispatcher(attachment);

        case "plan_mode_reentry":
            return [createUserMessage({
                content: `## Re-entering Plan Mode
You are returning to plan mode after having previously exited it.
A plan file exists at ${attachment.planFilePath}...`,
                isMeta: true
            })];

        case "plan_mode_exit":
            return [createUserMessage({
                content: `## Exited Plan Mode
You have exited plan mode. You can now make edits, run tools...`,
                isMeta: true
            })];

        // ... handle all other types ...

        default:
            return [];
    }
}

// Mapping: Ui8→normalizeAttachmentForAPI, A→attachment, E7→isTeamMode,
//          p1→createUserMessage, b5→flattenArray, nr6→createToolUseBlock,
//          ir6→createToolResultBlock, af→formatMeta, Kzz→getTeamFormatter
```

---

## 4. Team Mode Integration

### 4.1 Team Mode Detection

**Source location:** `chunks.141.mjs` (isAgentTeamsEnabled)

```javascript
// ============================================
// isAgentTeamsEnabled - Check if team mode is active
// Location: chunks.141.mjs
// ============================================

// ORIGINAL (for source lookup):
function l8() {
    return x8("tengu_agent_teams", !1)
}

// READABLE (for understanding):
function isAgentTeamsEnabled() {
    return getFeatureFlag("tengu_agent_teams", false);
}

// Mapping: l8→isAgentTeamsEnabled, x8→getFeatureFlag
```

### 4.2 Teammate Mode from CLI

**Source location:** `chunks.197.mjs:1084-1087`

```javascript
// ============================================
// teammateModeSetup - Teammate mode setup from CLI options
// Location: chunks.197.mjs:1084-1087
// ============================================

// ORIGINAL (for source lookup):
if (TA.agentId && TA.agentName && TA.teamName) mRq().setDynamicTeamContext?.({
    agentId: TA.agentId,
    agentName: TA.agentName,
    teamName: TA.teamName,
    color: TA.agentColor,
    planModeRequired: TA.planModeRequired ?? !1,
    parentSessionId: TA.parentSessionId
});
if (TA.teammateMode) SGz().setCliTeammateModeOverride?.(TA.teammateMode)

// READABLE (for understanding):
// When spawning as teammate, set team context
if (options.agentId && options.agentName && options.teamName) {
    getTeamContextManager().setDynamicTeamContext?.({
        agentId: options.agentId,
        agentName: options.agentName,
        teamName: options.teamName,
        color: options.agentColor,
        planModeRequired: options.planModeRequired ?? false,
        parentSessionId: options.parentSessionId
    });
}

// Set teammate mode override if specified
if (options.teammateMode) {
    getTeammateModeStore().setCliTeammateModeOverride?.(options.teammateMode);
}

// Mapping: TA→options, mRq→getTeamContextManager, SGz→getTeammateModeStore
```

### 4.3 Team Mode Attachment Types

| Type | Trigger | Content |
|------|---------|---------|
| `teammate_mailbox` | New messages in mailbox | Messages from other team agents |
| `team_context` | Team membership detected | Team identity, resources, capabilities |

**Teammate Mailbox Flow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TEAMMATE MAILBOX ATTACHMENT FLOW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Entry with Team Flags                                                  │
│  │                                                                          │
│  ├─► --agent-id <id>                                                       │
│  ├─► --team-name <name>                                                    │
│  └─► --teammate-mode <mode>                                                │
│       │                                                                     │
│       ▼                                                                     │
│  setDynamicTeamContext()                                                    │
│       │                                                                     │
│       ▼                                                                     │
│  Session State Updated                                                      │
│       │                                                                     │
│       ▼                                                                     │
│  Attachment Producer checks:                                               │
│       │                                                                     │
│       ├─► isTeamMode? → YES                                                │
│       │       │                                                             │
│       │       ▼                                                             │
│       │   readMailbox() → Unread messages?                                 │
│       │       │                                                             │
│       │       ├─► YES → produce teammate_mailbox attachment                │
│       │       └─► NO → skip                                                │
│       │                                                                     │
│       └─► produce team_context attachment (once per session)               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Token Usage Attachments

### 5.1 Token Usage Tracking

**Source location:** `chunks.147.mjs:1113-1127`

```javascript
// ============================================
// produceTokenUsageAttachment - Token usage stats
// Location: chunks.147.mjs:1113-1127
// ============================================

// ORIGINAL (for source lookup):
// ... produces { type: "token_usage", ... }

// READABLE (for understanding):
function produceTokenUsageAttachment(state) {
    return {
        type: "token_usage",
        used: state.inputTokens + state.outputTokens,
        total: state.contextWindowLimit,
        remaining: state.contextWindowLimit - state.inputTokens - state.outputTokens
    };
}
```

### 5.2 Budget Attachments

**Source location:** `chunks.147.mjs:1129-1143`

```javascript
// ============================================
// produceBudgetAttachment - Budget USD stats
// Location: chunks.147.mjs:1129-1143
// ============================================

// ORIGINAL (for source lookup):
// ... produces { type: "budget_usd", ... }

// READABLE (for understanding):
function produceBudgetAttachment(state) {
    return {
        type: "budget_usd",
        used: state.cumulativeCostUsd,
        total: state.budgetLimitUsd,
        remaining: state.budgetLimitUsd - state.cumulativeCostUsd
    };
}
```

### 5.3 Compaction Reminder

**Source location:** `chunks.174.mjs:398-402`

```javascript
// ============================================
// compactionReminder - Auto-compact notification
// Location: chunks.174.mjs:398-402
// ============================================

// ORIGINAL (for source lookup):
case "compaction_reminder":
    return b5([p1({
        content: "Auto-compact is enabled. When the context window is nearly full, older messages will be automatically summarized so you can continue working seamlessly. There is no need to stop or rush — you have unlimited context through automatic compaction.",
        isMeta: !0
    })]);

// READABLE (for understanding):
case "compaction_reminder":
    return [createUserMessage({
        content: "Auto-compact is enabled. When the context window is nearly full, " +
                 "older messages will be automatically summarized so you can continue " +
                 "working seamlessly. There is no need to stop or rush — you have " +
                 "unlimited context through automatic compaction.",
        isMeta: true
    })];
```

---

## 6. CLI Flags Affecting Attachments

### 6.1 Flag-to-Attachment Mapping

| CLI Flag | Affected Attachments | Effect |
|----------|---------------------|--------|
| `--print` | All | Non-interactive mode, no UI prompts |
| `--dangerously-skip-permissions` | `command_permissions` | Skips permission prompts |
| `--plan` (implicit) | `plan_mode` | Activates plan mode instructions |
| `--agent <name>` | `delegate_mode` | Sets agent context for delegation |
| `--resume` | `plan_file_reference`, session memory | Loads previous session state |
| `--fork-session` | Session memory | Creates new session from fork point |
| `--agent-id`, `--team-name` | `team_context`, `teammate_mailbox` | Team mode attachments |

### 6.2 Session Resume Impact

When `--resume` is used:

```javascript
// ============================================
// handleSessionResume - Session resume attachment handling
// Location: chunks.197.mjs
// ============================================

// READABLE (for understanding):
async function handleSessionResume(sessionId, options) {
    // Load previous session state
    let previousState = await loadSessionState(sessionId);

    // Restore attachments that were produced:
    // 1. plan_file_reference - if session was in plan mode
    // 2. team_context - if session was in team mode
    // 3. Memory attachments from session memory files

    return {
        resumedSession: previousState,
        restoredAttachments: extractRelevantAttachments(previousState)
    };
}
```

---

## 7. Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Mode resolution | `chunks.197.mjs` | CLI flags → permission mode |
| Team context setup | `chunks.197.mjs:1084` | Team flags → team context |
| Plan mode producer | `chunks.147.mjs:136` | `producePlanModeAttachment` (DuY) |
| Auto mode producer | `chunks.147.mjs:214` | `produceAutoModeAttachment` (ZuY) |
| Token usage producer | `chunks.147.mjs:1113` | Token stats |
| Budget producer | `chunks.147.mjs:1129` | Budget stats |
| Normalization | `chunks.174.mjs:3` | `normalizeAttachmentForAPI` (Ui8) |

---

## 10. Deep Analysis: Attachment Production Pipeline

### 10.1 assembleAllAttachments (_uY) - Main Orchestrator

**Location:** chunks.147.mjs:3-18

```javascript
// ============================================
// assembleAllAttachments - Main attachment production orchestrator
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = {...q, abortController: w},
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), Hz("mcp_resources", () => SuY(A, $)),
                 Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents))),
                 ...[]] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => Promise.resolve(fuY())),
             Hz("ultrathink_effort", () => Promise.resolve(TuY(A))),
             Hz("deferred_tools_delta", () => Promise.resolve(xE1(q.options.tools, q.options.mainLoopModel, z))),
             Hz("mcp_instructions_delta", () => Promise.resolve(uE1(q.options.mcpClients, q.options.tools, q.options.mainLoopModel, z))),
             Hz("changed_files", () => CuY($)),
             Hz("nested_memory", () => IuY($)),
             Hz("dynamic_skill", () => BuY($)),
             Hz("skill_listing", () => guY($)),
             Hz("ultra_claude_md", async () => VuY(z)),
             Hz("plan_mode", () => DuY(z, q)),
             Hz("plan_mode_exit", () => XuY(q)),
             Hz("auto_mode", () => ZuY(z, q)),
             Hz("auto_mode_exit", () => GuY(q)),
             Hz("todo_reminders", () => r$() ? auY(z, q) : ruY(z, q)),
             ...E7() ? [..._ === "session_memory" ? [] : [Hz("teammate_mailbox", async () => euY(q))],
                        Hz("team_context", async () => AmY(z ?? []))] : [],
             Hz("agent_pending_messages", async () => $uY(q)),
             Hz("critical_system_reminder", () => Promise.resolve(vuY(q)))],
        D = H ? [Hz("ide_selection", async () => kuY(K, q)),
                 Hz("ide_opened_file", async () => LuY(K, q)),
                 Hz("output_style", async () => Promise.resolve(NuY())),
                 Hz("diagnostics", async () => cuY(q)),
                 Hz("lsp_diagnostics", async () => luY(q)),
                 Hz("unified_tasks", async () => suY(q)),
                 Hz("async_hook_responses", async () => tuY()),
                 Hz("token_usage", async () => Promise.resolve(qmY(z ?? [], q.options.mainLoopModel))),
                 Hz("budget_usd", async () => Promise.resolve(YmY(q.options.maxBudgetUsd))),
                 Hz("output_token_usage", async () => Promise.resolve(KmY())),
                 Hz("verify_plan_reminder", async () => _mY(z, q)),
                 Hz("queued_commands", () => OuY(Y))] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}

// READABLE (for understanding):
async function assembleAllAttachments(
    atMentionedFiles,     // @-mentioned files from user input
    toolUseContext,       // Session context with options, state accessors
    ideSelection,         // IDE selection state
    queuedCommands,       // Queued command inputs
    messageHistory,       // Recent message history for throttling
    querySource           // Source of query (e.g., "compact", "session_memory")
) {
    // Early exit if attachments disabled
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // Create abort controller with 1-second timeout
    let abortController = createAbortController();
    let timeoutId = setTimeout((ctrl) => ctrl.abort(), 1000, abortController);

    // Augment context with abort controller
    let context = {
        ...toolUseContext,
        abortController: abortController
    };

    // Determine if this is main thread (not subagent)
    let isMainThread = !toolUseContext.agentId;

    // Phase 1: Pre-compute attachments that depend on user input (parallel)
    let userInputAttachments = atMentionedFiles ? [
        timedAttachmentProducer("at_mentioned_files", () => produceAtMentionedFiles(atMentionedFiles, context)),
        timedAttachmentProducer("mcp_resources", () => produceMcpResources(atMentionedFiles, context)),
        timedAttachmentProducer("agent_mentions", () => produceAgentMentions(atMentionedFiles, context.options.agentDefinitions.activeAgents))
    ] : [];
    let preComputedResults = await Promise.all(userInputAttachments);

    // Phase 2: Compute core attachments (always run, parallel)
    let coreAttachments = [
        timedAttachmentProducer("date_change", () => produceDateChangeAttachment()),
        timedAttachmentProducer("ultrathink_effort", () => produceUltrathinkEffortAttachment(atMentionedFiles)),
        timedAttachmentProducer("deferred_tools_delta", () => produceDeferredToolsDelta(context.options.tools, context.options.mainLoopModel, messageHistory)),
        timedAttachmentProducer("mcp_instructions_delta", () => produceMcpInstructionsDelta(context.options.mcpClients, context.options.tools, context.options.mainLoopModel, messageHistory)),
        timedAttachmentProducer("changed_files", () => produceChangedFilesAttachment(context)),
        timedAttachmentProducer("nested_memory", () => produceNestedMemoryAttachment(context)),
        timedAttachmentProducer("dynamic_skill", () => produceDynamicSkillAttachment(context)),
        timedAttachmentProducer("skill_listing", () => produceSkillListingAttachment(context)),
        timedAttachmentProducer("ultra_claude_md", async () => produceUltraClaudeMdAttachment(messageHistory)),
        timedAttachmentProducer("plan_mode", () => producePlanModeAttachment(messageHistory, context)),
        timedAttachmentProducer("plan_mode_exit", () => producePlanModeExitAttachment(context)),
        timedAttachmentProducer("auto_mode", () => produceAutoModeAttachment(messageHistory, context)),
        timedAttachmentProducer("auto_mode_exit", () => produceAutoModeExitAttachment(context)),
        timedAttachmentProducer("todo_reminders", () => isPlanMode() ? producePlanTodoReminder(messageHistory, context) : produceTodoReminder(messageHistory, context)),

        // Team mode attachments (conditional)
        ...(isTeamMode() ? [
            ...(querySource === "session_memory" ? [] : [timedAttachmentProducer("teammate_mailbox", async () => produceTeammateMailboxAttachment(context))]),
            timedAttachmentProducer("team_context", async () => produceTeamContextAttachment(messageHistory ?? []))
        ] : []),

        timedAttachmentProducer("agent_pending_messages", async () => produceAgentPendingMessagesAttachment(context)),
        timedAttachmentProducer("critical_system_reminder", () => produceCriticalSystemReminder(context))
    ];

    // Phase 3: Compute main-thread-only attachments (parallel)
    let mainThreadAttachments = isMainThread ? [
        timedAttachmentProducer("ide_selection", async () => produceIdeSelectionAttachment(ideSelection, context)),
        timedAttachmentProducer("ide_opened_file", async () => produceIdeOpenedFileAttachment(ideSelection, context)),
        timedAttachmentProducer("output_style", async () => produceOutputStyleAttachment()),
        timedAttachmentProducer("diagnostics", async () => produceDiagnosticsAttachment(context)),
        timedAttachmentProducer("lsp_diagnostics", async () => produceLspDiagnosticsAttachment(context)),
        timedAttachmentProducer("unified_tasks", async () => produceUnifiedTasksAttachment(context)),
        timedAttachmentProducer("async_hook_responses", async () => produceAsyncHookResponsesAttachment()),
        timedAttachmentProducer("token_usage", async () => produceTokenUsageAttachment(messageHistory ?? [], context.options.mainLoopModel)),
        timedAttachmentProducer("budget_usd", async () => produceBudgetAttachment(context.options.maxBudgetUsd)),
        timedAttachmentProducer("output_token_usage", async () => produceOutputTokenUsageAttachment()),
        timedAttachmentProducer("verify_plan_reminder", async () => produceVerifyPlanReminderAttachment(messageHistory, context)),
        timedAttachmentProducer("queued_commands", () => produceQueuedCommandsAttachment(queuedCommands))
    ] : [];

    // Execute all producers in parallel
    let [coreResults, mainThreadResults] = await Promise.all([
        Promise.all(coreAttachments),
        Promise.all(mainThreadAttachments)
    ]);

    // Clear timeout and combine results
    clearTimeout(timeoutId);

    // Flatten and filter out null/undefined results
    return [...preComputedResults.flat(), ...coreResults.flat(), ...mainThreadResults.flat()]
        .filter((attachment) => attachment !== undefined && attachment !== null);
}

// Mapping: _uY→assembleAllAttachments, A→atMentionedFiles, q→toolUseContext,
//          K→ideSelection, Y→queuedCommands, z→messageHistory, _→querySource,
//          Hz→timedAttachmentProducer, t6→parseBoolean, sK→createAbortController,
//          E7→isTeamMode, r$→isPlanMode, d→logTelemetry, jV→reportError
```

**Key Design Insights:**

1. **Three-phase parallel execution:**
   - Phase 1: User-input-dependent attachments (@-mentions, MCP resources, agent mentions)
   - Phase 2: Core attachments (mode control, memory, skills, status)
   - Phase 3: Main-thread-only attachments (IDE, diagnostics, budget)

2. **Abort controller pattern:** A 1-second timeout ensures attachment production doesn't block queries indefinitely. Each producer should check `abortController.signal.aborted`.

3. **Conditional attachment sets:**
   - Team mode adds `teammate_mailbox` and `team_context`
   - Main thread adds IDE, diagnostics, budget attachments
   - Session memory mode skips teammate_mailbox (infinite loop prevention)

4. **Telemetry sampling:** 5% of producer calls are sampled for duration and size metrics.

---

### 10.2 timedAttachmentProducer (Hz) - Telemetry Wrapper

**Location:** chunks.147.mjs:20-46

```javascript
// ============================================
// timedAttachmentProducer - Wraps producer with telemetry
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

        // Sample 5% of calls for telemetry
        if (Math.random() < 0.05) {
            let totalSizeBytes = result
                .filter((attachment) => attachment !== undefined && attachment !== null)
                .reduce((sum, attachment) => sum + estimateAttachmentSize(attachment).length, 0);

            logTelemetry("tengu_attachment_compute_duration", {
                label: label,                        // e.g., "plan_mode", "token_usage"
                duration_ms: duration,
                attachment_size_bytes: totalSizeBytes,
                attachment_count: result.length
            });
        }

        return result;
    } catch (error) {
        let duration = Date.now() - startTime;

        // Log error with 5% sampling
        if (Math.random() < 0.05) {
            logTelemetry("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                error: true
            });
        }

        // Report error but don't fail the whole query
        reportError(error);
        logError(`Attachment error in ${label}`, error);

        // Return empty array so other attachments can proceed
        return [];
    }
}

// Mapping: Hz→timedAttachmentProducer, A→label, q→producer,
//          d→logTelemetry, B6→estimateAttachmentSize, _6→reportError, jV→logError
```

**Why this pattern:**
- **Telemetry sampling at 5%** reduces overhead while still capturing performance data
- **Error isolation**: One failing producer doesn't block other attachments
- **Duration tracking**: Identifies slow producers for optimization

---

### 10.3 Throttling Logic (JuY, MuY)

**Location:** chunks.147.mjs:105-134

```javascript
// ============================================
// analyzeRecentMessagesForThrottling - Check if recent attachment exists
// Location: chunks.147.mjs:105-122
// ============================================

// ORIGINAL (for source lookup):
function JuY(A) {
    let q = 0, K = !1;
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z?.type === "assistant") {
            if (Ei6(z)) continue;
            q++
        } else if (z?.type === "attachment" && (z.attachment.type === "plan_mode" || z.attachment.type === "plan_mode_reentry")) {
            K = !0;
            break
        }
    }
    return {turnCount: q, foundPlanModeAttachment: K}
}

// READABLE (for understanding):
function analyzeRecentMessagesForThrottling(messageHistory) {
    let turnCount = 0;
    let foundPlanModeAttachment = false;

    // Walk backwards through messages
    for (let i = messageHistory.length - 1; i >= 0; i--) {
        let message = messageHistory[i];

        if (message?.type === "assistant") {
            // Skip empty assistant messages (e.g., tool-use-only responses)
            if (isEmptyAssistantMessage(message)) continue;
            turnCount++;
        } else if (message?.type === "attachment" &&
                   (message.attachment.type === "plan_mode" ||
                    message.attachment.type === "plan_mode_reentry")) {
            // Found a recent plan mode attachment
            foundPlanModeAttachment = true;
            break;
        }
    }

    return {
        turnCount: turnCount,
        foundPlanModeAttachment: foundPlanModeAttachment
    };
}

// Mapping: JuY→analyzeRecentMessagesForThrottling, A→messageHistory,
//          q→turnCount, K→foundPlanModeAttachment, Ei6→isEmptyAssistantMessage

// ============================================
// countRecentPlanAttachments - Count plan_mode attachments since last exit
// Location: chunks.147.mjs:124-134
// ============================================

// ORIGINAL (for source lookup):
function MuY(A) {
    let q = 0;
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "attachment") {
            if (Y.attachment.type === "plan_mode_exit") break;
            if (Y.attachment.type === "plan_mode") q++
        }
    }
    return q
}

// READABLE (for understanding):
function countRecentPlanAttachments(messageHistory) {
    let count = 0;

    // Walk backwards through messages
    for (let i = messageHistory.length - 1; i >= 0; i--) {
        let message = messageHistory[i];

        if (message?.type === "attachment") {
            // Stop counting at plan_mode_exit
            if (message.attachment.type === "plan_mode_exit") break;
            if (message.attachment.type === "plan_mode") count++;
        }
    }

    return count;
}

// Mapping: MuY→countRecentPlanAttachments, A→messageHistory, q→count
```

**Throttling Constants (t4q):**

| Constant | Value | Purpose |
|----------|-------|---------|
| `TURNS_BETWEEN_ATTACHMENTS` | 3 | Minimum turns between plan_mode attachments |
| `FULL_REMINDER_EVERY_N_ATTACHMENTS` | 5 | How often to show full vs sparse reminder |

---

## 11. Integration with Agent Loop

### 11.1 Attachment Production in Query Flow

The attachment production happens during the query setup phase in `mainAgentLoopCore`:

```
mainAgentLoopCore (omY) starts
    │
    ▼
Build initial context
    │
    ▼
assembleAllAttachments (_uY) called with:
    - atMentionedFiles from user input
    - toolUseContext with state accessors
    - ideSelection from IDE integration
    - queuedCommands from command queue
    - messageHistory for throttling
    - querySource for conditional logic
    │
    ▼
All producers run in parallel (Promise.all)
    │
    ▼
Results flattened and filtered
    │
    ▼
Each attachment normalized via normalizeAttachmentForAPI (Ui8)
    │
    ▼
Attachments injected as user messages with isMeta: true
    │
    ▼
LLM API receives augmented message list
```

### 11.2 Attachment Injection Timing

```javascript
// In mainAgentLoopCore (simplified):
let attachments = await assembleAllAttachments(
    atMentionedFiles,
    toolUseContext,
    ideSelection,
    queuedCommands,
    messageHistory,
    querySource
);

// Normalize attachments to API messages
let attachmentMessages = attachments.flatMap(attachment =>
    normalizeAttachmentForAPI(attachment)
);

// Inject into message stream
for (let message of attachmentMessages) {
    yield message;  // Sent to LLM as user message
}
```

---

## 12. Related Documentation

- **System Reminder Module**: [04_system_reminder/](../04_system_reminder/)
- **Plan Mode Types**: [04_system_reminder/types_mode_control.md](../04_system_reminder/types_mode_control.md)
- **Team Mode Types**: [04_system_reminder/types_team_mode.md](../04_system_reminder/types_team_mode.md)
- **Status/Budget Types**: [04_system_reminder/types_status_budget.md](../04_system_reminder/types_status_budget.md)
- **Attachment Producers**: [04_system_reminder/attachment_producers.md](../04_system_reminder/attachment_producers.md)

---

## 9. Deep Algorithm Analysis

### 9.1 Attachment Production Pipeline

**The complete flow from CLI entry to API message:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                ATTACHMENT PRODUCTION PIPELINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Phase 1: CONTEXT GATHERING                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  CLI Flags ──► Session State ──► Permission Context ──► Team State  │    │
│  │                                                                     │    │
│  │  Example:                                                           │    │
│  │  --plan ──► mode: "plan" ──► planMode: true                        │    │
│  │  --team-name ──► teamName: "dev-team" ──► teamMode: true           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Phase 2: PRODUCER INVOCATION                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  For each registered producer:                                      │    │
│  │                                                                     │    │
│  │  1. Check conditions (mode, state, feature flags)                  │    │
│  │  2. If conditions met, produce attachment                          │    │
│  │  3. Check throttling (TURNS_BETWEEN_ATTACHMENTS)                   │    │
│  │  4. Add to attachment list                                          │    │
│  │                                                                     │    │
│  │  Producers run in priority order:                                  │    │
│  │  - Mode control (plan, auto) - HIGH                                │    │
│  │  - Critical reminders - HIGH                                        │    │
│  │  - Team context - MEDIUM                                            │    │
│  │  - Status/budget - LOW                                              │    │
│  │  - Memory/skills - LOW                                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Phase 3: NORMALIZATION                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  normalizeAttachmentForAPI(attachment):                            │    │
│  │                                                                     │    │
│  │  1. Switch on attachment.type                                      │    │
│  │  2. Generate appropriate message content                           │    │
│  │  3. Wrap in user message with isMeta: true                         │    │
│  │  4. Return array of messages                                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Phase 4: MESSAGE INJECTION                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Attachment messages are injected into the conversation:           │    │
│  │                                                                     │    │
│  │  [user messages]                                                    │    │
│  │  [attachment: plan_mode]      ◄── Mode instruction                 │    │
│  │  [attachment: token_usage]    ◄── Status update                    │    │
│  │  [attachment: team_context]   ◄── Team context (if team mode)      │    │
│  │  [assistant message]                                                │    │
│  │                                                                     │    │
│  │  Position: After user messages, before assistant response          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Plan Mode Attachment Throttling

**Why throttling is critical:**

Plan mode attachments can be large (full instructions). Without throttling:
- Token waste: Re-sending identical instructions every turn
- Context pollution: Repetitive content in the context window
- Slower responses: More tokens to process

**Throttling algorithm:**

```javascript
// ============================================
// Plan Mode Throttling Algorithm
// Location: chunks.147.mjs:136-168
// ============================================

// READABLE (for understanding):
function shouldProducePlanModeAttachment(messageHistory, lastAttachmentTurn) {
    // Count turns since last plan mode attachment
    let { turnCount, foundPlanModeAttachment } = analyzeRecentMessages(messageHistory);

    if (foundPlanModeAttachment && turnCount < TURNS_BETWEEN_ATTACHMENTS) {
        // Skip - too recent
        return false;
    }

    // Full vs sparse rotation
    let attachmentCount = countRecentPlanAttachments(messageHistory);
    let reminderType = (attachmentCount + 1) % FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
        ? "full"    // Send full instructions every Nth attachment
        : "sparse"; // Send abbreviated version otherwise

    return { shouldProduce: true, reminderType };
}
```

**Constants:**
- `TURNS_BETWEEN_ATTACHMENTS`: Minimum turns between attachments (typically 2-3)
- `FULL_REMINDER_EVERY_N_ATTACHMENTS`: How often to send full vs sparse (typically 3)

### 9.3 Team Mode Attachment Flow

**Team mode adds special handling:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TEAM MODE ATTACHMENT LOGIC                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Team Mode Detection:                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  isTeamMode() checks:                                               │    │
│  │  1. Feature flag: tengu_agent_teams enabled?                        │    │
│  │  2. Team context set? (agentId, teamName present)                   │    │
│  │  3. CLI teammate mode override?                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Team Context Attachment:                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Produced ONCE at session start, contains:                          │    │
│  │  - Team name and identity                                           │    │
│  │  - Agent's role (name, capabilities)                                │    │
│  │  - Team resources (config path, task list path)                     │    │
│  │  - Team leader identification                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Teammate Mailbox Attachment:                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Produced when:                                                     │    │
│  │  - New messages in agent's mailbox                                 │    │
│  │  - Messages not yet acknowledged                                   │    │
│  │                                                                     │    │
│  │  Content:                                                           │    │
│  │  - Formatted messages from other team members                       │    │
│  │  - Timestamps and sender information                                │    │
│  │  - Task assignment requests, status updates, etc.                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.4 Mode-Based Producer Selection Algorithm

**How the system determines which attachment producers to invoke:**

The attachment production system uses a priority-ordered producer registry. Each producer is a function that:
1. Checks if it should run (based on mode, state, conditions)
2. Returns an array of attachments (empty array if no attachments needed)

```javascript
// ============================================
// Attachment Producer Registry Pattern
// Location: Conceptual (actual implementation in chunks.147.mjs, chunks.174.mjs)
// ============================================

// READABLE (for understanding):
const ATTACHMENT_PRODUCERS = [
    // Priority 1: Mode Control Producers (highest priority)
    {
        name: "planMode",
        priority: 100,
        condition: (state) => state.toolPermissionContext.mode === "plan",
        produce: producePlanModeAttachment
    },
    {
        name: "autoMode",
        priority: 100,
        condition: (state) => state.toolPermissionContext.mode === "auto",
        produce: produceAutoModeAttachment
    },

    // Priority 2: Critical Reminders
    {
        name: "compactionReminder",
        priority: 90,
        condition: (state) => state.isAutoCompactEnabled && state.tokenPercent > 60,
        produce: produceCompactionReminderAttachment
    },

    // Priority 3: Team Context (medium priority)
    {
        name: "teamContext",
        priority: 70,
        condition: (state) => state.teamMode?.isTeamMode,
        produce: produceTeamContextAttachment
    },
    {
        name: "teammateMailbox",
        priority: 70,
        condition: (state) => state.teamMode?.hasPendingMessages,
        produce: produceTeammateMailboxAttachment
    },

    // Priority 4: Status Updates (lower priority)
    {
        name: "tokenUsage",
        priority: 50,
        condition: (state) => state.shouldShowTokenUsage,
        produce: produceTokenUsageAttachment
    },
    {
        name: "budgetUsd",
        priority: 50,
        condition: (state) => state.budgetLimitUsd !== undefined,
        produce: produceBudgetAttachment
    },

    // Priority 5: Memory and Skills (lowest priority)
    {
        name: "sessionMemory",
        priority: 30,
        condition: (state) => state.sessionMemoryEnabled,
        produce: produceSessionMemoryAttachment
    }
];

async function produceAttachments(state, messageHistory) {
    let attachments = [];

    // Sort by priority (highest first)
    let sortedProducers = [...ATTACHMENT_PRODUCERS].sort((a, b) => b.priority - a.priority);

    for (let producer of sortedProducers) {
        // Check if producer should run
        if (producer.condition(state)) {
            // Produce attachments
            let produced = await producer.produce(messageHistory, state);
            attachments.push(...produced);
        }
    }

    return attachments;
}
```

**Producer selection decision tree:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 MODE-BASED PRODUCER SELECTION                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  produceAttachments(state, history)                                         │
│  │                                                                          │
│  ├─► Check: toolPermissionContext.mode                                      │
│  │   │                                                                      │
│  │   ├─► "plan" ──► producePlanModeAttachment()                            │
│  │   │              ├─► Check: prePlanMode === "ultraplan"?                │
│  │   │              │   └─► Return ultraplan-complete variant              │
│  │   │              ├─► Check: planExists && reentry?                      │
│  │   │              │   └─► Return plan_mode_reentry variant               │
│  │   │              └─► Default: Return plan_mode (full/sparse)            │
│  │   │                                                                      │
│  │   ├─► "auto" ──► produceAutoModeAttachment()                            │
│  │   │              └─► Return auto_mode instructions                       │
│  │   │                                                                      │
│  │   └─► "default"/"bypassPermissions" ──► No mode attachment             │
│  │                                                                          │
│  ├─► Check: teamMode.isTeamMode                                             │
│  │   │                                                                      │
│  │   └─► true ──► produceTeamContextAttachment()                           │
│  │              ├─► Include: team name, role, teammates                    │
│  │              └─► Check: hasPendingMessages?                              │
│  │                  └─► true ──► produceTeammateMailboxAttachment()        │
│  │                                                                          │
│  ├─► Check: isAutoCompactEnabled && tokenPercent > threshold               │
│  │   └─► true ──► produceCompactionReminderAttachment()                    │
│  │                                                                          │
│  ├─► Check: budgetLimitUsd !== undefined                                   │
│  │   └─► true ──► produceBudgetAttachment()                                 │
│  │                                                                          │
│  └─► Check: sessionMemoryEnabled                                           │
│      └─► true ──► produceSessionMemoryAttachment()                          │
│                                                                              │
│  Return: [...all produced attachments]                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Why priority ordering matters:**

1. **Mode control first:** Plan/auto mode instructions must be at the top of the attachment list so the model sees them immediately after user messages
2. **Critical reminders second:** Compaction warnings need prominence to inform the model's behavior
3. **Team context third:** Team context informs collaboration but isn't as critical as mode control
4. **Status updates fourth:** Token/budget info is informational, not directive
5. **Memory last:** Session memory provides context but is supplementary

**Key insight:** The producer pattern enables easy extension. Adding a new attachment type requires only:
1. Creating a producer function
2. Adding a condition function
3. Registering in the priority list

No changes to the core production loop are needed.

---

## 10. Cross-Feature Connections

### 10.1 Connection to 02_agent_loop

Attachment producers are called during the agent loop:

| Agent Loop Phase | Attachment Effect |
|-------------------|-------------------|
| Pre-query | Collect all pending attachments |
| Message building | Inject attachments as user messages |
| Post-response | Update token usage for next cycle |

### 10.2 Connection to 03_state_management

State changes trigger attachment updates:

| State Change | Attachment Update |
|--------------|-------------------|
| Permission mode change | Mode control attachment |
| Team join/leave | Team context attachment |
| Token threshold crossing | Token usage attachment |
| Budget threshold crossing | Budget USD attachment |

### 10.3 Connection to 07_compact

Compaction affects attachment behavior:

| Compaction Event | Attachment Impact |
|------------------|-------------------|
| Pre-compaction | `compaction_reminder` attachment produced |
| Post-compaction | Attachments may be re-sent (context was summarized) |
| Session memory compact | Memory attachments updated |

### 10.4 Connection to 08_subagent

Subagent execution affects attachment selection:

| Subagent Context | Attachment Variant |
|------------------|-------------------|
| Subagent in plan mode | `isSubAgent: true` flag in plan_mode |
| Delegate mode | Limited attachments (no team/mailbox) |
| Background agent | Minimal attachments only |

### 10.5 Connection to 11_hooks

Hooks can produce attachments:

| Hook Type | Possible Attachments |
|-----------|---------------------|
| `PreToolUse` | `hook_blocking_error` if denied |
| `PostToolUse` | `hook_additional_context` with extra info |
| `Notification` | `async_hook_response` for background results |
| `SessionStart` | Initial setup attachments |

---

## 11. Cross-Reference to 04_system_reminder Module

This document provides a CLI-focused view of system reminder integration. For comprehensive documentation of the System Reminder module itself, refer to the following resources:

### 11.1 Core Documentation in 04_system_reminder

| Document | Topic | CLI Integration Relevance |
|----------|-------|---------------------------|
| [README.md](../04_system_reminder/README.md) | Module overview, architecture | Three-layer pipeline, design principles |
| [attachment_producers.md](../04_system_reminder/attachment_producers.md) | All 40+ producer functions | Deep analysis of producers used by CLI |
| [implementation_details.md](../04_system_reminder/implementation_details.md) | Core function implementation | `normalizeAttachmentForAPI` internals |
| [integration_points.md](../04_system_reminder/integration_points.md) | Cross-module integration | Agent loop, plan mode, hooks connections |
| [normalization_flow_diagram.md](../04_system_reminder/normalization_flow_diagram.md) | Visual flow documentation | Decision trees for attachment handling |

### 11.2 Type-Specific Documentation in 04_system_reminder

| Document | Types Covered | CLI Flag Triggers |
|----------|---------------|-------------------|
| [types_mode_control.md](../04_system_reminder/types_mode_control.md) | `plan_mode`, `auto_mode`, variants | `--plan`, `/plan`, `/auto` |
| [types_team_mode.md](../04_system_reminder/types_team_mode.md) | `teammate_mailbox`, `team_context` | `--swarm`, team join |
| [types_status_budget.md](../04_system_reminder/types_status_budget.md) | `token_usage`, `budget_usd` | Token tracking, `--budget` |
| [types_file_context.md](../04_system_reminder/types_file_context.md) | `directory`, `file`, `edited_text_file` | @-mentions, file paths |
| [types_hooks.md](../04_system_reminder/types_hooks.md) | `async_hook_response`, hook types | Hook execution results |
| [types_skills_memory.md](../04_system_reminder/types_skills_memory.md) | `invoked_skills`, `nested_memory` | Skill/memory loading |
| [types_task_management.md](../04_system_reminder/types_task_management.md) | `todo`, `task_reminder` | Todo list state |

### 11.3 Key Integration Points Between CLI and System Reminder

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                CLI ↔ SYSTEM REMINDER MODULE CONNECTIONS                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI MODULE (01_cli)                   SYSTEM REMINDER MODULE (04)           │
│  ═══════════════════                   ═══════════════════════════           │
│                                                                              │
│  ┌─────────────────────┐               ┌─────────────────────┐              │
│  │ cli_modes.md        │───mode──────►│ attachment_producers │              │
│  │ (mode resolution)   │               │ • producePlanMode    │              │
│  │                     │               │ • produceAutoMode    │              │
│  └─────────────────────┘               └─────────────────────┘              │
│                                                                              │
│  ┌─────────────────────┐               ┌─────────────────────┐              │
│  │ tools_integration.md │──context───►│ types_mode_control   │              │
│  │ (permission context)│               │ • Plan mode variants │              │
│  │                     │               │ • Auto mode          │              │
│  └─────────────────────┘               └─────────────────────┘              │
│                                                                              │
│  ┌─────────────────────┐               ┌─────────────────────┐              │
│  │ session_management  │──state──────►│ integration_points   │              │
│  │ (session state)     │               │ • State triggers     │              │
│  │                     │               │ • Registry polling   │              │
│  └─────────────────────┘               └─────────────────────┘              │
│                                                                              │
│  ┌─────────────────────┐               ┌─────────────────────┐              │
│  │ ui_linkage.md       │──render─────►│ ui_linkage.md (04)   │              │
│  │ (React/Ink UI)      │               │ • isMeta flag        │              │
│  │                     │               │ • Message filtering  │              │
│  └─────────────────────┘               └─────────────────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.4 Shared Symbol Reference

The following symbols are shared between CLI and System Reminder modules:

| Symbol | Readable | Primary Module | Secondary Module |
|--------|----------|----------------|------------------|
| Ui8 | normalizeAttachmentForAPI | 04_system_reminder | 01_cli |
| DuY | producePlanModeAttachment | 04_system_reminder | 01_cli |
| ZuY | produceAutoModeAttachment | 04_system_reminder | 01_cli |
| _uY | assembleAllAttachments | 04_system_reminder | 01_cli |
| b5 | wrapWithSystemReminderTags | 04_system_reminder | - |
| p1 | createUserMessage | 04_system_reminder | 01_cli |

For complete symbol mappings, see:
- [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - System Reminder section
- [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - State Management section

---

## 12. Symbol Reference Summary

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - System Reminder, CLI Module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent Loop, State Management

Key symbols verified in this document:
- `Ui8` (normalizeAttachmentForAPI) - chunks.174.mjs:3
- `DuY` (producePlanModeAttachment) - chunks.147.mjs:136
- `ZuY` (produceAutoModeAttachment) - chunks.147.mjs:214
- `l8` (isAgentTeamsEnabled) - chunks.141.mjs (feature flag check)
- `E7` (isTeamMode) - Team mode detection
- `p1` (createUserMessage) - Message factory
- `af` (formatMeta) - Meta content formatter
- `t4q.TURNS_BETWEEN_ATTACHMENTS` - Throttling constant
- `t4q.FULL_REMINDER_EVERY_N_ATTACHMENTS` - Rotation constant