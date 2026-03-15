# Background Agents — Compact Integration (Claude Code 2.1.76)

> Analysis of how background agents interact with context compaction: transcript preservation,
> message filtering, and session memory handling.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `loadTranscript` (sP1) - Loads agent transcript from disk — `chunks.173.mjs:2722`
- `buildConversationChain` (ld1) - Reconstructs message chain from parent references — `chunks.173.mjs:2092`
- `filterWhitespaceAssistant` (BQ1) - Removes whitespace-only assistant messages — `chunks.173.mjs:1388`
- `filterThinkingOnlyAssistant` (mQ1) - Removes thinking-only messages — `chunks.173.mjs:1435`
- `stripOrphanedToolResults` (wP6) - Removes tool results without matching tool use — `chunks.173.mjs:344`
- `getSessionPathForSubagent` (kh) - Gets transcript path for agent ID — `chunks.1.mjs:2500`
- `prefixAgentId` (xZ) - Prefixes agent ID for path resolution — `chunks.89.mjs:894`

---

## Overview

Background agents present unique challenges for context compaction:

1. **Transcript persistence** - Agent transcripts are stored separately from the main conversation
2. **Resume capability** - Compacted conversations can still resume background agents
3. **Message filtering** - Compaction must handle agent-specific message types

---

## Deep Analysis: Transcript Storage

### Transcript File Location

**What it does:** Each background agent's transcript is stored in a separate file, allowing independent resumption.

```javascript
// ============================================
// getSessionPathForSubagent - Get transcript path for agent
// Location: chunks.1.mjs:2500
// ============================================

// ORIGINAL (for source lookup):
// kh function resolves the path for a subagent transcript

// READABLE (for understanding):
function getSessionPathForSubagent(agentId) {
    // Returns path like: ~/.claude/sessions/prefix_agentId.jsonl
    // The prefix distinguishes agent types (a, b, r, t)
    return joinPath(getSessionsDir(), `${agentId}.jsonl`);
}

// Mapping: kh→getSessionPathForSubagent
```

### Transcript Loading for Resume

**What it does:** When resuming a background agent, its transcript is loaded from disk and filtered.

```javascript
// ============================================
// loadTranscript - Load agent transcript from disk
// Location: chunks.173.mjs:2722-2735
// ============================================

// ORIGINAL (for source lookup):
async function sP1(A) {
    let q = kh(A),
        K = b1();
    try {
        K.statSync(q)
    } catch {
        return null
    }
    try {
        let {
            messages: Y
        } = await _R6(q, !1, !1, void 0, void 0, void 0, q), z = [];
        for (let w of Y)
            if (w.type === "user" || w.type === "assistant") z.push(w);
        return z
    } catch (Y) {
        return K1(Y), null
    }
}

// READABLE (for understanding):
async function loadTranscript(agentId) {
    let transcriptPath = getSessionPathForSubagent(agentId);
    let fs = getFileSystem();

    // Check if transcript exists
    try {
        fs.statSync(transcriptPath);
    } catch {
        return null;  // No transcript file
    }

    try {
        // Load and parse the transcript
        let { messages } = await parseTranscriptFile(transcriptPath);

        // Filter to only user/assistant messages
        let filteredMessages = [];
        for (let message of messages) {
            if (message.type === "user" || message.type === "assistant") {
                filteredMessages.push(message);
            }
        }
        return filteredMessages;
    } catch (error) {
        logError(error);
        return null;
    }
}

// Mapping: sP1→loadTranscript, kh→getSessionPathForSubagent, b1→getFileSystem,
//   _R6→parseTranscriptFile
```

**Why this approach:**
- **Separate storage** - Each agent has its own transcript, preventing merge conflicts
- **Lazy loading** - Transcripts are only loaded when needed for resume
- **Message filtering** - Only user/assistant messages are kept for context

---

## Deep Analysis: Message Filtering for Compaction

### Filter Chain for Transcripts

**What it does:** Before using a transcript for context, several filters are applied to clean the message history.

```javascript
// ============================================
// Filter chain applied to transcripts
// Location: chunks.173.mjs (various)
// ============================================

// READABLE (for understanding):
function filterTranscriptForResume(messages) {
    // Step 1: Strip orphaned tool results (results without matching tool use)
    let step1 = stripOrphanedToolResults(messages);

    // Step 2: Remove thinking-only assistant messages
    let step2 = filterThinkingOnlyAssistant(step1);

    // Step 3: Remove whitespace-only assistant messages
    let step3 = filterWhitespaceAssistant(step2);

    return step3;
}

// This chain ensures:
// - No dangling tool_result blocks
// - No empty thinking blocks
// - No whitespace-only messages
```

### stripOrphanedToolResults

**What it does:** Removes tool_result blocks that don't have a corresponding tool_use in the preceding assistant message.

```javascript
// ============================================
// stripOrphanedToolResults - Remove orphaned results
// Location: chunks.173.mjs:344
// ============================================

// ORIGINAL (for source lookup):
function wP6(A) {
    // ... implementation removes tool_result content blocks
    // that don't match any tool_use in the conversation
}

// READABLE (for understanding):
function stripOrphanedToolResults(messages) {
    // After compaction, some tool_use blocks may be removed
    // but their corresponding tool_result blocks remain.
    // This function removes those orphaned results.

    let toolUseIds = new Set();

    // First pass: collect all tool_use IDs
    for (let message of messages) {
        if (message.type === "assistant") {
            for (let block of message.content || []) {
                if (block.type === "tool_use") {
                    toolUseIds.add(block.id);
                }
            }
        }
    }

    // Second pass: filter tool_result blocks
    return messages.map(message => {
        if (message.type === "user") {
            let filteredContent = (message.content || []).filter(block => {
                if (block.type === "tool_result") {
                    return toolUseIds.has(block.tool_use_id);
                }
                return true;
            });
            return { ...message, content: filteredContent };
        }
        return message;
    });
}

// Mapping: wP6→stripOrphanedToolResults
```

**Why this approach:**
- **Compaction aftermath** - When messages are summarized, tool_use blocks may be removed
- **Prevents API errors** - Anthropic API rejects tool_result without matching tool_use
- **Two-pass algorithm** - Collects all IDs first, then filters

### filterThinkingOnlyAssistant

**What it does:** Removes assistant messages that contain only thinking blocks (no visible content).

```javascript
// ============================================
// filterThinkingOnlyAssistant - Remove thinking-only messages
// Location: chunks.173.mjs:1435
// ============================================

// ORIGINAL (for source lookup):
function mQ1(A) {
    // Filters messages where assistant only has thinking blocks
}

// READABLE (for understanding):
function filterThinkingOnlyAssistant(messages) {
    return messages.filter(message => {
        if (message.type !== "assistant") return true;

        let content = message.content || [];
        // Check if all blocks are thinking blocks
        let hasOnlyThinking = content.every(block =>
            block.type === "thinking" || block.type === "redacted_thinking"
        );

        // Keep message if it has non-thinking content
        return !hasOnlyThinking;
    });
}

// Mapping: mQ1→filterThinkingOnlyAssistant
```

### filterWhitespaceAssistant

**What it does:** Removes assistant messages that contain only whitespace text.

```javascript
// ============================================
// filterWhitespaceAssistant - Remove whitespace-only messages
// Location: chunks.173.mjs:1388
// ============================================

// ORIGINAL (for source lookup):
function BQ1(A) {
    // Filters messages where assistant content is only whitespace
}

// READABLE (for understanding):
function filterWhitespaceAssistant(messages) {
    return messages.filter(message => {
        if (message.type !== "assistant") return true;

        let content = message.content || [];
        let textContent = content
            .filter(block => block.type === "text")
            .map(block => block.text)
            .join("");

        // Keep message if it has non-whitespace content
        return textContent.trim().length > 0;
    });
}

// Mapping: BQ1→filterWhitespaceAssistant
```

---

## Deep Analysis: Background Agent Messages in Compaction

### Preservation Strategy

**How background agent messages are handled during compaction:**

1. **Task launch messages** - Kept in main conversation (shows the agent was spawned)
2. **Task notifications** - Kept as completion status (shows the agent finished)
3. **Progress attachments** - May be summarized if space is needed

### Compaction Flow with Background Tasks

```
┌─────────────────────────────────────────────────────────────────┐
│                 Compaction Trigger                              │
│                                                                 │
│  Token count exceeds threshold (80% of limit)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Message Selection                               │
│                                                                 │
│  1. Keep recent messages (last N turns)                        │
│  2. Summarize older messages                                    │
│  3. Preserve task-status and task-notification attachments     │
│  4. Optionally summarize task_progress attachments             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Summary Generation                              │
│                                                                 │
│  Summaries include:                                            │
│  - Background agents launched                                  │
│  - Background agents completed/failed                          │
│  - Key results from agents                                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Message Replacement                             │
│                                                                 │
│  Replace summarized messages with:                             │
│  - System message with summary                                 │
│  - Compact representation of background task outcomes          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Filter Application                              │
│                                                                 │
│  Apply filter chain:                                           │
│  1. stripOrphanedToolResults                                   │
│  2. filterThinkingOnlyAssistant                                │
│  3. filterWhitespaceAssistant                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Resume After Compaction

### Transcript Independence

**Key insight:** Background agent transcripts are stored separately from the main conversation. This means:

1. **Main conversation compaction** doesn't affect agent transcripts
2. **Agent resume** uses its own transcript file
3. **Cross-references** are preserved via agent IDs

### Resume Flow

```javascript
// When resuming an agent after main conversation compaction:

// 1. Get agent ID from the task record
let agentId = task.agentId;

// 2. Load agent's transcript (independent of main conversation)
let transcript = await loadTranscript(prefixAgentId(agentId));

// 3. Apply filters
let filtered = filterWhitespaceAssistant(
    filterThinkingOnlyAssistant(
        stripOrphanedToolResults(transcript)
    )
);

// 4. Continue agent with filtered transcript
let agentConfig = {
    ...originalConfig,
    promptMessages: [...filtered, ...newMessages]
};
```

---

## In-Process Teammate Transcripts

### Teammate Message Handling

**What it does:** In-process teammates (swarm agents) have special transcript handling.

```javascript
// ============================================
// ihA - Extract teammate messages for transcript
// Location: chunks.173.mjs:2759-2764
// ============================================

// ORIGINAL (for source lookup):
function ihA(A) {
    let q = {};
    for (let K of Object.values(A))
        if (K.type === "in_process_teammate" && K.identity?.agentId && K.messages && K.messages.length > 0) q[K.identity.agentId] = K.messages;
    return q
}

// READABLE (for understanding):
function extractTeammateMessages(tasks) {
    let teammateMessages = {};

    for (let task of Object.values(tasks)) {
        // Only process in-process teammates
        if (task.type === "in_process_teammate" &&
            task.identity?.agentId &&
            task.messages &&
            task.messages.length > 0) {

            teammateMessages[task.identity.agentId] = task.messages;
        }
    }

    return teammateMessages;
}

// Mapping: ihA→extractTeammateMessages
```

### Loading Teammate Transcripts

```javascript
// ============================================
// nhA - Load transcripts for multiple agents
// Location: chunks.173.mjs:2766-2783
// ============================================

// ORIGINAL (for source lookup):
async function nhA(A) {
    let q = await Promise.all(A.map(async (Y) => {
            try {
                let z = await sP1(xZ(Y));
                if (z && z.length > 0) return {
                    agentId: Y,
                    transcript: z
                };
                return null
            } catch {
                return null
            }
        })),
        K = {};
    for (let Y of q)
        if (Y) K[Y.agentId] = Y.transcript;
    return K
}

// READABLE (for understanding):
async function loadAgentTranscripts(agentIds) {
    // Load all transcripts in parallel
    let results = await Promise.all(
        agentIds.map(async (agentId) => {
            try {
                let transcript = await loadTranscript(prefixAgentId(agentId));
                if (transcript && transcript.length > 0) {
                    return { agentId, transcript };
                }
                return null;
            } catch {
                return null;
            }
        })
    );

    // Build map of agentId -> transcript
    let transcriptMap = {};
    for (let result of results) {
        if (result) {
            transcriptMap[result.agentId] = result.transcript;
        }
    }

    return transcriptMap;
}

// Mapping: nhA→loadAgentTranscripts, sP1→loadTranscript, xZ→prefixAgentId
```

---

## Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Separate transcript files | Independent resumption, no merge conflicts |
| Filter chain on load | Clean message history for context |
| Keep task notifications | Preserve task outcome visibility |
| Two-pass orphan filter | Efficient ID collection then filtering |
| Parallel transcript loading | Fast resume for multiple agents |
| Skip thinking-only messages | Reduces context size without losing information |

---

## Integration with Main Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                    Main Agent Loop                              │
│                                                                 │
│  During compaction:                                            │
│  - Summarize old messages                                      │
│  - Preserve task notifications                                 │
│  - Update context window estimate                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         ▼                                       ▼
┌───────────────────────┐           ┌───────────────────────┐
│ Main Conversation     │           │ Background Agent      │
│ Transcript            │           │ Transcripts           │
│                       │           │                       │
│ ~/.claude/sessions/   │           │ ~/.claude/sessions/   │
│ <session_id>.jsonl    │           │ <agent_id>.jsonl      │
│                       │           │                       │
│ Compacted separately  │           │ Loaded on resume      │
└───────────────────────┘           └───────────────────────┘
         │                                       │
         │ Resume                                 │ Resume
         ▼                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Filter Chain Applied                         │
│                                                                 │
│  1. stripOrphanedToolResults()                                 │
│  2. filterThinkingOnlyAssistant()                              │
│  3. filterWhitespaceAssistant()                                │
│                                                                 │
│  Result: Clean message history for context                     │
└─────────────────────────────────────────────────────────────────┘
```