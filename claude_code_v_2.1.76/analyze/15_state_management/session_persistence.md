# Session Persistence Deep Analysis

> Source-level reverse engineering of the SessionPersistence system: JSONL transcript format, write batching, transcript parsing, and session file lifecycle.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `SessionPersistence` (ITq) - Singleton class managing session transcript I/O
- `getSessionPersistence` (Jz) - Singleton accessor with exit handler registration
- `getSessionTranscriptPath` (Cz) - Computes path for current session's JSONL file
- `getProjectsDir` (sb) - Returns `~/.claude/projects` directory
- `sessionFileExists` (fU6) - Checks if a session file exists on disk
- `parseTranscriptFile` (u_6) - Parses a JSONL transcript into structured data
- `loadSessionById` (Hl6) - Loads a session transcript by UUID
- `buildTranscriptObject` (Kr8) - Constructs a structured transcript return object
- `getSessionId` (n_) - Extracts session ID from transcript
- `isLazyTranscript` (Hh) - Checks if transcript needs full hydration
- `hydrateLazyTranscript` (hb) - Fully loads a lazy transcript
- `searchSessionsByName` (GF) - Searches sessions by custom title

---

## Architecture Overview

Session persistence in Claude Code uses an **append-only JSONL (JSON Lines)** format. Each session is stored as a single `.jsonl` file under `~/.claude/projects/{hashed-cwd}/`. The `SessionPersistence` class (`ITq`) manages all writes to this file, using a batched write queue with 100ms flush intervals for performance.

```
~/.claude/projects/
├── {hashed-cwd-1}/
│   ├── {session-uuid-1}.jsonl          # Session transcript
│   ├── {session-uuid-1}-1711234567.cast # Asciicast recording
│   ├── {session-uuid-2}.jsonl
│   └── {session-uuid-1}/
│       └── subagents/
│           └── agent-{agent-id}.jsonl   # Subagent transcript
├── {hashed-cwd-2}/
│   └── ...
└── ...
```

---

## Session File Path Resolution

### getProjectsDir (`sb`)

```javascript
// ============================================
// getProjectsDir - Returns the projects base directory
// Location: chunks.174.mjs:1124-1126
// ============================================

// ORIGINAL (for source lookup):
function sb() { return uN(c8(), "projects") }

// READABLE (for understanding):
function getProjectsDir() { return join(getClaudeHome(), "projects") }

// Mapping: sb→getProjectsDir, uN→join, c8→getClaudeHome
```

### getSessionTranscriptPath (`Cz`)

```javascript
// ============================================
// getSessionTranscriptPath - Returns path for current session's JSONL file
// Location: chunks.174.mjs:1128-1131
// ============================================

// ORIGINAL (for source lookup):
function Cz() {
    let A = Ck6() ?? mj(AA());
    return uN(A, `${R1()}.jsonl`)
}

// READABLE (for understanding):
function getSessionTranscriptPath() {
    let projectDir = getSessionProjectDir() ?? normalizePath(getOriginalCwd());
    return join(projectDir, `${getSessionId()}.jsonl`)
}

// Mapping: Cz→getSessionTranscriptPath, Ck6→getSessionProjectDir, mj→normalizePath, AA→getOriginalCwd, R1→getSessionId
```

**How it works:**
1. First tries `getSessionProjectDir()` -- a per-session override stored in InternalState (`v1.sessionProjectDir`)
2. Falls back to normalizing the original CWD into a project directory via `BD(cwd)` (hashing)
3. Appends `{sessionId}.jsonl` to construct the full path

### getSubagentFilePath (`L0`)

```javascript
// ============================================
// getSubagentFilePath - Returns path for a subagent's transcript file
// Location: chunks.174.mjs:1147
// ============================================

// ORIGINAL (for source lookup):
function L0(A) {
    return uN(Cz().replace(/\.jsonl$/, ""), "subagents", `agent-${A}.jsonl`)
}

// READABLE (for understanding):
function getSubagentFilePath(agentId) {
    return join(getSessionTranscriptPath().replace(/\.jsonl$/, ""), "subagents", `agent-${agentId}.jsonl`)
}

// Mapping: L0→getSubagentFilePath, A→agentId
```

**Path structure:** `~/.claude/projects/{hash}/{sessionId}/subagents/agent-{agentId}.jsonl`

### sessionFileExists (`fU6`)

```javascript
// ============================================
// sessionFileExists - Checks if a session file already exists on disk
// Location: chunks.174.mjs:1178
// ============================================

// ORIGINAL (for source lookup):
function fU6(A) {
    try { return !!statSync(cf(A)) }
    catch { return false }
}

// READABLE (for understanding):
function sessionFileExists(sessionId) {
    try { return !!statSync(getSessionFilePath(sessionId)) }
    catch { return false }
}

// Mapping: fU6→sessionFileExists, cf→getSessionFilePath
```

---

## JSONL Transcript Format

Each line in a `.jsonl` transcript is a JSON object with a `type` field. The types fall into two categories:

### Message Types (have `uuid`, `parentUuid`, `sessionId`, `cwd`, `timestamp`)

| Type | Purpose | Key Fields |
|------|---------|------------|
| `user` | User input message | `content`, `pastedContents`, `isMeta` |
| `assistant` | Assistant response | `content` (text, tool_use, thinking blocks) |
| `progress` | Streaming progress marker | `content` |
| `attachment` | File/context attachment | `content`, `attachmentType` |
| `system` | System message | `subtype` (e.g., `local_command`, `session_resumed`) |

### Metadata Types (no `uuid`, used for session-level state)

| Type | Purpose | Key Fields |
|------|---------|------------|
| `summary` | Compaction summary | `leafUuid`, `summary` |
| `custom-title` | User-set session name | `title` |
| `ai-title` | Auto-generated session name | `title` |
| `last-prompt` | Last user prompt (first 200 chars) | `text` |
| `tag` | Session tag | `tag` |
| `agent-name` | Agent display name | `name` |
| `agent-color` | Agent color | `color` |
| `agent-setting` | Agent configuration | `setting` |
| `mode` | Permission mode | `mode` |
| `pr-link` | PR association | `number`, `url`, `repository` |
| `file-history-snapshot` | File state snapshot for rewind | `snapshot` |
| `attribution-snapshot` | Code attribution data | `snapshot` |
| `content-replacement` | Content masking rules | `replacements` |
| `marble-origami-commit` | Context collapse commit | `commit` |
| `marble-origami-snapshot` | Context collapse snapshot | `snapshot` |
| `queue-operation` | Message queue operation | `operation` |
| `speculation-accept` | Speculation acceptance | `specId` |

### Message Enrichment

Each message written to the transcript is enriched with metadata:

```javascript
{
    uuid: "generated-uuid",
    parentUuid: "parent-message-uuid",
    logicalParentUuid: "logical-parent-uuid",
    isSidechain: false,
    teamName: "team-name-if-applicable",
    agentName: "agent-name",
    userType: "external|internal",
    cwd: "/current/working/directory",
    sessionId: "session-uuid",
    version: "2.1.76",
    gitBranch: "current-branch",
    slug: "project-slug",
    timestamp: 1711234567890
}
```

---

## SessionPersistence Class (`ITq`)

### Class Overview (chunks.174.mjs:1240-1654)

The `SessionPersistence` class is the central I/O manager for session transcripts. It is a singleton accessed via `Jz()` (`getSessionPersistence`).

### Instance Fields

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `currentSessionTag` | string/null | null | Session tag for filtering |
| `currentSessionTitle` | string/null | null | Custom session title |
| `currentSessionAgentName` | string/null | null | Agent display name |
| `currentSessionAgentColor` | string/null | null | Agent color |
| `currentSessionLastPrompt` | string/null | null | Last prompt text (first 200 chars) |
| `currentSessionAgentSetting` | object/null | null | Agent configuration |
| `currentSessionMode` | string/null | null | Permission mode |
| `currentSessionPrNumber` | number/null | null | Associated PR number |
| `currentSessionPrUrl` | string/null | null | Associated PR URL |
| `currentSessionPrRepository` | string/null | null | Associated PR repository |
| `sessionFile` | string/null | null | Current session file path (lazy) |
| `pendingEntries` | array | [] | Entries queued before file materialization |
| `remoteIngressUrl` | string/null | null | Remote session ingress URL |
| `internalEventWriter` | object/null | null | Internal event stream writer |
| `internalEventReader` | object/null | null | Internal event stream reader |
| `pendingWriteCount` | number | 0 | Count of pending async writes |
| `flushResolvers` | array | [] | Promises waiting for flush completion |
| `writeQueues` | Map | new Map | Per-file write queues |
| `flushTimer` | Timer/null | null | Debounce timer for batch writes |
| `activeDrain` | Promise/null | null | Currently active drain operation |
| `FLUSH_INTERVAL_MS` | number | 100 | Write batch interval (ms) |
| `MAX_CHUNK_BYTES` | number | 104857600 | Max batch size (100MB) |

### Singleton Accessor (`Jz`)

```javascript
// ============================================
// getSessionPersistence - Singleton accessor with exit handler
// Location: chunks.174.mjs:1201-1220
// ============================================

// READABLE (for understanding):
function getSessionPersistence() {
    if (!singleton) {
        singleton = new SessionPersistence();
        if (!exitHandlerRegistered) {
            registerExitHandler(async () => {
                await singleton?.flush();
                try { singleton?.reAppendSessionMetadata(); } catch {}
            });
            exitHandlerRegistered = true;
        }
    }
    return singleton;
}

// Mapping: Jz→getSessionPersistence, ITq→SessionPersistence
```

**Key insight:** The exit handler ensures two critical operations on process exit:
1. **Flush** -- writes any buffered entries to disk
2. **Re-append metadata** -- writes session title/tag/agent info as the final entries in the file, ensuring they are easily extractable by reading from the end

### materializeSessionFile

```javascript
// ============================================
// materializeSessionFile - Lazily creates the session JSONL file
// Location: chunks.174.mjs:1469-1476
// ============================================

// READABLE (for understanding):
materializeSessionFile() {
    if (this.sessionFile) return;  // Already materialized

    // Skip persistence in: test env, cleanup disabled, or explicit disable
    if (shouldSkipPersistence()) return;

    this.sessionFile = ensureCurrentSessionFile();  // Cz() → creates dirs + returns path

    // Flush any entries that were queued before materialization
    for (let entry of this.pendingEntries) {
        this.appendEntry(entry.entry, entry.sessionId);
    }
    this.pendingEntries = [];
}
```

**Why lazy materialization:** Session files are only created when the first real message (user or assistant) is written. This avoids creating empty session files for abandoned sessions or quick-exit scenarios (like `claude --help`).

### insertMessageChain -- Core Write Method

```javascript
// ============================================
// insertMessageChain - Persists a chain of conversation messages
// Location: chunks.174.mjs:1477-1549
// ============================================

// READABLE (for understanding):
insertMessageChain(messages, isSidechain, agentId, parentUuid, teamContext) {
    // Materialize session file on first user/assistant message
    let hasRealMessage = messages.some(m => m.type === "user" || m.type === "assistant");
    if (hasRealMessage && !this.sessionFile) {
        this.materializeSessionFile();
    }

    for (let message of messages) {
        // Enrich message with metadata
        let enriched = {
            ...message,
            parentUuid: parentUuid,
            logicalParentUuid: message.logicalParentUuid,
            isSidechain: isSidechain,
            teamName: teamContext?.teamName,
            agentName: teamContext?.agentName,
            userType: message.isMeta ? "internal" : "external",
            cwd: getCwd(),
            sessionId: getSessionId(),
            version: getVersion(),
            gitBranch: getCurrentGitBranch(),
            slug: getProjectSlug(),
            timestamp: Date.now()
        };

        // Track last prompt for session list display
        if (message.type === "user" && !message.isMeta) {
            let text = extractTextContent(message.content);
            if (text) this.currentSessionLastPrompt = text.slice(0, 200);
        }

        // Route to appropriate write target
        this.appendEntry(enriched, getSessionId());

        // Update parent chain for next message
        parentUuid = enriched.uuid;
    }
}
```

**Key algorithm: Parent chain tracking**

Each message records its `parentUuid`, forming a linked list (tree for branching conversations). When writing a chain of messages, each subsequent message's `parentUuid` is set to the previous message's `uuid`. This enables:
- **Transcript reconstruction**: Walking the parent chain from any leaf finds the full conversation
- **Branch detection**: Multiple messages with the same `parentUuid` indicate branching
- **Sidechain isolation**: Subagent conversations are marked with `isSidechain: true`

### appendEntry -- Write Routing

```javascript
// ============================================
// appendEntry - Routes entries to appropriate write queues
// Location: chunks.174.mjs:1551-1600
// ============================================

// READABLE (for understanding):
appendEntry(entry, sessionId) {
    // Metadata entries go directly to session file
    if (isMetadataType(entry.type)) {
        this.enqueueWrite(this.sessionFile, entry);
        return;
    }

    // Message entries: check UUID uniqueness
    if (entry.uuid && isUuidAlreadySeen(sessionId, entry.uuid)) {
        return;  // Deduplicate
    }
    markUuidSeen(sessionId, entry.uuid);

    // Write to remote if applicable
    if (this.remoteIngressUrl) {
        sendToRemote(this.remoteIngressUrl, entry);
    }

    // Sidechain messages with agentId → separate subagent file
    if (entry.isSidechain && entry.agentId) {
        let subagentPath = getSubagentFilePath(entry.agentId);
        this.enqueueWrite(subagentPath, entry);
    }

    // All messages also go to main session file
    this.enqueueWrite(this.sessionFile, entry);
}
```

**Key decision: UUID deduplication**

Messages are deduplicated by UUID within a session. This prevents double-writes that could occur when:
- The same message is processed through multiple code paths
- A resume operation replays messages that were already persisted

### Write Batching System

The write system uses a three-stage pipeline for performance:

```
enqueueWrite(path, entry)  →  scheduleDrain()  →  drainWriteQueue()
      │                            │                       │
      ▼                            ▼                       ▼
  Per-file queue          100ms debounce timer     Batch JSONL append
  (Map<path, entry[]>)                             (up to 100MB per batch)
```

```javascript
// ============================================
// enqueueWrite - Adds an entry to a per-file write queue
// Location: chunks.174.mjs:~1580
// ============================================

// READABLE:
enqueueWrite(filePath, entry) {
    if (!this.writeQueues.has(filePath)) {
        this.writeQueues.set(filePath, []);
    }
    this.writeQueues.get(filePath).push(entry);
    this.pendingWriteCount++;
    this.scheduleDrain();
}
```

```javascript
// ============================================
// scheduleDrain - Debounced trigger for batch writes
// Location: chunks.174.mjs:~1590
// ============================================

// READABLE:
scheduleDrain() {
    if (this.flushTimer) return;  // Already scheduled
    this.flushTimer = setTimeout(() => {
        this.flushTimer = null;
        this.drainWriteQueue();
    }, this.FLUSH_INTERVAL_MS);  // 100ms default
}
```

```javascript
// ============================================
// drainWriteQueue - Batches and writes all queued entries to disk
// Location: chunks.174.mjs:~1600
// ============================================

// READABLE:
async drainWriteQueue() {
    if (this.activeDrain) return;  // Prevent concurrent drains
    this.activeDrain = (async () => {
        for (let [filePath, entries] of this.writeQueues) {
            if (entries.length === 0) continue;

            // Batch entries up to MAX_CHUNK_BYTES
            let batch = [];
            let batchSize = 0;
            while (entries.length > 0 && batchSize < this.MAX_CHUNK_BYTES) {
                let entry = entries.shift();
                let line = JSON.stringify(entry) + "\n";
                batch.push(line);
                batchSize += Buffer.byteLength(line);
                this.pendingWriteCount--;
            }

            // Atomic append to file
            await mkdir(dirname(filePath), { recursive: true });
            await appendFile(filePath, batch.join(""), { mode: 0o600 });
        }

        // Resolve any pending flush promises
        for (let resolver of this.flushResolvers) resolver();
        this.flushResolvers = [];
    })();
    await this.activeDrain;
    this.activeDrain = null;

    // If more entries accumulated during drain, schedule another
    if (this.pendingWriteCount > 0) this.scheduleDrain();
}
```

**Why this approach:**
1. **100ms batching** reduces filesystem syscalls -- instead of one write per message, multiple messages are combined into a single `appendFile` call
2. **Per-file queues** allow the main session file and subagent files to be written independently
3. **100MB chunk limit** prevents memory exhaustion on very large batches
4. **Mode 0o600** (owner read/write only) secures transcript files
5. **Non-blocking drain** -- the `activeDrain` guard prevents concurrent drain operations that could cause write ordering issues

### reAppendSessionMetadata

```javascript
// ============================================
// reAppendSessionMetadata - Writes session metadata to end of file
// Location: chunks.174.mjs:1343-1410
// ============================================

// READABLE (for understanding):
reAppendSessionMetadata(force = false) {
    if (!this.sessionFile) return;

    // On non-forced calls, check if user set a custom title (preserve it)
    if (!force) {
        let existingTitle = readTailOfFile(this.sessionFile, TAIL_BYTES);
        if (existingTitle?.customTitle) {
            this.currentSessionTitle = existingTitle.customTitle;
        }
    }

    // Write all metadata entries
    let entries = [];
    if (this.currentSessionTitle) entries.push({ type: "custom-title", title: this.currentSessionTitle });
    if (this.currentSessionLastPrompt) entries.push({ type: "last-prompt", text: this.currentSessionLastPrompt });
    if (this.currentSessionTag) entries.push({ type: "tag", tag: this.currentSessionTag });
    if (this.currentSessionAgentName) entries.push({ type: "agent-name", name: this.currentSessionAgentName });
    if (this.currentSessionAgentColor) entries.push({ type: "agent-color", color: this.currentSessionAgentColor });
    if (this.currentSessionAgentSetting) entries.push({ type: "agent-setting", setting: this.currentSessionAgentSetting });
    if (this.currentSessionMode) entries.push({ type: "mode", mode: this.currentSessionMode });
    if (this.currentSessionPrNumber) entries.push({ type: "pr-link", number: this.currentSessionPrNumber, url: this.currentSessionPrUrl, repository: this.currentSessionPrRepository });

    for (let entry of entries) {
        this.enqueueWrite(this.sessionFile, entry);
    }
}
```

**Key insight:** Metadata is written at the *end* of the file. This is a deliberate design choice that enables **fast metadata extraction** -- to display a session in the resume picker, only the last few KB of the file need to be read (tail read), rather than parsing the entire multi-MB transcript.

### removeMessageByUuid

```javascript
// ============================================
// removeMessageByUuid - Removes a message from the transcript file
// Location: chunks.174.mjs:1413-1467
// ============================================

// READABLE (for understanding):
removeMessageByUuid(uuid) {
    if (!this.sessionFile) return;

    // Fast path: read last N bytes, find UUID, truncate
    let tailContent = readTailBytes(this.sessionFile, TAIL_READ_SIZE);
    let uuidIndex = tailContent.lastIndexOf(uuid);
    if (uuidIndex >= 0) {
        // Find line boundaries, truncate just that line
        let lineStart = tailContent.lastIndexOf("\n", uuidIndex);
        let lineEnd = tailContent.indexOf("\n", uuidIndex);
        truncateAndRewrite(this.sessionFile, lineStart, lineEnd);
        return;
    }

    // Slow path: read entire file, filter out matching line, rewrite
    let allLines = readFileSync(this.sessionFile, "utf-8").split("\n");
    let filtered = allLines.filter(line => !line.includes(uuid));
    writeFileSync(this.sessionFile, filtered.join("\n"));
}
```

**Why two paths:** The fast path handles the common case (removing a recent message near the end of the file) without reading the entire file. The slow path is a fallback for messages deep in history.

---

## Transcript Parsing (`u_6`)

### parseTranscriptFile (chunks.174.mjs:2394)

**What it does:** Parses a `.jsonl` transcript file into structured data with all metadata maps.

**How it works:**

```
Input: Raw JSONL file bytes
  │
  ▼
Step 1: Size check (> CjA bytes?)
  │                    │
  YES                  NO
  │                    │
  ▼                    ▼
Step 2a: Find          Step 2b: Parse
compaction boundary    full file
(F81)                  (cx)
  │
  ▼
Step 3: Pre-boundary
metadata scan (z_z)
  │
  ▼
Step 4: Post-boundary
full parse (cx)
  │
  ▼
Step 5: Merge metadata
from both phases
  │
  ▼
Step 6: Leaf detection
(find messages not
referenced as parentUuid)
  │
  ▼
Step 7: Cycle detection
(walk parent chains,
report cycles via telemetry)
  │
  ▼
Step 8: Post-processing
(ozz - handle preserved
segments from compaction)
  │
  ▼
Output: {
  messages: Map<uuid, message>,
  summaries, customTitles, tags,
  agentNames, agentSettings,
  fileHistorySnapshots,
  contentReplacements,
  leafUuids: Set
}
```

**Key optimization: Pre-compact skip**

For large transcript files (> `CjA` bytes), the parser finds the compaction boundary -- the point where old messages were summarized. Pre-boundary content is scanned only for metadata entries (titles, tags, etc.), while full message parsing only happens post-boundary. This dramatically reduces parsing time for long-running sessions that have been compacted multiple times.

**Leaf detection algorithm:**
1. Collect all `parentUuid` values into a Set
2. Find messages whose `uuid` is NOT in the parentUuid Set
3. These are "leaf" messages -- the endpoints of conversation branches

**Cycle detection:**
1. From each leaf, walk the parent chain
2. Track visited UUIDs in a Set
3. If a UUID is visited twice, a cycle is detected
4. Cycles are reported via telemetry (`tengu_transcript_cycle_detected`)
5. Cycles are broken by treating the cycled message as a root

### buildTranscriptObject (`Kr8`)

```javascript
// ============================================
// buildTranscriptObject - Constructs structured transcript return
// Location: chunks.174.mjs:2051
// ============================================

// READABLE:
function buildTranscriptObject(messages, value, summary, title, snapshots, tag, fullPath,
                                attributions, agentSetting, replacements) {
    return {
        date: messages[0]?.timestamp,
        messages: messages,
        fullPath: fullPath,
        value: value,
        created: messages[0]?.timestamp,
        modified: messages[messages.length - 1]?.timestamp,
        firstPrompt: extractFirstUserPrompt(messages),
        messageCount: messages.length,
        isSidechain: messages.some(m => m.isSidechain),
        teamName: messages[0]?.teamName,
        agentName: agentSetting?.agentName,
        agentSetting: agentSetting,
        leafUuid: messages[messages.length - 1]?.uuid,
        summary: summary,
        customTitle: title,
        tag: tag,
        fileHistorySnapshots: snapshots,
        attributionSnapshots: attributions,
        contentReplacements: replacements,
        gitBranch: messages[0]?.gitBranch,
        projectPath: extractProjectPath(fullPath)
    };
}
```

---

## Session Listing for Resume Picker

### Fast Session Enumeration

Session listing uses a two-phase approach for performance:

**Phase 1: Stat-based sorting** -- `jS1(dirs, enrichCount)`
- Reads all `.jsonl` files in project directories
- Sorts by file modification time (most recent first)
- Returns basic metadata (path, mtime, size)

**Phase 2: Selective enrichment** -- `m_6(sessionLogs)`
- For the top N sessions (those visible in the picker), reads head and tail of each file
- Head read extracts: first message timestamp, first user prompt
- Tail read extracts: custom title, AI title, tag, agent name, last prompt, PR link
- This avoids full parsing of every session file

**Key insight:** This two-phase approach means listing 1000 sessions only requires `stat()` calls for all files but actual file reading for only the visible subset (typically 10-20). This keeps the resume picker responsive even with thousands of session files.

### searchSessionsByName (`GF`)

```javascript
// ============================================
// searchSessionsByName - Searches sessions by custom title
// Location: chunks.174.mjs:2328
// ============================================

// READABLE:
async function searchSessionsByName(searchTerm, options = {}) {
    let allSessions = await getAllSessionLogs();
    let matches = [];

    for (let session of allSessions) {
        let title = session.customTitle || session.aiTitle || "";
        let isMatch = options.exact
            ? title.toLowerCase() === searchTerm.toLowerCase()
            : title.toLowerCase().includes(searchTerm.toLowerCase());

        if (isMatch) {
            // Deduplicate by session ID (keep most recent)
            let existing = matches.find(m => getSessionId(m) === getSessionId(session));
            if (!existing) matches.push(session);
        }
    }

    return matches;
}
```

---

## Cross-Module Integration

### Session Persistence <-> Compaction (07_compact)

When compaction occurs:
1. Old messages are summarized by the LLM
2. A `summary` metadata entry is appended to the transcript
3. Pre-summary messages remain in the file but are skipped during parsing (via the compaction boundary optimization)
4. The `reAppendSessionMetadata()` method is called to preserve titles through compaction

### Session Persistence <-> Remote Sessions (33_remote_sessions)

When `remoteIngressUrl` is set:
1. Every message written via `appendEntry` is also sent to the remote endpoint
2. Remote session title is synced via PATCH API
3. On reconnection, the full message history is pre-synced before sending new messages

### Session Persistence <-> System Reminders (04_system_reminder)

Session metadata (title, tag, agent info) is used by system reminder producers to provide context in prompts. The `last-prompt` metadata type enables the system to reference what the user last asked about.

### Session Persistence <-> File History (for Rewind)

`file-history-snapshot` entries record file states at specific points in the conversation. These are used by the `--rewind-files` flag to restore files to a previous state. Snapshots are stored as metadata entries in the JSONL file, tying them to specific message UUIDs.

### Session Persistence <-> Background Agents (26_background_agents)

Background agents write to separate subagent transcript files (`agent-{id}.jsonl`) under the main session's directory. The `isSidechain` flag distinguishes these from main-thread messages. Task state is reflected back to the main session via the `tasks` AppState map.
