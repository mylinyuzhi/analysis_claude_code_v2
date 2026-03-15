# Compaction and Tool State (Claude Code 2.1.76)

> Analysis of how the compaction subsystem interacts with tool state, specifically `readFileState` lifecycle and the implications for Edit tool validation after compaction.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `readFileState` - File content cache shared between Read/Edit/Write tools
- `collectFilesToKeep` - State preservation collector that generates file attachments
- `validateEditInput` (within EditTool) - Edit tool pre-execution file cache check

**Cross-references:**
- [07_compact/state_preservation.md](../07_compact/state_preservation.md) - State anchoring pattern
- [05_tools/tool_coordination.md](tool_coordination.md) - readFileState coordination between tools
- [05_tools/edit_tool.md](edit_tool.md) - Edit tool implementation

---

## The readFileState Lifecycle

### What is readFileState?

`readFileState` is a `Map<filePath, FileState>` stored inside `toolUseContext`. Every tool call receives this context, allowing Read, Edit, and Write tools to coordinate through shared state.

```javascript
// ============================================
// readFileState context - File cache in toolUseContext
// Location: chunks.150.mjs:1069 (context clone on skill exec)
// ============================================

// ORIGINAL (for source lookup):
// O = DI(w.readFileState), $ = { ...w, readFileState: O }
// (DI clones the Map; w is the parent toolUseContext)

// READABLE (for understanding):
let clonedFileState = cloneMap(parentContext.readFileState);
let newContext = { ...parentContext, readFileState: clonedFileState };

// Mapping: DI→cloneMap, w→parentContext, O→clonedFileState, $→newContext
```

**Cache entry structure:**
```javascript
readFileState.set("/path/to/file.ts", {
    content: "file contents here",
    timestamp: 1234567890,  // mtime from getMtime()
    offset: undefined,       // For partial reads
    limit: undefined         // For partial reads
});
```

---

## readFileState After Compaction

### What happens during compaction?

When compaction triggers, the current message history is summarized. A **new session context** is created post-compaction. This new context has an **empty `readFileState`** — the file cache is not carried over from the pre-compaction session.

**Why it starts empty:** The `readFileState` is a runtime cache built from tool calls. It is not serialized into message history and cannot be reconstructed from the compaction summary alone.

### State Preservation provides LLM context, NOT tool cache

The state preservation system (see [state_preservation.md](../07_compact/state_preservation.md)) collects recently accessed files and re-injects them as **attachment messages** (system reminders). These attachments give the LLM the file contents as context — but they are **not** `tool_result` messages from a `Read` tool call.

**Critical distinction:**

| Mechanism | What it provides | Populates readFileState? |
|-----------|-----------------|--------------------------|
| State preservation file attachment | LLM context (LLM can see file content) | **No** |
| Read tool call + tool_result | Both LLM context AND cache | **Yes** |

The state preservation attachments help the LLM remember what files it was working with, but `readFileState` remains empty until the LLM explicitly calls the Read tool again.

---

## Edit Tool Validation Failure After Compaction

### The failure scenario

After compaction, if the LLM tries to edit a file that was read before compaction:

```
Pre-compaction:   LLM calls Read("/path/file.ts") → readFileState populated
                  (compaction happens here)
Post-compaction:  readFileState = empty Map (reset)
                  LLM tries Edit("/path/file.ts", ...) → FAILS
```

### Why Edit fails

The Edit tool's Stage 2 custom validation (`validateInput`) checks `readFileState` before allowing any edit:

```javascript
// ============================================
// Edit tool validateInput - Pre-edit cache validation
// Location: chunks.134.mjs:2229-2234
// ============================================

// ORIGINAL (for source lookup):
let _ = z.readFileState.get(w);
if (!_) return {
    result: !1,
    behavior: "ask",
    message: "File has not been read yet. Read it first before writing to it."
};

// READABLE (for understanding):
let fileState = context.readFileState.get(filePath);
if (!fileState) {
    return {
        result: false,
        behavior: "ask",
        message: "File has not been read yet. Read it first before writing to it."
    };
}

// Mapping: z→context, w→filePath, _→fileState
```

**What the LLM sees:** A `tool_result` with `is_error: true` containing the message "File has not been read yet. Read it first before writing to it."

**Self-correction mechanism:** The explicit error message guides the LLM to issue a `Read` tool call, which repopulates `readFileState`, after which the `Edit` can succeed.

---

## Why This is Correct Design

**Problem being prevented:** If `readFileState` were auto-restored from state preservation attachments, the Edit tool would have stale data — the file on disk may have changed since the pre-compaction Read. The cache timestamp and content would be outdated.

**Trade-off:** The LLM must re-read files after compaction. This adds one extra turn per file being edited. But it guarantees the LLM has fresh file content and prevents destructive edits based on stale context.

**State preservation still helps:** Even though the attachment cannot substitute for a Read call, it provides the LLM with the file content for reference, making the re-read mostly a formality to satisfy the cache check rather than a new information-gathering step.

---

## What Tool State IS Preserved Across Compaction

| State type | Preserved? | Mechanism |
|------------|-----------|-----------|
| `readFileState` file cache | **No** — starts empty | Must re-Read after compaction |
| Active tasks (background agents) | **Yes** | Task state attachments in state_preservation |
| Plan file content | **Yes** | Plan attachment in state_preservation |
| Todo list | **Yes** | Todo attachment in state_preservation |
| Recently invoked skills | **Yes** | Skills attachment in state_preservation |
| Tool execution concurrency state | **N/A** | Compaction only triggers between turns |
| Cron jobs (v2.1.76) | **Yes** | Independent scheduling system |

---

## Key Insight

**The two-layer context model:**
1. **LLM context** (what the model can reason about) — restored via state preservation attachments
2. **Tool runtime state** (what tools use for validation) — NOT restored, must be rebuilt via tool calls

State preservation is designed for layer 1. The `readFileState` cache is layer 2. These serve different purposes and have different restoration paths after compaction.
