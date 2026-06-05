# Cross-Validation: v2.1.88 vs v2.1.156 vs v2.1.142 (Shell Snapshot)

> A rigorous symbol-by-symbol and behaviour-by-behaviour cross-reference of the shell-snapshot module across three versions: the v2.1.88 clean TypeScript reference (`ShellSnapshot.ts`), the v2.1.142 obfuscated bundle (from the prior reference docs), and the authoritative v2.1.156 obfuscated bundle (`cli_inner_pretty.js`, read directly). Every v2.1.156 claim is anchored to a verified line in `cli_inner_pretty.js`. Headline 2.1.156 facts: the core algorithm is structurally identical to v2.1.88 (Promise-wrapped `execFile`, 10s timeout, base64 function round-trip, winpty filter, unalias-all-on-source, 4-branch argv0 dispatch, snapshot-present ⇒ skip `-l`), but five behaviours are NEW or strengthened relative to v2.1.88: (1) `_cc_bin`/`CLAUDE_CODE_EXECPATH` resolution with a baked install path + system fallback in the argv0 function (`xx6` 340924); (2) a 4th deny-pattern argument to `xx6` for `grep`; (3) `-S dfs` on `find`/bfs; (4) a spawn-env probe (`ws7` 341137) feeding a `getKnownEnvKeys` union (`iD$` 209864) with a new `CLAUDE_EFFORT` allowlist member; and (5) PATH written via a random-delimiter heredoc plus plugin `bin/` paths. The v2.1.142 docs already carried items (1) and (2); items (3), (4) and parts of (5) are net-new in the 2.1.156 lineage as documented here.

---

## 1. Methodology

For each shell-snapshot function the audit produces a three-column mapping:

```
v2.1.88 TS name  →  v2.1.156 obfuscated (cli_inner_pretty.js:LINE)  →  v2.1.142 obfuscated
```

The v2.1.88 names come from `/lyz/codespace/3rd/claude-code/src/utils/bash/ShellSnapshot.ts`. The v2.1.142 obfuscated names come from the v2.1.142 reference docs (the names supplied in scope: `createAndSaveSnapshot=ip7`, `getSnapshotScript=Oi_`, `getUserSnapshotContent=Yi_`, `getClaudeCodeSnapshotContent=fi_`, `getConfigFile=Sv6`, `createArgv0ShellFunction=Iv6`, `createRipgrepShellIntegration=Ki_`, `createFindGrepShellIntegration=Ai_`, `createBigQueryShellIntegration=zi_`, `createBashShellProvider=$U7`). The v2.1.156 obfuscated names and every line citation come from reading `cli_inner_pretty.js` directly during this audit. The AUTHORITY for all 2.1.156 facts is the 2.1.156 source.

A row is **Match** when the v2.1.88 semantics are preserved in v2.1.156. It is **Behavior changed** when the function exists in all three but v2.1.156 differs from v2.1.88. It is **2.1.156-only** when there is no v2.1.88 equivalent (the function was introduced in the obfuscated lineage between 88 and 156).

---

## 2. Symbol cross-reference table (core creation cluster)

| v2.1.88 TS name | v2.1.156 obfuscated (cli_inner_pretty.js:LINE) | v2.1.142 obf | Status | Behavioural note |
|---|---|---|---|---|
| `createArgv0ShellFunction` | `xx6` (340924) | `Iv6` | **Behavior changed** | 88: bakes `binaryPath`, emits 4-branch dispatch on `"$@"`. 156: adds `_cc_bin` resolution (env `CLAUDE_CODE_EXECPATH` → baked `~/.local/bin/claude[.exe]` → system fallback) **and** an optional 4th `denyPatterns` arg emitting a per-arg `case` early-return. Both deltas were already in v2.1.142. |
| `createRipgrepShellIntegration` | `lD_` (340957) | `Ki_` | Match | Same `argv0`-discriminated function-vs-alias choice; same `quote([rgPath])` / `rgArgs` mapping. |
| `createFindGrepShellIntegration` | `iD_` (340964) | `Ai_` | **Behavior changed** | 88: `xx6("find","bfs",["-regextype","findutils-default"])`. 156: prepends `["-S","dfs", …]` (NEW), and `grep` now gets the 4th deny-pattern arg (present in 142). Gated by `RL()` (`hasEmbeddedSearchTools`). |
| `createBigQueryShellIntegration` | `rD_` (340979) | `zi_` | Match | Returns `null` in all versions present (a forward-compat stub; absent by name in v2.1.88). |
| `getConfigFile` | `ux6` (340982) | `Sv6` | Match | Identical `.zshrc`/`.bashrc`/`.profile` selection on `homedir()`. |
| `getUserSnapshotContent` | `oD_` (340986) | `Yi_` | Match | Same zsh/bash branching, same base64 function dump for bash, same single-underscore filter `grep -vE '^_[^_]'`, same winpty alias filter. |
| `getClaudeCodeSnapshotContent` | `aD_` (341045) | `fi_` | **Behavior changed** | 88: Windows PATH via `execa('echo $PATH',{shell:true})`, PATH written with `echo "export PATH=…"`. 156: Windows PATH via `aJ(H,["-lc",'echo "$PATH"'],…)`, plugin `bin/` paths unioned (`NV6` 341051), PATH written via random-delimiter heredoc (341097-341104). |
| `getSnapshotScript` | `sD_` (341109) | `Oi_` | Match | Identical script template (SNAPSHOT_FILE quote → source config `< /dev/null` → clear file → unalias-all comment+line → userContent → claudeContent → existence check). |
| _(no v2.1.88 equivalent)_ | `probeSpawnEnv` `ws7` (341137) | _(absent / partial)_ | **2.1.156-only** | New side-channel: `shell -c env`, parse `KEY=` lines via `tD_`, store key set via `i98`. Absent from `ShellSnapshot.ts`. |
| `createAndSaveSnapshot` | `js7` (341168) | `ip7` | Match | Same async-resolve-only Promise; same `execFile(shell,["-c","-l",script],{timeout:1e4,maxBuffer:1048576})`; same telemetry callback shape. |
| `createBashShellProvider` | `createBashShellAdapter` `Gs7` (341341) | `$U7` | **Behavior changed** | Provider/consumer. 156 fires both `js7` (snapshot) and `ws7` (spawn-env probe, 341353); span recording on success/fail; `getEnvironmentOverrides` sets `CLAUDE_CODE_EXECPATH`. (Readable name `createBashShellAdapter` per `symbol_additions_v2_1_156_permission_policy.md`; `createBashShellProvider`/`$U7` is the v2.1.142 lineage alias.) |

Constants (v2.1.156): `LITERAL_BACKSLASH` (`bx6` 341164 = `"\\"`), `SNAPSHOT_CREATION_TIMEOUT` (`VX8` 341165 = `1e4`), env-name `CLAUDE_CODE_EXECPATH` (`mx6` 341166), `VCS_DIRECTORIES_TO_EXCLUDE` (`nD_` init 341289). All match v2.1.88's `LITERAL_BACKSLASH='\\'`, `SNAPSHOT_CREATION_TIMEOUT=10000`, and `VCS_DIRECTORIES_TO_EXCLUDE=['.git','.svn','.hg','.bzr','.jj','.sl']`.

Command-assembly helpers (v2.1.156, consumer side): `spliceShellPrefix` (`NX8` 341292), `hasHeredoc` (`px6` 341301), `hasMultilineQuote` (`eD_` 341305), `wrapCommandForExec` (`Js7` 341310), `hasInputRedirect` (`HJ_` 341319), `shouldAppendDevNull` (`Xs7` 341322), `substituteNulRedirect` (`Ls7` 341327), `disableExtglobPrefix` (`qJ_` 341334), `pipeSafeWrap` (`Os7` 340918, called at 341379). These are the bashProvider-helper family the v2.1.142 doc tracked as `sp7`/`op7`/`bv6`/`Mi_`/`wi_`/`ji_`/`nY8`/`lp7`; behaviourally unchanged from v2.1.88's bashProvider helpers.

Env-key union cluster (v2.1.156): `setSnapshotPresent` (`n98` 209855), `setSessionEnvKeys` (`_97` 209858), `setSpawnEnvKeys` (`i98` 209861, **NEW**), `getKnownEnvKeys` (`iD$` 209864), `CLAUDE_INJECTED_ENV_KEYS` (`fV5` 209879), `envLineKeyRegex` (`tD_` 341290). The whole cluster is absent from `ShellSnapshot.ts` (it lives downstream of the snapshot, feeding bash permission/policy).

---

## 3. Confirmed invariants (structure preserved 88 → 156)

These behaviours are byte-for-behaviour stable from the v2.1.88 clean source to v2.1.156. Each is anchored to the verified 2.1.156 line.

### 3.1 Promise-wrapped `execFile` with resolve-only contract

**What it does:** `createAndSaveSnapshot` (`js7`) wraps the entire `execFile` call in a `new Promise` whose executor never `reject`s — every terminal path calls `resolve`, with `undefined` for failure and the snapshot path for success.

**How it works (156, `js7` 341168-341268):**
1. Compute `shellType` from the shell path (`zsh`/`bash`/`sh`) — 341169.
2. Inside `new Promise(async (resolve)=>{ … })`, resolve the config file (`ux6`), check existence (`Z5`), build a timestamped random path under `~/.claude/shell-snapshots`, `mkdir -p` it, build the script via `sD_`, and call `Ms7.execFile(shell,["-c","-l",script],opts,cb)` (341187).
3. The callback resolves `undefined` on error (341232), resolves the path on success after `stat` confirms the file (341247), resolves `undefined` if the file is missing (341257).
4. The outer `try/catch` resolves `undefined` on any unexpected throw (341265).

**Why this approach:** A resolve-only contract means a snapshot failure can never reject up the await chain and crash the Bash tool — the caller (`Gs7`) treats `undefined` as "no snapshot, fall back to a login shell." The v2.1.88 source uses the exact same pattern (`return new Promise(async resolve => { … resolve(undefined) … })`, `ShellSnapshot.ts:424-581`). **Match.**

**Key insight:** The snapshot is a best-effort optimization, not a correctness requirement. Encoding that into the Promise contract (never reject) is what makes the optimization safe to fail.

### 3.2 10-second timeout + 1MB buffer

`VX8 = 1e4` (341165) is passed as `timeout: VX8` to `execFile` (341197) with `maxBuffer: 1048576` (341198). Identical to v2.1.88's `SNAPSHOT_CREATION_TIMEOUT = 10000` and `maxBuffer: 1024 * 1024` (`ShellSnapshot.ts:24,468-469`). **Match.** A slow `.zshrc` (network-mounted home, heavy plugin managers) is bounded to 10s so startup cannot hang indefinitely.

### 3.3 base64 function round-trip in bash

For non-zsh shells, each user function is captured by base64-encoding its `declare -f` output and emitting an `eval "$(echo <b64> | base64 -d)"` line into the snapshot.

**156 (`oD_` 341011-341016):**
```
declare -F | cut -d' ' -f3 | grep -vE '^_[^_]' | while read func; do
  encoded_func=$(declare -f "$func" | base64 )
  echo "eval ${bx6}"${bx6}$(echo '$encoded_func' | base64 -d)${bx6}" > /dev/null 2>&1" >> "$SNAPSHOT_FILE"
done
```
where `bx6 = "\\"`. This is character-identical to v2.1.88 (`ShellSnapshot.ts:225-230`, with `LITERAL_BACKSLASH` in place of `bx6`). **Match.** The round-trip exists because function bodies can contain any byte (newlines, quotes, `$`), and base64 is the only encoding that survives being written into a generated shell script and re-`eval`'d losslessly.

### 3.4 winpty alias filter on Windows

When `$OSTYPE` is `msys`/`cygwin`, the alias capture filters `alias | grep -v "='winpty "` so Git-Bash's auto-generated `alias node='winpty node.exe'` lines are dropped (winpty fails with "stdin is not a tty" in a non-TTY subprocess).

**156 (`oD_` 341036-341037):** `if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then alias | grep -v "='winpty " | …`. Identical to v2.1.88 (`ShellSnapshot.ts:255-256`). **Match.**

### 3.5 unalias-all-on-source

The generated snapshot begins (after the header) with `unalias -a 2>/dev/null || true` so that when it is later sourced, aliases are cleared before the captured functions are defined — preventing aliases frozen into function bodies from misbehaving.

**156 (`sD_` 341123-341124):** `echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"` then `echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"`. Identical to v2.1.88 (`ShellSnapshot.ts:371-372`). **Match.**

### 3.6 4-branch argv0 dispatch

The argv0 shell function selects how to invoke the bun binary with a spoofed `argv[0]` by four branches: zsh → `ARGV0=… "$bin" …`; Windows (`msys`/`cygwin`/`win32`) → same `ARGV0=` form (because `exec -a` is unavailable in Git-Bash); subshell context (`$BASHPID != $$`) → `exec -a …`; else → `(exec -a …)` in a subshell.

**156 (`xx6` 340944-340952):**
```
  if [[ -n $ZSH_VERSION ]]; then
    ARGV0=$ "$_cc_bin" …
  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    ARGV0=$ "$_cc_bin" …
  elif [[ $BASHPID != $$ ]]; then
    exec -a $ "$_cc_bin" …
  else
    (exec -a $ "$_cc_bin" …)
  fi
```
The four branches and their conditions are identical to v2.1.88 (`ShellSnapshot.ts:46-56`). **Match** for the dispatch skeleton — the change is only in *what* is invoked (`"$_cc_bin"` after resolution vs. v2.1.88's directly-baked `quotedPath`), covered as a delta in §4.1.

### 3.7 snapshot-present ⇒ skip `-l` (login-shell skip)

`getSpawnArgs` returns `["-c","-l",A]` when no snapshot was captured, but `["-c",A]` when a snapshot exists — sourcing the snapshot replaces the (slow) login-shell init, so `-l` is dropped.

**156 (`Gs7.getSpawnArgs` 341398-341402):**
```
getSpawnArgs(A) {
  let Y = _ !== void 0;
  if (Y) N("Spawning shell without login (-l flag skipped)");
  return ["-c", ...(Y ? [] : ["-l"]), A];
}
```
`_` is the captured snapshot path (set at 341370). The v2.1.88 clean source's `createAndSaveSnapshot` always runs the *creation* shell with `["-c","-l",…]`; the login-skip optimization lives in the bash provider's exec path, which the v2.1.88 `ShellSnapshot.ts` file does not contain (it is in the adjacent `bashProvider`). The 156 form matches the v2.1.142 documented behaviour. **Match** (provider-level invariant).

---

## 4. Deltas 88 → 156 (NEW or CHANGED)

### 4.1 `_cc_bin` / `CLAUDE_CODE_EXECPATH` resolution + baked install path + system fallback

**What it does:** The argv0 function no longer hard-bakes a single binary path. It resolves the bun binary at *call* time: prefer the running binary's path from `$CLAUDE_CODE_EXECPATH`, else a baked canonical install path, else fall through to the system tool.

**How it works (156, `xx6` 340926-340943):**

// ============================================
// createArgv0ShellFunction - _cc_bin three-tier resolution + deny-pattern early-return
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
    /* …4-branch dispatch… */
  ].join(`\n`);
}

// READABLE (for understanding):
function createArgv0ShellFunction(funcName, argv0, prependArgs = [], denyPatterns = []) {
  let argSuffix = prependArgs.length > 0 ? `${prependArgs.join(" ")} "$@"` : '"$@"';
  let isWindows = getPlatform() === "windows";
  let bakedInstallPath = pathJoin(getInstallBinDir(), isWindows ? "claude.exe" : "claude"); // ~/.local/bin/claude
  let bakedPath = isWindows ? toCygwinPath(bakedInstallPath) : bakedInstallPath;             // wrap through cygwin on Windows
  let denyGuard = denyPatterns.length > 0
    ? [ "  local _cc_a",
        '  for _cc_a in "$@"; do',
        `    case "$_cc_a" in ${denyPatterns.join("|")}) command ${funcName} "$@"; return ;; esac`, // any deny match → system tool
        "  done" ]
    : [];
  return [
    `function ${funcName} {`,
    ...denyGuard,
    `  local _cc_bin="\${CLAUDE_CODE_EXECPATH:-}"`,        // tier 1: running binary
    `  [[ -x $_cc_bin ]] || _cc_bin=${quote([bakedPath])}`, // tier 2: baked install path
    `  if [[ ! -x $_cc_bin ]]; then command ${funcName} "$@"; return; fi`, // tier 3: system fallback
    /* …4-branch ARGV0/exec -a dispatch on "$_cc_bin"… */
  ].join("\n");
}

// Mapping: xx6→createArgv0ShellFunction, H→funcName, $→argv0, q→prependArgs, K→denyPatterns,
//          mx6→"CLAUDE_CODE_EXECPATH", L6H→getInstallBinDir, cW→toCygwinPath, O4→quote, n$→getPlatform

**Why this approach:** v2.1.88 baked a single path (`quote([binaryPath])`) directly into the function body (`ShellSnapshot.ts:41,47`). That path is the path of the binary *at snapshot-creation time*. After a binary upgrade or a temp-dir launch, that path can be stale, so the snapshot would either dispatch to a deleted binary or break. The three-tier resolution fixes this:
- **Tier 1** (`$CLAUDE_CODE_EXECPATH`) is set by every Bash tool spawn (see §4.6) to the *currently running* binary, so the snapshot always tracks the live process.
- **Tier 2** (baked `~/.local/bin/claude`) is a stable canonical install location, not a temp path, so it survives upgrades.
- **Tier 3** (`command <name> "$@"; return`) means that even with no Claude binary at all, `find`/`grep`/`rg` still run the real system tool instead of erroring.

**Key insight:** The baked value moved from "the binary path" (v2.1.88) to "the install location" (v2.1.156). Snapshots are now portable across binary upgrades because what's frozen is a stable directory, while the live binary is injected at runtime via an env var.

**Cross-version status:** Both the `_cc_bin` resolution and the baked install path were already present in v2.1.142 (`Iv6`, `getInstallBinDir`=`ne`). Confirmed **absent** in v2.1.88 (`ShellSnapshot.ts:41` bakes `quote([binaryPath])` with no env/fallback logic). `getInstallBinDir` (`L6H` 323465) returns `<home>/.local/bin`.

### 4.2 4th `denyPatterns` argument to `xx6`

**What it does:** When `denyPatterns` is non-empty, the function emits a `for … case` guard at the top: if any user argument matches a deny pattern, it runs the *system* tool (`command <name> "$@"; return`) instead of the embedded bun tool.

**156 evidence:** the `f` array in `xx6` (340930-340937) emits `case "$_cc_a" in <patterns>) command ${H} "$@"; return ;; esac`. The caller passes the grep deny list (340974):
```
["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"]
```

**Why this approach:** ugrep accepts flags (e.g. `--pager`, `--view`, `--format-open`, long `--config`) that the user's *system* grep does not — or whose meaning differs. If a user runs `grep --pager less …`, the embedded ugrep shadow would either misbehave or surprise them. The deny patterns detect "this invocation uses a flag we don't want to intercept" and transparently fall through to the real grep. `find`/bfs gets *no* deny list (340969 passes only the prepend args) because bfs is a faithful `find` drop-in.

**Cross-version status:** The `denyPatterns` argument and the grep deny list were introduced in v2.1.142 (the v2.1.142 doc, §8.2/§8.3, lists the identical pattern array). **Absent** in v2.1.88: there the signature is `createArgv0ShellFunction(funcName, argv0, binaryPath, prependArgs=[])` (`ShellSnapshot.ts:35-40`) — its 4th param is `prependArgs`, not a deny list, and there is no `denyPatterns` concept at all. The 2.1.156 `xx6` drops the `binaryPath` positional (now resolved at runtime via `_cc_bin`, §4.1) and adds `denyPatterns` as the 4th param. v2.1.88's `createFindGrepShellIntegration` calls it with prepend args only and no deny list (`ShellSnapshot.ts:167-177`).

### 4.3 `-S dfs` on `find` / bfs

**What it does:** The `find` shadow now prepends `["-S","dfs", …]` to bfs, switching bfs from its default breadth-first search to depth-first.

**156 evidence (`iD_` 340969):**
```
xx6("find", "bfs", ["-S", "dfs", "-regextype", "findutils-default"])
```
v2.1.88 (`ShellSnapshot.ts:167-170`) passes only `['-regextype','findutils-default']` — no `-S dfs`. The v2.1.142 find/grep doc likewise shows no `-S dfs`.

**Why this approach:** bfs defaults to breadth-first (`-S bfs`), which must hold one open directory file descriptor per pending tree level. On very large directory trees this can exhaust the macOS vnode / open-file table and crash the host. `-S dfs` (depth-first) bounds the number of concurrently open directory handles to the *path depth* rather than the *tree breadth*, fixing the crash. (Changelog: *"Fixed `find` in the Bash tool exhausting the macOS system file/vnode table and crashing the host on large directory trees"* → *"Pass `-S dfs` to bound open directory handles."*)

**Key insight:** This is a resource-safety fix, not a behavioural one — `dfs` and `bfs` return the same set of matches, only the traversal order and the peak open-FD count differ. The trade-off is traversal order (depth-first output ordering) in exchange for bounded resource use, which is the right call for a tool meant to be a silent drop-in.

**Cross-version status:** **NEW in 2.1.156.** Confirmed absent in v2.1.88 source and in the v2.1.142 reference doc.

### 4.4 Spawn-env probe (`ws7`) + `getKnownEnvKeys` union + `CLAUDE_EFFORT`

**What it does:** At bash-provider creation, alongside snapshot creation, the provider fires an asynchronous probe that runs `shell -c env`, extracts every environment-variable name, and stores the resulting key set. That set is later unioned with three other sources to answer "which env keys could a Bash command legitimately see?" — used by the bash permission/policy layer.

**How it works (156):**

// ============================================
// probeSpawnEnv - run `shell -c env`, parse KEY= names, store the key set
// Location: cli_inner_pretty.js:341137-341159
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

// READABLE (for understanding):
async function probeSpawnEnv(shellPath) {
  try {
    let result = await execa(shellPath, ["-c", "env"], {
      reject: false, timeout: SNAPSHOT_CREATION_TIMEOUT, maxBuffer: 1048576,
      env: { ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()), SHELL: shellPath, GIT_EDITOR: "true", CLAUDECODE: "1" },
    });
    if (result.exitCode !== 0 || !result.stdout) { logDebug("Spawn-env probe failed…"); setSpawnEnvKeys(null); return; }
    let keys = [];
    for (let line of result.stdout.split("\n")) {
      let m = line.match(envLineKeyRegex); // /^([A-Za-z_][A-Za-z0-9_]*)=/
      if (m) keys.push(m[1]);
    }
    logDebug(`Spawn-env probe captured ${keys.length} keys`);
    setSpawnEnvKeys(keys);                  // stores into l26 via i98
  } catch (e) { logDebug(`Spawn-env probe error: ${e}`); setSpawnEnvKeys(null); }
}

// Mapping: ws7→probeSpawnEnv, aJ→execa, VX8→SNAPSHOT_CREATION_TIMEOUT, yv→subprocessEnv,
//          tD_→envLineKeyRegex, i98→setSpawnEnvKeys, N→logDebug

The union is then computed by `getKnownEnvKeys`:

// ============================================
// getKnownEnvKeys - union of subprocess env ∪ injected keys ∪ session keys ∪ probed keys
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
  if (!snapshotPresent || spawnEnvKeys === null) return null; // null until both snapshot done AND probe settled
  let keys = new Set(Object.keys(subprocessEnv()));           // base: sanitized subprocess env
  for (let k of CLAUDE_INJECTED_ENV_KEYS) keys.add(k);        // fV5: keys CC injects itself
  for (let k of sessionEnvKeys) keys.add(k);                  // K97: keys from CLAUDE_ENV_FILE / hooks
  for (let k of spawnEnvKeys) keys.add(k);                    // l26: keys the user's shell adds on -c env
  return keys;
}

// Mapping: iD$→getKnownEnvKeys, q97→snapshotPresent, l26→spawnEnvKeys, yv→subprocessEnv,
//          fV5→CLAUDE_INJECTED_ENV_KEYS, K97→sessionEnvKeys

**Why this approach:** The permission layer must decide whether a Bash command that reads `$SOME_VAR` is reading something Claude could have set vs. something the user's environment supplies. A static allowlist (`CLAUDE_INJECTED_ENV_KEYS` / `fV5`) covers only what CC injects. The probe adds the *empirical* set of keys the user's actual shell produces (rc-file exports, plugin managers), and the session set adds keys from `CLAUDE_ENV_FILE` and hooks. The union is the complete "known-legitimate" key set. Returning `null` until both the snapshot is done (`q97`) and the probe has settled (`l26 !== null`) makes downstream consumers fail safe (treat the answer as "unknown") rather than under-counting during startup.

**`CLAUDE_EFFORT` allowlist member:** `fV5` (209879-209895) now includes `"CLAUDE_EFFORT"` as its last entry — **new in 2.1.156**. This is corroborated by the spawn-env builder `BsH` (340904): `if (H.effortLevel !== void 0) $.CLAUDE_EFFORT = H.effortLevel;` — so `CLAUDE_EFFORT` is genuinely injected into the Bash subprocess env, and must therefore appear in the allowlist.

**Cross-version status:** The entire probe + union cluster is **2.1.156-lineage**, **absent** from v2.1.88's `ShellSnapshot.ts` (no `env`-probe, no key union; that file ends at `createAndSaveSnapshot`). Consumers at 242985 / 440809 / 441400 are bash permission/policy. `setSpawnEnvKeys` (`i98` 209861) and the `CLAUDE_EFFORT` member are the net-new pieces vs. the v2.1.142 union.

### 4.5 PATH written via random-delimiter heredoc + plugin bin paths

**What it does:** The PATH export line in the snapshot is written with a `cat >> … << '<random-delimiter>'` heredoc rather than `echo "export PATH=…"`, and the PATH value is the union of the runtime PATH with plugin `bin/` directories.

**156 evidence (`aD_` 341051-341104):**
```
let q = await NV6();                              // plugin bin/ paths
if (q.length > 0) { let f = n$()==="windows" ? q.map(cW) : q; $ = [$, ...f].filter(Boolean).join(":"); }
…
let Y = `PATH_END_${Math.random().toString(36).substring(2, 18)}`;   // random 16-char delimiter
… cat >> "$SNAPSHOT_FILE" << '${Y}'
export PATH=${O4([$ || ""])}
${Y}
```
v2.1.88 (`ShellSnapshot.ts:336`) writes `echo "export PATH=${quote([pathValue||''])}"` — no heredoc, no plugin paths.

**Why the heredoc + random delimiter:** `echo "export PATH=…"` runs the PATH value through one extra layer of double-quote interpretation when the *generator* shell writes the file; a single-quoted heredoc body (`<< 'DELIM'`) writes the line verbatim with no expansion, so a PATH containing `$`, backticks, or quotes is preserved exactly. The delimiter is randomized (`PATH_END_<16 base36 chars>`) so it cannot collide with any literal content of the PATH value — a fixed delimiter could in theory appear inside a pathological PATH and prematurely terminate the heredoc.

**Why plugin bin paths:** Plugins ship executables in their `bin/` directory; prepending them to PATH lets a Bash command invoke plugin-provided tools by name. `getPluginBinPaths` (`NV6` 235220) filters out any path containing shell metacharacters (`/[:"'$`\\\n\r]/`) to keep the generated line injection-safe.

**Cross-version status:** **NEW in 2.1.156-lineage** relative to v2.1.88. The v2.1.142 reference notes the `PATH_END_<rand>` sentinel was already present in v2.1.142 (`getSnapshotScript` row: "identical PATH_END_<rand> sentinel pattern"), so the random-delimiter heredoc predates 2.1.156; the plugin-bin-path union (`NV6`) is the piece most clearly absent from v2.1.88. Confirmed absent in `ShellSnapshot.ts:271-336`.

### 4.6 `getEnvironmentOverrides` sets `CLAUDE_CODE_EXECPATH`

**What it does:** The bash provider's `getEnvironmentOverrides` always sets `CLAUDE_CODE_EXECPATH = process.execPath` for the spawned Bash subprocess, plus TMPDIR/CLAUDE_CODE_TMPDIR/TMPPREFIX for sandbox runs.

**156 evidence (`Gs7.getEnvironmentOverrides` 341403-341413):**
```
async getEnvironmentOverrides(A, Y) {
  let f = null, O = {};
  if (((O[mx6] = process.execPath), f)) O.TMUX = f;     // mx6 = "CLAUDE_CODE_EXECPATH"
  if (Y) for (let [M, j] of Y) O[M] = j;
  if (q) { let M = q; if (n$()==="windows") M = cW(M);
    O.TMPDIR = M; O.CLAUDE_CODE_TMPDIR = M; O.TMPPREFIX = SG$.join(M, "zsh"); }
  return O;
}
```

**Why this matters:** This is the producer of the env var that **tier 1** of the argv0 resolution (§4.1) consumes. Every Bash spawn sets `CLAUDE_CODE_EXECPATH` to the live `process.execPath`, so the snapshot's `$_cc_bin="${CLAUDE_CODE_EXECPATH:-}"` always points at the running binary. `f` (the would-be TMUX socket) is dead — declared `null` and never assigned — preserved as a shape for a dormant tmux feature (matching the v2.1.142 note that `tmuxSocket` was removed but the `if (f)` branch was kept).

**Cross-version status:** Provider-level (not in `ShellSnapshot.ts`); the `CLAUDE_CODE_EXECPATH=process.execPath` override is the runtime counterpart of the v2.1.142 argv0 refactor. **Match with v2.1.142.**

### 4.7 Retention sweep of `shell-snapshots/`

**What it does:** A scheduled retention cleanup deletes `.sh` files under `~/.claude/shell-snapshots` older than the configured cutoff.

**156 evidence:** `Qvz` (588102-588104) is `return QC(q5.join(l8(), "shell-snapshots"), ".sh");` — i.e. sweep `~/.claude/shell-snapshots` for `.sh` files. The whole retention run is gated by `kvz` (587763, checks `cleanupPeriodDays` source availability) and `cs` (587782, computes the cutoff date from `cleanupPeriodDays` defaulting to `vvz`, returning `null` when set to `0`).

**Why this approach:** Each session writes a fresh `snapshot-<type>-<ts>-<rand>.sh`. The session's own `registerCleanup` (`$7` 341240) unlinks it on graceful shutdown, but a crash or `kill -9` leaves orphans. The age-based retention sweep is the backstop that reclaims those orphans, with `cleanupPeriodDays === 0` as an explicit "never auto-delete" opt-out.

**Cross-version status:** Retention is **not** in `ShellSnapshot.ts` (that file only registers the per-session cleanup). The shell-snapshots sweep was a v2.1.117 addition per the v2.1.142 doc (`al5`/`cleanupShellSnapshots`); in 2.1.156 the same sweep is `Qvz` (588103). **2.1.156-lineage** relative to v2.1.88.

### 4.8 `claude project purge` excludes shell-snapshots

`project purge` explicitly warns that `shell-snapshots/` is not project-scoped and is left untouched: `Y.push("shell-snapshots/ are not project-scoped and will not be touched")` at 642572 (per-project purge `RBz`-region) and 642599 (global purge `IBz`). **Why:** snapshots are keyed by session/shell, not by project directory, so purging a single project must not delete another project's (or the global) shell snapshots. **2.1.156-lineage**; absent from v2.1.88.

### 4.9 Windows PATH probe via execa

v2.1.88 reads the Cygwin PATH with `execa('echo $PATH', {shell:true, reject:false})` (`ShellSnapshot.ts:274`). v2.1.156 uses `aJ(H, ["-lc", 'echo "$PATH"'], { reject:!1, timeout: VX8 })` (`aD_` 341048) — i.e. it invokes the *resolved shell* `H` with `-lc` and an explicit argv array (no `shell:true`), and bounds it with the 10s timeout. **Behavior changed:** more precise (uses the actual login shell rather than the default `/bin/sh`) and bounded. Confirmed against `ShellSnapshot.ts:274`.

---

## 5. Provider command-assembly order (cross-check)

`buildExecCommand` (`Gs7` 341360-341396) assembles the `P` array joined by ` && `. The 156 order, verified line-by-line:
1. `source <snapshot> 2>/dev/null || true` — only if snapshot file `f` exists; Windows path via `cW` (341381-341384).
2. `export TEMP=… TMP=…` (Windows only) — 341385.
3. session-env hook block `Tv7()` result + `\n:` — 341386-341389.
4. `export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"` if `CLAUDE_CODE_REMOTE` (`xH`) — 341390.
5. extglob disable `qJ_(H)` — 341391-341392.
6. `eval <wrapped-command>` — 341393.
7. `pwd -P >| <cwdFile>` — 341393.

Then if `CLAUDE_CODE_SHELL_PREFIX` is set, the whole string is spliced via `NX8` (341395). This assembly is provider-level (not in `ShellSnapshot.ts`); it matches the v2.1.142 documented order. The command-wrapping helpers (`Ls7` NUL-redirect rewrite, `Xs7` dev-null gate, `Js7` heredoc/multiline-aware quote, `Os7` pipe-safe wrap) are behaviourally identical to v2.1.88's bashProvider helpers. **Match.**

---

## 6. Confidence summary

| Area | Confidence | Basis |
|---|---|---|
| Core creation (`js7`, `sD_`, `oD_`, `aD_`, `ux6`) | High | Side-by-side template diff vs `ShellSnapshot.ts`; identical bash/zsh branching, base64 round-trip, winpty filter, unalias-all. |
| argv0 dispatch `_cc_bin` (`xx6`) | High | Branch-by-branch read of 340924-340955; three-tier resolution and 4-branch dispatch are unambiguous in source. |
| `-S dfs` (`iD_`) | High | Direct source quote at 340969; absence in `ShellSnapshot.ts:167-170` and v2.1.142 doc confirmed. |
| Spawn-env probe + union (`ws7`, `iD$`, `fV5`) | High | Full read of 341137-341159 and 209855-209896; `CLAUDE_EFFORT` corroborated by `BsH` 340904. |
| PATH heredoc + plugin paths (`aD_`, `NV6`) | High | Direct quotes 341048-341104, 235220-235228. |
| `getEnvironmentOverrides` EXECPATH (`Gs7`) | High | Direct quote 341403-341413; `mx6`=`"CLAUDE_CODE_EXECPATH"` confirmed at 341166. |
| Retention sweep + purge exclusions (`Qvz`, 642572/642599) | High | Direct quotes 588102-588104, 642571-642599. |

---

## 7. Conclusion

The shell-snapshot core algorithm is preserved intact from v2.1.88 to v2.1.156: the same resolve-only Promise, 10s/1MB `execFile`, base64 function round-trip, winpty filter, unalias-all-on-source, 4-branch argv0 dispatch, and snapshot-present ⇒ skip-`-l` login optimization. The deltas are additive hardening and integration:

- **Carried from v2.1.142:** `_cc_bin`/`CLAUDE_CODE_EXECPATH` three-tier resolution with baked install path, the 4th deny-pattern arg to `xx6` for grep, the `PATH_END_<rand>` heredoc sentinel, and `getEnvironmentOverrides` setting `CLAUDE_CODE_EXECPATH`.
- **Net-new in the 2.1.156 lineage:** `-S dfs` on find/bfs (macOS vnode fix), the spawn-env probe (`ws7`) feeding `getKnownEnvKeys` (`iD$`) with a new `setSpawnEnvKeys` (`i98`) source, the `CLAUDE_EFFORT` allowlist member in `fV5`, the plugin-bin-path union in PATH, and the Windows PATH probe via `aJ(H,["-lc",…])`.

All claims are anchored to verified `cli_inner_pretty.js` lines and cross-checked against `ShellSnapshot.ts`.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions

Key functions in this doc:
- `createArgv0ShellFunction` (`xx6`) — argv0 dispatch fn with `_cc_bin` three-tier resolution + deny-pattern early-return (340924)
- `createRipgrepShellIntegration` (`lD_`) — rg function/alias chooser (340957)
- `createFindGrepShellIntegration` (`iD_`) — find/grep shadows; adds `-S dfs` + grep deny patterns (340964)
- `createBigQueryShellIntegration` (`rD_`) — null stub (340979)
- `getConfigFile` (`ux6`) — shell → rc-file selection (340982)
- `getUserSnapshotContent` (`oD_`) — functions/options/aliases capture (340986)
- `getClaudeCodeSnapshotContent` (`aD_`) — rg/find/grep shadows + plugin-PATH heredoc (341045)
- `getSnapshotScript` (`sD_`) — full snapshot script assembler (341109)
- `probeSpawnEnv` (`ws7`) — `shell -c env` key probe (341137)
- `createAndSaveSnapshot` (`js7`) — Promise-wrapped `execFile` orchestrator (341168)
- `createBashShellAdapter` (`Gs7`) — provider; fires snapshot + probe (341341)
- `getKnownEnvKeys` (`iD$`) — env-key union (209864)
- `setSpawnEnvKeys` (`i98`) — stores probed keys into the union (209861)
- `CLAUDE_INJECTED_ENV_KEYS` (`fV5`) — static allowlist incl. new `CLAUDE_EFFORT` (209879)
- `getInstallBinDir` (`L6H`) — baked `~/.local/bin` (323465)
- `getPluginBinPaths` (`NV6`) — plugin `bin/` dirs for PATH (235220)
