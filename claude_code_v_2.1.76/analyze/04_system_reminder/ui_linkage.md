# System Reminder UI Linkage - Complete Analysis

> Module: System Reminders - UI Visibility & API Pipeline
> Source: `chunks.173.mjs`, `chunks.161.mjs`, `chunks.148.mjs`, `chunks.169.mjs`, `chunks.172.mjs`, `chunks.142.mjs`, `chunks.90.mjs`
> Version: Claude Code 2.1.76

---

## Table of Contents

- [Overview: The Visibility Contract](#overview-the-visibility-contract)
- [Three-Tier Message Visibility Model](#three-tier-message-visibility-model)
- [The Core UI Gate: shouldShowMessageInChat (qYq)](#the-core-ui-gate-shouldshowmessageinchat-qyq)
- [UI Rendering Pipeline (chunks.161.mjs)](#ui-rendering-pipeline-chunks161mjs)
- [Attachment Message Injection Pipeline](#attachment-message-injection-pipeline)
  - [attachmentMessageGenerator (oP1)](#attachmentmessagegenerator-op1)
  - [convertAttachmentToMessage (kq)](#convertattachmenttomessage-kq)
  - [reorderAttachments (dzz)](#reorderattachments-dzz)
- [Context Message Injection: buildContextMessages (bG1)](#context-message-injection-buildcontextmessages-bg1)
- [Message Normalization: normalizeMessages (WJ)](#message-normalization-normalizemessages-wj)
- [API Preparation: Stripping isMeta Before API Call](#api-preparation-stripping-ismeta-before-api-call)
  - [formatMessagesForAPI (m9z)](#formatmessagesforapi-m9z)
  - [formatUserMessageForAPI (b9z)](#formatusermessageforapi-b9z)
- [System Reminder XML Tag Parsing: extractSystemReminderContent (hMA)](#system-reminder-xml-tag-parsing-extractsystemremindercontent-hma)
- [Non-UI Uses of isMeta](#non-ui-uses-of-ismeta)
  - [Session Title Generation: getFirstMeaningfulUserMessage (GN6)](#session-title-generation-getfirstmeaningfulusermessage-gn6)
  - [Real User Message Detection: isValidUserMessage (V2z)](#real-user-message-detection-isvalidusermessage-v2z)
  - [Turn Counting Exclusion](#turn-counting-exclusion)
  - [Token Budget Exclusion](#token-budget-exclusion)
  - [Transcript File Parsing Exclusion](#transcript-file-parsing-exclusion)
  - [Telemetry Normalization: isSynthetic Field](#telemetry-normalization-issynthetic-field)
  - [Debug Logging: [META] Marker](#debug-logging-meta-marker)
  - [Permission Context Filtering](#permission-context-filtering)
- [End-to-End Flow: User Sends Message](#end-to-end-flow-user-sends-message)
- [Design Decisions and Trade-offs](#design-decisions-and-trade-offs)
- [Related Symbols](#related-symbols)

---

## Overview: The Visibility Contract

System reminders exist in a **dual-channel architecture**:

```
┌────────────────────────────────────────────────────────┐
│                DUAL CHANNEL DESIGN                      │
│                                                         │
│  User Channel:  User → Chat UI → [filtered] → User     │
│                                                         │
│  Model Channel: All messages → isMeta stripped → LLM   │
│                                                         │
│  Key invariant:                                         │
│  • isMeta:true messages → LLM sees them                 │
│  • isMeta:true messages → User NEVER sees them          │
│  • isMeta flag → stripped from API payload              │
└────────────────────────────────────────────────────────┘
```

The `isMeta: true` flag on a message object is the **single source of truth** that controls whether a message appears in the user-facing chat UI. This flag is:

1. **Set** by all system reminder producers (normalizeAttachmentForAPI, buildContextMessages, etc.)
2. **Checked** by the UI filter (shouldShowMessageInChat) to hide messages from chat
3. **Stripped** before sending to Claude API (formatUserMessageForAPI, formatAssistantMessageForAPI)
4. **Used** across 10+ other systems for message classification (turn counting, telemetry, etc.)

---

## Three-Tier Message Visibility Model

Claude Code messages have three visibility tiers, controlled by two boolean flags:

```
┌──────────────────────────────────────────────────────────┐
│             MESSAGE VISIBILITY TIERS                      │
│                                                           │
│  Tier 1: isMeta: true                                     │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  HIDDEN: Never shown in UI (chat or transcript view) │ │
│  │  SENT:   Included in API call to LLM                 │ │
│  │  Examples: plan_mode reminder, todo_reminder,        │ │
│  │            changed_files, diagnostics, all           │ │
│  │            attachment producers                      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  Tier 2: isVisibleInTranscriptOnly: true                  │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  HIDDEN: Not shown in normal chat view               │ │
│  │  SHOWN:  Visible when transcript panel is open       │ │
│  │  SENT:   Included in API call to LLM                 │ │
│  │  Examples: compact summaries, meta-tool results      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  Tier 3: Normal messages (both flags false/undefined)     │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  SHOWN: Always visible in chat and transcript        │ │
│  │  SENT:  Included in API call to LLM                  │ │
│  │  Examples: actual user messages, assistant responses │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  All tiers: isMeta/isVisibleInTranscriptOnly STRIPPED     │
│             before Claude API call                        │
└──────────────────────────────────────────────────────────┘
```

---

## The Core UI Gate: shouldShowMessageInChat (qYq)

This is the single function responsible for hiding system reminders from the user UI.

```javascript
// ============================================
// shouldShowMessageInChat - Core UI message visibility filter
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
    // Non-user messages (assistant, system, attachment) are always shown
    if (message.type !== "user") return true;

    // isMeta messages are ALWAYS hidden from UI
    if (message.isMeta) return false;

    // Transcript-only messages are hidden in normal chat view,
    // but shown when transcript panel is open
    if (message.isVisibleInTranscriptOnly && !isTranscriptView) return false;

    // Normal user messages: always show
    return true;
}

// Mapping: qYq→shouldShowMessageInChat, A→message, q→isTranscriptView
```

**What it does:** The single gate function called on every message during UI rendering. Returns `false` for any message that should be hidden.

**How it works:**

1. **Non-user messages pass through** unchanged - assistant responses, tool results, and system messages are never filtered by this function. Only `type: "user"` messages are subject to hiding.

2. **`isMeta: true` → unconditionally hidden** - Any user message with `isMeta: true` is hidden in ALL views (both chat and transcript). This is the mechanism for system reminders.

3. **`isVisibleInTranscriptOnly: true` → conditionally hidden** - Hidden in normal chat view, but shown when user opens the transcript panel (`q` parameter is `true`). This tier is used for compact summaries and tool result metadata.

4. **Normal messages → always shown** - Default return is `true`.

**Why this approach:**

The three-condition waterfall provides a **clear priority order**:
- Check type first (avoids checking isMeta on assistant messages which don't have it)
- Check isMeta before isVisibleInTranscriptOnly (stronger restriction takes priority)
- The `isTranscriptView` parameter allows the transcript panel to reveal more messages without changing the `isMeta` contract

**Key insight:** The separation between `isMeta` and `isVisibleInTranscriptOnly` is a **two-level confidentiality model**. `isMeta` is truly hidden (model-only context), while `isVisibleInTranscriptOnly` is "advanced view" content that power users can inspect but that would clutter the main chat.

---

## UI Rendering Pipeline (chunks.161.mjs)

The rendering pipeline applies several sequential filters before displaying messages.

### Complete Filter Pipeline

```javascript
// ============================================
// MessageRenderingPipeline - Full UI filter chain
// Location: chunks.161.mjs:710-723
// ============================================

// ORIGINAL (for source lookup):
let j6 = H ? g : EN(g),
    M6;
if (q[23] !== q1) M6 = (k1) => qYq(k1, q1), q[23] = q1, q[24] = M6;
else M6 = q[24];
let N6 = t9q(j6.filter(f8z).filter(M6), j1),
    F6 = t ? N6.slice(-qd1) : N6;
J1 = t && N6.length > qd1;
let { messages: P1 } = q9q(F6, z, H);
D1 = Y9q(qd7(P1, z)), Z1 = e9q(g, F6)

// READABLE (for understanding):
// Step 1: Apply compaction boundary
let candidateMessages = isTranscriptViewOpen
    ? allMessages                              // Transcript: show all
    : getVisibleMessagesAfterCompact(allMessages); // Chat: only post-compact

// Step 2: Memoize visibility filter (avoid recreating closure on each render)
let visibilityFilter;
if (deps[23] !== isTranscriptViewOpen) {
    visibilityFilter = (msg) => shouldShowMessageInChat(msg, isTranscriptViewOpen);
    deps[23] = isTranscriptViewOpen;
    deps[24] = visibilityFilter;
} else {
    visibilityFilter = deps[24];
}

// Step 3: Apply dual filter (progress + visibility)
let filteredMessages = normalizeDisplayMessages(
    candidateMessages
        .filter(isNotProgress)        // Remove "progress" type messages
        .filter(visibilityFilter),    // Remove isMeta and transcript-only
    columnCount
);

// Step 4: Optional pagination (most recent N messages)
let displayMessages = shouldPaginate
    ? filteredMessages.slice(-messagesPerPage)
    : filteredMessages;

hasTruncated = shouldPaginate && filteredMessages.length > messagesPerPage;

// Step 5: Group tool uses with their results
let { messages: renderableMessages } = groupToolResults(displayMessages, tools, isTranscriptViewOpen);

// Step 6: Memoize for performance
renderableMessages = memoizeRenderableMessages(renderableMessages, tools);

// Step 7: Build lookup tables for message navigation
lookups = buildMessageLookups(allMessages, displayMessages);

// Mapping: H→isTranscriptViewOpen, g→allMessages, EN→getVisibleMessagesAfterCompact,
// q1→isTranscriptViewOpen (deps value), M6→visibilityFilter, f8z→isNotProgress,
// qYq→shouldShowMessageInChat, t9q→normalizeDisplayMessages, j1→columnCount,
// t→shouldPaginate, qd1→messagesPerPage, q9q→groupToolResults, q[23/24]→memoization deps
```

**Filter chain diagram:**

```
allMessages
    │
    ├── [Transcript view?]
    │     YES → Show all messages (including pre-compact)
    │     NO  → getVisibleMessagesAfterCompact (only post last compact boundary)
    │
    │ .filter(isNotProgress)
    ├── Removes type: "progress" messages (streaming progress indicators)
    │
    │ .filter(shouldShowMessageInChat)
    ├── Removes isMeta: true messages (system reminders)
    ├── Removes isVisibleInTranscriptOnly: true IF NOT in transcript view
    │
    │ .slice(-N) [optional pagination]
    ├── Show only last N messages if too many
    │
    │ groupToolResults()
    └── Group tool call + tool result pairs for display
         │
         └── RENDERED TO USER
```

### Compaction Boundary Filter: getVisibleMessagesAfterCompact (EN)

```javascript
// ============================================
// getVisibleMessagesAfterCompact - Show only post-compaction messages
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
    let compactBoundaryIndex = findLastCompactBoundary(messages);
    if (compactBoundaryIndex === -1) return messages; // No compact happened yet
    return messages.slice(compactBoundaryIndex);      // Only show post-compact portion
}

// ============================================
// findLastCompactBoundary (Y2z) - Find last compact boundary marker
// Location: chunks.173.mjs:1278-1284
// ============================================

// ORIGINAL (for source lookup):
function Y2z(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K && cR(K)) return q
    }
    return -1
}

// READABLE (for understanding):
function findLastCompactBoundary(messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
        let msg = messages[i];
        if (msg && isCompactBoundary(msg)) return i;
    }
    return -1; // No compact boundary found
}

// ============================================
// isCompactBoundary (cR) - Check if message is a compact boundary
// Location: chunks.173.mjs:1274-1276
// ============================================

// ORIGINAL (for source lookup):
function cR(A) {
    return A?.type === "system" && A.subtype === "compact_boundary"
}

// READABLE (for understanding):
function isCompactBoundary(message) {
    return message?.type === "system" && message.subtype === "compact_boundary";
}

// Mapping: EN→getVisibleMessagesAfterCompact, Y2z→findLastCompactBoundary,
// cR→isCompactBoundary, A→messages
```

**Why this matters for system reminders:** When compaction happens, the pre-compaction messages are hidden in the normal chat view. System reminders from before the compaction boundary are also hidden. However, the `isMeta` filter is still applied to post-compaction messages - new system reminders injected after compaction are still invisible in chat.

### Progress Message Filter: isNotProgress (f8z)

```javascript
// ============================================
// isNotProgress - Remove progress messages from display
// Location: chunks.161.mjs:571-573
// ============================================

// ORIGINAL (for source lookup):
function f8z(A) {
    return A.type !== "progress"
}

// READABLE (for understanding):
function isNotProgress(message) {
    return message.type !== "progress";
}

// Mapping: f8z→isNotProgress, A→message
```

**Purpose:** `progress` type messages are streaming indicators generated during tool execution. They show real-time progress to the user but are not part of the permanent message history.

---

## Attachment Message Injection Pipeline

Before the UI filters run, system reminder attachments are injected into the message stream via a three-step pipeline.

### attachmentMessageGenerator (oP1)

```javascript
// ============================================
// attachmentMessageGenerator - Async generator for attachment messages
// Location: chunks.142.mjs:2494-2501
// ============================================

// ORIGINAL (for source lookup):
async function* oP1(A, q, K, Y, z, w) {
    let H = await phY(A, q, K, Y, z, w);
    if (H.length === 0) return;
    c("tengu_attachments", {
        attachment_types: H.map(($) => $.type)
    });
    for (let $ of H) yield kq($)
}

// READABLE (for understanding):
async function* attachmentMessageGenerator(
    userMessage,
    sessionContext,
    ideContext,
    queuedCommands,
    messages,
    sessionMemoryType
) {
    // Invoke assembleAttachments (phY) to compute all attachments in parallel
    let attachments = await assembleAttachments(
        userMessage, sessionContext, ideContext, queuedCommands, messages, sessionMemoryType
    );

    if (attachments.length === 0) return; // No attachments, skip

    // Log attachment types for telemetry (every invocation, not sampled)
    logTelemetry("tengu_attachments", {
        attachment_types: attachments.map((att) => att.type)
    });

    // Yield each attachment wrapped in a message envelope
    for (let attachment of attachments) {
        yield convertAttachmentToMessage(attachment);
    }
}

// Mapping: oP1→attachmentMessageGenerator, A→userMessage, q→sessionContext,
// K→ideContext, Y→queuedCommands, z→messages, w→sessionMemoryType,
// H→attachments, $→attachment, phY→assembleAttachments, kq→convertAttachmentToMessage,
// c→logTelemetry
```

**What it does:** Bridge between the attachment production system (`phY`) and the message stream. Converts attachment objects into "attachment envelope" messages.

**Why async generator:** Using a generator allows the agent loop to start processing results as they become available, rather than waiting for all attachments. It also enables cancellation - if the agent loop is aborted, the generator can be abandoned mid-flight.

**Key insight:** The `tengu_attachments` telemetry event logged here (100% of the time, not sampled) is the primary way Anthropic monitors which attachment types are produced in production. The individual producer telemetry in `gw` (timedAttachmentProducer) is sampled at 5% for performance metrics; this function logs ALL attachment types for aggregate analysis.

### convertAttachmentToMessage (kq)

```javascript
// ============================================
// convertAttachmentToMessage - Wrap attachment in message envelope
// Location: chunks.142.mjs:2615-2622
// ============================================

// ORIGINAL (for source lookup):
function kq(A) {
    return {
        attachment: A,
        type: "attachment",
        uuid: FhY(),
        timestamp: new Date().toISOString()
    }
}

// READABLE (for understanding):
function convertAttachmentToMessage(attachment) {
    return {
        attachment: attachment,             // The raw attachment object {type, ...data}
        type: "attachment",                 // Distinguished from "user" / "assistant"
        uuid: generateUUID(),               // Unique ID for deduplication
        timestamp: new Date().toISOString() // When this attachment was produced
    };
}

// Mapping: kq→convertAttachmentToMessage, A→attachment, FhY→generateUUID
```

**Why a separate "attachment" type?** This envelope preserves the original attachment object (e.g., `{type: "plan_mode", reminderType: "full", ...}`) separately from the final normalized message. The normalization step (`K2z`) can then access the full attachment data when converting to API format. This two-phase approach keeps attachment production separate from message formatting.

### reorderAttachments (dzz)

```javascript
// ============================================
// reorderAttachments - Position attachment messages near associated turns
// Location: chunks.172.mjs:3244-3254
// ============================================

// ORIGINAL (for source lookup):
function dzz(A) {
    let q = [],
        K = [];
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z.type === "attachment") K.unshift(z);
        else if ((z.type === "assistant" || z.type === "user"
            && Array.isArray(z.message.content)
            && z.message.content[0]?.type === "tool_result")
            && K.length > 0)
            q.unshift(z, ...K), K.length = 0;
        else q.unshift(z)
    }
    return q.unshift(...K), q
}

// READABLE (for understanding):
function reorderAttachments(messages) {
    const result = [];
    const attachmentBuffer = [];

    // Walk message array backwards to group attachments with next turn
    for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];

        if (message.type === "attachment") {
            // Buffer attachments, collecting them as we walk backwards
            attachmentBuffer.unshift(message);
        }
        else if (
            (message.type === "assistant" ||
             (message.type === "user" &&
              Array.isArray(message.message.content) &&
              message.message.content[0]?.type === "tool_result"))
            && attachmentBuffer.length > 0
        ) {
            // Place this message FOLLOWED BY any buffered attachments
            // This positions attachments right after the turn they belong to
            result.unshift(message, ...attachmentBuffer);
            attachmentBuffer.length = 0; // Clear buffer
        }
        else {
            result.unshift(message); // Regular message, no change
        }
    }

    // Any remaining attachments go at the very beginning
    result.unshift(...attachmentBuffer);

    return result;
}

// Mapping: dzz→reorderAttachments, A→messages, q→result, K→attachmentBuffer,
// Y→i, z→message
```

**Why reordering is needed:** Attachment objects are produced just before an API call and appended to the message array. However, semantically they belong "just before" the user turn that triggers them. Without reordering:
```
[turn 1][turn 2][user message][ATTACHMENTS]
```
After reordering:
```
[turn 1][turn 2][ATTACHMENTS][user message]
```

This ensures the LLM sees context reminders (e.g., "file was modified") immediately before the user message, not after it. The backward-walking algorithm correctly handles multiple consecutive attachments.

---

## Context Message Injection: buildContextMessages (bG1)

A separate, simpler injection mechanism for session-level context (like CLAUDE.md contents, git status, etc.):

```javascript
// ============================================
// buildContextMessages - Inject session context as system reminder
// Location: chunks.148.mjs:2414-2428
// ============================================

// ORIGINAL (for source lookup):
function bG1(A, q) {
    if (Object.entries(q).length === 0) return A;
    return [c6({
        content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(q).map(([K, Y]) => `# ${K}
${Y}`).join(`
`)}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
        isMeta: !0
    }), ...A]
}

// READABLE (for understanding):
function buildContextMessages(messages, contextMap) {
    // If no context to inject, return messages unchanged
    if (Object.entries(contextMap).length === 0) return messages;

    // Build context string from key-value pairs (e.g., {claudeMd: "...", gitStatus: "..."})
    const contextSections = Object.entries(contextMap)
        .map(([title, content]) => `# ${title}\n${content}`)
        .join('\n');

    // Create system reminder with all context sections
    const systemReminderMessage = createUserMessage({
        content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${contextSections}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
        isMeta: true
    });

    // PREPEND the context message so LLM sees it before user messages
    return [systemReminderMessage, ...messages];
}

// Mapping: bG1→buildContextMessages, A→messages, q→contextMap, K→title, Y→content,
// c6→createUserMessage, !0→true
```

**What context is injected here?**

The `contextMap` passed to `bG1` comes from the system prompt building stage and includes:
- `claudeMd` - CLAUDE.md project instructions
- `gitStatus` - Current git status (uncommitted files, branch name)
- `currentDate` - Today's date
- `availableSkills` - Skills listed in system prompt

**Difference from attachment producers:**

| Aspect | buildContextMessages (bG1) | Attachment Producers (phY) |
|--------|---------------------------|---------------------------|
| Content | Static session context | Dynamic state changes |
| Timing | Once per session start | Every agent turn |
| Position | Prepended to messages | Inserted before user message |
| Format | Single combined message | Multiple typed messages |
| Examples | CLAUDE.md, git status | Plan mode, diagnostics, todos |

**Key insight:** The context injected by `bG1` gets the standard `<system-reminder>` tag with the warning "this context may or may not be relevant to your tasks." This is the CLAUDE.md system prompt instruction visible in the conversation that the user sees referenced in system prompt messages.

---

## Message Normalization: normalizeMessages (WJ)

After attachment injection and reordering, the full message array goes through normalization:

```javascript
// ============================================
// normalizeMessages - Transform internal messages to render-ready format
// Location: chunks.173.mjs:89-180+
// ============================================

// ORIGINAL (for source lookup):
function WJ(A, q = []) {
    let K = new Set(q.map((J) => J.name)),
        Y = dzz(A),   // Step 1: Reorder attachments
        z = { ... };  // Step 2: Tool type mappings
    // ... attachment-to-tool-type association loop
    let H = [];
    Y.filter((J) => {
        // Step 3: Filter non-renderable message types
        if (J.type === "progress" || J.type === "system" || pmA(J)) return !1;
        return !0
    }).forEach((J) => {
        switch (J.type) {
            case "user":    { /* normalize user messages */ }
            case "assistant": { /* normalize assistant messages */ }
        }
    });
    return H;
}

// READABLE (for understanding):
function normalizeMessages(messages, tools = []) {
    // Build tool name lookup set
    const toolNames = new Set(tools.map((tool) => tool.name));

    // Step 1: Reorder attachments to be near their associated turns
    const reorderedMessages = reorderAttachments(messages);

    // Step 2: Build tool type associations (attachment type → tool type mapping)
    const toolTypeAssociations = { /* ... */ };

    // Step 3: Process and filter messages for rendering
    const normalizedMessages = [];

    reorderedMessages
        .filter((msg) => {
            // Remove progress messages (streaming indicators)
            if (msg.type === "progress") return false;
            // Remove system messages (compact_boundary markers etc.)
            if (msg.type === "system") return false;
            // Remove API error messages (displayed separately)
            if (isApiErrorMessage(msg)) return false;
            return true;
        })
        .forEach((msg) => {
            switch (msg.type) {
                case "user":
                    // Normalize: associate with tool type, handle isMeta attachments
                    // attachment type messages get converted here via K2z
                    break;
                case "assistant":
                    // Normalize: expand content blocks, track tool IDs
                    break;
            }
        });

    return normalizedMessages;
}

// Mapping: WJ→normalizeMessages, A→messages, q→tools, K→toolNames, Y→reorderedMessages,
// z→toolTypeAssociations, H→normalizedMessages, dzz→reorderAttachments, pmA→isApiErrorMessage
```

**isMeta handling in normalizeMessages:**

The normalization step does NOT filter out `isMeta` messages - that's done later by `shouldShowMessageInChat`. Instead, normalization converts attachment-type messages into their final display format:

```javascript
// Attachment messages encountered during normalization:
// 1. Extract attachment object from envelope: { type: "attachment", attachment: {...} }
// 2. Call K2z(attachment) to convert to API messages (with isMeta: true)
// 3. The resulting messages have isMeta: true
// 4. The UI filter (qYq) will later hide them
```

This means `isMeta` messages DO exist in the normalized message array and ARE passed to the UI rendering pipeline - they're just filtered at the last step before display.

---

## API Preparation: Stripping isMeta Before API Call

The most critical linkage: `isMeta` is an internal flag that must **never reach the Claude API**. The API expects clean `{role: "user"|"assistant", content: ...}` objects.

### formatMessagesForAPI (m9z)

```javascript
// ============================================
// formatMessagesForAPI - Convert internal messages to API format
// Location: chunks.169.mjs:1385-1392
// ============================================

// ORIGINAL (for source lookup):
function m9z(A, q) {
    return c("tengu_api_cache_breakpoints", {
        totalMessageCount: A.length,
        cachingEnabled: q
    }), A.map((K, Y) => {
        return K.type === "user" ? b9z(K, Y > A.length - 3, q) : u9z(K, Y > A.length - 3, q)
    })
}

// READABLE (for understanding):
function formatMessagesForAPI(internalMessages, cachingEnabled) {
    // Log message count for telemetry
    logTelemetry("tengu_api_cache_breakpoints", {
        totalMessageCount: internalMessages.length,
        cachingEnabled: cachingEnabled
    });

    // Convert each message based on role
    return internalMessages.map((message, index) => {
        const isNearEnd = index > internalMessages.length - 3; // Last 3 messages

        if (message.type === "user") {
            return formatUserMessageForAPI(message, isNearEnd, cachingEnabled);
        } else {
            return formatAssistantMessageForAPI(message, isNearEnd, cachingEnabled);
        }
    });
}

// Mapping: m9z→formatMessagesForAPI, A→internalMessages, q→cachingEnabled,
// K→message, Y→index, b9z→formatUserMessageForAPI, u9z→formatAssistantMessageForAPI,
// c→logTelemetry
```

**Critical detail:** At this point in the pipeline, ALL messages (including those with `isMeta: true`) are still in the array. The isMeta flag is used internally up to this point; here it gets implicitly discarded by the formatters.

### formatUserMessageForAPI (b9z)

```javascript
// ============================================
// formatUserMessageForAPI - Produce API-ready user message (strips isMeta)
// Location: chunks.169.mjs:618-643
// ============================================

// ORIGINAL (for source lookup):
function b9z(A, q = !1, K) {
    if (q)
        if (typeof A.message.content === "string") return {
            role: "user",
            content: [{ type: "text", text: A.message.content, ...K ? { cache_control: s91() } : {} }]
        };
        else return {
            role: "user",
            content: A.message.content.map((Y, z) => ({
                ...Y,
                ...z === A.message.content.length - 1 ? K ? { cache_control: s91() } : {} : {}
            }))
        };
    return { role: "user", content: A.message.content }
}

// READABLE (for understanding):
function formatUserMessageForAPI(internalMessage, isNearEnd = false, enableCaching) {
    // For near-end messages, normalize content structure to enable cache control
    if (isNearEnd) {
        if (typeof internalMessage.message.content === "string") {
            return {
                role: "user",
                content: [{
                    type: "text",
                    text: internalMessage.message.content,
                    // Add cache_control to last message if caching enabled
                    ...(enableCaching ? { cache_control: getCacheControl() } : {})
                }]
            };
        } else {
            return {
                role: "user",
                content: internalMessage.message.content.map((block, index) => ({
                    ...block,
                    // Cache control on last content block only
                    ...(index === internalMessage.message.content.length - 1 && enableCaching
                        ? { cache_control: getCacheControl() }
                        : {})
                }))
            };
        }
    }

    // For earlier messages: just return role + content
    // NOTE: isMeta, uuid, timestamp, todos, etc. are ALL dropped here
    return {
        role: "user",
        content: internalMessage.message.content  // Only the actual content survives
    };
}

// Mapping: b9z→formatUserMessageForAPI, A→internalMessage, q→isNearEnd,
// K→enableCaching, Y→block, z→index, s91→getCacheControl
```

**The isMeta stripping mechanism:** There is no explicit `delete message.isMeta` call. Instead, the formatter only outputs `role` and `content` - every other field on the internal message object (`isMeta`, `uuid`, `timestamp`, `todos`, `isVisibleInTranscriptOnly`, etc.) is **implicitly discarded** by the object spread pattern.

This means:
- `internalMessage.isMeta` is `true` for system reminder messages
- `formatUserMessageForAPI` returns `{ role: "user", content: "..." }`
- The Claude API never sees the `isMeta` flag

**Cache control positioning:** Only the last 2-3 messages get cache control breakpoints. This is a prompt caching optimization: the stable system prompt and early conversation get cached, while the most recent context (which changes every turn) is not cached.

---

## System Reminder XML Tag Parsing: extractSystemReminderContent (hMA)

A utility function for parsing the XML tag structure when needed:

```javascript
// ============================================
// SYSTEM_REMINDER_REGEX - Pattern for matching system-reminder tags
// Location: chunks.90.mjs:730
// ============================================

// ORIGINAL (for source lookup):
EL9 = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/

// READABLE (for understanding):
const SYSTEM_REMINDER_REGEX = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/;

// ============================================
// extractSystemReminderContent - Extract content from system-reminder XML
// Location: chunks.90.mjs:517-520
// ============================================

// ORIGINAL (for source lookup):
function hMA(A) {
    let q = A.trim().match(EL9);
    return q && q[1] ? q[1].trim() : null
}

// READABLE (for understanding):
function extractSystemReminderContent(text) {
    let match = text.trim().match(SYSTEM_REMINDER_REGEX);
    return match && match[1] ? match[1].trim() : null;
}

// Mapping: hMA→extractSystemReminderContent, A→text, q→match, EL9→SYSTEM_REMINDER_REGEX
```

**What it does:** Parses a string and extracts the content inside `<system-reminder>...</system-reminder>` tags, returning `null` if the pattern doesn't match.

**Where this is used:**
- When reading back JSONL transcript files, the system reminder content may need to be re-parsed
- When displaying message content in transcript view, reminder tags may be stripped for cleaner display
- When checking if a message IS a system reminder (the regex provides definitive detection)

**Regex breakdown:**
- `^` - Must start at beginning (full-string match)
- `<system-reminder>` - Opening tag
- `\n?` - Optional newline after opening tag
- `([\s\S]*?)` - Capture group: any character including newlines, non-greedy
- `\n?` - Optional newline before closing tag
- `<\/system-reminder>$` - Closing tag at end

The `[\s\S]*?` (non-greedy, any character) is important: it matches multi-line reminder content while still stopping at the first `</system-reminder>`.

---

## Non-UI Uses of isMeta

The `isMeta` flag is used in 10+ places beyond the chat UI filter. Each represents a place where the system needs to distinguish "real" user input from injected context.

### Session Title Generation: getFirstMeaningfulUserMessage (GN6)

```javascript
// ============================================
// getFirstMeaningfulUserMessage - Skip meta messages for session titles
// Location: chunks.173.mjs:2054-2070
// ============================================

// ORIGINAL (for source lookup):
function GN6(A) {
    for (let q of A) {
        if (q.type !== "user" || q.isMeta) continue;
        if ("isCompactSummary" in q && q.isCompactSummary) continue;
        let K = q.message?.content;
        if (!K) continue;
        let Y = "";
        if (typeof K === "string") Y = K;
        else if (Array.isArray(K)) Y = K.find(($) => $.type === "text")?.text || "";
        if (!Y) continue;
        let z = C4(Y, SG);
        return z
    }
}

// READABLE (for understanding):
function getFirstMeaningfulUserMessage(messages) {
    for (let msg of messages) {
        // Skip non-user messages
        if (msg.type !== "user") continue;
        // Skip system reminders (meta messages)
        if (msg.isMeta) continue;
        // Skip compact summaries (also not real user content)
        if ("isCompactSummary" in msg && msg.isCompactSummary) continue;

        let content = msg.message?.content;
        if (!content) continue;

        // Extract text content
        let text = "";
        if (typeof content === "string") text = content;
        else if (Array.isArray(content)) {
            text = content.find((block) => block.type === "text")?.text || "";
        }
        if (!text) continue;

        // Process and return the first meaningful user text
        return processText(text, textProcessingOptions);
    }
}

// Mapping: GN6→getFirstMeaningfulUserMessage, A→messages, q→msg, K→content,
// Y→text, z→processedText, $→block, C4→processText, SG→textProcessingOptions
```

**Purpose:** Used to generate session titles from the first user message. Without the `isMeta` filter, system reminders (which are user-type messages!) would be selected as the "first user message", producing session titles like "Plan mode is active. The user indicated..." instead of the actual user request.

### Real User Message Detection: isValidUserMessage (V2z)

```javascript
// ============================================
// isValidUserMessage - Validate a message is genuine user input
// Location: chunks.173.mjs:2164-2172
// ============================================

// ORIGINAL (for source lookup):
function V2z(A) {
    if (A.type !== "user") return !1;
    if (A.isMeta) return !1;
    let q = A.message?.content;
    if (!q) return !1;
    if (typeof q === "string") return q.trim().length > 0;
    if (Array.isArray(q)) return q.some((K) => K.type === "text" || K.type === "image" || K.type === "document");
    return !1
}

// READABLE (for understanding):
function isValidUserMessage(message) {
    // Must be user-type
    if (message.type !== "user") return false;
    // Must not be a system reminder
    if (message.isMeta) return false;
    // Must have content
    let content = message.message?.content;
    if (!content) return false;
    // String content must be non-empty
    if (typeof content === "string") return content.trim().length > 0;
    // Array content must have at least one text, image, or document block
    if (Array.isArray(content)) {
        return content.some((block) =>
            block.type === "text" || block.type === "image" || block.type === "document"
        );
    }
    return false;
}

// Mapping: V2z→isValidUserMessage, A→message, q→content, K→block
```

**Use case:** Used in contexts where code needs to find "real" user messages (not tool results, not meta messages) - for example, when determining if the agent has received user input yet, or when checking conversation flow.

### Turn Counting Exclusion

```javascript
// ============================================
// Turn counting - skip isMeta messages
// Location: chunks.142.mjs:2843
// ============================================

// ORIGINAL (for source lookup):
if (Y?.type === "user" && !(("isMeta" in Y) && Y.isMeta)) q++;

// READABLE (for understanding):
// Only count real user turns (not system reminders) for todo/task reminder timing
if (message?.type === "user" && !("isMeta" in message && message.isMeta)) {
    turnCount++;
}

// Mapping: Y→message, q→turnCount
```

**Purpose:** Turn counters drive reminder throttling (e.g., "send todo reminder every 5 turns"). If `isMeta` messages counted as turns, the system would count rapidly against the threshold and over-remind. Only real user messages should advance the reminder clock.

### Token Budget Exclusion

```javascript
// ============================================
// Token counting - exclude isMeta messages
// Location: chunks.75.mjs:1715
// ============================================

// ORIGINAL (for source lookup):
let Y = A.filter((z) => z.type === "user" && !z.isMeta).map(R59).filter((z) => z !== void 0);

// READABLE (for understanding):
let thinkingTokenMetadata = messages
    .filter((msg) => msg.type === "user" && !msg.isMeta) // Exclude system reminders
    .map(extractThinkingTokenData)
    .filter((data) => data !== undefined);

// Mapping: A→messages, z→msg or data, R59→extractThinkingTokenData
```

**Purpose:** When calculating available thinking token budget, system reminders are excluded because they represent injected context, not user-driven computation. The thinking budget should reflect what the user is actually asking for.

### Transcript File Parsing Exclusion

```javascript
// ============================================
// Transcript JSONL parsing - skip isMeta lines
// Location: chunks.174.mjs:68-70
// ============================================

// ORIGINAL (for source lookup):
if (!w.includes('"type":"user"') && !w.includes('"type": "user"')) continue;
if (w.includes('"tool_result"')) continue;
if (w.includes('"isMeta":true') || w.includes('"isMeta": true')) continue;

// READABLE (for understanding):
// When reading transcript JSONL file, skip lines that are:
// 1. Not user messages
// 2. Tool result messages
// 3. isMeta messages (system reminders)

if (!line.includes('"type":"user"') && !line.includes('"type": "user"')) continue;
if (line.includes('"tool_result"')) continue;
if (line.includes('"isMeta":true') || line.includes('"isMeta": true')) continue;

// Mapping: w→line
```

**Why string matching instead of JSON parse?** JSONL transcript files can be very large. String pre-filtering (without parsing) provides O(1) checks to skip most lines before the expensive JSON.parse operation. The `"isMeta":true` string check is safe because the field is always serialized with this exact format.

**Impact:** Transcript reading (e.g., for compact memory retrieval) skips all system reminder messages. Only actual conversation turns are processed. This prevents the compaction summarizer from including plan_mode reminders or diagnostic notices in the summary.

### Telemetry Normalization: isSynthetic Field

```javascript
// ============================================
// Telemetry export - normalize isMeta → isSynthetic
// Location: chunks.150.mjs:2358
// ============================================

// ORIGINAL (for source lookup):
yield {
    type: "user",
    message: q.message,
    parent_tool_use_id: A.parentToolUseID,
    session_id: U6(),
    uuid: q.uuid,
    isSynthetic: q.isMeta || q.isVisibleInTranscriptOnly,
    tool_use_result: q.mcpMeta ? { ... } : q.toolUseResult
};

// READABLE (for understanding):
yield {
    type: "user",
    message: message.message,
    parent_tool_use_id: parentToolUseID,
    session_id: getSessionId(),
    uuid: message.uuid,
    // Combine both meta flags into single isSynthetic field for telemetry
    isSynthetic: message.isMeta || message.isVisibleInTranscriptOnly,
    tool_use_result: message.mcpMeta ? buildMcpToolResult(message) : message.toolUseResult
};

// Mapping: q→message, A→parentMessage, isSynthetic→(isMeta OR isVisibleInTranscriptOnly)
```

**Why `isSynthetic`?** The telemetry backend uses a unified `isSynthetic` field rather than two separate flags. Both `isMeta` (model-only) and `isVisibleInTranscriptOnly` (transcript-only) represent messages that were not direct user input - they are "synthetic" from the user's perspective. Combining them simplifies downstream analytics.

**Use case for Anthropic:** Separating real user inputs from synthetic messages is essential for:
- Measuring actual user engagement (not inflated by reminder injections)
- Training data curation (synthetic messages shouldn't be used as training examples of user speech)
- Quality analysis (response quality metrics should compare against real user messages)

### Debug Logging: [META] Marker

```javascript
// ============================================
// Debug logging - mark isMeta messages for developers
// Location: chunks.130.mjs:1853
// ============================================

// ORIGINAL (for source lookup):
W = "isMeta" in j && j.isMeta ? " [META]" : "",
G = P.substring(0, 200);
h(`  Message ${M+1}${W}: ${G}`)

// READABLE (for understanding):
let metaMarker = ("isMeta" in message) && message.isMeta ? " [META]" : "";
let preview = messageText.substring(0, 200);
logDebug(`  Message ${messageIndex+1}${metaMarker}: ${preview}`);

// Mapping: j→message, W→metaMarker, P→messageText, M→messageIndex,
// G→preview, h→logDebug
```

**Purpose:** During development/debugging, log output clearly identifies which messages are system reminders with `[META]` suffix. This helps developers distinguish system context from actual conversation when reviewing debug logs.

### Permission Context Filtering

```javascript
// ============================================
// Permission context - filter out isMeta for tool permission tracking
// Location: chunks.179.mjs:124
// ============================================

// ORIGINAL (for source lookup):
Z1 = O1.filter((q6) =>
    q6.type === "user" && !q6.isMeta && !q6.toolUseResult ||
    q6.type === "system" && q6.subtype === "compact_boundary"
)

// READABLE (for understanding):
let realUserMessagesAndBoundaries = allMessages.filter((msg) =>
    // Include real user messages (not meta, not tool results)
    (msg.type === "user" && !msg.isMeta && !msg.toolUseResult) ||
    // Include compact boundaries (to handle post-compaction context)
    (msg.type === "system" && msg.subtype === "compact_boundary")
);

// Mapping: O1→allMessages, q6→msg, Z1→realUserMessagesAndBoundaries
```

**Purpose:** When building the permission context (which determines what tools were used and in what order), only real user messages and compact boundaries matter. System reminders don't represent user-initiated actions, so they shouldn't affect permission tracking.

---

## End-to-End Flow: User Sends Message

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. USER SENDS MESSAGE: "Fix the authentication bug"                  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 2. ATTACHMENT PRODUCTION (phY / assembleAttachments)                │
│                                                                      │
│    Parallel computation of 40+ producers, e.g.:                    │
│    • ideContext has selection → selected_lines_in_ide attachment    │
│    • LSP diagnostics pending → diagnostics attachment               │
│    • Plan mode active → plan_mode attachment                        │
│    • 5+ turns since last TodoWrite → todo_reminder attachment       │
│                                                                      │
│    Result: [                                                         │
│      {type: "selected_lines_in_ide", content: "..."},               │
│      {type: "diagnostics", files: [...]},                           │
│      {type: "plan_mode", reminderType: "sparse", ...},              │
│      {type: "todo_reminder", content: [...]}                        │
│    ]                                                                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 3. ATTACHMENT NORMALIZATION (K2z / normalizeAttachmentForAPI)       │
│                                                                      │
│    Each attachment converted to user message(s) with isMeta: true   │
│                                                                      │
│    • selected_lines_in_ide → c6("The user selected lines 10-20...") │
│    • diagnostics → c6("<new-diagnostics>...") wrapped in _9()       │
│    • plan_mode → azz() → A2z("Plan mode still active...") sparse    │
│    • todo_reminder → c6("The TodoWrite tool hasn't been used...")   │
│                                                                      │
│    Result: [                                                         │
│      {type:"user", message:{role:"user", content:"The user sel.."}, │
│       isMeta: true, uuid: "..."},                                    │
│      {type:"user", message:{role:"user", content:"<new-diag.."}, ... │
│      ... (4 messages total)                                          │
│    ]                                                                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 4. MESSAGE ASSEMBLY (buildContextMessages + attachment injection)    │
│                                                                      │
│    Full message array before API call:                              │
│    [                                                                 │
│      {type:"user", content:"<system-reminder>\nclaudeMd...", isMeta:true}, ← bG1
│      ...previous turns...                                           │
│      {type:"user", content:"Fix auth bug", isMeta: false},  ← real user
│      {type:"user", content:"The user sel lines..", isMeta:true}, ← attachment
│      {type:"user", content:"<new-diag..", isMeta:true},     ← attachment
│      {type:"user", content:"Plan mode still..", isMeta:true},← attachment
│      {type:"user", content:"TodoWrite...", isMeta:true}      ← attachment
│    ]                                                                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ↓ (two branches: UI rendering and API call)
         ┌─────────────────────┴──────────────────────┐
         │                                            │
         ↓                                            ↓
┌────────────────────┐                 ┌───────────────────────────────┐
│ 5a. UI RENDERING   │                 │ 5b. API CALL FORMATTING        │
│                    │                 │                               │
│ filter pipeline:   │                 │ m9z() maps each message:      │
│ .filter(f8z)       │                 │  • b9z() for user messages    │
│ .filter(qYq)       │                 │  • u9z() for assistant msgs   │
│                    │                 │                               │
│ qYq filters:       │                 │ OUTPUT: strips all fields     │
│ • isMeta → HIDDEN  │                 │ except role + content         │
│                    │                 │ (isMeta, uuid, etc DROPPED)   │
│ USER SEES:         │                 │                               │
│ • "Fix auth bug"   │                 │ API receives:                 │
│   (and prev turns) │                 │ [                             │
│                    │                 │   {role:"user", content:      │
│ USER DOES NOT SEE: │                 │     "<system-reminder>..."},  │
│ • Context reminder │                 │   ...previous turns...        │
│ • IDE selection    │                 │   {role:"user", content:      │
│ • Diagnostics      │                 │     "Fix auth bug"},          │
│ • Plan mode        │                 │   {role:"user", content:      │
│ • Todo reminder    │                 │     "The user sel lines..."},  │
│                    │                 │   ... (all messages)          │
└────────────────────┘                 └───────────────────────────────┘
                                                      │
                                                      ↓
                                       ┌─────────────────────────────┐
                                       │ 6. LLM PROCESSES CONTEXT    │
                                       │                             │
                                       │ Claude sees ALL messages    │
                                       │ including system reminders  │
                                       │                             │
                                       │ Generates response with     │
                                       │ awareness of:               │
                                       │ • IDE selection context     │
                                       │ • New diagnostics           │
                                       │ • Plan mode constraints     │
                                       │ • Todo state                │
                                       └─────────────────────────────┘
```

---

## Design Decisions and Trade-offs

### Decision 1: isMeta Flag on Internal Message Object vs. Separate Track

**Chosen approach:** Single message type with `isMeta` flag.

**Alternative:** Two separate message arrays - one for LLM, one for UI.

**Why the flag approach wins:**
- Single unified array simplifies message ordering, compaction, and history management
- Compaction can operate on one array and preserve semantic ordering
- Turn counting, token usage, etc. need to see ALL messages in context
- Adding a new `isHidden` field to existing message structure is zero-cost at runtime

**Trade-off:** The UI must filter on every render. But with `shouldShowMessageInChat` being a simple boolean check, this is O(N) per render where N is message count - negligible given React's reconciliation handles this efficiently.

### Decision 2: isMeta Stripped at Formatter Level, Not Earlier

**Chosen approach:** Strip in `b9z`/`u9z` (formatUserMessageForAPI, formatAssistantMessageForAPI).

**Alternative:** Strip when building the API message array.

**Why format-level stripping:**
- Keeps the internal pipeline uniform - everything operates on the same message objects
- No need for a separate "sanitized for API" representation
- The formatter is already the conversion boundary - it's the natural place to control output shape
- Future formatters can choose to include different metadata for different API endpoints

**Trade-off:** The Claude API never receives `isMeta`. This is an invariant that must hold. If a new formatter is written and forgets to strip `isMeta`, the API would receive it. However, since the Claude API currently ignores unknown fields, this would be harmless - but is still good practice to strip.

### Decision 3: isVisibleInTranscriptOnly as Second Visibility Tier

**Chosen approach:** Two flags (`isMeta` and `isVisibleInTranscriptOnly`) for two different hiding behaviors.

**Why two tiers:**
- `isMeta` messages are **truly invisible** - users should never see plan_mode reminders in any view
- `isVisibleInTranscriptOnly` messages are **advanced view only** - compact summaries and tool metadata that technical users may want to inspect
- Developers need a way to understand what happened without polluting the main chat

**Trade-off:** Adds complexity to `shouldShowMessageInChat`. The transcript view parameter must be correctly threaded through the component tree.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (UI)

Key functions in this document:

**UI Visibility:**
- `shouldShowMessageInChat` (qYq) - Core UI filter gate, chunks.173.mjs:1292
- `getVisibleMessagesAfterCompact` (EN) - Show messages after compact boundary, chunks.173.mjs:1286
- `findLastCompactBoundary` (Y2z) - Locate last compact_boundary marker, chunks.173.mjs:1278
- `isCompactBoundary` (cR) - Check if message is a boundary, chunks.173.mjs:1274
- `isNotProgress` (f8z) - Filter progress messages, chunks.161.mjs:571

**Attachment Injection:**
- `attachmentMessageGenerator` (oP1) - Async generator yielding attachments, chunks.142.mjs:2494
- `convertAttachmentToMessage` (kq) - Wrap attachment in message envelope, chunks.142.mjs:2615
- `reorderAttachments` (dzz) - Reorder attachments near associated turns, chunks.172.mjs:3244
- `buildContextMessages` (bG1) - Prepend session context reminder, chunks.148.mjs:2414

**Message Normalization:**
- `normalizeMessages` (WJ) - Transform internal messages to render format, chunks.173.mjs:89
- `extractSystemReminderContent` (hMA) - Parse `<system-reminder>` tags, chunks.90.mjs:517
- `SYSTEM_REMINDER_REGEX` (EL9) - Regex for system reminder tags, chunks.90.mjs:730

**API Preparation:**
- `formatMessagesForAPI` (m9z) - Convert all messages to API format, chunks.169.mjs:1385
- `formatUserMessageForAPI` (b9z) - Format user message, strips isMeta, chunks.169.mjs:618
- `formatAssistantMessageForAPI` (u9z) - Format assistant message, chunks.169.mjs:645

**Message Classification:**
- `isValidUserMessage` (V2z) - Detect genuine user input, chunks.173.mjs:2164
- `getFirstMeaningfulUserMessage` (GN6) - Get first non-meta user message, chunks.173.mjs:2054

---

## Related Documents

- [overview.md](./overview.md) - System reminder architecture overview
- [reminder_types.md](./reminder_types.md) - Complete catalog of 57 reminder types
- [attachment_producers.md](./attachment_producers.md) - Deep dive into 40+ producers
- [integration_points.md](./integration_points.md) - Cross-module integration analysis
- [edge_cases_and_failures.md](./edge_cases_and_failures.md) - Error handling deep dive
- [performance_and_telemetry.md](./performance_and_telemetry.md) - Performance optimization analysis
