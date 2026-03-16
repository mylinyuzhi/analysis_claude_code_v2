# System Reminder Implementation Details

> **Module**: System Reminders - Core Implementation
> **Version**: Claude Code 2.1.76
> **Source**:
> - `chunks.174.mjs:3-469` (normalizeAttachmentForAPI - normalization layer)
> - `chunks.147.mjs:3-550` (assembleAllAttachments, producer functions - production layer)
> - `chunks.173.mjs:1378-1412` (createUserMessage - message factory)
> - `chunks.173.mjs:2490-2740` (XML wrappers, plan/auto mode reminders - formatting layer)

---

## Table of Contents

- [Overview](#overview)
- [Core Functions](#core-functions)
- [Plan Mode Reminder Variants](#plan-mode-reminder-variants)
- [XML Tag Processing](#xml-tag-processing)
- [Message Construction Patterns](#message-construction-patterns)
- [Regex Patterns](#regex-patterns)
- [Constants and Configuration](#constants-and-configuration)
- [Related Symbols](#related-symbols)

---

## Overview

The system reminder implementation consists of three main layers:

1. **Production Layer** (`chunks.147.mjs`) - Attachment producer functions that gather data
2. **Normalization Layer** (`chunks.174.mjs`) - Converts attachments to API messages
3. **Injection Layer** - Inserts messages into conversation stream

This document focuses on the **normalization layer** implementation details, specifically the core functions that convert typed attachment objects into formatted messages.

---

## Core Functions

### wrapInXmlTag (af) - XML Tag Wrapper

**What it does:** Wraps content string in `<system-reminder>` XML tags.

**How it works:**
```javascript
// ============================================
// wrapInXmlTag - Creates the <system-reminder> XML wrapper string
// Location: chunks.173.mjs:2490-2494
// ============================================

// ORIGINAL (for source lookup):
function af(A) {
    return `<system-reminder>
${A}
</system-reminder>`
}

// READABLE (for understanding):
function wrapInXmlTag(content) {
    return `<system-reminder>\n${content}\n</system-reminder>`;
}

// Mapping: af→wrapInXmlTag, A→content
```

**Key insight:** This is a minimal, single-purpose function. The newline after opening tag and before closing tag ensures clean formatting when content spans multiple lines.

**When used:**
- Inline wrapping in status notifications (`task_status`, `token_usage`, `budget_usd`)
- Hook response messages (`hook_blocking_error`, `hook_success`)

---

### wrapWithSystemReminderTags (b5) - Message Array Wrapper

**What it does:** Wraps an array of messages, adding XML tags to all text content.

**How it works:**
```javascript
// ============================================
// wrapWithSystemReminderTags - Wraps text content in <system-reminder> XML tags
// Location: chunks.173.mjs:2496-2523
// ============================================

// ORIGINAL (for source lookup):
function b5(A) {
    return A.map((q) => {
        if (typeof q.message.content === "string") return {
            ...q, message: { ...q.message, content: af(q.message.content) }
        };
        else if (Array.isArray(q.message.content)) {
            let K = q.message.content.map((Y) => {
                if (Y.type === "text") return { ...Y, text: af(Y.text) };
                return Y
            });
            return { ...q, message: { ...q.message, content: K } }
        }
        return q
    })
}

// READABLE (for understanding):
function wrapWithSystemReminderTags(messages) {
    return messages.map((msg) => {
        // Case 1: String content - wrap directly
        if (typeof msg.message.content === "string") {
            return {
                ...msg,
                message: {
                    ...msg.message,
                    content: wrapInXmlTag(msg.message.content)
                }
            };
        }
        // Case 2: Array content (multi-block) - wrap only text blocks
        else if (Array.isArray(msg.message.content)) {
            let wrappedBlocks = msg.message.content.map((block) => {
                if (block.type === "text") {
                    return { ...block, text: wrapInXmlTag(block.text) };
                }
                // Image and other blocks pass through unchanged
                return block;
            });
            return { ...msg, message: { ...msg.message, content: wrappedBlocks } };
        }
        // Case 3: Other content types - pass through unchanged
        return msg;
    });
}

// Mapping: b5→wrapWithSystemReminderTags, A→messages, q→msg, af→wrapInXmlTag, K→wrappedBlocks, Y→block
```

**Why this approach:**
- **String handling**: Simple wrap for text-only messages
- **Array handling**: Preserves image blocks (type: "image") without corruption
- **Flexibility**: Works with both simple text and multi-modal content

**Key insight:** The function doesn't wrap image blocks because XML tags would corrupt binary/structured image data. This allows system reminders to include images alongside text instructions.

---

### normalizeAttachmentForAPI (Ui8) - Main Dispatcher

**What it does:** Central switch statement that converts attachment objects to message arrays.

**Architecture:**
```
normalizeAttachmentForAPI(attachment)
    │
    ├─> Pre-switch check (team mode types)
    │     └─> teammate_mailbox, team_context
    │
    ├─> Main switch (57+ cases)
    │     ├─> File types: directory, file, edited_text_file, compact_file_reference, pdf_reference
    │     ├─> IDE types: selected_lines_in_ide, opened_file_in_ide
    │     ├─> Todo/Task types: todo, todo_reminder, task_reminder, task_status, task_progress
    │     ├─> Memory types: nested_memory, relevant_memories, invoked_skills, skill_listing
    │     ├─> Mode types: plan_mode, plan_mode_reentry, plan_mode_exit, auto_mode, auto_mode_exit,
    │     │                 delegate_mode, delegate_mode_exit
    │     ├─> Hook types: async_hook_response, hook_blocking_error, hook_success, hook_additional_context
    │     ├─> New hook types (v2.1.76): post_compact, elicitation, elicitation_result,
    │     │                             instructions_loaded, config_change, worktree_create, worktree_remove
    │     ├─> Budget types: token_usage, budget_usd, output_token_usage
    │     ├─> New status types (v2.1.76): session_name, cron_job, date_change, ultrathink_effort
    │     ├─> MCP integration types (v2.1.76): deferred_tools_delta, mcp_instructions_delta
    │     ├─> Other types: mcp_resource, agent_mention, diagnostics, queued_command, ultramemory
    │     └─> Silent types: already_read_file, command_permissions, edited_image_file, context_efficiency, etc.
    │
    └─> Unknown type fallback → log warning, return []
```

**Source Location:** `chunks.174.mjs:3-469`

**Complete Implementation:**
```javascript
// ============================================
// normalizeAttachmentForAPI - Main dispatcher converting attachments to messages
// Location: chunks.174.mjs:3-469
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (E7()) {
        if (A.type === "teammate_mailbox") return [p1({ content: Kzz().formatTeammateMessages(A.messages), isMeta: !0 })];
        if (A.type === "team_context") return [p1({ content: `<system-reminder>...team coordination...</system-reminder>`, isMeta: !0 })]
    }
    switch (A.type) {
        case "directory": return b5([nr6(J4.name, { command: `ls ${j4([A.path])}`, description: `Lists files in ${A.path}` }), ir6(J4, { stdout: A.content, stderr: "", interrupted: !1 })]);
        case "edited_text_file": return b5([p1({ content: `Note: ${A.filename} was modified...`, isMeta: !0 })]);
        case "file": {
            let K = A.content;
            switch (K.type) {
                case "image": return b5([nr6(L9.name, { file_path: A.filename }), ir6(L9, K)]);
                case "text": return b5([nr6(L9.name, { file_path: A.filename }), ir6(L9, K), ...A.truncated ? [p1({ content: `Note: The file ${A.filename} was too large...`, isMeta: !0 })] : []]);
                case "notebook": return b5([nr6(L9.name, { file_path: A.filename }), ir6(L9, K)]);
                case "pdf": return b5([nr6(L9.name, { file_path: A.filename }), ir6(L9, K)])
            }
            break
        }
        case "compact_file_reference": return b5([p1({ content: `Note: ${A.filename} was read before...`, isMeta: !0 })]);
        case "pdf_reference": return b5([p1({ content: `PDF file: ${A.filename} (${A.pageCount} pages, ${xq(A.fileSize)})...`, isMeta: !0 })]);
        case "selected_lines_in_ide": {
            let Y = A.content.length > 2000 ? A.content.substring(0, 2000) + `\n... (truncated)` : A.content;
            return b5([p1({ content: `The user selected the lines ${A.lineStart} to ${A.lineEnd} from ${A.filename}:\n${Y}\n\nThis may or may not be related to the current task.`, isMeta: !0 })])
        }
        case "opened_file_in_ide": return b5([p1({ content: `The user opened the file ${A.filename} in the IDE...`, isMeta: !0 })]);
        case "plan_file_reference": return b5([p1({ content: `A plan file exists from plan mode at: ${A.planFilePath}\n\nPlan contents:\n\n${A.planContent}\n\nIf this plan is relevant...`, isMeta: !0 })]);
        case "invoked_skills": {
            if (A.skills.length === 0) return [];
            let K = A.skills.map((Y) => `### Skill: ${Y.name}\nPath: ${Y.path}\n\n${Y.content}`).join(`\n\n---\n\n`);
            return b5([p1({ content: `The following skills were invoked in this session...\n\n${K}`, isMeta: !0 })])
        }
        case "todo_reminder": { /* ... produces todo reminder message ... */ }
        case "task_reminder": { if (!r$()) return []; /* ... produces task reminder message ... */ }
        case "nested_memory": return b5([p1({ content: `Contents of ${A.content.path}:\n\n${A.content.content}`, isMeta: !0 })]);
        case "relevant_memories": return b5(A.memories.map((K) => { /* ... memory with timestamp ... */ }));
        case "dynamic_skill": return [];
        case "skill_listing": { if (!A.content) return []; return b5([p1({ content: `The following skills are available...\n\n${A.content}`, isMeta: !0 })]) }
        case "queued_command": { /* ... handles queued prompts ... */ }
        case "ultramemory": return b5([p1({ content: A.content, isMeta: !0 })]);
        case "output_style": { let K = aY6[A.style]; if (!K) return []; return b5([p1({ content: `${K.name} output style is active...`, isMeta: !0 })]) }
        case "diagnostics": { if (A.files.length === 0) return []; let K = Gb.formatDiagnosticsSummary(A.files); return b5([p1({ content: `<new-diagnostics>...\n\n${K}</new-diagnostics>`, isMeta: !0 })]) }
        case "plan_mode": return Wzz(A);
        case "plan_mode_reentry": { /* ... plan re-entry message ... */ }
        case "plan_mode_exit": { /* ... plan exit message ... */ }
        case "auto_mode": return Lzz(A);
        case "auto_mode_exit": return b5([p1({ content: `## Exited Auto Mode\n\nYou have exited auto mode...`, isMeta: !0 })]);
        case "critical_system_reminder": return b5([p1({ content: A.content, isMeta: !0 })]);
        case "mcp_resource": { /* ... handles MCP resource content ... */ }
        case "agent_mention": return b5([p1({ content: `The user has expressed a desire to invoke the agent "${A.agentType}"...`, isMeta: !0 })]);
        case "task_status": { /* ... produces task status message ... */ }
        case "async_hook_response": { /* ... handles hook response ... */ }
        case "token_usage": return [p1({ content: af(`Token usage: ${A.used}/${A.total}; ${A.remaining} remaining`), isMeta: !0 })];
        case "budget_usd": return [p1({ content: af(`USD budget: $${A.used}/$${A.total}; $${A.remaining} remaining`), isMeta: !0 })];
        case "output_token_usage": { let K = A.budget !== null ? `${fq(A.turn)} / ${fq(A.budget)}` : fq(A.turn); return [p1({ content: af(`Output tokens — turn: ${K} · session: ${fq(A.session)}`), isMeta: !0 })] }
        case "hook_blocking_error": return [p1({ content: af(`${A.hookName} hook blocking error...`), isMeta: !0 })];
        case "hook_success": { if (A.hookEvent !== "SessionStart" && A.hookEvent !== "UserPromptSubmit") return []; if (A.content === "") return []; return [p1({ content: af(`${A.hookName} hook success: ${A.content}`), isMeta: !0 })] }
        case "hook_additional_context": { if (A.content.length === 0) return []; return [p1({ content: af(`${A.hookName} hook additional context: ${A.content.join(`\n`)}`), isMeta: !0 })] }
        case "hook_stopped_continuation": return [p1({ content: af(`${A.hookName} hook stopped continuation: ${A.message}`), isMeta: !0 })];
        case "compaction_reminder": return b5([p1({ content: "Auto-compact is enabled. When the context window is nearly full...", isMeta: !0 })]);
        case "context_efficiency": return [];
        case "date_change": return b5([p1({ content: `The date has changed. Today's date is now ${A.newDate}...`, isMeta: !0 })]);
        case "ultrathink_effort": return b5([p1({ content: `The user has requested reasoning effort level: ${A.level}...`, isMeta: !0 })]);
        case "deferred_tools_delta": { /* ... handles deferred tools changes ... */ }
        case "mcp_instructions_delta": { /* ... handles MCP instruction changes ... */ }
        case "verify_plan_reminder": { /* ... verify plan message ... */ }
        case "already_read_file":
        case "command_permissions":
        case "edited_image_file":
        case "hook_cancelled":
        case "hook_error_during_execution":
        case "hook_non_blocking_error":
        case "hook_system_message":
        case "structured_output":
        case "hook_permission_decision":
            return []
    }
    if (["autocheckpointing", "background_task_status", "todo", "task_progress"].includes(A.type)) return [];
    return jV("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${A.type}`)), []
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Pre-switch: Team mode types only when in team mode
    if (isTeamMode()) {
        if (attachment.type === "teammate_mailbox") {
            return [createUserMessage({
                content: getMailboxFormatter().formatTeammateMessages(attachment.messages),
                isMeta: true
            })];
        }
        if (attachment.type === "team_context") {
            return [createUserMessage({
                content: `<system-reminder>
# Team Coordination
You are a teammate in team "${attachment.teamName}".
**Your Identity:** Name: ${attachment.agentName}
**Team Resources:** Team config: ${attachment.teamConfigPath}, Task list: ${attachment.taskListPath}
...
</system-reminder>`,
                isMeta: true
            })];
        }
    }

    switch (attachment.type) {
        // File/Directory types (cases 1-6)
        case "directory": return wrapWithSystemReminderTags([/* synthetic ls tool call + result */]);
        case "edited_text_file": return wrapWithSystemReminderTags([/* modification notification */]);
        case "file": return wrapWithSystemReminderTags([/* synthetic Read tool call + result + truncation notice */]);
        case "compact_file_reference": return wrapWithSystemReminderTags([/* compacted file notice */]);
        case "pdf_reference": return wrapWithSystemReminderTags([/* large PDF instructions */]);
        case "selected_lines_in_ide": return wrapWithSystemReminderTags([/* IDE selection context */]);
        case "opened_file_in_ide": return wrapWithSystemReminderTags([/* file opened notification */]);

        // Memory types
        case "invoked_skills": return wrapWithSystemReminderTags([/* previously invoked skills content */]);
        case "nested_memory": return wrapWithSystemReminderTags([/* memory file content */]);
        case "relevant_memories": return wrapWithSystemReminderTags([/* memory files with timestamps */]);
        case "skill_listing": return wrapWithSystemReminderTags([/* available skills list */]);
        case "ultramemory": return wrapWithSystemReminderTags([/* ultramemory content */]);

        // Task management
        case "todo_reminder": return wrapWithSystemReminderTags([/* todo list status */]);
        case "task_reminder": return wrapWithSystemReminderTags([/* task list status */]);
        case "task_status": return [/* task status notification with inline XML */];

        // Mode control
        case "plan_mode": return planModeReminderDispatcher(attachment);
        case "plan_mode_reentry": return wrapWithSystemReminderTags([/* re-entry instructions */]);
        case "plan_mode_exit": return wrapWithSystemReminderTags([/* exit confirmation */]);
        case "auto_mode": return autoModeReminder(attachment);
        case "auto_mode_exit": return wrapWithSystemReminderTags([/* auto mode exit */]);

        // Hook responses
        case "async_hook_response": return wrapWithSystemReminderTags([/* hook response content */]);
        case "hook_blocking_error": return [/* blocking error with inline XML */];
        case "hook_success": return [/* success message with inline XML */];
        case "hook_additional_context": return [/* additional context with inline XML */];
        case "hook_stopped_continuation": return [/* stopped continuation with inline XML */];

        // Status types
        case "token_usage": return [createUserMessage({ content: wrapInXmlTag(`Token usage: ${attachment.used}/${attachment.total}...`), isMeta: true })];
        case "budget_usd": return [createUserMessage({ content: wrapInXmlTag(`USD budget: $${attachment.used}/$${attachment.total}...`), isMeta: true })];
        case "compaction_reminder": return wrapWithSystemReminderTags([/* auto-compact notification */]);
        case "date_change": return wrapWithSystemReminderTags([/* date change notification */]);
        case "ultrathink_effort": return wrapWithSystemReminderTags([/* reasoning effort level */]);

        // MCP integration
        case "mcp_resource": return wrapWithSystemReminderTags([/* MCP resource content */]);
        case "deferred_tools_delta": return wrapWithSystemReminderTags([/* deferred tools availability */]);
        case "mcp_instructions_delta": return wrapWithSystemReminderTags([/* MCP instruction changes */]);

        // Other types
        case "diagnostics": return wrapWithSystemReminderTags([/* LSP diagnostics */]);
        case "queued_command": return wrapWithSystemReminderTags([/* queued user message */]);
        case "agent_mention": return wrapWithSystemReminderTags([/* agent invocation request */]);
        case "critical_system_reminder": return wrapWithSystemReminderTags([/* critical alert */]);
        case "output_style": return wrapWithSystemReminderTags([/* output style notification */]);

        // Silent types - return empty array
        case "already_read_file":
        case "command_permissions":
        case "edited_image_file":
        case "hook_cancelled":
        case "hook_error_during_execution":
        case "hook_non_blocking_error":
        case "hook_system_message":
        case "structured_output":
        case "hook_permission_decision":
        case "context_efficiency":
        case "dynamic_skill":
            return [];
    }

    // Additional silent types
    if (["autocheckpointing", "background_task_status", "todo", "task_progress"].includes(attachment.type)) {
        return [];
    }

    // Unknown type - log warning and return empty array (forward compatibility)
    logWarning("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${attachment.type}`));
    return [];
}

// Mapping: Ui8→normalizeAttachmentForAPI, A→attachment, E7→isTeamMode, p1→createUserMessage,
//          b5→wrapWithSystemReminderTags, af→wrapInXmlTag, nr6→createToolCallMessage,
//          ir6→createToolResultMessage, Wzz→planModeReminderDispatcher, Lzz→autoModeReminder,
//          Kzz→getMailboxFormatter, j4→shellEscape, J4→BashTool, L9→ReadTool, xq→formatBytes
```

**Key Design Decisions:**

1. **Pre-switch team check**: Team types (`teammate_mailbox`, `team_context`) are checked before the switch because they're only relevant in team mode (`E7()` / `isTeamMode` check at `chunks.50.mjs:2543`).

```javascript
// ============================================
// Pre-switch team mode check
// Location: chunks.174.mjs:3-8
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (E7()) {
        if (A.type === "teammate_mailbox") return [p1({ content: Kzz().formatTeammateMessages(A.messages), isMeta: !0 })];
        if (A.type === "team_context") return [p1({ content: `<system-reminder>...team coordination...`, isMeta: !0 })]
    }

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    if (isTeamMode()) {
        if (attachment.type === "teammate_mailbox")
            return [createUserMessage({ content: getMailboxFormatter().formatTeammateMessages(attachment.messages), isMeta: true })];
        if (attachment.type === "team_context")
            return [createUserMessage({ content: `<system-reminder>...team coordination...`, isMeta: true })];
    }

// Mapping: Ui8→normalizeAttachmentForAPI, A→attachment, E7→isTeamMode, p1→createUserMessage, Kzz→getMailboxFormatter
```

2. **Silent types**: Multiple types return `[]` without producing messages:
   - `already_read_file` - UI visibility only, no API message
   - `command_permissions` - Internal state, not user-facing
   - `edited_image_file` - Binary content handled separately
   - Hook internal types: `hook_cancelled`, `hook_error_during_execution`, `hook_non_blocking_error`, `hook_system_message`, `hook_permission_decision`, `structured_output`
   - Auto types: `autocheckpointing`, `background_task_status`

3. **Unknown type safety**: Any unrecognized type logs a warning and returns `[]`, ensuring forward compatibility.

---

### assembleAllAttachments (_uY) - Attachment Orchestrator

**What it does:** Main entry point that coordinates all attachment producers and returns a flat array of attachments.

**How it works:**
```javascript
// ============================================
// assembleAllAttachments - Orchestrates all attachment producers
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = {...q, abortController: w},
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), Hz("mcp_resources", () => SuY(A, $)), Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents))), ...[]] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => Promise.resolve(fuY())), Hz("ultrathink_effort", () => Promise.resolve(TuY(A))), Hz("deferred_tools_delta", () => Promise.resolve(xE1(q.options.tools, q.options.mainLoopModel, z))), Hz("mcp_instructions_delta", () => Promise.resolve(uE1(q.options.mcpClients, q.options.tools, q.options.mainLoopModel, z))), Hz("changed_files", () => CuY($)), Hz("nested_memory", () => IuY($)), Hz("dynamic_skill", () => BuY($)), Hz("skill_listing", () => guY($)), Hz("ultra_claude_md", async () => VuY(z)), Hz("plan_mode", () => DuY(z, q)), Hz("plan_mode_exit", () => XuY(q)), Hz("auto_mode", () => ZuY(z, q)), Hz("auto_mode_exit", () => GuY(q)), Hz("todo_reminders", () => r$() ? auY(z, q) : ruY(z, q)), ...E7() ? [..._ === "session_memory" ? [] : [Hz("teammate_mailbox", async () => euY(q))], Hz("team_context", async () => AmY(z ?? []))] : [], Hz("agent_pending_messages", async () => $uY(q)), Hz("critical_system_reminder", () => Promise.resolve(vuY(q)))],
        D = H ? [Hz("ide_selection", async () => kuY(K, q)), Hz("ide_opened_file", async () => LuY(K, q)), Hz("output_style", async () => Promise.resolve(NuY())), Hz("diagnostics", async () => cuY(q)), Hz("lsp_diagnostics", async () => luY(q)), Hz("unified_tasks", async () => suY(q)), Hz("async_hook_responses", async () => tuY()), Hz("token_usage", async () => Promise.resolve(qmY(z ?? [], q.options.mainLoopModel))), Hz("budget_usd", async () => Promise.resolve(YmY(q.options.maxBudgetUsd))), Hz("output_token_usage", async () => Promise.resolve(KmY())), Hz("verify_plan_reminder", async () => _mY(z, q)), Hz("queued_commands", () => OuY(Y))] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}

// READABLE (for understanding):
async function assembleAllAttachments(atMentions, sessionContext, ideContext, queuedCommands, messages, sessionMemoryType) {
    // Early exit if attachments are disabled
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // Set up abort controller with 1s timeout
    const abortController = createAbortController();
    const timeoutId = setTimeout((ctrl) => ctrl.abort(), 1000, abortController);
    const contextWithAbort = { ...sessionContext, abortController };

    // Determine if this is the main agent (not a subagent)
    const isMainAgent = !sessionContext.agentId;

    // Group 1: User-Dependent Producers (only if @-mentions exist)
    const userDependentProducers = atMentions ? [
        timedAttachmentProducer("at_mentioned_files", () => extractAtMentionedFiles(atMentions, contextWithAbort)),
        timedAttachmentProducer("mcp_resources", () => extractMcpResources(atMentions, contextWithAbort)),
        timedAttachmentProducer("agent_mentions", () => Promise.resolve(extractAgentMentions(atMentions, sessionContext.options.agentDefinitions.activeAgents)))
    ] : [];
    const userDependentResults = await Promise.all(userDependentProducers);

    // Group 2: Always-Computed Producers
    const alwaysComputedProducers = [
        timedAttachmentProducer("date_change", () => Promise.resolve(getDateChangeAttachment())),
        timedAttachmentProducer("ultrathink_effort", () => Promise.resolve(getUltrathinkEffortAttachment(atMentions))),
        timedAttachmentProducer("deferred_tools_delta", () => Promise.resolve(getDeferredToolsDeltaAttachment(sessionContext.options.tools, sessionContext.options.mainLoopModel, messages))),
        timedAttachmentProducer("mcp_instructions_delta", () => Promise.resolve(getMcpInstructionsDeltaAttachment(sessionContext.options.mcpClients, sessionContext.options.tools, sessionContext.options.mainLoopModel, messages))),
        timedAttachmentProducer("changed_files", () => getChangedFilesAttachment(contextWithAbort)),
        timedAttachmentProducer("nested_memory", () => getNestedMemoryAttachments(contextWithAbort)),
        timedAttachmentProducer("dynamic_skill", () => getDynamicSkillAttachments(contextWithAbort)),
        timedAttachmentProducer("skill_listing", () => getSkillListingAttachment(contextWithAbort)),
        timedAttachmentProducer("ultra_claude_md", async () => getUltraClaudeMdAttachment(messages)),
        timedAttachmentProducer("plan_mode", () => getPlanModeAttachment(messages, sessionContext)),
        timedAttachmentProducer("plan_mode_exit", () => getPlanModeExitAttachment(sessionContext)),
        timedAttachmentProducer("auto_mode", () => getAutoModeAttachment(messages, sessionContext)),
        timedAttachmentProducer("auto_mode_exit", () => getAutoModeExitAttachment(sessionContext)),
        timedAttachmentProducer("todo_reminders", () => isTasksEnabled() ? getTaskReminders(messages, sessionContext) : getTodoReminders(messages, sessionContext)),
        // Team mode producers (only when in team mode)
        ...(isTeamMode() ? [
            ...(sessionMemoryType === "session_memory" ? [] : [timedAttachmentProducer("teammate_mailbox", async () => getTeammateMailboxAttachment(sessionContext))]),
            timedAttachmentProducer("team_context", async () => getTeamContextAttachment(messages ?? []))
        ] : []),
        timedAttachmentProducer("agent_pending_messages", async () => getAgentPendingMessages(sessionContext)),
        timedAttachmentProducer("critical_system_reminder", () => Promise.resolve(getCriticalSystemReminder(sessionContext)))
    ];

    // Group 3: Main-Agent-Only Producers
    const mainAgentOnlyProducers = isMainAgent ? [
        timedAttachmentProducer("ide_selection", async () => getIdeSelectionAttachment(ideContext, sessionContext)),
        timedAttachmentProducer("ide_opened_file", async () => getIdeOpenedFileAttachment(ideContext, sessionContext)),
        timedAttachmentProducer("output_style", async () => Promise.resolve(getOutputStyleAttachment())),
        timedAttachmentProducer("diagnostics", async () => getDiagnosticsAttachment(sessionContext)),
        timedAttachmentProducer("lsp_diagnostics", async () => getLspDiagnosticsAttachment(sessionContext)),
        timedAttachmentProducer("unified_tasks", async () => getUnifiedTasksAttachment(sessionContext)),
        timedAttachmentProducer("async_hook_responses", async () => getAsyncHookResponsesAttachment()),
        timedAttachmentProducer("token_usage", async () => Promise.resolve(getTokenUsageAttachment(messages ?? [], sessionContext.options.mainLoopModel))),
        timedAttachmentProducer("budget_usd", async () => Promise.resolve(getBudgetUsdAttachment(sessionContext.options.maxBudgetUsd))),
        timedAttachmentProducer("output_token_usage", async () => Promise.resolve(getOutputTokenUsageAttachment())),
        timedAttachmentProducer("verify_plan_reminder", async () => getVerifyPlanReminderAttachment(messages, sessionContext)),
        timedAttachmentProducer("queued_commands", () => getQueuedCommandsAttachment(queuedCommands))
    ] : [];

    // Execute all producers in parallel
    const [alwaysResults, mainAgentResults] = await Promise.all([
        Promise.all(alwaysComputedProducers),
        Promise.all(mainAgentOnlyProducers)
    ]);

    // Clear timeout and combine results
    clearTimeout(timeoutId);
    return [...userDependentResults.flat(), ...alwaysResults.flat(), ...mainAgentResults.flat()]
        .filter((result) => result !== undefined && result !== null);
}

// Mapping: _uY→assembleAllAttachments, A→atMentions, q→sessionContext, K→ideContext, Y→queuedCommands, z→messages, _→sessionMemoryType
//          t6→parseBoolean, sK→createAbortController, Hz→timedAttachmentProducer, H→isMainAgent, j→userDependentProducers
//          RuY→extractAtMentionedFiles, SuY→extractMcpResources, huY→extractAgentMentions, fuY→getDateChangeAttachment
//          TuY→getUltrathinkEffortAttachment, xE1→getDeferredToolsDeltaAttachment, uE1→getMcpInstructionsDeltaAttachment
//          CuY→getChangedFilesAttachment, IuY→getNestedMemoryAttachments, BuY→getDynamicSkillAttachments, guY→getSkillListingAttachment
//          VuY→getUltraClaudeMdAttachment, DuY→getPlanModeAttachment, XuY→getPlanModeExitAttachment, ZuY→getAutoModeAttachment
//          GuY→getAutoModeExitAttachment, r$→isTasksEnabled, auY→getTaskReminders, ruY→getTodoReminders, E7→isTeamMode
//          euY→getTeammateMailboxAttachment, AmY→getTeamContextAttachment, $uY→getAgentPendingMessages, vuY→getCriticalSystemReminder
//          kuY→getIdeSelectionAttachment, LuY→getIdeOpenedFileAttachment, NuY→getOutputStyleAttachment, cuY→getDiagnosticsAttachment
//          luY→getLspDiagnosticsAttachment, suY→getUnifiedTasksAttachment, tuY→getAsyncHookResponsesAttachment
//          qmY→getTokenUsageAttachment, YmY→getBudgetUsdAttachment, KmY→getOutputTokenUsageAttachment, _mY→getVerifyPlanReminderAttachment
//          OuY→getQueuedCommandsAttachment
```

**Why this architecture:**

1. **Three-Group Organization**:
   - Group 1 (User-Dependent): Only runs when @-mentions exist in user message
   - Group 2 (Always-Computed): Runs every turn, essential context
   - Group 3 (Main-Agent-Only): Only for the main agent, not subagents

2. **Parallel Execution**: All producers within each group run in parallel via `Promise.all()` for maximum efficiency.

3. **Abort Controller**: 1-second timeout ensures attachments don't block the conversation. Producers should check `abortController.signal` for cancellation.

4. **Filtering**: Results are filtered to remove `undefined` and `null` values, allowing producers to conditionally return nothing.

**Key insight:** The separation into three groups allows for conditional execution based on context (user mentions, main agent status) while maintaining parallel execution within each group.

---

### timedAttachmentProducer (Hz) - Telemetry Wrapper

**What it does:** Wraps attachment producers with timing and error handling telemetry.

**How it works:**
```javascript
// ============================================
// timedAttachmentProducer - Wraps producers with telemetry and error handling
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
async function timedAttachmentProducer(label, producerFn) {
    const startTime = Date.now();

    try {
        const result = await producerFn();
        const duration = Date.now() - startTime;

        // 5% sampling rate for telemetry
        if (Math.random() < 0.05) {
            const totalSize = result
                .filter((item) => item !== undefined && item !== null)
                .reduce((sum, item) => sum + JSON.stringify(item).length, 0);

            telemetry.emit("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                attachment_size_bytes: totalSize,
                attachment_count: result.length
            });
        }

        return result;
    } catch (error) {
        const duration = Date.now() - startTime;

        // Log error with 5% sampling
        if (Math.random() < 0.05) {
            telemetry.emit("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                error: true
            });
        }

        // Log error and return empty array (graceful degradation)
        console.error(error);
        logWarning(`Attachment error in ${label}`, error);
        return [];
    }
}

// Mapping: Hz→timedAttachmentProducer, A→label, q→producerFn, K→startTime, Y→result, z→duration
//          d→telemetry.emit, B6→JSON.stringify, _6→console.error, jV→logWarning
```

**Why this approach:**

1. **5% Sampling Rate**: Reduces telemetry volume while still capturing representative performance data.

2. **Graceful Degradation**: Returns empty array on error, preventing one failing producer from breaking the entire attachment pipeline.

3. **Timing Data**: Captures execution duration for performance monitoring.

**Key insight:** The telemetry sampling (5%) balances observability with performance overhead. This pattern ensures that even if an attachment producer crashes, the conversation continues unaffected.

---

### createUserMessage (p1) - Message Factory

**What it does:** Creates user message objects with consistent structure and optional metadata flags.

**How it works:**
```javascript
// ============================================
// createUserMessage - Factory for user message objects
// Location: chunks.173.mjs:1378-1412
// ============================================

// ORIGINAL (for source lookup):
function p1({
    content: A,
    isMeta: q,
    isVisibleInTranscriptOnly: K,
    isCompactSummary: Y,
    summarizeMetadata: z,
    toolUseResult: _,
    mcpMeta: w,
    uuid: O,
    timestamp: $,
    imagePasteIds: H,
    sourceToolAssistantUUID: j,
    permissionMode: J,
    origin: M
}) {
    return {
        type: "user",
        message: {
            role: "user",
            content: A || wE
        },
        isMeta: q,
        isVisibleInTranscriptOnly: K,
        isCompactSummary: Y,
        summarizeMetadata: z,
        uuid: O || SE(),
        timestamp: $ ?? new Date().toISOString(),
        toolUseResult: _,
        mcpMeta: w,
        imagePasteIds: H,
        sourceToolAssistantUUID: j,
        permissionMode: J,
        origin: M
    }
}

// READABLE (for understanding):
function createUserMessage({
    content,
    isMeta,
    isVisibleInTranscriptOnly,
    isCompactSummary,
    summarizeMetadata,
    toolUseResult,
    mcpMeta,
    uuid,
    timestamp,
    imagePasteIds,
    sourceToolAssistantUUID,
    permissionMode,
    origin
}) {
    return {
        type: "user",
        message: {
            role: "user",
            content: content || EMPTY_CONTENT
        },
        isMeta,                    // If true, hidden from UI but visible to LLM
        isVisibleInTranscriptOnly, // Only visible in transcript, not in chat
        isCompactSummary,          // This message is a compaction summary
        summarizeMetadata,         // Metadata about the summarization
        uuid: uuid || generateUUID(),
        timestamp: timestamp ?? new Date().toISOString(),
        toolUseResult,             // Reference to tool result if this is one
        mcpMeta,                   // MCP-specific metadata
        imagePasteIds,             // IDs of pasted images
        sourceToolAssistantUUID,   // Tool use this references
        permissionMode,            // Permission mode context
        origin                     // Where this message came from
    };
}

// Mapping: p1→createUserMessage, A→content, q→isMeta, K→isVisibleInTranscriptOnly, Y→isCompactSummary
//          z→summarizeMetadata, _→toolUseResult, w→mcpMeta, O→uuid, $→timestamp, H→imagePasteIds
//          j→sourceToolAssistantUUID, J→permissionMode, M→origin, wE→EMPTY_CONTENT, SE→generateUUID
```

**Key flags explained:**

| Flag | Purpose |
|------|---------|
| `isMeta: true` | Hidden from user UI, visible to LLM (system reminders use this) |
| `isVisibleInTranscriptOnly` | Only in transcript export, not chat display |
| `isCompactSummary` | Marks compaction summary messages |
| `origin` | Source tracking (e.g., `{ kind: "task-notification" }`) |

**Key insight:** The `isMeta: true` flag is critical for system reminders. It allows the LLM to see the context while keeping it hidden from the user-facing transcript, preventing visual clutter.

---

### createToolCallMessage (nr6) - Synthetic Tool Call Display

**What it does:** Creates a message showing what tool was called with what parameters (for synthetic tool calls).

**How it works:**
```javascript
// ============================================
// createToolCallMessage - Creates synthetic tool call display message
// Location: chunks.174.mjs:490-495
// ============================================

// ORIGINAL (for source lookup):
function nr6(A, q) {
    return p1({
        content: `Called the ${A} tool with the following input: ${B6(q)}`,
        isMeta: !0
    })
}

// READABLE (for understanding):
function createToolCallMessage(toolName, params) {
    return createUserMessage({
        content: `Called the ${toolName} tool with the following input: ${JSON.stringify(params)}`,
        isMeta: true
    });
}

// Mapping: nr6→createToolCallMessage, A→toolName, q→params, p1→createUserMessage, B6→JSON.stringify
```

**Usage:** Used in `directory` and `file` attachments to show synthetic Bash/Read tool calls.

---

### createToolResultMessage (ir6) - Synthetic Tool Result Display

**What it does:** Creates a message showing the result of a synthetic tool call.

**How it works:**
```javascript
// ============================================
// createToolResultMessage - Creates synthetic tool result display message
// Location: chunks.174.mjs:471-488
// ============================================

// ORIGINAL (for source lookup):
function ir6(A, q) {
    try {
        let K = A.mapToolResultToToolResultBlockParam(q, "1");
        if (Array.isArray(K.content) && K.content.some((Y) => Y.type === "image")) return p1({
            content: K.content,
            isMeta: !0
        });
        return p1({
            content: `Result of calling the ${A.name} tool: ${B6(K.content)}`,
            isMeta: !0
        })
    } catch {
        return p1({
            content: `Result of calling the ${A.name} tool: Error`,
            isMeta: !0
        })
    }
}

// READABLE (for understanding):
function createToolResultMessage(tool, result) {
    try {
        const blockParam = tool.mapToolResultToToolResultBlockParam(result, "1");

        // Handle image content specially (don't stringify binary data)
        if (Array.isArray(blockParam.content) && blockParam.content.some((block) => block.type === "image")) {
            return createUserMessage({
                content: blockParam.content,  // Keep as array for multi-modal
                isMeta: true
            });
        }

        return createUserMessage({
            content: `Result of calling the ${tool.name} tool: ${JSON.stringify(blockParam.content)}`,
            isMeta: true
        });
    } catch {
        return createUserMessage({
            content: `Result of calling the ${tool.name} tool: Error`,
            isMeta: true
        });
    }
}

// Mapping: ir6→createToolResultMessage, A→tool, q→result, K→blockParam, Y→block, p1→createUserMessage, B6→JSON.stringify
```

**Key insight:** The try-catch ensures that even if tool result formatting fails, a fallback message is produced. Image content is handled specially to avoid corrupting binary data with JSON stringification.

---

## Plan Mode Reminder Variants

Plan mode has the most sophisticated reminder system with multiple variants (full, iterative, sparse, subagent).

> **Detailed analysis**: [types_mode_control.md](./types_mode_control.md) - Contains full code, output format, and trigger conditions for all variants

### Variant Selection Flow

```
┌───────────────────────────────────────────────────────────┐
│                   Plan Mode Attachment                      │
│                  { type: "plan_mode", ... }                 │
└───────────────────────────┬───────────────────────────────┘
                            │
                            ↓
                ┌───────────────────────┐
                │   planModeReminderDispatcher│
                │          (Wzz)              │
                └─────────────┬───────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │ isSubAgent?      │ reminderType?    │
           │                  │ = "sparse"?      │
           ↓                  ↓                  ↓
      [subagent (yzz)]   [sparse (Ezz)]    [full (Nzz)]
```

**Token efficiency**: Sparse reminders (~150 tokens) save ~1300 tokens vs. full (~1500 tokens).

**v2.1.76 change**: The `/plan` command now accepts an optional description argument. When provided, the plan attachment includes the description in the `plan_mode` object which is then rendered in the full reminder variant to give the LLM initial task context before exploration begins.

---

## XML Tag Processing

### System Reminder Regex Pattern

**Location:** `chunks.90.mjs:730`

**Pattern:**
```javascript
// ============================================
// SYSTEM_REMINDER_REGEX - Pattern for parsing <system-reminder> tags
// Location: chunks.90.mjs:730
// ============================================

// ORIGINAL (for source lookup):
let EL9 = /<system-reminder>([\s\S]*?)<\/system-reminder>/g;

// READABLE (for understanding):
const SYSTEM_REMINDER_REGEX = /<system-reminder>([\s\S]*?)<\/system-reminder>/g;

// Mapping: EL9→SYSTEM_REMINDER_REGEX
```

**Pattern explanation:**
- `<system-reminder>` - Opening tag (literal)
- `([\s\S]*?)` - Capture group: any character including newlines, non-greedy
- `<\/system-reminder>` - Closing tag (escaped forward slash)
- `g` flag - Global matching (find all occurrences)

**Usage:**
```javascript
// Extract content from system-reminder tags
let content = message.content.match(SYSTEM_REMINDER_REGEX);

// Strip tags to get inner content
let innerContent = message.content.replace(/<system-reminder>|<\/system-reminder>/g, '');
```

---

## Message Construction Patterns

### Pattern A: b5 Wrapping (Most Types)

Used for multi-message attachments (tool call + result).

```
Producer → Ui8 → [
    nr6(toolName, params),    // Tool call message
    ir6(tool, result)          // Tool result message
] → b5() wraps all in XML tags
```

**Example:** `directory` attachment
```javascript
case "directory":
    return b5([
        nr6(BashTool.name, {
            command: `ls ${shellEscape([attachment.path])}`,
            description: `Lists files in ${attachment.path}`
        }),
        ir6(BashTool, {
            stdout: attachment.content,
            stderr: "",
            interrupted: false
        })
    ]);
```

### Pattern B: Inline af Wrapping (Status Types)

Used for single notification messages.

```
Producer → Ui8 → p1({
    content: af("..."),
    isMeta: true
})
```

**Example:** `token_usage` attachment
```javascript
case "token_usage":
    return [p1({
        content: af(`Token usage: ${attachment.used}/${attachment.total}; ${attachment.remaining} remaining`),
        isMeta: true
    })];
```

### Pattern C: Pre-constructed XML (Team Types)

Team types construct XML tags manually in content.

```
Producer → Ui8 → p1({
    content: `<system-reminder>...team content...</system-reminder>`,
    isMeta: true
})
```

**Example:** `team_context` attachment
```javascript
if (attachment.type === "team_context") return [p1({
    content: `<system-reminder>
# Team Coordination

You are a teammate in team "${attachment.teamName}".
...
</system-reminder>`,
    isMeta: true
})];
```

---

## Constants and Configuration

This section documents all configuration constants used by the system reminder attachment system. These constants control timing, throttling, and behavior thresholds.

### Constants Source Location

All constants are defined in a single initialization block at `chunks.147.mjs:1231-1247`:

```javascript
// ============================================
// Constants Initialization Block
// Location: chunks.147.mjs:1231-1247
// ============================================

// ORIGINAL (for source lookup):
CE1 = (gu(), k4(UQ)).BRIEF_TOOL_NAME, IE1 = {
    TURNS_SINCE_WRITE: 10,
    TURNS_BETWEEN_REMINDERS: 10
}, t4q = {
    TURNS_BETWEEN_ATTACHMENTS: 5,
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
}, e4q = {
    TURNS_BETWEEN_ATTACHMENTS: 5,
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
}, YuY = {
    TOKEN_COOLDOWN: 5000
}, zuY = {
    TURNS_BETWEEN_REMINDERS: 10
};
wuY = new Set(["prompt", "task-notification"]);
nT6 = new Set;
bE1 = !1;
hE1 = 200;

// READABLE (for understanding):
BRIEF_TOOL_NAME = getBriefToolName();  // Tool name for brief mode reminders

TODO_REMINDER_CONFIG = {
    TURNS_SINCE_WRITE: 10,         // Min turns since last TodoWrite to trigger reminder
    TURNS_BETWEEN_REMINDERS: 10    // Min turns between reminder attachments
};

PLAN_MODE_CONFIG = {
    TURNS_BETWEEN_ATTACHMENTS: 5,               // Min turns between plan mode attachments
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5        // Every 5th attachment is full (vs sparse)
};

AUTO_MODE_CONFIG = {
    TURNS_BETWEEN_ATTACHMENTS: 5,               // Min turns between auto mode attachments
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5        // Every 5th attachment is full (vs sparse)
};

ULTRAMEMORY_CONFIG = {
    TOKEN_COOLDOWN: 5000            // Min tokens between ultramemory attachments
};

RELEVANT_MEMORIES_CONFIG = {
    TURNS_BETWEEN_REMINDERS: 10    // Min turns between relevant memory reminders
};

QUEUED_COMMAND_MODES = new Set(["prompt", "task-notification"]);
SENT_SKILLS_SET = new Set();        // Tracks which skills have been sent
SKILL_REFRESH_FLAG = false;         // Triggers skill listing refresh
MEMORY_TRUNCATION_LINES = 200;      // Max lines for memory file truncation

// Mapping: CE1→BRIEF_TOOL_NAME, IE1→TODO_REMINDER_CONFIG, t4q→PLAN_MODE_CONFIG, e4q→AUTO_MODE_CONFIG
//          YuY→ULTRAMEMORY_CONFIG, zuY→RELEVANT_MEMORIES_CONFIG, wuY→QUEUED_COMMAND_MODES
//          nT6→SENT_SKILLS_SET, bE1→SKILL_REFRESH_FLAG, hE1→MEMORY_TRUNCATION_LINES
```

---

### Plan Mode Configuration (t4q)

**Symbol:** `t4q` → `PLAN_MODE_CONFIG`

| Property | Value | Purpose |
|----------|-------|---------|
| `TURNS_BETWEEN_ATTACHMENTS` | 5 | Minimum assistant turns between plan mode reminders |
| `FULL_REMINDER_EVERY_N_ATTACHMENTS` | 5 | Frequency of full reminder (vs sparse) |

**How it works:**
1. After a plan_mode attachment, skip reminders for `TURNS_BETWEEN_ATTACHMENTS` turns
2. On each attachment, increment counter and check `(count % FULL_REMINDER_EVERY_N_ATTACHMENTS) === 1`
3. If true, send "full" reminder; otherwise send "sparse" reminder

**Token savings:** Sparse reminders (~150 tokens) save ~1300 tokens vs. full (~1500 tokens).

**Source usage:**
```javascript
// Location: chunks.147.mjs:144
if (j && H < t4q.TURNS_BETWEEN_ATTACHMENTS) return [];

// Location: chunks.147.mjs:160
let $ = (MuY(A ?? []) + 1) % t4q.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
```

---

### Auto Mode Configuration (e4q)

**Symbol:** `e4q` → `AUTO_MODE_CONFIG`

| Property | Value | Purpose |
|----------|-------|---------|
| `TURNS_BETWEEN_ATTACHMENTS` | 5 | Minimum assistant turns between auto mode reminders |
| `FULL_REMINDER_EVERY_N_ATTACHMENTS` | 5 | Frequency of full reminder (vs sparse) |

**Identical to plan mode:** Uses the same throttling and full/sparse pattern.

**Source usage:**
```javascript
// Location: chunks.147.mjs:221
if (O && w < e4q.TURNS_BETWEEN_ATTACHMENTS) return [];

// Location: chunks.147.mjs:225
reminderType: (WuY(A ?? []) + 1) % e4q.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse"
```

---

### Todo/Task Reminder Configuration (IE1)

**Symbol:** `IE1` → `TODO_REMINDER_CONFIG`

| Property | Value | Purpose |
|----------|-------|---------|
| `TURNS_SINCE_WRITE` | 10 | Min turns since last TodoWrite/TaskUpdate to trigger |
| `TURNS_BETWEEN_REMINDERS` | 10 | Min turns between reminder attachments |

**Dual check logic:**
```javascript
// Location: chunks.147.mjs:980
if (K >= IE1.TURNS_SINCE_WRITE && Y >= IE1.TURNS_BETWEEN_REMINDERS) {
    // Trigger reminder
}
```

**Why two conditions:**
- `TURNS_SINCE_WRITE`: Ensures reminder only triggers after user has been "neglecting" todos
- `TURNS_BETWEEN_REMINDERS`: Prevents spamming reminders every turn

---

### Ultramemory Configuration (YuY)

**Symbol:** `YuY` → `ULTRAMEMORY_CONFIG`

| Property | Value | Purpose |
|----------|-------|---------|
| `TOKEN_COOLDOWN` | 5000 | Min assistant tokens between ultramemory attachments |

**Token-based vs turn-based:**
Unlike other configs, ultramemory uses **token count** not turn count. This ensures ultramemory is sent based on actual context consumption, not arbitrary turn boundaries.

**Source usage:**
```javascript
// Location: chunks.147.mjs:786
return q >= YuY.TOKEN_COOLDOWN;
```

---

### Memory Truncation Limit (hE1)

**Symbol:** `hE1` → `MEMORY_TRUNCATION_LINES`

| Value | Purpose |
|-------|---------|
| 200 | Max lines for memory file content in attachments |

**Source usage:**
```javascript
// Location: chunks.147.mjs:566
let M = await h36(j, 0, hE1, void 0, z),  // Read first 200 lines
    D = M.totalLines > hE1,                // Check if truncated
    X = D ? M.content + `

> This memory file was truncated to the first ${hE1} lines...` : M.content;
```

---

### Queued Command Modes (wuY)

**Symbol:** `wuY` → `QUEUED_COMMAND_MODES`

| Value | Purpose |
|-------|---------|
| `Set(["prompt", "task-notification"])` | Modes that trigger queued command attachments |

**Modes explained:**
- `"prompt"`: User typed a message while LLM was working
- `"task-notification"`: Background task completed

**Source usage:**
```javascript
// Location: chunks.147.mjs:50
let q = A.filter((K) => wuY.has(K.mode));
```

---

### MAX_FILE_LINES (Lx6)

**Location:** Referenced throughout file attachment producers

| Value | Purpose |
|-------|---------|
| 2000 | Maximum lines for file content attachments |

**Behavior:** When file exceeds this limit:
1. Content is truncated to first 2000 lines
2. Attachment includes `truncated: true` flag
3. Additional message instructs LLM to use Read tool for more content

**Source usage:**
```javascript
// Location: chunks.174.mjs:66
...A.truncated ? [p1({
    content: `Note: The file ${A.filename} was too large and has been truncated to the first ${Lx6} lines...`
})] : []
```

---

### MAX_PDF_PAGES_PER_REQUEST

| Value | Purpose |
|-------|---------|
| 20 | Maximum PDF pages per read request |

**Source usage:**
```javascript
// Location: chunks.174.mjs:87
content: `PDF file: ${A.filename} (${A.pageCount} pages, ${xq(A.fileSize)}). This PDF is too large to read all at once. You MUST use the ${s7} tool with the pages parameter to read specific page ranges (e.g., pages: "1-5"). Do NOT call ${s7} without the pages parameter or it will fail. Start by reading the first few pages to understand the structure, then read more as needed. Maximum 20 pages per request.`
```

---

## Helper Functions

> Note: Type-related helper functions are analyzed in detail in the corresponding per-type documents.

### countTokensSinceUltramemory (jIY) - Token Cooldown Tracking

> **Detailed analysis**: [types_skills_memory.md](./types_skills_memory.md#ultramemory)

**What it does:** Counts assistant tokens since the last ultramemory attachment.

**Location:** `chunks.142.mjs:2442-2454`

**Key insight:** Returns `null` if no previous ultramemory attachment exists, allowing the caller to determine first-time behavior.

---

### shouldSendUltramemoryAttachment (MIY) - Cooldown Check

> **Detailed analysis**: [types_skills_memory.md](./types_skills_memory.md#ultramemory)

**What it does:** Determines if ultramemory attachment should be sent based on token cooldown.

**Location:** `chunks.142.mjs:2456-2461`

**Key insight:** The cooldown is token-based (5000 tokens), not turn-based.

---

### countUserTurnsSincePlanModeExit (CIY) - Plan Mode Tracking

> **Detailed analysis**: [types_mode_control.md](./types_mode_control.md#plan_mode_exit)

**What it does:** Counts non-meta user messages since exiting plan mode.

**Location:** `chunks.142.mjs:2839-2847`

---

### isPathDisallowed (sW1) - Permission Check

> **Detailed analysis**: [types_file_context.md](./types_file_context.md#trigger-conditions-summary)

**What it does:** Checks if a path is denied read access based on permission rules.

**Location:** `chunks.142.mjs:2853-2855`

**Key insight:** Used by file attachment producers to silently skip sandboxed/denied files without logging errors.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key implementation functions in this document:

### Core Functions (Production → Normalization)
- `assembleAllAttachments` (_uY) - Main orchestrator, `chunks.147.mjs:3-18`
- `timedAttachmentProducer` (Hz) - Telemetry wrapper, `chunks.147.mjs:20-46`
- `normalizeAttachmentForAPI` (Ui8) - Main dispatcher, `chunks.174.mjs:3-469`

### Message Construction
- `createUserMessage` (p1) - User message factory, `chunks.173.mjs:1378-1412`
- `createToolCallMessage` (nr6) - Tool call display, `chunks.174.mjs:490-495`
- `createToolResultMessage` (ir6) - Tool result display, `chunks.174.mjs:471-488`

### XML Wrappers
- `wrapInXmlTag` (af) - XML tag wrapper for strings, `chunks.173.mjs:2490-2494`
- `wrapWithSystemReminderTags` (b5) - Message array wrapper, `chunks.173.mjs:2496-2523`

### Plan/Auto Mode Dispatchers
- `planModeReminderDispatcher` (Wzz) - Variant router, `chunks.173.mjs:2525-2530`
- `fullPlanReminder` (Nzz) - Full instructions, `chunks.173.mjs:2556-2690`
- `sparsePlanReminder` (Ezz) - Abbreviated reminder, `chunks.173.mjs:2692-2699`
- `subAgentPlanReminder` (yzz) - Subagent instructions, `chunks.173.mjs:2701-2712`
- `ultraplanCompleteReminder` (Zzz) - Ultraplan complete, `chunks.173.mjs:2532-2538`
- `autoModeReminder` (Lzz) - Auto mode dispatcher, `chunks.173.mjs:2714-2717`
- `fullAutoModeReminder` (Rzz) - Full auto mode instructions, `chunks.173.mjs:2719-2732`
- `sparseAutoModeReminder` (hzz) - Sparse auto mode reminder, `chunks.173.mjs:2734-2739`

### Producer Functions - User-Dependent (Group 1)
- `extractAtMentionedFiles` (RuY) - @-mentioned files/directories, `chunks.147.mjs:407-448`
- `extractMcpResources` (SuY) - @-mentioned MCP resources, `chunks.147.mjs:464-495`
- `extractAgentMentions` (huY) - @-mentioned agents, `chunks.147.mjs:450-462`

### Producer Functions - Always-Computed (Group 2)
- `getChangedFilesAttachment` (CuY) - Modified files, `chunks.147.mjs:497-539`
- `getNestedMemoryAttachments` (IuY) - CLAUDE.md files, `chunks.147.mjs:541-550`
- `getDynamicSkillAttachments` (BuY) - Skill discovery, `chunks.147.mjs:650+`
- `getSkillListingAttachment` (guY) - Available skills, `chunks.147.mjs:700+`
- `getPlanModeAttachment` (DuY) - Plan mode, `chunks.147.mjs:136-168`
- `getPlanModeExitAttachment` (XuY) - Plan mode exit, `chunks.147.mjs:170-181`
- `getAutoModeAttachment` (ZuY) - Auto mode, `chunks.147.mjs:214-227`
- `getAutoModeExitAttachment` (GuY) - Auto mode exit, `chunks.147.mjs:229-235`
- `getDateChangeAttachment` (fuY) - Date change, `chunks.147.mjs:237-246`
- `getUltrathinkEffortAttachment` (TuY) - Reasoning effort, `chunks.147.mjs:248-254`
- `getDeferredToolsDeltaAttachment` (xE1) - Deferred tools, `chunks.147.mjs:256-267`
- `getMcpInstructionsDeltaAttachment` (uE1) - MCP instructions, `chunks.147.mjs:269-282`
- `getCriticalSystemReminder` (vuY) - Critical reminder, `chunks.147.mjs:284-291`
- `getTodoReminders` (ruY) - Todo reminders, `chunks.147.mjs:972+`
- `getQueuedCommandsAttachment` (OuY) - Queued commands, `chunks.147.mjs:48-68`

### Producer Functions - Main-Agent-Only (Group 3)
- `getIdeSelectionAttachment` (kuY) - IDE selection, `chunks.147.mjs:306-320`
- `getIdeOpenedFileAttachment` (LuY) - IDE opened file, `chunks.147.mjs:397-405`
- `getOutputStyleAttachment` (NuY) - Output style, `chunks.147.mjs:293-300`
- `getDiagnosticsAttachment` (cuY) - LSP diagnostics, `chunks.147.mjs:789+`
- `getLspDiagnosticsAttachment` (luY) - LSP diagnostics, `chunks.147.mjs:800+`

### Helper Functions
- `SYSTEM_REMINDER_REGEX` (EL9) - XML parsing pattern, `chunks.90.mjs:730`
- `countTokensSinceUltramemory` (jIY) - Token cooldown tracking, `chunks.142.mjs:2442-2454`
- `shouldSendUltramemoryAttachment` (MIY) - Cooldown check, `chunks.142.mjs:2456-2461`
- `countUserTurnsSincePlanModeExit` (CIY) - Plan mode tracking, `chunks.142.mjs:2839-2847`
- `isPathDisallowed` (sW1) - Permission check, `chunks.142.mjs:2853-2855`
- `isTeamMode` (E7) - Team mode check, `chunks.50.mjs:2543`
- `getMailboxFormatter` (Kzz) - Mailbox message formatter

---

## Source Locations

- `chunks.174.mjs:3-469` - Core normalization functions (normalizeAttachmentForAPI)
- `chunks.147.mjs:3-18` - Attachment orchestrator (assembleAllAttachments)
- `chunks.147.mjs:20-550` - Attachment producer functions
- `chunks.173.mjs:1378-1412` - User message construction (createUserMessage)
- `chunks.173.mjs:2490-2740` - XML wrappers, plan/auto mode reminders
- `chunks.90.mjs:730` - Regex patterns

---

## Related Documents

### Core Documentation
- [overview.md](./overview.md) - System reminder architecture overview
- [reminder_types.md](./reminder_types.md) - Complete catalog of reminder types
- [attachment_producers.md](./attachment_producers.md) - Producer function analysis
- [integration_points.md](./integration_points.md) - Cross-module integration
- [ui_linkage.md](./ui_linkage.md) - UI visibility and API pipeline
- [edge_cases_and_failures.md](./edge_cases_and_failures.md) - Error handling
- [performance_and_telemetry.md](./performance_and_telemetry.md) - Performance analysis

### Per-Type Analysis Documents
- [types_team_mode.md](./types_team_mode.md) - Team/Swarm types
- [types_file_context.md](./types_file_context.md) - File/Directory types
- [types_ide_integration.md](./types_ide_integration.md) - IDE integration types
- [types_task_management.md](./types_task_management.md) - Todo/Task types
- [types_mode_control.md](./types_mode_control.md) - Plan/Delegate mode types
- [types_skills_memory.md](./types_skills_memory.md) - Skills/Memory types
- [types_hooks.md](./types_hooks.md) - Hook types
- [types_status_budget.md](./types_status_budget.md) - Status/Budget types
- [types_silent.md](./types_silent.md) - Silent types
- [quick_reference.md](./quick_reference.md) - Quick lookup index
