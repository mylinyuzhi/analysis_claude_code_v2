# Symbol additions — v2.1.220 `52_code_review` (Review and research commands)

Staged for merge. Every row's line number was read in
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` during the
`52_code_review` pass. Format per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §6.

Routing:

| Group | Merge into |
|---|---|
| Code review — slash-command surface / bundled workflows / deep research / effort cells | `symbol_index_core_features.md` |
| Code review — command dispatch, fork and stacked commands | `symbol_index_core_features.md` |
| Ultrareview — cloud review preconditions, launch, billing | `symbol_index_core_features.md` |
| Slash-command schema plumbing shared with other themes | `symbol_index_infra_integration.md` |

Symbols already present elsewhere and **not** re-declared here: `ZB` / `LOs` / `Lwd` / `DOs` / `Iwd` /
`v9y` / `acl` / `kqS` (the `ReportFindings` tool object — see
[`symbol_additions_v2_1_220_tools.md`](symbol_additions_v2_1_220_tools.md) *Module: Tools —
ReportFindings*), and `hee` / `ZDu` / `sty` (the subagent spawn-depth resolver — see
[`symbol_additions_v2_1_220_subagent_limits.md`](symbol_additions_v2_1_220_subagent_limits.md)).
`acl` and `kqS` are *referenced* by this module because they also gate `getContext`, but their rows
live with the tool.

---

## Module: Code Review — slash-command surface

*Merge into `symbol_index_core_features.md`.*

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$qS` | buildUltraFallbackNotice | cli_inner_pretty.js:774534-774579 | function |
| `AqS` | isKnownCellModelFamily | cli_inner_pretty.js:774276-774278 | function |
| `Bnm` | GITHUB_COMMENT_INSTRUCTIONS | cli_inner_pretty.js:774610-774621 | constant |
| `Cir` | CODE_REVIEW_WORKFLOW_NAME | cli_inner_pretty.js:231212 | constant |
| `DqS` | buildCodeReviewPrompt | cli_inner_pretty.js:774384-774448 | function |
| `E$y` | REVIEW_SKILL_NAMES | cli_inner_pretty.js:340271 | constant |
| `HqS` | buildCodeReviewTrailer | cli_inner_pretty.js:774346-774349 | function |
| `Knm` | registerCodeReviewCommand | cli_inner_pretty.js:774580-774602 | function |
| `LqS` | buildCodeReviewArgumentHint | cli_inner_pretty.js:774381-774383 | function |
| `MqS` | buildFinderBudgetHint | cli_inner_pretty.js:774452-774472 | function |
| `Mse` | VERIFY_SKILL_NAME | cli_inner_pretty.js:318664 | constant |
| `PqS` | shouldPublishReviewArtifact | cli_inner_pretty.js:774449-774451 | function |
| `REe` | CODE_REVIEW_SKILL_NAME | cli_inner_pretty.js:318660 | constant |
| `RqS` | buildCodeReviewDescription | cli_inner_pretty.js:774378-774380 | function |
| `Spr` | slashNameForReviewSkill | cli_inner_pretty.js:340263-340265 | function |
| `Unm` | REPORT_FINDINGS_LATE_FIX_INSTRUCTIONS | cli_inner_pretty.js:774688 | constant |
| `Vnm` | resolveCodeReviewEffort | cli_inner_pretty.js:774520-774525 | function |
| `Wnm` | resolveThreadedModelEffort | cli_inner_pretty.js:774283-774286 | function |
| `Ynm` | codeReviewCommandModuleInit | cli_inner_pretty.js:774627 | function |
| `cMr` | codeReviewCellsByModel | cli_inner_pretty.js:774655-774678 | object |
| `fne` | cellDescriptor | cli_inner_pretty.js:774605 | function |
| `icl` | parseCodeReviewArgs | cli_inner_pretty.js:774350-774377 | function |
| `iLo` | detectReviewSkillAvailability | cli_inner_pretty.js:433691-433700 | function |
| `jnm` | buildApplyFixesInstructions | cli_inner_pretty.js:774328-774345 | function |
| `qnm` | REPORT_FINDINGS_REREPORT_CLAUSE | cli_inner_pretty.js:774684-774687 | constant |
| `scl` | resolveCellModelFamily | cli_inner_pretty.js:774279-774282 | function |
| `trn` | SIMPLIFY_SKILL_NAME | cli_inner_pretty.js:318665 | constant |
| `wpi` | CODE_REVIEW_EFFORT_LEVELS (= `EL`, :119650) | cli_inner_pretty.js:774704 | constant |
| `xqS` | selectCodeReviewCell | cli_inner_pretty.js:774287-774312 | function |
| `znm` | shouldRouteToWorkflow | cli_inner_pretty.js:774526-774533 | function |

Notes:
- `cMr` is the `.206` anchor. `o48-low-v1` / `o48-med-v1` / `o48-high-v1` / `o48-xhigh-v1` are
  220-only (`o48-low-v1` 220=2 / 193=0), as is the `claude-opus-5` row's `o5-bmin` (220=4 / 193=0)
  and the `measuredExternal` marker (220=8 / 193=0). 2.1.193's table is one-dimensional
  (`Ktm = { low, medium, high, xhigh, max }`, `:650897 (193)`). The whole table and each row are
  `Object.freeze`d at `:774679-774683`.
- `znm`'s remote gate is `tengu_review_workflow_routing` (`:774532`), 220=1 / 193=1, **default false**.
- `iLo` (`:433691`) probes which of `code-review` / `verify` / `simplify` / `commit` / `pr` are
  available; `simplify` is only reported when `loadedFrom !== "bundled"`.
- `E$y = new Set([Mse, REe])` is the two-member "review skill" set that `Spr` renders as `/verify` /
  `/code-review`.

---

## Module: Code Review — bundled workflows and effort cells

*Merge into `symbol_index_core_features.md`.*

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DJy` | CORRECTNESS_ANGLES | cli_inner_pretty.js:424434 | constant |
| `MJy` | isDeepResearchModelInvocationDisabled | cli_inner_pretty.js:424445-424448 | function |
| `OJy` | initBundledWorkflows | cli_inner_pretty.js:424902-424904 | function |
| `PJy` | DEEP_RESEARCH_MODEL_INVOCATION_GATE | cli_inner_pretty.js:424888 | constant |
| `SSd` | BUNDLED_WORKFLOWS | cli_inner_pretty.js:385340 | variable |
| `ZId` | mediumEffortCell | cli_inner_pretty.js:423844-423875 | function |
| `aRd` | CLEANUP_LENS_TEXTS | cli_inner_pretty.js:424435-424443 | constant |
| `cNs` | buildSinglePassReviewCell | cli_inner_pretty.js:423628 | function |
| `cRd` | codeReviewWorkflowModuleInit | cli_inner_pretty.js:424416-424444 | function |
| `dRd` | DEEP_RESEARCH_WORKFLOW_DESCRIPTION | cli_inner_pretty.js:424883-424884 | constant |
| `fRd` | DEEP_RESEARCH_PHASES | cli_inner_pretty.js:424892-424898 | constant |
| `hRd` | deepResearchWorkflowModuleInit | cli_inner_pretty.js:424889-424899 | function |
| `iRd` | CODE_REVIEW_WORKFLOW_WHEN_TO_USE | cli_inner_pretty.js:424411-424412 | constant |
| `kxo` | registerBundledWorkflow | cli_inner_pretty.js:385327-385335 | function |
| `lRd` | registerCodeReviewWorkflow | cli_inner_pretty.js:424046-424408 | function |
| `mRd` | registerDeepResearchWorkflow | cli_inner_pretty.js:424449-424881 | function |
| `oRd` | CODE_REVIEW_WORKFLOW_DESCRIPTION | cli_inner_pretty.js:424409-424410 | constant |
| `pRd` | DEEP_RESEARCH_WORKFLOW_WHEN_TO_USE | cli_inner_pretty.js:424885-424886 | constant |
| `sRd` | CODE_REVIEW_PHASES | cli_inner_pretty.js:424420-424433 | constant |
| `uRd` | DEEP_RESEARCH_WORKFLOW_NAME | cli_inner_pretty.js:424882 | constant |

Notes:
- `kxo`'s third parameter (`{ hidden, disableModelInvocation }`) is the `.218` deep-research anchor.
  `lRd` passes `{ hidden: !0 }` (`:424406`); `mRd` passes `{ disableModelInvocation: MJy }`
  (`:424879`). 2.1.193's registrations pass no third argument (`:443743 (193)`, `:444099 (193)`).
- `MJy` has **inverted polarity**: `getFeatureValue("tengu_sorrel_avocet", false)` returning `false`
  (the default, and the value on a gate-service outage) means invocation stays **disabled**.
  `tengu_sorrel_avocet` 220=1 / 193=0.
- The workflow scripts are emitted as template-literal source strings, so their inner identifiers
  (`LEVEL_PARAMS`, `verifyGroups`, `canonFile`, `STRICT_HOST`, `LABEL_STRIP`, `quotedLabel`,
  `stripLabelChars`, `EMPTY_TREE_SHA` inside the script) are **not obfuscated** and need no mapping.
  They are cited by line only.
- `.196` anchors: `aRd` is the 5-element cleanup-lens array whose `.length` is interpolated into the
  merged finder's cap at `:424281`; `CLEANUP_TEXT` 220=2 / 193=0 replaced `CLEANUP_ANGLES`
  220=0 / 193=2.

---

## Module: Code Review — command dispatch, fork, stacked commands

*Merge into `symbol_index_core_features.md`.*

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cdd` | buildBackgroundAgentFollowUpBlock | cli_inner_pretty.js:342123 | function |
| `Npr` | parseSubcommandRetarget | cli_inner_pretty.js:342641-342650 | function |
| `RAo` | resolveCommandContext | cli_inner_pretty.js:326547-326549 | function |
| `VTo` | launchForkedBackgroundAgent | cli_inner_pretty.js:342400 | function |
| `aNy` | dispatchForkedSlashCommand | cli_inner_pretty.js:343059-343170 | function |
| `epd` | STACKED_COMMAND_CAP (= 5) | cli_inner_pretty.js:344087 | constant |
| `qTo` | shouldRunForkInBackground | cli_inner_pretty.js:342396-342399 | function |
| `tpd` | parseStackedSlashCommands | cli_inner_pretty.js:343833-343871 | function |

Notes:
- `RAo` is the `.218` `getContext` resolver. `context ?? "inline"` is 220=1 / 193=0; 2.1.193 read
  `c.context === "fork"` inline at its one dispatch site (`:398210 (193)`).
- `qTo` returns `e.background ?? !0` — background is the **default** for a forked command. It refuses
  first when already inside a subagent, then on `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` (`LE`,
  `:230330`), then on a non-interactive session (`yn`, `:3286`).
- `tpd` and the guard at `:343681` both exclude commands with `context === "fork"`, a non-undefined
  `getContext`, or `argsMayContainSlashCommands` (220=4 / 193=0). `Running in the background as`
  220=2 / 193=0.
- `Npr` differs from its 193 twin `Uqn` (`:397298 (193)`) in one respect: 193 stripped `--comment`
  out of `remainingArgs`; 220 returns them intact and lets `Spn` parse the flags.

---

## Module: Code Review — ultrareview preconditions, launch and billing

*Merge into `symbol_index_core_features.md`.*

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A7d` | ultrareviewHeadlessCommand | cli_inner_pretty.js:497657-497669 | object |
| `E7d` | buildUltrareviewDescription | cli_inner_pretty.js:497595-497597 | function |
| `Epn` | ultrareviewLaunchAcknowledgementNudge | cli_inner_pretty.js:497395-497397 | function |
| `JI_` | tryFetchBranchFromOrigin | cli_inner_pretty.js:497074-497130 | function |
| `Jdo` | buildUltrareviewEntitlementHint | cli_inner_pretty.js:226441-226457 | function |
| `LYe` | markUltrareviewOverageConfirmed | cli_inner_pretty.js:503512-503514 | function |
| `MFo` | checkOverageGate | cli_inner_pretty.js:497160-497179 | function |
| `OBt` | runUltrareviewHeadless | cli_inner_pretty.js:497398-497506 | function |
| `OFo` | launchRemoteReview | cli_inner_pretty.js:497180-497394 | function |
| `OTS` | openUltrareviewConfirmDialog | cli_inner_pretty.js:733003-733054 | function |
| `PFo` | precheckLaunchScope | cli_inner_pretty.js:496639-497060 | function |
| `QI_` | suggestClosestBranchName | cli_inner_pretty.js:497131-497159 | function |
| `QRu` | ULTRAREVIEW_CONFIG_GATE | cli_inner_pretty.js:226458 | constant |
| `Spn` | parseUltrareviewArgs | cli_inner_pretty.js:496622-496638 | function |
| `Vlt` | getUltrareviewRemoteConfig | cli_inner_pretty.js:226402 | function |
| `XNe` | getReviewCostNote | cli_inner_pretty.js:226405-226408 | function |
| `Xdo` | getUltrareviewDiffLimits | cli_inner_pretty.js:226417-226421 | function |
| `ZI_` | ultrareviewHeadlessCall | cli_inner_pretty.js:497557-497590 | function |
| `ZRu` | getBughunterModelOverride | cli_inner_pretty.js:226413-226416 | function |
| `Z7` | isCwdHomeDirectory | cli_inner_pretty.js:497512-497520 | function |
| `Ape` | getReviewDurationNote | cli_inner_pretty.js:226409-226412 | function |
| `dee` | isUltrareviewUsable | cli_inner_pretty.js:226425-226427 | function |
| `eLu` | isEmptyTreeFallbackEnabled | cli_inner_pretty.js:226422-226424 | function |
| `eir` | isUltrareviewFeatureEnabled | cli_inner_pretty.js:226438-226440 | function |
| `g7d` | formatLargestDiffFiles | cli_inner_pretty.js:497061-497070 | function |
| `jkm` | buildUltrareviewLaunchMessages | cli_inner_pretty.js:844951-844961 | function |
| `kWs` | EMPTY_TREE_SHA | cli_inner_pretty.js:497523 | constant |
| `nR_` | reviewPullRequestCommand | cli_inner_pretty.js:497635-497648 | object |
| `o_r` | previewInstructions | cli_inner_pretty.js:497071-497073 | function |
| `rR_` | buildReviewPrompt | cli_inner_pretty.js:497600-497628 | function |
| `tLu` | getUltrareviewBlockedReason | cli_inner_pretty.js:226428-226437 | function |
| `tR_` | REVIEW_NO_ARG_PROMPT | cli_inner_pretty.js:497599 | constant |
| `v7d` | ultrareviewInteractiveCommand | cli_inner_pretty.js:497649-497656 | object |
| `y7d` | buildNoGitRepoRemediation | cli_inner_pretty.js:497507-497511 | function |

Notes:
- `PFo` (422 lines) replaces `Aer` (`:537008-537130 (193)`, 123 lines) and is the single anchor for
  eight bullets. Its failure returns gained a `reason` field (ten values) that 193's did not have.
- `A7d` is the `.218` non-interactive fix: `type: "local"`, `supportsNonInteractive: !0`,
  `isEnabled: () => yn() && dee()`, `isHidden: () => !yn()` (`:497657-497669`). 2.1.193 registered only the
  `local-jsx` form (`:538551 (193)`).
- `MFo` is now parameterised (`{ overageConfirmed }`) instead of reading a module-level latch. 193's
  `Ter` (`:537131 (193)`) read `var SOo` (`:537358 (193)`), resettable only via the exported
  `_resetOverageConfirmedForTests` (220=0 / 193=1). `MFo` also gained a third result shape,
  `preflightUnavailable: !0`.
- `nR_` / `rR_` are the `.202` revert: 193's `oRf` carried `effort: "medium"` (`:538539 (193)`) and
  its prompt embedded `${Hzn}`, the *same string* used as `Ktm.medium` in the `/code-review` effort
  table (`:650897 (193)`).
- `Vlt` reads the remote config object behind `tengu_review_bughunter_config` (220=1 / 193=1):
  `enabled`, `cost_note`, `duration_note`, `model`, `fleet_size`, `max_duration_minutes`,
  `agent_timeout_seconds`, `total_wallclock_minutes`, `max_diff_files`, `max_diff_lines`, and the
  220-only `empty_tree_fallback_enabled`.
- `y7d` branches on `G$()` (`isGuiEntrypoint`, `:46401`) — the `.212` Claude Desktop fix.

---

## Module: Code Review — per-conversation state (billing consent)

*Merge into `symbol_index_core_features.md`.*

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `E2s` | resetPerConversationState | cli_inner_pretty.js:448564-448570 | function |
| `S$d` | resetConversationAndCloseBrowser | cli_inner_pretty.js:448571-448573 | function |
| `S2s` | PER_CONVERSATION_STATE_DEFAULTS | cli_inner_pretty.js:448580-448595 | object |
| `Xa_` | PER_CONVERSATION_STATE_KEYS | cli_inner_pretty.js:448596 | constant |
| `kcn` | clearConversation | cli_inner_pretty.js:449427 | function |

Notes:
- `ultrareviewOverageConfirmed` is a member of `S2s` (`:448594`) and is therefore reset by `E2s`,
  which `clearConversation` spreads at `:449495`. Literal 220=11 / 193=0.
- `S2s`'s sibling `prResolvedThisSession` and its setter `JBt` (`:503509`) follow the identical
  pattern — this is a general "reset on `/clear`" manifest, not an ultrareview-specific mechanism.
- Two deliberate no-op stubs exist for contexts that must always re-ask:
  `:567156-567157` and `:865100-865101`.

---

## Module: Code Review — system-prompt restraint (deep research)

*Merge into `symbol_index_core_features.md`.*

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Kep` | AGENT_AND_WORKFLOW_RESTRAINT_CLAUSE | cli_inner_pretty.js:508111-508115 | constant |
| `Qcg` | OPUS5_PROMPT_BUNDLE_KILL_GATE | cli_inner_pretty.js:118750 | constant |
| `ZXn` | usesOpus5PromptBundle | cli_inner_pretty.js:118700-118704 | function |

Notes:
- `Kep` = `"Do not call the AgentTool unless the user requested it\nDo not use workflows or
  deep-research unless the user requested it"`. First literal 220=1 / 193=0.
- Injected at `:507513` as the **third** fallback of the `tengu_heron_brook` guidance resolver, after
  per-org client data and the gate string. 2.1.193's twin (`C3f`, `:592544-592555 (193)`) has only
  the two override paths and returns `null` — there is no default clause.
- `ZXn` gates on the model catalogue capability `opus_5_prompt_bundle` (`:14395`, inside the
  `claude-opus-5` entry) rather than a model-id list, and is killable by
  `Qcg = "tengu_fennel_godwit"`.

---

## Module: Slash Commands — schema fields touched by this theme

*Merge into `symbol_index_infra_integration.md`.*

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cv` | lookupCommandByName | cli_inner_pretty.js:346396 | function |
| `Rfe` | splitSlashCommandNameAndArgs | cli_inner_pretty.js:342629-342639 | function |
| `Sd` | commandDisplayName | cli_inner_pretty.js:326533-326535 | function |
| `Spt` | levenshtein | cli_inner_pretty.js:326579-326596 | function |
| `bpt` | closestCommandName | cli_inner_pretty.js:326568-326578 | function |
| `vdr` | nearbyCommandNames | cli_inner_pretty.js:326554-326567 | function |
| `yk` | isCommandEnabled | cli_inner_pretty.js:326536-326538 | function |

Notes:
- `Spt` is the shared Levenshtein used both for slash-command suggestions and (new in this window)
  for `suggestClosestBranchName` (`QI_`, `:497155`).
- `yk` (`isEnabled?.() ?? !0`) is what makes the `.218` non-interactive `ultrareview` registration
  work: the interactive and headless command objects have mutually exclusive `isEnabled` predicates
  on `yn()`.

---

## Telemetry events introduced or reshaped in this theme

Not symbol rows — event names, for the telemetry index.

| Event | 220 | 193 | Line | Note |
|---|---|---|---|---|
| `tengu_review_remote_precondition_recovery` | 13 | 0 | `:496656` | `{reason, method, outcome}` triple; 7 `method` values |
| `tengu_review_remote_gate_blocked` | 1 | 0 | `:497402` | headless cloud-review refusal, carries `tLu()` reason |
| `tengu_review_remote_precondition_failed` | 16 | 11 | `:496642` | 5 new sites; every payload gained `cwd_is_home` |
| `tengu_code_review_routed` | 1 | 1 | `:774406` | payload 6 → 13 fields |
| `tengu_stacked_slash_commands` | 1 | 0 | `:343685` | `.199`'s feature; `.218` added the fork carve-out around it |
| `tengu_slash_command_forked` | 1 | 1 | `:343069` | name carryover; the background branch below it is new |
| `tengu_heron_brook_applied` | 3 | 2 | `:507513` | third emission site = the `Kep` default clause |
| `tengu_sorrel_avocet` (gate) | 1 | 0 | `:424888` | re-enables model invocation of `/deep-research` |
| `tengu_report_findings_tool` (gate) | 1 | 0 | `:774326` | see `symbol_additions_v2_1_220_tools.md` |
| `tengu_review_workflow_routing` (gate) | 1 | 1 | `:774532` | carryover, default false |
| `tengu_review_bughunter_config` (gate) | 1 | 1 | `:226458` | carryover config object, gained `empty_tree_fallback_enabled` |

Env vars referenced by this theme (all confirmed by grep, per `_CONVENTIONS.md` trap 2):

| Env var | 220 | 193 | Line | Effect here |
|---|---|---|---|---|
| `CLAUDE_CODE_REPORT_FINDINGS` | 2 | 0 | `:774317` | forces structured findings **and** forces `/code-review` inline |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | 3 | 13 | `:230331` | count fell because env reads moved behind the `Z.` proxy; the kill switch itself is carryover |
| `CLAUDE_CODE_COORDINATOR_MODE` | — | — | `:231442` | first `getContext` early return |
