# Shell Snapshot: End-to-End Lifecycle (v2.1.112)

> The complete journey of a shell snapshot: from session start through script execution, file verification, cleanup registration, lazy consumption by the Bash tool, and graceful degradation when anything fails.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_06.md](../00_overview/symbol_additions_unit_06.md) - Module symbols added in Unit 06
> - [symbol_index.md](../00_overview/symbol_index.md) - Main v2.1.88→v2.1.112 diff index

Key functions in this document:
- `createAndSaveSnapshot` (UPK) - Top-level snapshot creation orchestrator
- `createBashExecutor` (iPK) - Builds executor; consumes snapshot
- `getSnapshotScript` (KzY) - Generates the script body (deep dive in `snapshot_creation.md`)
- `buildExecCommand` (inside iPK) - Sources snapshot at command time
- `getSpawnArgs` (inside iPK) - Login-shell bypass when snapshot exists
- `registerCleanup` (eq) - Registers async cleanup on process exit
- `pathExists` (a3) - Async config-file existence probe
- `logEvent` (d) - Telemetry sink (`tengu_shell_snapshot_failed`, `tengu_shell_unknown_error`, `tengu_shell_snapshot_error`)

---

## 1. Lifecycle Phases

The snapshot has four distinct phases. Phases 1–3 run **once per session at startup**; phase 4 fires **per Bash tool call** thereafter.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 1  TRIGGER                                                         │
│   Session start → first Bash tool need → createBashExecutor(shellPath)   │
│   The executor immediately calls UPK(shellPath) and stores the Promise. │
│   Execution returns; no await yet.                                       │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE 2  GENERATION                                                      │
│   UPK runs in the background:                                            │
│     • Detect shell type (zsh / bash / sh)                                │
│     • Look up config file (~/.zshrc / ~/.bashrc / ~/.profile)            │
│     • Check config file exists (does not error if missing)               │
│     • mkdir ~/.claude/shell-snapshots (recursive)                        │
│     • Generate unique path: snapshot-{shell}-{ts}-{rand6}.sh             │
│     • Build the snapshot-creation script via getSnapshotScript (KzY)    │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE 3  EXECUTION                                                       │
│   execFile(shellPath, ["-c", "-l", script], {                            │
│       env: {                                                             │
│           ...(CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()),     │
│           SHELL: shellPath,                                              │
│           GIT_EDITOR: "true",                                            │
│           CLAUDECODE: "1"                                                │
│       },                                                                 │
│       timeout: g47 = 10000,        // 10 seconds                         │
│       maxBuffer: 1048576,           // 1 MB                               │
│       encoding: "utf8"                                                   │
│   }, callback)                                                           │
│                                                                          │
│   Callback paths:                                                        │
│     • error  → telemetry "tengu_shell_snapshot_failed", resolve(undef)  │
│     • ok+file → stat-verify size, registerCleanup, resolve(path)       │
│     • ok+nofile → telemetry "tengu_shell_unknown_error", resolve(undef) │
│     • throw → telemetry "tengu_shell_snapshot_error", resolve(undef)    │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE 4  CONSUMPTION (per Bash tool call)                                │
│   buildExecCommand awaits the stored Promise.                            │
│   If the file is missing at command time, the executor falls back to    │
│   the login shell rather than re-creating the snapshot.                  │
│   The command string is assembled with:                                  │
│       source <snapshot> 2>/dev/null || true                              │
│       && <session env>                                                   │
│       && shopt -u extglob || true                                        │
│       && eval '<wrapped-user-command>'                                   │
│       && pwd -P >| <cwdFile>                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

A critical property: **the snapshot Promise is created eagerly, awaited lazily**. This overlaps the ~10-second snapshot generation with TUI startup, model selection, plugin loading, etc. By the time the user types their first Bash-triggering prompt, the snapshot is usually already on disk.

---

## 2. When Is `createAndSaveSnapshot` Triggered?

```javascript
// ============================================
// createBashExecutor - Builds executor, kicks off snapshot promise
// Location: chunks.144.mjs:2147-2212
// ============================================

// ORIGINAL (for source lookup):
async function iPK(q, K) {
    let _, z = K?.skipSnapshot ? Promise.resolve(void 0) : UPK(q).catch((A) => { E(`Failed to create shell snapshot: ${A}`); return }),
        Y;
    return {
        type: "bash",
        shellPath: q,
        detached: !0,
        async buildExecCommand(A, O) { /* ... awaits z ... */ },
        getSpawnArgs(A) { /* ... checks Y ... */ },
        async getEnvironmentOverrides(A, O, w) { /* ... uses _ ... */ }
    }
}

// READABLE (for understanding):
async function createBashExecutor(shellPath, options) {
    let sandboxTmpDir,
        snapshotPromise = options?.skipSnapshot
            ? Promise.resolve(undefined)
            : createAndSaveSnapshot(shellPath).catch((err) => {
                  logForDebugging(`Failed to create shell snapshot: ${err}`);
                  return undefined;
              }),
        cachedSnapshotPath;
    return {
        type: "bash",
        shellPath,
        detached: true,
        async buildExecCommand(userCmd, opts) { /* awaits snapshotPromise */ },
        getSpawnArgs(cmd) { /* skip -l flag if cachedSnapshotPath !== undefined */ },
        async getEnvironmentOverrides(cmd, overrides, ctx) { /* uses sandboxTmpDir */ }
    };
}

// Mapping: iPK→createBashExecutor, UPK→createAndSaveSnapshot, q→shellPath, K→options,
//          z→snapshotPromise, Y→cachedSnapshotPath, _→sandboxTmpDir
```

**What it does:** Returns an executor object the Bash tool can later use to spawn shell commands. Snapshot creation runs in the background; the executor itself is ready immediately.

**How it works:**
1. If `skipSnapshot` is set in options (used for some test paths), resolve to undefined directly.
2. Otherwise call `UPK(shellPath)` immediately. This returns a Promise that resolves to either the snapshot path or `undefined`.
3. Wrap the Promise in `.catch()` so any unexpected rejection (which shouldn't happen — UPK always resolves) becomes `undefined` rather than an unhandled rejection.
4. Store the Promise (`snapshotPromise`) in the executor's closure. It will be awaited later, lazily.

**Why this approach:**
- Eager Promise creation + lazy await is the standard Node.js pattern for overlapping I/O with startup.
- Catching rejections at the assignment site means callers (`buildExecCommand`) only ever see `undefined` vs a real path — no `try/catch` needed at the consumption site.
- The `skipSnapshot` option exists for unit tests and scenarios (e.g., `--print` mode) that don't need shell environment fidelity.

**Key insight:** The executor's `buildExecCommand` is the **only** place the snapshot Promise is awaited. Even after the snapshot resolves, the path is cached in `cachedSnapshotPath` (closure variable) on the first call so subsequent commands don't re-await.

---

## 3. What Is Captured

The snapshot script captures four categories of state from the user's shell config, then appends Claude Code's own injections. See [snapshot_creation.md](./snapshot_creation.md) and [config_file_detection.md](./config_file_detection.md) for full deobfuscation; the summary:

| Category | Bash mechanism | Zsh mechanism | Why |
|----------|----------------|---------------|-----|
| Functions | `declare -F` names → `declare -f` body → base64 → `eval $(... | base64 -d)` | `typeset +f` names → direct `typeset -f` write | Bash function bodies often contain unescapable characters; base64 round-trip is safer. Zsh's `typeset -f` output is self-quoting. |
| Filtered completions | `grep -vE '^_[^_]'` | Same | Single-underscore-prefixed functions like `_git`, `_ssh` are completion handlers — bulky and unnecessary. Double-underscore helpers like `__pyenv_init` are kept. |
| Shell options | `shopt -p` + `set -o ... \| grep "on"` + force `shopt -s expand_aliases` | `setopt \| sed 's/^/setopt /'` | bash needs `expand_aliases` explicitly forced on because non-interactive bash disables it by default |
| Aliases | `alias \| sed ...` (filtered `winpty` on Windows) | Same | Re-emitted as `alias -- name='value'` so names starting with `-` are not parsed as flags |
| Tool injections | rg fallback (if not on PATH), find/grep shadows (if embedded), bq shadow (placeholder), PATH export | Same | Ensures Claude Code's tools work regardless of what the user has installed |

The 1000-line caps on `shopt -p`, `set -o`, `setopt`, and `alias` are safety limits — bizarre configs with thousands of aliases get clipped rather than producing pathological snapshots.

---

## 4. How the Snapshot Is Stored

### Path Construction

```javascript
// ORIGINAL:
let A = Date.now(),
    O = Math.random().toString(36).substring(2, 8),
    w = F47(A7(), "shell-snapshots");
let $ = F47(w, `snapshot-${K}-${A}-${O}.sh`);

// READABLE:
const timestamp = Date.now();
const randomId = Math.random().toString(36).substring(2, 8);   // 6 alphanumeric chars
const snapshotsDir = path.join(getClaudeConfigHomeDir(), "shell-snapshots");
const snapshotPath = path.join(snapshotsDir, `snapshot-${shellType}-${timestamp}-${randomId}.sh`);
```

Examples on a typical Linux/macOS install:

```
~/.claude/shell-snapshots/snapshot-zsh-1715731234567-a1b2c3.sh
~/.claude/shell-snapshots/snapshot-bash-1715731234890-d4e5f6.sh
```

Why both timestamp **and** random suffix? The timestamp alone has millisecond resolution, but two sessions started within the same millisecond (rare but possible under aggressive automation) would collide. The 6-char base36 random suffix gives ~2 billion additional combinations per millisecond.

### Directory Creation

```javascript
await i_Y(w, { recursive: !0 });   // i_Y = mkdir (from fs/promises)
```

`recursive: true` is essential because `~/.claude/` may exist but `shell-snapshots/` underneath may not. Without recursive, a first-run install would error.

---

## 5. Cleanup Registration

When the snapshot is successfully created and verified, a cleanup callback is registered:

```javascript
// ORIGINAL:
if (M !== void 0) E(`Shell snapshot created successfully (${M} bytes)`), eq(async () => {
    try {
        await V8().unlink($), E(`Cleaned up session snapshot: ${$}`)
    } catch (P) {
        E(`Error cleaning up session snapshot: ${P}`)
    }
}), _($);

// READABLE:
if (snapshotSize !== undefined) {
    logForDebugging(`Shell snapshot created successfully (${snapshotSize} bytes)`);
    registerCleanup(async () => {
        try {
            await getFsImplementation().unlink(snapshotPath);
            logForDebugging(`Cleaned up session snapshot: ${snapshotPath}`);
        } catch (err) {
            logForDebugging(`Error cleaning up session snapshot: ${err}`);
        }
    });
    resolve(snapshotPath);
}
```

**Why a custom registry instead of `process.on('exit')`?**
- `eq` (the `registerCleanup` from `cleanupRegistry`) supports **async** callbacks. Node's built-in `process.on('exit')` only allows synchronous handlers.
- The registry also fires on `SIGINT`, `SIGTERM`, and the normal `process.exit()` paths, giving more reliable cleanup than the bare exit event.
- Unlink failures are swallowed with a debug log — at worst, `~/.claude/shell-snapshots/` accumulates files (which is preferable to crashing on exit).

**Side effect:** Snapshots from sessions that crashed without firing cleanup hooks (kill -9, OS reboot, OOM) will pile up over time. Claude Code doesn't currently sweep stale entries; users can manually clean them.

---

## 6. How the Snapshot Is Loaded into the Bash Tool

```javascript
// ============================================
// buildExecCommand - Source snapshot, assemble command pipeline
// Location: chunks.144.mjs:2157-2191 (excerpt; full body in snapshot_creation.md)
// ============================================

// ORIGINAL (excerpt):
async buildExecCommand(A, O) {
    let w = await z;
    if (w) try { await AzY(w) } catch {
        E(`Snapshot file missing, falling back to login shell: ${w}`), w = void 0
    }
    Y = w;
    // ...
    let D = [];
    if (w) {
        let v = y1() === "windows" ? sX(w) : w;
        D.push(`source ${A5([v])} 2>/dev/null || true`)
    }
    // ... session env, BUN_OPTIONS, extglob, eval, pwd ...
    let f = D.join(" && ");
    return { commandString: f, cwdFilePath: X }
}

// READABLE (excerpt):
async buildExecCommand(userCommand, opts) {
    let snapshotPath = await snapshotPromise;
    if (snapshotPath) {
        try {
            await AzY(snapshotPath);  // access/stat probe
        } catch {
            logForDebugging(`Snapshot file missing, falling back to login shell: ${snapshotPath}`);
            snapshotPath = undefined;
        }
    }
    cachedSnapshotPath = snapshotPath;
    // ...
    let parts = [];
    if (snapshotPath) {
        let normalized = getPlatform() === "windows" ? toCygwinPath(snapshotPath) : snapshotPath;
        parts.push(`source ${shellQuote([normalized])} 2>/dev/null || true`);
    }
    // ...
    return { commandString: parts.join(" && "), cwdFilePath };
}
```

**Three changes from earlier versions worth highlighting:**

1. **Recreation removed.** In v2.1.76 and v2.1.88, if the snapshot was missing at command time, the executor would call `RN8(shellPath)` again to recreate it. In v2.1.112 the missing-file branch sets `snapshotPath = undefined` and falls through to the login-shell path (via `getSpawnArgs`). Less code, more predictable timing — but also means a session that loses its snapshot mid-run pays the per-command login cost for the rest of the session.

2. **`|| true` safety.** The source line is `source ${path} 2>/dev/null || true`. If the snapshot file is corrupt, half-written, or has a syntax error, the user's command still runs (just without the snapshot). Earlier versions used bare `source` which would abort the entire command chain via `&&` on snapshot failure.

3. **Windows path normalization.** The `sX` helper (cygpath equivalent) converts a Windows path to a Cygwin-style path before passing it to `bash -c`. Without this, paths like `C:\Users\...` would be misparsed by bash. (The check uses `getPlatform()` from `y1()`.)

---

## 7. Login-Shell Bypass

```javascript
// ORIGINAL:
getSpawnArgs(A) {
    let O = Y !== void 0;
    if (O) E("Spawning shell without login (-l flag skipped)");
    return ["-c", ...O ? [] : ["-l"], A]
}

// READABLE:
getSpawnArgs(commandString) {
    let hasSnapshot = cachedSnapshotPath !== undefined;
    if (hasSnapshot) logForDebugging("Spawning shell without login (-l flag skipped)");
    return ["-c", ...(hasSnapshot ? [] : ["-l"]), commandString];
}
```

**What it does:** Returns the argv array for spawning the shell. If a snapshot exists, omits the `-l` (login) flag.

**Why this matters:**
- Login mode runs the full login init chain (`/etc/profile`, `~/.bash_profile`, `~/.profile`, etc.).
- The snapshot already captures the post-init state, so re-running init would be redundant and slow.
- Skipping `-l` typically saves 150–400 ms per command on a typical macOS/Linux setup.

For a 30-minute coding session with 100 Bash tool calls, this optimization saves 15–40 seconds of accumulated startup time.

---

## 8. Failure Modes & Telemetry

`UPK` resolves the Promise rather than rejecting, so callers never need `.catch()`. The resolution value distinguishes outcomes:

| Outcome | Resolved value | Telemetry | Recovery |
|---------|----------------|-----------|----------|
| `execFile` returned an error | `undefined` | `tengu_shell_snapshot_failed` with `{stderr_length, has_error_code, error_signal_number, error_killed}` | Spawn with `-l` flag |
| `execFile` succeeded but snapshot file missing | `undefined` | `tengu_shell_unknown_error` (empty payload) | Spawn with `-l` flag |
| Synchronous `throw` in setup | `undefined` | `tengu_shell_snapshot_error` (empty payload) | Spawn with `-l` flag |
| Snapshot file missing at command time | (already cached as undefined) | `Snapshot file missing, falling back to login shell` debug log | Spawn with `-l` flag |
| Success | snapshot path | (none) | Source snapshot, skip `-l` |

**Failure telemetry detail:**

```javascript
// On execFile error, before resolve(undefined):
let P = M?.signal ? QU8.constants.signals[M.signal] : void 0;   // Signal name → number
d("tengu_shell_snapshot_failed", {
    stderr_length: X?.length || 0,
    has_error_code: !!M?.code,
    error_signal_number: P,
    error_killed: M?.killed
});
```

The signal-name-to-number conversion via `os.constants.signals` lets the telemetry pipeline deal with structured numeric data rather than free-form signal strings. The four payload fields cover the four common failure shapes:
- `error_killed: true` + `error_signal_number: 15` → SIGTERM, likely the 10-second timeout
- `error_killed: true` + `error_signal_number: 9` → SIGKILL, often OOM or external kill
- `has_error_code: true` → shell exited non-zero (likely a syntax error in user's `.bashrc`)
- `stderr_length > 0` → diagnostic available; the actual stderr text is logged via `logForDebugging`, not telemetry

**Verbose diagnostic logging on failure:**

```
Shell snapshot creation failed: <error message>
Error details:
  - Error code: <code>
  - Error signal: <signal>
  - Error killed: <killed>
  - Shell path: <shellPath>
  - Config file: <configFile>
  - Config file exists: <bool>
  - Working directory: <cwd>
  - Claude home: <claudeHome>
Full snapshot script:
<entire script body>
stdout output (<n> chars):
<stdout>
stderr output (<n> chars):
<stderr>
```

The full script body is logged because reproducing snapshot failures requires the exact script that was executed — config files differ wildly across systems. With this verbose log, support can hand the user a one-liner: copy the logged script, paste into a fresh shell, observe the failure directly.

---

## 9. Environment Variables Set During Snapshot Creation

| Variable | Value | Why |
|----------|-------|-----|
| `SHELL` | The shell binary path being snapshotted | Ensures the spawned shell self-identifies correctly; some user configs branch on `$SHELL` |
| `GIT_EDITOR` | `"true"` | Prevents `git` invocations in the user's config (e.g., a `gst='git status'` alias loading `git` lazily) from trying to spawn an editor and hanging |
| `CLAUDECODE` | `"1"` | Sentinel for user configs to detect Claude Code and skip interactive-only setup (animated banners, prompts, etc.) |
| `(everything else)` | Inherited from parent process via `subprocessEnv()` | Unless `CLAUDE_CODE_DONT_INHERIT_ENV` is truthy, in which case env starts empty |

The `CLAUDE_CODE_DONT_INHERIT_ENV` escape hatch is intended for fully reproducible CI environments where parent process env vars (e.g., `NODE_OPTIONS`, `PATH`) shouldn't leak into the user's `.bashrc` execution.

---

## 10. Complete Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          T = 0  (session start)                          │
│                                                                          │
│  Claude CLI starts → detectShell finds /bin/bash                         │
│                                                                          │
│  createBashExecutor("/bin/bash") called                                  │
│      │                                                                   │
│      └──► UPK("/bin/bash") called (NOT awaited)                          │
│           Returns Promise; execution returns to caller                   │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
        ┌─────────────────────────┴─────────────────────────┐
        │                                                   │
        ▼                                                   ▼
┌──────────────────────┐                          ┌──────────────────────┐
│ T = 0..N  (sync)     │                          │ T = 0..10s  (async)  │
│                      │                          │                      │
│ Other startup work:  │                          │ UPK runs:            │
│   • TUI init         │                          │   • detect shell type│
│   • Load plugins     │                          │   • lookup config    │
│   • Read settings    │                          │   • mkdir -p         │
│   • Select model     │                          │   • build script via │
│   • Show prompt      │                          │     KzY              │
│                      │                          │   • execFile spawn   │
│ Returns executor obj │                          │   • timeout 10s      │
│                      │                          │   • stat verify      │
└──────────────────────┘                          │   • register cleanup │
                                                  │   • resolve(path) or │
                                                  │     resolve(undef)   │
                                                  └──────────────────────┘
                                                              │
                                                              │ Promise z settled
                                                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                T = N+1  (first Bash tool call)                           │
│                                                                          │
│  executor.buildExecCommand(userCmd, opts)                                │
│      │                                                                   │
│      ├──► await snapshotPromise                                          │
│      │    (already settled — returns immediately)                        │
│      │                                                                   │
│      ├──► AzY(snapshotPath)   verify file still exists                   │
│      │                                                                   │
│      ├──► assemble command parts:                                        │
│      │      ["source <snapshot> 2>/dev/null || true",                    │
│      │       "<sessionEnv>",                                             │
│      │       "[BUN_OPTIONS export if remote]",                           │
│      │       "shopt -u extglob 2>/dev/null || true",                     │
│      │       "eval '<wrapped-cmd>'",                                     │
│      │       "pwd -P >| <cwdFile>"]                                      │
│      │                                                                   │
│      └──► return { commandString: parts.join(" && "), cwdFilePath }     │
│                                                                          │
│  executor.getSpawnArgs(commandString)                                    │
│      └──► ["-c", commandString]   (no -l)                                │
│                                                                          │
│  child_process.spawn("/bin/bash", ["-c", commandString], ...)            │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                T = N+M  (session end)                                    │
│                                                                          │
│  registerCleanup callback fires:                                         │
│      await getFsImplementation().unlink(snapshotPath)                    │
│                                                                          │
│  ~/.claude/shell-snapshots/ cleanup-on-shutdown unlink                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Decision Summary

| Decision | Choice | Trade-off |
|----------|--------|-----------|
| Capture once vs. re-source each time | Capture once | 10s one-time cost vs. 200–500 ms × N per-command cost |
| Eager or lazy snapshot Promise | Eager creation, lazy await | Overlap with startup work vs. wasted compute if no Bash tool is ever used |
| Recreate on missing file mid-session | Removed in v2.1.112 | Simpler control flow, no `RN8` retry path; accept degraded performance after corruption |
| Source with `|| true` | Always | Snapshot failure no longer breaks the command; user gets degraded fidelity instead of hard error |
| Skip `-l` when snapshot exists | Yes | 150–400 ms saved per command; relies on snapshot being complete |
| Resolve with undefined vs. reject | Resolve | Callers never need `.catch`; failure path is a single `if (snapshotPath)` |
| Telemetry granularity | Failure-shape categories (`failed` / `unknown_error` / `error`) | Aggregate failure rate without leaking user content |
| Random suffix in filename | 6-char base36 | ~2B combos per ms — safe against same-ms collisions |
| Cleanup mechanism | Custom `registerCleanup` registry | Async support, multi-signal coverage; downside: dies with the process |
