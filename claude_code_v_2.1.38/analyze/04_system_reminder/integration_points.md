# System Reminder Integration Points

## Overview

System reminders are deeply integrated with nearly every major subsystem in Claude Code. This document provides a comprehensive analysis of how attachment production, normalization, and injection integrate with other modules to create a cohesive meta-messaging system.

The integration architecture follows a **publish-subscribe pattern**: various subsystems (IDE, LSP, hooks, etc.) publish events/state into registries, and attachment producers **subscribe** by polling these registries on each agent turn.

---

## Integration Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLAUDE CODE AGENT LOOP                        │
│                    (Module 01: Agent Execution)                   │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                   ATTACHMENT PRODUCTION                           │
│                    (phY - assembleAttachments)                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  User-Dependent Producers                                 │   │
│  │  • @-mentions → File Read (Module 05: Tools)              │   │
│  │  • MCP resources → MCP Client (Module 23: MCP Protocol)   │   │
│  │  • Agent mentions → Agent Registry (Module 03: Agents)    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            │                                      │
│                            ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Always-Computed Producers                                │   │
│  │  • Plan mode → Mode State (Module 11: Plan Mode)          │   │
│  │  • Todo reminders → Todo File (Module 12: Todo)           │   │
│  │  • Task reminders → Task Registry (Module 13: Tasks)      │   │
│  │  • Changed files → Read File State Cache                  │   │
│  │  • Skills → Skill Registry (Module 22: Skills)            │   │
│  │  • Team context → Team State (Module 30: Swarm)           │   │
│  │  • Hooks → Hook Response Registry (Module 21: Hooks)      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            │                                      │
│                            ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Main-Agent-Only Producers                                │   │
│  │  • IDE selection → MCP Client Context                     │   │
│  │  • Diagnostics → Diagnostic Registry (Module 25: LSP)     │   │
│  │  • Token usage → Message History + Model Config          │   │
│  │  • Queued commands → Command Queue (Module 09: CLI)       │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            ↓ (Array of attachment objects)
┌─────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT NORMALIZATION                       │
│                      (K2z - normalizeAttachmentForAPI)            │
│                                                                   │
│  • Converts 57 attachment types to message format                │
│  • Wraps content in <system-reminder> tags (_9)                  │
│  • Dispatches to type-specific formatters (plan mode, etc.)     │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            ↓ (Array of TenguMessage objects)
┌─────────────────────────────────────────────────────────────────┐
│                     MESSAGE STREAM INJECTION                      │
│                    (bG1 - buildContextMessages)                   │
│                                                                   │
│  • Inserts normalized attachments into message array             │
│  • Positions attachments before user messages in API calls       │
│  • Integrates with system prompt building                        │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            ↓ (To LLM API)
┌─────────────────────────────────────────────────────────────────┐
│                        LLM API CALL                               │
│                    (Module 02: LLM API Integration)               │
│                                                                   │
│  • System prompt + Messages + Attachments → Claude API           │
│  • LLM processes meta-messages alongside user/assistant turns    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Module Integration Details

### Integration 1: Agent Loop (Module 01)

**File**: `chunks.148.mjs` (agent loop orchestration)

**Integration point**: `bG1` (buildContextMessages) calls `oP1` (attachment generator) during message preparation.

**Data flow**:
1. Agent loop prepares to call LLM API
2. Calls `bG1` to build full message context
3. `bG1` invokes `oP1` (attachment generator):
   ```javascript
   async function* oP1(A, q, K, Y, z, w) {
       let H = await phY(A, q, K, Y, z, w);
       if (H.length === 0) return;
       c("tengu_attachments", {
           attachment_types: H.map(($) => $.type)
       });
       for (let $ of H) yield kq($)
   }
   ```
4. Attachments are wrapped in message objects and inserted into message array
5. Message array sent to LLM API

**Key insight**: Attachments are generated **lazily** via async generator, allowing early termination if agent loop is cancelled.

**Code location**: `chunks.142.mjs:2494-2501` (oP1 generator), `chunks.148.mjs:2414-2428` (bG1 context builder)

---

### Integration 2: Plan Mode (Module 11)

**Files**:
- Plan mode state: `chunks.142.mjs:2034-2090` (plan mode attachment producers)
- Plan mode reminders: `chunks.173.mjs:525-696` (plan mode instruction formatters)

**Integration points**:
1. **Mode detection**: `ihY` (getPlanModeAttachment) checks `toolPermissionContext.mode === "plan"`
2. **Reentry detection**: Tracks whether user exited and re-entered plan mode via global flag
3. **Variant selection**: Chooses full/sparse/iterative/subagent variant based on context
4. **File path provision**: Provides plan file path to LLM for Read/Edit operations

**Data flow**:
```
User enters plan mode (/plan command)
    ↓
CLI sets toolPermissionContext.mode = "plan"
    ↓
ihY (getPlanModeAttachment) detects plan mode on next turn
    ↓
Counts previous plan reminders (lhY) to determine full vs sparse
    ↓
Creates plan_mode attachment with reminderType + planFilePath
    ↓
K2z (normalizeAttachmentForAPI) dispatches to azz (planModeReminderDispatcher)
    ↓
azz selects variant:
    • isSubAgent → q2z (subagent variant - brief, no plan file editing)
    • reminderType === "sparse" → A2z (sparse variant - short reminder)
    • iterative mode enabled → ezz (iterative variant - pair-planning workflow)
    • default → szz (full variant - 5-phase workflow)
    ↓
Variant formatter generates instructions + plan file path
    ↓
Wrapped in <system-reminder> tags and injected as meta-message
```

**Plan mode variant dispatcher**:

```javascript
// ============================================
// planModeReminderDispatcher - Select plan mode instruction variant
// Location: chunks.173.mjs:525-529
// ============================================

// ORIGINAL (for source lookup):
function azz(A) {
    if (A.isSubAgent) return q2z(A);
    if (A.reminderType === "sparse") return A2z(A);
    return szz(A)
}

// READABLE (for understanding):
function planModeReminderDispatcher(planModeAttachment) {
    // Subagents get simplified instructions (no plan file editing)
    if (planModeAttachment.isSubAgent) {
        return formatSubagentPlanReminder(planModeAttachment);
    }

    // Sparse reminders (sent most turns after initial)
    if (planModeAttachment.reminderType === "sparse") {
        return formatSparsePlanReminder(planModeAttachment);
    }

    // Full reminders (first reminder + every Nth thereafter)
    // Check if iterative mode is enabled
    return formatFullPlanReminder(planModeAttachment);
}

// Mapping: azz→planModeReminderDispatcher, A→planModeAttachment, q2z→formatSubagentPlanReminder, A2z→formatSparsePlanReminder, szz→formatFullPlanReminder
```

**Full reminder example** (`szz`):
- 5-phase workflow (Initial Understanding → Design → Review → Final Plan → ExitPlanMode)
- Instructs use of Explore agents for code exploration
- Instructs use of Plan agents for design proposals
- Provides plan file path and Edit/Write tool names
- Iterative variant (`ezz`) uses pair-planning workflow instead

**Sparse reminder example** (`A2z`):
- Brief reminder that plan mode is still active
- References earlier full instructions
- Reminds of plan file path and tool restrictions

**Key insight**: Plan mode integration uses **frequency-based instruction modulation** - full instructions on first reminder, sparse reminders thereafter to reduce token consumption while maintaining context.

---

### Integration 3: Auto-Compaction (Module 07)

**Files**:
- Compaction logic: `chunks.107.mjs` (compaction implementation)
- Meta message handling: Attachment normalization with `isMeta: true` flag

**Integration points**:
1. **Meta message detection**: Compaction logic checks `isMeta` flag to identify system reminders
2. **Retention rules**: System reminders have special handling during compaction:
   - Recent reminders (last N turns) always kept
   - Plan mode attachments retained if plan mode is active
   - Critical system reminders always retained
   - Other meta-messages can be summarized/discarded
3. **Reattachment after compaction**: Some attachments (e.g., plan mode) may be re-injected after compaction

**Data flow**:
```
Token limit approaching (80% threshold)
    ↓
Compaction triggered (sI2 - autoCompactDispatcher)
    ↓
Compaction algorithm analyzes message history
    ↓
Messages categorized:
    • User/Assistant messages → candidate for summarization
    • Meta-messages (isMeta: true) → special retention rules
    ↓
System reminders retained based on:
    • Recency (last N turns always kept)
    • Type (plan_mode if active, critical reminders)
    • Relevance (attachments related to in-progress work)
    ↓
Summarization performed (older messages compressed)
    ↓
Compacted history + retained meta-messages → new message array
```

**Meta message flag propagation**:

```javascript
// ============================================
// createUserMessage - Message factory with isMeta flag
// Location: chunks.172.mjs:2876-2912
// ============================================

// ORIGINAL (for source lookup):
function c6({
    content: A,
    isMeta: q,
    isVisibleInTranscriptOnly: K,
    isCompactSummary: Y,
    summarizeMetadata: z,
    toolUseResult: w,
    mcpMeta: H,
    uuid: $,
    thinkingMetadata: O,
    timestamp: _,
    todos: J,
    imagePasteIds: X,
    sourceToolAssistantUUID: D,
    permissionMode: j
}) {
    return {
        type: "user",
        message: {
            role: "user",
            content: A || iv
        },
        isMeta: q,
        isVisibleInTranscriptOnly: K,
        isCompactSummary: Y,
        summarizeMetadata: z,
        uuid: $ ?? _f(),
        timestamp: _ ?? new Date().toISOString(),
        toolUseResult: w,
        mcpMeta: H,
        thinkingMetadata: O,
        todos: J,
        imagePasteIds: X,
        sourceToolAssistantUUID: D,
        permissionMode: j
    }
}

// READABLE (for understanding):
function createUserMessage({
    content,
    isMeta, // <-- FLAG FOR SYSTEM REMINDERS
    isVisibleInTranscriptOnly,
    isCompactSummary,
    summarizeMetadata,
    toolUseResult,
    mcpMeta,
    uuid,
    thinkingMetadata,
    timestamp,
    todos,
    imagePasteIds,
    sourceToolAssistantUUID,
    permissionMode
}) {
    return {
        type: "user",
        message: {
            role: "user",
            content: content || DEFAULT_EMPTY_CONTENT
        },
        isMeta: isMeta, // <-- Marks this as meta-message for compaction
        isVisibleInTranscriptOnly: isVisibleInTranscriptOnly,
        isCompactSummary: isCompactSummary,
        summarizeMetadata: summarizeMetadata,
        uuid: uuid ?? generateUuid(),
        timestamp: timestamp ?? new Date().toISOString(),
        toolUseResult: toolUseResult,
        mcpMeta: mcpMeta,
        thinkingMetadata: thinkingMetadata,
        todos: todos,
        imagePasteIds: imagePasteIds,
        sourceToolAssistantUUID: sourceToolAssistantUUID,
        permissionMode: permissionMode
    };
}

// Mapping: c6→createUserMessage, A→content, q→isMeta, K→isVisibleInTranscriptOnly, Y→isCompactSummary, z→summarizeMetadata, w→toolUseResult, H→mcpMeta, $→uuid, O→thinkingMetadata, _→timestamp, J→todos, X→imagePasteIds, D→sourceToolAssistantUUID, j→permissionMode, iv→DEFAULT_EMPTY_CONTENT, _f()→generateUuid
```

**Key insight**: The `isMeta: true` flag is the **integration contract** between system reminders and compaction. Compaction respects this flag to avoid discarding important meta-context.

---

### Integration 4: Hooks System (Module 21)

**Files**:
- Hook response registry: Global async storage for hook results
- Hook response producer: `chunks.142.mjs:2758-2789` (EIY - getAsyncHookResponsesAttachment)

**Integration points**:
1. **Hook execution**: When hooks run (SessionStart, ToolCall, etc.), results stored in global registry
2. **Registry polling**: `EIY` producer fetches pending responses on each agent turn
3. **Delivery and cleanup**: After delivering responses as attachments, clears them from registry
4. **Response structure**: Includes stdout, stderr, exitCode, and structured response object

**Data flow**:
```
Hook triggered (e.g., ToolCall event)
    ↓
Hook script executes (may run async in background)
    ↓
Hook completes → result stored in global registry:
    {
        processId: "hook-123",
        hookName: "pre-commit",
        hookEvent: "ToolCall",
        toolName: "Bash",
        response: {
            systemMessage: "...",
            hookSpecificOutput: {...}
        },
        stdout: "...",
        stderr: "...",
        exitCode: 0
    }
    ↓
Next agent turn: EIY (getAsyncHookResponsesAttachment) called
    ↓
Fetches all pending responses from registry
    ↓
Converts each to async_hook_response attachment
    ↓
Clears delivered responses from registry (avoid duplication)
    ↓
K2z (normalizeAttachmentForAPI) formats hook response:
    • systemMessage → system-reminder message
    • hookSpecificOutput.additionalContext → additional message
    ↓
Hook output visible to LLM in conversation
```

**Hook response attachment format**:

```javascript
{
    type: "async_hook_response",
    processId: "hook-123",
    hookName: "pre-commit",
    hookEvent: "ToolCall",
    toolName: "Bash",
    response: {
        systemMessage: "Pre-commit hook blocked: ESLint errors found",
        hookSpecificOutput: {
            additionalContext: "Run 'npm run lint:fix' to auto-fix"
        }
    },
    stdout: "[ESLint output]",
    stderr: "",
    exitCode: 1
}
```

**Key insight**: Hooks integrate via **asynchronous message passing** - hooks run independently, results accumulate in registry, and attachment producer drains registry on each turn. This decouples hook execution from agent loop timing.

---

### Integration 5: Todo System (Module 12) & Task System (Module 13)

**Files**:
- Todo producer: `chunks.142.mjs:2645-2661` (fIY - getTodoReminderAttachment)
- Task producer: `chunks.142.mjs:2684-2701` (NIY - getTaskReminderAttachment)
- Task status producer: `chunks.142.mjs:2719-2756` (vIY - getUnifiedTasksAttachment)

**Integration points**:

#### Todo System
1. **Tool availability check**: Only produces reminder if TodoWrite tool is available
2. **Usage frequency analysis**: Counts turns since last TodoWrite usage
3. **Reminder throttling**: Only reminds every N turns to avoid spam
4. **File watch integration**: Changed file detection also watches todo file

**Todo reminder flow**:
```
LLM hasn't used TodoWrite for N turns
    AND
Last todo reminder was M turns ago
    ↓
fIY (getTodoReminderAttachment) produces reminder
    ↓
Reminder includes:
    • Current todo list contents (parsed from todo file)
    • Item count
    • Gentle suggestion to use TodoWrite if applicable
    ↓
K2z formats as system-reminder message
    ↓
LLM receives reminder (but instructed not to mention it to user)
```

#### Task System
1. **Feature flag check**: Task system is conditional on `jH()` (isTasksEnabled)
2. **Unified status updates**: `vIY` provides task status changes (pending→in_progress→completed)
3. **Task progress messages**: Background tasks can send progress updates delivered as attachments
4. **State synchronization**: Updates app state with latest task status after delivery

**Task status flow**:
```
Task state changes (e.g., agent marks task as in_progress)
    ↓
Task state stored in appState.tasks registry
    ↓
vIY (getUnifiedTasksAttachment) fetches task status changes
    ↓
Generates two attachment types:
    1. task_status: Status transitions (pending→in_progress, etc.)
    2. task_progress: Progress messages from background tasks
    ↓
Task progress attachments throttled (only send every N turns)
    ↓
After delivery, marks tasks as "notified" in state
    ↓
K2z formats as system-reminder with task ID and status
    ↓
LLM receives update and can check TaskOutput for details
```

**Key insight**: Todo and task systems use **gentle reminder strategy** - they don't force LLM to use these tools, just periodically suggest them when usage patterns indicate they might be helpful. The "don't mention to user" instruction prevents reminder fatigue.

---

### Integration 6: MCP Protocol (Module 23)

**Files**:
- MCP resource producer: `chunks.142.mjs:2252-2283` (zIY - extractMcpResources)
- MCP resource formatter: `chunks.173.mjs:1000-1034` (K2z case: mcp_resource)

**Integration points**:
1. **Client connection state**: Checks if MCP server is connected before fetching
2. **Resource metadata**: Uses server's resource list for name/description enrichment
3. **Content fetching**: Calls MCP client's `readResource` method
4. **Content type handling**: Supports text and blob (binary) contents

**MCP resource flow**:
```
User types: @github:repo/owner/file.txt
    ↓
zIY (extractMcpResources) parses @server:uri syntax
    ↓
Finds "github" MCP client in mcpClients list
    ↓
Validates client is connected (client.type === "connected")
    ↓
Looks up resource metadata from mcpResources["github"]
    ↓
Calls client.client.readResource({ uri: "repo/owner/file.txt" })
    ↓
MCP server returns resource contents (text or blob)
    ↓
Creates mcp_resource attachment with:
    • server name
    • uri
    • name (from metadata or uri)
    • description (from metadata)
    • content (ReadResourceResult object)
    ↓
K2z (normalizeAttachmentForAPI) formats contents:
    • Text content → Includes full text
    • Blob content → Shows "[Binary content: mime/type]"
    • Warns LLM not to re-read unless content may have changed
    ↓
LLM receives resource contents in conversation
```

**MCP attachment format**:

```javascript
{
    type: "mcp_resource",
    server: "github",
    uri: "repo/owner/file.txt",
    name: "file.txt",
    description: "Source file from GitHub repo",
    content: {
        contents: [
            {
                uri: "repo/owner/file.txt",
                mimeType: "text/plain",
                text: "... file contents ..."
            }
        ]
    }
}
```

**Key insight**: MCP integration enables **external knowledge injection** - servers can provide resources (files, database queries, API responses) that get seamlessly injected into conversation context via @-mentions.

---

### Integration 7: LSP Integration (Module 25)

**Files**:
- LSP diagnostic registry: Global storage for LSP diagnostics
- LSP diagnostic producer: `chunks.142.mjs:2473-2492` (WIY - getLspDiagnosticsAttachment)
- IDE diagnostic producer: `chunks.142.mjs:2463-2471` (PIY - getDiagnosticsAttachment)

**Integration points**:
1. **Diagnostic accumulation**: LSP clients push diagnostics to global registry as they arrive
2. **Pull-based delivery**: `WIY` fetches all pending diagnostics on each agent turn
3. **Deduplication**: After delivery, clears diagnostics from registry
4. **Format normalization**: Converts LSP diagnostic format to unified format

**LSP diagnostic flow**:
```
LSP client receives textDocument/publishDiagnostics notification
    ↓
Diagnostic stored in global LSP diagnostic registry:
    {
        files: [
            {
                path: "/path/to/file.ts",
                diagnostics: [
                    {
                        severity: "error",
                        message: "Type 'string' not assignable to 'number'",
                        line: 42,
                        column: 10,
                        source: "typescript"
                    }
                ]
            }
        ]
    }
    ↓
Next agent turn: WIY (getLspDiagnosticsAttachment) called
    ↓
Fetches pending diagnostics from registry (sm4 - getPendingLspDiagnostics)
    ↓
Converts to diagnostic attachments with isNew: true flag
    ↓
Clears delivered diagnostics from registry (tm4 - clearDeliveredLspDiagnostics)
    ↓
K2z (normalizeAttachmentForAPI) formats diagnostics:
    • Calls KI.formatDiagnosticsSummary to generate human-readable summary
    • Wraps in <new-diagnostics> tags
    ↓
LLM receives diagnostic notification in conversation
```

**Diagnostic summary format** (example):

```
<new-diagnostics>The following new diagnostic issues were detected:

src/app.ts:
  • Line 42: [error] Type 'string' is not assignable to type 'number' (typescript)
  • Line 55: [warning] Unused variable 'foo' (eslint)

src/utils.ts:
  • Line 10: [error] Cannot find module 'invalid-package' (typescript)
</new-diagnostics>
```

**Key insight**: LSP integration provides **real-time error awareness** - as the user edits files in their IDE, diagnostics flow into Claude Code's context, enabling proactive error correction without explicit user notification.

---

### Integration 8: IDE Integration (Module 26)

**Files**:
- IDE selection producer: `chunks.142.mjs:2114-2127` (ehY - getIdeSelectionAttachment)
- IDE opened file producer: `chunks.142.mjs:2189-2197` (qIY - getIdeOpenedFileAttachment)

**Integration points**:
1. **MCP client detection**: Determines IDE name from connected MCP clients
2. **Selection context**: Receives selection info (file path, line range, text) from IDE
3. **Nested memory**: Opened file producer also triggers nested memory loading
4. **Sandbox awareness**: Checks if file is sandboxed before including

**IDE selection flow**:
```
User selects text in VS Code/Cursor
    ↓
IDE sends selection context to Claude Code via MCP:
    {
        filePath: "/path/to/file.ts",
        lineStart: 10,
        lineCount: 5,
        text: "... selected text ..."
    }
    ↓
Next agent turn: ehY (getIdeSelectionAttachment) called
    ↓
Validates selection has required fields
    ↓
Checks if file is sandboxed (skip if true)
    ↓
Creates selected_lines_in_ide attachment:
    {
        type: "selected_lines_in_ide",
        ideName: "VS Code",
        lineStart: 10,
        lineEnd: 14,
        filename: "/path/to/file.ts",
        content: "... selected text ..."
    }
    ↓
K2z (normalizeAttachmentForAPI) formats as meta-message:
    "The user selected lines 10 to 14 from /path/to/file.ts:
    [text]

    This may or may not be related to the current task."
    ↓
LLM receives selection context (can reference in responses)
```

**IDE opened file flow**:
```
User opens file in IDE (without selecting text)
    ↓
IDE sends opened file context:
    {
        filePath: "/path/to/file.ts",
        text: null  // <-- No selection
    }
    ↓
Next agent turn: qIY (getIdeOpenedFileAttachment) called
    ↓
Triggers nested memory loading (ri4 - loadNestedMemory):
    • Looks for MEMORY.md in same directory
    • Looks for MEMORY.md in parent directories up to project root
    • Looks for MEMORY.md in nested subdirectories
    ↓
Creates opened_file_in_ide attachment + nested memory attachments
    ↓
K2z formats as brief notification:
    "The user opened the file /path/to/file.ts in the IDE. This may or may not be related to the current task."
    ↓
LLM aware of file context (may be hint to work on that file)
```

**Key insight**: IDE integration provides **implicit context awareness** - the LLM can infer user intent from IDE actions (selections, opened files) without explicit user instructions.

---

### Integration 9: System Prompt Building (Module 02)

**Files**:
- System prompt builder: `chunks.169.mjs:225-248` (dZ - buildSystemPrompt)
- Reminder metadata: `chunks.169.mjs:107-110` (T9z - getSystemReminderMetadata)

**Integration points**:
1. **Reminder explanation**: System prompt includes explanation of `<system-reminder>` tags
2. **Tool usage policy**: References system-reminder tags in tool usage instructions
3. **Compaction awareness**: System prompt mentions unlimited context via auto-summarization

**System prompt integration**:

```javascript
// ============================================
// getSystemReminderMetadata - Explain system-reminder tags in system prompt
// Location: chunks.169.mjs:107-110
// ============================================

// ORIGINAL (for source lookup):
function T9z() {
    return `- Tool results and user messages may include <system-reminder> tags. <system-reminder> tags contain useful information and reminders. They are automatically added by the system, and bear no direct relation to the specific tool results or user messages in which they appear.
- The conversation has unlimited context through automatic summarization.`
}

// READABLE (for understanding):
function getSystemReminderMetadata() {
    return `- Tool results and user messages may include <system-reminder> tags. <system-reminder> tags contain useful information and reminders. They are automatically added by the system, and bear no direct relation to the specific tool results or user messages in which they appear.
- The conversation has unlimited context through automatic summarization.`;
}

// Mapping: T9z→getSystemReminderMetadata
```

**Key behavior**: This system prompt instruction is critical for LLM to understand:
1. System reminders can appear in tool results or user messages (not just standalone)
2. They're automatically injected (LLM shouldn't mention them unless relevant)
3. They bear no relation to the specific message they appear in (avoid false associations)

**Example of reminder appearing in tool result**:

```
[Tool: Read]
Result: ... file contents ...

<system-reminder>
The user opened file xyz.ts in the IDE. This may or may not be related to the current task.
</system-reminder>
```

The LLM understands the reminder is separate from the Read result, despite appearing in the same message.

---

### Integration 10: Swarm/Team Mode (Module 30)

**Files**:
- Team context producer: `chunks.142.mjs:2796-2813` (LIY - getTeamContextAttachment)
- Teammate mailbox producer: `chunks.142.mjs:2791-2794` (kIY - getTeammateMailboxAttachment)

**Integration points**:
1. **Team identity**: Provides agent's name and team name
2. **Resource paths**: Provides paths to team config and task list files
3. **Mailbox delivery**: Delivers messages from teammates
4. **Conditional execution**: Only runs when in team/swarm mode (`l8()` check)

**Team context flow**:
```
Agent spawned in team mode
    ↓
LIY (getTeamContextAttachment) produces team context attachment
    ↓
Attachment includes:
    • agentId: "analyzer-agent"
    • agentName: "analyzer"
    • teamName: "code-review-team"
    • teamConfigPath: "~/.claude/teams/code-review-team/config.json"
    • taskListPath: "~/.claude/tasks/code-review-team/"
    ↓
K2z (normalizeAttachmentForAPI) formats as detailed instructions:
    "You are a teammate in team 'code-review-team'.

    Your Identity:
    - Name: analyzer

    Team Resources:
    - Team config: [path]
    - Task list: [path]

    Team Leader: The team lead's name is 'team-lead'. Send updates to them.

    [Instructions for using TeammateTool with agent names...]"
    ↓
LLM understands its role in team and can coordinate via TeammateTool
```

**Teammate mailbox flow**:
```
Another agent sends message via TeammateTool:
    {
        operation: "write",
        target_agent_id: "analyzer",
        value: "Please review src/app.ts"
    }
    ↓
Message stored in mailbox for "analyzer" agent
    ↓
Next turn for analyzer agent: kIY (getTeammateMailboxAttachment) called
    ↓
Fetches pending messages from mailbox
    ↓
Creates teammate_mailbox attachment with messages array
    ↓
K2z formats messages with sender identification and timestamps
    ↓
Analyzer agent receives message in conversation context
```

**Key insight**: Team mode integration enables **multi-agent coordination** - agents communicate asynchronously via mailbox, and team context attachment establishes identity and communication patterns.

---

## Cross-Module Data Flow Example

Let's trace a complete flow from user action to LLM awareness:

### Example: User selects code in VS Code, then sends message

```
┌──────────────────────────────────────────────────────────────┐
│ USER ACTION: Selects lines 10-20 in file.ts in VS Code       │
└───────────┬──────────────────────────────────────────────────┘
            │
            ↓
┌──────────────────────────────────────────────────────────────┐
│ IDE MCP CLIENT: Sends selection context to Claude Code       │
│   {                                                           │
│     filePath: "/project/file.ts",                            │
│     lineStart: 10,                                           │
│     lineCount: 11,                                           │
│     text: "... selected code ..."                           │
│   }                                                           │
└───────────┬──────────────────────────────────────────────────┘
            │
            ↓ (Stored in IDE context object)
┌──────────────────────────────────────────────────────────────┐
│ USER ACTION: Sends message "Fix the bug in this function"    │
└───────────┬──────────────────────────────────────────────────┘
            │
            ↓
┌──────────────────────────────────────────────────────────────┐
│ AGENT LOOP: Prepares to call LLM API                         │
│   • Builds message array with user message                   │
│   • Calls bG1 (buildContextMessages) for full context        │
└───────────┬──────────────────────────────────────────────────┘
            │
            ↓
┌──────────────────────────────────────────────────────────────┐
│ ATTACHMENT PRODUCTION: phY (assembleAttachments) executes    │
│   • Group 1 (user-dependent): No @-mentions, returns []      │
│   • Group 2 (always-computed): Checks plan mode, todos, etc. │
│   • Group 3 (main-agent-only): ehY runs...                   │
│                                                               │
│   ehY (getIdeSelectionAttachment):                           │
│     • Sees IDE context has selection                         │
│     • Validates file not sandboxed                           │
│     • Creates selected_lines_in_ide attachment               │
│     • Returns [{type: "selected_lines_in_ide", ...}]         │
└───────────┬──────────────────────────────────────────────────┘
            │
            ↓
┌──────────────────────────────────────────────────────────────┐
│ ATTACHMENT NORMALIZATION: K2z (normalizeAttachmentForAPI)    │
│   • Receives selected_lines_in_ide attachment                │
│   • Formats as system-reminder message:                      │
│     "The user selected lines 10 to 20 from /project/file.ts: │
│     [code snippet]                                           │
│                                                               │
│     This may or may not be related to the current task."    │
└───────────┬──────────────────────────────────────────────────┘
            │
            ↓
┌──────────────────────────────────────────────────────────────┐
│ MESSAGE ARRAY ASSEMBLY:                                       │
│   [                                                           │
│     {type: "system", content: "You are Claude Code..."},     │
│     {type: "user", content: "Fix the bug...", isMeta: false},│
│     {type: "user", content: "The user selected...", isMeta: true} │
│   ]                                                           │
└───────────┬──────────────────────────────────────────────────┘
            │
            ↓
┌──────────────────────────────────────────────────────────────┐
│ LLM API CALL: Sends messages to Claude API                   │
└───────────┬──────────────────────────────────────────────────┘
            │
            ↓
┌──────────────────────────────────────────────────────────────┐
│ LLM PROCESSING:                                               │
│   • Sees user message: "Fix the bug in this function"        │
│   • Sees system reminder: "The user selected lines 10-20..." │
│   • Infers: Bug is in the selected code                      │
│   • Generates response referencing selected code             │
└──────────────────────────────────────────────────────────────┘
```

**Key observations**:
1. Selection happened **before** user message sent
2. Selection context stored in IDE context object (persists across turns)
3. Attachment production pulls from IDE context on every turn
4. Selection delivered as meta-message alongside user message
5. LLM can correlate user message with selection context

---

## Integration Patterns

### Pattern 1: Registry-Based Integration (Pull Model)

**Used by**: LSP diagnostics, hook responses, task status

**How it works**:
1. External system pushes events/state to global registry
2. Attachment producer polls registry on each agent turn
3. Producer converts registry entries to attachments
4. Producer clears delivered entries (deduplication)

**Advantages**:
- Decouples event timing from agent loop
- Handles async events naturally
- Simple deduplication logic

**Disadvantages**:
- Polling introduces latency (diagnostics delivered on next turn, not immediately)
- Memory overhead if registry grows unbounded

### Pattern 2: Context-Based Integration (Push Model)

**Used by**: IDE selection, opened file, mode state

**How it works**:
1. External system updates shared context object
2. Attachment producer reads from context on each turn
3. No cleanup needed (context is stateless snapshot)

**Advantages**:
- No memory accumulation
- Always reflects current state
- Simple implementation

**Disadvantages**:
- Can't track history (only current state)
- May produce duplicate attachments if state unchanged

### Pattern 3: File-Based Integration

**Used by**: Todo system, plan mode, team config

**How it works**:
1. System state persisted to files (e.g., `todo.md`, `plan.md`)
2. Attachment producer reads files on each turn
3. File watches detect changes (via mtime comparison)

**Advantages**:
- State survives restarts
- User can manually edit files
- Transparent to debugging (files visible in filesystem)

**Disadvantages**:
- Disk I/O overhead
- Race conditions if files modified during reads

### Pattern 4: Frequency-Throttled Integration

**Used by**: Plan mode reminders, todo reminders, task reminders

**How it works**:
1. Producer tracks message history to count turns since last reminder
2. Only produces attachment every N turns
3. May alternate between full and sparse variants

**Advantages**:
- Reduces token consumption
- Avoids reminder fatigue
- Maintains context without spam

**Disadvantages**:
- Complexity in turn counting logic
- Requires message history analysis

---

## Symbol Reference

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key integration functions in this document:
- `buildContextMessages` (bG1) - Context building with attachment integration
- `planModeReminderDispatcher` (azz) - Select plan mode instruction variant
- `formatFullPlanReminder` (szz) - Full 5-phase plan mode instructions
- `formatSparsePlanReminder` (A2z) - Brief plan mode reminder
- `formatSubagentPlanReminder` (q2z) - Subagent plan mode instructions
- `createUserMessage` (c6) - Message factory with isMeta flag
- `getSystemReminderMetadata` (T9z) - Explain system-reminder tags
- `getTeamContextAttachment` (LIY) - Provide team identity and resources

---

## Related Documents

- [overview.md](./overview.md) - System reminder architecture overview
- [reminder_types.md](./reminder_types.md) - Complete catalog of 57 reminder types
- [attachment_producers.md](./attachment_producers.md) - Deep dive into 40+ producers
- [edge_cases_and_failures.md](./edge_cases_and_failures.md) - Error handling analysis
- [performance_and_telemetry.md](./performance_and_telemetry.md) - Performance optimization
