# MCP System Integration

## Overview

This document covers how MCP integrates with other Claude Code systems including the tool system, system prompts/reminders, plan mode, and the streaming pipeline.

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## Table of Contents

1. [Tool System Integration](#tool-system-integration)
2. [System Prompt Integration](#system-prompt-integration)
3. [System Reminder Integration](#system-reminder-integration)
4. [Plan Mode Integration](#plan-mode-integration)
5. [Streaming Pipeline Integration](#streaming-pipeline-integration)
6. [Chrome Browser Integration](#chrome-browser-integration)

---

## Tool System Integration

### Tool Registration Flow

MCP tools are registered through the main tool aggregation system:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Tool Aggregation Flow                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │ Built-in     │    │ Plugin       │    │ MCP                  │  │
│  │ Tools        │    │ Tools        │    │ Tools                │  │
│  └──────┬───────┘    └──────┬───────┘    └──────────┬───────────┘  │
│         │                   │                       │              │
│         │                   │                       │              │
│         ▼                   ▼                       ▼              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │               getAllTools() Aggregator                       │   │
│  │  - Filters by disallowedTools                               │   │
│  │  - Applies permissions                                       │   │
│  │  - Handles auto-search mode                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                            │                                        │
│                            ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │          toolsForApiRequest                                  │   │
│  │  - Filter MCP tools if auto-search enabled                   │   │
│  │  - Include only discovered tools from history                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### isMcp Flag

Every tool object has an `isMcp` boolean flag:

```javascript
// Location: chunks.134.mjs:672, chunks.131.mjs:1928

// When creating tool use entries
{
  name: toolName,
  isMcp: toolName.startsWith("mcp__"),  // Dynamic detection
  // ... other properties
}

// MCP tools always set isMcp: true
{
  name: `mcp__${serverName}__${toolName}`,
  isMcp: true,  // Explicit flag
  // ... other properties
}
```

**Uses of isMcp flag:**

| Location | Usage |
|----------|-------|
| chunks.85.mjs:382 | Filter tools for auto-search threshold calculation |
| chunks.85.mjs:550-560 | Count MCP tools for mode decision |
| chunks.133.mjs:2175-2279 | Separate MCP from non-MCP tools in formatting |
| chunks.148.mjs:1989 | Filter for MCP-specific processing |
| chunks.134.mjs:* | Track throughout streaming pipeline |

### Tool Name Checking

**Location:** `chunks.148.mjs:3303`

```javascript
// ============================================
// isMcpTool - Check if tool is MCP
// Location: chunks.148.mjs:3303
// ============================================

// ORIGINAL:
return A.name?.startsWith("mcp__") || A.isMcp === !0

// READABLE:
function isMcpTool(tool) {
  // Two ways to identify MCP tools:
  // 1. Name prefix: mcp__serverName__toolName
  // 2. Explicit isMcp flag
  return tool.name?.startsWith("mcp__") || tool.isMcp === true;
}
```

---

## System Prompt Integration

### MCP Server Instructions

When MCP servers provide instructions, they are included in the system prompt:

**Location:** `chunks.146.mjs:2604-2619`

```javascript
// ============================================
// Fz7 - buildMCPServerInstructions
// Location: chunks.146.mjs:2607-2619
// ============================================

// ORIGINAL:
function Fz7(A) {
  let B = A.filter((Z) => Z.type === "connected").filter((Z) => Z.instructions);
  if (B.length === 0) return "";
  return `
# MCP Server Instructions

The following MCP servers have provided instructions for how to use their tools and resources:

${B.map((Z)=>{return`## ${Z.name}
${Z.instructions}`}).join(`

  `)}
`
}

// READABLE:
function buildMCPServerInstructions(mcpClients) {
  // Filter to only connected servers that have instructions
  let serversWithInstructions = mcpClients
    .filter((server) => server.type === "connected")
    .filter((server) => server.instructions);

  if (serversWithInstructions.length === 0) return "";

  return `
# MCP Server Instructions

The following MCP servers have provided instructions for how to use their tools and resources:

${serversWithInstructions.map((server) => {
  return `## ${server.name}
${server.instructions}`;
}).join("\n\n")}
`;
}

// Mapping: Fz7→buildMCPServerInstructions
```

### MCP CLI Instructions

When MCP CLI mode is enabled, detailed CLI instructions are included:

**Location:** `chunks.146.mjs:2622-2737`

```javascript
// ============================================
// oY9 - buildMCPCLIInstructions
// Location: chunks.146.mjs:2622-2737
// ============================================

// READABLE (key parts):
function buildMCPCLIInstructions(mcpTools) {
  // Only include if in MCP CLI mode
  if (!isMcpCliMode() || !mcpTools || mcpTools.length === 0) return "";

  return `
# MCP CLI Command

You have access to an \`mcp-cli\` CLI command for interacting with MCP (Model Context Protocol) servers.

**MANDATORY PREREQUISITE - THIS IS A HARD REQUIREMENT**

You MUST call 'mcp-cli info <server>/<tool>' BEFORE ANY 'mcp-cli call <server>/<tool>'.

This is a BLOCKING REQUIREMENT - like how you must use Read before Edit.

**NEVER** make an mcp-cli call without checking the schema first.
**ALWAYS** run mcp-cli info first, THEN make the call.

Available MCP tools:
${mcpTools.map((tool) => {
  let shortName = formatShortToolName(tool.name);
  return shortName ? `- ${shortName}` : null;
}).filter(Boolean).join("\n")}

Commands:
\`\`\`bash
# STEP 1: ALWAYS CHECK SCHEMA FIRST (MANDATORY)
mcp-cli info <server>/<tool>           # REQUIRED before ANY call

# STEP 2: Only after checking schema, make the call
mcp-cli call <server>/<tool> '<json>'  # Only run AFTER mcp-cli info
\`\`\`
`;
}

// Mapping: oY9→buildMCPCLIInstructions, jJ→isMcpCliMode, tY9→formatShortToolName
```

### System Prompt Assembly Order

MCP instructions appear after core instructions in the system prompt:

**Location:** `chunks.146.mjs:2467-2605` (buildSystemPrompt)

```
Assembly Order:
1. Agent Identity
2. Tool Usage Policy
3. Tone & Style
4. Professional Objectivity
5. Task Management
6. Code References
7. Plan Mode (conditional)
8. Delegate Mode (conditional)
9. Web Search (conditional)
10. Todo List (conditional)
11. Security Guidelines (2x)
12. ★ MCP Server Instructions (if connected) ← Fz7
13. ★ MCP CLI Instructions (if enabled) ← oY9
14. Environment Context
15. Git Status
16. Claude.md Content
17. Background Info
```

---

## System Reminder Integration

### MCP Search Reminder for Chrome

When Chrome tools are available but auto-search is enabled, a reminder is added:

**Location:** `chunks.145.mjs:1240-1251`

```javascript
// ============================================
// XZ9 - MCP_SEARCH_REMINDER
// Location: chunks.145.mjs:1240-1251
// ============================================

XZ9 = `
**IMPORTANT: Before using any chrome browser tools, you MUST first load them using MCPSearch.**

Chrome browser tools are MCP tools that require loading before use. Before calling any mcp__claude-in-chrome__* tool:
1. Use MCPSearch with \`select:mcp__claude-in-chrome__<tool_name>\` to load the specific tool
2. Then call the tool

For example, to get tab context:
1. First: MCPSearch with query "select:mcp__claude-in-chrome__tabs_context_mcp"
2. Then: Call mcp__claude-in-chrome__tabs_context_mcp
`
```

### Chrome Skill Reminder

**Location:** `chunks.145.mjs:1253-1257`

```javascript
// ============================================
// xT0 - CHROME_SKILL_REMINDER
// Location: chunks.145.mjs:1253-1257
// ============================================

xT0 = `
**Browser Automation**: Chrome browser tools are available via the "claude-in-chrome" skill. CRITICAL: Before using any mcp__claude-in-chrome__* tools, invoke the skill by calling the Skill tool with skill: "claude-in-chrome". The skill provides browser automation instructions and enables the tools.
`
```

### Reminder Injection Points

System reminders are injected into user messages at specific points:

**Location:** `chunks.147.mjs:62`

```javascript
// In message processing:
[
  ...baseInstructions,
  ...Q,  // Other prompts
  ...I && H ? [XZ9] : [],  // MCP Search reminder (if auto-search + chrome tools)
  oY9(Y.mcpTools)  // MCP CLI instructions
].filter(Boolean)
```

---

## Plan Mode Integration

### MCP Tools in Plan Mode

MCP tools are available in plan mode with the same integration patterns:

1. **Tool Discovery:** MCP tools are discovered regardless of plan mode
2. **System Prompts:** MCP instructions included when servers are connected
3. **Auto-Search:** Works the same in plan mode
4. **Chrome Automation:** Same instructions apply

### Plan Mode System Prompt

Chrome automation instructions are **duplicated** for both normal and plan mode:

**Location:** `chunks.145.mjs`
- Normal mode: Lines 1140-1188 (`ST0` function)
- Plan mode: Lines 1191-1238 (`JZ9` constant)

Both contain identical browser automation guidelines:
- GIF recording instructions
- Console log debugging tips
- Alert/dialog avoidance
- Rabbit hole prevention
- Tab context management

**Key insight:** There is no special MCP handling for plan mode - the same tools and instructions apply.

---

## Streaming Pipeline Integration

### Tool Use Tracking

Throughout the streaming pipeline, MCP tools are tracked via the `isMcp` flag:

**Location:** `chunks.134.mjs` (multiple locations)

```javascript
// When processing tool use events
{
  name: toolName,
  isMcp: toolName.startsWith("mcp__"),
  // ... tracking data
}

// When processing tool results
{
  isMcp: originalToolUse.isMcp ?? false,
  // ... result data
}
```

### Concurrency Safety

MCP tools can declare concurrency safety via annotations:

```javascript
// Location: chunks.131.mjs:1936-1937

// In tool definition
isConcurrencySafe() {
  // readOnlyHint from MCP annotations determines if tool can run concurrently
  return tool.annotations?.readOnlyHint ?? false;
}
```

The streaming pipeline uses this to determine parallel execution:

**Location:** `chunks.134.mjs:79-80`

```javascript
function maxToolConcurrency() {
  // Default max concurrent MCP tools (configurable via env)
  return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "10");
}
```

---

## Chrome Browser Integration

### Reserved Server Name

**Location:** `chunks.131.mjs:49`

```javascript
Ej = "claude-in-chrome"  // Reserved MCP server name
```

### Chrome Integration Check

**Location:** `chunks.130.mjs:3266-3268`

```javascript
// ============================================
// uEA - isReservedMcpServerName
// Location: chunks.130.mjs:3266-3268
// ============================================

function uEA(serverName) {
  return serverName === "claude-in-chrome";  // Ej constant
}
```

### Custom Rendering for Chrome Tools

**Location:** `chunks.131.mjs:1003-1023`

```javascript
// ============================================
// Ir2 - Custom rendering for Chrome MCP tools
// Location: chunks.131.mjs:1003-1023
// ============================================

// READABLE:
function getChromeMcpToolRenderers(toolName) {
  return {
    userFacingName() {
      return `Claude in Chrome[${toolName}]`;
    },

    renderToolUseMessage(toolUse) {
      return formatChromeToolUseMessage(toolUse);
    },

    renderToolUseTag(toolUse) {
      return formatChromeToolUseTag(toolUse);
    },

    renderToolResultMessage(result) {
      return formatChromeToolResultMessage(result);
    }
  };
}

// Usage in Ax (fetchMcpTools):
{
  ...baseToolProperties,
  name: `mcp__${serverName}__${toolName}`,
  // Add custom renderers for Chrome tools
  ...isReservedMcpServerName(serverName) ? getChromeMcpToolRenderers(toolName) : {}
}
```

### Chrome System Prompt

**Location:** `chunks.145.mjs:1140-1188`

```javascript
// ============================================
// ST0 - Chrome Automation System Prompt
// Location: chunks.145.mjs:1140-1188
// ============================================

function ST0() {
  return `
# Claude in Chrome browser automation

You have access to browser automation tools (mcp__claude-in-chrome__*) for interacting with web pages in Chrome.

## GIF recording
When performing multi-step browser interactions, use mcp__claude-in-chrome__gif_creator to record them.

## Console log debugging
Use mcp__claude-in-chrome__read_console_messages with 'pattern' parameter for efficient filtering.

## Alerts and dialogs
IMPORTANT: Do not trigger JavaScript alerts, confirms, prompts, or browser modal dialogs.
- Use console.log + read_console_messages instead
- Use javascript_tool to dismiss existing dialogs

## Avoid rabbit holes and loops
Stop and ask user for guidance when encountering:
- Unexpected complexity
- Tool calls failing after 2-3 attempts
- No response from browser extension

## Tab context and session startup
IMPORTANT: Call mcp__claude-in-chrome__tabs_context_mcp first to get current browser tabs.
Never reuse tab IDs from previous sessions.
`;
}
```

---

## Telemetry Integration

### MCP-Specific Events

| Event | Location | When Emitted |
|-------|----------|--------------|
| `tengu_mcp_servers` | chunks.138.mjs:3034 | After server initialization |
| `tengu_mcp_server_connection_failed` | chunks.131.mjs:1900-1908 | Connection failure |
| `tengu_mcp_tools_commands_loaded` | chunks.131.mjs:2068-2072 | After batch load |
| `tengu_mcp_list_changed` | chunks.138.mjs:2918,2930,2942 | On notification |
| `tengu_code_indexing_tool_used` | chunks.131.mjs:1417-1421 | Tool execution success |
| `tengu_tool_search_mode_decision` | chunks.85.mjs:563-571 | Auto-search decision |

### Tool Name Sanitization

**Location:** `chunks.155.mjs:1860`

```javascript
// For telemetry, MCP tool names are sanitized
if (typeof toolName === "string" && toolName.startsWith("mcp__")) {
  toolName = "mcp";  // Don't expose specific tool names
}
```

---

## Related Symbols

Key functions in this document:
- `buildMCPServerInstructions` (Fz7) - Include server instructions in prompt
- `buildMCPCLIInstructions` (oY9) - Include CLI instructions in prompt
- `isReservedMcpServerName` (uEA) - Check for reserved names
- `getChromeMcpToolRenderers` (Ir2) - Chrome tool custom rendering
- `getChromeAutomationPrompt` (ST0) - Chrome system prompt

Constants:
- `CHROME_MCP_SERVER_NAME` (Ej) - "claude-in-chrome"
- `MCP_SEARCH_REMINDER` (XZ9) - Auto-search reminder text
- `CHROME_SKILL_REMINDER` (xT0) - Skill invocation reminder

---

## See Also

- [protocol_overview.md](./protocol_overview.md) - Architecture overview
- [server_management.md](./server_management.md) - Server configuration
- [tool_execution.md](./tool_execution.md) - Tool execution details
- [mcp_autosearch.md](./mcp_autosearch.md) - Auto-search mode
- [../28_browser_control/](../28_browser_control/) - Chrome browser control
