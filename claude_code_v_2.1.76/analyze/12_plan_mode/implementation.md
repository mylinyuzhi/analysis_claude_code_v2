# Plan Mode - Complete Implementation Analysis (Claude Code 2.1.76)

## Overview

Plan Mode is a specialized session state in Claude Code that restricts the agent to read-only exploration and enforces a structured approval workflow before any implementation begins. It is the primary mechanism for "Plan → Approve → Implement" safety.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `EnterPlanModeTool` (Ki6) - Tool object (chunks.144.mjs:1579)
- `ExitPlanModeTool` (zD) - Tool object (chunks.143.mjs:2802)
- `D57` (chunks.40.mjs:358) - `MODE_CONFIGURATION` - Mode display properties object

> See also:
> - [ask_user_question.md](./ask_user_question.md) — Deep analysis of AskUserQuestion tool (multi-round interactions, elicitation queue, UI components, schema)
> - [interview_phase.md](./interview_phase.md) — Complete Interview Phase analysis (feature flag, iterative loop, "Chat about this" / "Skip interview" callbacks, "Ready to code?" dialog options, context-clearing mechanism)
> - [tools_filtering.md](./tools_filtering.md) — Tools restriction analysis (isReadOnly(), allowedTools, Bash filtering, permission flow)
> - [reminder_system.md](./reminder_system.md) — Reminder/attachment injection (DuY, XuY, ezz, A2z, turn counting, throttling)
> - [state_management.md](./state_management.md) — State variables and transitions (hasExitedPlanMode, needsPlanModeExitAttachment, prePlanMode)
> - [mode_cycling.md](./mode_cycling.md) — Shift+Tab integration (W26, lbq, cbq, mode sequences)
> - [plan_approval_flow.md](./plan_approval_flow.md) — Plan approval lifecycle (user-facing + swarm teammate)
> - [ui_linkage.md](./ui_linkage.md) — UI components and rendering
> - [compact_integration.md](./compact_integration.md) — Plan preservation during compaction (mE1, pD, uW, kq)
> - [hooks_integration.md](./hooks_integration.md) — Hooks in plan mode (mW6, JZY, PreCompact)
> - [task_integration.md](./task_integration.md) — Task system integration (Nqq, TaskCreate, TaskUpdate)
- `aPq` (chunks.165.mjs:2676) - ExitPlanMode dialog ("Ready to code?")
- `W26` (chunks.191.mjs:3007) - Mode cycle function
- `lbq` (chunks.191.mjs:3027) - Mode cycle with context function
- `cbq` (chunks.191.mjs:3003) - isTeamLeaderWithTeam helper
- `jZ1` (chunks.112.mjs:1142) - RejectedPlanViewer component
- `Gc4` (chunks.132.mjs:2768) - EnterPlanMode result UI
- `Kd4` (chunks.131.mjs:1153) - ExitPlanMode result UI
- `Yd4` (chunks.131.mjs:1324) - ExitPlanMode rejection UI
- `DuY` (chunks.147.mjs:136) - Plan mode attachment generator
- `XuY` (chunks.147.mjs:170) - Plan mode exit attachment generator
- `Dp` (chunks.1.mjs:2946) - Mode transition hook (updates needsPlanModeExitAttachment)
- `nk6` (chunks.1.mjs:2930) - `hasExitedPlanMode` getter
- `Fu1` (chunks.1.mjs:2938) - `needsPlanModeExitAttachment` getter
- `HV` (chunks.1.mjs:2934) - `setHasExitedPlanMode`
- `JS` (chunks.1.mjs:2942) - `setNeedsPlanModeExitAttachment`
- `GIA` (chunks.152.mjs:1438) - `clearConversation` (full 11-step session reset)
- `PIA` (chunks.152.mjs:1421) - `clearSessionCaches`
- `DL6` (chunks.1.mjs:2429) - `createNewSessionId` (with parent tracking)
- `Rj1` (chunks.88.mjs:78) - `getPlanFileSlug`
- `n0A` (chunks.88.mjs:94) - `registerPlanFileSlug`
- `dU7` (chunks.88.mjs:98) - `clearPlanFileSlug`
- `mcA` (chunks.1.mjs:2291) - `getContextUsagePercentage`

---

## /plan Command Syntax

The `/plan` command supports an optional description argument (added in v2.1.72):

**Basic usage (no description):**
```
/plan
```
Enters plan mode, user can then describe their task.

**With description (v2.1.72+):**
```
/plan fix the authentication bug in the login flow
/plan implement dark mode support
/plan refactor database schema to support multi-tenancy
```

**How description works:**

When a description is provided:
1. Enter plan mode immediately
2. Description is injected as initial context/task framing
3. Equivalent to entering plan mode manually, then immediately typing the description
4. User is placed in the interview phase with the description already primed

**Example flow:**

```
User: /plan optimize the API response time for large datasets
     │
     ├─ Command parsed → extract description
     ├─ Enter plan mode
     ├─ Inject description into context
     └─ Begin interview phase with task framing

System: [Enters Plan Mode]
        "I'll help you plan optimizing the API response time
         for large datasets. Let me start by asking some questions..."
```

**Benefits:**

- **Streamlined workflow**: No need to enter plan mode, then retype the task
- **Single-command entry**: `/plan <description>` is faster than two steps
- **Clear task framing**: Description is visible in the plan file from the start

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       Plan Mode System                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ① State Machine                                                │
│     toolPermissionContext.mode ∈ {"default","plan","acceptEdits"│
│                                   "delegate","bypassPermissions"}│
│     + prePlanMode (saves mode before entering plan)             │
│                                                                  │
│  ② Mode Cycle (Shift+Tab)                                       │
│     default → acceptEdits → plan → (delegate) → default        │
│                                                                  │
│  ③ System Prompt Injection                                      │
│     plan_mode attachment → azz() → full/sparse reminder        │
│     plan_mode_reentry → re-entry instructions                   │
│     plan_mode_exit → exit confirmation                          │
│                                                                  │
│  ④ Tool Restriction                                             │
│     Only read-only tools + Write/Edit to plan file path         │
│     ExitPlanMode is the ONLY way out (programmatic)             │
│                                                                  │
│  ⑤ UI Linkage                                                   │
│     Status bar: ⏸ Plan Mode on (shift+tab)                     │
│     Tool result cards: success/rejected/awaiting states         │
│     Permission dialog: "Exit plan mode?" confirmation           │
│                                                                  │
│  ⑥ Swarm Integration                                           │
│     Teammate → plan_approval_request → team-lead mailbox        │
│     Team lead reviews → plan_approval_response → teammate inbox │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. State Machine

Plan mode state lives in `toolPermissionContext.mode`. The full set of valid modes:

```
"default" | "acceptEdits" | "bypassPermissions" | "plan" | "delegate" | "dontAsk"
```

**Plan-specific state fields in `toolPermissionContext`:**
```typescript
{
  mode: "plan",
  prePlanMode: "default" | "acceptEdits" | ...  // saved on entry, restored on exit
}
```

**Global singleton flags** (in `v1` global state, `chunks.1.mjs`):
- `hasExitedPlanMode` → read by `nk6()`, write by `HV()`
- `needsPlanModeExitAttachment` → read by `Fu1()`, write by `JS()`

### Mode Transition Hook

```javascript
// ============================================
// Dp - handlePlanModeTransition - Mode transition side-effect hook
// Location: chunks.1.mjs:2946-2950
// ============================================

// ORIGINAL (for source lookup):
function Dp(A, q) {
    if (q === "plan" && A !== "plan") v1.needsPlanModeExitAttachment = !1;
    if (A === "plan" && q !== "plan") v1.needsPlanModeExitAttachment = !0
}

// READABLE (for understanding):
function handlePlanModeTransition(fromMode, toMode) {
    // Entering plan mode: mark that no exit attachment has been generated yet
    if (toMode === "plan" && fromMode !== "plan") {
        globalSessionState.needsPlanModeExitAttachment = false;
    }
    // Leaving plan mode: mark that we need to generate a plan_mode_exit attachment
    if (fromMode === "plan" && toMode !== "plan") {
        globalSessionState.needsPlanModeExitAttachment = true;
    }
}

// Mapping: Dp→handlePlanModeTransition, A→fromMode, q→toMode, v1→globalSessionState
```

**Key insight:** `Dp()` is called in TWO places:
1. By `EnterPlanModeTool.call()` before updating state (to set up flags correctly)
2. By the UI mode-cycle handler in `chunks.185.mjs:635` when user presses Shift+Tab

---

## 2. Mode Cycle (Shift+Tab UI)

```javascript
// ============================================
// hf1 - Next mode in cycle
// Location: chunks.183.mjs:1778
// ============================================

// ORIGINAL (for source lookup):
function hf1(A, q) {
    let K = l8() && q && PM(q);
    switch (A.mode) {
        case "default":     return "acceptEdits";
        case "acceptEdits": return "plan";
        case "plan":
            if (K) return "delegate";
            if (A.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "delegate":
            if (A.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "bypassPermissions": return "default";
        case "dontAsk":     return "default"
    }
}

// READABLE (for understanding):
function getNextMode(permissionContext, teamContext) {
    let isTeamLeader = isTeamsEnabled() && teamContext && isTeamLeader(teamContext);
    switch (permissionContext.mode) {
        case "default":       return "acceptEdits";
        case "acceptEdits":   return "plan";
        case "plan":
            if (isTeamLeader) return "delegate";           // Team leaders can delegate
            if (permissionContext.isBypassPermissionsModeAvailable)
                return "bypassPermissions";                // Enterprise/power users
            return "default";                              // Normal users cycle back
        case "delegate":
            if (permissionContext.isBypassPermissionsModeAvailable)
                return "bypassPermissions";
            return "default";
        case "bypassPermissions": return "default";
        case "dontAsk":           return "default";
    }
}

// Mapping: hf1→getNextMode, A→permissionContext, q→teamContext, K→isTeamLeader, l8→isTeamsEnabled, PM→isTeamLeader
```

**Cycle diagram:**
```
For normal users:
default → acceptEdits → plan → default → ...

For team leaders:
default → acceptEdits → plan → delegate → default → ...

For enterprise users with bypass:
... → plan → bypassPermissions → default → ...
```

When the user presses Shift+Tab (chunks.185.mjs:635):
1. Gets current mode + team context
2. Calls `FGq(K, y1)` → `hf1(K, y1)` to get next mode
3. Calls `Dp(K.mode, I6)` to update global flags
4. If switching to plan: records `lastPlanModeUse: Date.now()` in settings
5. Calls `setAppState()` with new `mode`
6. Calls `HR4(I6, teamName)` for telemetry

---

## 3. UI Rendering - Status Bar

Plan mode appears in the **footer** of the REPL component (chunks.183.mjs):

```javascript
// ============================================
// Footer mode indicator rendering
// Location: chunks.183.mjs:2669
// ============================================

// READABLE (for understanding):
// D57 = MODE_CONFIGURATION at chunks.40.mjs:358
// D57 = { plan: { title: "Plan Mode", symbol: "⏸", color: "planMode" }, ... }

let modeConfig = MODE_CONFIGURATION[currentMode];
// q1 = currentMode (e.g. "plan")
// t = mode !== "default" (only show indicator for non-default modes)

if (currentMode && currentMode !== "default") {
    modeIndicator = createElement(Text, {
        color: modeConfig.color,       // "planMode" → themed blue/purple
        key: "mode"
    },
        modeConfig.symbol,             // "⏸" for plan
        " ",
        modeConfig.title.toLowerCase(), // "plan mode"
        " on",
        showHint && createElement(DimText, " ", cycleModeKeybinding)
        // → full: "⏸ plan mode on (shift+tab)"
    )
}
```

### Mode Configuration Object (`D57`)

Mode display properties are defined in the `D57` configuration object at `chunks.40.mjs:358`:

```javascript
// ============================================
// D57 - MODE_CONFIGURATION
// Location: chunks.40.mjs:358-403
// ============================================

D57 = {
    plan: { title: "Plan Mode", symbol: "⏸", color: "planMode" },
    acceptEdits: { title: "Accept edits", symbol: "⏵⏵", color: "autoAccept" },
    delegate: { title: "Delegate Mode", symbol: "⇢", color: "delegateMode" },
    bypassPermissions: { title: "Bypass Permissions", symbol: "⏵⏵", color: "error" },
    default: { title: "Default", symbol: "", color: "text" }
};
```

**Key insight:** The symbols `CQ`, `Rv1`, `cP` previously documented as "getModeDisplayName", "getModeIcon", "getModeThemeColor" do NOT exist as separate functions. Mode display is handled via direct property access on the `D57` configuration object.

**Mode UI properties:**

| Mode | Symbol | Title | Color key |
|------|--------|-------|-----------|
| `plan` | `⏸` | "Plan Mode" | `"planMode"` |
| `acceptEdits` | `⏵⏵` | "Accept edits" | `"autoAccept"` |
| `delegate` | `⇢` | "Delegate Mode" | `"delegateMode"` |
| `bypassPermissions` | `⏵⏵` | "Bypass Permissions" | `"error"` |
| `default` | `""` | "Default" | `"text"` |

---

## 4. EnterPlanMode Tool

### Tool Definition

```javascript
// ============================================
// EnterPlanModeTool - Full tool object
// Location: chunks.144.mjs:1590-1660
// ============================================

// ORIGINAL (for source lookup):
({
    name: dt,         // "EnterPlanMode"
    maxResultSizeChars: 1e5,
    async description() { return "Requests permission to enter plan mode for complex tasks requiring exploration and design" },
    async prompt() { return pCY() },    // returns full prompt text
    get inputSchema() { return C.strictObject({}) }, // No input params
    get outputSchema() { return C.object({ message: z.string() }) },
    isEnabled() { return !0 },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !0 },
    toAutoClassifierInput() { return "" },
    async checkPermissions(A) {
        return { behavior: "allow", updatedInput: A }  // AUTO-APPROVED
    },
    renderToolUseMessage: V8q,
    renderToolUseProgressMessage: k8q,
    renderToolResultMessage: E8q,
    renderToolUseRejectedMessage: y8q,
    renderToolUseErrorMessage: L8q,
    async call(A, q) {
        if (q.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
        let K = q.getAppState();
        return Dp(K.toolPermissionContext.mode, "plan"), q.setAppState((Y) => ({
            ...Y,
            toolPermissionContext: Ez(LT6(Y.toolPermissionContext), {
                type: "setMode",
                mode: "plan",
                destination: "session"
            })
        })), { data: { message: "Entered plan mode..." } }
    },
    mapToolResultToToolResultBlockParam({ message: A }, q) {
        return {
            type: "tool_result",
            content: rO() ? `${A}\n\nDO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`
                          : `${A}\n\nIn plan mode, you should:\n1. Thoroughly explore...\n...\n6. When ready, use ExitPlanMode...`,
            tool_use_id: q
        }
    }
})

// READABLE (for understanding):
EnterPlanModeTool = {
    name: "EnterPlanMode",
    maxResultSizeChars: 100000,
    async description() { return "Requests permission to enter plan mode for complex tasks requiring exploration and design" },
    async prompt() { return buildEnterPlanModePrompt() },
    get inputSchema() { return z.strictObject({}) },  // No input parameters
    get outputSchema() { return z.object({ message: z.string() }) },
    isEnabled() { return true },
    isConcurrencySafe() { return true },
    isReadOnly() { return true },
    toAutoClassifierInput() { return "" },

    async checkPermissions(input) {
        return { behavior: "allow", updatedInput: input }  // AUTO-APPROVED - no user dialog
    },

    renderToolUseMessage: renderEnterPlanModeMessage,
    renderToolUseProgressMessage: renderEnterPlanModeProgress,
    renderToolResultMessage: renderEnterPlanModeResult,  // Gc4
    renderToolUseRejectedMessage: renderEnterPlanModeRejected,  // y8q
    renderToolUseErrorMessage: renderEnterPlanModeError,  // L8q

    async call(input, toolUseContext) {
        // Guard: Cannot use in agent/subagent contexts
        if (toolUseContext.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");

        let appState = await toolUseContext.getAppState();

        // Dp() - Handle mode transition side-effects
        // Sets needsPlanModeExitAttachment = false (entering plan mode, no exit yet)
        handlePlanModeTransition(appState.toolPermissionContext.mode, "plan");

        // Update state with new mode
        toolUseContext.setAppState((state) => ({
            ...state,
            toolPermissionContext: applyPermissionAction(
                getPermissionContextForSession(state.toolPermissionContext),
                { type: "setMode", mode: "plan", destination: "session" }
            )
        }));

        return {
            data: {
                message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
            }
        };
    },

    mapToolResultToToolResultBlockParam({ message }, toolUseId) {
        // rO() = isPlanModeInterviewPhase() - feature flag check
        const isInterviewPhase = isPlanModeInterviewPhase();

        return {
            type: "tool_result",
            content: isInterviewPhase
                ? `${message}\n\nDO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`
                : `${message}\n\nIn plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
            tool_use_id: toolUseId
        };
    }
};

// Mapping: dt→"EnterPlanMode", pCY→buildEnterPlanModePrompt, Ez→applyPermissionAction
// Mapping: LT6→getPermissionContextForSession, Dp→handlePlanModeTransition, rO→isPlanModeInterviewPhase
// Mapping: V8q→renderEnterPlanModeMessage, k8q→renderEnterPlanModeProgress, E8q→renderEnterPlanModeResult
// Mapping: y8q→renderEnterPlanModeRejected, L8q→renderEnterPlanModeError
```

### Permission Model

`checkPermissions` returns `{ behavior: "allow" }` — **no user confirmation required**. The LLM autonomously enters plan mode.

This contrasts with `ExitPlanMode` which returns `{ behavior: "ask", message: "Exit plan mode?" }` requiring user approval.

**Why asymmetric permissions:**
- Entering plan mode is safe (restricts capabilities), so no approval needed
- Exiting plan mode grants implementation rights, so user must explicitly approve
- This enforces the "Plan → Approve → Implement" safety guarantee

### UI: Result Message (`Gc4`)

```javascript
// ============================================
// Gc4 - EnterPlanMode result renderer
// Location: chunks.132.mjs:2768
// ============================================

// ORIGINAL (for source lookup):
function Gc4(A, q, K) {
    return sD.createElement(I, { flexDirection: "column", marginTop: 1 },
        sD.createElement(I, { flexDirection: "row" },
            sD.createElement(V, { color: D57.plan.color }, gY),  // ✓ checkmark in planMode color
            sD.createElement(V, null, " Entered plan mode")),
        sD.createElement(I, { paddingLeft: 2 },
            sD.createElement(V, { dimColor: !0 }, "Claude is now exploring and designing an implementation approach.")))
}
```

**Renders:**
```
✓ Entered plan mode
  Claude is now exploring and designing an implementation approach.
```

**Note:** The `Zc4` rejection renderer previously documented does NOT exist in the codebase. EnterPlanMode is auto-approved and never shows a rejection UI.

### Tool Result Injected into Conversation

After `call()`, `mapToolResultToToolResultBlockParam()` injects instructions into the API conversation as a `tool_result` block. Two variants:

**Standard workflow** (when `sO()` / `isPlanModeInterviewPhase` = false):
```
Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.
```

**Interview workflow** (when `sO()` = true):
```
Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.

DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.
```
(The detailed iterative instructions come in the next system reminder attachment)

---

## 5. ExitPlanMode Tool

### Tool Definition

```javascript
// ============================================
// ExitPlanModeTool - Full tool object
// Location: chunks.143.mjs:2802-3016
// ============================================

// ORIGINAL (for source lookup):
zD = {
    name: aJ,    // "ExitPlanMode"
    searchHint: "present plan for approval and start coding (plan mode only)",
    maxResultSizeChars: 1e5,
    async description() { return "Prompts the user to exit plan mode and start coding" },
    async prompt() { return Z1q },
    get inputSchema() { return E1q() },  // { allowedPrompts?: [...] }
    get outputSchema() { return AIY() }, // { plan, isAgent, filePath, hasTaskTool, awaitingLeaderApproval, requestId, isUltraplan }
    userFacingName() { return "" },
    shouldDefer: !0,
    isEnabled() { return !0 },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !1 },
    toAutoClassifierInput() { return "" },
    requiresUserInteraction() {
        if ($Y()) return !1;   // Teammates don't require user interaction
        return !0              // Main session always requires user interaction
    },
    async validateInput(A, { getAppState: q, options: K }) {
        if ($Y()) return { result: !0 };
        let Y = q().toolPermissionContext.mode;
        if (Y !== "plan") return {
            result: !1,
            message: "You are not in plan mode. This tool is only for exiting plan mode...",
            errorCode: 1
        };
        return { result: !0 }
    },
    async checkPermissions(A, q) {
        if ($Y()) return { behavior: "allow", updatedInput: A };  // Teammates auto-allowed
        return { behavior: "ask", message: "Exit plan mode?", updatedInput: A }  // User must approve
    },
    ...
}

// READABLE (for understanding):
ExitPlanModeTool = {
    name: "ExitPlanMode",
    searchHint: "present plan for approval and start coding (plan mode only)",
    maxResultSizeChars: 100000,

    async description() { return "Prompts the user to exit plan mode and start coding" },
    async prompt() { return exitPlanModePromptText },

    get inputSchema() {
        return z.object({
            allowedPrompts: z.array(z.object({
                tool: z.enum(["Bash"]),
                prompt: z.string()
            })).optional().describe("Prompt-based permissions needed to implement the plan")
        }).passthrough();
    },

    get outputSchema() {
        return z.object({
            plan: z.string().nullable(),
            isAgent: z.boolean(),
            filePath: z.string().optional(),
            hasTaskTool: z.boolean().optional(),
            awaitingLeaderApproval: z.boolean().optional(),
            requestId: z.string().optional(),
            isUltraplan: z.boolean().optional()
        });
    },

    userFacingName() { return "" },
    shouldDefer: true,
    isEnabled() { return true },
    isConcurrencySafe() { return true },
    isReadOnly() { return false },
    toAutoClassifierInput() { return "" },

    requiresUserInteraction() {
        // $Y() = isTeammate() - checks if running as swarm teammate
        if (isTeammate()) return false;   // Teammates use swarm approval protocol
        return true;                       // Main session needs user dialog
    },

    async validateInput(input, { getAppState, options }) {
        // Teammates always pass validation (swarm handles protocol)
        if (isTeammate()) return { result: true };

        let appState = getAppState();
        let currentMode = appState.toolPermissionContext.mode;

        // Must be in plan mode to exit it
        if (currentMode !== "plan") {
            trackEvent("tengu_exit_plan_mode_called_outside_plan", {
                model: options.mainLoopModel,
                mode: currentMode,
                hasExitedPlanModeInSession: hasExitedPlanMode()
            });
            return {
                result: false,
                message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.",
                errorCode: 1
            };
        }
        return { result: true };
    },

    async checkPermissions(input, toolUseContext) {
        // $Y() = isTeammate() - swarm teammates auto-allowed
        if (isTeammate()) {
            return { behavior: "allow", updatedInput: input };
        }
        // Main session requires user approval
        return { behavior: "ask", message: "Exit plan mode?", updatedInput: input };
    },

    renderToolUseMessage: G1q,
    renderToolUseProgressMessage: f1q,
    renderToolResultMessage: T1q,
    renderToolUseRejectedMessage: v1q,
    renderToolUseErrorMessage: N1q,
    // ... call() and mapToolResultToToolResultBlockParam() detailed below
};

// Mapping: zD→ExitPlanModeTool, aJ→"ExitPlanMode", E1q→inputSchema, AIY→outputSchema
// Mapping: $Y→isTeammate, Z1q→exitPlanModePromptText, nk6→hasExitedPlanMode
// Mapping: G1q→renderExitPlanModeMessage, f1q→renderExitPlanModeProgress, T1q→renderExitPlanModeResult
// Mapping: v1q→renderExitPlanModeRejected, N1q→renderExitPlanModeError
```

### Call Logic (Three Paths)

```javascript
// ============================================
// ExitPlanModeTool.call() - Complete implementation
// Location: chunks.143.mjs:2875-2959
// ============================================

// ORIGINAL (for source lookup):
async call(A, q) {
    let K = !!q.agentId,
        Y = Fj(q.agentId),
        z = sJ(q.agentId);

    // PATH A: Swarm teammate (isTeammate() && hasTeamConfig())
    if ($Y() && NF6()) {
        if (!z) throw Error(`No plan file found at ${Y}. Please write your plan to this file before calling ExitPlanMode.`);
        let H = i3() || "unknown",
            j = l5(),
            J = bZ6("plan_approval", ak(H, j || "default")),
            M = {
                type: "plan_approval_request",
                from: H,
                timestamp: new Date().toISOString(),
                planFilePath: Y,
                planContent: z,
                requestId: J
            };
        await x3("team-lead", { from: H, text: B6(M), timestamp: new Date().toISOString() }, j);
        let D = q.getAppState(),
            X = ik1(H, D);
        if (X) ag8(X, q.setAppState, !0);
        return { data: { plan: z, isAgent: !0, filePath: Y, awaitingLeaderApproval: !0, requestId: J } }
    }

    // PATH B/C: Standard (main session or non-plan-mode-required teammate)
    let _ = q.getAppState(),
        w = _.toolPermissionContext.prePlanMode === "ultraplan",
        O = null;

    // Auto-mode gate check
    {
        let H = _.toolPermissionContext.prePlanMode ?? "default",
            j = H === "ultraplan" ? "default" : H;
        if ((j === "auto" || !1) && !(sl6?.isAutoModeGateEnabled() ?? !1)) {
            let M = sl6?.getAutoModeUnavailableReason() ?? "circuit-breaker";
            O = sl6?.getAutoModeUnavailableNotification(M) ?? "auto mode unavailable",
            k(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${j} but gate is off (reason=${M}) — falling back to default on plan exit`, { level: "warn" })
        }
    }
    if (O) q.addNotification?.({ key: "auto-mode-gate-plan-exit-fallback", text: `plan exit → default · ${O}`, priority: "immediate", color: "warning", timeoutMs: 1e4 });

    q.setAppState((H) => {
        if (H.toolPermissionContext.mode !== "plan") return H;
        HV(!0), JS(!0);  // Set hasExitedPlanMode and needsPlanModeExitAttachment
        let j = H.toolPermissionContext.prePlanMode ?? "default",
            J = j === "ultraplan" ? "default" : j;
        {
            if ((J === "auto" || !1) && !(sl6?.isAutoModeGateEnabled() ?? !1)) J = "default";
            let X = J === "auto" || !1;
            if (tCY?.setAutoModeActive(X), j === "auto" && J !== "auto") MS(!0)  // needsAutoModeExitAttachment
        }
        let M = J !== "auto" ? sl6?.restoreDangerousPermissions(H.toolPermissionContext) ?? H.toolPermissionContext : H.toolPermissionContext;
        return {
            ...H,
            toolPermissionContext: { ...M, mode: J, prePlanMode: void 0 }
        }
    });

    let $ = E7() && q.options.tools.some((H) => z3(H, r4));  // hasTaskTool
    return { data: { plan: z, isAgent: K, filePath: Y, hasTaskTool: $ || void 0, isUltraplan: w || void 0 } }
}

// READABLE (for understanding):
async call(input, toolUseContext) {
    let isAgent = !!toolUseContext.agentId;
    let planFilePath = getPlanFilePath(toolUseContext.agentId);   // Fj()
    let planContent = getPlanContent(toolUseContext.agentId);     // sJ()

    // ============================================================
    // PATH A: Swarm teammate (isTeammate() && hasTeamConfig())
    // Teammates with plan_mode_required send approval request to team lead
    // ============================================================
    if (isTeammate() && hasTeamConfig()) {
        if (!planContent) {
            throw Error(`No plan file found at ${planFilePath}. Please write your plan to this file before calling ExitPlanMode.`);
        }

        let agentName = getAgentName();     // i3()
        let teamName = getTeamName();       // l5()
        let requestId = generateRequestId("plan_approval", hash(agentName, teamName));  // bZ6()

        let approvalRequest = {
            type: "plan_approval_request",
            from: agentName,
            timestamp: new Date().toISOString(),
            planFilePath,
            planContent,
            requestId
        };

        // Send to team-lead mailbox
        await writeToMailbox("team-lead", {
            from: agentName,
            text: JSON.stringify(approvalRequest),
            timestamp: new Date().toISOString()
        }, teamName);

        // Mark task as awaiting approval in TaskManager
        let appState = await toolUseContext.getAppState();
        let taskId = findTaskByAgentName(agentName, appState);
        if (taskId) setAwaitingPlanApproval(taskId, toolUseContext.setAppState, true);

        return {
            data: {
                plan: planContent,
                isAgent: true,
                filePath: planFilePath,
                awaitingLeaderApproval: true,
                requestId
            }
        };
    }

    // ============================================================
    // PATH B/C: Standard (main session or non-plan-mode-required teammate)
    // ============================================================
    let currentState = await toolUseContext.getAppState();
    let isUltraplan = currentState.toolPermissionContext.prePlanMode === "ultraplan";
    let autoModeFallbackNotification = null;

    // Auto-mode gate check - if prePlanMode was "auto" but auto-mode gate is disabled,
    // fall back to default mode instead
    {
        let prePlanMode = currentState.toolPermissionContext.prePlanMode ?? "default";
        let targetMode = prePlanMode === "ultraplan" ? "default" : prePlanMode;

        if (targetMode === "auto" && !isAutoModeGateEnabled()) {
            let reason = getAutoModeUnavailableReason() ?? "circuit-breaker";
            autoModeFallbackNotification = getAutoModeUnavailableNotification(reason) ?? "auto mode unavailable";
            logWarn(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${targetMode} but gate is off (reason=${reason}) — falling back to default on plan exit`);
        }
    }

    // Show notification if auto-mode was gated
    if (autoModeFallbackNotification) {
        toolUseContext.addNotification?.({
            key: "auto-mode-gate-plan-exit-fallback",
            text: `plan exit → default · ${autoModeFallbackNotification}`,
            priority: "immediate",
            color: "warning",
            timeoutMs: 10000
        });
    }

    // Update state: exit plan mode
    toolUseContext.setAppState((state) => {
        // Guard: only process if still in plan mode
        if (state.toolPermissionContext.mode !== "plan") return state;

        // Set exit flags
        setHasExitedPlanMode(true);              // HV(true)
        setNeedsPlanModeExitAttachment(true);    // JS(true)

        let prePlanMode = state.toolPermissionContext.prePlanMode ?? "default";
        let targetMode = prePlanMode === "ultraplan" ? "default" : prePlanMode;

        // Apply auto-mode gate
        if (targetMode === "auto" && !isAutoModeGateEnabled()) {
            targetMode = "default";
        }

        // Update auto-mode state
        let isAutoMode = targetMode === "auto";
        setAutoModeActive(isAutoMode);
        if (prePlanMode === "auto" && targetMode !== "auto") {
            setNeedsAutoModeExitAttachment(true);  // MS(true)
        }

        // Restore dangerous permissions if not staying in auto mode
        let permissionContext = targetMode !== "auto"
            ? restoreDangerousPermissions(state.toolPermissionContext) ?? state.toolPermissionContext
            : state.toolPermissionContext;

        return {
            ...state,
            toolPermissionContext: {
                ...permissionContext,
                mode: targetMode,          // Restore pre-plan mode
                prePlanMode: undefined     // Clear saved mode
            }
        };
    });

    let hasTaskTool = isTasksEnabled() && toolUseContext.options.tools.some(t => t.name === "Task");

    return {
        data: {
            plan: planContent,
            isAgent,
            filePath: planFilePath,
            hasTaskTool: hasTaskTool || undefined,
            isUltraplan: isUltraplan || undefined
        }
    };
}

// Mapping: Fj→getPlanFilePath, sJ→getPlanContent, $Y→isTeammate, NF6→hasTeamConfig
// Mapping: i3→getAgentName, l5→getTeamName, bZ6→generateRequestId, ak→hash
// Mapping: x3→writeToMailbox, B6→JSON.stringify, ik1→findTaskByAgentName, ag8→setAwaitingPlanApproval
// Mapping: HV→setHasExitedPlanMode, JS→setNeedsPlanModeExitAttachment, MS→setNeedsAutoModeExitAttachment
// Mapping: sl6→autoModeGate, tCY→autoModeState, E7→isTasksEnabled, z3→toolNameMatches, r4→TaskToolName
```

**Key architectural decisions:**

**Why auto-mode gate?**
The auto-mode gate (`sl6.isAutoModeGateEnabled()`) prevents the system from entering auto mode when:
- Circuit breaker is triggered (too many errors)
- Rate limiting is active
- System is in degraded state

When exiting plan mode, if the saved `prePlanMode` was `"auto"` but the gate is now closed, the system falls back to `"default"` mode instead. This prevents cascading failures in production.

**Why ultraplan → default?**
The `"ultraplan"` mode is a special variant used by remote sessions. When exiting plan mode after an ultraplan session, the mode always resets to `"default"` (not back to ultraplan), as the ultraplan context was specific to the planning phase.

### `mapToolResultToToolResultBlockParam` - LLM Feedback

After user approves, the tool result injected into the API conversation varies by path:

**Remote push path:**
```
Plan pushed to remote session. The URL is already displayed to the user, so do not repeat it.
```

**Swarm teammate awaiting approval:**
```
Your plan has been submitted to the team lead for approval.

Plan file: <path>

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval. Check your inbox for response.

Request ID: <id>
```

**Sub-agent (isAgent=true, standard):**
```
User has approved the plan. There is nothing else needed from you now. Please respond with "ok"
```

**Main session, empty plan:**
```
User has approved exiting plan mode. You can now proceed.
```

**Main session, plan exists:**
```
User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: <filePath>
You can refer back to it if needed during implementation.
[If Task tool available: "If this plan can be broken down into multiple independent tasks, consider using the TeamCreate tool to create a team and parallelize the work."]

## Approved Plan:
<planContent>
```

---

## 6. UI Rendering: Exit Plan Mode Result (`Kd4`)

```javascript
// ============================================
// Kd4 - ExitPlanMode result renderer (4 states)
// Location: chunks.139.mjs:2491
// ============================================

// READABLE (for understanding):
function renderExitPlanModeResult({ plan, filePath, pushToRemote, remoteSessionUrl, awaitingLeaderApproval }, { theme }) {
    let isEmpty = !plan || plan.trim() === "";
    let shortPath = filePath ? relativePath(filePath) : "";

    // State 1: Empty plan (no plan file written)
    if (isEmpty) return (
        <Box flexDirection="column" marginTop={1}>
            <Box flexDirection="row">
                <Text color={planModeColor}>✓</Text>
                <Text> Exited plan mode</Text>
            </Box>
        </Box>
    );

    // State 2: Remote push
    if (pushToRemote && remoteSessionUrl) return (
        <Box flexDirection="column" marginTop={1}>
            <Box flexDirection="row">
                <Text color={planModeColor}>✓</Text>
                <Text> Pushed plan to Claude Code on the web</Text>
            </Box>
            <Indent>
                <Text dim>This task is now running in the background.</Text>
                <Text dim>Monitor it with /tasks or at {remoteSessionUrl}</Text>
            </Indent>
        </Box>
    );

    // State 3: Awaiting swarm leader approval
    if (awaitingLeaderApproval) return (
        <Box flexDirection="column" marginTop={1}>
            <Box flexDirection="row">
                <Text color={planModeColor}>✓</Text>
                <Text> Plan submitted for team lead approval</Text>
            </Box>
            <Indent>
                <Text dim>Plan file: {shortPath}</Text>
                <Text dim>Waiting for team lead to review and approve...</Text>
            </Indent>
        </Box>
    );

    // State 4: User approved (normal path)
    return (
        <Box flexDirection="column" marginTop={1}>
            <Box flexDirection="row">
                <Text color={planModeColor}>✓</Text>
                <Text> User approved Claude's plan</Text>
            </Box>
            <Indent>
                <Text dim>Plan saved to: {shortPath} · /plan to edit</Text>
                <Markdown>{plan}</Markdown>
            </Indent>
        </Box>
    );
}
```

---

## 7. Plan Rejection UI (`Yd4` + `HX6`)

When user rejects the ExitPlanMode permission prompt:

```javascript
// ============================================
// Yd4 - ExitPlanMode rejection renderer
// Location: chunks.139.mjs:2550
// ============================================

// READABLE (for understanding):
function renderExitPlanModeRejected({ plan }, { theme }) {
    let planContent = plan ?? getPlanContent() ?? "No plan found";
    return (
        <Box flexDirection="column">
            <RejectedPlanViewer plan={planContent} />   {/* HX6 */}
        </Box>
    );
}

// ============================================
// HX6 - RejectedPlanViewer component
// Location: chunks.107.mjs:1153
// ============================================

// READABLE (for understanding):
function RejectedPlanViewer({ plan }) {
    return (
        <Indent>
            <Box flexDirection="column">
                <Text color="subtle">User rejected Claude's plan:</Text>
                <Box
                    borderStyle="round"
                    borderColor="planMode"    // planMode theme color
                    borderDimColor={true}
                    paddingX={1}
                    overflow="hidden"
                >
                    <Markdown>{plan}</Markdown>
                </Box>
            </Box>
        </Indent>
    );
}
```

**Renders:**
```
User rejected Claude's plan:
╭──────────────────────────────────────╮
│ ## Implementation Plan               │
│ 1. Step one...                       │
│ ...                                  │
╰──────────────────────────────────────╯
```
(Border in planMode theme color, dimmed)

---

## 8. System Reminder Injection

Plan mode instructions are injected as `system-reminder` attachments at every turn. Three reminder functions:

### `azz` - Dispatcher (chunks.173.mjs:525)

```javascript
function buildPlanModeReminder(params) {
    if (params.isSubAgent) return buildPlanModeSubagentReminder(params);   // q2z
    if (params.reminderType === "sparse") return buildPlanModeSparseReminder(params);  // A2z
    return buildFullPlanModeReminder(params);  // szz
}
```

### Full Reminder - Standard 5-Phase (`szz`, chunks.173.mjs:531)

Called when `reminderType === "full"` and `isPlanModeInterviewPhase() === false`.

Key parameters injected:
- `K = Dc4()` = `getPlanExploreAgentCount()` = always 3 (or env override)
- `q = Xc4()` = `getPlanDesignAgentCount()` = 1 (free/pro) or 3 (max/enterprise)

Content structure:
```
Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits...

## Plan File Info:
[A plan file already exists at <path>. / No plan file exists yet. You should create your plan at <path>...]
You should build your plan incrementally by writing to or editing this file...

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain comprehensive understanding...
1. Focus on understanding the user's request...
2. **Launch up to {K} explore agents IN PARALLEL** (single message, multiple tool calls)...
   - Use 1 agent when task is isolated...
   - Use multiple agents when scope is uncertain...
   - Quality over quantity - {K} agents maximum...

### Phase 2: Design
Goal: Design an implementation approach.
Launch plan agent(s) to design...
You can launch up to {q} agent(s) in parallel.
**Guidelines:**
- Default: Launch at least 1 Plan agent for most tasks
- Skip agents: Only for truly trivial tasks
{q>1 ? "- Multiple agents: Use up to {q} agents for complex tasks..." : ""}

### Phase 3: Review
Goal: Review plans from Phase 2...
1. Read critical files...
2. Ensure plans align with user's original request
3. Use AskUserQuestion to clarify remaining questions

### Phase 4: Final Plan
Goal: Write final plan to plan file...
- Begin with Context section...
- Include only recommended approach...
- Ensure concise but detailed enough...
- Include paths of critical files...
- Reference existing functions...
- Include verification section...

### Phase 5: Call ExitPlanMode
At the very end of your turn... call ExitPlanMode to indicate to the user that you are done planning.
This is critical - your turn should only end with either AskUserQuestion OR ExitPlanMode.

**Important:** Use AskUserQuestion ONLY to clarify requirements... Use ExitPlanMode to request plan approval.
```

### Full Reminder - Interview Phase (`ezz`, chunks.173.mjs:619)

> Deep analysis: [interview_phase.md §3](./interview_phase.md) — full reminder text, `tzz()` tool list computation, comparison with standard mode

Called when `isPlanModeInterviewPhase() === true` (`sO()` = feature flag / env var `CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE`). More conversational:

```
Plan mode is active...

## Iterative Planning Workflow

You are pair-planning with the user. Explore the code to build context, ask the user questions...

### The Loop
Repeat this cycle until the plan is complete:
1. **Explore** — Use Glob, Grep, Read, LS to read code...
2. **Update the plan file** — After each discovery, immediately capture what you learned...
3. **Ask the user** — When you hit an ambiguity... use AskUserQuestion...

### First Turn
Start by quickly scanning a few key files... write a skeleton plan (headers and rough notes) and ask first questions...

### Asking Good Questions
- Never ask what you could find out by reading the code
- Batch related questions together
- Focus on things only the user can answer...

### Plan File Structure
[structure requirements]

### When to Converge
Your plan is ready when... Call ExitPlanMode when ready.

### Ending Your Turn
Your turn should only end by either:
- Using AskUserQuestion to gather more information
- Calling ExitPlanMode when the plan is ready for approval
```

### Sparse Reminder (`A2z`, chunks.173.mjs:676)

```javascript
function buildPlanModeSparseReminder({ planFilePath }) {
    let workflowHint = isPlanModeInterviewPhase()
        ? "Follow iterative workflow: explore codebase, interview user, write to plan incrementally."
        : "Follow 5-phase workflow.";
    let content = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${planFilePath}). ${workflowHint} End turns with AskUserQuestion (for clarifications) or ExitPlanMode (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
    return wrapAsSystemReminder([createAttachment({ content, isMeta: true })]);
}
```

**~100 tokens** vs ~1000 for full reminder.

### Subagent Reminder (`q2z`, chunks.173.mjs:685)

```
Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools...

## Plan File Info:
[plan file path info]

You should build your plan incrementally...
Answer the user's query comprehensively, using the AskUserQuestion tool if you need to ask clarifying questions.
```

**Simpler than main session** — no multi-phase workflow (subagents have a focused single task).

---

## 9. Reminder Scheduling

### Constants (`t4q`, chunks.147.mjs:1235)

```javascript
// ============================================
// PLAN_MODE_ATTACHMENT_CONFIG - Turn throttling constants
// Location: chunks.147.mjs:1235-1237
// ============================================

// ORIGINAL (for source lookup):
t4q = {
    TURNS_BETWEEN_ATTACHMENTS: 5,       // Skip attachment if <5 turns since last plan_mode attachment
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5 // Full reminder every 5th attachment, others sparse
}

// READABLE (for understanding):
const PLAN_MODE_ATTACHMENT_CONFIG = {
    // How many assistant turns must pass before injecting another plan_mode reminder
    // Prevents spamming the LLM with reminders every turn
    TURNS_BETWEEN_ATTACHMENTS: 5,

    // How often to inject the FULL reminder vs the sparse reminder
    // Full reminder = ~1000 tokens with complete workflow instructions
    // Sparse reminder = ~100 tokens with brief reminder
    // Every 1st, 6th, 11th... attachment is full, others are sparse
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
};

// Mapping: t4q→PLAN_MODE_ATTACHMENT_CONFIG
```

**Why these values?**

- **TURNS_BETWEEN_ATTACHMENTS: 5** — The LLM typically needs 3-5 turns to make meaningful progress on planning tasks. Injecting reminders more frequently would be wasteful and could disrupt the planning flow. The 5-turn window gives the LLM enough time to:
  1. Read relevant files
  2. Understand the codebase structure
  3. Formulate initial plan ideas
  4. Write to the plan file

- **FULL_REMINDER_EVERY_N_ATTACHMENTS: 5** — After ~25 turns (5 attachments × 5 turns each), the LLM may have drifted from the original instructions or forgotten key workflow steps. The full reminder re-injects the complete 5-phase workflow, ensuring:
  - The LLM remembers to use agents for exploration
  - The AskUserQuestion vs ExitPlanMode distinction is clear
  - The plan file structure requirements are fresh

### `DuY` - Plan Mode Attachment Generator (chunks.147.mjs:136)

```javascript
// ============================================
// DuY - getPlanModeAttachment
// Location: chunks.147.mjs:136-168
// ============================================

// ORIGINAL (for source lookup):
async function DuY(A, q) {
    let Y = q.getAppState().toolPermissionContext;
    if (Y.mode !== "plan") return [];
    if (A && A.length > 0) {
        let { turnCount: H, foundPlanModeAttachment: j } = JuY(A);
        if (j && H < t4q.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    let z = Fj(q.agentId),
        _ = sJ(q.agentId),
        w = [];
    if (Y.prePlanMode === "ultraplan") return w.push({
        type: "plan_mode",
        reminderType: "ultraplan-complete",
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: _ !== null
    }), w;
    if (nk6() && _ !== null) w.push({
        type: "plan_mode_reentry",
        planFilePath: z
    }), HV(!1);
    let $ = (MuY(A ?? []) + 1) % t4q.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return w.push({
        type: "plan_mode",
        reminderType: $,
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: _ !== null
    }), w
}

// READABLE (for understanding):
async function getPlanModeAttachment(conversationHistory, toolUseContext) {
    // Guard: only inject if currently in plan mode
    let permContext = await toolUseContext.getAppState().toolPermissionContext;
    if (permContext.mode !== "plan") return [];

    // Throttling: skip if recently reminded (within TURNS_BETWEEN_ATTACHMENTS)
    if (conversationHistory && conversationHistory.length > 0) {
        let { turnCount, foundPlanModeAttachment } = countTurnsSinceLastAttachment(conversationHistory);
        if (foundPlanModeAttachment && turnCount < PLAN_MODE_ATTACHMENT_CONFIG.TURNS_BETWEEN_ATTACHMENTS) {
            return [];  // Skip - too soon since last reminder
        }
    }

    let planFilePath = getPlanFilePath(toolUseContext.agentId);
    let planContent = getPlanContent(toolUseContext.agentId);
    let attachments = [];

    // Special case: ultraplan mode (remote planning sessions)
    if (permContext.prePlanMode === "ultraplan") {
        attachments.push({
            type: "plan_mode",
            reminderType: "ultraplan-complete",  // Special reminder type
            isSubAgent: !!toolUseContext.agentId,
            planFilePath,
            planExists: planContent !== null
        });
        return attachments;
    }

    // Plan re-entry: if user exited plan mode before and is re-entering
    if (hasExitedPlanMode() && planContent !== null) {
        attachments.push({
            type: "plan_mode_reentry",
            planFilePath
        });
        setHasExitedPlanMode(false);  // Clear the flag
    }

    // Determine reminder type: full vs sparse
    // Count plan_mode attachments since last plan_mode_exit
    let attachmentCount = countPlanModeAttachmentsSinceLastExit(conversationHistory ?? []);
    let reminderType = (attachmentCount + 1) % PLAN_MODE_ATTACHMENT_CONFIG.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
        ? "full"
        : "sparse";
    // Formula: (count+1) % 5 === 1 means: 1st→full, 2nd-5th→sparse, 6th→full, etc.

    attachments.push({
        type: "plan_mode",
        reminderType,
        isSubAgent: !!toolUseContext.agentId,
        planFilePath,
        planExists: planContent !== null
    });

    return attachments;
}

// Mapping: DuY→getPlanModeAttachment, JuY→countTurnsSinceLastAttachment, MuY→countPlanModeAttachmentsSinceLastExit
// Mapping: Fj→getPlanFilePath, sJ→getPlanContent, nk6→hasExitedPlanMode, HV→setHasExitedPlanMode
// Mapping: t4q→PLAN_MODE_ATTACHMENT_CONFIG
```

### Plan Mode Re-entry Flow

When user was previously in plan mode (ran ExitPlanMode) and enters again:

1. `ihY()` detects `hasExitedPlanMode() === true` AND `planContent !== null`
2. Prepends `plan_mode_reentry` attachment
3. Clears `hasExitedPlanMode` flag
4. The reentry attachment renders in the system reminder:

```
## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at <path> from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ExitPlanMode

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.
```

### Plan Mode Exit Attachment (`XuY`, chunks.147.mjs:170)

After ExitPlanMode succeeds, the next turn's attachment dispatch generates a `plan_mode_exit` attachment:

```javascript
// ============================================
// XuY - getPlanModeExitAttachment
// Location: chunks.147.mjs:170-181
// ============================================

// ORIGINAL (for source lookup):
async function XuY(A) {
    if (!Fu1()) return [];
    if (A.getAppState().toolPermissionContext.mode === "plan") {
        JS(!1);
        return [];  // Still in plan mode (plan was rejected by user) - don't emit exit
    }
    JS(!1);
    let K = Fj(A.agentId),
        Y = sJ(A.agentId) !== null;
    return [{
        type: "plan_mode_exit",
        planFilePath: K,
        planExists: Y
    }]
}

// READABLE (for understanding):
async function getPlanModeExitAttachment(toolUseContext) {
    // Guard: only emit if flag is set
    if (!needsPlanModeExitAttachment()) return [];

    // Edge case: user rejected the ExitPlanMode dialog
    // The mode is still "plan", so don't emit exit attachment
    if ((await toolUseContext.getAppState()).toolPermissionContext.mode === "plan") {
        setNeedsPlanModeExitAttachment(false);
        return [];  // Stayed in plan mode - no exit attachment
    }

    // Clear the flag (one-shot behavior)
    setNeedsPlanModeExitAttachment(false);

    let planFilePath = getPlanFilePath(toolUseContext.agentId);
    let planExists = getPlanContent(toolUseContext.agentId) !== null;

    return [{
        type: "plan_mode_exit",
        planFilePath,
        planExists
    }];
}

// Mapping: XuY→getPlanModeExitAttachment, Fu1→needsPlanModeExitAttachment, JS→setNeedsPlanModeExitAttachment
// Mapping: Fj→getPlanFilePath, sJ→getPlanContent
```

**Key design insight:** The `needsPlanModeExitAttachment` flag is set during `ExitPlanMode.call()` (via `JS(true)`), but the actual attachment is generated on the *next* turn. This ensures:

1. The exit attachment appears in the *next* API call's system reminders
2. The LLM sees both the tool result ("User approved your plan...") AND the exit reminder
3. If the user rejects the dialog, the flag is cleared without emitting the exit attachment

The `plan_mode_exit` attachment renders:
```
## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions.
[If plan exists: "The plan file is located at <path> if you need to reference it."]
```

### `mapToolResultToToolResultBlockParam` - LLM Feedback (chunks.143.mjs:2961-3015)

After user approves, the tool result injected into the API conversation varies by path:

```javascript
// ============================================
// ExitPlanMode.mapToolResultToToolResultBlockParam - Complete implementation
// Location: chunks.143.mjs:2961-3015
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam({
    isAgent: A,
    plan: q,
    filePath: K,
    hasTaskTool: Y,
    awaitingLeaderApproval: z,
    requestId: _,
    isUltraplan: w
}, O) {
    if (z) return {
        type: "tool_result",
        content: `Your plan has been submitted to the team lead for approval.\n\nPlan file: ${K}\n\n**What happens next:**\n1. Wait for the team lead to review your plan\n2. You will receive a message in your inbox with approval/rejection\n3. If approved, you can proceed with implementation\n4. If rejected, refine your plan based on the feedback\n\n**Important:** Do NOT proceed until you receive approval. Check your inbox for response.\n\nRequest ID: ${_}`,
        tool_use_id: O
    };
    if (A) return {
        type: "tool_result",
        content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
        tool_use_id: O
    };
    if (!q || q.trim() === "") return {
        type: "tool_result",
        content: "User has approved exiting plan mode. You can now proceed.",
        tool_use_id: O
    };
    if (w) return {
        type: "tool_result",
        content: "User has reviewed the ultraplan. There is nothing else to do. Respond with a brief summary of the plan.",
        tool_use_id: O
    };
    let $ = Y ? `\n\nIf this plan can be broken down into multiple independent tasks, consider using the ${SI} tool to create a team and parallelize the work.` : "";
    return {
        type: "tool_result",
        content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable\n\nYour plan has been saved to: ${K}\nYou can refer back to it if needed during implementation.${$}\n\n## Approved Plan:\n${q}`,
        tool_use_id: O
    }
}

// READABLE (for understanding):
mapToolResultToToolResultBlockParam(result, toolUseId) {
    let { isAgent, plan, filePath, hasTaskTool, awaitingLeaderApproval, requestId, isUltraplan } = result;

    // Case 1: Swarm teammate awaiting leader approval
    if (awaitingLeaderApproval) {
        return {
            type: "tool_result",
            content: `Your plan has been submitted to the team lead for approval.

Plan file: ${filePath}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval. Check your inbox for response.

Request ID: ${requestId}`,
            tool_use_id: toolUseId
        };
    }

    // Case 2: Sub-agent (standard path, approved by main session)
    if (isAgent) {
        return {
            type: "tool_result",
            content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
            tool_use_id: toolUseId
        };
    }

    // Case 3: Empty plan (no plan file written)
    if (!plan || plan.trim() === "") {
        return {
            type: "tool_result",
            content: "User has approved exiting plan mode. You can now proceed.",
            tool_use_id: toolUseId
        };
    }

    // Case 4: Ultraplan (remote planning session)
    if (isUltraplan) {
        return {
            type: "tool_result",
            content: "User has reviewed the ultraplan. There is nothing else to do. Respond with a brief summary of the plan.",
            tool_use_id: toolUseId
        };
    }

    // Case 5: Normal plan approval (main session)
    let taskHint = hasTaskTool
        ? `\n\nIf this plan can be broken down into multiple independent tasks, consider using the Task tool to create a team and parallelize the work.`
        : "";

    return {
        type: "tool_result",
        content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${filePath}
You can refer back to it if needed during implementation.${taskHint}

## Approved Plan:
${plan}`,
        tool_use_id: toolUseId
    };
}

// Mapping: SI→TaskToolName
```

**Why different responses per case?**

| Case | Response Purpose |
|------|-----------------|
| Swarm awaiting | Instruct teammate to wait, explain mailbox protocol, provide requestId for tracking |
| Sub-agent approved | Simple acknowledgment - sub-agents have focused tasks, just need to know they can proceed |
| Empty plan | No plan content to show, just confirm exit |
| Ultraplan | Different UX - user reviewed externally, just summarize |
| Normal approval | Full plan content with hints about Task tool for parallelization |

---

## 10. Tool Restriction Sets

From `chunks.89.mjs:876`:

```javascript
// ============================================
// Tool Sets for Mode Restrictions
// Location: chunks.89.mjs:876
// ============================================

// Tools blocked from hook execution (cannot be called via hooks)
Bj1 = new Set(["TaskOutput", "ExitPlanMode", "EnterPlanMode", "Task", "AskUserQuestion", "StatusLineTool"]);

// Delegate mode: only these tools allowed
R_6 = new Set(["TeamCreate", "TeamDelete", "SendMessage", "TaskCreate", "TaskGet", "TaskList", "TaskUpdate", "Task"]);
```

**Plan mode restrictions** are enforced via system prompt instructions (the agent is told not to use write tools), not by a hard blocklist in the tool filter. The exception is that `Write` and `Edit` tool calls to the **plan file path** are permitted.

The `HOOK_BLOCKED_TOOLS` set (`Bj1`) prevents hooks from calling `EnterPlanMode` or `ExitPlanMode`, which prevents external manipulation of plan mode via hooks.

---

## 11. Plan File Management

### `getPlanFilePath` (`uW`, chunks.146.mjs:2702)

Computes path:
```
<claude-data-dir>/<sessionId>/session-memory/<slug>.md
```

The slug is derived from the agent ID (if subagent) or session context.

### `getPlanContent` (`pD`, chunks.146.mjs:2700)

Reads plan file from disk, returns `null` if not found.

**Key design**: `ExitPlanMode` does NOT accept plan content as a parameter. It reads from the file. This prevents LLM from showing a different plan than what was written to disk.

### During Compaction (`collectPlanToKeep`, `mE1`, chunks.147.mjs:1885)

When conversation is compacted, the plan file content is included in the preserved context:
```javascript
// plan_file_reference attachment injected after compaction:
{
    type: "plan_file_reference",
    planFilePath: <path>,
    planContent: <file content>
}
```

This ensures the LLM never loses awareness of the plan even across compaction boundaries.

---

## 12. Attachment Processing Pipeline

All attachments flow through `normalizeAttachmentForAPI()` in `chunks.173.mjs`, which renders them as system reminder messages for the API call:

```javascript
// In chunks.173.mjs switch statement:
case "plan_mode":        return azz(A);          // → full/sparse/subagent reminder
case "plan_mode_reentry": return [...];            // → re-entry instructions
case "plan_mode_exit":   return [...];             // → exit confirmation
case "plan_file_reference": return [...];          // → plan file content after compaction
case "verify_plan_reminder": return [];            // Currently stubbed out (SIY returns [])
```

---

## 13. Spawn-Time `plan_mode_required` Propagation

When a team leader spawns a teammate with `plan_mode_required: true`, the flag propagates through the spawn pipeline to ensure the spawned process boots in plan mode.

### Source: Three Ways to Set `plan_mode_required`

**`isPlanModeRequired()` (`MC1`, chunks.48.mjs:301)**

```javascript
// ============================================
// isPlanModeRequired - Read plan_mode_required from three sources
// Location: chunks.48.mjs:301
// ============================================

// ORIGINAL (for source lookup):
function MC1() {
    let A = PL();
    if (A) return A.planModeRequired;
    if (zv !== null) return zv.planModeRequired;
    return process.env.CLAUDE_CODE_PLAN_MODE_REQUIRED === "true"
}

// READABLE (for understanding):
function isPlanModeRequired() {
    let dynamicCtx = getDynamicTeammateContext();
    if (dynamicCtx) return dynamicCtx.planModeRequired;          // (1) Active override
    if (staticCtx !== null) return staticCtx.planModeRequired;  // (2) Static config
    return process.env.CLAUDE_CODE_PLAN_MODE_REQUIRED === "true" // (3) Env var
}

// Mapping: MC1→isPlanModeRequired, A→dynamicCtx, zv→staticCtx
```

**Priority order for reading `planModeRequired`:**
1. **Dynamic context** (`PL()`) — active agent context override (set at runtime)
2. **Static context** (`zv`) — configured at teammate spawn time
3. **Env var** — `CLAUDE_CODE_PLAN_MODE_REQUIRED=true` (global override for all teammates)

**Three ways a teammate gets `plan_mode_required: true`:**
1. **Via Task tool** (`chunks.132.mjs:147`): `plan_mode_required: mode === "plan"` — the Task tool's `mode` parameter accepts `"plan"` string, converted to boolean flag
2. **Via TeamCreateTool agent definition** (`chunks.131.mjs:373`): `planModeRequired: q.planModeRequired` — propagated from agent definition config
3. **Via CLI** (`chunks.189.mjs:1084`): `--plan-mode-required` flag passed to subprocess, applied to dynamic team context

---

### CLI Arg Building: `buildPermissionCliArgs()` (`Au4`, chunks.131.mjs:847)

```javascript
// ============================================
// buildPermissionCliArgs - Build permission-related CLI args for spawned process
// Location: chunks.131.mjs:847
// ============================================

// ORIGINAL (for source lookup):
function Au4(A) {
    let q = [], { planModeRequired: K, permissionMode: Y } = A || {};
    if (K);
    else if (Y === "bypassPermissions" || HQ()) q.push("--dangerously-skip-permissions");
    else if (Y === "acceptEdits") q.push("--permission-mode acceptEdits");
    let z = HT();
    if (z) q.push(`--model ${R7([z])}`);
    let w = Il();
    if (w) q.push(`--settings ${R7([w])}`);
    let H = $61();
    for (let O of H) q.push(`--plugin-dir ${R7([O])}`);
    let $ = bQ1();
    return q.push(`--teammate-mode ${$}`), q.join(" ")
}

// READABLE (for understanding):
function buildPermissionCliArgs({ planModeRequired, permissionMode }) {
    let args = [];

    // KEY INSIGHT: If planModeRequired, skip ALL permission bypass flags.
    // The spawned process must boot normally (no --dangerously-skip-permissions)
    // so that it starts in default mode, then plan_mode_required is handled separately.
    if (planModeRequired) {
        // No permission flags added
    } else if (permissionMode === "bypassPermissions" || isBypassMode()) {
        args.push("--dangerously-skip-permissions");
    } else if (permissionMode === "acceptEdits") {
        args.push("--permission-mode acceptEdits");
    }

    let model = getCurrentModel();
    if (model) args.push(`--model ${shellEscape([model])}`);
    let settingsFile = getSettingsFile();
    if (settingsFile) args.push(`--settings ${shellEscape([settingsFile])}`);
    let pluginDirs = getPluginDirs();
    for (let dir of pluginDirs) args.push(`--plugin-dir ${shellEscape([dir])}`);
    let teammateMode = getTeammateMode();
    args.push(`--teammate-mode ${teammateMode}`);
    return args.join(" ");
}

// Mapping: Au4→buildPermissionCliArgs, K→planModeRequired, Y→permissionMode
```

**Key insight**: When `planModeRequired=true`, the function deliberately omits all permission bypass flags. This ensures the spawned teammate process starts without elevated permissions, then the `--plan-mode-required` identity flag (added separately in the spawn command) puts it in plan mode.

---

### Subprocess Spawn: `PaneBackendExecutor.spawn()` (`Ku4`, chunks.131.mjs:887)

```javascript
// ============================================
// PaneBackendExecutor.spawn - Spawn a tmux pane subprocess for a teammate
// Location: chunks.131.mjs:903
// ============================================

// ORIGINAL (for source lookup):
$ = [`--agent-id ${R7([q])}`, `--agent-name ${R7([A.name])}`, `--team-name ${R7([A.teamName])}`,
    `--agent-color ${R7([K])}`, `--parent-session-id ${R7([A.parentSessionId||U6()])}`,
    A.planModeRequired ? "--plan-mode-required" : ""].filter(Boolean).join(" "),
_ = Au4({ planModeRequired: A.planModeRequired, permissionMode: O.toolPermissionContext.mode });
let M = `cd ${R7([X])} && ${j} ${R7([H])} ${$}${_}`;

// READABLE (for understanding):
let identityArgs = [
    `--agent-id ${shellEscape([agentId])}`,
    `--agent-name ${shellEscape([config.name])}`,
    `--team-name ${shellEscape([config.teamName])}`,
    `--agent-color ${shellEscape([color])}`,
    `--parent-session-id ${shellEscape([config.parentSessionId || getSessionId()])}`,
    config.planModeRequired ? "--plan-mode-required" : ""  // ← plan mode flag
].filter(Boolean).join(" ");

let permissionArgs = buildPermissionCliArgs({
    planModeRequired: config.planModeRequired,
    permissionMode: appState.toolPermissionContext.mode
});

let spawnCommand = `cd ${shellEscape([cwd])} && CLAUDECODE=1 ${shellEscape([execPath])} ${identityArgs} ${permissionArgs}`;

// Mapping: $→identityArgs, _→permissionArgs, M→spawnCommand
```

**Two separate arg groups:**
- **Identity args**: `--plan-mode-required` is in the identity group (who this agent is)
- **Permission args**: `buildPermissionCliArgs()` skips bypass flags when planModeRequired

---

### In-Process Teammate: `initializeInProcessTeammate()` (`hu4`, chunks.131.mjs:2305)

For in-process teammates (running in the same Node.js process via threading), there are no CLI args. The `permissionMode` is set directly:

```javascript
// ============================================
// initializeInProcessTeammate - Initialize in-process teammate state
// Location: chunks.131.mjs:2305
// ============================================

// ORIGINAL (for source lookup):
function hu4(A, { teammateId: q, sanitizedName: K, teamName: Y, teammateColor: z,
    prompt: w, plan_mode_required: H, paneId: $, insideTmux: O }) {
    let _ = hp("in_process_teammate"), D = {
        ...IZ(_, "in_process_teammate", J), type: "in_process_teammate", status: "running",
        identity: { agentId: q, agentName: K, teamName: Y, color: z,
            planModeRequired: H ?? !1, parentSessionId: U6() },
        prompt: w, abortController: X, awaitingPlanApproval: !1,
        permissionMode: H ? "plan" : "default",   // ← direct mode assignment
        isIdle: !1, shutdownRequested: !1, ...
    };
    bZ(D, A)
}

// READABLE (for understanding):
function initializeInProcessTeammate(setAppState, {
    teammateId, sanitizedName, teamName, teammateColor,
    prompt, plan_mode_required, paneId, insideTmux
}) {
    let taskId = generateTaskId("in_process_teammate");
    let taskRecord = {
        ...createBaseTask(taskId, "in_process_teammate", description),
        type: "in_process_teammate",
        status: "running",
        identity: {
            agentId: teammateId, agentName: sanitizedName, teamName, color: teammateColor,
            planModeRequired: plan_mode_required ?? false,
            parentSessionId: getSessionId()
        },
        prompt,
        abortController: new AbortController(),
        awaitingPlanApproval: false,
        permissionMode: plan_mode_required ? "plan" : "default",  // Direct assignment
        isIdle: false,
        shutdownRequested: false,
        lastReportedToolCount: 0, lastReportedTokenCount: 0,
        pendingUserMessages: []
    };
    addTask(taskRecord, setAppState);
}

// Mapping: hu4→initializeInProcessTeammate, H→plan_mode_required
```

**Key insight for in-process teammates**: There's no subprocess boot sequence. The task record is created directly with `permissionMode: plan_mode_required ? "plan" : "default"`. When the in-process teammate's agent loop starts, it reads `permissionMode` from the task record and uses `"plan"` as its initial mode.

---

### Complete spawn-time plan_mode_required flow:

```
Leader spawns teammate with plan_mode_required=true
    │
    ├─ Via Task tool (chunks.132.mjs):
    │   mode="plan" → plan_mode_required: true
    │   → Iu4({name, prompt, plan_mode_required: true})
    │
    ├─ Subprocess spawn (tmux/splitpane backend):
    │   identity_args += "--plan-mode-required"
    │   permission_args = buildPermissionCliArgs({planModeRequired: true})
    │       → No --dangerously-skip-permissions added
    │   Spawn: claude --agent-id X --agent-name Y --plan-mode-required [no bypass flags]
    │   Child process boots → reads --plan-mode-required via CLI parser
    │   → sets CLAUDE_CODE_PLAN_MODE_REQUIRED or dynamic team context
    │   → isPlanModeRequired() returns true
    │   → MC1() returns true in ExitPlanMode.checkPermissions()
    │   → ExitPlanMode uses swarm approval path (not user dialog)
    │
    └─ In-process spawn:
        hu4(setAppState, {plan_mode_required: true})
        → taskRecord.permissionMode = "plan"
        → in-process agent loop starts in plan mode
        → awaitingPlanApproval = false initially
        → ExitPlanMode() also checks MC1() → true → swarm approval path
```

---

## 14. Configuration

```javascript
// Plan Design Agent Count (chunks.140.mjs:1455)
function getPlanDesignAgentCount() {
    // Env override: CLAUDE_CODE_PLAN_V2_AGENT_COUNT (1-10)
    if (process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT) { ... }

    let plan = getPlan(), tier = getSubscriptionTier();
    if (plan === "max" && tier === "default_claude_max_20x") return 3;
    if (plan === "enterprise" || plan === "team") return 3;
    return 1;  // free/pro
}

// Plan Explore Agent Count (chunks.140.mjs:1467)
function getPlanExploreAgentCount() {
    // Env override: CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT (1-10)
    if (process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT) { ... }
    return 3;  // Always 3 for all tiers
}

// Interview Phase Feature Flag (chunks.140.mjs:1475)
function isPlanModeInterviewPhase() {
    let envVar = process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE;
    if (isTrue(envVar)) return true;
    if (isFalse(envVar)) return false;
    return featureFlag("tengu_plan_mode_interview_phase", false);
}

// Plan Mode Required for Teammates (chunks.48.mjs:301)
// Force all teammate instances into plan_mode_required=true
// CLAUDE_CODE_PLAN_MODE_REQUIRED=true
// → isPlanModeRequired() reads this as third fallback
// → Teammate ExitPlanMode skips user dialog, uses swarm approval path
```

### Summary: Environment Variables

| Variable | Effect | Default |
|----------|--------|---------|
| `CLAUDE_CODE_PLAN_V2_AGENT_COUNT` | Override design agent count (1-10) | Tier-based (1 or 3) |
| `CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT` | Override explore agent count (1-10) | 3 |
| `CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE` | Force enable/disable interview phase workflow | Feature flag |
| `CLAUDE_CODE_PLAN_MODE_REQUIRED` | Force all teammates into plan_mode_required | `false` |

---

## 15. Other UX Effects

### Prompt Suggestion Blocking (`EhA`, chunks.151.mjs:149)

While in plan mode, the inline prompt suggestion system is disabled:

```javascript
// ============================================
// getPromptSuggestionBlocker - Check if prompt suggestions should be suppressed
// Location: chunks.151.mjs:149
// ============================================

// ORIGINAL (for source lookup):
function EhA(A) {
    if (!A.promptSuggestionEnabled) return "disabled";
    if (A.pendingWorkerRequest || A.pendingSandboxRequest) return "pending_permission";
    if (A.elicitation.queue.length > 0) return "elicitation_active";
    if (A.toolPermissionContext.mode === "plan") return "plan_mode";
    if (Pv.status !== "allowed") return "rate_limit";
    return null
}

// READABLE (for understanding):
function getPromptSuggestionBlocker(appState) {
    if (!appState.promptSuggestionEnabled) return "disabled";
    if (appState.pendingWorkerRequest || appState.pendingSandboxRequest) return "pending_permission";
    if (appState.elicitation.queue.length > 0) return "elicitation_active";
    if (appState.toolPermissionContext.mode === "plan") return "plan_mode";  // ← suppressed in plan mode
    if (rateLimiter.status !== "allowed") return "rate_limit";
    return null  // null = suggestions enabled
}

// Mapping: EhA→getPromptSuggestionBlocker, A→appState
```

**Why suppress prompt suggestions in plan mode?**

Plan mode is a deliberate, focused workflow where the LLM follows a structured 5-phase process. Inline prompt suggestions (autocomplete, command suggestions) would interfere with this structured flow. The blocker returns `"plan_mode"` which the caller (`Y6q`) checks to suppress suggestion generation and record the reason via telemetry (`uI("plan_mode")`).

---

## 16. Help Tips & Discoverability

From `chunks.176.mjs`, the help tip system teaches users about plan mode:

```javascript
// Help tip: "plan-mode-for-complex-tasks" (shown after 7 days without use)
{
    id: "plan-mode-for-complex-tasks",
    content: `Use Plan Mode to prepare for a complex request before making changes. Press ${cycleMode keybinding} twice to enable.`,
    isRelevant: (settings) =>
        (Date.now() - settings.lastPlanModeUse) / 86400000 > 7  // >7 days since last use
}

// Help tip: "shift+tab cycles modes"
{
    content: `Hit ${cycleMode keybinding} to cycle between default mode, auto-accept edit mode, and plan mode`
}

// Help tip: "opusplan-mode-reminder" (for Opus plan model users)
{
    id: "opusplan-mode-reminder",
    content: `Your default model setting is Opus Plan Mode. Press ${cycleMode keybinding} twice to activate Plan Mode and plan with Claude Opus.`,
    isRelevant: (settings) => {
        let isOpusPlan = getDefaultModel() === "opusplan";
        let daysSinceUse = settings.lastPlanModeUse ? ... : Infinity;
        return isOpusPlan && daysSinceUse > 7;
    }
}
```

---

## 18. ExitPlanMode Dialog — Full Option Set (`aPq`, chunks.181.mjs:405)

The ExitPlanMode permission dialog (`aPq`) is a multi-option selection UI with two fundamentally different execution paths depending on whether "clear context" is chosen.

### Two Dialog Variants

**Variant 1: Empty Plan (no plan file)**

When `getPlanContent()` returns null (`T = !N || N.trim() === ""`), a simplified Yes/No dialog appears:

```
╭──────────────────────────────────────╮  ← planMode border color
│ Exit plan mode?                      │
╰──────────────────────────────────────╯
  Claude wants to exit plan mode

  ► Yes
    No
```

- "Yes" → `A.onAllow({}, [{type: "setMode", mode: "default", destination: "session"}])` with `HV(!0)`, `JS(!0)` (telemetry: `outcome: "yes-default"`)
- "No" / Esc → `A.onReject()`

Rendered at `chunks.181.mjs:721-761`. Mode always resets to `"default"` (not prePlanMode) when there's no plan.

**Variant 2: Full Plan (plan exists) — "Ready to code?"**

```
╭──────────────────────────────────────╮  ← planMode border color
│ Ready to code?                       │
╰──────────────────────────────────────╯
  Here is Claude's plan:
  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌   ← dashed border top/bottom, no left/right
  ## Implementation Plan
  1. Modify auth/handler.js at line 45...
  2. Add JWT validation middleware...
  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌

  [Requested permissions: (if allowedPrompts non-empty)]
  · BashTool (run tests, install dependencies)
  · EditTool (modify source files)

  Claude has written up a plan and is ready to execute. Would you like to proceed?

  ► Yes, clear context and auto-accept edits (shift+tab)   [value: "yes-accept-edits"]
    Yes, auto-accept edits                                  [value: "yes-accept-edits-keep-context"]
    Yes, manually approve edits                             [value: "yes-default-keep-context"]
    No, keep planning [____________________________________][value: "no"]
                       Type here to tell Claude what to change

  ctrl-g to edit in vim · .claude/sessions/plan-abc123.md  ← dimmed footer hint (if editor set)
  ✓ Plan saved!                                             ← success indicator (after ctrl-g edit)
```

If `isBypassPermissionsModeAvailable` (user has bypass-permissions access), the option list changes:

```
  ► Yes, clear context and bypass permissions               [value: "yes-bypass-permissions"]
    Yes, and bypass permissions                             [value: "yes-accept-edits-keep-context" → bypassPermissions mode]
    Yes, manually approve edits                             [value: "yes-default-keep-context"]
    No, keep planning [____________________________________]
```

**Important**: When `isBypassPermissionsModeAvailable`, "yes-accept-edits-keep-context" maps to `"bypassPermissions"` mode (not `"acceptEdits"`):
```javascript
// chunks.181.mjs:617-619
let A1 = {
    "yes-accept-edits-keep-context": z.isBypassPermissionsModeAvailable ? "bypassPermissions" : "acceptEdits",
    "yes-default-keep-context": "default"
}[D1];
```

Rendered at `chunks.181.mjs:763-848`.

### Option Value Table

```javascript
// ============================================
// aPq - ExitPlanMode dialog option list
// Location: chunks.181.mjs:802-819
// ============================================

// ORIGINAL (for source lookup):
options: [...z.isBypassPermissionsModeAvailable ? [{
    label: "Yes, clear context and bypass permissions",
    value: "yes-bypass-permissions"
}] : [{
    label: "Yes, clear context and auto-accept edits (shift+tab)",
    value: "yes-accept-edits"
}], ...[], {
    label: z.isBypassPermissionsModeAvailable ? "Yes, and bypass permissions" : "Yes, auto-accept edits",
    value: "yes-accept-edits-keep-context"
}, {
    label: "Yes, manually approve edits",
    value: "yes-default-keep-context"
}, {
    type: "input",
    label: "No, keep planning",
    value: "no",
    placeholder: "Type here to tell Claude what to change"
}]

// READABLE (for understanding):
[
    // Slot 1: "clear context" variant (depends on bypass-permissions availability)
    isBypassPermissionsModeAvailable
        ? { label: "Yes, clear context and bypass permissions", value: "yes-bypass-permissions" }
        : { label: "Yes, clear context and auto-accept edits (shift+tab)", value: "yes-accept-edits" },

    // Slot 2: "keep context, elevated mode"
    {
        label: isBypassPermissionsModeAvailable ? "Yes, and bypass permissions" : "Yes, auto-accept edits",
        value: "yes-accept-edits-keep-context"
    },

    // Slot 3: "keep context, default mode"
    { label: "Yes, manually approve edits", value: "yes-default-keep-context" },

    // Slot 4: "stay in plan mode" (text input)
    { type: "input", label: "No, keep planning", value: "no",
      placeholder: "Type here to tell Claude what to change" }
]

// Mapping: z→dialogProps
```

### Shift+Tab Shortcut in Dialog

While the ExitPlanMode dialog is focused, pressing Shift+Tab **directly selects** the first option without navigating the list:

```javascript
// ============================================
// aPq keyboard handler — Shift+Tab shortcut
// Location: chunks.181.mjs:496-498
// ============================================

// ORIGINAL (for source lookup):
if (Z1.shift && Z1.tab) { q1("yes-accept-edits"); return }

// READABLE (for understanding):
if (keyEvent.shift && keyEvent.tab) {
    handleOptionSelected("yes-accept-edits");
    return;  // Stop further key handling
}

// Mapping: Z1→keyEvent, q1→handleOptionSelected
```

**Why this design**: The option label explicitly mentions `(shift+tab)` — "Yes, clear context and auto-accept edits (shift+tab)". This creates a fast-path for experienced users: one Shift+Tab press exits plan mode and immediately switches to auto-accept edits mode with a fresh context. The keyboard shortcut is consistent with the mode cycle binding used everywhere else (status bar hint, help tips).

### Handler: `q1(D1)` — option selection dispatcher (chunks.181.mjs:574)

```javascript
// ============================================
// handleOptionSelected - ExitPlanMode dialog option selection handler
// Location: chunks.181.mjs:574
// ============================================

// ORIGINAL (for source lookup):
async function q1(D1) {
    // [0] "push to remote" path (currently dead code — not in option list)
    if (D1 === "yes-push-to-remote") { N1(); return }

    let Z1 = W ? {} : { plan: k };  // W = (A.tool.name === "ExitPlanMode")

    // [PATH A] "Clear context" branch — catches anything EXCEPT "no", "yes-accept-edits-keep-context", "yes-default-keep-context"
    if (D1 !== "no" && !(D1 === "yes-accept-edits-keep-context" || D1 === "yes-default-keep-context")) {
        let Y1 = "default";
        if (D1 === "yes-bypass-permissions") Y1 = "bypassPermissions";
        else if (D1 === "yes-accept-edits") Y1 = "acceptEdits";
        let _1 = "",
            G1 = `\n\nIf you need specific details from before exiting plan mode... read the full transcript at: ${a$(U6())}`,
            L1 = l8() ? `\n\nIf this plan can be broken down into multiple independent tasks, consider using the ${vh} tool...` : "";
        w((x1) => ({
            ...x1,
            initialMessage: {
                message: { ...c6({ content: `Implement the following plan:\n\n${k}${_1}${G1}${L1}` }), planContent: k },
                clearContext: !0, mode: Y1, allowedPrompts: Z
            }
        }));
        HV(!0), q(), K(), A.onReject();  // REJECTS the ExitPlanMode tool call
        return
    }

    // [PATH B] "Keep context" branch — handles "yes-accept-edits-keep-context", "yes-default-keep-context"
    let A1 = {
        "yes-accept-edits-keep-context": z.isBypassPermissionsModeAvailable ? "bypassPermissions" : "acceptEdits",
        "yes-default-keep-context": "default"
    }[D1];
    if (A1) {
        HV(!0), JS(!0), q(), A.onAllow(Z1, Rc1(A1, Z));  // APPROVES the ExitPlanMode tool call
        return
    }

    // [PATH C] Dead code — "yes-bypass-permissions"/"yes-accept-edits" with onAllow
    // UNREACHABLE: caught by PATH A first. Leftover from pre-refactor flow.
    let z1 = { "yes-bypass-permissions": "bypassPermissions", "yes-accept-edits": "acceptEdits" }[D1];
    if (z1) { HV(!0), JS(!0), q(), A.onAllow(Z1, Rc1(z1, Z)); return }

    // [PATH D] "no" — send feedback text/image
    if (D1 === "no") {
        let Y1 = $.trim();
        if (!Y1 && !P) return;
        // ...collect images, then:
        q(), K(), A.onReject(Y1 || "(See attached image)", images)
    }
}

// READABLE (for understanding):
async function handleOptionSelected(selectedValue) {
    // [0] Push-to-remote path — NOT in dialog option list (dead UI code, handler exists)
    if (selectedValue === "yes-push-to-remote") {
        checkRemoteEligibilityAndPush();  // N1()
        return;
    }

    let planSnapshot = isExitPlanModeTool ? {} : { plan: planContent };  // W = (tool === "ExitPlanMode")

    // [PATH A] "Clear context" — for "yes-accept-edits" and "yes-bypass-permissions"
    // Condition: any value that is NOT "no", "yes-accept-edits-keep-context", "yes-default-keep-context"
    if (selectedValue !== "no"
        && selectedValue !== "yes-accept-edits-keep-context"
        && selectedValue !== "yes-default-keep-context") {

        let targetMode = selectedValue === "yes-bypass-permissions" ? "bypassPermissions"
                       : selectedValue === "yes-accept-edits"       ? "acceptEdits"
                       : "default";  // fallback

        // Compose message text:
        // _1 = "" (reserved/empty)
        // G1 = transcript hint (obfuscated: G1): "If you need specific details... read transcript at: {path}"
        // L1 = team hint (obfuscated: L1): "If this can be parallelized, use the Task tool..." (only if l8() = isTeamLeader)
        let transcriptPathHint = `\n\nIf you need specific details from before exiting plan mode... read the full transcript at: ${getTranscriptPath(getSessionId())}`;
        let teamHint = isTeamLeader() ? `\n\nIf this plan can be broken down into multiple independent tasks, consider using the Task tool...` : "";

        setAppState((state) => ({
            ...state,
            initialMessage: {
                message: {
                    ...buildUserMessage({ content: `Implement the following plan:\n\n${planContent}${transcriptPathHint}${teamHint}` }),
                    planContent: planContent  // k = plan TEXT (used as truthy check in REPL for slug preservation)
                },
                clearContext: true,
                mode: targetMode,
                allowedPrompts: allowedPrompts  // Z = A.input.allowedPrompts
            }
        }));
        setHasExitedPlanMode(true);     // HV(true)
        closeDialog();                  // q()
        clearPendingPermission();       // K()
        permissionCallbacks.onReject(); // A.onReject() ← REJECTS the ExitPlanMode tool call
        return;
    }

    // [PATH B] "Keep context" — for "yes-accept-edits-keep-context" / "yes-default-keep-context"
    let keepContextTargetMode = {
        "yes-accept-edits-keep-context": isBypassPermissionsModeAvailable ? "bypassPermissions" : "acceptEdits",
        "yes-default-keep-context": "default"
    }[selectedValue];

    if (keepContextTargetMode) {
        setHasExitedPlanMode(true);                // HV(true)
        setNeedsPlanModeExitAttachment(true);       // JS(true)
        closeDialog();                             // q()
        permissionCallbacks.onAllow(             // A.onAllow() ← APPROVES the ExitPlanMode tool call
            keyEvent,
            buildPermissionContext(keepContextTargetMode, allowedPrompts)
        );
        return;
    }

    // [PATH C] *** DEAD CODE — unreachable ***
    // "yes-bypass-permissions" and "yes-accept-edits" are caught by PATH A first.
    // Leftover from original onAllow() flow before clear-context refactor.
    let deadCodeMode = { "yes-bypass-permissions": "bypassPermissions", "yes-accept-edits": "acceptEdits" }[selectedValue];
    if (deadCodeMode) {
        setHasExitedPlanMode(true); setNeedsPlanModeExitAttachment(true);
        closeDialog();
        permissionCallbacks.onAllow(keyEvent, buildPermissionContext(deadCodeMode, allowedPrompts));
        return;
    }

    // [PATH D] "no" — feedback text + optional image paste
    if (selectedValue === "no") {
        let feedbackText = feedbackInputValue.trim();
        if (!feedbackText && !hasPastedImages) return;  // Nothing to send
        closeDialog(); clearPendingPermission();
        permissionCallbacks.onReject(feedbackText || "(See attached image)", uploadedImages);
    }
}

// Mapping: q1→handleOptionSelected, D1→selectedValue, w→setAppState, Y1→targetMode
//          W→isExitPlanModeTool, k→planContent (TEXT), Z→allowedPrompts
//          G1→transcriptPathHint, L1→teamHint, _1→"" (empty reserved)
//          HV→setHasExitedPlanMode, JS→setNeedsPlanModeExitAttachment
//          q→closeDialog, K→clearPendingPermission, A→permissionCallbacks
//          c6→buildUserMessage, Z1→keyEvent/planSnapshot, Rc1→buildPermissionContext
//          A1→keepContextTargetMode, z1→deadCodeMode, N1→checkRemoteEligibilityAndPush
//          a$→getTranscriptPath, U6→getSessionId, l8→isTeamLeader, vh→TaskToolName
//          $→feedbackInputValue, P→hasPastedImages
```

### Critical Architectural Split: Reject vs Allow

**This is the key insight**: The two "clear context" options **REJECT** the ExitPlanMode tool call rather than approving it. The flow diverges at the permission dialog:

```
Option selected                    ExitPlanMode tool call
─────────────────────────────────────────────────────────
yes-accept-edits           →  onReject() + set initialMessage{clearContext:true}
yes-bypass-permissions     →  onReject() + set initialMessage{clearContext:true}
yes-accept-edits-keep-context →  onAllow() → call() executes → normal ExitPlanMode result
yes-default-keep-context   →  onAllow() → call() executes → normal ExitPlanMode result
no                         →  dialog closes, stays in plan mode
```

**Why reject?** The "clear context" path needs to completely clear the conversation history, which means the LLM's current session (including the ExitPlanMode tool result) will be wiped. Approving `onAllow()` would execute `ExitPlanMode.call()` which saves state to the conversation. Instead:
1. `onReject()` is called to dismiss the tool call without executing it
2. `initialMessage` is set in app state with `clearContext: true`
3. The REPL component detects `initialMessage` and runs `clearConversation()` + fires the plan as a new user message

---

## 19. Clear Context Flow — Complete Implementation

When user selects "Yes, clear context and auto-accept edits", the following sequence executes:

### Phase 1: Dialog → REPL (initialMessage handoff)

```
User selects "yes-accept-edits"
    │
    ├─ setAppState({ initialMessage: {
    │       message: { content: "Implement the following plan:\n\n{plan}", planContent: {slug} },
    │       clearContext: true,
    │       mode: "acceptEdits",
    │       allowedPrompts: [...]
    │   }})
    │
    ├─ setHasExitedPlanMode(true)         [HV(true)]
    ├─ closeDialog()                      [q()]
    ├─ clearPendingPermission()           [K()]
    └─ permissionCallbacks.onReject()     [A.onReject()]
         └─ ExitPlanMode UI: renders Yd4 (rejection card with plan in planMode border)
            (this UI will be wiped in the next step anyway)
```

### Phase 2: REPL detects initialMessage (chunks.188.mjs:627)

```javascript
// ============================================
// REPL initialMessage useEffect handler
// Location: chunks.188.mjs:627-684
// ============================================

// ORIGINAL (for source lookup):
// useEffect(() => {
//   if (!FA || X4) return;  // FA=initialMessage, X4=isLoading
//   (async () => {
//     let X4;
//     if (FA.clearContext) {
//       let X4 = FA.message.planContent ? Rj1() : void 0,
//           { clearConversation: p7 } = await Promise.resolve().then(...)
//       if (await p7({...}), X4) n0A(U6(), X4)
//     }
//     A1(X4 => ({...X4, initialMessage: null,
//         toolPermissionContext: FA.mode ? WV(...) : X4.toolPermissionContext}))
//     ff([FA.message], X4, !0, [], Y1, void 0)
//   })()
// }, [FA, X4])

// READABLE (for understanding):
useEffect(() => {
    if (!initialMessage || isAgentLoading) return;  // Wait for agent to be idle

    (async () => {
        let planSlugToPreserve;

        if (initialMessage.clearContext) {
            // Step 1: Capture plan slug BEFORE clearing (so new session can find the plan file)
            // initialMessage.message.planContent = plan TEXT (truthy check only — actual slug comes from Rj1())
            planSlugToPreserve = initialMessage.message.planContent
                ? getPlanFileSlug()  // Rj1() — captures current session's plan slug
                : undefined;

            // Step 2: Run the full session clear
            const { clearConversation } = await import("./clearConversation");
            await clearConversation({
                setMessages,
                readFileState: readFileStateRef.current,
                getAppState,
                setAppState,
                setConversationId
            });

            // Step 3: Re-register slug in NEW session (so /plan and getPlanContent still work)
            if (planSlugToPreserve) {
                registerPlanFileSlug(getSessionId(), planSlugToPreserve);  // n0A(U6(), planSlugToPreserve)
            }
        }

        // Step 4: Clear initialMessage from state + set the new mode
        setAppState((state) => ({
            ...state,
            initialMessage: null,
            toolPermissionContext: initialMessage.mode
                ? applyPermissionAction(state.toolPermissionContext, buildPermissionContext(initialMessage.mode, initialMessage.allowedPrompts))
                : state.toolPermissionContext
        }));

        // Step 5: Fire the LLM with the plan as user message
        submitToLLM([initialMessage.message], planSlugToPreserve, true, [], subscriptionTier, undefined);
    })();
}, [initialMessage, isAgentLoading]);

// Mapping: FA→initialMessage, X4→isAgentLoading/planSlugToPreserve
//          Rj1→getPlanFileSlug, p7→clearConversation, n0A→registerPlanFileSlug
//          U6→getSessionId, A1→setAppState, WV→applyPermissionAction
//          Rc1→buildPermissionContext, ff→submitToLLM, Y1→subscriptionTier
```

### Phase 3: `clearConversation()` — Full 11-Step Implementation (`GIA`, chunks.152.mjs:1438)

This is the core of "clear context". It completely resets the session:

```javascript
// ============================================
// clearConversation - Complete session reset
// Location: chunks.152.mjs:1438
// ============================================

// ORIGINAL (for source lookup):
async function GIA({ setMessages: A, readFileState: q, getAppState: K, setAppState: Y, setConversationId: z }) {
    await _yA("clear", { getAppState: K, setAppState: Y });  // [1] SessionEnd hooks
    A(() => []);                                               // [2] Clear message history
    if (z) z(miY());                                           // [3] New UUID
    PIA();                                                     // [4] clearSessionCaches
    lZ(y8());                                                  // [5] Reset session path
    q.clear();                                                 // [6] Clear file read state
    Y((H) => ({                                                // [7] Reset appState fields
        ...H,
        fileHistory: { snapshots: [], trackedFiles: new Set() },
        mcp: { clients: [], tools: [], commands: [], resources: {} }
    }));
    dU7();                                                     // [8] Delete OLD plan slug
    DL6({ setCurrentAsParent: true });                         // [9] New session ID
    await Hy();                                                // [10] Re-init session
    let w = await PP("clear");                                 // [11] SessionStart hooks
    if (w.length > 0) A(() => w)
}

// READABLE (for understanding):
async function clearConversation({ setMessages, readFileState, getAppState, setAppState, setConversationId }) {
    // [1] Run "clear" SessionEnd hooks (e.g., notify plugins the session is ending)
    await runSessionHooks("clear", { getAppState, setAppState });

    // [2] Clear all message history (conversation turns, tool results, etc.)
    setMessages(() => []);

    // [3] Generate a new conversation UUID for the UI
    if (setConversationId) setConversationId(generateUUID());

    // [4] Clear all session-level caches:
    //     - i$.cache (model response cache)
    //     - l$.cache (file content cache)
    //     - rMA.cache (tool use cache)
    //     - I_.cache (misc cache)
    //     - Code indexing, telemetry session data, etc.
    clearSessionCaches();  // PIA()

    // [5] Reset session working directory to project root
    //     y8() = getProjectDirectory()
    //     lZ() = setSessionPath()
    setSessionPath(getProjectDirectory());

    // [6] Clear the read file state (tracks which files have been opened)
    readFileState.clear();

    // [7] Reset file history and MCP client state in React appState
    setAppState((state) => ({
        ...state,
        fileHistory: { snapshots: [], trackedFiles: new Set() },
        mcp: { clients: [], tools: [], commands: [], resources: {} }
    }));

    // [8] Delete the plan file slug for the OLD session
    //     (IMPORTANT: done BEFORE DL6 creates new session ID)
    clearPlanFileSlug();  // dU7()

    // [9] Create new session ID; save old session ID as parentSessionId
    //     This establishes the parent-child relationship for session tracking
    createNewSessionId({ setCurrentAsParent: true });  // DL6({setCurrentAsParent: true})

    // [10] Re-initialize session: reload settings, project config, CLAUDE.md
    await reinitializeSession();  // Hy()

    // [11] Run "clear" SessionStart plugin hooks
    //      (e.g., greeting plugins, initial context injection)
    let startHookMessages = await runPluginHooks("clear");  // PP("clear")
    if (startHookMessages.length > 0) setMessages(() => startHookMessages);
}

// Mapping: GIA→clearConversation, _yA→runSessionHooks, miY→generateUUID, PIA→clearSessionCaches
//          lZ→setSessionPath, y8→getProjectDirectory, dU7→clearPlanFileSlug
//          DL6→createNewSessionId, Hy→reinitializeSession, PP→runPluginHooks
```

### Step-by-Step Explanation

**[1] SessionEnd hooks** (`_yA("clear", ...)`): Runs all registered `SessionEnd` hooks with event type `"clear"`. This lets plugins/hooks perform cleanup before the session state is wiped. The `"clear"` event type distinguishes this from a normal app exit.

**[2] Clear message history** (`setMessages(() => [])`): Immediately empties the React state for all conversation messages. The UI updates to show a blank conversation.

**[3] New conversation UUID** (`setConversationId(generateUUID())`): Generates a fresh UUID for the UI conversation ID. This is different from the session ID — it's used by the UI layer for React key tracking.

**[4] `clearSessionCaches()` (`PIA`, chunks.152.mjs:1421)**: Clears all session-scoped caches:

```javascript
// ============================================
// clearSessionCaches - Wipe all session-level caches
// Location: chunks.152.mjs:1421
// ============================================

// ORIGINAL (for source lookup):
function PIA() {
    i$.cache.clear?.(), l$.cache.clear?.(), rMA.cache.clear?.(), I_.cache.clear?.(),
    FAq(), bm(), rd(), uL7(), HR6(), fn7(null), bf6()
}

// READABLE (for understanding):
function clearSessionCaches() {
    // 4 explicit cache clears (using .clear() method):
    cache_i$.clear?.();    // i$ — likely model/LLM response cache
    cache_l$.clear?.();    // l$ — likely file content cache
    cache_rMA.clear?.();   // rMA — likely tool result / permission cache
    cache_I_.clear?.();    // I_ — likely miscellaneous cache

    // 7 subsystem reset functions:
    FAq();           // (e.g., code indexing session reset)
    bm();            // (e.g., telemetry session counters reset)
    rd();            // (e.g., LSP or language server state reset)
    uL7();           // (e.g., shell parser / command history reset)
    HR6();           // (e.g., file watching state reset)
    fn7(null);       // (e.g., some context handle reset, passed null)
    bf6();           // (e.g., background job/task state reset)
}
// Note: The ?.() pattern means .clear() is called only if the method exists (optional chaining)
```

**[5] Reset session path**: Resets the working directory to the project root. During a long session, tools like `cd` or `Bash` may change the working directory. This ensures the new session starts from a clean cwd.

**[6] Clear file read state**: The `readFileState` ref tracks which files the agent has read (for the `Read` tool's "you must read before edit" guards). Clearing it means the new session starts as if no files have been opened.

**[7] Reset fileHistory + MCP state**:
- `fileHistory.snapshots` + `trackedFiles`: Used by the Rewind system to track file changes. Reset prevents old snapshots from leaking into the new session.
- `mcp.clients/tools/commands/resources`: MCP (Model Context Protocol) connections are reset. New session re-establishes MCP connections from scratch during `reinitializeSession()`.

**[8] `clearPlanFileSlug()` (`dU7`, chunks.88.mjs:98)**: Deletes the plan file slug mapping for the **current** (old) session. The plan slug maps `sessionId → slug` (e.g., `"abc123" → "plan-2024-01"`), used to find the plan file path. This is deleted BEFORE step [9] creates a new session ID.

```javascript
// dU7 - Delete plan file slug for session
function clearPlanFileSlug(sessionId?) {
    let sid = sessionId ?? getSessionId();
    getPlanSlugMap().delete(sid);
}
```

**[9] `createNewSessionId({ setCurrentAsParent: true })` (`DL6`, chunks.1.mjs:2429)**:

```javascript
// ============================================
// createNewSessionId - Create new session UUID, optionally save old as parent
// Location: chunks.1.mjs:2429
// ============================================

// ORIGINAL (for source lookup):
function DL6(A = {}) {
    if (A.setCurrentAsParent) o6.parentSessionId = o6.sessionId;
    return o6.sessionId = pcA(), o6.resumedTranscriptPath = null, o6.sessionId
}

// READABLE (for understanding):
function createNewSessionId({ setCurrentAsParent } = {}) {
    if (setCurrentAsParent) {
        globalSessionState.parentSessionId = globalSessionState.sessionId;  // Save old as parent
    }
    globalSessionState.sessionId = generateUUID();         // pcA() = uuid v4
    globalSessionState.resumedTranscriptPath = null;       // ← also clears resumed transcript path
    return globalSessionState.sessionId;
}

// Mapping: DL6→createNewSessionId, o6→globalSessionState, pcA→generateUUID
```

**Why `setCurrentAsParent: true`?** The old session ID is preserved as `parentSessionId`. This establishes a parent→child session relationship that:
- Allows remote sessions to track conversation lineage
- Enables the `/tasks` command to link related sessions
- Preserves telemetry continuity (the new session knows its origin)

**Why reset `resumedTranscriptPath = null`?** If the current session was resumed from a transcript file (`--resume` flag), `resumedTranscriptPath` points to that file. After clearing, the new session starts fresh — it has no transcript to resume from, so this path is nulled out.

**[10] `reinitializeSession()` (`Hy`)**: Reloads all session-level configuration:
- `settings.json` (user preferences)
- `CLAUDE.md` (project instructions)
- `mcp.json` (MCP server config)
- Project context (git status, directory listing)

**[11] SessionStart plugin hooks** (`PP("clear")`): Runs registered `SessionStart` hooks with event type `"clear"`. Hooks that inject initial context (e.g., greeting messages, project summaries) execute here. Their output messages replace the empty message list if non-empty.

### Phase 4: Plan Slug Preservation

After `clearConversation()`, the new session needs to find the same plan file:

```javascript
// After clearConversation() returns:
if (planSlugToPreserve) {
    registerPlanFileSlug(getSessionId(), planSlugToPreserve);
    // n0A(U6(), X4)
    // getSessionId() = NEW session ID (created in step [9])
    // planSlugToPreserve = OLD session's slug (captured before clear)
    // Result: newSessionId → same slug → same plan file path
}
```

**Why this is necessary:**

```
Before clear:
  Session:  "abc123"
  Plan slug: "abc123" → "plan-2024-01-15-a7f3"
  Plan file: .claude/sessions/plan-2024-01-15-a7f3.md

After clear (without preservation):
  Session:  "xyz789"   (new ID from DL6)
  Plan slug: "xyz789" → undefined   ← dU7() deleted "abc123"'s mapping, "xyz789" has none
  Plan file: NOT FOUND

After clear (with preservation):
  Session:  "xyz789"
  Plan slug: "xyz789" → "plan-2024-01-15-a7f3"   ← n0A() re-registers same slug
  Plan file: .claude/sessions/plan-2024-01-15-a7f3.md   ← FOUND
```

The REPL checks `initialMessage.message.planContent` (the plan file slug) to decide whether to capture+preserve. If the plan content was `null` (no plan file exists), no slug preservation is needed.

### Phase 5: Mode Transition + LLM Submit

```javascript
// After clearConversation + slug re-registration:
setAppState((state) => ({
    ...state,
    initialMessage: null,                 // Clear the trigger
    toolPermissionContext: applyPermissionAction(
        state.toolPermissionContext,
        buildPermissionContext("acceptEdits", allowedPrompts)
    )
    // toolPermissionContext.mode is now "acceptEdits"
    // Status bar: ⏵⏵ accept edits on
}));

// Fire the LLM with the plan as the first user message
submitToLLM(
    [{ content: "Implement the following plan:\n\n{plan}", planContent: slug }],
    planSlugToPreserve,   // context hint
    true,                 // isNewConversation
    [],                   // no existing messages
    subscriptionTier,
    undefined
);
```

The LLM receives:
```
User: Implement the following plan:

## Plan Title
1. Step one...
2. Step two...
...
```

With `mode: "acceptEdits"`, all subsequent file edits are auto-accepted without user confirmation.

### Complete Clear Context Flow Diagram

```
User selects "Yes, clear context and auto-accept edits" (or Shift+Tab)
    │
    ├─ [Dialog] Capture plan slug: Rj1() → "plan-2024-01-15-a7f3"
    ├─ [Dialog] setAppState({ initialMessage: { clearContext: true, mode: "acceptEdits", ... } })
    ├─ [Dialog] onReject() → ExitPlanMode tool call dismissed
    │
    ↓ React re-render
    │
    ├─ [REPL] useEffect detects initialMessage + isAgentLoading=false
    │
    ├─ [REPL] clearConversation():
    │   ├─ [1] SessionEnd hooks ("clear")
    │   ├─ [2] setMessages([])          → UI: blank conversation
    │   ├─ [3] setConversationId(uuid)  → new UI conversation ID
    │   ├─ [4] clearSessionCaches()     → all caches wiped
    │   ├─ [5] setSessionPath(projectRoot)
    │   ├─ [6] readFileState.clear()
    │   ├─ [7] fileHistory reset, MCP reset
    │   ├─ [8] clearPlanFileSlug("abc123")  → old slug removed
    │   ├─ [9] createNewSessionId({setCurrentAsParent: true})
    │   │       → parentSessionId = "abc123"
    │   │       → sessionId = "xyz789" (new)
    │   ├─ [10] reinitializeSession()   → reload settings, CLAUDE.md, etc.
    │   └─ [11] SessionStart hooks ("clear")
    │
    ├─ [REPL] registerPlanFileSlug("xyz789", "plan-2024-01-15-a7f3")
    │         → new session can still find plan file
    │
    ├─ [REPL] setAppState({ mode: "acceptEdits", initialMessage: null })
    │         → Status bar: ⏵⏵ accept edits on
    │
    └─ [REPL] submitToLLM(["Implement the following plan:\n\n{plan}"])
              → LLM starts implementing in acceptEdits mode
              → All file edits auto-accepted
```

### Context Usage Percentage (`mcA`, chunks.1.mjs:2291)

The "57% used" text the user sees in the status bar is computed by `getContextUsagePercentage`:

```javascript
// ============================================
// getContextUsagePercentage - Compute context window utilization
// Location: chunks.1.mjs:2291
// ============================================

// ORIGINAL (for source lookup):
function mcA(A, q) {
    if (!A) return { used: null, remaining: null };
    let K = A.input_tokens + A.cache_creation_input_tokens + A.cache_read_input_tokens,
        Y = Math.round(K / q * 100),
        z = Math.min(100, Math.max(0, Y));
    return { used: z, remaining: 100 - z }
}

// READABLE (for understanding):
function getContextUsagePercentage(usage, contextWindowSize) {
    if (!usage) return { used: null, remaining: null };

    // Sum all token types that consume context window space:
    // - input_tokens: plain user/assistant tokens
    // - cache_creation_input_tokens: tokens written to cache (still consume space)
    // - cache_read_input_tokens: tokens read from cache (re-using cached content)
    let totalTokensUsed = usage.input_tokens
        + usage.cache_creation_input_tokens
        + usage.cache_read_input_tokens;

    let rawPercentage = Math.round(totalTokensUsed / contextWindowSize * 100);
    let clampedPercentage = Math.min(100, Math.max(0, rawPercentage));

    return {
        used: clampedPercentage,        // e.g., 57 (for "57% used")
        remaining: 100 - clampedPercentage
    };
}

// Mapping: mcA→getContextUsagePercentage, A→usage, q→contextWindowSize
//          K→totalTokensUsed, Y→rawPercentage, z→clampedPercentage
```

This value is assembled into the status line by `Zjz` (`chunks.183.mjs:2910`):

```javascript
statusLineData.context_window = {
    used_percentage: getContextUsagePercentage(lastApiUsage, modelContextWindowSize).used
}
```

**Note**: The percentage shown in the status bar is **not in the option label itself**. The option label is static text: `"Yes, clear context and auto-accept edits (shift+tab)"`. The "57% used" is displayed separately in the footer/status bar and users mentally associate it with the option because the dialog appears on top of the status bar.

---

## 17. Complete Data Flow Summary

```
User triggers plan mode (Shift+Tab OR LLM calls EnterPlanMode)
    │
    ├─ Via Shift+Tab (UI)
    │   ├── hf1() computes next mode → "plan"
    │   ├── Dp(currentMode, "plan") → sets needsPlanModeExitAttachment=false
    │   ├── Records lastPlanModeUse in settings
    │   └── Updates AppState: mode="plan"
    │
    └─ Via EnterPlanMode tool (LLM)
        ├── checkPermissions() → { behavior: "allow" } (no user prompt)
        ├── call():
        │   ├── Guard: agentId must be null
        │   ├── Dp(currentMode, "plan") → sets flags
        │   ├── a2(permCtx, { type: "setMode", mode: "plan" }) → updates ctx
        │   └── Saves prePlanMode = currentMode
        ├── UI renders: "✓ Entered plan mode"
        └── mapToolResultToToolResultBlockParam() injects instructions into API

Plan Mode Active
    │
    ├─ Status bar shows: ⏸ plan mode on (shift+tab)
    │
    ├─ Each turn: ihY() checks mode → generates plan_mode attachment
    │   ├── Throttle: skip if <5 turns since last attachment
    │   ├── Re-entry: if hasExitedPlanMode, prepend plan_mode_reentry attachment
    │   └── Full vs sparse: full on 1st/6th/11th..., sparse otherwise
    │
    └─ System reminder injected: full 5-phase / iterative / sparse / subagent

LLM writes plan to plan file
    │
    └─ pD() reads plan file content (returned by ExitPlanMode)

LLM calls ExitPlanMode
    │
    ├─ requiresUserInteraction() → true (main session)
    ├─ checkPermissions() → { behavior: "ask", message: "Exit plan mode?" }
    │
    ├─ User APPROVES
    │   ├── call():
    │   │   ├── HV(true) → hasExitedPlanMode = true
    │   │   ├── JS(true) → needsPlanModeExitAttachment = true
    │   │   ├── Restores mode = prePlanMode ?? "default"
    │   │   └── Returns { plan, filePath, hasTaskTool, ... }
    │   ├── UI renders: "✓ User approved Claude's plan" + plan content
    │   └── Next turn: nhY() detects needsPlanModeExitAttachment → injects plan_mode_exit
    │
    └─ User REJECTS
        ├── Stays in plan mode (no state change)
        └── UI renders: HX6 → "User rejected Claude's plan:" + plan in planMode border
```

---

## 20. Tool Schemas

### EnterPlanMode Schema

**Input Schema:** Empty (no parameters required)

```javascript
// ============================================
// EnterPlanModeTool inputSchema
// Location: chunks.140.mjs:1649
// ============================================

// ORIGINAL (for source lookup):
get inputSchema() { return dCY() }

// dCY() returns z7(() => strictObject({}))  // No input params

// READABLE (for understanding):
{
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false
}
```

**Output Schema:**

```javascript
// ============================================
// EnterPlanModeTool outputSchema
// Location: chunks.140.mjs:1649
// ============================================

// ORIGINAL (for source lookup):
get outputSchema() { return cCY() }

// cCY() returns z7(() => z.object({ message: z.string() }))

// READABLE (for understanding):
{
    type: "object",
    properties: {
        message: { type: "string" }
    },
    required: ["message"]
}
```

**Why no input parameters?**
- EnterPlanMode is purely a state transition tool
- The LLM doesn't need to specify any configuration
- The plan mode workflow is determined by system prompts, not tool parameters

### ExitPlanMode Schema

**Input Schema:**

```javascript
// ============================================
// ExitPlanModeTool inputSchema
// Location: chunks.139.mjs:2629
// ============================================

// ORIGINAL (for source lookup):
zHH = z7(() => _d4().extend({
    plan: z.string().optional().describe("The plan content (injected by normalizeToolInput from disk)")
}))

// _d4() is the base schema (may include pushToRemote, remoteSessionId, remoteSessionTitle)
// The "plan" field is NOT provided by the LLM — it's injected by normalizeToolInput

// READABLE (for understanding):
{
    type: "object",
    properties: {
        plan: {
            type: "string",
            description: "The plan content (injected by normalizeToolInput from disk)"
        },
        // pushToRemote, remoteSessionId, remoteSessionTitle may be present (not shown in LLM-visible schema)
    }
}
```

**Important:** The `plan` field in the input schema is **injected by `normalizeToolInput`**, not provided by the LLM. This ensures:
1. The plan content comes from the file on disk (single source of truth)
2. The LLM cannot fabricate different plan content than what was written
3. The permission dialog can display the actual plan content

**Output Schema:**

```javascript
// ============================================
// ExitPlanModeTool outputSchema
// Location: chunks.139.mjs:2641
// ============================================

// READABLE (for understanding):
{
    type: "object",
    properties: {
        plan: { type: "string" },           // Plan file content
        isAgent: { type: "boolean" },       // Whether called in subagent context
        filePath: { type: "string" },       // Plan file path
        pushToRemote: { type: "boolean" },  // Whether pushed to remote
        hasTaskTool: { type: "boolean" },   // Whether Task tool is available
        awaitingLeaderApproval: { type: "boolean" },  // Swarm approval pending
        requestId: { type: "string" }       // Swarm request ID
    }
}
```

### normalizeToolInput for ExitPlanMode

Before `ExitPlanMode.call()` executes, `normalizeToolInput` injects the plan content:

```javascript
// ============================================
// ExitPlanMode normalizeToolInput
// Location: chunks.139.mjs:2680
// ============================================

// READABLE (for understanding):
async function normalizeToolInput(input, toolUseContext) {
    // Read plan file from disk
    let planFilePath = getPlanFilePath(toolUseContext.agentId);  // uW()
    let planContent = getPlanContent(toolUseContext.agentId);    // pD()

    // Inject plan content into input
    return {
        ...input,
        plan: planContent,     // ← injected from disk
        filePath: planFilePath // ← also inject path for reference
    };
}
```

**Why inject from disk?**
- The LLM's tool call does NOT include plan content (prevents hallucination)
- The permission dialog needs the actual plan content to display
- The tool result renderer needs the plan content to show after approval
- Swarm teammates need the plan content for the approval request message

---

## 21. Cross-Module Feature Linkage

Plan mode integrates with multiple systems across Claude Code. This section documents the key integration points.

### Plan Mode ↔ System Reminder Integration

The system reminder module ([04_system_reminder/](../04_system_reminder/)) is responsible for injecting plan mode instructions into the LLM context.

**Key Integration Functions:**

| Function | Symbol | Purpose |
|----------|--------|---------|
| `getPlanModeAttachment` | `DuY` | Generates plan_mode attachment for current turn |
| `getPlanModeExitAttachment` | `XuY` | Generates plan_mode_exit attachment after exit |
| `buildPlanModeReminder` | `azz` | Renders full/sparse/interview reminder text |
| `countTurnsSinceLastAttachment` | `JuY` | Throttles reminder injection |

**Turn-Based Throttling Algorithm:**

```javascript
// ============================================
// PLAN_MODE_ATTACHMENT_CONFIG - Turn throttling constants
// Location: chunks.147.mjs:1235
// ============================================

const PLAN_MODE_ATTACHMENT_CONFIG = {
    TURNS_BETWEEN_ATTACHMENTS: 5,        // Skip if <5 turns since last
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5 // Full reminder on 1st, 6th, 11th...
};
```

**Why this throttling?**
- The 5-turn window gives the LLM time to make meaningful progress without repeated reminders
- Full reminders (1000+ tokens) are injected every 25 turns to reinforce the workflow
- Sparse reminders (~100 tokens) are used between full reminders to save context

### Plan Mode ↔ Compact Integration

The compact module ([07_compact/](../07_compact/)) preserves the plan file during conversation compaction.

**Key Integration Functions:**

| Function | Symbol | Purpose |
|----------|--------|---------|
| `collectPlanToKeep` | `mE1` | Collects plan file as attachment during compaction |
| `getPlanFileContent` | `pD` | Reads plan file content from disk |
| `getPlanFilePath` | `uW` | Computes plan file path from session context |

**Plan Preservation Flow:**

```
Compaction Triggered
    │
    ├─ performFullCompaction() called
    │
    ├─ State collection phase:
    │   ├─ fqq() → collect files to keep
    │   ├─ Nqq() → collect tasks to keep
    │   ├─ pa4() → collect todos to keep
    │   ├─ mE1() → collect plan to keep ← PLAN PRESERVED
    │   └─ Tqq() → collect skills to keep
    │
    └─ Post-compaction context includes:
        plan_file_reference attachment with:
        - planFilePath
        - planContent (full file)
```

**Key Design Decision:** The plan file has **no size limit** during compaction, unlike read files (50KB limit). This ensures the entire plan survives context management.

### Plan Mode ↔ Hooks Integration

The hooks module ([11_hooks/](../11_hooks/)) fires events during plan mode operations.

**Key Integration Points:**

| Hook Event | When It Fires | Plan Mode Behavior |
|------------|---------------|-------------------|
| `PreToolUse` | Before tool execution | Read-only enforcement applies |
| `PostToolUse` | After tool success | Normal behavior |
| `PreCompact` | Before compaction | Can inject custom instructions |
| `PostCompact` | After compaction | State restoration possible |
| `SessionEnd` | Session termination | Normal cleanup |

**PreCompact Hook in Plan Mode:**

```javascript
// ============================================
// executePreCompactHooks - PreCompact hook execution
// Location: chunks.141.mjs:3011
// ============================================

async function executePreCompactHooks(hookInput, signal, timeoutMs) {
    let payload = {
        hook_event_name: "PreCompact",
        trigger: hookInput.trigger,  // "manual" or "auto"
        custom_instructions: hookInput.customInstructions
    };

    let results = await executeHooks({ hookInput: payload, ... });

    return {
        newCustomInstructions: results
            .filter(r => r.succeeded && r.output.trim())
            .map(r => r.output.trim())
            .join("\n\n"),
        userDisplayMessage: /* formatted results */
    };
}
```

**Why PreCompact returns customInstructions?** Hooks can inject additional context into the compaction prompt, allowing users to guide summarization behavior via hook configuration.

### Plan Mode ↔ Task System Integration

The task system ([13_task_system/](../13_task_system/)) is orthogonal to plan mode but integrates during planning workflows.

**Task Tools Availability in Plan Mode:**

| Tool | Available | Reason |
|------|-----------|--------|
| `TaskCreate` | ✓ Yes | Creates metadata, doesn't modify code |
| `TaskList` | ✓ Yes | Read-only operation |
| `TaskGet` | ✓ Yes | Read-only operation |
| `TaskUpdate` | ✓ Yes | Updates task state, not code |

**Task Preservation During Compaction:**

The `collectTasksToKeep` (`Nqq`) function preserves terminal-state background agent tasks:

```javascript
// Only preserve completed/failed/killed tasks
// Running tasks are still active and will report when done
if (status === "completed" || status === "failed" || status === "killed") {
    return [createAttachmentMessage({
        type: "task_status",
        taskId: task.agentId,
        taskType: "local_agent",
        description: task.description,
        status: status,
        deltaSummary: task.error ?? null
    })];
}
```

### Plan Mode ↔ Permission System Integration

The permission system enforces plan mode restrictions via `toolPermissionContext.mode`.

**Mode State:**

```typescript
interface ToolPermissionContext {
    mode: "default" | "plan" | "acceptEdits" | "delegate" | "bypassPermissions" | "dontAsk";
    prePlanMode?: string;  // Saved on entry, restored on exit
    // ...
}
```

**Mode Transition Hook:**

```javascript
// Dp - handlePlanModeTransition
function handlePlanModeTransition(fromMode, toMode) {
    // Entering plan mode: clear exit attachment flag
    if (toMode === "plan" && fromMode !== "plan") {
        globalSessionState.needsPlanModeExitAttachment = false;
    }
    // Exiting plan mode: set exit attachment flag
    if (fromMode === "plan" && toMode !== "plan") {
        globalSessionState.needsPlanModeExitAttachment = true;
    }
}
```

**Global State Flags:**

| Flag | Getter | Setter | Purpose |
|------|--------|--------|---------|
| `hasExitedPlanMode` | `nk6()` | `HV()` | Track if user exited plan mode this session |
| `needsPlanModeExitAttachment` | `Fu1()` | `JS()` | Trigger plan_mode_exit attachment |

### Plan Mode ↔ Swarm/Team Integration

Swarm teammates with `planModeRequired: true` use a different approval flow.

**Swarm Approval Flow:**

```
Teammate calls ExitPlanMode
    │
    ├─ isTeammate() && hasTeamConfig() → true
    │
    ├─ Write plan_approval_request to team-lead mailbox
    │   {
    │       type: "plan_approval_request",
    │       from: agentName,
    │       planFilePath,
    │       planContent,
    │       requestId
    │   }
    │
    ├─ Mark task as awaitingPlanApproval
    │
    └─ Return { awaitingLeaderApproval: true, requestId }
        (Teammate waits for leader response)
```

**Team Lead Response:**

When the team lead approves/rejects via `SendMessage`, the teammate receives the response in their inbox and either proceeds with implementation or revises the plan.

---

## 22. Summary: Plan Mode Architecture

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **EnterPlanMode Tool** | `chunks.144.mjs` | State transition into plan mode |
| **ExitPlanMode Tool** | `chunks.143.mjs` | State transition out of plan mode |
| **System Reminder** | `chunks.147.mjs`, `chunks.173.mjs` | Inject planning instructions |
| **Plan File** | `{sessionDir}/{slug}.md` | Persistent plan storage |
| **Mode State** | `toolPermissionContext.mode` | Track current mode |
| **Exit Flags** | `globalSessionState` | Track exit state for attachments |

### Key Algorithms

1. **Turn-based throttling**: Skip reminders within 5 turns, full vs sparse alternation
2. **Re-entry detection**: `hasExitedPlanMode` flag triggers special re-entry instructions
3. **Auto-mode gate**: Circuit breaker prevents cascading failures on plan exit
4. **Plan slug preservation**: Maintains plan file access across session clear

### State Transitions

```
default → plan → (user approves) → default/acceptEdits/bypassPermissions
                 (user rejects) → plan (stays)

default → plan → (teammate) → plan_approval_request → (lead approves) → default
                                                        (lead rejects) → plan
```
