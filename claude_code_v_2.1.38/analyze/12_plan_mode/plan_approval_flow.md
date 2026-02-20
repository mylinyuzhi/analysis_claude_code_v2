# Plan Mode Approval Flow (Claude Code 2.1.38)

> Complete analysis of the plan approval lifecycle: user-facing dialog, swarm inter-agent protocol, UI rendering, and state transitions.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode, Agent Teams)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `ExitPlanModeTool` (Nj) - Tool object, chunks.139.mjs:2641
- `handlePlanApproval` (AhY) - Leader approves plan, chunks.141.mjs:1239
- `handlePlanRejection` (qhY) - Leader rejects plan, chunks.141.mjs:1265
- `parsePlanApprovalResponse` (iP1) - Parse approval/rejection from mailbox, chunks.129.mjs:1428
- `InboxPoller plan_approval_response handler` - chunks.186.mjs:513
- `$fY` - Plan approval request UI, chunks.129.mjs:1756
- `OfY` - Plan approval response UI, chunks.129.mjs:1799
- `Kd4` - ExitPlanMode result renderer, chunks.139.mjs:2491
- `Yd4` - ExitPlanMode rejection renderer, chunks.139.mjs:2550
- `HX6` - Rejected plan viewer, chunks.107.mjs:1153
- `PlanApprovalRequestMessageSchema` (Vx4) - chunks.129.mjs:1546
- `PlanApprovalResponseMessageSchema` (Nx4) - chunks.129.mjs:1553

---

## Two Approval Paths

```
ExitPlanMode called
        │
        ├─── PATH A: Main Session (user-facing)
        │         Dz() = false (not a teammate)
        │         checkPermissions() → { behavior: "ask" }
        │         → Permission dialog: "Exit plan mode?"
        │         → User clicks Yes/No in terminal
        │
        └─── PATH B: Swarm Teammate
                  Dz() = true AND MC1() = true
                  checkPermissions() → { behavior: "allow" }
                  → Sends plan_approval_request to team-lead mailbox
                  → Waits for plan_approval_response in inbox
```

---

## PATH A: User-Facing Approval Dialog

### Permission Prompt Mechanics

When `ExitPlanMode` is called in a main session:

1. `requiresUserInteraction()` returns `true`
2. `checkPermissions()` returns `{ behavior: "ask", message: "Exit plan mode?" }`
3. The tool execution engine suspends and surfaces a **permission request** to the UI
4. The UI renders the request as an interactive prompt

```javascript
// ============================================
// ExitPlanModeTool.checkPermissions - Permission gating
// Location: chunks.139.mjs:2672
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions(A) {
    if (Dz()) return {
        behavior: "allow",
        updatedInput: A
    };
    return {
        behavior: "ask",
        message: "Exit plan mode?",
        updatedInput: A
    }
}

// READABLE (for understanding):
async function checkPermissions(input) {
    // Swarm teammates bypass user approval (team-lead approves instead)
    if (isTeammate()) return { behavior: "allow", updatedInput: input };
    // Main session: always ask user
    return { behavior: "ask", message: "Exit plan mode?", updatedInput: input };
}

// Mapping: Dz→isTeammate
```

### What the User Sees

The permission dialog shows:
- The message: **"Exit plan mode?"**
- The plan content (from the tool input, injected via `normalizeToolInput` from disk)
- Yes/No options

When the user selects **Yes (Approve)**:
1. Tool `call()` executes
2. Permission mode restored to `prePlanMode`
3. UI renders approval result card (`Kd4`, state 4)
4. LLM receives: "User has approved your plan. You can now start coding..."

When the user selects **No (Reject)**:
1. Tool `call()` is NOT executed (skipped)
2. Permission mode stays `"plan"`
3. UI renders rejection card (`Yd4`) with plan content in planMode-colored border
4. `renderToolUseRejectedMessage` is called → shows `HX6` component

### Rejection Display

```javascript
// ============================================
// HX6 - Plan rejection viewer
// Location: chunks.107.mjs:1153
// ============================================

// ORIGINAL (for source lookup):
function HX6(A) {
    let q = e(3), { plan: K } = A, Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel"))
        Y = Bh.createElement(V, { color: "subtle" }, "User rejected Claude's plan:"), q[0] = Y;
    else Y = q[0];
    let z;
    if (q[1] !== K) z = Bh.createElement(HA, null, Bh.createElement(I, {
        flexDirection: "column"
    }, Y, Bh.createElement(I, {
        borderStyle: "round",
        borderColor: "planMode",    // ← planMode-themed border
        borderDimColor: !0,
        paddingX: 1,
        overflow: "hidden"
    }, Bh.createElement(TJ, null, K)))), q[1] = K, q[2] = z;
    else z = q[2];
    return z
}

// READABLE (for understanding):
function RejectedPlanViewer({ plan }) {
    return (
        <Indent>
            <Box flexDirection="column">
                <Text color="subtle">User rejected Claude's plan:</Text>
                <Box borderStyle="round" borderColor="planMode" borderDimColor paddingX={1}>
                    <Markdown>{plan}</Markdown>
                </Box>
            </Box>
        </Indent>
    );
}
```

Terminal render:
```
User rejected Claude's plan:
╭──────────────────────────────────────────────────────╮
│ ## Implementation Plan                                │  ← planMode color border
│                                                       │  ← dimmed
│ ### Step 1: Update the auth module                   │
│ Modify `src/auth/handler.js` to add JWT validation... │
│                                                       │
│ ### Step 2: ...                                       │
╰──────────────────────────────────────────────────────╯
```

Also, `H74` (tool result renderer in `chunks.107.mjs:1209`) checks for the special prefix `OWA` to detect plan rejection content in the message list:

```javascript
// OWA constant (chunks.173.mjs:1579):
OWA = `The agent proposed a plan that was rejected by the user. The user chose to stay in plan mode rather than proceed with implementation.`

// If tool result starts with OWA:
if (typeof w.content === "string" && w.content.startsWith(OWA)) {
    let planText = w.content.substring(OWA.length);
    return createElement(HX6, { plan: planText });
}
```

---

## PATH B: Swarm Teammate Approval Protocol

### Overview

In a multi-agent swarm where a teammate has `plan_mode_required: true`, approval is delegated from the user to the team leader.

```
Teammate           Team Leader           User
    │                    │                 │
    │ ExitPlanMode        │                 │
    │ called              │                 │
    │                     │                 │
    ├── plan_approval_request ──────────►   │
    │   (via filesystem mailbox)            │
    │                     │                 │
    │         [Leader sees request in UI]   │
    │                     │                 │
    │                     │◄── Leader calls SendMessage
    │                     │    with type="plan_approval_response"
    │                     │
    ├◄── plan_approval_response ─────────   │
    │    (via teammate's inbox)             │
    │                     │                 │
    │  InboxPoller detects response         │
    │  → updates permission mode            │
    └─ Proceeds with implementation         │
```

### Step 1: Teammate Sends Approval Request

```javascript
// ============================================
// ExitPlanMode swarm flow
// Location: chunks.139.mjs:2692
// ============================================

// READABLE (for understanding):
if (isTeammate() && hasTeamConfig()) {
    if (!planContent) throw Error(`No plan file found at ${planFilePath}`);

    let agentName = getAgentName();    // g5()
    let teamName = getTeamName();      // i3()
    let requestId = generateRequestId("plan_approval", hash(agentName, teamName));  // vP1()

    // Construct structured request
    let approvalRequest = {
        type: "plan_approval_request",
        from: agentName,
        timestamp: new Date().toISOString(),
        planFilePath: planFilePath,
        planContent: planContent,    // Full plan text
        requestId: requestId         // UUID for matching response
    };

    // Write to team-lead mailbox
    writeToMailbox("team-lead", {
        from: agentName,
        text: JSON.stringify(approvalRequest),
        timestamp: new Date().toISOString()
    }, teamName);

    // Mark task as awaiting plan approval in TaskManager
    // so the swarm UI shows correct status
    let taskId = findTaskByAgentName(agentName, appState);   // Hd4()
    if (taskId) setTaskAwaitingPlanApproval(taskId, true);   // $d4()

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
```

### Message Schema

```javascript
// ============================================
// PlanApprovalRequestMessageSchema (Vx4)
// Location: chunks.129.mjs:1546
// ============================================

Vx4 = z.object({
    type: z.literal("plan_approval_request"),
    from: z.string(),
    timestamp: z.string(),
    planFilePath: z.string(),
    planContent: z.string(),
    requestId: z.string()
})

// ============================================
// PlanApprovalResponseMessageSchema (Nx4)
// Location: chunks.129.mjs:1553
// ============================================

Nx4 = z.object({
    type: z.literal("plan_approval_response"),
    requestId: z.string(),
    approved: z.boolean(),
    feedback: z.string().optional(),   // Only on rejection
    timestamp: z.string(),
    permissionMode: permissionModeEnum.optional()  // Mode to grant on approval
})
```

### Step 2: Team Leader's UI

When the team leader receives a `plan_approval_request` in their mailbox, the teammate's message in the swarm UI shows:

**In swarm view status**: `"awaiting approval"` (chunks.162.mjs:785)
```javascript
// Status text based on awaitingPlanApproval flag
status = awaitingPlanApproval ? "awaiting approval"
       : isIdle ? "idle"
       : (progress?.recentActivities || lastActivity?.activityDescription || "working")
```

**In messages list**: `$fY` component (chunks.129.mjs:1756):

```javascript
// ============================================
// $fY - PlanApprovalRequest UI component
// Location: chunks.129.mjs:1756
// ============================================

// READABLE (for understanding):
function PlanApprovalRequestMessage({ request }) {
    return (
        <Box flexDirection="column" marginY={1}>
            <Box
                borderStyle="round"
                borderColor="planMode"   // planMode-colored border
                flexDirection="column"
                paddingX={1}
            >
                <Box marginBottom={1}>
                    <Text color="planMode" bold>
                        Plan Approval Request from {request.from}
                    </Text>
                </Box>
                <Box
                    borderStyle="dashed"
                    borderColor="subtle"
                    borderLeft={false}
                    borderRight={false}
                    flexDirection="column"
                    paddingX={1}
                    marginBottom={1}
                >
                    <Markdown>{request.planContent}</Markdown>
                </Box>
                <Text dimColor>Plan file: {request.planFilePath}</Text>
            </Box>
        </Box>
    );
}
```

Terminal render:
```
╭─────────────────────────────────────────────────────────╮
│ Plan Approval Request from backend-agent               │  ← planMode color header
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤  ← dashed separator
│ ## Implementation Plan                                   │
│ Modify UserService.js to add rate limiting...            │
│ 1. Add Redis dependency                                  │
│ 2. Wrap login endpoint                                   │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤  ← dashed separator
│ Plan file: .claude/sessions/.../plan.md                 │  ← dimmed
╰─────────────────────────────────────────────────────────╯
```

### Step 3: Team Leader Responds

The leader uses `SendMessage` tool with `type: "plan_approval_response"`:

**Approval:**
```javascript
// ============================================
// AhY - handlePlanApproval
// Location: chunks.141.mjs:1239
// ============================================

// ORIGINAL (for source lookup):
async function AhY(A, q) {
    let K = await q.getAppState(),
        Y = K.teamContext?.teamName;
    if (!PM(K.teamContext)) throw Error("Only the team lead can approve plans...");

    let z = K.toolPermissionContext.mode,
        // Grant "default" mode (or current mode if not plan/delegate)
        w = z === "plan" || z === "delegate" ? "default" : z,
        H = {
            type: "plan_approval_response",
            requestId: A.request_id,
            approved: !0,
            timestamp: new Date().toISOString(),
            permissionMode: w
        };

    return f9(A.recipient, {
        from: K2,  // "team-lead" constant
        text: Q1(H),
        timestamp: new Date().toISOString()
    }, Y), {
        data: {
            success: !0,
            message: `Plan approved for ${A.recipient}. They will receive the approval and can proceed with implementation.`,
            request_id: A.request_id
        }
    }
}

// READABLE (for understanding):
async function handlePlanApproval(input, toolUseContext) {
    let appState = await toolUseContext.getAppState();
    let teamName = appState.teamContext?.teamName;

    // Only team leader can approve
    if (!isTeamLeader(appState.teamContext))
        throw Error("Only the team lead can approve plans.");

    // Determine what permission mode to grant to teammate
    let currentMode = appState.toolPermissionContext.mode;
    let grantMode = (currentMode === "plan" || currentMode === "delegate") ? "default" : currentMode;

    let response = {
        type: "plan_approval_response",
        requestId: input.request_id,
        approved: true,
        timestamp: new Date().toISOString(),
        permissionMode: grantMode    // "default" typically
    };

    // Write response to teammate's mailbox
    writeToMailbox(input.recipient, {
        from: "team-lead",
        text: JSON.stringify(response),
        timestamp: new Date().toISOString()
    }, teamName);

    return { data: { success: true, message: `Plan approved for ${input.recipient}...` } };
}

// Mapping: AhY→handlePlanApproval, K2→"team-lead", PM→isTeamLeader, f9→writeToMailbox
```

**Rejection:**
```javascript
// ============================================
// qhY - handlePlanRejection
// Location: chunks.141.mjs:1265
// ============================================

// ORIGINAL (for source lookup):
async function qhY(A, q) {
    let K = await q.getAppState(),
        Y = K.teamContext?.teamName;
    if (!PM(K.teamContext)) throw Error("Only the team lead can reject plans...");

    let z = A.content || "Plan needs revision",
        w = {
            type: "plan_approval_response",
            requestId: A.request_id,
            approved: !1,
            feedback: z,    // ← includes textual feedback
            timestamp: new Date().toISOString()
            // Note: no permissionMode on rejection (stays in plan mode)
        };

    return f9(A.recipient, { from: K2, text: Q1(w), timestamp: new Date().toISOString() }, Y), {
        data: { success: !0, message: `Plan rejected for ${A.recipient} with feedback: "${z}"` }
    }
}

// Key difference from approval:
// - approved: false
// - feedback field included with rejection reason
// - NO permissionMode field → teammate stays in plan mode
```

### Step 4: Teammate Receives Response (InboxPoller)

The teammate's `InboxPoller` in `chunks.186.mjs` polls the mailbox and processes `plan_approval_response`:

```javascript
// ============================================
// InboxPoller plan_approval_response handler
// Location: chunks.186.mjs:511
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
                })), h(`[InboxPoller] Plan approved by team lead, exited plan mode to ${U}`)
            } else h(`[InboxPoller] Plan rejected by team lead: ${g.feedback || "No feedback provided"}`);
        else if (g) h(`[InboxPoller] Ignoring plan approval response from non-team-lead: ${b.from}`)
    }

// READABLE (for understanding):
if (isTeammate() && hasTeamConfig()) {
    for (let message of unreadMessages) {
        let response = parsePlanApprovalResponse(message.text);  // iP1()

        if (response && message.from === "team-lead") {
            if (response.approved) {
                // Transition out of plan mode to granted permission mode
                let grantedMode = response.permissionMode ?? "default";
                setAppState((state) => ({
                    ...state,
                    toolPermissionContext: applyPermissionAction(state.toolPermissionContext, {
                        type: "setMode",
                        mode: normalizePermissionMode(grantedMode),   // KA1()
                        destination: "session"
                    })
                }));
                log(`[InboxPoller] Plan approved, exited plan mode to ${grantedMode}`);
            } else {
                // Rejection: stay in plan mode
                // The feedback message will be delivered to the LLM via normal mailbox message display
                log(`[InboxPoller] Plan rejected: ${response.feedback}`);
            }
        }
    }
}
```

**Key design decisions:**
- Only messages `from === "team-lead"` are processed as plan approval responses (security: teammates can't approve each other's plans)
- On approval: `applyPermissionAction()` (`a2()`) updates the permission context, transitioning teammate out of plan mode
- On rejection: the teammate stays in plan mode. The mailbox message is displayed as a regular message in the next conversation turn, which the LLM reads and uses to revise the plan

### Step 5: Response UI (`OfY`)

The `OfY` component renders the leader's approval/rejection response in the message list:

```javascript
// ============================================
// OfY - PlanApprovalResponse UI component
// Location: chunks.129.mjs:1799
// ============================================

// READABLE (for understanding):
function PlanApprovalResponseMessage({ response, senderName }) {
    if (response.approved) {
        return (
            <Box flexDirection="column" marginY={1}>
                <Box borderStyle="round" borderColor="success" flexDirection="column" paddingX={1} paddingY={1}>
                    <Text color="success" bold>✓ Plan Approved by {senderName}</Text>
                    <Box marginTop={1}>
                        <Text>You can now proceed with implementation. Your plan mode restrictions have been lifted.</Text>
                    </Box>
                </Box>
            </Box>
        );
    }

    // Rejection UI
    return (
        <Box flexDirection="column" marginY={1}>
            <Box borderStyle="round" borderColor="error" flexDirection="column" paddingX={1} paddingY={1}>
                <Text color="error" bold>✗ Plan Rejected by {senderName}</Text>
                {response.feedback && (
                    <Box marginTop={1} borderStyle="dashed" borderColor="subtle" paddingX={1}>
                        <Text>Feedback: {response.feedback}</Text>
                    </Box>
                )}
                <Box marginTop={1}>
                    <Text dimColor>Please revise your plan based on the feedback and call ExitPlanMode again.</Text>
                </Box>
            </Box>
        </Box>
    );
}
```

**Approval renders:**
```
╭──────────────────────────────────────────────────────────────╮
│ ✓ Plan Approved by team-lead                                 │  ← green
│                                                              │
│ You can now proceed with implementation. Your plan mode      │
│ restrictions have been lifted.                               │
╰──────────────────────────────────────────────────────────────╯
```

**Rejection renders:**
```
╭──────────────────────────────────────────────────────────────╮
│ ✗ Plan Rejected by team-lead                                 │  ← red
│                                                              │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│  ← dashed
│ Feedback: The plan doesn't handle error cases. Please add   │
│ error handling for network failures.                         │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│
│ Please revise your plan based on the feedback and call      │  ← dimmed
│ ExitPlanMode again.                                          │
╰──────────────────────────────────────────────────────────────╯
```

### Message Routing (`kM6` and `_fY`)

The `kM6()` and `_fY()` functions (chunks.129.mjs) auto-route messages to correct renderers based on message content:

```javascript
// ============================================
// kM6 - Message component router
// Location: chunks.129.mjs:1869
// ============================================

function renderTeamMessage(messageText, senderName) {
    let request = parsePlanApprovalRequest(messageText);   // ZM6()
    if (request) return createElement(PlanApprovalRequestMessage, { request });

    let response = parsePlanApprovalResponse(messageText); // iP1()
    if (response) return createElement(PlanApprovalResponseMessage, { response, senderName });

    return null;  // Regular message (falls through to normal rendering)
}

// ============================================
// _fY - Message text summary
// Location: chunks.129.mjs:1882
// ============================================

function getTeamMessageSummary(messageText) {
    let request = parsePlanApprovalRequest(messageText);
    if (request) return `[Plan Approval Request from ${request.from}]`;

    let response = parsePlanApprovalResponse(messageText);
    if (response)
        return response.approved
            ? "[Plan Approved] You can now proceed with implementation"
            : `[Plan Rejected] ${response.feedback || "Please revise your plan"}`;

    return null;
}
```

---

## Awaiting Plan Approval State

### TaskManager State

When a teammate submits a plan for approval, their task is marked:

```javascript
// ============================================
// $d4 - setTaskAwaitingPlanApproval
// Location: chunks.139.mjs:2587
// ============================================

// ORIGINAL (for source lookup):
function $d4(A, q, K) {
    c5(A, q, (Y) => ({
        ...Y,
        awaitingPlanApproval: K
    }))
}

// Updates task in TaskManager:
// task.awaitingPlanApproval = true (when plan submitted)
// task.awaitingPlanApproval = false (after response received, chunks.123.mjs:435)
```

### Swarm UI Status

Teammate card in the swarm view shows status based on `awaitingPlanApproval` (chunks.162.mjs:785):

```javascript
status = teammate.shutdownRequested ? "stopping"
       : teammate.awaitingPlanApproval ? "awaiting approval"   // ← plan approval state
       : teammate.isIdle ? "idle"
       : getRecentActivity(teammate.progress) ?? "working"
```

The `"awaiting approval"` status makes it immediately visible in the swarm UI that this teammate is blocked pending plan review.

---

## `normalizeToolInput` - Plan Content Injection

Before `ExitPlanMode.call()` executes, the tool input is normalized via `normalizeToolInput`. This injects the plan file content into the input:

```javascript
// Schema declaration (chunks.139.mjs:2629):
zHH = z7(() => _d4().extend({
    plan: z.string().optional().describe("The plan content (injected by normalizeToolInput from disk)")
}))
```

The plan file is read from disk and injected as `input.plan` before the tool runs. This is used by:
- The **permission dialog** to display the plan content to the user
- The **result renderer** `Kd4` to show the plan after approval

---

## Complete Swarm Approval Sequence

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Swarm Plan Approval Sequence                            │
└─────────────────────────────────────────────────────────────────────────────┘

Teammate LLM              Teammate InboxPoller       Team Leader LLM
     │                          │                          │
     │ calls ExitPlanMode        │                          │
     │                          │                          │
     ├──[write plan_approval_request]──────────────────►   │
     │   to filesystem mailbox                              │
     │   {type, from, planFilePath, planContent,            │
     │    requestId, timestamp}                             │
     │                          │                          │
     │ returns {isAgent:true,   │                          │
     │   awaitingLeaderApproval │                          │
     │   :true, requestId}      │                          │
     │                          │                          │
     │ TaskManager.awaitingPlanApproval = true             │
     │                          │                          │
     │ (LLM waits, mailbox prompt                          │
     │  tells it NOT to proceed)│                          │
     │                          │                          │
     │                          │   [Leader's mailbox]     │
     │                          │   receives plan_approval │
     │                          │   _request message       │
     │                          │                          │
     │                          │                          ├── Leader reads plan
     │                          │                          │   in $fY component
     │                          │                          │
     │                          │                          ├── calls SendMessage tool
     │                          │                          │   {type:"plan_approval_response",
     │                          │                          │    request_id, approved:true,
     │                          │                          │    recipient:agentName}
     │                          │                          │
     │                          │   [AhY writes response]  │
     │                          │   to teammate mailbox    │
     │                          │                          │
     │                     [polls mailbox]                  │
     │                          │                          │
     │                     iP1(message.text)               │
     │                     → plan_approval_response        │
     │                          │                          │
     │                     approved=true:                  │
     │◄──[setAppState]──────────┤                          │
     │   mode = grantedMode     │                          │
     │   ("default")            │                          │
     │                          │                          │
     │ LLM continues with       │                          │
     │ implementation!           │                          │
     │                          │                          │
```

---

## Edge Cases

### Rejection Loop

When a teammate's plan is rejected:
1. `approved: false` → InboxPoller logs rejection but does NOT change permission mode
2. The rejection message appears as a regular mailbox message in the next LLM turn
3. The `"Please revise your plan based on the feedback and call ExitPlanMode again."` message guides the LLM
4. LLM revises plan file, calls `ExitPlanMode` again → generates new `requestId`
5. Process repeats

### Race Conditions

Multiple teammates can submit plans simultaneously. Each has a unique `requestId` generated from:
```javascript
vP1("plan_approval", pv(agentName, teamName || "default"))
```

The `pv()` hash function ensures different request IDs per agent/team combination.

However, the team leader must manually match `request_id` when calling the approval response. The schema requires:
```javascript
{ request_id: "...", approved: true/false, recipient: "agent-name" }
```

### Re-entry After Approval

After a teammate's plan is approved and they complete work, if they enter plan mode again:
1. `hasExitedPlanMode` may already be `true` (set during the process)
2. The `ihY()` attachment generator handles this via `plan_mode_reentry` injection
3. The LLM is reminded to evaluate if the previous plan is still relevant

### Teammate not in plan_mode_required

If a teammate does NOT have `plan_mode_required: true` in their config, they do not use the swarm approval flow. `MC1()` (hasTeamConfig) returns `false`, so `ExitPlanMode` takes the standard user-approval path instead.

---

## Summary: Approval Dialog Comparison

| Property | Main Session | Swarm Teammate |
|----------|-------------|----------------|
| Who approves | User via terminal dialog | Team leader via SendMessage tool |
| Trigger | `checkPermissions() → ask` | `Dz() && MC1()` check |
| Channel | Permission request UI | Filesystem mailbox |
| Approval action | `call()` executes, mode restores | InboxPoller applies mode change |
| Rejection action | Tool call skipped, stays in plan | LLM gets rejection feedback message |
| UI component | Built-in permission prompt | `$fY` (request) + `OfY` (response) |
| Permission mode granted | `prePlanMode ?? "default"` | `response.permissionMode ?? "default"` |
| Request ID | N/A | UUID via `vP1("plan_approval", hash(agent, team))` |
