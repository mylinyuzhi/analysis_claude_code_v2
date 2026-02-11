# Inter-Agent Communication Protocol

## Overview

Agents in a team communicate exclusively through the `SendMessage` tool. This ensures that all interactions are tracked, throttled, and properly delivered to the correct agent's context. Direct text output from a teammate is *not* visible to others unless sent via this tool.

## Message Types

The protocol supports several message types to handle different coordination needs:

| Type | Recipient | Purpose |
|------|-----------|---------|
| `message` | Specific agent | Direct communication / DM. |
| `broadcast` | All agents | Team-wide announcements (expensive, use sparingly). |
| `shutdown_request` | Teammate | Leader requesting an agent to exit. |
| `shutdown_response` | Leader | Agent approving or rejecting shutdown. |
| `plan_approval_response` | Teammate | Leader approving/rejecting an agent's plan. |

## Delivery Mechanism

### Automatic Delivery

Messages are delivered automatically to the target agent's conversation.
- If the agent is **idle**, the message "wakes" them up for a new turn.
- If the agent is **busy**, the message is queued in their `inbox` and delivered after the current turn ends.

### Internal vs. External Communication

- **External agents (tmux/iterm2)**: Use IPC or file-based signals to notify the other process of new messages.
- **In-process agents**: Use the `AppState` and shared memory to deliver messages directly to the task's message queue.

## Key Decisions & Algorithms

### [Decision] Asynchronous Message Queuing

**Why this approach**:
Agents may take several minutes to complete a tool-intensive turn. If messages were delivered synchronously, it would interrupt the agent's internal state machine. By queuing messages and delivering them as new "User" turns, the system maintains a clean request-response loop for each agent.

### [Algorithm] Shutdown Protocol

**How it works**:
1. Leader calls `SendMessage(type: "shutdown_request")`.
2. Teammate receives the request and must respond with `SendMessage(type: "shutdown_response")`.
3. If approved (`approve: true`):
   - For **in-process** agents: The `AbortController` for that agent's task is triggered (`chunks.141.mjs:1188`).
   - For **external** agents: The process exits with code 0 (`nK(0)`).
4. If rejected: Teammate provides a reason, and the leader is notified.

**Key insight**: Teammates have "agency" even in shutdown; they can reject a shutdown if they are in the middle of a critical task.

## Code Snippets

// ============================================
// handleShutdownApproval - Processes a teammate's approval to exit
// Location: chunks.141.mjs:1159-1214
// ============================================

// ORIGINAL (for source lookup):
async function tSY(A, q) {
    let K = i3(), Y = ID(), z = g5() || "teammate", w = A.request_id;
    let H, $;
    if (K) {
        let _ = M51(K);
        if (_ && Y) {
            let J = _.members.find((X) => X.agentId === Y);
            if (J) H = J.tmuxPaneId, $ = J.backendType
        }
    }
    // ... logic to deliver message to lead ...
    if ($ === "in-process") {
        if (Y) {
            let _ = await q.getAppState(), J = ps(Y, _.tasks);
            if (J?.abortController) J.abortController.abort();
        }
    } else {
        setImmediate(async () => { await nK(0, "other") })
    }
    return { data: { success: !0, message: `Shutdown approved.`, request_id: w } }
}

// READABLE (for understanding):
async function handleShutdownApproval(input, context) {
    const teamName = getTeamName();
    const agentId = getAgentId();
    const agentName = getAgentName() || "teammate";
    const requestId = input.request_id;

    let backendType;
    if (teamName) {
        const config = getTeamConfig(teamName);
        const member = config?.members.find(m => m.agentId === agentId);
        backendType = member?.backendType;
    }

    // Deliver confirmation message to the lead agent
    deliverMessage(LEAD_AGENT_NAME, { from: agentName, ... });

    if (backendType === "in-process") {
        const state = await context.getAppState();
        const task = findTaskByAgentId(agentId, state.tasks);
        if (task?.abortController) {
            task.abortController.abort();
        }
    } else {
        // External process: exit gracefully
        setImmediate(async () => {
            await exitProcess(0, "other");
        });
    }
    return { data: { success: true, ... } };
}

// Mapping: tSY→handleShutdownApproval, A→input, q→context, K→teamName, Y→agentId, z→agentName, w→requestId, $→backendType, nK→exitProcess

## Related Symbols

- `SendMessageTool` (`iB`) - The main tool implementation.
- `deliverMessage` (`f9`) - Low-level delivery logic.
- `getTeamName` (`i3`) - Context helper.
- `handleShutdownApproval` (`tSY`) - Shutdown logic.

## Location References

- `chunks.141.mjs:843` - `SendMessageTool` prompt and documentation.
- `chunks.141.mjs:1429` - Tool call dispatcher.
- `chunks.141.mjs:1059` - `oSY` (handle type: "message").
- `chunks.141.mjs:1089` - `aSY` (handle type: "broadcast").
- `chunks.141.mjs:1159` - `tSY` (handle type: "shutdown_response").
