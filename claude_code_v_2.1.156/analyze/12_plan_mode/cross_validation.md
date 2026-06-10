# Plan Mode + AskUserQuestion: Consolidated Cross-Validation (v2.1.88 ↔ v2.1.156)

> **Purpose.** This document consolidates the per-area cross-validation subsections of the six
> v2.1.156 plan-mode analysis docs into one behavioral diff between the v2.1.88 unobfuscated
> TypeScript precursor and the v2.1.156 obfuscated bundle. It is organized **by subsystem**
> (EnterPlanMode, ExitPlanMode, plan runtime/state, plan-file naming, the write floor, UI/approval,
> AskUserQuestion, remote/Ultraplan) and ends with an overall confidence assessment.
>
> **Sources of truth (every row was re-grounded in both trees before it was written):**
> - **v2.1.156 canonical bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
>   (cited as `cli_inner_pretty.js:<line>`; line numbers verified by reading the region).
> - **v2.1.88 readable precursor:** `/lyz/codespace/3rd/claude-code/src/tools/{EnterPlanModeTool,ExitPlanModeTool,AskUserQuestionTool}/`
>   and `/lyz/codespace/3rd/claude-code/src/utils/{plans.ts,planModeV2.ts,permissions/getNextPermissionMode.ts,ultraplan/}`.
> - **Area docs consolidated here** (each holds the deep §-level analysis behind these rows):
>   [`../04_tools/ask_user_question_tool.md`](../04_tools/ask_user_question_tool.md),
>   [`enter_plan_mode_tool.md`](./enter_plan_mode_tool.md),
>   [`exit_plan_mode_tool.md`](./exit_plan_mode_tool.md),
>   [`runtime_mechanism.md`](./runtime_mechanism.md),
>   [`ui_and_approval_flow.md`](./ui_and_approval_flow.md),
>   [`remote_and_ultraplan.md`](./remote_and_ultraplan.md).
>
> **Status vocabulary** (used in every table):
> - **IDENTICAL** — Same behavior; bodies match 1:1 modulo obfuscation renames (and inlined `feature()` flags).
> - **REFACTOR** — Same observable effect; the code shape changed (narrower setter, extracted pure fn, lazy import).
> - **CHANGED** — Behavior or output text genuinely differs between the two builds.
> - **REMOVED** — A v2.1.88 branch/flag is gone in v2.1.156 (collapsed to one always-on path).
> - **NEW** — A capability with no v2.1.88 counterpart.

---

## 0. Executive summary — the genuinely-new post-2.1.88 deltas

Across all eight subsystems, the v2.1.156 plan-mode + AskUserQuestion code is **structurally faithful**
to the v2.1.88 precursor. The deltas cluster into four themes:

1. **Tool split (EnterPlanMode becomes its own tool).** In v2.1.88, `ENTER_PLAN_MODE_TOOL_NAME`
   already existed, but the AskUserQuestion plan-mode note referenced only `ExitPlanMode` for *both*
   "you are in plan mode" context and approval. v2.1.156 has two distinct name constants (`og` /
   `oG`) and the AskUserQuestion note now routes plan **entry** to `EnterPlanMode` and plan
   **approval** to `ExitPlanMode` — naming the two transitions independently.
2. **Systematic de-flagging.** `feature('KAIROS')`/`KAIROS_CHANNELS')`, `feature('TRANSCRIPT_CLASSIFIER')`,
   `isPlanModeInterviewPhaseEnabled()`, and `USER_TYPE === 'ant'` are all **gone** (0 grep hits in the
   bundle for the plan-mode ones). The guards they protected either collapsed to one always-on path or
   were re-expressed as intrinsic capability checks (`isNonInteractive()`, live auto-gate).
3. **AskUserQuestion narrowing + multi-select normalization + notes-only state.** The base prompt was
   tightened (dropped the 4-item "this allows you to" checklist; reframed the opener to discourage
   over-asking), a `z.preprocess` now comma-joins multi-select arrays at the schema boundary, and a
   `"(notes only)"` sentinel models "user typed notes, picked no option."
4. **Plan-file discoverability + remote Ultraplan orchestration.** Plan filenames are now seeded from
   the user's prompt (`add-user-auth-bright-otter.md`), and an entire remote-planning subsystem
   (Ultraplan poller/scanner/teleport) plus customizable reminder bodies (`--plan-mode-instructions`)
   were added.

A handful of smaller behavioral flips: the EnterPlanMode What-Happens section gained a `find`/`grep`
shell-alias branch; the approval-dialog elevated "Yes" priority flipped from **auto > bypass** to
**bypass > auto**; the `/plan` command gained a CCR remote short-circuit; and the ExitPlanMode
out-of-plan error message changed text to name `EnterPlanMode` as the recovery action.

---

## 1. EnterPlanMode tool

> Deep analysis: [`enter_plan_mode_tool.md`](./enter_plan_mode_tool.md) §2–§12.
> Tool object `EnterPlanModeTool` (`hL8`, `cli_inner_pretty.js:349703-349766`); name `og = "EnterPlanMode"` (`143385`).

| Aspect | v2.1.88 (`tools/EnterPlanModeTool/`) | v2.1.156 (`cli_inner_pretty.js`) | Status |
|---|---|---|---|
| Tool name | `ENTER_PLAN_MODE_TOOL_NAME = "EnterPlanMode"` (`constants.ts:1`) | `og = "EnterPlanMode"` (`143385`) | IDENTICAL |
| Input schema | `z.strictObject({})` (`EnterPlanModeTool.ts:21-25`) | `TL_ = z.strictObject({})` (`349701`) | IDENTICAL |
| Output schema | `{ message: string }` (`:27-32`) | `VL_ = { message: string }` (`349702`) | IDENTICAL |
| `userFacingName` / `shouldDefer` / `isConcurrencySafe` / `isReadOnly` | `""` / `true` / `true` / `true` | same (`349719-349730`) | IDENTICAL |
| Subagent guard | `if (context.agentId) throw …"agent contexts"` (`:78-80`) | `if ($.agentId) throw …` (`349737`) — same message | IDENTICAL |
| `call` lifecycle | transition → `prepareContextForPlanMode` → setMode `plan` session-scoped (`:82-101`) | `Tt(...)` → `xhH(...)` → `nY(..., setMode plan)` (`349739-349746`) | IDENTICAL (effect) |
| `call` state setter | `context.setAppState(prev => ({...prev, toolPermissionContext: ...}))` (`:88-94`) | `context.setToolPermissionContext(prev => …)` (`349740`) | REFACTOR (narrower setter) |
| Current-mode read | `appState.toolPermissionContext.mode` (`:83`) | `getToolPermissionContext(context).mode` (`T6`, `349739`) | REFACTOR (layer-folding accessor; `mode` unaffected) |
| **`isEnabled` gate** (shared body with ExitPlanMode/AskUserQuestion) | `(feature('KAIROS')\|\|feature('KAIROS_CHANNELS')) && getAllowedChannels().length>0` (`:60-65`) | disabled when `getAllowedChannels().length>0 && isNonInteractive()`, else enabled — `if(uw().length>0 && R6()) return !1; return !0` (`349724`) | **CHANGED** (flag predicate → capability check) |
| **Prompt variant** | `USER_TYPE==='ant' ? Ant : External` (`prompt.ts:166-170`) | External only; no `USER_TYPE` branch (`GL_`, `349566`) | **REMOVED** (0 grep hits) |
| **What-Happens gating** | `isPlanModeInterviewPhaseEnabled() ? '' : WHAT_HAPPENS_SECTION` (`prompt.ts:19-21,104-106`) | always included: `${ZL_()}` at `349609` | **REMOVED** (always on; 0 grep hits) |
| **What-Happens explore tools** | const string `"Glob, Grep, and Read tools"` (`prompt.ts:4-7`) | `RL()&&K1() ? "find/Glob, grep/Grep, and Read" : "Glob, Grep, and Read"` (`ZL_`, `349557`) | **NEW** (shell-alias branch) |
| **Result footer** | `isPlanModeInterviewPhaseEnabled() ? terse : 6-step` (`EnterPlanModeTool.ts:104-118`) | unconditional 6-step footer (`349749-349765`) | **REMOVED** (single variant) |
| Permission descriptor | `permission_enter_plan_mode`, default `cancelled` | `K0$` same shape (`349442-349451`) | IDENTICAL |
| UI: use / result / rejected | `null` / "Entered plan mode" (plan color) / "User declined…" (default color) (`UI.tsx:9-32`) | `aH4`/`sH4`/`tH4` same (`349655-349682`) | IDENTICAL |

### New post-2.1.88 behavior (EnterPlanMode)

**The `find`/`grep` shell-alias branch (NEW).** v2.1.88's `WHAT_HAPPENS_SECTION` was a hard-coded
constant string. v2.1.156 converts it into a builder `buildWhatHappensSection` (`ZL_`, `349553-349565`)
precisely so step 1 of the plan workflow can name shell aliases when the session can use them: when
`isInteractiveEntrypoint()` (`RL`, a TTY non-SDK launch) **and** `isBashAvailable()` (`K1`, true off
Windows / bash located on Windows) both hold, the prompt advertises `` `find`/Glob, `grep`/Grep, and
Read ``; otherwise it falls back to `Glob, Grep, and Read`. This is entrypoint- and platform-aware
prompt tailoring — surfacing shell aliases only to a model whose user can actually run a shell, and
avoiding misleading SDK/headless or bash-less Windows sessions. Turning a `const` into a function is
the structural enabler; the branch cannot exist in a constant.

**De-flagging (`isEnabled`, prompt variant, footer).** The three removals above are one coherent move:
v2.1.156 retired the KAIROS rollout flags, the `USER_TYPE === 'ant'` internal fork, and the
`isPlanModeInterviewPhaseEnabled()` experiment. The `isEnabled` rationale (don't let plan mode become a
trap where there's no terminal to render the `ExitPlanMode` approval dialog) is unchanged; only the
*trigger* migrated from an experiment flag to the intrinsic `isNonInteractive()` capability check —
generalizing the guard to *any* non-interactive channels session.

---

## 2. ExitPlanMode tool

> Deep analysis: [`exit_plan_mode_tool.md`](./exit_plan_mode_tool.md) §1–§16.
> Tool object `ExitPlanModeV2Tool` (`JC`, `cli_inner_pretty.js:350025-350220`); name `wv = "ExitPlanMode"` (`143387`).

| Aspect | v2.1.88 (`tools/ExitPlanModeTool/`) | v2.1.156 (`cli_inner_pretty.js`) | Status |
|---|---|---|---|
| Tool name | `EXIT_PLAN_MODE_V2_TOOL_NAME = "ExitPlanMode"` (`constants.ts:2`) | `wv = "ExitPlanMode"` (`143387`); legacy `oG` kept (`143386`) | IDENTICAL |
| `allowedPrompt` item schema | `{tool:enum(['Bash']), prompt:string}` (`ExitPlanModeV2Tool.ts:64-73`) | `IL_` (`349982-349987`) | IDENTICAL |
| Input schema | `strictObject({allowedPrompts?}).passthrough()` (`:77-89`) | `M$4` (`349988-349999`) | IDENTICAL |
| SDK input schema | `.extend({plan?, planFilePath?})` (`:97-108`) | `bGf` (`350000-350005`) | IDENTICAL |
| Output schema (7 fields) | `:110-142` incl. `describe()` strings | `CL_` (`350006-350024`) field-for-field | IDENTICAL |
| Model-facing prompt | external stub; no `allowedPrompts` section (`prompt.ts:6-29`) | `$$4` (`349781-349804`) verbatim | IDENTICAL |
| Plan from disk (`normalizeToolInput`) | injects `plan`/`planFilePath`/`allowedPrompts`/`usage` (`plans.ts` + tool) | `dH4` (`349140-349155`) | IDENTICAL |
| `call` control flow | disk read → edited-plan writeback → teammate branch → auto-gate fallback → mode restore → `hasTaskTool` (`:243-418`) | `350085-350168` | IDENTICAL |
| `mapToolResult` 4 branches + strings | `:419-491` | `350169-350219` | IDENTICAL |
| `checkPermissions` | `isTeammate→allow else {ask,"Exit plan mode?"}` (`:226-238`) | `JC.checkPermissions` (`350078-350081`) | IDENTICAL |
| **`isEnabled` gate** (shared body with EnterPlanMode/AskUserQuestion) | behind `feature('KAIROS')`/`'KAIROS_CHANNELS')` (`:167-172`) | disabled when `getAllowedChannels().length>0 && isNonInteractive()`, else enabled — `if(uw().length>0 && R6()) return !1; return !0` (`350045-350048`) | IDENTICAL (behavior), flag INLINED |
| Auto-gate fallback / dangerous-perm strip | behind `feature('TRANSCRIPT_CLASSIFIER')` (`:328,:362`) | always-present (`350124,350149`) | IDENTICAL (behavior), flag INLINED |
| **`validateInput` out-of-plan message** | "…This tool is only for exiting plan mode after writing a plan…" (`:214-215`) | "You are not in plan mode. To enter plan mode, call the `${og}` tool first…" (`350072`) | **CHANGED** (text) |
| Permission descriptor | exit requires `plan`; enter does not | `ftH` requires `plan` (`349466`); `K0$` does not (`349443`) | IDENTICAL |
| `allowedPrompts → addRules` gate | external stub strips guidance (Ant-only) | `jwH()` hardcoded `return !1` (`209900`) → no-op | IDENTICAL intent, clarified |
| Plan helpers / per-agent suffix | `plans.ts`; agent plan `slug-agent-id.md` | `DV`(`549253`)/`wV`(`549248`)/`CL8`(`549341`); same suffixing | IDENTICAL |
| Teammate mailbox helpers | `teammateMailbox.ts` / `inProcessTeammateHelpers.ts` / `agentId.ts` | `aA`(`338306`)/`SL8`(`349768`)/`ou6`(`349772`)/`gUH`(`99008`)/`Ei`(`98997`) | IDENTICAL |

### New / changed post-2.1.88 behavior (ExitPlanMode)

**The one text change is actionable.** The out-of-plan `validateInput` message was rewritten to name
the concrete recovery tool (`EnterPlanMode`) instead of describing the tool's purpose. This addresses a
recurring failure: because `shouldDefer: true` keeps `ExitPlanMode` announced even after plan mode ends,
a model out of plan mode frequently mis-calls it. The new message gives a concrete next action; the
`tengu_exit_plan_mode_called_outside_plan` telemetry (carrying `hasExitedPlanModeInSession`) is unchanged
and still distinguishes "confused model" from "benign re-fire."

**`allowedPrompts` is present-but-gated-OFF.** The schema accepts `allowedPrompts` (semantic Bash
pre-authorizations), and `buildPlanExitPermissionUpdates` (`i9q`, `589766`) would turn them into
session-scoped `allow` rules via `formatPromptRule` (`z97`, `"prompt: run tests"`). But the entire
`addRules` push is guarded by `isPromptBasedPermissionsEnabled()` (`jwH`, `209900`), which is hardcoded
`return !1` in this build — so `allowedPrompts` never becomes a permission rule. This is a
feature-flag-off shipping pattern: the public prompt stub already strips the `allowedPrompts` guidance,
and flipping `jwH()` is the single switch that would activate it internally. Same intent as v2.1.88
(Ant-only), now expressed as an explicit stub rather than a `feature()` macro.

The teammate-approval mailbox branch (`FA() && NY$()` → post `plan_approval_request` to `team-lead`,
return `awaitingLeaderApproval:true`) and the auto-mode circuit-breaker fallback (restore `prePlanMode`
unless it was `"auto"` and the gate is off, in which case fall back to `"default"` with a warning
notification) are both structurally identical to v2.1.88, only with the `feature('TRANSCRIPT_CLASSIFIER')`
gates inlined to always-present.

---

## 3. Plan runtime / session state / mode transitions

> Deep analysis: [`runtime_mechanism.md`](./runtime_mechanism.md) §1–§3, §7–§8.

| Aspect | v2.1.88 (`utils/`) | v2.1.156 (`cli_inner_pretty.js`) | Status |
|---|---|---|---|
| External mode list | `["acceptEdits","auto","bypassPermissions","default","dontAsk","plan"]` | `st` (`49174`) | IDENTICAL |
| `getModeDefaultBehavior` plan branch | `mode==='plan' && ctx ? allow : ask` | `ZF$` (`49209-49214`) | IDENTICAL |
| Session flags (`hasExitedPlanMode`, `needsPlanModeExitAttachment`) | getter/setter pairs (`state.ts`) | `m7$`/`zQ`, `Rm8`/`Gt` (`3035-3046`) | IDENTICAL |
| Boundary-flag toggle `(toMode,fromMode)` | entering plan sets exit-attachment; leaving clears (`state.ts:1353-1354`) | `Tt` (`3047-3050`) | IDENTICAL |
| Auto↔plan no-op carve-out | auto-exit attachment skipped across auto/plan boundary | `Cm8` (`3057-3062`) | IDENTICAL |
| Central transition funnel | telemetry + flags + capture `prePlanMode` | `vl` `transitionPermissionMode` (`442777-442791`) | IDENTICAL |
| `prepareContextForPlanMode` (capture `prePlanMode`) | snapshot prior mode + auto-mode prep (`planModeV2.ts`) | `xhH` (`443097-443112`) | IDENTICAL |
| Mode-change telemetry (no-op when from===to) | `permission_mode_changed` OTEL | `t1H` (`222562-222565`) | IDENTICAL |
| Reminder cadence | turn throttle + full/sparse modulo | `lg6` = `{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}` (`414015`) | IDENTICAL |
| Resume drops plan/bypass | reconcile restored mode drops `plan`/`bypassPermissions` | `Vyz` (`598936-598953`) | IDENTICAL |
| **Customizable reminder body** | fixed 5-phase body | `--plan-mode-instructions`/`planModeInstructions` swap the body, preamble+footer kept; sub-agents get an empty array (`if(H.isSubAgent) return []`) (`bQ_`, `445324`) | **NEW** |

The runtime state model, the transition funnel, the `prePlanMode` capture/restore, and the per-turn
reminder cadence are all unchanged. The one new capability is that the *body* of the plan-mode
`<system-reminder>` can now be overridden via `--plan-mode-instructions`, while the read-only
enforcement preamble (`jG4`, `446485`) and the `ExitPlanMode`/`AskUserQuestion` protocol footer
(`wG4`, `445318`) are **always** preserved — so a custom body can change the planning *workflow* but
never weaken the read-only contract or the approval-routing rules.

- **Sub-agent early-return.** The reminder-body builder (`bQ_`, `445324`) opens with
  `if (H.isSubAgent) return []` — sub-agents receive **no** plan-mode reminder body at all (empty
  array), short-circuiting both the default 5-phase body and the `--plan-mode-instructions` custom-body
  path. This is why the customizable-body swap only ever applies to the top-level (interactive) agent;
  a spawned sub-agent never sees the preamble, body, or footer.

---

## 4. Plan-file naming (the seeded slug — biggest runtime change)

> Deep analysis: [`runtime_mechanism.md`](./runtime_mechanism.md) §6.

| Aspect | v2.1.88 (`utils/plans.ts`, `utils/words.ts`) | v2.1.156 (`cli_inner_pretty.js`) | Status |
|---|---|---|---|
| `getPlanSlug` signature | `getPlanSlug(sessionId?)` — **no seed** (`plans.ts:32`) | `ILH(sessionId?, planSlugSeed?)` (`549223-549238`) | **CHANGED** (new seed param) |
| Slug source | `generateWordSlug()` only — random adj-adj-noun (`plans.ts:40`) | seed present → `slugifyPromptSeed(seed)-generateTwoWordSuffix()`; else `generateWordSlug()` (`549231-549232`) | **NEW** (prompt-seeded path) |
| `slugifyPromptSeed` | — (absent) | `MM6` — first 4 words, lowercase, dash-collapse, ≤40 chars, trim (`141346`) | **NEW** |
| `generateTwoWordSuffix` | — (absent) | `wgH` — random `adjective-noun` (`141360`) | **NEW** |
| Legacy random fallback | `generateWordSlug` adj-adj-noun | `y88` (same) (`141340`) | IDENTICAL |
| `existsSync` retry loop / `MAX_RETRIES` | up to 10 retries (`plans.ts:38`) | `IJz = 10`, identical loop (`549230`) | IDENTICAL |
| Per-session slug cache | `Map<sessionId, slug>` cleared on `/clear`/session swap | `yYH` (`3107-3109`), reset paths (`2366`,`2384`) | IDENTICAL |
| Path resolution | `{plansDir}/{slug}.md` or `…-agent-{id}.md` | `wV` (`549248`) | IDENTICAL |

### New post-2.1.88 behavior (plan-file naming)

This is the largest *runtime* change. v2.1.88 always produced opaque random filenames like
`wise-ancient-otter.md`. v2.1.156 threads the user's first prompt as a `planSlugSeed` (from the
attachment builder at `412853`) and produces human-readable names like
`add-user-auth-flow-bright-otter.md`. The design layers the seeded pipeline *on top of* an unchanged
uniqueness guarantee — the `existsSync` retry loop and `MAX_RETRIES = 10` are byte-identical to
v2.1.88, and the random three-word fallback is retained verbatim for sessions with no seed (resume,
programmatic entry). The aggressive sanitization (4-word/40-char caps, dash-collapse, trim) plus the
random two-word suffix together guarantee a safe, collision-resistant, discoverable filename. Only the
slug *source* changed; the correctness machinery did not — which is why the change is low-risk.

---

## 5. The write floor (plan-mode read-only enforcement)

> Deep analysis: [`runtime_mechanism.md`](./runtime_mechanism.md) §4–§5.

| Aspect | v2.1.88 | v2.1.156 (`cli_inner_pretty.js`) | Status |
|---|---|---|---|
| Write-permission checker ordering | deny → memory → allow-rule → ask-rule → exemption → safety → **plan floor** → acceptEdits/workingDir | `ChH` (`549806-549890`); floor at `549873` | IDENTICAL |
| Plan floor decision reason | `{type:"mode", mode:"plan"}` ask | same (`549873-549878`) | IDENTICAL |
| `.claude/**` allow-rule suppressed in plan | `&& mode!=='plan'` conjunct | `q.mode !== "plan"` (`549838`) | IDENTICAL |
| Read downgrade (plan→default before check) | read path rewrites `mode` to `default` | `549790-549791` | IDENTICAL |
| Internal-editable exemption (plan file writable) | plan/workflow/scratchpad/bg/memory/wiki | `WlH` (`549939-549997`) | IDENTICAL |
| Plan-file path test | `{plansDir}/{slug}` prefix + `.md` suffix, session-scoped | `b$9` (`549461-549467`) | IDENTICAL |

The entire write-floor mechanism — the precedence lattice (deny/safety outrank the floor; the floor
outranks every auto-allow convenience), the `.claude/**` fast-path suppression in plan mode, the
read-vs-write asymmetry (reads run with `mode` rewritten to `default` so the floor never fires for
reads), and the session-scoped plan-file exemption — is **unchanged** from v2.1.88 modulo renames. No
behavioral delta here.

---

## 6. UI, approval dialog, and the Shift+Tab cycle

> Deep analysis: [`ui_and_approval_flow.md`](./ui_and_approval_flow.md) §2–§13.

| Aspect | v2.1.88 | v2.1.156 (`cli_inner_pretty.js`) | Status |
|---|---|---|---|
| ExitPlanMode result render (3 states) | empty / awaiting-lead / approved | `_$4` (`349843-349900`) | IDENTICAL |
| Rejected-plan render | "User rejected Claude's plan:" in planMode box | `RL8`/`z$4` (`349805-349904`) | IDENTICAL |
| Approval dialog titles/labels | "Exit plan mode?", "Ready to code?", "Here is Claude's plan:" | `mA9` (`590270/590297/590314/590363`) | IDENTICAL |
| `checkPermissions` (teammate bypass) | `isTeammate→allow else {ask,"Exit plan mode?"}` | `JC.checkPermissions` (`350078-350081`) | IDENTICAL |
| `buildPermissionUpdates` | `[setMode]+classifier addRules` | `i9q` (`589766-589776`) | IDENTICAL |
| `autoNameSessionFromPlan` | skip if persistence off / already-named | `Zkz` (`589777-589793`) | IDENTICAL |
| Mode chip config (plan entry) | `{title:"Plan Mode", symbol:PAUSE_ICON ⏸, color:"planMode", external:"plan"}` (`PermissionMode.ts:42-91`) | `xEq` (`49228-49253`, plan at `49230`) | IDENTICAL |
| `plan`-case cycle order | `plan→(isBypass?bypass:canCycleToAuto?auto:default)` | `QCH` (`578718-578721`) | IDENTICAL |
| **Approval option priority** | both slots **auto > bypass > edits** (gated `feature('TRANSCRIPT_CLASSIFIER') && isAutoModeAvailable`) (`ExitPlanModePermissionRequest.tsx:690-727`) | both slots **bypass > auto > edits** (`Gkz`, `589804-589810`) | **CHANGED** (priority flip) |
| **`getNextPermissionMode` `default` case** | `if(USER_TYPE==='ant'){…} return acceptEdits` (`getNextPermissionMode.ts:39-50`) | unconditional `return "acceptEdits"` (`QCH`, `578714-578715`) | **REMOVED** (ant branch) |
| **`canCycleToAuto` gate** | wrapped in `if(feature('TRANSCRIPT_CLASSIFIER'))` (`getNextPermissionMode.ts:18-28`) | live gate `h0()` + dismissed `i4q()`, no flag (`PR8`, `578696-578708`) | **CHANGED** (flag retired) |
| **`auto` chip in config** | gated by `feature('TRANSCRIPT_CLASSIFIER')` | unconditional `{title:"Auto mode", color:"warning"}` (`49252`) | **CHANGED** (graduated) |
| **Choice → result mapping** | inlined in React handler | extracted pure `getApprovalResult` (`_I8`, `589839-589877`) | **REFACTOR** (pure/effect split) |
| `cyclePermissionMode` signature | `(ctx, teamContext)` | `(ctx, teamContext, trigger)` — threads `"shift_tab"` (`c19`, `578731-578734`) | **CHANGED** (telemetry arg) |
| **`/plan` ccr remote branch** | absent (`commands/plan/`) | `Y?.kind==='ccr'` short-circuit sends remote `set_permission_mode` (`v5z`, `513523-513538`) | **NEW** |

### New / changed post-2.1.88 behavior (UI/approval)

**The priority flip (HIGH).** In v2.1.88 the elevated "Yes" option chose its mode `auto > bypass >
edits`; in v2.1.156 it is `bypass > auto > edits` (`Gkz`). The option *label strings* are unchanged in
both builds, so a casual label diff misses this — only the *condition order* moved. The new order
respects a user who explicitly launched with `--dangerously-skip-permissions`: surfacing *bypass* as
the primary elevated path honors their stated intent, while auto-mode (classifier-gated) is the better
default only when bypass was not explicitly enabled. Because the in-dialog Shift+Tab quick-approve picks
`yes-accept-edits-keep-context` (whose target is `bypassPermissions` when bypass is available), the flip
also changes what a single in-dialog Shift+Tab grants.

**The ant-branch removal + auto graduation (HIGH/LOW).** v2.1.88's `getNextPermissionMode` had a
`USER_TYPE === 'ant'` fork in the `default` case (skipping `acceptEdits`/`plan` toward bypass/auto for
Anthropic-internal users). v2.1.156 unconditionally returns `acceptEdits` for everyone, and auto is now
expressed purely through the (now unconditional) auto chip + `canCycleToAuto` gating. This is the
cycle-side counterpart of retiring the `TRANSCRIPT_CLASSIFIER` experiment and graduating auto-mode into
the standard config — collapsing a hot-path user-type fork into one uniformly-tested code path.

**The `getApprovalResult` extraction (REFACTOR).** v2.1.88 inlined choice→result branching inside the
React handler, intermixed with side effects. v2.1.156 splits the *decision* (pure, testable `_I8`) from
the *effects* (imperative `mH`/`pH`). The pure function deliberately returns `{behavior:"deny"}` for
clear-context choices and **empty** `permissionUpdates` for auto-resume — those two cases need store
mutations (re-inject plan / activate auto) that a pure function must not do, so the React handler owns
them. Clean effects boundary, not an omission.

**The `/plan` ccr remote short-circuit (NEW).** A remote CCR session does not own the local permission
context the same way, so `/plan` now mirrors the mode change to the remote via a `set_permission_mode`
control request and skips the rich local `PlanDisplay` rendering, emitting a plain "Enabled plan mode".

---

## 7. AskUserQuestion tool

> Deep analysis: [`../04_tools/ask_user_question_tool.md`](../04_tools/ask_user_question_tool.md) §2–§13.
> Tool object `AskUserQuestionTool` (`YtH`, `cli_inner_pretty.js:348809-348933`); name `ez = "AskUserQuestion"` (`143388`).

| Aspect | v2.1.88 (`tools/AskUserQuestionTool/`) | v2.1.156 (`cli_inner_pretty.js`) | Status |
|---|---|---|---|
| Tool name / chip width / description | `"AskUserQuestion"` / `12` / one-liner (`prompt.ts:3-8`) | `ez`/`BUK=12`/`pUK` (`143388-143391`) | IDENTICAL |
| `questionOptionSchema` (`label`/`description`/`preview?`) | `prompt.ts:14-18` | `AL_` (`348698-348717`) | IDENTICAL |
| `questionSchema` (`question`/`header`/`options.min(2).max(4)`/`multiSelect`) | `prompt.ts:19-24` | `CH4` (`348718-348744`) | IDENTICAL |
| `annotationsSchema` (`record(string,{preview?,notes?})`) | `prompt.ts:26-30` | `bH4` (`348745-348759`) | IDENTICAL |
| Uniqueness refine (q-text + option-label dedup) | present | `RH4` (`348760-348771`) | IDENTICAL |
| **`answers` value type** | `z.record(z.string(), z.string())` (`AskUserQuestionTool.tsx:56`) | `record(string, answerValueSchema)` where `YL_ = z.preprocess(joinArray, z.string())` (`348772-348774`) | **CHANGED** (multi-select join preprocess) |
| `commonFields` (`answers`/`annotations`/`metadata.source`) | `tsx:56-60` | `fL_` (`348775-348789`) | IDENTICAL |
| `outputSchema` (`answers: record(string,string)`, "comma-separated" describe) | `tsx:71` | `ML_` (`348798-348808`) | IDENTICAL |
| HTML-fragment validator (3 regexes) | `tsx:247-249` | `DL_` (`348663-348672`) | IDENTICAL |
| Preview format accessor / preview guidance | `getQuestionPreviewFormat` markdown/html map | `wC$`/`UUK` (`2829-2834`, `143398-143418`) | IDENTICAL |
| **`isEnabled` gate** (shared body with EnterPlanMode/ExitPlanMode) | `(feature('KAIROS')\|\|feature('KAIROS_CHANNELS')) && getAllowedChannels().length>0` (`tsx:135-141`) | disabled when `getAllowedChannels().length>0 && isNonInteractive()`, else enabled — `if(uw().length>0 && R6()) return !1; return !0` (`348839-348842`) | **CHANGED** (flag → capability check) |
| **Base prompt (`xM6`)** | 4-item "this allows you to…" checklist opener (`prompt.ts:35-39`) | "Use this tool only when you are blocked on a decision genuinely the user's to make…" (`143419-143427`) | **CHANGED** (narrowed) |
| **Plan-mode note** | references only `${EXIT_PLAN_MODE_TOOL_NAME}` for both entry-context and approval (`prompt.ts:46`) | "use `${og}` (not this tool)" to enter; `${oG}` for approval (`143426`) | **CHANGED** (names both tools) |
| **Result mapping notes-only branch** | unconditional `"q"="a"` per `answers` entry | `Bu6 = "(notes only)"` sentinel → `(no option selected)`; null-filter (`348913-348932`) | **NEW** (notes-only state) |
| **Lean-model reservation prompt** | absent | `FUK` injected by `prompt()` when `shouldUseLeanSystemPrompt` (`143394-143396`, `348816-348829`) | **NEW** (see reservation doc) |
| Runtime dialog 3 outcomes (accept/respond-to-claude/reject) | present | `INz`/`BNz`/`pNz` (`594187+`) | IDENTICAL |
| `[User answered AskUserQuestion]:` prefix + classifier trust exception | present | `276924` (safety prompt exception) | IDENTICAL |

### New / changed post-2.1.88 behavior (AskUserQuestion)

**Base prompt narrowing (CHANGED).** v2.1.88's `ASK_USER_QUESTION_TOOL_PROMPT` opened with a 4-item
"This allows you to: 1. Gather preferences 2. Clarify 3. Get decisions 4. Offer choices" checklist —
an invitation to use the tool broadly. v2.1.156 replaces that opener with a single restrictive sentence
("Use this tool **only** when you are blocked on a decision that is genuinely the user's to make: one
you cannot resolve from the request, the code, or sensible defaults"), deliberately discouraging
over-asking. The usage-notes bullets (Other option, multiSelect, "(Recommended)") are unchanged.

**Plan-mode note now names both tools (CHANGED — the tool-split tell).** v2.1.88's note referenced only
`ExitPlanMode` for both "you are in plan mode" context and approval. v2.1.156's note routes plan
**entry** explicitly to `EnterPlanMode` ("To switch into plan mode, use `${og}`, **not this tool**")
and keeps `ExitPlanMode` ("`${oG}`") for approval. The load-bearing rule survives in both: do not ask
"Is my plan ready?"/"Should I proceed?" via AskUserQuestion, because the user cannot see the plan until
`ExitPlanMode` renders it. This rewrite is mechanically enabled by `og`/`oG` being two distinct
constants.

**Multi-select join preprocess (CHANGED).** v2.1.88 typed the per-answer value as a plain `z.string()`,
so multi-select coercion had to happen elsewhere. v2.1.156 wraps it in `z.preprocess` (`YL_`,
`348772-348774`): a `string[]` of strings is `.join(", ")`-ed into one comma-separated string at the
schema boundary; anything else passes through. This pushes the "answers are always strings" invariant
down to the type boundary so no downstream consumer (the `record(string,string)` output, the
`"q"="a"` result mapping, the re-surfacing) has to defend against arrays.

**`"(notes only)"` sentinel + notes-only result branch (NEW).** v2.1.88 unconditionally emitted a
`"q"="a"` pair for every `answers` entry and had no concept of "user typed notes but picked no option."
v2.1.156 adds the sentinel `Bu6 = "(notes only)"` (`348683`): when an answer equals it, the question
renders `"q"=(no option selected)` instead of an `=value` pair, and a question is included in the
result only if it has a real answer **or** notes (`if (!hasRealAnswer && !annotation?.notes) return
null`, then `.filter(part => part !== null)`). This models the real UX where a user submits free-text
notes via the "Other"/text-input path without selecting an offered option.

**`isEnabled` de-flagging (CHANGED).** Same migration as the plan tools: v2.1.88 gated on KAIROS feature
flags; v2.1.156 ANDs in the intrinsic `isNonInteractive()` so an *interactive* session that also has
channels configured can still use the dialog (a human is at the TUI to answer). The earlier version
disabled the tool the moment any channel was allowed.

---

## 8. Remote sessions / Ultraplan

> Deep analysis: [`remote_and_ultraplan.md`](./remote_and_ultraplan.md) §1–§10.
> **Cross-validation precursor:** `/lyz/codespace/3rd/claude-code/src/utils/ultraplan/ccrSession.ts`.

| Aspect | v2.1.88 (`utils/ultraplan/`) | v2.1.156 (`cli_inner_pretty.js`) | Status |
|---|---|---|---|
| `ExitPlanModeScanner` (pure CCR event classifier) | precedence `approved > terminated > rejected > pending > unchanged` (`ccrSession.ts:74-78`) | `kU4` (`503140-503189`) | IDENTICAL (near-verbatim minification) |
| Poll loop (3s tick, deadline-bounded) | `pollForApprovedExitPlanMode` | `NU4` (`503190-503245`) | IDENTICAL |
| `POLL_INTERVAL_MS` / `MAX_CONSECUTIVE_FAILURES` | `3000` / `5` | `vU4`=3000 / `x4z`=5 (`503273-503274`) | IDENTICAL |
| `## Approved Plan:` marker contract | producer (tool_result) + consumer (`extractApprovedPlan`) (`ccrSession.ts:191-194`) | `350208-350218` / `B4z` (`503257-503272`) | IDENTICAL |
| Teleport sentinel | `__ULTRAPLAN_TELEPORT_LOCAL__`, overloaded onto a deny | `u4z` (`503276`); `m4z` (`503249`) | IDENTICAL |
| Three remote-planning reminders | `simple_plan`/`visual_plan`/`three_subagents_with_critique` | `hU4`/`SU4`/`RU4` (`503302-503377`) | IDENTICAL (machinery); see note |
| Enablement gate (3-way AND) | server flag + bridge entitlement + interactive | `cqH` (`503294-503296`) | IDENTICAL |
| Remote file-snapshot durability | `file_snapshot` only when remote | `CL8` (`549341-549363`) gated on `D68` (`145406`) | IDENTICAL |
| **`eventStats` in poll errors** | absent | threaded into every `UltraplanPollError` (`503190+`) | **NEW** (telemetry) |
| **Timeout wording (minutes pluralized)** | raw `${timeoutMs/1000}s` | `Math.round(ms/60000)` + `minute`/`minutes` (`503241`) | **CHANGED** (UX polish, same trigger) |

### New post-2.1.88 behavior (remote/Ultraplan)

The **scanner/poller/marker machinery is a near-verbatim minification** of v2.1.88's `ccrSession.ts`:
the precedence rule (`approved` beats `terminated` so an approve-then-crash never loses the user's
plan), the newest-first scan that skips `rejectedIds`, the `result(success)`-is-ignored rule (CCR emits
`success` every turn, so only non-success subtypes are terminal), the `## Approved Plan:` string-marker
data contract (the plan travels as *prose inside the approval tool_result*, not as a structured field,
because the remote model writes the plan to a file and calls `ExitPlanMode({allowedPrompts})`), and the
teleport sentinel overloaded onto a deny — all match v2.1.88.

What is **genuinely new** relative to the available v2.1.88 source is (a) the customizable reminder body
(§3 above), and (b) the surrounding orchestration polish: an `eventStats` object now rides every
`UltraplanPollError` so failure telemetry can answer "did we get *any* events, and when?", and the
timeout message rounds to whole minutes with `minute`/`minutes` pluralization (pure UX; identical
trigger semantics, including the `everSeenPending` fork that distinguishes `timeout_pending` from
`timeout_no_plan`). The three reminder *variants* and the config-driven variant selection
(`tengu_ultraplan_prompt_identifier` → fallback `simple_plan`) are present in both; only the per-build
text and the orchestration telemetry differ.

---

## 9. Overall confidence assessment

**HIGH confidence — verified by reading both trees directly:**
- Every v2.1.156 line number and ORIGINAL snippet underlying these rows was read from
  `cli_inner_pretty.js` before citation (the six area docs each re-grounded their claims, and the key
  load-bearing facts were re-confirmed for this consolidation: the `og`/`oG`/`ez` name constants at
  `143385-143388`; `YL_` multi-select preprocess at `348772-348774`; the `Bu6 = "(notes only)"`
  sentinel at `348683` and its result-mapping branch at `348913-348932`; the AskUserQuestion
  `isEnabled` at `348839-348842`; the seeded `getPlanSlug` (`ILH`) at `549223-549238` and
  `slugifyPromptSeed`/`generateTwoWordSuffix` at `141346-141362`; the `[User answered AskUserQuestion]:`
  classifier exception at `276924`).
- The v2.1.88 counterparts were read directly: AskUserQuestion `prompt.ts` (old 4-item checklist + old
  plan-mode note that referenced only `ExitPlanMode`), `AskUserQuestionTool.tsx:56` (old plain
  `z.record(z.string(), z.string())`) and `:135-141` (KAIROS-gated `isEnabled` with no
  `isNonInteractive`); `EnterPlanModeTool.ts:60-65` + `prompt.ts:19-21,166-170` (KAIROS gate,
  `USER_TYPE==='ant'` fork, `isPlanModeInterviewPhaseEnabled()` gating); `ExitPlanModeV2Tool.ts:167-215`
  (KAIROS `isEnabled`, the old out-of-plan message text); `getNextPermissionMode.ts:41` (the
  `USER_TYPE==='ant'` branch); `plans.ts:32-48` (single-arg `getPlanSlug`, `generateWordSlug` only,
  10-retry loop).
- All four headline NEW features (seeded plan slug; AskUserQuestion narrowing + multi-select join +
  notes-only sentinel; EnterPlanMode shell-alias branch; the approval priority flip and ant-branch
  removal) are confirmed in **both** trees.

**MEDIUM confidence — usage/effect confirmed, body not fully line-traced:**
- The lazy-imported auto-mode helpers in ExitPlanMode (`stripDangerousPermissionsForAutoMode` /
  `restoreDangerousPermissions` / `isAutoModeGateEnabled`) — their call sites and effect are confirmed,
  but their bodies were inferred from naming + v2.1.88 comments rather than fully line-read here.
- The exact byte value of the `BLACK_CIRCLE`/`PAUSE_ICON` glyphs (declarations confirmed; the
  figures-init assignment was not byte-read).
- Whether `dontAsk` is reachable in the live Shift+Tab cycle: `QCH` has a `dontAsk` case but no branch
  *returns* `dontAsk`, so it appears defensive/vestigial (confirmed by reading `QCH` in full).

**Low-impact open questions:**
- Whether the EnterPlanMode `agentId` throw is reachable in production (vs. purely defensive) depends on
  whether the tool leaks into a subagent toolset — confirming the subagent toolset filter would upgrade
  the "defense in depth" claim from inferred to verified.
- The Ultraplan reminder variant *texts* differ per build by construction; only their teleport/error
  tails and anti-leak footers were string-matched, not full-body diffed against v2.1.88.

**Net assessment.** The v2.1.156 plan-mode + AskUserQuestion subsystem is a **faithful evolution** of
v2.1.88, not a rewrite. The structural skeleton (tool objects, schemas, the write floor, the transition
funnel, the approval dialog, the Ultraplan scanner/marker contract) is unchanged. The deltas are
concentrated, intentional, and consistent with one another: the EnterPlanMode/ExitPlanMode tool split,
a systematic retirement of experiment flags (KAIROS, TRANSCRIPT_CLASSIFIER, interview-phase, ant), the
AskUserQuestion narrowing + multi-select/notes-only data-model refinements, the discoverable seeded
plan filenames, the bypass>auto approval flip, and the remote-Ultraplan orchestration/customizable-body
additions. Every CHANGED/NEW/REMOVED row above was confirmed against the obfuscated bundle as the
canonical source and the v2.1.88 TypeScript as the readable precursor.

---

## Related Symbols

> Symbol mappings live in the central index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools, Agent Loop, LLM API)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode, Compact, Hooks)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, Model, Prompt, Telemetry)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

The per-symbol obfuscated↔readable mappings for every symbol cited in the tables above already live in
the six consolidated area docs and the central index files (do not duplicate them here). Quick anchors
for this document:

- `ENTER_PLAN_MODE_TOOL_NAME` (`og`) / `EXIT_PLAN_MODE_TOOL_NAME` (`oG`/`wv`) / `ASK_USER_QUESTION_TOOL_NAME` (`ez`) - `cli_inner_pretty.js:143385-143388`
- `EnterPlanModeTool` (`hL8`) - `cli_inner_pretty.js:349703-349766`
- `ExitPlanModeV2Tool` (`JC`) - `cli_inner_pretty.js:350025-350220`
- `AskUserQuestionTool` (`YtH`) - `cli_inner_pretty.js:348809-348933`
- `answerValueSchema` (`YL_`, multi-select join) - `cli_inner_pretty.js:348772-348774`
- `NO_OPTION_SELECTED_SENTINEL` (`Bu6`, `"(notes only)"`) - `cli_inner_pretty.js:348683`
- `getPlanSlug` (`ILH`, seeded) / `slugifyPromptSeed` (`MM6`) / `generateTwoWordSuffix` (`wgH`) - `cli_inner_pretty.js:549223-549238`, `141346-141362`
- `checkWritePermissionForTool` (`ChH`, the write floor) - `cli_inner_pretty.js:549806-549890`
- `buildPlanApprovalOptions` (`Gkz`) / `getApprovalResult` (`_I8`) / `getNextPermissionMode` (`QCH`) - `cli_inner_pretty.js:589794-589877`, `578712-578730`
- `ExitPlanModeScanner` (`kU4`) / `extractApprovedPlan` (`B4z`) / `ULTRAPLAN_TELEPORT_SENTINEL` (`u4z`) - `cli_inner_pretty.js:503140-503276`
