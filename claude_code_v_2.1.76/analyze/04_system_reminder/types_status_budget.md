# System Reminder Types: Status & Budget Notifications

> **Module**: System Reminders - Status/Budget Types
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.173.mjs:889-926`, `chunks.173.mjs:1071-1117`, `chunks.142.mjs:2815-2850`

---

## Table of Contents

- [Overview](#overview)
- [token_usage](#token_usage)
- [budget_usd](#budget_usd)
- [compaction_reminder](#compaction_reminder)
- [critical_system_reminder](#critical_system_reminder)
- [queued_command](#queued_command)
- [output_style](#output_style)
- [verify_plan_reminder](#verify_plan_reminder)
- [Configuration](#configuration)

---

## Overview

Status and budget types inform the LLM about resource usage and system state:

1. **token_usage** - Token consumption tracking
2. **budget_usd** - USD budget tracking
3. **compaction_reminder** - Auto-compact notification
4. **critical_system_reminder** - Critical system alerts
5. **queued_command** - Queued user messages
6. **output_style** - Output style reminders
7. **verify_plan_reminder** - Plan verification reminders

These types use the `tI` (wrapInXmlTag) function for inline XML wrapping.

---

## Trigger Source Summary

Each status/budget type has a specific producer function with distinct trigger conditions:

| Type | Producer Function | Location | Key Trigger Logic |
|------|-------------------|----------|-------------------|
| `token_usage` | `RIY` (getTokenUsageAttachment) | chunks.142.mjs:2815-2825 | `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT` env var |
| `budget_usd` | `yIY` (getBudgetUsdAttachment) | chunks.142.mjs:2827-2837 | `maxBudgetUsd !== undefined` |
| `queued_command` | `dhY` (getQueuedCommandsAttachment) | chunks.142.mjs:1993-2001 | `commands.filter(c => c.mode === "prompt")` |
| `output_style` | `shY` (getOutputStyleAttachment) | chunks.142.mjs:2101-2108 | `outputStyle !== "default"` |
| `critical_system_reminder` | `ahY` (getCriticalSystemReminder) | chunks.142.mjs:2092-2099 | `criticalSystemReminder_EXPERIMENTAL` option set |

### Token Calculation

```javascript
// Location: chunks.142.mjs:2817-2818
let totalTokens = getModelContextLimit(mainLoopModel);  // m51()
let usedTokens = countMessagesTokens(messages);         // PZ()
```

### Budget Tracking

```javascript
// Location: chunks.142.mjs:2829-2830
let currentSpend = getCurrentUsdSpend();  // W0()
let remaining = maxBudgetUsd - currentSpend;
```

### Queued Command Filter

```javascript
// Location: chunks.142.mjs:1995-2000
return queuedCommands
    .filter(cmd => cmd.mode === "prompt")
    .map(cmd => ({
        type: "queued_command",
        prompt: cmd.value,
        source_uuid: cmd.uuid,
        imagePasteIds: cmd.imagePasteIds
    }));
```

---

## token_usage

### What It Does

Provides current token usage statistics to the LLM, helping it understand context window consumption.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Feature enabled | `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT` is set |
| Main agent only | No `agentId` in session context |

### Source Code

#### Producer Function

```javascript
// ============================================
// getTokenUsageAttachment - Produce token usage attachment
// Location: chunks.142.mjs:2815-2825
// ============================================

// ORIGINAL (for source lookup):
function RIY(A, q) {
    if (!J6(process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT)) return [];
    let K = m51(q),
        Y = PZ(A);
    return [{
        type: "token_usage",
        used: Y,
        total: K,
        remaining: K - Y
    }]
}

// READABLE (for understanding):
function getTokenUsageAttachment(messages, mainLoopModel) {
    // Feature flag check
    if (!parseBoolean(process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT)) {
        return [];
    }

    let totalTokens = getModelContextLimit(mainLoopModel);
    let usedTokens = countMessagesTokens(messages);

    return [{
        type: "token_usage",
        used: usedTokens,
        total: totalTokens,
        remaining: totalTokens - usedTokens
    }];
}

// Mapping: RIY→getTokenUsageAttachment, A→messages, q→mainLoopModel, K→totalTokens, Y→usedTokens, J6→parseBoolean, m51→getModelContextLimit, PZ→countMessagesTokens
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - token_usage case
// Location: chunks.173.mjs:1071-1075
// ============================================

// ORIGINAL (for source lookup):
case "token_usage":
    return [c6({
        content: tI(`Token usage: ${A.used}/${A.total}; ${A.remaining} remaining`),
        isMeta: !0
    })];

// READABLE (for understanding):
case "token_usage":
    return [createUserMessage({
        content: wrapInXmlTag(`Token usage: ${attachment.used}/${attachment.total}; ${attachment.remaining} remaining`),
        isMeta: true
    })];

// Mapping: A→attachment, tI→wrapInXmlTag, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
Token usage: 45000/200000; 155000 remaining
</system-reminder>
```

### Key Insight

Token usage is **disabled by default** and requires the environment variable to be set. This prevents unnecessary token consumption from the reminder itself.

---

## budget_usd

### What It Does

Provides USD budget tracking for API costs.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Budget configured | `maxBudgetUsd` is defined in options |
| Main agent only | No `agentId` in session context |

### Source Code

#### Producer Function

```javascript
// ============================================
// getBudgetUsdAttachment - Produce budget attachment
// Location: chunks.142.mjs:2827-2835
// ============================================

// ORIGINAL (for source lookup):
function yIY(A) {
    if (A === void 0) return [];
    let q = W0(),
        K = A - q;
    return [{
        type: "budget_usd",
        used: q,
        total: A,
        remaining: K
    }]
}

// READABLE (for understanding):
function getBudgetUsdAttachment(maxBudgetUsd) {
    if (maxBudgetUsd === undefined) return [];

    let usedAmount = getCurrentSpend();
    let remainingAmount = maxBudgetUsd - usedAmount;

    return [{
        type: "budget_usd",
        used: usedAmount,
        total: maxBudgetUsd,
        remaining: remainingAmount
    }];
}

// Mapping: yIY→getBudgetUsdAttachment, A→maxBudgetUsd, q→usedAmount, K→remainingAmount, W0→getCurrentSpend
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - budget_usd case
// Location: chunks.173.mjs:1076-1080
// ============================================

// ORIGINAL (for source lookup):
case "budget_usd":
    return [c6({
        content: tI(`USD budget: $${A.used}/$${A.total}; $${A.remaining} remaining`),
        isMeta: !0
    })];

// READABLE (for understanding):
case "budget_usd":
    return [createUserMessage({
        content: wrapInXmlTag(`USD budget: $${attachment.used}/$${attachment.total}; $${attachment.remaining} remaining`),
        isMeta: true
    })];

// Mapping: A→attachment, tI→wrapInXmlTag, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
USD budget: $1.25/$5.00; $3.75 remaining
</system-reminder>
```

---

## compaction_reminder

### What It Does

Notifies the LLM that auto-compact is enabled, so older messages will be automatically summarized when the context window fills up.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Auto-compact enabled | Feature is enabled |

### Source Code

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - compaction_reminder case
// Location: chunks.173.mjs:1106-1110
// ============================================

// ORIGINAL (for source lookup):
case "compaction_reminder":
    return _9([c6({
        content: "Auto-compact is enabled. When the context window is nearly full, older messages will be automatically summarized so you can continue working seamlessly. There is no need to stop or rush — you have unlimited context through automatic compaction.",
        isMeta: !0
    })]);

// READABLE (for understanding):
case "compaction_reminder":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: "Auto-compact is enabled. When the context window is nearly full, older messages will be automatically summarized so you can continue working seamlessly. There is no need to stop or rush — you have unlimited context through automatic compaction.",
            isMeta: true
        })
    ]);

// Mapping: _9→wrapWithSystemReminderTags, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
Auto-compact is enabled. When the context window is nearly full, older messages will be automatically summarized so you can continue working seamlessly. There is no need to stop or rush — you have unlimited context through automatic compaction.
</system-reminder>
```

### Key Insight

This reminder tells the LLM to **continue working normally** without rushing, as auto-compaction provides effectively unlimited context.

---

## critical_system_reminder

### What It Does

Delivers critical system alerts that require the LLM's attention.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Critical reminder set | `criticalSystemReminder_EXPERIMENTAL` is defined |

### Source Code

#### Producer Function

```javascript
// ============================================
// getCriticalSystemReminder - Produce critical reminder
// Location: chunks.142.mjs:2092-2099
// ============================================

// ORIGINAL (for source lookup):
function ahY(A) {
    let q = A.criticalSystemReminder_EXPERIMENTAL;
    if (!q) return [];
    return [{
        type: "critical_system_reminder",
        content: q
    }]
}

// READABLE (for understanding):
function getCriticalSystemReminder(sessionContext) {
    let content = sessionContext.criticalSystemReminder_EXPERIMENTAL;
    if (!content) return [];

    return [{
        type: "critical_system_reminder",
        content: content
    }];
}

// Mapping: ahY→getCriticalSystemReminder, A→sessionContext, q→content
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - critical_system_reminder case
// Location: chunks.173.mjs:995-999
// ============================================

// ORIGINAL (for source lookup):
case "critical_system_reminder":
    return _9([c6({
        content: A.content,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "critical_system_reminder":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: attachment.content,
            isMeta: true
        })
    ]);

// Mapping: A→attachment, _9→wrapWithSystemReminderTags, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
[Critical alert content here]
</system-reminder>
```

---

## queued_command

### What It Does

Delivers user messages that were queued while the LLM was working. This ensures the LLM addresses all user messages even if new ones arrive mid-task.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Queued messages | Messages exist in queue |
| Main agent only | No `agentId` in session context |

### Source Code

#### Producer Function

```javascript
// ============================================
// getQueuedCommandsAttachment - Produce queued commands
// Location: chunks.142.mjs:1993-2001
// ============================================

// ORIGINAL (for source lookup):
function dhY(A) {
    if (!A) return [];
    return A.filter((q) => q.mode === "prompt").map((q) => ({
        type: "queued_command",
        prompt: q.value,
        source_uuid: q.uuid,
        imagePasteIds: q.imagePasteIds
    }))
}

// READABLE (for understanding):
function getQueuedCommandsAttachment(queuedMessages) {
    if (!queuedMessages) return [];

    return queuedMessages
        .filter(msg => msg.mode === "prompt")
        .map(msg => ({
            type: "queued_command",
            prompt: msg.value,
            source_uuid: msg.uuid,
            imagePasteIds: msg.imagePasteIds
        }));
}

// Mapping: dhY→getQueuedCommandsAttachment, A→queuedMessages, q→msg
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - queued_command case
// Location: chunks.173.mjs:889-913
// ============================================

// ORIGINAL (for source lookup):
case "queued_command": {
    if (Array.isArray(A.prompt)) {
        let K = A.prompt.filter((w) => w.type === "text").map((w) => w.text).join(`
`),
            Y = A.prompt.filter((w) => w.type === "image"),
            z = [{
                type: "text",
                text: `The user sent a new message while you were working:
${K}

IMPORTANT: After completing your current task, you MUST address the user's message above. Do not ignore it.`
            }, ...Y];
        return _9([c6({
            content: z,
            isMeta: !0
        })])
    }
    return _9([c6({
        content: `The user sent a new message while you were working:
${A.prompt}

IMPORTANT: After completing your current task, you MUST address the user's message above. Do not ignore it.`,
        isMeta: !0
    })])
}

// READABLE (for understanding):
case "queued_command": {
    // Handle multi-modal prompts (text + images)
    if (Array.isArray(attachment.prompt)) {
        let textContent = attachment.prompt
            .filter(block => block.type === "text")
            .map(block => block.text)
            .join('\n');

        let imageBlocks = attachment.prompt.filter(block => block.type === "image");

        let contentBlocks = [
            {
                type: "text",
                text: `The user sent a new message while you were working:
${textContent}

IMPORTANT: After completing your current task, you MUST address the user's message above. Do not ignore it.`
            },
            ...imageBlocks  // Include images
        ];

        return wrapWithSystemReminderTags([
            createUserMessage({
                content: contentBlocks,
                isMeta: true
            })
        ]);
    }

    // Simple text prompt
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `The user sent a new message while you were working:
${attachment.prompt}

IMPORTANT: After completing your current task, you MUST address the user's message above. Do not ignore it.`,
            isMeta: true
        })
    ]);
}

// Mapping: A→attachment, K→textContent, Y→imageBlocks, z→contentBlocks, _9→wrapWithSystemReminderTags, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
The user sent a new message while you were working:
Please also check the tests

IMPORTANT: After completing your current task, you MUST address the user's message above. Do not ignore it.
</system-reminder>
```

### Key Insight

The queued command includes an explicit **MUST address** instruction to ensure the LLM doesn't ignore pending user messages.

---

## output_style

### What It Does

Reminds the LLM about active output style settings (e.g., concise, detailed).

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Style set | Output style is not "default" |
| Main agent only | No `agentId` in session context |

### Source Code

#### Producer Function

```javascript
// ============================================
// getOutputStyleAttachment - Produce output style reminder
// Location: chunks.142.mjs:2101-2108
// ============================================

// ORIGINAL (for source lookup):
function shY() {
    let q = C8()?.outputStyle || "default";
    if (q === "default") return [];
    return [{
        type: "output_style",
        style: q
    }]
}

// READABLE (for understanding):
function getOutputStyleAttachment() {
    let outputStyle = getSettings()?.outputStyle || "default";
    if (outputStyle === "default") return [];

    return [{
        type: "output_style",
        style: outputStyle
    }];
}

// Mapping: shY→getOutputStyleAttachment, q→outputStyle, C8→getSettings
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - output_style case
// Location: chunks.173.mjs:919-926
// ============================================

// ORIGINAL (for source lookup):
case "output_style": {
    let K = D51[A.style];
    if (!K) return [];
    return _9([c6({
        content: `${K.name} output style is active. Remember to follow the specific guidelines for this style.`,
        isMeta: !0
    })])
}

// READABLE (for understanding):
case "output_style": {
    let styleConfig = OUTPUT_STYLE_CONFIG[attachment.style];
    if (!styleConfig) return [];

    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `${styleConfig.name} output style is active. Remember to follow the specific guidelines for this style.`,
            isMeta: true
        })
    ]);
}

// Mapping: A→attachment, K→styleConfig, D51→OUTPUT_STYLE_CONFIG, _9→wrapWithSystemReminderTags, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
Concise output style is active. Remember to follow the specific guidelines for this style.
</system-reminder>
```

---

## verify_plan_reminder

### What It Does

Reminds the LLM to verify that a plan was completed correctly after implementation.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Plan implemented | Plan implementation completed |

### Source Code

#### Producer Function

```javascript
// ============================================
// getVerifyPlanReminderAttachment - Produce verify plan reminder
// Location: chunks.142.mjs:2849-2851
// ============================================

// ORIGINAL (for source lookup):
async function SIY(A, q) {
    return []
}

// READABLE (for understanding):
async function getVerifyPlanReminderAttachment(messages, sessionContext) {
    // Currently returns empty - feature may be disabled or in development
    return [];
}

// Mapping: SIY→getVerifyPlanReminderAttachment, A→messages, q→sessionContext
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - verify_plan_reminder case
// Location: chunks.173.mjs:1111-1117
// ============================================

// ORIGINAL (for source lookup):
case "verify_plan_reminder": {
    let Y = `You have completed implementing the plan. Please call the "" tool directly (NOT the ${fK} tool or an agent) to verify that all plan items were completed correctly.`;
    return _9([c6({
        content: Y,
        isMeta: !0
    })])
}

// READABLE (for understanding):
case "verify_plan_reminder": {
    let content = `You have completed implementing the plan. Please call the "" tool directly (NOT the TodoWrite tool or an agent) to verify that all plan items were completed correctly.`;
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: content,
            isMeta: true
        })
    ]);
}

// Mapping: Y→content, _9→wrapWithSystemReminderTags, c6→createUserMessage, fK→TodoWrite
```

### Key Insight

The producer function currently returns empty, suggesting this feature may be in development or conditionally disabled.

---

## Configuration

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT` | Enable token usage reminders |
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | Disable all attachment production |

### Settings

| Setting | Purpose |
|---------|---------|
| `maxBudgetUsd` | Maximum USD budget for the session |
| `outputStyle` | Output style mode (default, concise, etc.) |
| `criticalSystemReminder_EXPERIMENTAL` | Critical reminder content |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:

- `getTokenUsageAttachment` (RIY) - Token usage producer, `chunks.142.mjs:2815-2825`
- `getBudgetUsdAttachment` (yIY) - Budget producer, `chunks.142.mjs:2827-2835`
- `getCriticalSystemReminder` (ahY) - Critical reminder producer, `chunks.142.mjs:2092-2099`
- `getQueuedCommandsAttachment` (dhY) - Queued commands producer, `chunks.142.mjs:1993-2001`
- `getOutputStyleAttachment` (shY) - Output style producer, `chunks.142.mjs:2101-2108`
- `getVerifyPlanReminderAttachment` (SIY) - Verify plan producer, `chunks.142.mjs:2849-2851`
- `wrapInXmlTag` (tI) - XML tag wrapper, `chunks.173.mjs:490-494`
- `createUserMessage` (c6) - Message factory
- `getCurrentSpend` (W0) - Get current USD spend
- `getModelContextLimit` (m51) - Get model context window size
- `countMessagesTokens` (PZ) - Count tokens in messages

---

## Related Documents

- [README.md](./README.md) - Documentation index
- [implementation_details.md](./implementation_details.md) - Core implementation
- [types_task_management.md](./types_task_management.md) - Task status types