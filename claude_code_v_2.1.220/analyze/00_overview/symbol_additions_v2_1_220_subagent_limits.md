# Symbol additions — v2.1.220, theme `subagent_limits`

Staged rows discovered while writing
[`53_subagent_limits/`](../53_subagent_limits/README.md). **Every `File:Line` below is a line I read in
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`** during this pass; rows sourced
from 2.1.193 are marked in the Readable column and belong in no index (they are baseline-only, kept here so the
carryover proofs in the module docs are traceable).

`File:Line` is written `cli_inner_pretty.js:<line>` per [`_CONVENTIONS.md`](../_CONVENTIONS.md) §3.
Sorted alphabetically by obfuscated id inside each module section.

Merge instructions per group are stated in the heading note.

---

## Module: Subagent Orchestration Limits

> **Merge into `symbol_index_core_execution.md`** (subagent plumbing / agent loop).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_ty` | DEFAULT_MAX_WEB_SEARCHES_PER_SESSION (`200`) | cli_inner_pretty.js:231413 | constant |
| `DI` | getAgentDepth (main session → 0, else `depth ?? 0`) | cli_inner_pretty.js:111428-111431 | function |
| `Dus` | memoisedDepthFromGate (one-shot cache of the gate value) | cli_inner_pretty.js:230908 | variable |
| `gPu` | getMaxConcurrentSubagents (`env ?? 20`) | cli_inner_pretty.js:231399-231401 | function |
| `gty` | DEFAULT_MAX_CONCURRENT_SUBAGENTS (`20`) | cli_inner_pretty.js:231411 | constant |
| `hee` | getMaxSubagentSpawnDepth (env → gate → const) | cli_inner_pretty.js:230896-230905 | function |
| `Jch` | ENV_MAX_SUBAGENTS_PER_SESSION accessor (`int{min:1,digitsOnly}`) | cli_inner_pretty.js:32640 | variable |
| `nBe` | nullTaskRegistry (all counters return 0 — caps inert) | cli_inner_pretty.js:284586-284620 | object |
| `Q7r` | getMaxSubagentsPerSession (`env ?? 200`) | cli_inner_pretty.js:231402-231404 | function |
| `Qch` | ENV_MAX_SUBAGENT_SPAWN_DEPTH accessor | cli_inner_pretty.js:32641 | variable |
| `sty` | SPAWN_DEPTH_GATE (`"tengu_hazel_trellis"`) | cli_inner_pretty.js:230907 | constant |
| `Xch` | ENV_MAX_CONCURRENT_SUBAGENTS accessor | cli_inner_pretty.js:32639 | variable |
| `yPu` | getMaxWebSearchesPerSession (`env ?? 200`) | cli_inner_pretty.js:231405-231407 | function |
| `yty` | DEFAULT_MAX_SUBAGENTS_PER_SESSION (`200`) | cli_inner_pretty.js:231412 | constant |
| `Zch` | ENV_MAX_WEB_SEARCHES_PER_SESSION accessor | cli_inner_pretty.js:32642 | variable |
| `ZDu` | DEFAULT_SPAWN_DEPTH (`3`) | cli_inner_pretty.js:230906 | constant |

Baseline-only (2.1.193, for the carryover proof — do **not** add to any index):

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `FBt` | SUBAGENT_DEPTH_LIMIT (`5`) — 2.1.193 hardcoded default | cli_inner_pretty.js:229871 (193) | constant |

---

## Module: Agent Tool

> **Merge into `symbol_index_core_execution.md`** (Tools / Agents section).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$` (local) | chargeSessionBudget — abort → budget → session count → increment | cli_inner_pretty.js:398378-398401 | function |
| `bSe` | FORK_AGENT_TYPE (`"fork"`) | cli_inner_pretty.js:231877 | constant |
| `Cj` | LEGACY_AGENT_TOOL_NAME (`"Task"`) | cli_inner_pretty.js:162359 | constant |
| `Cty` | buildWorkerPromptToolProse (branches on `hee() > 1`) | cli_inner_pretty.js:231517-231529 | function |
| `D` (local) | checkConcurrencyCeiling — returns a refusal, does not throw | cli_inner_pretty.js:398402-398414 | function |
| `dte` | resolveAgentTools (passes `agentDepth` to the filter at `:345532`) | cli_inner_pretty.js:345528 | function |
| `G8y` | AGENT_TOOL_BASE_SCHEMA (description/prompt/subagent_type/model/run_in_background) | cli_inner_pretty.js:398193-398211 | object |
| `MNy` | filterToolsForAgent (drops the Agent tool at the depth cap) | cli_inner_pretty.js:345484-345499 | function |
| `oG` | runAgent (builds the child's tools + system prompt) | cli_inner_pretty.js:344277-344315 | function |
| `qo` | AGENT_TOOL_NAME (`"Agent"`) | cli_inner_pretty.js:162358 | constant |
| `qTo` | shouldRunForkedSkillInBackground (`background ?? true`) | cli_inner_pretty.js:342396-342399 | function |
| `Tty` | buildWorkerToolInventory (splices `Agent` in only when `hee() > 1`) | cli_inner_pretty.js:231486-231516 | function |
| `U` (local) | acquireConcurrencySlot — re-check, teardown worktree on refusal, take slot | cli_inner_pretty.js:398415-398419 | function |
| `VTo` | launchForkedSkillAgent (depth/spawn caps at `:342427`-`:342442`, degrade-to-inline) | cli_inner_pretty.js:342400 | function |
| `W8y` | AGENT_TOOL_FULL_SCHEMA (adds name/team_name/mode/isolation/cwd; `mode` deprecation text at `:398229`) | cli_inner_pretty.js:398212 | object |
| `wIe` | AgentRefusalError (`AgentPreconditionError` name) | cli_inner_pretty.js:398187-398192 | class |
| `yRo` | canFanOutViaAgentTool (prompt-level depth predicate) | cli_inner_pretty.js:423574-423579 | function |

Baseline-only (2.1.193):

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Lcn` | resolveRequestedSubagentMode (privilege-monotonic; removed in 220) | cli_inner_pretty.js:54240-54244 (193) | function |
| `RPe` | AgentPreconditionError | cli_inner_pretty.js:430357-430362 (193) | class |

---

## Module: Task Registry / Session State

> **Merge into `symbol_index_core_execution.md`** (State section).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BH` | isObserverAgent (`local_agent` with `isObserver === true`) | cli_inner_pretty.js:341639-341641 | function |
| `kcn` | clearConversation (the only spawn/web-search budget reset) | cli_inner_pretty.js:449427-449438 | function |
| `pr` | countWhere (used to count surviving agent tasks on `/clear`) | cli_inner_pretty.js:24548-24552 | function |
| `qw` | isLiveBackgroundedTask (`running`/`pending` and not foreground) | cli_inner_pretty.js:341660-341664 | function |
| `zEe` | isAgentOrWorkflowTask (`local_agent` non-observer, or `local_workflow`) | cli_inner_pretty.js:341656-341659 | function |

---

## Module: Budget Enforcement (`--max-budget-usd`)

> **Merge into `symbol_index_core_features.md`** (CLI section — the flag is `--print`-only).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$xm` | shouldHaltRunningAgentsForBudget | cli_inner_pretty.js:843431-843434 | function |
| `aVy` | persistStopMarker (writes `stoppedByUser` to the agent's file) | cli_inner_pretty.js:399905-399917 | function |
| `gmr` | stopAllRunningAgentTasks | cli_inner_pretty.js:399888-399896 | function |
| `TIe` | markTaskStoppedByUser | cli_inner_pretty.js:399897-399904 | function |
| `zcr` | isBudgetExhausted (`maxBudgetUsd !== undefined && totalCost >= it`) | cli_inner_pretty.js:308540-308542 | function |

---

## Module: Worktree Isolation Containment

> **Merge into `symbol_index_infra_platform.md`** (Sandbox section).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_8e` | preSpawnShellFailure (synthesised `code:1` shell result carrying the refusal) | cli_inner_pretty.js:166241-166252 | function |
| `aTs` | GIT_REDIRECT_ENV_VARS (`GIT_DIR`,`GIT_WORK_TREE`,`GIT_COMMON_DIR`,`GIT_OBJECT_DIRECTORY`,`GIT_INDEX_FILE`,`GIT_SHALLOW_FILE`) | cli_inner_pretty.js:312756-312763 | constant |
| `bBe` | spawnShellCommand (hosts the four worktree-escape refusals, `:314161`-`:314222`) | cli_inner_pretty.js:314125 | function |
| `Dky` | GIT_WORKTREE_FLAGS (`--git-dir`, `--work-tree`) | cli_inner_pretty.js:312765 | constant |
| `fed` | analyzeGitRedirectOutsideWorktree (fail-closed on non-simple commands, `:312428`) | cli_inner_pretty.js:312423 | function |
| `Gcr` | worktreeFileEditGuard (canonical verdict + unresolvable/network cases) | cli_inner_pretty.js:307807-307816 | function |
| `hed` | findGitArgvIndex | cli_inner_pretty.js:312599-312604 | function |
| `ied` | worktreeEscapeMessage (three refusal shapes) | cli_inner_pretty.js:312384-312396 | function |
| `kGn` | getEffectiveCwd (ALS store cwd, else process cwd) | cli_inner_pretty.js:49881-49883 | function |
| `led` | isNetworkOrDeviceShapedPath | cli_inner_pretty.js:312560-312568 | function |
| `Lky` | GIT_PATH_FLAGS (`--namespace`, `--attr-source`, `--shallow-file`) | cli_inner_pretty.js:312764 | constant |
| `Oky` | CHDIR_BUILTINS (`cd`,`pushd`,`popd`,`chdir`) | cli_inner_pretty.js:312768 | constant |
| `PLi` | recoverShellCwd | cli_inner_pretty.js:49876-49880 | function |
| `PWe` | runWithCwdOverride | cli_inner_pretty.js:49870-49872 | function |
| `qky` | describeUnverifiableIndirection (xargs/parallel, find -execdir, interpreter) | cli_inner_pretty.js:312573-312589 | function |
| `sed` | classifyWorktreeEscape (`{dir, worktree, roots, escaped}`) | cli_inner_pretty.js:312400-312408 | function |
| `Uky` | isGitRedirectingEnvVar (adds `GIT_CONFIG*`, `HOME`, `CDPATH`, `XDG_CONFIG_HOME`) | cli_inner_pretty.js:312569-312572 | function |
| `Urt` | hasCwdOverrideContext (ALS store present?) | cli_inner_pretty.js:49873-49875 | function |
| `xGn` | runWithCwd (ALS `run`) | cli_inner_pretty.js:49867-49869 | function |
| `ytn` | didCwdEscapeWorktree | cli_inner_pretty.js:312397-312399 | function |
| `$ky` | COMMAND_PREFIX_BUILTINS (`command`,`builtin`,`time`,`noglob`,`nocorrect`) | cli_inner_pretty.js:312769 | constant |

Baseline-only (2.1.193):

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Hmt` | worktreeFileEditGuard (raw `startsWith` prefix test) | cli_inner_pretty.js:377318-377331 (193) | function |

---

## Module: Subagent Output Sanitisation (indirect prompt injection)

> **Merge into `symbol_index_core_execution.md`** (subagent plumbing).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_pd` | sanitizeSubagentContentBlocks (maps the scrubber, prepends one marker) | cli_inner_pretty.js:345346-345361 | function |
| `bpd` | scrubInstructionShapedText (flag / neutralize / neutralize-silent) | cli_inner_pretty.js:345363-345376 | function |
| `d0o` | escapeAngleBracket (`"<"` → `"<\\"`) | cli_inner_pretty.js:345390 | function |
| `DNy` | INJECTION_MARKER_PREFIX (`"[harness: subagent output matched instruction-shaped pattern(s): "`) | cli_inner_pretty.js:345393 | constant |
| `INy` | MODEL_LAYER_TAG_PREFIX (`"antml:"`) | cli_inner_pretty.js:345389 | constant |
| `jNy` | buildApiErrorPartialRecovery (sanitised `cutoffNote`) | cli_inner_pretty.js:345891-345903 | function |
| `Kpr` | lastAssistantTextSanitized | cli_inner_pretty.js:345877-345890 | function |
| `LNy` | INJECTION_PATTERNS (10 rules: 4 escalation-pattern, 5 control-tag, 1 turn-marker) | cli_inner_pretty.js:345398-345460 | object |
| `RNy` | HARNESS_ENVELOPE_TAGS (5 tag names composed into one regex) | cli_inner_pretty.js:345397 | object |
| `spd` | shouldSlimSubagentTools (gate `tengu_shale_finch`, carryover) | cli_inner_pretty.js:345462-345465 | function |
| `Spd` | reportSubagentOutputFindings (`tengu_subagent_output_flagged`) | cli_inner_pretty.js:345378-345388 | function |
| `ypd` | buildInjectionMarker | cli_inner_pretty.js:345331-345333 | function |
| `zpr` | sanitizeSubagentText (`{sanitized, findings}`, optional marker) | cli_inner_pretty.js:345334-345345 | function |

---

## Module: Built-in Agents & Prompts

> **Merge into `symbol_index_core_execution.md`** (Agents / System Prompts sections).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BFe` | GENERAL_PURPOSE_AGENT descriptor | cli_inner_pretty.js:269328-269336 | object |
| `FFe` | EXPLORE_AGENT descriptor (`model: "inherit"`, Agent tool disallowed) | cli_inner_pretty.js:269296-269306 | object |
| `Hhy` | getGeneralPurposeAgentSystemPrompt (re-delegation line at `:269324`) | cli_inner_pretty.js:269309-269325 | function |

Baseline-only (2.1.193):

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `gde` | EXPLORE_AGENT descriptor (`model: "haiku"`) | cli_inner_pretty.js:384844-384854 (193) | object |
| `zqp` | getGeneralPurposeAgentSystemPrompt (no re-delegation line) | cli_inner_pretty.js:396327-396342 (193) | function |

---

## Module: Model Selection (Explore inheritance, effort gating)

> **Merge into `symbol_index_infra_platform.md`** (Model Selection section).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Wu` | EXPLORE_MODEL_CEILING (`"opus"`) | cli_inner_pretty.js:269283 | constant |
| `bY` | isUltracodeXhighSession (concurrency-cap exemption) | cli_inner_pretty.js:119417-119419 | function |
| `Fno` | containsAnySubstring (case-insensitive) | cli_inner_pretty.js:156886-156890 | function |
| `Hn` | getProviderChannel (`firstParty`/`bedrock`/…/`anthropicGoogleCloud`) | cli_inner_pretty.js:100302-100312 | function |
| `khy` | shouldCapExploreAtOpus (firstParty AND model off the ladder) | cli_inner_pretty.js:269272-269276 | function |
| `M0` | isWorkflowsEnabled | cli_inner_pretty.js:119317-119323 | function |
| `M9e` | resolveExploreAgentModel | cli_inner_pretty.js:269267-269271 | function |
| `MWu` | MODEL_LADDER (`["haiku","sonnet","opus"]`) | cli_inner_pretty.js:269307 | constant |
| `Uoe` | resolveEffortLevel | cli_inner_pretty.js:119540-119551 | function |

Baseline-only (2.1.193):

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DYa` | EXPLORE_MODEL_CEILING (`"opus"`) | cli_inner_pretty.js:384831 (193) | constant |
| `RWp` | shouldCapExploreAtOpus | cli_inner_pretty.js:384820-384824 (193) | function |
| `RYa` | MODEL_LADDER | cli_inner_pretty.js:384855 (193) | constant |
| `WSe` | resolveExploreAgentModel (gated on `tengu_quartz_heron`) | cli_inner_pretty.js:384815-384819 (193) | function |

---

## Module: Settings / Env Plumbing

> **Merge into `symbol_index_infra_platform.md`** (Permissions / settings section).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `n7t` | isSettingsEnvVarAllowed | cli_inner_pretty.js:57846-57849 | function |
| `nHh` | SETTINGS_ENV_ALLOWLIST (contains the two session caps at `:58164`, `:58166`) | cli_inner_pretty.js:57993-58175 | constant |
| `oHh` | SETTINGS_ENV_OPT_OUT_ONLY (telemetry kill switches) | cli_inner_pretty.js:58176-58181 | constant |

---

## Module: Telemetry helpers used by the caps

> **Merge into `symbol_index_infra_platform.md`** (Telemetry section).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$e` | logFeatureSad (`tengu_feature_sad`) — soft degrade | cli_inner_pretty.js:47876-47878 | function |
| `be` | logFeatureOk (`tengu_feature_ok`) | cli_inner_pretty.js:47870-47872 | function |
| `Ke` | getFeatureValue (alias of `getFeatureValue_CACHED_MAY_BE_STALE`) | cli_inner_pretty.js:156667-156669 | function |
| `pe` | logFeatureBad (`tengu_feature_bad`) — hard refusal | cli_inner_pretty.js:47873-47875 | function |

---

## Module: Tools (WebSearch budget)

> **Merge into `symbol_index_core_execution.md`** (Tools section).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `wwd` | shouldUseWebSearchCcrProxy | cli_inner_pretty.js:403456-403460 | function |

---

## Feature gates / telemetry events introduced or removed in this theme

Not symbol rows; recorded here so the index owners can cross-reference.

| Name | 220 | 193 | Meaning |
|---|---|---|---|
| `tengu_hazel_trellis` | 1 (`:230907`) | 0 | remote override of the spawn-depth default |
| `tengu_amber_kestrel` | 1 (`:398405`) | 0 | disables the concurrency cap entirely |
| `tengu_agent_worktree_cwd_escape_blocked` | 4 (`:314164`, `:314192`, `:314210`, `:314220`) | 0 | four reasons: `context_lost`, `worktree_gone`, `shared_checkout`, `command_redirect` |
| `tengu_subagent_output_flagged` | 1 (`:345381`) | 0 | injection-scrubber findings |
| `tengu_subagent_zero_tools` | 1 (`:344437`) | 0 | subagent resolved to an empty tool list |
| `print_budget_halt` | 1 (`:846944`) | 0 | `--max-budget-usd` stopped running background agents |
| `tengu_quartz_heron` | **0** | 1 (`:384817 (193)`) | **removed** — the Explore-inherit gate graduated |
| `tengu_shale_finch` | 1 (`:345464`) | 1 | carryover — slims a subagent's tool set |
| `subagent_launch` error codes (via `pe`/`$e`) | — | — | new in this theme: `subagent_budget_exhausted` (`:398386`), `subagent_count_cap` (`:398395`), `subagent_concurrency_cap` (`:398409`), `forked_skill_depth_cap` (`:342439`), `forked_skill_depth_chain_cap` (`:342433`), `forked_skill_spawn_cap` (`:342442`); carryover: `subagent_depth_cap` (`:398326` / `:430480 (193)`) |
| `tool_web_search` / `web_search_session_cap` | 1 (`:403664`) | 0 | WebSearch budget refusal, with `max_web_searches_per_session` attribute |
