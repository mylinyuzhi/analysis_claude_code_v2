# Shell Integrations Overview (v2.1.112)

> How Claude Code v2.1.112 generates shell-script snippets that expose `rg`, `find`, and `grep` inside every `Bash` tool invocation, and why the `argv0` dispatch trick is the load-bearing primitive that makes all three work.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_07.md](../00_overview/symbol_additions_unit_07.md) - All shell-integration symbols introduced/changed in this analysis
> - [symbol_index.md](../00_overview/symbol_index.md) - General v2.1.112 symbol map

Key functions in this document:
- `createArgv0ShellFunction` (`U47`) - Emits the cross-shell function template that sets `argv[0]` before invoking a binary
- `createRipgrepShellIntegration` (`o_Y`) - Picks `rg` strategy: alias to system binary OR argv0-dispatch function over the embedded ripgrep
- `createFindGrepShellIntegration` (`s_Y`) - Shadows `find`/`grep` with argv0-dispatched calls into the embedded `bfs`/`ugrep`
- `ripgrepCommand` (`wj6`) - Resolves which ripgrep to use (system / vendored / bun-embedded)
- `hasEmbeddedSearchTools` (`$H`) - Build-time gate for find/grep shadowing
- `getClaudeCodeSnapshotContent` (`qzY`) - Stitches the three integrations into the final snapshot script

---

## 1. Why these three integrations exist

Every Bash tool invocation in Claude Code runs in a fresh shell process. To give Claude reliable, fast, and consistent versions of three high-traffic commands, the snapshot generator emits:

| Command | Goal | Implementation strategy |
|---------|------|-------------------------|
| `rg` | Always available, always fast | Skip if a system `rg` is already on PATH; otherwise emit an alias (vendored binary) or a function (bun-embedded binary, dispatched via argv0) |
| `find` | Same recursive-glob semantics as `GlobTool`, GNU-compatible regex | **Always** shadow with a function that runs the embedded `bfs` (drop-in `find` clone with gitignore-aware extensions) |
| `grep` | Same file-filtering semantics as `GrepTool`, GNU BRE syntax by default | **Always** shadow with a function that runs the embedded `ugrep` |

The `rg` case is a **fallback** — Claude won't fight a user's system ripgrep if one is installed.
The `find`/`grep` cases are **unconditional** — when embedded search tools ship with the build (`hasEmbeddedSearchTools()` returns true), the shadows always win because `bfs`/`ugrep` are drop-in replacements that match the tool's expected semantics far more closely than vanilla GNU `find`/`grep` do.

### Why shadow `find`/`grep` instead of using the dedicated `GlobTool`/`GrepTool`?

In ant-native builds (the ones with embedded `bfs`/`ugrep`), `GlobTool` and `GrepTool` are **removed from the tool registry**. The model is expected to use `Bash` with `find` / `grep` instead. Shadowing in shell rather than emitting dedicated tools:
- Saves two tool-definition slots in the model's context (smaller prompt).
- Lets composed shell pipelines (`find ... -exec grep ...`) just work without the model serialising to tool calls.
- Preserves a single execution path for permission gates: every external command goes through `Bash`, which already has hooks and a permission system.

The trade-off: the wrappers must reproduce the *exact* filtering behaviour of `GlobTool`/`GrepTool` to avoid surprising the model. That's why the find/grep snippets inject `-regextype findutils-default`, `--ignore-files`, `--hidden`, `-I`, and the VCS-directory exclusion list — see `find_grep_integration.md`.

---

## 2. The argv0 trick: shared primitive

All three integrations call `createArgv0ShellFunction` (`U47`) at code-generation time. This helper emits the body of a shell function that, when later sourced and invoked, runs **a single binary** but tells that binary *which embedded tool to be* via `argv[0]`.

This is the **clever bit**: the Claude Code distribution ships a single `bun` binary that statically links `rg`, `bfs`, and `ugrep`. Inside the binary, there's a dispatcher that looks at `argv[0]` (the conventional name a process is invoked under) and runs the matching tool. So:

```text
process started with argv[0]="rg"   -> bun runs ripgrep
process started with argv[0]="bfs"  -> bun runs bfs (find clone)
process started with argv[0]="ugrep" -> bun runs ugrep (grep clone)
```

In a shell, the only ways to set `argv[0]` portably are:
- **bash**: `exec -a NAME binary args...` (replaces the current shell process with `binary`, but sets `argv[0]=NAME`).
- **zsh**: `ARGV0=NAME binary args...` (zsh-specific env-var; zsh's exec respects it).
- **Windows git-bash / mintty (msys/cygwin)**: `exec -a` is broken; zsh's `ARGV0` convention also works for the bun binary, which reads `$ARGV0` itself on these platforms.

`createArgv0ShellFunction` picks the right form for each platform inside a single shell function body. See `argv0_dispatch.md` for the deep dive.

The function generator is parameterised by:
1. **`funcName`** — the visible alias the function will define (`rg`, `find`, or `grep`).
2. **`argv0`** — what to claim `argv[0]` is, picking which embedded tool runs (`rg`, `bfs`, `ugrep`).
3. **`prependArgs`** — flags injected before the user's `"$@"`, used to coerce tool defaults to match Claude's expected semantics.

The path to the binary is *not* a parameter in v2.1.112 (this is a v2.1.88 → v2.1.112 change). Instead it's resolved at function-invocation time from `$CLAUDE_CODE_EXECPATH` (set by the parent Claude process) with a `command -v claude` fallback.

---

## 3. Build-time vs run-time control flow

```text
[ build time ]
   ant-native bundler embeds bfs+ugrep+rg into bun binary via Bun.embeddedFiles
   sets EMBEDDED_SEARCH_TOOLS=1

[ Claude Code startup ]
   detectShell() -> /bin/zsh (etc.)
   createBashExecutor() -> createAndSaveSnapshot() -> getSnapshotScript() -> getClaudeCodeSnapshotContent()
      |
      +-- createRipgrepShellIntegration() -- chooses alias vs argv0 function
      +-- createFindGrepShellIntegration() -- emits argv0 functions if hasEmbeddedSearchTools()
      +-- writes everything to ~/.claude/shell-snapshots/snapshot-{shell}-{ts}-{rand}.sh

[ every Bash tool call ]
   shell -c "source snapshot.sh && ... && eval <cmd> && pwd >| cwd-file"
                  |
                  +-- the snapshot's emitted rg/find/grep functions are now in scope
                  |
                  +-- when the model runs `find . -name '*.ts'`:
                       1. user's `find` alias (if any) is unaliased earlier in the snapshot
                       2. our `find` function fires
                       3. it execs the bun binary with argv0=bfs, prepended args -regextype findutils-default
                       4. bun's argv[0] dispatcher routes to bfs
                       5. bfs runs with GNU-find-compatible regex flavour
```

The wrappers replace `find`/`grep` *before* the user's shell loads any user aliases that might redirect them (e.g. `alias find=gfind`). The unalias step inside `createFindGrepShellIntegration` and the early `unalias rg` check in `getClaudeCodeSnapshotContent` ensure user customisations don't silently bypass the embedded dispatch.

---

## 4. Why the three integrations share `createArgv0ShellFunction` but split into separate generators

You might ask: if all three need the same argv0 dispatch, why three separate functions?

**Each has a different gating condition and different prepended-flags set:**

| Integration | Gate | Prepended flags |
|-------------|------|-----------------|
| `rg` | only if no system `rg` AND `ripgrepCommand().argv0` is set | none (rg has no compat flags needed) |
| `find` | only if `hasEmbeddedSearchTools()` | `-regextype findutils-default` |
| `grep` | only if `hasEmbeddedSearchTools()` | `-G --ignore-files --hidden -I --exclude-dir=.git --exclude-dir=.svn --exclude-dir=.hg --exclude-dir=.bzr --exclude-dir=.jj --exclude-dir=.sl` |

Beyond flags, the **shape of the output differs**:
- `createRipgrepShellIntegration` returns `{ type: "alias" | "function", snippet: string }` — the snapshot script's emitter handles those two cases with different surrounding shell (heredoc vs. simple alias line).
- `createFindGrepShellIntegration` returns a single concatenated string of two `unalias` lines plus two function definitions, or `null` if not applicable.
- `createBqShellIntegration` (`t_Y`) is a stub that always returns `null` in this build — likely a placeholder for a `bq` (BigQuery CLI) integration in a future or alternative build.

Each generator owns its discovery / config logic locally; they share only the *template* via `createArgv0ShellFunction`.

---

## 5. Failure modes & safety nets

### 5.1 User aliases that shadow find/grep/rg

Users on macOS often run `alias find=gfind` or `alias grep=ggrep` from Homebrew GNU coreutils. The snapshot file, when sourced, runs in this order:

1. `unalias -a 2>/dev/null || true` — wipes whatever aliases the parent shell already had (so they don't get frozen inside replayed function definitions).
2. The user's captured aliases are re-emitted with `alias -- name=value` lines, so user aliases are now back in scope.
3. The find/grep injection block runs:
   ```sh
   unalias find 2>/dev/null || true
   unalias grep 2>/dev/null || true
   function find { ... }
   function grep { ... }
   ```
   The targeted `unalias` defeats any user `alias find=gfind`-style entry that step 2 reinstated. This is the critical defensive step — without it, bash's alias-then-function lookup order would silently bypass our function.

For `rg`, the same defence is folded into the gate: `if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then ...`. The `(unalias ...)` runs in a subshell so it doesn't permanently delete the user's `rg` alias — it only hides it for the `command -v rg` check.

### 5.2 Missing claude binary at run-time

The emitted argv0 function resolves the binary lazily:

```sh
local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
[[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)
if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi
```

If neither the env var nor `command -v claude` resolves an executable, the function falls back to `command find "$@"` (i.e. the system find), which preserves user productivity at the cost of consistency. This is a **graceful-degradation** design — different to the v2.1.88 behaviour where a stale binary path would just fail hard.

### 5.3 ant-native is unavailable

`hasEmbeddedSearchTools()` returns false when:
- `EMBEDDED_SEARCH_TOOLS` env var is not set/truthy, OR
- `CLAUDE_CODE_ENTRYPOINT` is `sdk-ts` / `sdk-py` / `sdk-cli` / `local-agent` (these are SDK entrypoints where shell isolation matters more than tool consistency).

In all those cases, `createFindGrepShellIntegration()` returns `null` and the snapshot omits the shadows entirely. The shell uses system `find` / `grep`. `GlobTool` and `GrepTool` are also re-added to the tool registry in those builds.

---

## 6. Snapshot composition (where these integrations land)

Inside `getClaudeCodeSnapshotContent()` (`qzY`, chunks.144.mjs:1898-1955), the integrations are stitched into the snapshot file in this order:

```text
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  cat >> "$SNAPSHOT_FILE" << 'RIPGREP_FUNC_END'
  <output of createRipgrepShellIntegration()>
RIPGREP_FUNC_END
fi

# Shadow find/grep with embedded bfs/ugrep
cat >> "$SNAPSHOT_FILE" << 'FIND_GREP_FUNC_END'
<output of createFindGrepShellIntegration()>      <-- may be empty
FIND_GREP_FUNC_END

# Add PATH to the file
export PATH=<quoted-current-PATH>
```

The use of **literal heredoc delimiters** (`'RIPGREP_FUNC_END'`, `'FIND_GREP_FUNC_END'`, single-quoted) is important: it disables shell expansion inside the body, so `"$@"`, `${ZSH_VERSION}`, etc., are written to the snapshot file *literally* — they will be expanded later, when the function is invoked, not now.

---

## 7. Cross-version diff summary (v2.1.88 → v2.1.112)

| Aspect | v2.1.88 | v2.1.112 | Why |
|--------|---------|----------|-----|
| Binary path baked into function | yes (`createArgv0ShellFunction` took `binaryPath` arg) | no (resolved at call time from `$CLAUDE_CODE_EXECPATH`) | Snapshots become path-portable; binary can be moved between snapshot generation and use |
| Graceful fallback to system `find` | none (would error if binary missing) | `if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi` | Reliability if env var unset and `claude` not on PATH |
| VCS exclusion list | 6 entries (`.git .svn .hg .bzr .jj .sl`) | 6 entries (same) | unchanged — `.jj`/`.sl` were already in v2.1.88; v2.1.76 had only 4 |
| `bq` integration hook | not present | stub (`t_Y`) returns null | Forward-compat hook for BigQuery shadowing |

See `argv0_dispatch.md` Section 6 for the path-portability rationale in detail.

---

## 8. Going deeper

- **`argv0_dispatch.md`** — Step-by-step deobfuscation of `createArgv0ShellFunction`, branch-by-branch analysis of the bash/zsh/Windows logic, and the v2.1.88 → v2.1.112 path-resolution refactor.
- **`ripgrep_integration.md`** — `createRipgrepShellIntegration`: how it picks alias vs. function, `ripgrepCommand` resolution, why `rg` is gated by `command -v rg`.
- **`find_grep_integration.md`** — `createFindGrepShellIntegration`: every prepended flag explained against the matching `GlobTool`/`GrepTool` invocation, the Oniguruma alternation gotcha, the `--max-columns` omission.
