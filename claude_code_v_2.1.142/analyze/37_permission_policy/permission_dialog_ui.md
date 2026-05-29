# Permission Dialog UI Rendering (v2.1.142)

**Theme:** This document maps how `tD`'s `ask` verdict becomes pixels on the user's terminal. The pipeline runs from the in-process `ToolUseConfirm` queue, through the per-tool React component dispatcher, into the `PermissionDialog` shell, to the Select component with allow/deny/always-allow choices. It also covers the v2.1.141 auto-dismiss on mode change and the v2.1.141 "explainer" panel.

For the **decision logic** that *produces* the verdict, see [`architecture.md`](./architecture.md). For how the **denial outcome** is reflected back to the model, see [`reminder_interaction.md`](./reminder_interaction.md). This doc is purely UI.

---

## 1. From Verdict to Pixels

```
   tD/UA5 returns                                 The user sees
   { behavior: "ask",                             ╭───────────────────────────────
     decisionReason: ... }                        │ ⚙ Tool use request
            │                                     │   Bash command 'rm tmp.txt'
            ▼                                     │
   useCanUseTool hook                              │   ❶ Yes
            │                                     │   ❷ Yes, allow rm * always
            ▼                                     │   ❸ No, tell Claude
   ToolUseConfirm queue push                       │
            │                                     ╰───────────────────────────────
            ▼
   PermissionPrompt component (parent)
            │
            ▼
   permissionComponentForTool(tool) dispatcher
            │
            ▼
   per-tool component (BashPermissionRequest / FileEditPermissionRequest / ...)
            │
            ▼
   PermissionDialog (border + title shell)
            │
            ▼
   Select component (the choices)
            │
            ▼
   user keypress → onAllow/onReject/onAbort callback
            │
            ▼
   verdict resolved → agent loop continues
```

The whole render is an **Ink** (terminal-rendered React) tree. The `<Box>`, `<Text>`, etc. components are Ink primitives that emit ANSI escape sequences.

---

## 2. The Confirm Queue

When `useCanUseTool` (v2.1.88: `src/hooks/useCanUseTool.tsx`) receives a verdict with `behavior: "ask"`, it pushes a `ToolUseConfirm` entry onto a queue managed by `createPermissionQueueOps`. The agent loop **awaits** the queue's resolution before continuing.

```typescript
// v2.1.88 src/hooks/useCanUseTool.tsx:33-95 (excerpt)
async (tool, input, toolUseContext, assistantMessage, toolUseID, forceDecision) => new Promise(resolve => {
  const ctx = createPermissionContext(tool, input, toolUseContext, assistantMessage, toolUseID,
    setToolPermissionContext, createPermissionQueueOps(setToolUseConfirmQueue));
  if (ctx.resolveIfAborted(resolve)) return;

  const decisionPromise = forceDecision !== undefined
    ? Promise.resolve(forceDecision)
    : hasPermissionsToUseTool(tool, input, toolUseContext, assistantMessage, toolUseID);

  return decisionPromise.then(async result => {
    if (result.behavior === "allow") { /* short-circuit allow */ }
    // ... result.behavior === "deny" path ...
    switch (result.behavior) {
      case "deny": { /* logging + recordAutoModeDenial */ resolve(result); return; }
      case "ask": {
        if (appState.toolPermissionContext.awaitAutomatedChecksBeforeDialog) {
          /* coordinator/swarm-handler check first */
        }
        // Eventually call handleInteractivePermission which pushes onto queue
        handleInteractivePermission({ ctx, description, result, ... }, resolve);
        return;
      }
    }
  });
});
```

The Promise the hook returns is resolved by the UI's callback — `onAllow(updatedInput)` resolves to `{behavior: "allow", ...}`; `onReject(message)` resolves to `{behavior: "deny", ...}`; `onAbort()` resolves to a cancellation result.

### The queue is **serial**

Only **one** prompt is shown at a time. If three concurrent subagents all hit ask verdicts simultaneously, the user sees the first one, answers it, then the second appears, etc. This is enforced by the queue's single-item-rendered-at-a-time semantics.

The serial constraint matters because:
- Concurrent prompts would create choice-overload UI.
- The user might want to answer prompt #1 based on what they saw on prompt #2 (e.g., "this Edit is part of a larger plan I just denied"). Serial prompts let context inform.
- Mode changes between prompts re-evaluate all queued prompts (the v2.1.141 auto-dismiss feature).

---

## 3. The Dispatcher — `permissionComponentForTool`

The dispatcher (v2.1.88: `src/components/permissions/PermissionRequest.tsx:54-95`) maps each tool to its bespoke permission component:

```typescript
function permissionComponentForTool(tool: Tool): React.ComponentType<PermissionRequestProps> {
  switch (tool) {
    case FileEditTool:        return FileEditPermissionRequest;
    case FileWriteTool:       return FileWritePermissionRequest;
    case BashTool:            return BashPermissionRequest;
    case PowerShellTool:      return PowerShellPermissionRequest;
    case ReviewArtifactTool:  return ReviewArtifactPermissionRequest ?? FallbackPermissionRequest;
    case WebFetchTool:        return WebFetchPermissionRequest;
    case NotebookEditTool:    return NotebookEditPermissionRequest;
    case ExitPlanModeV2Tool:  return ExitPlanModePermissionRequest;
    case EnterPlanModeTool:   return EnterPlanModePermissionRequest;
    case SkillTool:           return SkillPermissionRequest;
    case AskUserQuestionTool: return AskUserQuestionPermissionRequest;
    case WorkflowTool:        return WorkflowPermissionRequest ?? FallbackPermissionRequest;
    case MonitorTool:         return MonitorPermissionRequest ?? FallbackPermissionRequest;
    case GlobTool:
    case GrepTool:
    case FileReadTool:        return FilesystemPermissionRequest;
    default:                  return FallbackPermissionRequest;
  }
}
```

### Why per-tool components?

A `BashPermissionRequest` shows the command, the classifier's status, the prefix-suggestion editor, and the destructive-command warning. A `FileEditPermissionRequest` shows a diff. A `WebFetchPermissionRequest` shows the URL with domain highlighting.

A single generic component would either be uselessly minimal ("Allow Bash? Y/N") or unmaintainably complex (per-tool conditionals everywhere). The dispatcher pattern lets each tool's prompt evolve independently while sharing the outer `PermissionDialog` shell.

### The fallback

`FallbackPermissionRequest` handles any tool not in the dispatcher's switch. It renders a basic prompt with the tool name, the JSON input, and Yes/No options. This catches:
- New tools added since the dispatcher was last updated
- MCP tools (which are added at runtime and aren't in the static switch)
- Custom tools registered by plugins

The MCP case is the most common — every MCP server's tools route here. The fallback is *deliberately generic* because the MCP server's tool semantics aren't known to Claude Code.

---

## 4. The Outer Shell — `PermissionDialog`

```typescript
// v2.1.88 src/components/permissions/PermissionDialog.tsx
export function PermissionDialog({
  title, subtitle, color = 'permission', titleColor, innerPaddingX = 1,
  workerBadge, titleRight, children
}: Props): React.ReactNode {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor={color}
         borderLeft={false} borderRight={false} borderBottom={false}
         marginTop={1}>
      <Box paddingX={1} flexDirection="column">
        <Box justifyContent="space-between">
          <PermissionRequestTitle title={title} subtitle={subtitle}
                                  color={titleColor} workerBadge={workerBadge} />
          {titleRight}
        </Box>
      </Box>
      <Box flexDirection="column" paddingX={innerPaddingX}>{children}</Box>
    </Box>
  );
}
```

### Visual structure

```
─────────────────────────────────────────────  ← round border-top (only top edge)
  ⚙ Tool use request                    [BG]   ← title + worker badge (right)
    Bash command 'rm tmp.txt'                  ← subtitle
                                                  ← (no left/right/bottom border)
  ❶ Yes                                        ← children: the choices Select
  ❷ Yes, allow rm * always
  ❸ No, tell Claude
```

The borderless-except-top design is intentional:
- The top border separates the prompt visually from the prior conversation.
- No bottom border means the prompt feels "open at the bottom" — the choices flow into the user's input area.
- No side borders save horizontal space on narrow terminals.

### Color: `permission`

The `color` prop defaults to `"permission"` — a theme key resolved to a specific shade. This makes prompts instantly recognizable:
- `permission` theme is typically yellow/orange in light themes, amber in dark.
- Distinct from `error` (red), `success` (green), `warning` (orange-yellow).
- Stays color-distinct across themes — the theme system has a dedicated entry.

The `color: "permission"` token is also used by the bundle's prompt construction at cli_inner_pretty.js:482355 — the border color stays consistent between the React component and the lower-level prompt creation.

---

## 5. The Title — `PermissionRequestTitle`

The title combines:

```
⚙ Tool use request    [BG worker badge if applicable]
   <subtitle: human-readable command summary>
```

The icon (`⚙`) is from the `figures` library — terminal-safe symbol that works in most fonts. The title text comes from the per-tool component's call to `PermissionDialog`:

```typescript
// In BashPermissionRequest (paraphrased from v2.1.88):
<PermissionDialog
  title={`Bash command`}
  subtitle={shortCommandPreview}
  workerBadge={isBackgroundAgent ? { agentType, color: agentColor } : undefined}
  color="permission"
  titleRight={<DebugInfoToggle />}
  innerPaddingX={1}
>
  <Select options={bashToolUseOptions(...)} />
</PermissionDialog>
```

### Worker badge

When the prompt is for a background agent (not the main loop), `workerBadge` is set. The badge shows `[BG]` plus the agent's name with its color — so the user can distinguish "main loop asking" from "background agent #2 asking". Multiple background agents prompting in sequence are visually distinct.

The v2.1.141 worker-badge work coincides with the bg-agent-mode-preservation fix (see [`mode_lifecycle.md`](./mode_lifecycle.md) §6) — now that bg agents inherit mode, distinguishing their prompts becomes more important.

### `titleRight`

The right-side slot is typically used for **debug toggles** — pressing `?` shows the full decisionReason, the matched rules, the classifier output. The toggle is in `titleRight` so it doesn't compete with the subtitle for horizontal space.

---

## 6. The Choices — `Select` Component

The body of `PermissionDialog` is a `Select` component (Custom select wrapper around Ink) that renders the choices and handles arrow-key navigation.

### Standard choice set (Bash example)

```typescript
// v2.1.88 src/components/permissions/BashPermissionRequest/bashToolUseOptions.tsx
export type BashToolUseOption =
  | 'yes'                          // ❶ Allow this single call
  | 'yes-apply-suggestions'        // ❷ Allow + add the suggested allow rule
  | 'yes-prefix-edited'            // ❸ Allow + add user-edited prefix rule
  | 'yes-classifier-reviewed'      // ❹ Allow + remember classifier's reason
  | 'no';                          // ❺ Reject and tell Claude what to do instead
```

Visual layout:

```
  ❶ Yes
  ❷ Yes, allow `npm run *` always
  ❸ Yes, allow `npm:*` always (edited)        ← user can edit the prefix
  ❹ Yes, allow `Allow npm run for testing` always   ← classifier's description
  ❺ No, tell Claude what to do
```

The user navigates with arrow keys (or 1-5), Enter to confirm.

### `shouldShowAlwaysAllowOptions()` gate

```typescript
// v2.1.88 (referenced in bashToolUseOptions.tsx)
if (shouldShowAlwaysAllowOptions()) {
  // Show "Yes, allow always" variants
}
```

The "always allow" variants are hidden when:
- `allowManagedPermissionRulesOnly: true` is in policy settings (admin doesn't want users adding allow rules).
- User has explicitly disabled the option.
- The session is non-persistent (SDK headless run).

The "Yes (single use)" option is always available; the "Yes, always" variants are subject to policy.

### Per-tool variation

| Tool | Standard options | Extra |
|---|---|---|
| Bash | yes / yes-prefix / yes-classifier / no | Editable prefix rule input |
| Edit/Write | yes / yes-dir-allow / no | "Yes, allow ./src/** always" path expansion |
| Skill | yes / yes-skill-allow / no | `Skill(name)` allow |
| WebFetch | yes / yes-domain-allow / no | `WebFetch(domain:X)` allow |
| AskUserQuestion | yes / no | (no always-allow — user input is per-question) |
| EnterPlanMode | yes / no | (no always-allow — mode transitions are intentional) |
| MCP (fallback) | yes / yes-mcp-tool-allow / yes-mcp-server-allow / no | Layered MCP rules |

---

## 7. The Explainer Panel — `PermissionExplanation`

When the user presses `?` (or expands the prompt), the dialog shows an **explainer panel** describing:

- The exact rule that matched (or didn't match)
- The matched rule's source tier (userSettings, policySettings, ...)
- For Bash: the classifier's reasoning
- For path tools: the safety-check result
- For MCP: the server-name and tool-name parsing

```typescript
// v2.1.88 src/components/permissions/PermissionExplanation.tsx exports:
//   - PermissionExplainerContent: the rendered panel
//   - usePermissionExplainerUI: hook managing toggle state
```

The toggle is bound to `?` via `useKeybinding`. State is local to the prompt — closing/reopening resets the explainer.

### Why show the explainer?

Users often hit prompts they don't understand:
- "I thought I allowed `Bash(npm:*)` — why is this prompting?" (Answer: it's denied by a more specific deny rule)
- "Why does this prompt say 'classifier'?" (Answer: auto mode is active)
- "Where is this rule from?" (Answer: policy settings push this)

The explainer answers these without making the user dig through `/permissions` or `settings.json`. It's a transparency feature for debugging — and a teaching feature for new users.

---

## 8. Auto-Dismiss on Mode Change (v2.1.141)

If the user has a prompt open and switches mode (Shift+Tab to acceptEdits), the prompt **auto-re-evaluates**. If the new mode would allow the action, the prompt closes; if still ask, it stays.

The mechanism (already covered in [`mode_lifecycle.md`](./mode_lifecycle.md) §7) — recapped here from the UI angle:

```javascript
// cli_inner_pretty.js:580720 (within eJH = permissionUpdateCallback)
setImmediate((setRecheckQueue) => {
  setRecheckQueue((openPrompts) => {
    openPrompts.forEach((prompt) => prompt.recheckPermission());
    return openPrompts;
  });
  eventBus.emit();
}, recheckQueueRef);
```

### What `recheckPermission` does

```typescript
// In PermissionContext.ts (v2.1.88):
function recheckPermission() {
  // Re-run hasPermissionsToUseTool with the CURRENT toolPermissionContext.
  // If new verdict is "allow", resolve the original Promise with allow.
  // If new verdict is "deny", resolve with deny.
  // If still "ask", leave the prompt open.
}
```

The prompt's `Select` doesn't re-render — the component's state machine just resolves the outer promise and the prompt's parent unmounts it.

### Why re-check instead of auto-allow?

Even with a relaxed mode, an `ask` rule from settings might still fire — the user explicitly said "always prompt for X". The re-check handles all cases uniformly. Closing only when the new chain genuinely says `allow`.

---

## 9. Per-Tool UI Details

### `BashPermissionRequest` — Classifier shimmer + editable prefix

```
─────────────────────────────────────────────
  ⚙ Bash command
    npm run test
                                Attempting to auto-approve…  ← shimmer animation
  ❶ Yes
  ❷ Yes, allow `npm run *` always
  ❸ Yes, allow `[editable: npm:*]` always           ← user can edit
  ❹ No, tell Claude
```

When auto-mode is active and the classifier is *still computing* a verdict, the prompt shows a **shimmer animation** ("Attempting to auto-approve…") that pulses through the text characters. The animation is implemented in `ClassifierCheckingSubtitle` (v2.1.88: BashPermissionRequest.tsx around line 50) with `useShimmerAnimation`.

### Why a shimmer?

The classifier takes 1-3 seconds typically. Without an animation, the user might think the prompt is frozen. The shimmer provides:
- **Liveness signal** — the UI is alive, work is happening
- **Specific signal** — the classifier (not the LLM, not the tool itself) is the bottleneck
- **Cancel-able** — pressing Esc dismisses both the prompt AND the in-flight classifier

The component is intentionally **isolated** in its own React component (`ClassifierCheckingSubtitle`) so the 20fps shimmer doesn't re-render the entire dialog. The comment in v2.1.88 source explicitly notes the optimization rationale.

### `FileEditPermissionRequest` — Diff preview

```
─────────────────────────────────────────────
  ⚙ Edit file
    src/auth.ts
  
  ─── Before ────────────────────
    function validate(user) {
      return user.id > 0;
    }
  ─── After ─────────────────────
    function validate(user) {
      if (!user) return false;
      return user.id > 0;
    }
  ───────────────────────────────
  
  ❶ Yes
  ❷ Yes, allow Edit(./src/**) always
  ❸ No, tell Claude
```

The diff preview shows old/new content for context. Long files are truncated with `…` markers.

### `WebFetchPermissionRequest` — URL with domain highlight

```
─────────────────────────────────────────────
  ⚙ Web fetch
    https://api.github.com/repos/owner/repo
             ────────────
  
  ❶ Yes
  ❷ Yes, allow WebFetch(domain:api.github.com) always
  ❸ Yes, allow WebFetch(domain:*.github.com) always
  ❹ No, tell Claude
```

The domain is underlined/highlighted so the user immediately sees "what host is this hitting?". The allow-always variants include both exact-domain and wildcard-domain options.

### `SkillPermissionRequest` — Skill name with arguments

```
─────────────────────────────────────────────
  ⚙ Skill invocation
    /commit "Add user validation"
  
  ❶ Yes
  ❷ Yes, allow Skill(commit) always
  ❸ Yes, allow Skill(commit *) always       ← prefix wildcard
  ❹ No, tell Claude
```

The prefix-wildcard option (`Skill(commit *)`) was added in v2.1.121 (matcher fixed in v2.1.139 — see [`skill_wildcard_match.md`](./skill_wildcard_match.md)).

---

## 10. Keybindings & Input

| Key | Action |
|---|---|
| `↑` / `↓` | Navigate choices |
| `1`-`9` | Jump to numbered choice |
| `Enter` | Confirm |
| `Esc` | Reject (same as "No, tell Claude") |
| `?` | Toggle explainer panel |
| `Tab` | (in "Yes, allow" variants with editable text) Move between editable fields |

The keybindings are handled by `useKeybinding` hook (v2.1.88: `src/keybindings/useKeybinding.ts`). The binding system supports user customization via `~/.claude/keybindings.json`.

---

## 11. Notification After Decision

After the user makes a choice:

- **Yes / Yes, always** → no notification (the action proceeds silently).
- **No, tell Claude** → if the user typed a rejection message ("don't do this, here's why"), the message becomes part of the tool_result that goes back to the model.
- **Auto-mode denied** → the TUI shows a transient notification: `bash denied by auto mode · /permissions`. See [`reminder_interaction.md`](./reminder_interaction.md) §7.

The notification system is separate from the prompt's confirm queue — it's a status-line / corner-of-screen badge.

---

## 12. SDK / Headless Path

In SDK mode (`-p`, `--print`) or with a custom host (claude.ai mobile), the **dialog is never rendered**:

- `Options.canUseTool` callback: the SDK's host function intercepts before any UI would render. The CLI sends the structured `permission_request` envelope (see [`reminder_interaction.md`](./reminder_interaction.md) §4) to the host; the host responds with allow/deny. No TUI involvement.
- `Options.permissionPromptToolName`: the SDK exposes a specific tool that handles permission prompts; the CLI invokes it as if it were a regular tool. Even more removed from any UI.
- `claude --print` without callbacks: `dontAsk` mode auto-denies everything that would prompt.

The `PermissionDialog` component is **only mounted** in the interactive TUI path (when `setToolUseConfirmQueue` is set). Headless modes don't even import the component.

This is checked at the dispatcher level — if no queue setter is registered, `useCanUseTool` falls through to the SDK / dontAsk paths.

---

## 13. The `epH` / `showAlwaysAllow` Gate

Before showing "Yes, always" variants, the dialog asks `epH()` whether they should be displayed:

```javascript
// cli_inner_pretty.js:180941-180943
function epH() {
  return !yz$();
}

// And cli_inner_pretty.js:393927:
showAlwaysAllow: epH()
```

`yz$` returns true when **allowManagedPermissionRulesOnly** is set (admin tier locks down user-added rules). When true, `epH()` returns false → "Yes, always" variants are hidden.

### Why hide vs disable?

Two options for the same enterprise constraint:
1. **Hide the option** — the user simply doesn't see "Yes, always". The prompt shows only "Yes" and "No".
2. **Disable the option** — show "Yes, always" greyed out with a tooltip "disabled by org policy".

The CLI chose hide. Reasoning:
- Disabled options create UI noise; the prompt is already busy.
- "Hidden" is easier to explain in the explainer ("Your org locks down which rules can be added").
- The /permissions output still shows what rules exist; the user can navigate there for full transparency.

---

## 14. Cross-Validation with v2.1.88

The component structure in v2.1.142 mirrors v2.1.88 almost exactly:

- `PermissionDialog` shell — same border/title/Select layout
- Per-tool components — same set (Bash, Edit, Write, Skill, WebFetch, NotebookEdit, PowerShell, AskUserQuestion, EnterPlanMode, ExitPlanMode, Filesystem, Fallback)
- `permissionComponentForTool` dispatcher — same shape
- `PermissionExplanation` (the `?` toggle) — same in both

Differences:

| Aspect | v2.1.88 | v2.1.142 |
|---|---|---|
| Worker badge | Present | Present, expanded for bg-agent-preservation work (v2.1.141) |
| Auto-dismiss on mode change | Not present | Added v2.1.141 (`recheckPermission` invocation in `eJH`) |
| Shimmer classifier check | Present | Present (isolated component v2.1.88+) |
| Explainer panel | Present | Present (v2.1.141 added more decisionReason types) |
| `epH` gate | Implicit (`shouldShowAlwaysAllowOptions`) | Same logic, named function |
| Sandbox prompt | Present | Present with v2.1.116 dangerous-path safety integration |

The v2.1.142 changes are mostly **wiring polish** — the visual structure is stable; the integration points (mode change re-eval, bg agent badge, dangerous-path safety check) are new.

---

## 15. Why This Architecture?

### 15.1 Per-tool components, shared shell

The `PermissionDialog` shell + per-tool component pattern gives the right inheritance:
- Shared visual identity (border, title, color)
- Tool-specific content (diff vs URL vs command)
- Tool-specific options (always-allow rule variants)

Without per-tool components, the dialog would either be too generic (poor UX) or have giant per-tool conditionals (unmaintainable).

### 15.2 Serial queue, mode-aware re-eval

The serial queue prevents choice-overload but creates the risk of stale prompts (user changes mode while a prompt is open). The v2.1.141 re-eval pattern handles this: prompts are not just modal dialogs, they're **re-evaluable evaluation points** that update with the current state.

### 15.3 The classifier shimmer

The shimmer is a tiny UX detail that costs little to implement (a 20fps animation in an isolated component) and pays a lot in user confidence. Without it, classifier-driven prompts would feel buggy or slow.

The optimization (isolated component) means the cost doesn't compound — only the shimmer element re-renders, not the whole dialog.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md)
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md)
> - [`symbol_index_infra_integration.md`](../00_overview/symbol_index_infra_integration.md) — UI components

Key functions and components in this document:
- `PermissionDialog` — Outer shell component (v2.1.88: src/components/permissions/PermissionDialog.tsx)
- `PermissionRequest` — Per-tool dispatcher container (v2.1.88: src/components/permissions/PermissionRequest.tsx)
- `permissionComponentForTool` — Switch mapping tool → component (v2.1.88: PermissionRequest.tsx:54)
- `BashPermissionRequest`, `FileEditPermissionRequest`, etc. — Per-tool components
- `FallbackPermissionRequest` — Catch-all for MCP/custom tools
- `PermissionRequestTitle` — Title+subtitle+worker-badge component
- `PermissionExplanation` / `usePermissionExplainerUI` — Explainer panel + toggle hook
- `Select` — Choice list component (v2.1.88: src/components/CustomSelect/select.tsx)
- `bashToolUseOptions` — Bash-specific option builder (v2.1.88: bashToolUseOptions.tsx)
- `shouldShowAlwaysAllowOptions` — Gate for "Yes, always" variants
- `useCanUseTool` — The hook that pushes onto confirm queue (v2.1.88: src/hooks/useCanUseTool.tsx)
- `handleInteractivePermission` — Interactive handler that creates queue entries (v2.1.88: src/hooks/toolPermission/handlers/interactiveHandler.ts)
- `createPermissionContext`, `createPermissionQueueOps` — Context + queue ops (v2.1.88: src/hooks/toolPermission/PermissionContext.ts)
- `recheckPermission` — Re-eval callback on mode change (v2.1.88: PermissionContext.ts)
- `isShowAlwaysAllow` (`epH`) — Gate function (cli_inner_pretty.js:180941-180943)
- `permission_mode_changed` analytics event (cli_inner_pretty.js:218459)
- Theme key `"permission"` — Color used for dialog border (cli_inner_pretty.js:482355)
- Worker badge (`WorkerBadge.tsx`) — Background-agent indicator
- Color palette: `permission` (yellow/orange) distinct from `error`, `success`, `warning`
