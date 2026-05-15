# Symbol Additions — Unit 8 (38_shell_snapshot bash tool integration)

These mappings cover the Bash tool's snapshot-sourcing path, command-assembly pipeline, env scrubbing logic, and session-environment hook loader for Claude Code v2.1.112.

Each row gives the v2.1.112 obfuscated identifier, the readable name (matched to v2.1.88 source where possible), file:line and type. Cross-validated against `/lyz/codespace/3rd/claude-code/src/utils/bash/ShellSnapshot.ts`, `/lyz/codespace/3rd/claude-code/src/utils/Shell.ts`, `/lyz/codespace/3rd/claude-code/src/utils/subprocessEnv.ts`, `/lyz/codespace/3rd/claude-code/src/utils/managedEnvConstants.ts`, and `/lyz/codespace/3rd/claude-code/src/utils/sessionEnvironment.ts`.

> These rows should eventually be merged into `symbol_index_core_execution.md` (Bash executor, shell provider) and `symbol_index_infra_platform.md` (env scrubbing, hooks). They live here while Unit 8 is being reviewed so they do not collide with other workers' edits.

---

## Module: Shell Snapshot (chunks.144.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `UPK` | `createAndSaveSnapshot` | chunks.144.mjs:1994-2067 | function |
| `KzY` | `getSnapshotScript` | chunks.144.mjs:1957-1984 | function |
| `qzY` | `getClaudeCodeSnapshotContent` | chunks.144.mjs:~1880-1955 | function |
| `e_Y` | `getUserSnapshotContent` | chunks.144.mjs | function |
| `Q47` | `getConfigFile` (resolves `.zshrc`/`.bashrc`/`.profile`) | chunks.144.mjs | function |
| `o_Y` | `createRipgrepShellIntegration` | chunks.144.mjs | function |
| `s_Y` | `createFindGrepShellIntegration` | chunks.144.mjs | function |
| `t_Y` | `createBigQueryShellIntegration` (v2.1.112 addition) | chunks.144.mjs | function |
| `a_Y` | `VCS_DIRECTORIES_TO_EXCLUDE` (`.git`, `.svn`, `.hg`, `.bzr`, `.jj`, `.sl`) | chunks.144.mjs:2085 | constant |
| `n_Y` | `execFile` (wrapper) — runs the snapshot script | chunks.144.mjs | function |
| `i_Y` | `mkdir` (recursive) — creates `~/.claude/shell-snapshots/` | chunks.144.mjs | function |
| `r_Y` | `stat` (snapshot file size check) | chunks.144.mjs | function |
| `F47` | `pathJoin` | chunks.144.mjs | function |
| `A7` | `getClaudeConfigHomeDir` | utility | function |
| `a3` | `pathExists` | utility | function |
| `b8` | `getCwd` | utility | function |
| `V8` | `getFsImplementation` | utility | function |
| `eq` | `registerCleanup` | utility | function |
| `g47` | `SNAPSHOT_CREATION_TIMEOUT` (10000 ms) | chunks.144.mjs:1988 | constant |
| `p47` | `LITERAL_BACKSLASH` | chunks.144.mjs:1986 | constant |
| `d47` | `CLAUDE_CODE_EXECPATH` (env var name) | chunks.144.mjs:1990 | constant |

## Module: Shell Provider (chunks.144.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `iPK` | `createBashShellProvider` (factory returning provider object) | chunks.144.mjs:2147-2212 | function |
| `sPK` | `createPowerShellProvider` | chunks.144.mjs:2280-2310 | function |
| `EzY` | `getShellConfigImpl` (calls `findSuitableShell` + creates provider) | chunks.144.mjs:2358-2363 | function |
| `NzY` | `findSuitableShell` | chunks.144.mjs:2331-2356 | function |
| `o47` | `isExecutable` | chunks.144.mjs:2316-2329 | function |
| `ePK` | `getShellConfig` (memoized) | chunks.144.mjs:2570 | function |
| `yzY` | `getPsProvider` (memoized) | chunks.144.mjs:2571 | function |
| `LzY` | `resolveProvider` map (`{bash, powershell}`) | chunks.144.mjs:2575 | object |

## Module: Bash Executor — Command Assembly (chunks.144.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `al` | `exec` (top-level executor, formerly `HP1` in v2.1.76) | chunks.144.mjs:2369-2509 | function |
| `lPK` | `substituteNulRedirect` (Windows `NUL` -> `/dev/null`) | chunks.144.mjs:2130-2132 | function |
| `YzY` | `NUL_REDIRECT_REGEX` | chunks.144.mjs:2134 | constant |
| `cPK` | `isPipeSafe` (pipe-redirect-safe check) | chunks.144.mjs:2124-2128 | function |
| `dPK` | `evalWrap` (standard eval wrap) | chunks.144.mjs:2110-2118 | function |
| `gPK` | `evalWrapPipeSafe` (simple single-quote + `< /dev/null`) | chunks.144.mjs:1802-1804 | function |
| `l_Y` | `singleQuoteWrap` (`'...'` with internal-quote escape) | chunks.144.mjs:1806-1808 | function |
| `l47` | `hasHeredoc` | chunks.144.mjs:2099-2102 | function |
| `_zY` | `hasMultilineQuoted` | chunks.144.mjs:2104-2108 | function |
| `zzY` | `hasExplicitStdinRedirect` | chunks.144.mjs:2120-2122 | function |
| `wzY` | `disableExtglobCommand` | chunks.144.mjs:2140-2145 | function |
| `dU8` | `applyShellPrefix` (CLAUDE_CODE_SHELL_PREFIX) | chunks.144.mjs:2088-2095 | function |
| `cU8` | `pathJoinPosix` | chunks.144.mjs | function |
| `OzY` | `pathJoinNative` (read-side CWD file path) | chunks.144.mjs | function |
| `AzY` | `statSnapshot` (snapshot existence check) | chunks.144.mjs | function |
| `A5` | `shellQuote` (single-argument shell-quote) | utility | function |
| `sX` | `posixPathToWindowsPath` | utility | function |
| `kzY` | `DEFAULT_TIMEOUT` (1,800,000 ms) | chunks.144.mjs:2534 | constant |
| `l$` | `setCwd` | chunks.144.mjs:2511-2526 | function |
| `nU8` | `wrapSpawn` (creates ProcessHandler) | chunks.144.mjs | function |
| `PzY` | `spawn` (Node's child_process.spawn re-export) | chunks.144.mjs | function |
| `hzY` | `buildStdioConfig` | chunks.144.mjs:2528-2532 | function |

## Module: Managed/Subprocess Env (chunks.78.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dk` | `subprocessEnv` (returns scrubbed env for child processes) | chunks.78.mjs:876-888 | function |
| `xP` | `isScrubEnabled` (reads `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`) | chunks.78.mjs:754-757 | function |
| `Kn_` | `shouldScrubSubprocessEnv` (scrub + local-agent default) | chunks.78.mjs:759-763 | function |
| `An_` | `registerUpstreamProxyEnvFn` | chunks.78.mjs:868-870 | function |
| `TL8` | `getUpstreamProxyEnv` | chunks.78.mjs:872-874 | function |
| `Yn_` | `GHA_SUBPROCESS_SCRUB` (env keys to strip in GH Actions) | chunks.78.mjs:940 | constant |
| `N98` | `MANAGED_ENV_VARS_DEFAULT` (Go/Rust/Python/locale keys) | chunks.144.mjs:1718 | constant |
| `GL8` | `_isScrubEnabledCache` | chunks.78.mjs:755 | variable |
| `vL8` | `_isBwrapAvailableCache` | chunks.78.mjs:766 | variable |
| `kR` | `_scrubContext` (home, originalCwd, GITHUB_* paths) | chunks.78.mjs:773 | variable |
| `UH4` | `_upstreamProxyEnvFn` (registered late by init.ts) | chunks.78.mjs:869 | variable |
| `Js` | `isBwrapAvailable` | chunks.78.mjs:765-768 | function |
| `wp1` | `setupSubprocessScrub` (linux bwrap mountpoint prep) | chunks.78.mjs:770-823 | function |
| `Hp1` | `getScrubFilesystemConfig` | chunks.78.mjs:897-911 | function |
| `S6` | `parseExplicitTrue` | utility | function |
| `c5` | `parseExplicitFalse` | utility | function |

## Module: Session Environment Loader (chunks.98.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `PC4` | `getSessionEnvironment` (loads `CLAUDE_ENV_FILE` + hook files) | chunks.98.mjs:2616-2645 | function |
| `Ki1` | `getSessionEnvDir` (`~/.claude/session-env/<session-id>/`) | chunks.98.mjs:2590-2595 | function |
| `XC4` | `getSessionEnvHookPath` | chunks.98.mjs:2597-2600 | function |
| `MC4` | `clearCwdEnvHookFiles` (clear cwdchanged/filechanged hooks) | chunks.98.mjs:2602-2610 | function |
| `xh6` | `invalidateSessionEnvCache` | chunks.98.mjs:2612-2614 | function |
| `NMz` | `compareHookFiles` (setup-hook before sessionstart-hook, then numeric) | chunks.98.mjs:2647-2656 | function |
| `l56` | `_sessionEnvCache` | chunks.98.mjs:2658 | variable |
| `HC4` | `HOOK_TYPE_PRIORITY` (setup/sessionstart ordering map) | chunks.98.mjs | constant |
| `ZI8` | `HOOK_FILENAME_REGEX` (`/^(setup\|sessionstart)-hook-(\d+)\.sh$/`) | chunks.98.mjs | constant |
| `jC4` | `readFile` (re-export) | utility | function |
| `JC4` | `readdir` (re-export) | utility | function |
| `I8` | `getSessionId` | utility | function |

## Module: Bash Tool Caller (chunks.163.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `oVY` | `bashToolExecutor` (async generator that calls `al`) | chunks.163.mjs:2337-2400+ | function |
| `AL` | `shouldUseSandbox` (input -> bool) | utility | function |
| `cVY` | `shouldAutoBackground` | chunks.163.mjs | function |
| `On8` | `getDefaultTimeoutMs` | utility | function |
| `V98` | `getMaxTimeoutMs` | utility | function |

