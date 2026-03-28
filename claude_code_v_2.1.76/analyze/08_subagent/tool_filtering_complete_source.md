# Tool Filtering Complete Source (Claude Code 2.1.76)

> Complete source-level documentation of tool filtering for subagents and background agents.
> Includes multi-stage filtering, whitelist/blacklist handling, and async mode restrictions.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified.md](./cross_validation_unified.md) - Unified symbol verification

Key functions in this document:
- `Xk8` - filterToolsForSubagent — `chunks.93.mjs:1568`
- `_c` - applyToolFilters — `chunks.93.mjs:1590`
- `CW6` - BACKGROUND_AGENT_EXCLUDED_TOOLS — `chunks.91.mjs:269`
- `eP1` - ASYNC_AGENT_ALLOWED_TOOLS — `chunks.91.mjs:269`
- `WY4` - TEAM_DELEGATE_TOOLS — `chunks.91.mjs:269`

---

## Overview

Tool filtering is a critical security and functional boundary that determines which tools a subagent can access. The filtering happens in multiple stages:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TOOL FILTERING PIPELINE                              │
└─────────────────────────────────────────────────────────────────────────────┘

1. All Available Tools
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 1: MCP Tool Allow-All                                                  │
│ All tools starting with "mcp__" are automatically allowed                    │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 2: Plan Mode Exception                                                 │
│ ExitPlanMode is allowed if permission mode is "plan"                         │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 3: Background Exclusion                                                │
│ Remove tools in BACKGROUND_AGENT_EXCLUDED_TOOLS                              │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 4: Built-in Exclusion (for custom agents)                              │
│ Remove tools in BUILTIN_EXCLUDED_TOOLS for non-built-in agents               │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 5: Async Whitelist                                                     │
│ If async mode, only allow ASYNC_AGENT_ALLOWED_TOOLS                          │
│ Exception: Teammates get Agent + TEAM_DELEGATE_TOOLS                         │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
    Filtered Tools
```

---

## Core Function: filterToolsForSubagent (Xk8)

### What it does

Determines which tools a subagent can access based on:
1. Whether the agent is built-in or custom
2. Whether the agent is running in async/background mode
3. The permission mode (plan, auto, etc.)
4. Whether agent teams are enabled and the agent is a teammate

### Source Code

```javascript
// ============================================
// Xk8 - filterToolsForSubagent
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
        // Rule 1: MCP tools always allowed
        // MCP tools are external integrations, safe to use
        if (tool.name.startsWith("mcp__")) return true;

        // Rule 2: ExitPlanMode allowed in plan mode
        // Needed for plan approval flow
        if (isToolNamed(tool, "ExitPlanMode") && permissionMode === "plan") {
            return true;
        }

        // Rule 3: Never allow these in background agents
        // These tools would block or cause issues
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Rule 4: Block built-in exclusions for custom agents
        // Some tools only make sense for built-in agents
        if (!isBuiltIn && BUILTIN_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Rule 5: Async mode whitelist
        // In async mode, only allow safe, non-blocking tools
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Rule 6: Teammate exception
            // Teammates get special delegation tools
            if (isAgentTeamsEnabled() && isInProcessTeammate()) {
                if (isToolNamed(tool, "Agent")) return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync, Y→permissionMode, z→tool
```

### Why this approach

| Design Choice | Rationale |
|---------------|-----------|
| MCP tools always allowed | External integrations are configured explicitly, safe to use |
| Plan mode exception | ExitPlanMode needed for plan approval flow |
| Background exclusion | Prevents blocking operations and polling loops |
| Built-in exclusion | Some tools only make sense for main agent |
| Async whitelist | Ensures background agents only use non-blocking tools |
| Teammate exception | Teammates need delegation capabilities |

---

## Tool Application: applyToolFilters (_c)

### What it does

Applies agent-specific tool configuration on top of the base filtering:
1. Processes allowed/disallowed tool lists
2. Handles wildcard ("*") specification
3. Validates tool existence
4. Resolves Agent tool subagent type restrictions

### Source Code

```javascript
// ============================================
// _c - applyToolFilters
// Location: chunks.93.mjs:1590-1640
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
        agentTypeRestrictions: Z
    }
}

// READABLE (for understanding):
function applyToolFilters(agentDefinition, availableTools, isAsync = false, useExactTools = false) {
    let {
        tools: allowedToolSpecs,
        disallowedTools,
        source,
        permissionMode
    } = agentDefinition;

    // Step 1: Apply base filtering
    let baseFilteredTools = useExactTools
        ? availableTools
        : filterToolsForSubagent({
            tools: availableTools,
            isBuiltIn: source === "built-in",
            isAsync: isAsync,
            permissionMode: permissionMode
        });

    // Step 2: Remove disallowed tools
    let disallowedSet = new Set(
        disallowedTools?.map((spec) => parseToolSpec(spec).toolName) ?? []
    );
    let afterDisallowedFilter = baseFilteredTools.filter(
        (tool) => !disallowedSet.has(tool.name)
    );

    // Step 3: Handle wildcard
    if (allowedToolSpecs === undefined ||
        (allowedToolSpecs.length === 1 && allowedToolSpecs[0] === "*")) {
        return {
            hasWildcard: true,
            validTools: [],
            invalidTools: [],
            resolvedTools: afterDisallowedFilter
        };
    }

    // Step 4: Process explicit tool list
    let toolMap = new Map();
    for (let tool of afterDisallowedFilter) {
        toolMap.set(tool.name, tool);
    }

    let validSpecs = [];
    let invalidSpecs = [];
    let resolvedTools = [];
    let seenTools = new Set();
    let agentTypeRestrictions;

    for (let spec of allowedToolSpecs) {
        let { toolName, ruleContent } = parseToolSpec(spec);

        // Handle Agent tool subagent restrictions
        if (toolName === "Agent") {
            if (ruleContent) {
                agentTypeRestrictions = ruleContent.split(",").map((s) => s.trim());
            }
            if (!useExactTools) {
                validSpecs.push(spec);
                continue;
            }
        }

        let tool = toolMap.get(toolName);
        if (tool) {
            validSpecs.push(spec);
            if (!seenTools.has(tool)) {
                resolvedTools.push(tool);
                seenTools.add(tool);
            }
        } else {
            invalidSpecs.push(spec);
        }
    }

    return {
        hasWildcard: false,
        validTools: validSpecs,
        invalidTools: invalidSpecs,
        resolvedTools: resolvedTools,
        agentTypeRestrictions: agentTypeRestrictions
    };
}

// Mapping: _c→applyToolFilters, A→agentDefinition, q→availableTools, K→isAsync, Y→useExactTools
```

---

## Tool Set Constants

### BACKGROUND_AGENT_EXCLUDED_TOOLS (CW6)

Tools that are **never** allowed in background agents:

```javascript
// ============================================
// CW6 - BACKGROUND_AGENT_EXCLUDED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops, waste tokens
    "ExitPlanMode",    // Requires user approval flow, would block
    "EnterPlanMode",   // Requires user approval flow, would block
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely waiting for input
    "TaskStop"         // Background agents shouldn't manage other tasks
]);
```

### ASYNC_AGENT_ALLOWED_TOOLS (eP1)

Tools that **are** allowed in async/background agents:

```javascript
// ============================================
// eP1 - ASYNC_AGENT_ALLOWED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    // File operations - core capabilities
    "Read",            // Read file contents
    "Write",           // Create/write files
    "Edit",            // Modify existing files
    "NotebookEdit",    // Jupyter notebook editing

    // Search operations - non-blocking
    "Grep",            // Content search
    "Glob",            // File pattern search

    // Shell execution - core capability
    "Bash",            // Run shell commands

    // Network operations - async-safe
    "WebFetch",        // Fetch URL content
    "WebSearch",       // Web search

    // Task management - useful for tracking
    "TodoWrite",       // Update todo list

    // Skill system - controlled execution
    "Skill",           // Invoke skills

    // Other safe tools
    "StructuredOutput", // Structured data output
    "ToolSearch",       // Search for available tools
    "EnterWorktree",    // Enter git worktree
    "ExitWorktree"      // Exit git worktree
]);
```

### TEAM_DELEGATE_TOOLS (WY4)

Additional tools allowed for **teammates** (in-process agents):

```javascript
// ============================================
// WY4 - TEAM_DELEGATE_TOOLS
// Location: chunks.91.mjs:269
// ============================================

TEAM_DELEGATE_TOOLS = new Set([
    // Task management for team coordination
    "TaskCreate",      // Create new tasks
    "TaskGet",         // Get task details
    "TaskList",        // List available tasks
    "TaskUpdate",      // Update task status

    // Team communication
    "SendMessage",     // Send message to teammates

    // Scheduling
    "CronCreate",      // Create scheduled task
    "CronDelete",      // Delete scheduled task
    "CronList"         // List scheduled tasks
]);
```

---

## Filtering Decision Tree

```
For each tool T in available tools:

┌─────────────────────────────────────────────────────────────────────────────┐
│ Does T.name start with "mcp__"?                                              │
│                                                                              │
│   YES ──────────────────────────────────────────────────────► ALLOW          │
│   NO                                                                         │
│     │                                                                        │
│     ▼                                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Is T.name "ExitPlanMode" AND permissionMode === "plan"?                      │
│                                                                              │
│   YES ──────────────────────────────────────────────────────► ALLOW          │
│   NO                                                                         │
│     │                                                                        │
│     ▼                                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Is T.name in BACKGROUND_AGENT_EXCLUDED_TOOLS?                                │
│                                                                              │
│   YES ──────────────────────────────────────────────────────► DENY           │
│   NO                                                                         │
│     │                                                                        │
│     ▼                                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Is this a custom agent (NOT built-in) AND T.name in BUILTIN_EXCLUDED_TOOLS?  │
│                                                                              │
│   YES ──────────────────────────────────────────────────────► DENY           │
│   NO                                                                         │
│     │                                                                        │
│     ▼                                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Is async mode enabled?                                                       │
│                                                                              │
│   NO ───────────────────────────────────────────────────────► ALLOW          │
│   YES                                                                        │
│     │                                                                        │
│     ▼                                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Is T.name in ASYNC_AGENT_ALLOWED_TOOLS?                                      │
│                                                                              │
│   YES ──────────────────────────────────────────────────────► ALLOW          │
│   NO                                                                         │
│     │                                                                        │
│     ▼                                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Is this a teammate (AgentTeams enabled AND InProcessTeammate)?               │
│                                                                              │
│   NO ───────────────────────────────────────────────────────► DENY           │
│   YES                                                                        │
│     │                                                                        │
│     ▼                                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Is T.name "Agent" OR T.name in TEAM_DELEGATE_TOOLS?                          │
│                                                                              │
│   YES ──────────────────────────────────────────────────────► ALLOW          │
│   NO ───────────────────────────────────────────────────────► DENY           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration Points

### Agent Loop Integration

Tool filtering is called in `agentLoopRunner` (qh):

```javascript
// In agentLoopRunner (chunks.133.mjs:1631)
let resolvedTools = useExactTools
    ? availableTools
    : applyToolFilters(agentDefinition, availableTools, isAsync).resolvedTools;
```

### Agent Tool Integration

When AgentTool spawns a subagent:

```javascript
// In AgentTool.call (chunks.136.mjs)
// Tool filtering happens automatically via agentLoopRunner
// The isAsync flag is set based on run_in_background parameter
```

---

## Key Insight

The tool filtering system enforces a **defense-in-depth** approach:

1. **Layer 1**: Base filtering removes obviously dangerous tools
2. **Layer 2**: Permission-based filtering respects user configuration
3. **Layer 3**: Async restrictions prevent blocking operations
4. **Layer 4**: Teammate exceptions enable controlled delegation

This ensures that background agents can never do anything that would:
- Block the main conversation
- Require user interaction
- Create resource leaks (polling loops)
- Escape the intended task scope

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Source-level documentation with algorithm analysis