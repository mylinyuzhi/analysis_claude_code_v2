# Behavioural Diff: v2.1.88 to v2.1.156 (Shell Snapshot)

> This document tracks how the shell-snapshot subsystem evolved from the readable v2.1.88 TypeScript source (`src/utils/bash/ShellSnapshot.ts`) to the v2.1.156 obfuscated bundle (`cli_inner_pretty.js`). It is framed as *architectural shifts* plus *load-bearing invariants that did NOT change*, mirroring the v2.1.142 reference diff but brought current to 156. Three deltas are new since v2.1.142: (1) the `find` integration now passes `-S dfs` to bound open directory handles and stop macOS vnode-table exhaustion (`iD_` 340969); (2) a brand-new **spawn-env probe** (`ws7` 341137) runs `shell -c env`, parses every `KEY=` line, and feeds a permission-policy env-key union via `getKnownEnvKeys` (`iD$` 209864); (3) `CLAUDE_EFFORT` joins the injected-env allowlist (`fV5` 209894). The exit-127 function-filter regression (v2.1.147) is visible in the bundle as the **reverted** `grep -vE '^_[^_]'` (`oD_` 340998/341011). Every fact below cites the 2.1.156 source.

---

## Map at a Glance

| # | Shift | v2.1.88 | v2.1.156 | First seen | 2.1.156 anchor |
|---|-------|---------|----------|-----------|----------------|
| 1 | argv0 path resolution | Baked `process.execPath` at generation time | Runtime `${CLAUDE_CODE_EXECPATH}` → baked `~/.local/bin/claude` → `command` fallback | ≤v2.1.142 | `xx6` 340924-340955 |
| 2 | ugrep deny-pattern dispatch | Always routes `grep` → ugrep | `case` block hands ugrep-only flags back to system `grep` | ≤v2.1.142 | `iD_` 340970-340975 |
| 3 | `find -S dfs` vnode fix | `["-regextype","findutils-default"]` only | `["-S","dfs","-regextype","findutils-default"]` | **v2.1.156** (changelog:218) | `iD_` 340969 |
| 4 | function-filter exit-127 saga | `grep -vE '^_[^_]'` | `grep -vE '^_[^_]'` (reverted after v2.1.147 regression) | revert v2.1.148 | `oD_` 340998/341011 |
| 5 | spawn-env probe + env-key union | absent | `ws7` probes `shell -c env`; `iD$` unions keys for permission policy | **v2.1.156 (vs v2.1.142 docs)** | `ws7` 341137, `iD$` 209864 |
| 6 | PATH heredoc + plugin bin paths | `echo "export PATH=…"` line, no plugin paths | random-sentinel heredoc + `getPluginBinPaths` prepend | ≤v2.1.142 | `aD_` 341051-341104 |
| 7 | `CLAUDE_EFFORT` in injected-env allowlist | n/a (allowlist absent) | added to `fV5` | **v2.1.156** | `fV5` 209894 |
| 8 | `hasEmbeddedSearchTools` gate | `EMBEDDED_SEARCH_TOOLS=1` + non-SDK | `xH("true")` (literal) + non-SDK → unconditional on native | ≤v2.1.142 | `RL` 235617-235621 |

Items 3, 5, 7 are the **v2.1.142 → v2.1.156** window. Items 1, 2, 6, 8 predate the window (they are the 88→142 deltas) and are simply **carried forward** in 156 — verified present in the 156 source, not assumed.

---

## 1. argv0 Path Resolution Refactor (`command -v claude` → three-tier resolution)

**What it does:** Generates the cross-shell `find`/`grep`/`rg` wrapper functions that re-invoke the bun binary with a chosen `argv[0]` (the bun-internal ARGV0 dispatch that selects the embedded `bfs`/`ugrep`/`rg`). The refactor moved binary-path resolution from *snapshot-generation time* to *function-invocation time*.

**How it works (`xx6` 340924-340955):** The generated function body resolves `_cc_bin` through three tiers, in order:
1. `local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"` (340941) — the runtime env var, set on every Bash spawn by `getEnvironmentOverrides` to `process.execPath` (`O[mx6]=process.execPath` at 341406, where `mx6="CLAUDE_CODE_EXECPATH"` 341166).
2. `[[ -x $_cc_bin ]] || _cc_bin=${O4([Y])}` (340942) — if the env var is empty/non-executable, fall back to the **baked install path** `Y`. That path is computed at generation time as `hG$.join(L6H(), "claude")` (340927), where `L6H` (`getInstallBinDir` 323465-323468) returns `<home>/.local/bin`. On Windows the name is `claude.exe` and the path is run through `cW` (cygwin conversion) at 340928.
3. `if [[ ! -x $_cc_bin ]]; then command ${H} "$@"; return; fi` (340943) — if neither resolves, fall through to the **system** `find`/`grep`/`rg`.

Only after `_cc_bin` resolves does it branch on shell flavour: zsh and msys/cygwin/win32 use `ARGV0=$ "$_cc_bin"`, a subshell-isolated `BASHPID != $$` uses `exec -a`, and the default uses `(exec -a …)` in a subshell (340944-340952).

**Why this approach:** v2.1.88 baked the literal `process.execPath` into the wrapper at generation time (`ShellSnapshot.ts:38,41` — `binaryPath` was a function parameter quoted into the body). A snapshot written by yesterday's binary then pointed at a path that could vanish on `npm i -g @anthropic-ai/claude-code@latest`, leaving `find`/`grep` permanently broken until the next snapshot. The three-tier scheme makes snapshots **upgrade-resilient**: the env var picks up today's binary, the baked `~/.local/bin/claude` is the canonical install location, and the `command` fallback means the wrapper degrades to system tools instead of erroring. The trade-off is a per-invocation `[[ -x ]]` stat in the hot path, which is cheap relative to spawning the search binary.

**Key insight:** The signature changed from `(funcName, argv0, binaryPath, prependArgs)` to `(funcName, argv0, prependArgs, denyPatterns)` — `binaryPath` was *dropped* (resolved in-body) and `denyPatterns` was *added* (see §2). Both changes coexist in the one generator.

```javascript
// ============================================
// createArgv0ShellFunction - cross-shell wrapper with 3-tier binary resolution + deny dispatch
// Location: cli_inner_pretty.js:340924-340955
// ============================================

// ORIGINAL (for source lookup):
function xx6(H, $, q = [], K = []) {
  let _ = q.length > 0 ? `${q.join(" ")} "$@"` : '"$@"',
    z = n$() === "windows",
    A = hG$.join(L6H(), z ? "claude.exe" : "claude"),
    Y = z ? cW(A) : A,
    f =
      K.length > 0
        ? [
            "  local _cc_a",
            '  for _cc_a in "$@"; do',
            `    case "$_cc_a" in ${K.join("|")}) command ${H} "$@"; return ;; esac`,
            "  done",
          ]
        : [];
  return [
    `function ${H} {`,
    ...f,
    `  local _cc_bin="\${${mx6}:-}"`,
    `  [[ -x $_cc_bin ]] || _cc_bin=${O4([Y])}`,
    `  if [[ ! -x $_cc_bin ]]; then command ${H} "$@"; return; fi`,
    "  if [[ -n $ZSH_VERSION ]]; then",
    `    ARGV0=${$} "$_cc_bin" ${_}`,
    // … msys/cygwin, BASHPID, else branches …
  ].join(`\n`);
}

// READABLE (for understanding):
function createArgv0ShellFunction(funcName, argv0, prependArgs = [], denyPatterns = []) {
  let argSuffix = prependArgs.length > 0 ? `${prependArgs.join(" ")} "$@"` : '"$@"';
  let isWindows = getPlatform() === "windows";
  let bakedPath = pathJoin(getInstallBinDir(), isWindows ? "claude.exe" : "claude");
  let bakedQuoted = isWindows ? toCygwinPath(bakedPath) : bakedPath;
  let denyDispatch =                                       // NEW deny-pattern case block (see §2)
    denyPatterns.length > 0
      ? ["  local _cc_a", '  for _cc_a in "$@"; do',
         `    case "$_cc_a" in ${denyPatterns.join("|")}) command ${funcName} "$@"; return ;; esac`,
         "  done"]
      : [];
  return [
    `function ${funcName} {`,
    ...denyDispatch,
    `  local _cc_bin="\${CLAUDE_CODE_EXECPATH:-}"`,        // tier 1: runtime env var
    `  [[ -x $_cc_bin ]] || _cc_bin=${quote([bakedQuoted])}`, // tier 2: baked ~/.local/bin/claude
    `  if [[ ! -x $_cc_bin ]]; then command ${funcName} "$@"; return; fi`, // tier 3: system tool
    "  if [[ -n $ZSH_VERSION ]]; then",
    `    ARGV0=${argv0} "$_cc_bin" ${argSuffix}`,
    // … remaining shell-flavour branches …
  ].join("\n");
}

// Mapping: xx6→createArgv0ShellFunction, H→funcName, $→argv0, q→prependArgs, K→denyPatterns,
//          L6H→getInstallBinDir, mx6→"CLAUDE_CODE_EXECPATH", O4→quote, cW→toCygwinPath, n$→getPlatform
```

The v2.1.88 generator (`ShellSnapshot.ts:35-59`) had no `_cc_bin` resolution and no `denyDispatch` — it quoted `binaryPath` directly into every branch as `${quotedPath}`. Both are confirmed absent in the clean source.

---

## 2. ugrep Deny-Pattern Dispatch

**What it does:** When the user passes a flag that only makes sense to GNU grep (not ugrep), the generated `grep` wrapper falls through to the **system** `grep` rather than mis-routing the flag to embedded ugrep.

**How it works:** `iD_` (340964-340977, `createFindGrepShellIntegration`) calls `xx6` for `grep` with a **fourth argument** — the deny-pattern list `["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"]` (340974). When `denyPatterns.length > 0`, `xx6` emits a `for`/`case` preamble (340932-340936): it scans `"$@"`, and the first arg matching any pattern triggers `command grep "$@"; return` — bypassing ugrep entirely (340934). The patterns target ugrep-exclusive features: `--filter`, `--pager`, `--view`, `--format-open`, `--config`/`--save-config`, long-long `---*`, and the `-@` query-file flag.

**Why this approach:** v2.1.88 routed *every* `grep` invocation through ugrep (`ShellSnapshot.ts:171-177`), so a user typing `grep --pager less foo` got a confusing ugrep error for a flag they expected GNU grep to honour. The allowlist-of-denies is the inverse of trying to enumerate every GNU flag: it only needs to know the handful of *ugrep-specific* flags whose presence signals "the user is deliberately invoking ugrep semantics they did not mean to". The trade-off is a per-invocation argv scan, but it is bounded by argv length and runs in shell, before any binary spawn.

**Key insight:** This is carried forward unchanged from v2.1.142 — the same eight patterns. It is listed here because the diff is *88→156* and v2.1.88 has no equivalent (the clean source's 4th `xx6` call site doesn't exist; v2.1.88 `createArgv0ShellFunction` only took 4 positional params with the 4th being `prependArgs`, not deny patterns).

---

## 3. `find -S dfs` — macOS vnode-Table Exhaustion Fix (NEW in v2.1.156)

**What it does:** Adds `-S dfs` to the default flags injected into the `find` wrapper, forcing embedded `bfs` to traverse depth-first instead of its default breadth-first.

**How it works (`iD_` 340969):** The `find` integration now reads `xx6("find", "bfs", ["-S", "dfs", "-regextype", "findutils-default"])`. The `-S dfs` selects bfs's **depth-first** search strategy. bfs defaults to `-S bfs` (breadth-first), which keeps an open directory file descriptor for every pending level of the tree; on a very large directory tree this can hold thousands of concurrent open dir handles and exhaust the macOS system file/vnode table — crashing not just claude but the host. Depth-first bounds the number of concurrently-open directory handles to the **depth** of the current path, which is logarithmic-ish rather than proportional to tree breadth.

**Why this approach:** The alternative — capping bfs's open-FD budget with an explicit limit flag — would require picking a magic number and risks slowing traversal when the budget is hit. Switching the *strategy* to dfs is a structural fix: it changes the asymptotic open-handle profile from O(breadth) to O(depth) for free, with no tuning. The cost is that dfs does not return shallow matches first, which is irrelevant for snapshot-shadowed `find` (the Bash tool consumes full output anyway).

**Key insight — confirmed NEW:** v2.1.88 `ShellSnapshot.ts:167-170` injects only `["-regextype", "findutils-default"]` — no `-S` flag. The v2.1.142 find/grep doc likewise shows no `-S dfs`. The changelog row (changelog_to_code_map:218) states the fix verbatim: *"Fixed `find` in the Bash tool exhausting the macOS system file/vnode table and crashing the host on large directory trees → Pass `-S dfs` to bound open directory handles."* This is the headline behavioural delta of the 142→156 window for `find`.

```javascript
// ============================================
// createFindGrepShellIntegration - find/grep shadow with -S dfs (NEW) + deny patterns
// Location: cli_inner_pretty.js:340964-340977
// ============================================

// ORIGINAL (for source lookup):
function iD_() {
  if (!RL()) return null;
  return [
    "unalias find 2>/dev/null || true",
    "unalias grep 2>/dev/null || true",
    xx6("find", "bfs", ["-S", "dfs", "-regextype", "findutils-default"]),
    xx6(
      "grep",
      "ugrep",
      ["-G", "--ignore-files", "--hidden", "-I", ...nD_.map((H) => `--exclude-dir=${H}`)],
      ["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"],
    ),
  ].join(`\n`);
}

// READABLE (for understanding):
function createFindGrepShellIntegration() {
  if (!hasEmbeddedSearchTools()) return null;            // gate: native (non-SDK) builds only
  return [
    "unalias find 2>/dev/null || true",                  // clear renaming aliases first
    "unalias grep 2>/dev/null || true",
    createArgv0ShellFunction("find", "bfs",
      ["-S", "dfs", "-regextype", "findutils-default"]),  // NEW: -S dfs bounds open dir handles
    createArgv0ShellFunction("grep", "ugrep",
      ["-G", "--ignore-files", "--hidden", "-I",
       ...VCS_DIRECTORIES_TO_EXCLUDE.map((d) => `--exclude-dir=${d}`)],
      ["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*",
       "-*-config*", "---*", "-@*", "-*-save-config*"]),  // deny patterns → system grep (§2)
  ].join("\n");
}

// Mapping: iD_→createFindGrepShellIntegration, RL→hasEmbeddedSearchTools, xx6→createArgv0ShellFunction,
//          nD_→VCS_DIRECTORIES_TO_EXCLUDE
```

---

## 4. The exit-127 Function-Filter Regression (v2.1.147) and Revert (v2.1.148)

**What it does:** The snapshot captures the user's shell functions so re-sourcing the snapshot restores them. The capture filters out completion functions by name prefix. A v2.1.147 change to that filter poisoned the re-sourced shell and produced **exit 127 on every Bash command** for affected users; v2.1.148 reverted it.

**How it works (`oD_` 340998 zsh / 341011 bash):** The captured-function filter is `grep -vE '^_[^_]'`. In the zsh branch (340998): `typeset +f | grep -vE '^_[^_]' | while read func; do typeset -f "$func" >> "$SNAPSHOT_FILE"; done`. In the bash branch (341011): `declare -F | cut -d' ' -f3 | grep -vE '^_[^_]' | while read func; do … base64 round-trip …; done`. The regex `^_[^_]` matches names that start with a **single** underscore followed by a **non-underscore** — i.e. it drops zsh/bash completion handlers like `_git`, `_npm`, while keeping double-underscore helpers like `__pyenv_init`, `__zsh_like_cd` (the leading `__` does not match `_[^_]` because the second char is also `_`). The inline comment at 340996-340997/341009-341010 documents this intent verbatim.

**Why this matters / the regression:** Per changelog_to_code_map (lines 243/260/414), v2.1.147 widened the filter so it *also* dropped single-underscore **user** functions (not just completion functions). When the snapshot is later re-sourced, any function that those dropped functions depended on — or that the user's prompt/PATH setup relied on — was now missing, and the re-sourced shell returned exit 127 (command not found) on every command. v2.1.148 reverted to the original `grep -vE '^_[^_]'`. The v2.1.156 bundle ships the **reverted** form: a verbatim `grep -vE '^_[^_]'` in both the zsh (340998) and bash (341011) branches — identical to v2.1.88 `ShellSnapshot.ts:212` (zsh) and `:225` (bash).

**Key insight:** This is a behavioural *non-change* relative to v2.1.88 that is only interesting because of the round-trip in between. The lesson is that the completion-function filter is **load-bearing**: it sits on the path that restores the user's interactive environment into every Bash tool call, so any over-broad filter cascades into total Bash-tool failure. The conservative `_[^_]` regex — drop single-underscore, keep double-underscore — is the invariant.

---

## 5. Spawn-Env Probe + Known-Env-Key Union (NEW SUBSYSTEM in v2.1.156)

**What it does:** At Bash-provider creation, a side-channel `shell -c env` is fired to learn which environment variable **keys** the user's login shell actually exports. Those keys are unioned with the injected-env allowlist and the session-env keys to form `getKnownEnvKeys`, which the **bash permission/policy** layer consults. This is an entirely new subsystem with no analogue in v2.1.88 or the v2.1.142 docs.

**How it works:**

*Probe (`ws7` 341137-341159):* `createBashShellAdapter` fires `ws7(H).catch(() => {})` (341353) unless `skipSnapshot`. `ws7` runs `aJ(H, ["-c", "env"], {...})` (341139) — note `-c` *without* `-l`, with the same `SHELL`/`GIT_EDITOR=true`/`CLAUDECODE=1` env and `CLAUDE_CODE_DONT_INHERIT_ENV` honoured as the snapshot path (341143), `timeout: VX8` (10s), `maxBuffer: 1048576`. On non-zero exit or empty stdout it logs and calls `i98(null)` (341146) — sentinel "probe unknown". On success it splits stdout into lines, matches each against `tD_ = /^([A-Za-z_][A-Za-z0-9_]*)=/` (341290), collects the captured key, and stores the set via `i98(q)` (341155).

*Storage + union (`iD$` 209864-209870):* `setSpawnEnvKeys` (`i98` 209861) writes `l26` (= `null` if the probe is pending/failed, else a `Set`). `getKnownEnvKeys` (`iD$`) returns `null` if either **no snapshot exists** (`!q97`) **or the probe has not resolved** (`l26 === null`) (209865) — i.e. it refuses to answer until both signals are ready. Otherwise it unions four sources: `Object.keys(subprocessEnv())` ∪ `fV5` (injected allowlist) ∪ `K97` (session-env keys, set by `_97`) ∪ `l26` (probed keys) (209866-209869).

*Consumers:* `iD$` is read at 242985, 440809, 441400 — the bash permission/policy analysis. This is the architectural significance: the snapshot subsystem now feeds the **permission** subsystem. When the policy layer decides whether a command's `FOO=bar cmd` prefix is "just setting a known env var" vs "injecting something novel", it asks `getKnownEnvKeys`.

**Why this approach:** A static allowlist (`fV5`) can only know the keys Claude Code itself injects; it cannot know that the *user's* `.zshrc` exports, say, `PYENV_ROOT` or `NVM_DIR`. Re-parsing `process.env` is insufficient because the parent process env is not the login-shell env. The probe spawns the *actual* login shell once, captures its key namespace, and caches it — so the permission layer can treat user-established env vars as known/benign without prompting on every command. The `null`-until-ready contract (209865) is the key safety property: the policy layer must not get a *partial* answer that would mis-classify a real key as unknown, so `getKnownEnvKeys` is all-or-nothing. The trade-off is one extra short-lived `shell -c env` spawn per provider creation, amortised across the whole session and run with `.catch(() => {})` so a probe failure never blocks startup.

**Key insight — confirmed NEW:** v2.1.88 `ShellSnapshot.ts` has no `env`-probe, no key-set storage, and no `getKnownEnvKeys` — the entire `n98`/`_97`/`i98`/`iD$` cluster (209855-209870) is absent. The v2.1.142 reference docs do not mention it either. This is the one delta that *connects shell-snapshot to permission policy* and is the most structurally novel change in the window.

```javascript
// ============================================
// probeSpawnEnv + getKnownEnvKeys - NEW spawn-env probe feeding permission policy union
// Location: cli_inner_pretty.js:341137-341159 (probe) and 209864-209870 (union)
// ============================================

// ORIGINAL (for source lookup):
async function ws7(H) {
  try {
    let $ = await aJ(H, ["-c", "env"], {
      reject: !1, timeout: VX8, maxBuffer: 1048576,
      env: { ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : yv()), SHELL: H, GIT_EDITOR: "true", CLAUDECODE: "1" },
    });
    if ($.exitCode !== 0 || !$.stdout) { (N(`Spawn-env probe failed: …`), i98(null)); return; }
    let q = [];
    for (let K of $.stdout.split(`\n`)) { let _ = K.match(tD_); if (_) q.push(_[1]); }
    (N(`Spawn-env probe captured ${q.length} keys`), i98(q));
  } catch ($) { (N(`Spawn-env probe error: ${$}`), i98(null)); }
}
function iD$() {
  if (!q97 || l26 === null) return null;
  let H = new Set(Object.keys(yv()));
  for (let $ of fV5) H.add($);
  for (let $ of K97) H.add($);
  for (let $ of l26) H.add($);
  return H;
}

// READABLE (for understanding):
async function probeSpawnEnv(shellPath) {
  try {
    let result = await execa(shellPath, ["-c", "env"], {       // -c WITHOUT -l: probe non-login env
      reject: false, timeout: SNAPSHOT_CREATION_TIMEOUT, maxBuffer: 1048576,
      env: { ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()),
             SHELL: shellPath, GIT_EDITOR: "true", CLAUDECODE: "1" },
    });
    if (result.exitCode !== 0 || !result.stdout) { setSpawnEnvKeys(null); return; } // null = unknown
    let keys = [];
    for (let line of result.stdout.split("\n")) {
      let m = line.match(envLineKeyRegex);                      // /^([A-Za-z_][A-Za-z0-9_]*)=/
      if (m) keys.push(m[1]);
    }
    setSpawnEnvKeys(keys);                                      // stores l26 = Set(keys)
  } catch (e) { setSpawnEnvKeys(null); }
}
function getKnownEnvKeys() {
  if (!snapshotPresent || spawnEnvKeys === null) return null;   // all-or-nothing: not ready → null
  let union = new Set(Object.keys(subprocessEnv()));            // 1. current sanitized env
  for (let k of CLAUDE_INJECTED_ENV_KEYS) union.add(k);         // 2. fV5 allowlist (incl CLAUDE_EFFORT)
  for (let k of sessionEnvKeys) union.add(k);                   // 3. K97 from CLAUDE_ENV_FILE/hooks
  for (let k of spawnEnvKeys) union.add(k);                     // 4. l26 from the probe
  return union;
}

// Mapping: ws7→probeSpawnEnv, iD$→getKnownEnvKeys, i98→setSpawnEnvKeys, l26→spawnEnvKeys,
//          q97→snapshotPresent, K97→sessionEnvKeys, fV5→CLAUDE_INJECTED_ENV_KEYS, tD_→envLineKeyRegex,
//          aJ→execa, yv→subprocessEnv, VX8→SNAPSHOT_CREATION_TIMEOUT
```

---

## 6. PATH Heredoc + Plugin Bin Paths

**What it does:** Writes the captured `PATH` export into the snapshot using a random-sentinel heredoc (instead of an `echo` line), and prepends plugin `bin/` directories to that PATH.

**How it works (`aD_` 341045-341107):** On Windows, the cygwin/mintty PATH is read by spawning `aJ(H, ["-lc", 'echo "$PATH"'], …)` via execa (341048) — vs v2.1.88's `execa('echo $PATH', { shell: true })` (`ShellSnapshot.ts:274`). Then `getPluginBinPaths` (`NV6` 341051) is awaited; if non-empty, those dirs are joined onto PATH (Windows-converted via `cW`) at 341052-341054. Finally the PATH is written with a random sentinel: `Y = PATH_END_${Math.random().toString(36).substring(2, 18)}` (341097), then `cat >> "$SNAPSHOT_FILE" << '${Y}' … export PATH=… ${Y}` (341102-341104).

**Why this approach:** A bare `echo "export PATH=…"` (v2.1.88 `ShellSnapshot.ts:336`) requires re-quoting a value that may contain quotes, `$`, or backticks; a *quoted* heredoc (`<< 'SENTINEL'`) writes the body literally with **no expansion**, which is the only robust way to emit an arbitrary PATH value. The sentinel is randomised because a fixed terminator like `PATH_END` could (improbably) appear inside the PATH and close the heredoc early; a 16-char random suffix makes collision effectively impossible. Plugin bin paths are prepended so plugin-installed executables shadow system ones inside the Bash tool, matching the in-process plugin tool resolution. These are carried forward from v2.1.142; both are confirmed absent in v2.1.88 (no heredoc, no `getPluginBinPaths`).

---

## 7. `CLAUDE_EFFORT` Added to the Injected-Env Allowlist (NEW in v2.1.156)

**What it does:** `CLAUDE_EFFORT` is the 15th and final entry of `CLAUDE_INJECTED_ENV_KEYS` (`fV5` 209879-209895), the set of env-var keys Claude Code is permitted to inject into spawned shells, unioned into `getKnownEnvKeys`.

**How it works:** `fV5` (209879-209895) lists `["SHELL","GIT_EDITOR","CLAUDECODE","AI_AGENT","CLAUDE_CODE_SESSION_ID","TRACEPARENT","CLAUDE_CODE_EXECPATH","TMUX","TMPDIR","CLAUDE_CODE_TMPDIR","TMPPREFIX","BUN_OPTIONS","TEMP","TMP","CLAUDE_EFFORT"]`. Because `getKnownEnvKeys` unions `fV5` into its result (209867), the permission layer treats a `CLAUDE_EFFORT=…` prefix as a known/benign env assignment rather than an unrecognised injection.

**Why this approach:** `CLAUDE_EFFORT` is the reasoning-effort selector (tied to the model effort knob this build exposes). Adding it to the allowlist keeps the permission analysis from flagging commands that carry the effort var when Claude Code itself propagates it. The alternative — leaving it off — would surface false-positive "unknown env var" prompts. The trade-off is negligible: it is one literal in a static array.

**Key insight — confirmed NEW:** This allowlist does not exist in v2.1.88 (`ShellSnapshot.ts` has no `CLAUDE_INJECTED_ENV_KEYS`), so `CLAUDE_EFFORT`'s membership is necessarily new. Within the 142→156 window, `CLAUDE_EFFORT` is the single new allowlist member relative to the prior `fV5` shape.

---

## 8. `hasEmbeddedSearchTools` Now Unconditional on Native Builds

**What it does:** Gates whether `find`/`grep` are shadowed (via `iD_`) at all. On native (non-SDK) builds it is now always true, so `find`/`grep` are **always** shadowed by embedded `bfs`/`ugrep`.

**How it works (`RL` 235617-235621):** `if (!xH("true")) return !1;` then returns `entrypoint !== "sdk-ts" && !== "sdk-py" && !== "sdk-cli" && !== "local-agent"`. The `xH("true")` is a build-time-replaced literal: the original `isEnvTruthy(process.env.EMBEDDED_SEARCH_TOOLS)` was swapped for `isEnvTruthy("true")`, which is unconditionally true. So the only remaining gate is the SDK-entrypoint check. `iD_` (340965) early-returns `null` when `!RL()`, which is the only way `find`/`grep` shadowing is suppressed.

**Why this approach:** v2.1.88 `embeddedTools.ts:15-21` required both `EMBEDDED_SEARCH_TOOLS=1` *and* a non-SDK entrypoint. Making it unconditional on native builds guarantees consistent fast `bfs`/`ugrep` behaviour for all native users without a build-time env var; the only opt-out is running under an SDK entrypoint (`CLAUDE_CODE_ENTRYPOINT=sdk-cli`). The trade-off is that native users can no longer disable embedded search by unsetting an env var. Carried forward from v2.1.142; the env-var gate is confirmed present in v2.1.88 and gone in 156.

---

## Load-Bearing Invariants That Did NOT Change (88 → 156)

These are verified **identical** between v2.1.88 `ShellSnapshot.ts` and the v2.1.156 source — the contract between snapshot creator and consumer:

| Invariant | v2.1.88 | v2.1.156 anchor |
|-----------|---------|-----------------|
| 10s creation timeout (`SNAPSHOT_CREATION_TIMEOUT`) | `:24` `10000` | `VX8 = 1e4` 341165; used 341197 |
| 1 MB `maxBuffer` in `execFile` | `:469` | `maxBuffer: 1048576` 341198 |
| Snapshot-creation env `SHELL`/`GIT_EDITOR:"true"`/`CLAUDECODE:"1"` | `:464-466` | 341193-341195 |
| `CLAUDE_CODE_DONT_INHERIT_ENV` escape hatch | `:461` | 341192 |
| base64 function round-trip (preserves special chars) | `:227-229` | `oD_` 341013-341015 |
| winpty alias filter on msys/cygwin | `:255-256` | `oD_` 341036-341037 |
| `registerCleanup` unlink on graceful shutdown | `:534-536` | `$7(…U$().unlink(f))` 341240-341242 |
| `< /dev/null` on `source <config>` | `:363` | `sD_` 341115 |
| `>|` clobber for file-clear (works under `noclobber`) | `:366` | `sD_` 341118 |
| `unalias -a 2>/dev/null \|\| true` as first restored line | `:372` | `sD_` 341124 |
| completion-function filter `grep -vE '^_[^_]'` | `:212`/`:225` | `oD_` 340998/341011 |
| `-regextype findutils-default` on `find` | `:168-169` | `iD_` 340969 (now after `-S dfs`) |
| 1000-line caps on shopt/setopt/aliases | `:238,243-244,256,258` | `oD_` 341021,341026-341027,341037,341039 |
| snapshot path `snapshot-{shell}-{ts}-{rand6}.sh` | `:443` | `js7` 341182 |
| 3-event telemetry split (`failed`/`unknown_error`/`error`) | `:513,566,578` | `js7` 341226,341257,341265 |
| `source <snapshot> 2>/dev/null \|\| true` (consumer) | bashProvider | `Gs7` 341383 |
| snapshot-present ⇒ skip `-l` login flag | bashProvider | `getSpawnArgs` 341399-341401 |
| `eval <wrapped-command>` + `pwd -P >\| <cwdFile>` cwd tracking | bashProvider | `Gs7` 341393 |
| existence guard `[ ! -f $SNAPSHOT_FILE ] → exit 1` | `:379-382` | `sD_` 341131-341134 |

**Consumer assembly order (`Gs7.buildExecCommand` 341380-341394)** is also invariant in shape, `P.join(" && ")`: `source <snapshot> 2>/dev/null || true` (341383) → Windows `export TEMP/TMP` (341385) → session-env hook block `Tv7()` (341386-341389) → `BUN_OPTIONS --smol` if `CLAUDE_CODE_REMOTE` (341390) → extglob disable `qJ_` (341391-341392) → `eval <wrapped>` (341393) → `pwd -P >| <cwdFile>` (341393) → optional `CLAUDE_CODE_SHELL_PREFIX` splice via `NX8` (341395).

**Retention/purge surface (carried forward from v2.1.142):** the daily sweep deletes `~/.claude/shell-snapshots/*.sh` older than `cleanupPeriodDays` via `Qvz` → `QC(join(getClaudeConfigHomeDir(), "shell-snapshots"), ".sh")` (588103), gated by the `cleanupPeriodDays` logic at 587763-587787. The `claude project purge` paths explicitly warn `"shell-snapshots/ are not project-scoped and will not be touched"` at 642571-642572 and 642598-642599. v2.1.88 had neither (no retention sweep, no purge command).

---

## Window Summary: What Actually Moved 142 → 156

The v2.1.142 → v2.1.156 window is **narrow**. Of the eight shifts, only three are genuinely new in this window:

- **`-S dfs`** on the `find` integration (`iD_` 340969) — the macOS vnode-exhaustion fix.
- **Spawn-env probe + env-key union** (`ws7` 341137, `iD$` 209864) — the new subsystem tying snapshots to permission policy, with the `null`-until-ready contract.
- **`CLAUDE_EFFORT`** in the injected-env allowlist (`fV5` 209894).

The other five shifts (argv0 three-tier resolution, ugrep deny-patterns, PATH heredoc + plugin bin paths, unconditional `hasEmbeddedSearchTools`, retention/purge surface) are **88→142 deltas carried forward** — they predate this window and are documented here only because the diff spans 88→156. Each was verified present in the 156 source, not assumed from the prior doc. The completion-function-filter exit-127 saga (v2.1.147 regression → v2.1.148 revert) leaves no residue in 156: the bundle ships the original `grep -vE '^_[^_]'`, byte-identical to v2.1.88.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions

Key functions in this document:
- `createArgv0ShellFunction` (`xx6`) — emits cross-shell wrapper with 3-tier `_cc_bin` resolution + deny dispatch (340924)
- `createFindGrepShellIntegration` (`iD_`) — `find`/`grep` shadow; adds `-S dfs` and grep deny patterns (340964)
- `getClaudeCodeSnapshotContent` (`aD_`) — async; rg fallback + find/grep shadow + PATH heredoc + plugin bin paths (341045)
- `getUserSnapshotContent` (`oD_`) — function/option/alias capture; holds the `grep -vE '^_[^_]'` filter (340986)
- `getSnapshotScript` (`sD_`) — assembles the full `bash -c -l <script>` body (341109)
- `probeSpawnEnv` (`ws7`) — NEW; runs `shell -c env`, parses keys, stores via `setSpawnEnvKeys` (341137)
- `createAndSaveSnapshot` (`js7`) — top-level orchestrator; `execFile` + telemetry + cleanup (341168)
- `createBashShellAdapter` (`Gs7`) — consumer; kicks off `js7` + `ws7`, returns provider with `buildExecCommand`/`getSpawnArgs`/`getEnvironmentOverrides` (341341)
- `getKnownEnvKeys` (`iD$`) — NEW; unions subprocess env ∪ `fV5` ∪ session keys ∪ probed keys; consumed by permission policy (209864)
- `setSpawnEnvKeys` (`i98`) — NEW; stores probed key set `l26` (null = unknown) (209861)
- `CLAUDE_INJECTED_ENV_KEYS` (`fV5`) — injected-env allowlist; `CLAUDE_EFFORT` is the new member (209879)
- `getInstallBinDir` (`L6H`) — returns `<home>/.local/bin` for the baked argv0 path (323465)
- `hasEmbeddedSearchTools` (`RL`) — `xH("true")` + non-SDK gate → unconditional on native (235617)
