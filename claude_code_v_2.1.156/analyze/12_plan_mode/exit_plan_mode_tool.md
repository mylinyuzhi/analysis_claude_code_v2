# ExitPlanMode (V2) Tool — v2.1.156

> **Scope / Source.** This document analyzes the `ExitPlanMode` tool (the V2 plan-mode-exit tool) as implemented in Claude Code **v2.1.156**, grounded entirely in the pretty-printed obfuscated bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (cited as `cli_inner_pretty.js:<line>`; line numbers verified by direct reads).
> Readable names are recovered from the v2.1.88 unobfuscated TypeScript precursor
> `/lyz/codespace/3rd/claude-code/src/tools/ExitPlanModeTool/{ExitPlanModeV2Tool.ts,prompt.ts,constants.ts,UI.tsx}` and `src/utils/plans.ts`,
> which is used for cross-validation only — every behavioral claim is re-grounded in the 2.1.156 bundle.

## TL;DR

`ExitPlanMode` (tool object `JC`, `cli_inner_pretty.js:350025-350220`, name constant `wv` = `"ExitPlanMode"`) is the tool the model calls **with no plan body** to signal "I have finished writing the plan; please approve and let me start coding." The defining architectural choice is that **the plan is read from disk, not passed as a parameter** — `normalizeToolInput` (`dH4`, `349140-349155`) injects `plan` and `planFilePath` from the on-disk plan file before the tool ever runs. The tool's `call()` (`350085-350168`) does three things in sequence:

1. **Shared prelude** — read the plan from disk (`DV`/`getPlan`), and *only if* an edited plan arrived via `H.plan` (CCR web UI / Ctrl+G), write it back and re-snapshot it (`CL8`).
2. **Fork on `FA() && NY$()` (`isTeammate && isPlanModeRequired`)** — a required-plan-mode teammate does **not** exit locally; it posts a `plan_approval_request` to the `team-lead` mailbox (`aA`), marks its task `awaitingPlanApproval` (`ou6`), and returns `awaitingLeaderApproval:true`. Everyone else (the **MAIN** branch) exits plan mode locally.
3. **MAIN branch** — run the auto-mode circuit-breaker fallback, restore the pre-plan permission mode, flip `hasExitedPlanMode`/`needsPlanModeExitAttachment`, emit `permission_mode_changed` telemetry, strip/restore dangerous auto-mode permissions, and detect whether the Agent tool is present (`hasTaskTool`).

`mapToolResultToToolResultBlockParam` (`350169-350219`) emits a `## Approved Plan:` block that downstream code (`extractApprovedPlan`, `B4z`, `503257`) parses by string-match — this marker is a **contract**, not decoration. The `allowedPrompts` Bash pre-authorization is present in the schema but is a **no-op in this build**: it only becomes real permission rules inside `i9q` (`589766`) gated behind `jwH()` (`209900`), which hardcodes `return !1`. The 2.1.156 implementation is line-for-line faithful to the v2.1.88 `ExitPlanModeV2Tool.ts`, with `feature()` flags inlined and one prompt-text change in the out-of-plan error message.

---

## Related Symbols

> Symbol mappings live in the central index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)

Key symbols in this document:

- `ExitPlanModeV2Tool` (obfuscated: `JC`) — the `buildTool` object (`cli_inner_pretty.js:350025-350220`)
- `EXIT_PLAN_MODE_V2_TOOL_NAME` (obfuscated: `wv`) — `"ExitPlanMode"`, the V2 tool name (`cli_inner_pretty.js:143387`)
- `EXIT_PLAN_MODE_TOOL_NAME` (obfuscated: `oG`) — legacy V1 name, same string `"ExitPlanMode"` (`cli_inner_pretty.js:143386`)
- `ENTER_PLAN_MODE_TOOL_NAME` (obfuscated: `og`) — `"EnterPlanMode"`, referenced in the validateInput error (`cli_inner_pretty.js:143385`)
- `ASK_USER_QUESTION_TOOL_NAME` (obfuscated: `ez`) — `"AskUserQuestion"` (`cli_inner_pretty.js:143388`)
- `AGENT_TOOL_NAME` (obfuscated: `sq`) — `"Agent"`, used in `hasTaskTool` detection (`cli_inner_pretty.js:185637`)
- `TEAM_CREATE_TOOL_NAME` (obfuscated: `rd`) — `"TeamCreate"`, used in the tool_result team hint (`cli_inner_pretty.js:216438`)
- `EXIT_PLAN_MODE_V2_TOOL_PROMPT` (obfuscated: `$$4`) — the model-facing prompt (`cli_inner_pretty.js:349781-349804`)
- `allowedPromptSchema` (obfuscated: `IL_`) — `z.object({tool:enum(['Bash']),prompt:string})` (`cli_inner_pretty.js:349982-349987`)
- `exitPlanModeInputSchema` (obfuscated: `M$4`) — `strictObject({allowedPrompts?}).passthrough()` (`cli_inner_pretty.js:349988-349999`)
- `exitPlanModeSdkInputSchema` (obfuscated: `bGf`) — `M$4.extend({plan?,planFilePath?})` (`cli_inner_pretty.js:350000-350005`)
- `exitPlanModeOutputSchema` (obfuscated: `CL_`) — the 7-field output schema (`cli_inner_pretty.js:350006-350024`)
- `buildTool` (obfuscated: `yK`) — the tool factory (`cli_inner_pretty.js:143482`)
- `normalizeExitPlanModeToolInput` (obfuscated: `dH4`) — injects plan/planFilePath/allowedPrompts from disk (`cli_inner_pretty.js:349140-349155`)
- `getPlan` (obfuscated: `DV`) — reads the plan file (`cli_inner_pretty.js:549253-549261`)
- `getPlanFilePath` (obfuscated: `wV`) — resolves the plan file path (`cli_inner_pretty.js:549248-549252`)
- `persistFileSnapshotIfRemote` (obfuscated: `CL8`) — pushes a `file_snapshot` message when remote (`cli_inner_pretty.js:549341-549360`)
- `isTeammate` (obfuscated: `FA`) — subagent/team detection (`cli_inner_pretty.js:99280-99283`)
- `isPlanModeRequired` (obfuscated: `NY$`) — required-vs-voluntary plan mode (`cli_inner_pretty.js:99289-99294`)
- `getAgentName` (obfuscated: `ZA`) / `getTeamName` (obfuscated: `c_`) (`cli_inner_pretty.js:99269-99279`)
- `generateRequestId` (obfuscated: `gUH`) / `formatAgentId` (obfuscated: `Ei`) (`cli_inner_pretty.js:99008-99011`, `98997-98999`)
- `writeToMailbox` (obfuscated: `aA`) — posts to the team-lead inbox (`cli_inner_pretty.js:338306-338330`)
- `findInProcessTeammateTaskId` (obfuscated: `SL8`) / `setAwaitingPlanApproval` (obfuscated: `ou6`) (`cli_inner_pretty.js:349768-349774`)
- `setHasExitedPlanMode` (obfuscated: `zQ`) / `setNeedsPlanModeExitAttachment` (obfuscated: `Gt`) / `hasExitedPlanModeInSession` (obfuscated: `m7$`) (`cli_inner_pretty.js:3035-3046`)
- `logPermissionModeChanged` (obfuscated: `t1H`) (`cli_inner_pretty.js:222562-222565`)
- `getToolPermissionContext` (obfuscated: `T6`) (`cli_inner_pretty.js:453162-453180`)
- `isAgentSwarmsEnabled` (obfuscated: `R7`) (`cli_inner_pretty.js:240766-240770`)
- `toolMatchesName` (obfuscated: `h1`) (`cli_inner_pretty.js:143452-143454`)
- `isNonInteractive` (obfuscated: `R6`) / `getAllowedChannels` (obfuscated: `uw`) (`cli_inner_pretty.js:2742-2744`, `3217-3219`)
- `buildPlanExitPermissionUpdates` (obfuscated: `i9q`) / `formatPromptRule` (obfuscated: `z97`) / `isPromptBasedPermissionsEnabled` (obfuscated: `jwH`) (`cli_inner_pretty.js:589766-589776`, `209897-209902`)
- `applyPermissionUpdates` (obfuscated: `sN`) / `mapModeToExternal` (obfuscated: `Yi`) (`cli_inner_pretty.js:210088-210091`, `49197-49199`)
- `extractApprovedPlan` (obfuscated: `B4z`) — Ultraplan CCR tool_result parser (`cli_inner_pretty.js:503257-503272`)
- `permissionExitPlanModeV2Descriptor` (obfuscated: `ftH`) (`cli_inner_pretty.js:349453-349472`)
- `renderToolResultMessage` (obfuscated: `_$4`) / `renderToolUseRejectedMessage` (obfuscated: `z$4`) / `RejectedPlanView` (obfuscated: `RL8`) (`cli_inner_pretty.js:349843-349904`, `349805-349832`)
- `recoverPlanFromHistory` (obfuscated: `CJz`) / `findFileSnapshot` (obfuscated: `bJz`) (`cli_inner_pretty.js:549305-549339`)

---

## 1. Overview: what `ExitPlanMode` (V2) is and where it lives

The tool is built by `buildTool` (`yK`, `cli_inner_pretty.js:143482`) and bound to the global `JC` at `cli_inner_pretty.js:350025`. Its public name comes from the constant `wv = "ExitPlanMode"` (`cli_inner_pretty.js:143387`). Note the bundle keeps two constants with the *same string value*: the legacy V1 name `oG` (`143386`) and the V2 name `wv` (`143387`), both `"ExitPlanMode"`. Only `wv` is referenced by the `JC` tool definition (`350026`); the duplicate is a vestige of the V1→V2 migration where the public name was deliberately kept stable so the model's training and any cached prompts continue to resolve.

The tool sits at the "exit" side of the two-tool plan-mode pair. Its sibling is `EnterPlanMode` (`og = "EnterPlanMode"`, `143385`), and the validateInput error message of `ExitPlanMode` references that name to tell a confused model how to get back into plan mode (`350072`).

A handful of static surface fields establish the tool's character (`cli_inner_pretty.js:350025-350054`):

- `searchHint: "present plan for approval and start coding (plan mode only)"` (`350027`)
- `maxResultSizeChars: 1e5` (`350028`) — the tool_result carries the full plan text, so it needs a generous size budget.
- `shouldDefer: !0` (`350044`) — the tool is **always announced** in the deferred-tool list regardless of mode, which is why the model can mistakenly call it outside plan mode; `validateInput` exists precisely to reject those calls before the approval dialog appears.
- `isConcurrencySafe(){return !0}` (`350049-350051`) but `isReadOnly(){return !1}` (`350052-350054`) — it mutates session state (mode), but two simultaneous exit calls would not corrupt anything.
- `userFacingName(){return ""}` (`350041-350043`) — it renders its own bespoke UI rather than a generic "running ExitPlanMode" line.

---

## 2. Why the plan is read from disk, not passed as a parameter

### `normalizeToolInput` injects the plan from disk

**What it does.** Before the tool's `call()` runs, the runtime rewrites the model's tool input. `normalizeExitPlanModeToolInput` (`dH4`, `349140-349155`) takes whatever the model sent (which contains *no plan body*) and augments it with `plan` (read from the plan file), `planFilePath`, the `allowedPrompts` array (if the model supplied one), and the assistant message's token `usage`.

```javascript
// ============================================
// normalizeExitPlanModeToolInput - injects the on-disk plan, file path, allowedPrompts, usage
// Location: cli_inner_pretty.js:349140-349155
// ============================================

// ORIGINAL (for source lookup):
function dH4(H) {
  let $ = jV(H),
    q = DV() ?? "",
    K = wV(),
    _ = Array.isArray(H.input.allowedPrompts) ? H.input.allowedPrompts : void 0,
    z = H.assistantMessage.message.usage,
    A =
      z && typeof z.input_tokens === "number"
        ? { input_tokens: z.input_tokens, cache_creation_input_tokens: z.cache_creation_input_tokens, cache_read_input_tokens: z.cache_read_input_tokens }
        : void 0;
  return { ...$, plan: q, planFilePath: K, allowedPrompts: _, usage: A };
}

// READABLE (for understanding):
function normalizeExitPlanModeToolInput(toolUse) {
  let baseInput = normalizeBaseToolInput(toolUse);
  let planFromDisk = getPlan() ?? "";                 // DV() — read the plan file, "" on ENOENT
  let planFilePath = getPlanFilePath();               // wV()
  let allowedPrompts = Array.isArray(toolUse.input.allowedPrompts) ? toolUse.input.allowedPrompts : undefined;
  let usage = toolUse.assistantMessage.message.usage;
  let normalizedUsage =
    usage && typeof usage.input_tokens === "number"
      ? { input_tokens: usage.input_tokens, cache_creation_input_tokens: usage.cache_creation_input_tokens, cache_read_input_tokens: usage.cache_read_input_tokens }
      : undefined;
  return { ...baseInput, plan: planFromDisk, planFilePath, allowedPrompts, usage: normalizedUsage };
}

// Mapping: dH4->normalizeExitPlanModeToolInput, jV->normalizeBaseToolInput, DV->getPlan, wV->getPlanFilePath, H->toolUse, q->planFromDisk, K->planFilePath, _->allowedPrompts, z->usage, A->normalizedUsage
```

**How it works.** The model writes its plan to a plan file during plan mode (the plan-mode system message tells it where). When it later calls `ExitPlanMode`, the call carries an essentially empty input. `dH4` reads the file via `getPlan` (`DV`, `549253`) and stitches the content onto the input as `plan`. The internal `inputSchema` (`M$4`) deliberately does **not** declare a `plan` field — that field only appears on the SDK schema `bGf` (`350000-350005`) with the describe string `"injected by normalizeToolInput from disk"` (`350002`). This is why `call()` has to *narrow* `"plan" in H` (`350094`) rather than read a declared field.

**Why this approach.** Three reasons, in order of importance:

1. **Tamper resistance / single source of truth.** The user reviews the *file* (`renderToolResultMessage` shows the file path: "Plan saved to: …", `349895`). If the model could pass an arbitrary plan body in the tool call, it could request approval for plan A in the file while sneaking plan B through the tool argument. Reading from disk guarantees the approved artifact is exactly the one the user saw.
2. **Token economy.** A full implementation plan can be thousands of tokens. Putting it in the tool input would force the model to re-emit the entire plan as a tool argument — doubling its cost and risking truncation. Keeping the `tool_use` argument empty pushes that cost off the assistant turn.
3. **Edit reconciliation.** Because the file is canonical, an out-of-band edit (the `/plan` command, or the CCR web editor) is automatically reflected: the next `getPlan()` returns the edited text with no protocol round-trip.

**Key insight.** The tool name is literally accurate: it *signals* readiness; it does not *carry* the plan. The plan flows through the filesystem, and the tool is just the approval handshake. The one exception — an edited plan arriving back through `H.plan` — is the only path that *writes* to the file, covered next.

### `getPlanFilePath` / `getPlan` — the on-disk location

`getPlanFilePath` (`wV`, `549248-549252`) computes `<plansDir>/<slug>.md` for the main session, or `<plansDir>/<slug>-agent-<agentId>.md` for a subagent. `getPlan` (`DV`, `549253-549261`) reads it with `readFileSync(..., 'utf-8')` and returns `null` on ENOENT (`P8(q)` is the ENOENT predicate, `549258`). Per-agent suffixing means each teammate gets its own plan file, which is essential for the teammate approval branch where multiple agents may be planning in parallel.

---

## 3. The tool object surface: schemas, prompt, and gates

### 3.1 Schemas (`IL_` / `M$4` / `bGf` / `CL_`)

```javascript
// ============================================
// ExitPlanMode schemas - allowedPrompt item, input, SDK input, output
// Location: cli_inner_pretty.js:349982-350024
// ============================================

// ORIGINAL (for source lookup):
(IL_ = yH(() => y.object({ tool: y.enum(["Bash"]).describe("The tool this prompt applies to"), prompt: y.string().describe('Semantic description of the action, e.g. "run tests", "install dependencies"') })));
(M$4 = yH(() => y.strictObject({ allowedPrompts: y.array(IL_()).optional().describe("Prompt-based permissions needed to implement the plan. These describe categories of actions rather than specific commands.") }).passthrough()));
(bGf = yH(() => M$4().extend({ plan: y.string().optional().describe("The plan content (injected by normalizeToolInput from disk)"), planFilePath: y.string().optional().describe("The plan file path (injected by normalizeToolInput)") })));
(CL_ = yH(() => y.object({ plan: y.string().nullable().describe("The plan that was presented to the user"), isAgent: y.boolean(), filePath: y.string().optional(), hasTaskTool: y.boolean().optional(), planWasEdited: y.boolean().optional(), awaitingLeaderApproval: y.boolean().optional(), requestId: y.string().optional() })));

// READABLE (for understanding):
const allowedPromptSchema = lazy(() => z.object({
  tool: z.enum(["Bash"]).describe("The tool this prompt applies to"),
  prompt: z.string().describe('Semantic description of the action, e.g. "run tests", "install dependencies"'),
}));
const exitPlanModeInputSchema = lazy(() => z.strictObject({
  allowedPrompts: z.array(allowedPromptSchema()).optional().describe("Prompt-based permissions needed to implement the plan ..."),
}).passthrough());
const exitPlanModeSdkInputSchema = lazy(() => exitPlanModeInputSchema().extend({
  plan: z.string().optional().describe("The plan content (injected by normalizeToolInput from disk)"),
  planFilePath: z.string().optional().describe("The plan file path (injected by normalizeToolInput)"),
}));
const exitPlanModeOutputSchema = lazy(() => z.object({
  plan: z.string().nullable(),
  isAgent: z.boolean(),
  filePath: z.string().optional(),
  hasTaskTool: z.boolean().optional(),
  planWasEdited: z.boolean().optional(),
  awaitingLeaderApproval: z.boolean().optional(),
  requestId: z.string().optional(),
}));

// Mapping: IL_->allowedPromptSchema, M$4->exitPlanModeInputSchema, bGf->exitPlanModeSdkInputSchema, CL_->exitPlanModeOutputSchema, yH->lazy, y->z
```

**Why a `strictObject(...).passthrough()` for the model-facing input?** `strictObject` forbids the model from inventing fields *it* knows about (so the schema is a tight contract), but `.passthrough()` re-admits unknown keys at validation time — which is exactly what allows `normalizeToolInput` to graft `plan`/`planFilePath` on without tripping strict validation. The split into a separate SDK schema (`bGf`) that *declares* `plan`/`planFilePath` is the type-level documentation of "these are runtime-injected, not model-supplied."

**Why is `plan` on the output `nullable()` but the other six fields `optional()`?** `plan` is always present in the output object (`call()` always returns `data.plan`), but it can legitimately be the empty/absent plan, hence `nullable`. The rest (`filePath`, `hasTaskTool`, `planWasEdited`, `awaitingLeaderApproval`, `requestId`) are branch-specific and simply absent when not applicable — `optional` models "this key may not be in the object at all," which is how `call()` returns them (e.g. `hasTaskTool: D || void 0`, `350166`, deletes the key when false).

### 3.2 The model-facing prompt (`$$4`)

The prompt (`$$4`, `349781-349804`) is the "external stub" version: it explains that the tool reads the plan from the file (not as a parameter, `349785`), restricts use to *implementation* planning (not research, `349790`), and — importantly — forbids using `AskUserQuestion` to ask "Is this plan okay?" because *this* tool is the approval mechanism (`349797`). Notably it contains **no** `allowedPrompts` guidance: the v2.1.88 source file header is explicit that this stub "excludes Ant-only allowedPrompts section." That omission is the first signal that `allowedPrompts` is an internal/experimental capability — see §12.

### 3.3 `isEnabled` — disabled only with channels + non-interactive

```javascript
// ============================================
// isEnabled - ExitPlanMode is hidden only when remote channels are active AND non-interactive
// Location: cli_inner_pretty.js:350045-350048
// ============================================

// ORIGINAL (for source lookup):
isEnabled() {
  if (uw().length > 0 && R6()) return !1;
  return !0;
}

// READABLE (for understanding):
isEnabled() {
  if (getAllowedChannels().length > 0 && isNonInteractive()) return false; // channels active + no TUI
  return true;
}

// Mapping: uw->getAllowedChannels, R6->isNonInteractive
```

**What it does.** Hides the tool entirely when the user is driving the session over a remote channel (`--channels`, e.g. Telegram/Discord) **and** the session is non-interactive (`isNonInteractive`, `R6`, `2742-2744`, returns `!d$.isInteractive`).

**Why this approach.** With channels active and no TUI, the approval dialog ("Exit plan mode?") has no surface to render on — it would hang the model forever waiting on an answer the user can never give. The v2.1.88 rationale notes that `EnterPlanMode` is gated identically so that plan mode "isn't a trap": if you cannot *exit* plan mode in this configuration, you must not be able to *enter* it either. **Trade-off:** rather than try to render approval over the channel (complex, channel-specific), the team chose the simpler defensive move of removing the tool from the model's available set in that configuration.

**Key insight.** This is a *symmetry* invariant maintained across two tools: the enable conditions of `EnterPlanMode` and `ExitPlanMode` are kept in lockstep so plan mode is always escapable. (In the bundle the v2.1.88 `feature('KAIROS')`/`feature('KAIROS_CHANNELS')` flags are collapsed to the plain `uw().length > 0 && R6()` check.)

### 3.4 `requiresUserInteraction` — teammates skip it

`requiresUserInteraction()` returns `false` for teammates (`FA()`, `350056`) and `true` otherwise. A teammate's approval flows through its team lead's mailbox, not the local TUI, so demanding local interaction would deadlock the teammate.

---

## 4. `validateInput` — reject calls made outside plan mode

```javascript
// ============================================
// validateInput - reject ExitPlanMode unless mode==='plan' (teammates bypass)
// Location: cli_inner_pretty.js:350059-350077
// ============================================

// ORIGINAL (for source lookup):
async validateInput(H, $) {
  let { options: q } = $;
  if (FA()) return { result: !0 };
  let K = T6($).mode;
  if (K !== "plan")
    return (
      d("tengu_exit_plan_mode_called_outside_plan", { model: q.mainLoopModel, mode: K, hasExitedPlanModeInSession: m7$() }),
      { result: !1, message: `You are not in plan mode. To enter plan mode, call the ${og} tool first. If your plan was already approved, continue with implementation.`, errorCode: 1 }
    );
  return { result: !0 };
}

// READABLE (for understanding):
async validateInput(input, context) {
  let { options } = context;
  if (isTeammate()) return { result: true };                          // FA() — teammate AppState may reflect leader's mode
  let mode = getToolPermissionContext(context).mode;
  if (mode !== "plan") {
    logEvent("tengu_exit_plan_mode_called_outside_plan", { model: options.mainLoopModel, mode, hasExitedPlanModeInSession: hasExitedPlanModeInSession() });
    return {
      result: false,
      message: `You are not in plan mode. To enter plan mode, call the ${ENTER_PLAN_MODE_TOOL_NAME} tool first. If your plan was already approved, continue with implementation.`,
      errorCode: 1,
    };
  }
  return { result: true };
}

// Mapping: FA->isTeammate, T6->getToolPermissionContext, m7$->hasExitedPlanModeInSession, og->ENTER_PLAN_MODE_TOOL_NAME, d->logEvent, K->mode, q->options
```

**What it does.** Rejects the call (before the approval dialog) when the session is not in `plan` mode, returning a corrective message and firing the `tengu_exit_plan_mode_called_outside_plan` telemetry event.

**How it works — and why the early teammate return matters.** The very first line short-circuits for teammates (`350061`). This is deliberate: a teammate's `AppState.mode` can mirror the *leader's* mode rather than its own plan-mode state, so the `mode !== "plan"` check would produce false rejections. By returning `{result:true}` early, teammates always pass validation and let `call()`'s teammate branch decide the real behavior. For non-teammates, the mode is read from the resolved permission context (`getToolPermissionContext`, `T6`, `453162`).

**Why a telemetry event with `hasExitedPlanModeInSession`?** Because `shouldDefer` keeps the tool announced even after plan mode ends (so the model can re-call it after a `/compact` or `/clear` that drops the plan-mode context), a model that *already exited* plan mode frequently re-calls `ExitPlanMode`. The event carries `hasExitedPlanModeInSession` (`m7$`, `3035`) precisely so the team can distinguish "model is confused and stuck in plan mode" from the benign "model already exited and is re-firing." **Trade-off:** the alternative — removing the tool from the deferred list once mode leaves `plan` — would break the legitimate re-call path and complicate the deferred-tool machinery; logging-and-rejecting is the cheaper, observable choice.

**The 2.1.156 message change.** In v2.1.88 (`ExitPlanModeV2Tool.ts:215`) the message read "You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation." v2.1.156 keeps the "You are not in plan mode." prefix and the "If your plan was already approved…" suffix verbatim, and replaces only the *middle* sentence: "This tool is only for exiting plan mode after writing a plan." → "To enter plan mode, call the `${og}` (EnterPlanMode) tool first." (`350072`). So this is a single-sentence substitution, not a full-message rewrite. The new middle sentence is more actionable: it names the concrete tool the model should call to recover, rather than describing the tool's purpose. See the cross-version table in §16.

---

## 5. `checkPermissions` — "Exit plan mode?" vs teammate allow

```javascript
// ============================================
// checkPermissions - ask the user vs auto-allow for teammates
// Location: cli_inner_pretty.js:350078-350081
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions(H, $) {
  if (FA()) return { behavior: "allow", updatedInput: H };
  return { behavior: "ask", message: "Exit plan mode?", updatedInput: H };
}

// READABLE (for understanding):
async checkPermissions(input, context) {
  if (isTeammate()) return { behavior: "allow", updatedInput: input };      // approval handled via mailbox/leader
  return { behavior: "ask", message: "Exit plan mode?", updatedInput: input };
}

// Mapping: FA->isTeammate
```

For teammates the permission UI is bypassed (`behavior:"allow"`) because surfacing a local permission request would send a stray `permission_request` and there is no local user to answer it — the v2.1.88 comment is explicit that `call()` then handles the right behavior (leader approval for required plan mode, local exit otherwise). For everyone else it returns `behavior:"ask"` with the literal prompt `"Exit plan mode?"`. The `updatedInput` echo is the hook the CCR/Ctrl+G edit path uses: a user editing the plan replaces `updatedInput.plan`, which then surfaces in `call()` as `H.plan`.

---

## 6. `call()` walkthrough — the shared prelude

```javascript
// ============================================
// call() prelude - disk read + edited-plan writeback + re-snapshot
// Location: cli_inner_pretty.js:350085-350100
// ============================================

// ORIGINAL (for source lookup):
async call(H, $, q, K, _) {
  let z = null, A = null;
  [z, A] = await Promise.all([ Promise.resolve().then(() => (x6H(), B_H)), Promise.resolve().then(() => (wD(), IL8)) ]);
  let Y = !!$.agentId,
    f = wV($.agentId),
    O = "plan" in H && typeof H.plan === "string" ? H.plan : void 0,
    M = O ?? DV($.agentId);
  if (O !== void 0 && f)
    (await O$4.writeFile(f, O, "utf-8").catch((J) => N(`Failed to persist plan to ${f}: ...`, { level: "error" })), CL8());

// READABLE (for understanding):
async call(input, context, _canUseTool, _assistantMsg, addNotification) {
  let autoModeController = null, autoModeGate = null;
  [autoModeController, autoModeGate] = await Promise.all([ lazyImportAutoModeController(), lazyImportAutoModeGate() ]);
  let isAgent = !!context.agentId;
  let filePath = getPlanFilePath(context.agentId);                         // wV()
  let editedPlan = "plan" in input && typeof input.plan === "string" ? input.plan : undefined; // CCR/Ctrl+G edit
  let plan = editedPlan ?? getPlan(context.agentId);                       // disk fallback
  if (editedPlan !== undefined && filePath) {
    await writeFile(filePath, editedPlan, "utf-8").catch(e => logError(`Failed to persist plan to ${filePath}: ...`));
    persistFileSnapshotIfRemote();                                         // CL8() — re-snapshot the edited plan
  }
  // ... branch on teammate vs main ...

// Mapping: wV->getPlanFilePath, DV->getPlan, CL8->persistFileSnapshotIfRemote, O->editedPlan, M->plan, f->filePath, Y->isAgent, z->autoModeController, A->autoModeGate, _->addNotification
```

### The edited-plan write-back — the one path that honors `H.plan`

**What it does.** When (and only when) an edited plan arrived via `H.plan` (`editedPlan !== undefined`), `call()` writes it back to the plan file and re-snapshots (`350096-350100`).

**How it works.** `editedPlan` is `undefined` for the normal flow (because `dH4` injects `plan` but `call` reads the narrowed `"plan" in H` field, which is the *SDK* `plan`, only populated when the permission system replaced `updatedInput`). The CCR web UI (or a local Ctrl+G edit) full-replaces `finalInput` via `permissionResult.updatedInput` — so an edit shows up as a real `H.plan` string. The narrowing `"plan" in H && typeof H.plan === "string"` (`350094`) is what distinguishes "user edited the plan" from "no edit / disk fallback."

**Why re-snapshot here specifically.** There are two `persistFileSnapshotIfRemote` call sites. The *other* one fires inside `normalizeToolInput` (pre-permission) and therefore captured the **old** plan. If the user edits the plan during the approval dialog, the pre-permission snapshot is now stale. Re-snapshotting in `call()` after the write-back (`350100`) ensures any remote transcript reflects the *approved, edited* plan, not the draft. **Trade-off:** the cost is a second snapshot write; the alternative — snapshotting only post-permission — would lose the snapshot entirely if the call is rejected before `call()` runs. So the design snapshots twice and accepts the redundant write to keep both the draft and the final captured.

**Key insight.** `planWasEdited` (returned later as `O !== void 0 || void 0`, `350166`) is *defined* by this very narrowing: an edit is "the user replaced `updatedInput.plan`." It drives the `## Approved Plan (edited by user):` label in the tool_result, which downstream parsers recognize (§11, §13).

---

## 7. `call()` TEAMMATE branch — leader approval via mailbox

```javascript
// ============================================
// call() teammate branch - post plan_approval_request, mark awaitingPlanApproval, return awaitingLeaderApproval
// Location: cli_inner_pretty.js:350101-350120
// ============================================

// ORIGINAL (for source lookup):
if (FA() && NY$()) {
  if (!M) throw Error(`No plan file found at ${f}. Please write your plan to this file before calling ExitPlanMode.`);
  let J = ZA() || "unknown", X = c_(), L = gUH("plan_approval", Ei(J, X || "default")),
    P = { type: "plan_approval_request", from: J, timestamp: new Date().toISOString(), planFilePath: f, planContent: M, requestId: L };
  await aA("team-lead", { from: J, text: IH(P), timestamp: new Date().toISOString() }, X);
  let Z = $.getAppState(), W = SL8(J, Z);
  if (W) ou6(W, $.taskRegistry, !0);
  return { data: { plan: M, isAgent: !0, filePath: f, awaitingLeaderApproval: !0, requestId: L } };
}

// READABLE (for understanding):
if (isTeammate() && isPlanModeRequired()) {
  if (!plan) throw new Error(`No plan file found at ${filePath}. Please write your plan to this file before calling ExitPlanMode.`);
  let agentName = getAgentName() || "unknown";
  let teamName = getTeamName();
  let requestId = generateRequestId("plan_approval", formatAgentId(agentName, teamName || "default"));
  let approvalRequest = { type: "plan_approval_request", from: agentName, timestamp: new Date().toISOString(), planFilePath: filePath, planContent: plan, requestId };
  await writeToMailbox("team-lead", { from: agentName, text: jsonStringify(approvalRequest), timestamp: new Date().toISOString() }, teamName);
  let appState = context.getAppState();
  let taskId = findInProcessTeammateTaskId(agentName, appState);          // SL8()
  if (taskId) setAwaitingPlanApproval(taskId, context.taskRegistry, true); // ou6()
  return { data: { plan, isAgent: true, filePath, awaitingLeaderApproval: true, requestId } };
}

// Mapping: FA->isTeammate, NY$->isPlanModeRequired, ZA->getAgentName, c_->getTeamName, gUH->generateRequestId, Ei->formatAgentId, aA->writeToMailbox, IH->jsonStringify, SL8->findInProcessTeammateTaskId, ou6->setAwaitingPlanApproval, J->agentName, X->teamName, L->requestId, M->plan, f->filePath
```

**What it does.** A teammate operating under *required* plan mode does not exit locally. It packages a `plan_approval_request` and writes it to the `team-lead` mailbox, marks its own in-process task as `awaitingPlanApproval`, and returns `awaitingLeaderApproval:true` to the model.

**How it works — the gate `FA() && NY$()`.** Two predicates must both hold: `isTeammate` (`FA`, `99280`: either an active subagent context `XZ()`, or `UB.agentId && UB.teamName`) **and** `isPlanModeRequired` (`NY$`, `99289`: `planModeRequired` from the subagent/UB context, falling back to the `CLAUDE_CODE_PLAN_MODE_REQUIRED` env var). The hard `throw` when `!plan` (`350102-350103`) is intentional: a required-plan-mode teammate that calls `ExitPlanMode` with no plan on disk is a protocol violation, and failing loudly forces the teammate to write the file first. The mailbox write (`aA`, `338306`) atomically locks the inbox file and appends the message; the recipient is the literal string `"team-lead"`. After posting, it finds its own task by agent name (`findInProcessTeammateTaskId`, `SL8`, `349768` — scans `appState.tasks` for an in-process teammate task whose `identity.agentName` matches) and flips `awaitingPlanApproval` (`setAwaitingPlanApproval`, `ou6`, `349772`) so the UI/state shows it is blocked.

**Why two separate exit paths.** A team lead reviewing teammate plans needs a single chokepoint: every required-plan-mode teammate routes its plan to one inbox, where the lead approves/rejects in order. If teammates exited locally, the lead would lose control of when work starts, defeating the whole point of "plan mode required." **Alternative considered:** have the teammate block on a synchronous RPC to the lead — but mailbox files are crash-safe, replayable, and decouple the teammate from the lead's availability, which an in-memory RPC is not. **Trade-off:** the mailbox indirection adds latency and a polling/inbox-check obligation on both sides (the tool_result literally instructs "Check your inbox for response", `350186`), in exchange for durability and ordering.

**The voluntary-teammate fall-through.** A teammate where `FA()` is true but `NY$()` is false (voluntary plan mode) does **not** enter this branch — it falls through to the MAIN branch and exits locally, exactly like a non-teammate. This is the difference between "plan mode is mandatory and gated by the lead" and "the teammate chose to plan and can release itself."

**Key insight.** `requestId` is generated with `generateRequestId('plan_approval', formatAgentId(agentName, teamName||'default'))` (`350106`) so it encodes *who* requested approval and *when* (`gUH` = `prefix-timestamp@team`, `99008`). The same `requestId` is returned to the model and embedded in the tool_result (`350188`), giving an end-to-end correlation key across the mailbox round-trip.

---

## 8. `call()` MAIN branch — auto-mode circuit-breaker fallback

```javascript
// ============================================
// call() auto-mode gate fallback - if prePlanMode was 'auto' but the gate is off, fall back to default + notify
// Location: cli_inner_pretty.js:350121-350143
// ============================================

// ORIGINAL (for source lookup):
let j = null;
{
  let J = T6($).prePlanMode ?? "default";
  if (J === "auto" && !(A?.isAutoModeGateEnabled() ?? !1)) {
    let X = A?.getAutoModeUnavailableReason() ?? "circuit-breaker";
    ((j = A?.getAutoModeUnavailableNotification(X) ?? "auto mode unavailable"),
      N(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${J} but gate is off (reason=${X}) — falling back to default on plan exit`, { level: "warn" }));
  }
}
if (j)
  _?.({ type: "notification", notification: { key: "auto-mode-gate-plan-exit-fallback", text: `plan exit → default · ${j}`, priority: "immediate", color: "warning", timeoutMs: 1e4 } });

// READABLE (for understanding):
let autoModeUnavailableMsg = null;
{
  let prePlanMode = getToolPermissionContext(context).prePlanMode ?? "default";
  if (prePlanMode === "auto" && !(autoModeGate?.isAutoModeGateEnabled() ?? false)) {
    let reason = autoModeGate?.getAutoModeUnavailableReason() ?? "circuit-breaker";
    autoModeUnavailableMsg = autoModeGate?.getAutoModeUnavailableNotification(reason) ?? "auto mode unavailable";
    logWarn(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=auto but gate is off (reason=${reason}) — falling back to default on plan exit`);
  }
}
if (autoModeUnavailableMsg)
  addNotification?.({ type: "notification", notification: { key: "auto-mode-gate-plan-exit-fallback", text: `plan exit → default · ${autoModeUnavailableMsg}`, priority: "immediate", color: "warning", timeoutMs: 10000 } });

// Mapping: T6->getToolPermissionContext, A->autoModeGate, N->logWarn, j->autoModeUnavailableMsg, J->prePlanMode, X->reason, _->addNotification
```

**What it does.** Plan mode remembers the mode you were in *before* you entered it as `prePlanMode`. On exit, the tool normally restores that mode. But if `prePlanMode` was `"auto"` and the auto-mode gate is currently **disabled** (the circuit breaker tripped, or settings turned it off), restoring `"auto"` would be a security regression — so the tool falls back to `"default"` and shows a warning notification `auto-mode-gate-plan-exit-fallback`.

**Why this is a security defense, not a convenience.** The v2.1.88 comment is unambiguous: without this fallback, `ExitPlanMode` would "bypass the circuit breaker by calling `setAutoModeActive(true)` directly." Auto mode lets the agent run commands without per-action approval. The circuit breaker exists to *kill* auto mode when something looks wrong (e.g. repeated dangerous attempts). If plan mode could unconditionally restore the pre-plan `auto` state, an agent could enter plan mode to "launder" away a tripped breaker and resume unrestricted execution. The gate check (`isAutoModeGateEnabled()`, `350124`/`350149`) ensures the restore *respects the current safety state* rather than the stale pre-plan state.

**Key insight.** The two reads of the gate are intentionally redundant: once to *decide whether to notify* (`350124`) and once to *decide the actual restored mode* (`350149`, `J = "default"`). Splitting the notification computation from the mode mutation keeps the user-visible warning and the actual state change derived from the same condition, so they can never disagree. **Trade-off:** restoring to `default` instead of `auto` is mildly surprising to a user who expected auto mode back — but the warning notification (10s, `warning` color) makes the downgrade explicit, which is the right side of the safety/UX trade.

---

## 9. `call()` MAIN branch — mode restore, state flags, telemetry, dangerous-perms strip

```javascript
// ============================================
// call() mode restore - flip exit flags, restore prePlanMode, telemetry, strip/restore auto-mode perms
// Location: cli_inner_pretty.js:350144-350162
// ============================================

// ORIGINAL (for source lookup):
let w = T6($);
if (w.mode === "plan") {
  (zQ(!0), Gt(!0));
  let J = w.prePlanMode ?? "default";
  {
    if (J === "auto" && !(A?.isAutoModeGateEnabled() ?? !1)) J = "default";
    let P = J === "auto", Z = z?.isAutoModeActive() ?? !1;
    if ((z?.setAutoModeActive(P), Z && !P)) PR(!0);
  }
  t1H({ from: "plan", to: J, trigger: "exit_plan_mode" });
  let X = J === "auto", L = w.strippedDangerousRules;
  $.setToolPermissionContext((P) => {
    let Z = P;
    if (X) Z = A?.stripDangerousPermissionsForAutoMode(Z) ?? Z;
    else if (L) Z = A?.restoreDangerousPermissions(Z) ?? Z;
    return { ...Z, mode: J, prePlanMode: void 0 };
  });
}

// READABLE (for understanding):
let ctx = getToolPermissionContext(context);
if (ctx.mode === "plan") {
  setHasExitedPlanMode(true);                 // zQ() — session-level flag
  setNeedsPlanModeExitAttachment(true);       // Gt() — schedule the plan-exit attachment for next turn
  let targetMode = ctx.prePlanMode ?? "default";
  {
    if (targetMode === "auto" && !(autoModeGate?.isAutoModeGateEnabled() ?? false)) targetMode = "default";
    let wantsAuto = targetMode === "auto";
    let wasAuto = autoModeController?.isAutoModeActive() ?? false;
    autoModeController?.setAutoModeActive(wantsAuto);
    if (wasAuto && !wantsAuto) onAutoModeDeactivated(true);   // PR()
  }
  logPermissionModeChanged({ from: "plan", to: targetMode, trigger: "exit_plan_mode" }); // t1H()
  let restoringAuto = targetMode === "auto";
  let hadStrippedRules = ctx.strippedDangerousRules;
  context.setToolPermissionContext((prev) => {
    let next = prev;
    if (restoringAuto) next = autoModeGate?.stripDangerousPermissionsForAutoMode(next) ?? next;
    else if (hadStrippedRules) next = autoModeGate?.restoreDangerousPermissions(next) ?? next;
    return { ...next, mode: targetMode, prePlanMode: undefined };
  });
}

// Mapping: T6->getToolPermissionContext, zQ->setHasExitedPlanMode, Gt->setNeedsPlanModeExitAttachment, t1H->logPermissionModeChanged, PR->onAutoModeDeactivated, z->autoModeController, A->autoModeGate, w->ctx, J->targetMode, X->restoringAuto, L->hadStrippedRules
```

**What it does.** When the resolved mode is still `plan`, the tool performs the actual transition: marks the session as having exited plan mode, schedules the plan-exit attachment, restores the target mode (with the auto-mode safety override), syncs the auto-mode controller, emits telemetry, and reconciles the dangerous-permission set.

**Step-by-step.**
1. `setHasExitedPlanMode(true)` (`zQ`, `3038`) and `setNeedsPlanModeExitAttachment(true)` (`Gt`, `3044`). The first is the session flag the validateInput telemetry reads (`m7$`); the second tells the next turn to inject a "you have left plan mode" attachment so the model's context reflects the transition.
2. Compute `targetMode = prePlanMode ?? "default"`, then apply the *same* auto-gate override as §8 (`350149`).
3. Sync the auto-mode controller: `setAutoModeActive(wantsAuto)`; if it *was* active and is no longer, call `onAutoModeDeactivated(true)` (`PR`, `350152`) to run deactivation side-effects.
4. `logPermissionModeChanged({from:"plan", to:targetMode, trigger:"exit_plan_mode"})` (`t1H`, `222562`). This event **no-ops when `from === to`** (`222563`) — so exiting to plan (impossible here) or a same-mode transition produces no noise.
5. Reconcile dangerous permissions inside the `setToolPermissionContext` updater: if restoring auto, **strip** dangerous permissions for auto mode; else if we had previously stripped rules (`strippedDangerousRules`), **restore** them. Finally set `mode: targetMode` and clear `prePlanMode`.

**Why strip vs restore is symmetric and stateful.** Auto mode deliberately removes certain dangerous permission rules so an autonomous agent can't, e.g., `rm -rf` without friction. Those stripped rules are remembered in `strippedDangerousRules`. On exit: if we are *re-entering* auto, we strip again (the rules should stay removed); if we are *leaving* auto for default, we must put the stripped rules back so the user regains their full permission set. **Alternative considered:** unconditionally restoring on every plan exit — but that would re-grant dangerous permissions even when the user is going *back into* auto mode, reintroducing exactly the risk auto mode was designed to remove. The conditional keeps the permission set consistent with the destination mode.

**Key insight.** Every state mutation here is funneled through the single `setToolPermissionContext` updater so the mode change, the prePlanMode clear, and the dangerous-rule reconciliation happen **atomically** in one context replacement. Spreading them across multiple writes would risk a torn intermediate state where, say, the mode is `default` but the dangerous rules haven't been restored yet.

---

## 10. `call()` MAIN branch — `hasTaskTool` detection

```javascript
// ============================================
// call() hasTaskTool - is Agent-swarm enabled AND the Agent tool present?
// Location: cli_inner_pretty.js:350164-350167
// ============================================

// ORIGINAL (for source lookup):
let D = R7() && $.options.tools.some((J) => h1(J, sq));
return { data: { plan: M, isAgent: Y, filePath: f, hasTaskTool: D || void 0, planWasEdited: O !== void 0 || void 0 } };

// READABLE (for understanding):
let hasTaskTool = isAgentSwarmsEnabled() && context.options.tools.some(tool => toolMatchesName(tool, AGENT_TOOL_NAME));
return { data: { plan, isAgent, filePath, hasTaskTool: hasTaskTool || undefined, planWasEdited: editedPlan !== undefined || undefined } };

// Mapping: R7->isAgentSwarmsEnabled, h1->toolMatchesName, sq->AGENT_TOOL_NAME, D->hasTaskTool, M->plan, Y->isAgent, f->filePath, O->editedPlan
```

**What it does.** Computes whether the model could parallelize the approved plan across a team of agents, by checking two conditions: Agent-swarm feature is enabled **and** the `Agent` tool is actually in the current tool set.

**How it works.** `isAgentSwarmsEnabled` (`R7`, `240766`) requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` (or `Ru5()`) **and** the `tengu_amber_flint` feature flag (`240768`). The tool-presence check uses `toolMatchesName` (`h1`, `143452`: `tool.name === "Agent" || aliases.includes("Agent")`). Both must be true, otherwise `hasTaskTool` is normalized to `undefined` via `D || void 0` so the output field is *omitted* rather than set to `false`.

**Why `D || void 0`.** The output schema marks `hasTaskTool` as `optional()`, not `nullable()`. The idiomatic way to "omit when false" is `value || undefined`, which drops the key entirely when falsy. This keeps the tool_result clean: only when team-parallelization is genuinely available does the result append the `TeamCreate` suggestion (§11) — a model in a non-swarm session never even sees the hint.

**Key insight.** This double gate (feature + tool present) avoids dangling advice. Suggesting `TeamCreate` when the `Agent` tool isn't loaded would tell the model to use a tool it cannot call. The detection is computed at exit time (not statically) because tool availability can vary per session.

---

## 11. `mapToolResultToToolResultBlockParam` — four result branches and the `## Approved Plan:` contract

```javascript
// ============================================
// mapToolResultToToolResultBlockParam - 4 branches: awaitingLeaderApproval / isAgent / empty plan / approved
// Location: cli_inner_pretty.js:350169-350219
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam({ isAgent: H, plan: $, filePath: q, hasTaskTool: K, planWasEdited: _, awaitingLeaderApproval: z, requestId: A }, Y) {
  if (z) return { type: "tool_result", content: `Your plan has been submitted to the team lead for approval.\n\nPlan file: ${q}\n\n... Request ID: ${A}`, tool_use_id: Y };
  if (H) return { type: "tool_result", content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"', tool_use_id: Y };
  if (!$ || $.trim() === "") return { type: "tool_result", content: "User has approved exiting plan mode. You can now proceed.", tool_use_id: Y };
  let f = K ? `\n\nIf this plan can be broken down into multiple independent tasks, consider using the ${rd} tool to create a team and parallelize the work.` : "";
  return { type: "tool_result", content: `User has approved your plan. You can now start coding. ... ## ${_ ? "Approved Plan (edited by user)" : "Approved Plan"}:\n${$}`, tool_use_id: Y };
}

// READABLE (for understanding):
mapToolResultToToolResultBlockParam(output, toolUseId) {
  let { isAgent, plan, filePath, hasTaskTool, planWasEdited, awaitingLeaderApproval, requestId } = output;
  // Branch 1: teammate posted to leader — tell it to wait and check inbox
  if (awaitingLeaderApproval) return { type: "tool_result", content: `Your plan has been submitted to the team lead for approval.\n\nPlan file: ${filePath}\n\n... Request ID: ${requestId}`, tool_use_id: toolUseId };
  // Branch 2: agent (non-leader-approval) — minimal "ok"
  if (isAgent) return { type: "tool_result", content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"', tool_use_id: toolUseId };
  // Branch 3: empty plan — just proceed
  if (!plan || plan.trim() === "") return { type: "tool_result", content: "User has approved exiting plan mode. You can now proceed.", tool_use_id: toolUseId };
  // Branch 4: approved plan — echo full plan under the ## Approved Plan: marker (+ optional team hint)
  let teamHint = hasTaskTool ? `\n\nIf this plan can be broken down into multiple independent tasks, consider using the ${TEAM_CREATE_TOOL_NAME} tool to create a team and parallelize the work.` : "";
  return { type: "tool_result", content: `User has approved your plan. You can now start coding. ...${teamHint}\n\n## ${planWasEdited ? "Approved Plan (edited by user)" : "Approved Plan"}:\n${plan}`, tool_use_id: toolUseId };
}

// Mapping: rd->TEAM_CREATE_TOOL_NAME, H->isAgent, $->plan, q->filePath, K->hasTaskTool, _->planWasEdited, z->awaitingLeaderApproval, A->requestId, Y->toolUseId
```

**What it does.** Converts the structured `call()` output into the `tool_result` block the model sees, choosing one of four mutually exclusive content strings.

**How the four branches order matters.**
1. `awaitingLeaderApproval` first (`350173`): a teammate that posted to the lead must be told to *wait* and check its inbox; the `requestId` is embedded for correlation. This branch must win even though `isAgent` is also true for teammates.
2. `isAgent` (`350191`): a non-leader-approval agent gets a terse `respond with "ok"` — it has no further action.
3. Empty plan (`350197`): if the plan is missing/blank, there's nothing to echo, so just `"You can now proceed."`
4. The approved-plan branch (`350208`): echoes the **full plan text** under the `## Approved Plan:` heading (or `## Approved Plan (edited by user):` when `planWasEdited`), optionally appending the `TeamCreate` hint when `hasTaskTool`.

**Why echo the entire plan back to the model.** This is the crux. The `## Approved Plan:` marker is not just for the model's benefit — it is a **machine-parseable contract**. `extractApprovedPlan` (`B4z`, `503257`) string-searches the tool_result for exactly `## Approved Plan (edited by user):` or `## Approved Plan:` and slices out the plan text (`503260-503267`). If the marker is absent, it **throws** a descriptive error (`503269`) noting the remote may have hit the empty-plan or isAgent branch. This is the Ultraplan CCR "teleport" flow: when planning happens on a remote (web) instance, the local CLI recovers the approved plan by parsing this tool_result. **That is why the approved branch always inlines the full plan rather than just a file path** — a remote consumer may not share the local filesystem, so the plan text must travel in the message.

**Key insight.** The empty/isAgent branches deliberately use *different* text without the marker, which is precisely the failure mode `extractApprovedPlan`'s error message warns about. The branch ordering and the marker are co-designed: only the "real approval of a non-empty plan" path emits the contract string, and any deviation produces a loud, diagnosable error downstream rather than a silent empty plan.

---

## 12. The `allowedPrompts` Bash pre-authorization — present in schema, gated OFF

```javascript
// ============================================
// buildPlanExitPermissionUpdates - setMode + (gated) allowedPrompts -> session Bash allow rules
// Location: cli_inner_pretty.js:589766-589776 ; gate 209900-209902 ; rule fmt 209897-209899
// ============================================

// ORIGINAL (for source lookup):
function i9q(H, $) {
  let q = [{ type: "setMode", mode: Yi(H), destination: "session" }];
  if (jwH() && $ && $.length > 0)
    q.push({ type: "addRules", rules: $.map((K) => ({ toolName: K.tool, ruleContent: z97(K.prompt) })), behavior: "allow", destination: "session" });
  return q;
}
function z97(H) { return `prompt: ${H.trim()}`; }
function jwH() { return !1; }

// READABLE (for understanding):
function buildPlanExitPermissionUpdates(mode, allowedPrompts) {
  let updates = [{ type: "setMode", mode: mapModeToExternal(mode), destination: "session" }];  // Yi()
  if (isPromptBasedPermissionsEnabled() && allowedPrompts && allowedPrompts.length > 0)        // jwH() === false in 2.1.156
    updates.push({
      type: "addRules",
      rules: allowedPrompts.map(p => ({ toolName: p.tool, ruleContent: formatPromptRule(p.prompt) })), // "prompt: run tests"
      behavior: "allow",
      destination: "session",
    });
  return updates;
}
function formatPromptRule(prompt) { return `prompt: ${prompt.trim()}`; }
function isPromptBasedPermissionsEnabled() { return false; }  // hardcoded OFF

// Mapping: i9q->buildPlanExitPermissionUpdates, Yi->mapModeToExternal, jwH->isPromptBasedPermissionsEnabled, z97->formatPromptRule, H->mode, $->allowedPrompts
```

**What it does (and doesn't).** The schema lets the model declare `allowedPrompts` — semantic Bash permissions like `{tool:"Bash", prompt:"run tests"}` — that "the plan needs." `buildPlanExitPermissionUpdates` (`i9q`, `589766`) is the only place these become real permission rules: it would turn each into a session-scoped `allow` rule with `ruleContent` `"prompt: run tests"` (`formatPromptRule`, `z97`, `209897`). **But** the entire `addRules` push is guarded by `isPromptBasedPermissionsEnabled()` (`jwH`, `209900`), which in v2.1.156 is hardcoded `return !1`. So in this build, `allowedPrompts` **never becomes a permission rule** — only the `setMode` update survives.

**Why expose a no-op schema.** This is a feature-flag-off shipping pattern. The `allowedPrompts` capability is Anthropic-internal/experimental: the external prompt stub (§3.2, v2.1.88 `prompt.ts:1`) explicitly *strips* the `allowedPrompts` guidance, so the public model is never told to use it. Keeping the schema and the rule-building code in the bundle, but flipping `jwH()` to `false`, lets internal builds enable prompt-based Bash pre-authorization by toggling one function while the public build stays safe. **Trade-off:** dead-but-present code is mildly confusing (a reader sees the schema and assumes it works) — the bundle mitigates this by making `jwH` a tiny, obviously-stubbed `return !1`.

**Key insight.** `allowedPrompts` is consumed in the **approval UI flow**, not in the tool_result. At `cli_inner_pretty.js:629564`, when the user approves and the mode transitions, the code applies `applyPermissionUpdates(toolPermissionContext, buildPlanExitPermissionUpdates(mode, allowedPrompts))` (`sN(wK.toolPermissionContext, i9q(G8.mode, G8.allowedPrompts))`). This is a clean separation of concerns: the **tool_result** is the model's channel (it never echoes `allowedPrompts`), while the **permission context** is the runtime's channel (it receives the rules). Even here, the rules are no-ops until `jwH()` flips on.

```javascript
// ============================================
// allowedPrompts consumed at approval - applyPermissionUpdates over the permission context
// Location: cli_inner_pretty.js:629560-629568
// ============================================

// ORIGINAL (for source lookup):
let Mq = G8.message.planContent && !1;
if ((qH((wK) => {
  let fK = G8.mode ? sN(wK.toolPermissionContext, i9q(G8.mode, G8.allowedPrompts)) : wK.toolPermissionContext;
  if (G8.mode === "auto") fK = Km({ ...fK, mode: "auto", prePlanMode: void 0 });
  return { ...wK, initialMessage: null, toolPermissionContext: fK, ... };

// READABLE (for understanding):
let pendingVerification = G8.message.planContent && false;  // verification path disabled
qH(state => {
  let nextPermCtx = G8.mode ? applyPermissionUpdates(state.toolPermissionContext, buildPlanExitPermissionUpdates(G8.mode, G8.allowedPrompts)) : state.toolPermissionContext;
  if (G8.mode === "auto") nextPermCtx = withAutoMode({ ...nextPermCtx, mode: "auto", prePlanMode: undefined });
  return { ...state, initialMessage: null, toolPermissionContext: nextPermCtx, ... };

// Mapping: sN->applyPermissionUpdates, i9q->buildPlanExitPermissionUpdates, Km->withAutoMode, G8->approvalContext
```

---

## 13. Downstream consumers — `extractApprovedPlan` and the result/rejected UI

### `extractApprovedPlan` (Ultraplan CCR parser)

Covered in §11: `B4z` (`503257`) parses the `## Approved Plan:` marker out of the tool_result for the Ultraplan CCR teleport, and throws if the marker is missing. The two-marker probe (`## Approved Plan (edited by user):` tried *first*, `503260`) means an edited plan is recognized by its more specific heading before the generic one.

### `renderToolResultMessage` (`_$4`) — the user-facing approval view

`_$4` (`349843-349900`) renders three states:
- **Empty plan** (`!K || K.trim() === ""`, `349845`): "Exited plan mode" (`349856`).
- **Awaiting leader approval** (`H.awaitingLeaderApproval`, `349847`): "Plan submitted for team lead approval" with "Waiting for team lead to review and approve…" and the plan file path via `getDisplayPath` (`s5`, `349846`).
- **Approved** (default): "User approved Claude's plan", "Plan saved to: `<path>` · /plan to edit", and the rendered plan body.

The "/plan to edit" hint (`349895`) is the user's affordance to re-open the just-approved plan — consistent with the disk-as-source-of-truth design: editing means editing the *file*.

### `renderToolUseRejectedMessage` (`z$4`) → `RejectedPlanView` (`RL8`)

`z$4` (`349901-349904`) falls back to the on-disk plan when no plan is passed (`H ?? DV() ?? "No plan found"`, `349902`) and delegates to `RejectedPlanView` (`RL8`, `349805`), which renders "User rejected Claude's plan:" with the plan inside a `planMode`-bordered box. The disk fallback here mirrors the disk-first philosophy: even on rejection, the UI shows the exact plan the user saw.

---

## 14. The permission descriptor `ftH` (`permission_exit_plan_mode_v2`)

```javascript
// ============================================
// permissionExitPlanModeV2Descriptor - the permission_exit_plan_mode_v2 payload REQUIRES plan
// Location: cli_inner_pretty.js:349453-349472
// ============================================

// ORIGINAL (for source lookup):
ftH = BM({
  kind: "permission_exit_plan_mode_v2",
  payload: yH(() => y.custom((H) => typeof H === "object" && H !== null && "requestId" in H && "toolName" in H && "permissionResult" in H && "plan" in H)),
  result: yH(() => y.custom((H) => typeof H === "object" && H !== null && "behavior" in H)),
  default: { behavior: "cancelled" },
});

// READABLE (for understanding):
const permissionExitPlanModeV2Descriptor = defineRpcDescriptor({
  kind: "permission_exit_plan_mode_v2",
  payload: lazy(() => z.custom(v => typeof v === "object" && v !== null && "requestId" in v && "toolName" in v && "permissionResult" in v && "plan" in v)),
  result: lazy(() => z.custom(v => typeof v === "object" && v !== null && "behavior" in v)),
  default: { behavior: "cancelled" },
});

// Mapping: ftH->permissionExitPlanModeV2Descriptor, BM->defineRpcDescriptor, yH->lazy, y->z
```

**Why the payload requires `plan` but the sibling enter-descriptor does not.** The sibling `permissionEnterPlanModeDescriptor` (`K0$`, `349442-349451`) requires only `requestId`/`toolName`/`permissionResult` — **no** `plan`. The exit descriptor adds `"plan" in H` (`349466`). This asymmetry is the protocol-level expression of the whole design: *entering* plan mode has no plan to show; *exiting* plan mode is an approval of a specific plan, so the plan must accompany the permission request (the approval UI shows it, and an edit replaces it via `permissionResult.updatedInput`). The `default: { behavior: "cancelled" }` means a dropped/failed RPC is treated as a rejection — fail-closed, never auto-approving an exit.

---

## 15. Plan recovery on resume (`CJz` / `bJz`) and remote snapshots (`CL8`)

When a session resumes and the plan file is missing but the session is remote, `HW8` (`549265`) attempts recovery in priority order: a `file_snapshot` entry keyed `"plan"` (`findFileSnapshot`, `bJz`, `549333`), then a walk back through message history (`recoverPlanFromHistory`, `CJz`, `549305`). `CJz` looks for, in order per message: an `ExitPlanMode` `tool_use` with `input.plan` (`549313`, keyed off `wv`), a user message `planContent`, or a `plan_file_reference` attachment's `planContent`. `persistFileSnapshotIfRemote` (`CL8`, `549341`) is what *creates* those snapshots in the first place — it only fires when remote (`D68() !== null`, `549342`) and pushes a `system`/`file_snapshot` message recording the plan file. This is the durability backbone that lets a remote-edited plan survive a resume, and ties back to §6's re-snapshot-after-edit.

---

## 16. Cross-version diff: v2.1.88 → v2.1.156

Cross-validation against the v2.1.88 precursor `ExitPlanModeV2Tool.ts` shows the 2.1.156 bundle is line-for-line faithful. The single behavioral text change and the inlined feature flags are the only deltas.

| Aspect | v2.1.88 (`ExitPlanModeV2Tool.ts` / `plans.ts`) | v2.1.156 (`cli_inner_pretty.js`) | Verdict |
|---|---|---|---|
| Tool name | `EXIT_PLAN_MODE_V2_TOOL_NAME = 'ExitPlanMode'` (`constants.ts:2`) | `wv = "ExitPlanMode"` (`143387`); legacy `oG` kept (`143386`) | IDENTICAL |
| `allowedPrompt` item schema | `{tool:enum(['Bash']), prompt:string}` (`:64-73`) | `IL_` (`349982-349987`) | IDENTICAL |
| Input schema | `strictObject({allowedPrompts?}).passthrough()` (`:77-89`) | `M$4` (`349988-349999`) | IDENTICAL |
| SDK schema | `_sdkInputSchema.extend({plan?,planFilePath?})` (`:97-108`) | `bGf` (`350000-350005`) | IDENTICAL |
| Output schema (7 fields) | `:110-142` incl. `describe()` strings | `CL_` (`350006-350024`) field-for-field | IDENTICAL |
| Model-facing prompt | external stub, no `allowedPrompts` section (`prompt.ts:6-29`) | `$$4` (`349781-349804`) verbatim | IDENTICAL |
| `call()` control flow | disk read, edited-plan writeback, teammate branch, auto-gate fallback, mode restore, `hasTaskTool` (`:243-418`) | `350085-350168` | IDENTICAL |
| `mapToolResult` 4 branches + content strings | `:419-491` | `350169-350219` | IDENTICAL |
| `validateInput` out-of-plan message (only middle clause changed) | "You are not in plan mode. **This tool is only for exiting plan mode after writing a plan.** If your plan was already approved…" (`:215`) | "You are not in plan mode. **To enter plan mode, call the `${og}` tool first.** If your plan was already approved…" (`350072`) | **CHANGED (1 sentence)** |
| Auto-gate fallback / dangerous-perm strip guard | behind `feature('TRANSCRIPT_CLASSIFIER')` (`:328`,`:362`) | always-present (`350124`,`350149`) | IDENTICAL (behavior), flag INLINED |
| Channels enable gate | behind `feature('KAIROS')`/`'KAIROS_CHANNELS'` (`:172`) | collapsed to `uw().length>0 && R6()` (`350046`) | IDENTICAL (behavior), flag INLINED |
| Permission descriptor | exit descriptor requires `plan`; enter does not | `ftH` requires `plan` (`349466`); `K0$` does not (`349443`) | IDENTICAL |
| `allowedPrompts → addRules` gate | external stub strips guidance (Ant-only) | `jwH()` hardcoded `false` (`209900`) → no-op | IDENTICAL intent, clarified |
| `getPlan`/`getPlanFilePath`/`persistFileSnapshotIfRemote` | `plans.ts`; agent plan = `slug-agent-id.md` | `DV`(`549253`)/`wV`(`549248`)/`CL8`(`549341`); same suffixing (`549251`) | IDENTICAL |
| Teammate helpers (`writeToMailbox`, `findInProcessTeammateTaskId`, `setAwaitingPlanApproval`, `generateRequestId`, `formatAgentId`) | `teammateMailbox.ts` / `inProcessTeammateHelpers.ts` / `agentId.ts` | `aA`(`338306`)/`SL8`(`349768`)/`ou6`(`349772`)/`gUH`(`99008`)/`Ei`(`98997`) | IDENTICAL |

**On the one text change.** The new message names the `EnterPlanMode` tool (`og`) explicitly. This is a usability fix for a recurring failure: because `shouldDefer` keeps the tool always-announced, models out of plan mode mis-call `ExitPlanMode`; the old message described the tool's *purpose*, while the new one gives the model a concrete recovery action ("call `EnterPlanMode` first"). It is a strictly additive improvement to the corrective signal.

---

## Confidence

- **Tool object, schemas, prompt, `call()` flow, `mapToolResult`, permission descriptor (§1–§11, §14):** **High.** Every claim is read directly from `cli_inner_pretty.js:349442-350220` and matches the v2.1.88 precursor structurally line-for-line.
- **Disk-read design / `normalizeToolInput` / plans helpers / recovery (§2, §6, §15):** **High.** Verified at `349140-349155` and `549248-549360`.
- **`allowedPrompts` no-op gating (§12):** **High.** `jwH()` hardcoded `return !1` confirmed at `209900-209902`; consumption site confirmed at `629563`; `i9q` at `589766`.
- **Teammate mailbox branch (§7):** **High.** Confirmed at `350101-350120`, `338306` (mailbox), `349768-349774` (helpers), `99008`/`98997` (id helpers).
- **Auto-mode circuit-breaker / dangerous-perms reconciliation (§8–§9):** **High** on the control flow (read at `350121-350162`); **Medium-high** on the precise *intent* of `stripDangerousPermissionsForAutoMode`/`restoreDangerousPermissions`, which are lazy-imported (`A`/`autoModeGate`) and whose bodies were inferred from naming + the v2.1.88 comments rather than read in this pass.
- **`extractApprovedPlan` Ultraplan CCR contract (§11, §13):** **High.** Read at `503257-503272`; the throw-on-missing-marker behavior is explicit in source.
- **Cross-version diff (§16):** **High** for the items grounded in both trees; the one text-change row is **Medium-high** (v2.1.88 line numbers cited from the precursor file, 2.1.156 message read verbatim at `350072`).
