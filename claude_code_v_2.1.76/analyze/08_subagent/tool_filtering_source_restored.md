# Tool Filtering - Source Restoration (Claude Code 2.1.76)

> Source-level analysis of the tool filtering system for subagents and background agents.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `filterToolsForSubagent` (Xk8) — `chunks.93.mjs:1568`
- `applyToolFilters` (_c) — `chunks.93.mjs:1590`
- `BACKGROUND_AGENT_EXCLUDED_TOOLS` (CW6) — `chunks.91.mjs:269`
- `ASYNC_AGENT_ALLOWED_TOOLS` (eP1) — `chunks.91.mjs:269`
- `TEAM_DELEGATE_TOOLS` (WY4) — `chunks.91.mjs:269`

---

## Overview

The tool filtering system controls which tools are available to subagents and background agents. It ensures that:
1. Background agents cannot use interactive tools
2. Subagents have restricted toolsets based on execution mode
3. Teammate agents have team communication tools
4. Permission modes affect tool availability

### Key Design Decisions

1. **Set-based filtering**: Uses JavaScript Set for O(1) lookup performance
2. **Layered filtering**: Multiple filter stages applied sequentially
3. **Permission-aware**: Tool access changes based on permission mode
4. **MCP tools always allowed**: External tools prefixed with `mcp__` bypass restrictions

---

## Tool Set Constants

### BACKGROUND_AGENT_EXCLUDED_TOOLS (CW6)

Tools that background/async agents cannot use:

```javascript
// ============================================
// CW6 - BACKGROUND_AGENT_EXCLUDED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
CW6 = new Set([$C, aJ, dt, r4, Fw, OC])

// READABLE (for understanding):
BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage other tasks
]);

// Mapping: CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS, $C→"TaskOutput", aJ→"ExitPlanMode",
// dt→"EnterPlanMode", r4→"Agent", Fw→"AskUserQuestion", OC→"TaskStop"
```

**Why these tools are blocked:**

| Tool | Reason |
|------|--------|
| `TaskOutput` | Could create polling loops, defeating async purpose |
| `ExitPlanMode` | Requires interactive user approval |
| `EnterPlanMode` | Requires interactive user approval |
| `Agent` | Prevents nested background agent spawning |
| `AskUserQuestion` | No user available in background context |
| `TaskStop` | Background agents shouldn't manage other tasks |

### ASYNC_AGENT_ALLOWED_TOOLS (eP1)

Tools explicitly allowed for async/background agents:

```javascript
// ============================================
// eP1 - ASYNC_AGENT_ALLOWED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
eP1 = new Set([s7, jv, MB, N9, sO, qz, ...ZU, R4, _K, bJ, oH, oM, HZ, sP1, tP1])

// READABLE (for understanding):
ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    // File operations
    "Read",           // s7 - Read-only, no side effects
    "Grep",           // N9 - Content search, non-blocking
    "Glob",           // jv - File search, non-blocking

    // File modification
    "Write",          // _K - File creation
    "Edit",           // R4 - File modification
    "NotebookEdit",   // bJ - Jupyter editing

    // Execution
    "Bash",           // MB - Shell commands - core capability

    // Network
    "WebFetch",       // sO - Network request, async-safe
    "WebSearch",      // qz - Network request, async-safe

    // Task management
    "TodoWrite",      // oH - Task management, useful for tracking

    // Skills and output
    "Skill",          // oM - Skill invocation
    "StructuredOutput", // HZ - Output formatting

    // Tool discovery
    "ToolSearch",     // sP1 - Discovery, non-blocking

    // Team communication (if enabled)
    "SendMessage",    // tP1 - Team communication

    // Worktree isolation
    "EnterWorktree",  // Included in ZU spread
    "ExitWorktree"    // Included in ZU spread
]);

// Mapping: eP1→ASYNC_AGENT_ALLOWED_TOOLS, s7→"Read", jv→"Glob", MB→"Bash",
// N9→"Grep", sO→"WebFetch", qz→"WebSearch", R4→"Edit", _K→"Write", bJ→"NotebookEdit",
// oH→"TodoWrite", oM→"Skill", HZ→"StructuredOutput", sP1→"ToolSearch", tP1→"SendMessage"
```

### TEAM_DELEGATE_TOOLS (WY4)

Tools available to team delegate mode agents:

```javascript
// ============================================
// WY4 - TEAM_DELEGATE_TOOLS
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
WY4 = new Set([TR, lt, it, ck, hI, ER, ed, SW6])

// READABLE (for understanding):
TEAM_DELEGATE_TOOLS = new Set([
    "TaskCreate",     // TR - Create structured tasks
    "TaskGet",        // lt - Get task by ID
    "TaskList",       // it - List all tasks
    "TaskUpdate",     // ck - Update task
    "SendMessage",    // hI - Team communication
    "CronCreate",     // ER - Create scheduled job
    "CronDelete",     // ed - Delete scheduled job
    "CronList"        // SW6 - List scheduled jobs
]);

// Mapping: WY4→TEAM_DELEGATE_TOOLS, TR→"TaskCreate", lt→"TaskGet", it→"TaskList",
// ck→"TaskUpdate", hI→"SendMessage", ER→"CronCreate", ed→"CronDelete", SW6→"CronList"
```

---

## filterToolsForSubagent (Xk8)

**What it does:** Filters tool list based on subagent context (async, permission mode, etc.).

**Location:** chunks.93.mjs:1568-1588

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools for subagent context
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
        // MCP tools are always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // ExitPlanMode allowed in plan mode
        if (tool.name === "ExitPlanMode" && permissionMode === "plan") return true;

        // Block background-excluded tools
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) return false;

        // Block non-built-in tools that require built-in status
        if (!isBuiltIn && BACKGROUND_AGENT_RESTRICTED.has(tool.name)) return false;

        // For async agents, only allow explicitly permitted tools
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Exception: Teammate agents can use team tools
            if (isAgentTeamsAvailable() && isInProcessTeammate()) {
                if (tool.name === "Agent") return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync, Y→permissionMode,
// CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS, eP1→ASYNC_AGENT_ALLOWED_TOOLS, WY4→TEAM_DELEGATE_TOOLS,
// xV8→BACKGROUND_AGENT_RESTRICTED, z3→toolNameEquals, aJ→"ExitPlanMode", r4→"Agent"
```

### Filtering Algorithm

```
1. MCP tools (mcp__*) → ALWAYS ALLOW
2. ExitPlanMode in plan mode → ALLOW
3. Tool in EXCLUDED_TOOLS → BLOCK
4. Non-built-in tool in RESTRICTED → BLOCK
5. Async mode:
   a. Tool in ALLOWED_TOOLS → ALLOW
   b. Teammate + team tool → ALLOW
   c. Otherwise → BLOCK
6. Default → ALLOW
```

---

## applyToolFilters (_c)

**What it does:** Applies full tool filtering including disallowed lists and tool allowlists.

**Location:** chunks.93.mjs:1590-1644

```javascript
// ============================================
// _c - applyToolFilters - Apply complete tool filtering
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
    // ... continues with allowlist handling
}

// READABLE (for understanding):
function applyToolFilters(filterConfig, allTools, isAsync = false, isForeground = false) {
    let {
        tools: allowlist,          // Tools to specifically allow
        disallowedTools,           // Tools to block
        source,                    // "built-in" or other
        permissionMode
    } = filterConfig;

    // Step 1: Apply context-based filtering
    let contextFiltered = isForeground
        ? allTools
        : filterToolsForSubagent({
            tools: allTools,
            isBuiltIn: source === "built-in",
            isAsync: isAsync,
            permissionMode: permissionMode
        });

    // Step 2: Remove disallowed tools
    let disallowedNames = new Set(
        disallowedTools?.map(t => parseToolReference(t).toolName) ?? []
    );
    let afterDisallowed = contextFiltered.filter(
        tool => !disallowedNames.has(tool.name)
    );

    // Step 3: Handle allowlist (if specified)
    if (allowlist === undefined || allowlist.length === 1 && allowlist[0] === "*") {
        // Wildcard - allow all remaining tools
        return {
            hasWildcard: true,
            validTools: [],
            invalidTools: [],
            resolvedTools: afterDisallowed
        };
    }

    // Step 4: Validate allowlist against available tools
    let toolMap = new Map();
    for (let tool of afterDisallowed) {
        toolMap.set(tool.name, tool);
    }

    let validTools = [];
    let invalidTools = [];
    let resolvedTools = [];
    let seenTools = new Set();
    let allowedAgentTypes;

    for (let toolRef of allowlist) {
        let { toolName, ruleContent } = parseToolReference(toolRef);

        // Special handling for Agent tool
        if (toolName === "Agent") {
            if (ruleContent) {
                allowedAgentTypes = ruleContent.split(",").map(s => s.trim());
            }
            if (!isForeground) {
                validTools.push(toolRef);
                continue;
            }
        }

        let tool = toolMap.get(toolName);
        if (tool) {
            validTools.push(toolRef);
            if (!seenTools.has(tool)) {
                resolvedTools.push(tool);
                seenTools.add(tool);
            }
        } else {
            invalidTools.push(toolRef);
        }
    }

    return {
        hasWildcard: false,
        validTools,
        invalidTools,
        resolvedTools,
        allowedAgentTypes
    };
}

// Mapping: _c→applyToolFilters, A→filterConfig, q→allTools, K→isAsync, Y→isForeground,
// Xk8→filterToolsForSubagent, CH→parseToolReference
```

---

## Helper Functions

### toolNameEquals (z3)

**What it does:** Checks if a tool matches a given name, including alias support.

**Location:** chunks.56.mjs:1588-1590

```javascript
// ============================================
// z3 - toolNameEquals - Check tool name with alias support
// Location: chunks.56.mjs:1588-1590
// ============================================

// ORIGINAL (for source lookup):
function z3(A, q) {
    return A.name === q || (A.aliases?.includes(q) ?? !1)
}

// READABLE (for understanding):
function toolNameEquals(tool, name) {
    return tool.name === name || (tool.aliases?.includes(name) ?? false);
}

// Mapping: z3→toolNameEquals, A→tool, q→name
```

**Why Alias Support?**

Some tools have multiple names for backwards compatibility:
- `Bash` may have alias `Shell`
- Agent definitions may reference deprecated tool names

The `?? false` fallback handles the case where `aliases` is undefined.

### findToolByName (dK)

**Location:** chunks.56.mjs:1592-1593

```javascript
// ============================================
// dK - findToolByName - Find tool in list by name
// Location: chunks.56.mjs:1592-1593
// ============================================

// ORIGINAL (for source lookup):
function dK(A, q) {
    return A.find((K) => z3(K, q))
}

// READABLE (for understanding):
function findToolByName(tools, name) {
    return tools.find((tool) => toolNameEquals(tool, name));
}

// Mapping: dK→findToolByName, A→tools, q→name, K→tool
```

---

## Complete Filtering Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     TOOL FILTERING DECISION TREE                              │
│                     (filterToolsForSubagent - Xk8)                            │
└─────────────────────────────────────────────────────────────────────────────┘

Tool passes through filter
        │
        ▼
┌───────────────────────────────────────────┐
│ tool.name.startsWith("mcp__") ?           │
└─────────────────┬─────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │ YES               │ NO
        ▼                   ▼
   [ALLOW]         ┌───────────────────────────────────────────┐
                   │ tool.name === "ExitPlanMode"              │
                   │ && permissionMode === "plan" ?            │
                   └─────────────────┬─────────────────────────┘
                                     │
                           ┌─────────┴─────────┐
                           │ YES               │ NO
                           ▼                   ▼
                      [ALLOW]         ┌───────────────────────────────────────────┐
                                      │ BACKGROUND_AGENT_EXCLUDED_TOOLS.has(name)?│
                                      └─────────────────┬─────────────────────────┘
                                                        │
                                              ┌─────────┴─────────┐
                                              │ YES               │ NO
                                              ▼                   ▼
                                         [BLOCK]         ┌───────────────────────────────────────────┐
                                                         │ !isBuiltIn && RESTRICTED.has(name)?       │
                                                         └─────────────────┬─────────────────────────┘
                                                                           │
                                                                 ┌─────────┴─────────┐
                                                                 │ YES               │ NO
                                                                 ▼                   ▼
                                                            [BLOCK]         ┌───────────────────────────────────────────┐
                                                                            │ isAsync && !ALLOWED_TOOLS.has(name)?      │
                                                                            └─────────────────┬─────────────────────────┘
                                                                                              │
                                                                                    ┌─────────┴─────────┐
                                                                                    │ YES               │ NO
                                                                                    ▼                   ▼
                                                                           ┌────────────────────────┐      [ALLOW]
                                                                           │ Teammate check:        │
                                                                           │ isAgentTeamsAvailable()│
                                                                           │ && isInProcessTeammate?│
                                                                           └────────┬───────────────┘
                                                                                    │
                                                                          ┌─────────┴─────────┐
                                                                          │ YES               │ NO
                                                                          ▼                   ▼
                                                                 ┌────────────────────────────┐      [BLOCK]
                                                                 │ tool.name === "Agent" ||   │
                                                                 │ TEAM_DELEGATE_TOOLS.has()? │
                                                                 └────────┬───────────────────┘
                                                                          │
                                                                ┌─────────┴─────────┐
                                                                │ YES               │ NO
                                                                ▼                   ▼
                                                           [ALLOW]            [BLOCK]
```

### Key Decision Points Explained

| Decision | Condition | Rationale |
|----------|-----------|-----------|
| MCP bypass | `mcp__` prefix | External tools are user-configured, always trusted |
| Plan mode ExitPlanMode | `permissionMode === "plan"` | Plan mode subagents need to exit plan mode |
| Excluded tools | `BACKGROUND_AGENT_EXCLUDED_TOOLS` | Tools that could cause issues in background context |
| Built-in restriction | `!isBuiltIn && RESTRICTED` | Non-built-in agents get limited tool access |
| Async restriction | `isAsync && !ALLOWED_TOOLS` | Background agents only get safe, non-blocking tools |
| Teammate exception | Team feature flags | Teammate agents can coordinate with team tools |

---

## Filtering Scenarios

### Scenario 1: Sync Subagent

```javascript
// Sync subagent gets most tools except blocked ones
filterToolsForSubagent({
    tools: allTools,
    isBuiltIn: true,
    isAsync: false,
    permissionMode: "default"
});
// Result: All tools except EXCLUDED_TOOLS
```

### Scenario 2: Background Agent

```javascript
// Background agent gets only allowed async tools
filterToolsForSubagent({
    tools: allTools,
    isBuiltIn: true,
    isAsync: true,
    permissionMode: "default"
});
// Result: Only tools in ASYNC_AGENT_ALLOWED_TOOLS
```

### Scenario 3: In-Process Teammate

```javascript
// Teammate gets async tools + team tools
filterToolsForSubagent({
    tools: allTools,
    isBuiltIn: true,
    isAsync: true,
    permissionMode: "default"
});
// If isAgentTeamsAvailable() && isInProcessTeammate():
// Result: ASYNC_AGENT_ALLOWED_TOOLS + TEAM_DELEGATE_TOOLS + Agent
```

### Scenario 4: Plan Mode Subagent

```javascript
// Plan mode subagent can exit plan mode
filterToolsForSubagent({
    tools: allTools,
    isBuiltIn: true,
    isAsync: false,
    permissionMode: "plan"
});
// Result: All tools except EXCLUDED_TOOLS (ExitPlanMode allowed)
```

---

## MCP Tool Handling

### Always Allowed

MCP (Model Context Protocol) tools are always allowed because:
1. They are external tools managed by the user
2. They don't have the same blocking concerns
3. User explicitly enabled them

```javascript
// MCP tool detection
if (tool.name.startsWith("mcp__")) {
    return true;  // Always allow MCP tools
}
```

### MCP Tool Name Format

```
mcp__{serverName}__{toolName}

Examples:
- mcp__filesystem__read_file
- mcp__github__create_issue
- mcp__postgres__query
```

---

## Tool Filtering Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         All Available Tools                                   │
│  (Full tool set from session configuration)                                  │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    filterToolsForSubagent (Xk8)                               │
│                                                                              │
│  1. MCP tools (mcp__*) → PASS                                               │
│  2. ExitPlanMode in plan mode → PASS                                        │
│  3. In EXCLUDED_TOOLS → FAIL                                                │
│  4. Non-built-in in RESTRICTED → FAIL                                       │
│  5. Async mode:                                                             │
│     a. In ALLOWED_TOOLS → PASS                                              │
│     b. Teammate + team tool → PASS                                          │
│     c. Otherwise → FAIL                                                     │
│  6. Default → PASS                                                           │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    applyToolFilters (_c)                                      │
│                                                                              │
│  1. Remove disallowedTools                                                   │
│  2. Apply allowlist (if specified)                                          │
│  3. Validate against available tools                                        │
│  4. Return { validTools, invalidTools, resolvedTools }                      │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Final Tool Set                                             │
│  (Filtered tools available to subagent)                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | ✓ Verified |
| `_c` | applyToolFilters | chunks.93.mjs:1590 | ✓ Verified |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | ✓ Verified |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | ✓ Verified |
| `WY4` | TEAM_DELEGATE_TOOLS | chunks.91.mjs:269 | ✓ Verified |
| `xV8` | BACKGROUND_AGENT_RESTRICTED | chunks.91.mjs:269 | ✓ Verified |

---

## Related Documents

- [agent_tool_complete.md](./agent_tool_complete.md) - AgentTool analysis
- [tools_integration.md](./tools_integration.md) - Tool integration
- [../05_tools/](../05_tools/) - Tools module