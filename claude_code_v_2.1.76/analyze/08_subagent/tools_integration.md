# Tools Integration - Subagent System (Claude Code 2.1.76)

## Overview

This document covers tool set assembly for subagents, the tool whitelists for different agent types, and the context derivation that makes tools available to the subagent's LLM.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `assembleSessionToolSet` (YP6) - Main tool set assembly - chunks.141.mjs:1476
- `deriveToolUseContext` (vQ1) - Create isolated context for subagent - chunks.149.mjs:2589
- `BACKGROUND_AGENT_ALLOWED_TOOLS` (Bj1) - Tools for background agents - chunks.89.mjs:876
- `DELEGATE_ALLOWED_TOOLS` (R_6) - Tools for delegate mode - chunks.89.mjs:876
- `ALL_SAFE_TOOLS` (L_6) - Read-only safe tools - chunks.89.mjs
- `STRUCTURED_TASK_TOOLS` (np7) - Task management tools - chunks.89.mjs
- `filterToolsForSubagent` - Apply agent definition whitelist/blacklist

---

## assembleSessionToolSet (YP6)

### What it does

Builds the complete, filtered tool set for the subagent based on the agent definition's tool configuration and the parent's permission context.

### How it works

1. Start with the full list of available tools in the session
2. Apply the agent definition's `tools` whitelist (if present) - only these tools are included
3. Apply the agent definition's `disallowedTools` blacklist - these tools are excluded
4. Filter based on MCP server availability (remove tools from unavailable servers)
5. Return the final tool set

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

## Tool Whitelists

### BACKGROUND_AGENT_ALLOWED_TOOLS (Bj1)

Tools available to background agents. Restricted to coordination and status tools only:

```javascript
BACKGROUND_AGENT_ALLOWED_TOOLS = new Set([
    "TaskOutput",       // Write output to the background task's output file
    "ExitPlanMode",     // Exit plan mode if in it
    "EnterPlanMode",    // Enter plan mode
    "Task",             // Spawn sub-subagents
    "AskUserQuestion",  // Request user input (creates a prompt in the UI)
    "TaskStop"          // Stop the current task
])
```

**Why restricted:** Background agents run without continuous user supervision. Restricting them to coordination tools prevents accidental destructive operations while the user isn't watching.

### DELEGATE_ALLOWED_TOOLS (R_6)

Tools available to delegate mode agents (orchestrators in multi-agent teams):

```javascript
DELEGATE_ALLOWED_TOOLS = new Set([
    "TeamCreate",   // Create a new team
    "TeamDelete",   // Delete a team
    "SendMessage",  // Send message to a teammate
    "TaskCreate",   // Create a structured task
    "TaskGet",      // Get task status
    "TaskList",     // List all tasks
    "TaskUpdate",   // Update task fields
    "Task"          // Spawn subagents
])
```

**Why different from regular subagents:** Delegate agents are orchestrators whose job is to coordinate, not execute directly. They need team/task management tools but not file manipulation tools.

### ALL_SAFE_TOOLS (L_6)

A set of tools considered safe for read-only exploration:

```javascript
ALL_SAFE_TOOLS = new Set([
    "Read", "Glob", "Grep", "LS"
])
```

Used by the Explore agent type and for skills that only need read access.

### STRUCTURED_TASK_TOOLS (np7)

Tools for structured task management (the task graph system):

```javascript
STRUCTURED_TASK_TOOLS = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "TaskDelete", "TaskDependencyAdd", "TaskDependencyRemove"
])
```

---

## filterToolsForSubagent Logic

When neither a whitelist nor a blacklist is defined (most common case for general-purpose subagents), all session tools are inherited. When both are defined, the whitelist is applied first (intersection), then the blacklist (exclusion).

**Priority:** `disallowedTools` always wins. If a tool appears in both `tools` and `disallowedTools`, it is excluded.

---

## Design Rationale

### Why Whitelist AND Blacklist?

**Only whitelist:** Inflexible - must enumerate all desired tools, easy to miss new tools added to the system.

**Only blacklist:** Inflexible in the other direction - new dangerous tools added to the system automatically become available.

**Both:** More expressive. Teams can define "use only these tools" OR "use everything except these tools" depending on their needs. The delegate and background agent models are good examples: they use whitelists because their tool sets are specific and bounded.

### Why Filter by MCP Availability?

Tools from MCP servers become unavailable if the server disconnects. Filtering them out prevents the subagent from attempting to call tools that will always fail. Better to exclude them upfront with a clear "tool unavailable" message than to let the subagent encounter opaque errors mid-execution.
