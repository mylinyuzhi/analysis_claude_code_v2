# Cross-Validation: v2.1.88 Readable Names <-> v2.1.142 Obfuscated (Unit 04)

> Audit of symbol mappings used in the 38_shell_snapshot module for v2.1.142. Verifies each obfuscated identifier against the v2.1.88 readable source and against the v2.1.112 prior analysis. Resolves discrepancies and records v2.1.142-only additions and changes.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Unit 04 mappings (this audit's output)

---

## 1. Methodology

For each obfuscated symbol in v2.1.142's `cli_inner_pretty.js` referenced in this module's docs, the audit:

1. Located the obfuscated function/variable in the bundle.
2. Cross-referenced the v2.1.88 readable source (`/lyz/codespace/3rd/claude-code/src/utils/bash/ShellSnapshot.ts`, `src/utils/Shell.ts`, etc.).
3. Cross-referenced the v2.1.112 obfuscated equivalent (`/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.112/source/chunks.144.mjs` and the prior unit docs).
4. Compared signatures, behavior, and call patterns across all three versions.
5. Recorded the result: **Match**, **Renamed**, **Behavior changed**, **v2.1.142-only**, or **v2.1.112-only**.

A symbol counts as **Match** when the readable name in v2.1.88 source is functionally identical to the obfuscated counterpart in v2.1.142 (allowing for trivial transformations). It counts as **Behavior changed** when the function exists in both but has differing semantics. It counts as **v2.1.142-only** when there's no v2.1.112 / v2.1.88 equivalent.

---

## 2. Snapshot Module (cli_inner_pretty.js ↔ v2.1.112 chunks.144.mjs ↔ v2.1.88 ShellSnapshot.ts)

| v2.1.142 | v2.1.112 | v2.1.88 readable | Status | Notes |
|----------|----------|------------------|--------|-------|
| `ip7` (cli_inner_pretty:360697) | `UPK` (chunks.144:1994) | `createAndSaveSnapshot` (ShellSnapshot.ts:413) | Match | Same async-resolve-only-Promise pattern; same callback handling |
| `Oi_` (cli_inner_pretty:360661) | `KzY` (chunks.144:1957) | `getSnapshotScript` (ShellSnapshot.ts:345) | Match | Same script template, identical PATH_END_<rand> sentinel pattern |
| `fi_` (cli_inner_pretty:360597) | `qzY` (chunks.144:1898) | `getClaudeCodeSnapshotContent` (ShellSnapshot.ts:269) | Match | Same heredoc-injection pattern; BQ shadow remains as null stub |
| `Yi_` (cli_inner_pretty:360538) | `e_Y` (chunks.144:1845) | `getUserSnapshotContent` (ShellSnapshot.ts:197) | Match | Same zsh/bash branching, same base64 function dump for bash |
| `Sv6` (cli_inner_pretty:360534) | `Q47` (chunks.144:1840) | `getConfigFile` (ShellSnapshot.ts:181) | Match | Same `.zshrc`/`.bashrc`/`.profile` selection |
| `Ki_` (cli_inner_pretty:360509) | `o_Y` (chunks.144:1816) | `createRipgrepShellIntegration` (ShellSnapshot.ts:65) | Match | Same alias/function discrimination based on `rgCommand.argv0` |
| `Ai_` (cli_inner_pretty:360516) | `s_Y` (chunks.144:1830) | `createFindGrepShellIntegration` (ShellSnapshot.ts:153) | **Behavior changed** | v2.1.142 passes 4-arg `Iv6` call with deny patterns for grep |
| `zi_` (cli_inner_pretty:360531) | `t_Y` (chunks.144:1836) | _(missing in v2.1.88)_ | Match | Both return null; forward-compat stub |
| `Iv6` (cli_inner_pretty:360476) | `U47` (chunks.144:1810) | `createArgv0ShellFunction` (ShellSnapshot.ts:35) | **Behavior changed** | v2.1.142: 4 args (adds `denyPatterns`); baked install path replaces `command -v claude` |
| `_i_` (cli_inner_pretty:360816) | `a_Y` (chunks.144:2085) | `VCS_DIRECTORIES_TO_EXCLUDE` (ShellSnapshot.ts:98) | Match | Same array `[".git",".svn",".hg",".bzr",".jj",".sl"]` |
| `hv6` (cli_inner_pretty:360694) | `g47` (chunks.144:1988) | `SNAPSHOT_CREATION_TIMEOUT` (ShellSnapshot.ts:24) | Match | Both `10000` ms |
| `yv6` (cli_inner_pretty:360693) | `p47` (chunks.144:1986) | `LITERAL_BACKSLASH` (ShellSnapshot.ts:23) | Match | Both `'\\'` |
| `Rv6` (cli_inner_pretty:360695) | `d47` (chunks.144:1990) | _(no name)_ — `'CLAUDE_CODE_EXECPATH'` string literal | Match (renamed) | All three versions use the same env var name |
| `ne` (cli_inner_pretty:313906) | _(not present)_ | _(not present)_ | **v2.1.142-only** | Returns `~/.local/bin`; baked into argv0 functions |
| `dM` (cli_inner_pretty:141600) | `$H` (chunks.144) | `hasEmbeddedSearchTools` (ShellSnapshot.ts) | **Behavior changed** | v2.1.142 removed `EMBEDDED_SEARCH_TOOLS=1` env var gate; always true on non-SDK |
| `bM6` (cli_inner_pretty:230997) | `RG4` (chunks.88:2728) | `getPluginBinPaths` (managedEnv.ts adjacent) | Match | Same metachar filtering, same `.path/bin` join |

---

## 3. Shell Provider Module (cli_inner_pretty.js ↔ chunks.144 ↔ bashProvider.ts)

| v2.1.142 | v2.1.112 | v2.1.88 readable | Status | Notes |
|----------|----------|------------------|--------|-------|
| `$U7` (cli_inner_pretty:360867) | `iPK` (chunks.144:2147) | `createBashShellProvider` (bashProvider.ts) | **Behavior changed** | v2.1.142 adds `recordSpanSuccess` on `.then` and `missingTelemetryFired` one-shot flag |
| `tY8` (cli_inner_pretty:518960) | `al` (chunks.144:2369) | `exec` (Shell.ts:181) | Match | Same orchestrator structure |
| (analogous to v2.1.112's `EzY`) | `EzY` (chunks.144:2358) | `getShellConfigImpl` (Shell.ts:139) | Match | Same findSuitableShell + provider factory pattern |

---

## 4. Command Assembly (cli_inner_pretty.js ↔ chunks.144 ↔ bashProvider.ts)

| v2.1.142 | v2.1.112 | v2.1.88 readable | Status | Notes |
|----------|----------|------------------|--------|-------|
| `sp7` (cli_inner_pretty:360853) | `lPK` (chunks.144:2130) | `substituteNulRedirect` (bashProvider helpers) | Match | Identical regex |
| `Di_` (cli_inner_pretty:360858) | `YzY` (chunks.144:2134) | `NUL_REDIRECT_REGEX` | Match | Same regex, same `g` flag |
| `ap7` (cli_inner_pretty:360848) | `cPK` (chunks.144:2124) | `isPipeSafe` | Match | Same three-stage check |
| `op7` (cli_inner_pretty:360836) | `dPK` (chunks.144:2110) | `evalWrap` | Match | Same heredoc/multiline branching |
| `lp7` (cli_inner_pretty:360470) | `gPK` (chunks.144:1802) | `evalWrapPipeSafe` | Match | Both simplified to `singleQuoteWrap + " < /dev/null"` |
| `qi_` (cli_inner_pretty:360473) | `l_Y` (chunks.144:1806) | `singleQuoteWrap` | Match | Same shell single-quote escape |
| `bv6` (cli_inner_pretty:360827) | `l47` (chunks.144:2099) | `hasHeredoc` | Match | Same three negative guards |
| `Mi_` (cli_inner_pretty:360831) | `_zY` (chunks.144:2104) | `hasMultilineQuoted` | Match | Same dual regex |
| `wi_` (cli_inner_pretty:360845) | `zzY` (chunks.144:2120) | `hasExplicitStdinRedirect` | Match | Same regex |
| `ji_` (cli_inner_pretty:360860) | `wzY` (chunks.144:2140) | `disableExtglobCommand` | Match | Same three branches |
| `nY8` (cli_inner_pretty:360818) | `dU8` (chunks.144:2088) | `applyShellPrefix` | Match | Same `lastIndexOf(" -")` parsing |
| `W4` (referenced throughout) | `A5` (referenced throughout) | `shellQuote` | Match | Re-exported from a shared shell-quote utility |
| `MP` (referenced throughout) | `sX` (referenced throughout) | `posixPathToWindowsPath` / `toCygwinPath` | Match | Same Win32 path normalization (memoised) |
| `ZK7` (cli_inner_pretty:236437) | `PC4` (chunks.98:2616) | `getSessionEnvironment` | Match | Same cache + CLAUDE_ENV_FILE + hook-files-in-order logic |

---

## 5. Subprocess Env Module (cli_inner_pretty.js ↔ chunks.78 ↔ subprocessEnv.ts)

| v2.1.142 | v2.1.112 | v2.1.88 readable | Status | Notes |
|----------|----------|------------------|--------|-------|
| `XI` (cli_inner_pretty:197531) | `Dk` (chunks.78:876) | `subprocessEnv` (subprocessEnv.ts:79) | **Behavior changed** | v2.1.142 always strips `OTEL_*`, adds 10 bg-session keys to scrub, condenses GHA scrub list |
| `Ts1` (cli_inner_pretty:197681) | `Yn_` (chunks.78:940) | `GHA_SUBPROCESS_SCRUB` (subprocessEnv.ts:15) | **Behavior changed** | v2.1.142 removed OTEL header keys (now covered by general OTEL strip) |
| `Vs1` (cli_inner_pretty:197525) | `An_` (chunks.78:868) | `registerUpstreamProxyEnvFn` (subprocessEnv.ts:73) | Match | Same setter pattern |
| `lt$` (cli_inner_pretty:197528) | `TL8` (chunks.78:872) | `_getUpstreamProxyEnv` (subprocessEnv.ts:84) | Match | Both return `{}` when unregistered |
| `Ws1` (cli_inner_pretty) | `Kn_` (chunks.78:759) | `shouldScrubSubprocessEnv` | Match | Same scrub-mode resolution |

---

## 6. Cleanup Module (cli_inner_pretty.js ↔ chunks ↔ cleanup.ts)

These functions are v2.1.117 additions. The v2.1.112 equivalents do not exist (except `Rr` which existed for other directory sweeps).

| v2.1.142 | v2.1.112 | v2.1.88 readable | Status | Notes |
|----------|----------|------------------|--------|-------|
| `al5` (cli_inner_pretty:555525) | _(not present)_ | _(not present in v2.1.88)_ | **v2.1.142-only (v2.1.117 add)** | `cleanupShellSnapshots` — sweep for shell-snapshots/ |
| `nl5` (cli_inner_pretty:555482) | _(not present)_ | _(not present)_ | **v2.1.142-only (v2.1.117 add)** | `cleanupTasks` — sweep for tasks/ |
| `tl5` (cli_inner_pretty:555605) | _(not present)_ | _(not present)_ | **v2.1.142-only (v2.1.117 add)** | `cleanupBackups` — sweep for backups/ |
| `Rr` (cli_inner_pretty:555400) | _(equivalent existed)_ | `cleanupByExtension` | Match (extended) | Same logic, now used by 3 more sweeps |
| `Xd` (cli_inner_pretty:555297) | _(equivalent existed)_ | `cleanupByMtime` | Match | Stat + mtime-compare + unlink |
| `c$H` (cli_inner_pretty:555301) | _(equivalent existed)_ | `removeIfEmpty` | Match | rmdir if empty |
| `aB4` (cli_inner_pretty:555633) | _(equivalent existed)_ | `runRetentionCleanup` | Match (extended) | Sequence now includes the 3 new sweeps |
| `l$H` (cli_inner_pretty:555245) | _(equivalent existed)_ | `getRetentionCutoff` | Match | Same cutoff computation |
| `Bl5` (cli_inner_pretty:555226) | _(equivalent existed)_ | `shouldRunCleanup` | Match | Same three-condition gate |
| `ml5` (cli_inner_pretty:555659) | _(equivalent existed)_ | `DEFAULT_CLEANUP_DAYS` | Match | `30` |

---

## 7. Spawn Env Module (cli_inner_pretty.js ↔ chunks.144 ↔ ShellCommand.ts)

| v2.1.142 | v2.1.112 | v2.1.88 readable | Status | Notes |
|----------|----------|------------------|--------|-------|
| `v$` (used at 361228) | _(equivalent existed)_ | `getCurrentSessionId` | Match | Returns the session UUID |
| `CT8` (used at 361227) | _(equivalent existed)_ | `getAiAgentTag` | Match | Returns the value for `AI_AGENT` env var |
| Spawn env merge (361221-361232) | (chunks.144:2456) | (ShellCommand.ts) | **Behavior changed** | v2.1.142 adds `CLAUDE_CODE_SESSION_ID: v$()` and `AI_AGENT: CT8("agent")` |

---

## 8. v2.1.142-Only Additions

### 8.1 `ne` (getInstallBinDir) — baked install path

```javascript
function ne(H) {
  let { home: $ } = u_8(H);
  return gD$.join($, ".local", "bin");
}
```

Returns `${HOME}/.local/bin`. Used by `Iv6` to bake the install path into the argv0 dispatch function. New in v2.1.142.

### 8.2 `Iv6` 4th argument (`denyPatterns`)

The signature of `createArgv0ShellFunction` went from 3 args in v2.1.112 (`funcName, argv0, prependArgs`) to 4 args in v2.1.142 (`funcName, argv0, prependArgs, denyPatterns`). The new arg emits a `for ... case` block at the top of the function body that dispatches to system tools when any user arg matches the patterns.

### 8.3 `Ai_` deny-pattern list for grep

The `createFindGrepShellIntegration` now passes the v2.1.142 deny-pattern list:
```javascript
["-*-filter*", "-*-pager*", "-*-view*", "-*-format-open*", "-*-config*", "---*", "-@*", "-*-save-config*"]
```

### 8.4 `$U7` OTEL span recording

```javascript
ip7(H).then((z) => { return (RH("shell_snapshot_create"), z); }).catch((z) => { ...; J8("shell_snapshot_create", "snapshot_failed"); return; })
```

`RH` (recordSpanSuccess) and `J8` (recordSpanFailure) are OTEL helpers. v2.1.112 only had `.catch` with no span recording on success.

### 8.5 `$U7` one-shot `missingTelemetryFired` flag

The closure now includes an `A = !1` boolean that's flipped to `!0` on first detection of a missing snapshot file:
```javascript
if ((N(`Snapshot file missing, falling back to login shell: ${f}`), !A))
  ((A = !0), J8("shell_snapshot_create", "snapshot_missing_at_exec"));
```

Prevents telemetry flooding when 50 Bash tool calls happen after the snapshot file is deleted.

### 8.6 `XI` (subprocessEnv) OTEL strip

```javascript
for (let O of Object.keys(f)) if (O.startsWith("OTEL_")) delete f[O];
```

Unconditional `OTEL_*` strip, replacing v2.1.112's GHA-mode-only scrub of four specific OTEL header keys.

### 8.7 `XI` background-session scrub

Ten new env keys deleted from subprocess env when present in parent env:
- `CLAUDE_CODE_OAUTH_TOKEN`, `CLAUDE_CODE_SUBSCRIPTION_TYPE`, `CLAUDE_CODE_RATE_LIMIT_TIER`, `CLAUDE_BG_AUTH_SNAPSHOT_PATH` (auth)
- `CLAUDE_CODE_SESSION_KIND`, `CLAUDE_BG_SOURCE`, `CLAUDE_BG_ISOLATION`, `CLAUDE_BG_BACKEND`, `CLAUDE_CODE_SESSION_NAME`, `CLAUDE_CODE_RESUME_INTERRUPTED_TURN` (orchestration)

### 8.8 Bash tool spawn env: `CLAUDE_CODE_SESSION_ID` and `AI_AGENT`

```javascript
CLAUDE_CODE_SESSION_ID: v$(),     // NEW v2.1.132
AI_AGENT: CT8("agent"),           // NEW v2.1.120
```

Set in the Bash tool spawn env (subprocess starts with these), not in the snapshot script.

### 8.9 `dM` (hasEmbeddedSearchTools) gate simplification

```javascript
function dM() {
  if (!bH("true")) return !1;     // always passes; gate effectively removed
  let H = process.env.CLAUDE_CODE_ENTRYPOINT;
  return H !== "sdk-ts" && H !== "sdk-py" && H !== "sdk-cli" && H !== "local-agent";
}
```

v2.1.112's check was `if (!S6(process.env.EMBEDDED_SEARCH_TOOLS)) return !1`. v2.1.142 removed the env-var gate.

### 8.10 Retention cleanup for shell-snapshots/

The `al5()` function is the new entry; the broader `aB4` orchestrator now includes it. Documented in [retention_cleanup.md](./retention_cleanup.md).

---

## 9. v2.1.142 Behavioral Changes Summary

| Function | v2.1.112 behaviour | v2.1.142 behaviour | Why |
|----------|--------------------|---------------------|-----|
| `createArgv0ShellFunction` | 3 args; env var → `command -v claude` → fail | 4 args (adds denyPatterns); env var → baked `~/.local/bin/claude` → system tool | PATH-hijack defence; UX-safe grep |
| `createFindGrepShellIntegration` | Calls Iv6 with 3 args | Calls Iv6 with 4 args (deny patterns for grep) | UX: ugrep-only flags fall through |
| `hasEmbeddedSearchTools` | Required `EMBEDDED_SEARCH_TOOLS=1` env var | Always true on non-SDK builds | v2.1.117 made embedded tools mandatory |
| `subprocessEnv` | Scrubs 24 GHA secrets + 4 OTEL header keys (in scrub mode) | Always strips all `OTEL_*` + 21 GHA secrets (in scrub mode) + 10 bg-session keys (always) | v2.1.128 OTEL fix, background-session isolation |
| Bash tool spawn env | Has fixed keys SHELL/GIT_EDITOR/CLAUDECODE + providerOverrides | Adds AI_AGENT + CLAUDE_CODE_SESSION_ID | v2.1.120, v2.1.132 |
| `createBashShellProvider` | `.catch` only | `.then(recordSpanSuccess)` + `.catch(recordSpanFailure)` | OTEL observability |
| `buildExecCommand` snapshot-missing | Per-command debug log | One-shot OTEL span failure | Telemetry hygiene |
| `buildExecCommand` snapshot-verify | `stat` | `fs.access` | Slightly cheaper; same semantics |
| Cleanup sweep coverage | Several dirs, no shell-snapshots | All same dirs + shell-snapshots + tasks + backups | v2.1.117 retention extension |

---

## 10. Discrepancies Resolved

### 10.1 `command -v claude` vs baked install path

The v2.1.112 deobfuscation noted that v2.1.88 baked the binary path at generation time, and v2.1.112 introduced the env-var-then-`command -v` resolution. v2.1.142 is a third design point: env var → baked install path → system tool. This is documented in [argv0_dispatch.md](./argv0_dispatch.md) Section 5.

The baked path is computed at snapshot generation time (`getInstallBinDir()` is called from `Iv6` when emitting the function body), but it's a stable canonical location, not the running binary's path. So snapshots remain portable across binary upgrades — what was "binary path was baked at generation time" in v2.1.88 is now "install location was baked at generation time" in v2.1.142. The user's claude binary moves don't affect the snapshot because:
- The env var `CLAUDE_CODE_EXECPATH` is set by every Bash tool spawn to the *current* running binary.
- The baked install path points at the canonical install location, not the (possibly temporary) running path.

### 10.2 OTEL header keys in `GHA_SUBPROCESS_SCRUB`

v2.1.112's `Yn_` included `OTEL_EXPORTER_OTLP_HEADERS`, `OTEL_EXPORTER_OTLP_LOGS_HEADERS`, `OTEL_EXPORTER_OTLP_METRICS_HEADERS`, `OTEL_EXPORTER_OTLP_TRACES_HEADERS`. v2.1.142's `Ts1` doesn't have these — they're covered by the unconditional `OTEL_*` strip in `XI` itself.

The threat model is unchanged (prevent OTEL header values leaking to subprocesses), but the implementation is now broader: all `OTEL_*` keys, not just the four header keys.

### 10.3 `tmuxSocket` parameter removed from `getEnvironmentOverrides`

v2.1.112's `getEnvironmentOverrides` signature was `(command, sessionEnvVars, tmuxSocket)`. v2.1.142's is `(command, sessionEnvVars)`. The tmux feature is dormant (no socket capture happens in v2.1.142), so the parameter was removed.

The function body still has the `let f = null` declaration (the would-be tmux socket value) and the `if (f) overrides.TMUX = f` branch, but `f` is never assigned a non-null value. This is dead code preserved for the same reason as `dM`'s `bH("true")` check — documents intent for future reactivation.

### 10.4 `bH("true")` always-true check in `dM`

This is the "dead-code gate" pattern. The function shape is preserved so a future opt-out flag can be added by replacing the literal `"true"` with `process.env.EMBEDDED_SEARCH_TOOLS` (restoring v2.1.112 behaviour) or any other condition. Currently, embedded tools are always enabled on non-SDK builds.

---

## 11. Confidence Summary

| Category | Confidence | Basis |
|----------|------------|-------|
| Snapshot creation (`ip7`, `Oi_`, `fi_`) | High | Side-by-side script template comparison; identical PATH_END sentinel pattern; same bash/zsh branching |
| Eval wrapping (`op7`, `lp7`, `bv6`, `Mi_`, `wi_`) | High | Identical regexes; identical control flow; identical fallback chains |
| Bash provider object shape (`$U7`) | High | Same `type/shellPath/detached/buildExecCommand/getSpawnArgs/getEnvironmentOverrides` shape with documented additions |
| `subprocessEnv` (`XI`) | High | Identical fast-path/slow-path structure; documented v2.1.128/v2.1.142 additions to the scrub list |
| `GHA_SUBPROCESS_SCRUB` (`Ts1`) | High | Same array contents (with documented v2.1.142 OTEL removal) |
| Session env loader (`ZK7`) | High | Behavior preserved from v2.1.112 |
| `createArgv0ShellFunction` (`Iv6`) | High | Branch-by-branch analysis confirmed; deny-pattern feature is a clear additive change |
| `createFindGrepShellIntegration` (`Ai_`) | High | Same flag list; deny patterns are clearly visible in the source |
| `hasEmbeddedSearchTools` (`dM`) | High | The `bH("true")` always-true gate is unambiguous |
| Retention cleanup (`aB4`, `al5`, `Rr`, etc.) | High | The orchestrator chain and per-directory sweep helpers are clearly visible |
| `CLAUDE_CODE_SESSION_ID` injection (361228) | High | Direct source quote |
| `OTEL_*` strip (197562) | High | Direct source quote |

---

## 12. Conclusion

All v2.1.142 mappings used in this module's docs are confirmed against v2.1.88 readable source and v2.1.112 obfuscated prior with high confidence. The audit identified:

- **3 new v2.1.142-only functions** (`ne` install-bin-dir helper; the three v2.1.117 cleanup sweeps `al5`, `nl5`, `tl5`)
- **5 behavior changes** in functions present in v2.1.112 (`Iv6`, `Ai_`, `dM`, `XI`, `$U7`)
- **2 v2.1.132-specific env additions** in the Bash tool spawn (`CLAUDE_CODE_SESSION_ID`, `AI_AGENT`)
- **1 v2.1.128 env behavior change** (`OTEL_*` always stripped)

These changes are documented in dedicated module docs:
- [argv0_dispatch.md](./argv0_dispatch.md) — `Iv6` 4-arg signature and baked install path
- [find_grep_integration.md](./find_grep_integration.md) — `Ai_` deny-pattern usage
- [embedded_search_tools.md](./embedded_search_tools.md) — `dM` gate simplification and v2.1.121 fallback
- [env_snapshot.md](./env_snapshot.md) — `XI` OTEL strip and background-session scrub
- [bash_tool_integration.md](./bash_tool_integration.md) — `$U7` OTEL span recording and `CLAUDE_CODE_SESSION_ID` injection
- [retention_cleanup.md](./retention_cleanup.md) — `al5` and the broader v2.1.117 cleanup extension

The mappings are ready to be folded into the appropriate symbol_index files once cross-unit symbol collisions have been resolved.
