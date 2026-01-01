# Background Tasks Storage Mechanism

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

## Table of Contents

1. [Overview](#overview)
2. [Temporary Directory Structure](#temporary-directory-structure)
3. [Background Bash Tasks](#background-bash-tasks)
4. [Background Agent Tasks](#background-agent-tasks)
5. [Path Encoding Functions](#path-encoding-functions)
6. [Storage Location Summary](#storage-location-summary)
7. [Related Tools](#related-tools)

---

## Overview

Claude Code v2.0.59 supports two types of background tasks that allow the main agent to continue working while long-running operations execute asynchronously:

1. **Background Bash Tasks** - Shell commands with `run_in_background: true`
2. **Background Agent Tasks** - Subagent executions with `run_in_background: true`

Each type has a different storage mechanism:
- Bash tasks: **In-memory** storage in `backgroundTasks` app state
- Agent tasks: **Transcript files** on disk

The temporary directory `/tmp/claude/` serves as the base for sandbox mode operations.

---

## Temporary Directory Structure

### Base Directory Creation

**Location**: `chunks.71.mjs:1340-1358`

```javascript
// ============================================
// Sandbox Temporary Directory Setup
// Location: chunks.71.mjs:1340-1358
// ============================================

// ORIGINAL (for source lookup):
if (Y) {
  try {
    let y = RA(),
      v = "/tmp/claude";
    if (!y.existsSync("/tmp/claude")) y.mkdirSync("/tmp/claude")
  } catch (y) {
    g(`Failed to create /tmp/claude directory: ${y}`)
  }
}
let y = W$6(X, T, {
  env: {
    ...process.env,
    SHELL: X,
    GIT_EDITOR: "true",
    CLAUDECODE: "1",
    ...Y ? { TMPDIR: "/tmp/claude" } : {}
  },
  cwd: N,
  detached: !0
})

// READABLE (for understanding):
if (isSandboxed) {
  try {
    let fs = getFileSystem();
    let tempDir = "/tmp/claude";
    if (!fs.existsSync("/tmp/claude")) {
      fs.mkdirSync("/tmp/claude");
    }
  } catch (error) {
    log(`Failed to create /tmp/claude directory: ${error}`);
  }
}

let subprocess = spawnShell(shellPath, cmdArgs, {
  env: {
    ...process.env,
    SHELL: shellPath,
    GIT_EDITOR: "true",
    CLAUDECODE: "1",
    ...(isSandboxed ? { TMPDIR: "/tmp/claude" } : {})
  },
  cwd: workingDir,
  detached: true
});

// Mapping: Y→isSandboxed, y→fs/error, v→tempDir, W$6→spawnShell, X→shellPath, T→cmdArgs, N→workingDir
```

### Directory Path Structure

When background tasks create output files, the path follows this structure:

```
/tmp/claude/                                # Base temporary directory
  <sanitized-cwd>/                          # Working directory (encoded)
    tasks/                                  # Tasks subdirectory
      <taskId>.output                       # Task output file
```

Example:
```
/tmp/claude/-Users-linyuzhi-codespace-myagent/tasks/ba82d93.output
             │                               │     │
             │                               │     └── 6-char taskId + .output
             │                               └── tasks subdirectory
             └── Working directory: /Users/linyuzhi/codespace/myagent
                 Encoded: / → -
```

---

## Background Bash Tasks

### In-Memory Storage

Background Bash tasks store their output in the `backgroundTasks` object within app state.

**Location**: `chunks.70.mjs:2336-2397`

```javascript
// ============================================
// App State with backgroundTasks
// Location: chunks.70.mjs:2336-2397
// ============================================

// ORIGINAL (for source lookup):
function wp() {
  return {
    settings: $T(),
    backgroundTasks: {},  // In-memory task storage
    verbose: !1,
    mainLoopModel: null,
    // ... other state
  }
}

// READABLE (for understanding):
function getDefaultAppState() {
  return {
    settings: getDefaultSettings(),
    backgroundTasks: {},  // Map<taskId, TaskObject>
    verbose: false,
    mainLoopModel: null,
    // ... other state
  }
}

// Mapping: wp→getDefaultAppState, $T→getDefaultSettings
```

### Task Creation

**Location**: `chunks.88.mjs:1408-1470`

```javascript
// ============================================
// createBackgroundTask - Fo1 Function
// Location: chunks.88.mjs:1408-1470
// ============================================

// ORIGINAL (for source lookup):
function Fo1(A, Q, B, G) {
  let Z = G15(),
    I = {
      id: Z,
      command: A,
      description: B,
      status: "running",
      startTime: Date.now(),
      shellCommand: Q,
      completionStatusSentInAttachment: !1,
      stdout: "",
      stderr: "",
      unregisterCleanup: PG(Y),
      type: "shell"
    };
  G(Z, () => I);

  J.stdoutStream.on("data", (W) => {
    G(Z, (X) => ({ ...X, stdout: X.stdout + W.toString() }))
  });

  J.stderrStream.on("data", (W) => {
    G(Z, (X) => ({ ...X, stderr: X.stderr + W.toString() }))
  });

  Q.result.then((W) => {
    G(Z, (X) => ({
      ...X,
      status: W.code === 0 ? "completed" : "failed",
      result: { code: W.code, interrupted: W.interrupted }
    }))
  });

  return Z;
}

// READABLE (for understanding):
function createBackgroundTask(command, shellProcess, description, updateState) {
  let taskId = generateTaskId();  // 6-character ID

  let taskObject = {
    id: taskId,
    command: command,
    description: description,
    status: "running",
    startTime: Date.now(),
    shellCommand: shellProcess,
    completionStatusSentInAttachment: false,
    stdout: "",        // Accumulated stdout
    stderr: "",        // Accumulated stderr
    unregisterCleanup: registerCleanup(),
    type: "shell"
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

// Mapping: Fo1→createBackgroundTask, A→command, Q→shellProcess, B→description,
//          G→updateState, Z→taskId, I→taskObject, G15→generateTaskId
```

### Task ID Generation

**Location**: `chunks.88.mjs:1483-1485`

```javascript
// ============================================
// generateTaskId - G15 Function
// Location: chunks.88.mjs:1483-1485
// ============================================

// ORIGINAL (for source lookup):
function G15() {
  return Q15().replace(/-/g, "").substring(0, 6)
}

// READABLE (for understanding):
function generateTaskId() {
  return generateUUID().replace(/-/g, "").substring(0, 6)
}
// Result: 6-character alphanumeric ID (e.g., "ba82d93")

// Mapping: G15→generateTaskId, Q15→generateUUID
```

### Task Data Structure

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | 6-character unique task ID |
| `command` | string | The shell command being executed |
| `description` | string | User-provided description |
| `status` | "running" \| "completed" \| "failed" | Current execution status |
| `startTime` | number | Timestamp when task started |
| `stdout` | string | Accumulated standard output |
| `stderr` | string | Accumulated standard error |
| `type` | "shell" | Task type identifier |
| `result` | { code, interrupted } | Exit status (when completed) |

---

## Background Agent Tasks

### Transcript-Based Storage

Background Agent tasks store their output using the transcript system, writing to JSONL files.

**Storage Path**: `~/.claude/projects/<sanitized-cwd>/agent-<agentId>.jsonl`

### Session Storage Functions

**Location**: `chunks.154.mjs:586-632`

```javascript
// ============================================
// Session Storage Path Functions
// Location: chunks.154.mjs:586-632
// ============================================

// ORIGINAL (for source lookup):
function MQ() {
  return process.env.CLAUDE_CONFIG_DIR ?? YM9(JM9(), ".claude")
}

function PVA() {
  return Bu(MQ(), "projects")
}

function fb3(A) {
  return A.replace(/[^a-zA-Z0-9]/g, "-")
}

function cH(A) {
  return Bu(PVA(), fb3(A))
}

function DVA(A) {
  let Q = cH(ja);
  return Bu(Q, `agent-${A}.jsonl`)
}

// READABLE (for understanding):
function getClaudeConfigDir() {
  return process.env.CLAUDE_CONFIG_DIR ?? path.join(homedir(), ".claude")
}

function getProjectsDir() {
  return path.join(getClaudeConfigDir(), "projects")
}

function sanitizePath(pathStr) {
  return pathStr.replace(/[^a-zA-Z0-9]/g, "-")
}

function getProjectDir(workingDir) {
  return path.join(getProjectsDir(), sanitizePath(workingDir))
}

function getAgentTranscriptPath(agentId) {
  let projectDir = getProjectDir(currentWorkingDir);
  return path.join(projectDir, `agent-${agentId}.jsonl`)
}

// Mapping: MQ→getClaudeConfigDir, PVA→getProjectsDir, fb3→sanitizePath,
//          cH→getProjectDir, DVA→getAgentTranscriptPath
```

### Transcript Recording

**Location**: `chunks.154.mjs:908-910`

```javascript
// ============================================
// recordSidechainTranscript - EJ9 Function
// Location: chunks.154.mjs:908-910
// ============================================

// ORIGINAL (for source lookup):
async function EJ9(A, Q) {
  await _$().insertMessageChain(Bz9(A), !0, Q)
}

// READABLE (for understanding):
async function recordSidechainTranscript(messages, agentId) {
  await getSessionStorage().insertMessageChain(
    filterTranscriptEvents(messages),
    true,    // isSidechain flag
    agentId  // Agent identifier
  );
}

// Mapping: EJ9→recordSidechainTranscript, A→messages, Q→agentId,
//          _$→getSessionStorage, Bz9→filterTranscriptEvents
```

### Loading Transcript for Resume

**Location**: `chunks.154.mjs:1243-1267`

```javascript
// ============================================
// loadTranscript - KY1 Function
// Location: chunks.154.mjs:1243-1267
// ============================================

// ORIGINAL (for source lookup):
async function KY1(A) {
  let Q = DVA(A),
    B = RA();
  try {
    B.statSync(Q)
  } catch {
    return null
  }
  try {
    let { messages: G } = await jVA(Q),
      Z = Array.from(G.values()).filter((X) => X.agentId === A && X.isSidechain);
    if (Z.length === 0) return null;
    let I = new Set(Z.map((X) => X.parentUuid)),
      Y = Z.filter((X) => !I.has(X.uuid))
           .sort((X, V) => new Date(V.timestamp).getTime() - new Date(X.timestamp).getTime())[0];
    if (!Y) return null;
    return SJ1(G, Y).filter((X) => X.agentId === A)
                    .map(({ isSidechain: X, parentUuid: V, ...F }) => F)
  } catch {
    return null
  }
}

// READABLE (for understanding):
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

// Mapping: KY1→loadTranscript, A→agentId, Q→transcriptPath, DVA→getAgentTranscriptPath,
//          jVA→parseSessionFile, SJ1→buildMessageChain
```

---

## Path Encoding Functions

### sanitizePath (fb3)

Converts any path to a safe directory name by replacing non-alphanumeric characters with `-`.

**Location**: `chunks.154.mjs:627-628`

```javascript
function fb3(A) {
  return A.replace(/[^a-zA-Z0-9]/g, "-")
}

// Examples:
// "/Users/john/project" → "-Users-john-project"
// "/tmp/test" → "-tmp-test"
// "C:\\Users\\john" → "C--Users-john"
```

### vJ1 (Alternative Implementation)

**Location**: `chunks.154.mjs:2198-2199`

```javascript
function vJ1(A) {
  return A.replace(/[^a-zA-Z0-9]/g, "-")
}
```

Both functions are identical and used in different contexts.

---

## Storage Location Summary

| Data Type | Storage Location | Format | Retrieval Tool |
|-----------|-----------------|--------|----------------|
| Background Bash Output | In-memory `backgroundTasks` | Object | `BashOutput` / `TaskOutput` |
| Background Agent Output | `~/.claude/projects/<cwd>/agent-<id>.jsonl` | JSONL | `TaskOutput` |
| Session Messages | `~/.claude/projects/<cwd>/<sessionId>.jsonl` | JSONL | Internal |
| MCP Large Outputs | `/tmp/claude/mcp-outputs/<sessionId>/` | JSON | Internal |
| Sandbox Temp Files | `/tmp/claude/` (TMPDIR) | Various | N/A |

### Directory Structure Example

```
~/.claude/
  projects/
    -Users-john-myproject/                # Sanitized working directory
      abc123.jsonl                        # Session transcript
      agent-def456.jsonl                  # Agent transcript

/tmp/claude/
  -Users-john-myproject/                  # Sanitized working directory
    tasks/
      ba82d93.output                      # Background task output
  mcp-outputs/
    abc123/                               # Session ID
      mcp-output-toolname-2024-01-15.json
```

---

## Related Tools

### BashOutput Tool (CY1)

**Location**: `chunks.145.mjs:2280-2400`

Retrieves output from background Bash tasks.

**Input Schema**:
```javascript
{
  bash_id: string,    // Task ID to retrieve
  filter?: string     // Optional output filter pattern
}
```

**Output**:
```javascript
{
  shellId: string,
  command: string,
  status: "running" | "completed" | "failed",
  exitCode: number | null,
  stdout: string,
  stderr: string,
  stdoutLines: number,
  stderrLines: number,
  timestamp: string
}
```

### TaskOutput Tool (AgentOutput)

**Location**: `chunks.145.mjs:1683-1687`

Retrieves output from background Agent tasks.

**Input Schema**:
```javascript
{
  agentId: string,           // Agent ID to retrieve
  block?: boolean,           // Wait for completion (default: true)
  wait_up_to?: number        // Max wait time in seconds (0-300, default: 150)
}
```

**Output**:
```javascript
{
  status: "completed" | "running" | "failed",
  agentId: string,
  content: [{ type: "text", text: string }],
  totalDurationMs: number,
  totalTokens: number,
  totalToolUseCount: number,
  usage: { /* detailed usage */ }
}
```

---

## Key Insights

### Why Two Storage Mechanisms?

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

### The `/tmp/claude/` Directory

- Created automatically in sandbox mode
- Set as `TMPDIR` for all child processes
- Programs respecting `TMPDIR` use this location
- Contains MCP outputs and potentially task-related files

### Path Encoding Rationale

The `fb3()` function uses aggressive sanitization (`/[^a-zA-Z0-9]/g`) to ensure:
- Safe filesystem paths on all platforms
- No path traversal vulnerabilities
- Consistent directory naming across sessions
