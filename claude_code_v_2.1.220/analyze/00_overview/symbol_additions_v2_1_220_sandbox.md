# Symbol additions — v2.1.220, theme `sandbox`

Staged for merge. **Every group below belongs in `symbol_index_infra_platform.md`** (sandbox is a
platform-infrastructure theme per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §6). Merge each `## Module:`
block into the matching module section of that file, creating the section if absent, and keep rows
alphabetical by the Obfuscated column inside each section.

All `File:Line` values are `cli_inner_pretty.js` line numbers in the **2.1.220** bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`) that I read during this
pass. Where a description mentions a baseline line it is tagged `(193)`; a `(193)` line is never used as a
`File:Line` value.

⚠ **Naming caution for future passes.** Per `_CONVENTIONS.md` trap 1, obfuscated ids are re-mangled between
builds. Several ids in these tables collide with unrelated declarations in 2.1.193 (`Sos`, `To`, `H4`,
`lk`, `pr`, `pl` in particular). Re-derive from the string/setting-key anchor named in each description,
never by carrying an id across builds.

Source documents: [`../49_sandbox/README.md`](../49_sandbox/README.md),
[`network_strict_allowlist.md`](../49_sandbox/network_strict_allowlist.md),
[`filesystem_disabled_and_paths.md`](../49_sandbox/filesystem_disabled_and_paths.md),
[`credentials_mask_promotion.md`](../49_sandbox/credentials_mask_promotion.md),
[`windows_user_sandbox.md`](../49_sandbox/windows_user_sandbox.md).

---

## Module: Sandbox — settings schemas

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B0h` | `sandboxCredentialsSchema` (`files`, `envVars`, `allowPlaintextInject`) | cli_inner_pretty.js:49780-49804 | object |
| `F0h` | `sandboxFilesystemSchema` (incl. `disabled` at :49729) | cli_inner_pretty.js:49698-49743 | object |
| `JUr` | `sandboxSettingsSchema` (root `sandbox` object) | cli_inner_pretty.js:49805-49865 | object |
| `LLi` | `credentialEnvVarSchema` — `mode: v.enum(["deny","mask"])` :49765, `injectHosts` :49770 | cli_inner_pretty.js:49755-49778 | object |
| `N0h` | `sandboxNetworkSchema` — `strictAllowlist` field at :49648-49656 | cli_inner_pretty.js:49638-49696 | object |
| `RLi` | `credentialFileSchema` — still `mode: v.literal("deny")` at :49752 | cli_inner_pretty.js:49744-49754 | object |

---

## Module: Sandbox — settings resolution and trusted scopes

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bco` | `isSandboxingEnabled` | cli_inner_pretty.js:205357 | function |
| `Bxe` | `isHostedAgentRunner` — paired with `GP()` for the scrubbed cloud-runner mode | cli_inner_pretty.js:166698 | function |
| `EIh` | `filterParentManagedSettingsRestrictiveOnly` — sandbox branch :62405-62434; new lines :62415 / :62422 / :62430 | cli_inner_pretty.js:62382-62436 | function |
| `GP` | `isSubprocessEnvScrubMode` (`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`) | cli_inner_pretty.js:166682-166685 | function |
| `GQ` | `getManagedSettingsTiers` | cli_inner_pretty.js:63159-63161 | function |
| `IMi` | `loadManagedSettingsTiers` — 3 admin tiers + parent slice :62481, clamps :62472-62479 | cli_inner_pretty.js:62455-62484 | function |
| `JTu` | `areSandboxSettingsLockedByPolicy` — does **not** consider `filesystem.disabled` / `strictAllowlist` | cli_inner_pretty.js:205437-205449 | function |
| `KTu` | `passesCheapSandboxGates` | cli_inner_pretty.js:205363 | function |
| `MVg` | `areUnsandboxedCommandsAllowed` | cli_inner_pretty.js:205331 | function |
| `OVg` | `areUnsandboxedCommandsForbiddenByPolicy` | cli_inner_pretty.js:205335 | function |
| `PVg` | `isAutoAllowBashIfSandboxedEnabled` — `?? !0`, independent of `filesystem.disabled` | cli_inner_pretty.js:205327-205330 | function |
| `QLt` | `resolveSettingsRelativePath` — resolves a credential path against its settings-file root | cli_inner_pretty.js:204666-204668 | function |
| `SIh` | `parentTierMergesUnderAdmin` (`parentSettingsBehavior === "merge"`) | cli_inner_pretty.js:62379-62381 | function |
| `V$` | `SETTINGS_SOURCES` — `["userSettings","projectSettings","localSettings","flagSettings","policySettings"]` | cli_inner_pretty.js:57678 | constant |
| `VTu` | `isAutoAllowSupported` | cli_inner_pretty.js:205324 | function |
| `YLt` | `getTrustedSettingsSources` — managed ∪ `flagSettings` ∪ active `userSettings`; 5 call sites | cli_inner_pretty.js:204062-204064 | function |
| `ZKr` | `isPlatformInEnabledList` | cli_inner_pretty.js:205346 | function |
| `_ss` | `isSupportedPlatform` | cli_inner_pretty.js:205342 | function |
| `clt` | `getSandboxGrowthbookConfig` (memoised, `filesystemPolicy`) | cli_inner_pretty.js:205709 | variable |
| `dlt` | `isSandboxEnabledInSettings` | cli_inner_pretty.js:205316 | function |
| `kVg` | `anySourceForcesSandboxEnabled` — resolves the gate's `relaxedIfForced` | cli_inner_pretty.js:204687-204695 | function |
| `kco` | `SANDBOX_USER_NAME` = `"ClaudeCodeSandbox"` (220=1 / 193=0) | cli_inner_pretty.js:204092 | constant |
| `pg` | `isSettingsSourceActive` (`wT().includes(source)`) | cli_inner_pretty.js:57672-57674 | function |
| `ult` | `getEffectiveFilesystemPolicy` — `"strict"\|"relaxed"`; Windows veto :204680, settings edge :204681 | cli_inner_pretty.js:204678-204686 | function |
| `vIh` | `resolveManagedSettingsTier` | cli_inner_pretty.js:62485 | function |
| `xVg` | `resolveFilesystemDisabledSetting` — managed-first, managed pin :204673, then trusted scopes | cli_inner_pretty.js:204669-204677 | function |
| `yss` | `isSandboxRequired` | cli_inner_pretty.js:205338 | function |
| `znr` | `buildEffectiveSandboxConfig` — `strictAllowlist` OR-agg :205177, FS spread :205200, creds :205150-205168 | cli_inner_pretty.js:204847-205218 | function |

---

## Module: Sandbox — network policy and host classification

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `EWg` | `startSandboxProxies` — plaintext mutators gated at :195252 / :195254 | cli_inner_pretty.js:195242-195258 | function |
| `FTu` | `collectSandboxDomains` — merges `sandbox.network.*Domains` with `WebFetch(domain:…)` rules | cli_inner_pretty.js:204699-204710 | function |
| `HVg` | `addSessionAllowedHost` — session-only grant; consumed at :204868 | cli_inner_pretty.js:204722-204725 | function |
| `Kat` | `matchesDomainPattern` — wildcard host matcher | cli_inner_pretty.js:195171-195180 | function |
| `LMr` | `conversationWatermark` — `{ messageCount, lastMessageUuid }` | cli_inner_pretty.js:809572-809577 | function |
| `Mco` | `sessionAllowedHosts` | cli_inner_pretty.js:205710 | variable |
| `Phr` | `classifySandboxNetworkHost` — fail-closed on `unavailable` :444747 (carryover) | cli_inner_pretty.js:444741-444750 | function |
| `SWg` | `shouldTerminateTLSForHost` — `tlsTerminate.excludeDomains` | cli_inner_pretty.js:195225-195241 | function |
| `Vns` | `canonicalizeHostForMatching` — unbracket IPv6, WHATWG-normalise via `new URL`, drop trailing dot; `undefined` on parse failure | cli_inner_pretty.js:192047-192056 | function |
| `_Wg` | `makeBodySubstitutionProvider` | cli_inner_pretty.js:195215-195218 | function |
| `eKr` | `isWellFormedHost` | cli_inner_pretty.js:192040 | function |
| `fss` | `isDomainAllowedForMask` — `injectHosts` reachability; refusal at :204719 | cli_inner_pretty.js:204711-204721 | function |
| `gSu` | `shouldAllowNetworkConnection` — `strictAllowlist` enforcement at :195200 | cli_inner_pretty.js:195194-195208 | function |
| `nVe` | `isManagedDomainsOnly` | cli_inner_pretty.js:204696-204698 | function |
| `rke` | `unbracketIpv6Literal` | cli_inner_pretty.js:192028-192030 | function |
| `o8t` | `SandboxHostVerdictCache` (`getOrClassify`, 220=4 / 193=0) | cli_inner_pretty.js:809578-809611 | class |
| `u7t` | `permissionModeToNetworkDisposition` — `auto→classify`, `dontAsk→deny`, else `ask` | cli_inner_pretty.js:58472-58477 | function |
| `yWg` | `makeHeaderMutator` | cli_inner_pretty.js:195209-195214 | function |

---

## Module: Sandbox — filesystem plan and Linux (bubblewrap) backend

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AWg` | `isSandboxRuntimeInitialized` (`Hl !== undefined`) | cli_inner_pretty.js:195379-195381 | function |
| `ASu` | `mergeDenyReadPaths` | cli_inner_pretty.js:195426-195428 | function |
| `Hl` | `sandboxRuntimeConfig` — the installed runtime config; cleared on any init failure | cli_inner_pretty.js:195858 | variable |
| `Hbu` | `firstSymlinkAncestorInAllowedRoots` — the anti-replacement primitive | cli_inner_pretty.js:193595-193611 | function |
| `J5g` | `MAX_SYMLINK_HOPS` = `40` (matches Linux `MAXSYMLINKS`) | cli_inner_pretty.js:194136 | constant |
| `LSu` | `buildSandboxArgv` — skips the FS block when `filesystem.disabled` (:195572) | cli_inner_pretty.js:195570-… | function |
| `NWg` | `updateSandboxConfig` — Windows ACL-stamp warning at :195716-195721 | cli_inner_pretty.js:195714-195727 | function |
| `OW` | `containsGlobMetachar` (`* ? [ ]`) | cli_inner_pretty.js:192997-192999 | function |
| `Q5g` | `resolveDenyPathThroughSymlinks` — bounded partial realpath; `null` = fail closed (220-only) | cli_inner_pretty.js:193612-193638 | function |
| `RLt` | `expandGlobToPaths` | cli_inner_pretty.js:193170 | function |
| `TWg` | `getSandboxFsWriteConfig` — `{allowOnly:["/"]}` early-out at :195452 | cli_inner_pretty.js:195450-195466 | function |
| `WWg` | `getLinuxGlobPatternWarnings` — **not** the seccomp gate (scoping-file correction) | cli_inner_pretty.js:195844-195853 | function |
| `Z5g` | `hasFileAncestor` | cli_inner_pretty.js:193639-193654 | function |
| `ZU` | `normalizeSandboxPath` | cli_inner_pretty.js:193048 | function |
| `ilo` | `containsSimpleGlobMetachar` (`* ?` only — the Windows variant) | cli_inner_pretty.js:193000-193002 | function |
| `j5g` | `isGlobPatternForPlatform` — `ilo` on Windows, `OW` elsewhere | cli_inner_pretty.js:193003-193005 | function |
| `kH` | `getSandboxPlatform` — constant-folded to `"linux"` in this build | cli_inner_pretty.js:192732-192742 | function |
| `oWg` | `buildBwrapArgv` — new deny-loop steps at :193916-193925 | cli_inner_pretty.js:193881-193961 | function |
| `ubu` | `stripWindowsExtendedPathPrefix` (`\\?\`, `\\?\UNC\`) | cli_inner_pretty.js:193006-193010 | function |
| `vSu` | `checkSandboxDependencies` — per-platform error/warning collection | cli_inner_pretty.js:195382-195403 | function |
| `vWg` | `initializeSandboxRuntime` — Windows provisioning/CA/ACL sequence at :195289-195346 | cli_inner_pretty.js:195267-195373 | function |
| `wWg` | `getSandboxFsReadConfig` — `{denyOnly:[]}` early-out at :195430 | cli_inner_pretty.js:195429-195449 | function |
| `xie` | `stripTrailingGlobstar` | cli_inner_pretty.js:193011-193013 | function |

---

## Module: Sandbox — Windows (srt-win) backend

> Merge into: `symbol_index_infra_platform.md`
>
> Every row in this section is **220-only** (`sandboxUser` 220=12 / 193=0; 2.1.193 used a *group* model,
> `srt-win group status` at `:211319 (193)`, with no ACL subcommands). No changelog bullet.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `CWg` | `buildWindowsFileAclPlan` — all four lists empty when `disabled` (:195469) | cli_inner_pretty.js:195467-195474 | function |
| `F8e` | `resolveSrtWinPath` — explicit `windows.srtWin.path` or the packaged binary | cli_inner_pretty.js:194781-194790 | function |
| `LLt` | `getWindowsWfpStatus` — `wfp status`; can report `state: "cannot-read"` | cli_inner_pretty.js:194820-194831 | function |
| `Slo` | `appliedWindowsFileAccessSet` — written once at :195341 | cli_inner_pretty.js:195341 | variable |
| `Xat` | `appliedSandboxUserSid` — recorded at :195332, used by the rollback at :195343 | cli_inner_pretty.js:195332 | variable |
| `aNe` | `getWindowsSandboxUserStatus` — `srt-win user status` → provisioning report | cli_inner_pretty.js:194881-194897 | function |
| `aSu` | `getWindowsSandboxCaCert` — `{pem, thumb}` from the status report | cli_inner_pretty.js:194898-194902 | function |
| `bnr` | `runSrtWin` — spawn helper (text) | cli_inner_pretty.js:194791-194800 | function |
| `cSu` | `grantWindowsSandboxAcls` — `acl grant --holder-pid --sandbox-user-sid`, paths on stdin | cli_inner_pretty.js:194975-194985 | function |
| `glo` | `installWindowsSandbox` — `srt-win install`; exit taxonomy 0/10/12/13/14 | cli_inner_pretty.js:194903-194930 | function |
| `gos` | `restoreWindowsSandboxDenies` — `acl restore --json`; returns `paths` ∪ `parents` | cli_inner_pretty.js:194958-194974 | function |
| `hSu` | `wfpEgressVerifiedOnce` — declared `!1`; the once-per-process latch is at :195300-195307 | cli_inner_pretty.js:195873 | variable |
| `hos` | `resolveExistingPathsForAcl` — **drops non-existent paths** (:194937) | cli_inner_pretty.js:194931-194942 | function |
| `iSu` | `runSrtWinJsonLenient` — spawn helper returning `{ok, json, stderr}` | cli_inner_pretty.js:194810-194819 | function |
| `kWg` | `windowsFileAccessSetUnchanged` | cli_inner_pretty.js:195500-195502 | function |
| `lSu` | `stampWindowsSandboxDenyAcls` — `acl stamp`; exit 2 = partial (:194954) | cli_inner_pretty.js:194943-194957 | function |
| `mWg` | `buildWindowsGitConfigEnv` — `GIT_CONFIG_KEY_n` incl. `safe.directory` and schannel CA | cli_inner_pretty.js:195000-195024 | function |
| `oSu` | `runSrtWinJson` — spawn helper that parses stdout as JSON or throws | cli_inner_pretty.js:194801-194809 | function |
| `sSu` | `verifyWindowsWfpEgress` — empirical egress probe; exit 3 = fence inactive | cli_inner_pretty.js:194832-194880 | function |
| `uKr` | `sameStringSet` — order-insensitive comparison | cli_inner_pretty.js:195485-195489 | function |
| `uSu` | `buildWindowsSandboxArgv` — `CreateProcessW` budget `> 30000` at :195044 | cli_inner_pretty.js:195025-195050 | function |
| `wSu` | `snapshotWindowsFileAccessSet` — **the one new `filesystem.disabled` site** (:195477) | cli_inner_pretty.js:195475-195484 | function |
| `xWg` | `fileAccessSetsEqual` | cli_inner_pretty.js:195490-195499 | function |
| `yos` | `revokeWindowsSandboxGrants` — `acl revoke --json` | cli_inner_pretty.js:194986-194999 | function |

---

## Module: Sandbox — deny-path containment and post-command scrubs

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DVg` | `reconcileLateSymlinkedDenyPaths` — `.210`'s fix; runs per command from :205487 | cli_inner_pretty.js:205249-205281 | function |
| `GTu` | `stagingDirCandidates` | cli_inner_pretty.js:204777-204783 | function |
| `IVg` | `resolveDenyPathKeepingBoth` — returns `[resolved, literal]` | cli_inner_pretty.js:204750-204773 | function |
| `LVg` | `scrubReplacedSymlinkedDenyPaths` (carryover, 1/1) | cli_inner_pretty.js:205231-205248 | function |
| `Lco` | `parentIsNotSymlink` — `O_DIRECTORY\|O_NOFOLLOW`, `ELOOP`/`ENOTDIR` → skip | cli_inner_pretty.js:204787-204799 | function |
| `QTu` | `ensureSandboxInitialized` — `(mss(), DVg())` at :205487 | cli_inner_pretty.js:205471-205489 | function |
| `RVg` | `scrubPlantedBareRepoFiles` — recursion guard `t !== "HEAD" && t !== ".git"` (carryover) | cli_inner_pretty.js:205223-205230 | function |
| `To` | `dedupe` (`[...new Set(e)]`) | cli_inner_pretty.js:24553-24555 | function |
| `Vnr` | `absentDenyPaths` — populated when `lstat` threw at collection time | cli_inner_pretty.js:205711 | variable |
| `WTu` | `detectWorktreeGitCommonDir` | cli_inner_pretty.js:205282 | function |
| `XKr` | `symlinkedDenyPaths` — `{literal, resolved}` records | cli_inner_pretty.js:205711 | variable |
| `bss` | `refreshSandboxConfigFromSettings` | cli_inner_pretty.js:205566-205571 | function |
| `e0u` | `initializeSandbox` — `kE.initialize` :205549, settings watcher :205550-205554 | cli_inner_pretty.js:205534-205565 | function |
| `hss` | `addSandboxAllowWriteDirectory` | cli_inner_pretty.js:205219 | function |
| `lk` | `resolveDenyPathThroughSymlink` — 8-hop dangling fallback; populates `llt`/`XKr` | cli_inner_pretty.js:204726-204749 | function |
| `llt` | `nonSymlinkDenyPaths` — the input to `.210`'s reconcile pass | cli_inner_pretty.js:205711 | variable |
| `lss` | `createStagingDir` (`mode: 448` = `0o700`) | cli_inner_pretty.js:204784-204786 | function |
| `mss` | `ensureAtomicWriteStagingDirs` — `O_NOFOLLOW` + `(dev, ino)` identity record | cli_inner_pretty.js:204800-204846 | function |
| `qVg` | `teardownSandboxSettingsWatcher` | cli_inner_pretty.js:205572-… | function |
| `s3l` | `recordStagingDirIdentity` — stores `(dev, ino, fd)` | cli_inner_pretty.js:51904-51912 | function |

---

## Module: Sandbox — credential masking runtime

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Alo` | `denyModeCredentialPaths` — the `deny` file paths that become `denyRead` | cli_inner_pretty.js:195422-195425 | function |
| `DLt` | `sentinelRegistry` — the `Jns` instance | cli_inner_pretty.js:195903 | variable |
| `Elo` | `maskedFileStore` — backing store for masked file binds | cli_inner_pretty.js:195904 | variable |
| `Jns` | `SentinelRegistry` — `register` / `registerWithSentinel` / `bySentinel` | cli_inner_pretty.js:192887-… | class |
| `NVg` | `maskCredentialWarningWrapper` | cli_inner_pretty.js:205402-205412 | function |
| `Sos` | `collectCredentialProtections` → `{denyReadPaths, unsetEnvVars, setEnvVars, maskedFileBinds, maskedFileStoreDir}` | cli_inner_pretty.js:195404-195421 | function |
| `XTu` | `maskCredentialWarningGate` | cli_inner_pretty.js:205413-205416 | function |
| `YTu` | `getMaskCredentialWarning` — mask-without-TLS warning (220=1 / 193=0) | cli_inner_pretty.js:205392-205401 | function |
| `_bu` | `buildMaskedEnvSubstitutions` — `decode: "jwt"`, `maskClaims`; **fails open** with a loud warning | cli_inner_pretty.js:193395-193454 | function |
| `hbu` | `buildMaskedFileBinds` — three `[credential-mask]` skip paths; **fails closed** via `degradeToDenyPaths` | cli_inner_pretty.js:193292-193384 | function |

---

## Module: Sandbox — command exclusion and policy gates

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `H4` | `shouldRunUnderSandbox` — `I1_` short-circuit at :512824 is the `.214` bypass surface | cli_inner_pretty.js:512818-512826 | function |
| `I1_` | `matchesAnyStatementExclusion` — permissive: splits statements, reads merged settings | cli_inner_pretty.js:512771-512801 | function |
| `Nco` | `SandboxPolicyRefusalError` | cli_inner_pretty.js:205703-205708 | class |
| `Pco` | `SandboxInitFailedError` | cli_inner_pretty.js:205679-205684 | class |
| `QLd` | `POWERSHELL_POLICY_REFUSAL_MESSAGE` — rewritten in `.214`; names the compound-command rule | cli_inner_pretty.js:430929-430930 | constant |
| `R1_` | `SHELL_METACHARS` = `/[;\|&\`$(){}<>#\n\r]/` | cli_inner_pretty.js:512840 | constant |
| `WRo` | `powerShellCommandWillBeSandboxed` — `H4` with `shellType: "powershell"` (220=2 / 193=0) | cli_inner_pretty.js:430760-430762 | function |
| `ZLd` | `shouldRefusePowerShellUnderMandatorySandbox` — the `.214` gate; called at :431116 and :431194 | cli_inner_pretty.js:430750-430759 | function |
| `crp` | `matchesCommandPattern` — `prefix` / `exact` / `wildcard` | cli_inner_pretty.js:512808-512817 | function |
| `dss` | `SandboxBridgeUnavailableError` | cli_inner_pretty.js:205685-205690 | class |
| `nDd` | `matchesTrustedWholeCommandExclusion` — trusted scopes only, no metacharacters, whole command | cli_inner_pretty.js:512802-512807 | function |
| `pss` | `SandboxCommandTooLongError` | cli_inner_pretty.js:205697-205702 | class |
| `$co` | `SandboxUnavailableForShellError` | cli_inner_pretty.js:205691-205696 | class |

---

## Module: Sandbox — exec wrapping and error translation

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ned` | `buildE2BIGDiagnostic` — measures argv and env separately, attributes deny paths to worktrees | cli_inner_pretty.js:313211-313239 | function |
| `Sss` | `addToExcludedCommands` | cli_inner_pretty.js:205590 | function |
| `WVg` | `buildSandboxArgvAndEnv` — unconditional `unsetEnv` for `deny` vars at :205531 | cli_inner_pretty.js:205517-205533 | function |
| `ZTu` | `translateLinuxBridgeDeath` (carryover, 3/3) | cli_inner_pretty.js:205500-205507 | function |
| `fHy` | `WORKTREES_PATH_SEGMENT` (`/worktrees/`) | cli_inner_pretty.js:313244 | constant |
| `hHy` | `isWorktreeMetadataPath` | cli_inner_pretty.js:313208-313210 | function |
| `jVg` | `translateWindowsArgvTooLong` — emits `windows_argv_too_long`; the `10,000 characters` decoy at :205495 | cli_inner_pretty.js:205490-205499 | function |
| `mHy` | `WORKTREE_METADATA_SUFFIXES` (`/config.worktree`, `.lock`, `/commondir`) | cli_inner_pretty.js:313245 | constant |
| `pl` | `formatBytes` | cli_inner_pretty.js:33132-33139 | function |
| `pr` | `countWhere` | cli_inner_pretty.js:24548-24552 | function |

---

## Module: Sandbox — worktree path containment (shared with `53_subagent_limits`)

> Merge into: `symbol_index_infra_platform.md`
>
> These live in the shell-exec entry point rather than the sandbox runtime, but they are the path-containment
> half of the sandbox story. If `53_subagent_limits` also stages them, keep one row and the readable name
> used here.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dky` | `GIT_TREE_REDIRECT_FLAGS` (`--git-dir`, `--work-tree`) | cli_inner_pretty.js:312765 | constant |
| `Lky` | `GIT_VALUE_FLAGS` (`--namespace`, `--attr-source`, `--shallow-file`) | cli_inner_pretty.js:312764 | constant |
| `Mky` | `DEV_FD_PATH_RE` (`/dev/(fd\|stdin\|stdout\|stderr)/`) | cli_inner_pretty.js:312767 | constant |
| `Pky` | `PROC_SELF_PATH_RE` (`/proc/(self\|thread-self\|\d+)/`) | cli_inner_pretty.js:312766 | constant |
| `Uky` | `isGitRedirectEnvVar` — also `GIT_CONFIG*`, `HOME`, `CDPATH`, `XDG_CONFIG_HOME` | cli_inner_pretty.js:312569-312572 | function |
| `Yky` | `isGitRedirectConfigKey` (`core.worktree`, `core.bare`, `include.*`, `includeif.*`) | cli_inner_pretty.js:312738-312740 | function |
| `aTs` | `GIT_TREE_REDIRECT_ENV_VARS` (6 names incl. `GIT_WORK_TREE` at :312758) | cli_inner_pretty.js:312756-312763 | constant |
| `aed` | `isDeviceNamespacePath` — normalises `/./` and `//` before testing | cli_inner_pretty.js:312556-312559 | function |
| `cas` | `isPathWritableUnderSandbox` — in-process write gate; unaffected by `filesystem.disabled` | cli_inner_pretty.js:214068-214078 | function |
| `fBe` | `isUnresolvablePath` (`canonical === null && !skipped`) | cli_inner_pretty.js:307773 | function |
| `ied` | `worktreeCwdEscapeRefusal` — `network-shaped` :312391, unresolvable :312389 | cli_inner_pretty.js:312384-312396 | function |
| `led` | `isUnsafePathShape` — firmlinks, `/Volumes`, cygwin, `//server/share`, `~` | cli_inner_pretty.js:312560-312568 | function |
| `lTs` | `GIT_BINARY_NAME_RE` | cli_inner_pretty.js:312777 | constant |
| `rMd` | `buildSandboxPromptSection` — model-facing sandbox description | cli_inner_pretty.js:437150-437220 | function |
| `sed` | `classifyCwdVsWorktree` | cli_inner_pretty.js:312400-312408 | function |

---

## Module: Sandbox — UI and facade

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dco` | `resolvePathPatternForSandbox` | cli_inner_pretty.js:204659-204661 | function |
| `NPf` | `handleSandboxInstallCommand` — `/sandbox install`; `sandbox_windows_install` outcomes | cli_inner_pretty.js:724557-… | function |
| `Oo` | `SandboxManager` — the facade; named in the `Ess` export table (:204615-204642) at :204637 | cli_inner_pretty.js:204637 | object |
| `UTu` | `resolvePathPatternForSandboxAt` | cli_inner_pretty.js:204654-204658 | function |
| `cKr` | `SandboxViolationStore` | cli_inner_pretty.js:195128 | class |
| `jTu` | `resolveSandboxFilesystemPathAt` | cli_inner_pretty.js:204662-204665 | function |
