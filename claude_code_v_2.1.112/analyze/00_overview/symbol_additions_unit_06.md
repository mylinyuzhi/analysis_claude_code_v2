# Symbol Additions — Unit 06 (38_shell_snapshot)

Symbols discovered while analyzing v2.1.112's shell snapshot generation system. Cross-referenced against the v2.1.88 readable source at `/lyz/codespace/3rd/claude-code/src/utils/bash/ShellSnapshot.ts`.

These belong logically with the Shell / Bash / Integration symbols. When integrating into the main index, add to `symbol_index_infra_integration.md` under a Module: Shell Snapshot section.

---

## Module: Shell Snapshot — Creation

| Obfuscated | Readable | File:Line | Type | v2.1.88 source |
|------------|----------|-----------|------|----------------|
| `UPK` | `createAndSaveSnapshot` | chunks.144.mjs:1994-2067 | function | `ShellSnapshot.ts:413` |
| `KzY` | `getSnapshotScript` | chunks.144.mjs:1957-1984 | function | `ShellSnapshot.ts:345` |
| `Q47` | `getConfigFile` | chunks.144.mjs:1840-1843 | function | `ShellSnapshot.ts:181` |
| `e_Y` | `getUserSnapshotContent` | chunks.144.mjs:1845-1896 | function | `ShellSnapshot.ts:197` |
| `qzY` | `getClaudeCodeSnapshotContent` | chunks.144.mjs:1898-1955 | function | `ShellSnapshot.ts:269` |
| `U47` | `createArgv0ShellFunction` | chunks.144.mjs:1810-1814 | function | `ShellSnapshot.ts:35` (signature changed in v2.1.112) |
| `o_Y` | `createRipgrepShellIntegration` | chunks.144.mjs:1816-1828 | function | `ShellSnapshot.ts:65` |
| `s_Y` | `createFindGrepShellIntegration` | chunks.144.mjs:1830-1834 | function | `ShellSnapshot.ts:153` |
| `t_Y` | `createBigQueryShellIntegration` | chunks.144.mjs:1836-1838 | function | (NEW in v2.1.112 — placeholder, always returns null) |

## Module: Shell Snapshot — Consumer

| Obfuscated | Readable | File:Line | Type | Notes |
|------------|----------|-----------|------|-------|
| `iPK` | `createBashExecutor` | chunks.144.mjs:2147-2212 | function | Builds executor, kicks off snapshot promise |
| `wzY` | `getExtglobDisableCommand` | chunks.144.mjs:2140-2145 | function | bash: `shopt -u extglob`; zsh: `setopt NO_EXTENDED_GLOB`; with prefix: both |
| `dU8` | `applyShellPrefix` | chunks.144.mjs:2088-2095 | function | Wraps command with `CLAUDE_CODE_SHELL_PREFIX` (e.g., `docker exec -i name -c`) |
| `AzY` | `accessSnapshotFile` | chunks.144.mjs (referenced 2160) | function | Stat/access probe for snapshot existence at command time |

## Module: Shell Snapshot — Helpers (cross-chunk)

| Obfuscated | Readable | File:Line | Type | Notes |
|------------|----------|-----------|------|-------|
| `wj6` | `getRipgrepInfo` | chunks.78.mjs:1003-1010 | function | Returns `{rgPath, rgArgs, argv0}` from `ts6()` |
| `RG4` | `getPluginBinPaths` | chunks.88.mjs:2728-2736 | function | NEW: returns enabled-plugin `bin/` dirs with metachar filter |
| `$H` | `hasEmbeddedSearchTools` | (referenced) | function | Gate for bfs/ugrep shadow emission |
| `a3` | `pathExists` | (referenced) | function | Async file-existence probe |
| `i_Y` | `mkdir` | (re-exported from fs/promises) | function | Used with `{recursive: true}` for the snapshots dir |
| `n_Y` | `execFile` | (re-exported from child_process) | function | Used to spawn the snapshot-creation shell |
| `r_Y` | `stat` | (re-exported from fs/promises) | function | Verifies snapshot file exists & has size > 0 |
| `eq` | `registerCleanup` | (from cleanupRegistry) | function | Async-aware exit handler |
| `Dk` | `subprocessEnv` | (from subprocessEnv) | function | Sanitized parent env for child processes |
| `j6` | `logError` | (from log) | function | Persistent error logger |
| `E` | `logForDebugging` | (from debug) | function | Debug-mode-only logger |
| `d` | `logEvent` | (from analytics) | function | Telemetry sink |
| `A5` | `shellQuote` | (from shellQuote) | function | Single-quote escape for shell arg list |
| `A7` | `getClaudeConfigHomeDir` | (from envUtils) | function | Returns `~/.claude` or `$CLAUDE_CONFIG_DIR` |
| `b8` | `getCwd` | (from cwd) | function | Returns the global CWD |
| `F47` | `path.join` | (re-exported from path) | function | (alias for path.join) |
| `QU8` | `os` namespace | (re-exported from os) | namespace | `homedir()`, `constants.signals`, etc. |
| `V8` | `getFsImplementation` | (from fsOperations) | function | Returns the (testable) fs implementation |
| `sX` | `toCygwinPath` | (referenced 2175) | function | Convert Windows path → Cygwin path |
| `y1` | `getPlatform` | (from platform) | function | Returns `"windows"`, `"linux"`, `"darwin"`, `"wsl"` |

## Constants

| Obfuscated | Readable | File:Line | Value | Type |
|------------|----------|-----------|-------|------|
| `g47` | `SNAPSHOT_CREATION_TIMEOUT` | chunks.144.mjs:1988 | `1e4` (10000 ms) | constant |
| `p47` | `LITERAL_BACKSLASH` | chunks.144.mjs:1986 | `"\\"` | constant |
| `d47` | `CLAUDE_CODE_EXECPATH` | chunks.144.mjs:1990 | `"CLAUDE_CODE_EXECPATH"` (env var name) | constant |
| `a_Y` | `VCS_DIRECTORIES_TO_EXCLUDE` | chunks.144.mjs:2085 | `[".git", ".svn", ".hg", ".bzr", ".jj", ".sl"]` | constant |

---

## v2.1.88 → v2.1.112 Differences

### Signature change: `createArgv0ShellFunction` (U47)

**v2.1.88 signature:**
```typescript
function createArgv0ShellFunction(
    funcName: string,
    argv0: string,
    binaryPath: string,            // ← removed
    prependArgs: string[] = []
): string
```

**v2.1.112 signature:**
```javascript
function U47(funcName, argv0, prependArgs = []) {
    // Binary now derived at function-call time:
    //   1. $CLAUDE_CODE_EXECPATH env var
    //   2. command -v claude fallback
    //   3. last resort: command <funcName> "$@" (bypass)
}
```

**Impact:** Generated shell functions no longer embed an absolute binary path. They read `$CLAUDE_CODE_EXECPATH` at call time. This makes snapshots portable across binary upgrades (move claude binary → snapshot still works) and adds a graceful PATH-fallback last resort.

### New helper: `getPluginBinPaths` (RG4) — chunks.88.mjs:2728

NEW in v2.1.112. Returns enabled-plugin `bin/` directories for prepending to the snapshot's exported PATH. Includes a metachar-injection filter on POSIX systems (rejects paths containing `:`, `"`, `'`, `$`, `` ` ``, `\`, newline).

Consumed by `getClaudeCodeSnapshotContent` (qzY).

### New placeholder: `createBigQueryShellIntegration` (t_Y)

Returns null always. Wired into `getClaudeCodeSnapshotContent` (qzY) — if/when it returns a non-null snippet, emits a `cat >> ... << 'BQ_FUNC_END'` heredoc into the snapshot. Forward-compatibility hook for future `bq` (Google Cloud BigQuery CLI) integration that would label query jobs with `source=claude_code`.

### Expanded VCS exclusion list (a_Y)

v2.1.88: `[".git", ".svn", ".hg", ".bzr"]`
v2.1.112: `[".git", ".svn", ".hg", ".bzr", ".jj", ".sl"]`

Added Jujutsu (`.jj`) and Sapling (`.sl`).

### PATH emission: heredoc with randomized delimiter

**v2.1.88:**
```javascript
content += `echo "export PATH=${quote([pathValue || ''])}" >> "$SNAPSHOT_FILE"`
```

**v2.1.112:**
```javascript
const pathDelim = `PATH_END_${Math.random().toString(36).substring(2, 18)}`;
content += `cat >> "$SNAPSHOT_FILE" << '${pathDelim}'
export PATH=${shellQuote([pathValue || ""])}
${pathDelim}`
```

Avoids quoting issues if the PATH contains single quotes. Random suffix makes accidental delimiter collisions negligible.

### Source-line safety in `buildExecCommand`

v2.1.88 emitted `source <snapshot>`. v2.1.112 emits `source <snapshot> 2>/dev/null || true`. Snapshot syntax errors or corruption no longer break the `&&`-chained command.

Location: chunks.144.mjs:2176 (`D.push("source " + A5([v]) + " 2>/dev/null || true")`)

### Recreation removed in `buildExecCommand`

v2.1.88's `buildExecCommand` would recreate the snapshot if it was missing at command time. v2.1.112 sets `snapshotPath = undefined` and falls through to login-shell spawning. Simpler control flow; accept degraded performance after snapshot loss.

Location: chunks.144.mjs:2162 (the v2.1.88 retry block is replaced with `E("Snapshot file missing, falling back to login shell: ..."); w = void 0`).

### New: BUN_OPTIONS export when CLAUDE_CODE_REMOTE is set

```javascript
if (S6(process.env.CLAUDE_CODE_REMOTE)) D.push('export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"');
```

Location: chunks.144.mjs:2181. Sets Bun runtime to "smol" memory mode (lower per-process overhead) when running under the remote agent harness. Preserves any existing BUN_OPTIONS via the `${BUN_OPTIONS:+ $BUN_OPTIONS}` parameter expansion.

### CLAUDE_CODE_EXECPATH injected into env

```javascript
async getEnvironmentOverrides(A, O, w) {
    // ...
    H[d47] = process.execPath;  // d47 = "CLAUDE_CODE_EXECPATH"
    // ...
}
```

Location: chunks.144.mjs:2201. Sets the env var that the generated rg/find/grep functions read to locate the claude binary. Together with the U47 signature change, this is what makes snapshots portable.

---

## Cross-Reference: Where These Symbols Live

```
chunks.144.mjs (the entire shell snapshot system)
├─ 1810-1814  U47       createArgv0ShellFunction
├─ 1816-1828  o_Y       createRipgrepShellIntegration
├─ 1830-1834  s_Y       createFindGrepShellIntegration
├─ 1836-1838  t_Y       createBigQueryShellIntegration (always null)
├─ 1840-1843  Q47       getConfigFile
├─ 1845-1896  e_Y       getUserSnapshotContent
├─ 1898-1955  qzY       getClaudeCodeSnapshotContent
├─ 1957-1984  KzY       getSnapshotScript
├─ 1986       p47       LITERAL_BACKSLASH constant
├─ 1988       g47       SNAPSHOT_CREATION_TIMEOUT constant
├─ 1990       d47       CLAUDE_CODE_EXECPATH constant
├─ 1994-2067  UPK       createAndSaveSnapshot
├─ 2085       a_Y       VCS_DIRECTORIES_TO_EXCLUDE constant
├─ 2088-2095  dU8       applyShellPrefix
├─ 2140-2145  wzY       getExtglobDisableCommand
└─ 2147-2212  iPK       createBashExecutor

chunks.88.mjs
└─ 2728-2736  RG4       getPluginBinPaths (consumed by qzY)

chunks.78.mjs
└─ 1003-1010  wj6       getRipgrepInfo (consumed by o_Y)
```
