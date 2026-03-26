# Tool Filtering Complete Source V2 (Claude Code 2.1.76)

> Complete source-level documentation for the tool filtering system that determines which tools subagents can access.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](../08_subagent/cross_validation_unified_v3.md) - Unified symbol verification

Key functions in this document:
- `Xk8` - filterToolsForSubagent — `chunks.93.mjs:1568`
- `_c` - applyToolFilters — `chunks.93.mjs:1590`
- `CW6` - BACKGROUND_AGENT_EXCLUDED_TOOLS — `chunks.91.mjs:269`
- `eP1` - ASYNC_AGENT_ALLOWED_TOOLS — `chunks.91.mjs:269`
- `WY4` - TEAM_DELEGATE_TOOLS — `chunks.91.mjs:269`
- `xV8` - BUILTIN_EXCLUDED_TOOLS — `chunks.93.mjs`

---

## Overview

The tool filtering system determines which tools a subagent can access based on:
1. **Agent type** - Built-in vs custom agents
2. **Execution mode** - Synchronous vs asynchronous
3. **Permission context** - User-defined rules
4. **Agent Teams** - Teammate delegation capabilities

This ensures background agents cannot perform blocking operations, and teammates have the right tool set for collaboration.

---

## Core Function: filterToolsForSubagent (Xk8)

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools for subagent access
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
                if (WY4.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}

// READABLE (for understanding):
function filterToolsForSubagent({
    tools,
    isBuiltIn,
    isAsync = false,
    permissionMode
}) {
    return tools.filter((tool) => {
        // RULE 1: Allow all MCP tools
        // MCP tools are always allowed as they're external integrations
        if (tool.name.startsWith("mcp__")) return true;

        // RULE 2: Allow ExitPlanMode in plan mode
        // Needed for plan approval flow in planning agents
        if (isToolNamed(tool, "ExitPlanMode") && permissionMode === "plan") {
            return true;
        }

        // RULE 3: Block tools in BACKGROUND_AGENT_EXCLUDED_TOOLS
        // These tools would block or cause issues in background execution
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // RULE 4: Block built-in excluded tools for non-built-in agents
        // Custom agents can't access certain core tools
        if (!isBuiltIn && BUILTIN_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // RULE 5: Async mode restrictions
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // RULE 5a: Teammate exception
            // In-process teammates can use Agent + TEAM_DELEGATE_TOOLS
            if (isAgentTeamsEnabled() && isInProcessEnabled()) {
                if (isToolNamed(tool, "Agent")) return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        // RULE 6: Allow by default
        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync, Y→permissionMode, z→tool, z3→isToolNamed, aJ→EXIT_PLAN_MODE, CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS, xV8→BUILTIN_EXCLUDED_TOOLS, eP1→ASYNC_AGENT_ALLOWED_TOOLS, WY4→TEAM_DELEGATE_TOOLS, E7→isAgentTeamsEnabled, eP→isInProcessEnabled, r4→TOOL_NAME_AGENT
```

---

## applyToolFilters (_c)

```javascript
// ============================================
// _c - applyToolFilters - Apply comprehensive tool filters
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
function applyToolFilters(agentDefinition, allTools, isAsync = false, useExactFilter = false) {
    let {
        tools: requestedTools,        // Tools requested by agent
        disallowedTools,              // Tools to explicitly block
        source,                       // "built-in" or custom
        permissionMode
    } = agentDefinition;

    // Step 1: Filter tools based on execution mode
    let filteredTools = useExactFilter
        ? allTools
        : filterToolsForSubagent({
            tools: allTools,
            isBuiltIn: source === "built-in",
            isAsync: isAsync,
            permissionMode: permissionMode
        });

    // Step 2: Build set of disallowed tool names
    let disallowedSet = new Set(
        disallowedTools?.map(rule => {
            let { toolName } = parseToolRule(rule);
            return toolName;
        }) ?? []
    );

    // Step 3: Remove disallowed tools
    let allowedTools = filteredTools.filter(tool => !disallowedSet.has(tool.name));

    // Step 4: Handle wildcard case
    if (requestedTools === undefined ||
        (requestedTools.length === 1 && requestedTools[0] === "*")) {
        return {
            hasWildcard: true,
            validTools: [],
            invalidTools: [],
            resolvedTools: allowedTools,
            allowedAgentTypes: undefined
        };
    }

    // Step 5: Build tool lookup map
    let toolMap = new Map();
    for (let tool of allowedTools) {
        toolMap.set(tool.name, tool);
    }

    // Step 6: Validate requested tools
    let validTools = [];
    let invalidTools = [];
    let resolvedTools = [];
    let seenTools = new Set();
    let allowedAgentTypes;

    for (let requested of requestedTools) {
        let { toolName, ruleContent } = parseToolRule(requested);

        // Special handling for Agent tool
        if (toolName === "Agent") {
            if (ruleContent) {
                // Parse allowed agent types from rule content
                allowedAgentTypes = ruleContent.split(",").map(s => s.trim());
            }
            if (!useExactFilter) {
                validTools.push(requested);
                continue;
            }
        }

        // Look up tool
        let tool = toolMap.get(toolName);
        if (tool) {
            validTools.push(requested);
            if (!seenTools.has(tool)) {
                resolvedTools.push(tool);
                seenTools.add(tool);
            }
        } else {
            invalidTools.push(requested);
        }
    }

    return {
        hasWildcard: false,
        validTools,       // Tool rules that matched
        invalidTools,     // Tool rules that didn't match
        resolvedTools,    // Actual tool objects
        allowedAgentTypes // Agent types allowed via Agent tool
    };
}

// Mapping: _c→applyToolFilters, A→agentDefinition, q→allTools, K→isAsync, Y→useExactFilter, z→requestedTools, _→disallowedTools, w→source, O→permissionMode, $→filteredTools, H→disallowedSet, j→allowedTools, M→toolMap, D→validTools, X→invalidTools, P→resolvedTools, W→seenTools, Z→allowedAgentTypes, G→requested/tool, CH→parseToolRule, r4→TOOL_NAME_AGENT
```

---

## Tool Sets

### BACKGROUND_AGENT_EXCLUDED_TOOLS (CW6)

```javascript
// ============================================
// CW6 - BACKGROUND_AGENT_EXCLUDED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
CW6 = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage other tasks
])

// READABLE (for understanding):
BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    // Tool name            // Reason for exclusion
    "TaskOutput",           // Could create polling loops, defeating async purpose
    "ExitPlanMode",         // Requires user approval dialog - would block
    "EnterPlanMode",        // Requires user approval dialog - would block
    "Agent",                // Could spawn nested background agents, resource explosion
    "AskUserQuestion",      // Would block indefinitely waiting for user
    "TaskStop"              // Background agents shouldn't manage other tasks
]);

// Mapping: CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS
```

### ASYNC_AGENT_ALLOWED_TOOLS (eP1)

```javascript
// ============================================
// eP1 - ASYNC_AGENT_ALLOWED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
eP1 = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
])

// READABLE (for understanding):
ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    // File operations
    "Read",         // Read files - non-blocking
    "Write",        // Write files - common for background tasks
    "Edit",         // Edit files - common for background tasks
    "Glob",         // File search - non-blocking
    "Grep",         // Content search - non-blocking
    "NotebookEdit", // Jupyter editing - file-like operation

    // Shell execution
    "Bash",         // Shell commands - core capability for background work

    // Network operations
    "WebFetch",     // Network request - async-safe
    "WebSearch",    // Network request - async-safe

    // Task management
    "TodoWrite",    // Task tracking - useful for progress

    // Skills and structured output
    "Skill",        // Skill invocation - controlled execution
    "StructuredOutput", // Structured output generation

    // Tool discovery
    "ToolSearch",   // Find available tools

    // Worktree isolation
    "EnterWorktree", // Create isolated worktree
    "ExitWorktree"   // Exit worktree context
]);

// Mapping: eP1→ASYNC_AGENT_ALLOWED_TOOLS
```

### TEAM_DELEGATE_TOOLS (WY4)

```javascript
// ============================================
// WY4 - TEAM_DELEGATE_TOOLS
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
WY4 = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", "CronCreate", "CronDelete", "CronList"
])

// READABLE (for understanding):
TEAM_DELEGATE_TOOLS = new Set([
    // Task management tools
    "TaskCreate",   // Create a new task
    "TaskGet",      // Get task details
    "TaskList",     // List all tasks
    "TaskUpdate",   // Update task status

    // Team communication
    "SendMessage",  // Send message to teammate

    // Scheduled tasks
    "CronCreate",   // Create scheduled task
    "CronDelete",   // Delete scheduled task
    "CronList"      // List scheduled tasks
]);

// These tools are allowed for in-process teammates even in async mode
// They enable teammate coordination and task delegation

// Mapping: WY4→TEAM_DELEGATE_TOOLS
```

---

## Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TOOL FILTERING DECISION TREE                         │
└─────────────────────────────────────────────────────────────────────────────┘

For each tool T:

├── T.name starts with "mcp__"?
│   └── YES → ALLOW (MCP tools always allowed)
│   └── NO → Continue
│
├── T.name == "ExitPlanMode" AND permissionMode == "plan"?
│   └── YES → ALLOW (Needed for plan approval)
│   └── NO → Continue
│
├── T.name in BACKGROUND_AGENT_EXCLUDED_TOOLS?
│   └── YES → DENY (Would block or cause issues)
│   └── NO → Continue
│
├── NOT isBuiltIn AND T.name in BUILTIN_EXCLUDED_TOOLS?
│   └── YES → DENY (Custom agents can't use these)
│   └── NO → Continue
│
├── isAsync == false?
│   └── YES → ALLOW (Synchronous mode - all remaining tools OK)
│   └── NO → Continue (Async mode restrictions)
│
├── T.name in ASYNC_AGENT_ALLOWED_TOOLS?
│   └── YES → ALLOW (Explicitly allowed for async)
│   └── NO → Continue
│
├── isAgentTeamsEnabled() AND isInProcessEnabled()? (Teammate check)
│   └── NO → DENY (Not allowed in async mode)
│   └── YES → Continue (Teammate exception)
│
├── T.name == "Agent"?
│   └── YES → ALLOW (Teammates can spawn subagents)
│   └── NO → Continue
│
├── T.name in TEAM_DELEGATE_TOOLS?
│   └── YES → ALLOW (Teammate delegation tools)
│   └── NO → DENY
```

---

## Key Insights

### Insight 1: MCP Tools Always Allowed

MCP tools (starting with `mcp__`) are always allowed because:
- They're external integrations managed by the MCP protocol
- They don't have the same blocking concerns as core tools
- User explicitly configured them

### Insight 2: Async Mode is Restrictive

In async mode, only tools in `ASYNC_AGENT_ALLOWED_TOOLS` pass through:
- No tools that require user interaction
- No tools that could spawn more background agents
- Only non-blocking, autonomous tools

### Insight 3: Teammate Exception

In-process teammates get extra tools even in async mode:
- `Agent` tool - Can spawn subagents
- `TEAM_DELEGATE_TOOLS` - Task management and communication

This enables the teammate to delegate work and coordinate with others.

---

## Related Documents

- [agent_tool_complete_source_v4.md](./agent_tool_complete_source_v4.md) - AgentTool
- [agent_loop_complete_source_v5.md](./agent_loop_complete_source_v5.md) - Agent loop
- [key_algorithms_deep_dive_v9.md](./key_algorithms_deep_dive_v9.md) - Algorithm analysis

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All tool filtering functions documented with source-level restoration