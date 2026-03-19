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
- `createLruCache` (yd) - Factory function for LRU cache creation
- `mapEntriesToObject` (mf8) - Serialize LRU Map to plain object
- `getWatchedFilePaths` (jB) - Get all file paths from read state
- `cloneLruCache` (DI) - Clone an existing LRU cache
- `mergeFileReadState` (yD1) - Merge file states, keeping newer entries
- `collectFilesToKeep` (fqq) - Preserve recently accessed files
- `shouldExcludeFile` (EmY) - Filter excluded files from preservation
- `getChangedFilesAttachment` (wIY) - Detect and produce file change attachments

Constants:
- `LRU_MAX_ENTRIES` (Ed) - 100 entries maximum
- `LRU_MAX_SIZE` (yv9) - 26,214,400 bytes (~25MB)
- `MAX_FILES_TO_KEEP` (Xqq) - 5 files maximum for post-compact restoration
- `MAX_FILE_RESTORE_TOKENS` ($mY) - 50,000 tokens total for file restoration
- `MAX_TOKENS_PER_FILE` (HmY) - 5,000 tokens per file for restoration

---

## Data Structures

### LRU Cache for File Read State

**Location:** chunks.84.mjs:3-51

The `readFileState` is an LRU Map that stores metadata about files read during the session. The implementation uses a custom wrapper class (`R14`) around the `quick-lru` library.

#### LRU Wrapper Class (R14)

**Class:** `R14` (LruMapWrapper)
**Location:** chunks.84.mjs:3-51
**Purpose:** Wraps `quick-lru` with path normalization and size calculation

**What it does:**

Provides an LRU (Least Recently Used) cache implementation that automatically evicts entries when:
1. **Entry count limit exceeded** - More than `max` entries
2. **Total size limit exceeded** - Cumulative size exceeds `maxSize` bytes

**Internal Structure:**
- Uses `kT` (QuickLRU) as the underlying cache implementation
- Size calculation: `Math.max(1, Buffer.byteLength(entry.content))` - measures content only
- Path normalization: All get/set/has operations normalize paths via `ED1()`

**Key Methods:**

| Method | Behavior | Path Normalization |
|--------|----------|-------------------|
| `get(path)` | Returns cached entry or undefined | Yes (`ED1()`) |
| `set(path, value)` | Stores entry, returns `this` for chaining | Yes (`ED1()`) |
| `has(path)` | Returns boolean | Yes (`ED1()`) |
| `delete(path)` | Removes entry | Yes (`ED1()`) |
| `clear()` | Removes all entries | N/A |
| `keys()` | Returns iterator of all paths | No (raw keys) |
| `entries()` | Returns iterator of `[path, value]` pairs | No (raw keys) |
| `dump()` | Serializes cache for persistence | No (raw keys) |
| `load(data)` | Restores from serialized data | N/A |

**Why this approach:**

1. **Path normalization in wrapper**: All get/set/has operations normalize paths
   - **Consistency**: `./file.txt` and `/absolute/path/file.txt` map to same entry
   - **Deduplication**: Prevents duplicate entries for same file
   - **Transparency**: Consumers don't need to normalize paths themselves

2. **Size-based eviction**: Content-aware memory management
   - **Memory safety**: Prevents cache from consuming all available memory
   - **Fairness**: Large files use more "space" in the cache
   - **Predictability**: 25MB limit is intuitive for operators

3. **Entry + size dual limits**: Two-tier eviction strategy
   - **Entry count (100)**: Prevents tracking too many small files
   - **Total size (25MB)**: Prevents few large files from dominating cache

```javascript
// ============================================
// LruMapWrapper - LRU cache wrapper with path normalization
// Location: chunks.84.mjs:3-51
// ============================================

// ORIGINAL (for source lookup):
class R14 {
    cache;
    constructor(A, q) {
        this.cache = new kT({
            max: A,
            maxSize: q,
            sizeCalculation: (K) => Math.max(1, Buffer.byteLength(K.content))
        })
    }
    get(A) {
        return this.cache.get(ED1(A))
    }
    set(A, q) {
        return this.cache.set(ED1(A), q), this
    }
    has(A) {
        return this.cache.has(ED1(A))
    }
    delete(A) {
        return this.cache.delete(ED1(A))
    }
    clear() {
        this.cache.clear()
    }
    get size() {
        return this.cache.size
    }
    get max() {
        return this.cache.max
    }
    get maxSize() {
        return this.cache.maxSize
    }
    keys() {
        return this.cache.keys()
    }
    entries() {
        return this.cache.entries()
    }
    dump() {
        return this.cache.dump()
    }
    load(A) {
        this.cache.load(A)
    }
}

// READABLE (for understanding):
class LruMapWrapper {
    cache;  // Internal quick-lru instance

    constructor(maxEntries, maxSizeBytes) {
        this.cache = new QuickLRU({
            max: maxEntries,           // Maximum number of entries
            maxSize: maxSizeBytes,     // Maximum total size in bytes
            // Size calculation: byte length of content field
            sizeCalculation: (entry) => Math.max(1, Buffer.byteLength(entry.content))
        });
    }

    // === Path-normalized accessors ===
    get(filePath) {
        return this.cache.get(normalizePath(filePath));
    }
    set(filePath, value) {
        this.cache.set(normalizePath(filePath), value);
        return this;  // Enable chaining
    }
    has(filePath) {
        return this.cache.has(normalizePath(filePath));
    }
    delete(filePath) {
        return this.cache.delete(normalizePath(filePath));
    }

    // === Pass-through methods ===
    clear() { this.cache.clear(); }
    get size() { return this.cache.size; }
    get max() { return this.cache.max; }
    get maxSize() { return this.cache.maxSize; }
    keys() { return this.cache.keys(); }
    entries() { return this.cache.entries(); }
    dump() { return this.cache.dump(); }
    load(data) { this.cache.load(data); }
}

// Mapping: R14→LruMapWrapper, kT→QuickLRU, ED1→normalizePath, A→maxEntries/filePath, q→maxSizeBytes/value, K→entry
```

#### Factory Function

```javascript
// ============================================
// createLruCache - Factory function for LRU cache
// Location: chunks.84.mjs:53-55
// ============================================

// ORIGINAL (for source lookup):
function yd(A, q = yv9) {
    return new R14(A, q)
}

// READABLE (for understanding):
function createLruCache(maxEntries, maxSizeBytes = LRU_MAX_SIZE) {
    return new LruMapWrapper(maxEntries, maxSizeBytes);
}

// Mapping: yd→createLruCache, A→maxEntries, q→maxSizeBytes, yv9→LRU_MAX_SIZE, R14→LruMapWrapper
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

**Location:** chunks.84.mjs:79-81

```javascript
// ============================================
// LRU Cache Constants - Limits for readFileState
// Location: chunks.84.mjs:79-81
// ============================================

// ORIGINAL (for source lookup):
Ed = 100
yv9 = 26214400

// READABLE (for understanding):
const LRU_MAX_ENTRIES = 100;      // Maximum number of files to track
const LRU_MAX_SIZE = 26214400;    // Maximum total size: ~25MB

// Mapping: Ed→LRU_MAX_ENTRIES, yv9→LRU_MAX_SIZE
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

> **Note:** In v2.1.76, the file read state is populated directly when files are read via the Read tool (see `sF8` function in chunks.147.mjs). The `buildFileReadState` function shown here is for reference and may not be present in all versions.

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

// Mapping: A91→buildFileReadState, A→messages, q→workingDirectory, K→maxEntries, Y→fileState, z→readToolMap, w→editToolMap, H→message, $→content, Jq→ReadTool, f5→EditTool, g4→resolvePath
// Note: Rp→createLruCache (yd in v2.1.76), kcY→BUILD_STATE_DEFAULT_MAX
```

---

### 2. Merge File Read States

**Function:** `mergeFileReadState` (yD1)
**Location:** chunks.84.mjs:70-77
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
// Location: chunks.84.mjs:70-77
// ============================================

// ORIGINAL (for source lookup):
function yD1(A, q) {
    let K = DI(A);
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

// Mapping: yD1→mergeFileReadState, A→existingState, q→newState, K→mergedState, Y→filePath, z→newMetadata, w→existingMetadata, DI→cloneLruCache
```

---

### 3. Clone LRU Cache

**Function:** `cloneLruCache` (DI)
**Location:** chunks.84.mjs:65-68
**Purpose:** Create a copy of an LRU cache

```javascript
// ============================================
// cloneLruCache - Clone an existing LRU cache
// Location: chunks.84.mjs:65-68
// ============================================

// ORIGINAL (for source lookup):
function DI(A) {
    let q = yd(A.max, A.maxSize);
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

// Mapping: DI→cloneLruCache, A→originalCache, q→clonedCache, yd→createLruCache
```

---

### 4. Get Watched File Paths

**Function:** `getWatchedFilePaths` (jB)
**Location:** chunks.84.mjs:61-63
**Purpose:** Get all file paths from read state as array

```javascript
// ============================================
// getWatchedFilePaths - Get all file paths from read state
// Location: chunks.84.mjs:61-63
// ============================================

// ORIGINAL (for source lookup):
function jB(A) {
    return Array.from(A.keys())
}

// READABLE (for understanding):
function getWatchedFilePaths(readFileState) {
    return Array.from(readFileState.keys());
}

// Mapping: jB→getWatchedFilePaths, A→readFileState
```

---

### 5. Map Entries to Object

**Function:** `mapEntriesToObject` (mf8)
**Location:** chunks.84.mjs:57-59
**Purpose:** Serialize LRU Map to plain object (for snapshot/restoration)

```javascript
// ============================================
// mapEntriesToObject - Serialize LRU Map to plain object
// Location: chunks.84.mjs:57-59
// ============================================

// ORIGINAL (for source lookup):
function mf8(A) {
    return Object.fromEntries(A.entries())
}

// READABLE (for understanding):
function mapEntriesToObject(lruMap) {
    return Object.fromEntries(lruMap.entries());
}

// Mapping: mf8→mapEntriesToObject, A→lruMap
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
let G = mf8(q.readFileState);
q.readFileState.clear(), Oc();
let [f, v] = await Promise.all([fqq(G, q, Xqq), Nqq(q)]), N = [...f, ...v], V = mE1(q.agentId);
if (V) N.push(V);
let L = await vqq(q);
if (L) N.push(L);
let h = Tqq(q.agentId);
if (h) N.push(h);

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

// 5. Add plan attachment
let planAttachment = collectPlanToKeep(context.agentId);
if (planAttachment) attachments.push(planAttachment);

// 6. Add plan mode attachment (if applicable)
let planModeAttachment = await collectPlanModeAttachment(context);
if (planModeAttachment) attachments.push(planModeAttachment);

// 7. Add skills attachment
let skillsAttachment = getInvokedSkillsAttachment(context.agentId);
if (skillsAttachment) attachments.push(skillsAttachment);

// Mapping: G→fileStateSnapshot, q→context, mf8→mapEntriesToObject, fqq→collectFilesToKeep, Nqq→collectTasksToKeep, Xqq→MAX_FILES_TO_KEEP, N→attachments, V→planAttachment, L→planModeAttachment, h→skillsAttachment, mE1→collectPlanToKeep, vqq→collectPlanModeAttachment, Tqq→getInvokedSkillsAttachment
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

> **Note:** These constants are documented for reference. In v2.1.76, the `buildFileReadState` function uses `Ed` (100) for LRU max entries.

```javascript
// ============================================
// File tracking constants (reference)
// Location: chunks.150.mjs:2518-2522
// ============================================

// READABLE (for understanding):
const BUILD_STATE_DEFAULT_MAX = 10;    // Default for buildFileReadState
const BUILD_STATE_ALT_MAX = 100;       // Alternative max entries (Ed in v2.1.76)
const FILE_TRACKING_TIMEOUT = 30000;   // 30 second timeout
```

### File Restoration Constants

**Location:** chunks.146.mjs (referenced in state_preservation.md)

```javascript
const MAX_FILES_TO_KEEP = 5;           // Xqq - Max files to restore after compaction
const MAX_FILE_RESTORE_TOKENS = 50000; // $mY - Max total tokens for file restoration
const MAX_TOKENS_PER_FILE = 5000;      // HmY - Max tokens per file for restoration
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

## @-Mention File State Handling

### Overview

When a user @-mentions a file, the system checks `readFileState` to determine whether to re-read the file or use cached content. This section details the logic for handling already-read files and state replacement.

### Function: readFileForAttachment (TyA)

**Location:** chunks.142.mjs:2524-2613

This is the central function for loading file attachments, handling both @-mentions and compact mode file restoration.

```javascript
// ============================================
// readFileForAttachment - Load file with state check
// Location: chunks.142.mjs:2524-2613
// ============================================

// ORIGINAL (for source lookup):
async function TyA(A, q, K, Y, z, w) {
    let {
        offset: H,
        limit: $
    } = w ?? {}, O = await q.getAppState();
    if (sW1(A, O.toolPermissionContext)) return null;
    if (z === "at-mention" && !KG6(A)) {
        let J = tW6(A).ext.toLowerCase();
        if (!s81(J)) try {
            let X = b1().statSync(A);
            return c("tengu_attachment_file_too_large", {
                size_bytes: X.size,
                mode: z
            }), null
        } catch {}
    }
    if (z === "at-mention") {
        let J = await GIY(A);
        if (J) return J
    }
    let _ = q.readFileState.get(A);
    if (_ && z === "at-mention") try {
        let J = aW(A);
        if (_.timestamp <= J && J === _.timestamp) return c(K, {}), {
            type: "already_read_file",
            filename: A,
            content: {
                type: "text",
                file: {
                    filePath: A,
                    content: _.content,
                    numLines: _.content.split(`\n`).length,
                    startLine: H ?? 1,
                    totalLines: _.content.split(`\n`).length
                }
            }
        }
    } catch {}
    try {
        let J = {
            file_path: A,
            offset: H,
            limit: $
        };
        async function X() {
            if (z === "compact") return {
                type: "compact_file_reference",
                filename: A
            };
            // ... fallback read with truncation ...
        }
        let D = await i5.validateInput(J, q);
        if (!D.result) {
            if (D.meta?.fileSize) return await X();
            return null
        }
        try {
            let j = await i5.call(J, q);
            return c(K, {}), {
                type: "file",
                filename: A,
                content: j.data
            }
        } catch (j) {
            if (j instanceof qG6) return await X();
            throw j
        }
    } catch {
        return c(Y, {}), null
    }
}

// READABLE (for understanding):
async function readFileForAttachment(filePath, context, successEvent, errorEvent, mode, options) {
    let { offset, limit } = options ?? {};
    let appState = await context.getAppState();

    // Step 1: Check sandbox permissions
    if (isSandboxBlocked(filePath, appState.toolPermissionContext)) {
        return null;
    }

    // Step 2: For at-mention mode, check if file is too large without offset/limit
    if (mode === "at-mention" && !isSmallFile(filePath)) {
        // Return null - file should be read explicitly with Read tool
        return null;
    }

    // Step 3: Check for PDF reference (large PDF handling)
    if (mode === "at-mention") {
        let pdfRef = await createPdfReferenceAttachment(filePath);
        if (pdfRef) return pdfRef;
    }

    // Step 4: Check readFileState cache
    let cachedState = context.readFileState.get(filePath);

    // Step 5: If file was read before AND mode is at-mention
    if (cachedState && mode === "at-mention") {
        try {
            let currentMtime = getMtime(filePath);

            // CRITICAL: Check if file is unchanged
            // Condition: cached timestamp <= current mtime AND they are exactly equal
            // This is a STRICT equality check - even 1ms difference means file changed
            if (cachedState.timestamp <= currentMtime && currentMtime === cachedState.timestamp) {
                // File is unchanged - return already_read_file type
                recordTelemetry(successEvent, {});
                return {
                    type: "already_read_file",
                    filename: filePath,
                    content: {
                        type: "text",
                        file: {
                            filePath: filePath,
                            content: cachedState.content,
                            numLines: cachedState.content.split('\n').length,
                            startLine: offset ?? 1,
                            totalLines: cachedState.content.split('\n').length
                        }
                    }
                };
            }
        } catch {}
    }

    // Step 6: File not in cache or changed - read from disk
    try {
        let readInput = {
            file_path: filePath,
            offset: offset,
            limit: limit
        };

        // Inner function for fallback handling
        async function handleFallback() {
            // For compact mode, return reference instead of reading
            if (mode === "compact") {
                return {
                    type: "compact_file_reference",
                    filename: filePath
                };
            }

            // For at-mention, try truncated read
            let truncatedInput = {
                file_path: filePath,
                offset: offset ?? 1,
                limit: MAX_FILE_LINES  // 2000 lines max
            };
            let result = await ReadTool.call(truncatedInput, context);
            return {
                type: "file",
                filename: filePath,
                content: result.data,
                truncated: true
            };
        }

        // Validate the read request
        let validationResult = await ReadTool.validateInput(readInput, context);
        if (!validationResult.result) {
            // If file is too large, use fallback
            if (validationResult.meta?.fileSize) {
                return await handleFallback();
            }
            return null;
        }

        // Perform the read
        try {
            let readResult = await ReadTool.call(readInput, context);
            recordTelemetry(successEvent, {});
            return {
                type: "file",
                filename: filePath,
                content: readResult.data
            };
        } catch (error) {
            // Handle token limit exceeded
            if (error instanceof TokenLimitExceeded) {
                return await handleFallback();
            }
            throw error;
        }
    } catch {
        recordTelemetry(errorEvent, {});
        return null;
    }
}

// Mapping: TyA→readFileForAttachment, A→filePath, q→context, K→successEvent, Y→errorEvent, z→mode, w→options, H→offset, $→limit, _→cachedState, J→currentMtime/readInput, aW→getMtime, i5→ReadTool, GIY→createPdfReferenceAttachment, sW1→isSandboxBlocked
```

---

## already_read_file Type

### What It Does

The `already_read_file` type is returned when a user @-mentions a file that has already been read and hasn't been modified. Instead of re-reading the file from disk, the system returns the cached content from `readFileState`.

### Trigger Conditions

| Condition | Requirement |
|-----------|-------------|
| Mode | `mode === "at-mention"` |
| In cache | `readFileState.has(filePath) === true` |
| Unchanged | `cachedTimestamp === currentMtime` (exact equality) |
| Permission | File is not sandbox-blocked |

### Critical Timestamp Check

**Location:** chunks.142.mjs:2547

```javascript
// CRITICAL: The timestamp comparison is EXACT equality
if (cachedState.timestamp <= currentMtime && currentMtime === cachedState.timestamp)
```

**Why exact equality?**

The `timestamp` stored in `readFileState` is the file's mtime at the moment of read. If the file hasn't been modified, the current mtime will be **exactly equal** to the cached timestamp.

- `cachedState.timestamp <= currentMtime` is always true (time flows forward)
- `currentMtime === cachedState.timestamp` ensures file wasn't touched

**Edge case:** If a file is touched (e.g., `touch file.txt`) without modifying content, the mtime changes and the file will be re-read even though content is identical.

### Normalization

**Location:** chunks.173.mjs:1118

```javascript
case "already_read_file":
    return [];  // Returns empty - content already in context
```

The `already_read_file` type returns an empty array during normalization because the file content is already in the conversation context. No additional system reminder is needed.

### Example Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                 already_read_file Flow                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. User: "Check @src/main.ts for bugs"                            │
│     ┌────────────────────────────────────────────┐                  │
│     │ extractAtMentionedFiles()                  │                  │
│     │   → readFileForAttachment(                 │                  │
│     │       "src/main.ts",                       │                  │
│     │       context,                             │                  │
│     │       mode="at-mention"                    │                  │
│     │     )                                      │                  │
│     └────────────────────────────────────────────┘                  │
│                          │                                          │
│                          ▼                                          │
│  2. Check readFileState                                             │
│     ┌────────────────────────────────────────────┐                  │
│     │ cachedState = readFileState.get(path)     │                  │
│     │                                            │                  │
│     │ if (cachedState exists):                   │                  │
│     │   currentMtime = getMtime(path)            │                  │
│     │   if (currentMtime === cachedTimestamp):   │                  │
│     │     → Return already_read_file             │                  │
│     └────────────────────────────────────────────┘                  │
│                          │                                          │
│                          ▼                                          │
│  3. Return cached content                                           │
│     ┌────────────────────────────────────────────┐                  │
│     │ {                                          │                  │
│     │   type: "already_read_file",               │                  │
│     │   filename: "src/main.ts",                 │                  │
│     │   content: {                               │                  │
│     │     type: "text",                          │                  │
│     │     file: {                                │                  │
│     │       filePath: "src/main.ts",             │                  │
│     │       content: "...cached content...",     │                  │
│     │       numLines: 150,                       │                  │
│     │       startLine: 1,                        │                  │
│     │       totalLines: 150                      │                  │
│     │     }                                      │                  │
│     │   }                                        │                  │
│     │ }                                          │                  │
│     └────────────────────────────────────────────┘                  │
│                          │                                          │
│                          ▼                                          │
│  4. Normalization returns [] (content already in context)           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## compact_file_reference Type

### What It Does

The `compact_file_reference` type is returned during compaction when a file needs to be restored but the read fails (typically due to size limits). It tells the LLM that the file was read before but is too large to re-include.

### Trigger Conditions

| Condition | Requirement |
|-----------|-------------|
| Mode | `mode === "compact"` |
| Read fails | File too large, token limit exceeded, or validation failure |
| Permission | File is not sandbox-blocked |

### Code Path

**Location:** chunks.142.mjs:2570-2574

```javascript
async function handleFallback() {
    if (mode === "compact") {
        return {
            type: "compact_file_reference",
            filename: filePath
        };
    }
    // ... at-mention fallback ...
}
```

### Normalization

**Location:** chunks.173.mjs:775-778

```javascript
case "compact_file_reference":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `Note: ${attachment.filename} was read before the last conversation was summarized, but the contents are too large to include. Use ${ReadTool.name} tool if you need to access it.`,
            isMeta: true
        })
    ]);
```

### Output Format

```markdown
<system-reminder>
Note: /path/to/large-file.js was read before the last conversation was summarized, but the contents are too large to include. Use Read tool if you need to access it.
</system-reminder>
```

### Example Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              compact_file_reference Flow                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Compaction starts                                               │
│     ┌────────────────────────────────────────────┐                  │
│     │ collectFilesToKeep(recentFiles, context)   │                  │
│     │   → readFileForAttachment(                 │                  │
│     │       "src/large-file.ts",                 │                  │
│     │       context,                             │                  │
│     │       mode="compact"                       │                  │
│     │     )                                      │                  │
│     └────────────────────────────────────────────┘                  │
│                          │                                          │
│                          ▼                                          │
│  2. Try to read file                                                │
│     ┌────────────────────────────────────────────┐                  │
│     │ validationResult = ReadTool.validateInput  │                  │
│     │                                            │                  │
│     │ if (!validationResult.result):             │                  │
│     │   if (fileSize > limit):                   │                  │
│     │     → handleFallback()                     │                  │
│     └────────────────────────────────────────────┘                  │
│                          │                                          │
│                          ▼                                          │
│  3. Compact mode fallback                                           │
│     ┌────────────────────────────────────────────┐                  │
│     │ if (mode === "compact") {                  │                  │
│     │   return {                                 │                  │
│     │     type: "compact_file_reference",        │                  │
│     │     filename: "src/large-file.ts"          │                  │
│     │   }                                        │                  │
│     │ }                                          │                  │
│     └────────────────────────────────────────────┘                  │
│                          │                                          │
│                          ▼                                          │
│  4. Normalization creates reminder                                  │
│     ┌────────────────────────────────────────────┐                  │
│     │ "Note: src/large-file.ts was read before   │                  │
│     │  the last conversation was summarized, but │                  │
│     │  the contents are too large to include.    │                  │
│     │  Use Read tool if you need to access it."  │                  │
│     └────────────────────────────────────────────┘                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## File State Replacement Logic

### When File is Mentioned Again

When a user @-mentions a file that already exists in `readFileState`, the system must decide whether to use cached content or re-read the file.

### Decision Matrix

| Scenario | Cached State | Current mtime | Action |
|----------|--------------|---------------|--------|
| File unchanged | Full read (offset=undefined) | mtime === cachedTimestamp | Return `already_read_file` |
| File changed | Full read | mtime > cachedTimestamp | Re-read, update cache |
| Partial read | offset/limit set | Any | Check if full read needed |
| Not in cache | N/A | N/A | Read fresh, add to cache |

### Partial Read State Replacement

**Critical detail:** When a file is read with `offset` and `limit`, the cached state includes these values. Subsequent @-mentions may trigger different behavior.

```javascript
// Scenario 1: Full read, then @-mention
// First read:
readFileState.set(path, {
    content: "full content",
    timestamp: 1234567890,
    offset: undefined,  // Full read
    limit: undefined
});

// @-mention later: Returns already_read_file if mtime unchanged


// Scenario 2: Partial read, then @-mention
// First read (lines 50-100):
readFileState.set(path, {
    content: "lines 50-100 content",
    timestamp: 1234567890,
    offset: 50,        // Partial read
    limit: 51          // 51 lines (50-100)
});

// @-mention later (no offset/limit):
// The check at chunks.142.mjs:2547 still applies
// But returned content is ONLY the partial content!
// This is because _.content contains only lines 50-100


// Scenario 3: @-mention with different offset/limit
// After partial read, @-mention with offset=1, limit=50:
// The system will call ReadTool.call() with new offset/limit
// readFileState is UPDATED with new content:
readFileState.set(path, {
    content: "lines 1-50 content",   // NEW content
    timestamp: 1234567891,            // NEW timestamp
    offset: 1,                        // NEW offset
    limit: 50                         // NEW limit
});
```

### State Replacement by Read Tool

**Location:** chunks.146.mjs:2045-2050

Every successful read via `ReadTool.call()` updates `readFileState`:

```javascript
// After reading text file:
w.set(J, {
    content: P,           // The actual content read (may be partial)
    timestamp: aW(X),     // File's current mtime
    offset: q,            // offset parameter (undefined for full read)
    limit: K              // limit parameter (undefined for full read)
});
```

**Key insight:** The cache is **overwritten** on each read, not merged. If you read lines 1-50 then lines 100-150, only the second read is cached.

### Full Read After Partial

When a partial read exists and a full read is requested:

```javascript
// Before: Partial read in cache
readFileState.get(path) === {
    content: "partial content...",
    timestamp: 1234567890,
    offset: 50,
    limit: 100
}

// User does: @filename (no offset/limit)
// OR Read tool with offset=1, limit=undefined

// After: Full read replaces partial
readFileState.get(path) === {
    content: "full file content...",
    timestamp: 1234567891,  // New timestamp
    offset: undefined,      // Now a full read
    limit: undefined
}
```

---

## @-Mention with Line Range

### Extracting Line Ranges from @-Mention

**Location:** chunks.142.mjs:2205-2231

Users can @-mention files with line ranges: `@src/main.ts:50-100`

```javascript
// ============================================
// extractAtMentionedFiles - Parse @-mentions with line ranges
// Location: chunks.142.mjs:2199-2236
// ============================================

// ORIGINAL (for source lookup):
async function KIY(A, q) {
    let K = _IY(A);  // Parse @-mentions
    // ...
    return (await Promise.all(K.map(async (w) => {
        try {
            let {
                filename: H,
                lineStart: $,
                lineEnd: O
            } = DIY(w), _ = g4(H);  // Parse filename and line range
            // ...
            return await TyA(_, q, "tengu_at_mention_extracting_filename_success",
                "tengu_at_mention_extracting_filename_error", "at-mention", {
                offset: $,
                limit: O && $ ? O - $ + 1 : void 0
            })
        } catch { /* ... */ }
    }))).filter(Boolean)
}

// READABLE (for understanding):
async function extractAtMentionedFiles(userMessage, context) {
    let mentions = parseAtMentions(userMessage);

    return (await Promise.all(mentions.map(async (mention) => {
        // Parse mention into filename and optional line range
        let { filename, lineStart, lineEnd } = parseFilePathWithLineRange(mention);
        let absolutePath = resolvePath(filename);

        // Skip if sandbox blocked
        if (isSandboxBlocked(absolutePath)) return null;

        // Load file attachment with optional offset/limit
        return await readFileForAttachment(
            absolutePath,
            context,
            "tengu_at_mention_extracting_filename_success",
            "tengu_at_mention_extracting_filename_error",
            "at-mention",
            {
                offset: lineStart,
                limit: lineEnd && lineStart ? lineEnd - lineStart + 1 : undefined
            }
        );
    }))).filter(Boolean);
}

// Mapping: KIY→extractAtMentionedFiles, A→userMessage, q→context, w→mention, H→filename, $→lineStart, O→lineEnd, DIY→parseFilePathWithLineRange, g4→resolvePath, TyA→readFileForAttachment
```

### Line Range Parsing

**Location:** chunks.142.mjs:2429-2440

```javascript
// Format: @filename:50-100  or  @filename:50

function parseFilePathWithLineRange(mention) {
    // Parse the mention string
    // Returns: { filename, lineStart, lineEnd }
    //
    // Examples:
    //   "@src/main.ts"       → { filename: "src/main.ts", lineStart: undefined, lineEnd: undefined }
    //   "@src/main.ts:50"    → { filename: "src/main.ts", lineStart: 50, lineEnd: undefined }
    //   "@src/main.ts:50-100" → { filename: "src/main.ts", lineStart: 50, lineEnd: 100 }
}
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

## Subagent File Tracking

### Overview

File tracking operates differently across agent contexts. Understanding these differences is crucial for analyzing multi-agent scenarios.

### Key Question: Does Subagent File Tracking Propagate to Parent?

**Answer: NO - File tracking is per-context, NOT propagated to parent.**

### Subagent Context Creation

**Location:** chunks.130.mjs:1988, chunks.149.mjs:2603

When a subagent is spawned, it receives a **cloned copy** of the parent's `readFileState`:

```javascript
// ============================================
// Subagent readFileState initialization
// Location: chunks.130.mjs:1988
// ============================================

// ORIGINAL (for source lookup):
let T = H !== void 0 ? DI(K.readFileState) : yd(Ed);

// READABLE (for understanding):
// If forkContextMessages provided: clone parent's readFileState
// Otherwise: create fresh empty LRU cache
let subagentReadFileState = forkContextMessages !== undefined
    ? cloneLruCache(parentContext.readFileState)  // Inherit from parent
    : createLruCache(LRU_MAX_ENTRIES);            // Start fresh

// Mapping: T→subagentReadFileState, H→forkContextMessages, K→parentContext, DI→cloneLruCache, yd→createLruCache, Ed→LRU_MAX_ENTRIES
```

### Subagent Context Isolation

**Location:** chunks.149.mjs:2589-2631 (vQ1 function)

```javascript
// ============================================
// deriveToolUseContext - Create subagent context
// Location: chunks.149.mjs:2589-2631
// ============================================

// ORIGINAL (for source lookup):
function vQ1(A, q) {
    let K = q?.abortController ?? (q?.shareAbortController ? A.abortController : R61(A.abortController)),
        // ...
    return {
        readFileState: DI(q?.readFileState ?? A.readFileState),
        // ... other context fields ...
    }
}

// READABLE (for understanding):
function deriveToolUseContext(parentContext, options) {
    return {
        // ALWAYS clone - never share reference
        readFileState: cloneLruCache(
            options?.readFileState ?? parentContext.readFileState
        ),
        // Other context fields...
    };
}

// Mapping: vQ1→deriveToolUseContext, A→parentContext, q→options, yp→cloneLruCache
```

### Why Clone Instead of Share?

**Design rationale:**

1. **Isolation**: Subagent file reads shouldn't pollute parent's tracking
   - **Prevents false positives**: Subagent's experimental reads don't trigger parent change detection
   - **Clean separation**: Each agent has its own view of file state

2. **Memory safety**: Cloning prevents unbounded growth
   - **LRU eviction**: Each context has its own 100-entry limit
   - **No shared references**: Can't accidentally corrupt parent state

3. **Compaction independence**: Each context handles compaction separately
   - **Clear operation**: `readFileState.clear()` in subagent doesn't affect parent
   - **State preservation**: Different agents preserve different files

### Implications by Agent Type

#### Main Agent

```
┌─────────────────────────────────────────┐
│ Main Agent Context                      │
├─────────────────────────────────────────┤
│ readFileState: LRU (100 entries, 25MB)  │
│ ├─ File A (read at T1)                  │
│ ├─ File B (read at T2)                  │
│ └─ File C (read at T3)                  │
│                                         │
│ Change detection: YES                   │
│ @-mention optimization: YES             │
│ Compaction preservation: YES            │
└─────────────────────────────────────────┘
```

#### Synchronous Subagent

```
┌─────────────────────────────────────────┐
│ Subagent Context (cloned from parent)   │
├─────────────────────────────────────────┤
│ readFileState: CLONE of parent's state  │
│ ├─ File A (inherited from parent)       │
│ └─ File D (read by subagent)            │
│                                         │
│ Change detection: YES (local only)      │
│ @-mention optimization: YES (local)     │
│ Changes NOT propagated to parent        │
└─────────────────────────────────────────┘
         │
         ▼ After subagent completes
┌─────────────────────────────────────────┐
│ Parent Context (UNCHANGED)              │
├─────────────────────────────────────────┤
│ readFileState: Original state           │
│ ├─ File A (read at T1)                  │
│ ├─ File B (read at T2)                  │
│ └─ File C (read at T3)                  │
│                                         │
│ File D NOT added to parent's state      │
└─────────────────────────────────────────┘
```

#### Asynchronous (Background) Subagent

```
┌─────────────────────────────────────────┐
│ Background Subagent Context             │
├─────────────────────────────────────────┤
│ readFileState: Fresh or cloned copy     │
│ └─ Independent tracking                 │
│                                         │
│ Runs in isolation                       │
│ File changes not visible to parent      │
└─────────────────────────────────────────┘
```

#### Teammate (Separate Process)

```
┌─────────────────────────────────────────┐
│ Teammate Process (full isolation)       │
├─────────────────────────────────────────┤
│ readFileState: Fresh empty cache        │
│ └─ No inheritance from leader           │
│                                         │
│ Completely separate process             │
│ No shared state with leader             │
└─────────────────────────────────────────┘
```

### State Restoration After Compaction

**Location:** chunks.179.mjs:136-138

After compaction, the system rebuilds `readFileState` from message history and merges with existing state:

```javascript
// ============================================
// Rebuild readFileState after compaction
// Location: chunks.179.mjs:136-138
// ============================================

// ORIGINAL (for source lookup):
let A1 = extractFileReadsFromMessages(D1, K),
    M1 = yD1(A1, s.readFileState);

// READABLE (for understanding):
// 1. Extract file reads from compacted messages
let extractedState = buildFileReadState(messages, workingDirectory);

// 2. Merge with existing state (keep newer entries)
let mergedState = mergeFileReadState(extractedState, context.readFileState);

// Mapping: A1→extractedState, D1→messages, K→workingDirectory, M1→mergedState, yD1→mergeFileReadState, s→context
```

> **Note:** The `buildFileReadState` function referenced here extracts file read state from messages. In v2.1.76, the primary mechanism for populating `readFileState` is through the Read tool's `sF8` function (chunks.147.mjs:344-368).

### When File State IS Propagated

File state is propagated in specific scenarios:

| Scenario | Propagation | How |
|----------|-------------|-----|
| Subagent reads file | ❌ No | Clone is independent |
| Main agent compaction | ✅ Yes | `buildFileReadState` extracts from messages |
| Session restore | ✅ Yes | `mergeFileReadState` merges restored state |
| Microcompaction | ✅ Yes | State extracted from preserved messages |

### Code Evidence: No Propagation Path

Search for `readFileState` propagation patterns:

```javascript
// NO CODE EXISTS that does:
parentContext.readFileState = subagentContext.readFileState;

// OR:
parentContext.readFileState.merge(subagentContext.readFileState);

// Instead, only CLONE operations exist:
let cloned = cloneLruCache(parentContext.readFileState);
```

### Design Trade-offs

**Why NOT propagate subagent file reads to parent?**

1. **Noise reduction**: Subagents often read files for exploration, not modification
   - Subagent reads `test.js` to understand code → parent shouldn't track this

2. **Avoid false change detection**: If subagent reads a file, then external process modifies it
   - Parent would get "file changed" notification for file it never read

3. **Clear ownership**: Each agent owns its file tracking
   - Parent knows what IT read, not what its children read

4. **Compaction complexity**: Propagation would require explicit merge after subagent completes
   - Added complexity for minimal benefit

### Alternative: Message-Based Inheritance

If subagent file reads need to be "known" by parent, the parent can:

1. **Read the file itself** after subagent completes
2. **Use message extraction** (`buildFileReadState`) if subagent messages are preserved
3. **Explicit state transfer** via subagent result payload (custom implementation)

---

## Summary

The File Read Tracking system provides **session-aware file monitoring** through:

1. **LRU caching** of file contents with strict memory limits
2. **Two-pass extraction** from conversation messages to build initial state
3. **Merge-with-newer-wins** strategy for combining states
4. **Clear-and-restore cycle** during compaction for memory efficiency
5. **Real-time change detection** via mtime comparison and diff generation

This ensures the LLM maintains accurate knowledge of file contents throughout long sessions, even across context compactions, while preventing unbounded memory growth.