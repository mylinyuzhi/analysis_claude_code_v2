# Tool Registry Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of tool registration, discovery, lookup, and filtering mechanisms.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `findTool` (dK) - Tool lookup by name - chunks.56.mjs:1592
- `filterToolsByMode` (Xk8) - Mode-aware tool filtering - chunks.93.mjs:1568
- `getDynamicToolSet` (ng) - Get global tool aliases - inferred
- `getDefaultTools` - Get built-in tool set - inferred

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TOOL REGISTRY ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Tool Sources:                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Built-in Tools (getDefaultTools)                            │    │
│  │  ├─ File System: Read, Write, Edit, NotebookEdit            │    │
│  │  ├─ Search: Grep, Glob                                       │    │
│  │  ├─ Execution: Bash                                          │    │
│  │  ├─ Web: WebFetch, WebSearch                                 │    │
│  │  ├─ Agent: Agent                                             │    │
│  │  ├─ Task: TaskCreate, TaskUpdate, TaskGet, TaskList, TodoWrite│   │
│  │  ├─ Team: TeamCreate, TeamDelete, SendMessage               │    │
│  │  ├─ Plan Mode: EnterPlanMode, ExitPlanMode, AskUserQuestion │    │
│  │  ├─ Skills: Skill                                            │    │
│  │  ├─ Worktree: EnterWorktree, ExitWorktree                    │    │
│  │  ├─ Cron: CronCreate, CronDelete, CronList                   │    │
│  │  └─ Task Control: TaskStop, TaskOutput                       │    │
│  └─────────────────────────────────────────────────────────────┘    │
│       │                                                               │
│       ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  MCP Tools (fetchMcpTools)                                   │    │
│  │  ├─ Prefix: mcp__<serverName>__<toolName>                   │    │
│  │  ├─ Discovered via tools/list JSON-RPC                       │    │
│  │  └─ Annotations: readOnlyHint, destructiveHint, openWorldHint│   │
│  └─────────────────────────────────────────────────────────────┘    │
│       │                                                               │
│       ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Skill Tools (from slash commands)                          │    │
│  │  ├─ Loaded from CLAUDE_SKILL_DIR                            │    │
│  │  └─ Registered with aliases                                  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  Tool Lookup Flow:                                                   │
│                                                                       │
│  findTool(name)                                                      │
│       │                                                               │
│       ├─→ Session Tool Set (Y.options.tools)                        │
│       │     └─→ Found? Return tool                                   │
│       │                                                               │
│       └─→ Global Alias Registry (ng())                               │
│             └─→ Found && aliases.includes(name)? Return tool         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. findTool (dK) - Tool Lookup

**What it does:**
Searches for a tool by name in a tool set, supporting both exact name matches and alias lookups.

**How it works:**
1. Iterate through the tool set
2. Check if tool name matches exactly
3. Check if tool has aliases containing the search name
4. Return first matching tool or undefined

```javascript
// ============================================
// findTool - Lookup tool by name or alias
// Location: chunks.56.mjs:1592-1610
// ============================================

// ORIGINAL (for source lookup):
function dK(A, q) {
    for (let K of A)
        if (K.name === q || K.aliases?.includes(q)) return K;
    return
}

// READABLE (for understanding):
function findTool(toolSet, toolName) {
    for (const tool of toolSet) {
        // Check exact name match
        if (tool.name === toolName) {
            return tool;
        }

        // Check alias match (for MCP tools, skill tools)
        if (tool.aliases?.includes(toolName)) {
            return tool;
        }
    }

    // Not found
    return undefined;
}

// Mapping: dK→findTool, A→toolSet, q→toolName, K→tool
```

**Key insight:**
The alias mechanism allows a single tool object to be discoverable under multiple names. This is essential for MCP tools where the prefixed name (`mcp__server__tool`) might be referenced by different variations.

---

## 2. filterToolsByMode (Xk8) - Mode-Aware Filtering

**What it does:**
Filters the available tool set based on the current execution mode, restricting dangerous operations in restricted modes.

**How it works:**
1. Get current mode from tool permission context
2. If plan mode, filter to read-only + plan-specific tools
3. If delegate mode, apply teammate restrictions
4. If bypass mode, allow all tools
5. Return filtered tool set

```javascript
// ============================================
// filterToolsByMode - Filter tools based on execution mode
// Location: chunks.93.mjs:1568-1620
// ============================================

// ORIGINAL (for source lookup):
function Xk8({ toolPermissionContext: A, tools: q, planFilePath: K }) {
    let Y = A.mode;
    if (Y === "plan") return q.filter((z) =>
        z.isReadOnly?.() ||
        z.name === "ExitPlanMode" ||
        z.name === "EnterPlanMode" ||
        z.name === "AskUserQuestion" ||
        z.name === "Write" ||  // Write allowed only to plan file
        z.name === "Edit"      // Edit allowed only to plan file
    );
    if (Y === "delegate") return q.filter((z) =>
        !EXCLUDED_TOOLS.has(z.name)
    );
    return q
}

// READABLE (for understanding):
function filterToolsByMode({ toolPermissionContext, tools, planFilePath }) {
    const mode = toolPermissionContext.mode;

    // Plan mode: restrict to read-only + plan-specific tools
    if (mode === "plan") {
        return tools.filter((tool) => {
            // Always allow read-only tools
            if (tool.isReadOnly?.()) return true;

            // Allow plan mode control tools
            if (tool.name === "ExitPlanMode") return true;
            if (tool.name === "EnterPlanMode") return true;  // Re-entry
            if (tool.name === "AskUserQuestion") return true;

            // Allow Write/Edit only to plan file (checked at execution time)
            if (tool.name === "Write" || tool.name === "Edit") return true;

            // Block all other tools
            return false;
        });
    }

    // Delegate mode: exclude tools that shouldn't run in teammates
    if (mode === "delegate") {
        return tools.filter((tool) => {
            return !EXCLUDED_TOOLS.has(tool.name);
        });
    }

    // Default mode: allow all tools
    return tools;
}

// Mapping: Xk8→filterToolsByMode, A→toolPermissionContext, q→tools, K→planFilePath, Y→mode
```

**Key insight:**
The plan mode filtering is permissive for Write/Edit but enforces path restrictions at execution time. This allows the tool to appear in the available set but fail if the path doesn't match `planFilePath`.

---

## 3. Tool Categories and Properties

### Tool Name Constants

```javascript
// Location: chunks.90.mjs

// Tool name constants (used throughout codebase)
const TOOL_NAME_READ = "Read";           // s7
const TOOL_NAME_WRITE = "Write";         // _K
const TOOL_NAME_EDIT = "Edit";           // R4
const TOOL_NAME_BASH = "Bash";           // Q7
const TOOL_NAME_GREP = "Grep";           // N9
const TOOL_NAME_GLOB = "Glob";           // qz
const TOOL_NAME_AGENT = "Agent";         // r4
const TOOL_NAME_SKILL = "Skill";         // oH
const TOOL_NAME_ENTER_PLAN_MODE = "EnterPlanMode";  // dt
const TOOL_NAME_EXIT_PLAN_MODE = "ExitPlanMode";    // aJ
const TOOL_NAME_ASK_USER_QUESTION = "AskUserQuestion";  // Fw
```

### Tool Filtering Sets

```javascript
// Tools excluded from teammate/agent contexts
const EXCLUDED_TOOLS = new Set([
    "TaskOutput",
    "ExitPlanMode",
    "EnterPlanMode",
    "Agent",
    "AskUserQuestion",
    "TaskStop"
]);

// Tools safe for concurrent execution
const ASYNC_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "Grep", "WebFetch", "Glob",
    "TodoWrite", "Edit", "Write", /* ... */
]);

// Tools available for background agents
const BACKGROUND_AGENT_TOOLS = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", /* ... */
]);
```

---

## 4. Tool Interface

### Required Properties

```typescript
interface Tool {
    // Identity
    name: string;
    searchHint?: string;

    // Async properties (deferred loading)
    description(): Promise<string>;
    prompt(): Promise<string>;

    // Schemas
    inputSchema: ZodSchema;
    outputSchema?: ZodSchema;

    // Execution
    call(
        input: unknown,
        context: ToolUseContext,
        canUseTool: CanUseToolFunction,
        assistantMessage: AssistantMessage,
        progressCallback?: ProgressCallback
    ): Promise<ToolCallResult>;

    // Methods
    isEnabled(): boolean;
    isReadOnly(): boolean;
    isConcurrencySafe(): boolean;
    requiresUserInteraction(): boolean;

    // Optional
    validateInput?(input: unknown, context: ToolUseContext): Promise<ValidationResult>;
    checkPermissions?(input: unknown): Promise<PermissionResult>;
    userFacingName(): string;
    toAutoClassifierInput?(input: unknown): string;

    // Rendering
    renderToolUseMessage?: (input: unknown) => ReactNode;
    renderToolResultMessage?: (result: unknown) => ReactNode;
    renderToolUseRejectedMessage?: (result: unknown) => ReactNode;
    renderToolUseErrorMessage?: (error: unknown) => ReactNode;

    // Result formatting
    mapToolResultToToolResultBlockParam(result: unknown, toolUseId: string): ToolResultBlock;
}
```

### Tool Call Result

```typescript
interface ToolCallResult {
    data: unknown;
    contextModifier?: (context: ConversationContext) => ConversationContext;
}
```

---

## 5. Built-in Tool Categories

### File System Tools

| Tool | Purpose | Location |
|------|---------|----------|
| Read | Read file with encoding detection | chunks.146.mjs |
| Write | Write file with overwrite protection | chunks.146.mjs |
| Edit | Surgical string replacement | chunks.134.mjs |
| NotebookEdit | Jupyter notebook cell editing | chunks.134.mjs |

### Search Tools

| Tool | Purpose | Location |
|------|---------|----------|
| Grep | File content search (ripgrep) | chunks.139.mjs |
| Glob | Filename pattern matching | chunks.139.mjs |

### Execution Tools

| Tool | Purpose | Location |
|------|---------|----------|
| Bash | Shell command execution | chunks.172.mjs |
| Agent | Sub-agent spawning | chunks.136.mjs |

### Web Tools

| Tool | Purpose | Location |
|------|---------|----------|
| WebFetch | URL content fetching | chunks.139.mjs |
| WebSearch | Web search | chunks.139.mjs |

### Task Tools

| Tool | Purpose | Location |
|------|---------|----------|
| TaskCreate | Create structured task | chunks.84.mjs |
| TaskUpdate | Update task status | chunks.84.mjs |
| TaskGet | Get single task | chunks.84.mjs |
| TaskList | List all tasks | chunks.84.mjs |
| TodoWrite | Simple todo list | chunks.144.mjs |

### Plan Mode Tools

| Tool | Purpose | Location |
|------|---------|----------|
| EnterPlanMode | Enter planning mode | chunks.144.mjs |
| ExitPlanMode | Exit with approval | chunks.143.mjs |
| AskUserQuestion | Multi-round interaction | chunks.143.mjs |

### Coordination Tools

| Tool | Purpose | Location |
|------|---------|----------|
| TeamCreate | Create agent team | chunks.141.mjs |
| TeamDelete | Delete team | chunks.141.mjs |
| SendMessage | Team messaging | chunks.141.mjs |
| CronCreate | Schedule task | chunks.89.mjs |
| CronDelete | Remove schedule | chunks.193.mjs |
| CronList | List schedules | chunks.193.mjs |

---

## 6. Deferred Tool Loading

**What it does:**
To reduce context size, not all tool schemas are sent to the API upfront. Tools are loaded on-demand based on message history analysis.

**How it works:**
1. Analyze message history for tool references
2. Determine which tools are "discovered"
3. Send schemas only for discovered tools
4. If LLM uses undiscovered tool, provide error with instructions

```javascript
// Deferred tool schema error message
const DEFERRED_TOOL_ERROR = `
This tool's schema was not sent to the API — it was not in the discovered-tool set derived from message history.
Without the schema in your prompt, typed parameters (arrays, numbers, booleans) get emitted as strings and the
client-side parser rejects them. Load the tool first: call ToolSearch with query "select:${toolName}", then retry this call.`;
```

---

## 7. Tool Discovery Flow

```
Session Start
     │
     ├─→ getDefaultTools() → Built-in tool set
     │
     ├─→ fetchMcpTools() → MCP tools (prefixed)
     │
     ├─→ loadSkillTools() → Skill tools
     │
     └─→ Filter by mode (filterToolsByMode)
           │
           └─→ Final session tool set
```

---

## Cross-Module Integration

### Tool Registry ↔ Tool Dispatcher (05)

The `findTool` function is used in `toolDispatcher` to locate tools:
- First lookup in session tool set
- Fallback to global alias registry

### Tool Registry ↔ MCP (06)

MCP tools are discovered via `fetchMcpTools` and registered with `mcp__` prefix.

### Tool Registry ↔ Plan Mode (12)

`filterToolsByMode` restricts tools in plan mode to read-only operations.

---

## Verification

1. **Validate findTool symbol**:
   ```bash
   grep -n "function dK" source/chunks.56.mjs
   # Expected: 1592:function dK(A, q) {
   ```

2. **Validate filterToolsByMode symbol**:
   ```bash
   grep -n "function Xk8" source/chunks.93.mjs
   # Expected: 1568:function Xk8({
   ```

3. **Validate tool name constants**:
   ```bash
   grep -n "aJ = \"ExitPlanMode\"" source/chunks.90.mjs
   grep -n "dt = \"EnterPlanMode\"" source/chunks.90.mjs
   ```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Cron tools, worktree isolation, enhanced filtering |
| 2.1.72 | Per-invocation model selection for Agent |
| 2.1.71 | Loop/Cron system integration |
| 2.1.32 | Agent teams, auto memory integration |
| 2.1.18 | Keybindings system |