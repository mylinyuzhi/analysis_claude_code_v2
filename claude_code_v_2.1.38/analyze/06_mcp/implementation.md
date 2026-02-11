# Module: Model Context Protocol (MCP) (06)

## Overview

Claude Code v2.1.38 implements a "Meta-Tooling" architecture for MCP. Instead of exposing every MCP tool as a top-level model tool, it provides a virtual `mcp-cli` command accessible via the `Bash` tool. This allows for dynamic discovery and execution of thousands of potential tools without exceeding context limits or confusing the model with too many schemas.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `parseMcpCliCommand` (ce) - Regex-based parser for `mcp-cli` commands in the terminal.
- `processMcpCliResult` (CYz) - Post-processor for terminal output that redirects `mcp-cli` calls to the internal MCP bridge.
- `updateMcpSessionState` (CJq) - Syncs the current MCP server/tool/resource state to a local JSON file for the CLI.
- `buildMcpCliInstructions` (FOq) - Generates the mandatory "Read-Before-Call" safety instructions for the system prompt.
- `McpMetaTool` (ln4) - A placeholder tool definition used for internal MCP routing.

---

## Core Algorithms

### The `mcp-cli` Command Interception

**What it does:**
When the model executes a bash command, the system checks if it is an `mcp-cli` call. If so, it bypasses the real shell and executes the tool internally through the Model Context Protocol.

**How it works:**
1.  **Instruction Injection**: At the start of the session, `buildMcpCliInstructions` (FOq) adds a section to the system prompt explaining that `mcp-cli info <server>/<tool>` must be called before `mcp-cli call <server>/<tool>`.
2.  **Detection**: The `Bash` tool's `call` method invokes `parseMcpCliCommand` (ce). It uses a regex to match commands like `mcp-cli call <server>/<tool> [args]`.
3.  **Execution Bridge**: If matched, `processMcpCliResult` (CYz) is triggered. It uses `callMcpServer` (ECA) to communicate with the target MCP server via JSON-RPC.
4.  **Result Formatting**: The JSON results from the MCP server are formatted back into "stdout" for the model to read. For large outputs, it can save the result to a temporary file and return the path (`rawOutputPath`).
5.  **State Persistence**: `updateMcpSessionState` (CJq) continuously updates a file in `~/.claude/claude-code-mcp-cli/<sessionId>.json` with the current list of servers and tools. This file acts as the source of truth for the `mcp-cli info` command.

**Why this approach:**
- **Context Efficiency**: Top-level tool schemas are limited. `mcp-cli` allows access to an unlimited number of MCP tools.
- **Reliability**: The "Info-Before-Call" rule ensures the model always knows the correct JSON schema for an MCP tool, preventing hallucinated parameters.
- **Unified Interface**: By using the terminal as the entry point, MCP tools feel like native CLI tools to the agent.

**Key insight:** The "Blocking Requirement" enforced via the system prompt (`You MUST call 'mcp-cli info' BEFORE ANY 'mcp-cli call'`) mirrors the `Read` before `Edit` pattern used for local files, ensuring high reliability in tool usage.

---

## Code Implementation (Deobfuscated)

### parseMcpCliCommand - Command string parser
// Location: chunks.174.mjs:2627-2640

// ORIGINAL (for source lookup):
```javascript
function ce(A) {
    let q = A.match(/^mcp-cli\s+(call|read)\s+([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(?:\s+([\s\S]+))?$/);
    if (!q) return null;
    let [, K, Y, z, w = ""] = q;
    if (!K || !Y || !z) return null;
    return {
        command: K,
        server: Y,
        tool: z,
        toolName: z,
        args: w,
        fullCommand: A
    }
}
```

// READABLE (for understanding):
```javascript
/**
 * Parses a string to check if it's an mcp-cli command
 * @param {string} command - The raw bash command
 * @returns {Object|null} Parsed MCP info or null if not an MCP command
 */
function parseMcpCliCommand(command) {
    // Matches: mcp-cli <call|read> <server>/<tool> [arguments]
    const mcpRegex = /^mcp-cli\s+(call|read)\s+([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(?:\s+([\s\S]+))?$/;
    const match = command.match(mcpRegex);
    
    if (!match) return null;
    
    const [, action, serverName, toolName, rawArgs = ""] = match;
    
    if (!action || !serverName || !toolName) return null;
    
    return {
        command: action,      // "call" or "read"
        server: serverName,   // e.g. "sqlite"
        tool: toolName,       // e.g. "query"
        toolName: toolName,
        args: rawArgs,        // JSON arguments as string
        fullCommand: command
    };
}
```

// Mapping: ce→parseMcpCliCommand, A→command, q→match, K→action, Y→serverName, z→toolName, w→rawArgs

---

### updateMcpSessionState - Persistence for discovery
// Location: chunks.174.mjs:353-378

// ORIGINAL (for source lookup):
```javascript
async function CJq(A, q, K) {
    if (!O$()) return;
    try {
        await B2z(hc(), { recursive: !0 });
        let Y = await Promise.all(q.filter((O) => O.isMcp).map(Q2z)),
            z = {}, w = {};
        for (let O of A) {
            z[O.name] = O.config;
            let _ = P5(O.name);
            w[_] = O.name
        }
        let H = {
                clients: A.map(F2z),
                configs: z,
                tools: Y,
                resources: K,
                normalizedNames: w
            },
            $ = ST6();
        await u2z($, Q1(H, null, 2))
    } catch {}
}
```

// READABLE (for understanding):
```javascript
/**
 * Syncs MCP state to a local JSON file for the mcp-cli tool to use
 * @param {Array} servers - Active MCP server clients
 * @param {Array} tools - Known tools across all servers
 * @param {Array} resources - Available MCP resources
 */
async function updateMcpSessionState(servers, tools, resources) {
    if (!isMcpCliEnabled()) return;
    
    try {
        const cacheDir = getMcpCliCacheDir();
        await ensureDir(cacheDir, { recursive: true });
        
        // 1. Prepare tool metadata (names, descriptions, schemas)
        const mcpToolMetadata = await Promise.all(
            tools.filter(t => t.isMcp).map(extractToolInfo)
        );
        
        const serverConfigs = {};
        const normalizedToOriginalMap = {};
        
        for (const server of servers) {
            serverConfigs[server.name] = server.config;
            const normalizedName = normalizeServerName(server.name);
            normalizedToOriginalMap[normalizedName] = server.name;
        }
        
        // 2. Build session state object
        const sessionState = {
            clients: servers.map(s => serializeClient(s)),
            configs: serverConfigs,
            tools: mcpToolMetadata,
            resources: resources,
            normalizedNames: normalizedToOriginalMap
        };
        
        // 3. Write to ~/.claude/claude-code-mcp-cli/<sessionId>.json
        const sessionFile = getMcpSessionFilePath();
        await writeAtomic(sessionFile, JSON.stringify(sessionState, null, 2));
        
    } catch (err) {
        // Silently fail, MCP discovery might be degraded
    }
}
```

// Mapping: CJq→updateMcpSessionState, A→servers, q→tools, K→resources, Q2z→extractToolInfo, hc→getMcpCliCacheDir, ST6→getMcpSessionFilePath
