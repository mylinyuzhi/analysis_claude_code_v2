# Plan Mode Implementation

## Overview

Plan Mode is a specialized state in Claude Code designed to facilitate architectural planning and user alignment before implementation. It restricts the agent's capabilities to read-only exploration and enforces a structured approval workflow, especially in multi-agent "swarm" configurations.

## Architecture

Plan Mode is implemented via:
1.  **State Machine**: A `mode` property in `toolPermissionContext` (AppState).
2.  **Tool Gates**: `EnterPlanMode` and `ExitPlanMode` tools that trigger state transitions.
3.  **Tool Filtering**: Dynamic restriction of available tools based on the current mode.
4.  **Approval Protocol**: An inter-agent messaging protocol for teammates to request plan approval from the team leader.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `EnterPlanMode` (kg1/N_6) - Tool to enter plan mode
- `ExitPlanMode` (Nj/bW) - Tool to exit plan mode
- `SendMessageTool` (YhY) - Handles approval response
- `handlePlanApprovalRequest` (part of ExitPlanMode logic) - Submits plan for review

## 1. Entering Plan Mode

The entry point is the `EnterPlanMode` tool. It transitions the session state to `mode: "plan"`.

### EnterPlanMode Tool
**Location**: `chunks.140.mjs`

```javascript
// ============================================
// EnterPlanMode - Transitions agent into restricted planning state
// Location: chunks.140.mjs:1649
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
    })), { data: { message: "Entered plan mode..." } }
}

// READABLE (for understanding):
async function EnterPlanMode_call(input, context) {
    if (context.agentId) {
        throw Error("EnterPlanMode tool cannot be used in agent contexts"); // Teammates are spawned with fixed modes
    }
    
    let appState = await context.getAppState();
    // Validate transition (ey)
    validateModeTransition(appState.toolPermissionContext.mode, "plan");
    
    context.setAppState((state) => ({
        ...state,
        toolPermissionContext: {
            // Update permissions to 'plan' mode
            ...updatePermissionState(state.toolPermissionContext, { 
                type: "setMode", 
                mode: "plan", 
                destination: "session" 
            }),
            // Save previous mode to restore later (e.g., 'default' or 'acceptEdits')
            prePlanMode: state.toolPermissionContext.mode
        }
    }));
    
    return { 
        data: { 
            message: "Entered plan mode. You should now focus on exploring the codebase..." 
        } 
    };
}

// Mapping: kg1→EnterPlanMode, A→input, q→context, a2→updatePermissionState, ey→validateModeTransition
```

**Key Logic**:
1.  **Context Check**: Prevents sub-agents from manually entering plan mode (they are usually assigned a mode at spawn).
2.  **State Update**: Sets `mode` to `"plan"` and backs up the current mode to `prePlanMode`.
3.  **Tool Restriction**: The `plan` mode causes the tool filter (`YP6`/`tD` in `chunks.141.mjs`) to hide modification tools (Write, Edit, Bash) and only expose read-only tools (Glob, Grep, Read, LS).

## 2. Exiting Plan Mode

The exit process differs depending on whether the agent is a standalone user session or a teammate in a swarm.

### ExitPlanMode Tool
**Location**: `chunks.139.mjs`

```javascript
// ============================================
// ExitPlanMode - Validates plan and transitions back to implementation
// Location: chunks.139.mjs:2641
// ============================================

// ORIGINAL (for source lookup):
async call(A, q) {
    let K = !!q.agentId,
        Y = uW(q.agentId), // getPlanPath
        z = pD(q.agentId); // readPlanFile
        
    if (Dz() && MC1()) { // isHeadless && isPlanApprovalRequired
        if (!z) throw Error(`No plan file found at ${Y}...`);
        
        let H = g5() || "unknown", // agentName
            $ = i3(), // teamName
            O = vP1("plan_approval", pv(H, $ || "default")); // generateRequestId
            
        let _ = {
            type: "plan_approval_request",
            from: H,
            timestamp: new Date().toISOString(),
            planFilePath: Y,
            planContent: z,
            requestId: O
        };
        
        f9("team-lead", { // sendToMailbox
            from: H,
            text: Q1(_),
            timestamp: new Date().toISOString()
        }, $);
        
        // ... set awaiting approval state ...
        return { data: { plan: z, isAgent: !0, awaitingLeaderApproval: !0, requestId: O } };
    }
    
    // Standalone / Leader Path
    q.setAppState((H) => {
        if (H.toolPermissionContext.mode !== "plan") return H;
        let $ = H.toolPermissionContext.prePlanMode ?? "default";
        return {
            ...H,
            toolPermissionContext: {
                ...H.toolPermissionContext,
                mode: $, // Restore previous mode
                prePlanMode: void 0
            }
        }
    });
    
    return { data: { plan: z, isAgent: K } };
}

// Mapping: Nj→ExitPlanMode, bW→"ExitPlanMode", f9→sendToMailbox
```

**Key Logic**:
1.  **Plan Verification**: Reads the plan markdown file from the agent's context.
2.  **Teammate Flow**:
    *   If running as a sub-agent (`Dz()` is true) and plan mode is required (`MC1()`):
    *   Constructs a `plan_approval_request` message.
    *   Sends it to the `team-lead` via the filesystem mailbox (`f9`).
    *   Enters a "blocked" state waiting for approval.
3.  **Standalone Flow**:
    *   Immediately restores the `prePlanMode`.
    *   Returns success, allowing the agent to proceed with implementation.

## 3. Plan Approval Protocol

When a teammate requests approval, the team leader receives a structured message. The leader (usually the user or a supervisor agent) reviews the plan and responds.

### Approval Response
**Location**: `chunks.141.mjs` (SendMessageTool)

The `SendMessageTool` handles the `plan_approval_response` type:

```javascript
// ============================================
// handlePlanApprovalResponse - Leader processing of plan review
// Location: chunks.141.mjs:1239
// ============================================

// ORIGINAL (for source lookup):
async function AhY(A, q) {
    let K = await q.getAppState();
    if (!PM(K.teamContext)) throw Error("Only the team lead can approve plans...");
    
    let z = K.toolPermissionContext.mode,
        w = z === "plan" || z === "delegate" ? "default" : z,
        H = {
            type: "plan_approval_response",
            requestId: A.request_id,
            approved: !0,
            timestamp: new Date().toISOString(),
            permissionMode: w
        };
        
    return f9(A.recipient, { from: K2, text: Q1(H), ... }, Y), { ... };
}

// Mapping: AhY→approvePlan, A→input, K2→"team-lead"
```

**Logic**:
*   **Validation**: Ensures only the team leader can approve.
*   **Permission Grant**: Determines the permission mode the teammate should transition to (usually "default").
*   **Notification**: Sends a `plan_approval_response` back to the teammate's inbox.
*   **Teammate Reaction**: The teammate's message loop detects this response (via `TeammateMailbox`), unlocks the blocking state, and updates the permission mode to the one granted by the leader.

## 4. Tool Visibility

The filtering of tools during Plan Mode is handled in the tool resolver:

**Location**: `chunks.141.mjs`

```javascript
// ============================================
// getToolsForMode - Filters tools based on current mode
// Location: chunks.141.mjs:1505
// ============================================

// ORIGINAL (for source lookup):
tD = (A) => {
    // ...
    let K = kt().filter((w) => !q.has(w.name)),
        Y = hg1(K, A); // Permission filtering
        
    if (A.mode === "delegate") Y = Y.filter((w) => R_6.has(w.name));
    
    // ...
    return Y
}
```

While explicit "plan" mode filtering isn't essentially hardcoded in a simple switch, it relies on the `hg1` (permission check) and the specific tool definitions. `EnterPlanMode` sets the mode, and potentially rules are added or the system relies on the agent respecting the mode instructions, though in v2.1.38 it appears `EnterPlanMode` primarily acts as a semantic state switch that the LLM is instructed to respect, backed by specific tool availability checks in `checkPermissions` of dangerous tools.

However, `ExitPlanMode` is the *only* way to leave this state programmatically, enforcing the "Plan -> Approve -> Act" lifecycle.
