# `createRipgrepShellIntegration` — Ripgrep Snapshot Integration (v2.1.112)

> How Claude Code v2.1.112 generates the `rg` shell snippet that gets sourced into every Bash tool invocation. Picks between a thin alias (system rg) and a full argv0-dispatch function (embedded ripgrep inside bun).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_07.md](../00_overview/symbol_additions_unit_07.md) - Shell-integration symbols introduced in this unit

Key functions in this document:
- `createRipgrepShellIntegration` (`o_Y`) - Decides alias vs. function form
- `ripgrepCommand` (`wj6`) - Resolves which ripgrep binary to use
- `getRipgrepConfig` (`ts6`) - Memoised config: `system` / `builtin` / `embedded`
- `findExecutable` (`Jp1`) - PATH lookup helper
- `createArgv0ShellFunction` (`U47`) - Shared template (covered in `argv0_dispatch.md`)
- `getClaudeCodeSnapshotContent` (`qzY`) - The caller that wraps this output in heredoc

Constants referenced:
- `SNAPSHOT_CREATION_TIMEOUT` (`g47`) - Used elsewhere by the snapshot driver

---

## 1. What it does

Returns an object `{ type, snippet }` that tells the snapshot script generator how to emit the `rg` integration:

- `type === "function"` → wrap the snippet in a `cat << 'RIPGREP_FUNC_END' ... RIPGREP_FUNC_END` heredoc; the snippet is a multi-line bash/zsh function body produced by `createArgv0ShellFunction`.
- `type === "alias"` → write a single line `alias rg='<snippet>'`; the snippet is the literal path (and any compile-time flags) to a standalone `rg` executable.

The decision hinges on whether `ripgrepCommand().argv0` is set, which is true exactly when ripgrep is embedded inside the bun binary (ant-native builds).

---

## 2. The actual code

```javascript
// ============================================
// createRipgrepShellIntegration - Pick alias vs argv0-function for rg
// Location: chunks.144.mjs:1816-1828
// ============================================

// ORIGINAL (for source lookup):
function o_Y() { let q = wj6(); if (q.argv0) return { type: "function", snippet: U47("rg", q.argv0) }; let K = A5([q.rgPath]), _ = q.rgArgs.map((Y) => A5([Y])); return { type: "alias", snippet: q.rgArgs.length > 0 ? `${K} ${_.join(" ")}` : K } }

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

// Mapping: o_Y->createRipgrepShellIntegration, wj6->ripgrepCommand, U47->createArgv0ShellFunction, A5->shellQuote, q->rgCommand, K->quotedPath, _->quotedArgs
```

The v2.1.88 TypeScript (`/lyz/codespace/3rd/claude-code/src/utils/bash/ShellSnapshot.ts:65`) is the same control flow except `createArgv0ShellFunction` takes the binary path (`rgCommand.rgPath`) as a third argument. v2.1.112 dropped that because the function now resolves the path itself at run-time (see `argv0_dispatch.md` Section 6).

---

## 3. How `ripgrepCommand` decides which rg to use

`ripgrepCommand` is a thin wrapper that returns the memoised `getRipgrepConfig`:

```javascript
// ============================================
// ripgrepCommand - Public accessor returning the resolved ripgrep config
// Location: chunks.78.mjs:1003-1010
// ============================================

// ORIGINAL (for source lookup):
function wj6() { let q = ts6(); return { rgPath: q.command, rgArgs: q.args, argv0: q.argv0 } }

// READABLE (for understanding):
function ripgrepCommand() {
  const config = getRipgrepConfig();
  return { rgPath: config.command, rgArgs: config.args, argv0: config.argv0 };
}

// Mapping: wj6->ripgrepCommand, ts6->getRipgrepConfig
```

`getRipgrepConfig` is memoised and runs three checks in order:

```javascript
// ============================================
// getRipgrepConfig - Choose system rg / embedded bun rg / vendored rg binary
// Location: chunks.78.mjs:1209-1244
// ============================================

// ORIGINAL (for source lookup, abridged):
ts6 = P1(() => {
    if (c5(process.env.USE_BUILTIN_RIPGREP)) {
        let { cmd: z } = Jp1("rg", []);
        if (z !== "rg") return { mode: "system", command: z, args: [] }
    }
    if (v$()) {
        let z = { mode: "embedded", command: process.execPath, args: ["--no-config"], argv0: "rg" };
        if (rN(process.execPath)) return z;
        let { cmd: Y } = Jp1("rg", []);
        if (Y !== "rg") return { mode: "system", command: Y, args: [] };
        return z
    }
    let K = AK6.resolve(Jn_, "vendor", "ripgrep");
    return { mode: "builtin", command: process.platform === "win32" ? AK6.resolve(K, `${process.arch}-win32`, "rg.exe") : AK6.resolve(K, `${process.arch}-${process.platform}`, "rg"), args: [] }
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
      // SECURITY: we return command="rg" (bare name) not the resolved
      // path, so that the OS resolves it again at spawn time with
      // NoDefaultCurrentDirectoryInExePath, preventing PATH hijacking
      // from a malicious ./rg in cwd.
      return { mode: "system", command: "rg", args: [] };
    }
  }
  // 2. If running from a bun binary with embedded files, use argv0 dispatch.
  if (hasEmbeddedTools()) {
    const embedded = {
      mode: "embedded",
      command: process.execPath,    // path to our bun binary
      args: ["--no-config"],         // ripgrep flag: ignore ~/.ripgreprc
      argv0: "rg",                   // bun dispatcher routes by argv[0]
    };
    // Verify our own execPath is accessible (handles edge cases like dev-mode
    // where process.execPath might not exist on disk). v2.1.88 had no such check.
    if (which(process.execPath)) return embedded;
    // Our binary not resolvable; try system rg as fallback
    const { cmd: systemFallback } = findExecutable("rg", []);
    if (systemFallback !== "rg") {
      return { mode: "system", command: systemFallback, args: [] };
    }
    return embedded;
  }
  // 3. Use the vendored binary that ships in <package>/vendor/ripgrep/...
  const vendorRoot = path.resolve(__dirname, "vendor", "ripgrep");
  return {
    mode: "builtin",
    command: process.platform === "win32"
      ? path.resolve(vendorRoot, `${process.arch}-win32`, "rg.exe")
      : path.resolve(vendorRoot, `${process.arch}-${process.platform}`, "rg"),
    args: [],
  };
});

// Mapping: ts6->getRipgrepConfig, c5->isEnvDefinedFalsy, Jp1->findExecutable, v$->hasEmbeddedTools, rN->which, AK6->path, Jn_->packageRoot
```

### The three modes recap

| Mode | When | What `ripgrepCommand` returns |
|------|------|--------------------------------|
| `system` | User opted out of builtin AND system has `rg` on PATH | `{ rgPath: "rg" (or absolute), rgArgs: [], argv0: undefined }` |
| `embedded` | Default in ant-native builds | `{ rgPath: process.execPath, rgArgs: ["--no-config"], argv0: "rg" }` |
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
}`
}
```

Notice: `--no-config` from `rgArgs` is **not** in the emitted function. The integration calls `createArgv0ShellFunction("rg", q.argv0)` with no `prependArgs`, so the function forwards `"$@"` straight through. `rgArgs` is metadata for **Node-side** spawning via `spawn(rgPath, [...rgArgs, ...userArgs])` — irrelevant to the shell wrapper. This invariant is the same in v2.1.88 and v2.1.112.

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

Each arg is shell-quoted separately via `quote([arg])`, then joined with spaces. This ensures arguments containing special characters survive being embedded into the alias definition.

---

## 5. How it wires into the snapshot

In `getClaudeCodeSnapshotContent` (`qzY`, chunks.144.mjs:1898-1955):

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
4. `hasEmbeddedTools()` is checked. If true → return embedded config.
5. Otherwise return `builtin` (vendored).

The user's explicit opt-out is honoured only when a system rg actually exists.

### 6.3 Windows special-casing

`getRipgrepConfig` uses `process.arch` and `process.platform` to pick the vendored binary path. On Windows: `<root>/vendor/ripgrep/x64-win32/rg.exe`. The `.exe` extension is added explicitly because Windows requires it for execution (file extension dispatch).

The argv0 function form doesn't need a Windows variant — it handles Windows in the function body via `$OSTYPE == "msys"` etc.

### 6.4 `process.execPath` not resolvable by `which`

In v2.1.112's embedded-tools branch, `which(process.execPath)` is checked before returning the embedded config. This is a defensive existence check — if the execPath isn't accessible (rare, e.g. dev-mode quirks), `getRipgrepConfig` falls through to `findExecutable("rg", [])`. If system rg is available it's used; otherwise the embedded config is returned anyway as a last resort. This extra guard is new in v2.1.112; v2.1.88 returned the embedded config unconditionally when `isInBundledMode()` was true.

---

## 7. Why not always use the function form?

You could uniformly emit `function rg { /usr/bin/rg "$@"; }`. Why not?

- **No `argv[0]` need.** With a real, separate `rg` binary on PATH or in `vendor/`, `argv[0]` is set correctly by `execve` naturally. The four-branch function template only earns its keep when `argv[0]` dispatch is required.
- **Alias is simpler to inspect.** `type rg` shows `rg: aliased to '/.../rg'` — direct and obvious to a user reading the snapshot. A function body is harder to skim.
- **Less shell code in the snapshot.** Alias is one line; the function template is fourteen.

So the alias path is the simpler default; the function path is reserved for the embedded-binary case where it's genuinely needed.

---

## 8. v2.1.88 → v2.1.112 diff for this file

| Change | v2.1.88 | v2.1.112 |
|--------|---------|----------|
| Signature of `createArgv0ShellFunction` | takes `binaryPath` as 3rd arg | does not (path resolved at run-time inside the emitted function) |
| Call site in `createRipgrepShellIntegration` | `createArgv0ShellFunction("rg", rgCommand.argv0, rgCommand.rgPath)` | `createArgv0ShellFunction("rg", rgCommand.argv0)` (2 args) |
| Behaviour | Identical for fresh snapshots; v2.1.88 snapshots break on binary moves | Survives binary moves; falls back to system rg if claude binary missing |
| Mode-decision logic in `getRipgrepConfig` | Same three modes, same priority | Same |

---

## 9. Key insights

1. **The alias/function split is decided by a single flag** (`argv0`): present → function (embedded dispatch needed), absent → alias (no dispatch needed). The rest of the logic flows from that.

2. **The `if ! command -v rg` gate** makes the entire rg integration **opt-in** for users without system rg. This is the *opposite* design from `find`/`grep`, which always shadow. The reason is user-experience: `rg` users likely have specific tastes; `find`/`grep` users typically don't care.

3. **The subshell `(unalias rg; command -v rg)` in the gate** is essential to defeat user `alias rg='rg --smart-case'`-style customisations from masking the binary check. Without it, every user with an rg alias would never get the embedded-rg injection.

4. **`--no-config` is in `rgArgs` for Node-side spawning, but is NOT prepended into the shell function**. The Node side wants a deterministic, config-free rg for tool semantics; the shell wants user-friendly rg that respects local config.

5. **Late binary-path resolution** (v2.1.112) extends the same robustness gains to ripgrep that it gives to find/grep — snapshots survive Claude binary updates.

---

## 10. Cross-reference

- `argv0_dispatch.md` — full breakdown of the shell function template emitted in the `type: "function"` case
- `find_grep_integration.md` — sibling integration that always shadows (unlike rg's opt-in behaviour)
- `shell_integrations.md` — overview of how all three integrations land in the snapshot file
