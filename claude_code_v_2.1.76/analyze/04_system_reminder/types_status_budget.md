# System Reminder Types: Status & Budget Notifications

> **Module**: System Reminders - Status/Budget Types
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.173.mjs:889-926`, `chunks.173.mjs:1071-1117`, `chunks.142.mjs:2815-2850`, `chunks.174.mjs:366-445`

---

## Table of Contents

- [Overview](#overview)
- [token_usage](#token_usage)
- [budget_usd](#budget_usd)
- [output_token_usage](#output_token_usage) - **NEW in v2.1.76**
- [date_change](#date_change) - **NEW in v2.1.76**
- [ultrathink_effort](#ultrathink_effort) - **NEW in v2.1.76**
- [deferred_tools_delta](#deferred_tools_delta) - **NEW in v2.1.76**
- [mcp_instructions_delta](#mcp_instructions_delta) - **NEW in v2.1.76**
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
3. **output_token_usage** - Output token tracking (v2.1.76 NEW)
4. **date_change** - Date change notification (v2.1.76 NEW)
5. **ultrathink_effort** - Reasoning effort level (v2.1.76 NEW)
6. **deferred_tools_delta** - Deferred tools availability changes (v2.1.76 NEW)
7. **mcp_instructions_delta** - MCP server instruction changes (v2.1.76 NEW)
8. **compaction_reminder** - Auto-compact notification
9. **critical_system_reminder** - Critical system alerts
10. **queued_command** - Queued user messages
11. **output_style** - Output style reminders
12. **verify_plan_reminder** - Plan verification reminders

These types use the `tI` (wrapInXmlTag) function for inline XML wrapping.

---

## Trigger Source Summary

Each status/budget type has a specific producer function with distinct trigger conditions:

| Type | Producer Function | Location | Key Trigger Logic |
|------|-------------------|----------|-------------------|
| `token_usage` | `qmY` (getTokenUsageAttachment) | chunks.147.mjs:1108-1118 | `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT` env var |
| `budget_usd` | `YmY` (getBudgetUsdAttachment) | chunks.147.mjs:1124-1134 | `maxBudgetUsd !== undefined` |
| `output_token_usage` | `KmY` (getOutputTokenUsageAttachment) | chunks.147.mjs:1120-1122 | Currently returns empty array |
| `queued_command` | `OuY` (getQueuedCommandsAttachment) | chunks.147.mjs:48-68 | `commands.filter(c => wuY.has(c.mode))` |
| `output_style` | `NuY` (getOutputStyleAttachment) | chunks.147.mjs:293-300 | `outputStyle !== "default"` |
| `critical_system_reminder` | `vuY` (getCriticalSystemReminder) | chunks.147.mjs:284-291 | `criticalSystemReminder_EXPERIMENTAL` option set |
| `date_change` | `fuY` (getDateChangeAttachment) | chunks.147.mjs:237-246 | Date rollover detection |
| `ultrathink_effort` | `TuY` (getUltrathinkEffortAttachment) | chunks.147.mjs:248-254 | Extended thinking mode active |
| `deferred_tools_delta` | `xE1` (getDeferredToolsDeltaAttachment) | chunks.147.mjs:256-267 | MCP deferred tools availability change |
| `mcp_instructions_delta` | `uE1` (getMcpInstructionsDeltaAttachment) | chunks.147.mjs:269-282 | MCP server instructions change |

### Token Calculation

```javascript
// Location: chunks.147.mjs:1108-1118
let totalTokens = getModelContextLimit(mainLoopModel);  // OF()
let usedTokens = countMessagesTokens(messages);         // Ck()
```

### Budget Tracking

```javascript
// Location: chunks.147.mjs:1124-1134
let currentSpend = getCurrentUsdSpend();  // LD()
let remaining = maxBudgetUsd - currentSpend;
```

### Queued Command Filter

```javascript
// Location: chunks.147.mjs:48-68
let filtered = queuedMessages.filter(cmd => wuY.has(cmd.mode));
// wuY = new Set(["prompt", "task-notification"])
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
// Location: chunks.147.mjs:1108-1118
// ============================================

// ORIGINAL (for source lookup):
function qmY(A, q) {
    if (!t6(process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT)) return [];
    let K = OF(q),
        Y = Ck(A);
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

// Mapping: qmY→getTokenUsageAttachment, A→messages, q→mainLoopModel, K→totalTokens, Y→usedTokens, t6→parseBoolean, OF→getModelContextLimit, Ck→countMessagesTokens
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - token_usage case
// Location: chunks.174.mjs:356-360
// ============================================

// ORIGINAL (for source lookup):
case "token_usage":
    return [p1({
        content: af(`Token usage: ${A.used}/${A.total}; ${A.remaining} remaining`),
        isMeta: !0
    })];

// READABLE (for understanding):
case "token_usage":
    return [createUserMessage({
        content: wrapInXmlTag(`Token usage: ${attachment.used}/${attachment.total}; ${attachment.remaining} remaining`),
        isMeta: true
    })];

// Mapping: A→attachment, af→wrapInXmlTag, p1→createUserMessage
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
// Location: chunks.147.mjs:1124-1134
// ============================================

// ORIGINAL (for source lookup):
function YmY(A) {
    if (A === void 0) return [];
    let q = LD(),
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

    let usedAmount = getCurrentUsdSpend();
    let remainingAmount = maxBudgetUsd - usedAmount;

    return [{
        type: "budget_usd",
        used: usedAmount,
        total: maxBudgetUsd,
        remaining: remainingAmount
    }];
}

// Mapping: YmY→getBudgetUsdAttachment, A→maxBudgetUsd, q→usedAmount, K→remainingAmount, LD→getCurrentUsdSpend
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - budget_usd case
// Location: chunks.174.mjs:361-365
// ============================================

// ORIGINAL (for source lookup):
case "budget_usd":
    return [p1({
        content: af(`USD budget: $${A.used}/$${A.total}; $${A.remaining} remaining`),
        isMeta: !0
    })];

// READABLE (for understanding):
case "budget_usd":
    return [createUserMessage({
        content: wrapInXmlTag(`USD budget: $${attachment.used}/$${attachment.total}; $${attachment.remaining} remaining`),
        isMeta: true
    })];

// Mapping: A→attachment, af→wrapInXmlTag, p1→createUserMessage
```

### Output Format

```markdown
<system-reminder>
USD budget: $1.25/$5.00; $3.75 remaining
</system-reminder>
```

---

## output_token_usage

### What It Does

Provides output token usage statistics to the LLM, helping track token consumption for the current turn and session.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Output tokens tracked | Output token counting is enabled |
| Main agent only | No `agentId` in session context |

### Source Code

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - output_token_usage case
// Location: chunks.174.mjs:366-374
// ============================================

// ORIGINAL (for source lookup):
case "output_token_usage": {
    let K = A.budget !== null ? `${fq(A.turn)} / ${fq(A.budget)}` : fq(A.turn);
    return [p1({
        content: af(`Output tokens — turn: ${K} · session: ${fq(A.session)}`),
        isMeta: !0
    })]
}

// READABLE (for understanding):
case "output_token_usage": {
    let turnInfo = attachment.budget !== null
        ? `${formatNumber(attachment.turn)} / ${formatNumber(attachment.budget)}`
        : formatNumber(attachment.turn);

    return [createUserMessage({
        content: wrapInXmlTag(`Output tokens — turn: ${turnInfo} · session: ${formatNumber(attachment.session)}`),
        isMeta: true
    })];
}

// Mapping: A→attachment, K→turnInfo, fq→formatNumber, p1→createUserMessage, af→wrapInXmlTag
```

### Output Format

```markdown
<system-reminder>
Output tokens — turn: 1,234 / 10,000 · session: 45,678
</system-reminder>
```

### Key Insight

When a budget is set, the reminder shows `turn / budget` format, helping the LLM understand output token limits. Without a budget, only absolute counts are shown.

---

## date_change

### What It Does

Notifies the LLM that the calendar date has changed since the last turn. This is important for time-sensitive operations and ensuring the model has accurate temporal context.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Date changed | System detects date rollover between turns |
| Main agent only | No `agentId` in session context |

### Source Code

#### Producer Function

```javascript
// ============================================
// getDateChangeAttachment - Produce date change attachment
// Location: chunks.147.mjs:237-246
// ============================================

// ORIGINAL (for source lookup):
function fuY() {
    let A = GD6(),
        q = tu1();
    if (q === null) return dw6(A), [];
    if (A === q) return [];
    return a2.cache.clear?.(), dw6(A), [{
        type: "date_change",
        newDate: A
    }]
}

// READABLE (for understanding):
function getDateChangeAttachment() {
    let currentDate = getCurrentDate();
    let lastRecordedDate = getLastRecordedDate();

    // First run - just record the date
    if (lastRecordedDate === null) {
        recordCurrentDate(currentDate);
        return [];
    }

    // No change - skip
    if (currentDate === lastRecordedDate) {
        return [];
    }

    // Date changed - clear any date-related caches and notify
    dateCache.cache.clear?.();
    recordCurrentDate(currentDate);

    return [{
        type: "date_change",
        newDate: currentDate
    }];
}

// Mapping: fuY→getDateChangeAttachment, A→currentDate, q→lastRecordedDate, GD6→getCurrentDate, tu1→getLastRecordedDate, dw6→recordCurrentDate, a2→dateCache
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - date_change case
// Location: chunks.174.mjs:405-409
// ============================================

// ORIGINAL (for source lookup):
case "date_change":
    return b5([p1({
        content: `The date has changed. Today's date is now ${A.newDate}. DO NOT mention this to the user explicitly because they are already aware.`,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "date_change":
    return wrapWithSystemReminderTags([createUserMessage({
        content: `The date has changed. Today's date is now ${attachment.newDate}. DO NOT mention this to the user explicitly because they are already aware.`,
        isMeta: true
    })]);

// Mapping: A→attachment, b5→wrapWithSystemReminderTags, p1→createUserMessage
```

### Output Format

```markdown
<system-reminder>
The date has changed. Today's date is now 2026-03-17. DO NOT mention this to the user explicitly because they are already aware.
</system-reminder>
```

### Key Insight

The reminder explicitly tells the LLM **not to mention** the date change to the user, as this is internal context only. This prevents awkward "By the way, it's a new day!" messages. The producer also clears date-related caches when the date changes.

---

## ultrathink_effort

### What It Does

Informs the LLM about the requested reasoning effort level for the current turn. This is used with extended thinking mode to control how much reasoning the model should apply.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Effort level set | User or system specifies reasoning effort |
| Extended thinking | Model supports extended thinking |

### Source Code

#### Producer Function

```javascript
// ============================================
// getUltrathinkEffortAttachment - Produce ultrathink effort attachment
// Location: chunks.147.mjs:248-254
// ============================================

// ORIGINAL (for source lookup):
function TuY(A) {
    if (!GU() || !A || !pG7(A)) return [];
    return d("tengu_ultrathink", {}), [{
        type: "ultrathink_effort",
        level: "high"
    }]
}

// READABLE (for understanding):
function getUltrathinkEffortAttachment(mainLoopModel) {
    // Check if extended thinking is enabled and model supports it
    if (!isExtendedThinkingEnabled() || !mainLoopModel || !modelSupportsExtendedThinking(mainLoopModel)) {
        return [];
    }

    // Log telemetry for ultrathink usage
    logTelemetry("tengu_ultrathink", {});

    return [{
        type: "ultrathink_effort",
        level: "high"
    }];
}

// Mapping: TuY→getUltrathinkEffortAttachment, A→mainLoopModel, GU→isExtendedThinkingEnabled, pG7→modelSupportsExtendedThinking, d→logTelemetry
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - ultrathink_effort case
// Location: chunks.174.mjs:410-414
// ============================================

// ORIGINAL (for source lookup):
case "ultrathink_effort":
    return b5([p1({
        content: `The user has requested reasoning effort level: ${A.level}. Apply this to the current turn.`,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "ultrathink_effort":
    return wrapWithSystemReminderTags([createUserMessage({
        content: `The user has requested reasoning effort level: ${attachment.level}. Apply this to the current turn.`,
        isMeta: true
    })]);

// Mapping: A→attachment, b5→wrapWithSystemReminderTags, p1→createUserMessage
```

### Output Format

```markdown
<system-reminder>
The user has requested reasoning effort level: high. Apply this to the current turn.
</system-reminder>
```

### Key Insight

Effort levels typically range from "low" to "high" and affect how much internal reasoning the model performs before responding.

---

## deferred_tools_delta

### What It Does

Notifies the LLM about changes in available deferred tools. Deferred tools are MCP tools that become available on-demand rather than being pre-loaded.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Tools added/removed | Deferred tool availability changes |
| MCP connection | Connected to MCP servers with deferred tools |

### Source Code

#### Producer Function

```javascript
// ============================================
// getDeferredToolsDeltaAttachment - Produce deferred tools delta attachment
// Location: chunks.147.mjs:256-267
// ============================================

// ORIGINAL (for source lookup):
function xE1(A, q, K) {
    if (!ki6()) return [];
    if (!dk()) return [];
    if (!Vi6(q)) return [];
    if (!bz6(A)) return [];
    let Y = eF8(A, K ?? []);
    if (!Y) return [];
    return [{
        type: "deferred_tools_delta",
        ...Y
    }]
}

// READABLE (for understanding):
function getDeferredToolsDeltaAttachment(tools, mainLoopModel, previousTools) {
    // Feature flag checks
    if (!isDeferredToolsEnabled()) return [];
    if (!isToolDeltaTrackingEnabled()) return [];
    if (!modelSupportsDeferredTools(mainLoopModel)) return [];
    if (!hasDeferredTools(tools)) return [];

    // Compute the delta between current and previous tool sets
    let delta = computeDeferredToolsDelta(tools, previousTools ?? []);
    if (!delta) return [];

    return [{
        type: "deferred_tools_delta",
        ...delta  // Contains addedLines and removedNames
    }];
}

// Mapping: xE1→getDeferredToolsDeltaAttachment, A→tools, q→mainLoopModel, K→previousTools
//          ki6→isDeferredToolsEnabled, dk→isToolDeltaTrackingEnabled, Vi6→modelSupportsDeferredTools
//          bz6→hasDeferredTools, eF8→computeDeferredToolsDelta, Y→delta
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - deferred_tools_delta case
// Location: chunks.174.mjs:415-429
// ============================================

// ORIGINAL (for source lookup):
case "deferred_tools_delta": {
    let K = [];
    if (A.addedLines.length > 0) K.push(`The following deferred tools are now available via ToolSearch:
${A.addedLines.join(`
`)}
`);
    if (A.removedLines.length > 0) K.push(`The following deferred tools are no longer available:
${A.removedLines.join(`
`)}
`);
    if (K.length === 0) return [];
    return b5([p1({
        content: K.join(`
`),
        isMeta: !0
    })])
}

// READABLE (for understanding):
case "deferred_tools_delta": {
    let messages = [];

    if (attachment.addedLines.length > 0) {
        messages.push(`The following deferred tools are now available via ToolSearch:
${attachment.addedLines.join('\n')}
`);
    }

    if (attachment.removedLines.length > 0) {
        messages.push(`The following deferred tools are no longer available:
${attachment.removedLines.join('\n')}
`);
    }

    if (messages.length === 0) return [];

    return wrapWithSystemReminderTags([createUserMessage({
        content: messages.join('\n'),
        isMeta: true
    })]);
}

// Mapping: A→attachment, K→messages, b5→wrapWithSystemReminderTags, p1→createUserMessage
```

### Output Format

```markdown
<system-reminder>
The following deferred tools are now available via ToolSearch:
mcp__server__tool1
mcp__server__tool2

The following deferred tools are no longer available:
mcp__oldserver__tool
</system-reminder>
```

### Key Insight

This type enables **dynamic tool availability** - tools can appear/disappear during a session as MCP servers connect/disconnect. The LLM is instructed to use ToolSearch to discover newly available tools.

---

## mcp_instructions_delta

### What It Does

Notifies the LLM about changes in MCP server instructions. MCP servers can provide custom instructions that guide how the LLM should interact with them.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Instructions changed | MCP server instructions added/removed |
| MCP connection | Connected to MCP servers with instructions |

### Source Code

#### Producer Function

```javascript
// ============================================
// getMcpInstructionsDeltaAttachment - Produce MCP instructions delta attachment
// Location: chunks.147.mjs:269-282
// ============================================

// ORIGINAL (for source lookup):
function uE1(A, q, K, Y) {
    if (!iT6()) return [];
    let z = [];
    if (dk() && Vi6(K) && bz6(q)) z.push({
        serverName: lv,
        block: kE1
    });
    let _ = c4q(A, Y ?? [], z);
    if (!_) return [];
    return [{
        type: "mcp_instructions_delta",
        ..._
    }]
}

// READABLE (for understanding):
function getMcpInstructionsDeltaAttachment(instructions, mainLoopModel, tools, previousInstructions) {
    // Feature flag check
    if (!isMcpInstructionsEnabled()) return [];

    let addedBlocks = [];

    // Check for new instructions from MCP servers
    if (isInstructionTrackingEnabled() && modelSupportsMcpInstructions(mainLoopModel) && hasMcpTools(tools)) {
        addedBlocks.push({
            serverName: SERVER_NAME,
            block: INSTRUCTION_BLOCK
        });
    }

    // Compute delta between current and previous instructions
    let delta = computeInstructionsDelta(instructions, previousInstructions ?? [], addedBlocks);
    if (!delta) return [];

    return [{
        type: "mcp_instructions_delta",
        ...delta  // Contains addedBlocks and removedBlocks
    }];
}

// Mapping: uE1→getMcpInstructionsDeltaAttachment, A→instructions, q→mainLoopModel, K→tools, Y→previousInstructions
//          iT6→isMcpInstructionsEnabled, dk→isInstructionTrackingEnabled, Vi6→modelSupportsMcpInstructions
//          bz6→hasMcpTools, z→addedBlocks, _→delta, c4q→computeInstructionsDelta, lv→SERVER_NAME, kE1→INSTRUCTION_BLOCK
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - mcp_instructions_delta case
// Location: chunks.174.mjs:430-445
// ============================================

// ORIGINAL (for source lookup):
case "mcp_instructions_delta": {
    let K = [];
    if (A.addedBlocks.length > 0) K.push(`# MCP Server Instructions

${A.addedBlocks.join(`
`)}
`);
    if (A.removedBlocks.length > 0) K.push(`The following MCP server instructions are no longer active:
${A.removedBlocks.join(`
`)}
`);
    if (K.length === 0) return [];
    return b5([p1({
        content: K.join(`
`),
        isMeta: !0
    })])
}

// READABLE (for understanding):
case "mcp_instructions_delta": {
    let messages = [];

    if (attachment.addedBlocks.length > 0) {
        messages.push(`# MCP Server Instructions

${attachment.addedBlocks.join('\n')}
`);
    }

    if (attachment.removedBlocks.length > 0) {
        messages.push(`The following MCP server instructions are no longer active:
${attachment.removedBlocks.join('\n')}
`);
    }

    if (messages.length === 0) return [];

    return wrapWithSystemReminderTags([createUserMessage({
        content: messages.join('\n'),
        isMeta: true
    })]);
}

// Mapping: A→attachment, K→messages, b5→wrapWithSystemReminderTags, p1→createUserMessage
```

### Output Format

```markdown
<system-reminder>
# MCP Server Instructions

When using the database tools, always wrap queries in transactions.

The following MCP server instructions are no longer active:
Old server instructions here...
</system-reminder>
```

### Key Insight

MCP instructions are **dynamic** - they can change during a session as servers connect/disconnect. This reminder type keeps the LLM's context synchronized with the current set of active instructions.

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

- `getTokenUsageAttachment` (qmY) - Token usage producer, `chunks.147.mjs:1108-1118`
- `getBudgetUsdAttachment` (YmY) - Budget producer, `chunks.147.mjs:1124-1134`
- `getOutputTokenUsageAttachment` (KmY) - Output token producer, `chunks.147.mjs:1120-1122`
- `getDateChangeAttachment` (fuY) - Date change producer, `chunks.147.mjs:237-246`
- `getUltrathinkEffortAttachment` (TuY) - Ultrathink effort producer, `chunks.147.mjs:248-254`
- `getDeferredToolsDeltaAttachment` (xE1) - Deferred tools delta producer, `chunks.147.mjs:256-267`
- `getMcpInstructionsDeltaAttachment` (uE1) - MCP instructions delta producer, `chunks.147.mjs:269-282`
- `getCriticalSystemReminder` (vuY) - Critical reminder producer, `chunks.147.mjs:284-291`
- `getQueuedCommandsAttachment` (OuY) - Queued commands producer, `chunks.147.mjs:48-68`
- `getOutputStyleAttachment` (NuY) - Output style producer, `chunks.147.mjs:293-300`
- `wrapInXmlTag` (af) - XML tag wrapper, `chunks.173.mjs:2490-2494`
- `wrapWithSystemReminderTags` (b5) - System reminder wrapper, `chunks.173.mjs:2496-2523`
- `createUserMessage` (p1) - Message factory, `chunks.173.mjs:1378-1412`

---

## Related Documents

- [README.md](./README.md) - Documentation index
- [implementation_details.md](./implementation_details.md) - Core implementation
- [types_task_management.md](./types_task_management.md) - Task status types