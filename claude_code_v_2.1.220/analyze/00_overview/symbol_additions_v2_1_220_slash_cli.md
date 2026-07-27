# Symbol additions — v2.1.220 `43_slash_commands` (slash commands and the CLI surface)

> Staged for merge into the four `symbol_index_*.md` files. Each `## Module:` heading names the
> destination file. **Every line number below was read in the 2.1.220 bundle**
> (`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`, `build_sha 4073f595`)
> during the analysis that produced [`../43_slash_commands/`](../43_slash_commands/README.md).
> `File:Line` is always `cli_inner_pretty.js:<line>` in the **2.1.220** build.
> Reminder (`_CONVENTIONS.md` §4.1): these ids are re-mangled *and reused* per build — never carry them to
> another tree, and never import a 2.1.193 name.

Row format: `| Obfuscated | Readable | File:Line | Type |`, sorted alphabetically by obfuscated id
(case-insensitive) within each section.

---

## Module: Slash Commands — registry and dispatch

**Merge into:** `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bpt | suggestNearestCommandName | cli_inner_pretty.js:326568-326582 | function |
| Cv | resolveCommandByName | cli_inner_pretty.js:346396-346405 | function |
| Edr | inputLooksLikeSlashCommand | cli_inner_pretty.js:326539-326546 | function |
| H_r | builtinSlashCommandRegistry | cli_inner_pretty.js:507179 | variable |
| Ic | resolveToolByNameOrAlias | cli_inner_pretty.js:224038-224048 | function |
| jQg | buildNameAndAliasMap | cli_inner_pretty.js:224028-224037 | function |
| KIn | resolveLocalJsxCommandLoader | cli_inner_pretty.js:735719-735722 | function |
| kpd | describeCommandNotModelInvocable | cli_inner_pretty.js:346451-346455 | function |
| nft | requireCommandByName | cli_inner_pretty.js:346419-346432 | function |
| O7a | LOCAL_JSX_LOADERS | cli_inner_pretty.js:735728-735807 | object |
| oai | commandUnavailableMessage | cli_inner_pretty.js:735723-735725 | function |
| ou | registerBundledPromptCommand | cli_inner_pretty.js:419629-419695 | function |
| P$s | bundledPromptCommandRegistry | cli_inner_pretty.js:419766 (decl), 419776 (init), 419694 (push) | variable |
| qa | toolMatchesNameOrAlias | cli_inner_pretty.js:224019-224021 | function |
| qM_ | fleetHostCallableCommands | cli_inner_pretty.js:507443 | variable |
| qNy | matchesCommandNameOrAlias | cli_inner_pretty.js:346393-346395 | function |
| R9H | LOCAL_JSX_LOADER_NAMES | cli_inner_pretty.js:735808 | variable |
| Sd | commandDisplayName | cli_inner_pretty.js:326533-326535 | function |
| vdr | nearestNamesWithinEditDistance | cli_inner_pretty.js:326554-326567 | function |
| vHd | KILL_SWITCH_SURVIVING_COMMANDS | cli_inner_pretty.js:419693 | variable |
| yk | isCommandEnabled | cli_inner_pretty.js:326536-326538 | function |
| _pt | isImmediateCommand | cli_inner_pretty.js:326550-326553 | function |
| M$s | getBundledPromptCommands | cli_inner_pretty.js:419696-419699 | function |
| RAo | commandExecutionContext | cli_inner_pretty.js:326547-326549 | function |

Non-symbol anchors read in the same pass:

| Anchor | File:Line | Note |
|---|---|---|
| `...(NP() && !Yt(Z.IS_DEMO) ? [mJd, _Jd] : [pJd])` | 507186 | the fork/subtask registry ternary |
| `resolveCommandDialog: KIn` | 822408 | host injection of the loader table (220=2/193=0) |
| `T = y.load ?? n.options.resolveCommandDialog?.(y)` | 343598 | the only consumer |
| `cmd_local_jsx_no_dialog_resolution` | 343600 | failure telemetry (220=3/193=0) |
| `survivesBundledKillSwitch` | 419691, 785860 | 220=2/193=0 |
| `aliases: ["checkup"]` | 785858 | how `/checkup` is wired (`/checkup` literal is 220=0) |

---

## Module: Slash Commands — `/fork`, `/subtask`, `/branch`

**Merge into:** `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $L_ | legacyForkCommandCall | cli_inner_pretty.js:500500-500515 | function |
| A_f | forkCommandModule | cli_inner_pretty.js:695431-695432 | object |
| lJd | deriveSubtaskAgentName | cli_inner_pretty.js:500461-500474 | function |
| Lpn | spawnForkFromDirective | cli_inner_pretty.js:500337-500446 | function |
| mJd | forkCommandDescriptor | cli_inner_pretty.js:500537-500543 | object |
| ML_ | branchCommandDescriptor | cli_inner_pretty.js:500327-500332 | object |
| nJd | deriveBranchNameFromMessages | cli_inner_pretty.js:500107-500112 | function |
| NL_ | subtaskCommandCall | cli_inner_pretty.js:500547-500562 | function |
| OL_ | rebuildRenderedSystemPrompt | cli_inner_pretty.js:500447-500460 | function |
| oxt | extractPromptFromMessage | cli_inner_pretty.js:49401-49436 | function |
| pJd | forkCommandLegacyDescriptor | cli_inner_pretty.js:500525-500532 | object |
| _Jd | subtaskCommandDescriptor | cli_inner_pretty.js:500572-500579 | object |
| D0h | COMMAND_NAME_TAG_RE | cli_inner_pretty.js:49441 | constant |
| xLi | SYNTHETIC_PROMPT_PREFIX_RE | cli_inner_pretty.js:49440 | constant |

Non-symbol anchors:

| Anchor | File:Line | Note |
|---|---|---|
| `Usage: /subtask \<task\>` | 500549 | 220=1/193=0 |
| `Usage: /fork \<directive\>` | 500502 | 220=1/193=1 — the legacy branch still ships |
| `new Set(["--org", "--fork-name", "--remote-name"])` | 443144 | **`gh repo fork` flags**, not Claude Code's |
| `if (e.isMeta === !0 \|\| e.isCompactSummary === !0) return;` | 49403 | the `.198 #26` `/branch` fix |
| `The /agents wizard has been removed.` | 500583 | adjacent, owned by `53_subagent_limits` |

---

## Module: Slash Commands — `/doctor`, `claude doctor`, `/status`

**Merge into:** `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bV | areBundledSkillsDisabled | cli_inner_pretty.js:162055-162057 | function |
| ctf | statusFourthWarningSection | cli_inner_pretty.js:666494 (call site) | function |
| dtf | statusInstallCheckSection | cli_inner_pretty.js:666062-666064 | function |
| Doo | isDisabledBundledPromptCommand | cli_inner_pretty.js:162058-162060 | function |
| e7e | checkInstall | cli_inner_pretty.js:541048-541138 | function |
| ftf | statusDiagnosticsSection | cli_inner_pretty.js:666101-666122 | function |
| gBb | emptyWarningList | cli_inner_pretty.js:672963-672965 | function |
| gVS | buildDoctorPrompt | cli_inner_pretty.js:785698-785853 | function |
| hBb | statusWarningsOrEmpty | cli_inner_pretty.js:672966-672968 | function |
| Hbr | isNativeInstallerSymlink | cli_inner_pretty.js:539603-539612 | function |
| Hue | isEISDIR | cli_inner_pretty.js:19649-19651 | function |
| Ibr | isNpmShim | cli_inner_pretty.js:539613-539616 | function |
| isb | formatLastUpdateResult | cli_inner_pretty.js:585349 | function |
| JVm | MISSING_OR_UNREADABLE_CODES | cli_inner_pretty.js:19809 | constant |
| Kzs | scanShellConfigsForClaudeAlias | cli_inner_pretty.js:538807-538823 | function |
| kmn | readShellConfigLines | cli_inner_pretty.js:538784-538793 | function |
| LAa | statusWarnings | cli_inner_pretty.js:666493-666495 | function |
| Lbr | getInstallationDiagnostics | cli_inner_pretty.js:539994-540070+ | function |
| mj_ | VERSIONS_DIR_SEGMENT | cli_inner_pretty.js:539621 | constant |
| N2t | getHomebrewCaskName | cli_inner_pretty.js:539643-539645 | function |
| oZS | reportInstallCheckResults | cli_inner_pretty.js:815895-815902 | function |
| ptf | statusProcessWrapperSection | cli_inner_pretty.js:666065-666100 | function |
| Rbr | isHomebrewCaskInstall | cli_inner_pretty.js:539636-539642 | function |
| ti | isMissingOrUnreadablePath | cli_inner_pretty.js:19686-19689 | function |
| Tim | registerDoctorCommand | cli_inner_pretty.js:785855-785880 | function |
| tj_ | TRANSIENT_FS_ERROR_CODES | cli_inner_pretty.js:538845-538855 | constant |
| tq | sanitizeDiagnosticValue | cli_inner_pretty.js:585346-585348 | function |
| ufl | useStartupInstallCheck | cli_inner_pretty.js:815903-815931 | function |
| Uht | getShellConfigPaths | cli_inner_pretty.js:538751-538767 | function |
| vj_ | linuxGlobPatternWarnings | cli_inner_pretty.js:539979-539993 | function |
| Zcp | resolveClaudeAliasTarget | cli_inner_pretty.js:538824-538834 | function |

Non-symbol anchors:

| Anchor | File:Line | 220/193 | Note |
|---|---|---|---|
| `For a full setup checkup that can also fix issues, run /doctor in a Claude Code session.` | 585327 | 1/0 | printed by `claude doctor` |
| `For a full checkup that can also fix issues` | 867757 | 1/0 | the `claude doctor --help` text |
| `No installation issues found.` | 585326 | 1/0 | |
| `derive from the codebase` | 785865 | 1/0 | `.206 #2` CLAUDE.md trimming |
| `getHomebrewCaskName()` (in prompt text) | 785799 | 1/0 | `.206 #22` — prompt-only delta |
| `make auto mode the default permission mode` | 785865 | 1/0 | `.210 #13` |
| `The provider is NOT a skip reason` | 785812 | 1/0 | `.210 #13` |
| `install check: ` | 815899 | 1/0 | the startup banner's replacement |
| `Run claude install to repair the installation.` | 540025 | 1/0 | generic fix on promoted errors |
| `externally managed` | 541307 | 1/0 | `.207 #5` |
| `was not created by the native installer` | 539922 | 4/0 | `.207 #5` user-facing warning |
| `Skipping ${e}: path is a directory` | 538790 | 1/0 | `.214 #36` |
| `Skipping unreadable shell config` | 538812 | 1/0 | `.214 #36` |
| `System diagnostics` | 666592 | 1/1 | **carryover** — do not cite as a delta |
| `installBrokenMessages` | — | **0/8** | removed; 193 sites 303721, 531836-531837, 532140, 683301-683306, 713828 |
| `"install-broken"` banner descriptor | — | **0/1** | removed; 193 site 531833 |

---

## Module: CLI — argv fast path and launch validation

**Merge into:** `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $Gb | validateBackgroundLaunchArgv | cli_inner_pretty.js:683486-683511 | function |
| _Al | peelDaemonSubcommandArgv | cli_inner_pretty.js:130-134 | function |
| AJo | readFlagValue | cli_inner_pretty.js:683499 (call) | function |
| eje | splitBundledShortFlags | cli_inner_pretty.js:683494 (call) | function |
| gxr | indexOfDoubleDash | cli_inner_pretty.js:683487 (call) | function |
| Jwm | permissionModeArgParser | cli_inner_pretty.js:833642-833645 | function |
| Mle | spawnBackgroundJob | cli_inner_pretty.js:682403-682421 | function |
| N$n | rejectDeepLinkWithExtraArgs | cli_inner_pretty.js:165-175 | function |
| NGb | findPositionalPrompt | cli_inner_pretty.js:683512-683526 | function |
| Ole | indicesConsumedByValueFlags | cli_inner_pretty.js:683489 (call) | function |
| OOm | describeAutoModeSections | cli_inner_pretty.js:865407-865412 | function |
| Vyl | permissionModeChoicesForHelp | cli_inner_pretty.js:833650 | variable |
| WlE | permissionModeChoicesAccepted | cli_inner_pretty.js:833650 | variable |
| ZVt | inheritedLaunchFlags | cli_inner_pretty.js:120-129 | function |
| $Om | describeUnparseableEntries | cli_inner_pretty.js:865375 (call) | function |

Non-symbol anchors:

| Anchor | File:Line | 220/193 | Note |
|---|---|---|---|
| `=== "daemon" ? e.slice(t + 1) : null` | 133 | 1/0 | `.199 #15` |
| `cli_daemon_path` | 872318 | 1/1 | the telemetry name is carryover; the peeler is not |
| `--bg and --print conflict` … `unattachable` | 683498 | 1/0 | `.198 #20` |
| `auto-mode reset` | 865404 | 1/0 | `.212 #2` |
| `lossy_write_unconfirmed` | 865378 | 1/0 | the `--yes` strictness inversion |
| `--forward-subagent-text` | 851029 | 1/0 | real Claude Code flag |
| `--publish-report` / `--scaffold` / `--keep-temp` / `--interview` | 592289-592320 | 1/0 each | `claude plugin eval` |
| `--append-subagent-system-prompt` | 329848, 329929 | 2/0 | inherited-flag list |

---

## Module: Permissions — the `.200` "Manual" display rename

**Merge into:** `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BK | resolvePermissionMode | cli_inner_pretty.js:58326-58329 | function |
| dWl | permissionModeDisplayTable | cli_inner_pretty.js:58495-58544 | object |
| e1e | permissionModeSymbol | cli_inner_pretty.js:58481-58483 | function |
| fL | normalizePermissionModeAlias | cli_inner_pretty.js:58323-58325 | function |
| FO | permissionModeColor | cli_inner_pretty.js:58484-58486 | function |
| pWl | permissionModeEnumPreprocessed | cli_inner_pretty.js:58492 | variable |
| QOe | PERMISSION_MODE_MANUAL_ALIAS | cli_inner_pretty.js:58339 | constant |
| r3r | permissionModeEnumPreprocessedAlt | cli_inner_pretty.js:58493 | variable |
| uWl | PERMISSION_MODE_RANK | cli_inner_pretty.js:58494 | object |
| Yye | PERMISSION_MODES | cli_inner_pretty.js:58362 | constant |

Non-symbol anchors:

| Anchor | File:Line | 220/193 | Note |
|---|---|---|---|
| `title: "Manual"` | 58497 | 1/0 | 193 had `title: "Default"` at 54284 |
| `indicator: "manual mode"` | 58499 | 1/0 | the whole `indicator` field is 220=6/193=0 |
| `external: "default"` | 58502 | — | **unchanged** — the wire value did not move |
| `'manual' is accepted as an alias for 'default'` | 60599 | 1/0 | settings-schema description |
| `Allowed choices are ${Vyl.join(", ")}` | 833643 | 4/3 | `--permission-mode` arg parser |

---

## Module: Session state — cost reset and side questions

**Merge into:** `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Att | resetCostState | cli_inner_pretty.js:3114-3126 | function |
| DSi | registerSessionCostSaver | cli_inner_pretty.js:3108-3110 | function |
| eLb | btwCommandCall | cli_inner_pretty.js:661737-661748 | function |
| GEi | getLoopEnded | cli_inner_pretty.js:3623-3625 | function |
| ml | systemMessage | cli_inner_pretty.js:533218-533230 | function |
| pNr | setLoopEnded | cli_inner_pretty.js:3626-3628 | function |
| PSi | flushSessionCostToDisk | cli_inner_pretty.js:3111-3113 | function |
| W3t | getSideQuestionHistory | cli_inner_pretty.js:652811 | function |
| yn | isNonInteractive | cli_inner_pretty.js:3286-3288 | function |

Non-symbol anchors:

| Anchor | File:Line | 220/193 | Note |
|---|---|---|---|
| `PSi(), Att(),` inside the `/clear` sequence | 449532-449533 | new | absent from 193's 485411-485418 |
| `registerSessionCostSaver` (`DSi(() => Qen())`) | 308774 | 1/0 | |
| `loopEnded` | 2601, 3624, 3627 | 3/0 | telemetry de-duplication only, **not** `/resume` |
| `rCb = /^\/btw\b/gi` | 652912 | 1/1 | carryover |

---

## Module: Background agents — command parking and the fleet resume picker

**Merge into:** `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _cl | listPastSessionsForFleet | cli_inner_pretty.js:801829-801852 | function |
| eN | isDetachedBackgroundSession | cli_inner_pretty.js:112712-112714 | function |
| etS | installGithubAppCommandCall | cli_inner_pretty.js:701699-701713 | function |
| Exn | activeCommandPark | cli_inner_pretty.js:700584 | variable |
| FKS | PAST_SESSION_SCAN_CAP | cli_inner_pretty.js:801853 | constant |
| gcl | isFleetEarlierRowsEnabled | cli_inner_pretty.js:801823-801825 | function |
| NP | isAgentsFleetEnabled | cli_inner_pretty.js:157277-157279 | function |
| plS | mcpCommandCall | cli_inner_pretty.js:714198-714212 | function |
| rBd | loginCommandDescriptor | cli_inner_pretty.js:455393-455401 | function |
| Rxf | mcpParkedMessage | cli_inner_pretty.js:714194-714197 | function |
| rs | isBackgroundSession | cli_inner_pretty.js:112709-112711 | function |
| SVr | isFleetPastSessionsEnabled | cli_inner_pretty.js:157287-157289 | function |
| THs | clearCommandParkBlocked | cli_inner_pretty.js:335140 | function |
| u5t | parkSessionAsNeedsInput | cli_inner_pretty.js:700561-700573 | function |
| uJi | fleetGateRejectedReason | cli_inner_pretty.js:157247-157251 | function |
| wHs | markCommandParkBlocked | cli_inner_pretty.js:335135 | function |
| xvf | armUnparkOnAttach | cli_inner_pretty.js:700574-700583 | function |
| ycl | isFleetResumePickerAllowed | cli_inner_pretty.js:801826-801828 | function |
| Zer | isFleetGateRejected | cli_inner_pretty.js:157244-157246 | function |

Non-symbol anchors:

| Anchor | File:Line | 220/193 | Note |
|---|---|---|---|
| `CLAUDE_CODE_FLEET_PAST_SESSIONS` / `tengu_fleet_past_sessions` | 157288 | 1/0 each | `.212 #6` |
| `fleet_view_resume_picker` | 805979, 806403, 806757, 806763 | — | picker telemetry |
| `deleting_in_flight` | 805990 | — | the deleted-session race guard |
| `This session is being deleted — reopen /resume once it finishes` | 805990 | 1/0 | |
| `login: () => e({ type: "login", … })` | 806728 | new | `.198` `/login` host capability |
| `isn't available in agent view — attach to a session to run it` | 806782 | **1/1** | **carryover** |
| `tengu_slash_command_unavailable` / `unavailable_in_agent_view` | 806776, 806781 | 2/0, 1/0 | new telemetry on an old guard |
| `Can't run /install-github-app while no terminal is attached…` | 701705-701706 | 2/0 | |
| `Can't open MCP settings while no terminal is attached…` | 714218, 714220 | 1/0, 1/0 | |
| `steer without the panel` | 714218, 714220 | 2/0 | |

---

## Module: UI — `/release-notes`, `/usage`, `/cd` completions, `/upgrade`

**Merge into:** `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| c5a | formatAllReleaseNotes | cli_inner_pretty.js:720257-720264 | function |
| Dni | formatOneVersionReleaseNotes | cli_inner_pretty.js:720250-720256 | function |
| IRf | buildUpgradeUrl | cli_inner_pretty.js:719545-719547 | function |
| Lni | RELEASE_NOTES_SHOW_ALL_SENTINEL | cli_inner_pretty.js:720273 (usage) | constant |
| qRS | COMMANDS_WITH_ARGUMENT_COMPLETIONS | cli_inner_pretty.js:744165 | constant |
| rfS | upgradeCommandCall | cli_inner_pretty.js:719550-719552 | function |
| svt | callUpgradeFromSurface | cli_inner_pretty.js:719553-719596 | function |
| u5a | ReleaseNotesPicker | cli_inner_pretty.js:720268-720340 | function |
| Uof | formatUsageAsOfSuffix | cli_inner_pretty.js:670406-670409 | function |
| wzo | commandDirectorySuggestionSet | cli_inner_pretty.js:654321 | constant |
| Zkn | emitReleaseNotesAsNotice | cli_inner_pretty.js:720265-720267 | function |

Non-symbol anchors:

| Anchor | File:Line | 220/193 | Note |
|---|---|---|---|
| `Show all` | 720273 | **2/2** | **carryover** — not the `.208 #27` anchor |
| `{ type: "append", messages: [ml(e, "notice")] }` | 720266 | new | the `.208 #27` fix |
| `Showing last-known usage` | 670462 | 1/0 | `.208 #45` |
| `rateLimitedVia` | 670462-670469, 499132+ | 9/0 | |
| `refresh_failed_seeded` / `rate_limited_seeded_envelope` / `rate_limited_seeded_http_429` | 670470-670473 | new | |
| `new Set(["add-dir", "cd"])` | 654321 | 1/0 | `.206 #1` |
| `utm_campaign` | 719546 | 2/1 | the only real `/upgrade` delta |

---

## Module: Prompt commands — `/commit-push-pr` allowed tools

**Merge into:** `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Akh | SAFE_REMOTE_NAME_RE | cli_inner_pretty.js:56201 | constant |
| Cl_ | commitPushPrAllowedTools | cli_inner_pretty.js:449740-449742 | function |
| g5n | getGitPushShellPatterns | cli_inner_pretty.js:55590-55595 | function |
| J$d | toToolPatterns | cli_inner_pretty.js:449862 | function |
| K$d | buildCommitPushPrPrompt | cli_inner_pretty.js:449743-449860 | function |
| Tkh | resolveDefaultPushRemote | cli_inner_pretty.js:55575-55589 | function |
| Tl_ | COMMIT_PUSH_PR_EXTRA_TOOLS | cli_inner_pretty.js:449885 | constant |
| wkh | gitConfigGet | cli_inner_pretty.js:55569-55574 | function |
| X$d | COMMIT_PUSH_PR_BASE_PATTERNS | cli_inner_pretty.js:449876-449884 | constant |
| xl_ | commitPushPrCommandDescriptor | cli_inner_pretty.js:449887-449910 | object |
| z$d | COMMIT_PUSH_PR_STATIC_TOOLS | cli_inner_pretty.js:449886 | constant |

Non-symbol anchors:

| Anchor | File:Line | 220/193 | Note |
|---|---|---|---|
| `remote.pushDefault` | 55585, 442959 | 2/0 | `.206 #3` (`:442959` is the auto-mode analyser's copy) |
| `getAllowedTools` | 340335, 344046, 414134, 419662, 449892 | 5/0 | the new dynamic-allowed-tools field |
| `getGitPushShellPatterns` | 55475 | 1/0 | module export name |

---

## Module: Tools — AskUserQuestion auto-continue

**Merge into:** `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TCe | defaultAskUserQuestionTimeout | cli_inner_pretty.js:63549 | function |
| vNd | ASK_USER_QUESTION_TIMEOUTS | cli_inner_pretty.js:452190 | constant |

Non-symbol anchors:

| Anchor | File:Line | 220/193 | Note |
|---|---|---|---|
| `askUserQuestionTimeout` (zod) | 61218-61226 | 9/0 | `never` is the documented default |
| `afkTimeoutMs` | 323338, 766786, 767107 | 9/0 | |
| `tengu_ask_user_question_afk_auto_advance` | 767111 | 1/0 | |
| `tengu_ask_user_question_timeout_changed` | 451902 | 1/0 | `/config` row |
| `NDn(j2, "afk_timeout")` | 767118 | 2/0 | submits *partial* answers — why the default is off |

---

## Cross-checks performed (recorded so a validator does not repeat them)

| Literal | 220 | 193 | Conclusion |
|---|---|---|---|
| `name: "fork"` | 2 | 1 | two descriptors ship |
| `Usage: /fork` | 1 | 1 | legacy path still reachable |
| `aliases?.includes` | 9 | 7 | alias machinery is carryover |
| `claude command at … missing or broken` | 5 | 5 | producer is carryover; consumers changed |
| `Show all` | 2 | 2 | label is carryover |
| `isn't available in agent view` | 1 | 1 | agent-view guard is carryover |
| `System diagnostics` | 1 | 1 | section header is carryover |
| `Failed to open browser` | 3 | 3 | `/upgrade` failure path is carryover |
| `deriveForkName` | 1 | 1 | carryover |
| `64_000` | 1 | 1 | a skill-doc string, not a parser |
| `zsh`/`.zshrc` path table (`Uht`/`GLe`) | — | — | byte-equivalent (538751 vs 351230 (193)) |
| `/resume` `isLoopSession` filter | 1 | 1 | byte-equivalent (527375 vs 585485 (193)) |
| `--fork-name` | 1 | 0 | new **only** because the `gh repo fork` analyser rule is new |
