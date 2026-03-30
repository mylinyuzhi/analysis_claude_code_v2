# Plan Mode Approval Flow (Claude Code 2.1.76)

> Complete analysis of the plan approval lifecycle: user-facing dialog, swarm inter-agent protocol, UI rendering, and state transitions.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode, Agent Teams)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `ExitPlanModeTool` (`zD`) - Tool object, chunks.143.mjs:2802
- `EnterPlanModeTool` (`Ki6`) - Tool object, chunks.144.mjs:1579
- `approvePlan` (_xY) - Leader approves plan, chunks.145.mjs:2521
- `rejectPlan` (wxY) - Leader rejects plan, chunks.145.mjs:2547
- `parsePlanApprovalResponse` (Zf6) - Parse approval/rejection from mailbox, chunks.132.mjs:344
- `parsePlanApprovalRequest` (UY6) - Parse plan_approval_request, chunks.132.mjs:320
- `InboxPoller plan_approval_response handler` - chunks.194.mjs:1072
- `PlanApprovalRequestMessageSchema` (ud4) - chunks.132.mjs:470
- `PlanApprovalResponseMessageSchema` (md4) - chunks.132.mjs:477

---

## Two Approval Paths

```
ExitPlanMode called
        │
        ├─── PATH A: Main Session (user-facing)
        │         $Y() = false (not a teammate)
        │         checkPermissions() → { behavior: "ask" }
        │         → Permission dialog: "Exit plan mode?"
        │         → User clicks Yes/No in terminal
        │
        └─── PATH B: Swarm Teammate
                  $Y() = true AND NF6() = true
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
// Location: chunks.143.mjs:2859
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions(A, q) {
    if ($Y()) return {
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
async function checkPermissions(input, context) {
    // Swarm teammates bypass user approval (team-lead approves instead)
    if (isTeammate()) return { behavior: "allow", updatedInput: input };
    // Main session: always ask user
    return { behavior: "ask", message: "Exit plan mode?", updatedInput: input };
}

// Mapping: $Y→isTeammate
```

### The `aPq` Permission Component — "Ready to Code?" Dialog

The `checkPermissions()` returning `{ behavior: "ask" }` causes the permission system to render `aPq` (`ExitPlanModeDialog`, chunks.181.mjs:405) — a **custom permission component** that replaces the standard Yes/No dialog.

`aPq` has 5 UI states:

| State | Trigger | UI |
|-------|---------|-----|
| `default` | No plan content | "Exit plan mode?" + simple Yes/No |
| `default` | Has plan content | "Ready to code?" + plan + 4-5 options |
| `checking` | Push-to-remote clicked | "Checking prerequisites…" spinner |
| `creating` | Prerequisites passed | "Creating remote session…" spinner |
| `git-dialog` | Uncommitted changes | Git commit/push decision dialog |
| `eligibility-error` | Push prerequisites failed | Error list with fix instructions |

### Full Option Set (when plan exists)

```
► Yes, clear context and auto-accept edits (shift+tab)   ← clearContext=true, mode=acceptEdits
                                                           ← Enterprise: "Yes, clear context and bypass permissions"
  Yes, auto-accept edits                                  ← clearContext=false, mode=acceptEdits
  Yes, manually approve edits                             ← clearContext=false, mode=default
  No, keep planning  [text input + image paste support]  ← rejection with typed feedback
```

**Context-clearing options (recommended path):**
- Injects "Implement the following plan:\n\n{plan}" as the `initialMessage` for the next session
- Sets `clearContext: true` which triggers `clearConversation()` (GIA) — full session reset
- Also appends: transcript URL reminder + TeamCreate suggestion (if teams enabled)
- New session starts fresh with only the plan as user message, in the target mode

**Keep-context options:**
- Calls `toolUseConfirm.onAllow(planContent, permissionsList)` directly
- ExitPlanMode `call()` executes, LLM receives: "User has approved your plan..."
- Planning conversation history remains in context

**"No, keep planning":**
- User types feedback (required) and optionally pastes images
- Calls `toolUseConfirm.onReject(feedback, images)` — plan stays in plan mode
- LLM receives feedback as user message and continues refining the plan

### External Editor (Ctrl+G)

While the dialog is open, `Ctrl+G` opens the plan in the configured external editor:
- If `ExitPlanMode` tool (no plan file yet): edits plan content string
- If tool is triggered from existing plan file: edits the file on disk
- After save: "✓ Plan saved!" notification appears for 5 seconds

### What the User Sees (plan exists)

```
╭────────────────────────────────────────────────────────╮
│ Ready to code?                                          │
│                                                         │
│ Here is Claude's plan:                                  │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│ # Implementation Plan                                   │
│ ## Context: Add Redis caching...                        │
│ ...                                                     │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│ Claude has written up a plan and is ready to execute.   │
│ Would you like to proceed?                              │
│                                                         │
│ ► Yes, clear context and auto-accept edits (shift+tab)  │
│   Yes, auto-accept edits                                │
│   Yes, manually approve edits                           │
│   No, keep planning  [Type here to tell Claude...]      │
│                                                         │
│ ctrl-g to edit in vim                                   │
╰────────────────────────────────────────────────────────╯
```

> Complete dialog analysis with code: [interview_phase.md §10](./interview_phase.md)

When the user selects **"Yes, clear context and auto-accept edits"** (recommended):
1. App state updated: `initialMessage = { clearContext: true, mode: "acceptEdits", content: "Implement the following plan:..." }`
2. `setHasExitedPlanMode(true)`, `onDoneClosingDialog()`, `onCancel()`, `onReject()`
3. Session manager detects `clearContext: true` → clears conversation
4. New session starts with plan as first message, mode = acceptEdits

When the user selects **"Yes, auto-accept edits"** (keep context):
1. `setHasExitedPlanMode(true)`, `setNeedsPlanModeExitAttachment(true)`
2. `toolUseConfirm.onAllow(planContent, permissionsList)` — tool executes
3. Permission mode restored to `prePlanMode`
4. UI renders approval result card (`Kd4`, state 4)
5. LLM receives: "User has approved your plan. You can now start coding..."

When the user selects **"No, keep planning"** (types feedback):
1. Tool `call()` is NOT executed (skipped)
2. Permission mode stays `"plan"`
3. UI renders rejection card (`Yd4`) with plan content in planMode-colored border
4. `renderToolUseRejectedMessage` is called → shows `HX6` component
5. LLM receives the typed feedback as a user message and refines the plan

### v2.1.76: Plan Re-Approval Fix

In v2.1.76, a fix was applied to the plan re-approval flow. Previously, if a user approved a plan (which caused the dialog to accept) but then the plan needed to be re-approved (e.g., after edits), the dialog could be in a stale state. The fix ensures the plan approval dialog correctly resets its state and re-fetches the latest plan content when `ExitPlanMode` is called again after the previous call completed approval. This prevents showing the user an outdated plan when they call `ExitPlanMode` a second time.

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

## Auto-Mode Gate (acceptEdits Blocking)

### Overview

When exiting plan mode with `prePlanMode = "auto"` (meaning the user was in auto-accept mode before entering plan mode), an additional gate check prevents automatic restoration of `acceptEdits` mode under certain conditions.

**Why this matters:**
- The `acceptEdits` mode grants auto-approval for file modifications
- Enterprise environments may want to restrict this mode via circuit-breaker
- Prevents unintended auto-accept behavior after plan approval

### Gate Logic

```javascript
// ============================================
// Auto-mode gate at ExitPlanMode
// Location: chunks.143.mjs:2916-2921
// ============================================

// ORIGINAL (for source lookup):
{
    let H = _.toolPermissionContext.prePlanMode ?? "default",
        j = H === "ultraplan" ? "default" : H;
    if ((j === "auto" || !1) && !(sl6?.isAutoModeGateEnabled() ?? !1)) {
        let M = sl6?.getAutoModeUnavailableReason() ?? "circuit-breaker";
        O = sl6?.getAutoModeUnavailableNotification(M) ?? "auto mode unavailable", k(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${j} but gate is off (reason=${M}) — falling back to default on plan exit`, {
            level: "warn"
        })
    }
}

// READABLE (for understanding):
{
    let savedMode = state.toolPermissionContext.prePlanMode ?? "default";
    let effectiveMode = savedMode === "ultraplan" ? "default" : savedMode;

    // If user was in "auto" mode before plan, check if we can restore it
    if (effectiveMode === "auto" && !(permissionGate?.isAutoModeGateEnabled() ?? false)) {
        // Gate is disabled → block auto mode restoration
        let reason = permissionGate?.getAutoModeUnavailableReason() ?? "circuit-breaker";
        let notification = permissionGate?.getAutoModeUnavailableNotification(reason) ?? "auto mode unavailable";

        log(`[auto-mode gate] prePlanMode=${effectiveMode} but gate is off (reason=${reason}) — falling back to default`, {
            level: "warn"
        });

        // Fallback: use "default" mode instead of "auto"
        effectiveMode = "default";
    }
}

// Mapping: H→savedMode, j→effectiveMode, sl6→permissionGate, k→log
```

### Gate Functions

The permission gate exposes three functions (exported from `cli.chunks.mjs`):

| Function | Purpose | Return Type |
|----------|---------|-------------|
| `isAutoModeGateEnabled()` | Check if auto-mode is allowed | `boolean` |
| `getAutoModeUnavailableReason()` | Get reason code for blocking | `"circuit-breaker" \| ...` |
| `getAutoModeUnavailableNotification(reason)` | Get user-facing message | `string` |

**Default behavior:**
- If gate functions are unavailable (`sl6` is null/undefined): Gate is considered **disabled** (failsafe)
- Default reason: `"circuit-breaker"`
- Default notification: `"auto mode unavailable"`

### Behavior Summary

| Condition | Result |
|-----------|--------|
| `prePlanMode = "default"` | Restores to `"default"` (no change) |
| `prePlanMode = "acceptEdits"` | Restores to `"acceptEdits"` (no gate check) |
| `prePlanMode = "auto"` + gate enabled | Restores to `"auto"` |
| `prePlanMode = "auto"` + gate disabled | Falls back to `"default"` |
| `prePlanMode = "ultraplan"` | Always converts to `"default"` |

### User Experience

When the gate blocks auto-mode restoration:
1. User approves plan
2. Session exits plan mode
3. Mode is set to `"default"` instead of `"auto"`
4. User sees standard permission prompts for file edits (not auto-accepted)
5. Warning logged for debugging

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
// ExitPlanMode swarm flow (call() branch)
// Location: chunks.143.mjs:2879
// ============================================

// ORIGINAL (for source lookup):
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
    await x3("team-lead", {
        from: H,
        text: B6(M),
        timestamp: new Date().toISOString()
    }, j);
    let D = q.getAppState(),    // SYNC — no await
        X = ik1(H, D);
    if (X) ag8(X, q.setAppState, !0);
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
if (isTeammate() && hasTeamConfig()) {
    if (!planContent) throw Error(`No plan file found at ${planFilePath}. Please write your plan to this file before calling ExitPlanMode.`);

    let agentName = getAgentName() || "unknown";    // i3()
    let teamName = getTeamName();                    // l5()
    let requestId = generateRequestId("plan_approval", hash(agentName, teamName || "default"));  // bZ6()

    // Construct structured request
    let approvalRequest = {
        type: "plan_approval_request",
        from: agentName,
        timestamp: new Date().toISOString(),
        planFilePath: planFilePath,
        planContent: planContent,    // Full plan text
        requestId: requestId         // UUID for matching response
    };

    // Write to team-lead mailbox (await because writeToMailbox is async)
    await writeToMailbox("team-lead", {
        from: agentName,
        text: serializeMessage(approvalRequest),
        timestamp: new Date().toISOString()
    }, teamName);

    // Mark task as awaiting plan approval in TaskManager (SYNC getAppState)
    let appState = toolContext.getAppState();
    let taskId = findTaskByAgentName(agentName, appState);   // ik1()
    if (taskId) setTaskAwaitingPlanApproval(taskId, toolContext.setAppState, true);  // ag8()

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

// Mapping: $Y→isTeammate, NF6→hasTeamConfig, z→planContent, Y→planFilePath, H→agentName, j→teamName, J→requestId, M→approvalRequest, i3→getAgentName, l5→getTeamName, bZ6→generateRequestId, ak→hash, x3→writeToMailbox, B6→serializeMessage, D→appState, X→taskId, ik1→findTaskByAgentName, ag8→setTaskAwaitingPlanApproval
```

### Message Schema

```javascript
// ============================================
// PlanApprovalRequestMessageSchema (ud4)
// Location: chunks.132.mjs:470
// ============================================

// ORIGINAL (for source lookup):
ud4 = F6(() => C.object({
    type: C.literal("plan_approval_request"),
    from: C.string(),
    timestamp: C.string(),
    planFilePath: C.string(),
    planContent: C.string(),
    requestId: C.string()
}))

// READABLE (for understanding):
PlanApprovalRequestMessageSchema = lazySchema(() => zod.object({
    type: zod.literal("plan_approval_request"),
    from: zod.string(),
    timestamp: zod.string(),
    planFilePath: zod.string(),
    planContent: zod.string(),
    requestId: zod.string()
}))

// Mapping: ud4→PlanApprovalRequestMessageSchema, F6→lazySchema, C→zod

// ============================================
// PlanApprovalResponseMessageSchema (md4)
// Location: chunks.132.mjs:477
// ============================================

// ORIGINAL (for source lookup):
md4 = F6(() => C.object({
    type: C.literal("plan_approval_response"),
    requestId: C.string(),
    approved: C.boolean(),
    feedback: C.string().optional(),
    timestamp: C.string(),
    permissionMode: J66().optional()
}))

// READABLE (for understanding):
PlanApprovalResponseMessageSchema = lazySchema(() => zod.object({
    type: zod.literal("plan_approval_response"),
    requestId: zod.string(),
    approved: zod.boolean(),
    feedback: zod.string().optional(),   // Only on rejection
    timestamp: zod.string(),
    permissionMode: permissionModeEnum().optional()  // Mode to grant on approval
}))

// Mapping: md4→PlanApprovalResponseMessageSchema, F6→lazySchema, C→zod, J66→permissionModeEnum
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

**In messages list**: `DTY` component (chunks.132.mjs:680):

```javascript
// ============================================
// DTY - PlanApprovalRequestMessage UI component
// Location: chunks.132.mjs:680
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
// _xY - approvePlan
// Location: chunks.145.mjs:2521
// ============================================

// ORIGINAL (for source lookup):
async function _xY(A, q, K) {
    let Y = K.getAppState(),        // SYNC — no await
        z = Y.teamContext?.teamName;
    if (!KZ(Y.teamContext)) throw Error("Only the team lead can approve plans. Teammates cannot approve their own or other plans.");
    let _ = Y.toolPermissionContext.mode,
        w = _ === "plan" ? "default" : _,   // Only "plan"→"default" (no "delegate" check)
        O = {
            type: "plan_approval_response",
            requestId: q,
            approved: !0,
            timestamp: new Date().toISOString(),
            permissionMode: w
        };
    return await x3(A, {
        from: BY,
        text: B6(O),
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
    let appState = toolContext.getAppState();   // SYNC — getAppState has no await
    let teamName = appState.teamContext?.teamName;

    // Only team leader can approve
    if (!isTeamLeader(appState.teamContext))
        throw Error("Only the team lead can approve plans.");

    // Determine permission mode to grant: "plan" → "default", else keep current
    let currentMode = appState.toolPermissionContext.mode;
    let grantMode = currentMode === "plan" ? "default" : currentMode;

    let response = {
        type: "plan_approval_response",
        requestId: requestId,
        approved: true,
        timestamp: new Date().toISOString(),
        permissionMode: grantMode    // "default" typically
    };

    // Write response to teammate's mailbox (await because writeToMailbox is async)
    await writeToMailbox(recipient, {
        from: TEAM_LEAD_ID,
        text: serializeMessage(response),
        timestamp: new Date().toISOString()
    }, teamName);

    return { data: { success: true, message: `Plan approved for ${recipient}...`, request_id: requestId } };
}

// Mapping: _xY→approvePlan, A→recipient, q→requestId, K→toolContext, KZ→isTeamLeader, x3→writeToMailbox, BY→TEAM_LEAD_ID, B6→serializeMessage
```

**Rejection:**
```javascript
// ============================================
// wxY - rejectPlan
// Location: chunks.145.mjs:2547
// ============================================

// ORIGINAL (for source lookup):
async function wxY(A, q, K, Y) {
    let z = Y.getAppState(),        // SYNC — no await; Y is 4th param (toolContext)
        _ = z.teamContext?.teamName;
    if (!KZ(z.teamContext)) throw Error("Only the team lead can reject plans. Teammates cannot reject their own or other plans.");
    let w = {
        type: "plan_approval_response",
        requestId: q,
        approved: !1,
        feedback: K,                // K is 3rd param (feedback string)
        timestamp: new Date().toISOString()
        // Note: no permissionMode on rejection (teammate stays in plan mode)
    };
    return await x3(A, {
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
    let appState = toolContext.getAppState();   // SYNC
    let teamName = appState.teamContext?.teamName;

    if (!isTeamLeader(appState.teamContext))
        throw Error("Only the team lead can reject plans.");

    let response = {
        type: "plan_approval_response",
        requestId: requestId,
        approved: false,
        feedback: feedback,         // Textual rejection reason
        timestamp: new Date().toISOString()
        // NO permissionMode → teammate stays in plan mode
    };

    await writeToMailbox(recipient, {
        from: TEAM_LEAD_ID,
        text: serializeMessage(response),
        timestamp: new Date().toISOString()
    }, teamName);

    return { data: { success: true, message: `Plan rejected for ${recipient} with feedback: "${feedback}"`, request_id: requestId } };
}

// Mapping: wxY→rejectPlan, A→recipient, q→requestId, K→feedback, Y→toolContext, KZ→isTeamLeader, x3→writeToMailbox, BY→TEAM_LEAD_ID, B6→serializeMessage
// Key differences from approvePlan (_xY):
// - 4 params: feedback (K) is passed separately
// - approved: false
// - feedback field included, NO permissionMode field
```

### Step 4: Teammate Receives Response (InboxPoller)

The teammate's `InboxPoller` in `chunks.194.mjs` polls the mailbox and processes `plan_approval_response`:

```javascript
// ============================================
// InboxPoller plan_approval_response handler
// Location: chunks.194.mjs:1079
// ============================================

// ORIGINAL (for source lookup):
if ($Y() && NF6())
    for (let g of X) {
        let B = Zf6(g.text);
        if (B && g.from === "team-lead")
            if (k(`[InboxPoller] Received plan approval response from team-lead: approved=${B.approved}`), B.approved) {
                let b = B.permissionMode ?? "default";
                w((p) => ({
                    ...p,
                    toolPermissionContext: Ez(p.toolPermissionContext, {
                        type: "setMode",
                        mode: _C(b),
                        destination: "session"
                    })
                })), k(`[InboxPoller] Plan approved by team lead, exited plan mode to ${b}`)
            } else k(`[InboxPoller] Plan rejected by team lead: ${B.feedback||"No feedback provided"}`);
        else if (B) k(`[InboxPoller] Ignoring plan approval response from non-team-lead: ${g.from}`)
    }

// READABLE (for understanding):
if (isTeammate() && hasTeamConfig()) {
    for (let message of unreadMessages) {
        let response = parsePlanApprovalResponse(message.text);  // Zf6()

        if (response && message.from === "team-lead") {
            if (response.approved) {
                // Log received, then transition out of plan mode to granted permission mode
                log(`[InboxPoller] Received plan approval response from team-lead: approved=true`);
                let grantedMode = response.permissionMode ?? "default";
                setAppState((state) => ({
                    ...state,
                    toolPermissionContext: applyPermissionAction(state.toolPermissionContext, {
                        type: "setMode",
                        mode: normalizePermissionMode(grantedMode),   // _C()
                        destination: "session"
                    })
                }));
                log(`[InboxPoller] Plan approved by team lead, exited plan mode to ${grantedMode}`);
            } else {
                // Rejection: stay in plan mode
                // The feedback message will be delivered to the LLM via normal mailbox message display
                log(`[InboxPoller] Plan rejected by team lead: ${response.feedback || "No feedback provided"}`);
            }
        } else if (response) {
            log(`[InboxPoller] Ignoring plan approval response from non-team-lead: ${message.from}`);
        }
    }
}

// Mapping: $Y→isTeammate, NF6→hasTeamConfig, X→unreadMessages, Zf6→parsePlanApprovalResponse, w→setAppState, Ez→applyPermissionAction, _C→normalizePermissionMode, k→log
```

**Key design decisions:**
- Only messages `from === "team-lead"` are processed as plan approval responses (security: teammates can't approve each other's plans)
- On approval: `applyPermissionAction()` (`Ez`) updates the permission context, transitioning teammate out of plan mode
- On rejection: the teammate stays in plan mode. The mailbox message is displayed as a regular message in the next conversation turn, which the LLM reads and uses to revise the plan

### Step 5: Response UI (`XTY`)

The `XTY` component renders the leader's approval/rejection response in the message list:

```javascript
// ============================================
// XTY - PlanApprovalResponseMessage UI component
// Location: chunks.132.mjs:723
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

### Message Routing (`qN1` and `PTY`)

The `qN1()` and `PTY()` functions (chunks.132.mjs) auto-route messages to correct renderers based on message content:

```javascript
// ============================================
// qN1 - renderTeamMessage - Message component router
// Location: chunks.132.mjs:793
// ============================================

// ORIGINAL (for source lookup):
function qN1(A, q) {
    let K = UY6(A);
    if (K) return A5.createElement(DTY, { request: K });
    let Y = Zf6(A);
    if (Y) return A5.createElement(XTY, { response: Y, senderName: q });
    return null
}

// READABLE (for understanding):
function renderTeamMessage(messageText, senderName) {
    let request = parsePlanApprovalRequest(messageText);   // UY6()
    if (request) return createElement(PlanApprovalRequestMessage, { request });  // DTY

    let response = parsePlanApprovalResponse(messageText); // Zf6()
    if (response) return createElement(PlanApprovalResponseMessage, { response, senderName });  // XTY

    return null;  // Regular message (falls through to normal rendering)
}

// Mapping: qN1→renderTeamMessage, UY6→parsePlanApprovalRequest, Zf6→parsePlanApprovalResponse, DTY→PlanApprovalRequestMessage, XTY→PlanApprovalResponseMessage

// ============================================
// PTY - getTeamMessageSummary - Message text summary
// Location: chunks.132.mjs:806
// ============================================

// ORIGINAL (for source lookup):
function PTY(A) {
    let q = UY6(A);
    if (q) return `[Plan Approval Request from ${q.from}]`;
    let K = Zf6(A);
    if (K)
        if (K.approved) return "[Plan Approved] You can now proceed with implementation";
        else return `[Plan Rejected] ${K.feedback||"Please revise your plan"}`;
    return null
}

// READABLE (for understanding):
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

// Mapping: PTY→getTeamMessageSummary, UY6→parsePlanApprovalRequest, Zf6→parsePlanApprovalResponse
```

---

## Awaiting Plan Approval State

### TaskManager State

When a teammate submits a plan for approval, their task is marked:

```javascript
// ============================================
// ag8 - setTaskAwaitingPlanApproval
// Location: chunks.143.mjs:2708
// ============================================

// ORIGINAL (for source lookup):
function ag8(A, q, K) {
    i9(A, q, (Y) => ({
        ...Y,
        awaitingPlanApproval: K
    }))
}

// Mapping: ag8→setTaskAwaitingPlanApproval, A→taskId, q→setAppState, K→value, i9→updateTask

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
// Schema declaration (chunks.143.mjs:2791):
dsw = F6(() => E1q().extend({
    plan: C.string().optional().describe("The plan content (injected by normalizeToolInput from disk)"),
    planFilePath: C.string().optional().describe("The plan file path (injected by normalizeToolInput)")
}))
// Mapping: dsw→extendedInputSchema, E1q→baseInputSchema, F6→lazySchema
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
     │                          │                          │   in DTY component
     │                          │                          │
     │                          │                          ├── calls SendMessage tool
     │                          │                          │   {type:"plan_approval_response",
     │                          │                          │    request_id, approved:true,
     │                          │                          │    recipient:agentName}
     │                          │                          │
     │                          │   [_xY writes response]  │
     │                          │   to teammate mailbox    │
     │                          │                          │
     │                     [polls mailbox]                  │
     │                          │                          │
     │                     Zf6(message.text)               │
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
2. The `DuY()` attachment generator handles this via `plan_mode_reentry` injection
3. The LLM is reminded to evaluate if the previous plan is still relevant

### Teammate not in plan_mode_required

If a teammate does NOT have `plan_mode_required: true` in their config, they do not use the swarm approval flow. `NF6()` (`isPlanModeRequired`) returns `false`, so `ExitPlanMode` takes the standard user-approval path instead.

---

## Summary: Approval Dialog Comparison

| Property | Main Session | Swarm Teammate |
|----------|-------------|----------------|
| Who approves | User via terminal dialog | Team leader via SendMessage tool |
| Trigger | `checkPermissions() → ask` | `$Y() && NF6()` check |
| Channel | Permission request UI | Filesystem mailbox |
| Approval action | `call()` executes, mode restores | InboxPoller applies mode change |
| Rejection action | Tool call skipped, stays in plan | LLM gets rejection feedback message |
| UI component | Built-in permission prompt | `DTY` (request) + `XTY` (response) |
| Permission mode granted | `prePlanMode ?? "default"` | `response.permissionMode ?? "default"` |
| Request ID | N/A | UUID via `vP1("plan_approval", hash(agent, team))` |
