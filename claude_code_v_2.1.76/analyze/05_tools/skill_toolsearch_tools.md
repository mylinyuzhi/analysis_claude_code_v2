# Skill & ToolSearch Tools - Deep Analysis (Claude Code 2.1.38)

> Complete analysis of skill execution and deferred tool loading: Skill, ToolSearch.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `SkillTool` (wt) - Execute slash commands/skills - chunks.132.mjs:820
- `ToolSearchTool` (dM) - Load deferred MCP tools - chunks.89.mjs:652

---

## Architecture Overview

```
Skill & ToolSearch System
│
├── Skill Tool
│   ├── Slash command execution
│   │   └── /<command> → Skill lookup → Execute
│   │
│   └── User-invocable skills
│       ├── keybindings-help
│       ├── simplify
│       └── Custom skills from .claude/skills/
│
└── ToolSearch Tool
    └── Deferred MCP tool loading
        ├── Keyword search → Top 5 matches
        ├── Direct selection → "select:<tool_name>"
        └── Required keyword → "+<server> <keywords>"
```

---

## 1. Skill Tool

### SkillTool (wt) - Slash command execution

**What it does:** Executes slash commands/skills that provide specialized capabilities and domain knowledge. Users invoke skills via `/<skill-name>` syntax.

**How it works:**
1. Receives skill name and optional arguments
2. Looks up skill definition from registry
3. Expands skill to full prompt
4. Executes the skill's logic

```javascript
// ============================================
// SkillTool - Slash command execution
// Location: chunks.132.mjs:820
// ============================================

// ORIGINAL (for source lookup):
wt = "Skill"
NJ = "Skill"

// READABLE (for understanding):
const SkillTool = {
    name: "Skill",
    maxResultSizeChars: 100000,

    inputSchema: z.strictObject({
        skill: z.string().describe("The skill name to invoke"),
        args: z.string().optional().describe("Optional arguments for the skill")
    }),

    outputSchema: z.any(),  // Varies by skill

    isEnabled() { return true; },
    isConcurrencySafe() { return false; },
    isReadOnly() { return false; },

    async call({ skill, args }, toolUseContext) {
        // Look up skill definition
        let skillDefinition = await lookupSkill(skill);

        if (!skillDefinition) {
            throw Error(`Skill "${skill}" not found. Available skills can be discovered via /help.`);
        }

        // Execute skill with arguments
        let result = await executeSkill(skillDefinition, {
            args: args,
            toolUseContext: toolUseContext
        });

        return { data: result };
    }
};

// Mapping: wt→SkillTool, NJ→SKILL_TOOL_NAME
```

### Skill Types

**Built-in Skills:**
- `keybindings-help` - Customize keyboard shortcuts
- `simplify` - Review code for reuse, quality, efficiency

**Custom Skills:**
Skills can be defined in `.claude/skills/` directory as markdown files with YAML frontmatter.

---

## 2. ToolSearch Tool

### ToolSearchTool (dM) - Deferred MCP tool loading

**What it does:** Loads deferred MCP tools that aren't included in the initial tool set. MCP tools can be deferred to reduce prompt size and improve startup performance.

**How it works:**
1. Accepts query string in various formats
2. Searches deferred tool registry
3. Returns matching tools (now loaded and available)
4. Tools become immediately callable

```javascript
// ============================================
// ToolSearchTool - Deferred tool loading
// Location: chunks.89.mjs:652
// ============================================

// ORIGINAL (for source lookup):
dM = "ToolSearch"

// Prompt text from source
dp7 = `
**Why this is non-negotiable:**
- Deferred tools are not loaded until discovered via this tool
- Calling a deferred tool without first loading it will fail

**Query modes:**

1. **Keyword search** - Use keywords when you're unsure which tool to use or need to discover multiple tools at once:
   - "list directory" - find tools for listing directories
   - "notebook jupyter" - find notebook editing tools
   - "slack message" - find slack messaging tools
   - Returns up to 5 matching tools ranked by relevance
   - All returned tools are immediately available to call — no further selection step needed

2. **Direct selection** - Use \`select:<tool_name>\` when you know the exact tool name and only need that one tool:
   - "select:mcp__slack__read_channel"
   - "select:NotebookEdit"
   - Returns just that tool if it exists

**IMPORTANT:** Both modes load tools equally. Do NOT follow up a keyword search with \`select:\` calls for tools already returned — they are already loaded.

3. **Required keyword** - Prefix with \`+\` to require a match:
   - "+linear create issue" - only tools from "linear", ranked by "create"/"issue"
   - "+slack send" - only "slack" tools, ranked by "send"
   - Useful when you know the service name but not the exact tool
`

// READABLE (for understanding):
const ToolSearchTool = {
    name: "ToolSearch",
    maxResultSizeChars: 100000,

    inputSchema: z.strictObject({
        query: z.string().describe("Search query - keywords, 'select:<name>', or '+server keywords'")
    }),

    outputSchema: z.object({
        tools: z.array(z.object({
            name: z.string(),
            description: z.string(),
            inputSchema: z.any()
        }))
    }),

    isEnabled() { return true; },
    isConcurrencySafe() { return true; },
    isReadOnly() { return true; },

    async call({ query }, toolUseContext) {
        let deferredTools = getDeferredMcpTools();

        // Parse query type
        if (query.startsWith("select:")) {
            // Direct selection mode
            let toolName = query.slice(7);  // Remove "select:"
            let tool = deferredTools.find(t => t.name === toolName);

            if (tool) {
                // Load and return the tool
                await loadToolIntoContext(tool, toolUseContext);
                return {
                    data: {
                        tools: [{
                            name: tool.name,
                            description: tool.description,
                            inputSchema: tool.inputSchema
                        }]
                    }
                };
            }

            return { data: { tools: [] } };
        }

        if (query.startsWith("+")) {
            // Required keyword mode
            let [serverName, ...keywords] = query.slice(1).split(/\s+/);

            // Filter to only tools from specified server
            let serverTools = deferredTools.filter(t =>
                t.name.startsWith(`mcp__${serverName}__`)
            );

            // Rank by keyword relevance
            let ranked = rankToolsByKeywords(serverTools, keywords);

            // Load top results
            let toLoad = ranked.slice(0, 5);
            for (let tool of toLoad) {
                await loadToolIntoContext(tool, toolUseContext);
            }

            return {
                data: {
                    tools: toLoad.map(t => ({
                        name: t.name,
                        description: t.description,
                        inputSchema: t.inputSchema
                    }))
                }
            };
        }

        // Keyword search mode
        let keywords = query.split(/\s+/);
        let ranked = rankToolsByKeywords(deferredTools, keywords);

        // Load top 5 results
        let top5 = ranked.slice(0, 5);
        for (let tool of top5) {
            await loadToolIntoContext(tool, toolUseContext);
        }

        return {
            data: {
                tools: top5.map(t => ({
                    name: t.name,
                    description: t.description,
                    inputSchema: t.inputSchema
                }))
            }
        };
    }
};

// Mapping: dM→ToolSearchTool, dp7→TOOL_SEARCH_PROMPT
```

### Query Modes Explained

**1. Keyword Search:**
```
Query: "slack message"
Result: Tools containing "slack" AND "message" in name/description, ranked by relevance
Returns: Up to 5 tools
```

**2. Direct Selection:**
```
Query: "select:mcp__slack__send_message"
Result: Exact tool match
Returns: Single tool if found
```

**3. Required Keyword:**
```
Query: "+slack send"
Result: Only tools from "slack" MCP server, ranked by "send"
Returns: Up to 5 tools
```

---

## 3. Deferred Tool System

### Why Deferred Tools?

**What it does:** Large MCP servers can provide dozens of tools, bloating the prompt. Deferred tools are:
1. Listed in a special prompt section
2. Not loaded into the initial tool set
3. Discovered and loaded via ToolSearch

**Benefits:**
- Reduces initial prompt size
- Improves startup performance
- Only loads tools when needed

### Deferred Tool Prompt Generation

```javascript
// ============================================
// Deferred Tool Prompt Generation
// Location: chunks.89.mjs:618-648
// ============================================

// ORIGINAL (for source lookup):
function E_6(A) {
    if (v_6()) return yv9;  // If names in messages enabled, return all tools
    let q = A.filter(BW);   // Filter to MCP tools only
    if (q.length === 0) {
        // No deferred tools
        if (ca !== void 0 && ca !== "") {
            c("tengu_tool_prompt_changed", {
                tool: "ToolSearchTool",
                previousDeferredCount: ca.split(`\n`).length,
                newDeferredCount: 0
            });
        }
        return ca = "", pp7;  // Return base prompt
    }
    let K = x8("tengu_kv7_prompt_sort", !1)
        ? q.map((Y) => Y.name).sort().join(`\n`)
        : q.map((Y) => Y.name).join(`\n`);
    // ... track changes
    return ca = K, `${pp7}\n\nAvailable deferred tools (must be loaded before use):\n${K}`
}

// READABLE (for understanding):
function generateDeferredToolsPrompt(tools) {
    // If TST names in messages feature is enabled, load all tools
    if (shouldShowToolNamesInMessages()) {
        return ALL_TOOLS_PROMPT;
    }

    // Filter to only MCP tools
    let mcpTools = tools.filter(isMcpTool);

    if (mcpTools.length === 0) {
        // Track prompt change for telemetry
        if (previousDeferredTools !== undefined && previousDeferredTools !== "") {
            emitTelemetry("tengu_tool_prompt_changed", {
                tool: "ToolSearchTool",
                previousDeferredCount: previousDeferredTools.split("\n").length,
                newDeferredCount: 0
            });
        }

        previousDeferredTools = "";
        return BASE_PROMPT;
    }

    // Build tool list (optionally sorted)
    let toolList = shouldSortTools()
        ? mcpTools.map(t => t.name).sort().join("\n")
        : mcpTools.map(t => t.name).join("\n");

    // Track changes
    if (previousDeferredTools !== undefined && toolList !== previousDeferredTools) {
        let prevCount = previousDeferredTools.split("\n").filter(Boolean).length;
        let newCount = toolList.split("\n").filter(Boolean).length;

        emitTelemetry("tengu_tool_prompt_changed", {
            tool: "ToolSearchTool",
            previousDeferredCount: prevCount,
            newDeferredCount: newCount
        });
    }

    previousDeferredTools = toolList;

    return `${BASE_PROMPT}

Available deferred tools (must be loaded before use):
${toolList}`;
}

// Mapping: E_6→generateDeferredToolsPrompt, BW→isMcpTool, v_6→shouldShowToolNamesInMessages
```

---

## 4. Complete Tool Reference

| Tool | Obfuscated | Purpose | Location |
|------|------------|---------|----------|
| Skill | `wt`, `NJ` | Execute slash commands/skills | chunks.132.mjs:820 |
| ToolSearch | `dM` | Load deferred MCP tools | chunks.89.mjs:652 |

---

## 5. Key Properties

| Tool | Concurrency Safe | Read-Only | User Facing |
|------|-----------------|-----------|-------------|
| Skill | ❌ | ❌ | Yes (`/<name>`) |
| ToolSearch | ✅ | ✅ | No |

---

## 6. Usage Patterns

### Skill Tool Usage

```
User: /keybindings-help rebind ctrl+s
         │
         ▼
Skill tool invoked with { skill: "keybindings-help", args: "rebind ctrl+s" }
         │
         ▼
Skill expands to full prompt with context
         │
         ▼
Agent helps user modify ~/.claude/keybindings.json
```

### ToolSearch Usage

```
Agent needs Slack integration:
         │
         ▼
ToolSearch({ query: "slack" })
         │
         ▼
Returns: mcp__slack__read_channel, mcp__slack__send_message, ...
         │
         ▼
Tools now loaded - can call directly:
mcp__slack__send_message({ channel: "#general", text: "Hello" })
```

---

## 7. MCP Tool Naming Convention

```
mcp__<server_name>__<tool_name>

Examples:
- mcp__slack__send_message
- mcp__linear__create_issue
- mcp__github__create_pull_request

The server_name is extracted from the tool name for:
1. Required keyword filtering (+slack ...)
2. Permission scoping
3. Tool grouping in UI
```