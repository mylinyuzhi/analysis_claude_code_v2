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

## Storage Mechanism

### Dual Storage Strategy

Claude Code uses two different storage mechanisms for background tasks:

| Type | Storage | Persistence | Access |
|------|---------|-------------|--------|
| local_bash | In-memory (`backgroundTasks`) | Lost on exit | Direct via app state |
| local_agent | File (JSONL transcript) | Persists | Enables resume |
| remote_agent | File (JSONL transcript) | Persists | Via teleport |

**Why this design:**
- **Bash tasks are in-memory** because they are:
  - Short-lived (commands complete quickly)
  - Need real-time streaming (stdout/stderr events)
  - Don't need resume capability
  - Memory is fast for frequent reads/writes

- **Agent tasks use files** because they:
  - Run longer (complex multi-step operations)
  - Need resume capability (can restart from transcript)
  - Have complex message chains (JSONL preserves structure)
  - Must survive process restarts

- **Symlinks for output** because:
  - Avoids duplicate storage (transcript + output)
  - Provides unified access via `outputFile` path
  - TaskOutput tool can read live progress

### Task ID Generation

```javascript
// ============================================
// generateAgentId - Creates 6-character unique ID
// Location: chunks.91.mjs:906
// ============================================

// ORIGINAL (for source lookup):
B = YG5().replace(/-/g, "").substring(0, 6);

// READABLE (for understanding):
agentId = generateUUID().replace(/-/g, "").substring(0, 6);

// Examples: "a1b2c3", "def456", "789xyz"

// Mapping: YG5→generateUUID
```

**ID prefixes by type:**
- `local_agent`: No prefix (e.g., "a1b2c3")
- `remote_agent`: "r" prefix (e.g., "r1a2b3")
- `local_bash`: "s" prefix for shell (e.g., "s4d5e6")

### Background Bash Tasks (In-Memory)

```javascript
// App state stores bash tasks directly
{
  backgroundTasks: {
    [taskId]: {
      id: string,           // 6-char ID
      command: string,      // Shell command
      status: "running" | "completed" | "failed",
      stdout: string,       // Accumulated output
      stderr: string,
      type: "shell"
    }
  }
}
```

**Key characteristics:**
- Real-time streaming of stdout/stderr via event listeners
- Lost on process exit (no persistence)
- Fast access for short-lived commands

### Background Agent Tasks (Transcript Files)

**Path:** `~/.claude/projects/<sanitized-cwd>/subagents/agent-<agentId>.jsonl`

```javascript
// ============================================
// getAgentTranscriptPath - Builds transcript file path
// Location: chunks.148.mjs:692-696
// ============================================

// ORIGINAL (for source lookup):
function yb(A) {
  let Q = QV(ke),  // Get project dir for cwd
    B = q0();      // Get current working dir
  return $w(Q, B, "subagents", `agent-${A}.jsonl`)
}

// READABLE (for understanding):
function getAgentTranscriptPath(agentId) {
  let projectDir = getProjectDirForCwd(currentWorkingDir);
  let cwd = getCurrentWorkingDir();
  return path.join(projectDir, cwd, "subagents", `agent-${agentId}.jsonl`);
}

// Mapping: yb→getAgentTranscriptPath, QV→getProjectDirForCwd, ke→currentWorkingDir, q0→getCurrentWorkingDir, $w→path.join
```

**Key characteristics:**
- JSONL format for message chains
- Persistent across sessions (enables resume via `resume` parameter)
- Supports complex message chain reconstruction

### Path Encoding (sanitizePath)

```javascript
// ============================================
// sanitizePath - Encodes paths for safe filesystem names
// Location: fb3 function
// ============================================

function sanitizePath(pathStr) {
  return pathStr.replace(/[^a-zA-Z0-9]/g, "-");
}

// Examples:
// "/Users/john/project" → "-Users-john-project"
// "/tmp/test" → "-tmp-test"
// "C:\\Users\\john" → "C--Users-john"
```

### Temporary Directory Structure

When sandbox mode is enabled:

```
/tmp/claude/                              # Base temp directory (TMPDIR)
  <sanitized-cwd>/                        # Working directory encoded
    tasks/                                # Tasks subdirectory
      <taskId>.output                     # Output files
```

**Environment:** `TMPDIR=/tmp/claude` is set for child processes in sandbox mode.

### Output File Symlinks

Output files are symlinks to transcript files:

```javascript
// ============================================
// registerOutputFile - Creates symlink for progress access
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

// Mapping: OKA→registerOutputFile, ze8→symlinkSync, D12→unlinkSync, Zr→createEmptyOutputFile
```

This allows TaskOutput tool to read live progress via the output path.

### Storage Location Summary

| Data Type | Storage Location | Format |
|-----------|-----------------|--------|
| Bash task output | In-memory `backgroundTasks` | Object |
| Agent transcript | `~/.claude/projects/<cwd>/subagents/agent-<id>.jsonl` | JSONL |
| Output file link | `~/.claude/projects/<cwd>/agents/<id>.output` | Symlink |
| Sandbox temp | `/tmp/claude/` | Various |

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

Remote session agent for the `--teleport` feature. Enables running sessions on remote machines and resuming them locally.

**Handler:** `RemoteAgentTaskHandler` (tu2)

```javascript
// ============================================
// RemoteAgentTaskHandler - Handles teleport sessions
// Location: chunks.121.mjs:185-252
// ============================================

// ORIGINAL (for source lookup):
tu2 = {
  name: "RemoteAgentTask",
  type: "remote_agent",
  async spawn(A, Q) {
    let { command: B, title: G } = A,
        { setAppState: Z, abortController: Y } = Q;
    k(`RemoteAgentTask spawning: ${G}`);
    let J = await cbA({
      initialMessage: B,
      description: G,
      signal: Y.signal
    });
    if (!J) throw Error("Failed to create remote session");
    let X = J.id,
        I = `r${X.substring(0,6)}`;  // ID prefix: "r" for remote
    Zr(I);  // Create empty output file
    let D = {
      ...KO(I, "remote_agent", G),
      type: "remote_agent",
      status: "running",
      sessionId: X,
      command: B,
      title: J.title || G,
      todoList: [],
      log: [],
      deltaSummarySinceLastFlushToAttachment: null
    };
    FO(D, Z);  // Add to state
    let W = zi5(I, Q);  // Start polling
    return { taskId: I, cleanup: () => { W() } }
  },
  async kill(A, Q) { /* Mark as killed locally */ },
  renderStatus(A) { /* React component for UI */ },
  renderOutput(A) { /* React component for output display */ },
  getProgressMessage(A) {
    let B = A.deltaSummarySinceLastFlushToAttachment;
    if (!B) return null;
    return `Remote task ${A.id} progress: ${B}. Read ${A.outputFile} to see full output.`
  }
}

// READABLE (for understanding):
RemoteAgentTaskHandler = {
  name: "RemoteAgentTask",
  type: "remote_agent",

  async spawn({ command, title }, { setAppState, abortController }) {
    log(`RemoteAgentTask spawning: ${title}`);

    // Create remote session via API
    let session = await createRemoteSession({
      initialMessage: command,
      description: title,
      signal: abortController.signal
    });

    if (!session) throw Error("Failed to create remote session");

    // Generate task ID with "r" prefix to distinguish from local
    let taskId = `r${session.id.substring(0, 6)}`;
    createEmptyOutputFile(taskId);

    let task = {
      ...createBaseTask(taskId, "remote_agent", title),
      type: "remote_agent",
      status: "running",
      sessionId: session.id,
      command: command,
      title: session.title || title,
      todoList: [],           // Remote session's todo list
      log: [],                // Activity log
      deltaSummarySinceLastFlushToAttachment: null
    };

    addTaskToState(task, setAppState);
    let stopPolling = startPollingRemoteSession(taskId, context);

    return { taskId, cleanup: () => stopPolling() };
  }
}

// Mapping: tu2→RemoteAgentTaskHandler, cbA→createRemoteSession, Zr→createEmptyOutputFile,
//          KO→createBaseTask, FO→addTaskToState, zi5→startPollingRemoteSession
```

**Output fields:**
- `task_id` - Remote session ID (prefixed with "r", e.g., "r1a2b3c")
- `task_type` - "remote_agent"
- `status` - Task status ("running", "completed", "failed", "killed")
- `description` - Task description
- `output` - Remote output content
- `prompt` - Command sent to remote (stored as `command`)
- `sessionId` - Full remote session ID (not truncated)
- `title` - Session title (may be auto-generated by API)
- `todoList` - Remote session's todo list
- `log` - Activity log entries
- `deltaSummarySinceLastFlushToAttachment` - Progress delta for notifications

**Task Type Handlers:**

All three task types are handled by `getTaskHandlers()`:

```javascript
// ============================================
// getTaskHandlers - Returns all task type handlers
// Location: chunks.121.mjs:255-257
// ============================================

function $i5() {
  return [es, kZ1, tu2]
}

// READABLE:
function getTaskHandlers() {
  return [LocalBashTaskHandler, LocalAgentTaskHandler, RemoteAgentTaskHandler]
}

// Mapping: $i5→getTaskHandlers, es→LocalBashTaskHandler, kZ1→LocalAgentTaskHandler, tu2→RemoteAgentTaskHandler
```

**Key differences from local_agent:**

| Aspect | local_agent | remote_agent |
|--------|-------------|--------------|
| ID prefix | None | "r" |
| Session creation | Local fork | Remote API (`cbA`) |
| Updates | Direct progress | Polling (`zi5`) |
| Extra fields | None | `sessionId`, `todoList`, `log`, `deltaSummary...` |
| Use case | Task tool | `--teleport` feature |

**Teleport Usage:**

```bash
# Start a teleport session (resume from another machine)
claude --teleport <session-id>

# Resume command shown on completion
Resume with: claude --teleport <new-session-id>
```

The teleport feature allows:
1. Starting a session on one machine
2. Continuing it on another machine
3. Tracking progress and todo list from the remote session
4. Git stash handling for clean working directory

### Remote Session Polling Mechanism

```javascript
// ============================================
// startPollingRemoteSession - Polls remote session for updates
// Location: chunks.121.mjs:110-155
// ============================================

// ORIGINAL (for source lookup):
function zi5(A, Q) {
  let B = !0,
    G = 1000,  // Poll interval: 1 second
    Z = async () => {
      if (!B) return;
      try {
        let J = (await Q.getAppState()).tasks?.[A];
        if (!J || J.status !== "running") return;
        let X = await nu2(J.sessionId),  // Fetch remote session logs
          I = X.log.find((V) => V.type === "result"),
          D = I ? I.subtype === "success" ? "completed" : "failed" : X.log.length > 0 ? "running" : "starting",
          W = X.log.slice(J.log.length),  // New log entries
          K = null;
        if (W.length > 0) {
          let V = J.deltaSummarySinceLastFlushToAttachment;
          K = await Ei5(W, V);  // Generate progress summary
          // ... write to output file ...
          if (F) g9A(A, F + `\n`)
        }
        // Update task state
        oY(A, Q.setAppState, (V) => ({
          ...V,
          status: D === "starting" ? "running" : D,
          log: X.log,
          todoList: Hi5(X.log),
          deltaSummarySinceLastFlushToAttachment: K,
          endTime: I ? Date.now() : void 0
        }));
        if (I) {
          let V = I.subtype === "success" ? "completed" : "failed";
          Fi5(A, J.title, V, Q.setAppState);  // Notify completion
          return
        }
      } catch (Y) { e(Y instanceof Error ? Y : Error(String(Y))) }
      if (B) setTimeout(Z, G)  // Schedule next poll
    };
  return Z(), () => { B = !1 }  // Start polling, return stop function
}

// READABLE (for understanding):
function startPollingRemoteSession(taskId, context) {
  let isPolling = true;
  let pollIntervalMs = 1000;  // Poll every 1 second

  let poll = async () => {
    if (!isPolling) return;

    try {
      let task = (await context.getAppState()).tasks?.[taskId];
      if (!task || task.status !== "running") return;

      // Fetch latest logs from remote session
      let sessionData = await fetchRemoteSessionLogs(task.sessionId);

      // Check for completion
      let resultEntry = sessionData.log.find(entry => entry.type === "result");
      let status = resultEntry
        ? (resultEntry.subtype === "success" ? "completed" : "failed")
        : (sessionData.log.length > 0 ? "running" : "starting");

      // Process new log entries
      let newEntries = sessionData.log.slice(task.log.length);
      let deltaSummary = null;

      if (newEntries.length > 0) {
        deltaSummary = await generateProgressSummary(newEntries, task.deltaSummarySinceLastFlushToAttachment);
        // Write new content to output file
        appendToOutputFile(taskId, formattedContent + "\n");
      }

      // Update task state
      updateTask(taskId, context.setAppState, (t) => ({
        ...t,
        status: status === "starting" ? "running" : status,
        log: sessionData.log,
        todoList: extractTodoList(sessionData.log),
        deltaSummarySinceLastFlushToAttachment: deltaSummary,
        endTime: resultEntry ? Date.now() : undefined
      }));

      // Notify completion
      if (resultEntry) {
        let finalStatus = resultEntry.subtype === "success" ? "completed" : "failed";
        notifyRemoteTaskCompletion(taskId, task.title, finalStatus, context.setAppState);
        return;  // Stop polling
      }
    } catch (error) {
      logError(error instanceof Error ? error : Error(String(error)));
    }

    // Schedule next poll if still active
    if (isPolling) setTimeout(poll, pollIntervalMs);
  };

  poll();  // Start polling immediately
  return () => { isPolling = false };  // Return stop function
}

// Mapping: zi5→startPollingRemoteSession, nu2→fetchRemoteSessionLogs, Ei5→generateProgressSummary,
//          Hi5→extractTodoList, Fi5→notifyRemoteTaskCompletion, g9A→appendToOutputFile, oY→updateTask
```

**How polling works:**
1. Polls every 1 second (`pollIntervalMs = 1000`)
2. Fetches remote session logs via API (`nu2`)
3. Compares log length to find new entries
4. Updates local task state with new data
5. Writes new content to output file
6. Stops when `result` entry found in logs

**Key insight:** The polling interval is fixed at 1 second, balancing responsiveness with API load. The delta summary (`deltaSummarySinceLastFlushToAttachment`) ensures progress notifications only report changes.

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

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

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
