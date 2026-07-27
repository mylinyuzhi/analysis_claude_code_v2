# Symbol additions — v2.1.220 background agents (part 1: daemon / worker / session store)

**Staging file.** Every row below was derived by reading the line in
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines, `VERSION 2.1.220`, `build_sha 4073f595`). No name was carried over from the
2.1.193 tree — symbols are re-mangled every build.

Source documents:
[`../36_background_agents/daemon_lifecycle.md`](../36_background_agents/daemon_lifecycle.md),
[`../36_background_agents/worker_respawn_and_upgrade.md`](../36_background_agents/worker_respawn_and_upgrade.md),
[`../36_background_agents/session_store_and_worktrees.md`](../36_background_agents/session_store_and_worktrees.md).

Merge instructions are given per group. `File:Line` is always `cli_inner_pretty.js` in the
**2.1.220** bundle. Rows are alphabetical by obfuscated name within each group.

---

## Module: Background Agents — Daemon Lock & Process Identity

> **Merge into:** `symbol_index_core_features.md`, section *Background Agents*.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $ef | createDaemonLockExclusive | cli_inner_pretty.js:664710-664717 | function |
| Bef | staleLockAdviceText | cli_inner_pretty.js:664791-664793 | function |
| cAa | procStartMatchesWithRetry | cli_inner_pretty.js:664779-664787 | function |
| dsg | readProcStartUncached | cli_inner_pretty.js:112437-112452 | function |
| eHt | readOwnProcStartMemoised | cli_inner_pretty.js:112412-112414 | function |
| ERc | PROC_START_RETRY_JITTER_MS (250) | cli_inner_pretty.js:112478 | constant |
| Fef | removeDaemonLock | cli_inner_pretty.js:664762-664768 | function |
| gYo | describeUnknownOriginHolder | cli_inner_pretty.js:664834-664836 | function |
| Hbt | describeUnstoppedHolder | cli_inner_pretty.js:664824-664833 | function |
| hYo | PROC_START_RETRY_DELAY_MS (250) | cli_inner_pretty.js:664845 | constant |
| jAe | readDaemonLockRaw | cli_inner_pretty.js:664723-664739 | function |
| K0r | terminateAndWait | cli_inner_pretty.js:664686-664703 | function |
| KAn | stopTransientDaemonByLock | cli_inner_pretty.js:664806-664823 | function |
| lsg | PROC_START_HIT_TTL_MS (60000) | cli_inner_pretty.js:112475 | constant |
| csg | PROC_START_MISS_TTL_MS (5000) | cli_inner_pretty.js:112476 | constant |
| mB | procStartMatches | cli_inner_pretty.js:112404-112408 | function |
| mYo | writeDaemonLockAtomic | cli_inner_pretty.js:664740-664761 | function |
| N5r | readProcStartTwice | cli_inner_pretty.js:112432-112436 | function |
| Nef | markDaemonLockBgDisabled | cli_inner_pretty.js:664718-664722 | function |
| O5r | isPidDefinitelyGone | cli_inner_pretty.js:112329-112336 | function |
| Oef | DAEMON_LOCK_FILENAME ("daemon.lock") | cli_inner_pretty.js:664843 | constant |
| pq | daemonLockPath | cli_inner_pretty.js:664707-664709 | function |
| QH | readVerifiedDaemonLock | cli_inner_pretty.js:664794-664804 | function |
| Uef | daemonVersionDiffers | cli_inner_pretty.js:664837-664840 | function |
| usg | clearProcStartCache | cli_inner_pretty.js:112429-112431 | function |
| VAn | verifyDaemonCmdline | cli_inner_pretty.js:664769-664778 | function |
| Y0r | lockHasProcStartIdentity | cli_inner_pretty.js:664788-664790 | function |
| zAn | PROC_START_VERIFY_ATTEMPTS (2) | cli_inner_pretty.js:664844 | constant |
| _L | readProcStartCached | cli_inner_pretty.js:112415-112428 | function |

---

## Module: Background Agents — Build-Timestamp Version Recency

> **Merge into:** `symbol_index_core_features.md`, section *Background Agents*.
> (Cross-referenced from `symbol_index_infra_platform.md` *Model / Version* if a version-compare
> section exists there.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| eq_ | PRERELEASE_CHANNELS (["dev","engine"]) | cli_inner_pretty.js:552486 | constant |
| fhn | isPrereleaseBuild | cli_inner_pretty.js:552444-552446 | function |
| hhp | isOlderBuild | cli_inner_pretty.js:552469-552473 | function |
| iSr | channelsDiffer | cli_inner_pretty.js:552447-552452 | function |
| mhn | isNewerBuild | cli_inner_pretty.js:552474-552483 | function |
| rUt | parseEmbeddedBuildTimestamp | cli_inner_pretty.js:552453-552468 | function |
| ugt | prereleaseChannelOf | cli_inner_pretty.js:552441-552443 | function |

---

## Module: Background Agents — CLAUDE_CODE_PROCESS_WRAPPER (corporate launcher)

> **Merge into:** `symbol_index_infra_platform.md`, new section *Process Wrapper / Corporate
> Launcher* (it is a settings + spawn-policy surface), with a pointer from
> `symbol_index_core_features.md` *Background Agents*.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $Qr | resolveProcessWrapper | cli_inner_pretty.js:267508-267524 | function |
| a9 | processWrapperRecord | cli_inner_pretty.js:267556-267558 | function |
| D_s | absoluteLauncherProbeList | cli_inner_pretty.js:267546-267549 | function |
| DN | PROCESS_WRAPPER_ENV ("CLAUDE_CODE_PROCESS_WRAPPER") | cli_inner_pretty.js:267645 | constant |
| elr | processWrapperConfigError | cli_inner_pretty.js:267583-267585 | function |
| g_ | processWrapperArgv | cli_inner_pretty.js:267525-267527 | function |
| Iut | processWrapperResolutionCache | cli_inner_pretty.js:267512-267513 | variable |
| Kmy | validateProcessWrapper | cli_inner_pretty.js:267559-267582 | function |
| L_s | isExecutableFile | cli_inner_pretty.js:267538-267545 | function |
| N_s | lastPromotedProcessWrapper | cli_inner_pretty.js:267856, :267862 | variable |
| o6 | isProcessWrapperRunnable | cli_inner_pretty.js:267531-267537 | function |
| PE | processWrapperError | cli_inner_pretty.js:267528-267530 | function |
| R_s | lastRawProcessWrapperValue | cli_inner_pretty.js:267511-267513 | variable |
| Rut | LAUNCHER_FORK_EXIT_WINDOW_MS (12000) | cli_inner_pretty.js:267646 | constant |
| vMt | processWrapperRunnableError | cli_inner_pretty.js:267550-267555 | function |
| Xmy | parseProcessWrapperArgv | cli_inner_pretty.js:267586-267641 | function |

---

## Module: Background Agents — Self-Exec Target Resolution

> **Merge into:** `symbol_index_core_features.md`, section *Background Agents*.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Fko | isRunningFromVersionsDir | cli_inner_pretty.js:396979-396983 | function |
| ian | userLocalClaudePath | cli_inner_pretty.js:396997-396999 | function |
| jfe | applyLauncherPrefix | cli_inner_pretty.js:397000-397004 | function |
| ox | resolveWrappedSelfExec | cli_inner_pretty.js:396984-396986 | function |
| sNt | resolveSelfExecTarget | cli_inner_pretty.js:396987-396996 | function |
| umr | findNewestInstalledVersionBinary | cli_inner_pretty.js:397005-397019 | function |

---

## Module: Background Agents — Daemon Spawn & Takeover

> **Merge into:** `symbol_index_core_features.md`, section *Background Agents*.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _Ia | launcherNotRunnableNotice | cli_inner_pretty.js:680506-680508 | function |
| AJe | waitForDaemonPing | cli_inner_pretty.js:680053-680060 | function |
| cJo | binaryTakeoverState ("idle"/"attempted"/"took-over") | cli_inner_pretty.js:680524 | variable |
| Ccf | isNestedConfigDirSituation | cli_inner_pretty.js:680486-680489 | function |
| dGt | isExecutableFileAsync | cli_inner_pretty.js:679891-679898 | function |
| d$g | resolvePowerShellPath (5 rungs + the new %SYSTEMROOT% PS 5.1 last resort) | cli_inner_pretty.js:168540-168574 | function |
| eGb | describeInvokingCommand | cli_inner_pretty.js:680490-680495 | function |
| Gjb | windowsWmiSpawn | cli_inner_pretty.js:679946-679983 | function |
| GX | DAEMON_REACHABLE_TIMEOUT_MS (45000) | cli_inner_pretty.js:680522 | constant |
| ITn | ensureDaemonAskInstall | cli_inner_pretty.js:680554-680582 | function |
| j1m | DAEMON_IDLE_GRACE_MS (5000) | cli_inner_pretty.js:870908 | constant |
| jjb | macosAquaWrapPrefix | cli_inner_pretty.js:679917-679939 | function |
| Jjb | shouldClientRetireDaemonByVersion | cli_inner_pretty.js:680302-680318 | function |
| kcf | shouldAskDaemonServiceInstall | cli_inner_pretty.js:680515-680517 | function |
| Kjb | buildDaemonSpawnEnv | cli_inner_pretty.js:680015-680033 | function |
| kTn | applyAquaWrapPrefix | cli_inner_pretty.js:679941-679944 | function |
| lJo | spawnDaemonProcess | cli_inner_pretty.js:679802-679866 | function |
| OZ | getPowerShellPathCached | cli_inner_pretty.js:168575-168578 | function |
| qjb | joinWindowsArgv | cli_inner_pretty.js:679995-679997 | function |
| Qjb | maybeRetireStaleDaemon | cli_inner_pretty.js:680319-680407 | function |
| Tcf | detectZombieDaemon | cli_inner_pretty.js:680425-680485 | function |
| tGb | warnLogindKillUserProcesses | cli_inner_pretty.js:680496-680505 | function |
| TSE | DAEMON_STARTUP_IDLE_GRACE_MS (GX + j1m = 50000) | cli_inner_pretty.js:870937 | constant |
| uJo | waitForServiceDaemon | cli_inner_pretty.js:680061-680077 | function |
| Ujb | spawnDaemonThroughLauncher | cli_inner_pretty.js:679867-679889 | function |
| Vjb | quoteWindowsArgvToken | cli_inner_pretty.js:679998-680009 | function |
| wcf | rawDaemonReplacementWarned | cli_inner_pretty.js:680525 | variable |
| Wjb | buildWmiScript | cli_inner_pretty.js:679985-679993 | function |
| wSE | LOCK_REPLACE_SETTLE_MS (100) | cli_inner_pretty.js:870907 | constant |
| xcf | noteWrapperSkew | cli_inner_pretty.js:680509-680514 | function |
| Xjb | daemonLaunchTarget | cli_inner_pretty.js:680299-680301 | function |
| xTn | spawnDetached | cli_inner_pretty.js:679899-679915 | function |
| zjb | quotePowerShellSingle | cli_inner_pretty.js:680011-680014 | function |
| Zjb | shouldRetireUnwrappedDaemon | cli_inner_pretty.js:680408-680424 | function |
| ASE | DAEMON_STALE_CHECK_INTERVAL_MS (60000) | cli_inner_pretty.js:870906 | constant |
| CSE | binaryIdentityChanged | cli_inner_pretty.js:870496-870499 | function |
| xSE | reportManagerListenFailure | cli_inner_pretty.js:870500-870506 | function |

---

## Module: Background Agents — Low-Memory & Retire Grace

> **Merge into:** `symbol_index_core_features.md`, section *Background Agents*.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ehp | bridgedRetireGraceMs | cli_inner_pretty.js:552623-552625 | function |
| nq_ | MAC_PRESSURE_SYSCTL_NAME ("kern.memorystatus_vm_pressure_level") | cli_inner_pretty.js:552638 | constant |
| o7e | isLowMemory | cli_inner_pretty.js:552605-552607 | function |
| oq_ | readMacVmPressureLevel | cli_inner_pretty.js:552608-552622 | function |
| r7s | isAttachUpgradeEnabled | cli_inner_pretty.js:552626-552628 | function |
| rq_ | MAC_PRESSURE_CRITICAL (4) | cli_inner_pretty.js:552630 | constant |
| t7s | lowMemorySnapshot | cli_inner_pretty.js:552598-552604 | function |
| yhn | macSysctlSymbolCache | cli_inner_pretty.js:552609-552618 | variable |

---

## Module: Background Agents — BackgroundWorker (respawn, upgrade, rekey, adopt)

> **Merge into:** `symbol_index_core_features.md`, section *Background Agents*.
> Class methods are listed as `ClassName.method` in the Readable column.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $hp | FAST_CRASH_WINDOW_MS (5000) | cli_inner_pretty.js:554829 | constant |
| ARe | isHostManagedProviderDispatch | cli_inner_pretty.js:554842 | function |
| Bhp | DISPATCH_STRING_CAP (4096) | cli_inner_pretty.js:554840 | constant |
| bq_ | RECENT_INPUT_WINDOW_MS (3600000) | cli_inner_pretty.js:554839 | constant |
| d7s | bunPtyHostSpawner | cli_inner_pretty.js:553352-553376 | function |
| dq_ | EXTERNAL_STOP_EXIT_CODES ({129,143}) | cli_inner_pretty.js:554884 | constant |
| Eq_ | isWorkerPhaseTransitionLegal | cli_inner_pretty.js:553500-553513 | function |
| f7s | writeSocketTokensFile | cli_inner_pretty.js:553466-553479 | function |
| Fhp | ADOPT_GRACE_MS (120000) | cli_inner_pretty.js:554836 | constant |
| fq_ | RESUME_INTERRUPTED_TURN_MAX_AGE_MS (3600000) | cli_inner_pretty.js:554827 | constant |
| Ghp | applyProcessWrapperToWorkerEnv | cli_inner_pretty.js:553447-553451 | function |
| gq_ | HOST_WAKE_GRACE_MS (60000) | cli_inner_pretty.js:554831 | constant |
| h7s | hasNonResumableInFlight | cli_inner_pretty.js:553480-553484 | function |
| hq_ | LONG_RUN_RESET_MS (300000) | cli_inner_pretty.js:554830 | constant |
| jhp | buildWorkerEnv | cli_inner_pretty.js:553391-553446 | function |
| Mhp | MAX_RESPAWN_ATTEMPTS (20) | cli_inner_pretty.js:554823 | constant |
| mme | BackgroundWorker | cli_inner_pretty.js:553515-554817 | class |
| mme.adopt | BackgroundWorker.adopt | cli_inner_pretty.js:553981-554075 | function |
| mme.buildClaimFrame | BackgroundWorker.buildClaimFrame | cli_inner_pretty.js:553973-553980 | function |
| mme.cappedDispatch | BackgroundWorker.cappedDispatch | cli_inner_pretty.js:554216-554232 | function |
| mme.checkPid | BackgroundWorker.checkPid | cli_inner_pretty.js:554772-554801 | function |
| mme.claim | BackgroundWorker.claim | cli_inner_pretty.js:553936-553965 | function |
| mme.doSpawn | BackgroundWorker.doSpawn | cli_inner_pretty.js:554302-554471 | function |
| mme.doSpawnUnlessSettledOnDisk | BackgroundWorker.doSpawnUnlessSettledOnDisk | cli_inner_pretty.js:554654-554673 | function |
| mme.fireAuthRekey | BackgroundWorker.fireAuthRekey | cli_inner_pretty.js:553876-553880 | function |
| mme.logVanished | BackgroundWorker.logVanished | cli_inner_pretty.js:554802-554812 | function |
| mme.noteDowngradeRefused | BackgroundWorker.noteDowngradeRefused | cli_inner_pretty.js:553644-553652 | function |
| mme.onExit | BackgroundWorker.onExit | cli_inner_pretty.js:554535-554653 | function |
| mme.onPtyAuthRequired | BackgroundWorker.onPtyAuthRequired | cli_inner_pretty.js:553819-553829 | function |
| mme.pidRecycledAsync | BackgroundWorker.pidRecycledAsync | cli_inner_pretty.js:554766-554770 | function |
| mme.rekeyForAuthMismatch | BackgroundWorker.rekeyForAuthMismatch | cli_inner_pretty.js:553830-553875 | function |
| mme.respawnIfIdleStale | BackgroundWorker.respawnIfIdleStale | cli_inner_pretty.js:553653-553717 | function |
| mme.retireIfSettled | BackgroundWorker.retireIfSettled | cli_inner_pretty.js:553718-553813 | function |
| mme.rosterEntry | BackgroundWorker.rosterEntry | cli_inner_pretty.js:554195-554215 | function |
| mme.scheduleRespawn | BackgroundWorker.scheduleRespawn | cli_inner_pretty.js:554686-554703 | function |
| mme.settleCwdGone | BackgroundWorker.settleCwdGone | cli_inner_pretty.js:554674-554680 | function |
| mme.socketAuth | BackgroundWorker.socketAuth | cli_inner_pretty.js:553966-553972 | function |
| mme.transitionTo | BackgroundWorker.transitionTo | cli_inner_pretty.js:553618-553628 | function |
| mme.unverified | BackgroundWorker.unverified | cli_inner_pretty.js:554076-554111 | function |
| mq_ | MAX_AUTH_REKEYS (3) | cli_inner_pretty.js:554828 | constant |
| Nhp | SLEEP_DETECT_THRESHOLD_MS (u7s*3 = 15000) | cli_inner_pretty.js:554834, :554885 | constant |
| Ohp | isRevivalGuardEnabled | cli_inner_pretty.js:553349-553350 | function |
| p7s | writeAuthSnapshot | cli_inner_pretty.js:553452-553465 | function |
| pq_ | RESUME_AFTER_CRASH_PROMPT | cli_inner_pretty.js:554825-554826 | constant |
| qhp | describeWorkerPhase | cli_inner_pretty.js:553497-553499 | function |
| Sq_ | classifySettleState | cli_inner_pretty.js:553485-553491 | function |
| u7s | PID_POLL_INTERVAL_MS (5000) | cli_inner_pretty.js:554833 | constant |
| Uhp | buildWorkerArgv | cli_inner_pretty.js:553378-553390 | function |
| uq_ | RESPAWN_BACKOFF_MS (10000) | cli_inner_pretty.js:554822 | constant |
| Vhp | DETRITUS_TASK_KINDS | cli_inner_pretty.js:554885 | constant |
| Whp | classifyRekeySafety | cli_inner_pretty.js:553492-553496 | function |
| yq_ | RV_STALL_THRESHOLD_MS (120000) | cli_inner_pretty.js:554835 | constant |
| _q_ | EMPTY_IDLE_GRACE_MS (300000) | cli_inner_pretty.js:554837 | constant |

---

## Module: Background Agents — Manager Sweep & Prewarm

> **Merge into:** `symbol_index_core_features.md`, section *Background Agents*.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| d$n | SWEEP_INTERVAL_MS (60000) | cli_inner_pretty.js:870133 | constant |
| dSE | BURST_ROUND_DELAY_MS (2000) | cli_inner_pretty.js:870134 | constant |
| pSE | BURST_DEADLINE_MS (300000) | cli_inner_pretty.js:870135 | constant |
| uSE | IDLE_RETIRE_GRACE_MS (3600000) | cli_inner_pretty.js:870131 | constant |
| Vvl | subscribeWorkerSettle | cli_inner_pretty.js:869945-869974 | function |
| $vl | claimSpareWorker (kills the spare if the claim frame cannot be delivered) | cli_inner_pretty.js:869067-869084 | function |
| eSE | buildSpareClaimFrame ({cwd, env, argv, sessionId, auth}) | cli_inner_pretty.js:869085-869088 | function |
| g1m | SPARE_CLAIM_RETRY_DELAYS_MS ([50,100,150,200,250,300,400,500,500,500]) | cli_inner_pretty.js:869190 | constant |
| tSE | sendSpareClaimFrame (5 s deadline, ENOENT/ECONNREFUSED ladder) | cli_inner_pretty.js:869089-869103 | function |
| Wvl | LOW_MEM_RETIRE_GRACE_MS (60000) | cli_inner_pretty.js:870132 | constant |

---

## Module: Background Agents — Roster Store

> **Merge into:** `symbol_index_core_features.md`, section *Background Agents*.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| A6 | redactShort | cli_inner_pretty.js:330287-330289 | function |
| aMy | ROSTER_KNOWN_KEYS | cli_inner_pretty.js:330331-330377 | constant |
| bad | redactIssuePath | cli_inner_pretty.js:330284-330286 | function |
| cMy | writeRoster | cli_inner_pretty.js:330294-330306 | function |
| dwo | extractUnknownRosterFields | cli_inner_pretty.js:330031-330036 | function |
| Ead | rosterMutationChain | cli_inner_pretty.js:330319, :330378 | variable |
| eIe | SHORT_ID_RE (/^[a-f0-9]{8}$/) | cli_inner_pretty.js:330063 | constant |
| Eks | prunedOrphanShorts | cli_inner_pretty.js:330929-330931 | variable |
| F1t | isPidLive | cli_inner_pretty.js:330385-330387 | function |
| Fdr | CONNECTION_ERROR_RE | cli_inner_pretty.js:330102 | constant |
| fks | workerRecordSchema | cli_inner_pretty.js:330106-330125 | object |
| gks | classifyPidLiveness | cli_inner_pretty.js:330380-330384 | function |
| hks | controlRequestSchema | cli_inner_pretty.js:330134-330208 | object |
| jdr | ERROR_CODE_PREFIX_RE | cli_inner_pretty.js:330105 | constant |
| lMy | ROSTER_SIZE_CAP (8388608) | cli_inner_pretty.js:330318 | constant |
| mks | rosterFileSchema | cli_inner_pretty.js:330126-330133 | object |
| Nad | adoptRosterOrphans | cli_inner_pretty.js:330915-330967 | function |
| Ndr | RESPAWNING_ERROR_RE | cli_inner_pretty.js:330101 | constant |
| pwo | quarantineRoster | cli_inner_pretty.js:330281-330283 | function |
| qnn | dispatchRequestSchema | cli_inner_pretty.js:330064-330099 | object |
| rIe | mutateRoster | cli_inner_pretty.js:330307-330314 | function |
| Rpt | KICKED_ERROR_RE | cli_inner_pretty.js:330104 | constant |
| Sad | countRosterWorkers | cli_inner_pretty.js:330290-330293 | function |
| Udr | STALLED_ERROR_RE | cli_inner_pretty.js:330103 | constant |
| v6 | readRoster | cli_inner_pretty.js:330213-330280 | function |
| znn | emptyRoster | cli_inner_pretty.js:330210-330212 | function |

---

## Module: Background Agents — Job / Session State Store

> **Merge into:** `symbol_index_core_features.md`, section *Background Agents*.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Aks | jobStateWritesInFlight | cli_inner_pretty.js:330466-330470 | variable |
| BE | invalidateJobStateCache | cli_inner_pretty.js:330489-330491 | function |
| Bg | logStateWriteFailure | cli_inner_pretty.js:330473-330480 | function |
| BN | jobsRoot | cli_inner_pretty.js:330418-330420 | function |
| Da | readJobState | cli_inner_pretty.js:330492-330573 | function |
| dm | isSettledState | cli_inner_pretty.js:330978-330980 | function |
| Dpt | bridgeReattachEnv | cli_inner_pretty.js:330481-330488 | function |
| Gdr | dropMalformedPersistedField | cli_inner_pretty.js:330411-330417 | function |
| Had | isJobStateWriteInFlight | cli_inner_pretty.js:330459-330461 | function |
| JBe | isPlainExecTemplate | cli_inner_pretty.js:330981-330983 | function |
| kad | watchJobStateMtime | cli_inner_pretty.js:330431-330458 | function |
| Lpt | transientStateReadSeen | cli_inner_pretty.js:330527-330529 | variable |
| mCe | locateSessionTranscript | cli_inner_pretty.js:51513-51549 | function |
| mwo | readJobStateFresh | cli_inner_pretty.js:330574-330580 | function |
| nIe | jobStateCache | cli_inner_pretty.js:330508-330560 | variable |
| oD | stateToOutcome | cli_inner_pretty.js:330969-330974 | function |
| oIe | jobOriginCwd | cli_inner_pretty.js:330990-330993 | function |
| qrt | quarantineJobTranscript | cli_inner_pretty.js:51505-51512 | function |
| rc | jobDir | cli_inner_pretty.js:330421-330423 | function |
| UE | currentJobShort | cli_inner_pretty.js:330424-330430 | function |
| ULi | transcriptHasMessages | cli_inner_pretty.js:51479-51481 | function |
| um | writeJobState | cli_inner_pretty.js:330462-330472 | function |
| XBe | newJobState | cli_inner_pretty.js:330871-330914 | function |
| Ydr | isBlockedNonExecState | cli_inner_pretty.js:330984-330986 | function |
| zB | isTerminalState | cli_inner_pretty.js:330975-330977 | function |
| zLi | classifyTranscriptContent | cli_inner_pretty.js:51482-51504 | function |

---

## Module: Background Agents — Job Deletion & Adoption Handoff

> **Merge into:** `symbol_index_core_features.md`, section *Background Agents*.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CJe | killJobConfirmed | cli_inner_pretty.js:680761-680800 | function |
| Dcf | reapAdoptedShellsFromExitHandoff | cli_inner_pretty.js:680698-680731 | function |
| EIa | scanPtyHostsForJob | cli_inner_pretty.js:680801-680815 | function |
| fJo | describeKeptWorktreeReason | cli_inner_pretty.js:681111-681117 | function |
| FY_ | ADOPT_CLAIM_RETRY_MS (250) | cli_inner_pretty.js:565198 | constant |
| gDe | findLiveSessionOwner | cli_inner_pretty.js:680688-680697 | function |
| iGb | REAP_MAX_AGE_MS (604800000) | cli_inner_pretty.js:680735 | constant |
| nEr | writeAdoptFile | cli_inner_pretty.js:564907-564927 | function |
| oGb | REAP_CLAIM_RETRY_MS (250) | cli_inner_pretty.js:680734 | constant |
| rEr | ADOPT_STALE_MS (120000) | cli_inner_pretty.js:565196 | constant |
| sGb | REAP_MAX_ENTRIES (256) | cli_inner_pretty.js:680736 | constant |
| Ucf | daemonUnreachableReplyNotice | cli_inner_pretty.js:680861-680863 | function |
| Z3e | deleteJob | cli_inner_pretty.js:681118-681150 | function |
| ZSp | claimAdoptFile | cli_inner_pretty.js:564928-564980 | function |

---

## Module: Background Agents — Worktree Locks, Removal & Retention

> **Merge into:** `symbol_index_core_features.md`, section *Background Agents*.
> (`Vor` / `DDt` / `gRu` also belong conceptually to git tooling — cross-reference from
> `symbol_index_infra_integration.md` if a *Git / Worktrees* section exists.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $Ru | REPARSE_POINT_REFUSAL ("unremovable reparse point in the worktree") | cli_inner_pretty.js:226263 | constant |
| Acs | sweepStaleWorktrees | cli_inner_pretty.js:225962-226008 | function |
| ARu | isReleasableClaudeLockReason | cli_inner_pretty.js:226041-226046 | function |
| DDt | restoreWorktreeConfig | cli_inner_pretty.js:225888-225921 | function |
| etf | DEFAULT_CLEANUP_PERIOD_DAYS (30) | cli_inner_pretty.js:665753 | constant |
| gRu | clearWindowsReparsePoint | cli_inner_pretty.js:224249-224262 | function |
| GRu | isWorktreeCleanAndPushed | cli_inner_pretty.js:225957-225961 | function |
| HVe | RESOLUTION_CHANGED_REFUSAL | cli_inner_pretty.js:226261 | constant |
| oZg | GIT_UNRECOGNIZED_WORKTREE_RE | cli_inner_pretty.js:226315 | constant |
| ORu | deleteWorktreeBranch | cli_inner_pretty.js:225647-225652 | function |
| pAa | retentionSkipReason | cli_inner_pretty.js:664931-664957 | function |
| qdo | resolveEnterableWorktree | cli_inner_pretty.js:225288-225372 | function |
| RG | retentionCutoffDate | cli_inner_pretty.js:664959-664965 | function |
| rtf | runRetentionSweep | cli_inner_pretty.js:665693-665751 | function |
| RVe | mayReleaseWorktreeLock | cli_inner_pretty.js:225069-225073 | function |
| v7r | NO_REPOSITORY_REFUSAL ("has files but no repository to verify them against") | cli_inner_pretty.js:226262 | constant |
| VNe | ensureNoReparsePoint | cli_inner_pretty.js:224244-224248 | function |
| Vor | removeRootlessAgentWorktree | cli_inner_pretty.js:225653-225719 | function |
| vpe | unlockWorktree | cli_inner_pretty.js:225644-225646 | function |
| vRu | STALE_LOCK_RELEASE_CAP (50) | cli_inner_pretty.js:226268 | constant |
| Wlt | CLAUDE_LOCK_REASON_RE | cli_inner_pretty.js:226313 | constant |
| WRu | releaseStaleClaudeWorktreeLocks | cli_inner_pretty.js:226047-226099 | function |
| Xor | worktreeLockReasonFor | cli_inner_pretty.js:225081-225086 | function |
| ycs | isLockedByLiveSession | cli_inner_pretty.js:225063-225068 | function |
| Yor | releaseWorktreeLockIfOurs | cli_inner_pretty.js:225074-225080 | function |
| zI | caseFoldPath | cli_inner_pretty.js:224238-224243 | function |
| zor | isWindowsUncPath | cli_inner_pretty.js:225285-225287 | function |

---

## Module: Background Agents — Settings & Env Keys

> **Merge into:** `symbol_index_infra_platform.md`, section *Settings / Env*.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Sxt | AUTH_ENV_KEYS (ANTHROPIC_BASE_URL, _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL, ANTHROPIC_CUSTOM_HEADERS) | cli_inner_pretty.js:57882 | constant |
| m7s | WORKER_ENV_DROP_LIST | cli_inner_pretty.js:554886-554893 | constant |
| — | `processWrapper` settings field (zod) | cli_inner_pretty.js:60628-60633 | object |
| — | `processWrapper` settings-key allow-list entry | cli_inner_pretty.js:57988 | constant |
| — | `evict` control-request field (zod) | cli_inner_pretty.js:330157 | object |
