# Transcript and Resume System - Subagent System (Claude Code 2.1.76)

## Overview

This document covers how subagent conversations are recorded to JSONL transcript files, the write queue serialization mechanism, and the three-stage cleanup pipeline.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `agentLoopRunner` (qh) - Core agent loop with transcript recording - chunks.133.mjs:1565
- `outputWriteQueue` (vp7) - Promise chain for serialized writes - chunks.89.mjs:340
- `readOutputFileDelta` (WjA) - Incremental polling of output file - chunks.89.mjs:276
- `buildConversationChain` (ld1) - UUID-based parent link construction - chunks.143.mjs:850
- `loadTranscript` (sP1) - Load prior transcript for resume - chunks.173.mjs:2722 **[needs verification]**
- `filterWhitespaceAssistant` (BQ1) - Filter whitespace-only assistant messages - chunks.173.mjs:1388 **[needs verification]**
- `filterThinkingOnlyAssistant` (mQ1) - Filter thinking-only assistant messages - chunks.173.mjs:1435 **[needs verification]**
- `stripOrphanedToolResults` (wP6) - Remove orphaned tool result blocks - chunks.173.mjs:344 **[needs verification]**

> **Note:** The symbols `sP1`, `wP6`, `mQ1`, `BQ1` require source code verification. These were documented from earlier analysis but the exact symbol mappings in chunks.173.mjs need confirmation. Note: `sP1` appears as `"EnterWorktree"` constant in chunks.91.mjs:180, suggesting either:
> 1. The transcript functions have different symbols
> 2. The functions are defined elsewhere
> 3. The analysis documentation predates code changes

> **Note:** Previous documentation incorrectly mapped:
> - `wP6` as `writeTranscriptEntry` (actual: `stripOrphanedToolResults`)
> - `mQ1` as `finalizeTranscript` (actual: `filterThinkingOnlyAssistant`)
> - `BQ1` as `buildResumeMessages` (actual: `filterWhitespaceAssistant`)

---

## JSONL Transcript Format

Each subagent conversation is recorded as a JSONL file (one JSON object per line):

```jsonl
{"type":"message","role":"user","content":"...","id":"msg_001","timestamp":1234567890}
{"type":"message","role":"assistant","content":[...],"id":"msg_002","timestamp":1234567891}
{"type":"tool_use","toolName":"Read","input":{...},"id":"tool_001","timestamp":1234567892}
{"type":"tool_result","toolUseId":"tool_001","content":"...","timestamp":1234567893}
{"type":"meta","status":"completed","totalTokens":5234,"timestamp":1234567894}
```

**Why JSONL over JSON:**
- Append-only writes (no need to rewrite the entire file)
- Readable in order (each line is complete)
- Fault-tolerant (partial writes don't corrupt earlier records)

---

## outputWriteQueue (vp7) - Promise Chain Pattern

### What it does

Serializes all writes to the output file to prevent interleaving.

### How it works

The write queue is a Promise chain where each write appends to the previous:

```javascript
// ============================================
// outputWriteQueue - Promise chain serialization
// Location: chunks.89.mjs:340
// ============================================

// READABLE (for understanding):
let outputWriteQueue = new Map();  // Map<filePath, Promise>

function writeToOutputQueue(filePath, writeFn) {
    let currentQueue = outputWriteQueue.get(filePath) ?? Promise.resolve();

    // Chain to the current tail of the queue
    let newQueue = currentQueue.then(async () => {
        await writeFn();
    }).catch(err => {
        // Log but don't break the chain
        console.error('Output write error:', err);
    });

    outputWriteQueue.set(filePath, newQueue);
    return newQueue;
}
```

**Why Map over single Promise:** Multiple output files (different tasks) can write concurrently without blocking each other. Only writes to the same file are serialized.

**Key insight:** Each task has its own output file, so the queue is per-file. Multiple subagents writing to different output files don't interfere with each other.

---

## Transcript Processing Pipeline

### stripOrphanedToolResults (wP6)

**What it does:** Removes tool result blocks that have no corresponding tool use in the conversation.

**Why needed:** If an assistant message with tool uses is truncated during compaction, the tool results become orphaned. These would cause errors if sent to the LLM.

```javascript
// ============================================
// stripOrphanedToolResults - Remove orphaned tool results
// Location: chunks.173.mjs:344
// ============================================

// READABLE (for understanding):
function stripOrphanedToolResults(messages) {
    // Collect all tool use IDs from assistant messages
    let validToolUseIds = new Set();
    for (let msg of messages) {
        if (msg.role === 'assistant' && msg.content) {
            for (let block of msg.content) {
                if (block.type === 'tool_use') {
                    validToolUseIds.add(block.id);
                }
            }
        }
    }

    // Remove tool results without matching tool use
    return messages.map(msg => {
        if (msg.role === 'user' && Array.isArray(msg.content)) {
            return {
                ...msg,
                content: msg.content.filter(block =>
                    block.type !== 'tool_result' || validToolUseIds.has(block.tool_use_id)
                )
            };
        }
        return msg;
    });
}

// Mapping: wP6→stripOrphanedToolResults
```

### filterWhitespaceAssistant (BQ1)

**What it does:** Filters out assistant messages that contain only whitespace.

**Why needed:** During conversation processing, empty or whitespace-only assistant messages can appear. These would cause API errors if sent to the LLM.

```javascript
// ============================================
// filterWhitespaceAssistant - Filter whitespace-only assistant messages
// Location: chunks.173.mjs:1388
// ============================================

// READABLE (for understanding):
function filterWhitespaceAssistant(messages) {
    return messages.filter(msg => {
        if (msg.role !== 'assistant') return true;

        let content = msg.content;
        if (typeof content === 'string') {
            return content.trim().length > 0;
        }
        if (Array.isArray(content)) {
            // Check if any text block has non-whitespace content
            return content.some(block =>
                block.type === 'text' && block.text?.trim().length > 0
            );
        }
        return true;
    });
}

// Mapping: BQ1→filterWhitespaceAssistant
```

### filterThinkingOnlyAssistant (mQ1)

**What it does:** Filters out assistant messages that contain only thinking blocks (no visible output).

**Why needed:** Extended thinking produces thinking blocks that are sometimes the only content. These messages don't contribute to the conversation visible to users.

```javascript
// ============================================
// filterThinkingOnlyAssistant - Filter thinking-only assistant messages
// Location: chunks.173.mjs:1435
// ============================================

// READABLE (for understanding):
function filterThinkingOnlyAssistant(messages) {
    return messages.filter(msg => {
        if (msg.role !== 'assistant') return true;

        if (Array.isArray(msg.content)) {
            // Check if there's any non-thinking content
            let hasNonThinkingContent = msg.content.some(block =>
                block.type !== 'thinking' && block.type !== 'redacted_thinking'
            );
            return hasNonThinkingContent;
        }
        return true;
    });
}

// Mapping: mQ1→filterThinkingOnlyAssistant
```

```javascript
// ============================================
// buildConversationChain - UUID-based parent linking
// Location: chunks.149.mjs
// ============================================

// READABLE (for understanding):
function buildConversationChain(currentConversationId, parentConversationId) {
    // Cycle detection: prevent circular chains
    let chain = [currentConversationId];
    let current = parentConversationId;

    while (current && current !== currentConversationId) {
        chain.unshift(current);
        current = getParentId(current);
    }

    return chain;
}
```

**Why UUID linking:** If a subagent is interrupted and resumed, the new conversation needs to reference the prior conversation's transcript. UUIDs provide stable identifiers that survive process restarts.

**Cycle detection:** Without cycle detection, a malformed chain could cause infinite loops during chain traversal. The while-loop guard `current !== currentConversationId` prevents cycles.

---

## buildConversationChain (ld1) - UUID Linking

Build the parent-child conversation chain for resume support:
1. Assign a UUID to this conversation
2. Link to the parent conversation UUID (if resuming)
3. Record the chain in a separate index file

```javascript
// ============================================
// buildConversationChain - UUID-based parent linking
// Location: chunks.143.mjs:850
// ============================================

// READABLE (for understanding):
function buildConversationChain(currentConversationId, parentConversationId) {
    // Cycle detection: prevent circular chains
    let chain = [currentConversationId];
    let current = parentConversationId;

    while (current && current !== currentConversationId) {
        chain.unshift(current);
        current = getParentId(current);
    }

    return chain;
}
```

**Why UUID linking:** If a subagent is interrupted and resumed, the new conversation needs to reference the prior conversation's transcript. UUIDs provide stable identifiers that survive process restarts.

**Cycle detection:** Without cycle detection, a malformed chain could cause infinite loops during chain traversal. The while-loop guard `current !== currentConversationId` prevents cycles.

---

## Incremental Output Polling (WjA)

For asynchronous tasks, the parent polls the output file for new content:

```javascript
// ============================================
// readOutputFileDelta - Incremental file polling
// Location: chunks.89.mjs:276
// ============================================

// READABLE (for understanding):
async function readOutputFileDelta(outputFilePath, lastReadPosition) {
    try {
        let stats = await fs.stat(outputFilePath);
        if (stats.size <= lastReadPosition) return { content: null, newOffset: lastReadPosition };

        // Read only the new portion
        let fd = await fs.open(outputFilePath, "r");
        let buffer = Buffer.alloc(stats.size - lastReadPosition);
        await fd.read(buffer, 0, buffer.length, lastReadPosition);
        await fd.close();

        let newContent = buffer.toString("utf8");

        return { content: newContent, newOffset: stats.size };
    } catch {
        return { content: null, newOffset: lastReadPosition };
    }
}

// Mapping: WjA→readOutputFileDelta
```

**Why incremental:** Output files can grow large for long-running tasks. Re-reading the entire file on each poll is wasteful. Tracking `lastReadPosition` ensures only new content is processed.

---

## Resume System

### loadTranscript (sP1)

Loads a prior transcript file for resume:

```javascript
// ============================================
// loadTranscript - Load prior transcript for resume
// Location: chunks.173.mjs:2722
// ============================================

// READABLE (for understanding):
async function loadTranscript(transcriptPath) {
    try {
        let content = await fs.readFile(transcriptPath, "utf8");
        let records = content.trim().split("\n")
            .filter(Boolean)
            .map(JSON.parse);

        // Filter to messages only, excluding meta records
        let messages = records.filter(record => record.type === "message");

        // Apply cleanup filters
        messages = stripOrphanedToolResults(messages);
        messages = filterWhitespaceAssistant(messages);
        messages = filterThinkingOnlyAssistant(messages);

        return messages;
    } catch (err) {
        if (err.code === "ENOENT") return [];
        throw err;
    }
}

// Mapping: sP1→loadTranscript
```

### Message Processing for Resume

When resuming a conversation, the loaded messages go through several filters:

1. **stripOrphanedToolResults (wP6)** - Remove tool results without matching tool uses
2. **filterWhitespaceAssistant (BQ1)** - Remove empty assistant messages
3. **filterThinkingOnlyAssistant (mQ1)** - Remove thinking-only assistant messages

These filtered messages are prepended to the new conversation, allowing the LLM to continue from where it left off.

---

## Design Rationale

### Why Not Stream Directly to Parent?

Streaming tool results directly from subagent to parent would require:
1. A persistent connection between parent and subagent processes
2. Backpressure handling if the parent is slow
3. Complex failure handling if the connection drops

JSONL files are simpler: they're append-only, durable across crashes, and can be polled at any rate.

### Why JSONL vs JSON vs Binary?

**JSON (single object):** Cannot be appended to. The entire file must be rewritten on each update.

**Binary:** Efficient but hard to debug and inspect.

**JSONL:** Each line is a complete JSON record. Easy to append, inspect, and parse incrementally. The standard format for log files and event streams.
