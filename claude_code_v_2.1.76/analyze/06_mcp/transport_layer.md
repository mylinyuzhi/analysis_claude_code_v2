# MCP Transport Layer

## Overview

Claude Code v2.1.76 implements four transport mechanisms for MCP client connections, each designed for different deployment scenarios. All transports implement a common interface (`start()`, `send()`, `close()`) consumed by `McpClient` (rH6).

| Transport | Protocol | Use Case |
|---|---|---|
| `StdioClientTransport` (SO8) | Subprocess stdin/stdout | Local MCP servers |
| `SSEClientTransport` | HTTP + Server-Sent Events | Remote HTTP servers |
| `StreamableHTTPClientTransport` (j$6) | HTTP long-polling | Stateless HTTP servers |
| `WebSocketClientTransport` (VG6) | WebSocket frames | WebSocket-capable servers |

> **⚠️ Symbol Correction:** Transport classes are located in chunks.57.mjs and chunks.5.mjs, not chunks.79/80.mjs as previously documented. `Dy6` (chunks.5.mjs:2668) is the actual LineBuffer class, not `hb1`. `SO8` (chunks.57.mjs:1098) is the actual StdioClientTransport class.

### v2.1.76 Changes
- **MCP reconnect spinner fix**: When an MCP transport disconnects and reconnects, the UI spinner was previously left in a stale state. v2.1.76 correctly resets and re-shows the spinner during reconnection attempts.
- **Bridge session extended disconnect recovery**: The `StreamableHTTPClientTransport` now implements extended disconnect recovery logic for bridge sessions (long-running sessions over HTTP). After an extended disconnect (beyond the normal reconnect window), the transport attempts to resume from the last known event ID rather than failing.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Transport section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - IDE Integration (VG6)

Key symbols in this document:
- `StdioClientTransport` (SO8) - chunks.57.mjs:1098 - Subprocess-based transport
- `LineBuffer` (Dy6) - chunks.5.mjs:2668 - Newline-delimited JSON parser
- `SSEClientTransport` - chunks.57.mjs:2492 (start method) - HTTP+SSE bidirectional transport
- `createEventSourceParser` (sH6) - chunks.79.mjs:2028 - RFC 6202-compliant SSE parser
- `StreamableHTTPClientTransport` (j$6) - chunks.80.mjs:650 - Long-poll HTTP transport
- `WebSocketClientTransport` (VG6) - chunks.144.mjs - WebSocket transport

---

## 1. StdioClientTransport (SO8)

### What it does

Spawns a child process and communicates via `stdin`/`stdout` pipes using newline-delimited JSON (NDJSON). This is the primary transport for locally installed MCP servers (e.g., Python scripts, Node.js tools).

### How it works

**Constructor:**
- Accepts `ServerParameters` (command, args, env, cwd, stderr)
- Initializes a `LineBuffer` (Dy6) for message framing
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

```javascript
// ============================================
// StdioClientTransport - Spawn child process for MCP server
// Location: chunks.57.mjs:1098-1177
// ============================================

// ORIGINAL (for source lookup):
class SO8 {
    constructor(A) {
        this._readBuffer = new Dy6;
        this._stderrStream = null;
        this._serverParams = A;
        if (A.stderr === "pipe" || A.stderr === "overlapped")
            this._stderrStream = new Sm3
    }
    async start() {
        if (this._process) throw Error("StdioClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        return new Promise((A, q) => {
            this._process = cf7.default(this._serverParams.command,
                this._serverParams.args ?? [], {
                    env: { ...Im3(), ...this._serverParams.env },
                    stdio: ["pipe", "pipe", this._serverParams.stderr ?? "inherit"],
                    shell: !1,
                    windowsHide: _w1.platform === "win32" && bm3(),
                    cwd: this._serverParams.cwd
                });
            this._process.on("error", (K) => { q(K); this.onerror?.(K) });
            this._process.on("spawn", () => A());
            this._process.on("close", (K) => { this._process = void 0; this.onclose?.() });
            this._process.stdin?.on("error", (K) => { this.onerror?.(K) });
            this._process.stdout?.on("data", (K) => {
                this._readBuffer.append(K);
                this.processReadBuffer()
            });
            this._process.stdout?.on("error", (K) => { this.onerror?.(K) });
            if (this._stderrStream && this._process.stderr)
                this._process.stderr.pipe(this._stderrStream)
        })
    }
    get stderr() { return this._stderrStream ?? this._process?.stderr ?? null }
    get pid() { return this._process?.pid ?? null }
    processReadBuffer() {
        while (!0) try {
            let A = this._readBuffer.readMessage();
            if (A === null) break;
            this.onmessage?.(A)
        } catch (A) { this.onerror?.(A) }
    }
    async close() {
        if (this._process) {
            let A = this._process;
            this._process = void 0;
            let q = new Promise((K) => { A.once("close", () => K()) });
            try { A.stdin?.end() } catch {}
            await Promise.race([q, new Promise((K) => setTimeout(K, 2000).unref())]);
            if (A.exitCode === null) {
                try { A.kill("SIGTERM") } catch {}
                await Promise.race([q, new Promise((K) => setTimeout(K, 2000).unref())])
            }
            if (A.exitCode === null) try { A.kill("SIGKILL") } catch {}
        }
        this._readBuffer.clear()
    }
    send(A) {
        return new Promise((q) => {
            if (!this._process?.stdin) throw Error("Not connected");
            let K = j61(A);  // JSON.stringify with newline
            if (this._process.stdin.write(K)) q();
            else this._process.stdin.once("drain", q)
        })
    }
}

// READABLE (for understanding):
class StdioClientTransport {
    constructor(serverParams) {
        this._readBuffer = new LineBuffer();  // Dy6
        this._stderrStream = null;
        this._serverParams = serverParams;
        if (serverParams.stderr === "pipe" || serverParams.stderr === "overlapped") {
            this._stderrStream = new PassThrough();
        }
    }

    async start() {
        if (this._process) throw new Error("StdioClientTransport already started!");

        return new Promise((resolve, reject) => {
            this._process = childProcess.spawn(
                this._serverParams.command,
                this._serverParams.args ?? [],
                {
                    env: { ...getInheritableEnvironmentVars(), ...this._serverParams.env },
                    stdio: ["pipe", "pipe", this._serverParams.stderr ?? "inherit"],
                    shell: false,
                    windowsHide: process.platform === "win32" && isWindowsTerminal(),
                    cwd: this._serverParams.cwd
                }
            );

            this._process.on("error", (err) => {
                reject(err);
                this.onerror?.(err);
            });
            this._process.on("spawn", () => resolve());
            this._process.on("close", () => {
                this._process = undefined;
                this.onclose?.();
            });

            this._process.stdout.on("data", (chunk) => {
                this._readBuffer.append(chunk);
                this.processReadBuffer();
            });
        });
    }
}

// Mapping: SO8→StdioClientTransport, Dy6→LineBuffer, Im3→getInheritableEnvironmentVars, cf7→childProcess,
//          Sm3→PassThrough, _w1→process, bm3→isWindowsTerminal, j61→JSON.stringify with newline
```

### close() Algorithm: Graceful Shutdown

**What it does:** The close() method implements a graceful shutdown sequence with escalation from soft to hard termination.

**How it works:**
```
close() called
    │
    ├─ 1. Capture process reference, clear this._process
    │
    ├─ 2. Create promise that resolves on 'close' event
    │
    ├─ 3. Close stdin (soft signal: "no more input coming")
    │      └─ process.stdin.end()
    │
    ├─ 4. Wait up to 2 seconds for process to exit gracefully
    │      └─ Promise.race([closePromise, timeout(2000)])
    │
    ├─ 5. If still running (exitCode === null):
    │      └─ Send SIGTERM (soft kill)
    │      └─ Wait up to 2 more seconds
    │
    ├─ 6. If STILL running:
    │      └─ Send SIGKILL (hard kill, cannot be caught)
    │
    └─ 7. Clear the read buffer
```

**Why this escalation:**
- `stdin.end()` allows the subprocess to finish any pending work
- SIGTERM gives the process a chance to clean up (close files, flush buffers)
- SIGKILL is the last resort for hung processes
- The 2-second windows balance responsiveness vs. graceful shutdown

---

## 2. LineBuffer (Dy6)

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

```javascript
// ============================================
// LineBuffer - Extract complete NDJSON lines from stream
// Location: chunks.5.mjs:2668-2683
// ============================================

// ORIGINAL (for source lookup):
class Dy6 {
    append(A) {
        this._buffer = this._buffer ? Buffer.concat([this._buffer, A]) : A
    }
    readMessage() {
        if (!this._buffer) return null;
        let A = this._buffer.indexOf(`\n`);
        if (A === -1) return null;
        let q = this._buffer.toString("utf8", 0, A).replace(/\r$/, "");
        return this._buffer = this._buffer.subarray(A + 1), Ztq(q)
    }
    clear() {
        this._buffer = void 0
    }
}

// READABLE (for understanding):
class LineBuffer {
    append(chunk) {
        this._buffer = this._buffer
            ? Buffer.concat([this._buffer, chunk])
            : chunk;
    }

    readMessage() {
        if (!this._buffer) return null;

        const newlinePos = this._buffer.indexOf('\n');
        if (newlinePos === -1) return null;  // incomplete message

        let line = this._buffer.toString("utf8", 0, newlinePos);
        // Handle Windows-style \r\n line endings
        line = line.replace(/\r$/, "");

        this._buffer = this._buffer.subarray(newlinePos + 1);
        return JSON.parse(line);  // Ztq is the JSON.parse wrapper
    }

    clear() {
        this._buffer = undefined;
    }
}

// Mapping: Dy6→LineBuffer, Ztq→parseJsonMessage
```

---

## 3. SSEClientTransport

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

### SSEClientTransport Class Implementation

```javascript
// ============================================
// SSEClientTransport - HTTP+SSE bidirectional MCP transport
// Location: chunks.57.mjs:2492-2715
// ============================================

// ORIGINAL (for source lookup):
class Nw1 {
    constructor(A, q) {
        this._hasCompletedAuthFlow = !1;
        this._url = A;
        this._resourceMetadataUrl = void 0;
        this._scope = void 0;
        this._requestInit = q?.requestInit;
        this._authProvider = q?.authProvider;
        this._fetch = q?.fetch;
        this._fetchWithInit = AK6(q?.fetch, q?.requestInit);
        this._sessionId = q?.sessionId;
        this._reconnectionOptions = q?.reconnectionOptions ?? OB3;
    }
    async start() {
        if (this._eventSource) throw Error("SSEClientTransport already started!");
        return await this._startOrAuth()
    }
    async send(A) {
        if (!this._endpoint) throw Error("Not connected");
        let q = await this._commonHeaders();
        q.set("content-type", "application/json");
        let K = { ...this._requestInit, method: "POST", headers: q, body: JSON.stringify(A), signal: this._abortController?.signal };
        let Y = await (this._fetch ?? fetch)(this._endpoint, K);
        if (!Y.ok) {
            if (Y.status === 401 && this._authProvider) {
                // OAuth retry logic
                return this.send(A);
            }
            throw Error(`Error POSTing to endpoint (HTTP ${Y.status})`);
        }
        await Y.body?.cancel();
    }
    _scheduleReconnection(A, q = 0) {
        let K = this._reconnectionOptions.maxRetries;
        if (q >= K) {
            this.onerror?.(Error(`Maximum reconnection attempts (${K}) exceeded.`));
            return;
        }
        let Y = this._getNextReconnectionDelay(q);
        this._reconnectionTimeout = setTimeout(() => {
            this._startOrAuthSse(A).catch((z) => {
                this.onerror?.(Error(`Failed to reconnect SSE stream: ${z.message}`));
                this._scheduleReconnection(A, q + 1);
            });
        }, Y);
    }
    _getNextReconnectionDelay(A) {
        if (this._serverRetryMs !== void 0) return this._serverRetryMs;
        let q = this._reconnectionOptions.initialReconnectionDelay,
            K = this._reconnectionOptions.reconnectionDelayGrowFactor,
            Y = this._reconnectionOptions.maxReconnectionDelay;
        return Math.min(q * Math.pow(K, A), Y);
    }
}

// READABLE (for understanding):
class SSEClientTransport {
    constructor(url, options) {
        this._hasCompletedAuthFlow = false;
        this._url = url;
        this._resourceMetadataUrl = undefined;  // OAuth resource server URL
        this._scope = undefined;                 // OAuth scope
        this._requestInit = options?.requestInit;
        this._authProvider = options?.authProvider;
        this._fetch = options?.fetch;            // Custom fetch for testing
        this._sessionId = options?.sessionId;    // MCP session ID header
        this._reconnectionOptions = options?.reconnectionOptions ?? DEFAULT_RECONNECT;
    }

    async start() {
        if (this._eventSource) {
            throw new Error("SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        }
        return await this._startOrAuth();
    }

    async send(message) {
        if (!this._endpoint) {
            throw new Error("Not connected");
        }

        const headers = await this._commonHeaders();
        headers.set("content-type", "application/json");

        const response = await (this._fetch ?? fetch)(this._endpoint, {
            ...this._requestInit,
            method: "POST",
            headers,
            body: JSON.stringify(message),
            signal: this._abortController?.signal
        });

        if (!response.ok) {
            // Handle 401 with OAuth retry
            if (response.status === 401 && this._authProvider) {
                await this._handleAuthChallenge(response);
                return this.send(message);  // Retry after auth
            }
            throw new Error(`Error POSTing to endpoint (HTTP ${response.status})`);
        }

        // Cancel response body - we don't need it for POST
        await response.body?.cancel();
    }

    _scheduleReconnection(resumptionOptions, attempt = 0) {
        const maxRetries = this._reconnectionOptions.maxRetries;
        if (attempt >= maxRetries) {
            this.onerror?.(new Error(`Maximum reconnection attempts (${maxRetries}) exceeded.`));
            return;
        }

        const delay = this._getNextReconnectionDelay(attempt);
        this._reconnectionTimeout = setTimeout(() => {
            this._startOrAuthSse(resumptionOptions).catch((err) => {
                this.onerror?.(new Error(`Failed to reconnect SSE stream: ${err.message}`));
                this._scheduleReconnection(resumptionOptions, attempt + 1);
            });
        }, delay);
    }

    _getNextReconnectionDelay(attempt) {
        // Server-specified retry takes precedence
        if (this._serverRetryMs !== undefined) return this._serverRetryMs;

        // Exponential backoff with caps
        const initial = this._reconnectionOptions.initialReconnectionDelay;
        const growFactor = this._reconnectionOptions.reconnectionDelayGrowFactor;
        const maxDelay = this._reconnectionOptions.maxReconnectionDelay;

        return Math.min(initial * Math.pow(growFactor, attempt), maxDelay);
    }
}

// Mapping: Nw1→SSEClientTransport, A→url, q→options, _scheduleReconnection→_scheduleReconnection
```

### Reconnection Algorithm Analysis

**What it does:** The exponential backoff reconnection strategy ensures the client doesn't overwhelm the server with rapid reconnection attempts while still recovering from transient network issues.

**How it works:**
1. On SSE stream disconnect, `_handleSseStream` catches the error
2. If not explicitly closed by user, `_scheduleReconnection` is called with attempt=0
3. Each retry calculates delay: `initialDelay * (growFactor ^ attempt)` capped at `maxDelay`
4. Default values: `initial=1s`, `factor=2`, `max=30s`
5. After 10 attempts (default), `maxRetries` exceeded → permanent failure

**Why exponential backoff:**
- Network issues are often transient (proxy restart, brief outage)
- Immediate retries would waste resources during extended outages
- Progressive delays give infrastructure time to recover
- Caps prevent infinite reconnection storms

**Resumption token integration:**
- `onresumptiontoken` callback receives the last event ID before disconnect
- On reconnect, `Last-Event-ID` header tells server where to resume
- Prevents message loss during brief disconnects

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
