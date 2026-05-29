# Symbol Additions — v2.1.142 Unit 04 (38_shell_snapshot)

> Obfuscated → readable mapping for all symbols used by the v2.1.142 shell-snapshot module deobfuscation. Source: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`.

---

## Module: Snapshot Creation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ip7` | `createAndSaveSnapshot` | cli_inner_pretty.js:360697-360798 | function |
| `Oi_` | `getSnapshotScript` | cli_inner_pretty.js:360661-360688 | function |
| `Yi_` | `getUserSnapshotContent` | cli_inner_pretty.js:360538-360596 | function |
| `fi_` | `getClaudeCodeSnapshotContent` | cli_inner_pretty.js:360597-360660 | function |
| `Sv6` | `getConfigFile` | cli_inner_pretty.js:360534-360537 | function |
| `Iv6` | `createArgv0ShellFunction` | cli_inner_pretty.js:360476-360508 | function |
| `Ki_` | `createRipgrepShellIntegration` | cli_inner_pretty.js:360509-360515 | function |
| `Ai_` | `createFindGrepShellIntegration` | cli_inner_pretty.js:360516-360530 | function |
| `zi_` | `createBigQueryShellIntegration` | cli_inner_pretty.js:360531-360533 | function |
| `_i_` | `VCS_DIRECTORIES_TO_EXCLUDE` | cli_inner_pretty.js:360816 | constant |
| `hv6` | `SNAPSHOT_CREATION_TIMEOUT` | cli_inner_pretty.js:360694 | constant |
| `yv6` | `LITERAL_BACKSLASH` | cli_inner_pretty.js:360693 | constant |
| `Rv6` | `CLAUDE_CODE_EXECPATH_ENV` | cli_inner_pretty.js:360695 | constant |
| `ne` | `getInstallBinDir` | cli_inner_pretty.js:313906-313909 | function |
| `np7` | `require("child_process")` (module ref) | cli_inner_pretty.js:360815 | variable |
| `cY8` | `require("fs/promises")` (module ref) | cli_inner_pretty.js:360815 | variable |
| `lY8` | `require("os")` (module ref) | cli_inner_pretty.js:360815 | variable |
| `vX$` | `require("path")` (module ref) | cli_inner_pretty.js:360815 | variable |

---

## Module: Shell Provider

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$U7` | `createBashShellProvider` | cli_inner_pretty.js:360867-360939 | function |
| `ep7` | `require("fs/promises")` (provider scope) | cli_inner_pretty.js:360952 | variable |
| `HU7` | `require("path")` (provider scope) | cli_inner_pretty.js:360952 | variable |
| `kX$` | `require("path/posix")` | cli_inner_pretty.js:360952 | variable |

---

## Module: Command Assembly

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `sp7` | `substituteNulRedirect` | cli_inner_pretty.js:360853-360855 | function |
| `Di_` | `NUL_REDIRECT_REGEX` | cli_inner_pretty.js:360858 | constant |
| `ap7` | `isPipeSafe` | cli_inner_pretty.js:360848-360852 | function |
| `op7` | `evalWrap` | cli_inner_pretty.js:360836-360844 | function |
| `lp7` | `evalWrapPipeSafe` | cli_inner_pretty.js:360470-360472 | function |
| `qi_` | `singleQuoteWrap` | cli_inner_pretty.js:360473-360475 | function |
| `bv6` | `hasHeredoc` | cli_inner_pretty.js:360827-360830 | function |
| `Mi_` | `hasMultilineQuoted` | cli_inner_pretty.js:360831-360835 | function |
| `wi_` | `hasExplicitStdinRedirect` | cli_inner_pretty.js:360845-360847 | function |
| `ji_` | `disableExtglobCommand` | cli_inner_pretty.js:360860-360866 | function |
| `nY8` | `applyShellPrefix` | cli_inner_pretty.js:360818-360825 | function |
| `Cv6` | `(empty placeholder fn)` | cli_inner_pretty.js:360826 | function |

---

## Module: Bash Executor

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `tY8` | `exec` (top-level shell executor) | cli_inner_pretty.js:518960 | function |
| `Vi_` | `buildStdioConfig` (referenced 361234) | cli_inner_pretty.js | function |

---

## Module: Search Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dM` | `hasEmbeddedSearchTools` | cli_inner_pretty.js:141600-141604 | function |
| `aGH` | `ripgrepCommand` | cli_inner_pretty.js:197760-197763 | function |
| `$Y$` | `getRipgrepConfig` | cli_inner_pretty.js:197969-197983 | function (memoised) |
| `hgK` | `clearRipgrepCache` | cli_inner_pretty.js:197932-197934 | function |
| `EgK` | `getRipgrepStatus` | cli_inner_pretty.js:197928-197930 | function |
| `vgK` | `spawnRipgrep` | cli_inner_pretty.js:197767-197813 | function |
| `JY` | `isInBundledMode` | cli_inner_pretty.js:197974 (referenced) | function |
| `Fx` | `which` (path lookup) | cli_inner_pretty.js (referenced) | function (memoised) |
| `FA6` | `findExecutable` | cli_inner_pretty.js:197971 (referenced) | function |

---

## Module: Subprocess Env

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `XI` | `subprocessEnv` | cli_inner_pretty.js:197531-197566 | function |
| `Ts1` | `GHA_SUBPROCESS_SCRUB` | cli_inner_pretty.js:197681-197703 | constant |
| `Ws1` | `shouldScrubSubprocessEnv` | cli_inner_pretty.js (referenced) | function |
| `lt$` | `getUpstreamProxyEnv` | cli_inner_pretty.js:197528-197530 | function |
| `Vs1` | `registerUpstreamProxyEnvFn` | cli_inner_pretty.js:197525-197527 | function |
| `PgK` | `upstreamProxyEnvFn` | cli_inner_pretty.js:197526 | variable |
| `DgK` | `buildProxyEnv` | cli_inner_pretty.js (referenced) | function |
| `bH` | `parseExplicitTrue` | cli_inner_pretty.js:1769-1774 | function |
| `E4` | `parseExplicitFalse` | cli_inner_pretty.js:1775-1780 | function |
| `MP` | `posixPathToWindowsPath` (memoised) | cli_inner_pretty.js:42851 | variable (function value) |
| `sLH` | `windowsPathToPosix` (memoised) | cli_inner_pretty.js:42861 | variable (function value) |
| `c$` | `getPlatform` | cli_inner_pretty.js (referenced) | function |
| `W4` | `shellQuote` | cli_inner_pretty.js:173384 | function |

---

## Module: Plugin Bin Discovery

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bM6` | `getPluginBinPaths` | cli_inner_pretty.js:230997-231006 | function |
| `lY` | `getEnabledPlugins` | cli_inner_pretty.js (referenced) | function |
| `pq` | `require("path")` (plugin scope) | cli_inner_pretty.js (referenced) | variable |

---

## Module: Session Env Hooks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ZK7` | `getSessionEnvironment` | cli_inner_pretty.js:236437 | function |

---

## Module: Retention Cleanup (NEW v2.1.117 → v2.1.142)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aB4` | `runRetentionCleanup` | cli_inner_pretty.js:555633-555657 | function |
| `Bl5` | `shouldRunCleanup` | cli_inner_pretty.js:555226-555244 | function |
| `l$H` | `getRetentionCutoff` | cli_inner_pretty.js:555245-555251 | function |
| `Rr` | `cleanupByExtension` | cli_inner_pretty.js:555400-555421 | function |
| `Xd` | `cleanupByMtime` | cli_inner_pretty.js:555297-555300 | function |
| `c$H` | `removeIfEmpty` | cli_inner_pretty.js:555301-555305 | function |
| `oB4` | `cleanupDatedJsonl` | cli_inner_pretty.js:555259-555275 | function |
| `Ul5` | `cleanupErrorLogs` | cli_inner_pretty.js:555276-555296 | function |
| `Fl5` | `cleanupTranscripts` | cli_inner_pretty.js:555306-555399 | function |
| `dl5` | `cleanupPlans` | cli_inner_pretty.js:555446-555449 | function |
| `cl5` | `cleanupFileHistory` | cli_inner_pretty.js:555476-555478 | function |
| `ll5` | `cleanupSessionEnv` | cli_inner_pretty.js:555479-555481 | function |
| `nl5` | `cleanupTasks` (NEW v2.1.117) | cli_inner_pretty.js:555482-555484 | function |
| `TZ8` | `cleanupClaudeSubdir` | cli_inner_pretty.js:555450-555475 | function |
| `il5` | `cleanupUsageData` | cli_inner_pretty.js:555485-555494 | function |
| `rl5` | `cleanupTmpTranscripts` | cli_inner_pretty.js:555495-555521 | function |
| `el5` | `cleanupDebug` | cli_inner_pretty.js:555608-555629 | function |
| `Hn5` | `cleanupFeedbackBundles` | cli_inner_pretty.js:555630-555632 | function |
| `ol5` | `cleanupDumpPrompts` | cli_inner_pretty.js:555522-555524 | function |
| `al5` | `cleanupShellSnapshots` (NEW v2.1.117) | cli_inner_pretty.js:555525-555527 | function |
| `sl5` | `cleanupJobsAndDaemon` | cli_inner_pretty.js:555528-555604 | function |
| `tl5` | `cleanupBackups` (NEW v2.1.117) | cli_inner_pretty.js:555605-555607 | function |
| `gl5` | `cleanupHfiAuth` | cli_inner_pretty.js:555422-555433 | function |
| `Ql5` | `cleanupMcpNeedsAuth` | cli_inner_pretty.js:555434-555445 | function |
| `ml5` | `DEFAULT_CLEANUP_DAYS` | cli_inner_pretty.js:555659 | constant |
| `b8` | `getClaudeConfigHomeDir` | cli_inner_pretty.js (referenced) | function |
| `C$` | `getFsImplementation` | cli_inner_pretty.js (referenced) | function |
| `XA` | `require("path")` (cleanup scope) | cli_inner_pretty.js:555683 | variable |

---

## Module: Spawn Env Injection (Bash Tool)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `v$` | `getCurrentSessionId` | cli_inner_pretty.js:361228 (use) | function |
| `CT8` | `getAiAgentTag` | cli_inner_pretty.js:361227 (use) | function |
| `YU7` | `require("child_process")` (exec scope) | cli_inner_pretty.js | variable |
| `KD` | `setCwd` | cli_inner_pretty.js (referenced) | function |
| `xRH` | `isCwdChangeSuppressed` | cli_inner_pretty.js (referenced) | function |
| `$QH` | `invalidateSessionEnvCache` | cli_inner_pretty.js (referenced) | function |
| `r77` | `onCwdChangedForHooks` | cli_inner_pretty.js (referenced) | function |

---

## Module: Telemetry / Spans

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `d` | `logEvent` (`tengu_*` metrics) | cli_inner_pretty.js (referenced) | function |
| `RH` | `recordSpanSuccess` (OTEL) | cli_inner_pretty.js:360873 | function |
| `J8` | `recordSpanFailure` (OTEL) | cli_inner_pretty.js:360876, 360892 | function |
| `N` | `logForDebugging` | cli_inner_pretty.js (referenced) | function |
| `EH` | `logError` | cli_inner_pretty.js (referenced) | function |
| `CK` | `registerCleanup` | cli_inner_pretty.js (referenced) | function |
| `H_` | `pathExists` | cli_inner_pretty.js (referenced) | function |
| `I$` | `getCwd` | cli_inner_pretty.js (referenced) | function |
| `tX` | `execa` | cli_inner_pretty.js (referenced) | function |

---

## Module: Project Purge UI (mentions shell-snapshots/)

The only end-user-visible surface that references the shell-snapshots directory. See [ui_and_observability.md](../38_shell_snapshot/ui_and_observability.md) for the full deobfuscation.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dqA` | `purgeProjectHandler` | cli_inner_pretty.js:604708-604760 | function |
| `gqA` | `planProjectPurge` | cli_inner_pretty.js:604585-604639 | function |
| `QqA` | `planAllPurge` | cli_inner_pretty.js:604640-604666 | function |
| `j$9` | `printPurgePlan` | cli_inner_pretty.js:604698-604707 | function |
| `Nr6` | `printLine` (stdout) | cli_inner_pretty.js:604438-604441 | function |
| `kr` | `printWarning` (yellow stderr) | cli_inner_pretty.js:530206-530212 | function |
| `j_H` | `directoryExists` (stat-or-false) | cli_inner_pretty.js:604457-604463 | function |
| `Er6` | `executePurgeItem` (dispatcher) | cli_inner_pretty.js:604667-604682 | function |
| `P$9` | `formatPurgeItem` (display formatter) | cli_inner_pretty.js (referenced via 604702) | function |
| `D$9` | `promptYesNo` (readline confirm) | cli_inner_pretty.js:604442-604456 | function |
| `BqA` | `pickProjectInteractive` | cli_inner_pretty.js (referenced at 604726) | function |
| `J$9` | `selectFromList` (interactive picker) | cli_inner_pretty.js:604464+ | function |
| `hr6` | `scanHistoryFile` | cli_inner_pretty.js:604437 (export) | function |
| `_v` | `require("path")` (purge scope) | cli_inner_pretty.js:604781 | variable |
| `J_H` | `require("fs/promises")` (purge scope) | cli_inner_pretty.js:604780 | variable |

---

## v2.1.142-Only Additions (Not Present in v2.1.112)

| Symbol | Readable | Significance |
|--------|----------|--------------|
| `ne` | `getInstallBinDir` | Returns `~/.local/bin`; baked into argv0 functions to replace v2.1.112's `command -v claude` fallback |
| `al5` | `cleanupShellSnapshots` | v2.1.117 retention sweep for `~/.claude/shell-snapshots/` |
| `nl5` | `cleanupTasks` | v2.1.117 retention sweep for `~/.claude/tasks/` |
| `tl5` | `cleanupBackups` | v2.1.117 retention sweep for `~/.claude/backups/` |

---

## v2.1.142 Behavior Changes (Same Symbol, Different Behavior)

| Symbol | What changed |
|--------|--------------|
| `Iv6` (createArgv0ShellFunction) | 4th parameter `denyPatterns`; baked install path replaces `command -v claude` |
| `Ai_` (createFindGrepShellIntegration) | Passes `denyPatterns` for grep wrapper |
| `dM` (hasEmbeddedSearchTools) | `EMBEDDED_SEARCH_TOOLS=1` env var gate removed; always true on non-SDK |
| `XI` (subprocessEnv) | Always strips `OTEL_*`; new background-session env keys scrubbed |
| `Ts1` (GHA_SUBPROCESS_SCRUB) | Removed 4 OTEL header keys (now covered by general OTEL strip) |
| `$U7` (createBashShellProvider) | Adds OTEL span recording (`.then(recordSpanSuccess)`); one-shot `missingTelemetryFired` flag |
| Bash tool spawn env construction | Adds `CLAUDE_CODE_SESSION_ID` (v2.1.132) and `AI_AGENT` (v2.1.120) |

---

## Cross-Reference

For deep behavioural deobfuscation of each symbol, see the module docs:
- [README.md](../38_shell_snapshot/README.md) — top-level overview
- [implementation.md](../38_shell_snapshot/implementation.md) — lifecycle
- [snapshot_creation.md](../38_shell_snapshot/snapshot_creation.md) — `ip7` + `Oi_` deobfuscation
- [config_file_detection.md](../38_shell_snapshot/config_file_detection.md) — `Sv6`, `Yi_`, `fi_`
- [argv0_dispatch.md](../38_shell_snapshot/argv0_dispatch.md) — `Iv6` deep dive
- [ripgrep_integration.md](../38_shell_snapshot/ripgrep_integration.md) — `Ki_`, `aGH`, `$Y$`
- [find_grep_integration.md](../38_shell_snapshot/find_grep_integration.md) — `Ai_` deep dive
- [shell_integrations.md](../38_shell_snapshot/shell_integrations.md) — three-integration overview
- [env_snapshot.md](../38_shell_snapshot/env_snapshot.md) — `XI`, `Ts1`, spawn env
- [command_assembly.md](../38_shell_snapshot/command_assembly.md) — eval wrap, NUL substitution, etc.
- [bash_tool_integration.md](../38_shell_snapshot/bash_tool_integration.md) — `$U7` + `tY8` integration
- [retention_cleanup.md](../38_shell_snapshot/retention_cleanup.md) — `al5`, `Rr`, `aB4`
- [embedded_search_tools.md](../38_shell_snapshot/embedded_search_tools.md) — `dM` simplification + v2.1.121 fallback
- [cross_validation.md](../38_shell_snapshot/cross_validation.md) — v2.1.88 ↔ v2.1.112 ↔ v2.1.142 audit
- [ui_and_observability.md](../38_shell_snapshot/ui_and_observability.md) — `claude project purge` warning + debug/OTEL/Tengu observability matrix

---

> **Note:** All Shell Snapshot symbols above have been consolidated into [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) under the `Module: Shell Snapshot` section. This file is retained as the per-unit working notes for the shell-snapshot analysis pass; the canonical lookup is the platform index.
