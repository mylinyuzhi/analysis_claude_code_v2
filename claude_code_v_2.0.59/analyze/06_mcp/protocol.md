# MCP (Model Context Protocol) Implementation

## Overview

Claude Code v2.0.59 implements the **Model Context Protocol (MCP)** to integrate with external servers that provide tools, prompts, and resources. The MCP implementation supports multiple transport protocols: stdio, SSE (Server-Sent Events), HTTP, and IDE-specific transports.

## MCP Client Architecture

### Main Connection Function: D1A()

Located in `chunks.101.mjs`, the `D1A()` function establishes MCP connections:

```javascript
async function D1A(A, Q) {
  try {
    await IYA(A, Q);  // Initialize server
    let B = await ZYA(A, Q);  // Connect to server

    if (B.type !== "connected") {
      return {
        client: B,
        tools: [],
        commands: []
      };
    }

    let G = !!B.capabilities?.resources,
        [Z, I, Y] = await Promise.all([
          x10(B),      // Fetch tools
          _32(B),      // Fetch prompts/commands
          G ? S32(B) : Promise.resolve([])  // Fetch resources if supported
        ]),
        J = [];

    // Add resource tools if resources are available
    if (G) {
      if (![Wh, Xh].some((X) => Z.some((V) => V.name === X.name)))
        J.push(Wh, Xh);
    }

    return {
      client: B,
      tools: [...Z, ...J],
      commands: I,
      resources: Y.length > 0 ? Y : void 0
    };
  } catch (B) {
    WI(A, `Error during reconnection: ${B instanceof Error ? B.message : String(B)}`);
    return {
      client: {
        name: A,
        type: "failed",
        config: Q
      },
      tools: [],
      commands: []
    };
  }
}
```

### Batch Connection: v10()

Connects to multiple MCP servers in batches:

```javascript
async function v10(A, Q) {
  let B = false,
      G = Object.entries(Q ?? (await fk()).servers),
      Z = G.length,
      I = G.filter(([V, F]) => F.type === "stdio").length,
      Y = G.filter(([V, F]) => F.type === "sse").length,
      J = G.filter(([V, F]) => F.type === "http").length,
      W = G.filter(([V, F]) => F.type === "sse-ide").length,
      X = G.filter(([V, F]) => F.type === "ws-ide").length;

  await PY5(G, OY5(), async ([V, F]) => {
    // Process each server in batches
    try {
      if (IMA(V)) {
        // Server is disabled
        A({
          client: { name: V, type: "disabled", config: F },
          tools: [],
          commands: []
        });
        return;
      }

      let D = await ZYA(V, F, {
        totalServers: Z,
        stdioCount: I,
        sseCount: Y,
        httpCount: J,
        sseIdeCount: W,
        wsIdeCount: X
      });

      if (D.type !== "connected") {
        A({ client: D, tools: [], commands: [] });
        return;
      }

      let H = !!D.capabilities?.resources,
          [C, E, U] = await Promise.all([
            x10(D),  // Tools
            _32(D),  // Commands
            H ? S32(D) : Promise.resolve([])  // Resources
          ]),
          q = [];

      if (H && !B) {
        B = true;
        q.push(Wh, Xh);  // Add resource tools once
      }

      A({
        client: D,
        tools: [...C, ...q],
        commands: E,
        resources: U.length > 0 ? U : void 0
      });
    } catch (K) {
      WI(V, `Error fetching tools/commands/resources: ${K instanceof Error ? K.message : String(K)}`);
      A({
        client: { name: V, type: "failed", config: F },
        tools: [],
        commands: []
      });
    }
  });
}
```

## Transport Types

Claude Code supports four MCP transport types:

### 1. STDIO Transport

Standard input/output for local processes:

```javascript
if (A.type === "stdio" || !A.type) {
  // Configuration
  {
    type: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-example"],
    env: {
      API_KEY: "..."
    }
  }
}
```

### 2. SSE (Server-Sent Events) Transport

HTTP-based transport for remote servers:

```javascript
if (Q.type === "sse") {
  {
    type: "sse",
    url: "https://mcp.example.com/sse",
    headers: {
      "Authorization": "Bearer token",
      "X-Custom": "value"
    }
  }
}
```

### 3. HTTP Transport

Standard HTTP for request-response:

```javascript
{
  type: "http",
  url: "https://mcp.example.com/mcp",
  headers: {
    "Authorization": "Bearer token"
  }
}
```

### 4. IDE Transports

Special transports for IDE integration:

```javascript
// SSE-IDE
{
  type: "sse-ide",
  url: "...",
  // IDE-specific configuration
}

// WS-IDE (WebSocket)
{
  type: "ws-ide",
  url: "...",
  // IDE-specific configuration
}
```

## Dynamic Tool Naming

MCP tools are renamed to avoid conflicts between servers using a naming convention:

```javascript
// From chunks.158.mjs, line 1345:
let V = `mcp__${n7(Q)}__${n7(A)}`;
// Where n7() normalizes server and tool names

// Example:
// Server: "github"
// Tool: "create-issue"
// Result: "mcp__github__create_issue"
```

### Tool Name Resolution

When calling a tool, Claude Code resolves the original tool name:

```javascript
let J = (() => {
  let V = `mcp__${n7(Q)}__${n7(A)}`;
  return Z.tools.find((K) => K.name === V)?.originalToolName || A;
})();
```

This allows:
- Multiple MCP servers with same-named tools
- Clear indication that a tool is from MCP
- Tracking which server provides which tool

## Tool Calling

### Call Tool Function: y32()

```javascript
async function y32({
  client: { client: A, name: Q },
  tool: B,
  args: G,
  meta: Z,
  signal: I
}) {
  let Y = Date.now(),
      J;

  try {
    y0(Q, `Calling MCP tool: ${B}`);

    // Progress monitoring
    J = setInterval(() => {
      let F = Date.now() - Y,
          D = `${Math.floor(F / 1000)}s`;
      y0(Q, `Tool '${B}' still running (${D} elapsed)`);
    }, 30000);  // Log every 30 seconds

    // Make the tool call
    let W = await A.callTool({
      name: B,
      arguments: G,
      _meta: Z
    }, aT, {
      signal: I,
      timeout: MY5()  // Tool timeout
    });

    // Handle error responses
    if ("isError" in W && W.isError) {
      let F = "Unknown error";
      if ("content" in W && Array.isArray(W.content) && W.content.length > 0) {
        let K = W.content[0];
        if (K && typeof K === "object" && "text" in K)
          F = K.text;
      } else if ("error" in W) {
        F = String(W.error);
      }
      throw WI(Q, F), Error(F);
    }

    // Calculate and log duration
    let X = Date.now() - Y,
        V = X < 1000 ? `${X}ms` :
            X < 60000 ? `${Math.floor(X / 1000)}s` :
            `${Math.floor(X / 60000)}m ${Math.floor((X % 60000) / 1000)}s`;

    y0(Q, `Tool '${B}' completed successfully in ${V}`);

    return await jY5(W, B, Q);  // Process and return result
  } catch (W) {
    if (J !== void 0) clearInterval(J);

    let X = Date.now() - Y;
    if (W instanceof Error && W.name !== "AbortError")
      y0(Q, `Tool '${B}' failed after ${Math.floor(X / 1000)}s: ${W.message}`);

    if (!(W instanceof Error) || W.name !== "AbortError")
      throw W;
  } finally {
    if (J !== void 0) clearInterval(J);
  }
}
```

### Tool Result Processing: b10()

Handles different response formats from MCP tools:

```javascript
async function b10(A, Q, B) {
  if (A && typeof A === "object") {
    // Legacy toolResult format
    if ("toolResult" in A) {
      return {
        content: String(A.toolResult),
        type: "toolResult"
      };
    }

    // Structured content
    if ("structuredContent" in A && A.structuredContent !== void 0) {
      return {
        content: JSON.stringify(A.structuredContent),
        type: "structuredContent",
        schema: U21(A.structuredContent)
      };
    }

    // Content array (standard MCP response)
    if ("content" in A && Array.isArray(A.content)) {
      let Z = (await Promise.all(
        A.content.map((I) => k32(I, B))
      )).flat();

      return {
        content: Z,
        type: "contentArray",
        schema: U21(Z)
      };
    }
  }

  let G = `Unexpected response format from tool ${Q}`;
  throw WI(B, G), Error(G);
}
```

### Content Type Conversion: k32()

Converts MCP content types to Claude API format:

```javascript
async function k32(A, Q) {
  switch (A.type) {
    case "text":
      return [{
        type: "text",
        text: A.text
      }];

    case "image": {
      let B = Buffer.from(String(A.data), "base64"),
          G = await rt(B, void 0, A.mimeType);
      return [{
        type: "image",
        source: {
          data: G.base64,
          media_type: G.mediaType,
          type: "base64"
        }
      }];
    }

    case "resource": {
      let B = A.resource,
          G = `[Resource from ${Q} at ${B.uri}] `;

      if ("text" in B) {
        return [{
          type: "text",
          text: `${G}${B.text}`
        }];
      } else if ("blob" in B) {
        if (LY5.has(B.mimeType ?? "")) {
          // Convert blob to image
          let I = Buffer.from(B.blob, "base64"),
              Y = await rt(I, void 0, B.mimeType),
              J = [];

          if (G) J.push({ type: "text", text: G });

          J.push({
            type: "image",
            source: {
              data: Y.base64,
              media_type: Y.mediaType,
              type: "base64"
            }
          });

          return J;
        } else {
          return [{
            type: "text",
            text: `${G}Base64 data (${B.mimeType || "unknown type"}) ${B.blob}`
          }];
        }
      }
      return [];
    }

    case "resource_link": {
      let B = A,
          G = `[Resource link: ${B.name}] ${B.uri}`;
      if (B.description)
        G += ` (${B.description})`;

      return [{
        type: "text",
        text: G
      }];
    }

    default:
      return [];
  }
}
```

## MCP Configuration Format

### Configuration Structure

MCP servers are configured in settings files:

```javascript
{
  "mcpServers": {
    "server-name": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-example"],
      "env": {
        "API_KEY": "your-key"
      }
    },
    "remote-server": {
      "type": "sse",
      "url": "https://mcp.example.com/sse",
      "headers": {
        "Authorization": "Bearer token"
      }
    }
  }
}
```

### Configuration Loading

From `chunks.158.mjs`, MCP configurations are loaded from:

1. **Command-line**: `--mcp-config`
2. **Settings files**: User, project, and local settings
3. **Claude Desktop**: Import from Claude Desktop config

### Dynamic Configuration

MCP servers can be added dynamically via CLI:

```bash
# Add stdio server
claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=KEY -- npx -y airtable-mcp-server

# Add SSE server
claude mcp add --transport sse asana https://mcp.asana.com/sse

# Add HTTP server
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

## Client Initialization: x32()

```javascript
async function x32(A, Q) {
  let B = [],
      G = [],
      Z = await Promise.allSettled(
        Object.entries(A).map(async ([I, Y]) => {
          let J = new y10(I, Q),  // Create transport
              W = new BQ1({         // Create MCP client
                name: "claude-code",
                version: "2.0.59"
              }, {
                capabilities: {}
              });

          try {
            await W.connect(J);  // Connect to server

            let X = W.getServerCapabilities(),
                V = {
                  type: "connected",
                  name: I,
                  capabilities: X || {},
                  client: W,
                  // ... more fields
                };

            // Connection successful
            return V;
          } catch (error) {
            // Connection failed
            return {
              type: "failed",
              name: I,
              error: error.message
            };
          }
        })
      );

  // Process results
  // ...
}
```

## Capabilities

MCP servers declare capabilities that Claude Code respects:

```javascript
let G = !!B.capabilities?.resources;
```

Supported capabilities:
- **tools**: Server provides tools
- **prompts**: Server provides prompts/commands
- **resources**: Server provides resources

## Resource Handling

When a server supports resources, Claude Code adds resource tools:

```javascript
if (G && !B) {
  B = true;
  q.push(Wh, Xh);  // Wh and Xh are resource-related tools
}
```

Resources are fetched via `S32()` function:

```javascript
H ? S32(D) : Promise.resolve([])  // Fetch resources if capability exists
```

## Error Handling

### Connection Errors

```javascript
if (D.type !== "connected") {
  A({ client: D, tools: [], commands: [] });
  return;
}
```

### Tool Call Errors

```javascript
if ("isError" in W && W.isError) {
  let F = "Unknown error";
  // Extract error message from response
  throw WI(Q, F), Error(F);
}
```

### Timeout Handling

```javascript
{
  signal: I,
  timeout: MY5()  // Tool timeout function
}
```

## Logging

MCP operations are logged via `y0()` function:

```javascript
y0(Q, `Calling MCP tool: ${B}`);
y0(Q, `Tool '${B}' still running (${D} elapsed)`);
y0(Q, `Tool '${B}' completed successfully in ${V}`);
y0(Q, `Tool '${B}' failed after ${Math.floor(X / 1000)}s: ${W.message}`);
```

## Summary

Claude Code's MCP implementation provides:

1. **Multiple transports**: stdio, SSE, HTTP, IDE-specific
2. **Dynamic tool naming**: Avoid conflicts with `mcp__server__tool` pattern
3. **Batch connection**: Efficient parallel server initialization
4. **Capability negotiation**: Respect server capabilities
5. **Progress monitoring**: Long-running tool call tracking
6. **Error handling**: Graceful failure with detailed logging
7. **Content conversion**: MCP format to Claude API format
8. **Resource support**: Special handling for MCP resources
9. **Configuration flexibility**: CLI, settings files, Claude Desktop import
10. **Timeout management**: Prevent indefinite tool calls
