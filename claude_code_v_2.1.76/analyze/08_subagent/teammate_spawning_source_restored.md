# Teammate Spawning - Source Restoration (Claude Code 2.1.76)

> Source-level analysis of the teammate spawning system including backend routing,
> in-process execution, and split-pane/tmux integration.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `spawnTeammate` (qn4) - Spawn teammate agent — `chunks.135.mjs:1116`
- `spawnTeammateDispatcher` (pNY) - Route teammate spawn to backend — `chunks.135.mjs:1110`
- `spawnInProcessTeammate` (FNY) - Spawn in-process teammate — `chunks.135.mjs:985`
- `spawnSplitPaneTeammate` (BNY) - Spawn split-pane teammate — `chunks.135.mjs:711`
- `spawnTmuxTeammate` (gNY) - Spawn tmux teammate — `chunks.135.mjs:838`
- `inProcessAgentRunner` (XNY) - Run in-process agent loop — `chunks.134.mjs:1571`
- `isInProcessEnabled` (Rb) - Check if in-process mode enabled — `chunks.135.mjs:208`

---

## Overview

The teammate spawning system enables multi-agent collaboration by creating specialized agents that can work in parallel with the lead agent. Three execution backends are available:

1. **In-process** - Runs within the same process (non-interactive sessions)
2. **Split-pane** - Uses iTerm2 splits or tmux panes
3. **Tmux-only** - Creates new tmux windows

---

## Backend Selection Algorithm

### isInProcessEnabled (Rb)

**What it does:** Determines whether to use in-process execution for teammates.

**How it works:**
1. Non-interactive sessions always use in-process
2. Check user's backend preference setting
3. Default based on whether running inside tmux

```javascript
// ============================================
// Rb - isInProcessEnabled - Check if in-process mode enabled
// Location: chunks.135.mjs:208-215
// ============================================

// ORIGINAL (for source lookup):
function Rb() {
    if (q7()) return k("[BackendRegistry] isInProcessEnabled: true (non-interactive session)"), !0;
    let A = LNY(),
        q;
    if (A === "in-process") q = !0;
    else if (A === "tmux") q = !1;
    else q = !uN1();
    return k(`[BackendRegistry] isInProcessEnabled: ${q} (mode=${A}, insideTmux=${uN1()})`), q
}

// READABLE (for understanding):
function isInProcessEnabled() {
    // Non-interactive sessions always use in-process
    if (isNonInteractiveSession()) {
        logDebug("[BackendRegistry] isInProcessEnabled: true (non-interactive session)");
        return true;
    }

    let backendMode = getBackendPreference();
    let enabled;

    if (backendMode === "in-process") {
        enabled = true;
    } else if (backendMode === "tmux") {
        enabled = false;
    } else {
        // Auto: use in-process if NOT inside tmux
        enabled = !isRunningInsideTmux();
    }

    logDebug(`[BackendRegistry] isInProcessEnabled: ${enabled} (mode=${backendMode}, insideTmux=${isRunningInsideTmux()})`);
    return enabled;
}

// Mapping: Rb→isInProcessEnabled, q7→isNonInteractiveSession, LNY→getBackendPreference,
// uN1→isRunningInsideTmux
```

### Backend Decision Matrix

| Session Type | User Preference | Running In Tmux | Backend |
|--------------|-----------------|-----------------|---------|
| Non-interactive | Any | Any | In-process |
| Interactive | "in-process" | Any | In-process |
| Interactive | "tmux" | Any | Tmux/Split-pane |
| Interactive | "auto" | Yes | Tmux/Split-pane |
| Interactive | "auto" | No | In-process |

---

## spawnTeammateDispatcher (pNY)

**What it does:** Routes teammate spawn to the appropriate backend handler.

```javascript
// ============================================
// pNY - spawnTeammateDispatcher - Route teammate spawn to backend
// Location: chunks.135.mjs:1110-1114
// ============================================

// ORIGINAL (for source lookup):
async function pNY(A, q) {
    if (Rb()) return FNY(A, q);
    if (A.use_splitpane !== !1) return BNY(A, q);
    return gNY(A, q)
}

// READABLE (for understanding):
async function spawnTeammateDispatcher(spawnConfig, toolUseContext) {
    // Route to in-process if enabled
    if (isInProcessEnabled()) {
        return spawnInProcessTeammate(spawnConfig, toolUseContext);
    }

    // Use split-pane if not explicitly disabled
    if (spawnConfig.use_splitpane !== false) {
        return spawnSplitPaneTeammate(spawnConfig, toolUseContext);
    }

    // Fallback to tmux-only
    return spawnTmuxTeammate(spawnConfig, toolUseContext);
}

// Mapping: pNY→spawnTeammateDispatcher, Rb→isInProcessEnabled,
// FNY→spawnInProcessTeammate, BNY→spawnSplitPaneTeammate, gNY→spawnTmuxTeammate
```

---

## spawnTeammate (qn4)

**What it does:** Main entry point for spawning teammate agents. Delegates to dispatcher.

```javascript
// ============================================
// qn4 - spawnTeammate - Spawn teammate agent
// Location: chunks.135.mjs:1116-1117
// ============================================

// ORIGINAL (for source lookup):
async function qn4(A, q) {
    return pNY(A, q)
}

// READABLE (for understanding):
async function spawnTeammate(spawnConfig, toolUseContext) {
    return spawnTeammateDispatcher(spawnConfig, toolUseContext);
}

// Mapping: qn4→spawnTeammate, pNY→spawnTeammateDispatcher
```

---

## spawnInProcessTeammate (FNY)

**What it does:** Spawns a teammate that runs within the same process, sharing memory and state.

### Source Code

```javascript
// ============================================
// FNY - spawnInProcessTeammate - Spawn in-process teammate
// Location: chunks.135.mjs:985-1080
// ============================================

// ORIGINAL (for source lookup):
async function FNY(A, q) {
    let {
        setAppState: K,
        getAppState: Y
    } = q, {
        name: z,
        prompt: _,
        agent_type: w,
        plan_mode_required: O
    } = A, $ = yu8(A.model, Y().mainLoopModel);
    if (!z || !_) throw Error("name and prompt are required for spawn operation");
    let H = Y(),
        j = A.team_name || H.teamContext?.teamName;
    if (!j) throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
    let J = await hu8(z, j),
        M = Lu8(J),
        D = ak(M, j),
        X = Pl(D),
        P;
    if (w) {
        let v = q.options.agentDefinitions.activeAgents.find((N) => N.agentType === w);
        if (v && YQ6(v)) P = v;
        k(`[handleSpawnInProcess] agent_type=${w}, found=${!!P}`)
    }
    let Z = await mZ6({
        name: M,
        teamName: j,
        prompt: _,
        color: X,
        planModeRequired: O ?? !1,
        model: $
    }, q);
    if (!Z.success) throw Error(Z.error ?? "Failed to spawn in-process teammate");
    if (k(`[handleSpawnInProcess] spawn result: taskId=${Z.taskId}, hasContext=${!!Z.teammateContext}, hasAbort=${!!Z.abortController}`), Z.taskId && Z.teammateContext && Z.abortController) xN1({
        identity: {
            agentId: D,
            agentName: M,
            teamName: j,
            color: X,
            planModeRequired: O ?? !1,
            parentSessionId: Z.teammateContext.parentSessionId
        },
        taskId: Z.taskId,
        prompt: _,
        description: A.description,
        model: $,
        agentDefinition: P,
        teammateContext: Z.teammateContext,
        toolUseContext: {
            ...q,
            messages: []
        },
        abortController: Z.abortController
    }), k(`[handleSpawnInProcess] Started agent execution for ${D}`);
    K((f) => {
        // Update team context with new teammate
        // ...
    });
    // ... rest of implementation
}

// READABLE (for understanding):
async function spawnInProcessTeammate(spawnConfig, toolUseContext) {
    let { setAppState, getAppState } = toolUseContext;
    let { name, prompt, agent_type, plan_mode_required } = spawnConfig;

    // Resolve model (use main loop model as fallback)
    let model = resolveModel(spawnConfig.model, getAppState().mainLoopModel);

    // Validate required fields
    if (!name || !prompt) {
        throw Error("name and prompt are required for spawn operation");
    }

    let appState = getAppState();
    let teamName = spawnConfig.team_name || appState.teamContext?.teamName;

    if (!teamName) {
        throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
    }

    // Ensure unique name within team
    let uniqueName = await ensureUniqueTeammateName(name, teamName);
    let sanitizedName = sanitizeAgentName(uniqueName);
    let agentId = buildAgentId(sanitizedName, teamName);
    let agentColor = getAgentColor(agentId);

    // Find agent definition if specified
    let agentDefinition;
    if (agent_type) {
        let found = toolUseContext.options.agentDefinitions.activeAgents.find(
            a => a.agentType === agent_type
        );
        if (found && isValidInProcessAgent(found)) {
            agentDefinition = found;
        }
        logDebug(`[handleSpawnInProcess] agent_type=${agent_type}, found=${!!agentDefinition}`);
    }

    // Create task and context
    let spawnResult = await createInProcessTask({
        name: sanitizedName,
        teamName: teamName,
        prompt: prompt,
        color: agentColor,
        planModeRequired: plan_mode_required ?? false,
        model: model
    }, toolUseContext);

    if (!spawnResult.success) {
        throw Error(spawnResult.error ?? "Failed to spawn in-process teammate");
    }

    logDebug(`[handleSpawnInProcess] spawn result: taskId=${spawnResult.taskId}, hasContext=${!!spawnResult.teammateContext}, hasAbort=${!!spawnResult.abortController}`);

    // Start agent execution
    if (spawnResult.taskId && spawnResult.teammateContext && spawnResult.abortController) {
        registerTeammateAndRun({
            identity: {
                agentId: agentId,
                agentName: sanitizedName,
                teamName: teamName,
                color: agentColor,
                planModeRequired: plan_mode_required ?? false,
                parentSessionId: spawnResult.teammateContext.parentSessionId
            },
            taskId: spawnResult.taskId,
            prompt: prompt,
            description: spawnConfig.description,
            model: model,
            agentDefinition: agentDefinition,
            teammateContext: spawnResult.teammateContext,
            toolUseContext: {
                ...toolUseContext,
                messages: []
            },
            abortController: spawnResult.abortController
        });

        logDebug(`[handleSpawnInProcess] Started agent execution for ${agentId}`);
    }

    // Update app state with new teammate
    setAppState((state) => {
        let isFirstTeammate = !state.teamContext?.leadAgentId;
        let leadAgentId = isFirstTeammate
            ? buildAgentId(TEAM_LEAD_ID, teamName)
            : state.teamContext.leadAgentId;

        // Create lead agent entry if this is first teammate
        let leadAgentEntry = isFirstTeammate ? {
            [leadAgentId]: {
                name: TEAM_LEAD_ID,
                agentType: TEAM_LEAD_ID,
                color: getAgentColor(leadAgentId),
                tmuxSessionName: "in-process",
                tmuxPaneId: "leader",
                cwd: getCurrentWorkingDirectory(),
                spawnedAt: Date.now()
            }
        } : {};

        return {
            ...state,
            teamContext: {
                ...state.teamContext,
                teamName: teamName ?? state.teamContext?.teamName ?? "default",
                teamFilePath: state.teamContext?.teamFilePath ?? "",
                leadAgentId: leadAgentId,
                teammates: {
                    ...(state.teamContext?.teammates || {}),
                    ...leadAgentEntry,
                    [agentId]: {
                        name: sanitizedName,
                        agentType: agent_type,
                        color: agentColor,
                        tmuxSessionName: "in-process",
                        tmuxPaneId: agentId,
                        cwd: getCurrentWorkingDirectory(),
                        spawnedAt: Date.now()
                    }
                }
            }
        };
    });

    // ... continue with team registration
}

// Mapping: FNY→spawnInProcessTeammate, yu8→resolveModel, hu8→ensureUniqueTeammateName,
// Lu8→sanitizeAgentName, ak→buildAgentId, Pl→getAgentColor, mZ6→createInProcessTask,
// xN1→registerTeammateAndRun
```

---

## inProcessAgentRunner (XNY)

**What it does:** Runs the agent loop for an in-process teammate, handling message polling and execution.

### Source Code

```javascript
// ============================================
// XNY - inProcessAgentRunner - Run in-process agent loop
// Location: chunks.134.mjs:1571-1700
// ============================================

// ORIGINAL (for source lookup):
async function XNY(A) {
    let {
        identity: q,
        taskId: K,
        prompt: Y,
        description: z,
        agentDefinition: _,
        teammateContext: w,
        toolUseContext: O,
        abortController: $,
        model: H,
        systemPrompt: j,
        systemPromptMode: J,
        allowedTools: M,
        allowPermissionPrompts: D
    } = A, {
        setAppState: X
    } = O;
    k(`[inProcessRunner] Starting agent loop for ${q.agentId}`);
    let P = {
            agentId: q.agentId,
            parentSessionId: q.parentSessionId,
            agentName: q.agentName,
            teamName: q.teamName,
            agentColor: q.color,
            planModeRequired: q.planModeRequired,
            isTeamLead: !1,
            agentType: "teammate"
        },
        W;
    if (J === "replace" && j) W = j;
    // ... continue with agent setup

    // Main agent loop
    try {
        for await (let message of Yh({
            messages: messages,
            systemPrompt: systemPrompt,
            // ... other options
        })) {
            // Handle messages
            if (message.type === "attachment") {
                // Handle attachments
            }
            yield message;
        }
    } finally {
        // Cleanup
    }
}

// READABLE (for understanding):
async function inProcessAgentRunner(config) {
    let {
        identity,
        taskId,
        prompt,
        description,
        agentDefinition,
        teammateContext,
        toolUseContext,
        abortController,
        model,
        systemPrompt,
        systemPromptMode,
        allowedTools,
        allowPermissionPrompts
    } = config;

    let { setAppState } = toolUseContext;

    logDebug(`[inProcessRunner] Starting agent loop for ${identity.agentId}`);

    // Build teammate identity context
    let teammateIdentity = {
        agentId: identity.agentId,
        parentSessionId: identity.parentSessionId,
        agentName: identity.agentName,
        teamName: identity.teamName,
        agentColor: identity.color,
        planModeRequired: identity.planModeRequired,
        isTeamLead: false,
        agentType: "teammate"
    };

    // Resolve system prompt
    let resolvedSystemPrompt;
    if (systemPromptMode === "replace" && systemPrompt) {
        resolvedSystemPrompt = systemPrompt;
    } else {
        // Build from agent definition
        resolvedSystemPrompt = await buildAgentSystemPrompt(agentDefinition, toolUseContext, model, []);
    }

    // Initialize messages with prompt
    let messages = [{ type: "user", content: prompt }];

    // Register with teammate context storage (AsyncLocalStorage)
    runWithTeammateContext(teammateIdentity, async () => {
        try {
            // Main agent loop
            for await (let message of llmMessageLoop({
                messages: messages,
                systemPrompt: resolvedSystemPrompt,
                toolUseContext: derivedContext,
                // ... other options
            })) {
                // Handle different message types
                if (message.type === "attachment") {
                    // Process attachments
                    yield message;
                } else if (message.type === "assistant" || message.type === "user") {
                    // Record message
                    yield message;
                }

                // Check for abort
                if (abortController.signal.aborted) {
                    logDebug(`[inProcessRunner] Agent ${identity.agentId} aborted`);
                    break;
                }
            }
        } finally {
            // Cleanup
            logDebug(`[inProcessRunner] Agent ${identity.agentId} finished`);
        }
    });
}

// Mapping: XNY→inProcessAgentRunner, q→identity, K→taskId, Y→prompt,
// Yh→llmMessageLoop
```

---

## spawnSplitPaneTeammate (BNY)

**What it does:** Spawns a teammate in a split pane using iTerm2 or tmux.

### Key Steps

1. Check if iTerm2 setup is needed
2. Create split pane
3. Build command line with agent parameters
4. Send command to pane
5. Register teammate in state

```javascript
// ============================================
// BNY - spawnSplitPaneTeammate - Spawn split-pane teammate
// Location: chunks.135.mjs:711-836
// ============================================

// READABLE (for understanding):
async function spawnSplitPaneTeammate(spawnConfig, toolUseContext) {
    let { setAppState, getAppState } = toolUseContext;
    let { name, prompt, agent_type, cwd, plan_mode_required } = spawnConfig;

    // Resolve model
    let model = resolveModel(spawnConfig.model, getAppState().mainLoopModel);

    // Validate
    if (!name || !prompt) {
        throw Error("name and prompt are required for spawn operation");
    }

    let appState = getAppState();
    let teamName = spawnConfig.team_name || appState.teamContext?.teamName;

    if (!teamName) {
        throw Error("team_name is required for spawn operation.");
    }

    // Ensure unique name
    let uniqueName = await ensureUniqueTeammateName(name, teamName);
    let sanitizedName = sanitizeAgentName(uniqueName);
    let agentId = buildAgentId(sanitizedName, teamName);
    let agentColor = getAgentColor(agentId);

    let workingDir = cwd || getCurrentWorkingDirectory();

    // Check if iTerm2 setup is needed
    let itermStatus = await checkITerm2Setup();
    if (itermStatus.needsIt2Setup && toolUseContext.setToolJSX) {
        let tmuxAvailable = await isTmuxInstalled();

        // Show setup dialog
        let result = await new Promise((resolve) => {
            toolUseContext.setToolJSX({
                jsx: React.createElement(ITerm2SetupDialog, {
                    onDone: resolve,
                    tmuxAvailable: tmuxAvailable
                }),
                shouldHidePromptInput: true
            });
        });

        toolUseContext.setToolJSX(null);

        if (result === "cancelled") {
            throw Error("Teammate spawn cancelled - iTerm2 setup required");
        }

        if (result === "installed") {
            let { resetBackendDetection } = await importBackendModule();
            resetBackendDetection();
        }
    }

    // Check if running inside tmux
    let insideTmux = await isRunningInsideTmux();
    let panePath = getPanePath(agentId);

    // Create split pane
    let { paneId, isFirstTeammate } = await createSplitPane(sanitizedName, agentColor);

    // If first teammate and inside tmux, setup swarm session
    if (isFirstTeammate && insideTmux) {
        await setupSwarmSession();
    }

    // Build command line
    let claudePath = getClaudePath();
    let agentArgs = [
        `--agent-id ${shellEscape(agentId)}`,
        `--agent-name ${shellEscape(sanitizedName)}`,
        `--team-name ${shellEscape(teamName)}`,
        `--agent-color ${shellEscape(agentColor)}`,
        `--parent-session-id ${shellEscape(getSessionId())}`,
        plan_mode_required ? "--plan-mode-required" : "",
        agent_type ? `--agent-type ${shellEscape(agent_type)}` : ""
    ].filter(Boolean).join(" ");

    let permissionArgs = buildPermissionArgs({
        planModeRequired: plan_mode_required,
        permissionMode: appState.toolPermissionContext.mode
    });

    // Add model override
    if (model) {
        permissionArgs = permissionArgs
            .split(" ")
            .filter((arg, i, arr) => arg !== "--model" && arr[i - 1] !== "--model")
            .join(" ");
        permissionArgs = permissionArgs
            ? `${permissionArgs} --model ${shellEscape(model)}`
            : `--model ${shellEscape(model)}`;
    }

    let argsSuffix = permissionArgs ? ` ${permissionArgs}` : "";
    let envString = buildEnvironmentString();
    let command = `cd ${shellEscape(workingDir)} && env ${envString} ${shellEscape(claudePath)} ${agentArgs}${argsSuffix}`;

    // Send command to pane
    await sendCommandToPane(paneId, command, !insideTmux);

    // Update state
    let tmuxSessionName = insideTmux ? "current" : SWARM_SESSION_NAME;
    let windowTarget = insideTmux ? "current" : SWARM_VIEW_WINDOW_NAME;

    setAppState((state) => ({
        ...state,
        teamContext: {
            ...state.teamContext,
            teamName: teamName ?? state.teamContext?.teamName ?? "default",
            teamFilePath: state.teamContext?.teamFilePath ?? "",
            leadAgentId: state.teamContext?.leadAgentId ?? "",
            teammates: {
                ...(state.teamContext?.teammates || {}),
                [agentId]: {
                    name: sanitizedName,
                    agentType: agent_type,
                    color: agentColor,
                    tmuxSessionName: tmuxSessionName,
                    tmuxPaneId: paneId,
                    cwd: workingDir,
                    spawnedAt: Date.now()
                }
            }
        }
    }));

    // Create task for tracking
    createTeammateTask(setAppState, {
        teammateId: agentId,
        sanitizedName,
        teamName,
        teammateColor: agentColor,
        prompt,
        plan_mode_required,
        paneId,
        insideTmux,
        toolUseId: toolUseContext.toolUseId
    });

    // Update team config
    let teamConfig = await loadTeamConfig(teamName);
    if (!teamConfig) {
        throw Error(`Team "${teamName}" does not exist. Call spawnTeam first.`);
    }

    teamConfig.members.push({
        agentId: agentId,
        name: sanitizedName,
        agentType: agent_type,
        model: model,
        prompt: prompt,
        color: agentColor,
        planModeRequired: plan_mode_required,
        joinedAt: Date.now(),
        tmuxPaneId: paneId,
        cwd: workingDir
    });

    await saveTeamConfig(teamName, teamConfig);

    return {
        data: {
            status: "teammate_spawned",
            agentId: agentId,
            agentName: sanitizedName,
            teamName: teamName,
            paneId: paneId
        }
    };
}

// Mapping: BNY→spawnSplitPaneTeammate, yu8→resolveModel, hu8→ensureUniqueTeammateName,
// Lu8→sanitizeAgentName, ak→buildAgentId, Pl→getAgentColor, k66→checkITerm2Setup,
// di4→createSplitPane, si4→getClaudePath, li4→sendCommandToPane
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AgentTool.call()                                     │
│                                                                              │
│  if (team_name && name) → Teammate mode                                     │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    spawnTeammate (qn4)                                       │
│                                                                              │
│  Delegates to spawnTeammateDispatcher (pNY)                                 │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    spawnTeammateDispatcher (pNY)                             │
│                                                                              │
│  1. Check isInProcessEnabled()                                              │
│  2. Check use_splitpane preference                                          │
│  3. Route to appropriate handler                                            │
└───────────────┬─────────────────────────────────────────────┬───────────────┘
                │                                             │
                ▼                                             ▼
┌───────────────────────────────┐       ┌───────────────────────────────────────┐
│   In-Process Mode             │       │   Pane Mode                            │
│   (Rb() returns true)         │       │   (Rb() returns false)                 │
│                               │       │                                        │
│   spawnInProcessTeammate      │       │   ┌─────────────────────────────────┐  │
│   (FNY)                       │       │   │ use_splitpane !== false?        │  │
│                               │       │   │                                 │  │
│   • Create task in memory     │       │   │  Yes → spawnSplitPaneTeammate   │  │
│   • Start agent loop          │       │   │        (BNY)                    │  │
│   • AsyncLocalStorage context │       │   │                                 │  │
│   • pollForNextMessage loop   │       │   │  No → spawnTmuxTeammate         │  │
│                               │       │   │        (gNY)                    │  │
└───────────────────────────────┘       │   └─────────────────────────────────┘  │
                                        │                                        │
                                        │   • iTerm2 split or tmux pane          │
                                        │   • External process                   │
                                        │   • File-based mailbox                 │
                                        └────────────────────────────────────────┘
```

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `qn4` | spawnTeammate | chunks.135.mjs:1116 | ✓ Verified |
| `pNY` | spawnTeammateDispatcher | chunks.135.mjs:1110 | ✓ Verified |
| `FNY` | spawnInProcessTeammate | chunks.135.mjs:985 | ✓ Verified |
| `BNY` | spawnSplitPaneTeammate | chunks.135.mjs:711 | ✓ Verified |
| `gNY` | spawnTmuxTeammate | chunks.135.mjs:838 | ✓ Verified |
| `XNY` | inProcessAgentRunner | chunks.134.mjs:1571 | ✓ Verified |
| `Rb` | isInProcessEnabled | chunks.135.mjs:208 | ✓ Verified |

---

## Related Documents

- [agent_tool_complete.md](./agent_tool_complete.md) - AgentTool analysis
- [mailbox_communication_source_restored.md](./mailbox_communication_source_restored.md) - Mailbox system
- [../30_agent_teams/](../30_agent_teams/) - Agent teams module
- [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Symbol index