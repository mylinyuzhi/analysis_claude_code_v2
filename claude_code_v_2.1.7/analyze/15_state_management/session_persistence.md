# Session Persistence (2.1.7)

> Session storage, restore, and teleport functionality
> Enables cross-device session continuity

---

## Overview

Claude Code implements a robust session persistence system supporting:
- **Local Storage** - JSONL files in `~/.cache/claude-code/projects/`
- **Remote Storage** - Sessions API with optimistic locking
- **Teleport** - Resume sessions on different machines via session ID

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Session Persistence Architecture                      │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │  Session State  │
                              │    (Memory)     │
                              └────────┬────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
    ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
    │  Local Storage  │     │  Remote Storage │     │    Teleport     │
    │   (.jsonl)      │     │  (Sessions API) │     │   (Resume)      │
    └────────┬────────┘     └────────┬────────┘     └────────┬────────┘
             │                       │                       │
             ▼                       ▼                       ▼
    ~/.cache/claude-code/    api.claude.ai/         Fetch + Restore
    projects/{hash}/         sessions/              from Remote
    {sessionId}.jsonl
```

---

## Component 1: Session ID Management

### Session ID Generation

**Location:** chunks.1.mjs:2330-2340

```javascript
// ============================================
// Session ID Functions
// Location: chunks.1.mjs:2330-2340
// ============================================

// ORIGINAL (for source lookup):
let g0 = {
  sessionId: Nb0(),  // Nb0 = randomUUID()
  // ...
};

function q0() {
  return g0.sessionId;
}

function wb0() {
  return g0.sessionId = Nb0(), g0.sessionId;
}

function pw(A) {
  if (g0.sessionId = A, process.env.CLAUDE_CODE_SESSION_ID !== void 0)
    process.env.CLAUDE_CODE_SESSION_ID = A;
}

// READABLE (for understanding):
let globalState = {
  sessionId: randomUUID(),  // Generated at startup
  // ...
};

function getSessionId() {
  return globalState.sessionId;
}

function generateNewSessionId() {
  globalState.sessionId = randomUUID();
  return globalState.sessionId;
}

function setSessionId(sessionId) {
  globalState.sessionId = sessionId;
  if (process.env.CLAUDE_CODE_SESSION_ID !== undefined) {
    process.env.CLAUDE_CODE_SESSION_ID = sessionId;
  }
}

// Mapping: g0→globalState, q0→getSessionId, wb0→generateNewSessionId,
//          pw→setSessionId, Nb0→randomUUID
```

---

## Component 2: Local Session Storage

### Session Storage Paths

**Location:** chunks.148.mjs:679-695

```javascript
// ============================================
// Session Storage Path Functions
// Location: chunks.148.mjs:679-695
// ============================================

// READABLE (for understanding):
function getProjectsRoot() {
  // Path: ~/.cache/claude-code/projects
  return path.join(getCacheDir(), "projects");
}

function getCurrentSessionPath() {
  // Path: ~/.cache/claude-code/projects/{projectHash}/{sessionId}.jsonl
  return getSessionPath(getSessionId());
}

function getSessionPath(sessionId) {
  // Path: ~/.cache/claude-code/projects/{projectHash}/{sessionId}.jsonl
  let projectDir = getProjectDir(projectRoot);
  return path.join(projectDir, `${sessionId}.jsonl`);
}

// Mapping: wp→getProjectsRoot, uz→getCurrentSessionPath, Bw→getSessionPath,
//          q0→getSessionId, QV→getProjectDir
```

### Parse Session Log File

**Location:** chunks.148.mjs:1352-1386

```javascript
// ============================================
// parseSessionLogFile - Parse .jsonl into structured data
// Location: chunks.148.mjs:1352-1386
// ============================================

// READABLE (for understanding):
async function parseSessionLogFile(filePath) {
  let messages = new Map();       // uuid → message
  let summaries = new Map();      // leafUuid → summary
  let customTitles = new Map();   // sessionId → title
  let tags = new Map();           // sessionId → tag
  let agentNames = new Map();     // sessionId → name
  let agentColors = new Map();    // sessionId → color
  let fileHistorySnapshots = new Map();
  let attributionSnapshots = new Map();

  try {
    let entries = await readJsonlFile(filePath);

    for (let entry of entries) {
      switch (entry.type) {
        case "user":
        case "assistant":
        case "attachment":
        case "system":
          messages.set(entry.uuid, entry);
          break;
        case "summary":
          if (entry.leafUuid) summaries.set(entry.leafUuid, entry.summary);
          break;
        case "custom-title":
          if (entry.sessionId) customTitles.set(entry.sessionId, entry.customTitle);
          break;
        case "tag":
          if (entry.sessionId) tags.set(entry.sessionId, entry.tag);
          break;
        case "agent-name":
          if (entry.sessionId) agentNames.set(entry.sessionId, entry.agentName);
          break;
        case "agent-color":
          if (entry.sessionId) agentColors.set(entry.sessionId, entry.agentColor);
          break;
        case "file-history-snapshot":
          fileHistorySnapshots.set(entry.messageId, entry);
          break;
        case "attribution-snapshot":
          attributionSnapshots.set(entry.messageId, entry);
          break;
      }
    }
  } catch {}

  // Build leaf UUID set (messages without children)
  let parentUuids = new Set([...messages.values()]
    .map(m => m.parentUuid)
    .filter(p => p !== null));
  let leafUuids = new Set([...messages.keys()].filter(k => !parentUuids.has(k)));

  return {
    messages, summaries, customTitles, tags,
    agentNames, agentColors, fileHistorySnapshots,
    attributionSnapshots, leafUuids
  };
}

// Mapping: Mp→parseSessionLogFile, A→filePath, Q→messages, B→summaries,
//          G→customTitles, Z→tags, Y→agentNames, J→agentColors
```

---

## Component 3: Session Index Management

**Location:** chunks.148.mjs:1595-1648

The session index (`.session_index.json`) stores metadata for all sessions in a project.

```javascript
// ============================================
// Session Index Operations
// Location: chunks.148.mjs:1595-1648
// ============================================

// Index file structure (version 2):
{
  "version": 2,
  "entries": [
    {
      "sessionId": "uuid",
      "fullPath": "/path/to/{sessionId}.jsonl",
      "fileMtime": 1234567890,
      "customTitle": "Optional title",
      "tag": "Optional tag",
      "agentName": "Optional agent name",
      "agentColor": "Optional color"
    }
  ]
}

// READABLE (for understanding):
function loadSessionIndex(projectDir) {
  let indexPath = path.join(projectDir, ".session_index.json");
  let data = JSON.parse(fs.readFileSync(indexPath));

  if (data.version !== SESSION_INDEX_VERSION || !Array.isArray(data.entries)) {
    return null;
  }
  return data;
}

function writeSessionIndex(projectDir, indexData) {
  let indexPath = path.join(projectDir, ".session_index.json");
  let tempPath = indexPath + ".tmp";

  // Atomic write with temp file
  fs.writeFileSync(tempPath, JSON.stringify(indexData, null, 2), {
    encoding: "utf-8",
    flush: true
  });
  fs.renameSync(tempPath, indexPath);  // Atomic rename
}

function updateSessionIndexEntry(projectDir, sessionId, updates) {
  let index = loadSessionIndex(projectDir);
  if (!index) return;

  let entry = index.entries.find(e => e.sessionId === sessionId);
  if (!entry) return;

  // Apply updates
  if (updates.customTitle !== undefined) entry.customTitle = updates.customTitle;
  if (updates.tag !== undefined) entry.tag = updates.tag;
  if (updates.agentName !== undefined) entry.agentName = updates.agentName;
  if (updates.agentColor !== undefined) entry.agentColor = updates.agentColor;

  // Update mtime
  let stats = fs.statSync(entry.fullPath);
  entry.fileMtime = stats.mtimeMs;

  writeSessionIndex(projectDir, index);
}

// Mapping: LP0→loadSessionIndex, $P0→writeSessionIndex,
//          y$7→updateSessionIndexEntry, zP0→SESSION_INDEX_VERSION
```

---

## Component 4: Remote Session Persistence

### Persist to Sessions API

**Location:** chunks.120.mjs:2959-3012

```javascript
// ============================================
// persistSessionToRemote - Main persistence entry point
// Location: chunks.120.mjs:3004-3012
// ============================================

// READABLE (for understanding):
async function persistSessionToRemote(sessionId, messageData, remoteUrl) {
  let jwtToken = getJwtToken();
  if (!jwtToken) {
    log("No session token available");
    telemetry("error", "session_persist_fail_jwt_no_token");
    return false;
  }

  let headers = {
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json"
  };

  return await getSessionPersistenceHandler(sessionId)(messageData, remoteUrl, headers);
}

// Mapping: mu2→persistSessionToRemote, A→sessionId, Q→messageData,
//          B→remoteUrl, G4A→getJwtToken
```

### Persistence with Retry Logic

**Location:** chunks.120.mjs:2965-3002

```javascript
// ============================================
// persistSessionLogEntry - HTTP PUT with retry and optimistic locking
// Location: chunks.120.mjs:2965-3002
// ============================================

// Configuration:
const MAX_RETRIES = 10;       // wK1
const BASE_DELAY_MS = 500;    // Ai5
const MAX_DELAY_MS = 8000;

// UUID tracking per session
const lastUuidMap = new Map();  // LK1: sessionId → lastUuid

// READABLE (for understanding):
async function persistSessionLogEntry(sessionId, messageData, apiUrl, headers) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Add optimistic locking header
      let requestHeaders = { ...headers };
      let lastUuid = lastUuidMap.get(sessionId);
      if (lastUuid) {
        requestHeaders["Last-Uuid"] = lastUuid;
      }

      // HTTP PUT request
      let response = await axios.put(apiUrl, messageData, {
        headers: requestHeaders,
        validateStatus: (status) => status < 500
      });

      // Success
      if (response.status === 200 || response.status === 201) {
        lastUuidMap.set(sessionId, messageData.uuid);
        log(`Successfully persisted session log entry for session ${sessionId}`);
        return true;
      }

      // Conflict (409) - concurrent modification
      if (response.status === 409) {
        if (response.headers["x-last-uuid"] === messageData.uuid) {
          // Already persisted, recover from stale state
          lastUuidMap.set(sessionId, messageData.uuid);
          telemetry("info", "session_persist_recovered_from_409");
          return true;
        }
        // Actual conflict
        telemetry("error", "session_persist_fail_concurrent_modification");
        return false;
      }

      // Unauthorized (401) - token expired
      if (response.status === 401) {
        telemetry("error", "session_persist_fail_bad_token");
        return false;
      }

      log(`Failed to persist: ${response.status} ${response.statusText}`);

    } catch (error) {
      logError(Error(`Error persisting: ${error.message}`));
    }

    // Exhausted retries
    if (attempt === MAX_RETRIES) {
      telemetry("error", "session_persist_error_retries_exhausted", { attempt });
      return false;
    }

    // Exponential backoff: 500ms * 2^(attempt-1), max 8s
    let delay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt - 1), MAX_DELAY_MS);
    log(`Retrying in ${delay}ms…`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  return false;
}

// Mapping: Qi5→persistSessionLogEntry, A→sessionId, Q→messageData,
//          B→apiUrl, G→headers, wK1→MAX_RETRIES, Ai5→BASE_DELAY_MS,
//          LK1→lastUuidMap
```

**Key strategies:**
1. **Optimistic Locking** - `Last-Uuid` header for concurrent modification detection
2. **Exponential Backoff** - 500ms → 1s → 2s → 4s → 8s (capped)
3. **UUID Tracking** - Maintains last persisted UUID per session
4. **409 Recovery** - Handles duplicate requests gracefully

---

## Component 5: Teleport Session Resume

### Teleported Session State

**Location:** chunks.1.mjs:2782-2795

```javascript
// ============================================
// Teleport Session Info
// Location: chunks.1.mjs:2782-2795
// ============================================

// State structure:
teleportedSessionInfo: null | {
  isTeleported: true,
  hasLoggedFirstMessage: false,
  sessionId: string
}

// READABLE (for understanding):
function setTeleportedSessionInfo(sessionInfo) {
  globalState.teleportedSessionInfo = {
    isTeleported: true,
    hasLoggedFirstMessage: false,
    sessionId: sessionInfo.sessionId
  };
}

function getTeleportedSessionInfo() {
  return globalState.teleportedSessionInfo;
}

function markTeleportFirstMessageLogged() {
  if (globalState.teleportedSessionInfo) {
    globalState.teleportedSessionInfo.hasLoggedFirstMessage = true;
  }
}

// Mapping: PdA→setTeleportedSessionInfo, Iq1→getTeleportedSessionInfo,
//          Dq1→markTeleportFirstMessageLogged
```

### Resume Teleport Session

**Location:** chunks.120.mjs:3274-3320

```javascript
// ============================================
// resumeTeleportSession - Main teleport entry point
// Location: chunks.120.mjs:3274-3320
// ============================================

// READABLE (for understanding):
async function resumeTeleportSession(sessionId, progressCallback) {
  log(`Resuming code session ID: ${sessionId}`);

  try {
    // STEP 1: Check authentication (OAuth required, not API key)
    let accessToken = getOAuthToken()?.accessToken;
    if (!accessToken) {
      telemetry("tengu_teleport_resume_error", { error_type: "no_access_token" });
      throw Error("Requires Claude.ai authentication, not API key");
    }

    // STEP 2: Get organization UUID
    let orgUuid = await getOrganizationUuid();
    if (!orgUuid) {
      telemetry("tengu_teleport_resume_error", { error_type: "no_org_uuid" });
      throw Error("Unable to get organization UUID");
    }

    progressCallback?.("validating");

    // STEP 3: Fetch session data and validate repository
    let sessionData = await fetchRemoteSessionData(sessionId);
    let repoValidation = await validateRepository(sessionData);

    switch (repoValidation.status) {
      case "match":
      case "no_repo_required":
        break;  // Continue
      case "not_in_repo":
        throw new TeleportError(`Must run from checkout of ${repoValidation.sessionRepo}`);
      case "mismatch":
        throw new TeleportError(`Must run from ${repoValidation.sessionRepo}, not ${repoValidation.currentRepo}`);
      case "error":
        throw new TeleportError(repoValidation.errorMessage || "Failed to validate repo");
    }

    // STEP 4: Fetch and return session logs
    return await teleportFromSessionsAPI(sessionId, orgUuid, accessToken, progressCallback, sessionData);

  } catch (error) {
    if (error instanceof TeleportError) throw error;
    telemetry("tengu_teleport_resume_error", { error_type: "resume_session_id_catch" });
    throw new TeleportError(error instanceof Error ? error.message : String(error));
  }
}

// Mapping: Yt→resumeTeleportSession, A→sessionId, Q→progressCallback,
//          g4→getOAuthToken, Wv→getOrganizationUuid, xkA→fetchRemoteSessionData,
//          Xq0→validateRepository, uK→TeleportError
```

### Fetch Session Logs from API

**Location:** chunks.120.mjs:3349-3373

```javascript
// ============================================
// teleportFromSessionsAPI - Fetch and filter remote logs
// Location: chunks.120.mjs:3349-3373
// ============================================

// READABLE (for understanding):
async function teleportFromSessionsAPI(sessionId, orgUuid, accessToken, progressCallback, sessionData) {
  let startTime = Date.now();

  try {
    log(`[teleport] Starting fetch for session: ${sessionId}`);
    progressCallback?.("fetching_logs");

    // FETCH: Get session logs from Sessions API
    let fetchStart = Date.now();
    let logs = await fetchSessionLogs(sessionId, accessToken, orgUuid);
    log(`[teleport] Session logs fetched in ${Date.now() - fetchStart}ms`);

    if (logs === null) throw Error("Failed to fetch session logs");

    // FILTER: Keep only conversation messages
    let filterStart = Date.now();
    let messages = logs.filter(entry => isValidSessionMessage(entry) && !entry.isSidechain);
    log(`[teleport] Filtered ${logs.length} entries to ${messages.length} messages in ${Date.now() - filterStart}ms`);

    progressCallback?.("fetching_branch");

    // EXTRACT: Get branch from session data
    let branch = sessionData ? extractBranch(sessionData) : undefined;
    if (branch) log(`[teleport] Found branch: ${branch}`);

    log(`[teleport] Total time: ${Date.now() - startTime}ms`);

    return {
      log: messages,
      branch: branch
    };

  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      telemetry("tengu_teleport_error_session_not_found_404", { sessionId });
      throw new TeleportError(`${sessionId} not found`);
    }
    telemetry("tengu_teleport_resume_error", { error_type: "fetch_failed" });
    throw Error(`Failed to fetch session: ${error.message}`);
  }
}

// Mapping: Vi5→teleportFromSessionsAPI, A→sessionId, Q→orgUuid,
//          B→accessToken, G→progressCallback, Z→sessionData,
//          pu2→fetchSessionLogs, pbA→isValidSessionMessage, Vz0→extractBranch
```

---

## Component 6: Load/Restore Session

### Load or Restore Session

**Location:** chunks.120.mjs:2608-2643

```javascript
// ============================================
// loadOrRestoreSession - Main restore orchestrator
// Location: chunks.120.mjs:2608-2643
// ============================================

// READABLE (for understanding):
async function loadOrRestoreSession(sessionId, logsArray) {
  try {
    let loadedSession = null;
    let messages = null;
    let finalSessionId;

    if (sessionId === undefined) {
      // CASE 1: Load latest session
      loadedSession = await getLatestSession(0);
    }
    else if (logsArray) {
      // CASE 2: Convert API logs to messages
      messages = [];
      for (let entry of await readJsonlFile(logsArray)) {
        if (entry.type === "assistant" || entry.type === "user") {
          let message = convertToInternalFormat(entry);
          if (message) messages.push(message);
        }
        finalSessionId = entry.session_id;
      }
    }
    else if (typeof sessionId === "string") {
      // CASE 3: Load specific session by ID
      loadedSession = await loadSessionFromDisk(sessionId);
      finalSessionId = sessionId;
    }
    else {
      // CASE 4: Already parsed session object
      loadedSession = sessionId;
    }

    if (!loadedSession && !messages) return null;

    if (loadedSession) {
      // Decompress if needed
      if (isCompressed(loadedSession)) {
        loadedSession = await decompressSession(loadedSession);
      }

      if (!finalSessionId) {
        finalSessionId = extractSessionId(loadedSession);
      }

      // Initialize state
      validateSessionStructure(loadedSession);
      if (finalSessionId) setCurrentSession(loadedSession, parseSessionId(finalSessionId));
      initializeEducationState(loadedSession);
      messages = loadedSession.messages;
    }

    // Normalize messages
    messages = normalizeMessages(messages);

    // Append startup messages
    let startupMessages = await getStartupMessages("resume", finalSessionId);
    messages.push(...startupMessages);

    return {
      messages,
      fileHistorySnapshots: loadedSession?.fileHistorySnapshots,
      attributionSnapshots: loadedSession?.attributionSnapshots,
      sessionId: finalSessionId
    };

  } catch (error) {
    logError(error);
    throw error;
  }
}

// Mapping: Zt→loadOrRestoreSession, xu2→getLatestSession, Gq0→loadSessionFromDisk,
//          Gj→isCompressed, Vx→decompressSession, xX→extractSessionId,
//          w71→validateSessionStructure, W71→setCurrentSession, EW1→initializeEducationState
```

### Session Message Validation

**Location:** chunks.148.mjs:675-677

```javascript
// ============================================
// isValidSessionMessage - Filter conversation messages
// Location: chunks.148.mjs:675-677
// ============================================

// READABLE (for understanding):
function isValidSessionMessage(entry) {
  return (
    entry.type === "user" ||
    entry.type === "assistant" ||
    entry.type === "attachment" ||
    entry.type === "system"
  );
}

// Mapping: pbA→isValidSessionMessage, A→entry
```

---

## Key Files

| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.1.mjs:2330-2340 | Session ID functions | q0, wb0, pw, Nb0 |
| chunks.1.mjs:2782-2795 | Teleport session state | PdA, Iq1, Dq1 |
| chunks.120.mjs:2608-2643 | Load/restore session | Zt, xu2, Gq0 |
| chunks.120.mjs:2959-3012 | Remote persistence | mu2, Qi5, uu2 |
| chunks.120.mjs:3274-3373 | Teleport resume | Yt, Vi5 |
| chunks.148.mjs:679-695 | Storage paths | wp, uz, Bw |
| chunks.148.mjs:1352-1386 | Parse session log | Mp |
| chunks.148.mjs:1595-1648 | Session index | LP0, $P0, y$7 |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions:
- `getSessionId` (q0) - Get current session ID
- `generateNewSessionId` (wb0) - Generate new UUID
- `setSessionId` (pw) - Set session ID
- `persistSessionToRemote` (mu2) - Remote persistence entry
- `persistSessionLogEntry` (Qi5) - HTTP PUT with retry
- `resumeTeleportSession` (Yt) - Teleport main entry
- `loadOrRestoreSession` (Zt) - Load from disk/API
- `parseSessionLogFile` (Mp) - Parse .jsonl files
- `isValidSessionMessage` (pbA) - Filter conversation messages

---

## See Also

- [state_interactions.md](./state_interactions.md) - State management
- [../07_compact/](../07_compact/) - Compaction (affects session size)
- [../26_background_agents/](../26_background_agents/) - Background task storage
