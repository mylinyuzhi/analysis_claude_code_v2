# `createFindGrepShellIntegration` — find/grep Shadow Functions (v2.1.112)

> How Claude Code v2.1.112 shadows `find` and `grep` in the snapshot shell with argv0-dispatched calls to the embedded `bfs` and `ugrep` binaries — and why every prepended flag exists.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_07.md](../00_overview/symbol_additions_unit_07.md) - Shell-integration symbols introduced in this unit

Key functions in this document:
- `createFindGrepShellIntegration` (`s_Y`) - Top-level emitter for find+grep shadows
- `hasEmbeddedSearchTools` (`$H`) - Gate that controls whether shadowing happens
- `createArgv0ShellFunction` (`U47`) - Shared template (covered in `argv0_dispatch.md`)

Constants referenced:
- `VCS_DIRECTORIES_TO_EXCLUDE` (`a_Y`) - `[".git", ".svn", ".hg", ".bzr", ".jj", ".sl"]`

---

## 1. What it does

`createFindGrepShellIntegration` returns a single string of bash/zsh source code that defines two functions, `find` and `grep`, both backed by the embedded `bfs` and `ugrep` inside the bun binary. Or it returns `null` if the build doesn't ship embedded search tools.

Unlike the `rg` integration, **this one is unconditional** — when embedded tools are available, `find` and `grep` are always shadowed, regardless of whether the user has GNU find/grep on their PATH. The reason: `bfs` and `ugrep` are drop-in compatible *with carefully chosen flags*, and we want the model to get the same behaviour every time.

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
// Location: chunks.144.mjs:1830-1834
// ============================================

// ORIGINAL (for source lookup):
function s_Y() { if (!$H()) return null; return ["unalias find 2>/dev/null || true", "unalias grep 2>/dev/null || true", U47("find", "bfs", ["-regextype", "findutils-default"]), U47("grep", "ugrep", ["-G", "--ignore-files", "--hidden", "-I", ...a_Y.map((q) => `--exclude-dir=${q}`)])].join("\n") }

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
    createArgv0ShellFunction("grep", "ugrep", [
      "-G",
      "--ignore-files",
      "--hidden",
      "-I",
      ...VCS_DIRECTORIES_TO_EXCLUDE.map(d => `--exclude-dir=${d}`),
    ]),
  ].join("\n");
}

// Mapping: s_Y->createFindGrepShellIntegration, $H->hasEmbeddedSearchTools, U47->createArgv0ShellFunction, a_Y->VCS_DIRECTORIES_TO_EXCLUDE
```

The v2.1.88 TypeScript signature took `binaryPath` as `createArgv0ShellFunction`'s 3rd argument; v2.1.112 dropped it (path resolution is now lazy — see `argv0_dispatch.md` Section 6).

---

## 3. Gating: `hasEmbeddedSearchTools`

```javascript
// ============================================
// hasEmbeddedSearchTools - Check whether bfs/ugrep are statically linked
// Location: chunks.64.mjs:2886-2890
// ============================================

// ORIGINAL (for source lookup):
function $H() { if (!S6(process.env.EMBEDDED_SEARCH_TOOLS)) return !1; let q = process.env.CLAUDE_CODE_ENTRYPOINT; return q !== "sdk-ts" && q !== "sdk-py" && q !== "sdk-cli" && q !== "local-agent" }

// READABLE (for understanding):
function hasEmbeddedSearchTools() {
  if (!isEnvTruthy(process.env.EMBEDDED_SEARCH_TOOLS)) return false;
  const entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
  return entrypoint !== "sdk-ts"
      && entrypoint !== "sdk-py"
      && entrypoint !== "sdk-cli"
      && entrypoint !== "local-agent";
}

// Mapping: $H->hasEmbeddedSearchTools, S6->isEnvTruthy
```

Two AND-gated conditions:

1. **`EMBEDDED_SEARCH_TOOLS=1`** — build-time define. Only set in ant-native builds (`scripts/build-with-plugins.ts`).
2. **`CLAUDE_CODE_ENTRYPOINT` is none of `sdk-ts` / `sdk-py` / `sdk-cli` / `local-agent`** — these are SDK / library entrypoints (running Claude Code as an embedded library from third-party code), where deterministic shell behaviour matters more than tool consistency.

When `hasEmbeddedSearchTools()` returns false, `createFindGrepShellIntegration()` returns `null` and the snapshot omits the `FIND_GREP_FUNC_END` heredoc entirely. Concomitantly, `GlobTool` and `GrepTool` are re-added to the tool registry — the model gets dedicated tools instead of shadowed shell commands.

---

## 4. The two `unalias` lines — why they matter

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

## 5. The `find` shadow — flag-by-flag

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

`GlobTool` relies on findutils-default semantics. Shadowing `find` with bare `bfs` would silently break a lot of model-issued regexes. The injected flag fixes this.

**Important caveat (from v2.1.88 source comment):** Even with `findutils-default`, bfs uses **Oniguruma** as its regex engine. Oniguruma's alternation is *leftmost-first* — it picks the first matching alternative and stops. POSIX (and GNU find) use *leftmost-longest*. So:

```sh
find . -regex '.*\.\(ts\|tsx\)'
```

Under bfs + findutils-default: matches `.ts` but **misses `.tsx`** files, because Oniguruma sees `\.ts` matches first and stops without trying `\.tsx`.
Under GNU find: matches both, because leftmost-longest picks `\.tsx` over `\.ts` for `foo.tsx`.

**Workaround:** put the longer alternative first: `'.*\.\(tsx\|ts\)'`. This is the documented workaround in the v2.1.88 source. It's a real footgun.

### What the shadow does NOT replicate

- **No gitignore filtering.** `GlobTool` passes `--no-ignore` to rg (when it uses rg). `bfs` has no gitignore support anyway. No-op match.
- **Hidden files included.** `GlobTool` passes `--hidden` to rg; bfs's default is to include hidden files. Also a no-op match.

So the find shadow only needs the one prepended arg.

---

## 6. The `grep` shadow — flag-by-flag

```javascript
createArgv0ShellFunction("grep", "ugrep", [
  "-G",
  "--ignore-files",
  "--hidden",
  "-I",
  ...VCS_DIRECTORIES_TO_EXCLUDE.map(d => `--exclude-dir=${d}`),
])
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

`GrepTool` uses ripgrep, which respects `.gitignore` by default. Plain `ugrep` does not. `--ignore-files` is ugrep's flag for "respect .ignore / .gitignore files".

Override: `grep --no-ignore-files`.

### `--hidden` — include hidden files

Same as ripgrep's behaviour (which `GrepTool` enables). Hidden files (`.config`, `.env`, etc.) are searched.

Override: `grep --no-hidden`.

### `-I` — skip binary files

This one's interesting. Ripgrep's behaviour: when recursing into a directory, it silently skips files that look binary. But when a user explicitly passes a file argument, rg searches it (binary or not).

ugrep doesn't have this asymmetric behaviour: it searches everything unless told otherwise. `-I` makes ugrep skip binary files, aligning the *recursion* case with rg.

Override: `grep -a` (process all files as text).

The asymmetry remains a behaviour difference — direct file args to the embedded grep will still skip binary files, where rg would search them. The v2.1.88 source explicitly accepts this:

> rg's recursion silently skips binary matches by default (different from direct-file-arg behavior); ugrep doesn't, so we inject -I to match. Override with `grep -a`.

### `--exclude-dir=.git/...` — VCS pruning

Ripgrep skips VCS directories automatically via its gitignore handling. ugrep doesn't. The integration explicitly adds `--exclude-dir=` for each VCS root.

The list is:
- `.git` (git)
- `.svn` (Subversion)
- `.hg` (Mercurial)
- `.bzr` (Bazaar)
- `.jj` (Jujutsu — added between v2.1.76 and v2.1.88)
- `.sl` (Sapling — added between v2.1.76 and v2.1.88)

Note: the same list is referenced by `GrepTool.ts` in v2.1.88 (`VCS_DIRECTORIES_TO_EXCLUDE`). The two definitions are kept in sync deliberately — comment in v2.1.88: "Matches the list in GrepTool".

---

## 7. What `createFindGrepShellIntegration` does NOT replicate

The v2.1.88 source documents two deliberate omissions:

### 7.1 `--max-columns 500` (ripgrep's truncation)

`GrepTool` passes `--max-columns 500` to ripgrep. When a line exceeds 500 chars, rg replaces the *line* with a placeholder like `[Omitted long matching line]`. This preserves pipeline structure (one line per match).

ugrep's equivalent flag is `--width`, but `--width` *truncates* the line to N chars rather than replacing it. Truncation can break downstream pipelines that count chars or look for line-end markers.

So: rather than pick a half-working `--width`, the integration omits truncation altogether. Trade-off: the model may see very long match lines, but pipelines remain correct.

### 7.2 Read deny rules / plugin cache exclusions

`GrepTool` consults `toolPermissionContext` to skip files the user has deny-listed and plugin cache dirs. That context isn't available at *snapshot generation* time (the snapshot is built once per session before any tool calls). Encoding these dynamic rules into shell would require regenerating the snapshot whenever permissions change.

So: the shell wrapper just doesn't enforce these. The actual `Bash` tool's command-pre-execution permission gate handles deny rules separately, at the `Bash` invocation layer.

---

## 8. The full output (example)

For an ant-native build, `createFindGrepShellIntegration()` returns:

```sh
unalias find 2>/dev/null || true
unalias grep 2>/dev/null || true
function find {
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)
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
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)
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

---

## 9. Why this is unconditional vs. rg being conditional

The rg integration uses `if ! command -v rg; then ...; fi` — opt-in.
The find/grep integration has no such gate — always shadows.

Rationale (compounding several factors):

| Factor | rg | find/grep |
|--------|----|-----------|
| Ubiquity of system version | Variable (many users don't install) | Universal (every Unix has them) |
| User customisation likelihood | High (rg users tweak it) | Low (rare to override find/grep) |
| Behavioural drop-in compat | ugrep/bfs match rg/find well enough | Same — and the prepended flags align them with the tools' expected semantics |
| Cost of always-shadowing | Risk overriding user-preferred rg | Minimal — embedded versions are uniformly good |

The find/grep wrappers explicitly replace the dedicated `GlobTool` and `GrepTool` tools (which are removed from the registry when embedded search tools ship). So always-shadowing is a *correctness requirement*: if the model is told to use `Bash` with `find`/`grep`, and the wrappers don't fire, the model gets behaviour that doesn't match what `GlobTool`/`GrepTool` would have given.

The rg case is different because there's no `RgTool` being replaced — `rg` from the model's view is just a shell command, and the model can adjust expectations.

---

## 10. Edge cases

### 10.1 User runs `find . -regextype awk -name '*.txt'`

`bfs` receives:
```
-regextype findutils-default -regextype awk -name *.txt
```
`bfs` follows the rule "last flag wins", so the user's `awk` regextype overrides ours. Correct behaviour preserved.

### 10.2 User runs `grep -P 'lookahead'`

`ugrep` receives:
```
-G --ignore-files --hidden -I --exclude-dir=... -P lookahead
```
`-P` (Perl regex) is set after `-G`. Last-flag-wins: `-P` takes effect, BRE is overridden. The user's intent works.

### 10.3 User runs `grep --no-hidden -r 'foo' .`

`--no-hidden` after `--hidden` cancels it. The user can opt back into the default ugrep behaviour. This is the intended override path.

### 10.4 Model invokes `find` then `grep` in a pipeline

`find . -type f | xargs grep -l 'foo'` — both shadow functions fire. `find` runs in a subshell (pipe creates one), so it takes branch 3 (`exec -a bfs ...`) directly. `grep` runs as `xargs`' child, also a subshell context, also branch 3.

Result: pipeline has the same process count as if it had used real `bfs` and `ugrep` directly. No overhead.

### 10.5 User calls `find --help`

The function passes through: `bfs -regextype findutils-default --help`. `bfs` prints its help and exits. `-regextype findutils-default --help` is benign — bfs sees `--help` and short-circuits before doing any directory walk. Help text comes from bfs (not GNU find), which the user should see.

### 10.6 The integration is sourced but `$CLAUDE_CODE_EXECPATH` is unset

The function-body fallback path runs: `_cc_bin=$(command -v claude 2>/dev/null)`. If `claude` is on PATH, it's used. If not, `command find "$@"` falls through to system find. This is the graceful-degradation path covered in `argv0_dispatch.md` Section 8.

---

## 11. Constant: `VCS_DIRECTORIES_TO_EXCLUDE`

```javascript
// chunks.144.mjs:2085
a_Y = [".git", ".svn", ".hg", ".bzr", ".jj", ".sl"]
```

This is defined inside `QPK = L(() => { ... })` — a lazy-initialiser block (the `L(...)` pattern is repeated through chunks.144.mjs for lazy module init). The constant materialises the first time the shell-snapshot module is touched.

**Comment in v2.1.88 source:** "Matches the list in GrepTool (see GrepTool.ts: VCS_DIRECTORIES_TO_EXCLUDE)". The two arrays are kept lexically in sync.

If you add a new VCS system (e.g. `fossil` uses `.fslckout`), both files need updating.

---

## 12. v2.1.88 → v2.1.112 diff for this file

| Change | v2.1.88 | v2.1.112 |
|--------|---------|----------|
| `createArgv0ShellFunction` calls | 3 args passing `binaryPath` | 2 args (no `binaryPath`) |
| Behaviour with stale binary path | Hard fail | Falls back to system find/grep |
| `VCS_DIRECTORIES_TO_EXCLUDE` | Same (6 entries with `.jj`, `.sl`) | Same |
| `hasEmbeddedSearchTools` gate logic | Same (`EMBEDDED_SEARCH_TOOLS` + non-SDK entrypoint) | Same |
| Flag set (`-regextype findutils-default`, `-G --ignore-files --hidden -I --exclude-dir=...`) | Same | Same |

The find/grep integration's *semantics* didn't change between v2.1.88 and v2.1.112 — only the underlying argv0 primitive evolved.

---

## 13. Key insights

1. **Every prepended flag fights a specific incompatibility.** `-regextype findutils-default` fixes bfs's POSIX-BRE default; `-G` fixes ugrep's ERE default; `--ignore-files`/`--hidden` mimic rg's gitignore-respecting + hidden-included posture; `-I` mimics rg's silent binary skipping; `--exclude-dir=` flags mimic rg's automatic VCS pruning. Strip any one and the shadow stops being a "drop-in" for what `GlobTool`/`GrepTool` used to do.

2. **The unconditional shadowing (vs. rg's conditional)** is a *correctness* requirement, not a performance one. With `GlobTool`/`GrepTool` removed from the tool registry, the model's `find`/`grep` invocations *must* reach `bfs`/`ugrep` for behaviour to match what the tools used to provide.

3. **The Oniguruma leftmost-first alternation footgun** is a known limitation. Patterns where one alternative is a prefix of another (`\(ts\|tsx\)`) miss matches that GNU find would catch. Workaround: put the longer one first. There's no clean fix because changing Oniguruma's engine would break other regex semantics.

4. **`--max-columns 500` is deliberately omitted** because ugrep's `--width` truncates instead of placeholder-replacing, which would silently corrupt pipeline output. Better to have long lines than corrupted pipelines.

5. **Tool deny rules are *not* enforced at the shell layer** — they happen at the `Bash` tool's permission gate (one layer up). Encoding dynamic permission state into a static snapshot would require regenerating the snapshot on every permission change, which would be prohibitive.

6. **`unalias find/grep` is essential** — the snapshot replays user aliases earlier in the file, and bash's alias-then-function lookup order would silently bypass our functions without this defensive step. This is the kind of bug that's invisible until a macOS Homebrew user hits it.

---

## 14. Cross-reference

- `argv0_dispatch.md` — the shared shell function template used here
- `ripgrep_integration.md` — sibling integration; contrasts with find/grep's unconditional shadowing
- `shell_integrations.md` — overview and how all three integrations land in the snapshot file
