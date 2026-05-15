# Bash Tool Snapshot Integration (Claude Code 2.1.142)

> How `createAndSaveSnapshot` connects to Bash tool execution: pre-command setup, snapshot file path, source/eval mechanism, and the lifecycle from session boot through every command.

Source: `cli_inner_pretty.js` (lines 360697-360952 — snapshot + provider + executor, 361140-361268 — exec spawn).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Unit 04 mappings

Key functions in this document:
- `createAndSaveSnapshot` (`ip7`) — Snapshot creator, returns path or undefined — cli_inner_pretty.js:360697
- `createBashShellProvider` (`$U7`) — Factory that holds the snapshot promise in closure — cli_inner_pretty.js:360867
- `exec` (`tY8`) — Top-level shell executor — cli_inner_pretty.js:518960 (entry); spawn at 361221
- `bashToolExecutor` (analogue at chunks.163 in v2.1.112) — Bash tool's async generator
- `getShellConfig` — Memoized provider construction
- `subprocessEnv` (`XI`) — Env builder applied to every spawn — cli_inner_pretty.js:197531

---

## 1. Where the Snapshot Hooks Into the Bash Tool

The snapshot is created **once per session**, on first request to the shell provider, and consumed on **every** Bash tool call. There are three layers between user-typed command and snapshot-sourcing shell process:

```
                           Bash tool input
                                  |
                                  v
              cli_inner_pretty.js: bashToolExecutor (analogous to v2.1.112's oVY)
                    Calls: tY8(command, signal, "bash", options)
                                  |
                                  v
              cli_inner_pretty.js: exec (tY8)        <-- top-level orchestrator
                    1. resolveProvider["bash"]() => getShellConfig() => provider
                    2. provider.buildExecCommand(...) returns { commandString, cwdFilePath }
                    3. spawn(shell, args, { env: XI()+CLAUDE_CODE_SESSION_ID+..., ... })
                                  |
                                  v
              cli_inner_pretty.js: provider.buildExecCommand ($U7 closure)
                    1. await snapshotPromise (K)        <-- creates on first call
                    2. fs.access snapshot file          <-- recover if deleted
                    3. assemble command chain (source snapshot && ...)
                    4. return { commandString, cwdFilePath }
                                  |
                                  v
              cli_inner_pretty.js: ip7 (createAndSaveSnapshot)
                    Runs once per session: writes ~/.claude/shell-snapshots/snapshot-<shell>-<ts>-<r>.sh
```

The integration is **closure-based**: the snapshot path is stored in a free variable that lives inside the provider object. That object is memoized, so all subsequent Bash tool calls reuse the same provider and the same snapshot.

---

## 2. Provider Construction Triggers Snapshot Creation

```javascript
// ============================================
// createBashShellProvider - Provider factory; stores snapshot promise in closure
// Location: cli_inner_pretty.js:360867-360939
// ============================================

// ORIGINAL (for source lookup):
async function $U7(H, $) {
  let q,
    K = $?.skipSnapshot
      ? Promise.resolve(void 0)
      : ip7(H)
          .then((z) => {
            return (RH("shell_snapshot_create"), z);
          })
          .catch((z) => {
            (N(`Failed to create shell snapshot: ${z}`), J8("shell_snapshot_create", "snapshot_failed"));
            return;
          }),
    _,
    A = !1;
  return {
    type: "bash",
    shellPath: H,
    detached: !0,
    async buildExecCommand(z, Y) { /* ... see section 3 ... */ },
    getSpawnArgs(z) { /* ... */ },
    async getEnvironmentOverrides(z, Y) { /* ... */ }
  };
}

// READABLE (for understanding):
async function createBashShellProvider(shellPath, opts) {
  let sandboxTmpDir; // captured into closure by buildExecCommand
  // Kick off snapshot creation immediately - resolves to path or undefined
  const snapshotPromise = opts?.skipSnapshot
    ? Promise.resolve(undefined)
    : createAndSaveSnapshot(shellPath)
        .then((path) => {
          recordSpanSuccess("shell_snapshot_create");      // NEW v2.1.142
          return path;
        })
        .catch((err) => {
          debugLog(`Failed to create shell snapshot: ${err}`);
          recordSpanFailure("shell_snapshot_create", "snapshot_failed");
          return undefined;
        });
  let resolvedSnapshotPath; // captured for getSpawnArgs / getEnvironmentOverrides
  let missingTelemetryFired = false;
  return {
    type: "bash",
    shellPath,
    detached: true,
    buildExecCommand(command, ctx) { /* see command_assembly.md */ },
    getSpawnArgs(command) { /* see command_assembly.md */ },
    getEnvironmentOverrides(command, sessionEnvVars) { /* see env_snapshot.md */ },
  };
}

// Mapping: $U7→createBashShellProvider, H→shellPath, $→opts,
//   ip7→createAndSaveSnapshot, q→sandboxTmpDir, K→snapshotPromise,
//   _→resolvedSnapshotPath, A→missingTelemetryFired,
//   N→debugLog, RH→recordSpanSuccess, J8→recordSpanFailure
```

**Why this shape:**

- The snapshot promise is started eagerly during provider construction (not at first command), so the user's first Bash tool call doesn't pay the full 10s snapshot-creation cost. By the time the user has typed a prompt, sent it to the model, and the model has chosen the Bash tool, the snapshot is usually ready.
- It is caught with `.catch` so a snapshot failure never throws out of provider construction. Failed snapshots resolve to `undefined`, which downstream code interprets as "no snapshot; use login shell instead."
- `skipSnapshot` allows tests and SDK callers to opt out.
- The `.then(...recordSpanSuccess)` is **new in v2.1.142** — it records an OTEL span on successful snapshot creation. Combined with the `.catch(...recordSpanFailure)`, this gives observability into snapshot creation duration and outcomes via the OTEL pipeline.
- The provider is **memoized at the module level**, so subsequent `getShellConfig()` calls return the same provider for the life of the session.

**Key insight:** the snapshot is keyed to the **shell binary**, not the session. If a user changes their `CLAUDE_CODE_SHELL` env var mid-session it would not invalidate the cache (but the env-var read happens in `findSuitableShell` which is itself memoized, so the original shell is locked in for the session).

---

## 3. The Snapshot File Path

See [snapshot_creation.md](./snapshot_creation.md) for the full deobfuscation of `createAndSaveSnapshot` (`ip7`).

**Path components:**

| Component | Value | Why |
|-----------|-------|-----|
| Root | `getClaudeConfigHomeDir()` → `~/.claude` or `$CLAUDE_CONFIG_DIR` | User-owned, persistent across sessions. |
| Subdir | `shell-snapshots/` | Isolates from other state; allows directory-wide cleanup. |
| Shell type | `bash` / `zsh` / `sh` | Different shells require different scripts; the type is recorded to help debugging. |
| Timestamp | `Date.now()` | Monotonic within a millisecond; helps order by creation time when debugging. |
| Random ID | `Math.random().toString(36).substring(2, 8)` | 6 base36 chars (~31 bits) prevents collision when two Claude processes start in the same millisecond. |
| Suffix | `.sh` | Allows manual sourcing/testing; editor syntax highlighting. Also: matches the filter used by the retention sweep (`al5`). |

Example: `~/.claude/shell-snapshots/snapshot-zsh-1715750000000-x7k2pq.sh`

**Lifetime:**

- Created once per session by `createAndSaveSnapshot`.
- `registerCleanup` (`CK`) schedules an `unlink` for graceful process exit (SIGINT, normal exit, etc.).
- If the OS or another process deletes the file (e.g., `/tmp` cleanup, `~/.claude` reset, antivirus quarantine), `buildExecCommand` detects this via `fs.access` and **falls back to a login shell**.
- **NEW v2.1.117:** stale `.sh` files from crashed sessions are swept by the `cleanupPeriodDays` retention pass (`al5` → `Rr`). See [retention_cleanup.md](./retention_cleanup.md).

---

## 4. Snapshot Sourcing Mechanism

The snapshot is "loaded" by **sourcing** the file inside each spawned shell, prepended to the user's command via `&&`-chaining:

```javascript
// ============================================
// buildExecCommand (snapshot-source portion) - prepends source <snapshot> to chain
// Location: cli_inner_pretty.js:360904-360908
// ============================================

// ORIGINAL (for source lookup):
let P = [];
if (f) {
  let V = c$() === "windows" ? MP(f) : f;
  P.push(`source ${W4([V])} 2>/dev/null || true`);
}

// READABLE (for understanding):
const chainParts = [];
if (resolvedSnapshotPath) {
  const sourcePath = getPlatform() === "windows"
    ? posixPathToWindowsPath(resolvedSnapshotPath)
    : resolvedSnapshotPath;
  chainParts.push(`source ${shellQuote([sourcePath])} 2>/dev/null || true`);
}

// Mapping: P→chainParts, f→resolvedSnapshotPath, V→sourcePath,
//   c$→getPlatform, MP→posixPathToWindowsPath, W4→shellQuote
```

**What this evaluates to inside the shell:**

```bash
source '/home/alice/.claude/shell-snapshots/snapshot-zsh-1715750000000-x7k2pq.sh' 2>/dev/null || true
```

**Why `source` (not `.`) and why redirect stderr:**

- `source` works in both bash and zsh; the POSIX `.` builtin works too but `source` is more readable in logs.
- `2>/dev/null` suppresses any messages the snapshot might print to stderr (e.g., a function definition that calls `echo "loaded foo" >&2`). Without redirection, every Bash tool call would re-emit those messages.
- `|| true` ensures a snapshot-internal failure (e.g., a function definition that references a missing tool) does not abort the rest of the chain. One bad function definition no longer kills all commands.

**Key insight:** the snapshot does **not** restore the **environment variables** of the user's interactive shell, except for `PATH`. It restores **functions, aliases, shell options, and `PATH` exports** — but not `EDITOR`, `LANG`, `HISTFILE`, etc. Those come from `subprocessEnv()` (the parent claude's process.env, scrubbed). This split is what allows Claude Code to call into provider-managed shells (CCD, CCR) without leaking the user's interactive-shell quirks into the inference path.

---

## 5. Login-Shell Fallback Path

When the snapshot is missing or failed to create, `getSpawnArgs` adds `-l` to make the shell load `.bashrc`/`.zshrc` itself:

```javascript
// ============================================
// getSpawnArgs - Decides whether the spawned shell needs login mode
// Location: cli_inner_pretty.js:360921-360925
// ============================================

// ORIGINAL (for source lookup):
getSpawnArgs(z) {
  let Y = _ !== void 0;       // _ = closure-captured snapshot path
  if (Y) N("Spawning shell without login (-l flag skipped)");
  return ["-c", ...(Y ? [] : ["-l"]), z];
}

// READABLE (for understanding):
function getSpawnArgs(commandString) {
  const hasSnapshot = resolvedSnapshotPath !== undefined;
  if (hasSnapshot) {
    debugLog("Spawning shell without login (-l flag skipped)");
  }
  return ["-c", ...(hasSnapshot ? [] : ["-l"]), commandString];
}

// Mapping: z→commandString, _→resolvedSnapshotPath, Y→hasSnapshot, N→debugLog
```

| Path | Spawn args | When | Latency |
|------|------------|------|---------|
| Snapshot success | `[shell, "-c", cmd]` | Normal case; snapshot ready and on disk | ~5-20 ms per command |
| Snapshot missing/failed | `[shell, "-c", "-l", cmd]` | First-run, or snapshot deleted, or creation timeout | 50-500+ ms per command (depends on `.bashrc` size) |

The login fallback is a **per-command** decision: every `buildExecCommand` re-checks the snapshot file (`fs.access`) and falls back if it disappeared since the last call. This handles `/tmp` cleanup, `rm -rf ~/.claude/*` mid-session, etc., without crashing.

---

## 6. Subprocess Env Injection at Spawn

The final piece of integration is `XI()` (`subprocessEnv`) — every spawn merges scrubbed parent env with the provider's overrides and the v2.1.132 `CLAUDE_CODE_SESSION_ID`:

```javascript
// ============================================
// Bash tool spawn (env subset) - merge order matters
// Location: cli_inner_pretty.js:361221-361232
// ============================================

// ORIGINAL (for source lookup):
let F = YU7.spawn(E, I, {
    env: {
      ...XI(),
      SHELL: q === "bash" ? G : void 0,
      GIT_EDITOR: "true",
      CLAUDECODE: "1",
      AI_AGENT: CT8("agent"),
      CLAUDE_CODE_SESSION_ID: v$(),
      ...h,
      ...w,
      ...(x && { TRACEPARENT: x }),
    },
    cwd: W,
    stdio: Vi_(C, u?.fd, S),
    detached: j.detached,
    windowsHide: !0,
  }),

// READABLE (for understanding):
const childProcess = spawn(spawnBinary, shellArgs, {
  env: {
    ...subprocessEnv(),                           // scrubbed parent env
    SHELL: shellType === "bash" ? binShell : undefined,
    GIT_EDITOR: "true",                           // prevents `git commit` blocking
    CLAUDECODE: "1",                              // marker for scripts
    AI_AGENT: getAiAgentTag("agent"),             // v2.1.120: gh user-agent
    CLAUDE_CODE_SESSION_ID: getCurrentSessionId(),// v2.1.132: scripts can correlate
    ...providerOverrides,                         // TMUX, TMPDIR, etc.
    ...sessionEnvVars,                            // per-call overrides (from hooks)
    ...(otelTraceParent && { TRACEPARENT: otelTraceParent }),
  },
  cwd: trackedCwd,
  stdio: buildStdioConfig(usePipeMode, outputFd, sandboxFd),
  detached: provider.detached,
  windowsHide: true,
});

// Mapping: YU7.spawn→spawn, F→childProcess, XI→subprocessEnv, CT8→getAiAgentTag,
//   v$→getCurrentSessionId, E→spawnBinary, I→shellArgs, q→shellType, G→binShell,
//   h→providerOverrides, w→sessionEnvVars, x→otelTraceParent,
//   W→trackedCwd, Vi_→buildStdioConfig, j.detached→provider.detached
```

**Merge order matters:**

1. `subprocessEnv()` — scrubbed `process.env` (GHA secrets and `OTEL_*` stripped).
2. Fixed keys (`SHELL`, `GIT_EDITOR`, `CLAUDECODE`, `AI_AGENT`, `CLAUDE_CODE_SESSION_ID`) override whatever was in process.env.
3. `providerOverrides` (TMUX, TMPDIR, CLAUDE_CODE_EXECPATH, etc.) override the fixed keys when applicable.
4. `sessionEnvVars` (from session-env hooks) override provider overrides.
5. OTEL `TRACEPARENT` is conditionally injected when an active trace exists.

This means a user's `process.env.CLAUDECODE` (if somehow set externally) is overridden by the hardcoded `"1"`, but `process.env.TMUX` is then re-overridden by the provider if the provider has captured a tmux socket. See [env_snapshot.md](./env_snapshot.md) for the full env capture/filter logic.

---

## 7. The Bash Tool Caller's View

Above all of this, the Bash tool itself just calls `exec` (`tY8`):

```javascript
// READABLE (for understanding, analogous shape to v2.1.112's oVY):
async function* bashToolExecutor({
  input, abortController, taskRegistry, abortSpeculation,
  setToolJSX, emitToolProgress, preventCwdChanges, isMainThread,
  toolUseId, agentId, sessionEnvVars, tmuxSocket
}) {
  const { command, description, timeout, run_in_background } = input;
  const effectiveTimeout = Math.min(
    timeout || getDefaultTimeoutMs(),
    getMaxTimeoutMs()
  );
  const autoBackgroundEligible = !isAutoBackgroundDisabled
    && shouldAutoBackground(command);
  const shellCommand = await exec(command, abortController.signal, "bash", {
    timeout: effectiveTimeout,
    onProgress: /* ... */,
    preventCwdChanges,
    shouldUseSandbox: shouldUseSandboxForInput(input),
    shouldAutoBackground: autoBackgroundEligible,
    sessionEnvVars,
    tmuxSocket,
  });
  // ... process.result, yield progress events, handle background ...
}
```

**The Bash tool doesn't know anything about the snapshot.** All it does is call `exec(command, signal, "bash", options)` with:

- `sessionEnvVars` — a `Map<string, string>` of per-tool-call env-var overrides (used by the session-env hook system to set scratch variables for one command).
- `tmuxSocket` — a tmux socket object exposing `getTmuxEnv()` so the snapshot/shell can reattach to the original user's tmux session.

These get plumbed to `provider.getEnvironmentOverrides`, where they become the final layer of the env merge.

---

## 8. End-to-End Lifecycle (Diagram)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Session boot                                                            │
│  ────────────                                                            │
│  init.ts ─> sets process.env.CLAUDE_CODE_SESSION_ID = v$() if missing    │
│  init.ts ─> registerUpstreamProxyEnvFn (Vs1) (CCR sessions only)         │
│                                                                          │
│  First Bash tool call (or any code that needs the shell)                 │
│  ──────────────────────────────────────────────────────                  │
│  getShellConfig() ─memoized─> getShellConfigImpl                         │
│                                            │                              │
│                                            v                              │
│                                    findSuitableShell                     │
│                                            │                              │
│                                            v                              │
│                                    createBashShellProvider ($U7)         │
│                                            │                              │
│                          starts ──────────┘ ──────────────────┐          │
│                          v                                     │          │
│                   createAndSaveSnapshot (ip7)                  │          │
│                          │                                     │          │
│                          v                                     │          │
│         execFile(shell, ["-c","-l", script], { env: XI()+... })│          │
│                          │                                     │          │
│                          v                                     │          │
│         ~/.claude/shell-snapshots/snapshot-<shell>-<ts>-<r>.sh │          │
│                          │                                     │          │
│                          v                                     │          │
│         .then(recordSpanSuccess) <─── NEW v2.1.142             │          │
│         .catch(recordSpanFailure)                              │          │
│                          │                                     │          │
│                          v                                     │          │
│                    snapshotPromise resolves <─────────────────┘          │
│                                                                           │
│  Every Bash tool call                                                     │
│  ───────────────────                                                      │
│  bashToolExecutor                                                         │
│       │                                                                    │
│       v                                                                    │
│  exec (tY8) ─> provider.buildExecCommand(...)                            │
│       │              │                                                    │
│       │              v                                                    │
│       │     await snapshotPromise => snapshotPath                         │
│       │              │                                                    │
│       │              v                                                    │
│       │     fs.access(snapshotPath) ─if missing─> fallback to login shell │
│       │     (one-shot OTEL span failure on first missing detection)       │
│       │              │                                                    │
│       │              v                                                    │
│       │     assemble: source SNAP && hookScripts && shopt && eval CMD && pwd│
│       │                                                                    │
│       v                                                                    │
│  spawn(shell, ["-c", cmd], { env: XI() + CLAUDE_CODE_SESSION_ID + ...})  │
│       │                                                                    │
│       v                                                                    │
│  Child shell:                                                              │
│    1. source <snapshot>            # restore functions/aliases/PATH        │
│    2. <session env hook scripts>   # CLAUDE_ENV_FILE + setup-hook-*.sh     │
│    3. shopt -u extglob (or zsh equivalent)                                 │
│    4. eval <user-quoted command>                                           │
│    5. pwd -P >| /tmp/claude-XXXX-cwd                                       │
│       │                                                                    │
│       v                                                                    │
│  exec reads CWD file ─> setCwd                                            │
│  exec resolves result ─> back to bashToolExecutor ─> back to model        │
│                                                                            │
│  Session shutdown                                                          │
│  ────────────────                                                          │
│  registerCleanup (CK) fires ─> unlink snapshot                            │
│                                                                            │
│  Periodic (cleanupPeriodDays)                                              │
│  ───────────────────────────                                               │
│  aB4() ─> al5() ─> Rr(~/.claude/shell-snapshots/, ".sh")                  │
│  Deletes stale .sh files older than N days (default 30)                    │
│  NEW for v2.1.142 (from v2.1.117 changelog).                               │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 9. v2.1.112 → v2.1.142 Behavior Changes (Bash-tool-integration-relevant)

| Behavior | v2.1.112 | v2.1.142 | Why |
|----------|---------|----------|-----|
| Snapshot success telemetry | None on `.then` | `recordSpanSuccess("shell_snapshot_create")` | OTEL observability |
| Snapshot failure telemetry | `tengu_shell_snapshot_failed` event | Same + OTEL span failure | OTEL observability |
| `snapshot_missing_at_exec` telemetry | Per-command warning log | One-shot OTEL span failure (via `missingTelemetryFired` flag) | Avoid telemetry flood when file deleted mid-session |
| `fs.access` vs `fs.stat` for verification | `stat` | `access` | Slightly cheaper; same semantics for existence check |
| `CLAUDE_CODE_SESSION_ID` in spawn env | Not set | Set to current session UUID (v2.1.132) | Subprocess scripts can correlate with session |
| `AI_AGENT` in spawn env | Not set | Set to `"agent"` (v2.1.120) | gh CLI user-agent attribution |
| `OTEL_*` env vars in spawn env | Inherited (with GHA-mode header scrub) | Always stripped (v2.1.128) | Prevent OTEL-instrumented apps inheriting Claude Code's OTLP endpoint |
| Background-session env scrub | Not scrubbed | Scrubbed (CLAUDE_BG_*, etc.) | Prevent child Claude sessions inheriting parent's identity |
| `tmuxSocket` parameter in `getEnvironmentOverrides` | Present | Removed (signature simplified) | Feature dormant in v2.1.142 |
| Retention sweep for snapshots | None | `al5` in `aB4` cleanup chain (v2.1.117) | Recover from crashed-session leaks |
| Embedded search tools env-var gate | `EMBEDDED_SEARCH_TOOLS=1` required | Removed (always on for non-SDK) | v2.1.117 made native builds always have embedded |
| Argv0 dispatch fallback chain | env-var → `command -v claude` → system tool | env-var → baked `~/.local/bin/claude` → system tool | PATH-hijack defence; matches v2.1.113 native install path |
| Argv0 dispatch deny-pattern | Not present | Added for grep wrapper | UX: ugrep-only flags fall through to system grep |

---

## Summary

Bash tool integration with the snapshot system has three pieces in v2.1.142:

1. **Eager construction** — the snapshot promise starts as soon as the bash provider is built (first call to `getShellConfig`), not on first command, so the latency is hidden behind model thinking time. NEW v2.1.142: the promise records OTEL spans on success/failure.

2. **Closure capture** — the resolved snapshot path lives in the provider's closure, so every `buildExecCommand` (every Bash tool call) reuses the same snapshot without recomputation. A one-shot `missingTelemetryFired` flag prevents telemetry floods when the snapshot file is deleted mid-session.

3. **Per-command access check + spawn-env enrichment** — every command re-checks the snapshot file with `fs.access`, falls back to a login shell if it disappeared, and injects `CLAUDE_CODE_SESSION_ID` (v2.1.132) + `AI_AGENT` (v2.1.120) into the subprocess env.

The Bash tool itself is a thin wrapper that calls `exec(command, signal, "bash", options)` and never directly touches the snapshot. The snapshot, the env scrubbing, the CWD tracking, and the sandbox wrapping are all the responsibility of the shell provider and `exec`. This separation is what allows the PowerShell provider to coexist without inheriting any of the bash-specific snapshot machinery.

Periodic retention sweep (NEW v2.1.117 → v2.1.142) catches files left by crashed sessions. See [retention_cleanup.md](./retention_cleanup.md).

Embedded search tools (NEW v2.1.117 → v2.1.142) replace `GlobTool`/`GrepTool` on native builds. See [embedded_search_tools.md](./embedded_search_tools.md).
