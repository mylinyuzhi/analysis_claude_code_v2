# Background Agents Module (2.1.7)

> **NEW in 2.0.60** - Agents and bash commands running asynchronously
> **Key Change in 2.0.64** - Unified TaskOutput tool replaced separate AgentOutputTool/BashOutputTool

---

## Overview

The Background Agents system allows Claude Code to:
1. Run bash commands in background while user continues working
2. Run sub-agents asynchronously
3. Unify output retrieval via single `TaskOutput` tool
4. Support Ctrl+B to manually background running tasks

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Agent Loop                          │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Bash Tool   │    │ Task Tool   │    │ TaskOutput  │     │
│  │ (run_in_    │    │ (run_in_    │    │ Tool        │     │
│  │  background)│    │  background)│    │             │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                  │             │
│         v                  v                  v             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Background Task Registry                │  │
│  │                                                      │  │
│  │  { task_id: { type, status, output, ... } }          │  │
│  └──────────────────────────────────────────────────────┘  │
│         │                  │                  │             │
│         v                  v                  v             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ local_bash  │    │ local_agent │    │remote_agent │     │
│  │   Process   │    │  Sub-agent  │    │   Session   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## TaskOutput Tool

### Purpose

Unified tool to retrieve output from ANY background task type:
- Background bash commands
- Background sub-agents (Task tool with `run_in_background: true`)
- Remote sessions

### Input Schema

```javascript
// ============================================
// taskOutputInputSchema - Input validation for TaskOutput tool
// Location: chunks.119.mjs:1754-1758
// ============================================

// ORIGINAL (for source lookup):
ap5 = m.strictObject({
  task_id: m.string().describe("The task ID to get output from"),
  block: m.boolean().default(!0).describe("Whether to wait for completion"),
  timeout: m.number().min(0).max(600000).default(30000).describe("Max wait time in ms")
});

// READABLE (for understanding):
taskOutputInputSchema = zod.strictObject({
  task_id: zod.string().describe("The task ID to get output from"),
  block: zod.boolean().default(true).describe("Whether to wait for completion"),
  timeout: zod.number().min(0).max(600000).default(30000).describe("Max wait time in ms")
});

// Mapping: ap5→taskOutputInputSchema, m→zod
```

### Output Formatting

```javascript
// ============================================
// formatTaskOutput - Formats task output for different task types
// Location: chunks.119.mjs:1605-1632
// ============================================

// ORIGINAL (for source lookup):
function YK1(A) {
  let Q = K71(A.id),
    B = {
      task_id: A.id,
      task_type: A.type,
      status: A.status,
      description: A.description,
      output: Q
    };
  if (A.type === "local_bash") return {
    ...B,
    exitCode: A.result?.code ?? null
  };
  if (A.type === "local_agent") {
    let G = A;
    return {
      ...B,
      prompt: G.prompt,
      result: Q,
      error: G.error
    }
  }
  if (A.type === "remote_agent") return {
    ...B,
    prompt: A.command
  };
  return B
}

// READABLE (for understanding):
function formatTaskOutput(task) {
  let outputContent = getTaskOutputContent(task.id);
  let baseOutput = {
    task_id: task.id,
    task_type: task.type,
    status: task.status,
    description: task.description,
    output: outputContent
  };

  if (task.type === "local_bash") {
    return {
      ...baseOutput,
      exitCode: task.result?.code ?? null
    };
  }

  if (task.type === "local_agent") {
    return {
      ...baseOutput,
      prompt: task.prompt,
      result: outputContent,
      error: task.error
    };
  }

  if (task.type === "remote_agent") {
    return {
      ...baseOutput,
      prompt: task.command
    };
  }

  return baseOutput;
}

// Mapping: YK1→formatTaskOutput, A→task, Q→outputContent, B→baseOutput, K71→getTaskOutputContent
```

**Why this approach:**
- Single unified output structure with type-specific extensions
- `local_bash` adds `exitCode` for shell command result
- `local_agent` adds `prompt`, `result`, `error` for sub-agent context
- `remote_agent` adds `prompt` (the command sent)
- Base fields always present: task_id, task_type, status, description, output

### Output Truncation

```javascript
// ============================================
// truncateTaskOutput - Truncates large outputs with reference to full file
// Location: chunks.119.mjs:1582-1597
// ============================================

// ORIGINAL (for source lookup):
function bbA(A, Q) {
  let B = np5();
  if (A.length <= B) return {
    content: A,
    wasTruncated: !1
  };
  let Z = `[Truncated. Full output: ${aY(Q)}]

`,
    Y = B - Z.length,
    J = A.slice(-Y);
  return {
    content: Z + J,
    wasTruncated: !0
  }
}

// READABLE (for understanding):
function truncateTaskOutput(content, outputFilePath) {
  let maxLength = getTaskMaxOutputLength();
  if (content.length <= maxLength) {
    return {
      content: content,
      wasTruncated: false
    };
  }

  let truncationHeader = `[Truncated. Full output: ${formatPath(outputFilePath)}]

`;
  let remainingSpace = maxLength - truncationHeader.length;
  let tailContent = content.slice(-remainingSpace);  // Keep END of output

  return {
    content: truncationHeader + tailContent,
    wasTruncated: true
  };
}

// Mapping: bbA→truncateTaskOutput, A→content, Q→outputFilePath, B→maxLength, np5→getTaskMaxOutputLength, aY→formatPath
```

**Key insight:**
- Keeps the **END** of the output (most recent), not the beginning
- Provides file path reference for full output access
- Controlled by `TASK_MAX_OUTPUT_LENGTH` env var

### Waiting for Task Completion

```javascript
// ============================================
// waitForTaskCompletion - Polls for task completion with timeout
// Location: chunks.119.mjs:1634-1644
// ============================================

// ORIGINAL (for source lookup):
async function op5(A, Q, B, G) {
  let Z = Date.now();
  while (Date.now() - Z < B) {
    if (G?.signal.aborted) throw new aG;
    let X = (await Q()).tasks?.[A];
    if (!X) return null;
    if (X.status !== "running" && X.status !== "pending") return X;
    await new Promise((I) => setTimeout(I, 100))
  }
  return (await Q()).tasks?.[A] ?? null
}

// READABLE (for understanding):
async function waitForTaskCompletion(taskId, getAppState, timeoutMs, abortContext) {
  let startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    // Check for abort signal
    if (abortContext?.signal.aborted) throw new AbortError();

    // Get current task state
    let task = (await getAppState()).tasks?.[taskId];

    // Task not found
    if (!task) return null;

    // Task completed (success or failure)
    if (task.status !== "running" && task.status !== "pending") {
      return task;
    }

    // Poll every 100ms
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Timeout - return current state
  return (await getAppState()).tasks?.[taskId] ?? null;
}

// Mapping: op5→waitForTaskCompletion, A→taskId, Q→getAppState, B→timeoutMs, G→abortContext, aG→AbortError
```

**Polling strategy:**
- 100ms polling interval (balance between responsiveness and CPU usage)
- Respects abort signals for cancellation
- Returns current state on timeout (doesn't fail)
- Completes when status is neither "running" nor "pending"

---

## Task Types

### local_bash

Background shell command execution.

**Output fields:**
- `task_id` - Unique identifier
- `task_type` - "local_bash"
- `status` - "pending" | "running" | "completed" | "failed"
- `description` - Command description
- `output` - stdout content
- `exitCode` - Process exit code (0 = success)

### local_agent

Background sub-agent (Task tool with `run_in_background: true`).

**Output fields:**
- `task_id` - Agent ID
- `task_type` - "local_agent"
- `status` - Task status
- `description` - Agent description
- `output` - Agent final response
- `prompt` - Original prompt sent to agent
- `result` - Agent result content
- `error` - Error message if failed

### remote_agent

Remote session agent (for `/teleport` and remote environments).

**Output fields:**
- `task_id` - Remote session ID
- `task_type` - "remote_agent"
- `status` - Remote task status
- `description` - Task description
- `output` - Remote output
- `prompt` - Command sent to remote

---

## KillShell Tool

Tool to terminate running background bash commands.

```javascript
// ============================================
// KillShell tool name constant
// Location: chunks.119.mjs:1427-1435
// ============================================

// ORIGINAL:
GK1 = "KillShell"
ch2 = `
- Kills a running background bash shell by its ID
- Takes a shell_id parameter identifying the shell to kill
- Returns a success or failure status
- Use this tool when you need to terminate a long-running shell
- Shell IDs can be found using the /tasks command
`

// READABLE:
KILLSHELL_TOOL_NAME = "KillShell"
killShellDescription = `
- Kills a running background bash shell by its ID
- Takes a shell_id parameter identifying the shell to kill
- Returns a success or failure status
- Use this tool when you need to terminate a long-running shell
- Shell IDs can be found using the /tasks command
`

// Mapping: GK1→KILLSHELL_TOOL_NAME, ch2→killShellDescription
```

---

## Ctrl+B Backgrounding

Users can manually background running tasks by pressing Ctrl+B.

### UI Component

```javascript
// ============================================
// BackgroundShellUI - UI for background shell management
// Location: chunks.142.mjs:3133-3180
// ============================================

// ORIGINAL (signature only):
function H59({
  shell: A,
  onDone: Q,
  onKillShell: B,
  onBack: G
}) { ... }

// READABLE:
function BackgroundShellUI({
  shell: shellData,
  onDone: onCompleteCallback,
  onKillShell: onKillCallback,
  onBack: onBackCallback
}) { ... }

// Mapping: H59→BackgroundShellUI, A→shellData, Q→onCompleteCallback, B→onKillCallback, G→onBackCallback
```

### backgroundedByUser Flag

When user manually backgrounds via Ctrl+B, the output includes `backgroundedByUser: true`:

```javascript
// From chunks.124.mjs:1332-1336
{
  code: 0,
  interrupted: false,
  backgroundTaskId: taskId,
  backgroundedByUser: true  // Set when user pressed Ctrl+B
}
```

---

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | Disable all background functionality | false |
| `TASK_MAX_OUTPUT_LENGTH` | Max output length before truncation | (varies) |

---

## Agent Task Lifecycle Functions

These functions manage the lifecycle of background agents (local_agent type).

### Task Notification

```javascript
// ============================================
// createTaskNotification - Notifies main agent of task completion
// Location: chunks.91.mjs:1222-1240
// ============================================

// ORIGINAL (for source lookup):
function C4A(A, Q, B, G, Z, Y) {
  let J = B === "completed" ? `Agent "${Q}" completed` : B === "failed" ? `Agent "${Q}" failed: ${G||"Unknown error"}` : `Agent "${Q}" was stopped`,
    X = aY(A),
    I = Y ? `
<result>${Y}</result>` : "",
    D = `<${zF}>
<${IO}>${A}</${IO}>
<${hz}>${B}</${hz}>
<${gz}>${J}</${gz}>${I}
</${zF}>
Full transcript available at: ${X}`;
  wF({
    value: D,
    mode: "task-notification"
  }, Z), oY(A, Z, (W) => ({
    ...W,
    notified: !0
  }))
}

// READABLE (for understanding):
function createTaskNotification(taskId, description, status, errorMsg, setAppState, result) {
  let message = status === "completed"
    ? `Agent "${description}" completed`
    : status === "failed"
      ? `Agent "${description}" failed: ${errorMsg || "Unknown error"}`
      : `Agent "${description}" was stopped`;

  let transcriptPath = formatOutputPath(taskId);
  let resultXml = result ? `\n<result>${result}</result>` : "";

  let notification = `<task-notification>
<task-id>${taskId}</task-id>
<status>${status}</status>
<message>${message}</message>${resultXml}
</task-notification>
Full transcript available at: ${transcriptPath}`;

  // Push notification to main agent
  pushNotification({
    value: notification,
    mode: "task-notification"
  }, setAppState);

  // Mark task as notified
  updateTask(taskId, setAppState, (task) => ({
    ...task,
    notified: true
  }));
}

// Mapping: C4A→createTaskNotification, zF→"task-notification", IO→"task-id", hz→"status", gz→"message", aY→formatOutputPath, wF→pushNotification, oY→updateTask
```

**Key insight:**
- Creates XML-formatted notification for the main agent
- Includes result content if provided
- Sets `notified: true` flag to prevent duplicate notifications

### Kill Background Task

```javascript
// ============================================
// killBackgroundTask - Terminates a running background task
// Location: chunks.91.mjs:1242-1251
// ============================================

// ORIGINAL (for source lookup):
function $4A(A, Q) {
  oY(A, Q, (B) => {
    if (B.status !== "running") return B;
    return B.abortController?.abort(), B.unregisterCleanup?.(), {
      ...B,
      status: "killed",
      endTime: Date.now()
    }
  })
}

// READABLE (for understanding):
function killBackgroundTask(taskId, setAppState) {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== "running") return task;

    // Abort the task
    task.abortController?.abort();

    // Unregister cleanup handler
    task.unregisterCleanup?.();

    return {
      ...task,
      status: "killed",
      endTime: Date.now()
    };
  });
}

// Mapping: $4A→killBackgroundTask, oY→updateTask
```

### Update Task Progress

```javascript
// ============================================
// updateTaskProgress - Updates progress for running task
// Location: chunks.91.mjs:1253-1261
// ============================================

// ORIGINAL (for source lookup):
function RI0(A, Q, B) {
  oY(A, B, (G) => {
    if (G.status !== "running") return G;
    return {
      ...G,
      progress: Q
    }
  })
}

// READABLE (for understanding):
function updateTaskProgress(taskId, progress, setAppState) {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== "running") return task;
    return {
      ...task,
      progress: progress  // {toolUseCount, tokenCount, lastActivity, recentActivities}
    };
  });
}

// Mapping: RI0→updateTaskProgress, oY→updateTask
```

### Mark Task Completed

```javascript
// ============================================
// markTaskCompleted - Marks task as successfully completed
// Location: chunks.91.mjs:1263-1274
// ============================================

// ORIGINAL (for source lookup):
function _I0(A, Q) {
  let B = A.agentId;
  oY(B, Q, (G) => {
    if (G.status !== "running") return G;
    return G.unregisterCleanup?.(), {
      ...G,
      status: "completed",
      result: A,
      endTime: Date.now()
    }
  })
}

// READABLE (for understanding):
function markTaskCompleted(agentResult, setAppState) {
  let taskId = agentResult.agentId;
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== "running") return task;

    // Unregister cleanup handler
    task.unregisterCleanup?.();

    return {
      ...task,
      status: "completed",
      result: agentResult,
      endTime: Date.now()
    };
  });
}

// Mapping: _I0→markTaskCompleted, oY→updateTask
```

### Mark Task Failed

```javascript
// ============================================
// markTaskFailed - Marks task as failed with error
// Location: chunks.91.mjs:1276-1286
// ============================================

// ORIGINAL (for source lookup):
function jI0(A, Q, B) {
  oY(A, B, (G) => {
    if (G.status !== "running") return G;
    return G.unregisterCleanup?.(), {
      ...G,
      status: "failed",
      error: Q,
      endTime: Date.now()
    }
  })
}

// READABLE (for understanding):
function markTaskFailed(taskId, errorMessage, setAppState) {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== "running") return task;

    // Unregister cleanup handler
    task.unregisterCleanup?.();

    return {
      ...task,
      status: "failed",
      error: errorMessage,
      endTime: Date.now()
    };
  });
}

// Mapping: jI0→markTaskFailed, oY→updateTask
```

---

## Progress Tracking

### Progress Tracker Structure

```javascript
// Progress snapshot structure (from MI0)
{
  toolUseCount: number,        // Total tools used
  tokenCount: number,          // Total tokens consumed
  lastActivity: {              // Most recent activity
    toolName: string,
    input: object
  } | undefined,
  recentActivities: Array<{    // Last 5 activities
    toolName: string,
    input: object
  }>
}
```

### LocalAgentTask Handler

```javascript
// ============================================
// LocalAgentTaskHandler - Task type handler for local agents
// Location: chunks.91.mjs:1412-1482
// ============================================

// ORIGINAL (for source lookup):
kZ1 = {
  name: "LocalAgentTask",
  type: "local_agent",
  async spawn(A, Q) { ... },
  async kill(A, Q) { $4A(A, Q.setAppState) },
  renderStatus(A) { ... },
  renderOutput(A) { ... },
  getProgressMessage(A) {
    let Q = A, B = Q.progress;
    if (!B) return null;
    let G = B.toolUseCount - Q.lastReportedToolCount,
      Z = B.tokenCount - Q.lastReportedTokenCount;
    if (G === 0 && Z === 0) return null;
    let Y = [];
    if (G > 0) Y.push(`${G} new tool${G>1?"s":""} used`);
    if (Z > 0) Y.push(`${Z} new tokens`);
    return `Agent ${A.id} progress: ${Y.join(", ")}. The agent is still running. You usually do not need to read ${A.outputFile} unless you need specific details right away. You will receive a notification when the agent is done.`
  }
}

// READABLE (for understanding):
LocalAgentTaskHandler = {
  name: "LocalAgentTask",
  type: "local_agent",

  async spawn(params, context) {
    // Creates new local_agent task
  },

  async kill(taskId, context) {
    killBackgroundTask(taskId, context.setAppState);
  },

  renderStatus(task) {
    // React component for task status display
  },

  renderOutput(output) {
    // React component for task output display
  },

  getProgressMessage(task) {
    let progress = task.progress;
    if (!progress) return null;

    let newTools = progress.toolUseCount - task.lastReportedToolCount;
    let newTokens = progress.tokenCount - task.lastReportedTokenCount;

    if (newTools === 0 && newTokens === 0) return null;

    let updates = [];
    if (newTools > 0) updates.push(`${newTools} new tool${newTools > 1 ? "s" : ""} used`);
    if (newTokens > 0) updates.push(`${newTokens} new tokens`);

    return `Agent ${task.id} progress: ${updates.join(", ")}. The agent is still running. You usually do not need to read ${task.outputFile} unless you need specific details right away. You will receive a notification when the agent is done.`;
  }
}

// Mapping: kZ1→LocalAgentTaskHandler, $4A→killBackgroundTask
```

**Key insight:**
- `getProgressMessage` provides smart updates to the main agent
- Only reports when there are actual changes (new tools or tokens)
- Advises main agent that it doesn't need to actively poll

---

## Task Type Detection

```javascript
// ============================================
// isLocalAgentTask - Type guard for local_agent tasks
// Location: chunks.91.mjs:1218-1220
// ============================================

// ORIGINAL (for source lookup):
function Sr(A) {
  return typeof A === "object" && A !== null && "type" in A && A.type === "local_agent"
}

// READABLE (for understanding):
function isLocalAgentTask(task) {
  return typeof task === "object" &&
    task !== null &&
    "type" in task &&
    task.type === "local_agent";
}

// Mapping: Sr→isLocalAgentTask
```

---

## Output File Management

Each background agent has an output file for progress tracking.

### Output File Path

```javascript
// ============================================
// formatOutputPath - Generates output file path
// Location: chunks.86.mjs:106-108
// ============================================

// ORIGINAL (for source lookup):
function aY(A) {
  return YY0(eSA(), `${A}.output`)
}

// READABLE (for understanding):
function formatOutputPath(agentId) {
  return path.join(getAgentOutputDir(), `${agentId}.output`);
}

// Mapping: aY→formatOutputPath, YY0→path.join, eSA→getAgentOutputDir
```

**Output directory:** `~/.claude/projects/<cwd-hash>/agents/`

### Writing to Output File

```javascript
// ============================================
// appendToOutputFile - Appends content to agent output file
// Location: chunks.86.mjs:110-131
// ============================================

// ORIGINAL (for source lookup):
function g9A(A, Q) {
  try {
    JY0();  // Ensure output dir exists
    let Y = aY(A),
      J = Ce8(Y);  // Get parent dir
    if (!h9A(J)) W12(J, { recursive: !0 });  // Create parent dir
  } catch (Y) { e(Y); return }
  let B = aY(A),
    Z = (X12.get(A) ?? Promise.resolve()).then(async () => {
      try {
        await $e8(B, Q, "utf8")  // Append content
      } catch (Y) { e(Y) }
    });
  X12.set(A, Z)  // Store promise for sequential writes
}

// READABLE (for understanding):
function appendToOutputFile(agentId, content) {
  try {
    ensureOutputDirExists();
    let outputPath = formatOutputPath(agentId);
    let parentDir = path.dirname(outputPath);
    if (!fileExists(parentDir)) {
      createDirectory(parentDir, { recursive: true });
    }
  } catch (error) {
    logError(error);
    return;
  }

  let outputPath = formatOutputPath(agentId);

  // Chain writes to ensure sequential order
  let writePromise = (pendingWrites.get(agentId) ?? Promise.resolve())
    .then(async () => {
      try {
        await appendFile(outputPath, content, "utf8");
      } catch (error) {
        logError(error);
      }
    });

  pendingWrites.set(agentId, writePromise);
}

// Mapping: g9A→appendToOutputFile, X12→pendingWrites, $e8→appendFile
```

**Key insight:** Writes are chained via Promises to ensure sequential order even for concurrent tool executions.

### Reading Output File

```javascript
// ============================================
// getTaskOutputContent - Reads complete output file
// Location: chunks.86.mjs:157-165
// ============================================

// ORIGINAL (for source lookup):
function K71(A) {
  try {
    let Q = aY(A);
    if (!h9A(Q)) return "";
    return I12(Q, "utf8")
  } catch (Q) { return e(Q), "" }
}

// READABLE (for understanding):
function getTaskOutputContent(agentId) {
  try {
    let outputPath = formatOutputPath(agentId);
    if (!fileExists(outputPath)) return "";
    return readFileSync(outputPath, "utf8");
  } catch (error) {
    logError(error);
    return "";
  }
}

// Mapping: K71→getTaskOutputContent, I12→readFileSync, h9A→fileExists
```

### Registering Output File (Symlink)

```javascript
// ============================================
// registerOutputFile - Creates symlink for transcript
// Location: chunks.86.mjs:174-183
// ============================================

// ORIGINAL (for source lookup):
function OKA(A, Q) {
  try {
    JY0();
    let B = aY(A);
    if (h9A(B)) D12(B);  // Delete existing
    return ze8(Q, B), B  // Create symlink: Q → B
  } catch (B) { return e(B), Zr(A) }
}

// READABLE (for understanding):
function registerOutputFile(agentId, transcriptPath) {
  try {
    ensureOutputDirExists();
    let outputPath = formatOutputPath(agentId);
    if (fileExists(outputPath)) {
      unlinkSync(outputPath);  // Delete existing
    }
    symlinkSync(transcriptPath, outputPath);  // Link transcript → output
    return outputPath;
  } catch (error) {
    logError(error);
    return createEmptyOutputFile(agentId);
  }
}

// Mapping: OKA→registerOutputFile, ze8→symlinkSync, D12→unlinkSync
```

**Key insight:** Output files are symlinks to the actual transcript files, allowing the TaskOutput tool to read live progress.

---

## Subagent Hooks

Claude Code provides hooks for subagent lifecycle events.

### SubagentStart Hook

Triggered when a subagent (Task tool call) is started.

```javascript
// ============================================
// executeSubagentStartHooks - Triggers SubagentStart hooks
// Location: chunks.120.mjs:2157-2171
// ============================================

// ORIGINAL (for source lookup):
async function* kz0(A, Q, B, G = fO) {
  let Z = {
    ...jE(void 0),
    hook_event_name: "SubagentStart",
    agent_id: A,
    agent_type: Q
  };
  yield* At({
    hookInput: Z,
    toolUseID: tHA(),
    matchQuery: Q,  // Match by agent_type
    signal: B,
    timeoutMs: G
  })
}

// READABLE (for understanding):
async function* executeSubagentStartHooks(agentId, agentType, signal, timeoutMs = DEFAULT_HOOK_TIMEOUT) {
  let hookInput = {
    ...createBaseHookContext(undefined),
    hook_event_name: "SubagentStart",
    agent_id: agentId,
    agent_type: agentType
  };
  yield* executeHooksInREPL({
    hookInput: hookInput,
    toolUseID: generateToolUseId(),
    matchQuery: agentType,  // Match hooks by agent_type
    signal: signal,
    timeoutMs: timeoutMs
  });
}

// Mapping: kz0→executeSubagentStartHooks, jE→createBaseHookContext, At→executeHooksInREPL, fO→DEFAULT_HOOK_TIMEOUT
```

**Hook Input (JSON):**
```json
{
  "hook_event_name": "SubagentStart",
  "agent_id": "abc123",
  "agent_type": "Explore"
}
```

**Hook Behavior:**
- Exit code 0: stdout shown to subagent
- Blocking errors are ignored
- Other exit codes: show stderr to user only

**Matcher:** Hooks can match by `agent_type` value (e.g., only trigger for "Explore" agents).

### SubagentStop Hook

Triggered right before a subagent concludes its response.

```
Hook Input (JSON):
{
  "hook_event_name": "SubagentStop",
  "agent_id": "abc123"
}
```

**Hook Behavior:**
- Exit code 0: stdout/stderr not shown
- Exit code 2: show stderr to subagent and continue running
- Other exit codes: show stderr to user only

### Hook Configuration Example

```json
{
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "Explore",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Explore agent starting'"
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Agent completed' >> ~/.claude/agent.log"
          }
        ]
      }
    ]
  }
}
```

---

## Task State Transitions

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Background Task State Machine                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────┐                                                      │
│   │ pending  │ ─────────────────────────────────────┐               │
│   └────┬─────┘                                      │               │
│        │ spawn()                                    │               │
│        v                                            │               │
│   ┌──────────┐    Ctrl+B     ┌──────────────────┐  │               │
│   │ running  │ ────────────► │ isBackgrounded:  │  │               │
│   │          │               │     true         │  │               │
│   └────┬─────┘               └────────┬─────────┘  │               │
│        │                              │             │               │
│        │ ┌────────────────────────────┘             │               │
│        │ │                                          │               │
│        v v                                          │               │
│   ┌─────────────┬─────────────┬─────────────┐      │               │
│   │             │             │             │      │               │
│   v             v             v             v      v               │
│ completed     failed       killed      (timeout)                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**State Descriptions:**
- `pending` - Task created but not yet started
- `running` - Task actively executing
- `completed` - Task finished successfully (markTaskCompleted)
- `failed` - Task encountered an error (markTaskFailed)
- `killed` - Task aborted by user/system (killBackgroundTask)

**Flags:**
- `isBackgrounded: true` - Task running in background (Ctrl+B or run_in_background)
- `isBackgrounded: false` - Task running in foreground (user waiting)
- `notified: true` - Main agent has been notified of completion

---

## Related Symbols

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key functions in this document:
- `formatTaskOutput` (YK1) - Formats task output by type
- `truncateTaskOutput` (bbA) - Truncates with file reference
- `waitForTaskCompletion` (op5) - Polls for completion
- `getTaskMaxOutputLength` (np5) - Gets max output length
- `BackgroundShellUI` (H59) - UI component for shells
- `TASKOUTPUT_TOOL_NAME` (aHA) - "TaskOutput" constant
- `KILLSHELL_TOOL_NAME` (GK1) - "KillShell" constant
- `createTaskNotification` (C4A) - Creates completion notification
- `killBackgroundTask` ($4A) - Terminates running task
- `updateTaskProgress` (RI0) - Updates task progress
- `markTaskCompleted` (_I0) - Marks task as completed
- `markTaskFailed` (jI0) - Marks task as failed
- `LocalAgentTaskHandler` (kZ1) - Task type handler
- `isLocalAgentTask` (Sr) - Type guard function

---

## See Also

- [08_subagent/](../08_subagent/) - Sub-agent execution (Task tool)
- [08_subagent/execution.md](../08_subagent/execution.md) - Agent execution flow
- [07_tool/](../07_tool/) - Bash tool with run_in_background parameter
