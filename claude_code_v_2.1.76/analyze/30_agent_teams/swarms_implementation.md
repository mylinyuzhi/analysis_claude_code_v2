# Agent Teams (Swarms) Implementation Analysis

## Module Overview

Claude Code v2.1.38 introduces "Agent Teams" (also referred to as Swarms), allowing a "Team Lead" agent to coordinate with multiple "Teammate" agents. This system leverages terminal multiplexing (tmux or iTerm2) to provide a parallel execution environment with a synchronized UI.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `TmuxBackend` (fEA) - Manages teammate panes in tmux
- `ITermBackend` (EEA) - Manages teammate panes in iTerm2
- `getBackend` (zt) - Detects and initializes the appropriate terminal backend
- `SendMessageTool` (YhY) - The primary communication channel between agents

## Core Architecture

The Swarm architecture consists of:
1. **Team Lead**: The primary agent process initiated by the user.
2. **Teammates**: Auxiliary agent processes spawned in separate terminal panes or as background tasks.
3. **Backend Registry**: Handles detection of terminal capabilities to choose between `tmux`, `iterm2`, or `in-process` execution.
4. **Message Bus**: An event-driven system for inter-agent communication via the `SendMessage` tool.

### Terminal Backend Selection (Algorithm)

**What it does:** Determines which terminal multiplexer to use for teammate isolation.

**How it works:**
1. Checks if currently running inside a `tmux` session (`OI()`).
2. If yes, selects `TmuxBackend` as "Native".
3. If no, checks if running in `iTerm2` (`j51()`).
4. If in `iTerm2`, checks for `it2` CLI availability.
5. If `it2` is available, selects `ITermBackend`.
6. Fallback: If in `iTerm2` but no `it2` CLI, it checks if `tmux` is installed globally. If so, it uses `TmuxBackend` in "External" mode.

**Why this approach:**
- `tmux` is the most portable and robust option for splitting panes.
- `iTerm2` provides a better native experience on macOS if available.
- "In-process" serves as a final fallback for non-interactive or restricted environments.

### Swarm View Layout (Tmux)

When using `TmuxBackend`, the system orchestrates a "Swarm View" using specific tmux commands:

```javascript
// ============================================
// createTeammatePaneWithLeader - Logic for splitting panes in leader window
// Location: chunks.131.mjs:1265-1289
// ============================================

// ORIGINAL (for source lookup):
async createTeammatePaneWithLeader(A, q) {
    let K = await this.getCurrentPaneId(), Y = await this.getCurrentWindowTarget();
    let z = await this.getCurrentWindowPaneCount(Y);
    let w = z === 1, H;
    if (w) H = await IA(iW, ["split-window", "-t", K, "-h", "-l", "70%", "-P", "-F", "#{pane_id}"]);
    else { ... }
    ...
    await this.rebalancePanesWithLeader(Y);
}

// READABLE (for understanding):
async function createTeammatePaneWithLeader(agentName, color) {
    const leaderPaneId = await this.getCurrentPaneId();
    const windowTarget = await this.getCurrentWindowTarget();
    const paneCount = await this.getCurrentWindowPaneCount(windowTarget);
    
    let teammatePaneId;
    if (paneCount === 1) {
        // First teammate: Split leader pane 30/70 (Leader gets 30%)
        const result = await runTmux(["split-window", "-t", leaderPaneId, "-h", "-l", "70%", "-P", "-F", "#{pane_id}"]);
        teammatePaneId = result.stdout.trim();
    } else {
        // Subsequent teammates: Split existing teammate panes to tile them
        const panes = await getWindowPanes(windowTarget);
        const teammatePanes = panes.slice(1); // Exclude leader
        const targetPane = teammatePanes[Math.floor((teammatePanes.length - 1) / 2)];
        const direction = teammatePanes.length % 2 === 1 ? "-v" : "-h";
        const result = await runTmux(["split-window", "-t", targetPane, direction, "-P", "-F", "#{pane_id}"]);
        teammatePaneId = result.stdout.trim();
    }
    
    await this.setPaneTitle(teammatePaneId, agentName, color);
    await this.rebalancePanesWithLeader(windowTarget);
    return { paneId: teammatePaneId, isFirstTeammate: paneCount === 1 };
}

// Mapping: A→agentName, q→color, K→leaderPaneId, Y→windowTarget, z→paneCount, w→isFirstTeammate, H→result
```

**Key insight:** The leader pane is always kept at 30% width (`-x 30%`) on the left, while teammates occupy the remaining 70% in a tiled layout.

## Inter-Agent Communication

Communication is strictly tool-based using the `SendMessage` tool. Agents do not "hear" each other's text output; they must explicitly use this tool to pass state or requests.

### Message Delivery Flow

1. **Sender** calls `SendMessage(recipient, content, type)`.
2. **System** identifies the recipient's `agentId` and `backendType`.
3. **Dispatch**:
   - If `recipient` is `team-lead`, the message is added to the leader's event queue.
   - If `recipient` is a `teammate`, the system uses `f9` (message bus) to deliver.
4. **Shutdown Handling**: Special logic for `shutdown_request` and `shutdown_response`.

```javascript
// ============================================
// handleShutdownApproval - Graceful agent exit logic
// Location: chunks.141.mjs:1160-1214
// ============================================

// ORIGINAL (for source lookup):
async function tSY(A, q) {
    ...
    if (backendType === "in-process") {
        if (agentId) {
            let _ = await q.getAppState(), J = ps(agentId, _.tasks);
            if (J?.abortController) J.abortController.abort();
        }
    } else {
        setImmediate(async () => { await nK(0, "other") });
    }
    return { data: { success: !0, ... } };
}

// READABLE (for understanding):
async function handleShutdownApproval(input, context) {
    const { teamName, agentId, backendType, requestId } = input;
    
    // Notify team lead of the approval via the message bus (f9)
    await deliverMessage(TEAM_LEAD_ID, {
        from: currentAgentName,
        type: "shutdown_response",
        approved: true,
        requestId
    }, teamName);

    if (backendType === "in-process") {
        // In-process teammates are killed via AbortController
        const appState = await context.getAppState();
        const task = findTaskByAgentId(agentId, appState.tasks);
        if (task?.abortController) {
            task.abortController.abort();
        }
    } else {
        // Process-based teammates exit themselves gracefully
        setImmediate(async () => {
            await exitProcess(0, "graceful_shutdown");
        });
    }

    return { data: { success: true, message: "Shutdown approved..." } };
}

// Mapping: tSY→handleShutdownApproval, A→input, q→context, backendType→$, agentId→Y, nK→exitProcess
```

## Team Persistence

Teams are tightly coupled with the **Task System**. A team is essentially a view over a task list. Task states (including `owner`) are persisted at `~/.claude/tasks/`, allowing teams to resume work even if the session is interrupted.

**Critical Rule**: Teammates must always check `TaskList` after completing a task to find new available work, as the leader may have added tasks asynchronously.
