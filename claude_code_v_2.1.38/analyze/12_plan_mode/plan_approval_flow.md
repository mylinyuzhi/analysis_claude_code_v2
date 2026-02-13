# Plan Mode Approval Flow (Claude Code 2.1.38)

> Plan mode lifecycle: enter plan mode, explore/design, write plan to file, exit for approval, swarm-specific plan messaging, tool restrictions, and plan file management.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `EnterPlanModeTool` (kg1) - Tool object for entering plan mode
- `ExitPlanModeTool` (Nj) - Tool object for exiting plan mode with plan approval
- `getPlanContent` (pD) - Reads plan file content from disk
- `getPlanFilePath` (uW) - Computes the plan file path for the current session/agent
- `isPlanModeEnabled` (xm) - Checks if plan mode is currently active
- `isPlanModeInterviewPhase` (sO) - Feature flag for iterative plan workflow
- `buildPlanModeReminder` (azz) - Builds system reminder messages for plan mode
- `buildPlanModeSubagentReminder` (q2z) - Plan mode reminder for subagents
- `buildPlanModeSparseReminder` (A2z) - Abbreviated plan mode reminder for later turns
- `handlePlanApproval` (AhY) - Handles plan approval from team leader
- `handlePlanRejection` (qhY) - Handles plan rejection from team leader

---

## Architecture Overview

```
User request
  │
  ▼
LLM decides task is non-trivial
  │
  ▼
EnterPlanMode tool call
  ├── Auto-approved (no user prompt)
  ├── Sets permission mode to "plan"
  └── Saves previous mode as prePlanMode
  │
  ▼
Plan Mode Active (read-only)
  ├── System reminder injected every turn
  ├── File writes blocked EXCEPT plan file
  ├── Available tools: Read, Glob, Grep, Task, AskUserQuestion, Write (plan file only)
  ├── Phase 1: Explore codebase (subagents)
  ├── Phase 2: Design implementation (plan agents)
  ├── Phase 3: Review & iterate
  └── Phase 4: Write final plan to plan file
  │
  ▼
ExitPlanMode tool call
  ├── Reads plan from plan file
  ├── Requires user interaction (permission prompt)
  ├── Shows plan content to user
  └── User approves or rejects
  │
  ├── Approved: Restores prePlanMode, returns plan content
  └── Rejected: Stays in plan mode, shows rejection feedback
  │
  ▼
Implementation Phase (normal mode)
```

---

## EnterPlanMode Tool

### How Plan Mode is Entered

**What it does:** Transitions the agent into plan mode, changing the permission mode to "plan" which restricts tool usage to read-only operations (plus plan file editing).

**How it works:**

1. **Agent context check**: Throws an error if called from a subagent context (`q.agentId` is truthy). Plan mode is only available in the main agent loop.

2. **Permission mode transition**: Saves the current mode as `prePlanMode` and sets mode to `"plan"`.

3. **State update**: Uses `a2` (applyPermissionAction) with `{ type: "setMode", mode: "plan", destination: "session" }`.

4. **Tool result mapping**: The `mapToolResultToToolResultBlockParam` method appends plan mode instructions to the tool result, telling the model what it can and cannot do.

```javascript
// ============================================
// EnterPlanModeTool.call - Enters plan mode
// Location: chunks.140.mjs:1687-1727
// ============================================

// ORIGINAL (for source lookup):
async call(A, q) {
    if (q.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
    let K = await q.getAppState();
    return ey(K.toolPermissionContext.mode, "plan"), q.setAppState((Y) => ({
        ...Y,
        toolPermissionContext: {
            ...a2(Y.toolPermissionContext, { type: "setMode", mode: "plan", destination: "session" }),
            prePlanMode: Y.toolPermissionContext.mode
        }
    })), { data: { message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach." } }
}

// READABLE (for understanding):
async call(input, toolUseContext) {
    if (toolUseContext.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
    let appState = await toolUseContext.getAppState();
    telemetry(appState.toolPermissionContext.mode, "plan");
    toolUseContext.setAppState((state) => ({
        ...state,
        toolPermissionContext: {
            ...applyPermissionAction(state.toolPermissionContext, { type: "setMode", mode: "plan", destination: "session" }),
            prePlanMode: state.toolPermissionContext.mode  // Save current mode for later restoration
        }
    }));
    return { data: { message: "Entered plan mode..." } };
}

// Mapping: A→input, q→toolUseContext, K→appState, Y→state, a2→applyPermissionAction, ey→telemetry
```

**Why this approach:**
- Saving `prePlanMode` enables restoring the exact previous mode (default, acceptEdits, etc.) when exiting plan mode, rather than always resetting to "default"
- The `destination: "session"` parameter ensures the mode change is session-scoped and does not persist to settings
- Auto-approval (`checkPermissions` returns `{ behavior: "allow" }`) means entering plan mode does not require user confirmation -- the LLM decides when planning is appropriate

**Key insight:** The `mapToolResultToToolResultBlockParam` method is called when converting the tool result to API format. It appends the full plan mode instructions (5-phase workflow or iterative workflow depending on feature flags) as part of the tool result content. This means the instructions are injected into the conversation at the exact point the model enters plan mode, ensuring they are in context for all subsequent planning turns.

---

## Plan Mode Workflow (Two Variants)

### Standard 5-Phase Workflow

When `sO()` (isPlanModeInterviewPhase) returns `false`, the standard workflow is used:

1. **Phase 1: Initial Understanding** - Launch up to N `explore` subagents in parallel to understand the codebase
2. **Phase 2: Design** - Launch `plan` subagents to design implementation based on Phase 1 results
3. **Phase 3: Review** - Read critical files, ensure alignment with user intent, ask clarifying questions
4. **Phase 4: Final Plan** - Write plan to plan file with Context, approach, file paths, verification steps
5. **Phase 5: Call ExitPlanMode** - Signal completion and request user approval

### Iterative Interview Workflow

When `sO()` returns `true` (feature-flagged), a more interactive workflow is used:

1. **Explore** - Use Glob, Grep, Read to scan code
2. **Update plan file** - Write findings incrementally
3. **Ask the user** - Use AskUserQuestion for ambiguities
4. Repeat until plan is complete, then call ExitPlanMode

**Why two variants:**
- The 5-phase workflow is more structured and works well for complex tasks that benefit from systematic exploration
- The iterative workflow is more natural for pair-programming style interactions where the user wants to be involved throughout the planning process
- The choice is controlled via the `tengu_plan_mode_interview_phase` feature flag, allowing A/B testing of both approaches

---

## Plan File Management

### getPlanFilePath - Computing the plan file location

**What it does:** Returns the path where the plan file should be written, based on the session ID and optionally the agent ID.

The plan file lives in the session memory directory:
```
<claude-data-dir>/<session-id>/session-memory/<slug>.md
```

### getPlanContent - Reading the plan file

**What it does:** Reads the plan file from disk. Returns `null` if the file does not exist. Used by ExitPlanMode to include the plan content in the approval dialog.

### Tool Restrictions in Plan Mode

When plan mode is active, the system reminder (injected via `azz`/buildPlanModeReminder) explicitly states:

> "you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system."

The only writable operations allowed are:
- Writing to the plan file via `Write` tool (path must match the plan file path)
- Editing the plan file via `Edit` tool

All other write operations (Bash commands that modify state, file writes to other paths, git operations) are blocked by the permission system when mode is `"plan"`.

---

## ExitPlanMode Tool

### How Plan Mode is Exited

**What it does:** Reads the plan from the plan file, presents it for user approval, and restores the previous permission mode on approval.

**How it works:**

1. **Agent context detection**: Checks if running in agent context (`q.agentId`), which affects the flow.

2. **Swarm teammate flow** (if `Dz()` is true and `MC1()` is true):
   - Reads plan from plan file
   - Creates a `plan_approval_request` message
   - Sends the request to the team leader via `f9` (sendTeamMessage)
   - Sets `awaitingPlanApproval: true` on the task
   - Returns without changing permission mode (waits for leader approval)

3. **Standard flow**:
   - Reads plan from plan file via `pD(agentId)`
   - Requires user interaction (`requiresUserInteraction()` returns `true`)
   - `checkPermissions` returns `{ behavior: "ask", message: "Exit plan mode?" }`
   - User sees the plan content and approves or rejects
   - On approval: Restores `prePlanMode` (the mode before plan mode was entered)
   - Sets internal flags `OT(true)` (hasExitedPlanMode) and `kx(true)` (needsPlanModeExitAttachment)

4. **Remote push flow**: If `pushToRemote` is specified in input, the plan is sent to a remote Claude.ai session via `vg1` (pushToRemote).

```javascript
// ============================================
// ExitPlanModeTool.call - Exits plan mode with plan approval
// Location: chunks.139.mjs:2688-2750
// ============================================

// ORIGINAL (for source lookup):
async call(A, q) {
    let K = !!q.agentId, Y = uW(q.agentId), z = pD(q.agentId);
    if (Dz() && MC1()) {
        if (!z) throw Error(`No plan file found at ${Y}. Please write your plan to this file before calling ExitPlanMode.`);
        let _ = { type: "plan_approval_request", from: g5(), planFilePath: Y, planContent: z, requestId: vP1("plan_approval", ...) };
        f9("team-lead", { from: g5(), text: Q1(_), timestamp: new Date().toISOString() }, i3());
        return { data: { plan: z, isAgent: !0, awaitingLeaderApproval: !0, requestId: _.requestId } }
    }
    q.setAppState((H) => {
        if (H.toolPermissionContext.mode !== "plan") return H;
        OT(!0), kx(!0);
        let $ = H.toolPermissionContext.prePlanMode ?? "default";
        return { ...H, toolPermissionContext: { ...H.toolPermissionContext, mode: $, prePlanMode: void 0 } }
    });
    return { data: { plan: z, isAgent: K, filePath: Y } }
}

// READABLE (for understanding):
async call(input, toolUseContext) {
    let isAgent = !!toolUseContext.agentId;
    let planFilePath = getPlanFilePath(toolUseContext.agentId);
    let planContent = getPlanContent(toolUseContext.agentId);

    // Swarm teammate flow: send plan to leader for approval
    if (isTeammate() && hasTeamConfig()) {
        if (!planContent) throw Error(`No plan file found at ${planFilePath}`);
        let request = { type: "plan_approval_request", from: getAgentName(), planFilePath, planContent, requestId: generateRequestId() };
        sendTeamMessage("team-lead", { from: getAgentName(), text: JSON.stringify(request) });
        return { data: { plan: planContent, isAgent: true, awaitingLeaderApproval: true, requestId: request.requestId } };
    }

    // Standard flow: restore previous permission mode
    toolUseContext.setAppState((state) => {
        if (state.toolPermissionContext.mode !== "plan") return state;
        setHasExitedPlanMode(true);
        setNeedsPlanModeExitAttachment(true);
        let previousMode = state.toolPermissionContext.prePlanMode ?? "default";
        return { ...state, toolPermissionContext: { ...state.toolPermissionContext, mode: previousMode, prePlanMode: undefined } };
    });
    return { data: { plan: planContent, isAgent, filePath: planFilePath } };
}

// Mapping: A→input, q→toolUseContext, K→isAgent, Y→planFilePath, z→planContent, Dz→isTeammate, MC1→hasTeamConfig
```

**Key insight:** The ExitPlanMode tool does NOT take plan content as a parameter. It reads the plan from the file the model wrote to. This design ensures the user sees exactly what was written to the plan file, preventing discrepancies between the plan shown for approval and the actual plan file content.

---

## Swarm-Specific Plan Messaging

### Plan Approval in Agent Teams

When plan mode is used by a swarm teammate (a sub-agent in a multi-agent team), the flow changes significantly:

1. **Teammate exits plan mode**: Instead of showing a user dialog, sends a `plan_approval_request` JSON message to the team leader via `SendMessage` tool.

2. **Leader receives request**: The request contains `type: "plan_approval_request"`, the plan content, and a unique request ID.

3. **Leader approves**: Calls `handlePlanApproval` (AhY) which:
   - Sends a `plan_approval_response` with `approved: true` back to the teammate
   - The teammate receives this and proceeds with implementation

4. **Leader rejects**: Calls `handlePlanRejection` (qhY) which:
   - Sends a `plan_approval_response` with `approved: false` and feedback
   - The teammate receives this, re-enters plan mode, and revises the plan

The system prompt for teammates with `plan_mode_required: true` includes specific instructions:

> "When a teammate with `plan_mode_required` calls ExitPlanMode, they send you a plan approval request as a JSON message with `type: "plan_approval_request"`. Use this to approve their plan."

**Why this approach:**
- In multi-agent scenarios, the team leader acts as the human proxy for plan approval
- This enables hierarchical planning where the leader can coordinate multiple teammates' plans
- The request/response pattern with unique IDs prevents race conditions when multiple teammates submit plans simultaneously

---

## Plan Mode System Reminders

### Reminder Injection Strategy

Plan mode instructions are injected as system reminders into the conversation at specific points:

1. **Full reminder** (first turn in plan mode): Complete workflow instructions with phases, tool restrictions, and plan file info. Uses `azz` (buildPlanModeReminder) or `ezz` (buildPlanModeInterviewReminder).

2. **Sparse reminder** (subsequent turns): Abbreviated reminder that references the full instructions "earlier in conversation". Uses `A2z` (buildPlanModeSparseReminder):
   > "Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (`<path>`). Follow 5-phase workflow. End turns with AskUserQuestion (for clarifications) or ExitPlanMode (for plan approval)."

3. **Subagent reminder**: Simplified version for subagents that omits the multi-phase workflow since subagents have a single focused task. Uses `q2z` (buildPlanModeSubagentReminder).

**Why sparse reminders:**
- The full plan mode instructions are ~1000 tokens. Injecting them every turn would waste context window space.
- The sparse reminder (~100 tokens) is sufficient to keep the model in plan mode behavior while referencing the detailed instructions from earlier in the conversation.
- The decision between full and sparse is based on `reminderType` parameter, controlled by the system reminder scheduling logic.

---

## Plan Agent Configuration

### Plan Mode Agent Counts

The number of subagents used in plan mode phases is configurable:

```javascript
// ============================================
// Plan Agent Count Configuration
// Location: chunks.140.mjs:1455-1473
// ============================================

// ORIGINAL (for source lookup):
function Xc4() {
    if (process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT) {
        let K = parseInt(process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT, 10);
        if (!isNaN(K) && K > 0 && K <= 10) return K
    }
    let A = dK(), q = Sn();
    if (A === "max" && q === "default_claude_max_20x") return 3;
    if (A === "enterprise" || A === "team") return 3;
    return 1
}

// READABLE (for understanding):
function getPlanDesignAgentCount() {
    if (process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT) {
        let count = parseInt(process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT, 10);
        if (!isNaN(count) && count > 0 && count <= 10) return count;
    }
    let plan = getPlan(), tier = getSubscriptionTier();
    if (plan === "max" && tier === "default_claude_max_20x") return 3;
    if (plan === "enterprise" || plan === "team") return 3;
    return 1;  // Free/Pro users get 1 design agent
}

// Mapping: Xc4→getPlanDesignAgentCount, A→plan, q→tier
```

**Key insight:** Max and Enterprise/Team users get 3 design agents in Phase 2, enabling the system to explore multiple design approaches in parallel. Free/Pro users get 1 agent. The explore agent count (Phase 1) is separately controlled and defaults to 3 for all tiers.
