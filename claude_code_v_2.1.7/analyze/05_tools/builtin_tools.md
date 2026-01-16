# Built-in Tools (Claude Code v2.1.7)

This document catalogs all built-in tools available in Claude Code v2.1.7.

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

---

## Overview

Claude Code provides a comprehensive set of built-in tools that enable file operations, code search, web access, task management, and more. Each tool has defined input/output schemas and permission requirements.

### Tool Interface

Each tool implements the following interface:

```typescript
interface Tool {
  name: string;                      // Unique tool identifier
  maxResultSizeChars: number;        // Max result size
  strict?: boolean;                  // Strict schema validation
  input_examples?: object[];         // Example inputs for API
  description(): Promise<string>;    // Tool description for Claude
  prompt(): Promise<string>;         // Detailed usage instructions
  inputSchema: ZodSchema;            // Zod schema for input validation
  outputSchema: ZodSchema;           // Zod schema for output structure
  userFacingName?: string | function; // Display name for UI
  isEnabled(): boolean;              // Whether tool is currently enabled
  isConcurrencySafe(input?): boolean; // Can run in parallel with other tools
  isReadOnly(input?): boolean;       // Whether tool modifies files
  isSearchOrReadCommand?(input?): {isSearch: boolean, isRead: boolean};
  getPath?(input): string;           // Extract file path from input
  checkPermissions?(input, context): Promise<PermissionResult>;
  validateInput?(input, context): Promise<ValidationResult>;
  call(input, context, toolUseId, metadata, progressCallback?): Promise<ToolResult>;
  mapToolResultToToolResultBlockParam(result, toolUseId): ToolResultBlock;
  renderToolUseMessage?(input, options): ReactNode;
  renderToolResultMessage?(result, options): ReactNode;
  renderToolUseErrorMessage?(error, options): ReactNode;
  renderToolUseRejectedMessage?(input, options): ReactNode;
  renderToolUseProgressMessage?(input, options): ReactNode;
}
```

---

## Tool Groupings

Tools are organized into categories for UI and permission purposes:

```javascript
// ============================================
// Tool Groupings - XG9 function
// Location: chunks.144.mjs:1259-1281
// ============================================

// ORIGINAL (for source lookup):
XG9 = () => ({
  READ_ONLY: {
    name: "Read-only tools",
    toolNames: new Set([as.name, Tc.name, V$.name, v5.name, hF.name, vD.name, XK1.name, ZK1.name, JK1.name, Ud.name, qd.name])
  },
  EDIT: {
    name: "Edit tools",
    toolNames: new Set([J$.name, X$.name, qf.name])
  },
  EXECUTION: {
    name: "Execution tools",
    toolNames: new Set([o2.name, void 0].filter(Boolean))
  },
  MCP: {
    name: "MCP tools",
    toolNames: new Set,
    isMcp: !0
  },
  OTHER: {
    name: "Other tools",
    toolNames: new Set
  }
})

// READABLE (for understanding):
getToolGroupings = () => ({
  READ_ONLY: {
    name: "Read-only tools",
    toolNames: new Set([
      GlobTool.name,        // as
      GrepTool.name,        // Tc
      TaskTool.name,        // V$
      ReadTool.name,        // v5
      WebFetchTool.name,    // hF
      WebSearchTool.name,   // vD
      TaskOutputTool.name,  // XK1
      KillShellTool.name,   // ZK1
      ...
    ])
  },
  EDIT: {
    name: "Edit tools",
    toolNames: new Set([
      EditTool.name,        // J$
      WriteTool.name,       // X$
      NotebookEditTool.name // qf
    ])
  },
  EXECUTION: {
    name: "Execution tools",
    toolNames: new Set([BashTool.name])  // o2
  },
  MCP: { name: "MCP tools", toolNames: new Set, isMcp: true },
  OTHER: { name: "Other tools", toolNames: new Set }
})
```

---

## File Operation Tools

### Read Tool

**Name**: `Read` (constant: `z3`)
**Object**: `v5`
**Location**: chunks.86.mjs:561-827

**Description**: Reads a file from the local filesystem. Supports text files, images, PDFs, and Jupyter notebooks.

**Input Schema** (`je8` - chunks.86.mjs:522-526):
```typescript
{
  file_path: string;  // The absolute path to the file to read (required)
  offset?: number;    // The line number to start reading from
  limit?: number;     // The number of lines to read
}
```

**Output Schema** (`Pe8` - chunks.86.mjs:526-561):
```typescript
// Discriminated union based on file type
type ReadOutput =
  | { type: "text"; file: { filePath: string; content: string; numLines: number; startLine: number; totalLines: number } }
  | { type: "image"; file: { base64: string; type: ImageMimeType; originalSize: number; dimensions?: ImageDimensions } }
  | { type: "notebook"; file: { filePath: string; cells: NotebookCell[] } }
  | { type: "pdf"; file: { filePath: string; base64: string; originalSize: number } }
```

**Properties**:
- `isConcurrencySafe()`: `true` - Can run in parallel
- `isReadOnly()`: `true` - Does not modify files
- `strict`: `true` - Uses strict schema validation

**Validation Logic** (chunks.86.mjs:612-669):
1. Check permission denied paths (errorCode: 1)
2. Allow UNC paths (`\\` or `//`) without existence check
3. Check file existence (errorCode: 2)
4. Reject binary files based on extension (errorCode: 4)
5. Reject empty image files (errorCode: 5)
6. Check file size limits (errorCode: 6)

**Key Implementation Details**:
- Stores read state in `readFileState` Map for edit validation
- Supports special handling for images (`png`, `jpg`, `jpeg`, `gif`, `webp`)
- Handles Jupyter notebooks (`.ipynb`) with cell parsing
- PDF support when `IIA()` (PDF feature flag) is enabled

---

### Write Tool

**Name**: `Write` (constant: `BY`)
**Object**: `X$`
**Location**: chunks.115.mjs:1269-1442

**Description**: Writes a file to the local filesystem. Overwrites existing files if present.

**Input Schema** (`Lu5` - chunks.115.mjs:1260-1263):
```typescript
{
  file_path: string;  // The absolute path to the file to write (required)
  content: string;    // The content to write to the file (required)
}
```

**Output Schema** (`o$0` - chunks.115.mjs:1263-1269):
```typescript
{
  type: "create" | "update";  // Whether new file or update
  filePath: string;           // Path to the written file
  content: string;            // Content that was written
  structuredPatch: Patch[];   // Diff showing changes
  originalFile: string | null; // Original content (null for new files)
}
```

**Properties**:
- `isConcurrencySafe()`: `false` - Must run sequentially
- `isReadOnly()`: `false` - Modifies files
- `strict`: `true`

**Validation Logic** (chunks.115.mjs:1308-1336):
1. Check permission denied paths (errorCode: 1)
2. If file exists, check it was read first (errorCode: 2)
3. Check file hasn't been modified since read (errorCode: 3)

**Read-Before-Write Enforcement**:
```javascript
// chunks.115.mjs:1321-1332
let J = Q.readFileState.get(B);
if (!J) return {
  result: !1,
  message: "File has not been read yet. Read it first before writing to it.",
  errorCode: 2
};
if (J) {
  if (mz(B) > J.timestamp) return {
    result: !1,
    message: "File has been modified since read...",
    errorCode: 3
  }
}
```

---

### Edit Tool

**Name**: `Edit` (constant: `I8`)
**Object**: `J$`
**Location**: chunks.115.mjs:779-1056

**Description**: Performs exact string replacements in files.

**Input Schema** (`xy2` - referenced at chunks.115.mjs:794):
```typescript
{
  file_path: string;       // The absolute path to the file to modify (required)
  old_string: string;      // The text to replace (required)
  new_string: string;      // The text to replace it with (required)
  replace_all?: boolean;   // Replace all occurrences (default: false)
}
```

**Output Schema** (`KW1`):
```typescript
{
  filePath: string;
  oldString: string;
  newString: string;
  originalFile: string;
  structuredPatch: Patch[];
  userModified: boolean;
  replaceAll: boolean;
}
```

**Properties**:
- `isConcurrencySafe()`: `false`
- `isReadOnly()`: `false`
- `strict`: `true`

**Validation Logic** (chunks.115.mjs:814-941):
1. Check `old_string !== new_string` (errorCode: 1)
2. Check permission denied paths (errorCode: 2)
3. Handle file creation when `old_string === ""` (errorCode: 3)
4. Check file existence (errorCode: 4)
5. Check not Jupyter notebook (errorCode: 5)
6. Check file was read first (errorCode: 6)
7. Check file not modified since read (errorCode: 7)
8. Check `old_string` found in file (errorCode: 8)
9. Check `old_string` is unique unless `replace_all` (errorCode: 9)

---

### Glob Tool

**Name**: `Glob` (constant: `lI`)
**Object**: `as`
**Location**: chunks.115.mjs:1971-2069

**Description**: Fast file pattern matching tool that works with any codebase size.

**Input Schema** (`ju5` - chunks.115.mjs:1963-1966):
```typescript
{
  pattern: string;   // The glob pattern to match files against (required)
  path?: string;     // The directory to search in (default: cwd)
}
```

**Output Schema** (`Tu5` - chunks.115.mjs:1966-1971):
```typescript
{
  durationMs: number;       // Time taken in milliseconds
  numFiles: number;         // Total number of files found
  filenames: string[];      // Array of matching file paths
  truncated: boolean;       // Whether results were truncated (limit: 100)
}
```

**Properties**:
- `isConcurrencySafe()`: `true`
- `isReadOnly()`: `true`
- `isSearchOrReadCommand()`: `{ isSearch: true, isRead: false }`

**Validation Logic** (chunks.115.mjs:2001-2020):
1. If path provided, check it exists (errorCode: 1)
2. Check path is a directory (errorCode: 2)

---

### Grep Tool

**Name**: `Grep` (constant: `DI`)
**Object**: `Tc`
**Location**: chunks.115.mjs:1620-1699+

**Description**: A powerful search tool built on ripgrep.

**Input Schema** (`Mu5` - chunks.115.mjs:1596-1610):
```typescript
{
  pattern: string;                              // Regex pattern to search (required)
  path?: string;                                // File or directory to search
  glob?: string;                                // Glob pattern to filter files
  output_mode?: "content" | "files_with_matches" | "count";  // Default: "files_with_matches"
  "-B"?: number;                                // Lines before match
  "-A"?: number;                                // Lines after match
  "-C"?: number;                                // Lines before and after
  "-n"?: boolean;                               // Show line numbers (default: true)
  "-i"?: boolean;                               // Case insensitive
  type?: string;                                // File type (js, py, rust, etc.)
  head_limit?: number;                          // Limit output lines
  offset?: number;                              // Skip first N entries
  multiline?: boolean;                          // Multiline mode
}
```

**Output Schema** (`_u5` - chunks.115.mjs:1611-1620):
```typescript
{
  mode?: "content" | "files_with_matches" | "count";
  numFiles: number;
  filenames: string[];
  content?: string;
  numLines?: number;
  numMatches?: number;
  appliedLimit?: number;
  appliedOffset?: number;
}
```

**Properties**:
- `isConcurrencySafe()`: `true`
- `isReadOnly()`: `true`
- `isSearchOrReadCommand()`: `{ isSearch: true, isRead: false }`
- `maxResultSizeChars`: 20000

---

### NotebookEdit Tool

**Name**: `NotebookEdit` (constant: `tq`)
**Object**: `qf`
**Location**: chunks.115.mjs:2075+

**Description**: Completely replaces the contents of a specific cell in a Jupyter notebook.

**Input Schema**:
```typescript
{
  notebook_path: string;                  // Absolute path to .ipynb file
  cell_id?: string;                       // Cell ID to edit
  new_source: string;                     // New source for the cell
  cell_type?: "code" | "markdown";        // Cell type
  edit_mode?: "replace" | "insert" | "delete";  // Default: "replace"
}
```

**Properties**:
- `isConcurrencySafe()`: `false`
- `isReadOnly()`: `false`

---

## Execution Tools

### Bash Tool

**Name**: `Bash` (constant: `X9`)
**Object**: `o2`
**Location**: chunks.124.mjs:1505-1752

**Description**: Executes bash commands in a persistent shell session with optional timeout.

**Input Schema** (`YV1` / `wd2` - chunks.124.mjs:1470-1492):
```typescript
{
  command: string;                  // The command to execute (required)
  timeout?: number;                 // Timeout in ms (max configurable)
  description?: string;             // Description of what command does
  run_in_background?: boolean;      // Run in background
  dangerouslyDisableSandbox?: boolean;  // Override sandbox mode
  _simulatedSedEdit?: {             // Internal: pre-computed sed edit
    filePath: string;
    newContent: string;
  };
}
```

**Output Schema** (`rq0` - chunks.124.mjs:1493-1504):
```typescript
{
  stdout: string;
  stderr: string;
  rawOutputPath?: string;
  interrupted: boolean;
  isImage?: boolean;
  backgroundTaskId?: string;
  backgroundedByUser?: boolean;
  dangerouslyDisableSandbox?: boolean;
  returnCodeInterpretation?: string;
  structuredContent?: ContentBlock[];
}
```

**Properties**:
- `isConcurrencySafe(input)`: Returns `this.isReadOnly(input)` - True for read-only commands
- `isReadOnly(input)`: Analyzes command to determine if read-only
- `maxResultSizeChars`: 30000
- `strict`: `true`

**Concurrency Safety Algorithm** (chunks.124.mjs:1517-1523):
```javascript
isConcurrencySafe(A) {
  return this.isReadOnly(A)  // Delegates to isReadOnly check
},
isReadOnly(A) {
  let Q = JV1(A.command);    // Parse command
  return BV1(A, Q).behavior === "allow"  // Check if auto-allowed (read-only)
}
```

**Read-Only Command Detection**:
```javascript
// chunks.124.mjs:1469
Ma5 = new Set(["find", "grep", "rg", "ag", "ack", "locate", "which", "whereis"])  // Search commands
Ra5 = new Set(["cat", "head", "tail", "less", "more", "wc", "stat", "file", "strings", "ls", "tree", "du"])  // Read commands
_a5 = new Set(["echo", "true", "false", ":"])  // Output commands
```

---

### KillShell Tool

**Name**: `KillShell` (constant: `GK1`)
**Object**: `ZK1`
**Location**: chunks.119.mjs:1490-1571

**Description**: Kills a running background bash shell by its ID.

**Input Schema** (`lp5` - chunks.119.mjs:1485-1487):
```typescript
{
  shell_id: string;  // The ID of the background shell to kill (required)
}
```

**Output Schema** (`ip5` - chunks.119.mjs:1487-1490):
```typescript
{
  message: string;   // Status message about the operation
  shell_id: string;  // The ID of the shell that was killed
}
```

**Properties**:
- `isConcurrencySafe()`: `true`
- `isReadOnly()`: `false`

**Validation Logic** (chunks.119.mjs:1511-1529):
1. Check shell exists in tasks (errorCode: 1)
2. Check task type is `local_bash` (errorCode: 2)

---

### TaskOutput Tool

**Name**: `TaskOutput` (constant: `aHA`)
**Object**: `XK1`
**Location**: chunks.119.mjs:1574-1760

**Description**: Retrieves output from a running or completed task (background shell, agent, or remote session).

**Input Schema** (`ap5` - chunks.119.mjs:1754-1758):
```typescript
{
  task_id: string;     // The task ID to get output from (required)
  block?: boolean;     // Whether to wait for completion (default: true)
  timeout?: number;    // Max wait time in ms (max: 600000)
}
```

**Output Schema**:
```typescript
{
  task_id: string;
  task_type: "local_bash" | "local_agent" | "remote_agent";
  status: string;
  description: string;
  output: string;
  exitCode?: number;      // For local_bash
  prompt?: string;        // For agents
  result?: string;        // For agents
  error?: string;         // For agents
}
```

**Properties**:
- `isConcurrencySafe()`: `true`
- `isReadOnly()`: `true`

---

## Web Tools

### WebFetch Tool

**Name**: `WebFetch` (constant: `cI`)
**Object**: `hF`
**Location**: chunks.119.mjs:1247-1424

**Description**: Fetches content from a URL and processes it using an AI model.

**Input Schema** (`dp5` - chunks.119.mjs:1236-1238):
```typescript
{
  url: string;     // The URL to fetch content from (required, validated)
  prompt: string;  // The prompt to run on the fetched content (required)
}
```

**Output Schema** (`cp5` - chunks.119.mjs:1239-1246):
```typescript
{
  bytes: number;       // Size of fetched content
  code: number;        // HTTP response code
  codeText: string;    // HTTP response code text
  result: string;      // Processed result
  durationMs: number;  // Time taken
  url: string;         // The URL that was fetched
}
```

**Properties**:
- `isConcurrencySafe()`: `true`
- `isReadOnly()`: `true`
- `maxResultSizeChars`: 100000

**Permission Checking** (chunks.119.mjs:1275-1332):
- Preapproved hosts list (`BK1`) checked first
- Then deny/ask/allow rules evaluated
- Domain-based permission key: `domain:${hostname}`

**Redirect Handling** (chunks.119.mjs:1373-1394):
- Detects redirects to different hosts
- Returns instruction to fetch redirect URL

---

### WebSearch Tool

**Name**: `WebSearch` (constant: `aR`)
**Object**: `vD`
**Location**: chunks.119.mjs:2110+

**Description**: Allows Claude to search the web and use results to inform responses.

**Input Schema**:
```typescript
{
  query: string;              // The search query (required, min 2 chars)
  allowed_domains?: string[]; // Only include results from these domains
  blocked_domains?: string[]; // Never include results from these domains
}
```

**Properties**:
- `isConcurrencySafe()`: `true`
- `isReadOnly()`: `true`

---

## Agent & Task Tools

### Task Tool

**Name**: `Task`
**Object**: `V$`
**Location**: chunks.91.mjs (referenced)

**Description**: Launch a new agent to handle complex, multi-step tasks autonomously.

**Input Schema**:
```typescript
{
  prompt: string;             // The task for the agent to perform (required)
  description: string;        // Short 3-5 word description (required)
  subagent_type: string;      // Type of specialized agent to use (required)
  model?: "sonnet" | "opus" | "haiku";  // Model to use
  max_turns?: number;         // Maximum agentic turns
  run_in_background?: boolean; // Run in background
  resume?: string;            // Agent ID to resume
}
```

**Properties**:
- `isConcurrencySafe()`: `true`
- `isReadOnly()`: `true`

---

### Skill Tool

**Name**: `Skill` (constant: `kF`)
**Object**: Defined in chunks.113.mjs:408-753+

**Description**: Execute a skill within the main conversation.

**Input Schema** (`Hf5`):
```typescript
{
  skill: string;   // The skill name (required)
  args?: string;   // Optional arguments for the skill
}
```

**Validation Logic** (chunks.113.mjs:765-801):
1. Skill format not empty (errorCode: 1)
2. Skill exists in registry (errorCode: 2)
3. Skill loads successfully (errorCode: 3)
4. Skill not disabled (errorCode: 4)
5. Skill is prompt type (errorCode: 5)

---

### AskUserQuestion Tool

**Name**: `AskUserQuestion` (constant: `zY`)
**Object**: Defined at chunks.119.mjs:2283-2680

**Description**: Allows Claude to ask the user questions during execution for clarification or decisions.

**Input Schema**:
```typescript
{
  questions: Question[];  // 1-4 questions to ask
  answers?: Record<string, string>;  // Collected answers
  metadata?: { source?: string };
}

interface Question {
  question: string;        // The question text
  header: string;          // Short label (max 12 chars)
  options: Option[];       // 2-4 options
  multiSelect: boolean;    // Allow multiple selections
}

interface Option {
  label: string;           // Display text (1-5 words)
  description: string;     // Explanation of option
}
```

---

## Mode Tools

### EnterPlanMode Tool

**Name**: `EnterPlanMode` (constant: `VK1`)
**Object**: Defined at chunks.120.mjs:519-536

**Description**: Transitions into plan mode where Claude can explore the codebase and design an implementation approach for user approval.

**Input Schema**: Empty object `{}`

**Properties**:
- Requires user approval to enter plan mode

---

### ExitPlanMode Tool

**Name**: `ExitPlanMode`
**Object**: (referenced)

**Description**: Signals that planning is complete and ready for user approval.

**Input Schema**:
```typescript
{
  allowedPrompts?: Array<{
    tool: "Bash";
    prompt: string;  // Semantic description of allowed action
  }>;
}
```

---

## Experimental/Conditional Tools

### LSP Tool (NEW in v2.1.7)

**Name**: `LSP` (constant: `Sg2`)
**Object**: Defined at chunks.119.mjs:3121, chunks.120.mjs:27+

**Description**: Language Server Protocol integration for enhanced code intelligence.

**Enabled when**: `process.env.ENABLE_LSP_TOOL` is set

**Input Schema** (`Ol5` - chunks.120.mjs:42-56):
```typescript
{
  filePath: string;        // Path to the file
  operation: LSPOperation; // LSP operation to perform
}
```

**Validation Logic** (chunks.120.mjs:55-85):
1. Schema validation (errorCode: 3)
2. File existence (errorCode: 1)
3. Path is file type (errorCode: 2)
4. File access (errorCode: 4)

---

## TodoWrite Tool

**Name**: `TodoWrite` (constant: `Bm`)
**Object**: `vD`
**Location**: chunks.59.mjs:402-481

**Description**: Create and manage a structured task list for the current coding session. Helps track progress, organize complex tasks, and demonstrate thoroughness to the user.

**Input Schema** (`SX8` - chunks.59.mjs:397-398):
```typescript
{
  todos: Array<{
    content: string;     // Task description (min 1 char)
    status: "pending" | "in_progress" | "completed";  // NX8 enum
    activeForm: string;  // Present continuous form (min 1 char)
  }>;
}
```

**Output Schema** (`xX8` - chunks.59.mjs:399-401):
```typescript
{
  oldTodos: TodoItem[];  // Todo list before the update
  newTodos: TodoItem[];  // Todo list after the update
}
```

**Properties**:
- `isConcurrencySafe()`: `false` - Must run sequentially
- `isReadOnly()`: `false` - Modifies app state
- `strict`: `true`
- `maxResultSizeChars`: 100000

**Input Examples** (chunks.59.mjs:406-421):
```javascript
[
  { todos: [{ content: "Fix the login bug", status: "pending", activeForm: "Fixing the login bug" }] },
  { todos: [
    { content: "Implement feature", status: "completed", activeForm: "Implementing feature" },
    { content: "Write unit tests", status: "in_progress", activeForm: "Writing unit tests" }
  ]}
]
```

**Permission Check** (chunks.59.mjs:443-448):
```javascript
async checkPermissions(input) {
  return { behavior: "allow", updatedInput: input };  // Always allowed
}
```

**Call Implementation** (chunks.59.mjs:454-472):
```javascript
// READABLE (for understanding):
async call({ todos }, context) {
  const appState = await context.getAppState();
  const agentId = context.agentId ?? generateId();
  const oldTodos = appState.todos[agentId] ?? [];

  // If all todos completed, clear the list
  const newTodos = todos.every((t) => t.status === "completed") ? [] : todos;

  context.setAppState((state) => ({
    ...state,
    todos: { ...state.todos, [agentId]: newTodos }
  }));

  return { data: { oldTodos, newTodos } };
}
```

**Result Mapping** (chunks.59.mjs:474-479):
```javascript
mapToolResultToToolResultBlockParam(data, toolUseId) {
  return {
    tool_use_id: toolUseId,
    type: "tool_result",
    content: "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable"
  };
}
```

**Todo Reminder System** (chunks.148.mjs:108, chunks.132.mjs:105-121):
The system tracks `turnsSinceLastTodoWrite` and generates reminders when the tool hasn't been used recently.

---

## Tool Properties Summary

| Tool | Name | Concurrency Safe | Read Only | Strict |
|------|------|-----------------|-----------|--------|
| Read | `z3` | Yes | Yes | Yes |
| Write | `BY` | No | No | Yes |
| Edit | `I8` | No | No | Yes |
| Glob | `lI` | Yes | Yes | No |
| Grep | `DI` | Yes | Yes | Yes |
| NotebookEdit | `tq` | No | No | - |
| Bash | `X9` | Conditional | Conditional | Yes |
| KillShell | `GK1` | Yes | No | - |
| TaskOutput | `aHA` | Yes | Yes | - |
| WebFetch | `cI` | Yes | Yes | - |
| WebSearch | `aR` | Yes | Yes | - |
| Task | - | Yes | Yes | - |
| Skill | `kF` | - | - | - |
| AskUserQuestion | `zY` | - | - | - |
| EnterPlanMode | `VK1` | - | - | - |
| LSP | `Sg2` | - | - | - |

---

## MCP Tools (Dynamic)

MCP (Model Context Protocol) tools are dynamically loaded from external servers. Unlike built-in tools, MCP tools are registered at runtime.

### MCP Tool Identification

MCP tools are identified by their name prefix:

```javascript
// ============================================
// MCP Tool Detection
// Location: chunks.134.mjs:672, chunks.138.mjs:2832
// ============================================

// Check if tool is MCP-provided
const isMcp = toolName.startsWith("mcp__");

// MCP tool name format: mcp__{server_name}__{tool_name}
// Example: mcp__filesystem__read_file
```

### MCP Tool Registration

```javascript
// ============================================
// MCP Tool Collection
// Location: chunks.132.mjs:607
// ============================================

// Built-in tools combined with MCP tools
const allTools = deduplicateByName([builtinTools, ...mcpContext.mcp.tools], "name");
```

### MCP Client Management (chunks.149.mjs)

```javascript
// ============================================
// MCP Client Properties
// Location: chunks.149.mjs:1413+
// ============================================

interface MCPClient {
  mcpClients: Map<string, Client>;  // Active MCP connections
  updateClients(): void;             // Refresh client list
  updateTools(): void;               // Refresh tool registry
  updateResources(): void;           // Refresh resource registry
}
```

### MCP Tool Schema Loading

```javascript
// ============================================
// BJ9 - MCP Tool Schema Loader
// Location: chunks.147.mjs:1-150
// ============================================

// READABLE (for understanding):
async function loadToolSchemas(tools, context) {
  // Filter tools based on MCP eligibility (lines 16-22)
  const eligibleTools = tools.filter(tool => {
    if (tool.isMcp && !context.includeMcp) return false;
    return true;
  });

  // Parallel schema loading for all tools (lines 27-34)
  const schemas = await Promise.all(
    eligibleTools.map(tool => loadToolSchema(tool, context))
  );

  // Track dynamic loading for MCP tools (lines 35-39)
  for (const tool of eligibleTools) {
    if (tool.isMcp) {
      trackDynamicToolLoading(tool.name);
    }
  }

  return schemas;
}
```

### MCP Tool Permission Handling

```javascript
// ============================================
// MCP Tool Permission Check
// Location: chunks.149.mjs:2959
// ============================================

// Show permission request UI for MCP tools
l("tengu_tool_use_show_permission_request", {
  toolName: toolName,
  toolUseID: toolUseId,
  isMcp: true
});
```

### MCP CLI Documentation Generator

```javascript
// ============================================
// oY9 - MCP CLI Prompt Generator
// Location: chunks.146.mjs:2622-2737
// ============================================

// Generates prompt section explaining MCP CLI commands
// Mandatory: Call `mcp-cli info <server>/<tool>` BEFORE any tool calls

// Example output:
// "MCP CLI Commands:
//  - mcp-cli list: List all MCP servers and tools
//  - mcp-cli info <server>/<tool>: Get detailed tool info
//  - mcp-cli call <server>/<tool> [args]: Execute MCP tool"
```

### MCP Tool Telemetry

MCP tools include additional telemetry fields:

```javascript
// All MCP tool events include:
{
  isMcp: true,
  mcpServerType: serverType  // Type of MCP server
}
```

### MCP Tool Properties

MCP tools have additional properties compared to built-in tools:

```typescript
interface MCPTool extends Tool {
  isMcp: true;                  // Always true for MCP tools
  mcpServerName: string;        // Server that provides this tool
  mcpServerType: string;        // Server type (e.g., "filesystem", "database")
}
```

---

## Key Symbol Mappings

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| v5 | ReadTool | chunks.86.mjs:561 | object |
| X$ | WriteTool | chunks.115.mjs:1269 | object |
| J$ | EditTool | chunks.115.mjs:779 | object |
| as | GlobTool | chunks.115.mjs:1971 | object |
| Tc | GrepTool | chunks.115.mjs:1620 | object |
| o2 | BashTool | chunks.124.mjs:1505 | object |
| ZK1 | KillShellTool | chunks.119.mjs:1490 | object |
| XK1 | TaskOutputTool | chunks.119.mjs:1760+ | object |
| hF | WebFetchTool | chunks.119.mjs:1247 | object |
| z3 | READ_TOOL_NAME | chunks.55.mjs:1200 | constant |
| BY | WRITE_TOOL_NAME | chunks.58.mjs:3118 | constant |
| I8 | EDIT_TOOL_NAME | chunks.55.mjs:1149 | constant |
| X9 | BASH_TOOL_NAME | chunks.53.mjs:1475 | constant |
| GK1 | KILLSHELL_TOOL_NAME | chunks.119.mjs:1427 | constant |
| aHA | TASKOUTPUT_TOOL_NAME | chunks.119.mjs:1574 | constant |
| cI | WEBFETCH_TOOL_NAME | chunks.55.mjs:1128 | constant |
| XG9 | getToolGroupings | chunks.144.mjs:1259 | function |
