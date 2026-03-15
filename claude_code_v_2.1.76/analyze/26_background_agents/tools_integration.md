# Background Agents — Tools Integration (Claude Code 2.1.76)

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
1. Uses Zod schema validation for type-safe tool inputs
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
        `Set to true to run this agent in the background. The tool result will include an output_file path.`
    ),
    max_turns: z.number().int().positive().optional()
});

const teamSpawnSchema = z.object({
    name: z.string().optional().describe("Name for the spawned agent"),
    team_name: z.string().optional().describe("Team name for spawning..."),
    mode: permissionModeSchema.optional()
});

const mergedSchema = agentInputSchemaBase.merge(teamSpawnSchema);

const agentInputSchema = memoize(() =>
    BACKGROUND_TASKS_DISABLED
        ? mergedSchema.omit({ run_in_background: true })
        : mergedSchema
);

// Mapping: dEA→agentInputSchemaBase, KP6→BACKGROUND_TASKS_DISABLED, oVY→agentInputSchemaBase,
//   aVY→teamSpawnSchema, xu4→mergedSchema, avA→agentInputSchema
```

**Key insight:** The schema dynamically adjusts based on `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` env var. When disabled, the LLM simply doesn't see the `run_in_background` option, preventing it from even attempting async execution.

### Output Schema: Union of Result Types

**What it does:** Defines three possible output schemas for the Agent tool: completed, async_launched, or error.

The `async_launched` schema includes:
- `status: "async_launched"`
- `agentId: string`
- `description: string`
- `prompt: string`
- `outputFile: string` — Path to the output file for monitoring progress

**Key insight:** The discriminated union via `status` field makes parsing straightforward. By including `outputFile` in the async_launched result, the LLM can monitor progress with its existing Read tool.

### Agent Tool Call — Key Decision Point

The `isAsync` flag controls the entire execution path:

```javascript
// Key decision: sync vs async
const isAsync = (run_in_background === true) && !BACKGROUND_TASKS_DISABLED;
```

When `isAsync = true`:
- `createAsyncTask` is called instead of `createForegroundTask`
- Agent loop runs in a detached context via `p01()` wrapper
- Function returns immediately with `async_launched` status
- `background: true` is set on the task record (v2.1.76)

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
async function* yYz({ input: A, abortController: q, setAppState: K, setToolJSX: Y }) {
    let { command: w, run_in_background: _ } = A;

    async function Z() {
        return (await gj1.spawn({
            command: w, description: H || w, shellCommand: G
        }, { abortController: q, /* ... */ })).backgroundTaskId
    }

    // MODE 1: Explicit background
    if (_ === !0 && !Id1) {
        let B = await Z();
        return c("tengu_bash_command_explicitly_backgrounded", { command_type: z_q(w) }),
            { stdout: "", stderr: "", code: 0, interrupted: !1, backgroundTaskId: B }
    }

    let T = Date.now(), k = T + q_q;  // q_q = BASH_BACKGROUND_TIMEOUT_MS (2000ms)
    while (!0) {
        let m = await Promise.race([f, new Promise((U) => setTimeout(() => U(null), Math.max(0, k - Date.now())))]);
        if (m !== null) return G.cleanup(), m  // Command completed
        if (M) return { stdout: P ? X : "", stderr: "", code: 0, interrupted: !1, backgroundTaskId: M }  // MODE 2
        if (q.signal.aborted && q.signal.reason === "interrupt" && !P) P = !0;
        // MODE 3: Timeout - show background hint
        if (!Id1 && M === void 0 && Date.now() - T >= q_q && Y) { /* spawn background hint UI */ }
    }
}

// READABLE (for understanding):
async function* runShellCommand({ input, abortController, setAppState, setToolJSX }) {
    let { command, description, run_in_background } = input;

    async function spawnBackgroundTask() {
        return (await LocalBashTaskHandler.spawn({
            command, description: description || command, shellCommand
        }, { abortController })).backgroundTaskId;
    }

    // MODE 1: Explicit background - immediate
    if (run_in_background === true && !BACKGROUND_TASKS_DISABLED) {
        let taskId = await spawnBackgroundTask();
        trackEvent("bash_command_explicitly_backgrounded");
        return { stdout: "", stderr: "", code: 0, interrupted: false, backgroundTaskId: taskId };
    }

    let startTime = Date.now();
    let backgroundDeadline = startTime + BASH_BACKGROUND_TIMEOUT_MS;  // 2000ms

    while (true) {
        let result = await Promise.race([
            shellCommandPromise,
            new Promise(resolve => setTimeout(() => resolve(null), Math.max(0, backgroundDeadline - Date.now())))
        ]);

        if (result !== null) return result;  // Command completed

        // MODE 2: User interrupt background
        if (abortController.signal.aborted && abortController.signal.reason === "interrupt") {
            if (backgroundTaskId) return { stdout: "", stderr: "", code: 0, interrupted: false,
                backgroundTaskId, backgroundedByUser: true };
        }

        // MODE 3: Timeout - show background hint after 2 seconds
        if (!BACKGROUND_TASKS_DISABLED && Date.now() - startTime >= 2000 && setToolJSX) {
            // Show UI hint "This command is taking a while. Background it?"
        }
    }
}

// Mapping: yYz→runShellCommand, _→run_in_background, Id1→BACKGROUND_TASKS_DISABLED,
//   q_q→BASH_BACKGROUND_TIMEOUT_MS, gj1→LocalBashTaskHandler, Z→spawnBackgroundTask
```

**Why this approach:**
- **Explicit mode** is simplest — immediate background, no output captured
- **Timeout mode** provides helpful UX — user is prompted to background long-running commands
- **Interrupt mode** preserves work — Ctrl+C backgrounds instead of killing, preserving process state

---

## Deep Analysis: Tool Access Control

Background agents have restricted tool access through a combination of **blocklist** and **allowlist** mechanisms.

### filterToolsForContext

**What it does:** Core function that filters tools for background agents based on blocklist/allowlist rules.

```javascript
// ============================================
// filterToolsForContext - Tool filtering logic
// Location: chunks.90.mjs:2455-2474
// ============================================

// ORIGINAL (for source lookup):
function filterTools({ tools: A, isBuiltIn: q, isAsync: K = !1, permissionMode: Y }) {
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
function filterToolsForContext({ tools, isBuiltIn, isAsync = false, permissionMode }) {
    return tools.filter((tool) => {
        if (tool.name.startsWith("mcp__")) return true;  // MCP tools always allowed
        if (tool.name === "ExitPlanMode" && permissionMode === "plan") return true;
        if (BACKGROUND_AGENT_BLOCKED_TOOLS.has(tool.name)) return false;  // Blocklist
        if (!isBuiltIn && ASYNC_BATCH_TOOLS.has(tool.name)) return false;
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
//   L_6→ASYNC_COMPATIBLE_TOOLS, np7→STRUCTURED_TASK_TOOLS
```

**Key insight:** Uses **deny-by-default** for async contexts. Tools must be explicitly in `ASYNC_COMPATIBLE_TOOLS` to be allowed for background agents.

### Background Agent Blocked Tools (Bj1)

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
    "Task",            // fK  - Could spawn nested background agents
    "AskUserQuestion", // TH  - Would block indefinitely
    "TaskStop"         // bj1 - Background agents shouldn't manage other tasks
]);

// Mapping: uj1→"TaskOutput", bW→"ExitPlanMode", N_6→"EnterPlanMode",
//   fK→"Task", TH→"AskUserQuestion", bj1→"TaskStop"
```

### Async Compatible Tools (L_6)

```javascript
// ============================================
// ASYNC_COMPATIBLE_TOOLS - Allowlist for async/background contexts
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
L_6 = new Set([Jq, JL, cg, s9, xO, Jz, h4, bq, f5, jM, NJ, cD, dM, ...[], iB])

// READABLE (for understanding):
const ASYNC_COMPATIBLE_TOOLS = new Set([
    "Read",             // Jq
    "WebSearch",        // JL
    "TodoWrite",        // cg
    "Grep",             // s9
    "WebFetch",         // xO
    "Glob",             // Jz
    "Bash",             // h4
    "Edit",             // bq
    "Write",            // f5
    "NotebookEdit",     // jM
    "Skill",            // NJ
    "StructuredOutput", // cD
    "ToolSearch",       // dM
    "SendMessage"       // iB
]);

// Mapping: Jq→"Read", JL→"WebSearch", cg→"TodoWrite", s9→"Grep",
//   xO→"WebFetch", Jz→"Glob", h4→"Bash", bq→"Edit", f5→"Write",
//   jM→"NotebookEdit", NJ→"Skill", cD→"StructuredOutput", dM→"ToolSearch", iB→"SendMessage"
```

---

## Deep Analysis: TaskOutput and TaskStop Tools

### TaskOutputTool (kW6)

**What it does:** Retrieves output from a running or completed background task.

**Key parameters:**
- `task_id` - The ID of the task to check
- `block` - Whether to wait for task completion (default: true)
- `timeout` - Maximum time to wait (default: 30000ms)

### TaskStopTool (vW6)

**What it does:** Terminates a running background task. Delegates to the appropriate kill handler based on task type.

```javascript
// ============================================
// TaskStopTool - Tool definition
// Location: chunks.139.mjs:~1537
// ============================================

// ORIGINAL (for source lookup):
vW6 = {
    name: bj1,  // "TaskStop"
    async call({ task_id: A }, q, K, Y, z) {
        let w = await q.getAppState(), H = w.tasks[A];
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
    async call({ task_id }, toolUseContext) {
        let appState = await toolUseContext.getAppState();
        let task = appState.tasks[task_id];

        if (!task) throw Error(`Task not found: ${task_id}`);
        if (task.status !== "running") throw Error(`Task ${task_id} is not running`);

        let killHandler = getKillHandlerForType(task.type);
        if (!killHandler) throw Error(`No kill handler for task type: ${task.type}`);

        await killHandler.kill(task, { setAppState: toolUseContext.setAppState });
        return { success: true, taskId: task_id };
    }
};

// Mapping: vW6→TaskStopTool, OC→TOOL_NAME_TASK_STOP, Vg1→getKillHandlerForType
```

**Key insight:** `getKillHandlerForType` dispatches to the type-specific kill strategy:
- `local_bash` → `LocalBashTaskHandler`
- `local_agent` → `LocalAgentTaskHandler`
- `remote_agent` → `RemoteAgentTaskHandler`

---

## Tool Filtering Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tool Filtering Pipeline                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
            ┌────────────────────────────────┐
            │  Is tool an MCP tool?          │
            │  (name.startsWith("mcp__"))    │
            └────────────┬───────────────────┘
           YES ◄─────────┴─────────► NO
            │                        │
            ▼                        ▼
        ┌───────┐   ┌──────────────────────────────────┐
        │ ALLOW │   │  Is tool in BLOCKED_TOOLS (Bj1)? │
        └───────┘   └────────────┬─────────────────────┘
                  YES ◄──────────┴──────────► NO
                   │                          │
                   ▼                          ▼
               ┌────────┐   ┌─────────────────────────────────┐
               │ BLOCK  │   │  Is isAsync && tool NOT in      │
               └────────┘   │  ASYNC_COMPATIBLE_TOOLS (L_6)?  │
                            └────────────┬────────────────────┘
                              YES ◄──────┴──────► NO
                               │                  │
                               ▼                  ▼
                           ┌────────┐         ┌───────┐
                           │ BLOCK  │         │ ALLOW │
                           └────────┘         └───────┘
```

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
        │ = true            │ = true OR timeout OR Ctrl+C
        ▼                   ▼
┌───────────────────────────────────────────────────────────────┐
│                    Task Creation Layer                        │
│  createAsyncTask (zd7) / createForegroundTask (wd7)           │
│  - Creates AbortController                                    │
│  - Registers in appState.tasks                               │
│  - Initializes output file                                    │
│  - Sets background:true (v2.1.76)                            │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                    Background Execution                        │
│  - Detached agent loop (dR) via p01() wrapper                │
│  - Tool access control (blocklist + allowlist)                │
│  - Progress tracking via updateTaskProgress                   │
│  - Output written to .output file                            │
└────────────────────────────┬──────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ TaskOutputTool│   │ TaskStopTool  │   │ /tasks CLI    │
│   (kW6)       │   │   (vW6)       │   │   Command     │
│ Poll output   │   │ Kill handler  │   │ List/manage   │
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
