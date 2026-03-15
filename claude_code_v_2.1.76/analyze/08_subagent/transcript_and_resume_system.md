# Transcript and Resume System - Subagent System (Claude Code 2.1.76)

## Overview

This document covers how subagent conversations are recorded to JSONL transcript files, the write queue serialization mechanism, and the three-stage cleanup pipeline.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `transcriptWriteQueue` (vp7) - Promise chain for serialized writes
- `writeTranscriptEntry` (wP6) - Write a single JSONL record
- `finalizeTranscript` (mQ1) - Three-stage cleanup pipeline
- `buildConversationChain` (ld1) - UUID-based parent link construction
- `readOutputFileSince` (WjA) - Incremental polling of output file
- `loadTranscript` (sP1) - Load prior transcript for resume
- `buildResumeMessages` (BQ1) - Convert prior transcript to messages

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

## transcriptWriteQueue (vp7) - Promise Chain Pattern

### What it does

Serializes all writes to the transcript file to prevent interleaving.

### How it works

The write queue is a Promise chain where each write appends to the previous:

```javascript
// ============================================
// transcriptWriteQueue - Promise chain serialization
// Location: chunks.149.mjs (pattern)
// ============================================

// READABLE (for understanding):
let transcriptWriteQueue = Promise.resolve();  // Start with resolved promise

function writeTranscriptEntry(filePath, record) {
    // Chain to the current tail of the queue
    transcriptWriteQueue = transcriptWriteQueue.then(async () => {
        await fs.appendFile(filePath, JSON.stringify(record) + "\n");
    });
    // Return the new tail so callers can await if needed
    return transcriptWriteQueue;
}
```

**Why Promise chaining over a mutex:**
- No deadlock risk (Promises don't block the event loop)
- Natural FIFO ordering
- Memory efficient (chain is garbage collected as entries complete)
- Simple to reason about

**Key insight:** The queue is per-transcript-file. Multiple subagents writing to different transcript files don't interfere with each other.

---

## Three-Stage Cleanup Pipeline

### Stage 1: writeTranscriptEntry (wP6) - Final Records

Write any remaining buffered records before cleanup:
1. Write the final `meta` record with completion status
2. Write any pending tool results that hadn't been flushed

### Stage 2: finalizeTranscript (mQ1) - Close Queue

Mark the write queue as finalized:
1. No new entries can be added after this point
2. Wait for all pending writes to complete
3. Close the file handle

### Stage 3: buildConversationChain (ld1) - UUID Link

Build the parent-child conversation chain for resume support:
1. Assign a UUID to this conversation
2. Link to the parent conversation UUID (if resuming)
3. Record the chain in a separate index file

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

## Incremental Output Polling (WjA)

For asynchronous tasks, the parent polls the output file for new content:

```javascript
// ============================================
// readOutputFileSince - Incremental file polling
// Location: chunks.149.mjs
// ============================================

// READABLE (for understanding):
async function readOutputFileSince(outputFilePath, lastReadPosition) {
    try {
        let stats = await fs.stat(outputFilePath);
        if (stats.size <= lastReadPosition) return { lines: [], newPosition: lastReadPosition };

        // Read only the new portion
        let fd = await fs.open(outputFilePath, "r");
        let buffer = Buffer.alloc(stats.size - lastReadPosition);
        await fd.read(buffer, 0, buffer.length, lastReadPosition);
        await fd.close();

        let newContent = buffer.toString("utf8");
        let lines = newContent.trim().split("\n").filter(Boolean).map(JSON.parse);

        return { lines, newPosition: stats.size };
    } catch {
        return { lines: [], newPosition: lastReadPosition };
    }
}

// Mapping: WjA→readOutputFileSince
```

**Why incremental:** Output files can grow large for long-running tasks. Re-reading the entire file on each poll is wasteful. Tracking `lastReadPosition` ensures only new content is processed.

---

## Resume System

### loadTranscript (sP1)

Loads a prior transcript file for resume:

```javascript
// READABLE (for understanding):
async function loadTranscript(transcriptPath) {
    let content = await fs.readFile(transcriptPath, "utf8");
    return content.trim().split("\n")
        .filter(Boolean)
        .map(JSON.parse)
        .filter(record => record.type === "message"); // Only messages, not meta
}
```

### buildResumeMessages (BQ1)

Converts prior transcript records into LLM message format for resuming:

```javascript
// READABLE (for understanding):
function buildResumeMessages(transcriptRecords) {
    return transcriptRecords.map(record => ({
        role: record.role,
        content: record.content,
        id: record.id
    }));
}
```

These messages are prepended to the new conversation, allowing the LLM to continue from where it left off.

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
