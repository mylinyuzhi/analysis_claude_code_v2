# File Read Tracking - Deep Implementation Analysis

## Overview

**File Read Tracking** is the subsystem in Claude Code that monitors which files have been read during a session, caches their contents, and detects modifications to those files. This enables the system to:

1. **Detect file changes** - Alert the LLM when previously-read files have been modified externally
2. **Preserve file context** - Maintain file contents across context compaction boundaries
3. **Generate change diffs** - Show the LLM what changed in edited files

The system uses an **LRU (Least Recently Used) cache** to store file read state, with strict limits on entry count and total memory size to prevent unbounded growth.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `buildFileReadState` (A91) - Extract file state from conversation messages
- `mergeFileReadState` (yj1) - Merge file states, keeping newer entries
- `createLruCache` (Rp) - Factory function for LRU cache creation
- `mapEntriesToObject` (wjA) - Serialize LRU Map to plain object
- `getWatchedFilePaths` (Th) - Get all file paths from read state
- `cloneLruCache` (yp) - Clone an existing LRU cache
- `collectFilesToKeep` (Ua4) - Preserve recently accessed files
- `shouldExcludeFile` (EmY) - Filter excluded files from preservation
- `getChangedFilesAttachment` (wIY) - Detect and produce file change attachments

Constants:
- `LRU_MAX_ENTRIES` (JK1) - 100 entries maximum
- `LRU_MAX_SIZE` (eT9) - 26,214,400 bytes (~25MB)
- `BUILD_STATE_DEFAULT_MAX` (kcY) - 10 entries default for buildFileReadState
- `MAX_FILES_TO_KEEP` (Ba4) - 5 files maximum for post-compact restoration
- `MAX_FILE_RESTORE_TOKENS` (fmY) - 50,000 tokens total for file restoration
- `MAX_TOKENS_PER_FILE` (VmY) - 5,000 tokens per file for restoration

---

## Data Structures

### LRU Cache for File Read State

**Location:** chunks.88.mjs:2240-2252

The `readFileState` is an LRU Map that stores metadata about files read during the session.

```javascript
// ============================================
// createLruCache - Factory function for LRU cache
// Location: chunks.88.mjs:2250-2252
// ============================================

// ORIGINAL (for source lookup):
function Rp(A, q = eT9) {
    return new _p7(A, q)
}

// READABLE (for understanding):
function createLruCache(maxEntries, maxSizeBytes = LRU_MAX_SIZE) {
    return new LruMap(maxEntries, maxSizeBytes);
}

// Mapping: Rp→createLruCache, A→maxEntries, q→maxSizeBytes, eT9→LRU_MAX_SIZE, _p7→LruMap
```

### File State Entry Schema

Each entry in `readFileState` contains:

```javascript
{
  [filePath]: {
    content: string,      // File content at time of read
    timestamp: number,    // Unix timestamp (ms) when file was read
    offset: number|void,  // Partial read offset (undefined for full reads)
    limit: number|void    // Partial read limit (undefined for full reads)
  }
}
```

**Key properties:**
- `content` - Raw file content for change detection
- `timestamp` - Used to detect if file was modified after read
- `offset/limit` - Partial reads are excluded from change detection

### LRU Cache Constants

**Location:** chunks.88.mjs:2276-2278

```javascript
// ============================================
// LRU Cache Constants - Limits for readFileState
// Location: chunks.88.mjs:2276-2278
// ============================================

// ORIGINAL (for source lookup):
JK1 = 100
eT9 = 26214400

// READABLE (for understanding):
const LRU_MAX_ENTRIES = 100;      // Maximum number of files to track
const LRU_MAX_SIZE = 26214400;    // Maximum total size: ~25MB

// Mapping: JK1→LRU_MAX_ENTRIES, eT9→LRU_MAX_SIZE
```

**Why these values:**
- **100 entries**: Prevents tracking too many files; recent files are most relevant
- **25MB size limit**: Prevents memory exhaustion; covers typical source files
- **LRU eviction**: Oldest/least-used entries are evicted when limits exceeded

---

## Core Algorithms

### 1. Build File Read State from Messages

**Function:** `buildFileReadState` (A91)
**Location:** chunks.150.mjs:2459-2516
**Purpose:** Extract file read state from conversation history

#### What it does

Scans the conversation messages to extract file reads (Read tool calls with results) and file writes (Edit tool calls). Returns an LRU Map containing the file state with timestamps.

#### How it works

**Phase 1: First Pass - Collect Tool Use IDs** (lines 2459-2481)

1. **Initialize empty LRU cache**: `createLruCache(maxEntries)` (default 10 entries)
2. **Create two tracking Maps**:
   - `readToolMap`: tool_use_id → file_path (for Read tool calls)
   - `editToolMap`: tool_use_id → { filePath, content } (for Edit tool calls)
3. **Iterate through messages**:
   - For each assistant message with content array:
     - For each `tool_use` item:
       - If `name === "Read"` and `offset/limit === undefined` (full read):
         - Extract `file_path` and resolve to absolute path
         - Store in `readToolMap`: `id → filePath`
       - If `name === "Edit"` and `file_path` and `content` exist:
         - Extract `file_path` and `content`
         - Store in `editToolMap`: `id → { filePath, content }`

**Phase 2: Second Pass - Process Tool Results** (lines 2482-2515)

4. **Iterate through messages again**:
   - For each user message with content array:
     - For each `tool_result` item with `tool_use_id`:
       - **For Read tool results**:
         - Get file path from `readToolMap`
         - Strip line number prefixes and system reminders from content
         - Extract timestamp from message
         - Store in LRU cache: `filePath → { content, timestamp, offset: undefined, limit: undefined }`
       - **For Edit tool results**:
         - Get file info from `editToolMap`
         - Extract timestamp from message
         - Store in LRU cache: `filePath → { content, timestamp, offset: undefined, limit: undefined }`

5. **Return** the populated LRU cache

**Edge cases:**
- **Partial reads excluded**: Files read with `offset` or `limit` are not tracked
- **No timestamp**: Entries without timestamps are skipped
- **System reminders stripped**: Removed from content to get clean file data
- **Line number prefixes removed**: Format `123→content` is cleaned

#### Why this approach

**Design rationale:**

1. **Two-pass algorithm**: First collects tool IDs, then processes results
   - **Necessity**: Tool use and result are in different messages
   - **Efficiency**: Two passes is O(2n) = O(n), still linear

2. **Full reads only**: Partial reads excluded from change detection
   - **Correctness**: Partial content can't detect full file changes
   - **Memory**: Excludes large file partial reads from cache

3. **Edit tool included**: Captures file content after edits
   - **Completeness**: LLM knows file state after its own edits
   - **Consistency**: Same timestamp tracking as Read tool

4. **Default 10 entries**: Smaller than LRU_MAX_ENTRIES (100) for compaction contexts
   - **Compaction efficiency**: Only needs recent files, not full history
   - **Memory conservation**: Smaller cache during expensive compaction

**Trade-offs:**

- **Two-pass vs one-pass with lookup table**: Two-pass is simpler, uses less memory
- **Include all reads vs recent only**: Includes all within limit; could filter by recency
- **Clean content vs raw**: Cleaning adds overhead but provides accurate content for diff

#### Key insight

The algorithm uses **bidirectional message correlation** - matching tool uses with tool results by ID across separate messages. This is necessary because the Read tool call and its result are in different messages (assistant and user respectively).

#### Code Snippet

```javascript
// ============================================
// buildFileReadState - Extract file state from conversation messages
// Location: chunks.150.mjs:2459-2516
// ============================================

// ORIGINAL (for source lookup):
function A91(A, q, K = kcY) {
    let Y = Rp(K),
        z = new Map,
        w = new Map;
    for (let H of A)
        if (H.type === "assistant" && Array.isArray(H.message.content)) {
            for (let $ of H.message.content)
                if ($.type === "tool_use" && $.name === Jq) {
                    let O = $.input;
                    if (O?.file_path && O?.offset === void 0 && O?.limit === void 0) {
                        let _ = g4(O.file_path, q);
                        z.set($.id, _)
                    }
                } else if ($.type === "tool_use" && $.name === f5) {
                let O = $.input;
                if (O?.file_path && O?.content) {
                    let _ = g4(O.file_path, q);
                    w.set($.id, {
                        filePath: _,
                        content: O.content
                    })
                }
            }
        } for (let H of A)
        if (H.type === "user" && Array.isArray(H.message.content)) {
            for (let $ of H.message.content)
                if ($.type === "tool_result" && $.tool_use_id) {
                    let O = z.get($.tool_use_id);
                    if (O && typeof $.content === "string") {
                        let D = $.content.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").split(`
`).map((j) => {
                            let M = j.match(/^\s*\d+\u2192(.*)$/);
                            return M ? M[1] : j
                        }).join(`
`).trim();
                        if (H.timestamp) {
                            let j = new Date(H.timestamp).getTime();
                            Y.set(O, {
                                content: D,
                                timestamp: j,
                                offset: void 0,
                                limit: void 0
                            })
                        }
                    }
                    let _ = w.get($.tool_use_id);
                    if (_ && H.timestamp) {
                        let J = new Date(H.timestamp).getTime();
                        Y.set(_.filePath, {
                            content: _.content,
                            timestamp: J,
                            offset: void 0,
                            limit: void 0
                        })
                    }
                }
        } return Y
}

// READABLE (for understanding):
function buildFileReadState(messages, workingDirectory, maxEntries = BUILD_STATE_DEFAULT_MAX) {
    // Create new LRU cache
    let fileState = createLruCache(maxEntries);
    let readToolMap = new Map();  // tool_use_id -> filePath
    let editToolMap = new Map();  // tool_use_id -> { filePath, content }

    // ===== PHASE 1: Collect tool use IDs =====
    for (let message of messages) {
        if (message.type === "assistant" && Array.isArray(message.message.content)) {
            for (let content of message.message.content) {
                // Handle Read tool calls (full reads only)
                if (content.type === "tool_use" && content.name === ReadTool.name) {
                    let input = content.input;
                    // Only track full reads (no offset/limit)
                    if (input?.file_path && input?.offset === undefined && input?.limit === undefined) {
                        let absolutePath = resolvePath(input.file_path, workingDirectory);
                        readToolMap.set(content.id, absolutePath);
                    }
                }
                // Handle Edit tool calls
                else if (content.type === "tool_use" && content.name === EditTool.name) {
                    let input = content.input;
                    if (input?.file_path && input?.content) {
                        let absolutePath = resolvePath(input.file_path, workingDirectory);
                        editToolMap.set(content.id, {
                            filePath: absolutePath,
                            content: input.content
                        });
                    }
                }
            }
        }
    }

    // ===== PHASE 2: Process tool results =====
    for (let message of messages) {
        if (message.type === "user" && Array.isArray(message.message.content)) {
            for (let content of message.message.content) {
                if (content.type === "tool_result" && content.tool_use_id) {
                    // Process Read tool results
                    let filePath = readToolMap.get(content.tool_use_id);
                    if (filePath && typeof content.content === "string") {
                        // Clean content: remove system reminders and line number prefixes
                        let cleanContent = content.content
                            .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
                            .split("\n")
                            .map((line) => {
                                let match = line.match(/^\s*\d+\u2192(.*)$/);
                                return match ? match[1] : line;
                            })
                            .join("\n")
                            .trim();

                        if (message.timestamp) {
                            let timestamp = new Date(message.timestamp).getTime();
                            fileState.set(filePath, {
                                content: cleanContent,
                                timestamp: timestamp,
                                offset: undefined,
                                limit: undefined
                            });
                        }
                    }

                    // Process Edit tool results
                    let editInfo = editToolMap.get(content.tool_use_id);
                    if (editInfo && message.timestamp) {
                        let timestamp = new Date(message.timestamp).getTime();
                        fileState.set(editInfo.filePath, {
                            content: editInfo.content,
                            timestamp: timestamp,
                            offset: undefined,
                            limit: undefined
                        });
                    }
                }
            }
        }
    }

    return fileState;
}

// Mapping: A91→buildFileReadState, A→messages, q→workingDirectory, K→maxEntries, Y→fileState, z→readToolMap, w→editToolMap, H→message, $→content, Jq→ReadTool, f5→EditTool, g4→resolvePath, Rp→createLruCache, kcY→BUILD_STATE_DEFAULT_MAX
```

---

### 2. Merge File Read States

**Function:** `mergeFileReadState` (yj1)
**Location:** chunks.88.mjs:2267-2274
**Purpose:** Merge two file read states, keeping newer entries

#### What it does

Takes an existing file read state (LRU cache) and merges entries from a new state. When the same file exists in both states, keeps the entry with the newer timestamp.

#### How it works

**Step-by-step algorithm:**

1. **Clone existing state**: Create a copy of the existing LRU cache using `cloneLruCache()`
2. **Iterate through new entries**: For each `[filePath, metadata]` in the new state:
3. **Check existing entry**: Get current entry for the same file path
4. **Compare timestamps**: If new entry has newer timestamp OR no existing entry:
   - Update the entry: `cache.set(filePath, newMetadata)`
5. **Return** merged cache

#### Why this approach

**Design rationale:**

1. **Clone first**: Prevents mutating original cache
   - **Safety**: Original state preserved for other consumers
   - **Immutability**: Functional merge pattern

2. **Newer wins**: Timestamp comparison ensures most recent state is kept
   - **Correctness**: Latest read reflects current knowledge
   - **Simplicity**: No complex merge logic needed

3. **Entry-level merge**: Not file-level (keeps entire entry)
   - **Atomicity**: Content and timestamp stay consistent
   - **Simplicity**: No partial updates

#### Key insight

This is used during compaction recovery to merge file state from the conversation with file state from the session. The timestamp comparison ensures the most recent file knowledge is preserved.

#### Code Snippet

```javascript
// ============================================
// mergeFileReadState - Merge file states, keeping newer entries
// Location: chunks.88.mjs:2267-2274
// ============================================

// ORIGINAL (for source lookup):
function yj1(A, q) {
    let K = yp(A);
    for (let [Y, z] of q.entries()) {
        let w = K.get(Y);
        if (!w || z.timestamp > w.timestamp) K.set(Y, z)
    }
    return K
}

// READABLE (for understanding):
function mergeFileReadState(existingState, newState) {
    // Clone existing state to avoid mutation
    let mergedState = cloneLruCache(existingState);

    // Merge new entries, keeping newer timestamps
    for (let [filePath, newMetadata] of newState.entries()) {
        let existingMetadata = mergedState.get(filePath);

        // Update if no existing entry OR new entry is newer
        if (!existingMetadata || newMetadata.timestamp > existingMetadata.timestamp) {
            mergedState.set(filePath, newMetadata);
        }
    }

    return mergedState;
}

// Mapping: yj1→mergeFileReadState, A→existingState, q→newState, K→mergedState, Y→filePath, z→newMetadata, w→existingMetadata, yp→cloneLruCache
```

---

### 3. Clone LRU Cache

**Function:** `cloneLruCache` (yp)
**Location:** chunks.88.mjs:2262-2265
**Purpose:** Create a copy of an LRU cache

```javascript
// ============================================
// cloneLruCache - Clone an existing LRU cache
// Location: chunks.88.mjs:2262-2265
// ============================================

// ORIGINAL (for source lookup):
function yp(A) {
    let q = Rp(A.max, A.maxSize);
    return q.load(A.dump()), q
}

// READABLE (for understanding):
function cloneLruCache(originalCache) {
    // Create new cache with same limits
    let clonedCache = createLruCache(originalCache.max, originalCache.maxSize);

    // Load serialized data from original
    clonedCache.load(originalCache.dump());

    return clonedCache;
}

// Mapping: yp→cloneLruCache, A→originalCache, q→clonedCache, Rp→createLruCache
```

---

### 4. Get Watched File Paths

**Function:** `getWatchedFilePaths` (Th)
**Location:** chunks.88.mjs:2258-2260
**Purpose:** Get all file paths from read state as array

```javascript
// ============================================
// getWatchedFilePaths - Get all file paths from read state
// Location: chunks.88.mjs:2258-2260
// ============================================

// ORIGINAL (for source lookup):
function Th(A) {
    return Array.from(A.keys())
}

// READABLE (for understanding):
function getWatchedFilePaths(readFileState) {
    return Array.from(readFileState.keys());
}

// Mapping: Th→getWatchedFilePaths, A→readFileState
```

---

### 5. Map Entries to Object

**Function:** `mapEntriesToObject` (wjA)
**Location:** chunks.88.mjs:2254-2256
**Purpose:** Serialize LRU Map to plain object (for snapshot/restoration)

```javascript
// ============================================
// mapEntriesToObject - Serialize LRU Map to plain object
// Location: chunks.88.mjs:2254-2256
// ============================================

// ORIGINAL (for source lookup):
function wjA(A) {
    return Object.fromEntries(A.entries())
}

// READABLE (for understanding):
function mapEntriesToObject(lruMap) {
    return Object.fromEntries(lruMap.entries());
}

// Mapping: wjA→mapEntriesToObject, A→lruMap
```

---

## Compaction Cleanup Flow

### Clear and Restore Cycle

During context compaction, the file read state is managed through a **clear and restore** cycle.

**Location:** chunks.146.mjs:2383-2385

```javascript
// ============================================
// Compaction clear-restore cycle
// Location: chunks.146.mjs:2383-2390
// ============================================

// ORIGINAL (for source lookup):
let G = wjA(q.readFileState);
q.readFileState.clear(), rd();
let [f, Z] = await Promise.all([Ua4(G, q, Ba4), ca4(q)]), N = [...f, ...Z], T = pa4(q.agentId ?? U6());
if (T) N.push(T);
let k = jZ6(q.agentId);
if (k) N.push(k);
let y = da4();
if (y) N.push(y);

// READABLE (for understanding):
// 1. Snapshot current file state
let fileStateSnapshot = mapEntriesToObject(context.readFileState);

// 2. Clear the read file state cache
context.readFileState.clear();

// 3. Collect files to preserve (max 5 files)
let [fileAttachments, taskAttachments] = await Promise.all([
    collectFilesToKeep(fileStateSnapshot, context, MAX_FILES_TO_KEEP),
    collectTasksToKeep(context)
]);

// 4. Combine all attachments
let attachments = [...fileAttachments, ...taskAttachments];

// 5. Add todo, plan, skills attachments
let todosAttachment = collectTodosToKeep(context.agentId);
if (todosAttachment) attachments.push(todosAttachment);

let planAttachment = collectPlanToKeep(context.agentId);
if (planAttachment) attachments.push(planAttachment);

let skillsAttachment = collectSkillsToKeep();
if (skillsAttachment) attachments.push(skillsAttachment);

// Mapping: G→fileStateSnapshot, q→context, wjA→mapEntriesToObject, Ua4→collectFilesToKeep, ca4→collectTasksToKeep, Ba4→MAX_FILES_TO_KEEP, rd→clearStateHelpers, N→attachments, T→todosAttachment, k→planAttachment, y→skillsAttachment, pa4→collectTodosToKeep, jZ6→collectPlanToKeep, da4→collectSkillsToKeep
```

**Why clear before restore?**

1. **Memory efficiency**: Old entries are removed before reading new files
2. **Fresh state**: Prevents stale entries from accumulating
3. **Controlled restoration**: Only actively-referenced files are restored

**The restoration process:**

After clearing, `collectFilesToKeep()` reads the most recent files from disk and creates new `file` type attachments. These attachments are injected into the post-compaction context, ensuring the LLM has access to recently-accessed file contents.

---

## Tool Integration

### Overview

The file read tracking system integrates with multiple tools to ensure file state consistency. This section details how each tool interacts with `readFileState`.

### Tool Integration Summary

| Tool | Symbol | Interaction with readFileState | Purpose |
|------|--------|-------------------------------|---------|
| **Read** | `i5` | **Writes** on every successful read | Track file content and timestamp |
| **Edit** | `sW` | **Reads** for validation, **Writes** after edit | Prevent overwrites, track new content |
| **Write** | `j8A` | **Reads** for validation, **Writes** after write | Prevent overwrites, track new content |
| **Bash** | `gj1` | **Writes** for certain commands (e.g., `applypatch`) | Track file modifications from shell |
| **NotebookEdit** | `aY1` | **Writes** after cell edit | Track notebook modifications |

---

### Read Tool Integration

**Tool Symbol:** `i5` (chunks.146.mjs:1754)
**Tool Name Constant:** `Jq` = "Read"

The Read tool is the **primary source** of `readFileState` entries. Every successful file read updates the cache.

#### Read Tool Call Flow

```javascript
// ============================================
// Read Tool call() - File state tracking integration
// Location: chunks.146.mjs:1887-2075
// ============================================

// ORIGINAL (for source lookup):
async call({
    file_path: A,
    offset: q = 1,
    limit: K = void 0,
    pages: Y
}, z) {
    let {
        readFileState: w,       // <-- Access readFileState from context
        fileReadingLimits: H
    } = z;

    // ... file reading logic ...

    // After successful text file read:
    w.set(J, {
        content: P,
        timestamp: aW(X),
        offset: q,
        limit: K
    });

    // ... return result ...
}

// READABLE (for understanding):
async function call(input, context) {
    let { readFileState, fileReadingLimits } = context;
    let { file_path, offset = 1, limit, pages } = input;

    // Resolve to absolute path
    let absolutePath = resolvePath(file_path);

    // ... perform file read ...

    // === CRITICAL: Update readFileState after successful read ===
    readFileState.set(absolutePath, {
        content: fileContent,      // The actual file content
        timestamp: getMtime(path), // File's modification time
        offset: offset,            // undefined for full reads
        limit: limit               // undefined for full reads
    });

    return { data: { type: "text", file: { ... } } };
}

// Mapping: i5→ReadTool, J→absolutePath, w→readFileState, P→content, aW→getMtime, X→path, q→offset, K→limit
```

#### Key Behaviors

1. **Full Reads Only for Change Detection:**
   - When `offset` and `limit` are `undefined`, the file is tracked for changes
   - Partial reads are still stored but excluded from change detection

2. **Timestamp from File mtime:**
   - `timestamp` is set to the file's current modification time (`aW(path)`)
   - This allows detection of external modifications

3. **Nested Memory Trigger:**
   - After read, path is added to `nestedMemoryAttachmentTriggers`
   - This enables nested CLAUDE.md detection

#### Special File Types

| File Type | Handling | readFileState Update |
|-----------|----------|---------------------|
| Text files | Standard read | `content` as string, `offset/limit` preserved |
| Images | Compressed read | `content` as base64, stored but not diffed |
| PDFs | Page extraction | Stored with page info |
| Notebooks | Cell extraction | Stored as JSON string |

---

### Edit Tool Integration

**Tool Symbol:** `sW` (chunks.134.mjs:2124)
**Tool Name Constant:** `bq` = "Edit"

The Edit tool has a **two-phase interaction** with `readFileState`:
1. **Validation phase** - Reads state to detect conflicts
2. **Execution phase** - Updates state after successful edit

#### Edit Tool Validation (validateInput)

**Location:** chunks.134.mjs:2167-2298

```javascript
// ============================================
// Edit Tool validateInput - File state validation
// Location: chunks.134.mjs:2229-2259
// ============================================

// ORIGINAL (for source lookup):
let _ = z.readFileState.get(w);
if (!_) return {
    result: !1,
    behavior: "ask",
    message: "File has not been read yet. Read it first before writing to it.",
    errorCode: 6
};
if (_) {
    if (aW(w) > _.timestamp)
        if (_.offset === void 0 && _.limit === void 0)
            if (O.readFileSync(w, { encoding: AX(w) }).replaceAll(`\r\n`, `\n`) === _.content);
            else return {
                result: !1,
                behavior: "ask",
                message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
                errorCode: 7
            };
}

// READABLE (for understanding):
// Step 1: Check if file was ever read
let fileState = readFileState.get(absolutePath);
if (!fileState) {
    return {
        result: false,
        behavior: "ask",
        message: "File has not been read yet. Read it first before writing to it.",
        errorCode: 6
    };
}

// Step 2: Check for external modifications
if (fileState) {
    let currentMtime = getMtime(absolutePath);

    // If file was modified since we read it
    if (currentMtime > fileState.timestamp) {
        // For full reads, check if content actually changed
        if (fileState.offset === undefined && fileState.limit === undefined) {
            let currentContent = fs.readFileSync(absolutePath, { encoding: detectEncoding(absolutePath) });
            let normalizedContent = currentContent.replace(/\r\n/g, '\n');

            if (normalizedContent !== fileState.content) {
                return {
                    result: false,
                    behavior: "ask",
                    message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
                    errorCode: 7
                };
            }
        } else {
            // For partial reads, always fail (can't verify content)
            return {
                result: false,
                behavior: "ask",
                message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
                errorCode: 7
            };
        }
    }
}

// Mapping: z→sessionContext, w→absolutePath, _→fileState, aW→getMtime, O.readFileSync→fs.readFileSync, AX→detectEncoding
```

#### Edit Tool Execution (call)

**Location:** chunks.134.mjs:2316-2460

```javascript
// ============================================
// Edit Tool call() - File state update after edit
// Location: chunks.134.mjs:2399-2420
// ============================================

// ORIGINAL (for source lookup):
let N = K.get($);
if (!N || Z > N.timestamp)
    if (N && N.offset === void 0 && N.limit === void 0) {
        let k = AX($);
        if (_.readFileSync($, { encoding: k }).replaceAll(`\r\n`, `\n`) !== N.content) throw Error(ty1)
    } else throw Error(ty1)

// After successful edit:
K.set($, {
    content: q,
    timestamp: aW($),
    offset: void 0,
    limit: void 0
});

// READABLE (for understanding):
// === Pre-edit verification (race condition check) ===
let cachedState = readFileState.get(absolutePath);
let currentMtime = getMtime(absolutePath);

// If file changed since we validated
if (!cachedState || currentMtime > cachedState.timestamp) {
    if (cachedState && cachedState.offset === undefined && cachedState.limit === undefined) {
        // Verify content matches what we expect
        let currentContent = fs.readFileSync(absolutePath, { encoding: detectEncoding(absolutePath) });
        if (currentContent.replace(/\r\n/g, '\n') !== cachedState.content) {
            throw Error(FILE_MODIFIED_ERROR);
        }
    } else {
        throw Error(FILE_MODIFIED_ERROR);
    }
}

// ... perform edit ...

// === Post-edit: Update readFileState ===
readFileState.set(absolutePath, {
    content: newContent,           // The new content after edit
    timestamp: getMtime(absolutePath), // New mtime after write
    offset: undefined,             // Full file now
    limit: undefined               // Full file now
});

// Mapping: K→readFileState, $→absolutePath, N→cachedState, Z→currentMtime, q→newContent, aW→getMtime
```

#### Why This Matters

1. **Prevents Lost Edits:** If user edits file externally between Read and Edit, the LLM is forced to re-read
2. **Race Condition Protection:** Double-checks timestamps right before write
3. **Content Verification:** For full reads, compares cached content with actual file content
4. **Partial Read Safety:** Always fails validation for partial reads if mtime changed (can't verify)

---

### Write Tool Integration

**Tool Symbol:** `j8A` (chunks.146.mjs)
**Tool Name Constant:** `f5` = "Write"

The Write tool follows a similar pattern to Edit, but creates new files or overwrites entire files.

#### Write Tool Validation

**Location:** chunks.146.mjs:476-514

```javascript
// ============================================
// Write Tool validateInput - File state validation
// Location: chunks.146.mjs:499-514
// ============================================

// ORIGINAL (for source lookup):
let H = q.readFileState.get(K);
if (!H) return {
    result: !1,
    message: "File has not been read yet. Read it first before writing to it.",
    errorCode: 2
};
if (H) {
    if (aW(K) > H.timestamp) return {
        result: !1,
        message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
        errorCode: 3
    }
}

// READABLE (for understanding):
let fileState = readFileState.get(absolutePath);
if (!fileState) {
    return {
        result: false,
        message: "File has not been read yet. Read it first before writing to it.",
        errorCode: 2
    };
}

if (fileState) {
    if (getMtime(absolutePath) > fileState.timestamp) {
        return {
            result: false,
            message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
            errorCode: 3
        };
    }
}

// Mapping: q→sessionContext, K→absolutePath, H→fileState, aW→getMtime
```

#### Write Tool Execution

**Location:** chunks.146.mjs:345-360

```javascript
// ============================================
// Write Tool call() - File state update after write
// Location: chunks.146.mjs:348-353
// ============================================

// ORIGINAL (for source lookup):
return ft(w, z, $, _), _t(w, O, z), q.readFileState.set(w, {
    content: z,
    timestamp: aW(w),
    offset: void 0,
    limit: void 0
});

// READABLE (for understanding):
// Write file to disk
writeFile(absolutePath, content, encoding, mode);

// Update readFileState with new content
context.readFileState.set(absolutePath, {
    content: content,                  // New content
    timestamp: getMtime(absolutePath), // New mtime
    offset: undefined,                 // Full file
    limit: undefined                   // Full file
});

// Mapping: w→absolutePath, z→content, $→encoding, _→mode, q→context, aW→getMtime, ft→writeFile, _t→recordHistory
```

---

### Bash Tool Integration

**Tool Symbol:** `gj1` (chunks.170.mjs)
**Tool Name Constant:** `dZ6` = "Bash"

The Bash tool updates `readFileState` for specific commands that modify files, such as `git apply`.

#### Bash Applypatch Handling

**Location:** chunks.170.mjs:340-360

```javascript
// ============================================
// Bash Tool - Applypatch file state update
// Location: chunks.170.mjs:346-353
// ============================================

// ORIGINAL (for source lookup):
let _ = Qd(w);
return ft(w, z, $, _), _t(w, O, z), q.readFileState.set(w, {
    content: z,
    timestamp: aW(w),
    offset: void 0,
    limit: void 0
});

// READABLE (for understanding):
// When applying a patch via git apply:
// 1. Write the patched content
writeFile(absolutePath, patchedContent, encoding, mode);

// 2. Record in file history
recordFileHistory(absolutePath, oldContent, patchedContent);

// 3. Update readFileState
context.readFileState.set(absolutePath, {
    content: patchedContent,
    timestamp: getMtime(absolutePath),
    offset: undefined,
    limit: undefined
});

// Mapping: w→absolutePath, z→patchedContent, $→encoding, _→mode, q→context, aW→getMtime
```

---

### Nested Memory Integration

**Location:** chunks.142.mjs:2147-2161

The nested memory system uses `readFileState` to track CLAUDE.md files that have been read.

```javascript
// ============================================
// NyA - Add nested memory entries to readFileState
// Location: chunks.142.mjs:2147-2161
// ============================================

// ORIGINAL (for source lookup):
function NyA(A, q) {
    let K = [];
    for (let Y of A)
        if (!q.readFileState.has(Y.path)) K.push({
            type: "nested_memory",
            path: Y.path,
            content: Y
        }), q.readFileState.set(Y.path, {
            content: Y.content,
            timestamp: Date.now(),
            offset: void 0,
            limit: void 0
        });
    return K
}

// READABLE (for understanding):
function addNestedMemoryToReadState(nestedMemoryEntries, sessionContext) {
    let newAttachments = [];

    for (let entry of nestedMemoryEntries) {
        // Only add if not already tracked
        if (!sessionContext.readFileState.has(entry.path)) {
            // Create attachment for this nested memory
            newAttachments.push({
                type: "nested_memory",
                path: entry.path,
                content: entry
            });

            // Track in readFileState
            sessionContext.readFileState.set(entry.path, {
                content: entry.content,
                timestamp: Date.now(),
                offset: undefined,
                limit: undefined
            });
        }
    }

    return newAttachments;
}

// Mapping: NyA→addNestedMemoryToReadState, A→nestedMemoryEntries, q→sessionContext, K→newAttachments, Y→entry
```

---

## Validation Error Codes

### Edit Tool Error Codes

| Code | Condition | Message |
|------|-----------|---------|
| 1 | `old_string === new_string` | "old_string and new_string are exactly the same" |
| 2 | Permission denied | "File is in a directory that is denied" |
| 4 | File doesn't exist | "File does not exist. Did you mean ...?" |
| 5 | .ipynb file | "File is a Jupyter Notebook. Use NotebookEdit tool" |
| 6 | Not in readFileState | "File has not been read yet. Read it first" |
| 7 | Modified since read | "File has been modified since read... Read it again" |
| 8 | old_string not found | "String to replace not found in file" |
| 9 | Multiple matches | "Found N matches... set replace_all to true" |

### Write Tool Error Codes

| Code | Condition | Message |
|------|-----------|---------|
| 1 | Permission denied | "File is in a directory that is denied" |
| 2 | Not in readFileState | "File has not been read yet. Read it first" |
| 3 | Modified since read | "File has been modified since read... Read it again" |

---

## Flow Diagrams

### Read → Edit Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Read → Edit Flow                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. LLM calls Read tool                                             │
│     ┌────────────────────────────────────────────┐                  │
│     │ Read.call({ file_path: "/src/main.ts" })  │                  │
│     └────────────────────────────────────────────┘                  │
│                          │                                          │
│                          ▼                                          │
│     ┌────────────────────────────────────────────┐                  │
│     │ readFileState.set("/src/main.ts", {       │                  │
│     │   content: "file content...",             │                  │
│     │   timestamp: 1709000000000,               │                  │
│     │   offset: undefined,                      │                  │
│     │   limit: undefined                        │                  │
│     │ })                                        │                  │
│     └────────────────────────────────────────────┘                  │
│                          │                                          │
│  2. User externally edits file (mtime changes)                      │
│                          │                                          │
│                          ▼                                          │
│  3. LLM calls Edit tool                                             │
│     ┌────────────────────────────────────────────┐                  │
│     │ Edit.validateInput({                      │                  │
│     │   file_path: "/src/main.ts",              │                  │
│     │   old_string: "...",                      │                  │
│     │   new_string: "..."                       │                  │
│     │ })                                        │                  │
│     └────────────────────────────────────────────┘                  │
│                          │                                          │
│                          ▼                                          │
│     ┌────────────────────────────────────────────┐                  │
│     │ fileState = readFileState.get(path)       │                  │
│     │ currentMtime = getMtime(path)             │                  │
│     │                                            │                  │
│     │ if (currentMtime > fileState.timestamp) { │                  │
│     │   // FAIL: "File modified since read"     │                  │
│     │   return { result: false, errorCode: 7 }  │                  │
│     │ }                                         │                  │
│     └────────────────────────────────────────────┘                  │
│                          │                                          │
│                          ▼                                          │
│  4. LLM must re-read file before editing                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### File Change Detection Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                   File Change Detection Flow                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Agent Loop Turn Start                                              │
│          │                                                          │
│          ▼                                                          │
│  ┌────────────────────────────────────────────┐                     │
│  │ assembleAttachments(context)               │                     │
│  │   → getChangedFilesAttachment(context)     │                     │
│  └────────────────────────────────────────────┘                     │
│          │                                                          │
│          ▼                                                          │
│  ┌────────────────────────────────────────────┐                     │
│  │ For each file in readFileState:            │                     │
│  │                                            │                     │
│  │ 1. Get cached state                        │                     │
│  │ 2. Skip if offset/limit (partial read)     │                     │
│  │ 3. Check mtime vs cached timestamp         │                     │
│  │                                            │                     │
│  │    if mtime <= timestamp:                  │                     │
│  │      → No change, skip                     │                     │
│  │                                            │                     │
│  │    if mtime > timestamp:                   │                     │
│  │      → Re-read file                        │                     │
│  │      → Compute diff                        │                     │
│  │      → Create attachment if diff non-empty │                     │
│  └────────────────────────────────────────────┘                     │
│          │                                                          │
│          ▼                                                          │
│  ┌────────────────────────────────────────────┐                     │
│  │ Return attachments:                        │                     │
│  │ [                                          │                     │
│  │   { type: "edited_text_file", ... },       │                     │
│  │   { type: "todo", ... },  // if todo file │                     │
│  │   { type: "edited_image_file", ... }       │                     │
│  │ ]                                          │                     │
│  └────────────────────────────────────────────┘                     │
│          │                                                          │
│          ▼                                                          │
│  Attachments injected as system reminders                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Constants Reference

### File Preservation Constants

**Location:** chunks.150.mjs:2518-2522

```javascript
// ============================================
// File tracking constants
// Location: chunks.150.mjs:2518-2522
// ============================================

// ORIGINAL (for source lookup):
kcY = 10    // Default max entries for buildFileReadState
LcY = 100   // Alternative max entries constant
RcY = 30000 // Timeout or size constant

// READABLE (for understanding):
const BUILD_STATE_DEFAULT_MAX = 10;    // Default for buildFileReadState
const BUILD_STATE_ALT_MAX = 100;       // Alternative max entries
const FILE_TRACKING_TIMEOUT = 30000;   // 30 second timeout

// Mapping: kcY→BUILD_STATE_DEFAULT_MAX, LcY→BUILD_STATE_ALT_MAX, RcY→FILE_TRACKING_TIMEOUT
```

### File Restoration Constants

**Location:** chunks.146.mjs (referenced in state_preservation.md)

```javascript
const MAX_FILES_TO_KEEP = 5;           // Ba4 - Max files to restore after compaction
const MAX_FILE_RESTORE_TOKENS = 50000; // fmY - Max total tokens for file restoration
const MAX_TOKENS_PER_FILE = 5000;      // VmY - Max tokens per file for restoration
```

---

## Usage in Agent Context

### Agent Loop Integration

The `readFileState` is part of the session context passed through the agent loop:

```javascript
// In agent context creation:
context.readFileState = buildFileReadState(messages, workingDirectory);
```

### Attachment Production Integration

The `getChangedFilesAttachment()` producer runs every turn to detect file changes:

```javascript
// In assembleAttachments():
let changedFiles = await getChangedFilesAttachment(context);
attachments.push(...changedFiles);
```

---

## Performance Considerations

### Memory Usage

- **LRU cache limits**: 100 entries × average 50KB = ~5MB typical
- **Maximum size**: 25MB hard limit prevents memory exhaustion
- **Eviction**: Oldest entries evicted automatically when limits reached

### File Read Overhead

- **Change detection**: Only reads files if `mtime > cachedTimestamp`
- **Parallel processing**: All file checks run in parallel via `Promise.all()`
- **Diff computation**: Only performed if content actually changed

### Optimization Strategies

1. **Timestamp check first**: Cheap `stat()` call before expensive `read()`
2. **Skip partial reads**: Reduces number of files to check
3. **Diff before attachment**: Empty diffs are skipped
4. **Sandbox filter**: Blocked files are skipped early

---

## Edge Cases and Error Handling

### 1. File Deleted After Read

**Scenario:** File was read, then deleted
**Detection:** `stat()` fails or mtime check throws
**Handling:** Skip file, no attachment created
**Impact:** No error, file silently removed from watch list

### 2. Race Condition During Read

**Scenario:** File is being modified while change detection runs
**Detection:** Content differs from mtime expectation
**Handling:** Diff may be incomplete or include intermediate state
**Impact:** LLM sees partial changes; acceptable for rapid edits

### 3. Very Large Files

**Scenario:** File exceeds LRU size limits
**Detection:** Cache rejects entry on set
**Handling:** File is not tracked for changes
**Impact:** Large files (logs, data) not monitored

### 4. Binary Files

**Scenario:** Non-text file is read
**Detection:** Read tool returns `type: "image"` or similar
**Handling:** Special attachment type for images; other binaries skipped
**Impact:** Only text and image files produce change notifications

---

## Summary

The File Read Tracking system provides **session-aware file monitoring** through:

1. **LRU caching** of file contents with strict memory limits
2. **Two-pass extraction** from conversation messages to build initial state
3. **Merge-with-newer-wins** strategy for combining states
4. **Clear-and-restore cycle** during compaction for memory efficiency
5. **Real-time change detection** via mtime comparison and diff generation

This ensures the LLM maintains accurate knowledge of file contents throughout long sessions, even across context compactions, while preventing unbounded memory growth.