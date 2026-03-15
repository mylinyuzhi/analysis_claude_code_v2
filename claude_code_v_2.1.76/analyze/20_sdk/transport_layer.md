# SDK Transport Layer

## Overview

The SDK transport layer provides a unified abstraction over two fundamentally different communication channels:

1. **Stdio transport** (`StdioStreamIO` / `so6`) — for local SDK usage where the TypeScript or Python SDK spawns the Claude Code binary as a child process and communicates over stdin/stdout
2. **Remote transport** (`RemoteStreamIO` / `AI1`) — for remote/hosted deployments where `--sdk-url` points to a WebSocket server; extends `StdioStreamIO` and uses `getTransportForUrl` (`URq`) to select among `WebSocketTransport` (`to6`), `HybridTransport` (`eo6`), or `SSETransport` (`z26`)

Both transports implement the same interface and feed into the same NDJSON protocol parser, making them interchangeable from the agent loop's perspective.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Transport symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `StdioStreamIO` (so6) - Base NDJSON transport over stdio
- `RemoteStreamIO` (AI1) - Extends so6 for WebSocket/SSE transport
- `WebSocketTransport` (to6) - WebSocket connection management
- `HybridTransport` (eo6) - Extends to6; reads via WS, writes via HTTP POST
- `BatchQueue` (Y26) - HTTP POST batch uploader for HybridTransport
- `AsyncQueue` (Pi6) - StdioStreamIO outbound message queue
- `getTransportForUrl` (URq) - Selects transport type for AI1
- `createStreamIO` (UXz) - Factory function
- `processLine` (method on so6) - Per-line JSON message processor
- `sendRequest` (method on so6) - Bidirectional permission request sender

---

## Architecture: Transport Hierarchy

```
                        createStreamIO (UXz)
                              │
              ┌───────────────┴────────────────┐
              │ options.sdkUrl?                 │
              ▼ No                              ▼ Yes
      StdioStreamIO (so6)          RemoteStreamIO (AI1)
         │                                │
         │ reads from                     │ extends so6
         ▼                                │ uses getTransportForUrl (URq)
      process.stdin                       │
                                ┌─────────┴────────────┐
                                │ CLAUDE_CODE_POST_...   │
                                ▼ not set               ▼ set
                         WebSocketTransport (to6)  HybridTransport (eo6)
                                │                  extends to6
                                │                  reads: WebSocket
                           WS read+write           writes: HTTP POST
```

---

## StdioStreamIO (so6) — Base Transport

### Class Fields

```javascript
class StdioStreamIO {  // so6
    input;                        // Readable stream (stdin or PassThrough)
    replayUserMessages;           // bool: re-emit control responses to message stream
    structuredInput;              // AsyncGenerator<ParsedMessage> from read()
    pendingRequests = new Map;    // Map<requestId, PendingRequest>
    inputClosed = false;          // true after stream closes
    unexpectedResponseCallback;   // Optional callback for orphaned responses
    resolvedToolUseIds = new Set; // Track resolved IDs (max 1000 per kDz)
    outbound = new Pi6;           // AsyncQueue for outbound messages
    onControlRequestSent;         // callback when control_request is sent
    onControlRequestResolved;     // callback when control_request is resolved
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
// Location: chunks.184.mjs:1969-2000
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
| `assistant` | Yield to agent loop (new in v2.1.76) | Yes |
| `system` | Yield to agent loop (new in v2.1.76) | Yes |
| `unknown` | Warn and return | No |

```javascript
// ============================================
// StdioStreamIO.processLine - Routes incoming NDJSON messages
// Location: chunks.184.mjs:2021-2076
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
        if (q.type === "assistant" || q.type === "system") return q;
        if (q.type !== "user" && q.type !== "control_request") {
            console.warn(`Warning: Unknown message type '${q.type}'`); return
        }
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
        // New in v2.1.76: pass assistant/system messages through to agent loop
        if (message.type === "assistant" || message.type === "system") return message;

        if (message.type !== "user" && message.type !== "control_request") {
            // Unknown type: warn and silently consume (no longer process.exit)
            console.warn(`Warning: Unknown message type '${message.type}'`);
            return;
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

**Error handling design:** JSON parse errors crash the process immediately (`process.exit(1)`). This is intentional — a malformed JSON line in the SDK stream indicates a protocol violation that cannot be recovered from. The alternative (skipping bad lines) could cause desynchronization. Note: in v2.1.76, unknown `message.type` values no longer crash — they are warned and consumed, allowing forward compatibility with new message types.

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
// Location: chunks.184.mjs:2078-2125
// ============================================

// ORIGINAL (for source lookup):
async sendRequest(A, q, K) {
    let Y = wJz(),
        z = { type: "control_request", request_id: Y, request: A };
    if (this.inputClosed) throw Error("Stream closed");
    if (K?.aborted) throw Error("Request aborted");
    this.outbound.enqueue(z);
    let w = () => {
        this.outbound.enqueue({ type: "control_cancel_request", request_id: Y });
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

    // Enqueue the request to the outbound AsyncQueue (Pi6) instead of writing directly
    // The outbound queue is drained by a separate writer loop, decoupling send from stream write
    this.outbound.enqueue(controlRequest);

    // Setup cancellation: if aborted, enqueue cancel into outbound queue
    let cancelHandler = () => {
        this.outbound.enqueue({ type: "control_cancel_request", request_id: requestId });
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

**Key change in v2.1.76:** `sendRequest` now uses `this.outbound.enqueue(controlRequest)` instead of `await this.write(controlRequest)` directly. This decouples message production from stream I/O — the `outbound` `AsyncQueue` (Pi6) is drained by a separate writer loop. This prevents sendRequest from blocking if the underlying write is slow, and ensures that cancellation enqueues immediately without awaiting a previous write.

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

### createHookCallback() (line 2167)

**What it does:** Creates a callback function that, when invoked, sends a `hook` subtype `control_request` to the SDK client and awaits its response. Used to wire SDK-registered hooks into the agent loop's hook execution path.

**How it works:**
1. Returns a closure that captures the hook name and schema
2. When called with hook arguments, calls `this.sendRequest({ subtype: "hook", hookName, args }, schema, abortSignal)`
3. The `sendRequest` enqueues the control_request; response arrives via `processLine` resolving the Promise

**Key insight:** By returning a callback rather than a direct method call, the hook system can treat SDK hooks identically to local hooks — both are just `async (args) => result` functions.

---

### handleElicitation() (line 2185)

**What it does:** Handles "elicitation" requests — structured prompts sent to the SDK client to collect user input during agent execution. This is the SDK-side complement to interactive CLI prompts.

**How it works:**
1. Constructs an elicitation `control_request` with a schema describing the expected response shape
2. Calls `sendRequest` which enqueues it to the `outbound` queue
3. Awaits the client's `control_response` containing the user's input
4. Validates the response against the provided Zod schema
5. Returns the validated response object

**Why this approach:** Elicitation enables SDK clients to inject structured human input mid-execution (e.g., asking the user a clarifying question) without breaking the streaming protocol. The `control_request` / `control_response` round-trip provides synchronization.

---

### createSandboxAskCallback() (line 2202)

**What it does:** Creates a callback that asks the SDK client whether a sandbox command should be allowed. Used by the sandbox system to route permission decisions through the SDK's control channel.

**How it works:**
1. Returns a closure wrapping `sendRequest` with a `sandbox_permission` subtype
2. When the sandbox executor encounters a command requiring approval, it calls this callback
3. The SDK client receives the `control_request`, displays it to the user or applies policy, and sends back `control_response`
4. The callback resolves with `{ behavior: "allow" | "deny" }`

**Trade-off:** Routing sandbox permissions through the SDK control channel (rather than a separate permission system) keeps the protocol unified — there is only one mechanism for the SDK client to handle permission decisions.

---

## RemoteStreamIO (AI1) — WebSocket/SSE Bridge

**What it does:** Extends `StdioStreamIO` (`so6`) to connect to a remote server instead of reading from local stdin. The parent class's NDJSON parser handles all the message processing — `AI1` simply bridges the selected transport's data into the same interface.

**Architecture:** Creates a `PassThrough` stream as a "virtual stdin", then feeds transport messages into it. The parent's `read()` generator reads from this PassThrough stream exactly as it would read from real stdin. In v2.1.76, `AI1` uses `getTransportForUrl` (`URq`) to pick among `WebSocketTransport` (`to6`), `HybridTransport` (`eo6`), or `SSETransport` (`z26`) based on environment variables and URL scheme.

**New fields in v2.1.76:**
- `isBridge` — true when acting as a bridge between two streams
- `isDebug` — enables debug logging
- `ccrClient` — CCR (Claude Code Remote) client for CCR v2 protocol
- Keep-alive timer — sends periodic heartbeat to maintain server-side connection

```javascript
// ============================================
// RemoteStreamIO - Transport-bridged stream IO (extends StdioStreamIO)
// Location: chunks.185.mjs:672-780
// ============================================

// ORIGINAL (for source lookup):
AI1 = class AI1 extends so6 {
    url; transport; inputStream; isBridge; isDebug; ccrClient;
    constructor(A, q, K) {
        let Y = new GJz({ encoding: "utf8" });
        super(Y, K);
        this.inputStream = Y, this.url = new WJz(A);
        let z = {}, w = nV();
        if (w) z.Authorization = `Bearer ${w}`;
        let H = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
        if (H) z["x-environment-runner-version"] = H;
        this.transport = URq(this.url, z, U6());
        this.transport.setOnData(($) => { this.inputStream.write($) });
        this.transport.setOnClose(() => { this.inputStream.end() });
        this.transport.connect();
        Tq(async () => this.close());
        if (q) {
            let $ = this.inputStream;
            (async () => { for await (let O of q) $.write(O + `\n`) })()
        }
    }
    async write(A) { await this.transport.write(A) }
    close() { this.transport.close(), this.inputStream.end() }
}

// READABLE (for understanding):
class RemoteStreamIO extends StdioStreamIO {
    url; transport; inputStream; isBridge; isDebug; ccrClient;

    constructor(sdkUrl, replayMessagesGenerator, shouldReplayUserMessages) {
        // Create PassThrough stream as virtual stdin
        let passthroughStream = new PassThrough({ encoding: "utf8" });
        super(passthroughStream, shouldReplayUserMessages);  // Parent reads from this
        this.inputStream = passthroughStream;
        this.url = new URL(sdkUrl);

        // Build HTTP headers for transport upgrade
        let headers = {};
        let sessionToken = getSessionToken();   // Auth from keychain
        if (sessionToken) headers.Authorization = `Bearer ${sessionToken}`;
        let envRunnerVersion = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
        if (envRunnerVersion) headers["x-environment-runner-version"] = envRunnerVersion;

        // NEW in v2.1.76: use getTransportForUrl to select transport type
        // - Default: WebSocketTransport (to6)
        // - CLAUDE_CODE_POST_... set: HybridTransport (eo6)
        // - CCR v2: SSETransport (z26)
        this.transport = getTransportForUrl(this.url, headers, getSessionId());
        this.transport.setOnData((data) => { this.inputStream.write(data) });  // Transport → PassThrough
        this.transport.setOnClose(() => { this.inputStream.end() });           // Close → stream end
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

    // Override: route writes through transport instead of stdout
    async write(message) { await this.transport.write(message) }

    close() { this.transport.close(); this.inputStream.end() }
}

// Mapping: AI1→RemoteStreamIO, so6→StdioStreamIO, GJz→PassThrough, WJz→URL, nV→getSessionToken, URq→getTransportForUrl, U6→getSessionId, Tq→registerExitHandler
```

**Key insight about the PassThrough bridge:** Rather than reimplementing the NDJSON parser, `RemoteStreamIO` simply wires the transport's `onData` callback to write into the PassThrough stream. The parent class's `read()` generator then processes this stream identically to how it processes stdin. This is a clean "adapter pattern" — Transport → PassThrough → identical NDJSON protocol. In v2.1.76, this pattern is extended to support multiple transport backends through `getTransportForUrl`.

---

## WebSocketTransport (to6) — Connection Management

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
// Location: chunks.184.mjs:2375-2430
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
// Location: chunks.184.mjs:2465-2490
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

## HybridTransport (eo6) — HTTP POST Batch Upload

**What it does:** Extends `WebSocketTransport` (`to6`). Reads inbound messages via WebSocket (inherited), but writes outbound messages via HTTP POST to a separate endpoint. This decouples high-volume event streaming (HTTP POST with batching) from the real-time control channel (WebSocket).

**Why this approach:** WebSocket is bidirectional but each message adds round-trip overhead for high-frequency `stream_event` messages. HTTP POST with batching amortizes that overhead — multiple events can be bundled into a single request. The hybrid approach keeps low-latency control messages on WebSocket while routing high-volume event data through the more efficient HTTP path.

### Class Overview

```javascript
class HybridTransport extends WebSocketTransport {  // eo6 extends to6
    postUrl;    // https://host/session/<id>/events  (computed from wss://host/ws/<id>)
    uploader;   // BatchQueue(Y26) for HTTP POST delivery
    streamEventBuffer;   // Array of buffered stream_event messages
    flushTimer;          // setTimeout handle for 100ms flush window
}

// Key constants:
const STREAM_EVENT_BUFFER_TIMEOUT_MS = 100;   // IDz: 100ms coalesce window
const FLUSH_TIMEOUT_MS = 15000;               // bDz: 15s flush timeout
const CLOSE_FLUSH_TIMEOUT_MS = 3000;          // xDz: 3s close flush timeout
```

### write() — Dual-Path Message Routing

**What it does:** Routes `stream_event` messages through a 100ms coalescing buffer, then HTTP POST. All other messages flush the buffer first, then POST immediately.

**How it works:**
1. If `message.type === "stream_event"`:
   - Add to `streamEventBuffer`
   - If no flush timer running: start 100ms timer → `flushStreamEvents()`
2. Otherwise (control messages, etc.):
   - Flush any buffered stream events immediately
   - Then POST this message via `uploader.enqueue(message)`

```javascript
// ============================================
// HybridTransport.write - Stream events buffered; other messages POST immediately
// Location: chunks.184.mjs:2800-2840
// ============================================

// ORIGINAL (for source lookup):
async write(A) {
    if (A.type === "stream_event") {
        this.streamEventBuffer.push(A);
        if (!this.flushTimer) this.flushTimer = setTimeout(() => this.flushStreamEvents(), IDz)
    } else {
        await this.flushStreamEvents();
        this.uploader.enqueue(A)
    }
}

// READABLE (for understanding):
async write(message) {
    if (message.type === "stream_event") {
        // Buffer stream events: flush in batches every 100ms
        this.streamEventBuffer.push(message);
        if (!this.flushTimer) {
            this.flushTimer = setTimeout(() => this.flushStreamEvents(), STREAM_EVENT_BUFFER_TIMEOUT_MS);
        }
    } else {
        // Control message: flush buffered events first (maintain ordering), then POST
        await this.flushStreamEvents();
        this.uploader.enqueue(message);
    }
}

// Mapping: IDz→STREAM_EVENT_BUFFER_TIMEOUT_MS (100)
```

### BatchQueue Configuration (uploader)

```javascript
uploader = new BatchQueue({   // Y26
    maxBatchSize: 500,         // Max events per POST request
    maxQueueSize: 100000,      // Max queued events before backpressure
    baseDelayMs: 500,          // Retry base delay
    maxDelayMs: 8000,          // Retry max delay (capped)
    jitterMs: 1000,            // Retry jitter
    postUrl: this.postUrl,     // https://host/session/<id>/events
    flushTimeoutMs: 15000      // bDz: per-batch HTTP timeout
})
```

### postUrl Computation (uDz)

`computePostUrl` (`uDz`) converts the WebSocket URL to the HTTP POST endpoint:
- Input: `wss://host/ws/<sessionId>` or `ws://host/ws/<sessionId>`
- Output: `https://host/session/<sessionId>/events` or `http://host/session/<sessionId>/events`

```javascript
// uDz: wss://host/ws/abc123 → https://host/session/abc123/events
function computePostUrl(wsUrl) {
    let url = new URL(wsUrl);
    url.protocol = url.protocol === "wss:" ? "https:" : "http:";
    url.pathname = url.pathname.replace(/^\/ws\//, "/session/") + "/events";
    return url.toString();
}
```

### close() — Graceful Flush on Shutdown

```javascript
async close() {
    // Flush remaining buffered stream events (up to 3s timeout)
    await Promise.race([
        this.flushStreamEvents(),
        sleep(CLOSE_FLUSH_TIMEOUT_MS)
    ]);
    // Flush BatchQueue (drain any pending POSTs)
    await this.uploader.flush();
    // Then close WebSocket (inherited)
    super.close();
}
```

**Key insight:** The 3-second close flush timeout (`xDz`) ensures that stream events produced in the final moments of execution are delivered even if the process is shutting down. Without this, the last batch of events could be lost on abrupt termination.

---

## createStreamIO (UXz) — Transport Factory

```javascript
// ============================================
// createStreamIO - Factory: selects StdioStreamIO or RemoteStreamIO
// Location: chunks.187.mjs:1467-1481
// ============================================

// ORIGINAL (for source lookup):
function UXz(A, q) {
    // ... create inputStream from A (string or existing stream) ...
    return q.sdkUrl ? new AI1(q.sdkUrl, K, q.replayUserMessages) : new so6(K, q.replayUserMessages)
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
        ? new RemoteStreamIO(options.sdkUrl, inputStream, options.replayUserMessages)
        : new StdioStreamIO(inputStream, options.replayUserMessages);
}

// Mapping: UXz→createStreamIO, A→promptInput, q→options, AI1→RemoteStreamIO, so6→StdioStreamIO
```

---

## Permission Prompt Tool — MCP-Based Permission Handling

**What it does:** When `--permission-prompt-tool <tool-name>` is specified, Claude Code routes permission prompts to an MCP tool instead of to the SDK's `control_request` mechanism. This allows a fully automated permission granting system embedded in the MCP server.

```javascript
// ============================================
// handlePermissionPromptToolResult - Processes MCP tool permission result
// Location: chunks.184.mjs:989-1010
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
