# Command Assembly Pipeline (Claude Code 2.1.112)

> The pipeline that transforms a user-typed command into the final string passed to `bash -c`: NUL substitution, pipe-safety detection, eval wrapping, snapshot sourcing, session-env hooks, extglob disable, CWD capture, and the optional `CLAUDE_CODE_SHELL_PREFIX` outer wrapper.

Source: `chunks.144.mjs` (lines 2099-2509). v2.1.88 readable counterpart: `src/utils/shell/bashProvider.ts` (`buildExecCommand` body) and `src/utils/Shell.ts` (`exec` body).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_08.md](../00_overview/symbol_additions_unit_08.md) - Unit 8 mappings
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `buildExecCommand` (`iPK.buildExecCommand`) - Top-level command assembler - chunks.144.mjs:2157-2191
- `substituteNulRedirect` (`lPK`) - Windows `NUL` -> `/dev/null` - chunks.144.mjs:2130
- `isPipeSafe` (`cPK`) - Pipe-redirect safety check - chunks.144.mjs:2124
- `evalWrap` (`dPK`) - Standard eval wrap with optional `< /dev/null` - chunks.144.mjs:2110
- `evalWrapPipeSafe` (`gPK`) - Simple single-quote wrap + `< /dev/null` (used when pipe present and pipe-safe) - chunks.144.mjs:1802
- `disableExtglobCommand` (`wzY`) - Shell-specific extglob disable - chunks.144.mjs:2140
- `applyShellPrefix` (`dU8`) - Wraps the chain with `CLAUDE_CODE_SHELL_PREFIX` - chunks.144.mjs:2088
- `getSessionEnvironment` (`PC4`) - Returns concatenated hook scripts - chunks.98.mjs:2616

---

## 1. Top-Level Assembler

The `buildExecCommand` method of the bash provider is the single function responsible for turning a raw user command into the string passed to `bash -c`. It returns `{ commandString, cwdFilePath }`.

```javascript
// ============================================
// buildExecCommand - Bash provider's command-assembly entry point
// Location: chunks.144.mjs:2157-2191
// ============================================

// ORIGINAL (for source lookup):
async buildExecCommand(A, O) {
    let w = await z;
    if (w) try {
        await AzY(w)
    } catch {
        E(`Snapshot file missing, falling back to login shell: ${w}`), w = void 0
    }
    Y = w, _ = O.sandboxTmpDir;
    let $ = z2(),
        H = y1() === "windows" ? sX($) : $,
        J = O.useSandbox ? cU8(O.sandboxTmpDir, `cwd-${O.id}`) : cU8(H, `claude-${O.id}-cwd`),
        X = O.useSandbox ? cU8(O.sandboxTmpDir, `cwd-${O.id}`) : OzY($, `claude-${O.id}-cwd`),
        M = lPK(A),
        P = cPK(M),
        W = dPK(M, P);
    if (M.includes("|") && P) W = gPK(M);
    let D = [];
    if (w) {
        let v = y1() === "windows" ? sX(w) : w;
        D.push(`source ${A5([v])} 2>/dev/null || true`)
    }
    let Z = await PC4();
    if (Z) D.push(`${Z}\n:`);
    if (S6(process.env.CLAUDE_CODE_REMOTE)) D.push('export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"');
    let G = wzY(q);
    if (G) D.push(G);
    D.push(`eval ${W}`), D.push(`pwd -P >| ${A5([J])}`);
    let f = D.join(" && ");
    if (process.env.CLAUDE_CODE_SHELL_PREFIX) f = dU8(process.env.CLAUDE_CODE_SHELL_PREFIX, f);
    return { commandString: f, cwdFilePath: X }
}

// READABLE (for understanding):
async buildExecCommand(userCommand, ctx) {
  // Step 1: resolve the snapshot promise; if file vanished, fall back to login shell
  let snapshotPath = await snapshotPromise;
  if (snapshotPath) {
    try {
      await statSnapshot(snapshotPath);
    } catch {
      debugLog(`Snapshot file missing, falling back to login shell: ${snapshotPath}`);
      snapshotPath = undefined;
    }
  }

  // Stash into closure for getSpawnArgs / getEnvironmentOverrides
  resolvedSnapshotPath = snapshotPath;
  sandboxTmpDir = ctx.sandboxTmpDir;

  // Step 2: choose where the shell writes CWD and where Node reads it back
  const tmpdir = osTmpdir();
  const tmpdirWritable = getPlatform() === "windows" ? posixPathToWindowsPath(tmpdir) : tmpdir;
  const cwdWritePath = ctx.useSandbox
    ? pathJoinPosix(ctx.sandboxTmpDir, `cwd-${ctx.id}`)
    : pathJoinPosix(tmpdirWritable, `claude-${ctx.id}-cwd`);
  const cwdReadPath = ctx.useSandbox
    ? pathJoinPosix(ctx.sandboxTmpDir, `cwd-${ctx.id}`)
    : pathJoinNative(tmpdir, `claude-${ctx.id}-cwd`);

  // Step 3: NUL substitution -> pipe safety -> eval wrap
  const nulSubstituted = substituteNulRedirect(userCommand);
  const pipeSafe = isPipeSafe(nulSubstituted);
  let wrappedCommand = evalWrap(nulSubstituted, pipeSafe);
  if (nulSubstituted.includes("|") && pipeSafe) {
    wrappedCommand = evalWrapPipeSafe(nulSubstituted);
  }

  // Step 4: assemble the && chain
  const chain = [];
  if (snapshotPath) {
    const sourcePath = getPlatform() === "windows"
      ? posixPathToWindowsPath(snapshotPath) : snapshotPath;
    chain.push(`source ${shellQuote([sourcePath])} 2>/dev/null || true`);
  }
  const sessionEnv = await getSessionEnvironment();
  if (sessionEnv) chain.push(`${sessionEnv}\n:`);   // trailing `:` no-op for safe &&
  if (parseExplicitTrue(process.env.CLAUDE_CODE_REMOTE)) {
    chain.push('export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"');
  }
  const extglobOff = disableExtglobCommand(shellPath);
  if (extglobOff) chain.push(extglobOff);
  chain.push(`eval ${wrappedCommand}`);
  chain.push(`pwd -P >| ${shellQuote([cwdWritePath])}`);

  // Step 5: join + optional shell prefix wrap
  let commandString = chain.join(" && ");
  if (process.env.CLAUDE_CODE_SHELL_PREFIX) {
    commandString = applyShellPrefix(process.env.CLAUDE_CODE_SHELL_PREFIX, commandString);
  }
  return { commandString, cwdFilePath: cwdReadPath };
}

// Mapping: A->userCommand, O->ctx, z->snapshotPromise, w->snapshotPath,
//   AzY->statSnapshot, Y->resolvedSnapshotPath, _->sandboxTmpDir,
//   $->tmpdir, H->tmpdirWritable, J->cwdWritePath, X->cwdReadPath,
//   M->nulSubstituted, P->pipeSafe, W->wrappedCommand,
//   lPK->substituteNulRedirect, cPK->isPipeSafe, dPK->evalWrap, gPK->evalWrapPipeSafe,
//   D->chain, v->sourcePath, Z->sessionEnv, PC4->getSessionEnvironment,
//   G->extglobOff, wzY->disableExtglobCommand, f->commandString,
//   dU8->applyShellPrefix, A5->shellQuote, sX->posixPathToWindowsPath,
//   y1->getPlatform, z2->osTmpdir, OzY->pathJoinNative, cU8->pathJoinPosix
```

---

## 2. Final Command Chain

The end result is a single `&&`-chained shell expression:

```bash
source '/home/alice/.claude/shell-snapshots/snapshot-zsh-1715750000000-x7k2pq.sh' 2>/dev/null || true \
  && <session-env-hook-scripts>\n: \
  && export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"   # only if CLAUDE_CODE_REMOTE \
  && shopt -u extglob 2>/dev/null || true \
  && eval '<wrapped user command>' < /dev/null \
  && pwd -P >| /tmp/claude-7e3a-cwd
```

Each link is `&&`-chained so any failure short-circuits the rest — except inside the snapshot source and extglob disable, where `|| true` absorbs failures because their effects are advisory.

**Why `&&` (and not `;`):**

| Operator | Behavior | Why not for us |
|----------|----------|----------------|
| `;` | Run each command, regardless of exit code | Hides eval/snapshot failures; CWD capture could run on a broken shell state |
| `&&` | Short-circuit on non-zero exit | Hides downstream commands when a setup step fails — but the failure surfaces via the spawned process's exit code |
| Subshell | `(snapshot && cmd && pwd)` | Adds a fork; not necessary because the parent of `bash -c` is already Node, not the user's terminal |

The author chose `&&` because the eval's exit code is what the model sees. If snapshot sourcing fails, the model sees a clear failure (snapshot exit code propagated) rather than a confusing partial-success state.

---

## 3. NUL Substitution

```javascript
// ============================================
// substituteNulRedirect - Windows NUL -> /dev/null
// Location: chunks.144.mjs:2130-2138
// ============================================

// ORIGINAL (for source lookup):
function lPK(q) {
    return q.replace(YzY, "$1/dev/null")
}
YzY = /(\d?&?>+\s*)[Nn][Uu][Ll](?=\s|$|[|&;)\n])/g

// READABLE (for understanding):
function substituteNulRedirect(command) {
  return command.replace(NUL_REDIRECT_REGEX, "$1/dev/null");
}
const NUL_REDIRECT_REGEX = /(\d?&?>+\s*)[Nn][Uu][Ll](?=\s|$|[|&;)\n])/g;

// Mapping: lPK->substituteNulRedirect, YzY->NUL_REDIRECT_REGEX
```

**What this does:**

| Input | Output |
|-------|--------|
| `dir > NUL` | `dir > /dev/null` |
| `cmd 2>nul` | `cmd 2>/dev/null` |
| `npm i &>NUL` | `npm i &>/dev/null` |
| `foo nul.txt` | `foo nul.txt` (no match — not in a redirect position) |
| `cat NUL` | `cat NUL` (no match — no redirect operator) |

**Why this matters:**

Models trained on mixed Linux/Windows examples sometimes emit `2>NUL` (the Windows pattern). On Unix this would error with `bash: NUL: command not found` or open a file called `NUL`. The substitution makes both styles work transparently.

**Why the lookahead:** `(?=\s|$|[|&;)\n])` ensures we only substitute `NUL` that's followed by whitespace, end-of-string, or a shell-control char. This prevents replacing `NULL` (the C macro) in a here-string or inside `nullsh` (a real command).

---

## 4. Pipe Safety Detection

```javascript
// ============================================
// isPipeSafe / hasHeredoc / hasExplicitStdinRedirect
// Location: chunks.144.mjs:2099-2128
// ============================================

// ORIGINAL (for source lookup):
function l47(q) {
    if (/\d\s*<<\s*\d/.test(q) || /\[\[\s*\d+\s*<<\s*\d+\s*\]\]/.test(q) || /\$\(\(.*<<.*\)\)/.test(q)) return !1;
    return /<<-?\s*(?:(['"]?)(\w+)\1|\\(\w+))/.test(q)
}
function zzY(q) { return /(?:^|[\s;&|])<(?![<(])\s*\S+/.test(q) }
function cPK(q) {
    if (l47(q)) return !1;
    if (zzY(q)) return !1;
    return !0
}

// READABLE (for understanding):
function hasHeredoc(command) {
  // Reject false positives: bitshifts and arithmetic
  if (/\d\s*<<\s*\d/.test(command)) return false;          // e.g., 1 << 3
  if (/\[\[\s*\d+\s*<<\s*\d+\s*\]\]/.test(command)) return false;   // [[ 1 << 3 ]]
  if (/\$\(\(.*<<.*\)\)/.test(command)) return false;       // $((1 << 3))
  // Match heredoc syntax: <<EOF, <<-EOF, <<'EOF', <<"EOF", <<\EOF
  return /<<-?\s*(?:(['"]?)(\w+)\1|\\(\w+))/.test(command);
}
function hasExplicitStdinRedirect(command) {
  // < (not << or <( ) preceded by whitespace/semicolon/pipe/start-of-string
  return /(?:^|[\s;&|])<(?![<(])\s*\S+/.test(command);
}
function isPipeSafe(command) {
  if (hasHeredoc(command)) return false;
  if (hasExplicitStdinRedirect(command)) return false;
  return true;
}

// Mapping: l47->hasHeredoc, zzY->hasExplicitStdinRedirect, cPK->isPipeSafe
```

**What "pipe-safe" means:** is it safe to add `< /dev/null` to redirect stdin?

| Command | Has heredoc? | Has stdin redirect? | Pipe-safe? |
|---------|--------------|----------------------|------------|
| `echo hello` | No | No | Yes |
| `cat <<EOF\nfoo\nEOF` | Yes | No | No (heredoc *is* stdin) |
| `wc < input.txt` | No | Yes | No (already redirected) |
| `1 << 3` | False positive guarded | No | Yes |
| `cat file \| grep foo` | No | No | Yes |

**Why we care:** if we naively append `< /dev/null` to any command, a heredoc or explicit stdin redirect would break. The pipe-safe detection drives whether `evalWrap` adds the stdin redirect or not.

**Why we redirect stdin to /dev/null at all:** Bash tool commands are spawned without a controlling terminal. If the user's command reads from stdin (e.g., `read response`, `npm publish` waiting for OTP), it would hang forever. Redirecting stdin to `/dev/null` gives the command an immediate EOF, so it either fails fast or runs through.

---

## 5. Eval Wrapping (Standard Path)

```javascript
// ============================================
// evalWrap - Standard eval wrap with optional stdin redirect
// Location: chunks.144.mjs:2110-2118
// ============================================

// ORIGINAL (for source lookup):
function dPK(q, K = !0) {
    if (l47(q) || _zY(q)) {
        let Y = `'${q.replaceAll("'",`'"'"'`)}'`;
        if (l47(q)) return Y;
        return K ? `${Y} < /dev/null` : Y
    }
    let _ = A5([q]);
    return K ? `${_} < /dev/null` : _
}

// READABLE (for understanding):
function evalWrap(command, pipeSafe = true) {
  if (hasHeredoc(command) || hasMultilineQuoted(command)) {
    // Heredoc/multiline: single-quote the whole command, escape internal quotes
    const quoted = `'${command.replaceAll("'", `'"'"'`)}'`;
    if (hasHeredoc(command)) return quoted;          // heredoc provides own stdin
    return pipeSafe ? `${quoted} < /dev/null` : quoted;
  }
  // Simple command: shell-quote and optionally append stdin redirect
  const quoted = shellQuote([command]);
  return pipeSafe ? `${quoted} < /dev/null` : quoted;
}

// Mapping: dPK->evalWrap, q->command, K->pipeSafe,
//   _zY->hasMultilineQuoted, A5->shellQuote
```

**Two paths:**

| Path | When | How |
|------|------|-----|
| Heredoc/multiline | Command contains `<<EOF` or multi-line quoted strings | Wrap entire command in single quotes with `'"'"'` escape for internal single quotes |
| Simple | Everything else | Use shell-quote-array on the whole command string |

**Why two paths:**

- `shellQuote(["echo 'hi'"])` would return `"'echo '\\''hi'\\'''"` — readable.
- `shellQuote(["cat <<EOF\nline\nEOF"])` would break: the heredoc inside the quotes loses its newlines.

The heredoc path bypasses `shellQuote` and uses the classic shell single-quote escape `'"'"'` because heredocs require literal newlines, which single-quoting preserves exactly.

**The `'"'"'` trick:** Bash has no way to escape a single quote inside a single-quoted string. The standard workaround is `'closing single quote' "single quote inside double quotes" 'opening single quote again'`. This is the canonical pattern across shell scripting.

---

## 6. Pipe-Aware Eval Wrap (Simple Fallback in v2.1.112)

```javascript
// ============================================
// evalWrapPipeSafe / singleQuoteWrap - Pipe-aware wrap path
// Location: chunks.144.mjs:1802-1808
// ============================================

// ORIGINAL (for source lookup):
function gPK(q) {
    return l_Y(q) + " < /dev/null"
}
function l_Y(q) {
    return "'" + q.replaceAll("'", `'"'"'`) + "'"
}

// READABLE (for understanding):
function evalWrapPipeSafe(command) {
  return singleQuoteWrap(command) + " < /dev/null";
}
function singleQuoteWrap(command) {
  // Standard shell single-quote escape: '...' "'"... '...'
  return "'" + command.replaceAll("'", `'"'"'`) + "'";
}

// Mapping: gPK->evalWrapPipeSafe, l_Y->singleQuoteWrap
```

**What this does:**

When a command contains a pipe and is pipe-safe (`b54` returned true), the chain switches from `evalWrap` to `evalWrapPipeSafe`:

1. **`singleQuoteWrap`** — wraps the whole command in literal single quotes, escaping any internal single quotes with the `'"'"'` trick. The result is one shell-quoted token suitable for `eval`.
2. **Append `< /dev/null`** — gives `eval`'s combined command an empty stdin.

**Difference from `evalWrap`:**

| Function | Wrapping | When |
|----------|----------|------|
| `evalWrap` (`dPK`) | Either `shellQuote([cmd])` for simple commands, or `'...'` single-quote for heredocs/multiline | Always |
| `evalWrapPipeSafe` (`gPK`) | Always `'...'` single-quote | Only when command contains `\|` AND is pipe-safe |

The semantic difference: `shellQuote([cmd])` is conservative — it adds quoting only where needed. `singleQuoteWrap` is unconditional — it always wraps in `'...'`. For a command like `ls -la | grep foo`, the former gives `'ls -la | grep foo'` (just enough), the latter gives `'ls -la | grep foo'` (same). For `ls $HOME`, `shellQuote` gives `'ls $HOME'` (literal `$HOME`, escaped), but unconditional single-quote also gives `'ls $HOME'` — both preserve the literal, just via different paths.

**Why the simpler approach in v2.1.112:**

v2.1.76 had a more complex `B54`/`gPK` that tokenized the command, found the first top-level pipe, and inserted `< /dev/null` BEFORE that pipe (so `cat file | grep foo` became `cat file < /dev/null | grep foo`). This handled cases where stdin should go to the first command in the pipeline, not the last.

In v2.1.112 the pipe-aware wrap is just `singleQuoteWrap + " < /dev/null"`. The `< /dev/null` ends up after the whole pipeline, which means it redirects the stdin of the **last** command in the pipe — but pipe semantics make this irrelevant: the last command receives its stdin from the pipe, not from the redirect. The redirect is effectively a no-op for typical pipelines.

The simplification trades a clever-but-fragile tokenization path for a uniform behavior. The cases that v2.1.76's clever path optimized (a command at the start of the pipe that would block on stdin without the pre-pipe redirect) are rare, and the cost of one extra `cat file | ...` hanging is bounded by the per-command timeout. Removing the tokenization removed an entire class of shell-parsing edge cases.

---

## 7. Session Environment Hook Scripts

```javascript
// ============================================
// getSessionEnvironment - Concatenates CLAUDE_ENV_FILE + session-env hook scripts
// Location: chunks.98.mjs:2616-2645
// ============================================

// ORIGINAL (for source lookup):
async function PC4() {
    if (l56 !== void 0) return l56;
    let q = [],
        K = process.env.CLAUDE_ENV_FILE;
    if (K) try {
        let z = (await jC4(K, "utf8")).trim();
        if (z) q.push(z), E(`Session environment loaded from CLAUDE_ENV_FILE: ${K} (${z.length} chars)`)
    } catch (z) { /* ENOENT ok */ }
    let _ = await Ki1();
    try {
        let Y = (await JC4(_)).filter((A) => ZI8.test(A)).sort(NMz);
        for (let A of Y) {
            let O = fI8(_, A);
            try {
                let w = (await jC4(O, "utf8")).trim();
                if (w) q.push(w)
            } catch (w) { /* ENOENT ok */ }
        }
    } catch (z) { /* ENOENT ok */ }
    if (q.length === 0) return l56 = null, l56;
    return l56 = q.join(`\n`), l56
}

// READABLE (for understanding):
async function getSessionEnvironment() {
  if (cachedSessionEnv !== undefined) return cachedSessionEnv;
  const scripts = [];

  // Source 1: explicit CLAUDE_ENV_FILE pointer
  const envFile = process.env.CLAUDE_ENV_FILE;
  if (envFile) {
    try {
      const content = (await readFile(envFile, "utf8")).trim();
      if (content) scripts.push(content);
    } catch (err) { /* ENOENT is fine */ }
  }

  // Source 2: hook files in ~/.claude/session-env/<session-id>/
  const sessionEnvDir = await getSessionEnvDir();
  try {
    const matchingFiles = (await readdir(sessionEnvDir))
      .filter((name) => HOOK_FILENAME_REGEX.test(name))
      .sort(compareHookFiles);   // setup-hook-* before sessionstart-hook-*, then by ID
    for (const file of matchingFiles) {
      const fullPath = pathJoin(sessionEnvDir, file);
      try {
        const content = (await readFile(fullPath, "utf8")).trim();
        if (content) scripts.push(content);
      } catch (err) { /* ENOENT ok */ }
    }
  } catch (err) { /* ENOENT ok */ }

  if (scripts.length === 0) return (cachedSessionEnv = null);
  return (cachedSessionEnv = scripts.join("\n"));
}

// Mapping: PC4->getSessionEnvironment, l56->cachedSessionEnv,
//   K->envFile, jC4->readFile, _->sessionEnvDir, Ki1->getSessionEnvDir,
//   JC4->readdir, ZI8->HOOK_FILENAME_REGEX, NMz->compareHookFiles,
//   A->file, O->fullPath, fI8->pathJoin
```

**The session-env hook system:**

1. **`CLAUDE_ENV_FILE`** — environment variable pointing to a shell script. Useful for CI/CD systems that set `CLAUDE_ENV_FILE=/etc/claude.env` so all sessions inherit a common setup.

2. **Hook files** in `~/.claude/session-env/<session-id>/`:
   - `setup-hook-<N>.sh` — runs first (priority 0 in `HC4`)
   - `sessionstart-hook-<N>.sh` — runs second (priority 1 in `HC4`)
   - Within each type, ordered numerically by N

**Why the trailing `\n:`** (`Z\n:`):

The hook scripts can end with `set -e` or some other state that would cause `&&` to short-circuit. Appending `\n:` (newline + the bash no-op `:`) forces a clean exit-zero state regardless of what the hook scripts did, so the rest of the chain runs.

**Caching:** the result is cached in `l56`. Invalidated by `xh6()` (`invalidateSessionEnvCache`), which is called when CWD changes (different project might have different hooks).

---

## 8. Extglob Disable

```javascript
// ============================================
// disableExtglobCommand - Shell-specific extglob shopt
// Location: chunks.144.mjs:2140-2145
// ============================================

// ORIGINAL (for source lookup):
function wzY(q) {
    if (process.env.CLAUDE_CODE_SHELL_PREFIX) return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true";
    if (q.includes("bash")) return "shopt -u extglob 2>/dev/null || true";
    else if (q.includes("zsh")) return "setopt NO_EXTENDED_GLOB 2>/dev/null || true";
    return null
}

// READABLE (for understanding):
function disableExtglobCommand(shellPath) {
  if (process.env.CLAUDE_CODE_SHELL_PREFIX) {
    // Prefix may run a different shell — emit cross-compatible version
    return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true";
  }
  if (shellPath.includes("bash")) return "shopt -u extglob 2>/dev/null || true";
  if (shellPath.includes("zsh")) return "setopt NO_EXTENDED_GLOB 2>/dev/null || true";
  return null;
}

// Mapping: wzY->disableExtglobCommand, q->shellPath
```

**Why disable extglob:**

Extglob (extended globbing) changes the meaning of `?(...)`, `*(...)`, `+(...)`, `@(...)`, `!(...)` patterns. If the user's `.bashrc` enabled extglob (often happens with bash-completion), commands containing parentheses are misinterpreted:

| Pattern | Standard glob | extglob |
|---------|---------------|---------|
| `?(foo)` | Match `?(foo)` literally | Zero or one `foo` |
| `!(foo)` | Match `!(foo)` literally | Anything except `foo` |
| `find . -name "test(*)"` | Find files literally named `test(...)` | extglob pattern — different behavior |

Since the model doesn't know whether the user has extglob enabled, the safe default is to disable it for all Bash tool commands. The user's interactive shell keeps extglob; only the command-tool spawned shell turns it off.

---

## 9. CWD Capture and Read-Back

```bash
pwd -P >| '/tmp/claude-7e3a-cwd'
```

- `pwd -P` resolves all symlinks (P for "physical"), giving an absolute non-symlink path.
- `>|` (clobber redirect) forces write even if the user has `set -o noclobber` enabled.
- Path includes a random 4-char hex ID per Bash tool invocation, avoiding collision when commands run concurrently.

**After the spawned process exits**, the executor reads this file (in `exec`, chunks.144.mjs:2483-2495):

```javascript
let l = WzY(c, { encoding: "utf8" }).trim();    // readFileSync
if (y1() === "windows") l = LA6(l);              // posixToWindows
if (l.normalize("NFC") !== f) {                  // f = original CWD
    if (l$(l, f), !Sf6()) xh6(), lb4(f, l)
}
```

Translated:

```javascript
let newCwd = readFileSync(nativeCwdFilePath, { encoding: "utf8" }).trim();
if (getPlatform() === "windows") newCwd = posixPathToWindowsPath(newCwd);
if (newCwd.normalize("NFC") !== originalCwd) {
  setCwd(newCwd, originalCwd);
  if (!isCwdChangeSuppressed()) {
    invalidateSessionEnvCache();
    onCwdChangedForHooks(originalCwd, newCwd);
  }
}
```

**Why the NFC normalize:**

The current CWD (`f`) is NFC-normalized when stored (via `setCwdState`). On macOS APFS, `pwd -P` can output NFD (decomposed Unicode). Without normalization, `cd foo<combining-acute>` followed by `pwd -P` would compare unequal even though they refer to the same path. The `.normalize("NFC")` ensures we only register a change if the underlying directory actually changed, not just the Unicode form.

**Why `setCwdState` not `process.chdir`:**

Claude Code maintains its own CWD state separate from the Node process's CWD. The Node CWD stays at the project root; only the next Bash tool call uses the updated path. This isolation prevents `cd /tmp` in one command from affecting unrelated operations like reading project files via the FileRead tool.

---

## 10. Shell Prefix Wrapping

```javascript
// ============================================
// applyShellPrefix - Wraps the chain with CLAUDE_CODE_SHELL_PREFIX
// Location: chunks.144.mjs:2088-2095
// ============================================

// ORIGINAL (for source lookup):
function dU8(q, K) {
    let _ = q.lastIndexOf(" -");
    if (_ > 0) {
        let z = q.substring(0, _),
            Y = q.substring(_ + 1);
        return `${A5([z])} ${Y} ${A5([K])}`
    } else return `${A5([q])} ${A5([K])}`
}

// READABLE (for understanding):
function applyShellPrefix(prefix, commandString) {
  // Split prefix at the last " -" boundary to separate binary from flags
  const flagBoundary = prefix.lastIndexOf(" -");
  if (flagBoundary > 0) {
    const binary = prefix.substring(0, flagBoundary);   // e.g., "firejail"
    const flags = prefix.substring(flagBoundary + 1);   // e.g., "--noprofile"
    return `${shellQuote([binary])} ${flags} ${shellQuote([commandString])}`;
  }
  return `${shellQuote([prefix])} ${shellQuote([commandString])}`;
}

// Mapping: dU8->applyShellPrefix, q->prefix, K->commandString, A5->shellQuote
```

**Example transformations:**

| `CLAUDE_CODE_SHELL_PREFIX` | Result |
|----------------------------|--------|
| `firejail` | `'firejail' '<chain>'` |
| `firejail --noprofile` | `'firejail' --noprofile '<chain>'` |
| `nsjail -Mo --chroot /` | `'nsjail' -Mo --chroot / '<chain>'` |
| `docker exec my-container bash -c` | `'docker exec my-container bash' -c '<chain>'` (last `-c` becomes a flag) |

**Why the binary/flags split:**

If we always shell-quoted the entire prefix, `firejail --noprofile` would become `'firejail --noprofile'` and fail because there is no command named "firejail --noprofile" with a literal space. Splitting at the last ` -` lets the binary be quoted (handles paths with spaces) while flags pass through unquoted (so shell can interpret them).

**Why "last" `-`:** users might write `/path with spaces/firejail --noprofile`, where the path itself contains spaces but no `-`. We want the `-` separation to apply only to actual flag boundaries.

---

## 11. The Spawn

After `buildExecCommand` returns, `exec` calls `spawn` with the assembled string:

```javascript
// Top-level exec (chunks.144.mjs:2369-2509) - the spawn call
const childProcess = spawn(R, h, {           // R = shellPath, h = ["-c", commandString]
  env: {
    ...Dk(),                                  // scrubbed parent env
    SHELL: shellType === "bash" ? binShell : undefined,
    GIT_EDITOR: "true",
    CLAUDECODE: "1",
    ...providerOverrides,                     // TMUX, TMPDIR, CLAUDE_CODE_EXECPATH
    ...(otelTraceParent && { TRACEPARENT: otelTraceParent }),
  },
  cwd: trackedCwd,
  stdio: usePipeMode ? ["pipe", "pipe", "pipe"] : ["pipe", outputFd, outputFd],
  detached: provider.detached,                 // true for bash
  windowsHide: true,
});
```

**`provider.detached: true`:**

For bash, the spawned process is given its own process group. This allows tree-kill to send SIGKILL to the entire group when the user aborts, ensuring background subprocesses (e.g., `node app.js & echo started`) also die.

**`stdio` modes:**

- **Pipe mode** (when `onStdout` callback provided): all three streams are piped, allowing real-time streaming.
- **File mode** (default): stdin is piped, but stdout and stderr both go to the same file descriptor. On POSIX, `O_APPEND` makes writes atomic; on Windows, the implementation uses string mode `'w'` because libuv treats numeric flags differently and silently discards output (the v2.1.88 source has a detailed comment about this).

**`O_NOFOLLOW`** is added to the open flags on POSIX so a malicious symlink at the output-file path cannot redirect writes to an attacker-chosen file.

---

## 12. Sandbox Wrapping (Optional)

When `shouldUseSandbox` is true, the entire `commandString` is wrapped by the sandbox adapter **before** spawn:

```javascript
if (w) {
    // w = shouldUseSandbox
    // ... build scrub config F ...
    G = await Z7.wrapWithSandbox(G, k, F, K)   // G = commandString, k = sandboxBinShell
}
```

The sandbox transforms `commandString` into something like (Linux bwrap example):

```
bwrap --ro-bind / / --tmpfs /tmp --bind /home/alice/project /home/alice/project \
      --setenv ... --proc /proc --dev /dev /bin/bash -c '<original commandString>'
```

The CWD file path is moved from `/tmp/claude-{id}-cwd` to `{sandboxTmpDir}/cwd-{id}` so the sandbox allows the `pwd -P >|` write.

This wrapping is the **outer-most** transformation — it wraps the entire chain produced by `buildExecCommand` and the optional `CLAUDE_CODE_SHELL_PREFIX`. Order: prefix → sandbox → spawn.

---

## 13. Layer-by-Layer View

```
                          User-typed command
                                  |
                                  v
                  +-----------------------------------+
                  | NUL substitution (lPK)            |
                  +-----------------------------------+
                                  |
                                  v
                  +-----------------------------------+
                  | Pipe-safety detection (cPK)       |
                  +-----------------------------------+
                                  |
                                  v
                  +-----------------------------------+
                  | Eval wrap                         |
                  |   - has pipe & safe: gPK          |
                  |   - else: dPK                     |
                  +-----------------------------------+
                                  |
                                  v
                  +-----------------------------------+
                  | Build && chain                    |
                  |   - source <snapshot> 2>/dev/null |
                  |   - <session-env-hooks>\n:        |
                  |   - export BUN_OPTIONS (if remote)|
                  |   - shopt -u extglob              |
                  |   - eval <wrapped>                |
                  |   - pwd -P >| <cwdFile>           |
                  +-----------------------------------+
                                  |
                                  v
                  +-----------------------------------+
                  | Shell prefix wrap (dU8)           |
                  |   if CLAUDE_CODE_SHELL_PREFIX set |
                  +-----------------------------------+
                                  |
                                  v
                  +-----------------------------------+
                  | Sandbox wrap (Z7.wrapWithSandbox) |
                  |   if shouldUseSandbox             |
                  +-----------------------------------+
                                  |
                                  v
                  +-----------------------------------+
                  | spawn(shell, ["-c", chain], env)  |
                  +-----------------------------------+
```

Each layer is independent — sandbox doesn't know about the snapshot, the eval wrap doesn't know about session-env hooks. This stratification is what makes the codebase tractable: a bug in extglob handling can be fixed without touching the spawn path, and vice versa.

---

## Summary

The command-assembly pipeline is a deliberate layering of:

1. **Compatibility patches** (NUL → /dev/null) so models trained on mixed examples work.
2. **Safety transforms** (eval wrap + stdin redirect) so commands don't hang on stdin or break shell parsing.
3. **State restoration** (source snapshot, session-env hooks) so commands run with the user's expected environment.
4. **State capture** (`pwd -P >|`) so `cd foo && cmd` correctly updates Claude's tracked CWD.
5. **Sandbox wrapping** (optional) so untrusted commands are confined.

Each layer has its own escape hatches: pipe-safe detection falls back gracefully on parse failure, snapshot sourcing has `|| true`, extglob disable has `|| true`. The pipeline favors **correctness with graceful degradation** over **strict guarantees**, because shell commands are too varied to handle all edge cases perfectly, and a slightly slow command is better than an aborted command.
