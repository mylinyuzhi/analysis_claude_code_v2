# Symbol Additions — Unit 13 (18_sandbox)

Symbols discovered while analyzing v2.1.112's sandbox and shell-hardening landings. Cross-referenced against the v2.1.88 readable source under `/lyz/codespace/3rd/claude-code/src/`.

These belong logically with the Platform Infrastructure symbols. When integrating into the main index, add to `symbol_index_infra_platform.md` under a Module: Sandbox / Subprocess section.

---

## Module: Sandbox — Subprocess Env Scrub & PID Namespace

| Obfuscated | Readable | File:Line | Type | v2.1.88 source |
|------------|----------|-----------|------|----------------|
| `xP` | `isSubprocessEnvScrubEnabled` | chunks.78.mjs:754-757 | function | `subprocessEnv.ts:86` (inline `isEnvTruthy(...)`); gate now cached |
| `Kn_` | `isMcpAllowlistEnvEnabled` | chunks.78.mjs:759-763 | function | `subprocessEnv.ts:60` (gating, comment only); now standalone |
| `Js` | `isBwrapInstalled` | chunks.78.mjs:765-768 | function | (NEW in v2.1.112 — no v2.1.88 equivalent) |
| `wp1` | `initSubprocessSandbox` | chunks.78.mjs:770-823 | async function | (NEW in v2.1.112) |
| `Dk` | `subprocessEnv` | chunks.78.mjs:876-888 | function | `subprocessEnv.ts:79-99` |
| `Yn_` | `SUBPROCESS_SCRUB_LIST` | chunks.78.mjs:940 | constant | `subprocessEnv.ts:15-53` (23 entries → 25 in v2.1.112) |
| `Yp1` | `dirname` | utility | function | (re-exported from `path`) |
| `Ap1` | `ENV_FILE_NAMES` | chunks.78.mjs:938 | constant | `[".env", ".env.local", ...]` — files pinned in sandbox |
| `pH4` | `SANDBOX_ALLOW_WRITE_ROOTS` | chunks.78.mjs:938 | constant | `["/home", "/root", "/tmp", "/var", "/opt", "/run", "/mnt"]` |
| `GL8` | `cachedScrubFlag` | chunks.78.mjs:913 | variable | Module-scoped cache of env-scrub flag |
| `vL8` | `cachedBwrapAvail` | chunks.78.mjs:919 | variable | Module-scoped cache of bwrap availability |
| `kR` | `sandboxContext` | chunks.78.mjs:921 | variable | Captures home/cwd/workspace/pathDirs at init |
| `RL8` | `plantedBareRepoFiles` | chunks.78.mjs:1420 | variable | Files to scrub on startup |
| `Vn_` | `scrubPlantedBareRepoFiles` | chunks.78.mjs:1494-1500 | function | Deletes planted bare-repo indicators |
| `Zn_` | `detectPlantedBareRepoFile` | (referenced 1426) | function | Heuristic: file looks like a bare-repo indicator |

## Module: Sandbox — Script Caps

| Obfuscated | Readable | File:Line | Type | v2.1.88 source |
|------------|----------|-----------|------|----------------|
| `FH4` | `parseScriptCapsConfig` | chunks.78.mjs:825-841 | function | (NEW in v2.1.112) |
| `$p1` | `enforceScriptCap` | chunks.78.mjs:855-866 | function | (NEW in v2.1.112) |
| `gH4` | `resetScriptCaps` | chunks.78.mjs:843-845 | function | (NEW in v2.1.112) |
| `_n_` | `resetSubprocessSandboxState` | chunks.78.mjs:847-849 | function | Calls `gH4` plus clears all sandbox state |
| `zn_` | `setSandboxContext` | chunks.78.mjs:851-853 | function | Test/CCR helper for context injection |
| `An_` | `registerUpstreamProxyEnvFn` | chunks.78.mjs:868-870 | function | `subprocessEnv.ts:73-77` |
| `TL8` | `getUpstreamProxyEnv` | chunks.78.mjs:872-874 | function | `subprocessEnv.ts:84` (inline) |
| `UH4` | `_getUpstreamProxyEnv` | chunks.78.mjs:929 | variable | Module-scoped storage for proxy env fn |
| `YK6` | `scriptCapsConfig` | chunks.78.mjs:925 | variable | Tri-state: undefined / null / object |
| `Op1` | `scriptCallCounts` | chunks.78.mjs:923 | variable | Map<string, number> session counters |
| `n8` | `parseJsonSafe` | utility | function | Try/catch JSON.parse wrapper |
| `QC` | `pickBy` | utility | function | Lodash-style filter object by predicate |

## Module: Sandbox — Seccomp / Apply-seccomp Helper

| Obfuscated | Readable | File:Line | Type | v2.1.88 source |
|------------|----------|-----------|------|----------------|
| `iB1` | `findSeccompBinaryCached` | chunks.77.mjs:1860-1866 | function | Memoizes `findSeccompBinary` per explicit path |
| `Hl_` | `findSeccompBinary` | chunks.77.mjs:1868-1883 | function | (NEW in v2.1.92 — see changelog "ships apply-seccomp helper") |
| `nj4` | `detectArchitecture` | (referenced 1873) | function | Returns `"x86_64"`, `"aarch64"`, etc. |
| `jl_` | `listBundleSearchPaths` | (referenced 1876) | function | npm install search paths |
| `$l_` | `listGlobalInstallDirs` | (referenced 1878) | function | Global install fallback paths |
| `Xp` | `path.join` | utility | function | (re-exported from `path`) |
| `ML8` | `fs.existsSync` | utility | function | (re-exported from `fs`) |
| `x7` | `seccompFilterLog` | utility | function | `[SeccompFilter]`-prefixed logger |
| `lB1` | `seccompBinaryCache` | chunks.77.mjs:1885 | variable | `Map<explicitPath, resolvedPath \| null>` |
| `nB1` | `lazySeccompProgramPath` | chunks.77.mjs:1887 | variable | Lazy BPF program path init |

## Module: Sandbox — Permission Mode Override

| Obfuscated | Readable | File:Line | Type | Notes |
|------------|----------|-----------|------|-------|
| `dY7` | `resolvePermissionMode` | chunks.164.mjs:2759-2831 | function | Forces `default` when env-scrub is on |
| `cY7` | `applyPermissionModeOverrides` | chunks.164.mjs:2866-2954 | async function | Wires permission context (incl. PowerShell visibility) |
| `Pn8` | `isAutoModeCircuitBreaker` | (referenced 2777) | function | Cached "auto mode is disabled" check |

## Module: PowerShell Tool

| Obfuscated | Readable | File:Line | Type | v2.1.88 source |
|------------|----------|-----------|------|----------------|
| `ly6` | `isPowerShellToolEnabled` | chunks.84.mjs:2952-2959 | function | `shellToolUtils.ts:17-22` (Windows-only in 2.1.88; Linux/macOS opt-in added) |
| `I5` | `POWERSHELL_TOOL_NAME` | chunks.84.mjs:2951 | constant | `"PowerShell"` |
| `S7` | `BASH_TOOL_NAME` | (referenced 2899) | constant | `"Bash"` |
| `dj6` | `SHELL_TOOL_NAMES` | chunks.84.mjs:2961-2968 | constant | `[S7, I5]` = `["Bash", "PowerShell"]` |
| `iR` | `parseAllowedToolsCli` | chunks.164.mjs:2832-2864 | function | Splits comma-separated tool args, respects parens |
| `h2` | `parseRule` | utility | function | Parse permission-rule string |
| `i0` | `getToolNameFromParsedRule` | utility | function | Extract `toolName` field |
| `S6` | `parseExplicitTrue` | utility | function | Env-var truthy parser |
| `c5` | `parseExplicitFalse` | utility | function | Env-var falsy parser |
| `u8` | `getFeatureFlag` | utility | function | Statsig flag wrapper |
| `y1` | `getPlatform` | utility | function | `"windows"`/`"linux"`/`"darwin"`/`"wsl"` |

## Module: Bash Permission Classifier (2.1.111 changes)

| Obfuscated | Readable | File:Line | Type | v2.1.88 source |
|------------|----------|-----------|------|----------------|
| `Oa1` | `detectUnquotedExpansion` | chunks.116.mjs:2078-2124 | function | `readOnlyValidation.ts:1600-1669` (was boolean; now tri-state) |
| `yu8` | `checkReadOnlyConstraints` | chunks.116.mjs:2182-2236 | function | `readOnlyValidation.ts:1876-1990` |
| `cEz` | `GLOB_ALLOWED_READ_ONLY_COMMANDS` | chunks.117.mjs:904 | constant | (NEW in v2.1.111) — 31-command whitelist |
| `fkY` | `filterCdCwdPrefix` | chunks.164.mjs:1221-1233 | function | (NEW in v2.1.111) |
| `nEz` | `commandHasAnyGit` | chunks.116.mjs:2141 | function | `readOnlyValidation.ts:1760-1764` |
| `aEz` | `commandWritesToGitInternalPaths` | chunks.116.mjs:2163-2180 | function | `readOnlyValidation.ts:1840-1864` |
| `oEz` | `extractWritePathsFromSubcommand` | chunks.116.mjs:2150-2161 | function | `readOnlyValidation.ts:1795-1823` |
| `Dc4` | `isGitInternalPath` | chunks.116.mjs:(referenced 2168) | function | `readOnlyValidation.ts:1781-1785` |
| `M78` | `COMMAND_OPERATION_TYPE` | (referenced 2155) | constant | `pathValidation.ts` — map of command → "read"/"write"/"create" |
| `X78` | `PATH_EXTRACTORS` | (referenced 2158) | constant | Map of command → argument-path extractor fn |
| `rEz` | `NON_CREATING_WRITE_COMMANDS` | chunks.116.mjs:(referenced 2157) | constant | `Set(["rm","rmdir","sed"])` |
| `lEz` | `isCommandReadOnly` | chunks.116.mjs:2126-2138 | function | `readOnlyValidation.ts:1678-1752` |
| `xEz` | `isCommandSafeViaFlagParsing` | chunks.116.mjs:(referenced 2131) | function | `readOnlyValidation.ts:isCommandSafeViaFlagParsing` |
| `dEz` | `READONLY_COMMAND_REGEXES` | chunks.116.mjs:(referenced 2132) | constant | List of regex patterns matching read-only command shapes |
| `sEz` | `READONLY_ALLOWED_REDIRECT_OPS` | chunks.116.mjs:(referenced 2220) | constant | Set of safe redirect ops |
| `kQ6` | `isCurrentDirectoryBareGitRepo` | chunks.116.mjs:2207 | function | `git.ts:isCurrentDirectoryBareGitRepo` |
| `Gp` | `containsVulnerableUncPath` | (referenced 2198) | function | `readOnlyCommandValidation.ts:containsVulnerableUncPath` |
| `Z7` | `SandboxManager` | (referenced 2215) | namespace | `sandbox-adapter.ts:SandboxManager` |
| `lR6` | `isSafeEnvVarName` | (referenced 2222) | function | Looks up name in `SAFE_ENV_VARS` |
| `TO` | `splitCommandDeprecated` | utility | function | `bash/commands.ts:splitCommand_DEPRECATED` |
| `od` | `extractOutputRedirections` | utility | function | `bash/commands.ts:extractOutputRedirections` |
| `vs` | `getShellQuoteParser` | utility | function | Returns the shell-quote-based parser |
| `dt6` | `parseShellCommandStructure` | utility | function | Builds command structure from shell-quote parse |
| `QEz` | `checkArgvAgainstAllowlist` | (referenced 2225) | function | Argv allowlist check |

## Module: Safe Env Vars / Wrappers (2.1.97 changes)

| Obfuscated | Readable | File:Line | Type | v2.1.88 source |
|------------|----------|-----------|------|----------------|
| `jF` | `stripSafeWrappers` | chunks.164.mjs:998-1018 | function | `bashPermissions.ts:524-615` |
| `bY7` | `stripCommentLines` | chunks.164.mjs:987-996 | function | `bashPermissions.ts:508-521` |
| `N98` | `SAFE_ENV_VARS` | (referenced 1009) | constant | `bashPermissions.ts:378-430` — 30+ entries |
| `DkY` | `commandHasUnsafeEnvVars` | chunks.164.mjs:1020-1033 | function | Returns true if command has VAR=val with VAR ∉ SAFE_ENV_VARS |
| `uY7` | `stripAllLeadingEnvVars` | chunks.164.mjs:1035-1047 | function | Aggressively strips ALL env vars, not just safe ones (used in some matching contexts) |
| `CY7` | `runAlternationStripPasses` | chunks.164.mjs:1049-1075 | function | Iterates env→wrapper→env stripping for max match opportunities |
| `JkY` | `validateCommandForAcceptEditsMode` | chunks.164.mjs:854-875 | function | `modeValidation.ts:23-56` (now calls `jF` first) |
| `HkY` | `isAcceptEditsCommand` | chunks.164.mjs:850-852 | function | `modeValidation.ts:19-21` |
| `jkY` | `ACCEPT_EDITS_ALLOWED_COMMANDS` | chunks.164.mjs:902 | constant | `["mkdir","touch","rm","rmdir","mv","cp","sed"]` — `modeValidation.ts:7-15` |
| `QSK` | `checkPermissionMode` | chunks.164.mjs:877-895 | function | `modeValidation.ts:72-109` |
| `aSK` | `checkExplicitDenyRules` | chunks.164.mjs:1257-1270 | function | Pre-classifier deny-rule check |
| `Yx6` | `findMatchingRules` | utility | function | Permission-rule matching engine |
| `TkY` | `checkDenyRulesForPipeline` | chunks.164.mjs:1271-1290 | function | Per-segment deny check for pipelines |

## Module: Perforce Mode (2.1.98 — new)

| Obfuscated | Readable | File:Line | Type | Notes |
|------------|----------|-----------|------|-------|
| `mY1` | `isPerforceMode` | chunks.16.mjs:3070-3073 | function | (NEW in v2.1.98) |
| `gf6` | `isPerforceProtected` | chunks.16.mjs:3075-3077 | function | (NEW in v2.1.98) `mode & S_IWUSR === 0` |
| `Ff6` | `PERFORCE_PROTECTED_FILE_ERROR_MESSAGE` | chunks.16.mjs:3320 | constant | Three-line error string with `p4 edit` hint |
| `fj` | `getSystemContext` | chunks.86.mjs:2209-2226 | function | Injects `perforceMode` section when gate is on |

---

## Constants (Cross-Cutting)

| Obfuscated | Readable | File:Line | Value | Type |
|------------|----------|-----------|-------|------|
| `Yn_` | `SUBPROCESS_SCRUB_LIST` | chunks.78.mjs:940 | 25-string array | constant |
| `Ap1` | `ENV_FILE_NAMES` | chunks.78.mjs:938 | `[".env", ".env.local", ".env.development", ".env.development.local", ".env.test", ".env.test.local", ".env.production", ".env.production.local"]` | constant |
| `pH4` | `SANDBOX_ALLOW_WRITE_ROOTS` | chunks.78.mjs:938 | `["/home", "/root", "/tmp", "/var", "/opt", "/run", "/mnt"]` | constant |
| `cEz` | `GLOB_ALLOWED_READ_ONLY_COMMANDS` | chunks.117.mjs:904 | 31-string set | constant |
| `jkY` | `ACCEPT_EDITS_ALLOWED_COMMANDS` | chunks.164.mjs:902 | `["mkdir","touch","rm","rmdir","mv","cp","sed"]` | constant |
| `Ff6` | `PERFORCE_PROTECTED_FILE_ERROR_MESSAGE` | chunks.16.mjs:3320 | 200-char string | constant |
| `J4` | `EDIT_TOOL_NAME` | chunks.78.mjs:943 | `"Edit"` | constant |
| `VL8` | `CLAUDE_PROJECT_GLOB` | chunks.78.mjs:945 | `"/.claude/**"` | constant |
| `kL8` | `CLAUDE_HOME_GLOB` | chunks.78.mjs:947 | `"~/.claude/**"` | constant |

---

## v2.1.88 → v2.1.112 Differences

### `SUBPROCESS_SCRUB_LIST` (`Yn_`) — 23 entries → 25 entries

v2.1.88 had 23 vars in `GHA_SUBPROCESS_SCRUB`. v2.1.112's `Yn_` adds two:

```javascript
+ "ANTHROPIC_AWS_API_KEY",
+ "ANTHROPIC_BEDROCK_MANTLE_API_KEY",
```

Both cover Anthropic-specific cloud-provider variants that didn't exist in v2.1.88's auth path.

### `isPowerShellToolEnabled` (`ly6`) — Linux/macOS opt-in added

**v2.1.88 (`shellToolUtils.ts:17-22`):**
```typescript
if (getPlatform() !== 'windows') return false;  // Linux/macOS HARD-OFF
return process.env.USER_TYPE === 'ant'
    ? !isEnvDefinedFalsy(process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL)
    : isEnvTruthy(process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL)
```

**v2.1.112 (`chunks.84.mjs:2952-2959`):**
```javascript
if (y1() !== "windows") return S6(q);  // Linux/macOS opt-in via explicit truthy
if (S6(q)) return !0;
if (c5(q)) return !1;
return u8("tengu_cobalt_ridge", !1)   // Windows fallback: Statsig
```

Two changes:

1. Linux/macOS: hard-off → opt-in (when `CLAUDE_CODE_USE_POWERSHELL_TOOL=1` and `pwsh` on PATH).
2. Windows: `USER_TYPE === 'ant'` cohort → `tengu_cobalt_ridge` Statsig gate (server-side rollout control).

### `containsUnquotedExpansion` (boolean) → `detectUnquotedExpansion` (`Oa1`) tri-state

**v2.1.88 (`readOnlyValidation.ts:1600-1669`):** returned `boolean`.

**v2.1.112 (`chunks.116.mjs:2078-2124`):** returns `"variable" | "glob" | false`.

Same scan code, but the caller now distinguishes variables (fail) from globs (whitelist-allowed).

### NEW in v2.1.111: `cEz` (`GLOB_ALLOWED_READ_ONLY_COMMANDS`)

31-command set whitelisted for use with unquoted glob characters. No v2.1.88 equivalent.

### NEW in v2.1.111: `fkY` (`filterCdCwdPrefix`)

Strips `cd ${cwd}` and `cd ${cwdMingw}` from compound subcommand lists before classification. No v2.1.88 equivalent.

### NEW in v2.1.98: Perforce gate (`mY1`/`gf6`) + error string (`Ff6`)

Three new symbols, no v2.1.88 source equivalent. Wired into Edit/Write/NotebookEdit's permission/validation flows.

### NEW in v2.1.98: Script caps (`FH4`/`$p1`/`gH4`)

Three new symbols implementing per-session per-substring invocation caps. No v2.1.88 source equivalent.

### NEW in v2.1.92: `apply-seccomp` helper (`Hl_`)

Architecture-aware lookup for the apply-seccomp binary. Bundled in both npm and native builds starting 2.1.92 (changelog: "Linux sandbox now ships apply-seccomp helper in both npm and native builds").

### v2.1.97 `stripSafeWrappers` (`jF`) — interleaved iteration in caller

The single function `jF` matches the v2.1.88 `stripSafeWrappers` two-phase structure. The 2.1.97 change is in the **caller** (`CY7` / `runAlternationStripPasses`) which now alternates env → wrapper → env stripping for maximum match opportunities. This is what lets `timeout 5 LANG=C rm tmp/` auto-approve in Accept Edits mode (the v2.1.88 caller only did one pass).

### v2.1.111: PowerShell tool tip surface

NEW in `chunks.207.mjs:328-332` — tip `"Set CLAUDE_CODE_USE_POWERSHELL_TOOL=1 to enable the PowerShell tool (preview)"`. Relevance: Windows AND env var unset. Cooldown: 10 sessions.

---

## Cross-Reference: Where These Symbols Live

```
chunks.78.mjs (subprocess sandbox core)
├─ 754-757   xP        isSubprocessEnvScrubEnabled
├─ 759-763   Kn_       isMcpAllowlistEnvEnabled
├─ 765-768   Js        isBwrapInstalled
├─ 770-823   wp1       initSubprocessSandbox
├─ 825-841   FH4       parseScriptCapsConfig
├─ 843-845   gH4       resetScriptCaps
├─ 847-849   _n_       resetSubprocessSandboxState
├─ 851-853   zn_       setSandboxContext
├─ 855-866   $p1       enforceScriptCap
├─ 868-870   An_       registerUpstreamProxyEnvFn
├─ 872-874   TL8       getUpstreamProxyEnv
├─ 876-888   Dk        subprocessEnv
├─ 940       Yn_       SUBPROCESS_SCRUB_LIST
└─ 1494-1500 Vn_       scrubPlantedBareRepoFiles

chunks.77.mjs (seccomp helper lookup)
├─ 1860-1866 iB1       findSeccompBinaryCached
└─ 1868-1883 Hl_       findSeccompBinary

chunks.84.mjs (PowerShell tool gate)
├─ 2951      I5        POWERSHELL_TOOL_NAME
└─ 2952-2959 ly6       isPowerShellToolEnabled

chunks.116.mjs / chunks.117.mjs (bash read-only classifier)
├─ 2078-2124 Oa1       detectUnquotedExpansion (tri-state)
├─ 2126-2138 lEz       isCommandReadOnly
├─ 2141      nEz       commandHasAnyGit
├─ 2150-2161 oEz       extractWritePathsFromSubcommand
├─ 2163-2180 aEz       commandWritesToGitInternalPaths
└─ 2182-2236 yu8       checkReadOnlyConstraints
chunks.117.mjs:904     cEz       GLOB_ALLOWED_READ_ONLY_COMMANDS

chunks.164.mjs (bash permission engine, Accept Edits, PowerShell visibility)
├─ 850-852   HkY       isAcceptEditsCommand
├─ 854-875   JkY       validateCommandForAcceptEditsMode
├─ 877-895   QSK       checkPermissionMode
├─ 902       jkY       ACCEPT_EDITS_ALLOWED_COMMANDS
├─ 987-996   bY7       stripCommentLines
├─ 998-1018  jF        stripSafeWrappers
├─ 1020-1033 DkY       commandHasUnsafeEnvVars
├─ 1035-1047 uY7       stripAllLeadingEnvVars
├─ 1049-1075 CY7       runAlternationStripPasses
├─ 1221-1233 fkY       filterCdCwdPrefix
├─ 2759-2831 dY7       resolvePermissionMode (forces default when SCRUB on)
└─ 2866-2954 cY7       applyPermissionModeOverrides

chunks.16.mjs (Perforce mode)
├─ 3070-3073 mY1       isPerforceMode
├─ 3075-3077 gf6       isPerforceProtected
└─ 3320      Ff6       PERFORCE_PROTECTED_FILE_ERROR_MESSAGE

chunks.86.mjs (system context)
└─ 2209-2226 fj        getSystemContext (injects perforceMode section)

chunks.144.mjs / chunks.145.mjs / chunks.162.mjs (Edit/Write/NotebookEdit Perforce gates)
├─ chunks.144.mjs:546-550   Write tool gf6 check (errorCode: 6)
├─ chunks.145.mjs:145-148   NotebookEdit tool gf6 check
└─ chunks.162.mjs:1391-1396 Edit tool gf6 check (errorCode: 11, behavior: "ask")

chunks.207.mjs (tip surfaces)
└─ 328-332               PowerShell-tool-env tip
```
