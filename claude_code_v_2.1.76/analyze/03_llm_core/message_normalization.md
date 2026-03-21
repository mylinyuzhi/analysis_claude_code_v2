# Message Normalization (Claude Code 2.1.76)

> Analysis of how internal messages are processed and formatted before being sent to the Anthropic API.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `trimMessagesAfterCompactBoundary` (fN) - Removes messages before compact boundary
- `findCompactBoundaryIndex` (Szz) - Finds the last compact boundary marker
- `applyContentReplacements` (T34) - Handles tool result content replacement
- `formatSystemPromptBlocks` (Jn8) - Converts system prompt strings to API format
- `addCacheReferences` (inlined) - Adds cache_reference for tool results
- `countToolUses` (qr8) - Counts tool uses by name in message history

---

## Architecture Overview

Messages flow through several transformation stages before being sent to the API:

```
Internal Message Store (mutableMessages)
        │
        ▼
┌─────────────────────────────────────┐
│ Stage 1: Compact Boundary Trimming  │
│   fN() → Szz()                      │
│   Removes messages before boundary  │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ Stage 2: Content Replacement        │
│   T34() → Vu9()                     │
│   Replaces tool result content      │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ Stage 3: Micro-compact              │
│   j.microcompact()                  │
│   Trims old tool results            │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ Stage 4: Auto-compact               │
│   j.autocompact()                   │
│   Summarizes if over token limit    │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ Stage 5: API Formatting             │
│   Jn8() → cache controls            │
│   Convert to Anthropic API format   │
└─────────────────────────────────────┘
        │
        ▼
Anthropic API Request
```

---

## Stage 1: Compact Boundary Trimming

### trimMessagesAfterCompactBoundary (fN)

**What it does:** When a compact operation has occurred, removes all messages before the compact boundary marker. This prevents old (already-summarized) messages from being sent to the API.

**Location:** chunks.174.mjs:628-632

```javascript
// ============================================
// trimMessagesAfterCompactBoundary - Trims pre-compact messages
// Location: chunks.174.mjs:628-632
// ============================================

// ORIGINAL (for source lookup):
function fN(A) {
    let q = Szz(A);
    if (q === -1) return A;
    return A.slice(q)
}

// READABLE (for understanding):
function trimMessagesAfterCompactBoundary(messages) {
    let boundaryIndex = findCompactBoundaryIndex(messages);
    if (boundaryIndex === -1) return messages;  // No boundary found, return all
    return messages.slice(boundaryIndex);        // Return only messages after boundary
}

// Mapping: fN→trimMessagesAfterCompactBoundary, A→messages, Szz→findCompactBoundaryIndex
```

### findCompactBoundaryIndex (Szz)

**What it does:** Searches backwards through messages to find the last compact boundary marker (a system message with `subtype: "compact_boundary"`).

**Location:** chunks.174.mjs:620-626

```javascript
// ============================================
// findCompactBoundaryIndex - Finds compact boundary position
// Location: chunks.174.mjs:620-626
// ============================================

// ORIGINAL (for source lookup):
function Szz(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K && RZ(K)) return q
    }
    return -1
}

// READABLE (for understanding):
function findCompactBoundaryIndex(messages) {
    // Search backwards for efficiency
    for (let i = messages.length - 1; i >= 0; i--) {
        let msg = messages[i];
        if (msg && isCompactBoundaryMessage(msg)) {
            return i;
        }
    }
    return -1;  // No boundary found
}

// Mapping: Szz→findCompactBoundaryIndex, A→messages, RZ→isCompactBoundaryMessage
```

**Why search backwards:**
- More efficient when boundary is near the end (common case)
- Early termination once found
- Returns the LAST boundary if multiple exist (most recent compact)

### isCompactBoundaryMessage (RZ)

**What it does:** Checks if a message is a compact boundary marker.

**Location:** chunks.174.mjs:617

```javascript
function isCompactBoundaryMessage(msg) {
    return msg?.type === "system" && msg.subtype === "compact_boundary";
}
```

---

## Stage 2: Content Replacement

### applyContentReplacements (T34)

**What it does:** Replaces tool result content with persisted content references. This is used when tool results have been saved to disk and need to be referenced instead of inline.

**Location:** chunks.89.mjs:2205-2210

```javascript
// ============================================
// applyContentReplacements - Replaces tool result content
// Location: chunks.89.mjs:2205-2210
// ============================================

// ORIGINAL (for source lookup):
async function T34(A, q, K, Y) {
    if (!q) return A;
    let z = await Vu9(A, q);
    if (z.newlyReplaced.length > 0 && K.startsWith("repl_main_thread")) Y(z.newlyReplaced);
    return z.messages
}

// READABLE (for understanding):
async function applyContentReplacements(messages, contentReplacementState, querySource, onNewlyReplaced) {
    if (!contentReplacementState) return messages;

    let result = await processContentReplacements(messages, contentReplacementState);

    // Notify about newly replaced content (for REPL main thread)
    if (result.newlyReplaced.length > 0 && querySource.startsWith("repl_main_thread")) {
        onNewlyReplaced(result.newlyReplaced);
    }

    return result.messages;
}

// Mapping: T34→applyContentReplacements, A→messages, q→contentReplacementState, K→querySource, Y→onNewlyReplaced, Vu9→processContentReplacements
```

**Why this approach:**
- Large tool outputs (e.g., file reads) are persisted to disk
- Content is replaced with `<persisted-output>` markers
- Reduces token usage in the conversation history
- Allows lazy-loading of content when needed

---

## Stage 5: API Formatting

### formatSystemPromptBlocks (Jn8)

**What it does:** Converts an array of system prompt strings into the Anthropic API format with cache controls.

**Location:** chunks.170.mjs:1483-1584

**Cache control strategy:**

```
┌────────────────────────────────────────────────────────────────┐
│ System Prompt Blocks                                            │
│                                                                 │
│  ┌────────────────────┐                                        │
│  │ Billing Header     │ cacheScope: null (no caching)          │
│  └────────────────────┘                                        │
│  ┌────────────────────┐                                        │
│  │ Environment Tag    │ cacheScope: "org"                      │
│  └────────────────────┘                                        │
│  ┌────────────────────┐                                        │
│  │ Static Sections    │ cacheScope: "global" (if enabled)      │
│  │ (before boundary)  │         or "org"                       │
│  └────────────────────┘                                        │
│  ┌────────────────────┐                                        │
│  │ __BOUNDARY__       │ (marker, not sent to API)              │
│  └────────────────────┘                                        │
│  ┌────────────────────┐                                        │
│  │ Dynamic Sections   │ cacheScope: null (no caching)          │
│  │ (after boundary)   │                                        │
│  └────────────────────┘                                        │
└────────────────────────────────────────────────────────────────┘
```

**Cache scope values:**

| Scope | Meaning | Use Case |
|-------|---------|----------|
| `null` | No caching | Dynamic content that changes frequently |
| `"org"` | Organization-level cache | Shared across users in org |
| `"global"` | Global cache | Static content shared across all users |

**Why this approach:**
- Static sections (intro, coding instructions) rarely change
- Dynamic sections (memory, MCP instructions) change between turns
- Caching reduces costs and latency for repeated content

### Cache Reference Handling

**What it does:** When caching is enabled, adds `cache_reference` to tool_result blocks that reference cached tool_use blocks.

**Location:** chunks.171.mjs:771-795

```javascript
// ============================================
// addCacheReferences - Adds cache_reference to tool results
// Location: chunks.171.mjs:771-795
// ============================================

// ORIGINAL (for source lookup):
if (q) {
    let J = -1;
    for (let M = 0; M < $.length; M++) {
        let D = $[M];
        if (Array.isArray(D.content)) {
            for (let X of D.content)
                if (X && typeof X === "object" && "cache_control" in X) J = M
        }
    }
    if (J >= 0)
        for (let M = 0; M < J; M++) {
            let D = $[M];
            if (D.role !== "user" || !Array.isArray(D.content)) continue;
            let X = !1;
            for (let P = 0; P < D.content.length; P++) {
                let W = D.content[P];
                if (W && Y9z(W)) {
                    if (!X) D.content = [...D.content], X = !0;
                    D.content[P] = Object.assign({}, W, {
                        cache_reference: W.tool_use_id
                    })
                }
            }
        }
}

// READABLE (for understanding):
if (enableCaching) {
    // Find the last message with cache_control
    let lastCachedMessageIndex = -1;
    for (let i = 0; i < messages.length; i++) {
        let msg = messages[i];
        if (Array.isArray(msg.content)) {
            for (let block of msg.content) {
                if (block && typeof block === "object" && "cache_control" in block) {
                    lastCachedMessageIndex = i;
                }
            }
        }
    }

    // Add cache_reference to tool_result blocks before the cached message
    if (lastCachedMessageIndex >= 0) {
        for (let i = 0; i < lastCachedMessageIndex; i++) {
            let msg = messages[i];
            if (msg.role !== "user" || !Array.isArray(msg.content)) continue;

            let mutated = false;
            for (let j = 0; j < msg.content.length; j++) {
                let block = msg.content[j];
                if (block && isToolResultBlock(block)) {
                    if (!mutated) {
                        msg.content = [...msg.content];
                        mutated = true;
                    }
                    msg.content[j] = Object.assign({}, block, {
                        cache_reference: block.tool_use_id
                    });
                }
            }
        }
    }
}

// Mapping: q→enableCaching, $→messages, J→lastCachedMessageIndex, Y9z→isToolResultBlock
```

**Why this approach:**
- Cache references allow the API to efficiently handle tool result caching
- Only tool_results before the cache boundary need references
- Avoids redundant data transfer for cached tool calls

---

## Message Type Filters

### shouldIncludeInApi (djq)

**What it does:** Determines whether a message should be included in the API request.

**Location:** chunks.174.mjs:634-639

```javascript
// ============================================
// shouldIncludeInApi - Filters messages for API
// Location: chunks.174.mjs:634-639
// ============================================

// ORIGINAL (for source lookup):
function djq(A, q) {
    if (A.type !== "user") return !0;
    if (A.isMeta) return !1;
    if (A.isVisibleInTranscriptOnly && !q) return !1;
    return !0
}

// READABLE (for understanding):
function shouldIncludeInApi(message, includeTranscriptOnly) {
    // Non-user messages always included
    if (message.type !== "user") return true;

    // Meta messages are never sent to API
    if (message.isMeta) return false;

    // Transcript-only messages excluded unless explicitly requested
    if (message.isVisibleInTranscriptOnly && !includeTranscriptOnly) return false;

    return true;
}

// Mapping: djq→shouldIncludeInApi, A→message, q→includeTranscriptOnly
```

### isThinkingOnly (Ei6)

**What it does:** Checks if an assistant message contains only thinking blocks (no actual content).

**Location:** chunks.174.mjs:641-645

```javascript
// ============================================
// isThinkingOnly - Checks for empty assistant message
// Location: chunks.174.mjs:641-645
// ============================================

// ORIGINAL (for source lookup):
function Ei6(A) {
    if (A.type !== "assistant") return !1;
    if (!Array.isArray(A.message.content)) return !1;
    return A.message.content.every((q) => q.type === "thinking" || q.type === "redacted_thinking")
}

// READABLE (for understanding):
function isThinkingOnly(message) {
    if (message.type !== "assistant") return false;
    if (!Array.isArray(message.message.content)) return false;

    // Check if all blocks are thinking blocks
    return message.message.content.every(
        (block) => block.type === "thinking" || block.type === "redacted_thinking"
    );
}

// Mapping: Ei6→isThinkingOnly, A→message
```

---

## Tool Use Counting

### countToolUses (qr8)

**What it does:** Counts how many times a specific tool has been used in the message history.

**Location:** chunks.174.mjs:647-658

```javascript
// ============================================
// countToolUses - Counts tool uses by name
// Location: chunks.174.mjs:647-658
// ============================================

// ORIGINAL (for source lookup):
function qr8(A, q, K) {
    let Y = 0;
    for (let z of A) {
        if (!z) continue;
        if (z.type === "assistant" && Array.isArray(z.message.content)) {
            if (z.message.content.some((w) => w.type === "tool_use" && w.name === q)) {
                if (Y++, K && Y >= K) return Y
            }
        }
    }
    return Y
}

// READABLE (for understanding):
function countToolUses(messages, toolName, maxCount) {
    let count = 0;

    for (let msg of messages) {
        if (!msg) continue;

        // Only assistant messages contain tool_use blocks
        if (msg.type === "assistant" && Array.isArray(msg.message.content)) {
            if (msg.message.content.some(
                (block) => block.type === "tool_use" && block.name === toolName
            )) {
                count++;
                // Early termination if we've reached max
                if (maxCount && count >= maxCount) return count;
            }
        }
    }

    return count;
}

// Mapping: qr8→countToolUses, A→messages, q→toolName, K→maxCount
```

**Why this approach:**
- Early termination (`maxCount`) for efficiency when only checking threshold
- Used for telemetry (counting TodoWrite, Bash uses)
- Also used for budget tracking

---

## Message Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Internal Message Format                       │
│                                                                  │
│  {                                                               │
│    type: "user" | "assistant" | "system",                       │
│    message: { content: string | ContentBlock[] },               │
│    isMeta?: boolean,                                             │
│    subtype?: string,          // For system messages            │
│    timestamp?: number,                                           │
│    uuid?: string                                                 │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Processing Pipeline                           │
│                                                                  │
│  1. Trim after compact boundary (fN)                            │
│     └── Remove messages before latest compact_boundary          │
│                                                                  │
│  2. Apply content replacements (T34)                            │
│     └── Replace large tool results with <persisted-output>      │
│                                                                  │
│  3. Micro-compact                                                │
│     └── Trim old tool results, keep recent ones                 │
│                                                                  │
│  4. Auto-compact (if needed)                                    │
│     └── Summarize conversation if over token limit              │
│                                                                  │
│  5. Format for API                                               │
│     ├── Add cache_control to system prompt blocks               │
│     ├── Add cache_reference to tool_result blocks               │
│     └── Filter out meta messages                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Anthropic API Format                          │
│                                                                  │
│  {                                                               │
│    role: "user" | "assistant",                                  │
│    content: ContentBlock[]                                       │
│  }                                                               │
│                                                                  │
│  ContentBlock types:                                             │
│  - { type: "text", text: string }                               │
│  - { type: "tool_use", id, name, input }                        │
│  - { type: "tool_result", tool_use_id, content, is_error }      │
│  - { type: "thinking", thinking: string }                       │
│  - { type: "image", source: { ... } }                           │
└─────────────────────────────────────────────────────────────────┘
```

---

---

## Attachment Processing Pipeline

### normalizeAttachmentForAPI (Ui8)

**What it does:** Converts typed attachment objects into API-compatible message format, handling various attachment types including files, directories, PDFs, and system reminders.

**Location:** chunks.174.mjs:3-469

**Source Code (VERIFIED):**

```javascript
// ============================================
// normalizeAttachmentForAPI - Converts attachments to API messages
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
            return b5([nr6(J4.name, {...}), ir6(J4, {...})]);
        case "edited_text_file":
            return b5([p1({content: `Note: ${A.filename} was modified...`, isMeta: !0})]);
        case "file": {
            let K = A.content;
            switch (K.type) {
                case "image":
                case "text":
                case "notebook":
                case "pdf":
                    return b5([nr6(L9.name, {file_path: A.filename}), ir6(L9, K)]);
            }
        }
        // ... more cases ...
    }
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Team mode special handling
    if (isTeamModeEnabled()) {
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
**Your Identity:** Name: ${attachment.agentName}
**Team Resources:** Config: ${attachment.teamConfigPath}, Task list: ${attachment.taskListPath}
</system-reminder>`,
                isMeta: true
            })];
        }
    }

    switch (attachment.type) {
        case "directory":
            // Convert directory listing to synthetic tool call/result
            return wrapWithSystemReminderTags([
                createToolUsePlaceholder(BashTool.name, {
                    command: `ls ${escapeShellArg([attachment.path])}`,
                    description: `Lists files in ${attachment.path}`
                }),
                createToolResultPlaceholder(BashTool, { stdout: attachment.content, stderr: "", interrupted: false })
            ]);

        case "edited_text_file":
            // Notify about external file modifications
            return wrapWithSystemReminderTags([
                createUserMessage({
                    content: `Note: ${attachment.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed. Here are the relevant changes (shown with line numbers):\n${attachment.snippet}`,
                    isMeta: true
                })
            ]);

        case "file": {
            let content = attachment.content;
            switch (content.type) {
                case "image":
                case "text":
                case "notebook":
                case "pdf":
                    return wrapWithSystemReminderTags([
                        createToolUsePlaceholder(ReadTool.name, { file_path: attachment.filename }),
                        createToolResultPlaceholder(ReadTool, content),
                        ...(attachment.truncated ? [createUserMessage({
                            content: `Note: The file ${attachment.filename} was too large and has been truncated. Use ${ReadTool.name} to read more.`,
                            isMeta: true
                        })] : [])
                    ]);
            }
        }

        case "pdf_reference":
            return wrapWithSystemReminderTags([
                createUserMessage({
                    content: `PDF file: ${attachment.filename} (${attachment.pageCount} pages). You MUST use ${TOOL_NAME_READ} with the pages parameter to read specific page ranges.`,
                    isMeta: true
                })
            ]);

        case "plan_file_reference":
            return wrapWithSystemReminderTags([
                createUserMessage({
                    content: `A plan file exists at: ${attachment.planFilePath}\n\nPlan contents:\n\n${attachment.planContent}`,
                    isMeta: true
                })
            ]);

        case "todo_reminder": {
            let todoContent = attachment.content.map((todo, i) => `${i + 1}. [${todo.status}] ${todo.content}`).join("\n");
            return wrapWithSystemReminderTags([
                createUserMessage({
                    content: `The TodoWrite tool hasn't been used recently. If you're working tasks that benefit from tracking progress, use the TodoWrite tool.\n\n[${todoContent}]`,
                    isMeta: true
                })
            ]);
        }
    }
}

// Mapping: Ui8→normalizeAttachmentForAPI, A→attachment, E7→isTeamModeEnabled,
//   p1→createUserMessage, b5→wrapWithSystemReminderTags, nr6→createToolUsePlaceholder,
//   ir6→createToolResultPlaceholder, L9→ReadTool, J4→BashTool
```

**Key insight:** The attachment normalization system serves as a bridge between the internal attachment representation and the Anthropic API format. By wrapping content in `<system-reminder>` tags and simulating tool call/result pairs for files, the system provides context to the LLM in a format it's trained to understand.

---

## normalizeMessages (cM) - Main Message Normalization Pipeline

**What it does:**
The `normalizeMessages` (cM) function is the central pipeline for converting internal message objects into the format expected by the Anthropic API. It handles message type routing, content filtering, tool input normalization, and message merging.

**Location:** chunks.173.mjs:1999-2151

**Source Code (VERIFIED):**

```javascript
// ============================================
// normalizeMessages - Main message normalization pipeline
// Location: chunks.173.mjs:1999-2151
// ============================================

// ORIGINAL (for source lookup):
function cM(A, q = []) {
    let K = new Set(q.map((M) => M.name)),
        Y = wzz(A),
        z = {
            [kv8()]: new Set(["document"]),
            [Ev8()]: new Set(["document"]),
            [yv8()]: new Set(["document"]),
            [dX1()]: new Set(["image"]),
            [Lv8()]: new Set(["document", "image"])
        },
        _ = new Map;
    // ... content type tracking for attachment filtering ...

    let w = [];
    Y.filter((M) => {
        if (M.type === "progress" || M.type === "system" && !gx8(M) || rn8(M)) return !1;
        return !0
    }).forEach((M) => {
        switch (M.type) {
            case "system": { /* ... merge with previous user message or push ... */ }
            case "user": { /* ... normalize and merge consecutive user messages ... */ }
            case "assistant": { /* ... normalize tool_use blocks ... */ }
            case "attachment": { /* ... convert attachment to messages ... */ }
        }
    });
    // ... post-processing and return ...
}

// READABLE (for understanding):
function normalizeMessages(messages, tools = []) {
    // Create set of available tool names for filtering
    let toolNameSet = new Set(tools.map((t) => t.name));

    // Get flattened message list (handles nested structures)
    let flatMessages = flattenMessages(messages);

    // Content type tracking map for attachment filtering
    // Maps message UUID → Set of content types to filter
    let contentTypeFilters = new Map();

    // Build content type filter map by scanning for special attachment markers
    // This allows filtering out redundant document/image content in meta messages
    let contentTypeMap = {
        [getDocumentType1()]: new Set(["document"]),
        [getDocumentType2()]: new Set(["document"]),
        [getDocumentType3()]: new Set(["document"]),
        [getImageType()]: new Set(["image"]),
        [getMixedType()]: new Set(["document", "image"])
    };

    // ... scan messages to build contentTypeFilters map ...

    // Output array
    let normalizedMessages = [];

    // Filter out unwanted message types and process each
    flatMessages.filter((msg) => {
        // Exclude progress messages
        if (msg.type === "progress") return false;
        // Exclude system messages that aren't special reminders
        if (msg.type === "system" && !isSpecialSystemMessage(msg)) return false;
        // Exclude attachment producer markers
        if (isAttachmentProducerMarker(msg)) return false;
        return true;
    }).forEach((msg) => {
        switch (msg.type) {
            case "system": {
                let systemMsg = createUserMessage({
                    content: msg.content,
                    uuid: msg.uuid,
                    timestamp: msg.timestamp
                });
                // Merge with previous user message if possible
                let lastMsg = getLastMessage(normalizedMessages);
                if (lastMsg?.type === "user") {
                    normalizedMessages[normalizedMessages.length - 1] = mergeUserMessages(lastMsg, systemMsg);
                    return;
                }
                normalizedMessages.push(systemMsg);
                return;
            }

            case "user": {
                let userMsg = msg;
                // Apply content type filtering for meta messages
                // (removes redundant document/image content)
                if (!isLeanMode()) {
                    userMsg = normalizeUserMessageWithFilters(msg, toolNameSet);
                } else {
                    userMsg = normalizeUserMessageLean(msg, toolNameSet);
                }

                // Apply content type filter if this is a meta message
                let filter = contentTypeFilters.get(userMsg.uuid);
                if (filter && userMsg.isMeta) {
                    let content = userMsg.message.content;
                    if (Array.isArray(content)) {
                        let filteredContent = content.filter((block) => !filter.has(block.type));
                        if (filteredContent.length === 0) return;  // Skip empty message
                        if (filteredContent.length < content.length) {
                            userMsg = { ...userMsg, message: { ...userMsg.message, content: filteredContent } };
                        }
                    }
                }

                // Merge consecutive user messages
                let lastMsg = getLastMessage(normalizedMessages);
                if (lastMsg?.type === "user") {
                    normalizedMessages[normalizedMessages.length - 1] = mergeUserMessages(lastMsg, userMsg);
                    return;
                }
                normalizedMessages.push(userMsg);
                return;
            }

            case "assistant": {
                let isLean = isLeanMode();
                let normalizedAssistant = {
                    ...msg,
                    message: {
                        ...msg.message,
                        content: msg.message.content.map((block) => {
                            if (block.type === "tool_use") {
                                // Find matching tool and normalize input
                                let tool = tools.find((t) => matchesToolName(t, block.name));
                                let normalizedInput = tool ? normalizeToolInput(tool, block.input) : block.input;
                                let resolvedName = tool?.name ?? block.name;

                                if (isLean) {
                                    return { ...block, name: resolvedName, input: normalizedInput };
                                }
                                return {
                                    type: "tool_use",
                                    id: block.id,
                                    name: resolvedName,
                                    input: normalizedInput
                                };
                            }
                            return block;
                        })
                    }
                };

                // Check for duplicate assistant message (same ID) and merge
                for (let i = normalizedMessages.length - 1; i >= 0; i--) {
                    let existingMsg = normalizedMessages[i];
                    if (existingMsg.type !== "assistant" && !hasToolResult(existingMsg)) break;
                    if (existingMsg.type === "assistant") {
                        if (existingMsg.message.id === normalizedAssistant.message.id) {
                            normalizedMessages[i] = mergeAssistantMessages(existingMsg, normalizedAssistant);
                            return;
                        }
                        continue;
                    }
                }
                normalizedMessages.push(normalizedAssistant);
                return;
            }

            case "attachment": {
                // Convert attachment to message(s) via normalizeAttachmentForAPI
                let attachmentMessages = normalizeAttachmentForAPI(msg.attachment);
                let processedMessages = isChairSermonEnabled()
                    ? attachmentMessages.map(applyChairSermonTransform)
                    : attachmentMessages;

                let lastMsg = getLastMessage(normalizedMessages);
                if (lastMsg?.type === "user") {
                    // Merge attachment messages into previous user message
                    normalizedMessages[normalizedMessages.length - 1] = processedMessages.reduce(
                        (acc, m) => mergeUserMessages(acc, m),
                        lastMsg
                    );
                    return;
                }
                normalizedMessages.push(...processedMessages);
                return;
            }
        }
    });

    // Post-processing pipeline
    let processed = isToolRefDeferred() ? removeToolRefHints(normalizedMessages) : normalizedMessages;
    processed = isChairSermonEnabled() ? applyFinalTransform(processed) : processed;
    validateMessageStructure(processed);
    let deduped = deduplicateMessages(processed);
    let final = compactMessageList(deduped);
    return splitLongMessages(final);
}

// Mapping: cM→normalizeMessages, A→messages, q→tools, K→toolNameSet, Y→flatMessages,
//   w→normalizedMessages, p1→createUserMessage, an8→mergeUserMessages,
//   Ui8→normalizeAttachmentForAPI, dk→isLeanMode, z3→matchesToolName
```

### Key Algorithm: Message Merging

**Why merge consecutive messages:**
The Anthropic API expects alternating user/assistant messages. Consecutive messages of the same type must be merged into a single message with combined content.

```javascript
// ============================================
// mergeUserMessages - Combines consecutive user messages
// Location: chunks.173.mjs:2182-2193
// ============================================

// ORIGINAL (for source lookup):
function an8(A, q) {
    let K = YS1(A.message.content),
        Y = YS1(q.message.content);
    return {
        ...A,
        uuid: A.isMeta ? q.uuid : A.uuid,  // Preserve meta UUID if applicable
        message: {
            ...A.message,
            content: TTq([...K, ...Y])
        }
    }
}

// READABLE (for understanding):
function mergeUserMessages(firstMsg, secondMsg) {
    let firstContent = ensureArray(firstMsg.message.content);
    let secondContent = ensureArray(secondMsg.message.content);

    return {
        ...firstMsg,
        // Use second message's UUID if first is a meta message
        uuid: firstMsg.isMeta ? secondMsg.uuid : firstMsg.uuid,
        message: {
            ...firstMsg.message,
            content: deduplicateContent([...firstContent, ...secondContent])
        }
    };
}

// Mapping: an8→mergeUserMessages, A→firstMsg, q→secondMsg, YS1→ensureArray, TTq→deduplicateContent
```

**Why this approach:**
- Preserves the most relevant UUID for message tracking
- Combines content arrays without duplication
- Maintains message metadata from the first message

---

## Summary

The message normalization system in Claude Code 2.1.76:

1. **Compact boundary handling** - Ensures only post-compact messages are sent
2. **Content replacement** - Manages persisted tool outputs for token efficiency
3. **Cache control** - Optimizes API costs through intelligent caching strategies
4. **Message filtering** - Removes meta/system messages before API submission
5. **Tool use tracking** - Provides utilities for counting and analyzing tool usage
6. **Attachment processing** - Converts typed attachments to API-compatible format

The key insight is that messages go through multiple transformation stages to optimize for:
- Token efficiency (compact boundaries, content replacement)
- API caching (cache controls, cache references)
- Correctness (filtering, normalization)
- Context preservation (attachment formatting)

---

## Deep Algorithm Analysis: Content Type Filtering

**What it does:**
The content type filtering algorithm prevents redundant document/image content from being sent to the API when the same content is already present in a preceding meta-message.

**Location:** chunks.173.mjs:2002-2029

**Source Code (VERIFIED):**

```javascript
// ============================================
// Content Type Filter Building - Prevents redundant content in meta-messages
// Location: chunks.173.mjs:2002-2029
// ============================================

// ORIGINAL (for source lookup):
z = {
    [kv8()]: new Set(["document"]),
    [Ev8()]: new Set(["document"]),
    [yv8()]: new Set(["document"]),
    [dX1()]: new Set(["image"]),
    [Lv8()]: new Set(["document", "image"])
},
_ = new Map;
for (let M = 0; M < Y.length; M++) {
    let D = Y[M];
    if (!rn8(D)) continue;
    let X = Array.isArray(D.message.content) && D.message.content[0]?.type === "text" ? D.message.content[0].text : void 0;
    if (!X) continue;
    let P = z[X];
    if (!P) continue;
    for (let W = M - 1; W >= 0; W--) {
        let Z = Y[W];
        if (Z.type === "user" && Z.isMeta) {
            let G = _.get(Z.uuid);
            if (G)
                for (let f of P) G.add(f);
            else _.set(Z.uuid, new Set(P));
            break
        }
        if (rn8(Z)) continue;
        break
    }
}

// READABLE (for understanding):
// Content type markers that signal what to filter in preceding meta-messages
let contentTypeMarkers = {
    [getDocumentType1()]: new Set(["document"]),
    [getDocumentType2()]: new Set(["document"]),
    [getDocumentType3()]: new Set(["document"]),
    [getImageType()]: new Set(["image"]),
    [getMixedType()]: new Set(["document", "image"])
};

// Map from message UUID → Set of content types to filter
let contentTypeFilters = new Map();

// Scan messages for content type markers
for (let i = 0; i < flatMessages.length; i++) {
    let msg = flatMessages[i];

    // Only check attachment producer markers
    if (!isAttachmentProducerMarker(msg)) continue;

    // Extract text from first content block
    let firstBlockText = Array.isArray(msg.message.content) && msg.message.content[0]?.type === "text"
        ? msg.message.content[0].text
        : undefined;

    if (!firstBlockText) continue;

    // Check if this text is a content type marker
    let typesToFilter = contentTypeMarkers[firstBlockText];
    if (!typesToFilter) continue;

    // Search backwards for the nearest meta-message
    for (let j = i - 1; j >= 0; j--) {
        let prevMsg = flatMessages[j];

        if (prevMsg.type === "user" && prevMsg.isMeta) {
            // Found the meta-message - add filter types
            let existingFilters = contentTypeFilters.get(prevMsg.uuid);
            if (existingFilters) {
                // Merge with existing filters
                for (let type of typesToFilter) {
                    existingFilters.add(type);
                }
            } else {
                // Create new filter set
                contentTypeFilters.set(prevMsg.uuid, new Set(typesToFilter));
            }
            break;
        }

        // Skip over other attachment producer markers
        if (isAttachmentProducerMarker(prevMsg)) continue;

        // Stop if we hit a non-marker message
        break;
    }
}

// Mapping: z→contentTypeMarkers, _→contentTypeFilters, Y→flatMessages,
//   rn8→isAttachmentProducerMarker, kv8→getDocumentType1, etc.
```

### Algorithm Breakdown

**Purpose:** When a meta-message (system reminder) contains document/image content AND a subsequent attachment producer marker indicates the same content type, the redundant content should be filtered from the meta-message to avoid duplication.

**Flow:**
```
Message i: Meta-message with document content
    ↓
Message j: Attachment producer marker: "pdf_reference"
    ↓
Algorithm detects that Message i has document content
    ↓
Adds "document" to filter set for Message i's UUID
    ↓
When Message i is processed, document blocks are removed
```

**Why this approach:**
- **Token efficiency**: Avoids sending duplicate content to API
- **Context clarity**: LLM sees clean context without redundancy
- **Attachment coordination**: Multiple attachment types can mark the same meta-message

---

## Deep Algorithm Analysis: Message Deduplication

**What it does:**
The `deduplicateContent` (TTq) function removes duplicate content blocks within a merged message.

**Location:** chunks.173.mjs:2195-2210

**Source Code (VERIFIED):**

```javascript
// ============================================
// deduplicateContent - Removes duplicate content blocks
// Location: chunks.173.mjs:2195-2210
// ============================================

// ORIGINAL (for source lookup):
function TTq(A) {
    let q = [],
        K = [];
    for (let Y of A)
        if (Y.type === "tool_result" || Y.type === "tool_use") {
            let z = `${Y.type}:${Y.id}`;
            q.includes(z) || (q.push(z), K.push(Y))
        } else Y.type === "text" ? (K.push(Y), q.push(`text:${Y.text.slice(0,100)}`)) : K.push(Y);
    return K
}

// READABLE (for understanding):
function deduplicateContent(contentBlocks) {
    let seenKeys = [];
    let dedupedBlocks = [];

    for (let block of contentBlocks) {
        if (block.type === "tool_result" || block.type === "tool_use") {
            // Deduplicate by type + ID
            let key = `${block.type}:${block.id}`;
            if (!seenKeys.includes(key)) {
                seenKeys.push(key);
                dedupedBlocks.push(block);
            }
        } else if (block.type === "text") {
            // Deduplicate text by first 100 chars
            let key = `text:${block.text.slice(0, 100)}`;
            dedupedBlocks.push(block);
            seenKeys.push(key);
        } else {
            // Other block types (image, etc.) - keep as-is
            dedupedBlocks.push(block);
        }
    }

    return dedupedBlocks;
}

// Mapping: TTq→deduplicateContent, A→contentBlocks, q→seenKeys, K→dedupedBlocks
```

**Deduplication Strategy:**

| Block Type | Deduplication Key | Strategy |
|------------|-------------------|----------|
| `tool_use` | `tool_use:${id}` | Keep first occurrence by ID |
| `tool_result` | `tool_result:${id}` | Keep first occurrence by ID |
| `text` | `text:${first100chars}` | Keep all (text is rarely duplicate) |
| Other | N/A | Keep all |

**Why text blocks are not deduplicated:**
- Text blocks with same prefix often have different suffixes
- User instructions may legitimately repeat phrases
- Deduplicating text would lose important context

---

## Deep Algorithm Analysis: Assistant Message Merging

**What it does:**
When the same assistant message (identified by `message.id`) appears multiple times in the input, the content blocks are merged into a single message.

**Location:** chunks.173.mjs:2090-2129

**Source Code (VERIFIED):**

```javascript
// ============================================
// Assistant Message Processing - Merging duplicate assistant messages
// Location: chunks.173.mjs:2090-2129
// ============================================

// ORIGINAL (for source lookup):
case "assistant": {
    let D = dk(),
        X = {
            ...M,
            message: {
                ...M.message,
                content: M.message.content.map((P) => {
                    if (P.type === "tool_use") {
                        let W = q.find((f) => z3(f, P.name)),
                            Z = W ? CGq(W, P.input) : P.input,
                            G = W?.name ?? P.name;
                        if (D) return {
                            ...P,
                            name: G,
                            input: Z
                        };
                        return {
                            type: "tool_use",
                            id: P.id,
                            name: G,
                            input: Z
                        }
                    }
                    return P
                })
            }
        };
    for (let P = w.length - 1; P >= 0; P--) {
        let W = w[P];
        if (W.type !== "assistant" && !Dzz(W)) break;
        if (W.type === "assistant") {
            if (W.message.id === X.message.id) {
                w[P] = Mzz(W, X);
                return
            }
            continue
        }
    }
    w.push(X);
    return
}

// READABLE (for understanding):
case "assistant": {
    let isLean = isLeanMode();

    // Normalize tool_use blocks
    let normalizedAssistant = {
        ...msg,
        message: {
            ...msg.message,
            content: msg.message.content.map((block) => {
                if (block.type === "tool_use") {
                    // Find matching tool definition
                    let tool = tools.find((t) => matchesToolName(t, block.name));
                    let normalizedInput = tool
                        ? normalizeToolInput(tool, block.input)
                        : block.input;
                    let resolvedName = tool?.name ?? block.name;

                    if (isLean) {
                        return { ...block, name: resolvedName, input: normalizedInput };
                    }
                    return {
                        type: "tool_use",
                        id: block.id,
                        name: resolvedName,
                        input: normalizedInput
                    };
                }
                return block;
            })
        }
    };

    // Search backwards for duplicate assistant message
    for (let i = normalizedMessages.length - 1; i >= 0; i--) {
        let existingMsg = normalizedMessages[i];

        // Stop at non-assistant, non-tool-result messages
        if (existingMsg.type !== "assistant" && !hasToolResult(existingMsg)) {
            break;
        }

        if (existingMsg.type === "assistant") {
            // Check for same message ID (duplicate)
            if (existingMsg.message.id === normalizedAssistant.message.id) {
                // Merge content blocks
                normalizedMessages[i] = mergeAssistantMessages(existingMsg, normalizedAssistant);
                return;
            }
            continue;
        }
    }

    // No duplicate found - push new message
    normalizedMessages.push(normalizedAssistant);
    return;
}

// Mapping: dk→isLeanMode, z3→matchesToolName, CGq→normalizeToolInput,
//   Dzz→hasToolResult, Mzz→mergeAssistantMessages
```

**Why search backwards:**
- Most recent messages are at the end
- Duplicate assistant messages are typically adjacent
- Early termination when non-assistant message found

**Why merge by message.id:**
- Streaming responses may arrive in chunks
- Each chunk has the same `message.id` but different content
- Merging combines all content blocks into one complete message

---

## Cross-Feature Connections: Message Normalization with System Reminders

### Connection 1: Attachment Injection in normalizeMessages

When `type: "attachment"` messages are encountered, they're converted via `normalizeAttachmentForAPI`:

```javascript
case "attachment": {
    // Convert attachment to message(s)
    let attachmentMessages = normalizeAttachmentForAPI(msg.attachment);

    // Apply optional transformation (chair sermon feature)
    let processedMessages = isChairSermonEnabled()
        ? attachmentMessages.map(applyChairSermonTransform)
        : attachmentMessages;

    // Merge with previous user message if possible
    let lastMsg = getLastMessage(normalizedMessages);
    if (lastMsg?.type === "user") {
        normalizedMessages[normalizedMessages.length - 1] = processedMessages.reduce(
            (acc, m) => mergeUserMessages(acc, m),
            lastMsg
        );
        return;
    }
    normalizedMessages.push(...processedMessages);
    return;
}
```

**Integration points:**
- `chunks.147.mjs:822-829` - attachmentGenerator (Vf6) yields attachment messages
- `chunks.174.mjs:3-469` - normalizeAttachmentForAPI (Ui8) converts types
- `chunks.173.mjs:2131-2141` - attachment case in normalizeMessages

### Connection 2: Meta-Message Filtering

Meta-messages (`isMeta: true`) are handled specially:

```javascript
// In user message processing:
let filter = contentTypeFilters.get(userMsg.uuid);
if (filter && userMsg.isMeta) {
    let content = userMsg.message.content;
    if (Array.isArray(content)) {
        let filteredContent = content.filter((block) => !filter.has(block.type));
        if (filteredContent.length === 0) return;  // Skip empty message
        if (filteredContent.length < content.length) {
            userMsg = {
                ...userMsg,
                message: { ...userMsg.message, content: filteredContent }
            };
        }
    }
}
```

**Why meta-message filtering:**
- System reminders often contain document/image content
- Subsequent attachment producers may provide the same content
- Filtering avoids redundant tokens in API requests

### Connection 3: Tool Reference Injection

When `tengu_toolref_defer_j8m` flag is disabled, tool reference hints are injected:

```javascript
if (!isToolRefDeferred()) {
    let content = userMsg.message.content;
    if (Array.isArray(content) &&
        !content.some((b) => b.type === "text" && b.text.startsWith(TOOL_REF_HINT_PREFIX)) &&
        hasToolUseBlock(content)) {
        userMsg = {
            ...userMsg,
            message: {
                ...userMsg.message,
                content: [...content, {
                    type: "text",
                    text: TOOL_REF_HINT_PREFIX
                }]
            }
        };
    }
}
```

**Purpose:**
- Injects hints about tool loading for deferred tools
- Helps LLM understand which tools are available but not loaded
- Improves tool selection accuracy in long conversations

### Connection 4: Post-Processing Pipeline

After the main normalization loop, several post-processing steps apply:

```javascript
// Post-processing pipeline
let processed = isToolRefDeferred()
    ? removeToolRefHints(normalizedMessages)
    : normalizedMessages;

processed = isChairSermonEnabled()
    ? applyFinalTransform(processed)
    : processed;

validateMessageStructure(processed);

let deduped = deduplicateMessages(processed);
let final = compactMessageList(deduped);
return splitLongMessages(final);
```

**Post-processing stages:**

| Stage | Function | Purpose |
|-------|----------|---------|
| Tool ref removal | `removeToolRefHints` | Clean up hints if deferred |
| Chair sermon | `applyFinalTransform` | Apply experimental formatting |
| Validation | `validateMessageStructure` | Ensure API-compliant structure |
| Deduplication | `deduplicateMessages` | Remove duplicate messages |
| Compaction | `compactMessageList` | Trim old messages if needed |
| Splitting | `splitLongMessages` | Handle messages exceeding API limits |

---

## Cross-Feature Connections: Cache Control Integration

### Cache Reference Generation

After normalization, cache references are added to tool result blocks:

**Location:** chunks.171.mjs:771-795

```javascript
if (enableCaching) {
    // Find the last message with cache_control
    let lastCachedMessageIndex = -1;
    for (let i = 0; i < messages.length; i++) {
        let msg = messages[i];
        if (Array.isArray(msg.content)) {
            for (let block of msg.content) {
                if (block && typeof block === "object" && "cache_control" in block) {
                    lastCachedMessageIndex = i;
                }
            }
        }
    }

    // Add cache_reference to tool_result blocks before the cached message
    if (lastCachedMessageIndex >= 0) {
        for (let i = 0; i < lastCachedMessageIndex; i++) {
            let msg = messages[i];
            if (msg.role !== "user" || !Array.isArray(msg.content)) continue;

            for (let j = 0; j < msg.content.length; j++) {
                let block = msg.content[j];
                if (block && isToolResultBlock(block)) {
                    msg.content[j] = {
                        ...block,
                        cache_reference: block.tool_use_id
                    };
                }
            }
        }
    }
}
```

**Why cache references:**
- Allow API to efficiently handle tool result caching
- Reduces token costs for repeated tool call patterns
- Improves response latency for cached content

---

## Summary: Key Algorithms in Message Normalization

| Algorithm | Purpose | Complexity |
|-----------|---------|------------|
| `normalizeMessages` | Main pipeline for API formatting | O(n) where n = message count |
| Content type filtering | Remove redundant content in meta-messages | O(n × m) where m = backward scan depth |
| `deduplicateContent` | Remove duplicate blocks in merged messages | O(n) where n = block count |
| `mergeUserMessages` | Combine consecutive user messages | O(n) where n = content blocks |
| `mergeAssistantMessages` | Combine chunks of same assistant message | O(n) where n = content blocks |
| Cache reference generation | Add cache hints for tool results | O(n²) worst case |

The message normalization system represents a sophisticated transformation pipeline that:
- **Preserves context** while removing redundancy
- **Enables caching** for cost optimization
- **Handles streaming** by merging message chunks
- **Supports extensibility** through attachment injection
- **Validates structure** for API compliance