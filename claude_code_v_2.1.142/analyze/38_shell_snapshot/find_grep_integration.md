# `createFindGrepShellIntegration` — find/grep Shadow Functions (v2.1.142)

> How Claude Code v2.1.142 shadows `find` and `grep` in the snapshot shell with argv0-dispatched calls to the embedded `bfs` and `ugrep` binaries — and why every prepended flag exists. NEW v2.1.142: a deny-pattern list lets ugrep-only flags fall through to the user's system grep.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Shell-integration symbols

Key functions in this document:
- `createFindGrepShellIntegration` (`Ai_`) — Top-level emitter for find+grep shadows
- `hasEmbeddedSearchTools` (`dM`) — Gate that controls whether shadowing happens
- `createArgv0ShellFunction` (`Iv6`) — Shared template (covered in [argv0_dispatch.md](./argv0_dispatch.md))

Constants referenced:
- `VCS_DIRECTORIES_TO_EXCLUDE` (`_i_`) — `[".git", ".svn", ".hg", ".bzr", ".jj", ".sl"]`

---

## 1. What it does

`createFindGrepShellIntegration` returns a single string of bash/zsh source code that defines two functions, `find` and `grep`, both backed by the embedded `bfs` and `ugrep` inside the bun binary. Or it returns `null` if the build doesn't ship embedded search tools (only SDK builds in v2.1.142).

Unlike the `rg` integration, **this one is unconditional** — when embedded tools are available, `find` and `grep` are always shadowed, regardless of whether the user has GNU find/grep on their PATH. The reason: `bfs` and `ugrep` are drop-in compatible *with carefully chosen flags*, and we want the model to get the same behaviour every time.

**NEW in v2.1.142:** the `grep` shadow uses a **deny-pattern dispatch** — if the user passes any ugrep-only flag (`--filter`, `--pager`, `--view`, etc.), the wrapper falls through to system grep instead of routing through ugrep. This prevents ugrep-specific UX from leaking through the snapshot wrapper.

The functions land in the snapshot file inside a heredoc:

```sh
cat >> "$SNAPSHOT_FILE" << 'FIND_GREP_FUNC_END'
unalias find 2>/dev/null || true
unalias grep 2>/dev/null || true
function find { ... }
function grep { ... }
FIND_GREP_FUNC_END
```

---

## 2. The actual code

```javascript
// ============================================
// createFindGrepShellIntegration - Emit unalias + find + grep shadow definitions
// Location: cli_inner_pretty.js:360516-360530
// ============================================

// ORIGINAL (for source lookup):
function Ai_() {
  if (!dM()) return null;
  return [
    "unalias find 2>/dev/null || true",
    "unalias grep 2>/dev/null || true",
    Iv6("find", "bfs", ["-regextype", "findutils-default"]),
    Iv6(
      "grep",
      "ugrep",
      ["-G", "--ignore-files", "--hidden", "-I", ..._i_.map((H) => `--exclude-dir=${H}`)],
      ["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"],
    ),
  ].join(`\n`);
}

// READABLE (for understanding):
function createFindGrepShellIntegration() {
  if (!hasEmbeddedSearchTools()) return null;
  return [
    "unalias find 2>/dev/null || true",
    "unalias grep 2>/dev/null || true",
    createArgv0ShellFunction("find", "bfs", [
      "-regextype",
      "findutils-default",
    ]),
    createArgv0ShellFunction("grep", "ugrep",
      [
        "-G",
        "--ignore-files",
        "--hidden",
        "-I",
        ...VCS_DIRECTORIES_TO_EXCLUDE.map(d => `--exclude-dir=${d}`),
      ],
      // NEW in v2.1.142: deny patterns - if any arg matches, fall through to system grep
      [
        "-*-filter*",
        "-*-pager*",
        "-*-view*",
        "-*-format-open*",
        "-*-config*",
        "---*",
        "-@*",
        "-*-save-config*",
      ]
    ),
  ].join("\n");
}

// Mapping: Ai_→createFindGrepShellIntegration, dM→hasEmbeddedSearchTools,
//          Iv6→createArgv0ShellFunction, _i_→VCS_DIRECTORIES_TO_EXCLUDE
```

The v2.1.112 equivalent (`s_Y`) called `createArgv0ShellFunction` with only 3 arguments. v2.1.142's 4th argument (`denyPatterns`) is the substantive new feature.

---

## 3. Gating: `hasEmbeddedSearchTools` (`dM`)

```javascript
// ============================================
// hasEmbeddedSearchTools - Check whether bfs/ugrep are statically linked
// Location: cli_inner_pretty.js:141600-141604
// ============================================

// ORIGINAL (for source lookup):
function dM() {
  if (!bH("true")) return !1;
  let H = process.env.CLAUDE_CODE_ENTRYPOINT;
  return H !== "sdk-ts" && H !== "sdk-py" && H !== "sdk-cli" && H !== "local-agent";
}

// READABLE (for understanding):
function hasEmbeddedSearchTools() {
  // v2.1.117 simplification: env-var gate removed. Always proceed to entrypoint check.
  if (!parseExplicitTrue("true")) return false;        // always false → never hit
  const entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
  return entrypoint !== "sdk-ts"
      && entrypoint !== "sdk-py"
      && entrypoint !== "sdk-cli"
      && entrypoint !== "local-agent";
}

// Mapping: dM→hasEmbeddedSearchTools, bH→parseExplicitTrue, H→entrypoint
```

The function reduces to: "true unless we're an SDK build". The `EMBEDDED_SEARCH_TOOLS=1` env var gate (present in v2.1.112) is gone — embedded tools are always shipped in native builds.

When `hasEmbeddedSearchTools()` returns false, `createFindGrepShellIntegration()` returns `null` and the snapshot omits the `FIND_GREP_FUNC_END` heredoc entirely. Concomitantly, `GlobTool` and `GrepTool` are re-added to the tool registry — the model gets dedicated tools instead of shadowed shell commands. See [embedded_search_tools.md](./embedded_search_tools.md) for the full Glob/Grep ↔ bfs/ugrep replacement story.

---

## 4. The deny-pattern dispatch — NEW in v2.1.142

This is the most distinctive change in v2.1.142's `Ai_`. The `grep` wrapper, when invoked with any flag matching the deny patterns, falls through to system grep:

```sh
function grep {
  local _cc_a
  for _cc_a in "$@"; do
    case "$_cc_a" in -*-filter*|-*-pager*|-*-view*|-*-format-open*|-*-config*|---*|-@*|-*-save-config*) command grep "$@"; return ;; esac
  done
  # ... rest of the argv0 dispatch ...
}
```

### Why this exists

The embedded `ugrep` is a drop-in for GNU grep — but it ALSO has ugrep-only flags that have no GNU grep counterpart:

| ugrep flag | What it does | GNU grep equivalent |
|------------|--------------|---------------------|
| `--filter=COMMAND` | Pipe binary files through a filter (e.g., `pdftotext`) | None |
| `--pager=COMMAND` | Display output through a pager | None (rely on shell `less`) |
| `--view=COMMAND` | Open matched files in an editor | None |
| `--format=FMT`, `--format-open=...` | Custom output formatting DSL | Limited (`--label`, etc.) |
| `--config=FILE` | Load ugrep config file | None |
| `---HELP` (triple dash) | Various meta flags | None |
| `-@FILE` | Read patterns from FILE | `-f FILE` in GNU grep |
| `--save-config[=FILE]` | Save current options to config | None |

When the user (or the model) passes one of these flags to `grep`, they're explicitly asking for ugrep semantics. The wrapper has two choices:
1. Route through to embedded ugrep (the embedded binary handles the flag correctly).
2. Bypass the wrapper and run system grep (which would print an error about the unknown flag).

Option 1 is the "permissive" choice but creates a UX surprise: the user's grep accepted a flag that real GNU grep would reject. If they later remove the snapshot and run the same command, it would fail. This makes debugging harder for users who don't know about the wrapper.

Option 2 is the "transparent" choice: the wrapper acts as if it isn't there for these flags. The user sees the system grep's error, which matches what they'd see without Claude Code. The user can then explicitly invoke `ugrep --filter=...` if they actually want ugrep behaviour.

v2.1.142 chose option 2 via the deny-pattern dispatch.

### How the dispatch works

```sh
function grep {
  local _cc_a
  for _cc_a in "$@"; do
    case "$_cc_a" in
      -*-filter*|-*-pager*|-*-view*|-*-format-open*|-*-config*|---*|-@*|-*-save-config*)
        command grep "$@"
        return
        ;;
    esac
  done
  # ... continue with argv0 dispatch to embedded ugrep ...
}
```

1. **Loop over every positional argument** (`for _cc_a in "$@"`).
2. **Test each arg against the case pattern set** using bash case-glob matching.
3. If **any** arg matches **any** pattern, call `command grep "$@"` (the system grep, bypassing the function) and `return`.

The patterns use bash case-glob (not regex):
- `-*` means "starts with `-`"
- `-*-filter*` means "starts with `-`, then anything (or nothing), then `-filter`, then anything (or nothing)"
- This matches both `--filter` and `-x--filter=foo` (rare but possible)

The leading `-` requirement means **positional regex/file args don't trigger dispatch**:
- ✅ `grep --filter=cat README` → matches `-*-filter*`, dispatches to system grep
- ❌ `grep "filter line" README` → `"filter line"` doesn't start with `-`, no match
- ❌ `grep filter-line README` → same reason

### Why a for-loop instead of substring search

Alternative shell idioms considered (inferable):

```sh
# Naive: substring check
if [[ " $* " == *" --filter "* ]]; then command grep "$@"; return; fi
```

This fails because:
- A regex pattern containing `--filter` as a substring (e.g., `grep "x--filter=" file`) would falsely match.
- Args with spaces (quoted) break word-boundary detection.

```sh
# Slightly better: per-arg substring
for _cc_a in "$@"; do
  if [[ "$_cc_a" == *"--filter"* ]]; then ...; fi
done
```

Still fails: `grep "match --filter inside" file` would match.

The chosen `case "$_cc_a" in -*-filter*) ...; esac` is the only form that correctly distinguishes args-starting-with-dash from positional patterns/files containing dashes.

### Edge cases the dispatch handles

| Input | Trigger? | Why |
|-------|----------|-----|
| `grep --filter=cat file` | Yes | `--filter=cat` matches `-*-filter*` |
| `grep -P 'perl-style' file` | No | `-P` is GNU grep–compatible, not in deny list |
| `grep -E '\\bx\\b' file` | No | `-E` is GNU grep–compatible |
| `grep -@ patterns.txt file` | Yes | `-@` matches `-@*` |
| `grep -f patterns.txt file` | No | `-f` is the GNU grep equivalent; wrapped through ugrep |
| `grep ---help` | Yes | `---help` matches `---*` |
| `grep --view=vim file` | Yes | matches `-*-view*` |
| `grep --color=auto file` | No | `--color` not in deny list — ugrep handles it identically |

The deny patterns are conservative: only flags that are definitely ugrep-only AND likely to cause UX confusion.

---

## 5. The two `unalias` lines — why they matter

```sh
unalias find 2>/dev/null || true
unalias grep 2>/dev/null || true
```

These come **before** the function definitions and serve a load-bearing role: bash and zsh resolve aliases *before* function lookup. A user's `.zshrc` might contain:

```sh
alias find=gfind     # macOS Homebrew: GNU find
alias grep=ggrep     # macOS Homebrew: GNU grep
```

These aliases get captured into the snapshot earlier (in `getUserSnapshotContent`) and replayed. Without the `unalias` step, the user's alias would shadow our function, sending `find` to GNU find instead of our `bfs` dispatch.

The exact order in the snapshot file:

```sh
# Aliases section (from user's config)
alias -- find='gfind'
alias -- grep='ggrep'

# ... rg fallback ...

# Shadow find/grep with embedded bfs/ugrep
unalias find 2>/dev/null || true     <-- nukes the alias
unalias grep 2>/dev/null || true     <-- nukes the alias
function find { ... }                <-- defines the function
function grep { ... }                <-- defines the function
```

The `2>/dev/null || true` is defensive: if the alias doesn't exist, `unalias` errors with "find: not found" to stderr and exits non-zero. We swallow both.

---

## 6. The `find` shadow — flag-by-flag

```javascript
createArgv0ShellFunction("find", "bfs", ["-regextype", "findutils-default"])
```

Produces a function that runs (effectively):

```sh
$_cc_bin -regextype findutils-default "$@"   # with argv[0] = "bfs"
```

So the user runs `find . -name '*.ts'` → the function runs `bfs -regextype findutils-default . -name '*.ts'`.

### Why `-regextype findutils-default`?

`bfs` (the embedded find clone) defaults `-regex` to POSIX BRE, where `\|` is a literal pipe — NOT alternation. GNU find defaults to the "emacs" flavour where `\|` is alternation. So:

```sh
find . -regex '.*\.\(js\|ts\)'
```

Under POSIX BRE (bfs default): zero matches, because `\|` doesn't mean OR.
Under findutils-default: matches `.js` and `.ts` files.

`GlobTool` (the now-replaced dedicated tool) relied on findutils-default semantics. Shadowing `find` with bare `bfs` would silently break a lot of model-issued regexes. The injected flag fixes this.

**Important caveat (carried from v2.1.88 source comment):** Even with `findutils-default`, bfs uses **Oniguruma** as its regex engine. Oniguruma's alternation is *leftmost-first* — it picks the first matching alternative and stops. POSIX (and GNU find) use *leftmost-longest*. So:

```sh
find . -regex '.*\.\(ts\|tsx\)'
```

Under bfs + findutils-default: matches `.ts` but **misses `.tsx`** files, because Oniguruma sees `\.ts` matches first and stops without trying `\.tsx`.
Under GNU find: matches both, because leftmost-longest picks `\.tsx` over `\.ts` for `foo.tsx`.

**Workaround:** put the longer alternative first: `'.*\.\(tsx\|ts\)'`. This is a real footgun.

### Why no deny patterns for find?

`createFindGrepShellIntegration` does NOT pass deny patterns to the `find` wrapper. `bfs` is much more aligned with GNU find than `ugrep` is with GNU grep:
- bfs has been a stable GNU find clone since 2015
- bfs's unique flags (`-color`, `-printf` variants) are additive and GNU-find-like
- Users typing `find --some-bfs-flag` are likely intentionally using bfs

So no flags are surprising enough to warrant deny-pattern dispatch.

### What the shadow does NOT replicate

- **No gitignore filtering.** `GlobTool` passes `--no-ignore` to rg (when it uses rg). `bfs` has no gitignore support anyway. No-op match.
- **Hidden files included.** `GlobTool` passes `--hidden` to rg; bfs's default is to include hidden files. Also a no-op match.

So the find shadow only needs the one prepended arg.

---

## 7. The `grep` shadow — flag-by-flag

```javascript
createArgv0ShellFunction("grep", "ugrep",
  ["-G", "--ignore-files", "--hidden", "-I", ...VCS_DIRECTORIES_TO_EXCLUDE.map(d => `--exclude-dir=${d}`)],
  ["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"]
)
```

`VCS_DIRECTORIES_TO_EXCLUDE` is `[".git", ".svn", ".hg", ".bzr", ".jj", ".sl"]`, so the expanded flags are:

```
-G --ignore-files --hidden -I --exclude-dir=.git --exclude-dir=.svn --exclude-dir=.hg --exclude-dir=.bzr --exclude-dir=.jj --exclude-dir=.sl
```

Produces a function that runs (effectively):

```sh
$_cc_bin -G --ignore-files --hidden -I --exclude-dir=.git ... --exclude-dir=.sl "$@"   # with argv[0] = "ugrep"
```

### `-G` — basic regex (BRE) mode

GNU `grep` defaults to BRE (basic regex) where `\|` is alternation, `\(...\)` is grouping, etc.
`ugrep` defaults to ERE (extended regex) where `|` is alternation, `(...)` is grouping.

Same syntactic incompatibility as the find/regex problem above. `grep "foo\|bar"` returns zero matches under default ugrep. `-G` switches ugrep to BRE, fixing this.

User can override with `-E`, `-F`, or `-P` later in argv — those take precedence over the earlier `-G` because last-flag-wins.

### `--ignore-files` — respect gitignore

`GrepTool` (the now-replaced dedicated tool) used ripgrep, which respects `.gitignore` by default. Plain `ugrep` does not. `--ignore-files` is ugrep's flag for "respect .ignore / .gitignore files".

Override: `grep --no-ignore-files`.

### `--hidden` — include hidden files

Same as ripgrep's behaviour (which `GrepTool` enabled). Hidden files (`.config`, `.env`, etc.) are searched.

Override: `grep --no-hidden`.

### `-I` — skip binary files

This one's interesting. Ripgrep's behaviour: when recursing into a directory, it silently skips files that look binary. But when a user explicitly passes a file argument, rg searches it (binary or not).

ugrep doesn't have this asymmetric behaviour: it searches everything unless told otherwise. `-I` makes ugrep skip binary files, aligning the *recursion* case with rg.

Override: `grep -a` (process all files as text).

The asymmetry remains a behaviour difference — direct file args to the embedded grep will still skip binary files, where rg would search them. This is a deliberate trade-off.

### `--exclude-dir=.git/...` — VCS pruning

Ripgrep skips VCS directories automatically via its gitignore handling. ugrep doesn't. The integration explicitly adds `--exclude-dir=` for each VCS root.

The list is:
- `.git` (git)
- `.svn` (Subversion)
- `.hg` (Mercurial)
- `.bzr` (Bazaar)
- `.jj` (Jujutsu)
- `.sl` (Sapling)

The same list is referenced by the tool's internal grep code (whatever module replaces the old `GrepTool.ts`). The two definitions are kept in sync deliberately.

If you add a new VCS system (e.g. `fossil` uses `.fslckout`), both places need updating.

---

## 8. What `createFindGrepShellIntegration` does NOT replicate

Two deliberate omissions, carried from v2.1.112:

### 8.1 `--max-columns 500` (ripgrep's truncation)

`GrepTool` passed `--max-columns 500` to ripgrep. When a line exceeds 500 chars, rg replaces the *line* with a placeholder like `[Omitted long matching line]`. This preserves pipeline structure (one line per match).

ugrep's equivalent flag is `--width`, but `--width` *truncates* the line to N chars rather than replacing it. Truncation can break downstream pipelines that count chars or look for line-end markers.

So: rather than pick a half-working `--width`, the integration omits truncation altogether. Trade-off: the model may see very long match lines, but pipelines remain correct.

### 8.2 Read deny rules / plugin cache exclusions

`GrepTool` consulted `toolPermissionContext` to skip files the user had deny-listed and plugin cache dirs. That context isn't available at *snapshot generation* time (the snapshot is built once per session before any tool calls). Encoding these dynamic rules into shell would require regenerating the snapshot whenever permissions change.

So: the shell wrapper just doesn't enforce these. The actual `Bash` tool's command-pre-execution permission gate handles deny rules separately, at the `Bash` invocation layer.

---

## 9. The full output (example)

For a native build, `createFindGrepShellIntegration()` returns (with line breaks added for readability):

```sh
unalias find 2>/dev/null || true
unalias grep 2>/dev/null || true
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

The grep function is verbose — the `--exclude-dir=` flags get repeated four times (once per branch). Acceptable cost given they all just inline-interpolate from the same `argSuffix` string.

The deny-pattern block at the top of grep is what's new in v2.1.142. The find function has no equivalent.

---

## 10. Why this is unconditional vs. rg being conditional

The rg integration uses `if ! command -v rg; then ...; fi` — opt-in.
The find/grep integration has no such gate — always shadows.

Rationale (compounding several factors):

| Factor | rg | find/grep |
|--------|----|-----------|
| Ubiquity of system version | Variable (many users don't install) | Universal (every Unix has them) |
| User customisation likelihood | High (rg users tweak it) | Low (rare to override find/grep) |
| Behavioural drop-in compat | ugrep/bfs match rg/find well enough | Same — and the prepended flags align them with the tools' expected semantics |
| Cost of always-shadowing | Risk overriding user-preferred rg | Minimal — embedded versions are uniformly good |

The find/grep wrappers explicitly replace the dedicated `GlobTool` and `GrepTool` tools (which are removed from the registry on native builds — see [embedded_search_tools.md](./embedded_search_tools.md)). So always-shadowing is a *correctness requirement*: if the model is told to use `Bash` with `find`/`grep`, and the wrappers don't fire, the model gets behaviour that doesn't match what `GlobTool`/`GrepTool` would have given.

The rg case is different because there's no `RgTool` being replaced — `rg` from the model's view is just a shell command, and the model can adjust expectations.

---

## 11. Edge cases (v2.1.142 additions in bold)

### 11.1 User runs `find . -regextype awk -name '*.txt'`

`bfs` receives:
```
-regextype findutils-default -regextype awk -name *.txt
```
`bfs` follows the rule "last flag wins", so the user's `awk` regextype overrides ours. Correct behaviour preserved.

### 11.2 User runs `grep -P 'lookahead'`

No deny pattern matches. `ugrep` receives:
```
-G --ignore-files --hidden -I --exclude-dir=... -P lookahead
```
`-P` (Perl regex) is set after `-G`. Last-flag-wins: `-P` takes effect, BRE is overridden. The user's intent works.

### 11.3 User runs `grep --no-hidden -r 'foo' .`

No deny pattern matches. `--no-hidden` after `--hidden` cancels it. The user can opt back into the default ugrep behaviour. This is the intended override path.

### 11.4 **NEW: User runs `grep --filter=cat README`**

The `--filter=cat` token matches `-*-filter*` in the deny list. The wrapper falls through to system `grep`. System grep doesn't recognise `--filter` and errors out with "grep: unrecognized option `--filter=cat`". The user sees this error and learns that `--filter` is not portable — exactly the UX outcome the deny pattern is designed for.

### 11.5 **NEW: User runs `grep --pager=less foo file`**

Same: `--pager` matches `-*-pager*`. System grep errors out.

If the user wanted ugrep's pager behaviour, they explicitly invoke `ugrep --pager=less foo file` (which bypasses the wrapper entirely — `ugrep` isn't shadowed).

### 11.6 Model invokes `find` then `grep` in a pipeline

`find . -type f | xargs grep -l 'foo'` — both shadow functions fire. `find` runs in a subshell (pipe creates one), so it takes the bash-subshell branch (`exec -a bfs ...`) directly. `grep` runs as `xargs`' child, also a subshell context, also bash-subshell branch. No deny patterns match, so grep goes through ugrep.

Result: pipeline has the same process count as if it had used real `bfs` and `ugrep` directly. No overhead.

### 11.7 User calls `find --help`

The function passes through: `bfs -regextype findutils-default --help`. `bfs` prints its help and exits. `-regextype findutils-default --help` is benign — bfs sees `--help` and short-circuits before doing any directory walk. Help text comes from bfs (not GNU find), which the user should see.

### 11.8 The integration is sourced but `$CLAUDE_CODE_EXECPATH` is unset

The function-body fallback path runs: `_cc_bin='/home/alice/.local/bin/claude'`. If the baked install path exists, it's used. If not, `command find "$@"` falls through to system find. This is the graceful-degradation path covered in [argv0_dispatch.md](./argv0_dispatch.md) Section 8 — and implements the v2.1.121 "falls back to installed tools" fix.

---

## 12. Constant: `VCS_DIRECTORIES_TO_EXCLUDE` (`_i_`)

```javascript
// cli_inner_pretty.js:360816
_i_ = [".git", ".svn", ".hg", ".bzr", ".jj", ".sl"];
```

The constant is initialised inside the `T(() => { ... })` lazy-module-init pattern. The constant materialises the first time the shell-snapshot module is touched.

If you add a new VCS system (e.g. `fossil` uses `.fslckout`), both this constant and the corresponding inclusion list in the tool's internal grep code need updating.

---

## 13. v2.1.112 → v2.1.142 diff for this file

| Change | v2.1.112 | v2.1.142 |
|--------|---------|----------|
| `createArgv0ShellFunction` calls | 3 args | 4 args (`Iv6("grep", "ugrep", flags, denyPatterns)`) |
| Find wrapper | Identical | Identical (no deny patterns) |
| Grep deny patterns | None | `["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"]` |
| Behaviour with ugrep-specific flag | Routed to embedded ugrep | Falls through to system grep |
| `hasEmbeddedSearchTools` gate | Required `EMBEDDED_SEARCH_TOOLS=1` env var | Removed env-var gate; always true on non-SDK |
| `VCS_DIRECTORIES_TO_EXCLUDE` | Same | Same |
| Flag set (`-G --ignore-files --hidden -I --exclude-dir=...`) | Same | Same |

The find/grep integration's *core semantics* didn't change — what changed is (1) the gate is always-on for non-SDK builds, and (2) the grep wrapper now has a UX-aware flag dispatch that protects users from accidentally relying on ugrep-only behaviour.

---

## 14. Key insights

1. **Every prepended flag fights a specific incompatibility.** `-regextype findutils-default` fixes bfs's POSIX-BRE default; `-G` fixes ugrep's ERE default; `--ignore-files`/`--hidden` mimic rg's gitignore-respecting + hidden-included posture; `-I` mimics rg's silent binary skipping; `--exclude-dir=` flags mimic rg's automatic VCS pruning. Strip any one and the shadow stops being a "drop-in" for what `GlobTool`/`GrepTool` used to do.

2. **The unconditional shadowing (vs. rg's conditional)** is a *correctness* requirement, not a performance one. With `GlobTool`/`GrepTool` removed from the tool registry on native builds, the model's `find`/`grep` invocations *must* reach `bfs`/`ugrep` for behaviour to match what the tools used to provide.

3. **The Oniguruma leftmost-first alternation footgun** is a known limitation. Patterns where one alternative is a prefix of another (`\(ts\|tsx\)`) miss matches that GNU find would catch. Workaround: put the longer one first. There's no clean fix because changing Oniguruma's engine would break other regex semantics.

4. **`--max-columns 500` is deliberately omitted** because ugrep's `--width` truncates instead of placeholder-replacing, which would silently corrupt pipeline output. Better to have long lines than corrupted pipelines.

5. **Tool deny rules are *not* enforced at the shell layer** — they happen at the `Bash` tool's permission gate (one layer up). Encoding dynamic permission state into a static snapshot would require regenerating the snapshot on every permission change, which would be prohibitive.

6. **`unalias find/grep` is essential** — the snapshot replays user aliases earlier in the file, and bash's alias-then-function lookup order would silently bypass our functions without this defensive step. This is the kind of bug that's invisible until a macOS Homebrew user hits it.

7. **NEW: The deny-pattern dispatch is a UX safety net.** It prevents the wrapper from silently routing ugrep-specific flags through, which would create surprising behaviour for users who later try the same command without the snapshot. The user gets either embedded ugrep (without these flags) or system grep (with explicit errors for unknown flags) — never a silent confusing mix.

---

## 15. Cross-reference

- [argv0_dispatch.md](./argv0_dispatch.md) — the shared shell function template used here, including the NEW deny-pattern dispatcher
- [ripgrep_integration.md](./ripgrep_integration.md) — sibling integration; contrasts with find/grep's unconditional shadowing
- [shell_integrations.md](./shell_integrations.md) — overview and how all three integrations land in the snapshot file
- [embedded_search_tools.md](./embedded_search_tools.md) — how v2.1.117 removed `Glob`/`Grep` from the tool registry on native builds
