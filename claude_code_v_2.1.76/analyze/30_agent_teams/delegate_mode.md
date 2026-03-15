# Delegate Mode

## Overview

Delegate mode is a specialized tool-permission mode for the team lead agent in Claude Code's Agent Teams (swarm) feature. When activated, the team lead is restricted to **coordination-only tools** -- it cannot directly read, write, edit files, or execute shell commands. Instead, it must work exclusively through team management tools: creating/managing teammates, sending messages, and tracking tasks.

The core purpose of delegate mode is to enforce a **management-only posture** for the lead agent. Rather than doing work directly, the lead coordinates a team of subagents (teammates), each of which operates in its own context window with full tool access. This separation ensures:

1. **Clear division of labor** -- The lead plans and delegates; teammates execute.
2. **Reduced context pollution** -- The lead's context window stays focused on coordination, not file contents.
3. **Parallel execution** -- Multiple teammates can work simultaneously on different tasks.
4. **Controlled escalation** -- When the user exits delegate mode, the lead regains full tool access and can intervene directly.

Delegate mode requires the Agent Teams feature to be enabled (gated behind `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable and the `tengu_amber_flint` Statsig feature flag). It is only available to the team lead agent (not to teammates).

---

## Entry/Exit Flow

### Mode Cycling

Delegate mode sits in the mode rotation cycle between "plan" and "bypassPermissions" (or "default" if bypass is unavailable). The cycle order is:

```
default -> acceptEdits -> plan -> delegate -> bypassPermissions -> default
                                    ^                    |
                                    |  (only if teams    |
                                    |   enabled + lead)  |
                                    +--------------------+
```

The mode cycling function determines the next mode based on current mode and context:

```javascript
// ============================================
// getNextMode - Determines next mode in the cycling sequence
// Location: chunks.183.mjs:1778-1797
// ============================================

// ORIGINAL (for source lookup):
function hf1(A, q) {
    let K = l8() && q && PM(q);
    switch (A.mode) {
        case "default":
            return "acceptEdits";
        case "acceptEdits":
            return "plan";
        case "plan":
            if (K) return "delegate";
            if (A.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "delegate":
            if (A.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "bypassPermissions":
            return "default";
        case "dontAsk":
            return "default"
    }
}

// READABLE (for understanding):
function getNextMode(toolPermissionContext, teamContext) {
    let isDelegateModeAvailable = isAgentTeamsEnabled() && teamContext && isTeamLead(teamContext);
    switch (toolPermissionContext.mode) {
        case "default":
            return "acceptEdits";
        case "acceptEdits":
            return "plan";
        case "plan":
            if (isDelegateModeAvailable) return "delegate";
            if (toolPermissionContext.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "delegate":
            if (toolPermissionContext.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "bypassPermissions":
            return "default";
        case "dontAsk":
            return "default";
    }
}

// Mapping: hf1->getNextMode, A->toolPermissionContext, q->teamContext, K->isDelegateModeAvailable, l8->isAgentTeamsEnabled, PM->isTeamLead
```

**How it works:**
1. When the user presses the mode-cycle hotkey (Shift+Tab), the REPL calls `getNextModeCycle` (`FGq`), which wraps `getNextMode`.
2. `getNextMode` checks if delegate mode is available by verifying: (a) agent teams are enabled (`l8()`), (b) a team context exists, and (c) the current agent is the team lead (`PM(q)`).
3. Delegate mode only appears in the cycle after "plan" mode, making it the natural escalation: plan -> delegate -> (bypass) -> default.

**Why this approach:**
- Delegate mode is not always available -- it depends on feature flags and team context. By computing availability dynamically in the cycle function, the UI naturally skips it when inapplicable.
- Placing delegate after plan in the cycle is intentional: users often start by planning (read-only), then escalate to delegating (coordination-only), then potentially bypass permissions, and finally return to default.

### Entering Delegate Mode (REPL Handler)

When the user cycles into delegate mode, the REPL handler in `chunks.185.mjs` executes the transition:

```javascript
// ============================================
// handleModeCycle - REPL mode transition handler (delegate-relevant excerpt)
// Location: chunks.185.mjs:629-651
// ============================================

// ORIGINAL (for source lookup):
let { nextMode: I6, context: tA } = FGq(K, y1);
if (c("tengu_mode_cycle", { to: I6 }),
    K.mode === "plan" && I6 !== "plan") OT(!0);
if (ey(K.mode, I6),
    K.mode === "delegate" && I6 !== "delegate") tL6(!0), XN1(!0);
if (I6 === "plan") jA((w7) => ({ ...w7, lastPlanModeUse: Date.now() }));
if (I6 === "acceptEdits") u8("auto-accept-mode");
if (R1((w7) => ({
        ...w7,
        toolPermissionContext: { ...tA, mode: I6 }
    })), Y({ ...tA, mode: I6 }),
    HR4(I6, y1?.teamName), J1) D1(!1)

// READABLE (for understanding):
let { nextMode, context } = getNextModeCycle(currentToolPermCtx, teamContext);
if (telemetry("tengu_mode_cycle", { to: nextMode }),
    currentToolPermCtx.mode === "plan" && nextMode !== "plan") setHasExitedPlanMode(true);
if (handlePlanModeTransition(currentToolPermCtx.mode, nextMode),
    currentToolPermCtx.mode === "delegate" && nextMode !== "delegate") {
    setHasExitedDelegateMode(true);
    setNeedsDelegateModeExitAttachment(true);
}
if (nextMode === "plan") setSessionState((s) => ({ ...s, lastPlanModeUse: Date.now() }));
if (nextMode === "acceptEdits") trackEvent("auto-accept-mode");
if (setAppState((s) => ({
        ...s,
        toolPermissionContext: { ...context, mode: nextMode }
    })), setToolPermissionContext({ ...context, mode: nextMode }),
    syncTeamMemberMode(nextMode, teamContext?.teamName), isCollapsed) setCollapsed(false);

// Mapping: FGq->getNextModeCycle, K->currentToolPermCtx, y1->teamContext, I6->nextMode, tA->context,
//   OT->setHasExitedPlanMode, ey->handlePlanModeTransition, tL6->setHasExitedDelegateMode,
//   XN1->setNeedsDelegateModeExitAttachment, HR4->syncTeamMemberMode, R1->setAppState, Y->setToolPermissionContext
```

**How it works:**
1. `getNextModeCycle` computes the next mode and returns it with the current context.
2. Telemetry event `tengu_mode_cycle` is fired.
3. If transitioning **away from** delegate mode (`K.mode === "delegate" && I6 !== "delegate"`), two flags are set:
   - `hasExitedDelegateMode` = true (session-level flag for tracking)
   - `needsDelegateModeExitAttachment` = true (triggers the exit reminder injection on the next turn)
4. The app state and tool permission context are updated with the new mode.
5. `syncTeamMemberMode` (`HR4`) notifies the team's shared state that the lead changed modes.

### Exiting Delegate Mode

When the user exits delegate mode, the exit is communicated to the LLM on the **next conversation turn** via a system reminder attachment. This is handled by:

```javascript
// ============================================
// getDelegateModeExitAttachment - Generates exit notification for LLM
// Location: chunks.142.mjs:2085-2090
// ============================================

// ORIGINAL (for source lookup):
function ohY() {
    if (!eL6()) return [];
    return XN1(!1), [{
        type: "delegate_mode_exit"
    }]
}

// READABLE (for understanding):
function getDelegateModeExitAttachment() {
    if (!needsDelegateModeExitAttachment()) return [];
    return setNeedsDelegateModeExitAttachment(false), [{
        type: "delegate_mode_exit"
    }];
}

// Mapping: ohY->getDelegateModeExitAttachment, eL6->needsDelegateModeExitAttachment, XN1->setNeedsDelegateModeExitAttachment
```

**Key insight:** The exit attachment is a **one-shot** mechanism. The flag `needsDelegateModeExitAttachment` is set to true when exiting delegate mode, consumed (set to false) when the attachment is generated, and never fires again unless delegate mode is re-entered and re-exited.

### CLI Initial Mode Resolution

Delegate mode can also be requested at CLI startup via settings or CLI arguments:

```javascript
// ============================================
// resolvePermissionMode - Validates and resolves the initial permission mode
// Location: chunks.172.mjs:2175-2217
// ============================================

// READABLE (for understanding):
function resolvePermissionMode({ permissionModeCli, dangerouslySkipPermissions, ...rest }) {
    // ... (bypassPermissions validation) ...
    if (candidateMode === "delegate" && !isAgentTeamsEnabled()) {
        log("delegate mode requested but agent swarms not enabled, falling back", { level: "warn" });
        continue; // skip this candidate, try next
    }
    // ... (sets mode or falls back to "default") ...
}

// Mapping: qJq->resolvePermissionMode, A->permissionModeCli, q->dangerouslySkipPermissions, l8->isAgentTeamsEnabled, J->candidateMode
```

**Why this approach:** The resolution iterates through candidate modes in priority order (CLI arg > settings > default). If delegate mode is requested but agent teams are not enabled, it is silently skipped and the next candidate is tried.

---

## Tool Restriction

### The Delegate Mode Allowed Tools Set

When delegate mode is active, tools are filtered to a strict allowlist defined as `R_6` (readable: `DELEGATE_MODE_ALLOWED_TOOLS`):

```javascript
// ============================================
// DELEGATE_MODE_ALLOWED_TOOLS - Set of tool names permitted in delegate mode
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
R_6 = new Set([vh, VK1, iB, Nh, NK1, TK1, DR, fK])

// READABLE (for understanding):
DELEGATE_MODE_ALLOWED_TOOLS = new Set([
    "TeamCreate",   // vh  - Create new teammates
    "TeamDelete",   // VK1 - Delete teammates
    "SendMessage",  // iB  - Send messages to teammates
    "TaskCreate",   // Nh  - Create new tasks
    "TaskGet",      // NK1 - Retrieve task details
    "TaskList",     // TK1 - List all tasks
    "TaskUpdate",   // DR  - Update task status/comments
    "Task"          // fK  - General task/subagent tool
])

// Mapping: R_6->DELEGATE_MODE_ALLOWED_TOOLS, vh->"TeamCreate", VK1->"TeamDelete", iB->"SendMessage",
//   Nh->"TaskCreate", NK1->"TaskGet", TK1->"TaskList", DR->"TaskUpdate", fK->"Task"
```

**What it does:** Defines the exact set of 8 tool names the lead agent is permitted to use in delegate mode.

**Why these specific tools:**
- **TeamCreate / TeamDelete / SendMessage** -- Core team management. The lead must be able to spawn, remove, and communicate with teammates.
- **TaskCreate / TaskGet / TaskList / TaskUpdate** -- Task tracking infrastructure. The lead creates tasks, assigns them to teammates, monitors progress, and marks completion.
- **Task** -- The general subagent tool (`fK = "Task"`). This is included to allow the lead to still spawn one-off subagents for quick queries even in delegate mode.

**What is blocked:** All direct-action tools are excluded: `Bash`, `Read`, `Write`, `Edit`, `Glob`, `Grep`, `WebSearch`, `WebFetch`, `NotebookEdit`, MCP tools, and any other tools not in the set.

**Key insight:** The allowlist includes `"Task"` (the subagent tool), which means the lead can still dispatch ephemeral subagents even in delegate mode. This is intentional -- the lead may need quick research queries without formally creating teammates. The distinction is that teammates are persistent (they have state, mailboxes, and can receive follow-up messages) while subagents spawned via `Task` are one-shot.

### Permission Filtering Implementation

The tool filtering is enforced at two levels, both in the same file (`chunks.141.mjs`):

**Level 1: `getPermissionFilteredTools` (`YP6`)** -- Filters tools for permission-based contexts:

```javascript
// ============================================
// getPermissionFilteredTools - Filters tools based on permission mode (including delegate)
// Location: chunks.141.mjs:1476-1483
// ============================================

// ORIGINAL (for source lookup):
function YP6(A, q) {
    let K = tD(A);
    if (O$()) return K;
    let Y = hg1(q, A),
        z = Sx([...K, ...Y], "name");
    if (A.mode === "delegate") return z.filter((w) => R_6.has(w.name));
    return z
}

// READABLE (for understanding):
function getPermissionFilteredTools(toolPermissionContext, allTools) {
    let baseTools = getBaseTools(toolPermissionContext);
    if (isSubagent()) return baseTools;
    let hookFilteredTools = filterByHookRules(allTools, toolPermissionContext),
        deduped = deduplicateByName([...baseTools, ...hookFilteredTools]);
    if (toolPermissionContext.mode === "delegate") {
        return deduped.filter((tool) => DELEGATE_MODE_ALLOWED_TOOLS.has(tool.name));
    }
    return deduped;
}

// Mapping: YP6->getPermissionFilteredTools, A->toolPermissionContext, q->allTools, K->baseTools,
//   tD->getBaseTools, O$->isSubagent, hg1->filterByHookRules, Y->hookFilteredTools,
//   Sx->deduplicateByName, z->deduped, R_6->DELEGATE_MODE_ALLOWED_TOOLS
```

**Why dual filtering?** This is a defense-in-depth approach. The delegate mode filter at both levels ensures that even if a hook or plugin injects additional tools, they are still blocked in delegate mode.

### Plan Approval Context

When a teammate requests plan approval from the lead, the approval handler recognizes that the lead in delegate mode should grant "default" permissions (not "delegate") to the teammate:

```javascript
// ============================================
// handlePlanApproval - Approves teammate plans with appropriate permission mode
// Location: chunks.141.mjs:1239-1256
// ============================================

// ORIGINAL (for source lookup):
let z = K.toolPermissionContext.mode,
    w = z === "plan" || z === "delegate" ? "default" : z;

// READABLE (for understanding):
let currentMode = appState.toolPermissionContext.mode,
    approvedMode = currentMode === "plan" || currentMode === "delegate" ? "default" : currentMode;

// Mapping: z->currentMode, w->approvedMode, K->appState
```

**Key insight:** When the lead is in delegate or plan mode, approved plans run with "default" permissions (full tool access). The lead restricts *itself*, not its teammates.

---

## System Prompt Injection

### Delegate Mode Reminder

When delegate mode is active, a system reminder is injected into the conversation on every turn:

```javascript
// ============================================
// renderDelegateModeReminder - Injects delegate mode system prompt
// Location: chunks.173.mjs:967-987
// ============================================

// READABLE (for understanding):
case "delegate_mode": {
    if (!isAgentTeamsEnabled()) return [];
    let reminderContent = `## Delegate Mode

You are in delegate mode for team "${attachment.teamName}". In this mode, you can ONLY use the following tools:
- TeammateTool: For spawning teammates, sending messages, and team coordination
- TaskCreate: For creating new tasks
- TaskGet: For retrieving task details
- TaskUpdate: For updating task status and adding comments
- TaskList: For listing all tasks

You CANNOT use any other tools (Bash, Read, Write, Edit, etc.) until you exit delegate mode.

**Task list location:** ${attachment.taskListPath}

Focus on coordinating work by creating tasks, assigning them to teammates, and monitoring progress. Use the Teammate tool to communicate with your team.`;
    return wrapAsMessages([createSystemReminderBlock({
        content: reminderContent,
        isMeta: true
    })]);
}

// Mapping: l8->isAgentTeamsEnabled, A->attachment, K->reminderContent, _9->wrapAsMessages, c6->createSystemReminderBlock
```

**Why this is important:**
- Even though the tool list is filtered at the API level, the system prompt **reinforces the restriction in natural language**. This is a belt-and-suspenders approach.
- The reminder includes the **task list path**, giving the LLM the concrete filesystem location for task management files.
- The reminder is marked as `isMeta: true`, meaning it is a system-level injection not shown to the user in the conversation UI.

### Delegate Mode Exit Reminder

When the user exits delegate mode, the LLM receives a one-time exit notification:

```javascript
// READABLE (for understanding):
case "delegate_mode_exit":
    return wrapAsMessages([createSystemReminderBlock({
        content: `## Exited Delegate Mode

You have exited delegate mode. You can now use all tools (Bash, Read, Write, Edit, etc.) and take actions directly. Continue with your tasks.`,
        isMeta: true
    })]);
```

**Key insight:** The exit notification explicitly tells the LLM that all tools are now available again. Without this, the LLM might continue to self-restrict based on the earlier delegate mode prompt.

### Attachment Generation

```javascript
// ============================================
// getDelegateModeAttachment - Generates delegate mode system reminder attachment
// Location: chunks.142.mjs:2073-2083
// ============================================

// READABLE (for understanding):
async function getDelegateModeAttachment(sessionContext) {
    let appState = await sessionContext.getAppState();
    if (appState.toolPermissionContext.mode !== "delegate") return [];
    if (!appState.teamContext) return [];
    let taskListPath = `${getGlobalConfigDir()}/tasks/${appState.teamContext.teamName}/`;
    return [{
        type: "delegate_mode",
        teamName: appState.teamContext.teamName,
        taskListPath: taskListPath
    }];
}

// Mapping: rhY->getDelegateModeAttachment, A->sessionContext, q->appState, O8->getGlobalConfigDir, Y->taskListPath
```

---

## Session State Management

Delegate mode uses two session-level boolean flags:

| Flag | Getter | Setter | Purpose |
|------|--------|--------|---------|
| `hasExitedDelegateMode` | `fbq` | `tL6` | Tracks if user ever exited delegate mode this session |
| `needsDelegateModeExitAttachment` | `eL6` | `XN1` | One-shot flag to inject exit reminder on next turn |

```javascript
// ORIGINAL (for source lookup):
function fbq() { return o6.hasExitedDelegateMode }
function tL6(A) { o6.hasExitedDelegateMode = A }
function eL6() { return o6.needsDelegateModeExitAttachment }
function XN1(A) { o6.needsDelegateModeExitAttachment = A }

// READABLE (for understanding):
function hasExitedDelegateModeInSession() { return sessionState.hasExitedDelegateMode }
function setHasExitedDelegateMode(value) { sessionState.hasExitedDelegateMode = value }
function needsDelegateModeExitAttachment() { return sessionState.needsDelegateModeExitAttachment }
function setNeedsDelegateModeExitAttachment(value) { sessionState.needsDelegateModeExitAttachment = value }

// Mapping: fbq->hasExitedDelegateModeInSession, tL6->setHasExitedDelegateMode, o6->sessionState,
//   eL6->needsDelegateModeExitAttachment, XN1->setNeedsDelegateModeExitAttachment
```

---

## Preconditions and Guards

### Agent Teams Enabled (`l8` / `isAgentTeamsEnabled`)

```javascript
// ============================================
// isAgentTeamsEnabled - Checks if agent teams feature is available
// Location: chunks.10.mjs:2826-2830
// ============================================

// ORIGINAL (for source lookup):
function l8() {
    if (!J6(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS)) return !1;
    if (!x8("tengu_amber_flint", !0)) return !1;
    return !0
}

// READABLE (for understanding):
function isAgentTeamsEnabled() {
    if (!parseBoolean(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS)) return false;
    if (!checkFeatureGate("tengu_amber_flint", true)) return false;
    return true;
}

// Mapping: l8->isAgentTeamsEnabled, J6->parseBoolean, x8->checkFeatureGate
```

**Dual gate:** Both the environment variable AND the Statsig feature gate must be truthy.

### Is Team Lead (`PM` / `isTeamLead`)

```javascript
// ============================================
// isTeamLead - Checks if current agent is the team lead
// Location: chunks.48.mjs:308-313
// ============================================

// ORIGINAL (for source lookup):
function PM(A) {
    if (!A?.leadAgentId) return !1;
    let q = ID(),
        K = A.leadAgentId;
    if (q === K) return !0;
    if (!q) return !0;
}

// READABLE (for understanding):
function isTeamLead(teamContext) {
    if (!teamContext?.leadAgentId) return false;
    let currentAgentId = getAgentId(),
        leadId = teamContext.leadAgentId;
    if (currentAgentId === leadId) return true;
    if (!currentAgentId) return true; // no agent ID means main process = lead
}

// Mapping: PM->isTeamLead, A->teamContext, ID->getAgentId, q->currentAgentId, K->leadId
```

---

## UI Representation

Delegate mode has its own visual identity in the CLI:

- **Color:** Magenta/purple (`rgb(138,43,226)` in rich terminals, `ansi:magenta` in basic terminals) -- defined in `chunks.52.mjs` theme colors as `delegateMode`.
- **Label:** "Delegate Mode" -- returned by `CQ` (readable: `getModeLabelText`) in `chunks.14.mjs:3266-3267`.

---

## Summary: Delegate Mode Lifecycle

```
+----------------------------+
|  User presses mode         |
|  cycle hotkey              |
+-----------+----------------+
            |
+-----------v----------------+
|  getNextMode()             |
|  plan -> delegate          |
|  (if teams enabled +       |
|   is team lead)            |
+-----------+----------------+
            |
+-----------v----------------+
|  setAppState({ mode: "delegate" })    |
|  syncTeamMemberMode("delegate")       |
+-----------+----------------+
            |
+-----------v----------------+
|  On next LLM turn:         |
|  1. Tool list filtered     |
|     to R_6 allowlist       |
|  2. delegate_mode          |
|     system reminder        |
|     injected               |
+-----------+----------------+
            |
+-----------v----------------+
|  LLM operates with         |
|  coordination tools only:  |
|  TeamCreate/Delete,        |
|  SendMessage,              |
|  TaskCreate/Get/Update/List|
|  Task (subagent)           |
+-----------+----------------+
            |
+-----------v----------------+
|  User exits delegate mode  |
+-----------+----------------+
            |
+-----------v----------------+
|  setHasExitedDelegateMode(true)       |
|  setNeedsDelegateModeExitAttachment(  |
|    true)                              |
+-----------+----------------+
            |
+-----------v----------------+
|  On next LLM turn:         |
|  delegate_mode_exit        |
|  reminder injected         |
|  (one-shot, clears flag)   |
+-----------+----------------+
            |
+-----------v----------------+
|  Full tools restored       |
+----------------------------+
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getNextMode` (hf1) - Determines next mode in cycling sequence, gates delegate on team lead status
- `getNextModeCycle` (FGq) - Wraps getNextMode with context pass-through
- `isAgentTeamsEnabled` (l8) - Dual-gate check for env var + feature flag
- `isTeamLead` (PM) - Checks if current agent is the team lead
- `getPermissionFilteredTools` (YP6) - Top-level tool filtering with delegate mode allowlist
- `getBaseTools` (tD) - Inner tool list builder with delegate mode filter
- `DELEGATE_MODE_ALLOWED_TOOLS` (R_6) - Set of 8 tool names allowed in delegate mode
- `getDelegateModeAttachment` (rhY) - Generates delegate_mode system reminder attachment
- `getDelegateModeExitAttachment` (ohY) - Generates one-shot delegate_mode_exit attachment
- `resolvePermissionMode` (qJq) - CLI startup mode resolution with delegate fallback
- `hasExitedDelegateModeInSession` (fbq) - Session state getter
- `setHasExitedDelegateMode` (tL6) - Session state setter
- `needsDelegateModeExitAttachment` (eL6) - One-shot flag getter
- `setNeedsDelegateModeExitAttachment` (XN1) - One-shot flag setter
- `syncTeamMemberMode` (HR4) - Notifies team shared state of mode change
- `getModeLabelText` (CQ) - Returns "Delegate Mode" label for UI
- `handlePlanApproval` (AhY) - Approves teammate plans, resolves delegate -> default for permissions

### Tool Name Constants
- `"TeamCreate"` (vh) - chunks.89.mjs:588
- `"TeamDelete"` (VK1) - chunks.89.mjs:590
- `"SendMessage"` (iB) - chunks.89.mjs:592
- `"TaskCreate"` (Nh) - chunks.88.mjs:371
- `"TaskGet"` (NK1) - chunks.89.mjs:594
- `"TaskList"` (TK1) - chunks.89.mjs:596
- `"TaskUpdate"` (DR) - chunks.88.mjs:373
- `"Task"` (fK) - chunks.47.mjs:539
