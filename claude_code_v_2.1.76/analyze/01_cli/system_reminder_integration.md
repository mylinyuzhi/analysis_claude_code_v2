# CLI-System Reminder Integration

> How CLI flags and session state affect system reminder attachment production

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - System Reminder, CLI Module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent Loop, State Management

Key functions in this document:
- `assembleAttachments` (phY) - Main orchestrator for attachment production
- `normalizeAttachmentForAPI` (K2z) - Converts attachments to API messages
- `buildContextMessages` (bG1) - Injects reminders into message stream

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
│                    │  assembleAttachments (phY)   │                       │
│                    │  chunks.142.mjs:1948-1965     │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│           ┌────────────────────────┼────────────────────────┐              │
│           │                        │                        │              │
│           ▼                        ▼                        ▼              │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│  │ Plan Mode       │   │ Team Mode       │   │ Token Usage     │          │
│  │ Attachments     │   │ Attachments     │   │ Attachments     │          │
│  │                 │   │                 │   │                 │          │
│  │ plan_mode       │   │ teammate_       │   │ token_usage     │          │
│  │ plan_mode_      │   │ mailbox         │   │ budget_usd      │          │
│  │ reentry         │   │ team_context    │   │ compaction_     │          │
│  │ delegate_mode   │   │                 │   │ reminder        │          │
│  └─────────────────┘   └─────────────────┘   └─────────────────┘          │
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
| `delegate` | Subagent spawning | `delegate_mode`, `delegate_mode_exit` |
| `bypassPermissions` | `--dangerously-skip-permissions` | All tools allowed, no permission prompts |

**Source location:** `chunks.189.mjs` (mode resolution)

```javascript
// ============================================
// Permission mode resolution from CLI flags
// Location: chunks.189.mjs
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

### 1.2 Plan Mode Variant Selection

**Source location:** `chunks.173.mjs:525-529`

```javascript
// ============================================
// planModeReminderDispatcher - Routes to plan mode variant
// Location: chunks.173.mjs:525-529
// ============================================

// ORIGINAL (for source lookup):
function azz(A, q) {
    let K = q.mode;
    return K === "subagent" ? _zz(A, q) : K === "sparse" ? Gzz(A, q) : Vzz(A, q)
}

// READABLE (for understanding):
function planModeReminderDispatcher(attachment, context) {
    let mode = context.mode;

    // Subagent mode: Minimal instructions for spawned agents
    if (mode === "subagent") {
        return produceSubagentPlanModeReminder(attachment, context);
    }

    // Sparse mode: Condensed reminder after initial turn
    if (mode === "sparse") {
        return produceSparsePlanModeReminder(attachment, context);
    }

    // Full mode: Complete plan mode instructions
    return produceFullPlanModeReminder(attachment, context);
}

// Mapping: azz→planModeReminderDispatcher, A→attachment, q→context,
//          _zz→produceSubagentPlanModeReminder, Gzz→produceSparsePlanModeReminder,
//          Vzz→produceFullPlanModeReminder
```

**Why three variants exist:**

1. **Full mode** - First plan mode entry, complete instructions
2. **Sparse mode** - Subsequent turns, reduced token overhead
3. **Subagent mode** - Delegated tasks, minimal context needed

---

## 2. Team Mode Integration

### 2.1 Team Mode Detection

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

### 2.2 Teammate Mode from CLI

**Source location:** `chunks.189.mjs:1084-1087`

```javascript
// ============================================
// Teammate mode setup from CLI options
// Location: chunks.189.mjs:1084-1087
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

### 2.3 Team Mode Attachment Types

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
│  assembleAttachments() checks:                                             │
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

## 3. Token Usage Attachments

### 3.1 Token Usage Tracking

The CLI doesn't directly produce token usage attachments, but the session state managed by CLI initialization affects them.

**Attachment Producer:** `token_usage`

```javascript
// ============================================
// Token usage attachment structure
// Location: chunks.142.mjs
// ============================================

// READABLE (for understanding):
function produceTokenUsageAttachment(state) {
    return {
        type: "token_usage",
        inputTokens: state.inputTokens,
        outputTokens: state.outputTokens,
        cacheReadTokens: state.cacheReadInputTokens ?? 0,
        cacheWriteTokens: state.cacheWriteInputTokens ?? 0,
        totalTokens: state.totalTokens,
        threshold: state.autoCompactThreshold
    };
}
```

### 3.2 Budget Attachments

**Attachment Type:** `budget_usd`

```javascript
// ============================================
// Budget USD attachment structure
// ============================================

// READABLE (for understanding):
function produceBudgetAttachment(state) {
    return {
        type: "budget_usd",
        currentCost: state.cumulativeCostUsd,
        budgetLimit: state.budgetLimitUsd,
        percentageUsed: (state.cumulativeCostUsd / state.budgetLimitUsd) * 100
    };
}
```

---

## 4. Attachment Production Pipeline

### 4.1 assembleAttachments (phY)

**What it does:** Main orchestrator that collects all attachment producers and executes them in parallel.

**Location:** `chunks.142.mjs:1948-1965`

```javascript
// ============================================
// assembleAttachments - Main attachment orchestrator
// Location: chunks.142.mjs:1948-1965
// ============================================

// ORIGINAL (for source lookup):
async function phY(A, q, K) {
    let Y = Date.now(),
        z = await Promise.all([
            // ... producer calls ...
        ]),
        w = z.flat().filter(Boolean),
        H = w.filter((O) => O.type !== "silent");
    return {
        attachments: H,
        silentAttachments: w.filter((O) => O.type === "silent"),
        timings: {}
    }
}

// READABLE (for understanding):
async function assembleAttachments(sessionState, toolPermissionContext, querySource) {
    let startTime = Date.now();

    // Execute all attachment producers in parallel
    let results = await Promise.all([
        // File context producers
        produceDirectoryAttachment(sessionState),
        produceFileAttachment(sessionState),

        // Mode control producers
        producePlanModeAttachment(sessionState, toolPermissionContext),
        produceDelegateModeAttachment(sessionState, toolPermissionContext),

        // Team mode producers
        produceTeammateMailboxAttachment(sessionState),
        produceTeamContextAttachment(sessionState),

        // Status producers
        produceTokenUsageAttachment(sessionState),
        produceBudgetAttachment(sessionState),

        // ... many more producers ...
    ]);

    // Flatten and filter results
    let allAttachments = results.flat().filter(Boolean);

    // Separate silent from visible attachments
    let visibleAttachments = allAttachments.filter(a => a.type !== "silent");
    let silentAttachments = allAttachments.filter(a => a.type === "silent");

    return {
        attachments: visibleAttachments,
        silentAttachments: silentAttachments,
        timings: {}
    };
}

// Mapping: phY→assembleAttachments, A→sessionState, q→toolPermissionContext,
//          K→querySource, z→results, w→allAttachments, H→visibleAttachments
```

### 4.2 Producer Execution Strategy

**Key design decision: Parallel execution with timeout protection**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT PRODUCER EXECUTION STRATEGY                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  assembleAttachments()                                                       │
│  │                                                                          │
│  ├─► Create producer array (40+ producers)                                  │
│  │                                                                          │
│  ├─► Wrap each with timedAttachmentProducer (gw)                            │
│  │   │                                                                      │
│  │   └─► 1-second timeout per producer                                      │
│  │       - Success → return attachment                                      │
│  │       - Timeout → return null                                            │
│  │       - Error → log and return null                                      │
│  │                                                                          │
│  ├─► Execute all in parallel with Promise.all                               │
│  │                                                                          │
│  ├─► Filter out null/undefined results                                      │
│  │                                                                          │
│  ├─► Separate silent vs visible attachments                                 │
│  │                                                                          │
│  └─► Return { attachments, silentAttachments, timings }                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. CLI Flags Affecting Attachments

### 5.1 Flag-to-Attachment Mapping

| CLI Flag | Affected Attachments | Effect |
|----------|---------------------|--------|
| `--print` | All | Non-interactive mode, no UI prompts |
| `--dangerously-skip-permissions` | `command_permissions` | Skips permission prompts |
| `--plan` (implicit) | `plan_mode` | Activates plan mode instructions |
| `--agent <name>` | `delegate_mode` | Sets agent context for delegation |
| `--resume` | `plan_file_reference`, session memory | Loads previous session state |
| `--fork-session` | Session memory | Creates new session from fork point |

### 5.2 Session Resume Impact

When `--resume` is used:

```javascript
// ============================================
// Session resume attachment handling
// Location: chunks.189.mjs
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

## 6. Attachment Normalization

### 6.1 normalizeAttachmentForAPI (K2z)

**What it does:** Converts internal attachment objects to API-ready user messages with XML tags.

**Location:** `chunks.173.mjs:698-1131`

```javascript
// ============================================
// normalizeAttachmentForAPI - Converts attachment to message
// Location: chunks.173.mjs:698-1131
// ============================================

// ORIGINAL (for source lookup):
function K2z(A, q) {
    let K = A.type;
    switch (K) {
        case "plan_mode":
        case "plan_mode_reentry":
        case "plan_mode_exit":
        case "plan_file_reference":
            return azz(A, q);
        case "delegate_mode":
        case "delegate_mode_exit":
            return /* ... */;
        case "teammate_mailbox":
            return /* ... */;
        // ... many more cases ...
        default:
            return null;
    }
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment, context) {
    let type = attachment.type;

    switch (type) {
        // Mode control attachments
        case "plan_mode":
        case "plan_mode_reentry":
        case "plan_mode_exit":
        case "plan_file_reference":
            return planModeReminderDispatcher(attachment, context);

        case "delegate_mode":
        case "delegate_mode_exit":
            return delegateModeReminderDispatcher(attachment, context);

        // Team mode attachments
        case "teammate_mailbox":
            return produceTeammateMailboxReminder(attachment);

        case "team_context":
            return produceTeamContextReminder(attachment);

        // Status attachments
        case "token_usage":
            return produceTokenUsageReminder(attachment);

        case "budget_usd":
            return produceBudgetReminder(attachment);

        // ... handle all 57+ types ...

        default:
            // Silent fallback for unknown types
            return null;
    }
}

// Mapping: K2z→normalizeAttachmentForAPI, A→attachment, q→context,
//          azz→planModeReminderDispatcher
```

### 6.2 XML Tag Wrapping

All normalized attachments are wrapped in XML tags for the API:

```javascript
// ============================================
// wrapWithSystemReminderTags - XML wrapper
// Location: chunks.173.mjs:496-523
// ============================================

// ORIGINAL (for source lookup):
function _9(A, q, K) {
    let Y = K?.messageUuid || generateUUID();
    return `<${nO}>
<${Z_}>${A}</${Z_}>
<${gD}>${q}</${gD}>
<${DO}>${Y}</${DO}>
</${nO}>`
}

// READABLE (for understanding):
function wrapWithSystemReminderTags(content, reminderType, metadata) {
    let messageUuid = metadata?.messageUuid || generateUUID();

    return `<system-reminder>
<type>${reminderType}</type>
<content>${content}</content>
<message-uuid>${messageUuid}</message-uuid>
</system-reminder>`;
}

// Mapping: _9→wrapWithSystemReminderTags, A→content, q→reminderType,
//          K→metadata, nO→"system-reminder", Z_→"type", gD→"content", DO→"message-uuid"
```

---

## 7. Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Mode resolution | `chunks.189.mjs` | CLI flags → permission mode |
| Team context setup | `chunks.189.mjs:1084` | Team flags → team context |
| Attachment orchestration | `chunks.142.mjs:1948` | `assembleAttachments` |
| Plan mode routing | `chunks.173.mjs:525` | `planModeReminderDispatcher` |
| Normalization | `chunks.173.mjs:698` | `normalizeAttachmentForAPI` |
| Message injection | `chunks.148.mjs:2414` | `buildContextMessages` |

---

## 8. Related Documentation

- **System Reminder Module**: [04_system_reminder/](../04_system_reminder/)
- **Plan Mode Types**: [04_system_reminder/types_mode_control.md](../04_system_reminder/types_mode_control.md)
- **Team Mode Types**: [04_system_reminder/types_team_mode.md](../04_system_reminder/types_team_mode.md)
- **Status/Budget Types**: [04_system_reminder/types_status_budget.md](../04_system_reminder/types_status_budget.md)
- **Attachment Producers**: [04_system_reminder/attachment_producers.md](../04_system_reminder/attachment_producers.md)