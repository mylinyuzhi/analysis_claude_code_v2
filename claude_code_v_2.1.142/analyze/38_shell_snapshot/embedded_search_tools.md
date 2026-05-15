# Embedded Search Tools: Glob/Grep → bfs/ugrep (v2.1.117 → v2.1.142)

> Two related v2.1.11x changes: **v2.1.117** removed `Glob` and `Grep` from the tool registry on native macOS/Linux builds, replacing them with embedded `bfs` and `ugrep` available through the Bash tool. **v2.1.121** added a fallback so the embedded wrappers still work when the running claude binary is deleted mid-session. Together they shift the model's search interaction from dedicated tool calls to shell commands routed through the snapshot's argv0 dispatch.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Unit 04 mappings

Key functions in this document:
- `hasEmbeddedSearchTools` (`dM`) — Gate (now always true on non-SDK builds) — cli_inner_pretty.js:141600
- `createFindGrepShellIntegration` (`Ai_`) — Emitter for find/grep shadows — cli_inner_pretty.js:360516
- `createRipgrepShellIntegration` (`Ki_`) — Emitter for rg shadow — cli_inner_pretty.js:360509
- `createArgv0ShellFunction` (`Iv6`) — Shared template — cli_inner_pretty.js:360476
- `getInstallBinDir` (`ne`) — Returns `~/.local/bin` (the v2.1.121 baked fallback path) — cli_inner_pretty.js:313906
- `getRipgrepConfig` (`$Y$`) — Memoised rg config — cli_inner_pretty.js:197969
- `clearRipgrepCache` (`hgK`) — Cache invalidation on ENOENT — cli_inner_pretty.js:197932

---

## 1. The Change in One Picture

```
                v2.1.116                          v2.1.117+
                ────────                          ────────

  Tool registry on native builds:        Tool registry on native builds:

  ┌─────────────┐                        ┌─────────────┐
  │ Bash        │                        │ Bash        │
  │ Glob        │                        │             │  (Glob removed)
  │ Grep        │                        │             │  (Grep removed)
  │ Read        │                        │ Read        │
  │ Write       │                        │ Write       │
  │ Edit        │                        │ Edit        │
  │ ...         │                        │ ...         │
  └─────────────┘                        └─────────────┘

  Model glob query:                      Model glob query:
                                          ─────────────────
  GlobTool(pattern="*.ts")                Bash("find . -name '*.ts'")
       │                                       │
       v                                       v
  (dedicated tool runs find/rg)          source <snapshot> → function find { ... }
                                                              → ARGV0=bfs ... bfs
                                                              → returns matching paths

  Model grep query:                      Model grep query:
                                          ──────────────────
  GrepTool(pattern="foo", path=".")       Bash("grep -r 'foo' .")
       │                                       │
       v                                       v
  (dedicated tool runs rg)               source <snapshot> → function grep { ... }
                                                              → ARGV0=ugrep ... ugrep
                                                              → returns matching lines
```

The v2.1.117 changelog item: "Native builds on macOS and Linux: the `Glob` and `Grep` tools are replaced by embedded `bfs` and `ugrep` available through the Bash tool — faster searches without a separate tool round-trip (Windows and npm-installed builds unchanged)".

---

## 2. Why This Refactor

### 2.1 Performance: removing a tool round-trip

Each tool call has fixed overhead:
- Model serialises the call into a structured tool-use block (~50-150 tokens)
- API request/response round-trip
- Tool dispatcher locates and invokes the tool
- Result is serialised back into a tool-result block (~50-100 tokens)

For a search task that involves `find . -name '*.ts' | xargs grep -l 'TODO'`, the pre-v2.1.117 sequence required **at minimum two tool calls** (one for find, one for grep). The post-v2.1.117 sequence is **one Bash call** with the pipeline composed in shell.

Token savings per multi-tool search:
- 1 saved tool-use round-trip: ~100-250 tokens
- 1 saved tool-definition slot in the system prompt (Glob ≈ 200 tokens, Grep ≈ 200 tokens) = 400 tokens permanently saved per session

For long sessions doing many searches, the cumulative savings are material.

### 2.2 Pipeline composability

`GlobTool` and `GrepTool` were closed boxes — they couldn't be composed with each other or with other shell commands. The Bash-routed equivalents naturally compose:

```sh
# Multi-step search-and-replace pipeline (one Bash call):
find src -name '*.ts' | xargs grep -l 'oldName' | xargs sed -i 's/oldName/newName/g'
```

The model can express complex find→grep→action workflows in a single tool call. The dedicated tools couldn't support this without explicit pipe-tool support.

### 2.3 Consistent permission model

Pre-v2.1.117, `GlobTool` and `GrepTool` had their own permission rules separate from `Bash(...)` rules. A user who allowed `Bash(find:*)` might still be prompted for `Glob`.

Post-v2.1.117, all search commands go through `Bash`, so a single `Bash(find:*)` or `Bash(grep:*)` rule covers everything.

The v2.1.119 changelog item supports this: "Fixed Glob and Grep tools disappearing on native macOS/Linux builds when the Bash tool is denied via permissions". So `Bash` permissions are now the gate.

### 2.4 Why Windows and npm builds unchanged

The wrapper relies on:
1. `bfs` and `ugrep` being embedded into a single Bun-compiled binary
2. `argv[0]` dispatch working portably

Windows builds use a different distribution shape — there's no single binary that hosts the embedded tools. npm-installed builds run from a Node interpreter (not a Bun-compiled binary), so the `argv[0]` dispatch doesn't apply. These builds keep `GlobTool`/`GrepTool` as before.

---

## 3. The Gate: `hasEmbeddedSearchTools` (`dM`) v2.1.117 Simplification

```javascript
// ============================================
// hasEmbeddedSearchTools - Gate for whether to remove Glob/Grep from registry
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
  // v2.1.117 simplification: the EMBEDDED_SEARCH_TOOLS env-var gate was removed.
  // bH("true") always returns true.
  if (!parseExplicitTrue("true")) return false;        // unreachable
  const entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
  return entrypoint !== "sdk-ts"
      && entrypoint !== "sdk-py"
      && entrypoint !== "sdk-cli"
      && entrypoint !== "local-agent";
}

// Mapping: dM→hasEmbeddedSearchTools, bH→parseExplicitTrue, H→entrypoint
```

### Comparison vs v2.1.112

| Version | First check | Equivalent | Effect |
|---------|-------------|------------|--------|
| v2.1.112 (`$H`) | `S6(process.env.EMBEDDED_SEARCH_TOOLS)` | `parseExplicitTrue(process.env.EMBEDDED_SEARCH_TOOLS)` | False unless env var set → embedded tools opt-in |
| v2.1.142 (`dM`) | `bH("true")` | `parseExplicitTrue("true")` | Always true (literal "true" matches truthy list) → embedded tools mandatory |

In v2.1.112, the build was gated by `EMBEDDED_SEARCH_TOOLS=1` at runtime. Native builds set it; SDK builds didn't. Users could in theory disable embedded tools by unsetting the var.

In v2.1.142, the env-var gate is removed. The literal `"true"` always passes. The only escape hatch is the SDK-entrypoint check — `CLAUDE_CODE_ENTRYPOINT=sdk-cli` (or the other SDK values) still bypasses the embedded tools.

**Why the literal stays:** dead-code preservation. The function shape (`bH(?) → entrypoint check`) is maintained so a future opt-out env var can be wired in by changing one line. The dead-code style documents intent ("this was a configurable gate") without requiring a re-architecture.

---

## 4. Snapshot Composition With Embedded Tools

When `hasEmbeddedSearchTools()` returns true, `createFindGrepShellIntegration` (`Ai_`) emits the find/grep shadow functions into the snapshot. These run via the `argv0` dispatcher in `createArgv0ShellFunction` (`Iv6`). See [find_grep_integration.md](./find_grep_integration.md) and [argv0_dispatch.md](./argv0_dispatch.md) for full details.

The integration looks like this in the assembled snapshot:

```sh
# Shadow find/grep with embedded bfs/ugrep (ant-native only)
unalias find 2>/dev/null || true
unalias grep 2>/dev/null || true
function find {
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin='/home/alice/.local/bin/claude'
  if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi
  # ... cross-shell ARGV0=bfs dispatch ...
}
function grep {
  # NEW v2.1.142: deny-pattern dispatch for ugrep-only flags
  local _cc_a
  for _cc_a in "$@"; do
    case "$_cc_a" in -*-filter*|-*-pager*|-*-view*|-*-format-open*|-*-config*|---*|-@*|-*-save-config*) command grep "$@"; return ;; esac
  done
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin='/home/alice/.local/bin/claude'
  if [[ ! -x $_cc_bin ]]; then command grep "$@"; return; fi
  # ... cross-shell ARGV0=ugrep dispatch ...
}
```

When the model runs `find . -name '*.ts'` via the Bash tool, the shell sources the snapshot, the `function find { ... }` definition is in scope, and the call routes to bun-with-argv[0]="bfs". The bun runtime sees `argv[0] = "bfs"` and runs the embedded bfs implementation.

---

## 5. The v2.1.121 Fix: Binary-Deletion Fallback

The v2.1.121 changelog item: "Fixed embedded grep/find/rg shell wrappers failing when the running binary is deleted mid-session — now falls back to installed tools".

### 5.1 The bug

Before v2.1.121, the wrapper function's binary resolution was (effectively):

```sh
local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
[[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)
if [[ ! -x $_cc_bin ]]; then echo "claude binary not found" >&2; return 1; fi
```

Or in earlier versions (v2.1.88 and before), the path was baked at snapshot-generation time and never refreshed.

If the running claude binary was upgraded in place (`brew upgrade`, `claude self-update`, etc.) mid-session:
- `$CLAUDE_CODE_EXECPATH` still points at the old (now-deleted) inode
- `command -v claude` finds the new binary on PATH, but the new binary might have a different argv[0] dispatcher behaviour (rare but possible)
- The wrapper fails or behaves unexpectedly

### 5.2 The fix

v2.1.121 (carried into v2.1.142) added a graceful-fallback path: when neither the env var nor any fallback binary path resolves an executable, fall through to the user's installed system tool:

```sh
local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
[[ -x $_cc_bin ]] || _cc_bin='/home/alice/.local/bin/claude'    # v2.1.142 baked path
if [[ ! -x $_cc_bin ]]; then command find "$@"; return; fi      # v2.1.121 fix: fall through to system find
```

The `command find "$@"` invocation runs the system find (bypassing aliases and functions). The user gets standard GNU find behaviour instead of embedded bfs — the model's search succeeds, just without the embedded-tool optimisation.

### 5.3 Why the cache also matters

The ripgrep config (`getRipgrepConfig`/`$Y$`) is memoised. If the binary disappears mid-session, the cached config still points at the deleted binary. The cache invalidator `hgK` is called on ENOENT during a ripgrep execution:

```javascript
// cli_inner_pretty.js:197932-197934
function hgK() {
  if (($Y$.cache?.clear?.(), VUH?.working !== !1)) (ygK.cache?.clear?.(), (VUH = null));
}
```

This clears both the rg config cache and an internal "working" flag, so the next call resolves the config fresh. Combined with the shell-level fallback, this means:

1. Model runs `grep "foo" file` via Bash.
2. Snapshot's `grep` function tries `$CLAUDE_CODE_EXECPATH` — deleted → falls back to baked `~/.local/bin/claude`.
3. Baked path also missing → falls through to `command grep`. Search succeeds with GNU grep.
4. Separately, the Node-side ripgrep config invalidates so future SDK calls re-resolve.

Both layers (shell wrapper + Node-side) need to handle the binary-deleted case for robustness across all consumers.

### 5.4 Why this matters in practice

Common scenarios where the binary disappears:

| Scenario | What happens to binary |
|----------|----------------------|
| `brew upgrade claude-code` | Old binary unlinked, new one installed at same path |
| In-place reinstall script | Old binary unlinked, new one written |
| Session started from `/tmp/installer/claude`, then user deletes the installer dir | Old binary gone, no replacement |
| Antivirus quarantine | Binary moved/disabled |

In all cases, the wrapper falls through to system tools gracefully.

---

## 6. Integration With the Tool Registry

Glob and Grep removal happens at tool-registry construction time. The relevant code lives in module(s) outside the shell-snapshot scope, but conceptually:

```javascript
// Approximate logic (not the actual obfuscated code):
function getBuiltInTools() {
  const tools = [Bash, Read, Write, Edit, /* ... */];
  if (!hasEmbeddedSearchTools()) {
    tools.push(GlobTool, GrepTool);
  }
  return tools;
}
```

When `hasEmbeddedSearchTools()` returns true (native builds), `GlobTool` and `GrepTool` are not registered. The model's system prompt only lists the remaining tools, freeing up tokens for context.

The system prompt for the Bash tool then advertises that `find`/`grep` are available shell commands with specific embedded-tool semantics. The model learns to use Bash for searches instead of dedicated tools.

---

## 7. Migration Concerns

### 7.1 What if the model still emits Glob/Grep tool calls?

Models trained on pre-v2.1.117 examples might still emit `<glob_tool>` or `<grep_tool>` use blocks. On a v2.1.142 native build, these tools aren't registered → the model gets an "unknown tool" error → retries with a different approach (usually a Bash call).

Production models have been updated for the new tool list, so this is rare in practice.

### 7.2 What if a user's hooks expect Glob/Grep tools?

User-defined hooks (`PreToolUse: Glob`, etc.) targeting Glob or Grep would never fire on native builds. The user needs to update their hooks to target `Bash` instead — or recognise that find/grep invocations through Bash should be treated as search operations.

The v2.1.119 fix for "Glob and Grep tools disappearing on native macOS/Linux builds when the Bash tool is denied via permissions" suggests that Glob and Grep are re-added when `Bash` permission is denied — so the disappearance is conditional on Bash being usable.

### 7.3 What if a user explicitly disables embedded tools?

There is no opt-out env var in v2.1.142. The `EMBEDDED_SEARCH_TOOLS` env var no longer exists as a gate. To get the old behaviour, the user would need an SDK entrypoint (`CLAUDE_CODE_ENTRYPOINT=sdk-cli`).

This is intentional. Embedded tools are a performance and consistency win; the opt-out was removed because no user-facing issue warranted keeping it.

---

## 8. Comparison Table

| Aspect | Pre-v2.1.117 (v2.1.112) | v2.1.117 → v2.1.142 |
|--------|--------------------------|--------------------- |
| `Glob` tool in registry on native builds | Yes | No |
| `Grep` tool in registry on native builds | Yes | No |
| `find` shell wrapper available | If `EMBEDDED_SEARCH_TOOLS=1` | Always (on non-SDK builds) |
| `grep` shell wrapper available | If `EMBEDDED_SEARCH_TOOLS=1` | Always (on non-SDK builds) |
| `rg` shell wrapper available | If `EMBEDDED_SEARCH_TOOLS=1` and no system rg | If embedded bun rg available and no system rg |
| Wrapper binary resolution | env var → `command -v claude` | env var → baked `~/.local/bin/claude` |
| Wrapper fallback on missing binary | Error | System tool (`command find`/`grep`/`rg`) |
| Permission gate | Glob/Grep had own rules | Bash rules apply |
| Token savings on first search | None | ~100-250 tokens per saved tool call + 400 tokens permanently saved from system prompt |
| Pipeline composability | Limited (separate tools) | Full (one Bash call) |
| ugrep-only flag handling | Routed through wrapper | Falls through to system grep (v2.1.142 deny-pattern feature) |

---

## 9. Why v2.1.142 Specifically Inherits This

This change has been stable since v2.1.117. v2.1.142 inherits it with two refinements:

1. **The `Iv6` baked install path** (v2.1.142): the v2.1.121 fallback chain now uses `~/.local/bin/claude` instead of `command -v claude` as the secondary path. This was driven by the v2.1.113 native-binary install refactor — the install location is now stable and known, so baking it is safer than PATH lookup.

2. **The grep deny-pattern dispatch** (v2.1.142): ugrep-only flags fall through to system grep. This is a UX refinement layered on top of the v2.1.117 wrapper architecture.

Both are documented in [argv0_dispatch.md](./argv0_dispatch.md) and [find_grep_integration.md](./find_grep_integration.md).

---

## 10. Edge Cases (NEW v2.1.121 fallback)

### 10.1 Binary upgraded in place during a session

Setup:
- Session started at T=0 with `CLAUDE_CODE_EXECPATH=/usr/local/bin/claude`
- At T=10min, user runs `brew upgrade claude-code` from a separate shell

What happens:
- The old binary at `/usr/local/bin/claude` is unlinked
- A new binary is installed at `/usr/local/bin/claude` (different inode)
- `$CLAUDE_CODE_EXECPATH` in our session still points at the old (now-deleted) inode
- Next Bash tool call:
  - `[[ -x $_cc_bin ]]` fails (deleted inode)
  - Falls to baked `~/.local/bin/claude` → might be the new binary if installer also wrote here, or might be missing
  - If missing, falls to `command find "$@"` → system find

Worst case: model's `find` call uses GNU find for the remainder of the session. Slight behavioural drift but no crash.

### 10.2 Embedded binary's PATH is inaccessible

Setup:
- Session running from `/tmp/claude-extract/claude`
- `$CLAUDE_CODE_EXECPATH=/tmp/claude-extract/claude`
- User runs `rm -rf /tmp/claude-extract`

What happens:
- `[[ -x $_cc_bin ]]` fails (path gone)
- Falls to baked `~/.local/bin/claude` → installed → works.
- If `~/.local/bin/claude` doesn't exist either, falls to system tool.

### 10.3 Session pre-dates the binary upgrade

If a session was started 3 days ago (`cleanupPeriodDays: 30`), its snapshot file is still valid (well within cutoff). But the binary path inside the snapshot is... wait, no, the binary path is **resolved at function call time**, not stored in the snapshot. Even old snapshots from before the upgrade keep working.

This is the key insight from [argv0_dispatch.md](./argv0_dispatch.md) Section 5: late binding makes snapshots portable across binary upgrades.

---

## 11. Decision Summary

| Decision | Choice | Why |
|----------|--------|-----|
| Replace Glob/Grep with Bash wrappers | Yes (v2.1.117) | Token savings, pipeline composability, simpler permission model |
| Removal scope | Native macOS/Linux only | Windows lacks the argv0-dispatch substrate; npm builds run from Node not Bun |
| Opt-out via env var | Removed (was `EMBEDDED_SEARCH_TOOLS=1`) | Embedded tools are a win; no user-facing complaint warranted the opt-out |
| Wrapper binary resolution | env var → baked install path → system tool (v2.1.121+) | Robust against binary upgrade/deletion |
| Fallback to system tool when binary missing | Yes (v2.1.121) | Search succeeds even with broken Claude install |
| Cache invalidation on ENOENT | Yes (`hgK` clears `$Y$` and `ygK` caches) | Subsequent calls re-resolve from scratch |
| Glob/Grep re-added when Bash permission denied | Yes (v2.1.119 fix) | Avoid leaving the user with no search tools |

---

## 12. Cross-reference

- [find_grep_integration.md](./find_grep_integration.md) — full deobfuscation of the find/grep wrapper builder
- [ripgrep_integration.md](./ripgrep_integration.md) — sibling integration for rg
- [argv0_dispatch.md](./argv0_dispatch.md) — the shared template, including the v2.1.121 fallback chain and v2.1.142 baked path
- [shell_integrations.md](./shell_integrations.md) — overview of all three embedded-tool integrations
- [retention_cleanup.md](./retention_cleanup.md) — the other v2.1.117 addition (cleanupPeriodDays sweep)
