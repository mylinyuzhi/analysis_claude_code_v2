# Tool Discovery & Registration (Claude Code 2.1.38)

> Deep dive into how tools are discovered, registered, and made available for execution.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `findTool` (Tv) - Tool lookup by name or alias
- `getDynamicToolSet` (kt) - Returns all available tools
- `toolMatchesName` (d39) - Name/alias matching helper
- `toolDispatcher` (bU1) - Entry point that uses tool discovery

---

## Tool Discovery Architecture

### Overview

Tool discovery in Claude Code follows a **two-tier lookup pattern**:

1. **Session Tool Set** - Tools explicitly available in the current session context
2. **Global Tool Registry** - All registered tools including dynamically loaded ones

```
Tool Use Request (name: "Bash")
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ TIER 1: Session Tool Set Lookup                      │
│                                                       │
│   Tv(Y.options.tools, "Bash")                        │
│   └─→ Searches session-scoped tool array             │
│       └─→ Checks name match AND alias match          │
│           └─→ Returns tool object if found            │
└─────────────────────────────────────────────────────┘
    │
    │ (not found)
    ▼
┌─────────────────────────────────────────────────────┐
│ TIER 2: Global Registry Lookup                       │
│                                                       │
│   Tv(kt(), "Bash")                                   │
│   └─→ Searches global tool registry                  │
│       └─→ Only returns if alias matches              │
│           (direct name should be in Tier 1)          │
└─────────────────────────────────────────────────────┘
    │
    │ (not found)
    ▼
┌─────────────────────────────────────────────────────┐
│ ERROR: No such tool available                        │
│   Returns tool_use_error with tool name              │
└─────────────────────────────────────────────────────┘
```

**Why two tiers?**
- Session tools can be customized per-agent (subagents have restricted tool sets)
- Global registry contains all possible tools for cross-session discovery
- Aliases in global registry enable MCP tool discovery across sessions

---

## Core Functions

### findTool - Tool lookup by name or alias

**What it does:** Searches a tool array for a tool matching the given name, checking both direct name match and alias match.

**How it works:**

```javascript
// ============================================
// findTool - Tool lookup by name or alias
// Location: chunks.74.mjs:1392-1394
// ============================================

// ORIGINAL (for source lookup):
function Tv(A, q) {
    return A.find((K) => d39(K, q))
}

// READABLE (for understanding):
function findTool(toolArray, toolName) {
    return toolArray.find((tool) => toolMatchesName(tool, toolName));
}

// Mapping: Tv→findTool, A→toolArray, q→toolName, K→tool, d39→toolMatchesName
```

**Key insight:** This function uses JavaScript's `Array.find()` which returns the **first** matching tool. Tool order in the array matters - earlier tools take precedence.

---

### toolMatchesName - Name/alias matching helper

**What it does:** Checks if a tool's name or any of its aliases match the requested name.

**How it works:**

```javascript
// ============================================
// toolMatchesName - Name/alias matching helper
// Location: chunks.74.mjs:1388-1390
// ============================================

// ORIGINAL (for source lookup):
function d39(A, q) {
    return A.name === q || (A.aliases?.includes(q) ?? !1)
}

// READABLE (for understanding):
function toolMatchesName(tool, requestedName) {
    // Direct name match
    if (tool.name === requestedName) {
        return true;
    }

    // Check aliases array (optional chaining for safety)
    return tool.aliases?.includes(requestedName) ?? false;
}

// Mapping: d39→toolMatchesName, A→tool, q→requestedName
```

**Why this approach:**
- Direct name check is fastest (no array traversal)
- Optional chaining (`?.`) handles tools without aliases
- Nullish coalescing (`?? false`) ensures boolean return even if `aliases` is undefined

**Key insight:** Aliases enable **tool name polymorphism** - the same tool can be invoked by multiple names. This is critical for MCP tools which may have namespaced names like `mcp__github__create_issue` but can also be referenced by shorter aliases.

---

### getDynamicToolSet - Returns all registered tools

**What it does:** Returns the complete array of all tool objects, including conditionally enabled tools based on feature flags and session mode.

**How it works:**

```javascript
// ============================================
// getDynamicToolSet - Returns all registered tools
// Location: chunks.141.mjs:1465-1467
// ============================================

// ORIGINAL (for source lookup):
function kt() {
    return [rj1, kW6, qq, WB, tS, Nj, i5, sW, vj, gd, Vj, bO, LW6, vW6, dW1, wt, kg1,
        ...jH() ? [tc4, $l4, Wl4, Ll4] : [],
        ...Hi4 ? [Hi4] : [],
        ...$i4 ? [$i4] : [],
        vRA,
        ...l8() ? [zhY(), whY(), HhY()] : [],
        ...wi4 ? [wi4] : [],
        ...zi4 ? [zi4] : [],
        cd, ld,
        ...Fp() ? [IW6] : []
    ]
}

// READABLE (for understanding):
function getDynamicToolSet() {
    // Core tools (always available)
    const coreTools = [
        AgentTool,              // rj1 - Task/Agent tool
        TaskOutputTool,         // kW6
        TaskStopTool,           // qq (also vW6)
        GlobTool,               // WB
        GrepTool,               // tS
        UnknownTool,            // Nj
        FileReadTool,           // i5
        EditTool,               // sW
        FileWriteTool,          // vj
        NotebookEditTool,       // gd
        UnknownTool2,           // Vj
        TodoWriteTool,          // bO
        UnknownTool3,           // LW6
        TaskStopTool2,          // vW6
        UnknownTool4,           // dW1
        SkillTool,              // wt
        UnknownTool5,           // kg1
    ];

    // Conditionally available tools
    const conditionalTools = [
        ...isTasksEnabled() ? [TaskGet, TaskList, TaskCreate, TaskUpdate] : [],
        ...customTool1 ? [customTool1] : [],
        ...customTool2 ? [customTool2] : [],
        planModeTool,           // vRA
        ...isTeamModeEnabled() ? [TeamCreateTool, TeamDeleteTool, SendMessageTool] : [],
        ...optionalTool1 ? [optionalTool1] : [],
        ...optionalTool2 ? [optionalTool2] : [],
        unknownTool6,           // cd
        unknownTool7,           // ld
        ...isFeatureEnabled() ? [SpecialTool] : []
    ];

    return [...coreTools, ...conditionalTools];
}

// Mapping: kt→getDynamicToolSet, rj1→AgentTool, kW6→TaskOutputTool, etc.
```

**Why this approach:**
- Single source of truth for all available tools
- Conditional spreading (`...condition ? [tool] : []`) handles feature flags cleanly
- Order matters: core tools first, conditional tools after

**Conditional tool loading:**
| Condition | Tools Added |
|-----------|-------------|
| `jH()` (isTasksEnabled) | TaskGet, TaskList, TaskCreate, TaskUpdate |
| `l8()` (isTeamModeEnabled) | TeamCreateTool, TeamDeleteTool, SendMessageTool |
| `Fp()` | Special mode tool |

---

## Tool Dispatcher Integration

### toolDispatcher - Entry point for tool discovery

**What it does:** Receives a tool_use block from the LLM, discovers the corresponding tool, and delegates to the execution pipeline.

**Discovery flow:**

```javascript
// ============================================
// toolDispatcher - Tool discovery and delegation
// Location: chunks.149.mjs:343-447
// ============================================

// ORIGINAL (for source lookup):
async function* bU1(A, q, K, Y) {
    let z = A.name,
        w = Tv(Y.options.tools, z);  // Tier 1: Session tools
    if (!w) {
        let X = Tv(kt(), z);          // Tier 2: Global registry
        if (X && X.aliases?.includes(z)) w = X
    }
    // ... error handling if w is still null
    for await (let X of VdY(w, A.id, J, Y, K, q, H, $, O, _)) yield X
}

// READABLE (for understanding):
async function* toolDispatcher(toolUseBlock, assistantMessage, canUseTool, toolUseContext) {
    let toolName = toolUseBlock.name;

    // TIER 1: Search session-scoped tools
    let tool = findTool(toolUseContext.options.tools, toolName);

    // TIER 2: Search global registry for alias match
    if (!tool) {
        let globalTool = findTool(getDynamicToolSet(), toolName);
        // Only use global tool if the requested name is an alias
        // (direct name matches should be in session tools)
        if (globalTool && globalTool.aliases?.includes(toolName)) {
            tool = globalTool;
        }
    }

    // Error if tool not found
    if (!tool) {
        yield createErrorMessage(`No such tool available: ${toolName}`);
        return;
    }

    // Delegate to execution orchestrator
    for await (let result of toolExecutionOrchestrator(tool, ...)) {
        yield result;
    }
}

// Mapping: bU1→toolDispatcher, A→toolUseBlock, z→toolName, w→tool, Tv→findTool, kt→getDynamicToolSet, VdY→toolExecutionOrchestrator
```

**Key insight:** The Tier 2 check specifically verifies `aliases?.includes(toolName)`. This prevents accidental shadowing - if a tool exists in the global registry but the requested name isn't an alias, it won't be used. This ensures session tools take precedence.

---

## Tool Registration Sequence

### Initialization Flow

```
Application Startup
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ Tool Module Initialization                           │
│                                                       │
│   1. Core tool objects created (i5, vj, sW, etc.)   │
│   2. Tool definitions assembled                      │
│   3. Feature flags checked                           │
│   4. Dynamic tools registered                        │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ Session Tool Set Assembly                            │
│                                                       │
│   YP6(toolPermissionContext, mcpTools)              │
│   └─→ Merges core tools + MCP tools                 │
│       └─→ Applies permission rules                   │
│           └─→ Filters by mode (delegate, etc.)       │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ Tool Use Context Setup                               │
│                                                       │
│   toolUseContext.options.tools = sessionTools       │
│   └─→ Available for this session/agent              │
└─────────────────────────────────────────────────────┘
```

### Session Tool Set Assembly

**File:** chunks.141.mjs:1476-1483

```javascript
// ============================================
// assembleSessionToolSet - Build tool set for current session
// Location: chunks.141.mjs:1476-1483
// ============================================

// ORIGINAL (for source lookup):
function YP6(A, q) {
    let K = tD(A);  // Get default tools
    if (O$()) return K;  // Check if filtering disabled
    let Y = hg1(q, A),  // Filter MCP tools by rules
        z = Sx([...K, ...Y], "name");  // Merge and dedupe
    if (A.mode === "delegate") return z.filter((w) => R_6.has(w.name));
    return z
}

// READABLE (for understanding):
function assembleSessionToolSet(permissionContext, mcpTools) {
    // Get default tool set based on permission context
    let defaultTools = getDefaultTools(permissionContext);

    // Early return if filtering is disabled (special mode)
    if (isFilteringDisabled()) {
        return defaultTools;
    }

    // Filter MCP tools by permission rules
    let filteredMcpTools = filterToolsByRules(mcpTools, permissionContext);

    // Merge default tools with MCP tools, deduplicating by name
    let mergedTools = uniqueBy([...defaultTools, ...filteredMcpTools], "name");

    // Filter by delegate mode if applicable
    if (permissionContext.mode === "delegate") {
        return mergedTools.filter((tool) => DELEGATE_ALLOWED_TOOLS.has(tool.name));
    }

    return mergedTools;
}

// Mapping: YP6→assembleSessionToolSet, A→permissionContext, q→mcpTools, K→defaultTools, tD→getDefaultTools, O$→isFilteringDisabled, hg1→filterToolsByRules, Sx→uniqueBy, R_6→DELEGATE_ALLOWED_TOOLS
```

**Key insight:** The `mode === "delegate"` check enables **subagent tool restriction**. When an agent is spawned in delegate mode, it only has access to tools in the `R_6` (DELEGATE_ALLOWED_TOOLS) set. This prevents subagents from using dangerous tools like `Bash` or `Task`.

---

## MCP Tool Discovery

### Tool Name Parsing

MCP tools follow the naming convention: `mcp__<server>__<tool>`

**Examples:**
- `mcp__github__create_issue` - GitHub MCP server's create_issue tool
- `mcp__slack__send_message` - Slack MCP server's send_message tool
- `mcp__filesystem__read_file` - Filesystem MCP server's read_file tool

### Deferred Tool Loading

Some MCP tools are **deferred** - not loaded until explicitly requested via `ToolSearch`.

```javascript
// ============================================
// generateDeferredToolsPrompt - Deferred tool prompt generation
// Location: chunks.89.mjs:618-648
// ============================================

// ORIGINAL (for source lookup):
function E_6(A) {
    if (v_6()) return yv9;  // Check test mode
    let q = A.filter(BW);   // Filter for MCP tools
    if (q.length === 0) {
        // No deferred tools
        return ca = "", pp7;
    }
    // Build list of deferred tool names
    let K = q.map((Y) => Y.name).join(`
`);
    return `${pp7}

Available deferred tools (must be loaded before use):
${K}`
}

// READABLE (for understanding):
function generateDeferredToolsPrompt(mcpTools) {
    // In test mode, return fixed value
    if (isTestMode()) {
        return TEST_MODE_DEFERRED_TOOLS;
    }

    // Filter for MCP tools that are deferred
    let deferredTools = mcpTools.filter(isMcpTool);

    if (deferredTools.length === 0) {
        return "";  // No deferred tools
    }

    // Build prompt listing deferred tools
    let toolList = deferredTools.map((tool) => tool.name).join("\n");

    return `${DEFERRED_TOOLS_HEADER}

Available deferred tools (must be loaded before use):
${toolList}`;
}

// Mapping: E_6→generateDeferredToolsPrompt, A→mcpTools, v_6→isTestMode, BW→isMcpTool, pp7→DEFERRED_TOOLS_HEADER, ca→cachedDeferredPrompt
```

**Why deferred loading?**
- Reduces prompt size for tools that may not be needed
- LLM explicitly requests tools it needs via `ToolSearch`
- Prevents tool spam in system prompt

See [dynamic_tools.md](./dynamic_tools.md) for complete deferred tool analysis.

---

## Additional Source Code Analysis

### getDefaultTools - Base tool set

**What it does:** Returns the base set of tools available to a session before MCP tools are merged.

```javascript
// ============================================
// getDefaultTools - Base tool set for session
// Location: chunks.141.mjs:1505-1516
// ============================================

// ORIGINAL (for source lookup):
tD = (A) => {
    if (J6(void 0)) return [qq];  // Special case: return only TaskStop
    let q = new Set([cd.name, ld.name, cD]),  // Tools to exclude
        K = kt().filter((w) => !q.has(w.name)),  // Filter excluded tools
        Y = hg1(K, A);  // Apply permission rules
    if (A.mode === "delegate") Y = Y.filter((w) => R_6.has(w.name));  // Delegate mode filter
    if (J6(process.env.CLAUDE_REPL_MODE)) {
        if (Y.some((H) => H.name === y_6)) Y = Y.filter((H) => !rp7.has(H.name))
    }
    let z = Y.map((w) => w.isEnabled());
    return Y.filter((w, H) => z[H])  // Filter by isEnabled
}

// READABLE (for understanding):
function getDefaultTools(permissionContext) {
    // Special case: return only TaskStop (for certain modes)
    if (parseBoolean(undefined)) {
        return [TaskStopTool];
    }

    // Tools to exclude from default set
    let excludedTools = new Set([
        unknownTool6.name,    // cd
        unknownTool7.name,    // ld
        cD                    // Some tool constant
    ]);

    // Get all registered tools and filter excluded
    let allTools = getDynamicToolSet().filter((tool) => !excludedTools.has(tool.name));

    // Apply permission rules
    let allowedTools = filterToolsByRules(allTools, permissionContext);

    // Apply delegate mode filter
    if (permissionContext.mode === "delegate") {
        allowedTools = allowedTools.filter((tool) => DELEGATE_ALLOWED_TOOLS.has(tool.name));
    }

    // REPL mode filter (exclude certain tools in REPL mode)
    if (parseBoolean(process.env.CLAUDE_REPL_MODE)) {
        if (allowedTools.some((t) => t.name === SOME_TOOL_NAME)) {
            allowedTools = allowedTools.filter((t) => !REPL_EXCLUDED_TOOLS.has(t.name));
        }
    }

    // Filter by isEnabled flag
    let enabledFlags = allowedTools.map((tool) => tool.isEnabled());
    return allowedTools.filter((tool, index) => enabledFlags[index]);
}

// Mapping: tD→getDefaultTools, A→permissionContext, q→excludedTools, K→allTools,
//          Y→allowedTools, hg1→filterToolsByRules, R_6→DELEGATE_ALLOWED_TOOLS,
//          J6→parseBoolean, kt→getDynamicToolSet
```

**Key insight:** The `getDefaultTools` function applies multiple layers of filtering:
1. Exclusion set (tools that shouldn't be in default set)
2. Permission rules (path-based, tool-based deny rules)
3. Mode filtering (delegate mode restricts to whitelist)
4. Environment filtering (REPL mode has additional restrictions)
5. isEnabled check (feature flags)

---

### filterToolsByRules - Permission rule filtering

**What it does:** Filters tools based on permission rules that deny specific tools.

```javascript
// ============================================
// filterToolsByRules - Apply permission deny rules
// Location: chunks.141.mjs:1469-1474
// ============================================

// ORIGINAL (for source lookup):
function hg1(A, q) {
    let K = tU(q);  // Get permission rules
    return A.filter((Y) => {
        return !K.some((z) => z.ruleValue.toolName === Y.name && z.ruleValue.ruleContent === void 0)
    })
}

// READABLE (for understanding):
function filterToolsByRules(tools, permissionContext) {
    // Get all permission rules
    let rules = getPermissionRules(permissionContext);

    // Filter out tools that have a deny rule with no specific content
    // (meaning "deny all uses of this tool")
    return tools.filter((tool) => {
        let isDenied = rules.some((rule) => {
            return rule.ruleValue.toolName === tool.name &&
                   rule.ruleValue.ruleContent === undefined;  // No exception
        });
        return !isDenied;
    });
}

// Mapping: hg1→filterToolsByRules, A→tools, q→permissionContext, K→rules,
//          tU→getPermissionRules
```

**Key insight:** This filtering removes tools that have blanket deny rules. Tools with specific allow rules (ruleContent defined) are NOT filtered out here - those rules are applied during the permission check in the execution pipeline.

---

### Tool Discovery in toolDispatcher

**What it does:** Complete tool discovery flow in the dispatcher.

```javascript
// ============================================
// toolDispatcher - Tool discovery flow
// Location: chunks.149.mjs:343-400
// ============================================

// ORIGINAL (for source lookup):
async function* bU1(A, q, K, Y) {
    let z = A.name,  // Tool name from tool_use block
        w = Tv(Y.options.tools, z);  // Tier 1: Session tools

    if (!w) {
        // Tier 2: Check global registry for alias match
        let X = Tv(kt(), z);
        if (X && X.aliases?.includes(z)) w = X;
    }

    // Tool not found error
    if (!w) {
        let X = AK(z);  // Sanitize tool name for display
        h(`Unknown tool ${z}: ${A.id}`);  // Log warning
        c("tengu_tool_use_error", {
            error: `No such tool available: ${X}`,
            toolName: X,
            toolUseID: A.id,
            isMcp: z.startsWith("mcp__"),
            // ... telemetry fields
        });
        yield {
            message: c6({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>Error: No such tool available: ${z}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: A.id
                }]
            })
        };
        return;
    }

    // Proceed with execution
    for await (let X of VdY(w, A.id, J, Y, K, q, H, $, O, _)) yield X;
}

// READABLE (for understanding):
async function* toolDispatcher(toolUseBlock, assistantMessage, canUseTool, toolUseContext) {
    let toolName = toolUseBlock.name;

    // TIER 1: Search session-scoped tools first
    let tool = findTool(toolUseContext.options.tools, toolName);

    // TIER 2: Search global registry for alias match
    if (!tool) {
        let globalTool = findTool(getDynamicToolSet(), toolName);
        // Only use global tool if the requested name is an alias
        // (direct name matches should be in session tools)
        if (globalTool && globalTool.aliases?.includes(toolName)) {
            tool = globalTool;
        }
    }

    // Tool not found - return error
    if (!tool) {
        emitTelemetry("tengu_tool_use_error", {
            error: `No such tool available: ${toolName}`,
            toolName: sanitizeToolName(toolName),
            toolUseID: toolUseBlock.id,
            isMcp: toolName.startsWith("mcp__")
        });
        yield {
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>Error: No such tool available: ${toolName}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseBlock.id
                }]
            })
        };
        return;
    }

    // Delegate to execution orchestrator
    for await (let result of toolExecutionOrchestrator(tool, toolUseBlock.id, input, ...)) {
        yield result;
    }
}

// Mapping: bU1→toolDispatcher, A→toolUseBlock, z→toolName, w→tool,
//          Tv→findTool, kt→getDynamicToolSet, AK→sanitizeToolName,
//          h→logWarning, c→emitTelemetry, c6→createUserMessage, VdY→toolExecutionOrchestrator
```

---

### MCP Server Name Extraction

**What it does:** Extracts server name from MCP tool name for telemetry and filtering.

```javascript
// ============================================
// MCP Tool Name Parsing
// Location: chunks.149.mjs (Jh function)
// ============================================

// ORIGINAL (for source lookup):
// Jh parses mcp__<server>__<tool> format

// READABLE (for understanding):
function parseMcpToolName(fullName) {
    if (!fullName.startsWith("mcp__")) {
        return null;  // Not an MCP tool
    }

    // Remove "mcp__" prefix (5 characters)
    let withoutPrefix = fullName.slice(5);

    // Split on "__" separator
    let parts = withoutPrefix.split("__");

    if (parts.length < 2) {
        return null;  // Malformed name
    }

    return {
        serverName: parts[0],
        mcpToolName: parts.slice(1).join("__"),  // Tool name may contain "__"
        fullName: fullName
    };
}

// Usage in telemetry (from chunks.149.mjs):
if (isMcpTelemetryEnabled()) {
    let mcpInfo = parseMcpToolName(tool.name);
    if (mcpInfo) {
        telemetryData.mcpServerName = mcpInfo.serverName;
        telemetryData.mcpToolName = mcpInfo.mcpToolName;
    }
}
```

---

### Alias Resolution Flow

**What it does:** Complete alias resolution flow with examples.

```javascript
// ============================================
// Alias Resolution Examples
// ============================================

// Example 1: MCP tool with short alias
const githubCreateIssue = {
    name: "mcp__github__create_issue",
    aliases: ["create_issue", "gh_create_issue"],
    isMcp: true
};

// Resolution:
findTool([githubCreateIssue], "mcp__github__create_issue");  // Direct match
findTool([githubCreateIssue], "create_issue");               // Alias match
findTool([githubCreateIssue], "gh_create_issue");            // Alias match

// Example 2: Tool with legacy name alias
const readTool = {
    name: "Read",
    aliases: ["read_file", "ReadFile"]  // Legacy names
};

// Resolution:
findTool([readTool], "Read");       // Direct match
findTool([readTool], "read_file");  // Alias match (legacy)
findTool([readTool], "ReadFile");   // Alias match (legacy)

// Example 3: Subagent tool restriction via session tools
// Parent agent has all tools
let allTools = [BashTool, ReadTool, WriteTool, EditTool];

// Subagent gets restricted set
let subagentTools = [ReadTool, WriteTool];  // Only these passed in session

// Subagent tries to use Bash (not in session tools)
let result = findTool(subagentTools, "Bash");  // null - not found

// Tier 2 check:
let globalResult = findTool(allTools, "Bash");  // Returns BashTool
// But: BashTool.aliases.includes("Bash") is false
// So tool is NOT used - permission denied
```

---

### Tool Name Sanitization

**What it does:** Sanitizes tool names for display in logs and telemetry.

```javascript
// ============================================
// Tool Name Sanitization (AK function)
// Location: chunks.149.mjs
// ============================================

// ORIGINAL (for source lookup):
// AK function sanitizes tool names

// READABLE (for understanding):
function sanitizeToolName(toolName) {
    // Remove potentially sensitive or malformed parts
    // Ensure name is valid for display

    // For MCP tools, ensure proper format
    if (toolName.startsWith("mcp__")) {
        // Validate MCP tool name format
        let parsed = parseMcpToolName(toolName);
        if (parsed) {
            return `mcp__${parsed.serverName}__${parsed.mcpToolName}`;
        }
    }

    // For regular tools, just return as-is (already validated)
    return toolName;
}

// Used in telemetry:
emitTelemetry("tengu_tool_use_success", {
    toolName: sanitizeToolName(tool.name),  // Safe for logging
    // ...
});
```

---

## Telemetry Events for Tool Discovery

| Event | When Triggered | Key Fields |
|-------|----------------|------------|
| `tengu_tool_use_error` | Tool not found | `error`, `toolName`, `isMcp` |
| `tengu_tool_prompt_changed` | Deferred tools list changes | `previousDeferredCount`, `newDeferredCount` |
| `tengu_tool_use_cancelled` | Tool execution aborted | `toolName`, `toolUseID` |

---

## Alias Resolution Examples

### Example 1: Direct Name Match

```javascript
// Tool definition
const BashTool = {
    name: "Bash",
    aliases: ["ExecuteCommand", "Shell"],
    // ...
};

// Lookup
findTool([BashTool], "Bash");  // Returns BashTool
findTool([BashTool], "ExecuteCommand");  // Returns BashTool (alias match)
findTool([BashTool], "Shell");  // Returns BashTool (alias match)
```

### Example 2: MCP Tool Alias

```javascript
// MCP tool definition
const GitHubCreateIssue = {
    name: "mcp__github__create_issue",
    aliases: ["create_issue", "gh_create_issue"],
    isMcp: true,
    // ...
};

// Lookup
findTool([GitHubCreateIssue], "mcp__github__create_issue");  // Direct match
findTool([GitHubCreateIssue], "create_issue");  // Alias match
```

### Example 3: Tier Resolution

```javascript
// Session tools (restricted set for subagent)
const sessionTools = [ReadTool, WriteTool];

// Global registry (all tools)
const globalTools = [ReadTool, WriteTool, BashTool, TaskTool];

// Subagent tries to use Bash (not in session tools)
findTool(sessionTools, "Bash");  // null
findTool(globalTools, "Bash");   // Returns BashTool
// But: BashTool.aliases.includes("Bash") is false
// So the tool is NOT used - permission denied

// Subagent tries to use Read (in session tools)
findTool(sessionTools, "Read");  // Returns ReadTool - allowed
```

---

## Telemetry Integration

Tool discovery emits telemetry for debugging and analytics:

| Event | When Triggered | Key Data |
|-------|----------------|----------|
| `tengu_tool_use_error` | Tool not found | `error: "No such tool available"`, tool name |
| `tengu_tool_prompt_changed` | Deferred tools change | Previous count, new count |

---

## Related Documents

- [tool_execution_pipeline.md](./tool_execution_pipeline.md) - What happens after tool is found
- [dynamic_tools.md](./dynamic_tools.md) - MCP and deferred tool details
- [tool_registry.md](./tool_registry.md) - Tool categories and quick reference