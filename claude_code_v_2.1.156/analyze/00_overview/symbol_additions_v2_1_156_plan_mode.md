# Symbol Additions — v2.1.156 Plan Mode + AskUserQuestion (12_plan_mode + 04_tools delta)

> **Document type:** This is a symbol-index *staging* document (lives in `00_overview/`). Its rows
> are destined to be merged into the central `symbol_index_*.md` files, so the all-table format here
> is intentional — the CLAUDE.md "no symbol-mapping tables in module docs" rule applies only to the
> `XX_module/` module docs and is out of scope for this index-merge file.

These mappings consolidate every obfuscated identifier referenced across the six freshly-written
plan-mode / AskUserQuestion area docs for the v2.1.156 build:

- `04_tools/ask_user_question_tool.md`
- `12_plan_mode/enter_plan_mode_tool.md`
- `12_plan_mode/exit_plan_mode_tool.md`
- `12_plan_mode/runtime_mechanism.md`
- `12_plan_mode/ui_and_approval_flow.md`
- `12_plan_mode/remote_and_ultraplan.md`

Each row gives the v2.1.156 obfuscated identifier, the readable name, `file:line`, and type. Every
line was verified by reading
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` at that location
before it was added here.

Cross-validated against:
- v2.1.156 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/tools/EnterPlanModeTool/`,
  `tools/ExitPlanModeTool/`, `tools/AskUserQuestionTool/`, `utils/plans.ts`,
  `utils/planModeV2.ts`, `utils/ultraplan/ccrSession.ts`
- v2.1.142 docs (format/structure only): `claude_code_v_2.1.142/analyze/12_plan_mode/`

> **Notes on overlap (single source of truth):**
> - Tool-name string constants `og` (`"EnterPlanMode"`), `oG`/`wv` (`"ExitPlanMode"`),
>   `ez` (`"AskUserQuestion"`) all sit in one declaration block at 143385-143388. `ez` already
>   lives in `symbol_index_core_execution.md` (Tools — AskUserQuestion); `og`/`oG`/`wv` are added
>   to `symbol_index_core_features.md` (Plan).
> - The AskUserQuestion constant block (`BUK`, `FUK`, `pUK`, `UUK`, `xM6`, `YtH`) and the tool
>   factory/defaults (`yK`, `P45`, `T6`, `HK`) are **already** in `symbol_index_core_execution.md`
>   — they are NOT re-added; only the *new* AskUserQuestion schema/dialog/result symbols are merged.
> - `R6` (`isNonInteractive`) and `uw` (`getAllowedChannels`) are the two `isEnabled`-gate
>   predicates shared by EnterPlanMode/ExitPlanMode/AskUserQuestion. The tools-subsystem additions
>   note assigns them to `symbol_index_infra_platform.md`; they are merged there (not yet in any
>   table). `wC$` (`getQuestionPreviewFormat`) likewise → platform.
> - `vl`/`xhH`/`nY`/`t1H`/`ChH`/`Vyz`/`VT` and the permission-mode metadata (`st`/`xEq`/`ZF$`) are
>   permission/model-engine symbols → `symbol_index_infra_platform.md`.

---

## Module: Plan Mode — Tools (EnterPlanMode / ExitPlanMode)

The two plan-mode tool objects, their names/schemas/prompts, the typed permission descriptors, the
UI renderers, and the on-disk plan helpers.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$$4` | EXIT_PLAN_MODE_V2_TOOL_PROMPT (the model-facing "you are in plan mode and finished writing your plan" prompt) | cli_inner_pretty.js:349781 | constant |
| `aH4` | renderEnterPlanModeToolUse (EnterPlanMode `renderToolUseMessage` → `null`; the invocation is silent) | cli_inner_pretty.js:349655 | function |
| `bGf` | exitPlanModeSdkInputSchema (`M$4.extend({plan?,planFilePath?})` — the runtime-injected fields documented as SDK-only) | cli_inner_pretty.js:350000 | function |
| `BM` | definePermissionDescriptor (identity registrar `BM(H){return H}` for typed permission kinds) | cli_inner_pretty.js:215037 | function |
| `CL_` | exitPlanModeOutputSchema (7-field output: `plan?`/`isAgent`/`filePath?`/`hasTaskTool?`/`planWasEdited?`/`awaitingLeaderApproval?`/`requestId?`) | cli_inner_pretty.js:350006 | function |
| `dH4` | normalizeExitPlanModeToolInput (injects `plan`/`planFilePath`/`allowedPrompts`/`usage` from disk before `call`) | cli_inner_pretty.js:349140 | function |
| `ftH` | permissionExitPlanModeV2Descriptor (`permission_exit_plan_mode_v2`; payload REQUIRES `plan`; default `cancelled`) | cli_inner_pretty.js:349453 | object |
| `GL_` | getEnterPlanModeToolPromptExternal (full proactive-use prompt: When-To-Use / When-NOT / What-Happens / Examples / Notes) | cli_inner_pretty.js:349566 | function |
| `hL8` | EnterPlanModeTool (the `buildTool` descriptor; `name:og`, zero-param `strictObject({})`, `shouldDefer`, read-only) | cli_inner_pretty.js:349703 | object |
| `IL_` | allowedPromptSchema (`z.object({tool:enum(['Bash']),prompt:string})` — a single prompt-based permission item) | cli_inner_pretty.js:349982 | function |
| `JC` | ExitPlanModeV2Tool (the `buildTool` descriptor; `name:wv`, disk-read plan, teammate/main fork) | cli_inner_pretty.js:350025 | object |
| `K$4` | renderExitPlanModeToolUse (ExitPlanMode `renderToolUseMessage` → `null`) | cli_inner_pretty.js:349840 | function |
| `K0$` | permissionEnterPlanModeDescriptor (`permission_enter_plan_mode`; payload `requestId`/`toolName`/`permissionResult`, NO `plan`) | cli_inner_pretty.js:349442 | object |
| `M$4` | exitPlanModeInputSchema (`strictObject({allowedPrompts?}).passthrough()` — passthrough lets disk-injection graft `plan`) | cli_inner_pretty.js:349988 | function |
| `rH4` | getEnterPlanModeToolPrompt (thin `prompt()` wrapper returning `GL_()`) | cli_inner_pretty.js:349644 | function |
| `RL8` | RejectedPlanMessage ("User rejected Claude's plan:" inside a `planMode`-bordered box) | cli_inner_pretty.js:349805 | function |
| `sH4` | renderEnterPlanModeResult ("Entered plan mode" + dim "Claude is now exploring…" subtitle) | cli_inner_pretty.js:349658 | function |
| `tH4` | renderEnterPlanModeRejected ("User declined to enter plan mode", default-mode color) | cli_inner_pretty.js:349675 | function |
| `TL_` | enterPlanModeInputSchema (`z.strictObject({})` — parameterless, extra keys rejected) | cli_inner_pretty.js:349701 | function |
| `VL_` | enterPlanModeOutputSchema (`z.object({message:string})`) | cli_inner_pretty.js:349702 | function |
| `z$4` | renderExitPlanModeRejected (rejected-message wrapper; resolves `plan ?? getPlan() ?? "No plan found"` → `RL8`) | cli_inner_pretty.js:349901 | function |
| `ZL_` | buildWhatHappensSection (What-Happens builder w/ `find`/`grep` shell-alias branch gated on interactive entrypoint + bash) | cli_inner_pretty.js:349553 | function |
| `_$4` | renderExitPlanModeResult (3-state result: empty "Exited plan mode" / awaiting-lead / "User approved Claude's plan") | cli_inner_pretty.js:349843 | function |

---

## Module: Plan Mode — Runtime / State / Naming

The plan-mode session-state flag cluster, the boundary-crossing toggle, the seeded plan-slug
algorithm, the on-disk plan path/recovery helpers, the per-turn reminder cadence + builders, and
the reminder text constants.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AG4` | getExploreAgentCount (Phase-1 Explore subagent cap; default 3, env `CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT` clamped 1-10) | cli_inner_pretty.js:443680 | function |
| `b$9` | isPlanFileForCurrentSession (path test: `{plansDir}/{slug}` prefix + `.md`; session-scoped via slug cache) | cli_inner_pretty.js:549461 | function |
| `bJz` | findFileSnapshot (locates a `"plan"`-keyed `file_snapshot` transcript entry for remote resume recovery) | cli_inner_pretty.js:549333 | function |
| `bQ_` | renderFullPlanModeReminder (custom-body OR default 5-phase workflow, always wrapped by preamble + footer) | cli_inner_pretty.js:445324 | function |
| `CJz` | recoverPlanFromHistory (scans message history for ExitPlanMode `input.plan` / user `planContent` / `plan_file_reference`) | cli_inner_pretty.js:549305 | function |
| `CL8` | persistFileSnapshotIfRemote (records the plan file into the transcript as a `file_snapshot`; remote-only, gated on `D68`) | cli_inner_pretty.js:549341 | function |
| `CQ_` | PLAN_MODE_PHASE4_FINAL_PLAN (the "### Phase 4: Final Plan" reminder block) | cli_inner_pretty.js:446477 | constant |
| `DV` | getPlan (reads the plan file via `readFileSync`; `null` on ENOENT) | cli_inner_pretty.js:549253 | function |
| `eS_` | buildPlanModeAttachment (per-turn plan reminder w/ throttle + re-entry + full/sparse selection; sets `customInstructions`) | cli_inner_pretty.js:412847 | function |
| `fw4` | buildPlanModeExitAttachment (emits the one-shot `plan_mode_exit` attachment when the exit flag is set) | cli_inner_pretty.js:412871 | function |
| `Gt` | setNeedsPlanModeExitAttachment (setter for `d$.needsPlanModeExitAttachment`) | cli_inner_pretty.js:3044 | function |
| `HW8` | copyPlanForResume (restores slug from transcript, reads plan, recovers from snapshot/history if remote) | cli_inner_pretty.js:549265 | function |
| `IJz` | MAX_SLUG_RETRIES (`10` — declared at 549367 as `IJz = 10`; `existsSync` collision-avoidance loop bound, used at 549230; unchanged from v2.1.88) | cli_inner_pretty.js:549367 | constant |
| `ILH` | getPlanSlug (seeded, collision-avoiding plan slug; NEW seed param threads the user prompt) | cli_inner_pretty.js:549223 | function |
| `IQ_` | renderPlanModeReminder (dispatch: sub-agent → `uQ_`, sparse → `xQ_`, else full → `bQ_`) | cli_inner_pretty.js:445313 | function |
| `jG4` | PLAN_MODE_READONLY_PREAMBLE ("you MUST NOT make any edits (except the plan file)… supercedes any other instructions") | cli_inner_pretty.js:446485 | constant |
| `lg6` | PLAN_MODE_CADENCE (`{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}`) | cli_inner_pretty.js:414015 | object |
| `m7$` | hasExitedPlanModeInSession (getter for `d$.hasExitedPlanMode`) | cli_inner_pretty.js:3035 | function |
| `MM6` | slugifyPromptSeed (first 4 words, lowercase, dash-collapse, 40-char cap; NEW in 2.1.156) | cli_inner_pretty.js:141346 | function |
| `ng6` | countTurnsSincePlanAttachment (scans back for the most recent `plan_mode` attachment → `{turnCount, foundPlanModeAttachment}`) | cli_inner_pretty.js:412820 | function |
| `nM` | getPlansDirectory (memoized; resolves `plansDirectory` vs project root, falls back to `~/.claude/plans`, `mkdirSync`) | cli_inner_pretty.js:549382 | function |
| `Rm8` | needsPlanModeExitAttachment (getter for `d$.needsPlanModeExitAttachment`) | cli_inner_pretty.js:3041 | function |
| `sA8` | buildPlanModeFullAttachment (always-full attachment builder; spreads `customInstructions` only when defined) | cli_inner_pretty.js:423732 | function |
| `tS_` | countPlanModeAttachments (counts `plan_mode` attachments since the last `plan_mode_exit`; drives full/sparse modulo) | cli_inner_pretty.js:412836 | function |
| `Tt` | updatePlanModeExitAttachmentFlag (boundary-crossing toggle: set exit flag on plan entry, clear on plan exit) | cli_inner_pretty.js:3047 | function |
| `uQ_` | renderSubagentPlanModeReminder (strictest sub-agent variant; no custom-body override) | cli_inner_pretty.js:445416 | function |
| `wG4` | buildExitPlanModeFooter (terminal-call contract: end turn only via AskUserQuestion or ExitPlanMode) | cli_inner_pretty.js:445318 | function |
| `wgH` | generateTwoWordSuffix (`adjective-noun` disambiguation suffix appended to a seeded slug; NEW in 2.1.156) | cli_inner_pretty.js:141358 | function |
| `wV` | getPlanFilePath (`{plansDir}/{slug}.md` or `{slug}-agent-{agentId}.md`) | cli_inner_pretty.js:549248 | function |
| `xQ_` | renderSparsePlanModeReminder (one-line nudge between full reminders; adapts to custom instructions) | cli_inner_pretty.js:445411 | function |
| `y88` | generateWordSlug (legacy `adjective-adjective-noun` random slug; fallback when no seed) | cli_inner_pretty.js:141340 | function |
| `zG4` | getPlanAgentCount (Phase-2 Plan subagent cap; tier-scaled 1/3 + env `CLAUDE_CODE_PLAN_V2_AGENT_COUNT`) | cli_inner_pretty.js:443669 | function |
| `zQ` | setHasExitedPlanMode (setter for `d$.hasExitedPlanMode`) | cli_inner_pretty.js:3038 | function |

---

## Module: Plan Mode — UI / Approval Dialog / `/plan`

The ExitPlanMode approval dialog, the option-list builder, the choice→PermissionResult mapping, the
permission-update assembler, the mode-chip config + accessors, and the `/plan` command. (The
Shift+Tab permission-mode cycle — `QCH`/`PR8`/`c19`/`uV`/`i4q` — is shared across all permission
modes and is merged into `symbol_index_infra_platform.md` Mode / Consent UI Surface, where
`QCH`/`PR8`/`ym` already lived.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ayz` | exitPlanModeAnswerComponent (wires `mA9` into the permission-request dispatch table) | cli_inner_pretty.js:598471 | function |
| `c19` | cyclePermissionMode (`{nextMode, context}`; adds a `trigger` arg vs v2.1.88) → platform | cli_inner_pretty.js:578731 | function |
| `dg4` | planCommandModule (`/plan` module export `{call: () => v5z}`) | cli_inner_pretty.js:513488 | object |
| `Gkz` | buildPlanApprovalOptions ("Ready to code?" variable-arity option list; bypass > auto > edits priority) | cli_inner_pretty.js:589794 | function |
| `i4q` | isAutoModeOptInDismissed (source `Boolean(b$().autoModeOptInDismissed) && !K$$()`, read as `config.autoModeOptInDismissed && !override` where `b$()`=config getter and `K$$()`=override predicate; shared by cycle + dialog) → platform | cli_inner_pretty.js:578709 | function |
| `i9q` | buildPlanExitPermissionUpdates (`[setMode]` + gated classifier `addRules`; `allowedPrompts` no-op via `jwH`) | cli_inner_pretty.js:589766 | function |
| `JaK` | SHIFT_TAB_KEY (source `kO5 ? "shift+tab" : "meta+m"`, i.e. `canDeliverShiftTab ? "shift+tab" : "meta+m"` where `kO5`=canDeliverShiftTab; bound to `chat:cycleMode`/`confirm:cycleMode`) | cli_inner_pretty.js:170200 | constant |
| `jwH` | isPromptBasedPermissionsEnabled (hardcoded `return !1` in this build — `allowedPrompts→addRules` is a no-op) | cli_inner_pretty.js:209900 | function |
| `k5z` | planCommandDef (`/plan` command definition object) | cli_inner_pretty.js:513585 | object |
| `mA9` | ExitPlanModePermissionRequest (the approval dialog; empty "Exit plan mode?" vs full "Ready to code?" branch) | cli_inner_pretty.js:589878 | function |
| `n3H` | getModeSymbol (mode → chip symbol) | cli_inner_pretty.js:49215 | function |
| `PR8` | canCycleToAuto (three-signal auto eligibility: cached availability + live gate + `!dismissed`) → platform (already present) | cli_inner_pretty.js:578696 | function |
| `QCH` | getNextPermissionMode / cycleNextMode (shift+tab cycle order; ant branch removed) → platform (already present) | cli_inner_pretty.js:578712 | function |
| `tt` | getModeTitle (mode → chip title) | cli_inner_pretty.js:49203 | function |
| `tV` | getModeColor (mode → theme color via `getModeConfig(mode).color`) | cli_inner_pretty.js:49218 | function |
| `uV` | handleCycleMode (`chat:cycleMode` action handler; teammate branch, 800ms auto opt-in hold, remote path) → platform | cli_inner_pretty.js:585344 | function |
| `V5z` | PlanDisplay (`/plan` current-plan render with "/plan open to edit" hint) | cli_inner_pretty.js:513490 | function |
| `v5z` | planCommandCall (`/plan` handler; three-way state behavior + new ccr remote short-circuit) | cli_inner_pretty.js:513519 | function |
| `Vkz` | renderAllowedPrompt ("Requested permissions:" row in the approval dialog) | cli_inner_pretty.js:590476 | function |
| `WF$` | getModeConfig (mode config lookup with `default` fallback) | cli_inner_pretty.js:49194 | function |
| `xEq` | PERMISSION_MODE_METADATA (per-mode chip `{title,shortTitle,symbol,color,external}`; plan entry at 49230) | cli_inner_pretty.js:49228 | object |
| `XF$` | PAUSE_ICON (`"⏸"` U+23F8 — the plan-mode chip symbol; only mode-unique glyph) | cli_inner_pretty.js:49136 | constant |
| `z97` | formatPromptRule (`"prompt: <prompt>"` rule-content formatter for the gated allowedPrompts path) | cli_inner_pretty.js:209897 | function |
| `Zkz` | autoNameSessionFromPlan (fire-and-forget session auto-naming from the plan's first 1000 chars) | cli_inner_pretty.js:589777 | function |
| `_I8` | getApprovalResult (pure choice→PermissionResult mapping, extracted from the React handler) | cli_inner_pretty.js:589839 | function |

---

## Module: Plan Mode — Remote / Ultraplan (CCR teleport)

The remote-plan scanner/poller, the `## Approved Plan:` + teleport-sentinel marker contract, the
three remote-planning reminder variants + registry, the enable gate, and the slash command.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B4z` | extractApprovedPlan (scrapes `## Approved Plan:` / `(edited by user)` out of the tool_result; throws on missing marker) | cli_inner_pretty.js:503257 | function |
| `c4z` | ULTRAPLAN_UI_METADATA (per-variant UI metadata incl. advertised cost) | cli_inner_pretty.js:503750 | object |
| `cqH` | isUltraplanEnabled (three-way gate: server config + bridge entitlement + interactive context) | cli_inner_pretty.js:503294 | function |
| `dqH` | UltraplanPollError (error subclass carrying `reason`, `rejectCount`, and NEW `eventStats`) | cli_inner_pretty.js:503281 | class |
| `EU4` | contentToText (normalizes a tool_result `content` string/array into one text string) | cli_inner_pretty.js:503246 | function |
| `FN8` | getUltraplanPromptIdentifier (server-config variant selection; falls back to `simple_plan`) | cli_inner_pretty.js:503388 | function |
| `hU4` | REMOTE_PLAN_REMINDER_SIMPLE (the `simple_plan` lightweight default remote-planning reminder) | cli_inner_pretty.js:503302 | function |
| `i4z` | runUltraplanPoll (async driver; forks on `executionTarget` remote vs local teleport) | cli_inner_pretty.js:503405 | function |
| `IU4` | DEFAULT_ULTRAPLAN_PROMPT_ID (`"simple_plan"`) | cli_inner_pretty.js:503686 | constant |
| `kU4` | ExitPlanModeScanner (pure stateful CCR-event classifier; approved>terminated>rejected>pending precedence) | cli_inner_pretty.js:503139 | class |
| `m4z` | extractTeleportPlan (scrapes the `__ULTRAPLAN_TELEPORT_LOCAL__` sentinel; `null` when absent) | cli_inner_pretty.js:503249 | function |
| `n4z` | buildUltraplanPromptText (assembles the remote-planning reminder text for the selected variant) | cli_inner_pretty.js:503398 | function |
| `NU4` | pollForApprovedExitPlanMode (deadline-bounded poll loop; 3s interval, 5 consecutive-failure cap) | cli_inner_pretty.js:503190 | function |
| `Q4z` | getUltraplanTimeoutMs (poll deadline in ms) | cli_inner_pretty.js:503379 | function |
| `RU4` | REMOTE_PLAN_REMINDER_MULTIAGENT (the `three_subagents_with_critique` multi-agent + critique remote reminder) | cli_inner_pretty.js:503347 | function |
| `se6` | ULTRAPLAN_PROMPT_REGISTRY (`{simple_plan, visual_plan, three_subagents_with_critique}`) | cli_inner_pretty.js:503738 | object |
| `SU4` | REMOTE_PLAN_REMINDER_VISUAL (the `visual_plan` diagram-forward remote-planning reminder) | cli_inner_pretty.js:503323 | function |
| `t4z` | ultraplanSlashCommandCall (`/ultraplan <prompt>` handler; double-gated, single-flight, empty-arg fork) | cli_inner_pretty.js:503690 | function |
| `u4z` | ULTRAPLAN_TELEPORT_SENTINEL (`"__ULTRAPLAN_TELEPORT_LOCAL__"`) | cli_inner_pretty.js:503276 | constant |
| `vU4` | POLL_INTERVAL_MS (`3000`) | cli_inner_pretty.js:503273 | constant |
| `x4z` | MAX_CONSECUTIVE_FAILURES (`5` — consecutive transient-failure cap, reset on success) | cli_inner_pretty.js:503274 | constant |
| `xU4` | ultraplanSlashCommand (`/ultraplan` command def; `isEnabled` = `isUltraplanEnabled`) | cli_inner_pretty.js:503765 | object |

---

## Module: AskUserQuestion — Schemas / Dialog / Result Mapping / Re-Surfacing

The AskUserQuestion schema graph, the runtime permission dialog and its three outcome handlers, the
result-render component + notes-only sentinel, and the safety-classifier transcript re-surfacing
producer. (The constant block `BUK`/`FUK`/`pUK`/`UUK`/`xM6`, the tool object `YtH`, and the name
`ez` already live in `symbol_index_core_execution.md`.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AL_` | questionOptionSchema (`{label, description, preview?}`) | cli_inner_pretty.js:348698 | function |
| `aY9` | questionUsesPreview (single-select-with-preview predicate gating text-input note capture) | cli_inner_pretty.js:594564 | function |
| `bH4` | annotationsSchema (`record(string, {preview?, notes?})` keyed by question text) | cli_inner_pretty.js:348745 | function |
| `BNz` | buildAcceptedAnswer (accept handler; builds annotations from selected preview + notes, returns allow + contentBlocks) | cli_inner_pretty.js:594528 | function |
| `Bu6` | NO_OPTION_SELECTED_SENTINEL (`"(notes only)"` — encodes "no option selected, notes present" in the string-typed answers record) | cli_inner_pretty.js:348683 | constant |
| `CE7` | collectClassifierTranscript (re-surfaces AskUserQuestion answers as `[User answered AskUserQuestion]:` user-role text) | cli_inner_pretty.js:277149 | function |
| `CH4` | questionSchema (`{question, header, options[2..4], multiSelect=false}`) | cli_inner_pretty.js:348718 | function |
| `DL_` | validateHtmlPreview (lightweight 3-regex HTML-fragment intent check; full-doc / `<script>`/`<style>` / non-HTML) | cli_inner_pretty.js:348663 | function |
| `fL_` | commonFields (hidden `answers`/`annotations`/`metadata.source` fields the model normally doesn't fill) | cli_inner_pretty.js:348775 | function |
| `INz` | AskUserQuestionDialog (permission dialog; reject / respond-to-claude / accept outcomes + `isInPlanMode`) | cli_inner_pretty.js:594187 | function |
| `jL_` | AskUserQuestionResultMessage (result-render component) | cli_inner_pretty.js:348633 | function |
| `ML_` | outputSchema (`{questions, answers:record(string,string), annotations}`) | cli_inner_pretty.js:348798 | function |
| `OL_` | inputSchema (`strictObject{questions[1..4], ...commonFields}.refine(RH4)`) | cli_inner_pretty.js:348790 | function |
| `pNz` | buildRespondToClaudeFeedback (respond-to-claude handler; deny-with-feedback meta-prompt to reformulate) | cli_inner_pretty.js:594541 | function |
| `RH4` | UNIQUENESS_REFINE (rejects duplicate question texts / duplicate option labels within a question) | cli_inner_pretty.js:348760 | object |
| `sY9` | buildImageBlocks (assembles pasted-image content blocks for accept/respond results) | cli_inner_pretty.js:594567 | function |
| `UNz` | formatQuestionsForFeedback (renders each question + current answer + notes for the respond-to-claude feedback) | cli_inner_pretty.js:594553 | function |
| `wL_` | renderAnswerRow (per-question result row inside `jL_`) | cli_inner_pretty.js:348659 | function |
| `xNz` | getPermissionMode (reads `toolPermissionContext.mode`; drives `isInPlanMode`) | cli_inner_pretty.js:594519 | function |
| `YL_` | answerValueSchema (`z.preprocess` joining multi-select `string[]` into one comma-separated string; NEW in 2.1.156) | cli_inner_pretty.js:348772 | function |

---

## Module: Shared Permission / Model Engine (used by plan mode) → infra_platform

Permission-mode metadata + transitions, the write floor, the resume reconciler, and the opusplan
model switch. (`T6`/`computeEffectivePermissionContext` already in `symbol_index_core_execution.md`.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ah$` | buildWritePermissionSuggestions (setMode suggestions appended to a write `ask`) | cli_inner_pretty.js:549891 | function |
| `ChH` | checkWritePermissionForTool (THE plan-mode write floor; deny→…→safety→plan-floor→acceptEdits/workingDir) | cli_inner_pretty.js:549806 | function |
| `D68` | getRemoteEnvironmentKind (reads `CLAUDE_CODE_ENVIRONMENT_KIND` → `byoc`/`anthropic_cloud`/`null`) | cli_inner_pretty.js:145406 | function |
| `dtH` | hasBridgeEntitlement (CCR bridge gate: account predicate + second predicate + `tengu_ccr_bridge` flag) | cli_inner_pretty.js:372224 | function |
| `gv6` | getPromptSuggestionBlockReason (returns `"plan_mode"` to suppress prompt suggestions while planning) | cli_inner_pretty.js:240792 | function |
| `he` | getModelOverride (reads the configured model alias, e.g. `opusplan`/`haiku`) | cli_inner_pretty.js:98701 | function |
| `NN` | getSonnetModel (the Sonnet model id; returned by `VT` under the `haiku` alias in plan mode) | cli_inner_pretty.js:98726 | function |
| `nY` | applyPermissionUpdate (the `setMode`/`addRules`/… updater; bypassPermissions-availability guard) | cli_inner_pretty.js:210027 | function |
| `R6` | isNonInteractive (`!d$.isInteractive`; second half of the EnterPlanMode/ExitPlanMode/AskUserQuestion `isEnabled` gate) | cli_inner_pretty.js:2742 | function |
| `sN` | applyPermissionUpdates (applies an array of permission updates to a context) | cli_inner_pretty.js:210088 | function |
| `st` | EXTERNAL_PERMISSION_MODES (`["acceptEdits","auto","bypassPermissions","default","dontAsk","plan"]`) | cli_inner_pretty.js:49174 | variable |
| `t1H` | recordPermissionModeChanged (`permission_mode_changed` OTEL telemetry; no-op when `from===to`) | cli_inner_pretty.js:222562 | function |
| `TT` | getOpusModel (the Opus model id; returned by `VT` for `opusplan` plan mode under 200k tokens) | cli_inner_pretty.js:98720 | function |
| `uE6` | filterToolsByPermissionMode (keeps ExitPlanMode available in plan mode even while writes are floored) | cli_inner_pretty.js:278956 | function |
| `uw` | getAllowedChannels (returns `d$.allowedChannels` — the `--channels` allowlist; first half of the `isEnabled` gate) | cli_inner_pretty.js:3217 | function |
| `vl` | transitionPermissionMode (the single mode-transition funnel; telemetry, flags, `prePlanMode` capture/clear, auto-gate throw) | cli_inner_pretty.js:442777 | function |
| `VT` | getMainLoopModelForPermissionMode (opusplan→Opus / haiku→Sonnet plan-mode model switch; `!exceeds200kTokens` guard) | cli_inner_pretty.js:98735 | function |
| `Vyz` | reconcileRestoredPermissionMode (resume reconciler; `plan` and `bypassPermissions` are deliberately dropped) | cli_inner_pretty.js:598936 | function |
| `wC$` | getQuestionPreviewFormat (getter for `d$.questionPreviewFormat` (markdown\|html\|undefined); drives AskUserQuestion preview prompt + HTML validation) | cli_inner_pretty.js:2829 | function |
| `WlH` | checkInternalEditablePath (internal-editable exemption: plan file / workflow / scratchpad / bg-tmp / memory / wiki) | cli_inner_pretty.js:549939 | function |
| `WY$` | describeModelAlias (surfaces "Opus in plan mode, else Sonnet" to the UI) | cli_inner_pretty.js:98797 | function |
| `xhH` | prepareContextForPlanMode (captures `prePlanMode` + auto-mode side effects; must run before `setMode`) | cli_inner_pretty.js:443097 | function |
| `ZF$` | getModeDefaultBehavior (mode → allow/ask/deny/classify; the `plan && context` allow branch) | cli_inner_pretty.js:49209 | function |

---

## Notes on home-index placement (single source of truth)

When these rows are merged into the central indexes, split them as follows:

- **`symbol_index_core_features.md`** (Plan module) — the *Plan Mode* tools/runtime/UI/remote
  sections: EnterPlanMode/ExitPlanMode tools + schemas + descriptors + renderers + plan helpers
  (incl. the tool-name constants `og`/`oG`/`wv`), the runtime/state/naming cluster, the
  UI/approval dialog + `/plan` command, and the remote/ultraplan family. **Excluded** (filed in
  platform instead): the Shift+Tab cycle (`QCH`/`PR8`/`c19`/`uV`/`i4q`) and the mode-chip metadata
  + accessors (`xEq`/`WF$`/`tV`/`tt`/`n3H`/`Yi`/`XF$`), which are shared across all permission modes.
- **`symbol_index_core_execution.md`** (Tools — AskUserQuestion) — the *AskUserQuestion* section
  rows (schemas `AL_`/`CH4`/`bH4`/`RH4`/`YL_`/`fL_`/`OL_`/`ML_`, dialog `INz`/`BNz`/`pNz`/`UNz`/
  `aY9`/`xNz`/`sY9`, result `jL_`/`wL_`/`DL_`/`Bu6`, re-surfacing `CE7`). The constant block and
  tool object already live there — not re-added.
- **`symbol_index_infra_platform.md`** — the *Plan-Mode Engine* permission rows (`ChH`, `WlH`,
  `Ah$`, `vl`, `xhH`, `nY`, `sN`, `Vyz`, `st`, `ZF$`, `t1H`, `uE6`, `gv6`, the gate predicates
  `R6`/`uw`/`wC$`, the remote env/bridge `D68`/`dtH`); the opusplan switch (`he`/`VT`/`WY$` into
  Model Selection; `TT`/`NN` already present there); and the Mode / Consent UI Surface additions
  (the cycle `c19`/`uV`/`i4q` — `QCH`/`PR8`/`ym` already present — plus the mode-chip metadata
  `xEq`/`WF$`/`tV`/`tt`/`n3H`/`Yi`/`XF$`).
