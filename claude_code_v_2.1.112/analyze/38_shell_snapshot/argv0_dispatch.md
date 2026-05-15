# `createArgv0ShellFunction` — argv[0] Dispatch (v2.1.112)

> Deep deobfuscation of the shell-function generator that lets a single bun binary impersonate `rg`, `bfs`, and `ugrep` at run-time using a portable `argv[0]` trick across bash, zsh, and Windows git-bash.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_07.md](../00_overview/symbol_additions_unit_07.md) - Shell-integration symbols introduced in this unit

Key functions in this document:
- `createArgv0ShellFunction` (`U47`) - Emits the cross-shell argv0-dispatch function body
- `getEnvironmentOverrides` callsite that sets `CLAUDE_CODE_EXECPATH` - chunks.144.mjs:2201

Constants referenced:
- `CLAUDE_CODE_EXECPATH_ENV` (`d47`) - `"CLAUDE_CODE_EXECPATH"`, the env var name (chunks.144.mjs:1990)
- `LITERAL_BACKSLASH` (`p47`) - `"\\"`, used elsewhere in the snapshot generator (chunks.144.mjs:1986)

---

## 1. What it does

`createArgv0ShellFunction` returns a string containing the body of a shell function. When that function is later sourced into a shell and invoked as `name args...`, the function spawns the Claude binary (`$CLAUDE_CODE_EXECPATH` or `claude` on PATH) with `argv[0]` set to a chosen tool name and optional prepended args.

The point of setting `argv[0]` is that the Claude bun binary is a multi-tool dispatcher: it inspects its own `argv[0]` and routes to the embedded `rg`, `bfs`, or `ugrep` implementation accordingly. So one binary can be three tools depending on how it was invoked — this is the same trick `busybox`, `git`, and `multi-call` GNU coreutils use, just at the shell-function layer.

**The big picture:**
```text
shell: invoke `find . -name '*.ts'`
   |
   v
function find { ... }  <-- emitted by createArgv0ShellFunction("find", "bfs", ["-regextype","findutils-default"])
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
// Location: chunks.144.mjs:1810-1814
// ============================================

// ORIGINAL (for source lookup):
function U47(q, K, _ = []) { let z = _.length > 0 ? `${_.join(" ")} "$@"` : '"$@"'; return [`function ${q} {`, `  local _cc_bin="\${${d47}:-}"`, "  [[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)", `  if [[ ! -x $_cc_bin ]]; then command ${q} "$@"; return; fi`, "  if [[ -n $ZSH_VERSION ]]; then", `    ARGV0=${K} "$_cc_bin" ${z}`, '  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then', `    ARGV0=${K} "$_cc_bin" ${z}`, "  elif [[ $BASHPID != $$ ]]; then", `    exec -a ${K} "$_cc_bin" ${z}`, "  else", `    (exec -a ${K} "$_cc_bin" ${z})`, "  fi", "}"].join("\n") }

// READABLE (for understanding):
function createArgv0ShellFunction(funcName, argv0, prependArgs = []) {
  const argSuffix = prependArgs.length > 0
    ? `${prependArgs.join(" ")} "$@"`
    : `"$@"`;
  return [
    `function ${funcName} {`,
    `  local _cc_bin="\${${CLAUDE_CODE_EXECPATH_ENV}:-}"`,
    `  [[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)`,
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

// Mapping: U47->createArgv0ShellFunction, q->funcName, K->argv0, _->prependArgs, z->argSuffix, d47->CLAUDE_CODE_EXECPATH_ENV
```

The corresponding TypeScript in v2.1.88 (`/lyz/codespace/3rd/claude-code/src/utils/bash/ShellSnapshot.ts:35`) is:

```typescript
function createArgv0ShellFunction(
  funcName: string,
  argv0: string,
  binaryPath: string,        // <-- removed in v2.1.112
  prependArgs: string[] = [],
): string {
  const quotedPath = quote([binaryPath])
  const argSuffix =
    prependArgs.length > 0 ? `${prependArgs.join(' ')} "$@"` : '"$@"'
  return [
    `function ${funcName} {`,
    '  if [[ -n $ZSH_VERSION ]]; then',
    `    ARGV0=${argv0} ${quotedPath} ${argSuffix}`,
    '  elif [[ "$OSTYPE" == "msys" ]] || ...',
    `    ARGV0=${argv0} ${quotedPath} ${argSuffix}`,
    '  elif [[ $BASHPID != $$ ]]; then',
    `    exec -a ${argv0} ${quotedPath} ${argSuffix}`,
    '  else',
    `    (exec -a ${argv0} ${quotedPath} ${argSuffix})`,
    '  fi',
    '}',
  ].join('\n')
}
```

The two are structurally identical except for **how the binary path is resolved** (see Section 6).

---

## 3. The emitted function — example

If you call `createArgv0ShellFunction("rg", "rg", [])` you get:

```bash
function rg {
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)
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

`createArgv0ShellFunction("find", "bfs", ["-regextype", "findutils-default"])`:

```bash
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
```

---

## 4. Branch-by-branch analysis (the load-bearing logic)

The function body is a four-way if/elif chain. Order matters — each branch only fires when the prior ones do not match. Understanding why each branch exists requires understanding `argv[0]` in POSIX shells.

### 4.1 Branch 0 — binary resolution + safety fallback

```bash
local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
[[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)
if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi
```

- `${CLAUDE_CODE_EXECPATH:-}`: read the env var, default to empty if unset.
- `[[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)`: if the env-var-pointed file isn't executable (or empty), fall back to looking up `claude` on PATH.
- `if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi`: if *both* fail, fall through to the user's system `find`/`grep`/`rg` via the `command` builtin (which bypasses functions/aliases).

The `command` builtin is the right choice for the fallback — `find "$@"` inside the `find` function would recursively call itself.

**Why this matters:** v2.1.88 hard-coded the path during snapshot generation. If the binary moved or was deleted between snapshot creation and execution, the function would `exec` a non-existent path and the shell would exit with an error. v2.1.112's late resolution recovers gracefully.

### 4.2 Branch 1 — zsh

```bash
if [[ -n $ZSH_VERSION ]]; then
  ARGV0=bfs "$_cc_bin" -regextype findutils-default "$@"
```

`$ZSH_VERSION` is set by zsh; absent in bash. The `ARGV0=NAME command args...` form is a **zsh-specific feature**: when zsh execs a command and sees `ARGV0` in its environment, it sets `argv[0]` of the new process to that value.

This works *without* `exec` because zsh natively honours the convention. The function returns normally (no process replacement). Importantly, this means **the wrapper function persists** across multiple `rg` calls in the same shell — `exec` would replace the shell, terminating the session.

### 4.3 Branch 2 — Windows (git-bash / mintty / cygwin)

```bash
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
  ARGV0=bfs "$_cc_bin" -regextype findutils-default "$@"
```

On Windows, the bash shell that ships with Git for Windows (mintty) and Cygwin **does not respect `exec -a`** correctly — the kernel call to set argv[0] doesn't have a clean Windows mapping, and bash's emulation fails silently.

So on Windows, we use the same `ARGV0=...` form as zsh. The bun runtime is aware of this and reads `$ARGV0` from its own environment if `argv[0]` ended up being the binary path instead of the intended tool name. This is bun's own escape hatch — see the comment in the v2.1.88 source:

> On Windows (git bash), exec -a does not work, so use ARGV0 env var instead. The bun binary reads from ARGV0 natively to set argv[0]

### 4.4 Branch 3 — bash in a subshell

```bash
elif [[ $BASHPID != $$ ]]; then
  exec -a bfs "$_cc_bin" -regextype findutils-default "$@"
```

`$BASHPID` is bash's PID of the current subshell.
`$$` is the PID of the original interactive shell.
If they differ, we're inside a subshell — meaning the function was called from `$(rg ...)`, `(rg ...)`, or as part of a pipeline.

In a subshell, `exec` is **safe**: it replaces the subshell, not the user's main shell. After `exec`, the subshell becomes the bun process; when bun exits the subshell terminates. The parent shell is unaffected.

This is the **fast path** for the common case: `find . -name '*.ts' | xargs grep something` — both `find` and `grep` are subshells, both can `exec` directly without spawning extra processes.

### 4.5 Branch 4 — bash in the main shell

```bash
else
  (exec -a bfs "$_cc_bin" -regextype findutils-default "$@")
```

If we got here, we're in bash and `$BASHPID == $$` — meaning the function is being invoked directly from the user's interactive shell or top-level script. Using bare `exec` here would replace the user's shell entirely with the bun process. When bun exits, the user is logged out.

The fix: wrap in `(...)` to force a subshell, then `exec` inside that subshell. The cost is one extra `fork()` compared to `exec`-in-subshell case, but it preserves the parent shell.

**Why bash needs this and zsh doesn't:** zsh's `ARGV0=...` form is a built-in env-var convention, not an exec. So the parent shell process forks normally to spawn the binary — no special handling needed. Bash has no equivalent built-in argv[0]-setting syntax other than `exec -a`, which always replaces the calling shell.

---

## 5. Why `argSuffix` is built once

```javascript
const argSuffix = prependArgs.length > 0
  ? `${prependArgs.join(" ")} "$@"`
  : `"$@"`;
```

Two reasons:

1. **Repeated four times in the output** — once per branch. Centralising into `argSuffix` avoids divergence between branches (which would break find/grep in mysterious ways depending on shell).
2. **The empty-args optimisation matters for `rg`** — when called with no prepended flags, the function emits `"$@"` alone, not `" \"$@\""` with a leading space (which is harmless but ugly).

`prependArgs` is interpolated **unquoted** (no `quote([prependArgs])`). The TypeScript source's JSDoc explicitly calls this out:

> Injected literally; each element must be a valid shell word (no spaces/special chars).

This is a deliberate restriction. The caller is expected to pass already-safe shell tokens (`-G`, `--ignore-files`, `--exclude-dir=.git`). Quoting them would change semantics — `-G` as a single quoted token would still work, but `--exclude-dir=.git` as a quoted token could be parsed differently depending on shell quote-handling rules.

---

## 6. Path resolution — the v2.1.88 → v2.1.112 refactor

**v2.1.88 (before):**
```javascript
function createArgv0ShellFunction(funcName, argv0, binaryPath, prependArgs = []) {
  const quotedPath = quote([binaryPath])   // <-- baked in here
  return [
    `function ${funcName} {`,
    '  if [[ -n $ZSH_VERSION ]]; then',
    `    ARGV0=${argv0} ${quotedPath} ${argSuffix}`,
    ...
```

The shell-quoted absolute path is interpolated into the function body at *generation* time. Once the snapshot is written, the path is frozen.

**v2.1.112 (after):**
```javascript
function createArgv0ShellFunction(funcName, argv0, prependArgs = []) {
  // no binaryPath argument
  return [
    `function ${funcName} {`,
    `  local _cc_bin="\${${CLAUDE_CODE_EXECPATH_ENV}:-}"`,
    `  [[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)`,
    `  if [[ ! -x $_cc_bin ]]; then command ${funcName} "$@"; return; fi`,
    `  if [[ -n $ZSH_VERSION ]]; then`,
    `    ARGV0=${argv0} "$_cc_bin" ${argSuffix}`,
    ...
```

The path is resolved every time the function runs. Two new behaviours:
- The env var `$CLAUDE_CODE_EXECPATH` is checked first. Claude Code sets this on every Bash tool invocation (see chunks.144.mjs:2201 in `getEnvironmentOverrides`: `H[d47] = process.execPath`). So in the normal case it's a single env-var read.
- If that's unset/stale, fall back to `command -v claude` on PATH.
- If both fail, run the system `find` / `grep` / `rg`.

### Why was this change made?

Three reasons inferable from the diff:

1. **Snapshot portability across binary updates.** Claude Code auto-updates can move the bun binary. Without this change, every snapshot would have to be regenerated after every update — adding ~300 ms latency on the first command after upgrade. With the late binding, an existing snapshot still works as long as `claude` is on PATH or `CLAUDE_CODE_EXECPATH` is set.

2. **Cross-installation portability.** A user with multiple Claude installs (e.g. CI vs. local) can share a snapshot; the binary picked is whichever happens to be on PATH at that moment.

3. **Failure-mode robustness.** The fallback to system find/grep means that even a broken Claude install doesn't break the user's shell session inside a `Bash` tool call — they just lose the embedded-tool acceleration.

The cost: every invocation of `find`/`grep`/`rg` now pays one env-var read + one `[[ -x ... ]]` test. The `command -v claude` cost is only paid when the env var is unset (rare). In practice this is sub-millisecond, dwarfed by the bun binary startup.

**Key insight:** This refactor moves binary-path resolution from **generation time** to **invocation time**, trading a tiny per-call lookup cost for *significantly* more robust snapshot semantics across binary moves/updates. The trade-off matches the broader v2.1.x trend of making Claude Code's runtime artefacts more resilient to interruption.

---

## 7. Why three branches handle bash separately

Reviewing branches 3 and 4 together:

| Context | What `exec -a` does | What we want | Fix |
|---------|--------------------|--------------|-----|
| Bash subshell (`$()`, `(...)`, pipeline) | Replaces subshell with bun | Replace subshell with bun (zero-overhead chain) | bare `exec -a` |
| Bash main shell | Replaces user's shell with bun → session terminates | Spawn bun as a child | wrap in `(exec -a ...)` |

The `(exec -a ...)` form: the outer `(...)` forks a subshell. Inside the subshell, `exec -a` replaces *that subshell* with bun. Net effect: the bun process runs as a child of the original shell, just like a normal command invocation, but with the correct `argv[0]`.

You might wonder: why not just always use `(exec -a ...)`? The answer is performance. In a pipeline like `find ... | grep ...`, each command already runs in its own subshell. Using `(exec -a ...)` would fork *another* layer, doubling process count for no benefit. The branch-3-vs-4 split optimises the common pipeline case.

zsh and Windows don't need this gymnastics because their `ARGV0=` form is a non-replacing variable assignment followed by a normal command run — the shell just forks-and-execs naturally, with `argv[0]` set by the bun runtime reading `$ARGV0`.

---

## 8. The `command find "$@"` fallback — design choice

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

## 9. Observing the dispatch

After Claude Code generates a snapshot, you can inspect it directly:

```bash
$ cat ~/.claude/shell-snapshots/snapshot-bash-*-*.sh | grep -A 20 'function find'
function find {
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)
  if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi
  ...
}
```

To confirm `argv[0]` is set as intended, run the shadow in the background and check `ps`:

```bash
$ source ~/.claude/shell-snapshots/snapshot-bash-*-*.sh
$ find /tmp -name '*.txt' &
$ ps -o pid,args -p $!
   PID ARGS
 12345 bfs /tmp -name *.txt        <-- argv[0] is "bfs", not the bun path
```

Without `-regextype findutils-default`, a regex like `find . -regex '.*\.\(js\|ts\)'` returns zero results under bfs (POSIX BRE default treats `\|` as literal). With it, GNU-find-compatible alternation works.

---

## 10. Key insights

1. **The function emits four shell branches** because each platform/context has a different correct way to set `argv[0]`. There is no single one-liner that works portably across bash main shell, bash subshell, zsh, and Windows git-bash.

2. **The bash main-shell case is the most subtle** — bare `exec -a` would kill the user's session, so the subshell wrapper `(exec -a ...)` is essential. This is the bug that would bite anyone reimplementing this naively.

3. **Late binary resolution** (v2.1.112) is the most consequential change from v2.1.88: it makes snapshots survive Claude binary updates and cross-installation reuse, at a sub-microsecond per-call cost.

4. **The `command <name> "$@"` graceful fallback** trades behavioural consistency for availability. The model isn't told when fallback fires; this is a deliberate design choice favouring "Claude keeps working" over "Claude always uses embedded tools".

5. **`prependArgs` is interpolated unquoted** — the generator assumes the caller passes shell-safe tokens. This isn't a bug; it's a contract that lets the generator stay simple while letting `createFindGrepShellIntegration` express `--exclude-dir=.git` as a single token.

6. **All three integrations** (`rg`, `find`, `grep`) share this primitive but differ in their prepended-args, their gating conditions, and the surrounding heredoc wrapping in the snapshot file. The shared template means a bug fix here automatically improves all three.

---

## 11. Cross-reference

For how this primitive is actually invoked:
- `ripgrep_integration.md` — `createRipgrepShellIntegration` call site
- `find_grep_integration.md` — `createFindGrepShellIntegration` call sites and prepended-flags rationale

For where `CLAUDE_CODE_EXECPATH` is set in the parent process:
- chunks.144.mjs:2201 — `H[d47] = process.execPath` inside `getEnvironmentOverrides`
