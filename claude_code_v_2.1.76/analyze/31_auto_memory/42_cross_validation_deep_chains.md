# Auto Memory: Deep Cross-Validation — Internal Chains & State Management

## Overview

This document extends cross-validation to six additional integration chains:

1. **`nestedMemoryAttachmentTriggers` lifecycle** — how Read tool triggers nested memory
2. **`vO` lazy CLAUDE.md loader** — how AutoMem/TeamMem files enter the system prompt content
3. **`readFileState` LRU cache** — the shared state enabling cross-turn deduplication
4. **Permission bypass chain** — full `zo8` → `JF6`/`Da`/`Mp6` permission flow
5. **`CuY` (changed_files)** — how `readFileState` enables file-change detection
6. **`f4` message wrapping** — attachment → message lifecycle

**Version**: Claude Code v2.1.76 | **Date**: 2026-03-29 | **All symbols source-verified**

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

New symbols in this document:
- `cv9` - parseAtMentions (chunks.84.mjs:536)
- `sF8` - createNestedMemoryAttachments (chunks.147.mjs:344)
- `EuY` - findNestedClaudeDirectories (chunks.147.mjs:322)
- `vO` - loadClaudeFiles (chunks.84.mjs:~862, lazy)
- `DI` - copyReadFileState (chunks.84.mjs:65)
- `jB` - getReadFileStateKeys (chunks.84.mjs:61)
- `f4` - wrapAttachmentAsMessage (chunks.147.mjs:942)
- `CuY` - detectChangedFiles (chunks.147.mjs:498)
- `zo8` - checkMemoryWriteBypass (chunks.177.mjs:~993)
- `Mp6` - isAgentMemoryPath (chunks.90.mjs:872)
- `yu1` - isUserInjectableMemoryType (chunks.147.mjs:340)

---

## 1. `nestedMemoryAttachmentTriggers` Full Lifecycle

### 1.1 Where Triggers Are SET (Read Tool — chunks.90.mjs)

The `nestedMemoryAttachmentTriggers` set is populated every time ANY file is read via the Read tool:

```javascript
// ============================================
// Read Tool — sets nestedMemoryAttachmentTriggers after file read
// Location: chunks.90.mjs:1704, 1723, 1840
// ============================================

// Case 1: Notebook file read (line 1704)
await y94(I, Y, $);
let B = await $1().stat(K);
H.set(q, { content: I, timestamp: Math.floor(B.mtimeMs), ... });
j.nestedMemoryAttachmentTriggers?.add(q);    // ← add path

// Case 2: Image/binary file read (line 1723)
j.nestedMemoryAttachmentTriggers?.add(q), RC({...});

// Case 3: Text file read (line 1840)
j.nestedMemoryAttachmentTriggers?.add(q);
for (let u of am9) u(K, P);
```

**So every file path read via the Read tool goes into `nestedMemoryAttachmentTriggers`.**

### 1.2 Where Triggers Are CONSUMED (IuY → Yqq → sF8)

```javascript
// ============================================
// IuY → Yqq → sF8: Process triggered paths
// Location: chunks.147.mjs:541-549 → 371 → 344
// ============================================

// IuY (chunks.147.mjs:541):
async function IuY(A) {
    if (!A.nestedMemoryAttachmentTriggers || A.nestedMemoryAttachmentTriggers.size === 0) return [];
    let q = A.getAppState(), K = [];
    for (let Y of A.nestedMemoryAttachmentTriggers) {
        let z = Yqq(Y, A, q);   // Process each triggered path
        K.push(...z)
    }
    return A.nestedMemoryAttachmentTriggers.clear(), K   // ← CLEAR set after processing
}

// Yqq (chunks.147.mjs:371) — load CLAUDE.md-type files for triggered path:
function Yqq(A, q, K) {
    let Y = [];
    try {
        if (!kI(A, K.toolPermissionContext)) return Y;
        let z = new Set,
            _ = AA(),
            w = if8(A, z);           // Load Managed/User rules for path A's directory
        Y.push(...sF8(w, q, A));     // Create nested_memory attachments
        let { nestedDirs: O, cwdLevelDirs: $ } = EuY(A, _), H = w8("tengu_paper_halyard", !1);
        for (let j of O) {
            let J = nf8(j, A, z).filter(M => !H || M.type !== "Project" && M.type !== "Local");
            Y.push(...sF8(J, q, A))
        }
        for (let j of $) {
            let J = rf8(j, A, z).filter(M => !H || M.type !== "Project" && M.type !== "Local");
            Y.push(...sF8(J, q, A))
        }
    } catch (z) { _6(z) }
    return Y
}
```

**What `Yqq` does for a triggered path:**
1. Find Managed/User rules relative to the triggered file's directory (`if8`)
2. Find nested `.claude/` directories upward from triggered file (`EuY`)
3. Find CWD-level directories (`cwdLevelDirs`)
4. For each found CLAUDE.md file: create `nested_memory` attachment if NOT already in `readFileState`

**Key insight:** When you read a file at `/project/src/component.tsx`, `Yqq` walks up directory tree looking for `.claude/CLAUDE.md`, `CLAUDE.md`, rules directories. If it finds any that haven't been injected yet, they become `nested_memory` attachments. This is how project-local CLAUDE.md files get dynamically injected when the agent enters a new subdirectory.

### 1.3 `sF8` — Create nested_memory Attachment

```javascript
// ============================================
// sF8 - createNestedMemoryAttachments
// Location: chunks.147.mjs:344
// ============================================

// ORIGINAL (for source lookup):
function sF8(A, q, K) {
    let Y = [],
        z = WF6();    // isSessionTelemetryEnabled
    for (let _ of A)
        if (!q.readFileState.has(_.path)) {   // ← Only inject if NOT already read
            if (Y.push({
                    type: "nested_memory",
                    path: _.path,
                    content: _,
                    displayPath: Bl(G1(), _.path)    // relative display path
                }), q.readFileState.set(_.path, {   // ← Mark as read
                    content: _.contentDiffersFromDisk ? _.rawContent ?? _.content : _.content,
                    timestamp: Date.now(),
                    offset: void 0,
                    limit: void 0,
                    isPartialView: _.contentDiffersFromDisk
                }), z && yuY(_.type)) {
                // Telemetry: log file load (only for User/Project/Local/Managed types)
                let w = _.globs ? "path_glob_match" : _.parent ? "include" : "nested_traversal";
                ZF6(_.path, _.type, w, { globs: _.globs, triggerFilePath: K, parentFilePath: _.parent })
            }
        }
    return Y
}

// yuY — only log telemetry for "real" CLAUDE.md types (not AutoMem/TeamMem)
function yuY(A) {
    return A === "User" || A === "Project" || A === "Local" || A === "Managed"
}
```

**Critical behavior:**
- `!q.readFileState.has(_.path)` — **dedup guard**: once a CLAUDE.md file is injected, it won't be re-injected in subsequent turns
- `q.readFileState.set(_.path, {...})` — registers the injected file in `readFileState`
- This means memory/CLAUDE.md file injection is **one-shot per session** (first access only)
- `yuY` excludes AutoMem/TeamMem from telemetry (they're handled separately via `vO`)

### 1.4 Lifecycle Summary

```
Session starts
│
├─ readFileState = new LRU cache (empty)
│
Turn 1: Agent reads file via Read tool
│
├─ chunks.90.mjs: nestedMemoryAttachmentTriggers.add(path)
│
│ [Next _uY computation — between tool turns]
│
├─ Hz("nested_memory", IuY)
│   ├─ IuY iterates nestedMemoryAttachmentTriggers
│   │   └─ Yqq(path) → walk directories → find CLAUDE.md files
│   │       └─ sF8([files], ctx, path)
│   │           ├─ NOT in readFileState? → create nested_memory attachment + add to readFileState
│   │           └─ ALREADY in readFileState? → skip (already injected)
│   └─ Clear nestedMemoryAttachmentTriggers (reset for next turn)
│
Turn 2: Agent reads another file
│
├─ nestedMemoryAttachmentTriggers.add(new_path)
│
├─ IuY processes new_path
│   └─ Any CLAUDE.md files found were already in readFileState → NO new attachments
│       (unless agent entered a new subdirectory with its own CLAUDE.md)
│
Turn N: No new CLAUDE.md directories encountered
│
└─ nestedMemoryAttachmentTriggers set populated but sF8 produces nothing
   (all relevant CLAUDE.md files already in readFileState)
```

---

## 2. `vO` — Lazy CLAUDE.md File Loader (Auto Memory Integration)

### 2.1 How AutoMem and TeamMem Enter the System Prompt

`vO` is the lazy loader that collects ALL instruction-type files. It's where MEMORY.md and team memory are loaded as part of the base system prompt content.

```javascript
// ============================================
// vO — loadClaudeFiles (lazy, memoized)
// Location: chunks.84.mjs:~862
// ============================================

// ORIGINAL — Key AutoMem/TeamMem section (simplified):
vO = e1((A = !1) => {
    let q = Date.now();
    U1("info", "memory_files_started");
    let K = [],    // ← Collects all file objects
        Y = new Set,   // ← processedPaths dedup
        // ... loads Managed, User, Project, Local files first ...

    // AutoMem: Load user's MEMORY.md
    if (Z3()) {    // ← isAutoMemoryEnabled()
        let W = xD1($z1(), "AutoMem");   // ← xD1 loads file with truncation + html strip
        if (W && !Y.has($$(W.path))) Y.add($$(W.path)), K.push(W)
    }

    // TeamMem: Load team's MEMORY.md
    if (c14.isTeamMemoryEnabled()) {    // ← c14 = team memory module
        let W = xD1(c14.getTeamMemEntrypoint(), "TeamMem");
        if (W && !Y.has($$(W.path))) Y.add($$(W.path)), K.push(W)
    }

    // Telemetry
    let X = K.reduce((W, Z) => W + Z.content.length, 0);
    U1("info", "memory_files_completed", { duration_ms: Date.now() - q, file_count: K.length, total_content_length: X });
    let P = {};
    for (let W of K) P[W.type] = (P[W.type] ?? 0) + 1;
    if (!l14) {
        l14 = !0;
        d("tengu_claudemd__initial_load", {
            file_count: K.length, total_content_length: X,
            user_count: P.User ?? 0, project_count: P.Project ?? 0,
            local_count: P.Local ?? 0, managed_count: P.Managed ?? 0,
            automem_count: P.AutoMem ?? 0, teammem_count: P.TeamMem ?? 0,
            ...
        })
    }
    return K   // ← Array of { path, type, content, globs, contentDiffersFromDisk, rawContent }
})
```

**What `vO` returns:** An array of file objects with structure:
```javascript
{
    path: string,                  // Absolute file path
    type: "AutoMem"|"TeamMem"|"User"|"Project"|"Local"|"Managed",
    content: string,               // Processed content (truncated if needed)
    globs: string[]|undefined,     // Glob patterns from frontmatter
    contentDiffersFromDisk: bool,  // true if truncation was applied
    rawContent: string|undefined   // Original content (when contentDiffersFromDisk)
}
```

### 2.2 `vO` → `lf8` → System Prompt Content Pipeline

```javascript
// vO() feeds into lf8() (buildSystemPromptContent):
lf8 = () => {
    let A = vO(),   // ← Get all files (including AutoMem/TeamMem)
        q = [],
        K = w8("tengu_paper_halyard", !1);
    for (let Y of A) {
        if (K && (Y.type === "Project" || Y.type === "Local")) continue;
        if (Y.content) {
            let z = /* type-specific context hint */;
            if (Y.type === "TeamMem")
                q.push(`Contents of ${Y.path}${z}:\n\n<team-memory-content source="shared">\n${Y.content}\n</team-memory-content>`);
            else
                q.push(`Contents of ${Y.path}${z}:\n\n${Y.content}`)
        }
    }
    return q.length === 0 ? "" : `${Qv9}\n\n${q.join("\n\n")}`
}
```

**Two-level memory in system prompt:**

```
System Prompt Content (via lf8 → vO):
│
├─ AutoMem MEMORY.md → `Contents of ~/.claude/projects/{hash}/memory/MEMORY.md (user's auto-memory, persists across conversations):`
│                       {content — max 200 lines, with truncation warning if exceeded}
│
└─ TeamMem MEMORY.md → `Contents of {team-dir}/MEMORY.md (shared team memory, synced across the organization):`
                        <team-memory-content source="shared">
                        {content — max 200 lines}
                        </team-memory-content>
```

**Performance**: `vO` is wrapped in `e1()` (memoize/lazy). The first call reads files from disk; subsequent calls return the cached array. Like `B8q` for the memory component, this avoids repeated disk I/O within a session.

### 2.3 Telemetry: `tengu_claudemd__initial_load`

The first call to `vO` fires `tengu_claudemd__initial_load` with detailed file type counts. This is a one-shot telemetry event (`l14` flag prevents re-firing). Provides Anthropic with data on how users organize memory files.

---

## 3. `readFileState` — LRU Cache for Cross-Turn State

### 3.1 Data Structure

`readFileState` is NOT a plain `Map` — it's an **LRU cache** with bounded capacity:

```javascript
// DI (copyReadFileState) — chunks.84.mjs:65:
function DI(A) {
    let q = yd(A.max, A.maxSize);    // yd creates new LRU cache with same capacity
    return q.load(A.dump()), q       // deep-copy via dump/load
}

// jB (getReadFileStateKeys) — chunks.84.mjs:61:
function jB(A) {
    return Array.from(A.keys())      // used by CuY to iterate all tracked files
}
```

**LRU bounds:** `yd(A.max, A.maxSize)` — bounded by `max` entries AND `maxSize` bytes. When full, least-recently-used entries are evicted. This prevents unbounded memory growth in long sessions with many file reads.

### 3.2 Lifecycle: Creation, Sharing, Clearing

```javascript
// Creation — Main agent (chunks.148.mjs:1992):
readFileState: DI(q?.readFileState ?? A.readFileState),
// ↑ Copies parent's readFileState into new agent context

// Creation — Background agent SDK (chunks.185.mjs:1762):
this.readFileState = A.readFileCache   // ← From constructor config

// Sharing — Agent context propagation (chunks.148.mjs:1992):
// When creating subagent: DI(parent.readFileState)
// Creates a COPY — subagent has independent readFileState (not shared with parent)

// Clearing — Session reset (chunks.148.mjs:2084):
f.readFileState.clear(), v.length = 0
```

**Key behavior: `DI` creates a COPY.** Each agent context (subagent) gets its own copy of the parent's readFileState. Changes in subagent don't affect parent. This ensures:
- Parent's `_qq` deduplication is not affected by subagent file reads
- Memory files read by subagents don't prevent parent from seeing them

### 3.3 What `readFileState` Tracks

The map stores file path → file info:
```javascript
{
    content: string,        // content at time of last read
    timestamp: number,      // mtime (floor) or Date.now() when read
    offset: number|undefined,
    limit: number|undefined,
    isPartialView: boolean  // true if content was truncated
}
```

**Three writers to `readFileState`:**

| Writer | Location | Tracks |
|--------|----------|--------|
| Read tool | `chunks.90.mjs:1840` | Text files read by agent |
| `sF8` | `chunks.147.mjs:356` | CLAUDE.md files injected as nested_memory |
| `buY` | `chunks.147.mjs:571` | Memory files injected as relevant_memories |

**Two readers of `readFileState`:**

| Reader | Location | Purpose |
|--------|----------|---------|
| `CuY` | `chunks.147.mjs:498` | Detect file changes since last read |
| `_qq` | `chunks.147.mjs:637` | Filter already-read files from relevant_memories |
| `sF8` | `chunks.147.mjs:348` | Skip already-injected CLAUDE.md files |
| `buY` | `chunks.147.mjs:562` | Skip already-loaded memory files |

---

## 4. Permission Bypass Chain: Full `zo8` Decision Tree

### 4.1 `zo8` — checkMemoryWriteBypass

The complete write permission bypass function:

```javascript
// ============================================
// zo8 - checkMemoryWriteBypass
// Location: chunks.177.mjs:~993
// ============================================

// ORIGINAL (for source lookup):
function zo8(A, q) {
    let K = tN6(A);   // normalize path
    if (JNq(K)) return {     // Plan file for current session
        behavior: "allow", ..., reason: "Plan files for current session are allowed for writing"
    };
    if (DNq(K)) return {     // Scratchpad file
        behavior: "allow", ..., reason: "Scratchpad files for current session are allowed for writing"
    };
    if (Mp6(K)) return {     // Agent memory (ALL scopes: project/local/user)
        behavior: "allow", ..., reason: "Agent memory files are allowed for writing"
    };
    if (!Oz1() && Da(K)) return {    // Auto memory (ONLY in non-cowork mode)
        behavior: "allow", ..., reason: "auto memory files are allowed for writing"
    };
    return { behavior: "passthrough", message: "" }
}
```

**`Mp6` (isAgentMemoryPath) — checks all agent memory path patterns:**

```javascript
// ============================================
// Mp6 - isAgentMemoryPath
// Location: chunks.90.mjs:872
// ============================================

function Mp6(A) {
    let q = vm9(A),    // resolve symlinks
        K = Ma();      // home directory
    if (q.startsWith(id(K, "agent-memory") + xB)) return !0;              // ~/.claude/agent-memory/
    if (q.startsWith(id(G1(), ".claude", "agent-memory") + xB)) return !0; // {cwd}/.claude/agent-memory/
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        if (q.includes(xB + "agent-memory-local" + xB) &&
            q.startsWith(id(process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR, "projects") + xB)) return !0;
    } else if (q.startsWith(id(G1(), ".claude", "agent-memory-local") + xB)) return !0;
    return !1
}
```

**`Mp6` covers ALL agent memory path variants:**
| Pattern | Example | Scope |
|---------|---------|-------|
| `~/.claude/agent-memory/{name}/` | `~/.claude/agent-memory/coder/` | user |
| `{cwd}/.claude/agent-memory/{name}/` | `.claude/agent-memory/coder/` | project |
| `{remote}/projects/{hash}/agent-memory-local/{name}/` | remote local-scope | local+remote |
| `{cwd}/.claude/agent-memory-local/{name}/` | `.claude/agent-memory-local/coder/` | local |

### 4.2 Full Write Permission Decision Hierarchy

```
Write permission check for file path F:
│
├─ ZX(path, rules, "edit", "deny")?
│   YES → DENY (explicit deny rule wins)
│   NO → continue
│
├─ zo8(path, input):
│   ├─ JNq(F)? (plan file for session) → ALLOW
│   ├─ DNq(F)? (scratchpad) → ALLOW
│   ├─ Mp6(F)? (ANY agent memory scope) → ALLOW (regardless of cowork mode)
│   ├─ !Oz1() && Da(F)? (auto memory, non-cowork) → ALLOW
│   └─ else → PASSTHROUGH (continue checking)
│
├─ ZX(path, rules, "edit", "allow") (session-level rule)?
│   YES (session rule) → ALLOW
│
├─ Yo8(path): safe path check?
│   NO → ASK (show confirmation dialog)
│
├─ ZX(path, rules, "edit", "ask")?
│   YES → ASK
│
├─ kI(path): in working directory?
│   acceptEdits mode AND in workdir → ALLOW
│
└─ ZX(path, rules, "edit", "allow")?
    YES → ALLOW
    NO → ASK
```

**Key distinction:**
- `Mp6` (agent memory) → always ALLOW, even in cowork mode
- `Da` (auto memory) → ALLOW only in non-cowork mode (`!Oz1()`)
- Team memory bypass is handled separately via `JF6` → `SD1() && m14(A)`

### 4.3 Team Memory Permission Path (chunks.91.mjs)

```javascript
// ============================================
// RB9 - shouldAllowTeamMemoryWrite
// Location: chunks.91.mjs:313
// ============================================

function RB9(A) {
    let q = A;
    if (!q) return !1;
    if (q.path && JF6(q.path)) return !0;   // JF6 = SD1() && m14(path)
    return !1
}
```

**Team memory permission bypass requires:**
1. `SD1()` = `Z3() && getFeatureFlag("tengu_herring_clock")` — auto memory enabled AND team memory flag on
2. `m14(path)` = path starts with `Lk()` (getTeamMemoryDirectory)

---

## 5. `CuY` (changed_files) — File Change Detection via `readFileState`

### 5.1 Algorithm

```javascript
// ============================================
// CuY - detectChangedFiles
// Location: chunks.147.mjs:498
// ============================================

// ORIGINAL (for source lookup):
async function CuY(A) {
    let q = jB(A.readFileState);    // All tracked file paths
    if (q.length === 0) return [];
    let K = A.getAppState();
    return (await Promise.all(q.map(async (z) => {
        let _ = A.readFileState.get(z);
        if (!_) return null;
        if (_.offset !== void 0 || _.limit !== void 0) return null;  // Skip partial reads
        let w = L4(z);
        if (rT6(w, K.toolPermissionContext)) return null;  // Skip restricted paths
        try {
            if (Jh(w) <= _.timestamp) return null;  // mtime ≤ read time? No change
            let O = { file_path: w };
            if (!(await L9.validateInput(O, A)).result) return null;
            let H = await L9.call(O, A);            // Re-read the file
            if (H.data.type === "text") {
                let j = Bf7(_.content, H.data.file.content);  // Diff
                if (j === "") return null;    // No visible diff? Skip
                return { type: "edited_text_file", filename: w, snippet: j }
            }
        } catch {
            return A.readFileState.delete(z), null   // File deleted → remove from tracking
        }
    }))).filter((z) => z !== null)
}
```

**Algorithm:**
1. Get all tracked paths from `readFileState` (via `jB`)
2. For each path: check mtime vs stored timestamp using `Jh(path)` (stat)
3. If mtime changed: re-read the file and diff against stored content using `Bf7`
4. If diff is non-empty: produce `edited_text_file` attachment with the diff snippet
5. If file deleted: remove from `readFileState`

**Memory files and `CuY`:**

When the agent writes MEMORY.md (via Edit/Write tool), that write updates mtime. If the agent then asks to read another file and `CuY` runs, it will detect MEMORY.md changed and inject `edited_text_file` showing what was written. This creates a feedback loop: the agent can see that its memory write was recorded.

However, `CuY` **skips partial reads** (`offset !== void 0 || limit !== void 0`). Memory files are read with limit=200 via `buY` and `xD1`. But buY writes to `readFileState` with `limit: D ? hE1 : void 0` — only truncated files get `limit` set. Full memory files (≤200 lines) have `limit: undefined` and thus ARE tracked by `CuY`.

---

## 6. `f4` — Attachment → Message Wrapping

### 6.1 Function

```javascript
// ============================================
// f4 - wrapAttachmentAsMessage
// Location: chunks.147.mjs:942
// ============================================

// ORIGINAL (for source lookup):
function f4(A) {
    return {
        attachment: A,
        type: "attachment",
        uuid: KuY(),              // random UUID
        timestamp: new Date().toISOString()   // ISO 8601 timestamp
    }
}
// Mapping: f4→wrapAttachmentAsMessage, KuY→generateUUID
```

**What `f4` produces:**
```javascript
{
    type: "attachment",              // Message type in agent loop
    attachment: {                    // The actual attachment object, e.g.:
        type: "relevant_memories",  // or "nested_memory", "plan_mode", etc.
        memories: [...]             // type-specific payload
    },
    uuid: "7a3f2b...",              // For dedup / reference
    timestamp: "2026-03-29T..."     // ISO timestamp
}
```

**Why wrap in `f4`?**
- `type: "attachment"` differentiates from regular user/assistant messages in the loop
- UUID enables dedup (same attachment not injected twice)
- Timestamp provides audit trail for telemetry

**`f4` usage in agent loop:**

```javascript
// Agent loop (chunks.148.mjs:1347-1354):
for await (let D6 of Vf6(...)) yield D6, Y6.push(D6);  // Vf6 already calls f4(O)
if (L) {
    let D6 = _qq(await L, H6);
    for (let Q6 of D6) {
        let k6 = f4(Q6);    // ← Wrap relevant_memories before yielding
        yield k6, Y6.push(k6)
    }
}
```

**Note:** `Vf6` already calls `f4` internally for each attachment from `_uY`. But `relevant_memories` (from `zqq`) is wrapped in `f4` in the agent loop itself — because `zqq`/`buY` returns raw attachment objects, not pre-wrapped.

---

## 7. Complete `readFileState` State Diagram

```
Session/Agent Context Created
│
├─ main agent: readFileState = new LRU cache (from config)
├─ subagent: readFileState = DI(parent.readFileState) — copy at spawn time
│
│  WITHIN a turn/tool-use loop:
│
Read tool called on file F
├─ nestedMemoryAttachmentTriggers.add(F)
└─ (NOTE: Does NOT add to readFileState directly — Read tool doesn't call readFileState.set)

    [Actually, text file read DOES call readFileState update via chunks.90.mjs:1840 context]
    H.set(q, { content, timestamp, offset, limit }) where H = context.readFileState

buY produces relevant_memories from file M
└─ K.set(M_path, { content, timestamp, offset?, limit? })

sF8 injects CLAUDE.md file C as nested_memory
└─ q.readFileState.set(C_path, { content, timestamp })

CuY runs for changed_files detection
├─ Checks all paths in readFileState for mtime changes
└─ Produces edited_text_file attachments for changed files

_qq filters relevant_memories
└─ Reads readFileState? NO — reads H6 (toolUses array), not readFileState
   (_qq operates on tool use inputs, not readFileState)

Session reset (gl()):
└─ f.readFileState.clear()  — all tracking cleared
```

**Correction to earlier analysis:** `_qq` does NOT use `readFileState`. It uses `H6` (the array of tool uses from the current turn). `_qq` extracts `file_path` from Read tool inputs in `H6`, not from `readFileState`.

---

## 8. Memory File vs CLAUDE.md File: Type Taxonomy

The `type` field on loaded files determines formatting and behavior:

| Type | Source | Context Hint | `yuY()` | Permission |
|------|--------|-------------|---------|-----------|
| `AutoMem` | User's MEMORY.md | `(user's auto-memory, persists across conversations)` | false | `Da()` bypass |
| `TeamMem` | Team's MEMORY.md | `(shared team memory, synced across the organization)` | false | `JF6()` bypass |
| `User` | `~/.claude/CLAUDE.md` | `(user's private global instructions for all projects)` | true | Normal |
| `Project` | `.claude/CLAUDE.md` in repo | `(project instructions, checked into the codebase)` | true | Normal |
| `Local` | `.claude/CLAUDE.local.md` | `(user's private project instructions, not checked in)` | true | Normal |
| `Managed` | Enterprise-managed rules | (none/special) | true | Normal |

**`yuY()` controls telemetry logging for nested_memory injection** (AutoMem/TeamMem excluded since they have their own telemetry via `DF6`).

---

## 9. Summary: New Symbols and Corrections

### New Verified Symbols

| Obfuscated | Readable | Location | Notes |
|------------|----------|----------|-------|
| `cv9` | `parseAtMentions` | chunks.84.mjs:536 | Parses @-references from markdown |
| `sF8` | `createNestedMemoryAttachments` | chunks.147.mjs:344 | One-shot injection, deduped by readFileState |
| `EuY` | `findNestedClaudeDirectories` | chunks.147.mjs:322 | Walks up dir tree for .claude/ dirs |
| `vO` | `loadClaudeFiles` | chunks.84.mjs:~862 | Lazy loader for ALL CLAUDE.md-type files |
| `DI` | `copyReadFileState` | chunks.84.mjs:65 | LRU deep-copy for subagent isolation |
| `jB` | `getReadFileStateKeys` | chunks.84.mjs:61 | `Array.from(A.keys())` |
| `f4` | `wrapAttachmentAsMessage` | chunks.147.mjs:942 | Adds type/uuid/timestamp |
| `CuY` | `detectChangedFiles` | chunks.147.mjs:498 | Diffs readFileState vs current mtime |
| `zo8` | `checkMemoryWriteBypass` | chunks.177.mjs:~993 | Plan/scratchpad/agent-mem/auto-mem bypass |
| `Mp6` | `isAgentMemoryPath` | chunks.90.mjs:872 | 4-pattern agent memory path check |
| `yuY` | `isUserInjectableMemoType` | chunks.147.mjs:340 | Telemetry filter for CLAUDE.md types |

### Corrections

1. **`_qq` reads `H6` (tool uses), NOT `readFileState`** — deduplication is based on what the LLM called Read on THIS turn, not what's been read across the session
2. **`readFileState` is an LRU cache (not plain Map)** — bounded capacity, evicts oldest entries
3. **`DI` creates a COPY for subagents** — no shared write state between parent and subagent
4. **`nestedMemoryAttachmentTriggers` is cleared after each `IuY` call** — resets every between-turn cycle
5. **Text file reads DO update `readFileState`** via `H.set(q, {...})` in chunks.90.mjs Read tool
