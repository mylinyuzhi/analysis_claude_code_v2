# Shell Snapshot — End-to-End Implementation Overview (v2.1.156)

> This document traces the complete shell-snapshot lifecycle in Claude Code v2.1.156: why the snapshot exists (capture the user's interactive shell state once at session start so each Bash command does NOT pay 200–500 ms re-sourcing `.bashrc`/`.zshrc`), how it is created (`createAndSaveSnapshot` `js7` → `getConfigFile` `ux6` → `mkdir` → `getSnapshotScript` `sD_` → `execFile(shell,["-c","-l",script])` → stat-verify → `registerCleanup`), and how it is consumed (`createBashShellAdapter` `Gs7` kicks off the snapshot promise AND the **new spawn-env probe** `ws7`; `buildExecCommand` awaits the snapshot and assembles `source <snapshot> … && … && eval <cmd> && pwd -P`; `getSpawnArgs` drops the `-l` login flag when a snapshot exists). The headline 2.1.156 facts: a **spawn-env probe** (`ws7`, `cli_inner_pretty.js:341137`) that runs `shell -c env` to learn the real environment-key set; a **`-S dfs`** flag added to the embedded `bfs` find shadow (`cli_inner_pretty.js:340969`) fixing macOS vnode-table exhaustion; a **`getKnownEnvKeys` env-key union** (`iD$`, `cli_inner_pretty.js:209864`) feeding the Bash permission engine; and a new env-allowlist member **`CLAUDE_EFFORT`** (`cli_inner_pretty.js:209894`). Sibling docs carry the detail; this is the map.

---

## 1. Why Snapshots Exist

Every Bash tool invocation spawns a brand-new shell process. There are three ways to make that shell behave like the user's interactive shell (so their aliases, functions, PATH additions, and shell options are present):

1. **Re-source `.bashrc`/`.zshrc` on every command** — spawn with `-l` (login) so the full init chain runs each time. Correct, but a real `.zshrc` with `nvm`/`pyenv`/`mise`/completion frameworks routinely costs **200–500 ms per command**. Across a 100-command session that is 20–50 seconds of pure shell startup.
2. **Run nothing** — fast, but the user's aliases and functions vanish; `ll`, `gst`, `nvm use` all break.
3. **Capture once, replay cheaply** — run the user's full config **once** at session start in a login shell, freeze the resulting functions/options/aliases/PATH into a flat `.sh` file, then `source` that lightweight file before each command. This is what Claude Code does.

When a snapshot file exists, the per-command shell is spawned with **`-c`** instead of **`-c -l`** (`getSpawnArgs`, `cli_inner_pretty.js:341398-341401`): the login init chain is skipped entirely because the snapshot already contains its distilled output. The one-time ~10-second snapshot cost is overlapped with TUI/model/plugin startup (the promise is created eagerly and awaited lazily, see §3), so by the time the first Bash command runs the snapshot is usually already on disk.

**Trade-off accepted:** the snapshot is a point-in-time freeze. If the user edits `.bashrc` mid-session, the running session keeps the stale snapshot. This is deliberate — re-capturing per command would defeat the entire optimization. Graceful degradation: if snapshot creation fails or the file is later missing, the adapter falls back to `-l` (correct but slow) rather than running a broken shell.

---

## 2. Module Scope and Documents in This Module

This document is the **end-to-end overview**. The deep dives live in sibling docs.

| Document | Purpose |
|----------|---------|
| [implementation.md](./implementation.md) | (this doc) End-to-end lifecycle: trigger, creation, consumption, cleanup, and the 2.1.156 deltas at a glance |
| [snapshot_creation.md](./snapshot_creation.md) | Deep deobfuscation of `createAndSaveSnapshot` (`js7`) and `getSnapshotScript` (`sD_`): orchestration, telemetry, failure callbacks |
| [config_file_detection.md](./config_file_detection.md) | `getConfigFile` (`ux6`), `getUserSnapshotContent` (`oD_`), `getClaudeCodeSnapshotContent` (`aD_`) — shell-specific capture, including the exit-127 `grep -vE '^_[^_]'` regression/revert saga |
| [shell_integrations.md](./shell_integrations.md) | The rg / find / grep / bq injections, argv0 dispatch composition order |
| [argv0_dispatch.md](./argv0_dispatch.md) | `createArgv0ShellFunction` (`xx6`) — the `_cc_bin` resolution, four shell branches, deny-pattern early-return |
| [find_grep_integration.md](./find_grep_integration.md) | `createFindGrepShellIntegration` (`iD_`) — every prepended flag, and the **new `-S dfs`** vnode-exhaustion fix |
| [env_snapshot.md](./env_snapshot.md) | `subprocessEnv` (`yv`), provider env overrides, the **new spawn-env probe** (`ws7`) and the env-key union (`iD$`) |
| [command_assembly.md](./command_assembly.md) | `buildExecCommand`: NUL substitution, pipe-safe wrap, eval wrapping, session-env hooks, extglob disable |
| [version_diff.md](./version_diff.md) | Behavioural diff vs v2.1.88 clean source and vs the v2.1.142 docs |

Plus shared symbol additions: [../00_overview/symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md)

---

## 3. Architecture Diagram (v2.1.156)

This adapts the v2.1.142 README diagram and corrects it for 2.1.156: the consumer is now `createBashShellAdapter` (`Gs7`), it fires the **new spawn-env probe `ws7`** alongside snapshot creation, the find shadow now passes **`-S dfs`**, and the env-key union `getKnownEnvKeys` (`iD$`) connects the snapshot to the Bash permission engine.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              Session Start                                  │
│                                                                            │
│  detectShell()  ─────────►  createBashShellAdapter (Gs7)  cli:341341       │
│                                   │                                         │
│             ┌─────────────────────┼─────────────────────────────┐          │
│             │ (non-awaited)       │ (non-awaited, NEW 2.1.156)   │          │
│             ▼                     ▼                              ▼          │
│  createAndSaveSnapshot (js7)   probeSpawnEnv (ws7) cli:341137  returns      │
│   cli:341168                    │                              adapter obj  │
│      │                          │ shell -c env                 immediately  │
│      ▼                          │ parse KEY= via tD_                        │
│  getConfigFile (ux6) cli:340982 │ store keys via i98→l26                    │
│  pathExists (Z5) check          └──► feeds getKnownEnvKeys (iD$) cli:209864 │
│  mkdir -p shell-snapshots                  │  union of:                     │
│  getSnapshotScript (sD_) cli:341109        │   subprocessEnv() keys         │
│      ├─ getUserSnapshotContent (oD_)        │   ∪ fV5 (injected, +CLAUDE_   │
│      │     functions/options/aliases        │       EFFORT)                  │
│      └─ getClaudeCodeSnapshotContent (aD_)  │   ∪ K97 (session env)          │
│            rg fallback (lD_)                │   ∪ l26 (probe result)         │
│            find/grep shadow (iD_)  ◄─ -S dfs│        │                       │
│            PATH heredoc (random delim)      │        ▼                       │
│      │                                      │  Bash permission/policy        │
│      ▼                                      │  cli:242985 / 440809 / 441400  │
│  execFile(shell,["-c","-l",script], cli:341187                              │
│      env:{subprocessEnv(),SHELL,GIT_EDITOR:true,CLAUDECODE:1}               │
│      timeout: VX8 = 1e4 (10s), maxBuffer 1MB)                               │
│      │                                                                     │
│      ├─ ok → stat-verify size → registerCleanup ($7) → resolve(path)       │
│      └─ err → tengu_shell_snapshot_failed → resolve(undefined)             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    Each Bash Tool Call (later)                             │
│  buildExecCommand (Gs7 inner) cli:341360                                   │
│      f = await snapshotPromise;  fs.access(f) re-verify (one-shot telemetry)│
│      assemble P[] joined by " && ":                                        │
│         source <snapshot> 2>/dev/null || true   (if file exists)           │
│         [export TEMP=… TMP=…]                   (windows only)             │
│         <session-env hooks Tv7()> + "\n:"                                   │
│         [export BUN_OPTIONS="--smol…"]          (if CLAUDE_CODE_REMOTE)     │
│         <extglob disable qJ_(shell)>                                        │
│         eval <wrapped-command>                                             │
│         pwd -P >| <cwdFile>                                                 │
│      [splice CLAUDE_CODE_SHELL_PREFIX via NX8]                              │
│  getSpawnArgs (Gs7 inner) cli:341398                                       │
│      ["-c", A]            if snapshot present  (skip -l)                    │
│      ["-c","-l", A]       otherwise            (login-shell fallback)       │
└────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────────┐
│              Session shutdown OR retention sweep                            │
│  registerCleanup ($7) callback fires → unlink(snapshotPath)                │
│  Retention: QC(join(getClaudeConfigHomeDir(),"shell-snapshots"),".sh")     │
│             cli:588103  — deletes stale *.sh per cleanupPeriodDays          │
└────────────────────────────────────────────────────────────────────────────┘
```

The two non-awaited launches off `Gs7` (snapshot creation `js7` and the new probe `ws7`) run concurrently in the background; the adapter object is returned synchronously so the Bash tool is usable immediately. The probe is purely a side-channel for the permission engine — it does NOT block snapshot creation or command execution.

---

## 4. Phase 1 — Trigger: `createBashShellAdapter` (`Gs7`)

```javascript
// ============================================
// createBashShellAdapter - Builds the bash adapter; kicks off snapshot + spawn-env probe
// Location: cli_inner_pretty.js:341341-341353
// ============================================

// ORIGINAL (for source lookup):
async function Gs7(H, $) {
  let q,
    K = $?.skipSnapshot
      ? Promise.resolve(void 0)
      : js7(H)
          .then((A) => {
            return (SH("shell_snapshot_create"), n98(A !== void 0), A);
          })
          .catch((A) => {
            (N(`Failed to create shell snapshot: ${A}`), t$("shell_snapshot_create", "snapshot_failed"), n98(!1));
            return;
          });
  if (!$?.skipSnapshot) ws7(H).catch(() => {});
  let _,
    z = !1;
  return { type: "bash", shellPath: H, detached: !0, /* buildExecCommand, getSpawnArgs, getEnvironmentOverrides */ };
}

// READABLE (for understanding):
async function createBashShellAdapter(shellPath, options) {
  let sandboxTmpDir,
      snapshotPromise = options?.skipSnapshot
        ? Promise.resolve(undefined)
        : createAndSaveSnapshot(shellPath)
            .then((path) => {
              recordSpanSuccess("shell_snapshot_create");
              setSnapshotPresent(path !== undefined);   // n98 → q97: snapshot-exists flag for getKnownEnvKeys
              return path;
            })
            .catch((err) => {
              logForDebugging(`Failed to create shell snapshot: ${err}`);
              recordSpanFailure("shell_snapshot_create", "snapshot_failed");
              setSnapshotPresent(false);
              return undefined;
            });
  // NEW in 2.1.156: fire the spawn-env probe in parallel, fully fire-and-forget
  if (!options?.skipSnapshot) probeSpawnEnv(shellPath).catch(() => {});
  let cachedSnapshotPath,
      missingTelemetryFired = false;
  return { type: "bash", shellPath, detached: true, /* ...adapter methods... */ };
}

// Mapping: Gs7→createBashShellAdapter, js7→createAndSaveSnapshot, ws7→probeSpawnEnv,
//   n98→setSnapshotPresent, SH→recordSpanSuccess, t$→recordSpanFailure, N→logForDebugging,
//   H→shellPath, $→options, K→snapshotPromise, _→cachedSnapshotPath, q→sandboxTmpDir, z→missingTelemetryFired
```

**What it does:** Builds and returns the `"bash"` adapter object that the Bash tool uses for the rest of the session, while kicking off two background side-effects.

**How it works:**
1. Unless `skipSnapshot` is set (test/print paths), call `createAndSaveSnapshot(shellPath)` (`js7`) immediately and store the returned promise (`cli_inner_pretty.js:341345`). Not awaited.
2. The `.then` records the OTEL span `shell_snapshot_create` success AND — **new wiring in 2.1.156** — calls `setSnapshotPresent(path !== undefined)` (`n98`, `cli_inner_pretty.js:341347`) which sets the global `q97` flag that `getKnownEnvKeys` (`iD$`) reads to decide whether the env-key union is ready.
3. The `.catch` mirrors that: log, record span failure, and `setSnapshotPresent(false)` (`cli_inner_pretty.js:341350`).
4. **New in 2.1.156:** `probeSpawnEnv(shellPath).catch(() => {})` (`ws7`, `cli_inner_pretty.js:341353`) is fired and fully ignored — it runs `shell -c env` in the background to learn the real environment-key set (see §8).
5. Returns the adapter object synchronously with three methods: `buildExecCommand`, `getSpawnArgs`, `getEnvironmentOverrides`.

**Why this approach:** Eager promise creation + lazy await is the canonical Node pattern for overlapping I/O with startup work. Catching the rejection at the assignment site means the consumer (`buildExecCommand`) only ever sees a path or `undefined` — never a rejection — so no `try/catch` is needed at the consumption site. Firing `ws7` separately (rather than chaining it onto `js7`) keeps the probe off the snapshot's critical path: even if the probe is slow or fails, snapshot creation and command execution are unaffected.

**Key insight:** `Gs7` is the **single junction** that wires the snapshot subsystem into the permission subsystem. Both `setSnapshotPresent` (after creation) and `probeSpawnEnv` (the probe) feed `getKnownEnvKeys`, which the Bash permission analyzer consults at `cli_inner_pretty.js:242985`, `440809`, and `441400`. The evidence-brief naming note applies: this function was lineage-named `createBashShellProvider` (`$U7`) in v2.1.142; the established 2.1.156 readable name is `createBashShellAdapter`.

---

## 5. Phase 2 — Generation: `createAndSaveSnapshot` (`js7`)

`js7` (`cli_inner_pretty.js:341168-341269`) is an arrow function assigned to a module variable, wrapping its work in a `new Promise` so all paths resolve (never reject):

1. Detect shell type from the binary path: `"zsh"` / `"bash"` / `"sh"` (`cli_inner_pretty.js:341169`).
2. `getConfigFile(shellPath)` (`ux6`, `cli_inner_pretty.js:341174`) → `~/.zshrc` for zsh, `~/.bashrc` for bash, else `~/.profile` (`cli_inner_pretty.js:340982-340984`).
3. `pathExists(configFile)` (`Z5`, `cli_inner_pretty.js:341176`) — a missing config is **not** an error; it just means the snapshot carries Claude Code defaults only.
4. Build the unique path: `Date.now()` timestamp + 6-char base36 random suffix → `join(getClaudeConfigHomeDir(), "shell-snapshots", "snapshot-${type}-${ts}-${rand6}.sh")` (`cli_inner_pretty.js:341178-341182`). Both timestamp and random suffix guard against same-millisecond collisions.
5. `mkdir(snapshotsDir, {recursive:true})` (`cli_inner_pretty.js:341183`) — recursive because `~/.claude/` may exist while `shell-snapshots/` does not.
6. `getSnapshotScript(shell, path, configExists)` (`sD_`, `cli_inner_pretty.js:341184`) assembles the script body.
7. `execFile(shell, ["-c","-l", script], {...})` runs it (Phase 3).

### The snapshot-creation script (`getSnapshotScript`, `sD_`)

```javascript
// ============================================
// getSnapshotScript - Assembles the bash -c -l body that writes the snapshot file
// Location: cli_inner_pretty.js:341109-341135
// ============================================

// ORIGINAL (for source lookup):
async function sD_(H, $, q) {
  let K = ux6(H),
    _ = K.endsWith(".zshrc"),
    z = q ? oD_(K) : !_ ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "",
    A = await aD_(H);
  return `SNAPSHOT_FILE=${O4([$])}
      ${q ? `source "${K}" < /dev/null` : "# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"
      ...
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${z}

      ${A}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `;
}

// READABLE (for understanding):
async function getSnapshotScript(shellPath, snapshotFilePath, configFileExists) {
  let configFile = getConfigFile(shellPath),
      isZsh = configFile.endsWith(".zshrc"),
      // If config exists, capture functions/options/aliases; if missing+bash, still force alias expansion
      userContent = configFileExists
        ? getUserSnapshotContent(configFile)
        : !isZsh ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "",
      claudeContent = await getClaudeCodeSnapshotContent(shellPath);   // rg/find/grep/PATH injections
  return `SNAPSHOT_FILE=${quote([snapshotFilePath])}
      ${configFileExists ? `source "${configFile}" < /dev/null` : "# No user config file to source"}
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"            # truncate (>| ignores noclobber)
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"
      ${userContent}
      ${claudeContent}
      if [ ! -f "$SNAPSHOT_FILE" ]; then exit 1; fi`;       // existence guard → exit 1 on failure
}

// Mapping: sD_→getSnapshotScript, ux6→getConfigFile, oD_→getUserSnapshotContent,
//   aD_→getClaudeCodeSnapshotContent, O4→quote, H→shellPath, $→snapshotFilePath,
//   q→configFileExists, K→configFile, _→isZsh, z→userContent, A→claudeContent
```

**What it does:** Returns the full shell script (a string) that, when run by the user's own login shell, sources their config and then *writes a flat replay file* to `$SNAPSHOT_FILE`.

**How it works (script body order, `cli_inner_pretty.js:341114-341135`):** set `SNAPSHOT_FILE` → `source "<config>" < /dev/null` (only if it exists; `< /dev/null` prevents the config from blocking on stdin) → `>|` truncate the snapshot file (forced, ignoring `noclobber`) → emit `unalias -a` so the replayed file starts clean → append `userContent` (the captured functions/options/aliases) → append `claudeContent` (Claude Code's rg/find/grep/PATH injections) → final `[ ! -f $SNAPSHOT_FILE ]` guard that `exit 1`s if the file vanished.

**Why this approach:** The script runs *inside the user's shell* (via `execFile(shell,["-c","-l",…])`), so `declare -F`/`typeset +f`/`alias`/`shopt` reflect exactly what the user's interactive session would have. The output is plain shell — no JSON, no custom format — so the per-command consumer just `source`s it with zero parsing.

**Key insight:** The "capture" and "replay" halves are intentionally asymmetric. Capture runs once in a heavyweight login shell; replay runs N times in a fast `-c` shell. All the cost (autoloading functions, base64-encoding bodies, enumerating aliases) is paid once, in the script that `sD_` produces.

---

## 6. Phase 3 — Execution and Verification (`execFile` inside `js7`)

```javascript
// ============================================
// execFile spawn + verify (inside createAndSaveSnapshot) - run the script, stat-verify, register cleanup
// Location: cli_inner_pretty.js:341187-341261
// ============================================

// ORIGINAL (for source lookup):
Ms7.execFile(
  H, ["-c", "-l", O],
  { env: { ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : yv()), SHELL: H, GIT_EDITOR: "true", CLAUDECODE: "1" },
    timeout: VX8, maxBuffer: 1048576, encoding: "utf8" },
  async (M, j, w) => {
    if (M) { /* log + d("tengu_shell_snapshot_failed", {...}) + q(void 0) */ }
    else {
      let D; try { D = (await vX8.stat(f)).size; } catch {}
      if (D !== void 0) (N(`Shell snapshot created successfully (${D} bytes)`),
        $7(async () => { try { (await U$().unlink(f), N(`Cleaned up session snapshot: ${f}`)); } catch (J) {} }),
        q(f));
      else (d("tengu_shell_unknown_error", {}), q(void 0));
    }
  });

// READABLE (for understanding):
execFileImpl(shellPath, ["-c", "-l", snapshotScript], {
    env: {
      ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()),  // yv() = sanitized env
      SHELL: shellPath,        // some configs branch on $SHELL
      GIT_EDITOR: "true",      // stop lazy `git` calls in config from spawning an editor and hanging
      CLAUDECODE: "1",         // sentinel so configs can skip interactive-only setup
    },
    timeout: SNAPSHOT_CREATION_TIMEOUT,   // VX8 = 1e4 = 10 seconds
    maxBuffer: 1048576,                   // 1 MB
    encoding: "utf8",
  },
  async (error, stdout, stderr) => {
    if (error) { /* tengu_shell_snapshot_failed { stderr_length, has_error_code, error_signal_number, error_killed } */ resolve(undefined); }
    else {
      let size; try { size = (await stat(snapshotPath)).size; } catch {}   // stat-verify the file actually exists
      if (size !== undefined) {
        registerCleanup(async () => { try { await getFsImplementation().unlink(snapshotPath); } catch {} });  // $7
        resolve(snapshotPath);
      } else { logEvent("tengu_shell_unknown_error", {}); resolve(undefined); }
    }
  });

// Mapping: Ms7→execFileImpl(child_process.execFile), yv→subprocessEnv, VX8→SNAPSHOT_CREATION_TIMEOUT(1e4),
//   $7→registerCleanup, U$→getFsImplementation, vX8→fs/promises, d→logEvent, q→resolve,
//   H→shellPath, O→snapshotScript, f→snapshotPath, M→error, j→stdout, w→stderr, D→size
```

**Three callback outcomes** (`cli_inner_pretty.js:341201-341258`):
- **error** → log full diagnostics (code/signal/killed, shell path, config path, cwd, the entire script, stdout/stderr) → `tengu_shell_snapshot_failed` with `{stderr_length, has_error_code, error_signal_number, error_killed}` (`cli_inner_pretty.js:341226`) → `resolve(undefined)`.
- **ok + file present** (`stat` returns a size) → log byte count → `registerCleanup` an async unlink (`$7`, `cli_inner_pretty.js:341240`) → `resolve(path)`.
- **ok + file missing** (success but no file) → `tengu_shell_unknown_error` (`cli_inner_pretty.js:341257`) → `resolve(undefined)`.
- A synchronous `throw` in setup is caught by the outer `try/catch` → `tengu_shell_snapshot_error` (`cli_inner_pretty.js:341265`) → `resolve(undefined)`.

**Why `stat`-verify after success?** `execFile` returning no error means the shell exited 0, but a buggy config could `exit 0` after the file write silently failed (full disk, sandbox eviction). The independent `stat` confirms the artifact actually exists before the adapter commits to skipping `-l`. The `error_signal_number` is converted from signal-name to number via `os.constants.signals` (`cli_inner_pretty.js:341225`) so telemetry carries structured numerics: `killed:true` + signal `15` ⇒ the 10-second timeout; signal `9` ⇒ OOM/external kill; `has_error_code:true` ⇒ a non-zero exit (likely a syntax error in the user's `.bashrc`).

**Resolve-not-reject contract:** every path calls `resolve(...)`, never `reject`. Callers therefore never need `.catch()` for control flow — the `.catch` on the promise in `Gs7` is only a belt-and-suspenders guard.

---

## 7. Phase 4 — Consumption: `buildExecCommand` and `getSpawnArgs`

```javascript
// ============================================
// buildExecCommand - Awaits snapshot, re-verifies, assembles the && pipeline
// Location: cli_inner_pretty.js:341360-341396
// ============================================

// ORIGINAL (for source lookup):
async buildExecCommand(A, Y) {
  let f = await K;
  if (f) try { await Ws7.access(f); } catch {
    if ((N(`Snapshot file missing, falling back to login shell: ${f}`), !z)) ((z = !0), t$("shell_snapshot_create", "snapshot_missing_at_exec"));
    f = void 0;
  }
  ((_ = f), n98(f !== void 0), (q = Y.sandboxTmpDir));
  let ... J = Ls7(A), X = Xs7(J), L = Js7(J, X);
  if (J.includes("|") && X) L = Os7(J);
  let P = [];
  if (f) { let V = n$() === "windows" ? cW(f) : f; P.push(`source ${O4([V])} 2>/dev/null || true`); }
  if (M) P.push(`export TEMP=${O4([O])} TMP=${O4([O])}`);
  let Z = await Tv7(); if (Z) P.push(`${Z}\n:`);
  if (xH(process.env.CLAUDE_CODE_REMOTE)) P.push('export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"');
  let W = qJ_(H); if (W) P.push(W);
  (P.push(`eval ${L}`), P.push(`pwd -P >| ${O4([w])}`));
  let G = P.join(" && ");
  if (process.env.CLAUDE_CODE_SHELL_PREFIX) G = NX8(process.env.CLAUDE_CODE_SHELL_PREFIX, G);
  return { commandString: G, cwdFilePath: D };
}

// READABLE (for understanding):
async buildExecCommand(userCommand, ctx) {
  let snapshotPath = await snapshotPromise;            // settled long ago in normal flow
  if (snapshotPath) try { await fs.access(snapshotPath); }   // re-verify file STILL exists at command time
    catch {
      logForDebugging(`Snapshot file missing, falling back to login shell: ${snapshotPath}`);
      if (!missingTelemetryFired) { missingTelemetryFired = true; recordSpanFailure("shell_snapshot_create", "snapshot_missing_at_exec"); }  // one-shot
      snapshotPath = undefined;
    }
  cachedSnapshotPath = snapshotPath;                   // drives getSpawnArgs (-l skip)
  setSnapshotPresent(snapshotPath !== undefined);      // n98 → keep permission engine's flag in sync
  sandboxTmpDir = ctx.sandboxTmpDir;
  let cmd = substituteNulRedirect(userCommand),        // Ls7: >NUL → >/dev/null
      canDevNull = shouldAppendDevNull(cmd),           // Xs7
      wrapped = wrapCommandForExec(cmd, canDevNull);   // Js7: heredoc/multiline-aware quoting
  if (cmd.includes("|") && canDevNull) wrapped = pipeSafeWrap(cmd);  // Os7
  let parts = [];
  if (snapshotPath) parts.push(`source ${quote([winNormalize(snapshotPath)])} 2>/dev/null || true`);
  // ...windows TEMP/TMP, session-env hooks Tv7(), BUN_OPTIONS, extglob disable qJ_...
  parts.push(`eval ${wrapped}`);
  parts.push(`pwd -P >| ${quote([cwdFile])}`);         // capture post-command cwd
  let commandString = parts.join(" && ");
  if (process.env.CLAUDE_CODE_SHELL_PREFIX) commandString = spliceShellPrefix(process.env.CLAUDE_CODE_SHELL_PREFIX, commandString);
  return { commandString, cwdFilePath };
}

// Mapping: K→snapshotPromise, Ws7→fs/promises(access), z→missingTelemetryFired, t$→recordSpanFailure,
//   _→cachedSnapshotPath, n98→setSnapshotPresent, Ls7→substituteNulRedirect, Xs7→shouldAppendDevNull,
//   Js7→wrapCommandForExec, Os7→pipeSafeWrap, O4→quote, cW→toCygwinPath, Tv7→getSessionEnvScript,
//   qJ_→disableExtglobPrefix, NX8→spliceShellPrefix, A→userCommand, Y→ctx
```

**Command assembly order** (`P` array joined by `" && "`, `cli_inner_pretty.js:341380-341394`):
1. `source <snapshot> 2>/dev/null || true` — only if the file exists; `|| true` means a corrupt snapshot degrades fidelity instead of breaking the command (`cli_inner_pretty.js:341381-341384`). Windows path normalized via `cW` (cygwin).
2. `export TEMP=… TMP=…` — Windows only (`cli_inner_pretty.js:341385`).
3. Session-env hook block `getSessionEnvScript()` (`Tv7`, defined `cli_inner_pretty.js:270265`) + `\n:` — reads `CLAUDE_ENV_FILE` + hook env files (`cli_inner_pretty.js:341386-341389`). The trailing `:` (no-op) guards against the hook block ending mid-expression.
4. `export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"` — only when `CLAUDE_CODE_REMOTE` is set (`cli_inner_pretty.js:341390`).
5. extglob disable `disableExtglobPrefix(shell)` (`qJ_`, `cli_inner_pretty.js:341334-341339`) — `shopt -u extglob` for bash, `setopt NO_EXTENDED_GLOB NO_BARE_GLOB_QUAL` for zsh (`cli_inner_pretty.js:341391-341392`).
6. `eval <wrapped-command>` (`cli_inner_pretty.js:341393`).
7. `pwd -P >| <cwdFile>` — writes the post-command working directory so the tool can track `cd` (`cli_inner_pretty.js:341393`).

If `CLAUDE_CODE_SHELL_PREFIX` is set, the whole string is spliced via `spliceShellPrefix` (`NX8`, `cli_inner_pretty.js:341292-341298`).

### Login-shell bypass (`getSpawnArgs`)

```javascript
// ============================================
// getSpawnArgs - Drops the -l login flag when a snapshot exists
// Location: cli_inner_pretty.js:341398-341401
// ============================================

// ORIGINAL (for source lookup):
getSpawnArgs(A) { let Y = _ !== void 0; if (Y) N("Spawning shell without login (-l flag skipped)"); return ["-c", ...(Y ? [] : ["-l"]), A]; }

// READABLE (for understanding):
getSpawnArgs(commandString) {
  let hasSnapshot = cachedSnapshotPath !== undefined;   // _ set by the last buildExecCommand
  return ["-c", ...(hasSnapshot ? [] : ["-l"]), commandString];   // drop -l when a snapshot exists
}

// Mapping: _→cachedSnapshotPath, N→logForDebugging, A→commandString
```

**Key insight:** `buildExecCommand` re-verifies the file with `fs.access` *at command time*, not just at creation time — because the retention sweep, an external `rm`, or an OS temp cleaner could have deleted it between session start and the first command. On miss, it fires the `snapshot_missing_at_exec` span failure exactly once (the `missingTelemetryFired` one-shot guard) and sets `cachedSnapshotPath = undefined`, so `getSpawnArgs` automatically re-adds `-l`. The fallback is graceful and self-correcting; the cost is a slower command, not a broken one.

---

## 8. NEW in 2.1.156 — The Spawn-Env Probe (`ws7`) and Env-Key Union (`iD$`)

This is the headline architectural addition. It is **entirely absent** from the v2.1.88 clean source (`ShellSnapshot.ts` has no `env`-probing code at all) and from the v2.1.142 docs.

```javascript
// ============================================
// probeSpawnEnv - Background probe: run `shell -c env`, parse keys, feed permission engine
// Location: cli_inner_pretty.js:341137-341158
// ============================================

// ORIGINAL (for source lookup):
async function ws7(H) {
  try {
    let $ = await aJ(H, ["-c", "env"], {
      reject: !1, timeout: VX8, maxBuffer: 1048576,
      env: { ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : yv()), SHELL: H, GIT_EDITOR: "true", CLAUDECODE: "1" },
    });
    if ($.exitCode !== 0 || !$.stdout) { (N(`Spawn-env probe failed: ...`), i98(null)); return; }
    let q = [];
    for (let K of $.stdout.split(`\n`)) { let _ = K.match(tD_); if (_) q.push(_[1]); }
    (N(`Spawn-env probe captured ${q.length} keys`), i98(q));
  } catch ($) { (N(`Spawn-env probe error: ${$}`), i98(null)); }
}

// READABLE (for understanding):
async function probeSpawnEnv(shellPath) {
  try {
    let result = await execa(shellPath, ["-c", "env"], {     // NOTE: -c only (no -l): the per-command spawn env
      reject: false, timeout: SNAPSHOT_CREATION_TIMEOUT, maxBuffer: 1048576,
      env: { ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()), SHELL: shellPath, GIT_EDITOR: "true", CLAUDECODE: "1" },
    });
    if (result.exitCode !== 0 || !result.stdout) { setSpawnEnvKeys(null); return; }  // null = "probe failed/pending"
    let keys = [];
    for (let line of result.stdout.split("\n")) { let m = line.match(envLineKeyRegex); if (m) keys.push(m[1]); }  // tD_ = /^([A-Za-z_][A-Za-z0-9_]*)=/
    setSpawnEnvKeys(keys);                                   // i98 → l26 : the real spawn-env key set
  } catch (e) { setSpawnEnvKeys(null); }
}

// Mapping: ws7→probeSpawnEnv, aJ→execa, yv→subprocessEnv, VX8→SNAPSHOT_CREATION_TIMEOUT, tD_→envLineKeyRegex,
//   i98→setSpawnEnvKeys, N→logForDebugging, H→shellPath, $→result, q→keys, K→line, _→m
```

**What it does:** Runs the user's shell with `-c env`, scrapes every `KEY=` line into a set of environment-variable *names*, and stores that set (via `setSpawnEnvKeys`/`i98` → global `l26`). On failure it stores `null`, which `getKnownEnvKeys` treats as "not ready yet."

**How the union is consumed:**

```javascript
// ============================================
// getKnownEnvKeys - Union of all env-var names the per-command shell could legitimately set
// Location: cli_inner_pretty.js:209864-209871
// ============================================

// ORIGINAL (for source lookup):
function iD$() {
  if (!q97 || l26 === null) return null;
  let H = new Set(Object.keys(yv()));
  for (let $ of fV5) H.add($);
  for (let $ of K97) H.add($);
  for (let $ of l26) H.add($);
  return H;
}

// READABLE (for understanding):
function getKnownEnvKeys() {
  if (!snapshotPresent || spawnEnvKeys === null) return null;   // not ready: no snapshot, or probe pending/failed
  let known = new Set(Object.keys(subprocessEnv()));            // base: sanitized process env keys
  for (let k of CLAUDE_INJECTED_ENV_KEYS) known.add(k);         // fV5: keys Claude itself injects (incl. CLAUDE_EFFORT)
  for (let k of sessionEnvKeys) known.add(k);                   // K97: keys from sessionEnvVars (set at 441112)
  for (let k of spawnEnvKeys) known.add(k);                     // l26: keys the probe observed in the real shell
  return known;
}

// Mapping: iD$→getKnownEnvKeys, q97→snapshotPresent, l26→spawnEnvKeys, yv→subprocessEnv,
//   fV5→CLAUDE_INJECTED_ENV_KEYS, K97→sessionEnvKeys
```

`getKnownEnvKeys` is consumed by the Bash permission/policy engine at `cli_inner_pretty.js:242985`, `440809`, and `441400`. `sessionEnvKeys` (`K97`) is populated by `setSessionEnvKeys` (`_97`) at `cli_inner_pretty.js:441112` from `sessionEnvVars.keys()`.

**Why this approach:** The Bash permission analyzer needs to reason about which `VAR=…` assignments in a user command are *expected* (already part of the environment) versus *injected* by the command itself. A naive list of `process.env` keys would miss variables that only the user's `.zshrc`/login shell defines (e.g. `NVM_DIR`, `PYENV_ROOT`). Running `shell -c env` once and capturing those names gives the permission engine the *real* baseline. The union of four sources covers every legitimate origin: the sanitized parent env (`subprocessEnv`), Claude's own injections (`fV5`), session-scoped overrides (`K97`), and the shell's own additions (`l26`).

**Why null-gate?** `getKnownEnvKeys` returns `null` (not an empty set) when either there's no snapshot (`q97` false) or the probe hasn't finished (`l26 === null`). Returning `null` lets the permission engine *fall back to a conservative policy* during the brief startup window before the probe resolves, rather than incorrectly treating real env keys as injected. This is the trade-off for making the probe asynchronous and non-blocking.

**Key insight:** The probe deliberately uses `-c` (not `-c -l`), matching the *exact* spawn args `getSpawnArgs` will use once a snapshot exists. It is measuring the environment of the same kind of shell the Bash tool will actually run, so the key set is accurate for the per-command case.

---

## 9. NEW in 2.1.156 — `-S dfs` in the find/grep shadow (`iD_`)

```javascript
// ============================================
// createFindGrepShellIntegration - bfs/ugrep shadows; NEW -S dfs bounds open dir handles
// Location: cli_inner_pretty.js:340964-340977
// ============================================

// ORIGINAL (for source lookup):
function iD_() {
  if (!RL()) return null;
  return [
    "unalias find 2>/dev/null || true",
    "unalias grep 2>/dev/null || true",
    xx6("find", "bfs", ["-S", "dfs", "-regextype", "findutils-default"]),
    xx6("grep", "ugrep", ["-G", "--ignore-files", "--hidden", "-I", ...nD_.map((H) => `--exclude-dir=${H}`)],
        ["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"]),
  ].join("\n");
}

// READABLE (for understanding):
function createFindGrepShellIntegration() {
  if (!hasEmbeddedSearchTools()) return null;                // RL(): true only on native (non-SDK) builds
  return [
    "unalias find 2>/dev/null || true",
    "unalias grep 2>/dev/null || true",
    // NEW in 2.1.156: -S dfs forces bfs depth-first search → bounds concurrent open directory handles
    createArgv0ShellFunction("find", "bfs", ["-S", "dfs", "-regextype", "findutils-default"]),
    createArgv0ShellFunction("grep", "ugrep",
      ["-G", "--ignore-files", "--hidden", "-I", ...VCS_DIRECTORIES_TO_EXCLUDE.map((d) => `--exclude-dir=${d}`)],
      ["-*-filter*","-*-pager*","-*-view*","-*-format-open*","-*-config*","---*","-@*","-*-save-config*"]),  // deny → system grep
  ].join("\n");
}

// Mapping: iD_→createFindGrepShellIntegration, RL→hasEmbeddedSearchTools, xx6→createArgv0ShellFunction,
//   nD_→VCS_DIRECTORIES_TO_EXCLUDE
```

**What changed and why:** v2.1.88 passed only `["-regextype","findutils-default"]` to the `find`→`bfs` shadow; v2.1.156 prepends **`-S dfs`** (`cli_inner_pretty.js:340969`). This is CONFIRMED absent in `ShellSnapshot.ts` (which has `['-regextype','findutils-default']` only) and absent from the v2.1.142 find_grep doc.

Per the changelog map, the underlying bug was: *"`find` in the Bash tool exhausting the macOS system file/vnode table and crashing the host on large directory trees."* `bfs` defaults to **breadth-first** (`-S bfs`), which keeps an open directory file descriptor for every pending level — on a huge tree this can exhaust the macOS vnode/open-file table and take down the host. `-S dfs` switches `bfs` to **depth-first**, bounding the number of concurrently open directory handles to roughly the path depth. The trade-off (DFS visits in a less cache-friendly order than BFS on some trees) is overwhelmingly worth avoiding a host crash. Detail lives in [find_grep_integration.md](./find_grep_integration.md).

---

## 10. Snapshot File Structure

A generated snapshot (`~/.claude/shell-snapshots/snapshot-{zsh|bash|sh}-{ts}-{rand6}.sh`) looks like:

```bash
# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true

# Functions  (bash: base64-encoded eval; zsh: direct typeset -f; completion fns filtered by grep -vE '^_[^_]')
eval "$(echo '<base64>' | base64 -d)" > /dev/null 2>&1      # ...one per non-completion function

# Shell Options
shopt -s expand_aliases                                     # bash: forced on (non-interactive bash disables it)
shopt -p ...                                                # bash   (or: setopt ...  on zsh)
set -o emacs                                                # bash POSIX flags

# Aliases  (re-emitted as `alias -- name='value'`; winpty wrappers filtered on Windows)
alias -- ll='ls -la'
alias -- gst='git status'

# Check for rg availability  (only activates if system rg is absent)
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  function rg { ... ARGV0=rg "$_cc_bin" "$@" ... }
fi

# Shadow find/grep with embedded bfs/ugrep  (ant-native builds only)
unalias find 2>/dev/null || true
unalias grep 2>/dev/null || true
function find { ... ARGV0=bfs "$_cc_bin" -S dfs -regextype findutils-default "$@" ... }   # NEW: -S dfs
function grep {
  local _cc_a
  for _cc_a in "$@"; do
    case "$_cc_a" in -*-filter*|-*-pager*|-*-view*|...) command grep "$@"; return ;; esac   # deny → system grep
  done
  ... ARGV0=ugrep "$_cc_bin" -G --ignore-files --hidden -I --exclude-dir=.git ... "$@" ...
}

# Add PATH to the file  (heredoc with random delimiter to survive arbitrary PATH content)
cat >> "$SNAPSHOT_FILE" << 'PATH_END_<random16>'
export PATH='/usr/bin:/usr/local/bin:<plugin bin dirs>:...'
PATH_END_<random16>
```

Two structural points worth flagging: the PATH is written via a **random-delimiter heredoc** `PATH_END_<random16>` (`cli_inner_pretty.js:341097-341104`) rather than a quoted `echo`, so a PATH containing any quoting metacharacter cannot break the snapshot; and the exported PATH now concatenates `getPluginBinPaths` (`NV6`) results (`cli_inner_pretty.js:341051-341055`) so plugin `bin/` directories are on PATH inside the Bash tool.

---

## 11. Phase 5 — Cleanup and Retention

Two independent mechanisms reclaim snapshot files:

1. **Graceful shutdown:** `registerCleanup` (`$7`, `cli_inner_pretty.js:341240`) registers an async `unlink(snapshotPath)`. A custom registry is used (not `process.on('exit')`) because it supports **async** callbacks and fires on `SIGINT`/`SIGTERM`/normal exit. Unlink failures are swallowed with a debug log.
2. **Periodic retention sweep:** `QC(join(getClaudeConfigHomeDir(), "shell-snapshots"), ".sh")` (`cli_inner_pretty.js:588103`) deletes stale `*.sh` files older than `cleanupPeriodDays`. This catches snapshots leaked by sessions that crashed (`kill -9`, OOM, reboot) before their graceful-shutdown hook could fire.

The `claude project purge` flow explicitly **excludes** `shell-snapshots/` and surfaces a warning that it is not project-scoped: `"shell-snapshots/ are not project-scoped and will not be touched"` at both `cli_inner_pretty.js:642571-642572` (project purge) and `cli_inner_pretty.js:642598-642599` (global purge). Snapshots are per-session ephemera, not project data, so purging by project would be incorrect.

---

## 12. NEW-in-2.1.156 Items at a Glance

Detail is delegated to the sibling docs noted; this is the high-level list.

1. **Spawn-env probe `probeSpawnEnv` (`ws7`, `cli_inner_pretty.js:341137`).** Runs `shell -c env` in the background, parses `KEY=` lines via `envLineKeyRegex` (`tD_`, `cli_inner_pretty.js:341290`), stores keys via `setSpawnEnvKeys` (`i98` → `l26`). Fired from `Gs7` at `cli_inner_pretty.js:341353`. Absent from v2.1.88 and v2.1.142. → [env_snapshot.md](./env_snapshot.md).
2. **Env-key union `getKnownEnvKeys` (`iD$`, `cli_inner_pretty.js:209864`).** Unions `subprocessEnv` keys ∪ `CLAUDE_INJECTED_ENV_KEYS` ∪ session keys ∪ probe keys; consumed by the Bash permission engine at `242985`/`440809`/`441400`. → [env_snapshot.md](./env_snapshot.md).
3. **New env-allowlist member `CLAUDE_EFFORT`** in `CLAUDE_INJECTED_ENV_KEYS` (`fV5`, `cli_inner_pretty.js:209894`); injected by `BsH` at `cli_inner_pretty.js:340904` from `effortLevel`. Confirmed absent in v2.1.88. → [env_snapshot.md](./env_snapshot.md).
4. **`-S dfs` on the `bfs` find shadow** (`cli_inner_pretty.js:340969`). macOS vnode-table-exhaustion fix; absent in v2.1.88 and the v2.1.142 doc. → [find_grep_integration.md](./find_grep_integration.md).
5. **`setSnapshotPresent` wiring** (`n98`, `cli_inner_pretty.js:209855`) into `Gs7`/`buildExecCommand` (`341347`/`341350`/`341370`) to gate `getKnownEnvKeys`. → [env_snapshot.md](./env_snapshot.md).
6. **Renamed consumer.** The snapshot consumer is now `createBashShellAdapter` (`Gs7`, `cli_inner_pretty.js:341341`); v2.1.142 lineage name was `createBashShellProvider` (`$U7`).

Items carried forward (refactored in v2.1.142, still present in 2.1.156): random-delimiter PATH heredoc, `getPluginBinPaths` PATH concat, `_cc_bin` argv0 resolution, ugrep deny-pattern allowlist, the reverted `grep -vE '^_[^_]'` completion filter, retention sweep, and the `createBigQueryShellIntegration` (`rD_`) dead stub that always returns `null` (`cli_inner_pretty.js:340979-340981`).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions

Key functions in this document:
- `createAndSaveSnapshot` (`js7`) — top-level snapshot creation orchestrator (`cli_inner_pretty.js:341168`)
- `createBashShellAdapter` (`Gs7`) — consumer; kicks off `js7` + the new `ws7` probe; builds the bash adapter (`cli_inner_pretty.js:341341`)
- `getSnapshotScript` (`sD_`) — assembles the `bash -c -l <script>` body (`cli_inner_pretty.js:341109`)
- `getConfigFile` (`ux6`) — shell path → `~/.zshrc` / `~/.bashrc` / `~/.profile` (`cli_inner_pretty.js:340982`)
- `getClaudeCodeSnapshotContent` (`aD_`) — rg/find/grep/PATH injections (`cli_inner_pretty.js:341045`)
- `createFindGrepShellIntegration` (`iD_`) — bfs/ugrep shadows; NEW `-S dfs` (`cli_inner_pretty.js:340964`)
- `createArgv0ShellFunction` (`xx6`) — argv[0]-dispatch shell function generator (`cli_inner_pretty.js:340924`)
- `probeSpawnEnv` (`ws7`) — NEW spawn-env probe (`cli_inner_pretty.js:341137`)
- `setSpawnEnvKeys` (`i98`) — NEW; stores probe key set into `l26` (`cli_inner_pretty.js:209861`)
- `setSnapshotPresent` (`n98`) — sets the snapshot-exists flag `q97` (`cli_inner_pretty.js:209855`)
- `getKnownEnvKeys` (`iD$`) — NEW env-key union feeding the permission engine (`cli_inner_pretty.js:209864`)
- `getSessionEnvScript` (`Tv7`) — session-env hook block sourced per command (`cli_inner_pretty.js:270265`)
- `spliceShellPrefix` (`NX8`) — splices `CLAUDE_CODE_SHELL_PREFIX` around the command (`cli_inner_pretty.js:341292`)
- `registerCleanup` (`$7`) — registers the async unlink on shutdown (`cli_inner_pretty.js:341240`)
- `CLAUDE_INJECTED_ENV_KEYS` (`fV5`) — injected-key allowlist incl. NEW `CLAUDE_EFFORT` (`cli_inner_pretty.js:209879`)
- `SNAPSHOT_CREATION_TIMEOUT` (`VX8`) — `1e4` ms execFile timeout (`cli_inner_pretty.js:341165`)
