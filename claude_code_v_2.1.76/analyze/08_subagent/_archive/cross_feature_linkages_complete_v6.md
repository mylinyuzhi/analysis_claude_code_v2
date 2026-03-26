# Cross-Feature Linkages Complete V6 (Claude Code 2.1.76)

> Complete documentation of cross-feature integrations between subagent/background agent systems and other modules including compact, hooks, tools, MCP, permissions, and auto-memory.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified.md](./cross_validation_unified.md) - Unified symbol verification

---

## Integration Matrix

| Module | Integration Type | Key Functions | Description |
|--------|-----------------|---------------|-------------|
| 04_system_reminder | Attachment Producer | `suY`, `f4`, `wY4` | Task status attachments |
| 05_tools | Tool Filtering | `Xk8`, `_c` | Subagent tool access control |
| 06_mcp | Client Inheritance | `fvY`, `mc6` | MCP server sharing |
| 07_compact | Message Recording | `TvY`, `dg` | Transcript preservation |
| 11_hooks | Hook Registration | `r24`, `zZ6` | Subagent-specific hooks |
| 12_plan_mode | Permission Mode | `AhY`, `iP1` | Plan approval for teammates |
| 17_telemetry | Event Tracking | `c36`, `nl4` | Task progress telemetry |
| 31_auto_memory | Memory Loading | `d14`, `Cv9` | Agent memory contexts |
| 30_agent_teams | Teammate Spawning | `qn4`, `pNY` | Team-based agents |

---

## Integration 1: Tools Module (05_tools)

### Tool Filtering for Subagents

**What it does:** Filters available tools based on agent type and execution mode.

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
        if (isToolNamed(tool, "ExitPlanMode") && permissionMode === "plan") {
            return true;
        }

        // Background agent excluded tools - never allow
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) return false;

        // Built-in excluded tools - skip for non-built-in agents
        if (!isBuiltIn && BUILTIN_EXCLUDED_TOOLS.has(tool.name)) return false;

        // Async mode - only allow whitelisted tools
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Exception: teammate delegates can use Agent and Team tools
            if (isAgentTeamsEnabled() && isInProcessTeammate()) {
                if (isToolNamed(tool, "Agent")) return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync,
//          Y→permissionMode, z→tool, CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS,
//          xV8→BUILTIN_EXCLUDED_TOOLS, eP1→ASYNC_AGENT_ALLOWED_TOOLS,
//          WY4→TEAM_DELEGATE_TOOLS, z3→isToolNamed, aJ→ExitPlanMode, r4→Agent
```

### Tool Set Constants

```javascript
// ============================================
// Tool Access Control Constants
// Location: chunks.91.mjs:269
// ============================================

// Background Agent Excluded Tools (CW6)
BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage other tasks
]);

// Async Agent Allowed Tools (eP1)
ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
]);

// Team Delegate Tools (WY4)
TEAM_DELEGATE_TOOLS = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", "CronCreate", "CronDelete", "CronList"
]);
```

### applyToolFilters (_c)

```javascript
// ============================================
// _c - applyToolFilters - Apply whitelist/blacklist filters
// Location: chunks.93.mjs:1590-1644
// ============================================

// READABLE (for understanding):
function applyToolFilters(agentDefinition, availableTools, isAsync = false, useExactTools = false) {
    let { tools, disallowedTools, source, permissionMode } = agentDefinition;

    // Step 1: Apply background filtering if not using exact tools
    let filteredTools = useExactTools
        ? availableTools
        : filterToolsForSubagent({
            tools: availableTools,
            isBuiltIn: source === "built-in",
            isAsync: isAsync,
            permissionMode: permissionMode
        });

    // Step 2: Parse disallowed tool rules
    let disallowedSet = new Set(
        disallowedTools?.map(rule => parseToolRule(rule).toolName) ?? []
    );

    // Step 3: Filter out disallowed tools
    let allowedTools = filteredTools.filter(tool => !disallowedSet.has(tool.name));

    // Step 4: Handle wildcard or explicit tool list
    if (tools === undefined || (tools.length === 1 && tools[0] === "*")) {
        // Wildcard: all filtered tools available
        return {
            hasWildcard: true,
            validTools: [],
            invalidTools: [],
            resolvedTools: allowedTools
        };
    }

    // Step 5: Match explicit tool names
    let toolMap = new Map();
    for (let tool of allowedTools) {
        toolMap.set(tool.name, tool);
    }

    let validTools = [];
    let invalidTools = [];
    let resolvedTools = [];
    let seenTools = new Set();
    let allowedAgentTypes;

    for (let rule of tools) {
        let { toolName, ruleContent } = parseToolRule(rule);

        // Special case: Agent tool with allowed subagent types
        if (toolName === "Agent" && ruleContent) {
            allowedAgentTypes = ruleContent.split(",").map(s => s.trim());
        }

        let matchedTool = toolMap.get(toolName);
        if (matchedTool) {
            validTools.push(rule);
            if (!seenTools.has(matchedTool)) {
                resolvedTools.push(matchedTool);
                seenTools.add(matchedTool);
            }
        } else {
            invalidTools.push(rule);
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
```

---

## Integration 2: Compact Module (07_compact)

### Message Recording for Subagents

```javascript
// ============================================
// TvY - isMessageRecordable - Check if message should be recorded
// Location: chunks.133.mjs:1561-1563
// ============================================

// ORIGINAL (for source lookup):
function TvY(A) {
    return A.type === "assistant" || A.type === "user" || A.type === "progress" || A.type === "system" && "subtype" in A && A.subtype === "compact_boundary"
}

// READABLE (for understanding):
function isMessageRecordable(message) {
    // Recordable message types for subagent transcript:
    // 1. assistant messages (LLM responses)
    // 2. user messages (user inputs)
    // 3. progress messages (internal progress)
    // 4. system messages with compact_boundary subtype
    return (
        message.type === "assistant" ||
        message.type === "user" ||
        message.type === "progress" ||
        (message.type === "system" && "subtype" in message && message.subtype === "compact_boundary")
    );
}
```

### Transcript Recording (dg)

```javascript
// ============================================
// Transcript Recording for Subagents
// ============================================

// In agentLoopRunner:
await dg(R, L).catch(($6) => k(`Failed to record sidechain transcript: ${$6}`))

// Where:
// dg = recordTranscript (writes to .claude/tasks/<id>/transcript.json)
// R = messages array
// L = agentId

// This ensures subagent conversations are preserved for:
// 1. Resume functionality (resume parameter)
// 2. Debugging and inspection
// 3. Compaction boundary tracking
```

---

## Integration 3: Hooks Module (11_hooks)

### Subagent Hook Registration

```javascript
// ============================================
// Hook Registration in Subagent Context
// Location: chunks.133.mjs:1647
// ============================================

// In agentLoopRunner:
if (A.hooks) r24(N, L, A.hooks, `agent '${A.agentType}'`, !0);

// READABLE (for understanding):
if (agentDefinition.hooks) {
    registerHooks(
        setAppState,           // N
        agentId,               // L
        agentDefinition.hooks, // A.hooks
        `agent '${agentDefinition.agentType}'`,  // Hook namespace
        true                   // isSubagent
    );
}

// Hook cleanup on agent completion:
// In finally block:
if (A.hooks) zZ6(N, L);  // unregisterHooks
```

### Hook Events Available for Subagents

| Event | When Fired | Available Data |
|-------|------------|----------------|
| `SubagentStart` | Agent starts | agentId, agentType, prompt |
| `SubagentEnd` | Agent completes | agentId, status, result |
| `ToolUse` | Tool called | toolName, input |
| `ToolResult` | Tool result | output, duration |

---

## Integration 4: MCP Module (06_mcp)

### MCP Client Inheritance

```javascript
// ============================================
// MCP Client Setup for Subagents
// Location: chunks.133.mjs:1698-1701
// ============================================

// In agentLoopRunner:
let {
    clients: H6,
    tools: J6,
    cleanup: K6
} = await fvY(A, K.options.mcpClients);

// READABLE (for understanding):
let {
    clients: mcpClients,
    tools: mcpTools,
    cleanup: mcpCleanup
} = await setupMcpForAgent(agentDefinition, parentMcpClients);

// MCP tools are merged with filtered agent tools:
let allTools = mcpTools.length > 0
    ? mergeTools([...filteredTools, ...mcpTools], "name")
    : filteredTools;
```

### MCP Server Requirements

```javascript
// ============================================
// Agent MCP Server Requirements Validation
// Location: chunks.136.mjs:1633-1653
// ============================================

// In AgentTool.call():
let I = R.requiredMcpServers;
if (I?.length) {
    // Check if required MCP servers are available
    // Wait up to 30s for pending servers
    // Throw error if missing
}
```

---

## Integration 5: Permissions Module

### Permission Context Inheritance

```javascript
// ============================================
// Permission Context for Subagents
// Location: chunks.133.mjs:1600-1629
// ============================================

// READABLE (for understanding):
function buildPermissionContext(agentDefinition, appState, isAsync, canShowPrompts, allowedTools) {
    let baseContext = appState.toolPermissionContext;

    // Apply agent's permission mode if specified
    if (agentDefinition.permissionMode) {
        // Don't override bypassPermissions or acceptEdits modes
        if (baseContext.mode !== "bypassPermissions" &&
            baseContext.mode !== "acceptEdits" &&
            baseContext.mode !== "auto") {
            baseContext = {
                ...baseContext,
                mode: agentDefinition.permissionMode
            };
        }
    }

    // For background agents: avoid permission prompts
    let shouldAvoidPrompts = canShowPrompts !== undefined
        ? !canShowPrompts
        : agentDefinition.permissionMode === "bubble"
            ? false
            : isAsync;

    if (shouldAvoidPrompts) {
        baseContext = {
            ...baseContext,
            shouldAvoidPermissionPrompts: true
        };
    }

    // For async agents with prompts allowed: run automated checks first
    if (isAsync && !shouldAvoidPrompts) {
        baseContext = {
            ...baseContext,
            awaitAutomatedChecksBeforeDialog: true
        };
    }

    // Apply allowed tools session override
    if (allowedTools !== undefined) {
        baseContext = {
            ...baseContext,
            alwaysAllowRules: {
                cliArg: baseContext.alwaysAllowRules.cliArg,
                session: [...allowedTools]
            }
        };
    }

    return baseContext;
}
```

---

## Integration 6: Auto Memory Module (31_auto_memory)

### Memory Loading for Subagents

```javascript
// ============================================
// Memory Context for Subagents
// Location: chunks.133.mjs:1598
// ============================================

// In agentLoopRunner:
let [I, g] = await Promise.all([
    $?.userContext ?? a2(),      // User context
    $?.systemContext ?? mw()     // System context
]);

// Memory loading for specialized agents:
if (R.memory) {
    d("tengu_agent_memory_loaded", {
        scope: R.memory,
        source: "subagent"
    });
}

// READABLE (for understanding):
// Subagents inherit memory contexts:
// 1. User memory (MEMORY.md)
// 2. Team memory (if in team context)
// 3. Agent-specific memory (if agent.memory scope defined)
```

### Memory Prompt Building

```javascript
// ============================================
// buildAgentMemoryPrompt - Memory for agents
// ============================================

function buildAgentMemoryPrompt(agentDefinition, toolUseContext) {
    if (!agentDefinition.memory) return null;

    let memoryScope = agentDefinition.memory;
    let memoryContent = loadMemoryForScope(memoryScope, toolUseContext);

    return formatMemoryAsPrompt(memoryContent);
}

// Memory scopes:
// - "user" - User's MEMORY.md
// - "project" - Project MEMORY.md
// - "team" - Team MEMORY.md
// - Custom scopes defined in agent frontmatter
```

---

## Integration 7: Agent Teams Module (30_agent_teams)

### Teammate Spawning Integration

```javascript
// ============================================
// Teammate Spawning Flow
// Location: chunks.136.mjs:1565-1584
// ============================================

// In AgentTool.call() when name and team_name provided:
if (resolvedTeamName && name) {
    let agentDef = subagent_type
        ? toolUseContext.options.agentDefinitions.activeAgents.find(a => a.agentType === subagent_type)
        : undefined;

    if (agentDef?.color) {
        registerAgentColor(subagent_type, agentDef.color);
    }

    let spawnResult = await spawnTeammate({
        name: name,
        prompt: prompt,
        description: description,
        team_name: resolvedTeamName,
        use_splitpane: true,
        plan_mode_required: mode === "plan",
        model: resolvedModel ?? agentDef?.model,
        agent_type: subagent_type
    }, toolUseContext);

    return {
        data: {
            status: "teammate_spawned",
            prompt: prompt,
            ...spawnResult.data
        }
    };
}
```

### Team Context Attachment

```javascript
// ============================================
// AmY - Team Context Attachment
// Location: chunks.147.mjs:1089-1105
// ============================================

function buildTeamContextAttachment(messages) {
    let teamName = getCurrentTeamName();
    let agentId = getCurrentAgentId();
    let agentName = getCurrentAgentName();

    if (!teamName || !agentId) return [];

    // Don't duplicate if already has assistant message
    if (messages.some(m => m.type === "assistant")) return [];

    let claudeDir = getClaudeDirectory();
    let teamConfigPath = `${claudeDir}/teams/${teamName}/config.json`;
    let taskListPath = `${claudeDir}/tasks/${teamName}/`;

    return [{
        type: "team_context",
        agentId: agentId,
        agentName: agentName || agentId,
        teamName: teamName,
        teamConfigPath: teamConfigPath,
        taskListPath: taskListPath
    }];
}
```

---

## Integration 8: Telemetry Module (17_telemetry)

### Telemetry Events for Tasks

```javascript
// ============================================
// Task-Related Telemetry Events
// ============================================

// Task started (Zf - registerTask):
{
    type: "system",
    subtype: "task_started",
    task_id: "a7x9k2m3",
    tool_use_id: "toolu_abc123",
    description: "Search codebase",
    task_type: "local_agent",
    prompt: "..."
}

// Task progress (nl4 - updateTaskProgressWithTelemetry):
{
    type: "system",
    subtype: "task_progress",
    task_id: "a7x9k2m3",
    tool_use_id: "toolu_abc123",
    description: "Reading files...",
    usage: {
        total_tokens: 12543,
        tool_uses: 5,
        duration_ms: 23000
    }
}

// Agent tool selected (in AgentTool.call):
{
    event: "tengu_agent_tool_selected",
    agent_type: "general-purpose",
    model: "claude-sonnet-4",
    source: "built-in",
    color: null,
    is_built_in_agent: true,
    is_resume: false,
    is_async: false,
    is_fork: true
}
```

---

## Integration Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUBAGENT INTEGRATION FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────┐
                    │     AgentTool.call()        │
                    └──────────────┬──────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ Validate MCP  │         │ Select Agent  │         │ Build Context │
│ Requirements  │         │ Definition    │         │               │
└───────────────┘         └───────┬───────┘         └───────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │   agentLoopRunner (qh)      │
                    └──────────────┬──────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ Build System  │         │ Filter Tools  │         │ Load Memory   │
│ Prompt (vvY)  │         │ (Xk8)         │         │ (d14)         │
└───────────────┘         └───────┬───────┘         └───────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │   llmMessageLoop (Yh)       │
                    └──────────────┬──────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ Record        │         │ Update        │         │ Emit          │
│ Transcript    │         │ Progress (nl4)│         │ Telemetry     │
└───────────────┘         └───────┬───────┘         └───────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │   Completion / Failure      │
                    │   ($m8 / Hm8 / x66)         │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │   System Reminder           │
                    │   Attachment (suY)          │
                    └─────────────────────────────┘
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | ✓ Verified |
| `_c` | applyToolFilters | chunks.93.mjs:1590 | ✓ Verified |
| `TvY` | isMessageRecordable | chunks.133.mjs:1561 | ✓ Verified |
| `r24` | registerHooks | chunks.133.mjs:1647 | ✓ Verified |
| `zZ6` | unregisterHooks | chunks.133.mjs:1783 | ✓ Verified |
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `AmY` | buildTeamContextAttachment | chunks.147.mjs:1089 | ✓ Verified |

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Cross-feature linkages documented