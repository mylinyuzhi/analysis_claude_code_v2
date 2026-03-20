# Tool Registry - Complete Overview (Claude Code 2.1.76)

> Master index of all built-in tools with links to detailed analysis documents.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

---

## Tool Categories

| Category | Tools | Primary Location |
|----------|-------|------------------|
| **File System** | Read, Write, Edit, NotebookEdit | chunks.146.mjs (Read/Write), chunks.134.mjs (Edit/NotebookEdit) |
| **Search** | Grep, Glob | chunks.76.mjs |
| **Execution** | Bash | chunks.150.mjs |
| **Web** | WebFetch, WebSearch | chunks.46-47.mjs, chunks.14-15.mjs |
| **Agent** | Task (Agent) | chunks.132.mjs |
| **Task Management** | TaskStop, TaskOutput, TaskGet, TaskList, TaskCreate, TaskUpdate, TodoWrite | chunks.139-141.mjs, chunks.48.mjs |
| **Team** | TeamCreate, TeamDelete, SendMessage | chunks.141.mjs |
| **Plan Mode** | EnterPlanMode, ExitPlanMode, AskUserQuestion | chunks.88.mjs, chunks.139-140.mjs |
| **Skills & MCP** | Skill, ToolSearch | chunks.132.mjs, chunks.140.mjs |
| **Worktree** | EnterWorktree, ExitWorktree (v2.1.72+) | chunks.149.mjs |
| **Cron** | CronCreate, CronDelete, CronList (v2.1.76) | chunks.89.mjs, chunks.193.mjs |
| **MCP** | Dynamic (mcp__*) | Various |

---

## Detailed Analysis Documents

### File System Tools

| Document | Tool | Description |
|----------|------|-------------|
| [read_tool.md](read_tool.md) | Read | File reading with encoding detection, PDF/image/notebook support |
| [write_tool.md](write_tool.md) | Write | File writing with overwrite protection and LSP integration |
| [edit_tool.md](edit_tool.md) | Edit | Surgical string replacement in files |
| [bash_tool.md](bash_tool.md) | Bash | Shell command execution with sandbox support |

### Search Tools

| Document | Tool | Description |
|----------|------|-------------|
| [grep_glob_tools.md](grep_glob_tools.md) | Grep, Glob | File content search and filename pattern matching |

### Web Tools

| Document | Tool | Description |
|----------|------|-------------|
| [web_tools.md](web_tools.md) | WebFetch, WebSearch | URL fetching and web search capabilities |

### Agent Tools

| Document | Tool | Description |
|----------|------|-------------|
| [agent_tool.md](agent_tool.md) | Task | Sub-agent spawning with background support, per-invocation model selection (v2.1.72+), and worktree isolation (v2.1.76) |

### Task Management Tools

| Document | Tool | Description |
|----------|------|-------------|
| [task_management_tools.md](task_management_tools.md) | TaskStop, TaskOutput, TaskGet, TaskList, TaskCreate, TaskUpdate, TodoWrite | Background task control, structured task tracking, and simple todo list |

### Team Tools

| Document | Tool | Description |
|----------|------|-------------|
| [team_tools.md](team_tools.md) | TeamCreate, TeamDelete, SendMessage | Agent team/swarm coordination |

### Plan Mode Tools

| Document | Tool | Description |
|----------|------|-------------|
| [plan_mode_tools.md](plan_mode_tools.md) | EnterPlanMode, ExitPlanMode, AskUserQuestion | Planning workflow and user interaction |

### Skills & MCP Tools

| Document | Tool | Description |
|----------|------|-------------|
| [skill_toolsearch_tools.md](skill_toolsearch_tools.md) | Skill, ToolSearch | Slash command execution and deferred MCP tool loading |

### Worktree Tools (v2.1.72+)

| Document | Tool | Description |
|----------|------|-------------|
| [worktree_tools.md](worktree_tools.md) | EnterWorktree, ExitWorktree | Git worktree creation/cleanup for isolated agent workspaces |

### Cron Tools (v2.1.76)

| Document | Tool | Description |
|----------|------|-------------|
| [cron_tools.md](cron_tools.md) | CronCreate, CronDelete, CronList | Session-scoped recurring task scheduling, survives compaction, integrates with /loop |

### Infrastructure

| Document | Description |
|----------|-------------|
| [tool_execution_pipeline.md](tool_execution_pipeline.md) | Complete dispatch lifecycle |
| [tool_discovery.md](tool_discovery.md) | Tool lookup and registration |
| [tool_reminder_integration.md](tool_reminder_integration.md) | Tool-to-reminder connections |
| [tool_coordination.md](tool_coordination.md) | Cross-tool coordination patterns |
| [dynamic_tools.md](dynamic_tools.md) | MCP and deferred tools |
| [security_validation.md](security_validation.md) | Bash security checks reference |
| [ui_rendering.md](ui_rendering.md) | UI rendering infrastructure |
| [tool_interface_patterns.md](tool_interface_patterns.md) | Tool interface patterns |
| [tool_schemas.md](tool_schemas.md) | Input/output schema patterns and validation |

---

## Unified Tool Architecture

### TaskStop & TaskOutput - Unified Task Control

Both `TaskStop` and `TaskOutput` use a **Handler Registry Pattern** to handle all task types through a single tool interface:

| Tool | Aliases | Supported Task Types | Implementation |
|------|---------|---------------------|----------------|
| `TaskStop` | `KillShell` | `local_bash`, `local_agent`, `remote_agent` | Handler Registry (`Vg1`) |
| `TaskOutput` | `AgentOutputTool`, `BashOutputTool` | `local_bash`, `local_agent`, `remote_agent` | `buildTaskSnapshot` (`EW6`) |

**TaskStop Kill Chain:**
```
TaskStop.call({ task_id: "xxx" })
    │
    ├─→ local_bash  → Lf6.kill() → wQ6() → shellCommand.kill()
    │
    ├─→ local_agent → Fk1.kill() → x66() → abortController.abort()
    │
    └─→ remote_agent → Fn4.kill()      → Status update only (local)
```

**TaskOutput Output Chain:**
```
TaskOutput.call({ task_id: "xxx" })
    │
    └─→ buildTaskSnapshot(task)
            │
            ├─→ local_bash  → { ...base, exitCode }
            │
            ├─→ local_agent → { ...base, prompt, error }
            │
            └─→ remote_agent → { ...base, prompt }
```

---

## Tool Quick Reference

### Read Tool (`i5`)

```javascript
// Input
{
    file_path: string,      // Absolute path (required)
    offset?: number,        // Line number to start from (1-indexed)
    limit?: number,         // Number of lines to read
    pages?: string          // PDF page range (e.g., "1-5")
}

// Output
{
    content: string,        // File content
    type: "text" | "image" | "pdf" | "notebook",
    lineCount?: number
}
```

### Write Tool (`vj`)

```javascript
// Input
{
    file_path: string,      // Absolute path (required)
    content: string         // Content to write (required)
}

// Output
{
    type: "create" | "update",
    filePath: string,
    content: string,
    structuredPatch: PatchHunk[],
    originalFile: string | null
}
```

### Edit Tool

```javascript
// Input
{
    file_path: string,      // Absolute path (required)
    old_string: string,     // Text to replace (required)
    new_string: string,     // Replacement text (required)
    replace_all?: boolean   // Replace all occurrences
}

// Output
{
    type: "update",
    filePath: string,
    structuredPatch: PatchHunk[],
    originalFile: string
}
```

### Grep Tool (`tS`)

```javascript
// Input
{
    pattern: string,                    // Regex pattern (required)
    path?: string,                      // Search directory
    glob?: string,                      // File filter pattern
    output_mode?: "content" | "files_with_matches" | "count",
    "-i"?: boolean,                     // Case insensitive
    "-n"?: boolean,                     // Show line numbers
    "-C"?: number,                      // Context lines
    "-B"?: number,                      // Before context
    "-A"?: number                       // After context
}

// Output (content mode)
{
    matches: Array<{ file, line, content, context }>,
    totalMatches: number
}
```

### Glob Tool (`WB`)

```javascript
// Input
{
    pattern: string,        // Glob pattern (required)
    path?: string           // Search directory
}

// Output
{
    files: string[],        // Matching file paths (sorted by mtime)
    totalFiles: number
}
```

### Bash Tool

```javascript
// Input
{
    command: string,            // Shell command (required)
    description?: string,       // Human-readable description
    timeout?: number,           // Timeout in ms (default 120000)
    dangerouslyDisableSandbox?: boolean
}

// Output
{
    stdout: string,
    stderr: string,
    exitCode: number
}
```

### WebFetch Tool

```javascript
// Input
{
    url: string,            // URL to fetch (required)
    prompt: string          // Extraction prompt (required)
}

// Output
{
    content: string,        // Extracted content
    url: string,
    statusCode: number
}
```

### WebSearch Tool

```javascript
// Input
{
    query: string,                  // Search query (required)
    allowed_domains?: string[],     // Include only these domains
    blocked_domains?: string[]      // Exclude these domains
}

// Output
{
    results: Array<{ title, url, snippet }>,
    query: string
}
```

### Task/Agent Tool (`rj1`)

```javascript
// Input
{
    prompt: string,             // Task description (required)
    subagent_type: string,      // Agent type (required)
    description?: string,       // Short description (3-5 words)

    // v2.1.72+: Per-invocation model selection (restored)
    model?: string,             // Model ID override (e.g., "claude-haiku-3-5")

    resume?: string,            // Agent ID to resume
    run_in_background?: boolean,

    // v2.1.76: Declarative worktree isolation
    isolation?: "none" | "worktree",

    max_turns?: number,
    name?: string,              // Teammate name
    team_name?: string,         // Team name
    mode?: string               // Permission mode
}

// Output (completed)
{
    status: "completed",
    agentId: string,
    content: Array<{ type: "text", text: string }>,
    totalToolUseCount: number,
    totalDurationMs: number,
    totalTokens: number
}

// Output (background)
{
    status: "async_launched",
    agentId: string,
    outputFile: string
}
```

### EnterWorktree Tool (v2.1.72+)

```javascript
// Input
{
    branch?: string,            // Branch name (auto-generated if omitted)
    path?: string,              // Worktree path (temp dir if omitted)
    sparsePaths?: string[],     // Sparse checkout paths (v2.1.76)
    base?: string               // Base ref (defaults to HEAD)
}

// Output
{
    worktreePath: string,       // Path to created worktree
    branch: string,             // Branch name in worktree
    previousCwd: string,        // Previous CWD (pass to ExitWorktree)
    sparseCheckout: boolean      // Whether sparse checkout was enabled
}
```

### ExitWorktree Tool (v2.1.72+)

```javascript
// Input
{
    worktreePath: string,       // The worktreePath from EnterWorktree (required)
    previousCwd?: string,       // The previousCwd from EnterWorktree
    delete_branch?: boolean     // Delete the branch after exiting (default: false)
}

// Output
{
    success: boolean,
    previousCwd: string,        // Directory restored to
    branchDeleted: boolean,
    message: string
}
```

### CronCreate Tool (v2.1.76)

```javascript
// Input
{
    schedule: string,           // "5m", "30s", "1h" or cron expression (required)
    prompt: string,             // Prompt/command to run (required)
    type?: "agent" | "bash",    // Execution type (default: "agent")
    name?: string,              // Display name
    max_runs?: number,          // Max runs (default: unlimited)
    start_at?: string           // ISO 8601 start time
}

// Output
{
    jobId: string,              // Use with CronDelete
    nextRun: string,            // ISO 8601 next run time
    schedule: string            // Human-readable schedule
}
```

### CronDelete Tool (v2.1.76)

```javascript
// Input
{
    jobId: string               // Job ID from CronCreate (required)
}

// Output
{
    success: boolean,
    jobId: string,
    message: string
}
```

### CronList Tool (v2.1.76)

```javascript
// Input
{
    include_completed?: boolean  // Include completed jobs (default: false)
}

// Output
{
    jobs: Array<{
        jobId: string,
        name: string,
        schedule: string,
        type: "agent" | "bash",
        status: "active" | "completed" | "cancelled" | "error",
        runsCompleted: number,
        maxRuns: number | null,
        nextRun: string | null,
        lastRun: string | null,
        lastResult: string | null
    }>
}
```

### TaskStop Tool (`vW6`)

**Also known as:** `KillShell` (alias for backwards compatibility)

**Can kill:** `local_bash`, `local_agent`, `remote_agent` tasks

```javascript
// Input
{
    task_id: string,            // Task ID to stop (required)
    shell_id?: string           // Deprecated alias for task_id
}

// Output
{
    message: string,            // Status message
    task_id: string,            // Stopped task ID
    task_type: string,          // Task type (local_bash, local_agent, remote_agent)
    command?: string            // Command or description of stopped task
}
```

### TaskOutput Tool (`kW6`)

**Also known as:** `AgentOutputTool`, `BashOutputTool` (aliases for backwards compatibility)

```javascript
// Input
{
    task_id: string,            // Task ID to get output from (required)
    block?: boolean,            // Wait for completion (default: true)
    timeout?: number            // Max wait time in ms (default: 30000, max: 600000)
}

// Output
{
    retrieval_status: "success" | "timeout" | "not_ready",
    task: {
        task_id: string,
        task_type: string,
        status: string,
        description: string,
        output: string,
        exitCode?: number,      // For local_bash tasks
        prompt?: string,        // For local_agent tasks
        error?: string          // If task failed
    }
}
```

### TaskList Tool (`Ll4`)

```javascript
// Input: {} (no parameters)

// Output
{
    tasks: Array<{
        id: string,
        subject: string,
        status: "pending" | "in_progress" | "completed",
        owner?: string,
        blockedBy: string[]
    }>
}
```

### TaskCreate Tool (`Nh`)

```javascript
// Input (v2.1.76: activeForm is now optional)
{
    subject: string,            // Brief title for the task (required)
    description: string,        // Detailed description (required)
    activeForm?: string,        // Present continuous form for spinner (optional in v2.1.76)
    metadata?: object           // Arbitrary metadata for tracking
}

// Output
{
    task: {
        id: string,
        subject: string
    }
}
```

### TaskUpdate Tool (`DR`)

```javascript
// Input
{
    taskId: string,             // Task ID to update (required)
    subject?: string,
    description?: string,
    activeForm?: string,
    status?: "pending" | "in_progress" | "completed" | "deleted",
    owner?: string,
    addBlocks?: string[],       // Tasks that wait on this one
    addBlockedBy?: string[],    // Tasks that must complete first
    metadata?: object
}

// Output
{
    success: boolean,
    taskId: string,
    updatedFields: string[],
    error?: string,
    statusChange?: { from: string, to: string }
}
```

### TodoWrite Tool (`bO`)

**Note:** Mutually exclusive with TaskCreate/TaskUpdate. Enabled when structured tasks are disabled.

```javascript
// Input
{
    todos: Array<{
        content: string,        // Task description
        status: "pending" | "in_progress" | "completed",
        activeForm?: string     // Present continuous form for spinner
    }>
}

// Output
{
    oldTodos: Array<...>,       // Previous todo list
    newTodos: Array<...>        // New todo list (before auto-clear)
}

// Behavior:
// - Replaces entire todo list (not incremental)
// - Auto-clears when all items are "completed"
// - Isolated per-agent (each agent has its own list)
```

### AskUserQuestion Tool (`TH`)

```javascript
// Input
{
    questions: Array<{
        question: string,       // Full question text
        header: string,         // Short label (max 12 chars)
        multiSelect?: boolean,  // Allow multiple selections
        options: Array<{
            label: string,      // Display text
            description: string,// Explanation
            markdown?: string   // Preview content
        }>
    }>,                         // 1-4 questions
    answers?: object           // Filled by permission UI
}

// Output
{
    questions: Array<any>,
    answers: Record<string, string>  // question → answer
}
```

### EnterPlanMode Tool (`N_6`)

```javascript
// Input: {} (no parameters)

// Output
{
    message: string            // Instructions for planning phase
}
```

### TeamCreate Tool (`vh`)

```javascript
// Input
{
    team_name: string,         // Team name (required)
    description?: string,      // Team purpose
    agent_type?: string        // Leader agent type
}

// Output
{
    success: boolean,
    team_name: string,
    leader_agent_id: string,
    task_list_id: string
}
```

### Skill Tool (`wt`)

```javascript
// Input
{
    skill: string,             // Skill name to invoke
    args?: string              // Optional arguments
}

// Output: Varies by skill
```

### ToolSearch Tool (`dM`)

```javascript
// Input
{
    query: string              // Keywords, "select:<name>", or "+server keywords"
}

// Output
{
    tools: Array<{
        name: string,
        description: string,
        inputSchema: object
    }>
}
```

---

## Permission Levels

| Level | Tools | Behavior |
|-------|-------|----------|
| **Auto-Allow** | Read, Glob, Grep | No user confirmation needed |
| **User Prompt** | Write, Edit, Bash, Task | User must approve each use |
| **Auto-Deny** | Blocked paths | Automatically rejected |

---

## Execution Properties

| Tool | Concurrency Safe | Read-Only | Streaming |
|------|-----------------|-----------|-----------|
| Read | Yes | Yes | No |
| Write | No | No | No |
| Edit | No | No | No |
| Grep | Yes | Yes | No |
| Glob | Yes | Yes | No |
| Bash | No | No | Yes |
| WebFetch | Yes | Yes | No |
| WebSearch | Yes | Yes | No |
| Task | No | No | Yes |
| TaskStop | Yes | No | No |
| TaskOutput | Yes | Yes | No |
| TaskList | Yes | Yes | No |
| TaskGet | Yes | Yes | No |
| TaskCreate | Yes | No | No |
| TaskUpdate | Yes | No | No |
| TodoWrite | Yes | No | No |
| TeamCreate | No | No | No |
| TeamDelete | No | No | No |
| SendMessage | Yes | No | No |
| EnterPlanMode | Yes | Yes | No |
| ExitPlanMode | Yes | Yes | No |
| AskUserQuestion | Yes | Yes | No |
| Skill | No | No | No |
| ToolSearch | Yes | Yes | No |
| EnterWorktree | No | No | No |
| ExitWorktree | No | No | No |
| CronCreate | Yes | No | No |
| CronDelete | Yes | No | No |
| CronList | Yes | Yes | No |

---

## Symbol Index

> **Validated against v2.1.76 source** - All symbols verified in source code.

### Tool Objects

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `L9` | FileReadTool | chunks.90.mjs:2052 | tool object |
| `xX` | FileWriteTool | chunks.139.mjs:45 | tool object |
| `pX` | EditTool | chunks.170.mjs:1116 | tool object |
| `Vl` | NotebookEditTool | chunks.139.mjs:1200 | tool object |
| `bb` | GrepTool | chunks.139.mjs:482 | tool object |
| `rg` | GlobTool | chunks.139.mjs:880 | tool object |
| `J4` | BashTool | chunks.172.mjs:84 | tool object |
| `QW6` | AgentTool | chunks.136.mjs:1512 | tool object |
| `Uk1` | TaskStopTool | chunks.143.mjs:1651 | tool object |
| `ck1` | TaskOutputTool | chunks.143.mjs:2036 | tool object |
| `TAq` | TaskCreateTool | chunks.144.mjs:2839 | tool object |
| `hAq` | TaskGetTool | chunks.144.mjs:2991 | tool object |
| `rAq` | TaskListTool | chunks.145.mjs:417 | tool object |
| `gAq` | TaskUpdateTool | chunks.145.mjs:136 | tool object |
| `xv` | TodoWriteTool | chunks.84.mjs:1970 | tool object |
| `m66` | SkillTool | chunks.137.mjs:46 | tool object |
| `BX` | WebFetchTool | chunks.143.mjs:1308 | tool object |
| `lk1` | WebSearchTool | chunks.143.mjs:2393 | tool object |
| `Ki6` | EnterPlanModeTool | chunks.144.mjs:1579 | tool object |
| `zD` | ExitPlanModeTool | chunks.143.mjs:2802 | tool object |
| `TbY` | CronCreateTool | chunks.145.mjs:950 | tool object |
| `VbY` | CronDeleteTool | chunks.145.mjs:1066 | tool object |
| `ybY` | CronListTool | chunks.145.mjs:1173 | tool object |
| `wF8` | LSPTool | chunks.144.mjs:877 | tool object |
| `dK` | findTool | chunks.56.mjs:1592 | function |
| `ng` | getAllTools | chunks.145.mjs:2781 | function |

### Tool Names (Constants)

| Obfuscated | Readable | Value | File:Line |
|------------|----------|-------|-----------|
| `s7` | TOOL_NAME_READ | "Read" | chunks.56.mjs:173 |
| `_K` | TOOL_NAME_WRITE | "Write" | chunks.56.mjs:1234 |
| `R4` | TOOL_NAME_EDIT | "Edit" | chunks.56.mjs:102 |
| `bJ` | TOOL_NAME_NOTEBOOK_EDIT | "NotebookEdit" | chunks.56.mjs:1240 |
| `N9` | TOOL_NAME_GREP | "Grep" | chunks.56.mjs:1215 |
| `qz` | TOOL_NAME_GLOB | "Glob" | chunks.56.mjs:1192 |
| `Q7` | TOOL_NAME_BASH | "Bash" | chunks.54.mjs:2264 |
| `r4` | TOOL_NAME_AGENT | "Agent" | chunks.40.mjs:406 |
| `I46` | TOOL_NAME_TASK | "Task" | chunks.40.mjs:408 |
| `OC` | TOOL_NAME_TASK_STOP | "TaskStop" | chunks.40.mjs:412 |
| `$C` | TOOL_NAME_TASK_OUTPUT | "TaskOutput" | - |
| `TR` | TOOL_NAME_TASK_CREATE | "TaskCreate" | chunks.90.mjs:2592 |
| `lt` | TOOL_NAME_TASK_GET | "TaskGet" | chunks.91.mjs:41 |
| `it` | TOOL_NAME_TASK_LIST | "TaskList" | chunks.91.mjs:43 |
| `ck` | TOOL_NAME_TASK_UPDATE | "TaskUpdate" | chunks.90.mjs:2594 |
| `MB` | TOOL_NAME_TODO_WRITE | "TodoWrite" | chunks.84.mjs:1401 |
| `sO` | TOOL_NAME_WEB_FETCH | "WebFetch" | chunks.56.mjs:80 |
| `jv` | TOOL_NAME_WEB_SEARCH | "WebSearch" | chunks.56.mjs:1287 |
| `dt` | TOOL_NAME_ENTER_PLAN_MODE | "EnterPlanMode" | chunks.90.mjs:3121 |
| `aJ` | TOOL_NAME_EXIT_PLAN_MODE | "ExitPlanMode" | chunks.90.mjs:507 |
| `Fw` | TOOL_NAME_ASK_USER_QUESTION | "AskUserQuestion" | chunks.90.mjs:3123 |
| `oH` | TOOL_NAME_SKILL | "Skill" | chunks.90.mjs:2596 |
| `ER` | TOOL_NAME_CRON_CREATE | "CronCreate" | chunks.91.mjs:192 |
| `ed` | TOOL_NAME_CRON_DELETE | "CronDelete" | chunks.91.mjs:194 |
| `SW6` | TOOL_NAME_CRON_LIST | "CronList" | chunks.91.mjs:196 |
| `vh` | TOOL_NAME_TEAM_CREATE | "TeamCreate" | - |
| `VK1` | TOOL_NAME_TEAM_DELETE | "TeamDelete" | - |
| `hI` | TOOL_NAME_SEND_MESSAGE | "SendMessage" | chunks.91.mjs:39 |

### Tool Whitelist Constants

| Obfuscated | Readable | Contents |
|------------|----------|----------|
| `Bj1` | BACKGROUND_AGENT_ALLOWED_TOOLS | TaskOutput, ExitPlanMode, EnterPlanMode, Task, AskUserQuestion, TaskStop |
| `VjA` | DELEGATE_ALLOWED_TOOLS_BASIC | Same as BACKGROUND_AGENT_ALLOWED_TOOLS |
| `L_6` | ALL_SAFE_TOOLS | Read, WebSearch, TodoWrite, Grep, WebFetch, Glob, Bash, Edit, Write, NotebookEdit, Skill, StructuredOutput, ToolSearch, SendMessage |
| `np7` | STRUCTURED_TASK_TOOLS | TaskCreate, TaskGet, TaskList, TaskUpdate |
| `R_6` | DELEGATE_ALLOWED_TOOLS | TeamCreate, TeamDelete, SendMessage, TaskCreate, TaskGet, TaskList, TaskUpdate, Task |

### Input Schemas

| Obfuscated | Readable | Tool |
|------------|----------|------|
| `OmY` | fileReadInputSchema | Read |
| `dBY` | fileWriteInputSchema | Write |
| `Z99` | grepInputSchema | Grep |
| `N99` | globInputSchema | Glob |
| `oVY` | agentInputSchema | Task |
| `ANY` | agentOutputSchema | Task |
| `dyY` | taskStopInputSchema | TaskStop |
| `iyY` | taskOutputInputSchema | TaskOutput |
| `wCY` | askQuestionInputSchema | AskUserQuestion |
| `Sf5` | todoWriteInputSchema | TodoWrite |

### Key Functions

| Obfuscated | Readable | Purpose | File:Line |
|------------|----------|---------|-----------|
| `dK` | findTool | Find tool by name/alias | chunks.56.mjs:1592 |
| `z3` | matchesToolNameOrAlias | Helper for findTool | chunks.56.mjs:1588 |
| `ng` | getAllTools | Returns all built-in tools | chunks.145.mjs:2781 |
| `g4` | resolvePath | Path resolution | chunks.10.mjs:1159 |
| `AX` | detectEncoding | File encoding detection | chunks.134.mjs |
| `ft` | writeFileWithEncoding | Encoding-aware file write | chunks.134.mjs |
| `Vg1` | getKillHandlerForType | Get kill handler for task type | chunks.142.mjs:1652 |
| `IhY` | getAllKillHandlers | Returns all kill handlers | chunks.142.mjs:1648 |
| `EW6` | buildTaskSnapshot | Task output builder | chunks.139.mjs:1687 |
| `nyY` | pollUntilDone | Task output polling | chunks.139.mjs:1716 |
| `WM` | getTaskList | Get structured task list | chunks.140.mjs |
| `lg` | findTaskById | Task lookup by ID | chunks.140.mjs |
| `n_1` | createTask | Create task in list | chunks.140.mjs |
| `sq6` | deleteTask | Delete task from list | chunks.141.mjs |

### Kill Handlers (TaskStop)

| Obfuscated | Readable | Task Type | Kill Function |
|------------|----------|-----------|---------------|
| `Lf6` | LocalBashTask | `local_bash` | `wQ6` (kills shell process) |
| `Fk1` | LocalAgentTask | `local_agent` | `x66` (aborts agent) |
| `Fn4` | RemoteAgentTask | `remote_agent` | Handler method |

---

## v2.1.76 Notable Changes

### New tools
- `EnterWorktree` (added in v2.1.72, documented here): Manual git worktree creation
- `ExitWorktree` (added in v2.1.72): Manual git worktree cleanup — pairs with EnterWorktree
- `CronCreate` (new in v2.1.76): Schedule recurring tasks
- `CronDelete` (new in v2.1.76): Cancel scheduled tasks
- `CronList` (new in v2.1.76): List active cron jobs

### Modified tools
- **Agent/Task tool** (`rj1`): `model` parameter restored in v2.1.72; `isolation: "worktree"` added in v2.1.76
- **TaskCreate**: `activeForm` field is now optional (was required in v2.1.38)
- **Bash**: Readonly whitelist expanded with `lsof`, `pgrep`, `fmt`, `comm`, `seq`
