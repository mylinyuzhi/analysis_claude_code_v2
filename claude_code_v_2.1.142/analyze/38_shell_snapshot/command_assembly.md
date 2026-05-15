# Command Assembly Pipeline (Claude Code 2.1.142)

> The pipeline that transforms a user-typed command into the final string passed to `bash -c`: NUL substitution, pipe-safety detection, eval wrapping, snapshot sourcing, session-env hooks, extglob disable, CWD capture, and the optional `CLAUDE_CODE_SHELL_PREFIX` outer wrapper.

Source: `cli_inner_pretty.js` (lines 360460-360952 — snapshot + provider + executor).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Unit 04 mappings

Key functions in this document:
- `buildExecCommand` (inside `$U7`) - Top-level command assembler - cli_inner_pretty.js:360885
- `substituteNulRedirect` (`sp7`) - Windows `NUL` -> `/dev/null` - cli_inner_pretty.js:360853
- `isPipeSafe` (`ap7`) - Pipe-redirect safety check - cli_inner_pretty.js:360848
- `evalWrap` (`op7`) - Standard eval wrap with optional `< /dev/null` - cli_inner_pretty.js:360836
- `evalWrapPipeSafe` (`lp7`) - Simple single-quote wrap + `< /dev/null` (used when pipe present and pipe-safe) - cli_inner_pretty.js:360470
- `singleQuoteWrap` (`qi_`) - Standard shell single-quote escape - cli_inner_pretty.js:360473
- `disableExtglobCommand` (`ji_`) - Shell-specific extglob disable - cli_inner_pretty.js:360860
- `applyShellPrefix` (`nY8`) - Wraps the chain with `CLAUDE_CODE_SHELL_PREFIX` - cli_inner_pretty.js:360818
- `getSessionEnvironment` (`ZK7`) - Returns concatenated hook scripts - cli_inner_pretty.js:236437
- `hasHeredoc` (`bv6`) - Detects heredoc syntax - cli_inner_pretty.js:360827
- `hasMultilineQuoted` (`Mi_`) - Detects multi-line quoted strings - cli_inner_pretty.js:360831
- `hasExplicitStdinRedirect` (`wi_`) - Detects explicit stdin redirect - cli_inner_pretty.js:360845

---

## 1. Top-Level Assembler

The `buildExecCommand` method of the bash provider is the single function responsible for turning a raw user command into the string passed to `bash -c`. It returns `{ commandString, cwdFilePath }`.

```javascript
// ============================================
// buildExecCommand - Bash provider's command-assembly entry point
// Location: cli_inner_pretty.js:360885-360920
// ============================================

// ORIGINAL (for source lookup):
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
    let O = dl(),
      w = c$() === "windows" ? MP(O) : O,
      D = Y.useSandbox ? kX$.join(Y.sandboxTmpDir, `cwd-${Y.id}`) : kX$.join(w, `claude-${Y.id}-cwd`),
      j = Y.useSandbox ? kX$.join(Y.sandboxTmpDir, `cwd-${Y.id}`) : HU7.join(O, `claude-${Y.id}-cwd`),
      J = sp7(z),
      X = ap7(J),
      L = op7(J, X);
    if (J.includes("|") && X) L = lp7(J);
    let P = [];
    if (f) {
      let V = c$() === "windows" ? MP(f) : f;
      P.push(`source ${W4([V])} 2>/dev/null || true`);
    }
    let Z = await ZK7();
    if (Z) P.push(`${Z}\n:`);
    if (bH(process.env.CLAUDE_CODE_REMOTE)) P.push('export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"');
    let W = ji_(H);
    if (W) P.push(W);
    (P.push(`eval ${L}`), P.push(`pwd -P >| ${W4([D])}`));
    let G = P.join(" && ");
    if (process.env.CLAUDE_CODE_SHELL_PREFIX) G = nY8(process.env.CLAUDE_CODE_SHELL_PREFIX, G);
    return { commandString: G, cwdFilePath: j };
}

// READABLE (for understanding):
async buildExecCommand(userCommand, ctx) {
  // Step 1: resolve the snapshot promise; if file vanished, fall back to login shell
  let snapshotPath = await snapshotPromise;
  if (snapshotPath) {
    try {
      await fs.access(snapshotPath);
    } catch {
      debugLog(`Snapshot file missing, falling back to login shell: ${snapshotPath}`);
      if (!missingTelemetryFired) {
        missingTelemetryFired = true;
        recordSpanFailure("shell_snapshot_create", "snapshot_missing_at_exec");
      }
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

// Mapping: z→userCommand, Y→ctx, K→snapshotPromise, f→snapshotPath,
//   ep7→fs/promises, _→resolvedSnapshotPath, q→sandboxTmpDir,
//   O→tmpdir, w→tmpdirWritable, D→cwdWritePath, j→cwdReadPath,
//   J→nulSubstituted, X→pipeSafe, L→wrappedCommand,
//   sp7→substituteNulRedirect, ap7→isPipeSafe, op7→evalWrap, lp7→evalWrapPipeSafe,
//   P→chain, V→sourcePath, Z→sessionEnv, ZK7→getSessionEnvironment,
//   W→extglobOff, ji_→disableExtglobCommand, G→commandString,
//   nY8→applyShellPrefix, W4→shellQuote, MP→posixPathToWindowsPath,
//   c$→getPlatform, dl→osTmpdir, HU7→path, kX$→path/posix
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
// Location: cli_inner_pretty.js:360853-360855
// ============================================

// ORIGINAL (for source lookup):
function sp7(H) {
  return H.replace(Di_, "$1/dev/null");
}
var Di_;
var tp7 = T(() => {
  Di_ = /(\d?&?>+\s*)[Nn][Uu][Ll](?=\s|$|[|&;)\n])/g;
});

// READABLE (for understanding):
function substituteNulRedirect(command) {
  return command.replace(NUL_REDIRECT_REGEX, "$1/dev/null");
}
const NUL_REDIRECT_REGEX = /(\d?&?>+\s*)[Nn][Uu][Ll](?=\s|$|[|&;)\n])/g;

// Mapping: sp7→substituteNulRedirect, Di_→NUL_REDIRECT_REGEX
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
// Location: cli_inner_pretty.js:360827-360852
// ============================================

// ORIGINAL (for source lookup):
function bv6(H) {
  if (/\d\s*<<\s*\d/.test(H) || /\[\[\s*\d+\s*<<\s*\d+\s*\]\]/.test(H) || /\$\(\(.*<<.*\)\)/.test(H)) return !1;
  return /<<-?\s*(?:(['"]?)(\w+)\1|\\(\w+))/.test(H);
}
function wi_(H) { return /(?:^|[\s;&|])<(?![<(])\s*\S+/.test(H) }
function ap7(H) {
  if (bv6(H)) return !1;
  if (wi_(H)) return !1;
  return !0;
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

// Mapping: bv6→hasHeredoc, wi_→hasExplicitStdinRedirect, ap7→isPipeSafe
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
// Location: cli_inner_pretty.js:360836-360844
// ============================================

// ORIGINAL (for source lookup):
function op7(H, $ = !0) {
  if (bv6(H) || Mi_(H)) {
    let _ = `'${H.replaceAll("'", `'"'"'`)}'`;
    if (bv6(H)) return _;
    return $ ? `${_} < /dev/null` : _;
  }
  let q = W4([H]);
  return $ ? `${q} < /dev/null` : q;
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

// Mapping: op7→evalWrap, H→command, $→pipeSafe,
//   Mi_→hasMultilineQuoted, W4→shellQuote
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

## 6. Pipe-Aware Eval Wrap

```javascript
// ============================================
// evalWrapPipeSafe / singleQuoteWrap - Pipe-aware wrap path
// Location: cli_inner_pretty.js:360470-360475
// ============================================

// ORIGINAL (for source lookup):
function lp7(H) {
  return qi_(H) + " < /dev/null";
}
function qi_(H) {
  return "'" + H.replaceAll("'", `'"'"'`) + "'";
}

// READABLE (for understanding):
function evalWrapPipeSafe(command) {
  return singleQuoteWrap(command) + " < /dev/null";
}
function singleQuoteWrap(command) {
  // Standard shell single-quote escape: '...' "'"... '...'
  return "'" + command.replaceAll("'", `'"'"'`) + "'";
}

// Mapping: lp7→evalWrapPipeSafe, qi_→singleQuoteWrap
```

**What this does:**

When a command contains a pipe and is pipe-safe (`ap7` returned true), the chain switches from `evalWrap` to `evalWrapPipeSafe`:

1. **`singleQuoteWrap`** — wraps the whole command in literal single quotes, escaping any internal single quotes with the `'"'"'` trick. The result is one shell-quoted token suitable for `eval`.
2. **Append `< /dev/null`** — gives `eval`'s combined command an empty stdin.

**Difference from `evalWrap`:**

| Function | Wrapping | When |
|----------|----------|------|
| `evalWrap` (`op7`) | Either `shellQuote([cmd])` for simple commands, or `'...'` single-quote for heredocs/multiline | Always |
| `evalWrapPipeSafe` (`lp7`) | Always `'...'` single-quote | Only when command contains `\|` AND is pipe-safe |

The semantic difference: `shellQuote([cmd])` is conservative — it adds quoting only where needed. `singleQuoteWrap` is unconditional — it always wraps in `'...'`. For a command like `ls -la | grep foo`, the former gives `'ls -la | grep foo'` (just enough), the latter gives `'ls -la | grep foo'` (same).

---

## 7. Session Environment Hook Scripts

```javascript
// ============================================
// getSessionEnvironment - Concatenates CLAUDE_ENV_FILE + session-env hook scripts
// Location: cli_inner_pretty.js:236437-236473
// ============================================

// ORIGINAL (for source lookup):
async function ZK7() {
  let H = v$();
  if (rOH !== void 0 && G68 === H) return rOH;
  let $ = [], q = process.env.CLAUDE_ENV_FILE;
  if (q) try {
    let _ = (await $e.readFile(q, "utf8")).trim();
    if (_) ($.push(_), N(`Session environment loaded from CLAUDE_ENV_FILE: ${q} (${_.length} chars)`));
  } catch (_) { if (O8(_) !== "ENOENT") N(`Failed to read CLAUDE_ENV_FILE: ${ZH(_)}`); }
  let K = await rw6();
  try {
    let A = (await $e.readdir(K)).filter((z) => T68.test(z)).sort(eA_);
    for (let z of A) {
      let Y = NO$.join(K, z);
      try {
        let f = (await $e.readFile(Y, "utf8")).trim();
        if (f) $.push(f);
      } catch (f) { if (O8(f) !== "ENOENT") N(`Failed to read hook file ${Y}: ${ZH(f)}`); }
    }
  } catch (_) { if (O8(_) !== "ENOENT") N(`Failed to load session environment from hooks: ${ZH(_)}`); }
  if ($.length === 0) return ((rOH = null), (G68 = H), rOH);
  return ((rOH = $.join("\n")), (G68 = H), rOH);
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

// Mapping: ZK7→getSessionEnvironment
```

**The session-env hook system:**

1. **`CLAUDE_ENV_FILE`** — environment variable pointing to a shell script. Useful for CI/CD systems that set `CLAUDE_ENV_FILE=/etc/claude.env` so all sessions inherit a common setup.

2. **Hook files** in `~/.claude/session-env/<session-id>/`:
   - `setup-hook-<N>.sh` — runs first (priority 0)
   - `sessionstart-hook-<N>.sh` — runs second (priority 1)
   - Within each type, ordered numerically by N

**Why the trailing `\n:`** (`Z\n:`):

The hook scripts can end with `set -e` or some other state that would cause `&&` to short-circuit. Appending `\n:` (newline + the bash no-op `:`) forces a clean exit-zero state regardless of what the hook scripts did, so the rest of the chain runs.

**Caching:** the result is cached. Invalidated when CWD changes (different project might have different hooks).

---

## 8. Extglob Disable

```javascript
// ============================================
// disableExtglobCommand - Shell-specific extglob shopt
// Location: cli_inner_pretty.js:360860-360866
// ============================================

// ORIGINAL (for source lookup):
function ji_(H) {
  if (process.env.CLAUDE_CODE_SHELL_PREFIX)
    return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true";
  if (H.includes("bash")) return "shopt -u extglob 2>/dev/null || true";
  else if (H.includes("zsh")) return "setopt NO_EXTENDED_GLOB 2>/dev/null || true";
  return null;
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

// Mapping: ji_→disableExtglobCommand, H→shellPath
```

**Why disable extglob:**

Extglob (extended globbing) changes the meaning of `?(...)`, `*(...)`, `+(...)`, `@(...)`, `!(...)` patterns. If the user's `.bashrc` enabled extglob (often happens with bash-completion), commands containing parentheses are misinterpreted.

Since the model doesn't know whether the user has extglob enabled, the safe default is to disable it for all Bash tool commands. The user's interactive shell keeps extglob; only the command-tool spawned shell turns it off.

---

## 9. CWD Capture and Read-Back

```bash
pwd -P >| '/tmp/claude-7e3a-cwd'
```

- `pwd -P` resolves all symlinks (P for "physical"), giving an absolute non-symlink path.
- `>|` (clobber redirect) forces write even if the user has `set -o noclobber` enabled.
- Path includes a random 4-char hex ID per Bash tool invocation, avoiding collision when commands run concurrently.

**After the spawned process exits**, the executor reads this file (in `tY8`, cli_inner_pretty.js:361253-361264):

```javascript
try {
  let l = YB.readFileSync(Q, { encoding: "utf8" }).trim();
  if (c$() === "windows") l = sLH(l);
  if (l.normalize("NFC") !== W) {
    if ((KD(l, W), !xRH())) ($QH(), r77(W, l));
  }
} catch {
  d("tengu_shell_set_cwd", { success: !1 });
}
```

Translated:

```javascript
let newCwd = readFileSync(cwdFilePath, { encoding: "utf8" }).trim();
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

The current CWD is NFC-normalized when stored. On macOS APFS, `pwd -P` can output NFD (decomposed Unicode). Without normalization, `cd foo<combining-acute>` followed by `pwd -P` would compare unequal even though they refer to the same path. The `.normalize("NFC")` ensures we only register a change if the underlying directory actually changed, not just the Unicode form.

**Why `setCwd` not `process.chdir`:**

Claude Code maintains its own CWD state separate from the Node process's CWD. The Node CWD stays at the project root; only the next Bash tool call uses the updated path. This isolation prevents `cd /tmp` in one command from affecting unrelated operations like reading project files via the FileRead tool.

---

## 10. Shell Prefix Wrapping

```javascript
// ============================================
// applyShellPrefix - Wraps the chain with CLAUDE_CODE_SHELL_PREFIX
// Location: cli_inner_pretty.js:360818-360825
// ============================================

// ORIGINAL (for source lookup):
function nY8(H, $) {
  let q = H.lastIndexOf(" -");
  if (q > 0) {
    let K = H.substring(0, q),
      _ = H.substring(q + 1);
    return `${W4([K])} ${_} ${W4([$])}`;
  } else return `${W4([H])} ${W4([$])}`;
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

// Mapping: nY8→applyShellPrefix, H→prefix, $→commandString, W4→shellQuote
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

After `buildExecCommand` returns, `tY8` (`exec`) calls `spawn` with the assembled string. See [env_snapshot.md](./env_snapshot.md) Section 4 for the env construction.

```javascript
const childProcess = spawn(spawnBinary, shellArgs, {
  env: {
    ...subprocessEnv(),
    SHELL: shellType === "bash" ? binShell : undefined,
    GIT_EDITOR: "true",
    CLAUDECODE: "1",
    AI_AGENT: getAiAgentTag("agent"),               // v2.1.120
    CLAUDE_CODE_SESSION_ID: getCurrentSessionId(),  // v2.1.132
    ...providerOverrides,
    ...sessionEnvVars,
    ...(otelTraceParent && { TRACEPARENT: otelTraceParent }),
  },
  cwd: trackedCwd,
  stdio: buildStdioConfig(usePipeMode, outputFd, sandboxFd),
  detached: provider.detached,                      // true for bash
  windowsHide: true,
});
```

---

## 12. Sandbox Wrapping (Optional)

When `shouldUseSandbox` is true, the entire `commandString` is wrapped by the sandbox adapter **before** spawn. The wrapping is the **outer-most** transformation — it wraps the entire chain produced by `buildExecCommand` and the optional `CLAUDE_CODE_SHELL_PREFIX`. Order: prefix → sandbox → spawn.

---

## 13. Layer-by-Layer View

```
                          User-typed command
                                  |
                                  v
                  +-----------------------------------+
                  | NUL substitution (sp7)            |
                  +-----------------------------------+
                                  |
                                  v
                  +-----------------------------------+
                  | Pipe-safety detection (ap7)       |
                  +-----------------------------------+
                                  |
                                  v
                  +-----------------------------------+
                  | Eval wrap                         |
                  |   - has pipe & safe: lp7          |
                  |   - else: op7                     |
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
                  | Shell prefix wrap (nY8)           |
                  |   if CLAUDE_CODE_SHELL_PREFIX set |
                  +-----------------------------------+
                                  |
                                  v
                  +-----------------------------------+
                  | Sandbox wrap (n6.wrapWithSandbox) |
                  |   if shouldUseSandbox             |
                  +-----------------------------------+
                                  |
                                  v
                  +-----------------------------------+
                  | spawn(shell, ["-c", chain], env)  |
                  |  env has CLAUDE_CODE_SESSION_ID    |
                  |  (NEW v2.1.132)                    |
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
6. **Session identity** (`CLAUDE_CODE_SESSION_ID`, v2.1.132) so subprocess scripts can correlate with the session.

Each layer has its own escape hatches: pipe-safe detection falls back gracefully on parse failure, snapshot sourcing has `|| true`, extglob disable has `|| true`. The pipeline favors **correctness with graceful degradation** over **strict guarantees**, because shell commands are too varied to handle all edge cases perfectly, and a slightly slow command is better than an aborted command.
