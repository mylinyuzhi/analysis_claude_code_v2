# Memory Attachment Normalization Analysis

## Overview

This document analyzes how memory-related attachment types are normalized for the LLM API in the `normalizeAttachmentForAPI` function (`Ui8`). Memory attachments are converted into meta-flagged user messages wrapped in `<system-reminder>` XML tags for injection into the conversation stream.

**Key insight**: Memory attachments use a two-layer transformation: content formatting + XML wrapping. This ensures memories are visible to the LLM as contextual context while being hidden from the user.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions:
- `normalizeAttachmentForAPI` (`Ui8`) - Main dispatcher (chunks.174.mjs:3)
- `wrapWithSystemReminderTags` (`b5`) - XML wrapper (chunks.173.mjs:2496)
- `createUserMessage` (`p1`) - Message factory (chunks.173.mjs:1378)
- `buildStalenessWarning` (`Cz8`) - Staleness warning (chunks.50.mjs:2487)
- `formatRelativeTime` (`cJ7`) - Time formatter (chunks.50.mjs:2480)

---

## 1. Normalization Architecture

### 1.1 Function Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                  MEMORY ATTACHMENT NORMALIZATION                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Attachment Input                                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ { type: "relevant_memories", memories: [...] }               │  │
│  │ { type: "nested_memory", content: "..." }                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ normalizeAttachmentForAPI (Ui8)                              │  │
│  │ - Switch on attachment type                                  │  │
│  │ - Route to appropriate handler                               │  │
│  └───────────────┬──────────────────────────────────────────────┘  │
│                  │                                                  │
│                  ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Content Formatting                                            │  │
│  │ - Add staleness warnings                                     │  │
│  │ - Format headers with timestamps                             │  │
│  │ - Truncate if needed                                         │  │
│  └───────────────┬──────────────────────────────────────────────┘  │
│                  │                                                  │
│                  ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ createUserMessage (p1)                                        │  │
│  │ - Set isMeta: true                                           │  │
│  │ - Create user-role message                                   │  │
│  └───────────────┬──────────────────────────────────────────────┘  │
│                  │                                                  │
│                  ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ wrapWithSystemReminderTags (b5)                               │  │
│  │ - Wrap in <system-reminder>...</system-reminder>             │  │
│  └───────────────┬──────────────────────────────────────────────┘  │
│                  │                                                  │
│                  ▼                                                  │
│  API Message Output                                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ { role: "user", content: "<system-reminder>...</>",          │  │
│  │   isMeta: true }                                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Main Dispatcher Function

### 2.1 normalizeAttachmentForAPI (Ui8)

**Location**: chunks.174.mjs:3-469

This is the main dispatcher that routes attachments to their appropriate normalization handlers.

// ============================================
// normalizeAttachmentForAPI - Main dispatcher for attachment normalization
// Location: chunks.174.mjs:3-469
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (E7()) {
        // Team mode handling (pre-switch)
        if (A.type === "teammate_mailbox") return [...];
        if (A.type === "team_context") return [...];
    }
    switch (A.type) {
        case "directory": return ...;
        case "edited_text_file": return ...;
        case "file": return ...;
        // ... many other cases
        case "relevant_memories": return ...;  // Memory case
        case "nested_memory": return ...;       // Memory case
        // ...
    }
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Pre-switch: Team mode attachments
    if (isTeamMode()) {
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
...
</system-reminder>`,
                isMeta: true
            })];
        }
    }

    // Main switch: Handle all attachment types
    switch (attachment.type) {
        case "relevant_memories":
            return normalizeRelevantMemories(attachment);
        case "nested_memory":
            return normalizeNestedMemory(attachment);
        // ... other cases
    }
}

// Mapping: Ui8 → normalizeAttachmentForAPI, E7 → isTeamMode, p1 → createUserMessage

---

## 3. relevant_memories Normalization

### 3.1 Implementation

// ============================================
// relevant_memories case - Normalize memory files with staleness
// Location: chunks.174.mjs:172-184
// ============================================

// ORIGINAL (for source lookup):
case "relevant_memories":
    return b5(A.memories.map((K) => {
        let Y = Cz8(K.mtimeMs),
            z = Y ? `${Y}

Memory: ${K.path}:` : `Memory (saved ${cJ7(K.mtimeMs)}): ${K.path}:`;
        return p1({
            content: `${z}

${K.content}`,
            isMeta: !0
        })
    }));

// READABLE (for understanding):
case "relevant_memories":
    return wrapWithSystemReminderTags(
        attachment.memories.map((memory) => {
            // Step 1: Check staleness (> 1 day old)
            const stalenessWarning = buildStalenessWarning(memory.mtimeMs);  // Cz8

            // Step 2: Format header with or without warning
            const header = stalenessWarning
                ? `${stalenessWarning}\n\nMemory: ${memory.path}:`
                : `Memory (saved ${formatRelativeTime(memory.mtimeMs)}): ${memory.path}:`;

            // Step 3: Create meta message with header + content
            return createUserMessage({
                content: `${header}\n\n${memory.content}`,
                isMeta: true
            });
        })
    );

// Mapping:
// b5 → wrapWithSystemReminderTags
// Cz8 → buildStalenessWarning
// cJ7 → formatRelativeTime
// p1 → createUserMessage
// A → attachment
// K → memory

### 3.2 Output Format Examples

**Fresh memory (< 1 day old)**:
```xml
<system-reminder>
Memory (saved today): /path/to/debugging.md:

# Debugging Notes

- Always check logs first
- Use verbose mode for stack traces
...
</system-reminder>
```

**Stale memory (> 1 day old)**:
```xml
<system-reminder>
This memory is 5 days old. Memories are point-in-time observations, not live state — claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact.

Memory: /path/to/patterns.md:

# Project Patterns

- Use TypeScript for all new files
...
</system-reminder>
```

### 3.3 Algorithm Analysis

**Staleness Detection Decision**:

```
getDaysSinceTimestamp(mtimeMs)
    │
    ├── days <= 1 → No warning (fresh)
    │   └── Header: "Memory (saved today/yesterday): {path}:"
    │
    └── days > 1 → Warning added (stale)
        └── Header: "{warning}\n\nMemory: {path}:"
```

**Why this approach**:
1. **Freshness awareness**: Agents know when memory was last updated
2. **Verification prompt**: Encourages checking outdated claims
3. **User-friendly format**: Relative time ("today", "yesterday", "5 days ago")
4. **Non-blocking**: Staleness doesn't prevent memory usage

---

## 4. nested_memory Normalization

### 4.1 Implementation

The `nested_memory` type handles memory loaded via CLAUDE.md @include directives.

// ============================================
// nested_memory case - Normalize included memory files
// Location: chunks.174.mjs (inferred from context)
// ============================================

// READABLE (for understanding):
case "nested_memory":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `Memory: ${attachment.path}:\n\n${attachment.content}`,
            isMeta: true
        })
    ]);

**Difference from relevant_memories**:
- `nested_memory` is a single file from explicit @include
- `relevant_memories` is multiple files from semantic search
- `nested_memory` doesn't include staleness by default (loaded via explicit reference)
- `relevant_memories` always includes staleness/timestamp

---

## 5. Helper Functions

### 5.1 wrapWithSystemReminderTags (b5)

**Location**: chunks.173.mjs:2496-2523

// ============================================
// wrapWithSystemReminderTags - Wrap messages in XML tags
// Location: chunks.173.mjs:2496-2523
// ============================================

// READABLE (for understanding):
function wrapWithSystemReminderTags(messages) {
    if (!messages || messages.length === 0) return [];

    // Wrap each message in system-reminder tags
    return messages.map((message) => {
        if (message.content && typeof message.content === "string") {
            return {
                ...message,
                content: `<system-reminder>
${message.content}
</system-reminder>`
            };
        }
        return message;
    });
}

// Mapping: b5 → wrapWithSystemReminderTags

**Purpose**:
- Adds XML boundary markers for LLM context separation
- Enables the model to distinguish system context from user messages
- Preserves message metadata (isMeta flag)

### 5.2 createUserMessage (p1)

**Location**: chunks.173.mjs:1378-1412

// ============================================
// createUserMessage - Create user-role message with metadata
// Location: chunks.173.mjs:1378-1412
// ============================================

// READABLE (for understanding):
function createUserMessage(options) {
    const { content, isMeta = false, ...otherFields } = options;

    return {
        role: "user",
        content: content,
        isMeta: isMeta,  // Used for UI filtering and compaction rules
        ...otherFields
    };
}

// Mapping: p1 → createUserMessage

**Key field: isMeta**:
- When `true`: Message is hidden from user in chat UI
- When `true`: Message has special retention rules during compaction
- Used for all system reminder messages

### 5.3 buildStalenessWarning (Cz8)

**Location**: chunks.50.mjs:2487-2491

// ============================================
// buildStalenessWarning - Generate staleness warning message
// Location: chunks.50.mjs:2487-2491
// ============================================

// ORIGINAL (for source lookup):
function Cz8(A) {
    let q = dJ7(A);
    if (q <= 1) return "";
    return `This memory is ${q} days old. ` + "Memories are point-in-time observations, not live state — " + "claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."
}

// READABLE (for understanding):
function buildStalenessWarning(timestamp) {
    const days = getDaysSinceTimestamp(timestamp);

    // No warning for fresh memories (< 2 days old)
    if (days <= 1) return "";

    // Generate warning for stale memories
    return `This memory is ${days} days old. ` +
           "Memories are point-in-time observations, not live state — " +
           "claims about code behavior or file:line citations may be outdated. " +
           "Verify against current code before asserting as fact.";
}

// Mapping: Cz8 → buildStalenessWarning, dJ7 → getDaysSinceTimestamp

**Warning threshold**: Only warns if memory is > 1 day old (days <= 1 returns empty string)

### 5.4 formatRelativeTime (cJ7)

**Location**: chunks.50.mjs:2480-2485

// ============================================
// formatRelativeTime - Format timestamp as relative time
// Location: chunks.50.mjs:2480-2485
// ============================================

// ORIGINAL (for source lookup):
function cJ7(A) {
    let q = dJ7(A);
    if (q === 0) return "today";
    if (q === 1) return "yesterday";
    return `${q} days ago`
}

// READABLE (for understanding):
function formatRelativeTime(timestamp) {
    const days = getDaysSinceTimestamp(timestamp);

    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    return `${days} days ago`;
}

// Mapping: cJ7 → formatRelativeTime, dJ7 → getDaysSinceTimestamp

---

## 6. Integration with Memory Producers

### 6.1 Producer → Normalization Flow

```
produceRelevantMemories (buY)           chunks.147.mjs:552
    │
    ├── Search memory files (a4q)
    ├── Read with truncation (h36)
    ├── Add staleness metadata (mtimeMs)
    │
    └── Return: { type: "relevant_memories", memories: [...] }
                    │
                    ▼
normalizeAttachmentForAPI (Ui8)         chunks.174.mjs:3
    │
    ├── Switch on "relevant_memories"
    ├── For each memory:
    │   ├── Build staleness warning (Cz8)
    │   ├── Format header with timestamp (cJ7)
    │   └── Create meta message (p1)
    │
    └── Wrap in system-reminder tags (b5)
                    │
                    ▼
API Message Array
[{ role: "user", content: "<system-reminder>...", isMeta: true }]
```

### 6.2 Cross-Reference

| Component | Module | Key Function |
|-----------|--------|--------------|
| Memory production | 31_auto_memory | `produceRelevantMemories` (buY) |
| Attachment assembly | 04_system_reminder | `assembleAllAttachments` (_uY) |
| Normalization | 04_system_reminder | `normalizeAttachmentForAPI` (Ui8) |
| XML wrapping | 04_system_reminder | `wrapWithSystemReminderTags` (b5) |

---

## 7. Design Decisions

### 7.1 Why User Messages Instead of System Messages?

Memory attachments become **user-role messages** with `isMeta: true`, not system messages:

**Reasons**:
1. **Conversation context**: User messages appear inline at the right point
2. **Compaction compatibility**: Meta messages have special retention rules
3. **Pipeline uniformity**: Single message processing pipeline

### 7.2 Why XML Tags?

The `<system-reminder>` tags serve as:

1. **Boundary markers**: Distinguish system context from user messages
2. **Instruction visibility**: LLM knows this is contextual, not conversational
3. **Parsing hooks**: UI can filter these from chat display

### 7.3 Why Staleness Warnings?

**Problem**: Memory content becomes outdated as code changes

**Solution**: Add warnings when memory is > 1 day old

**Trade-off**:
- ✅ Encourages verification of old claims
- ✅ Reminds agent that memory is point-in-time
- ⚠️ Adds noise to every stale memory
- ⚠️ Fixed threshold (1 day) may not suit all use cases

---

## 8. Error Handling

### 8.1 Missing Fields

```javascript
// If attachment.memories is missing or empty
if (!attachment.memories || attachment.memories.length === 0) {
    return [];  // No messages to add
}
```

### 8.2 Invalid mtimeMs

```javascript
// If mtimeMs is invalid, staleness functions return safe defaults
getDaysSinceTimestamp(NaN)  // Returns 0 (today)
formatRelativeTime(NaN)     // Returns "today"
buildStalenessWarning(NaN)  // Returns "" (no warning)
```

---

## Summary

The memory attachment normalization system provides:

1. **Two memory types**: `relevant_memories` (semantic search) and `nested_memory` (explicit include)
2. **Staleness awareness**: Warnings when memory is > 1 day old
3. **Relative timestamps**: "today", "yesterday", "N days ago"
4. **Meta message flags**: Hidden from user UI, special compaction rules
5. **XML wrapping**: `<system-reminder>` tags for context separation
6. **Graceful degradation**: Safe defaults for missing/invalid data

**Key architectural insight**: Memory normalization transforms raw memory files into contextual system reminders that guide the LLM's behavior without cluttering the user-visible conversation. The staleness detection ensures agents verify outdated information rather than blindly trusting stale memory.

---

## Related Documentation

- [27_relevant_memories_attachment.md](./27_relevant_memories_attachment.md) - Memory producer implementation
- [memory_logic.md](./memory_logic.md) - Core memory logic
- [../04_system_reminder/attachment_producers.md](../04_system_reminder/attachment_producers.md) - All attachment producers
- [../04_system_reminder/implementation_details.md](../04_system_reminder/implementation_details.md) - Normalization details