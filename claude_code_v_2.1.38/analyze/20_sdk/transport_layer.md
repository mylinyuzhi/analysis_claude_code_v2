# SDK Transport Layer

## Overview

The SDK transport layer provides a unified abstraction over two fundamentally different communication channels:

1. **Stdio transport** (`StdioStreamIO` / `Mc1`) — for local SDK usage where the TypeScript or Python SDK spawns the Claude Code binary as a child process and communicates over stdin/stdout
2. **WebSocket transport** (`WebSocketTransport` / `Pc1` + `SdkUrlStreamIO` / `FQA`) — for remote/hosted deployments where `--sdk-url` points to a WebSocket server

Both transports implement the same interface and feed into the same NDJSON protocol parser, making them interchangeable from the agent loop's perspective.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Transport symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `StdioStreamIO` (Mc1) - Base NDJSON transport over stdio
- `SdkUrlStreamIO` (FQA) - WebSocket-bridged transport
- `WebSocketTransport` (Pc1) - WebSocket connection management
- `createStreamIO` (IJz) - Factory that selects transport type
- `processLine` (method on Mc1) - Per-line JSON message processor
- `sendRequest` (method on Mc1) - Bidirectional permission request sender

---

## Architecture: Transport Hierarchy

```
                        createStreamIO (IJz)
                              │
              ┌───────────────┴────────────────┐
              │ options.sdkUrl?                 │
              ▼ No                              ▼ Yes
      StdioStreamIO (Mc1)          SdkUrlStreamIO (FQA)
         │                                │
         │ reads from                     │ extends StdioStreamIO
         ▼                                │ + wraps WebSocketTransport
      process.stdin                       │
      (ReadableStream)          WebSocketTransport (Pc1)
                                          │
                                    ┌─────┴─────┐
                                    │ Runtime?   │
                                    ▼            ▼
                                  Bun WS      Node ws lib
                                  native    (ws package)
```

---

## StdioStreamIO (Mc1) — Base Transport

### Class Fields

```javascript
class StdioStreamIO {
    input;                     // Readable stream (stdin or PassThrough)
    replayUserMessages;        // bool: re-emit control responses to message stream
    structuredInput;           // AsyncGenerator<ParsedMessage> from read()
    pendingRequests = new Map; // Map<requestId, PendingRequest>
    inputClosed = false;       // true after stream closes
    unexpectedResponseCallback; // Optional callback for orphaned responses
}
```

### read() — NDJSON Line Parser

**What it does:** Async generator that continuously reads from the input stream, accumulates data into a buffer, splits on newlines, and yields parsed messages.

**How it works:**
1. Reads chunks from the input stream (async iterator)
2. Appends each chunk to a string buffer
3. Finds newlines in buffer with `indexOf('\n')`
4. Slices each line, calls `processLine(line)`, yields if non-null
5. After stream closes, processes any remaining partial line
6. Sets `inputClosed = true`
7. Rejects all pending permission requests with "stream closed" error

```javascript
// ============================================
// StdioStreamIO.read - NDJSON line-by-line reader
// Location: chunks.178.mjs:1082-1113
// ============================================

// ORIGINAL (for source lookup):
async * read() {
    let A = "";
    for await (let q of this.input) {
        A += q;
        let K;
        while ((K = A.indexOf(`\n`)) !== -1) {
            let Y = A.slice(0, K);
            A = A.slice(K + 1);
            let z = await this.processLine(Y);
            if (z) yield z
        }
    }
    if (A) { let q = await this.processLine(A); if (q) yield q }
    this.inputClosed = !0;
    for (let q of this.pendingRequests.values()) q.reject(Error("Tool permission stream closed before response received"))
}

// READABLE (for understanding):
async * read() {
    let buffer = "";
    for await (let chunk of this.input) {
        buffer += chunk;
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            let message = await this.processLine(line);
            if (message) yield message;
        }
    }
    // Handle remaining partial line (no trailing newline)
    if (buffer) {
        let message = await this.processLine(buffer);
        if (message) yield message;
    }
    this.inputClosed = true;
    // Fail any pending permission requests
    for (let pending of this.pendingRequests.values()) {
        pending.reject(Error("Tool permission stream closed before response received"));
    }
}

// Mapping: A→buffer, q→chunk/pending, K→newlineIndex, Y→line, z→message
```

**Key insight:** The generator is infinite until the input stream closes. This means the agent loop's main `for await` loop blocks on this generator waiting for new user messages. The SDK can send messages at any time, and the agent processes them in arrival order.

---

### processLine() — Message Router

**What it does:** Parses a single JSON line and routes it to the appropriate handler. Returns the message to yield, or `undefined` to silently consume.

**Routing table:**

| `message.type` | Action | Yields? |
|---|---|---|
| `keep_alive` | Consume silently | No |
| `update_environment_variables` | Apply to `process.env` | No |
| `control_response` | Resolve pending Promise | Conditional (if replayUserMessages) |
| `control_request` | Return to caller | Yes |
| `user` | Validate role, return | Yes |
| Other | `process.exit(1)` | Never |

```javascript
// ============================================
// StdioStreamIO.processLine - Routes incoming NDJSON messages
// Location: chunks.178.mjs:1115-1160
// ============================================

// ORIGINAL (for source lookup):
async processLine(A) {
    try {
        let q = _A(A);
        if (q.type === "keep_alive") return;
        if (q.type === "update_environment_variables") {
            for (let [K, Y] of Object.entries(q.variables)) process.env[K] = Y;
            return
        }
        if (q.type === "control_response") {
            let K = this.pendingRequests.get(q.response.request_id);
            if (!K) {
                if (this.unexpectedResponseCallback) await this.unexpectedResponseCallback(q);
                return
            }
            if (this.pendingRequests.delete(q.response.request_id), q.response.subtype === "error") {
                K.reject(Error(q.response.error)); return
            }
            let Y = q.response.response;
            if (K.schema) try { K.resolve(K.schema.parse(Y)) } catch (z) { K.reject(z) }
            else K.resolve({});
            if (this.replayUserMessages) return q;
            return
        }
        if (q.type !== "user" && q.type !== "control_request") bQA(`Error: Expected message type 'user' or 'control', got '${q.type}'`);
        if (q.type === "control_request") {
            if (!q.request) bQA("Error: Missing request on control_request");
            return q
        }
        if (q.message.role !== "user") bQA(`Error: Expected message role 'user', got '${q.message.role}'`);
        return q
    } catch (q) { console.error(`Error parsing streaming input line: ${A}: ${q}`), process.exit(1) }
}

// READABLE (for understanding):
async processLine(rawLine) {
    try {
        let message = parseJSON(rawLine);
        if (message.type === "keep_alive") return;  // Heartbeat: no action
        if (message.type === "update_environment_variables") {
            for (let [key, value] of Object.entries(message.variables)) {
                process.env[key] = value;
            }
            return;
        }
        if (message.type === "control_response") {
            let pending = this.pendingRequests.get(message.response.request_id);
            if (!pending) {
                // Orphaned response (e.g. timed out)
                if (this.unexpectedResponseCallback) await this.unexpectedResponseCallback(message);
                return;
            }
            this.pendingRequests.delete(message.response.request_id);
            if (message.response.subtype === "error") {
                pending.reject(Error(message.response.error));
                return;
            }
            let responseData = message.response.response;
            if (pending.schema) {
                // Validate response against expected Zod schema
                try { pending.resolve(pending.schema.parse(responseData)) }
                catch (validationError) { pending.reject(validationError) }
            } else {
                pending.resolve({});  // No schema: resolve with empty object
            }
            // In replay mode: also emit the response to the message stream
            if (this.replayUserMessages) return message;
            return;
        }
        if (message.type !== "user" && message.type !== "control_request") {
            fatalError(`Expected message type 'user' or 'control', got '${message.type}'`);
        }
        if (message.type === "control_request") {
            if (!message.request) fatalError("Missing request on control_request");
            return message;  // Yield to agent loop's control_request handler
        }
        if (message.message.role !== "user") {
            fatalError(`Expected message role 'user', got '${message.message.role}'`);
        }
        return message;  // Yield to agent loop as user message
    } catch (error) {
        console.error(`Error parsing streaming input line: ${rawLine}: ${error}`);
        process.exit(1);  // Fatal: bad JSON is unrecoverable
    }
}

// Mapping: _A→parseJSON, bQA→fatalError
```

**Error handling design:** JSON parse errors crash the process immediately (`process.exit(1)`). This is intentional — a malformed JSON line in the SDK stream indicates a protocol violation that cannot be recovered from. The alternative (skipping bad lines) could cause desynchronization.

---

### sendRequest() — Bidirectional Permission Protocol

**What it does:** Sends a `control_request` to the SDK client (requesting permission to use a tool) and awaits the client's `control_response`. Returns the parsed response.

**How it works:**
1. Generates a unique `request_id`
2. Writes `control_request` JSON to stdout
3. Registers a Promise in `pendingRequests` keyed by `request_id`
4. Sets up abort handling for cancellation
5. Awaits the Promise (resolved by `processLine` when response arrives)
6. Returns the validated response

```javascript
// ============================================
// StdioStreamIO.sendRequest - Async permission request/response
// Location: chunks.178.mjs:1163-1210
// ============================================

// ORIGINAL (for source lookup):
async sendRequest(A, q, K) {
    let Y = wJz(),
        z = { type: "control_request", request_id: Y, request: A };
    if (this.inputClosed) throw Error("Stream closed");
    if (K?.aborted) throw Error("Request aborted");
    await this.write(z);
    let w = () => {
        this.write({ type: "control_cancel_request", request_id: Y });
        let H = this.pendingRequests.get(Y);
        if (H) H.reject(new dz)
    };
    if (K) K.addEventListener("abort", w, { once: !0 });
    try {
        return await new Promise((H, $) => {
            this.pendingRequests.set(Y, {
                request: { type: "control_request", request_id: Y, request: A },
                resolve: (O) => { H(O) },
                reject: $,
                schema: q
            })
        })
    } finally {
        K?.removeEventListener("abort", w);
        this.pendingRequests.delete(Y)
    }
}

// READABLE (for understanding):
async sendRequest(requestPayload, responseSchema, abortSignal) {
    let requestId = generateUUID();
    let controlRequest = { type: "control_request", request_id: requestId, request: requestPayload };

    if (this.inputClosed) throw Error("Stream closed");
    if (abortSignal?.aborted) throw Error("Request aborted");

    // Send the request to the SDK client
    await this.write(controlRequest);

    // Setup cancellation: if aborted, cancel the pending request
    let cancelHandler = () => {
        this.write({ type: "control_cancel_request", request_id: requestId });
        let pending = this.pendingRequests.get(requestId);
        if (pending) pending.reject(new AbortError());
    };
    if (abortSignal) abortSignal.addEventListener("abort", cancelHandler, { once: true });

    try {
        return await new Promise((resolve, reject) => {
            this.pendingRequests.set(requestId, {
                request: { type: "control_request", request_id: requestId, request: requestPayload },
                resolve: (response) => { resolve(response) },
                reject: reject,
                schema: responseSchema  // Zod schema for response validation
            });
        });
    } finally {
        abortSignal?.removeEventListener("abort", cancelHandler);
        this.pendingRequests.delete(requestId);  // Cleanup regardless of outcome
    }
}

// Mapping: A→requestPayload, q→responseSchema, K→abortSignal, Y→requestId, z→controlRequest, w→cancelHandler, dz→AbortError, wJz→generateUUID
```

**Concurrency model:** Multiple `sendRequest` calls can be in-flight simultaneously — each has a unique `request_id`. The `pendingRequests` Map tracks all of them, and `processLine` routes responses back using the ID. The `getPendingPermissionRequests()` method lets the initialize response include any already-pending requests.

---

### getPendingPermissionRequests()

Returns pending `can_use_tool` requests. Used when sending the `initialize` control response, so the client immediately knows what permissions need to be granted.

```javascript
getPendingPermissionRequests() {
    return Array.from(this.pendingRequests.values())
        .map((entry) => entry.request)
        .filter((req) => req.request.subtype === "can_use_tool");
}
```

---

## SdkUrlStreamIO (FQA) — WebSocket Bridge

**What it does:** Extends `StdioStreamIO` to connect to a WebSocket server instead of reading from local stdin. The parent class's NDJSON parser handles all the message processing — `FQA` simply bridges WebSocket data into the same interface.

**Architecture:** Creates a `PassThrough` stream as a "virtual stdin", then feeds WebSocket messages into it. The parent's `read()` generator reads from this PassThrough stream exactly as it would read from real stdin.

```javascript
// ============================================
// SdkUrlStreamIO - WebSocket-based stream IO bridging to StdioStreamIO
// Location: chunks.178.mjs:1630-1663
// ============================================

// ORIGINAL (for source lookup):
FQA = class FQA extends Mc1 {
    url; transport; inputStream;
    constructor(A, q, K) {
        let Y = new GJz({ encoding: "utf8" });
        super(Y, K);
        this.inputStream = Y, this.url = new WJz(A);
        let z = {}, w = nV();
        if (w) z.Authorization = `Bearer ${w}`;
        let H = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
        if (H) z["x-environment-runner-version"] = H;
        if (this.transport = zMq(this.url, z, U6()),
            this.transport.setOnData(($) => { this.inputStream.write($) }),
            this.transport.setOnClose(() => { this.inputStream.end() }),
            this.transport.connect(),
            Tq(async () => this.close()),
            q) {
            let $ = this.inputStream;
            (async () => { for await (let O of q) $.write(O + `\n`) })()
        }
    }
    async write(A) { await this.transport.write(A) }
    close() { this.transport.close(), this.inputStream.end() }
}

// READABLE (for understanding):
class SdkUrlStreamIO extends StdioStreamIO {
    url; transport; inputStream;

    constructor(sdkUrl, replayMessagesGenerator, shouldReplayUserMessages) {
        // Create PassThrough stream as virtual stdin
        let passthroughStream = new PassThrough({ encoding: "utf8" });
        super(passthroughStream, shouldReplayUserMessages);  // Parent reads from this
        this.inputStream = passthroughStream;
        this.url = new URL(sdkUrl);

        // Build HTTP headers for WebSocket upgrade
        let headers = {};
        let sessionToken = getSessionToken();   // Auth from keychain
        if (sessionToken) headers.Authorization = `Bearer ${sessionToken}`;
        let envRunnerVersion = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
        if (envRunnerVersion) headers["x-environment-runner-version"] = envRunnerVersion;

        // Create and wire up the transport
        this.transport = createWebSocketTransport(this.url, headers, getSessionId());
        this.transport.setOnData((data) => { this.inputStream.write(data) });  // WS → PassThrough
        this.transport.setOnClose(() => { this.inputStream.end() });           // WS close → stream end
        this.transport.connect();

        // Auto-cleanup on process exit
        registerExitHandler(async () => this.close());

        // If replay generator provided, feed messages through
        if (replayMessagesGenerator) {
            let stream = this.inputStream;
            (async () => {
                for await (let message of replayMessagesGenerator) {
                    stream.write(message + '\n');
                }
            })();
        }
    }

    // Override: route writes through WebSocket instead of stdout
    async write(message) { await this.transport.write(message) }

    close() { this.transport.close(); this.inputStream.end() }
}

// Mapping: FQA→SdkUrlStreamIO, GJz→PassThrough, WJz→URL, nV→getSessionToken, zMq→createWebSocketTransport, U6→getSessionId, Tq→registerExitHandler
```

**Key insight about the PassThrough bridge:** Rather than reimplementing the NDJSON parser, `SdkUrlStreamIO` simply wires the WebSocket `onData` callback to write into the PassThrough stream. The parent class's `read()` generator then processes this stream identically to how it processes stdin. This is a clean "adapter pattern" — WebSocket → PassThrough → identical NDJSON protocol.

---

## WebSocketTransport (Pc1) — Connection Management

### Class Fields and Constants

```javascript
class WebSocketTransport {
    ws;                    // Native WebSocket instance (Bun or ws-lib)
    lastSentId;            // UUID of last sent message (for X-Last-Request-Id header on reconnect)
    url;                   // WebSocket URL
    state;                 // "idle" | "reconnecting" | "connected" | "closing" | "closed"
    onData;                // callback(dataString) - invoked for each received message
    onCloseCallback;       // callback() - invoked when permanently closed
    headers;               // HTTP headers for WebSocket upgrade
    sessionId;             // Session ID (passed in X-Session-Id or similar)
    reconnectAttempts;     // Counter for exponential backoff
    reconnectStartTime;    // Timestamp when reconnection began
    reconnectTimer;        // setTimeout handle for next reconnect
    pingInterval;          // setInterval handle for keep-alive pings
    pongReceived;          // boolean: did we get pong for last ping?
    messageBuffer;         // CircularBuffer(1000) — last 1000 sent messages for replay
}

// Reconnection constants:
const BASE_BACKOFF_MS = 1000;          // _Jz: 1 second initial backoff
const MAX_BACKOFF_MS = 30000;          // JJz: 30 second cap
const MAX_RECONNECT_DURATION_MS = 600000;  // XJz: 10 minutes total
const MESSAGE_BUFFER_SIZE = 1000;      // OJz: circular buffer capacity
```

### Reconnection Algorithm

**What it does:** Implements exponential backoff with jitter for automatic reconnection. Gives up after 10 minutes total.

**How it works:**
1. On disconnect: call `doDisconnect()` to clean up WebSocket
2. If state is already `closing`/`closed`, skip reconnect
3. Start or continue reconnect timer
4. Calculate backoff: `min(1000 * 2^attempts, 30000)` ms
5. Apply ±25% jitter: `backoff + backoff * 0.25 * (2 * random - 1)`
6. After 10 minutes total: set state to `closed`, call `onCloseCallback`

```javascript
// ============================================
// WebSocketTransport.handleConnectionError - Reconnection with exponential backoff
// Location: chunks.178.mjs:1375-1430
// ============================================

// ORIGINAL (for source lookup):
handleConnectionError() {
    if (h(`WebSocketTransport: Disconnected from ${this.url.href}`), H8("info", "cli_websocket_disconnected"), this.doDisconnect(), this.state === "closing" || this.state === "closed") return;
    let A = Date.now();
    if (!this.reconnectStartTime) this.reconnectStartTime = A;
    let q = A - this.reconnectStartTime;
    if (q < XJz) {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
        this.state = "reconnecting", this.reconnectAttempts++;
        let K = Math.min(_Jz * Math.pow(2, this.reconnectAttempts - 1), JJz),
            Y = Math.max(0, K + K * 0.25 * (2 * Math.random() - 1));
        h(`WebSocketTransport: Reconnecting in ${Math.round(Y)}ms (attempt ${this.reconnectAttempts}, ${Math.round(q/1000)}s elapsed)`),
        H8("error", "cli_websocket_reconnect_attempt", { reconnectAttempts: this.reconnectAttempts }),
        this.reconnectTimer = setTimeout(() => { this.reconnectTimer = null, this.connect() }, Y)
    } else {
        h(`WebSocketTransport: Reconnection time budget exhausted after ${Math.round(q/1000)}s`, { level: "error" });
        H8("error", "cli_websocket_reconnect_exhausted", { reconnectAttempts: this.reconnectAttempts, elapsedMs: q });
        this.state = "closed";
        if (this.onCloseCallback) this.onCloseCallback()
    }
}

// READABLE (for understanding):
handleConnectionError() {
    logDebug(`Disconnected from ${this.url.href}`);
    telemetry("info", "cli_websocket_disconnected");
    this.doDisconnect();

    if (this.state === "closing" || this.state === "closed") return;  // Intentional close

    let now = Date.now();
    if (!this.reconnectStartTime) this.reconnectStartTime = now;
    let elapsedMs = now - this.reconnectStartTime;

    if (elapsedMs < MAX_RECONNECT_DURATION_MS) {
        if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
        this.state = "reconnecting";
        this.reconnectAttempts++;

        // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s (capped), ...
        let backoff = Math.min(BASE_BACKOFF_MS * Math.pow(2, this.reconnectAttempts - 1), MAX_BACKOFF_MS);
        // ±25% jitter to avoid thundering herd
        let jittered = Math.max(0, backoff + backoff * 0.25 * (2 * Math.random() - 1));

        logDebug(`Reconnecting in ${Math.round(jittered)}ms (attempt ${this.reconnectAttempts})`);
        this.reconnectTimer = setTimeout(() => { this.reconnectTimer = null; this.connect() }, jittered);
    } else {
        // Give up after 10 minutes
        logError(`Reconnection budget exhausted after ${Math.round(elapsedMs/1000)}s`);
        this.state = "closed";
        if (this.onCloseCallback) this.onCloseCallback();  // Triggers stream end → loop exit
    }
}

// Mapping: XJz→MAX_RECONNECT_DURATION_MS (600000), _Jz→BASE_BACKOFF_MS (1000), JJz→MAX_BACKOFF_MS (30000)
```

**Backoff sequence for typical disconnects:**
- Attempt 1: ~1s ± 250ms
- Attempt 2: ~2s ± 500ms
- Attempt 3: ~4s ± 1s
- Attempt 4: ~8s ± 2s
- Attempt 5: ~16s ± 4s
- Attempt 6+: ~30s ± 7.5s (capped)
- After 10 minutes: permanent failure

### Message Replay on Reconnect

When reconnecting with `X-Last-Request-Id` header, the server can resume from a checkpoint:

```javascript
// On reconnect with lastSentId: add header
if (this.lastSentId) {
    headers["X-Last-Request-Id"] = this.lastSentId;
}

// On open: replay buffered messages the server missed
ws.on("open", () => {
    let serverLastId = upgradeReq.headers["x-last-request-id"];
    if (serverLastId) this.replayBufferedMessages(serverLastId);
});
```

The `CircularBuffer(1000)` stores the last 1000 sent messages. On reconnect, `replayBufferedMessages` finds the server's acknowledged `lastId` and re-sends everything after it.

### Ping/Pong Keep-Alive

```javascript
// Start ping interval after connection established
startPingInterval() {
    this.pingInterval = setInterval(() => {
        if (this.pongReceived) {
            this.pongReceived = false;
            this.ws.ping();
        } else {
            // Pong not received: connection dead
            this.handleConnectionError();
        }
    }, PING_INTERVAL_MS);  // ~10 seconds
}
```

**Why both ping/pong AND keep_alive messages:**
- **Ping/pong** (WebSocket protocol level): Detects dead TCP connections where packets are dropped silently
- **`keep_alive` messages** (application level): Sent periodically to maintain connection through proxies/load balancers that close idle WebSocket connections

### write() — Send with Message Tracking

```javascript
// ============================================
// WebSocketTransport.write - Send message and track for replay
// Location: chunks.178.mjs:1465-1490
// ============================================

// ORIGINAL (for source lookup):
async write(A) {
    if ("uuid" in A && typeof A.uuid === "string") this.messageBuffer.add(A), this.lastSentId = A.uuid;
    let q = Q1(A) + `\n`;
    if (this.state !== "connected") return;
    let K = this.sessionId ? ` session=${this.sessionId}` : "",
        Y = this.getControlMessageDetailLabel(A);
    h(`WebSocketTransport: Sending message type=${A.type}${K}${Y}`), this.sendLine(q)
}

// READABLE (for understanding):
async write(message) {
    // Track messages with UUIDs for replay on reconnect
    if ("uuid" in message && typeof message.uuid === "string") {
        this.messageBuffer.add(message);  // Add to circular buffer
        this.lastSentId = message.uuid;   // Track last sent for reconnect header
    }
    let jsonLine = JSON.stringify(message) + '\n';
    if (this.state !== "connected") return;  // Drop if not connected
    let sessionLabel = this.sessionId ? ` session=${this.sessionId}` : "";
    let controlLabel = this.getControlMessageDetailLabel(message);
    logDebug(`Sending message type=${message.type}${sessionLabel}${controlLabel}`);
    this.sendLine(jsonLine);
}

// Mapping: A→message, q→jsonLine, Q1→stringify, K→sessionLabel, Y→controlLabel
```

**Why only messages with UUIDs are buffered:** Protocol messages like `keep_alive` and `control_cancel_request` don't have UUIDs and don't need replay. Only semantic messages (assistant responses, tool results, etc.) are buffered.

### Runtime Detection (Bun vs. Node.js)

```javascript
connect() {
    if (typeof Bun !== "undefined") {
        // Bun has native WebSocket support
        let ws = new globalThis.WebSocket(url, {
            headers: headers,
            proxy: getProxy(url)
        });
        ws.addEventListener("open", ...);
        ws.addEventListener("message", ...);
    } else {
        // Node.js: use 'ws' npm package
        let { default: WebSocketLib } = await import("ws");
        let ws = new WebSocketLib(url, {
            headers: headers,
            agent: getAgent(url)
        });
        ws.on("open", ...);
        ws.on("message", ...);
        ws.on("pong", () => { this.pongReceived = true });  // Only needed for ws lib
    }
}
```

**Why `pong` handler is only for ws lib:** Bun's WebSocket handles ping/pong at the native level and doesn't expose pong events the same way. The Node.js `ws` library provides explicit pong callbacks.

---

## createStreamIO (IJz) — Transport Factory

```javascript
// ============================================
// createStreamIO - Factory: selects StdioStreamIO or SdkUrlStreamIO
// Location: chunks.179.mjs:1887-1901
// ============================================

// ORIGINAL (for source lookup):
function IJz(A, q) {
    // ... create inputStream from A (string or existing stream) ...
    return q.sdkUrl ? new FQA(q.sdkUrl, K, q.replayUserMessages) : new Mc1(K, q.replayUserMessages)
}

// READABLE (for understanding):
function createStreamIO(promptInput, options) {
    let inputStream;
    if (typeof promptInput === "string") {
        // Wrap string prompt as NDJSON user message
        inputStream = createReadableFromString([jsonStringify({type:"user",message:{role:"user",content:promptInput}})]);
    } else {
        inputStream = promptInput;  // Already a stream (from stdin)
    }
    return options.sdkUrl
        ? new SdkUrlStreamIO(options.sdkUrl, inputStream, options.replayUserMessages)
        : new StdioStreamIO(inputStream, options.replayUserMessages);
}

// Mapping: IJz→createStreamIO, A→promptInput, q→options, FQA→SdkUrlStreamIO, Mc1→StdioStreamIO
```

---

## Permission Prompt Tool — MCP-Based Permission Handling

**What it does:** When `--permission-prompt-tool <tool-name>` is specified, Claude Code routes permission prompts to an MCP tool instead of to the SDK's `control_request` mechanism. This allows a fully automated permission granting system embedded in the MCP server.

```javascript
// ============================================
// handlePermissionPromptToolResult - Processes MCP tool permission result
// Location: chunks.178.mjs:989-1010
// ============================================

// ORIGINAL (for source lookup):
function jc1(A, q, K, Y) {
    let z = { type: "permissionPromptTool", permissionPromptToolName: q.name, toolResult: A };
    if (A.behavior === "allow") {
        let w = A.updatedPermissions;
        if (w) Y.setAppState((H) => ({ ...H, toolPermissionContext: WV(H.toolPermissionContext, w) })), nC(w);
        return { ...A, decisionReason: z }
    } else if (A.behavior === "deny" && A.interrupt) {
        h(`SDK permission prompt deny+interrupt: tool=${q.name} message=${A.message}`), Y.abortController.abort()
    }
    return { ...A, decisionReason: z }
}

// READABLE (for understanding):
function handlePermissionPromptToolResult(toolCallResult, permissionTool, toolInput, sessionContext) {
    let decisionReason = {
        type: "permissionPromptTool",
        permissionPromptToolName: permissionTool.name,
        toolResult: toolCallResult
    };
    if (toolCallResult.behavior === "allow") {
        let updatedPerms = toolCallResult.updatedPermissions;
        if (updatedPerms) {
            // Apply new permissions to app state
            sessionContext.setAppState((state) => ({
                ...state,
                toolPermissionContext: mergePermissions(state.toolPermissionContext, updatedPerms)
            }));
            persistPermissions(updatedPerms);  // Save to disk
        }
        return { ...toolCallResult, decisionReason };
    } else if (toolCallResult.behavior === "deny" && toolCallResult.interrupt) {
        // deny+interrupt: abort the entire session
        logDebug(`SDK permission prompt deny+interrupt: tool=${permissionTool.name}`);
        sessionContext.abortController.abort();
    }
    return { ...toolCallResult, decisionReason };
}

// Mapping: jc1→handlePermissionPromptToolResult, A→toolCallResult, q→permissionTool, K→toolInput, Y→sessionContext, z→decisionReason, WV→mergePermissions, nC→persistPermissions
```

**Permission tool flow:**
```
Agent wants to use tool "Bash"
  │
  ├── permissionPromptToolName set?
  │     │
  │     ▼ Yes
  │   Call MCP tool: { tool_name: "Bash", input: {...}, tool_use_id: "..." }
  │   Race with: AbortSignal (if agent aborted)
  │   Parse JSON response: { behavior: "allow" | "deny" | "ask" }
  │   Call handlePermissionPromptToolResult()
  │     ├── "allow" → apply updatedPermissions, return allow
  │     ├── "deny" + interrupt → abort entire session
  │     └── "deny" → return deny
  │
  └── No permissionPromptToolName
        │
        ▼
      SDK control_request/control_response flow
```

**Why this matters:** The MCP permission prompt tool enables fully automated CI/CD scenarios where a programmatic MCP server makes all permission decisions without any human interaction. The regular `control_request` flow requires the SDK client to implement permission handling; the MCP tool approach pushes that logic into the MCP server layer.
