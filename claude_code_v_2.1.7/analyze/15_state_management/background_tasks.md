# Background Tasks Storage Mechanism (v2.1.7)

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Table of Contents

1. [Overview](#overview)
2. [Task Types](#task-types)
3. [Background Bash Tasks](#background-bash-tasks)
4. [Background Agent Tasks](#background-agent-tasks)
5. [Remote Agent Tasks (NEW in 2.1.0)](#remote-agent-tasks)
6. [Unified TaskOutput Tool](#unified-taskoutput-tool)
7. [Path Encoding Functions](#path-encoding-functions)
8. [Storage Location Summary](#storage-location-summary)
9. [Task Handlers](#task-handlers)
10. [Related Symbols](#related-symbols)

---

## Overview

Claude Code v2.1.7 supports three types of background tasks:

| Task Type | Storage | Persistence | Tool |
|-----------|---------|-------------|------|
| **local_bash** | In-memory (app state) | Session only | TaskOutput |
| **local_agent** | Transcript files (.jsonl) | Persisted | TaskOutput |
| **remote_agent** | Remote session | External | TaskOutput |

**Key Changes in 2.1.7:**
- Unified `TaskOutput` tool replaces separate `BashOutput`/`AgentOutput` tools
- Added remote agent task support (teleport)
- Enhanced task handler pattern

---

## Task Types

### Task Type Definition

```javascript
// Task types supported by TaskOutput
type TaskType = "local_bash" | "local_agent" | "remote_agent";
```

### Task Type Handlers

| Handler | File | Lines | Description |
|---------|------|-------|-------------|
| `LocalBashTaskHandler` (es) | chunks.121.mjs | 755-834 | Shell command background execution |
| `LocalAgentTaskHandler` (kZ1) | chunks.91.mjs | 1412-1482 | Sub-agent background execution |
| `RemoteAgentTaskHandler` (tu2) | chunks.121.mjs | 185-252 | Remote session polling |

---

## Background Bash Tasks

### In-Memory Storage

Background Bash tasks store output in the `tasks` object within app state.

```javascript
// State structure
{
  tasks: {
    [taskId: string]: {
      id: string,
      type: "local_bash",
      command: string,
      description: string,
      status: "running" | "completed" | "failed",
      startTime: number,
      stdout: string,
      stderr: string,
      result?: { code: number, interrupted: boolean }
    }
  }
}
```

### Task Creation

```javascript
// ============================================
// Background Bash Task Creation
// Location: chunks.121.mjs (LocalBashTaskHandler)
// ============================================

// READABLE (for understanding):
function createBackgroundBashTask(command, shellProcess, description, updateState) {
  let taskId = generateTaskId();  // 6-character ID

  let taskObject = {
    id: taskId,
    type: "local_bash",
    command: command,
    description: description,
    status: "running",
    startTime: Date.now(),
    stdout: "",
    stderr: "",
    completionStatusSentInAttachment: false
  };

  // Register in app state
  updateState(taskId, () => taskObject);

  // Stream handlers accumulate output
  shellProcess.stdoutStream.on("data", (chunk) => {
    updateState(taskId, (task) => ({
      ...task,
      stdout: task.stdout + chunk.toString()
    }));
  });

  shellProcess.stderrStream.on("data", (chunk) => {
    updateState(taskId, (task) => ({
      ...task,
      stderr: task.stderr + chunk.toString()
    }));
  });

  // Update status on completion
  shellProcess.result.then((result) => {
    updateState(taskId, (task) => ({
      ...task,
      status: result.code === 0 ? "completed" : "failed",
      result: { code: result.code, interrupted: result.interrupted }
    }));
  });

  return taskId;
}
```

### Task ID Generation

```javascript
// ============================================
// generateTaskId
// Location: derived from UUID generation
// ============================================

function generateTaskId() {
  return generateUUID().replace(/-/g, "").substring(0, 6);
}
// Result: 6-character alphanumeric ID (e.g., "ba82d9")
```

---

## Background Agent Tasks

### Transcript-Based Storage

Background Agent tasks store output using the transcript system, writing to JSONL files.

**Storage Path:** `~/.claude/projects/<sanitized-cwd>/agent-<agentId>.jsonl`

### Agent Task Creation

```javascript
// ============================================
// Background Agent Task Structure
// Location: chunks.91.mjs (LocalAgentTaskHandler)
// ============================================

// READABLE:
function createBackgroundAgentTask(agentId, description, subAgentType) {
  return {
    id: agentId,
    type: "local_agent",
    description: description,
    subAgentType: subAgentType,   // e.g., "Explore", "Plan"
    status: "running",
    startTime: Date.now(),
    outputFile: getAgentTranscriptPath(agentId)  // ~/.claude/projects/.../agent-{id}.jsonl
  };
}
```

### Transcript Recording

```javascript
// ============================================
// recordSidechainTranscript
// Location: derived from session storage
// ============================================

async function recordSidechainTranscript(messages, agentId) {
  await getSessionStorage().insertMessageChain(
    filterTranscriptEvents(messages),
    true,      // isSidechain flag
    agentId    // Agent identifier
  );
}
```

### Loading Transcript for Resume

```javascript
// ============================================
// loadTranscript - Load agent transcript for resume
// Location: derived from session loading
// ============================================

async function loadTranscript(agentId) {
  const transcriptPath = getAgentTranscriptPath(agentId);
  const fs = getFileSystem();

  // Check if file exists
  try {
    fs.statSync(transcriptPath);
  } catch {
    return null;
  }

  try {
    // Parse transcript file
    const { messages } = await parseSessionFile(transcriptPath);

    // Filter to sidechain messages for this agent
    const agentMessages = Array.from(messages.values())
      .filter(msg => msg.agentId === agentId && msg.isSidechain);

    if (agentMessages.length === 0) return null;

    // Find leaf message (most recent with no children)
    const parentUuids = new Set(agentMessages.map(m => m.parentUuid));
    const leafMessage = agentMessages
      .filter(m => !parentUuids.has(m.uuid))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    if (!leafMessage) return null;

    // Build message chain and return
    return buildMessageChain(messages, leafMessage)
      .filter(m => m.agentId === agentId)
      .map(({ isSidechain, parentUuid, ...rest }) => rest);

  } catch {
    return null;
  }
}
```

---

## Remote Agent Tasks

### NEW in 2.1.0 - Teleport Support

Remote agent tasks represent sessions running on remote workers that can be monitored and resumed locally.

```javascript
// ============================================
// Remote Agent Task Structure
// Location: chunks.121.mjs (RemoteAgentTaskHandler)
// ============================================

// READABLE:
{
  id: string,                    // Remote session ID
  type: "remote_agent",
  description: string,
  status: "running" | "completed" | "failed",
  remoteSessionUrl: string,      // URL for logs
  teleportCommand: string,       // Command to resume locally
  lastProgress?: {
    summary: string,
    todoList: string[]
  }
}
```

### Remote Session Polling

```javascript
// ============================================
// startPollingRemoteSession
// Location: chunks.121.mjs:110-155
// ============================================

// READABLE:
async function startPollingRemoteSession(sessionId, taskId) {
  const pollInterval = setInterval(async () => {
    try {
      const logs = await fetchRemoteSessionLogs(sessionId);

      // Extract progress summary
      const summary = generateProgressSummary(logs);
      const todoList = extractTodoList(logs);

      // Update task state
      updateTaskProgress(taskId, { summary, todoList });

      // Check if completed
      if (logs.status === "completed" || logs.status === "failed") {
        clearInterval(pollInterval);
        if (logs.status === "completed") {
          markTaskCompleted(taskId);
        } else {
          markTaskFailed(taskId, logs.error);
        }
        notifyRemoteTaskCompletion(taskId, logs.status);
      }
    } catch (error) {
      // Handle polling errors
    }
  }, POLL_INTERVAL);
}
```

---

## Unified TaskOutput Tool

### Overview

The `TaskOutput` tool (v2.0.64+) unifies retrieval of all background task types.

**Input Schema:**
```javascript
{
  task_id: string,               // Task ID (bash or agent)
  block?: boolean,               // Wait for completion (default: true)
  timeout?: number               // Max wait time in ms (default: 30000, max: 600000)
}
```

**Output Schema:**
```javascript
{
  // For local_bash:
  shellId: string,
  command: string,
  status: "running" | "completed" | "failed",
  exitCode: number | null,
  stdout: string,
  stderr: string,
  stdoutLines: number,
  stderrLines: number,
  timestamp: string,

  // For local_agent:
  agentId: string,
  content: [{ type: "text", text: string }],
  status: "completed" | "running" | "failed",
  totalDurationMs: number,
  totalTokens: number,
  totalToolUseCount: number,

  // For remote_agent:
  sessionId: string,
  status: "running" | "completed" | "failed",
  teleportCommand: string,
  lastProgress?: { summary: string, todoList: string[] }
}
```

### Task Lookup Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TASKOUTPUT TOOL LOOKUP FLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TaskOutput({ task_id: "abc123" })                                          │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  getTaskHandlers() → [LocalBashTaskHandler, LocalAgentTaskHandler,  │    │
│  │                       RemoteAgentTaskHandler]                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  For each handler:                                                           │
│       │                                                                      │
│       ├─► handler.canHandle(taskId, appState) ?                             │
│       │        │                                                             │
│       │        ├─ LocalBashTaskHandler: checks appState.tasks[taskId]       │
│       │        ├─ LocalAgentTaskHandler: checks agent transcript exists     │
│       │        └─ RemoteAgentTaskHandler: checks remote session cache       │
│       │                                                                      │
│       └─► handler.getOutput(taskId, block, timeout)                         │
│                │                                                             │
│                ├─ LocalBash: reads from in-memory state                     │
│                ├─ LocalAgent: reads transcript file, aggregates results     │
│                └─ RemoteAgent: polls remote API, returns progress           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Path Encoding Functions

### sanitizePath (fb3)

Converts any path to a safe directory name by replacing non-alphanumeric characters with `-`.

```javascript
// ============================================
// sanitizePath
// Location: chunks.148.mjs (and other files)
// ============================================

// ORIGINAL:
function fb3(A) {
  return A.replace(/[^a-zA-Z0-9]/g, "-")
}

// READABLE:
function sanitizePath(pathStr) {
  return pathStr.replace(/[^a-zA-Z0-9]/g, "-");
}

// Examples:
// "/Users/john/project" → "-Users-john-project"
// "/tmp/test" → "-tmp-test"
// "C:\\Users\\john" → "C--Users-john"
```

### getAgentTranscriptPath (yb)

```javascript
// ============================================
// getAgentTranscriptPath
// Location: chunks.148.mjs:692-696
// ============================================

// READABLE:
function getAgentTranscriptPath(agentId) {
  const projectDir = getProjectDir(currentWorkingDir);
  return path.join(projectDir, `agent-${agentId}.jsonl`);
}
```

---

## Storage Location Summary

| Data Type | Storage Location | Format | Persistence |
|-----------|-----------------|--------|-------------|
| Background Bash Output | In-memory `tasks` | Object | Session only |
| Background Agent Output | `~/.claude/projects/<cwd>/agent-<id>.jsonl` | JSONL | Persisted |
| Remote Agent State | Remote server + local cache | API | External |
| Session Messages | `~/.claude/projects/<cwd>/<sessionId>.jsonl` | JSONL | Persisted |
| Sandbox Temp Files | `/tmp/claude/` (TMPDIR) | Various | Ephemeral |

### Directory Structure Example

```
~/.claude/
  projects/
    -Users-john-myproject/                # Sanitized working directory
      abc123.jsonl                        # Session transcript
      agent-def456.jsonl                  # Agent transcript
      agent-ghi789.jsonl                  # Another agent

/tmp/claude/
  -Users-john-myproject/                  # Sanitized working directory
    tasks/
      ba82d93.output                      # Background bash output (sandbox mode)
```

---

## Task Handlers

### LocalBashTaskHandler (es)

```javascript
// ============================================
// LocalBashTaskHandler
// Location: chunks.121.mjs:755-834
// ============================================

// READABLE:
const LocalBashTaskHandler = {
  taskType: "local_bash",

  canHandle(taskId, appState) {
    return !!appState.tasks[taskId] && appState.tasks[taskId].type === "local_bash";
  },

  async getOutput(taskId, appState, block, timeout) {
    const task = appState.tasks[taskId];
    if (!task) return null;

    if (block && task.status === "running") {
      await waitForTaskCompletion(taskId, timeout);
    }

    return {
      shellId: taskId,
      command: task.command,
      status: task.status,
      exitCode: task.result?.code ?? null,
      stdout: task.stdout,
      stderr: task.stderr,
      stdoutLines: countLines(task.stdout),
      stderrLines: countLines(task.stderr),
      timestamp: new Date().toISOString()
    };
  }
};
```

### LocalAgentTaskHandler (kZ1)

```javascript
// ============================================
// LocalAgentTaskHandler
// Location: chunks.91.mjs:1412-1482
// ============================================

// READABLE:
const LocalAgentTaskHandler = {
  taskType: "local_agent",

  canHandle(taskId, appState) {
    // Check if transcript file exists
    const transcriptPath = getAgentTranscriptPath(taskId);
    return fileExists(transcriptPath);
  },

  async getOutput(taskId, appState, block, timeout) {
    const transcript = await loadTranscript(taskId);
    if (!transcript) return null;

    // Aggregate results from transcript
    const results = extractAgentResults(transcript);

    return {
      agentId: taskId,
      content: results.content,
      status: results.status,
      totalDurationMs: results.duration,
      totalTokens: results.tokens,
      totalToolUseCount: results.toolUseCount
    };
  }
};
```

### RemoteAgentTaskHandler (tu2)

```javascript
// ============================================
// RemoteAgentTaskHandler
// Location: chunks.121.mjs:185-252
// ============================================

// READABLE:
const RemoteAgentTaskHandler = {
  taskType: "remote_agent",

  canHandle(taskId, appState) {
    // Check remote session cache
    return isRemoteSessionKnown(taskId);
  },

  async getOutput(taskId, appState, block, timeout) {
    const sessionInfo = getRemoteSessionInfo(taskId);
    if (!sessionInfo) return null;

    // Fetch latest status from remote
    const logs = await fetchRemoteSessionLogs(taskId);

    return {
      sessionId: taskId,
      status: logs.status,
      teleportCommand: getTeleportCommand(taskId),
      lastProgress: logs.progress
    };
  }
};
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

### Task Handlers
- `LocalBashTaskHandler` (es) - chunks.121.mjs:755-834
- `LocalAgentTaskHandler` (kZ1) - chunks.91.mjs:1412-1482
- `RemoteAgentTaskHandler` (tu2) - chunks.121.mjs:185-252
- `getTaskHandlers` ($i5) - chunks.121.mjs:255-257

### TaskOutput Tool
- `TASKOUTPUT_TOOL_NAME` (aHA) - chunks.119.mjs:1574
- `formatTaskOutput` (YK1) - chunks.119.mjs:1605-1632
- `waitForTaskCompletion` (op5) - chunks.119.mjs:1634-1644

### Storage Functions
- `sanitizePath` (fb3) - chunks.148.mjs
- `getAgentTranscriptPath` (yb) - chunks.148.mjs:692-696
- `getAgentOutputDir` (eSA) - chunks.86.mjs:97-104
- `appendToOutputFile` (g9A) - chunks.86.mjs:110-131

### Task Lifecycle
- `createTaskNotification` (C4A) - chunks.91.mjs:1222-1240
- `updateTaskProgress` (RI0) - chunks.91.mjs:1253-1261
- `markTaskCompleted` (_I0) - chunks.91.mjs:1263-1274
- `markTaskFailed` (jI0) - chunks.91.mjs:1276-1286

---

## Key Insights

### Why Two Storage Mechanisms for Local Tasks?

1. **Bash Tasks (In-Memory)**:
   - Fast access for streaming output
   - Simple stdout/stderr accumulation
   - Suitable for short-lived shell commands
   - Lost on process exit

2. **Agent Tasks (Transcript Files)**:
   - Enables agent resume functionality
   - Persistent across sessions
   - Supports complex message chains
   - Larger storage overhead

### Remote Agent Tasks

Remote tasks are a hybrid:
- State tracked locally (task ID, polling status)
- Actual execution on remote server
- Can be "teleported" to resume locally
- Polling mechanism for progress updates

---

## See Also

- [app_state.md](./app_state.md) - Core state architecture
- [state_interactions.md](./state_interactions.md) - Cross-module interactions
- [session_updates.md](./session_updates.md) - Session management features
- [../08_subagent/](../08_subagent/) - Subagent execution details
