# Symbol additions — v2.1.220 `42_workflow` (Workflow tool + dynamic workflow sizing)

> Staged for merge into the four `symbol_index_*.md` files. Each `## Module:` heading names the
> destination file. **Every line number below was read in the 2.1.220 bundle**
> (`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`, `build_sha 4073f595`)
> during the analysis that produced [`../42_workflow/`](../42_workflow/README.md).
> `File:Line` is always `cli_inner_pretty.js:<line>` in the **2.1.220** build.
> Reminder (`_CONVENTIONS.md` §4.1): these ids are re-mangled per build — never carry them to another tree.

Row format: `| Obfuscated | Readable | File:Line | Type |`, sorted alphabetically by obfuscated id
within each section.

---

## Module: Workflow — size guideline

**Merge into:** `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cEd | DEFAULT_WORKFLOW_SIZE | cli_inner_pretty.js:389143 | constant |
| dEd | describeSizeWithCap | cli_inner_pretty.js:389124-389127 | function |
| Dft | resolveWorkflowSizeGuideline | cli_inner_pretty.js:389152-389155 | function |
| fEd | buildGuidelineSentence | cli_inner_pretty.js:389131-389137 | function |
| g6y | formatSizeWithInlineCap | cli_inner_pretty.js:389114-389117 | function |
| hEd | diffWorkflowSizeAgainstTranscript | cli_inner_pretty.js:389167-389180 | function |
| iMs | buildGuidelineSuffix | cli_inner_pretty.js:389160-389166 | function |
| Kli | positiveFiniteOrUndefined | cli_inner_pretty.js:747610-747612 | function |
| KLS | ASSUMED_TOKENS_PER_AGENT | cli_inner_pretty.js:747639 | constant |
| kya | WorkflowSizeStatusHint | cli_inner_pretty.js:651528-651549 | function |
| mEd | buildSizeChangeReminder | cli_inner_pretty.js:389138-389141 | function |
| nMs | WORKFLOW_SIZE_VALUES | cli_inner_pretty.js:389146 | constant |
| Nsn | memoiseSessionWorkflowSize | cli_inner_pretty.js:389156-389159 | function |
| oMs | sessionWorkflowSizeMemo | cli_inner_pretty.js:389181 | variable |
| pEd | guidelineCaveat | cli_inner_pretty.js:389128-389130 | function |
| Q$t | isWorkflowSizeSetBySettings | cli_inner_pretty.js:389149-389151 | function |
| rko | formatSizeRowValue | cli_inner_pretty.js:389118-389120 | function |
| tko | WORKFLOW_SIZE_AGENT_CAPS | cli_inner_pretty.js:389147 | object |
| uEd | sizeToAgentCap | cli_inner_pretty.js:389121-389123 | function |
| VLS | DEFAULT_AGENT_WARN_CAP | cli_inner_pretty.js:747637 | constant |
| whm | hasExplicitWorkflowSizeGuideline | cli_inner_pretty.js:814920-814922 | function |
| Yfr | initWorkflowSizeModule | cli_inner_pretty.js:389145-389148 | function |
| z5f | computeWorkflowSizeWarning | cli_inner_pretty.js:747613-747635 | function |
| zLS | DEFAULT_TOKEN_WARN_CAP | cli_inner_pretty.js:747638 | constant |
| $sn | coerceToKnownSize | cli_inner_pretty.js:389111-389113 | function |

Non-symbol anchors read in the same pass (for the index's anchor columns):

| Anchor | File:Line | Note |
|---|---|---|
| `workflowSizeGuideline` (zod field + `.describe()`) | cli_inner_pretty.js:60914-60919 | 220=21 / 193=0 |
| `workflowSizeGuideline` in `GLOBAL_CONFIG_KEYS` | cli_inner_pretty.js:537152 | appended last; 193's list ends at `remoteDialogSeen` |
| `workflowSizeGuidelineToggleable = !Q$t()` (headless row builder) | cli_inner_pretty.js:452357 | |
| `workflowSizeGuidelineToggleable = !Q$t()` (interactive `/config`) | cli_inner_pretty.js:668331 | |
| `/config` row `id: "workflowSizeGuideline"`, `label: "Dynamic workflow size"` | cli_inner_pretty.js:451504-451519 | gate `E && (_ \|\| M0())` at :451501 |
| `/config` enum-value render via `rko` | cli_inner_pretty.js:669180-669189 | |
| plain-text value formatter branch | cli_inner_pretty.js:669397 | inside `tof` |
| `tengu_workflow_size_warning_shown` | cli_inner_pretty.js:747921-747929 | 220=1 / 193=0 |
| `tengu_ochre_gantry` (warning kill switch) | cli_inner_pretty.js:747615 | 220=1 / 193=0 |
| `CLAUDE_CODE_WORKFLOW_SIZE_WARNING_AGENTS` (accessor) | cli_inner_pretty.js:30983 | read at :747619 |
| `CLAUDE_CODE_WORKFLOW_SIZE_WARNING_TOKENS` (accessor) | cli_inner_pretty.js:30982 | read at :747621 |
| `workflow_size_guideline_change` attachment producer | cli_inner_pretty.js:516675-516677 | |
| `workflow_size_guideline_change` attachment renderer | cli_inner_pretty.js:534378 | |
| `workflow_size_guideline_change` in the invisible-attachment set | cli_inner_pretty.js:687163 | consumed by `_Qo` :687119 |
| tip `workflow-size-prompting` | cli_inner_pretty.js:815616-815626 | |
| tip `workflow-size-prompting-ambient` | cli_inner_pretty.js:815627-815637 | |

---

## Module: Workflow — tool definition, runtime and script parsing

**Merge into:** `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $H | parseWorkflowScriptMeta | cli_inner_pretty.js:275599-275629 | function |
| Abs | PARSE_ERROR_SNIPPET_WIDTH | cli_inner_pretty.js:275740 | constant |
| a6y | BRIDGE_MIN_INTERVAL_MS | cli_inner_pretty.js:388912 | constant |
| BO_ | UNICODE_ESCAPE_RE_GLOBAL | cli_inner_pretty.js:508588 | constant |
| c6y | createProgressBatcher | cli_inner_pretty.js:388538-388569 | function |
| ctp | repairDoubleEscapedUnicode | cli_inner_pretty.js:508472-508481 | function |
| dgy | formatScriptParseError | cli_inner_pretty.js:275631-275652 | function |
| dk | WORKFLOW_TOOL_NAME | cli_inner_pretty.js:231211 | constant |
| f6y | WORKFLOW_ISOLATION_TYPE_PROSE | cli_inner_pretty.js:388936 | constant |
| fgy | isMetaExportStatement | cli_inner_pretty.js:275665-… | function |
| l6y | SNAPSHOT_HEARTBEAT_MS | cli_inner_pretty.js:388913 | constant |
| ltp | UNICODE_ESCAPE_RE | cli_inner_pretty.js:508587 | constant |
| nko | WorkflowInputError | cli_inner_pretty.js:389344-389349 | class |
| o1 | MAX_WORKFLOW_SCRIPT_BYTES | cli_inner_pretty.js:162044 | constant |
| oEd | isNotWorkflowLog | cli_inner_pretty.js:388907-388909 | function |
| pgy | hasNumericLoc | cli_inner_pretty.js:275653-275664 | function |
| qPs | applyWorkflowProgressEvents | cli_inner_pretty.js:386523-386572 | function |
| rMs | WORKFLOW_TOOL_PROSE | cli_inner_pretty.js:388943-389101 | constant |
| S6y | WorkflowTool | cli_inner_pretty.js:389355-… | object |
| s6y | PROGRESS_BATCH_WINDOW_MS | cli_inner_pretty.js:388911 | constant |
| u6y | resolveReportedWorkflowName | cli_inner_pretty.js:388570-388573 | function |
| UO_ | WINDOWS_PATH_RE | cli_inner_pretty.js:508589 | constant |
| vqs | repairValue | cli_inner_pretty.js:508482-508506 | function |
| Xpn | normalizeToolUseBlocks | cli_inner_pretty.js:531864-… | function |
| yEd | resolveWorkflowScriptSource | cli_inner_pretty.js:389188-389215 | function |
| _Ed | RETRACTED_DISPATCH_RESULT | cli_inner_pretty.js:389350-389354 | object |

Non-symbol anchors:

| Anchor | File:Line | Note |
|---|---|---|
| `aliases: ["RunWorkflow"]` | cli_inner_pretty.js:389357 | |
| `tengu_repair_double_escaped_unicode` | cli_inner_pretty.js:508476 | 220=1 / 193=0 |
| Workflow `script` exemption from the repair pass | cli_inner_pretty.js:531889 | `if (s.name === dk && typeof a.script === "string") l.script = a.script;` |
| `disableWorkflows` managed-settings refusal | cli_inner_pretty.js:389381 | |
| named-workflows-only restriction refusal | cli_inner_pretty.js:389401 | |
| `tengu_workflow_launch_event` | cli_inner_pretty.js:502483, :502581 | 220=2 / 193=0; **resolved in round 2** — belongs to the server-authored launch channel, not the Workflow tool (see the section below) |
| `tengu_workflow_completed` (`workflow_run_id`) | cli_inner_pretty.js:388701 | carryover from 193:424852 |
| `tengu_workflow_phase_completed` (`workflow_run_id`) | cli_inner_pretty.js:388741 | carryover from 193:424892 |

---

## Module: Workflow — save path and filesystem guards

**Merge into:** `symbol_index_core_features.md` (workflow), cross-reference from
`symbol_index_infra_platform.md` (sandbox/permissions) for `assertDirChainReal`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fn | getClaudeConfigDir | cli_inner_pretty.js:14779 | function |
| G7r | writeScheduledTasks | cli_inner_pretty.js:230132-230145 | function |
| I0t | isClaudeConfigDir | cli_inner_pretty.js:14682-14686 | function |
| jGn | assertDirChainReal | cli_inner_pretty.js:51990-52010 | function |
| MO | tildifyHomePath | cli_inner_pretty.js:51877-51882 | function |
| oVa | saveWorkflowScript | cli_inner_pretty.js:728199-728231 | function |
| rii | WORKFLOW_EXISTS_HINT | cli_inner_pretty.js:728234 | constant |
| wkl | canonicaliseConfigDirPath | cli_inner_pretty.js:14687-14691 | function |
| WSS | resolveWorkflowsDir | cli_inner_pretty.js:728191-728198 | function |
| X$t | getUserWorkflowsDir | cli_inner_pretty.js:388219-388221 | function |
| X5 | atomicWriteFile | cli_inner_pretty.js:52398 | function |
| eDi | atomicWriteFileSyncCore | cli_inner_pretty.js:52256-… | function |

Non-symbol anchors:

| Anchor | File:Line | Note |
|---|---|---|
| `assertDirChainReal: dir must be strictly inside base` | cli_inner_pretty.js:51994-51995 | 220=2 / 193=0 |
| `Refusing to write under symlinked or non-directory path:` | cli_inner_pretty.js:52005 | 220=1 / 193=0 |
| `Refusing to write into symlinked directory:` | cli_inner_pretty.js:52277 | 220=2 / 193=2 — carryover |
| `Refusing to write through symlink:` | cli_inner_pretty.js:52283 | 220=4 / 193=4 — carryover |
| save-dialog scope label built from `X$t()` | cli_inner_pretty.js:728335 | replaced 193's hardcoded `~/.claude/workflows/` (193:541825) |
| save-dialog `<scope> scope · <path>` render | cli_inner_pretty.js:728341-728344 | |
| `tengu_workflow_saved` | cli_inner_pretty.js:728228 | carryover from 193:541732 |

---

## Module: Workflow — `/workflows` progress UI

**Merge into:** `symbol_index_infra_integration.md` (UI components)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Azp | FLAT_AGENT_LIST_TAIL | cli_inner_pretty.js:650879 | constant |
| de | stepOutOfWorkflowDetail | cli_inner_pretty.js:729536-729547 | function |
| eza | WorkflowAgentsPane | cli_inner_pretty.js:728630 | function |
| Fst | formatCompactDuration | cli_inner_pretty.js:160497-160505 | function |
| G9o | WorkflowPhaseRow | cli_inner_pretty.js:650974 | function |
| gvS | buildAgentRowCells | cli_inner_pretty.js:728539-728556 | function |
| Hga | renderFlatAgentList | cli_inner_pretty.js:650746-650811 | function |
| iNf | buildCompactAgentRowSegments | cli_inner_pretty.js:728935-728944 | function |
| Iga | WorkflowProgressBody | cli_inner_pretty.js:650812-650875 | function |
| kga | renderPhaseGroupBox | cli_inner_pretty.js:650629-650745 | function |
| L9o | groupAgentsByPhase | cli_inner_pretty.js:650505-650518 | function |
| lNf | TIME_COL_WIDTH | cli_inner_pretty.js:729794 | constant |
| mb | getModelDisplayName | cli_inner_pretty.js:111291-111298 | function |
| nNf | buildPhaseRowSegments | cli_inner_pretty.js:728897-728919 | function |
| nza | WorkflowAgentSplitPane | cli_inner_pretty.js:729234 | function |
| oNf | buildAgentRowSegments | cli_inner_pretty.js:728920-728934 | function |
| oza | WorkflowAgentSinglePane | cli_inner_pretty.js:729362 | function |
| Q9a | layoutAgentRowSegments | cli_inner_pretty.js:728557-728581 | function |
| qii | computeAgentTitleColumnWidth | cli_inner_pretty.js:728581-728585 | function |
| RTr | partitionWorkflowProgress | cli_inner_pretty.js:650495-650504 | function |
| TTr | formatModelPair | cli_inner_pretty.js:650468-650472 | function |
| tza | WorkflowPhasesAgentsSplitPane | cli_inner_pretty.js:728946 | function |
| vvn | WorkflowAgentTreeRow | cli_inner_pretty.js:650519-… | function |
| yvS | MAX_TITLE_COL | cli_inner_pretty.js:729795 | constant |
| Z9a | WorkflowListWindowIndicator | cli_inner_pretty.js:728617 | function |
| Zl | KeyboardFocusBox | cli_inner_pretty.js:654325-654343 | function |
| _vS | MIN_STATS_COL | cli_inner_pretty.js:729796 | constant |

Non-symbol anchors:

| Anchor | File:Line | Note |
|---|---|---|
| `"Running in background · "` / `/workflows` / `" to monitor and save"` + `<kya/>` | cli_inner_pretty.js:651498-651513 | the `<kya/>` child at :651506 is the `.219` delta |
| `"/workflows"` + `" to view dynamic workflow runs"` | cli_inner_pretty.js:651515-651526 | carryover |
| `"Dynamic workflow cancelled"` | cli_inner_pretty.js:651551 | carryover |
| `└─ · · · +N more` flat-list footer | cli_inner_pretty.js:650797 | carryover from 193:425490 |
| detail-view `left` → step-out | cli_inner_pretty.js:729625 | carryover from 193:543075 |
| detail-view `onCancel: de` (Esc) | cli_inner_pretty.js:729687 | carryover from 193:543140 |

---

## Module: Telemetry — workflow provenance attributes

**Merge into:** `symbol_index_infra_platform.md` (telemetry)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ac | emitOtelLogEvent | cli_inner_pretty.js:167354-… | function |
| D5r | buildWorkflowOtelAttrs | cli_inner_pretty.js:111459-111462 | function |
| mde | isSubagentContext | cli_inner_pretty.js:111442-111444 | function |
| nZ | buildWorkflowEventFields | cli_inner_pretty.js:111463-111466 | function |
| Plu | startToolSpan | cli_inner_pretty.js:168193-168222 | function |
| Vpr | emitTaskProgressFrame | cli_inner_pretty.js:345314-345327 | function |

Non-symbol anchors:

| Anchor | File:Line | Note |
|---|---|---|
| `"workflow.run_id"` / `"workflow.name"` | cli_inner_pretty.js:111461 | **220=1 / 193=0** each (literal dot); corrects `_GROUND_TRUTH…` §3's `220=3/193=2` |
| `Object.assign(n, D5r(r))` in the log emitter | cli_inner_pretty.js:167360 | 193 equivalent has no such line |
| `u.setAttributes(D5r(t))` on `claude_code.llm_request` | cli_inner_pretty.js:168127 | 193:286603-286608 lacks it |
| `c.setAttributes(D5r(t))` on `claude_code.tool` | cli_inner_pretty.js:168218 | 193:286694 lacks it |
| `workflow_progress` field on the `task_progress` frame | cli_inner_pretty.js:345325 | |

---

## Module: Remote Control — agent-fan publishing

**Merge into:** `symbol_index_infra_integration.md` (IDE/remote surfaces); cross-reference from
`symbol_index_core_features.md` (background agents)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bHs | agentFanStore | cli_inner_pretty.js:334800 | variable |
| Bpt | hashFanItems | cli_inner_pretty.js:334776-334784 | function |
| Fpt | budgetBucket | cli_inner_pretty.js:334772-334775 | function |
| hon | agentFanSnapshot | cli_inner_pretty.js:334797, :334800 | variable |
| lol | buildAgentFanItems | cli_inner_pretty.js:764295-… | function |
| Mcd | subscribeBridgePublishers | cli_inner_pretty.js:335449-335488 | function |
| mol | AgentFanPublisherEffect | cli_inner_pretty.js:764424-764460 | function |
| Mx | isReplBridgeActive | cli_inner_pretty.js:3969-3971 | function |
| Ocd | publishAgentFan | cli_inner_pretty.js:335489-335505 | function |
| SHs | setAgentFanSnapshot | cli_inner_pretty.js:334788-334793 | function |
| spr | getAgentFanSnapshot | cli_inner_pretty.js:334794-334796 | function |
| yn | isNonInteractive | cli_inner_pretty.js:3286-3288 | function |
| Z1t | getInFlightSummary | cli_inner_pretty.js:334785-334787 | function |

Non-symbol anchors:

| Anchor | File:Line | Note |
|---|---|---|
| third bridge subscription (`bHs.subscribe`) | cli_inner_pretty.js:335476-335487 | 193's `ybl` (193:464880-464906) has only two |
| state-file write with `fan` | cli_inner_pretty.js:335502 | 193 wrote `fan` only from the status writer, 193:465205 |
| frame-emit gate `!yn() && !Mx()` | cli_inner_pretty.js:388553 | 193 gate was `!Tr()` (non-interactive only), 193:424806 |
| `tengu_frame_publish_context` | cli_inner_pretty.js:381716 | **Artifact** gate — NOT the RC agent grid (mis-anchor correction) |
| `tengu_remote_subagent_frame_nested` | cli_inner_pretty.js:757401 | inside `if (ut !== null)` with `ut = null` at :757390 — **dead code** in this build |

---

## Module: Accessibility/UI — left-arrow guard (for cross-reference only)

**Merge into:** `symbol_index_infra_integration.md` (UI components)

Recorded here because two workflow bullets were mis-anchored to it. This guard is in the **prompt input**,
not the workflow detail view.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Fyp | commitLeftArrowAction | cli_inner_pretty.js:559664-559683 | function |
| GV_ | ATTACH_CONFIRM_MIN_MS | cli_inner_pretty.js:559686 | constant |
| Nyp | resolveLeftArrowAction | cli_inner_pretty.js:559650-559662 | function |
| Oyp | LEFT_ARROW_ABSORB_MS | cli_inner_pretty.js:559685 | constant |
| UXs | LEFT_ARROW_FEEDBACK_MS | cli_inner_pretty.js:559684 | constant |

Non-symbol anchors:

| Anchor | File:Line | Note |
|---|---|---|
| `tengu_left_arrow_editing_guard` | cli_inner_pretty.js:559928 | 220=1 / 193=0; inside `W.text === ""` branch at :559926 |
| `tengu_left_arrow_blocked` reasons `editing-quiet` / `attach-quiet-hint` | cli_inner_pretty.js:559935, :559949 | |
| `"Press ← again"` / `"Ambiguous ←, press again to detach"` | cli_inner_pretty.js:559934, :559945 | |

---

## Module: Settings/config plumbing touched by this theme

**Merge into:** `symbol_index_infra_platform.md` (settings/prompt building)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $4_ | isGlobalConfigKey | cli_inner_pretty.js:535945-535947 | function |
| ANn | setLoadedSettings | cli_inner_pretty.js:1864-1866 | function |
| icp | PROJECT_CONFIG_KEYS | cli_inner_pretty.js:537154 | constant |
| oUs | buildHeadlessConfigRowInputs | cli_inner_pretty.js:452347-452386 | function |
| SI | getLoadedSettings | cli_inner_pretty.js:1861-1863 | function |
| t4o | GLOBAL_CONFIG_KEYS | cli_inner_pretty.js:537104-537153 | constant |
| xt | getConfig | cli_inner_pretty.js:536338-536343 | function |
| _Qo | isInvisibleAttachment | cli_inner_pretty.js:687119-687124 | function |

> **Note on `oUs`:** the two lines actually read and cited in the module docs are `:452357`
> (`l = !Q$t()`) and `:452379` (`workflowSizeGuidelineToggleable: l`). The `:452347-452386` span is the
> enclosing function body as read in one pass.

Non-symbol anchors:

| Anchor | File:Line | Note |
|---|---|---|
| `enableWorkflows` zod field | cli_inner_pretty.js:60908-60913 | carryover |
| `workflowKeywordTriggerEnabled` zod field | cli_inner_pretty.js:60920-60925 | carryover |
| `GLOBAL_CONFIG_KEYS` export name | cli_inner_pretty.js:535898 | real identifier recovered from the export table |
| `PROJECT_CONFIG_KEYS` export name | cli_inner_pretty.js:535896 | ditto |
| settings-loader install of the cache | cli_inner_pretty.js:62595, :63187 | `ANn(...)` call sites |

---

# Round 2 additions — the Workflow runtime layer

> These sections were produced by the round-2 full-chain analysis of the script runtime
> (`42_workflow/workflow_runtime_core.md`, `workflow_lifecycle.md`, `workflow_model_resolution.md`,
> `workflow_state_and_ipc.md`, `workflow_server_authored_launch.md`), which closed the deferral
> recorded in `42_workflow/README.md` §5. Every line number below was read in the 2.1.220 bundle.
> Rows marked **(exported)** carry an identifier leaked verbatim by a `tt(module, {...})` export map
> or by an in-source string, and are ground truth rather than inference.

## Module: Workflow — script runtime and host objects

**Merge into:** `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Aft | MAX_VM_ARRAY_LENGTH | cli_inner_pretty.js:385841 | constant |
| AB | createLimiter | cli_inner_pretty.js:162762-162781 | function |
| ASd | vmCallFunction | cli_inner_pretty.js:385492-385494 | function |
| BSd | PREVIEW_MAX_CHARS | cli_inner_pretty.js:388114 | constant |
| Bxo | WORKFLOW_SYNC_SLICE_TIMEOUT_MS | cli_inner_pretty.js:386383 | constant |
| BWy | RANDOM_UNAVAILABLE_MESSAGE | cli_inner_pretty.js:386380-386381 | constant |
| Cft | compileWorkflowScript | cli_inner_pretty.js:386354-386376 | function |
| Cg | VM_HELPER_PREFIX | cli_inner_pretty.js:386384 | constant |
| DSd | createNestedWorkflowHost | cli_inner_pretty.js:386829-386945 | function |
| Dxo | wrapAsyncHostCallable | cli_inner_pretty.js:385658-385668 | function |
| e6y | STRUCTURED_OUTPUT_SUBAGENT_PROMPT | cli_inner_pretty.js:388201-388207 | constant |
| eEd | buildWorkflowVMContext | cli_inner_pretty.js:388358-388429 | function |
| eMs | WORKFLOW_SUBAGENT_DEF | cli_inner_pretty.js:388208-388216 | object |
| eve | wrapSyncHostCallable | cli_inner_pretty.js:385647-385657 | function |
| ESd | makeBoundaryCapError | cli_inner_pretty.js:385669-385672 | function |
| Fxo | applyDeterminismShim | cli_inner_pretty.js:386247-386249 | function |
| FWy | DATE_UNAVAILABLE_MESSAGE | cli_inner_pretty.js:386378-386379 | constant |
| Hxo | vmReadError | cli_inner_pretty.js:385495-385514 | function |
| Ift | truncatePreview | cli_inner_pretty.js:387143-387148 | function |
| Isn | deepCloneAcrossVM | cli_inner_pretty.js:385688-385725 | function |
| Ixo | vmDeepCloneIntoGuest | cli_inner_pretty.js:385515-385591 | function |
| JWy | WORKFLOW_SUBAGENT_PROMPT | cli_inner_pretty.js:388115-388121 | constant |
| jWy | rewriteAwaitsForVM | cli_inner_pretty.js:386287-386353 | function |
| KWy | WORKFLOW_AGENT_CONCURRENCY | cli_inner_pretty.js:388108 (decl), :388177 (bound) | variable |
| Lxo | describeGuestValue | cli_inner_pretty.js:385643-385646 | function |
| Mxo | vmStringHelpers | cli_inner_pretty.js:385738-385750 | function |
| n6y | MAX_STRUCTURED_OUTPUT_RETRIES_DEFAULT | cli_inner_pretty.js:388133 | constant |
| NWy | guestErrorReaderSingleton | cli_inner_pretty.js:385603-385630 | function |
| Oxo | vmSanitizeHelpers | cli_inner_pretty.js:385751-385834 | function |
| Pxo | readGuestArray | cli_inner_pretty.js:385726-385737 | function |
| qfr | guestToString | cli_inner_pretty.js:385835-385839 | function |
| qSd | WorkflowAgentCapError | cli_inner_pretty.js:388182-388187 | class |
| r6y | DEFAULT_AGENT_STALL_MS | cli_inner_pretty.js:388131 | constant |
| rEd | runWorkflowScript | cli_inner_pretty.js:388439-388529 | function |
| Rsn | readGuestError | cli_inner_pretty.js:385631-385642 | function |
| Rxo | wrapHostFnForGuest | cli_inner_pretty.js:385592-385594 | function |
| t6y | WORKFLOW_SUBAGENT_DEF_STRUCTURED | cli_inner_pretty.js:388217 | object |
| Tft | nullProtoCallable | cli_inner_pretty.js:386244-386246 | function |
| TSd | assertSafeArrayLength | cli_inner_pretty.js:385676-385687 | function |
| USd | MAX_STALL_RETRIES | cli_inner_pretty.js:388132 | constant |
| UWy | WORKFLOW_DETERMINISM_SHIM | cli_inner_pretty.js:386390-386410 | constant |
| Uxo | hasNondeterministicCall | cli_inner_pretty.js:386412-386438 | function |
| V$t | hardenVMIntrinsics | cli_inner_pretty.js:385349-385488 | function |
| VSd | WorkflowBudgetExceededError | cli_inner_pretty.js:388188-388195 | class |
| vSd | isBoundaryCapError | cli_inner_pretty.js:385673-385675 | function |
| w2e | makeGuestError | cli_inner_pretty.js:385595-385602 | function |
| Wfr | vmSettlePromise | cli_inner_pretty.js:385489-385491 | function |
| wft | vmTimeoutOption | cli_inner_pretty.js:385345-385348 | function |
| WSd | WORKFLOW_AGENT_CAP | cli_inner_pretty.js:388110 | constant |
| XWy | WORKFLOW_AGENT_CAP_MESSAGE | cli_inner_pretty.js:388111 (decl), :388178-388181 (bound) | constant |
| xSd | createGuestTimers | cli_inner_pretty.js:386250-386286 | function |
| YPs | createGuestConsole | cli_inner_pretty.js:386791-386828 | function |
| YWy | WORKFLOW_REMOTE_CONCURRENCY | cli_inner_pretty.js:388109 | constant |
| Yxo | summariseToolInput | cli_inner_pretty.js:387127-387136 | function |
| zSd | createWorkflowHostObjects | cli_inner_pretty.js:387149-388105 | function |
| zWy | computeAgentConcurrency | cli_inner_pretty.js:387140-387142 | function |
| ZWy | STRUCTURED_OUTPUT_NOTE | cli_inner_pretty.js:388196-388200 | constant |
| QWy | WORKFLOW_RETURN_VALUE_NOTE | cli_inner_pretty.js:388122-388126 | constant |

Non-symbol anchors:

| Anchor | File:Line | Note |
|---|---|---|
| `agent({isolation:'remote'}) is not available in this build` | cli_inner_pretty.js:387393 | 220=1 / 193=1 (`:423617 (193)`) — the remote runner `re` (`:387907-388015`) and its limiter `G` (`:387223`) are dead in **both** builds |
| `tengu_workflow_agent_cap_exceeded` | cli_inner_pretty.js:387192 | 220=1 / 193=1 |
| `tengu_workflow_budget_cap_exceeded` | cli_inner_pretty.js:387199 | 220=1 / 193=1 |
| `tengu_workflow_journal_started_hit_respawn` | cli_inner_pretty.js:387357 | 220=1 / 193=1 |
| `isBackgroundAgent: !0` on the derived tool-use context | cli_inner_pretty.js:387205 | **220=8 / 193=0**; 2.1.193's equivalent is `:423501 (193)` without the field |
| in-executor `agentMessages` (auto-mode handoff review) | cli_inner_pretty.js:387562, :387604, :387621, :387865-387883 | **in-range 220=7 / 193=0** — undocumented DELTA |
| `hardenVMIntrinsics` name | cli_inner_pretty.js:385364 | **(exported)** leaked in the in-source comment; shared with the REPL tool (`:402255`) |
| `LocalFileJournal` name | cli_inner_pretty.js:387100 | **(exported)** leaked in its own warning string; 220=1 / 193=1 |
| `throttled response` retry log | cli_inner_pretty.js:387794 | 220=1 / 193=1 |
| `stallMs` (undocumented `agent()` option) | cli_inner_pretty.js:387325 | 220=1 / 193=1; absent from the tool prose |

## Module: Workflow — lifecycle, journal and adoption

**Merge into:** `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $Sd | indexJournal | cli_inner_pretty.js:387035-387046 | function |
| AZs | checkpointWorkflowForAdopt | cli_inner_pretty.js:564815-564826 | function |
| aGo | notifyAdoptedWorkflowFailed | cli_inner_pretty.js:565071-565078 | function |
| CQt | areWorkflowsDisabledByPolicy | cli_inner_pretty.js:119310-119312 | function |
| fbe | slugifyWorkflowName | cli_inner_pretty.js:162002-162009 | function |
| FSd | deriveJournalKey | cli_inner_pretty.js:387077-387080 | function |
| GPs | registerWorkflowTask | cli_inner_pretty.js:386454-386493 | function |
| ggy | normalisePhases | cli_inner_pretty.js:275728-275738 | function |
| gte | workflowTranscriptDir | cli_inner_pretty.js:386965-386968 | function |
| Gxo | failWorkflowTask | cli_inner_pretty.js:386614-386617 | function |
| hgy | validateWorkflowMeta | cli_inner_pretty.js:275718-275727 | function |
| hWi | workflowAvailability (memoised) | cli_inner_pretty.js:119336-119339 | function |
| ISd | abortWorkflowAgent | cli_inner_pretty.js:386635-386648 | function |
| IRt | readWorkflowScriptFile | cli_inner_pretty.js:162030-162041 | function |
| JPs | LocalFileJournal | cli_inner_pretty.js:387081-387116 | class |
| jxo | terminateWorkflowTask | cli_inner_pretty.js:386573-386591 | function |
| kft | pauseWorkflowTask | cli_inner_pretty.js:386618-386622 | function |
| kSd | MAX_PROGRESS_NODES | cli_inner_pretty.js:386764 | constant |
| lJn | isWorkflowsPolicyAllowed | cli_inner_pretty.js:119333-119335 | function |
| Loo | persistWorkflowScript | cli_inner_pretty.js:162016-162029 | function |
| Lsn | isLocalWorkflowTask | cli_inner_pretty.js:386499-386501 | function |
| LSd | CLAUDE_WORKFLOW_NAME_ONLY_ENV | cli_inner_pretty.js:386787 | constant |
| lug | computeWorkflowAvailability | cli_inner_pretty.js:119340-119349 | function |
| M0 | areWorkflowsEnabled | cli_inner_pretty.js:119317-119323 | function |
| MSd | workflowSnapshotDir | cli_inner_pretty.js:386961-386964 | function |
| nEp | relinkAdoptedTranscriptDir | cli_inner_pretty.js:565049-565070 | function |
| Osn | launchWorkflow | cli_inner_pretty.js:388585-388864 | function |
| OSd | writeWorkflowSnapshot | cli_inner_pretty.js:386969-386978 | function |
| qWy | JOURNAL_KEY_VERSION | cli_inner_pretty.js:387120 | constant |
| qxo | notifyWorkflowCompletion | cli_inner_pretty.js:386655-386762 | function |
| Roo | workflowScriptDir | cli_inner_pretty.js:162010-162012 | function |
| sEd | resumeAdoptedWorkflow | cli_inner_pretty.js:388865-388906 | function |
| T6u | evaluatePureLiteral | cli_inner_pretty.js:275699-275717 | function |
| tMs | isBundledAndUnmodified | cli_inner_pretty.js:388574-388576 | function |
| TLg | workflowScriptPath | cli_inner_pretty.js:162013-162015 | function |
| tve | killWorkflowTask | cli_inner_pretty.js:386627-386634 | function |
| ugy | UNSAFE_META_KEYS | cli_inner_pretty.js:275744 | constant |
| Vfr | skipWorkflowAgent | cli_inner_pretty.js:386649-386651 | function |
| VPs | completeWorkflowTask | cli_inner_pretty.js:386593-386613 | function |
| VWy | canonicaliseAgentOpts | cli_inner_pretty.js:387047-387076 | function |
| WPs | registerPausedWorkflowPlaceholder | cli_inner_pretty.js:386502-386522 | function |
| Wxo | buildPausedResumeHint | cli_inner_pretty.js:386623-386626 | function |
| WWy | workflowSnapshotPath | cli_inner_pretty.js:386958-386960 | function |
| XPs | listWorkflowSnapshots | cli_inner_pretty.js:386979-387026 | function |
| z$t | isNameOnlyWorkflowMode | cli_inner_pretty.js:386782-386784 | function |
| zfr | retryWorkflowAgent | cli_inner_pretty.js:386652-386654 | function |

Non-symbol anchors:

| Anchor | File:Line | Note |
|---|---|---|
| `CLAUDE_WORKFLOW_NAME_ONLY` | cli_inner_pretty.js:386783, :386787, :389391, :386851 | **220=5 / 193=0** — NET_NEW lockdown mode, no changelog bullet |
| `scriptSha256` adopt pin | cli_inner_pretty.js:388870, :388875, :564821, :565256, :824009 | **220=7 / 193=0** — NET_NEW |
| `script content changed since it was approved` | cli_inner_pretty.js:388877 | 220=1 / 193=0 |
| `workflow was checkpointed without a content pin` | cli_inner_pretty.js:388872 | 220=1 / 193=0 |
| `suppressCompletionNotification` | cli_inner_pretty.js:388792, :388832, :502257 | **220=3 / 193=0** — NET_NEW |
| `scriptIsVerbatimBuiltIn` telemetry redaction | cli_inner_pretty.js:389551, :388673, :388711, :388896, :502253 | **220=5 / 193=0** — NET_NEW |
| `workflow_compile` counter | cli_inner_pretty.js:386369, :386372 | **220=2 / 193=0** |
| `workflow_resolve` counter | cli_inner_pretty.js:389408, :389411 | **220=2 / 193=0** |
| `<diagnostics>` / `Per-agent results:` | cli_inner_pretty.js:386711, :386702 | **220=1 / 193=0** each — NET_NEW |
| `agents_empty_result` census | cli_inner_pretty.js:386751 | **220=1 / 193=0**; regex `GWy` at `:386780` |
| `task_local_workflow_resume` counter | cli_inner_pretty.js:388605 | |
| `adopt_resume_failed` / `adopt_spawn_failed` / `adopt_checkpoint_flush_failed` | cli_inner_pretty.js:824024, :564889, :564863 | the three-stage handoff failure taxonomy |
| `meta.phases[].model` parsed and never read |  cli_inner_pretty.js:275733, :275735 | consumers `L9o` `:650505` and `pya` `:651229` read only `title`/`kind` |
| `kvn` returns `null` unconditionally | cli_inner_pretty.js:651236-651238 | called at `:747902` with a full `RTr` walk whose result is discarded |

## Module: Workflow — model and effort resolution (cross-reference)

**Merge into:** `symbol_index_infra_platform.md` (model selection); cross-reference from
`symbol_index_core_features.md` (workflow).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $Wu | EXPLORE_MAX_FAMILY | cli_inner_pretty.js:269283 | constant |
| FFe | EXPLORE_AGENT | cli_inner_pretty.js:269296-269306 | object |
| Grd | isFamilyAliasOfParent | cli_inner_pretty.js:318879-318893 | function |
| gW | normaliseEffort | cli_inner_pretty.js:119487-119496 | function |
| jrd | maybeUpgradeTo1m | cli_inner_pretty.js:318874-318878 | function |
| JRy | DEFAULT_SUBAGENT_MODEL | cli_inner_pretty.js:318796-318798 | function |
| khy | parentFamilyExceedsCap | cli_inner_pretty.js:269272-269276 | function |
| M9e | applyExploreInheritCap | cli_inner_pretty.js:269267-269271 | function |
| mBc | EFFORT_ALIASES | cli_inner_pretty.js:119651 | constant |
| MWu | FAMILY_RANK | cli_inner_pretty.js:269307 | constant |
| QRy | warnModelNotAllowlisted | cli_inner_pretty.js:318869-318873 | function |
| tte | resolveSubagentModel | cli_inner_pretty.js:318799-318832 | function |
| WL | effectiveMainLoopModel | cli_inner_pretty.js:237861-237865 | function |
| Wrd | resolveSubagentModelAudited | cli_inner_pretty.js:318835-318868 | function |
| xur | familyRank | cli_inner_pretty.js:318785-318792 | function |

Non-symbol anchors:

| Anchor | File:Line | Note |
|---|---|---|
| `subagent_model_resolve` counter | cli_inner_pretty.js:318862, :318864, :318865, :318866 | **220=7 / 193=0** — NET_NEW per-spawn audit, no changelog bullet |
| `override_dropped` / `inherit_family_mismatch` | cli_inner_pretty.js:318862, :318864 | **220=2 / 193=0** and **220=1 / 193=0** |
| `CLAUDE_CODE_DISABLE_EXPLORE_INHERIT_CAP` | cli_inner_pretty.js:269269 | **220=2 / 193=0** — NET_NEW escape hatch |
| display-vs-execution model divergence | cli_inner_pretty.js:387467 vs :344319 | `U.options.mainLoopModel` vs `WL(r)`; same shape in `:423769 (193)` — a defect, not a delta |
| `EL` effort tier list | cli_inner_pretty.js:119650 | `["low","medium","high","xhigh","max"]` |

## Module: Workflow — server-authored launch channel (NET_NEW subsystem)

**Merge into:** `symbol_index_core_features.md` (workflow); cross-reference from
`symbol_index_infra_integration.md` (remote transport / slash commands).

Every row here is `220=N / 193=0`. Names marked **(exported)** come from the module's own export map
at `cli_inner_pretty.js:502392-502407`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $D_ | workflowLaunchExecCommand | cli_inner_pretty.js:502613-502638 | function |
| $pn | checkServerWorkflowPolicy | cli_inner_pretty.js:502205-502210 | function |
| aZd | workflowBundleDigestMatches **(exported)** | cli_inner_pretty.js:502434-502438 | function |
| bBo | runServerAuthoredWorkflow | cli_inner_pretty.js:502211-502303 | function |
| cZd | postSystemResultEvent | cli_inner_pretty.js:502474-502479 | function |
| DD_ | createWorkflowLaunchState **(exported)** | cli_inner_pretty.js:502461-502463 | function |
| E_r | errorLine | cli_inner_pretty.js:502325-502327 | function |
| EBo | failFinal | cli_inner_pretty.js:502488-502490 | function |
| Fpn | handoffSlots | cli_inner_pretty.js:502591 (decl), :502609 (init) | variable |
| H6s | takeWorkflowLaunchHandoff **(exported)** | cli_inner_pretty.js:502464-502467 | function |
| HD_ | REMOTE_WORKFLOW_ERROR_LAYERS | cli_inner_pretty.js:502360-502374 | constant |
| ID_ | remoteWorkflowCommand | cli_inner_pretty.js:502329-502354 | function |
| iZd | WORKFLOW_LAUNCH_RESULT_SUBTYPE **(exported)** | cli_inner_pretty.js:502587 | constant |
| JQd | isReviewOriginSession | cli_inner_pretty.js:502183-502185 | function |
| k6s | failTransient | cli_inner_pretty.js:502485-502487 | function |
| kD_ | sanitiseErrorText | cli_inner_pretty.js:502189-502195 | function |
| KPs | CLAUDE_REMOTE_WORKFLOW_ARGS_ENV | cli_inner_pretty.js:386786 | constant |
| LD_ | WORKFLOW_LAUNCH_ERROR_LAYERS **(exported)** | cli_inner_pretty.js:502586 (decl), :502600-502608 (bound) | constant |
| lZd | decodeWorkflowBundle **(exported)** | cli_inner_pretty.js:502439-502460 | function |
| MD_ | stashWorkflowLaunchHandoffForTest **(exported)** | cli_inner_pretty.js:502471-502473 | function |
| Mpn | serialiseResultJson | cli_inner_pretty.js:502199-502204 | function |
| ND_ | WORKFLOW_LAUNCH_EXEC_COMMAND | cli_inner_pretty.js:502646-502657 | object |
| Npn | MAX_LAUNCH_BUNDLE_BYTES **(exported)** | cli_inner_pretty.js:502588 | constant |
| OD_ | handleWorkflowLaunchEvent **(exported)** | cli_inner_pretty.js:502491-502583 | function |
| Opn | errorResultLine | cli_inner_pretty.js:502196-502198 | function |
| PD_ | clearWorkflowLaunchHandoffsForTest **(exported)** | cli_inner_pretty.js:502468-502470 | function |
| RD_ | REMOTE_WORKFLOW_COMMAND | cli_inner_pretty.js:502378-502390 | object |
| S_r | MAX_RESULT_LINE | cli_inner_pretty.js:502305 | constant |
| sZd | parseWorkflowLaunchPointer **(exported)** | cli_inner_pretty.js:502408-502433 | function |
| uZd | postFailureLine | cli_inner_pretty.js:502480-502484 | function |
| vBo | WORKFLOW_BUNDLE_FILESTORE_PREFIX **(exported)** | cli_inner_pretty.js:502589 | constant |
| Vxo | CLAUDE_REMOTE_WORKFLOW_SCRIPT_ENV | cli_inner_pretty.js:386785 | constant |
| x6s | WORKFLOW_BUNDLE_FORMAT_VERSION **(exported)** | cli_inner_pretty.js:502590 | constant |
| ZQd | MAX_ERROR_TEXT | cli_inner_pretty.js:502306 | constant |

Non-symbol anchors:

| Anchor | File:Line | 220 / 193 |
|---|---|---|
| `"workflow_launch"` message type | cli_inner_pretty.js:416596, :840203, :840211, :840216, :840708, :847431, :849008 | 8 / **0** |
| `serverAuthoredCarrier` | cli_inner_pretty.js:502207, :502211, :502213, :502514, :502629 | 5 / **0** |
| `workflow_launch_result` | cli_inner_pretty.js:502475, :502587 | 2 / **0** |
| `artifact_sha256` | cli_inner_pretty.js:502414, :502477, :502553, and the pointer field | 4 / **0** |
| `launch_uuid` | cli_inner_pretty.js:502476 | 1 / **0** |
| `/.workflow/` | cli_inner_pretty.js:502589 | 1 / **0** |
| `workflow-launch-exec` | cli_inner_pretty.js:502579, :502622, :502648, :743887 | 4 / **0** |
| `__remote-workflow` | cli_inner_pretty.js:502380, :743886 | 2 / **0** |
| `CLAUDE_REMOTE_WORKFLOW_SCRIPT` / `_ARGS` | cli_inner_pretty.js:386785-386786, :502335, :502344 | 4 / **0** |
| `tengu_workflow_launch_event` | cli_inner_pretty.js:502483, :502581 | 2 / **0** |
| `workflow_event_launch` counter | cli_inner_pretty.js:502486, :502544, :502582 | 3 / **0** |
| `cli_stdin_workflow_launch_dropped` | cli_inner_pretty.js:840710 | 1 / **0** |
| `cli_sse_workflow_launch_event_type_mismatch` | cli_inner_pretty.js:416597 | 1 / **0** |
| `workflow_launch_exec_no_slot` | cli_inner_pretty.js:502618 | 1 / **0** |
| `workflow_launch_result_post_failed` | cli_inner_pretty.js:502635 | 1 / **0** |
| `diagnostics never outrank the result payload` | cli_inner_pretty.js:502285 | 1 / **0** |
| carrier handler wiring (`fetchBundle`, `isRemoteTransport`, …) | cli_inner_pretty.js:849008-849025 | 1 / **0** |
| `tengu_workflow_launched` second emission site | cli_inner_pretty.js:502231 | 220=2 / 193=1 |
