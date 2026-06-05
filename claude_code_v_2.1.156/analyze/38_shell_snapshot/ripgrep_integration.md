# ripgrep Shell Integration: `createRipgrepShellIntegration` (v2.1.156)

> This doc covers `createRipgrepShellIntegration` (`lD_`, `cli_inner_pretty.js:340957-340963`) — the helper that decides how Claude Code's `rg` shell integration is emitted into the shell snapshot. It returns `{type:"function", snippet}` (an argv0-dispatch shell function) when `ripgrepCommand` (`hkH`, `cli_inner_pretty.js:206855`) reports an `argv0` (ripgrep embedded in the bun multicall binary), otherwise `{type:"alias", snippet}` built from `quote([rgPath])` plus `rgArgs` mapped through `quote` (`cli_inner_pretty.js:340960-340962`). The headline 2.1.156 facts: (1) the `rg` integration is **opt-in** — the snapshot wraps it in `if ! (unalias rg 2>/dev/null; command -v rg) …; then … fi` (`cli_inner_pretty.js:341062`), so a system `rg` wins if present — contrasted with `find`/`grep` which **always** shadow; (2) `ripgrepCommand` resolves three modes from the memoized config `UD$` (embedded argv0 / system rg on PATH / explicit opt-out); (3) the snippet lands in the snapshot via `getClaudeCodeSnapshotContent` (`aD_`) using a `RIPGREP_FUNC_END` heredoc for the function form (`cli_inner_pretty.js:341067-341069`) versus an escaped single-quote `echo` for the alias form (`cli_inner_pretty.js:341072-341074`). The control flow of `lD_` is **byte-for-byte the same** as the v2.1.88 clean source; what changed is the surrounding plumbing.

---

## 1. What `createRipgrepShellIntegration` does

**What it does:** Produces a `{ type, snippet }` descriptor that tells the snapshot-content generator `aD_` how to render the `rg` integration into the snapshot file:

- `type === "function"` → the snippet is a full multi-line cross-shell function body (from `createArgv0ShellFunction`, `xx6`). The generator wraps it in a `cat << 'RIPGREP_FUNC_END' … RIPGREP_FUNC_END` heredoc (`cli_inner_pretty.js:341067-341069`).
- `type === "alias"` → the snippet is a single shell-quoted target string. The generator emits one `alias rg='<snippet>'` line (`cli_inner_pretty.js:341072-341074`).

The whole decision hinges on one field: `ripgrepCommand().argv0`. It is set **only** when ripgrep is dispatched out of the bun-embedded multicall binary via `argv[0]` (`cli_inner_pretty.js:340958-340959`).

### The actual code

```javascript
// ============================================
// createRipgrepShellIntegration - Pick alias vs argv0-function for rg
// Location: cli_inner_pretty.js:340957-340963
// ============================================

// ORIGINAL (for source lookup):
function lD_() {
  let H = hkH();
  if (H.argv0) return { type: "function", snippet: xx6("rg", H.argv0) };
  let $ = O4([H.rgPath]),
    q = H.rgArgs.map((_) => O4([_]));
  return { type: "alias", snippet: H.rgArgs.length > 0 ? `${$} ${q.join(" ")}` : $ };
}

// READABLE (for understanding):
function createRipgrepShellIntegration() {
  const rgCommand = ripgrepCommand();                 // { rgPath, rgArgs, argv0? }
  // argv0 is set ONLY for the bun-embedded (multicall) ripgrep. That is the
  // exact and only signal that we need an argv[0]-dispatch shell function.
  if (rgCommand.argv0) {
    return {
      type: "function",
      snippet: createArgv0ShellFunction("rg", rgCommand.argv0), // no prependArgs, no denyPatterns
    };
  }
  // Standalone rg binary on PATH: a thin alias to the resolved path suffices.
  const quotedPath = shellQuote([rgCommand.rgPath]);
  const quotedArgs = rgCommand.rgArgs.map(arg => shellQuote([arg]));
  return {
    type: "alias",
    snippet: rgCommand.rgArgs.length > 0
      ? `${quotedPath} ${quotedArgs.join(" ")}`
      : quotedPath,
  };
}

// Mapping: lD_→createRipgrepShellIntegration, hkH→ripgrepCommand,
//          xx6→createArgv0ShellFunction, O4→shellQuote,
//          H→rgCommand, $→quotedPath, q→quotedArgs
```

**How it works (step by step):**
1. Call `ripgrepCommand` (`hkH`, `cli_inner_pretty.js:340958`) → `{ rgPath, rgArgs, argv0 }`.
2. If `argv0` is truthy, return the **function** form. The snippet is `createArgv0ShellFunction("rg", argv0)` (`cli_inner_pretty.js:340959`) — called with **only two arguments**, so the optional `prependArgs` and `denyPatterns` parameters of `xx6` default to `[]`. `rgArgs` (e.g. `["--no-config"]`) is deliberately **not** threaded into the shell function (see §5).
3. Otherwise build the **alias** form: shell-quote `rgPath` via `quote` (`O4`, `cli_inner_pretty.js:340960`), shell-quote each element of `rgArgs` via `quote` (`cli_inner_pretty.js:340961`), and join. If `rgArgs` is empty, the snippet is just the quoted path; otherwise it is `"<quotedPath> <quotedArg1> <quotedArg2> …"` (`cli_inner_pretty.js:340962`).

**Why this approach (rationale + alternatives):** A standalone `rg` binary on PATH already gets a correct `argv[0]` from `execve`, so a one-line alias is sufficient and is the simplest possible artifact (a user running `type rg` sees `rg: aliased to '/path/to/rg'`). The four-branch shell function only earns its complexity when `argv[0]` dispatch is genuinely required — i.e. when the same bun binary must be re-invoked under the name `rg` so its multicall dispatcher routes to embedded ripgrep. The alternative (always emit the function) would put 14+ lines of shell into the snapshot even in the common standalone case, for no gain. The single-flag (`argv0`) branch keeps the two cases cleanly separated.

**Key insight:** `argv0` is a *presence flag*, not data. Its mere presence in the resolved config dictates the entire branch. Everything else in `lD_` is just quoting mechanics around that one decision.

---

## 2. `ripgrepCommand` (`hkH`) and its three modes

`ripgrepCommand` is a thin accessor over the memoized config `UD$`:

```javascript
// ============================================
// ripgrepCommand - Public accessor returning the resolved ripgrep config
// Location: cli_inner_pretty.js:206855-206858
// ============================================

// ORIGINAL (for source lookup):
function hkH() {
  let H = UD$();
  return { rgPath: H.command, rgArgs: H.args, argv0: H.argv0 };
}

// READABLE (for understanding):
function ripgrepCommand() {
  const config = getRipgrepConfig();   // memoized; one of { system | embedded }
  return { rgPath: config.command, rgArgs: config.args, argv0: config.argv0 };
}

// Mapping: hkH→ripgrepCommand, UD$→getRipgrepConfig, H→config
```

The memoized resolver `getRipgrepConfig` (`UD$`, defined at `cli_inner_pretty.js:207062-207076`) runs three checks in priority order:

```javascript
// ============================================
// getRipgrepConfig - Resolve which ripgrep to use (opt-out / embedded / PATH)
// Location: cli_inner_pretty.js:207062-207076
// ============================================

// ORIGINAL (for source lookup):
(UD$ = v8(() => {
  if (k4(process.env.USE_BUILTIN_RIPGREP)) {
    let { cmd: q } = x98("rg", []);
    if (q !== "rg") return { mode: "system", command: q, args: [] };
  }
  if (UY()) {
    let q = { mode: "embedded", command: process.execPath, args: ["--no-config"], argv0: "rg" };
    if (JB(process.execPath)) return q;
    let { cmd: K } = x98("rg", []);
    if (K !== "rg") return { mode: "system", command: K, args: [] };
    return q;
  }
  let { cmd: $ } = x98("rg", []);
  return { mode: "system", command: $, args: [] };
})));

// READABLE (for understanding):
const getRipgrepConfig = memoize(() => {
  // Mode A — explicit opt-out: USE_BUILTIN_RIPGREP is falsy (0/false/no/off).
  //          Prefer a real system rg if one is on PATH.
  if (isEnvDefinedFalsy(process.env.USE_BUILTIN_RIPGREP)) {
    const { cmd: systemPath } = findExecutable("rg", []);
    if (systemPath !== "rg") return { mode: "system", command: systemPath, args: [] };
    // No system rg found → fall through to bundled detection.
  }
  // Mode B — embedded (default for native bun builds with embedded files):
  if (isInBundledMode()) {
    const embedded = { mode: "embedded", command: process.execPath, args: ["--no-config"], argv0: "rg" };
    if (which(process.execPath)) return embedded;     // our own binary is resolvable → use argv0 dispatch
    const { cmd: systemFallback } = findExecutable("rg", []);
    if (systemFallback !== "rg") return { mode: "system", command: systemFallback, args: [] };
    return embedded;                                  // last resort: trust execPath anyway
  }
  // Mode C — plain rg: not bundled → resolve plain rg from PATH (no argv0).
  const { cmd: plainPath } = findExecutable("rg", []);
  return { mode: "system", command: plainPath, args: [] };
});

// Mapping: UD$→getRipgrepConfig, v8→memoize, k4→isEnvDefinedFalsy,
//          x98→findExecutable, UY→isInBundledMode, JB→which,
//          q/K/$→intermediate cmd, embedded q→embedded config
```

**The three modes (high level), and which one yields `argv0`:**

| Mode | When (`cli_inner_pretty.js`) | Returns | `argv0`? | `lD_` branch |
|------|------------------------------|---------|----------|--------------|
| **embedded** (argv0 dispatch) | bundled native build (`isInBundledMode` true, `207067`) and our own `process.execPath` resolves (`207069`) | `{ command: process.execPath, args: ["--no-config"], argv0: "rg" }` | **yes** | `type:"function"` |
| **system — explicit opt-out path** | `USE_BUILTIN_RIPGREP` falsy AND a real `rg` on PATH (`207063-207065`) | `{ command: <resolved rg>, args: [] }` | no | `type:"alias"` |
| **system — plain rg** | not bundled (`207074-207075`), OR bundled-but-execPath-unresolvable with system rg present (`207070-207071`) | `{ command: <resolved rg or "rg">, args: [] }` | no | `type:"alias"` |

**How `isInBundledMode` decides (`UY`, `cli_inner_pretty.js:132249-132251`):** it returns `Array.isArray(Bun.embeddedFiles) && Bun.embeddedFiles.length > 0` — i.e. the process is a bun-compiled standalone with embedded files. This is the precondition for the multicall/`argv[0]` trick, since the embedded `rg` lives *inside* the same executable.

**Why `which(process.execPath)` is checked before returning embedded (`cli_inner_pretty.js:207069`):** a defensive existence test. In rare cases (dev-mode quirks, a moved/renamed binary) `process.execPath` may not be resolvable on disk; rather than emit a function that dispatches to a nonexistent binary, the resolver downgrades to a system `rg` if one exists (`207070-207071`), and only as a final fallback returns the embedded config anyway (`207072`).

**Cache invalidation (`y47`, `cli_inner_pretty.js:207032-207034`):** when ripgrep hits an `ENOENT` mid-session (binary deleted/moved), `UD$.cache?.clear?.()` drops the memoized config so the next `ripgrepCommand()` re-resolves from scratch. This matters for the snapshot only indirectly — a snapshot is generated once per session — but it keeps the live `rgPath` honest for direct Node-side ripgrep spawns.

**NEW/CHANGED vs prior versions:** In the v2.1.142 reference doc, Mode C (the non-bundled branch) returned a **vendored `builtin`** config pointing at `<package>/vendor/ripgrep/<arch>/rg`. In **2.1.156 the vendored `builtin` mode is gone**: the non-bundled branch instead resolves a plain system `rg` from PATH (`cli_inner_pretty.js:207074-207075`, `mode:"system"`). For the snapshot artifact this is a no-op — both vendored-builtin and plain-system produce an **alias** form (no `argv0`) — but it is a real change in the resolver and worth flagging. The v2.1.88 clean source (`ShellSnapshot.ts`) does not contain `ripgrepCommand` at all (it is imported from `../ripgrep.js`), so the resolver internals cannot be cross-checked there; the *consumer contract* (`{ rgPath, rgArgs, argv0 }`) is identical.

---

## 3. Why `rg` is opt-in (system rg wins) — and `find`/`grep` are not

This is the most important behavioral fact, and it is enforced **not** inside `lD_` but in the snapshot text emitted by `aD_`.

```javascript
// ============================================
// rg opt-in gate vs find/grep unconditional shadow - emitted snapshot text
// Location: cli_inner_pretty.js:341058-341088
// ============================================

// ORIGINAL (for source lookup):
  if (
    ((_ += `
      # Check for rg availability
      echo "# Check for rg availability" >> "$SNAPSHOT_FILE"
      echo "if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
  `),
    K.type === "function")
  )
    _ += `
      cat >> "$SNAPSHOT_FILE" << 'RIPGREP_FUNC_END'
  ${K.snippet}
RIPGREP_FUNC_END
    `;
  else {
    let f = K.snippet.replaceAll("'", "'\\''");
    _ += `
      echo '  alias rg='"'${f}'" >> "$SNAPSHOT_FILE"
    `;
  }
  _ += `
      echo "fi" >> "$SNAPSHOT_FILE"
  `;
  let z = iD_();
  if (z !== null)
    _ += `
      # Shadow find/grep with embedded bfs/ugrep (ant-native only)
      echo "# Shadow find/grep with embedded bfs/ugrep" >> "$SNAPSHOT_FILE"
      cat >> "$SNAPSHOT_FILE" << 'FIND_GREP_FUNC_END'
${z}
FIND_GREP_FUNC_END
    `;

// READABLE (for understanding):
// rg path: the function/alias is written INSIDE a conditional guard.
//   if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
//       <rg function | rg alias>
//   fi
// => If a real rg already resolves on PATH, the whole block is skipped:
//    Claude Code's rg integration is OPT-IN and never overrides a system rg.
//
// find/grep path: createFindGrepShellIntegration() output is written
//   UNCONDITIONALLY (no surrounding `if`), so the bfs/ugrep functions ALWAYS
//   shadow the system find/grep when embedded tools are present.

// Mapping: K→rgIntegration descriptor, K.snippet→shell snippet,
//          z→findGrepIntegration (iD_), _→accumulated snapshot content
```

**How it works:** The `rg` snippet (whether function or alias) is sandwiched between an emitted `if ! (unalias rg 2>/dev/null; command -v rg) …; then` line (`cli_inner_pretty.js:341062`) and a closing `echo "fi"` (`cli_inner_pretty.js:341078`). When the snapshot is later sourced, the guard runs:
- `(unalias rg 2>/dev/null; command -v rg)` — a **subshell**. Inside it, any user `rg` alias (e.g. `alias rg='rg --smart-case'` that the snapshot itself replayed earlier) is stripped via `unalias`, then `command -v rg` tests for a *real binary*. The subshell parentheses mean the `unalias` does not leak into the parent shell.
- `if ! … ; then` — the body (the Claude rg function/alias) is defined **only if no real `rg` exists**.

In contrast, the `find`/`grep` integration (`iD_`, `cli_inner_pretty.js:340964-340977`) is appended with **no surrounding `if`** (`cli_inner_pretty.js:341081-341088`) — its `unalias find/grep` + `bfs`/`ugrep` functions are written unconditionally and therefore always shadow the system tools.

**Why this asymmetry (design rationale):**
- **`rg` is opt-installed.** ripgrep is not present on most systems by default; a user who has a system `rg` deliberately installed it and may depend on a specific version, custom flags, or their `~/.ripgreprc`. Overriding it would be surprising and could break the user's own shell habits. So Claude only fills the gap when `rg` is absent.
- **`find`/`grep` are universal.** Every Unix ships them; users rarely depend on a specific GNU vs BSD quirk in the Bash tool's context. Replacing them with the embedded `bfs`/`ugrep` (tuned in `iD_` to match GlobTool/GrepTool semantics) is a transparent upgrade Claude *wants* applied consistently. Hence the unconditional shadow.

**Alternatives considered (inferable):** Claude could have made `rg` always-shadow too (uniform behavior, simpler code — drop the `if`/`fi`). It chose not to, trading a few extra emitted lines for respecting the user's intentionally-installed ripgrep. Conversely it could have made `find`/`grep` opt-in (only shadow when absent), but they are never absent, so that gate would be dead code.

**Key insight:** The opt-in/always-shadow distinction is a *snapshot-text* decision (`aD_`), not a property of `lD_`. `lD_` produces the *same kind* of snippet regardless; it is the `if ! command -v rg` wrapper around it (and the absence of such a wrapper around `iD_`) that creates the asymmetry. The `unalias` inside the subshell is the load-bearing trick: without it, a replayed user alias would always satisfy `command -v rg` and the embedded-rg injection would never fire even when there is no real binary.

---

## 4. How the snippet lands in the snapshot (`aD_`: heredoc vs escaped echo)

`getClaudeCodeSnapshotContent` (`aD_`, `cli_inner_pretty.js:341045-341108`) calls `lD_()` once (`cli_inner_pretty.js:341056`) and renders the result by `type`:

**Function form → heredoc (`cli_inner_pretty.js:341066-341070`):**
```bash
      cat >> "$SNAPSHOT_FILE" << 'RIPGREP_FUNC_END'
  <multi-line function body from xx6>
RIPGREP_FUNC_END
```
- **Why a quoted heredoc?** The function body is multi-line and contains characters that would be murder to escape on a single `echo` line — `$@`, `$_cc_bin`, `${OSTYPE}`, `[[ … ]]`, embedded single quotes from `quote([…])`, etc. The **single-quoted** delimiter `'RIPGREP_FUNC_END'` makes the heredoc literal: bash performs **no** `$`-expansion or command substitution while writing it to `$SNAPSHOT_FILE`. The function body is captured verbatim, and `$@`/`$ZSH_VERSION` etc. stay as literal text to be expanded later, when the snapshot is sourced and `rg` is actually invoked. A non-quoted heredoc would expand `$@` at snapshot-creation time — catastrophic.

**Alias form → escaped single-quote echo (`cli_inner_pretty.js:341071-341075`):**
```javascript
    let f = K.snippet.replaceAll("'", "'\\''");
    _ += `
      echo '  alias rg='"'${f}'" >> "$SNAPSHOT_FILE"
    `;
```
- The snippet (already shell-quoted by `lD_` via `O4`) is run through `replaceAll("'", "'\\''")` (`cli_inner_pretty.js:341072`) so each `'` becomes the classic `'\''` close-reopen-escape sequence. The emitted line is `echo '  alias rg='"'<escaped>'" >> "$SNAPSHOT_FILE"`, which concatenates a single-quoted literal `'  alias rg='`, a double-quoted `"'<escaped>'"`, and writes the result. When the snapshot later evaluates, this materializes as one line: `  alias rg='<quoted path>'`.
- **Why echo rather than heredoc here?** The alias is a single line with predictable structure, so a one-liner `echo` is lighter than a heredoc. The double layer of quoting (`O4` quoting inside `lD_`, then `replaceAll` escaping inside `aD_`) is necessary because the path is being embedded into *another* single-quoted context (the `alias rg='…'`).

**Both forms sit inside the same `if ! command -v rg … then / fi` guard** (§3), so neither is defined when a system `rg` is present.

**Key insight:** The two render paths exist because the two snippet shapes have different escaping needs — a multi-line, expansion-laden function needs a literal heredoc; a single, already-quoted alias path needs one careful `echo` with re-escaped quotes. `lD_` deliberately hands `aD_` a `type` tag precisely so `aD_` can pick the correct serialization.

---

## 5. Why `rgArgs` (`--no-config`) is NOT in the emitted function

In the embedded case, `ripgrepCommand()` returns `rgArgs: ["--no-config"]` (`cli_inner_pretty.js:207068`), yet `lD_` calls `createArgv0ShellFunction("rg", H.argv0)` with **no** `prependArgs` (`cli_inner_pretty.js:340959`). So the emitted shell function forwards `"$@"` straight through and does **not** inject `--no-config`.

**Why:** `rgArgs` is metadata for **Node-side** ripgrep spawns (e.g. Claude's own file indexing / search), which want a deterministic, config-free ripgrep — `--no-config` makes the tool ignore `~/.ripgreprc`. But the **shell** function exists so the *user* (and Claude's Bash tool) can type `rg` and get an ergonomic ripgrep that respects their local config. Two contexts, two configs:
- Node-side: `spawn(rgPath, [...rgArgs, ...userArgs])` → deterministic, `--no-config`.
- Shell-side: `function rg { … ARGV0=rg "$_cc_bin" "$@"; }` → user's `~/.ripgreprc` honored.

This invariant is unchanged from v2.1.88 (`createArgv0ShellFunction('rg', rgCommand.argv0, rgCommand.rgPath)` with no `prependArgs`, `ShellSnapshot.ts:75-79`) through v2.1.142. The only structural difference: v2.1.88's `createArgv0ShellFunction` took `(funcName, argv0, binaryPath, prependArgs=[])` and the binary path was passed explicitly (`ShellSnapshot.ts:35-40`); in 2.1.156 `xx6(H, $, q=[], K=[])` resolves the binary path itself by baking `getInstallBinDir()` (`L6H`, `cli_inner_pretty.js:340927`) and reading `CLAUDE_CODE_EXECPATH` at runtime (`cli_inner_pretty.js:340941-340943`), and adds a 4th `denyPatterns` parameter. For `rg`, both `prependArgs` and `denyPatterns` are empty, so the rg function is the simplest `xx6` output.

---

## 6. Cross-validation vs v2.1.88 clean source

The v2.1.88 `createRipgrepShellIntegration` (`ShellSnapshot.ts:65-92`) and the 2.1.156 `lD_` are **logically identical**:

| Aspect | v2.1.88 (`ShellSnapshot.ts`) | v2.1.156 (`lD_`, `cli_inner_pretty.js:340957-340963`) | Status |
|--------|------------------------------|------------------------------------------------------|--------|
| Branch on `argv0` | `if (rgCommand.argv0)` (`:72`) | `if (H.argv0)` (`:340959`) | same |
| Function snippet | `createArgv0ShellFunction('rg', rgCommand.argv0, rgCommand.rgPath)` (`:75-79`) | `xx6("rg", H.argv0)` (`:340959`) — path resolved internally | **CHANGED** (binary path no longer passed; baked inside `xx6`) |
| Alias path quoting | `quote([rgCommand.rgPath])` (`:84`) | `O4([H.rgPath])` (`:340960`) | same (`O4`=`quote`) |
| Alias args quoting | `rgCommand.rgArgs.map(arg => quote([arg]))` (`:85`) | `H.rgArgs.map((_) => O4([_]))` (`:340961`) | same |
| Alias assembly | `rgArgs.length>0 ? \`${path} ${args.join(' ')}\` : path` (`:86-89`) | `H.rgArgs.length>0 ? \`${$} ${q.join(" ")}\` : $` (`:340962`) | same |
| Return `{ type, snippet }` | `:73-80 / :91` | `:340959 / :340962` | same |

The `if ! command -v rg` opt-in gate is also present and identical in v2.1.88 (`ShellSnapshot.ts:295`, inside `getClaudeCodeSnapshotContent`), as is the unconditional find/grep shadow (`ShellSnapshot.ts:317-330`). So the opt-in-vs-always-shadow asymmetry is a long-standing design, not new.

**What is genuinely NEW/CHANGED in 2.1.156 around this code** (all confirmed absent in `ShellSnapshot.ts`):
1. **`-S dfs` added to the find/bfs integration** — `iD_` calls `xx6("find","bfs",["-S","dfs","-regextype","findutils-default"])` (`cli_inner_pretty.js:340969`); v2.1.88 had only `["-regextype","findutils-default"]` (`ShellSnapshot.ts:167-170`). This is the macOS vnode-table-exhaustion fix (depth-first bounds open dir handles). It does not touch `rg`, but it is in the same `aD_` content block.
2. **`grep` deny-pattern dispatch** — `iD_` now passes a 4th `denyPatterns` arg to `xx6` for grep (`cli_inner_pretty.js:340974`); v2.1.88's grep call had no deny list (`ShellSnapshot.ts:171-177`). Again `rg` passes none.
3. **PATH written via random-delimiter heredoc** `PATH_END_<random16>` (`cli_inner_pretty.js:341097-341104`) replaces v2.1.88's `echo "export PATH=…"` (`ShellSnapshot.ts:336`), and PATH now concatenates `getPluginBinPaths` results (`cli_inner_pretty.js:341051-341055`). Sits right after the rg block in `aD_`.
4. **Windows PATH probe via `execa`** `aJ(H,["-lc",'echo "$PATH"'],…)` (`cli_inner_pretty.js:341048`) replaces v2.1.88's `execa('echo $PATH',{shell:true})` (`ShellSnapshot.ts:274`).
5. **Vendored `builtin` ripgrep mode removed** from the resolver (`cli_inner_pretty.js:207074-207075` now returns `system`) — see §2. The v2.1.142 doc still documented a `builtin` vendored branch.

The `lD_` function body itself is otherwise the stable 2.1.88→2.1.142→2.1.156 invariant.

---

## 7. Output examples

**7.1 Function form (embedded ripgrep)** — `ripgrepCommand()` returns `{ rgPath: process.execPath, rgArgs: ["--no-config"], argv0: "rg" }`. `lD_` returns:
```javascript
{ type: "function", snippet: /* xx6("rg","rg") body */ }
```
which `aD_` writes into the snapshot, inside the guard, as:
```bash
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  function rg {
    local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
    [[ -x $_cc_bin ]] || _cc_bin='/home/alice/.local/bin/claude'
    if [[ ! -x $_cc_bin ]]; then command rg "$@"; return; fi
    if [[ -n $ZSH_VERSION ]]; then
      ARGV0=rg "$_cc_bin" "$@"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
      ARGV0=rg "$_cc_bin" "$@"
    elif [[ $BASHPID != $$ ]]; then
      exec -a rg "$_cc_bin" "$@"
    else
      (exec -a rg "$_cc_bin" "$@")
    fi
  }
fi
```
Note `--no-config` is absent (§5).

**7.2 Alias form (system rg on PATH)** — `ripgrepCommand()` returns `{ rgPath: "/usr/bin/rg", rgArgs: [], argv0: undefined }`. `lD_` returns `{ type: "alias", snippet: "/usr/bin/rg" }` (path matches `O4`'s safe-char regex, so it is emitted unquoted). `aD_` writes:
```bash
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  alias rg='/usr/bin/rg'
fi
```
In practice this branch is reached only when no system `rg` was on PATH at resolve time but one appears later — usually the guard's `command -v rg` succeeds and the alias is never defined, which is the whole point of opt-in.

---

## 8. Key insights

1. **One flag drives the whole split.** `argv0` present → function (embedded `argv[0]` dispatch is required); absent → alias (a standalone binary sets `argv[0]` itself). `lD_` is otherwise pure quoting mechanics (`cli_inner_pretty.js:340957-340963`).
2. **Opt-in is enforced by the caller, not `lD_`.** The `if ! (unalias rg…; command -v rg)…; then … fi` wrapper in `aD_` (`cli_inner_pretty.js:341062, 341078`) makes the rg integration defer to any system rg; `find`/`grep` get no such wrapper (`cli_inner_pretty.js:341081-341088`) and always shadow. The asymmetry reflects "rg is opt-installed, find/grep are universal."
3. **The subshell `unalias rg` inside the gate is essential.** It strips a replayed user alias before `command -v rg`, so the binary check sees only real binaries — without it, every user with `alias rg='…'` would suppress the embedded-rg injection even with no real `rg`.
4. **`--no-config` lives in `rgArgs` for Node-side spawns only**; it is intentionally kept out of the shell function so the user's `rg` respects `~/.ripgreprc` (`cli_inner_pretty.js:340959`).
5. **Heredoc vs echo is a serialization choice forced by snippet shape** — a multi-line, expansion-bearing function needs a `'RIPGREP_FUNC_END'` literal heredoc (`cli_inner_pretty.js:341067-341069`); a single already-quoted alias needs one re-escaped `echo` (`cli_inner_pretty.js:341072-341074`).
6. **`lD_` is unchanged 2.1.88→2.1.156**; what moved around it is the `xx6` template (path-baking + denyPatterns), the find/grep `-S dfs`/deny additions, the random-delimiter PATH heredoc, and the resolver dropping vendored `builtin` mode.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions

Key functions in this document:
- `createRipgrepShellIntegration` (`lD_`) — Decides alias-vs-function form for the `rg` snapshot integration (`cli_inner_pretty.js:340957-340963`)
- `ripgrepCommand` (`hkH`) — Accessor returning `{ rgPath, rgArgs, argv0 }` from the memoized config (`cli_inner_pretty.js:206855-206858`)
- `getRipgrepConfig` (`UD$`) — Memoized resolver: opt-out system rg / embedded argv0 / plain system rg (`cli_inner_pretty.js:207062-207076`)
- `createArgv0ShellFunction` (`xx6`) — Shared cross-shell argv0-dispatch function template (`cli_inner_pretty.js:340924-340956`)
- `createFindGrepShellIntegration` (`iD_`) — Sibling integration that always shadows find/grep (`cli_inner_pretty.js:340964-340977`)
- `getClaudeCodeSnapshotContent` (`aD_`) — Caller that renders the rg snippet into the snapshot (heredoc vs echo) (`cli_inner_pretty.js:341045-341108`)
- `isInBundledMode` (`UY`) — True when running as a bun standalone with embedded files (`cli_inner_pretty.js:132249-132251`)
- `isEnvDefinedFalsy` (`k4`) — Tests `USE_BUILTIN_RIPGREP` for 0/false/no/off (`cli_inner_pretty.js:1801-1806`)
- `quote` (`O4`) — Array→single shell word; safe-char fast path else single-quote (`cli_inner_pretty.js:176255`)
- `which` (`JB`) — exec-path existence resolver used by the config resolver
- `findExecutable` (`x98`) — PATH lookup returning `{ cmd, args }` (`cli_inner_pretty.js:206842-206844`)
