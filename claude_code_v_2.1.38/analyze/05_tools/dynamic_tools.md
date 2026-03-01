# Dynamic Tools - MCP & Deferred Loading (Claude Code 2.1.38)

> Analysis of MCP tool registration, deferred tool loading, and the ToolSearch mechanism.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `isMcpTool` (BW, $E) - Detects MCP tools by name pattern
- `generateDeferredToolsPrompt` (E_6) - Builds deferred tool prompt
- `ToolSearch` (dM) - Tool name constant for the ToolSearch tool
- `parseMcpToolName` (Jh, VD) - Parses `mcp__server__tool` format

---

## MCP Tool Architecture

### Tool Name Convention

MCP (Model Context Protocol) tools follow a strict naming convention:

```
mcp__<server_name>__<tool_name>
```

**Examples:**
- `mcp__github__create_issue` - GitHub server, create_issue tool
- `mcp__slack__send_message` - Slack server, send_message tool
- `mcp__filesystem__read_file` - Filesystem server, read_file tool
- `mcp__linear__create_ticket` - Linear server, create_ticket tool

**Why this format:**
- **Namespacing**: Prevents collisions between tools from different servers
- **Server identification**: Enables server-specific handling and telemetry
- **Discovery**: Allows grouping tools by server for search

---

### MCP Tool Detection

**What it does:** Determines if a tool name belongs to an MCP server.

**How it works:**

```javascript
// ============================================
// isMcpTool - MCP tool name detection
// Location: chunks.89.mjs:607 (BW), chunks.149.mjs:420 ($E)
// ============================================

// ORIGINAL (for source lookup):
function BW(A) {
    return A.name?.startsWith("mcp__") ?? !1
}

// Variant in chunks.149.mjs
function $E(A) {
    return A.isMcp ?? !1
}

// READABLE (for understanding):
function isMcpToolByName(toolName) {
    // Check if tool name starts with mcp__ prefix
    return toolName?.startsWith("mcp__") ?? false;
}

function isMcpToolByFlag(tool) {
    // Check if tool has isMcp flag set
    return tool.isMcp ?? false;
}

// Mapping: BW→isMcpToolByName, $E→isMcpToolByFlag, A→toolName/tool
```

**Two detection methods:**
1. **Name prefix check** (`BW`) - Used during tool registration/listing
2. **Flag check** (`$E`) - Used during execution when tool object is available

**Key insight:** The dual detection allows for:
- Early filtering by name before tool object exists
- Reliable flag-based check after tool is loaded

---

### MCP Tool Name Parsing

**What it does:** Extracts server name and tool name from the full MCP tool name.

**How it works:**

```javascript
// ============================================
// parseMcpToolName - Extract server and tool from mcp__ format
// Location: Various files (Jh, VD functions)
// ============================================

// Pseudocode based on usage patterns in source
function parseMcpToolName(fullName) {
    // Expected format: mcp__<server>__<tool>
    if (!fullName.startsWith("mcp__")) {
        return null;  // Not an MCP tool
    }

    // Remove "mcp__" prefix
    const withoutPrefix = fullName.slice(5);

    // Split on "__" to get server and tool
    const parts = withoutPrefix.split("__");

    if (parts.length < 2) {
        return null;  // Malformed MCP tool name
    }

    const serverName = parts[0];
    const toolName = parts.slice(1).join("__");  // Tool name may contain "__"

    return {
        serverName: serverName,
        mcpToolName: toolName,
        fullName: fullName
    };
}

// Mapping: Jh/VD→parseMcpToolName
```

**Usage in telemetry:**

```javascript
// From chunks.149.mjs - Telemetry with MCP metadata
if (vB()) {  // isMcpTelemetryEnabled
    let mcpInfo = Jh(tool.name);
    if (mcpInfo) {
        telemetryData.mcpServerName = mcpInfo.serverName;
        telemetryData.mcpToolName = mcpInfo.mcpToolName;
    }
}
```

---

## Deferred Tool Loading

### Overview

Some MCP tools are **deferred** - not loaded into the active tool set until explicitly requested. This reduces prompt size and improves performance.

**Deferred tool characteristics:**
- Not included in initial tool definitions sent to LLM
- Listed in a special "deferred tools" prompt section
- Must be loaded via `ToolSearch` before use
- Once loaded, available for the rest of the session

```
┌──────────────────────────────────────────────────────────────────┐
│                    TOOL LOADING FLOW                              │
│                                                                  │
│   Session Start                                                  │
│       │                                                          │
│       ▼                                                          │
│   Core Tools Loaded ──────────────────────────────────┐          │
│   (Read, Write, Edit, Bash, etc.)                    │          │
│       │                                               │          │
│       ▼                                               │          │
│   MCP Servers Connected                               │          │
│       │                                               │          │
│       ├──▶ High-priority tools → Added to tool set   │          │
│       │                                              │          │
│       └──▶ Deferred tools → Listed in prompt only    │          │
│                                   │                   │          │
│                                   ▼                   │          │
│                         LLM sees deferred list       │          │
│                                   │                   │          │
│                                   ▼                   │          │
│                         LLM calls ToolSearch         │          │
│                                   │                   │          │
│                                   ▼                   │          │
│                         Tools loaded into tool set ──┘          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

### Deferred Tools Prompt Generation

**What it does:** Builds the prompt section listing available deferred tools.

**How it works:**

```javascript
// ============================================
// generateDeferredToolsPrompt - Deferred tools prompt builder
// Location: chunks.89.mjs:618-648
// ============================================

// ORIGINAL (for source lookup):
function E_6(A) {
    if (v_6()) return yv9;  // Test mode check
    let q = A.filter(BW);   // Filter for MCP tools
    if (q.length === 0) {
        if (ca !== void 0 && ca !== "") c("tengu_tool_prompt_changed", {
            tool: "ToolSearchTool",
            previousDeferredCount: ca.split(`
`).length,
            newDeferredCount: 0
        });
        return ca = "", pp7;
    }
    let K = x8("tengu_kv7_prompt_sort", !1) ? q.map((Y) => Y.name).sort().join(`
`) : q.map((Y) => Y.name).join(`
`);
    if (ca !== void 0 && K !== ca) {
        let Y = ca.split(`
`).filter(Boolean).length,
            z = K.split(`
`).filter(Boolean).length;
        c("tengu_tool_prompt_changed", {
            tool: "ToolSearchTool",
            previousDeferredCount: Y,
            newDeferredCount: z
        })
    }
    return ca = K, `${pp7}

Available deferred tools (must be loaded before use):
${K}`
}

// READABLE (for understanding):
function generateDeferredToolsPrompt(mcpTools) {
    // In test mode, return fixed value for consistency
    if (isTestMode()) {
        return TEST_MODE_DEFERRED_TOOLS;
    }

    // Filter for MCP tools (potential deferred tools)
    let deferredTools = mcpTools.filter(isMcpToolByName);

    // If no deferred tools, clear cache and return empty
    if (deferredTools.length === 0) {
        if (cachedDeferredPrompt !== undefined && cachedDeferredPrompt !== "") {
            // Log that deferred list changed
            telemetry("tengu_tool_prompt_changed", {
                tool: "ToolSearchTool",
                previousDeferredCount: cachedDeferredPrompt.split("\n").length,
                newDeferredCount: 0
            });
        }
        cachedDeferredPrompt = "";
        return EMPTY_DEFERRED_PROMPT;
    }

    // Build tool list (optionally sorted)
    let toolList = featureFlag("sort_deferred_tools", false)
        ? deferredTools.map((t) => t.name).sort().join("\n")
        : deferredTools.map((t) => t.name).join("\n");

    // Log changes to deferred list
    if (cachedDeferredPrompt !== undefined && toolList !== cachedDeferredPrompt) {
        let prevCount = cachedDeferredPrompt.split("\n").filter(Boolean).length;
        let newCount = toolList.split("\n").filter(Boolean).length;
        telemetry("tengu_tool_prompt_changed", {
            tool: "ToolSearchTool",
            previousDeferredCount: prevCount,
            newDeferredCount: newCount
        });
    }

    // Cache and return
    cachedDeferredPrompt = toolList;
    return `${DEFERRED_TOOLS_HEADER}

Available deferred tools (must be loaded before use):
${toolList}`;
}

// Mapping: E_6→generateDeferredToolsPrompt, A→mcpTools, v_6→isTestMode, yv9→TEST_MODE_DEFERRED_TOOLS, BW→isMcpToolByName, ca→cachedDeferredPrompt, pp7→DEFERRED_TOOLS_HEADER, x8→featureFlag
```

**Deferred tools prompt content:**

```javascript
// ============================================
// DEFERRED_TOOLS_HEADER - ToolSearch tool description
// Location: chunks.89.mjs:654-717
// ============================================

// ORIGINAL (partial):
dp7 = `
**Why this is non-negotiable:**
- Deferred tools are not loaded until discovered via this tool
- Calling a deferred tool without first loading it will fail

**Query modes:**

1. **Keyword search** - Use keywords when you're unsure which tool to use:
   - "list directory" - find tools for listing directories
   - "notebook jupyter" - find notebook editing tools
   - Returns up to 5 matching tools ranked by relevance
   - All returned tools are immediately available to call

2. **Direct selection** - Use \`select:<tool_name>\` when you know the exact name:
   - "select:mcp__slack__read_channel"
   - Returns just that tool if it exists

3. **Required keyword** - Prefix with \`+\` to require a match:
   - "+linear create issue" - only tools from "linear"
   - Useful when you know the service name but not the exact tool

**CORRECT Usage Patterns:**

<example>
User: I need to work with slack somehow
Assistant: Let me search for slack tools.
[Calls ToolSearch with query: "slack"]
Assistant: Found several options including mcp__slack__read_channel.
[Calls mcp__slack__read_channel directly — it was loaded by the keyword search]
</example>

**INCORRECT Usage Patterns - NEVER DO THESE:**

<bad-example>
User: Read my slack messages
Assistant: [Directly calls mcp__slack__read_channel without loading it first]
WRONG - You must load the tool FIRST using this tool
</bad-example>
`

// Mapping: dp7→DEFERRED_TOOLS_HEADER
```

**Key insight:** The deferred tools prompt serves dual purposes:
1. Lists available tools for discovery
2. Provides usage instructions to prevent errors

---

## ToolSearch Tool

### Overview

`ToolSearch` is the mechanism for discovering and loading deferred tools.

**Tool name:** `ToolSearch` (constant: `dM`)

**Input schema:**

```javascript
{
    query: string  // Keywords, "select:<name>", or "+server keywords"
}
```

**Query modes:**

| Mode | Format | Example | Behavior |
|------|--------|---------|----------|
| Keyword | `keywords` | `"slack message"` | Search by keywords, returns up to 5 matches |
| Direct selection | `select:<name>` | `"select:mcp__slack__read_channel"` | Load specific tool by name |
| Required server | `+server keywords` | `"+linear create issue"` | Restrict to server, search by keywords |

---

### ToolSearch Execution Flow

```
LLM calls ToolSearch with query
    │
    ▼
Parse query type
    │
    ├──▶ "select:<name>" → Direct tool lookup
    │       │
    │       └──▶ Load tool into session tool set
    │
    ├──▶ "+<server> <keywords>" → Server-filtered search
    │       │
    │       ├──▶ Filter tools by server name
    │       └──▶ Rank by keyword relevance
    │
    └──▶ "<keywords>" → General keyword search
            │
            ├──▶ Search all deferred tools
            └──▶ Rank by keyword relevance
    │
    ▼
Return matching tools
    │
    ▼
Tools added to session tool set
    │
    ▼
LLM can now call loaded tools directly
```

---

### Caching Behavior

The deferred tools prompt is cached to avoid redundant computation:

```javascript
// Global cache variable
let ca = undefined;  // cachedDeferredPrompt

// Cache is invalidated when:
// 1. MCP servers connect/disconnect
// 2. Tool definitions change
// 3. Session ends

// Telemetry tracks changes
c("tengu_tool_prompt_changed", {
    tool: "ToolSearchTool",
    previousDeferredCount: prevCount,
    newDeferredCount: newCount
});
```

**Why caching:**
- Deferred tools list changes infrequently
- Prompt generation involves filtering and sorting
- Reduces per-turn overhead

---

## MCP Tool Registration

### Registration Flow

```
MCP Server Connects
    │
    ▼
Server handshake completes
    │
    ▼
Server sends tools/list request
    │
    ▼
Tools received and parsed
    │
    ├──▶ High-priority tools → Added to active tool set
    │
    └──▶ Other tools → Added to deferred list
    │
    ▼
Tool definitions created:
    {
        name: "mcp__<server>__<tool>",
        description: "...",
        inputSchema: { ... },
        isMcp: true,
        aliases: ["<tool>"],  // Short alias
        call: async (input, context) => { ... }
    }
    │
    ▼
Tool registered in global registry (kt())
```

---

### MCP Tool Object Structure

```javascript
// MCP tool object (deobfuscated example)
{
    name: "mcp__github__create_issue",
    description: "Create a new GitHub issue",
    inputSchema: z.object({
        title: z.string(),
        body: z.string().optional(),
        labels: z.array(z.string()).optional()
    }),
    isMcp: true,
    aliases: ["create_issue", "gh_create_issue"],
    isConcurrencySafe: (input) => true,  // Can run in parallel
    validateInput: async (input, context) => {
        // MCP-specific validation
        return { result: true };
    },
    call: async (input, context, canUseTool, assistantMessage, progressCallback) => {
        // Call MCP client
        let result = await mcpClient.callTool({
            name: "create_issue",
            arguments: input
        });
        return { data: result };
    }
}
```

---

### Post-Tool Hook MCP Output Modification

Post-tool hooks can modify MCP tool output before it reaches the LLM:

```javascript
// From b1q (executePostToolHooksIterator) in chunks.149.mjs
if (j.updatedMCPToolOutput && $E(q)) {
    D = j.updatedMCPToolOutput;  // Replace output
    yield { updatedMCPToolOutput: D };
}
```

**Why MCP-only:**
- Native tools have well-defined output formats that UI depends on
- MCP tool output is opaque (just JSON), safe to transform
- Enables post-processing (filtering, enrichment, formatting)

---

## Telemetry Integration

### MCP Tool Telemetry

MCP tools include additional telemetry fields:

| Field | Description |
|-------|-------------|
| `isMcp` | Boolean indicating MCP tool |
| `mcpServerType` | Server type (stdio, sse, http) |
| `mcpServerBaseUrl` | Server URL for remote MCP |
| `mcpServerName` | Server name (github, slack, etc.) |
| `mcpToolName` | Tool name within server |

```javascript
// Telemetry example from chunks.149.mjs
c("tengu_tool_use_success", {
    toolName: "mcp__github__create_issue",
    isMcp: true,
    mcpServerType: "stdio",
    mcpServerName: "github",
    mcpToolName: "create_issue",
    durationMs: 1234,
    toolResultSizeBytes: 567
});
```

---

## Related Documents

- [tool_discovery.md](./tool_discovery.md) - How tools are discovered in sessions
- [tool_registry.md](./tool_registry.md) - Complete tool reference
- [../06_mcp/](../06_mcp/) - MCP protocol details