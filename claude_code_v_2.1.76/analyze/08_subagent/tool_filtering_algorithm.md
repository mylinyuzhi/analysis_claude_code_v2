# Tool Filtering Algorithm (Claude Code 2.1.76)

> Complete source-level analysis of how Claude Code filters available tools for subagents based on execution mode and context.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `Xk8` - filterToolsForSubagent — `chunks.93.mjs:1568`
- `_c` - applyToolFilters — `chunks.93.mjs:1590`
- `CW6` - BACKGROUND_AGENT_EXCLUDED_TOOLS — `chunks.91.mjs:269`
- `eP1` - ASYNC_AGENT_ALLOWED_TOOLS — `chunks.91.mjs:269`
- `WY4` - TEAM_DELEGATE_TOOLS — `chunks.91.mjs:269`

---

## Algorithm Overview

The tool filtering algorithm determines which tools are available to subagents based on:
1. **Execution mode** - Synchronous, asynchronous, teammate
2. **Tool lists** - Whitelist/blacklist from agent definition
3. **Permission mode** - Plan mode, default, etc.
4. **Context** - Built-in vs custom agents

### Design Goals

1. **Safety** - Prevent blocking operations in background agents
2. **Control** - Allow fine-grained tool restrictions per agent
3. **Flexibility** - Support wildcard tool access
4. **Consistency** - Apply same rules across execution modes

---

## Source Code

### Background Agent Excluded Tools (CW6)

```javascript
// ============================================
// CW6 - BACKGROUND_AGENT_EXCLUDED_TOOLS - Tools blocked for background agents
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
CW6 = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Task",            // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage other tasks
])

// READABLE (for understanding):
const BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Prevents polling loops
    "ExitPlanMode",    // No plan mode UI access
    "EnterPlanMode",   // No plan mode UI access
    "Task",            // Prevents nested background spawning
    "AskUserQuestion", // Cannot block for user input
    "TaskStop"         // Shouldn't control other tasks
]);

// Mapping: CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS
```

**Why these tools are excluded:**

| Tool | Reason | What would happen if allowed |
|------|--------|------------------------------|
| TaskOutput | Polling loop | Background agent would poll itself |
| ExitPlanMode | No UI | No one to approve exit |
| EnterPlanMode | No UI | No one to approve entry |
| Task | Nested spawn | Uncontrolled parallelism |
| AskUserQuestion | Blocking | Agent would hang forever |
| TaskStop | Control flow | Interfere with parent's task management |

### Async Agent Allowed Tools (eP1)

```javascript
// ============================================
// eP1 - ASYNC_AGENT_ALLOWED_TOOLS - Tools allowed for async/background agents
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
eP1 = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
])

// READABLE (for understanding):
const ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    // File operations
    "Read",           // Read files
    "Write",          // Create files
    "Edit",           // Modify files
    "NotebookEdit",   // Edit Jupyter notebooks

    // Search operations
    "Grep",           // Content search
    "Glob",           // File pattern search
    "ToolSearch",     // Tool discovery

    // Execution
    "Bash",           // Shell commands

    // Web
    "WebFetch",       // Fetch URLs
    "WebSearch",      // Web search

    // Task management
    "TodoWrite",      // Update todo list

    // Other
    "Skill",          // Skill invocation
    "StructuredOutput", // Structured output

    // Worktree
    "EnterWorktree",  // Enter isolated worktree
    "ExitWorktree"    // Exit worktree
]);

// Mapping: eP1→ASYNC_AGENT_ALLOWED_TOOLS
```

### Team Delegate Tools (WY4)

```javascript
// ============================================
// WY4 - TEAM_DELEGATE_TOOLS - Tools for delegate mode agents
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
WY4 = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", "CronCreate", "CronDelete", "CronList"
])

// READABLE (for understanding):
const TEAM_DELEGATE_TOOLS = new Set([
    // Task tools (13_task_system)
    "TaskCreate",     // Create structured task
    "TaskGet",        // Get task by ID
    "TaskList",       // List all tasks
    "TaskUpdate",     // Update task

    // Team communication
    "SendMessage",    // Send message to teammate

    // Scheduled tasks
    "CronCreate",     // Create scheduled task
    "CronDelete",     // Delete scheduled task
    "CronList"        // List scheduled tasks
]);

// Mapping: WY4→TEAM_DELEGATE_TOOLS
```

### filterToolsForSubagent (Xk8)

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools based on context
// Location: chunks.93.mjs:1568-1588
// ============================================

// ORIGINAL (for source lookup):
function Xk8({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z3(z, aJ) && Y === "plan") return !0;
        if (CW6.has(z.name)) return !1;
        if (!q && xV8.has(z.name)) return !1;
        if (K && !eP1.has(z.name)) {
            if (E7() && eP()) {
                if (z3(z, r4)) return !0;
                if (WY4.has(z.name)) return !1
            }
            return !1
        }
        return !0
    })
}

// READABLE (for understanding):
function filterToolsForSubagent({
    tools,           // Available tools
    isBuiltIn,       // Is this a built-in agent?
    isAsync = false, // Is this an async/background agent?
    permissionMode   // Current permission mode
}) {
    return tools.filter((tool) => {
        // Rule 1: MCP tools are always allowed
        if (tool.name.startsWith("mcp__")) {
            return true;
        }

        // Rule 2: In plan mode, allow plan-restricted tools
        if (isPlanTool(tool) && permissionMode === "plan") {
            return true;
        }

        // Rule 3: Exclude tools on the background blocklist
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Rule 4: Non-built-in agents can't use restricted tools
        if (!isBuiltIn && RESTRICTED_TOOLS.has(tool.name)) {
            return false;
        }

        // Rule 5: Async agents use allowlist
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Special case: delegate mode in async context
            if (isTeamMode() && isInProcessTeammate()) {
                // Allow Agent tool for spawning subagents
                if (isAgentTool(tool)) {
                    return true;
                }
                // Exclude team delegate tools
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) {
                    return false;
                }
            }
            return false;
        }

        // Rule 6: Default: allow
        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn,
//          K→isAsync, Y→permissionMode, z→tool, CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS,
//          eP1→ASYNC_AGENT_ALLOWED_TOOLS, WY4→TEAM_DELEGATE_TOOLS, r4→TOOL_NAME_AGENT
```

### applyToolFilters (_c)

```javascript
// ============================================
// _c - applyToolFilters - Apply whitelist/blacklist from agent definition
// Location: chunks.93.mjs:1590-1644
// ============================================

// ORIGINAL (for source lookup):
function _c(A, q, K = !1, Y = !1) {
    let {
        tools: z,
        disallowedTools: _,
        source: w,
        permissionMode: O
    } = A, $ = Y ? q : Xk8({
        tools: q,
        isBuiltIn: w === "built-in",
        isAsync: K,
        permissionMode: O
    }), H = new Set(_?.map((G) => {
        let {
            toolName: f
        } = CH(G);
        return f
    }) ?? []), j = $.filter((G) => !H.has(G.name));
    if (z === void 0 || z.length === 1 && z[0] === "*") return {
        hasWildcard: !0,
        validTools: [],
        invalidTools: [],
        resolvedTools: j
    };
    let M = new Map;
    for (let G of j) M.set(G.name, G);
    let D = [],
        X = [],
        P = [],
        W = new Set,
        Z;
    for (let G of z) {
        let {
            toolName: f,
            ruleContent: v
        } = CH(G);
        if (f === r4) {
            if (v) Z = v.split(",").map((V) => V.trim());
            if (!Y) {
                D.push(G);
                continue
            }
        }
        let N = M.get(f);
        if (N) {
            if (D.push(G), !W.has(N)) P.push(N), W.add(N)
        } else X.push(G)
    }
    return {
        hasWildcard: !1,
        validTools: D,
        invalidTools: X,
        resolvedTools: P,
        allowedAgentTypes: Z
    }
}

// READABLE (for understanding):
function applyToolFilters(
    agentDefinition,  // Agent's tool configuration
    availableTools,   // All available tools
    isAsync = false,  // Is async/background?
    useExactTools = false  // Skip filtering?
) {
    let {
        tools: toolList,           // Whitelist from definition
        disallowedTools,           // Blacklist from definition
        source,                    // "built-in" or other
        permissionMode             // Current permission mode
    } = agentDefinition;

    // Step 1: Apply base filtering
    let filteredTools = useExactTools
        ? availableTools
        : filterToolsForSubagent({
            tools: availableTools,
            isBuiltIn: source === "built-in",
            isAsync: isAsync,
            permissionMode: permissionMode
        });

    // Step 2: Apply blacklist (disallowedTools)
    let disallowedSet = new Set(
        disallowedTools?.map((rule) => parseToolRule(rule).toolName) ?? []
    );

    let toolsAfterBlacklist = filteredTools.filter(
        (tool) => !disallowedSet.has(tool.name)
    );

    // Step 3: Handle wildcard (*) - allow all remaining
    if (toolList === undefined ||
        (toolList.length === 1 && toolList[0] === "*")) {
        return {
            hasWildcard: true,
            validTools: [],
            invalidTools: [],
            resolvedTools: toolsAfterBlacklist
        };
    }

    // Step 4: Build tool lookup map
    let toolMap = new Map();
    for (let tool of toolsAfterBlacklist) {
        toolMap.set(tool.name, tool);
    }

    // Step 5: Validate whitelist
    let validTools = [];
    let invalidTools = [];
    let resolvedTools = [];
    let seenTools = new Set();
    let allowedAgentTypes;

    for (let toolRule of toolList) {
        let { toolName, ruleContent } = parseToolRule(toolRule);

        // Special handling for Agent tool rules
        if (toolName === "Agent") {
            if (ruleContent) {
                // Extract allowed agent types from rule
                allowedAgentTypes = ruleContent.split(",")
                    .map((t) => t.trim());
            }
            if (!useExactTools) {
                validTools.push(toolRule);
                continue;
            }
        }

        // Check if tool exists
        let tool = toolMap.get(toolName);
        if (tool) {
            validTools.push(toolRule);
            if (!seenTools.has(tool)) {
                resolvedTools.push(tool);
                seenTools.add(tool);
            }
        } else {
            invalidTools.push(toolRule);
        }
    }

    return {
        hasWildcard: false,
        validTools: validTools,      // Tools that exist and are allowed
        invalidTools: invalidTools,  // Tools that don't exist
        resolvedTools: resolvedTools, // Actual tool objects
        allowedAgentTypes: allowedAgentTypes // For Agent tool
    };
}

// Mapping: _c→applyToolFilters, A→agentDefinition, q→availableTools,
//          K→isAsync, Y→useExactTools, z→toolList, _→disallowedTools,
//          w→source, O→permissionMode, Xk8→filterToolsForSubagent
```

---

## Filtering Rules Deep Dive

### Rule Execution Order

```
┌─────────────────────────────────────────────────────────────────────┐
│                      TOOL FILTERING PIPELINE                         │
└─────────────────────────────────────────────────────────────────────┘

Input: Full tool set (all available tools)
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Rule 1: MCP tools are always allowed                                │
│   if (tool.name.startsWith("mcp__")) → KEEP                         │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Rule 2: Plan mode tools                                              │
│   if (isPlanTool(tool) && mode === "plan") → KEEP                   │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Rule 3: Background excluded tools                                    │
│   if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) → REMOVE      │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Rule 4: Non-built-in restricted tools                                │
│   if (!isBuiltIn && RESTRICTED_TOOLS.has(tool.name)) → REMOVE       │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Rule 5: Async allowed tools                                          │
│   if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {       │
│     if (isTeamMode && isInProcessTeammate) {                         │
│       if (isAgentTool(tool)) → KEEP                                  │
│       if (TEAM_DELEGATE_TOOLS.has(tool.name)) → REMOVE              │
│     }                                                                │
│     → REMOVE                                                         │
│   }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
Output: Filtered tool set
```

### Tool Category Matrix

| Tool Category | Sync Subagent | Async Subagent | Teammate |
|---------------|---------------|----------------|----------|
| File (Read/Write/Edit) | ✅ | ✅ | ✅ |
| Search (Grep/Glob) | ✅ | ✅ | ✅ |
| Bash | ✅ | ✅ | ✅ |
| Web (Fetch/Search) | ✅ | ✅ | ✅ |
| Agent Tool | ✅ | ❌* | ❌** |
| TaskOutput | ✅ | ❌ | ❌ |
| EnterPlanMode | ✅ | ❌ | ❌ |
| ExitPlanMode | ✅ | ❌ | ❌ |
| AskUserQuestion | ✅ | ❌ | ❌ |
| TaskStop | ✅ | ❌ | ❌ |
| TaskCreate/Get/List | ❌ | ❌ | ✅ |
| SendMessage | ❌ | ❌ | ✅ |
| CronCreate/Delete/List | ❌ | ❌ | ✅ |

\* In delegate mode, Agent tool may be allowed
\*\* Teammates cannot spawn other teammates

---

## Key Insights

### Why Background Agents Have Restrictions

**Problem:** Background agents run without user interaction, potentially for long periods.

**Solution:** Restrict to tools that:
1. Complete in reasonable time
2. Don't require user input
3. Don't spawn uncontrolled parallelism
4. Don't interfere with parent's task management

**The ASYNC_AGENT_ALLOWED_TOOLS set** contains tools that are:
- Self-contained (don't require external state)
- Non-blocking (complete quickly or async-safe)
- Non-interactive (don't need user input)

### Why Teammates Have Different Tools

**Teammates are collaborative agents** that:
1. Run in parallel with the main agent
2. Communicate via mailbox
3. May need to create structured tasks
4. May need scheduled tasks (CronCreate)

**The TEAM_DELEGATE_TOOLS set** enables:
- Task management (create, list, update)
- Inter-agent messaging (SendMessage)
- Scheduled task creation (CronCreate/Delete/List)

### Wildcard Tool Access

When `tools: ["*"]` is specified:
```javascript
// Agent definition
{
    agentType: "general-purpose",
    tools: ["*"]  // Wildcard
}

// Result: All tools pass through base filtering, then:
// - Background excluded tools still removed
// - Blacklist (disallowedTools) still applied
// - Context-based restrictions still apply
```

---

## Usage Examples

### Example 1: General-Purpose Agent

```javascript
// Agent definition
{
    agentType: "general-purpose",
    tools: ["*"],  // All tools
    source: "built-in"
}

// For sync subagent:
// Result: All tools except those excluded for sync

// For async subagent:
// Result: Only ASYNC_AGENT_ALLOWED_TOOLS
```

### Example 2: Explore Agent

```javascript
// Agent definition
{
    agentType: "Explore",
    tools: ["Read", "Grep", "Glob", "WebFetch", "WebSearch"],
    source: "built-in"
}

// Result for any mode:
// - Read, Grep, Glob, WebFetch, WebSearch
// - Other tools not available
```

### Example 3: Plan Agent

```javascript
// Agent definition
{
    agentType: "Plan",
    tools: ["*"],
    source: "built-in"
}

// In plan mode:
// - Plan-restricted tools are allowed
// - Normal filtering applies to other tools
```

### Example 4: Custom Agent with Blacklist

```javascript
// Agent definition
{
    agentType: "read-only",
    tools: ["*"],
    disallowedTools: ["Write", "Edit", "Bash"],
    source: "projectSettings"
}

// Result:
// - All tools except Write, Edit, Bash
// - Background restrictions still apply if async
```

---

## Integration Points

| Module | Integration |
|--------|-------------|
| `08_subagent` | Applies filtering when spawning agents |
| `05_tools` | Provides tool definitions |
| `04_system_reminder` | Tool use context for subagents |
| `17_hooks` | PreToolUse hooks can block filtered tools |

---

## Summary

The tool filtering algorithm provides:

1. **Layered filtering** - Base filtering + agent-specific rules
2. **Mode-aware** - Different rules for sync/async/teammate
3. **Configurable** - Whitelist/blacklist in agent definitions
4. **Safe defaults** - Prevents dangerous operations in background contexts

The algorithm ensures that subagents have appropriate tool access for their execution context while maintaining system safety and predictability.