# MCP Cross-Module Integration (Claude Code 2.1.76)

## Overview

The MCP (Model Context Protocol) system is deeply integrated with multiple Claude Code modules. This document maps all integration points, showing how MCP connects to system reminders, tools, permissions, LLM core, hooks, and other features.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP Protocol section
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools and Agent Loop

Key symbols in this document:
- `fetchMcpTools` (JE) - Discovers MCP tools from connected server (chunks.170.mjs:533)
- `parseMcpCliCommand` (ce) - Intercepts `mcp-cli` commands in Bash tool
- `callMcpServer` (ECA) - Executes MCP tool calls
- `setupElicitationRequestHandler` (WT7) - Registers elicitation handler on MCP client
- `getSandboxSystemPromptBlock` (E9z) - Injects sandbox instructions (MCP exception for `mcp-cli`)

> **Note:** `FOq` was incorrectly documented as `buildMcpCliInstructions`. Actual `FOq` in chunks.159.mjs:294 is QR code numeric mode encoder. MCP tool discovery is handled by `fetchMcpTools` (JE).

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MCP Integration Points                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  03_llm_core (LLM API)                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • System prompt injection via buildMcpCliInstructions (FOq)         │    │
│  │ • MCP tool discovery advertised in system prompt                    │    │
│  │ • Tool schemas discovered dynamically (not pre-loaded)              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  04_system_reminder (System Prompts)                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • MCP capabilities injected into Bash tool system prompt            │    │
│  │ • mcp-cli info/call workflow instructions                           │    │
│  │ • Safety instruction: "MUST call info BEFORE call"                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  05_tools (Tool System)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Bash tool intercepts mcp-cli commands                              │    │
│  │ • parseMcpCliCommand (ce) detects MCP commands                       │    │
│  │ • processMcpCliResult (CYz) executes via callMcpServer (ECA)        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  11_hooks (Hook System)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Elicitation hook: fires before elicitation dialog                  │    │
│  │ • ElicitationResult hook: fires after user responds                  │    │
│  │ • Hook can intercept/modify elicitation requests                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  18_sandbox (Sandbox System)                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • mcp-cli commands MUST run with dangerouslyDisableSandbox: true    │    │
│  │ • Exception injected in getSandboxSystemPromptBlock (E9z)           │    │
│  │ • MCP server communication bypasses sandbox                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  37_permission_policy (Permissions)                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • MCP tool calls go through permission checks                        │    │
│  │ • Domain-based network permissions for MCP servers                   │    │
│  │ • Permission mode synced to IDE via MCP                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Integration with 03_llm_core (LLM API)

### MCP Tool Registration

**What it does:** MCP tools are registered dynamically at runtime when MCP servers connect. Tools are not pre-loaded into the system prompt; instead, they are discovered via the `tools/list` MCP method and exposed to the model through the internal tool registry.

**How it works:**
When an MCP server connects, the `fetchMcpTools` function (JE in chunks.170.mjs:533) queries the server for available tools:

```javascript
// ============================================
// fetchMcpTools - Discover MCP tools from connected server
// Location: chunks.170.mjs:533-589
// ============================================

// ORIGINAL (for source lookup):
JE = ZP(async (A) => {
    if (A.type !== "connected") return [];
    try {
        if (!A.capabilities?.tools) return [];
        let q = await A.client.request({
                method: "tools/list"
            }, $y6),
            K = Ws(q.tools),
            Y = A.config.type === "sdk" && t6(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);
        return K.map((z) => {
            let _ = $58(A.name, z.name);
            return {
                ...tZq,
                name: Y ? z.name : _,
                mcpInfo: {
                    serverName: A.name,
                    toolName: z.name
                },
                isMcp: !0,
                async description() { return z.description ?? "" },
                inputJSONSchema: z.inputSchema,
                // ... additional methods
            };
        });
    } catch { return []; }
});

// READABLE (for understanding):
async function fetchMcpTools(mcpClient) {
    if (mcpClient.type !== "connected") return [];

    try {
        if (!mcpClient.capabilities?.tools) return [];

        // Request tools from MCP server
        let response = await mcpClient.client.request({
            method: "tools/list"
        }, ToolListResultSchema);

        let tools = ensureArray(response.tools);

        // Check if SDK mode should skip tool name prefixing
        let skipPrefix = mcpClient.config.type === "sdk" &&
            isTruthy(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

        return tools.map((tool) => {
            let prefixedName = buildMcpToolName(mcpClient.name, tool.name);

            return {
                // Base tool properties
                ...baseToolProperties,

                // Name with mcp__ prefix (unless skipPrefix is true)
                name: skipPrefix ? tool.name : prefixedName,

                // MCP metadata for routing
                mcpInfo: {
                    serverName: mcpClient.name,
                    toolName: tool.name
                },
                isMcp: true,

                // Dynamic properties from MCP schema
                async description() { return tool.description ?? "" },
                inputJSONSchema: tool.inputSchema,

                // Annotation-based properties
                isConcurrencySafe() { return tool.annotations?.readOnlyHint ?? false },
                isReadOnly() { return tool.annotations?.readOnlyHint ?? false },
                isDestructive() { return tool.annotations?.destructiveHint ?? false },
                isOpenWorld() { return tool.annotations?.openWorldHint ?? false },
            };
        });
    } catch { return []; }
}

// Mapping: JE→fetchMcpTools, A→mcpClient, q→response, K→tools, Y→skipPrefix,
//          z→tool, _→prefixedName, $58→buildMcpToolName, tZq→baseToolProperties,
//          $y6→ToolListResultSchema, Ws→ensureArray, t6→isTruthy
```

**Tool naming convention:**
- MCP tools are prefixed with `mcp__<serverName>__<toolName>` (e.g., `mcp__sqlite__query`)
- This prevents name collisions between MCP servers and built-in tools
- SDK mode can disable prefixing via `CLAUDE_AGENT_SDK_MCP_NO_PREFIX` environment variable

**Why this approach:**
- Dynamic discovery allows MCP servers to be added/removed without restarting Claude Code
- Tool schemas are fetched from the MCP server at runtime, ensuring they're always up-to-date
- The `mcpInfo` property enables routing tool calls back to the correct MCP server

---

## 2. Integration with 04_system_reminder

### MCP Context Injection

**What it does:** MCP server/tool information is included in system reminders so the model has context about available tools.

**Integration flow:**
```
MCP Client Connects
    │
    ▼
App State: mcpClients updated
    │
    ▼
onChangeAppStateHandler fires
    │
    ▼
updateMcpSessionState writes to:
~/.claude/claude-code-mcp-cli/{sessionId}.json
    │
    ▼
mcp-cli info reads from this file
    │
    ▼
Tool discovery available to model
```

### Session State File Schema

```json
{
  "clients": [
    {
      "name": "sqlite",
      "type": "stdio",
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "~/data.db"],
      "status": "connected"
    }
  ],
  "tools": [
    {
      "name": "mcp__sqlite__query",
      "serverName": "sqlite",
      "originalToolName": "query",
      "description": "Execute a SQL query",
      "inputSchema": { "type": "object", "properties": { "sql": { "type": "string" } } },
      "isMcp": true
    }
  ],
  "resources": {
    "sqlite": [
      { "uri": "sqlite:///schema", "name": "Database Schema", "mimeType": "text/plain" }
    ]
  }
}
```

**Why this design:** The session file allows `mcp-cli` (a child process) to discover tools without direct access to the parent's memory. File-based IPC decouples the processes.

---

## 3. Integration with 05_tools (Bash Tool)

### Command Interception

**What it does:** The Bash tool intercepts `mcp-cli` commands and routes them through the MCP protocol instead of executing them as real shell commands.

**How it works:**

```javascript
// ============================================
// parseMcpCliCommand - Detect and parse mcp-cli commands
// Location: chunks.174.mjs:2627-2640
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
function parseMcpCliCommand(bashCommand) {
    // Regex matches: mcp-cli <call|read> <server>/<tool> [args]
    const match = bashCommand.match(
        /^mcp-cli\s+(call|read)\s+([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(?:\s+([\s\S]+))?$/
    );
    if (!match) return null;

    const [, action, serverName, toolName, rawArgs = ""] = match;
    if (!action || !serverName || !toolName) return null;

    return {
        command: action,      // "call" or "read"
        server: serverName,
        tool: toolName,
        toolName: toolName,
        args: rawArgs,        // JSON arguments as string
        fullCommand: bashCommand
    };
}

// Mapping: ce→parseMcpCliCommand, A→bashCommand, q→match, K→action, Y→serverName, z→toolName, w→rawArgs
```

### Execution Flow

```
Bash tool receives: "mcp-cli call sqlite/query '{\"sql\": \"SELECT 1\"}'"
    │
    ▼
parseMcpCliCommand() matches → returns parsed object
    │
    ▼
processMcpCliResult() called
    │
    ▼
callMcpServer() sends JSON-RPC to MCP server
    │
    ▼
MCP server executes tool
    │
    ▼
Result formatted and returned as "stdout"
```

**Why not expose MCP tools as top-level tools:**
- Context efficiency: Top-level tool schemas are limited
- `mcp-cli` allows access to unlimited MCP tools
- Dynamic discovery: Tools can be added/removed without restarting

---

## 4. Integration with 11_hooks

### Elicitation Hooks

**What it does:** Hook scripts can intercept and modify MCP elicitation requests before the user sees them.

**Hook events:**

| Event | When | Can Modify |
|-------|------|------------|
| `Elicitation` | Before dialog shown | Yes (params) |
| `ElicitationResult` | After user responds | No (observe only) |

**Elicitation Hook Payload:**
```json
{
  "event": "Elicitation",
  "serverName": "my-mcp-server",
  "params": {
    "mode": "form",
    "message": "Please provide your API credentials",
    "requestedSchema": { ... }
  }
}
```

**Hook can return:**
- `null` / `undefined` → Continue with normal elicitation
- `{ action: "accept", content: {...} }` → Resolve without showing dialog
- `{ action: "decline" }` → Decline without showing dialog

### Implementation in setupElicitationRequestHandler

```javascript
// Location: chunks.58.mjs:11-16 (inside WT7)
let hookResult = await sx6(serverName, request.params, context.signal);
if (hookResult) {
    logMcp(serverName, `Elicitation resolved by hook`);
    trackEvent("tengu_mcp_elicitation_response", { mode, action: hookResult.action });
    return hookResult;  // Skip dialog entirely
}
```

---

## 5. Integration with 18_sandbox

### Sandbox Bypass for mcp-cli

**What it does:** `mcp-cli` commands must run outside the sandbox because they need to communicate with the parent process's MCP connections.

**How it works:**
The `getSandboxSystemPromptBlock` (nBY) function injects an explicit exception:

```javascript
// ============================================
// getSandboxSystemPromptBlock - Sandbox instructions with mcp-cli exception
// Location: chunks.149.mjs:1935
// ============================================

// READABLE excerpt:
let mcpCliException = isMcpCliEnabled() ?
    "    - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true`\n" : "";

let instructions = `
  - CRITICAL: Commands run in sandbox mode by default
${mcpCliException}
    - Set \`dangerouslyDisableSandbox: true\` if:
      1. The user *explicitly* asks to bypass sandbox, OR
      2. A command just failed due to sandbox restrictions
`;
```

**Why this exception:**
- `mcp-cli` doesn't execute real commands - it routes through MCP protocol
- The parent process handles the actual tool execution with proper sandboxing
- Intercepted `mcp-cli` commands use internal bridges, not external processes

---

## 6. Integration with 22_ide_integration

### IDE as MCP Client

**What it does:** IDE extensions connect as MCP clients, exposing tools like `openDiff`, `getDiagnostics`, `openFile`.

**Integration flow:**
```
IDE Extension starts
    │
    ▼
MCP server started on localhost:PORT
    │
    ▼
Claude Code connects as MCP client
    │
    ▼
IDE tools registered with prefix: mcp__ide__<tool>
    │
    ▼
Tools available via mcp-cli and direct calls
```

### IDE Tool Examples

| Tool | Purpose | Called By |
|------|---------|-----------|
| `openDiff` | Show diff preview | Edit tool for diffs |
| `getDiagnostics` | Get LSP errors | System reminder attachments |
| `openFile` | Open file in editor | User request |
| `setPermissionMode` | Update permission mode | Permission mode sync |

### findConnectedIdeClient

```javascript
// ============================================
// findConnectedIdeClient - Locate connected IDE MCP client
// Location: chunks.145.mjs (approx)
// ============================================

// READABLE (for understanding):
function findConnectedIdeClient(mcpClients) {
    return mcpClients?.find(client =>
        client.name === "ide" && client.type === "connected"
    );
}
```

---

## 7. Integration with 37_permission_policy

### Permission Checks for MCP Tools

**What it does:** MCP tool calls go through the same permission system as built-in tools.

**Permission flow:**
```
Model calls mcp-cli call server/tool
    │
    ▼
Bash tool permission check
    │
    ├─ Sandbox enabled? → Auto-allow (mcp-cli exception)
    │
    └─ Sandbox disabled? → Check permission rules
           │
           ▼
       Domain-based rules for network MCP servers
```

### Domain-Based Permissions

```json
// settings.json
{
  "permissions": {
    "allow": ["WebFetch(domain:api.github.com)"],
    "deny": ["WebFetch(domain:internal.company.com)"]
  }
}
```

MCP servers that make network calls respect these domain rules.

---

## 8. Integration with 27_lsp_integration

### Shared Diagnostics Infrastructure

**What it does:** IDE MCP tools can provide diagnostics that complement or override LSP diagnostics.

**Integration:**
- IDE `getDiagnostics` tool returns LSP diagnostics from the IDE's language server
- DiagnosticsManager (Gb/Nl) in `chunks.170.mjs` manages baseline/delta
- System reminder attachments include both IDE and LSP diagnostics

---

## 9. Integration with 04_system_reminder (Detailed)

### MCP Context Attachments

**What it does:** MCP server/tool information is attached to the system context so the model understands what's available.

**Attachment types produced:**

| Type | Trigger | Content |
|------|---------|---------|
| `mcp_resource` | @-mention of MCP resource | Resource content from MCP server |
| `elicitation` | MCP server requests input | Form/URL for user response |
| `elicitation_result` | User completes elicitation | Result from elicitation |

### MCP Instructions in System Prompt

The system prompt builder includes MCP instructions when MCP clients are connected:

```javascript
// ============================================
// MCP Instructions Injection (in system prompt builder)
// Location: chunks.169.mjs (approx)
// ============================================

// READABLE (for understanding):
function buildMcpSystemInstructions(mcpClients) {
    if (!mcpClients || mcpClients.length === 0) return "";

    let serverNames = mcpClients
        .filter(c => c.type === "connected")
        .map(c => c.name);

    if (serverNames.length === 0) return "";

    return `
## MCP Tools

You have access to ${serverNames.length} MCP servers: ${serverNames.join(", ")}

MANDATORY WORKFLOW:
1. ALWAYS call: mcp-cli info <server>/<tool>
   BEFORE calling: mcp-cli call <server>/<tool> {...}

This is a BLOCKING REQUIREMENT. Skipping info causes incorrect parameters.
`;
}
```

### Session State File Schema

The session state is persisted for `mcp-cli info` discovery:

```json
// ~/.claude/claude-code-mcp-cli/{sessionId}.json
{
  "clients": [
    {
      "name": "sqlite",
      "type": "connected",
      "capabilities": { "tools": true, "resources": true }
    }
  ],
  "tools": [
    {
      "name": "mcp__sqlite__query",
      "serverName": "sqlite",
      "description": "Execute SQL query",
      "inputSchema": { "type": "object", "properties": { "sql": { "type": "string" } } }
    }
  ],
  "resources": {
    "sqlite": [
      { "uri": "sqlite:///schema", "name": "Database Schema" }
    ]
  }
}
```

### Elicitation System Reminder Flow

```
MCP Server calls: elicitation/create
    │
    ▼
WT7 (setupElicitationRequestHandler) receives request
    │
    ├─► sx6 (runElicitationHook) fires
    │       │
    │       └─► Hook returns result → Use result (skip UI)
    │
    └─► No hook result → Add to elicitation.queue
            │
            ▼
        UI renders ElicitationDialog (ZIq)
            │
            ▼
        User responds
            │
            ▼
        tx6 (runElicitationResultHook) fires
            │
            ▼
        Response sent to MCP server
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Complete MCP Data Flow                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM (Claude)                                                               │
│       │                                                                      │
│       │ system prompt contains: mcp-cli instructions                        │
│       │ tool call: Bash("mcp-cli call server/tool '{...}'")                 │
│       ▼                                                                      │
│  Bash Tool                                                                  │
│       │                                                                      │
│       │ parseMcpCliCommand() → matches pattern                              │
│       │ dangerouslyDisableSandbox: true (mcp-cli exception)                 │
│       ▼                                                                      │
│  processMcpCliResult()                                                      │
│       │                                                                      │
│       │ callMcpServer() → JSON-RPC to MCP server                            │
│       ▼                                                                      │
│  MCP Server (e.g., sqlite, github)                                          │
│       │                                                                      │
│       │ Execute tool locally or via API                                     │
│       │ May call elicitation/create for user input                          │
│       ▼                                                                      │
│  Elicitation (if needed)                                                    │
│       │                                                                      │
│       │ Elicitation hook fires (sx6)                                        │
│       │ UI renders dialog                                                   │
│       │ User responds                                                       │
│       │ ElicitationResult hook fires (tx6)                                  │
│       ▼                                                                      │
│  Response Formatted                                                         │
│       │                                                                      │
│       │ Large output → saved to temp file                                   │
│       │ Normal output → returned as stdout                                  │
│       ▼                                                                      │
│  LLM receives result                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Integration Points Summary

| Module | Integration | Key Symbol |
|--------|-------------|------------|
| 03_llm_core | System prompt injection | FOq (buildMcpCliInstructions) |
| 04_system_reminder | Tool discovery context | Session state file |
| 05_tools | Bash command interception | ce (parseMcpCliCommand) |
| 11_hooks | Elicitation hooks | sx6 (runElicitationHook) |
| 18_sandbox | mcp-cli exception | nBY (getSandboxSystemPromptBlock) |
| 22_ide_integration | IDE as MCP client | findConnectedIdeClient |
| 27_lsp_integration | Shared diagnostics | Gb (DiagnosticsManager) |
| 37_permission_policy | Domain-based rules | Permission rules |

---

## 10. Unified Cross-Module Integration: MCP ↔ Sandbox ↔ IDE

### The Trinity: Three Systems, One Context Pipeline

The three infrastructure modules (MCP, Sandbox, IDE Integration) form a cohesive context injection system that enriches the LLM's understanding through the 04_system_reminder pipeline.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UNIFIED CONTEXT INJECTION PIPELINE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MCP (06_mcp)                            Sandbox (18_sandbox)               │
│  ┌──────────────────────────┐           ┌──────────────────────────┐        │
│  │ mcp_resources attachment │           │ Bash system prompt block │        │
│  │ (SuY producer)           │           │ (E9z function)           │        │
│  │                          │           │                          │        │
│  │ • @server:uri mentions   │           │ • Restrictions JSON      │        │
│  │ • Tool discovery context │           │ • mcp-cli exception      │        │
│  │ • Resource content       │           │ • Override instructions  │        │
│  └─────────────┬────────────┘           └─────────────┬────────────┘        │
│                │                                      │                      │
│                │         IDE Integration              │                      │
│                │    (22_ide_integration)              │                      │
│                │    ┌──────────────────────────┐      │                      │
│                │    │ Selection/diagnostics    │      │                      │
│                │    │ attachments              │      │                      │
│                │    │                          │      │                      │
│                │    │ • kuY: ide_selection     │      │                      │
│                │    │ • cuY: diagnostics       │      │                      │
│                │    │ • Nl: DiagnosticsManager │      │                      │
│                │    └─────────────┬────────────┘      │                      │
│                │                  │                   │                      │
│                ▼                  ▼                   ▼                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │              04_system_reminder (Attachment Pipeline)                 │  │
│  │                                                                       │  │
│  │  assembleAllAttachments (_uY)                                         │  │
│  │       │                                                               │  │
│  │       ├─► User-dependent (Group 1):                                   │  │
│  │       │     • mcp_resources (SuY) ← MCP module                        │  │
│  │       │                                                               │  │
│  │       ├─► Always-computed (Group 2):                                  │  │
│  │       │     • (various other attachments)                             │  │
│  │       │                                                               │  │
│  │       └─► Main-agent-only (Group 3):                                  │  │
│  │             • ide_selection (kuY) ← IDE module                        │  │
│  │             • diagnostics (cuY) ← IDE module                          │  │
│  │                                                                       │  │
│  │  Bash tool system prompt (separate from attachments):                 │  │
│  │       • getSandboxSystemPromptBlock (E9z) ← Sandbox module            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    LLM receives enriched context                      │  │
│  │                                                                       │  │
│  │  "User has selected 15 lines in main.ts starting at line 42:          │  │
│  │   <selected code>                                                      │  │
│  │                                                                        │  │
│  │   MCP servers available: sqlite, github                                │  │
│  │   Sandbox restrictions: read=[cwd], write=[cwd], network=block        │  │
│  │   New diagnostics: 2 errors in main.ts after your edit"               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Integration Point 1: Sandbox Exception for MCP

The sandbox explicitly exempts `mcp-cli` commands because they don't execute real processes:

```javascript
// In getSandboxSystemPromptBlock (E9z):
let mcpCliException = isMcpCliEnabled() ?
    "    - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true`\n" : "";
```

**Why this exception exists:**
- `mcp-cli` commands are intercepted by the Bash tool and routed to MCP clients
- The actual execution happens in the parent process (for local MCP servers) or via network (for remote)
- The parent process applies its own sandboxing where appropriate
- Double-sandboxing would cause failures

### Integration Point 2: IDE Selection → MCP Client Detection

The IDE selection attachment detects the IDE name from the MCP client list:

```javascript
// In getIdeSelectionAttachment (kuY):
let ideName = detectIdeName(sessionContext.options.mcpClients);
// T$6 function finds client with name === "ide"
```

**Connection flow:**
1. IDE extension starts MCP server on localhost
2. Claude Code connects as MCP client
3. Client registered as `{ name: "ide", type: "connected", ... }`
4. Selection attachment uses this to show "VS Code", "Cursor", etc.

### Integration Point 3: DiagnosticsManager ↔ MCP ↔ IDE

The DiagnosticsManager uses the IDE MCP client to fetch diagnostics:

```javascript
// In DiagnosticsManager.getNewDiagnostics():
let result = await callMcpTool("getDiagnostics", {}, this.mcpClient);
// pC function calls the IDE MCP tool
```

**Data flow:**
```
IDE LSP Server
    │
    ▼
IDE Extension (MCP Server)
    │ getDiagnostics tool
    ▼
Claude Code MCP Client
    │
    ▼
DiagnosticsManager (Nl)
    │
    ├─► beforeFileEdited: capture baseline
    │
    └─► getNewDiagnostics: compute delta
           │
           ▼
       diagnostics attachment (cuY)
           │
           ▼
       System reminder injected
```

### Integration Point 4: All Three → Permission Decisions

When a Bash command is about to execute, all three systems influence permission decisions:

```javascript
// Permission decision flow (simplified):
async function checkBashPermission(toolInput) {
    // 1. Check sandbox status
    if (isSandboxingEnabled() && autoAllowBashIfSandboxed()) {
        if (isCommandSandboxed(toolInput)) {
            return "auto-allow";  // Sandbox protects the system
        }
    }

    // 2. Check if mcp-cli command (MCP module)
    let mcpCommand = parseMcpCliCommand(toolInput.command);
    if (mcpCommand) {
        // mcp-cli commands need dangerouslyDisableSandbox
        if (!toolInput.dangerouslyDisableSandbox) {
            return "require-sandbox-disable";
        }
        // Route to MCP permission check
        return checkMcpPermission(mcpCommand);
    }

    // 3. Check IDE context (if file operation detected)
    if (isFileOperation(toolInput.command)) {
        let ideStatus = getIdeConnectionStatus(mcpClients);
        if (ideStatus === "connected") {
            // May want to sync with IDE before executing
        }
    }

    // 4. Normal permission flow
    return checkNormalPermission(toolInput);
}
```

### Integration Point 5: System Reminder Attachments by Module

| Module | Attachment Type | Producer | Content |
|--------|-----------------|----------|---------|
| **MCP** | `mcp_resources` | `SuY` | Content from `@server:uri` mentions |
| **MCP** | (in system prompt) | `getMcpCliInstructions` | mcp-cli usage instructions |
| **Sandbox** | (in Bash prompt) | `E9z` | Sandbox restrictions JSON |
| **Sandbox** | (annotation) | `annotateStderrWithSandboxFailures` | Violations in command output |
| **IDE** | `selected_lines_in_ide` | `kuY` | User's text selection |
| **IDE** | `diagnostics` | `cuY` | New LSP diagnostics after edits |
| **IDE** | `opened_file_in_ide` | `LuY` | File user has open |

### Integration Point 6: Subagent Filtering

All three modules' attachments are filtered for subagents:

```javascript
// In assembleAllAttachments (_uY):
let mainAgentOnlyProducers = isMainAgent ? [
    // IDE integration attachments - only for main agent
    timedAttachmentProducer("ide_selection", ...),
    timedAttachmentProducer("diagnostics", ...),
    // Token usage - only relevant for main agent budget
    timedAttachmentProducer("token_usage", ...),
] : [];
```

**MCP in subagents:**
- Subagents CAN use MCP tools (tools are in tool set)
- Subagents DON'T get MCP context attachments
- MCP clients shared from parent process

**Sandbox in subagents:**
- Subagent Bash commands ARE sandboxed
- Same sandbox config as parent
- Violations reported to parent's SandboxViolationStore

**IDE in subagents:**
- Subagents DON'T receive IDE selection
- Subagents DON'T get diagnostics attachments
- Subagents CAN use IDE MCP tools if passed in tool set

---

## Related Documents

- [implementation.md](./implementation.md) - MCP implementation details
- [mcp_hub.md](./mcp_hub.md) - McpHub and MCPContext
- [elicitation_handler.md](./elicitation_handler.md) - Elicitation system
- [transport_layer.md](./transport_layer.md) - Transport implementations
- [../18_sandbox/cross_module_integration.md](../18_sandbox/cross_module_integration.md) - Sandbox integration
- [../22_ide_integration/cross_module_integration.md](../22_ide_integration/cross_module_integration.md) - IDE integration