# ~/.claude Directory Structure Deep Analysis

> Source-level reverse engineering of every subdirectory under `~/.claude/`, their purpose, management functions, and lifecycle.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `getClaudeHome` (c8) - Returns the `~/.claude` base directory (memoized)
- `getProjectsDir` (sb) - Returns `~/.claude/projects`
- `getPlansDirectory` (t2) - Returns plans directory (configurable)
- `getTaskListDir` (wR) - Returns task list directory
- `getPluginHome` (eH) - Returns plugin home directory
- `getTelemetryDir` (jo6) - Returns telemetry directory
- `getSessionEnvDir` (m97) - Returns per-session env directory
- `getPasteCacheDir` (LT8) - Returns paste cache directory
- `getBackupDir` (Zo8) - Returns backup directory
- `getSettingsFilePath` (F_) - Returns settings file path by scope
- `getChangelogCachePath` (Dc8) - Returns changelog cache path
- `createShellSnapshot` (RN8) - Creates shell environment snapshot
- `getFileHistoryPath` (zz6) - Returns file history backup path
- `runCleanup` (ERq) - Master cleanup orchestrator

---

## Base Directory Resolution

### getClaudeHome (`c8`)

```javascript
// ============================================
// getClaudeHome - Lazy-evaluated config directory path
// Location: chunks.2.mjs:42-46
// ============================================

// ORIGINAL (for source lookup):
c8 = e1(() => {
    return (process.env.CLAUDE_CONFIG_DIR ?? gAA(enq(), ".claude")).normalize("NFC")
}, () => process.env.CLAUDE_CONFIG_DIR);

// READABLE (for understanding):
configDir = memoize(() => {
    return (process.env.CLAUDE_CONFIG_DIR ?? path.join(homedir(), ".claude")).normalize("NFC")
}, () => process.env.CLAUDE_CONFIG_DIR);  // cache key: env var value

// Mapping: c8→configDir/getClaudeHome, e1→memoize, gAA→path.join, enq→homedir
```

**How it works:**
1. `e1` is a memoization wrapper -- the first function computes the value, the second is the cache key generator
2. Re-evaluates only if `CLAUDE_CONFIG_DIR` env var changes
3. Default path: `~/.claude`
4. NFC normalization ensures consistent Unicode handling on macOS (where filenames can be NFD)

---

## Complete Directory Map

```
~/.claude/
├── settings.json                    # User settings (JSON5, Zod-validated)
├── history.jsonl                    # Command history (append-only, file-locked)
├── mcp-needs-auth-cache.json        # MCP auth state cache (15-min TTL)
├── backups/                         # Config backup files (max 5 per config)
│   ├── .claude.json.backup.{ts}     # Timestamped config backups
│   └── .claude.json.corrupted.{ts}  # Corrupted config preservations
├── cache/                           # General cache
│   └── changelog.md                 # Cached "What's New" content
├── debug/                           # Debug log files
│   ├── {session-id}.txt             # Per-session debug logs
│   └── latest                       # Symlink/current debug log (preserved)
├── downloads/                       # [Not found in v2.1.76 source]
├── file-history/                    # File edit backups for rewind
│   └── {session-id}/               # Per-session backup files
│       └── {backup-filename}        # Original file content before edit
├── paste-cache/                     # Large paste content (SHA256-addressed)
│   └── {hash}.txt                   # Paste content (> 1024 bytes)
├── plans/                           # Plan files (configurable location)
│   ├── {plan-id}.md                 # Plan document
│   └── {plan-id}.output             # Plan execution output
├── plugins/                         # Plugin system (or cowork_plugins/)
│   ├── known_marketplaces.json      # Marketplace registry
│   ├── marketplaces/                # Marketplace metadata
│   ├── plugins/                     # Individual plugin installations
│   ├── cache/                       # Plugin artifact cache
│   │   └── {marketplace}/{name}/{ver}/ # Per-version plugin cache
│   └── */hooks/hooks.json           # Plugin hook definitions
├── projects/                        # Project-scoped session data
│   └── {hashed-cwd}/               # Per-project directory (CWD hash)
│       ├── {session-id}.jsonl       # Session transcript
│       ├── {session-id}-{ts}.cast   # Asciicast recording
│       ├── {session-id}/            # Subagent data
│       │   └── subagents/
│       │       └── agent-{id}.jsonl # Subagent transcript
│       ├── memory/                  # Auto-memory storage
│       │   └── MEMORY.md            # Memory index
│       └── sessions/                # Session metadata
│           └── {session-id}.meta.json
├── session-env/                     # Per-session environment hooks
│   └── {session-id}/               # Per-session directory
│       ├── setup-hook-0.sh          # Setup hooks (run first)
│       └── sessionstart-hook-0.sh   # Session start hooks (run second)
├── sessions/                        # [Legacy? See projects/ for current]
├── shell-snapshots/                 # Ephemeral shell env snapshots
│   └── snapshot-{shell}-{ts}-{rand}.sh
├── tasks/                           # Background task metadata
│   └── {sanitized-list-id}/        # Per-list directory
│       └── {sanitized-task-id}.json # Task JSON files
├── telemetry/                       # Telemetry batch files
│   └── 1p_failed_events.{sid}.{rand}.json  # Failed event batches
└── startup-perf/                    # Startup performance logs
    └── {session-id}.txt             # Per-session startup timing
```

---

## Directory Details

### 1. backups/

**Purpose:** Stores configuration backup files and corrupted config preservations.

**Source:** `chunks.177.mjs:2189-2191`

```javascript
// ============================================
// getBackupDir - Returns the backup directory path
// Location: chunks.177.mjs:2189-2191
// ============================================

// ORIGINAL (for source lookup):
function Zo8() { return tf(c8(), "backups") }

// READABLE (for understanding):
function getBackupDir() { return join(getClaudeHome(), "backups") }

// Mapping: Zo8→getBackupDir, tf→join
```

**Backup creation strategy** (from `saveConfigWithLock` at chunks.177.mjs:2099-2179):

1. **Throttling:** Backups created at most once per 60 seconds to avoid disk fill during rapid config changes
2. **Retention:** Only the 5 most recent backups kept per config file
3. **Naming:** `{config-basename}.backup.{timestamp}` (e.g., `.claude.json.backup.1711234567890`)
4. **Corruption preservation:** `{config-basename}.corrupted.{timestamp}` with content deduplication

**Three-tier backup search** (from `findLatestBackup` at chunks.177.mjs:2193-2211):
1. Centralized `~/.claude/backups/` (current)
2. Legacy same-directory backups (backward compat)
3. Simple `.backup` suffix fallback

**Auth loss protection:** If re-read config is missing auth data that the cache has, the write is refused entirely (addressing GitHub issue #3117).

### 2. cache/

**Purpose:** General-purpose cache directory. Currently only stores changelog content.

**Source:** `chunks.159.mjs:2858-2870`

```javascript
// ============================================
// getChangelogCachePath - Returns cached changelog path
// Location: chunks.159.mjs:2858-2859
// ============================================

// ORIGINAL (for source lookup):
function Dc8() { return HtY(c8(), "cache", "changelog.md") }

// READABLE (for understanding):
function getChangelogCachePath() { return join(getClaudeHome(), "cache", "changelog.md") }

// Mapping: Dc8→getChangelogCachePath
```

The changelog is fetched from a remote endpoint and cached locally for the "What's New" display. Directory is created on demand with `mkdir({ recursive: true })`.

### 3. debug/

**Purpose:** Debug log files, one per session.

**Source:** `chunks.2.mjs:183-184`

```javascript
// READABLE:
function getDebugLogPath() {
    return path.join(getClaudeHome(), "debug", `${getSessionId()}.txt`);
}
```

**Cleanup:** Files older than 30 days are deleted (except the `"latest"` file which is always preserved). See cleanup_system.md.

### 4. file-history/

**Purpose:** File edit backups for the `--rewind-files` feature. Before each file edit, the original content is backed up here.

**Source:** `chunks.135.mjs:2242-2244`

```javascript
// ============================================
// getFileHistoryPath - Returns backup path for a file version
// Location: chunks.135.mjs:2242-2244
// ============================================

// ORIGINAL (for source lookup):
function zz6(A, q) {
    let K = c8();
    return aN1(K, "file-history", q || R1(), A)
}

// READABLE (for understanding):
function getFileHistoryPath(backupFileName, sessionId) {
    let claudeHome = getClaudeHome();
    return join(claudeHome, "file-history", sessionId || getSessionId(), backupFileName)
}

// Mapping: zz6→getFileHistoryPath, A→backupFileName, q→sessionId
```

**Structure:** `~/.claude/file-history/{sessionId}/{backupFileName}`

Files are backed up before edits, preserving original permissions. On session resume, backup files can be copied from the old session directory for continuity. Cleanup removes entire session directories older than 30 days.

### 5. history.jsonl

**Purpose:** User command/prompt history for autocomplete and up-arrow recall.

See [history_management.md](./history_management.md) for detailed analysis.

**Key properties:**
- Append-only JSONL format
- File-locked for concurrent access safety
- Two-tier paste storage (inline < 1024 bytes, hash-addressed for larger)
- Session-first prioritization for project history queries
- Shutdown hook ensures no history loss on exit

### 6. mcp-needs-auth-cache.json

**Purpose:** Tracks which MCP servers need authentication, with a 15-minute TTL.

**Source:** `chunks.169.mjs:1752-1782`

```javascript
// ============================================
// MCP Auth Cache functions
// Location: chunks.169.mjs:1752-1782
// ============================================

// READABLE:
function getAuthCachePath() {                          // Kn8
    return path.join(getClaudeHome(), "mcp-needs-auth-cache.json");
}

function loadAuthCache() {                             // JGq
    if (!cachedAuthData) {
        cachedAuthData = readFile(getAuthCachePath(), "utf-8")
            .then(text => JSON.parse(text))
            .catch(() => ({}));
    }
    return cachedAuthData;
}

async function needsAuth(serverKey) {                  // R3z
    let entry = (await loadAuthCache())[serverKey];
    if (!entry) return false;
    return Date.now() - entry.timestamp < 900000;      // 15-minute TTL
}

function markNeedsAuth(serverKey) {                    // si8
    writeQueue = writeQueue.then(async () => {         // serialized via promise chain
        let cache = await loadAuthCache();
        cache[serverKey] = { timestamp: Date.now() };
        await writeFile(getAuthCachePath(), JSON.stringify(cache));
        cachedAuthData = null;                         // invalidate cache
    }).catch(() => {});
}

function clearAuthCache() {                            // Pw4
    cachedAuthData = null;
    unlink(getAuthCachePath()).catch(() => {});
}

// Mapping: Kn8→getAuthCachePath, JGq→loadAuthCache, R3z→needsAuth, si8→markNeedsAuth, Pw4→clearAuthCache
// Constants: L3z→AUTH_CACHE_TTL (900000ms = 15min)
```

**Key design decisions:**
- **15-minute TTL** (`L3z = 900000`): Auth entries expire, forcing periodic re-attempts
- **Serialized writes** (promise chain): Prevents race conditions from multiple MCP servers
- **Lazy loading with cache invalidation:** Loaded once, invalidated after writes
- **Graceful degradation:** All operations have `.catch(() => {})` -- never crashes

### 7. paste-cache/

**Purpose:** Content-addressed storage for large paste content (> 1024 bytes).

See [history_management.md](./history_management.md) for detailed analysis.

**Key properties:**
- SHA256 hash addressing: `{hash16}.txt` filenames
- Mode 0o600 (owner read/write only)
- Cleaned up by age (files older than 30 days)
- Small pastes (≤ 1024 bytes) stored inline in history.jsonl instead

### 8. plans/

**Purpose:** Plan files for the plan mode feature.

**Source:** `chunks.90.mjs:684-699`

```javascript
// ============================================
// getPlansDirectory - Resolves the plans directory path
// Location: chunks.90.mjs:684-699
// ============================================

// READABLE (for understanding):
getPlansDirectory = memoize(function() {
    let configuredDir = getConfig().plansDirectory;
    let plansDir;
    if (configuredDir) {
        let projectRoot = getProjectRoot();
        let resolvedPath = resolvePath(projectRoot, configuredDir);
        // Security: must be within project root
        if (!resolvedPath.startsWith(projectRoot + pathSep) && resolvedPath !== projectRoot) {
            logError(Error(`plansDirectory must be within project root: ${configuredDir}`));
            plansDir = join(getClaudeHome(), "plans");
        } else {
            plansDir = resolvedPath;
        }
    } else {
        plansDir = join(getClaudeHome(), "plans");
    }
    try { fs().mkdirSync(plansDir) } catch (e) { logError(e) }
    return plansDir;
});

// Mapping: t2→getPlansDirectory, mA→getConfig, G1→getProjectRoot
```

**Key insight:** Plans directory is configurable via `plansDirectory` setting but must be within the project root for security. Falls back to `~/.claude/plans/` if not configured or if validation fails.

**File types:**
- `{plan-id}.md` -- Plan document
- `{plan-id}.output` -- Plan execution output (alphanumeric IDs, max 20 chars)

### 9. plugins/

**Purpose:** Plugin installations, marketplace data, and plugin caches.

**Source:** `chunks.177.mjs:1394-1411`

```javascript
// ============================================
// getPluginHome - Returns the plugin home directory
// Location: chunks.177.mjs:1400-1404
// ============================================

// ORIGINAL (for source lookup):
function eH() {
    let A = process.env.CLAUDE_CODE_PLUGIN_CACHE_DIR;
    if (A) return at(A);
    return wwz(c8(), $wz())
}

// READABLE (for understanding):
function getPluginHome() {
    let envDir = process.env.CLAUDE_CODE_PLUGIN_CACHE_DIR;
    if (envDir) return resolve(envDir);
    return join(getClaudeHome(), getPluginDirName())  // "plugins" or "cowork_plugins"
}

// Mapping: eH→getPluginHome, $wz→getPluginDirName, Owz→"plugins", fNq→"cowork_plugins"
```

**Subdirectory structure:**
- `known_marketplaces.json` -- Registry of known plugin marketplaces
- `marketplaces/` -- Marketplace metadata cache
- `plugins/` -- Individual plugin installations
- `cache/{marketplace}/{name}/{version}/` -- Plugin artifact cache (zip files)
- `*/hooks/hooks.json` -- Plugin hook definitions

**Cowork mode:** When `isCoworkMode()` is true or `CLAUDE_CODE_USE_COWORK_PLUGINS` env var is set, the directory name changes from `plugins` to `cowork_plugins`.

### 10. projects/

**Purpose:** Project-scoped session data, including transcripts, recordings, subagent data, and auto-memory.

**Source:** `chunks.174.mjs:1124-1126`

```javascript
// ============================================
// getProjectsDir - Returns the projects base directory
// Location: chunks.174.mjs:1124-1126
// ============================================

// ORIGINAL (for source lookup):
function sb() { return uN(c8(), "projects") }

// READABLE (for understanding):
function getProjectsDir() { return join(getClaudeHome(), "projects") }

// Mapping: sb→getProjectsDir
```

**Structure:** `~/.claude/projects/{hashed-cwd}/`

The CWD is hashed via `BD()` to create a safe directory name. Contains:
- `{session-id}.jsonl` -- Session transcripts (see session_persistence.md)
- `{session-id}-{timestamp}.cast` -- Asciicast recordings
- `{session-id}/subagents/agent-{id}.jsonl` -- Subagent transcripts
- `memory/` -- Auto-memory storage (MEMORY.md + individual memory files)
- `sessions/{session-id}.meta.json` -- Session metadata (name, createdAt, etc.)

### 11. session-env/

**Purpose:** Per-session environment hook scripts that configure the shell environment for Bash tool execution.

**Source:** `chunks.42.mjs:596-651`

```javascript
// ============================================
// getSessionEnvDir - Creates and returns session-specific env directory
// Location: chunks.42.mjs:596-601
// ============================================

// ORIGINAL (for source lookup):
async function m97() {
    let A = W38(c8(), "session-env", R1());
    return await Q$3(A, { recursive: !0 }), A
}

// READABLE (for understanding):
async function getSessionEnvDir() {
    let dir = pathJoin(getClaudeHome(), "session-env", getSessionId());
    return await mkdir(dir, { recursive: true }), dir
}

// Mapping: m97→getSessionEnvDir, W38→pathJoin, R1→getSessionId, Q$3→mkdir
```

**Hook script loading** (from `loadSessionEnvironment` at chunks.42.mjs:612-651):

```javascript
// READABLE pseudocode:
async function loadSessionEnvironment() {
    if (getPlatform() === "windows") return null;  // Not supported on Windows
    if (cachedSessionEnv !== undefined) return cachedSessionEnv;

    let scripts = [];

    // 1. Load from CLAUDE_ENV_FILE environment variable (global override)
    let envFile = process.env.CLAUDE_ENV_FILE;
    if (envFile) {
        let content = await readFile(envFile, "utf8");
        if (content.trim()) scripts.push(content.trim());
    }

    // 2. Load hook scripts from session-env dir
    let sessionDir = await getSessionEnvDir();
    let hookFiles = (await readdir(sessionDir))
        .filter(f => f.match(/^(setup|sessionstart)-hook-\d+\.sh$/))
        .sort((a, b) => {
            // Sort: "setup" hooks before "sessionstart" hooks
            let aType = a.match(/^(setup|sessionstart)/)[1];
            let bType = b.match(/^(setup|sessionstart)/)[1];
            if (aType !== bType) return aType === "setup" ? -1 : 1;
            // Then by numeric index
            return parseInt(a.match(/(\d+)/)[1]) - parseInt(b.match(/(\d+)/)[1]);
        });

    for (let file of hookFiles) {
        let content = await readFile(pathJoin(sessionDir, file), "utf8");
        if (content.trim()) scripts.push(content.trim());
    }

    cachedSessionEnv = scripts.length > 0 ? scripts.join("\n") : null;
    return cachedSessionEnv;
}

// Mapping: F97→loadSessionEnvironment, bo→cachedSessionEnv
```

**Execution order:** `setup` hooks run first (environment initialization like PATH, env vars), then `sessionstart` hooks (session-specific setup). Both ordered by numeric index within their category.

### 12. shell-snapshots/

**Purpose:** Ephemeral shell environment snapshots captured at session start. These capture the user's shell environment (PATH, aliases, functions, etc.) so that Bash tool commands inherit the correct environment.

**Source:** `chunks.89.mjs:1180-1253`

```javascript
// ============================================
// createShellSnapshot - Creates a shell environment snapshot
// Location: chunks.89.mjs:1180-1253
// ============================================

// READABLE pseudocode:
async function createShellSnapshot(shellPath) {
    let shellType = shellPath.includes("zsh") ? "zsh"
                  : shellPath.includes("bash") ? "bash" : "sh";

    let snapshotDir = join(getClaudeHome(), "shell-snapshots");
    let timestamp = Date.now();
    let randomSuffix = Math.random().toString(36).substring(2, 8);
    let snapshotPath = join(snapshotDir, `snapshot-${shellType}-${timestamp}-${randomSuffix}.sh`);

    await mkdir(snapshotDir, { recursive: true });

    // Generate and execute snapshot script in a login shell
    let script = await generateSnapshotScript(shellPath, snapshotPath, configExists);
    execFile(shellPath, ["-c", "-l", script], {
        env: {
            ...(!process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? process.env : {}),
            SHELL: shellPath,
            GIT_EDITOR: "true",
            CLAUDECODE: "1"
        },
        timeout: SNAPSHOT_TIMEOUT,
        maxBuffer: 1048576  // 1MB
    }, async (err, stdout, stderr) => {
        if (!err) {
            // Register cleanup on exit
            registerCleanup(() => unlink(snapshotPath).catch(() => {}));
            return snapshotPath;
        }
        // On failure: emit telemetry, return undefined
        trackEvent("tengu_shell_snapshot_failed", { shell: shellType, error: err.message });
        return undefined;
    });
}

// Mapping: RN8→createShellSnapshot, EN8→join (path), p54→SNAPSHOT_TIMEOUT
```

**Key characteristics:**
- **Ephemeral:** Cleaned up when session ends via exit handler
- **1MB buffer limit:** Prevents hanging on slow shell init scripts
- **Configurable timeout:** `p54` controls max execution time
- **CLAUDECODE=1 env var:** Allows shell config files to detect Claude Code context

### 13. tasks/

**Purpose:** Background task metadata stored as JSON files.

**Source:** `chunks.84.mjs:1626-1704`

```javascript
// ============================================
// Task directory functions
// Location: chunks.84.mjs:1626-1704
// ============================================

// READABLE:
function sanitizeTaskName(name) { return name.replace(/[^a-zA-Z0-9_-]/g, "-") }
function getTaskListDir(listId) { return join(getClaudeHome(), "tasks", sanitizeTaskName(listId)) }
function getTaskFilePath(listId, taskId) { return join(getTaskListDir(listId), `${sanitizeTaskName(taskId)}.json`) }

async function createTask(listId, taskData) {
    let lockFile = await getLockFilePath(listId);
    let unlock;
    try {
        unlock = await lockfile.lock(lockFile, lockOptions);
        let maxId = await getMaxTaskId(listId);
        let newId = String(maxId + 1);       // Auto-incrementing integer IDs
        let task = { id: newId, ...taskData };
        let filePath = getTaskFilePath(listId, newId);
        await writeFile(filePath, JSON.stringify(task, null, 2));
        notifyChange();
        return newId;
    } finally {
        if (unlock) await unlock();
    }
}

async function readTask(listId, taskId) {
    let filePath = getTaskFilePath(listId, taskId);
    try {
        let content = await readFile(filePath, "utf-8");
        let validated = taskSchema().safeParse(JSON.parse(content));
        return validated.success ? validated.data : null;
    } catch { return null }
}

// Mapping: L06→sanitizeTaskName, wR→getTaskListDir, yF6→getTaskFilePath, aD1→createTask, DB→readTask
```

**Key properties:**
- **Structure:** `~/.claude/tasks/{sanitized-list-id}/{sanitized-task-id}.json`
- **Auto-incrementing IDs:** `getMaxTaskId() + 1`
- **File locking:** Prevents concurrent write conflicts
- **Zod validation:** Task data validated on read
- **Auto-allowed for reading:** Task files under `~/.claude/tasks/` don't need permission prompts

### 14. telemetry/

**Purpose:** Batched telemetry event files for failed event retry.

**Source:** `chunks.176.mjs:2570-2626`

```javascript
// ============================================
// Telemetry directory management
// Location: chunks.176.mjs:2570-2626
// ============================================

// READABLE:
function getTelemetryDir() { return path.join(getClaudeHome(), "telemetry") }

// Batch file path: ~/.claude/telemetry/1p_failed_events.{sessionId}.{randomId}.json
function getCurrentBatchFilePath() {
    return path.join(getTelemetryDir(), `1p_failed_events.${getSessionId()}.${randomStartupId}.json`);
}

async function saveEventsToFile(filePath, events) {
    if (events.length === 0) {
        try { await unlink(filePath) } catch {}   // Clean up empty batch files
    } else {
        await mkdir(getTelemetryDir(), { recursive: true });
        let content = events.map(e => JSON.stringify(e)).join("\n") + "\n";
        await writeFile(filePath, content, "utf8");
    }
}

// Mapping: jo6→getTelemetryDir, lr8→TelemetryExporter class
```

**Key properties:**
- Events written as newline-delimited JSON (NDJSON)
- Random ID in filename prevents conflicts between concurrent sessions
- On startup, old batch files from previous sessions are discovered and retried
- Events sent to `https://api.anthropic.com/api/event_logging/batch`
- Retry: max 8 attempts with exponential backoff (500ms to 30s), max 200 events per batch

### 15. settings.json

**Purpose:** User settings with JSON5 support, Zod validation, and live file watching.

**Source:** `chunks.176.mjs:726-831`

```javascript
// ============================================
// Settings file resolution by scope
// Location: chunks.176.mjs:757-789
// ============================================

// READABLE:
function getSettingsFilePath(scope) {
    switch (scope) {
        case "userSettings":    return join(getClaudeHome(), getSettingsFileName());
            // → ~/.claude/settings.json (or cowork_settings.json)
        case "projectSettings": return join(getCwd(), ".claude", "settings.json");
        case "localSettings":   return join(getCwd(), ".claude", "settings.local.json");
        case "policySettings":  return join(getManagedSettingsDir(), "managed-settings.json");
        case "flagSettings":    return getFlagPath();
    }
}

function readSettings(filePath) {
    let content = readFileSync(resolveSymlink(filePath));
    if (content.trim() === "") return { settings: {}, errors: [] };

    let parsed = parseJSON5(content);               // JSON5 supports comments, trailing commas
    let warnings = checkDeprecations(parsed);       // Deprecation warnings
    let validated = settingsSchema().safeParse(parsed);  // Zod schema validation

    if (!validated.success) {
        return { settings: null, errors: [...warnings, ...formatZodErrors(validated.error)] };
    }
    return { settings: validated.data, errors: warnings };
}

// Mapping: F_→getSettingsFilePath, Ye→readSettings, XD6→getSettingsDir
```

**Settings scope hierarchy (highest to lowest priority):**
1. `policySettings` -- `managed-settings.json` (MDM/admin-managed)
2. `flagSettings` -- Feature flag overrides
3. `localSettings` -- `.claude/settings.local.json` (project-local, gitignored)
4. `projectSettings` -- `.claude/settings.json` (project-level, committed)
5. `userSettings` -- `~/.claude/settings.json` (user-level)

**Live watching:** Uses `chokidar` with 1000ms stability threshold and 500ms poll interval. Changes trigger `ConfigChange` hooks.

### 16. startup-perf/

**Purpose:** Startup performance timing logs.

**Source:** `chunks.2.mjs:352`

```javascript
// READABLE:
function getStartupPerfPath() {
    return path.join(getClaudeHome(), "startup-perf", `${getSessionId()}.txt`);
}
```

---

## Directory Lifecycle Summary

| Directory | Creation | Cleanup Strategy | Cleanup Period |
|-----------|----------|-----------------|----------------|
| backups/ | On config save | Keep latest 5 per config | Immediate pruning |
| cache/ | On changelog fetch | Not cleaned automatically | N/A |
| debug/ | On session start | Delete .txt older than cutoff | 30 days (configurable) |
| file-history/ | On first file edit | Delete session dirs older than cutoff | 30 days (configurable) |
| paste-cache/ | On large paste | Delete files older than cutoff | 30 days (configurable) |
| plans/ | On plan creation | Delete .md older than cutoff | 30 days (configurable) |
| plugins/ | On plugin install | Not cleaned by periodic cleanup | Manual |
| projects/ | On session start | Session .jsonl cleaned by cutoff | 30 days (configurable) |
| session-env/ | On session start | Delete session dirs older than cutoff | 30 days (configurable) |
| shell-snapshots/ | On session start | Deleted on session exit (ephemeral) | Immediate |
| tasks/ | On task creation | Todo files cleaned by cutoff | 30 days (configurable) |
| telemetry/ | On event batch | Deleted after successful send | Per-batch |
| startup-perf/ | On session start | Not cleaned automatically | N/A |

The cleanup period defaults to 30 days, configurable via `cleanupPeriodDays` in settings. See [cleanup_system.md](./cleanup_system.md) for the full cleanup orchestration.
