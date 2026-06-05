# Bash Tool Integration: getSpawnArgs + getEnvironmentOverrides (v2.1.156)

> This doc deobfuscates the **bash shell adapter object** returned by `createBashShellAdapter` (`Gs7`, `cli_inner_pretty.js:341341-341415`) and how it plugs into the Bash tool's exec path. The headline 2.1.156 facts: the adapter is `{ type:"bash", shellPath, detached:true, buildExecCommand, getSpawnArgs, getEnvironmentOverrides }`; **`getSpawnArgs`** (`cli_inner_pretty.js:341398-341402`) skips the `-l` login flag whenever a snapshot is present (the snapshot already carries login-shell state — the core per-command latency win); **`getEnvironmentOverrides`** (`cli_inner_pretty.js:341403-341413`) always sets `CLAUDE_CODE_EXECPATH = process.execPath` (so the snapshot's argv0 functions can resolve `_cc_bin` to the running binary), optionally `TMUX`, the caller's extra env pairs, and the sandbox triple `TMPDIR` / `CLAUDE_CODE_TMPDIR` / `TMPPREFIX`. The adapter is structurally the same as v2.1.142's `createBashShellProvider`; the symbol renames and the spawn-env probe (`ws7`) wiring are what changed. Symbol-level coverage of `Gs7` lives in [`symbol_additions_v2_1_156_permission_policy.md`](../00_overview/symbol_additions_v2_1_156_permission_policy.md) — this doc focuses on the two override methods, not the table.

---

## 1. The Returned Adapter Object

`createBashShellAdapter` (`Gs7`) is the factory the Bash tool reaches through `getShellConfig`. It does two things up front and then returns a small object with three methods that the exec layer calls per command. The return literal is at `cli_inner_pretty.js:341356-341415`:

```javascript
// ============================================
// createBashShellAdapter (return literal) - the bash shell adapter object
// Location: cli_inner_pretty.js:341356-341415
// ============================================

// ORIGINAL (for source lookup):
return {
  type: "bash",
  shellPath: H,
  detached: !0,
  async buildExecCommand(A, Y) { /* 341360-341396 — see command_assembly.md */ },
  getSpawnArgs(A) {
    let Y = _ !== void 0;
    if (Y) N("Spawning shell without login (-l flag skipped)");
    return ["-c", ...(Y ? [] : ["-l"]), A];
  },
  async getEnvironmentOverrides(A, Y) {
    let f = null,
      O = {};
    if (((O[mx6] = process.execPath), f)) O.TMUX = f;
    if (Y) for (let [M, j] of Y) O[M] = j;
    if (q) {
      let M = q;
      if (n$() === "windows") M = cW(M);
      ((O.TMPDIR = M), (O.CLAUDE_CODE_TMPDIR = M), (O.TMPPREFIX = SG$.join(M, "zsh")));
    }
    return O;
  },
};

// READABLE (for understanding):
return {
  type: "bash",                 // discriminant; exec layer branches on this
  shellPath,                    // the resolved bash/zsh binary
  detached: true,               // spawn in its own process group (see §5)
  buildExecCommand,             // assembles `source <snap> && ... && eval CMD && pwd -P >| <cwdFile>`
  getSpawnArgs,                 // ["-c", ...(hasSnapshot ? [] : ["-l"]), commandString]
  getEnvironmentOverrides,      // per-call env overlay: EXECPATH + TMUX + extra + sandbox tmp
};

// Mapping: Gs7→createBashShellAdapter, H→shellPath, _→resolvedSnapshotPath,
//   q→sandboxTmpDir, mx6→CLAUDE_CODE_EXECPATH, n$→getPlatform, cW→toCygwinPath,
//   SG$→pathPosix, A(getSpawnArgs)→commandString, A/Y(getEnvironmentOverrides)→command/sessionEnvVars
```

Three closure variables drive the two methods documented here:

- `_` (`resolvedSnapshotPath`) — set inside `buildExecCommand` at `cli_inner_pretty.js:341370` (`_ = f`). `f` is the snapshot path if the file exists, else `undefined`. `getSpawnArgs` reads this.
- `q` (`sandboxTmpDir`) — captured at `cli_inner_pretty.js:341370` (`q = Y.sandboxTmpDir`). `getEnvironmentOverrides` reads this.
- `z` (`missingTelemetryFired`) — a one-shot flag (`cli_inner_pretty.js:341355,341366-341367`) that fires the `snapshot_missing_at_exec` span at most once.

Because `_` and `q` are written by `buildExecCommand` and read by `getSpawnArgs` / `getEnvironmentOverrides`, **the exec layer must call `buildExecCommand` first** for a given command — it is the method that resolves the snapshot path and captures the sandbox tmp dir for this call. The order is enforced by the caller, not by the adapter.

`detached: true` (`cli_inner_pretty.js:341359`) is constant for bash and is consumed at spawn time (`spawn(..., { detached: provider.detached })`). It makes the child shell the leader of its own process group, which lets the exec layer kill the whole tree (the shell **and** every grandchild it forks) with one `kill(-pid)` on timeout or abort. Without it, a `bash -c 'long_running &'` would orphan the background child.

---

## 2. getSpawnArgs — Skip the Login Flag When a Snapshot Exists

```javascript
// ============================================
// getSpawnArgs - omit `-l` when a snapshot is on disk (the latency win)
// Location: cli_inner_pretty.js:341398-341402
// ============================================

// ORIGINAL (for source lookup):
getSpawnArgs(A) {
  let Y = _ !== void 0;
  if (Y) N("Spawning shell without login (-l flag skipped)");
  return ["-c", ...(Y ? [] : ["-l"]), A];
},

// READABLE (for understanding):
function getSpawnArgs(commandString) {
  const hasSnapshot = resolvedSnapshotPath !== undefined; // `_` set by buildExecCommand
  if (hasSnapshot) {
    debugLog("Spawning shell without login (-l flag skipped)");
  }
  // snapshot present  -> ["-c", commandString]
  // snapshot absent   -> ["-c", "-l", commandString]
  return ["-c", ...(hasSnapshot ? [] : ["-l"]), commandString];
}

// Mapping: A→commandString, _→resolvedSnapshotPath, Y→hasSnapshot, N→debugLog
```

**What it does:** Produces the argv that follows the shell binary at spawn. The result is fed to `spawn(shellPath, getSpawnArgs(commandString), ...)`. It chooses between a non-login shell (`bash -c CMD`) and a login shell (`bash -c -l CMD`).

**How it works (step by step):**
1. Read the closure variable `_` (`resolvedSnapshotPath`). This was set to the validated snapshot path — or to `undefined` — by `buildExecCommand` (`cli_inner_pretty.js:341370`) for *this* command.
2. `hasSnapshot = _ !== void 0`.
3. If a snapshot exists, log the debug breadcrumb `"Spawning shell without login (-l flag skipped)"` (`cli_inner_pretty.js:341400`). This string is the only externally observable signal that the optimization fired.
4. Build the array: always `["-c", ...]`. When `hasSnapshot` is true, splice in **nothing** (`[]`); when false, splice in `["-l"]`. Append the assembled `commandString` last.

So the two possible outputs are:

| Snapshot state | `getSpawnArgs` returns | Shell behavior |
|---|---|---|
| present (`_` is a path) | `["-c", commandString]` | non-login: bash skips `/etc/profile`, `~/.bash_profile`, `~/.profile`; zsh skips `/etc/zprofile`, `~/.zprofile`, `~/.zlogin`, `~/.zlogout` |
| absent (`_ === undefined`) | `["-c", "-l", commandString]` | login: shell sources the full login chain itself |

**Why this approach (rationale + alternatives + trade-offs):**

- *The snapshot already contains login-shell state.* When `createAndSaveSnapshot` (`js7`) built the snapshot, it ran the shell **with** `-l` (`Ms7.execFile(shell, ["-c","-l", script], ...)`, per the evidence brief's execFile note) and captured the resulting functions, options, aliases, and `PATH` into the `.sh` file. The assembled command then `source`s that file (`cli_inner_pretty.js:341383`). So the login-shell environment is reconstructed by sourcing one pre-baked file, instead of re-executing `~/.bashrc`/`~/.zshrc`/profile chain on **every** command. Adding `-l` on top would re-run the entire login chain a second time — pure redundant work.
- *This is the core performance win of the whole snapshot subsystem.* A user's login files can take tens to hundreds of milliseconds (nvm/rbenv/pyenv init, completion loading, oh-my-zsh). `source <snapshot>` is a flat file read of already-evaluated state. Skipping `-l` is what turns a ~50-500 ms per-command cost into a ~5-20 ms one.
- *Alternative considered: always non-login + always source.* That would break the failure path. If the snapshot is missing (creation timed out, file deleted mid-session, `~/.claude` reset), the shell would have **neither** the snapshot **nor** the login chain, so the user's aliases/functions/PATH would silently vanish. The `-l` fallback guarantees the shell still loads *something*. This is why the decision is data-driven (`_ !== void 0`) rather than a static config.
- *Per-command, not per-session.* `buildExecCommand` re-validates the file with `Ws7.access(f)` (`cli_inner_pretty.js:341364`) on every call and clears `_` to `undefined` if the file vanished (`cli_inner_pretty.js:341368`). So a snapshot deleted between command #3 and command #4 flips command #4 to the `-l` login path without crashing. The trade-off is one `fs.access` stat per command — negligible versus a login shell, and far cheaper than the alternative of crashing or silently losing the user's environment.

**Key insight:** `getSpawnArgs` is a one-line policy, but the policy *depends on a side effect of `buildExecCommand`*. The login flag is not chosen from config or platform — it is chosen from whether `buildExecCommand` was able to `access()` the snapshot file moments earlier. The snapshot file's existence is the single source of truth for "do I need a login shell," and that truth is re-checked every command.

---

## 3. getEnvironmentOverrides — The Per-Call Env Overlay

```javascript
// ============================================
// getEnvironmentOverrides - per-Bash-call env overlay (EXECPATH + TMUX + extra + sandbox tmp)
// Location: cli_inner_pretty.js:341403-341413
// ============================================

// ORIGINAL (for source lookup):
async getEnvironmentOverrides(A, Y) {
  let f = null,
    O = {};
  if (((O[mx6] = process.execPath), f)) O.TMUX = f;
  if (Y) for (let [M, j] of Y) O[M] = j;
  if (q) {
    let M = q;
    if (n$() === "windows") M = cW(M);
    ((O.TMPDIR = M), (O.CLAUDE_CODE_TMPDIR = M), (O.TMPPREFIX = SG$.join(M, "zsh")));
  }
  return O;
},

// READABLE (for understanding):
async function getEnvironmentOverrides(command, sessionEnvVars) {
  const tmuxValue = null;     // dormant in this build (see §3.2) — always null
  const overrides = {};

  // (1) ALWAYS: point subprocesses at the running claude binary.
  //     mx6 === "CLAUDE_CODE_EXECPATH". This is what the snapshot's argv0
  //     functions read into `_cc_bin` (§4).
  overrides[CLAUDE_CODE_EXECPATH] = process.execPath;
  if (tmuxValue) overrides.TMUX = tmuxValue;        // never taken while tmuxValue===null

  // (2) Caller-supplied extra env pairs (per-tool-call overrides from hooks).
  if (sessionEnvVars) {
    for (const [key, value] of sessionEnvVars) overrides[key] = value;
  }

  // (3) Sandbox temp redirection — only when buildExecCommand captured a sandbox tmp dir.
  if (sandboxTmpDir) {
    let tmpDir = sandboxTmpDir;
    if (getPlatform() === "windows") tmpDir = toCygwinPath(tmpDir);  // posix path for cygwin shell
    overrides.TMPDIR = tmpDir;
    overrides.CLAUDE_CODE_TMPDIR = tmpDir;
    overrides.TMPPREFIX = pathPosix.join(tmpDir, "zsh");  // zsh writes temp scratch under this prefix
  }
  return overrides;
}

// Mapping: A→command, Y→sessionEnvVars, f→tmuxValue, O→overrides,
//   mx6→CLAUDE_CODE_EXECPATH, q→sandboxTmpDir, M→tmpDir, n$→getPlatform,
//   cW→toCygwinPath, SG$→pathPosix
```

**What it does:** Returns a flat `{key:value}` object the exec layer spreads **last** into the spawn `env`, so these keys win over `subprocessEnv()` and the fixed `SHELL`/`GIT_EDITOR`/`CLAUDECODE` keys. Up to five keys can be set across three groups.

### 3.1 Group 1 — `CLAUDE_CODE_EXECPATH` (always)

`overrides[mx6] = process.execPath` (`cli_inner_pretty.js:341406`), where `mx6 = "CLAUDE_CODE_EXECPATH"` (`cli_inner_pretty.js:341166`). This is set on **every** Bash tool call, unconditionally.

**Why:** `process.execPath` is the absolute path of the currently-running claude binary (the bun executable). The snapshot's argv0 dispatch functions — `rg`, `find`, `grep`, written by `createArgv0ShellFunction` (`xx6`, `cli_inner_pretty.js:340924`) — read this exact variable into `_cc_bin` (`cli_inner_pretty.js:340941`, see §4). Exporting it on every command is what makes those functions resolve to the *real* running binary rather than whatever `claude` happens to be on `PATH`. This is the env-side half of a contract whose shell-side half lives in the snapshot file; §4 ties them together.

### 3.2 Group 1b — `TMUX` (dormant)

`f` (`tmuxValue`) is hard-initialized to `null` at `cli_inner_pretty.js:341404`, so `if (((O[mx6] = ...), f)) O.TMUX = f` (`cli_inner_pretty.js:341406`) can **never** set `TMUX` in this build — the `f` guard is always falsy. The branch and the `O.TMUX = f` slot are vestigial: a parameter for a captured tmux socket existed in earlier lineages, but in both v2.1.142 and v2.1.156 the value is statically `null`. This is **unchanged from v2.1.142** (the v2.1.142 `env_snapshot.md` notes "the feature exists but is dormant in this build", `f = null`). Documented here only so readers don't expect `TMUX` to flow through.

### 3.3 Group 2 — Caller-supplied extra env pairs

`if (Y) for (let [M, j] of Y) O[M] = j` (`cli_inner_pretty.js:341407`). `Y` (`sessionEnvVars`) is an iterable of `[key, value]` pairs (a `Map`) threaded from the Bash tool caller. These are per-tool-call overrides — the session-env hook system uses this to inject scratch variables for one command. Because they are written **after** `CLAUDE_CODE_EXECPATH`/`TMUX` but **before** the sandbox triple, the sandbox `TMPDIR`/`TMPPREFIX` would re-win over any `TMPDIR` a hook tried to set (when a sandbox is active).

### 3.4 Group 3 — Sandbox temp redirection (conditional)

When `q` (`sandboxTmpDir`) is truthy (`cli_inner_pretty.js:341408-341412`), three keys are set to the sandbox tmp dir:

- `TMPDIR` — POSIX standard; redirects most temp-file creation.
- `CLAUDE_CODE_TMPDIR` — Claude-specific; read by `getTmpDir` (`vd`, `cli_inner_pretty.js:176735-176738`), which returns `CLAUDE_CODE_TMPDIR` if set, else `os.tmpdir()`. Setting it keeps Claude's own temp-file helpers inside the sandbox.
- `TMPPREFIX = SG$.join(tmpDir, "zsh")` (`cli_inner_pretty.js:341411`) — **zsh-specific.** zsh writes here-doc / here-string / process-substitution scratch files to `$TMPPREFIX*`; if it points outside the sandbox, zsh would create files the sandbox denies, breaking commands that use `<(...)` or `<<<`. Anchoring it inside the sandbox keeps those scratch writes legal.

On Windows the sandbox path is rewritten with `cW` (`toCygwinPath`, `cli_inner_pretty.js:341410`) so the cygwin/msys shell sees a POSIX-style path. `SG$` is `path/posix` (`cli_inner_pretty.js:341430`), so `TMPPREFIX` is always joined with `/` regardless of host OS — correct, because the value is consumed by a POSIX shell, not by Node's host-path layer.

`q` is captured from `Y.sandboxTmpDir` inside `buildExecCommand` (`cli_inner_pretty.js:341370`). So **this group only fires when the current command runs sandboxed** — i.e. `buildExecCommand` saw a non-null `sandboxTmpDir` for this call.

**Why this approach:** The adapter has no idea whether sandboxing is on until `buildExecCommand` is invoked with the per-call context `Y`. Rather than recompute it, `buildExecCommand` stashes `Y.sandboxTmpDir` into the closure and `getEnvironmentOverrides` reads it back. This keeps the env overlay a pure function of closure state and avoids re-threading the sandbox decision through a second parameter. The trade-off is the same ordering coupling as `getSpawnArgs`: `buildExecCommand` must run first.

**Key insight:** `getEnvironmentOverrides` only sets the **EXECPATH contract key** unconditionally; everything else is conditional on dormant state (`TMUX`), the caller (`sessionEnvVars`), or the sandbox (`q`). The one key that always flows is precisely the one the snapshot file *needs* in order to dispatch embedded tools.

---

## 4. Why CLAUDE_CODE_EXECPATH Is Load-Bearing: the argv0 `_cc_bin` Contract

The reason `getEnvironmentOverrides` exports `CLAUDE_CODE_EXECPATH` on every call is that the **snapshot file consumes it**. When `createArgv0ShellFunction` (`xx6`) emits the `rg`/`find`/`grep` shadow functions into the snapshot, the function body begins:

```javascript
// ============================================
// createArgv0ShellFunction (_cc_bin resolution) - reads CLAUDE_CODE_EXECPATH at runtime
// Location: cli_inner_pretty.js:340941-340943
// ============================================

// ORIGINAL (for source lookup):
`  local _cc_bin="\${${mx6}:-}"`,                              // mx6 === "CLAUDE_CODE_EXECPATH"
`  [[ -x $_cc_bin ]] || _cc_bin=${O4([Y])}`,                  // Y = baked <home>/.local/bin/claude[.exe]
`  if [[ ! -x $_cc_bin ]]; then command ${H} "$@"; return; fi`,// neither works -> system tool

// READABLE (for understanding):
//   local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"     # 1st choice: env var from getEnvironmentOverrides
//   [[ -x $_cc_bin ]] || _cc_bin=<baked claude>   # 2nd choice: install-bin path baked at snapshot time
//   if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi   # else fall back to the real system tool

// Mapping: mx6→CLAUDE_CODE_EXECPATH, O4→shellQuote, Y→bakedClaudePath, H→funcName
```

The chain is: **env var (preferred) → baked install path → system tool**. `getEnvironmentOverrides` supplies the *preferred* first link. Setting it on every command ensures that even if the user's shell or the snapshot were created under a different install, the running binary's own path is what the embedded `rg`/`bfs`/`ugrep` dispatch uses. Without the env override, the function would skip to the baked `<home>/.local/bin/claude` fallback (`cli_inner_pretty.js:340927,340942`), which could be stale or a different version. The full argv0 dispatch mechanism is its own topic; here the point is only that **`getEnvironmentOverrides` and the snapshot's argv0 functions are two halves of one contract**, joined by the constant `mx6`.

---

## 5. The cwd-File Mechanism (CWD Tracking Across Calls)

Each spawned shell is `bash -c CMD` (or `-c -l CMD`) — a fresh process. A `cd` inside command N does **not** persist to command N+1, because the process exits. To track working directory across calls, `buildExecCommand` appends a `pwd -P >| <cwdFile>` to the command chain and the exec layer reads that file back afterward.

```javascript
// ============================================
// buildExecCommand (cwd-file + pwd-write) - per-call CWD tracking
// Location: cli_inner_pretty.js:341371-341375, 341393, 341396
// ============================================

// ORIGINAL (for source lookup):
let O = vd(),                                                   // tmp root (CLAUDE_CODE_TMPDIR or os.tmpdir)
  M = n$() === "windows",
  j = M ? cW(O) : O,
  w = Y.useSandbox ? SG$.join(Y.sandboxTmpDir, `cwd-${Y.id}`) : SG$.join(j, `claude-${Y.id}-cwd`),   // shell-side path
  D = Y.useSandbox ? SG$.join(Y.sandboxTmpDir, `cwd-${Y.id}`) : Zs7.join(O, `claude-${Y.id}-cwd`);    // Node-side path
// ...
(P.push(`eval ${L}`), P.push(`pwd -P >| ${O4([w])}`));         // run command, then record cwd
// ...
return { commandString: G, cwdFilePath: D };                   // exec layer reads D after the shell exits

// READABLE (for understanding):
const tmpRoot = getTmpDir();                       // vd(): CLAUDE_CODE_TMPDIR ?? os.tmpdir()
const isWindows = getPlatform() === "windows";
const shellTmpRoot = isWindows ? toCygwinPath(tmpRoot) : tmpRoot;   // path the shell will write through
// shell-side path (cygwin/posix style) the `pwd -P >|` writes:
const cwdFileShellPath = ctx.useSandbox
  ? pathPosix.join(ctx.sandboxTmpDir, `cwd-${ctx.id}`)
  : pathPosix.join(shellTmpRoot, `claude-${ctx.id}-cwd`);
// Node-side path the exec layer reads back (host path style):
const cwdFileNodePath = ctx.useSandbox
  ? pathPosix.join(ctx.sandboxTmpDir, `cwd-${ctx.id}`)
  : pathHost.join(tmpRoot, `claude-${ctx.id}-cwd`);
// ...append to the && chain:
chainParts.push(`eval ${wrappedCommand}`);
chainParts.push(`pwd -P >| ${shellQuote([cwdFileShellPath])}`);  // overwrite cwd file with resolved cwd
// ...
return { commandString, cwdFilePath: cwdFileNodePath };

// Mapping: vd→getTmpDir, O→tmpRoot, j→shellTmpRoot, w→cwdFileShellPath, D→cwdFileNodePath,
//   Y.useSandbox→ctx.useSandbox, Y.id→ctx.id, Y.sandboxTmpDir→ctx.sandboxTmpDir,
//   SG$→pathPosix, Zs7→pathHost, n$→getPlatform, cW→toCygwinPath, O4→shellQuote
```

**How it works:**
1. `vd()` (`getTmpDir`, `cli_inner_pretty.js:176735`) yields the tmp root — `CLAUDE_CODE_TMPDIR` if set, else `os.tmpdir()`. The cwd file lives **in the tmp dir**, not the cwd.
2. The file name encodes the call id `Y.id`: outside a sandbox it is `claude-${id}-cwd` (`cli_inner_pretty.js:341374-341375`); inside a sandbox it is `cwd-${id}` under `sandboxTmpDir` (`cli_inner_pretty.js:341374-341375`). Two parallel variables are computed: `w`/`cwdFileShellPath` is the path the **shell** writes (cygwin-converted on Windows via `cW`), and `D`/`cwdFileNodePath` is the path **Node** reads back (host path style via `Zs7` = `require("path")`). On non-Windows the two coincide.
3. After `eval <command>`, the chain appends `pwd -P >| <cwdFileShellPath>` (`cli_inner_pretty.js:341393`). `pwd -P` prints the physical (symlink-resolved) working directory. `>|` is the noclobber-override redirect: it truncates-and-writes even if the user has `set -o noclobber`, so the cwd file is always overwritten cleanly.
4. `buildExecCommand` returns `{ commandString, cwdFilePath: D }` (`cli_inner_pretty.js:341396`). The exec layer, after the shell exits, reads `cwdFilePath` and uses it to update the session's tracked cwd, so the **next** Bash tool call spawns with `cwd` set to where the previous command ended up.

**Why this approach:** A new process per command is the only safe model (an isolated shell can't corrupt Claude's own process state, can be killed as a group via `detached`, and starts from a clean snapshot). The cost is losing in-process `cd` state. Writing `pwd -P` to a file is the cheapest way to ferry one string out of an ephemeral process — no extra IPC, no stdout parsing (which would tangle with the command's own output), just a file the parent reads. Using `pwd -P` (physical) rather than `pwd` (logical) means a tracked path is always a real directory, so the next spawn's `cwd:` can't point at a stale symlink. The trade-off is one small temp file per call id, swept by the same temp-dir lifecycle as the snapshot itself.

**Key insight:** `getSpawnArgs`/`getEnvironmentOverrides` handle *how the shell starts*; the cwd file handles *what the shell leaves behind*. Together they make a series of independent `bash -c` invocations behave like one stateful interactive session — same functions/aliases (snapshot), same env (overrides), same working directory (cwd file) — without ever keeping a long-lived shell alive.

---

## 6. CWD Read-Back Gating, Bash Concurrency, and How the Model Learns the Working Directory

§5 covered the *write* side (`pwd -P >| <cwdFile>` is appended to every command). This section covers three downstream consequences that the write side enables: **when** the cwd is read back into session state, **whether** that interacts with parallel Bash calls, and **how** the model ever sees the working directory. All three are properties of the **exec layer** (`R6H`, the function that consumes the adapter) and the **tool scheduler**, not of the snapshot itself — but they are the reason the snapshot's stateless fresh-shell model is viable.

### 6.1 The read-back is gated by `preventCwdChanges` and `backgroundTaskId`

The write (`pwd -P`) happens unconditionally on every command (§5). The **read-back** — turning that file into the session's tracked cwd — is conditional. After the shell exits, `R6H` (the executor, `cli_inner_pretty.js:341610`) runs:

```javascript
// ============================================
// R6H (cwd read-back tail) - persist post-command cwd into session state, conditionally
// Location: cli_inner_pretty.js:341760-341776
// ============================================

// ORIGINAL (for source lookup):
let l = n$() === "windows" ? PGH(P) : P;                       // P = cwdFilePath from buildExecCommand
return (
  Q.result.then(async (c) => {
    if (Y) Oq.cleanupAfterCommand();
    if (c && !A && !c.backgroundTaskId)                        // A = preventCwdChanges
      try {
        let r = VU.readFileSync(l, { encoding: "utf8" }).trim();
        if (n$() === "windows") r = PGH(r);
        if (r.normalize("NFC") !== W) {                        // W = starting cwd
          if ((PD(r, W), !imH())) (ciH(), kv7(W, r));          // PD = setCwd; ciH/kv7 = invalidate + hooks
        }
      } catch { d("tengu_shell_set_cwd", { success: !1 }); }
    try { VU.unlinkSync(l); } catch {}                         // file deleted every command
  }),
  Q
);

// READABLE (for understanding):
const cwdFileNodePath = isWindows ? toWindowsPath(cwdFilePath) : cwdFilePath;
return (
  task.result.then(async (result) => {
    if (useSandbox) Sandbox.cleanupAfterCommand();
    // Persist the new cwd ONLY for foreground, main-thread, non-background commands:
    if (result && !preventCwdChanges && !result.backgroundTaskId) {
      try {
        let newCwd = readFileSync(cwdFileNodePath, "utf8").trim();
        if (isWindows) newCwd = toWindowsPath(newCwd);
        if (newCwd.normalize("NFC") !== startCwd) {            // NFC: avoid APFS NFD false-positives
          setCwd(newCwd, startCwd);                            // -> tn8 -> setCwdState (sKH)
          if (!isInteractiveRepl()) { invalidateSessionEnvCache(); onCwdChangedForHooks(startCwd, newCwd); }
        }
      } catch { logEvent("tengu_shell_set_cwd", { success: false }); }
    }
    try { unlinkSync(cwdFileNodePath); } catch {}              // ephemeral: removed after every command
  }),
  task
);

// Mapping: R6H→executeShellCommand, P→cwdFilePath, A→preventCwdChanges, W→startCwd,
//   PD→setCwd, ciH→invalidateSessionEnvCache, kv7→onCwdChangedForHooks, imH→isInteractiveRepl,
//   PGH→toWindowsPath, d→logEvent, Q→bashTask
```

**The gate has three conditions** (`cli_inner_pretty.js:341764`): the command produced a result (`c`), it is **not** `preventCwdChanges` (`!A`), and it did **not** background itself (`!c.backgroundTaskId`). The decisive one is `preventCwdChanges` (`A`), which `R6H` reads from its options (`cli_inner_pretty.js:341614`). It is set by the Bash tool's call generator from whether this is the main thread:

```javascript
// ============================================
// Bash tool call - derives preventCwdChanges from isMainThread
// Location: cli_inner_pretty.js:439846-439856
// ============================================

// ORIGINAL (for source lookup):
L = !$.agentId,                 // isMainThread: true when there is no agentId (the top-level session)
P = !L,                         // preventCwdChanges = !isMainThread
// ...
let Q = oU_({ input: H, /* ... */ preventCwdChanges: P, isMainThread: L, /* ... */ });

// READABLE (for understanding):
const isMainThread = !ctx.agentId;          // subagents carry an agentId; the main session does not
const preventCwdChanges = !isMainThread;    // -> subagents DO NOT persist cwd
// ...
bashCallGenerator({ input, preventCwdChanges, isMainThread, /* ... */ });

// Mapping: $.agentId→ctx.agentId, L→isMainThread, P→preventCwdChanges, oU_→bashCallGenerator
```

So the resolved policy is:

| Caller | `preventCwdChanges` | cwd read back & persisted? |
|---|---|---|
| **Main session**, foreground command | `false` | **Yes** — `setCwd` updates the tracked cwd |
| **Subagent / agent thread** (`ctx.agentId` set) | `true` | **No** — each bash call starts from the same cwd |
| Any command that **backgrounds** (`run_in_background` / auto-bg) | n/a (`backgroundTaskId` set) | **No** — a bg process's final cwd is meaningless |

This is why the subagent system prompt explicitly warns *"Agent threads always have their cwd reset between bash calls, as a result please only use absolute file paths"* (`oT$`, `cli_inner_pretty.js:555811`): for subagents the read-back never fires, so `cd` in one call is invisible to the next.

The persist chain is `PD` (`setCwd`, `cli_inner_pretty.js:341792`) → `tn8` (`cli_inner_pretty.js:42230`) → `sKH` (`setCwdState`, `cli_inner_pretty.js:2401`). That in-memory state is what `getCwd` (`C$`) returns — the link that §6.4 depends on.

### 6.2 Bash concurrency is gated by `isReadOnly`, and `cd` is read-only

A Bash call may run **in parallel** with other tool calls iff it is concurrency-safe, and the Bash tool defines that as exactly "is the command read-only":

```javascript
// ============================================
// Bash tool - isConcurrencySafe delegates entirely to isReadOnly
// Location: cli_inner_pretty.js:439696-439702
// ============================================

// ORIGINAL (for source lookup):
isConcurrencySafe(H) { return this.isReadOnly?.(H) ?? !1; },
isReadOnly(H) {
  let $ = xV$(H.command);                     // xV$ = commandHasAnyCd
  return nz8(H, $).behavior === "allow";      // nz8 = checkReadOnlyConstraints
},

// READABLE (for understanding):
isConcurrencySafe(input) { return this.isReadOnly?.(input) ?? false; },
isReadOnly(input) {
  const compoundHasCd = commandHasAnyCd(input.command);
  return checkReadOnlyConstraints(input, compoundHasCd).behavior === "allow";
},

// Mapping: xV$→commandHasAnyCd, nz8→checkReadOnlyConstraints, H→input
```

The classifier `checkReadOnlyConstraints` (`nz8`, `cli_inner_pretty.js:242978`) returns `behavior:"allow"` only when **every** subcommand of a compound is read-only. Critically, **`cd` itself is in the read-only set** — its read-only regex is `cli_inner_pretty.js:244115` (`/^cd(?:\s+…)?$/`). So:

- `cd /a`, `cd /a && ls`, `cd /a && grep x` → all subcommands read-only → `allow` → **concurrency-safe** (even though they change the directory).
- `cd /a && npm install`, `cd /a && rm x`, `echo x > f` → contains a non-read-only subcommand → not read-only → **serialized**. (The serialization is caused by `npm install`/`rm`/redirect, *not* by `cd`.)
- `cd /a && git status` → special-cased to `passthrough` (`cli_inner_pretty.js:242999`, "Compound commands with cd and git require permission checks") — a sandbox-escape guard, so it is **not** concurrency-safe.

The scheduler then turns the per-call flag into actual parallelism (`cli_inner_pretty.js:447608-447617`):

```javascript
// ============================================
// Tool scheduler - read-only tools run in parallel; a non-safe tool is a barrier
// Location: cli_inner_pretty.js:447608-447617
// ============================================

// ORIGINAL (for source lookup):
canExecuteTool(H) {
  let $ = this.tools.filter((q) => q.status === "executing");
  return $.length === 0 || (H && $.every((q) => q.isConcurrencySafe));
}
async processQueue() {
  for (let H of this.tools) {
    if (H.status !== "queued") continue;
    if (this.canExecuteTool(H.isConcurrencySafe)) await this.executeTool(H);
    else if (!H.isConcurrencySafe) break;
  }
}

// READABLE (for understanding):
canExecuteTool(candidateIsSafe) {
  const running = this.tools.filter((t) => t.status === "executing");
  // start now if nothing is running, OR candidate + all running are concurrency-safe
  return running.length === 0 || (candidateIsSafe && running.every((t) => t.isConcurrencySafe));
}
async processQueue() {
  for (const t of this.tools) {
    if (t.status !== "queued") continue;
    if (this.canExecuteTool(t.isConcurrencySafe)) await this.executeTool(t); // executeTool does NOT await completion
    else if (!t.isConcurrencySafe) break;                                    // a write tool is a hard barrier
  }
}

// Mapping: H→candidateIsSafe, $→running (executing tools), q/H(loop)→tool,
//   canExecuteTool/processQueue/executeTool are methods of the tool-scheduler class (04_tools)
```

`executeTool` starts the tool and attaches `promise.finally(() => this.processQueue())` **without awaiting completion** (`cli_inner_pretty.js:447752-447755`), so multiple read-only tools genuinely overlap, and each completion re-drives the queue. Net behavior: **read-only Bash commands run in parallel** with each other (and with `Read`/`Grep`/`Glob`); a **mutating Bash command runs alone**, blocking later tools until it finishes. There is **no numeric concurrency cap** — the gate is purely read-only safety.

### 6.3 Cross-validation of the concurrent cwd-changing case

The earlier conclusion — *"the main session running two cwd-changing read-only commands in one batch (e.g. `cd /a && ls` and `cd /b && cat y`) races on the tracked cwd"* — holds, and here is the exact mechanism, each step source-anchored:

1. **Both are concurrency-safe.** `cd /a && ls`: subcommands `cd /a` (read-only via `244115`) + `ls` (read-only) → `nz8` returns `allow` → `isConcurrencySafe = true`. Same for `cd /b && cat y`. (`cli_inner_pretty.js:439696-439702`, `242978`.)
2. **The scheduler starts both in parallel.** `canExecuteTool` sees both safe → both move to `executing`; `executeTool` does not block (`cli_inner_pretty.js:447610`, `447752-447755`).
3. **No cwd-file collision.** Each command's id is a fresh random 4-hex minted per invocation in `R6H` — `J = Math.floor(Math.random()*65536).toString(16).padStart(4,"0")` (`cli_inner_pretty.js:341623`), passed as `id: J` to `buildExecCommand` (`cli_inner_pretty.js:341628`). So the two commands write `claude-<idA>-cwd` and `claude-<idB>-cwd` — **distinct files** (§5). The snapshot is only *read* (`source … 2>/dev/null`), so concurrent reads are safe too.
4. **Each command is individually correct.** Both spawn fresh shells from the same start cwd `W` (`cli_inner_pretty.js:341626`, `vd`/`jU$` resolved at build time), `cd` within their own process, and run their read. Neither can corrupt the other's shell.
5. **The tracked cwd is last-writer-wins.** Both are main-thread foreground → both pass the read-back gate (`!preventCwdChanges && !backgroundTaskId`, `cli_inner_pretty.js:341764`) → both call `PD`/`setCwd`. Because each read-back runs in its own `Q.result.then` continuation, the tracked cwd ends as whichever command's continuation resolves **last**.

**Conclusion (verified):** the *commands themselves* are always correct; only the **session's persisted cwd for the *next* command** is nondeterministic when ≥2 cwd-changing read-only commands run in the same parallel batch. This is a benign soft side-effect, not a correctness bug. In practice it rarely triggers — a `cd` meant to set up later commands is normally issued alone, and the system prompt actively discourages `cd` (see §6.4). This matches v2.1.88 exactly: the read-back gate `if (result && !preventCwdChanges && !result.backgroundTaskId)` (`Shell.ts:395`), the per-command file `claude-${opts.id}-cwd` (`bashProvider.ts:118`), and `isConcurrencySafe → isReadOnly` (`BashTool.tsx:434`) are all byte-identical; `cd` is read-only there too (`readOnlyValidation.ts:1704`, *"hand-written regexes in `READONLY_COMMAND_REGEXES` (uniq, jq, cd)"*).

### 6.4 How the model learns the working directory (the cwd is NOT injected per command)

A Bash tool **result does not contain the cwd** — there is no per-command pwd injected into the conversation. Instead the working directory reaches the model through the **system prompt's `<env>` block**, which is rebuilt on every request and embeds the **live** tracked cwd:

```javascript
// ============================================
// tXz (env block) - embeds live getCwd() into the per-request system prompt
// Location: cli_inner_pretty.js:555702-555704
// ============================================

// ORIGINAL (for source lookup):
return `Here is useful information about the environment you are running in:
<env>
Working directory: ${C$()}
Is directory a git repo: ${q ? "Yes" : "No"}
...`;

// READABLE (for understanding):
return `Here is useful information about the environment you are running in:
<env>
Working directory: ${getCwd()}          // live tracked cwd — updated by §6.1 read-back
Is directory a git repo: ${isGitRepo ? "Yes" : "No"}
...`;

// Mapping: C$→getCwd, tXz→buildEnvironmentBlock
```

The refresh path is **per LLM request**: the query assembler calls `CN_` (`cli_inner_pretty.js:396878`, `OH = … await CN_(H, q, x, vH)`), which builds the base system prompt then appends the env block via `oT$` → `tXz` (`cli_inner_pretty.js:397181-397184`). Because `tXz` calls `C$()` (`getCwd`) at build time, and `getCwd` returns the in-memory state that §6.1's `setCwd` updated, **the next request after a main-thread `cd` shows the new working directory** in `<env>`. No conversation message is needed; the cwd lives in the (re-rendered) system prompt.

Three secondary signals reinforce it:

- **Tool guidance.** The Bash tool description states *"Working directory persists between calls, but prefer absolute paths — `cd` in a compound command can trigger a permission prompt"* (`cli_inner_pretty.js:439076`), and a dedicated line urges *"Try to maintain your current working directory throughout the session by using absolute paths and avoiding usage of `cd`"* (`cli_inner_pretty.js:439138`). The model is told the directory persists **and** discouraged from relying on `cd` — which is also why the §6.3 race almost never matters.
- **Path-not-found hint.** When a `Read`/`Glob` path doesn't resolve, the error appends `cy` = *"Note: your current working directory is"* + `getCwd()` (`cli_inner_pretty.js:44410`, used at `cli_inner_pretty.js:278579`, `422890`, `434412`) — a corrective nudge that re-surfaces the live cwd exactly when the model guessed a wrong relative path.
- **Reset warning.** If the tracked cwd was deleted out from under the session, the next command's output is prefixed with `mX8` = *"Shell cwd was reset to "* + `getCwd()` (`cli_inner_pretty.js:341963`), extracted from stderr by the regex `f_4` (`cli_inner_pretty.js:390527`). `R6H` also self-heals a vanished cwd by recovering to the first existing of `[projectDir, homedir, tmp]` and telling the model to re-issue the command (`cli_inner_pretty.js:341640-341655`).

**Key insight:** the working directory is **pull, not push** — it is not streamed into each tool result; it is read out of live session state (`getCwd`) every time the system prompt is rendered. The `pwd -P` file (§5) is the only thing that keeps that state current across stateless fresh shells, and `preventCwdChanges` (§6.1) is what decides whether a given command is allowed to move it. For subagents — where `preventCwdChanges` is always true — the cwd never moves, so they are told upfront to use absolute paths.

> **Answering the two questions directly.** (1) *Is a pwd-modifying command unable to run in parallel?* No — parallelism is gated on `isReadOnly`, and `cd` is read-only, so `cd X && <read-only>` **can** run in parallel; only a non-read-only subcommand (write/install/delete) forces serialization. The single real cwd-related consequence of parallelism is the last-writer-wins nondeterminism in §6.3, which affects the *next* command's start directory, never the running commands. (2) *Is the cwd injected into context each run?* No — it is not in the tool result; the model learns it from the per-request `<env>` block (`Working directory: ${getCwd()}`), kept live by the §6.1 read-back, plus the error/guidance nudges above.

---

## 7. Cross-Validation

### vs v2.1.88 clean TypeScript (`ShellSnapshot.ts`)

The v2.1.88 reference (`/lyz/codespace/3rd/claude-code/src/utils/bash/ShellSnapshot.ts`) **has no adapter object at all.** It exports `createAndSaveSnapshot`, `createRipgrepShellIntegration`, `createFindGrepShellIntegration` and the script builders, but **there is no `createBashShellProvider`/`createBashShellAdapter`, no `getSpawnArgs`, and no `getEnvironmentOverrides`** in that file. The whole `{ type, shellPath, detached, buildExecCommand, getSpawnArgs, getEnvironmentOverrides }` adapter lives in a separate exec module not present in this TS snapshot. So:

- **`getSpawnArgs` login-skip logic** — cannot be confirmed in v2.1.88 `ShellSnapshot.ts` because the method is not in that file. What v2.1.88 `ShellSnapshot.ts` *does* show (lines 456-458) is that **snapshot creation** itself runs `execFile(binShell, ['-c', '-l', snapshotScript], ...)` — i.e. login shell is used to *build* the snapshot, consistent with the 2.1.156 design where the per-command path then *skips* `-l` because that state is already captured.
- **`getEnvironmentOverrides` (EXECPATH/TMUX/sandbox triple)** — not present in v2.1.88 `ShellSnapshot.ts`. NEW relative to that file (it lives in the exec module).
- **The argv0 `_cc_bin` env contract** — v2.1.88 `ShellSnapshot.ts` `createArgv0ShellFunction` (lines 35-59) does **not** read `CLAUDE_CODE_EXECPATH`; it hard-codes `quote([binaryPath])` and dispatches via `ARGV0=… <quotedPath>`. There is **no `_cc_bin`, no env-var lookup, no baked-path fallback, no deny-pattern loop.** The `${CLAUDE_CODE_EXECPATH:-}` → baked-path → system-tool chain (`cli_inner_pretty.js:340941-340943`) is therefore **NEW vs v2.1.88** — and it is exactly what makes `getEnvironmentOverrides`' `CLAUDE_CODE_EXECPATH` export load-bearing. In v2.1.88 the env var would have been inert.

### vs v2.1.142 reference doc

The v2.1.142 `bash_tool_integration.md` / `env_snapshot.md` describe the same adapter under the lineage name `createBashShellProvider` (`$U7`). Comparing method-for-method against 2.1.156:

| Aspect | v2.1.142 | v2.1.156 | Change |
|---|---|---|---|
| Factory name | `createBashShellProvider` (`$U7`) | `createBashShellAdapter` (`Gs7`) | Renamed (use `createBashShellAdapter`; `createBashShellProvider`/`$U7` is the alias) |
| `getSpawnArgs` body | `["-c", ...(hasSnapshot?[]:["-l"]), z]` | `["-c", ...(hasSnapshot?[]:["-l"]), A]` | **Identical logic**; param renamed `z→A` |
| Login-skip log string | `"Spawning shell without login (-l flag skipped)"` | same (`cli_inner_pretty.js:341400`) | Unchanged |
| `getEnvironmentOverrides` structure | EXECPATH + (null TMUX) + extra + sandbox triple | same (`cli_inner_pretty.js:341403-341413`) | **Identical**; symbol renames only |
| EXECPATH constant | `Rv6` | `mx6` (`cli_inner_pretty.js:341166`) | Renamed; same value `"CLAUDE_CODE_EXECPATH"` |
| posix-join helper | `kX$` | `SG$` = `path/posix` (`cli_inner_pretty.js:341430`) | Renamed |
| windows-path helper | `MP` | `cW` (`toCygwinPath`) | Renamed |
| getPlatform | `c$` | `n$` | Renamed |
| TMUX | dormant (`f=null`) | dormant (`f=null`, `cli_inner_pretty.js:341404`) | Unchanged |
| Spawn-env probe at factory | not wired | `ws7(H).catch(()=>{})` fired at `cli_inner_pretty.js:341353` | **NEW** — see below |
| `n98(snapshot-present)` calls | n/a in this shape | `n98(A!==void 0)` at `341347`, `n98(!1)` at `341350`, `n98(f!==void 0)` at `341370` | **NEW** wiring into env-key union |

**What is genuinely NEW in 2.1.156 for this integration point:** not the two override methods themselves (those are structurally unchanged from v2.1.142), but their *surroundings* — the factory now (a) fires the spawn-env probe `ws7(H)` at creation (`cli_inner_pretty.js:341353`) and (b) feeds snapshot-presence into the env-key union via `n98` (`q97`) at `cli_inner_pretty.js:341347/341350/341370`. That union (`getKnownEnvKeys`/`iD$`, `cli_inner_pretty.js:209864`) is consumed by the bash permission/policy layer, and its allowlist `fV5` (`cli_inner_pretty.js:209879-209895`) now includes the **new** `CLAUDE_EFFORT` key. So in 2.1.156 the adapter both *applies* env overrides (`getEnvironmentOverrides`) and *advertises* which env keys are known/expected (via `n98` + `fV5`), connecting the snapshot subsystem to permission analysis — a wiring absent in v2.1.142's `bash_tool_integration.md` and in v2.1.88 entirely.

---

## 8. Summary

The bash shell adapter returned by `createBashShellAdapter` (`Gs7`, `cli_inner_pretty.js:341356-341415`) is a thin policy object with two override methods that the exec layer calls per command:

1. **`getSpawnArgs`** (`cli_inner_pretty.js:341398-341402`) returns `["-c", ...(hasSnapshot ? [] : ["-l"]), commandString]`. When the per-command snapshot path `_` is set, it omits `-l` (logging `"Spawning shell without login (-l flag skipped)"`) — because the snapshot file already contains the login-shell state, re-running the login chain would be redundant. This is the core latency win; the `-l` fallback is the safety net for missing snapshots.

2. **`getEnvironmentOverrides`** (`cli_inner_pretty.js:341403-341413`) always exports `CLAUDE_CODE_EXECPATH = process.execPath` (the constant `mx6`, the env half of the argv0 `_cc_bin` contract at `cli_inner_pretty.js:340941`), conditionally `TMUX` (dormant — `f=null`), the caller's `sessionEnvVars` pairs, and for sandbox the triple `TMPDIR` / `CLAUDE_CODE_TMPDIR` / `TMPPREFIX=<sandboxTmp>/zsh` from `q = Y.sandboxTmpDir` captured in `buildExecCommand` at `cli_inner_pretty.js:341370`.

Both methods read closure variables (`_`, `q`) that `buildExecCommand` sets, so the exec layer must call `buildExecCommand` first. `detached: true` (`cli_inner_pretty.js:341359`) makes the child a process-group leader for clean tree-kill. The `pwd -P >| <cwdFile>` tail (`cli_inner_pretty.js:341393`, file path from `getTmpDir`/`vd` at `cli_inner_pretty.js:176735`) ferries the post-command working directory out of the ephemeral shell so the next call resumes in the right place. Logic is structurally identical to v2.1.142's `createBashShellProvider`; what's new in 2.1.156 is the surrounding wiring — the spawn-env probe `ws7` and the `n98`-fed env-key union that links this adapter to permission policy.

§6 then traces three downstream consequences of the stateless fresh-shell model: (a) the cwd read-back is persisted only for **main-thread, foreground, non-background** commands (`!preventCwdChanges && !backgroundTaskId`, `cli_inner_pretty.js:341764`; `preventCwdChanges = !isMainThread`, `cli_inner_pretty.js:439846-439856`), so subagents never move their cwd and are told to use absolute paths; (b) Bash concurrency is gated purely on `isReadOnly` (`cli_inner_pretty.js:439696-439702`) — and since `cd` is read-only (`cli_inner_pretty.js:244115`), `cd X && <read-only>` runs in parallel while only a non-read-only subcommand serializes via the scheduler's barrier (`cli_inner_pretty.js:447608-447617`); (c) the model learns the cwd not from tool results but from the per-request `<env>` block `Working directory: ${getCwd()}` (`tXz`, `cli_inner_pretty.js:555704`; rebuilt each request via `CN_`, `cli_inner_pretty.js:396878`), kept live by the read-back. The one cwd hazard of parallelism — two cwd-changing read-only commands racing to last-writer-wins on the tracked cwd (§6.3) — affects only the *next* command's start directory, never the running commands, and is byte-for-byte the same mechanism as v2.1.88.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions
> - [symbol_additions_v2_1_156_permission_policy.md](../00_overview/symbol_additions_v2_1_156_permission_policy.md) — `Gs7` / `createBashShellAdapter` symbol-level coverage (do not restate here)

Key functions in this document:
- `createBashShellAdapter` (`Gs7`) — factory returning the `type:"bash"` shell adapter — cli_inner_pretty.js:341341
- `getSpawnArgs` (method of `Gs7`) — login-flag skip when snapshot present — cli_inner_pretty.js:341398
- `getEnvironmentOverrides` (method of `Gs7`) — per-call env overlay (EXECPATH/TMUX/extra/sandbox tmp) — cli_inner_pretty.js:341403
- `buildExecCommand` (method of `Gs7`) — assembles source/eval chain, sets `_`/`q`, appends `pwd -P >|` — cli_inner_pretty.js:341360
- `createArgv0ShellFunction` (`xx6`) — emits `_cc_bin`-resolving rg/find/grep functions; reads `CLAUDE_CODE_EXECPATH` — cli_inner_pretty.js:340924
- `CLAUDE_CODE_EXECPATH` (`mx6`) — env-name constant `"CLAUDE_CODE_EXECPATH"` — cli_inner_pretty.js:341166
- `getTmpDir` (`vd`) — `CLAUDE_CODE_TMPDIR` ?? `os.tmpdir()`; roots the cwd file — cli_inner_pretty.js:176735
- `getPlatform` (`n$`), `toCygwinPath` (`cW`), `pathPosix` (`SG$` = `path/posix`) — platform/path helpers used by the overrides
- `setSnapshotPresent` (`n98`) — feeds snapshot-presence into the env-key union `getKnownEnvKeys` (`iD$`) — cli_inner_pretty.js:209855

CWD tracking + concurrency interaction (§6 — exec layer / scheduler / prompt; primary owners are 04_tools, 37_permission_policy, and the prompt subsystem):
- `executeShellCommand` (`R6H`) — exec layer that consumes the adapter; mints the per-call random id and runs the cwd read-back — cli_inner_pretty.js:341610
- `setCwd` (`PD`) — resolves + persists the post-command cwd; chains to `tn8` → `setCwdState` (`sKH`) — cli_inner_pretty.js:341792
- `setCwdState` (`sKH`) / `getCwd` (`C$`) — the in-memory tracked-cwd state read by the `<env>` block — cli_inner_pretty.js:2401
- `bashCallGenerator` (`oU_`) — Bash tool `call` generator; derives `preventCwdChanges = !isMainThread` — cli_inner_pretty.js:439303
- `checkReadOnlyConstraints` (`nz8`) / `commandHasAnyCd` (`xV$`) — drive `isReadOnly` → `isConcurrencySafe`; `cd` read-only regex at cli_inner_pretty.js:244115 — cli_inner_pretty.js:242978
- `buildEnvironmentBlock` (`tXz`) — renders `Working directory: ${getCwd()}` into the per-request system prompt — cli_inner_pretty.js:555682
- `buildSystemPromptWithEnv` (`CN_`) — per-request assembler that appends the env block via `oT$` — cli_inner_pretty.js:397181
- `cwdHintPrefix` (`cy`) — `"Note: your current working directory is"` appended to path-not-found errors — cli_inner_pretty.js:44410
- `appendCwdResetWarning` (`mX8`) / `cwdResetRegex` (`f_4`) — `"Shell cwd was reset to <cwd>"` surfacing — cli_inner_pretty.js:341963 / 390527
