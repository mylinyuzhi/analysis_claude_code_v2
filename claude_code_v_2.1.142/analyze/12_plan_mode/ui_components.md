# Plan Mode UI Components (v2.1.142)

> Deep dive into the React/Ink components that render plan-mode user-facing UI: the entry/exit permission dialogs, the in-history plan rendering, the rejected-plan synthetic message, the mode chip + Shift+Tab cycle keybinding, and the inline Ctrl+G plan editor. Maps each obfuscated v2.1.142 component to its v2.1.88 TypeScript source.
>
> The agent loop and reminder injection mechanism is documented in [runtime_mechanism.md](./runtime_mechanism.md); this document is about everything the **user sees**.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) — Symbol discoveries for this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Plan Mode UI section
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Ink components, keybindings

Key UI symbols in this document:
- `ExitPlanModePermissionRequestComponent` (obfuscated: `Tb4`) — the approval dialog, `cli_inner_pretty.js:540953`
- `buildPlanApprovalOptions` (obfuscated: `_c6`) — option list builder, `cli_inner_pretty.js:540869`
- `mapApprovalChoiceToResult` (obfuscated: `M28`) — choice → permission decision, `cli_inner_pretty.js:540914`
- `autoNameSessionFromPlan` (obfuscated: `Kc6`) — fire-and-forget session-name generator, `cli_inner_pretty.js:540852`
- `EnterPlanModePermissionRequestComponent` (`/lyz/codespace/3rd/claude-code/src/components/permissions/EnterPlanModePermissionRequest/EnterPlanModePermissionRequest.tsx`) — v2.1.88 ref
- `renderEnterPlanModeToolResultMessage` (obfuscated: `rl7`) — "Entered plan mode" pill, `cli_inner_pretty.js:383754`
- `renderEnterPlanModeToolUseRejectedMessage` (obfuscated: `ol7`) — "User declined…" pill, `cli_inner_pretty.js:383771`
- `renderExitPlanModeToolResultMessage` (obfuscated: `lc7`) — "User approved Claude's plan" pill + plan markdown, `cli_inner_pretty.js:381476`
- `renderExitPlanModeToolUseRejectedMessage` (obfuscated: `nc7`) — wraps `tz8`, `cli_inner_pretty.js:381534`
- `RejectedPlanMessage` (obfuscated: `tz8`) — synthetic rejected-plan box, `cli_inner_pretty.js:349409`
- `nextPermissionModeForCycle` (obfuscated: `DyH`) — Shift+Tab cycle next-mode function, `cli_inner_pretty.js:540813`
- `computeCycleModeContext` (obfuscated: `Zb4`) — wraps `DyH` with mode-transition side effects, `cli_inner_pretty.js:540832`
- `transitionPermissionMode` (obfuscated: `tHH`) — applies mode change, `cli_inner_pretty.js:422385`
- `handleCycleMode` (local lambda `CS`) — chat-key cycle handler, `cli_inner_pretty.js:553047`
- `MODE_INDICATOR_LIST` (obfuscated: `mO4`) — welcome-screen mode demo array, `cli_inner_pretty.js:464983`
- `ModeIndicatorTeaser` (obfuscated: `FO4`) — animated welcome-screen mode preview, `cli_inner_pretty.js:464912`
- `getModeColor` (obfuscated: `Cv`) — color resolver for "plan" → planMode theme color, `cli_inner_pretty.js:48491`
- `BLACK_CIRCLE` (obfuscated: `g9`) — `●` figure used by mode pills, (constants)
- `PLAN_REJECTION_PREFIX` / `REJECTED_PLAN_TOOL_RESULT_SENTINEL` (obfuscated: `MV6`) — `cli_inner_pretty.js:425970`

---

## 1. UI Touchpoint Map

```
                ┌──────────────────────────────────────────────────┐
                │              user-facing plan-mode UI            │
                └──────────────────────────────────────────────────┘
                                       │
        ┌──────────────┬──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼              ▼
   ┌─────────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐  ┌──────────────┐
   │ Mode    │  │ Entry     │  │ Per-tool  │  │ Approval │  │ History      │
   │ chip /  │  │ permission│  │ tool-use  │  │ dialog   │  │ rendering    │
   │ Shift+  │  │ dialog    │  │ pills     │  │ + Ctrl+G │  │ of plan +    │
   │ Tab     │  │           │  │           │  │ editor   │  │ rejected     │
   │ cycle   │  │ (Enter-   │  │ (rl7,     │  │ (Tb4)    │  │ plan         │
   │ (CS,    │  │  PlanMode │  │  lc7,     │  │          │  │ (lc7, tz8)   │
   │  DyH,   │  │  Permis-  │  │  ol7,     │  │          │  │              │
   │  tHH)   │  │  sion-    │  │  nc7)     │  │          │  │              │
   │         │  │  Request) │  │           │  │          │  │              │
   └─────────┘  └───────────┘  └───────────┘  └──────────┘  └──────────────┘
```

Each component renders inside Ink (terminal React). The `PermissionDialog` shell (a rounded `planMode`-colored box with the active-mode chip in the title bar) wraps the entry/exit dialogs. The tool-use pills are emitted into the conversation history as part of the `AssistantToolUseMessage` rendering path.

---

## 2. Entry: `EnterPlanModePermissionRequest`

When the model emits `EnterPlanMode` and a `PreToolUse` hook hasn't already pre-approved, the agent loop renders this dialog. Source: `/lyz/codespace/3rd/claude-code/src/components/permissions/EnterPlanModePermissionRequest/EnterPlanModePermissionRequest.tsx`.

### Visual

```
╭────────────[ ● Enter plan mode? ]────────────╮
│                                                │
│  Claude wants to enter plan mode to explore    │
│  and design an implementation approach.        │
│                                                │
│  In plan mode, Claude will:                    │
│   · Explore the codebase thoroughly            │
│   · Identify existing patterns                 │
│   · Design an implementation strategy          │
│   · Present a plan for your approval           │
│                                                │
│  No code changes will be made until you        │
│  approve the plan.                             │
│                                                │
│   ▶ Yes, enter plan mode                       │
│     No, start implementing now                 │
│                                                │
╰────────────────────────────────────────────────╯
```

### Behavior

```typescript
// Excerpt — from v2.1.88 source (path above), unchanged in v2.1.142
function handleResponse(value: 'yes' | 'no'): void {
  if (value === 'yes') {
    logEvent('tengu_plan_enter', {
      interviewPhaseEnabled: isPlanModeInterviewPhaseEnabled(),
      entryMethod: 'tool',
    });
    handlePlanModeTransition(toolPermissionContextMode, 'plan');
    onDone();
    toolUseConfirm.onAllow({}, [
      { type: 'setMode', mode: 'plan', destination: 'session' },
    ]);
  } else {
    onDone();
    onReject();
    toolUseConfirm.onReject();
  }
}
```

### Algorithm: Why the dialog *exists* even though `EnterPlanMode.checkPermissions` looks self-approving

**What's happening:** Looking at v2.1.142 `Q38` (`cli_inner_pretty.js:383798-383866`), there's no `checkPermissions` method — the tool relies on the default behavior. The default for tools that **don't** override `checkPermissions` is "ask".

**Why:** Plan mode is a *significant* mode change that affects user behavior (read-only constraints, shift+tab cycling now lands on plan, plan file gets created on disk). The dialog gives the user explicit consent. Power users who want to skip the dialog can:
- Use Shift+Tab to enter plan mode directly (the keybinding doesn't dialog).
- Use `/plan` slash command (the slash-command handler enters mode directly without a tool call).
- Register a `PreToolUse` hook returning `decision: "allow"` for the `EnterPlanMode` tool.

**Trade-off:** Adding a permission dialog adds ~1 user interaction per session for cases where the model spontaneously decides to enter plan mode. The friction is intentional — it nudges the user to *notice* that the agent is changing its behavioral envelope.

### Cancel vs No

`onCancel={() => handleResponse('no')}` — pressing Esc is equivalent to picking "No". This is the dialog's "soft" exit; for the model it's an explicit `onReject()` so the tool_use_id receives a rejection tool_result.

---

## 3. Approval Dialog: `Tb4` (`ExitPlanModePermissionRequest`)

When the model calls `ExitPlanMode`, `V2.checkPermissions` returns `{behavior: "ask", message: "Exit plan mode?"}`. The agent loop routes this to `Tb4` — by far the most complex plan-mode UI component (~609 lines at `cli_inner_pretty.js:540953-541561`; a separate fullscreen variant lives at `541641-542084`).

### Visual (non-empty plan, default state)

```
╭──────────────[ ● Ready to code? ]────────────────────────────╮
│                                                                │
│   Here is Claude's plan:                                       │
│   ────────────────────────────────────────                     │
│   ## Context                                                   │
│                                                                │
│   The auth middleware stores session tokens in a way           │
│   that doesn't meet the new compliance requirements ...        │
│                                                                │
│   ## Changes                                                   │
│   1. Replace `cookie-session` with `iron-session` ...          │
│   2. ...                                                       │
│   ────────────────────────────────────────                     │
│                                                                │
│   Claude has written up a plan and is ready to execute.        │
│   Would you like to proceed?                                   │
│                                                                │
│   ▶ Yes, auto-accept edits                                     │
│     Yes, manually approve edits                                │
│     Yes, with bypass permissions                               │
│     No, keep planning: ___________                             │
│                                                                │
╰────────────────────────────────────────────────────────────────╯
 ctrl-g to edit in vim  ·  ~/.claude/plans/fix-auth-snug-otter.md
```

When `showClearContext` (the `showClearContextOnPlanAccept` setting) is enabled, an additional **clear-context** option appears at the top:

```
   ▶ Yes, clear context (47% used) and use auto mode
     Yes, and use auto mode
     Yes, manually approve edits
     No, keep planning: ___________
```

### Component Structure

`Tb4` is in `cli_inner_pretty.js:540953-541561`. The rendering tree (simplified):

```
PermissionDialog(color="planMode", title="Ready to code?")
  └── Box(flexDirection="column", marginTop=1)
        ├── Box(paddingX=1) → "Here is Claude's plan:"
        ├── Box(borderStyle="dashed", borderColor="subtle") → Markdown(plan)
        └── Box(paddingX=1)
              ├── PermissionRuleExplanation
              ├── [if classifier permissions] "Requested permissions:" list
              └── [if !useStickyFooter]
                    ├── Text(dimColor): "Claude has written up a plan…"
                    └── Select(options, onChange=handleResponse, ...)
+
Box(paddingX=1, marginTop=1) → "ctrl-g to edit in <editor>"
```

In fullscreen mode (`setStickyFooter` is provided), the `Select` is rendered in the fullscreen layout's `bottom` slot so it stays visible while the user scrolls the plan body.

### The 5-Option Matrix

`_c6` (`buildPlanApprovalOptions`, `cli_inner_pretty.js:540869-540898`) computes the option list. Five mutually-exclusive paths plus an "input" path for feedback:

```javascript
// ============================================
// buildPlanApprovalOptions - Compute the dialog option list
// Location: cli_inner_pretty.js:540869-540898
// ============================================

// ORIGINAL (for source lookup):
function _c6({ showClearContext: H, showUltraplan: $, usedPercent: q,
                isAutoModeAvailable: K, isBypassPermissionsModeAvailable: _,
                onFeedbackChange: A }) {
  let z = [], Y = q !== null ? ` (${q}% used)` : "";
  if (H)
    if (_) z.push({ label: `Yes, clear context${Y} and bypass permissions`, value: "yes-bypass-permissions" });
    else if (K) z.push({ label: `Yes, clear context${Y} and use auto mode`, value: "yes-auto-clear-context" });
    else z.push({ label: `Yes, clear context${Y} and auto-accept edits`, value: "yes-accept-edits" });
  if (_) z.push({ label: "Yes, and bypass permissions", value: "yes-accept-edits-keep-context" });
  else if (K) z.push({ label: "Yes, and use auto mode", value: "yes-resume-auto-mode" });
  else z.push({ label: "Yes, auto-accept edits", value: "yes-accept-edits-keep-context" });
  if ((z.push({ label: "Yes, manually approve edits", value: "yes-default-keep-context" }), $))
    z.push({ label: "No, refine with Ultraplan on Claude Code on the web", value: "ultraplan" });
  return (
    z.push({
      type: "input", label: "No, keep planning", value: "no",
      placeholder: "Tell Claude what to change",
      description: "shift+tab to approve with this feedback",
      onChange: A,
    }),
    z
  );
}

// READABLE (for understanding):
function buildPlanApprovalOptions({
  showClearContext, showUltraplan, usedPercent,
  isAutoModeAvailable, isBypassPermissionsModeAvailable, onFeedbackChange,
}) {
  const options = [];
  const usedLabel = usedPercent !== null ? ` (${usedPercent}% used)` : '';

  // Slot 1: clear-context option (only when showClearContext setting is on)
  // Priority: bypass > auto > acceptEdits
  if (showClearContext) {
    if (isBypassPermissionsModeAvailable) {
      options.push({ label: `Yes, clear context${usedLabel} and bypass permissions`,
                     value: 'yes-bypass-permissions' });
    } else if (isAutoModeAvailable) {
      options.push({ label: `Yes, clear context${usedLabel} and use auto mode`,
                     value: 'yes-auto-clear-context' });
    } else {
      options.push({ label: `Yes, clear context${usedLabel} and auto-accept edits`,
                     value: 'yes-accept-edits' });
    }
  }

  // Slot 2: keep-context elevated mode (same priority: bypass > auto > edits)
  if (isBypassPermissionsModeAvailable) {
    options.push({ label: 'Yes, and bypass permissions', value: 'yes-accept-edits-keep-context' });
  } else if (isAutoModeAvailable) {
    options.push({ label: 'Yes, and use auto mode', value: 'yes-resume-auto-mode' });
  } else {
    options.push({ label: 'Yes, auto-accept edits', value: 'yes-accept-edits-keep-context' });
  }

  // Slot 3: keep-context default (always present)
  options.push({ label: 'Yes, manually approve edits', value: 'yes-default-keep-context' });

  // Slot 4: Ultraplan (only when feature gate active and no session in progress)
  if (showUltraplan) {
    options.push({ label: 'No, refine with Ultraplan on Claude Code on the web', value: 'ultraplan' });
  }

  // Slot 5: input — "No, keep planning" with inline feedback field
  options.push({
    type: 'input',
    label: 'No, keep planning',
    value: 'no',
    placeholder: 'Tell Claude what to change',
    description: 'shift+tab to approve with this feedback',
    onChange: onFeedbackChange,
  });

  return options;
}

// Mapping: _c6→buildPlanApprovalOptions, H→showClearContext, $→showUltraplan,
//          q→usedPercent, K→isAutoModeAvailable, _→isBypassPermissionsModeAvailable,
//          A→onFeedbackChange, z→options, Y→usedLabel
```

### Algorithm: Why Bypass > Auto > AcceptEdits Priority?

**The principle:** Each slot picks the *most permissive* available mode that the user pre-authorized at session start.

- **Bypass** is only available with `--dangerously-skip-permissions`. If the user has it, they explicitly opted into "all writes allowed without prompting" — surfacing it on plan acceptance is consistent with that intent.
- **Auto** is only available when the auto-mode gate (`isAutoModeAvailable && !sG$()`) is on. Auto delegates write approval to a classifier — also more permissive than acceptEdits.
- **AcceptEdits** is the fallback — auto-approve edits without classifier or bypass.

**Why not always show all three?**
- Cluttering the menu with options the user *can't* use is hostile UX. (Bypass requires a CLI flag that the user may not even know about; auto requires a feature gate.)
- The fallback chain ensures every user sees exactly two "Yes" options (elevated + manual) — predictable across configurations.

### v2.1.118/119 Bug Fix Context

Pre-v2.1.119, when `isBypassPermissionsModeAvailable` was true but `isAutoModeAvailable` was also true, the dialog showed "auto mode" labels but the actual mode applied was `bypassPermissions` — a labeling bug. The v2.1.119 fix introduces the explicit priority: if bypass is available, the bypass labels are shown. See [permission_mode_persistence.md](./permission_mode_persistence.md) for the full v2.1.118/119 history.

### The "input" Option for Feedback

The last option (`value: "no"`) is a `type: "input"` option in the `CustomSelect` library. When focused, it shows an editable text field below the option list. The user can:

1. Type feedback (e.g. "use TypeScript not JavaScript"), then **Shift+Tab** to approve-with-feedback (jumping to the `yes-accept-edits-keep-context` path with `acceptFeedback` set).
2. Press Enter to reject the plan with the feedback as the rejection reason.
3. Leave the field empty and press Enter — the rejection bails (returns without calling `K({behavior:"deny"})`).

The Shift+Tab path is handled by `handleKeyDown` in `Tb4` (`cli_inner_pretty.js:541333-541356`):

```javascript
if (tH.shift && tH.key === "tab") {
  (tH.preventDefault(), H$(J ? "yes-accept-edits" : "yes-accept-edits-keep-context"));
  return;
}
```

If `showClearContext` (J) is true, Shift+Tab routes to `yes-accept-edits` (clear context); otherwise to keep-context. This is a power-user shortcut: approve with the inline feedback as a steering nudge.

### Ctrl+G External Editor

```javascript
if (tH.ctrl && tH.key === "g") {
  (tH.preventDefault(), d("tengu_plan_external_editor_used", {}), (async () => {
    if (I /* planFilePath */) {
      let s = await AS(I);   // editFileInEditor — opens $EDITOR on the plan file
      if (s.error) Y({ key: "external-editor-error", text: s.error, color: "warning", priority: "high" });
      if (s.content !== null) {
        if (s.content !== B) l(!0);   // setPlanEditedLocally(true)
        (u(s.content), Q(!0));         // setCurrentPlan, setShowSaveMessage
      }
    } else { /* V1 fallback: edit prompt directly */ }
  })());
  return;
}
```

**The local-edit flag (`planEditedLocally`)** matters for what the tool result echoes back. The reconciliation (line 541153 area):

- If `planEditedLocally === false` AND v2 → `updatedInput = {}` (the on-disk plan is the source of truth; model already wrote it).
- If `planEditedLocally === true` OR v1 → `updatedInput = { plan: currentPlan }` (override the model's plan with the user's edit; the tool's `call` will write it back to disk and echo it in tool_result so the model sees the user's changes).

### Algorithm: Why echo edited plan back to the model?

**Scenario:** Model writes plan with `[YOUR DECISION HERE]` placeholders. User opens the plan in `$EDITOR`, fills in the decisions, saves, accepts.

- The model is still working from its original plan (with placeholders). If `tool_result` returned only "approved", the model would implement the placeholders literally.
- By echoing the *edited* plan, the model sees the user's decisions and implements them.

The `planWasEdited` flag in the result data (set to `true` when `inputPlan !== undefined`) controls the label: **"## Approved Plan (edited by user):"** instead of **"## Approved Plan:"** — a small signal to the model that the plan has been mutated.

### The Image-Paste Path

The dialog supports pasting images while the "No, keep planning" input field is focused. Images are stored via `cacheImagePath` + `storeImage` and surfaced as `ImageBlockParam[]` attached to the rejection tool_result. Use case: "this is what the UI should look like" feedback as a screenshot. (`cli_inner_pretty.js:541018-541047` for the paste handler.)

### Algorithm: `mapApprovalChoiceToResult` (`M28`)

`M28` (`cli_inner_pretty.js:540914-540951`) converts the chosen `ResponseValue` into a `PermissionResult`. This is what `toolUseConfirm.onAllow`/`onReject` receives:

```javascript
function mapApprovalChoiceToResult(value, ctx) {
  const updatedInput = ctx.planEditedLocally ? { plan: ctx.currentPlan } : {};
  if (value === "ultraplan") return { behavior: "deny", feedback: _g5 /* Ultraplan denial msg */ };
  if (ctx.showClearContext && (value === "yes-bypass-permissions" ||
                                value === "yes-accept-edits" ||
                                value === "yes-auto-clear-context"))
    return { behavior: "deny" };  // <- handled outside via setAppState
  if (value === "yes-resume-auto-mode" && isAutoModeGateEnabled())
    return { behavior: "allow", updatedInput, permissionUpdates: [], feedback: ctx.acceptFeedback };
  // ... bypass/acceptEdits/default mappings → "allow" with setMode permissionUpdate
  if (value === "no") {
    if (!ctx.trimmedFeedback && !ctx.hasImages) return null;  // empty feedback: stay in dialog
    return { behavior: "deny", feedback: ctx.trimmedFeedback || "(See attached image)",
             contentBlocks: ctx.imageBlocks };
  }
  return null;
}
```

### Decision: Why clear-context options return `{behavior: "deny"}`

**Counter-intuitive at first glance** — the user said "Yes, accept the plan AND clear context", but the tool result is a denial?

**Reason:** The clear-context path needs to do three things atomically:
1. Wipe the current session's transcript.
2. Start a fresh query with the plan as the seed.
3. Apply the new permission mode.

This can't be expressed as a single `allow` with `permissionUpdates` because `permissionUpdates` doesn't clear transcripts. Instead, the dialog:

1. Returns `behavior: "deny"` to unblock the agent loop (it won't proceed with the current tool_use).
2. Sets `appState.initialMessage = { message: "Implement the following plan: ...", clearContext: true, mode: ... }` via `setAppState`.
3. The REPL's `processInitialMessage` (next tick) detects `clearContext: true` and triggers the transcript wipe + fresh query.

**Trade-off:** The model sees a "rejected" tool_use_id but a fresh follow-up. From the model's POV inside the cleared transcript, it just got a fresh prompt asking it to implement the plan.

### Empty-Plan Simplified Variant

When the plan file is empty (`!plan || plan.trim() === ''`), the full dialog is replaced with a **2-option** simplified version:

```
╭─[ ● Exit plan mode? ]─╮
│                        │
│  Claude wants to exit  │
│  plan mode             │
│                        │
│   ▶ Yes                │
│     No                 │
│                        │
╰────────────────────────╯
```

This handles the edge case where the model called `ExitPlanMode` without writing a plan first (e.g. it forgot, or `Write` was blocked by a hook). The "Yes" path approves the empty plan and falls back to `default` mode; the tool_result is the generic "User has approved exiting plan mode" message (no plan echo because there's nothing to echo).

---

## 4. Tool-Use Pills (In-History Rendering)

Each plan-mode tool emits a small status "pill" in the conversation history, rendered by per-tool `renderToolUseMessage`/`renderToolResultMessage` functions.

### `rl7` — Entered Plan Mode Pill

```jsx
// Excerpt — from v2.1.88 source, identical structure in v2.1.142 rl7
<Box flexDirection="column" marginTop={1}>
  <Box flexDirection="row">
    <Text color={getModeColor('plan')}>{BLACK_CIRCLE}</Text>
    <Text> Entered plan mode</Text>
  </Box>
  <Box paddingLeft={2}>
    <Text dimColor>Claude is now exploring and designing an implementation approach.</Text>
  </Box>
</Box>
```

Renders as:

```
● Entered plan mode
  Claude is now exploring and designing an implementation approach.
```

where `●` is `BLACK_CIRCLE` (`g9`) and the color is `planMode` from the theme.

### `ol7` — User Declined Pill

```
● User declined to enter plan mode
```

with the `●` colored by the *current* (non-plan) mode color (`Cv("default")`).

### `lc7` — Exit Result Pill (3 Variants)

```javascript
function lc7(H, $, { theme: q }) {
  let { plan: K, filePath: _ } = H;
  let A = !K || K.trim() === "";
  let z = _ ? I1(_) : "";   // I1 = getDisplayPath
  let Y = H.awaitingLeaderApproval;
  if (A)
    return /* "● Exited plan mode" */;
  if (Y)
    return /* "● Plan submitted for team lead approval" + "Plan file: <path>" + "Waiting for team lead..." */;
  return /* "● User approved Claude's plan" + "Plan saved to: <path> · /plan to edit" + <Markdown>plan</Markdown> */;
}
```

The 3 variants:

| Condition | Pill | Body |
|-----------|------|------|
| Empty plan | `● Exited plan mode` | (none) |
| Teammate awaiting | `● Plan submitted for team lead approval` | "Plan file: …", "Waiting for team lead to review and approve…" |
| Default | `● User approved Claude's plan` | "Plan saved to: … · /plan to edit", **`<Markdown>plan</Markdown>`** |

The third variant renders the full plan in the history with Markdown formatting — so when the user scrolls back, they can re-read the approved plan inline.

### `nc7` — Rejected Plan Pill (delegates to `tz8`)

```javascript
function nc7({ plan: H }, { theme: $ }) {
  let q = H ?? HW() ?? "No plan found";
  return r_.createElement(p, { flexDirection: "column" }, r_.createElement(tz8, { plan: q }));
}
```

Plan content is sourced (in order): the rejection's `plan` field → on-disk plan → "No plan found" fallback.

### `tz8` — RejectedPlanMessage Box

```javascript
function tz8(H) {
  let { plan: q } = H;
  return (
    <Box>
      <Box flexDirection="column">
        <Text color="subtle">User rejected Claude's plan:</Text>
        <Box borderStyle="round" borderColor="planMode" paddingX={1} overflow="hidden">
          <Markdown>{q}</Markdown>
        </Box>
      </Box>
    </Box>
  );
}
```

Renders as:

```
User rejected Claude's plan:
╭────────────────────────────────────────────╮
│ ## Context                                 │
│                                            │
│ The plan was to refactor the auth ...      │
│ ...                                        │
╰────────────────────────────────────────────╯
```

The `planMode`-colored round border distinguishes the rejected plan from the standard tool-rejection pill (which is just one line of text).

### Algorithm: Synthetic Rejection Routing via `MV6` Prefix

The rejection path is more intricate than other tools because the tool_result content carries a string prefix sentinel (`MV6` = `PLAN_REJECTION_PREFIX`). The dispatcher `nx7` (`cli_inner_pretty.js:349459-349490`) checks for this prefix:

```javascript
if (typeof A.content === "string" && A.content.startsWith(MV6)) {
  let O = A.content.substring(MV6.length);  // strip prefix → recover plan text
  let M = O;
  return ak.createElement(tz8, { plan: M });
}
if (typeof A.content === "string" && A.content.startsWith(PnH)) {
  // generic rejection-with-reason path
  return ak.createElement(dx7, null);  // "Tool use rejected" pill
}
```

**Why a string-prefix sentinel?** The rejection writer (in `mapApprovalChoiceToResult` consumers) emits a string tool_result; the renderer needs to detect "this was a plan rejection" without changing the tool_result schema. The sentinel piggybacks on string content. See [runtime_mechanism.md §7](./runtime_mechanism.md#7-the-rejected-plan-synthetic-message) for the model-side view of this prefix.

---

## 5. The Mode Chip + Shift+Tab Cycle

### Mode Indicator Display

The bottom-of-screen status bar shows the current mode as a colored chip. The chip is part of the broader status bar (`cli_inner_pretty.js` around the status component) and uses the same `mO4` indicator list:

```javascript
// cli_inner_pretty.js:464983-464988
mO4 = [
  { label: "default", symbol: "", color: "text" },
  { label: "accept edits on", symbol: "⏵⏵", color: "autoAccept" },
  { label: "plan mode on", symbol: kR$ /* ●? */, color: "planMode" },
  { label: "auto mode on", symbol: "⏵⏵", color: "warning" },
];
```

The plan mode chip:
```
● plan mode on
```
in the theme's `planMode` color (typically purple/violet).

### Welcome Screen Mode Teaser

`FO4` (`ModeIndicatorTeaser`, `cli_inner_pretty.js:464912-464951`) is a special animated component shown on the welcome screen that cycles through all four modes every 3 seconds, demonstrating Shift+Tab:

```
Press shift+tab now

● plan mode on
```

Three seconds later:

```
Press shift+tab now

⏵⏵ auto mode on
```

The animation calls `P25(currentIndex)` = `(currentIndex + 1) % mO4.length` — a simple cyclic index.

### Shift+Tab Cycle Handler

The actual cycling is bound to the `chat:cycleMode` keybinding (`shift+tab` by default), registered at `cli_inner_pretty.js:553210`. The handler `CS` (local lambda at `cli_inner_pretty.js:553047-553132`) does:

```javascript
CS = useCallback(() => {
  // ... initial guards (focus, teammate mode, etc.) ...

  // Compute the next mode
  const currentCtx = AY !== null ? { ...q, mode: "auto" } : q;
  const nextMode = DyH(currentCtx, M$);

  if (nextMode === currentCtx.mode) {
    // No other modes available (e.g. teammate context with restricted modes)
    if (I6()) addNotification("No other permission modes are available in this remote session");
    return;
  }

  // Special: auto-mode requires opt-in dialog on first transition
  if (nextMode === "auto" && currentCtx.mode !== "auto" && !jR() && !p$) {
    showAutoModeOptInDialog();
    return;
  }

  // ... remote-session handling ...

  // Apply the transition
  const { context: newCtx } = Zb4(currentCtx, M$, "shift_tab");

  // Telemetry
  logEvent("tengu_mode_cycle", { to: nextMode });
  if (nextMode === "plan") RH("mode_plan_enter");
  else if (q.mode === "plan") RH("mode_plan_exit");

  // Apply state
  setAppState(prev => ({ ...prev, toolPermissionContext: { ...newCtx, mode: nextMode } }));
  setToolPermissionContext({ ...newCtx, mode: nextMode });
}, [...deps]);
```

### Algorithm: The Cycle Order (`DyH`)

```javascript
// ============================================
// nextPermissionModeForCycle - Shift+Tab next-mode selector
// Location: cli_inner_pretty.js:540813-540830
// ============================================

// ORIGINAL (for source lookup):
function DyH(H, $) {
  switch (H.mode) {
    case "default":         return "acceptEdits";
    case "acceptEdits":     return "plan";
    case "plan":
      if (H.isBypassPermissionsModeAvailable) return "bypassPermissions";
      if (Wb4(H)) return "auto";
      return "default";
    case "bypassPermissions": if (Wb4(H)) return "auto"; return "default";
    case "dontAsk":         return "default";
    default:                return "default";
  }
}

// READABLE (for understanding):
function nextPermissionModeForCycle(ctx, teammate) {
  switch (ctx.mode) {
    case 'default':     return 'acceptEdits';
    case 'acceptEdits': return 'plan';
    case 'plan':
      if (ctx.isBypassPermissionsModeAvailable) return 'bypassPermissions';
      if (canCycleToAuto(ctx)) return 'auto';
      return 'default';
    case 'bypassPermissions':
      if (canCycleToAuto(ctx)) return 'auto';
      return 'default';
    case 'dontAsk':     return 'default';   // dontAsk cannot cycle
    default:            return 'default';
  }
}

// Mapping: DyH→nextPermissionModeForCycle, H→ctx, $→teammate, Wb4→canCycleToAuto
```

### Algorithm: Cycle Order Decisions

**Two cycles depending on availability:**

| User config | Cycle order |
|-------------|-------------|
| Default (no `--dangerously-skip`, no auto-mode gate) | `default → acceptEdits → plan → default` (3-step) |
| Auto-mode gate enabled | `default → acceptEdits → plan → auto → default` (4-step) |
| `--dangerously-skip-permissions` enabled | `default → acceptEdits → plan → bypassPermissions → default` (4-step; with auto: → auto → default = 5-step) |

**Why does cycling from `plan` go to `bypassPermissions` BEFORE `auto`?**
- `bypassPermissions` is **explicit user opt-in** (via CLI flag). The user said "I want maximum permissiveness".
- `auto` is a *gated* feature that the user may not have explicitly enabled (it's GrowthBook-driven). Surfacing it via Shift+Tab cycling from plan would be a surprising mode change.
- The fallback ordering "most-explicit > most-implicit" keeps cycling predictable.

**Why is `dontAsk` a dead end?**
- `dontAsk` is a mode that *denies* all asks (used by some headless agent flows). Cycling out of it would re-enable interactive prompts, which is unsafe if the user/agent set it explicitly. A `dontAsk → default` jump exists for the cycle to not crash, but it's a one-way exit (you can cycle out, but you can never cycle *into* `dontAsk` via Shift+Tab).

### `Zb4` — Compute Context with Transition Side Effects

```javascript
// ============================================
// computeCycleModeContext - Combine next-mode lookup with tHH side effects
// Location: cli_inner_pretty.js:540832-540835
// ============================================

// ORIGINAL (for source lookup):
function Zb4(H, $, q) {
  let K = DyH(H, $);
  return { nextMode: K, context: tHH(H.mode, K, H, q) };
}

// READABLE (for understanding):
function computeCycleModeContext(ctx, teammate, trigger) {
  const nextMode = nextPermissionModeForCycle(ctx, teammate);
  return { nextMode, context: transitionPermissionMode(ctx.mode, nextMode, ctx, trigger) };
}

// Mapping: Zb4→computeCycleModeContext, H→ctx, $→teammate, q→trigger,
//          K→nextMode, DyH→nextPermissionModeForCycle, tHH→transitionPermissionMode
```

`transitionPermissionMode` (`tHH`, see [approval_flow.md §Algorithm: 4-Way Alignment](./approval_flow.md#algorithm-4-way-alignment) for the auto-mode transition logic) is where the actual side effects fire:
- `Oo(prev, next)` flips `needsPlanModeExitAttachment` based on direction.
- `xv8(prev, next)` flips `needsAutoModeExitAttachment` for auto transitions.
- `prev === 'plan' && next !== 'plan'` → `OT(true)` sets the sticky `hasExitedPlanMode` flag.
- If entering plan from non-plan → `UkH(ctx)` (prepareContextForPlanMode) — saves `prePlanMode` and handles auto-mode promotion.
- If exiting plan → clears `prePlanMode`.

### Important: Shift+Tab Skips the `EnterPlanMode` Tool

When the user shifts INTO plan mode via cycling, the model is never told it just entered plan via a tool call. Instead:

1. `setToolPermissionContext({...newCtx, mode: 'plan'})` updates state.
2. The next call to `d65` detects `mode === 'plan'` and emits the `plan_mode` attachment.
3. The model sees the system reminder on its next turn and adjusts behavior.

This means **Shift+Tab plan-mode entry is invisible to the model until the next user message**. If the user shifts into plan mode mid-tool-call, the model finishes the current tool's response (potentially with edits) before seeing the plan-mode reminder. Users who want immediate effect should wait for the model to finish its turn before pressing Shift+Tab.

---

## 6. The `/plan` Slash Command UI

`/plan` (handler `Wv5` at `cli_inner_pretty.js:483806-483854`) has multiple sub-paths. The UI flow:

| User input | Outcome |
|------------|---------|
| `/plan` | If already in plan mode AND a plan file exists → render `Pv5` (PlanPreviewComponent) with the plan content + "/plan open to edit". Else → enter plan mode (`tHH(prev, 'plan', ...)`), set `lastPlanModeUse`, print "Enabled plan mode" |
| `/plan open` | Open the plan file in `$EDITOR` directly. Validates plan exists; errors if not |
| `/plan <prompt>` | Enter plan mode AND set the prompt as the slug seed (`planSlugSeed`), so the slug derives from this prompt. Then proceed with the prompt as a normal model turn |

### v2.1.119 Fix Context

Prior to v2.1.119, `/plan` always printed "Enabled plan mode" even when the user was already in plan mode and a plan existed. The v2.1.119 fix added the "already in plan + plan exists" detection to render the plan preview instead. See [permission_mode_persistence.md §v2.1.119](./permission_mode_persistence.md) for details.

---

## 7. Permission Dialog Color & Theme

The dialog uses `color="planMode"` throughout. The actual color value is resolved at render time via the theme system:

| Theme | `planMode` color |
|-------|------------------|
| `dark` (default) | violet/purple (`#C9A0DC` or similar) |
| `light` | darker violet |
| `dark-daltonized` (colorblind) | distinct hue from `auto` (warning yellow) |

`Cv("plan")` (= `getModeColor('plan')`, `cli_inner_pretty.js:48491`) returns the theme color name. Both the dialog border and the `BLACK_CIRCLE` pill use this value for consistency.

---

## 8. Cross-Validation (v2.1.88 → v2.1.142)

| Component | v2.1.88 path | v2.1.142 location | Status |
|-----------|--------------|-------------------|--------|
| EnterPlanModePermissionRequest | `src/components/permissions/EnterPlanModePermissionRequest/EnterPlanModePermissionRequest.tsx` | inline component in `cli_inner_pretty.js` (search for `"Enter plan mode?"`) | VERIFIED — identical 2-option dialog |
| ExitPlanModePermissionRequest | `src/components/permissions/ExitPlanModePermissionRequest/ExitPlanModePermissionRequest.tsx` (lines 1-770) | `Tb4` at `cli_inner_pretty.js:540953-541561` (+ fullscreen variant `Vb4` at `541641-542084`) | VERIFIED — identical 5-option dialog with v2.1.119 bypass-label fix |
| buildPlanApprovalOptions | exported from `ExitPlanModePermissionRequest.tsx:674` | `_c6` at `cli_inner_pretty.js:540869` | VERIFIED — bypass>auto>edits priority |
| autoNameSessionFromPlan | exported from `ExitPlanModePermissionRequest.tsx:83` | `Kc6` at `cli_inner_pretty.js:540852` | VERIFIED — uses `generateSessionName` (`HaH`) with head-slice 1000 chars |
| renderEnterPlanMode UI | `src/tools/EnterPlanModeTool/UI.tsx` | `il7`, `rl7`, `ol7` at `cli_inner_pretty.js:383751-383778` | VERIFIED |
| renderExitPlanMode UI | `src/tools/ExitPlanModeTool/UI.tsx` | `cc7`, `lc7`, `nc7` at `cli_inner_pretty.js:381473-381537` | VERIFIED |
| RejectedPlanMessage | `src/components/messages/UserToolResultMessage/RejectedPlanMessage.tsx` | `tz8` at `cli_inner_pretty.js:349409` | VERIFIED |
| ModeIndicatorTeaser (welcome) | `src/components/ModeIndicator.tsx` (or similar) | `FO4` + `mO4` at `cli_inner_pretty.js:464912-464991` | VERIFIED |
| Shift+Tab cycle | `src/screens/REPL.tsx` `handleCycleMode` | local `CS` lambda at `cli_inner_pretty.js:553047-553132` | VERIFIED — extended for remote/teammate context |
| `nextPermissionModeForCycle` | exported from `src/utils/permissions/PermissionMode.ts` (or PermissionUpdate) | `DyH` at `cli_inner_pretty.js:540813` | VERIFIED |
| `canCycleToAuto` | exported helper | `Wb4` at `cli_inner_pretty.js:540797` | VERIFIED |
| `getModeColor` | `src/utils/permissions/PermissionMode.ts` | `Cv` at `cli_inner_pretty.js:48491` | VERIFIED |
| PLAN_REJECTION_PREFIX | `src/utils/messages.ts:220` | `MV6` at `cli_inner_pretty.js:425970` | VERIFIED (identical text) |
| Permission dialog wrapper | `src/components/permissions/PermissionDialog.tsx` | `sz` (PermissionDialog) at various locations | VERIFIED |

**No UI-level behavioral changes** between v2.1.88 and v2.1.142 except:
- v2.1.119 bypass-permissions label fix (in `_c6`).
- v2.1.119 `/plan` open existing-plan detection (in `Wv5`).
- The auto-mode-fallback notification (`auto-mode-gate-plan-exit-fallback`) wired into `Tb4` and `ExitPlanModeV2Tool.call` (a v2.1.112 addition).
- `--channels` + background-session double gate (UI-side: dialog isn't rendered if both tools are `isEnabled() === false`).

---

## Related

- [runtime_mechanism.md](./runtime_mechanism.md) — per-turn reminder mechanism
- [enter_plan_mode_tool.md](./enter_plan_mode_tool.md) — `EnterPlanMode` tool internals
- [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) — `ExitPlanModeV2Tool` tool internals
- [approval_flow.md](./approval_flow.md) — full state machine of approval flow (covers `M28` outcomes)
- [permission_mode_persistence.md](./permission_mode_persistence.md) — v2.1.119 dialog-label fix history
- [ultraplan_integration.md](./ultraplan_integration.md) — what the "Ultraplan" option does in the dialog
