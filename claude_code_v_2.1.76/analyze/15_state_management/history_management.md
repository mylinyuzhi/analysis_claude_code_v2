# History & Paste-Cache Management Deep Analysis

> Source-level reverse engineering of history.jsonl, paste-cache, two-tier storage, file locking, and debounced flush.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `addToHistory` (M36) - Public API to add prompt to history
- `recordHistoryEntry` (pN9) - Processes and queues a history entry
- `flushHistoryToDisk` (g84) - Writes pending entries to history.jsonl with file locking
- `debouncedFlush` (F84) - Debounced flush with retry logic
- `iterateHistoryEntries` (B84) - Generator yielding history entries (memory + disk)
- `iterateProjectHistory` (MX1) - Yields project-filtered, session-prioritized history
- `storePaste` (S84) - Writes large paste content to paste-cache
- `retrievePaste` (C84) - Reads paste content from paste-cache by hash
- `cleanupOldPastes` (I84) - Removes paste files older than cutoff
- `hashContent` (R84) - SHA256 hash truncated to 16 hex chars
- `resolveHistoryPastedContent` (FN9) - Resolves paste content (inline or from cache)

---

## Architecture Overview

History management uses a **write-behind buffer** with file-locked persistence. User prompts are captured in memory first, then flushed to `~/.claude/history.jsonl` in batches using a debounced write pattern. Large pasted content is stored separately in `~/.claude/paste-cache/` using content-addressed storage (SHA256 hashing).

```
User Input
  │
  ▼
addToHistory(input)
  │
  ├── Register shutdown hook (once)
  │
  ▼
recordHistoryEntry(input)
  │
  ├── Process pasted contents:
  │   ├── Images → skip
  │   ├── Small text (≤ 1024 bytes) → store inline
  │   └── Large text (> 1024 bytes) → hash → storePaste → store hash reference
  │
  ├── Enrich: { ...entry, timestamp, project, sessionId }
  │
  ├── Push to pendingHistory[] buffer
  │
  ▼
debouncedFlush(0)
  │
  ├── Guard: isFlushInProgress? → skip
  ├── Guard: retryCount > 5? → stop
  │
  ▼
flushHistoryToDisk()
  │
  ├── Touch-create file (append mode)
  ├── Acquire file lock (stale 10s, 3 retries, 50ms min)
  ├── Serialize pendingHistory to JSONL
  ├── Clear buffer
  ├── Append to file (mode 0o600)
  └── Release lock
```

---

## Two-Tier Paste Storage

### Design Rationale

Pastes are split into two tiers based on size:

| Tier | Size | Storage | Retrieval |
|------|------|---------|-----------|
| **Inline** | ≤ 1024 bytes | Directly in `history.jsonl` | Read from history entry |
| **External** | > 1024 bytes | `~/.claude/paste-cache/{hash}.txt` | Load by hash from cache |

**Why this approach:**
- Keeps `history.jsonl` small and fast to parse for autocomplete
- Large pastes (code blocks, file contents) don't bloat the history file
- Content-addressed storage deduplicates identical pastes
- Each tier can have independent retention policies

### Threshold Constant

```javascript
// Location: chunks.85.mjs:~1549
const INLINE_PASTE_THRESHOLD = 1024;  // BN9 = 1024 bytes
```

### hashContent (`R84`)

```javascript
// ============================================
// hashContent - SHA256 hash truncated to 16 hex chars
// Location: chunks.85.mjs:1308-1310
// ============================================

// ORIGINAL (for source lookup):
function R84(A) {
    return LN9("sha256").update(A).digest("hex").slice(0, 16)
}

// READABLE (for understanding):
function hashContent(content) {
    return crypto.createHash("sha256").update(content).digest("hex").slice(0, 16)
}

// Mapping: R84→hashContent, LN9→crypto.createHash
```

**16-character hex = 64 bits of hash space.** Collision probability is negligible for the expected number of pastes (thousands, not billions). Truncation reduces filename length while maintaining practical uniqueness.

### storePaste (`S84`)

```javascript
// ============================================
// storePaste - Writes paste content to disk with SHA256 hash filename
// Location: chunks.85.mjs:1316-1330
// ============================================

// ORIGINAL (for source lookup):
async function S84(A, q) {
    try {
        let K = LT8();
        await RN9(K, { recursive: !0 });
        let Y = h84(A);
        await hN9(Y, q, { encoding: "utf8", mode: 384 }),
            k(`Stored paste ${A} to ${Y}`)
    } catch (K) {
        k(`Failed to store paste: ${K}`)
    }
}

// READABLE (for understanding):
async function storePaste(hash, content) {
    try {
        let dir = getPasteCacheDir();
        await mkdir(dir, { recursive: true });
        let filePath = getPasteFilePath(hash);
        await writeFile(filePath, content, { encoding: "utf8", mode: 0o600 });
        log(`Stored paste ${hash} to ${filePath}`);
    } catch (err) {
        log(`Failed to store paste: ${err}`);
    }
}

// Mapping: S84→storePaste, A→hash, q→content, LT8→getPasteCacheDir, h84→getPasteFilePath
// RN9→mkdir, hN9→writeFile
```

**Key detail:** Mode `384` decimal = `0o600` octal = owner read/write only. This protects paste content from other users on shared systems.

### retrievePaste (`C84`)

```javascript
// ============================================
// retrievePaste - Reads paste content from disk by hash
// Location: chunks.85.mjs:1332-1344
// ============================================

// ORIGINAL (for source lookup):
async function C84(A) {
    try {
        let q = h84(A);
        return await SN9(q, { encoding: "utf8" })
    } catch (q) {
        if (q && typeof q === "object" && "code" in q) {
            if (q.code !== "ENOENT") k(`Failed to retrieve paste ${A}: ${q}`)
        }
        return null
    }
}

// READABLE (for understanding):
async function retrievePaste(hash) {
    try {
        let filePath = getPasteFilePath(hash);
        return await readFile(filePath, { encoding: "utf8" });
    } catch (err) {
        // ENOENT is silently ignored (paste may have been cleaned up)
        if (err?.code !== "ENOENT") log(`Failed to retrieve paste ${hash}: ${err}`);
        return null;
    }
}

// Mapping: C84→retrievePaste, SN9→readFile
```

### resolveHistoryPastedContent (`FN9`)

```javascript
// ============================================
// resolveHistoryPastedContent - Resolves paste content (inline or from cache)
// Location: chunks.85.mjs:1429-1448
// ============================================

// READABLE (for understanding):
async function resolveHistoryPastedContent(pasteEntry) {
    // Tier 1: Content stored inline (small pastes)
    if (pasteEntry.content) {
        return { id: pasteEntry.id, type: pasteEntry.type, content: pasteEntry.content,
                 mediaType: pasteEntry.mediaType, filename: pasteEntry.filename };
    }
    // Tier 2: Content stored in paste-cache by hash (large pastes)
    if (pasteEntry.contentHash) {
        let content = await retrievePaste(pasteEntry.contentHash);
        if (content) {
            return { id: pasteEntry.id, type: pasteEntry.type, content: content,
                     mediaType: pasteEntry.mediaType, filename: pasteEntry.filename };
        }
    }
    return null;  // Content unavailable (cleaned up or missing)
}

// Mapping: FN9→resolveHistoryPastedContent
```

---

## History Entry Recording

### addToHistory (`M36`)

```javascript
// ============================================
// addToHistory - Public API to add prompt to history
// Location: chunks.85.mjs:1538-1544
// ============================================

// ORIGINAL (for source lookup):
function M36(A) {
    if (t6(process.env.CLAUDE_CODE_SKIP_PROMPT_HISTORY)) return;
    if (!x84) x84 = !0, E4(async () => {
        if (jX1) await jX1;
        if (Cd.length > 0) await g84()
    });
    pN9(A)
}

// READABLE (for understanding):
function addToHistory(input) {
    // Skip if history is disabled via env var
    if (parseBoolean(process.env.CLAUDE_CODE_SKIP_PROMPT_HISTORY)) return;

    // Register shutdown hook (once) to ensure no history loss on exit
    if (!shutdownHookRegistered) {
        shutdownHookRegistered = true;
        onExit(async () => {
            if (flushPromise) await flushPromise;
            if (pendingHistory.length > 0) await flushHistoryToDisk();
        });
    }

    recordHistoryEntry(input);
}

// Mapping: M36→addToHistory, t6→parseBoolean, x84→shutdownHookRegistered
// E4→onExit, jX1→flushPromise, g84→flushHistoryToDisk, pN9→recordHistoryEntry
```

**Key insight:** The shutdown hook guarantees no history loss. It:
1. Waits for any in-progress flush to complete
2. Flushes any remaining buffered entries
3. This runs before the process exits, even on SIGTERM

### recordHistoryEntry (`pN9`)

```javascript
// ============================================
// recordHistoryEntry - Processes and queues a history entry
// Location: chunks.85.mjs:1501-1536
// ============================================

// ORIGINAL (for source lookup):
async function pN9(A) {
    let q = typeof A === "string" ? { display: A, pastedContents: {} } : A,
        K = {};
    if (q.pastedContents)
        for (let [z, _] of Object.entries(q.pastedContents)) {
            if (_.type === "image") continue;
            if (_.content.length <= BN9) K[Number(z)] = { id: _.id, type: _.type, content: _.content, mediaType: _.mediaType, filename: _.filename };
            else {
                let w = R84(_.content);
                K[Number(z)] = { id: _.id, type: _.type, contentHash: w, mediaType: _.mediaType, filename: _.filename };
                S84(w, _.content)
            }
        }
    let Y = { ...q, pastedContents: K, timestamp: Date.now(), project: qY(), sessionId: R1() };
    Cd.push(Y);
    jX1 = F84(0)
}

// READABLE (for understanding):
async function recordHistoryEntry(input) {
    let entry = typeof input === "string" ? { display: input, pastedContents: {} } : input;
    let processedPastes = {};

    if (entry.pastedContents) {
        for (let [idx, paste] of Object.entries(entry.pastedContents)) {
            if (paste.type === "image") continue;  // Skip images entirely

            if (paste.content.length <= INLINE_PASTE_THRESHOLD) {
                // Small paste: store inline in history
                processedPastes[Number(idx)] = {
                    id: paste.id, type: paste.type, content: paste.content,
                    mediaType: paste.mediaType, filename: paste.filename
                };
            } else {
                // Large paste: hash and store in paste-cache (fire-and-forget)
                let hash = hashContent(paste.content);
                processedPastes[Number(idx)] = {
                    id: paste.id, type: paste.type, contentHash: hash,
                    mediaType: paste.mediaType, filename: paste.filename
                };
                storePaste(hash, paste.content);  // Fire-and-forget async write
            }
        }
    }

    let record = {
        ...entry,
        pastedContents: processedPastes,
        timestamp: Date.now(),
        project: getProject(),
        sessionId: getSessionId()
    };
    pendingHistory.push(record);
    flushPromise = debouncedFlush(0);
}

// Mapping: pN9→recordHistoryEntry, BN9→INLINE_PASTE_THRESHOLD (1024)
// R84→hashContent, S84→storePaste, qY→getProject, R1→getSessionId
// Cd→pendingHistory, F84→debouncedFlush
```

**Key decisions:**
1. **Images skipped entirely** -- history is text-only for autocomplete
2. **Fire-and-forget paste storage** -- `storePaste` is called without await; paste file creation doesn't block history recording
3. **Enrichment with project and session** -- enables project-filtered history queries

---

## File-Locked Persistence

### flushHistoryToDisk (`g84`)

```javascript
// ============================================
// flushHistoryToDisk - Writes pending entries to history.jsonl with file locking
// Location: chunks.85.mjs:1462-1488
// ============================================

// ORIGINAL (for source lookup):
async function g84() {
    if (Cd.length === 0) return;
    let A;
    try {
        let q = u84(c8(), "history.jsonl");
        await mN9(q, "", { encoding: "utf8", mode: 384, flag: "a" }),
            A = await m84.lock(q, { stale: 1e4, retries: { retries: 3, minTimeout: 50 } });
        let K = Cd.map((Y) => B6(Y) + "\n");
        Cd = [], await uN9(q, K.join(""), { mode: 384 })
    } catch (q) {
        k(`Failed to write prompt history: ${q}`)
    } finally {
        if (A) await A()
    }
}

// READABLE (for understanding):
async function flushHistoryToDisk() {
    if (pendingHistory.length === 0) return;
    let releaseLock;
    try {
        let filePath = pathJoin(getClaudeHome(), "history.jsonl");

        // Step 1: Ensure file exists (create if needed, append mode)
        await writeFile(filePath, "", { encoding: "utf8", mode: 0o600, flag: "a" });

        // Step 2: Acquire file lock
        releaseLock = await properLock.lock(filePath, {
            stale: 10000,      // Lock expires after 10 seconds (stale lock recovery)
            retries: {
                retries: 3,    // Try up to 3 times
                minTimeout: 50 // Wait at least 50ms between retries
            }
        });

        // Step 3: Serialize pending entries to JSONL lines
        let lines = pendingHistory.map((entry) => JSON.stringify(entry) + "\n");

        // Step 4: Clear buffer BEFORE write (entries are already serialized)
        pendingHistory = [];

        // Step 5: Append to file
        await appendFile(filePath, lines.join(""), { mode: 0o600 });
    } catch (err) {
        log(`Failed to write prompt history: ${err}`);
    } finally {
        // Step 6: Always release lock
        if (releaseLock) await releaseLock();
    }
}

// Mapping: g84→flushHistoryToDisk, Cd→pendingHistory, m84→properLock
// u84→pathJoin, mN9→writeFile, uN9→appendFile, B6→JSON.stringify
```

**Critical algorithm: Write-behind buffer with file locking**

**Why clear buffer before write (Step 4)?**
- If the write fails, entries are lost (acceptable: they were transient prompts)
- If we cleared after write and the process crashes during write, the entries would be written again on next flush → duplicates
- Clearing before write ensures at-most-once semantics

**Why file locking?**
- Multiple Claude processes can run concurrently (different terminals, background agents)
- Each process has its own `pendingHistory` buffer
- Without locking, concurrent appends could interleave partial JSON lines
- Stale lock timeout (10s) handles the case where a process crashes while holding the lock

### debouncedFlush (`F84`)

```javascript
// ============================================
// debouncedFlush - Debounced history flush with retry
// Location: chunks.85.mjs:1490-1499
// ============================================

// ORIGINAL (for source lookup):
async function F84(A) {
    if (hT8 || Cd.length === 0) return;
    if (A > 5) return;
    hT8 = !0;
    try { await g84() }
    finally {
        if (hT8 = !1, Cd.length > 0) await new Promise((q) => setTimeout(q, 500)), F84(A + 1)
    }
}

// READABLE (for understanding):
async function debouncedFlush(retryCount) {
    if (isFlushInProgress || pendingHistory.length === 0) return;
    if (retryCount > 5) return;  // Max 5 retries to prevent infinite loops

    isFlushInProgress = true;
    try {
        await flushHistoryToDisk();
    } finally {
        isFlushInProgress = false;
        // If new entries accumulated during flush, retry after 500ms
        if (pendingHistory.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
            debouncedFlush(retryCount + 1);
        }
    }
}

// Mapping: F84→debouncedFlush, hT8→isFlushInProgress, A→retryCount
```

**Key design: Self-retriggering with backoff**

If new history entries are added while a flush is in progress (which is common during rapid user input), the flush retries after a 500ms delay. The retry counter (max 5) prevents runaway retries if entries are being added faster than they can be flushed.

---

## History Reading

### iterateHistoryEntries (`B84`)

```javascript
// ============================================
// iterateHistoryEntries - Generator yielding history entries (memory + disk)
// Location: chunks.85.mjs:1392-1405
// ============================================

// ORIGINAL (for source lookup):
async function* B84() {
    for (let q = Cd.length - 1; q >= 0; q--) yield Cd[q];
    let A = u84(c8(), "history.jsonl");
    try {
        for await (let q of BAA(A)) try {
            yield gN9(q)
        } catch (K) {
            k(`Failed to parse history line: ${K}`)
        }
    } catch (q) {
        if (q.code === "ENOENT") return;
        throw q
    }
}

// READABLE (for understanding):
async function* iterateHistoryEntries() {
    // Phase 1: Yield unflushed in-memory entries (newest first)
    for (let i = pendingHistory.length - 1; i >= 0; i--) {
        yield pendingHistory[i];
    }

    // Phase 2: Stream entries from history.jsonl file
    let filePath = pathJoin(getClaudeHome(), "history.jsonl");
    try {
        for await (let line of readLines(filePath)) {
            try {
                yield JSON.parse(line);
            } catch (err) {
                log(`Failed to parse history line: ${err}`);
            }
        }
    } catch (err) {
        if (err.code === "ENOENT") return;  // No history file yet
        throw err;
    }
}

// Mapping: B84→iterateHistoryEntries, Cd→pendingHistory, BAA→readLines, gN9→JSON.parse
```

**Key insight:** Memory entries are yielded first (newest-to-oldest), then disk entries stream. This ensures the most recent entries (not yet flushed) are available for autocomplete immediately.

### iterateProjectHistory (`MX1`)

```javascript
// ============================================
// iterateProjectHistory - Session-first project history
// Location: chunks.85.mjs:1411-1427
// ============================================

// ORIGINAL (for source lookup):
async function* MX1() {
    let A = qY(), q = R1(), K = [], Y = 0;
    for await (let z of B84()) {
        if (!z || typeof z.project !== "string") continue;
        if (z.project !== A) continue;
        if (z.sessionId === q) yield await ST8(z), Y++;
        else K.push(z);
        if (Y + K.length >= b84) break
    }
    for (let z of K) {
        if (Y >= b84) return;
        yield await ST8(z), Y++
    }
}

// READABLE (for understanding):
async function* iterateProjectHistory() {
    let currentProject = getProject();
    let currentSession = getSessionId();
    let otherSessionEntries = [];
    let count = 0;

    for await (let entry of iterateHistoryEntries()) {
        if (!entry || typeof entry.project !== "string") continue;
        if (entry.project !== currentProject) continue;  // Filter by project

        if (entry.sessionId === currentSession) {
            // Current session entries → yield immediately (highest priority)
            yield await resolveHistoryEntry(entry);
            count++;
        } else {
            // Other session entries → buffer for later
            otherSessionEntries.push(entry);
        }

        if (count + otherSessionEntries.length >= MAX_HISTORY_ENTRIES) break;
    }

    // Then yield buffered entries from other sessions
    for (let entry of otherSessionEntries) {
        if (count >= MAX_HISTORY_ENTRIES) return;
        yield await resolveHistoryEntry(entry);
        count++;
    }
}

// Mapping: MX1→iterateProjectHistory, qY→getProject, R1→getSessionId
// K→otherSessionEntries, b84→MAX_HISTORY_ENTRIES (100), ST8→resolveHistoryEntry
```

**Algorithm: Session-first prioritization**

**What it does:** Returns up to 100 history entries for the current project, prioritizing the current session's entries.

**Why this approach:** When resuming a session, the user's own recent inputs from that session are most relevant for up-arrow recall and autocomplete. Cross-session entries fill remaining slots for broader project context. This produces a natural "most relevant first" ordering without explicit ranking.

---

## Module-Level State

```javascript
// Location: chunks.85.mjs:~1549-1570
const MAX_HISTORY_ENTRIES = 100;       // b84 = 100
const INLINE_PASTE_THRESHOLD = 1024;   // BN9 = 1024

let pendingHistory = [];               // Cd - unflushed entries buffer
let isFlushInProgress = false;         // hT8 - debounce guard
let flushPromise = null;               // jX1 - current flush operation
let shutdownHookRegistered = false;    // x84 - exit hook registered flag
```

---

## Cross-Module Integration

### History <-> REPL (chunks.196.mjs)

The REPL calls `addToHistory()` in the submit handler (`tN`) at line 919-922 after each user input. The history is queried for up-arrow recall and autocomplete suggestions.

### History <-> Resume (resume_flow.md)

On session resume, `iterateProjectHistory()` provides context-aware autocomplete by prioritizing the resumed session's history entries.

### History <-> Cleanup (cleanup_system.md)

`cleanupOldPastes()` is called by the master cleanup orchestrator to remove paste-cache files older than the retention period. The history.jsonl file itself is not cleaned -- it grows indefinitely (entries referencing deleted pastes gracefully return `null`).

### History <-> Session Persistence (session_persistence.md)

History entries are enriched with `project` and `sessionId` from InternalState, linking them to the session persistence system. This enables project-filtered and session-prioritized queries.
