# Transport Layer (Claude Code 2.1.7)

> Analysis of StdioSDKTransport (wmA) and WebSocketSDKTransport (Fy0) implementations.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - SDK Transport module

Key classes in this document:
- `StdioSDKTransport` (wmA) - Stdin/stdout transport
- `WebSocketSDKTransport` (Fy0) - WebSocket transport
- `WebSocketTransport` (Vy0) - Low-level WebSocket handler
- `generateControlRequestId` (HR7) - Request ID generator
- `writeToStdout` (J9) - Chunked stdout writer

---

## StdioSDKTransport (wmA)

### Class Overview

```javascript
// ============================================
// StdioSDKTransport - Complete class structure
// Location: chunks.155.mjs:2621-2790
// ============================================

// ORIGINAL (for source lookup):
class wmA {
  input;
  replayUserMessages;
  structuredInput;
  pendingRequests = new Map;
  inputClosed = !1;
  unexpectedResponseCallback;

  constructor(A, Q) { /* ... */ }
  async * read() { /* ... */ }
  getPendingPermissionRequests() { /* ... */ }
  setUnexpectedResponseCallback(A) { /* ... */ }
  async processLine(A) { /* ... */ }
  write(A) { /* ... */ }
  async sendRequest(A, Q, B) { /* ... */ }
  createCanUseTool() { /* ... */ }
  createHookCallback(A, Q) { /* ... */ }
  async sendMcpMessage(A, Q) { /* ... */ }
}

// READABLE (for understanding):
class StdioSDKTransport {
  input;                        // Raw input stream (stdin or custom)
  replayUserMessages;           // Echo processed messages back
  structuredInput;              // Async iterator of parsed messages
  pendingRequests = new Map();  // requestId → { resolve, reject, schema }
  inputClosed = false;          // Stream termination flag
  unexpectedResponseCallback;   // Handler for orphaned control responses

  constructor(inputStream, replayUserMessages) { /* ... */ }
  async * read() { /* JSON-lines parser generator */ }
  getPendingPermissionRequests() { /* Get all pending can_use_tool requests */ }
  setUnexpectedResponseCallback(callback) { /* Set orphan handler */ }
  async processLine(line) { /* Parse and route single JSON line */ }
  write(message) { /* Write JSON + newline to stdout */ }
  async sendRequest(request, schema, abortSignal) { /* Send control request with Promise */ }
  createCanUseTool() { /* Create permission callback */ }
  createHookCallback(callbackId, timeout) { /* Create hook callback */ }
  async sendMcpMessage(serverName, message) { /* Route MCP message */ }
}
```

### Input Processing Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     StdioSDKTransport Input Flow                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  stdin (or custom stream)                                                  │
│       │                                                                    │
│       ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │ async * read() generator                                        │      │
│  │                                                                  │      │
│  │   for await (const chunk of this.input) {                        │      │
│  │     buffer += chunk;                                             │      │
│  │     while (newlineIndex = buffer.indexOf("\n")) {                │      │
│  │       const line = buffer.slice(0, newlineIndex);                │      │
│  │       const message = await this.processLine(line);              │      │
│  │       if (message) yield message; ◄───────────────────────┐     │      │
│  │     }                                                       │     │      │
│  │   }                                                         │     │      │
│  └─────────────────────────────────────────────────────────────│─────┘      │
│                                                                 │            │
│                                                                 │            │
│  ┌──────────────────────────────────────────────────────────────▼─────┐    │
│  │ processLine(line) router                                           │    │
│  │                                                                     │    │
│  │   ┌─────────────────────┬───────────────────┬─────────────────┐   │    │
│  │   │ keep_alive          │ control_response  │ user/control_req│   │    │
│  │   │                     │                   │                  │   │    │
│  │   │ → return (skip)     │ → resolve pending │ → validate &    │   │    │
│  │   │                     │   Promise         │   yield to loop │   │    │
│  │   └─────────────────────┴───────────────────┴─────────────────┘   │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Message Type Routing

| Message Type | Action | Destination |
|--------------|--------|-------------|
| `keep_alive` | Skip | None (ignored) |
| `control_response` | Resolve/reject pending Promise | pendingRequests Map |
| `control_request` | Validate and yield | SDK agent loop |
| `user` | Validate role and yield | SDK agent loop |
| Other | Error exit | process.exit(1) |

---

## Pending Request Correlation

### How Request Correlation Works

1. **Request Sent**: `sendRequest()` generates unique ID, stores Promise handlers
2. **Wait for Response**: Promise blocks until response received
3. **Response Received**: `processLine()` matches by `request_id`, resolves/rejects

```javascript
// ============================================
// Pending Request Data Structure
// Location: chunks.155.mjs:2697-2737
// ============================================

// pendingRequests Map structure:
Map<requestId, {
  request: {                    // Original request for reference
    type: "control_request",
    request_id: string,
    request: object
  },
  resolve: (response) => void,  // Promise resolver
  reject: (error) => void,      // Promise rejecter
  schema: ZodSchema | null      // Response validation schema
}>
```

### Request ID Generation

```javascript
// ============================================
// generateControlRequestId
// Location: chunks.155.mjs (HR7 - inferred)
// ============================================

// Uses crypto.randomUUID() or similar UUID generator
const requestId = generateControlRequestId();
// Example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

---

## WebSocketSDKTransport (Fy0)

### Class Overview

Extends `StdioSDKTransport` to use WebSocket instead of stdin/stdout:

```javascript
// ============================================
// WebSocketSDKTransport - WebSocket transport
// Location: chunks.155.mjs:3000-3034
// ============================================

// ORIGINAL (for source lookup):
Fy0 = class Fy0 extends wmA {
  url;
  transport;
  inputStream;
  constructor(A, Q, B) {
    let G = new NR7({ encoding: "utf8" });
    super(G, B);
    this.inputStream = G, this.url = new qR7(A);
    let Z = {}, Y = G4A();
    if (Y) Z.Authorization = `Bearer ${Y}`;
    let J = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
    if (J) Z["x-environment-runner-version"] = J;
    if (this.transport = jw9(this.url, Z, q0()),
        this.transport.setOnData((X) => { this.inputStream.write(X) }),
        this.transport.setOnClose(() => { this.inputStream.end() }),
        this.transport.connect(),
        C6(async () => this.close()), Q) {
      let X = this.inputStream;
      (async () => {
        for await (let I of Q) X.write(I + `\n`)
      })()
    }
  }
  write(A) { this.transport.write(A) }
  close() { this.transport.close(), this.inputStream.end() }
}

// READABLE (for understanding):
class WebSocketSDKTransport extends StdioSDKTransport {
  url;          // WebSocket URL
  transport;    // WebSocketTransport instance (Vy0)
  inputStream;  // PassThrough stream for bridging

  constructor(url, initialInputStream, replayUserMessages) {
    // Create PassThrough stream to bridge WebSocket → parent class input
    const passThroughStream = new PassThrough({ encoding: "utf8" });
    super(passThroughStream, replayUserMessages);

    this.inputStream = passThroughStream;
    this.url = new URL(url);

    // Set up authentication headers
    const headers = {};
    const authToken = getAuthToken();
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    // Environment runner version header
    const runnerVersion = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
    if (runnerVersion) {
      headers["x-environment-runner-version"] = runnerVersion;
    }

    // Create and connect WebSocket transport
    this.transport = createWebSocketTransport(this.url, headers, getSessionId());
    this.transport.setOnData((data) => this.inputStream.write(data));
    this.transport.setOnClose(() => this.inputStream.end());
    this.transport.connect();

    // Register cleanup on exit
    registerCleanup(async () => this.close());

    // Forward initial input stream if provided
    if (initialInputStream) {
      const stream = this.inputStream;
      (async () => {
        for await (const line of initialInputStream) {
          stream.write(line + "\n");
        }
      })();
    }
  }

  write(message) {
    // Override to use WebSocket instead of stdout
    this.transport.write(message);
  }

  close() {
    this.transport.close();
    this.inputStream.end();
  }
}

// Mapping: Fy0→WebSocketSDKTransport, A→url, Q→initialInputStream, B→replayUserMessages,
//          G→passThroughStream, Z→headers, Y→authToken, J→runnerVersion
```

### Data Flow Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                   WebSocketSDKTransport Data Flow                           │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  WebSocket Server                                                          │
│       ▲                                                                    │
│       │ WebSocket                                                          │
│       ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │ WebSocketTransport (Vy0)                                        │      │
│  │                                                                  │      │
│  │   onData ────────────────────────────────────────────┐          │      │
│  │   onClose ──────────────────────────────────────────┐│          │      │
│  └──────────────────────────────────────────────────────││──────────┘      │
│                                                          ││                 │
│                                                          ▼▼                 │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │ PassThrough Stream (inputStream)                                │      │
│  │                                                                  │      │
│  │   • Bridges WebSocket → StdioSDKTransport.read()                │      │
│  │   • Supports async iteration                                     │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│       │                                                                    │
│       ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │ StdioSDKTransport.read() (inherited)                            │      │
│  │                                                                  │      │
│  │   • JSON-lines parsing                                           │      │
│  │   • Message routing                                              │      │
│  │   • Control response correlation                                 │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│                                                                            │
│                                                                            │
│  Output Path:                                                              │
│                                                                            │
│  write(message) ─────► transport.write(message) ─────► WebSocket Server   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## WebSocketTransport (Vy0) - Low-Level Handler

### Class Overview

```javascript
// ============================================
// WebSocketTransport - Low-level WebSocket handler
// Location: chunks.155.mjs:2805-2963
// ============================================

// ORIGINAL (for source lookup):
class Vy0 {
  ws = null;
  lastSentId = null;
  url;
  state = "idle";
  onData;
  onCloseCallback;
  headers;
  sessionId;
  reconnectAttempts = 0;
  reconnectTimer = null;
  pingInterval = null;
  messageBuffer;

  constructor(A, Q = {}, B) { /* ... */ }
  connect() { /* ... */ }
  sendLine(A) { /* ... */ }
  doDisconnect() { /* ... */ }
  handleConnectionError() { /* ... */ }
  close() { /* ... */ }
  replayBufferedMessages(A) { /* ... */ }
  isConnectedStatus() { /* ... */ }
  setOnData(A) { /* ... */ }
  setOnClose(A) { /* ... */ }
  write(A) { /* ... */ }
  startPingInterval() { /* ... */ }
  stopPingInterval() { /* ... */ }
}

// READABLE (for understanding):
class WebSocketTransport {
  ws = null;                // WebSocket instance
  lastSentId = null;        // Last message UUID for replay
  url;                      // WebSocket URL
  state = "idle";           // Connection state
  onData;                   // Data callback
  onCloseCallback;          // Close callback
  headers;                  // Connection headers
  sessionId;                // Session ID for logging
  reconnectAttempts = 0;    // Reconnection counter
  reconnectTimer = null;    // Reconnection delay timer
  pingInterval = null;      // Keepalive ping timer
  messageBuffer;            // Ring buffer for message replay

  constructor(url, headers = {}, sessionId) { /* ... */ }
  connect() { /* Establish WebSocket connection */ }
  sendLine(line) { /* Send raw line */ }
  doDisconnect() { /* Clean disconnect */ }
  handleConnectionError() { /* Handle errors with reconnection */ }
  close() { /* Graceful close */ }
  replayBufferedMessages(lastAckedId) { /* Replay after reconnect */ }
  isConnectedStatus() { /* Check connection state */ }
  setOnData(callback) { /* Set data handler */ }
  setOnClose(callback) { /* Set close handler */ }
  write(message) { /* Write with buffering */ }
  startPingInterval() { /* Start keepalive pings */ }
  stopPingInterval() { /* Stop keepalive pings */ }
}
```

### Connection States

```
┌────────────────────────────────────────────────────────────────┐
│                 WebSocketTransport State Machine                │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────┐                                                  │
│  │   idle    │ ◄─────────────────────────────────┐             │
│  └─────┬─────┘                                   │             │
│        │ connect()                               │             │
│        ▼                                         │             │
│  ┌───────────────┐                               │             │
│  │ reconnecting  │ ◄──────────────────┐          │             │
│  └─────┬─────────┘                    │          │             │
│        │ WebSocket open               │          │             │
│        ▼                              │          │             │
│  ┌───────────┐                        │          │             │
│  │ connected │                        │          │             │
│  └─────┬─────┘                        │          │             │
│        │ error/close                  │          │             │
│        ▼                              │          │             │
│  ┌───────────────────┐     attempts   │          │             │
│  │ handleConnection  │ ────< max? ────┤          │             │
│  │     Error()       │                           │             │
│  └───────────────────┘     attempts   │          │             │
│        │                   >= max     │          │             │
│        ▼                              │          │             │
│  ┌───────────┐                   ┌────┴────┐    │             │
│  │  closed   │                   │ closing │────┘             │
│  └───────────┘ ◄─────────────────┴─────────┘                  │
│                     close()                                    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Reconnection Constants

```javascript
// ============================================
// Reconnection Constants
// Location: chunks.155.mjs:2965-2973
// ============================================

// ORIGINAL:
zR7 = 1000    // MESSAGE_BUFFER_SIZE
Rw9 = 3       // MAX_RECONNECT_ATTEMPTS
$R7 = 1000    // INITIAL_RECONNECT_DELAY_MS
CR7 = 30000   // MAX_RECONNECT_DELAY_MS
UR7 = 1e4     // PING_INTERVAL_MS (10000ms)

// READABLE:
const MESSAGE_BUFFER_SIZE = 1000;
const MAX_RECONNECT_ATTEMPTS = 3;
const INITIAL_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 30000;
const PING_INTERVAL_MS = 10000;
```

### Reconnection Algorithm

```javascript
// ============================================
// handleConnectionError - Reconnection with exponential backoff
// Location: chunks.155.mjs:2886-2902
// ============================================

// READABLE (for understanding):
handleConnectionError() {
  log(`WebSocketTransport: Disconnected from ${this.url.href}`);
  telemetry("info", "cli_websocket_disconnected");

  this.doDisconnect();

  // Don't reconnect if explicitly closing
  if (this.state === "closing" || this.state === "closed") return;

  if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.state = "reconnecting";
    this.reconnectAttempts++;

    // Exponential backoff: 1s, 2s, 4s, ..., max 30s
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1),
      MAX_RECONNECT_DELAY_MS
    );

    log(`WebSocketTransport: Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
    telemetry("error", "cli_websocket_reconnect_attempt", {
      reconnectAttempts: this.reconnectAttempts
    });

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  } else {
    log(`WebSocketTransport: Max reconnection attempts reached`, { level: "error" });
    telemetry("error", "cli_websocket_reconnect_exhausted", {
      reconnectAttempts: this.reconnectAttempts
    });

    this.state = "closed";
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }
}
```

### Message Buffering for Replay

```javascript
// ============================================
// Message Buffering & Replay
// Location: chunks.155.mjs:2907-2931
// ============================================

// READABLE (for understanding):
write(message) {
  // Buffer messages with UUIDs for potential replay
  if ("uuid" in message && typeof message.uuid === "string") {
    this.messageBuffer.add(message);
    this.lastSentId = message.uuid;
  }

  const jsonLine = JSON.stringify(message) + "\n";

  if (this.state !== "connected") return;

  const sessionInfo = this.sessionId ? ` session=${this.sessionId}` : "";
  log(`WebSocketTransport: Sending message type=${message.type}${sessionInfo}`);
  this.sendLine(jsonLine);
}

replayBufferedMessages(lastAckedId) {
  const bufferedMessages = this.messageBuffer.toArray();
  if (bufferedMessages.length === 0) return;

  let startIndex = 0;
  if (lastAckedId) {
    const ackIndex = bufferedMessages.findIndex(
      (msg) => "uuid" in msg && msg.uuid === lastAckedId
    );
    if (ackIndex >= 0) {
      startIndex = ackIndex + 1;  // Start after last acked
    }
  }

  const messagesToReplay = bufferedMessages.slice(startIndex);
  if (messagesToReplay.length === 0) {
    log("WebSocketTransport: No new messages to replay");
    return;
  }

  log(`WebSocketTransport: Replaying ${messagesToReplay.length} buffered messages`);
  telemetry("info", "cli_websocket_messages_to_replay", {
    count: messagesToReplay.length
  });

  for (const message of messagesToReplay) {
    const jsonLine = JSON.stringify(message) + "\n";
    if (!this.sendLine(jsonLine)) {
      this.handleConnectionError();
      break;
    }
  }
}
```

---

## Output: writeToStdout (J9)

Chunked output to prevent Node.js buffer issues:

```javascript
// ============================================
// writeToStdout - Chunked stdout writer
// Location: chunks.1.mjs:646-648
// ============================================

// ORIGINAL (for source lookup):
function J9(A) {
  for (let Q = 0; Q < A.length; Q += 2000)
    process.stdout.write(A.substring(Q, Q + 2000))
}

// READABLE (for understanding):
function writeToStdout(content) {
  // Write in 2000-character chunks to prevent buffer overflow
  for (let offset = 0; offset < content.length; offset += 2000) {
    process.stdout.write(content.substring(offset, offset + 2000));
  }
}

// Mapping: J9→writeToStdout, A→content, Q→offset
```

**Why 2000 characters?**
- Node.js `process.stdout.write()` can block with very large strings
- 2000 characters is safe for typical terminal buffers (4KB-64KB)
- Minimizes syscall overhead while staying under buffer limits

---

## Summary

| Component | Symbol | Purpose |
|-----------|--------|---------|
| StdioSDKTransport | wmA | JSON-lines over stdin/stdout |
| WebSocketSDKTransport | Fy0 | WebSocket wrapper over StdioSDKTransport |
| WebSocketTransport | Vy0 | Low-level WebSocket with reconnection |
| writeToStdout | J9 | Chunked stdout writing |
| generateControlRequestId | HR7 | UUID generation for request correlation |

---

## Related Documents

- [overview.md](./overview.md) - SDK architecture overview
- [message_protocol.md](./message_protocol.md) - Message types and validation
- [control_protocol.md](./control_protocol.md) - Control request/response
- [output_pipeline.md](./output_pipeline.md) - Output flow and AsyncMessageQueue
