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
    ├─→ local_bash  → gj1.kill() → hjA() → shellCommand.kill()
    │
    ├─→ local_agent → B_6.kill() → na()   → abortController.abort()
    │
    └─→ remote_agent → Qi4.kill()        → Status update only (local)
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

### Tool Objects

| Obfuscated | Readable | File | Type |
|------------|----------|------|------|
| `i5` | FileReadTool | chunks.146.mjs | object |
| `sW` | EditTool | chunks.134.mjs:2124 | object |
| `vj` | FileWriteTool | chunks.146.mjs:436 | object |
| `tS` | GrepTool | chunks.76.mjs:1129 | object |
| `WB` | GlobTool | chunks.76.mjs:1495 | object |
| `rj1` | AgentTool | chunks.132.mjs:85 | object |
| `vW6` | TaskStopTool | chunks.139.mjs:1537 | object |
| `kW6` | TaskOutputTool | chunks.139.mjs:1922 | object |
| `$l4` | TaskGetTool | chunks.140.mjs:2954 | object |
| `Ll4` | TaskListTool | chunks.141.mjs:300 | object |
| `bO` | TodoWriteTool | chunks.48.mjs:773 | object |
| `gd` | NotebookEditTool | chunks.134.mjs | object |
| `wt` | SkillTool | chunks.132.mjs | object |
| `dM` | ToolSearchTool | chunks.140.mjs | object |

### Tool Names (Constants)

| Obfuscated | Readable | Value |
|------------|----------|-------|
| `Jq` | TOOL_NAME_READ | "Read" |
| `f5` | TOOL_NAME_WRITE | "Write" |
| `bq` | TOOL_NAME_EDIT | "Edit" |
| `jM` | TOOL_NAME_NOTEBOOK_EDIT | "NotebookEdit" |
| `s9` | TOOL_NAME_GREP | "Grep" |
| `Jz` | TOOL_NAME_GLOB | "Glob" |
| `JL` | TOOL_NAME_WEB_SEARCH | "WebSearch" |
| `xO` | TOOL_NAME_WEB_FETCH | "WebFetch" |
| `fK` | TOOL_NAME_AGENT | "Task" |
| `h4` | TOOL_NAME_BASH | "Bash" |
| `bj1` | TOOL_NAME_TASK_STOP | "TaskStop" |
| `uj1` | TOOL_NAME_TASK_OUTPUT | "TaskOutput" |
| `NK1` | TOOL_NAME_TASK_GET | "TaskGet" |
| `TK1` | TOOL_NAME_TASK_LIST | "TaskList" |
| `Nh` | TOOL_NAME_TASK_CREATE | "TaskCreate" |
| `DR` | TOOL_NAME_TASK_UPDATE | "TaskUpdate" |
| `cg` | TOOL_NAME_TODO_WRITE | "TodoWrite" |
| `vh` | TOOL_NAME_TEAM_CREATE | "TeamCreate" |
| `VK1` | TOOL_NAME_TEAM_DELETE | "TeamDelete" |
| `iB` | TOOL_NAME_SEND_MESSAGE | "SendMessage" |
| `N_6` | TOOL_NAME_ENTER_PLAN_MODE | "EnterPlanMode" |
| `bW` | TOOL_NAME_EXIT_PLAN_MODE | "ExitPlanMode" |
| `TH` | TOOL_NAME_ASK_USER_QUESTION | "AskUserQuestion" |
| `NJ` | TOOL_NAME_SKILL | "Skill" |
| `dM` | TOOL_NAME_TOOL_SEARCH | "ToolSearch" |
| `cD` | STRUCTURED_OUTPUT_NAME | "StructuredOutput" |
| — | TOOL_NAME_ENTER_WORKTREE | "EnterWorktree" (v2.1.72+) |
| — | TOOL_NAME_EXIT_WORKTREE | "ExitWorktree" (v2.1.72+) |
| — | TOOL_NAME_CRON_CREATE | "CronCreate" (v2.1.76) |
| — | TOOL_NAME_CRON_DELETE | "CronDelete" (v2.1.76) |
| — | TOOL_NAME_CRON_LIST | "CronList" (v2.1.76) |

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

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| `g4` | resolvePath | Path resolution |
| `AX` | detectEncoding | File encoding detection |
| `ft` | writeFileWithEncoding | Encoding-aware file write |
| `dR` | agentLoopRunner | Agent execution loop |
| `NR` | generateAgentId | Task ID generation |
| `lm` | validateBashCommand | Bash security validation |
| `Vg1` | getKillHandlerForType | Get kill handler for task type |
| `IhY` | getAllKillHandlers | Returns all kill handlers |
| `hjA` | killBashTask | Terminate bash task |
| `EW6` | buildTaskSnapshot | Task output builder |
| `nyY` | pollUntilDone | Task output polling |
| `M_6` | readFullOutput | Read task output file |
| `WM` | getTaskList | Get structured task list |
| `lg` | findTaskById | Task lookup by ID |
| `n_1` | createTask | Create task in list |
| `sq6` | deleteTask | Delete task from list |

### Kill Handlers (TaskStop)

| Obfuscated | Readable | Task Type | Kill Function |
|------------|----------|-----------|---------------|
| `gj1` | LocalBashTask | `local_bash` | `hjA` (kills shell process) |
| `B_6` | LocalAgentTask | `local_agent` | `na` (aborts agent) |
| `Qi4` | RemoteAgentTask | `remote_agent` | Handler method |

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
