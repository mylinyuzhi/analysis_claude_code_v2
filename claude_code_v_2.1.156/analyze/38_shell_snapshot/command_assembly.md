# Command Assembly: createBashShellAdapter.buildExecCommand (v2.1.156)

> This document covers the **consumer side** of the shell-snapshot system: how `createBashShellAdapter` (`Gs7`, `cli_inner_pretty.js:341341`) kicks off snapshot creation and the new spawn-env probe, then how its `buildExecCommand` method (`cli_inner_pretty.js:341360-341397`) turns a raw user command into the final `&&`-chained string handed to `bash -c`. The headline 2.1.156 facts: (1) the snapshot promise `K` now folds in a telemetry span (`SH("shell_snapshot_create")`) **and** `setSnapshotPresent` (`n98`) inside its `.then`/`.catch`, so the env-key-union allowlist is updated at creation time, not just at exec; (2) provider creation also fires the **new** spawn-env probe `probeSpawnEnv` (`ws7`, `cli_inner_pretty.js:341353`); (3) the `P[]` chain gained a **new windows `export TEMP/TMP`** link (`cli_inner_pretty.js:341385`) that did not exist in v2.1.142; (4) the extglob-disable string (`disableExtglobPrefix`, `qJ_`) now also sets **`NO_BARE_GLOB_QUAL`** for zsh (`cli_inner_pretty.js:341336/341338`). The command-wrapping helper cluster (`substituteNulRedirect` `Ls7`, `wrapCommandForExec` `Js7`, `pipeSafeWrap` `Os7`, `shouldAppendDevNull` `Xs7`) is otherwise byte-for-byte the same algorithm as v2.1.142 with renamed obfuscated symbols.

---

## 1. Where buildExecCommand lives: the adapter closure

`buildExecCommand` is **not** a free function — it is a method of the object returned by `createBashShellAdapter` (`Gs7`, `cli_inner_pretty.js:341341`). The adapter closure is what makes the snapshot promise (`K`), the resolved snapshot path (`_`), and the missing-at-exec latch (`z`) survive across every Bash tool invocation that uses the same shell.

### What it does

`createBashShellAdapter(shellPath, options)` does three things eagerly, then returns a provider object:

1. **Starts snapshot creation** into promise `K` (`cli_inner_pretty.js:341343-341352`) — unless `options.skipSnapshot` is set, in which case `K = Promise.resolve(undefined)`.
2. **Fires the spawn-env probe** `ws7(H).catch(()=>{})` (`cli_inner_pretty.js:341353`) — fire-and-forget, also gated on `!skipSnapshot`.
3. **Returns the provider** `{ type:"bash", shellPath, detached:true, buildExecCommand, getSpawnArgs, getEnvironmentOverrides }` (`cli_inner_pretty.js:341356-341415`).

```javascript
// ============================================
// createBashShellAdapter - Adapter factory: starts snapshot + spawn-env probe, returns provider
// Location: cli_inner_pretty.js:341341-341359
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
  return {
    type: "bash",
    shellPath: H,
    detached: !0,
    async buildExecCommand(A, Y) { /* … see §2 … */ },
    getSpawnArgs(A) { /* … */ },
    async getEnvironmentOverrides(A, Y) { /* … */ },
  };
}

// READABLE (for understanding):
async function createBashShellAdapter(shellPath, options) {
  let sandboxTmpDir;                                          // q — captured by getEnvironmentOverrides
  // Start snapshot creation once; reuse the same promise across all commands.
  const snapshotPromise = options?.skipSnapshot
    ? Promise.resolve(undefined)
    : createAndSaveSnapshot(shellPath)                        // js7
        .then((path) => {
          spanStart("shell_snapshot_create");                // SH — success span
          setSnapshotPresent(path !== undefined);            // n98 — flip the env-key-union gate
          return path;
        })
        .catch((err) => {
          debugLog(`Failed to create shell snapshot: ${err}`);
          spanFail("shell_snapshot_create", "snapshot_failed"); // t$
          setSnapshotPresent(false);                         // n98(false) — no snapshot keys
          return undefined;
        });
  // NEW in 2.1.156: side-channel probe of the *real* spawned env keys.
  if (!options?.skipSnapshot) probeSpawnEnv(shellPath).catch(() => {}); // ws7
  let resolvedSnapshotPath;                                   // _
  let missingTelemetryFired = false;                          // z (one-shot latch)
  return { type: "bash", shellPath, detached: true, buildExecCommand, getSpawnArgs, getEnvironmentOverrides };
}

// Mapping: Gs7→createBashShellAdapter, H→shellPath, $→options, K→snapshotPromise,
//   js7→createAndSaveSnapshot, SH→spanStart, t$→spanFail, n98→setSnapshotPresent,
//   ws7→probeSpawnEnv, N→debugLog, q→sandboxTmpDir, _→resolvedSnapshotPath, z→missingTelemetryFired
```

### How the snapshot promise `K` works (step-by-step)

1. **Skip branch** (`cli_inner_pretty.js:341344`): when `options.skipSnapshot` is true (e.g. sandbox profiling or a caller that explicitly does not want a snapshot), `K` is a pre-resolved `Promise.resolve(undefined)`. `buildExecCommand` will then always take the login-shell fallback path.
2. **Create branch** (`cli_inner_pretty.js:341345-341352`): `js7(H)` = `createAndSaveSnapshot(shellPath)` is invoked **once** and its promise is stored. The `.then` runs `SH("shell_snapshot_create")` (the success span) and `n98(A !== void 0)` = `setSnapshotPresent(path !== undefined)`, then forwards the path. The `.catch` logs, calls `t$("shell_snapshot_create","snapshot_failed")` (`spanFail`) and `n98(!1)` = `setSnapshotPresent(false)`, then resolves to `undefined`.
3. **Single-flight reuse**: because `K` is captured in the closure, every later `buildExecCommand` call simply `await`s the same already-settled promise — the 10 s `execFile` snapshot creation happens exactly once per adapter, not once per command.

**Why fold `setSnapshotPresent` (`n98`) into the promise instead of doing it at exec:** `setSnapshotPresent` flips `q97`, the boolean gate read by `getKnownEnvKeys` (`iD$`, `cli_inner_pretty.js:209864-209865`). That union of env-var names is consumed by the **bash permission/policy** layer (callers at 242985/440809/441400 per the evidence brief). By setting presence in the promise's `.then`/`.catch`, the allowlist becomes correct as soon as the snapshot resolves — even before the first command is assembled — so a `Bash(FOO=bar …)` permission check made early in the session sees the right key set. `buildExecCommand` then re-asserts presence (`n98(f !== void 0)`, `cli_inner_pretty.js:341370`) to account for a snapshot that vanished between creation and exec.

**Key insight:** `K` is the join point between **snapshot creation** (producer) and **command assembly** (consumer). It carries three side effects in one promise: the file path, the telemetry span, and the permission-allowlist gate. This is the v2.1.156 consolidation — in the v2.1.142 lineage the span/presence wiring was thinner; here the `.then`/`.catch` is the canonical place both succeed and fail update telemetry **and** policy state.

### probeSpawnEnv (`ws7`) — the new side-channel (fired at line 341353)

```javascript
// ============================================
// probeSpawnEnv - Runs `shell -c env`, harvests KEY= names, feeds the env-key union
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
    const result = await execa(shellPath, ["-c", "env"], {        // aJ
      reject: false, timeout: SNAPSHOT_CREATION_TIMEOUT, maxBuffer: 1048576,
      env: { ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()),
             SHELL: shellPath, GIT_EDITOR: "true", CLAUDECODE: "1" },
    });
    if (result.exitCode !== 0 || !result.stdout) { setSpawnEnvKeys(null); return; } // i98(null)
    const keys = [];
    for (const line of result.stdout.split("\n")) {
      const m = line.match(ENV_LINE_KEY_REGEX);                     // tD_ = /^([A-Za-z_][A-Za-z0-9_]*)=/
      if (m) keys.push(m[1]);
    }
    setSpawnEnvKeys(keys);                                          // i98 — stores l26 set
  } catch { setSpawnEnvKeys(null); }
}

// Mapping: ws7→probeSpawnEnv, H→shellPath, aJ→execa, VX8→SNAPSHOT_CREATION_TIMEOUT,
//   yv→subprocessEnv, tD_→ENV_LINE_KEY_REGEX, i98→setSpawnEnvKeys, N→debugLog
```

**What it does:** runs the user's shell non-interactively (`shell -c env`) under the same env Claude will spawn commands with, then extracts every leading `KEY=` name (`cli_inner_pretty.js:341152-341153`) and stores the set via `setSpawnEnvKeys` (`i98`, `cli_inner_pretty.js:209861`) into `l26`. `getKnownEnvKeys` (`iD$`) unions `l26` with `Object.keys(subprocessEnv())`, `CLAUDE_INJECTED_ENV_KEYS` (`fV5`), and the session-env keys (`K97`).

**Why this is NEW:** the v2.1.88 clean source `ShellSnapshot.ts` has no analog — there is no `env`-probe call anywhere in that file. The v2.1.142 `command_assembly.md` likewise never mentions a spawn-env probe. The motivation is permission accuracy: a snapshot captures *functions/aliases/options* but not the *exported environment* the shell actually injects (from `.bashrc` `export`s, `direnv`, etc.). Without the probe, the permission layer would think a command sets a "new" env var when in fact the user's shell already exports it. Failure is non-fatal (`i98(null)` leaves the union returning `null` = "do not gate on snapshot keys yet").

**Trade-off:** the probe spends a second shell spawn (bounded by the 10 s `SNAPSHOT_CREATION_TIMEOUT` `VX8`) at adapter creation. The cost is paid once per adapter and overlaps with snapshot creation (both fire-and-forget at 341353/341345), so wall-clock impact is small; the payoff is correct env-var permission prompts.

---

## 2. buildExecCommand: the && chain assembler

`buildExecCommand(command, ctx)` (`cli_inner_pretty.js:341360-341397`) is the single function that turns a raw user command into `{ commandString, cwdFilePath }`. It (a) resolves and validates the snapshot, (b) computes the CWD write/read paths, (c) NUL-substitutes → pipe-tests → eval-wraps the user command, (d) builds the `P[]` chain in exact order, joins with `" && "`, and (e) optionally splices `CLAUDE_CODE_SHELL_PREFIX`.

```javascript
// ============================================
// buildExecCommand - Assembles the && chain handed to `bash -c`
// Location: cli_inner_pretty.js:341360-341397
// ============================================

// ORIGINAL (for source lookup):
async buildExecCommand(A, Y) {
  let f = await K;
  if (f)
    try { await Ws7.access(f); }
    catch {
      if ((N(`Snapshot file missing, falling back to login shell: ${f}`), !z))
        ((z = !0), t$("shell_snapshot_create", "snapshot_missing_at_exec"));
      f = void 0;
    }
  ((_ = f), n98(f !== void 0), (q = Y.sandboxTmpDir));
  let O = vd(),
    M = n$() === "windows",
    j = M ? cW(O) : O,
    w = Y.useSandbox ? SG$.join(Y.sandboxTmpDir, `cwd-${Y.id}`) : SG$.join(j, `claude-${Y.id}-cwd`),
    D = Y.useSandbox ? SG$.join(Y.sandboxTmpDir, `cwd-${Y.id}`) : Zs7.join(O, `claude-${Y.id}-cwd`),
    J = Ls7(A),
    X = Xs7(J),
    L = Js7(J, X);
  if (J.includes("|") && X) L = Os7(J);
  let P = [];
  if (f) {
    let V = n$() === "windows" ? cW(f) : f;
    P.push(`source ${O4([V])} 2>/dev/null || true`);
  }
  if (M) P.push(`export TEMP=${O4([O])} TMP=${O4([O])}`);
  let Z = await Tv7();
  if (Z) P.push(`${Z}\n:`);
  if (xH(process.env.CLAUDE_CODE_REMOTE)) P.push('export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"');
  let W = qJ_(H);
  if (W) P.push(W);
  (P.push(`eval ${L}`), P.push(`pwd -P >| ${O4([w])}`));
  let G = P.join(" && ");
  if (process.env.CLAUDE_CODE_SHELL_PREFIX) G = NX8(process.env.CLAUDE_CODE_SHELL_PREFIX, G);
  return { commandString: G, cwdFilePath: D };
}

// READABLE (for understanding):
async buildExecCommand(userCommand, ctx) {
  // (a) resolve snapshot; if file vanished between create and exec, fall back to login shell
  let snapshotPath = await snapshotPromise;                     // f = await K
  if (snapshotPath) {
    try { await fsPromises.access(snapshotPath); }              // Ws7.access
    catch {
      debugLog(`Snapshot file missing, falling back to login shell: ${snapshotPath}`);
      if (!missingTelemetryFired) {                             // one-shot z
        missingTelemetryFired = true;
        spanFail("shell_snapshot_create", "snapshot_missing_at_exec"); // t$
      }
      snapshotPath = undefined;
    }
  }
  resolvedSnapshotPath = snapshotPath;                          // _ (read by getSpawnArgs)
  setSnapshotPresent(snapshotPath !== undefined);              // n98 — re-assert policy gate
  sandboxTmpDir = ctx.sandboxTmpDir;                            // q (read by getEnvironmentOverrides)

  // (b) where the spawned shell writes CWD vs. where Node reads it back
  const tmpdir = getCwdReal();                                  // O = vd()
  const isWindows = getPlatform() === "windows";               // M
  const tmpdirForWrite = isWindows ? toCygwinPath(tmpdir) : tmpdir; // j
  const cwdWritePath = ctx.useSandbox
    ? pathJoinPosix(ctx.sandboxTmpDir, `cwd-${ctx.id}`)
    : pathJoinPosix(tmpdirForWrite, `claude-${ctx.id}-cwd`);    // w
  const cwdReadPath = ctx.useSandbox
    ? pathJoinPosix(ctx.sandboxTmpDir, `cwd-${ctx.id}`)
    : pathJoinNative(tmpdir, `claude-${ctx.id}-cwd`);           // D

  // (c) NUL-substitute → pipe-safety test → eval-wrap
  const nulFixed = substituteNulRedirect(userCommand);         // J = Ls7(A)
  const appendDevNull = shouldAppendDevNull(nulFixed);         // X = Xs7(J)
  let wrapped = wrapCommandForExec(nulFixed, appendDevNull);   // L = Js7(J, X)
  if (nulFixed.includes("|") && appendDevNull) wrapped = pipeSafeWrap(nulFixed); // L = Os7(J)

  // (d) build the && chain — EXACT ORDER
  const chain = [];
  if (snapshotPath) {                                          // (1) source snapshot
    const srcPath = isWindows ? toCygwinPath(snapshotPath) : snapshotPath;
    chain.push(`source ${shellQuote([srcPath])} 2>/dev/null || true`);
  }
  if (isWindows) chain.push(`export TEMP=${shellQuote([tmpdir])} TMP=${shellQuote([tmpdir])}`); // (2) NEW
  const sessionEnv = await getSessionEnvScript();              // (3) Z = await Tv7()
  if (sessionEnv) chain.push(`${sessionEnv}\n:`);             //     trailing `\n:` resets exit status
  if (parseBoolean(process.env.CLAUDE_CODE_REMOTE))           // (4) remote BUN_OPTIONS
    chain.push('export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"');
  const extglobOff = disableExtglobPrefix(shellPath);         // (5) W = qJ_(H)
  if (extglobOff) chain.push(extglobOff);
  chain.push(`eval ${wrapped}`);                              // (6) eval wrapped user command
  chain.push(`pwd -P >| ${shellQuote([cwdWritePath])}`);     // (7) capture post-command CWD

  // (e) join + optional outer prefix splice
  let commandString = chain.join(" && ");
  if (process.env.CLAUDE_CODE_SHELL_PREFIX)
    commandString = spliceShellPrefix(process.env.CLAUDE_CODE_SHELL_PREFIX, commandString); // NX8
  return { commandString, cwdFilePath: cwdReadPath };
}

// Mapping: A→userCommand, Y→ctx, K→snapshotPromise, f→snapshotPath, Ws7→fsPromises,
//   z→missingTelemetryFired, t$→spanFail, _→resolvedSnapshotPath, n98→setSnapshotPresent,
//   q→sandboxTmpDir, O→tmpdir(vd=getCwdReal), M→isWindows(n$=getPlatform), cW→toCygwinPath,
//   j→tmpdirForWrite, w→cwdWritePath, D→cwdReadPath, SG$→path/posix, Zs7→path,
//   Ls7→substituteNulRedirect, Xs7→shouldAppendDevNull, Js7→wrapCommandForExec, Os7→pipeSafeWrap,
//   O4→shellQuote, Tv7→getSessionEnvScript, xH→parseBoolean, qJ_→disableExtglobPrefix,
//   NX8→spliceShellPrefix
```

### The exact `P[]` order (and why each link exists)

| # | Link | Source line | Condition | Purpose |
|---|------|-------------|-----------|---------|
| 1 | `source <snapshot> 2>/dev/null \|\| true` | 341381-341384 | `f` (snapshot exists) | Restore user functions/aliases/options. `\|\| true` because a bad snapshot must not abort the command. |
| 2 | `export TEMP=… TMP=…` | 341385 | `M` (windows) | **NEW in 2.1.156.** Git-bash/Cygwin tools (esp. bun) read `TEMP`/`TMP` for scratch dirs; export them to the cygwin-readable tmpdir. |
| 3 | `<session-env-hook-block>\n:` | 341386-341389 | `Z = await Tv7()` non-empty | Inject `CLAUDE_ENV_FILE` + session-env hook scripts. Trailing newline+`:` (the bash no-op) forces exit status 0 so `set -e` inside a hook can't short-circuit the `&&`. |
| 4 | `export BUN_OPTIONS="--smol…"` | 341390 | `xH(CLAUDE_CODE_REMOTE)` | In remote sandboxes, run bun with `--smol` (low-memory mode), preserving any pre-existing `BUN_OPTIONS`. |
| 5 | `shopt -u extglob …` | 341391-341392 | `W = qJ_(H)` non-null | Disable extglob so user-typed `?(…)`/`!(…)` are literal, not extended-glob operators. |
| 6 | `eval <wrapped-command>` | 341393 | always | Execute the user's command. `eval` lets the wrapped single-token expand back into a full command line. |
| 7 | `pwd -P >\| <cwdWritePath>` | 341393 | always | Write the post-command physical CWD so Node can track `cd` side effects. `>\|` clobbers past `noclobber`. |

After the join, if `CLAUDE_CODE_SHELL_PREFIX` is set, the whole chain is spliced through `spliceShellPrefix` (`NX8`, `cli_inner_pretty.js:341395`).

**Why `&&` and not `;`:** the model only sees the spawned process's exit code, which is dominated by the `eval` link (#6). With `&&`, a failed snapshot/extglob step short-circuits and surfaces a real non-zero exit, rather than silently running the user command against a half-initialized shell. The advisory steps (source #1, extglob #5) each carry `|| true`, so their *own* failure never aborts the chain — only a genuinely broken setup (e.g. session-env hook erroring without the `\n:` reset) propagates.

**Key insight (the `f` recheck at 341362-341369):** even though `K` already resolved a path, the file can be deleted between creation and the *first* command (retention sweep, `claude project purge`, manual `rm`). `buildExecCommand` re-`access`es it, and on failure (a) logs, (b) fires `snapshot_missing_at_exec` telemetry **once** via the `z` latch, (c) sets `f = undefined` so link #1 is skipped and `getSpawnArgs` re-adds `-l` (login shell) — the graceful fallback. This is identical in shape to the v2.1.142 doc's fallback, only the obfuscated names changed (`ep7`→`Ws7`, `A`-latch→`z`, `J8`→`t$`).

---

## 3. Command-wrapping helpers (deep analysis)

The user command flows through four transforms before it reaches `eval`: `substituteNulRedirect` → `shouldAppendDevNull` → `wrapCommandForExec` (or `pipeSafeWrap` for piped commands). All four are in the cluster `cli_inner_pretty.js:341301-341339` and `340918-340923`.

### 3.1 substituteNulRedirect (`Ls7`, 341327) — cross-platform NUL

```javascript
// ============================================
// substituteNulRedirect - Rewrites Windows `>NUL` to `>/dev/null`
// Location: cli_inner_pretty.js:341327-341332
// ============================================

// ORIGINAL (for source lookup):
function Ls7(H) {
  return H.replace($J_, "$1/dev/null");
}
var $J_;
var Ps7 = T(() => {
  $J_ = /(\d?&?>+\s*)[Nn][Uu][Ll](?=\s|$|[|&;)\n])/g;
});

// READABLE (for understanding):
function substituteNulRedirect(command) {
  return command.replace(NUL_REDIRECT_REGEX, "$1/dev/null");
}
const NUL_REDIRECT_REGEX = /(\d?&?>+\s*)[Nn][Uu][Ll](?=\s|$|[|&;)\n])/g;

// Mapping: Ls7→substituteNulRedirect, $J_→NUL_REDIRECT_REGEX, Ps7→regexInit
```

**What it does:** rewrites `… > NUL`, `2>nul`, `&>NUL` (case-insensitive) to the Unix `/dev/null`, preserving the redirect operator via capture group `$1`.

**How it works:** the regex captures the redirect prefix `(\d?&?>+\s*)` — an optional fd number, optional `&`, one-or-more `>`, optional whitespace — then matches `NUL` case-insensitively, gated by a lookahead `(?=\s|$|[|&;)\n])` that requires `NUL` to be *followed* by whitespace, end-of-string, or a shell control char. `$1/dev/null` re-emits the prefix and swaps in the Unix sink.

**Why this approach:** models trained on mixed Windows/Linux corpora emit `2>NUL` even when Claude runs under bash. On Unix that would open a literal file named `NUL` or error. The lookahead is the clever part: it prevents clobbering `NULL` (a C macro in a here-string), `cat NUL` (no redirect operator → `$1` empty), or `nullsh` — only `NUL` in actual redirect position is rewritten. **Unchanged from v2.1.142** (same regex, renamed `sp7`→`Ls7`, `Di_`→`$J_`). **Absent from v2.1.88** `ShellSnapshot.ts` entirely — this lives in the provider/executor layer, not the snapshot module.

### 3.2 shouldAppendDevNull (`Xs7`, 341322) + detectors

```javascript
// ============================================
// shouldAppendDevNull / hasHeredoc / hasInputRedirect - Gate for `< /dev/null`
// Location: cli_inner_pretty.js:341301-341325
// ============================================

// ORIGINAL (for source lookup):
function px6(H) {
  if (/\d\s*<<\s*\d/.test(H) || /\[\[\s*\d+\s*<<\s*\d+\s*\]\]/.test(H) || /\$\(\(.*<<.*\)\)/.test(H)) return !1;
  return /<<-?\s*(?:(['"]?)(\w+)\1|\\(\w+))/.test(H);
}
function HJ_(H) { return /(?:^|[\s;&|])<(?![<(])\s*\S+/.test(H); }
function Xs7(H) {
  if (px6(H)) return !1;
  if (HJ_(H)) return !1;
  return !0;
}

// READABLE (for understanding):
function hasHeredoc(command) {
  // Reject false positives first: bit-shift / arithmetic
  if (/\d\s*<<\s*\d/.test(command)) return false;                 // 1 << 3
  if (/\[\[\s*\d+\s*<<\s*\d+\s*\]\]/.test(command)) return false; // [[ 1 << 3 ]]
  if (/\$\(\(.*<<.*\)\)/.test(command)) return false;             // $(( 1 << 3 ))
  return /<<-?\s*(?:(['"]?)(\w+)\1|\\(\w+))/.test(command);       // <<EOF, <<-EOF, <<'EOF', <<\EOF
}
function hasInputRedirect(command) {
  // a `<` (not `<<` or `<(`) preceded by start/space/;/&/|
  return /(?:^|[\s;&|])<(?![<(])\s*\S+/.test(command);
}
function shouldAppendDevNull(command) {
  if (hasHeredoc(command)) return false;       // heredoc IS the stdin
  if (hasInputRedirect(command)) return false; // already redirected
  return true;
}

// Mapping: px6→hasHeredoc, HJ_→hasInputRedirect, Xs7→shouldAppendDevNull
```

**What "should append dev null" means:** is it safe to give the wrapped command `< /dev/null` so it can't hang on a missing stdin?

**How it works:** `shouldAppendDevNull` returns `true` only when the command has **neither** a heredoc **nor** an explicit input redirect. `hasHeredoc` first rules out three bit-shift/arithmetic false positives (`1<<3`, `[[ n<<m ]]`, `$((…<<…))`) before testing the heredoc grammar `<<-?` followed by a quoted/unquoted/backslashed delimiter word. `hasInputRedirect` matches a bare `<` (negative lookahead `(?![<(])` excludes `<<` heredoc and `<(` process substitution) that is in command position.

**Why this approach:** Bash-tool commands run with no controlling TTY. A command that reads stdin (`read x`, `npm publish` awaiting OTP) would hang forever. Appending `< /dev/null` gives an instant EOF. But blindly appending it would *break* a heredoc (whose body **is** the stdin) or stomp an explicit `cmd < file`. The three-way gate threads that needle: redirect only when the command isn't already managing its own stdin. **Algorithm unchanged from v2.1.142** (`bv6`→`px6`, `wi_`→`HJ_`, `ap7`→`Xs7` — note v2.1.142 named `ap7` "isPipeSafe"; the 2.1.156 brief renames it `shouldAppendDevNull`, which is the more accurate name since it gates the `< /dev/null` append for *all* commands, not just piped ones).

### 3.3 wrapCommandForExec (`Js7`, 341310) — the core wrapper

```javascript
// ============================================
// wrapCommandForExec - Quotes the user command for `eval`; appends `< /dev/null` when safe
// Location: cli_inner_pretty.js:341305-341318
// ============================================

// ORIGINAL (for source lookup):
function eD_(H) {
  let $ = /'(?:[^'\\]|\\.)*\n(?:[^'\\]|\\.)*'/,
    q = /"(?:[^"\\]|\\.)*\n(?:[^"\\]|\\.)*"/;
  return $.test(H) || q.test(H);
}
function Js7(H, $ = !0) {
  if (px6(H) || eD_(H)) {
    let _ = `'${H.replaceAll("'", `'"'"'`)}'`;
    if (px6(H)) return _;
    return $ ? `${_} < /dev/null` : _;
  }
  let q = O4([H]);
  return $ ? `${q} < /dev/null` : q;
}

// READABLE (for understanding):
function hasMultilineQuote(command) {
  const singleQ = /'(?:[^'\\]|\\.)*\n(?:[^'\\]|\\.)*'/; // '...\n...'
  const doubleQ = /"(?:[^"\\]|\\.)*\n(?:[^"\\]|\\.)*"/; // "...\n..."
  return singleQ.test(command) || doubleQ.test(command);
}
function wrapCommandForExec(command, appendDevNull = true) {
  if (hasHeredoc(command) || hasMultilineQuote(command)) {
    // Heredoc/multiline: literal single-quote wrap with the '"'"' escape so
    // newlines survive verbatim (shellQuote would mangle a heredoc body).
    const quoted = `'${command.replaceAll("'", `'"'"'`)}'`;
    if (hasHeredoc(command)) return quoted;            // heredoc supplies its own stdin → no /dev/null
    return appendDevNull ? `${quoted} < /dev/null` : quoted;
  }
  // Simple command: minimal shell-quote, then optionally redirect stdin.
  const quoted = shellQuote([command]);                // O4
  return appendDevNull ? `${quoted} < /dev/null` : quoted;
}

// Mapping: eD_→hasMultilineQuote, Js7→wrapCommandForExec, H→command, $→appendDevNull,
//   px6→hasHeredoc, O4→shellQuote
```

**What it does:** produces a single shell-quoted token (plus optional `< /dev/null`) that `eval` can safely re-expand.

**How it works — two paths:**
1. **Heredoc / multiline-quote path** (`hasHeredoc || hasMultilineQuote`): wrap the *entire* command in literal single quotes, escaping internal `'` with the canonical `'"'"'` trick. If it's a heredoc, return *without* `< /dev/null` (the heredoc body is the stdin — adding `/dev/null` would close it). Otherwise honor `appendDevNull`.
2. **Simple path:** call `shellQuote([command])` (`O4`) — the array-to-single-word quoter that adds quoting only where needed — then honor `appendDevNull`.

**Why two paths:** `shellQuote` is built to quote a single argument; feeding it a multiline heredoc would either lose the newlines or over-escape them. The single-quote-literal path preserves bytes exactly, which is mandatory for heredocs (literal newlines + delimiter) and multiline quoted strings. The `'"'"'` sequence is the only portable way to embed a `'` inside a single-quoted string: *close the quote, emit a double-quoted single-quote, reopen the quote*. **Algorithm unchanged from v2.1.142** (`op7`→`Js7`, `Mi_`→`eD_`); only the obfuscated names differ.

### 3.4 pipeSafeWrap (`Os7`, 340918) — the piped-command override

```javascript
// ============================================
// pipeSafeWrap / shellSingleQuote - Always single-quote + `< /dev/null` for piped commands
// Location: cli_inner_pretty.js:340918-340923
// ============================================

// ORIGINAL (for source lookup):
function Os7(H) {
  return cD_(H) + " < /dev/null";
}
function cD_(H) {
  return "'" + H.replaceAll("'", `'"'"'`) + "'";
}

// READABLE (for understanding):
function pipeSafeWrap(command) {
  return shellSingleQuote(command) + " < /dev/null";
}
function shellSingleQuote(command) {
  // Unconditional single-quote wrap with the '"'"' escape.
  return "'" + command.replaceAll("'", `'"'"'`) + "'";
}

// Mapping: Os7→pipeSafeWrap, cD_→shellSingleQuote, H→command
```

**When it fires:** `buildExecCommand` overrides the `wrapCommandForExec` result with `pipeSafeWrap` only when `nulFixed.includes("|") && appendDevNull` (`cli_inner_pretty.js:341379`) — i.e. the command contains a pipe **and** is stdin-safe (no heredoc/input-redirect).

**Why a separate path for pipes:** for a pipeline like `ls -la | grep foo`, `wrapCommandForExec`'s simple path would call `shellQuote(["ls -la | grep foo"])`, which is conservative. `pipeSafeWrap` instead *always* wraps the whole pipeline in one literal single-quoted token and appends `< /dev/null`. Appending the redirect after the closing quote means it applies to the *first* stage of the pipeline (where stdin matters), which is exactly where a pipeline would otherwise read from the (absent) terminal. **Unchanged from v2.1.142** (`lp7`→`Os7`, `qi_`→`cD_`); note the brief flags that `cD_` is the local single-quote helper actually used here (the snapshot-creation code paths use `O4`/`quote` for quoting).

---

## 4. disableExtglobPrefix (`qJ_`, 341334) — CHANGED in 2.1.156

```javascript
// ============================================
// disableExtglobPrefix - Shell-specific extglob/glob-qualifier disable string
// Location: cli_inner_pretty.js:341334-341339
// ============================================

// ORIGINAL (for source lookup):
function qJ_(H) {
  if (process.env.CLAUDE_CODE_SHELL_PREFIX)
    return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB NO_BARE_GLOB_QUAL; } >/dev/null 2>&1 || true";
  if (H.includes("bash")) return "shopt -u extglob 2>/dev/null || true";
  else if (H.includes("zsh")) return "setopt NO_EXTENDED_GLOB NO_BARE_GLOB_QUAL 2>/dev/null || true";
  return null;
}

// READABLE (for understanding):
function disableExtglobPrefix(shellPath) {
  if (process.env.CLAUDE_CODE_SHELL_PREFIX)
    // Prefix may run an unknown shell — emit a both-shells-tolerant form.
    return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB NO_BARE_GLOB_QUAL; } >/dev/null 2>&1 || true";
  if (shellPath.includes("bash")) return "shopt -u extglob 2>/dev/null || true";
  if (shellPath.includes("zsh")) return "setopt NO_EXTENDED_GLOB NO_BARE_GLOB_QUAL 2>/dev/null || true";
  return null;
}

// Mapping: qJ_→disableExtglobPrefix, H→shellPath
```

**What changed vs v2.1.142:** the v2.1.142 doc's `ji_` emitted only `setopt NO_EXTENDED_GLOB` for zsh (and inside the prefix branch). 2.1.156 adds **`NO_BARE_GLOB_QUAL`** to both the zsh branch (`cli_inner_pretty.js:341338`) and the prefix branch (`cli_inner_pretty.js:341336`). The bash branch is unchanged.

**Why disable both:** zsh's *extended glob* (`NO_EXTENDED_GLOB`) governs `(…|…)`, `^`, `#`, `~` patterns; zsh's *bare glob qualifier* (`BARE_GLOB_QUAL`) makes a trailing `(…)` on a glob a file-attribute qualifier (e.g. `*(.)` = regular files only). A model emitting `ls *(foo)` expecting POSIX-ish behavior would, under a user's zsh with `BARE_GLOB_QUAL`, have `(foo)` silently interpreted as a qualifier and fail. Disabling both makes user-typed globs literal in Claude's spawned shell, matching the bash-side intent of disabling `extglob`. The user's interactive zsh is untouched — only the command-tool shell turns these off.

**Why `|| true` / `>/dev/null 2>&1`:** on a shell that doesn't support a given option the `setopt`/`shopt` errors; the redirect+`|| true` swallow that so this advisory link never aborts the `&&` chain.

---

## 5. spliceShellPrefix (`NX8`, 341292) — the outer wrapper

```javascript
// ============================================
// spliceShellPrefix - Wraps the assembled chain with CLAUDE_CODE_SHELL_PREFIX
// Location: cli_inner_pretty.js:341292-341299
// ============================================

// ORIGINAL (for source lookup):
function NX8(H, $) {
  let q = H.lastIndexOf(" -");
  if (q > 0) {
    let K = H.substring(0, q),
      _ = H.substring(q + 1);
    return `${O4([K])} ${_} ${O4([$])}`;
  } else return `${O4([H])} ${O4([$])}`;
}

// READABLE (for understanding):
function spliceShellPrefix(prefix, commandString) {
  const flagBoundary = prefix.lastIndexOf(" -"); // split binary from first flag
  if (flagBoundary > 0) {
    const binary = prefix.substring(0, flagBoundary);  // e.g. "firejail"
    const flags  = prefix.substring(flagBoundary + 1); // e.g. "--noprofile"
    return `${shellQuote([binary])} ${flags} ${shellQuote([commandString])}`;
  }
  return `${shellQuote([prefix])} ${shellQuote([commandString])}`;
}

// Mapping: NX8→spliceShellPrefix, H→prefix, $→commandString, O4→shellQuote
```

**What it does:** if `CLAUDE_CODE_SHELL_PREFIX` is set (e.g. `firejail --noprofile`, `nsjail -Mo --chroot /`), wrap the whole `&&` chain so it runs *under* that sandbox/wrapper. It splits the prefix at the **last** `" -"` so the binary path (possibly containing spaces) is `shellQuote`d while flags pass through unquoted for the shell to tokenize. **Unchanged from v2.1.142** (`nY8`→`NX8`). This is the outer-most transform produced by `buildExecCommand`; any sandbox-adapter wrap (when `ctx.useSandbox`) is applied *after* this, before spawn.

---

## 6. CWD capture: `pwd -P >| <file>`

The final chain link is `pwd -P >| <cwdWritePath>` (`cli_inner_pretty.js:341393`). After the spawned process exits, the executor reads `cwdReadPath` (the same file via a native path) to detect a `cd` side effect.

- **`pwd -P`** resolves symlinks (physical path), so a tracked CWD never points through a symlink that could later change.
- **`>|`** is the clobber-redirect; it overwrites even when the user's snapshot restored `set -o noclobber`.
- **Per-invocation path** `claude-${ctx.id}-cwd` (or `cwd-${ctx.id}` under sandbox) avoids collisions across concurrent Bash tool calls.
- **write vs read path split** (`w` vs `D`, `cli_inner_pretty.js:341374-341375`): on Windows the *shell* writes to a cygwin path (`toCygwinPath(tmpdir)`), but *Node* reads the native path — hence two `join`s, `path/posix` (`SG$`) for the shell side and `path` (`Zs7`) for the Node side.

**Why capture CWD this way:** `cd /some/dir && cmd` runs in the *spawned* shell; Node's own `process.cwd()` is unaffected. Reading back `pwd -P` lets Claude update its **own** tracked CWD (separate from `process.chdir`) so the next Bash command starts where the last one ended, without polluting unrelated file operations. The read-back/NFC-normalize/`setCwd` logic is in the executor (documented in the v2.1.142 `command_assembly.md` §9) and is unchanged in shape for 2.1.156.

---

## 7. Final chain example & cross-validation

A typical assembled `commandString` (non-windows, snapshot present, session-env hooks present):

```bash
source '/home/u/.claude/shell-snapshots/snapshot-zsh-1733000000000-x7k2pq.sh' 2>/dev/null || true \
  && <session-env-hook-scripts>\n: \
  && setopt NO_EXTENDED_GLOB NO_BARE_GLOB_QUAL 2>/dev/null || true \
  && eval 'ls -la | grep foo' < /dev/null \
  && pwd -P >| '/tmp/claude-7e3a-cwd'
```

### Consumer-flow cross-validation vs v2.1.142

| Aspect | v2.1.142 | v2.1.156 | Status |
|--------|----------|----------|--------|
| Adapter factory | `createBashShellProvider` (`$U7`) | `createBashShellAdapter` (`Gs7`, 341341) | renamed (brief: use `createBashShellAdapter`) |
| Snapshot promise `K` side effects | snapshot path only (thinner span/presence wiring) | `.then` runs `spanStart` + `setSnapshotPresent`; `.catch` runs `spanFail` + `setSnapshotPresent(false)` (341347/341350) | CHANGED — presence now set at create |
| Spawn-env probe | none | `probeSpawnEnv(shellPath)` fired at 341353 | **NEW** |
| `P[]` link: windows `export TEMP/TMP` | absent | `cli_inner_pretty.js:341385` | **NEW** |
| `P[]` link: remote `BUN_OPTIONS` | present (`bH(...)`) | present (`xH(...)`, 341390) | unchanged (boolean parser renamed `bH`→`xH`) |
| extglob zsh string | `setopt NO_EXTENDED_GLOB` | `setopt NO_EXTENDED_GLOB NO_BARE_GLOB_QUAL` (341336/341338) | CHANGED |
| NUL / pipe / eval / heredoc helpers | `sp7`/`ap7`/`op7`/`lp7`/`bv6`/`Mi_`/`wi_` | `Ls7`/`Xs7`/`Js7`/`Os7`/`px6`/`eD_`/`HJ_` | unchanged algorithm, renamed |
| Re-assert `setSnapshotPresent` at exec | implicit | explicit `n98(f !== void 0)` (341370) | present |

### Cross-validation vs v2.1.88 clean source (`ShellSnapshot.ts`)

`ShellSnapshot.ts` is the **producer** module (snapshot script creation, `createAndSaveSnapshot`). It contains **none** of the consumer-side command-assembly logic — no `buildExecCommand`, no NUL substitution, no eval wrap, no extglob disable, no spawn-env probe. All of §2–§6 here is provider/executor code that lives outside `ShellSnapshot.ts`. Specifically confirmed absent from the v2.1.88 clean source:
- **spawn-env probe** (`ws7`): no `shell -c env` call anywhere in `ShellSnapshot.ts`.
- **`NO_BARE_GLOB_QUAL`**: the string does not appear (clean source has no extglob-disable code at all).
- **windows `export TEMP/TMP`**: not present.

This confirms the three CHANGED/NEW items are genuine 2.1.156 (consumer-layer) behaviors, not artifacts of comparing against the wrong module.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions

Key functions in this document:
- `createBashShellAdapter` (`Gs7`) — adapter factory; starts snapshot promise + spawn-env probe, returns provider — `cli_inner_pretty.js:341341`
- `buildExecCommand` (method of `Gs7`) — assembles the `&&` chain handed to `bash -c` — `cli_inner_pretty.js:341360-341397`
- `probeSpawnEnv` (`ws7`) — NEW spawn-env side-channel; `shell -c env` → key set → `setSpawnEnvKeys` — `cli_inner_pretty.js:341137-341159`
- `setSnapshotPresent` (`n98`) — flips the env-key-union gate `q97` — `cli_inner_pretty.js:209855`
- `setSpawnEnvKeys` (`i98`) — stores probed key set `l26` — `cli_inner_pretty.js:209861`
- `substituteNulRedirect` (`Ls7`) — `>NUL` → `>/dev/null` (regex `$J_`) — `cli_inner_pretty.js:341327`
- `shouldAppendDevNull` (`Xs7`) — gates the `< /dev/null` append — `cli_inner_pretty.js:341322`
- `hasHeredoc` (`px6`) — heredoc detector (bit-shift false positives excluded) — `cli_inner_pretty.js:341301`
- `hasMultilineQuote` (`eD_`) — multiline single/double-quote detector — `cli_inner_pretty.js:341305`
- `hasInputRedirect` (`HJ_`) — bare `<` input-redirect detector — `cli_inner_pretty.js:341319`
- `wrapCommandForExec` (`Js7`) — quotes the command for `eval`, appends `< /dev/null` when safe — `cli_inner_pretty.js:341310`
- `pipeSafeWrap` (`Os7`) — unconditional single-quote + `< /dev/null` for piped commands — `cli_inner_pretty.js:340918`
- `shellSingleQuote` (`cD_`) — `'…'` wrap with the `'"'"'` escape — `cli_inner_pretty.js:340921`
- `disableExtglobPrefix` (`qJ_`) — extglob/`NO_BARE_GLOB_QUAL` disable string — `cli_inner_pretty.js:341334`
- `spliceShellPrefix` (`NX8`) — splices `CLAUDE_CODE_SHELL_PREFIX` around the chain — `cli_inner_pretty.js:341292`
- `getSessionEnvScript` (`Tv7`) — concatenated `CLAUDE_ENV_FILE` + session-env hook scripts — `cli_inner_pretty.js:270265`
- `parseBoolean` (`xH`) — boolean env parser used for `CLAUDE_CODE_REMOTE` — `cli_inner_pretty.js:1795`
