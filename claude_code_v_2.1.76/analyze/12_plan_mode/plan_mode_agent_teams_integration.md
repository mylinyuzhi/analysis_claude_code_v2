# Plan Mode x Agent Teams - Cross-Module Integration (Claude Code 2.1.76)

> **Module**: Plan Mode (12) x Agent Teams (30) Integration
> **Version**: Claude Code 2.1.76
> **Purpose**: Detail every integration point between Plan Mode and Agent Teams with source-level evidence

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode, Agent Teams sections)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (UI Components)

Key functions in this document:
- `ExitPlanModeTool` (zD) - Tool object with teammate approval branch - chunks.143.mjs:2802
- `handlePlanApproval` (AhY) - Team lead approves plan - chunks.145.mjs:2521
- `handlePlanRejection` (qhY) - Team lead rejects plan - chunks.145.mjs:2547
- `parsePlanApprovalResponse` (iP1) - Parse approval/rejection from mailbox - chunks.129.mjs:1428
- `spawnSplitPaneTeammate` (BNY) - Teammate spawn with planModeRequired flag - chunks.135.mjs:711
- `spawnInProcessTeammate` (FNY) - In-process teammate spawn - chunks.135.mjs:985
- `spawnTmuxTeammate` (gNY) - Tmux teammate spawn - chunks.135.mjs:838
- `buildPermissionArgs` (ti4) - Builds CLI permission flags including --plan-mode-required
- `InboxPoller plan_approval_response handler` - chunks.186.mjs:500-527
- `renderPlanApprovalRequest` ($fY) - Plan approval request UI - chunks.129.mjs:1756
- `renderPlanApprovalResponse` (OfY) - Plan approval response UI - chunks.129.mjs:1799
- `ExitPlanModeResultRenderer` (Kd4) - ExitPlanMode result with 3 states - chunks.139.mjs:2491
- `PlanApprovalRequestMessageSchema` (Vx4) - Zod schema - chunks.129.mjs:1546
- `PlanApprovalResponseMessageSchema` (Nx4) - Zod schema - chunks.129.mjs:1553
- `isTeammate` ($Y / Dz) - Checks if current agent is a teammate
- `isPlanModeRequired` (NF6) - Checks if plan mode is required for this teammate - chunks.84.mjs:1478
- `isTeamLead` (PM / KZ) - Checks if current agent is team lead
- `writeToMailbox` (x3) - Write message to agent mailbox - chunks.132.mjs:22
- `applyPermissionAction` (a2) - Permission context mode updates - chunks.42.mjs:1637
- `teamStatusUI` (gZ1) - Team status panel with awaitingPlanApproval - chunks.113.mjs:1616

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Teammate Plan Approval Flow](#2-teammate-plan-approval-flow)
3. [planModeRequired Flag](#3-planmoderequired-flag)
4. [Permission Mode Inheritance](#4-permission-mode-inheritance)
5. [System Reminder Integration](#5-system-reminder-integration)
6. [UI Integration](#6-ui-integration)
7. [State Management Interaction](#7-state-management-interaction)
8. [Tool Availability](#8-tool-availability)

---

## 1. Architecture Overview

The Plan Mode and Agent Teams modules share the most critical cross-module integration in Claude Code: the **teammate plan approval flow**. When a teammate is spawned with `planModeRequired: true`, it enters a supervised workflow where the team lead must review and approve every implementation plan before the teammate can execute.

```
+============================================================================+
|               PLAN MODE x AGENT TEAMS INTEGRATION MAP                      |
+============================================================================+
|                                                                            |
|  TEAM LEAD (main agent)                    TEAMMATE (spawned agent)        |
|  +--------------------------+              +---------------------------+   |
|  | toolPermissionContext     |              | toolPermissionContext      |   |
|  |   mode: "default"        |              |   mode: "plan" (forced)   |   |
|  |   prePlanMode: N/A       |              |   prePlanMode: N/A        |   |
|  +--------------------------+              +---------------------------+   |
|         |                                          |                      |
|         |  TeamCreate(mode:"plan")                 |                      |
|         +----------------------------------------->|                      |
|         |  planModeRequired=true                   |                      |
|         |                                          |                      |
|         |                                     [Teammate writes plan]       |
|         |                                          |                      |
|         |    plan_approval_request (mailbox)        |                      |
|         |<-----------------------------------------+                      |
|         |                                     [awaits approval]            |
|         |                                          |                      |
|    [LLM reviews plan]                              |                      |
|         |                                          |                      |
|         |    plan_approval_response (mailbox)       |                      |
|         +----------------------------------------->|                      |
|         |                                     [InboxPoller detects]        |
|         |                                     [mode -> "default"]          |
|         |                                     [begins implementation]     |
|                                                                            |
|  SHARED INFRASTRUCTURE:                                                    |
|  +-------------------------------------------------------------------+    |
|  | Mailbox System (x3/writeToMailbox) - File-based message delivery  |    |
|  | AppState.tasks[].awaitingPlanApproval - Per-teammate status       |    |
|  | Zod schemas (Vx4, Nx4) - Message validation                       |    |
|  | InboxPoller (chunks.186.mjs) - 500ms polling loop                 |    |
|  +-------------------------------------------------------------------+    |
|                                                                            |
+============================================================================+
```

---

## 2. Teammate Plan Approval Flow

This is the most critical integration point. When a teammate in plan mode calls ExitPlanMode, it does **not** exit plan mode -- instead, it sends a `plan_approval_request` to the team lead and waits.

### 2.1 Complete Sequence Diagram

```
Teammate                    Mailbox System              Team Lead
   |                             |                          |
   | ExitPlanMode.call()         |                          |
   |                             |                          |
   | -- $Y() check ------------>|                          |
   | -- NF6() check ----------->|                          |
   |   (is teammate AND          |                          |
   |    planModeRequired)        |                          |
   |                             |                          |
   | sJ() read plan file         |                          |
   | (must exist, else throw)    |                          |
   |                             |                          |
   | Build plan_approval_request |                          |
   |  {type, from, timestamp,    |                          |
   |   planFilePath, planContent,|                          |
   |   requestId}                |                          |
   |                             |                          |
   | x3("team-lead", msg, team)  |                          |
   |---------------------------->| [write to team-lead      |
   |                             |  mailbox file]           |
   |                             |                          |
   | findTeammateTask()          |                          |
   | setAwaitingPlanApproval     |                          |
   |   (true)                    |                          |
   |                             |                          |
   | return {                    |                          |
   |   awaitingLeaderApproval:   |                          |
   |   true, requestId }        |                          |
   |                             |                          |
   | [STILL IN PLAN MODE]       |                          |
   | [Tool-restricted]           |                          |
   |                             |                          |
   |                             | [Lead's InboxPoller      |
   |                             |  detects message]        |
   |                             |------------------------->|
   |                             |                          |
   |                             |    LLM reads plan        |
   |                             |    content from JSON     |
   |                             |                          |
   |                             |    DECISION:             |
   |                             |    approve or reject     |
   |                             |                          |
   |                             |  SendMessage tool with   |
   |                             |  plan_approval_response  |
   |                             |<-------------------------|
   |                             |                          |
   |                             | [handlePlanApproval/     |
   |                             |  handlePlanRejection]    |
   |                             |                          |
   |                             | [write to teammate       |
   |                             |  mailbox file]           |
   |                             |                          |
   | [Teammate InboxPoller       |                          |
   |  detects response]          |                          |
   |<----------------------------|                          |
   |                             |                          |
   | IF approved:                |                          |
   |   applyPermissionAction()   |                          |
   |   mode -> targetMode        |                          |
   |   (from response)           |                          |
   |                             |                          |
   | IF rejected:                |                          |
   |   stay in plan mode         |                          |
   |   log feedback              |                          |
   |   [revise plan, resubmit]   |                          |
   |                             |                          |
```

### 2.2 ExitPlanMode Teammate Branch

**What it does:** When a teammate calls ExitPlanMode, the tool's `call()` method detects the teammate context and routes to the approval submission path instead of the direct mode-change path.

**How it works:**

1. `$Y()` (isTeammate) checks if the current agent is a teammate (not the team lead)
2. `NF6()` (isPlanModeRequired) checks if plan mode was required at spawn time
3. Both must be true to enter the approval path
4. Plan file is read from disk -- must exist or throws an error
5. A unique `requestId` is generated for tracking
6. The plan is JSON-serialized and sent to the team-lead mailbox
7. The teammate's task metadata is updated with `awaitingPlanApproval: true`
8. Returns `{awaitingLeaderApproval: true}` to the teammate's LLM

```javascript
// ============================================
// ExitPlanMode.call - Teammate plan submission branch
// Location: chunks.143.mjs:2861-2872 (deep dive: chunks.12_plan_mode algorithm)
// ============================================

// ORIGINAL (for source lookup):
if ($Y() && NF6()) {
    if (!z) throw Error(`No plan file found at ${Y}. Please write your plan...`);

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

    await x3("team-lead", {
        from: H,
        text: JSON.stringify(M),
        timestamp: new Date().toISOString()
    }, j);

    return {
        data: {
            plan: z,
            isAgent: !0,
            filePath: Y,
            awaitingLeaderApproval: !0,
            requestId: J
        }
    };
}

// READABLE (for understanding):
if (isTeammate() && isPlanModeRequired()) {
    if (!planContent) throw Error(`No plan file found at ${planFilePath}. Please write your plan...`);

    let agentName = getAgentName() || "unknown",
        teamName = getTeamName(),
        requestId = generateRequestId("plan_approval", combineIds(agentName, teamName || "default")),
        approvalRequest = {
            type: "plan_approval_request",
            from: agentName,
            timestamp: new Date().toISOString(),
            planFilePath: planFilePath,
            planContent: planContent,
            requestId: requestId
        };

    await writeToMailbox("team-lead", {
        from: agentName,
        text: JSON.stringify(approvalRequest),
        timestamp: new Date().toISOString()
    }, teamName);

    return {
        data: {
            plan: planContent,
            isAgent: true,
            filePath: planFilePath,
            awaitingLeaderApproval: true,
            requestId: requestId
        }
    };
}

// Mapping: $Y→isTeammate, NF6→isPlanModeRequired, z→planContent, Y→planFilePath,
// i3→getAgentName, l5→getTeamName, bZ6→generateRequestId, ak→combineIds,
// x3→writeToMailbox, M→approvalRequest, J→requestId, H→agentName, j→teamName
```

**Why this approach:**
- **Reuses ExitPlanMode tool**: No separate "SubmitPlan" tool needed -- the existing ExitPlanMode is overloaded with teammate-specific behavior
- **File-based plans**: Plans are persisted to disk before submission, ensuring they survive crashes
- **Mailbox delivery**: Reuses the existing inter-agent communication infrastructure
- **Request ID tracking**: Enables matching responses to specific submissions

**Key insight:** The teammate does **not** exit plan mode at this point. The return value includes `awaitingLeaderApproval: true`, which tells the teammate's LLM to wait. The actual mode transition only happens later, asynchronously, when the InboxPoller picks up the team lead's response.

### 2.3 Team Lead Approval/Rejection Handlers

**What it does:** When the team lead's LLM decides to approve or reject a plan, it uses the SendMessage tool with a `plan_approval_response` structured message. The SendMessage tool dispatches to specialized handlers.

**How it works (approval):**

```javascript
// ============================================
// handlePlanApproval - Team lead sends approval to teammate
// Location: chunks.145.mjs:2521 (also referenced as chunks.141.mjs:1239)
// ============================================

// ORIGINAL (for source lookup):
async function AhY(A, q) {
    let K = await q.getAppState(),
        Y = K.teamContext?.teamName;
    if (!PM(K.teamContext))
        throw Error("Only the team lead can approve plans.");

    let z = K.toolPermissionContext.mode,
        w = z === "plan" || z === "delegate" ? "default" : z,
        H = {
            type: "plan_approval_response",
            requestId: A.request_id,
            approved: !0,
            timestamp: new Date().toISOString(),
            permissionMode: w
        };

    return f9(A.recipient, {
        from: K2,
        text: Q1(H),
        timestamp: new Date().toISOString()
    }, Y), {
        data: {
            success: !0,
            message: `Plan approved for ${A.recipient}.`
        }
    };
}

// READABLE (for understanding):
async function handlePlanApproval(params, context) {
    let appState = await context.getAppState(),
        teamName = appState.teamContext?.teamName;

    // Authorization: only team lead can approve
    if (!isTeamLead(appState.teamContext))
        throw Error("Only the team lead can approve plans.");

    // Determine target permission mode for teammate
    let currentMode = appState.toolPermissionContext.mode,
        targetMode = currentMode === "plan" || currentMode === "delegate"
            ? "default"
            : currentMode;

    let approvalResponse = {
        type: "plan_approval_response",
        requestId: params.request_id,
        approved: true,
        timestamp: new Date().toISOString(),
        permissionMode: targetMode  // teammate transitions to this mode
    };

    writeToMailbox(params.recipient, {
        from: "team-lead",
        text: JSON.stringify(approvalResponse),
        timestamp: new Date().toISOString()
    }, teamName);

    return {
        data: { success: true, message: `Plan approved for ${params.recipient}.` }
    };
}

// Mapping: AhY→handlePlanApproval, A→params, q→context, K→appState, Y→teamName,
// PM→isTeamLead, z→currentMode, w→targetMode, H→approvalResponse,
// f9→writeToMailbox, K2→"team-lead", Q1→JSON.stringify
```

**How it works (rejection):**

```javascript
// ============================================
// handlePlanRejection - Team lead sends rejection with feedback
// Location: chunks.145.mjs:2547 (also referenced as chunks.141.mjs:1265)
// ============================================

// ORIGINAL (for source lookup):
async function qhY(A, q) {
    let K = await q.getAppState(),
        Y = K.teamContext?.teamName;
    if (!PM(K.teamContext))
        throw Error("Only the team lead can reject plans.");

    let z = A.content || "Plan needs revision",
        w = {
            type: "plan_approval_response",
            requestId: A.request_id,
            approved: !1,
            feedback: z,
            timestamp: new Date().toISOString()
        };

    return f9(A.recipient, {
        from: K2,
        text: Q1(w),
        timestamp: new Date().toISOString()
    }, Y), {
        data: { success: !0, message: `Plan rejected for ${A.recipient} with feedback: "${z}"` }
    };
}

// READABLE (for understanding):
async function handlePlanRejection(params, context) {
    let appState = await context.getAppState(),
        teamName = appState.teamContext?.teamName;

    if (!isTeamLead(appState.teamContext))
        throw Error("Only the team lead can reject plans.");

    let feedback = params.content || "Plan needs revision",
        rejectionResponse = {
            type: "plan_approval_response",
            requestId: params.request_id,
            approved: false,
            feedback: feedback,
            timestamp: new Date().toISOString()
        };

    writeToMailbox(params.recipient, {
        from: "team-lead",
        text: JSON.stringify(rejectionResponse),
        timestamp: new Date().toISOString()
    }, teamName);

    return {
        data: { success: true, message: `Plan rejected for ${params.recipient} with feedback: "${feedback}"` }
    };
}

// Mapping: qhY→handlePlanRejection, A→params, q→context, z→feedback, w→rejectionResponse
```

**Critical difference between approve and reject:**
- Approval includes `permissionMode` (the mode to transition the teammate to)
- Rejection includes `feedback` (the revision guidance) but no `permissionMode`
- Approval triggers a mode change on the teammate; rejection does not

### 2.4 Teammate InboxPoller Response Processing

**What it does:** The teammate's polling loop detects `plan_approval_response` messages in its mailbox and automatically applies the mode transition (on approval) or logs feedback (on rejection).

**How it works:**

```javascript
// ============================================
// InboxPoller - Plan approval response detection and auto-transition
// Location: chunks.186.mjs:500-527
// ============================================

// ORIGINAL (for source lookup):
if (Dz() && MC1())
    for (let b of P) {
        let g = iP1(b.text);
        if (g && b.from === "team-lead")
            if (g.approved) {
                let U = g.permissionMode ?? "default";
                H((x) => ({
                    ...x,
                    toolPermissionContext: a2(x.toolPermissionContext, {
                        type: "setMode",
                        mode: KA1(U),
                        destination: "session"
                    })
                }));
            } else {
                h(`[InboxPoller] Plan rejected by team lead: ${g.feedback||"No feedback provided"}`)
            }
        else if (g) {
            h(`[InboxPoller] Ignoring plan approval response from non-team-lead: ${b.from}`)
        }
    }

// READABLE (for understanding):
if (isTeammate() && hasTeamConfig()) {
    for (let message of unreadMessages) {
        let approvalResponse = parsePlanApprovalResponse(message.text);

        if (approvalResponse && message.from === "team-lead") {
            if (approvalResponse.approved) {
                // APPROVED: exit plan mode to target permission mode
                let targetMode = approvalResponse.permissionMode ?? "default";
                setAppState((state) => ({
                    ...state,
                    toolPermissionContext: applyPermissionAction(
                        state.toolPermissionContext, {
                            type: "setMode",
                            mode: parsePermissionMode(targetMode),
                            destination: "session"
                        })
                }));
            } else {
                // REJECTED: stay in plan mode, log feedback
                debug(`[InboxPoller] Plan rejected: ${approvalResponse.feedback || "No feedback"}`);
            }
        } else if (approvalResponse) {
            // SECURITY: ignore approval from non-team-lead agents
            debug(`[InboxPoller] Ignoring from non-team-lead: ${message.from}`);
        }
    }
}

// Mapping: Dz→isTeammate, MC1→hasTeamConfig, iP1→parsePlanApprovalResponse,
// H→setAppState, a2→applyPermissionAction, KA1→parsePermissionMode, P→unreadMessages
```

**Why this approach:**
- **Automatic mode transition**: No manual step required after approval -- the InboxPoller handles it transparently
- **Security filter**: Only accepts responses from `"team-lead"` sender, ignoring spoofed messages from other teammates
- **Fallback mode**: Defaults to `"default"` if `permissionMode` is missing from response

**Key insight:** The mode transition is **asynchronous**. It happens during the next InboxPoller cycle (up to 500ms after the team lead sends the response), not synchronously within the ExitPlanMode call. This decouples the approval and the state change.

### 2.5 Revision Cycle

When a plan is rejected, the teammate stays in plan mode and the cycle repeats:

```
Teammate                               Team Lead
   |                                       |
   | [writes initial plan]                 |
   | ExitPlanMode -> plan_approval_request |
   |-------------------------------------->|
   |                                       | [reviews, rejects]
   |    plan_approval_response(false,      |
   |    feedback:"Add error handling")     |
   |<--------------------------------------|
   |                                       |
   | [reads feedback from mailbox]         |
   | [edits plan file via Edit tool]       |
   | ExitPlanMode -> plan_approval_request |
   |-------------------------------------->|
   |                                       | [reviews, approves]
   |    plan_approval_response(true,       |
   |    permissionMode:"default")          |
   |<--------------------------------------|
   |                                       |
   | [InboxPoller: mode="default"]         |
   | [begins implementation]               |
   |                                       |
```

There is no hard limit on revision cycles. The teammate can resubmit indefinitely. Each resubmission generates a new `requestId`, but the current implementation does not enforce one-pending-request-at-a-time -- it is possible (though unlikely) for a teammate to have multiple pending requests.

---

## 3. planModeRequired Flag

### 3.1 Flag Lifecycle

**What it does:** The `planModeRequired` flag controls whether a teammate must get plan approval before executing. It is set at spawn time and is immutable for the teammate's lifetime.

**How it works:**

```
TeamCreate(mode:"plan")
       |
       v
  spawnSplitPaneTeammate (BNY)
  / spawnTmuxTeammate (gNY)
  / spawnInProcessTeammate (FNY)
       |
       | plan_mode_required: mode === "plan"
       |
       v
  buildPermissionArgs (ti4)
       |
       | if planModeRequired: --plan-mode-required CLI flag
       | if not: inherits lead's permissionMode
       |
       v
  Teammate CLI process starts
       |
       v
  isPlanModeRequired (NF6) checks:
    1. teammateContext (from AsyncLocalStorage)
    2. in-process context
    3. env var CLAUDE_CODE_PLAN_MODE_REQUIRED
       |
       v
  If true: toolPermissionContext.mode = "plan" at initialization
```

### 3.2 Flag Detection (NF6)

**What it does:** `NF6` (isPlanModeRequired) resolves the plan mode requirement from multiple sources, supporting both in-process and split-pane teammate execution models.

**How it works:**

```javascript
// ============================================
// isPlanModeRequired - Multi-source plan mode flag resolution
// Location: chunks.84.mjs:1478
// ============================================

// READABLE (for understanding):
function isPlanModeRequired() {
    // Source 1: AsyncLocalStorage teammate context (in-process agents)
    let teammateCtx = getTeammateContext();
    if (teammateCtx?.planModeRequired !== undefined) {
        return teammateCtx.planModeRequired;
    }

    // Source 2: In-process agent context (alternative lookup)
    let inProcessCtx = getInProcessContext();
    if (inProcessCtx?.planModeRequired !== undefined) {
        return inProcessCtx.planModeRequired;
    }

    // Source 3: Environment variable (CLI-spawned agents)
    return parseBoolean(process.env.CLAUDE_CODE_PLAN_MODE_REQUIRED);
}
```

**Why this approach:**
- **Three resolution layers**: Supports all teammate execution models (in-process, tmux split-pane, separate CLI process)
- **AsyncLocalStorage first**: In-process agents use the most direct source
- **Env var fallback**: CLI-spawned agents receive the flag via `--plan-mode-required` which sets the env var
- **Immutable**: The flag is set at spawn and never changes -- there is no mechanism to un-require plan mode

### 3.3 Spawn-Time Permission Building

**What it does:** `buildPermissionArgs` (ti4) translates the `planModeRequired` flag and the lead's current permission mode into CLI flags for the spawned teammate process.

**How it works:**

```javascript
// ============================================
// buildPermissionArgs - CLI permission flags for spawned teammates
// Location: chunks.135.mjs:754 (referenced in BNY)
// ============================================

// READABLE (for understanding):
function buildPermissionArgs({ planModeRequired, permissionMode }) {
    let args = [];

    if (planModeRequired) {
        // Force teammate into plan mode
        args.push("--plan-mode-required");
    }

    // Pass the lead's current permission mode to teammate
    // (teammate starts in this mode after plan approval, or immediately if no plan mode)
    if (permissionMode && permissionMode !== "default") {
        args.push(`--permission-mode ${permissionMode}`);
    }

    return args.join(" ");
}
```

**Decision matrix:**

| `planModeRequired` | Lead's Mode | Teammate Initial Mode | After Approval |
|---------------------|-------------|----------------------|----------------|
| `true` | `default` | `plan` | `default` |
| `true` | `acceptEdits` | `plan` | `acceptEdits` |
| `true` | `bypassPermissions` | `plan` | `bypassPermissions` |
| `false` | `default` | `default` | N/A (no approval needed) |
| `false` | `acceptEdits` | `acceptEdits` | N/A |

**Key insight:** When `planModeRequired` is true, the teammate **always** starts in plan mode regardless of the lead's current mode. The lead's mode only matters for determining what mode the teammate transitions to **after** approval.

---

## 4. Permission Mode Inheritance

### 4.1 Mode Calculation at Approval Time

**What it does:** When the team lead approves a plan, the approval response includes a `permissionMode` field that tells the teammate what mode to transition to. This mode is derived from the team lead's **current** mode at approval time, not at spawn time.

**How it works:**

```javascript
// From handlePlanApproval (AhY):
let currentMode = appState.toolPermissionContext.mode,
    targetMode = currentMode === "plan" || currentMode === "delegate"
        ? "default"
        : currentMode;
```

### 4.2 Mode Inheritance Rules

**What it does:** Maps the team lead's current mode to the teammate's post-approval mode, with special handling for modes that do not make sense for teammates.

| Team Lead Mode | Teammate Gets | Rationale |
|----------------|---------------|-----------|
| `default` | `default` | Standard permissions -- teammate asks user for risky operations |
| `acceptEdits` | `acceptEdits` | File edits auto-approved -- trusted for code changes |
| `bypassPermissions` | `bypassPermissions` | Full unrestricted access -- maximum trust |
| `plan` | `default` (downgraded) | Plan mode is for planning, not execution -- useless for a teammate about to implement |
| `delegate` | `default` (downgraded) | Delegate mode is lead-only -- teammates should not delegate further |

**Why this approach:**
- Approval-time inheritance means the lead can dynamically control teammate permissions by changing their own mode before approving
- Downgrading `plan` and `delegate` prevents nonsensical states (a teammate approved to execute should not still be in plan mode)
- `bypassPermissions` escalation path allows trusted teammates to run without interruption

**Alternative considered:** Always transition to `default`.
**Trade-off:** Fixed-mode is safer but inflexible. The current approach enables "trusted teammate" workflows where the lead grants elevated permissions to accelerate execution.

---

## 5. System Reminder Integration

### 5.1 Separate Attachment Injection

Plan mode reminders and team context are injected as **independent attachments** into the LLM context. They do not share a delivery path.

```
Agent Loop Turn
    |
    +-- getPlanModeAttachment (DuY)
    |     Returns: [{type: "plan_mode", reminderType: "full"|"sparse", ...}]
    |     Only if toolPermissionContext.mode === "plan"
    |
    +-- getTeamContextAttachment
    |     Returns: [{type: "team_context", ...}]
    |     Only if agent is a teammate with team context
    |
    +-- getTeammateMailboxAttachment
          Returns: [{type: "teammate_mailbox", messages: [...]}]
          Only if unread messages exist in mailbox
```

**Key insight:** The plan mode attachment and team context attachment are **independent**. A teammate in plan mode receives **both** -- the plan mode reminder (which tells the LLM about the 5-phase plan workflow and available tools) and the team context (which provides team membership, task assignments, and mailbox state). Neither depends on the other.

### 5.2 Plan Mode Reminders in Team Context

The plan mode reminder content (`Nzz`, `Ezz`, `kzz`, `yzz` -- the 5-phase plan workflow instructions) references subagent types that are relevant to agent teams:

- The **Explore subagent type** (`QB.agentType`) is referenced in plan phase instructions -- teammates can spawn exploration subagents to research before planning
- The **Plan subagent type** (`x01.agentType`) is referenced for plan refinement subagents
- **Agent count limits** (`iJ7()`, `nJ7()`) control how many parallel agents the plan mode suggests -- these limits are the same whether running as the main agent or as a teammate

However, these references are informational -- they tell the LLM what subagents are available during planning. The teammate's actual ability to spawn subagents is controlled by tool availability in plan mode (most spawn-related tools are blocked).

### 5.3 System Prompt Instructions for Team Lead

The team lead's system prompt includes explicit instructions for handling `plan_approval_request` messages (chunks.141.mjs:950-976):

```
### type: "plan_approval_response" - Approve or Reject a Teammate's Plan

#### Approve Plan
When a teammate with plan_mode_required calls ExitPlanMode, they send you a
plan approval request as a JSON message. Use this to approve:
{
  "type": "plan_approval_response",
  "request_id": "abc-123",
  "recipient": "researcher",
  "approve": true
}

#### Reject Plan
{
  "type": "plan_approval_response",
  "request_id": "abc-123",
  "recipient": "researcher",
  "approve": false,
  "content": "Please add error handling for the API calls"
}
```

The LLM autonomously decides approval or rejection based on plan quality. There is no mandatory user confirmation, though the user can steer the decision via real-time interrupts.

---

## 6. UI Integration

### 6.1 ExitPlanMode Result Renderer (Kd4)

**What it does:** `Kd4` (ExitPlanModeResultRenderer, chunks.139.mjs:2491) renders the ExitPlanMode tool result differently based on context. It has three states relevant to the plan-teams integration:

**State 1 -- No plan (simple exit):**
```
Exited plan mode
```

**State 2 -- Teammate awaiting approval:**
```
+-------------------------------------------------------+
| Plan submitted for team lead approval                  |
|                                                        |
| # Implementation Plan                                  |
| ## Approach                                            |
| 1. Read existing API endpoint file                    |
| 2. Add new route handler for /api/users               |
| ...                                                    |
|                                                        |
| Waiting for team lead to review...                    |
+-------------------------------------------------------+
```

**State 3 -- User approved (main session):**
```
+-------------------------------------------------------+
| User approved Claude's plan                            |
|                                                        |
| [plan preview]                                         |
+-------------------------------------------------------+
```

### 6.2 Plan Approval Request UI ($fY)

**What it does:** When the team lead receives a `plan_approval_request`, it is rendered as a bordered box with `planMode` theme color (purple/magenta).

```
+-- Plan Approval Request from researcher ------+
|                                                |
| ................................................|
| # Implementation Plan                          |
|                                                |
| ## Approach                                    |
| 1. Read existing API endpoint file            |
| 2. Add new route handler for /api/users       |
| 3. Write unit tests                           |
| ................................................|
|                                                |
| Plan file: ~/.claude/plans/researcher.../plan.md|
+------------------------------------------------+
```

### 6.3 Plan Approval Response UI (OfY)

**What it does:** When a teammate receives an approval or rejection, it renders a confirmation box.

Approval:
```
+-- Success -----------------------------------------+
| V Plan Approved by team-lead                       |
|                                                    |
| You can now proceed with implementation.          |
| Your plan mode restrictions have been lifted.     |
+----------------------------------------------------+
```

Rejection:
```
+-- Warning -----------------------------------------+
| X Plan Rejected by team-lead                       |
|                                                    |
| Feedback: Please add error handling for the       |
| API calls and include unit test coverage          |
|                                                    |
| Please revise your plan and resubmit.             |
+----------------------------------------------------+
```

### 6.4 Team Status Panel (gZ1)

**What it does:** `gZ1` (teamStatusUI, chunks.113.mjs:1616) displays the overall team status panel. It shows `awaitingPlanApproval` status per teammate.

```
+-- Team Status ---------------------------------+
| Team: my-project                               |
|                                                |
| researcher  [awaiting plan approval]          |
| coder       [active - implementing]           |
| tester      [idle - available]                |
+------------------------------------------------+
```

The `awaitingPlanApproval` flag is read from `AppState.tasks[taskId]` for each teammate and displayed as a distinct status indicator.

---

## 7. State Management Interaction

### 7.1 State Variables per Agent Type

The plan mode and agent teams modules interact through shared state, but different state variables apply to different agent types:

```
+================================================================+
|                    STATE VARIABLE SCOPE                          |
+================================================================+
|                                                                  |
|  MAIN AGENT ONLY:                                               |
|  +------------------------------------------------------------+|
|  | hasExitedPlanMode (globalSessionState)                       ||
|  |   - Tracks if user previously exited plan mode               ||
|  |   - Used for re-entry detection                              ||
|  |                                                              ||
|  | needsPlanModeExitAttachment (globalSessionState)              ||
|  |   - Signals exit attachment generation                       ||
|  |                                                              ||
|  | prePlanMode (toolPermissionContext)                           ||
|  |   - Mode before entering plan mode                           ||
|  |   - Used to restore previous mode on exit                    ||
|  |   - NOT SET for teammates (they don't cycle modes)           ||
|  +------------------------------------------------------------+|
|                                                                  |
|  TEAMMATE ONLY:                                                  |
|  +------------------------------------------------------------+|
|  | AppState.tasks[taskId].awaitingPlanApproval                  ||
|  |   - Set to true after ExitPlanMode submits request           ||
|  |   - Cleared after InboxPoller processes response             ||
|  |                                                              ||
|  | AppState.tasks[taskId].permissionMode                        ||
|  |   - Stores "plan" or post-approval mode per teammate         ||
|  |   - Written at spawn, updated on approval                    ||
|  |                                                              ||
|  | planModeRequired (teammate identity - immutable)              ||
|  |   - Set at spawn, never changes                              ||
|  |   - Stored in AsyncLocalStorage / env var                    ||
|  +------------------------------------------------------------+|
|                                                                  |
|  SHARED (both agent types):                                      |
|  +------------------------------------------------------------+|
|  | toolPermissionContext.mode                                    ||
|  |   - Current permission mode ("plan", "default", etc.)        ||
|  |   - Updated by applyPermissionAction (a2)                    ||
|  +------------------------------------------------------------+|
|                                                                  |
+================================================================+
```

### 7.2 Key Differences Between Main Agent and Teammates

**prePlanMode**: Only used by the main agent. When the main agent enters plan mode (via EnterPlanMode or shift+tab cycling), the previous mode is saved to `prePlanMode` so it can be restored on exit. Teammates do not use `prePlanMode` because:
1. They start in plan mode from initialization (no "previous" mode exists)
2. Their post-approval mode comes from the team lead's approval response, not from a saved state

**hasExitedPlanMode / needsPlanModeExitAttachment**: Only used by the main agent for plan-mode re-entry detection and attachment generation. Teammates do not cycle modes -- they either stay in plan mode or transition to execution mode on approval.

**awaitingPlanApproval**: Only exists in teammate task metadata. The main agent does not have this field because it uses the synchronous user-facing approval dialog instead.

### 7.3 Mode Fixed for Teammates

**What it does:** Teammates do not have the ability to cycle permission modes via shift+tab. Their mode is fixed based on `planModeRequired`.

**Why this matters:**
- The main agent can cycle: `default -> plan -> acceptEdits -> bypassPermissions -> default`
- Teammates cannot cycle. If `planModeRequired` is true, they start in `plan` and can only leave via approval.
- If `planModeRequired` is false, they start in the inherited mode and stay there.
- EnterPlanMode is **blocked** in agent contexts: it throws `"EnterPlanMode tool cannot be used in agent contexts"`

---

## 8. Tool Availability

### 8.1 Teammate Plan Mode Tool Restrictions

Teammates in plan mode have the same tool restrictions as the main agent in plan mode. Only read-only tools are available:

| Available (isReadOnly = true) | Blocked (isReadOnly = false) |
|-------------------------------|------------------------------|
| Read, Glob, Grep | Write, Edit, MultiEdit |
| WebFetch, WebSearch | Bash (write commands) |
| AskUserQuestion, TaskList | NotebookEdit |
| ExitPlanMode | TeamCreate, TeamDelete |
| Bash (read-only commands) | SendMessage (except plan approval) |

**Exception -- Plan file writing**: Teammates can write to their plan file (`~/.claude/plans/{agentId}/plan.md`) even in plan mode. The Write/Edit tools check if the target path matches the plan file path and allow it.

### 8.2 ExitPlanMode Routing

**What it does:** ExitPlanMode behaves differently for the main agent vs. teammates:

```
ExitPlanMode called
       |
       +-- Main agent ($Y()=false):
       |     checkPermissions -> {behavior: "ask"}
       |     Shows "Ready to code?" dialog (aPq)
       |     User approves/rejects directly
       |     Mode changes synchronously
       |
       +-- Teammate ($Y()=true AND NF6()=true):
       |     checkPermissions -> {behavior: "allow"}  (bypasses user)
       |     Sends plan_approval_request to team lead
       |     Returns awaitingLeaderApproval
       |     Mode changes asynchronously (InboxPoller)
       |
       +-- Teammate ($Y()=true AND NF6()=false):
             Standard exit (no approval needed)
             Mode changes synchronously
```

### 8.3 EnterPlanMode Blocked for Agents

**What it does:** EnterPlanMode explicitly blocks execution in agent contexts to prevent teammates from re-entering plan mode after approval.

```javascript
// From EnterPlanMode tool validation:
if (isAgentContext()) {
    throw Error("EnterPlanMode tool cannot be used in agent contexts");
}
```

**Why:** Once a teammate exits plan mode (via approval), they should not be able to re-enter it. Plan mode for teammates is controlled exclusively by the `planModeRequired` flag and the approval flow.

### 8.4 SendMessage Tool Plan Approval Types

The SendMessage tool (YhY, chunks.141.mjs:1373) has specialized handlers for plan approval messages:

- `plan_approval_response` with `approve: true` dispatches to `handlePlanApproval` (AhY)
- `plan_approval_response` with `approve: false` dispatches to `handlePlanRejection` (qhY)
- Both handlers validate that the caller `isTeamLead()` before proceeding

This means only the SendMessage tool can send plan approval responses, and only the team lead can invoke it for this purpose.

---

## Design Rationale Summary

### Why Plan Mode for Teammates?

**Problem:** Autonomous LLM teammates with full tool access can execute destructive or misaligned changes without review.

**Solution:** The plan-first workflow creates a checkpoint where the team lead reviews the approach before execution begins.

**Trade-offs:**
- (+) Safety: all changes reviewed before execution
- (+) Alignment: ensures teammate approach matches strategy
- (-) Latency: adds 30-60 seconds per task for plan submission and approval
- (-) Overhead: simple tasks still require planning

### Why Reuse Mailbox Instead of a Separate Channel?

**Problem:** Need reliable inter-agent communication for plan approval.

**Solution:** Reuse existing mailbox infrastructure with specialized JSON message types.

**Trade-offs:**
- (+) No new infrastructure needed
- (+) File locking handles concurrency
- (+) Messages persist across crashes
- (-) 500ms polling latency
- (-) No priority queue (approvals processed alongside regular messages)

### Why Automatic Mode Transition?

**Problem:** After approval, the teammate needs to start executing without manual intervention.

**Solution:** InboxPoller automatically transitions mode when approval is detected.

**Trade-offs:**
- (+) Seamless -- no explicit "confirm approval" step needed
- (+) Atomic state update via setAppState
- (-) Asynchronous -- up to 500ms delay between approval and mode change
- (-) Implicit -- LLM infers mode change from context rather than an explicit tool response
