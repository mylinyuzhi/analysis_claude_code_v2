# Message Rendering Pipeline

> Related Symbols:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `MessageList` (`veY`/`G_6`) - Memoized message list component, chunks.161.mjs:3/355
- `handleToolUseStream` (`xN6`) - Core streaming event processor, chunks.173.mjs:2384-2488
- `shouldShowMessageInChat` (`XV6`) - Core UI visibility filter, chunks.185.mjs:1692-1702
- `normalizeMessages` (`cM`) - Transforms raw messages to render format, chunks.173.mjs:1999
- `reorderAttachments` (`dzz`) - Reorder attachments before user messages, chunks.173.mjs
- Compact boundary detection - Inline pattern at chunks.150.mjs:2523

---

## Table of Contents

- [1. Pipeline Overview](#1-pipeline-overview)
- [2. Stage 0: Streaming Input](#2-stage-0-streaming-input)
- [3. Stage 1: Message Normalization](#3-stage-1-message-normalization)
- [4. Stage 2: Compaction Filter](#4-stage-2-compaction-filter)
- [5. Stage 3: Visibility Filter](#5-stage-3-visibility-filter)
- [6. Stage 4: Display Normalization](#6-stage-4-display-normalization)
- [7. Stage 5: Tool Result Grouping](#7-stage-5-tool-result-grouping)
- [8. Stage 6: Pagination and Transcript Mode](#8-stage-6-pagination-and-transcript-mode)
- [9. Stage 7: MessageList Rendering](#9-stage-7-messagelist-rendering)
- [10. Message Type Reference](#10-message-type-reference)
- [11. Performance Architecture](#11-performance-architecture)
- [12. System Reminder Integration](#12-system-reminder-integration)
- [13. Streaming Event Processing (xN6)](#13-streaming-event-processing-xn6)
- [14. Cross-Module Data Flow Summary](#14-cross-module-data-flow-summary)
- [15. v2.1.76 Rendering Fixes](#15-v2176-rendering-fixes)

---

## 1. Pipeline Overview

The rendering pipeline transforms raw LLM output into terminal display through 7 distinct stages:

```
┌──────────────────────────────────────────────────────────────────────┐
│                    MESSAGE RENDERING PIPELINE                         │
│                                                                       │
│  Stage 0: STREAMING (xN6)                                            │
│  LLM events → setMessages / setStreamingToolUses / setStreamMode     │
│                                                                       │
│  Stage 1: NORMALIZATION                                              │
│  Raw messages → Attachment reorder → Tool input normalize → Merge    │
│                                                                       │
│  Stage 2: COMPACTION FILTER                                          │
│  Hide pre-compact messages (unless transcript view)                  │
│                                                                       │
│  Stage 3: VISIBILITY FILTER                                          │
│  Remove isMeta:true messages + progress type messages                │
│                                                                       │
│  Stage 4: DISPLAY NORMALIZATION                                      │
│  Group: tool_use → pre_hooks → tool_result → post_hooks              │
│                                                                       │
│  Stage 5: TOOL GROUPING                                              │
│  Collapse repeated executions of same tool into one entry            │
│                                                                       │
│  Stage 6: PAGINATION                                                 │
│  Transcript mode: last 10 messages (unless "show all")               │
│                                                                       │
│  Stage 7: REACT RENDER (veY)                                         │
│  Map each message to MessageComponent                                │
│  [chunks.161.mjs:3]                                                  │
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

## 2. Stage 0: Streaming Input

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

## 3. Stage 1: Message Normalization

`normalizeMessages` is the "pre-processing" stage that converts the raw internal message format into a render-ready format.

```javascript
// ============================================
// normalizeMessages (cM) - Transform raw messages for display
// Location: chunks.173.mjs:1999-2150
//
// IMPORTANT CORRECTION: Previous documentation incorrectly mapped WJ to normalizeMessages.
// WJ at chunks.5.mjs:945 is a Zod schema builder function, NOT normalizeMessages.
// The correct symbol is cM at chunks.173.mjs:1999.
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
    // ... tool type mapping for attachments
    let w = [];
    Y.filter((M) => {
        if (M.type === "progress" || M.type === "system" && !gx8(M) || rn8(M)) return !1;
        return !0
    }).forEach((M) => {
        switch (M.type) {
            case "system": { /* handle compact_boundary */ }
            case "user": { /* filter tool references, merge consecutive */ }
            case "assistant": { /* normalize tool inputs */ }
            case "attachment": { /* convert to user message format */ }
        }
    });
    return w
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

// Mapping: cM→normalizeMessages, A→messages, q→availableTools, K→toolNames,
//          Y→reorderedMessages, wzz→reorderAttachments, w→normalized
// VALIDATED: cM at chunks.173.mjs:1999 is the correct normalizeMessages function.
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

## 4. Stage 2: Compaction Filter

In normal chat view (not transcript), messages before the last compaction boundary are hidden:

```javascript
// ============================================
// findCompactBoundaryIndex - Find the last compaction boundary
// Location: chunks.150.mjs:2523 (inline pattern)
// ============================================

// ORIGINAL (for source lookup):
// In chunks.150.mjs:2523, used inline:
_ = z.findLastIndex((O) => O.type === "system" && ("subtype" in O) && O.subtype === "compact_boundary")

// READABLE (for understanding):
const boundaryIndex = messages.findLastIndex(
    (msg) => msg.type === "system" && msg.subtype === "compact_boundary"
);

// Then slice to show only post-boundary:
const visibleMessages = boundaryIndex >= 0 ? messages.slice(boundaryIndex) : messages;
```

**Why start AT the boundary, not after it?** The compact boundary message itself is type `"system"` with `subtype: "compact_boundary"` and contains the compact summary. It needs to be included so the `normalizeDisplayMessages` stage can see it. The `isNotProgress` filter in Stage 3 does NOT filter out system messages - they pass through to `normalizeDisplayMessages` where they are handled specially.

**In transcript view:** The compact boundary detection is bypassed. The full `allMessages` array is passed to the filter chain, giving users access to the complete history including pre-compact messages.

---

## 5. Stage 3: Visibility Filter

The visibility filter system determines which messages appear in the UI. This is implemented through multiple functions working together.

### 5.0 Actual Message Filtering in MessageList

The primary filtering happens in `MessageList` (`veY`) at chunks.161.mjs:40:

```javascript
// ============================================
// MessageList - Actual filtering logic
// Location: chunks.161.mjs:40
// ============================================

// ORIGINAL (for source lookup):
if (q[0] !== K) Q = JM(K).filter(Gi6), q[0] = K, q[1] = Q;
else Q = q[1];
let U = Q,

// READABLE (for understanding):
// Step 1: Flatten multi-content messages (JM)
// Step 2: Filter empty messages (Gi6)
if (cacheInvalidated) {
    flattenedMessages = flattenMessageContent(messages);
    filteredMessages = flattenedMessages.filter(filterEmptyMessages);
    cache[0] = messages;
    cache[1] = filteredMessages;
} else {
    filteredMessages = cache[1];
}

// Mapping: JM→flattenMessageContent, Gi6→filterEmptyMessages
```

**Important Discovery (2026-03-22):** The `isMeta` flag is NOT filtered out by `Gi6`. Messages with `isMeta: true` are included in the message list but rendered as empty/nothing by the component tree. This is a **rendering omission** pattern, not a **list filtering** pattern.

### 5.1 isSpecialMessageType (Hz6) Deep Analysis

The `Hz6` function detects special message types that should be hidden from certain UI contexts:

```javascript
// ============================================
// isSpecialMessageType - Detect special message patterns
// Location: chunks.173.mjs:1275-1277
// ============================================

// ORIGINAL (for source lookup):
function Hz6(A) {
    return A.type !== "progress" && A.type !== "attachment" && A.type !== "system" &&
           Array.isArray(A.message.content) &&
           A.message.content[0]?.type === "text" &&
           TF6.has(A.message.content[0].text)
}

// READABLE (for understanding):
function isSpecialMessageType(message) {
    // Only check user/assistant messages (not progress/attachment/system)
    if (message.type === "progress" ||
        message.type === "attachment" ||
        message.type === "system") {
        return false;
    }

    // Must have array content with text first element
    if (!Array.isArray(message.message.content)) return false;
    if (message.message.content[0]?.type !== "text") return false;

    // Check if text matches a known special pattern
    return SPECIAL_MESSAGE_PATTERNS.has(message.message.content[0].text);
}

// Mapping: Hz6→isSpecialMessageType, TF6→SPECIAL_MESSAGE_PATTERNS (Set)
```

**What it does:** Detects messages whose content matches special patterns stored in the `TF6` Set.

**How it works:**
1. **Type exclusion** - Skip progress/attachment/system messages (they have special handling)
2. **Content structure check** - Verify message has array content with text first
3. **Pattern matching** - Check if text matches known special patterns in `TF6` Set

**Why this approach:**
- The `TF6` Set contains specific message texts that should be hidden
- Used by `XV6` (shouldShowMessageInChat) to filter certain message types
- Separates pattern detection from visibility logic for maintainability

**Key insight:** The `TF6` Set is populated with specific strings that represent special message types. When a message's first text content matches one of these patterns, it's flagged as "special" and hidden from certain UI contexts.

### 5.1.1 TF6 Set - Special Message Patterns (Complete Reference)

The `TF6` Set is defined at chunks.174.mjs:1099 and contains 5 special message text patterns:

```javascript
// ============================================
// TF6 - Special Message Types Set Definition
// Location: chunks.174.mjs:1099
// ============================================

// ORIGINAL (for source lookup):
TF6 = new Set([D66, P0, R96, h96, N36]);

// READABLE (for understanding):
const SPECIAL_MESSAGE_TYPES = new Set([
    INTERRUPTED_BY_USER,        // D66
    INTERRUPTED_FOR_TOOL_USE,   // P0
    USER_DECLINED_ACTION,       // R96
    USER_DECLINED_TOOL_USE,     // h96
    NO_RESPONSE_REQUESTED       // N36
]);

// Mapping: TF6→SPECIAL_MESSAGE_TYPES
```

**Complete Symbol Reference:**

| Symbol | Readable | Value | Location | Trigger |
|--------|----------|-------|----------|---------|
| `D66` | INTERRUPTED_BY_USER | `"[Request interrupted by user]"` | chunks.174.mjs:984 | User presses Escape during response |
| `P0` | INTERRUPTED_FOR_TOOL_USE | `"[Request interrupted by user for tool use]"` | chunks.174.mjs:986 | User interrupts during tool execution |
| `R96` | USER_DECLINED_ACTION | `"The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed."` | chunks.174.mjs:988 | User declines a permission/action |
| `h96` | USER_DECLINED_TOOL_USE | `"The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed."` | chunks.174.mjs:990 | User rejects tool permission |
| `N36` | NO_RESPONSE_REQUESTED | `"No response requested."` | chunks.174.mjs:1007 | System-generated placeholder |

**Why These Patterns Are Hidden:**

1. **Not meaningful conversation history** - These messages represent interruptions and cancellations, not actual user input or LLM output
2. **UI clutter prevention** - Showing "[Request interrupted by user]" for every escape press would create noise
3. **Context preservation** - The interruption is reflected in the agent state; the message text is an internal marker
4. **Message selector clarity** - Users shouldn't be able to "resubmit" an interrupted message

**Usage in Hz6:**
```javascript
// Hz6 checks if a message's first text content matches TF6
function Hz6(message) {
    // ... type checks ...
    return TF6.has(message.message.content[0].text);
}
```

**Integration with XV6:**
The `XV6` (shouldShowMessageInChat) function calls `Hz6` to filter these special messages from the message selector UI.

### 5.2 shouldShowMessageInChat (XV6) Full Analysis

The `XV6` function is the extended visibility filter used primarily for message selection contexts:

```javascript
// ============================================
// shouldShowMessageInChat - Extended visibility filter
// Location: chunks.185.mjs:1692-1702
// ============================================

// ORIGINAL (for source lookup):
function XV6(A) {
    if (A.type !== "user") return !1;
    if (Array.isArray(A.message.content) && A.message.content[0]?.type === "tool_result") return !1;
    if (Hz6(A)) return !1;
    if (A.isMeta) return !1;
    let q = A.message.content,
        K = typeof q === "string" ? null : q[q.length - 1],
        Y = typeof q === "string" ? q.trim() : K && Yhq(K) ? K.text.trim() : "";
    if (Y.indexOf(`<${WP}>`) !== -1 || Y.indexOf(`<${oA6}>`) !== -1 ||
        Y.indexOf(`<${rHA}>`) !== -1 || Y.indexOf(`<${oHA}>`) !== -1 ||
        Y.indexOf(`<${EH}>`) !== -1 || Y.indexOf(`<${vV}>`) !== -1 ||
        Y.indexOf(`<${fj}`) !== -1) return !1;
    return !0
}

// READABLE (for understanding):
function shouldShowMessageInChat(message) {
    // Phase 1: Type check - only process user messages
    if (message.type !== "user") return false;

    // Phase 2: Content type filter - hide tool_result messages
    if (Array.isArray(message.message.content) &&
        message.message.content[0]?.type === "tool_result") return false;

    // Phase 3: Special type detection
    if (isSpecialMessageType(message)) return false;

    // Phase 4: isMeta filter - CRITICAL for system reminders
    if (message.isMeta) return false;

    // Phase 5: XML tag detection
    let lastContent = extractLastTextContent(message.message.content);
    if (containsSystemXmlTags(lastContent)) return false;

    return true;
}

// Mapping: XV6→shouldShowMessageInChat, Hz6→isSpecialMessageType,
//          WP/oA6/rHA/oHA/EH/vV/fj→XML tag constants
```

**What it does:** Determines if a user message should be shown in message selection contexts (like message selector for editing/resubmitting).

**How it works:**
1. **User messages only** - Returns false for all non-user messages (opposite of expected behavior!)
2. **Tool result exclusion** - Hides messages that start with tool_result
3. **Special pattern exclusion** - Uses `Hz6` to detect special types
4. **isMeta exclusion** - Critical filter for system reminders
5. **XML tag exclusion** - Filters messages containing system XML tags

**Why this approach:**
- Used primarily for message selection, not main chat rendering
- Returns false for non-user messages because selection only applies to user messages
- Multiple exclusion criteria ensure only "real" user messages are selectable

**Key insight:** This function's name is misleading - it doesn't filter the main chat display. Instead, it filters which messages appear in the message selector UI. The actual chat rendering doesn't filter by `isMeta` at the list level; instead, `isMeta` messages are rendered as empty/nothing.

### 5.3 Visibility Decision Matrix

| Message Type | isMeta | Hz6 | tool_result | XML Tags | XV6 Result | Chat Display |
|--------------|--------|-----|-------------|----------|------------|--------------|
| user | false | false | false | false | **true** | Shown |
| user | **true** | false | false | false | false | Hidden (rendered as nothing) |
| user | false | **true** | false | false | false | Hidden |
| user | false | false | **true** | false | false | Hidden |
| user | false | false | false | **true** | false | Hidden |
| assistant | - | - | - | - | false | Shown (different path) |
| system | - | - | - | - | false | Special handling |
| progress | - | - | - | - | false | Filtered by Gi6 |
| attachment | - | - | - | - | false | Special handling |

### 5.4 filterEmptyMessages (Gi6) Deep Analysis

```javascript
// ============================================
// filterEmptyMessages - Core message content filter
// Location: chunks.173.mjs:1502-1509
// ============================================

// ORIGINAL (for source lookup):
function Gi6(A) {
    if (A.type === "progress" || A.type === "attachment" || A.type === "system") return !0;
    if (typeof A.message.content === "string") return A.message.content.trim().length > 0;
    if (A.message.content.length === 0) return !1;
    if (A.message.content.length > 1) return !0;
    if (A.message.content[0].type !== "text") return !0;
    return A.message.content[0].text.trim().length > 0 && A.message.content[0].text !== wE && A.message.content[0].text !== P0
}

// READABLE (for understanding):
function filterEmptyMessages(message) {
    // Special types always pass through
    if (message.type === "progress") return true;   // Streaming progress
    if (message.type === "attachment") return true; // File/context attachments
    if (message.type === "system") return true;     // System markers

    // String content: check if non-empty after trim
    if (typeof message.message.content === "string") {
        return message.message.content.trim().length > 0;
    }

    // Array content checks
    if (message.message.content.length === 0) return false;  // Empty array
    if (message.message.content.length > 1) return true;      // Multi-block always shown

    // Single block: check if text with actual content
    if (message.message.content[0].type !== "text") return true;  // Non-text blocks pass

    // Text block: must be non-empty and not a special marker
    const text = message.message.content[0].text.trim();
    return text.length > 0 && text !== SPECIAL_MARKER_1 && text !== SPECIAL_MARKER_2;
}

// Mapping: Gi6→filterEmptyMessages, wE→SPECIAL_MARKER_1, P0→SPECIAL_MARKER_2
```

**Why this filter exists:**
- Prevents empty user messages from cluttering the UI
- Preserves special types (progress, attachment, system) that have display meaning even without text content
- Handles edge cases like single-block text with only whitespace

### 5.4.1 flattenMessages (JM) Complete Analysis

The `flattenMessages` function is a critical preprocessing step that splits multi-block messages into individual renderable units:

```javascript
// ============================================
// flattenMessages (JM) - Split messages into individual content blocks
// Location: chunks.173.mjs:1516-1581
// ============================================

// ORIGINAL (for source lookup):
function JM(A) {
    let q = !1;
    return A.flatMap((K) => {
        switch (K.type) {
            case "assistant":
                return q = q || K.message.content.length > 1, K.message.content.map((Y, z) => {
                    let _ = q ? qr6(K.uuid, z) : K.uuid;
                    return {
                        type: "assistant",
                        timestamp: K.timestamp,
                        message: {
                            ...K.message,
                            content: [Y],
                            context_management: K.message.context_management ?? null
                        },
                        isMeta: K.isMeta,
                        requestId: K.requestId,
                        uuid: _,
                        error: K.error,
                        isApiErrorMessage: K.isApiErrorMessage
                    }
                });
            case "attachment":
                return [K];
            case "progress":
                return [K];
            case "system":
                return [K];
            case "user": {
                if (typeof K.message.content === "string") {
                    let z = q ? qr6(K.uuid, 0) : K.uuid;
                    return [{
                        ...K,
                        uuid: z,
                        message: {
                            ...K.message,
                            content: [{
                                type: "text",
                                text: K.message.content
                            }]
                        }
                    }]
                }
                q = q || K.message.content.length > 1;
                let Y = 0;
                return K.message.content.map((z, _) => {
                    let w = z.type === "image",
                        O = w && K.imagePasteIds ? K.imagePasteIds[Y] : void 0;
                    if (w) Y++;
                    return {
                        ...p1({
                            content: [z],
                            toolUseResult: K.toolUseResult,
                            mcpMeta: K.mcpMeta,
                            isMeta: K.isMeta,
                            isVisibleInTranscriptOnly: K.isVisibleInTranscriptOnly,
                            timestamp: K.timestamp,
                            imagePasteIds: O !== void 0 ? [O] : void 0
                        }),
                        uuid: q ? qr6(K.uuid, _) : K.uuid
                    }
                })
            }
        }
    })
}

// READABLE (for understanding):
function flattenMessages(messages) {
    let needsUniqueUuids = false;

    return messages.flatMap((msg) => {
        switch (msg.type) {
            case "assistant":
                // Mark if multi-block (needs UUID suffix for React keys)
                needsUniqueUuids = needsUniqueUuids || msg.message.content.length > 1;

                // Split each content block into its own message object
                return msg.message.content.map((block, index) => {
                    const uuid = needsUniqueUuids
                        ? appendUuidSuffix(msg.uuid, index)  // e.g., "abc123000000000001"
                        : msg.uuid;
                    return {
                        type: "assistant",
                        timestamp: msg.timestamp,
                        message: {
                            ...msg.message,
                            content: [block],  // Single block, not array
                            context_management: msg.message.context_management ?? null
                        },
                        isMeta: msg.isMeta,
                        requestId: msg.requestId,
                        uuid,
                        error: msg.error,
                        isApiErrorMessage: msg.isApiErrorMessage
                    };
                });

            case "attachment":
            case "progress":
            case "system":
                // These types pass through unchanged
                return [msg];

            case "user":
                // Handle string content (legacy format)
                if (typeof msg.message.content === "string") {
                    const uuid = needsUniqueUuids ? appendUuidSuffix(msg.uuid, 0) : msg.uuid;
                    return [{
                        ...msg,
                        uuid,
                        message: {
                            ...msg.message,
                            content: [{ type: "text", text: msg.message.content }]
                        }
                    }];
                }

                // Handle array content
                needsUniqueUuids = needsUniqueUuids || msg.message.content.length > 1;
                let imageIndex = 0;

                return msg.message.content.map((block, index) => {
                    const isImage = block.type === "image";
                    const imagePasteId = isImage && msg.imagePasteIds
                        ? msg.imagePasteIds[imageIndex++]
                        : undefined;

                    return {
                        ...createUserMessage({
                            content: [block],
                            toolUseResult: msg.toolUseResult,
                            mcpMeta: msg.mcpMeta,
                            isMeta: msg.isMeta,
                            isVisibleInTranscriptOnly: msg.isVisibleInTranscriptOnly,
                            timestamp: msg.timestamp,
                            imagePasteIds: imagePasteId !== undefined ? [imagePasteId] : undefined
                        }),
                        uuid: needsUniqueUuids ? appendUuidSuffix(msg.uuid, index) : msg.uuid
                    };
                });
        }
    });
}

// Mapping: JM→flattenMessages, qr6→appendUuidSuffix, p1→createUserMessage
```

**What it does:** Transforms a message list where each message may contain multiple content blocks into a flat list where each item has exactly one content block. This enables React to render each block independently with proper keying.

**How it works:**
1. **Type-based branching** - Switch on message type to handle each appropriately
2. **UUID disambiguation** - When a message has multiple blocks, append a suffix to the UUID so each block has a unique React key
3. **String normalization** - Convert legacy string content to `[{type: "text", text: ...}]` format
4. **Image paste ID tracking** - Preserve image paste IDs for image blocks during flattening
5. **Pass-through for special types** - attachment, progress, system messages pass unchanged

**Why this approach:**
- **React key stability** - Each content block needs a unique key for React's reconciliation
- **Independent rendering** - Each block type (text, tool_use, image) renders differently
- **UUID suffix strategy** - `qr6(uuid, index)` appends a 12-digit hex suffix, e.g., `"abc123000000000001"`
- **Lazy UUID generation** - Only generates suffixes when there are actually multi-block messages

**Key insight:** The `needsUniqueUuids` flag is set globally across the entire message list, not per-message. This means once ANY message has multiple blocks, ALL subsequent message blocks get suffixed UUIDs. This ensures consistency and prevents React key collisions across the entire rendered list.

### 5.5 groupToolsWithHooks (pjq) Deep Analysis

This function reorganizes messages so that tool executions appear with their associated hooks in a logical sequence:

```javascript
// ============================================
// groupToolsWithHooks - Reorder tool uses with hooks
// Location: chunks.173.mjs:1591-1669
// ============================================

// ORIGINAL (for source lookup):
function pjq(A, q) {
    let K = new Map;
    for (let w of A) {
        if (DTq(w)) {
            let O = w.message.content[0]?.id;
            if (O) {
                if (!K.has(O)) K.set(O, { toolUse: null, preHooks: [], toolResult: null, postHooks: [] });
                K.get(O).toolUse = w;
            }
            continue;
        }
        if (rr6(w) && w.attachment.hookEvent === "PreToolUse") {
            let O = w.attachment.toolUseID;
            if (!K.has(O)) K.set(O, { toolUse: null, preHooks: [], toolResult: null, postHooks: [] });
            K.get(O).preHooks.push(w);
            continue;
        }
        // ... similar for tool_result and PostToolUse
    }
    // Second pass: reorder output
    let Y = [], z = new Set;
    for (let w of A) {
        if (DTq(w)) {
            let O = w.message.content[0]?.id;
            if (O && !z.has(O)) {
                z.add(O);
                let $ = K.get(O);
                if ($ && $.toolUse) {
                    Y.push($.toolUse);
                    Y.push(...$.preHooks);
                    if ($.toolResult) Y.push($.toolResult);
                    Y.push(...$.postHooks);
                }
            }
            continue;
        }
        // Skip hooks that were already added
        if (rr6(w) && (w.attachment.hookEvent === "PreToolUse" || w.attachment.hookEvent === "PostToolUse")) continue;
        if (w.type === "user" && w.message.content[0]?.type === "tool_result") continue;
        Y.push(w);
    }
    for (let w of q) Y.push(w);
    return Y;
}

// READABLE (for understanding):
function groupToolsWithHooks(messages, streamingToolUses) {
    // Pass 1: Build index by tool use ID
    const toolGroups = new Map(); // id → {toolUse, preHooks[], toolResult, postHooks[]}

    for (const msg of messages) {
        if (isAssistantToolUse(msg)) {
            const id = msg.message.content[0]?.id;
            if (id) {
                getOrCreate(toolGroups, id).toolUse = msg;
            }
            continue;
        }
        if (isHookAttachment(msg) && msg.attachment.hookEvent === "PreToolUse") {
            getOrCreate(toolGroups, msg.attachment.toolUseID).preHooks.push(msg);
            continue;
        }
        if (msg.type === "user" && msg.message.content[0]?.type === "tool_result") {
            getOrCreate(toolGroups, msg.message.content[0].tool_use_id).toolResult = msg;
            continue;
        }
        if (isHookAttachment(msg) && msg.attachment.hookEvent === "PostToolUse") {
            getOrCreate(toolGroups, msg.attachment.toolUseID).postHooks.push(msg);
            continue;
        }
    }

    // Pass 2: Output in grouped order
    const output = [];
    const seen = new Set();

    for (const msg of messages) {
        if (isAssistantToolUse(msg)) {
            const id = msg.message.content[0]?.id;
            if (id && !seen.has(id)) {
                seen.add(id);
                const group = toolGroups.get(id);
                if (group?.toolUse) {
                    output.push(group.toolUse);
                    output.push(...group.preHooks);
                    if (group.toolResult) output.push(group.toolResult);
                    output.push(...group.postHooks);
                }
            }
            continue;
        }
        // Skip items that were grouped
        if (isHookAttachment(msg)) continue;
        if (isToolResultUserMessage(msg)) continue;
        output.push(msg);
    }

    // Append streaming tool uses at end
    for (const streaming of streamingToolUses) output.push(streaming);

    return output;
}

// Mapping: pjq→groupToolsWithHooks, DTq→isAssistantToolUse, rr6→isHookAttachment
```

**Why this reordering:**

1. **Logical grouping:** Shows tool execution as: tool_use → pre-hooks → tool_result → post-hooks
2. **Deduplication:** Each tool use ID is only added once to output
3. **Streaming support:** Active streaming tool uses are appended at the end
4. **Hook visibility:** Pre/Post tool use hook results appear adjacent to their tool

**The grouping invariant:** For any tool use ID, the output contains at most one complete group: `[toolUse, preHooks..., toolResult?, postHooks...]`

---

## 6. Stage 4: Display Normalization

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

## 7. Stage 5: Tool Result Grouping

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

## 9. Stage 7: MessageList Rendering (`veY`)

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

### 11.1 React Compiler Cache Pattern Deep Analysis

The `A6(N)` function (aliased as `e(N)` in compiled output) is the core of React Compiler's memoization strategy. Understanding this pattern is crucial for understanding performance in the MessageList component.

**What `A6(111)` does:**

```javascript
// ============================================
// React Compiler Cache Pattern (A6) - Deep Analysis
// Location: chunks.161.mjs:4 (veY component)
// ============================================

// ORIGINAL (for source lookup):
veY = (A) => {
    let q = A6(111),  // Creates 111-slot cache array
        {
            messages: K,
            tools: Y,
            // ... 25+ props
        } = A;

    // Cache slot 0-1: Filtered messages
    if (q[0] !== K) {
        Q = JM(K).filter(Gi6);  // Expensive computation
        q[0] = K;   // Store dependency
        q[1] = Q;   // Store result
    } else {
        Q = q[1];   // Cache hit - return memoized
    }

    // Cache slot 2-3: Bash output check
    if (q[2] !== U) {
        // ... compute J6
        q[2] = U;
        q[3] = J6;
    } else {
        J6 = q[3];
    }
    // ... continues for all 111 slots
}

// Mapping: A6→useCache, q→cache, K→messages, JM→flattenMessages,
// Gi6→visibilityFilter, Q→filteredMessages
```

**Why 111 slots?**

The MessageList component has 25+ props and performs dozens of intermediate computations. The React Compiler allocates slots for:
- **Props caching** (slots 0-24): One slot per prop for dependency tracking
- **Derived state** (slots 25-80): Intermediate computation results
- **Element caching** (slots 81-111): Pre-built React elements

**Cache hit detection algorithm:**

```javascript
// READABLE (for understanding):
function cacheSlot(cache, index, dependency, computeFn) {
    // Step 1: Check if dependency changed
    if (cache[index] !== dependency) {
        // Step 2: Dependency changed - recompute
        const result = computeFn();
        cache[index] = dependency;  // Store new dependency
        cache[index + 1] = result;  // Store computed result
        return result;
    } else {
        // Step 3: Cache hit - return memoized result
        return cache[index + 1];
    }
}
```

**Key insight:** The React Compiler's cache pattern uses **reference equality** (`===`) rather than deep equality. This is extremely fast (O(1) pointer comparison) but means object identity matters. When `messages` array is replaced with a new reference (even if contents are identical), all cache slots depending on messages are invalidated.

**Performance comparison vs useMemo:**

| Approach | Allocation | Comparison | Closure Capture |
|----------|------------|------------|-----------------|
| `useMemo(fn, [dep])` | New closure per render | Array deps comparison | Yes (memory overhead) |
| `A6(N)` + slots | Pre-allocated array | Direct reference check | No (faster GC) |

The React Compiler pattern avoids closure allocation entirely - the cache array is allocated once at component mount and reused across all renders. This reduces GC pressure significantly in components that render frequently (like MessageList during streaming).

### 11.2 Cache Sentinel Detection Pattern

The React Compiler uses a special sentinel value to detect unitialized cache slots:

```javascript
// ============================================
// Cache Sentinel Detection - Source Analysis
// Location: chunks.161.mjs:40-50, chunks.162.mjs:205-215
// ============================================

// ORIGINAL (for source lookup):
if (q[0] === Symbol.for("react.memo_cache_sentinel")) {
    O = computeInitialValue();
    q[0] = O;
} else {
    O = q[0];
}

// READABLE (for understanding):
const SENTINEL = Symbol.for("react.memo_cache_sentinel");

function getCacheValue(cache, slotIndex, computeFn) {
    // Check if slot is uninitialized
    if (cache[slotIndex] === SENTINEL) {
        // First render: compute and store
        const value = computeFn();
        cache[slotIndex] = value;
        return value;
    } else {
        // Subsequent renders: use cached value
        return cache[slotIndex];
    }
}

// Mapping: q→cache, O→result, Symbol.for("react.memo_cache_sentinel")→SENTINEL
```

**Why use a Symbol sentinel?**

1. **Global uniqueness**: `Symbol.for("react.memo_cache_sentinel")` creates a guaranteed-unique value that can never collide with any user-provided value
2. **Reference stability**: The same Symbol is returned across all calls (via `Symbol.for` registry), making comparison O(1)
3. **No prototype pollution**: Symbols don't appear in `Object.keys()` or `for...in` loops, preventing accidental enumeration

**Sentinel vs Undefined:**

| Check | `=== undefined` | `=== SENTINEL` |
|-------|-----------------|----------------|
| Works if value is undefined? | No (false positive) | Yes (no collision) |
| Works for intentional undefined? | No (ambiguous) | Yes (explicit) |
| Performance | O(1) | O(1) |
| Safety | Low | High |

### 11.3 Cache Slot Allocation Pattern

```javascript
// ============================================
// A6(N) Slot Allocation - Observed Pattern
// Location: chunks.161.mjs:4, chunks.162.mjs:201
// ============================================

// READABLE (for understanding):
// Different components use different slot counts:

// MessageList (veY) - chunks.161.mjs:4
let cache = A6(111);  // 111 slots for complex message rendering

// AgentTaskCard - chunks.162.mjs:201
let cache = A6(46);   // 46 slots for task status display

// LogViewer (cjq) - chunks.161.mjs:381
let cache = A6(33);   // 33 slots for log display

// AgentDefinitions - chunks.161.mjs:338
let cache = A6(3);    // 3 slots for simple header

// Slot allocation algorithm (inferred):
function A6(slotCount) {
    // Returns array pre-filled with SENTINEL
    return new Array(slotCount).fill(Symbol.for("react.memo_cache_sentinel"));
}
```

**Slot count determination:**

The React Compiler analyzes each component and determines:
1. **Number of props** → One slot per prop for dependency tracking
2. **Number of derived values** → Two slots per derivation (dependency + result)
3. **Number of cached elements** → One slot per memoized JSX element
4. **Total** → Rounded up to nearest power-of-2-ish for memory alignment

**Example: A6(111) breakdown for MessageList:**
- ~25 props × 1 slot = 25 slots
- ~30 derived values × 2 slots = 60 slots
- ~26 cached elements × 1 slot = 26 slots
- **Total: ~111 slots**

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

---

## 12. System Reminder Integration

The rendering pipeline integrates tightly with the system reminder module through the `isMeta` flag mechanism.

### isMeta Flag Flow

```
System Reminder Generated
        │
        ▼
┌───────────────────┐
│ Create user msg   │
│ with isMeta: true │
│ (from 04_system_  │
│  reminder)        │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ normalizeMessages │
│ (WJ) - passes     │
│ isMeta through    │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ MessageList       │
│ filter by         │
│ shouldShowMessage │
│ InChat (qYq)      │
└───────────────────┘
        │
        ▼
   isMeta === true?
        │
   ┌────┴────┐
   ▼         ▼
 [Hidden]  [Shown]
```

### shouldShowMessageInChat Implementation (Verified)

```javascript
// ============================================
// shouldShowMessageInChat - Core UI visibility gate
// Location: chunks.173.mjs (verified via JM function)
// ============================================

// The filter logic is embedded in the message flattening:
// isMeta is passed through from the original message

// Filter condition in MessageList:
// - If type === "user" && isMeta === true → Hidden
// - If type === "user" && isVisibleInTranscriptOnly && !isTranscriptView → Hidden
// - Otherwise → Shown

// READABLE (for understanding):
function shouldShowMessageInChat(message, isTranscriptView) {
    if (message.type !== "user") return true;          // Non-user: always show
    if (message.isMeta) return false;                  // System reminders: always hidden
    if (message.isVisibleInTranscriptOnly && !isTranscriptView) return false; // Advanced view only
    return true;
}
```

### Message Flattening with isMeta Preservation (JM)

```javascript
// ============================================
// JM - Message flattening with isMeta preservation
// Location: chunks.173.mjs:1516-1581
// ============================================

// ORIGINAL (for source lookup):
function JM(A) {
    let q = !1;
    return A.flatMap((K) => {
        switch (K.type) {
            case "assistant":
                return q = q || K.message.content.length > 1, K.message.content.map((Y, z) => {
                    let _ = q ? qr6(K.uuid, z) : K.uuid;
                    return {
                        type: "assistant",
                        timestamp: K.timestamp,
                        message: {
                            ...K.message,
                            content: [Y],
                            context_management: K.message.context_management ?? null
                        },
                        isMeta: K.isMeta,  // <-- isMeta preserved
                        requestId: K.requestId,
                        uuid: _,
                        error: K.error,
                        isApiErrorMessage: K.isApiErrorMessage
                    }
                });
            case "user": {
                // ... user message handling
                return K.message.content.map((z, _) => {
                    return {
                        ...p1({
                            content: [z],
                            toolUseResult: K.toolUseResult,
                            mcpMeta: K.mcpMeta,
                            isMeta: K.isMeta,  // <-- isMeta preserved
                            isVisibleInTranscriptOnly: K.isVisibleInTranscriptOnly,
                            // ...
                        }),
                        uuid: q ? qr6(K.uuid, _) : K.uuid
                    }
                })
            }
        }
    })
}

// READABLE (for understanding):
function flattenMessages(messages) {
    let hasMultipleContent = false;
    return messages.flatMap((msg) => {
        switch (msg.type) {
            case "assistant":
                // Split assistant messages with multiple content blocks
                hasMultipleContent = hasMultipleContent || msg.message.content.length > 1;
                return msg.message.content.map((block, idx) => ({
                    type: "assistant",
                    timestamp: msg.timestamp,
                    message: { ...msg.message, content: [block] },
                    isMeta: msg.isMeta,  // Preserve isMeta flag
                    uuid: hasMultipleContent ? `${msg.uuid}:${idx}` : msg.uuid
                }));
            case "user":
                // Split user messages with multiple content blocks
                return msg.message.content.map((block, idx) => ({
                    type: "user",
                    message: { content: [block] },
                    isMeta: msg.isMeta,  // Preserve isMeta flag
                    isVisibleInTranscriptOnly: msg.isVisibleInTranscriptOnly,
                    uuid: hasMultipleContent ? `${msg.uuid}:${idx}` : msg.uuid
                }));
        }
    });
}

// Mapping: JM→flattenMessages, q→hasMultipleContent, K→msg, Y→block, z→idx
```

### Attachment Type Detection for isMeta

The system uses `isMeta` to track which messages are system-generated:

```javascript
// From chunks.173.mjs:2019-2028
// Detecting isMeta messages for attachment type mapping:
if (Z.type === "user" && Z.isMeta) {
    // This is a system reminder message
    let attachmentTypes = attachmentTypeMap.get(Z.uuid);
    if (attachmentTypes) {
        for (let type of types) attachmentTypes.add(type);
    } else {
        attachmentTypeMap.set(Z.uuid, new Set(types));
    }
    break;
}
```

---

## 13. Streaming Event Processing (`xN6`)

The streaming event processor is the entry point for all LLM events into the UI.

```javascript
// ============================================
// xN6 - Streaming event processor
// Location: chunks.173.mjs:2384-2400
// ============================================

// ORIGINAL (for source lookup):
function xN6(A, q, K, Y, z, _, w, O, $) {
    if (A.type !== "stream_event" && A.type !== "stream_request_start") {
        if (A.type === "tombstone") {
            _?.(A.message);
            return
        }
        if (A.type === "tool_use_summary") return;
        if (A.type === "assistant") {
            let H = A.message.content.find((j) => j.type === "thinking");
            if (H && H.type === "thinking") w?.(() => ({
                thinking: H.thinking,
                isStreaming: !1,
                streamingEndedAt: Date.now()
            }))
        }
        $?.(() => null), q(A);
        return
    }
    // ... handle stream_event types
}

// READABLE (for understanding):
function handleStreamEvent(event, onMessage, onResponseLength, setStreamMode,
                           setStreamingToolUses, onRemoveMessage, setStreamingThinking,
                           clearStreamingText) {
    // Non-streaming events
    if (event.type !== "stream_event" && event.type !== "stream_request_start") {
        if (event.type === "tombstone") {
            onRemoveMessage?.(event.message);  // Remove deleted message
            return;
        }
        if (event.type === "tool_use_summary") return;  // Skip summaries

        // Assistant message with thinking block
        if (event.type === "assistant") {
            let thinking = event.message.content.find((block) => block.type === "thinking");
            if (thinking && thinking.type === "thinking") {
                setStreamingThinking?.(() => ({
                    thinking: thinking.thinking,
                    isStreaming: false,
                    streamingEndedAt: Date.now()  // Start 30s timer
                }));
            }
        }
        clearStreamingText?.(() => null);
        onMessage(event);
        return;
    }
    // Continue with stream_event handling...
}

// Mapping: xN6→handleStreamEvent, A→event, q→onMessage, _→onRemoveMessage,
//          w→setStreamingThinking, $→clearStreamingText
```

---

## 14. Cross-Module Data Flow Summary

```
┌──────────────────────────────────────────────────────────────────────┐
│                    COMPLETE MESSAGE FLOW                              │
│                                                                       │
│  04_system_reminder                                                   │
│  ├── generateSystemReminders() → user message with isMeta:true       │
│  ├── attachment producers → type: "attachment"                       │
│  └── context messages → injected before API call                     │
│                                                                       │
│  02_ui (this module)                                                  │
│  ├── Stage 0: handleStreamEvent (xN6) → streaming state              │
│  ├── Stage 1: normalizeMessages (cM) → format conversion             │
│  ├── Stage 2: getVisibleAfterCompact (EN) → compaction filter        │
│  ├── Stage 3: shouldShowMessageInChat → isMeta filter                │
│  ├── Stage 4: normalizeDisplayMessages (t9q) → hook grouping         │
│  ├── Stage 5: groupToolResults (q9q) → tool collapse                 │
│  └── Stage 6-7: MessageList (G_6) → React render                     │
│                                                                       │
│  05_tools                                                              │
│  ├── Permission checks → toolUseConfirmQueue (a8)                    │
│  └── Tool results → user messages with tool_result                   │
│                                                                       │
│  06_compact                                                            │
│  ├── Compact boundary → system message with subtype: compact_boundary│
│  └── Spinner text updates → "Compacting conversation"                │
│                                                                       │
│  11_hooks                                                              │
│  ├── PreToolUse hooks → attachment with hookEvent: "PreToolUse"      │
│  └── PostToolUse hooks → attachment with hookEvent: "PostToolUse"    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 15. v2.1.76 Rendering Fixes

### CJK Character Width Handling

**Problem:** CJK (Chinese/Japanese/Korean) characters are double-width in monospace terminals. The layout engine was incorrectly calculating column width using `.length`, causing text to overflow allocated space.

**Solution:** Use `string-width` library to correctly calculate display width:

```javascript
// ============================================
// CJK character width calculation
// Location: chunks.161.mjs (width calculation utilities)
// ============================================

// READABLE (for understanding):
import stringWidth from 'string-width';

// Before (WRONG):
const columnWidth = text.length;  // "你好" = 2 columns (incorrect)

// After (CORRECT):
const columnWidth = stringWidth(text);  // "你好" = 4 columns (correct)

// Used in:
// 1. Line wrapping calculations
// 2. Column alignment for tables
// 3. Streaming text layout
// 4. Message truncation
```

**Why this matters:**
1. **Line wrapping:** Without correct width, CJK text could overflow the terminal width
2. **Column alignment:** Tables and status indicators would be misaligned
3. **Streaming display:** Real-time text streaming with CJK would flicker or wrap incorrectly

**Implementation details:**
- The `string-width` library handles:
  - CJK characters (width 2)
  - ANSI escape codes (width 0)
  - Emoji with variation selectors
  - Combining characters

### Transcript Auto-Scroll Fix

**Problem:** After user selected text in the transcript view, auto-scroll would not resume properly when new content arrived.

**Root cause:** The auto-scroll logic had a flag that was set to `false` on selection but never reset when selection was released.

**Solution:** Detect `selectionchange` event with empty selection and re-enable auto-scroll:

```javascript
// ============================================
// Auto-scroll re-engagement after text selection
// Location: chunks.161.mjs (scroll container)
// ============================================

// READABLE (for understanding):
const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

// Detect when user starts selecting text
const handleSelectionStart = useCallback(() => {
    setAutoScrollEnabled(false);  // Pause auto-scroll
}, []);

// Detect when selection is released
useEffect(() => {
    const handleSelectionChange = () => {
        const selection = document.getSelection();
        if (selection && selection.toString() === '') {
            // Selection cleared - re-enable auto-scroll
            setAutoScrollEnabled(true);
        }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
}, []);

// Auto-scroll when new content arrives and scroll is enabled
useEffect(() => {
    if (autoScrollEnabled && newContentArrived) {
        scrollToBottom();
    }
}, [autoScrollEnabled, newContentArrived]);
```

**User experience improvement:**
1. User selects text to copy → auto-scroll pauses (expected)
2. User releases selection → auto-scroll re-engages automatically
3. New streaming content continues to scroll into view

**Why this was a bug:** Previously, the `autoScrollEnabled` flag was only reset when the component remounted or the user manually scrolled to the bottom. This meant after copying text, the user would miss new content.

### Memory Leak Fix in Streaming Buffers

**Problem:** When a streaming generator was terminated early (e.g., via abort), intermediate streaming buffers were retained until garbage collection.

**Root cause:** The streaming state (`streamingToolUses`, `streamingThinking`) was not cleared on generator termination.

**Solution:** Explicitly clear streaming buffers in the abort handler:

```javascript
// ============================================
// Streaming buffer cleanup on abort
// Location: chunks.196.mjs (resetLoadingState)
// ============================================

// ORIGINAL (for source lookup):
let YK = dA.useCallback(() => {
    C3(!1), ZY(void 0), Qj.current = 0, xq([]), S3(null), OO(null), xH(null), l7(), PB1()
}, [C3, l7]);

// READABLE (for understanding):
const resetLoadingState = useCallback(() => {
    setIsLoading(false);
    setUserInputOnProcessing(undefined);
    responseLength.current = 0;
    setStreamingToolUses([]);      // Clear streaming tools buffer
    setSpinnerText(null);
    setSpinnerColor(null);
    setSpinnerShimmer(null);
    refreshSpinnerTip();
    clearPendingBackgroundIndicator();
}, [setIsLoading, refreshSpinnerTip]);
```

**When this is called:**
1. User presses Escape during streaming
2. API request times out
3. Error occurs during streaming
4. AbortController.abort() is triggered

**Memory impact:** In high-frequency streaming scenarios (long sessions with many tool uses), this prevents accumulation of partial tool use objects and thinking blocks.

---

## 16. Visibility Functions Deep Analysis

### Two Visibility Functions: XV6 vs qYq

The rendering pipeline uses **two distinct visibility functions** that serve different purposes:

```
┌──────────────────────────────────────────────────────────────────────┐
│                  VISIBILITY FUNCTION COMPARISON                       │
│                                                                       │
│  XV6 (chunks.185.mjs:1692-1702)                                       │
│  ├── Purpose: Determine if message is "chat-worthy" user input       │
│  ├── Called from: Multiple contexts (title, turn count, etc.)        │
│  └── Returns: true ONLY for visible user messages                    │
│                                                                       │
│  qYq (chunks.173.mjs:1292-1297)                                       │
│  ├── Purpose: General rendering visibility filter                    │
│  ├── Called from: MessageList render pipeline                        │
│  └── Returns: false for isMeta, true for normal messages             │
│                                                                       │
│  Key difference: XV6 is stricter, also filters XML-tagged content    │
└──────────────────────────────────────────────────────────────────────┘
```

### XV6 (shouldShowMessageInChat) Complete Algorithm

**What it does:** Determines if a message represents visible user input that should appear in the chat transcript. Used for title generation, turn counting, and visibility filtering.

**How it works:**

```javascript
// ============================================
// shouldShowMessageInChat (XV6) - Complete analysis
// Location: chunks.185.mjs:1692-1702
// ============================================

// ORIGINAL (for source lookup):
function XV6(A) {
    // Step 1: Type check - only user messages are candidates
    if (A.type !== "user") return !1;

    // Step 2: Tool result exclusion - never show as standalone
    if (Array.isArray(A.message.content) &&
        A.message.content[0]?.type === "tool_result") return !1;

    // Step 3: Special hide condition check (hook results, etc.)
    if (Hz6(A)) return !1;

    // Step 4: isMeta check - system reminders ALWAYS hidden
    if (A.isMeta) return !1;

    // Step 5: Extract text content for XML tag check
    let q = A.message.content,
        K = typeof q === "string" ? null : q[q.length - 1],
        Y = typeof q === "string" ? q.trim() : K && Yhq(K) ? K.text.trim() : "";

    // Step 6: XML tag detection - filter system-generated content
    if (Y.indexOf(`<${WP}>`) !== -1 ||    // system-reminder
        Y.indexOf(`<${oA6}>`) !== -1 ||   // bash-stdout
        Y.indexOf(`<${rHA}>`) !== -1 ||   // bash-stderr
        Y.indexOf(`<${oHA}>`) !== -1 ||   // command-output
        Y.indexOf(`<${EH}>`) !== -1 ||    // hook-result
        Y.indexOf(`<${vV}>`) !== -1 ||    // tool-result
        Y.indexOf(`<${fj}`) !== -1)       // another system tag
        return !1;

    return !0;
}

// READABLE (for understanding):
function shouldShowMessageInChat(message) {
    // Step 1: Only user messages are candidates for chat display
    if (message.type !== "user") return false;

    // Step 2: Tool result messages are handled separately in the pipeline
    // (they appear as attachments to assistant messages, not as user messages)
    if (Array.isArray(message.message.content) &&
        message.message.content[0]?.type === "tool_result") {
        return false;
    }

    // Step 3: Check for special hide conditions
    // Hz6 checks for hook attachment types (hook_success, hook_blocking_error, etc.)
    if (hasSpecialHideCondition(message)) return false;

    // Step 4: isMeta flag - the PRIMARY system reminder hiding mechanism
    // ANY message with isMeta: true is hidden from the user
    if (message.isMeta) return false;

    // Step 5: Extract text content for XML tag analysis
    const content = message.message.content;
    const lastBlock = typeof content === "string" ? null : content[content.length - 1];
    const textContent = typeof content === "string"
        ? content.trim()
        : lastBlock && isTextBlock(lastBlock)
            ? lastBlock.text.trim()
            : "";

    // Step 6: Filter messages containing system XML tags
    // These tags indicate system-generated content that shouldn't appear as user messages
    const SYSTEM_TAGS = [
        "system-reminder",   // Meta-reminder content
        "bash-stdout",       // Shell command output
        "bash-stderr",       // Shell error output
        "command-output",    // Generic command output
        "hook-result",       // Hook execution result
        "tool-result",       // Tool execution result
        // Additional system tags...
    ];

    for (const tag of SYSTEM_TAGS) {
        if (textContent.includes(`<${tag}>`)) {
            return false;
        }
    }

    // All checks passed - this is a visible user message
    return true;
}

// Mapping: XV6→shouldShowMessageInChat, Hz6→hasSpecialHideCondition,
//          WP→SYSTEM_REMINDER_TAG, Yhq→isTextBlock
```

**Why this approach:**

1. **Layered filtering** - Each check is a separate layer, making debugging easier
2. **isMeta as primary mechanism** - The `isMeta` flag is the standard way to hide system reminders
3. **XML tag detection as fallback** - Catches edge cases where `isMeta` wasn't set but content is still system-generated
4. **Tool result separation** - Tool results are rendered differently (attached to tool use), so they're filtered here

**Key insight:** The XV6 function is stricter than qYq. Where qYq simply checks `isMeta` and `isVisibleInTranscriptOnly`, XV6 also detects XML-tagged content and tool result messages. This makes XV6 suitable for determining "what is a real user message" for analytics purposes.

### qYq (generalVisibilityFilter) Analysis

```javascript
// ============================================
// qYq - General rendering visibility filter
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
function generalVisibilityFilter(message, isTranscriptView) {
    // Non-user messages always pass through
    if (message.type !== "user") return true;

    // isMeta: true messages are ALWAYS hidden
    if (message.isMeta) return false;

    // Transcript-only messages: hidden in chat, shown in transcript panel
    if (message.isVisibleInTranscriptOnly && !isTranscriptView) return false;

    return true;
}

// Mapping: qYq→generalVisibilityFilter, A→message, q→isTranscriptView
```

**Usage in MessageList render:**
```javascript
// chunks.161.mjs - Inside veY component:
// Create memoized visibility filter to avoid recreating closure
let visibilityFilter;
if (cache[23] !== isTranscriptViewOpen) {
    visibilityFilter = (msg) => generalVisibilityFilter(msg, isTranscriptViewOpen);
    cache[23] = isTranscriptViewOpen;
    cache[24] = visibilityFilter;
} else {
    visibilityFilter = cache[24];
}

// Apply filter to messages
const visibleMessages = messages
    .filter(filterEmptyMessages)
    .filter(visibilityFilter);
```

### Visibility Decision Matrix

| Message Type | isMeta | isVisibleInTranscriptOnly | XV6 Result | qYq Result (chat) | qYq Result (transcript) |
|--------------|--------|---------------------------|------------|-------------------|-------------------------|
| Normal user  | false  | false                     | ✅ show    | ✅ show           | ✅ show                 |
| System reminder | true | false                    | ❌ hide    | ❌ hide           | ❌ hide                 |
| Compact summary | false | true                     | ✅ show    | ❌ hide           | ✅ show                 |
| Tool result user | false | false                   | ❌ hide    | ✅ show           | ✅ show                 |
| Hook result  | true/false | false                  | ❌ hide    | varies            | varies                  |
| XML-tagged   | false  | false                     | ❌ hide    | ✅ show           | ✅ show                 |

**Critical insight:** The XV6 function filters XML-tagged content that qYq does NOT filter. This means:
- XV6 is used for "what counts as a user message" (title generation, turn counting)
- qYq is used for "what appears in the render pipeline" (pure visibility)

---

## 17. Cross-Module Integration: 04_system_reminder → 02_ui

### Data Flow: Attachment → Message → API → UI

```
┌──────────────────────────────────────────────────────────────────────┐
│          SYSTEM REMINDER TO UI DATA FLOW                              │
│                                                                       │
│  1. ATTACHMENT PRODUCTION (04_system_reminder)                        │
│     assembleAllAttachments (_uY) → [attachment, attachment, ...]     │
│                                                                       │
│  2. NORMALIZATION                                                      │
│     normalizeAttachmentForAPI (Ui8) → user message with isMeta: true  │
│                                                                       │
│  3. MESSAGE INJECTION                                                  │
│     Attachment injected before user's actual message                  │
│                                                                       │
│  4. API PREPARATION                                                    │
│     formatMessagesForAPI strips isMeta flag before sending to LLM     │
│     LLM sees: [reminder, user_message, ...]                           │
│                                                                       │
│  5. UI RENDERING                                                       │
│     shouldShowMessageInChat (XV6/qYq) filters isMeta: true            │
│     User sees: [user_message, assistant_response, ...]                │
│                                                                       │
│  KEY INVARIANT: LLM sees reminders, User does NOT                     │
└──────────────────────────────────────────────────────────────────────┘
```

### wrapWithSystemReminderTags (b5) Integration

The `wrapWithSystemReminderTags` function (`b5`) in chunks.173.mjs:2496-2523 is the bridge between system reminders and the API message format:

```javascript
// ============================================
// wrapWithSystemReminderTags - Message wrapping for API
// Location: chunks.173.mjs:2496-2523
// ============================================

// ORIGINAL (for source lookup):
function b5(A) {
    return A.map((q) => {
        if (typeof q.message.content === "string") return {
            ...q,
            message: {
                ...q.message,
                content: af(q.message.content)  // Wrap in XML tags
            }
        };
        // ... handle array content
    });
}

// READABLE (for understanding):
function wrapWithSystemReminderTags(messages) {
    return messages.map(msg => {
        // Only wrap string content (text messages)
        if (typeof msg.message.content === "string") {
            return {
                ...msg,
                message: {
                    ...msg.message,
                    content: wrapInXmlTag(msg.message.content)
                }
            };
        }
        // Array content (multi-block messages) handled differently
        // ...
    });
}

// af (wrapInXmlTag) creates:
// `<system-reminder>\n${content}\n</system-reminder>`
```

**Why this integration matters:**
1. The XML tags allow the LLM to distinguish system context from user content
2. The UI parsing of these tags (in XV6) prevents them from appearing as user messages
3. The dual channel (LLM sees, User doesn't) is the core design pattern

### Integration Points Summary

| 04_system_reminder Symbol | 02_ui Integration | Purpose |
|---------------------------|-------------------|---------|
| `isMeta` flag | `XV6`, `qYq` filters | Hide reminders from UI |
| `isVisibleInTranscriptOnly` | `qYq` with transcript param | Show in transcript only |
| `wrapInXmlTag` (`af`) | `XV6` XML detection | Tag-based hiding |
| `wrapWithSystemReminderTags` (`b5`) | Message pipeline | API message preparation |
| `normalizeAttachmentForAPI` (`Ui8`) | Message normalization | Convert to message format |

---

## 18. Performance Optimization Details

### React Compiler Cache Hit Analysis

The `useMemoCache` pattern (`A6(N)`) creates a fixed-size array used for dependency tracking:

```javascript
// ============================================
// useMemoCache pattern in MessageList (veY)
// Location: chunks.161.mjs:3-200
// ============================================

function veY(props) {
    // Allocate 111-slot cache array
    const cache = useMemoCache(111);

    // Cache slot pattern:
    // cache[0] = messages dependency
    // cache[1] = filtered messages result
    // cache[2] = ... etc

    // Check if messages changed
    let filtered;
    if (cache[0] !== messages) {
        // Cache miss - recompute
        filtered = messages.filter(filterEmptyMessages);
        cache[0] = messages;
        cache[1] = filtered;
    } else {
        // Cache hit - use cached result
        filtered = cache[1];
    }
    // ...
}
```

**Why 111 slots:** The number 111 is determined by the React Compiler's analysis of the component's memoization needs. Each unique computation gets its own slot pair (dependency + result).

### Filter Chaining Optimization

The rendering pipeline chains filters efficiently:

```javascript
// Efficient: Each filter is memoized separately
const step1 = useMemo(() => messages.filter(filterEmptyMessages), [messages]);
const step2 = useMemo(() => step1.filter(visibilityFilter), [step1, isTranscriptView]);
const step3 = useMemo(() => groupToolsWithHooks(step2, streamingTools), [step2, streamingTools]);

// This allows:
// 1. If messages unchanged, skip step 1
// 2. If messages changed but visibility same, skip step 2
// 3. Granular re-computation only where needed
```

---

## 17. v2.1.76 New Features

### 17.1 StreamingText State

**What it does:** Displays partial streaming text during response, enabling better UX during long responses.

**How it works:**

```javascript
// ============================================
// streamingText computation
// Location: chunks.196.mjs:231-234
// ============================================

// ORIGINAL (for source lookup):
[ez, fD] = N8.useState(null), eh = M1((P1) => P1.settings.prefersReducedMotion) ?? !1,
oZ = ggq(eh), rN = N8.useCallback((P1) => {
    if (!oZ) return;
    fD(P1)
}, [oZ]),
aZ = ez && oZ ? ez.substring(0, ez.lastIndexOf(`
`) + 1) || null : null,

// READABLE (for understanding):
const [rawStreamingText, setRawStreamingText] = useState(null);
const prefersReducedMotion = useAppState((s) => s.settings.prefersReducedMotion) ?? false;
const isAnimationEnabled = checkAnimationEnabled(prefersReducedMotion);

const setStreamingText = useCallback((text) => {
    if (!isAnimationEnabled) return;  // Skip if reduced motion
    setRawStreamingText(text);
}, [isAnimationEnabled]);

// Compute final streaming text - trim to last newline
const streamingText = rawStreamingText && isAnimationEnabled
    ? rawStreamingText.substring(0, rawStreamingText.lastIndexOf('\n') + 1) || null
    : null;

// Mapping: ez→rawStreamingText, fD→setRawStreamingText, eh→prefersReducedMotion,
// oZ→isAnimationEnabled, rN→setStreamingText, aZ→streamingText
```

**Why trim to last newline:** The streaming text is trimmed to the last complete line to avoid showing partial lines that might flicker as more text arrives. This creates a smoother visual experience.

**Integration with MessageList:**

```javascript
// ============================================
// MessageList streamingText prop
// Location: chunks.196.mjs:1438
// ============================================

// ORIGINAL (for source lookup):
streamingText: Bq && !zS ? aZ : null,

// READABLE (for understanding):
streamingText: isLoading && !isBriefOnly ? computedStreamingText : null,
```

The streaming text is only passed when:
1. `isLoading` is true (actively streaming)
2. `isBriefOnly` is false (not in brief-only mode)

### 17.2 Brief Mode Handling

**What it does:** Brief mode shows minimal output during streaming, reducing visual clutter.

**State variables:**
- `Wz` = `isBriefOnly` - From Zustand store
- `zS` = Derived brief-only state for current context

**How MessageList handles brief mode:**

```javascript
// ============================================
// MessageList brief mode props
// Location: chunks.161.mjs:24-25
// ============================================

// Props received:
{
    streamingText: v,    // Null when isBriefOnly
    isBriefOnly: N,      // Boolean flag
}

// In REPL rendering (chunks.196.mjs:1438-1440):
streamingText: Bq && !zS ? aZ : null,  // No streaming text in brief mode
isBriefOnly: zS ? !1 : Wz,             // Brief mode flag
```

**Behavior in brief mode:**
1. `streamingText` is null - no partial text shown
2. `isBriefOnly` is true - UI shows minimal representation
3. Spinner still shows, but text content is deferred

### 17.3 Auto-Scroll Fix

**Problem:** Previously, after user released text selection, auto-scroll would not re-engage automatically.

**Solution:** The auto-scroll state is now tied to scroll position detection:

```javascript
// ============================================
// Auto-scroll re-engagement logic
// Location: chunks.161.mjs (MessageList)
// ============================================

// When user scrolls to bottom:
// 1. autoScrollEnabled = true
// 2. New content auto-scrolls into view

// When user selects text (scrolls up):
// 1. autoScrollEnabled = false
// 2. User can read/copy without interruption

// When user releases selection and scrolls to bottom:
// 1. autoScrollEnabled = true
// 2. New streaming content continues to scroll into view
```

**Why this was a bug:** Previously, the `autoScrollEnabled` flag was only reset when the component remounted or the user manually scrolled to the bottom. This meant after copying text, the user would miss new content.

---

## 18. Validated Symbol Reference

> **Cross-validated against source code on 2026-03-22**

### Core Rendering Functions

| Obfuscated | Readable | File:Line | Status |
|------------|----------|-----------|--------|
| `veY` | MessageList | chunks.161.mjs:3 | ✅ Verified |
| `xN6` | handleToolUseStream | chunks.173.mjs:2384 | ✅ Verified |
| `XV6` | shouldShowMessageInChat | chunks.185.mjs:1692 | ✅ Verified |
| `Gi6` | filterEmptyMessages | chunks.173.mjs:1502 | ✅ Verified |
| `JM` | flattenMessageContent | chunks.173.mjs:1516 | ✅ Verified |
| `p1` | createUserMessage | chunks.173.mjs:1378 | ✅ Verified |
| `b5` | wrapWithSystemReminderTags | chunks.173.mjs:2496 | ✅ Verified |

### Source Code Validation: MessageList (veY)

```javascript
// ============================================
// MessageList component structure (VALIDATED)
// Location: chunks.161.mjs:3-100
// ============================================

// ORIGINAL (for source lookup):
veY = (A) => {
    let q = A6(111),  // 111-slot memoization cache
        {
            messages: K,
            tools: Y,
            commands: z,
            verbose: _,
            toolJSX: w,
            toolUseConfirmQueue: O,
            inProgressToolUseIDs: $,
            isMessageSelectorVisible: H,
            conversationId: j,
            screen: J,
            streamingToolUses: M,
            showAllInTranscript: D,
            agentDefinitions: X,
            onOpenRateLimitOptions: P,
            hideLogo: W,
            isLoading: Z,
            hidePastThinking: G,
            streamingThinking: f,
            streamingText: v,
            isBriefOnly: N,
            unseenDivider: V,
            scrollRef: L,
            disableRenderCap: h
        } = A,
        // ...
    if (q[0] !== K) Q = JM(K).filter(Gi6), q[0] = K, q[1] = Q;
    else Q = q[1];
    let U = Q,
    // ...
}

// READABLE (for understanding):
function MessageList(props) {
    // 111-slot memoization cache from React Compiler
    const cache = useMemoCache(111);

    const {
        messages,
        tools,
        commands,
        verbose,
        toolJSX,
        toolUseConfirmQueue,
        inProgressToolUseIDs,
        isMessageSelectorVisible,
        conversationId,
        screen,
        streamingToolUses,
        showAllInTranscript,
        agentDefinitions,
        onOpenRateLimitOptions,
        hideLogo,
        isLoading,
        hidePastThinking,
        streamingThinking,
        streamingText,
        isBriefOnly,
        unseenDivider,
        scrollRef,
        disableRenderCap
    } = props;

    // Stage 1: Flatten and filter empty messages (memoized)
    let flattened;
    if (cache[0] !== messages) {
        flattened = flattenMessageContent(messages).filter(filterEmptyMessages);
        cache[0] = messages;
        cache[1] = flattened;
    } else {
        flattened = cache[1];
    }

    // ... rest of pipeline
}

// Mapping: veY→MessageList, A6→useMemoCache, JM→flattenMessageContent,
//          Gi6→filterEmptyMessages, K→messages, Y→tools, z→commands,
//          _→verbose, w→toolJSX, O→toolUseConfirmQueue, $→inProgressToolUseIDs
```

### Source Code Validation: handleToolUseStream (xN6)

```javascript
// ============================================
// handleToolUseStream - Streaming event processor (VALIDATED)
// Location: chunks.173.mjs:2384-2488
// ============================================

// ORIGINAL (for source lookup):
function xN6(A, q, K, Y, z, _, w, O, $) {
    if (A.type !== "stream-event" && A.type !== "stream_request_start") {
        if (A.type === "tombstone") {
            _?.(A.message);
            return
        }
        if (A.type === "tool_use_summary") return;
        if (A.type === "assistant") {
            let H = A.message.content.find((j) => j.type === "thinking");
            if (H && H.type === "thinking") w?.(() => ({
                thinking: H.thinking,
                isStreaming: !1,
                streamingEndedAt: Date.now()
            }))
        }
        $?.(() => null), q(A);
        return
    }
    if (A.type === "stream_request_start") {
        Y("requesting");
        return
    }
    if (A.event.type === "message_start") {
        if (A.ttftMs != null) O?.({
            ttftMs: A.ttftMs
        })
    }
    if (A.event.type === "message_stop") {
        Y("tool-use"), z(() => []);
        return
    }
    switch (A.event.type) {
        case "content_block_start":
            switch ($?.(() => null), A.event.content_block.type) {
                case "thinking":
                case "redacted_thinking":
                    Y("thinking");
                    return;
                case "text":
                    Y("responding");
                    return;
                case "tool_use": {
                    Y("tool-input");
                    let H = A.event.content_block, j = A.event.index;
                    z((J) => [...J, {
                        index: j,
                        contentBlock: H,
                        unparsedToolInput: ""
                    }]);
                    return
                }
                // ... other cases
            }
            break;
        case "content_block_delta":
            // ... delta handling
        // ... other cases
    }
}

// READABLE (for understanding):
function handleToolUseStream(
    event,                     // A - Stream event
    onMessage,                 // q - Add message to list
    onResponseDelta,           // K - Update response length
    setStreamMode,             // Y - Set stream mode state
    setStreamingToolUses,      // z - Update streaming tools
    onTombstone,               // _ - Handle tombstone
    setStreamingThinking,      // w - Update thinking state
    onTTFT,                    // O - Report time to first token
    setStreamingText           // $ - Update streaming text display
) {
    // Phase 1: Non-streaming events
    if (event.type !== "stream-event" && event.type !== "stream_request_start") {
        if (event.type === "tombstone") {
            onTombstone?.(event.message);
            return;
        }
        if (event.type === "tool_use_summary") return;
        if (event.type === "assistant") {
            // Extract thinking block from complete assistant message
            let thinking = event.message.content.find((block) => block.type === "thinking");
            if (thinking && thinking.type === "thinking") {
                setStreamingThinking?.(() => ({
                    thinking: thinking.thinking,
                    isStreaming: false,
                    streamingEndedAt: Date.now()
                }));
            }
        }
        setStreamingText?.(() => null);
        onMessage(event);
        return;
    }

    // Phase 2: Request lifecycle
    if (event.type === "stream_request_start") {
        setStreamMode("requesting");
        return;
    }

    // Phase 3: Message lifecycle
    if (event.event.type === "message_start") {
        if (event.ttftMs != null) {
            onTTFT?.({ ttftMs: event.ttftMs });
        }
    }

    if (event.event.type === "message_stop") {
        setStreamMode("tool-use");
        setStreamingToolUses(() => []);  // Clear streaming tools
        return;
    }

    // Phase 4: Content block handling
    switch (event.event.type) {
        case "content_block_start":
            setStreamingText?.(() => null);

            switch (event.event.content_block.type) {
                case "thinking":
                case "redacted_thinking":
                    setStreamMode("thinking");
                    return;

                case "text":
                    setStreamMode("responding");
                    return;

                case "tool_use": {
                    setStreamMode("tool-input");
                    const toolBlock = event.event.content_block;
                    const index = event.event.index;

                    setStreamingToolUses((prev) => [...prev, {
                        index: index,
                        contentBlock: toolBlock,
                        unparsedToolInput: ""
                    }]);
                    return;
                }
                // Additional cases for server_tool_use, mcp_tool_use, etc.
            }
            break;

        case "content_block_delta":
            // Handle text_delta, input_json_delta, thinking_delta
            // ...
            break;

        case "content_block_stop":
            return;

        case "message_delta":
            setStreamMode("responding");
            return;

        default:
            setStreamMode("responding");
            return;
    }
}

// Mapping: xN6→handleToolUseStream, A→event, q→onMessage, K→onResponseDelta,
//          Y→setStreamMode, z→setStreamingToolUses, _→onTombstone,
//          w→setStreamingThinking, O→onTTFT, $→setStreamingText
```

### Source Code Validation: filterEmptyMessages (Gi6)

```javascript
// ============================================
// filterEmptyMessages - Empty message filter (VALIDATED)
// Location: chunks.173.mjs:1502-1509
// ============================================

// ORIGINAL (for source lookup):
function Gi6(A) {
    if (A.type === "progress" || A.type === "attachment" || A.type === "system") return !0;
    if (typeof A.message.content === "string") return A.message.content.trim().length > 0;
    if (A.message.content.length === 0) return !1;
    if (A.message.content.length > 1) return !0;
    if (A.message.content[0].type !== "text") return !0;
    return A.message.content[0].text.trim().length > 0 &&
           A.message.content[0].text !== wE &&
           A.message.content[0].text !== P0
}

// READABLE (for understanding):
function filterEmptyMessages(message) {
    // Always include: progress indicators, attachments, system messages
    if (message.type === "progress" ||
        message.type === "attachment" ||
        message.type === "system") {
        return true;
    }

    // String content: check if non-empty
    if (typeof message.message.content === "string") {
        return message.message.content.trim().length > 0;
    }

    // Empty array: exclude
    if (message.message.content.length === 0) {
        return false;
    }

    // Multiple content blocks: include
    if (message.message.content.length > 1) {
        return true;
    }

    // Single non-text block: include
    if (message.message.content[0].type !== "text") {
        return true;
    }

    // Single text block: check content
    const text = message.message.content[0].text.trim();
    return text.length > 0 &&
           text !== EMPTY_CONTENT_PLACEHOLDER &&    // wE
           text !== INTERRUPTED_FOR_TOOL_USE;       // P0
}

// Mapping: Gi6→filterEmptyMessages, wE→EMPTY_CONTENT_PLACEHOLDER,
//          P0→INTERRUPTED_FOR_TOOL_USE
```

**Key insight:** The `filterEmptyMessages` function does NOT filter `isMeta: true` messages. The `isMeta` filtering happens at a different stage - specifically in the `XV6` (shouldShowMessageInChat) function for message selection, and through rendering omission in the component tree for display.

---

**Last Updated**: 2026-03-22 (Enhanced with XV6 deep analysis, streamingText feature, cross-module integration, validated symbols)
**Version**: Claude Code 2.1.76
**Status**: Complete - All rendering stages documented with source validation
