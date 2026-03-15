# MCP Transport Layer

## Overview

Claude Code v2.1.76 implements four transport mechanisms for MCP client connections, each designed for different deployment scenarios. All transports implement a common interface (`start()`, `send()`, `close()`) consumed by `McpClient` (rH6).

| Transport | Protocol | Use Case |
|---|---|---|
| `StdioClientTransport` (SJA) | Subprocess stdin/stdout | Local MCP servers |
| `SSEClientTransport` (D$6) | HTTP + Server-Sent Events | Remote HTTP servers |
| `StreamableHTTPClientTransport` (j$6) | HTTP long-polling | Stateless HTTP servers |
| `WebSocketClientTransport` (VG6) | WebSocket frames | WebSocket-capable servers |

### v2.1.76 Changes
- **MCP reconnect spinner fix**: When an MCP transport disconnects and reconnects, the UI spinner was previously left in a stale state. v2.1.76 correctly resets and re-shows the spinner during reconnection attempts.
- **Bridge session extended disconnect recovery**: The `StreamableHTTPClientTransport` now implements extended disconnect recovery logic for bridge sessions (long-running sessions over HTTP). After an extended disconnect (beyond the normal reconnect window), the transport attempts to resume from the last known event ID rather than failing.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Transport section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - IDE Integration (VG6)

Key symbols in this document:
- `StdioClientTransport` (SJA) - chunks.79.mjs:1922 - Subprocess-based transport
- `LineBuffer` (hb1) - chunks.79.mjs:1881 - Newline-delimited JSON parser
- `SSEClientTransport` (D$6) - chunks.80.mjs:458 - HTTP+SSE bidirectional transport
- `createEventSourceParser` (sH6) - chunks.79.mjs:2028 - RFC 6202-compliant SSE parser
- `StreamableHTTPClientTransport` (j$6) - chunks.80.mjs:650 - Long-poll HTTP transport
- `WebSocketClientTransport` (VG6) - chunks.144.mjs - WebSocket transport

---

## 1. StdioClientTransport (SJA)

### What it does

Spawns a child process and communicates via `stdin`/`stdout` pipes using newline-delimited JSON (NDJSON). This is the primary transport for locally installed MCP servers (e.g., Python scripts, Node.js tools).

### How it works

**Constructor:**
- Accepts `ServerParameters` (command, args, env, cwd, stderr)
- Initializes a `LineBuffer` (hb1) for message framing
- Optional `stderr` stream parameter for capturing server error output

**`start()` method:**
1. Calls `childProcess.spawn(command, args, { stdio: ['pipe', 'pipe', inherit] })`
   - `stdin` (fd 0): piped — Claude writes JSON-RPC requests
   - `stdout` (fd 1): piped — Claude reads JSON-RPC responses
   - `stderr` (fd 2): `inherit` by default — passes server logs to terminal
2. Environment inheritance: merges `getInheritableEnvironmentVars()` with user-provided `env`
   - **Key insight:** Not all parent env vars are inherited — only safe/non-sensitive ones. This prevents credential leakage from the parent Claude process into the MCP subprocess
3. Windows compatibility: sets `windowsHide: true` to suppress console window popup
4. Event binding:
   - `spawn` event → resolves the startup promise
   - `error` event → rejects startup promise (e.g., ENOENT if command not found)
   - `close` event → triggers `onClose()` callback, enabling reconnection logic
   - `stdout.on('data')` → feeds raw Buffer chunks into `LineBuffer.append()`

**`send()` method:**
1. Serializes message: `JSON.stringify(message) + "\n"`
2. Writes to `stdin` with backpressure handling:
   - If `stdin.write()` returns `false`, waits for `drain` event before resolving
   - This prevents buffer overflow when the MCP server is slow to consume input

```javascript
// ============================================
// StdioClientTransport.start - Spawn child process for MCP server
// Location: chunks.79.mjs:1922-1985
// ============================================

// ORIGINAL (for source lookup):
async function start() {
  return new Promise((resolve, reject) => {
    let process = childProcess.spawn(this._serverParams.command,
      this._serverParams.args || [], {
        env: { ...getInheritableEnvironmentVars(process.env), ...this._serverParams.env },
        stdio: ["pipe", "pipe", this._serverParams.stderr ?? "inherit"],
        cwd: this._serverParams.cwd,
        windowsHide: true
      });
    process.on("error", reject);
    process.on("spawn", () => {
      this._process = process;
      resolve();
    });
    process.on("close", (code, signal) => { this.onClose(); });
    process.stdout.on("data", (chunk) => {
      this._readBuffer.append(chunk);
      this.processReadBuffer();
    });
    this._process = process;
  });
}

// READABLE (for understanding):
async function start() {
  return new Promise((resolve, reject) => {
    const childProc = childProcess.spawn(
      this._serverParams.command,
      this._serverParams.args ?? [],
      {
        env: {
          ...getInheritableEnvironmentVars(process.env), // safe parent env vars
          ...this._serverParams.env                       // server-specific overrides
        },
        stdio: ["pipe", "pipe", this._serverParams.stderr ?? "inherit"],
        cwd: this._serverParams.cwd,
        windowsHide: true  // suppress Windows console window
      }
    );

    childProc.on("error", reject);   // ENOENT if binary not found
    childProc.on("spawn", () => {
      this._process = childProc;
      resolve();
    });
    childProc.on("close", () => this.onClose()); // triggers reconnection

    // Feed raw bytes into LineBuffer for NDJSON framing
    childProc.stdout.on("data", (chunk) => {
      this._readBuffer.append(chunk);
      this.processReadBuffer();  // try to parse complete lines
    });
  });
}

// Mapping: process→childProc, this._serverParams→serverParams
```

---

## 2. LineBuffer (hb1)

### What it does

A stateful buffer that accumulates raw binary chunks from `stdout` and extracts complete newline-delimited JSON messages. Required because TCP/pipe delivery can split a single JSON message across multiple `data` events.

### How it works

**Algorithm:**
1. `append(chunk: Buffer)`: Concatenates incoming `Buffer` with `this._buffer` using `Buffer.concat([this._buffer, chunk])`
2. `readMessage()`:
   - Searches for `\n` (byte 0x0A) via `indexOf('\n')`
   - If found at position `i`, extracts `buffer.slice(0, i)` as the line
   - Handles Windows `\r\n` by checking `line[line.length-1] === 0x0D` and trimming
   - Advances `this._buffer` to `buffer.slice(i + 1)` (past the newline)
   - Returns `null` if no complete line yet
3. `processReadBuffer()` (on transport): loops calling `readMessage()` until `null`, then calls `JSON.parse()` on each complete line and fires `onMessage()`

**Why this approach:**
- Node.js streams deliver data in arbitrary chunks — a 4KB read buffer can contain half a JSON object
- The LineBuffer decouples chunk delivery from message framing
- Using `Buffer.concat` (binary-safe) rather than string concatenation handles multi-byte UTF-8 sequences that might be split across chunk boundaries

```javascript
// ============================================
// LineBuffer.readMessage - Extract one complete NDJSON line
// Location: chunks.79.mjs:1881-1920
// ============================================

// ORIGINAL (for source lookup):
readMessage() {
  let lineEnd = this._buffer.indexOf("\n");
  if (lineEnd === -1) return null;
  let line = this._buffer.slice(0, lineEnd);
  if (line.length > 0 && line[line.length - 1] === "\r".charCodeAt(0))
    line = line.slice(0, -1);
  this._buffer = this._buffer.slice(lineEnd + 1);
  return line.toString("utf8");
}

// READABLE (for understanding):
readMessage() {
  const newlinePos = this._buffer.indexOf("\n");
  if (newlinePos === -1) return null;  // incomplete message, wait for more data

  let line = this._buffer.slice(0, newlinePos);

  // Handle Windows-style \r\n line endings
  if (line.length > 0 && line[line.length - 1] === "\r".charCodeAt(0)) {
    line = line.slice(0, -1);  // strip trailing \r
  }

  this._buffer = this._buffer.slice(newlinePos + 1);  // advance past \n
  return line.toString("utf8");  // return decoded JSON string
}

// Mapping: lineEnd→newlinePos, line→line
```

---

## 3. SSEClientTransport (D$6)

### What it does

Implements bidirectional communication over HTTP using Server-Sent Events (SSE). The server pushes messages to the client via the persistent SSE stream; the client sends messages back via HTTP POST requests. This is used for remote MCP servers that expose HTTP endpoints.

### How it works

**Constructor accepts:**
- `url`: The SSE endpoint URL
- `eventSourceInit`: Custom SSE connection options (headers, etc.)
- `requestInit`: Custom fetch options for POST requests
- `authProvider`: Optional OAuth provider for token injection
- Custom `fetch` function for testing/proxying

**Connection flow:**
1. Opens a GET request to `url` with `Accept: text/event-stream`
2. If server returns `401` with `WWW-Authenticate` header:
   - Triggers OAuth flow via `authProvider.refreshToken()`
   - Retries request with `Authorization: Bearer <token>`
3. Feeds response body stream into `createEventSourceParser` (sH6)
4. On parsed `message` event: calls `JSON.parse(event.data)` → fires `onMessage()`
5. POST endpoint: extracted from the `endpoint` SSE event (server sends its POST URL)

**`send()` method:**
1. POST to the endpoint URL with `Content-Type: application/json`
2. Includes auth header if token available
3. Throws if response is not `200 OK`

### Reconnect Spinner Fix (v2.1.76)

**What it does:** When the SSE connection drops and reconnects, the UI now correctly shows a reconnection spinner rather than leaving the spinner in a stale or missing state.

**How it works:**
1. `onClose()` callback fires when the SSE connection drops
2. v2.1.76 emits a `reconnecting` state event to the app state, which triggers the UI spinner
3. When the connection is re-established, a `connected` event clears the spinner
4. Previously, only errors (not normal reconnects) updated the spinner state

---

## 4. SSE Event Parser (sH6 — createEventSourceParser)

### What it does

An RFC 6202-compliant SSE parser that processes raw HTTP body text line by line and fires structured events. Handles all SSE field types (`event`, `data`, `id`, `retry`) and UTF-8 BOM stripping.

### How it works

**`feed(chunk: string)` algorithm:**
1. Splits on `\n` (after normalizing `\r\n` → `\n`)
2. For each line:
   - Empty line → `emitEvent()` (fires accumulated event to `onEvent` callback)
   - Line starting with `:` → comment, ignored
   - `field: value` pattern → `processField(field, value)`
   - `field` with no value → `processField(field, "")`

**`processField()` dispatch:**
- `event` → sets `this._type` (e.g., `"message"`, `"endpoint"`)
- `data` → appends to `this._data` with `\n` separator
- `id` → sets `this._lastEventId` (used for reconnection)
- `retry` → parses integer, sets reconnection delay

**`emitEvent()` emission:**
1. Only fires if `this._data` is non-empty
2. Strips trailing `\n` from data (SSE spec requirement)
3. Constructs event: `{ type, data, id, retry }`
4. Calls `onEvent(event)` → transport processes it

**UTF-8 BOM handling:**
- First chunk may have `\uFEFF` prefix (UTF-8 BOM from some servers)
- Parser strips it before processing to avoid `\uFEFFdata: ...` misparse

```javascript
// ============================================
// createEventSourceParser - RFC 6202 SSE stream parser
// Location: chunks.79.mjs:2028-2120
// ============================================

// ORIGINAL (for source lookup):
function sH6(onEvent) {
  let _data = "", _type = "", _lastId = "", _bom = true;
  function feed(chunk) {
    let lines = chunk.replace(/\r\n|\r/g, "\n").split("\n");
    if (_bom && lines[0].startsWith("\uFEFF")) {
      lines[0] = lines[0].slice(1); _bom = false;
    }
    for (let line of lines) {
      if (line === "") { emit(); continue; }
      if (line.startsWith(":")) continue;
      let colon = line.indexOf(":");
      let [field, value] = colon > 0
        ? [line.slice(0, colon), line.slice(colon + (line[colon+1] === " " ? 2 : 1))]
        : [line, ""];
      processField(field, value);
    }
  }
  function processField(field, value) {
    if (field === "data") _data += (_data ? "\n" : "") + value;
    else if (field === "event") _type = value;
    else if (field === "id") _lastId = value;
    else if (field === "retry") { let n = parseInt(value); if (!isNaN(n)) onEvent({ type: "reconnect-interval", value: n }); }
  }
  function emit() {
    if (!_data) return;
    onEvent({ type: _type || "message", data: _data.endsWith("\n") ? _data.slice(0,-1) : _data, id: _lastId });
    _data = ""; _type = "";
  }
  return { feed };
}

// READABLE (for understanding):
function createEventSourceParser(onEvent) {
  let accumulatedData = "";
  let eventType = "";
  let lastEventId = "";
  let firstChunk = true;

  function feed(chunk) {
    let normalized = chunk.replace(/\r\n|\r/g, "\n");
    if (firstChunk && normalized.startsWith("\uFEFF")) {
      normalized = normalized.slice(1);
      firstChunk = false;
    }

    for (const line of normalized.split("\n")) {
      if (line === "") {
        emitEvent();
        continue;
      }
      if (line.startsWith(":")) continue;

      const colonPos = line.indexOf(":");
      let field, value;
      if (colonPos > 0) {
        field = line.slice(0, colonPos);
        value = line.slice(colonPos + (line[colonPos + 1] === " " ? 2 : 1));
      } else {
        field = line;
        value = "";
      }
      processField(field, value);
    }
  }

  function processField(field, value) {
    switch (field) {
      case "data": accumulatedData += (accumulatedData ? "\n" : "") + value; break;
      case "event": eventType = value; break;
      case "id": lastEventId = value; break;
      case "retry":
        const retryMs = parseInt(value, 10);
        if (!isNaN(retryMs)) onEvent({ type: "reconnect-interval", value: retryMs });
        break;
    }
  }

  function emitEvent() {
    if (!accumulatedData) return;
    const data = accumulatedData.endsWith("\n")
      ? accumulatedData.slice(0, -1) : accumulatedData;
    onEvent({ type: eventType || "message", data, id: lastEventId });
    accumulatedData = "";
    eventType = "";
  }

  return { feed };
}

// Mapping: sH6→createEventSourceParser, _data→accumulatedData, _type→eventType,
//          _lastId→lastEventId, _bom→firstChunk, emit→emitEvent
```

---

## 5. StreamableHTTPClientTransport (j$6)

### What it does

An HTTP-based transport that uses long-polling with **resumption tokens**. Unlike SSE, this transport is designed for stateless HTTP servers and supports connection resumption after network interruption.

### How it works

**Key mechanism: Last-Event-ID for resumption**
1. Client sends `GET` request to endpoint
2. Server streams JSON-RPC responses in the body
3. Each message includes an event ID
4. On disconnect/timeout, client resends request with `Last-Event-ID` header
5. Server resumes from that event ID, avoiding message loss

**Session management:**
- Server assigns a `Mcp-Session-Id` response header on first connection
- Client includes `Mcp-Session-Id` in all subsequent requests
- Sessions allow server to maintain per-client state despite HTTP statelessness

### Extended Disconnect Recovery (v2.1.76)

**What it does:** When a bridge session experiences an extended disconnect (longer than the normal reconnect window of a few seconds), the transport now attempts recovery using the last known event ID instead of failing immediately.

**How it works:**
1. Normal reconnect window: 1-5 reconnect attempts over ~10 seconds
2. If all normal reconnects fail, v2.1.76 enters "extended recovery" mode
3. Recovery mode: waits up to 60 seconds with increasing backoff between attempts
4. Each recovery attempt includes `Last-Event-ID` so the server can resume the stream from the last successfully received message
5. If recovery succeeds, the session continues transparently
6. If recovery fails after 60 seconds, the session is declared dead and the user is notified

**Why this matters for bridge sessions:** Bridge sessions (sessions running through an intermediary proxy or relay) experience more transient disconnects than direct connections. The extended recovery window absorbs these without forcing session restart, which would require re-hydrating all context.

**Why this approach vs SSE:**
- SSE requires a persistent connection — problematic behind HTTP/1.1 proxies with 6-connection limits
- Long-polling works through all HTTP proxies and firewalls
- Resumption tokens ensure no messages are lost during network blips
- Trade-off: higher latency per message (requires new request/response cycle)

---

## 6. WebSocketClientTransport (VG6)

### What it does

Implements full-duplex WebSocket communication for MCP servers that support the WebSocket subprotocol. Provides lower latency than SSE/HTTP polling for high-frequency tool calls.

### How it works

**Bun.js / Node.js compatibility:**
- Uses runtime detection to select the appropriate WebSocket implementation
- Bun has native `WebSocket` global; Node.js requires `ws` package
- The transport wraps both behind a unified interface

**Frame handling:**
- Incoming text frames → `JSON.parse()` → `onMessage()` callback
- Outgoing messages → `JSON.stringify()` → `ws.send()`
- Binary frames: ignored (MCP uses text/JSON only)
- Ping/pong: delegated to underlying WebSocket implementation

**Connection lifecycle:**
- `open` event → resolves `start()` promise
- `close` event → fires `onClose()` for reconnection
- `error` event → rejects if during startup, fires `onError` otherwise

---

## Transport Selection Decision

**How Claude Code picks a transport:**
The choice is determined by the MCP server's `type` field in the configuration:
- `"stdio"` → `StdioClientTransport` (local subprocess)
- `"sse"` → `SSEClientTransport` (remote HTTP)
- `"http"` → `StreamableHTTPClientTransport` (stateless HTTP)
- `"websocket"` → `WebSocketClientTransport`

**Design rationale:**
1. `stdio` is the default for local tools — zero network overhead, subprocess isolation
2. `sse` is preferred for remote servers — single persistent connection, push delivery
3. `http` is the fallback for enterprise environments where SSE is blocked by proxies
4. `websocket` is opt-in for latency-sensitive use cases
