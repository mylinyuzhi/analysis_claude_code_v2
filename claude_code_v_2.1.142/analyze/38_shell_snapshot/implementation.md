# Shell Snapshot: End-to-End Lifecycle (v2.1.142)

> The complete journey of a shell snapshot: from session start through script execution, file verification, cleanup registration, retention sweep, lazy consumption by the Bash tool, and graceful degradation when anything fails.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Unit 04 module symbols

Key functions in this document:
- `createAndSaveSnapshot` (`ip7`) — Top-level snapshot creation orchestrator
- `createBashShellProvider` (`$U7`) — Builds executor; consumes snapshot
- `getSnapshotScript` (`Oi_`) — Generates the script body (deep dive in `snapshot_creation.md`)
- `buildExecCommand` (inside `$U7`) — Sources snapshot at command time
- `getSpawnArgs` (inside `$U7`) — Login-shell bypass when snapshot exists
- `registerCleanup` (`CK`) — Registers async cleanup on process exit
- `pathExists` (`H_`) — Async config-file existence probe
- `logEvent` (`d`) — Telemetry sink (`tengu_shell_snapshot_failed`, `tengu_shell_unknown_error`, `tengu_shell_snapshot_error`)
- `cleanupShellSnapshots` (`al5`) — Retention sweep (deep dive in `retention_cleanup.md`)

---

## 1. Lifecycle Phases

The snapshot has five distinct phases. Phases 1–3 run **once per session at startup**; phase 4 fires **per Bash tool call**; phase 5 runs on **session shutdown** and again during the **periodic retention sweep**.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 1  TRIGGER                                                         │
│   Session start → first Bash tool need → createBashShellProvider($U7)   │
│   The executor immediately calls ip7(shellPath) and stores the Promise. │
│   Execution returns; no await yet.                                       │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE 2  GENERATION                                                      │
│   ip7 runs in the background:                                            │
│     • Detect shell type (zsh / bash / sh)                                │
│     • Look up config file (~/.zshrc / ~/.bashrc / ~/.profile)            │
│     • Check config file exists (does not error if missing)               │
│     • mkdir ~/.claude/shell-snapshots (recursive)                        │
│     • Generate unique path: snapshot-{shell}-{ts}-{rand6}.sh             │
│     • Build the snapshot-creation script via getSnapshotScript (Oi_)    │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE 3  EXECUTION                                                       │
│   execFile(shellPath, ["-c", "-l", script], {                            │
│       env: {                                                             │
│           ...(CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()),     │
│           SHELL: shellPath,                                              │
│           GIT_EDITOR: "true",                                            │
│           CLAUDECODE: "1"                                                │
│       },                                                                 │
│       timeout: hv6 = 10000,        // 10 seconds                         │
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
│   Spawn env contains CLAUDE_CODE_SESSION_ID (NEW in v2.1.132)           │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE 5  CLEANUP                                                         │
│   Graceful shutdown: registerCleanup(CK) fires → unlink snapshot         │
│   Periodic sweep (cleanupPeriodDays):                                    │
│     aB4() → al5() → Rr(~/.claude/shell-snapshots/, ".sh")               │
│     Deletes stale .sh files older than 30 days (or user setting)         │
│   NEW for v2.1.142 (from v2.1.117 changelog).                            │
└─────────────────────────────────────────────────────────────────────────┘
```

A critical property: **the snapshot Promise is created eagerly, awaited lazily**. This overlaps the ~10-second snapshot generation with TUI startup, model selection, plugin loading, etc. By the time the user types their first Bash-triggering prompt, the snapshot is usually already on disk.

---

## 2. When Is `createAndSaveSnapshot` Triggered?

```javascript
// ============================================
// createBashShellProvider - Builds executor, kicks off snapshot promise
// Location: cli_inner_pretty.js:360867-360939
// ============================================

// ORIGINAL (for source lookup):
async function $U7(H, $) {
    let q, K = $?.skipSnapshot ? Promise.resolve(void 0) : ip7(H).then((z) => { return (RH("shell_snapshot_create"), z); }).catch((z) => { (N(`Failed to create shell snapshot: ${z}`), J8("shell_snapshot_create", "snapshot_failed")); return; }), _, A = !1;
    return {
        type: "bash",
        shellPath: H,
        detached: !0,
        async buildExecCommand(z, Y) { /* ... */ },
        getSpawnArgs(z) { /* ... */ },
        async getEnvironmentOverrides(z, Y) { /* ... */ }
    }
}

// READABLE (for understanding):
async function createBashShellProvider(shellPath, options) {
    let sandboxTmpDir,                                            // q
        snapshotPromise = options?.skipSnapshot
            ? Promise.resolve(undefined)
            : createAndSaveSnapshot(shellPath)
                .then((path) => {
                    recordSpanSuccess("shell_snapshot_create");
                    return path;
                })
                .catch((err) => {
                    logForDebugging(`Failed to create shell snapshot: ${err}`);
                    recordSpanFailure("shell_snapshot_create", "snapshot_failed");
                    return undefined;
                }),
        cachedSnapshotPath,                                       // _
        missingTelemetryFired = false;                            // A (one-shot guard)
    return {
        type: "bash",
        shellPath,
        detached: true,
        async buildExecCommand(userCommand, ctx) { /* awaits snapshotPromise */ },
        getSpawnArgs(commandString) { /* skip -l flag if cachedSnapshotPath !== undefined */ },
        async getEnvironmentOverrides(command, sessionEnvVars) { /* uses sandboxTmpDir */ }
    };
}

// Mapping: $U7→createBashShellProvider, ip7→createAndSaveSnapshot, H→shellPath, $→options,
//   K→snapshotPromise, _→cachedSnapshotPath, q→sandboxTmpDir, A→missingTelemetryFired,
//   RH→recordSpanSuccess, J8→recordSpanFailure, N→logForDebugging
```

**What it does:** Returns an executor object the Bash tool can later use to spawn shell commands. Snapshot creation runs in the background; the executor itself is ready immediately.

**How it works:**
1. If `skipSnapshot` is set in options (used for some test paths), resolve to undefined directly.
2. Otherwise call `ip7(shellPath)` immediately. This returns a Promise that resolves to either the snapshot path or `undefined`.
3. Chain a `.then` that fires `recordSpanSuccess("shell_snapshot_create")` on success — this is **new in v2.1.142** vs v2.1.112 (which only had `.catch`). The span tracking lets observability see how long the snapshot took.
4. Wrap in `.catch()` so any unexpected rejection (which shouldn't happen — `ip7` always resolves) becomes `undefined` rather than an unhandled rejection. The catch also records a span failure with reason `"snapshot_failed"`.
5. Store the Promise in the executor's closure. It will be awaited later, lazily.

**Why this approach:**
- Eager Promise creation + lazy await is the standard Node.js pattern for overlapping I/O with startup.
- Catching rejections at the assignment site means callers (`buildExecCommand`) only ever see `undefined` vs a real path — no `try/catch` needed at the consumption site.
- The `skipSnapshot` option exists for unit tests and scenarios (e.g., `--print` mode) that don't need shell environment fidelity.
- The span tracking (new in v2.1.142) makes snapshot creation observable in OpenTelemetry traces — important because snapshot generation is on the critical-startup path.

**Key insight:** The executor's `buildExecCommand` is the **only** place the snapshot Promise is awaited. Even after the snapshot resolves, the path is cached in `cachedSnapshotPath` (closure variable) on the first call so subsequent commands don't re-await. A `missingTelemetryFired` one-shot flag ensures the `snapshot_missing_at_exec` telemetry only fires once per session, not once per Bash tool call that finds the file missing.

---

## 3. What Is Captured

The snapshot script captures four categories of state from the user's shell config, then appends Claude Code's own injections. See [snapshot_creation.md](./snapshot_creation.md) and [config_file_detection.md](./config_file_detection.md) for full deobfuscation; the summary:

| Category | Bash mechanism | Zsh mechanism | Why |
|----------|----------------|---------------|-----|
| Functions | `declare -F` names → `declare -f` body → base64 → `eval $(... \| base64 -d)` | `typeset +f` names → direct `typeset -f` write | Bash function bodies often contain unescapable characters; base64 round-trip is safer. Zsh's `typeset -f` output is self-quoting. |
| Filtered completions | `grep -vE '^_[^_]'` | Same | Single-underscore-prefixed functions like `_git`, `_ssh` are completion handlers — bulky and unnecessary. Double-underscore helpers like `__pyenv_init` are kept. |
| Shell options | `shopt -p` + `set -o ... \| grep "on"` + force `shopt -s expand_aliases` | `setopt \| sed 's/^/setopt /'` | bash needs `expand_aliases` explicitly forced on because non-interactive bash disables it by default |
| Aliases | `alias \| sed ...` (filtered `winpty` on Windows) | Same | Re-emitted as `alias -- name='value'` so names starting with `-` are not parsed as flags |
| Tool injections | rg fallback (if not on PATH), find/grep shadows (if `dM()` true), bq shadow (placeholder, always null), PATH export | Same | Ensures Claude Code's tools work regardless of what the user has installed |

The 1000-line caps on `shopt -p`, `set -o`, `setopt`, and `alias` are safety limits — bizarre configs with thousands of aliases get clipped rather than producing pathological snapshots.

---

## 4. How the Snapshot Is Stored

### Path Construction

```javascript
// ORIGINAL:
let A = Date.now(),
    z = Math.random().toString(36).substring(2, 8),
    Y = vX$.join(b8(), "shell-snapshots");
let f = vX$.join(Y, `snapshot-${$}-${A}-${z}.sh`);

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
await cY8.mkdir(Y, { recursive: !0 });   // cY8 = fs/promises
```

`recursive: true` is essential because `~/.claude/` may exist but `shell-snapshots/` underneath may not. Without recursive, a first-run install would error.

---

## 5. Cleanup Registration

When the snapshot is successfully created and verified, a cleanup callback is registered:

```javascript
// ORIGINAL:
if (j !== void 0)
    (N(`Shell snapshot created successfully (${j} bytes)`),
      CK(async () => {
        try {
          (await C$().unlink(f), N(`Cleaned up session snapshot: ${f}`));
        } catch (J) {
          N(`Error cleaning up session snapshot: ${J}`);
        }
      }),
      q(f));

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
- `CK` (the `registerCleanup` from `cleanupRegistry`) supports **async** callbacks. Node's built-in `process.on('exit')` only allows synchronous handlers.
- The registry also fires on `SIGINT`, `SIGTERM`, and the normal `process.exit()` paths, giving more reliable cleanup than the bare exit event.
- Unlink failures are swallowed with a debug log — at worst, `~/.claude/shell-snapshots/` accumulates files (which is preferable to crashing on exit).

**v2.1.117 addition — periodic retention sweep:**

Sessions that crashed without firing cleanup hooks (kill -9, OS reboot, OOM) used to pile up `.sh` files indefinitely. v2.1.117 added a daily-ish `cleanupPeriodDays` sweep:

```javascript
// cleanupShellSnapshots (al5) - cli_inner_pretty.js:555525-555527
function al5() {
  return Rr(XA.join(b8(), "shell-snapshots"), ".sh");
}
```

This is called from the top-level cleanup orchestrator `aB4()` alongside sweeps for other directories (`tasks/`, `backups/`, etc.). Full deep dive in [retention_cleanup.md](./retention_cleanup.md).

---

## 6. How the Snapshot Is Loaded into the Bash Tool

```javascript
// ============================================
// buildExecCommand - Source snapshot, assemble command pipeline (excerpt)
// Location: cli_inner_pretty.js:360885-360919
// ============================================

// ORIGINAL (excerpt):
async buildExecCommand(z, Y) {
    let f = await K;
    if (f)
        try {
          await ep7.access(f);
        } catch {
          if ((N(`Snapshot file missing, falling back to login shell: ${f}`), !A))
            ((A = !0), J8("shell_snapshot_create", "snapshot_missing_at_exec"));
          f = void 0;
        }
    ((_ = f), (q = Y.sandboxTmpDir));
    // ...
    let P = [];
    if (f) {
        let V = c$() === "windows" ? MP(f) : f;
        P.push(`source ${W4([V])} 2>/dev/null || true`);
    }
    // ... session env, BUN_OPTIONS, extglob, eval, pwd ...
    let G = P.join(" && ");
    return { commandString: G, cwdFilePath: j }
}

// READABLE (excerpt):
async buildExecCommand(userCommand, ctx) {
    let snapshotPath = await snapshotPromise;
    if (snapshotPath) {
        try {
            await fs.access(snapshotPath);
        } catch {
            logForDebugging(`Snapshot file missing, falling back to login shell: ${snapshotPath}`);
            // One-shot telemetry: only fire once per session, not per missing-snapshot command
            if (!missingTelemetryFired) {
                missingTelemetryFired = true;
                recordSpanFailure("shell_snapshot_create", "snapshot_missing_at_exec");
            }
            snapshotPath = undefined;
        }
    }
    cachedSnapshotPath = snapshotPath;
    sandboxTmpDir = ctx.sandboxTmpDir;
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

**Three changes from v2.1.112 worth highlighting:**

1. **One-shot `snapshot_missing_at_exec` telemetry.** Earlier versions logged the missing-file warning on every command. v2.1.142 uses the closure `A` (`missingTelemetryFired`) flag so the OTEL span failure fires once, even if 50 Bash tool calls happen after the file was deleted.

2. **`access` instead of `stat`.** The probe is now `await ep7.access(f)` (fs/promises `access`) rather than `stat`. `access` is slightly cheaper because it doesn't materialise file metadata — we only need to know the file exists. Equivalent behaviour for the use case.

3. **`source ${path} 2>/dev/null || true`** — unchanged from v2.1.112, but worth re-emphasising: snapshot syntax errors or corruption no longer break the command chain.

---

## 7. Login-Shell Bypass

```javascript
// ORIGINAL:
getSpawnArgs(z) {
    let Y = _ !== void 0;
    if (Y) N("Spawning shell without login (-l flag skipped)");
    return ["-c", ...(Y ? [] : ["-l"]), z];
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

`ip7` resolves the Promise rather than rejecting, so callers never need `.catch()`. The resolution value distinguishes outcomes:

| Outcome | Resolved value | Telemetry | OTEL span | Recovery |
|---------|----------------|-----------|-----------|----------|
| `execFile` returned an error | `undefined` | `tengu_shell_snapshot_failed` with `{stderr_length, has_error_code, error_signal_number, error_killed}` | `shell_snapshot_create` failure (via `.catch`) | Spawn with `-l` flag |
| `execFile` succeeded but snapshot file missing | `undefined` | `tengu_shell_unknown_error` (empty payload) | `shell_snapshot_create` success (because `.then` fires even if `ip7` returns undefined) | Spawn with `-l` flag |
| Synchronous `throw` in setup | `undefined` | `tengu_shell_snapshot_error` (empty payload) | `shell_snapshot_create` failure | Spawn with `-l` flag |
| Snapshot file missing at command time | (already cached as undefined) | One-shot `shell_snapshot_create` span failure with reason `snapshot_missing_at_exec` (NEW in v2.1.142) | One-shot failure span | Spawn with `-l` flag |
| Success | snapshot path | (none) | `shell_snapshot_create` success | Source snapshot, skip `-l` |

**Failure telemetry detail:**

```javascript
// On execFile error, before resolve(undefined):
let J = j?.signal ? lY8.constants.signals[j.signal] : void 0;   // signal name → number
d("tengu_shell_snapshot_failed", {
    stderr_length: D?.length || 0,
    has_error_code: !!j?.code,
    error_signal_number: J,
    error_killed: j?.killed
});
```

The signal-name-to-number conversion via `os.constants.signals` lets the telemetry pipeline deal with structured numeric data rather than free-form signal strings. The four payload fields cover the four common failure shapes:
- `error_killed: true` + `error_signal_number: 15` → SIGTERM, likely the 10-second timeout
- `error_killed: true` + `error_signal_number: 9` → SIGKILL, often OOM or external kill
- `has_error_code: true` → shell exited non-zero (likely a syntax error in user's `.bashrc`)
- `stderr_length > 0` → diagnostic available; the actual stderr text is logged via `logForDebugging`, not telemetry

**Verbose diagnostic logging on failure** (cli_inner_pretty.js:360731-360753) reproduces the v2.1.112 contract:
- Error code, signal, killed flag
- Shell path, config file path, config file exists
- Working directory, Claude home
- Full snapshot script (so support can rerun it in a fresh shell to diagnose)
- stdout/stderr lengths and contents

---

## 9. Environment Variables Set During Snapshot Creation

| Variable | Value | Why |
|----------|-------|-----|
| `SHELL` | The shell binary path being snapshotted | Ensures the spawned shell self-identifies correctly; some user configs branch on `$SHELL` |
| `GIT_EDITOR` | `"true"` | Prevents `git` invocations in the user's config (e.g., a `gst='git status'` alias loading `git` lazily) from trying to spawn an editor and hanging |
| `CLAUDECODE` | `"1"` | Sentinel for user configs to detect Claude Code and skip interactive-only setup (animated banners, prompts, etc.) |
| `(everything else)` | Inherited from parent process via `subprocessEnv()` (`XI`) | Unless `CLAUDE_CODE_DONT_INHERIT_ENV` is truthy, in which case env starts empty |

The `CLAUDE_CODE_DONT_INHERIT_ENV` escape hatch is intended for fully reproducible CI environments where parent process env vars (e.g., `NODE_OPTIONS`, `PATH`) shouldn't leak into the user's `.bashrc` execution.

**v2.1.128 addition:** All `OTEL_*` env vars are now stripped from `subprocessEnv()` unconditionally. The snapshot-creation subshell will not inherit Claude Code's OTLP exporter endpoint — important because user's `.bashrc` might invoke OTEL-instrumented apps that would otherwise emit telemetry to Claude Code's collector instead of theirs.

**v2.1.132 note:** `CLAUDE_CODE_SESSION_ID` is set when spawning the **Bash tool subprocess** (not during snapshot creation). See [env_snapshot.md](./env_snapshot.md) Section 5.

---

## 10. Complete Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          T = 0  (session start)                          │
│                                                                          │
│  Claude CLI starts → detectShell finds /bin/bash                         │
│                                                                          │
│  createBashShellProvider("/bin/bash") called                             │
│      │                                                                   │
│      └──► ip7("/bin/bash") called (NOT awaited)                          │
│           Returns Promise; execution returns to caller                   │
│           .then(path) records OTEL span success                          │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
        ┌─────────────────────────┴─────────────────────────┐
        │                                                   │
        ▼                                                   ▼
┌──────────────────────┐                          ┌──────────────────────┐
│ T = 0..N  (sync)     │                          │ T = 0..10s  (async)  │
│                      │                          │                      │
│ Other startup work:  │                          │ ip7 runs:            │
│   • TUI init         │                          │   • detect shell type│
│   • Load plugins     │                          │   • lookup config    │
│   • Read settings    │                          │   • mkdir -p         │
│   • Select model     │                          │   • build script via │
│   • Show prompt      │                          │     Oi_              │
│                      │                          │   • execFile spawn   │
│ Returns executor obj │                          │   • timeout 10s      │
│                      │                          │   • stat verify      │
└──────────────────────┘                          │   • register cleanup │
                                                  │   • resolve(path) or │
                                                  │     resolve(undef)   │
                                                  └──────────────────────┘
                                                              │
                                                              │ Promise K settled
                                                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                T = N+1  (first Bash tool call)                           │
│                                                                          │
│  executor.buildExecCommand(userCmd, opts)                                │
│      │                                                                   │
│      ├──► await snapshotPromise                                          │
│      │    (already settled — returns immediately)                        │
│      │                                                                   │
│      ├──► fs.access(snapshotPath)   verify file still exists             │
│      │   on ENOENT: one-shot OTEL span failure                           │
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
│  spawn("/bin/bash", ["-c", commandString], {                             │
│      env: { ...XI(), ..., CLAUDE_CODE_SESSION_ID: v$(), ... }            │
│  })                                                                       │
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

                                  +
                                  
┌─────────────────────────────────────────────────────────────────────────┐
│                T = (periodically)  retention sweep                       │
│                                                                          │
│  aB4() top-level cleanup orchestrator runs                               │
│      │                                                                   │
│      └──► al5() = Rr(~/.claude/shell-snapshots/, ".sh")                 │
│           Deletes *.sh files with mtime older than                       │
│           settings.cleanupPeriodDays (default 30) days                   │
│                                                                          │
│  Recovers files from sessions that crashed without graceful cleanup      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Decision Summary

| Decision | Choice | Trade-off |
|----------|--------|-----------|
| Capture once vs. re-source each time | Capture once | 10s one-time cost vs. 200–500 ms × N per-command cost |
| Eager or lazy snapshot Promise | Eager creation, lazy await | Overlap with startup work vs. wasted compute if no Bash tool is ever used |
| Recreate on missing file mid-session | No (kept from v2.1.112) | Simpler control flow; accept degraded performance after corruption |
| Source with `\|\| true` | Always | Snapshot failure no longer breaks the command; user gets degraded fidelity instead of hard error |
| Skip `-l` when snapshot exists | Yes | 150–400 ms saved per command; relies on snapshot being complete |
| Resolve with undefined vs. reject | Resolve | Callers never need `.catch`; failure path is a single `if (snapshotPath)` |
| Telemetry granularity | Failure-shape categories (`failed` / `unknown_error` / `error`) + OTEL spans | Aggregate failure rate without leaking user content; observable in OTEL traces |
| One-shot `snapshot_missing_at_exec` telemetry | Yes (NEW in v2.1.142) | Avoid telemetry flood when file deleted mid-session |
| Random suffix in filename | 6-char base36 | ~2B combos per ms — safe against same-ms collisions |
| Cleanup mechanism | Custom `registerCleanup` registry + periodic `cleanupPeriodDays` sweep | Async support, multi-signal coverage; periodic sweep catches crashed sessions |
| Embedded-tools gate | Unconditional (no env var) on non-SDK builds (NEW in v2.1.142) | bfs/ugrep always available where they're shipped; no opt-out env var |
| `CLAUDE_CODE_SESSION_ID` in Bash subprocess env | Yes (NEW in v2.1.132) | Scripts inside Bash tool commands can correlate with the session |
