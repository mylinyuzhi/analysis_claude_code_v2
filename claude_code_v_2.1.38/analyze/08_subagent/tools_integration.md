# Tools Integration - Subagent Tool Set Assembly (Claude Code 2.1.38)

> Deep analysis of how tools are assembled, filtered, and propagated to subagents

---

## Table of Contents

1. [Overview](#overview)
2. [Tool Set Assembly Pipeline](#tool-set-assembly-pipeline)
3. [Context Derivation](#context-derivation)
4. [Tool Whitelists](#tool-whitelists)
5. [Permission Filtering](#permission-filtering)
6. [Integration Points](#integration-points)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `assembleSessionToolSet` (YP6) - Main entry point for assembling the tool set for an agent session
- `deriveToolUseContext` (vQ1) - Derives a new tool use context from parent context
- `BACKGROUND_AGENT_ALLOWED_TOOLS` (Bj1) - Set of tools available to background agents
- `DELEGATE_ALLOWED_TOOLS` (R_6) - Set of tools available in delegate mode
- `ALL_SAFE_TOOLS` (L_6) - Set of safe tools that can be used without restriction
- `STRUCTURED_TASK_TOOLS` (np7) - Set of structured task management tools
- `getDefaultTools` (tD) - Returns the default set of tools for a permission mode
- `filterToolsByRules` (hg1) - Filters tools based on permission deny rules

---

## 1. Overview

When a subagent is spawned, it needs its own set of available tools. The tool set is not simply copied from the parent - it undergoes a sophisticated assembly and filtering process that considers:

1. **Permission mode** - What permission level the subagent operates under
2. **Agent type** - Whether it's a background agent, delegate, teammate, etc.
3. **MCP servers** - What MCP tools are available
4. **Permission rules** - Explicit allow/deny configurations
5. **Isolation requirements** - Whether the subagent needs its own `readFileState`

This document explains how the `assembleSessionToolSet` (YP6) function orchestrates this process and how `deriveToolUseContext` (vQ1) creates the isolated context wrapper.

---

## 2. Tool Set Assembly Pipeline

### `assembleSessionToolSet` (YP6)

**What it does:** Given a permission context and MCP tools, returns the filtered set of tools available for that session.

**How it works:**

```javascript
// ============================================
// assembleSessionToolSet - Main tool set assembly function
// Location: chunks.141.mjs:1476-1485
// ============================================

// ORIGINAL (for source lookup):
function YP6(A, q) {
    let K = tD(A);
    if (O$()) return K;
    let Y = hg1(q, A),
        z = Sx([...K, ...Y], "name");
    if (A.mode === "delegate") return z.filter((w) => R_6.has(w.name));
    return z
}

// READABLE (for understanding):
function assembleSessionToolSet(permissionContext, mcpTools) {
    // Step 1: Get default tools for this permission mode
    let defaultTools = getDefaultTools(permissionContext);

    // Step 2: If filtering is disabled, return defaults immediately
    if (isFilteringDisabled()) return defaultTools;

    // Step 3: Filter MCP tools by permission rules
    let filteredMcpTools = filterToolsByRules(mcpTools, permissionContext);

    // Step 4: Merge and deduplicate by tool name
    let allTools = uniqueBy([...defaultTools, ...filteredMcpTools], "name");

    // Step 5: For delegate mode, only allow whitelisted tools
    if (permissionContext.mode === "delegate")
        return allTools.filter(tool => DELEGATE_ALLOWED_TOOLS.has(tool.name));

    return allTools;
}

// Mapping: YP6->assembleSessionToolSet, A->permissionContext, q->mcpTools,
//          K->defaultTools, tD->getDefaultTools, O$->isFilteringDisabled,
//          Y->filteredMcpTools, hg1->filterToolsByRules, z->allTools,
//          Sx->uniqueBy, R_6->DELEGATE_ALLOWED_TOOLS
```

**Why this approach:**

1. **Default tools first:** The `getDefaultTools` (tD) function returns a baseline set appropriate for the permission mode. This ensures core functionality is always available.

2. **Filtering bypass:** The `isFilteringDisabled` (O$) check allows for scenarios where all tool restrictions should be lifted (e.g., testing, debugging).

3. **MCP tool integration:** MCP tools are filtered separately because they have different permission semantics - they come from external servers and may have their own access controls.

4. **Delegate mode special case:** In delegate mode, the tool set is severely restricted to only those in the `DELEGATE_ALLOWED_TOOLS` whitelist. This prevents delegated agents from performing dangerous operations.

### Tool Assembly in AgentTool

The `assembleSessionToolSet` is called within `AgentTool.call()` to determine available tools:

```javascript
// ============================================
// Tool set assembly in AgentTool.call()
// Location: chunks.132.mjs:227-240
// ============================================

// ORIGINAL (for source lookup):
let U = (w === !0 || g) && !KP6,
    x = {
        ...P.toolPermissionContext,
        mode: T.permissionMode ?? "acceptEdits"
    },
    p = YP6(x, P.mcp.tools),

// READABLE (for understanding):
let isBackgroundOrAsync = (run_in_background === true || isAsyncFlag) && !BACKGROUND_TASKS_DISABLED;
let effectivePermissionContext = {
    ...appState.toolPermissionContext,
    mode: selectedAgent.permissionMode ?? "acceptEdits"
};
let availableTools = assembleSessionToolSet(effectivePermissionContext, appState.mcp.tools);

// Mapping: U->isBackgroundOrAsync, w->run_in_background, g->isAsyncFlag,
//          KP6->BACKGROUND_TASKS_DISABLED, x->effectivePermissionContext,
//          P->appState, T->selectedAgent, p->availableTools
```

**Key insight:** The permission mode can be overridden by the agent definition's `permissionMode` field. This allows specific agent types to operate under different permission levels than the parent session.

---

## 3. Context Derivation

### `deriveToolUseContext` (vQ1)

**What it does:** Creates a new `toolUseContext` object for the subagent, deriving values from the parent context while maintaining isolation for certain state.

**How it works:**

```javascript
// ============================================
// deriveToolUseContext - Create isolated tool use context for subagent
// Location: chunks.130.mjs:2080-2098
// ============================================

// ORIGINAL (for source lookup):
}, q1 = vQ1(K, {
    options: j1,
    agentId: f,
    agentType: A.agentType,
    messages: N,
    readFileState: T,
    forkContextMessages: H,
    querySource: $,
    toolPermissionContext: x
})

// READABLE (for understanding):
let toolUseContextForAgent = deriveToolUseContext(parentToolUseContext, {
    options: {
        // Cloned/derived options
        mainLoopModel: resolvedModel,
        maxThinkingTokens: 0,
        mcpClients: mcpClients,
        mcpResources: parentContext.options.mcpResources,
        agentDefinitions: parentContext.options.agentDefinitions
    },
    agentId: newAgentId,
    agentType: agentDefinition.agentType,
    messages: assembledMessages,
    readFileState: clonedReadFileState,  // ISOLATION POINT
    forkContextMessages: forkMessages,
    querySource: source,
    toolPermissionContext: effectivePermissionContext
});

// Mapping: q1->toolUseContextForAgent, K->parentToolUseContext, j1->derivedOptions,
//          f->newAgentId, A->agentDefinition, N->assembledMessages, T->clonedReadFileState,
//          H->forkMessages, $->source, x->effectivePermissionContext
```

### What is Cloned vs Shared

| Property | Behavior | Rationale |
|----------|----------|-----------|
| `messages` | **Shared reference** | Subagent needs visibility into message history for context |
| `readFileState` | **Cloned (Map copy)** | Each subagent tracks its own file reads independently |
| `mcpClients` | **Shared reference** | MCP client connections are process-global |
| `toolPermissionContext` | **Derived** | Subagent may have different permission mode |
| `agentDefinitions` | **Shared reference** | Registry is global; subagent shouldn't modify it |
| `abortController` | **New instance** | Subagent needs independent cancellation control |

### readFileState Isolation

**Why `readFileState` must be cloned:**

```javascript
// ============================================
// readFileState cloning for isolation
// Location: chunks.130.mjs:2076-2078
// ============================================

// ORIGINAL (for source lookup):
let T = new Map(K.readFileState);

// READABLE (for understanding):
let clonedReadFileState = new Map(parentToolUseContext.readFileState);

// Mapping: T->clonedReadFileState, K->parentToolUseContext
```

**The problem it solves:**
- The `readFileState` Map tracks which files have been read by the agent
- This state affects how the Edit tool validates changes (prevents concurrent edits)
- If subagent shares parent's `readFileState`, file reads by the subagent would pollute the parent's state
- Cloning ensures each agent maintains independent file tracking

**Example scenario:**
1. Parent reads `config.json`
2. Parent spawns subagent to analyze `config.json`
3. Subagent reads `config.json` - this should NOT affect parent's file state
4. If shared, parent would incorrectly think someone else modified the file
5. With cloning, subagent has its own independent tracking

---

## 4. Tool Whitelists

### BACKGROUND_AGENT_ALLOWED_TOOLS (Bj1)

**What it is:** A Set of tool names that background agents are allowed to use.

```javascript
// ============================================
// BACKGROUND_AGENT_ALLOWED_TOOLS - Tool whitelist for background agents
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
Bj1 = new Set([uj1, bW, N_6, fK, TH, bj1])

// READABLE (for understanding):
BACKGROUND_AGENT_ALLOWED_TOOLS = new Set([
    "TaskOutput",      // uj1 - Check status of other tasks
    "ExitPlanMode",    // bW - Exit plan mode if in one
    "EnterPlanMode",   // N_6 - Enter plan mode
    "Task",            // fK - Spawn nested subagents
    "AskUserQuestion", // TH - Ask user for clarification
    "TaskStop"         // bj1 - Stop a running task
])

// Mapping: Bj1->BACKGROUND_AGENT_ALLOWED_TOOLS, uj1->TASK_OUTPUT_TOOL_NAME,
//          bW->TOOL_NAME_EXIT_PLAN_MODE, N_6->TOOL_NAME_ENTER_PLAN_MODE,
//          fK->TOOL_NAME_AGENT, TH->TOOL_NAME_ASK_USER_QUESTION, bj1->TASK_STOP_TOOL_NAME
```

**Why these tools specifically:**
- Background agents run autonomously without user visibility
- They should NOT have access to file modification tools (Edit, Write) directly
- They CAN coordinate with other agents (Task, TaskOutput, TaskStop)
- They CAN request user input (AskUserQuestion) for clarification
- They CAN manage their own execution mode (EnterPlanMode, ExitPlanMode)

### DELEGATE_ALLOWED_TOOLS (R_6)

**What it is:** A Set of tool names available in delegate mode.

```javascript
// ============================================
// DELEGATE_ALLOWED_TOOLS - Tool whitelist for delegate mode
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
R_6 = new Set([vh, VK1, iB, Nh, NK1, TK1, DR, fK])

// READABLE (for understanding):
DELEGATE_ALLOWED_TOOLS = new Set([
    "TeamCreate",      // vh - Create a team
    "TeamDelete",      // VK1 - Delete a team
    "SendMessage",     // iB - Send message to teammates
    "TaskCreate",      // Nh - Create a structured task
    "TaskGet",         // NK1 - Get task details
    "TaskList",        // TK1 - List all tasks
    "TaskUpdate",      // DR - Update a task
    "Task"             // fK - Spawn subagents
])

// Mapping: R_6->DELEGATE_ALLOWED_TOOLS, vh->TOOL_NAME_TEAM_CREATE,
//          VK1->TOOL_NAME_TEAM_DELETE, iB->TOOL_NAME_SEND_MESSAGE,
//          Nh->TOOL_NAME_TASK_CREATE, NK1->TOOL_NAME_TASK_GET,
//          TK1->TOOL_NAME_TASK_LIST, DR->TOOL_NAME_TASK_UPDATE, fK->TOOL_NAME_AGENT
```

**Why delegate mode is more restricted:**
- Delegate mode is used for high-level orchestration
- Delegates should focus on task coordination, not file operations
- They have access to team communication (SendMessage) and task management
- They can spawn subagents (Task) to do actual work

### ALL_SAFE_TOOLS (L_6)

**What it is:** A Set of tools considered "safe" - can be used in restricted contexts.

```javascript
// ============================================
// ALL_SAFE_TOOLS - Safe tools that can be used without restriction
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
L_6 = new Set([Jq, JL, cg, s9, xO, Jz, h4, bq, f5, jM, NJ, cD, dM, ...[], iB])

// READABLE (for understanding):
ALL_SAFE_TOOLS = new Set([
    "Read",            // Jq - Read files (safe, read-only)
    "WebSearch",       // JL - Search the web
    "Grep",            // cg - Search file contents
    "Glob",            // s9 - Find files by pattern
    "WebFetch",        // xO - Fetch web content
    "ListFiles",       // Jz - List directory contents
    "Bash",            // h4 - Execute bash commands (with restrictions)
    "Edit",            // bq - Edit files (surprisingly included)
    "Write",           // f5 - Write files
    "NotebookEdit",    // jM - Edit Jupyter notebooks
    "Skill",           // NJ - Invoke skills
    "StructuredOutput",// cD - Structured output
    "ToolSearch",      // dM - Search for tools
    // ... potentially more from spread operator
    "SendMessage"      // iB - Team messaging
])

// Mapping: L_6->ALL_SAFE_TOOLS, Jq->TOOL_NAME_READ, JL->TOOL_NAME_WEB_SEARCH,
//          cg->TOOL_NAME_GREP, s9->TOOL_NAME_GLOB, xO->TOOL_NAME_WEB_FETCH,
//          Jz->TOOL_NAME_LIST_FILES, h4->TOOL_NAME_BASH, bq->TOOL_NAME_EDIT,
//          f5->TOOL_NAME_WRITE, jM->TOOL_NAME_NOTEBOOK_EDIT, NJ->TOOL_NAME_SKILL,
//          cD->STRUCTURED_OUTPUT_NAME, dM->TOOL_NAME_TOOL_SEARCH, iB->TOOL_NAME_SEND_MESSAGE
```

### STRUCTURED_TASK_TOOLS (np7)

**What it is:** Tools for structured task management (Todo-like operations).

```javascript
// ============================================
// STRUCTURED_TASK_TOOLS - Structured task management tools
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
np7 = new Set([Nh, NK1, TK1, DR])

// READABLE (for understanding):
STRUCTURED_TASK_TOOLS = new Set([
    "TaskCreate",      // Nh - Create a structured task
    "TaskGet",         // NK1 - Get task details
    "TaskList",        // TK1 - List all tasks
    "TaskUpdate"       // DR - Update a task
])

// Mapping: np7->STRUCTURED_TASK_TOOLS
```

### Tool Whitelist Application

```javascript
// ============================================
// Tool whitelist application in filterToolsForSubagent
// Location: chunks.90.mjs:2455-2474
// ============================================

// ORIGINAL (for source lookup):
function filterToolsForSubagent(A, q, K, Y) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z.name === bW && Y === "plan") return !0;
        if (Bj1.has(z.name)) return !1;
        if (!q && VjA.has(z.name)) return !1;
        if (K && !L_6.has(z.name)) {
            if (l8() && MM()) {
                if (z.name === fK) return !0;
                if (np7.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}

// READABLE (for understanding):
function filterToolsForSubagent(tools, canUseTaskTools, isStrictSafe, permissionMode) {
    return tools.filter((tool) => {
        // MCP tools are always allowed (they have their own permission system)
        if (tool.name.startsWith("mcp__")) return true;

        // ExitPlanMode is allowed in plan mode
        if (tool.name === "ExitPlanMode" && permissionMode === "plan") return true;

        // Background-agent-only tools are never available to regular subagents
        if (BACKGROUND_AGENT_ALLOWED_TOOLS.has(tool.name)) return false;

        // If canUseTaskTools is false, restrict async/batch tools
        if (!canUseTaskTools && ASYNC_BATCH_TOOLS.has(tool.name)) return false;

        // In strict safe mode, only allow safe tools
        if (isStrictSafe && !ALL_SAFE_TOOLS.has(tool.name)) {
            // Exception: in agent teams with in-process teammate, allow Task and task tools
            if (isAgentTeamsEnabled() && isInProcessTeammate()) {
                if (tool.name === "Task") return true;
                if (STRUCTURED_TASK_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: A->tools, q->canUseTaskTools, K->isStrictSafe, Y->permissionMode,
//          z->tool, Bj1->BACKGROUND_AGENT_ALLOWED_TOOLS, VjA->ASYNC_BATCH_TOOLS,
//          L_6->ALL_SAFE_TOOLS, l8->isAgentTeamsEnabled, MM->isInProcessTeammate,
//          fK->TOOL_NAME_AGENT, np7->STRUCTURED_TASK_TOOLS
```

**Key insight:** The filtering logic creates a hierarchy of tool availability:
1. MCP tools always pass through (external permission system)
2. Background-agent-only tools are always excluded for non-background agents
3. Strict safe mode restricts to `ALL_SAFE_TOOLS` with exceptions for agent teams
4. Task tools have special handling based on context

---

## 5. Permission Filtering

### `filterToolsByRules` (hg1)

**What it does:** Filters tools based on permission deny rules from the permission context.

```javascript
// ============================================
// filterToolsByRules - Filter tools by permission rules
// Location: chunks.141.mjs:1469-1474
// ============================================

// ORIGINAL (for source lookup):
function hg1(A, q) {
    let K = tU(q);
    return A.filter((Y) => {
        return !K.some((z) => z.ruleValue.toolName === Y.name && z.ruleValue.ruleContent === void 0)
    })
}

// READABLE (for understanding):
function filterToolsByRules(tools, permissionContext) {
    let denyRules = getDenyRules(permissionContext);
    return tools.filter((tool) => {
        // A tool is denied if there's a rule matching its name with no specific content
        // (content-specific rules like "Task(code)" are handled separately)
        return !denyRules.some(
            (rule) => rule.ruleValue.toolName === tool.name && rule.ruleValue.ruleContent === undefined
        );
    });
}

// Mapping: hg1->filterToolsByRules, A->tools, q->permissionContext,
//          K->denyRules, tU->getDenyRules, Y->tool, z->rule
```

**Why `ruleContent === undefined` matters:**
- Permission rules can be general (`toolName: "Bash"`) or specific (`toolName: "Task", ruleContent: "code"`)
- General rules (`ruleContent: undefined`) apply to all uses of that tool
- Specific rules apply only to certain parameter values
- This filter only removes tools blocked by general rules; specific rules are handled during tool execution

### `filterDeniedAgents` (pEA)

**What it does:** Filters agent definitions by permission deny rules targeting the Task tool.

```javascript
// ============================================
// filterDeniedAgents - Remove permission-denied agent types
// Location: chunks.172.mjs:1900-1902
// ============================================

// ORIGINAL (for source lookup):
function pEA(A, q, K) {
    return A.filter((Y) => cEA(q, K, Y.agentType) === null)
}

// READABLE (for understanding):
function filterDeniedAgents(agentDefinitions, toolPermissionContext, toolName) {
    return agentDefinitions.filter(
        (agentDef) => getDenialSource(toolPermissionContext, toolName, agentDef.agentType) === null
    );
}

// Mapping: pEA->filterDeniedAgents, A->agentDefinitions, q->toolPermissionContext,
//          K->toolName, Y->agentDef, cEA->getDenialSource
```

**See also:** Detailed analysis in [agent_tool.md](./agent_tool.md#2-permission-filtering)

---

## 6. Integration Points

### Tool Assembly Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Parent Agent Context                          │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ toolUseContext                                                   ││
│  │   ├── messages: Message[]                                        ││
│  │   ├── readFileState: Map<path, state>                            ││
│  │   ├── mcp.tools: Tool[]                                          ││
│  │   ├── toolPermissionContext: { mode, rules }                     ││
│  │   └── options: { agentDefinitions, mcpResources, ... }          ││
│  └─────────────────────────────────────────────────────────────────┘│
│                              ↓                                       │
│              AgentTool.call({ subagent_type, prompt, ... })         │
└─────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     Tool Set Assembly                                │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ 1. Resolve permission mode:                                      ││
│  │    effectiveMode = agentDef.permissionMode ?? "acceptEdits"     ││
│  └─────────────────────────────────────────────────────────────────┘│
│                              ↓                                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ 2. Assemble tool set (YP6):                                      ││
│  │    a. getDefaultTools(permissionContext) → baseline tools        ││
│  │    b. filterToolsByRules(mcpTools, permissions) → allowed MCP   ││
│  │    c. merge + deduplicate by name                               ││
│  │    d. if delegate mode → filter to DELEGATE_ALLOWED_TOOLS      ││
│  └─────────────────────────────────────────────────────────────────┘│
│                              ↓                                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ 3. Clone readFileState:                                          ││
│  │    clonedState = new Map(parent.readFileState)                  ││
│  └─────────────────────────────────────────────────────────────────┘│
│                              ↓                                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ 4. Derive tool use context (vQ1):                                ││
│  │    newContext = {                                                ││
│  │      ...parent,                                                  ││
│  │      agentId: newId,                                             ││
│  │      readFileState: clonedState,  // ISOLATED                   ││
│  │      toolPermissionContext: { ...parent, mode: effectiveMode }, ││
│  │      messages: assembledMessages                                 ││
│  │    }                                                             ││
│  └─────────────────────────────────────────────────────────────────┘│
│                              ↓                                       │
│                  agentLoopRunner({ availableTools, toolUseContext })│
└─────────────────────────────────────────────────────────────────────┘
```

### Cross-References

- **[agent_tool.md](./agent_tool.md)** - How AgentTool.call() invokes tool assembly
- **[execution_flow_deep_dive.md](./execution_flow_deep_dive.md)** - How tool use context is used in the agent loop
- **[../05_tools/](../05_tools/)** - Tool execution pipeline details
- **[../03_llm_core/](../03_llm_core/)** - How tools are presented to the LLM

---

## Summary

The tools integration system ensures that subagents receive appropriate, isolated tool sets:

1. **Assembly Pipeline** - `assembleSessionToolSet` combines defaults + MCP tools with filtering
2. **Context Isolation** - `deriveToolUseContext` creates independent `readFileState` for each subagent
3. **Whitelists** - Different agent types (background, delegate) have different tool restrictions
4. **Permission Filtering** - Tools and agent types can be denied by explicit permission rules

This design enables secure, controlled delegation of work to specialized agents while maintaining proper isolation and permission boundaries.