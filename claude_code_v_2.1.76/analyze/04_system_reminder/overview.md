# System Reminder Module - Overview

> Module: System Reminders (Attachments-to-API normalization)
> Source: `chunks.174.mjs:1-469` (normalizeAttachmentForAPI), `chunks.173.mjs:1378+` (createUserMessage), `chunks.142.mjs:1948-1965`
> Version: Claude Code 2.1.76

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Core Functions](#core-functions)
- [Injection Points - Content Assembly](#injection-points---content-assembly)
- [Message Format Pipeline](#message-format-pipeline)
- [Silent Types: Zero Token Notifications](#silent-types-zero-token-notifications)
- [Key Design Decision: Why User Messages?](#key-design-decision-why-user-messages)
- [The System-Reminder XML Tag Wrapper](#the-system-reminder-xml-tag-wrapper)
- [Plan Mode Reminder Variants](#plan-mode-reminder-variants)
- [v2.1.76 Changes](#v2176-changes)
- [Related Symbols](#related-symbols)

> **UI Linkage deep-dive**: See [ui_linkage.md](./ui_linkage.md) for complete analysis of how `isMeta` messages are filtered from the UI, the API message preparation pipeline, and all non-UI uses of the `isMeta` flag.

---

## Overview

System reminders are **injected messages that guide the LLM's behavior without being visible to the end user in the chat UI**. They appear as meta-flagged user messages in the conversation stream, carrying instructions, context, and state notifications that the model needs to respond appropriately.

Examples of what system reminders convey:

- "Plan mode is active -- do not make edits"
- "The user opened file X in the IDE"
- "Your todo list has changed -- here are the contents"
- "Auto-compact is enabled, older messages will be summarized"
- "A hook blocked this action with error: ..."

These reminders are **not system prompts** (which go in the `system` parameter of the API call). Instead, they are injected as **user-role messages** with `isMeta: true`, making them part of the conversation context that the model processes alongside real user messages.

---

## Architecture

The system reminder pipeline has three layers:

```
┌──────────────────────────────────────────────────────────────────────┐
│                   LAYER 1: ATTACHMENT PRODUCTION                      │
│                    (phY - assembleAttachments)                       │
│                      chunks.142.mjs:1948-1965                        │
└──────────────┬───────────────────────────────────────────────────────┘
               │
               ├─> Group 1: User-Dependent (Sequential)
               │     ├─> at_mentioned_files (KIY)
               │     ├─> mcp_resources (zIY)
               │     └─> agent_mentions (YIY)
               │     [Await completion before Group 2/3]
               │
               ├─> Group 2: Always-Computed (Parallel with Group 3)
               │     ├─> changed_files (wIY)
               │     ├─> nested_memory (HIY)
               │     ├─> plan_mode (ihY)
               │     ├─> todo_reminders (fIY/NIY)
               │     ├─> skill_listing (OIY)
               │     ├─> team_context (LIY) [if team mode]
               │     ├─> post_compact responses (v2.1.76)
               │     ├─> session_name (v2.1.76)
               │     └─> ... (14+ producers total)
               │
               └─> Group 3: Main-Agent-Only (Parallel with Group 2)
                     ├─> ide_selection (ehY)
                     ├─> diagnostics (PIY/WIY)
                     ├─> token_usage (RIY)
                     ├─> queued_commands (dhY)
                     ├─> cron_job reminders (v2.1.76)
                     └─> ... (11 producers total)
                     [Skipped if subagent]
               │
               ↓ (Each producer wrapped in gw - timedAttachmentProducer)
               ↓ (Returns array of typed attachment objects)
               │
┌──────────────┴───────────────────────────────────────────────────────┐
│                   LAYER 2: ATTACHMENT NORMALIZATION                   │
│                  (Ui8 - normalizeAttachmentForAPI)                    │
│                     chunks.174.mjs:1-469                             │
│                                                                       │
│   • 57+ case switch statement                                        │
│   • Converts typed attachment → formatted message(s)                 │
│   • Applies <system-reminder> XML tags via b5() wrapper              │
│   • Returns array of TenguMessage objects                            │
└──────────────┬───────────────────────────────────────────────────────┘
               │
               ↓ (Array of message objects with isMeta: true)
               │
┌──────────────┴───────────────────────────────────────────────────────┐
│                    LAYER 3: MESSAGE STREAM INJECTION                  │
│                   (bG1 - buildContextMessages)                       │
│                      chunks.148.mjs:2414-2428                        │
│                                                                       │
│   • Inserts normalized attachments into message array                │
│   • Positions before user message in API call                        │
│   • Integrated with system prompt building                           │
└──────────────┬───────────────────────────────────────────────────────┘
               │
               ↓ (To Claude API: system prompt + messages including meta)
               │
┌──────────────┴───────────────────────────────────────────────────────┐
│                          LLM PROCESSES CONTEXT                        │
│   User sees: [User: "Fix the bug"] [Assistant: "..."]               │
│   LLM sees: [User: "Fix the bug"] [Meta: "<system-reminder>         │
│             Plan mode active...</system-reminder>"]                  │
│             [Assistant: "..."]                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Data Flow Summary**:
```
Raw State/Events → Attachment Objects → Normalized Messages → API Messages → LLM Context
```

### Layer 1: Attachment Producers (chunks.142.mjs)

The `phY` function (`assembleAttachments`) orchestrates **parallel computation** of all attachment types. It groups producers into three categories:

1. **User-message-dependent** (`_` array): `at_mentioned_files`, `mcp_resources`, `agent_mentions` -- only computed when a user message (`A`) is present
2. **Always-computed** (`X` array): `changed_files`, `nested_memory`, `dynamic_skill`, `skill_listing`, `plan_mode`, `plan_mode_exit`, `delegate_mode`, `todo_reminders`, `teammate_mailbox`, `team_context`, `critical_system_reminder`, `session_name` (v2.1.76), `post_compact` (v2.1.76)
3. **Main-agent-only** (`D` array): `ide_selection`, `ide_opened_file`, `output_style`, `diagnostics`, `lsp_diagnostics`, `unified_tasks`, `async_hook_responses`, `token_usage`, `budget_usd`, `verify_plan_reminder`, `queued_commands`, `cron_job` (v2.1.76) -- skipped for sub-agents (`O = !q.agentId`)

Each producer is wrapped in `gw()` (`timedAttachmentProducer`), which measures execution time and reports telemetry at a 5% sampling rate. If any producer throws, it logs the error and returns an empty array, preventing one failure from blocking all reminders.

### Layer 2: Normalizer - Ui8 (chunks.174.mjs:1-469)

The `Ui8` function (`normalizeAttachmentForAPI`) is the central dispatcher. It receives a typed attachment object and returns an array of formatted message objects ready for the API. It is a giant **switch statement** with 57+ cases covering every reminder type.

### Layer 3: Message Formatting (chunks.173.mjs:1378+)

The `p1` function (`createUserMessage`) produces the final user-role message objects that get inserted into the conversation.

---

## Conditional Execution Logic

The attachment production system employs several **conditional execution strategies** to minimize wasted computation and token consumption:

### 1. Global Disable Check

```javascript
if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) {
    return []; // Skip all attachment production
}
```

**Purpose**: Allows complete disabling of system reminders via environment variable for debugging or special use cases.

### 2. Subagent Filtering

```javascript
let isMainAgent = !sessionContext.agentId;

// Main-agent-only producers only run when isMainAgent === true
let mainAgentOnlyProducers = isMainAgent ? [
    /* 11 producers */
] : [];
```

**Rationale**: Subagents don't need IDE integration, token usage warnings, or queued commands. Filtering saves:
- Computation time (~40ms per subagent turn)
- Token budget (~500 tokens per turn)

### 3. Mode-Based Execution

```javascript
// Plan mode attachment only when in plan mode
if (toolPermissionContext.mode !== "plan") {
    return []; // Skip plan mode reminder
}

// Team mode attachments only when in team mode
if (!isTeamMode()) {
    return []; // Skip team context and mailbox
}
```

**Impact**: Avoids injecting irrelevant instructions when not in that mode.

### 4. Feature Flag Checks

```javascript
// Task reminders only if tasks enabled
if (!isTasksEnabled()) {
    return getTodoReminderAttachment(); // Fall back to todos
}

// TodoWrite reminders only if tool available
if (!sessionContext.options.tools.some((t) => t.name === TODO_WRITE_TOOL_NAME)) {
    return []; // Tool not in toolset, skip reminder
}
```

**Purpose**: Respects user configuration and tool availability.

### 5. Frequency Throttling

```javascript
// Plan mode: only send reminder every N turns
let { turnCount, foundPlanModeAttachment } = countTurnsSincePlanMode(messages);

if (foundPlanModeAttachment && turnCount < TURNS_BETWEEN_ATTACHMENTS) {
    return []; // Too soon, skip this turn
}
```

**Token savings**: Prevents reminder spam, saves ~10,000 tokens per 10 turns.

### 6. Permission Context Filtering

```javascript
// Sandbox check before including file
if (isSandboxBlocked(filePath, toolPermissionContext)) {
    return null; // Skip sandboxed files silently
}
```

**Security**: Prevents leaking sandboxed file paths or contents in attachments.

### Decision Tree: Producer Group Selection

```
┌─────────────────────────────────────────────┐
│   Is userMessage provided?                  │
└───────┬─────────────────────┬───────────────┘
        │ YES                 │ NO
        ↓                     ↓
   Execute Group 1        Skip Group 1
   (User-dependent)       (empty array)
        │                     │
        └──────┬──────────────┘
               │
               ↓
┌──────────────┴──────────────────────────────┐
│   Is tool mode === "plan"?                  │
└───────┬─────────────────────┬───────────────┘
        │ YES                 │ NO
        ↓                     ↓
   Include plan_mode      Skip plan_mode
   attachment             (not in plan mode)
        │                     │
        └──────┬──────────────┘
               │
               ↓
┌──────────────┴──────────────────────────────┐
│   Is this main agent (not subagent)?        │
└───────┬─────────────────────┬───────────────┘
        │ YES                 │ NO
        ↓                     ↓
   Execute Group 3        Skip Group 3
   (Main-agent-only)      (empty array)
        │                     │
        └──────┬──────────────┘
               │
               ↓
        All groups complete
```

---

## Error Handling Architecture

The system reminder subsystem is designed with **defensive programming** to ensure failures never crash the agent loop.

### Three-Layer Error Isolation

**Layer 1: Producer Wrapper (`gw` - timedAttachmentProducer)**

```javascript
async function timedAttachmentProducer(producerLabel, producerFunction) {
    let startTime = Date.now();

    try {
        let attachments = await producerFunction();
        // ... telemetry ...
        return attachments;
    } catch (error) {
        // Log error (always logged, not sampled)
        logError(error);
        logWarning(`Attachment error in ${producerLabel}`, error);

        // Sample telemetry (5% rate)
        if (Math.random() < 0.05) {
            logTelemetry("tengu_attachment_compute_duration", {
                label: producerLabel,
                error: true
            });
        }

        // CRITICAL: Return empty array, not null/undefined
        // This ensures flat() in assembleAttachments works
        return [];
    }
}
```

**Effect**: Any producer exception caught here → empty array returned → other producers continue normally.

**Layer 2: Producer Implementation (Internal try-catch)**

```javascript
async function getChangedFilesAttachment(context) {
    return (await Promise.all(files.map(async (file) => {
        try {
            // File I/O that may throw
            let contents = await readFile(file);
            return createAttachment(contents);
        } catch (error) {
            logTelemetry("file_read_error", {});
            return null; // This file failed, others continue
        }
    }))).filter(Boolean); // Remove nulls
}
```

**Effect**: Partial failures handled gracefully → successful results returned.

**Layer 3: Normalizer Error Handling**

```javascript
function normalizeAttachmentForAPI(attachment) {
    // ... switch cases ...

    // Unknown type safety
    if (["autocheckpointing", "background_task_status"].includes(attachment.type)) {
        return []; // Silently ignore these types
    }

    // Fallback for truly unknown types
    logWarning("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${attachment.type}`));
    return []; // Return empty, don't throw
}
```

**Effect**: Unknown or experimental attachment types don't crash the normalizer.

### Timeout Enforcement (AbortController)

```javascript
// 1-second global timeout for all producers
let abortController = createAbortController();
setTimeout(() => {
    abortController.abort();
}, 1000);

// Pass to producers via context
let enhancedContext = {
    ...sessionContext,
    abortController: abortController
};
```

**Behavior**:
- Operations that respect abort signal (file reads, network requests) get cancelled at 1 second
- Operations that don't respect signal continue but results are discarded (wrapper already returned [])
- Prevents any single producer from blocking agent loop >1 second

**Philosophy**: "Fail safe, proceed with partial context" - missing attachments acceptable, frozen agent not.

---

## Core Functions

### normalizeAttachmentForAPI (Ui8)

```javascript
// ============================================
// normalizeAttachmentForAPI - Main switch dispatcher for all reminder types
// Location: chunks.174.mjs:1-469
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (l8()) {
        if (A.type === "teammate_mailbox") return [p1({ content: Kzz().formatTeammateMessages(A.messages), isMeta: !0 })];
        if (A.type === "team_context") return [p1({ content: `<system-reminder>...team coordination...`, isMeta: !0 })]
    }
    switch (A.type) {
        case "directory": return b5([nr6(J4.name, { command: `ls ${j4([A.path])}`, ... }), ir6(J4, { stdout: A.content, ... })]);
        case "edited_text_file": return b5([p1({ content: `Note: ${A.filename} was modified...`, isMeta: !0 })]);
        // ... 55+ more cases
    }
    if (["autocheckpointing", "background_task_status"].includes(A.type)) return [];
    return jV("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${A.type}`)), []
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Pre-switch: team-specific types (only when in swarm/team mode)
    if (isTeamMode()) {
        if (attachment.type === "teammate_mailbox")
            return [createUserMessage({ content: getMailboxFormatter().formatTeammateMessages(attachment.messages), isMeta: true })];
        if (attachment.type === "team_context")
            return [createUserMessage({ content: `<system-reminder>...team coordination...`, isMeta: true })];
    }
    // Main switch: 57+ attachment types
    switch (attachment.type) {
        case "directory":
            return wrapWithSystemReminderTags([
                createToolCallMessage(BashTool.name, { command: `ls ${shellEscape([attachment.path])}` }),
                createToolResultMessage(BashTool, { stdout: attachment.content })
            ]);
        case "edited_text_file":
            return wrapWithSystemReminderTags([createUserMessage({
                content: `Note: ${attachment.filename} was modified...`, isMeta: true
            })]);
        // ... all other cases
    }
    // Silently ignored types
    if (["autocheckpointing", "background_task_status"].includes(attachment.type)) return [];
    // Unknown type: log warning, return empty
    return logWarning("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${attachment.type}`)), [];
}

// Mapping: Ui8->normalizeAttachmentForAPI, A->attachment, l8->isTeamMode,
// p1->createUserMessage, b5->wrapWithSystemReminderTags, Kzz->getMailboxFormatter,
// nr6->createToolCallMessage, ir6->createToolResultMessage, J4->BashTool, j4->shellEscape
```

**What it does:** Converts an internal attachment object (with a `.type` field) into one or more user-role messages suitable for the Claude API.

**How it works:**

1. **Pre-switch team check**: If the system is running in team/swarm mode (`l8()` / `isTeamMode`), it handles `teammate_mailbox` and `team_context` types first, before the main switch. These are the only types that bypass the switch entirely.

2. **Main switch**: A giant switch statement on `attachment.type` handles each known type by:
   - Creating content text (often with XML tags, markdown formatting, or structured instructions)
   - Wrapping in `c6()` to create a user message with `isMeta: true`
   - Optionally wrapping in `_9()` to add `<system-reminder>` XML tags around text content

3. **Silent fallthrough**: Some types (`already_read_file`, `command_permissions`, `hook_cancelled`, etc.) return empty arrays -- they are acknowledged but produce no API message. Similarly, `autocheckpointing` and `background_task_status` are silently ignored.

4. **Unknown type safety**: Any unrecognized type triggers a warning log and returns an empty array, preventing crashes from new or experimental types.

**Why this approach:**
- A single switch statement provides a clear, centralized mapping from type to output
- Each case is self-contained -- easy to add, modify, or remove individual reminder types
- The pre-switch team check avoids adding team-specific logic into every case
- Returning empty arrays for unknown types ensures forward compatibility when new types are added

**Key insight:** The function is deliberately permissive -- it never throws. Unknown types are logged but silently skipped, which means the agent loop continues even if a new attachment type is introduced in a version update but the normalizer has not yet been updated to handle it.

---

### wrapWithSystemReminderTags (b5)

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
        if (typeof msg.message.content === "string") {
            return { ...msg, message: { ...msg.message, content: wrapInXmlTag(msg.message.content) } };
        } else if (Array.isArray(msg.message.content)) {
            let wrappedBlocks = msg.message.content.map((block) => {
                if (block.type === "text") return { ...block, text: wrapInXmlTag(block.text) };
                return block; // images and other non-text blocks pass through unchanged
            });
            return { ...msg, message: { ...msg.message, content: wrappedBlocks } };
        }
        return msg; // non-string, non-array content passes through unchanged
    });
}

// Mapping: b5->wrapWithSystemReminderTags, A->messages, q->msg, af->wrapInXmlTag, K->wrappedBlocks, Y->block
```

**What it does:** Takes an array of message objects and wraps all their text content in `<system-reminder>` XML tags.

**How it works:**

1. Iterates over each message in the array
2. For **string content**: directly wraps the entire string in the XML tag
3. For **array content** (content blocks): maps over each block, wrapping only `text`-type blocks -- image blocks pass through unchanged
4. For anything else: returns the message unchanged

**Why this approach:**
- The `<system-reminder>` tag acts as a signal to the model that this content is injected metadata, not direct user input
- By handling both string and array content formats, it works with both simple text messages and multi-modal messages (text + images)
- Non-text blocks (images) are deliberately left unwrapped since XML tags would corrupt binary/structured data

**Key insight:** Not all reminder types use `_9()`. Some types (like `token_usage`, `hook_blocking_error`, `task_status`) call `tI()` directly when creating the content string, embedding the XML tags at creation time rather than wrapping after. This distinction determines whether the wrapping happens at the content level (inline `tI`) or at the message level (`_9`).

---

### wrapInXmlTag (af)

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

// Mapping: af->wrapInXmlTag, A->content
```

A minimal function that wraps any string in `<system-reminder>` open/close tags with newlines. This is the fundamental building block for all system reminder formatting.

---

### createUserMessage (p1)

```javascript
// ============================================
// createUserMessage - Creates a user-role message object for the API
// Location: chunks.173.mjs:1378+
// ============================================

// ORIGINAL (for source lookup):
function p1({ content: A, isMeta: q, isVisibleInTranscriptOnly: K, isCompactSummary: Y,
    summarizeMetadata: z, toolUseResult: w, mcpMeta: H, uuid: $, thinkingMetadata: O,
    timestamp: _, todos: J, imagePasteIds: X, sourceToolAssistantUUID: D, permissionMode: j }) {
    return {
        type: "user", message: { role: "user", content: A || wE },
        isMeta: q, isVisibleInTranscriptOnly: K, isCompactSummary: Y,
        summarizeMetadata: z, uuid: $ ?? SE(), timestamp: _ ?? new Date().toISOString(),
        toolUseResult: w, mcpMeta: H, thinkingMetadata: O, todos: J,
        imagePasteIds: X, sourceToolAssistantUUID: D, permissionMode: j
    }
}

// READABLE (for understanding):
function createUserMessage({ content, isMeta, isVisibleInTranscriptOnly, isCompactSummary,
    summarizeMetadata, toolUseResult, mcpMeta, uuid, thinkingMetadata,
    timestamp, todos, imagePasteIds, sourceToolAssistantUUID, permissionMode }) {
    return {
        type: "user",
        message: { role: "user", content: content || EMPTY_CONTENT },
        isMeta: isMeta,                             // true = hidden from UI
        isVisibleInTranscriptOnly: isVisibleInTranscriptOnly,
        isCompactSummary: isCompactSummary,
        summarizeMetadata: summarizeMetadata,
        uuid: uuid ?? generateUUID(),
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

// Mapping: p1->createUserMessage, A->content, q->isMeta, K->isVisibleInTranscriptOnly,
// Y->isCompactSummary, z->summarizeMetadata, w->toolUseResult, H->mcpMeta,
// $->uuid, O->thinkingMetadata, _->timestamp, J->todos, X->imagePasteIds,
// D->sourceToolAssistantUUID, j->permissionMode, wE->EMPTY_CONTENT, SE->generateUUID
```

**What it does:** Factory function that creates a user-role message object with all the metadata fields the system uses for internal message tracking.

**How it works:**

1. Takes a destructured parameter object with content and metadata fields
2. Returns a standardized message object with `type: "user"` and `role: "user"`
3. Auto-generates a UUID and timestamp if not provided
4. Falls back to `EMPTY_CONTENT` if content is falsy

**Key insight:** The `isMeta: true` flag is what distinguishes system reminders from real user messages. The UI layer checks this flag and hides meta messages from the chat display, while the API layer includes them in the conversation context sent to Claude. This is the mechanism that makes reminders "invisible to the user but visible to the model."

---

## Injection Points - Content Assembly

The `phY` function (`assembleAttachments`) in `chunks.142.mjs:1948-1965` is the entry point where the system decides which reminders to inject.

### assembleAttachments (phY)

**What it does:** Computes all attachment/reminder objects in parallel and returns them as a flat array.

**How it works:**

1. **Abort safety**: Creates an `AbortController` with a 1-second timeout, ensuring no individual producer can block the pipeline indefinitely.

2. **Three parallel groups** are computed:
   - `_` (user-message-dependent): at-mentioned files, MCP resources, agent mentions -- only when processing a user message
   - `X` (always-computed): changed files, nested memory, skills, plan mode, delegate mode, todos, team context, critical reminders, session name (v2.1.76), post_compact responses (v2.1.76)
   - `D` (main-agent-only): IDE selection, IDE opened file, output style, diagnostics, LSP diagnostics, unified tasks, async hooks, token/budget usage, verify plan, queued commands, cron_job reminders (v2.1.76)

3. **Parallel execution**: All three groups run via `Promise.all` concurrently, and results are flattened into a single array.

4. **Error isolation**: Each producer is wrapped in `gw()` which catches errors and returns `[]`, so one failing producer does not prevent others from contributing their reminders.

**Why this approach:**
- Parallel computation minimizes latency -- all reminder types are computed simultaneously
- The 1-second abort controller prevents slow I/O (e.g., reading a file) from delaying the entire response
- Separating main-agent-only producers (`D`) from always-computed ones (`X`) avoids unnecessary work for sub-agents
- The `gw()` telemetry wrapper provides performance visibility without polluting the producer logic

**Key insight:** The separation into three groups reflects an architectural hierarchy: some context is only relevant when there is a user message to respond to, some is always needed, and some only applies to the top-level agent (not sub-agents). This prevents sub-agents from receiving irrelevant IDE integration messages or budget warnings.

---

## Message Format Pipeline

The full pipeline from raw data to API-ready message:

```
[Raw Data]                    [Attachment Object]           [API Message]
  file content,          -->    { type: "file",        -->   { type: "user",
  todo list,                      filename: "...",            message: { role: "user",
  diagnostic info, etc.           content: {...} }              content: "<system-reminder>..." },
                                                              isMeta: true }
```

### Step-by-step:

1. **Producer** (e.g., `wIY` for changed files) gathers raw data and creates a typed attachment object: `{ type: "edited_text_file", filename: "...", snippet: "..." }`

2. **Ui8** (`normalizeAttachmentForAPI`) matches on `type` and constructs the content:
   - Creates informational text with context for the model
   - Wraps in `p1()` to create a user message with `isMeta: true`
   - Optionally wraps in `b5()` to add `<system-reminder>` XML tags

3. **Result** is an array of user-role messages ready to be inserted into the conversation stream before the next API call.

### Two wrapping patterns:

**Pattern A: `b5` wrapping (most reminder types)**
```
Producer -> Ui8 -> p1({content: "...", isMeta: true}) -> b5() adds <system-reminder> tags
```
Used for: directory, edited_text_file, file, todo, plan_mode, skill_listing, queued_command, etc.

**Pattern B: Inline `af` wrapping (status/notification types)**
```
Producer -> Ui8 -> p1({content: af("..."), isMeta: true})
```
Used for: task_status, task_progress, token_usage, budget_usd, hook_blocking_error, hook_success, etc.

The distinction is subtle: Pattern A creates the message first and then wraps the entire message array, which is useful when multiple messages (e.g., tool call + tool result) need consistent wrapping. Pattern B embeds the XML tags directly into the content string, which is simpler for single-message notifications.

---

## Silent Types: Zero Token Notifications

Not all attachment types produce API messages. The normalizer (`Ui8`) includes a category of **silent types** that return an empty array `[]`, resulting in zero token cost while still providing UI visibility.

### Silent Type Mechanism

```
┌──────────────────────────────────────────────────────────────────────┐
│                    Visible Attachment Flow                            │
│                                                                       │
│  Producer → Attachment → Ui8 → [Messages] → API → LLM (tokens used) │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    Silent Attachment Flow                             │
│                                                                       │
│  Producer → Attachment → Ui8 → [] → (No API message)                 │
│                              │                                        │
│                              └─> UI renders indicator                 │
│                              └─> Internal state updated               │
│                                                                       │
│                          Zero token cost                              │
└──────────────────────────────────────────────────────────────────────┘
```

### Comparison: `file` vs `already_read_file`

The clearest example of the silent mechanism is the difference between `file` and `already_read_file`:

| Aspect | `file` Type | `already_read_file` Type |
|--------|-------------|--------------------------|
| **Trigger** | New file read needed | Cache hit, file unchanged |
| **API Messages** | Synthetic `tool_use` + `tool_result` | None (`return []`) |
| **Token Cost** | ~100-1000+ tokens | 0 tokens |
| **UI Display** | "Read \<filename\>" | "Read \<filename\>" (identical) |
| **Code Path** | `nr6`/`ir6` create messages | Falls through to `return []` |
| **Location** | chunks.174.mjs:55-79 | chunks.174.mjs:456-465 |

#### Code Contrast

**`file` type (visible):**
```javascript
case "file": {
    // Creates synthetic tool_use and tool_result messages
    return b5([nr6(L9.name, { file_path: A.filename }), ir6(L9, K)]);
}
```

**`already_read_file` type (silent):**
```javascript
case "already_read_file":
case "command_permissions":
case "edited_image_file":
    return [];  // Empty array - zero tokens
```

### Why Silent Types Exist

1. **Token efficiency** - Don't waste context on information already known to the model
2. **UI-only visibility** - Users see the operation happened without LLM notification
3. **Internal bookkeeping** - Track state changes without polluting conversation
4. **Deduplication** - Prevent redundant operations (e.g., re-reading unchanged files)

### All Silent Types

| Type | Purpose |
|------|---------|
| `already_read_file` | Cache hit for unchanged file @-mention |
| `command_permissions` | Internal permission state tracking |
| `edited_image_file` | Binary image modification (cannot wrap in XML) |
| `hook_cancelled` | Hook process cancelled |
| `hook_error_during_execution` | Non-blocking hook error |
| `hook_non_blocking_error` | Hook error that doesn't block operation |
| `hook_system_message` | System message from hook (delivered elsewhere) |
| `structured_output` | Structured data from hook |
| `hook_permission_decision` | Permission decision from hook |
| `autocheckpointing` | Checkpoint state tracking |
| `background_task_status` | Internal task status |

For full details, see [types_silent.md](./types_silent.md).

---

## Key Design Decision: Why User Messages?

System reminders are injected as **user-role messages** (via `p1` with `role: "user"`), not as system messages. This is a deliberate architectural choice with several important consequences:

### 1. Conversation Context Positioning

By injecting as user messages, reminders appear **inline within the conversation history** at the exact point they are relevant. For example, a "file was modified" reminder appears right after the modification event, providing temporal context. If these were system messages, they would be aggregated into a single block at the beginning, losing their positional significance.

### 2. Compaction Compatibility

The auto-compaction system summarizes older conversation messages to free token budget. Because reminders are regular user messages (with the `isMeta` flag), they are **eligible for compaction** just like any other message. This means stale reminders (e.g., an old plan mode notification from 50 turns ago) get naturally summarized, while fresh reminders remain intact. System messages would not participate in compaction.

### 3. Pipeline Uniformity

The message processing pipeline (token counting, context window management, conversation truncation) operates on the user/assistant message stream. By using user messages, reminders flow through the same pipeline without special handling. No separate "system message injection" pathway is needed.

### 4. isMeta Flag Separation

The `isMeta: true` flag provides the UI-level separation needed: the chat display filters out meta messages, so users never see the injected reminders. Meanwhile, the API layer ignores the flag and sends all messages to Claude, making reminders "invisible to users but visible to the model."

### Trade-offs

- **Pro:** Simpler architecture -- one message type, one pipeline
- **Pro:** Natural compaction of stale reminders
- **Pro:** Positional context preserved in conversation history
- **Con:** The model may occasionally treat a reminder as if a user said it (mitigated by `<system-reminder>` tags)
- **Con:** Reminders consume tokens from the conversation context window (mitigated by compaction)

---

## The System-Reminder XML Tag Wrapper

The `<system-reminder>` tag serves as a **semantic signal** to the model:

```xml
<system-reminder>
Plan mode is active. The user indicated that they do not want you to execute yet...
</system-reminder>
```

**Purpose:**
- Distinguishes injected system context from actual user input
- Helps the model understand that this content should inform behavior, not be directly addressed
- Provides a consistent framing that the model has been trained/prompted to recognize

**Two application methods:**
1. `b5()` / `wrapWithSystemReminderTags`: Post-hoc wrapping of an array of messages -- applied to most reminder types
2. `af()` / `wrapInXmlTag`: Inline wrapping of a content string -- applied to status notifications

**Notable:** Some reminder types deliberately skip XML wrapping. For example, `teammate_mailbox` and `team_context` (handled pre-switch) construct their own `<system-reminder>` tags manually in the content string, bypassing `b5()`.

---

## Plan Mode Reminder Variants

Plan mode demonstrates the most sophisticated use of the reminder system, with four sub-functions:

### Wzz (planModeReminderDispatcher)

Routes to one of three variants based on context:
- Sub-agent? -> `yzz` (subAgentPlanReminder) -- minimal instructions
- Sparse reminder? -> `Ezz` (sparsePlanReminder) -- abbreviated version
- Full reminder -> `Nzz` (fullPlanReminder) -- complete 5-phase workflow OR `iterativePlanReminder` -- interview-driven workflow

**Sparse vs Full decision algorithm:**
```
reminderCount = countPlanModeRemindersInHistory(messages)
frequency = (reminderCount + 1) % FULL_REMINDER_EVERY_N_ATTACHMENTS
if frequency === 1 -> "full"
else -> "sparse"
```

This prevents the full plan mode instructions (which can be very long) from being injected every turn, saving tokens. The sparse version is a one-liner referencing "full instructions earlier in conversation."

**Plan mode reentry detection:**
When a plan file exists and a `plan_mode_reentry` flag is set, the system injects additional guidance telling the model to evaluate whether the existing plan is still relevant to the current request.

**v2.1.76 change:** The `/plan` command now supports an optional description argument, which is passed into the plan mode attachment to provide initial task context.

---

## v2.1.76 Changes

### New Hook Types

Seven new hook event types were added to the system reminder pipeline. These correspond to new lifecycle events in the hooks system:

- **PostCompact** - Fires after auto-compaction completes; allows hooks to inject context into the freshly compacted session
- **Elicitation** - Fires when an MCP server initiates an elicitation request; delivers the elicitation UI/prompt to the model
- **ElicitationResult** - Fires when the user responds to an elicitation; provides the result back to the hook
- **InstructionsLoaded** - Fires when skill instructions are loaded; allows hooks to intercept and modify instruction content
- **ConfigChange** - Fires when Claude Code configuration changes at runtime; notifies model of new settings
- **WorktreeCreate** - Fires when a git worktree is created; provides worktree context for multi-worktree workflows
- **WorktreeRemove** - Fires when a git worktree is removed; cleans up worktree-specific state

### New Reminder Types

- **session_name** - Injects the current session name as a reminder; helps with session continuity and identification
- **cron_job** - Reminds the model when running inside a `/loop` cron job context; provides scheduling information

### Skill System Updates

- **CLAUDE_SKILL_DIR environment variable** - Skills can now be discovered from a directory specified via `${CLAUDE_SKILL_DIR}`. The skill listing attachment now queries this path in addition to the standard locations.
- **InstructionsLoaded hook** - When skill instructions are loaded via the `invoked_skills` type, an `InstructionsLoaded` hook event fires, enabling hook scripts to react to or modify which instructions are active.
- **Last-modified timestamps** - Memory file headers (for `nested_memory` type from CLAUDE.md files) now include the file's last-modified timestamp, helping the model detect when memory files have been updated.

### Task Tool Updates

- **TaskCreate/TaskUpdate/TaskGet/TaskList** - These tools no longer require an `activeForm` context. In v2.1.38, task tools were only available when a specific form/workflow was active. In v2.1.76, they are always available when the task system is enabled, making task management more accessible throughout the session.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `normalizeAttachmentForAPI` (Ui8) - Main switch dispatcher, chunks.174.mjs:1-469
- `wrapWithSystemReminderTags` (b5) - XML tag wrapper for message arrays, chunks.173.mjs:2496-2523
- `wrapInXmlTag` (af) - XML tag wrapper for strings, chunks.173.mjs:2490-2494
- `createUserMessage` (p1) - User message factory, chunks.173.mjs:1378+
- `assembleAttachments` (phY) - Parallel content assembly, chunks.142.mjs:1948-1965
- `timedAttachmentProducer` (gw) - Telemetry-wrapped producer executor, chunks.142.mjs:1967-1991
- `planModeReminderDispatcher` (Wzz) - Plan mode variant router, chunks.173.mjs:2525-2530
- `fullPlanReminder` (Nzz) - Full 5-phase plan mode instructions, chunks.173.mjs:2556-2690
- `sparsePlanReminder` (Ezz) - Abbreviated plan mode reminder, chunks.173.mjs:2692-2699
- `subAgentPlanReminder` (yzz) - Minimal sub-agent plan instructions, chunks.173.mjs:2701-2712
- `ultraplanCompleteReminder` (Zzz) - Ultraplan complete notification, chunks.173.mjs:2532-2538
- `autoModeReminder` (Lzz) - Auto mode dispatcher, chunks.173.mjs:2714-2717
- `fullAutoModeReminder` (Rzz) - Full auto mode instructions, chunks.173.mjs:2719-2732
- `sparseAutoModeReminder` (hzz) - Sparse auto mode reminder, chunks.173.mjs:2734-2739
- `createToolCallMessage` (nr6) - Simulates tool call display, chunks.174.mjs:490-495
- `createToolResultMessage` (ir6) - Simulates tool result display, chunks.174.mjs:471-488
- `isTeamMode` (l8) - Checks if running in swarm/team mode
- `getMailboxFormatter` (Kzz) - Returns teammate message formatter
