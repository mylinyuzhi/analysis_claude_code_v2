# Plan Mode: UI, Approval Dialog, and the Shift+Tab Cycle (v2.1.156)

> **Scope / Source**
> This document analyzes the user-facing surfaces of plan mode in Claude Code **v2.1.156**:
> the tool-result/rejection rendering for `EnterPlanMode`/`ExitPlanMode`, the `ExitPlanMode`
> approval dialog ("Ready to code?"), the choice→permission-result mapping, the in-dialog
> keyboard shortcuts, the `Shift+Tab` permission-mode cycle, mode-chip theming, and the `/plan`
> slash command.
>
> Every claim is grounded in the v2.1.156 pretty-printed bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
> (cited as `cli_inner_pretty.js:<line>`, line numbers verified by reading the region).
> Readable names and cross-version behavioral diffs are validated against the
> v2.1.88 unobfuscated TypeScript under `/lyz/codespace/3rd/claude-code/src/`.

---

## TL;DR

- **Three render states for the ExitPlanMode result** are driven by `renderExitPlanModeResult` (obfuscated: `_$4`, `cli_inner_pretty.js:349843-349900`): empty plan → "Exited plan mode"; teammate awaiting lead → "Plan submitted for team lead approval" + "Waiting for team lead to review and approve..."; approved → "User approved Claude's plan" + "Plan saved to: `<path>` · /plan to edit".
- **The approval dialog** `ExitPlanModePermissionRequest` (obfuscated: `mA9`, `cli_inner_pretty.js:589878-590475`) has two branches: an empty-plan branch (title "Exit plan mode?", Yes/No) and a full-plan branch (title "Ready to code?", "Here is Claude's plan:" + a variable-arity option list).
- **The option list** is built by `buildPlanApprovalOptions` (obfuscated: `Gkz`, `cli_inner_pretty.js:589794-589824`). A non-obvious **priority flip vs v2.1.88**: the elevated "Yes" option now prefers **bypass over auto** (`if(isBypass) … else if(isAuto)`), where v2.1.88 preferred auto over bypass.
- **Choice → PermissionResult** logic was **extracted** into a pure function `getApprovalResult` (obfuscated: `_I8`, `cli_inner_pretty.js:589839-589877`), separate from the React handler — a clean, testable refactor boundary that v2.1.88 inlined.
- **The Shift+Tab cycle order** lives in `getNextPermissionMode` (obfuscated: `QCH`, `cli_inner_pretty.js:578712-578730`): `default→acceptEdits→plan→(bypass | auto | default)`. A second non-obvious diff: v2.1.156 **dropped the v2.1.88 `USER_TYPE==='ant'` special case** in the `default` branch.
- **Auto-mode is gated defensively in three places** and entering it via Shift+Tab arms an **800ms opt-in hold** before the most-permissive mode engages.

---

## 1. Overview: plan-mode UI surfaces in v2.1.156

Plan mode's UX is not a single component; it is spread across three concerns, each owned by a
different region of the bundle:

1. **Tool result / rejection rendering** — what shows in the transcript after `EnterPlanMode`
   or `ExitPlanMode` runs. Owned by `renderExitPlanModeResult` (`_$4`), `RejectedPlanMessage`
   (`RL8`), and the EnterPlanMode renderers `sH4`/`tH4`/`aH4`.
2. **The approval dialog** — the interactive permission request the user answers when Claude
   calls `ExitPlanMode`. Owned by `ExitPlanModePermissionRequest` (`mA9`) and its helpers
   `buildPlanApprovalOptions` (`Gkz`), `getApprovalResult` (`_I8`), `buildPermissionUpdates`
   (`i9q`), and `autoNameSessionFromPlan` (`Zkz`).
3. **The Shift+Tab permission-mode cycle** — the keyboard affordance that walks
   `default → acceptEdits → plan → …`. Owned by `getNextPermissionMode` (`QCH`),
   `canCycleToAuto` (`PR8`), `cyclePermissionMode` (`c19`), `transitionPermissionMode` (`vl`),
   and the keybinding handler `handleCycleMode` (`uV`).

These three concerns share one piece of theming infrastructure: the `PERMISSION_MODE_CONFIG`
object (`xEq`, `cli_inner_pretty.js:49228-49253`) and its accessors, which supply the chip
title, symbol, and color for the plan mode.

### Why three concerns instead of one component?

**What it does:** Separates "what gets written to the transcript", "what the user interacts
with to approve", and "how the user changes mode by keyboard".

**Why this approach:** Each concern has a different lifecycle and a different render context.
Result rendering is a pure function of the tool's output object (`renderToolResultMessage`),
re-run cheaply when the transcript repaints. The approval dialog is a stateful React component
(`mA9` uses `uF.useState` extensively) that lives only while the request is open. The cycle is a
keyboard event handler bound globally. Folding them together would force the cheap pure renderers
to carry React hooks, and would couple the always-mounted keybinding to the transiently-mounted
dialog. **Key insight:** the three surfaces converge only on the shared *vocabulary* — the mode
identifiers (`plan`, `acceptEdits`, `auto`, `bypassPermissions`, `default`, `dontAsk`) and the
chip config — not on shared *code paths*.

---

## 2. ExitPlanMode tool result rendering (`_$4`): empty / awaiting-lead / approved

### `renderExitPlanModeResult` — three terminal states

**What it does:** Renders the line that appears in the transcript after the `ExitPlanMode`
tool finishes. It selects one of three layouts based on plan emptiness and whether a teammate
is waiting for a team lead.

**How it works (step-by-step):**
1. Destructure `plan` (`K`) and `filePath` (`_`) from the tool output `H`.
2. Compute `isEmpty` (`z`) = plan absent or all-whitespace.
3. Compute `displayPath` (`A`) = `s5(filePath)` (a path-shortening / display helper) or `""`.
4. Read `awaitingLeaderApproval` (`Y`) off the output.
5. **Branch 1 — empty plan:** render the plan-colored bullet `r9` + `" Exited plan mode"`.
6. **Branch 2 — `awaitingLeaderApproval`:** render `" Plan submitted for team lead approval"`,
   then a `MessageResponse` (`h8`) block with an optional dimmed `"Plan file: <path>"` and the
   dimmed `"Waiting for team lead to review and approve..."`.
7. **Branch 3 — approved (default):** render `" User approved Claude's plan"`, then a
   `MessageResponse` block with an optional dimmed `"Plan saved to: <path> · /plan to edit"`
   and the plan body rendered through the Markdown component `rf`.

```javascript
// ============================================
// renderExitPlanModeResult - ExitPlanMode renderToolResultMessage; 3-state render
// Location: cli_inner_pretty.js:349843-349900
// ============================================

// ORIGINAL (for source lookup):
function _$4(H, $, { theme: q }) {
  let { plan: K, filePath: _ } = H,
    z = !K || K.trim() === "",
    A = _ ? s5(_) : "",
    Y = H.awaitingLeaderApproval;
  if (z)
    return I_.createElement(p, { flexDirection: "column", marginTop: 1 },
      I_.createElement(p, { flexDirection: "row" },
        I_.createElement(k, { color: tV("plan") }, r9),
        I_.createElement(k, null, " Exited plan mode")));
  if (Y)
    return I_.createElement(p, { flexDirection: "column", marginTop: 1 },
      I_.createElement(p, { flexDirection: "row" },
        I_.createElement(k, { color: tV("plan") }, r9),
        I_.createElement(k, null, " Plan submitted for team lead approval")),
      I_.createElement(h8, null,
        I_.createElement(p, { flexDirection: "column" },
          _ && I_.createElement(k, { dimColor: !0 }, "Plan file: ", A),
          I_.createElement(k, { dimColor: !0 }, "Waiting for team lead to review and approve..."))));
  return I_.createElement(p, { flexDirection: "column", marginTop: 1 },
    I_.createElement(p, { flexDirection: "row" },
      I_.createElement(k, { color: tV("plan") }, r9),
      I_.createElement(k, null, " User approved Claude's plan")),
    I_.createElement(h8, null,
      I_.createElement(p, { flexDirection: "column" },
        _ && I_.createElement(k, { dimColor: !0 }, "Plan saved to: ", A, " \xB7 /plan to edit"),
        I_.createElement(rf, null, K))));
}

// READABLE (for understanding):
function renderExitPlanModeResult(output, _progressMessages, { theme }) {
  const { plan, filePath } = output;
  const isEmpty = !plan || plan.trim() === "";
  const displayPath = filePath ? getDisplayPath(filePath) : "";
  const awaitingLeaderApproval = output.awaitingLeaderApproval;

  if (isEmpty)
    return (
      <Box flexDirection="column" marginTop={1}>
        <Box flexDirection="row">
          <Text color={getModeColor("plan")}>{BULLET}</Text>
          <Text> Exited plan mode</Text>
        </Box>
      </Box>
    );

  if (awaitingLeaderApproval)
    return (
      <Box flexDirection="column" marginTop={1}>
        <Box flexDirection="row">
          <Text color={getModeColor("plan")}>{BULLET}</Text>
          <Text> Plan submitted for team lead approval</Text>
        </Box>
        <MessageResponse>
          <Box flexDirection="column">
            {filePath && <Text dimColor>Plan file: {displayPath}</Text>}
            <Text dimColor>Waiting for team lead to review and approve...</Text>
          </Box>
        </MessageResponse>
      </Box>
    );

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box flexDirection="row">
        <Text color={getModeColor("plan")}>{BULLET}</Text>
        <Text> User approved Claude's plan</Text>
      </Box>
      <MessageResponse>
        <Box flexDirection="column">
          {filePath && <Text dimColor>Plan saved to: {displayPath} · /plan to edit</Text>}
          <Markdown>{plan}</Markdown>
        </Box>
      </MessageResponse>
    </Box>
  );
}

// Mapping: _$4->renderExitPlanModeResult, H->output, K->plan, _->filePath, z->isEmpty,
//          A->displayPath, Y->awaitingLeaderApproval, tV->getModeColor, r9->BULLET,
//          k->Text, p->Box, h8->MessageResponse, rf->Markdown, s5->getDisplayPath
```

**Why this approach (branch ordering):** The branches are ordered empty → awaiting-lead →
approved, and they are mutually exclusive `return`s rather than a flag union. The empty-plan
case is checked first because it is the only state where there is *no plan to display* —
short-circuiting it means the later branches can safely render `plan`/`filePath` without
re-guarding emptiness. The teammate-awaiting branch must precede the approved branch because
when a teammate submits to a lead, the plan was never *approved* locally; rendering "User
approved Claude's plan" there would be a lie. **Key insight:** the approved state is the
*fallthrough default*, which is correct because by the time `ExitPlanMode.call` returns a normal
(non-teammate, non-awaiting) result, the local approval dialog has already been answered "yes"
— the tool only completes its non-teammate path after the permission layer allowed it.

**The "/plan to edit" affordance:** the approved render appends `· /plan to edit` to the saved
path. This is a deliberate discoverability hook tying the persisted plan file to the `/plan`
slash command (Section 11), so a user who later wants to revise the plan knows the entry point
without reading docs.

---

## 3. Plan rejection rendering (`RL8` / `z$4`) and EnterPlanMode renderers

### `RejectedPlanMessage` (`RL8`) + `renderExitPlanModeRejected` (`z$4`)

**What it does:** When the user rejects the plan in the approval dialog, the transcript shows
"User rejected Claude's plan:" followed by the plan body inside a rounded, plan-colored box.

**How it works:**
1. The tool's `renderToolUseRejectedMessage` is `z$4` (`cli_inner_pretty.js:349901-349904`).
   It resolves the plan as `plan ?? getPlan() ?? "No plan found"` (`H ?? DV() ?? "No plan
   found"`) so a rejection still renders something even if the output object lost the plan, and
   delegates to `RL8`.
2. `RL8` (`cli_inner_pretty.js:349805-349832`) renders a `"subtle"`-colored label "User
   rejected Claude's plan:" then a `borderStyle:"round"`, `borderColor:"planMode"`, `paddingX:1`
   box containing the plan rendered via the Markdown component `rf`.

```javascript
// ============================================
// RejectedPlanMessage - "User rejected Claude's plan:" in a planMode-bordered box
// Location: cli_inner_pretty.js:349805-349832 (RL8) + 349901-349904 (z$4 wrapper)
// ============================================

// ORIGINAL (for source lookup):
function RL8(H) {
  let $ = q$4.c(3), { plan: q } = H, K;
  if ($[0] === Symbol.for("react.memo_cache_sentinel"))
    ((K = Na.createElement(k, { color: "subtle" }, "User rejected Claude's plan:")), ($[0] = K));
  else K = $[0];
  let _;
  if ($[1] !== q)
    ((_ = Na.createElement(h8, null,
      Na.createElement(p, { flexDirection: "column" }, K,
        Na.createElement(p, { borderStyle: "round", borderColor: "planMode", paddingX: 1, overflow: "hidden" },
          Na.createElement(rf, null, q))))), ($[1] = q), ($[2] = _));
  else _ = $[2];
  return _;
}
function z$4({ plan: H }, { theme: $ }) {
  let q = H ?? DV() ?? "No plan found";
  return I_.createElement(p, { flexDirection: "column" }, I_.createElement(RL8, { plan: q }));
}

// READABLE (for understanding):
function RejectedPlanMessage({ plan }) {
  return (
    <MessageResponse>
      <Box flexDirection="column">
        <Text color="subtle">User rejected Claude's plan:</Text>
        <Box borderStyle="round" borderColor="planMode" paddingX={1} overflow="hidden">
          <Markdown>{plan}</Markdown>
        </Box>
      </Box>
    </MessageResponse>
  );
}
function renderExitPlanModeRejected({ plan }, { theme }) {
  const resolved = plan ?? getPlan() ?? "No plan found";
  return (
    <Box flexDirection="column">
      <RejectedPlanMessage plan={resolved} />
    </Box>
  );
}

// Mapping: RL8->RejectedPlanMessage, z$4->renderExitPlanModeRejected, q/H->plan,
//          DV->getPlan, rf->Markdown, h8->MessageResponse, k->Text, p->Box
```

**Why render the plan even on rejection?** A rejection in plan mode is rarely terminal — the
user typically rejects *with feedback* to refine the plan. Echoing the rejected plan back into
the transcript preserves the record of *what* was rejected so the follow-up refinement has
context. **Key insight:** the `?? getPlan() ?? "No plan found"` fallback chain is defensive — it
guarantees a non-empty render regardless of whether the rejection path populated `plan`, which
matters because the rejection can be triggered by `onCancel` (Escape) where no structured plan
object flows through.

### EnterPlanMode renderers (`sH4` / `tH4` / `aH4`)

`renderEnterPlanModeResult` (`sH4`, `cli_inner_pretty.js:349658-349673`) renders "Entered plan
mode" + the dimmed sub-line "Claude is now exploring and designing an implementation approach.";
`renderEnterPlanModeRejected` (`tH4`, `:349675-349681`) renders "User declined to enter plan
mode" using `tV("default")` (the neutral color, **not** plan-color — declining to enter is not
a plan-mode event); and `renderEnterPlanModeToolUse` (`aH4`, `:349655-349657`) returns `null`
(the tool call itself is silent in the transcript). These mirror the `ExitPlanMode`
`renderToolUseMessage` `K$4` (`:349840-349842`), which also returns `null`.

**Why is the tool-use message null for both tools?** A plan-mode transition is a *mode change*,
not an action with a meaningful "I am calling tool X with args Y" preview. The user cares about
the *outcome* (entered / approved / rejected), rendered by the result/rejected renderers, not
about the literal tool invocation. Returning `null` suppresses transcript noise.

---

## 4. The approval dialog (`mA9 = ExitPlanModePermissionRequest`)

`ExitPlanModePermissionRequest` (`mA9`, `cli_inner_pretty.js:589878-590475`) is the interactive
permission request shown when Claude calls `ExitPlanMode` (and the user is not a teammate — see
Section 12). It is wired into the permission-request dispatch table by the answer component
`exitPlanModeAnswerComponent` (`Ayz`, `cli_inner_pretty.js:598471`):

```javascript
// ============================================
// exitPlanModeAnswerComponent - wires mA9 into the permission-request dispatch table
// Location: cli_inner_pretty.js:598471
// ============================================

// ORIGINAL (for source lookup):
Ayz = ({ payload: H, answer: $ }) => qO.createElement(mA9, { payload: H, answer: $ }),

// READABLE (for understanding):
const exitPlanModeAnswerComponent = ({ payload, answer }) =>
  <ExitPlanModePermissionRequest payload={payload} answer={answer} />;

// Mapping: Ayz->exitPlanModeAnswerComponent, mA9->ExitPlanModePermissionRequest,
//          H->payload, $->answer
```

`mA9` reads two props: `payload` (`q`, carrying `plan`, `planFilePath`, `allowedPrompts`,
`usage`, `requestSource`, `workerBadge`, `permissionResult`) and `answer` (`K`, the callback
that resolves the permission decision). It then forks on whether the plan is empty
(`R = !E || E.trim() === ""`).

### 4a. Empty-plan branch: "Exit plan mode?"

**What it does:** When Claude calls `ExitPlanMode` with no plan written, the dialog degrades to
a simple Yes/No confirmation titled "Exit plan mode?".

**How it works (`cli_inner_pretty.js:590267-590305`):**
1. Render the prompt "Claude wants to exit plan mode" (`:590270`).
2. Offer a two-option `Select` (`a8`): `{label:"Yes", value:"yes"}` and `{label:"No",
   value:"no"}` (`:590273-590276`).
3. The handler `dH` (= `FH`, `:590212-590225`) on "yes": emit `tengu_plan_exit
   {outcome:"yes-default"}`; if auto mode was active, deactivate it (`setAutoModeActive(!1)`,
   `PR(!0)`); then `answer({behavior:"allow", updatedInput:{}, permissionUpdates:[{type:"setMode",
   mode:"default", destination:"session"}]})`. On "no"/cancel: emit `{outcome:"no"}` and
   `answer({behavior:"deny"})`.
4. Wrap in the `PermissionDialog` (`NA`) with `color:"planMode"`, `title:"Exit plan mode?"`.

**Why a degraded dialog?** When there is no plan, the rich "Here is Claude's plan:" + 5-path
option list would render an empty box and offer choices (auto-accept-edits-on-the-plan) that
make no sense. The empty branch reduces to the only meaningful question: do you want to leave
plan mode at all, dropping back to plain `default`. **Key insight:** the empty-plan "yes" always
returns to `default` (never to an elevated mode) — without a reviewed plan there is no basis to
grant elevated permissions, so the conservative target is correct.

### 4b. Full-plan branch: "Ready to code?"

**What it does:** The normal case. Renders the plan, a context label, and the variable-arity
approval option list.

**How it works (`cli_inner_pretty.js:590307-590474`):**
1. Header `q$` = "Here is Claude's plan:" (`:590314`).
2. Plan body `h$` = the plan rendered through Markdown (`rf`) inside a scrollable region
   (`sU` with computed `height`).
3. Optional "Requested permissions:" block `S$` (`:590330-590339`) — shown only when the
   classifier-permissions feature `jwH()` is on and `allowedPrompts` is non-empty, listing each
   requested tool/prompt via `renderAllowedPrompt` (`Vkz`).
4. Wrap header+plan+permissions in the `PermissionDialog` (`NA`) titled **"Ready to code?"**
   (`:590363`), `color:"planMode"`, `innerPaddingX:0`.
5. Below it, a footer box (`borderColor:"planMode"`, `borderTop` only) containing the dimmed
   tagline "Claude has written up a plan and is ready to execute. Would you like to proceed?",
   the option `Select` (`a8`) wired to `mH` (the result handler) / `_$` (cancel), and the
   "ctrl-g to edit in `<editor>`" hint that also shows "Plan saved!" transiently after a save
   (`A8`, `:590418-590437`).

The full-plan option list `U` is built by `buildPlanApprovalOptions` (`Gkz`) — analyzed in
Section 5 — recomputed only when its inputs (`isAutoModeAvailable`, `isBypassPermissionsMode`,
`mode`, `showClearContext`, `showUltraplan`, `usage`) change (`cli_inner_pretty.js:589911-589930`).

**Why "Ready to code?" rather than "Exit plan mode?"?** The title is intentionally
action-framed. By the time a non-empty plan exists, the user's mental model is "the plan is
done, what next" — and the next step is coding. Framing the approval as readiness-to-code rather
than mode-exit aligns the dialog with the user's intent and makes the elevated "Yes, and bypass
permissions / use auto mode" options read naturally as *how aggressively to code*, not as
*permission semantics*. **Key insight:** the title is byte-for-byte identical to v2.1.88
(`ExitPlanModePermissionRequest.tsx:627`), confirming this framing is a stable, deliberate
product decision, not an artifact.

---

## 5. The 5-path approval UX: `buildPlanApprovalOptions` (`Gkz`) and the priority flip

### `buildPlanApprovalOptions` — variable-arity option construction

**What it does:** Produces the ordered list of `{label, value}` choices shown in the "Ready to
code?" dialog. Despite often being described as "5 options", the arity is variable (3–6
options) depending on which capabilities are available.

**How it works (step-by-step, `cli_inner_pretty.js:589794-589824`):**
1. **Slot 1 — clear-context "Yes" (only if `showClearContext` `H`):** choose the elevated mode
   by priority **bypass → auto → accept-edits**:
   - if `isBypassPermissionsModeAvailable` (`_`): "Yes, clear context (N% used) and bypass
     permissions" → `yes-bypass-permissions`
   - else if `isAutoModeAvailable` (`K`): "...and use auto mode" → `yes-auto-clear-context`
   - else: "...and auto-accept edits" → `yes-accept-edits`
2. **Slot 2 — keep-context elevated "Yes" (always):** same priority bypass → auto → edits:
   - if bypass: "Yes, and bypass permissions" → `yes-accept-edits-keep-context`
   - else if auto: "Yes, and use auto mode" → `yes-resume-auto-mode`
   - else: "Yes, auto-accept edits" → `yes-accept-edits-keep-context`
3. **Slot 3 — manual (always):** "Yes, manually approve edits" → `yes-default-keep-context`.
4. **Slot 4 — Ultraplan (only if `showUltraplan` `$`):** "No, refine with Ultraplan on Claude
   Code on the web" → `ultraplan`.
5. **Slot 5 — keep planning (always, an `input` row):** "No, keep planning" → `no`, with
   placeholder "Tell Claude what to change" and the description **"shift+tab to approve with
   this feedback"** (ties the keybinding to the visible affordance).

```javascript
// ============================================
// buildPlanApprovalOptions - builds the "Ready to code?" option list (bypass>auto>edits)
// Location: cli_inner_pretty.js:589794-589824
// ============================================

// ORIGINAL (for source lookup):
function Gkz({ showClearContext: H, showUltraplan: $, usedPercent: q, isAutoModeAvailable: K,
              isBypassPermissionsModeAvailable: _, onFeedbackChange: z }) {
  let A = [], Y = q !== null ? ` (${q}% used)` : "";
  if (H)
    if (_) A.push({ label: `Yes, clear context${Y} and bypass permissions`, value: "yes-bypass-permissions" });
    else if (K) A.push({ label: `Yes, clear context${Y} and use auto mode`, value: "yes-auto-clear-context" });
    else A.push({ label: `Yes, clear context${Y} and auto-accept edits`, value: "yes-accept-edits" });
  if (_) A.push({ label: "Yes, and bypass permissions", value: "yes-accept-edits-keep-context" });
  else if (K) A.push({ label: "Yes, and use auto mode", value: "yes-resume-auto-mode" });
  else A.push({ label: "Yes, auto-accept edits", value: "yes-accept-edits-keep-context" });
  if ((A.push({ label: "Yes, manually approve edits", value: "yes-default-keep-context" }), $))
    A.push({ label: "No, refine with Ultraplan on Claude Code on the web", value: "ultraplan" });
  return (A.push({ type: "input", label: "No, keep planning", value: "no",
    placeholder: "Tell Claude what to change", description: "shift+tab to approve with this feedback",
    onChange: z }), A);
}

// READABLE (for understanding):
function buildPlanApprovalOptions({ showClearContext, showUltraplan, usedPercent,
                                    isAutoModeAvailable, isBypassPermissionsModeAvailable,
                                    onFeedbackChange }) {
  const options = [];
  const usedLabel = usedPercent !== null ? ` (${usedPercent}% used)` : "";

  // Slot 1: clear-context elevated "Yes" (priority: bypass > auto > edits)
  if (showClearContext) {
    if (isBypassPermissionsModeAvailable)
      options.push({ label: `Yes, clear context${usedLabel} and bypass permissions`, value: "yes-bypass-permissions" });
    else if (isAutoModeAvailable)
      options.push({ label: `Yes, clear context${usedLabel} and use auto mode`, value: "yes-auto-clear-context" });
    else
      options.push({ label: `Yes, clear context${usedLabel} and auto-accept edits`, value: "yes-accept-edits" });
  }

  // Slot 2: keep-context elevated "Yes" (same priority: bypass > auto > edits)
  if (isBypassPermissionsModeAvailable)
    options.push({ label: "Yes, and bypass permissions", value: "yes-accept-edits-keep-context" });
  else if (isAutoModeAvailable)
    options.push({ label: "Yes, and use auto mode", value: "yes-resume-auto-mode" });
  else
    options.push({ label: "Yes, auto-accept edits", value: "yes-accept-edits-keep-context" });

  // Slot 3: manual approval (always)
  options.push({ label: "Yes, manually approve edits", value: "yes-default-keep-context" });

  // Slot 4: Ultraplan refinement (optional)
  if (showUltraplan)
    options.push({ label: "No, refine with Ultraplan on Claude Code on the web", value: "ultraplan" });

  // Slot 5: keep planning with feedback (always, an input row)
  options.push({
    type: "input", label: "No, keep planning", value: "no",
    placeholder: "Tell Claude what to change",
    description: "shift+tab to approve with this feedback",
    onChange: onFeedbackChange,
  });
  return options;
}

// Mapping: Gkz->buildPlanApprovalOptions, H->showClearContext, $->showUltraplan, q->usedPercent,
//          K->isAutoModeAvailable, _->isBypassPermissionsModeAvailable, z->onFeedbackChange,
//          A->options, Y->usedLabel
```

**Why this approach (variable arity, two elevated slots):** The two-slot design separates the
*context* decision (keep vs. clear the conversation when starting to code) from the *permission*
decision (how much to trust Claude while coding). Clear-context is only offered when
`showClearContext` is true (typically when the conversation is large enough that re-injecting
just the plan into a fresh context is worthwhile — see the `usedPercent` label). Folding both
into one option set would either hide the clear-context option or double the option count
combinatorially. **Trade-off:** the variable arity makes the dialog harder to memorize ("which
row is auto?" depends on capabilities) but keeps it from showing irrelevant or impossible
choices (e.g., offering bypass when `--dangerously-skip-permissions` was never granted).

**Key insight — the priority flip (vs v2.1.88):** In v2.1.88, both slots prioritized **auto over
bypass** (`if(feature('TRANSCRIPT_CLASSIFIER') && isAutoModeAvailable) auto; else if isBypass
bypass; else edits`). In v2.1.156, both slots prioritize **bypass over auto** (`if(_) bypass;
else if(K) auto; else edits`). So in a session where *both* auto-mode and
`--dangerously-skip-permissions` are available, the user is now offered "Yes, and bypass
permissions" where they previously saw "Yes, and use auto mode". See Section 13 for the full
diff. The likely rationale: if a user has explicitly opted into the most permissive flag
(`--dangerously-skip-permissions`), surfacing *bypass* as the primary elevated path respects
their stated intent, whereas auto-mode (classifier-gated) is the better default only when bypass
was *not* explicitly enabled.

---

## 6. Choice → result mapping (`_I8`) and the post-approval transition

### `getApprovalResult` (`_I8`) — the pure mapping

**What it does:** Translates a chosen `ResponseValue` (e.g. `yes-accept-edits-keep-context`)
into a `PermissionResult` object `{behavior, updatedInput, permissionUpdates, feedback,
contentBlocks}`. Crucially, in v2.1.156 this is a **standalone pure function** at
`cli_inner_pretty.js:589839-589877`, decoupled from the React handler.

**How it works (step-by-step):**
1. Destructure context: `currentPlan` (`q`), `planEditedLocally` (`K`), `allowedPrompts` (`_`),
   `acceptFeedback` (`z`), `isBypassPermissionsModeAvailable` (`A`), `trimmedFeedback` (`Y`),
   `hasImages` (`f`), `imageBlocks` (`O`), `showClearContext` (`M`).
2. Build `updatedInput` `j` = `{plan: currentPlan}` if the plan was edited locally, else `{}` —
   so a plan the user edited in the external editor is threaded back into the tool input.
3. `ultraplan` → `{behavior:"deny", feedback: Wkz}` (a canned refine-via-Ultraplan message).
4. **Clear-context choices** (`yes-bypass-permissions`/`yes-accept-edits`/`yes-auto-clear-context`
   when `showClearContext`) → `{behavior:"deny"}` — these are *handled inline* in the React
   handler (Section 6b), which re-injects the plan into a fresh context; here they only deny the
   current tool.
5. `yes-resume-auto-mode` when `h0()` (auto gate on) → `{behavior:"allow", updatedInput,
   permissionUpdates:[], feedback}` — note **empty** `permissionUpdates`; the React handler
   performs the auto activation imperatively.
6. Otherwise compute the target mode `J`: `yes-accept-edits-keep-context` →
   (`isBypass ? "bypassPermissions" : "acceptEdits"`); `yes-default-keep-context` → `"default"`;
   `yes-resume-auto-mode` (gate off fallthrough) → `"default"`. If `J` is defined →
   `{behavior:"allow", updatedInput, permissionUpdates: buildPermissionUpdates(J, allowedPrompts),
   feedback}`.
7. `no` → if no feedback and no images, return `null` (no-op, keep dialog open); else
   `{behavior:"deny", feedback: trimmedFeedback || "(See attached image)", contentBlocks:
   imageBlocks}`.

```javascript
// ============================================
// getApprovalResult - maps an approval choice to a PermissionResult (extracted pure fn)
// Location: cli_inner_pretty.js:589839-589877
// ============================================

// ORIGINAL (for source lookup):
function _I8(H, $) {
  let { currentPlan: q, planEditedLocally: K, allowedPrompts: _, acceptFeedback: z,
        isBypassPermissionsModeAvailable: A, trimmedFeedback: Y, hasImages: f,
        imageBlocks: O, showClearContext: M } = $,
    j = K ? { plan: q } : {};
  if (H === "ultraplan") return { behavior: "deny", feedback: Wkz };
  if (M && (H === "yes-bypass-permissions" || H === "yes-accept-edits" || H === "yes-auto-clear-context"))
    return { behavior: "deny" };
  if (H === "yes-resume-auto-mode" && h0())
    return { behavior: "allow", updatedInput: j, permissionUpdates: [], feedback: z };
  let J = H === "yes-accept-edits-keep-context" ? (A ? "bypassPermissions" : "acceptEdits")
        : H === "yes-default-keep-context" ? "default"
        : H === "yes-resume-auto-mode" ? "default" : void 0;
  if (J !== void 0) return { behavior: "allow", updatedInput: j, permissionUpdates: i9q(J, _), feedback: z };
  if (H === "no") {
    if (!Y && !f) return null;
    return { behavior: "deny", feedback: Y || (f ? "(See attached image)" : void 0),
             contentBlocks: O && O.length > 0 ? O : void 0 };
  }
  return null;
}

// READABLE (for understanding):
function getApprovalResult(choice, ctx) {
  const { currentPlan, planEditedLocally, allowedPrompts, acceptFeedback,
          isBypassPermissionsModeAvailable, trimmedFeedback, hasImages, imageBlocks,
          showClearContext } = ctx;
  const updatedInput = planEditedLocally ? { plan: currentPlan } : {};

  if (choice === "ultraplan") return { behavior: "deny", feedback: ULTRAPLAN_FEEDBACK };

  // Clear-context choices: deny here; the React handler re-injects the plan into a fresh context.
  if (showClearContext &&
      (choice === "yes-bypass-permissions" || choice === "yes-accept-edits" || choice === "yes-auto-clear-context"))
    return { behavior: "deny" };

  if (choice === "yes-resume-auto-mode" && isAutoModeGateEnabled())
    return { behavior: "allow", updatedInput, permissionUpdates: [], feedback: acceptFeedback };

  const targetMode =
    choice === "yes-accept-edits-keep-context" ? (isBypassPermissionsModeAvailable ? "bypassPermissions" : "acceptEdits")
    : choice === "yes-default-keep-context" ? "default"
    : choice === "yes-resume-auto-mode" ? "default"  // gate-off fallthrough
    : undefined;

  if (targetMode !== undefined)
    return { behavior: "allow", updatedInput, permissionUpdates: buildPermissionUpdates(targetMode, allowedPrompts), feedback: acceptFeedback };

  if (choice === "no") {
    if (!trimmedFeedback && !hasImages) return null;  // no-op: keep planning, nothing to send
    return { behavior: "deny",
             feedback: trimmedFeedback || (hasImages ? "(See attached image)" : undefined),
             contentBlocks: imageBlocks && imageBlocks.length > 0 ? imageBlocks : undefined };
  }
  return null;
}

// Mapping: _I8->getApprovalResult, H->choice, $->ctx, q->currentPlan, K->planEditedLocally,
//          _->allowedPrompts, z->acceptFeedback, A->isBypassPermissionsModeAvailable,
//          Y->trimmedFeedback, f->hasImages, O->imageBlocks, M->showClearContext,
//          j->updatedInput, J->targetMode, h0->isAutoModeGateEnabled, i9q->buildPermissionUpdates,
//          Wkz->ULTRAPLAN_FEEDBACK
```

**Why extract this into a pure function?** **What it does for maintainability:** v2.1.88 inlined
the entire choice→result branching inside the React `handleResponse` closure, intermixed with
side effects (mode transitions, telemetry, context mutation). v2.1.156 splits the *decision*
(pure, deterministic given the choice + context) from the *effects* (imperative, in `mH`/`pH`).
**Why this approach:** the pure function is unit-testable in isolation — you can assert that
`yes-accept-edits-keep-context` with `isBypass=true` returns `bypassPermissions` without
mounting React or mocking the app store. It also makes the `permissionUpdates` shape (built via
`buildPermissionUpdates`) the *single* place where the external mode + classifier addRules are
assembled. **Key insight:** the function deliberately returns `{behavior:"deny"}` for
clear-context choices and **empty** `permissionUpdates` for auto-resume — it is *not* the full
story for those choices. The React handler `pH` owns the side effects for exactly those two
cases, because they need to mutate the app store (re-inject the plan / activate auto), which a
pure function must not do. This is a clean effects boundary, not an omission.

### `buildPermissionUpdates` (`i9q`) — the permission-update assembler

**What it does:** Builds the `permissionUpdates` array: always a `setMode` to the external form
of the target mode, plus optional `addRules` when classifier-permissions is enabled and there
are allowed prompts.

```javascript
// ============================================
// buildPermissionUpdates - [setMode] + optional classifier addRules
// Location: cli_inner_pretty.js:589766-589776
// ============================================

// ORIGINAL (for source lookup):
function i9q(H, $) {
  let q = [{ type: "setMode", mode: Yi(H), destination: "session" }];
  if (jwH() && $ && $.length > 0)
    q.push({ type: "addRules",
      rules: $.map((K) => ({ toolName: K.tool, ruleContent: z97(K.prompt) })),
      behavior: "allow", destination: "session" });
  return q;
}

// READABLE (for understanding):
function buildPermissionUpdates(targetMode, allowedPrompts) {
  const updates = [{ type: "setMode", mode: toExternalPermissionMode(targetMode), destination: "session" }];
  if (isClassifierPermissionsEnabled() && allowedPrompts && allowedPrompts.length > 0)
    updates.push({
      type: "addRules",
      rules: allowedPrompts.map((p) => ({ toolName: p.tool, ruleContent: createPromptRuleContent(p.prompt) })),
      behavior: "allow", destination: "session",
    });
  return updates;
}

// Mapping: i9q->buildPermissionUpdates, H->targetMode, $->allowedPrompts,
//          Yi->toExternalPermissionMode, jwH->isClassifierPermissionsEnabled, z97->createPromptRuleContent
```

The `setMode` uses the *external* mode name (`toExternalPermissionMode`/`Yi`) because the
permission-update protocol speaks the external vocabulary (e.g. `auto` maps to external
`default`, see Section 10), while the live runtime uses internal names.

### 6b. Post-approval transition with side effects (`mA9.pH`)

**What it does:** The React result handler `pH` (`= mH`, `cli_inner_pretty.js:590031-590198`)
runs the *effects* for the chosen approval path. It is multi-path because different choices need
different store mutations.

**How it works (the distinct paths):**
1. **Ultraplan** (`:590034-590062`): emit `tengu_plan_exit{outcome:"ultraplan"}`, call
   `answer(getApprovalResult(...))` (deny), then fire `RE$(...)` to launch the web Ultraplan
   refinement seeded with the current plan.
2. **Clear-context choices** (`:590071-590111`): pick the target mode (`bypassPermissions` /
   `acceptEdits` / `auto` if gate on), build a brand-new `initialMessage` whose content is
   `"Implement the following plan:\n\n<plan>"` plus a transcript-path hint (so Claude can read
   the full pre-clear transcript if it needs exact snippets), an optional team-parallelization
   suggestion (when `R7()`), and any user feedback; set `clearContext:true` and the target
   `mode`; then `zQ(!0)` and `answer({behavior:"deny"})` — the tool is denied because the plan
   is being *re-injected into a fresh context* rather than continued in place.
3. **`yes-resume-auto-mode`** (with gate on, `:590112-590133`): `zQ(!0)`, `Gt(!0)`,
   `setAutoModeActive(!0)`, `transitionPermissionMode({from:"plan", to:"auto",
   trigger:"exit_plan_mode"})`, then `answer(getApprovalResult(...))`.
4. **Keep-context accept-edits / bypass / manual** (`CH` true, `:590134-590157`): transition
   `plan → (bypassPermissions|acceptEdits|default)`, emit telemetry, `answer(getApprovalResult(...))`.
5. **`no` with feedback/images** (`:590158-590183`): if no feedback and no images, return (no-op
   keep-planning); else convert pasted images to content blocks and `answer(getApprovalResult(...))`
   (deny + feedback).

All paths emit `tengu_plan_exit{outcome, …}`, giving a uniform analytics signal.

**Why split decision from effect this way?** **Trade-off:** the duplication between `_I8` and
`pH` (both branch on the choice string) is the cost of the pure/effect split. The benefit is
that the *permission contract* returned to the caller (`answer(...)`) is computed by the pure
function and is easy to reason about, while the *store side effects* (which cannot be pure) are
localized. **Key insight:** the clear-context path's `answer({behavior:"deny"})` is
counter-intuitive — the user said "Yes" yet the tool is denied. This is correct because the
"yes" outcome is realized not by *allowing the current ExitPlanMode call* but by *starting a new
turn* with the plan re-injected and the elevated mode set. The deny tells the agent loop "this
plan-mode turn is over"; the fresh `initialMessage` carries the work forward.

---

## 7. In-dialog keys: shift+tab quick-approve, ctrl+g external editor

**What it does:** The dialog's `onKeyDown` handler `eH` (`= K$`,
`cli_inner_pretty.js:590234-590257`) binds two shortcuts: **ctrl+g** opens the plan in an
external editor; **shift+tab** quick-approves with the accept-edits variant.

**How it works:**
- **ctrl+g** (`:590235-590252`): emit `tengu_plan_external_editor_used`; if there is a plan
  file path `S`, open it via `OF(S)` and (if the returned content differs from the current plan)
  set `planEditedLocally` (`l = c(!0)`) and update the displayed plan `B(content)`; if there is
  no file path, edit the in-memory plan via `vk(plan)`. On error, push a `"warning"` notification.
- **shift+tab** (`:590254-590256`): `mH(showClearContext ? "yes-accept-edits" :
  "yes-accept-edits-keep-context")` — i.e. quick-approve with the accept-edits choice,
  clear-context variant when `showClearContext` (`J`) is true, keep-context otherwise.

```javascript
// ============================================
// In-dialog key handler - ctrl+g external editor, shift+tab quick-approve
// Location: cli_inner_pretty.js:590234-590257
// ============================================

// ORIGINAL (for source lookup):
(K$ = (BH) => {
  if (BH.ctrl && BH.key === "g") {
    (BH.preventDefault(), d("tengu_plan_external_editor_used", {}),
      (async () => {
        if (S) {
          let s = await OF(S);
          if (s.error) Y({ key: "external-editor-error", text: s.error, color: "warning", priority: "high" });
          if (s.content !== null) { if (s.content !== b) c(!0); (B(s.content), g(!0)); }
        } else {
          let s = await vk(b);
          if (s.error) Y({ key: "external-editor-error", text: s.error, color: "warning", priority: "high" });
          if (s.content !== null && s.content !== b) (B(s.content), g(!0));
        }
      })());
    return;
  }
  if (BH.shift && BH.key === "tab") {
    (BH.preventDefault(), mH(J ? "yes-accept-edits" : "yes-accept-edits-keep-context"));
    return;
  }
})

// READABLE (for understanding):
const onKeyDown = (key) => {
  if (key.ctrl && key.key === "g") {
    key.preventDefault();
    track("tengu_plan_external_editor_used", {});
    (async () => {
      if (planFilePath) {
        const r = await openFileInExternalEditor(planFilePath);
        if (r.error) addNotification({ key: "external-editor-error", text: r.error, color: "warning", priority: "high" });
        if (r.content !== null) {
          if (r.content !== currentPlan) setPlanEditedLocally(true);
          setCurrentPlan(r.content);
          setShowSaveMessage(true);
        }
      } else {
        const r = await editStringInExternalEditor(currentPlan);
        if (r.error) addNotification({ key: "external-editor-error", text: r.error, color: "warning", priority: "high" });
        if (r.content !== null && r.content !== currentPlan) { setCurrentPlan(r.content); setShowSaveMessage(true); }
      }
    })();
    return;
  }
  if (key.shift && key.key === "tab") {
    key.preventDefault();
    handleResponse(showClearContext ? "yes-accept-edits" : "yes-accept-edits-keep-context");
    return;
  }
};

// Mapping: K$->onKeyDown, BH->key, S->planFilePath, b->currentPlan, c->setPlanEditedLocally,
//          B->setCurrentPlan, g->setShowSaveMessage, mH->handleResponse, J->showClearContext,
//          OF->openFileInExternalEditor, vk->editStringInExternalEditor, Y->addNotification, d->track
```

**Why bind shift+tab inside the dialog to accept-edits specifically?** Two reasons. First,
*consistency of muscle memory*: shift+tab is the global "advance to a more permissive mode" key
(Section 8); inside the dialog it should likewise pick the "yes, and let Claude make edits"
path, not "yes, manual" or "no". Second, *speed*: the most common approval is "the plan is good,
go code with auto-accepted edits", so making it a single keypress (no arrow navigation) reduces
friction. **Key insight:** the "No, keep planning" option's description literally reads
"shift+tab to approve with this feedback" (Section 5) — but note this describes the *Select*
widget's own shift+tab-while-on-that-row behavior of submitting feedback, whereas the dialog's
`onKeyDown` here approves with accept-edits. The two are complementary affordances that both
brand shift+tab as the "approve" key. The `ctrl+g`-edits-the-plan path threads the edited
content back into `updatedInput` via `planEditedLocally` → `getApprovalResult`'s
`updatedInput = {plan}`, so a user-edited plan is what actually gets approved and persisted.

---

## 8. Shift+Tab permission-mode cycle: keybinding, `handleCycleMode`, `getNextPermissionMode`

### The keybinding (`JaK`)

The shift+tab key constant `SHIFT_TAB_KEY` (`JaK`, `cli_inner_pretty.js:170200`) is computed as
`kO5 ? "shift+tab" : "meta+m"`, where `kO5` is true except on Windows running older
Node/terminal versions — those fall back to `meta+m` because the terminal cannot reliably
deliver `shift+tab`. It is bound to `chat:cycleMode` in the Chat context (`:170223`) and to
`confirm:cycleMode` in the Confirmation context (`:170285`), so the cycle works both at the
prompt and inside confirmation dialogs.

```javascript
// ============================================
// SHIFT_TAB_KEY + chat:cycleMode binding
// Location: cli_inner_pretty.js:170200, 170223, 170285
// ============================================

// ORIGINAL (for source lookup):
(JaK = kO5 ? "shift+tab" : "meta+m"),
// ... Chat context:
[JaK]: "chat:cycleMode",
// ... Confirmation context:
[JaK]: "confirm:cycleMode",

// READABLE (for understanding):
const SHIFT_TAB_KEY = canDeliverShiftTab ? "shift+tab" : "meta+m";
// Chat:        { [SHIFT_TAB_KEY]: "chat:cycleMode" }
// Confirmation:{ [SHIFT_TAB_KEY]: "confirm:cycleMode" }

// Mapping: JaK->SHIFT_TAB_KEY, kO5->canDeliverShiftTab
```

### `getNextPermissionMode` (`QCH`) — the cycle order

**What it does:** Given the current `ToolPermissionContext`, returns the next mode in the
shift+tab cycle.

**How it works (`cli_inner_pretty.js:578712-578730`):**
- `default → acceptEdits`
- `acceptEdits → plan`
- `plan →` `isBypassPermissionsModeAvailable ? "bypassPermissions"` : `canCycleToAuto(ctx) ?
  "auto"` : `"default"`
- `bypassPermissions →` `canCycleToAuto(ctx) ? "auto" : "default"`
- `dontAsk → default`
- default (any other) `→ default`

```javascript
// ============================================
// getNextPermissionMode - shift+tab cycle order (ant branch removed vs v2.1.88)
// Location: cli_inner_pretty.js:578712-578730
// ============================================

// ORIGINAL (for source lookup):
function QCH(H, $) {
  switch (H.mode) {
    case "default": return "acceptEdits";
    case "acceptEdits": return "plan";
    case "plan":
      if (H.isBypassPermissionsModeAvailable) return "bypassPermissions";
      if (PR8(H)) return "auto";
      return "default";
    case "bypassPermissions":
      if (PR8(H)) return "auto";
      return "default";
    case "dontAsk": return "default";
    default: return "default";
  }
}

// READABLE (for understanding):
function getNextPermissionMode(ctx, _teamContext) {
  switch (ctx.mode) {
    case "default": return "acceptEdits";
    case "acceptEdits": return "plan";
    case "plan":
      if (ctx.isBypassPermissionsModeAvailable) return "bypassPermissions";
      if (canCycleToAuto(ctx)) return "auto";
      return "default";
    case "bypassPermissions":
      if (canCycleToAuto(ctx)) return "auto";
      return "default";
    case "dontAsk": return "default";
    default: return "default";
  }
}

// Mapping: QCH->getNextPermissionMode, H->ctx, $->_teamContext, PR8->canCycleToAuto
```

**Why this cycle order?** **What it does for the user mental model:** the order escalates
permissiveness gently — `default` (ask for everything) → `acceptEdits` (auto-approve file edits
only) → `plan` (read-only design) — then, from plan, *optionally* up to the most permissive
realistic mode (`bypassPermissions` or `auto`), then wraps to `default`. Plan sits *after*
acceptEdits, not before, because plan is the most restrictive working mode (read-only) and
acceptEdits is a mild escalation from default; placing plan last among the "normal" trio lets a
user tab once to grant edits and twice to drop into design. **Trade-off:** `dontAsk` has a case
but the cycle never *produces* it (no branch returns `dontAsk`); it is handled defensively in
case the context is already in `dontAsk` (e.g. set programmatically), where the safe exit is
`default`. **Key insight — ant branch removed:** v2.1.88's `default` case had a
`USER_TYPE==='ant'` special path that skipped `acceptEdits`/`plan` and jumped toward
`bypassPermissions`/`auto` for Anthropic-internal users. v2.1.156 dropped it — `default` now
*unconditionally* returns `acceptEdits` for everyone. The auto/internal behavior is now expressed
purely through the unconditional auto chip + `canCycleToAuto` gating, simplifying the cycle to a
single code path with no user-type branch. See Section 13.

### `handleCycleMode` (`uV`) — the `chat:cycleMode` action handler

**What it does:** The keybinding action runs `handleCycleMode` (`uV`,
`cli_inner_pretty.js:585344-585429`), which computes the next mode, applies it (locally or
remotely), handles the teammate case, gates entry into auto with an opt-in hold, and emits
telemetry.

**How it works (the salient branches):**
1. **Teammate branch** (`:585346-585362`): when in a team and the cursor is on a teammate task,
   compute `getNextPermissionMode({...ctx, mode: teammate.permissionMode})` and update *that
   teammate's* `permissionMode` in the task registry — the cycle drives the selected teammate's
   mode, not the user's own.
2. **No-op guard** (`:585367-585376`): if `getNextPermissionMode` returns the current mode (no
   other modes available), emit `uH("mode_switch", "no_other_modes")` and, in a remote session,
   surface "No other permission modes are available in this remote session".
3. **Auto opt-in hold** (`:585377-585389`): if the next mode is `auto`, current is not `auto`,
   not `lQ()`, and not a teammate (`!e$`), do **not** switch immediately — arm an 800ms
   `setTimeout` (`H1.current`) that opens the AutoModeOptInDialog; return. Releasing shift+tab
   before 800ms cancels it (`H1.current()` cancels). See Section 9.
4. **Remote path** (`:585395-585415`): if in a remote (`W3()`) session, send a
   `set_permission_mode` control request; on rejection, revert and warn.
5. **Apply + telemetry** (`:585416-585428`): compute `cyclePermissionMode(ctx, teamCtx,
   "shift_tab")` to get the transitioned context, emit `tengu_mode_cycle{to}`, plus
   `mode_plan_enter`/`mode_plan_exit`/`mode_auto_enter` haptics, set `lastPlanModeUse` timestamp
   when entering plan, and commit the new `toolPermissionContext`.

### `cyclePermissionMode` (`c19`) — next mode + transitioned context

```javascript
// ============================================
// cyclePermissionMode - {nextMode, transitioned context} (adds trigger arg vs v2.1.88)
// Location: cli_inner_pretty.js:578731-578734
// ============================================

// ORIGINAL (for source lookup):
function c19(H, $, q) {
  let K = QCH(H, $);
  return { nextMode: K, context: vl(H.mode, K, H, q) };
}

// READABLE (for understanding):
function cyclePermissionMode(ctx, teamContext, trigger) {
  const nextMode = getNextPermissionMode(ctx, teamContext);
  return { nextMode, context: transitionPermissionMode(ctx.mode, nextMode, ctx, trigger) };
}

// Mapping: c19->cyclePermissionMode, H->ctx, $->teamContext, q->trigger, K->nextMode,
//          QCH->getNextPermissionMode, vl->transitionPermissionMode
```

`handleCycleMode` calls this with `trigger = "shift_tab"` (`cli_inner_pretty.js:585416`), which
threads through `transitionPermissionMode` into the `mode_changed` telemetry, distinguishing
keyboard-cycle transitions from `/plan`-command or `exit_plan_mode` transitions.

---

## 9. Why auto is conditionally available: `canCycleToAuto` (`PR8`), the opt-in hold, `transitionPermissionMode` (`vl`)

### `canCycleToAuto` (`PR8`) and `isAutoModeOptInDismissed` (`i4q`)

**What it does:** Decides whether the cycle is *allowed* to offer `auto`, checking three signals:
a cached availability flag, a live gate, and whether the user dismissed the opt-in.

**How it works (`cli_inner_pretty.js:578696-578711`):**
- `canCycleToAuto(ctx)` = `!!ctx.isAutoModeAvailable && isAutoModeGateEnabled() &&
  !isAutoModeOptInDismissed()`. When false, it logs a structured debug line naming each signal.
- `isAutoModeOptInDismissed()` = `Boolean(getConfig().autoModeOptInDismissed) && !K$$()`.

```javascript
// ============================================
// canCycleToAuto + isAutoModeOptInDismissed - three-signal auto gate
// Location: cli_inner_pretty.js:578696-578711
// ============================================

// ORIGINAL (for source lookup):
function PR8(H) {
  {
    let $ = h0(), q = i4q(), K = !!H.isAutoModeAvailable && $ && !q;
    if (!K)
      N(`[auto-mode] canCycleToAuto=false: ctx.isAutoModeAvailable=${H.isAutoModeAvailable} isAutoModeGateEnabled=${$} dismissed=${q} reason=${kl()}`);
    return K;
  }
  return !1;
}
function i4q() { return Boolean(b$().autoModeOptInDismissed) && !K$$(); }

// READABLE (for understanding):
function canCycleToAuto(ctx) {
  const gateEnabled = isAutoModeGateEnabled();
  const dismissed = isAutoModeOptInDismissed();
  const can = !!ctx.isAutoModeAvailable && gateEnabled && !dismissed;
  if (!can)
    logForDebugging(`[auto-mode] canCycleToAuto=false: ctx.isAutoModeAvailable=${ctx.isAutoModeAvailable} isAutoModeGateEnabled=${gateEnabled} dismissed=${dismissed} reason=${getAutoModeUnavailableReason()}`);
  return can;
}
function isAutoModeOptInDismissed() {
  return Boolean(getConfig().autoModeOptInDismissed) && !someOverride();
}

// Mapping: PR8->canCycleToAuto, H->ctx, $->gateEnabled, q->dismissed, K->can,
//          h0->isAutoModeGateEnabled, i4q->isAutoModeOptInDismissed, N->logForDebugging,
//          b$->getConfig, kl->getAutoModeUnavailableReason
```

**Why three signals (cached + live + dismissed)?** The cached `isAutoModeAvailable` is set once
at startup. The live `isAutoModeGateEnabled()` (`h0`) can flip mid-session (a circuit breaker or
a settings change can disable auto after startup). Checking *only* the cached flag would let the
cycle offer auto even after the gate dropped, and `transitionPermissionMode` would then throw
(Section 9, below) — silently breaking shift+tab. The `dismissed` check honors a user who
explicitly opted out of the auto-mode opt-in dialog. **Key insight:** this same `i4q` dismissal
check is reused inside the dialog (`mA9:589913`: `BH = isAutoModeAvailable && !i4q()`) to decide
whether the approval option list should even *offer* auto — so the cycle and the dialog agree on
auto availability through a shared predicate.

### The 800ms opt-in hold

**What it does:** The first time a user cycles *into* auto, the switch is delayed behind an 800ms
hold that shows the opt-in dialog, so engaging the most permissive realistic mode is a conscious
act.

**How it works (`cli_inner_pretty.js:585377-585389`):** `n6 = (nextMode === "auto" && current !==
"auto" && !lQ() && !e$)`; when `n6`, arm `H1.current = setTimeout(() => {showOptIn(true)}, 800)`
and return *without switching*. If the user releases shift+tab before 800ms, the timeout's
cancel (`H1.current()`) runs and no switch happens.

**Why an 800ms hold rather than an immediate dialog?** **Trade-off:** an immediate dialog on the
first auto-cycle would interrupt a user who merely tabbed *past* auto on the way to wrapping back
to default. The hold means a *deliberate* press-and-hold is required to summon the opt-in;
incidental taps are ignored. **Key insight:** this is a friction gate by design — auto mode is
the most permissive realistic mode, so the UX intentionally makes it the only mode you cannot
reach by a single careless tap.

### `transitionPermissionMode` (`vl`) — the context surgery

**What it does:** Given a (from, to) mode pair, mutates the `ToolPermissionContext` to be
correct for the new mode: stripping `prePlanMode` when leaving plan, requiring the auto gate
when entering auto, stripping dangerous permissions for auto, and restoring them when leaving.

**How it works (`cli_inner_pretty.js:442777-442791`):**
1. If `from === to`, return context unchanged.
2. Emit `handlePlanModeTransition` (`t1H`) telemetry, run `Tt`/`Cm8` bookkeeping.
3. On `plan → non-plan`, call `zQ(!0)` (mark plan-mode exited).
4. On `→ plan` (from non-plan), return `prepareContextForPlanMode(ctx)` (`xhH`).
5. Compute `wasAuto` (`from==='auto'` or plan-with-active-auto) and `toAuto` (`to==='auto'`):
   - **entering auto** (`toAuto && !wasAuto`): **throw if `!isAutoModeGateEnabled()`** ("Cannot
     transition to auto mode: gate is not enabled"); else activate auto and strip dangerous
     permissions (`Km`).
   - **leaving auto** (`wasAuto && !toAuto`): deactivate auto, `PR(!0)`, restore dangerous
     permissions (`EzH`).
6. On `plan → non-plan`, clear `prePlanMode`.

```javascript
// ============================================
// transitionPermissionMode - per-mode context surgery; throws if auto gate off
// Location: cli_inner_pretty.js:442777-442791
// ============================================

// ORIGINAL (for source lookup):
function vl(H, $, q, K) {
  if (H === $) return q;
  if ((t1H({ from: H, to: $, trigger: K }), Tt(H, $), Cm8(H, $), H === "plan" && $ !== "plan")) zQ(!0);
  {
    if ($ === "plan" && H !== "plan") return xhH(q);
    let _ = H === "auto" || (H === "plan" && (Pk?.isAutoModeActive() ?? !1)), z = $ === "auto";
    if (z && !_) {
      if (!h0()) throw Error("Cannot transition to auto mode: gate is not enabled");
      (Pk?.setAutoModeActive(!0), (q = Km(q)));
    } else if (_ && !z) (Pk?.setAutoModeActive(!1), PR(!0), (q = EzH(q)));
  }
  if (H === "plan" && $ !== "plan" && q.prePlanMode) return { ...q, prePlanMode: void 0 };
  return q;
}

// READABLE (for understanding):
function transitionPermissionMode(fromMode, toMode, ctx, trigger) {
  if (fromMode === toMode) return ctx;
  handlePlanModeTransition({ from: fromMode, to: toMode, trigger });
  recordModeChange(fromMode, toMode);
  bookkeepModeChange(fromMode, toMode);
  if (fromMode === "plan" && toMode !== "plan") markPlanModeExited(true);

  if (toMode === "plan" && fromMode !== "plan") return prepareContextForPlanMode(ctx);

  const wasAuto = fromMode === "auto" || (fromMode === "plan" && (autoModeController?.isAutoModeActive() ?? false));
  const toAuto = toMode === "auto";
  if (toAuto && !wasAuto) {
    if (!isAutoModeGateEnabled()) throw new Error("Cannot transition to auto mode: gate is not enabled");
    autoModeController?.setAutoModeActive(true);
    ctx = stripDangerousPermissionsForAutoMode(ctx);
  } else if (wasAuto && !toAuto) {
    autoModeController?.setAutoModeActive(false);
    onAutoModeDeactivated(true);
    ctx = restoreDangerousPermissions(ctx);
  }

  if (fromMode === "plan" && toMode !== "plan" && ctx.prePlanMode) return { ...ctx, prePlanMode: undefined };
  return ctx;
}

// Mapping: vl->transitionPermissionMode, H->fromMode, $->toMode, q->ctx, K->trigger,
//          t1H->handlePlanModeTransition, zQ->markPlanModeExited, xhH->prepareContextForPlanMode,
//          h0->isAutoModeGateEnabled, Pk->autoModeController, Km->stripDangerousPermissionsForAutoMode,
//          EzH->restoreDangerousPermissions, _->wasAuto, z->toAuto
```

**Why throw (rather than fall back) when entering auto with the gate off?** The throw is the
*reason* `canCycleToAuto` must check the live gate first. If the cycle ever produced `auto` while
the gate was off, this throw would surface as an uncaught error in the keypress handler and
freeze shift+tab. The v2.1.88 source comment is explicit about this (it says the live check
"prevents `transitionPermissionMode` from throwing … which would silently crash the shift+tab
handler"). **Key insight — auto is gated in three independent places:** (1) `canCycleToAuto`
(cycle eligibility), (2) this throw in `transitionPermissionMode` (a hard guard), and (3)
`ExitPlanModeV2Tool.call` (`cli_inner_pretty.js:350124, 350149`) where `prePlanMode==='auto'` but
the gate is off falls back to `default` with a "plan exit → default" warning. The redundancy is
deliberate defense-in-depth because the live gate can diverge from any cached state at any moment.

---

## 10. Mode-chip theming: `PERMISSION_MODE_CONFIG` (`xEq`) and planMode colors

**What it does:** A single config object `PERMISSION_MODE_CONFIG` (`xEq`,
`cli_inner_pretty.js:49228-49253`) supplies, for each mode, the chip `title`, `shortTitle`,
`symbol`, `color`, and `external` (external-protocol name). Accessors `getModeColor` (`tV`),
`getModeTitle` (`tt`), `toExternalPermissionMode` (`Yi`), `getModeSymbol` (`n3H`), all via
`getModeConfig` (`WF$`, which falls back to the `default` entry).

The plan entry is `{title:"Plan Mode", shortTitle:"Plan", symbol: XF$, color:"planMode",
external:"plan"}`, where `XF$` is `PAUSE_ICON` `"⏸"` (`cli_inner_pretty.js:49136`).

```javascript
// ============================================
// PERMISSION_MODE_CONFIG (plan entry) + accessors
// Location: cli_inner_pretty.js:49228-49253, 49194-49220
// ============================================

// ORIGINAL (for source lookup):
xEq = {
  default: { title: "Default", shortTitle: "Default", symbol: "", color: "text", external: "default" },
  plan: { title: "Plan Mode", shortTitle: "Plan", symbol: XF$, color: "planMode", external: "plan" },
  acceptEdits: { title: "Accept edits", shortTitle: "Accept", symbol: "⏵⏵", color: "autoAccept", external: "acceptEdits" },
  bypassPermissions: { title: "Bypass Permissions", shortTitle: "Bypass", symbol: "⏵⏵", color: "error", external: "bypassPermissions" },
  dontAsk: { title: "Don't Ask", shortTitle: "DontAsk", symbol: "⏵⏵", color: "error", external: "dontAsk" },
  auto: { title: "Auto mode", shortTitle: "Auto", symbol: "⏵⏵", color: "warning", external: "auto" },
};
function tV(H) { return WF$(H).color; }
function Yi(H) { return WF$(H).external; }
function WF$(H) { return xEq[H] ?? xEq.default; }

// READABLE (for understanding):
const PERMISSION_MODE_CONFIG = {
  default: { title: "Default", shortTitle: "Default", symbol: "", color: "text", external: "default" },
  plan: { title: "Plan Mode", shortTitle: "Plan", symbol: PAUSE_ICON /* "⏸" */, color: "planMode", external: "plan" },
  acceptEdits: { title: "Accept edits", shortTitle: "Accept", symbol: "⏵⏵", color: "autoAccept", external: "acceptEdits" },
  bypassPermissions: { title: "Bypass Permissions", shortTitle: "Bypass", symbol: "⏵⏵", color: "error", external: "bypassPermissions" },
  dontAsk: { title: "Don't Ask", shortTitle: "DontAsk", symbol: "⏵⏵", color: "error", external: "dontAsk" },
  auto: { title: "Auto mode", shortTitle: "Auto", symbol: "⏵⏵", color: "warning", external: "auto" },
};
const getModeColor = (mode) => getModeConfig(mode).color;
const toExternalPermissionMode = (mode) => getModeConfig(mode).external;
const getModeConfig = (mode) => PERMISSION_MODE_CONFIG[mode] ?? PERMISSION_MODE_CONFIG.default;

// Mapping: xEq->PERMISSION_MODE_CONFIG, tV->getModeColor, Yi->toExternalPermissionMode,
//          WF$->getModeConfig, XF$->PAUSE_ICON
```

The `planMode` theme color resolves per-theme: true-color `rgb(0,102,102)` (a teal,
`cli_inner_pretty.js:147582`) and 16-color `ansi:cyan` (`cli_inner_pretty.js:147653`).

**Why "⏸" (pause) for plan and "⏵⏵" (fast-forward) for everything else?** **What it signals:**
plan mode is read-only — Claude *pauses* execution to explore and design. Every other elevated
mode (acceptEdits / bypass / dontAsk / auto) is about *going faster* (skipping some or all
prompts), so they share the double-fast-forward glyph. **Key insight:** the pause icon is the
only mode-unique symbol, and it carries semantic weight — a glance at the chip tells the user
whether Claude is in a "stopped, just thinking" state vs. an "executing quickly" state. The
config is byte-for-byte identical to v2.1.88's `PermissionMode.ts:42-91` (Section 13), confirming
this iconography is a stable design decision.

---

## 11. The `/plan` slash command (`v5z`): three-way behavior + new ccr remote branch

**What it does:** `planCommandCall` (`v5z`, `cli_inner_pretty.js:513519-513567`) implements the
`/plan` command: enter plan mode, view the current plan, or open
the plan in an external editor. It is registered via `planCommandDef` (`k5z`/`lHq`,
`cli_inner_pretty.js:513585-513593`) loading `planCommandModule` (`dg4`, `:513488-513489`).

**How it works (the three primary paths):**
1. **Remote (ccr) short-circuit** (`:513523-513538`, **new in v2.1.156**): if the session is a
   remote `ccr` session (`W3()?.kind === "ccr"`) and not already in plan, switch to plan, send a
   remote `set_permission_mode` control request, and emit "Enabled plan mode" (or "Already in
   plan mode." if already there). Returns early.
2. **Not in plan mode** (`:513539-513553`): switch to plan via `prepareContextForPlanMode` +
   `setMode`. If a description arg was given (`L && L !== "open"`), emit "Enabled plan mode" with
   `{shouldQuery:true}` (kicking off a query from the description). If no interactive UI
   (`!n8$()`), just emit "Enabled plan mode".
3. **In plan mode** (`:513554-513566`): if there is no plan (`!getPlan()`), emit "Enabled plan
   mode" / "Already in plan mode. No plan written yet."; if the arg is `open`, open the plan file
   in the external editor (`OF`); otherwise render the current plan via `PlanDisplay` (`V5z`)
   with a `"/plan open" to edit` hint.

```javascript
// ============================================
// planCommandCall - /plan handler; new ccr remote short-circuit at top
// Location: cli_inner_pretty.js:513519-513567
// ============================================

// ORIGINAL (for source lookup):
async function v5z(H, $, q) {
  let { getAppState: K, setAppState: _ } = $, A = K().toolPermissionContext.mode, Y = W3();
  if (Y?.kind === "ccr") {
    if (A !== "plan")
      (Tt(A, "plan"),
        _((L) => ({ ...L, toolPermissionContext: nY(xhH(L.toolPermissionContext),
          { type: "setMode", mode: "plan", destination: "session" }) })),
        Y.sendControlRequest({ subtype: "set_permission_mode", mode: "plan" }),
        H("Enabled plan mode"));
    else H("Already in plan mode.");
    return null;
  }
  let f = A !== "plan";
  if (f) {
    (Tt(A, "plan"),
      _((P) => ({ ...P, toolPermissionContext: nY(xhH(P.toolPermissionContext),
        { type: "setMode", mode: "plan", destination: "session" }) })));
    let L = q.trim();
    if (L && L !== "open") return (H("Enabled plan mode", { shouldQuery: !0 }), null);
    if (!n8$()) return (H("Enabled plan mode"), null);
  }
  let O = DV(), M = wV();
  if (!O) return (H(f ? "Enabled plan mode" : "Already in plan mode. No plan written yet."), null);
  if (q.trim().split(/\s+/)[0] === "open") {
    let L = await OF(M);
    if (L.error) H(L.error); else H(`Opened plan in editor: ${M}`);
    return null;
  }
  let w = Ym(), D = w ? IL(w) : void 0,
    X = await rc7(kV.createElement(V5z, { planContent: O, planPath: M, editorName: D }));
  return (H(X), null);
}

// READABLE (for understanding):
async function planCommandCall(emit, { getAppState, setAppState }, args) {
  const currentMode = getAppState().toolPermissionContext.mode;
  const remote = getRemoteSession();

  // NEW in v2.1.156: ccr remote short-circuit
  if (remote?.kind === "ccr") {
    if (currentMode !== "plan") {
      recordModeChange(currentMode, "plan");
      setAppState((s) => ({ ...s, toolPermissionContext: applyPermissionUpdate(
        prepareContextForPlanMode(s.toolPermissionContext), { type: "setMode", mode: "plan", destination: "session" }) }));
      remote.sendControlRequest({ subtype: "set_permission_mode", mode: "plan" });
      emit("Enabled plan mode");
    } else emit("Already in plan mode.");
    return null;
  }

  const wasNotInPlan = currentMode !== "plan";
  if (wasNotInPlan) {
    recordModeChange(currentMode, "plan");
    setAppState((s) => ({ ...s, toolPermissionContext: applyPermissionUpdate(
      prepareContextForPlanMode(s.toolPermissionContext), { type: "setMode", mode: "plan", destination: "session" }) }));
    const arg = args.trim();
    if (arg && arg !== "open") return (emit("Enabled plan mode", { shouldQuery: true }), null);
    if (!hasInteractiveUI()) return (emit("Enabled plan mode"), null);
  }

  const plan = getPlan(), planPath = getPlanFilePath();
  if (!plan) return (emit(wasNotInPlan ? "Enabled plan mode" : "Already in plan mode. No plan written yet."), null);
  if (args.trim().split(/\s+/)[0] === "open") {
    const r = await openFileInExternalEditor(planPath);
    emit(r.error ? r.error : `Opened plan in editor: ${planPath}`);
    return null;
  }
  const editor = getExternalEditorName();
  const rendered = await renderStatic(<PlanDisplay planContent={plan} planPath={planPath} editorName={editor} />);
  return (emit(rendered), null);
}

// Mapping: v5z->planCommandCall, H->emit, $->ctx, q->args, K->getAppState, _->setAppState,
//          A->currentMode, Y->remote, f->wasNotInPlan, DV->getPlan, wV->getPlanFilePath,
//          OF->openFileInExternalEditor, V5z->PlanDisplay, n8$->hasInteractiveUI, xhH->prepareContextForPlanMode
```

**Why a three-way handler instead of separate commands?** `/plan` overloads on *current state*:
the same word means "enter" when you're out of plan mode and "show" when you're in it, which
matches the user's natural language ("plan" = "let me see/do the plan"). The `[open|<description>]`
argument hint disambiguates the two power-user paths. **Why the new ccr short-circuit?** A remote
ccr session does not own the local permission context the same way; the mode change must be
mirrored to the remote via a control request, and the rich PlanDisplay rendering is skipped
(remote sessions get a plain "Enabled plan mode" string). Placing it as an early `return`
prevents the local-rendering paths below from running in a context where they would not apply.
**Key insight:** `shouldQuery:true` on the description path is what turns `/plan implement X` into
an *active* turn — it does not just switch mode, it submits "X" as a query so Claude immediately
starts planning that task.

---

## 12. Teammate plan approval: a distinct flow that bypasses the local dialog

When the current user is a *teammate* (not the team lead), the local approval dialog `mA9` is
**never shown**. Two checks enforce this:

- `ExitPlanModeV2Tool.checkPermissions` (`JC.checkPermissions`,
  `cli_inner_pretty.js:350078-350081`) returns `{behavior:"allow", updatedInput}` when `isTeammate()`
  (`FA()`) — so the permission layer never raises the "ask" that would mount `mA9`. For
  non-teammates it returns `{behavior:"ask", message:"Exit plan mode?"}`.
- `ExitPlanModeV2Tool.call` (`:350101-350120`) when `isTeammate()` && `NY$()` sends a
  `plan_approval_request` message to `"team-lead"` and returns `{… awaitingLeaderApproval:true …}`,
  which drives the `_$4` "Plan submitted for team lead approval / Waiting for team lead to review
  and approve..." render (Section 2).

```javascript
// ============================================
// ExitPlanModeV2Tool.checkPermissions - teammate bypasses the local approval dialog
// Location: cli_inner_pretty.js:350078-350081
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions(H, $) {
  if (FA()) return { behavior: "allow", updatedInput: H };
  return { behavior: "ask", message: "Exit plan mode?", updatedInput: H };
}

// READABLE (for understanding):
async checkPermissions(input, ctx) {
  if (isTeammate()) return { behavior: "allow", updatedInput: input };
  return { behavior: "ask", message: "Exit plan mode?", updatedInput: input };
}

// Mapping: FA->isTeammate, H->input, $->ctx
```

**Why route teammate approval to the lead instead of a local dialog?** In a team, the *team lead*
owns the decision to start coding; a teammate approving their own plan locally would defeat the
review model. So a teammate's `ExitPlanMode` becomes an async request-to-lead, and the teammate's
UI shows a "waiting" state rather than an interactive dialog. **Key insight:** the `checkPermissions`
"allow" for teammates is what *prevents* the `ask`→`mA9` path; the request-to-lead is then issued
in `call`. The two together cleanly separate "no local prompt" (permission layer) from "ask the
lead" (tool body).

---

## 13. Cross-version diff summary (v2.1.88 → v2.1.156)

The behavioral diff table below is the only table in this document, permitted because it is a
cross-version comparison. All v2.1.88 facts come from the unobfuscated TypeScript under
`/lyz/codespace/3rd/claude-code/src/`; all v2.1.156 facts are cited above.

| Aspect | v2.1.88 | v2.1.156 | Significance |
|---|---|---|---|
| **Approval option priority** | Both slots: **auto > bypass > edits** (`ExitPlanModePermissionRequest.tsx:690-727`, gated `feature('TRANSCRIPT_CLASSIFIER') && isAutoModeAvailable`) | Both slots: **bypass > auto > edits** (`Gkz`, `cli_inner_pretty.js:589804-589810`) | **CHANGED (HIGH).** When both auto and bypass are available the *offered* elevated mode flipped from auto to bypass. |
| **`getNextPermissionMode` `default` case** | `if(USER_TYPE==='ant'){ if isBypass→bypass; if canCycleToAuto→auto; return default } return acceptEdits` (`getNextPermissionMode.ts:40-51`) | Unconditional `return "acceptEdits"` (`QCH`, `cli_inner_pretty.js:578714-578715`) | **CHANGED (HIGH).** The ant-only skip-to-auto path was removed; the cycle now has one code path for all users. |
| **`canCycleToAuto` feature gate** | Wrapped in `if(feature('TRANSCRIPT_CLASSIFIER'))`, returns `false` outside it (`getNextPermissionMode.ts:18-28`) | No `feature()` wrap; checks live gate `h0()` + dismissed `i4q()` (`PR8`, `cli_inner_pretty.js:578696-578708`) | **CHANGED (LOW).** Same intent (cached + live + dismissed) but the experimental feature flag was retired; an explicit `!dismissed` check was made first-class. |
| **`auto` chip in config** | Gated by `feature('TRANSCRIPT_CLASSIFIER')` | Unconditional entry `{title:"Auto mode", color:"warning", external:"auto"}` (`xEq`, `cli_inner_pretty.js:49252`) | **CHANGED (LOW).** Auto graduated from experimental to a standard config entry. |
| **`/plan` ccr remote branch** | Absent (`commands/plan/`) | New `Y?.kind==='ccr'` short-circuit sending remote `set_permission_mode` (`v5z`, `cli_inner_pretty.js:513523-513538`) | **NEW (HIGH).** Remote ccr sessions get a dedicated plan-mode entry that mirrors mode via control request. |
| **Choice→result mapping** | Inlined in the React handler | Extracted to pure `getApprovalResult` (`_I8`, `cli_inner_pretty.js:589839`) | **CHANGED (MEDIUM).** Refactor: pure decision separated from React effects; testable. |
| **`cyclePermissionMode` signature** | `(ctx, teamContext)` → `transitionPermissionMode(mode, next, ctx)` (`getNextPermissionMode.ts:88-101`) | `(ctx, teamContext, trigger)` → `vl(mode, next, ctx, trigger)` (`c19`, `cli_inner_pretty.js:578731-578734`) | **CHANGED (LOW).** A `trigger` arg (`"shift_tab"`) was threaded for telemetry. |
| **Mode chip config** | `PERMISSION_MODE_CONFIG` (`PermissionMode.ts:42-91`) | `xEq` (`cli_inner_pretty.js:49228-49253`) | **IDENTICAL** for plan: `{title:"Plan Mode", shortTitle:"Plan", symbol:PAUSE_ICON, color:"planMode", external:"plan"}`. |
| **Approval dialog titles/labels** | "Exit plan mode?", "Ready to code?", "Here is Claude's plan:", "Claude wants to exit plan mode" | Same strings at `mA9:590297/590363/590314/590270` | **IDENTICAL.** Stable product copy. |
| **`ExitPlanMode.checkPermissions`** | `isTeammate→allow else {ask, "Exit plan mode?"}` (`ExitPlanModeV2Tool.ts:226-238`) | Same (`JC.checkPermissions`, `cli_inner_pretty.js:350078-350081`) | **IDENTICAL.** |
| **`buildPermissionUpdates`** | `[setMode]+classifier addRules` (`ExitPlanModePermissionRequest.tsx:56-76`) | Same (`i9q`, `cli_inner_pretty.js:589766-589776`) | **IDENTICAL.** |
| **`autoNameSessionFromPlan`** | Skip if persistence off / already-named unless clearContext; `generateSessionName(plan.slice(0,1000))` (`...tsx:83-117`) | Same (`Zkz`, `cli_inner_pretty.js:589777-589793`) | **IDENTICAL.** |
| **plan-case cycle order** | `plan→(isBypass?bypass:canCycleToAuto?auto:default)` (`getNextPermissionMode.ts:55-62`) | Same (`QCH`, `cli_inner_pretty.js:578718-578721`) | **IDENTICAL.** |

### Deep dive: the priority flip — why it matters

**What changed:** In v2.1.88 the elevated "Yes" option's mode was chosen `auto > bypass > edits`;
in v2.1.156 it is `bypass > auto > edits` (Section 5). **Why it is non-obvious:** both versions
*offer the same set* of elevated modes when available; only the *primary* (top-listed, and the
one the shift+tab quick-approve indirectly biases toward) changed. A casual diff of the option
labels would miss it because the label *strings* are unchanged ("Yes, and bypass permissions"
existed in both); only the *condition order* moved. **Why the new order:** a user who launched
with `--dangerously-skip-permissions` has made an explicit, deliberate choice to run without
prompts; honoring that by surfacing *bypass* as the primary elevated path respects stated intent.
Auto-mode (classifier-gated, opt-in) is the better default precisely when the user has *not*
explicitly enabled bypass. **Key insight:** because the in-dialog shift+tab quick-approve picks
`yes-accept-edits-keep-context` (Section 7) — whose target mode is `bypassPermissions` when
bypass is available (`getApprovalResult`, Section 6) — the flip also changes what a single
shift+tab inside the dialog grants, from accept-edits-or-auto toward accept-edits-or-bypass.

### Deep dive: the ant-branch removal — why it simplifies

**What changed:** v2.1.88's `getNextPermissionMode` had a `USER_TYPE==='ant'` branch in the
`default` case that skipped `acceptEdits`/`plan` for Anthropic-internal users and jumped toward
`bypassPermissions`/`auto`; v2.1.156 unconditionally returns `acceptEdits`. **Why remove it:**
maintaining a user-type fork in the *hottest* UX path (every shift+tab from default) is a source
of subtle divergence — internal users got a different cycle than everyone else, so a bug in the
cycle might reproduce for one cohort but not the other. By consolidating to one path and
expressing the auto capability purely through the (now unconditional) auto chip + `canCycleToAuto`
gating, the cycle becomes cohort-agnostic. **Trade-off:** internal users now take the same
`default → acceptEdits → plan → …` walk as everyone else, costing them one extra tab to reach
auto from default — a negligible price for a single, uniformly-tested code path. **Key insight:**
this is part of a broader v2.1.156 theme of retiring the `TRANSCRIPT_CLASSIFIER` experimental
flag and graduating auto-mode into the standard config (the auto chip and `canCycleToAuto` both
dropped their `feature()` wraps), of which the ant-branch removal is the cycle-side counterpart.

---

## Related Symbols

> Symbol mappings live in the central index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)

Key symbols in this document:

- `renderExitPlanModeResult` (obfuscated: `_$4`) - ExitPlanMode 3-state result render (`cli_inner_pretty.js:349843-349900`)
- `RejectedPlanMessage` (obfuscated: `RL8`) - "User rejected Claude's plan:" boxed render (`cli_inner_pretty.js:349805-349832`)
- `renderExitPlanModeRejected` (obfuscated: `z$4`) - ExitPlanMode rejected-message wrapper (`cli_inner_pretty.js:349901-349904`)
- `renderExitPlanModeToolUse` (obfuscated: `K$4`) - ExitPlanMode tool-use render → null (`cli_inner_pretty.js:349840-349842`)
- `renderEnterPlanModeResult` (obfuscated: `sH4`) - "Entered plan mode" render (`cli_inner_pretty.js:349658-349673`)
- `renderEnterPlanModeRejected` (obfuscated: `tH4`) - "User declined to enter plan mode" (`cli_inner_pretty.js:349675-349681`)
- `renderEnterPlanModeToolUse` (obfuscated: `aH4`) - EnterPlanMode tool-use render → null (`cli_inner_pretty.js:349655-349657`)
- `EnterPlanModeTool` (obfuscated: `hL8`) - EnterPlanMode tool definition (`cli_inner_pretty.js:349703-349766`)
- `ExitPlanModeV2Tool` (obfuscated: `JC`) - ExitPlanMode tool definition (`cli_inner_pretty.js:350025-350220`)
- `ExitPlanModePermissionRequest` (obfuscated: `mA9`) - the approval dialog (`cli_inner_pretty.js:589878-590475`)
- `exitPlanModeAnswerComponent` (obfuscated: `Ayz`) - wires `mA9` into the dispatch table (`cli_inner_pretty.js:598471`)
- `buildPlanApprovalOptions` (obfuscated: `Gkz`) - approval option-list builder (`cli_inner_pretty.js:589794-589824`)
- `getApprovalResult` (obfuscated: `_I8`) - pure choice→PermissionResult mapping (`cli_inner_pretty.js:589839-589877`)
- `buildPermissionUpdates` (obfuscated: `i9q`) - setMode + classifier addRules assembler (`cli_inner_pretty.js:589766-589776`)
- `autoNameSessionFromPlan` (obfuscated: `Zkz`) - fire-and-forget session auto-naming (`cli_inner_pretty.js:589777-589793`)
- `renderAllowedPrompt` (obfuscated: `Vkz`) - "Requested permissions:" row render (`cli_inner_pretty.js:590476-590478`)
- `getNextPermissionMode` (obfuscated: `QCH`) - shift+tab cycle order (`cli_inner_pretty.js:578712-578730`)
- `canCycleToAuto` (obfuscated: `PR8`) - three-signal auto eligibility (`cli_inner_pretty.js:578696-578708`)
- `isAutoModeOptInDismissed` (obfuscated: `i4q`) - auto opt-in dismissal predicate (`cli_inner_pretty.js:578709-578711`)
- `cyclePermissionMode` (obfuscated: `c19`) - next mode + transitioned context (`cli_inner_pretty.js:578731-578734`)
- `transitionPermissionMode` (obfuscated: `vl`) - per-mode context surgery (`cli_inner_pretty.js:442777-442791`)
- `handleCycleMode` (obfuscated: `uV`) - `chat:cycleMode` action handler (`cli_inner_pretty.js:585344-585429`)
- `SHIFT_TAB_KEY` (obfuscated: `JaK`) - shift+tab / meta+m keybinding (`cli_inner_pretty.js:170200`)
- `PERMISSION_MODE_CONFIG` (obfuscated: `xEq`) - mode chip config (`cli_inner_pretty.js:49228-49253`)
- `getModeColor` (obfuscated: `tV`) - mode → theme color (`cli_inner_pretty.js:49218-49220`)
- `getModeTitle` (obfuscated: `tt`) - mode → chip title (`cli_inner_pretty.js:49203-49205`)
- `toExternalPermissionMode` (obfuscated: `Yi`) - mode → external name (`cli_inner_pretty.js:49197-49199`)
- `getModeSymbol` (obfuscated: `n3H`) - mode → chip symbol (`cli_inner_pretty.js:49215-49217`)
- `getModeConfig` (obfuscated: `WF$`) - mode config lookup with default fallback (`cli_inner_pretty.js:49194-49196`)
- `PAUSE_ICON` (obfuscated: `XF$`) - "⏸" plan chip symbol (`cli_inner_pretty.js:49136`)
- `EXTERNAL_PERMISSION_MODES` (obfuscated: `st`) - external mode name list (`cli_inner_pretty.js:49174`)
- `planCommandCall` (obfuscated: `v5z`) - `/plan` handler (`cli_inner_pretty.js:513519-513567`)
- `planCommandDef` (obfuscated: `k5z`/`lHq`) - `/plan` command definition (`cli_inner_pretty.js:513585-513593`)
- `planCommandModule` (obfuscated: `dg4`) - `/plan` module export (`cli_inner_pretty.js:513488-513489`)
- `PlanDisplay` (obfuscated: `V5z`) - `/plan` current-plan render (`cli_inner_pretty.js:513490-513518`)
- `ENTER_PLAN_MODE_TOOL_NAME` (obfuscated: `og`) - "EnterPlanMode" (`cli_inner_pretty.js:143385`)
- `EXIT_PLAN_MODE_V2_TOOL_NAME` (obfuscated: `wv`) - "ExitPlanMode" (`cli_inner_pretty.js:143387`)
- `ASK_USER_QUESTION_TOOL_NAME` (obfuscated: `ez`) - "AskUserQuestion" (`cli_inner_pretty.js:143388`)

---

## Confidence

- **HIGH** — All v2.1.156 line numbers and ORIGINAL code snippets in this document were read
  directly from `cli_inner_pretty.js` before citation. The three-state `_$4` render, the `mA9`
  dialog both branches, `Gkz` option construction, `_I8` mapping, `QCH` cycle order, `vl`
  transition, `uV` handler, the `xEq` config, the theme colors, and the `v5z` `/plan` handler
  were all verified by reading the exact regions.
- **HIGH** — The two headline cross-version diffs (priority flip in `Gkz`; ant-branch removal in
  `QCH`) were confirmed against the v2.1.88 sources
  `ExitPlanModePermissionRequest.tsx:674-735` and `getNextPermissionMode.ts:39-62` read directly.
- **MEDIUM** — A few deeper helper definitions referenced but not opened to source:
  `isAutoModeGateEnabled` (`h0`), `stripDangerousPermissionsForAutoMode` (`Km`) /
  `restoreDangerousPermissions` (`EzH`), and `prepareContextForPlanMode` (`xhH`). Their *usage*
  and effect are confirmed at the call sites cited; their bodies were not line-verified.
- **MEDIUM** — Whether `dontAsk` is reachable in the live shift+tab cycle: `QCH` has a `dontAsk`
  case but no branch *returns* `dontAsk`, so it appears defensive/vestigial. Confirmed by reading
  `QCH` in full; not independently traced through every UI entry point.
