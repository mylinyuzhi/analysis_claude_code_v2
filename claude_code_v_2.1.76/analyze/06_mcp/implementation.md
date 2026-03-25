# Module: Model Context Protocol (MCP) (06)

## Overview

Claude Code v2.1.76 implements a "Meta-Tooling" architecture for MCP. Instead of exposing every MCP tool as a top-level model tool, it provides a virtual `mcp-cli` command accessible via the `Bash` tool. This allows for dynamic discovery and execution of thousands of potential tools without exceeding context limits or confusing the model with too many schemas.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `parseMcpCliCommand` (ce) - Regex-based parser for `mcp-cli` commands in the terminal.
- `processMcpCliResult` - Post-processor for terminal output that redirects `mcp-cli` calls to the internal MCP bridge. (Note: `CYz` is a constant 1800000ms timeout, not this function)
- `buildMcpCliInstructions` - Generates the mandatory "Read-Before-Call" safety instructions for the system prompt. (Note: `FOq` is QR code encoder, actual location TBD)
- `McpMetaTool` (ln4) - A placeholder tool definition used for internal MCP routing.
- `McpHub` (JVq) - Unix socket IPC server for Chrome browser MCP connections.

> **⚠️ Symbol Correction Note:** `CJq` was previously documented as `updateMcpSessionState`. The actual `CJq` in chunks.162.mjs:3 is a React component for "Remote session details" display. The session state persistence function has a different implementation location.
> **⚠️ Symbol Correction Note:** `FOq` was incorrectly mapped to buildMcpCliInstructions. Actual `FOq` in chunks.159.mjs:294 is a QR code numeric mode encoder (`ov6` class). The actual MCP CLI instructions builder is dynamically generated within the system prompt construction.
> **⚠️ Symbol Correction Note:** `CYz` was incorrectly documented as `processMcpCliResult`. Actual `CYz` is a constant `1800000` (30 minute timeout in ms). The processMcpCliResult function has a different implementation.

## Symbol Validation Status (v2.1.76) ✅

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `JVq` | McpHub | chunks.178.mjs:235 | ✅ Validated - Unix socket IPC server |
| `JE` | fetchMcpTools | chunks.170.mjs:533 | ✅ Validated - Tool discovery via tools/list |
| `SO8` | StdioClientTransport | chunks.57.mjs:1098 | ✅ Validated - MCP transport over stdio |
| `SSEClientTransport` | SSEClientTransport | chunks.57.mjs:2492 | ✅ Validated - SSE transport class |

---

## Core Algorithms

### The `mcp-cli` Command Interception

**What it does:**
When the model executes a bash command, the system checks if it is an `mcp-cli` call. If so, it bypasses the real shell and executes the tool internally through the Model Context Protocol.

**How it works:**
1.  **Tool Discovery**: MCP tools are discovered dynamically via `fetchMcpTools` (JE) when MCP servers connect, using the `tools/list` MCP method.
2.  **Detection**: The `Bash` tool's `call` method invokes `parseMcpCliCommand` (ce). It uses a regex to match commands like `mcp-cli call <server>/<tool> [args]`.
3.  **Execution Bridge**: If matched, the MCP tool execution is routed through `callMcpServer` (ECA) which communicates with the target MCP server via JSON-RPC.
4.  **Result Formatting**: The JSON results from the MCP server are formatted back into "stdout" for the model to read. For large outputs, it can save the result to a temporary file and return the path (`rawOutputPath`). In v2.1.76, binary content such as PDFs and audio returned by MCP servers is also saved to disk rather than included inline in the result.
5.  **State Persistence**: The MCP session state is continuously updated with the current list of servers and tools for tool discovery.

**Why this approach:**
- **Context Efficiency**: Top-level tool schemas are limited. `mcp-cli` allows access to an unlimited number of MCP tools.
- **Reliability**: The "Info-Before-Call" rule ensures the model always knows the correct JSON schema for an MCP tool, preventing hallucinated parameters.
- **Unified Interface**: By using the terminal as the entry point, MCP tools feel like native CLI tools to the agent.
- **Dynamic Discovery**: Tools are discovered at runtime, allowing MCP servers to be added/removed without restarting.

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

### fetchMcpTools (JE) - Dynamic MCP Tool Discovery

**What it does:** Discovers all tools from a connected MCP server by calling the `tools/list` JSON-RPC method. Returns an array of tool definitions that integrate with Claude Code's tool registry.

**Location:** chunks.170.mjs:533-629

```javascript
// ============================================
// fetchMcpTools - Discover MCP tools from connected server
// Location: chunks.170.mjs:533-629
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
                async prompt() { return z.description ?? "" },
                isConcurrencySafe() { return z.annotations?.readOnlyHint ?? !1 },
                isReadOnly() { return z.annotations?.readOnlyHint ?? !1 },
                isDestructive() { return z.annotations?.destructiveHint ?? !1 },
                isOpenWorld() { return z.annotations?.openWorldHint ?? !1 },
                inputJSONSchema: z.inputSchema,
                async call(w, O, $, H, j) {
                    // Tool execution logic...
                }
            };
        });
    } catch { return []; }
});

// READABLE (for understanding):
async function fetchMcpTools(mcpClient) {
    // Gate: Only connected clients have tools
    if (mcpClient.type !== "connected") return [];

    try {
        // Check if server declares tool capability
        if (!mcpClient.capabilities?.tools) return [];

        // Request tools from MCP server via JSON-RPC
        let response = await mcpClient.client.request({
            method: "tools/list"
        }, ToolListResultSchema);

        let tools = ensureArray(response.tools);

        // Check if SDK mode should skip tool name prefixing
        let skipPrefix = mcpClient.config.type === "sdk" &&
            isTruthy(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

        return tools.map((tool) => {
            // Build prefixed name: mcp__<serverName>__<toolName>
            let prefixedName = buildMcpToolName(mcpClient.name, tool.name);

            return {
                // Base tool properties from shared template
                ...baseToolProperties,

                // Name: prefixed unless SDK mode disables prefixing
                name: skipPrefix ? tool.name : prefixedName,

                // MCP metadata for routing tool calls back to correct server
                mcpInfo: {
                    serverName: mcpClient.name,
                    toolName: tool.name
                },
                isMcp: true,

                // Dynamic properties from MCP tool definition
                async description() { return tool.description ?? "" },
                async prompt() { return tool.description ?? "" },
                inputJSONSchema: tool.inputSchema,

                // Annotation-based properties (from MCP tool annotations)
                isConcurrencySafe() { return tool.annotations?.readOnlyHint ?? false },
                isReadOnly() { return tool.annotations?.readOnlyHint ?? false },
                isDestructive() { return tool.annotations?.destructiveHint ?? false },
                isOpenWorld() { return tool.annotations?.openWorldHint ?? false },

                // Tool execution method
                async call(args, context, ...) { /* ... */ }
            };
        });
    } catch {
        return [];  // Silently fail - server may not support tools
    }
}

// Mapping: JE→fetchMcpTools, A→mcpClient, q→response, K→tools, Y→skipPrefix,
//          z→tool, _→prefixedName, $58→buildMcpToolName, tZq→baseToolProperties,
//          $y6→ToolListResultSchema, Ws→ensureArray, t6→isTruthy
```

**Key Design Decisions:**

1. **Tool Name Prefixing:** MCP tools are prefixed with `mcp__<serverName>__` to prevent name collisions between different MCP servers and built-in tools. SDK mode can disable this via `CLAUDE_AGENT_SDK_MCP_NO_PREFIX`.

2. **Annotation-Based Safety:** The MCP protocol includes optional annotations (`readOnlyHint`, `destructiveHint`, `openWorldHint`) that Claude Code uses to make smarter permission and concurrency decisions.

3. **Lazy Description:** The `description()` method is async, allowing tools to provide dynamic descriptions without bloating the initial tool list response.

---

### McpHub (JVq) - Unix Socket IPC Server (Complete Implementation)

**What it does:** The McpHub class provides a Unix domain socket server for routing messages between Chrome browser MCP connections and local MCP client instances. It implements 4-byte length-prefix framing for message boundaries and handles multiple simultaneous client connections.

**Location:** chunks.178.mjs:235-396

```javascript
// ============================================
// McpHub - Unix socket IPC server for MCP routing
// Location: chunks.178.mjs:235-396
// ============================================

// ORIGINAL (for source lookup):
class JVq {
    mcpClients = new Map;
    nextClientId = 1;
    server = null;
    running = !1;
    socketPath = null;
    async start() {
        if (this.running) return;
        if (this.socketPath = kW1(), xo8() !== "win32") {
            let A = HQ6();
            try {
                if (!(await DOz(A)).isDirectory()) await uo8(A)
            } catch {}
            await JOz(A, { recursive: !0, mode: 448 });
            await $Vq(A, 448).catch(() => {});
            try {
                let q = await HVq(A);
                for (let K of q) {
                    if (!K.endsWith(".sock")) continue;
                    let Y = parseInt(K.replace(".sock", ""), 10);
                    if (isNaN(Y)) continue;
                    try { process.kill(Y, 0) } catch {
                        await uo8(HOz(A, K)).catch(() => {}), DH(`Removed stale socket for PID ${Y}`)
                    }
                }
            } catch {}
        }
        if (DH(`Creating socket listener: ${this.socketPath}`), this.server = $Oz((A) => this.handleMcpClient(A)),
            await new Promise((A, q) => {
                this.server.listen(this.socketPath, () => {
                    DH("Socket server listening for connections"), this.running = !0, A()
                }), this.server.on("error", (K) => { DH("Socket server error:", K), q(K) })
            }), xo8() !== "win32") try {
            await $Vq(this.socketPath, 384), DH("Socket permissions set to 0600")
        } catch (A) { DH("Failed to set socket permissions:", A) }
    }
    async stop() {
        if (!this.running) return;
        for (let [, A] of this.mcpClients) A.socket.destroy();
        if (this.mcpClients.clear(), this.server) await new Promise((A) => {
            this.server.close(() => A())
        }), this.server = null;
        if (xo8() !== "win32" && this.socketPath) {
            try { await uo8(this.socketPath), DH("Cleaned up socket file") } catch {}
            try {
                let A = HQ6();
                if ((await HVq(A)).length === 0) await MOz(A), DH("Removed empty socket directory")
            } catch {}
        }
        this.running = !1
    }
    async isRunning() { return this.running }
    async getClientCount() { return this.mcpClients.size }
    async handleMessage(A) {
        let q = i1(A);
        switch (DH(`Handling Chrome message type: ${q.type}`), q.type) {
            case "ping":
                DH("Responding to ping"), a_6(B6({ type: "pong", timestamp: Date.now() }));
                break;
            case "get_status":
                a_6(B6({ type: "status_response", native_host_version: XOz }));
                break;
            case "tool_response": {
                if (this.mcpClients.size > 0) {
                    DH(`Forwarding tool response to ${this.mcpClients.size} MCP clients`);
                    let { type: K, ...Y } = q, z = Buffer.from(B6(Y), "utf-8"), _ = Buffer.alloc(4);
                    _.writeUInt32LE(z.length, 0);
                    let w = Buffer.concat([_, z]);
                    for (let [O, $] of this.mcpClients) try { $.socket.write(w) }
                    catch (H) { DH(`Failed to send to MCP client ${O}:`, H) }
                }
                break
            }
            case "notification": {
                if (this.mcpClients.size > 0) {
                    let { type: K, ...Y } = q, z = Buffer.from(B6(Y), "utf-8"), _ = Buffer.alloc(4);
                    _.writeUInt32LE(z.length, 0);
                    let w = Buffer.concat([_, z]);
                    for (let [O, $] of this.mcpClients) try { $.socket.write(w) }
                    catch (H) { DH(`Failed to send notification to MCP client ${O}:`, H) }
                }
                break
            }
            default:
                DH(`Unknown message type: ${q.type}`), a_6(B6({ type: "error", error: `Unknown message type: ${q.type}` }))
        }
    }
    handleMcpClient(A) {
        let q = this.nextClientId++, K = { id: q, socket: A, buffer: Buffer.alloc(0) };
        this.mcpClients.set(q, K), DH(`MCP client ${q} connected. Total clients: ${this.mcpClients.size}`),
        a_6(B6({ type: "mcp_connected" })),
        A.on("data", (Y) => {
            K.buffer = Buffer.concat([K.buffer, Y]);
            while (K.buffer.length >= 4) {
                let z = K.buffer.readUInt32LE(0);
                if (z === 0 || z > mo8) { DH(`Invalid message length from MCP client ${q}: ${z}`), A.destroy(); return }
                if (K.buffer.length < 4 + z) break;
                let _ = K.buffer.slice(4, 4 + z);
                K.buffer = K.buffer.slice(4 + z);
                try {
                    let w = i1(_.toString("utf-8"));
                    DH(`Forwarding tool request from MCP client ${q}: ${w.method}`),
                    a_6(B6({ type: "tool_request", method: w.method, params: w.params }))
                } catch (w) { DH(`Failed to parse tool request from MCP client ${q}:`, w) }
            }
        }),
        A.on("error", (Y) => { DH(`MCP client ${q} error: ${Y}`) }),
        A.on("close", () => {
            DH(`MCP client ${q} disconnected. Remaining clients: ${this.mcpClients.size-1}`),
            this.mcpClients.delete(q),
            a_6(B6({ type: "mcp_disconnected" }))
        })
    }
}

// READABLE (for understanding):
class McpHub {
    mcpClients = new Map();      // Connected clients: Map<clientId, {id, socket, buffer}>
    nextClientId = 1;            // Counter for unique IDs
    server = null;               // Net server instance
    running = false;             // Server state flag
    socketPath = null;           // Path to Unix socket

    async start() {
        if (this.running) return;

        // Generate unique socket path using PID
        this.socketPath = generateSocketPath();

        // Unix-specific setup (not Windows)
        if (process.platform !== "win32") {
            let socketDir = getSocketDirectory();  // ~/.claude/sockets

            // Create socket directory with 0700 permissions
            try {
                if (!(await stat(socketDir)).isDirectory()) {
                    await mkdir(socketDir);
                }
            } catch {}
            await mkdir(socketDir, { recursive: true, mode: 0o700 });
            await chmod(socketDir, 0o700).catch(() => {});

            // Clean up stale socket files (from dead processes)
            try {
                let existingSockets = await readdir(socketDir);
                for (let sockFile of existingSockets) {
                    if (!sockFile.endsWith(".sock")) continue;
                    let pid = parseInt(sockFile.replace(".sock", ""), 10);
                    if (isNaN(pid)) continue;

                    // Check if process is still alive
                    try { process.kill(pid, 0) } catch {
                        // Process dead - remove stale socket
                        await unlink(join(socketDir, sockFile)).catch(() => {});
                        log(`Removed stale socket for PID ${pid}`);
                    }
                }
            } catch {}
        }

        // Create server with client handler
        log(`Creating socket listener: ${this.socketPath}`);
        this.server = net.createServer((socket) => this.handleMcpClient(socket));

        // Start listening
        await new Promise((resolve, reject) => {
            this.server.listen(this.socketPath, () => {
                log("Socket server listening for connections");
                this.running = true;
                resolve();
            });
            this.server.on("error", (err) => {
                log("Socket server error:", err);
                reject(err);
            });
        });

        // Set socket file permissions to 0600 (owner only)
        if (process.platform !== "win32") {
            try {
                await chmod(this.socketPath, 0o600);
                log("Socket permissions set to 0600");
            } catch (err) {
                log("Failed to set socket permissions:", err);
            }
        }
    }

    async stop() {
        if (!this.running) return;

        // Destroy all client connections
        for (let [, client] of this.mcpClients) {
            client.socket.destroy();
        }
        this.mcpClients.clear();

        // Close server
        if (this.server) {
            await new Promise((resolve) => {
                this.server.close(() => resolve());
            });
            this.server = null;
        }

        // Clean up socket file and directory
        if (process.platform !== "win32" && this.socketPath) {
            try { await unlink(this.socketPath); log("Cleaned up socket file"); } catch {}
            try {
                let socketDir = getSocketDirectory();
                if ((await readdir(socketDir)).length === 0) {
                    await rmdir(socketDir);
                    log("Removed empty socket directory");
                }
            } catch {}
        }
        this.running = false;
    }

    async handleMessage(message) {
        let parsed = JSON.parse(message);

        switch (parsed.type) {
            case "ping":
                // Respond with pong
                sendToChrome(JSON.stringify({ type: "pong", timestamp: Date.now() }));
                break;

            case "get_status":
                // Return native host version
                sendToChrome(JSON.stringify({
                    type: "status_response",
                    native_host_version: NATIVE_HOST_VERSION
                }));
                break;

            case "tool_response":
            case "notification":
                // Forward to all connected MCP clients with 4-byte length prefix
                if (this.mcpClients.size > 0) {
                    let { type, ...payload } = parsed;
                    let jsonStr = JSON.stringify(payload);
                    let payloadBuf = Buffer.from(jsonStr, "utf-8");
                    let lenBuf = Buffer.alloc(4);
                    lenBuf.writeUInt32LE(payloadBuf.length, 0);
                    let message = Buffer.concat([lenBuf, payloadBuf]);

                    for (let [clientId, client] of this.mcpClients) {
                        try { client.socket.write(message); }
                        catch (err) { log(`Failed to send to client ${clientId}:`, err); }
                    }
                }
                break;

            default:
                sendToChrome(JSON.stringify({
                    type: "error",
                    error: `Unknown message type: ${parsed.type}`
                }));
        }
    }

    handleMcpClient(socket) {
        let clientId = this.nextClientId++;
        let clientState = { id: clientId, socket: socket, buffer: Buffer.alloc(0) };

        this.mcpClients.set(clientId, clientState);
        log(`MCP client ${clientId} connected. Total clients: ${this.mcpClients.size}`);

        // Notify Chrome of new connection
        sendToChrome(JSON.stringify({ type: "mcp_connected" }));

        // Handle incoming data with 4-byte length-prefix framing
        socket.on("data", (data) => {
            clientState.buffer = Buffer.concat([clientState.buffer, data]);

            // Process all complete messages in buffer
            while (clientState.buffer.length >= 4) {
                let msgLen = clientState.buffer.readUInt32LE(0);

                // Validate message length
                if (msgLen === 0 || msgLen > MAX_MESSAGE_SIZE) {
                    log(`Invalid message length from client ${clientId}: ${msgLen}`);
                    socket.destroy();
                    return;
                }

                // Check if complete message is available
                if (clientState.buffer.length < 4 + msgLen) break;

                // Extract and process message
                let msgBuf = clientState.buffer.slice(4, 4 + msgLen);
                clientState.buffer = clientState.buffer.slice(4 + msgLen);

                try {
                    let parsed = JSON.parse(msgBuf.toString("utf-8"));
                    log(`Forwarding tool request from client ${clientId}: ${parsed.method}`);

                    // Forward to Chrome
                    sendToChrome(JSON.stringify({
                        type: "tool_request",
                        method: parsed.method,
                        params: parsed.params
                    }));
                } catch (err) {
                    log(`Failed to parse request from client ${clientId}:`, err);
                }
            }
        });

        socket.on("error", (err) => {
            log(`MCP client ${clientId} error: ${err}`);
        });

        socket.on("close", () => {
            log(`MCP client ${clientId} disconnected. Remaining: ${this.mcpClients.size - 1}`);
            this.mcpClients.delete(clientId);
            sendToChrome(JSON.stringify({ type: "mcp_disconnected" }));
        });
    }
}

// Mapping: JVq→McpHub, kW1→generateSocketPath, HQ6→getSocketDirectory, xo8→process.platform,
//          DOz→stat, uo8→unlink, JOz→mkdir, $Vq→chmod, HVq→readdir, $Oz→net.createServer,
//          mo8→MAX_MESSAGE_SIZE, i1→JSON.parse, B6→JSON.stringify, DH→log, a_6→sendToChrome
```

### McpHub Key Algorithms

**Algorithm 1: Stale Socket Cleanup**

**What it does:** Removes socket files left behind by crashed processes.

**How it works:**
1. Scan `~/.claude/sockets/` for `*.sock` files
2. Extract PID from filename (format: `<pid>.sock`)
3. Test if process is alive with `process.kill(pid, 0)`
4. If process dead (kill throws), delete the socket file

**Why this matters:** Without cleanup, new processes would fail to bind to their sockets because the old files still exist.

**Algorithm 2: 4-Byte Length-Prefix Framing**

**What it does:** Defines message boundaries in a stream-based protocol.

**How it works:**
1. Sender: Write 4-byte little-endian length, then payload bytes
2. Receiver: Read 4 bytes → get length N → read N bytes → complete message
3. Buffer incomplete messages until all bytes arrive

**Why this approach:**
- TCP is stream-based; message boundaries aren't preserved
- Length prefix is unambiguous and efficient
- Little-endian matches x86/ARM architecture (native byte order)

**Algorithm 3: Message Routing**

**What it does:** Routes messages between Chrome extension and MCP clients.

**How it works:**
```
Chrome Extension ←→ McpHub ←→ MCP Client 1
                              ←→ MCP Client 2
                              ←→ MCP Client N
```

- `ping`, `get_status`: Handled by McpHub directly
- `tool_response`, `notification`: Broadcast to all MCP clients
- `tool_request` (from MCP client): Forward to Chrome
- `mcp_connected`, `mcp_disconnected`: Status notifications to Chrome

// READABLE (for understanding):
class McpHub {
    mcpClients = new Map();      // Connected MCP clients: Map<clientId, {id, socket, buffer}>
    nextClientId = 1;            // Counter for unique IDs
    server = null;               // Net server instance
    running = false;             // Server state flag
    socketPath = null;           // Path to Unix socket (e.g., ~/.claude/sockets/12345.sock)

    async start() {
        if (this.running) return;
        this.socketPath = generateSocketPath();  // kW1()

        // On non-Windows: setup socket directory with proper permissions
        if (process.platform !== "win32") {
            const socketDir = getSocketDirectory();  // HQ6() → ~/.claude/sockets
            try {
                if (!(await stat(socketDir)).isDirectory()) {
                    await mkdir(socketDir);
                }
            } catch {}

            // Create directory with mode 0700 (owner-only)
            await mkdir(socketDir, { recursive: true, mode: 0o700 });
            await chmod(socketDir, 0o700).catch(() => {});

            // Clean up stale socket files from dead processes
            try {
                const entries = await readdir(socketDir);
                for (const entry of entries) {
                    if (!entry.endsWith(".sock")) continue;
                    const pid = parseInt(entry.replace(".sock", ""), 10);
                    if (isNaN(pid)) continue;
                    try {
                        process.kill(pid, 0);  // Signal 0 = check if process exists
                    } catch {
                        // Process doesn't exist → socket file is stale
                        await unlink(joinPath(socketDir, entry)).catch(() => {});
                        log(`Removed stale socket for PID ${pid}`);
                    }
                }
            } catch {}
        }

        // Create the socket server
        this.server = net.createServer((socket) => this.handleMcpClient(socket));

        await new Promise((resolve, reject) => {
            this.server.listen(this.socketPath, () => {
                this.running = true;
                resolve();
            });
            this.server.on("error", (err) => reject(err));
        });

        // Set socket file permissions to 0600 (owner read/write only)
        if (process.platform !== "win32") {
            await chmod(this.socketPath, 0o600);
        }
    }

    handleMcpClient(socket) {
        const clientId = this.nextClientId++;
        const client = { id: clientId, socket, buffer: Buffer.alloc(0) };
        this.mcpClients.set(clientId, client);

        // 4-byte little-endian length prefix framing
        socket.on("data", (chunk) => {
            client.buffer = Buffer.concat([client.buffer, chunk]);

            // Process all complete messages in buffer
            while (client.buffer.length >= 4) {
                const msgLen = client.buffer.readUInt32LE(0);

                // Validate message length
                if (msgLen === 0 || msgLen > MAX_MESSAGE_SIZE) {
                    socket.destroy();  // Invalid → close connection
                    return;
                }

                // Wait for complete message
                if (client.buffer.length < 4 + msgLen) break;

                // Extract and process message
                const payload = client.buffer.slice(4, 4 + msgLen);
                client.buffer = client.buffer.slice(4 + msgLen);

                try {
                    const message = JSON.parse(payload.toString("utf-8"));
                    // Route message to handler...
                } catch (err) {
                    // Log parse error but continue
                }
            }
        });
    }
}

// Mapping: JVq→McpHub, mcpClients→mcpClients, kW1→generateSocketPath, HQ6→getSocketDirectory,
//          xo8→process.platform, $Oz→net.createServer, $Vq→chmod, DH→log, mo8→MAX_MESSAGE_SIZE
```

### Key Algorithm: Stale Socket Cleanup

**What it does:** Before starting the socket server, McpHub scans for orphaned `.sock` files from previous Claude Code instances that crashed or were force-killed.

**How it works:**
1. Read all files in `~/.claude/sockets/`
2. For each `.sock` file, extract the PID from the filename (e.g., `12345.sock` → PID 12345)
3. Use `process.kill(pid, 0)` to check if that process still exists
4. If `kill` throws `ESRCH` (no such process), the socket file is stale → delete it
5. This prevents accumulating zombie socket files over time

**Why this matters:** Without cleanup, the socket directory would accumulate files from every crashed session. The `process.kill(pid, 0)` technique is a POSIX standard way to check process liveness without actually sending a signal.

> **Corrected Symbol:** The previously documented `nXq` as McpHub was incorrect. The actual McpHub class is `JVq` in chunks.178.mjs:235.

---

### Session State Persistence

**What it does:** Syncs MCP server/tool/resource state to a local JSON file for CLI discovery.

The session state is managed through the app state observer pattern rather than a single function. When the MCP clients reference changes, the state is written to `~/.claude/claude-code-mcp-cli/<sessionId>.json`.

**How it works:**
1. App state changes trigger an observer
2. If MCP clients reference changed, state is serialized
3. Written atomically to the session file
4. `mcp-cli info` reads from this file for tool discovery

---

## Command Parse Regex: Full Breakdown

The `parseMcpCliCommand` (ce) regex deserves deep analysis because it defines the boundary between MCP and regular bash:

```
/^mcp-cli\s+(call|read)\s+([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(?:\s+([\s\S]+))?$/
```

| Segment | Meaning |
|---|---|
| `^mcp-cli` | Must be at start of string (no prefix commands allowed) |
| `\s+` | One or more spaces between tokens |
| `(call\|read)` | Capture group 1: only these two subcommands trigger interception |
| `([a-zA-Z0-9_-]+)` | Capture group 2: server name (alphanumeric, underscores, hyphens) |
| `\/` | Literal `/` separator between server and tool |
| `([a-zA-Z0-9_-]+)` | Capture group 3: tool name (same charset as server name) |
| `(?:\s+([\s\S]+))?` | Optional: capture group 4 = JSON args (any chars including newlines) |
| `$` | Must be end of string |

**What this intentionally excludes:**
- `mcp-cli info` — NOT intercepted; handled by the session state file lookup, not live execution
- `mcp-cli servers`, `mcp-cli tools`, etc. — these are passthrough subcommands to the real `mcp-cli` binary
- Piped commands (`mcp-cli call server/tool | jq`) — the `$` anchor prevents matching if the command continues

**Why `[\s\S]+` for args:** The args section must match JSON objects which may contain embedded newlines (pretty-printed JSON). `[\s\S]` matches any character including `\n`, unlike `.` which excludes newlines in default JavaScript regex mode.

---

## Tool Execution Pipeline

### Complete Flow from Command to Result

```
User types: mcp-cli call sqlite/query '{"sql": "SELECT * FROM users"}'
    │
    ▼
Bash tool receives command string
    │
    ▼
parseMcpCliCommand (ce) → extracts { server: "sqlite", tool: "query", args: '{"sql":...}' }
    │
    ▼
processMcpCliResult (CYz)
    │
    ├─ callMcpServer (ECA)
    │    │
    │    ├─ findMcpClientByServerName("sqlite") [Jf1]
    │    │    └─ Returns connected McpClient instance
    │    │
    │    ├─ client.callTool("query", { sql: "SELECT..." })
    │    │    └─ JSON-RPC request via transport
    │    │
    │    └─ Response normalization (4 formats handled)
    │
    ├─ formatMcpResult → string output
    │
    └─ If output.length > MAX_INLINE_OUTPUT:
         └─ Save to temp file, return path reference
```

### callMcpServer (ECA) - Full Implementation

```javascript
// ============================================
// callMcpServer - Execute MCP tool and normalize response
// Location: chunks.145.mjs (referenced in mcp_hub.md)
// ============================================

// READABLE (for understanding):
async function callMcpServer(parsedCommand, context) {
    const { server, tool, args } = parsedCommand;

    // Step 1: Find the MCP client for this server
    const client = findMcpClientByServerName(server);
    if (!client) {
        throw new Error(`MCP server "${server}" not found or not connected`);
    }

    // Step 2: Parse args if string, validate JSON
    let toolArgs = typeof args === 'string' ? JSON.parse(args) : args;

    // Step 3: Call the tool via JSON-RPC
    const result = await client.callTool(tool, toolArgs, {
        signal: AbortSignal.timeout(30_000)  // 30-second timeout
    });

    // Step 4: Normalize response format
    return normalizeMcpResponse(result);
}

function normalizeMcpResponse(result) {
    // Handle error responses
    if (result.isError) {
        const errorMsg = extractTextContent(result.content);
        return { error: `[MCP Error] ${errorMsg}`, isError: true };
    }

    // Handle mixed content (text + binary)
    const parts = [];
    for (const item of result.content) {
        if (item.type === 'text') {
            parts.push(item.text);
        } else if (item.type === 'image') {
            // Save image to temp file, return path reference
            const path = saveBase64ToTempFile(item.data, item.mimeType);
            parts.push(`[Image saved to: ${path}]`);
        } else if (item.type === 'blob') {
            // Handle binary content (PDFs, audio, etc.)
            const path = saveBlobToTempFile(item.data, item.mimeType);
            parts.push(`[Binary file saved to: ${path}]`);
        }
    }

    return { content: parts.join('\n'), isError: false };
}

// Mapping: ECA→callMcpServer, Jf1→findMcpClientByServerName
```

---

## Response Format Normalization Matrix

| Input Format | Example | Normalized Output |
|---|---|---|
| Text content | `{content: [{type: "text", text: "result"}]}` | `"result"` |
| Error response | `{content: [{type: "text", text: "fail"}], isError: true}` | `"[MCP Error] fail"` |
| Image content | `{content: [{type: "image", data: "base64...", mimeType: "image/png"}]}` | `"[Image saved to: /tmp/...]"` |
| Binary blob | `{content: [{type: "blob", data: "base64...", mimeType: "application/pdf"}]}` | `"[Binary file saved to: /tmp/...]"` |
| Mixed content | `{content: [{type: "text", text: "see attached"}, {type: "image", ...}]}` | Multi-line with file refs |

**Why this normalization matters:**
- MCP servers from different vendors return inconsistent formats
- The Bash tool expects a string output, not structured objects
- Binary content cannot be rendered in terminal context
- File references allow the model to selectively read portions

---

## Safety Instruction Enforcement

The `buildMcpCliInstructions` (FOq) function generates a mandatory two-step protocol injected into the system prompt:

```
MANDATORY WORKFLOW:
1. ALWAYS call: mcp-cli info <server>/<tool>
   BEFORE calling: mcp-cli call <server>/<tool> {...}

This is a BLOCKING REQUIREMENT. Skipping info causes incorrect parameters.
```

**Why this matters:**
- MCP tool schemas are not included in the main system prompt (context efficiency)
- Without the schema, the model would guess parameter names and types → frequent tool call failures
- The two-step mirrors the `Read` → `Edit` pattern for files: always inspect before acting
- The word "BLOCKING" in the instruction exploits the model's training to treat such emphatic language as hard constraints

**What happens if the model skips info:**
- `callMcpServer` (ECA) receives unvalidated args
- The MCP server may reject with a JSON Schema validation error
- The error is returned to the model as tool output
- The model then calls `info` (now knowing it should have done this first) and retries
- This graceful degradation path exists but is far slower than compliance

---

## Large Output File Reference

When a tool call returns a very large response, `processMcpCliResult` (CYz) saves it to a temp file instead of including it inline. In v2.1.76, this extends to binary content: PDFs and audio returned by MCP servers are saved to disk rather than transmitted inline as base64.

```javascript
// ============================================
// processMcpCliResult - Handle large MCP tool output via file reference
// Location: chunks.170.mjs:473-510
// ============================================

// ORIGINAL (for source lookup):
async function CYz(A, q) {
  let K = await ECA(A);
  if (!K) return null;
  let Y = formatMcpResult(K);
  if (Y.length > MAX_INLINE_OUTPUT) {
    let z = path.join(os.tmpdir(), `mcp-output-${Date.now()}.txt`);
    await fs.writeFile(z, Y);
    return { stdout: `Output saved to: ${z}\nUse Bash to read it.`, rawOutputPath: z };
  }
  return { stdout: Y };
}

// READABLE (for understanding):
async function processMcpCliResult(parsedCommand, context) {
  const result = await callMcpServer(parsedCommand);  // [ECA]
  if (!result) return null;

  const formattedOutput = formatMcpResult(result);

  // If output exceeds threshold, save to file to avoid polluting context window
  if (formattedOutput.length > MAX_INLINE_OUTPUT) {
    const outputFile = path.join(os.tmpdir(), `mcp-output-${Date.now()}.txt`);
    await fs.writeFile(outputFile, formattedOutput);
    return {
      stdout: `Output saved to: ${outputFile}\nUse Bash to read it.`,
      rawOutputPath: outputFile  // caller can access full content if needed
    };
  }

  return { stdout: formattedOutput };
}

// Mapping: CYz→processMcpCliResult, A→parsedCommand, q→context, K→result, Y→formattedOutput, z→outputFile
```

**Binary content handling (v2.1.76):** When the MCP result contains a content block with `type: "blob"` (PDFs, audio files, images above size threshold), the system writes the binary to a temp file and substitutes a file path reference. This avoids embedding large base64 payloads in the terminal context window, which would rapidly consume token budget.

**Design rationale for file reference approach:**
- Large tool outputs (e.g., database query results with thousands of rows) could consume enormous context
- Saving to a file lets the model selectively read portions using `head`, `grep`, or line ranges
- The `rawOutputPath` field in the return value lets the caller programmatically access the full content if needed for further processing

---

## callMcpServer (ECA) Response Normalization

`callMcpServer` (ECA, chunks.145.mjs:1627) normalizes three different MCP response formats into a single structure:

**Format 1: Text content array**
```json
{ "content": [{ "type": "text", "text": "result string" }] }
```
→ Extracted as: `result.content[0].text`

**Format 2: Mixed content array**
```json
{ "content": [
  { "type": "text", "text": "description" },
  { "type": "image", "data": "base64...", "mimeType": "image/png" }
]}
```
→ Text parts joined with `\n`, image parts saved as temp files with references

**Format 3: isError response**
```json
{ "content": [{ "type": "text", "text": "error message" }], "isError": true }
```
→ Returned as error string prefixed with `[MCP Error] ` so the model knows to handle it as a tool failure

**Format 4: Binary blob (v2.1.76)**
```json
{ "content": [{ "type": "blob", "data": "base64...", "mimeType": "application/pdf" }] }
```
→ Decoded and saved to temp file; path reference returned to model

**Normalization rationale:** MCP servers from different vendors format their responses inconsistently. The normalization layer at `callMcpServer` means the rest of Claude Code always gets a predictable string output, regardless of which MCP server produced it.

---

## State Persistence Flow

```
App state change (setState())
    ↓
onChangeAppStateHandler (K11) — reference equality guard
    ↓ (only if mcp reference changed)
updateMcpSessionState (CJq)
    ↓
getMcpSessionFilePath (ST6) → ~/.claude/claude-code-mcp-cli/{sessionId}.json
    ↓
writeAtomic (u2z) — atomic file write prevents partial reads
    ↓
Session file available for mcp-cli child process reads
```

**Atomic write importance:** The session file is read by `mcp-cli info` commands. A non-atomic write could result in the child process reading a partially written file (e.g., truncated JSON). The `writeAtomic` function writes to a temp file in the same directory, then renames it — renames are atomic on POSIX filesystems within the same partition.

---

## Integration with 04_system_reminder

### MCP Instructions in System Prompt

**What it does:** The `buildMcpCliInstructions` function (FOq in chunks.169.mjs) generates the MCP tool discovery section that gets injected into the system prompt for every LLM call.

**How it integrates:**
```
System Prompt Builder
    │
    ├─ Check if mcpClients.length > 0
    │
    ├─ If yes: call buildMcpCliInstructions(context)
    │     │
    │     └─ Returns markdown block:
    │         "## MCP Tools
    │          You have access to N tools via MCP servers: server1, server2
    │          MANDATORY WORKFLOW: mcp-cli info BEFORE mcp-cli call"
    │
    └─ Append to system prompt
```

### Session State as System Context

The session state file (`~/.claude/claude-code-mcp-cli/{sessionId}.json`) serves two purposes:

1. **CLI Discovery:** `mcp-cli info` reads from this file to show tool schemas
2. **System Context Injection:** The file contents can be used to inform the system prompt about available tools

### Dynamic Tool Discovery Flow

```
MCP Server Connects
    │
    ▼
McpClient.onConnected fires
    │
    ▼
App state: mcpClients updated
    │
    ├─► onChangeAppStateHandler triggered
    │       │
    │       └─► Session file written (atomic)
    │
    └─► System prompt builder picks up new tools
            on next LLM call
```

### Message Types Handled by McpHub

| Message Type | Direction | Purpose |
|-------------|-----------|---------|
| `ping` | Chrome → Hub | Health check, responds with `pong` |
| `get_status` | Chrome → Hub | Returns native host version |
| `tool_request` | Chrome → Hub | Forward to MCP server for execution |
| `tool_response` | MCP Server → Hub | Forward back to Chrome extension |
| `notification` | Either direction | Broadcast to all connected clients |
| `mcp_connected` | Hub → Chrome | Signals new MCP client registration |
| `mcp_disconnected` | Hub → Chrome | Signals MCP client removal |

See also: [ui_linkage.md](./ui_linkage.md) for the K11 observer details, [mcp_hub.md](./mcp_hub.md) for MCPContext endpoint mode, [cross_module_integration.md](./cross_module_integration.md) for full integration map.

---

## Elicitation Request Handler (WT7)

### What it does

The `setupElicitationRequestHandler` (WT7) function registers handlers for MCP elicitation requests on an MCP client. Elicitation allows MCP servers to request user input mid-operation (e.g., OAuth tokens, configuration values, multi-step forms).

### Location

**chunks.58.mjs:3-84**

### Implementation

```javascript
// ============================================
// setupElicitationRequestHandler - Register elicitation handlers on MCP client
// Location: chunks.58.mjs:3-84
// ============================================

// ORIGINAL (for source lookup):
function WT7(A, q, K) {
    try {
        A.setRequestHandler(yp, async (Y, z) => {
            n1(q, `Received elicitation request: ${B6(Y)}`);
            let _ = jB3(Y.params);
            d("tengu_mcp_elicitation_shown", { mode: _ });
            try {
                // Step 1: Check if hook can resolve this
                let w = await sx6(q, Y.params, z.signal);
                if (w) return n1(q, `Elicitation resolved by hook: ${B6(w)}`), w;

                // Step 2: Show UI dialog and wait for user response
                let O = _ === "url" && "elicitationId" in Y.params ? Y.params.elicitationId : void 0,
                    H = await new Promise((J) => {
                        let M = () => { J({ action: "cancel" }) };
                        if (z.signal.aborted) { M(); return; }

                        // Add to elicitation queue for UI rendering
                        K((X) => ({
                            ...X,
                            elicitation: {
                                queue: [...X.elicitation.queue, {
                                    serverName: q,
                                    requestId: z.requestId,
                                    params: Y.params,
                                    signal: z.signal,
                                    respond: (P) => { J(P) }
                                }]
                            }
                        }));
                        z.signal.addEventListener("abort", M);
                    });
                return n1(q, `Elicitation response: ${B6(H)}`), await tx6(q, H, z.signal, _, O);
            } catch (w) {
                return EY(q, `Elicitation error: ${w}`), { action: "cancel" };
            }
        });
        // Also handle completion notifications
        A.setNotificationHandler(My6, (Y) => {
            let { elicitationId: z } = Y.params;
            Xm({ message: `MCP server "${q}" confirmed elicitation ${z} complete`, notificationType: "elicitation_complete" });
        });
    } catch { return; }
}

// READABLE (for understanding):
function setupElicitationRequestHandler(mcpClient, serverName, setState) {
    try {
        // Register handler for elicitation/create requests
        mcpClient.setRequestHandler(ElicitationRequestSchema, async (request, context) => {
            logMcp(serverName, `Received elicitation request: ${JSON.stringify(request)}`);

            // Detect mode: "form" (structured) or "url" (OAuth/browser)
            let mode = detectElicitationMode(request.params);
            trackEvent("tengu_mcp_elicitation_shown", { mode });

            try {
                // Step 1: Try to resolve via hook first
                let hookResult = await runElicitationHook(serverName, request.params, context.signal);
                if (hookResult) {
                    logMcp(serverName, `Elicitation resolved by hook: ${JSON.stringify(hookResult)}`);
                    return hookResult;  // Hook resolved, skip UI
                }

                // Step 2: No hook resolution - show UI dialog
                let elicitationId = mode === "url" && "elicitationId" in request.params
                    ? request.params.elicitationId
                    : undefined;

                let userResponse = await new Promise((resolve) => {
                    let onCancel = () => resolve({ action: "cancel" });

                    if (context.signal.aborted) {
                        onCancel();
                        return;
                    }

                    // Add request to queue - UI will render dialog
                    setState((prevState) => ({
                        ...prevState,
                        elicitation: {
                            queue: [...prevState.elicitation.queue, {
                                serverName: serverName,
                                requestId: context.requestId,
                                params: request.params,
                                signal: context.signal,
                                respond: (response) => resolve(response)
                            }]
                        }
                    }));

                    context.signal.addEventListener("abort", onCancel);
                });

                logMcp(serverName, `Elicitation response: ${JSON.stringify(userResponse)}`);

                // Step 3: Post-process response (e.g., call ElicitationResult hook)
                return await processElicitationResult(serverName, userResponse, context.signal, mode, elicitationId);

            } catch (error) {
                logMcpError(serverName, `Elicitation error: ${error}`);
                return { action: "cancel" };
            }
        });

        // Register handler for elicitation/complete notifications
        mcpClient.setNotificationHandler(ElicitationCompleteNotification, (notification) => {
            let { elicitationId } = notification.params;
            showNotification({
                message: `MCP server "${serverName}" confirmed elicitation ${elicitationId} complete`,
                notificationType: "elicitation_complete"
            });
        });
    } catch {
        return;
    }
}

// Mapping: WT7→setupElicitationRequestHandler, A→mcpClient, q→serverName, K→setState
//          yp→ElicitationRequestSchema, jB3→detectElicitationMode, sx6→runElicitationHook
//          tx6→processElicitationResult, My6→ElicitationCompleteNotification, n1→logMcp
```

### Elicitation Flow

```
MCP Server calls tools/call → tool needs user input
    │
    ▼
Server sends: elicitation/create { message, requestedSchema, mode? }
    │
    ▼
WT7 handler receives request
    │
    ├─► sx6 (runElicitationHook) fires
    │       │
    │       ├─ Hook returns result → Return immediately (skip UI)
    │       └─ Hook returns null → Continue to UI
    │
    ▼
Add to elicitation.queue (React state)
    │
    ▼
UI renders ElicitationDialog (ZIq)
    │
    ├─ Form mode: Render JSON Schema fields
    └─ URL mode: Show URL for OAuth flow
    │
    ▼
User responds (accept/decline/cancel)
    │
    ▼
tx6 (processElicitationResult) fires ElicitationResult hook
    │
    ▼
Return { action, content } to MCP server
    │
    ▼
Server continues tool execution
```

### Hook Integration (sx6)

The `sx6` function runs the Elicitation hook before showing the UI dialog:

```javascript
// ============================================
// runElicitationHook - Try to resolve elicitation via hook
// Location: chunks.58.mjs:86-100
// ============================================

// ORIGINAL (for source lookup):
async function sx6(A, q, K) {
    try {
        let Y = q.mode === "url" ? "url" : "form",
            z = "url" in q ? q.url : void 0,
            _ = "elicitationId" in q ? q.elicitationId : void 0,
            { elicitationResponse: w, blockingError: O } = await A$8({
                serverName: A,
                message: q.message,
                requestedSchema: "requestedSchema" in q ? q.requestedSchema : void 0,
                signal: K,
                mode: Y,
                url: z,
                // ...
            });
        return w;
    } catch { return null; }
}

// READABLE (for understanding):
async function runElicitationHook(serverName, params, signal) {
    try {
        let mode = params.mode === "url" ? "url" : "form";
        let url = "url" in params ? params.url : undefined;
        let elicitationId = "elicitationId" in params ? params.elicitationId : undefined;

        let { elicitationResponse, blockingError } = await runHook("Elicitation", {
            serverName: serverName,
            message: params.message,
            requestedSchema: params.requestedSchema,
            signal: signal,
            mode: mode,
            url: url,
            elicitationId: elicitationId
        });

        return elicitationResponse;  // null if hook didn't resolve
    } catch {
        return null;  // Hook errored, continue to UI
    }
}

// Mapping: sx6→runElicitationHook, A$8→runHook, A→serverName, q→params
```

### Response Actions

| Action | Meaning | MCP Server Behavior |
|--------|---------|---------------------|
| `accept` | User provided data | Use `content` field values |
| `decline` | User explicitly declined | Handle gracefully (e.g., cancel operation) |
| `cancel` | User dismissed/timeout | Treat as decline |

### Key Design Decisions

**Why hook runs before UI:**
- Enables automated resolution in non-interactive modes (SDK, CI)
- Allows custom pre-processing of elicitation requests
- Hook can inject default values or modify schemas

**Why abort signal is tracked:**
- If the MCP server cancels the elicitation (e.g., timeout), the UI must close
- The `abort` event listener triggers the cancel flow

**Why elicitationId for URL mode:**
- URL mode often involves external OAuth flows
- The `elicitationId` correlates the `elicitation/complete` notification back to the original request
- Without it, the system wouldn't know which pending request to mark complete

---

## Error Recovery Patterns for MCP Server Disconnections

### What it does

The MCP system handles server disconnections gracefully, attempting automatic reconnection when possible and clearly reporting unrecoverable failures to the model.

### Disconnection Detection

```javascript
// ============================================
// MCP transport error handling - Detect and handle disconnections
// Location: chunks.57.mjs (StdioClientTransport), chunks.80.mjs (HTTP transports)
// ============================================

// Transport-level error detection (stdio)
transport.onerror = (error) => {
    logMcp(serverName, `Transport error: ${error.message}`);
    markServerDisconnected(serverName);
};

transport.onclose = () => {
    logMcp(serverName, `Transport closed`);
    if (shouldReconnect(serverName)) {
        scheduleReconnect(serverName, calculateBackoff(attemptCount));
    } else {
        markServerDisconnected(serverName);
    }
};
```

### Reconnection Strategy

**When reconnection is attempted:**
1. Server was previously connected and healthy
2. Disconnection was not user-initiated
3. Reconnect attempt count is below threshold (typically 3 attempts)
4. Transport type supports reconnection (stdio: spawn new process, HTTP: new connection)

**Backoff calculation:**
```
attempt 1: 1 second delay
attempt 2: 2 second delay
attempt 3: 4 second delay
...exponential backoff with jitter
```

### Tool Call Failure Handling

When a tool call fails due to disconnection:

```javascript
// ============================================
// callMcpServer error handling - Graceful failure with context
// Location: chunks.145.mjs:1627
// ============================================

// READABLE (for understanding):
async function callMcpServerWithRecovery(parsedCommand, context) {
    const { server, tool, args } = parsedCommand;

    try {
        const client = findMcpClientByServerName(server);
        if (!client) {
            // Server not connected - provide helpful error message
            return {
                error: `MCP server "${server}" is not connected. Try "mcp-cli servers" to see available servers.`,
                isError: true,
                isRecoverable: true  // Signal that retry may succeed
            };
        }

        return await client.callTool(tool, args);

    } catch (error) {
        if (error.code === 'TRANSPORT_CLOSED' || error.code === 'ECONNREFUSED') {
            // Transport-level failure - server crashed or became unreachable
            markServerDisconnected(server);
            return {
                error: `MCP server "${server}" connection lost. The server may have crashed. Reconnect and retry.`,
                isError: true,
                isRecoverable: true
            };
        }

        if (error.code === 'ETIMEDOUT' || error.code === 'TIMEOUT') {
            // Timeout - server may be overloaded or hung
            return {
                error: `MCP server "${server}" timed out after 30s. The operation may still be running on the server.`,
                isError: true,
                isRecoverable: false  // Operation state unknown
            };
        }

        // Other errors (validation, server-side errors) - no reconnection needed
        return {
            error: `[MCP Error] ${error.message}`,
            isError: true
        };
    }
}
```

### Recovery Flow Diagram

```
Tool Call Fails
    │
    ▼
Error Type Classification
    │
    ├─► Validation Error
    │       └─► Return error to model (no reconnection)
    │
    ├─► Server-Side Error
    │       └─► Return error to model (server still connected)
    │
    ├─► Transport Error / Timeout
    │       │
    │       ├─► Mark server disconnected
    │       │
    │       ├─► Schedule reconnection?
    │       │       ├─► Yes: Background reconnect attempt
    │       │       └─► No: Just report failure
    │       │
    │       └─► Return error with "reconnect and retry" hint
    │
    ▼
Model receives actionable error message
```

### Key Design Decisions

**Why "reconnect and retry" hint:**
- The model cannot directly reconnect servers (requires user action or system restart)
- Providing a clear hint helps the model explain the situation to the user
- The user can then check if the MCP server is running and restart it if needed

**Why timeout doesn't trigger reconnection:**
- A timeout might mean the server is still processing (just slow)
- Reconnecting could cancel an in-progress operation
- Better to let the model/user decide whether to retry

**Why validation errors don't affect connection state:**
- Validation happens client-side before any network I/O
- Server remains healthy; the problem is the tool arguments
- No reconnection logic needed

---

## Deep Algorithm Analysis

### fetchMcpTools (JE) - Tool Discovery Algorithm

**What it does:** Dynamically discovers all tools exposed by a connected MCP server using the `tools/list` JSON-RPC method, then wraps each tool in a unified interface with permission checks, annotations, and execution handlers.

**Location:** chunks.170.mjs:533-620

**Why this approach:**
- Dynamic discovery allows MCP servers to be added/removed without restart
- Tool prefix (`mcp__serverName__toolName`) prevents name collisions
- SDK mode can optionally disable prefixing via environment variable

**Algorithm Steps:**
1. Verify client is connected and has tools capability
2. Send `tools/list` request via JSON-RPC
3. Normalize response array
4. For each tool: build prefixed name, attach metadata, create handlers
5. Return array of wrapped tool objects

```javascript
// ============================================
// fetchMcpTools - MCP tool discovery and wrapping
// Location: chunks.170.mjs:533-620
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
                async description() {
                    return z.description ?? ""
                },
                async prompt() {
                    return z.description ?? ""
                },
                isConcurrencySafe() {
                    return z.annotations?.readOnlyHint ?? !1
                },
                isReadOnly() {
                    return z.annotations?.readOnlyHint ?? !1
                },
                toAutoClassifierInput(w) {
                    return u3z(w, z.name)
                },
                isDestructive() {
                    return z.annotations?.destructiveHint ?? !1
                },
                isOpenWorld() {
                    return z.annotations?.openWorldHint ?? !1
                },
                inputJSONSchema: z.inputSchema,
                async checkPermissions() {
                    return {
                        behavior: "passthrough",
                        message: "MCPTool requires permission.",
                        suggestions: [{
                            type: "addRules",
                            rules: [{
                                toolName: _,
                                ruleContent: void 0
                            }],
                            behavior: "allow",
                            destination: "localSettings"
                        }]
                    }
                },
                async call(w, O, $, H, j) {
                    // ... execution logic
                }
            };
        });
    } catch { return []; }
});

// READABLE (for understanding):
async function fetchMcpTools(mcpClient) {
    // Gate 1: Only connected clients have tools
    if (mcpClient.type !== "connected") return [];

    try {
        // Gate 2: Check if server declares tools capability
        if (!mcpClient.capabilities?.tools) return [];

        // Step 1: Request tools from MCP server via JSON-RPC
        let response = await mcpClient.client.request({
            method: "tools/list"
        }, ToolListResultSchema);

        // Step 2: Normalize to array
        let tools = ensureArray(response.tools);

        // Step 3: Check if SDK mode should skip tool name prefixing
        let skipPrefix = mcpClient.config.type === "sdk" &&
            isTruthy(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

        // Step 4: Wrap each tool
        return tools.map((tool) => {
            // Build prefixed name: mcp__serverName__toolName
            let prefixedName = buildMcpToolName(mcpClient.name, tool.name);

            return {
                // Base tool properties
                ...baseToolProperties,

                // Name with prefix (unless SDK mode)
                name: skipPrefix ? tool.name : prefixedName,

                // MCP metadata for routing
                mcpInfo: {
                    serverName: mcpClient.name,
                    toolName: tool.name
                },
                isMcp: true,

                // Dynamic properties from MCP schema
                async description() { return tool.description ?? ""; },
                async prompt() { return tool.description ?? ""; },
                inputJSONSchema: tool.inputSchema,

                // Annotation-based properties (v2.1.76 feature)
                isConcurrencySafe() { return tool.annotations?.readOnlyHint ?? false; },
                isReadOnly() { return tool.annotations?.readOnlyHint ?? false; },
                isDestructive() { return tool.annotations?.destructiveHint ?? false; },
                isOpenWorld() { return tool.annotations?.openWorldHint ?? false; },

                // Permission check handler
                async checkPermissions() {
                    return {
                        behavior: "passthrough",
                        message: "MCPTool requires permission.",
                        suggestions: [{
                            type: "addRules",
                            rules: [{ toolName: prefixedName, ruleContent: undefined }],
                            behavior: "allow",
                            destination: "localSettings"
                        }]
                    };
                },

                // Execution handler
                async call(input, context, signal, toolUseContext, onProgress) {
                    // Tool execution via MCP client
                    // ...
                }
            };
        });
    } catch {
        return [];  // Graceful degradation on error
    }
}

// Mapping: JE→fetchMcpTools, A→mcpClient, q→response, K→tools, Y→skipPrefix,
//          z→tool, _→prefixedName, $58→buildMcpToolName, tZq→baseToolProperties,
//          $y6→ToolListResultSchema, Ws→ensureArray, t6→isTruthy
```

**Key Design Decisions:**

| Decision | Rationale |
|----------|-----------|
| Prefix with `mcp__` | Prevents name collisions between MCP servers and built-in tools |
| SDK prefix bypass | Allows SDK mode to use raw tool names for cleaner API |
| Annotation support | Enables MCP servers to declare safety hints (read-only, destructive) |
| Graceful error return | Single server failure doesn't break entire tool registry |

---

### ElicitationDialog (ZIq) - UI Rendering Logic

**What it does:** Renders MCP server input requests as either form-mode (structured fields) or URL-mode (OAuth/browser flows). Uses memoization to prevent re-renders on parent state changes.

**Location:** chunks.190.mjs:1242-1266

**Two render modes:**
1. **Form mode** (`params.mode !== "url"`) - Renders via `FormElicitationDialog` (BWz)
2. **URL mode** (`params.mode === "url"`) - Renders via `UrlElicitationDialog` (gWz)

```javascript
// ============================================
// ElicitationDialog - MCP server input request renderer
// Location: chunks.190.mjs:1242-1266
// ============================================

// ORIGINAL (for source lookup):
function ZIq(A) {
    let q = A6(7),
        {
            event: K,
            onResponse: Y,
            onWaitingDismiss: z
        } = A;
    if (K.params.mode === "url") {
        let w;
        if (q[0] !== K || q[1] !== Y || q[2] !== z) w = XA.default.createElement(gWz, {
            event: K,
            onResponse: Y,
            onWaitingDismiss: z
        }), q[0] = K, q[1] = Y, q[2] = z, q[3] = w;
        else w = q[3];
        return w
    }
    let _;
    if (q[4] !== K || q[5] !== Y) _ = XA.default.createElement(BWz, {
        event: K,
        onResponse: Y
    }), q[4] = K, q[5] = Y, q[6] = _;
    else _ = q[6];
    return _
}

// READABLE (for understanding):
function ElicitationDialog(props) {
    // Memoization cache: [urlEvent, urlOnResponse, urlOnWaitingDismiss, urlElement,
    //                      formEvent, formOnResponse, formElement]
    let cache = useMemoArray(7);

    let { event, onResponse, onWaitingDismiss } = props;

    // URL mode: OAuth/browser flows
    if (event.params.mode === "url") {
        // Check if props changed (memoization)
        if (cache[0] !== event || cache[1] !== onResponse || cache[2] !== onWaitingDismiss) {
            let element = React.createElement(UrlElicitationDialog, {
                event: event,
                onResponse: onResponse,
                onWaitingDismiss: onWaitingDismiss
            });
            cache[0] = event;
            cache[1] = onResponse;
            cache[2] = onWaitingDismiss;
            cache[3] = element;
        }
        return cache[3];
    }

    // Form mode: structured fields from JSON Schema
    if (cache[4] !== event || cache[5] !== onResponse) {
        let element = React.createElement(FormElicitationDialog, {
            event: event,
            onResponse: onResponse
        });
        cache[4] = event;
        cache[5] = onResponse;
        cache[6] = element;
    }
    return cache[6];
}

// Mapping: ZIq→ElicitationDialog, A→props, A6→useMemoArray, K→event, Y→onResponse,
//          z→onWaitingDismiss, gWz→UrlElicitationDialog, BWz→FormElicitationDialog
```

**Memoization Strategy:**
The `useMemoArray(7)` creates a stable cache array that persists across renders. This prevents React from re-creating dialog elements when parent state changes (e.g., other modals opening/closing). The cache tracks:
- Indices 0-3: URL mode state (event, onResponse, onWaitingDismiss, cached element)
- Indices 4-6: Form mode state (event, onResponse, cached element)

**Why separate caches:** URL mode and form mode have different prop signatures. URL mode needs `onWaitingDismiss` for the external browser flow; form mode doesn't need it.

---

### FormElicitationDialog (BWz) - Schema-Driven Form Rendering

**What it does:** Renders a dynamic form from a JSON Schema, pre-populating defaults and handling user input for each property.

**Location:** chunks.190.mjs:1268-1350

```javascript
// ============================================
// FormElicitationDialog - Schema-driven form for MCP elicitation
// Location: chunks.190.mjs:1268-1350
// ============================================

// ORIGINAL (for source lookup):
function BWz({
    event: A,
    onResponse: q
}) {
    let {
        serverName: K,
        signal: Y
    } = A, z = A.params, {
        message: _,
        requestedSchema: w
    } = z, O = Object.keys(w.properties).length > 0, [$, H] = V_.useState(O ? null : "accept"), [j, J] = V_.useState(() => {
        let y6 = {};
        if (w.properties) {
            for (let [G6, R6] of Object.entries(w.properties))
                if (typeof R6 === "object" && R6 !== null) {
                    if (R6.default !== void 0) y6[G6] = R6.default
                }
        }
        return y6
    }), [M, D] = V_.useState(() => {
        let y6 = {};
        for (let [G6, R6] of Object.entries(w.properties))
            if (Wa6(R6) && R6?.default !== void 0) {
                let T6 = Ma6(String(R6.default), R6);
                if (!T6.isValid && T6.error) y6[G6] = T6.error
            }
        return y6
    });
    // ... form rendering
}

// READABLE (for understanding):
function FormElicitationDialog({ event, onResponse }) {
    let { serverName, signal } = event;
    let { message, requestedSchema } = event.params;

    // Check if schema has properties
    let hasProperties = Object.keys(requestedSchema.properties).length > 0;

    // State: current action (null = editing, "accept" | "decline" = ready to submit)
    let [action, setAction] = useState(hasProperties ? null : "accept");

    // State: form values, initialized from schema defaults
    let [values, setValues] = useState(() => {
        let defaults = {};
        if (requestedSchema.properties) {
            for (let [key, prop] of Object.entries(requestedSchema.properties)) {
                if (typeof prop === "object" && prop !== null) {
                    if (prop.default !== undefined) {
                        defaults[key] = prop.default;
                    }
                }
            }
        }
        return defaults;
    });

    // State: validation errors (pre-validated defaults)
    let [errors, setErrors] = useState(() => {
        let validationErrors = {};
        for (let [key, prop] of Object.entries(requestedSchema.properties)) {
            if (isEnumType(prop) && prop?.default !== undefined) {
                let result = validateEnumValue(String(prop.default), prop);
                if (!result.isValid && result.error) {
                    validationErrors[key] = result.error;
                }
            }
        }
        return validationErrors;
    });

    // ... render form fields, buttons, etc.
}

// Mapping: BWz→FormElicitationDialog, A→event, q→onResponse, K→serverName,
//          Y→signal, z→params, _→message, w→requestedSchema, O→hasProperties,
//          $→action, H→setAction, j→values, J→setValues, M→errors, D→setErrors
```

**Form State Machine:**

```
Initial State:
    hasProperties = true  → action = null (editing)
    hasProperties = false → action = "accept" (auto-ready)

User Flow:
    ┌─────────────────────────────────────────────────┐
    │ action = null (editing)                          │
    │   ↓ User fills form                              │
    │ action = "accept" (ready to submit)              │
    │   ↓ User clicks Submit                           │
    │ onResponse({ action: "accept", content: values })│
    └─────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────┐
    │ action = null (editing)                          │
    │   ↓ User clicks Decline                          │
    │ onResponse({ action: "decline" })               │
    └─────────────────────────────────────────────────┘
```

**Default Value Initialization:**
The form initializes values from schema `default` fields. This allows MCP servers to pre-fill forms with suggested values. Validation errors are computed upfront for enum fields to catch invalid defaults.

---

## Binary Content Handling (v2.1.76 Feature)

### What it does

When MCP servers return binary content (PDFs, audio, images above size threshold), the system saves the binary to a temporary file rather than embedding base64 in the terminal output. This prevents context window pollution.

### Implementation

Binary content detection occurs in the response normalization layer:

```javascript
// ============================================
// Binary content detection and file saving
// Location: chunks.170.mjs (response handler)
// ============================================

// READABLE (for understanding):
function normalizeMcpResponse(result) {
    const parts = [];

    for (const item of result.content) {
        if (item.type === 'text') {
            parts.push(item.text);
        } else if (item.type === 'image') {
            // Save image to temp file
            const path = saveBase64ToTempFile(item.data, item.mimeType);
            parts.push(`[Image saved to: ${path}]`);
        } else if (item.type === 'blob') {
            // Binary blob (PDFs, audio, etc.)
            const path = saveBlobToTempFile(item.data, item.mimeType);
            parts.push(`[Binary file saved to: ${path}]`);
        }
    }

    return {
        content: parts.join('\n'),
        isError: result.isError ?? false
    };
}
```

**Supported binary types:**
| Type | Handling | Output |
|------|----------|--------|
| `text` | Inline | Raw text |
| `image` | Base64 decode → file | `[Image saved to: /tmp/...]` |
| `blob` | Base64 decode → file | `[Binary file saved to: /tmp/...]` |

**Why file references:**
- Binary content cannot be rendered in terminal
- Base64 strings consume enormous context window
- File references let the model use `Read` tool selectively

---

## SDK MCP Transport (oi8)

### What it does

The `SdkMcpTransport` class provides MCP transport for SDK mode, routing MCP messages through the SDK's control channel rather than a direct socket/stdio connection. This allows MCP servers to be used in non-interactive/headless mode.

### Location: chunks.169.mjs:1506-1527

```javascript
// ============================================
// SdkMcpTransport - MCP transport for SDK mode
// Location: chunks.169.mjs:1506-1527
// ============================================

// ORIGINAL (for source lookup):
class oi8 {
    serverName;
    sendMcpMessage;
    isClosed = !1;
    onclose;
    onerror;
    onmessage;
    constructor(A, q) {
        this.serverName = A;
        this.sendMcpMessage = q
    }
    async start() {}
    async send(A) {
        if (this.isClosed) throw Error("Transport is closed");
        let q = await this.sendMcpMessage(this.serverName, A);
        if (this.onmessage) this.onmessage(q)
    }
    async close() {
        if (this.isClosed) return;
        this.isClosed = !0, this.onclose?.()
    }
}

// READABLE (for understanding):
class SdkMcpTransport {
    serverName;           // Name of the MCP server
    sendMcpMessage;       // Callback to send message through SDK control channel
    isClosed = false;     // Transport state
    onclose;              // Close handler
    onerror;              // Error handler
    onmessage;            // Message handler (receives responses)

    constructor(serverName, sendMcpMessageCallback) {
        this.serverName = serverName;
        this.sendMcpMessage = sendMcpMessageCallback;
    }

    // No-op: SDK transport doesn't need explicit start
    async start() {}

    // Send MCP message through SDK control channel
    async send(message) {
        if (this.isClosed) {
            throw new Error("Transport is closed");
        }

        // Delegate to SDK's sendMcpMessage (control_request)
        const response = await this.sendMcpMessage(this.serverName, message);

        // Deliver response to MCP client
        if (this.onmessage) {
            this.onmessage(response);
        }
    }

    // Close the transport
    async close() {
        if (this.isClosed) return;
        this.isClosed = true;
        this.onclose?.();
    }
}

// Mapping: oi8→SdkMcpTransport, A→serverName/message, q→sendMcpMessageCallback/response
```

### Key Design Decisions

**Why empty `start()`:**
- SDK transport is always "started" - the control channel exists from SDK initialization
- No separate connection establishment needed

**Why `sendMcpMessage` callback:**
- Routes through SDK's `control_request` mechanism
- Uses `sendMcpMessage` method on StdioStreamIO (see chunks.184.mjs:2221-2230)
- Enables correlation of request/response via SDK protocol

**Integration with StdioStreamIO:**
```javascript
// In StdioStreamIO class (chunks.184.mjs:2221-2230)
async sendMcpMessage(serverName, message) {
    const response = await this.sendControlRequest({
        type: "mcp_request",
        serverName,
        message
    });
    return response.mcp_response;
}
```

### Transport Comparison

| Feature | StdioClientTransport | SSEClientTransport | SdkMcpTransport |
|---------|---------------------|--------------------|-----------------|
| Use case | CLI MCP servers | Remote MCP servers | SDK/headless mode |
| Connection | spawn process | HTTP SSE | Control channel |
| Start required | Yes | Yes | No (always ready) |
| Message delivery | stdin/stdout | HTTP | control_request |

---

## MCP Resource Handling

### What it does

MCP servers can expose resources (files, database schemas, documentation) that Claude Code can access via @-mentions or explicit `resources/list` calls.

### Resource Discovery Flow

```
MCP Server Connects
    │
    ▼
Server capabilities checked for `resources`
    │
    ├─ No resources capability → Skip
    │
    └─ Has resources → Send `resources/list` request
           │
           ▼
       Store resources in app state
           │
           ▼
       Available for:
       • System prompt context
       • @-mention resolution
       • `mcp-cli resources` command
```

### Resource List Changed Notification

When MCP servers add/remove resources dynamically, they send `notifications/resources/list_changed`:

```javascript
// Location: chunks.155.mjs:1551
// Handles resources/list_changed notification

// READABLE (for understanding):
server.onNotification("notifications/resources/list_changed", async () => {
    logMcp(serverName, "Received resources/list_changed notification, refreshing resources");
    trackEvent("tengu_mcp_list_changed", { serverName });

    // Re-fetch resource list
    const resources = await client.request({
        method: "resources/list"
    }, ResourceListSchema);

    // Update app state
    setAppState(prev => ({
        ...prev,
        mcp: {
            ...prev.mcp,
            resources: {
                ...prev.mcp.resources,
                [serverName]: resources
            }
        }
    }));
});
```

### Resource Access via @-mention

When the user types `@serverName:resourceUri`, the system:

1. Parses the @-mention
2. Looks up the MCP server by name
3. Calls `resources/read` with the URI
4. Injects the content into the system prompt

---

## MCP Notification System

### Overview

The MCP protocol uses notifications for server-initiated events. Unlike requests (which expect responses), notifications are fire-and-forget messages that inform the client about state changes or events.

**Location:** Notification handling is distributed across:
- `chunks.11.mjs` - MCP client notification assertions and sending
- `chunks.57.mjs` - Client notification handlers setup (`_setupListChangedHandlers`)
- `chunks.5.mjs` - Notification schema definitions (`Hy6`, `wy6`, `zy6`, `My6`)

### Notification Types

| Notification Method | Purpose | Schema Symbol | Trigger |
|---------------------|---------|---------------|---------|
| `notifications/resources/list_changed` | Resource list updated | `zy6` | Server adds/removes resources |
| `notifications/resources/updated` | Specific resource changed | `ysq` | Resource content modified |
| `notifications/tools/list_changed` | Tool list updated | `Hy6` | Server adds/removes tools |
| `notifications/prompts/list_changed` | Prompt list updated | `wy6` | Server adds/removes prompts |
| `notifications/elicitation/complete` | URL elicitation finished | `My6` | OAuth/URL flow complete |
| `notifications/cancelled` | Request cancelled | - | Client cancelled request |
| `notifications/progress` | Progress update | - | Long-running operation |
| `notifications/message` | Log message | - | Server logging |

### List Changed Handler Setup

**What it does:** Automatically refreshes tool/prompt/resource lists when the MCP server notifies that the list has changed.

**Location:** `chunks.57.mjs:1048-1078`

```javascript
// ============================================
// _setupListChangedHandler - Auto-refresh on list changes
// Location: chunks.57.mjs:1048-1078
// ============================================

// ORIGINAL (for source lookup):
_setupListChangedHandler(A, q, K, Y) {
    let z = fqA.safeParse(K);
    if (!z.success) throw Error(`Invalid ${A} listChanged options: ${z.error.message}`);
    if (typeof K.onChanged !== "function") throw Error(`Invalid ${A} listChanged options: onChanged must be a function`);
    let { autoRefresh: _, debounceMs: w } = z.data,
        { onChanged: O } = K,
        $ = async () => {
            if (!_) { O(null, null); return }
            try {
                let j = await Y();
                O(null, j)
            } catch (j) {
                let J = j instanceof Error ? j : Error(String(j));
                O(J, null)
            }
        },
        H = () => {
            if (w) {
                let j = this._listChangedDebounceTimers.get(A);
                if (j) clearTimeout(j);
                let J = setTimeout($, w);
                this._listChangedDebounceTimers.set(A, J)
            } else $()
        };
    this.setNotificationHandler(q, H)
}

// READABLE (for understanding):
_setupListChangedHandler(itemType, notificationSchema, options, refetchFn) {
    // Validate options
    const parsed = ListChangedOptionsSchema.safeParse(options);
    if (!parsed.success) {
        throw new Error(`Invalid ${itemType} listChanged options: ${parsed.error.message}`);
    }
    if (typeof options.onChanged !== "function") {
        throw new Error(`Invalid ${itemType} listChanged options: onChanged must be a function`);
    }

    const { autoRefresh, debounceMs } = parsed.data;
    const { onChanged } = options;

    // Handler: re-fetch and call onChanged callback
    const handleNotification = async () => {
        if (!autoRefresh) {
            onChanged(null, null);  // Notify without refetching
            return;
        }
        try {
            const freshList = await refetchFn();
            onChanged(null, freshList);
        } catch (error) {
            const normalizedError = error instanceof Error ? error : new Error(String(error));
            onChanged(normalizedError, null);
        }
    };

    // Optional debounce wrapper
    const debouncedHandler = () => {
        if (debounceMs) {
            // Clear existing timer
            const existing = this._listChangedDebounceTimers.get(itemType);
            if (existing) clearTimeout(existing);
            // Set new timer
            const timer = setTimeout(handleNotification, debounceMs);
            this._listChangedDebounceTimers.set(itemType, timer);
        } else {
            handleNotification();  // No debounce, immediate
        }
    };

    // Register handler
    this.setNotificationHandler(notificationSchema, debouncedHandler);
}

// Mapping: A→itemType, q→notificationSchema, K→options, Y→refetchFn, O→onChanged
//          fqA→ListChangedOptionsSchema, w→debounceMs, _→autoRefresh
```

### Notification Handler Assertion

**What it does:** Validates that the MCP server has the required capabilities before sending/expecting certain notifications.

**Location:** `chunks.11.mjs:1596-1620`

```javascript
// ============================================
// assertNotificationCapability - Validate server supports notification type
// Location: chunks.11.mjs:1596-1620
// ============================================

// ORIGINAL (for source lookup):
assertNotificationCapability(A) {
    switch (A) {
        case "notifications/message":
            if (!this._capabilities.logging) throw Error(`Server does not support logging (required for ${A})`);
            break;
        case "notifications/resources/updated":
        case "notifications/resources/list_changed":
            if (!this._capabilities.resources) throw Error(`Server does not support notifying about resources (required for ${A})`);
            break;
        case "notifications/tools/list_changed":
            if (!this._capabilities.tools) throw Error(`Server does not support notifying of tool list changes (required for ${A})`);
            break;
        case "notifications/prompts/list_changed":
            if (!this._capabilities.prompts) throw Error(`Server does not support notifying of prompt list changes (required for ${A})`);
            break;
        case "notifications/elicitation/complete":
            if (!this._clientCapabilities?.elicitation?.url) throw Error(`Client does not support URL elicitation (required for ${A})`);
            break;
        case "notifications/cancelled":
            break;
        case "notifications/progress":
            break;
    }
}

// READABLE (for understanding):
assertNotificationCapability(method) {
    switch (method) {
        case "notifications/message":
            // Requires logging capability
            if (!this._capabilities.logging) {
                throw new Error(`Server does not support logging (required for ${method})`);
            }
            break;

        case "notifications/resources/updated":
        case "notifications/resources/list_changed":
            // Requires resources capability
            if (!this._capabilities.resources) {
                throw new Error(`Server does not support notifying about resources (required for ${method})`);
            }
            break;

        case "notifications/tools/list_changed":
            // Requires tools capability
            if (!this._capabilities.tools) {
                throw new Error(`Server does not support notifying of tool list changes (required for ${method})`);
            }
            break;

        case "notifications/prompts/list_changed":
            // Requires prompts capability
            if (!this._capabilities.prompts) {
                throw new Error(`Server does not support notifying of prompt list changes (required for ${method})`);
            }
            break;

        case "notifications/elicitation/complete":
            // Requires URL elicitation support (client capability)
            if (!this._clientCapabilities?.elicitation?.url) {
                throw new Error(`Client does not support URL elicitation (required for ${method})`);
            }
            break;

        case "notifications/cancelled":
        case "notifications/progress":
            // Always allowed, no capability required
            break;
    }
}
```

### Sending Notifications

MCP servers send notifications through the notification method:

```javascript
// ============================================
// Server notification methods
// Location: chunks.11.mjs:1769-1790
// ============================================

// ORIGINAL (for source lookup):
async sendResourceUpdated(A) {
    return this.notification({ method: "notifications/resources/updated", params: A })
}
async sendResourceListChanged() {
    return this.notification({ method: "notifications/resources/list_changed" })
}
async sendToolListChanged() {
    return this.notification({ method: "notifications/tools/list_changed" })
}
async sendPromptListChanged() {
    return this.notification({ method: "notifications/prompts/list_changed" })
}

// READABLE (for understanding):
async sendResourceUpdated(params) {
    // Notify client that a specific resource has new content
    return this.notification({
        method: "notifications/resources/updated",
        params: params  // { uri: string }
    });
}

async sendResourceListChanged() {
    // Notify client that the resource list has changed (new/removed resources)
    return this.notification({
        method: "notifications/resources/list_changed"
    });
}

async sendToolListChanged() {
    // Notify client that tool definitions have changed
    return this.notification({
        method: "notifications/tools/list_changed"
    });
}

async sendPromptListChanged() {
    // Notify client that prompt templates have changed
    return this.notification({
        method: "notifications/prompts/list_changed"
    });
}
```

### Elicitation Complete Notification

**What it does:** Used in URL-mode elicitation to signal that an external OAuth/browser flow has completed.

**Location:** `chunks.11.mjs:1746-1754`

```javascript
// ============================================
// createElicitationCompletionNotifier - Create callback for URL elicitation
// Location: chunks.11.mjs:1746-1754
// ============================================

// ORIGINAL (for source lookup):
createElicitationCompletionNotifier(A, q) {
    if (!this._clientCapabilities?.elicitation?.url) throw Error("Client does not support URL elicitation (required for notifications/elicitation/complete)");
    return () => this.notification({
        method: "notifications/elicitation/complete",
        params: { elicitationId: A }
    }, q)
}

// READABLE (for understanding):
createElicitationCompletionNotifier(elicitationId, options) {
    // Verify client supports URL elicitation
    if (!this._clientCapabilities?.elicitation?.url) {
        throw new Error("Client does not support URL elicitation (required for notifications/elicitation/complete)");
    }

    // Return a function that, when called, notifies the client
    return () => this.notification({
        method: "notifications/elicitation/complete",
        params: { elicitationId }
    }, options);
}

// Mapping: A→elicitationId, q→options
```

### Notification Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MCP Notification Flow                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MCP Server                          Claude Code (Client)                    │
│  ──────────                          ────────────────────                    │
│       │                                    │                                 │
│       │ tools/list changed                 │                                 │
│       │ ─────────────────────────────────► │                                 │
│       │ notifications/tools/list_changed   │                                 │
│       │                                    │                                 │
│       │                          ┌─────────┴─────────┐                      │
│       │                          │ Handler triggered │                      │
│       │                          │ (Hy6 schema)      │                      │
│       │                          └─────────┬─────────┘                      │
│       │                                    │                                 │
│       │                          ┌─────────┴─────────┐                      │
│       │                          │ Debounce check    │                      │
│       │                          │ (default: 300ms)  │                      │
│       │                          └─────────┬─────────┘                      │
│       │                                    │                                 │
│       │    ◄───────────────────────────── │                                 │
│       │         tools/list request        │ Refetch tool list               │
│       │    ──────────────────────────────►│                                 │
│       │         tools/list response       │                                 │
│       │                                    │                                 │
│       │                          ┌─────────┴─────────┐                      │
│       │                          │ onChanged callback │                      │
│       │                          │ Update app state   │                      │
│       │                          │ Refresh UI         │                      │
│       │                          └───────────────────┘                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Debounce Configuration

The `listChanged` handler options support debouncing to prevent rapid-fire refreshes:

```javascript
// chunks.5.mjs:2457-2459
const ListChangedOptionsSchema = z.object({
    autoRefresh: z.boolean().default(true),
    debounceMs: z.number().int().nonnegative().default(300)
});
```

**Why debounce matters:**
- Some MCP servers may send multiple `list_changed` notifications in quick succession during bulk updates
- Without debouncing, each notification would trigger a full list refresh
- The 300ms default debounce window coalesces rapid notifications into a single refresh

### IDE Selection Notification

In addition to MCP protocol notifications, Claude Code receives `selection_changed` notifications from IDE integrations:

**Location:** `chunks.194.mjs:1032-1048`

```javascript
// ============================================
// selection_changed schema - IDE text selection notification
// Location: chunks.194.mjs:1032-1048
// ============================================

// ORIGINAL (for source lookup):
Ia6 = t(P6(), 1), afz = F6(() => C.object({
    method: C.literal("selection_changed"),
    params: C.object({
        selection: C.object({
            start: C.object({
                line: C.number(),
                character: C.number()
            }),
            end: C.object({
                line: C.number(),
                character: C.number()
            })
        }).nullable().optional(),
        text: C.string().optional(),
        filePath: C.string().optional()
    })
}))

// READABLE (for understanding):
const SelectionChangedNotificationSchema = z.object({
    method: z.literal("selection_changed"),
    params: z.object({
        // Selection range (null if no selection/cursor only)
        selection: z.object({
            start: z.object({
                line: z.number(),
                character: z.number()
            }),
            end: z.object({
                line: z.number(),
                character: z.number()
            })
        }).nullable().optional(),

        // Selected text content
        text: z.string().optional(),

        // File path of the selection
        filePath: z.string().optional()
    })
});

// Mapping: Ia6→SelectionChangedNotificationSymbol, afz→SelectionChangedNotificationSchema
```

---

## Deep Algorithm Analysis: fetchMcpTools (JE)

**What it does:** Discovers and registers MCP tools from a connected MCP server, transforming them into Claude Code's internal tool format with proper name prefixing and metadata extraction.

**Location:** `chunks.170.mjs:533-630`

### Algorithm Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         fetchMcpTools Algorithm                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Connection Gate Check                                                   │
│     ├─ client.type !== "connected" → return []                              │
│     └─ !client.capabilities?.tools → return []                              │
│                                                                              │
│  2. Tool Discovery Request                                                  │
│     └─ client.request({ method: "tools/list" }, ToolListResultSchema)      │
│                                                                              │
│  3. Tool Name Prefixing Decision                                            │
│     ├─ SDK mode + CLAUDE_AGENT_SDK_MCP_NO_PREFIX → use original name       │
│     └─ Default → prefix with "mcp__<serverName>__<toolName>"               │
│                                                                              │
│  4. Tool Object Construction                                                │
│     └─ For each tool: build object with mcpInfo, annotations, schema       │
│                                                                              │
│  5. Return Tool Array                                                       │
│     └─ Tools are registered in Claude Code's tool registry                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Code Analysis

```javascript
// ============================================
// fetchMcpTools - Discovers MCP tools from connected server
// Location: chunks.170.mjs:533-630
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
                async prompt() { return z.description ?? "" },
                isConcurrencySafe() { return z.annotations?.readOnlyHint ?? !1 },
                isReadOnly() { return z.annotations?.readOnlyHint ?? !1 },
                toAutoClassifierInput(w) { return u3z(w, z.name) },
                isDestructive() { return z.annotations?.destructiveHint ?? !1 },
                isOpenWorld() { return z.annotations?.openWorldHint ?? !1 },
                inputJSONSchema: z.inputSchema,
                async checkPermissions() {
                    return {
                        behavior: "passthrough",
                        message: "MCPTool requires permission.",
                        suggestions: [{
                            type: "addRules",
                            rules: [{ toolName: _, ruleContent: void 0 }],
                            behavior: "allow",
                            destination: "localSettings"
                        }]
                    }
                },
                async call(w, O, $, H, j) {
                    // Tool execution logic...
                }
            };
        });
    } catch { return []; }
});

// READABLE (for understanding):
async function fetchMcpTools(mcpClient) {
    // ========================================
    // STEP 1: Connection Gate Check
    // ========================================
    // Guard: Only query connected servers
    if (mcpClient.type !== "connected") return [];

    // Guard: Server must advertise tool capabilities
    if (!mcpClient.capabilities?.tools) return [];

    // ========================================
    // STEP 2: Tool Discovery Request
    // ========================================
    let response;
    try {
        response = await mcpClient.client.request({
            method: "tools/list"
        }, ToolListResultSchema);  // $y6 = Zod validation schema
    } catch (error) {
        return [];  // Silently fail - server may not support tools
    }

    // Ensure array format (some servers return { tools: [...] })
    let tools = ensureArray(response.tools);  // Ws()

    // ========================================
    // STEP 3: Tool Name Prefixing Decision
    // ========================================
    // SDK mode can disable prefixing for cleaner tool names
    let skipPrefix = mcpClient.config.type === "sdk" &&
        isTruthy(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

    // ========================================
    // STEP 4: Tool Object Construction
    // ========================================
    return tools.map((tool) => {
        // Build prefixed name: "mcp__sqlite__query"
        let prefixedName = buildMcpToolName(mcpClient.name, tool.name);  // $58()

        return {
            // Base tool properties (tZq = baseToolProperties)
            ...baseToolProperties,

            // Name with prefix (unless skipPrefix is true)
            name: skipPrefix ? tool.name : prefixedName,

            // MCP metadata for routing tool calls back to correct server
            mcpInfo: {
                serverName: mcpClient.name,
                toolName: tool.name
            },
            isMcp: true,  // Flag for MCP tool detection

            // Dynamic properties from MCP schema
            async description() { return tool.description ?? "" },
            async prompt() { return tool.description ?? "" },

            // Annotation-based properties (from MCP tool annotations)
            isConcurrencySafe() { return tool.annotations?.readOnlyHint ?? false },
            isReadOnly() { return tool.annotations?.readOnlyHint ?? false },
            isDestructive() { return tool.annotations?.destructiveHint ?? false },
            isOpenWorld() { return tool.annotations?.openWorldHint ?? false },

            // Input schema for validation
            inputJSONSchema: tool.inputSchema,

            // Permission handling
            async checkPermissions() {
                return {
                    behavior: "passthrough",
                    message: "MCPTool requires permission.",
                    suggestions: [{
                        type: "addRules",
                        rules: [{ toolName: prefixedName, ruleContent: undefined }],
                        behavior: "allow",
                        destination: "localSettings"
                    }]
                };
            },

            // Tool execution (call method)
            async call(input, context, appState, toolUseContext, onProgress) {
                // Tool call logic routed through MCP protocol
                // See callMcpServer for details
            }
        };
    });
}

// Mapping: JE→fetchMcpTools, A→mcpClient, q→response, K→tools, Y→skipPrefix,
//          z→tool, _→prefixedName, $58→buildMcpToolName, tZq→baseToolProperties,
//          $y6→ToolListResultSchema, Ws→ensureArray, t6→isTruthy
```

### Key Design Decisions

**Why tool name prefixing:**
- **Collision prevention**: Multiple MCP servers may expose tools with identical names
- **Namespace isolation**: "query" from sqlite vs "query" from postgres are distinguished
- **Discoverability**: "mcp__sqlite__query" makes the server origin explicit

**Why annotation extraction:**
- MCP servers provide optional `annotations` with hints about tool behavior
- `readOnlyHint` → enables auto-approval in sandbox mode
- `destructiveHint` → signals model to be cautious
- `openWorldHint` → indicates tool may access arbitrary external resources

**Why passthrough permissions:**
- MCP tools use Claude Code's permission system
- `behavior: "passthrough"` routes to MCP-specific permission handling
- Suggestion to add to localSettings provides one-click approval UX

### Tool Name Construction Algorithm

```javascript
// ============================================
// buildMcpToolName - Constructs prefixed MCP tool name
// Location: chunks.170.mjs (helper)
// ============================================

// READABLE (for understanding):
function buildMcpToolName(serverName, toolName) {
    // Normalize: lowercase server name, preserve tool name case
    const normalizedServer = serverName.toLowerCase();

    // Pattern: mcp__<server>__<tool>
    // Example: mcp__sqlite__query, mcp__github__search_repositories
    return `mcp__${normalizedServer}__${toolName}`;
}

// Example outputs:
// buildMcpToolName("sqlite", "query")        → "mcp__sqlite__query"
// buildMcpToolName("GitHub", "search_repos") → "mcp__github__search_repos"
// buildMcpToolName("filesystem", "read")     → "mcp__filesystem__read"
```

### Error Handling Strategy

**What errors are caught:**
1. **Connection errors** - Server disconnected during query
2. **Capability errors** - Server doesn't support `tools/list`
3. **Schema validation errors** - Response doesn't match expected format
4. **Timeout errors** - Server took too long to respond

**Why silent failure:**
- MCP server connections are best-effort
- A single failing server shouldn't break all MCP functionality
- Logging happens at the transport level for debugging

---

## Validated Symbol Summary (Phase 1 Cross-Validation)

### Confirmed Correct Mappings

| Obfuscated | Readable | File:Line | Validation Status |
|------------|----------|-----------|-------------------|
| JE | fetchMcpTools | chunks.170.mjs:533 | ✅ Validated |
| JVq | McpHub | chunks.178.mjs:235 | ✅ Validated |
| oi8 | SdkMcpTransport | chunks.169.mjs:1506 | ✅ Validated |
| WT7 | setupElicitationRequestHandler | chunks.58.mjs:3 | ✅ Validated |
| ZIq | ElicitationDialog | chunks.190.mjs:1242 | ✅ Validated |

### Corrected Mappings

| Obfuscated | Previous Mapping | Correct Mapping | Correct Location |
|------------|-----------------|-----------------|------------------|
| CYz | processMcpCliResult | MCP_TIMEOUT_MS (constant) | chunks.172.mjs:2860 |
| FOq | buildMcpCliInstructions | QR code encoder | chunks.159.mjs:294 |
| CJq | updateMcpSessionState | RemoteSessionDetails component | chunks.162.mjs:3 |
| nXq | McpHub | Object literal `{}` | chunks.165.mjs:864 |
| K11 | onChangeAppStateHandler | Unrelated function | chunks.10.mjs |

### Symbols Needing Further Verification

| Obfuscated | Documented As | Status |
|------------|--------------|--------|
| ce | parseMcpCliCommand | Location unconfirmed |
| ECA | callMcpServer | Location unconfirmed |

---

## Deep Algorithm Analysis: MCP Tool Call Retry with Session Recovery

### What It Does

When an MCP tool call fails due to session disconnection (`qn8` error), the system automatically retries the call after reconnecting. This provides resilience against transient failures like server restarts or network interruptions.

**Location:** chunks.170.mjs:604-667 (inside tool `call` method)

```javascript
// ============================================
// MCP Tool Call Retry Logic - Session recovery retry mechanism
// Location: chunks.170.mjs:604-667
// ============================================

// ORIGINAL (for source lookup):
let D = Date.now(),
    X = 1;
for (let P = 0;; P++) try {
    let W = await yT6(A),
        Z = await F3z({
            client: W,
            clientConnection: A,
            tool: z.name,
            args: w,
            meta: M,
            signal: O.abortController.signal,
            setAppState: O.setAppState,
            onProgress: j && J ? (G) => {
                j({
                    toolUseID: J,
                    data: G
                })
            } : void 0,
            handleElicitation: O.handleElicitation
        });
    if (j && J) j({
        toolUseID: J,
        data: {
            type: "mcp_progress",
            status: "completed",
            serverName: A.name,
            toolName: z.name,
            elapsedTimeMs: Date.now() - D
        }
    });
    return {
        data: Z.content,
        ...Z._meta || Z.structuredContent ? {
            mcpMeta: {
                ...Z._meta && {
                    _meta: Z._meta
                },
                ...Z.structuredContent && {
                    structuredContent: Z.structuredContent
                }
            }
        } : {}
    }
} catch (W) {
    if (W instanceof qn8 && P < X) {
        n1(A.name, `Retrying tool '${z.name}' after session recovery`);
        continue
    }
    if (j && J) j({
        toolUseID: J,
        data: {
            type: "mcp_progress",
            status: "failed",
            serverName: A.name,
            toolName: z.name,
            elapsedTimeMs: Date.now() - D
        }
    });
    if (W instanceof Error && !(W instanceof EV)) {
        let Z = W.constructor.name;
        if (Z === "Error") throw new EV(W.message, W.message.slice(0, 200));
        if (Z === "McpError" && "code" in W && typeof W.code === "number") throw new EV(W.message, `McpError ${W.code}`)
    }
    throw W
}

// READABLE (for understanding):
async function callMcpToolWithRetry(mcpClient, toolName, args, context, onProgress) {
    let startTime = Date.now();
    let maxRetries = 1;  // Only retry once

    for (let attempt = 0; ; attempt++) {
        try {
            // STEP 1: Get a fresh client connection (may reconnect if disconnected)
            let freshClient = await ensureFreshConnection(mcpClient);

            // STEP 2: Execute the tool call
            let result = await executeMcpToolCall({
                client: freshClient,
                clientConnection: mcpClient,
                tool: toolName,
                args: args,
                meta: { "claudecode/toolUseId": context.toolUseId },
                signal: context.abortController.signal,
                setAppState: context.setAppState,
                onProgress: onProgress,
                handleElicitation: context.handleElicitation
            });

            // STEP 3: Report completion progress
            if (onProgress && context.toolUseId) {
                onProgress({
                    toolUseID: context.toolUseId,
                    data: {
                        type: "mcp_progress",
                        status: "completed",
                        serverName: mcpClient.name,
                        toolName: toolName,
                        elapsedTimeMs: Date.now() - startTime
                    }
                });
            }

            // STEP 4: Return result with optional metadata
            return {
                data: result.content,
                // Include _meta and structuredContent if present
                ...(result._meta || result.structuredContent ? {
                    mcpMeta: {
                        ...(result._meta && { _meta: result._meta }),
                        ...(result.structuredContent && { structuredContent: result.structuredContent })
                    }
                } : {})
            };

        } catch (error) {
            // STEP 5: Check if error is recoverable (session lost)
            if (error instanceof McpSessionLostError && attempt < maxRetries) {
                logInfo(mcpClient.name, `Retrying tool '${toolName}' after session recovery`);
                continue;  // Retry the loop
            }

            // STEP 6: Report failure progress
            if (onProgress && context.toolUseId) {
                onProgress({
                    toolUseID: context.toolUseId,
                    data: {
                        type: "mcp_progress",
                        status: "failed",
                        serverName: mcpClient.name,
                        toolName: toolName,
                        elapsedTimeMs: Date.now() - startTime
                    }
                });
            }

            // STEP 7: Wrap generic errors in MCP error type
            if (error instanceof Error && !(error instanceof McpToolExecutionError)) {
                let errorTypeName = error.constructor.name;

                if (errorTypeName === "Error") {
                    throw new McpToolExecutionError(
                        error.message,
                        error.message.slice(0, 200)  // Truncated for display
                    );
                }

                if (errorTypeName === "McpError" && "code" in error && typeof error.code === "number") {
                    throw new McpToolExecutionError(
                        error.message,
                        `McpError ${error.code}`
                    );
                }
            }

            throw error;  // Re-throw as-is
        }
    }
}

// Mapping: D→startTime, X→maxRetries, P→attempt, yT6→ensureFreshConnection, F3z→executeMcpToolCall,
//          qn8→McpSessionLostError, EV→McpToolExecutionError, n1→logInfo, z.name→toolName
```

### Algorithm Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MCP Tool Call Retry Algorithm                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Start Tool Call                                                            │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ for attempt = 0; ; attempt++                                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Get fresh client connection                                          │    │
│  │ let client = await ensureFreshConnection(mcpClient)                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Execute tool call                                                    │    │
│  │ result = await executeMcpToolCall(...)                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ├────────────── SUCCESS ────────────────┐                             │
│       │                                       ▼                             │
│       │                        ┌────────────────────────────────────────┐   │
│       │                        │ Report progress (completed)            │   │
│       │                        │ Return result with metadata            │   │
│       │                        └────────────────────────────────────────┘   │
│       │                                                                      │
│       └────────────── ERROR ─────────────────┐                              │
│                                              ▼                              │
│                        ┌────────────────────────────────────────────────┐   │
│                        │ Is McpSessionLostError?                        │   │
│                        └────────────────────────────────────────────────┘   │
│                                      │                                       │
│                    ┌─────────────────┴─────────────────┐                    │
│                    │ YES                               │ NO                 │
│                    ▼                                   ▼                    │
│         ┌──────────────────────┐           ┌──────────────────────────┐     │
│         │ attempt < maxRetries?│           │ Report progress (failed) │     │
│         └──────────────────────┘           └──────────────────────────┘     │
│                    │                                   │                    │
│         ┌──────────┴──────────┐                       │                    │
│         │ YES                 │ NO                    │                    │
│         ▼                     ▼                       ▼                    │
│  ┌─────────────────┐  ┌────────────────┐   ┌────────────────────────┐      │
│  │ Log retry       │  │ Report failed  │   │ Wrap error in          │      │
│  │ Continue loop   │  │ Throw error    │   │ McpToolExecutionError  │      │
│  └─────────────────┘  └────────────────┘   └────────────────────────┘      │
│         │                     │                       │                    │
│         │                     └───────────────────────┘                    │
│         │                                   │                               │
│         └───────────────────────────────────┼───────────────────────────────│
│                                             ▼                               │
│                                    ┌────────────────┐                        │
│                                    │ Throw error    │                        │
│                                    └────────────────┘                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why Only One Retry

**Design decision:** `maxRetries = 1` means only ONE retry attempt:

1. **Prevents infinite loops:** A genuinely broken server won't cause endless reconnection attempts
2. **Fast failure:** User sees the error quickly if retry doesn't work
3. **Resource efficiency:** Each retry opens a new connection, which is expensive
4. **Logging transparency:** Each retry is logged, so debugging is possible

**What triggers retry:** Only `McpSessionLostError` (`qn8`) triggers retry. Other errors (validation, permission, protocol errors) fail immediately.

### Progress Tracking

The `onProgress` callback receives status updates:

```javascript
// Progress event structure
{
    toolUseID: "toolu_01xyz...",
    data: {
        type: "mcp_progress",
        status: "started" | "completed" | "failed",
        serverName: "sqlite",
        toolName: "query",
        elapsedTimeMs: 1234
    }
}
```

**Why track elapsed time:** The UI can show "Tool took 1.2s" which helps users understand performance.

### Error Wrapping Strategy

```javascript
// Generic Error → McpToolExecutionError (user-friendly message)
if (error.constructor.name === "Error") {
    throw new McpToolExecutionError(error.message, error.message.slice(0, 200));
}

// McpError (from MCP protocol) → McpToolExecutionError with code
if (error.constructor.name === "McpError") {
    throw new McpToolExecutionError(error.message, `McpError ${error.code}`);
}

// Other errors (including McpToolExecutionError) → pass through
throw error;
```

**Why wrap errors:** The UI shows a consistent error format regardless of what the MCP server throws. The 200-character truncation prevents massive error messages from overwhelming the terminal.

---

## Elicitation System Implementation

### setupElicitationRequestHandler (WT7)

**What it does:** Registers request handlers on MCP client for elicitation requests from MCP servers. Implements both form-mode (user fills form) and URL-mode (user visits URL to complete) elicitation.

**Location:** chunks.58.mjs:3-84

```javascript
// ============================================
// setupElicitationRequestHandler - MCP server input request handler
// Location: chunks.58.mjs:3-84
// ============================================

// ORIGINAL (for source lookup):
function WT7(A, q, K) {
    try {
        A.setRequestHandler(yp, async (Y, z) => {
            n1(q, `Received elicitation request: ${B6(Y)}`);
            let _ = jB3(Y.params);
            d("tengu_mcp_elicitation_shown", { mode: _ });
            try {
                let w = await sx6(q, Y.params, z.signal);
                if (w) return n1(q, `Elicitation resolved by hook: ${B6(w)}`), w;
                let O = _ === "url" && "elicitationId" in Y.params ? Y.params.elicitationId : void 0,
                    H = await new Promise((J) => {
                        let M = () => { J({ action: "cancel" }) };
                        if (z.signal.aborted) { M(); return }
                        let D = O ? { actionLabel: "Skip confirmation" } : void 0;
                        K((X) => ({
                            ...X,
                            elicitation: {
                                queue: [...X.elicitation.queue, {
                                    serverName: q,
                                    requestId: z.requestId,
                                    params: Y.params,
                                    signal: z.signal,
                                    waitingState: D,
                                    respond: (P) => {
                                        z.signal.removeEventListener("abort", M);
                                        J(P);
                                    }
                                }]
                            }
                        }));
                        z.signal.addEventListener("abort", M);
                    });
                return await tx6(q, H, z.signal, _, O);
            } catch (w) {
                return { action: "cancel" };
            }
        });
        // Also register completion notification handler for URL mode
        A.setNotificationHandler(My6, (Y) => {
            // Handle ElicitationCompleteNotification
        });
    } catch { return }
}

// READABLE (for understanding):
function setupElicitationRequestHandler(mcpClient, serverName, setAppState) {
    try {
        // Register handler for ElicitationCreateSchema requests
        mcpClient.setRequestHandler(ElicitationCreateSchema, async (request, context) => {
            logInfo(serverName, `Received elicitation request: ${JSON.stringify(request)}`);

            // Determine mode: "url" or "form"
            let mode = detectElicitationMode(request.params);
            trackEvent("tengu_mcp_elicitation_shown", { mode });

            try {
                // STEP 1: Try to resolve via hook first
                let hookResult = await runElicitationHook(serverName, request.params, context.signal);
                if (hookResult) {
                    return hookResult;  // Hook resolved the elicitation
                }

                // STEP 2: Extract elicitationId for URL mode
                let elicitationId = mode === "url" && "elicitationId" in request.params
                    ? request.params.elicitationId
                    : undefined;

                // STEP 3: Queue elicitation for UI
                let response = await new Promise((resolve) => {
                    let onCancel = () => resolve({ action: "cancel" });

                    if (context.signal.aborted) {
                        onCancel();
                        return;
                    }

                    // URL mode gets "Skip confirmation" button
                    let waitingState = elicitationId
                        ? { actionLabel: "Skip confirmation" }
                        : undefined;

                    // Add to elicitation queue in app state
                    setAppState((state) => ({
                        ...state,
                        elicitation: {
                            queue: [...state.elicitation.queue, {
                                serverName,
                                requestId: context.requestId,
                                params: request.params,
                                signal: context.signal,
                                waitingState,
                                respond: (result) => {
                                    context.signal.removeEventListener("abort", onCancel);
                                    resolve(result);
                                }
                            }]
                        }
                    }));

                    context.signal.addEventListener("abort", onCancel);
                });

                // STEP 4: Run result hook and return
                return await runElicitationResultHook(serverName, response, context.signal, mode, elicitationId);

            } catch (error) {
                return { action: "cancel" };
            }
        });
    } catch { return }
}

// Mapping: WT7→setupElicitationRequestHandler, A→mcpClient, q→serverName, K→setAppState,
//          yp→ElicitationCreateSchema, jB3→detectElicitationMode, sx6→runElicitationHook,
//          tx6→runElicitationResultHook, My6→ElicitationCompleteNotification
```

### detectElicitationMode (jB3)

**What it does:** Determines the elicitation mode from the request parameters.

**Location:** chunks.57.mjs:2919-2921

```javascript
// ============================================
// detectElicitationMode - Determine elicitation mode (url vs form)
// Location: chunks.57.mjs:2919-2921
// ============================================

// ORIGINAL (for source lookup):
function jB3(A) {
    return A.mode === "url" ? "url" : "form"
}

// READABLE (for understanding):
function detectElicitationMode(params) {
    // URL mode: user visits a URL to complete
    // Form mode: user fills a form in the terminal UI
    return params.mode === "url" ? "url" : "form";
}

// Mapping: jB3→detectElicitationMode, A→params
```

### isElicitationEnabled (KK6)

**What it does:** Checks if MCP elicitation feature flag is enabled.

**Location:** chunks.57.mjs:2911-2913

```javascript
// ============================================
// isElicitationEnabled - Check tengu_mcp_elicitation feature flag
// Location: chunks.57.mjs:2911-2913
// ============================================

// ORIGINAL (for source lookup):
function KK6() {
    return w8("tengu_mcp_elicitation", !1)
}

// READABLE (for understanding):
function isElicitationEnabled() {
    return getFeatureFlag("tengu_mcp_elicitation", false);  // w8 = getFeatureFlag
}

// Mapping: KK6→isElicitationEnabled, w8→getFeatureFlag
```

### ElicitationDialog (ZIq)

**What it does:** React component that renders the appropriate elicitation UI based on mode.

**Location:** chunks.190.mjs:1242-1266

```javascript
// ============================================
// ElicitationDialog - Mode-switching elicitation UI component
// Location: chunks.190.mjs:1242-1266
// ============================================

// ORIGINAL (for source lookup):
function ZIq(A) {
    let q = A6(7), { event: K, onResponse: Y, onWaitingDismiss: z } = A;
    if (K.params.mode === "url") {
        let w;
        if (q[0] !== K || q[1] !== Y || q[2] !== z)
            w = XA.default.createElement(gWz, { event: K, onResponse: Y, onWaitingDismiss: z }),
            q[0] = K, q[1] = Y, q[2] = z, q[3] = w;
        else w = q[3];
        return w;
    }
    let _;
    if (q[4] !== K || q[5] !== Y)
        _ = XA.default.createElement(BWz, { event: K, onResponse: Y }),
        q[4] = K, q[5] = Y, q[6] = _;
    else _ = q[6];
    return _;
}

// READABLE (for understanding):
function ElicitationDialog({ event, onResponse, onWaitingDismiss }) {
    // useMemoArray(7) - cache for memoization
    let cache = useMemoArray(7);

    // URL mode: render UrlElicitationDialog (gWz)
    if (event.params.mode === "url") {
        if (cache[0] !== event || cache[1] !== onResponse || cache[2] !== onWaitingDismiss) {
            cache[3] = <UrlElicitationDialog
                event={event}
                onResponse={onResponse}
                onWaitingDismiss={onWaitingDismiss}
            />;
            cache[0] = event;
            cache[1] = onResponse;
            cache[2] = onWaitingDismiss;
        }
        return cache[3];
    }

    // Form mode: render FormElicitationDialog (BWz)
    if (cache[4] !== event || cache[5] !== onResponse) {
        cache[6] = <FormElicitationDialog event={event} onResponse={onResponse} />;
        cache[4] = event;
        cache[5] = onResponse;
    }
    return cache[6];
}

// Mapping: ZIq→ElicitationDialog, A6→useMemoArray, K→event, Y→onResponse, z→onWaitingDismiss,
//          gWz→UrlElicitationDialog, BWz→FormElicitationDialog, XA→React
```

**Key insight:** The component uses a 7-element array for memoization instead of React.useMemo because it needs to cache multiple values across renders. This pattern avoids re-creating the child components when props haven't changed.

---

## MCP Tool Call Retry Algorithm with Session Recovery

### What it does

When an MCP tool call fails due to a lost session connection, the system automatically retries after re-establishing the connection. This provides resilience against transient failures common with long-running MCP servers.

### Location

**chunks.170.mjs:605-668** (inside fetchMcpTools → tool.call method)

### How it works

```javascript
// ============================================
// MCP Tool Call with Session Recovery Retry
// Location: chunks.170.mjs:605-668
// ============================================

// ORIGINAL (for source lookup):
async call(w, O, $, H, j) {
    let J = p3z(H), M = J ? { "claudecode/toolUseId": J } : {};
    if (j && J) j({ toolUseID: J, data: { type: "mcp_progress", status: "started", serverName: A.name, toolName: z.name } });
    let D = Date.now(), X = 1;  // maxRetries = 1
    for (let P = 0;; P++) {
        try {
            let W = await yT6(A),  // getMcpClientConnection
                Z = await F3z({
                    client: W, clientConnection: A, tool: z.name, args: w,
                    meta: M, signal: O.abortController.signal, setAppState: O.setAppState,
                    onProgress: j && J ? (G) => { j({ toolUseID: J, data: G }) } : void 0,
                    handleElicitation: O.handleElicitation
                });
            if (j && J) j({ toolUseID: J, data: { type: "mcp_progress", status: "completed", serverName: A.name, toolName: z.name, elapsedTimeMs: Date.now() - D } });
            return { data: Z.content, ...Z._meta || Z.structuredContent ? { mcpMeta: { ...Z._meta && { _meta: Z._meta }, ...Z.structuredContent && { structuredContent: Z.structuredContent } } } : {} }
        } catch (W) {
            if (W instanceof qn8 && P < X) {  // McpSessionLostError
                n1(A.name, `Retrying tool '${z.name}' after session recovery`);
                continue
            }
            if (j && J) j({ toolUseID: J, data: { type: "mcp_progress", status: "failed", serverName: A.name, toolName: z.name, elapsedTimeMs: Date.now() - D } });
            if (W instanceof Error && !(W instanceof EV)) {
                let Z = W.constructor.name;
                if (Z === "Error") throw new EV(W.message, W.message.slice(0, 200));
                if (Z === "McpError" && "code" in W && typeof W.code === "number") throw new EV(W.message, `McpError ${W.code}`)
            }
            throw W
        }
    }
}

// READABLE (for understanding):
async function call(args, context, ...otherParams) {
    let toolUseId = extractToolUseId(context);
    let meta = toolUseId ? { "claudecode/toolUseId": toolUseId } : {};

    // Progress notification: started
    if (onProgress && toolUseId) {
        onProgress({
            toolUseID: toolUseId,
            data: {
                type: "mcp_progress",
                status: "started",
                serverName: mcpClient.name,
                toolName: tool.name
            }
        });
    }

    let startTime = Date.now();
    let maxRetries = 1;

    // Retry loop for session recovery
    for (let attempt = 0; ; attempt++) {
        try {
            // Step 1: Get fresh connection (may reconnect if session was lost)
            let connection = await getMcpClientConnection(mcpClient);

            // Step 2: Execute tool call
            let result = await executeMcpToolCall({
                client: connection,
                clientConnection: mcpClient,
                tool: tool.name,
                args: args,
                meta: meta,
                signal: context.abortController.signal,
                setAppState: context.setAppState,
                onProgress: onProgress,
                handleElicitation: context.handleElicitation
            });

            // Progress notification: completed
            if (onProgress && toolUseId) {
                onProgress({
                    toolUseID: toolUseId,
                    data: {
                        type: "mcp_progress",
                        status: "completed",
                        serverName: mcpClient.name,
                        toolName: tool.name,
                        elapsedTimeMs: Date.now() - startTime
                    }
                });
            }

            return {
                data: result.content,
                ...(result._meta || result.structuredContent ? {
                    mcpMeta: {
                        ...(result._meta && { _meta: result._meta }),
                        ...(result.structuredContent && { structuredContent: result.structuredContent })
                    }
                } : {})
            };

        } catch (error) {
            // Retry on McpSessionLostError
            if (error instanceof McpSessionLostError && attempt < maxRetries) {
                logMcp(mcpClient.name, `Retrying tool '${tool.name}' after session recovery`);
                continue;  // Retry the tool call
            }

            // Progress notification: failed
            if (onProgress && toolUseId) {
                onProgress({
                    toolUseID: toolUseId,
                    data: {
                        type: "mcp_progress",
                        status: "failed",
                        serverName: mcpClient.name,
                        toolName: tool.name,
                        elapsedTimeMs: Date.now() - startTime
                    }
                });
            }

            // Wrap generic errors in McpToolExecutionError
            if (error instanceof Error && !(error instanceof McpToolExecutionError)) {
                let errorType = error.constructor.name;
                if (errorType === "Error") {
                    throw new McpToolExecutionError(error.message, error.message.slice(0, 200));
                }
                if (errorType === "McpError" && "code" in error && typeof error.code === "number") {
                    throw new McpToolExecutionError(error.message, `McpError ${error.code}`);
                }
            }
            throw error;
        }
    }
}

// Mapping: p3z→extractToolUseId, yT6→getMcpClientConnection, F3z→executeMcpToolCall,
//          qn8→McpSessionLostError, EV→McpToolExecutionError, n1→logMcp
```

### Key Algorithm: Session Recovery Retry

**What it does:** Automatically retries MCP tool calls when the session connection is lost, without the model or user needing to intervene.

**How it works:**
1. Tool call enters retry loop (`for (let attempt = 0; ; attempt++)`)
2. `getMcpClientConnection()` (yT6) checks if connection is alive
3. If connection lost, attempts to reconnect automatically
4. `executeMcpToolCall()` (F3z) sends the actual JSON-RPC request
5. If `McpSessionLostError` (qn8) is thrown AND retry count < maxRetries:
   - Log the retry attempt
   - Continue loop (retry the tool call)
6. If any other error or max retries exceeded, throw error

**Why maxRetries = 1:**
- Most session losses are transient and recoverable on first retry
- Multiple retries would mask persistent connection issues
- Prevents infinite loops when MCP server is genuinely down

**Progress Notification Flow:**
```
Tool call started
    │
    ├─► onProgress({ type: "mcp_progress", status: "started" })
    │
    ▼
Execute MCP tool
    │
    ├─► Success
    │       │
    │       └─► onProgress({ status: "completed", elapsedTimeMs })
    │
    └─► Error
            │
            ├─► McpSessionLostError && attempt < 1
            │       └─► Retry (log "Retrying tool after session recovery")
            │
            └─► Other error or max retries
                    └─► onProgress({ status: "failed" })
                        throw McpToolExecutionError
```

### Error Normalization

**Why wrap errors:** The MCP protocol returns various error types. The normalization ensures consistent error handling:

| Original Error | Normalized To | Reason |
|----------------|---------------|--------|
| `Error` (generic) | `McpToolExecutionError` with truncated message | Consistent error type for tool execution failures |
| `McpError` with code | `McpToolExecutionError` with `McpError ${code}` | Preserves MCP-specific error info |
| `McpSessionLostError` | Triggers retry, then `McpToolExecutionError` | Auto-recovery for transient failures |
| `McpToolExecutionError` | Pass through unchanged | Already properly typed |

---

## Integration with 04_system_reminder (Summary)

The MCP module integrates with system reminders through:

1. **MCP Tool Discovery Instructions** - Injected into Bash tool system prompt
2. **Session State File** - `~/.claude/claude-code-mcp-cli/{sessionId}.json` for mcp-cli discovery
3. **Elicitation Hooks** - Elicitation and ElicitationResult hook types
4. **MCP Resource Attachments** - Resources can be injected as system reminder content

### Key Integration Points

```
04_system_reminder ←→ 06_mcp
    │
    ├─ MCP instructions in Bash tool system prompt
    │   └─ "You MUST call mcp-cli info BEFORE mcp-cli call"
    │
    ├─ Session state persistence
    │   └─ onChangeAppState → write session file
    │
    ├─ Elicitation handling
    │   └─ Hook can resolve elicitation before UI dialog
    │
    └─ Resource injection
        └─ @-mention → resources/read → attachment
```
