# Symbol Additions — v2.1.142 Sandbox Unit

> Sandbox subsystem symbol mappings discovered/changed in v2.1.113 → v2.1.142.
> Place: this file maps the **Sandbox** subsystem additions for the v2.1.142 unit.
> When the symbol_index_*.md files are produced for v2.1.142, these mappings should be merged into `symbol_index_infra_platform.md` under module "Sandbox".

---

## Module: Sandbox — Schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Xh9 | SandboxNetworkConfigSchema | cli_inner_pretty.js:48253-48306 | function |
| Lh9 | SandboxFilesystemConfigSchema | cli_inner_pretty.js:48307-48340 | function |
| yMq | SandboxSettingsSchema | cli_inner_pretty.js:48341-48390 | function |
| hu8 | sandboxSchemaPathModule | cli_inner_pretty.js:48254 | variable |

---

## Module: Sandbox — Managed Settings Tier Merger

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| MDq | mergeManagedPolicy | cli_inner_pretty.js:52104-52131 | function |
| Tm8 | policyTierProjection | cli_inner_pretty.js:52046-52088 | function |
| Gm8 | shouldMergeParentChain | cli_inner_pretty.js:52043-52045 | function |
| uI9 | collectPolicyTierList | cli_inner_pretty.js:52132-52137 | function |
| wDq | resolvePolicySettings | cli_inner_pretty.js:52138-52148 | function |
| YK$ | loadHelperTier | cli_inner_pretty.js:(via mergeManagedPolicy call) | function |
| YDq | loadRemoteTier | cli_inner_pretty.js:(via mergeManagedPolicy call) | function |
| AK$ | loadOsPolicyTier | cli_inner_pretty.js:(via mergeManagedPolicy call) | function |
| fK$ | loadParentChainTier | cli_inner_pretty.js:(via mergeManagedPolicy call) | function |
| WPH | getAllPolicyTierSettings | cli_inner_pretty.js:52338-52340 | function |
| aR$ | pickKeys | cli_inner_pretty.js:(used by Tm8) | function |

---

## Module: Sandbox — Bwrap/Socat Path Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tz$ | getBwrapPath | cli_inner_pretty.js:197238-197242 | function |
| MgK | getSocatPath | cli_inner_pretty.js:197243-197247 | function |
| Qt$ | resolveBubblewrap | cli_inner_pretty.js:197248-197252 | function |
| Fx | whichExecutable | cli_inner_pretty.js:(executable-aware which) | function |
| q7H | whichBinary | cli_inner_pretty.js:(plain which) | function |
| ZFK | isExecutable | cli_inner_pretty.js:195520-195526 | function |
| Uq$ | isWSL | cli_inner_pretty.js:48235-48243 | function |
| pq$ | getManagedSettingsDir | cli_inner_pretty.js:48231-48233 | function |
| eX | getOSPolicyConfigDir | cli_inner_pretty.js:48221-48230 | function |

---

## Module: Sandbox — Dangerous-Path Safety (rm/rmdir)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| v64 | autoAllowAstChecker | cli_inner_pretty.js:420551-420579 | function |
| WA5 | autoAllowSingleCmdChecker | cli_inner_pretty.js:420580-420632 | function |
| VA5 | staticRuleCheck | cli_inner_pretty.js:420644-420673 | function |
| IX6 | checkRmTargets | cli_inner_pretty.js:274835-274851 | function |
| nUH | isCriticalPath | cli_inner_pretty.js:207091-207105 | function |
| hX6 | askForApproval | cli_inner_pretty.js:274827-274834 | function |
| Gk | expandTilde | cli_inner_pretty.js:207030-207033 | function |
| LMH | stripWrapperPrefixes | cli_inner_pretty.js:(in 420569 etc.) | function |
| LdK | isDangerousCommand | cli_inner_pretty.js:205223-205225 | function |
| ce1 | CRITICAL_WIN_DRIVE_ROOT_REGEX | cli_inner_pretty.js:207183 | constant |
| le1 | CRITICAL_WIN_TOP_LEVEL_REGEX | cli_inner_pretty.js:207183 | constant |
| bV | shouldSandboxThisCommand | cli_inner_pretty.js:421425-421432 | function |
| RA5 | isCommandExcludedFromSandbox | cli_inner_pretty.js:421383-421424 | function |
| kdH | isSafeEnvVarName | cli_inner_pretty.js:(safe env list checker) | function |
| TA5 | stripSafeEnvPrefix | cli_inner_pretty.js:420633-420643 | function |
| vA5 | filterCdPrefixes | cli_inner_pretty.js:420674-420683 | function |
| vdH | COMMAND_ARG_EXTRACTORS | cli_inner_pretty.js:275266-275533 | object |
| aw | strippedPositionalArgs | cli_inner_pretty.js:274880-274888 | function |
| yX6 | createFlagAwareArgExtractor | cli_inner_pretty.js:274889-274904 | function |
| oP_ | RM_RMDIR_COMMAND_REGEX | cli_inner_pretty.js:275265 | constant |
| rP_ | DOLLAR_PREFIX_PATH_REGEX | cli_inner_pretty.js:275264 | constant |

---

## Module: Sandbox — Network Filter

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pFK | networkPermissionFilter | cli_inner_pretty.js:196344-196358 | function |
| ia1 | getNetworkPermissionConfig | cli_inner_pretty.js:196505-196510 | function |
| Fa1 | getMitmSocketPathForHost | cli_inner_pretty.js:196359-196364 | function |
| hA6 | matchesHostPattern | cli_inner_pretty.js:196333-196343 | function |
| NUK | canonicalizeHost | cli_inner_pretty.js:(host normalizer) | function |
| nz$ | isValidHost | cli_inner_pretty.js:(host validator) | function |
| KY$ | buildSandboxConfig | cli_unpack_pretty/decls/functions/KY$.js | function |
| vUH | parsePermissionRule | cli_inner_pretty.js:(rule parser) | function |
| FD | WEB_FETCH_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |
| e9 | sandboxConfig | cli_inner_pretty.js:(module-level cache) | variable |
| ga1 | startHttpProxyServer | cli_inner_pretty.js:196365-196389 | function |
| Qa1 | startSocksProxyServer | cli_inner_pretty.js:196390-196406 | function |
| da1 | initializeSandboxNetwork | cli_inner_pretty.js:196407-196483 | function |
| ta1 | applySandboxToCommand | cli_inner_pretty.js:196566-196641 | function |
| OA6 | resolveParentProxyConfig | cli_inner_pretty.js:(parent proxy resolver) | function |
| rUK | makeMitmTlsTerminator | cli_inner_pretty.js:(tls terminator) | function |

---

## Module: Sandbox — Linux bwrap Wrapper

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vFK | linuxBwrapWrapper | cli_inner_pretty.js:195744-195831 | function |
| VFK | spawnNetworkBridges | cli_inner_pretty.js:195540-195602 | function |
| Ca1 | buildBridgedShellCommand | cli_inner_pretty.js:195612-195630 | function |
| Ra1 | buildSeccompArgvPrefix | cli_inner_pretty.js:195604-195611 | function |
| ba1 | buildBwrapMountArgs | cli_inner_pretty.js:195631-195743 | function |
| Sa1 | enumerateDangerousFiles | cli_inner_pretty.js:195448-195519 | function |
| TFK | checkSandboxDependencies | cli_inner_pretty.js:195527-195539 | function |
| jI | resolvePathPrefix | cli_inner_pretty.js:(path resolver) | function |
| It$ | isPathOutsideExpected | cli_inner_pretty.js:(symlink check helper) | function |
| ya1 | findSymlinkAncestor | cli_inner_pretty.js:195404-195420 | function |
| ha1 | hasFileAncestor | cli_inner_pretty.js:195421-195436 | function |
| Ia1 | firstNonExistentPath | cli_inner_pretty.js:195437-195447 | function |
| Lk | isGlobPattern | cli_inner_pretty.js:(glob detector) | function |
| K7H | normalizeAllowPath | cli_inner_pretty.js:(path normalizer) | function |
| w3H | escapeForRegex | cli_inner_pretty.js:(regex escaper) | function |

---

## Module: Sandbox — Apply-Seccomp Helper

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vA6 | findSeccompBinary | cli_inner_pretty.js:195367-195372 | function |
| Ea1 | findSeccompBinaryImpl | cli_inner_pretty.js:195373-195388 | function |
| XFK | detectArchitecture | cli_inner_pretty.js:195335-195355 | function |
| Na1 | listBundleSearchPaths | cli_inner_pretty.js:195356-195366 | function |
| ka1 | listGlobalInstallDirs | cli_inner_pretty.js:(global dirs lookup) | function |
| TA6 | seccompBinaryCache | cli_inner_pretty.js:195394 | variable |
| bgK | getSeccompConfig | cli_inner_pretty.js:(builds {applyPath, argv0}) | function |
| RgK | isBundledSeccompAvailable | cli_inner_pretty.js:(bundled seccomp gate) | function |
| gA6 | seccompBundledFd | cli_inner_pretty.js:(file descriptor for bundled binary) | variable |
| sa1 | getSeccompConfigRuntime | cli_inner_pretty.js:196541-196543 | function |
| VA6 | seccompResolvedArch | cli_inner_pretty.js:195395 | variable |

---

## Module: Sandbox — Subprocess Env Scrub (Renames vs v2.1.112)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| aW | isSubprocessEnvScrubEnabled | cli_inner_pretty.js:197361-197364 | function |
| Ws1 | shouldUseMcpAllowlistEnv | cli_inner_pretty.js:197365-197369 | function |
| A7H | isScrubSandboxAvailable | cli_inner_pretty.js:197370-197373 | function |
| mA6 | assertScrubSandboxAvailable | cli_inner_pretty.js:197374-197439 | function |
| XI | subprocessEnv | cli_inner_pretty.js:(env builder) | function |
| Z3H | SUBPROCESS_SCRUB_LIST | cli_inner_pretty.js:(25-var scrub list) | constant |
| ou | sandboxContext | cli_inner_pretty.js:(module-level cache) | variable |
| ct$ | cachedBwrapAvail | cli_inner_pretty.js:(module-level cache) | variable |
| dt$ | cachedScrubFlag | cli_inner_pretty.js:(module-level cache) | variable |
| XgK | parseScriptCapsConfig | cli_inner_pretty.js:(script-caps parser) | function |
| JgK | SAFE_PATH_PREFIXES | cli_inner_pretty.js:(path-filter prefixes) | constant |
| lt$ | egressGatewayEnv | cli_inner_pretty.js:(proxy env builder) | function |
| Vs1 | registerEgressGatewayEnvFn | cli_inner_pretty.js:(registers proxy env fn) | function |
| UA6 | scrubSandboxConfig | cli_inner_pretty.js:(scrub sandbox state) | function |
| BA6 | enforceScriptCaps | cli_inner_pretty.js:(script-caps enforcer) | function |
| pA6 | shouldUseMcpAllowlistEnv | cli_inner_pretty.js:(MCP allowlist gate) | function |

---

## Module: Sandbox — macOS Sandbox Profile (Mach lookup, etc.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pa1 | buildMacOSSandboxProfile | cli_inner_pretty.js:195952-196183 | function |
| SFK | applyMacOSSandbox | cli_inner_pretty.js:(macOS sandbox-exec) | function |
| dFK | getAllowMachLookup | cli_inner_pretty.js:196520-196522 | function |
| gFK | getAllowUnixSockets | cli_inner_pretty.js:196511-196513 | function |
| xFK | getAllowAllUnixSockets | cli_inner_pretty.js:196514-196516 | function |
| QFK | getAllowLocalBinding | cli_inner_pretty.js:196517-196519 | function |
| cFK | getIgnoreViolations | cli_inner_pretty.js:196523-196525 | function |
| lFK | getEnableWeakerNestedSandbox | cli_inner_pretty.js:196526-196528 | function |
| ra1 | getEnableWeakerNetworkIsolation | cli_inner_pretty.js:196529-196531 | function |
| oa1 | getRipgrepConfig | cli_inner_pretty.js:196532-196534 | function |
| aa1 | getMandatoryDenySearchDepth | cli_inner_pretty.js:196535-196537 | function |
| uFK | getAllowGitConfig | cli_inner_pretty.js:196538-196540 | function |
| pt$ | macSandboxLogMonitor | cli_inner_pretty.js:(macOS log monitor) | variable |
| RFK | startMacOSSandboxLogMonitor | cli_inner_pretty.js:(log monitor starter) | function |
| Ut$ | macSandboxViolationsAggregator | cli_inner_pretty.js:(violations cache) | variable |
| w0 | shellEscapeSandboxString | cli_inner_pretty.js:(sandbox-profile escaper) | function |

---

## Module: Sandbox — `autoAllowBashIfSandboxed`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `n6.isSandboxingEnabled` (→ `st$`) | isSandboxingEnabled | cli_inner_pretty.js:198273-198279 | function |
| `n6.isAutoAllowBashIfSandboxedEnabled` (→ `bs1`) | isAutoAllowBashIfSandboxedEnabled | cli_inner_pretty.js:198251-198254 | function |
| `n6.areUnsandboxedCommandsAllowed` (→ `xs1`) | areUnsandboxedCommandsAllowed | cli_inner_pretty.js:198255-198257 | function |
| `n6.setSandboxSettings` (→ `Us1`) | setSandboxSettings | cli_inner_pretty.js:(state mutator) | function |
| `n6.checkDependencies` (→ wraps `TFK`) | checkSandboxDependencies | cli_inner_pretty.js:(wraps TFK at 195527) | function |
| `n6.getFsWriteConfig` | getFilesystemWriteConfig | cli_inner_pretty.js:207035-207043 | function |
| `n6.areSandboxSettingsLockedByPolicy` (→ `ps1`) | areSandboxSettingsLockedByPolicy | cli_inner_pretty.js:(policy lock check) | function |
| `n6.isSupportedPlatform` | isSandboxSupportedPlatform | cli_inner_pretty.js:(platform gate) | function |
| `n6.isPlatformInEnabledList` (→ `at$`) | isPlatformInEnabledList | cli_inner_pretty.js:198262-198272 | function |
| `n6` (namespace) | sandboxStateNamespace | cli_inner_pretty.js:198457-198475 | object |

---

## Notes on Naming

- **`n6` prefix**: Many sandbox functions are accessed through an object namespace `n6.*`. The underlying functions are individually named in the bundle; the namespace is for module-style import.
- **Per-decl files**: All functions above with single-letter or short obfuscated names also have corresponding `.js` files under `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/decls/functions/<name>.js` for cleaner per-decl reading.
- **Cross-version renames**: Several sandbox functions were renamed between v2.1.112 and v2.1.142 (see [pid_namespace_isolation.md](../18_sandbox/pid_namespace_isolation.md) for the rename table). The v2.1.142 unit uses the new names; the v2.1.112 baseline uses the old names. The symbol_index_*.md files for each version preserve their respective sets of mappings.

---

> **Note:** All Sandbox symbols above have been consolidated into [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) under the `Module: Sandbox` section. This file is retained as the per-unit working notes for the sandbox analysis pass; the canonical lookup is the platform index.
