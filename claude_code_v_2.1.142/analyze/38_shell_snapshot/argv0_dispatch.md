# `createArgv0ShellFunction` — argv[0] Dispatch (v2.1.142)

> Deep deobfuscation of the shell-function generator that lets a single bun binary impersonate `rg`, `bfs`, and `ugrep` at run-time using a portable `argv[0]` trick across bash, zsh, and Windows git-bash. v2.1.142 introduces two significant changes: a **baked install path** replaces the v2.1.112 `command -v claude` fallback, and a new **deny-pattern early-dispatch** lets specific flag patterns fall through to system tools without ever touching the embedded binary.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Shell-integration symbols

Key functions in this document:
- `createArgv0ShellFunction` (`Iv6`) — Emits the cross-shell argv0-dispatch function body
- `getInstallBinDir` (`ne`) — Returns `~/.local/bin` (used to bake the install path)
- `getEnvironmentOverrides` callsite that sets `CLAUDE_CODE_EXECPATH` — cli_inner_pretty.js:360929

Constants referenced:
- `CLAUDE_CODE_EXECPATH_ENV` (`Rv6`) — `"CLAUDE_CODE_EXECPATH"`, the env var name (cli_inner_pretty.js:360695)
- `LITERAL_BACKSLASH` (`yv6`) — `"\\"`, used elsewhere in the snapshot generator (cli_inner_pretty.js:360693)

---

## 1. What it does

`createArgv0ShellFunction` returns a string containing the body of a shell function. When that function is later sourced into a shell and invoked as `name args...`, the function spawns the Claude binary (`$CLAUDE_CODE_EXECPATH` or the **baked install path** `~/.local/bin/claude`) with `argv[0]` set to a chosen tool name and optional prepended args.

The point of setting `argv[0]` is that the Claude bun binary is a multi-tool dispatcher: it inspects its own `argv[0]` and routes to the embedded `rg`, `bfs`, or `ugrep` implementation accordingly. So one binary can be three tools depending on how it was invoked — this is the same trick `busybox`, `git`, and `multi-call` GNU coreutils use, just at the shell-function layer.

**The big picture:**
```text
shell: invoke `find . -name '*.ts'`
   |
   v
function find { ... }  <-- emitted by Iv6("find", "bfs", ["-regextype","findutils-default"])
   |
   v
bash: exec -a bfs "$_cc_bin" -regextype findutils-default "$@"
   |  (or)
zsh / msys: ARGV0=bfs "$_cc_bin" -regextype findutils-default "$@"
   |
   v
bun binary starts, sees argv[0]=="bfs", runs the bfs (find-clone) embedded implementation
   |
   v
returns matching paths to the shell
```

---

## 2. The actual code

```javascript
// ============================================
// createArgv0ShellFunction - Emit cross-shell function that dispatches via argv[0]
// Location: cli_inner_pretty.js:360476-360508
// ============================================

// ORIGINAL (for source lookup):
function Iv6(H, $, q = [], K = []) {
  let _ = q.length > 0 ? `${q.join(" ")} "$@"` : '"$@"',
    A = c$() === "windows",
    z = vX$.join(ne(), A ? "claude.exe" : "claude"),
    Y = A ? MP(z) : z,
    f = K.length > 0
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
    `  local _cc_bin="\${${Rv6}:-}"`,
    `  [[ -x $_cc_bin ]] || _cc_bin=${W4([Y])}`,
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
  ].join(`\n`);
}

// READABLE (for understanding):
function createArgv0ShellFunction(funcName, argv0, prependArgs = [], denyPatterns = []) {
  const argSuffix = prependArgs.length > 0
    ? `${prependArgs.join(" ")} "$@"`
    : `"$@"`;
  const isWindows = getPlatform() === "windows";
  const installPath = path.join(getInstallBinDir(), isWindows ? "claude.exe" : "claude");
  const normalizedInstallPath = isWindows ? toCygwinPath(installPath) : installPath;
  // NEW in v2.1.142: deny-pattern early dispatch
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
    `  local _cc_bin="\${${CLAUDE_CODE_EXECPATH_ENV}:-}"`,
    `  [[ -x $_cc_bin ]] || _cc_bin=${shellQuote([normalizedInstallPath])}`,
    `  if [[ ! -x $_cc_bin ]]; then command ${funcName} "$@"; return; fi`,
    `  if [[ -n $ZSH_VERSION ]]; then`,
    `    ARGV0=${argv0} "$_cc_bin" ${argSuffix}`,
    `  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then`,
    `    ARGV0=${argv0} "$_cc_bin" ${argSuffix}`,
    `  elif [[ $BASHPID != $$ ]]; then`,
    `    exec -a ${argv0} "$_cc_bin" ${argSuffix}`,
    `  else`,
    `    (exec -a ${argv0} "$_cc_bin" ${argSuffix})`,
    `  fi`,
    `}`
  ].join("\n");
}

// Mapping: Iv6→createArgv0ShellFunction, H→funcName, $→argv0, q→prependArgs, K→denyPatterns,
//          _→argSuffix, A→isWindows, z→installPath, Y→normalizedInstallPath, f→denyDispatch,
//          c$→getPlatform, vX$→path, ne→getInstallBinDir, MP→toCygwinPath, W4→shellQuote,
//          Rv6→CLAUDE_CODE_EXECPATH_ENV
```

---

## 3. The emitted function — examples

### 3.1 `createArgv0ShellFunction("rg", "rg", [])`

```bash
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
```

### 3.2 `createArgv0ShellFunction("find", "bfs", ["-regextype", "findutils-default"])`

```bash
function find {
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin='/home/alice/.local/bin/claude'
  if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi
  if [[ -n $ZSH_VERSION ]]; then
    ARGV0=bfs "$_cc_bin" -regextype findutils-default "$@"
  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    ARGV0=bfs "$_cc_bin" -regextype findutils-default "$@"
  elif [[ $BASHPID != $$ ]]; then
    exec -a bfs "$_cc_bin" -regextype findutils-default "$@"
  else
    (exec -a bfs "$_cc_bin" -regextype findutils-default "$@")
  fi
}
```

### 3.3 `createArgv0ShellFunction("grep", "ugrep", [...flags], [...denyPatterns])` — NEW v2.1.142

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
  ...
}
```

Before the binary-resolution block, we have a **deny-pattern loop**: scan `"$@"` and if any user arg matches one of the deny patterns, fall through to system `grep`. The deny pattern set targets ugrep-only flags that wouldn't make sense routed through the wrapper.

---

## 4. Branch-by-branch analysis

The function body has, depending on whether `denyPatterns` was provided, **five or six** sequential blocks:

1. **(NEW v2.1.142) Deny-pattern early dispatch** — if any user arg matches, run system tool and return
2. Binary resolution + safety fallback
3. zsh branch
4. Windows (msys/cygwin/win32) branch
5. bash subshell branch
6. bash main-shell branch

### 4.1 NEW: Deny-pattern early dispatch

```bash
local _cc_a
for _cc_a in "$@"; do
  case "$_cc_a" in -*-filter*|-*-pager*|-*-view*|-*-format-open*|-*-config*|---*|-@*|-*-save-config*) command grep "$@"; return ;; esac
done
```

**What this does:** iterates over every user argument and tests it against a list of `case`-style glob patterns. If any matches, calls `command grep "$@"` (the system grep, bypassing the function) and returns immediately.

**Why this exists:**

The embedded `ugrep` accepts certain flags that don't have GNU-grep equivalents (`--filter`, `--pager`, `--view`, `--format-open`, `--config`, etc.). If the user passes one of these to `grep`, they probably typed it expecting ugrep behaviour — but with the snapshot's wrapper, the user has no way to tell whether their `grep` resolves to GNU grep or to embedded ugrep.

Rather than silently routing these flags through ugrep (which would work, but might surprise users who later removed their snapshot and ran the same command without the wrapper), the wrapper says: "if you used a ugrep-specific flag, you probably know what you're doing — but I'm going to send this to the system grep anyway so behaviour stays consistent". The user can explicitly invoke `command grep --filter ...` or `ugrep --filter ...` if they want the ugrep behaviour.

**The pattern syntax** uses bash's case-pattern globbing:
- `-*-filter*` — matches `-filter`, `--filter`, `--filter=foo`, `-x-filter-y`, etc.
- `---*` — matches any arg starting with three dashes (e.g., `---help`, `---verbose`)
- `-@*` — matches any arg starting with `-@` (ugrep's `-@FILE` pattern-list flag)

Each pattern is broad enough to catch user-typed flags, while narrow enough not to accidentally match positional regex arguments. The `-*` prefix on all patterns is critical: a user-supplied regex pattern like `filter` won't trigger dispatch because it doesn't start with `-`.

**Edge case — multiple patterns in one arg:** The `case` statement matches on the **single** value of `_cc_a`. So `grep --filter=foo bar` triggers dispatch (the `--filter=foo` token matches `-*-filter*`), but `grep foo --bar` does not (no token matches).

**Why a `for` loop instead of a single test:** A flag like `--filter` could appear anywhere in argv (after a regex pattern, before, between two file args). Iterating catches it regardless of position. The alternative `[[ " $* " == *" --filter "* ]]` is fragile (false positives with quoted args containing spaces).

### 4.2 Binary resolution + safety fallback

```bash
local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
[[ -x $_cc_bin ]] || _cc_bin='/home/alice/.local/bin/claude'
if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi
```

- `${CLAUDE_CODE_EXECPATH:-}`: read the env var, default to empty if unset.
- `[[ -x $_cc_bin ]] || _cc_bin='...baked install path...'`: if the env-var-pointed file isn't executable (or empty), use the baked install path.
- `if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi`: if *both* fail, fall through to the user's system `find`/`grep`/`rg` via the `command` builtin (which bypasses functions/aliases).

**The v2.1.121 fix:** This is the v2.1.121 changelog item: "Fixed embedded grep/find/rg shell wrappers failing when the running binary is deleted mid-session — now falls back to installed tools". The combination of:
- baked install path (v2.1.142 change)
- + system-tool fallback (v2.1.112-and-later behaviour)

means that if a session was started with `claude` at `/tmp/claude-install/claude` (set via `$CLAUDE_CODE_EXECPATH`), and that file was deleted mid-session (e.g., during a `brew upgrade` or in-place reinstall), the wrapper:
1. First tries `$CLAUDE_CODE_EXECPATH` — fails the `[[ -x ]]` test.
2. Then tries the baked `~/.local/bin/claude` — succeeds if user has installed claude there normally.
3. If neither exists, falls through to `command grep "$@"` — runs the user's system grep.

The session never errors out, just degrades to system tool behaviour. The model sees grep output (in either flavour) and can continue.

### 4.3 zsh branch

```bash
if [[ -n $ZSH_VERSION ]]; then
  ARGV0=bfs "$_cc_bin" -regextype findutils-default "$@"
```

`$ZSH_VERSION` is set by zsh; absent in bash. The `ARGV0=NAME command args...` form is a **zsh-specific feature**: when zsh execs a command and sees `ARGV0` in its environment, it sets `argv[0]` of the new process to that value.

This works *without* `exec` because zsh natively honours the convention. The function returns normally (no process replacement). Importantly, this means **the wrapper function persists** across multiple `rg` calls in the same shell — `exec` would replace the shell, terminating the session.

### 4.4 Windows branch (git-bash / mintty / cygwin)

```bash
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
  ARGV0=bfs "$_cc_bin" -regextype findutils-default "$@"
```

On Windows, the bash shell that ships with Git for Windows (mintty) and Cygwin **does not respect `exec -a`** correctly — the kernel call to set argv[0] doesn't have a clean Windows mapping, and bash's emulation fails silently.

So on Windows, we use the same `ARGV0=...` form as zsh. The bun runtime is aware of this and reads `$ARGV0` from its own environment if `argv[0]` ended up being the binary path instead of the intended tool name.

### 4.5 bash subshell branch

```bash
elif [[ $BASHPID != $$ ]]; then
  exec -a bfs "$_cc_bin" -regextype findutils-default "$@"
```

`$BASHPID` is bash's PID of the current subshell. `$$` is the PID of the original interactive shell. If they differ, we're inside a subshell — meaning the function was called from `$(rg ...)`, `(rg ...)`, or as part of a pipeline.

In a subshell, `exec` is **safe**: it replaces the subshell, not the user's main shell. After `exec`, the subshell becomes the bun process; when bun exits the subshell terminates. The parent shell is unaffected.

### 4.6 bash main shell branch

```bash
else
  (exec -a bfs "$_cc_bin" -regextype findutils-default "$@")
```

If we got here, we're in bash and `$BASHPID == $$` — meaning the function is being invoked directly from the user's interactive shell or top-level script. Using bare `exec` here would replace the user's shell entirely with the bun process. When bun exits, the user is logged out.

The fix: wrap in `(...)` to force a subshell, then `exec` inside that subshell.

---

## 5. Path Resolution — v2.1.88 → v2.1.112 → v2.1.142 Evolution

This function's binary-resolution mechanism has evolved across three major versions:

| Version | Resolution chain | Trade-offs |
|---------|------------------|------------|
| v2.1.88 | Baked `quotedPath` at generation time | Snapshot tied to the path used at generation; breaks on binary move/upgrade |
| v2.1.112 | `$CLAUDE_CODE_EXECPATH` → `$(command -v claude)` → `command tool` | Snapshot portable across upgrades; vulnerable to `command -v claude` finding a malicious binary on PATH |
| v2.1.142 | `$CLAUDE_CODE_EXECPATH` → baked `~/.local/bin/claude` → `command tool` | Snapshot portable; baked path eliminates PATH-hijack risk; matches the canonical install location after v2.1.113 native binary refactor |

### Why v2.1.142 dropped `command -v claude`

The v2.1.112 fallback `_cc_bin=$(command -v claude 2>/dev/null)` had a subtle issue: `command -v` walks `$PATH`. If the user (or a malicious script) put a `claude` shim earlier in PATH than the real install (e.g., a `~/bin/claude` wrapper script), the embedded `find`/`grep`/`rg` wrappers would silently route through that shim.

v2.1.142 instead bakes the canonical install location (`~/.local/bin/claude`) at snapshot generation time. After v2.1.113's "Changed the CLI to spawn a native Claude Code binary (via a per-platform optional dependency) instead of bundled JavaScript", the canonical install lives at a known location, managed by the installer.

The downsides of baking:
- If the user installed claude somewhere else (not `~/.local/bin`), this path won't exist. The function then falls through to `command tool "$@"` — system tool. The user loses the embedded-tool acceleration but the command still runs.
- The path is computed at **snapshot generation time** (not function-call time). If `getInstallBinDir()` returns different values across sessions (it shouldn't — uses `os.homedir()`), the snapshot would need regenerating.

Effectively, v2.1.142 prioritises **security** (no PATH-hijack) over **flexibility** (custom install locations). The session-id env var (`CLAUDE_CODE_EXECPATH`, set by every Bash tool spawn via `getEnvironmentOverrides`) is the primary path; the baked path is the safety net.

### Why this matters

Three reasons inferable from the diff:

1. **Snapshot portability across binary updates.** Claude Code auto-updates can move the bun binary. The env var stays pointed at the running binary; the baked path stays valid as long as the user uses the standard installer.

2. **PATH-hijack defence.** A compromised PATH (e.g., a malicious `~/bin/claude` installed by a phishing attack) can't intercept the wrappers because they don't consult PATH anymore — only the env var and the baked path.

3. **Failure-mode robustness.** The fallback to system find/grep means that even a broken Claude install doesn't break the user's shell session inside a `Bash` tool call — they just lose the embedded-tool acceleration.

**Key insight:** This refactor moves binary-path resolution from **runtime PATH lookup** to **build-time / installer-time choice**, trading flexibility for security. The trade-off matches the broader v2.1.x trend of locking down inputs that an attacker could influence (cf. v2.1.117 `blockedMarketplaces`, v2.1.118 sandbox network rules, v2.1.119 `prUrlTemplate`).

---

## 6. Why `argSuffix` is built once

```javascript
const argSuffix = prependArgs.length > 0
  ? `${prependArgs.join(" ")} "$@"`
  : `"$@"`;
```

Two reasons:

1. **Repeated four times in the output** — once per branch. Centralising into `argSuffix` avoids divergence between branches (which would break find/grep in mysterious ways depending on shell).
2. **The empty-args optimisation matters for `rg`** — when called with no prepended flags, the function emits `"$@"` alone, not `" \"$@\""` with a leading space (which is harmless but ugly).

`prependArgs` is interpolated **unquoted** (no `shellQuote([prependArgs])`). The caller is expected to pass already-safe shell tokens (`-G`, `--ignore-files`, `--exclude-dir=.git`). Quoting them would change semantics — `-G` as a single quoted token would still work, but `--exclude-dir=.git` as a quoted token could be parsed differently depending on shell quote-handling rules.

---

## 7. Why three branches handle bash separately

Reviewing branches 5 (subshell `exec`) and 6 (main-shell `(exec)`):

| Context | What `exec -a` does | What we want | Fix |
|---------|--------------------|--------------|-----|
| Bash subshell (`$()`, `(...)`, pipeline) | Replaces subshell with bun | Replace subshell with bun (zero-overhead chain) | bare `exec -a` |
| Bash main shell | Replaces user's shell with bun → session terminates | Spawn bun as a child | wrap in `(exec -a ...)` |

The `(exec -a ...)` form: the outer `(...)` forks a subshell. Inside the subshell, `exec -a` replaces *that subshell* with bun. Net effect: the bun process runs as a child of the original shell, just like a normal command invocation, but with the correct `argv[0]`.

You might wonder: why not just always use `(exec -a ...)`? The answer is performance. In a pipeline like `find ... | grep ...`, each command already runs in its own subshell. Using `(exec -a ...)` would fork *another* layer, doubling process count for no benefit. The branch-5-vs-6 split optimises the common pipeline case.

zsh and Windows don't need this gymnastics because their `ARGV0=` form is a non-replacing variable assignment followed by a normal command run — the shell just forks-and-execs naturally, with `argv[0]` set by the bun runtime reading `$ARGV0`.

---

## 8. The `command <name> "$@"` fallback — design choice

Rather than failing loudly when the bun binary can't be found, the function falls back to the system equivalent:

```bash
if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi
```

Why `command` and not just `find`?
- Inside `function find { ... }`, calling `find "$@"` would recurse infinitely.
- `command find` bypasses both aliases and functions, going straight to the executable on PATH.

Why is this a degradation step at all (instead of erroring out)?
- The function may have been sourced from a stale snapshot generated long ago.
- The user may have moved the binary intentionally; refusing to run `find` would be worse than running the system one.
- Consistency between Claude's embedded tools and system tools is desired but not *required* for correctness. The model can still parse output of either.

The catch: silent fallback to system find/grep means subtle behavioural drift — e.g. user-supplied `\(a\|b\)` alternation patterns work under embedded `bfs` (with `-regextype findutils-default`) but fail under POSIX `find`. The model isn't told a fallback occurred. This is a deliberate trade-off favouring availability over consistency.

---

## 9. The Deny-Pattern Mechanism In Detail

The deny-pattern dispatch (NEW v2.1.142) is one of the most subtle additions. Let's walk through its design:

### 9.1 Why a `for ... case` instead of a single `[[`?

Alternatives considered (inferable from shell idioms):

| Approach | Why rejected |
|----------|--------------|
| `[[ "$*" == *--filter* ]]` | False positive: matches if any positional arg contains `--filter` as substring (e.g., `grep regex-containing-filter file`) |
| `[[ " $* " == *" --filter "* ]]` | Quoted args with spaces break the boundary check |
| `[[ "$@" =~ --filter ]]` | Same false-positive risk |
| `for _cc_a in "$@"` + `case` | Each token tested separately, with proper word-boundary matching via case glob |

The chosen `for ... case` is the only form that correctly distinguishes:
- ✅ `grep --filter=cat file` → triggers (matches `-*-filter*`)
- ✅ `grep --filter=foo --pager=less file` → triggers (matches `-*-filter*` AND `-*-pager*`, but only the first match dispatches)
- ❌ `grep "match --filter line"` → does NOT trigger (the pattern arg doesn't start with `-`)
- ❌ `grep filterless` → does NOT trigger (doesn't match `-*-filter*` because no leading `-`)

### 9.2 Why these specific patterns?

The set `["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"]` was chosen because each represents a ugrep-only feature with no GNU grep equivalent:

| Pattern | ugrep feature | Why dispatch |
|---------|---------------|--------------|
| `-*-filter*` | `--filter` runs an external program to filter binary files (e.g., extract text from PDFs) | GNU grep has no equivalent; user wants ugrep semantics |
| `-*-pager*` | `--pager` opens output through a pager | GNU grep relies on shell-level `less`; ugrep's pager auto-detection is different |
| `-*-view*` | `--view` opens matched files in editor | GNU grep doesn't have this; ugrep-specific UX |
| `-*-format-open*` | `--format-open` / similar formatting controls | ugrep's format DSL doesn't apply to grep |
| `-*-config*` | `--config=FILE` loads a config | GNU grep has no config files |
| `---*` | Anything starting with `---` is a triple-dash sequence | These are pattern-list/config flags that ugrep accepts |
| `-@*` | `-@FILE` reads pattern list from file | Same flag in GNU grep is `-f FILE` |
| `-*-save-config*` | `--save-config` writes current options to a config file | ugrep-only |

The wrapper's logic: **if you're using a ugrep-only feature, you probably know about ugrep — go straight to system tools** (or directly call ugrep yourself, bypassing the wrapper). Don't let the wrapper silently route a ugrep-specific flag through, because the user might be testing what plain `grep` does.

This is a UX-quality decision more than a correctness one. The model rarely emits these flags; humans-debugging-sessions sometimes do.

### 9.3 Why no deny patterns for find/rg?

`createFindGrepShellIntegration` calls:
```javascript
Iv6("find", "bfs", ["-regextype", "findutils-default"])        // no deny patterns
Iv6("grep", "ugrep", [...flags], [...denyPatterns])             // has deny patterns
```

`createRipgrepShellIntegration` calls:
```javascript
Iv6("rg", "rg", [])                                              // no deny patterns
```

Why only `grep`?

- **`find`/`bfs`** are very tightly aligned. bfs is explicitly a GNU find clone with extra features that are activated via additive flags (`-noignore`, `-color`, etc.). Users typing `find --some-bfs-flag` get bfs behaviour, which is consistent with bfs being installed elsewhere. The behavioural overlap is large enough that pass-through doesn't surprise users.
- **`rg`** is the canonical name for ripgrep; the wrapper is just routing to embedded rg via argv0. The user typing `rg --some-flag` is already in rg-land, not grep-land. There's no reason to dispatch.
- **`grep`** is the only case where a GNU CLI maps to a different binary (`ugrep`). The deny patterns prevent ugrep-specific flags from creating "wait, my grep accepted --filter?" moments for users.

---

## 10. Testing the function

Sample reproduction in a fresh bash shell (with v2.1.142 native build):

```bash
$ CLAUDE_CODE_EXECPATH=/usr/local/bin/claude bash
$ source <(claude --print-snapshot 2>/dev/null)   # hypothetical
$ type find
find is a function
find ()
{
    local _cc_bin="${CLAUDE_CODE_EXECPATH:-}";
    ...
}
$ type grep
grep is a function
grep ()
{
    local _cc_a;
    for _cc_a in "$@"; do
        case "$_cc_a" in
            -*-filter* | -*-pager* | ...) command grep "$@"; return ;;
        esac;
    done;
    ...
}
```

Testing the deny pattern:

```bash
$ grep --filter=cat README.md          # Should run system grep, NOT ugrep
$ which grep                            # → grep is a function (in our shell)
$ grep regex README.md                  # Goes through wrapper → ugrep
$ grep -G 'foo\|bar' README.md          # Goes through wrapper → ugrep (BRE alternation works)
```

For Claude's `find` shadow:
```bash
$ find /tmp -name '*.txt' &        # background
$ ps -o pid,args -p $!
   PID ARGS
 12345 bfs /tmp -name *.txt    <-- argv[0] is "bfs", not "/path/to/claude"
```

---

## 11. Key insights

1. **The function emits five-or-six shell blocks** because each platform/context has a different correct way to set `argv[0]`, plus the new deny-pattern dispatcher when applicable. There is no single one-liner that works portably across bash main shell, bash subshell, zsh, Windows git-bash, AND has UX-aware flag dispatch.

2. **The baked-install-path resolution** (v2.1.142) is the most consequential security change from v2.1.112. It eliminates PATH-hijack risk where `command -v claude` could find a malicious `claude` shim.

3. **The deny-pattern dispatch is a UX-correctness feature.** It prevents ugrep-specific flags from silently routing through the wrapper, which would create "the wrapper does too much" moments for users who weren't expecting ugrep semantics.

4. **The `command <name> "$@"` graceful fallback** trades behavioural consistency for availability. Combined with the baked install path, this implements the v2.1.121 "falls back to installed tools" fix.

5. **`prependArgs` and `denyPatterns` are interpolated unquoted** — the generator assumes the caller passes shell-safe tokens. This isn't a bug; it's a contract that lets the generator stay simple while letting `createFindGrepShellIntegration` express `--exclude-dir=.git` and `-*-filter*` as single tokens.

6. **All three integrations** (`rg`, `find`, `grep`) share this primitive but differ in their prepended-args, their gating conditions, their deny-patterns, and the surrounding heredoc wrapping in the snapshot file. The shared template means a bug fix here automatically improves all three.

---

## 12. Cross-reference

For how this primitive is actually invoked:
- [ripgrep_integration.md](./ripgrep_integration.md) — `createRipgrepShellIntegration` call site
- [find_grep_integration.md](./find_grep_integration.md) — `createFindGrepShellIntegration` call sites and prepended-flags rationale

For where `CLAUDE_CODE_EXECPATH` is set in the parent process:
- cli_inner_pretty.js:360929 — `O[Rv6] = process.execPath` inside `getEnvironmentOverrides`

For the install location helper `ne()`:
- cli_inner_pretty.js:313906 — returns `path.join(os.homedir(), ".local", "bin")`
