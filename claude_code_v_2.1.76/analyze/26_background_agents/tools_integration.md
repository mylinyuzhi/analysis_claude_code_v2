# Background Agents — Tools Integration (Claude Code 2.1.38)

> Analysis of how background agents integrate with the tool system: AgentTool background mode,
> BashTool backgrounding strategies, TaskOutput/TaskStop management tools, and tool whitelists.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `AgentTool` (rj1) - The Agent/Task tool with run_in_background support — `chunks.132.mjs:85`
- `BashTool` (qq/h4) - Shell command tool with three backgrounding modes — `chunks.170.mjs:619`
- `TaskOutputTool` (kW6) - Polls/retrieves background task output — `chunks.139.mjs:~1922`
- `TaskStopTool` (vW6) - Kills a running background task — `chunks.139.mjs:~1537`
- `BACKGROUND_AGENT_BLOCKED_TOOLS` (Bj1) - Tools blocked for background agents — `chunks.89.mjs:876`
- `ASYNC_BATCH_TOOLS` (VjA) - Copy of blocked tools for async batch context — `chunks.89.mjs:876`
- `ASYNC_COMPATIBLE_TOOLS` (L_6) - Allowlist for async/background contexts — `chunks.89.mjs:876`
- `createAsyncTask` (zd7) - Creates background task entry with abort controller — `chunks.89.mjs:~1447`
- `createForegroundTask` (wd7) - Creates task entry that may be backgrounded later — `chunks.89.mjs:~1477`
- `LocalBashTaskHandler` (gj1) - Kill handler for shell commands — `chunks.89.mjs:~2012`
- `LocalAgentTaskHandler` (B_6) - Kill handler for local agents — `chunks.89.mjs:~1574`
- `RemoteAgentTaskHandler` (Qi4) - Kill handler for remote sessions — `chunks.142.mjs:~1586`

---

## Overview

Background agents integrate deeply with Claude Code's tool system. Two primary tools support background execution:

1. **AgentTool (`rj1`)** - Launches subagents that can run synchronously or asynchronously
2. **BashTool (`qq`/`h4`)** - Executes shell commands with three distinct backgrounding strategies

Two management tools control background tasks:

3. **TaskOutputTool (`kW6`)** - Polls and retrieves output from running tasks
4. **TaskStopTool (`vW6`)** - Terminates running tasks

---

## Deep Analysis: AgentTool Background Mode

### Tool Schema Definition

**What it does:** Defines the input schema for the Agent/Task tool, including the `run_in_background` option.

**How it works:**
1. Uses Zod schema validation (`u.object()`) for type-safe tool inputs
2. Conditionally omits `run_in_background` if background tasks are disabled via environment variable
3. Merges with team spawn schema for teammate spawning capability

```javascript
// ============================================
// agentInputSchema - Agent tool input schema with background option
// Location: chunks.132.mjs:37-45
// ============================================

// ORIGINAL (for source lookup):
dEA = o(X1(), 1), KP6 = J6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS),
oVY = u.object({
    description: u.string().describe("A short (3-5 word) description of the task"),
    prompt: u.string().describe("The task for the agent to perform"),
    subagent_type: u.string().describe("The type of specialized agent to use for this task"),
    model: u.enum(["sonnet", "opus", "haiku"]).optional().describe(rVY),
    resume: u.string().optional().describe("Optional agent ID to resume from..."),
    run_in_background: u.boolean().optional().describe(`Set to true to run this agent in the background...`),
    max_turns: u.number().int().positive().optional().describe("Maximum number of agentic turns...")
}), aVY = u.object({
    name: u.string().optional().describe("Name for the spawned agent"),
    team_name: u.string().optional().describe("Team name for spawning..."),
    mode: Ew8.optional().describe('Permission mode for spawned teammate...')
}), xu4 = oVY.merge(aVY), avA = z7(() => KP6 ? xu4.omit({
    run_in_background: !0
}) : xu4);

// READABLE (for understanding):
const BACKGROUND_TASKS_DISABLED = parseBoolean(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS);

const agentInputSchemaBase = z.object({
    description: z.string().describe("A short (3-5 word) description of the task"),
    prompt: z.string().describe("The task for the agent to perform"),
    subagent_type: z.string().describe("The type of specialized agent to use for this task"),
    model: z.enum(["sonnet", "opus", "haiku"]).optional(),
    resume: z.string().optional().describe("Optional agent ID to resume from..."),
    run_in_background: z.boolean().optional().describe(
        `Set to true to run this agent in the background. The tool result will include an output_file path - use Read tool or Bash tail to check on output.`
    ),
    max_turns: z.number().int().positive().optional()
});

const teamSpawnSchema = z.object({
    name: z.string().optional().describe("Name for the spawned agent"),
    team_name: z.string().optional().describe("Team name for spawning..."),
    mode: permissionModeSchema.optional()
});

const mergedSchema = agentInputSchemaBase.merge(teamSpawnSchema);

// Dynamic schema based on environment
const agentInputSchema = memoize(() =>
    BACKGROUND_TASKS_DISABLED
        ? mergedSchema.omit({ run_in_background: true })  // No background option
        : mergedSchema
);

// Mapping: dEA→agentInputSchemaBase, KP6→BACKGROUND_TASKS_DISABLED, oVY→agentInputSchemaBase,
//   aVY→teamSpawnSchema, xu4→mergedSchema, avA→agentInputSchema, u→z (Zod),
//   z7→memoize, J6→parseBoolean, o→Object.assign-like merge
```

**Why this approach:**
- **Conditional schema** allows the same codebase to run with or without background task support
- **Merged schema** supports both standalone agent spawning and team teammate spawning
- **Description strings** serve as inline documentation for LLMs using the tool

**Key insight:** The schema dynamically adjusts based on `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` env var. When disabled, the LLM simply doesn't see the `run_in_background` option, preventing it from even attempting async execution.

### Output Schema: Union of Result Types

**What it does:** Defines three possible output schemas for the Agent tool: completed, async_launched, or error.

```javascript
// ============================================
// agentOutputSchema - Union type for agent results
// Location: chunks.132.mjs:51-84
// ============================================

// ORIGINAL (for source lookup):
sVY = u.object({
    agentId: u.string(),
    content: u.array(u.object({
        type: u.literal("text"),
        text: u.string()
    })),
    totalToolUseCount: u.number(),
    totalDurationMs: u.number(),
    totalTokens: u.number(),
    usage: u.object({
        input_tokens: u.number(),
        output_tokens: u.number(),
        cache_creation_input_tokens: u.number().nullable(),
        cache_read_input_tokens: u.number().nullable(),
        server_tool_use: u.object({
            web_search_requests: u.number(),
            web_fetch_requests: u.number()
        }).nullable(),
        service_tier: u.enum(["standard", "priority", "batch"]).nullable(),
        cache_creation: u.object({
            ephemeral_1h_input_tokens: u.number(),
            ephemeral_5m_input_tokens: u.number()
        }).nullable()
    })
}), tVY = sVY.extend({
    status: u.literal("completed"),
    prompt: u.string()
}), eVY = u.object({
    status: u.literal("async_launched"),
    agentId: u.string().describe("The ID of the async agent"),
    description: u.string().describe("The description of the task"),
    prompt: u.string().describe("The prompt for the agent"),
    outputFile: u.string().describe("Path to the output file for checking agent progress")
}), ANY = z7(() => u.union([tVY, eVY, Vn7]));

// READABLE (for understanding):
const agentResultBaseSchema = z.object({
    agentId: z.string(),
    content: z.array(z.object({
        type: z.literal("text"),
        text: z.string()
    })),
    totalToolUseCount: z.number(),
    totalDurationMs: z.number(),
    totalTokens: z.number(),
    usage: z.object({
        input_tokens: z.number(),
        output_tokens: z.number(),
        // ... full usage tracking
    })
});

const completedResultSchema = agentResultBaseSchema.extend({
    status: z.literal("completed"),
    prompt: z.string()
});

const asyncLaunchedResultSchema = z.object({
    status: z.literal("async_launched"),
    agentId: z.string(),
    description: z.string(),
    prompt: z.string(),
    outputFile: z.string()  // Key: path to check progress
});

const agentOutputSchema = memoize(() =>
    z.union([completedResultSchema, asyncLaunchedResultSchema, errorSchema])
);

// Mapping: sVY→agentResultBaseSchema, tVY→completedResultSchema, eVY→asyncLaunchedResultSchema,
//   ANY→agentOutputSchema, Vn7→errorSchema
```

**Why this approach:**
- **Union type** elegantly handles three mutually exclusive outcomes
- **Discriminated union** via `status` field makes parsing straightforward
- **Output file path** in async_launched gives the LLM a direct way to monitor progress

### Agent Tool Call Implementation

**What it does:** The main `call()` function for AgentTool that handles both sync and async agent spawning.

**How it works:**
1. Validates team spawning permissions
2. Checks if in-process teammate is trying to spawn background agent (forbidden)
3. Resolves agent type and model
4. Forks context messages for context-preserving agents
5. Determines sync vs async execution based on `run_in_background` and env var
6. Creates task entry and launches agent loop

```javascript
// ============================================
// AgentTool.call - Main agent tool implementation
// Location: chunks.132.mjs:113-250
// ============================================

// ORIGINAL (for source lookup):
async call({
    prompt: A,
    subagent_type: q,
    description: K,
    model: Y,
    resume: z,
    run_in_background: w,
    max_turns: H,
    name: $,
    team_name: O,
    mode: _
}, J, X, D, j) {
    let M = Date.now(),
        P = await J.getAppState(),
        W = P.toolPermissionContext.mode;
    if (O && !l8()) throw Error("Agent Teams is not yet available on your plan.");
    let G = KNY({ team_name: O }, P);
    if (MM() && G) {
        if ($) throw Error("In-process teammates cannot spawn other teammates...");
        if (w === !0) throw Error("In-process teammates cannot spawn background agents...")
    }
    // ... teammate spawning path ...
    let T = N.find((r) => r.agentType === q);
    // ... agent validation ...
    let U = (w === !0 || g) && !KP6,  // isAsync flag
        x = { ...P.toolPermissionContext, mode: T.permissionMode ?? "acceptEdits" },
        p = YP6(x, P.mcp.tools),  // availableTools
        l = {
            agentDefinition: T,
            promptMessages: y ? [...y, ...m] : m,
            toolUseContext: J,
            canUseTool: X,
            forkContextMessages: B,
            isAsync: U,
            ...g ? { canShowPermissionPrompts: !0 } : {},
            querySource: J.options.querySource ?? fb4(T.agentType, iD(T)),
            model: Y,
            maxTurns: H,
            override: S ? { systemPrompt: S } : void 0,
            availableTools: p
        };
    // ... execution dispatch ...
}

// READABLE (for understanding):
async call({
    prompt, subagent_type, description, model, resume,
    run_in_background, max_turns, name, team_name, mode
}, toolUseContext, canUseTool, forkContextMessages, querySource) {
    let startTime = Date.now();
    let appState = await toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;

    // Team feature check
    if (team_name && !isAgentTeamsEnabled()) {
        throw Error("Agent Teams is not yet available on your plan.");
    }

    let resolvedTeamName = resolveTeamName({ team_name }, appState);

    // In-process teammate restriction
    if (isInProcessTeammate() && resolvedTeamName) {
        if (name) throw Error("In-process teammates cannot spawn other teammates...");
        if (run_in_background === true) {
            throw Error("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.");
        }
    }

    // Teammate spawning path (different from background agent)
    if (resolvedTeamName && name) {
        let result = await spawnTeammate({
            name, prompt, description, team_name: resolvedTeamName,
            use_splitpane: true, plan_mode_required: mode === "plan",
            model, agent_type: subagent_type
        }, toolUseContext);
        return { data: { status: "teammate_spawned", prompt, ...result.data } };
    }

    // Agent type resolution
    let agentDef = availableAgents.find(a => a.agentType === subagent_type);
    // ... validation ...

    // Key decision: sync vs async
    let isAsync = (run_in_background === true) && !BACKGROUND_TASKS_DISABLED;

    // Tool permission context for subagent
    let subagentPermissionContext = {
        ...appState.toolPermissionContext,
        mode: agentDef.permissionMode ?? "acceptEdits"
    };

    let availableTools = assembleSessionToolSet(subagentPermissionContext, appState.mcp.tools);

    let agentConfig = {
        agentDefinition: agentDef,
        promptMessages: resume ? [...loadedTranscript, ...newMessages] : [createUserMessage({ content: prompt })],
        toolUseContext,
        canUseTool,
        forkContextMessages: agentDef.forkContext ? toolUseContext.messages : undefined,
        isAsync,
        querySource: toolUseContext.options.querySource ?? getQuerySource(agentDef.agentType, isBuiltIn(agentDef)),
        model,
        maxTurns: max_turns,
        override: systemPrompt ? { systemPrompt } : undefined,
        availableTools
    };

    // ... execution dispatch ...
}

// Mapping: w→run_in_background, KP6→BACKGROUND_TASKS_DISABLED, U→isAsync,
//   l→agentConfig, p→availableTools, YP6→assembleSessionToolSet, MM→isInProcessTeammate
```

**Key insight:** The `isAsync` flag controls the entire execution path. When `true`:
- `createAsyncTask` is called instead of `createForegroundTask`
- Agent loop runs in a detached context via `p01()` wrapper
- Function returns immediately with `async_launched` status

---

## Deep Analysis: BashTool Background Modes

### Three Backgrounding Strategies

**What they are:**
1. **Explicit Background** - `run_in_background: true` parameter
2. **Timeout Background** - Auto-background after 2 seconds of no completion
3. **User Interrupt Background** - Ctrl+C during execution sends to background instead of killing

```javascript
// ============================================
// runShellCommand - Bash tool with three background modes
// Location: chunks.170.mjs:364-450
// ============================================

// ORIGINAL (for source lookup):
async function* yYz({
    input: A,
    abortController: q,
    setAppState: K,
    setToolJSX: Y,
    preventCwdChanges: z
}) {
    let {
        command: w,
        description: H,
        timeout: $,
        shellExecutable: O,
        run_in_background: _
    } = A, J = $ || YZ6(), X = "", D = "", j = 0, M = void 0, P = !1,
        W = !Id1 && LYz(w),
        G = await bW6(w, q.signal, J, O, (B, S, m) => {
            D = B, X = S, j = m
        }, z, Sc(A), W), f = G.result;

    async function Z() {
        return (await gj1.spawn({
            command: w,
            description: H || w,
            shellCommand: G
        }, {
            abortController: q,
            // ...
        })).backgroundTaskId
    }

    // MODE 1: Explicit background
    if (_ === !0 && !Id1) {
        let B = await Z();
        return c("tengu_bash_command_explicitly_backgrounded", {
            command_type: z_q(w)
        }), {
            stdout: "",
            stderr: "",
            code: 0,
            interrupted: !1,
            backgroundTaskId: B
        }
    }

    let T = Date.now(),
        k = T + q_q,  // BASH_BACKGROUND_TIMEOUT_MS (2000ms)
        y = void 0;

    while (!0) {
        let B = Date.now(),
            S = Math.max(0, k - B),
            m = await Promise.race([f, new Promise((U) => setTimeout(() => U(null), S))]);

        if (m !== null) {
            if (y) jd7(y, K);  // Cancel background hint
            return G.cleanup(), m
        }

        // MODE 2: User-interrupted background
        if (M) return {
            stdout: P ? X : "",
            stderr: "",
            code: 0,
            interrupted: !1,
            backgroundTaskId: M
        };

        // Handle Ctrl+C interrupt
        if (q.signal.aborted && q.signal.reason === "interrupt" && !P)
            if (P = !0, !Id1) N("tengu_bash_command_interrupt_backgrounded");
            else G.kill();

        // MODE 3: Timeout background
        if (y) {
            if (G.status === "backgrounded") return {
                stdout: "",
                stderr: "",
                code: 0,
                interrupted: !1,
                backgroundTaskId: y,
                backgroundedByUser: !0
            }
        }

        let b = Date.now() - T,
            g = Math.floor(b / 1000);
        if (!Id1 && M === void 0 && g >= q_q / 1000 && Y) {
            if (!y) y = Xd7({
                command: w,
                description: H || w,
                shellCommand: G
            }, {
                abortController: q,
                // ...
            });
            // ... show background hint UI ...
        }
    }
}

// READABLE (for understanding):
async function* runShellCommand({
    input, abortController, setAppState, setToolJSX, preventCwdChanges
}) {
    let { command, description, timeout, shellExecutable, run_in_background } = input;

    // ... setup shell command ...

    async function spawnBackgroundTask() {
        return (await LocalBashTaskHandler.spawn({
            command, description: description || command, shellCommand
        }, { abortController, /* ... */ })).backgroundTaskId;
    }

    // MODE 1: Explicit background - immediate
    if (run_in_background === true && !BACKGROUND_TASKS_DISABLED) {
        let taskId = await spawnBackgroundTask();
        trackEvent("bash_command_explicitly_backgrounded");
        return {
            stdout: "", stderr: "", code: 0, interrupted: false,
            backgroundTaskId: taskId
        };
    }

    let startTime = Date.now();
    let backgroundDeadline = startTime + BASH_BACKGROUND_TIMEOUT_MS;  // 2000ms
    let explicitBackgroundTaskId = undefined;

    while (true) {
        let elapsed = Date.now() - startTime;
        let remainingMs = Math.max(0, backgroundDeadline - elapsed);

        // Race between command completion and timeout
        let result = await Promise.race([
            shellCommandPromise,
            new Promise(resolve => setTimeout(() => resolve(null), remainingMs))
        ]);

        if (result !== null) {
            // Command completed
            if (explicitBackgroundTaskId) cancelBackgroundHint(explicitBackgroundTaskId, setAppState);
            return result;
        }

        // Check for user interrupt (Ctrl+C -> background)
        if (abortController.signal.aborted && abortController.signal.reason === "interrupt") {
            // MODE 2: User chose to background
            if (backgroundTaskId) {
                return {
                    stdout: "", stderr: "", code: 0, interrupted: false,
                    backgroundTaskId: backgroundTaskId,
                    backgroundedByUser: true
                };
            }
        }

        // MODE 3: Timeout - show background hint after 2 seconds
        if (elapsed >= 2000 && setToolJSX) {
            if (!explicitBackgroundTaskId) {
                explicitBackgroundTaskId = createBackgroundTaskEntry({
                    command, description: description || command, shellCommand
                }, { abortController, /* ... */ });
            }
            // Show UI hint "This command is taking a while. Background it?"
        }
    }
}

// Mapping: yYz→runShellCommand, _→run_in_background, Id1→BACKGROUND_TASKS_DISABLED,
//   q_q→BASH_BACKGROUND_TIMEOUT_MS, gj1→LocalBashTaskHandler, Xd7→createBackgroundTaskEntry,
//   Z→spawnBackgroundTask, y→explicitBackgroundTaskId, M→userBackgroundTaskId
```

**Why this approach:**
- **Explicit mode** is simplest - immediate background, no output captured
- **Timeout mode** provides helpful UX - user is prompted to background long-running commands
- **Interrupt mode** preserves work - Ctrl+C backgrounds instead of killing, preserving process state

**Key insight:** The `backgroundedByUser: true` flag in the result tells the UI to show a different message ("Command backgrounded by user" vs "Command running in background").

### Bash Output Schema

```javascript
// ============================================
// bashOutputSchema - Shell command result with background task ID
// Location: chunks.170.mjs:606-618
// ============================================

// ORIGINAL (for source lookup):
vYz = z7(() => u.object({
    stdout: u.string().describe("The standard output of the command"),
    stderr: u.string().describe("The standard error output of the command"),
    rawOutputPath: u.string().optional().describe("Path to raw output file for large MCP tool outputs"),
    interrupted: u.boolean().describe("Whether the command was interrupted"),
    isImage: u.boolean().optional().describe("Flag to indicate if stdout contains image data"),
    backgroundTaskId: u.string().optional().describe("ID of the background task if command is running in background"),
    backgroundedByUser: u.boolean().optional().describe("True if the user manually backgrounded the command with Ctrl+B"),
    dangerouslyDisableSandbox: u.boolean().optional(),
    returnCodeInterpretation: u.string().optional(),
    noOutputExpected: u.boolean().optional(),
    structuredContent: u.array(u.any()).optional()
}));

// READABLE (for understanding):
const bashOutputSchema = memoize(() => z.object({
    stdout: z.string().describe("The standard output of the command"),
    stderr: z.string().describe("The standard error output of the command"),
    rawOutputPath: z.string().optional(),
    interrupted: z.boolean(),
    isImage: z.boolean().optional(),
    backgroundTaskId: z.string().optional().describe("ID if running in background"),
    backgroundedByUser: z.boolean().optional().describe("True if user pressed Ctrl+B"),
    dangerouslyDisableSandbox: z.boolean().optional(),
    returnCodeInterpretation: z.string().optional(),
    noOutputExpected: z.boolean().optional(),
    structuredContent: z.array(z.any()).optional()
}));

// Mapping: vYz→bashOutputSchema
```

---

## Deep Analysis: Tool Access Control

Background agents have restricted tool access through a combination of **blocklist** and **allowlist** mechanisms. This prevents them from blocking on interactive operations while ensuring they can still perform useful work.

### Tool Filtering Function

**What it does:** The core function that filters tools for background agents based on blocklist/allowlist rules.

```javascript
// ============================================
// filterToolsForContext - Tool filtering logic
// Location: chunks.90.mjs:2455-2474
// ============================================

// ORIGINAL (for source lookup):
function filterTools({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z.name === bW && Y === "plan") return !0;
        if (Bj1.has(z.name)) return !1;
        if (!q && VjA.has(z.name)) return !1;
        if (K && !L_6.has(z.name)) {
            if (l8() && MM()) {
                if (z.name === fK) return !0;
                if (np7.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}

// READABLE (for understanding):
function filterToolsForContext({
    tools,
    isBuiltIn,
    isAsync = false,
    permissionMode
}) {
    return tools.filter((tool) => {
        // MCP tools are always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // ExitPlanMode allowed in plan mode
        if (tool.name === "ExitPlanMode" && permissionMode === "plan") return true;

        // RULE 1: Blocklist - These tools are ALWAYS filtered out
        if (BACKGROUND_AGENT_BLOCKED_TOOLS.has(tool.name)) return false;

        // RULE 2: Non-builtin tools in async-batch set are blocked
        if (!isBuiltIn && ASYNC_BATCH_TOOLS.has(tool.name)) return false;

        // RULE 3: Allowlist - When isAsync, tool MUST be in allowlist
        if (isAsync && !ASYNC_COMPATIBLE_TOOLS.has(tool.name)) {
            // Exception: Team/structured task tools
            if (isTeamEnabled() && isInProcessTeammate()) {
                if (tool.name === "Task") return true;
                if (STRUCTURED_TASK_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Bj1→BACKGROUND_AGENT_BLOCKED_TOOLS, VjA→ASYNC_BATCH_TOOLS,
//   L_6→ASYNC_COMPATIBLE_TOOLS, np7→STRUCTURED_TASK_TOOLS, fK→"Task"
```

**Why this approach:**
- **Layered filtering**: Blocklist applied first (hard blocks), then allowlist for async contexts
- **MCP exception**: External tools (mcp__*) are always allowed
- **Team exceptions**: Teammate agents get additional tool access for structured tasks

**Key insight:** The function uses **deny-by-default** for async contexts (`isAsync=true`). Tools must be explicitly in `ASYNC_COMPATIBLE_TOOLS` to be allowed for background agents.

---

### Background Agent Blocked Tools (Bj1)

**What it does:** A **blocklist** of tools that background agents CANNOT use. These tools would cause issues if used in an unattended context.

```javascript
// ============================================
// BACKGROUND_AGENT_BLOCKED_TOOLS - Tools filtered OUT for background agents
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
Bj1 = new Set([uj1, bW, N_6, fK, TH, bj1])

// READABLE (for understanding):
const BACKGROUND_AGENT_BLOCKED_TOOLS = new Set([
    "TaskOutput",      // uj1 - Could create polling loops
    "ExitPlanMode",    // bW  - Requires user approval flow
    "EnterPlanMode",   // N_6 - Requires user approval flow
    "Task",            // fK  - Could spawn more background agents (security risk)
    "AskUserQuestion", // TH  - Would block indefinitely waiting for user
    "TaskStop"         // bj1 - Background agents shouldn't manage other tasks
]);

// Mapping: uj1→"TaskOutput", bW→"ExitPlanMode", N_6→"EnterPlanMode",
//   fK→"Task", TH→"AskUserQuestion", bj1→"TaskStop"
```

**Why each tool is blocked:**

| Tool | Reason for Block |
|------|------------------|
| `TaskOutput` | Background agent could poll itself or other tasks, creating loops |
| `ExitPlanMode` | Requires user interaction to approve the plan |
| `EnterPlanMode` | Requires user interaction to enter and approve plans |
| `Task` | Could spawn nested background agents, creating resource exhaustion |
| `AskUserQuestion` | No user present to answer - would hang indefinitely |
| `TaskStop` | Background agents shouldn't control lifecycle of other tasks |

**Key insight:** This is a **blocklist**, NOT an allowlist. The semantic is: "if tool is in this set, filter it OUT". The original code `if (Bj1.has(z.name)) return !1;` returns `false` to filter the tool.

---

### Async Batch Tools (Vj1)

**What it does:** A copy of the blocklist used in additional filtering for non-builtin agents.

```javascript
// ============================================
// ASYNC_BATCH_TOOLS - Copy of blocked tools for async batch contexts
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
VjA = new Set([...Bj1])

// READABLE (for understanding):
const ASYNC_BATCH_TOOLS = new Set([...BACKGROUND_AGENT_BLOCKED_TOOLS]);

// Contains same tools: TaskOutput, ExitPlanMode, EnterPlanMode, Task, AskUserQuestion, TaskStop

// Mapping: VjA→ASYNC_BATCH_TOOLS
```

**How it's used:** The condition `if (!q && VjA.has(z.name)) return !1;` blocks these tools for **non-builtin** agents (`q = isBuiltIn`). This adds an extra layer of restriction for third-party or custom agent types.

---

### Async Compatible Tools (L_6)

**What it does:** An **allowlist** of tools that background agents CAN use. When `isAsync=true`, a tool MUST be in this set to be available.

```javascript
// ============================================
// ASYNC_COMPATIBLE_TOOLS - Allowlist for async/background contexts
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
L_6 = new Set([Jq, JL, cg, s9, xO, Jz, h4, bq, f5, jM, NJ, cD, dM, ...[], iB])

// READABLE (for understanding):
const ASYNC_COMPATIBLE_TOOLS = new Set([
    "Read",            // Jq - File reading (safe, non-blocking)
    "WebSearch",       // JL - Search the web
    "TodoWrite",       // cg - Task/todo management
    "Grep",            // s9 - Content search
    "WebFetch",        // xO - Web content retrieval
    "Glob",            // Jz - File pattern matching
    "Bash",            // h4 - Shell commands
    "Edit",            // bq - File editing
    "Write",           // f5 - File writing
    "NotebookEdit",    // jM - Jupyter notebook editing
    "Skill",           // NJ - Skill invocation
    "StructuredOutput",// cD - Structured output
    "ToolSearch",      // dM - Tool discovery
    "SendMessage"      // iB - Team messaging
]);

// Mapping: Jq→"Read", JL→"WebSearch", cg→"TodoWrite", s9→"Grep",
//   xO→"WebFetch", Jz→"Glob", h4→"Bash", bq→"Edit", f5→"Write",
//   jM→"NotebookEdit", NJ→"Skill", cD→"StructuredOutput", dM→"ToolSearch", iB→"SendMessage"
```

**Why these tools are allowed:**

| Tool | Why Safe for Background |
|------|------------------------|
| `Read` | Read-only, no side effects |
| `Write` | File creation - common for background tasks |
| `Edit` | File modification - common for background tasks |
| `Grep` | Content search - non-blocking |
| `Glob` | File search - non-blocking |
| `Bash` | Shell commands - core capability |
| `WebFetch` | Network request - async-safe |
| `WebSearch` | Network request - async-safe |
| `TodoWrite` | Task management - useful for tracking |
| `NotebookEdit` | Jupyter editing - file-like operation |
| `Skill` | Skill invocation - controlled execution |
| `StructuredOutput` | Output formatting - non-blocking |
| `ToolSearch` | Discovery - non-blocking |
| `SendMessage` | Team communication - async-safe |

**Key insight:** All these tools are **non-interactive** - they don't require user input to complete. This ensures background agents can make progress unattended.

---

### Tool Access Control Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tool Filtering Pipeline                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
            ┌────────────────────────────────┐
            │  Is tool an MCP tool?          │
            │  (name.startsWith("mcp__"))    │
            └────────────┬───────────────────┘
                         │
           YES ◄─────────┴─────────► NO
            │                        │
            ▼                        ▼
        ┌───────┐     ┌────────────────────────────────┐
        │ ALLOW │     │  Is ExitPlanMode + plan mode?  │
        └───────┘     └────────────┬───────────────────┘
                                    │
                      YES ◄─────────┴─────────► NO
                       │                        │
                       ▼                        ▼
                   ┌───────┐    ┌──────────────────────────────────┐
                   │ ALLOW │    │  Is tool in BLOCKED_TOOLS (Bj1)? │
                   └───────┘    └────────────┬─────────────────────┘
                                             │
                               YES ◄─────────┴─────────► NO
                                │                        │
                                ▼                        ▼
                            ┌────────┐    ┌─────────────────────────────────┐
                            │ BLOCK  │    │  Is isAsync && tool NOT in      │
                            └────────┘    │  ASYNC_COMPATIBLE_TOOLS (L_6)?  │
                                          └────────────┬────────────────────┘
                                                       │
                                         YES ◄─────────┴─────────► NO
                                          │                        │
                                          ▼                        ▼
                                      ┌────────┐              ┌───────┐
                                      │ BLOCK  │              │ ALLOW │
                                      └────────┘              └───────┘
```

**Design rationale:**
- **MCP tools**: External integrations may have their own async handling
- **Plan mode exception**: ExitPlanMode needed to exit plan mode
- **Blocklist (Bj1)**: Tools that would break background execution
- **Allowlist (L_6)**: Only safe tools for async contexts

---

## Deep Analysis: TaskOutput and TaskStop Tools

### TaskOutputTool Structure

**What it does:** Retrieves output from a running or completed background task. Supports both polling and one-time reads.

**Key parameters:**
- `task_id` - The ID of the task to check
- `block` - Whether to wait for task completion (default: true)
- `timeout` - Maximum time to wait (default: 30000ms)

```javascript
// ============================================
// TaskOutputTool - Tool definition
// Location: chunks.139.mjs:~1922
// ============================================

// Tool retrieves background task output, supporting both:
// - Blocking: Wait for task to complete
// - Non-blocking: Get current output snapshot

const TaskOutputTool = {
    name: "TaskOutput",
    inputSchema: z.object({
        task_id: z.string(),
        block: z.boolean().default(true),
        timeout: z.number().default(30000)
    }),
    // ... implementation ...
};

// Mapping: kW6→TaskOutputTool
```

### TaskStopTool Structure

**What it does:** Terminates a running background task. Delegates to the appropriate kill handler based on task type.

**Key parameters:**
- `task_id` - The ID of the task to stop

```javascript
// ============================================
// TaskStopTool - Tool definition
// Location: chunks.139.mjs:~1537
// ============================================

// ORIGINAL (for source lookup):
vW6 = {
    name: bj1,  // "TaskStop"
    inputSchema: dyY,
    outputSchema: cyY,
    async call({ task_id: A }, q, K, Y, z) {
        let w = await q.getAppState(),
            H = w.tasks[A];
        if (!H) throw Error(`Task not found: ${A}`);
        if (H.status !== "running") throw Error(`Task ${A} is not running (status: ${H.status})`);
        let $ = Vg1(H.type);
        if (!$) throw Error(`No kill handler for task type: ${H.type}`);
        await $.kill(H, { setAppState: q.setAppState });
        return { success: !0, taskId: A }
    }
};

// READABLE (for understanding):
const TaskStopTool = {
    name: "TaskStop",
    inputSchema: taskStopInputSchema,
    outputSchema: taskStopOutputSchema,

    async call({ task_id }, toolUseContext, canUseTool, forkContext, querySource) {
        let appState = await toolUseContext.getAppState();
        let task = appState.tasks[task_id];

        if (!task) throw Error(`Task not found: ${task_id}`);
        if (task.status !== "running") {
            throw Error(`Task ${task_id} is not running (status: ${task.status})`);
        }

        // Get appropriate kill handler for task type
        let killHandler = getKillHandlerForType(task.type);
        if (!killHandler) {
            throw Error(`No kill handler for task type: ${task.type}`);
        }

        await killHandler.kill(task, { setAppState: toolUseContext.setAppState });

        return { success: true, taskId: task_id };
    }
};

// Mapping: vW6→TaskStopTool, bj1→TOOL_NAME_TASK_STOP, Vg1→getKillHandlerForType
```

**Key insight:** The `getKillHandlerForType` function returns the appropriate kill strategy based on task type:
- `local_bash` → `LocalBashTaskHandler`
- `local_agent` → `LocalAgentTaskHandler`
- `remote_agent` → `RemoteAgentTaskHandler`

---

## Summary: Tool Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     LLM Tool Use Request                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   AgentTool   │   │   BashTool    │   │   Other Tools │
│   (rj1)       │   │   (qq/h4)     │   │               │
└───────┬───────┘   └───────┬───────┘   └───────────────┘
        │                   │
        │ run_in_background │ run_in_background
        │ = true            │ = true OR timeout
        │                   │ OR Ctrl+C
        ▼                   ▼
┌───────────────────────────────────────────────────────────────┐
│                    Task Creation Layer                        │
│  createAsyncTask (zd7) / createForegroundTask (wd7)           │
│  - Creates AbortController                                    │
│  - Registers in appState.tasks                               │
│  - Initializes output file                                    │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                    Background Execution                        │
│  - Detached agent loop (dR) via p01() wrapper                │
│  - Tool access control:                                        │
│    • BLOCKLIST (Bj1): TaskOutput, ExitPlanMode, EnterPlanMode,│
│      Task, AskUserQuestion, TaskStop                          │
│    • ALLOWLIST (L_6): Read, Write, Edit, Bash, Grep, Glob,   │
│      WebFetch, WebSearch, TodoWrite, Skill, etc.              │
│  - Progress tracking via updateTaskProgress                   │
│  - Output written to .output file                            │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                    Completion Notification                     │
│  notifyTaskCompletion (vK1)                                   │
│  - Injects task-notification into command queue               │
│  - Main loop receives and displays to user                    │
└───────────────────────────────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ TaskOutputTool│   │ TaskStopTool  │   │ /tasks CLI    │
│   (kW6)       │   │   (vW6)       │   │   Command     │
│               │   │               │   │               │
│ Poll output   │   │ Kill handler  │   │ List/manage   │
│ Wait for done │   │ dispatch      │   │ tasks         │
└───────────────┘   └───────────────┘   └───────────────┘
```

---

## Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Conditional schema | Hide `run_in_background` when feature disabled |
| Union output schema | Different return shapes for sync vs async |
| Three bash background modes | Handle explicit, timeout, and interrupt cases |
| Tool blocklist (Bj1) | Block interactive tools that would hang background agents |
| Tool allowlist (L_6) | Only non-blocking tools allowed for async contexts |
| Kill handler dispatch | Different termination strategies per task type |
| Output file path in result | LLM can monitor progress with existing Read tool |