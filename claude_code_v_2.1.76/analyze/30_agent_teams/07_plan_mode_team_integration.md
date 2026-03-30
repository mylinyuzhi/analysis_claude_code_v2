# Plan Mode Integration with Agent Teams

> **Module**: Agent Teams - Plan Mode Integration
> **Version**: Claude Code 2.1.76
> **Purpose**: Document the complete plan approval workflow for teammates requiring plan mode

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Plan Mode Activation for Teammates](#2-plan-mode-activation-for-teammates)
3. [Plan Submission Protocol](#3-plan-submission-protocol)
4. [Team Lead Review Mechanism](#4-team-lead-review-mechanism)
5. [Approval Message Handlers](#5-approval-message-handlers)
6. [Teammate Response Processing](#6-teammate-response-processing)
7. [Plan Revision Cycle](#7-plan-revision-cycle)
8. [Mode Transition Details](#8-mode-transition-details)
9. [Design Rationale & Trade-offs](#9-design-rationale--trade-offs)

---

## 1. Executive Summary

Plan mode integration with agent teams implements a **plan-first workflow** where teammates must submit implementation plans for team lead approval before proceeding with code changes. This creates a **review checkpoint** that ensures:

1. **Alignment**: Team lead verifies teammate approach matches overall strategy
2. **Safety**: Prevents teammates from executing destructive or incorrect changes without oversight
3. **Context preservation**: Team lead stays informed of all planned changes before they happen
4. **Iteration**: Rejected plans include feedback, enabling plan refinement

**Architecture**: Plan approval uses the **mailbox messaging system** with specialized message types (`plan_approval_request`, `plan_approval_response`) and **status tracking** via teammate metadata (`awaitingLeaderApproval` flag).

**Key components**:
- Teammate ExitPlanMode tool → triggers plan submission
- Mailbox-based message delivery → `plan_approval_request` JSON payload
- Team lead LLM decision → uses SendMessage tool with `plan_approval_response`
- InboxPoller response processing → automatic mode transition on approval
- Revision cycle → teammate receives feedback, revises, resubmits

---

## 2. Plan Mode Activation for Teammates

### 2.1 Trigger Mechanism

**What it does**: When creating a teammate, the team lead can require plan mode by passing `mode: "plan"` parameter to TeamCreate tool.

**How it works**:

```javascript
// ============================================
// spawnSplitPaneTeammate (BNY) - Spawn pane-based teammate with plan_mode_required
// Location: chunks.135.mjs:711-...
// ============================================

// ORIGINAL (for source lookup):
async function BNY(A, q) {
    let { setAppState: K, getAppState: Y } = q,
        { name: z, prompt: _, agent_type: w, cwd: O, plan_mode_required: $ } = A,
        H = yu8(A.model, Y().mainLoopModel);
    if (!z || !_) throw Error("name and prompt are required for spawn operation");
    let j = Y(),
        J = A.team_name || j.teamContext?.teamName;
    if (!J) throw Error("team_name is required...");
    let M = await hu8(z, J),     // hu8 = deduplicateTeammateName
        D = Lu8(M),               // Lu8 = formatAgentName
        X = ak(D, J),             // ak = hashCombine → agentId
        P = O || G1(),
        // ... iTerm2 setup check, pane creation ...
        V = [`--agent-id ${j4([X])}`,
             `--agent-name ${j4([D])}`,
             `--team-name ${j4([J])}`,
             `--agent-color ${j4([G])}`,
             `--parent-session-id ${j4([R1()])}`,
             $ ? "--plan-mode-required" : "",  // ← plan_mode_required passed as CLI flag
             w ? `--agent-type ${j4([w])}` : ""].filter(Boolean).join(" ");
    // ...
}

// READABLE (for understanding):
async function spawnSplitPaneTeammate(spawnInput, toolContext) {
    let { setAppState, getAppState } = toolContext,
        { name, prompt, agent_type, cwd, plan_mode_required } = spawnInput,
        model = resolveModel(spawnInput.model, getAppState().mainLoopModel);

    if (!name || !prompt) throw Error("name and prompt are required for spawn operation");

    let appState = getAppState(),
        teamName = spawnInput.team_name || appState.teamContext?.teamName;
    if (!teamName) throw Error("team_name is required...");

    let dedupedName = await deduplicateTeammateName(name, teamName),  // hu8
        agentName = formatAgentName(dedupedName),                      // Lu8
        agentId = hashCombine(agentName, teamName);                    // ak

    // Build CLI args for new pane process
    let cliArgs = [
        `--agent-id ${shellQuote([agentId])}`,
        `--agent-name ${shellQuote([agentName])}`,
        `--team-name ${shellQuote([teamName])}`,
        `--agent-color ${shellQuote([agentColor])}`,
        `--parent-session-id ${shellQuote([getSessionId()])}`,
        plan_mode_required ? "--plan-mode-required" : "",  // ← plan mode flag
        agent_type ? `--agent-type ${shellQuote([agent_type])}` : ""
    ].filter(Boolean).join(" ");
    // ...
}

// Mapping: BNY→spawnSplitPaneTeammate, A→spawnInput, q→toolContext, z→name, _→prompt,
//          w→agent_type, O→cwd, $→plan_mode_required, H→model, J→teamName,
//          hu8→deduplicateTeammateName, Lu8→formatAgentName, ak→hashCombine, G1→getCwd,
//          j4→shellQuote, R1→getSessionId
```

**Plan mode derivation** (chunks.132.mjs:147):

```javascript
// ORIGINAL:
plan_mode_required: _ === "plan"

// READABLE:
plan_mode_required: mode === "plan"
```

**Why this approach**:
- **Explicit control**: Team lead decides per-teammate whether planning is required
- **Flexible**: Not all teammates need plan mode (e.g., read-only research agents don't)
- **Mode parameter reuse**: Same `mode` parameter used for all permission modes (default, plan, delegate)

**Alternative considered**: Auto-enable plan mode for all teammates.
**Trade-off**: Explicit mode selection adds verbosity but provides granular control. For simple tasks, plan mode overhead is unnecessary.

### 2.2 Teammate Initialization in Plan Mode

**What it does**: When `plan_mode_required: true`, the teammate's agent loop starts with `mode: "plan"` in its toolPermissionContext.

**How it works**:

The teammate identity structure includes the plan mode requirement:

```javascript
// ============================================
// inProcessAgentRunner - Identity setup with plan mode flag
// Location: chunks.131.mjs:347-400
// ============================================

// ORIGINAL (for source lookup):
let P = {
    agentId: q.agentId,
    parentSessionId: q.parentSessionId,
    agentName: q.agentName,
    teamName: q.teamName,
    agentColor: q.color,
    planModeRequired: q.planModeRequired,  // ← Flag passed to agent context
    isTeamLead: !1,
    agentType: "teammate"
};

// READABLE (for understanding):
let teammateIdentity = {
    agentId: identity.agentId,
    parentSessionId: identity.parentSessionId,
    agentName: identity.agentName,
    teamName: identity.teamName,
    agentColor: identity.color,
    planModeRequired: identity.planModeRequired,  // ← Controls initial mode
    isTeamLead: false,
    agentType: "teammate"
};

// Mapping: P→teammateIdentity, q→identity
```

The system prompt injection for teammates in plan mode includes instructions on using ExitPlanMode to request approval (see Section 3).

**Key insight**: The `planModeRequired` flag is **immutable** for the teammate's lifetime—it cannot be changed after spawning. If a teammate starts with plan mode required, it will always need approval for subsequent plans.

---

## 3. Plan Submission Protocol

### 3.1 ExitPlanMode Tool for Teammates

**What it does**: When a teammate in plan mode calls ExitPlanMode, it triggers a plan approval request to the team lead instead of directly exiting plan mode.

**How it works**:

```javascript
// ============================================
// ExitPlanMode.call() - Teammate branch: plan approval request submission
// Location: chunks.143.mjs:2875-2908
// ============================================

// ORIGINAL (for source lookup):
// Inside zD.call(A, q):
let K = !!q.agentId,
    Y = Fj(q.agentId),   // Fj = getPlanFilePath
    z = sJ(q.agentId);   // sJ = getPlanContent
if ($Y() && NF6()) {     // $Y = isTeammate, NF6 = isPlanModeRequired
    if (!z) throw Error(`No plan file found at ${Y}. Please write your plan to this file before calling ExitPlanMode.`);
    let H = i3() || "unknown",    // i3 = getCurrentAgentName
        j = l5(),                  // l5 = getCurrentTeamName
        J = bZ6("plan_approval", ak(H, j || "default")),  // bZ6 = generateUniqueId, ak = hashCombine
        M = {
            type: "plan_approval_request",
            from: H,
            timestamp: new Date().toISOString(),
            planFilePath: Y,
            planContent: z,
            requestId: J
        };
    await x3("team-lead", {        // x3 = writeToMailbox
        from: H,
        text: B6(M),               // B6 = JSON.stringify
        timestamp: new Date().toISOString()
    }, j);
    let D = q.getAppState(),       // NOTE: sync call, not await
        X = ik1(H, D);             // ik1 = findTeammateTaskByName
    if (X) ag8(X, q.setAppState, !0);  // ag8 = setAwaitingPlanApproval
    return {
        data: {
            plan: z,
            isAgent: !0,
            filePath: Y,
            awaitingLeaderApproval: !0,
            requestId: J
        }
    }
}

// READABLE (for understanding):
// Inside ExitPlanModeTool.call(input, toolContext):
let isAgentContext = !!toolContext.agentId,
    planFilePath = getPlanFilePath(toolContext.agentId),  // Fj
    planContent = getPlanContent(toolContext.agentId);    // sJ

if (isTeammate() && isPlanModeRequired()) {   // $Y() && NF6()
    if (!planContent) {
        throw Error(`No plan file found at ${planFilePath}. Please write your plan to this file before calling ExitPlanMode.`);
    }
    let agentName = getCurrentAgentName() || "unknown",  // i3()
        teamName = getCurrentTeamName(),                  // l5()
        requestId = generateUniqueId("plan_approval", hashCombine(agentName, teamName || "default")),  // bZ6(ak())
        approvalRequest = {
            type: "plan_approval_request",
            from: agentName,
            timestamp: new Date().toISOString(),
            planFilePath: planFilePath,
            planContent: planContent,
            requestId: requestId
        };

    // Send to team lead's mailbox (x3 = writeToMailbox)
    await writeToMailbox("team-lead", {
        from: agentName,
        text: JSON.stringify(approvalRequest),  // B6
        timestamp: new Date().toISOString()
    }, teamName);

    // Mark teammate as awaiting approval (sync getAppState)
    let appState = toolContext.getAppState(),       // SYNC — no await
        teammateTask = findTeammateTaskByName(agentName, appState);  // ik1
    if (teammateTask) {
        setAwaitingPlanApproval(teammateTask, toolContext.setAppState, true);  // ag8
    }

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

// Mapping: zD→ExitPlanModeTool, Fj→getPlanFilePath, sJ→getPlanContent,
//          $Y→isTeammate, NF6→isPlanModeRequired, i3→getCurrentAgentName, l5→getCurrentTeamName,
//          bZ6→generateUniqueId, ak→hashCombine, x3→writeToMailbox, B6→JSON.stringify,
//          ik1→findTeammateTaskByName, ag8→setAwaitingPlanApproval
```

**Step-by-step flow**:

1. **Validation**: Check that plan file exists at `~/.claude/plans/{agentId}/plan.md`
2. **Read plan content**: Load full plan text from file
3. **Generate request ID**: Create unique identifier for tracking this approval request
4. **Create request message**: Build JSON object with:
   - `type: "plan_approval_request"`
   - `from`: teammate name (e.g., "researcher")
   - `planContent`: Full plan markdown text
   - `planFilePath`: Path to plan file
   - `requestId`: Unique tracking ID
5. **Send to team lead mailbox**: Use `writeToMailbox("team-lead", ...)` with JSON-stringified request
6. **Update teammate status**: Set `awaitingLeaderApproval: true` in teammate task metadata
7. **Return to LLM**: Inform teammate that plan was submitted and they're awaiting approval

**Why this approach**:
- **File-based plans**: Plans are written to filesystem first, ensuring they're persisted and reviewable
- **Mailbox delivery**: Reuses existing message infrastructure (no special plan delivery channel)
- **Structured JSON**: Enables programmatic parsing by team lead's system prompt
- **Request ID**: Allows matching approval/rejection responses to original requests
- **Status tracking**: `awaitingLeaderApproval` flag prevents teammate from proceeding until approved

**Key insight**: The teammate's agent loop **does NOT exit plan mode** at this point. It remains in plan mode, awaiting the team lead's response. This prevents the teammate from executing tools while approval is pending.

### 3.2 Plan Approval Request Schema

**Message structure**:

```javascript
// ============================================
// PlanApprovalRequestMessageSchema - Zod schema for validation
// Location: chunks.129.mjs:1546-1552
// ============================================

// ORIGINAL (for source lookup):
Vx4 = u.object({
    type: u.literal("plan_approval_request"),
    from: u.string(),
    timestamp: u.string(),
    planFilePath: u.string(),
    planContent: u.string(),
    requestId: u.string()
});

// READABLE (for understanding):
PlanApprovalRequestMessageSchema = zod.object({
    type: zod.literal("plan_approval_request"),
    from: zod.string(),  // Teammate name (e.g., "researcher")
    timestamp: zod.string(),  // ISO 8601 timestamp
    planFilePath: zod.string(),  // Path to plan file
    planContent: zod.string(),  // Full plan markdown content
    requestId: zod.string()  // Unique identifier for this request
});

// Mapping: Vx4→PlanApprovalRequestMessageSchema, u→zod
```

**Example payload**:

```json
{
  "type": "plan_approval_request",
  "from": "researcher",
  "timestamp": "2025-01-15T14:32:00.000Z",
  "planFilePath": "/Users/alice/.claude/plans/researcher-abc123/plan.md",
  "planContent": "# Implementation Plan\n\n## Approach\n...",
  "requestId": "plan_approval_researcher-abc123_1737823920000"
}
```

---

## 4. Team Lead Review Mechanism

### 4.1 Plan Request Rendering in Team Lead UI

**What it does**: When the team lead receives a `plan_approval_request` message, it's rendered as a special UI component showing the plan content.

**How it works**:

```javascript
// ============================================
// PlanApprovalRequestRenderer - UI rendering for plan approval requests
// Location: chunks.129.mjs:1756-1796
// ============================================

// ORIGINAL (for source lookup):
function $fY(A) {
    let q = e(10),
        { request: K } = A,
        Y;
    if (q[0] !== K.from)
        Y = G3.createElement(I, { marginBottom: 1 },
            G3.createElement(V, { color: "planMode", bold: !0 },
                "Plan Approval Request from ", K.from)),
        q[0] = K.from, q[1] = Y;
    else Y = q[1];

    let z;
    if (q[2] !== K.planContent)
        z = G3.createElement(I, {
            borderStyle: "dashed",
            borderColor: "subtle",
            borderLeft: !1,
            borderRight: !1,
            flexDirection: "column",
            paddingX: 1,
            marginBottom: 1
        }, G3.createElement(TJ, null, K.planContent)),
        q[2] = K.planContent, q[3] = z;
    else z = q[3];

    let w;
    if (q[4] !== K.planFilePath)
        w = G3.createElement(V, { dimColor: !0 }, "Plan file: ", K.planFilePath),
        q[4] = K.planFilePath, q[5] = w;
    else w = q[5];

    return G3.createElement(I, { flexDirection: "column", marginY: 1 },
        G3.createElement(I, {
            borderStyle: "round",
            borderColor: "planMode",
            flexDirection: "column",
            paddingX: 1
        }, Y, z, w));
}

// READABLE (for understanding):
function renderPlanApprovalRequest(props) {
    let memoCache = useMemoCache(10),
        { request } = props,
        headerElement;

    // Render header: "Plan Approval Request from {teammate}"
    if (memoCache[0] !== request.from) {
        headerElement = createElement(Box, { marginBottom: 1 },
            createElement(Text, { color: "planMode", bold: true },
                "Plan Approval Request from ", request.from));
        memoCache[0] = request.from;
        memoCache[1] = headerElement;
    } else {
        headerElement = memoCache[1];
    }

    // Render plan content with dashed border
    let planContentElement;
    if (memoCache[2] !== request.planContent) {
        planContentElement = createElement(Box, {
            borderStyle: "dashed",
            borderColor: "subtle",
            borderLeft: false,
            borderRight: false,
            flexDirection: "column",
            paddingX: 1,
            marginBottom: 1
        }, createElement(MarkdownRenderer, null, request.planContent));
        memoCache[2] = request.planContent;
        memoCache[3] = planContentElement;
    } else {
        planContentElement = memoCache[3];
    }

    // Render file path
    let filePathElement;
    if (memoCache[4] !== request.planFilePath) {
        filePathElement = createElement(Text, { dimColor: true },
            "Plan file: ", request.planFilePath);
        memoCache[4] = request.planFilePath;
        memoCache[5] = filePathElement;
    } else {
        filePathElement = memoCache[5];
    }

    // Combine into bordered box with planMode color
    return createElement(Box, { flexDirection: "column", marginY: 1 },
        createElement(Box, {
            borderStyle: "round",
            borderColor: "planMode",
            flexDirection: "column",
            paddingX: 1
        }, headerElement, planContentElement, filePathElement));
}

// Mapping: $fY→renderPlanApprovalRequest, G3→React, I→Box, V→Text, TJ→MarkdownRenderer,
// e→useMemoCache, A→props, K→request
```

**Visual output** (example):

```
┌─ Plan Approval Request from researcher ─────────────┐
│                                                      │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│ # Implementation Plan                                │
│                                                      │
│ ## Approach                                          │
│ 1. Read existing API endpoint file                  │
│ 2. Add new route handler for /api/users             │
│ 3. Write unit tests                                 │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│                                                      │
│ Plan file: /Users/alice/.claude/plans/researcher... │
└──────────────────────────────────────────────────────┘
```

**Why this approach**:
- **Markdown rendering**: Plan content is rendered as formatted markdown for readability
- **Visual distinction**: `borderColor: "planMode"` (purple/magenta) distinguishes plan requests from regular messages
- **File path reference**: Team lead can manually inspect the plan file if needed
- **React memoization**: Prevents re-rendering plan content unnecessarily (performance optimization)

### 4.2 Team Lead Decision via LLM

**What it does**: The team lead's LLM reads the plan approval request and decides whether to approve or reject.

**System prompt instructions** (chunks.141.mjs:950-976):

```markdown
### type: "plan_approval_response" - Approve or Reject a Teammate's Plan

#### Approve Plan

When a teammate with `plan_mode_required` calls ExitPlanMode, they send you a plan approval request as a JSON message with `type: "plan_approval_request"`. Use this to approve their plan:

```
{
  "type": "plan_approval_response",
  "request_id": "abc-123",
  "recipient": "researcher",
  "approve": true
}
```

After approval, the teammate will automatically exit plan mode and can proceed with implementation.

#### Reject Plan

```
{
  "type": "plan_approval_response",
  "request_id": "abc-123",
  "recipient": "researcher",
  "approve": false,
  "content": "Please add error handling for the API calls"
}
```

The teammate will receive the rejection with your feedback and can revise their plan.
```

**Decision algorithm** (LLM reasoning):

1. **Read plan content**: LLM parses the `planContent` field from the request
2. **Evaluate against task**: Check if plan aligns with original task assignment
3. **Assess completeness**: Ensure plan covers all necessary steps
4. **Check for risks**: Identify potential issues (destructive operations, missing validations, etc.)
5. **Make decision**:
   - **Approve**: If plan is complete, safe, and aligned
   - **Reject**: If plan needs revision, with specific feedback in `content` field

**Key insight**: The LLM autonomously decides approval/rejection based on plan quality. There's no mandatory user confirmation (though the user can steer the decision via real-time interrupts).

---

## 5. Approval Message Handlers

### 5.1 Approve Plan Handler

**What it does**: Processes the team lead's approval decision and sends approval message to teammate's mailbox.

**How it works**:

```javascript
// ============================================
// approvePlan (_xY) - Team lead plan approval handler
// Location: chunks.145.mjs:2521-2545
// ============================================

// ORIGINAL (for source lookup):
async function _xY(A, q, K) {
    let Y = K.getAppState(),     // SYNC getAppState (no await), K = toolContext
        z = Y.teamContext?.teamName;
    if (!KZ(Y.teamContext)) throw Error("Only the team lead can approve plans. Teammates cannot approve their own or other plans.");
    let _ = Y.toolPermissionContext.mode,
        w = _ === "plan" ? "default" : _,   // NOTE: only "plan" → "default", no "delegate" check
        O = {
            type: "plan_approval_response",
            requestId: q,    // q = requestId string (not params.request_id)
            approved: !0,
            timestamp: new Date().toISOString(),
            permissionMode: w
        };
    return await x3(A, {    // A = recipient name, x3 = writeToMailbox
        from: BY,            // BY = TEAM_LEAD_ID constant
        text: B6(O),         // B6 = JSON.stringify
        timestamp: new Date().toISOString()
    }, z), {
        data: {
            success: !0,
            message: `Plan approved for ${A}. They will receive the approval and can proceed with implementation.`,
            request_id: q
        }
    }
}

// READABLE (for understanding):
async function approvePlan(recipient, requestId, toolContext) {
    // NOTE: 3 separate params — recipient (string), requestId (string), toolContext (object)
    let appState = toolContext.getAppState(),  // SYNC — no await
        teamName = appState.teamContext?.teamName;

    // Authorization: only team lead can approve
    if (!isTeamLead(appState.teamContext)) {  // KZ
        throw Error("Only the team lead can approve plans...");
    }

    // Mode transition: if lead is in plan mode, teammate gets default mode
    // (no special handling for delegate mode — that check was fabricated)
    let currentMode = appState.toolPermissionContext.mode,
        targetMode = currentMode === "plan" ? "default" : currentMode,
        approvalResponse = {
            type: "plan_approval_response",
            requestId: requestId,
            approved: true,
            timestamp: new Date().toISOString(),
            permissionMode: targetMode
        };

    // Send approval to teammate's mailbox
    await writeToMailbox(recipient, {  // x3
        from: TEAM_LEAD_ID,            // BY
        text: JSON.stringify(approvalResponse),  // B6
        timestamp: new Date().toISOString()
    }, teamName);

    return {
        data: {
            success: true,
            message: `Plan approved for ${recipient}. They will receive the approval and can proceed with implementation.`,
            request_id: requestId
        }
    };
}

// Mapping: _xY→approvePlan, A→recipient, q→requestId, K→toolContext, Y→appState, z→teamName,
//          KZ→isTeamLead, _→currentMode, w→targetMode, O→approvalResponse,
//          x3→writeToMailbox, BY→TEAM_LEAD_ID, B6→JSON.stringify
```

**Step-by-step approval flow**:

1. **Authorization**: Verify caller is team lead (not a teammate trying to self-approve)
2. **Determine target mode**: Calculate what permission mode the teammate should transition to:
   - If lead is in `plan` mode → transition teammate to `default` (NOTE: only `plan` triggers downgrade; `delegate` mode check was NOT in source)
   - Otherwise → transition to lead's current mode (e.g., if lead is in `acceptEdits`, teammate gets `acceptEdits`)
3. **Create approval response**: Build JSON message with:
   - `type: "plan_approval_response"`
   - `approved: true`
   - `permissionMode`: Target mode for teammate
   - `requestId`: Echo back original request ID for matching
4. **Send to teammate mailbox**: Use `writeToMailbox(recipient, ...)` with team lead as sender
5. **Return success**: Inform team lead LLM that approval was sent

**Why this approach**:
- **Permission mode inheritance**: Teammate inherits lead's current mode (except plan/delegate, which downgrade to default)
- **Authorization check**: Prevents teammates from approving each other's plans (security)
- **Request ID echo**: Enables teammate to match response to original request if multiple pending

**Alternative considered**: Always transition teammate to `default` mode.
**Trade-off**: Mode inheritance allows lead to grant higher permissions (e.g., `acceptEdits`, `bypassPermissions`) to trusted teammates. Fixed `default` mode would be safer but less flexible.

### 5.2 Reject Plan Handler

**What it does**: Processes the team lead's rejection decision and sends rejection with feedback to teammate's mailbox.

**How it works**:

```javascript
// ============================================
// rejectPlan (wxY) - Team lead plan rejection handler
// Location: chunks.145.mjs:2547-2569
// ============================================

// ORIGINAL (for source lookup):
async function wxY(A, q, K, Y) {
    let z = Y.getAppState(),    // SYNC, Y = toolContext
        _ = z.teamContext?.teamName;
    if (!KZ(z.teamContext)) throw Error("Only the team lead can reject plans. Teammates cannot reject their own or other plans.");
    let w = {
        type: "plan_approval_response",
        requestId: q,    // q = requestId
        approved: !1,
        feedback: K,     // K = feedback string
        timestamp: new Date().toISOString()
    };
    return await x3(A, {    // A = recipient, x3 = writeToMailbox
        from: BY,
        text: B6(w),
        timestamp: new Date().toISOString()
    }, _), {
        data: {
            success: !0,
            message: `Plan rejected for ${A} with feedback: "${K}"`,
            request_id: q
        }
    }
}

// READABLE (for understanding):
async function rejectPlan(recipient, requestId, feedback, toolContext) {
    // NOTE: 4 separate params — recipient (string), requestId (string), feedback (string), toolContext
    let appState = toolContext.getAppState(),  // SYNC — no await
        teamName = appState.teamContext?.teamName;

    // Authorization: only team lead can reject
    if (!isTeamLead(appState.teamContext)) {  // KZ
        throw Error("Only the team lead can reject plans...");
    }

    let rejectionResponse = {
        type: "plan_approval_response",
        requestId: requestId,
        approved: false,
        feedback: feedback,  // ← Specific revision guidance
        timestamp: new Date().toISOString()
        // NOTE: no permissionMode field — teammate stays in plan mode for revision
    };

    // Send rejection to teammate's mailbox
    await writeToMailbox(recipient, {  // x3
        from: TEAM_LEAD_ID,
        text: JSON.stringify(rejectionResponse),
        timestamp: new Date().toISOString()
    }, teamName);

    return {
        data: {
            success: true,
            message: `Plan rejected for ${recipient} with feedback: "${feedback}"`,
            request_id: requestId
        }
    };
}

// Mapping: wxY→rejectPlan, A→recipient, q→requestId, K→feedback, Y→toolContext,
//          z→appState, _→teamName, KZ→isTeamLead, w→rejectionResponse,
//          x3→writeToMailbox, BY→TEAM_LEAD_ID, B6→JSON.stringify
```

**Step-by-step rejection flow**:

1. **Authorization**: Verify caller is team lead
2. **Extract feedback**: Use `content` parameter or default to "Plan needs revision"
3. **Create rejection response**: Build JSON message with:
   - `type: "plan_approval_response"`
   - `approved: false`
   - `feedback`: Specific guidance for revision (e.g., "Add error handling", "Include test coverage")
   - `requestId`: Echo back original request ID
4. **Send to teammate mailbox**: Use `writeToMailbox(recipient, ...)` with team lead as sender
5. **Return success**: Inform team lead LLM that rejection was sent

**Why this approach**:
- **Feedback required**: `content` parameter provides actionable guidance for plan improvement
- **Default fallback**: Generic "Plan needs revision" if no specific feedback provided
- **No mode transition**: Teammate remains in plan mode to revise and resubmit

**Key insight**: Rejection does **NOT** change the teammate's permission mode. They stay in plan mode, allowing them to revise the plan and call ExitPlanMode again to resubmit.

### 5.3 Plan Approval Response Schema

**Message structure**:

```javascript
// ============================================
// PlanApprovalResponseMessageSchema (md4) - Zod schema for validation
// Location: chunks.132.mjs:477-483
// ============================================

// ORIGINAL (for source lookup):
md4 = F6(() => C.object({
    type: C.literal("plan_approval_response"),
    requestId: C.string(),
    approved: C.boolean(),
    feedback: C.string().optional(),
    timestamp: C.string(),
    permissionMode: J66().optional()
}));

// READABLE (for understanding):
PlanApprovalResponseMessageSchema = zod.object({
    type: zod.literal("plan_approval_response"),
    requestId: zod.string(),  // Matches original request ID for correlation
    approved: zod.boolean(),  // true = approved, false = rejected
    feedback: zod.string().optional(),  // Only present if rejected
    timestamp: zod.string(),  // ISO 8601 timestamp
    permissionMode: getPermissionModeSchema().optional()  // J66(), only present if approved
});

// Mapping: md4→PlanApprovalResponseMessageSchema, C→zod, J66→getPermissionModeSchema
```

**Example approval payload**:

```json
{
  "type": "plan_approval_response",
  "requestId": "plan_approval_researcher-abc123_1737823920000",
  "approved": true,
  "timestamp": "2025-01-15T14:35:00.000Z",
  "permissionMode": "default"
}
```

**Example rejection payload**:

```json
{
  "type": "plan_approval_response",
  "requestId": "plan_approval_researcher-abc123_1737823920000",
  "approved": false,
  "feedback": "Please add error handling for the API calls and include unit test coverage",
  "timestamp": "2025-01-15T14:35:00.000Z"
}
```

---

## 6. Teammate Response Processing

### 6.1 InboxPoller Detection

**What it does**: The teammate's inbox polling loop detects incoming `plan_approval_response` messages and processes them automatically.

**How it works**:

```javascript
// ============================================
// InboxPoller - Plan approval response detection and processing
// Location: chunks.186.mjs:500-527
// ============================================

// ORIGINAL (for source lookup):
let J = j11.useCallback(() => {
    if (!A) return;
    let j = w.getState(),
        M = ZE6(j);
    if (!M) return;
    let P = z51(M, j.teamContext?.teamName);
    if (P.length === 0) return;

    h(`[InboxPoller] Found ${P.length} unread message(s)`);

    if (Dz() && MC1())
        for (let b of P) {
            let g = iP1(b.text);
            if (g && b.from === "team-lead")
                if (h(`[InboxPoller] Received plan approval response from team-lead: approved=${g.approved}`), g.approved) {
                    let U = g.permissionMode ?? "default";
                    H((x) => ({
                        ...x,
                        toolPermissionContext: a2(x.toolPermissionContext, {
                            type: "setMode",
                            mode: KA1(U),
                            destination: "session"
                        })
                    }));
                    h(`[InboxPoller] Plan approved by team lead, exited plan mode to ${U}`)
                } else {
                    h(`[InboxPoller] Plan rejected by team lead: ${g.feedback||"No feedback provided"}`)
                }
            else if (g) {
                h(`[InboxPoller] Ignoring plan approval response from non-team-lead: ${b.from}`)
            }
        }

    XQ1(M, j.teamContext?.teamName);
    // ... (continue processing other message types)
}, [/* dependencies */]);

// READABLE (for understanding):
let pollingCallback = useCallback(() => {
    if (!isPollingEnabled) return;

    let state = store.getState(),
        teammateId = getTeammateId(state);
    if (!teammateId) return;

    let unreadMessages = getUnreadMessages(teammateId, state.teamContext?.teamName);
    if (unreadMessages.length === 0) return;

    debug(`[InboxPoller] Found ${unreadMessages.length} unread message(s)`);

    // Process plan approval responses for teammates only
    if (isTeammate() && hasTeamConfig()) {
        for (let message of unreadMessages) {
            let approvalResponse = parsePlanApprovalResponse(message.text);

            if (approvalResponse && message.from === "team-lead") {
                debug(`[InboxPoller] Received plan approval response from team-lead: approved=${approvalResponse.approved}`);

                if (approvalResponse.approved) {
                    // APPROVED: Exit plan mode to specified permission mode
                    let targetMode = approvalResponse.permissionMode ?? "default";
                    setAppState((state) => ({
                        ...state,
                        toolPermissionContext: applyPermissionAction(state.toolPermissionContext, {
                            type: "setMode",
                            mode: parsePermissionMode(targetMode),
                            destination: "session"
                        })
                    }));
                    debug(`[InboxPoller] Plan approved by team lead, exited plan mode to ${targetMode}`);
                } else {
                    // REJECTED: Stay in plan mode, log feedback
                    debug(`[InboxPoller] Plan rejected by team lead: ${approvalResponse.feedback || "No feedback provided"}`);
                }
            } else if (approvalResponse) {
                // Ignore approval responses from non-team-lead (security)
                debug(`[InboxPoller] Ignoring plan approval response from non-team-lead: ${message.from}`);
            }
        }
    }

    // Mark messages as read
    markAllMessagesAsRead(teammateId, state.teamContext?.teamName);

    // ... (continue processing other message types: shutdown, broadcasts, etc.)
}, [/* dependencies */]);

// Mapping: J→pollingCallback, A→isPollingEnabled, w→store, ZE6→getTeammateId,
// z51→getUnreadMessages, Dz→isTeammate, MC1→hasTeamConfig, iP1→parsePlanApprovalResponse,
// H→setAppState, a2→applyPermissionAction, KA1→parsePermissionMode, XQ1→markAllMessagesAsRead
```

**Step-by-step processing**:

1. **Poll mailbox**: Check for unread messages in teammate's inbox (500ms interval)
2. **Filter teammates**: Only process approval responses if agent is a teammate (not team lead)
3. **Parse message**: Attempt to parse each message as `plan_approval_response` JSON
4. **Verify sender**: Only accept responses from `"team-lead"` (ignore others for security)
5. **Process approval**:
   - If `approved: true`:
     - Extract `permissionMode` (default to "default" if missing)
     - Call `setAppState` to update `toolPermissionContext.mode`
     - Teammate **exits plan mode** automatically
   - If `approved: false`:
     - Log feedback message
     - **Stay in plan mode** (no mode change)
     - Teammate can revise plan and resubmit
6. **Mark read**: Mark message as read to prevent re-processing

**Why this approach**:
- **Automatic mode transition**: Teammate doesn't need to manually exit plan mode—it happens automatically on approval
- **Security**: Only team lead's responses are honored (prevents teammate spoofing)
- **Feedback visibility**: Rejection feedback is logged and visible to teammate's LLM
- **Idempotency**: Message marking prevents double-processing

**Key insight**: The mode transition happens **asynchronously** in the polling loop, not in the ExitPlanMode tool response. This creates a delay (up to 500ms) between approval and mode change, but ensures atomic state updates.

### 6.2 Approval Confirmation Rendering

**What it does**: When the teammate receives an approval response, a confirmation message is rendered in the teammate's TUI.

**How it works**:

```javascript
// ============================================
// PlanApprovalResponseRenderer - UI rendering for approval confirmation
// Location: chunks.129.mjs:1799-1829 (approved), 1830-1880 (rejected)
// ============================================

// ORIGINAL (for source lookup):
function OfY(A) {
    let q = e(13),
        { response: K, senderName: Y } = A;
    if (K.approved) {
        let O;
        if (q[0] !== Y)
            O = G3.createElement(I, null,
                G3.createElement(V, { color: "success", bold: !0 },
                    "✓ Plan Approved by ", Y)),
            q[0] = Y, q[1] = O;
        else O = q[1];

        let _;
        if (q[2] === Symbol.for("react.memo_cache_sentinel"))
            _ = G3.createElement(I, { marginTop: 1 },
                G3.createElement(V, null,
                    "You can now proceed with implementation. Your plan mode restrictions have been lifted.")),
            q[2] = _;
        else _ = q[2];

        return G3.createElement(I, { flexDirection: "column", marginY: 1 },
            G3.createElement(I, {
                borderStyle: "round",
                borderColor: "success",
                flexDirection: "column",
                paddingX: 1,
                paddingY: 1
            }, O, _));
    } else {
        // ... rejection rendering (see next section) ...
    }
}

// READABLE (for understanding):
function renderPlanApprovalResponse(props) {
    let memoCache = useMemoCache(13),
        { response, senderName } = props;

    if (response.approved) {
        // Render approval confirmation
        let headerElement;
        if (memoCache[0] !== senderName) {
            headerElement = createElement(Box, null,
                createElement(Text, { color: "success", bold: true },
                    "✓ Plan Approved by ", senderName));
            memoCache[0] = senderName;
            memoCache[1] = headerElement;
        } else {
            headerElement = memoCache[1];
        }

        let instructionElement;
        if (memoCache[2] === Symbol.for("react.memo_cache_sentinel")) {
            instructionElement = createElement(Box, { marginTop: 1 },
                createElement(Text, null,
                    "You can now proceed with implementation. Your plan mode restrictions have been lifted."));
            memoCache[2] = instructionElement;
        } else {
            instructionElement = memoCache[2];
        }

        return createElement(Box, { flexDirection: "column", marginY: 1 },
            createElement(Box, {
                borderStyle: "round",
                borderColor: "success",  // Green border
                flexDirection: "column",
                paddingX: 1,
                paddingY: 1
            }, headerElement, instructionElement));
    } else {
        // ... (rejection rendering) ...
    }
}

// Mapping: OfY→renderPlanApprovalResponse, G3→React, I→Box, V→Text, e→useMemoCache,
// A→props, K→response, Y→senderName
```

**Visual output** (approval):

```
┌─ Success ─────────────────────────────────────┐
│ ✓ Plan Approved by team-lead                  │
│                                                │
│ You can now proceed with implementation.      │
│ Your plan mode restrictions have been lifted. │
└────────────────────────────────────────────────┘
```

**Visual output** (rejection):

```
┌─ Warning ──────────────────────────────────────┐
│ ✗ Plan Rejected by team-lead                   │
│                                                 │
│ Feedback: Please add error handling for the    │
│ API calls and include unit test coverage       │
│                                                 │
│ Please revise your plan and resubmit.          │
└─────────────────────────────────────────────────┘
```

**Why this approach**:
- **Visual distinction**: Green border for approval, yellow/red for rejection
- **Clear instruction**: "restrictions lifted" confirms mode transition
- **Feedback display**: Rejection shows specific revision guidance

---

## 7. Plan Revision Cycle

### 7.1 Rejection Processing

**What it does**: When a plan is rejected, the teammate receives feedback and can revise the plan.

**How it works**:

1. **Receive rejection**: InboxPoller detects `plan_approval_response` with `approved: false`
2. **Display feedback**: Rejection message with `feedback` field is rendered in TUI
3. **Log feedback**: Debug log includes rejection reason for LLM visibility
4. **No mode change**: Teammate remains in plan mode (still has access to plan file)

**Teammate's next steps**:

1. LLM reads rejection feedback from system reminder or mailbox message
2. LLM revises plan file at `~/.claude/plans/{agentId}/plan.md` using Edit tool
3. LLM calls ExitPlanMode again to resubmit
4. New `plan_approval_request` sent with updated plan content
5. Team lead reviews revised plan → approves or rejects again

**Revision cycle example**:

```
Iteration 1:
  Teammate: (writes initial plan)
  Teammate: (calls ExitPlanMode)
  Team Lead: (rejects: "Add error handling")
  Teammate: (receives rejection, sees feedback)

Iteration 2:
  Teammate: (edits plan to add error handling)
  Teammate: (calls ExitPlanMode again)
  Team Lead: (rejects: "Include test coverage")
  Teammate: (receives rejection, sees feedback)

Iteration 3:
  Teammate: (edits plan to add tests)
  Teammate: (calls ExitPlanMode again)
  Team Lead: (approves)
  Teammate: (exits plan mode → starts implementation)
```

**Why this approach**:
- **Iterative refinement**: Unlimited revision cycles until approval
- **Feedback-driven**: Each rejection includes specific guidance
- **No manual reset**: Teammate automatically stays in plan mode for revision

**Alternative considered**: Limit to N revision attempts.
**Trade-off**: Unlimited revisions enable thorough planning but may cause infinite loops if LLM misunderstands feedback. Current approach trusts LLM to converge.

### 7.2 Multiple Pending Approvals

**Edge case**: What if teammate submits multiple plans before receiving first approval?

**Current behavior**:

- Each `ExitPlanMode` call creates a **new** `plan_approval_request` with unique `requestId`
- Team lead receives multiple requests in mailbox (processed in order)
- Team lead can approve/reject each independently
- Teammate's `awaitingLeaderApproval` flag is set to `true` after **first** submission

**Potential race condition**: If teammate calls ExitPlanMode twice rapidly:

1. First call → sends request A, sets `awaitingLeaderApproval: true`
2. Second call → sends request B, `awaitingLeaderApproval` already `true`
3. Team lead approves request A → teammate exits plan mode
4. Team lead approves request B → **mode change happens again** (may override manual changes)

**Mitigation**: System prompt instructs teammates to wait for approval before resubmitting. However, this is **not enforced** in code (no check for existing pending requests).

**Key insight**: The `requestId` field enables matching responses to requests, but the current implementation doesn't strictly enforce one-pending-request-at-a-time. This could cause unexpected behavior if teammates spam ExitPlanMode.

---

## 8. Mode Transition Details

### 8.1 Permission Mode Inheritance

**What it does**: When approving a plan, the team lead's current permission mode determines what mode the teammate transitions to.

**Inheritance logic**:

```javascript
// From handlePlanApproval (chunks.141.mjs:1244):
let currentMode = appState.toolPermissionContext.mode,
    targetMode = currentMode === "plan" || currentMode === "delegate" ? "default" : currentMode;
```

**Mode mapping**:

| Team Lead Mode | Teammate Target Mode | Rationale |
|----------------|----------------------|-----------|
| `default` | `default` | Standard tool permissions |
| `acceptEdits` | `acceptEdits` | Auto-approve file edits |
| `plan` | `default` | Downgrade (plan mode not useful for execution) |
| `delegate` | `default` | Downgrade (delegate mode only for leads) |
| `bypassPermissions` | `bypassPermissions` | Full unrestricted access |

**Why this approach**:
- **Contextual permissions**: Teammate's permissions match team lead's trust level
- **Downgrade special modes**: Plan and delegate modes are not useful for execution, so downgrade to default
- **Security escalation path**: Team lead can grant `bypassPermissions` to trusted teammates

**Alternative considered**: Always transition to `default` mode.
**Trade-off**: Fixed mode is simpler but less flexible. Current approach enables "trusted teammate" workflows where lead grants elevated permissions.

### 8.2 Mode Transition Timing

**What it does**: Mode transition happens **asynchronously** in the polling loop, not synchronously in the approval handler.

**Timing sequence**:

```
T=0ms:    Team lead calls SendMessage with plan_approval_response
T=5ms:    handlePlanApproval writes message to teammate's mailbox
T=10ms:   handlePlanApproval returns success to team lead
T=250ms:  Teammate's InboxPoller checks mailbox (halfway through 500ms interval)
T=250ms:  InboxPoller finds approval message, calls setAppState
T=250ms:  Teammate's toolPermissionContext.mode changes from "plan" to "default"
T=250ms:  Teammate's next agent loop iteration uses new mode
```

**Polling interval**: 500ms (chunks.131.mjs:286)

**Why this approach**:
- **Decoupled timing**: Approval handler doesn't block waiting for teammate to process
- **Atomic state updates**: setAppState ensures mode change is atomic
- **Poll-based discovery**: Reuses existing mailbox polling infrastructure

**Alternative considered**: Immediate mode change via shared memory.
**Trade-off**: Shared memory would eliminate latency but require multi-process synchronization (complex). Polling adds up to 500ms delay but simplifies implementation.

### 8.3 Tool Availability After Approval

**What it does**: After exiting plan mode, the teammate gains access to execution tools (Read, Edit, Write, Bash, etc.).

**Tool filtering by mode**:

| Mode | Available Tools | Restrictions |
|------|----------------|--------------|
| `plan` | Read, Glob, Grep, EnterPlanMode, ExitPlanMode | No file writes, no shell commands |
| `default` | All tools | User confirmation required for risky operations |
| `acceptEdits` | All tools | File edits auto-approved |
| `bypassPermissions` | All tools | No confirmations (full bypass) |

**Implementation**: Tool availability is determined by `toolPermissionContext.mode` in the agent loop's tool filtering logic (not specific to teams—standard plan mode behavior).

**Key insight**: The teammate's tool access expands **immediately** after mode transition (at next agent loop iteration). There's no explicit "you are now ready to execute" message—the LLM infers this from the approval confirmation and subsequent tool call results.

---

## 9. Design Rationale & Trade-offs

### 9.1 Why Plan Mode for Teammates?

**Problem**: Teammates are autonomous LLM agents with full tool access. Without review checkpoints, they could execute destructive or misaligned changes.

**Solution**: Require teammates to submit plans for team lead approval before execution.

**Benefits**:
1. **Safety**: Team lead reviews all changes before they happen
2. **Alignment**: Ensures teammate approach matches overall strategy
3. **Auditability**: Plan files persist on disk for post-hoc review
4. **Context preservation**: Team lead stays informed without reading every teammate message

**Trade-offs**:
- **Latency**: Plan submission → approval → execution adds 30-60 seconds per task
- **User burden**: Team lead LLM must review and approve (can't fully delegate)
- **Over-specification**: Forces teammates to plan even simple tasks

**When to use**: Enable plan mode for teammates working on critical/complex tasks. Disable for simple, low-risk tasks (e.g., read-only research).

### 9.2 Why Mailbox-Based Delivery?

**Problem**: Need to deliver plan approval requests/responses between team lead and teammates.

**Solution**: Reuse existing mailbox infrastructure with specialized JSON message types.

**Benefits**:
1. **Consistency**: Same message delivery as regular teammate communication
2. **File locking**: Mailbox system handles concurrent access
3. **Persistence**: Messages survive process crashes
4. **Debuggability**: Can inspect mailbox files to see approval flow

**Trade-offs**:
- **Latency**: Polling interval (500ms) adds delay
- **Parsing overhead**: JSON stringification/parsing on every message
- **No priority**: Plan approvals processed same as regular messages (no fast path)

**Alternative considered**: Separate approval channel (e.g., shared memory queue).
**Why not**: Would require new infrastructure, increase complexity. Mailbox reuse is simpler.

### 9.3 Why Automatic Mode Transition?

**Problem**: After approval, teammate needs to exit plan mode to execute.

**Solution**: InboxPoller automatically transitions mode when approval received.

**Benefits**:
1. **User experience**: Teammate doesn't need explicit "exit plan mode" step
2. **Atomicity**: Mode change and approval delivery happen together
3. **No manual intervention**: Team lead approves, teammate starts executing (no user action)

**Trade-offs**:
- **Asynchronous**: Mode change delayed by polling interval (up to 500ms)
- **Implicit**: No explicit "mode changed" tool call (LLM infers from context)
- **Race conditions**: Multiple approvals could cause mode to change multiple times

**Alternative considered**: Require teammate to call a separate ConfirmApproval tool.
**Why not**: Adds unnecessary step, increases user friction. Automatic is more seamless.

### 9.4 Why Request IDs?

**Problem**: Need to match approval/rejection responses to original plan requests.

**Solution**: Generate unique `requestId` for each plan submission, echo in responses.

**Benefits**:
1. **Correlation**: Can match response to request even with multiple pending
2. **Auditability**: Can trace approval flow in logs/telemetry
3. **Idempotency**: Can detect duplicate responses

**Trade-offs**:
- **Unused currently**: Teammate doesn't check `requestId` when processing response (accepts any from team-lead)
- **Future-proofing**: Enables features like "approve specific plan version" or "retract approval"

**Alternative considered**: No request IDs, rely on message order.
**Why not**: Message order not guaranteed with concurrent teams. Request IDs are more robust.

### 9.5 Why Unlimited Revision Cycles?

**Problem**: Plans may need multiple iterations to satisfy team lead.

**Solution**: Allow unlimited plan submissions (no hard limit on rejections).

**Benefits**:
1. **Thorough planning**: Enables refinement until plan is correct
2. **Flexible feedback**: Team lead can request incremental improvements
3. **No artificial limits**: Doesn't penalize complex tasks requiring many revisions

**Trade-offs**:
- **Infinite loops**: LLM could get stuck if it misunderstands feedback
- **User frustration**: Many rejections may frustrate users
- **No escape hatch**: No automatic escalation to team lead execution

**Alternative considered**: Limit to N revisions, then auto-approve or escalate.
**Why not**: Arbitrary limits are frustrating. Trust LLM to converge.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `handlePlanApproval` (AhY) - Team lead approval message handler (chunks.141.mjs:1239)
- `handlePlanRejection` (qhY) - Team lead rejection message handler (chunks.141.mjs:1265)
- `spawnSplitPaneTeammate` (dVY) - Spawn mechanism setting plan_mode_required flag (chunks.131.mjs:2077)
- `inProcessAgentRunner` (GVY) - Identity setup with plan mode flag (chunks.131.mjs:347)
- `parsePlanApprovalResponse` (iP1) - Parse approval response JSON (chunks.129.mjs:1428)
- `writeToMailbox` (f9) - Send message to teammate mailbox (chunks.129.mjs:1107)
- `getPlanFilePath` (uW) - Get plan file path (chunks.146.mjs:2702)
- `getPlanContent` (pD) - Read plan file content (chunks.146.mjs:2700)
- `generateRequestId` (vP1) - Generate unique request ID (chunks.139.mjs:2710)
- `isTeammate` (Dz) - Check if current agent is teammate (chunks.139.mjs:2690)
- `hasTeamConfig` (MC1) - Check if team config exists (chunks.139.mjs:2691)
- `getAgentName` (g5) - Get current agent name (chunks.139.mjs:2695)
- `applyPermissionAction` (a2) - Apply permission mode change (chunks.140.mjs:1695)

Constants:
- `PlanApprovalRequestMessageSchema` (Vx4) - Zod schema for plan requests (chunks.129.mjs:1546)
- `PlanApprovalResponseMessageSchema` (Nx4) - Zod schema for plan responses (chunks.129.mjs:1553)

---

## Cross-References

- [01_complete_chain_analysis.md](./01_complete_chain_analysis.md) - Overall team workflow
- [02_spawn_mechanisms_deep_dive.md](./02_spawn_mechanisms_deep_dive.md) - Teammate spawning with mode parameter
- [03_mailbox_and_locking.md](./03_mailbox_and_locking.md) - Message delivery infrastructure
- [04_polling_priorities.md](./04_polling_priorities.md) - InboxPoller message prioritization
- [06_system_prompts_and_reminders.md](./06_system_prompts_and_reminders.md) - Plan approval instructions in prompts
- [delegate_mode.md](./delegate_mode.md) - Related mode: team lead coordination-only mode
