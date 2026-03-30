# Agent Teams - Complete Source-Level Analysis

> Claude Code v2.1.76 reverse engineering analysis
> All symbol mappings maintained in `symbol_index_core_features.md`

---

## Table of Contents

1. [Feature Gate and Initialization](#a-feature-gate--initialization)
2. [Spawn Routing System](#b-spawn-routing-system)
3. [Team Config](#c-team-config)
4. [Mailbox System](#d-mailbox-system)
5. [Message Types](#e-message-types)
6. [SendMessage Tool](#f-sendmessage-tool)
7. [In-Process Runner Polling](#g-in-process-runner-polling)
8. [Permission Sync](#h-permission-sync)
9. [Agent Loop Startup](#i-agent-loop-startup)
10. [System Prompts](#j-system-prompts)
11. [Team Context System Reminder](#k-team-context-system-reminder)
12. [Backend Implementations](#l-backend-implementations)
13. [UI Components](#m-ui-components)

---

## A. Feature Gate & Initialization

### isAgentTeamsEnabled - Dual gate requiring env var AND server-side feature flag

**What it does:** Determines whether the Agent Teams feature is active for the current session. This is the single boolean gate that every teams-related component checks.

**How it works:**
1. First checks if `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable is truthy OR if `--agent-teams` CLI flag is present
2. If neither is set, returns `false` immediately (short-circuit)
3. Then checks the server-side feature flag `tengu_amber_flint` via `w8()` with default `true`
4. Only returns `true` if BOTH conditions pass

**Why this approach:**
- **Dual gate pattern**: The env var gives users local control while the feature flag gives Anthropic server-side kill-switch capability. This is a standard progressive rollout pattern.
- The `tengu_amber_flint` name is an opaque identifier to prevent users from guessing and enabling unreleased features.
- Default `true` on the feature flag means the server must explicitly disable it; if the flag lookup fails, teams is allowed (assuming the env var is set).

**Key insight:** The `pG3()` helper checks `process.argv.includes("--agent-teams")`, providing a CLI escape hatch that bypasses the env var requirement. This is used by spawned teammate processes that receive the flag from the parent.

```javascript
// ============================================
// isAgentTeamsEnabled - Dual gate: env var + feature flag
// Location: chunks.50.mjs:2543-2547
// ============================================

// ORIGINAL (for source lookup):
function E7() {
    if (!t6(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !pG3()) return !1;
    if (!w8("tengu_amber_flint", !0)) return !1;
    return !0
}

// READABLE (for understanding):
function isAgentTeamsEnabled() {
    if (!isTruthy(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !hasAgentTeamsCliFlag()) return false;
    if (!checkFeatureFlag("tengu_amber_flint", true)) return false;
    return true;
}

// Mapping: E7->isAgentTeamsEnabled, t6->isTruthy, pG3->hasAgentTeamsCliFlag, w8->checkFeatureFlag
```

### CLI Arguments

Teammate processes are spawned with hidden CLI flags defined in chunks.198.mjs:1139:

| Flag | Obfuscated Option | Purpose |
|------|-------------------|---------|
| `--agent-id <id>` | Hidden via `hideHelp()` | Unique agent identifier (UUID) |
| `--agent-name <name>` | Hidden | Human-readable display name |
| `--team-name <name>` | Hidden | Team coordination namespace |
| `--agent-color <color>` | Hidden | Hex color for UI rendering |
| `--plan-mode-required` | Hidden | Forces plan-before-execute mode |
| `--teammate-mode <mode>` | Hidden, choices: auto/tmux/in-process | Spawn backend selection |
| `--parent-session-id <id>` | Hidden | Analytics correlation with parent |
| `--agent-type <type>` | Hidden | Custom agent type identifier |

### Identity Accessors

The global identity state is accessed through a set of getter functions:

- `isTeammate` (`$Y`) - Returns true if current process is a spawned teammate
- `isTeamLead` (`KZ`) - Returns true if current process is the team lead
- `isPlanModeRequired` (`NF6`) - Whether plan mode is enforced for this agent
- `getTeamName` (`l5`) - Current team namespace
- `getAgentName` (`i3`) - Current agent's display name
- `getAgentId` (`nM`) - Current agent's UUID
- `getTeammateColor` (`H$`) - Current agent's UI color

**Key insight:** These are simple getters backed by parsed CLI args. The identity is immutable after process start -- a teammate cannot change its name or team mid-session. The `isTeamLead` check (`KZ`) is the inverse: it returns true when the agent has a team name but is NOT a teammate (i.e., it is the originating process).

---

## B. Spawn Routing System

### Architecture Overview

The spawn system uses a dispatcher pattern to route teammate creation through three different backends based on runtime capabilities.

```
qn4(spawnTeammate) ──> pNY(spawnTeammateDispatcher)
                           │
                           ├─ Rb() === true ──────> FNY (in-process)
                           │
                           ├─ use_splitpane !== false ──> BNY (split-pane)
                           │
                           └─ else ───────────────> gNY (separate window)
```

### spawnTeammate / spawnTeammateDispatcher - Entry point

**What it does:** `qn4` is a thin wrapper that delegates to `pNY`, which selects the spawn backend.

**How it works:**
1. `qn4(A, q)` simply calls `pNY(A, q)` -- it exists as an indirection layer
2. `pNY` checks `Rb()` (isInProcessEnabled) first -- if true, always uses in-process
3. Otherwise checks the `use_splitpane` input parameter -- default is split-pane
4. Falls back to separate tmux window

**Why this approach:**
- The indirection through `qn4` allows the tool layer to hold a stable reference while the routing logic in `pNY` can be refactored independently.
- In-process takes priority because it is the most efficient mode (no subprocess overhead, shared memory).

```javascript
// ============================================
// spawnTeammateDispatcher - Route to appropriate spawn backend
// Location: chunks.135.mjs:1110-1118
// ============================================

// ORIGINAL (for source lookup):
async function pNY(A, q) {
    if (Rb()) return FNY(A, q);
    if (A.use_splitpane !== !1) return BNY(A, q);
    return gNY(A, q)
}
async function qn4(A, q) {
    return pNY(A, q)
}

// READABLE (for understanding):
async function spawnTeammateDispatcher(input, toolUseContext) {
    if (isInProcessEnabled()) return spawnInProcessTeammate(input, toolUseContext);
    if (input.use_splitpane !== false) return spawnSplitPaneTeammate(input, toolUseContext);
    return spawnTmuxTeammate(input, toolUseContext);
}
async function spawnTeammate(input, toolUseContext) {
    return spawnTeammateDispatcher(input, toolUseContext);
}

// Mapping: pNY->spawnTeammateDispatcher, qn4->spawnTeammate, Rb->isInProcessEnabled,
//          FNY->spawnInProcessTeammate, BNY->spawnSplitPaneTeammate, gNY->spawnTmuxTeammate
```

---

### spawnSplitPaneTeammate (BNY) - Tmux split-pane spawn

**What it does:** Creates a new teammate as a Claude CLI subprocess in a tmux split pane within the swarm view.

**How it works (10 steps):**
1. **Validate inputs**: Requires `name` and `prompt`, resolves `team_name` from input or current AppState
2. **Deduplicate name**: `hu8(name, teamName)` checks existing team members, appends `-2`, `-3`, etc. if name collides
3. **Generate identity**: `ak(sanitizedName, teamName)` produces a deterministic agentId, `Pl(agentId)` generates a color
4. **Check iTerm2 setup**: `k66()` determines if iTerm2 integration needs initial setup (shows UI prompt if so)
5. **Detect tmux context**: `Ui4()` returns true if already inside a tmux session
6. **Create pane**: `di4(sanitizedName, color)` creates a split pane in the swarm view, returns `{paneId, isFirstTeammate}`
7. **Build CLI args**: Assembles `--agent-id`, `--agent-name`, `--team-name`, `--agent-color`, `--parent-session-id`, optional `--plan-mode-required` and `--agent-type`
8. **Build permission args**: `ti4({planModeRequired, permissionMode})` adds `--plan-mode-required` and permission-related flags
9. **Send command**: `li4(paneId, command, isInsideTmux)` sends the assembled CLI command to the tmux pane
10. **Register teammate**: Updates AppState.teamContext with new teammate info, registers tracking via `An4()`, writes to team config file, sends initial prompt to teammate's mailbox

**Why this approach:**
- Split panes give visual feedback -- users can see each agent's terminal output in real time.
- The tmux-based approach means each agent is a fully independent Claude CLI process with its own conversation context, memory, and tool access.
- The deduplication step prevents naming conflicts when spawning multiple agents with the same role.

**Key insight:** After the teammate CLI is launched in the pane, the initial prompt is delivered via the mailbox system (`x3` / writeToMailbox) with `from: BY` ("team-lead"). The pane-based agent picks this up during its own startup polling loop.

```javascript
// ============================================
// spawnSplitPaneTeammate - Create teammate in tmux split pane
// Location: chunks.135.mjs:711-836
// ============================================

// ORIGINAL (for source lookup):
async function BNY(A, q) {
    let { setAppState: K, getAppState: Y } = q,
        { name: z, prompt: _, agent_type: w, cwd: O, plan_mode_required: $ } = A,
        H = yu8(A.model, Y().mainLoopModel);
    if (!z || !_) throw Error("name and prompt are required for spawn operation");
    let j = Y(), J = A.team_name || j.teamContext?.teamName;
    if (!J) throw Error("team_name is required for spawn operation...");
    let M = await hu8(z, J),
        D = Lu8(M),
        X = ak(D, J),
        P = O || G1(),
        W = await k66();
    // ... iTerm2 setup check ...
    let Z = await Ui4(),
        G = Pl(X),
        { paneId: f, isFirstTeammate: v } = await di4(D, G);
    if (v && Z) await ci4();
    let N = si4(),
        V = [`--agent-id ${j4([X])}`, `--agent-name ${j4([D])}`, ...].filter(Boolean).join(" "),
        L = ti4({ planModeRequired: $, permissionMode: j.toolPermissionContext.mode });
    // ... model override handling ...
    let u = `cd ${j4([P])} && env ${R} ${j4([N])} ${V}${h}`;
    await li4(f, u, !Z);
    K((b) => ({ ...b, teamContext: { ...b.teamContext, teammates: { ...b.teamContext?.teammates, [X]: { name: D, ... } } } }));
    An4(K, { teammateId: X, sanitizedName: D, teamName: J, ... });
    let B = await Kz6(J);
    B.members.push({ agentId: X, name: D, backendType: W.backend.type, ... });
    await Ru8(J, B);
    await x3(D, { from: BY, text: _, timestamp: new Date().toISOString() }, J);
    return { data: { teammate_id: X, name: D, is_splitpane: true, ... } };
}

// READABLE (for understanding):
async function spawnSplitPaneTeammate(input, toolUseContext) {
    let { setAppState, getAppState } = toolUseContext;
    let { name, prompt, agent_type, cwd, plan_mode_required } = input;
    let model = resolveModel(input.model, getAppState().mainLoopModel);
    if (!name || !prompt) throw Error("name and prompt are required");

    let appState = getAppState();
    let teamName = input.team_name || appState.teamContext?.teamName;
    if (!teamName) throw Error("team_name is required");

    // Step 2: Deduplicate name
    let deduplicatedName = await deduplicateName(name, teamName);
    let sanitizedName = sanitizeName(deduplicatedName);

    // Step 3: Generate identity
    let agentId = generateAgentId(sanitizedName, teamName);
    let agentColor = generateColor(agentId);

    // Step 4-5: Check environment
    let insideTmux = await isInsideTmux();
    let backendInfo = await checkITerm2Setup();

    // Step 6: Create pane
    let { paneId, isFirstTeammate } = await createTeammatePaneInSwarmView(sanitizedName, agentColor);
    if (isFirstTeammate && insideTmux) await initSwarmLayout();

    // Step 7-8: Build CLI command
    let cliPath = getCliBinaryPath();
    let agentFlags = buildAgentFlags(agentId, sanitizedName, teamName, agentColor);
    let permFlags = buildPermissionFlags({ planModeRequired: plan_mode_required, permissionMode });
    let command = `cd ${quote(cwd)} && env ${envVars} ${quote(cliPath)} ${agentFlags} ${permFlags}`;

    // Step 9: Launch
    await sendCommandToPane(paneId, command, !insideTmux);

    // Step 10: Register
    setAppState((s) => ({ ...s, teamContext: { ...s.teamContext, teammates: { [agentId]: { name: sanitizedName, ... } } } }));
    registerTeammateTracking(setAppState, { teammateId: agentId, ... });
    let config = await readTeamConfig(teamName);
    config.members.push({ agentId, name: sanitizedName, backendType: backendInfo.backend.type, ... });
    await writeTeamConfig(teamName, config);
    await writeToMailbox(sanitizedName, { from: TEAM_LEAD_ID, text: prompt }, teamName);

    return { data: { teammate_id: agentId, is_splitpane: true, ... } };
}

// Mapping: BNY->spawnSplitPaneTeammate, hu8->deduplicateName, Lu8->sanitizeName,
//          ak->generateAgentId, Pl->generateColor, k66->checkITerm2Setup,
//          Ui4->isInsideTmux, di4->createTeammatePaneInSwarmView, li4->sendCommandToPane,
//          An4->registerTeammateTracking, Kz6->readTeamConfig, Ru8->writeTeamConfig,
//          x3->writeToMailbox, BY->TEAM_LEAD_ID, ti4->buildPermissionFlags
```

---

### spawnTmuxTeammate (gNY) - Separate window spawn

**What it does:** Creates a teammate in a separate tmux window rather than a split pane. The flow is nearly identical to `BNY` except for window creation.

**How it works:**
1. Same validation, name deduplication, and identity generation as `BNY`
2. Instead of `di4()` (split pane), calls `z8(yZ, ["new-window", "-t", $N, "-n", windowName, "-P", "-F", "#{pane_id}"])` to create a new tmux window
3. Window name is `teammate-{sanitizedName}`
4. Same registration, config update, and mailbox delivery

**Why this approach:**
- Separate windows are used when the split-pane layout would be too cramped, or when the user explicitly sets `use_splitpane: false`.
- Each window gets full terminal width, useful for agents that need wide output (e.g., diff viewers).

**Key insight:** The `backendType` is hardcoded to `"tmux"` in this path (line 920), while the split-pane path uses `W.backend.type` which could be `"tmux"` or `"iterm2"` depending on detection.

```javascript
// ============================================
// spawnTmuxTeammate - Create teammate in separate tmux window
// Location: chunks.135.mjs:838-940
// ============================================

// ORIGINAL (for source lookup):
async function gNY(A, q) {
    let { setAppState: K, getAppState: Y } = q,
        { name: z, prompt: _, agent_type: w, cwd: O, plan_mode_required: $ } = A,
        H = yu8(A.model, Y().mainLoopModel);
    // ... same validation as BNY ...
    let M = await hu8(z, J), D = Lu8(M), X = ak(D, J),
        P = `teammate-${ai4(D)}`, W = O || G1();
    await mNY($N);
    let Z = Pl(X),
        G = await z8(yZ, ["new-window", "-t", $N, "-n", P, "-P", "-F", "#{pane_id}"]);
    if (G.code !== 0) throw Error(`Failed to create tmux window: ${G.stderr}`);
    let f = G.stdout.trim();
    // ... build CLI args, send command, register ...
    B.members.push({ agentId: X, name: D, backendType: "tmux", ... });
}

// READABLE (for understanding):
async function spawnTmuxTeammate(input, toolUseContext) {
    // ... same validation and identity as spawnSplitPaneTeammate ...
    let windowName = `teammate-${sanitizeForTmux(sanitizedName)}`;
    let workingDir = input.cwd || getCurrentWorkingDirectory();

    await ensureTmuxSession(SWARM_SESSION_NAME);
    let color = generateColor(agentId);
    let result = await execTmux(TMUX_BIN, ["new-window", "-t", SWARM_SESSION_NAME, "-n", windowName, "-P", "-F", "#{pane_id}"]);
    if (result.code !== 0) throw Error(`Failed to create tmux window: ${result.stderr}`);
    let paneId = result.stdout.trim();

    // Build and send command (same as split-pane)
    let command = buildSpawnCommand(workingDir, cliPath, agentFlags, permFlags);
    await execTmux(TMUX_BIN, ["send-keys", "-t", `${SWARM_SESSION_NAME}:${windowName}`, command, "Enter"]);

    // Register with hardcoded "tmux" backend
    config.members.push({ agentId, name: sanitizedName, backendType: "tmux", ... });
    // ... same mailbox delivery and AppState update ...
}

// Mapping: gNY->spawnTmuxTeammate, $N->SWARM_SESSION_NAME, yZ->TMUX_BIN,
//          z8->execTmux, ai4->sanitizeForTmux, mNY->ensureTmuxSession
```

---

### spawnInProcessTeammate (FNY) - In-process spawn

**What it does:** Creates a teammate that runs in the same Node.js process as the team lead, using an AbortController for lifecycle management and the in-process polling loop for message delivery.

**How it works:**
1. Same validation, deduplication, identity generation
2. If `agent_type` is specified, looks up matching agent definition from `options.agentDefinitions.activeAgents`
3. Calls `mZ6()` (spawnInProcessTeammate core) which:
   - Creates an AbortController for lifecycle management
   - Creates teammate identity and context objects
   - Creates a task entry via `aD1()` (createTask)
   - Builds initial task state with spinner verbs for UI feedback
   - Registers the task in AppState via `Zf()` (registerTask)
4. Starts agent execution via `xN1()` (registerTeammateAndRun) -- this is fire-and-forget, the function returns the spawn result immediately
5. Updates AppState teamContext:
   - **Auto-registers lead** if this is the first teammate (`!f.teamContext?.leadAgentId` triggers lead registration)
   - Adds the new teammate with `tmuxSessionName: "in-process"` and `tmuxPaneId: "in-process"`
6. Updates team config file with `backendType: "in-process"`

**Why this approach:**
- In-process is the most efficient mode: no subprocess overhead, no CLI startup time, shared memory
- The AbortController pattern provides clean cancellation semantics for the agent loop
- Auto-registering the lead on first teammate spawn eliminates a separate "create lead" step

**Key insight:** The lead auto-registration (lines 1040-1053) only fires when `!f.teamContext?.leadAgentId`. The lead gets a synthetic agentId generated from `"team-lead"` + teamName, with `tmuxPaneId: "leader"` and `tmuxSessionName: "in-process"`. This ensures the lead appears in the team config even though it was not explicitly spawned.

```javascript
// ============================================
// spawnInProcessTeammate - Spawn teammate in same Node.js process
// Location: chunks.135.mjs:985-1108
// ============================================

// ORIGINAL (for source lookup):
async function FNY(A, q) {
    let { setAppState: K, getAppState: Y } = q,
        { name: z, prompt: _, agent_type: w, plan_mode_required: O } = A,
        $ = yu8(A.model, Y().mainLoopModel);
    if (!z || !_) throw Error("name and prompt are required for spawn operation");
    let H = Y(), j = A.team_name || H.teamContext?.teamName;
    if (!j) throw Error("team_name is required...");
    let J = await hu8(z, j), M = Lu8(J), D = ak(M, j), X = Pl(D), P;
    if (w) {
        let v = q.options.agentDefinitions.activeAgents.find((N) => N.agentType === w);
        if (v && YQ6(v)) P = v;
    }
    let Z = await mZ6({ name: M, teamName: j, prompt: _, color: X, planModeRequired: O ?? !1, model: $ }, q);
    if (!Z.success) throw Error(Z.error ?? "Failed to spawn in-process teammate");
    if (Z.taskId && Z.teammateContext && Z.abortController)
        xN1({ identity: { agentId: D, agentName: M, teamName: j, color: X, planModeRequired: O ?? !1, parentSessionId: Z.teammateContext.parentSessionId },
               taskId: Z.taskId, prompt: _, description: A.description, model: $, agentDefinition: P,
               teammateContext: Z.teammateContext, toolUseContext: { ...q, messages: [] }, abortController: Z.abortController });
    K((f) => {
        let v = !f.teamContext?.leadAgentId,
            N = v ? ak(BY, j) : f.teamContext.leadAgentId;
        let L = v ? { [N]: { name: BY, agentType: BY, color: Pl(N), tmuxSessionName: "in-process", tmuxPaneId: "leader", cwd: G1(), spawnedAt: Date.now() } } : {};
        return { ...f, teamContext: { ...f.teamContext, teamName: j, leadAgentId: N,
            teammates: { ...f.teamContext?.teammates, ...L, [D]: { name: M, agentType: w, color: X, tmuxSessionName: "in-process", tmuxPaneId: "in-process", cwd: G1(), spawnedAt: Date.now() } } } };
    });
    let G = await Kz6(j);
    G.members.push({ agentId: D, name: M, backendType: "in-process", ... });
    await Ru8(j, G);
    return { data: { teammate_id: D, is_splitpane: false, ... } };
}

// READABLE (for understanding):
async function spawnInProcessTeammate(input, toolUseContext) {
    let { setAppState, getAppState } = toolUseContext;
    let { name, prompt, agent_type, plan_mode_required } = input;
    let model = resolveModel(input.model, getAppState().mainLoopModel);

    if (!name || !prompt) throw Error("name and prompt are required");
    let teamName = input.team_name || getAppState().teamContext?.teamName;
    if (!teamName) throw Error("team_name is required");

    let deduplicatedName = await deduplicateName(name, teamName);
    let sanitizedName = sanitizeName(deduplicatedName);
    let agentId = generateAgentId(sanitizedName, teamName);
    let agentColor = generateColor(agentId);

    // Look up agent definition if agent_type specified
    let agentDefinition;
    if (agent_type) {
        let found = toolUseContext.options.agentDefinitions.activeAgents.find(a => a.agentType === agent_type);
        if (found && isValidAgentDefinition(found)) agentDefinition = found;
    }

    // Spawn the in-process teammate (creates task, AbortController, context)
    let spawnResult = await spawnInProcessTeammateCore({ name: sanitizedName, teamName, prompt, color: agentColor, planModeRequired: plan_mode_required ?? false, model }, toolUseContext);
    if (!spawnResult.success) throw Error(spawnResult.error ?? "Failed to spawn");

    // Fire-and-forget: start the agent execution loop
    if (spawnResult.taskId && spawnResult.teammateContext && spawnResult.abortController) {
        registerTeammateAndRun({
            identity: { agentId, agentName: sanitizedName, teamName, color: agentColor, planModeRequired: plan_mode_required ?? false, parentSessionId: spawnResult.teammateContext.parentSessionId },
            taskId: spawnResult.taskId, prompt, agentDefinition, teammateContext: spawnResult.teammateContext,
            toolUseContext: { ...toolUseContext, messages: [] }, abortController: spawnResult.abortController
        });
    }

    // Auto-register lead if this is the first teammate
    setAppState((state) => {
        let isFirstTeammate = !state.teamContext?.leadAgentId;
        let leadAgentId = isFirstTeammate ? generateAgentId(TEAM_LEAD_ID, teamName) : state.teamContext.leadAgentId;
        let leadEntry = isFirstTeammate ? { [leadAgentId]: { name: TEAM_LEAD_ID, tmuxPaneId: "leader", ... } } : {};
        return { ...state, teamContext: { teamName, leadAgentId,
            teammates: { ...state.teamContext?.teammates, ...leadEntry, [agentId]: { name: sanitizedName, tmuxPaneId: "in-process", ... } } } };
    });

    // Update config file
    let config = await readTeamConfig(teamName);
    config.members.push({ agentId, name: sanitizedName, backendType: "in-process", ... });
    await writeTeamConfig(teamName, config);
    return { data: { teammate_id: agentId, is_splitpane: false } };
}

// Mapping: FNY->spawnInProcessTeammate, mZ6->spawnInProcessTeammateCore,
//          xN1->registerTeammateAndRun, YQ6->isValidAgentDefinition,
//          Zf->registerTask, aD1->createTask, BY->TEAM_LEAD_ID
```

---

## C. Team Config

### Overview

Team configuration is persisted as a JSON file at `{claudeDir}/{sanitizedTeamName}/config.json`. This file serves as the source of truth for team membership and is read by all agents (lead and teammates) for member discovery.

### Team Directory Path

```javascript
// ============================================
// getTeamDirectoryPath - Resolve team config directory
// Location: chunks.135.mjs:676-678
// ============================================

// ORIGINAL (for source lookup):
function ei4(A) {
    return Eu8(YG(), ai4(A))
}

// READABLE (for understanding):
function getTeamDirectoryPath(teamName) {
    return pathJoin(getClaudeDir(), sanitizeTeamName(teamName));
}

// Mapping: ei4->getTeamDirectoryPath, Eu8->pathJoin, YG->getClaudeDir, ai4->sanitizeTeamName
```

### Read Team Config

```javascript
// ============================================
// readTeamConfig - Read and parse config.json for a team
// Location: chunks.135.mjs:680-688
// ============================================

// ORIGINAL (for source lookup):
async function Kz6(A) {
    let q = Eu8(ei4(A), "config.json");
    try {
        let K = await INY(q, "utf-8");
        return i1(K)
    } catch (K) {
        if (K.code === "ENOENT") return null;
        return k(`[spawnTeammate] Failed to read team file for ${A}: ${_1(K)}`), null
    }
}

// READABLE (for understanding):
async function readTeamConfig(teamName) {
    let configPath = pathJoin(getTeamDirectoryPath(teamName), "config.json");
    try {
        let content = await readFile(configPath, "utf-8");
        return JSON.parse(content);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        log(`[spawnTeammate] Failed to read team file for ${teamName}: ${formatError(error)}`);
        return null;
    }
}

// Mapping: Kz6->readTeamConfig, INY->readFile, i1->JSON.parse, _1->formatError
```

### Write Team Config

```javascript
// ============================================
// writeTeamConfig - Persist team config to disk
// Location: chunks.135.mjs:690-698
// ============================================

// ORIGINAL (for source lookup):
async function Ru8(A, q) {
    let K = ei4(A);
    await bNY(K, { recursive: !0 });
    let Y = Eu8(K, "config.json");
    await xNY(Y, B6(q, null, 2))
}

// READABLE (for understanding):
async function writeTeamConfig(teamName, config) {
    let dir = getTeamDirectoryPath(teamName);
    await mkdir(dir, { recursive: true });
    let configPath = pathJoin(dir, "config.json");
    await writeFile(configPath, JSON.stringify(config, null, 2));
}

// Mapping: Ru8->writeTeamConfig, bNY->mkdir, xNY->writeFile, B6->JSON.stringify
```

### Name Deduplication

**What it does:** Ensures unique teammate names within a team by appending numeric suffixes.

**How it works:**
1. If no team name is provided, returns the original name (no dedup possible)
2. Reads current team config
3. Builds a Set of all existing member names (lowercased)
4. If the desired name is not in the set, returns it as-is
5. Otherwise, tries `name-2`, `name-3`, etc. until a unique name is found

**Key insight:** The deduplication is case-insensitive (`.toLowerCase()`) to prevent confusing situations like having both "backend-dev" and "Backend-Dev" on the same team.

```javascript
// ============================================
// deduplicateName - Append suffix to avoid name collisions
// Location: chunks.135.mjs:699-709
// ============================================

// ORIGINAL (for source lookup):
async function hu8(A, q) {
    if (!q) return A;
    let K = await Kz6(q);
    if (!K) return A;
    let Y = new Set(K.members.map((_) => _.name.toLowerCase()));
    if (!Y.has(A.toLowerCase())) return A;
    let z = 2;
    while (Y.has(`${A}-${z}`.toLowerCase())) z++;
    return `${A}-${z}`
}

// READABLE (for understanding):
async function deduplicateName(name, teamName) {
    if (!teamName) return name;
    let config = await readTeamConfig(teamName);
    if (!config) return name;
    let existingNames = new Set(config.members.map(m => m.name.toLowerCase()));
    if (!existingNames.has(name.toLowerCase())) return name;
    let suffix = 2;
    while (existingNames.has(`${name}-${suffix}`.toLowerCase())) suffix++;
    return `${name}-${suffix}`;
}

// Mapping: hu8->deduplicateName, Kz6->readTeamConfig
```

### Config Schema

The team config JSON follows this structure:

```json
{
  "members": [
    {
      "agentId": "uuid-string",
      "name": "backend-dev",
      "agentType": "teammate",
      "model": "claude-sonnet-4-20250514",
      "prompt": "You are a backend developer...",
      "color": "#3b82f6",
      "planModeRequired": false,
      "joinedAt": 1710000000000,
      "tmuxPaneId": "%5",
      "cwd": "/path/to/project",
      "subscriptions": [],
      "backendType": "tmux"
    }
  ],
  "leadAgentId": "lead-uuid-string"
}
```

---

## D. Mailbox System

### Architecture

The mailbox is a file-based message queue where each agent has an inbox file at `{claudeDir}/{teamName}/inboxes/{agentName}.json`. Messages are JSON arrays with a `read` flag. All writes use `proper-lockfile` for atomicity.

```
Team Lead                    Teammate A                   Teammate B
    |                            |                            |
    |-- writeToMailbox("A") ---->|                            |
    |                            |-- readUnreadMessages() --->|
    |                            |                            |
    |                            |-- writeToMailbox("B") -----|---->
    |<-- writeToMailbox("team-lead") ---|                     |
    |                                                         |
```

### readMailbox (wl)

**What it does:** Reads all messages (read and unread) from an agent's inbox file.

**How it works:**
1. Resolves inbox path via `FY6(agentName, teamName)`
2. Reads file content as UTF-8
3. Parses JSON array
4. Returns empty array on ENOENT (inbox does not exist yet)
5. Returns empty array and logs on any other error (tolerant of corruption)

```javascript
// ============================================
// readMailbox - Read all messages from an agent's inbox
// Location: chunks.132.mjs:3-13
// ============================================

// ORIGINAL (for source lookup):
async function wl(A, q) {
    let K = FY6(A, q);
    k(`[TeammateMailbox] readMailbox: path=${K}`);
    try {
        let Y = await xd4(K, "utf-8"),
            z = i1(Y);
        return k(`[TeammateMailbox] readMailbox: read ${z.length} message(s)`), z
    } catch (Y) {
        if (Y.code === "ENOENT") return k("[TeammateMailbox] readMailbox: file does not exist"), [];
        return k(`Failed to read inbox for ${A}: ${Y}`), _6(Y), []
    }
}

// READABLE (for understanding):
async function readMailbox(agentName, teamName) {
    let inboxPath = getInboxPath(agentName, teamName);
    log(`[TeammateMailbox] readMailbox: path=${inboxPath}`);
    try {
        let content = await readFile(inboxPath, "utf-8");
        let messages = JSON.parse(content);
        log(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;
    } catch (error) {
        if (error.code === "ENOENT") {
            log("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }
        log(`Failed to read inbox for ${agentName}: ${error}`);
        reportError(error);
        return [];
    }
}

// Mapping: wl->readMailbox, FY6->getInboxPath, xd4->readFile, i1->JSON.parse, _6->reportError
```

### readUnreadMessages (pY6)

```javascript
// ============================================
// readUnreadMessages - Filter to unread messages only
// Location: chunks.132.mjs:16-19
// ============================================

// ORIGINAL (for source lookup):
async function pY6(A, q) {
    let K = await wl(A, q),
        Y = K.filter((z) => !z.read);
    return k(`[TeammateMailbox] readUnreadMessages: ${Y.length} unread of ${K.length} total`), Y
}

// READABLE (for understanding):
async function readUnreadMessages(agentName, teamName) {
    let allMessages = await readMailbox(agentName, teamName);
    let unread = allMessages.filter(msg => !msg.read);
    log(`[TeammateMailbox] readUnreadMessages: ${unread.length} unread of ${allMessages.length} total`);
    return unread;
}

// Mapping: pY6->readUnreadMessages, wl->readMailbox
```

### writeToMailbox (x3)

**What it does:** Atomically appends a message to an agent's inbox file using file locking.

**How it works:**
1. Ensures the inbox directory exists via `OTY()` (ensureInboxDirectoryExists)
2. Resolves the inbox file path
3. Attempts to create the inbox file with flag `"wx"` (write-exclusive = fail if exists). This is the initial creation path; EEXIST is silently ignored.
4. Acquires a lock via `Nc6.lock()` (proper-lockfile) with custom lock options: `retries: 10, minTimeout: 5ms, maxTimeout: 100ms`
5. Reads current messages from inbox
6. Appends new message with `read: false`
7. Writes the full array back to the file
8. Releases lock in `finally` block

**Why this approach:**
- The `"wx"` flag for initial creation is a safe create-if-not-exists pattern that avoids TOCTOU races.
- File locking via `proper-lockfile` handles concurrent writes from multiple agents writing to the same inbox.
- The lock options (`retries: 10, minTimeout: 5ms, maxTimeout: 100ms`) are tuned for low-latency local file I/O -- fast retry with short backoff.
- Reading, appending, and writing the full array is necessary because JSON does not support append-only writes.

**Trade-off:** Reading the entire inbox to append one message is O(n) in message count. This is acceptable because inboxes are expected to be small (messages are consumed and marked as read quickly by the polling loop). For very chatty teams, this could become a bottleneck.

```javascript
// ============================================
// writeToMailbox - Atomically append message with file locking
// Location: chunks.132.mjs:22-55
// ============================================

// ORIGINAL (for source lookup):
async function x3(A, q, K) {
    await OTY(K);
    let Y = FY6(A, K),
        z = `${Y}.lock`;
    k(`[TeammateMailbox] writeToMailbox: recipient=${A}, from=${q.from}, path=${Y}`);
    try {
        await Pf6(Y, "[]", { encoding: "utf-8", flag: "wx" }),
        k("[TeammateMailbox] writeToMailbox: created new inbox file")
    } catch (w) {
        if (w.code !== "EEXIST") { k(`...failed...`); _6(w); return }
    }
    let _;
    try {
        _ = await Nc6.lock(Y, { lockfilePath: z, ...iv1 });
        let w = await wl(A, K),
            O = { ...q, read: !1 };
        w.push(O);
        await Pf6(Y, B6(w, null, 2), "utf-8");
        k(`[TeammateMailbox] Wrote message to ${A}'s inbox from ${q.from}`)
    } catch (w) {
        k(`Failed to write to inbox for ${A}: ${w}`); _6(w)
    } finally {
        if (_) await _()
    }
}

// READABLE (for understanding):
async function writeToMailbox(recipientName, message, teamName) {
    await ensureInboxDirectoryExists(teamName);
    let inboxPath = getInboxPath(recipientName, teamName);
    let lockPath = `${inboxPath}.lock`;
    log(`[TeammateMailbox] writeToMailbox: recipient=${recipientName}, from=${message.from}, path=${inboxPath}`);

    // Create inbox file if it doesn't exist (wx = exclusive create)
    try {
        await writeFile(inboxPath, "[]", { encoding: "utf-8", flag: "wx" });
        log("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (error) {
        if (error.code !== "EEXIST") {
            log(`writeToMailbox: failed to create inbox file: ${error}`);
            reportError(error);
            return;
        }
    }

    // Lock, read, append, write
    let releaseLock;
    try {
        releaseLock = await properLockfile.lock(inboxPath, { lockfilePath: lockPath, ...LOCK_OPTIONS });
        let messages = await readMailbox(recipientName, teamName);
        let newMessage = { ...message, read: false };
        messages.push(newMessage);
        await writeFile(inboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`[TeammateMailbox] Wrote message to ${recipientName}'s inbox from ${message.from}`);
    } catch (error) {
        log(`Failed to write to inbox for ${recipientName}: ${error}`);
        reportError(error);
    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: x3->writeToMailbox, OTY->ensureInboxDirectoryExists, FY6->getInboxPath,
//          Pf6->writeFile, Nc6->properLockfile, iv1->LOCK_OPTIONS, wl->readMailbox, B6->JSON.stringify
```

### markMessageAsReadByIndex (Vc6)

**What it does:** Marks a single message at a specific index as read. Used by the polling loop when a specific message is consumed.

**How it works:**
1. Acquires lock on inbox file
2. Reads all messages
3. Validates index is in bounds
4. Checks message is not already read (or missing)
5. Sets `read: true` on the message
6. Writes back
7. Releases lock

```javascript
// ============================================
// markMessageAsReadByIndex - Mark one message as read by position
// Location: chunks.132.mjs:57-90
// ============================================

// ORIGINAL (for source lookup):
async function Vc6(A, q, K) {
    let Y = FY6(A, q);
    let z = `${Y}.lock`, _;
    try {
        _ = await Nc6.lock(Y, { lockfilePath: z, ...iv1 });
        let w = await wl(A, q);
        if (K < 0 || K >= w.length) { return }
        let O = w[K];
        if (!O || O.read) { return }
        w[K] = { ...O, read: !0 };
        await Pf6(Y, B6(w, null, 2), "utf-8");
    } catch (w) {
        if (w.code === "ENOENT") { return }
        _6(w)
    } finally {
        if (_) await _()
    }
}

// READABLE (for understanding):
async function markMessageAsReadByIndex(agentName, teamName, index) {
    let inboxPath = getInboxPath(agentName, teamName);
    let lockPath = `${inboxPath}.lock`;
    let releaseLock;
    try {
        releaseLock = await properLockfile.lock(inboxPath, { lockfilePath: lockPath, ...LOCK_OPTIONS });
        let messages = await readMailbox(agentName, teamName);
        if (index < 0 || index >= messages.length) return;
        let msg = messages[index];
        if (!msg || msg.read) return;
        messages[index] = { ...msg, read: true };
        await writeFile(inboxPath, JSON.stringify(messages, null, 2), "utf-8");
    } catch (error) {
        if (error.code === "ENOENT") return;
        reportError(error);
    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: Vc6->markMessageAsReadByIndex
```

### markMessagesAsRead (kc6)

**What it does:** Bulk marks ALL messages as read, with a verification step.

**How it works:**
1. Acquires lock
2. Reads all messages
3. Maps all messages to `read: true`
4. Writes back
5. **Verification**: Re-reads the file and checks that no messages remain unread
6. Releases lock

**Key insight:** The verification step (lines 114-116) is a defensive measure. After writing, the function re-reads the file and counts unread messages to confirm the write succeeded. This catches silent write failures or concurrent corruption.

```javascript
// ============================================
// markMessagesAsRead - Bulk mark all messages as read with verification
// Location: chunks.132.mjs:92-126
// ============================================

// ORIGINAL (for source lookup):
async function kc6(A, q) {
    let K = FY6(A, q), Y = `${K}.lock`, z;
    try {
        z = await Nc6.lock(K, { lockfilePath: Y, ...iv1 });
        let _ = await wl(A, q);
        if (_.length === 0) { return }
        let w = _.filter((J) => !J.read).length;
        let O = _.map((J) => ({ ...J, read: !0 }));
        await Pf6(K, B6(O, null, 2), "utf-8");
        // Verification step
        let $ = await xd4(K, "utf-8"),
            j = i1($).filter((J) => !J.read).length;
        k(`[TeammateMailbox] markMessagesAsRead: VERIFY - ${j} still unread after write`)
    } catch (_) {
        if (_.code === "ENOENT") { return }
        _6(_)
    } finally {
        if (z) await z()
    }
}

// READABLE (for understanding):
async function markMessagesAsRead(agentName, teamName) {
    let inboxPath = getInboxPath(agentName, teamName);
    let lockPath = `${inboxPath}.lock`;
    let releaseLock;
    try {
        releaseLock = await properLockfile.lock(inboxPath, { lockfilePath: lockPath, ...LOCK_OPTIONS });
        let messages = await readMailbox(agentName, teamName);
        if (messages.length === 0) return;
        let unreadCount = messages.filter(m => !m.read).length;
        let updatedMessages = messages.map(m => ({ ...m, read: true }));
        await writeFile(inboxPath, JSON.stringify(updatedMessages, null, 2), "utf-8");

        // Verification: re-read and confirm
        let rawContent = await readFile(inboxPath, "utf-8");
        let stillUnread = JSON.parse(rawContent).filter(m => !m.read).length;
        log(`[TeammateMailbox] markMessagesAsRead: VERIFY - ${stillUnread} still unread after write`);
    } catch (error) {
        if (error.code === "ENOENT") return;
        reportError(error);
    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: kc6->markMessagesAsRead, xd4->readFile
```

### clearInbox ($TY)

```javascript
// ============================================
// clearInbox - Overwrite inbox with empty array
// Location: chunks.132.mjs:128-139
// ============================================

// ORIGINAL (for source lookup):
async function $TY(A, q) {
    let K = FY6(A, q);
    try {
        await Pf6(K, "[]", { encoding: "utf-8", flag: "r+" });
    } catch (Y) {
        if (Y.code === "ENOENT") return;
        _6(Y)
    }
}

// READABLE (for understanding):
async function clearInbox(agentName, teamName) {
    let inboxPath = getInboxPath(agentName, teamName);
    try {
        await writeFile(inboxPath, "[]", { encoding: "utf-8", flag: "r+" });
    } catch (error) {
        if (error.code === "ENOENT") return; // inbox never existed
        reportError(error);
    }
}

// Mapping: $TY->clearInbox
```

**Key insight:** The `"r+"` flag means "open for reading and writing, fail if doesn't exist". This is intentional -- you should only clear an inbox that already exists. If the inbox file never existed, there is nothing to clear.

### formatMessagesAsXML (HTY)

**What it does:** Converts messages into XML-formatted strings for injection into the LLM context. Each message is wrapped in `<teammate_message>` tags with metadata attributes.

```javascript
// ============================================
// formatMessagesAsXML - Convert messages to XML for LLM context
// Location: chunks.132.mjs:141-151
// ============================================

// ORIGINAL (for source lookup):
function HTY(A) {
    return A.map((q) => {
        let K = q.color ? ` color="${q.color}"` : "",
            Y = q.summary ? ` summary="${q.summary}"` : "";
        return `<${fj} teammate_id="${q.from}"${K}${Y}>
${q.text}
</${fj}>`
    }).join(`\n\n`)
}

// READABLE (for understanding):
function formatMessagesAsXML(messages) {
    return messages.map((msg) => {
        let colorAttr = msg.color ? ` color="${msg.color}"` : "";
        let summaryAttr = msg.summary ? ` summary="${msg.summary}"` : "";
        return `<${TEAMMATE_MESSAGE_TAG} teammate_id="${msg.from}"${colorAttr}${summaryAttr}>
${msg.text}
</${TEAMMATE_MESSAGE_TAG}>`;
    }).join("\n\n");
}

// Mapping: HTY->formatMessagesAsXML, fj->TEAMMATE_MESSAGE_TAG
```

### Inbox Path Resolution

The inbox path follows the pattern: `{claudeDir}/{teamName}/inboxes/{agentName}.json`

- `FY6(agentName, teamName)` at chunks.131.mjs:2849 resolves this path
- `OTY(teamName)` at chunks.131.mjs:2858 creates the `inboxes` subdirectory if needed

---

## E. Message Types

The mailbox supports several structured message types, each with a create function and a parse function. All parse functions follow the same pattern: try to JSON.parse the text, check the `type` field, return the parsed object or null.

### idle_notification

Used by teammates to signal they have no work left.

```javascript
// ============================================
// buildIdleNotification - Create idle notification payload
// Location: chunks.132.mjs:153-164
// ============================================

// ORIGINAL (for source lookup):
function Ec6(A, q) {
    return {
        type: "idle_notification", from: A, timestamp: new Date().toISOString(),
        idleReason: q?.idleReason, summary: q?.summary,
        completedTaskId: q?.completedTaskId, completedStatus: q?.completedStatus,
        failureReason: q?.failureReason
    }
}

// READABLE (for understanding):
function buildIdleNotification(agentName, options) {
    return {
        type: "idle_notification",
        from: agentName,
        timestamp: new Date().toISOString(),
        idleReason: options?.idleReason,       // "available" | "interrupted" | "failed"
        summary: options?.summary,
        completedTaskId: options?.completedTaskId,
        completedStatus: options?.completedStatus,
        failureReason: options?.failureReason
    };
}

// Mapping: Ec6->buildIdleNotification
```

### permission_request / permission_response

Used by workers to request tool permissions from the team lead.

```javascript
// ============================================
// buildPermissionRequest - Create permission request payload
// Location: chunks.132.mjs:174-185
// ============================================

// ORIGINAL (for source lookup):
function Xx8(A) {
    return {
        type: "permission_request", request_id: A.request_id, agent_id: A.agent_id,
        tool_name: A.tool_name, tool_use_id: A.tool_use_id,
        description: A.description, input: A.input,
        permission_suggestions: A.permission_suggestions || []
    }
}

// READABLE (for understanding):
function buildPermissionRequest(params) {
    return {
        type: "permission_request",
        request_id: params.request_id,
        agent_id: params.agent_id,
        tool_name: params.tool_name,
        tool_use_id: params.tool_use_id,
        description: params.description,
        input: params.input,
        permission_suggestions: params.permission_suggestions || []
    };
}

// Mapping: Xx8->buildPermissionRequest
```

### sandbox_permission_request / sandbox_permission_response

Used for host-level sandbox permissions (network access to specific hosts).

```javascript
// ============================================
// buildSandboxPermissionRequest - Create sandbox permission request
// Location: chunks.132.mjs:221-233
// ============================================

// ORIGINAL (for source lookup):
function Wx8(A) {
    return {
        type: "sandbox_permission_request", requestId: A.requestId,
        workerId: A.workerId, workerName: A.workerName, workerColor: A.workerColor,
        hostPattern: { host: A.host }, createdAt: Date.now()
    }
}

// READABLE (for understanding):
function buildSandboxPermissionRequest(params) {
    return {
        type: "sandbox_permission_request",
        requestId: params.requestId,
        workerId: params.workerId,
        workerName: params.workerName,
        workerColor: params.workerColor,
        hostPattern: { host: params.host },
        createdAt: Date.now()
    };
}

// Mapping: Wx8->buildSandboxPermissionRequest
```

### shutdown_request / shutdown_approved / shutdown_rejected

Used for coordinated agent termination.

```javascript
// ============================================
// createShutdownRequest - Request agent shutdown
// Location: chunks.132.mjs:261-269
// ============================================

// ORIGINAL (for source lookup):
function Wf6(A) {
    return { type: "shutdown_request", requestId: A.requestId, from: A.from,
             reason: A.reason, timestamp: new Date().toISOString() }
}

// READABLE (for understanding):
function createShutdownRequest(params) {
    return {
        type: "shutdown_request",
        requestId: params.requestId,
        from: params.from,
        reason: params.reason,
        timestamp: new Date().toISOString()
    };
}

// Mapping: Wf6->createShutdownRequest
```

```javascript
// ============================================
// createShutdownApprovalResponse - Approve shutdown
// Location: chunks.132.mjs:271-278
// ============================================

// ORIGINAL (for source lookup):
function Gx8(A) {
    return { type: "shutdown_approved", requestId: A.requestId,
             from: A.from, paneId: A.paneId, backendType: A.backendType }
}

// READABLE (for understanding):
function createShutdownApprovalResponse(params) {
    return {
        type: "shutdown_approved",
        requestId: params.requestId,
        from: params.from,
        paneId: params.paneId,
        backendType: params.backendType
    };
}

// Mapping: Gx8->createShutdownApprovalResponse
```

```javascript
// ============================================
// createShutdownRejectionResponse - Reject shutdown
// Location: chunks.132.mjs:280+ (inferred from fx8 reference)
// ============================================

// ORIGINAL (for source lookup):
function fx8(A) {
    return { type: "shutdown_rejected", requestId: A.requestId,
             from: A.from, reason: A.reason }
}

// READABLE (for understanding):
function createShutdownRejectionResponse(params) {
    return {
        type: "shutdown_rejected",
        requestId: params.requestId,
        from: params.from,
        reason: params.reason
    };
}

// Mapping: fx8->createShutdownRejectionResponse
```

### Parse Functions Summary

| Create | Parse | Type |
|--------|-------|------|
| `Ec6` (buildIdleNotification) | `yc6` (parseIdleNotification) | `idle_notification` |
| `Xx8` (buildPermissionRequest) | `Lc6` (parsePermissionRequest) | `permission_request` |
| `Px8` (buildPermissionResponse) | `QY6` (parsePermissionResponse) | `permission_response` |
| `Wx8` (buildSandboxPermissionRequest) | `nv1` (parseSandboxPermissionRequest) | `sandbox_permission_request` |
| `Zx8` (buildSandboxPermissionResponse) | `Rc6` (parseSandboxPermissionResponse) | `sandbox_permission_response` |
| `Wf6` (createShutdownRequest) | `ss` (parseShutdownRequest) | `shutdown_request` |
| `Gx8` (createShutdownApprovalResponse) | -- | `shutdown_approved` |
| `fx8` (createShutdownRejectionResponse) | -- | `shutdown_rejected` |

---

## F. SendMessage Tool

### Tool Definition (OxY)

**What it does:** The SendMessage tool is the primary inter-agent communication primitive. It supports plain text messages, shutdown requests/responses, and plan approval responses.

**How it works:**

The tool is defined as an object at chunks.145.mjs:2609 with:
- **Name**: `hI` = "SendMessage" (from chunks.91.mjs:39)
- **Input schema**: A discriminated union: `to` (recipient name or `"*"` for broadcast) + `message` (string for plain text, or structured object for shutdown/plan approval) + optional `summary`
- **isEnabled()**: Returns `E7()` -- only available when Agent Teams is active
- **isReadOnly(input)**: True for string messages (they don't modify state), false for structured messages
- **checkPermissions**: Always returns `{behavior: "allow"}` -- no permission gate on messaging
- **validateInput**: Enforces several constraints:
  - `to` must not be empty
  - `to` must not contain `@` (only one team per session)
  - String messages require a `summary` field
  - Structured messages cannot be broadcast (`to: "*"`)
  - `shutdown_response` must be sent to `BY` ("team-lead")
  - Rejection of shutdown requires a `reason`

### call() Dispatch Logic

**What it does:** Routes the message to the appropriate handler based on message type and target.

**Configuration:** The tool is declared with `isConcurrencySafe: false`, meaning SendMessage calls are serialized by the tool execution engine. This prevents race conditions in registry lookups and mailbox writes when multiple tool calls are in flight.

**How it works (decision tree):**

```
call(input, context)
  |
  +-- typeof message === "string" && to !== "*"
  |     |
  |     +-- Check in-process registry (agentNameRegistry)
  |     |     +-- Found running? -> NV1() queue to pendingUserMessages -> return
  |     |     +-- Found but not running? -> return error "not running"
  |     |
  |     +-- Not in registry? -> Fall through to mailbox path
  |
  +-- typeof message === "string" && to === "*"
  |     -> qxY() broadcast via mailbox to all teammates
  |
  +-- typeof message === "string" && to is specific (not in-process)
  |     -> AxY() direct via mailbox to specific teammate
  |
  +-- typeof message !== "string" && to === "*"
  |     -> THROW Error("structured messages cannot be broadcast")
  |     (runtime guard at line 2749, before the switch statement)
  |
  +-- typeof message === "object"
        |
        +-- shutdown_request -> KxY() send shutdown request
        +-- shutdown_response (approve) -> YxY() handle approval
        +-- shutdown_response (reject) -> zxY() handle rejection
        +-- plan_approval_response (approve) -> _xY() approve plan
        +-- plan_approval_response (reject) -> wxY() reject plan
```

**Why this approach:**
- The in-process registry check (`agentNameRegistry`) is an optimization: if the target is an in-process teammate, the message is delivered directly to its `pendingUserMessages` queue in AppState, bypassing the file-based mailbox entirely. This is faster and avoids disk I/O.
- The broadcast guard (`throw Error("structured messages cannot be broadcast")`) is a defense-in-depth check: `validateInput` already rejects broadcast structured messages, but the runtime guard in `call()` ensures correctness even if validation is bypassed.
- The broadcast path (`to: "*"`) writes to every teammate's mailbox -- it is explicitly documented as "use sparingly" in the system prompt.
- Plan approval is gated: only the team lead (`KZ()` check) can approve plans.
- The `backfillObservableInput` method (lines 2629-2642) flattens nested input structures for observability/telemetry, ensuring structured message fields are visible in trace data.

**Key insight:** The `NV1()` function for in-process delivery queues the message into `pendingUserMessages` on the task state. The polling loop (`DNY`) checks this queue at priority level 1 (highest), meaning in-process messages are delivered faster than mailbox messages.

```javascript
// ============================================
// SendMessageTool.call - Message dispatch routing
// Location: chunks.145.mjs:2716-2760
// ============================================

// ORIGINAL (for source lookup):
async call(A, q) {
    if (typeof A.message === "string" && A.to !== "*") {
        let K = q.getAppState(),
            Y = K.agentNameRegistry.get(A.to),
            z = Y ?? ZY4(A.to);
        if (z) {
            let _ = K.tasks[z];
            if (Sf(_) && !Ef6(_)) {
                if (_.status !== "running") return { data: { success: !1, message: `Agent "${A.to}" is not running (status: ${_.status}). Use Agent({resume: "${z}"}) to resume it.` } };
                return NV1(z, A.message, q.setAppStateForTasks ?? q.setAppState),
                    { data: { success: !0, message: `Message queued for delivery to ${A.to} at its next tool round.` } }
            }
            if (Y) return { data: { success: !1, message: `No running local agent found for "${A.to}".` } }
        }
    }
    if (typeof A.message === "string") {
        if (A.to === "*") return qxY(A.message, A.summary, q);
        return AxY(A.to, A.message, A.summary, q)
    }
    if (A.to === "*") throw Error("structured messages cannot be broadcast");
    switch (A.message.type) {
        case "shutdown_request": return KxY(A.to, A.message.reason, q);
        case "shutdown_response":
            if (A.message.approve) return YxY(A.message.request_id, q);
            return zxY(A.message.request_id, A.message.reason);
        case "plan_approval_response":
            if (A.message.approve) return _xY(A.to, A.message.request_id, q);
            return wxY(A.to, A.message.request_id, A.message.feedback ?? "Plan needs revision", q)
    }
}

// READABLE (for understanding):
async call(input, toolUseContext) {
    // Fast path: in-process delivery for string messages to specific targets
    if (typeof input.message === "string" && input.to !== "*") {
        let appState = toolUseContext.getAppState();
        let taskId = appState.agentNameRegistry.get(input.to) ?? findTaskByName(input.to);
        if (taskId) {
            let task = appState.tasks[taskId];
            if (isInProcessTeammate(task) && !isCompleted(task)) {
                if (task.status !== "running")
                    return { data: { success: false, message: `Agent "${input.to}" is not running (status: ${task.status}). Use Agent({resume: "${taskId}"}) to resume it.` } };
                queueInProcessMessage(taskId, input.message, toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState);
                return { data: { success: true, message: `Message queued for ${input.to}.` } };
            }
            if (appState.agentNameRegistry.get(input.to))
                return { data: { success: false, message: `No running local agent for "${input.to}".` } };
        }
    }

    // Mailbox path: string messages
    if (typeof input.message === "string") {
        if (input.to === "*") return broadcastMessage(input.message, input.summary, toolUseContext);
        return directMessage(input.to, input.message, input.summary, toolUseContext);
    }

    // Runtime guard: structured messages cannot be broadcast
    if (input.to === "*") throw Error("structured messages cannot be broadcast");

    // Structured messages: route by type
    switch (input.message.type) {
        case "shutdown_request":
            return handleShutdownRequest(input.to, input.message.reason, toolUseContext);
        case "shutdown_response":
            if (input.message.approve) return handleShutdownApproval(input.message.request_id, toolUseContext);
            return handleShutdownRejection(input.message.request_id, input.message.reason);
        case "plan_approval_response":
            if (input.message.approve) return approvePlan(input.to, input.message.request_id, toolUseContext);
            return rejectPlan(input.to, input.message.request_id, input.message.feedback ?? "Plan needs revision", toolUseContext);
    }
}

// Mapping: NV1->queueInProcessMessage, ZY4->findTaskByName, Sf->isInProcessTeammate,
//          Ef6->isCompleted, qxY->broadcastMessage, AxY->directMessage,
//          KxY->handleShutdownRequest, YxY->handleShutdownApproval, zxY->handleShutdownRejection,
//          _xY->approvePlan, wxY->rejectPlan
```

### Shutdown Approval Handler (YxY)

**What it does:** When a teammate approves a shutdown request (confirms it is willing to exit), this handler terminates the agent.

**How it works:**
1. Gets current team name, agent ID, and agent name
2. Looks up own config in team file to get `tmuxPaneId` and `backendType`
3. Creates shutdown approval message via `Gx8()` with paneId and backendType
4. Writes approval to team-lead's mailbox (`BY`)
5. **For in-process backend**: Looks up task in AppState, calls `abortController.abort()` to signal the polling loop to stop
6. **For pane-based backend**: Calls `Vq(0, "other")` (gracefulExit) via `setImmediate` to exit the process

**Key insight:** The `setImmediate` wrapper around `Vq()` (gracefulExit) ensures the shutdown response is returned to the caller before the process actually exits. Without it, the tool call would fail with a broken pipe.

```javascript
// ============================================
// handleShutdownApproval - Process shutdown approval and terminate agent
// Location: chunks.145.mjs:2443-2497
// ============================================

// ORIGINAL (for source lookup):
async function YxY(A, q) {
    let K = l5(), Y = nM(), z = i3() || "teammate";
    let _, w;
    if (K) {
        let $ = await Kz6(K);
        if ($ && Y) {
            let H = $.members.find((j) => j.agentId === Y);
            if (H) _ = H.tmuxPaneId, w = H.backendType
        }
    }
    let O = Gx8({ requestId: A, from: z, paneId: _, backendType: w });
    if (await x3(BY, { from: z, text: B6(O), timestamp: new Date().toISOString(), color: H$() }, K),
        w === "in-process") {
        if (Y) {
            let $ = q.getAppState(), H = _g(Y, $.tasks);
            if (H?.abortController) H.abortController.abort();
        }
    } else {
        if (Y) {
            let $ = q.getAppState(), H = _g(Y, $.tasks);
            if (H?.abortController) return H.abortController.abort(), { data: { success: !0, message: `Shutdown approved (fallback path).` } }
        }
        setImmediate(async () => { await Vq(0, "other") })
    }
    return { data: { success: !0, message: `Shutdown approved. Agent ${z} is now exiting.`, request_id: A } }
}

// READABLE (for understanding):
async function handleShutdownApproval(requestId, toolUseContext) {
    let teamName = getTeamName();
    let agentId = getAgentId();
    let agentName = getAgentName() || "teammate";

    // Look up own backend info from team config
    let paneId, backendType;
    if (teamName) {
        let config = await readTeamConfig(teamName);
        if (config && agentId) {
            let member = config.members.find(m => m.agentId === agentId);
            if (member) { paneId = member.tmuxPaneId; backendType = member.backendType; }
        }
    }

    // Send approval to team-lead mailbox
    let approval = createShutdownApprovalResponse({ requestId, from: agentName, paneId, backendType });
    await writeToMailbox(TEAM_LEAD_ID, { from: agentName, text: JSON.stringify(approval), color: getTeammateColor() }, teamName);

    // Terminate based on backend type
    if (backendType === "in-process") {
        let task = findTaskByAgentId(agentId, toolUseContext.getAppState().tasks);
        if (task?.abortController) task.abortController.abort();
    } else {
        // Fallback: check if there's an in-process task for this agent
        let task = findTaskByAgentId(agentId, toolUseContext.getAppState().tasks);
        if (task?.abortController) {
            task.abortController.abort();
            return { data: { success: true, message: "Shutdown approved (fallback path)." } };
        }
        // Pane-based: exit process after returning response
        setImmediate(async () => { await gracefulExit(0, "other"); });
    }

    return { data: { success: true, message: `Shutdown approved. Agent ${agentName} is now exiting.` } };
}

// Mapping: YxY->handleShutdownApproval, l5->getTeamName, nM->getAgentId, i3->getAgentName,
//          H$->getTeammateColor, _g->findTaskByAgentId, Vq->gracefulExit, BY->TEAM_LEAD_ID
```

---

## G. In-Process Runner Polling

### pollForNextMessage (DNY) - 5-level priority polling loop

**What it does:** The core polling loop for in-process teammates. It checks multiple message sources in strict priority order with a 500ms sleep between iterations.

**How it works (priority levels):**

1. **Level 1 - pendingUserMessages** (highest priority):
   - Checks AppState `tasks[taskId].pendingUserMessages`
   - If non-empty, dequeues the first message by updating AppState (slice(1))
   - The setAppState callback includes a defensive type-check guard: `if (!D || D.type !== "in_process_teammate") return M;` -- this prevents crashes if the task state changes between the read and the update (e.g., task was removed or changed type concurrently)
   - Returns immediately with `{type: "new_message", from: "user"}`
   - This is the fast path for in-process message delivery from SendMessage

2. **Level 2 - shutdown_request** (mailbox scan):
   - Reads all messages from mailbox via `wl()` (readMailbox)
   - Scans through all unread messages looking for shutdown requests via `M66()` parser
   - If found, marks the message as read and returns `{type: "shutdown_request", request: shutdownRequest, originalMessage: msg.text}` -- the `originalMessage` field preserves the raw mailbox text for logging/debugging
   - **Prioritized over all other mailbox messages** -- the loop scans the entire inbox before checking normal messages

3. **Level 3 - team-lead messages**:
   - Looks for first unread message from `BY` ("team-lead")
   - Team-lead messages get priority over peer messages

4. **Level 4 - peer messages**:
   - Falls back to `findIndex(msg => !msg.read)` -- any unread message
   - Marks as read and returns

5. **Level 5 - task-list** (lowest priority):
   - Calls `Ji4(taskListPath, agentName)` to check for auto-claimable tasks
   - If a task is found, returns `{type: "new_message", from: "task-list"}`

**Timing:** 500ms sleep between iterations (except the first). The abort signal is checked at every iteration boundary.

**Why this approach:**
- The priority ordering ensures critical operations (user messages, shutdown) are never starved by chatty peers.
- Shutdown requests are scanned across ALL unread messages, not just the first, because they must be processed even if there are unread peer messages ahead in the queue.
- Task auto-claim is lowest priority because it represents "make-work" -- only relevant when the agent truly has nothing else to do.

**Key insight:** The polling loop does NOT use `readUnreadMessages` -- it reads ALL messages (including read ones) and manually scans for unread shutdown requests. This is because it needs the array index to call `markMessageAsReadByIndex`. The `readUnreadMessages` function would lose the original index information.

```javascript
// ============================================
// pollForNextMessage - 5-level priority polling loop
// Location: chunks.134.mjs:1483-1569
// ============================================

// ORIGINAL (for source lookup):
async function DNY(A, q, K, Y, z, _) {
    k(`[inProcessRunner] ${A.agentName} starting poll loop (abort=${q.signal.aborted})`);
    let O = 0;
    while (!q.signal.aborted) {
        // Level 1: pendingUserMessages
        let H = Y().tasks[K];
        if (H && H.type === "in_process_teammate" && H.pendingUserMessages.length > 0) {
            let J = H.pendingUserMessages[0];
            return z((M) => {
                let D = M.tasks[K];
                if (!D || D.type !== "in_process_teammate") return M;
                return { ...M, tasks: { ...M.tasks, [K]: { ...D, pendingUserMessages: D.pendingUserMessages.slice(1) } } }
            }), { type: "new_message", message: J, from: "user" }
        }
        if (O > 0) await jNY(500);
        if (O++, q.signal.aborted) return { type: "aborted" };

        // Level 2: shutdown_request scan
        try {
            let J = await wl(A.agentName, A.teamName), M = -1, D = null;
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read) {
                    let Z = M66(W.text);
                    if (Z) { M = P; D = Z; break }
                }
            }
            if (M !== -1) {
                let P = J[M], W = J.slice(0, M).filter((Z) => !Z.read).length;
                return await Vc6(A.agentName, A.teamName, M),
                    { type: "shutdown_request", request: D, originalMessage: P.text }
            }

            // Level 3: team-lead messages
            let X = -1;
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read && W.from === BY) { X = P; break }
            }
            // Level 4: any peer message
            if (X === -1) X = J.findIndex((P) => !P.read);
            if (X !== -1) {
                let P = J[X];
                if (P) return await Vc6(A.agentName, A.teamName, X),
                    { type: "new_message", message: P.text, from: P.from, color: P.color, summary: P.summary }
            }
        } catch (J) { k(`[inProcessRunner] ${A.agentName} poll error: ${J}`) }

        // Level 5: task auto-claim
        let j = await Ji4(_, A.agentName);
        if (j) return { type: "new_message", message: j, from: "task-list" }
    }
    return { type: "aborted" }
}

// READABLE (for understanding):
async function pollForNextMessage(identity, abortController, taskId, getAppState, setAppState, taskListPath) {
    log(`[inProcessRunner] ${identity.agentName} starting poll loop`);
    let pollCount = 0;
    while (!abortController.signal.aborted) {
        // [PRIORITY 1] Check in-process message queue (highest priority)
        let task = getAppState().tasks[taskId];
        if (task?.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
            let message = task.pendingUserMessages[0];
            setAppState(state => {
                let currentTask = state.tasks[taskId];
                // Defensive guard: prevent crash if task state changed between read and update
                if (!currentTask || currentTask.type !== "in_process_teammate") return state;
                return { ...state, tasks: { ...state.tasks, [taskId]: { ...currentTask,
                    pendingUserMessages: currentTask.pendingUserMessages.slice(1) } } };
            });
            return { type: "new_message", message, from: "user" };
        }

        // Sleep 500ms between polls (skip first iteration)
        if (pollCount > 0) await sleep(500);
        pollCount++;
        if (abortController.signal.aborted) return { type: "aborted" };

        // Read mailbox for levels 2-4
        try {
            let allMessages = await readMailbox(identity.agentName, identity.teamName);

            // [PRIORITY 2] Scan for shutdown_request (prioritized over everything)
            let shutdownIndex = -1, shutdownRequest = null;
            for (let i = 0; i < allMessages.length; i++) {
                let msg = allMessages[i];
                if (msg && !msg.read) {
                    let parsed = parseShutdownRequest(msg.text);
                    if (parsed) { shutdownIndex = i; shutdownRequest = parsed; break; }
                }
            }
            if (shutdownIndex !== -1) {
                let shutdownMsg = allMessages[shutdownIndex];
                let skippedUnread = allMessages.slice(0, shutdownIndex).filter(m => !m.read).length;
                log(`Received shutdown request, prioritized over ${skippedUnread} unread messages`);
                await markMessageAsReadByIndex(identity.agentName, identity.teamName, shutdownIndex);
                return { type: "shutdown_request", request: shutdownRequest, originalMessage: shutdownMsg.text };
            }

            // [PRIORITY 3] Team-lead messages first
            let messageIndex = -1;
            for (let i = 0; i < allMessages.length; i++) {
                if (allMessages[i] && !allMessages[i].read && allMessages[i].from === TEAM_LEAD_ID) {
                    messageIndex = i; break;
                }
            }

            // [PRIORITY 4] Any unread message
            if (messageIndex === -1) messageIndex = allMessages.findIndex(m => !m.read);

            if (messageIndex !== -1) {
                let msg = allMessages[messageIndex];
                await markMessageAsReadByIndex(identity.agentName, identity.teamName, messageIndex);
                return { type: "new_message", message: msg.text, from: msg.from, color: msg.color, summary: msg.summary };
            }
        } catch (error) {
            log(`[inProcessRunner] ${identity.agentName} poll error: ${error}`);
        }

        // [PRIORITY 5] Auto-claim tasks (lowest priority)
        let taskPrompt = await claimUnclaimedTask(taskListPath, identity.agentName);
        if (taskPrompt) return { type: "new_message", message: taskPrompt, from: "task-list" };
    }
    return { type: "aborted" };
}

// Mapping: DNY->pollForNextMessage, jNY->sleep, wl->readMailbox, M66->parseShutdownRequest,
//          Vc6->markMessageAsReadByIndex, BY->TEAM_LEAD_ID, Ji4->claimUnclaimedTask
```

### Task Auto-Claim (Ji4 / JNY)

**What it does:** Finds and claims the next available task for the current agent.

**How it works:**
1. `Ji4` (claimUnclaimedTask) reads the task list from disk
2. Calls `JNY` (findNextAvailableTask) which:
   - Builds a Set of all non-completed task IDs
   - Finds the first task where: status === "pending", no owner, all `blockedBy` dependencies are completed (not in the active set)
3. If found, claims the task via `OT8` (claimTask)
4. Updates task status to "in_progress" via `WI` (updateTask)
5. Returns a formatted prompt string via `MNY` (generatePromptFromTask)

**Key insight:** The dependency resolution in `JNY` is elegant: it builds a set of all non-completed task IDs, then checks that none of a task's `blockedBy` references are in that set. This means a task is unblocked when ALL its dependencies are completed.

```javascript
// ============================================
// findNextAvailableTask - Find unblocked, unclaimed task
// Location: chunks.134.mjs:1445-1452
// ============================================

// ORIGINAL (for source lookup):
function JNY(A) {
    let q = new Set(A.filter((K) => K.status !== "completed").map((K) => K.id));
    return A.find((K) => {
        if (K.status !== "pending") return !1;
        if (K.owner) return !1;
        return K.blockedBy.every((Y) => !q.has(Y))
    })
}

// READABLE (for understanding):
function findNextAvailableTask(tasks) {
    let nonCompletedIds = new Set(
        tasks.filter(t => t.status !== "completed").map(t => t.id)
    );
    return tasks.find(task => {
        if (task.status !== "pending") return false;   // only pending tasks
        if (task.owner) return false;                   // must be unclaimed
        return task.blockedBy.every(dep => !nonCompletedIds.has(dep)); // all deps completed
    });
}

// Mapping: JNY->findNextAvailableTask
```

```javascript
// ============================================
// claimUnclaimedTask - Claim next available task and return prompt
// Location: chunks.134.mjs:1464-1481
// ============================================

// ORIGINAL (for source lookup):
async function Ji4(A, q) {
    try {
        let K = await DX(A),
            Y = JNY(K);
        if (!Y) return;
        let z = await OT8(A, Y.id, q);
        if (!z.success) { k(`Failed to claim task #${Y.id}: ${z.reason}`); return }
        return await WI(A, Y.id, { status: "in_progress" }),
            k(`Claimed task #${Y.id}: ${Y.subject}`),
            MNY(Y)
    } catch (K) { k(`Error checking task list: ${K}`); return }
}

// READABLE (for understanding):
async function claimUnclaimedTask(taskListPath, agentName) {
    try {
        let tasks = await readTaskList(taskListPath);
        let nextTask = findNextAvailableTask(tasks);
        if (!nextTask) return;
        let claimResult = await claimTask(taskListPath, nextTask.id, agentName);
        if (!claimResult.success) {
            log(`Failed to claim task #${nextTask.id}: ${claimResult.reason}`);
            return;
        }
        await updateTask(taskListPath, nextTask.id, { status: "in_progress" });
        log(`Claimed task #${nextTask.id}: ${nextTask.subject}`);
        return generatePromptFromTask(nextTask);
    } catch (error) {
        log(`Error checking task list: ${error}`);
        return;
    }
}

// Mapping: Ji4->claimUnclaimedTask, DX->readTaskList, JNY->findNextAvailableTask,
//          OT8->claimTask, WI->updateTask, MNY->generatePromptFromTask
```

---

## H. Permission Sync

### Overview

When a teammate needs to use a tool that requires permission (e.g., writing files, running bash commands), it cannot prompt the user directly (it may be an in-process agent with no terminal). Instead, it sends a permission request to the team lead via the mailbox, and the lead either prompts the user or auto-approves based on policy.

```
Teammate (Worker)                    Team Lead
    |                                    |
    |-- buildPermissionRequest() ------->|
    |   via sendPermissionRequest()      |
    |   (written to lead's mailbox)      |
    |                                    |-- Display to user or auto-approve
    |                                    |
    |<-- sendPermissionResponse() -------|
    |   via writeToMailbox()             |
    |                                    |
    |-- Poll mailbox for response ------>|
    |   via SwarmPermissionPoller        |
```

### createPermissionRequest (SN1)

**What it does:** Constructs a permission request object with all metadata needed for the leader to make a decision.

```javascript
// ============================================
// createPermissionRequest - Build permission request with worker identity
// Location: chunks.134.mjs:950-972
// ============================================

// ORIGINAL (for source lookup):
function SN1(A) {
    let q = A.teamName || l5(),
        K = A.workerId || nM(),
        Y = A.workerName || i3(),
        z = A.workerColor || H$();
    if (!q) throw Error("Team name is required for permission requests");
    if (!K) throw Error("Worker ID is required for permission requests");
    if (!Y) throw Error("Worker name is required for permission requests");
    return {
        id: zNY(), workerId: K, workerName: Y, workerColor: z, teamName: q,
        toolName: A.toolName, toolUseId: A.toolUseId, description: A.description,
        input: A.input, permissionSuggestions: A.permissionSuggestions || [],
        status: "pending", createdAt: Date.now()
    }
}

// READABLE (for understanding):
function createPermissionRequest(params) {
    let teamName = params.teamName || getTeamName();
    let workerId = params.workerId || getAgentId();
    let workerName = params.workerName || getAgentName();
    let workerColor = params.workerColor || getTeammateColor();
    if (!teamName) throw Error("Team name is required");
    if (!workerId) throw Error("Worker ID is required");
    if (!workerName) throw Error("Worker name is required");
    return {
        id: generatePermissionRequestId(),
        workerId, workerName, workerColor, teamName,
        toolName: params.toolName,
        toolUseId: params.toolUseId,
        description: params.description,
        input: params.input,
        permissionSuggestions: params.permissionSuggestions || [],
        status: "pending",
        createdAt: Date.now()
    };
}

// Mapping: SN1->createPermissionRequest, zNY->generatePermissionRequestId,
//          l5->getTeamName, nM->getAgentId, i3->getAgentName, H$->getTeammateColor
```

### sendPermissionRequest (CN1)

**What it does:** Sends a permission request to the team lead via the mailbox system.

**How it works:**
1. Resolves the leader's name from the team config via `ol4()` (looks up `leadAgentId` in config, returns the member's name)
2. Builds the permission request message via `Xx8()` (buildPermissionRequest)
3. Writes to the leader's mailbox via `x3()` (writeToMailbox)

```javascript
// ============================================
// sendPermissionRequest - Send permission request to leader via mailbox
// Location: chunks.134.mjs:1005-1028
// ============================================

// ORIGINAL (for source lookup):
async function CN1(A) {
    let q = await ol4(A.teamName);
    if (!q) return k("[PermissionSync] Cannot send: leader name not found"), !1;
    try {
        let K = Xx8({
            request_id: A.id, agent_id: A.workerName, tool_name: A.toolName,
            tool_use_id: A.toolUseId, description: A.description, input: A.input,
            permission_suggestions: A.permissionSuggestions
        });
        return await x3(q, { from: A.workerName, text: B6(K), timestamp: new Date().toISOString(), color: A.workerColor }, A.teamName), !0
    } catch (K) { return _6(K), !1 }
}

// READABLE (for understanding):
async function sendPermissionRequest(request) {
    let leaderName = await findLeaderName(request.teamName);
    if (!leaderName) {
        log("[PermissionSync] Cannot send: leader name not found");
        return false;
    }
    try {
        let permMessage = buildPermissionRequest({
            request_id: request.id, agent_id: request.workerName,
            tool_name: request.toolName, tool_use_id: request.toolUseId,
            description: request.description, input: request.input,
            permission_suggestions: request.permissionSuggestions
        });
        await writeToMailbox(leaderName, {
            from: request.workerName,
            text: JSON.stringify(permMessage),
            timestamp: new Date().toISOString(),
            color: request.workerColor
        }, request.teamName);
        return true;
    } catch (error) {
        reportError(error);
        return false;
    }
}

// Mapping: CN1->sendPermissionRequest, ol4->findLeaderName, Xx8->buildPermissionRequest,
//          x3->writeToMailbox, B6->JSON.stringify
```

### sendPermissionResponse (IN1)

**What it does:** Sends the leader's permission decision back to the worker.

```javascript
// ============================================
// sendPermissionResponse - Send permission decision to worker
// Location: chunks.134.mjs:1028-1050
// ============================================

// ORIGINAL (for source lookup):
async function IN1(A, q, K, Y) {
    let z = Y || l5();
    if (!z) return !1;
    try {
        let _ = Px8({
                request_id: K,
                subtype: q.decision === "approved" ? "success" : "error",
                error: q.feedback,
                updated_input: q.updatedInput,
                permission_updates: q.permissionUpdates
            }),
            w = i3() || "team-lead";
        return await x3(A, { from: w, text: B6(_), timestamp: new Date().toISOString() }, z), !0
    } catch (_) { return _6(_), !1 }
}

// READABLE (for understanding):
async function sendPermissionResponse(workerName, decision, requestId, teamName) {
    let resolvedTeamName = teamName || getTeamName();
    if (!resolvedTeamName) return false;
    try {
        let response = buildPermissionResponse({
            request_id: requestId,
            subtype: decision.decision === "approved" ? "success" : "error",
            error: decision.feedback,
            updated_input: decision.updatedInput,
            permission_updates: decision.permissionUpdates
        });
        let senderName = getAgentName() || "team-lead";
        await writeToMailbox(workerName, {
            from: senderName,
            text: JSON.stringify(response),
            timestamp: new Date().toISOString()
        }, resolvedTeamName);
        return true;
    } catch (error) {
        reportError(error);
        return false;
    }
}

// Mapping: IN1->sendPermissionResponse, Px8->buildPermissionResponse
```

### Sandbox Permission Request/Response (sl4 / tl4)

These follow the same pattern as regular permissions but for sandbox-level host access:

- `sl4` (sendSandboxPermissionRequest) - Worker sends to leader: "Can I access host X?"
- `tl4` (sendSandboxPermissionResponse) - Leader responds with allow/deny

### SwarmPermissionPoller (bN1 / el4 / If6)

A callback-based system for polling permission responses:
- `bN1` (registerCallback) - Registers a callback for a specific requestId in `Cf6` (Map)
- `el4` (unregisterCallback) - Removes a callback
- `Ai4` (hasCallback) - Checks if a callback is registered

The poller runs alongside the main polling loop, checking for permission responses in the mailbox.

### Permission Queue UI ($NY)

**What it does:** `$NY` at line 1212 is a function that creates a `canUseTool` callback for in-process teammates. It integrates the permission sync system with the agent loop's tool execution.

When a tool requires permission:
1. The `canUseTool` callback creates a permission request via `SN1`
2. Sends it to the leader via `CN1`
3. Registers a response callback via `bN1`
4. Waits for the response (polling the mailbox)
5. Returns the decision to the tool execution engine

---

## I. Agent Loop Startup

### inProcessAgentRunner (XNY) - Build and run teammate agent loop

**What it does:** Constructs the complete execution context for an in-process teammate and runs the agent loop.

**How it works:**
1. **Build identity**: Assembles agent identity object with `isTeamLead: false` and `agentType: "teammate"`
2. **Construct system prompt**:
   - If `systemPromptMode === "replace"` and a custom systemPrompt is provided, uses it directly
   - Otherwise, builds from base prompts via `R0()` + teammate communication instructions (`tx8`) + optional agent definition system prompt + optional append system prompt
3. **Create agent definition**: Builds an agent definition with the assembled system prompt, tool list, and model
4. **Initialize conversation**: Creates first message from team-lead prompt via `Ku8("team-lead", prompt, ...)`
5. **Run agent loop**: Enters a while loop that:
   - Processes the current prompt through the LLM via `qh()` (agent loop iterator)
   - Checks token count against limits, triggers compaction if needed
   - On completion, enters the poll loop (`DNY`) to wait for next message
   - On new message, constructs a new prompt and loops back

**Key insight:** The system prompt is constructed with `tx8` (teammate communication instructions) appended AFTER the base system prompts. This means every teammate gets the "you are an agent in a team, use SendMessage tool" instruction regardless of what custom system prompt is provided (unless `replace` mode is used).

```javascript
// ============================================
// inProcessAgentRunner - Build and start in-process teammate loop
// Location: chunks.134.mjs:1571-1620 (partial - setup section)
// ============================================

// ORIGINAL (for source lookup):
async function XNY(A) {
    let { identity: q, taskId: K, prompt: Y, description: z, agentDefinition: _, teammateContext: w,
          toolUseContext: O, abortController: $, model: H, systemPrompt: j, systemPromptMode: J,
          allowedTools: M, allowPermissionPrompts: D } = A,
        { setAppState: X } = O;
    let P = { agentId: q.agentId, parentSessionId: q.parentSessionId, agentName: q.agentName,
              teamName: q.teamName, agentColor: q.color, planModeRequired: q.planModeRequired,
              isTeamLead: !1, agentType: "teammate" }, W;
    if (J === "replace" && j) W = j;
    else {
        let L = [...await R0(O.options.tools, O.options.mainLoopModel, void 0, O.options.mcpClients), tx8];
        if (_) {
            let h = _.getSystemPrompt();
            if (h) L.push(`\n# Custom Agent Instructions\n${h}`);
        }
        if (J === "append" && j) L.push(j);
        W = L.join("\n")
    }
    // ... builds agent definition, enters main loop ...
}

// READABLE (for understanding):
async function inProcessAgentRunner(params) {
    let { identity, taskId, prompt, description, agentDefinition, teammateContext,
          toolUseContext, abortController, model, systemPrompt, systemPromptMode,
          allowedTools, allowPermissionPrompts } = params;
    let { setAppState } = toolUseContext;

    // Build teammate identity (always non-lead)
    let agentIdentity = {
        agentId: identity.agentId, parentSessionId: identity.parentSessionId,
        agentName: identity.agentName, teamName: identity.teamName,
        agentColor: identity.color, planModeRequired: identity.planModeRequired,
        isTeamLead: false, agentType: "teammate"
    };

    // Construct system prompt
    let fullSystemPrompt;
    if (systemPromptMode === "replace" && systemPrompt) {
        fullSystemPrompt = systemPrompt;
    } else {
        let prompts = [
            ...await buildBaseSystemPrompts(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, undefined, toolUseContext.options.mcpClients),
            TEAMMATE_COMMUNICATION_INSTRUCTIONS  // tx8
        ];
        if (agentDefinition) {
            let customPrompt = agentDefinition.getSystemPrompt();
            if (customPrompt) prompts.push(`\n# Custom Agent Instructions\n${customPrompt}`);
        }
        if (systemPromptMode === "append" && systemPrompt) prompts.push(systemPrompt);
        fullSystemPrompt = prompts.join("\n");
    }

    // ... build agent definition, create initial message, enter main loop ...
}

// Mapping: XNY->inProcessAgentRunner, R0->buildBaseSystemPrompts, tx8->TEAMMATE_COMMUNICATION_INSTRUCTIONS,
//          Ku8->createTeamLeadMessage
```

---

## J. System Prompts

### Teammate Communication Instructions (tx8)

**What it does:** A system prompt fragment injected into every teammate's system prompt. It instructs the LLM to use the SendMessage tool for all inter-agent communication.

**How it works:** This is a static string constant at chunks.134.mjs:930 that gets appended to the base system prompts.

```javascript
// ============================================
// TEAMMATE_COMMUNICATION_INSTRUCTIONS - Communication rules for teammates
// Location: chunks.134.mjs:930-940
// ============================================

// ORIGINAL (for source lookup):
tx8 = `
# Agent Teammate Communication

IMPORTANT: You are running as an agent in a team. To communicate with anyone on your team:
- Use the SendMessage tool with \`to: "<name>"\` to send messages to specific teammates
- Use the SendMessage tool with \`to: "*"\` sparingly for team-wide broadcasts

Just writing a response in text is not visible to others on your team - you MUST use the SendMessage tool.

The user interacts primarily with the team lead. Your work is coordinated through the task system and teammate messaging.
`

// READABLE (for understanding):
TEAMMATE_COMMUNICATION_INSTRUCTIONS = `
# Agent Teammate Communication

IMPORTANT: You are running as an agent in a team. To communicate with anyone on your team:
- Use the SendMessage tool with \`to: "<name>"\` to send messages to specific teammates
- Use the SendMessage tool with \`to: "*"\` sparingly for team-wide broadcasts

Just writing a response in text is not visible to others on your team - you MUST use the SendMessage tool.

The user interacts primarily with the team lead. Your work is coordinated through the task system and teammate messaging.
`

// Mapping: tx8->TEAMMATE_COMMUNICATION_INSTRUCTIONS
```

**Key insight:** The instruction "Just writing a response in text is not visible to others" is critical. Without it, the LLM might generate conversational text assuming teammates can "hear" it. The explicit emphasis forces tool use for all communication.

---

## K. Team Context System Reminder

### team_context Attachment

**What it does:** A one-time system reminder injected at the start of a teammate's conversation. It provides the agent with awareness of its team identity and configuration paths.

**Contents:** Team name, agent name, team config path, task list path, "team-lead" reference

**Injection:** Once at conversation start via attachment assembly

### teammate_mailbox Attachment

**What it does:** A per-turn attachment that contains unread mailbox messages, injected via `Hz("teammate_mailbox", ...)`.

**Key insight:** Unlike most system reminders which are wrapped in `<system-reminder>` XML tags, the mailbox attachment is injected WITHOUT the XML wrapper. This is a unique behavior -- the function `normalizeAttachmentForAPI` (`Ui8`, chunks.174.mjs) handles this special case by checking the attachment type. The rationale is likely that mailbox content is already XML-formatted (via `HTY` / formatMessagesAsXML with `<teammate_message>` tags), so adding another XML wrapper would be redundant.

---

## L. Backend Implementations

### ITermBackend (Xu8) - chunks.135.mjs:11

**What it does:** Manages panes using iTerm2's proprietary `it2` CLI tool for session splitting and command execution.

**Key operations:**
- `split`: `it2 session split` to create a new pane
- `run`: `it2 session run` to execute commands in a pane
- `close`: `it2 session close` to terminate a pane

### TmuxBackend (Ju8) - chunks.134.mjs:2411

**What it does:** Manages panes using standard tmux commands.

**Key operations:**
- `send`: `tmux send-keys -t <paneId> <command> Enter`
- `kill`: `tmux kill-pane -t <paneId>`

### PaneBackendExecutor (Ti4) - chunks.134.mjs:2143

**What it does:** Orchestrates spawn, send, and terminate operations across backends. It abstracts the backend-specific details behind a common interface.

### Backend Detection

The system detects the available backend at runtime:

- `k66()` - Combined check that returns `{needsIt2Setup, backend}` object
- `Ui4()` (isInsideTmux) - Checks if the current process is running inside a tmux session
- `OI` (isRunningInsideTmux) - Checks `TMUX` environment variable
- `j51` (isRunningInIterm2) - Checks `TERM_PROGRAM === "iTerm.app"`
- `Kt` (isTmuxInstalled) - Checks if `tmux` binary is available
- `xQ1` (isIt2CliInstalled) - Checks if `it2` CLI is available

**Decision tree:**
1. If iTerm2 is running AND `it2` CLI is installed -> iTerm2 backend
2. If tmux is installed -> tmux backend
3. If neither -> in-process fallback (no pane-based spawning possible)

---

## M. UI Components

### Team Status Renderer (gZ1) - chunks.113.mjs:1616

**What it does:** Renders the team status tree in the TUI showing the team lead and all running teammates with their current state.

**How it works:**
1. Reads tasks from AppState via `M1()` (useStore)
2. Filters to running in-process teammate tasks
3. Sorts alphabetically by agent name
4. Renders a tree structure:
   - Team lead at top with `"╒═"` (selected) or `"┌─"` (not selected) prefix
   - Each teammate below with connection lines
   - Shows current activity verb, idle text, and token count
5. Selection mode: Up/Down arrows navigate, Enter selects to view

**Visual layout:**

```
   ╒═ team-lead: thinking...  · 15,234 tokens
   ├─ backend-dev: editing file...  · 8,721 tokens
   ├─ frontend-dev: idle  · 3,456 tokens
   └─ tester: running tests...  · 5,678 tokens
```

### showTeammateMessagePreview

Toggled via `Ctrl+Shift+O`, stored in AppState as `showTeammateMessagePreview`. When active, shows a preview of the latest message from each teammate in the tree view.

### Agent Tab (qGz) - chunks.192.mjs (NEW in v2.1.76)

A dedicated agent tab component that provides:
- Selected/viewed/idle state visualization
- `Ctrl+F` to filter and kill agents
- CJK layout fix for proper character width handling
- `background: true` flag support in team definitions

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions documented in this analysis:

**Feature Gate (chunks.50.mjs):**
- `isAgentTeamsEnabled` (E7) - Dual env var + feature flag check
- `hasAgentTeamsCliFlag` (pG3) - Checks `--agent-teams` in argv

**Spawn Routing (chunks.135.mjs):**
- `spawnTeammateDispatcher` (pNY) - Route to backend
- `spawnTeammate` (qn4) - Public entry point
- `spawnSplitPaneTeammate` (BNY) - Tmux split-pane spawn
- `spawnTmuxTeammate` (gNY) - Tmux separate-window spawn
- `spawnInProcessTeammate` (FNY) - In-process spawn
- `deduplicateName` (hu8) - Append -2, -3 suffixes
- `registerTeammateTracking` (An4) - Register in AppState

**Team Config (chunks.135.mjs):**
- `getTeamDirectoryPath` (ei4) - Resolve config directory
- `readTeamConfig` (Kz6) - Parse config.json
- `writeTeamConfig` (Ru8) - Persist config.json

**Mailbox (chunks.132.mjs):**
- `readMailbox` (wl) - Read all messages
- `readUnreadMessages` (pY6) - Filter to unread
- `writeToMailbox` (x3) - Atomic append with locking
- `markMessageAsReadByIndex` (Vc6) - Mark single message
- `markMessagesAsRead` (kc6) - Bulk mark with verification
- `clearInbox` ($TY) - Overwrite with empty array
- `formatMessagesAsXML` (HTY) - XML formatting for LLM context

**Message Types (chunks.132.mjs):**
- `buildIdleNotification` (Ec6) - Idle notification
- `buildPermissionRequest` (Xx8) - Permission request
- `buildPermissionResponse` (Px8) - Permission response
- `buildSandboxPermissionRequest` (Wx8) - Sandbox permission
- `buildSandboxPermissionResponse` (Zx8) - Sandbox response
- `createShutdownRequest` (Wf6) - Shutdown request
- `createShutdownApprovalResponse` (Gx8) - Shutdown approval
- `createShutdownRejectionResponse` (fx8) - Shutdown rejection

**In-Process Runner (chunks.134.mjs):**
- `pollForNextMessage` (DNY) - 5-level priority polling
- `inProcessAgentRunner` (XNY) - Agent loop builder
- `claimUnclaimedTask` (Ji4) - Task auto-claim
- `findNextAvailableTask` (JNY) - Dependency-aware task finder
- `sleep` (jNY) - Promise-based delay

**Permission Sync (chunks.134.mjs):**
- `createPermissionRequest` (SN1) - Build permission request
- `sendPermissionRequest` (CN1) - Send to leader mailbox
- `sendPermissionResponse` (IN1) - Send decision to worker
- `sendSandboxPermissionRequest` (sl4) - Sandbox permission to leader
- `sendSandboxPermissionResponse` (tl4) - Sandbox decision to worker
- `registerPermissionCallback` (bN1) - Register poll callback
- `unregisterPermissionCallback` (el4) - Remove poll callback

**SendMessage Tool (chunks.145.mjs):**
- `SendMessageTool` (OxY) - Tool definition object
- `handleShutdownApproval` (YxY) - Process shutdown approval
- `handleShutdownRejection` (zxY) - Process shutdown rejection

**Backends:**
- `TmuxBackend` (Ju8) - chunks.134.mjs:2411
- `ITermBackend` (Xu8) - chunks.135.mjs:11
- `InProcessBackend` (Mi4) - chunks.134.mjs:1888

**UI (chunks.113.mjs):**
- `teamStatusRenderer` (gZ1) - Team tree view component
