# MCP CLI Commands

## Overview

Claude Code v2.1.7 provides a dedicated MCP (Model Context Protocol) CLI for interacting with MCP servers outside of the main interactive session. This CLI is accessed via `--mcp-cli` flag and provides commands for listing servers, tools, resources, and invoking tool calls.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `mcpCliProgram` (de) - MCP CLI Commander.js program
- `mcpCliHandler` (nX9) - MCP CLI entry handler
- `executeWithTelemetry` (vuA) - Telemetry wrapper for commands
- `parseToolIdentifier` (rP0) - Parse server/tool format
- `isRunningInEndpoint` (P$) - Check if running in endpoint mode
- `sendCommand` (w8A) - Send command to endpoint

---

## CLI Architecture

### Entry Point

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         claude --mcp-cli <command>                           │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         nX9() - mcpCliHandler                                │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      Connection Detection                             │   │
│  │  P$() → isRunningInEndpoint                                          │   │
│  │  - Checks for running Claude Code endpoint                            │   │
│  │  - Uses state file or socket connection                               │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                  │                                           │
│              ┌───────────────────┴───────────────────┐                      │
│              │                                       │                      │
│              ▼                                       ▼                      │
│     ┌─────────────────┐                    ┌─────────────────┐              │
│     │   Endpoint Mode │                    │ Standalone Mode │              │
│     │   (via socket)  │                    │ (direct init)   │              │
│     └────────┬────────┘                    └────────┬────────┘              │
│              │                                      │                       │
│              ▼                                      ▼                       │
│         w8A(command)                         me() → initMcp                │
│         sendCommand                          Direct execution               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Program Definition

```javascript
// ============================================
// mcpCliProgram - MCP CLI Commander.js program
// Location: cli.chunks.mjs:5055 (de program definition implied)
// ============================================

// The `de` program is defined earlier and registers commands:
// - servers  - List all connected MCP servers
// - tools    - List all available tools
// - info     - Get detailed information about a tool
// - call     - Invoke an MCP tool
// - grep     - Search tools by regex pattern
// - resources - List MCP resources
// - read     - Read an MCP resource
```

---

## Commands Reference

### 1. servers - List MCP Servers

**Usage:** `claude --mcp-cli servers [--json]`

**Description:** Lists all connected MCP servers with their status and capabilities.

**Options:**
- `--json` - Output in JSON format

```javascript
// ============================================
// serversCommand - List all connected MCP servers
// Location: cli.chunks.mjs:5055-5078
// ============================================

// ORIGINAL (for source lookup):
de.command("servers").description("List all connected MCP servers").option("--json", "Output in JSON format").action(async (A) => {
  let Q = await vuA("servers", async () => {
    return P$() ? await w8A(iP0, {
      command: "servers"
    }) : M$1(me().clients)
  }, (G) => ({
    server_count: G.length
  }));
  if (!Q.success) process.exit(1);
  let B = Q.data;
  if (A.json) console.log(eA(B));
  else B.forEach((G) => {
    let Z = G.type === "connected" ? I1.green("connected") : G.type === "failed" ? I1.red("failed") : I1.yellow(G.type),
      Y = "";
    if (G.type === "connected") {
      let J = [];
      if (G.hasTools) J.push("tools");
      if (G.hasResources) J.push("resources");
      if (G.hasPrompts) J.push("prompts");
      if (J.length > 0) Y = ` (${J.join(", ")})`
    }
    console.log(`${G.name} - ${Z}${Y}`)
  })
});

// READABLE (for understanding):
de.command("servers")
  .description("List all connected MCP servers")
  .option("--json", "Output in JSON format")
  .action(async (options) => {
    const result = await executeWithTelemetry("servers", async () => {
      return isRunningInEndpoint()
        ? await sendCommand(SERVERS_COMMAND, { command: "servers" })
        : formatServerList(getMcpState().clients);
    }, (data) => ({ server_count: data.length }));

    if (!result.success) process.exit(1);
    const servers = result.data;

    if (options.json) {
      console.log(JSON.stringify(servers));
    } else {
      servers.forEach((server) => {
        const status = server.type === "connected"
          ? chalk.green("connected")
          : server.type === "failed"
            ? chalk.red("failed")
            : chalk.yellow(server.type);

        let capabilities = "";
        if (server.type === "connected") {
          const caps = [];
          if (server.hasTools) caps.push("tools");
          if (server.hasResources) caps.push("resources");
          if (server.hasPrompts) caps.push("prompts");
          if (caps.length > 0) capabilities = ` (${caps.join(", ")})`;
        }
        console.log(`${server.name} - ${status}${capabilities}`);
      });
    }
  });

// Mapping: A→options, Q→result, B→servers, G→server, Z→status, Y→capabilities,
//          vuA→executeWithTelemetry, P$→isRunningInEndpoint, w8A→sendCommand,
//          iP0→SERVERS_COMMAND, M$1→formatServerList, me→getMcpState,
//          eA→JSON.stringify, I1→chalk
```

**Output Example (text):**
```
filesystem - connected (tools, resources)
database - connected (tools)
external-api - failed
```

**Output Example (JSON):**
```json
[
  {"name": "filesystem", "type": "connected", "hasTools": true, "hasResources": true, "hasPrompts": false},
  {"name": "database", "type": "connected", "hasTools": true, "hasResources": false, "hasPrompts": false},
  {"name": "external-api", "type": "failed", "error": "Connection refused"}
]
```

---

### 2. tools - List Available Tools

**Usage:** `claude --mcp-cli tools [server] [--json]`

**Description:** Lists all available MCP tools, optionally filtered by server.

**Arguments:**
- `[server]` - Optional server name to filter by

**Options:**
- `--json` - Output in JSON format

```javascript
// ============================================
// toolsCommand - List all available tools
// Location: cli.chunks.mjs:5083-5101
// ============================================

// ORIGINAL (for source lookup):
de.command("tools").description("List all available tools").argument("[server]", "Filter by server name").option("--json", "Output in JSON format").action(async (A, Q) => {
  let B = {
      server: A
    },
    G = await vuA("tools", async () => {
      return P$() ? await w8A(nP0, {
        command: "tools",
        params: B
      }) : R$1(me().tools, B)
    }, (Y) => ({
      tool_count: Y.length,
      filtered: !!A
    }));
  if (!G.success) process.exit(1);
  let Z = G.data;
  if (Q.json) console.log(eA(Z));
  else if (A) Z.forEach((Y) => console.log(Y.name));
  else Z.forEach((Y) => console.log(`${Y.server}/${Y.name}`))
});

// READABLE (for understanding):
de.command("tools")
  .description("List all available tools")
  .argument("[server]", "Filter by server name")
  .option("--json", "Output in JSON format")
  .action(async (serverFilter, options) => {
    const params = { server: serverFilter };

    const result = await executeWithTelemetry("tools", async () => {
      return isRunningInEndpoint()
        ? await sendCommand(TOOLS_COMMAND, { command: "tools", params })
        : filterTools(getMcpState().tools, params);
    }, (data) => ({
      tool_count: data.length,
      filtered: !!serverFilter
    }));

    if (!result.success) process.exit(1);
    const tools = result.data;

    if (options.json) {
      console.log(JSON.stringify(tools));
    } else if (serverFilter) {
      // Show only tool names when filtered by server
      tools.forEach((tool) => console.log(tool.name));
    } else {
      // Show full server/tool path
      tools.forEach((tool) => console.log(`${tool.server}/${tool.name}`));
    }
  });

// Mapping: A→serverFilter, Q→options, B→params, G→result, Z→tools,
//          nP0→TOOLS_COMMAND, R$1→filterTools
```

**Output Example (text):**
```
filesystem/read_file
filesystem/write_file
filesystem/list_directory
database/query
database/execute
```

---

### 3. info - Get Tool Information

**Usage:** `claude --mcp-cli info <tool> [--json]`

**Description:** Gets detailed information about a specific MCP tool including its input schema.

**Arguments:**
- `<tool>` - Tool identifier in format `<server>/<tool>`

**Options:**
- `--json` - Output in JSON format

```javascript
// ============================================
// infoCommand - Get detailed information about a tool
// Location: cli.chunks.mjs:5106-5140
// ============================================

// ORIGINAL (for source lookup):
de.command("info").description("Get detailed information about a tool").argument("<tool>", "Tool identifier in format <server>/<tool>").option("--json", "Output in JSON format").action(async (A, Q) => {
  let B = await vuA("info", async () => {
    let {
      server: Z,
      tool: Y
    } = rP0(A), J = {
      server: Z,
      toolName: Y
    };
    if (P$()) return await w8A(gX9, {
      command: "info",
      params: J
    });
    let X = me(),
      I = await _$1(X.tools, J);
    if (!I) {
      let D = xuA(X.clients, Z, X.normalizedNames),
        W = N8A(Z, D?.type);
      if (W) throw W;
      throw Error(`Tool '${Y}' not found on server '${Z}'`)
    }
    return I
  }, () => ({
    tool_found: !0
  }), {
    tool_found: !1
  });
  if (!B.success) process.exit(1);
  let G = B.data;
  if (Q.json) console.log(eA(G));
  else {
    if (console.log(I1.bold(`Tool: ${A}`)), console.log(I1.dim(`Server: ${G.server}`)), G.description) console.log(I1.dim(`Description: ${G.description}`));
    console.log(), console.log(I1.bold("Input Schema:")), console.log(eA(G.inputSchema, null, 2))
  }
});

// READABLE (for understanding):
de.command("info")
  .description("Get detailed information about a tool")
  .argument("<tool>", "Tool identifier in format <server>/<tool>")
  .option("--json", "Output in JSON format")
  .action(async (toolIdentifier, options) => {
    const result = await executeWithTelemetry("info", async () => {
      const { server, tool } = parseToolIdentifier(toolIdentifier);
      const params = { server, toolName: tool };

      if (isRunningInEndpoint()) {
        return await sendCommand(INFO_COMMAND, { command: "info", params });
      }

      const state = getMcpState();
      const toolInfo = await findTool(state.tools, params);

      if (!toolInfo) {
        const client = findClient(state.clients, server, state.normalizedNames);
        const serverError = getServerError(server, client?.type);
        if (serverError) throw serverError;
        throw Error(`Tool '${tool}' not found on server '${server}'`);
      }
      return toolInfo;
    }, () => ({ tool_found: true }), { tool_found: false });

    if (!result.success) process.exit(1);
    const toolData = result.data;

    if (options.json) {
      console.log(JSON.stringify(toolData));
    } else {
      console.log(chalk.bold(`Tool: ${toolIdentifier}`));
      console.log(chalk.dim(`Server: ${toolData.server}`));
      if (toolData.description) {
        console.log(chalk.dim(`Description: ${toolData.description}`));
      }
      console.log();
      console.log(chalk.bold("Input Schema:"));
      console.log(JSON.stringify(toolData.inputSchema, null, 2));
    }
  });

// Mapping: A→toolIdentifier, Q→options, B→result, G→toolData,
//          rP0→parseToolIdentifier, gX9→INFO_COMMAND, _$1→findTool,
//          xuA→findClient, N8A→getServerError
```

**Output Example (text):**
```
Tool: filesystem/read_file
Server: filesystem
Description: Read the contents of a file

Input Schema:
{
  "type": "object",
  "properties": {
    "path": {
      "type": "string",
      "description": "Path to the file to read"
    }
  },
  "required": ["path"]
}
```

---

### 4. call - Invoke MCP Tool

**Usage:** `claude --mcp-cli call <tool> <args> [--json] [--timeout <ms>] [--debug]`

**Description:** Invokes an MCP tool with the specified arguments.

**Arguments:**
- `<tool>` - Tool identifier in format `<server>/<tool>`
- `<args>` - Tool arguments as JSON string or "-" for stdin

**Options:**
- `--json` - Output in JSON format
- `--timeout <ms>` - Timeout in milliseconds (default: MCP_TOOL_TIMEOUT env var or effectively infinite)
- `--debug` - Show debug output

```javascript
// ============================================
// callCommand - Invoke an MCP tool
// Location: cli.chunks.mjs:5145-5204
// ============================================

// ORIGINAL (for source lookup):
de.command("call").description("Invoke an MCP tool").argument("<tool>", "Tool identifier in format <server>/<tool>").argument("<args>", 'Tool arguments as JSON string or "-" for stdin').option("--json", "Output in JSON format").option("--timeout <ms>", "Timeout in milliseconds (default: MCP_TOOL_TIMEOUT env var or effectively infinite)").option("--debug", "Show debug output").action(async (A, Q, B) => {
  let {
    server: G,
    tool: Z
  } = rP0(A);
  if (Q === "-") {
    let I = [];
    for await (let D of process.stdin) I.push(D);
    Q = Buffer.concat(I).toString("utf-8").trim()
  }
  let Y;
  try {
    Y = AQ(Q)
  } catch (I) {
    console.error(I1.red("Error: Invalid JSON arguments")), console.error(String(I)), process.exit(1)
  }
  let J = `mcp__${e3(G)}__${e3(Z)}`,
    X = Date.now();
  try {
    let I = parseInt(B.timeout || "", 10) || U3A(),
      D = {
        server: G,
        tool: Z,
        args: Y,
        timeoutMs: I
      },
      W = P$() ? await w8A(iC, {
        command: "call",
        params: D
      }, I) : await qU7(Z, G, Y, B),
      K = B.json ? eA(W) : typeof W === "string" ? W : eA(W, null, 2);
    if (await new Promise((V) => {
        process.stdout.write(K + `\n`, () => V())
      }), !P$()) await kl("tengu_mcp_cli_command_executed", {
      command: "call",
      tool_name: k9(J),
      success: !0,
      duration_ms: Date.now() - X
    });
    process.exit(0)
  } catch (I) {
    console.error(I1.red("Error calling tool:"), String(I));
    let D = Date.now() - X,
      W = String(I).slice(0, 2000);
    if (!P$()) await kl("tengu_tool_use_error", {
      toolName: k9(J),
      isMcp: !0,
      error: W,
      durationMs: D
    }), await kl("tengu_mcp_cli_command_executed", {
      command: "call",
      tool_name: k9(J),
      success: !1,
      error_type: I instanceof yuA ? "connection_failed" : "tool_execution_failed",
      duration_ms: Date.now() - X
    });
    process.exit(1)
  }
});

// READABLE (for understanding):
de.command("call")
  .description("Invoke an MCP tool")
  .argument("<tool>", "Tool identifier in format <server>/<tool>")
  .argument("<args>", 'Tool arguments as JSON string or "-" for stdin')
  .option("--json", "Output in JSON format")
  .option("--timeout <ms>", "Timeout in milliseconds")
  .option("--debug", "Show debug output")
  .action(async (toolIdentifier, argsInput, options) => {
    const { server, tool } = parseToolIdentifier(toolIdentifier);

    // Handle stdin input
    if (argsInput === "-") {
      const chunks = [];
      for await (const chunk of process.stdin) {
        chunks.push(chunk);
      }
      argsInput = Buffer.concat(chunks).toString("utf-8").trim();
    }

    // Parse JSON arguments
    let args;
    try {
      args = JSON.parse(argsInput);
    } catch (error) {
      console.error(chalk.red("Error: Invalid JSON arguments"));
      console.error(String(error));
      process.exit(1);
    }

    const toolName = `mcp__${normalizeServerName(server)}__${normalizeToolName(tool)}`;
    const startTime = Date.now();

    try {
      const timeout = parseInt(options.timeout || "", 10) || getDefaultTimeout();
      const params = { server, tool, args, timeoutMs: timeout };

      const result = isRunningInEndpoint()
        ? await sendCommand(CALL_COMMAND, { command: "call", params }, timeout)
        : await executeToolDirectly(tool, server, args, options);

      const output = options.json
        ? JSON.stringify(result)
        : typeof result === "string"
          ? result
          : JSON.stringify(result, null, 2);

      await new Promise((resolve) => {
        process.stdout.write(output + "\n", () => resolve());
      });

      if (!isRunningInEndpoint()) {
        await trackTelemetry("tengu_mcp_cli_command_executed", {
          command: "call",
          tool_name: hashToolName(toolName),
          success: true,
          duration_ms: Date.now() - startTime
        });
      }
      process.exit(0);
    } catch (error) {
      console.error(chalk.red("Error calling tool:"), String(error));
      // ... telemetry tracking for errors ...
      process.exit(1);
    }
  });

// Mapping: A→toolIdentifier, Q→argsInput, B→options, G→server, Z→tool,
//          Y→args, J→toolName, X→startTime, AQ→JSON.parse, e3→normalize,
//          U3A→getDefaultTimeout, iC→CALL_COMMAND, qU7→executeToolDirectly,
//          kl→trackTelemetry, k9→hashToolName, yuA→ConnectionError
```

**Usage Examples:**
```bash
# Call with inline JSON
claude --mcp-cli call filesystem/read_file '{"path": "/tmp/test.txt"}'

# Call with stdin
echo '{"path": "/tmp/test.txt"}' | claude --mcp-cli call filesystem/read_file -

# Call with timeout
claude --mcp-cli call slow-server/process '{"data": "test"}' --timeout 30000

# Call with JSON output
claude --mcp-cli call database/query '{"sql": "SELECT * FROM users"}' --json
```

---

### 5. grep - Search Tools

**Usage:** `claude --mcp-cli grep <pattern> [--json] [-i]`

**Description:** Search tool names and descriptions using regex patterns.

**Arguments:**
- `<pattern>` - Regex pattern to search for

**Options:**
- `--json` - Output in JSON format
- `-i, --ignore-case` - Case insensitive search (default: true)

```javascript
// ============================================
// grepCommand - Search tools by regex pattern
// Location: cli.chunks.mjs:5209-5238
// ============================================

// ORIGINAL (for source lookup):
de.command("grep").description("Search tool names and descriptions using regex patterns").argument("<pattern>", "Regex pattern to search for").option("--json", "Output in JSON format").option("-i, --ignore-case", "Case insensitive search (default: true)", !0).action(async (A, Q) => {
  let B = await vuA("grep", async () => {
    try {
      new RegExp(A, Q.ignoreCase ? "i" : "")
    } catch (Y) {
      throw Error(`Invalid regex pattern: ${Y instanceof Error?Y.message:String(Y)}`)
    }
    let Z = {
      pattern: A,
      ignoreCase: Q.ignoreCase
    };
    return P$() ? await w8A(uX9, {
      command: "grep",
      params: Z
    }) : j$1(me().tools, Z)
  }, (Z) => ({
    match_count: Z.length
  }));
  if (!B.success) process.exit(1);
  let G = B.data;
  if (Q.json) console.log(eA(G));
  else if (G.length === 0) console.log(I1.yellow("No tools found matching pattern"));
  else G.forEach((Z) => {
    if (console.log(I1.bold(`${Z.server}/${Z.name}`)), Z.description) {
      let Y = Z.description.length > 100 ? Z.description.slice(0, 100) + "..." : Z.description;
      console.log(I1.dim(`  ${Y}`))
    }
    console.log()
  })
});

// READABLE (for understanding):
de.command("grep")
  .description("Search tool names and descriptions using regex patterns")
  .argument("<pattern>", "Regex pattern to search for")
  .option("--json", "Output in JSON format")
  .option("-i, --ignore-case", "Case insensitive search (default: true)", true)
  .action(async (pattern, options) => {
    const result = await executeWithTelemetry("grep", async () => {
      // Validate regex pattern
      try {
        new RegExp(pattern, options.ignoreCase ? "i" : "");
      } catch (error) {
        throw Error(`Invalid regex pattern: ${error instanceof Error ? error.message : String(error)}`);
      }

      const params = { pattern, ignoreCase: options.ignoreCase };

      return isRunningInEndpoint()
        ? await sendCommand(GREP_COMMAND, { command: "grep", params })
        : searchTools(getMcpState().tools, params);
    }, (data) => ({ match_count: data.length }));

    if (!result.success) process.exit(1);
    const matches = result.data;

    if (options.json) {
      console.log(JSON.stringify(matches));
    } else if (matches.length === 0) {
      console.log(chalk.yellow("No tools found matching pattern"));
    } else {
      matches.forEach((tool) => {
        console.log(chalk.bold(`${tool.server}/${tool.name}`));
        if (tool.description) {
          const desc = tool.description.length > 100
            ? tool.description.slice(0, 100) + "..."
            : tool.description;
          console.log(chalk.dim(`  ${desc}`));
        }
        console.log();
      });
    }
  });

// Mapping: A→pattern, Q→options, B→result, G→matches, uX9→GREP_COMMAND, j$1→searchTools
```

**Output Example:**
```
filesystem/read_file
  Read the contents of a file at the specified path

filesystem/write_file
  Write content to a file at the specified path

database/read_query
  Execute a read-only SQL query...
```

---

### 6. resources - List MCP Resources

**Usage:** `claude --mcp-cli resources [server] [--json]`

**Description:** Lists MCP resources, optionally filtered by server.

**Arguments:**
- `[server]` - Optional server name to filter by

**Options:**
- `--json` - Output in JSON format

```javascript
// ============================================
// resourcesCommand - List MCP resources
// Location: cli.chunks.mjs:5243-5266
// ============================================

// ORIGINAL (for source lookup):
de.command("resources").description("List MCP resources").argument("[server]", "Filter by server name").option("--json", "Output in JSON format").action(async (A, Q) => {
  let B = {
      server: A
    },
    G = await vuA("resources", async () => {
      if (P$()) return await w8A(mX9, {
        command: "resources",
        params: B
      });
      else {
        let Y = me();
        return T$1(Y.resources, B, Y.normalizedNames)
      }
    }, (Y) => ({
      resource_count: Y.length,
      filtered: !!A
    }));
  if (!G.success) process.exit(1);
  let Z = G.data;
  if (Q.json) console.log(eA(Z));
  else Z.forEach((Y) => {
    console.log(`${Y.server}/${Y.name||Y.uri}`)
  })
});

// READABLE (for understanding):
de.command("resources")
  .description("List MCP resources")
  .argument("[server]", "Filter by server name")
  .option("--json", "Output in JSON format")
  .action(async (serverFilter, options) => {
    const params = { server: serverFilter };

    const result = await executeWithTelemetry("resources", async () => {
      if (isRunningInEndpoint()) {
        return await sendCommand(RESOURCES_COMMAND, { command: "resources", params });
      } else {
        const state = getMcpState();
        return filterResources(state.resources, params, state.normalizedNames);
      }
    }, (data) => ({
      resource_count: data.length,
      filtered: !!serverFilter
    }));

    if (!result.success) process.exit(1);
    const resources = result.data;

    if (options.json) {
      console.log(JSON.stringify(resources));
    } else {
      resources.forEach((resource) => {
        console.log(`${resource.server}/${resource.name || resource.uri}`);
      });
    }
  });

// Mapping: A→serverFilter, Q→options, B→params, G→result, Z→resources,
//          mX9→RESOURCES_COMMAND, T$1→filterResources
```

---

### 7. read - Read MCP Resource

**Usage:** `claude --mcp-cli read <resource> [uri] [--json] [--timeout <ms>] [--debug]`

**Description:** Reads the contents of an MCP resource.

**Arguments:**
- `<resource>` - Resource identifier in format `<server>/<resource>` or `<server>` when using uri
- `[uri]` - Optional direct resource URI (file://, https://, etc.)

**Options:**
- `--json` - Output in JSON format
- `--timeout <ms>` - Timeout in milliseconds
- `--debug` - Show debug output

```javascript
// ============================================
// readCommand - Read an MCP resource
// Location: cli.chunks.mjs:5271-5326
// ============================================

// ORIGINAL (for source lookup):
de.command("read").description("Read an MCP resource").argument("<resource>", "Resource identifier in format <server>/<resource> or <server> <uri>").argument("[uri]", "Optional: Direct resource URI (file://, https://, etc.)").option("--json", "Output in JSON format").option("--timeout <ms>", "Timeout in milliseconds (default: MCP_TOOL_TIMEOUT env var or effectively infinite)").option("--debug", "Show debug output").action(async (A, Q, B) => {
  let G, Z, Y;
  if (Q) G = A, Y = Q;  // server + direct URI
  else {
    let I = rP0(A);     // server/resource format
    G = I.server, Z = I.tool
  }
  let J;
  if (Y) {
    if (J = Y, B.debug) console.log(`Using direct URI: ${J}`)
  } else {
    let I = me(),
      W = UU7(I, G).find((K) => K.name === Z || K.uri === Z);
    if (!W) console.error(I1.red(`Error: Resource '${Z}' not found on server '${G}'`)), process.exit(1);
    J = W.uri
  }
  let X = Date.now();
  try {
    let I = parseInt(B.timeout || "", 10) || U3A(),
      D = {
        server: G,
        uri: J,
        timeoutMs: I
      },
      W = P$() ? await w8A(i9A, {
        command: "read",
        params: D
      }, I) : await NU7(G, J, B);
    if (B.json) console.log(eA(W));
    else if (W.contents && Array.isArray(W.contents)) W.contents.forEach((K) => {
      if (K && typeof K === "object") {
        if ("text" in K) console.log(K.text);
        else if ("blob" in K) {
          console.log(I1.yellow("[Binary blob content]"));
          let V = "mimeType" in K ? K.mimeType : void 0;
          console.log(I1.dim(`MIME type: ${V||"unknown"}`))
        }
      }
    });
    else console.log(eA(W, null, 2));
    if (!P$()) await kl("tengu_mcp_cli_command_executed", {
      command: "read",
      success: !0,
      duration_ms: Date.now() - X
    });
    process.exit(0)
  } catch (I) {
    if (console.error(I1.red("Error reading resource:"), String(I)), !P$()) await kl("tengu_mcp_cli_command_executed", {
      command: "read",
      success: !1,
      error_type: I instanceof yuA ? "connection_failed" : "read_failed",
      duration_ms: Date.now() - X
    });
    process.exit(1)
  }
});

// READABLE (for understanding):
de.command("read")
  .description("Read an MCP resource")
  .argument("<resource>", "Resource identifier in format <server>/<resource> or <server> <uri>")
  .argument("[uri]", "Optional: Direct resource URI (file://, https://, etc.)")
  .option("--json", "Output in JSON format")
  .option("--timeout <ms>", "Timeout in milliseconds")
  .option("--debug", "Show debug output")
  .action(async (resourceArg, uriArg, options) => {
    let server, resourceName, uri;

    // Parse arguments - two modes:
    // 1. server/resource format
    // 2. server + direct URI
    if (uriArg) {
      server = resourceArg;
      uri = uriArg;
    } else {
      const parsed = parseToolIdentifier(resourceArg);
      server = parsed.server;
      resourceName = parsed.tool;
    }

    // Resolve URI if not directly provided
    let resolvedUri;
    if (uri) {
      resolvedUri = uri;
      if (options.debug) console.log(`Using direct URI: ${resolvedUri}`);
    } else {
      const state = getMcpState();
      const resources = getServerResources(state, server);
      const resource = resources.find((r) => r.name === resourceName || r.uri === resourceName);

      if (!resource) {
        console.error(chalk.red(`Error: Resource '${resourceName}' not found on server '${server}'`));
        process.exit(1);
      }
      resolvedUri = resource.uri;
    }

    const startTime = Date.now();

    try {
      const timeout = parseInt(options.timeout || "", 10) || getDefaultTimeout();
      const params = { server, uri: resolvedUri, timeoutMs: timeout };

      const result = isRunningInEndpoint()
        ? await sendCommand(READ_COMMAND, { command: "read", params }, timeout)
        : await readResourceDirectly(server, resolvedUri, options);

      if (options.json) {
        console.log(JSON.stringify(result));
      } else if (result.contents && Array.isArray(result.contents)) {
        result.contents.forEach((content) => {
          if (content && typeof content === "object") {
            if ("text" in content) {
              console.log(content.text);
            } else if ("blob" in content) {
              console.log(chalk.yellow("[Binary blob content]"));
              const mimeType = "mimeType" in content ? content.mimeType : undefined;
              console.log(chalk.dim(`MIME type: ${mimeType || "unknown"}`));
            }
          }
        });
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
      process.exit(0);
    } catch (error) {
      console.error(chalk.red("Error reading resource:"), String(error));
      process.exit(1);
    }
  });

// Mapping: A→resourceArg, Q→uriArg, B→options, G→server, Z→resourceName,
//          Y→uri, J→resolvedUri, UU7→getServerResources, i9A→READ_COMMAND,
//          NU7→readResourceDirectly
```

**Usage Examples:**
```bash
# Read by resource name
claude --mcp-cli read filesystem/config.json

# Read by direct URI
claude --mcp-cli read filesystem file:///tmp/test.txt

# Read with timeout
claude --mcp-cli read slow-server/large-file --timeout 60000

# Read with JSON output
claude --mcp-cli read database/schema --json
```

---

## Telemetry Integration

All MCP CLI commands use the `vuA()` (executeWithTelemetry) wrapper:

```javascript
// ============================================
// executeWithTelemetry - Wrapper for command telemetry
// Location: cli.chunks.mjs (implied from usage)
// ============================================

// Pattern:
const result = await executeWithTelemetry(
  commandName,           // "servers", "tools", "info", "call", "grep", "resources", "read"
  asyncExecutor,         // Actual command logic
  successMetrics,        // Function to extract success metrics
  failureMetrics         // Optional failure metrics object
);

// Telemetry events emitted:
// - tengu_mcp_cli_command_executed (for call and read)
// - tengu_tool_use_error (for call errors)
```

---

## Error Handling

| Error Type | Handling |
|------------|----------|
| Invalid JSON args | Print error, exit 1 |
| Invalid regex pattern | Throw with pattern error |
| Tool not found | Check server status, throw descriptive error |
| Resource not found | Print error, exit 1 |
| Connection failed | Track telemetry, exit 1 |
| Timeout | Track telemetry, exit 1 |

---

## Connection Modes

### Endpoint Mode
When Claude Code is already running:
- MCP CLI connects to the running instance via socket
- Commands are forwarded to the main process
- No duplicate MCP server initialization

### Standalone Mode
When no Claude Code instance is running:
- MCP CLI initializes its own MCP connections
- Uses state file for configuration
- Full MCP client startup

```javascript
// Detection logic:
if (isRunningInEndpoint()) {
  // Use socket communication
  return await sendCommand(commandId, params);
} else {
  // Initialize MCP directly
  return await executeDirectly(params);
}
```
