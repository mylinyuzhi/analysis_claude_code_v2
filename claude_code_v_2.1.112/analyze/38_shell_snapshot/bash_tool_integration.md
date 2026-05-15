# Bash Tool Snapshot Integration (Claude Code 2.1.112)

> How `createAndSaveSnapshot` connects to Bash tool execution: pre-command setup, snapshot file path, source/eval mechanism, and the lifecycle from session boot through every command.

Source: `chunks.144.mjs` (lines 1994-2509 — snapshot + provider + executor), `chunks.163.mjs` (Bash tool input handler), `chunks.78.mjs` (subprocess env scrubbing). v2.1.88 readable counterparts: `src/utils/bash/ShellSnapshot.ts`, `src/utils/Shell.ts`, `src/utils/shell/bashProvider.ts`, `src/tools/BashTool/BashTool.tsx`.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_08.md](../00_overview/symbol_additions_unit_08.md) - Unit 8 mappings (Bash + snapshot + env)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `createAndSaveSnapshot` (`UPK`) - Snapshot creator, returns path or undefined - chunks.144.mjs:1994
- `createBashShellProvider` (`iPK`) - Factory that holds the snapshot promise in closure - chunks.144.mjs:2147
- `exec` (`al`) - Top-level shell executor (formerly `HP1`) - chunks.144.mjs:2369
- `bashToolExecutor` (`oVY`) - Bash tool's async generator that calls `exec` - chunks.163.mjs:2337
- `getShellConfig` (`ePK`) - Memoized provider construction - chunks.144.mjs:2570
- `subprocessEnv` (`Dk`) - Env builder applied to every spawn - chunks.78.mjs:876

---

## 1. Where the Snapshot Hooks Into the Bash Tool

The snapshot is created **once per session**, on first request to the shell provider, and consumed on **every** Bash tool call. There are three layers between user-typed command and snapshot-sourcing shell process:

```
                           Bash tool input
                                  |
                                  v
              chunks.163.mjs: bashToolExecutor (oVY)
                    Calls: al(command, signal, "bash", options)
                                  |
                                  v
              chunks.144.mjs: exec (al)        <-- top-level orchestrator
                    1. resolveProvider["bash"]() => getShellConfig() => provider
                    2. provider.buildExecCommand(...) returns { commandString, cwdFilePath }
                    3. spawn(shell, args, { env: Dk(), ... })
                                  |
                                  v
              chunks.144.mjs: provider.buildExecCommand (iPK closure)
                    1. await snapshotPromise (Y)        <-- creates on first call
                    2. stat snapshot file               <-- recover if deleted
                    3. assemble command chain (source snapshot && ...)
                    4. return { commandString, cwdFilePath }
                                  |
                                  v
              chunks.144.mjs: UPK (createAndSaveSnapshot)
                    Runs once per session: writes ~/.claude/shell-snapshots/snapshot-<shell>-<ts>-<rand>.sh
```

The integration is **closure-based**: the snapshot path is stored in a free variable (`Y` in v2.1.76, no longer needed by name in v2.1.112 because `iPK` holds the promise directly) that lives inside the provider object. That object is memoized by `ePK` (`getShellConfig`), so all subsequent Bash tool calls reuse the same provider and the same snapshot.

---

## 2. Provider Construction Triggers Snapshot Creation

```javascript
// ============================================
// createBashShellProvider - Provider factory; stores snapshot promise in closure
// Location: chunks.144.mjs:2147-2212
// ============================================

// ORIGINAL (for source lookup):
async function iPK(q, K) {
    let _, z = K?.skipSnapshot ? Promise.resolve(void 0) : UPK(q).catch((A) => {
            E(`Failed to create shell snapshot: ${A}`);
            return
        }),
        Y;
    return {
        type: "bash",
        shellPath: q,
        detached: !0,
        async buildExecCommand(A, O) { /* ... see section 3 ... */ },
        getSpawnArgs(A) { /* ... */ },
        async getEnvironmentOverrides(A, O, w) { /* ... */ }
    }
}

// READABLE (for understanding):
async function createBashShellProvider(shellPath, opts) {
  let sandboxTmpDir; // captured into closure by buildExecCommand
  // Kick off snapshot creation immediately - resolves to path or undefined
  const snapshotPromise = opts?.skipSnapshot
    ? Promise.resolve(undefined)
    : createAndSaveSnapshot(shellPath).catch((err) => {
        debugLog(`Failed to create shell snapshot: ${err}`);
        return undefined;
      });
  let resolvedSnapshotPath; // captured for getSpawnArgs / getEnvironmentOverrides
  return {
    type: "bash",
    shellPath,
    detached: true,
    buildExecCommand(command, ctx) { /* see command_assembly.md */ },
    getSpawnArgs(command) { /* see command_assembly.md */ },
    getEnvironmentOverrides(command, sessionEnvVars, tmuxSocket) { /* see env_snapshot.md */ },
  };
}

// Mapping: iPK->createBashShellProvider, q->shellPath, K->opts,
//   UPK->createAndSaveSnapshot, _->sandboxTmpDir, z->snapshotPromise,
//   Y->resolvedSnapshotPath, E->debugLog
```

**Why this shape:**

- The snapshot promise is started eagerly during provider construction (not at first command), so the user's first Bash tool call doesn't pay the full 10s snapshot-creation cost. By the time the user has typed a prompt, sent it to the model, and the model has chosen the Bash tool, the snapshot is usually ready.
- It is caught with `.catch` so a snapshot failure never throws out of provider construction. Failed snapshots resolve to `undefined`, which downstream code interprets as "no snapshot; use login shell instead."
- `skipSnapshot` allows tests and SDK callers to opt out (this is the only added option vs. v2.1.76).
- The provider is **memoized at the module level** via `ePK = P1(EzY)` (chunks.144.mjs:2570). `P1` is the `memoize` wrapper, so `getShellConfig()` returns the same provider for the life of the session.

**Key insight:** the snapshot is keyed to the **shell binary**, not the session. If a user changes their `CLAUDE_CODE_SHELL` env var mid-session it would not invalidate the cache (but the env-var read happens in `findSuitableShell` (`NzY`) which is itself memoized via `ePK`, so the original shell is locked in for the session).

---

## 3. The Snapshot File Path

```javascript
// ============================================
// createAndSaveSnapshot - Writes snapshot file, returns path or undefined
// Location: chunks.144.mjs:1994-2067
// ============================================

// ORIGINAL (for source lookup):
UPK = async (q) => {
    let K = q.includes("zsh") ? "zsh" : q.includes("bash") ? "bash" : "sh";
    return E(`Creating shell snapshot for ${K} (${q})`), new Promise(async (_) => {
        try {
            let z = Q47(q);
            E(`Looking for shell config file: ${z}`);
            let Y = await a3(z);
            if (!Y) E(`Shell config file not found: ${z}, ...`);
            let A = Date.now(),
                O = Math.random().toString(36).substring(2, 8),
                w = F47(A7(), "shell-snapshots");
            let $ = F47(w, `snapshot-${K}-${A}-${O}.sh`);
            await i_Y(w, { recursive: !0 });
            let j = await KzY(q, $, Y);
            n_Y(q, ["-c", "-l", j], {
                env: {
                    ...process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : Dk(),
                    SHELL: q,
                    GIT_EDITOR: "true",
                    CLAUDECODE: "1"
                },
                timeout: g47,    // 10000 ms
                maxBuffer: 1048576,
                encoding: "utf8"
            }, async (H, J, X) => { /* error handler / success handler */ })
        } catch (z) { /* catch-all error handler */ }
    })
}

// READABLE (for understanding):
async function createAndSaveSnapshot(binShell) {
  const shellType = binShell.includes("zsh") ? "zsh"
                  : binShell.includes("bash") ? "bash"
                  : "sh";
  debugLog(`Creating shell snapshot for ${shellType} (${binShell})`);
  return new Promise(async (resolve) => {
    try {
      const configFile = getConfigFile(binShell); // ~/.bashrc, ~/.zshrc, ~/.profile
      const configFileExists = await pathExists(configFile);
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const snapshotsDir = pathJoin(getClaudeConfigHomeDir(), "shell-snapshots");
      const shellSnapshotPath = pathJoin(
        snapshotsDir,
        `snapshot-${shellType}-${timestamp}-${randomId}.sh`
      );
      await mkdir(snapshotsDir, { recursive: true });
      const snapshotScript = await getSnapshotScript(
        binShell, shellSnapshotPath, configFileExists
      );
      execFile(binShell, ["-c", "-l", snapshotScript], {
        env: {
          ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()),
          SHELL: binShell,
          GIT_EDITOR: "true",
          CLAUDECODE: "1",
        },
        timeout: SNAPSHOT_CREATION_TIMEOUT,  // 10 s
        maxBuffer: 1024 * 1024,              // 1 MB
        encoding: "utf8",
      }, async (error, stdout, stderr) => {
        if (error) {
          logEvent("tengu_shell_snapshot_failed", { /* details */ });
          resolve(undefined);
        } else {
          let snapshotSize;
          try { snapshotSize = (await stat(shellSnapshotPath)).size; } catch {}
          if (snapshotSize !== undefined) {
            registerCleanup(async () => {
              await getFsImplementation().unlink(shellSnapshotPath);
            });
            resolve(shellSnapshotPath);
          } else {
            resolve(undefined);
          }
        }
      });
    } catch (error) {
      logEvent("tengu_shell_snapshot_error", {});
      resolve(undefined);
    }
  });
};

// Mapping: UPK->createAndSaveSnapshot, q->binShell, K->shellType, E->debugLog,
//   Q47->getConfigFile, a3->pathExists, A->timestamp, O->randomId,
//   F47->pathJoin, A7->getClaudeConfigHomeDir, w->snapshotsDir,
//   $->shellSnapshotPath, i_Y->mkdir, KzY->getSnapshotScript,
//   n_Y->execFile, j->snapshotScript, Dk->subprocessEnv,
//   g47->SNAPSHOT_CREATION_TIMEOUT, eq->registerCleanup,
//   V8->getFsImplementation, r_Y->stat
```

**Path components:**

| Component | Value | Why |
|-----------|-------|-----|
| Root | `getClaudeConfigHomeDir()` → `~/.claude` or `$CLAUDE_CONFIG_DIR` | User-owned, persistent across sessions. |
| Subdir | `shell-snapshots/` | Isolates from other state; allows directory-wide cleanup. |
| Shell type | `bash` / `zsh` / `sh` | Different shells require different scripts; the type is recorded to help debugging. |
| Timestamp | `Date.now()` | Monotonic within a millisecond; helps order by creation time when debugging. |
| Random ID | `Math.random().toString(36).substring(2, 8)` | 6 base36 chars (~31 bits) prevents collision when two Claude processes start in the same millisecond. |
| Suffix | `.sh` | Allows manual sourcing/testing; editor syntax highlighting. |

Example: `~/.claude/shell-snapshots/snapshot-zsh-1715750000000-x7k2pq.sh`

**Lifetime:**

- Created once per session by `createAndSaveSnapshot`.
- `registerCleanup` schedules an `unlink` for graceful process exit (SIGINT, normal exit, etc.).
- If the OS or another process deletes the file (e.g., `/tmp` cleanup, `~/.claude` reset, antivirus quarantine), `buildExecCommand` detects this via `stat` (`AzY(w)`) and **falls back to a login shell** rather than recreating. This is a v2.1.112 behavior change — in v2.1.76 the snapshot was recreated; in v2.1.112 it logs and falls through, accepting one slow command rather than risking a recursive failure mode.

---

## 4. Snapshot Sourcing Mechanism

The snapshot is "loaded" by **sourcing** the file inside each spawned shell, prepended to the user's command via `&&`-chaining:

```javascript
// ============================================
// buildExecCommand (snapshot-source portion) - prepends source <snapshot> to chain
// Location: chunks.144.mjs:2174-2177
// ============================================

// ORIGINAL (for source lookup):
let D = [];
if (w) {
    let v = y1() === "windows" ? sX(w) : w;
    D.push(`source ${A5([v])} 2>/dev/null || true`)
}

// READABLE (for understanding):
const chainParts = [];
if (resolvedSnapshotPath) {
  const sourcePath = getPlatform() === "windows"
    ? posixPathToWindowsPath(resolvedSnapshotPath)
    : resolvedSnapshotPath;
  chainParts.push(`source ${shellQuote([sourcePath])} 2>/dev/null || true`);
}

// Mapping: D->chainParts, w->resolvedSnapshotPath, v->sourcePath,
//   y1->getPlatform, sX->posixPathToWindowsPath, A5->shellQuote
```

**What this evaluates to inside the shell:**

```bash
source '/home/alice/.claude/shell-snapshots/snapshot-zsh-1715750000000-x7k2pq.sh' 2>/dev/null || true
```

**Why `source` (not `.`) and why redirect stderr:**

- `source` works in both bash and zsh; the POSIX `.` builtin works too but `source` is more readable in logs.
- `2>/dev/null` suppresses any messages the snapshot might print to stderr (e.g., a function definition that calls `echo "loaded foo" >&2`). Without redirection, every Bash tool call would re-emit those messages.
- `|| true` ensures a snapshot-internal failure (e.g., a function definition that references a missing tool) does not abort the rest of the chain. This is a v2.1.112 hardening — earlier versions let snapshot errors propagate, which broke commands run in environments where the snapshot's tools were unavailable.

**Key insight:** the snapshot does **not** restore the **environment variables** of the user's interactive shell, except for `PATH`. It restores **functions, aliases, shell options, and `PATH` exports** — but not `EDITOR`, `LANG`, `HISTFILE`, etc. Those come from `subprocessEnv()` (the parent claude's process.env, scrubbed). This split is what allows Claude Code to call into provider-managed shells (CCD, CCR) without leaking the user's interactive-shell quirks into the inference path.

---

## 5. Login-Shell Fallback Path

When the snapshot is missing or failed to create, `getSpawnArgs` adds `-l` to make the shell load `.bashrc`/`.zshrc` itself:

```javascript
// ============================================
// getSpawnArgs - Decides whether the spawned shell needs login mode
// Location: chunks.144.mjs:2192-2196
// ============================================

// ORIGINAL (for source lookup):
getSpawnArgs(A) {
    let O = Y !== void 0;       // Y = closure-captured snapshot path
    if (O) E("Spawning shell without login (-l flag skipped)");
    return ["-c", ...O ? [] : ["-l"], A]
}

// READABLE (for understanding):
function getSpawnArgs(commandString) {
  const hasSnapshot = resolvedSnapshotPath !== undefined;
  if (hasSnapshot) {
    debugLog("Spawning shell without login (-l flag skipped)");
  }
  return ["-c", ...(hasSnapshot ? [] : ["-l"]), commandString];
}

// Mapping: A->commandString, Y->resolvedSnapshotPath, O->hasSnapshot, E->debugLog
```

| Path | Spawn args | When | Latency |
|------|------------|------|---------|
| Snapshot success | `[shell, "-c", cmd]` | Normal case; snapshot ready and on disk | ~5-20 ms per command |
| Snapshot missing/failed | `[shell, "-c", "-l", cmd]` | First-run, or snapshot deleted, or creation timeout | 50-500+ ms per command (depends on `.bashrc` size) |

The login fallback is a **per-command** decision: every `buildExecCommand` re-statss the snapshot file (`AzY(w)`) and falls back if it disappeared since the last call. This handles `/tmp` cleanup, `rm -rf ~/.claude/*` mid-session, etc., without crashing.

---

## 6. Subprocess Env Injection at Spawn

The final piece of integration is `Dk()` (`subprocessEnv`) — every spawn merges scrubbed parent env with the provider's overrides:

```javascript
// ============================================
// Bash tool spawn (env subset) - merge order matters
// Location: chunks.144.mjs:2456-2467
// ============================================

// ORIGINAL (for source lookup):
let U = PzY(R, h, {
    env: {
        ...Dk(),
        SHELL: _ === "bash" ? v : void 0,
        GIT_EDITOR: "true",
        CLAUDECODE: "1",
        ...C,                  // C = await M.getEnvironmentOverrides(q, H, J)
        ...F && { TRACEPARENT: F },
        ...!1
    },
    cwd: f,
    stdio: hzY(x, S?.fd, N),
    detached: M.detached,
    windowsHide: !0
})

// READABLE (for understanding):
const childProcess = spawn(spawnBinary, shellArgs, {
  env: {
    ...subprocessEnv(),                           // scrubbed parent env
    SHELL: shellType === "bash" ? binShell : undefined,
    GIT_EDITOR: "true",                           // prevents `git commit` blocking
    CLAUDECODE: "1",                              // marker for scripts
    ...providerOverrides,                         // TMUX, TMPDIR, etc.
    ...(otelTraceParent && { TRACEPARENT: otelTraceParent }),
  },
  cwd: tracked Cwd,
  stdio: buildStdioConfig(usePipeMode, outputFd, sandboxFd),
  detached: provider.detached,
  windowsHide: true,
});

// Mapping: PzY->spawn, R->spawnBinary, h->shellArgs, Dk->subprocessEnv,
//   _->shellType, v->binShell, C->providerOverrides, F->otelTraceParent,
//   f->trackedCwd, M.detached->provider.detached, hzY->buildStdioConfig,
//   x->usePipeMode, S?.fd->outputFd, N->sandboxFd
```

**Merge order matters:**

1. `subprocessEnv()` — scrubbed `process.env` (GHA secrets stripped if scrub-mode is on).
2. Fixed keys (`SHELL`, `GIT_EDITOR`, `CLAUDECODE`) override whatever was in process.env.
3. `providerOverrides` (TMUX, TMPDIR, CLAUDE_CODE_EXECPATH, etc.) override the fixed keys when applicable.
4. OTEL `TRACEPARENT` is conditionally injected when an active trace exists.

This means a user's `process.env.CLAUDECODE` (if somehow set externally) is overridden by the hardcoded `"1"`, but `process.env.TMUX` is then re-overridden by the provider if the provider has captured a tmux socket. See `env_snapshot.md` for the full env capture/filter logic.

---

## 7. The Bash Tool Caller's View

Above all of this, the Bash tool itself just calls `exec`:

```javascript
// ============================================
// bashToolExecutor - The async generator that wires up the Bash tool's input
// Location: chunks.163.mjs:2337-2400+
// ============================================

// ORIGINAL (for source lookup):
async function* oVY({ input: q, abortController: K, ..., sessionEnvVars: H, tmuxSocket: J }) {
    let { command: X, description: M, timeout: P, run_in_background: W } = q;
    let D = Math.min(P || On8(), V98());
    // ...
    let h = !k98 && cVY(X);
    let C = await al(X, K.signal, "bash", {
        timeout: D,
        onProgress(...) { /* ... */ },
        preventCwdChanges: O,
        shouldUseSandbox: AL(q),
        shouldAutoBackground: h,
        sessionEnvVars: H,
        tmuxSocket: J
    });
    // ...
}

// READABLE (for understanding):
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

// Mapping: oVY->bashToolExecutor, q->input, X->command, M->description, P->timeout,
//   W->run_in_background, D->effectiveTimeout, On8->getDefaultTimeoutMs,
//   V98->getMaxTimeoutMs, cVY->shouldAutoBackground, AL->shouldUseSandboxForInput,
//   al->exec, h->autoBackgroundEligible, C->shellCommand,
//   H->sessionEnvVars, J->tmuxSocket
```

**The Bash tool doesn't know anything about the snapshot.** All it does is call `exec(command, signal, "bash", options)` with two additional v2.1.112 options:

- `sessionEnvVars` — a `Map<string, string>` of per-tool-call env-var overrides (used by the session-env hook system to set scratch variables for one command).
- `tmuxSocket` — a tmux socket object exposing `getTmuxEnv()` so the snapshot/shell can reattach to the original user's tmux session.

These get plumbed to `provider.getEnvironmentOverrides`, where they become the final layer of the env merge. See `env_snapshot.md` for that path.

---

## 8. End-to-End Lifecycle (Diagram)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Session boot                                                            │
│  ────────────                                                            │
│  init.ts ─> registerUpstreamProxyEnvFn (An_) (CCR sessions only)         │
│                                                                          │
│  First Bash tool call (or any code that needs the shell)                 │
│  ──────────────────────────────────────────────────────                  │
│  getShellConfig() ─memoized via P1─> getShellConfigImpl (EzY)            │
│                                            │                              │
│                                            v                              │
│                                    findSuitableShell (NzY)               │
│                                            │                              │
│                                            v                              │
│                                    createBashShellProvider (iPK)          │
│                                            │                              │
│                          starts ──────────┘ ──────────────────┐          │
│                          v                                     │          │
│                   createAndSaveSnapshot (UPK)                  │          │
│                          │                                     │          │
│                          v                                     │          │
│         execFile(shell, ["-c","-l", script], { env: Dk()+... })│          │
│                          │                                     │          │
│                          v                                     │          │
│         ~/.claude/shell-snapshots/snapshot-<shell>-<ts>-<r>.sh │          │
│                          │                                     │          │
│                          v                                     │          │
│                    snapshotPromise resolves <─────────────────┘          │
│                                                                           │
│  Every Bash tool call                                                     │
│  ───────────────────                                                      │
│  bashToolExecutor (oVY)                                                   │
│       │                                                                    │
│       v                                                                    │
│  exec (al) ─> provider.buildExecCommand(...)                             │
│       │              │                                                    │
│       │              v                                                    │
│       │     await snapshotPromise => snapshotPath                         │
│       │              │                                                    │
│       │              v                                                    │
│       │     stat(snapshotPath) ─if missing─> fallback to login shell      │
│       │              │                                                    │
│       │              v                                                    │
│       │     assemble: source SNAP && hookScripts && shopt && eval CMD && pwd│
│       │                                                                    │
│       v                                                                    │
│  spawn(shell, ["-c", cmd], { env: Dk() + overrides, cwd, stdio, ...})   │
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
│  registerCleanup fires ─> unlink snapshot                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 9. v2.1.112 Behavior Changes vs v2.1.76

| Behavior | v2.1.76 | v2.1.112 | Why |
|----------|---------|----------|-----|
| Snapshot missing recovery | Recreate snapshot inline | Fall back to login shell | Avoids recursive failure modes; explicit slow path is more debuggable |
| Snapshot source | `source <SNAP>` (fail propagates) | `source <SNAP> 2>/dev/null \|\| true` | Hardening — one bad function definition no longer kills all commands |
| Snapshot env source | `process.env` (or empty when `CLAUDE_CODE_DONT_INHERIT_ENV`) | `subprocessEnv()` (scrubbed) | GHA secret scrubbing also applies to snapshot creation |
| `skipSnapshot` provider opt | Not present | Present | SDK tests can bypass the 10s cost |
| BigQuery shell shadow | Not present | `createBigQueryShellIntegration` (`t_Y`) added when applicable | Tags BQ jobs with `source=claude_code` |
| `CLAUDE_CODE_EXECPATH` env | Not set | Set to `process.execPath` | Lets subprocess scripts find the parent claude binary |
| `BUN_OPTIONS=--smol` | Not present | Added if `CLAUDE_CODE_REMOTE` is set | Memory hardening for remote/SSH sessions |

---

## Summary

Bash tool integration with the snapshot system has three pieces:

1. **Eager construction** — the snapshot promise starts as soon as the bash provider is built (first call to `getShellConfig`), not on first command, so the latency is hidden behind model thinking time.
2. **Closure capture** — the resolved snapshot path lives in the provider's closure, so every `buildExecCommand` (every Bash tool call) reuses the same snapshot without recomputation.
3. **Per-command stat check** — every command re-stats the snapshot file and falls back to a login shell if it disappeared, making the system self-healing against external interference.

The Bash tool itself is a thin wrapper that calls `exec(command, signal, "bash", options)` and never directly touches the snapshot. The snapshot, the env scrubbing, the CWD tracking, and the sandbox wrapping are all the responsibility of the shell provider and `exec`. This separation is what allows the PowerShell provider to coexist without inheriting any of the bash-specific snapshot machinery.
