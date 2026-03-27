# MCP Transport Layer - Complete Analysis (Claude Code 2.1.76)

> Deep analysis of MCP transport implementations: Stdio, SSE, and StreamableHTTP.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP Transport section

Key classes in this document:
- `StdioClientTransport` (SO8) - chunks.57.mjs:1098
- `SSEClientTransport` - chunks.57.mjs:2492
- `StreamableHTTPClientTransport` (j$6) - chunks.80.mjs:650
- `LineBuffer` (Dy6) - chunks.5.mjs:2668

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      MCP TRANSPORT LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  MCP Client                                                          │
│     │                                                                 │
│     ├─→ Transport Interface                                          │
│     │     ├─ start() - Initialize connection                        │
│     │     ├─ send(message) - Send JSON-RPC message                  │
│     │     ├─ close() - Terminate connection                         │
│     │     └─ onmessage - Message callback                           │
│     │                                                                 │
│     ├─→ StdioClientTransport (SO8)                                   │
│     │     ├─ stdin/stdout communication                             │
│     │     ├─ Subprocess spawning                                    │
│     │     └─ Line-based message framing                             │
│     │                                                                 │
│     ├─→ SSEClientTransport                                           │
│     │     ├─ HTTP Server-Sent Events                                │
│     │     ├─ EventSource API                                        │
│     │     └─ POST for requests, SSE for responses                   │
│     │                                                                 │
│     └─→ StreamableHTTPClientTransport (j$6)                         │
│           ├─ HTTP with streaming response                           │
│           ├─ Chunked transfer encoding                              │
│           └─ Single POST request/response cycle                     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Transport Interface

All transports implement a common interface:

```typescript
interface Transport {
  // Start the connection
  start(): Promise<void>;

  // Send a JSON-RPC message
  send(message: JSONRPCMessage): Promise<void>;

  // Close the connection
  close(): Promise<void>;

  // Message callback (set by client)
  onmessage?: (message: JSONRPCMessage) => void;

  // Error callback
  onerror?: (error: Error) => void;

  // Close callback
  onclose?: () => void;
}
```

---

## StdioClientTransport (SO8)

### Overview

Stdio transport spawns a subprocess and communicates via stdin/stdout. This is the most common transport for local MCP servers.

### Implementation

```javascript
// ============================================
// StdioClientTransport - Subprocess-based MCP transport
// Location: chunks.57.mjs:1098-1200
// ============================================

class StdioClientTransport {
  constructor(options) {
    this.command = options.command;
    this.args = options.args || [];
    this.env = options.env;
    this.stderr = options.stderr || "inherit";
    this._process = null;
    this._readBuffer = new LineBuffer();
    this._started = false;
  }

  async start() {
    if (this._started) {
      throw new Error("Transport already started");
    }
    this._started = true;

    // Spawn subprocess
    this._process = spawn(this.command, this.args, {
      env: { ...process.env, ...this.env },
      stdio: ["pipe", "pipe", this.stderr]
    });

    // Handle stdout - line-based JSON messages
    this._process.stdout.on("data", (data) => {
      this._readBuffer.append(data);
      const lines = this._readBuffer.readLines();
      for (const line of lines) {
        try {
          const message = JSON.parse(line);
          this.onmessage?.(message);
        } catch (e) {
          this.onerror?.(new Error(`Invalid JSON: ${line}`));
        }
      }
    });

    // Handle process exit
    this._process.on("close", (code) => {
      this.onclose?.();
    });

    this._process.on("error", (error) => {
      this.onerror?.(error);
    });
  }

  async send(message) {
    if (!this._process || !this._process.stdin.writable) {
      throw new Error("Transport not connected");
    }

    // Write message as single line with newline delimiter
    const json = JSON.stringify(message);
    this._process.stdin.write(json + "\n");
  }

  async close() {
    if (this._process) {
      this._process.kill();
      this._process = null;
    }
  }
}
```

### Message Framing

Messages are delimited by newlines:

```
{"jsonrpc":"2.0","method":"tools/list","id":1}\n
{"jsonrpc":"2.0","result":{"tools":[...]},"id":1}\n
```

### Error Handling

- Process crash → `onerror` with exit code
- Invalid JSON → `onerror` with parse error
- stdin write failure → `onerror` with write error

---

## SSEClientTransport

### Overview

SSE transport uses HTTP Server-Sent Events for server-to-client messages and HTTP POST for client-to-server messages.

### Implementation

```javascript
// ============================================
// SSEClientTransport - HTTP SSE-based MCP transport
// Location: chunks.57.mjs:2492-2600
// ============================================

class SSEClientTransport {
  constructor(options) {
    this.url = options.url;
    this.headers = options.headers || {};
    this._eventSource = null;
    this._messageEndpoint = null;
    this._started = false;
  }

  async start() {
    if (this._started) {
      throw new Error("Transport already started");
    }
    this._started = true;

    // Connect to SSE endpoint
    const eventSource = new EventSource(this.url, {
      headers: this.headers
    });

    // Handle endpoint discovery
    eventSource.addEventListener("endpoint", (event) => {
      this._messageEndpoint = new URL(event.data, this.url);
    });

    // Handle regular messages
    eventSource.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        this.onmessage?.(message);
      } catch (e) {
        this.onerror?.(new Error(`Invalid JSON in SSE message`));
      }
    });

    eventSource.onerror = (error) => {
      this.onerror?.(error);
    };

    this._eventSource = eventSource;

    // Wait for endpoint discovery
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout waiting for endpoint"));
      }, 10000);

      eventSource.addEventListener("endpoint", () => {
        clearTimeout(timeout);
        resolve();
      }, { once: true });
    });
  }

  async send(message) {
    if (!this._messageEndpoint) {
      throw new Error("Transport not connected - no endpoint");
    }

    const response = await fetch(this._messageEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  async close() {
    if (this._eventSource) {
      this._eventSource.close();
      this._eventSource = null;
    }
  }
}
```

### SSE Event Flow

```
Client                              Server
   │                                   │
   ├─→ GET /sse ──────────────────────►│ (EventSource)
   │                                   │
   │◄──────── event: endpoint ─────────┤
   │           data: /message          │
   │                                   │
   ├─→ POST /message ─────────────────►│ (send message)
   │     {"jsonrpc":"2.0",...}         │
   │                                   │
   │◄──────── event: message ──────────┤
   │           data: {"jsonrpc":"2.0",...}
   │                                   │
```

---

## StreamableHTTPClientTransport (j$6)

### Overview

StreamableHTTP uses a single POST request with streaming response for bidirectional communication.

### Implementation

```javascript
// ============================================
// StreamableHTTPClientTransport - HTTP streaming transport
// Location: chunks.80.mjs:650-800
// ============================================

class StreamableHTTPClientTransport {
  constructor(options) {
    this.url = options.url;
    this.headers = options.headers || {};
    this._sessionId = null;
    this._started = false;
  }

  async start() {
    if (this._started) {
      throw new Error("Transport already started");
    }
    this._started = true;

    // Initialize session with GET request
    const response = await fetch(this.url, {
      method: "GET",
      headers: {
        "Accept": "text/event-stream",
        ...this.headers
      }
    });

    // Extract session ID from headers
    this._sessionId = response.headers.get("Mcp-Session-Id");
  }

  async send(message) {
    const headers = {
      "Content-Type": "application/json",
      ...this.headers
    };

    if (this._sessionId) {
      headers["Mcp-Session-Id"] = this._sessionId;
    }

    const response = await fetch(this.url, {
      method: "POST",
      headers,
      body: JSON.stringify(message)
    });

    // Handle streaming response
    const contentType = response.headers.get("Content-Type");

    if (contentType?.includes("text/event-stream")) {
      // Stream SSE events
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const lineBuffer = new LineBuffer();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        lineBuffer.append(decoder.decode(value));
        const lines = lineBuffer.readLines();

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const message = JSON.parse(line.slice(6));
              this.onmessage?.(message);
            } catch (e) {
              this.onerror?.(new Error(`Invalid SSE data`));
            }
          }
        }
      }
    } else if (contentType?.includes("application/json")) {
      // Single JSON response
      const message = await response.json();
      this.onmessage?.(message);
    }
  }

  async close() {
    // Send DELETE to terminate session
    if (this._sessionId) {
      await fetch(this.url, {
        method: "DELETE",
        headers: {
          "Mcp-Session-Id": this._sessionId,
          ...this.headers
        }
      }).catch(() => {});
      this._sessionId = null;
    }
  }
}
```

### Session Management

```
Client                              Server
   │                                   │
   ├─→ GET /mcp ──────────────────────►│ (Initialize)
   │                                   │
   │◄──────── Mcp-Session-Id: abc123 ──┤
   │                                   │
   ├─→ POST /mcp ─────────────────────►│ (Send message)
   │     Mcp-Session-Id: abc123        │
   │     {"jsonrpc":"2.0",...}         │
   │                                   │
   │◄──────── SSE stream ──────────────┤
   │                                   │
   ├─→ DELETE /mcp ───────────────────►│ (Close session)
   │     Mcp-Session-Id: abc123        │
   │                                   │
```

---

## LineBuffer (Dy6)

### Purpose

Buffer for accumulating data and reading complete lines. Used by all transports for message framing.

### Implementation

```javascript
// ============================================
// LineBuffer - Line-based buffer for transport framing
// Location: chunks.5.mjs:2668-2700
// ============================================

class LineBuffer {
  constructor() {
    this._buffer = "";
  }

  append(data) {
    this._buffer += data;
  }

  readLines() {
    const lines = [];
    let newlineIndex;

    while ((newlineIndex = this._buffer.indexOf("\n")) !== -1) {
      const line = this._buffer.slice(0, newlineIndex);
      this._buffer = this._buffer.slice(newlineIndex + 1);
      lines.push(line);
    }

    return lines;
  }

  peek() {
    return this._buffer;
  }

  clear() {
    this._buffer = "";
  }
}
```

---

## Connection Lifecycle

### State Machine

```
         ┌──────────┐
         │  idle    │
         └────┬─────┘
              │ start()
              ▼
         ┌──────────┐
         │ starting │
         └────┬─────┘
              │ connected
              ▼
         ┌──────────┐
    ┌───►│  ready   │◄───┐
    │    └────┬─────┘    │
    │         │          │
    │  error  │ send()   │ message
    │  recover│          │ received
    │         ▼          │
    │    ┌──────────┐    │
    │    │  active  │────┘
    │    └────┬─────┘
    │         │ close()
    │         ▼
    │    ┌──────────┐
    └────│  closed  │
         └──────────┘
```

### Error Recovery

```javascript
// Reconnection logic for transient failures
async function handleTransportError(error, transport) {
  if (isTransientError(error)) {
    // Attempt reconnection
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await transport.close();
        await sleep(1000 * attempt);  // Exponential backoff
        await transport.start();
        return;  // Reconnected successfully
      } catch (e) {
        // Continue retry loop
      }
    }
  }

  // Permanent failure
  transport.onerror?.(error);
}
```

---

## Transport Selection

### Configuration

```json
{
  "mcpServers": {
    "local-server": {
      "command": "mcp-server-local",  // Uses StdioTransport
      "args": ["--port", "8080"]
    },
    "remote-server": {
      "url": "https://api.example.com/mcp/sse",  // Uses SSETransport
      "headers": {
        "Authorization": "Bearer token"
      }
    },
    "streaming-server": {
      "url": "https://api.example.com/mcp",  // Uses StreamableHTTP
      "transport": "streamable-http"
    }
  }
}
```

### Auto-Detection

Transport type is auto-detected from configuration:

```javascript
function createTransport(config) {
  if (config.command) {
    // Command specified → Stdio transport
    return new StdioClientTransport({
      command: config.command,
      args: config.args,
      env: config.env
    });
  }

  if (config.url) {
    // URL specified → HTTP-based transport
    if (config.transport === "streamable-http") {
      return new StreamableHTTPClientTransport({
        url: config.url,
        headers: config.headers
      });
    } else {
      return new SSEClientTransport({
        url: config.url,
        headers: config.headers
      });
    }
  }

  throw new Error("Invalid server configuration");
}
```

---

## Quick Reference

### Transport Comparison

| Feature | Stdio | SSE | StreamableHTTP |
|---------|-------|-----|----------------|
| Process | Subprocess | HTTP | HTTP |
| Direction | stdin/stdout | POST + SSE | POST + Stream |
| Session | Process lifetime | Connection | Session ID |
| Reconnect | Restart process | Reconnect SSE | New session |
| Best for | Local servers | Remote servers | Stateful remote |

### Key Locations

| Symbol | Transport | Location |
|--------|-----------|----------|
| SO8 | StdioClientTransport | chunks.57.mjs:1098 |
| SSEClientTransport | SSEClientTransport | chunks.57.mjs:2492 |
| j$6 | StreamableHTTPClientTransport | chunks.80.mjs:650 |
| Dy6 | LineBuffer | chunks.5.mjs:2668 |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced error recovery |
| 2.1.27 | SSE transport support |
| 2.1.0 | Initial transport layer |