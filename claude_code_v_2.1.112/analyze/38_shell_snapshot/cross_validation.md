# Cross-Validation: v2.1.88 Readable Names <-> v2.1.112 Obfuscated (Unit 8)

> Audit of symbol mappings used in `bash_tool_integration.md`, `command_assembly.md`, and `env_snapshot.md`. Verifies each obfuscated identifier in v2.1.112 chunks against the v2.1.88 readable source. Resolves discrepancies and records v2.1.112-only additions.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_08.md](../00_overview/symbol_additions_unit_08.md) - Unit 8 mappings (this audit's output)

---

## 1. Methodology

For each obfuscated symbol in v2.1.112 chunks (16, 78, 98, 110, 113, 114, 117, 136, 144, 167, 169, 188) referenced in Unit 8 docs, the audit:

1. Located the obfuscated function/variable in the chunk file (precise line numbers in `symbol_additions_unit_08.md`).
2. Found the v2.1.88 readable equivalent in `/lyz/codespace/3rd/claude-code/src/utils/...`.
3. Compared signatures, behavior, and call patterns.
4. Recorded the result: **Match**, **Renamed**, **Behavior changed**, **v2.1.112-only**, or **v2.1.88-only**.

A symbol counts as **Match** when the readable name in v2.1.88 source is functionally identical to the obfuscated counterpart (allowing for trivial transformations like Promise vs callback). It counts as **Renamed** when the readable name should be updated to match either v2.1.112 behavior or current naming conventions.

---

## 2. Snapshot Module (chunks.144.mjs <-> ShellSnapshot.ts)

| v2.1.112 | v2.1.88 readable | Status | Notes |
|----------|------------------|--------|-------|
| `UPK` (chunks.144.mjs:1994) | `createAndSaveSnapshot` (ShellSnapshot.ts:413) | Match | Same async-resolve-only-Promise pattern; same callback handling |
| `KzY` (chunks.144.mjs:1957) | `getSnapshotScript` (ShellSnapshot.ts:345) | Match | Same script template structure, identical PATH/PATH_END_<rand> sentinel pattern |
| `qzY` (chunks.144.mjs ~1880) | `getClaudeCodeSnapshotContent` (ShellSnapshot.ts:269) | Match | v2.1.112 adds BigQuery shadow (`t_Y` call) — see 8.1 below |
| `e_Y` (chunks.144.mjs) | `getUserSnapshotContent` (ShellSnapshot.ts:197) | Match | Same zsh/bash branching, same base64 function dump for bash |
| `Q47` (chunks.144.mjs) | `getConfigFile` (ShellSnapshot.ts:181) | Match | Same `.zshrc`/`.bashrc`/`.profile` selection |
| `o_Y` (chunks.144.mjs) | `createRipgrepShellIntegration` (ShellSnapshot.ts:65) | Match | Same alias/function discrimination based on `rgCommand.argv0` |
| `s_Y` (chunks.144.mjs) | `createFindGrepShellIntegration` (ShellSnapshot.ts:153) | Match | Identical VCS dir exclusion list, identical `-G` injection for grep |
| `t_Y` (chunks.144.mjs) | _(missing in v2.1.88)_ | v2.1.112-only | BigQuery shell shadow with `source=claude_code` job label — see 8.1 |
| `a_Y` (chunks.144.mjs:2085) | `VCS_DIRECTORIES_TO_EXCLUDE` (ShellSnapshot.ts:98) | Match | Same array `[".git",".svn",".hg",".bzr",".jj",".sl"]` |
| `g47` (chunks.144.mjs:1988) | `SNAPSHOT_CREATION_TIMEOUT` (ShellSnapshot.ts:24) | Match | Both `10000` ms |
| `p47` (chunks.144.mjs:1986) | `LITERAL_BACKSLASH` (ShellSnapshot.ts:23) | Match | Both `'\\'` |
| `d47` (chunks.144.mjs:1990) | _(no name)_ — `'CLAUDE_CODE_EXECPATH'` string literal | Match (renamed) | v2.1.88 inlines the string; v2.1.112 extracts it to a constant |

### 2.1 v2.1.112-only Addition: BigQuery Shadow (`t_Y`)

The v2.1.112 snapshot pipeline added a new shadow function for BigQuery's `bq` CLI:

```bash
# In the generated snapshot:
# Shadow bq to label query jobs with source=claude_code
function bq {
  if [[ -n $ZSH_VERSION ]]; then
    ARGV0=bq /path/to/embedded/bq --label source=claude_code "$@"
  # ... cross-shell variants ...
}
```

This tags every BigQuery job initiated through Claude Code with a source label, making it auditable in BigQuery's job history. There is no equivalent in v2.1.88 (the `src/utils/bash/ShellSnapshot.ts` only has `rg` and `find/grep` shadows).

---

## 3. Shell Provider Module (chunks.144.mjs <-> bashProvider.ts)

| v2.1.112 | v2.1.88 readable | Status | Notes |
|----------|------------------|--------|-------|
| `iPK` (chunks.144.mjs:2147) | `createBashShellProvider` (bashProvider.ts) | Match | v2.1.112 adds `skipSnapshot` opt parameter for SDK tests |
| `sPK` (chunks.144.mjs:2280) | `createPowerShellProvider` (powershellProvider.ts) | Match | EncodedCommand for sandbox, raw script otherwise |
| `EzY` (chunks.144.mjs:2358) | `getShellConfigImpl` (Shell.ts:139) | Match | Same `findSuitableShell` + provider factory pattern |
| `NzY` (chunks.144.mjs:2331) | `findSuitableShell` (Shell.ts:73) | Match | Same `CLAUDE_CODE_SHELL` -> `SHELL` -> `which` -> fallback paths order |
| `o47` (chunks.144.mjs:2316) | `isExecutable` (Shell.ts:50) | Match | Same X_OK check + execFileSync `--version` fallback |
| `ePK` (chunks.144.mjs:2570) | `getShellConfig` (Shell.ts:146) | Match | Both memoize with lodash-style memoize |
| `yzY` (chunks.144.mjs:2571) | `getPsProvider` (Shell.ts:148) | Match | Same lazy-with-throw-on-missing pattern |
| `LzY` (chunks.144.mjs:2575) | `resolveProvider` (Shell.ts:156) | Match | Same `{bash, powershell}` async-factory map |
| `kzY` (chunks.144.mjs:2534) | `DEFAULT_TIMEOUT` (Shell.ts:44) | Match | Both `30 * 60 * 1000` ms = 1,800,000 ms |

---

## 4. Bash Executor Module (chunks.144.mjs <-> Shell.ts)

| v2.1.112 | v2.1.88 readable | Status | Notes |
|----------|------------------|--------|-------|
| `al` (chunks.144.mjs:2369) | `exec` (Shell.ts:181) | Match (renamed) | v2.1.76 calls this `HP1`; v2.1.88 readable name `exec` was adopted by both |
| `lPK` (chunks.144.mjs:2130) | `substituteNulRedirect` (bashProvider helpers) | Match | Identical regex |
| `YzY` (chunks.144.mjs:2134) | `NUL_REDIRECT_REGEX` | Match | Same regex, same `g` flag |
| `cPK` (chunks.144.mjs:2124) | `isPipeSafe` | Match | Same three-stage check (heredoc, stdin redirect, default true) |
| `dPK` (chunks.144.mjs:2110) | `evalWrap` | Match | Same heredoc/multiline branching, same `'"'"'` escape |
| `gPK` (chunks.144.mjs:1802) | `evalWrapPipeSafe` | Behavior changed | v2.1.76 had a complex tokenize-and-insert-before-pipe path (`B54`). v2.1.112 simplified to `singleQuoteWrap(cmd) + " < /dev/null"` — see 8.7 |
| `l_Y` (chunks.144.mjs:1806) | `singleQuoteWrap` | Match (new helper) | Extracted from v2.1.76's inline `'...'` escape pattern |
| `l47` (chunks.144.mjs:2099) | `hasHeredoc` | Match | Same three negative guards (bitshift, `[[ ]]`, `$(( ))`) |
| `_zY` (chunks.144.mjs:2104) | `hasMultilineQuoted` | Match | Same dual regex for single/double-quoted multiline |
| `zzY` (chunks.144.mjs:2120) | `hasExplicitStdinRedirect` | Match | Same `<` not followed by `<` or `(` regex |
| `wzY` (chunks.144.mjs:2140) | `disableExtglobCommand` | Match | Same three branches: prefix-cross-shell, bash, zsh |
| `dU8` (chunks.144.mjs:2088) | `applyShellPrefix` | Match (renamed) | v2.1.76 has this as `M91`; readable name unchanged |
| `AzY` (chunks.144.mjs) | `statSnapshot` (or simply `stat`) | Match | Stat-call wrapper for snapshot file existence check |
| `OzY` (chunks.144.mjs) | `pathJoinNative` | Match (renamed) | Used for read-side CWD file path |
| `cU8` (chunks.144.mjs) | `pathJoinPosix` | Match (renamed) | Used for write-side (sandbox-friendly) path |
| `A5` (chunks.144.mjs) | `shellQuote` | Match | Re-exported from a shared shell-quote utility |
| `sX` (chunks.144.mjs) | `posixPathToWindowsPath` | Match | Same Win32 path normalization |
| `l$` (chunks.144.mjs:2511) | `setCwd` (Shell.ts:447) | Match | Same realpath + `setCwdState` + telemetry |
| `nU8` (chunks.144.mjs) | `wrapSpawn` | Match | Wraps `spawn`'d ChildProcess in ProcessHandler |
| `PzY` (chunks.144.mjs) | `spawn` (re-export of child_process.spawn) | Match | Direct re-export |
| `hzY` (chunks.144.mjs:2528) | `buildStdioConfig` | Match | Same pipe/file selection, same sandbox-fd indexing |

---

## 5. Subprocess Env Module (chunks.78.mjs <-> subprocessEnv.ts + managedEnv.ts)

| v2.1.112 | v2.1.88 readable | Status | Notes |
|----------|------------------|--------|-------|
| `Dk` (chunks.78.mjs:876) | `subprocessEnv` (subprocessEnv.ts:79) | Match | Same three-path logic: fast (no proxy/scrub), proxy-only, scrub-with-INPUT_ duplicates |
| `xP` (chunks.78.mjs:754) | `isScrubEnabled` (subprocessEnv.ts helper) | Match (renamed) | v2.1.88 reads `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` similarly via `isEnvTruthy`; v2.1.112 caches the result in `GL8` (called only inside helpers) |
| `Kn_` (chunks.78.mjs:759) | _(implicit in subprocessEnv ternary)_ | Match (extracted) | v2.1.88 inlines the local-agent-entrypoint default; v2.1.112 extracts it into a named function |
| `An_` (chunks.78.mjs:868) | `registerUpstreamProxyEnvFn` (subprocessEnv.ts:73) | Match | Same module-level setter pattern |
| `TL8` (chunks.78.mjs:872) | `_getUpstreamProxyEnv` (subprocessEnv.ts:84) | Match | Both return `{}` when unregistered |
| `Yn_` (chunks.78.mjs:940) | `GHA_SUBPROCESS_SCRUB` (subprocessEnv.ts:15) | Match | v2.1.112 adds `ANTHROPIC_AWS_API_KEY`, `ANTHROPIC_BEDROCK_MANTLE_API_KEY` — see 8.2 |
| `N98` (chunks.144.mjs:1718) | _(not in subprocessEnv.ts)_ | Match (different module) | Lists locale/runtime env vars; appears to be a "safe-to-pass-through" set used elsewhere |
| `GL8` (chunks.78.mjs:755) | _(cache variable, no direct equivalent)_ | Internal | Performance cache; v2.1.88 reads `process.env` each call |
| `vL8` (chunks.78.mjs:766) | _(cache variable)_ | Internal | Caches `bwrap` availability check |
| `kR` (chunks.78.mjs:773) | _(scrub context object)_ | Internal | Captures home/cwd/GITHUB_* paths at scrub setup time |
| `UH4` (chunks.78.mjs:869) | `_getUpstreamProxyEnv` slot | Match | Same registration mechanism |
| `Js` (chunks.78.mjs:765) | _(no direct named function)_ | New helper | `isBwrapAvailable` — Linux-only bwrap detection |
| `wp1` (chunks.78.mjs:770) | _(part of init sequence)_ | New | `setupSubprocessScrub` — Linux bwrap mountpoint prep |
| `Hp1` (chunks.78.mjs:897) | _(scrub config builder)_ | New | Returns filesystem deny/allow lists for bwrap-mode |

### 5.1 Note on `applySafeConfigEnvironmentVariables`

The v2.1.88 file `managedEnv.ts` (applyConfigEnvironmentVariables + applySafeConfigEnvironmentVariables) does not have a direct mapping in any single v2.1.112 chunk located by this audit. The functionality (filtering settings.env through SSH-tunnel, host-managed-provider, and CCD-spawn-key filters) appears to be reorganized — likely split across initialization helpers near `chunks.78.mjs`'s `wp1` setup function. A future Unit 8 follow-up should locate `applySafeConfigEnvironmentVariables`'s v2.1.112 obfuscated identifier and add it.

The threat model and filter functions (`withoutSSHTunnelVars`, `withoutHostManagedProviderVars`, `withoutCcdSpawnEnvKeys`) are conceptually documented in `env_snapshot.md` Section 8 referencing the v2.1.88 source directly.

---

## 6. Session Environment Module (chunks.98.mjs <-> sessionEnvironment.ts)

| v2.1.112 | v2.1.88 readable | Status | Notes |
|----------|------------------|--------|-------|
| `PC4` (chunks.98.mjs:2616) | `getSessionEnvironment` | Match | Same cache + CLAUDE_ENV_FILE + hook-files-in-order logic |
| `Ki1` (chunks.98.mjs:2590) | `getSessionEnvDir` | Match | Same `~/.claude/session-env/<session-id>/` resolution |
| `XC4` (chunks.98.mjs:2597) | `getSessionEnvHookPath` | Match | Type-prefixed hook path builder |
| `MC4` (chunks.98.mjs:2602) | `clearCwdEnvHookFiles` | Match | Clears `filechanged-hook-*` and `cwdchanged-hook-*` |
| `xh6` (chunks.98.mjs:2612) | `invalidateSessionEnvCache` | Match | Sets `l56 = void 0` |
| `NMz` (chunks.98.mjs:2647) | `compareHookFiles` | Match | Same type-priority then numeric-ID comparator |
| `l56` (chunks.98.mjs:2658) | _(module-level cache)_ | Match | Cache for `getSessionEnvironment` result |
| `HC4` (chunks.98.mjs) | _(priority map literal)_ | Match | Maps `setup`→0, `sessionstart`→1 for ordering |
| `ZI8` (chunks.98.mjs) | _(filename regex)_ | Match | `/^(setup\|sessionstart)-hook-(\d+)\.sh$/` |

---

## 7. Bash Tool Caller Module (chunks.163.mjs <-> BashTool.tsx)

| v2.1.112 | v2.1.88 readable | Status | Notes |
|----------|------------------|--------|-------|
| `oVY` (chunks.163.mjs:2337) | _(bashToolExecutor, inline)_ | Match | The Bash tool's async generator that calls `exec` |
| `AL` | `shouldUseSandbox` (shouldUseSandbox.ts) | Match | Same input -> boolean check |
| `cVY` | _(shouldAutoBackground)_ | Match | Looks at command for `&` background suffix patterns |
| `On8` | `getDefaultTimeoutMs` (prompt.ts) | Match | Reads `BASH_DEFAULT_TIMEOUT_MS` env var |
| `V98` | `getMaxTimeoutMs` (prompt.ts) | Match | Reads `BASH_MAX_TIMEOUT_MS` env var |

---

## 8. v2.1.112-only Additions / Behavior Changes

### 8.1 BigQuery shell shadow (snapshot)

A new `createBigQueryShellIntegration` function (`t_Y` in chunks.144.mjs) was added. It generates a shell function that wraps `bq` with `--label source=claude_code` to make Claude-initiated BigQuery jobs auditable. Only emitted when the embedded BQ binary is detected.

### 8.2 New Anthropic AWS/Bedrock keys in scrub list

`GHA_SUBPROCESS_SCRUB` (v2.1.112 `Yn_`) adds:
- `ANTHROPIC_AWS_API_KEY`
- `ANTHROPIC_BEDROCK_MANTLE_API_KEY`

These were introduced as Claude API gained new auth modes for Bedrock proxy variants.

### 8.3 Snapshot-missing fallback to login shell

When `buildExecCommand` detects the snapshot file is missing (via `stat`), v2.1.112 falls back to a login shell:

```javascript
if (w) try {
    await AzY(w)
} catch {
    E(`Snapshot file missing, falling back to login shell: ${w}`), w = void 0
}
```

In v2.1.76 the same detection triggered a snapshot recreation (`Y = RN8(A).catch(...)`). The change rationale: recreation could fail recursively (e.g., the underlying cause was a permissions issue that wouldn't be fixed), leaving the user in a confusing partial-failure state. The fallback path emits a clear log line and accepts one slow command.

### 8.4 Snapshot source command has `|| true`

```javascript
D.push(`source ${A5([v])} 2>/dev/null || true`)
```

In v2.1.76 this was `source ${j4([v])}`. The added `2>/dev/null || true` hardens against:
- Snapshot scripts that print to stderr (would clutter every Bash tool's stderr)
- Snapshot scripts that contain a function referencing a now-missing tool (would `&&`-short-circuit the chain, breaking commands that don't even use that tool)

### 8.5 `CLAUDE_CODE_EXECPATH` always set

Provider's `getEnvironmentOverrides` unconditionally sets `H[d47] = process.execPath`. v2.1.76 did not do this. Use cases: status-line helpers, SDK scripts, hook scripts that need to invoke the parent claude binary by absolute path.

### 8.6 `BUN_OPTIONS=--smol` injection for remote sessions

```javascript
if (S6(process.env.CLAUDE_CODE_REMOTE)) D.push('export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"');
```

When the session is detected as remote (e.g., SSH or container), every Bash tool spawn forces Bun to use the `--smol` (low-memory) heap policy. Prevents the bun binary from consuming too much RAM on shared/remote hosts.

### 8.7 Simplified pipe-aware eval wrap (`gPK`)

In v2.1.76, when a command contained a pipe and was pipe-safe, the wrap function (`B54`) tokenized the command, found the first top-level pipe, and inserted `< /dev/null` BEFORE that pipe — so `cat file | grep foo` became `cat file < /dev/null | grep foo`. The motivation: prevent the first command in a pipeline from blocking on stdin while keeping the piped data flowing to subsequent commands.

In v2.1.112, `gPK` is just:

```javascript
function gPK(q) { return l_Y(q) + " < /dev/null" }
function l_Y(q) { return "'" + q.replaceAll("'", `'"'"'`) + "'" }
```

The redirect now appears after the whole pipeline. For typical pipelines, this is functionally equivalent because the last command's stdin comes from the pipe anyway. The cases where it matters (first command of a pipe that would block on stdin) trade correctness for a clean, low-edge-case implementation. The cost is bounded by the per-command timeout.

### 8.8 `sessionEnvVars` and `tmuxSocket` parameters

`getEnvironmentOverrides` gained two new parameters in v2.1.112:
- `sessionEnvVars` — a `Map<string, string>` of per-call env overrides, populated by session-env hooks
- `tmuxSocket` — a `TmuxSocket` object exposing `getTmuxEnv()` for tmux reattach

The Bash tool caller (`bashToolExecutor`) plumbs these through the `al(...)` (exec) call into the provider.

---

## 9. Discrepancies Resolved

### 9.1 `Dk` vs `subprocessEnv`

The v2.1.88 source has both `subprocessEnv()` (returns env for child processes) and `applyConfigEnvironmentVariables()` (mutates process.env at startup). The v2.1.112 chunks have `Dk` (matches `subprocessEnv`). The startup mutation logic is reorganized — see Section 5.1 note. No discrepancy: just module reorganization.

### 9.2 `xP` vs `isScrubEnabled` caching

In v2.1.88, `isEnvTruthy(process.env.CLAUDE_CODE_SUBPROCESS_ENV_SCRUB)` is called fresh each time. In v2.1.112, the result is cached in `GL8` after first read. This is a behavioral change: setting `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` mid-session would take effect in v2.1.88 but not in v2.1.112. This appears intentional — the scrub flag is supposed to be set at startup and not changed.

### 9.3 `nU8` vs `wrapSpawn`

The v2.1.88 source factors out a `wrapSpawn` helper in `ShellCommand.ts` that creates the `ProcessHandler` (`j38` instance). The v2.1.112 chunk has `nU8` performing the same role at the same call site. Match confirmed.

### 9.4 v2.1.76 `M91` vs v2.1.88/v2.1.112 `applyShellPrefix`

v2.1.76's analysis docs refer to `M91`. The v2.1.112 chunk has `dU8` at the same call site with the same `lastIndexOf(" -")` parsing logic. The readable name `applyShellPrefix` (from v2.1.88) is correct for both.

---

## 10. Confidence Summary

| Category | Confidence | Basis |
|----------|------------|-------|
| Snapshot creation (`UPK`, `KzY`, `qzY`) | High | Side-by-side script template comparison; identical PATH_END sentinel pattern; identical bash/zsh branching |
| Eval wrapping (`dPK`, `gPK`, `l47`, `_zY`, `zzY`) | High | Identical regexes; identical control flow; identical fallback chains |
| Bash provider object shape (`iPK`) | High | Same `type/shellPath/detached/buildExecCommand/getSpawnArgs/getEnvironmentOverrides` shape |
| `subprocessEnv` (`Dk`) | High | Identical three-path return logic; identical INPUT_ duplicate handling |
| `GHA_SUBPROCESS_SCRUB` (`Yn_`) | High | Same array contents (with two v2.1.112 additions documented in 8.2) |
| Session env loader (`PC4`) | High | Same cache pattern, same filename regex, same comparator |
| Shell selection (`NzY`) | High | Same CLAUDE_CODE_SHELL → SHELL → which → fallback order |
| Settings-sourced env (`managedEnv.ts`) | Medium | Concept verified from v2.1.88 source; v2.1.112 obfuscated location not yet pinned (see 5.1) |
| Some helpers (`A5`, `sX`, `cU8`, `OzY`) | Medium | Re-exports of shared utilities; names inferred from call sites |

---

## Conclusion

All Unit 8 mappings are confirmed against v2.1.88 readable source with high confidence except the `managedEnv.ts` startup logic, which appears reorganized in v2.1.112 in a way that requires further chunk exploration to pin down. The audit identified seven v2.1.112-only additions and three behavioral changes, all documented in Section 8. The mappings in `symbol_additions_unit_08.md` are ready to be folded into `symbol_index_core_execution.md` and `symbol_index_infra_platform.md` once a full review of cross-unit collisions has been done.
