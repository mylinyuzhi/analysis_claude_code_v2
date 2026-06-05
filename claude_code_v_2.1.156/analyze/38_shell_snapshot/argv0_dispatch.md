# `createArgv0ShellFunction`: ARGV0 Dispatch + Deny Patterns + `_cc_bin` (v2.1.156)

> This document deep-dives `createArgv0ShellFunction` (`xx6`, `cli_inner_pretty.js:340924-340956`), the generator that emits a cross-shell wrapper letting a single `bun` binary impersonate `rg`, `bfs`, and `ugrep` via the `argv[0]` multicall trick. The headline 2.1.156 facts: (1) the wrapper now resolves the binary at *call time* through a three-tier `_cc_bin` chain — `$CLAUDE_CODE_EXECPATH` (`mx6`, `cli_inner_pretty.js:341166`) → baked `~/.local/bin/claude[.exe]` (from `getInstallBinDir`/`L6H`, `cli_inner_pretty.js:323465-323467`) → system-tool fallback `command <name> "$@"` (`cli_inner_pretty.js:340941-340943`); (2) an optional 4th `denyPatterns` parameter (`K`) emits a `for … case` early-return loop so listed flags fall through to the system tool (`cli_inner_pretty.js:340930-340937`). Both are **absent** from the v2.1.88 clean source (`ShellSnapshot.ts`), which baked a single `quote([binaryPath])` and had only the four shell branches. This is the v2.1.142→156 path-resolution + deny-pattern lineage, carried forward essentially unchanged.

---

## 1. What it does

`createArgv0ShellFunction` (`xx6`) returns a **string** containing the body of a POSIX-ish shell function. When that string is later sourced into a user shell (inside a snapshot file) and the function is invoked as `name args…`, it spawns the Claude `bun` binary with `argv[0]` forced to a chosen tool name plus any prepended default args.

The point of forcing `argv[0]` is that the Claude `bun` binary is a **multicall dispatcher**: it inspects its own `argv[0]` at startup and routes execution to the embedded `rg`, `bfs`, or `ugrep` implementation that matches. So one physical binary becomes three tools depending on how it was invoked — the same trick `busybox`, `git`, and multicall GNU coreutils use, here lifted up to the shell-function layer.

The signature (`cli_inner_pretty.js:340924`) is:

- `funcName` (`H`) — the shell function name to define (`rg`, `find`, `grep`).
- `argv0` (`$`) — the `argv[0]` value the `bun` dispatcher keys on (`rg`, `bfs`, `ugrep`).
- `prependArgs` (`q`, default `[]`) — default flags injected before the user's `"$@"` (`cli_inner_pretty.js:340925`).
- `denyPatterns` (`K`, default `[]`) — **NEW** glob patterns that, if matched by any user arg, bail to the system tool (`cli_inner_pretty.js:340930-340937`).

**The big picture:**

```text
shell: invoke `find . -name '*.ts'`
   |
   v
function find { ... }   <-- emitted by xx6("find","bfs",["-S","dfs","-regextype","findutils-default"])
   |
   v
resolve _cc_bin: $CLAUDE_CODE_EXECPATH  ->  ~/.local/bin/claude  ->  (fallback) command find "$@"
   |
   v
bash: exec -a bfs "$_cc_bin" -S dfs -regextype findutils-default "$@"
   |  (zsh / msys)
   v ARGV0=bfs "$_cc_bin" -S dfs -regextype findutils-default "$@"
   |
   v
bun starts, sees argv[0]=="bfs", runs the embedded bfs (find-clone) implementation
   |
   v
returns matching paths to the shell
```

---

## 2. The actual code (verbatim 2.1.156)

```javascript
// ============================================
// createArgv0ShellFunction - Emit cross-shell function that dispatches via argv[0]
// Location: cli_inner_pretty.js:340924-340956
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
    '  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then',
    `    ARGV0=${$} "$_cc_bin" ${_}`,
    "  elif [[ $BASHPID != $$ ]]; then",
    `    exec -a ${$} "$_cc_bin" ${_}`,
    "  else",
    `    (exec -a ${$} "$_cc_bin" ${_})`,
    "  fi",
    "}",
  ].join(`
`);
}

// READABLE (for understanding):
function createArgv0ShellFunction(funcName, argv0, prependArgs = [], denyPatterns = []) {
  // Default flags injected ahead of the user's positional args.
  const argSuffix = prependArgs.length > 0
    ? `${prependArgs.join(" ")} "$@"`
    : `"$@"`;
  const isWindows = getPlatform() === "windows";
  // Baked canonical install path: <home>/.local/bin/claude[.exe]
  const installPath = path.join(getInstallBinDir(), isWindows ? "claude.exe" : "claude");
  // On Windows, translate to a cygwin/msys path so bash can exec it.
  const normalizedInstallPath = isWindows ? toCygwinPath(installPath) : installPath;
  // NEW 4th param: deny-pattern early dispatch. If any user arg matches one of
  // these case globs, run the *system* tool and return before touching _cc_bin.
  const denyDispatch = denyPatterns.length > 0
    ? [
        "  local _cc_a",
        '  for _cc_a in "$@"; do',
        `    case "$_cc_a" in ${denyPatterns.join("|")}) command ${funcName} "$@"; return ;; esac`,
        "  done",
      ]
    : [];
  return [
    `function ${funcName} {`,
    ...denyDispatch,
    // _cc_bin resolution: env var -> baked path -> system fallback.
    `  local _cc_bin="\${${CLAUDE_CODE_EXECPATH_ENV}:-}"`,
    `  [[ -x $_cc_bin ]] || _cc_bin=${shellQuote([normalizedInstallPath])}`,
    `  if [[ ! -x $_cc_bin ]]; then command ${funcName} "$@"; return; fi`,
    `  if [[ -n $ZSH_VERSION ]]; then`,                              // zsh: ARGV0 env
    `    ARGV0=${argv0} "$_cc_bin" ${argSuffix}`,
    `  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then`,
    `    ARGV0=${argv0} "$_cc_bin" ${argSuffix}`,                    // Windows: ARGV0 env
    `  elif [[ $BASHPID != $$ ]]; then`,                            // bash subshell: exec is safe
    `    exec -a ${argv0} "$_cc_bin" ${argSuffix}`,
    `  else`,                                                        // bash main shell: wrap in (...)
    `    (exec -a ${argv0} "$_cc_bin" ${argSuffix})`,
    `  fi`,
    `}`
  ].join("\n");
}

// Mapping: xx6->createArgv0ShellFunction, H->funcName, $->argv0, q->prependArgs, K->denyPatterns,
//          _->argSuffix, z->isWindows, A->installPath, Y->normalizedInstallPath, f->denyDispatch,
//          n$->getPlatform, hG$->path, L6H->getInstallBinDir, cW->toCygwinPath, O4->shellQuote,
//          mx6->CLAUDE_CODE_EXECPATH (env name constant, cli_inner_pretty.js:341166)
```

Every literal in the emitted body is sourced directly from `cli_inner_pretty.js:340938-340953`; the JS-level computation of `argSuffix`/`installPath`/`denyDispatch` is `cli_inner_pretty.js:340925-340937`.

---

## 3. The bun multicall ARGV0 trick

**What it does:** lets one `bun` binary act as `rg`, `bfs`, or `ugrep` based on the `argv[0]` it sees at process start.

**How it works:**
1. The wrapper sets `argv[0]` of the spawned process to a tool name (`rg`/`bfs`/`ugrep`), *not* the binary's real path. Two mechanisms are used depending on shell (see §6).
2. The `bun` binary, on startup, reads its own `argv[0]` (and, as a fallback that bun honors natively, the `ARGV0` environment variable) and dispatches to the matching embedded implementation. The `rg` route is visible in the embedded-search descriptor: `{ mode: "embedded", command: process.execPath, args: ["--no-config"], argv0: "rg" }` (`cli_inner_pretty.js:207068`), emitted by the embedded-search resolver (`UD$`) and surfaced by `ripgrepCommand` (`hkH`, `cli_inner_pretty.js:206855-206858`), which returns `{ rgPath, rgArgs, argv0 }` from that resolver's result.
3. The same physical binary therefore exposes three distinct tools without three separate installs.

**Why this approach:**
- A single self-contained binary ships `rg`, `bfs`, and `ugrep` so the snapshot doesn't depend on the user having them installed. The alternative — shipping three binaries — triples download/install size and creates three update surfaces.
- `argv[0]`-keyed dispatch is the *only* portable convention for "same binary, different identity" that works in every shell without a launcher script. The user's shell already supports it natively (bash `exec -a`, zsh/Windows `ARGV0=`).

**Key insight:** The wrapper never names the embedded tool on the command line — it only renames the process. This is why the function can be sourced once and reused for every `rg`/`find`/`grep` call in the session: the embedded-tool selection is encoded entirely in `argv[0]`, leaving the real binary path opaque to the user.

---

## 4. DEEP DIVE — the `_cc_bin` resolution preamble (`cli_inner_pretty.js:340941-340943`)

```bash
local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
[[ -x $_cc_bin ]] || _cc_bin='/home/alice/.local/bin/claude'
if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi
```

**What it does:** resolves which executable to run, at *call time*, through a three-tier chain, and degrades gracefully to the system tool if no Claude binary is usable.

**How it works (step by step):**

1. **Tier 1 — env var** (`cli_inner_pretty.js:340941`). `local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"` reads the `CLAUDE_CODE_EXECPATH` env var, defaulting to empty if unset. The env-var *name* is the constant `mx6 = "CLAUDE_CODE_EXECPATH"` (`cli_inner_pretty.js:341166`), interpolated into the generated source so the literal text `${CLAUDE_CODE_EXECPATH:-}` is what lands in the snapshot. This var is set by the parent process on every Bash-tool spawn: `getEnvironmentOverrides` (`cli_inner_pretty.js:341403`) does `O[mx6] = process.execPath` (`cli_inner_pretty.js:341406`), so it always points at the *currently running* `bun` binary.

2. **Tier 2 — baked install path** (`cli_inner_pretty.js:340942`). `[[ -x $_cc_bin ]] || _cc_bin=${O4([Y])}` — if Tier 1's path is empty or not executable, substitute the baked install path. `Y` (`normalizedInstallPath`) is computed at *generation* time as `path.join(getInstallBinDir(), isWindows ? "claude.exe" : "claude")` (`cli_inner_pretty.js:340926-340928`). `getInstallBinDir` (`L6H`) returns `path.join(home, ".local", "bin")` (`cli_inner_pretty.js:323465-323467`), so the baked path is `<home>/.local/bin/claude` (or `claude.exe` on Windows). On Windows it is run through `toCygwinPath` (`cW`, `cli_inner_pretty.js:340928`) so msys/cygwin bash can `exec` it. The whole path is shell-quoted by `O4` (`cli_inner_pretty.js:340942`, `cli_inner_pretty.js:176255`) before being baked into the function text.

3. **Tier 3 — system fallback** (`cli_inner_pretty.js:340943`). `if [[ ! -x $_cc_bin ]]; then command <name> "$@"; return; fi` — if *both* tiers failed (no executable Claude binary anywhere), call the user's system tool via the `command` builtin and return. `command` is essential: it bypasses both aliases and the just-defined function, so `command find` cannot recurse into `function find { … }`.

**Why this approach (rationale + alternatives + trade-offs):**

- **Why call-time, not generation-time, resolution?** v2.1.88 baked a single absolute path (`quote([binaryPath])`) into the function — see §8. That path went stale the moment the binary moved (auto-update, `brew upgrade`, in-place reinstall). Resolving at call time via the env var means the wrapper always tracks the running binary across upgrades. Trade-off: the function body is larger and does an `-x` stat on each call; negligible versus an exec.

- **Why a *baked* Tier 2 instead of `command -v claude`?** The v2.1.142 lineage replaced an earlier `$(command -v claude)` fallback with a baked `~/.local/bin/claude`. `command -v` walks `$PATH`; a `claude` shim placed earlier in `$PATH` (e.g. a malicious `~/bin/claude`) would silently capture every `find`/`grep`/`rg` the wrapper routes. Baking the canonical install location removes the PATH-hijack surface entirely — the wrapper consults only the env var and one fixed path. Trade-off: users who installed Claude outside `~/.local/bin` lose embedded-tool acceleration (the path won't be executable) and fall through to Tier 3. That degradation is silent but safe.

- **Why fall through instead of erroring?** A snapshot can be sourced from a file generated long ago; the binary it referenced may be gone. Refusing to run `find`/`grep` would break the user's shell session inside the Bash tool. Degrading to the system tool keeps commands working; the model can still parse either flavor's output. Trade-off: silent behavioral drift (e.g. POSIX `find` vs `bfs` regex semantics) with no signal that a fallback occurred — availability is favored over consistency.

**Key insight:** This is the v2.1.121 "wrappers fall back to installed tools when the running binary is deleted mid-session" fix expressed in three lines. Tier 1 tracks the live binary, Tier 2 is the installer-managed safety net immune to PATH hijack, Tier 3 guarantees the user's shell never breaks. The security posture (no `$PATH` consultation) is the whole reason the baked path exists rather than a lookup.

---

## 5. DEEP DIVE — the NEW `denyPatterns` early-dispatch loop (`cli_inner_pretty.js:340930-340937`)

When `denyPatterns` (`K`) is non-empty, `xx6` prepends this block (the `f` array) *before* the `_cc_bin` preamble:

```javascript
// ============================================
// denyDispatch - Early bail to system tool when a deny-pattern arg is present
// Location: cli_inner_pretty.js:340929-340937 (the `f` array)
// ============================================

// ORIGINAL (for source lookup):
f =
  K.length > 0
    ? [
        "  local _cc_a",
        '  for _cc_a in "$@"; do',
        `    case "$_cc_a" in ${K.join("|")}) command ${H} "$@"; return ;; esac`,
        "  done",
      ]
    : [];

// READABLE (for understanding):
const denyDispatch = denyPatterns.length > 0
  ? [
      "  local _cc_a",
      '  for _cc_a in "$@"; do',
      // Join patterns with `|` into ONE case alternation; first match wins.
      `    case "$_cc_a" in ${denyPatterns.join("|")}) command ${funcName} "$@"; return ;; esac`,
      "  done",
    ]
  : [];

// Mapping: f->denyDispatch, K->denyPatterns, H->funcName, _cc_a->loop variable
```

For the live `grep` call site (`cli_inner_pretty.js:340974`) the deny set is
`["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"]`, so the emitted loop is:

```bash
local _cc_a
for _cc_a in "$@"; do
  case "$_cc_a" in -*-filter*|-*-pager*|-*-view*|-*-format-open*|-*-config*|---*|-@*|-*-save-config*) command grep "$@"; return ;; esac
done
```

**What it does:** scans every user-supplied argument; if any single token matches one of the deny globs, it runs the *system* `grep` (`command grep "$@"`) and returns, never touching the embedded-`ugrep` dispatch path.

**How it works (step by step):**
1. `local _cc_a` declares the loop variable (function-scoped so it can't leak into the caller).
2. `for _cc_a in "$@"; do … done` iterates each positional argument as a separate word. `"$@"` (quoted) preserves word boundaries, so an arg like `"two words"` is one iteration, not two.
3. `case "$_cc_a" in <pat1>|<pat2>|… ) … esac` tests the single token against the `|`-joined glob alternation. The `K.join("|")` (`cli_inner_pretty.js:340934`) splices all patterns into one `case` arm so any match triggers the same action.
4. On match: `command grep "$@"; return` runs the system tool and exits the function immediately — the `_cc_bin` resolution and ARGV0 branches below are skipped entirely.

**Why this approach (rationale + alternatives + trade-offs):**

- **Why `for … case` and not a single `[[`?** The deny check must distinguish a *flag token* from a regex/positional arg, regardless of position in argv. Alternatives and why they were rejected:

  | Approach | Why rejected |
  |---|---|
  | `[[ "$*" == *--filter* ]]` | Substring match across the joined string — false-positives on a positional regex containing `--filter`, e.g. `grep 'a--filter-b' file` |
  | `[[ " $* " == *" --filter "* ]]` | Quoted args containing spaces break the space-boundary trick |
  | `[[ "$@" =~ --filter ]]` | Same substring false-positive risk; `=~` is regex not glob |
  | `for _cc_a in "$@"` + `case` | Each token tested independently with case-glob word matching — the only form that is both position-independent and boundary-correct |

- **Why the `-*` prefix on each pattern?** Every deny glob begins with `-` (`-*-filter*`, `-@*`, `---*`). A user-supplied regex like `filter` does **not** start with `-`, so it can never trigger dispatch. This is what makes the loop safe to run over *all* args including the search pattern. Edge cases: `grep --filter=cat file` → triggers (the `--filter=cat` token matches `-*-filter*`); `grep "match --filter here" file` → does **not** trigger (the regex token has no leading `-`); `grep filterless file` → does **not** trigger.

- **Why these specific patterns?** Each targets a `ugrep`-only feature with no GNU-grep equivalent (`--filter` external-program filtering, `--pager`, `--view`, `--format-open` formatting DSL, `--config`/`--save-config` config files, `-@FILE` pattern-list, and `---*` triple-dash ugrep flags). The logic: *if the user typed a ugrep-only flag, route to the system tool* so behavior stays predictable. A user who actually wants ugrep semantics can call `command grep --filter …` or `ugrep …` directly. This is a UX-consistency decision, not a correctness one — it prevents "wait, my `grep` accepted `--filter`?" surprises when a snapshot is or isn't present.

- **Why only `grep` gets deny patterns?** The two other call sites pass no deny set: `xx6("find","bfs",["-S","dfs",…])` (`cli_inner_pretty.js:340969`) and `xx6("rg", H.argv0)` (`cli_inner_pretty.js:340959`). `find`↔`bfs` is a near drop-in (bfs is a GNU-find clone), and `rg` is literally ripgrep under its own name — neither has a foreign-flag surprise surface. Only `grep`→`ugrep` maps a GNU name onto a *different* tool, so only `grep` needs the guard.

**Key insight:** The deny loop is a *pre-resolution* guard — it sits above the `_cc_bin` chain (`...f` is spliced before the `_cc_bin` lines at `cli_inner_pretty.js:340940-340941`). Conceptually it's a fourth resolution tier that short-circuits to the system tool based on *argument shape* rather than *binary availability*. First match wins and returns; the loop never falls through to a "no deny" state — it simply continues to the `_cc_bin` block if no arg matched.

---

## 6. The four shell branches (`cli_inner_pretty.js:340944-340951`)

After resolution, the function picks one of four ways to set `argv[0]`, because each shell/context has a different correct mechanism.

### 6.1 zsh branch — `ARGV0=` env (`cli_inner_pretty.js:340944-340945`)

```bash
if [[ -n $ZSH_VERSION ]]; then
  ARGV0=bfs "$_cc_bin" -S dfs -regextype findutils-default "$@"
```

`$ZSH_VERSION` is set only by zsh. The `ARGV0=NAME cmd args…` form is a **zsh-native feature**: zsh, when it execs a command and finds `ARGV0` in the environment, sets the new process's `argv[0]` to that value. No `exec` is needed — it's a normal fork-and-exec — so the wrapper **function persists** across repeated calls in the same shell. Using bare `exec` here would replace the user's interactive zsh.

### 6.2 Windows branch — `ARGV0=` env (`cli_inner_pretty.js:340946-340947`)

```bash
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
  ARGV0=bfs "$_cc_bin" -S dfs -regextype findutils-default "$@"
```

On Windows, the bash that ships with Git for Windows (mintty) and Cygwin does **not** honor `exec -a` reliably — there is no clean Win32 mapping for setting `argv[0]`, and bash's emulation fails silently. So the wrapper falls back to the same `ARGV0=` env form as zsh; the `bun` runtime reads `$ARGV0` natively to recover the intended tool identity even when the OS handed it the binary path as `argv[0]`. This is also why the baked path was run through `toCygwinPath` (`cW`) in §4 — so bash can locate the binary.

### 6.3 bash subshell branch — `exec -a` (`cli_inner_pretty.js:340948-340949`)

```bash
elif [[ $BASHPID != $$ ]]; then
  exec -a bfs "$_cc_bin" -S dfs -regextype findutils-default "$@"
```

`$BASHPID` is the PID of the *current* bash process (updated inside subshells); `$$` is the PID of the *original* shell (frozen). When they differ, we are inside a subshell — i.e. the function was invoked from `$(find …)`, `(find …)`, or a pipeline. Here bare `exec -a` is **safe**: it replaces the *subshell*, not the user's interactive shell. The subshell becomes the `bun` process and terminates when `bun` exits; the parent shell is untouched. `exec -a NAME` is bash's flag for "exec with `argv[0]` = NAME".

### 6.4 bash main-shell branch — `(exec -a …)` (`cli_inner_pretty.js:340950-340951`)

```bash
else
  (exec -a bfs "$_cc_bin" -S dfs -regextype findutils-default "$@")
```

Reaching `else` means bash with `$BASHPID == $$` — invoked directly from the user's interactive shell or a top-level script. A bare `exec` here would replace the *user's own shell* with `bun`; when `bun` exits, the user is logged out. The fix is the outer `( … )`: it forks a subshell, then `exec -a` replaces *that* subshell with `bun`. Net effect — `bun` runs as a child of the user's shell, exactly like a normal command, but with the correct `argv[0]`.

**Why split bash into two branches instead of always using `(exec -a …)`?** Performance. In a pipeline `find … | grep …`, each stage already runs in its own subshell, so branch 6.3 can `exec` in place with zero extra forks. Always wrapping in `( … )` would fork an additional subshell layer per command for no benefit. The `$BASHPID != $$` test optimizes the common pipeline/command-substitution case while keeping the interactive case safe. zsh and Windows need none of this because their `ARGV0=` form is a non-replacing variable assignment followed by an ordinary fork-and-exec.

---

## 7. `prependArgs` handling (`cli_inner_pretty.js:340925`)

```javascript
let _ = q.length > 0 ? `${q.join(" ")} "$@"` : '"$@"';
```

**What it does:** builds the trailing argument string `argSuffix` (`_`) **once**, then interpolates it into all four branches.

**How it works:** if `prependArgs` (`q`) is non-empty, the suffix is the space-joined flags followed by `"$@"` (e.g. `-S dfs -regextype findutils-default "$@"`); otherwise it is just `"$@"`. The flags are interpolated **unquoted** — there is no `O4([...q])` wrapping. The contract is that callers pass already-safe shell tokens; `createFindGrepShellIntegration` (`iD_`) supplies literals like `-S`, `dfs`, `--exclude-dir=.git` (`cli_inner_pretty.js:340969-340973`) that are valid bare words. Quoting them would change semantics — e.g. `--exclude-dir=.git` as a single quoted token could be parsed differently across shells.

**Why build it once?** The suffix appears in all four branches (`cli_inner_pretty.js:340945,340947,340949,340951`). Centralizing into `_` prevents the branches from diverging (a divergence would break find/grep in shell-specific, hard-to-diagnose ways). The empty-args path also keeps the `rg` wrapper clean — it emits `"$@"` alone, not `" \"$@\""` with a stray leading space.

> Note: the live `find` integration in 2.1.156 passes `["-S","dfs","-regextype","findutils-default"]` (`cli_inner_pretty.js:340969`). The `-S dfs` pair is **new in 2.1.156** (v2.1.88 and the v2.1.142 find_grep doc had only `["-regextype","findutils-default"]`). It selects bfs's depth-first strategy to bound concurrent open directory handles (a macOS vnode-table-exhaustion fix). It flows through `prependArgs` exactly like the other flags and is covered in the find/grep integration doc; here it only matters as another unquoted `prependArgs` token.

---

## 8. Cross-validation vs v2.1.88 clean source

The v2.1.88 reference (`/lyz/codespace/3rd/claude-code/src/utils/bash/ShellSnapshot.ts:35-59`) is the same conceptual generator but **materially simpler**:

```typescript
// v2.1.88 ShellSnapshot.ts:41-58 (clean TS reference)
const quotedPath = quote([binaryPath])
const argSuffix =
  prependArgs.length > 0 ? `${prependArgs.join(' ')} "$@"` : '"$@"'
return [
  `function ${funcName} {`,
  '  if [[ -n $ZSH_VERSION ]]; then',
  `    ARGV0=${argv0} ${quotedPath} ${argSuffix}`,
  '  elif [[ "$OSTYPE" == "msys" ]] || ... ; then',
  `    ARGV0=${argv0} ${quotedPath} ${argSuffix}`,
  '  elif [[ $BASHPID != $$ ]]; then',
  `    exec -a ${argv0} ${quotedPath} ${argSuffix}`,
  '  else',
  `    (exec -a ${argv0} ${quotedPath} ${argSuffix})`,
  '  fi',
  '}',
].join('\n')
```

What 2.1.156 **adds** that v2.1.88 does **not** have (each confirmed absent via grep of `ShellSnapshot.ts` for `_cc_bin`, `_cc_a`, `CLAUDE_CODE_EXECPATH`, `getInstallBinDir`, `command -v claude`, `denyPattern`):

| Feature | v2.1.88 | v2.1.156 | Evidence (2.1.156) |
|---|---|---|---|
| Binary path source | baked `quote([binaryPath])` directly into all 4 branches | `_cc_bin` 3-tier chain resolved at call time | `cli_inner_pretty.js:340941-340943` |
| `$CLAUDE_CODE_EXECPATH` (Tier 1) | none | `local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"` | `cli_inner_pretty.js:340941`, const `mx6` `cli_inner_pretty.js:341166` |
| Baked install path (Tier 2) | none (the *whole* path was baked, but as the only source) | `~/.local/bin/claude[.exe]` via `getInstallBinDir` | `cli_inner_pretty.js:340926-340928`, `cli_inner_pretty.js:323465-323467` |
| System-tool fallback (Tier 3) | none — no executability check at all | `if [[ ! -x $_cc_bin ]]; then command <name> "$@"; return; fi` | `cli_inner_pretty.js:340943` |
| `denyPatterns` 4th param + loop | none (3 params: funcName, argv0, prependArgs) | optional `for … case` early-return | `cli_inner_pretty.js:340924`, `cli_inner_pretty.js:340930-340937` |
| Windows path normalization | implicit (path was already final) | `toCygwinPath` on the baked path | `cli_inner_pretty.js:340928` |

The **four shell branches themselves are byte-for-byte identical** in structure between v2.1.88 and v2.1.156 (`ZSH_VERSION` → msys/cygwin/win32 → `BASHPID != $$` → else). What changed is *what they exec* (`"$_cc_bin"` vs a baked `quotedPath`) and *what guards run before them* (the `_cc_bin` resolution and optional deny loop). The v2.1.142 reference doc (`argv0_dispatch.md`) documents these exact additions under the obfuscated name `Iv6` with constant `Rv6` and helper `ne`; in 2.1.156 the lineage is unchanged but the symbols are renamed: `xx6` (was `Iv6`), `mx6`/`CLAUDE_CODE_EXECPATH` (was `Rv6`), `L6H`/`getInstallBinDir` (was `ne`), `O4`/quote (was `W4`), `n$`/getPlatform (was `c$`), `cW`/toCygwinPath (was `MP`), `hG$`/path (was `vX$`). The behavior is identical; only the minifier's name assignments moved.

**Conclusion:** the `_cc_bin` chain and `denyPatterns` are part of the **v2.1.142→156 path-resolution + deny-pattern lineage**, both still present and unchanged in 2.1.156. The only 2.1.156-era delta inside the wrapper's *output* (as opposed to its resolution machinery) is the new `-S dfs` flag carried in via `prependArgs` at the `find` call site (`cli_inner_pretty.js:340969`).

---

## 9. Worked example — the live `grep` wrapper

`createFindGrepShellIntegration` (`iD_`, `cli_inner_pretty.js:340964-340977`) makes the `grep` call (`cli_inner_pretty.js:340970-340975`):

```javascript
xx6(
  "grep",
  "ugrep",
  ["-G", "--ignore-files", "--hidden", "-I", ...nD_.map((H) => `--exclude-dir=${H}`)],
  ["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"],
);
```

with `nD_ = [".git",".svn",".hg",".bzr",".jj",".sl"]` (`cli_inner_pretty.js:341289`). The emitted function (on Linux, `$CLAUDE_CODE_EXECPATH` set) is:

```bash
function grep {
  local _cc_a
  for _cc_a in "$@"; do
    case "$_cc_a" in -*-filter*|-*-pager*|-*-view*|-*-format-open*|-*-config*|---*|-@*|-*-save-config*) command grep "$@"; return ;; esac
  done
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin='/home/alice/.local/bin/claude'
  if [[ ! -x $_cc_bin ]]; then command grep "$@"; return; fi
  if [[ -n $ZSH_VERSION ]]; then
    ARGV0=ugrep "$_cc_bin" -G --ignore-files --hidden -I --exclude-dir=.git --exclude-dir=.svn --exclude-dir=.hg --exclude-dir=.bzr --exclude-dir=.jj --exclude-dir=.sl "$@"
  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    ARGV0=ugrep "$_cc_bin" -G --ignore-files --hidden -I --exclude-dir=.git --exclude-dir=.svn --exclude-dir=.hg --exclude-dir=.bzr --exclude-dir=.jj --exclude-dir=.sl "$@"
  elif [[ $BASHPID != $$ ]]; then
    exec -a ugrep "$_cc_bin" -G --ignore-files --hidden -I --exclude-dir=.git --exclude-dir=.svn --exclude-dir=.hg --exclude-dir=.bzr --exclude-dir=.jj --exclude-dir=.sl "$@"
  else
    (exec -a ugrep "$_cc_bin" -G --ignore-files --hidden -I --exclude-dir=.git --exclude-dir=.svn --exclude-dir=.hg --exclude-dir=.bzr --exclude-dir=.jj --exclude-dir=.sl "$@")
  fi
}
```

Behavior summary:
- `grep --filter=cat file` → deny loop matches `-*-filter*` → `command grep "$@"` (system grep) → return.
- `grep -G 'foo\|bar' file` → no deny match → resolves `_cc_bin` → dispatches to embedded `ugrep` via `argv[0]=ugrep`, with BRE alternation working because of the prepended `-G`.
- If `bun` binary was deleted mid-session and `~/.local/bin/claude` doesn't exist → Tier 3 fallback → `command grep "$@"`.

---

## 10. Key insights

1. **Three orthogonal mechanisms, one generator.** `xx6` composes (a) optional deny-pattern bail, (b) a 3-tier `_cc_bin` resolution, and (c) one of four `argv[0]`-setting branches. Each addresses a different concern — UX consistency, binary availability/security, and shell portability — but they share one template so a fix to any one improves `rg`, `find`, and `grep` at once.

2. **The `_cc_bin` chain is the v2.1.121 fix made portable.** Tier 1 tracks the live binary across auto-updates; Tier 2 is the installer-managed, PATH-hijack-immune safety net; Tier 3 guarantees the user's shell never breaks. Replacing `command -v claude` with a baked path is the security crux — the wrapper consults `$PATH` for nothing.

3. **The deny loop is a pre-resolution, argument-shape guard.** It runs *before* binary resolution and bails to the system tool when a ugrep-only flag appears, trading "always use the fast embedded tool" for "never surprise the user with foreign flag semantics." Only `grep` needs it because only `grep`→`ugrep` remaps a GNU name onto a different binary.

4. **Unquoted `prependArgs` / `denyPatterns` is a deliberate contract.** The generator interpolates both unquoted and trusts callers to pass shell-safe tokens. This keeps the template simple while letting the call sites express `--exclude-dir=.git`, `-S dfs`, and `-*-filter*` as single literals.

5. **The four shell branches are unchanged since v2.1.88.** All 2.1.156 evolution is in the *resolution preamble* and the *deny loop*, not in how `argv[0]` is set. The branch logic encodes a hard portability truth: there is no single one-liner that correctly sets `argv[0]` across bash main shell, bash subshell, zsh, and Windows git-bash.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions

Key functions in this document:
- `createArgv0ShellFunction` (`xx6`) — emits the cross-shell argv0-dispatch function body with `_cc_bin` resolution + optional deny loop (`cli_inner_pretty.js:340924-340956`)
- `createRipgrepShellIntegration` (`lD_`, `cli_inner_pretty.js:340957-340962`) — calls `xx6("rg", argv0)` with no prepend/deny args (`cli_inner_pretty.js:340959`)
- `createFindGrepShellIntegration` (`iD_`, `cli_inner_pretty.js:340964-340977`) — calls `xx6("find",…)` (`cli_inner_pretty.js:340969`) and the deny-pattern `xx6("grep",…)` (`cli_inner_pretty.js:340970-340975`)
- `getInstallBinDir` (`L6H`) — returns `<home>/.local/bin`, used to bake the install path (`cli_inner_pretty.js:323465-323467`)
- `getEnvironmentOverrides` (`cli_inner_pretty.js:341403`) — sets `CLAUDE_CODE_EXECPATH = process.execPath` per Bash-tool spawn (`O[mx6] = process.execPath` at `cli_inner_pretty.js:341406`)
- `shellQuote` (`O4`) — array → single shell word, quotes the baked path (`cli_inner_pretty.js:176255-176262`)

Constants referenced:
- `CLAUDE_CODE_EXECPATH` env name (`mx6`) — `"CLAUDE_CODE_EXECPATH"` (`cli_inner_pretty.js:341166`)
- `VCS_DIRECTORIES_TO_EXCLUDE` (`nD_`) — `[".git",".svn",".hg",".bzr",".jj",".sl"]` (`cli_inner_pretty.js:341289`)
