# Tools Integration - Subagent System (Claude Code 2.1.76)

## Overview

This document covers tool set assembly for subagents, the tool whitelists for different agent types, and the context derivation that makes tools available to the subagent's LLM.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `assembleSessionToolSet` (YP6) - Main tool set assembly - chunks.141.mjs:1476
- `deriveToolUseContext` (vQ1) - Create isolated context for subagent - chunks.149.mjs:2589
- `filterToolsForSubagent` (Xk8) - Filter tools based on agent type - chunks.93.mjs:1568
- `applyToolFilters` (_c) - Apply whitelist/blacklist - chunks.93.mjs:1590

---

## Tool Set Definitions (Source Code Verified)

### CW6 - Background Agent Excluded Tools

Tools that are **excluded** from background/async agents. These tools require user interaction or supervision:

```javascript
// ============================================
// CW6 - Background Agent Excluded Tools
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
CW6 = new Set([$C, aJ, dt, r4, Fw, OC])

// READABLE (for understanding):
BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // $C - Write to background task output
    "ExitPlanMode",    // aJ - Exit plan mode
    "EnterPlanMode",   // dt - Enter plan mode
    "Agent",           // r4 - Spawn subagents (Task tool)
    "AskUserQuestion", // Fw - Request user input
    "TaskStop"         // OC - Stop running task
])

// Mapping: CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS
```

**Why excluded:** Background agents run without continuous user supervision. These tools either:
1. Create UI prompts (AskUserQuestion)
2. Modify task state (TaskStop, TaskOutput)
3. Spawn nested agents (Agent/Task)
4. Change mode state (EnterPlanMode, ExitPlanMode)

### xV8 - Async Agent Excluded Tools (Copy)

```javascript
// ============================================
// xV8 - Async Agent Excluded Tools
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL:
xV8 = new Set([...CW6])

// READABLE:
ASYNC_AGENT_EXCLUDED_TOOLS = new Set([...BACKGROUND_AGENT_EXCLUDED_TOOLS])

// Mapping: xV8→ASYNC_AGENT_EXCLUDED_TOOLS
```

A copy of CW6 used for additional filtering in certain contexts.

### eP1 - Async Agent Allowed Tools

Tools **allowed** for async/background agents when the tool whitelist is restricted:

```javascript
// ============================================
// eP1 - Async Agent Allowed Tools
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL:
eP1 = new Set([s7, jv, MB, N9, sO, qz, ...ZU, R4, _K, bJ, oH, oM, HZ, sP1, tP1])

// READABLE:
ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read",            // s7 - Read files
    "WebSearch",       // jv - Search the web
    "TodoWrite",       // MB - Write todo items
    "Grep",            // N9 - Search file contents
    "WebFetch",        // sO - Fetch web content
    "Glob",            // qz - Find files by pattern
    "Bash",            // ZU (Q7) - Execute shell commands
    "Edit",            // R4 - Edit files
    "Write",           // _K - Write files
    "NotebookEdit",    // bJ - Edit Jupyter notebooks
    "Skill",           // oH - Invoke skills
    "StructuredOutput",// oM - Structured output
    "ToolSearch",      // HZ - Search for tools
    "EnterWorktree",   // sP1 - Enter worktree
    "ExitWorktree"     // tP1 - Exit worktree
])

// Mapping: eP1→ASYNC_AGENT_ALLOWED_TOOLS
```

**Design rationale:** These tools enable productive work without requiring user interaction. File modification tools (Edit, Write) are included because the agent needs them to complete tasks autonomously.

### WY4 - Team/Delegate Tools

Tools available to delegate mode agents (orchestrators in multi-agent teams):

```javascript
// ============================================
// WY4 - Team/Delegate Tools
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL:
WY4 = new Set([TR, lt, it, ck, hI, ER, ed, SW6])

// READABLE:
TEAM_DELEGATE_TOOLS = new Set([
    "TaskCreate",      // TR - Create structured task
    "TaskGet",         // lt - Get task status
    "TaskList",        // it - List all tasks
    "TaskUpdate",      // ck - Update task fields
    "SendMessage",     // hI - Send message to teammate
    "CronCreate",      // ER - Create cron job
    "CronDelete",      // ed - Delete cron job
    "CronList"         // SW6 - List cron jobs
])

// Mapping: WY4→TEAM_DELEGATE_TOOLS
```

**Why these tools:** Delegate agents are orchestrators whose job is to coordinate, not execute directly. They need team/task management and scheduling tools but not file manipulation tools.

### Ufq - Safe Tools for Plan Mode Filtering

Tools that are considered "safe" for certain permission modes:

```javascript
// ============================================
// Ufq - Safe Tools Set
// Location: chunks.172.mjs:2502
// ============================================

// ORIGINAL:
Ufq = new Set([s7, N9, qz, Ai6, HZ, qi6, "ReadMcpResourceTool", MB, TR, lt, ck, it, OC, $C, Fw, dt, Uk, SI, l36, hI, gz6, ...gfq ? [gfq] : [], ...Ffq ? [Ffq] : [], ...pfq ? [pfq] : [], cc6])

// READABLE:
SAFE_TOOLS = new Set([
    // Read-only tools
    "Read", "Grep", "Glob", "LSP", "ToolSearch",
    "ListMcpResourcesTool", "ReadMcpResourceTool",
    // Task management
    "TodoWrite", "TaskCreate", "TaskGet", "TaskUpdate", "TaskList",
    "TaskStop", "TaskOutput",
    // User interaction
    "AskUserQuestion",
    // Mode management
    "EnterPlanMode", "ExitPlanMode",
    // Team tools
    "TeamCreate", "TeamDelete", "SendMessage",
    // Utility
    "Sleep", "classify_result"
])

// Mapping: Ufq→SAFE_TOOLS
```

### LYz - File Modification Tools

Tools that modify files (used for permission checking):

```javascript
// ============================================
// LYz - File Modification Tools
// Location: chunks.172.mjs:2502
// ============================================

// ORIGINAL:
LYz = new Set([_K, R4, bJ])

// READABLE:
FILE_MODIFICATION_TOOLS = new Set([
    "Write",           // _K
    "Edit",            // R4
    "NotebookEdit"     // bJ
])

// Mapping: LYz→FILE_MODIFICATION_TOOLS
```

### GY4 - All Safe Tools (Read-Only Exploration)

```javascript
// ============================================
// GY4 - All Safe Tools for Exploration
// Location: chunks.91.mjs:305
// ============================================

// ORIGINAL:
GY4 = new Set(["Read", "Write", "Edit", "Glob", "Grep", "Bash", "NotebookEdit"])

// READABLE:
ALL_SAFE_TOOLS = new Set([
    "Read", "Write", "Edit", "Glob", "Grep", "Bash", "NotebookEdit"
])

// Mapping: GY4→ALL_SAFE_TOOLS
```

Used by the Explore agent type and for skills that need read/write access.

---

## Tool Filtering Logic

### filterToolsForSubagent (Xk8)

The main filtering function that determines which tools are available to a subagent:

```javascript
// ============================================
// filterToolsForSubagent - Tool filtering for subagents
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

        // Background agent excluded tools are filtered out
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) return false;

        // Non-builtin async excluded tools
        if (!isBuiltIn && ASYNC_AGENT_EXCLUDED_TOOLS.has(tool.name)) return false;

        // Async agents: only allowed tools pass
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Special case: team-enabled mode
            if (isAgentTeamsEnabled() && isDelegateMode()) {
                // Agent tool and team tools allowed
                if (tool.name === "Agent") return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync, Y→permissionMode, z→tool
```

### Filtering Decision Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Tool Filtering Flow                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Is MCP tool (name.startsWith("mcp__"))?                 │
│     └─ YES → ALLOW                                           │
│                                                              │
│  2. Is ExitPlanMode and permissionMode === "plan"?          │
│     └─ YES → ALLOW                                           │
│                                                              │
│  3. Is tool in CW6 (Background Excluded)?                   │
│     └─ YES → DENY                                            │
│                                                              │
│  4. Is !isBuiltIn AND tool in xV8 (Async Excluded)?         │
│     └─ YES → DENY                                            │
│                                                              │
│  5. Is isAsync AND tool NOT in eP1 (Async Allowed)?         │
│     └─ YES:                                                  │
│        a. Is team-enabled AND delegate mode?                 │
│           ├─ Is tool "Agent"? → ALLOW                        │
│           ├─ Is tool in WY4 (Team Tools)? → ALLOW            │
│           └─ Else → DENY                                     │
│     └─ NO → ALLOW                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## assembleSessionToolSet (YP6)

Builds the complete, filtered tool set for the subagent based on the agent definition's tool configuration and the parent's permission context.

```javascript
// ============================================
// assembleSessionToolSet - Tool assembly for subagent
// Location: chunks.141.mjs:1476
// ============================================

// READABLE (for understanding):
async function assembleSessionToolSet(toolUseContext, agentDefinition) {
    // Start with all available tools
    let allTools = getAvailableTools(toolUseContext);

    // Apply tool whitelist if defined
    if (agentDefinition.tools && agentDefinition.tools.length > 0) {
        allTools = allTools.filter(t => agentDefinition.tools.includes(t.name));
    }

    // Apply tool blacklist
    if (agentDefinition.disallowedTools && agentDefinition.disallowedTools.length > 0) {
        allTools = allTools.filter(t => !agentDefinition.disallowedTools.includes(t.name));
    }

    // Filter by MCP server availability
    allTools = filterByMcpAvailability(allTools, toolUseContext);

    return allTools;
}

// Mapping: YP6→assembleSessionToolSet
```

---

## Design Rationale

### Why Whitelist AND Blacklist?

**Only whitelist:** Inflexible - must enumerate all desired tools, easy to miss new tools added to the system.

**Only blacklist:** Inflexible in the other direction - new dangerous tools added to the system automatically become available.

**Both:** More expressive. Teams can define "use only these tools" OR "use everything except these tools" depending on their needs. The delegate and background agent models are good examples: they use restricted sets because their tool sets are specific and bounded.

### Why Exclude Tools for Background Agents?

Background agents run asynchronously without user supervision. Excluding tools that:
1. **Create UI prompts** - User won't be watching to respond
2. **Modify task state** - Could interfere with parent agent's task management
3. **Spawn nested agents** - Could create runaway agent chains
4. **Change mode state** - User expects mode to remain consistent

### Why Filter by MCP Availability?

Tools from MCP servers become unavailable if the server disconnects. Filtering them out prevents the subagent from attempting to call tools that will always fail. Better to exclude them upfront with a clear "tool unavailable" message than to let the subagent encounter opaque errors mid-execution.

---

## Symbol Mapping Summary

| Obfuscated | Readable | Location | Description |
|------------|----------|----------|-------------|
| CW6 | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | Tools excluded from background agents |
| xV8 | ASYNC_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | Copy of CW6 for additional filtering |
| eP1 | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | Tools allowed for async agents |
| WY4 | TEAM_DELEGATE_TOOLS | chunks.91.mjs:269 | Team/cron tools for delegates |
| Ufq | SAFE_TOOLS | chunks.172.mjs:2502 | Safe tools for plan mode |
| LYz | FILE_MODIFICATION_TOOLS | chunks.172.mjs:2502 | Write, Edit, NotebookEdit |
| D$$ | ALL_TOOLS_COMBINED | chunks.172.mjs:2502 | Ufq + LYz combined |
| GY4 | ALL_SAFE_TOOLS | chunks.91.mjs:305 | Read, Write, Edit, Glob, Grep, Bash, NotebookEdit |
| Xk8 | filterToolsForSubagent | chunks.93.mjs:1568 | Tool filtering function |
| YP6 | assembleSessionToolSet | chunks.141.mjs:1476 | Tool set assembly |