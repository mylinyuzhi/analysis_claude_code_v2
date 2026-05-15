# Shell Integrations Overview (v2.1.142)

> How Claude Code v2.1.142 generates shell-script snippets that expose `rg`, `find`, and `grep` inside every `Bash` tool invocation, and why the `argv0` dispatch trick is the load-bearing primitive that makes all three work. v2.1.142 makes embedded `bfs`/`ugrep` unconditional on native builds and adds a deny-pattern dispatch that protects user UX for ugrep-only flags.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Shell-integration symbols

Key functions in this document:
- `createArgv0ShellFunction` (`Iv6`) — Emits the cross-shell function template that sets `argv[0]` before invoking a binary
- `createRipgrepShellIntegration` (`Ki_`) — Picks `rg` strategy: alias to system binary OR argv0-dispatch function over the embedded ripgrep
- `createFindGrepShellIntegration` (`Ai_`) — Shadows `find`/`grep` with argv0-dispatched calls into the embedded `bfs`/`ugrep`
- `createBigQueryShellIntegration` (`zi_`) — Always returns null in v2.1.142; preserved as forward-compat hook
- `ripgrepCommand` (`aGH`) — Resolves which ripgrep to use (system / vendored / bun-embedded)
- `hasEmbeddedSearchTools` (`dM`) — Build-time gate for find/grep shadowing
- `getClaudeCodeSnapshotContent` (`fi_`) — Stitches the three integrations into the final snapshot script

---

## 1. Why these three integrations exist

Every Bash tool invocation in Claude Code runs in a fresh shell process. To give Claude reliable, fast, and consistent versions of three high-traffic commands, the snapshot generator emits:

| Command | Goal | Implementation strategy |
|---------|------|-------------------------|
| `rg` | Always available, always fast | Skip if a system `rg` is already on PATH; otherwise emit an alias (vendored binary) or a function (bun-embedded binary, dispatched via argv0) |
| `find` | Same recursive-glob semantics as `GlobTool`, GNU-compatible regex | **Always** shadow with a function that runs the embedded `bfs` (drop-in `find` clone with gitignore-aware extensions) |
| `grep` | Same file-filtering semantics as `GrepTool`, GNU BRE syntax by default | **Always** shadow with a function that runs the embedded `ugrep`; v2.1.142 also adds a deny-pattern that lets ugrep-only flags fall through to system grep |

The `rg` case is a **fallback** — Claude won't fight a user's system ripgrep if one is installed.
The `find`/`grep` cases are **unconditional on native macOS/Linux builds** (and now always so in v2.1.142 — see Section 5).

### Why shadow `find`/`grep` instead of using the dedicated `GlobTool`/`GrepTool`?

This was the v2.1.117 changelog item that made the shift permanent: "Native builds on macOS and Linux: the `Glob` and `Grep` tools are replaced by embedded `bfs` and `ugrep` available through the Bash tool — faster searches without a separate tool round-trip (Windows and npm-installed builds unchanged)".

In native builds (the ones with embedded `bfs`/`ugrep`), `GlobTool` and `GrepTool` are **removed from the tool registry**. The model is expected to use `Bash` with `find` / `grep` instead. Shadowing in shell rather than emitting dedicated tools:
- Saves two tool-definition slots in the model's context (smaller prompt).
- Lets composed shell pipelines (`find ... -exec grep ...`) just work without the model serialising to tool calls.
- Preserves a single execution path for permission gates: every external command goes through `Bash`, which already has hooks and a permission system.

The trade-off: the wrappers must reproduce the *exact* filtering behaviour of `GlobTool`/`GrepTool` to avoid surprising the model. That's why the find/grep snippets inject `-regextype findutils-default`, `--ignore-files`, `--hidden`, `-I`, and the VCS-directory exclusion list — see [find_grep_integration.md](./find_grep_integration.md).

---

## 2. The argv0 trick: shared primitive

All three integrations call `createArgv0ShellFunction` (`Iv6`) at code-generation time. This helper emits the body of a shell function that, when later sourced and invoked, runs **a single binary** but tells that binary *which embedded tool to be* via `argv[0]`.

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

`createArgv0ShellFunction` picks the right form for each platform inside a single shell function body. See [argv0_dispatch.md](./argv0_dispatch.md) for the deep dive.

The function generator is parameterised by **four** things in v2.1.142 (one more than in v2.1.112):
1. **`funcName`** — the visible alias the function will define (`rg`, `find`, or `grep`).
2. **`argv0`** — what to claim `argv[0]` is, picking which embedded tool runs (`rg`, `bfs`, `ugrep`).
3. **`prependArgs`** — flags injected before the user's `"$@"`, used to coerce tool defaults to match Claude's expected semantics.
4. **`denyPatterns`** — NEW v2.1.142: glob patterns; if any user arg matches, dispatch to system tool instead of embedded.

The path to the binary is *not* a parameter — it's resolved at function-invocation time from `$CLAUDE_CODE_EXECPATH` (set by the parent Claude process), then a baked install path (`~/.local/bin/claude`), then a system-tool fallback. See [argv0_dispatch.md](./argv0_dispatch.md) Section 5.

---

## 3. Build-time vs run-time control flow

```text
[ build time ]
   ant-native bundler embeds bfs+ugrep+rg into bun binary via Bun.embeddedFiles

[ Claude Code startup ]
   detectShell() -> /bin/zsh (etc.)
   createBashShellProvider() -> createAndSaveSnapshot() -> getSnapshotScript() -> getClaudeCodeSnapshotContent()
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

**Each has a different gating condition, different prepended flags, and (NEW v2.1.142) different deny patterns:**

| Integration | Gate | Prepended flags | Deny patterns |
|-------------|------|-----------------|---------------|
| `rg` | only if no system `rg` AND `ripgrepCommand().argv0` is set | none | none |
| `find` | only if `hasEmbeddedSearchTools()` | `-regextype findutils-default` | none |
| `grep` | only if `hasEmbeddedSearchTools()` | `-G --ignore-files --hidden -I --exclude-dir=.git --exclude-dir=.svn --exclude-dir=.hg --exclude-dir=.bzr --exclude-dir=.jj --exclude-dir=.sl` | `-*-filter* -*-pager* -*-view* -*-format-open* -*-config* ---* -@* -*-save-config*` |

Beyond flags, the **shape of the output differs**:
- `createRipgrepShellIntegration` returns `{ type: "alias" | "function", snippet: string }` — the snapshot script's emitter handles those two cases with different surrounding shell (heredoc vs. simple alias line).
- `createFindGrepShellIntegration` returns a single concatenated string of two `unalias` lines plus two function definitions, or `null` if not applicable.
- `createBigQueryShellIntegration` (`zi_`) is a stub that always returns `null` in this build — reserved for a Google-BQ integration not enabled in OSS.

Each generator owns its discovery / config logic locally; they share only the *template* via `createArgv0ShellFunction`.

---

## 5. The `hasEmbeddedSearchTools` simplification (v2.1.117)

```javascript
// ============================================
// hasEmbeddedSearchTools - Gate for find/grep shadowing
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
  // v2.1.117 simplification: removed EMBEDDED_SEARCH_TOOLS env var gate.
  // bH("true") always returns true (string "true" matches truthy list).
  // The function now reduces to: are we NOT in an SDK entrypoint?
  if (!parseExplicitTrue("true")) return false;       // always false → skipped
  const entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
  return entrypoint !== "sdk-ts"
      && entrypoint !== "sdk-py"
      && entrypoint !== "sdk-cli"
      && entrypoint !== "local-agent";
}

// Mapping: dM→hasEmbeddedSearchTools, bH→parseExplicitTrue, H→entrypoint
```

The function's logic has been **inverted** since v2.1.112:

| Version | First check | Effect |
|---------|-------------|--------|
| v2.1.112 | `parseExplicitTrue(process.env.EMBEDDED_SEARCH_TOOLS)` | Skip embedded tools unless build sets the env var |
| v2.1.142 | `parseExplicitTrue("true")` (literal) | Always proceed to entrypoint check |

The literal `bH("true")` always returns `true` (because the string `"true"` matches the truthy list `["1", "true", "yes", "on"]`). So in v2.1.142, the env-var gate is effectively removed — **all native builds have embedded search tools enabled**. Only the SDK entrypoint check still applies.

**Why keep the literal?** It's dead code that documents intent. The function shape `bH(?) → check entrypoint` was kept for symmetry with other configuration checks; the input was just hardcoded to `"true"`. A future opt-out flag could reintroduce a real env-var read at this spot without restructuring the function.

The SDK exclusion (`sdk-ts`/`sdk-py`/`sdk-cli`/`local-agent`) remains. SDK consumers run Claude Code as an embedded library, where the host wants deterministic shell behaviour over Claude's tool consistency.

When `hasEmbeddedSearchTools()` returns false, `createFindGrepShellIntegration()` returns `null` and the snapshot omits the `FIND_GREP_FUNC_END` heredoc entirely. Concomitantly, `GlobTool` and `GrepTool` are re-added to the tool registry — the model gets dedicated tools instead of shadowed shell commands.

---

## 6. Failure modes & safety nets

### 6.1 User aliases that shadow find/grep/rg

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

### 6.2 Missing claude binary at run-time — v2.1.121 fix

The emitted argv0 function resolves the binary lazily:

```sh
local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
[[ -x $_cc_bin ]] || _cc_bin='/home/alice/.local/bin/claude'
if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi
```

If neither the env var nor the baked install path resolves an executable, the function falls back to `command find "$@"` (i.e. the system find), which preserves user productivity at the cost of consistency. This is a **graceful-degradation** design — and it implements the v2.1.121 changelog item: "Fixed embedded grep/find/rg shell wrappers failing when the running binary is deleted mid-session — now falls back to installed tools".

**Concrete scenario the fix protects against:**
- Session starts with `CLAUDE_CODE_EXECPATH=/tmp/installer/claude` (the path used by an in-place upgrade).
- User runs `brew upgrade claude` mid-session; the old binary at `/tmp/installer/claude` is unlinked.
- Next Bash tool call has `$CLAUDE_CODE_EXECPATH` pointing at a deleted file → `[[ -x ]]` fails.
- Function tries baked path `~/.local/bin/claude` → succeeds (the new install is here).
- If the user installed somewhere else, that path also fails → falls through to `command grep "$@"`.

The fallback chain means a broken Claude install doesn't break the user's shell session inside a `Bash` tool call — they just lose the embedded-tool acceleration.

### 6.3 SDK build is unavailable

`hasEmbeddedSearchTools()` still returns false when `CLAUDE_CODE_ENTRYPOINT` is `sdk-ts` / `sdk-py` / `sdk-cli` / `local-agent`. In all those cases, `createFindGrepShellIntegration()` returns `null` and the snapshot omits the shadows entirely. The shell uses system `find` / `grep`. `GlobTool` and `GrepTool` are also re-added to the tool registry in those builds.

### 6.4 NEW v2.1.142: Deny-pattern dispatch protects ugrep-specific flag UX

When the user passes a ugrep-specific flag to `grep`, the wrapper falls through to system grep:

```sh
function grep {
  local _cc_a
  for _cc_a in "$@"; do
    case "$_cc_a" in -*-filter*|-*-pager*|-*-view*|-*-format-open*|-*-config*|---*|-@*|-*-save-config*) command grep "$@"; return ;; esac
  done
  ...
}
```

See [find_grep_integration.md](./find_grep_integration.md) Section 4 for the full rationale.

---

## 7. Snapshot composition (where these integrations land)

Inside `getClaudeCodeSnapshotContent` (`fi_`, cli_inner_pretty.js:360597-360660), the integrations are stitched into the snapshot file in this order:

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

# Shadow bq (dead code path; createBigQueryShellIntegration always returns null)

# Add PATH to the file
export PATH=<quoted-current-PATH>
```

The use of **literal heredoc delimiters** (`'RIPGREP_FUNC_END'`, `'FIND_GREP_FUNC_END'`, single-quoted) is important: it disables shell expansion inside the body, so `"$@"`, `${ZSH_VERSION}`, etc., are written to the snapshot file *literally* — they will be expanded later, when the function is invoked, not now.

---

## 8. Cross-version diff summary

### v2.1.88 → v2.1.112 → v2.1.142 evolution

| Aspect | v2.1.88 | v2.1.112 | v2.1.142 | Why |
|--------|---------|----------|----------|-----|
| Binary path baked into function | yes (passed to `Iv6` as 3rd arg) | no (resolved via env var → `command -v claude`) | yes (baked install path; env var as primary) | Snapshot stays portable AND avoids PATH-hijack risk |
| Graceful fallback to system tool | none (would error) | `command find "$@"` | `command find "$@"` (chained after baked path) | Same v2.1.121 fix applied |
| `hasEmbeddedSearchTools` env-var gate | `EMBEDDED_SEARCH_TOOLS=1` required | Same | Removed (always true on non-SDK) | Embedded tools shipped on native builds since v2.1.117 |
| Deny-pattern dispatch | none | none | `for _cc_a in "$@"; do case ... ;; done` | UX safety: ugrep-only flags don't silently route through wrapper |
| VCS exclusion list | 4 entries | 6 entries (added `.jj`, `.sl`) | 6 entries (same) | unchanged |
| `bq` integration hook | not present | stub returning null | stub returning null | Forward-compat hook for BigQuery |
| `Iv6` arity | 4 params (incl. binaryPath) | 3 params | 4 params (added denyPatterns) | UX safety |

See [argv0_dispatch.md](./argv0_dispatch.md) Section 5 for the path-portability rationale in detail.

---

## 9. Going deeper

- **[argv0_dispatch.md](./argv0_dispatch.md)** — Step-by-step deobfuscation of `createArgv0ShellFunction`, branch-by-branch analysis of the bash/zsh/Windows logic, the v2.1.112 → v2.1.142 path-resolution refactor, and the NEW deny-pattern dispatcher.
- **[ripgrep_integration.md](./ripgrep_integration.md)** — `createRipgrepShellIntegration`: how it picks alias vs. function, `ripgrepCommand` resolution, why `rg` is gated by `command -v rg`.
- **[find_grep_integration.md](./find_grep_integration.md)** — `createFindGrepShellIntegration`: every prepended flag explained against the matching `GlobTool`/`GrepTool` invocation, the Oniguruma alternation gotcha, the `--max-columns` omission, the deny-pattern rationale.
- **[embedded_search_tools.md](./embedded_search_tools.md)** — How v2.1.117 removed `Glob`/`Grep` from the tool registry on native builds, with the v2.1.121 binary-deletion fallback.
