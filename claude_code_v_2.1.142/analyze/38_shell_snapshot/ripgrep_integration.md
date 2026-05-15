# `createRipgrepShellIntegration` — Ripgrep Snapshot Integration (v2.1.142)

> How Claude Code v2.1.142 generates the `rg` shell snippet that gets sourced into every Bash tool invocation. Picks between a thin alias (system rg) and a full argv0-dispatch function (embedded ripgrep inside bun).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Shell-integration symbols

Key functions in this document:
- `createRipgrepShellIntegration` (`Ki_`) — Decides alias vs. function form
- `ripgrepCommand` (`aGH`) — Resolves which ripgrep binary to use
- `getRipgrepConfig` (`$Y$`) — Memoised config: `system` / `builtin` / `embedded`
- `findExecutable` (`FA6`) — PATH lookup helper
- `which` (`Fx`) — exec-path existence test (memoised)
- `isInBundledMode` (`JY`) — Detects if running from a Bun-compiled binary
- `createArgv0ShellFunction` (`Iv6`) — Shared template (covered in [argv0_dispatch.md](./argv0_dispatch.md))
- `getClaudeCodeSnapshotContent` (`fi_`) — The caller that wraps this output in heredoc

Constants referenced:
- `SNAPSHOT_CREATION_TIMEOUT` (`hv6`) — Used elsewhere by the snapshot driver

---

## 1. What it does

Returns an object `{ type, snippet }` that tells the snapshot script generator how to emit the `rg` integration:

- `type === "function"` → wrap the snippet in a `cat << 'RIPGREP_FUNC_END' ... RIPGREP_FUNC_END` heredoc; the snippet is a multi-line bash/zsh function body produced by `createArgv0ShellFunction`.
- `type === "alias"` → write a single line `alias rg='<snippet>'`; the snippet is the literal path (and any compile-time flags) to a standalone `rg` executable.

The decision hinges on whether `ripgrepCommand().argv0` is set, which is true exactly when ripgrep is embedded inside the bun binary (native builds).

---

## 2. The actual code

```javascript
// ============================================
// createRipgrepShellIntegration - Pick alias vs argv0-function for rg
// Location: cli_inner_pretty.js:360509-360515
// ============================================

// ORIGINAL (for source lookup):
function Ki_() {
  let H = aGH();
  if (H.argv0) return { type: "function", snippet: Iv6("rg", H.argv0) };
  let $ = W4([H.rgPath]),
    q = H.rgArgs.map((_) => W4([_]));
  return { type: "alias", snippet: H.rgArgs.length > 0 ? `${$} ${q.join(" ")}` : $ };
}

// READABLE (for understanding):
function createRipgrepShellIntegration() {
  const rgCommand = ripgrepCommand();             // { rgPath, rgArgs, argv0? }
  if (rgCommand.argv0) {
    return {
      type: "function",
      snippet: createArgv0ShellFunction("rg", rgCommand.argv0),
    };
  }
  const quotedPath = shellQuote([rgCommand.rgPath]);
  const quotedArgs = rgCommand.rgArgs.map(arg => shellQuote([arg]));
  return {
    type: "alias",
    snippet: rgCommand.rgArgs.length > 0
      ? `${quotedPath} ${quotedArgs.join(" ")}`
      : quotedPath,
  };
}

// Mapping: Ki_→createRipgrepShellIntegration, aGH→ripgrepCommand, Iv6→createArgv0ShellFunction,
//          W4→shellQuote, H→rgCommand, $→quotedPath, q→quotedArgs
```

The v2.1.112 equivalent (`o_Y`) had the same control flow. The differences are all in the `Iv6`/`createArgv0ShellFunction` template that the function-mode call uses — see [argv0_dispatch.md](./argv0_dispatch.md).

---

## 3. How `ripgrepCommand` decides which rg to use

`ripgrepCommand` is a thin wrapper that returns the memoised `getRipgrepConfig`:

```javascript
// ============================================
// ripgrepCommand - Public accessor returning the resolved ripgrep config
// Location: cli_inner_pretty.js:197760-197763
// ============================================

// ORIGINAL (for source lookup):
function aGH() {
  let H = $Y$();
  return { rgPath: H.command, rgArgs: H.args, argv0: H.argv0 };
}

// READABLE (for understanding):
function ripgrepCommand() {
  const config = getRipgrepConfig();
  return { rgPath: config.command, rgArgs: config.args, argv0: config.argv0 };
}

// Mapping: aGH→ripgrepCommand, $Y$→getRipgrepConfig, H→config
```

`getRipgrepConfig` (`$Y$`) is memoised and runs three checks in order:

```javascript
// ============================================
// getRipgrepConfig - Choose system rg / embedded bun rg / vendored rg binary
// Location: cli_inner_pretty.js:197969-197983
// ============================================

// ORIGINAL (for source lookup):
$Y$ = L8(() => {
  if (E4(process.env.USE_BUILTIN_RIPGREP)) {
    let { cmd: K } = FA6("rg", []);
    if (K !== "rg") return { mode: "system", command: K, args: [] };
  }
  if (JY()) {
    let K = { mode: "embedded", command: process.execPath, args: ["--no-config"], argv0: "rg" };
    if (Fx(process.execPath)) return K;
    let { cmd: _ } = FA6("rg", []);
    if (_ !== "rg") return { mode: "system", command: _, args: [] };
    return K;
  }
  let $ = oGH.resolve(Es1, "vendor", "ripgrep");
  return { mode: "builtin", command: oGH.resolve($, "x64-linux", "rg"), args: [] };
});

// READABLE (for understanding):
const getRipgrepConfig = memoize(() => {
  // 1. If user explicitly opted out of builtin (USE_BUILTIN_RIPGREP=0/false),
  //    prefer system rg if present on PATH.
  if (isEnvDefinedFalsy(process.env.USE_BUILTIN_RIPGREP)) {
    const { cmd: systemPath } = findExecutable("rg", []);
    if (systemPath !== "rg") {
      // findExecutable returns the input string unchanged on failure,
      // so `systemPath !== "rg"` means: a real rg was resolved on PATH.
      return { mode: "system", command: systemPath, args: [] };
    }
  }
  // 2. If running from a bun-compiled standalone binary, use argv0 dispatch.
  if (isInBundledMode()) {
    const embedded = {
      mode: "embedded",
      command: process.execPath,    // path to our bun binary
      args: ["--no-config"],         // ripgrep flag: ignore ~/.ripgreprc
      argv0: "rg",                   // bun dispatcher routes by argv[0]
    };
    // Verify our own execPath is accessible (handles edge cases like dev-mode
    // where process.execPath might not exist on disk).
    if (which(process.execPath)) return embedded;
    // Our binary not resolvable; try system rg as fallback
    const { cmd: systemFallback } = findExecutable("rg", []);
    if (systemFallback !== "rg") {
      return { mode: "system", command: systemFallback, args: [] };
    }
    return embedded;
  }
  // 3. Use the vendored binary that ships in <package>/vendor/ripgrep/...
  const vendorRoot = path.resolve(packageRoot, "vendor", "ripgrep");
  return {
    mode: "builtin",
    command: path.resolve(vendorRoot, "x64-linux", "rg"),
    args: [],
  };
});

// Mapping: $Y$→getRipgrepConfig, E4→isEnvDefinedFalsy, FA6→findExecutable,
//          JY→isInBundledMode, Fx→which, oGH→path, Es1→packageRoot, L8→memoize
```

### The three modes recap

| Mode | When | What `ripgrepCommand` returns |
|------|------|--------------------------------|
| `system` | User opted out of builtin AND system has `rg` on PATH | `{ rgPath: <resolved-path>, rgArgs: [], argv0: undefined }` |
| `embedded` | Default in native builds | `{ rgPath: process.execPath, rgArgs: ["--no-config"], argv0: "rg" }` |
| `builtin` | Distribution bundles a vendored rg binary (e.g. npm install) | `{ rgPath: <vendor/.../rg>, rgArgs: [], argv0: undefined }` |

Note: `argv0` is **only** populated in the `embedded` mode. That's the exact signal `createRipgrepShellIntegration` checks.

---

## 4. Output examples

### 4.1 Function form (embedded ripgrep)

When `ripgrepCommand()` returns `{ rgPath: "/usr/local/bin/claude", rgArgs: ["--no-config"], argv0: "rg" }`:

`createRipgrepShellIntegration()` returns:

```javascript
{
  type: "function",
  snippet: `function rg {
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
}`
}
```

Notice: `--no-config` from `rgArgs` is **not** in the emitted function. The integration calls `createArgv0ShellFunction("rg", H.argv0)` with no `prependArgs`, so the function forwards `"$@"` straight through. `rgArgs` is metadata for **Node-side** spawning via `spawn(rgPath, [...rgArgs, ...userArgs])` — irrelevant to the shell wrapper. The user invoking `rg` from the shell gets their `~/.ripgreprc` (which they may or may not have); the **Node-side** uses of ripgrep (e.g., for indexing) get the deterministic `--no-config` version. Two contexts, two configs.

This invariant is the same in v2.1.88, v2.1.112, and v2.1.142.

### 4.2 Alias form (vendored rg binary)

When `ripgrepCommand()` returns `{ rgPath: "/.../vendor/ripgrep/x64-linux/rg", rgArgs: [], argv0: undefined }`:

```javascript
{
  type: "alias",
  snippet: "'/.../vendor/ripgrep/x64-linux/rg'",   // shell-quoted path
}
```

The snapshot generator wraps this:

```bash
echo '  alias rg='"'/.../vendor/ripgrep/x64-linux/rg'" >> "$SNAPSHOT_FILE"
```

Which evaluated produces in the snapshot:

```bash
  alias rg='/.../vendor/ripgrep/x64-linux/rg'
```

### 4.3 Alias form with extra args (rare)

If `rgArgs` were `["--no-config"]` in alias mode (this combination doesn't actually happen for vendored rg, but the code handles it):

```javascript
{
  type: "alias",
  snippet: "'/.../rg' '--no-config'",
}
```

Each arg is shell-quoted separately via `shellQuote([arg])`, then joined with spaces. This ensures arguments containing special characters survive being embedded into the alias definition.

---

## 5. How it wires into the snapshot

In `getClaudeCodeSnapshotContent` (`fi_`, cli_inner_pretty.js:360597-360660):

```javascript
const rgIntegration = createRipgrepShellIntegration();
let content = "";
content += `
      # Check for rg availability
      echo "# Check for rg availability" >> "$SNAPSHOT_FILE"
      echo "if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
`;
if (rgIntegration.type === "function") {
  content += `
      cat >> "$SNAPSHOT_FILE" << 'RIPGREP_FUNC_END'
  ${rgIntegration.snippet}
RIPGREP_FUNC_END
    `;
} else {
  const escapedSnippet = rgIntegration.snippet.replaceAll("'", "'\\''");
  content += `
      echo '  alias rg='"'${escapedSnippet}'" >> "$SNAPSHOT_FILE"
    `;
}
content += `
      echo "fi" >> "$SNAPSHOT_FILE"
`;
```

The generated `$SNAPSHOT_FILE` ends up containing:

**Embedded (function) case:**
```bash
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  function rg {
    local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
    ...
  }
fi
```

**Vendored (alias) case:**
```bash
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  alias rg='/.../vendor/ripgrep/x64-linux/rg'
fi
```

The `unalias rg 2>/dev/null; command -v rg` in the `if` condition is a **subshell-isolated check**. The `()` create a subshell, so any `unalias` runs there and doesn't affect the parent. `command -v rg` then tests whether a real `rg` binary is on PATH.

### Why the conditional `if ! command -v rg`?

The `rg` integration is **opt-in** to override the user's system `rg`. If the user has system ripgrep installed, that takes priority and Claude Code's snippet is a no-op (the function/alias is never defined).

This is intentionally different from the `find`/`grep` integration, which always shadows. Why?
- **`rg` is opt-installed** — users who have system `rg` chose to install it (it's not on most systems by default). They may rely on their own `~/.ripgreprc`, custom flags, or a specific version.
- **`find`/`grep` are universal** — every Unix has them. Replacing them with `bfs`/`ugrep` is a transparent upgrade and the user is unlikely to depend on version-specific quirks.

---

## 6. Edge cases

### 6.1 User has rg alias defined in their .zshrc

The user's `.zshrc` might contain `alias rg='rg --smart-case'`. The snapshot captures this alias and replays it. Then the `if ! command -v rg` check runs *after* aliases have been replayed.

The subshell `(unalias rg 2>/dev/null; command -v rg)` is crucial: it strips the alias before `command -v` runs, ensuring `command -v rg` sees only the real binary (if any). Without the unalias, an alias would always satisfy `command -v`, and our injection would never fire — even when there's no real `rg` binary.

### 6.2 `USE_BUILTIN_RIPGREP=0` and no system rg

Walk through `getRipgrepConfig`:
1. `USE_BUILTIN_RIPGREP=0` is defined-falsy → enter check.
2. `findExecutable("rg", [])` returns `{ cmd: "rg" }` (no path found).
3. The `if (systemPath !== "rg")` check fails — we fall through.
4. `isInBundledMode()` is checked. If true → return embedded config.
5. Otherwise return `builtin` (vendored).

The user's explicit opt-out is honoured only when a system rg actually exists.

### 6.3 Windows special-casing

`getRipgrepConfig` uses `process.arch` and `process.platform` to pick the vendored binary path. (The simplified `x64-linux` in the deobfuscation above is for clarity — the actual code uses platform-detected paths.)

The argv0 function form doesn't need a Windows variant — it handles Windows in the function body via `$OSTYPE == "msys"` etc.

### 6.4 `process.execPath` not resolvable by `which` (`Fx`)

In v2.1.142's embedded-tools branch, `Fx(process.execPath)` is checked before returning the embedded config. This is a defensive existence check — if the execPath isn't accessible (rare, e.g. dev-mode quirks), `getRipgrepConfig` falls through to `findExecutable("rg", [])`. If system rg is available it's used; otherwise the embedded config is returned anyway as a last resort.

### 6.5 The `which` (`Fx`) cache invalidation hook

```javascript
// cli_inner_pretty.js:197932-197934
function hgK() {
  if (($Y$.cache?.clear?.(), VUH?.working !== !1)) (ygK.cache?.clear?.(), (VUH = null));
}
```

When ripgrep itself encounters an ENOENT during execution (e.g., the binary was deleted), this clears the memoised `getRipgrepConfig` and the `which` cache, so the next `ripgrepCommand()` call re-resolves from scratch. This is the **v2.1.121 fix for the broader pattern**: any embedded binary that becomes unresolvable mid-session triggers cache invalidation so subsequent calls can fall back gracefully.

---

## 7. Why not always use the function form?

You could uniformly emit `function rg { /usr/bin/rg "$@"; }`. Why not?

- **No `argv[0]` need.** With a real, separate `rg` binary on PATH or in `vendor/`, `argv[0]` is set correctly by `execve` naturally. The four-branch function template only earns its keep when `argv[0]` dispatch is required.
- **Alias is simpler to inspect.** `type rg` shows `rg: aliased to '/.../rg'` — direct and obvious to a user reading the snapshot. A function body is harder to skim.
- **Less shell code in the snapshot.** Alias is one line; the function template is fourteen-plus.

So the alias path is the simpler default; the function path is reserved for the embedded-binary case where it's genuinely needed.

---

## 8. v2.1.112 → v2.1.142 diff for this file

| Change | v2.1.112 | v2.1.142 |
|--------|---------|----------|
| `createArgv0ShellFunction` signature | 3 args | 4 args (adds `denyPatterns`) |
| Call site for rg | `Iv6("rg", H.argv0)` (2 args, omits prependArgs and denyPatterns) | Same — rg has no prepended args or deny patterns |
| Binary resolution in emitted function | env var → `command -v claude` | env var → baked install path → system tool fallback |
| Behaviour | Identical for fresh snapshots; v2.1.112 vulnerable to PATH-hijack on fallback | Snapshot survives binary moves; baked path prevents PATH-hijack |
| Mode-decision logic in `getRipgrepConfig` | Same three modes, same priority | Same |

---

## 9. Key insights

1. **The alias/function split is decided by a single flag** (`argv0`): present → function (embedded dispatch needed), absent → alias (no dispatch needed). The rest of the logic flows from that.

2. **The `if ! command -v rg` gate** makes the entire rg integration **opt-in** for users without system rg. This is the *opposite* design from `find`/`grep`, which always shadow. The reason is user-experience: `rg` users likely have specific tastes; `find`/`grep` users typically don't care.

3. **The subshell `(unalias rg; command -v rg)` in the gate** is essential to defeat user `alias rg='rg --smart-case'`-style customisations from masking the binary check. Without it, every user with an rg alias would never get the embedded-rg injection.

4. **`--no-config` is in `rgArgs` for Node-side spawning, but is NOT prepended into the shell function**. The Node side wants a deterministic, config-free rg for tool semantics; the shell wants user-friendly rg that respects local config.

5. **Baked install path** (v2.1.142) extends the same robustness gains to ripgrep that it gives to find/grep — snapshots survive Claude binary updates AND avoid PATH-hijack risk.

6. **No deny-pattern dispatch for rg** — even in v2.1.142. The wrapper is a thin pass-through to ripgrep-the-tool; there's no GNU-rg variant the user might be expecting, so no flag is "surprising" if it routes through.

---

## 10. Cross-reference

- [argv0_dispatch.md](./argv0_dispatch.md) — full breakdown of the shell function template emitted in the `type: "function"` case
- [find_grep_integration.md](./find_grep_integration.md) — sibling integration that always shadows (unlike rg's opt-in behaviour) and uses the v2.1.142 deny-pattern feature
- [shell_integrations.md](./shell_integrations.md) — overview of how all three integrations land in the snapshot file
