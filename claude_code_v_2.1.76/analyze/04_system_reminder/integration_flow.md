# System Reminder Integration Flow (Claude Code 2.1.76)

> Cross-module analysis of system reminder production, attachment assembly, and LLM context injection.
>
> **Symbol Validation Status**: ✅ VERIFIED - All symbols cross-validated against source code.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `assembleAllAttachments` (_uY) - Attachment orchestrator at chunks.147.mjs:3
- `normalizeAttachmentForAPI` (Ui8) - Attachment normalizer at chunks.174.mjs:3
- `createUserMessage` (p1) - Message factory at chunks.173.mjs:1378
- `wrapWithSystemReminderTags` (b5) - Tag wrapper at chunks.173.mjs:2496

---

## Overview

System reminders are meta-messages injected into the LLM context to provide runtime information. They are:

1. **Not shown to the user** - Marked as `isMeta: true`
2. **Filtered from UI display** - Hidden in message list
3. **Included in API requests** - Part of message history

---

## Attachment Production Pipeline

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER PRODUCTION PIPELINE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Flags / UI State / Session State                                       │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ assembleAllAttachments (_uY)                                         │    │
│  │ Location: chunks.147.mjs:3                                           │    │
│  │ ───────────────────────────────────────────────────────────────    │    │
│  │ Orchestrates all attachment producers                                │    │
│  │                                                                       │    │
│  │ Priority Order:                                                       │    │
│  │ 1. Mode control attachments (plan, auto)                            │    │
│  │ 2. Critical runtime info (token usage, budget)                      │    │
│  │ 3. Team context (mailbox, agent tasks)                              │    │
│  │ 4. Status information (todos, memory)                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ├───────────────────────────────────────────────────────────────┐    │
│         │                       │                       │               │    │
│         ▼                       ▼                       ▼               │    │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐           │    │
│  │ Plan Mode   │       │ Auto Mode   │       │ Team Context│           │    │
│  │ Attachment  │       │ Attachment  │       │ Attachment  │           │    │
│  │             │       │             │       │             │           │    │
│  │ • Plan file │       │ • Status    │       │ • Mailbox   │           │    │
│  │ • Guidance  │       │ • Tracking  │       │ • Agent IDs │           │    │
│  └─────────────┘       └─────────────┘       └─────────────┘           │    │
│                                                                              │
│         ├───────────────────────────────────────────────────────────────┐    │
│         │                       │                       │               │    │
│         ▼                       ▼                       ▼               │    │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐           │    │
│  │ Token Usage │       │ Budget      │       │ Todo List   │           │    │
│  │ Attachment  │       │ Attachment  │       │ Attachment  │           │    │
│  │             │       │             │       │             │           │    │
│  │ • Input tok │       │ • Spent     │       │ • Tasks     │           │    │
│  │ • Output tok│       │ • Remaining │       │ • Status    │           │    │
│  └─────────────┘       └─────────────┘       └─────────────┘           │    │
│                                                                              │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ normalizeAttachmentForAPI (Ui8)                                      │    │
│  │ Location: chunks.174.mjs:3                                           │    │
│  │ ───────────────────────────────────────────────────────────────    │    │
│  │ Converts attachment to API format:                                   │    │
│  │ • Create user message with content                                  │    │
│  │ • Wrap with system-reminder tags                                    │    │
│  │ • Mark as isMeta: true                                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Injected into messages array                                         │    │
│  │ ───────────────────────────────────────────────────────────────    │    │
│  │                                                                       │    │
│  │ messages = [...existingMessages, ...attachments]                     │    │
│  │                                                                       │    │
│  │ Then normalized by normalizeMessages (cM)                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## assembleAllAttachments Function

```javascript
// ============================================
// assembleAllAttachments (_uY) - Attachment orchestrator
// Location: chunks.147.mjs:3
// ============================================

// READABLE (for understanding):
async function assembleAllAttachments(sessionState) {
    const attachments = [];

    // 1. Plan Mode Attachment
    if (sessionState.toolPermissionContext.mode === 'plan') {
        const planAttachment = await producePlanModeAttachment(sessionState);
        if (planAttachment) {
            attachments.push(planAttachment);
        }
    }

    // 2. Auto Mode Attachment
    if (sessionState.toolPermissionContext.mode === 'auto' ||
        sessionState.toolPermissionContext.prePlanMode === 'auto') {
        const autoAttachment = await produceAutoModeAttachment(sessionState);
        if (autoAttachment) {
            attachments.push(autoAttachment);
        }
    }

    // 3. Team Context Attachment (if in team mode)
    if (sessionState.teamContext) {
        const teamAttachment = await produceTeamContextAttachment(sessionState.teamContext);
        if (teamAttachment) {
            attachments.push(teamAttachment);
        }

        // 3b. Team Mailbox Attachment (if messages waiting)
        const mailboxAttachment = await produceMailboxAttachment(sessionState);
        if (mailboxAttachment) {
            attachments.push(mailboxAttachment);
        }
    }

    // 4. Token Usage Attachment (always include if available)
    const tokenAttachment = await produceTokenUsageAttachment(sessionState);
    if (tokenAttachment) {
        attachments.push(tokenAttachment);
    }

    // 5. Budget Attachment (if budget tracking enabled)
    if (sessionState.maxBudgetUsd) {
        const budgetAttachment = await produceBudgetAttachment(sessionState);
        if (budgetAttachment) {
            attachments.push(budgetAttachment);
        }
    }

    // 6. Todo List Attachment (if todos exist)
    if (sessionState.todos && sessionState.todos.length > 0) {
        const todoAttachment = await produceTodoAttachment(sessionState.todos);
        if (todoAttachment) {
            attachments.push(todoAttachment);
        }
    }

    // 7. Auto Memory Attachment (if memory exists)
    const memoryAttachment = await produceMemoryAttachment(sessionState);
    if (memoryAttachment) {
        attachments.push(memoryAttachment);
    }

    return attachments;
}
```

---

## normalizeAttachmentForAPI Function

```javascript
// ============================================
// normalizeAttachmentForAPI (Ui8) - API format conversion
// Location: chunks.174.mjs:3
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    let q = [];
    for (let K of A.content)
        if (K.type === "text") q.push({
            type: "text",
            text: K.text
        });
        else if (K.type === "image") q.push({
            type: "image",
            source: {
                type: "base64",
                media_type: K.source.media_type,
                data: K.source.data
            }
        });
        else if (K.type === "document") q.push({
            type: "document",
            source: {
                type: "base64",
                media_type: K.source.media_type,
                data: K.source.data
            }
        });
    return p1({
        content: q,
        uuid: A.uuid,
        timestamp: A.timestamp,
        isMeta: A.isMeta ?? !1
    })
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    const normalizedContent = [];

    for (const block of attachment.content) {
        switch (block.type) {
            case "text":
                normalizedContent.push({
                    type: "text",
                    text: block.text
                });
                break;

            case "image":
                normalizedContent.push({
                    type: "image",
                    source: {
                        type: "base64",
                        media_type: block.source.media_type,
                        data: block.source.data
                    }
                });
                break;

            case "document":
                normalizedContent.push({
                    type: "document",
                    source: {
                        type: "base64",
                        media_type: block.source.media_type,
                        data: block.source.data
                    }
                });
                break;
        }
    }

    // Create user message with normalized content
    return createUserMessage({
        content: normalizedContent,
        uuid: attachment.uuid,
        timestamp: attachment.timestamp,
        isMeta: attachment.isMeta ?? false
    });
}

// Mapping: Ui8→normalizeAttachmentForAPI, A→attachment, q→normalizedContent, p1→createUserMessage
```

---

## System Reminder Tag Wrapping

```javascript
// ============================================
// wrapWithSystemReminderTags (b5) - Tag wrapper
// Location: chunks.173.mjs:2496
// ============================================

// READABLE (for understanding):
function wrapWithSystemReminderTags(content) {
    return `<system-reminder>
${content}
</system-reminder>`;
}

// Example output:
// <system-reminder>
// Token usage: 45000/200000
// </system-reminder>
```

---

## Individual Attachment Producers

### 1. Plan Mode Attachment

```javascript
// ============================================
// producePlanModeAttachment - Plan guidance
// ============================================

// READABLE (for understanding):
async function producePlanModeAttachment(sessionState) {
    const planFile = await readPlanFile(sessionState.planFilePath);

    if (!planFile) {
        return {
            content: [{
                type: "text",
                text: `<system-reminder>
You are in plan mode. Your goal is to understand the user's intent and create a plan.
Do NOT make edits or run tools that modify files.
Use Read, Grep, Glob to gather information.
When ready, call ExitPlanMode with your plan.
</system-reminder>`
            }],
            isMeta: true
        };
    }

    return {
        content: [{
            type: "text",
            text: `<system-reminder>
Plan mode active. Current plan:

${planFile}

Continue gathering information or exit plan mode when ready.
</system-reminder>`
        }],
        isMeta: true
    };
}
```

### 2. Token Usage Attachment

```javascript
// ============================================
// produceTokenUsageAttachment - Token tracking
// ============================================

// READABLE (for understanding):
async function produceTokenUsageAttachment(sessionState) {
    const usage = sessionState.tokenUsage;
    if (!usage) return null;

    const { inputTokens, outputTokens, cacheReadTokens, cacheCreationTokens } = usage;
    const totalTokens = inputTokens + outputTokens;

    const threshold = getAutoCompactThreshold(sessionState.model);
    const percentUsed = (totalTokens / threshold * 100).toFixed(1);

    return {
        content: [{
            type: "text",
            text: `<system-reminder>
Token usage: ${totalTokens.toLocaleString()}/${threshold.toLocaleString()} (${percentUsed}%)
Input: ${inputTokens.toLocaleString()}, Output: ${outputTokens.toLocaleString()}
${cacheReadTokens ? `Cache read: ${cacheReadTokens.toLocaleString()}` : ''}
${cacheCreationTokens ? `Cache creation: ${cacheCreationTokens.toLocaleString()}` : ''}
</system-reminder>`
        }],
        isMeta: true
    };
}
```

### 3. Team Context Attachment

```javascript
// ============================================
// produceTeamContextAttachment - Team mode info
// ============================================

// READABLE (for understanding):
async function produceTeamContextAttachment(teamContext) {
    const { teamName, agentId, agentIds, role } = teamContext;

    const parts = [`Team: ${teamName}`];

    if (agentId) {
        parts.push(`Your agent ID: ${agentId}`);
    }

    if (role) {
        parts.push(`Your role: ${role}`);
    }

    if (agentIds && agentIds.length > 0) {
        parts.push(`Teammates: ${agentIds.filter(id => id !== agentId).join(', ')}`);
    }

    return {
        content: [{
            type: "text",
            text: `<system-reminder>
${parts.join('\n')}

You can communicate with teammates using the SendMessage tool.
Check your mailbox for messages from other agents.
</system-reminder>`
        }],
        isMeta: true
    };
}
```

### 4. Todo List Attachment

```javascript
// ============================================
// produceTodoAttachment - Task tracking
// ============================================

// READABLE (for understanding):
async function produceTodoAttachment(todos) {
    if (!todos || todos.length === 0) return null;

    const activeTodos = todos.filter(t => t.status !== 'completed');
    if (activeTodos.length === 0) return null;

    const lines = activeTodos.map((todo, i) => {
        const statusIcon = todo.status === 'in_progress' ? '►' : '○';
        return `${statusIcon} ${todo.content}`;
    });

    return {
        content: [{
            type: "text",
            text: `<system-reminder>
Current tasks:
${lines.join('\n')}

Update the task list using TodoWrite.
</system-reminder>`
        }],
        isMeta: true
    };
}
```

### 5. Budget Attachment

```javascript
// ============================================
// produceBudgetAttachment - Cost tracking
// ============================================

// READABLE (for understanding):
async function produceBudgetAttachment(sessionState) {
    const { maxBudgetUsd, spentBudget } = sessionState;
    if (!maxBudgetUsd) return null;

    const remaining = maxBudgetUsd - (spentBudget || 0);
    const percentUsed = ((spentBudget || 0) / maxBudgetUsd * 100).toFixed(1);

    return {
        content: [{
            type: "text",
            text: `<system-reminder>
Budget: $${(spentBudget || 0).toFixed(2)} / $${maxBudgetUsd.toFixed(2)} (${percentUsed}% used)
Remaining: $${remaining.toFixed(2)}
</system-reminder>`
        }],
        isMeta: true
    };
}
```

---

## Integration with Agent Loop

### Pre-Turn Injection

```javascript
// ============================================
// Agent Loop - Pre-turn attachment assembly
// Location: chunks.148.mjs (mainAgentLoopCore)
// ============================================

// READABLE (for understanding):
async function* mainAgentLoopCore(params) {
    let turnState = { ...initialState };

    while (true) {
        // 1. Get current session state
        const sessionState = toolUseContext.getAppState();

        // 2. Assemble attachments
        const attachments = await assembleAllAttachments(sessionState);

        // 3. Normalize attachments for API
        const normalizedAttachments = attachments.map(normalizeAttachmentForAPI);

        // 4. Add to messages
        let messagesForAPI = [...turnState.messages, ...normalizedAttachments];

        // 5. Normalize all messages
        messagesForAPI = normalizeMessages(messagesForAPI, tools);

        // 6. Call LLM
        for await (const event of callModel({
            messages: messagesForAPI,
            systemPrompt,
            tools,
            options
        })) {
            yield event;
        }

        // ... tool execution, turn completion
    }
}
```

---

## CLI Flags Affecting Reminders

| CLI Flag | Reminder Effect |
|----------|-----------------|
| `--plan` | Activates plan mode attachment |
| `--permission-mode auto` | Activates auto mode attachment |
| `--team-name <name>` | Activates team context attachment |
| `--max-budget-usd <amount>` | Activates budget tracking attachment |
| `--max-tokens <n>` | Affects token usage threshold display |

---

## UI State Affecting Reminders

| UI State | Reminder Effect |
|----------|-----------------|
| Token usage update | Updates token usage attachment |
| Todo list change | Updates todo attachment |
| Team mailbox receive | Adds mailbox attachment |
| Memory file update | Updates memory attachment |

---

## Key Insights

### Design Rationale

1. **Meta flag**: Keeps reminders hidden from user while included in API
2. **Tag wrapping**: Makes reminders easy to parse and identify
3. **Priority order**: Critical info first, status info last
4. **Lazy production**: Only produce attachments when relevant data exists

### Performance Considerations

- Attachments are produced once per turn
- No caching needed (fresh state each turn)
- Minimal overhead (just string formatting)

---

## Source References

| Component | File | Key Functions |
|-----------|------|---------------|
| Attachment Assembly | chunks.147.mjs | `assembleAllAttachments` (_uY) |
| Attachment Normalization | chunks.174.mjs | `normalizeAttachmentForAPI` (Ui8) |
| Message Creation | chunks.173.mjs | `createUserMessage` (p1) |
| Tag Wrapping | chunks.173.mjs | `wrapWithSystemReminderTags` (b5) |

---

## Deep CLI Integration Flow

### CLI Flag → State → Attachment Mapping

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLI FLAGS → STATE → ATTACHMENT MAPPING                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Entry (cliEntry JVz at chunks.198.mjs:1573)                            │
│         │                                                                    │
│         ▼                                                                    │
│  Argument Parsing (parseCliArgs)                                             │
│         │                                                                    │
│         ├── --plan → toolPermissionContext.mode = "plan"                    │
│         │             └── Triggers: plan_mode attachment                    │
│         │                                                                      │
│         ├── --dangerously-skip-permissions                                   │
│         │             → toolPermissionContext.mode = "bypassPermissions"    │
│         │             └── Effect: All tools allowed, fewer prompts          │
│         │                                                                      │
│         ├── --team-name <name>                                               │
│         │             → teamContext.teamName = name                         │
│         │             → E7() returns true (isTeamMode)                       │
│         │             └── Triggers: team_context, teammate_mailbox          │
│         │                                                                      │
│         ├── --max-budget-usd <amount>                                        │
│         │             → maxBudgetUsd = amount                                │
│         │             └── Triggers: budget_usd attachment                    │
│         │                                                                      │
│         ├── --mcp-config <path>                                              │
│         │             → mcpClients initialized from config                   │
│         │             └── Triggers: mcp_instructions_delta, mcp_resources   │
│         │                                                                      │
│         └── (no special flags)                                               │
│                       → toolPermissionContext.mode = "default"              │
│                       └── Standard attachments (token_usage, todos, etc.)   │
│                                                                              │
│  State Store (createStateStore WX1 at chunks.85.mjs:1747)                   │
│         │                                                                    │
│         └── All CLI flags merged into initial state                         │
│             → Accessible via useAppState(M1) hook                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Permission Mode → Attachment Variant Selection

| Permission Mode | CLI Trigger | Attachment Variants | Tool Restrictions |
|-----------------|-------------|---------------------|-------------------|
| `default` | Normal operation | All standard reminders | Read-only tools auto-allowed |
| `plan` | `--plan` | `plan_mode`, `plan_file_reference`, `plan_mode_reentry` | Only Read/Grep/Glob allowed |
| `auto` | Auto mode active | `auto_mode`, `auto_mode_exit` | Mode-defined subset |
| `bypassPermissions` | `--dangerously-skip-permissions` | Minimal reminders | All tools allowed |
| `accept` | `--permission-mode accept` | All reminders | All tools auto-approved |

### State Propagation to assembleAllAttachments

```javascript
// ============================================
// State propagation from CLI to attachment producers
// Location: chunks.147.mjs:3 (assembleAllAttachments)
// ============================================

// The sessionContext (q) contains all CLI-derived state:
let sessionContext = {
    toolPermissionContext: {
        mode: "plan" | "auto" | "default" | "bypassPermissions" | "accept",
        // From --permission-mode or --plan flags
    },
    teamContext: {
        teamName: "...",      // From --team-name
        agentId: "...",       // Assigned when in team mode
    },
    options: {
        maxBudgetUsd: 10.0,   // From --max-budget-usd
        mainLoopModel: "...", // From --model or default
        mcpClients: [...],    // From --mcp-config
        tools: [...],         // Tool definitions with isMcp flags
    },
    agentId: undefined,       // Set for subagents, undefined for main
};

// assembleAllAttachments uses these to determine which producers to run:
if (sessionContext.toolPermissionContext.mode === 'plan') {
    // Run plan_mode producer → DuY()
}
if (isTeamMode()) {  // E7() checks teamContext
    // Run team_context, teammate_mailbox producers
}
if (sessionContext.options.maxBudgetUsd) {
    // Run budget_usd producer → YmY()
}
```

---

## Deep UI Integration Flow

### Message Rendering Pipeline with isMeta Filtering

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UI MESSAGE RENDERING PIPELINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AppState.messages array                                                     │
│         │                                                                    │
│         ▼                                                                    │
│  MessageList Component (veY at chunks.161.mjs)                              │
│         │                                                                    │
│         ├── Filter: Gi6 (empty message filter)                              │
│         │             └── Removes empty messages, keeps progress/attachment │
│         │                                                                    │
│         ├── Filter: XV6 (user message display filter)                       │
│         │             └── CRITICAL: if (message.isMeta) return false        │
│         │             └── This HIDES all system reminders from UI           │
│         │                                                                    │
│         ├── Filter: isVisibleInTranscriptOnly check                         │
│         │             └── Separate handling for compact summaries           │
│         │                                                                    │
│         ▼                                                                    │
│  MessageItem Component                                                       │
│         │                                                                    │
│         └── Renders only non-meta messages to user                          │
│                                                                              │
│  Result: User sees ONLY actual conversation, NOT system reminders           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### The isMeta Visibility Gate (XV6)

```javascript
// ============================================
// XV6 - isMeta visibility filter (THE critical UI gate)
// Location: chunks.185.mjs:1692-1702
// ============================================

// READABLE (for understanding):
function isValidUserMessageForDisplay(message) {
    // Only process user messages
    if (message.type !== "user") return false;

    // Hide tool_result messages (shown separately)
    if (message.message.content[0]?.type === "tool_result") return false;

    // Hide special message types
    if (isSpecialMessageType(message)) return false;

    // ★★★ CRITICAL: Hide isMeta messages ★★★
    // This is where ALL system reminders get hidden from UI
    if (message.isMeta) return false;

    // Additional XML tag detection for edge cases
    if (containsSystemReminderTags(content)) return false;

    return true;
}

// Why this matters:
// - Every system reminder has isMeta: true
// - This single check prevents ALL reminders from showing in chat
// - But they ARE sent to the LLM API (isMeta stripped before API call)
```

### API Preparation: isMeta Stripping

```javascript
// ============================================
// formatMessagesForAPI (m9z) - Strips isMeta before API call
// Location: chunks.173.mjs:...
// ============================================

// READABLE (for understanding):
function formatMessagesForAPI(messages) {
    return messages.map(message => {
        if (message.type === "user") {
            return formatUserMessageForAPI(message);
        } else if (message.type === "assistant") {
            return formatAssistantMessageForAPI(message);
        }
        return message;
    });
}

function formatUserMessageForAPI(message) {
    const { isMeta, ...apiMessage } = message;
    // isMeta is stripped - LLM receives the message but not the flag
    return {
        role: "user",
        content: apiMessage.message.content
    };
}

// Why this matters:
// 1. isMeta hides from UI
// 2. isMeta is STRIPPED before API
// 3. LLM sees the message content (e.g., token usage, plan mode instructions)
// 4. LLM does NOT know it was a "meta" message - it's just user context
```

---

## End-to-End Flow: Complete Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE SYSTEM REMINDER PIPELINE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. CLI FLAGS                                                                │
│     --plan, --team-name, --max-budget-usd, etc.                             │
│         │                                                                    │
│         ▼                                                                    │
│  2. STATE INITIALIZATION                                                     │
│     createStateStore (WX1) merges CLI args into state                       │
│         │                                                                    │
│         ▼                                                                    │
│  3. AGENT LOOP TURN START                                                    │
│     mainAgentLoop (Yh) at chunks.148.mjs:875                                │
│         │                                                                    │
│         ▼                                                                    │
│  4. ATTACHMENT ASSEMBLY (pre-turn)                                           │
│     assembleAllAttachments (_uY) at chunks.147.mjs:3                        │
│         │                                                                    │
│         ├── Group 1: User-dependent (sequential)                            │
│         ├── Group 2: Always-computed (parallel)                             │
│         └── Group 3: Main-agent-only (parallel)                             │
│         │                                                                    │
│         ▼                                                                    │
│  5. ATTACHMENT NORMALIZATION                                                 │
│     normalizeAttachmentForAPI (Ui8) at chunks.174.mjs:3                     │
│         │                                                                    │
│         └── Creates user message with isMeta: true                          │
│         │                                                                    │
│         ▼                                                                    │
│  6. MESSAGE INJECTION                                                        │
│     Attachments added to messages array                                      │
│         │                                                                    │
│         ▼                                                                    │
│  7. MESSAGE NORMALIZATION                                                    │
│     normalizeMessages (cM) merges consecutive user messages                 │
│         │                                                                    │
│         ▼                                                                    │
│  8. API CALL                                                                 │
│     formatMessagesForAPI strips isMeta flag                                 │
│     LLM receives all messages including reminder content                     │
│         │                                                                    │
│         ▼                                                                    │
│  9. UI RENDERING                                                             │
│     MessageList (veY) filters via XV6                                        │
│     isMeta: true → NOT rendered                                             │
│     User sees only actual conversation                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Design Insights

### 1. Dual-Channel Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DUAL-CHANNEL MESSAGE DESIGN                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  USER CHANNEL (Visible):                                                     │
│  ─────────────────────────                                                   │
│  User input → MessageList → Display to user                                 │
│  Filter: isMeta: false → Show                                               │
│                                                                              │
│  MODEL CHANNEL (Hidden from user):                                          │
│  ──────────────────────────────────                                         │
│  System reminders → isMeta: true → Hidden from UI → Sent to LLM            │
│                                                                              │
│  Why dual-channel?                                                          │
│  1. Context injection without UI clutter                                    │
│  2. LLM gets runtime info (tokens, todos, mode)                             │
│  3. User sees clean conversation                                            │
│  4. Compaction handles both uniformly                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2. Fail-Safe Production

The attachment production system uses **three-layer error isolation**:

1. **Producer-level**: Each producer wrapped in `timedAttachmentProducer (Hz)`
2. **Group-level**: Groups 2 and 3 run in parallel, failure in one doesn't block others
3. **Global timeout**: 1-second AbortController ensures system never hangs

### 3. State-Driven Conditional Production

Producers are conditionally executed based on:
- CLI flag state (team mode, plan mode)
- Runtime state (todos exist, budget set)
- Agent context (main agent vs subagent)

---

## Source References

| Component | File | Key Functions |
|-----------|------|---------------|
| Attachment Assembly | chunks.147.mjs | `assembleAllAttachments` (_uY) |
| Attachment Normalization | chunks.174.mjs | `normalizeAttachmentForAPI` (Ui8) |
| Message Creation | chunks.173.mjs | `createUserMessage` (p1) |
| Tag Wrapping | chunks.173.mjs | `wrapWithSystemReminderTags` (b5) |
| isMeta Filter | chunks.185.mjs | `XV6` |
| Message Normalization | chunks.173.mjs | `normalizeMessages` (cM) |
| State Store | chunks.85.mjs | `createStateStore` (WX1) |
| Agent Loop | chunks.148.mjs | `mainAgentLoop` (Yh) |

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - System reminder integration documented with deep CLI/UI flow