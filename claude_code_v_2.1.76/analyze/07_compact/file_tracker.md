# File Tracker - Context Compaction

## Overview

The File Tracker system (`readFileState`) ensures that recently accessed files survive compaction. When the conversation is compacted, the system "forgets" the detailed conversation about reading those files, but the file contents are preserved as new attachments in the compacted context.

This solves a critical problem: after compaction, the model would lose awareness of files it had read during the summarized portion of the conversation. By restoring the most recent files, the model can continue working without needing to re-read them.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `collectFilesToKeep` (Ua4) - Identifies and restores recently accessed files
- `collectTasksToKeep` (ca4) - Preserves active background task statuses
- `collectPlanToKeep` (jZ6) - Preserves the current plan file reference
- `collectSkillsToKeep` (da4) - Preserves invoked skill contents
- `collectTodosToKeep` (pa4) - Preserves active todo items
- `isInternalFile` (EmY) - Filters out session-internal files

---

## Preservation Constants

```javascript
// ============================================
// File Preservation Constants
// Location: chunks.146.mjs:2760-2764
// ============================================

// ORIGINAL (for source lookup):
Ba4 = 5      // MAX_FILES_TO_KEEP - Maximum files to restore
fmY = 50000  // TOTAL_RESTORE_TOKEN_LIMIT - Max tokens for all restored files
VmY = 5000   // FILE_RESTORE_TOKEN_LIMIT - Max tokens per file

// READABLE (for understanding):
const MAX_FILES_TO_KEEP = 5;           // Keep up to 5 most recent files
const TOTAL_RESTORE_TOKEN_LIMIT = 50000;  // 50k tokens max for all files combined
const FILE_RESTORE_TOKEN_LIMIT = 5000;    // 5k tokens max per file
```

**Why these limits:**
- **5 files**: Balances utility with token budget; most operations involve few files
- **50k total**: Roughly 10% of a typical context window after compaction
- **5k per file**: Enough for most source files; larger files are truncated

---

## The readFileState Data Structure

### What Gets Tracked

The `readFileState` is a Map-like object stored in the session context:

```javascript
// Structure of readFileState
readFileState = {
    "/path/to/file1.ts": {
        timestamp: 1709123456789,  // When the file was read
        // ... other metadata
    },
    "/path/to/file2.ts": {
        timestamp: 1709123457000,
    }
}
```

### When Files Are Tracked

Files are added to `readFileState` whenever:
1. The `Read` tool successfully reads a file
2. The `Glob` tool lists files (for the matched files)
3. The `Grep` tool searches and returns file paths

Files are NOT tracked when:
- Read operation fails
- File is marked as internal (session memory, plan files)
- The session is running in a special mode that disables tracking

---

## Core Algorithm: collectFilesToKeep (Ua4)

**What it does:** Selects the most valuable files to preserve after compaction and re-reads their contents.

**How it works:**
1. Convert readFileState entries to array with filenames
2. Filter out internal files (session memory, plan files)
3. Sort by timestamp (newest first)
4. Take top N files (max 5)
5. Re-read each file with token limit (5k per file)
6. Filter by total token budget (50k combined)

```javascript
// ============================================
// collectFilesToKeep - Restores recently read files after compaction
// Location: chunks.146.mjs:2665-2686
// ============================================

// ORIGINAL (for source lookup):
async function Ua4(A, q, K) {
    let Y = Object.entries(A).map(([H, $]) => ({
            filename: H,
            ...$
        })).filter((H) => !EmY(H.filename, q.agentId)).sort((H, $) => $.timestamp - H.timestamp).slice(0, K),
        z = await Promise.all(Y.map(async (H) => {
            let $ = await TyA(H.filename, {
                ...q,
                fileReadingLimits: {
                    maxTokens: VmY
                }
            }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
            return $ ? kq($) : null
        })),
        w = 0;
    return z.filter((H) => {
        if (H === null) return !1;
        let $ = A2(Q1(H));
        if (w + $ <= fmY) return w += $, !0;
        return !1
    })
}

// READABLE (for understanding):
async function collectFilesToKeep(readFileState, context, maxFilesToKeep) {
    // Step 1: Convert to array and sort by recency
    let candidates = Object.entries(readFileState)
        .map(([filename, data]) => ({ filename, ...data }))
        // Filter out internal files (session memory, plan files)
        .filter((file) => !isInternalFile(file.filename, context.agentId))
        // Sort by timestamp descending (newest first)
        .sort((a, b) => b.timestamp - a.timestamp)
        // Take top N files
        .slice(0, maxFilesToKeep);

    // Step 2: Re-read file contents with per-file token limit
    let restoredFiles = await Promise.all(
        candidates.map(async (file) => {
            let content = await readFileContent(
                file.filename,
                {
                    ...context,
                    fileReadingLimits: { maxTokens: 5000 }  // VmY
                },
                "tengu_post_compact_file_restore_success",
                "tengu_post_compact_file_restore_error",
                "compact"
            );
            return content ? createAttachment(content) : null;
        })
    );

    // Step 3: Apply global token budget
    let totalTokens = 0;
    return restoredFiles.filter((attachment) => {
        if (attachment === null) return false;

        let tokens = estimateTokenCount(serialize(attachment));
        // Check if adding this file would exceed budget
        if (totalTokens + tokens <= 50000) {  // fmY
            totalTokens += tokens;
            return true;
        }
        return false;
    });
}

// Mapping: Ua4→collectFilesToKeep, A→readFileState, q→context, K→maxFilesToKeep,
//   Y→candidates, z→restoredFiles, w→totalTokens, H→file/attachment,
//   $→tokens, EmY→isInternalFile, TyA→readFileContent, VmY→FILE_RESTORE_TOKEN_LIMIT,
//   kq→createAttachment, A2→estimateTokenCount, Q1→serialize, fmY→TOTAL_RESTORE_TOKEN_LIMIT
```

### Algorithm Design Rationale

**Why re-read instead of caching:**
1. Files may have changed since they were read
2. Avoids memory bloat from storing all file contents
3. Token counting is consistent with current state

**The "Truncation vs. Reference" Behavior:**
When `readFileContent` (`TyA`) is called with the `"compact"` query source:
- If the file is smaller than `FILE_RESTORE_TOKEN_LIMIT` (5k), it returns the full content.
- If the file is larger than 5k tokens:
  - It catches the `MaxFileReadTokenExceededError`.
  - Instead of returning partial content, it returns a **`compact_file_reference`** (a lightweight reference with just the filename).
  - This prevents large files from consuming the entire restoration budget, while still reminding the model that the file is relevant.

**Why filter after reading:**
1. Can't know exact token count until file is read
2. Handling of large files (conversion to reference) happens during read
3. Final filter ensures total budget is respected even with references

---

## Internal File Detection (EmY)

**What it does:** Identifies files that should NOT be preserved because they are session-internal.

```javascript
// ============================================
// isInternalFile - Filters session-internal files
// Location: chunks.146.mjs:2743-2758
// ============================================

// ORIGINAL (for source lookup):
function EmY(A, q) {
    let K = g4(A);
    try {
        let Y = q ?? U6(),
            z = g4(Lp(Y));
        if (K === z) return !0
    } catch {}
    try {
        let Y = g4(uW(q));
        if (K === Y) return !0
    } catch {}
    try {
        if (new Set(Sa4.map((z) => g4(cB(z)))).has(K)) return !0
    } catch {}
    return !1
}

// READABLE (for understanding):
function isInternalFile(filepath, agentId) {
    let normalizedPath = normalizePath(filepath);

    try {
        // Check if this is the session memory file
        let sessionId = agentId ?? getCurrentSessionId();
        let sessionMemoryPath = normalizePath(getSessionMemoryPath(sessionId));
        if (normalizedPath === sessionMemoryPath) return true;
    } catch {}

    try {
        // Check if this is the plan file
        let planPath = normalizePath(getPlanFilePath(agentId));
        if (normalizedPath === planPath) return true;
    } catch {}

    try {
        // Check if this is a session memory template or config
        let internalPaths = new Set(
            SESSION_MEMORY_INTERNAL_PATHS.map(p => normalizePath(resolvePath(p)))
        );
        if (internalPaths.has(normalizedPath)) return true;
    } catch {}

    return false;
}

// Mapping: EmY→isInternalFile, A→filepath, q→agentId, K→normalizedPath,
//   g4→normalizePath, U6→getCurrentSessionId, Lp→getSessionMemoryPath,
//   uW→getPlanFilePath, Sa4→SESSION_MEMORY_INTERNAL_PATHS, cB→resolvePath
```

**Why these files are excluded:**
- **Session memory file**: Already preserved separately in session memory compaction
- **Plan file**: Has dedicated `collectPlanToKeep` function
- **Session memory templates**: Part of system config, not user context

---

## Other Preservation Collectors

### collectTasksToKeep (ca4)

Preserves status of background tasks that completed since last compaction:

```javascript
// ============================================
// collectTasksToKeep - Preserves background task statuses
// Location: chunks.146.mjs:2724-2741
// ============================================

// ORIGINAL (for source lookup):
async function ca4(A) {
    let q = await A.getAppState();
    return Object.values(q.tasks).filter((Y) => Y.type === "local_agent").flatMap((Y) => {
        if (Y.retrieved) return [];
        let {
            status: z
        } = Y;
        if (z === "completed" || z === "failed" || z === "killed")
            return [kq({
                type: "task_status",
                taskId: Y.agentId,
                taskType: "local_agent",
                description: Y.description,
                status: z,
                deltaSummary: Y.error ?? null
            })];
        return []
    })
}

// READABLE (for understanding):
async function collectTasksToKeep(context) {
    let state = await context.getAppState();

    // Filter for local agent tasks
    return Object.values(state.tasks)
        .filter(task => task.type === "local_agent")
        .flatMap(task => {
            // Skip already retrieved tasks
            if (task.retrieved) return [];

            // Only preserve terminal tasks (completed/failed/killed)
            let { status } = task;
            if (status === "completed" || status === "failed" || status === "killed") {
                return [createAttachment({
                    type: "task_status",
                    taskId: task.agentId,
                    taskType: "local_agent",
                    description: task.description,
                    status: status,
                    deltaSummary: task.error ?? null
                })];
            }
            return [];
        });
}

// Mapping: ca4→collectTasksToKeep, A→context, q→state, Y→task, z→status,
//   kq→createAttachment
```

**Why only terminal tasks:**
- Running tasks are still in progress; their final status isn't known
- Once retrieved, the task result is already in the conversation
- Unretrieved terminal tasks need their status preserved so user knows what happened

### collectPlanToKeep (jZ6)

Preserves the current plan file reference:

```javascript
// ============================================
// collectPlanToKeep - Preserves plan file reference
// Location: chunks.146.mjs:2699-2708
// ============================================

// ORIGINAL (for source lookup):
function jZ6(A) {
    let q = pD(A);
    if (!q) return null;
    let K = uW(A);
    return kq({
        type: "plan_file_reference",
        planFilePath: K,
        planContent: q
    })
}

// READABLE (for understanding):
function collectPlanToKeep(agentId) {
    let planContent = getPlanContent(agentId);
    if (!planContent) return null;

    let planPath = getPlanFilePath(agentId);
    return createAttachment({
        type: "plan_file_reference",
        planFilePath: planPath,
        planContent: planContent
    });
}

// Mapping: jZ6→collectPlanToKeep, A→agentId, q→planContent, K→planPath,
//   pD→getPlanContent, uW→getPlanFilePath, kq→createAttachment
```

### collectSkillsToKeep (da4)

Preserves contents of invoked skills:

```javascript
// ============================================
// collectSkillsToKeep - Preserves invoked skill contents
// Location: chunks.146.mjs:2710-2722
// ============================================

// ORIGINAL (for source lookup):
function da4() {
    let A = zR6();
    if (A.size === 0) return null;
    let q = Array.from(A.values()).sort((K, Y) => Y.invokedAt - K.invokedAt).map((K) => ({
        name: K.skillName,
        path: K.skillPath,
        content: K.content
    }));
    return kq({
        type: "invoked_skills",
        skills: q
    })
}

// READABLE (for understanding):
function collectSkillsToKeep() {
    let invokedSkills = getInvokedSkillsMap();
    if (invokedSkills.size === 0) return null;

    // Sort by invocation time (most recent first)
    let skills = Array.from(invokedSkills.values())
        .sort((a, b) => b.invokedAt - a.invokedAt)
        .map(skill => ({
            name: skill.skillName,
            path: skill.skillPath,
            content: skill.content
        }));

    return createAttachment({
        type: "invoked_skills",
        skills: skills
    });
}

// Mapping: da4→collectSkillsToKeep, A→invokedSkills, q→skills, K→skill,
//   zR6→getInvokedSkillsMap, kq→createAttachment
```

### collectTodosToKeep (pa4)

Preserves active todo items:

```javascript
// ============================================
// collectTodosToKeep - Preserves active todo items
// Location: chunks.146.mjs:2688-2697
// ============================================

// ORIGINAL (for source lookup):
function pa4(A) {
    let q = UB(A);
    if (q.length === 0) return null;
    return kq({
        type: "todo",
        content: q,
        itemCount: q.length,
        context: "post-compact"
    })
}

// READABLE (for understanding):
function collectTodosToKeep(agentId) {
    let todos = getActiveTodos(agentId);
    if (todos.length === 0) return null;

    return createAttachment({
        type: "todo",
        content: todos,
        itemCount: todos.length,
        context: "post-compact"
    });
}

// Mapping: pa4→collectTodosToKeep, A→agentId, q→todos,
//   UB→getActiveTodos, kq→createAttachment
```

---

## Preservation Priority

When multiple items compete for token budget, the implicit priority is:

1. **Plan file** - Always preserved (separate from file budget)
2. **Active todos** - Always preserved (separate from file budget)
3. **Invoked skills** - Always preserved (separate from file budget)
4. **Background task statuses** - Within their own budget
5. **Recent files** - Subject to 50k token budget

**Key insight:** Files compete with each other for the 50k budget, but plan, todos, and skills are preserved unconditionally. This ensures the model always knows what it was working on (plan), what tasks are pending (todos), and what custom behaviors were activated (skills).

---

## Integration with Compaction Flow

```
                    ┌─────────────────────────────────────┐
                    │     performFullCompaction (AW1)     │
                    │   or performPartialCompaction (Fa4) │
                    └─────────────────────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │   Clear readFileState              │
                    │   readFileState.clear()            │
                    └─────────────────────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │   Snapshot file state              │
                    │   snapshot = wjA(readFileState)    │
                    └─────────────────────────────────────┘
                                      │
                     ┌────────────────┼────────────────┐
                     │                │                │
                     ▼                ▼                ▼
            ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
            │collectFiles │  │collectTasks │  │collectPlan  │
            │  (Ua4)      │  │  (ca4)      │  │  (jZ6)      │
            └─────────────┘  └─────────────┘  └─────────────┘
                     │                │                │
                     └────────────────┼────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │   Combine all attachments          │
                    │   attachments = [                  │
                    │     ...files,                      │
                    │     ...tasks,                      │
                    │     plan,                          │
                    │     skills,                        │
                    │   ]                                │
                    └─────────────────────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │   Add to compaction result         │
                    │   return {                         │
                    │     summaryMessages: [...],        │
                    │     attachments: attachments,      │
                    │   }                                │
                    └─────────────────────────────────────┘
```

---

## Key Insights

### 1. Why Clear Before Reading
The code clears `readFileState` before collecting files to keep (`wjA` creates a snapshot, then `clear()`). This prevents:
- Accumulating stale file references across multiple compactions
- Memory leaks from the tracking state
- Confusion about when files were actually accessed

### 2. The Re-read Trade-off
Re-reading files costs I/O but ensures:
- File contents are current (may have changed)
- Token counting is accurate
- No memory bloat from caching

### 3. Graceful Degradation
If re-reading a file fails:
- The attachment is `null`
- Filter removes it from results
- Other files are still preserved
- No error propagates to break compaction

### 4. Token Budget as Soft Limit
The 50k total budget is checked incrementally:
- First file that would exceed budget is excluded
- Previous files are kept
- This means actual total may be slightly under 50k