# Shell Snapshot Module (38_shell_snapshot) — v2.1.156

> Captures the user's interactive shell environment (functions, aliases, shell options, PATH) into a static `.sh` file at session start, then `source`s it before every Bash tool command so each command does NOT pay 200–500 ms re-sourcing `.bashrc`/`.zshrc`. The four headline 2.1.156 changes: (1) a **`-S dfs` flag** added to the embedded `bfs` find shadow (`cli_inner_pretty.js:340969`) that bounds open directory handles and fixes a macOS file/vnode-table exhaustion crash on large trees; (2) a **spawn-env probe** (`probeSpawnEnv` `ws7`, `cli_inner_pretty.js:341137`) that runs `shell -c env` once at adapter creation and unions the observed key names into the Bash permission engine via `getKnownEnvKeys` (`iD$`, `cli_inner_pretty.js:209864`); (3) the **exit-127 function-filter revert** — the v2.1.147 single-underscore filter regression is shipped in its **reverted** `grep -vE '^_[^_]'` form (`cli_inner_pretty.js:340998` zsh / `340998`/`341011` bash); and (4) **`CLAUDE_EFFORT`** added to the injected-env allowlist `CLAUDE_INJECTED_ENV_KEYS` (`fV5`, `cli_inner_pretty.js:209894`).

---

## Why Shell Snapshots Exist

Every Bash tool invocation spawns a brand-new shell process. There are three ways to make that shell behave like the user's interactive shell (so their aliases, functions, PATH additions, and shell options are present):

1. **Re-source `.bashrc`/`.zshrc` on every command** — spawn with `-l` (login) so the full init chain runs each time. Correct, but a real `.zshrc` with `nvm`/`pyenv`/`mise`/completion frameworks routinely costs 200–500 ms per command. Across a 100-command session that is 20–50 seconds of pure shell startup.
2. **Run nothing** — fast, but the user's aliases and functions vanish; `ll`, `gst`, `nvm use` all break.
3. **Capture once, replay cheaply** — run the user's full config **once** at session start in a login shell, freeze the resulting functions/options/aliases/PATH into a flat `.sh` file, then `source` that lightweight file before each command. This is what Claude Code does.

When a snapshot file exists, the per-command shell is spawned with **`-c`** instead of **`-c -l`** (`getSpawnArgs`, `cli_inner_pretty.js:341398-341402`): the login init chain is skipped entirely because the snapshot already contains its distilled output. The one-time ~10-second snapshot cost (`SNAPSHOT_CREATION_TIMEOUT` = `1e4` ms, `cli_inner_pretty.js:341165`) is overlapped with TUI/model/plugin startup — the promise is created eagerly in `createBashShellAdapter` (`Gs7`, `cli_inner_pretty.js:341345`) and awaited lazily inside `buildExecCommand`.

**Trade-off accepted:** the snapshot is a point-in-time freeze. If the user edits `.bashrc` mid-session, the running session keeps the stale snapshot — re-capturing per command would defeat the entire optimization. Graceful degradation: if snapshot creation fails or the file is later missing, the adapter falls back to `-l` (correct but slow) rather than running a broken shell.

---

## Documents in This Module

| Document | Purpose |
|----------|---------|
| [implementation.md](./implementation.md) | End-to-end lifecycle: trigger (`createBashShellAdapter` `Gs7`), creation (`js7`→`sD_`→`execFile`), consumption (`buildExecCommand`/`getSpawnArgs`), cleanup, and the 2.1.156 deltas at a glance |
| [snapshot_creation.md](./snapshot_creation.md) | Deep deobfuscation of `createAndSaveSnapshot` (`js7`) and `getSnapshotScript` (`sD_`) — orchestration, the `stat`-verify decision, the three-event telemetry taxonomy, failure callbacks |
| [config_file_detection.md](./config_file_detection.md) | `getConfigFile` (`ux6`), `getUserSnapshotContent` (`oD_`), `getClaudeCodeSnapshotContent` (`aD_`) — shell-specific capture, the bash base64 round-trip, and the exit-127 `grep -vE '^_[^_]'` regression/revert saga |
| [argv0_dispatch.md](./argv0_dispatch.md) | `createArgv0ShellFunction` (`xx6`) — the `argv[0]` multicall trick, the three-tier `_cc_bin` resolution, the four shell branches, and the deny-pattern early-return loop |
| [find_grep_integration.md](./find_grep_integration.md) | `createFindGrepShellIntegration` (`iD_`) — every prepended flag, the **new `-S dfs`** vnode-exhaustion fix, the ugrep deny-pattern allowlist, and the Oniguruma alternation gotcha |
| [ripgrep_integration.md](./ripgrep_integration.md) | `createRipgrepShellIntegration` (`lD_`) — function-vs-alias form, the `ripgrepCommand` (`hkH`) 3-mode resolution, and why rg is opt-in (system rg wins) |
| [command_assembly.md](./command_assembly.md) | `buildExecCommand` (consumer side): NUL substitution, pipe-safe wrap, eval wrapping, session-env hooks, extglob disable, and the `CLAUDE_CODE_SHELL_PREFIX` splice |
| [spawn_env_probe.md](./spawn_env_probe.md) | **NEW for 2.1.156:** the spawn-env probe `probeSpawnEnv` (`ws7`) + the four-way `getKnownEnvKeys` (`iD$`) union feeding the Bash permission/policy engine; the bare-assignment classification problem it solves |
| [bash_tool_integration.md](./bash_tool_integration.md) | The adapter object returned by `Gs7`: `getSpawnArgs` (`-l` skip when a snapshot exists) and `getEnvironmentOverrides` (`CLAUDE_CODE_EXECPATH`, TMUX, the sandbox `TMPDIR`/`TMPPREFIX` triple) |
| [retention_cleanup.md](./retention_cleanup.md) | Per-session `registerCleanup` (`$7`) unlink + the `cleanupPeriodDays` retention sweep `QC(…,".sh")` (`cli_inner_pretty.js:588103`), and the `claude project purge` "not project-scoped" warning |
| [cross_validation.md](./cross_validation.md) | Symbol-by-symbol and behaviour-by-behaviour cross-reference across v2.1.88 (clean TS) ↔ v2.1.142 ↔ v2.1.156, flagging Match / Behavior-changed / 2.1.156-only |
| [version_diff_2_1_88_to_2_1_156.md](./version_diff_2_1_88_to_2_1_156.md) | Compact behavioural diff: the architectural shifts and load-bearing invariants between the v2.1.88 readable source and the v2.1.156 bundle, with which deltas fall in the v2.1.142→156 window |

Plus shared symbol additions: [../00_overview/symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md)

---

## Architecture Diagram

Adapted from the v2.1.142 README and corrected for 2.1.156: the consumer is now `createBashShellAdapter` (`Gs7`), it fires the **new spawn-env probe `ws7`** alongside snapshot creation, the find shadow passes **`-S dfs`**, and the env-key union `getKnownEnvKeys` (`iD$`) wires the snapshot subsystem into the Bash permission engine.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              Session Start                                  │
│                                                                            │
│  detectShell()  ─────────►  createBashShellAdapter (Gs7)  cli:341341       │
│                                   │                                         │
│             ┌─────────────────────┼─────────────────────────────┐          │
│             │ (non-awaited)       │ (non-awaited, NEW 2.1.156)   │          │
│             ▼                     ▼                              ▼          │
│  createAndSaveSnapshot (js7)   probeSpawnEnv (ws7) cli:341137   returns     │
│   cli:341168                    │                              adapter obj  │
│      │                          │ shell -c env                 immediately  │
│      ▼                          │ parse KEY= via tD_ cli:341290             │
│  getConfigFile (ux6) cli:340982 │ store keys via i98 → l26                  │
│  pathExists (Z5) check          └──► getKnownEnvKeys (iD$) cli:209864       │
│  mkdir -p shell-snapshots                  │  null until snapshot+probe ready│
│  getSnapshotScript (sD_) cli:341109        │  union of:                     │
│      ├─ getUserSnapshotContent (oD_)       │   Object.keys(subprocessEnv()) │
│      │     functions/options/aliases       │   ∪ fV5 (injected,+CLAUDE_EFFORT)│
│      │     filter grep -vE '^_[^_]'        │   ∪ K97 (session env)          │
│      └─ getClaudeCodeSnapshotContent (aD_) │   ∪ l26 (probe result)         │
│            rg fallback (lD_)               │        │                       │
│            find/grep shadow (iD_) ◄─ -S dfs│        ▼                       │
│            PATH heredoc (random delim)     │  Bash permission/policy        │
│      │                                     │  cli:242985 / 440809 / 441400  │
│      ▼                                     └────────────────────────────────│
│  execFile(shell,["-c","-l",script]) cli:341187                             │
│      env:{subprocessEnv(),SHELL,GIT_EDITOR:true,CLAUDECODE:1}               │
│      timeout: VX8 = 1e4 (10s), maxBuffer 1MB                                │
│      ├─ ok → stat-verify size → registerCleanup ($7) → resolve(path)       │
│      └─ err → tengu_shell_snapshot_failed → resolve(undefined)             │
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
│  registerCleanup ($7) callback fires → unlink(snapshotPath)  cli:341240    │
│  Retention: QC(join(getClaudeConfigHomeDir(),"shell-snapshots"),".sh")     │
│             cli:588103  — deletes stale *.sh per cleanupPeriodDays          │
└────────────────────────────────────────────────────────────────────────────┘
```

The two non-awaited launches off `Gs7` — snapshot creation (`js7`) and the new probe (`ws7`) — run concurrently in the background; the adapter object is returned synchronously so the Bash tool is usable immediately. The probe is purely a side-channel for the permission engine: it does NOT block snapshot creation or command execution (`createBashShellAdapter` fires `ws7(H).catch(()=>{})` at `cli_inner_pretty.js:341353`).

---

## Key Algorithm: The Spawn-Env Probe and Env-Key Union (NEW in 2.1.156)

This is the headline architectural addition, **entirely absent** from the v2.1.88 clean source (`ShellSnapshot.ts` has no `env`-probing code) and from the v2.1.142 docs.

**What it does:** At adapter creation `probeSpawnEnv` (`ws7`) runs the user's shell once with `-c env`, scrapes every exported `KEY=` line into a *set of names*, and stores that set so the Bash permission engine can reason about which `VAR=…` assignments in a user command are *expected* (part of the real environment) versus *injected* by the command itself.

```javascript
// ============================================
// probeSpawnEnv - Background probe: run `shell -c env`, parse keys, feed permission engine
// Location: cli_inner_pretty.js:341137-341159
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
    let result = await execa(shellPath, ["-c", "env"], {       // NOTE: -c only (no -l): matches per-command spawn args
      reject: false, timeout: SNAPSHOT_CREATION_TIMEOUT, maxBuffer: 1048576,
      env: { ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()), SHELL: shellPath, GIT_EDITOR: "true", CLAUDECODE: "1" },
    });
    if (result.exitCode !== 0 || !result.stdout) { setSpawnEnvKeys(null); return; }  // null = "probe failed/pending"
    let keys = [];
    for (let line of result.stdout.split("\n")) { let m = line.match(envLineKeyRegex); if (m) keys.push(m[1]); }  // tD_ = /^([A-Za-z_][A-Za-z0-9_]*)=/
    setSpawnEnvKeys(keys);                                     // i98 → l26 : the real spawn-env key set
  } catch (e) { setSpawnEnvKeys(null); }
}

// Mapping: ws7→probeSpawnEnv, aJ→execa, yv→subprocessEnv, VX8→SNAPSHOT_CREATION_TIMEOUT, tD_→envLineKeyRegex,
//   i98→setSpawnEnvKeys, N→logForDebugging, H→shellPath, $→result, q→keys, K→line, _→m
```

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

**How it works (step by step):**
1. `createBashShellAdapter` fires `ws7(H).catch(()=>{})` fire-and-forget at `cli_inner_pretty.js:341353`, in parallel with `js7` (snapshot creation).
2. `ws7` runs `execa(shell, ["-c","env"], …)` — **`-c` only, no `-l`** — so it measures the environment of the *exact* shell kind the Bash tool will spawn once a snapshot exists.
3. Each stdout line is matched against `envLineKeyRegex` (`tD_`, `/^([A-Za-z_][A-Za-z0-9_]*)=/`, `cli_inner_pretty.js:341290`); the captured name (`m[1]`) is collected.
4. The name set is stored via `setSpawnEnvKeys` (`i98`, `cli_inner_pretty.js:209861`) into the global `l26`. On any failure it stores `null`, which `getKnownEnvKeys` treats as "probe not ready."
5. `getKnownEnvKeys` (`iD$`) returns `null` until both `setSnapshotPresent` (`n98`, `cli_inner_pretty.js:209855`) has set `q97` true AND the probe has resolved; otherwise it unions four sources and returns the set. Consumers are the Bash permission/policy engine at `cli_inner_pretty.js:242985`, `440809`, `441400`.

**Why this approach (rationale + alternatives + trade-offs):** The Bash permission analyzer wants to fast-path read-only commands, but a bare assignment like `LD_PRELOAD=/tmp/evil.so ls` *looks* read-only while re-arming the environment for every later command. A naive list of `process.env` keys would miss variables that only the user's `.zshrc`/login shell defines (`NVM_DIR`, `PYENV_ROOT`, …). Running `shell -c env` once and capturing those names gives the permission engine the *real* baseline. The union of four sources covers every legitimate origin: the sanitized parent env (`subprocessEnv`), Claude's own injections (`fV5`), session-scoped overrides (`K97`), and the shell's own additions (`l26`). The alternative — blocking command execution until the probe completes — was rejected because it would add up to 10 s of latency to the first command; instead the probe is fully asynchronous and `getKnownEnvKeys` *null-gates*, letting the permission engine fall back to a conservative policy during the brief startup window.

**Key insight:** `getKnownEnvKeys` returns **`null`, not an empty set**, when the data is not ready. An empty set would be interpreted as "no env keys are known/expected" and would mis-classify real env keys as injected; `null` is the explicit "be conservative" sentinel. This null-gate is the price of making the probe non-blocking.

---

## Key Algorithm: `-S dfs` on the find/bfs shadow (NEW in 2.1.156)

```javascript
// ============================================
// createFindGrepShellIntegration - bfs/ugrep shadows; NEW -S dfs bounds open dir handles
// Location: cli_inner_pretty.js:340964-340978
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
  if (!hasEmbeddedSearchTools()) return null;                  // RL(): true only on native (non-SDK) builds
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

**What changed:** v2.1.88 passed only `["-regextype","findutils-default"]` to the `find`→`bfs` shadow; v2.1.156 prepends **`-S dfs`** (`cli_inner_pretty.js:340969`). CONFIRMED absent in both `ShellSnapshot.ts` (which has the regextype pair only) and the v2.1.142 find_grep doc.

**Why this approach:** The underlying bug (per the changelog map) was *"`find` in the Bash tool exhausting the macOS system file/vnode table and crashing the host on large directory trees."* `bfs` defaults to **breadth-first** (`-S bfs`), which keeps an open directory file descriptor for every pending frontier level — on a huge tree this can exhaust the macOS vnode/open-file table and take down the host. `-S dfs` switches `bfs` to **depth-first**, bounding the number of concurrently open directory handles to roughly the path depth. The trade-off (DFS visits in a less cache-friendly order than BFS on some trees) is overwhelmingly worth avoiding a host crash.

**Key insight:** This is a one-token fix to a *host-stability* class of bug, not a search-correctness change — the result set is identical, only the traversal strategy (and its FD footprint) differs.

---

## Key Entry Points

Key functions in this module (readable name → obfuscated → role):

- `createAndSaveSnapshot` (`js7`) — top-level snapshot creation orchestrator; shell-type detection → script gen → execFile → stat-verify → cleanup register (`cli_inner_pretty.js:341168`)
- `createBashShellAdapter` (`Gs7`) — consumer; kicks off `js7` AND the new `ws7` probe, returns the bash adapter object (`cli_inner_pretty.js:341341`) — v2.1.142 lineage name was `createBashShellProvider` (`$U7`)
- `getSnapshotScript` (`sD_`) — assembles the full `bash -c -l <script>` capture body (`cli_inner_pretty.js:341109`)
- `getUserSnapshotContent` (`oD_`) — captures user functions/options/aliases; zsh vs bash branches; the reverted `grep -vE '^_[^_]'` filter (`cli_inner_pretty.js:340986`)
- `getClaudeCodeSnapshotContent` (`aD_`) — rg fallback + find/grep shadow + bq(null) + the random-delimiter PATH heredoc (`cli_inner_pretty.js:341045`)
- `getConfigFile` (`ux6`) — maps shell path to `~/.zshrc` / `~/.bashrc` / `~/.profile` (`cli_inner_pretty.js:340982`)
- `createArgv0ShellFunction` (`xx6`) — cross-shell `argv[0]`-dispatch function generator with `_cc_bin` resolution + deny-pattern early-return (`cli_inner_pretty.js:340924`)
- `createRipgrepShellIntegration` (`lD_`) — returns `{type:"function"|"alias", snippet}` for the rg fallback (`cli_inner_pretty.js:340957`)
- `createFindGrepShellIntegration` (`iD_`) — bfs/ugrep shadow builder; NEW `-S dfs`; or `null` on SDK builds (`cli_inner_pretty.js:340964`)
- `createBigQueryShellIntegration` (`rD_`) — dead stub, always returns `null` (`cli_inner_pretty.js:340979`)
- `probeSpawnEnv` (`ws7`) — **NEW** spawn-env probe; runs `shell -c env`, parses keys, feeds the permission engine (`cli_inner_pretty.js:341137`)
- `setSpawnEnvKeys` (`i98`) — **NEW**; stores the probe key set into `l26` (`cli_inner_pretty.js:209861`)
- `setSnapshotPresent` (`n98`) — sets the snapshot-exists flag `q97` that gates `getKnownEnvKeys` (`cli_inner_pretty.js:209855`)
- `getKnownEnvKeys` (`iD$`) — **NEW** four-way env-key union feeding the Bash permission engine (`cli_inner_pretty.js:209864`)
- `getSessionEnvScript` (`Tv7`) — session-env hook block sourced per command (`cli_inner_pretty.js:270265`)
- `spliceShellPrefix` (`NX8`) — splices `CLAUDE_CODE_SHELL_PREFIX` around the assembled command (`cli_inner_pretty.js:341292`)
- `registerCleanup` (`$7`) — registers the async unlink on shutdown (`cli_inner_pretty.js:341240`)
- `getPluginBinPaths` (`NV6`) — async; returns enabled-plugin `bin/` dirs appended to the snapshot PATH (`cli_inner_pretty.js:341051`)
- `getInstallBinDir` (`L6H`) — returns `<home>/.local/bin`, baked into the argv0 functions (`cli_inner_pretty.js:323465`)
- `hasEmbeddedSearchTools` (`RL`) — gate that controls whether find/grep shadows are emitted (true on native, non-SDK builds)

### Constants

- `LITERAL_BACKSLASH` (`bx6`) — `"\\"`, used in the bash base64 `eval` template line (`cli_inner_pretty.js:341164`)
- `SNAPSHOT_CREATION_TIMEOUT` (`VX8`) — `1e4` (10,000 ms) for the `execFile` call and the Windows PATH/spawn-env probes (`cli_inner_pretty.js:341165`)
- `CLAUDE_CODE_EXECPATH` (`mx6`) — `"CLAUDE_CODE_EXECPATH"`, the env-var name the argv0 functions read first to resolve `_cc_bin` (`cli_inner_pretty.js:341166`)
- `VCS_DIRECTORIES_TO_EXCLUDE` (`nD_`) — `[".git",".svn",".hg",".bzr",".jj",".sl"]`, mapped into the grep shadow's `--exclude-dir` flags (`cli_inner_pretty.js:341167`)
- `CLAUDE_INJECTED_ENV_KEYS` (`fV5`) — injected-env allowlist; gained **`CLAUDE_EFFORT`** in 2.1.156 (`cli_inner_pretty.js:209879-209895`)

---

## Snapshot File Structure

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

# Check for rg availability  (only activates if system rg is absent — rg is OPT-IN)
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  function rg { ... ARGV0=rg "$_cc_bin" "$@" ... }
fi

# Shadow find/grep with embedded bfs/ugrep  (native builds only — find/grep ALWAYS shadow)
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

# Add PATH to the file  (heredoc with random 16-char delimiter to survive arbitrary PATH content)
cat >> "$SNAPSHOT_FILE" << 'PATH_END_<random16>'
export PATH='/usr/bin:/usr/local/bin:<plugin bin dirs>:...'
PATH_END_<random16>
```

Two structural points: the PATH is written via a **random-delimiter heredoc** `PATH_END_<random16>` (`cli_inner_pretty.js:341097-341104`) rather than a quoted `echo`, so a PATH containing any quoting metacharacter cannot break the snapshot; and the exported PATH concatenates `getPluginBinPaths` (`NV6`) results (`cli_inner_pretty.js:341051-341055`) so plugin `bin/` directories are on PATH inside the Bash tool.

---

## Key v2.1.88 → v2.1.156 Changes

The core algorithm is structurally identical to v2.1.88 (Promise-wrapped `execFile`, 10 s timeout, base64 function round-trip, winpty filter, `unalias -a` on source, 4-branch argv0 dispatch, snapshot-present ⇒ skip `-l`). The deltas, with which fall in the v2.1.142→156 window:

1. **`-S dfs` on the `bfs` find shadow** (`cli_inner_pretty.js:340969`). **NEW in 2.1.156** (vs both v2.1.88 and the v2.1.142 doc). macOS file/vnode-table exhaustion fix: bounds open directory handles by switching bfs from breadth-first to depth-first. See [find_grep_integration.md](./find_grep_integration.md).
2. **Spawn-env probe + env-key union** (`probeSpawnEnv` `ws7` `cli_inner_pretty.js:341137`; `getKnownEnvKeys` `iD$` `cli_inner_pretty.js:209864`). **NEW in 2.1.156** (vs v2.1.142 docs). Runs `shell -c env`, unions the observed key names into the Bash permission engine. Entirely absent from `ShellSnapshot.ts`. See [spawn_env_probe.md](./spawn_env_probe.md).
3. **`CLAUDE_EFFORT` joins the injected-env allowlist** `CLAUDE_INJECTED_ENV_KEYS` (`fV5`, `cli_inner_pretty.js:209894`). **NEW in 2.1.156.** Confirmed absent in v2.1.88. See [spawn_env_probe.md](./spawn_env_probe.md).
4. **Exit-127 function-filter revert.** v2.1.147 changed the function-capture filter `grep -vE '^_[^_]'` (`oD_`, `cli_inner_pretty.js:340998` zsh / `341011` bash) to also drop single-underscore *user* functions, which poisoned the re-sourced shell and returned **exit 127 on every Bash command** for some users; v2.1.148 **reverted** it. The 2.1.156 bundle ships the **reverted** (original) form, keeping double-underscore helpers (`__pyenv_init`) and single-underscore user functions, dropping only single-underscore completion handlers. See [config_file_detection.md](./config_file_detection.md) and [version_diff_2_1_88_to_2_1_156.md](./version_diff_2_1_88_to_2_1_156.md).
5. **`_cc_bin` argv0 path resolution** (`xx6`, `cli_inner_pretty.js:340941-340943`). The argv0 wrapper resolves the binary at call time via `${CLAUDE_CODE_EXECPATH}` → baked `~/.local/bin/claude[.exe]` → `command <name> "$@"` system fallback. **CHANGED vs v2.1.88** (which baked a single `quote([binaryPath])`); already present in the v2.1.142 lineage and carried forward. See [argv0_dispatch.md](./argv0_dispatch.md).
6. **ugrep deny-pattern dispatch** — the 4th `denyPatterns` arg to `xx6` emits a per-arg `case` early-return so ugrep-only flags fall through to system `grep` (`cli_inner_pretty.js:340970-340975`). **CHANGED vs v2.1.88**; present since the v2.1.142 lineage. See [find_grep_integration.md](./find_grep_integration.md).
7. **Random-delimiter PATH heredoc + plugin-bin concat** (`aD_`, `cli_inner_pretty.js:341051-341104`). v2.1.88 wrote PATH with a flat `echo "export PATH=…"` and no plugin paths. **CHANGED vs v2.1.88**; present since v2.1.142. See [config_file_detection.md](./config_file_detection.md).
8. **`createBigQueryShellIntegration` (`rD_`) is a dead stub** returning `null` (`cli_inner_pretty.js:340979-340981`). The `BQ_FUNC_END` heredoc path in `aD_` is wired but never emits. **NEW vs v2.1.88** (no bq path there); same dead-stub status as v2.1.142.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions

Key functions in this document:
- `createAndSaveSnapshot` (`js7`) — top-level snapshot creation orchestrator
- `createBashShellAdapter` (`Gs7`) — consumer; kicks off `js7` + the new `ws7` probe; builds the bash adapter
- `getSnapshotScript` (`sD_`) — assembles the `bash -c -l <script>` capture body
- `getUserSnapshotContent` (`oD_`) — captures user functions/options/aliases; the reverted `grep -vE '^_[^_]'` filter
- `getClaudeCodeSnapshotContent` (`aD_`) — rg/find/grep/bq + the random-delimiter PATH heredoc
- `getConfigFile` (`ux6`) — shell path → `~/.zshrc`/`~/.bashrc`/`~/.profile`
- `createArgv0ShellFunction` (`xx6`) — argv[0]-dispatch function generator with `_cc_bin` resolution + deny-pattern early-return
- `createRipgrepShellIntegration` (`lD_`) — rg fallback snippet builder
- `createFindGrepShellIntegration` (`iD_`) — bfs/ugrep shadow builder; NEW `-S dfs`
- `createBigQueryShellIntegration` (`rD_`) — dead stub, always null
- `probeSpawnEnv` (`ws7`) — NEW spawn-env probe
- `setSpawnEnvKeys` (`i98`) — NEW; stores the probe key set into `l26`
- `setSnapshotPresent` (`n98`) — sets the snapshot-exists flag `q97`
- `getKnownEnvKeys` (`iD$`) — NEW four-way env-key union feeding the permission engine
- `CLAUDE_INJECTED_ENV_KEYS` (`fV5`) — injected-key allowlist incl. NEW `CLAUDE_EFFORT`
- `SNAPSHOT_CREATION_TIMEOUT` (`VX8`) — `1e4` ms execFile/probe timeout
- `LITERAL_BACKSLASH` (`bx6`) — `"\\"` for the base64-eval template
- `CLAUDE_CODE_EXECPATH` (`mx6`) — env-var name resolved first by the argv0 functions
- `VCS_DIRECTORIES_TO_EXCLUDE` (`nD_`) — `--exclude-dir` list for the grep shadow
