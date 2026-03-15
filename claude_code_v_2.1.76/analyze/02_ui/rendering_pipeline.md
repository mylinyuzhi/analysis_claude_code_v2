# Message Rendering Pipeline

> Related Symbols:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `MessageList` (P8z / g91) - Memoized message list component, chunks.161.mjs:587
- `MessageComponent` (n9q) - Individual message renderer, chunks.161.mjs
- `normalizeDisplayMessages` (t9q) - Groups tool uses with hooks and results, chunks.172.mjs:3072
- `groupToolResults` (q9q) - Groups repeated tool uses for compact display, chunks.160.mjs:1849
- `normalizeMessages` (WJ) - Transforms raw messages to render format, chunks.173.mjs:89
- `reorderAttachments` (dzz) - Positions attachment messages near their turns, chunks.172.mjs:3244
- `getVisibleMessagesAfterCompact` (EN) - Shows only post-compact messages, chunks.173.mjs:1286
- `shouldShowMessageInChat` (qYq) - Core UI visibility filter, chunks.173.mjs:1292
- `isNotProgress` (f8z) - Removes progress messages, chunks.161.mjs:571
- `handleToolUseStream` (iW1) - Routes streaming events to state, chunks.173.mjs:390
- `createAssistantMessage` (DJq) - Constructs assistant message objects, chunks.172.mjs:2860

---

## Table of Contents

- [1. Pipeline Overview](#1-pipeline-overview)
- [2. Stage 0: Streaming Input (iW1)](#2-stage-0-streaming-input-iw1)
- [3. Stage 1: Message Normalization (WJ)](#3-stage-1-message-normalization-wj)
  - [3.1 Attachment Reordering](#31-attachment-reordering-dzz)
  - [3.2 Tool Input Normalization](#32-tool-input-normalization)
  - [3.3 Message Merging](#33-message-merging)
- [4. Stage 2: Compaction Filter (EN)](#4-stage-2-compaction-filter-en)
- [5. Stage 3: Visibility Filter (qYq)](#5-stage-3-visibility-filter-qyq)
- [6. Stage 4: Display Normalization (t9q)](#6-stage-4-display-normalization-t9q)
  - [6.1 Hook Grouping](#61-hook-grouping)
  - [6.2 API Error Deduplication](#62-api-error-deduplication)
- [7. Stage 5: Tool Result Grouping (q9q)](#7-stage-5-tool-result-grouping-q9q)
- [8. Stage 6: Pagination and Transcript Mode](#8-stage-6-pagination-and-transcript-mode)
- [9. Stage 7: MessageList Rendering (P8z)](#9-stage-7-messagelist-rendering-p8z)
  - [9.1 Memoization Strategy](#91-memoization-strategy)
  - [9.2 Streaming Tool Uses Integration](#92-streaming-tool-uses-integration)
  - [9.3 Thinking Block Lifecycle](#93-thinking-block-lifecycle)
- [10. Message Type Reference](#10-message-type-reference)
- [11. Performance Architecture](#11-performance-architecture)

---

## 1. Pipeline Overview

The rendering pipeline transforms raw LLM output into terminal display through 7 distinct stages:

```
┌──────────────────────────────────────────────────────────────────────┐
│                    MESSAGE RENDERING PIPELINE                         │
│                                                                       │
│  Stage 0: STREAMING (iW1)                                            │
│  LLM events → setMessages / setStreamingToolUses / setStreamMode     │
│                                                                       │
│  Stage 1: NORMALIZATION (WJ)                                         │
│  Raw messages → Attachment reorder → Tool input normalize → Merge    │
│  [chunks.173.mjs:89]                                                 │
│                                                                       │
│  Stage 2: COMPACTION FILTER (EN)                                     │
│  Hide pre-compact messages (unless transcript view)                  │
│  [chunks.173.mjs:1286]                                               │
│                                                                       │
│  Stage 3: VISIBILITY FILTER (qYq)                                    │
│  Remove isMeta:true messages + progress type messages                │
│  [chunks.173.mjs:1292 + chunks.161.mjs:571]                          │
│                                                                       │
│  Stage 4: DISPLAY NORMALIZATION (t9q)                                │
│  Group: tool_use → pre_hooks → tool_result → post_hooks              │
│  [chunks.172.mjs:3072]                                               │
│                                                                       │
│  Stage 5: TOOL GROUPING (q9q)                                        │
│  Collapse repeated executions of same tool into one entry            │
│  [chunks.160.mjs:1849]                                               │
│                                                                       │
│  Stage 6: PAGINATION                                                 │
│  Transcript mode: last 10 messages (unless "show all")               │
│                                                                       │
│  Stage 7: REACT RENDER (P8z / n9q)                                  │
│  Map each message to MessageComponent                                │
│  [chunks.161.mjs:587]                                                │
└──────────────────────────────────────────────────────────────────────┘
```

**Why so many stages?** Each stage has a specific, separable concern:
- Stage 1 transforms *structure* (normalize message format)
- Stages 2-3 filter *visibility* (what the user should see)
- Stage 4 transforms *grouping* (hook execution ordering)
- Stage 5 transforms *presentation* (compact repeated tools)
- Stage 6 transforms *volume* (reduce overload in transcript)
- Stage 7 is pure *rendering* (map to React elements)

Separating these concerns makes the system easier to reason about and test independently.

**v2.1.76 changes:**
- **React Compiler performance improvements**: The memoization cache (`e(N)` pattern) is more aggressively applied, reducing unnecessary re-computations at every stage.
- **Blockquote italics with left bar**: Blockquote text in assistant messages now renders with an italic font and a left-border visual indicator in dark themes, improving readability of quoted content.
- **Spinner isolated to 50ms animation loop**: The spinner animation runs in a separate React subtree on a 50ms timer, decoupled from the main message list render cycle.

---

## 2. Stage 0: Streaming Input (iW1)

Before the pipeline can process messages, they must arrive from the LLM streaming layer.

The key insight is that **streaming events do not directly add to messages**. Instead:

1. `content_block_start/delta` events update **transient state** (`streamingToolUses`, `streamMode`)
2. Only final, complete events (`assistant` type, non-stream) are added to `messages` via `setMessages`

```
LLM Stream Events
    │
    ├── content_block_start → setStreamMode, setStreamingToolUses(add entry)
    ├── content_block_delta → updateResponseLength, setStreamingToolUses(update partial JSON)
    ├── thinking_delta      → setStreamingThinking(append text)
    ├── message_delta       → setStreamMode("responding")
    │
    └── complete messages (type="assistant"|"user"|etc.)
            └── setMessages(prev => [...prev, msg])
```

**What goes into `streamingToolUses`:**

Each entry represents a tool use that is still having its input streamed:
```typescript
{
    index: number,             // Position in current LLM response
    contentBlock: {
        type: "tool_use",
        id: string,            // Tool use ID
        name: string,          // Tool name (e.g., "Bash")
        input: {}              // Empty initially
    },
    unparsedToolInput: string  // Partial JSON being accumulated
}
```

When streaming ends, these entries are removed from `streamingToolUses` and the completed `assistant` message (with full tool inputs) appears in `messages`. The `MessageList` component handles the transition by filtering out streaming entries that have already appeared as complete messages.

---

## 3. Stage 1: Message Normalization (WJ)

`normalizeMessages` (`WJ`) is the "pre-processing" stage that converts the raw internal message format into a render-ready format.

```javascript
// ============================================
// normalizeMessages - Transform raw messages for display
// Location: chunks.173.mjs:89-206
// ============================================

// ORIGINAL (for source lookup):
function WJ(A, q = []) {
    let K = new Set(q.map((J) => J.name)),
        Y = dzz(A),
        z = { ... },
        w = new Map;
    // ... attachment type mapping
    let H = [];
    Y.filter((J) => {
        if (J.type === "progress" || J.type === "system" || pmA(J)) return !1;
        return !0
    }).forEach((J) => {
        switch (J.type) {
            case "user": { ... H.push(X); return }
            case "assistant": { ... H.push(D); return }
            case "attachment": {
                let X = K2z(J.attachment),
                    D = gP(H);
                if (D?.type === "user") {
                    H[H.indexOf(D)] = X.reduce((j, M) => lzz(j, M), D);
                    return
                }
                H.push(...X); return
            }
        }
    });
    return H
}

// READABLE (for understanding):
function normalizeMessages(messages, availableTools = []) {
    const toolNames = new Set(availableTools.map(t => t.name));

    // Step 1: Reorder attachments to be near their associated turns
    const reorderedMessages = reorderAttachments(messages);

    // Step 2: Build tool associations (for attachment type display)
    const toolTypeMap = {
        [getDocumentToolName()]: new Set(["document"]),
        [getImageToolName()]:    new Set(["image"])
    };

    // Step 3: Filter + transform each message
    const normalized = [];
    reorderedMessages
        .filter(msg => {
            // Exclude: progress indicators (streaming status)
            if (msg.type === "progress") return false;
            // Exclude: system markers (compact_boundary etc.)
            if (msg.type === "system") return false;
            // Exclude: API error messages (rendered differently)
            if (isApiErrorMessage(msg)) return false;
            return true;
        })
        .forEach(msg => {
            switch (msg.type) {
                case "user":
                    let userMsg = isToolSearchEnabled()
                        ? filterUnavailableTools(msg, toolNames)
                        : filterAllToolReferences(msg);
                    const prev = getLastMessage(normalized);
                    if (prev?.type === "user") {
                        // Merge consecutive user messages (from attachment injection)
                        normalized[normalized.indexOf(prev)] = mergeUserMessages(prev, userMsg);
                        return;
                    }
                    normalized.push(userMsg);
                    break;

                case "assistant":
                    const assistantMsg = normalizeAssistantToolInputs(msg, availableTools);
                    const prevAssistant = getLastMessage(normalized);
                    if (prevAssistant?.message?.id === msg.message?.id) {
                        // Merge split assistant messages (same message.id)
                        mergeAssistantMessages(normalized, prevAssistant, assistantMsg);
                        return;
                    }
                    normalized.push(assistantMsg);
                    break;

                case "attachment":
                    // Convert attachment object to user message(s) via K2z
                    const converted = normalizeAttachmentForAPI(msg.attachment);
                    const prevUser = getLastMessage(normalized);
                    if (prevUser?.type === "user") {
                        // Merge attachments into the preceding user message
                        normalized[normalized.indexOf(prevUser)] = converted.reduce(
                            (acc, m) => mergeUserMessages(acc, m),
                            prevUser
                        );
                        return;
                    }
                    normalized.push(...converted);
                    break;
            }
        });

    return normalized;
}

// Mapping: WJ→normalizeMessages, A→messages, q→availableTools, K→toolNames,
// Y→reorderedMessages, dzz→reorderAttachments, K2z→normalizeAttachmentForAPI,
// H→normalized, lzz→mergeUserMessages, gP→getLastMessage
```

### 3.1 Attachment Reordering (dzz)

Before processing, `reorderAttachments` (`dzz`) ensures attachment messages appear immediately before the user message they relate to:

```
Before reordering:
[turn1] [turn2] [userMessage] [attachment1] [attachment2]

After reordering:
[turn1] [turn2] [attachment1] [attachment2] [userMessage]
```

**Why:** Attachments are produced just before the API call and appended after the user message. But semantically, the LLM should see them BEFORE the user message, so they provide context "just as the user is speaking." The backwards walk algorithm correctly handles multiple consecutive attachments.

### 3.2 Tool Input Normalization

For assistant messages, tool use inputs are normalized:
```javascript
// For each tool_use block in an assistant message:
const tool = availableTools.find(t => t.name === block.name);
const normalizedInput = tool ? normalizeToolInput(tool, block.input) : block.input;
```

If `isToolSearchEnabled()` is true, the original tool block structure is preserved (including extra fields). Otherwise, only `{type, id, name, input}` are kept, discarding execution metadata.

### 3.3 Message Merging

Two merging patterns handle how messages are combined:

1. **Consecutive user messages**: When two user messages appear back-to-back (common when attachments are injected before a user message), they are merged into a single user message by combining their content arrays.

2. **Split assistant messages**: The same LLM assistant turn can arrive as multiple messages with the same `message.id` (e.g., when a tool result is processed and the assistant continues). These are merged into a single message.

---

## 4. Stage 2: Compaction Filter (EN)

In normal chat view (not transcript), messages before the last compaction boundary are hidden:

```javascript
// ============================================
// getVisibleMessagesAfterCompact - Show post-compact messages only
// Location: chunks.173.mjs:1286-1290
// ============================================

// ORIGINAL (for source lookup):
function EN(A) {
    let q = Y2z(A);
    if (q === -1) return A;
    return A.slice(q)
}

// READABLE (for understanding):
function getVisibleMessagesAfterCompact(messages) {
    const lastBoundaryIndex = findLastCompactBoundary(messages);
    if (lastBoundaryIndex === -1) return messages; // No compact happened
    return messages.slice(lastBoundaryIndex);       // Only post-compact messages
}
```

**Why start AT the boundary, not after it?** The compact boundary message itself is type `"system"` with `subtype: "compact_boundary"` and contains the compact summary. It needs to be included so the `normalizeDisplayMessages` stage can see it. The `isNotProgress` filter in Stage 3 does NOT filter out system messages - they pass through to `normalizeDisplayMessages` where they are handled specially.

**In transcript view:** `EN` is bypassed. The full `allMessages` array is passed to the filter chain, giving users access to the complete history including pre-compact messages.

---

## 5. Stage 3: Visibility Filter (qYq)

The `shouldShowMessageInChat` filter is applied on every render to every message in the array:

```javascript
// ============================================
// shouldShowMessageInChat - Core UI message visibility gate
// Location: chunks.173.mjs:1292-1297
// ============================================

// ORIGINAL (for source lookup):
function qYq(A, q) {
    if (A.type !== "user") return !0;
    if (A.isMeta) return !1;
    if (A.isVisibleInTranscriptOnly && !q) return !1;
    return !0
}

// READABLE (for understanding):
function shouldShowMessageInChat(message, isTranscriptView) {
    if (message.type !== "user") return true;          // Non-user: always show
    if (message.isMeta) return false;                  // System reminders: always hidden
    if (message.isVisibleInTranscriptOnly && !isTranscriptView) return false; // Advanced view only
    return true;
}
```

This filter runs in conjunction with `isNotProgress`:
```javascript
// chunks.161.mjs:695-697 (inside MessageList render):
.filter(isNotProgress)             // Remove type="progress" messages
.filter(m => shouldShowMessageInChat(m, isTranscriptView))  // Remove isMeta
```

**Complete filter hierarchy:**
1. `type === "progress"` → Always removed (streaming indicators)
2. `type === "user" && isMeta === true` → Always removed (system reminders)
3. `type === "user" && isVisibleInTranscriptOnly === true && !transcriptView` → Removed in chat, shown in transcript
4. Everything else → Shown

---

## 6. Stage 4: Display Normalization (t9q)

`normalizeDisplayMessages` (`t9q`) organizes tool executions with their associated hooks and results into logical groups for display:

```javascript
// ============================================
// normalizeDisplayMessages - Group tool uses with hooks and results
// Location: chunks.172.mjs:3072-3150
// ============================================

// ORIGINAL (for source lookup):
function t9q(A, q) {
    let K = new Map;
    for (let H of A) {
        if (XJq(H)) { /* tool use → K.set(id, {toolUse: H, ...}) */ continue }
        if (dd1(H) && H.attachment.hookEvent === "PreToolUse") { /* K.get(id).preHooks.push(H) */ continue }
        if (H.type === "user" && H.message.content[0]?.type === "tool_result") { /* K.get(id).toolResult = H */ continue }
        if (dd1(H) && H.attachment.hookEvent === "PostToolUse") { /* K.get(id).postHooks.push(H) */ continue }
    }
    let Y = [], z = new Set;
    for (let H of A) {
        if (XJq(H)) {
            let $ = H.message.content[0]?.id;
            if ($ && !z.has($)) {
                z.add($);
                let O = K.get($);
                if (O && O.toolUse) {
                    Y.push(O.toolUse), Y.push(...O.preHooks);
                    if (O.toolResult) Y.push(O.toolResult);
                    Y.push(...O.postHooks)
                }
            }
            continue
        }
        if (dd1(H) && (H.attachment.hookEvent === "PreToolUse" || H.attachment.hookEvent === "PostToolUse")) continue;
        if (H.type === "user" && H.message.content[0]?.type === "tool_result") continue;
        if (H.type === "system" && H.subtype === "api_error") {
            let $ = Y.at(-1);
            if ($?.type === "system" && $.subtype === "api_error") Y[Y.length - 1] = H;
            else Y.push(H);
            continue
        }
        Y.push(H)
    }
    for (let H of q) Y.push(H);
    let w = Y.at(-1);
    return Y.filter((H) => H.type !== "system" || H.subtype !== "api_error" || H === w)
}

// READABLE (for understanding):
function normalizeDisplayMessages(messages, streamingToolUses) {
    // Pass 1: Build index of tool use groups
    const toolUseGroups = new Map(); // toolUseId → {toolUse, preHooks[], toolResult, postHooks[]}

    for (const msg of messages) {
        if (isToolUseMessage(msg)) {
            const toolUseId = msg.message.content[0]?.id;
            if (toolUseId) {
                if (!toolUseGroups.has(toolUseId)) {
                    toolUseGroups.set(toolUseId, { toolUse: null, preHooks: [], toolResult: null, postHooks: [] });
                }
                toolUseGroups.get(toolUseId).toolUse = msg;
            }
            continue;
        }
        if (isHookAttachment(msg) && msg.attachment.hookEvent === "PreToolUse") {
            getOrCreate(toolUseGroups, msg.attachment.toolUseID).preHooks.push(msg);
            continue;
        }
        if (msg.type === "user" && msg.message.content[0]?.type === "tool_result") {
            getOrCreate(toolUseGroups, msg.message.content[0].tool_use_id).toolResult = msg;
            continue;
        }
        if (isHookAttachment(msg) && msg.attachment.hookEvent === "PostToolUse") {
            getOrCreate(toolUseGroups, msg.attachment.toolUseID).postHooks.push(msg);
            continue;
        }
    }

    // Pass 2: Emit messages in logical order
    const output = [];
    const processedToolUseIds = new Set();

    for (const msg of messages) {
        if (isToolUseMessage(msg)) {
            const toolUseId = msg.message.content[0]?.id;
            if (toolUseId && !processedToolUseIds.has(toolUseId)) {
                processedToolUseIds.add(toolUseId);
                const group = toolUseGroups.get(toolUseId);
                if (group?.toolUse) {
                    output.push(group.toolUse);
                    output.push(...group.preHooks);
                    if (group.toolResult) output.push(group.toolResult);
                    output.push(...group.postHooks);
                }
            }
            continue;
        }
        if (isHookAttachment(msg)) continue;
        if (msg.type === "user" && msg.message.content[0]?.type === "tool_result") continue;
        if (msg.type === "system" && msg.subtype === "api_error") {
            const lastOutput = output[output.length - 1];
            if (lastOutput?.type === "system" && lastOutput.subtype === "api_error") {
                output[output.length - 1] = msg;
            } else {
                output.push(msg);
            }
            continue;
        }
        output.push(msg);
    }

    for (const streamingTool of streamingToolUses) {
        output.push(streamingTool);
    }

    const lastMsg = output[output.length - 1];
    return output.filter(msg =>
        msg.type !== "system" || msg.subtype !== "api_error" || msg === lastMsg
    );
}

// Mapping: t9q→normalizeDisplayMessages, A→messages, q→streamingToolUses,
// XJq→isToolUseMessage, dd1→isHookAttachment, K→toolUseGroups, Y→output, z→processedToolUseIds
```

### 6.1 Hook Grouping

The output ordering for each tool use execution is:
```
[Tool Use Message]        ← The assistant's tool call
[PreToolUse Hook 1]       ← Hooks run BEFORE the tool (if any)
[PreToolUse Hook 2]
[Tool Result Message]     ← The tool's output
[PostToolUse Hook 1]      ← Hooks run AFTER the tool (if any)
[PostToolUse Hook 2]
```

This mirrors the actual execution order: the hooks run in sequence, and the user sees the full execution chain displayed together.

**Key insight:** Without this grouping, hooks and results would appear in message-append order, which can be confusing if hooks produce output that appears between unrelated messages.

### 6.2 API Error Deduplication

API errors (type: `"system"`, subtype: `"api_error"`) are deduplicated: only the most recent one is displayed. This prevents a growing stack of identical "rate limit exceeded" messages when the LLM is retried multiple times.

---

## 7. Stage 5: Tool Result Grouping (q9q)

`groupToolResults` (`q9q`) collapses multiple executions of the same tool into a single display entry:

```javascript
// ============================================
// groupToolResults - Collapse repeated tool executions
// Location: chunks.160.mjs:1849-1920
// ============================================

// READABLE (for understanding):
function groupToolResults(messages, tools, verboseMode = false) {
    // In verbose/transcript mode: no grouping (show all individual executions)
    if (verboseMode) return { messages };

    // Find tools that opt-in to grouping
    const groupableToolNames = new Set(
        tools.filter(t => t.renderGroupedToolUse).map(t => t.name)
    );

    // Step 1: Group messages by (assistantMessageId, toolName)
    const groups = new Map();
    for (const msg of messages) {
        const toolInfo = extractToolInfo(msg);
        if (toolInfo && groupableToolNames.has(toolInfo.toolName)) {
            const key = `${toolInfo.messageId}:${toolInfo.toolName}`;
            const group = groups.get(key) ?? [];
            group.push(msg);
            groups.set(key, group);
        }
    }

    // Step 2: Only keep groups with 2+ executions
    const finalGroups = new Map();
    const groupedToolUseIds = new Set();
    for (const [key, group] of groups) {
        if (group.length >= 2) {
            finalGroups.set(key, group);
            group.forEach(msg => {
                const info = extractToolInfo(msg);
                if (info) groupedToolUseIds.add(info.toolUseId);
            });
        }
    }

    // Step 3: Map tool_use_id → tool_result message
    const resultMap = new Map();
    for (const msg of messages) {
        if (msg.type === "user") {
            for (const block of msg.message.content) {
                if (block.type === "tool_result" && groupedToolUseIds.has(block.tool_use_id)) {
                    resultMap.set(block.tool_use_id, msg);
                }
            }
        }
    }

    // Step 4: Build output replacing group members with single "grouped_tool_use"
    const output = [];
    const emittedGroups = new Set();
    for (const msg of messages) {
        const toolInfo = extractToolInfo(msg);
        if (toolInfo) {
            const key = `${toolInfo.messageId}:${toolInfo.toolName}`;
            const group = finalGroups.get(key);
            if (group) {
                if (!emittedGroups.has(key)) {
                    emittedGroups.add(key);
                    const displayMsg = group[0];
                    const results = group.map(m => resultMap.get(
                        extractToolInfo(m)?.toolUseId
                    )).filter(Boolean);
                    output.push({
                        type: "grouped_tool_use",
                        toolName: toolInfo.toolName,
                        messages: group,
                        results,
                        displayMessage: displayMsg,
                        uuid: `grouped-${displayMsg.uuid}`,
                        timestamp: displayMsg.timestamp,
                        messageId: toolInfo.messageId
                    });
                }
                continue;
            }
        }
        if (msg.type === "user") {
            const toolResults = msg.message.content.filter(b => b.type === "tool_result");
            if (toolResults.length > 0 &&
                toolResults.every(r => groupedToolUseIds.has(r.tool_use_id))) {
                continue;
            }
        }
        output.push(msg);
    }

    return { messages: output };
}

// Mapping: q9q→groupToolResults, A→messages, q→tools, K→verboseMode,
// Y→groupableToolNames, QbA→extractToolInfo, w→finalGroups, O→output
```

**Opt-in mechanism:** Only tools with `renderGroupedToolUse: true` in their tool definition participate in grouping. This is a tool-level configuration, not a universal behavior. For example, a tool that reads many small files might enable grouping; a tool that executes one important command would not.

**When grouping happens:** Only when 2 or more executions of the same tool appear within the same assistant message ID. This means running `ReadFile` 5 times in one agent turn produces a single `grouped_tool_use` entry showing "5 read operations."

**In verbose/transcript mode:** `q9q` is called with `verbose=true`, which immediately returns `{ messages }` unchanged. All individual tool executions are shown.

---

## 8. Stage 6: Pagination and Transcript Mode

In the `MessageList` component, before rendering:

```javascript
// chunks.161.mjs:712-722

// Transcript mode AND not showing all → truncate to last 10
const shouldPaginate = isTranscriptMode && !showAllInTranscript;
const displayMessages = shouldPaginate
    ? filteredMessages.slice(-10)   // TRANSCRIPT_MAX_MESSAGES = 10
    : filteredMessages;

const hasTruncated = shouldPaginate && filteredMessages.length > 10;
```

**Transcript mode details:**
- `screen === "transcript"` (toggled by `Ctrl+R` or equivalent)
- When transcript is open: ALL messages shown (including `isVisibleInTranscriptOnly` messages, pre-compact messages)
- By default: only last 10 messages (avoids overwhelming the terminal)
- User can expand: "show all" button reveals all transcript messages

**Why 10?** Terminal height is typically 24-50 lines. With average 2-5 lines per message, 10 messages fills most of the screen without scrolling. This is a deliberate UX choice for the "quick review" use case.

---

## 9. Stage 7: MessageList Rendering (P8z)

`P8z` is the memoized wrapper around the `g91` component definition:

```javascript
// chunks.161.mjs:587 - outer memoization wrapper
let P8z = (A) => {
    let q = e(85); // React Compiler cache with 85 slots
    // ... deep equality checks on props
    return g91(A);
}
```

**What g91 renders:**
1. **Logo / empty state** - When no messages, shows the Claude Code ASCII logo
2. **Truncation indicator** - "N messages above" when in truncated transcript mode
3. **Message elements** - `messages.map(msg => createElement(n9q, { message: msg, ... }))`
4. **Streaming thinking** - If `streamingThinking` is active, shows at bottom

### 9.1 Memoization Strategy

`MessageList` uses **three different equality checks** to decide when to re-render:

```javascript
// chunks.161.mjs:854-866 (React Compiler memoization guards)

// Deep check: streaming tool uses (must compare contentBlock IDs)
if (streamingToolUses1.length !== streamingToolUses2.length) return false;
for (let i = 0; i < streamingToolUses1.length; i++) {
    if (streamingToolUses1[i].contentBlock.id !== streamingToolUses2[i].contentBlock.id) return false;
    if (streamingToolUses1[i].unparsedToolInput !== streamingToolUses2[i].unparsedToolInput) return false;
}

// Shallow check: inProgressToolUseIDs (Set comparison by size + first element)
if (ids1.size !== ids2.size) return false;
if (ids1.values().next().value !== ids2.values().next().value) return false;

// Shallow check: tool names (array comparison)
if (tools1.length !== tools2.length) return false;
if (tools1[0]?.name !== tools2[0]?.name) return false;
```

**Why different depths?** Streaming tool uses contain `unparsedToolInput` which changes character by character. A deep equality check would be too expensive; only checking what changed (ID + input text) is sufficient. `inProgressToolUseIDs` is a Set that only changes size or first element, making shallow checks fast.

**useDeferredValue:** At the REPL level, `messages` is passed through `useDeferredValue`:
```javascript
let T6 = dA.useDeferredValue(W4);
```
This means the `MessageList` receives a potentially-stale snapshot of messages during rapid updates, allowing React to prioritize keeping the input box responsive. The deferred value catches up between frames.

**React Compiler memo cache (v2.1.76):** The `e(N)` pattern used throughout MessageList and its descendants uses flat arrays allocated by the React Compiler. In v2.1.76, the compiler applies this pattern more aggressively to intermediate computations within the rendering pipeline stages, reducing allocation overhead compared to `useMemo` with closure capture.

### 9.2 Streaming Tool Uses Integration

`streamingToolUses` are appended to the message array INSIDE `normalizeDisplayMessages`:

```javascript
// At end of t9q:
for (let streamingTool of streamingToolUses) {
    output.push(streamingTool);
}
```

But the `MessageList` component also filters out streaming entries that have already been committed as complete messages:

```javascript
// chunks.161.mjs:696-706
const inProgressIds = new Set(inProgressToolUseIDs);
const activeStreamingTools = streamingToolUses.filter(tu => {
    // Remove if tool use ID is already in committed messages
    if (messages.some(msg =>
        msg.type === "assistant" &&
        msg.message.content[0]?.type === "tool_use" &&
        msg.message.content[0].id === tu.contentBlock.id
    )) return false;
    // Remove if tool use has completed (in inProgressToolUseIDs)
    if (inProgressIds.has(tu.contentBlock.id)) return false;
    return true;
});
```

This filtering prevents duplicate display: a tool use should show as "streaming" OR as "committed", never both.

### 9.3 Thinking Block Lifecycle

Thinking blocks are displayed with a special 30-second timer:

```javascript
// chunks.188.mjs:87-97 - streamingThinking state with timer
let [U8, R4] = dA.useState(null);
useEffect(() => {
    if (U8 && !U8.isStreaming && U8.streamingEndedAt) {
        // Calculate remaining display time
        let remainingMs = 30000 - (Date.now() - U8.streamingEndedAt);
        if (remainingMs > 0) {
            let timer = setTimeout(() => R4(null), remainingMs);
            return () => clearTimeout(timer);
        } else {
            R4(null); // Already expired, clear immediately
        }
    }
}, [U8]);
```

**Lifecycle:**
1. `content_block_start.thinking` → `setStreamingThinking({ thinking: "", isStreaming: true })`
2. `thinking_delta` events → append to `thinking` text
3. Assistant message arrives → `setStreamingThinking({ thinking: ..., isStreaming: false, streamingEndedAt: Date.now() })`
4. Effect fires → set 30-second timer
5. Timer expires → `setStreamingThinking(null)` → thinking block disappears from UI

This "fade after 30 seconds" UX pattern lets the user see the reasoning briefly without it cluttering the conversation permanently. In transcript view, the thinking block is preserved in the message object and shown via the `hidePastThinking: false` prop.

---

## 10. Message Type Reference

All message types that flow through the pipeline:

| Type | Subtype | Source | Renders As | Filtered? |
|------|---------|--------|------------|-----------|
| `user` | - | User input | User message bubble | Only if `isMeta:true` |
| `user` | - | Tool result | Tool result block | Grouped with tool use |
| `user` | - | System reminder | Hidden | Yes (`isMeta:true`) |
| `assistant` | - | LLM response | Assistant message | No |
| `assistant` | - | Tool use call | Tool use card | Grouped with result |
| `attachment` | - | System reminder | Converted to user | Processed in Stage 1 |
| `system` | `compact_boundary` | Compaction | Hidden after conversion | Yes |
| `system` | `api_error` | Error | Error card | Only last one |
| `system` | `duration` | Query timeout | Duration banner | No |
| `progress` | - | Streaming | Nothing | Yes (Stage 3) |
| `grouped_tool_use` | - | Stage 5 | Grouped tool card | No (created by pipeline) |

**Note:** `type: "attachment"` messages are an internal envelope type that only exists between Stage 0 (streaming) and Stage 1 (normalization). They are never displayed directly.

---

## 11. Performance Architecture

Several performance optimizations reduce re-renders during heavy streaming:

**1. Deferred value for messages:**
```javascript
let T6 = useDeferredValue(W4); // Messages shown with a frame's delay
```
Prevents blocking the input box during rapid message appends.

**2. React Compiler memoization (`e(N)` pattern):**
```javascript
// Seen throughout: e(6), e(85), e(3) etc.
let cache = useCache(85); // React Compiler flat cache array
if (cache[0] !== props.messages) {
    cache[1] = computedValue;
    cache[0] = props.messages;
}
```
The React Compiler transforms function components to use flat arrays instead of `useMemo`. Slot 0 stores the dependency, slot 1 stores the cached result. This is faster than `useMemo` because it avoids closure allocation.

**v2.1.76 improvement:** The React Compiler's application scope was expanded to cover more intermediate functions in the rendering pipeline, reducing memoization boundary crossings for complex message lists.

**3. Replay state truncation:**
```javascript
// When replaying a message restore:
let NY = fA ? T6.slice(0, fA.messagesLength) : T6;
let SY1 = fA ? gq.slice(0, fA.streamingToolUsesLength) : gq;
```
During message speculation/replay, the displayed messages are truncated to the restore point, preventing re-rendering of post-restore content.

**4. Message ref backing:**
```javascript
let c1 = useRef(W4);
let X6 = useCallback((updater) => {
    if (typeof updater === "function") {
        F1(prev => { const next = updater(prev); c1.current = next; return next; });
    } else {
        c1.current = updater;
        F1(updater);
    }
}, []);
```
`c1.current` always has the latest messages even in stale closures, without needing to add `messages` to every callback's dependency array.

**5. Spinner isolation (v2.1.76):**
The spinner component runs in its own React subtree with a 50ms `setInterval`. Previously, spinner frame updates caused the parent `MessageList` to evaluate its memoization guards on every tick. The isolation prevents this cascade, reducing per-frame render work during streaming by eliminating spinner-driven re-renders from the message list.
