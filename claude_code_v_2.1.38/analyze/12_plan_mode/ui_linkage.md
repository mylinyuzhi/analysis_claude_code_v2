# Plan Mode - UI Linkage Analysis (Claude Code 2.1.38)

> Complete reverse engineering of every UI component that renders, updates, or responds to Plan Mode state.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key components in this document:
- `hf1` (chunks.183.mjs:1778) - Mode cycle logic
- `FGq` (chunks.183.mjs:1799) - Mode cycle wrapper with context
- Footer mode indicator (chunks.183.mjs:2669) - Status bar
- `CQ` (chunks.14.mjs:3260) - Mode name ("Plan Mode")
- `Rv1` (chunks.14.mjs:3281) - Mode icon ("⏸")
- `cP` (chunks.14.mjs:3298) - Mode color ("planMode")
- `Gc4` (chunks.140.mjs:1597) - EnterPlanMode result UI
- `Zc4` (chunks.140.mjs:1612) - EnterPlanMode rejection UI
- `Kd4` (chunks.139.mjs:2491) - ExitPlanMode result UI (4 states)
- `Yd4` (chunks.139.mjs:2550) - ExitPlanMode rejection UI
- `HX6` (chunks.107.mjs:1153) - Rejected plan viewer
- `$fY` (chunks.129.mjs:1756) - Swarm plan approval request UI
- `OfY` (chunks.129.mjs:1799) - Swarm plan approval response UI

---

## 1. Status Bar (Footer)

The plan mode status is displayed in the REPL footer when active.

### Location

`chunks.183.mjs` → footer component (exact line ~2590)

### Rendering Logic

```javascript
// Excerpt from footer component:
let currentMode = toolPermissionContext?.mode;  // "plan"
let isNonDefaultMode = currentMode !== "default" && currentMode !== undefined;

// Only show mode indicator for non-default modes
if (isNonDefaultMode) {
    modeIndicator = createElement(Text, {
            color: getThemeColor(currentMode),       // cP("plan") → "planMode"
            key: "mode"
        },
        getModeIcon(currentMode),                    // Rv1("plan") → "⏸"
        " ",
        getModeDisplayName(currentMode).toLowerCase(), // CQ("plan").toLowerCase() → "plan mode"
        " on",
        showHint && createElement(DimText,           // "(shift+tab to cycle)" hint
            " ",
            cycleModeKeybinding
        )
    )
}
```

### Visual Output

```
⏸ plan mode on (shift+tab)
```

Where:
- `⏸` is in **planMode** theme color (typically a blue/purple)
- `plan mode` continues in planMode color
- ` on` continues in planMode color
- ` (shift+tab)` is **dimmed**

### Mode Display Table

| Mode | `Rv1()` icon | `CQ()` name | `cP()` color key | Status bar text |
|------|-------------|-------------|-----------------|----------------|
| `plan` | `⏸` | "Plan Mode" | `"planMode"` | `⏸ plan mode on` |
| `acceptEdits` | `⏵⏵` | "Accept edits" | `"autoAccept"` | `⏵⏵ accept edits on` |
| `delegate` | `⇢` | "Delegate Mode" | `"delegateMode"` | `⇢ delegate mode on` |
| `bypassPermissions` | `⏵⏵` | "Bypass Permissions" | `"error"` | `⏵⏵ bypass permissions on` |
| `default` | `""` | "Default" | `"text"` | *(not shown)* |

---

## 2. Mode Cycling via Shift+Tab

### Keybinding

Registered as `"chat:cycleMode"` → default binding `"shift+tab"`.

### Handler (chunks.185.mjs ~620)

```javascript
// When user presses Shift+Tab in Chat context:
let { nextMode, context } = FGq(currentMode, teamContext);
// FGq calls hf1(currentMode, teamContext) → returns next mode string

// Telemetry
trackEvent("tengu_mode_cycle", { to: nextMode });

// Side effects:
if (currentMode.mode === "plan" && nextMode !== "plan") {
    setHasExitedPlanMode(true);    // OT(true)
}
if (nextMode === "plan") {
    updateSettings({ lastPlanModeUse: Date.now() });  // for help tips
}
if (nextMode === "acceptEdits") {
    trackEvent("auto-accept-mode");
}

// State update:
setAppState(state => ({
    ...state,
    toolPermissionContext: { ...context, mode: nextMode }
}));

// Context update in React:
setToolPermissionContext({ ...context, mode: nextMode });
```

### Mode Cycle Sequence

```
Shift+Tab presses:
1st press: default → acceptEdits  (⏵⏵ accept edits on)
2nd press: acceptEdits → plan     (⏸ plan mode on)
3rd press: plan → default         (status bar hides)

[If team leader:]
3rd press: plan → delegate        (⇢ delegate mode on)
4th press: delegate → default     (status bar hides)
```

---

## 3. EnterPlanMode Tool UI

### Sequence

```
LLM calls EnterPlanMode
    │
    ├─ renderToolUseMessage: null (no intermediate display during execution)
    ├─ renderToolUseProgressMessage: null
    │
    ├─ [call() executes: mode → "plan", saves prePlanMode]
    │
    ├─ renderToolResultMessage: Gc4 → shows "✓ Entered plan mode"
    └─ renderToolUseRejectedMessage: Zc4 → shows "✓ User declined to enter plan mode"
```

### `Gc4` - Success Result

```javascript
// ============================================
// Gc4 - EnterPlanMode result card
// Location: chunks.140.mjs:1597
// ============================================

function renderEnterPlanModeResult(toolResult, theme) {
    return (
        <Box flexDirection="column" marginTop={1}>
            <Box flexDirection="row">
                <Text color={getThemeColor("plan")}>✓</Text>
                <Text> Entered plan mode</Text>
            </Box>
            <Box paddingLeft={2}>
                <Text dimColor>
                    Claude is now exploring and designing an implementation approach.
                </Text>
            </Box>
        </Box>
    );
}
```

**Terminal output:**
```
✓ Entered plan mode
  Claude is now exploring and designing an implementation approach.
```
(Checkmark in planMode color, description text dimmed)

### `Zc4` - Rejection Card

```javascript
// ============================================
// Zc4 - EnterPlanMode rejection card
// Location: chunks.140.mjs:1612
// ============================================

function renderEnterPlanModeRejected() {
    return (
        <Box flexDirection="row" marginTop={1}>
            <Text color={getThemeColor("default")}>✓</Text>
            <Text> User declined to enter plan mode</Text>
        </Box>
    );
}
```

**Terminal output:**
```
✓ User declined to enter plan mode
```

---

## 4. ExitPlanMode Tool UI

### Sequence

```
LLM calls ExitPlanMode
    │
    ├─ renderToolUseMessage: null (no intermediate)
    ├─ renderToolUseProgressMessage: null
    │
    ├─ checkPermissions() → { behavior: "ask" }
    │   → permission dialog shown: "Exit plan mode?"
    │   → user sees plan content (injected by normalizeToolInput)
    │
    ├─ [User APPROVES]
    │   ├─ call() executes
    │   └─ renderToolResultMessage: Kd4 (4 states below)
    │
    └─ [User REJECTS]
        └─ renderToolUseRejectedMessage: Yd4 → HX6 component
```

### `Kd4` - Result Card (4 States)

**State 1: Empty plan (plan file not written)**

```
✓ Exited plan mode
```

**State 2: Remote push (pushToRemote=true)**

```
✓ Pushed plan to Claude Code on the web

  This task is now running in the background.    ← dimmed
  Monitor it with /tasks or at https://...        ← dimmed
```

**State 3: Awaiting team leader approval**

```
✓ Plan submitted for team lead approval

  Plan file: .claude/sessions/abc123/plan.md       ← dimmed
  Waiting for team lead to review and approve...   ← dimmed
```

**State 4: User approved (standard flow)**

```
✓ User approved Claude's plan

  Plan saved to: .claude/sessions/abc123/plan.md · /plan to edit   ← dimmed

  ## Implementation Plan                                            ← plan content
  1. Add authentication middleware...                               ← rendered markdown
  2. Update the route handlers...
  ...
```

### `Yd4` + `HX6` - Rejection Cards

When user clicks **No** on the "Exit plan mode?" permission dialog:

```
User rejected Claude's plan:
╭──────────────────────────────────────────────────────────╮   ← planMode color, dimmed
│ ## Implementation Plan                                    │
│                                                           │
│ ### 1. Modify auth/handler.js                            │
│ Add JWT validation at line 45...                         │
│                                                           │
│ ### 2. Update tests                                       │
│ ...                                                       │
╰──────────────────────────────────────────────────────────╯
```

### Tool Error Display (`H74` routing)

The message list renderer in `chunks.107.mjs:1226` checks for special content prefixes:

```javascript
// If tool result content starts with OWA prefix:
// "The agent proposed a plan that was rejected by the user. The user chose to stay in plan mode..."
if (content.startsWith(OWA)) {
    let planText = content.substring(OWA.length);
    return createElement(HX6, { plan: planText });
}
```

This renders the same `HX6` box in the message history when viewing the conversation.

---

## 5. Help Tip Integration

Plan mode is featured in the help tip system to improve discoverability:

### Tip: "plan-mode-for-complex-tasks"

```javascript
{
    id: "plan-mode-for-complex-tasks",
    content: `Use Plan Mode to prepare for a complex request before making changes.
              Press ${cycleMode keybinding} twice to enable.`,
    isRelevant: (settings) =>
        // Only show tip if user hasn't used plan mode recently (>7 days)
        (Date.now() - (settings.lastPlanModeUse ?? 0)) / 86400000 > 7
}
```

### Tip: "shift+tab cycles modes"

```javascript
{
    content: `Hit ${cycleMode keybinding} to cycle between default mode, auto-accept edit mode, and plan mode`
}
```

### Tip: "opusplan-mode-reminder" (for Opus Plan users)

```javascript
{
    id: "opusplan-mode-reminder",
    content: `Your default model setting is Opus Plan Mode.
              Press ${cycleMode keybinding} twice to activate Plan Mode and plan with Claude Opus.`,
    isRelevant: (settings) => {
        let isOpusPlan = getDefaultModel() === "opusplan";
        let daysSince = (Date.now() - (settings.lastPlanModeUse ?? 0)) / 86400000;
        return isOpusPlan && daysSince > 7;
    }
}
```

### Tip: "use /config for plan mode"

```javascript
{
    content: `Use /config to change your default permission mode (including Plan Mode)`,
    isRelevant: (settings) =>
        settings.lastPlanModeUse  // Only show if user has used plan mode
}
```

---

## 6. Settings & Persistence

### `lastPlanModeUse` Tracking

Every time the user enters plan mode (via Shift+Tab), the current timestamp is saved:

```javascript
// chunks.185.mjs:637
if (nextMode === "plan") {
    updateSettings((state) => ({
        ...state,
        lastPlanModeUse: Date.now()
    }));
}
```

This timestamp is used by:
- Help tip relevance checks (>7 days → show plan mode tips)
- Discoverability tracking

### `prePlanMode` in `toolPermissionContext`

Saved on `EnterPlanMode`, cleared on `ExitPlanMode`:
```
Entry:  toolPermissionContext.prePlanMode = currentMode
Exit:   mode = prePlanMode ?? "default", prePlanMode = undefined
```

This allows `ExitPlanMode` to restore exactly the mode the user was in before plan mode (e.g., if they were in `acceptEdits` mode and entered plan mode, they return to `acceptEdits` after plan mode).

---

## 7. Keyboard Shortcut

Plan mode can be activated via `/plan` slash command (in addition to Shift+Tab cycling).

From the status bar footer hint: the `cycleMode` keybinding is displayed as a cycle hint next to the mode name. The keybinding is looked up via `RK("chat:cycleMode", "Chat", "shift+tab")`.

---

## 8. Plan Mode Theme Color

`cP("plan")` returns `"planMode"` which maps to a theme color in the TUI color system. The color is used consistently across:

1. **Status bar** mode indicator text
2. **EnterPlanMode** result checkmark
3. **ExitPlanMode** result checkmarks
4. **HX6 rejection box** border color
5. **$fY swarm approval request** box border and header text
6. **Help tip** plan mode references

The `planMode` color provides visual coherence - everything plan-related uses the same themed color.

### Actual Color Values by Theme (`chunks.52.mjs`)

| Theme Index | `planMode` Value | Visual |
|------------|------------------|--------|
| 1 (Dark) | `rgb(0,102,102)` | Dark teal |
| 2 (ANSI) | `ansi:cyan` | Terminal cyan |
| 3 (ANSI Bright) | `ansi:cyanBright` | Bright cyan |
| 4 (Dark Muted) | `rgb(51,102,102)` | Muted teal |
| 5 (Teal Green) | `rgb(72,150,140)` | Teal green |
| 6 (Soft Teal) | `rgb(102,153,153)` | Soft teal |

All variants are in the teal/cyan family, chosen to be visually distinct from the default text color while indicating a "paused" / "deliberative" state (matching the ⏸ pause icon).

---

## 9. Prompt Suggestion Blocking

### `getPromptSuggestionBlocker()` (`EhA`, chunks.151.mjs:149)

While in plan mode, inline prompt suggestions (autocomplete, command hints) are suppressed:

```javascript
function getPromptSuggestionBlocker(appState) {
    if (!appState.promptSuggestionEnabled) return "disabled";
    if (appState.pendingWorkerRequest || appState.pendingSandboxRequest) return "pending_permission";
    if (appState.elicitation.queue.length > 0) return "elicitation_active";
    if (appState.toolPermissionContext.mode === "plan") return "plan_mode";  // ← plan mode suppresses
    if (rateLimiter.status !== "allowed") return "rate_limit";
    return null  // null = suggestions enabled
}
```

**Effect**: When `mode === "plan"`, the function returns `"plan_mode"` blocker string. The caller (`Y6q`) skips suggestion generation and records `"plan_mode"` as the suppression reason in telemetry.

**Why**: Plan mode is a structured 5-phase workflow. Inline suggestions (which come from a separate LLM call) would distract from the deliberate planning flow and waste tokens. Suppressing them keeps the UX clean during planning.

**Priority in blocker chain**:
```
disabled → pending_permission → elicitation_active → plan_mode → rate_limit → (enabled)
```
Plan mode is checked 4th in the priority chain (after fundamental blockers but before rate limits).

---

## 10. Complete UI Event Map

| User Action | UI Response |
|------------|-------------|
| Press Shift+Tab (entering plan mode) | Status bar gains `⏸ plan mode on` indicator |
| LLM calls EnterPlanMode | Result card: "✓ Entered plan mode" |
| User declines EnterPlanMode | Result card: "✓ User declined to enter plan mode" |
| LLM calls ExitPlanMode | Permission dialog: "Exit plan mode?" with plan content |
| User approves ExitPlanMode | Result card: "✓ User approved Claude's plan" + plan + path |
| User rejects ExitPlanMode | HX6 box: "User rejected Claude's plan:" + plan in planMode border |
| Press Shift+Tab (leaving plan mode) | Status bar mode indicator disappears |
| Teammate in swarm submits plan | Swarm UI: status → "awaiting approval"; leader sees $fY component |
| Team leader approves | OfY: green "✓ Plan Approved" box |
| Team leader rejects | OfY: red "✗ Plan Rejected" box + feedback + instructions |
| 7+ days without plan mode | Help tip appears: "Use Plan Mode for complex requests" |
| User has OpusPlan model | Help tip: "Press Shift+Tab twice for Opus Plan Mode" |
