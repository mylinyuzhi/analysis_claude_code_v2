# Plan Mode - UI Linkage Analysis (Claude Code 2.1.76)

> Complete reverse engineering of every UI component that renders, updates, or responds to Plan Mode state.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key components in this document:
- `W26` (chunks.191.mjs:3007) - `cycleMode` - Mode cycle logic
- `lbq` (chunks.191.mjs:3027) - `cycleModeWithContext` - Mode cycle wrapper returning next mode and context
- `D57` (chunks.40.mjs:358) - `MODE_CONFIGURATION` - Mode display properties object
- Footer mode indicator (chunks.183.mjs:2669) - Status bar
- `jZ1` (chunks.112.mjs:1142) - RejectedPlanViewer component
- `Gc4` (chunks.132.mjs:2768) - EnterPlanMode result UI
- `Kd4` (chunks.131.mjs:1153) - ExitPlanMode result UI (4 states)
- `Yd4` (chunks.131.mjs:1324) - ExitPlanMode rejection UI
- `$fY` (chunks.129.mjs:1756) - Swarm plan approval request UI
- `OfY` (chunks.129.mjs:1799) - Swarm plan approval response UI
- `aPq` (chunks.165.mjs:2676) - ExitPlanMode "Ready to code?" dialog
- `mcA` (chunks.1.mjs:2291) - Context usage percentage (for status bar "57% used")
- `GIA` (chunks.152.mjs:1438) - clearConversation (triggered by "clear context" options)
- `Rj1` (chunks.88.mjs:78) - getPlanFileSlug (captured before context clear)
- `n0A` (chunks.88.mjs:94) - registerPlanFileSlug (re-registered after context clear)

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

// Mode display properties from D57 configuration object
// D57 = { plan: { title: "Plan Mode", symbol: "⏸", color: "planMode" }, ... }
let modeConfig = MODE_CONFIGURATION[currentMode];

// Only show mode indicator for non-default modes
if (isNonDefaultMode) {
    modeIndicator = createElement(Text, {
            color: modeConfig.color,       // "planMode"
            key: "mode"
        },
        modeConfig.symbol,                  // "⏸"
        " ",
        modeConfig.title.toLowerCase(),     // "plan mode"
        " on",
        showHint && createElement(DimText,  // "(shift+tab to cycle)" hint
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

Mode display properties are defined in the `D57` configuration object at `chunks.40.mjs:358`:

```javascript
D57 = {
    plan: { title: "Plan Mode", symbol: "⏸", color: "planMode" },
    acceptEdits: { title: "Accept edits", symbol: "⏵⏵", color: "autoAccept" },
    delegate: { title: "Delegate Mode", symbol: "⇢", color: "delegateMode" },
    bypassPermissions: { title: "Bypass Permissions", symbol: "⏵⏵", color: "error" },
    default: { title: "Default", symbol: "", color: "text" }
};
```

| Mode | Symbol | Title | Color key | Status bar text |
|------|--------|-------|-----------|-----------------|
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
let { nextMode, context } = cycleModeWithContext(currentMode, teamContext);
// cycleModeWithContext calls cycleMode(currentMode, teamContext) → returns next mode string

// Telemetry
trackEvent("tengu_mode_cycle", { to: nextMode });

// Side effects:
if (currentMode.mode === "plan" && nextMode !== "plan") {
    setHasExitedPlanMode(true);    // HV(true)
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

**Note:** The `cycleMode` function (`W26`) is at `chunks.191.mjs:3007` and `cycleModeWithContext` (`lbq`) is at `chunks.191.mjs:3027`.

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
// Location: chunks.132.mjs:2768
// ============================================

function renderEnterPlanModeResult(toolResult, theme) {
    return (
        <Box flexDirection="column" marginTop={1}>
            <Box flexDirection="row">
                <Text color={MODE_CONFIGURATION.plan.color}>✓</Text>
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

### `Yd4` + `jZ1` - Rejection Cards

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

**Note:** The `jZ1` component at `chunks.112.mjs:1142` renders the rejected plan viewer.

### Tool Error Display (`H74` routing)

The message list renderer checks for special content prefixes:

```javascript
// If tool result content starts with OWA prefix:
// "The agent proposed a plan that was rejected by the user. The user chose to stay in plan mode..."
if (content.startsWith(OWA)) {
    let planText = content.substring(OWA.length);
    return createElement(RejectedPlanViewer, { plan: planText });  // jZ1 component
}
```

This renders the same `jZ1` box in the message history when viewing the conversation.

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

Plan mode can be activated via `/plan` slash command (in addition to Shift+Tab cycling). As of v2.1.72, `/plan` accepts an optional description argument: `/plan [description]`. When a description is provided, it is used as the initial task description injected into the planning context.

From the status bar footer hint: the `cycleMode` keybinding is displayed as a cycle hint next to the mode name. The keybinding is looked up via `RK("chat:cycleMode", "Chat", "shift+tab")`.

---

## 8. Plan Mode Theme Color

The `planMode` color is defined in `D57` configuration object at `chunks.40.mjs:358`. The color is used consistently across:

1. **Status bar** mode indicator text
2. **EnterPlanMode** result checkmark
3. **ExitPlanMode** result checkmarks
4. **jZ1 rejection box** border color
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

## 11. ExitPlanMode "Ready to code?" Dialog (`aPq`, chunks.165.mjs:2676)

The ExitPlanMode permission dialog is a custom multi-option selector rendered in the TUI. It has two visual variants depending on whether a plan file exists.

### Related Symbols

Key components in this section:
- `aPq` (chunks.165.mjs:2676) - ExitPlanMode dialog component
- `GIA` (chunks.152.mjs:1438) - `clearConversation` implementation
- `PIA` (chunks.152.mjs:1421) - `clearSessionCaches`
- `DL6` (chunks.1.mjs:2429) - `createNewSessionId`
- `Rj1` (chunks.88.mjs:78) - `getPlanFileSlug`
- `n0A` (chunks.88.mjs:94) - `registerPlanFileSlug`
- `mcA` (chunks.1.mjs:2291) - `getContextUsagePercentage`

### Variant 1: Empty Plan Dialog

When `getPlanContent()` returns null, a simplified dialog appears (rendered at `chunks.181.mjs:721-761`):

```
╭─────────────────────────────────────────────╮  ← planMode border color
│ Exit plan mode?                             │
╰─────────────────────────────────────────────╯
  Claude wants to exit plan mode

  ► Yes
    No
```

- **Yes** → `onAllow()` with `{type: "setMode", mode: "default"}` — always exits to "default" mode
- **No** / Esc → `onReject()`

### Variant 2: Full Plan Dialog — "Ready to code?"

When a plan file exists (rendered at `chunks.181.mjs:763-848`):

```
╭──────────────────────────────────────────────────────────╮  ← planMode border
│ Ready to code?                                           │
╰──────────────────────────────────────────────────────────╯
  Here is Claude's plan:
  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌   ← dashed border (top/bottom only)
  ## Implementation Plan                        ← plan content rendered as Markdown
  1. Modify auth/handler.js at line 45...
  2. Add JWT validation middleware...
  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌

  [Requested permissions:] ← only shown when allowedPrompts non-empty AND ne() returns true
  · BashTool (run tests, install dependencies)
  · EditTool (modify source files)

  Claude has written up a plan and is ready to execute. Would you like to proceed?

  ► Yes, clear context and auto-accept edits (shift+tab)   [value: "yes-accept-edits"]
    Yes, auto-accept edits                                  [value: "yes-accept-edits-keep-context"]
    Yes, manually approve edits                             [value: "yes-default-keep-context"]
    No, keep planning [__________________________________________]
                       Type here to tell Claude what to change

  ctrl-g to edit in vim                                    ← dimmed, only if $VISUAL/$EDITOR set
  · .claude/sessions/plan-abc123.md                        ← dimmed, plan file path
  ✓ Plan saved!                                            ← success indicator after ctrl-g edit
```

**If `isBypassPermissionsModeAvailable`** (bypass permissions feature enabled):

```
  ► Yes, clear context and bypass permissions               [value: "yes-bypass-permissions"]
    Yes, and bypass permissions                             [value: "yes-accept-edits-keep-context" → bypassPermissions]
    Yes, manually approve edits                             [value: "yes-default-keep-context"]
    No, keep planning [__________________________________________]
```

Note: "yes-accept-edits-keep-context" maps to `"bypassPermissions"` mode (not `"acceptEdits"`) when bypass is available.

### Option Behavior Map

| Option Label | Value | Tool Call Outcome | Mode After | Context |
|-------------|-------|-------------------|------------|---------|
| Yes, clear context and auto-accept edits (shift+tab) | `yes-accept-edits` | **REJECTED** (onReject) | `acceptEdits` | **Cleared** |
| Yes, clear context and bypass permissions | `yes-bypass-permissions` | **REJECTED** (onReject) | `bypassPermissions` | **Cleared** |
| Yes, auto-accept edits | `yes-accept-edits-keep-context` | **APPROVED** (onAllow) | `acceptEdits` ¹ | Kept |
| Yes, and bypass permissions | `yes-accept-edits-keep-context` (bypass mode) | **APPROVED** (onAllow) | `bypassPermissions` ¹ | Kept |
| Yes, manually approve edits | `yes-default-keep-context` | **APPROVED** (onAllow) | `default` | Kept |
| No, keep planning | `no` | `onReject(feedbackText)` | `plan` | Unchanged |
| *(empty plan)* Yes | `yes` (empty-plan variant) | **APPROVED** (onAllow) | `default` | Kept |

¹ `yes-accept-edits-keep-context` maps to `acceptEdits` normally, or `bypassPermissions` when `isBypassPermissionsModeAvailable`.

**Note on "No, keep planning"**: Unlike ESC/cancel (which calls `onReject()` with no arguments), typing text and pressing Enter calls `onReject(feedbackText, images)` — the feedback text is sent as a new user message to the LLM, which continues refining the plan in plan mode.

**Key insight**: "Clear context" options call `onReject()` — they dismiss the ExitPlanMode tool call entirely and instead use `appState.initialMessage` to trigger a fresh conversation.

### Keyboard Interactions

| Key | Effect |
|-----|--------|
| `↑` / `↓` | Navigate options |
| `Enter` | Select focused option |
| `Shift+Tab` | **Fast-select** "yes-accept-edits" directly (skips navigation) |
| `Ctrl+G` | Open plan file in system editor (via `$VISUAL` or `$EDITOR`) |
| `Esc` | Cancel dialog (stays in plan mode) |

**Shift+Tab fast-path**: `chunks.181.mjs:496-498`:
```javascript
if (keyEvent.shift && keyEvent.tab) {
    handleOptionSelected("yes-accept-edits");  // q1("yes-accept-edits")
    return;
}
```

This is intentional UX design — the option label includes `(shift+tab)` as a hint, matching the global mode cycle keybinding. Experienced users can quickly exit plan mode and start implementing in one keypress.

### "No, keep planning" — Inline Feedback

The last option is a text input, not a simple toggle:

```
  No, keep planning [Type here to tell Claude what to change_______]
                                                                ↑ cursor
```

When user types in this field and presses Enter:
- The dialog closes
- The typed text is submitted as a new user message to the LLM
- Claude remains in plan mode and revises the plan based on the feedback

This allows plan iteration without separate message steps — the user can type "make step 3 more detailed" directly in the dialog.

### Visual Rendering Architecture

```javascript
// ============================================
// aPq - ExitPlanMode dialog component (simplified)
// Location: chunks.165.mjs:2676
// ============================================

// READABLE (for understanding):
function ExitPlanModeDialog({ plan, isBypassPermissionsModeAvailable, onAllow, onReject, keyEvent }) {
    let [selectedValue, setSelectedValue] = useState(null);

    // Shift+Tab direct shortcut
    useKeypress((key) => {
        if (key.shift && key.tab) {
            handleOptionSelected("yes-accept-edits");
            return;
        }
    });

    // Plan exists → "Ready to code?" with options
    if (plan) return (
        <Box flexDirection="column">
            <Box borderStyle="round">
                <Text bold>Ready to code?</Text>
            </Box>
            <Markdown>{planPreview}</Markdown>
            <SelectInput
                items={buildOptionList(isBypassPermissionsModeAvailable)}
                onSelect={(item) => handleOptionSelected(item.value)}
            />
        </Box>
    );

    // No plan → simple "Exit plan mode?"
    return (
        <Box>
            <Text bold>Exit plan mode?</Text>
            <SelectInput items={[{ label: "Yes", value: "yes" }, ...]} />
        </Box>
    );
}
```

### Status Bar Context: The "57% Used" Label

Users often see the status bar alongside the ExitPlanMode dialog. The status bar shows the current context window usage:

```
⏸ plan mode on (shift+tab)         ←── status bar
[57% context used]                  ←── context meter
```

The percentage is computed by `getContextUsagePercentage` (`mcA`, `chunks.1.mjs:2291`):

```javascript
function getContextUsagePercentage(usage, contextWindowSize) {
    // Sum: input tokens + cache creation tokens + cache read tokens
    let totalUsed = usage.input_tokens + usage.cache_creation_input_tokens + usage.cache_read_input_tokens;
    return {
        used: Math.min(100, Math.max(0, Math.round(totalUsed / contextWindowSize * 100))),
        remaining: 100 - used
    };
}
```

**Important**: The "57% used" appears in the **status bar/footer**, not in the option label. The option label is always static: `"Yes, clear context and auto-accept edits (shift+tab)"`. Users mentally associate the percentage with the "clear context" option because both are visible simultaneously.

---

## 10. Complete UI Event Map

| User Action | UI Response |
|------------|-------------|
| Press Shift+Tab (entering plan mode) | Status bar gains `⏸ plan mode on` indicator |
| LLM calls EnterPlanMode | Result card: "✓ Entered plan mode" |
| User declines EnterPlanMode | Result card: "✓ User declined to enter plan mode" |
| LLM calls ExitPlanMode (no plan) | Dialog: "Exit plan mode?" simple Yes/No |
| LLM calls ExitPlanMode (plan exists) | Dialog: "Ready to code?" with plan preview + 5 options |
| User presses Shift+Tab in dialog | Fast-selects "Yes, clear context and auto-accept edits" |
| User selects "clear context + accept edits" | Context cleared, mode→acceptEdits, plan sent to LLM |
| User selects "clear context + bypass permissions" | Context cleared, mode→bypassPermissions, plan sent to LLM |
| User selects "Yes, auto-accept edits" | ExitPlanMode approves, mode→acceptEdits, context kept |
| User selects "Yes, manually approve edits" | ExitPlanMode approves, mode→default, context kept |
| User types in "No, keep planning" field | Stays in plan mode, typed text sent as new user message |
| User approves ExitPlanMode (keep-context path) | Result card: "✓ User approved Claude's plan" + plan + path |
| User clicks No / Esc on dialog | jZ1 box: "User rejected Claude's plan:" + plan in planMode border |
| Press Shift+Tab (leaving plan mode) | Status bar mode indicator disappears |
| Teammate in swarm submits plan | Swarm UI: status → "awaiting approval"; leader sees $fY component |
| Team leader approves | OfY: green "✓ Plan Approved" box |
| Team leader rejects | OfY: red "✗ Plan Rejected" box + feedback + instructions |
| 7+ days without plan mode | Help tip appears: "Use Plan Mode for complex requests" |
| User has OpusPlan model | Help tip: "Press Shift+Tab twice for Opus Plan Mode" |
