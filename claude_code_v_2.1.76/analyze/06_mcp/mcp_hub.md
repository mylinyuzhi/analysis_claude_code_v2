# MCP Hub & MCPContext

## Overview

Claude Code's MCP infrastructure includes two internal servers that bridge different parts of the system:

1. **McpHub** (JVq): A Unix domain socket IPC server that routes messages between Chrome browser MCP connections and local MCP client instances.
2. **MCPContext**: A localhost HTTP server that bridges the `mcp-cli` CLI tool (a separate process) to the active MCP server connections in the main Claude Code session.

These two components solve different isolation problems: McpHub solves the "browser ↔ agent" message routing problem, while MCPContext solves the "child process ↔ parent session" state sharing problem.

> **⚠️ Symbol Correction:** The actual McpHub class is `JVq` in chunks.178.mjs:235, not `nXq` as previously documented. The symbol `nXq` in chunks.165.mjs:864 is an object literal, not a class.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP Hub/Context section

Key symbols in this document:
- `McpHub` (JVq) - chunks.178.mjs:235 - Unix socket IPC server
- `findMcpClientByServerName` (Jf1) - chunks.175.mjs:1211 - Client lookup helper
- `listMcpServers` (pT6) - chunks.175.mjs:962 - CLI servers subcommand
- `filterMcpTools` (dT6) - chunks.175.mjs:975 - CLI tools subcommand
- `getToolInfo` (cT6) - chunks.175.mjs:994 - CLI info subcommand
- `grepTools` (lT6) - chunks.175.mjs:1020 - CLI grep subcommand
- `filterMcpResources` (iT6) - chunks.175.mjs:1051 - CLI resources subcommand
- `parseToolName` (VD) - chunks.175.mjs - Namespace parser for `mcp__server__tool`

---

## 1. McpHub (JVq)

### What it does

A Unix domain socket server (`~/.claude/sockets/{pid}.sock`) that acts as a message router between incoming Chrome extension MCP connections and the registered local MCP clients.

### Why Unix socket (not TCP)

**Security rationale:** Unix domain sockets are filesystem objects. Access is controlled by file permissions (`0o600` = owner-read/write only). Any process on localhost could connect to a TCP socket on a known port, but only the owning user can connect to the `0o600` socket file. This prevents other users or processes from injecting messages into Claude's tool execution pipeline.

### How it works

**`start()` algorithm:**

```javascript
// ============================================
// McpHub.start - Create Unix socket server with security hardening
// Location: chunks.175.mjs:1897-1960
// ============================================

// ORIGINAL (for source lookup):
async start() {
  let sockDir = path.join(os.homedir(), ".claude", "sockets");
  await fs.mkdir(sockDir, { recursive: true, mode: 0o700 });
  let entries = await fs.readdir(sockDir).catch(() => []);
  for (let entry of entries) {
    let pid = parseInt(entry.replace(".sock",""));
    if (!isNaN(pid)) {
      try { process.kill(pid, 0); }
      catch { await fs.unlink(path.join(sockDir, entry)).catch(()=>{}); }
    }
  }
  this._sockPath = path.join(sockDir, `${process.pid}.sock`);
  this._server = net.createServer(sock => this.handleMcpClient(sock));
  await new Promise((res,rej) => this._server.listen(this._sockPath, err => err ? rej(err) : res()));
  await fs.chmod(this._sockPath, 0o600);
}

// READABLE (for understanding):
async start() {
  const socketDir = path.join(os.homedir(), ".claude", "sockets");

  // 1. Create socket directory with owner-only access
  await fs.mkdir(socketDir, { recursive: true, mode: 0o700 });

  // 2. Clean up stale socket files from dead processes
  const entries = await fs.readdir(socketDir).catch(() => []);
  for (const entry of entries) {
    const pid = parseInt(entry.replace(".sock", ""));
    if (!isNaN(pid)) {
      try {
        process.kill(pid, 0);  // signal 0 = "does this pid exist?"
        // Process is alive — keep its socket file
      } catch {
        // ESRCH: process not found — socket file is stale, remove it
        await fs.unlink(path.join(socketDir, entry)).catch(() => {});
      }
    }
  }

  // 3. Create socket for THIS process
  this._socketPath = path.join(socketDir, `${process.pid}.sock`);
  this._server = net.createServer(socket => this.handleMcpClient(socket));

  await new Promise((resolve, reject) => {
    this._server.listen(this._socketPath, err => err ? reject(err) : resolve());
  });

  // 4. Lock down the socket file to owner-only after bind
  await fs.chmod(this._socketPath, 0o600);
}

// Mapping: sockDir→socketDir, entries→entries, entry→entry, pid→pid,
//          this._sockPath→this._socketPath
```

**Key insight: `process.kill(pid, 0)` liveness check**

The `kill(pid, 0)` technique is a POSIX trick: sending signal 0 doesn't actually kill the process — it just checks if the process exists and if you have permission to signal it. If `kill` throws `ESRCH` (no such process), the socket file is orphaned and safe to delete. This avoids accumulating stale `.sock` files after Claude Code crashes or is force-killed.

### Message Framing Protocol

McpHub uses a **4-byte little-endian length prefix** framing over the Unix socket. This is required because Unix domain sockets are stream-oriented (like TCP) — message boundaries are not preserved.

```
[0..3] = message length (uint32, little-endian)
[4..N] = JSON payload (UTF-8)
```

**`handleMcpClient()` routing:**

Incoming messages are dispatched by `type` field:

| `type` | Action |
|--------|--------|
| `tool_request` | Forward to named MCP client, await response |
| `tool_response` | Forward response back to originating Chrome socket |
| `notification` | Broadcast to all registered clients |
| `mcp_connected` | Register new client in `mcpClients` Map |
| `mcp_disconnected` | Remove client from Map, cleanup |

**Client registry:** `mcpClients: Map<clientId, { id, socket, buffer }>`

- `clientId`: stable identifier per Chrome extension instance
- `socket`: the net.Socket for writing responses back
- `buffer`: partial data accumulator for incomplete 4-byte framed messages

---

## 2. MCPContext (ZQA)

### What it does

A local HTTP server at `http://127.0.0.1:{random_port}/mcp` that acts as a bridge between the `mcp-cli` subprocess and the active MCP connections in the parent Claude Code session.

**The problem it solves:** When Claude Code spawns a child process to run `mcp-cli call server/tool`, that child process has no direct access to the parent's in-memory MCP client connections. MCPContext exposes an authenticated HTTP API that the child can call to execute tools through the parent's established connections.

### How it works

**`start()` algorithm:**

```javascript
// ============================================
// MCPContext.start - Create authenticated local HTTP bridge
// Location: chunks.176.mjs:2333-2380
// ============================================

// ORIGINAL (for source lookup):
async start() {
  this.secret = crypto.randomBytes(32).toString("hex");
  this._server = http.createServer((req, res) => this.handleRequest(req, res));
  await new Promise(res => this._server.listen(0, "127.0.0.1", res));
  this.port = this._server.address().port;
}

// READABLE (for understanding):
async start() {
  // 32-byte random hex secret prevents other local processes from calling our API
  this.secret = crypto.randomBytes(32).toString("hex");

  this._server = http.createServer((req, res) => this.handleRequest(req, res));

  // listen(0) = OS assigns a random available port
  // "127.0.0.1" = loopback only, not accessible from network
  await new Promise(resolve => this._server.listen(0, "127.0.0.1", resolve));

  this.port = this._server.address().port;  // save the assigned port
}

// Mapping: this.secret→authSecret, this._server→httpServer, this.port→assignedPort
```

**Authentication mechanism:**
- Secret is a 32-byte cryptographically random hex string (64 hex chars)
- The parent writes `{ port, secret }` to a file that the child process can read
- Child includes `Authorization: Bearer <secret>` in every request
- `handleRequest()` validates the Bearer token with constant-time comparison to prevent timing attacks

**`handleRequest()` routing:**

```
POST /mcp/call   → executeMcpTool(serverName, toolName, args)
GET  /mcp/tools  → list all available tools
GET  /mcp/servers → list connected servers
GET  /mcp/resources → list available resources
```

**`getNormalizedNames()` pre-computation:**

```javascript
// ============================================
// MCPContext.getNormalizedNames - Case-insensitive lookup map
// Location: chunks.176.mjs:2410-2425
// ============================================

// ORIGINAL (for source lookup):
getNormalizedNames() {
  if (!this._normalizedNames) {
    this._normalizedNames = {};
    for (let client of this.mcpClients) {
      this._normalizedNames[client.name.toLowerCase()] = client.name;
    }
  }
  return this._normalizedNames;
}

// READABLE (for understanding):
getNormalizedNames() {
  if (!this._normalizedCache) {
    this._normalizedCache = {};
    for (const client of this.mcpClients) {
      // Map "MyServer" → "myserver" → "MyServer"
      this._normalizedCache[client.name.toLowerCase()] = client.name;
    }
  }
  return this._normalizedCache;
}

// Mapping: this._normalizedNames→this._normalizedCache
```

**Why case-insensitive lookup:** MCP server names may be configured in mixed case (e.g., `"GitHub"`) but user CLI commands are typically lowercase (e.g., `mcp-cli call github/search`). The normalized map allows matching `"github"` → `"GitHub"` without requiring exact case from the user.

**MCPContext stored state:**
- `mcpClients[]`: Active `McpClient` instances
- `availableTools[]`: Tool metadata (name, schema, description)
- `resources{}`: Resources by server name

---

## 3. Tool Name Namespace

### What it does

MCP tools are prefixed with `mcp__<serverName>__<toolName>` to avoid collisions with built-in Claude Code tools (which use simple names like `Bash`, `Read`, `Write`).

### Why this format

- **Collision prevention:** An MCP server could expose a tool called `read` or `bash`, which would shadow built-ins
- **Source identification:** The prefix immediately identifies the tool origin without inspecting metadata
- **Regex-friendly:** Double underscores (`__`) are unlikely to appear in server or tool names, making parsing unambiguous

### parseToolName (VD)

```javascript
// ============================================
// parseToolName - Extract serverName and toolName from MCP namespace
// Location: chunks.175.mjs
// ============================================

// ORIGINAL (for source lookup):
function VD(A) {
  let q = A.match(/^mcp__([^_]+(?:_[^_]+)*)__(.+)$/);
  if (!q) return null;
  return { serverName: q[1], toolName: q[2] };
}

// READABLE (for understanding):
function parseToolName(namespacedName) {
  // Pattern: mcp__<server>__<tool>
  // Server name may contain single underscores but not double
  const match = namespacedName.match(/^mcp__([^_]+(?:_[^_]+)*)__(.+)$/);
  if (!match) return null;
  return { serverName: match[1], toolName: match[2] };
}

// Mapping: VD→parseToolName, A→namespacedName, q→match
```

---

## 4. CLI Subcommand Implementations

The `mcp-cli` program (A11) registers the following subcommands via Commander.js:

### Subcommand Reference

| Subcommand | Function | Obfuscated | Purpose |
|---|---|---|---|
| `servers` | `listMcpServers` | pT6 | List connected servers with capabilities |
| `tools [--server]` | `filterMcpTools` | dT6 | Filter/list tools, optionally by server |
| `info <server/tool>` | `getToolInfo` | cT6 | Get schema + description for a tool |
| `call <server/tool> {json}` | `executeMcpTool` | yHz | Execute tool via connected client |
| `grep <pattern>` | `grepTools` | lT6 | Regex search tool names and descriptions |
| `resources [--server]` | `filterMcpResources` | iT6 | List available resources |

### listMcpServers (pT6) — chunks.175.mjs:962

**What it does:** Reads from the session state file (or directly from MCPContext if endpoint mode) and returns a list of connected server names with their capability flags.

**Output format:**
```
server: sqlite
  capabilities: tools, resources

server: github
  capabilities: tools
```

### filterMcpTools (dT6) — chunks.175.mjs:975

**What it does:** Lists all available MCP tools. The `--server` flag filters to a specific server's tools only.

**Algorithm:**
1. Read `availableTools` from session state
2. Filter: `tools.filter(t => !serverFilter || t.serverName === serverFilter)`
3. Format: `mcp__server__toolName: description`

### getToolInfo (cT6) — chunks.175.mjs:994

**What it does:** Returns the full JSON Schema for a tool's input parameters plus its description. This is the "Read-Before-Call" step enforced by the system prompt.

**Input:** `server/tool` or `mcp__server__tool` (both formats accepted)
**Output:** Full JSON Schema formatted as YAML-like text for readability

**Why separate from the call step:** The model needs to know the exact schema before calling a tool, especially for required parameters and enum values. The two-step pattern mirrors the `Read` → `Edit` pattern for files, ensuring high reliability.

### grepTools (lT6) — chunks.175.mjs:1020

**What it does:** Searches tool names AND descriptions with a regex pattern. Useful when the model doesn't know the exact tool name.

**Algorithm:**
```javascript
tools.filter(tool =>
  pattern.test(tool.name) || pattern.test(tool.description)
)
```

Case-insensitive by default. Returns matching tools with truncated descriptions.

### filterMcpResources (iT6) — chunks.175.mjs:1051

Lists available MCP resources (files, database schemas, etc.) that can be read via `mcp-cli read server/resource`.

---

## 5. Tool Execution Path

### executeMcpTool (yHz) — full flow

```
mcp-cli call server/tool '{"key": "value"}'
  → parseMcpCliCommand() → { server: "server", tool: "tool", args: '{"key":"value"}' }
  → runMcpCliCommand() → executeMcpTool(serverName, toolName, parsedArgs)
    → findMcpClientByServerName(serverName)  [Jf1]
    → if not connected: connectToServer()
    → client.callTool(toolName, args)        [rH6.callTool]
      → JSON-RPC: tools/call request
      → await response
    → formatToolResult(result)
  → return formatted string to parent process via stdout
```

**Timeout handling:** Uses `AbortSignal.timeout(ms)` (modern Promise API):
```javascript
const signal = AbortSignal.timeout(30_000);  // 30 second timeout
await client.callTool(toolName, args, { signal });
```

If the tool call exceeds the timeout, the AbortSignal fires and the call rejects with `TimeoutError`. The formatted error is returned as tool output so the model can decide how to recover.

**Tool name de-obfuscation:** The session state stores `originalToolName` alongside the namespaced `mcp__server__tool` name. When the model calls `mcp-cli call server/tool`, the tool name is looked up in the hub to find the original name as registered by the server (which may differ in case or include special characters not allowed in the `mcp__` namespace).

---

## 6. 4-Byte Framing Protocol Details

### Message Framing Implementation

```
┌────────────────────────────────────────────────────────────┐
│  Unix Socket Stream (boundary-less)                        │
├────────────────────────────────────────────────────────────┤
│  [msg1_len(4)] [msg1_json(N)] [msg2_len(4)] [msg2_json(M)] │
└────────────────────────────────────────────────────────────┘
```

**Why 4-byte little-endian:**
- Maximum message size: 4GB (more than enough for JSON)
- Little-endian is native to x86/ARM, no byte-swap overhead
- Consistent with Chrome native messaging protocol

### Framing Implementation

```javascript
// ============================================
// McpHub message framing - 4-byte length prefix
// Location: chunks.178.mjs:280-320
// ============================================

// READABLE (for understanding):
function writeFramedMessage(socket, jsonMessage) {
    const payload = Buffer.from(JSON.stringify(jsonMessage), 'utf8');
    const lengthBuf = Buffer.alloc(4);

    // Write 4-byte little-endian length
    lengthBuf.writeUInt32LE(payload.length, 0);

    socket.write(Buffer.concat([lengthBuf, payload]));
}

function readFramedMessage(client) {
    // Accumulate data in buffer
    while (true) {
        // Need at least 4 bytes for length
        if (client.buffer.length < 4) return null;

        const msgLen = client.buffer.readUInt32LE(0);

        // Check if full message is available
        if (client.buffer.length < 4 + msgLen) return null;

        // Extract message
        const payload = client.buffer.slice(4, 4 + msgLen);
        client.buffer = client.buffer.slice(4 + msgLen);

        return JSON.parse(payload.toString('utf8'));
    }
}

// Mapping: writeUInt32LE→writeUInt32LE, readUInt32LE→readUInt32LE
```

**State accumulation in buffer:**
- Each client connection maintains its own `buffer: Buffer`
- On `data` event: `client.buffer = Buffer.concat([client.buffer, newChunk])`
- After extracting a message: `client.buffer = client.buffer.slice(4 + msgLen)`
- This handles partial reads and multiple messages per chunk

---

## 7. Client Registry Management

### Registry Structure

```javascript
// McpHub client registry
mcpClients: Map<clientId, ClientEntry>

interface ClientEntry {
    id: number;           // Sequential unique ID
    socket: net.Socket;   // Connected Unix socket
    buffer: Buffer;       // Accumulated read data
    serverName?: string;  // Registered MCP server name (after handshake)
}
```

### Client Lifecycle

```
Chrome extension connects
    │
    ▼
handleMcpClient(socket) [chunks.178.mjs:300]
    │ Creates: { id: nextClientId++, socket, buffer: Buffer.alloc(0) }
    │ Adds to: mcpClients.set(id, client)
    │
    ▼
Wait for 'mcp_connected' message
    │
    ├─ Contains: { serverName: "my-server", capabilities: {...} }
    │
    └─ Updates: client.serverName = message.serverName
         Adds to: serverIndex.set(serverName, clientId)
    │
    ▼
Message routing active
    │
    ├─ Incoming 'tool_request' → lookup client by serverName → forward
    │
    └─ Incoming 'tool_response' → lookup original requester → forward back
    │
    ▼
Socket 'close' event
    │
    ├─ Remove from mcpClients.delete(clientId)
    │
    └─ If serverName set: serverIndex.delete(serverName)
```

### Server Name Index

**What it does:** A reverse lookup map from server name to client ID for O(1) routing.

```javascript
// Secondary index for fast server lookup
serverIndex: Map<serverName, clientId>

// Lookup flow
function findClientByServerName(serverName) {
    const clientId = this.serverIndex.get(serverName.toLowerCase());
    if (!clientId) return null;
    return this.mcpClients.get(clientId);
}
```

**Why case-insensitive:** Chrome extension configurations may use different casing than the registered server name. Normalizing to lowercase prevents routing failures due to case mismatches.
