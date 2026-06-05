# find/grep Shadowing via embedded bfs/ugrep — incl. NEW `-S dfs` (v2.1.156)

> This document analyzes `createFindGrepShellIntegration` (`iD_`, `cli_inner_pretty.js:340964-340978`), the snapshot emitter that shadows the user's `find` and `grep` with argv0-dispatched calls into the `bfs` and `ugrep` binaries embedded in the bun binary. It is gated by `hasEmbeddedSearchTools` (`RL`) and returns `null` on SDK builds. **Headline 2.1.156 change:** the `find`/`bfs` wrapper now prepends `-S dfs` (`cli_inner_pretty.js:340969`) — a flag absent from both the v2.1.88 clean source and the v2.1.142 reference doc. This was a host-stability fix: bfs's default breadth-first walk holds an open directory FD per pending frontier level and could exhaust the macOS file/vnode table on large trees (`changelog_to_code_map.md:218`, mapping `iD_` to `340964-340977`). The doc deep-analyzes that fix, then explains every other prepended flag (`-regextype findutils-default`, `-G`, `--ignore-files`, `--hidden`, `-I`, the per-VCS `--exclude-dir=`), the grep deny-pattern allowlist, the Oniguruma alternation gotchas, and cross-validates the whole emitter against the v2.1.88 clean TypeScript.

---

## 1. What it does

`createFindGrepShellIntegration` (`iD_`, `cli_inner_pretty.js:340964`) returns a single string of bash/zsh source code defining two shell functions, `find` and `grep`, each backed by the embedded `bfs` and `ugrep` inside the bun binary via the argv0-dispatch trick. It returns `null` when the build does not ship embedded search tools (SDK builds), in which case the snapshot omits the find/grep shadow entirely.

The whole function is small and declarative — it is just an array of four string fragments joined by newlines (`cli_inner_pretty.js:340966-340977`):

1. `unalias find 2>/dev/null || true` (`340967`)
2. `unalias grep 2>/dev/null || true` (`340968`)
3. the `find`→`bfs` wrapper produced by `xx6("find", "bfs", [...])` (`340969`)
4. the `grep`→`ugrep` wrapper produced by `xx6("grep", "ugrep", [...], [...denyPatterns])` (`340970-340975`)

Unlike the `rg` integration (`lD_`, `cli_inner_pretty.js:340957`), this shadow is **unconditional**: when embedded tools are present, `find` and `grep` are always replaced regardless of whether the user has GNU find/grep on `PATH`. The rationale is correctness, not speed — on native builds the dedicated `GlobTool`/`GrepTool` are removed from the registry, so the model reaches `bfs`/`ugrep` only through these wrappers, and the prepended flags are what align them with the semantics the dedicated tools used to provide.

The emitter's output is later wrapped into a quoted heredoc by the caller `getClaudeCodeSnapshotContent` (`aD_`, `cli_inner_pretty.js:341045`) so the definitions land verbatim inside the snapshot file:

```sh
cat >> "$SNAPSHOT_FILE" << 'FIND_GREP_FUNC_END'
unalias find 2>/dev/null || true
unalias grep 2>/dev/null || true
function find { ... }
function grep { ... }
FIND_GREP_FUNC_END
```

---

## 2. The emitter — verbatim, with the 2.1.156 change highlighted

```javascript
// ============================================
// createFindGrepShellIntegration - Emit unalias + find + grep shadow definitions
// Location: cli_inner_pretty.js:340964-340978
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
  if (!hasEmbeddedSearchTools()) return null;           // null on SDK builds
  return [
    "unalias find 2>/dev/null || true",                 // nuke a renaming alias first
    "unalias grep 2>/dev/null || true",
    // NEW in 2.1.156: "-S dfs" prepended -> bfs uses depth-first walk
    createArgv0ShellFunction("find", "bfs", ["-S", "dfs", "-regextype", "findutils-default"]),
    createArgv0ShellFunction("grep", "ugrep",
      ["-G", "--ignore-files", "--hidden", "-I",
        ...VCS_DIRECTORIES_TO_EXCLUDE.map(d => `--exclude-dir=${d}`)],
      // deny patterns: ugrep-only flags fall through to system grep (since v2.1.142)
      ["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"],
    ),
  ].join("\n");
}

// Mapping: iD_->createFindGrepShellIntegration, RL->hasEmbeddedSearchTools,
//          xx6->createArgv0ShellFunction, nD_->VCS_DIRECTORIES_TO_EXCLUDE, H->vcsDir
```

The only substantive change in the find-wrapper argument array between versions:

- v2.1.88 (`ShellSnapshot.ts:167-170`): `createArgv0ShellFunction('find', 'bfs', ['-regextype', 'findutils-default'])` — no `-S dfs`.
- v2.1.142 reference doc (`find_grep_integration.md:57`): `Iv6("find", "bfs", ["-regextype", "findutils-default"])` — no `-S dfs`.
- v2.1.156 (`cli_inner_pretty.js:340969`): `xx6("find", "bfs", ["-S", "dfs", "-regextype", "findutils-default"])` — **`-S dfs` prepended**.

The grep wrapper's flag set and deny-pattern list are byte-for-byte identical to v2.1.142 (`cli_inner_pretty.js:340973-340974` vs the v2.1.142 doc's `find_grep_integration.md:61-62`). So the find/grep delta in 2.1.156 is exactly two array elements: `"-S", "dfs"`.

---

## 3. The gate: `hasEmbeddedSearchTools` (`RL`)

```javascript
// ============================================
// hasEmbeddedSearchTools - True on native (non-SDK) builds; gates iD_
// Location: cli_inner_pretty.js:235617-235621
// ============================================

// ORIGINAL (for source lookup):
function RL() {
  if (!xH("true")) return !1;
  let H = process.env.CLAUDE_CODE_ENTRYPOINT;
  return H !== "sdk-ts" && H !== "sdk-py" && H !== "sdk-cli" && H !== "local-agent";
}

// READABLE (for understanding):
function hasEmbeddedSearchTools() {
  if (!parseExplicitTrue("true")) return false;          // literal "true" gate -> always proceeds
  const entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
  return entrypoint !== "sdk-ts"
      && entrypoint !== "sdk-py"
      && entrypoint !== "sdk-cli"
      && entrypoint !== "local-agent";
}

// Mapping: RL->hasEmbeddedSearchTools, xH->parseExplicitTrue, H->entrypoint
```

**What it does:** decides whether `bfs`/`ugrep` are statically available, which in practice reduces to "true unless we are running as an SDK or local-agent entrypoint" (`cli_inner_pretty.js:235620`).

**Why it matters here:** when `RL()` is false, `iD_` returns `null` at `cli_inner_pretty.js:340965`, the caller skips the `FIND_GREP_FUNC_END` heredoc, and the dedicated `GlobTool`/`GrepTool` remain in the registry. The same `RL()` gate is reused elsewhere — e.g. the guide-agent prompt at `cli_inner_pretty.js:235625` swaps the documented tool names to literal `find`/`grep` when `RL() && K1()` is true — confirming this gate is the single switch that flips Claude Code between "shadowed shell tools" and "dedicated tools" modes. This matches the v2.1.88 design: the clean source gates `createFindGrepShellIntegration` on `hasEmbeddedSearchTools()` (`ShellSnapshot.ts:154-156`).

---

## 4. HEADLINE 2.1.156: `-S dfs` on the find/bfs wrapper

This is the load-bearing new fact in this document. `iD_` now calls `xx6("find", "bfs", ["-S", "dfs", "-regextype", "findutils-default"])` (`cli_inner_pretty.js:340969`). Expanded, the `find` function now invokes (argv[0] = `bfs`):

```sh
$_cc_bin -S dfs -regextype findutils-default "$@"
```

### What it does

**What it does:** `-S` selects bfs's directory-traversal **strategy**; `dfs` switches it from the default breadth-first search to depth-first search. The user's own `find` arguments still follow (`"$@"`), so `find . -name '*.ts'` becomes `bfs -S dfs -regextype findutils-default . -name '*.ts'`.

### How it works (step by step)

1. bfs is a breadth-first `find` clone — *that is its headline feature.* By default (`-S bfs`) it explores the tree level-by-level: it reads all of depth-1, then all of depth-2, and so on. To do this safely without re-opening parent directories, bfs keeps an **open directory handle (a file descriptor / vnode) for every directory whose children are still pending on the frontier**.
2. On a wide and/or deep tree (e.g. a giant `node_modules`, a monorepo, or a home directory with millions of files), the breadth-first frontier can hold an enormous number of directories open *simultaneously*. The count of concurrently open directory FDs scales with the **width of the frontier**, which on real trees is unbounded for practical purposes.
3. On macOS specifically, each open directory consumes an entry in the kernel **vnode table** (and a process FD). When bfs's frontier grows large enough, it exhausts the system-wide vnode/file table. This is not a per-process limit you can raise with `ulimit` cleanly — it is a host-wide resource, and exhausting it destabilizes the whole machine, not just the `find` process (`changelog_to_code_map.md:218`: *"exhausting the macOS system file/vnode table and crashing the host on large directory trees"*).
4. `-S dfs` switches bfs to depth-first traversal. In DFS, at any instant the program only needs the chain of directories along the **current path from root to the file being examined** to be open. The number of concurrently open directory handles is therefore bounded by the **depth** of the tree, not its total size or width. Depth is small and bounded in practice (tens, not millions), so the vnode/FD footprint stays tiny.

### Why this approach

**Why this approach (rationale + alternatives):**

- **Why not raise the FD limit?** The exhaustion is of the *system-wide* macOS vnode table, not just the process's soft FD limit. Bumping `ulimit -n` in the snapshot would not fix it (and could make the host crash *worse* by letting the process consume even more vnodes before failing). Bounding concurrent handles structurally is the correct fix.
- **Why not cap bfs's frontier?** bfs's `-j` / threading and its frontier sizing are tuning knobs, but none of them give a hard, depth-bounded ceiling on open handles the way DFS does. DFS is the one strategy whose open-handle count is provably `O(depth)`.
- **Why is losing BFS acceptable?** bfs's breadth-first ordering produces nicer "shallowest matches first" output, which is bfs's whole reason to exist. But Claude Code uses `find` programmatically: the model issues `find` to *enumerate or match* files, and the result is usually piped (to `xargs`, `grep`, `head`) or fully consumed. Traversal **order** rarely matters to the model, whereas a host crash is catastrophic. The trade-off — give up bfs's signature ordering to gain a hard bound on host resource consumption — is clearly worth it for an automated tool.
- **Why prepend rather than append?** Like `-regextype`, `-S dfs` is placed *before* `"$@"` so a user/model who explicitly passes their own `-S` later still wins under bfs's last-flag-wins parsing. The injected default is a floor, not a ceiling.

### Key insight

The fix exploits a structural invariant of tree traversal: **DFS's working set is the root-to-leaf path (bounded by depth); BFS's working set is the frontier (bounded by total tree size).** bfs's entire identity is that it does the resource-heavy BFS by default; Claude Code, which cannot afford to crash a user's Mac, opts out of exactly that feature with a single two-token flag. This is why the change is so small in code (two array elements at `cli_inner_pretty.js:340969`) yet so large in impact.

### Cross-validation (confirmed NEW in 2.1.156)

- v2.1.88 clean source: `ShellSnapshot.ts:167-170` passes only `['-regextype', 'findutils-default']`. **No `-S dfs`.**
- v2.1.142 reference doc: `find_grep_integration.md:57` / `:73-76` shows `["-regextype", "findutils-default"]`. **No `-S dfs`.**
- v2.1.156 source: `cli_inner_pretty.js:340969` adds `"-S", "dfs"` as the first two array elements. The changelog row at `changelog_to_code_map.md:218` maps this exact fix to `iD_` `cli_inner_pretty.js:340964-340977` with mechanism "Pass `-S dfs` to bound open directory handles."

---

## 5. `-regextype findutils-default` on the find wrapper

**What it does:** sets bfs's `-regex`/`-iregex` dialect (`cli_inner_pretty.js:340969`). bfs defaults `-regex` to POSIX **BRE**, where `\|` is a literal pipe, not alternation. GNU `find` defaults to its "emacs" flavour, where `\|` *is* alternation. `findutils-default` makes bfs behave like GNU find.

**How it works / why it matters:** the now-removed `GlobTool` (and model-written `find` regexes) assume GNU-find semantics. Without this flag:

```sh
find . -regex '.*\.\(js\|ts\)'
```

returns **zero matches** under bfs's POSIX-BRE default, because `\|` is treated as a literal `|` character. With `-regextype findutils-default`, the alternation works and `.js`/`.ts` files match. A later user-supplied `-regextype` still overrides because it appears after ours in `"$@"` and bfs uses last-flag-wins.

**Key insight / the Oniguruma footgun:** even *with* `findutils-default`, bfs's underlying regex engine is **Oniguruma**, whose alternation is **leftmost-first** — it accepts the first alternative that matches and stops, never trying later alternatives for a longer match. POSIX and GNU find are **leftmost-longest**. So when one alternative is a prefix of another:

```sh
find . -regex '.*\.\(ts\|tsx\)'
```

bfs matches `foo.ts` but **misses `foo.tsx`** (it matches `\.ts` against the first three of `.tsx` and stops). GNU find catches both. The workaround is to order alternatives longest-first: `'.*\.\(tsx\|ts\)'`. This is a real, silent footgun and is identical to the behaviour documented in the v2.1.88 source comment (`ShellSnapshot.ts:126-129`) and the v2.1.142 doc (`find_grep_integration.md:317-326`); 2.1.156 does not change it.

---

## 6. The `grep`→`ugrep` wrapper — flag by flag

The grep wrapper is unchanged from v2.1.142. The prepended argument array is `["-G", "--ignore-files", "--hidden", "-I", ...nD_.map(d => `--exclude-dir=${d}`)]` (`cli_inner_pretty.js:340973`), where `nD_` = `[".git", ".svn", ".hg", ".bzr", ".jj", ".sl"]` (`cli_inner_pretty.js:341289`). Expanded:

```
-G --ignore-files --hidden -I --exclude-dir=.git --exclude-dir=.svn --exclude-dir=.hg --exclude-dir=.bzr --exclude-dir=.jj --exclude-dir=.sl
```

Each flag fights a specific incompatibility between ugrep's defaults and the rg-backed `GrepTool` semantics the wrapper replaces.

### `-G` — basic regex (BRE), so `\|` is alternation

**What it does:** forces ugrep into POSIX **BRE** mode. **Why:** GNU `grep` defaults to BRE where `\|` is alternation and `|` is literal; ugrep defaults to **ERE** where `|` is alternation and `\|` is a literal pipe. Without `-G`, a model-issued `grep "foo\|bar"` (GNU-grep idiom) silently returns zero matches under ugrep, because `\|` matches a literal `|` that isn't there. `-G` makes ugrep's `\|` mean alternation, matching GNU grep. **Override:** a later `-E`, `-F`, or `-P` in `"$@"` wins (last-flag-wins), so users who want ERE/fixed/Perl regex still get it. This is the grep analogue of the `-regextype findutils-default` decision on the find side: both exist to keep backslash-pipe alternation working the way GNU tools (and therefore model prompts) expect.

### `--ignore-files` — respect `.gitignore`/`.ignore`

**What it does:** makes ugrep honour `.gitignore`/`.ignore` files. **Why:** `GrepTool` used ripgrep, which respects `.gitignore` by default; plain ugrep does not. `--ignore-files` restores that posture. **Override:** `grep --no-ignore-files`.

### `--hidden` — search dotfiles

**What it does:** includes hidden files/dirs in recursion. **Why:** rg (and thus `GrepTool`) searched hidden files; ugrep's default skips them. **Override:** `grep --no-hidden`.

### `-I` — skip binary files

**What it does:** makes ugrep skip files it detects as binary. **Why:** rg, during *directory recursion*, silently skips binary matches (but searches a binary file passed explicitly as an argument). ugrep has no such asymmetry — it searches everything. `-I` aligns the recursion case with rg. **Trade-off:** the asymmetry is not perfectly reproduced — with `-I`, even an explicit binary file argument is skipped, whereas rg would search it. This is a deliberate, documented trade-off (`ShellSnapshot.ts:141-143`). **Override:** `grep -a`.

### `--exclude-dir=<vcs>` — VCS pruning from `nD_`

**What it does:** prunes each VCS metadata directory. **Why:** rg skips VCS dirs automatically (via its gitignore handling); ugrep does not, so the integration adds one `--exclude-dir=` per entry of `nD_` (`cli_inner_pretty.js:340973` mapping over `nD_`):

- `.git` (Git), `.svn` (Subversion), `.hg` (Mercurial), `.bzr` (Bazaar), `.jj` (Jujutsu), `.sl` (Sapling)

`nD_` is the same list referenced by the GrepTool-internal code, kept deliberately in sync; adding a new VCS (e.g. fossil's `.fslckout`) requires updating both. This list is byte-identical to v2.1.88's `VCS_DIRECTORIES_TO_EXCLUDE` (`ShellSnapshot.ts:98-105`).

---

## 7. The grep deny-pattern allowlist — delegating ugrep-only flags back to system grep

The 4th argument to `xx6` for grep is `["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"]` (`cli_inner_pretty.js:340974`). When `xx6` receives a non-empty deny list (`K.length > 0`), it prepends a loop to the function body that scans every positional argument and, on any match, runs the **system** command and returns — bypassing the embedded binary.

```javascript
// ============================================
// createArgv0ShellFunction (deny-pattern branch) - emit per-arg fall-through to system tool
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
  ].join(`\n`);
}

// READABLE (for understanding):
function createArgv0ShellFunction(funcName, argv0, prependArgs = [], denyPatterns = []) {
  const argSuffix = prependArgs.length > 0 ? `${prependArgs.join(" ")} "$@"` : '"$@"';
  const isWindows = getPlatform() === "windows";
  const bakedClaude = pathJoin(getInstallBinDir(), isWindows ? "claude.exe" : "claude");
  const bakedPath = isWindows ? toCygwinPath(bakedClaude) : bakedClaude;
  // deny-pattern guard: bash case-glob, OR-joined with "|"
  const denyGuard = denyPatterns.length > 0
    ? [
        "  local _cc_a",
        '  for _cc_a in "$@"; do',
        `    case "$_cc_a" in ${denyPatterns.join("|")}) command ${funcName} "$@"; return ;; esac`,
        "  done",
      ]
    : [];
  return [
    `function ${funcName} {`,
    ...denyGuard,
    `  local _cc_bin="\${CLAUDE_CODE_EXECPATH:-}"`,
    `  [[ -x $_cc_bin ]] || _cc_bin=${quote([bakedPath])}`,
    `  if [[ ! -x $_cc_bin ]]; then command ${funcName} "$@"; return; fi`,
    "  if [[ -n $ZSH_VERSION ]]; then",
    `    ARGV0=${argv0} "$_cc_bin" ${argSuffix}`,
    /* ...win/bash-subshell branches identical... */
    "  fi",
    "}",
  ].join("\n");
}

// Mapping: xx6->createArgv0ShellFunction, H->funcName, $->argv0, q->prependArgs, K->denyPatterns,
//          _->argSuffix, z->isWindows, A->bakedClaude, Y->bakedPath, f->denyGuard,
//          mx6->CLAUDE_CODE_EXECPATH, O4->quote, n$->getPlatform, cW->toCygwinPath, L6H->getInstallBinDir
```

The generated grep guard reads:

```sh
function grep {
  local _cc_a
  for _cc_a in "$@"; do
    case "$_cc_a" in -*-filter*|-*-pager*|-*-view*|-*-format-open*|-*-config*|---*|-@*|-*-save-config*) command grep "$@"; return ;; esac
  done
  # ...argv0 dispatch into embedded ugrep...
}
```

**What it does:** if any argument is a ugrep-only flag, the wrapper delegates to the user's system `grep` (via the `command` builtin) instead of routing through embedded ugrep.

**How it works (step by step):**
1. Loop over every positional argument with `for _cc_a in "$@"` — quoted expansion keeps args with spaces intact.
2. Test each arg with a bash `case` glob, OR-joined by `|` from `denyPatterns.join("|")` (`cli_inner_pretty.js:340934` template).
3. On any match, run `command grep "$@"` and `return` immediately — skipping the embedded-binary path entirely.

The patterns are bash **case-globs**, not regex. Each begins with `-`, so positional patterns/files that merely contain `-filter` etc. do not trigger: `grep "filter line" README` does not match `-*-filter*` because the token does not start with `-`. The covered ugrep-only flags and why they fall through:

- `-*-filter*` → `--filter=CMD` (pipe files through a converter; no GNU grep counterpart)
- `-*-pager*` → `--pager` (page output; no GNU counterpart)
- `-*-view*` → `--view` (open matches in an editor)
- `-*-format-open*` → `--format`/`--format-open` (ugrep formatting DSL)
- `-*-config*` and `-*-save-config*` → `--config`/`--save-config` (ugrep config files)
- `---*` → triple-dash ugrep meta flags
- `-@*` → `-@FILE` (ugrep reads patterns from FILE; GNU's equivalent is `-f FILE`)

**Why this approach (rationale + alternatives):** when a caller passes a ugrep-only flag, the wrapper has two choices — route to embedded ugrep (permissive) or delegate to system grep (transparent). Routing would make `grep` silently accept a flag real GNU grep rejects, so the same command later fails outside Claude Code — a confusing, hard-to-debug UX surprise. Delegating makes the wrapper act as if it isn't there for these flags: the user sees the system grep's "unrecognized option" error, exactly what they'd see without the snapshot, and can then explicitly run `ugrep --filter=...` (ugrep is not shadowed). A naive substring check (`[[ " $* " == *" --filter "* ]]`) was rejected because regex patterns or quoted args containing `--filter` as a substring would false-positive; only the per-arg `case "$_cc_a" in -*...*)` form correctly distinguishes a leading-dash flag from a positional pattern/file. **Why find has no deny list:** `xx6("find", "bfs", [...])` passes only three positional args and no `K` (`cli_inner_pretty.js:340969`), so `f` is empty and no guard is emitted — bfs is a much closer GNU-find drop-in than ugrep is to GNU grep, and its extra flags are additive and find-like, so none are surprising enough to delegate.

**Key insight:** the deny list is an allowlist-by-exclusion that keeps the wrapper *transparent for ugrep-specific behaviour* while staying *compatible for GNU-grep behaviour*. The caller never gets a silent confusing mix: either embedded ugrep (with the injected GNU-aligning flags) or system grep (with honest errors).

---

## 8. The two `unalias` lines — why they come first

```sh
unalias find 2>/dev/null || true     # cli_inner_pretty.js:340967
unalias grep 2>/dev/null || true     # cli_inner_pretty.js:340968
```

**What it does / why it's load-bearing:** bash and zsh resolve **aliases before function lookup**. The snapshot captures and replays the user's aliases earlier in the file (in `getUserSnapshotContent`, `oD_`). A macOS Homebrew user commonly has `alias find=gfind` / `alias grep=ggrep`. Without clearing those, the replayed alias would expand `find`→`gfind` *before* the shell ever considers our `find` function, silently bypassing the embedded `bfs`/`ugrep` dispatch. The `unalias ... 2>/dev/null || true` is defensive: if no such alias exists, `unalias` errors to stderr and exits non-zero, and both are swallowed. This is identical to v2.1.88 (`ShellSnapshot.ts:165-166`).

---

## 9. The full emitted output (native build, example)

For a native build, `createFindGrepShellIntegration()` returns the following (the only diff from v2.1.142 is the bolded `-S dfs` on every find branch):

```sh
unalias find 2>/dev/null || true
unalias grep 2>/dev/null || true
function find {
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin='/home/alice/.local/bin/claude'
  if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi
  if [[ -n $ZSH_VERSION ]]; then
    ARGV0=bfs "$_cc_bin" -S dfs -regextype findutils-default "$@"
  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    ARGV0=bfs "$_cc_bin" -S dfs -regextype findutils-default "$@"
  elif [[ $BASHPID != $$ ]]; then
    exec -a bfs "$_cc_bin" -S dfs -regextype findutils-default "$@"
  else
    (exec -a bfs "$_cc_bin" -S dfs -regextype findutils-default "$@")
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

(`-S dfs` appears in all four find branches because `xx6` inlines the same `argSuffix` string into each shell-dialect branch — `cli_inner_pretty.js:340945-340951`.)

---

## 10. Edge cases (including the new `-S dfs` interaction)

- **`find . -S bfs -name '*.txt'`** — user re-requests breadth-first. bfs receives `-S dfs -regextype findutils-default -S bfs -name *.txt`; last `-S` wins, so the user gets BFS back. The injected `-S dfs` is a default, not a lock. The same applies to a user-supplied `-regextype`.
- **`find --help`** — bfs receives `-S dfs -regextype findutils-default --help`; bfs short-circuits on `--help` and prints its own help before any traversal, so `-S dfs` is harmless here.
- **`grep --filter=cat README`** — `--filter=cat` matches `-*-filter*`; wrapper runs `command grep "$@"`; system grep errors with "unrecognized option `--filter=cat`". Intended transparent-failure UX.
- **`grep -P 'lookahead' file`** — no deny pattern matches; ugrep receives `-G ... -P lookahead`; `-P` after `-G` wins (last-flag-wins), Perl regex active. The injected `-G` did not get in the way.
- **`grep -@ patterns.txt`** — matches `-@*`; delegates to system grep (which has no `-@`). The user wanting ugrep's `-@` invokes `ugrep -@ ...` directly (ugrep isn't shadowed).
- **`find . -type f | xargs grep -l 'foo'`** — both shadows fire in subshells (pipe context), taking the `exec -a` bash-subshell branch; process count matches running raw `bfs`/`ugrep`. No deny pattern matches grep, so it routes through ugrep.
- **`$CLAUDE_CODE_EXECPATH` unset and baked path missing** — function falls back to `command find "$@"` / `command grep "$@"` (system tools). Graceful degradation; covered in `argv0_dispatch.md`.

---

## 11. Cross-version summary for `iD_`

| Aspect | v2.1.88 (`ShellSnapshot.ts`) | v2.1.142 (ref doc) | v2.1.156 (`cli_inner_pretty.js`) |
|---|---|---|---|
| find prepend args | `['-regextype','findutils-default']` (`:167-170`) | `["-regextype","findutils-default"]` (`:57`) | **`["-S","dfs","-regextype","findutils-default"]`** (`340969`) |
| `-S dfs` present? | No | No | **Yes (NEW)** |
| grep prepend args | `-G --ignore-files --hidden -I --exclude-dir=...` (`:171-177`) | same (`:61`) | same (`340973`) |
| grep deny patterns | absent | present (`:62`) | present, identical (`340974`) |
| VCS list | `.git .svn .hg .bzr .jj .sl` (`:98-105`) | same (`:18`) | `nD_` same (`341289`) |
| gate | `hasEmbeddedSearchTools()` (`:154`) | `dM` | `RL` (`340965` / `235617`) |

Everything except the two `"-S","dfs"` tokens is unchanged across v2.1.142→v2.1.156, and the grep half is unchanged all the way back to v2.1.142. The single, surgical 2.1.156 delta is the macOS vnode-exhaustion fix.

---

## 12. Key insights

1. **`-S dfs` is a two-token host-stability fix with an outsized effect.** It bounds bfs's concurrent open directory handles from `O(tree size)` (BFS frontier) to `O(tree depth)` (DFS path), eliminating macOS vnode-table exhaustion on large trees (`cli_inner_pretty.js:340969`; `changelog_to_code_map.md:218`). bfs's signature breadth-first ordering is deliberately discarded because traversal order rarely matters to an automated caller, while a host crash is catastrophic.
2. **Every prepended flag fights a specific default mismatch.** `-S dfs` (resource bound), `-regextype findutils-default` (bfs POSIX-BRE → GNU emacs flavour), `-G` (ugrep ERE → GNU BRE so `\|` is alternation), `--ignore-files`/`--hidden` (rg's gitignore-respecting, hidden-included posture), `-I` (rg's silent binary skip on recursion), `--exclude-dir=` (rg's automatic VCS pruning). Strip any one and the shadow stops matching what `GlobTool`/`GrepTool` provided.
3. **The deny-pattern dispatch keeps the wrapper transparent.** ugrep-only flags fall through to system grep so the user gets honest errors instead of behaviour that silently breaks once the snapshot is gone. find has no such list because bfs is a far closer GNU drop-in.
4. **The Oniguruma leftmost-first alternation gotcha persists** in 2.1.156 — `\(ts\|tsx\)` misses `.tsx`; order alternatives longest-first. `-S dfs` does not touch regex semantics, so this footgun is orthogonal and unchanged.
5. **`unalias find/grep` is essential** — alias-before-function resolution would otherwise let a replayed `alias find=gfind` silently bypass the embedded dispatch.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions

Key functions in this document:
- `createFindGrepShellIntegration` (`iD_`) — emits `unalias find/grep` + find→bfs + grep→ugrep shadow definitions; returns `null` on SDK builds (`cli_inner_pretty.js:340964-340978`)
- `createArgv0ShellFunction` (`xx6`) — shared argv0-dispatch template; emits the per-arg deny-pattern fall-through when a deny list is supplied (`cli_inner_pretty.js:340924-340956`)
- `hasEmbeddedSearchTools` (`RL`) — gate; true on native (non-SDK) builds (`cli_inner_pretty.js:235617-235621`)
- `createRipgrepShellIntegration` (`lD_`) — sibling rg integration, conditional shadow (`cli_inner_pretty.js:340957`)
- `VCS_DIRECTORIES_TO_EXCLUDE` (`nD_`) — `[".git", ".svn", ".hg", ".bzr", ".jj", ".sl"]` (`cli_inner_pretty.js:341289`)
- `CLAUDE_CODE_EXECPATH` (`mx6`) — env name used to resolve the embedded binary (`cli_inner_pretty.js:341166`)
