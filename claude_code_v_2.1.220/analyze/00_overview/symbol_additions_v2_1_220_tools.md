# Symbol additions — v2.1.220 `04_tools` (tool surface and individual tool behaviour)

Staged symbol tables from the [`04_tools/`](../04_tools/README.md) pass. Every `File:Line` is a line
**read in the 2.1.220 bundle** (`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`)
during that pass. Rows tagged `(193)` in the Notes column reference the baseline bundle explicitly.

Row format per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §6:
`| Obfuscated | Readable | File:Line | Type |`, sorted alphabetically by obfuscated id inside each module
section.

---

## MERGE TARGET: `symbol_index_core_execution.md`
*(Tools, tool registry, tool dispatch, tool-result plumbing — §6 routing: "tools" → core execution)*

### Module: Tools — registry, deferral and ToolSearch

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Jn` | DEFERRED_PLACEHOLDER_DESCRIPTION | cli_inner_pretty.js:121283 | constant |
| `$O_` | resolveToolDescriptionForApi | cli_inner_pretty.js:508141-508153 | function |
| `$Td` | scoreToolsForSearch | cli_inner_pretty.js:405899-405967 | function |
| `D2c` | stripFoundryUnsupportedToolFields | cli_inner_pretty.js:121340-121369 | function |
| `Gbi` | setDeferredToolStubGateLatch | cli_inner_pretty.js:2786-2788 | function |
| `L2c` | parseFoundryUnsupportedCapabilities | cli_inner_pretty.js:121294-121307 | function |
| `NJn` | classifyFoundryCapabilityError | cli_inner_pretty.js:121333-121339 | function |
| `Oeu` | getToolSchemaCache | cli_inner_pretty.js:154115-154117 | function |
| `Oxd` | modelIdMeetsFamilyFloor | cli_inner_pretty.js:412936-412949 | function |
| `Zv` | TOOL_SEARCH_TOOL_NAME | cli_inner_pretty.js:121281 | constant |
| `azy` | buildWordBoundaryRegexMap | cli_inner_pretty.js:405894-405898 | function |
| `c6i` | recordFoundryUnsupported | cli_inner_pretty.js:121308-121317 | function |
| `ddg` | FOUNDRY_STRIPPABLE_CAPABILITIES | cli_inner_pretty.js:121387 | constant |
| `e$e` | foundryDeploymentSupports | cli_inner_pretty.js:121318-121322 | function |
| `jQt` | DEFERRED_PLACEHOLDER_NAME | cli_inner_pretty.js:121282 | constant |
| `jbi` | getDeferredToolStubGateLatch | cli_inner_pretty.js:2783-2785 | function |
| `l6i` | foundryDeploymentKey | cli_inner_pretty.js:121290-121293 | function |
| `o4` | isToolSearchEnabled | cli_inner_pretty.js:217441-217469 | function |
| `pfe` | checkToolPermission | cli_inner_pretty.js:528640 | function |
| `ptp` | buildDeferredToolPlaceholder | cli_inner_pretty.js:508596-508606 | function |
| `qLo` | serializeToolForApi | cli_inner_pretty.js:508154-508217 | function |
| `r7` | isDeferredTool | cli_inner_pretty.js:231912-231926 | function |
| `u6i` | extractFoundryUnsupportedFromError | cli_inner_pretty.js:121323-121332 | function |
| `w_e` | isExperimentalBetasDisabled | cli_inner_pretty.js:109341-109343 | function |
| `yqs` | isSimpleMode | cli_inner_pretty.js:507686-507688 | function |

Notes:
- `r7` is **carryover**: the 2.1.193 counterpart `Tj` at `:230406 (193)` has the same ten branches in the
  same order. Do not record it as new.
- `ptp` / `jQt` / `$Jn` / `jbi` / `Gbi` are net-new (220=1 / 193=0 each) and exist to keep
  `defer_loading` present in every request so the server-side tool-search beta cannot flip mid-session.
  Gate: `tengu_deferred_stub_tool` (`:508600`).
- `o4` logs `[ToolSearch:optimistic]` once per session, latched on `Rlt` (`:217475`), with four distinct
  reasons: `standard` mode `:217446`, non-first-party `ANTHROPIC_BASE_URL` `:217453`, Vertex `:217461`,
  and the success line `:217467`.

### Module: Tools — tool dispatch and progress

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `T$y` | getMaxToolUseConcurrency | cli_inner_pretty.js:340792-340795 | function |
| `aB_` | RECOGNISED_PROGRESS_SUBTYPES | cli_inner_pretty.js:527581-527593 | constant |
| `fIs` | TOOL_HEARTBEAT_INTERVAL_MS | cli_inner_pretty.js:340787 | constant |
| `rdd` | startToolHeartbeat | cli_inner_pretty.js:340758-340785 | function |
| `w$y` | noopHeartbeatStop | cli_inner_pretty.js:340786 | function |

Notes:
- `rdd` is called at `:426176` inside the dispatcher's `try/finally`; heartbeats are suppressed for
  telemetry at `:425513`, for progress grouping at `:531054`, for the interactive reducer at `:822583`,
  and for the SDK adapter at `:756586-756588`.
- `T$y` reads `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY`, default **10**.

### Module: Tools — EndConversation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$xd` | modelMeetsEndConversationFloor | cli_inner_pretty.js:412964-412966 | function |
| `Fxd` | parseEndConversationFlagValue | cli_inner_pretty.js:412975-412982 | function |
| `KYy` | EndConversationTool | cli_inner_pretty.js:413093-413161 | object |
| `Nxd` | compileAllowedEntrypointsRegex | cli_inner_pretty.js:412967-412974 | function |
| `PB` | END_CONVERSATION_TOOL_NAME | cli_inner_pretty.js:231369 | constant |
| `Q1s` | DEFAULT_ALLOWED_ENTRYPOINTS | cli_inner_pretty.js:413059 | constant |
| `Uxd` | lastAssistantTurnCalledEndConversation | cli_inner_pretty.js:413063-413080 | function |
| `VYy` | endConversationInputSchema | cli_inner_pretty.js:413091 | function |
| `WYy` | END_CONVERSATION_MODEL_FLOORS | cli_inner_pretty.js:413053-413058 | constant |
| `Yan` | END_CONVERSATION_DESCRIPTION | cli_inner_pretty.js:413009-413047 | constant |
| `Z1s` | END_CONVERSATION_FORK_REFLECTION_PROMPT | cli_inner_pretty.js:412998-412999 | constant |
| `cIo` | isEndConversationToolEnabled | cli_inner_pretty.js:412983-412989 | function |
| `e$s` | END_CONVERSATION_FINAL_MESSAGE | cli_inner_pretty.js:413048 | constant |
| `lIo` | END_CONVERSATION_TOOL_RESULT | cli_inner_pretty.js:412997 | constant |
| `n$s` | markSessionEndedByModel | cli_inner_pretty.js:525464-525470 | function |
| `qYy` | getDeferredHintSection | cli_inner_pretty.js:412991-412995 | function |
| `qus` | END_CONVERSATION_GB_FLAG | cli_inner_pretty.js:231370 | constant |
| `t$s` | END_CONVERSATION_REFLECTION_PROMPT | cli_inner_pretty.js:413049-413052 | constant |
| `wRd` | endConversationToolBinding | cli_inner_pretty.js:425147 | variable |
| `zYy` | endConversationOutputSchema | cli_inner_pretty.js:413092 | function |

Notes:
- `qus` = `"tengu_umber_kestrel"`. Gate default at the call site is `!1` (`:412987`) — absent flag = off.
- `WYy` = `[["opus",[4,8]],["sonnet",[5]],["fable",[5]],["mythos",[5]]]`; `haiku` is absent, and
  `claude-3-*` ids fail `Oxd`'s regex.
- `Q1s` = `/^cli$/i` and is also the **fail-closed fallback** when `Nxd` cannot compile the gate's
  `scope` string.
- Whole cluster is net-new: `EndConversation` 220=7/193=0, `tengu_umber_kestrel` 220=1/193=0,
  `endedByModel` 220=14/193=0, `ended-by-model` 220=6/193=0.

### Module: Tools — Bash and PowerShell

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AHy` | buildPkillShimSnippet | cli_inner_pretty.js:313507-313534 | function |
| `H2e` | segmentIsDirectoryChange | cli_inner_pretty.js:394706-394709 | function |
| `HVy` | MIN_AUTO_BACKGROUND_TIMEOUT_MS | cli_inner_pretty.js:401273 | constant |
| `Kr_` | canAutoBackgroundCommand | cli_inner_pretty.js:437470-437483 | function |
| `M$g` | scriptRequiresLeadingStatement | cli_inner_pretty.js:169486-169514 | function |
| `O$g` | POWERSHELL_ENV_DEFAULTS | cli_inner_pretty.js:169575 | constant |
| `P$g` | POWERSHELL_ENCODING_PROLOGUE | cli_inner_pretty.js:169564 | constant |
| `VZy` | PWSH_NEGATIVE_ANSWER_COMMANDS | cli_inner_pretty.js:430984 | constant |
| `Wr_` | AUTO_BACKGROUND_EXCLUDED_COMMANDS | cli_inner_pretty.js:437812 | constant |
| `Y9r` | powerShellSpawnArgs | cli_inner_pretty.js:169480-169482 | function |
| `Yr_` | describeStandaloneSleep | cli_inner_pretty.js:437484-437494 | function |
| `_Hy` | PRESERVED_SNAPSHOT_ENV_VARS | cli_inner_pretty.js:313420-313439 | constant |
| `cHo` | resolveEffectiveBashTimeout | cli_inner_pretty.js:401263-401270 | function |
| `crd` | buildGhRateLimitHint | cli_inner_pretty.js:316769-316775 | function |
| `iM` | isAntNativeSurface | cli_inner_pretty.js:269047-269051 | function |
| `kVy` | BASH_TIMEOUT_CEILING_MS | cli_inner_pretty.js:401272 | constant |
| `lHo` | resolveBashMaxTimeout | cli_inner_pretty.js:401255-401262 | function |
| `nmr` | commandChangesDirectory | cli_inner_pretty.js:394710-394712 | function |
| `tcu` | buildPowerShellShellDescriptor | cli_inner_pretty.js:169515-169559 | function |
| `vHy` | buildFindGrepShimSnippet | cli_inner_pretty.js:313479-313506 | function |
| `xVy` | DEFAULT_BASH_TIMEOUT_MS | cli_inner_pretty.js:401271 | constant |

Notes:
- `xVy = 120000`, `kVy = 600000`, `HVy = 2000` are declared together at `:401271-401273`.
- `nmr` / `H2e` are **carryover** (193 `j9t` / `eue` at `:460972-460977 (193)`, byte-identical bodies).
  The delta is the single new call site at `:438256` producing `backgroundCwdHint`.
- `VZy` = `new Set(["select-string","get-childitem","findstr","where.exe"])` and is byte-identical to
  193's `Vnf` — the `.214` `where.exe` bullet is **not** anchored here.
- `Wr_` = `["sleep"]`.
- `tcu` carries five deltas vs 193 `xwa` (`:301552-301586 (193)`): `stdin: "ignore"`, the `P$g` prologue,
  the `Mt() !== "windows"` guard on `-EncodedCommand`, a non-empty base env, and the `O$g` defaults.

### Module: Tools — Bash result fields (zod output schema)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `backgroundCwdHint` | backgroundCwdHint (field) | cli_inner_pretty.js:437863-437869 | variable |
| `timedOutAfterMs` | timedOutAfterMs (field) | cli_inner_pretty.js:437859-437862 | variable |

Notes:
- Both are net-new (`timedOutAfterMs` 220=9/193=0, `backgroundCwdHint` 220=3/193=0). The sibling fields
  `backgroundedByUser`, `persistedOutputPath`, `staleReadFileStateHint`, `ghRateLimitHint` are all
  carryover (8/8, 6/6, 3/3, 3/3). Field names are not obfuscated in the schema, hence the identity rows.

### Module: Tools — Read / Edit / Write / Grep / Glob

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Aze` | isFullFileRead | cli_inner_pretty.js:309718-309733 | function |
| `Bws` | readCachedFileContent | cli_inner_pretty.js:310485-310488 | function |
| `EEe` | contentMatchesCachedRead | cli_inner_pretty.js:309735 | function |
| `GHe` | cloneReadFileState | cli_inner_pretty.js:309814-309821 | function |
| `HTu` | RipgrepSpawnError | cli_inner_pretty.js:204186 | class |
| `Iir` | FileTooLargeError | cli_inner_pretty.js:235355-235366 | class |
| `Jws` | readWouldBeAutoAllowed | cli_inner_pretty.js:310878-310880 | function |
| `Kry` | splitBufferedLines | cli_inner_pretty.js:235139 | function |
| `Nxy` | READ_FILE_STATE_INLINE_THRESHOLD | cli_inner_pretty.js:309833 | constant |
| `OZu` | FileContentCache | cli_inner_pretty.js:310451-310484 | class |
| `Qry` | streamFileLines | cli_inner_pretty.js:235137 (call), :235257-235285 (guard) | function |
| `Qws` | classifyOldStringApplicability | cli_inner_pretty.js:310881-310890 | function |
| `Rir` | SelectedRangeTooLargeError | cli_inner_pretty.js:235367-235378 | class |
| `S9` | READ_FILE_STATE_MAX_ENTRIES | cli_inner_pretty.js:309831 | constant |
| `SZu` | ReadFileStateCache | cli_inner_pretty.js:309753-309802 | class |
| `TSs` | MAX_BYTES_PER_TOKEN | cli_inner_pretty.js:284307 | constant |
| `Vry` | SMALL_FILE_THRESHOLD | cli_inner_pretty.js:235348 | constant |
| `Zws` | readOnPathIsSilentlyAllowed | cli_inner_pretty.js:528631-528639 | function |
| `cky` | toolsetHasEditButNoRead | cli_inner_pretty.js:310874-310877 | function |
| `eky` | FILE_CACHE_MAX_ENTRIES | cli_inner_pretty.js:310489 | constant |
| `iTs` | formatPaginationNote | cli_inner_pretty.js:312007-312012 | function |
| `lFe` | readFileLines | cli_inner_pretty.js:235119-235138 | function |
| `p6` | makeReadFileStateCache | cli_inner_pretty.js:309805-309807 | function |
| `rky` | fileContentCacheSingleton | cli_inner_pretty.js:310491 | variable |
| `rss` | assertNoNullBytesBeforeRipgrepSpawn | cli_inner_pretty.js:204177-204187 | function |
| `tky` | FILE_CACHE_MAX_BYTES | cli_inner_pretty.js:310490 | constant |
| `wTu` | spawnRipgrep | cli_inner_pretty.js:204202-204250 | function |
| `zry` | STREAM_CAP_BYTES | cli_inner_pretty.js:235349 | constant |
| `$xy` | READ_FILE_STATE_MAX_BYTES | cli_inner_pretty.js:309832 | constant |

Notes:
- **Net-new:** `Rir` / `maxSelectedBytes` (220=11/193=0), `rss` / `HTu`
  (`ripgrep spawn blocked: null byte` 220=3/193=0), `tky = 16777216` (the 16 MiB edit-read-cache bound),
  `Jws` / `Zws` / `cky` (the replacement for the deleted `tengu_cedar_sundial` gate).
- **Carryover:** `SZu` / `p6` / `GHe` / `S9 = 5000` / `$xy = 26214400` / `Nxy = 4096` are identical to
  193's `nXi` / `lF` / `L_e` / `p1` / `L9d` / `D9d` (`:233649-233725 (193)`). `Iir` is carryover
  (`FileTooLargeError` 2/2).
- `OZu` replaced 193's `B8a` (`:375738-375774 (193)`), which was a plain `Map` with
  `maxCacheSize = 1000` and FIFO eviction — no byte bound at all.
- `Vry = 10485760` (10 MiB) and `zry = 134217728` (128 MiB) are declared with the error classes at
  `:235348-235351`.

### Module: Tools — tool-input normalisation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BO_` | ESCAPE_RE_G | cli_inner_pretty.js:508588 | constant |
| `UO_` | WINDOWS_PATH_RE | cli_inner_pretty.js:508589 | constant |
| `atp` | postNormalizeToolInput | cli_inner_pretty.js:508391-508471 | function |
| `ctp` | repairDoubleEscapedUnicode | cli_inner_pretty.js:508472-508481 | function |
| `ltp` | ESCAPE_RE | cli_inner_pretty.js:508587 | constant |
| `vqs` | repairValue | cli_inner_pretty.js:508482-508506 | function |

Notes:
- `vqs`'s repair body is **carryover** from 193's `hor` (`:593474-593496 (193)`), including the identical
  regex. The **net-new** parts are the `ltp.test` fast reject (`:508485`), the `UO_` Windows bail-out
  (`:508486`), the `{ repairedStrings, windowsPathSkips }` counters, and the
  `tengu_repair_double_escaped_unicode` event (`:508476`, 220=1/193=0).
- Caller: `:531888`, applied to every tool input; the REPL `script` field is restored verbatim at
  `:531889`.

### Module: Tools — Web tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `E9y` | collectWebSearchResults | cli_inner_pretty.js:403787 (call site) | function |
| `Iin` | applyPromptToFetchedPage | cli_inner_pretty.js:362402-362432 | function |
| `hte` | WebFetchTool | cli_inner_pretty.js:383995-384170 | object |
| `kwd` | WebSearchTool | cli_inner_pretty.js:403574-403800 | object |
| `yPu` | getMaxWebSearchesPerSession | cli_inner_pretty.js:231406 | function |
| `yfr` | WEB_FETCH_MAX_CHARS | cli_inner_pretty.js:362449 | constant |
| `_ty` | DEFAULT_MAX_WEB_SEARCHES_PER_SESSION | cli_inner_pretty.js:231413 | constant |

Notes:
- The two net-new error tags are `web-fetch-apply-api-error` (`:362426`) and
  `web-search-side-query-api-error` (`:403788`), both 220=1/193=0. `API Error` itself is 6/6 — a decoy.
- `_ty = 200`; `yPu()` reads `Z.CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION ?? _ty` with no validation.
- `hte` declares `maxResultSizeChars: 1e5` and `shouldDefer: !0` (`:383999-384000`).

### Module: Tools — ReportFindings

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DOs` | reportFindingsFindingSchema | cli_inner_pretty.js:403827-403856 | function |
| `Iwd` | reportFindingsInputSchema | cli_inner_pretty.js:403857-403862 | function |
| `LOs` | REPORT_FINDINGS_DESCRIPTION | cli_inner_pretty.js:403823 | constant |
| `Lwd` | ReportFindingsTool | cli_inner_pretty.js:403877-403920 | object |
| `ZB` | REPORT_FINDINGS_TOOL_NAME | cli_inner_pretty.js:403821 | constant |
| `acl` | isReportFindingsForceEnabled | cli_inner_pretty.js:774313-774317 | function |
| `kqS` | isReportFindingsAvailable | cli_inner_pretty.js:774319-774327 | function |
| `v9y` | reportFindingsOutputSchema | cli_inner_pretty.js:403870-403876 | function |

Notes:
- No changelog bullet announces this tool. `ReportFindings` 220=1/193=0;
  `tengu_report_findings_tool` (`:774326`) 220=1/193=0; `CLAUDE_CODE_REPORT_FINDINGS` 220=2/193=0.
- `maxResultSizeChars: 256` (`:403880`) is the smallest in the surface; `strict: !0` (`:403881`).
- `Iwd` caps `findings` at `.max(32)`; the `/code-review` prompt separately says "at most 15"
  (`:774271`). `kqS` refuses when effort is `"low"`.
- Renderer table entry: `:652098`.

### Module: Tools — TaskStop / TaskOutput / SendMessage

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AAd` | multipleTeammatesMessage | cli_inner_pretty.js:399748-399750 | function |
| `Bvd` | findTeammateByExactRef | cli_inner_pretty.js:399715 (call site) | function |
| `CAd` | taskStopShellIdProbeLatch | cli_inner_pretty.js:400000 | variable |
| `Qko` | resolveTaskIdAcrossNamespaces | cli_inner_pretty.js:399713-399747 | function |
| `TAd` | findLocalAgentByName | cli_inner_pretty.js:399780-399789 | function |
| `eHo` | TaskStopTool | cli_inner_pretty.js:399979 | object |
| `ekd` | resolveWithPinGuard | cli_inner_pretty.js:418470 (call site) | function |
| `iVy` | findTeammatesByNormalizedRef | cli_inner_pretty.js:399742 (call site) | function |
| `oVy` | buildRunningAgentSuggestion | cli_inner_pretty.js:399754-399779 | function |
| `wAd` | bothNamespacesMessage | cli_inner_pretty.js:399751-399753 | function |

Notes:
- `Qko`'s messages are net-new: `matches both teammate` and `Multiple teammates match` are both
  220=1/193=0; `Use the full agent ID (name@team)` is 220=2/193=0.
- `eHo` declares `aliases: ["KillShell", "KillBash"]` (`:399982`) and `shouldDefer: !0` (`:399991`).
- `SendMessage` pin guard: `send_message_pin_guard` 220=2/193=0 at `:418478` (`"rebound"` label) and
  `:418506` (unlabelled success).

---

## MERGE TARGET: `symbol_index_core_features.md`
*(Session state / end-of-conversation lockout and slash-command gating)*

### Module: CLI — end-of-conversation session lockout

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Upr` | isSlashCommandBlockedByEndedByModel | cli_inner_pretty.js:343022-343025 | function |
| `die` | appendSurfaceSuffix | cli_inner_pretty.js:162800-162803 | function |
| `f8e` | setEndedByModel | cli_inner_pretty.js:162788-162790 | function |
| `sNy` | POST_END_ALLOWED_COMMANDS | cli_inner_pretty.js:344141 | constant |
| `zoo` | isSurfaceExemptFromEndConversation | cli_inner_pretty.js:162794-162796 | function |
| `zst` | isEndedByModel | cli_inner_pretty.js:162792-162793 | function |
| `YQi` | surfaceEndMessageSuffix | cli_inner_pretty.js:162797-162799 | function |

Notes:
- `sNy` = `new Set(["clear","resume","help","exit","feedback"])`.
- `zoo()` returns `!1` and `YQi()` returns `""` in this build — build-variant stubs. `zoo` is consulted at
  `:412988` (availability) and `:526260` (transcript replay of `ended-by-model`).
- Lockout consumers read in 2.1.220: `:343330` (slash commands), `:450104` (compaction throw),
  `:500338` (subagent fork refusal), `:822821` (interactive submit), `:849704` (print/`--continue` exit 1),
  `:762648` (resume restore).

### Module: CLI — interrupt marker constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bou` | INTERRUPT_MARKER_PREFIXES | cli_inner_pretty.js:162859 | constant |
| `MY` | USER_DECLINED_ACTION_MESSAGE | cli_inner_pretty.js:162842-162843 | constant |
| `SV` | REQUEST_INTERRUPTED_BY_USER | cli_inner_pretty.js:162840 | constant |
| `jI` | REQUEST_INTERRUPTED_FOR_TOOL_USE | cli_inner_pretty.js:162841 | constant |

Notes:
- **False-delta warning.** `[Request interrupted by user]` is 220=**3** / 193=**4**; the count *fell*
  because 193 duplicated the three literals inline in an array (`:441387-441391 (193)`) whereas 220 builds
  `Bou = [SV, jI, MY]` from the constants. A de-duplication refactor, **not** a behaviour change. Do not
  cite this count as evidence for `.218`'s interrupted-tool-call bullet.

---

## MERGE TARGET: `symbol_index_infra_platform.md`
*(Signal handling / process lifecycle touched by the Bash-tool SIGTERM fix)*

### Module: Telemetry / process lifecycle — shell-tool signal path

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `fWe` | signalShutdownRequested | cli_inner_pretty.js:20561-20563 | function |
| `hIl` | shutdownRequestedPromise | cli_inner_pretty.js:20564-20568 | function |

Notes:
- The `.212` SIGTERM fix is a **new handler registration** at `:845671` in the print/stream-json loop
  (`onSigterm` aborts the query controller with `abortReason("shutdown")` then `exitProcess(143)`).
  2.1.193 had SIGTERM handlers only at `:310272 (193)` (main REPL), `:352714 (193)` (exit hook),
  `:570086 (193)` (bridge) and `:717877 (193)` (daemon) — none in the print path.
- `killProcessTree` is 220=1/193=1 and `process.kill(-` is 10/10 — the tree kill itself is carryover and
  fires from the aborted signal.
- **Decoy:** `:750935` (`wLn.c(143)`) is a React hook index, not an exit code.

---

## MERGE TARGET: `symbol_index_infra_platform.md` (env vars and gates)

### Module: Model / env — tool-relevant env vars confirmed in 2.1.220

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| n/a | `CLAUDE_CODE_AUTO_BACKGROUND_TIMEOUT_MS` | cli_inner_pretty.js:401265 | variable |
| n/a | `CLAUDE_CODE_ENABLE_REFRESH_MCP_TOOLS` | cli_inner_pretty.js:424999 | variable |
| n/a | `CLAUDE_CODE_REPORT_FINDINGS` | cli_inner_pretty.js:774317 | variable |
| n/a | `CLAUDE_PID` | cli_inner_pretty.js:168428 | variable |

Notes (all four are 193=0, confirmed by grepping the bundle rather than trusting `assets/env_vars.json`,
per `_CONVENTIONS.md` trap 2):
- `CLAUDE_CODE_AUTO_BACKGROUND_TIMEOUT_MS` 220=1/193=0 — clamped to `min(requested, max(value, 2000))`.
- `CLAUDE_CODE_ENABLE_REFRESH_MCP_TOOLS` 220=2/193=0 — the only new tool behind a plain env gate.
- `CLAUDE_CODE_REPORT_FINDINGS` 220=2/193=0 — local force-on for `ReportFindings`.
- `CLAUDE_PID` 220=5/193=0 — exported to children at `:168428`, preserved in the snapshot env list at
  `:313427`, consumed by the `pkill` shim at `:313511`/`:313525`/`:313526`.

### Module: Feature gates — new gates observed from `04_tools`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| n/a | `tengu_agent_worktree_cwd_escape_blocked` | cli_inner_pretty.js:314192 | constant |
| n/a | `tengu_dead_probe_taskoutput_legacy_params` | cli_inner_pretty.js:508461 | constant |
| n/a | `tengu_dead_probe_taskstop_shell_id` | cli_inner_pretty.js:400001 | constant |
| n/a | `tengu_deferred_stub_tool` | cli_inner_pretty.js:508600 | constant |
| n/a | `tengu_end_conversation_tool_call` | cli_inner_pretty.js:413141 | constant |
| n/a | `tengu_repair_double_escaped_unicode` | cli_inner_pretty.js:508476 | constant |
| n/a | `tengu_report_findings_tool` | cli_inner_pretty.js:774326 | constant |
| n/a | `tengu_umber_kestrel` | cli_inner_pretty.js:231370 | constant |

Notes:
- `tengu_agent_worktree_cwd_escape_blocked` has four `reason` values in 2.1.220: `context_lost` `:314164`,
  `worktree_gone` `:314192`, `shared_checkout` `:314210`, `command_redirect` `:314220`.
- `tengu_end_conversation_tool_call` fires at `:413141`, `:413146` (both `phase: "reflect"`) and `:413149`
  (`phase: "end"`).
- **Gates GONE since 2.1.193, discovered from this theme** (record them as removals, not additions):
  `tengu_cedar_sundial` (220=0 / 193=1 — gated the Edit unique-match recovery) and
  `tengu_velvet_hammer` (220=0 / 193=2 — gated the read-before-write skip). Both are in the raw asset
  diff's GONE list.
- **Naming trap:** `tengu_defer_cap_ms` / `tengu_defer_cap_refused_queued` /
  `tengu_defer_cap_refused_restartable` (`:823520`, `:823527`, `:823533`) are **not** deferred-tool gates —
  they belong to the agents-view "defer-then-fork" cap. File them under background agents.
