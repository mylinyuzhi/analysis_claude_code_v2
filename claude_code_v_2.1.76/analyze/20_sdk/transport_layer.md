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
- `createStreamIO` (UXz) - Factory function (chunks.187.mjs:1467)
- `processLine` (method on so6) - Per-line JSON message processor (chunks.184.mjs:2021-2072)
- `sendRequest` (method on so6) - Bidirectional permission request sender (chunks.184.mjs:2078-2117)
- `handleElicitation` (method on so6) - MCP elicitation handler (chunks.184.mjs:2185-2200)
- `createHookCallback` (method on so6) - SDK hook callback creator (chunks.184.mjs:2167-2184)
- `sendMcpMessage` (method on so6) - MCP control channel sender (chunks.184.mjs:2219-2227)
- `createSandboxAskCallback` (method on so6) - Sandbox network permission (chunks.184.mjs:2202-2217)

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

## getTransportForUrl (URq) — Transport Selection

**Location:** `chunks.185.mjs:296-307`

**What it does:** Selects the appropriate transport class based on environment variables and URL protocol. This factory function is called by `RemoteStreamIO` (AI1) constructor.

```javascript
// ============================================
// getTransportForUrl - Transport selection factory
// Location: chunks.185.mjs:296-307
// ============================================

// ORIGINAL (for source lookup):
function URq(A, q = {}, K, Y) {
    if (t6(process.env.CLAUDE_CODE_USE_CCR_V2)) {
        let z = new lDz(A.href);
        if (z.protocol === "wss:") z.protocol = "https:";
        else if (z.protocol === "ws:") z.protocol = "http:";
        return z.pathname = z.pathname.replace(/\/$/, "") + "/worker/events/stream",
               new z26(z, q, K, Y)
    }
    if (A.protocol === "ws:" || A.protocol === "wss:") {
        if (t6(process.env.CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2))
            return new eo6(A, q, K, Y);
        return new to6(A, q, K, Y)
    } else throw Error(`Unsupported protocol: ${A.protocol}`)
}

// READABLE (for understanding):
function getTransportForUrl(url, headers = {}, sessionId, refreshHeaders) {
    // CCR v2 (Cross-Region Replication) uses SSE transport
    if (parseBoolean(process.env.CLAUDE_CODE_USE_CCR_V2)) {
        let sseUrl = new URL(url.href);
        // Convert WebSocket URL to HTTP URL for SSE
        if (sseUrl.protocol === "wss:") sseUrl.protocol = "https:";
        else if (sseUrl.protocol === "ws:") sseUrl.protocol = "http:";
        // Rewrite path: /ws/... → /worker/events/stream
        sseUrl.pathname = sseUrl.pathname.replace(/\/$/, "") + "/worker/events/stream";
        return new SSETransport(sseUrl, headers, sessionId, refreshHeaders);
    }

    // Standard WebSocket transport selection
    if (url.protocol === "ws:" || url.protocol === "wss:") {
        // Hybrid mode: read via WebSocket, write via HTTP POST
        if (parseBoolean(process.env.CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2)) {
            return new HybridTransport(url, headers, sessionId, refreshHeaders);
        }
        // Standard WebSocket: read and write via WebSocket
        return new WebSocketTransport(url, headers, sessionId, refreshHeaders);
    }

    throw Error(`Unsupported protocol: ${url.protocol}`);
}

// Mapping: URq→getTransportForUrl, A→url, q→headers, K→sessionId, Y→refreshHeaders,
//          t6→parseBoolean, z26→SSETransport, eo6→HybridTransport, to6→WebSocketTransport
```

### Transport Selection Decision Tree

```
getTransportForUrl(url, headers, sessionId, refreshHeaders)
    │
    ├── CLAUDE_CODE_USE_CCR_V2 = true?
    │   ├── YES: Convert URL to SSE endpoint → SSETransport (z26)
    │   │         wss://api.com/ws/abc → https://api.com/ws/abc/worker/events/stream
    │   │
    │   └── NO: Continue
    │
    ├── Protocol = "ws:" or "wss:"?
    │   │
    │   ├── YES: CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2 = true?
    │   │   ├── YES: HybridTransport (eo6)
    │   │   │         - Read: WebSocket
    │   │   │         - Write: HTTP POST
    │   │   │
    │   │   └── NO: WebSocketTransport (to6)
    │   │             - Read + Write: WebSocket
    │   │
    │   └── NO: Throw Error ("Unsupported protocol")
```

### Why Multiple Transport Modes?

| Transport | Read | Write | Use Case |
|-----------|------|-------|----------|
| `WebSocketTransport` (to6) | WebSocket | WebSocket | Standard remote SDK |
| `HybridTransport` (eo6) | WebSocket | HTTP POST | High-throughput, firewalled environments |
| `SSETransport` (z26) | HTTP SSE | HTTP POST | Cross-region, CDN-friendly |

**Key insight:** HybridTransport exists because HTTP POST is more firewall-friendly than WebSocket for sending large payloads (like file contents), while WebSocket provides low-latency streaming for receiving events. SSE transport is used in cross-region deployments where WebSocket may not be available.

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

## HybridTransport (eo6) — Dual-Channel Architecture

### Overview

**What it does:** Extends `WebSocketTransport` (`to6`) to use separate channels for reading and writing:
- **Read (inbound):** WebSocket — for low-latency streaming of events from server
- **Write (outbound):** HTTP POST — for reliable, firewall-friendly uploads with batching

**Why this architecture:**
1. **Firewall compatibility:** HTTP POST works in environments that block WebSocket uploads
2. **Batching efficiency:** `stream_event` messages are batched (100ms window) to reduce HTTP overhead
3. **Reliability:** Failed HTTP POSTs are retried with exponential backoff via `BatchQueue` (`Y26`)
4. **Bandwidth optimization:** Large payloads (file contents) use HTTP instead of WebSocket frames

### Complete Implementation

```javascript
// ============================================
// HybridTransport - Dual-channel WebSocket read + HTTP POST write
// Location: chunks.184.mjs:2762-2860
// ============================================

// ORIGINAL (for source lookup):
eo6 = class eo6 extends to6 {
    postUrl;
    uploader;
    streamEventBuffer = [];
    streamEventTimer = null;
    constructor(A, q = {}, K, Y, z) {
        super(A, q, K, Y, z);
        let { maxConsecutiveFailures: _, onBatchDropped: w } = z ?? {};
        this.postUrl = uDz(A);
        this.uploader = new Y26({
            maxBatchSize: 500,
            maxQueueSize: 1e5,
            baseDelayMs: 500,
            maxDelayMs: 8000,
            jitterMs: 1000,
            maxConsecutiveFailures: _,
            onBatchDropped: (O, $) => {
                U1("error", "cli_hybrid_batch_dropped_max_failures", { batchSize: O, failures: $ });
                w?.(O, $)
            },
            send: (O) => this.postOnce(O)
        });
        k(`HybridTransport: POST URL = ${this.postUrl}`);
        U1("info", "cli_hybrid_transport_initialized")
    }
    async write(A) {
        if (A.type === "stream_event") {
            this.streamEventBuffer.push(A);
            if (!this.streamEventTimer) {
                this.streamEventTimer = setTimeout(() => this.flushStreamEvents(), IDz);  // 100ms
            }
            return;
        }
        return await this.uploader.enqueue([...this.takeStreamEvents(), A]), this.uploader.flush();
    }
    async writeBatch(A) {
        return await this.uploader.enqueue([...this.takeStreamEvents(), ...A]), this.uploader.flush();
    }
    get droppedBatchCount() { return this.uploader.droppedBatchCount }
    flush() { return this.uploader.enqueue(this.takeStreamEvents()), this.uploader.flush() }
    takeStreamEvents() {
        if (this.streamEventTimer) clearTimeout(this.streamEventTimer), this.streamEventTimer = null;
        let A = this.streamEventBuffer;
        return this.streamEventBuffer = [], A;
    }
    flushStreamEvents() {
        this.streamEventTimer = null;
        this.uploader.enqueue(this.takeStreamEvents());
    }
    close() {
        if (this.streamEventTimer) clearTimeout(this.streamEventTimer), this.streamEventTimer = null;
        this.streamEventBuffer = [];
        let A = this.uploader, q;
        Promise.race([A.flush(), new Promise((K) => { q = setTimeout(K, xDz) })])  // 3s timeout
            .finally(() => { clearTimeout(q), A.close() });
        super.close();
    }
    async postOnce(A) {
        let q = UW();  // Get session token
        if (!q) {
            k("HybridTransport: No session token available for POST");
            U1("warn", "cli_hybrid_post_no_token");
            return;
        }
        let K = { Authorization: `Bearer ${q}`, "Content-Type": "application/json" }, Y;
        try {
            Y = await X8.post(this.postUrl, { events: A }, { headers: K });
        } catch (z) {
            U1("error", "cli_hybrid_post_error", { error: z.message });
            throw z;
        }
    }
}

// READABLE (for understanding):
class HybridTransport extends WebSocketTransport {
    postUrl;                    // HTTP URL derived from WebSocket URL
    uploader;                   // BatchQueue (Y26) for HTTP POST uploads
    streamEventBuffer = [];     // Accumulated stream_event messages
    streamEventTimer = null;    // 100ms debounce timer

    constructor(wsUrl, headers = {}, sessionId, refreshHeaders, options) {
        super(wsUrl, headers, sessionId, refreshHeaders, options);

        // Convert WebSocket URL to HTTP POST URL
        // wss://api.com/ws/abc → https://api.com/session/abc/events
        this.postUrl = computePostUrl(wsUrl);

        // Create batch uploader with retry logic
        this.uploader = new BatchQueue({
            maxBatchSize: 500,           // Max events per HTTP POST
            maxQueueSize: 100000,        // Max events in memory before backpressure
            baseDelayMs: 500,            // Initial retry delay
            maxDelayMs: 8000,            // Max retry delay cap
            jitterMs: 1000,              // Random jitter for retry
            maxConsecutiveFailures: options?.maxConsecutiveFailures,
            onBatchDropped: (batchSize, failures) => {
                telemetry("error", "cli_hybrid_batch_dropped_max_failures", { batchSize, failures });
                options?.onBatchDropped?.(batchSize, failures);
            },
            send: (batch) => this.postOnce(batch)  // Actual HTTP POST
        });
    }

    // Override: route writes through HTTP POST instead of WebSocket
    async write(message) {
        // Special handling for stream_event: batch for 100ms
        if (message.type === "stream_event") {
            this.streamEventBuffer.push(message);
            if (!this.streamEventTimer) {
                // Start 100ms debounce timer
                this.streamEventTimer = setTimeout(() => this.flushStreamEvents(), 100);
            }
            return;  // Don't flush immediately
        }

        // Non-stream_event: flush any buffered events + this message immediately
        return await this.uploader.enqueue([...this.takeStreamEvents(), message]),
               this.uploader.flush();
    }

    // Take all buffered stream events, clear timer
    takeStreamEvents() {
        if (this.streamEventTimer) {
            clearTimeout(this.streamEventTimer);
            this.streamEventTimer = null;
        }
        let events = this.streamEventBuffer;
        this.streamEventBuffer = [];
        return events;
    }

    // Flush buffered stream events to uploader
    flushStreamEvents() {
        this.streamEventTimer = null;
        this.uploader.enqueue(this.takeStreamEvents());
    }

    close() {
        // Clear buffer and timer
        if (this.streamEventTimer) clearTimeout(this.streamEventTimer);
        this.streamEventTimer = null;
        this.streamEventBuffer = [];

        // Attempt graceful drain with 3s timeout
        let uploader = this.uploader;
        Promise.race([
            uploader.flush(),
            new Promise((resolve) => setTimeout(resolve, 3000))
        ]).finally(() => uploader.close());

        super.close();  // Close WebSocket
    }

    // Perform actual HTTP POST
    async postOnce(batch) {
        let token = getSessionToken();
        if (!token) {
            logDebug("HybridTransport: No session token for POST");
            telemetry("warn", "cli_hybrid_post_no_token");
            return;
        }

        let headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        await httpClient.post(this.postUrl, { events: batch }, { headers });
    }
}

// Mapping: eo6→HybridTransport, to6→WebSocketTransport, Y26→BatchQueue, uDz→computePostUrl,
//          IDz→100 (batch delay ms), xDz→3000 (close timeout ms), UW→getSessionToken,
//          U1→telemetry, k→logDebug, X8→httpClient
```

### Stream Event Batching Algorithm

**What it does:** Accumulates `stream_event` messages for 100ms before sending, reducing HTTP requests by ~90% for high-frequency streaming.

**How it works:**
```
Stream event arrives
    │
    ├── Push to streamEventBuffer[]
    │
    ├── Timer already running?
    │   ├── YES: Return (already scheduled)
    │   └── NO: Start 100ms timer
    │
    └── After 100ms:
        ├── Take all buffered events
        ├── Enqueue to BatchQueue (uploader)
        └── BatchQueue sends via HTTP POST
```

**Why 100ms:**
- Short enough that UI feels responsive (human perception threshold ~200ms)
- Long enough to batch multiple events from a single API streaming response
- Reduces HTTP requests from ~50/second to ~10/second during active streaming

### computePostUrl (uDz) — URL Transformation

```javascript
// ============================================
// computePostUrl - Convert WebSocket URL to HTTP POST URL
// Location: chunks.184.mjs:2740-2745
// ============================================

// ORIGINAL (for source lookup):
function uDz(A) {
    let q = A.protocol === "wss:" ? "https:" : "http:",
        K = A.pathname;
    if (K = K.replace("/ws/", "/session/"), !K.endsWith("/events"))
        K = K.endsWith("/") ? K + "events" : K + "/events";
    return `${q}//${A.host}${K}${A.search}`
}

// READABLE (for understanding):
function computePostUrl(wsUrl) {
    // Change protocol: wss: → https:, ws: → http:
    let protocol = wsUrl.protocol === "wss:" ? "https:" : "http:";

    // Transform path: /ws/<id> → /session/<id>/events
    let path = wsUrl.pathname;
    path = path.replace("/ws/", "/session/");
    if (!path.endsWith("/events")) {
        path = path.endsWith("/") ? path + "events" : path + "/events";
    }

    return `${protocol}//${wsUrl.host}${path}${wsUrl.search}`;
}

// Mapping: uDz→computePostUrl, A→wsUrl, q→protocol, K→path
```

**Example transformations:**
- `wss://api.example.com/ws/abc123` → `https://api.example.com/session/abc123/events`
- `ws://localhost:8080/ws/session-xyz?token=abc` → `http://localhost:8080/session/session-xyz/events?token=abc`

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

### BatchQueue (Y26) — Detailed Algorithm Analysis

**What it does:** A robust HTTP POST batch uploader that collects events into batches, handles network failures with exponential backoff, and manages backpressure when the queue is full.

**Why this design:**
- **Batching efficiency:** Groups up to 500 events into a single POST, reducing HTTP overhead
- **Backpressure management:** Blocks producers when queue is full, preventing memory exhaustion
- **Fault tolerance:** Exponential backoff with jitter prevents thundering herd on server recovery
- **Graceful degradation:** Drops batches after consecutive failures, allowing the system to continue

#### BatchQueue Class Definition

```javascript
// ============================================
// BatchQueue - HTTP POST batch uploader with retry and backpressure
// Location: chunks.184.mjs:2642-2726
// ============================================

// ORIGINAL (for source lookup):
class Y26 {
    pending = [];
    draining = !1;
    closed = !1;
    backpressureResolvers = [];
    sleepResolve = null;
    flushResolvers = [];
    droppedBatches = 0;
    config;
    constructor(A) { this.config = A }
    get droppedBatchCount() { return this.droppedBatches }
    async enqueue(A) {
        if (this.closed) return;
        let q = Array.isArray(A) ? A : [A];
        if (q.length === 0) return;
        while (this.pending.length + q.length > this.config.maxQueueSize && !this.closed)
            await new Promise((K) => { this.backpressureResolvers.push(K) });
        if (this.closed) return;
        this.pending.push(...q), this.drain()
    }
    flush() {
        if (this.pending.length === 0 && !this.draining) return Promise.resolve();
        return this.drain(), new Promise((A) => { this.flushResolvers.push(A) })
    }
    close() {
        this.closed = !0, this.pending = [], this.sleepResolve?.(), this.sleepResolve = null;
        for (let A of this.backpressureResolvers) A();
        this.backpressureResolvers = [];
        for (let A of this.flushResolvers) A();
        this.flushResolvers = []
    }
    async drain() {
        if (this.draining || this.closed) return;
        this.draining = !0;
        let A = 0;
        try {
            while (this.pending.length > 0 && !this.closed) {
                let q = this.pending.splice(0, this.config.maxBatchSize);
                try {
                    await this.config.send(q), A = 0
                } catch (K) {
                    if (A++, this.config.maxConsecutiveFailures !== void 0 && A >= this.config.maxConsecutiveFailures) {
                        this.droppedBatches++, this.config.onBatchDropped?.(q.length, A), A = 0, this.releaseBackpressure();
                        continue
                    }
                    this.pending = q.concat(this.pending);
                    let Y = K instanceof MV6 ? K.retryAfterMs : void 0;
                    await this.sleep(this.retryDelay(A, Y));
                    continue
                }
                this.releaseBackpressure()
            }
        } finally {
            if (this.draining = !1, this.pending.length === 0) {
                for (let q of this.flushResolvers) q();
                this.flushResolvers = []
            }
        }
    }
    retryDelay(A, q) {
        if (q !== void 0) return Math.max(this.config.baseDelayMs, Math.min(q, this.config.maxDelayMs));
        let K = Math.min(this.config.baseDelayMs * 2 ** (A - 1), this.config.maxDelayMs),
            Y = Math.random() * this.config.jitterMs;
        return K + Y
    }
    releaseBackpressure() {
        let A = this.backpressureResolvers;
        this.backpressureResolvers = [];
        for (let q of A) q()
    }
    sleep(A) {
        return new Promise((q) => {
            this.sleepResolve = q, setTimeout((K, Y) => {
                K.sleepResolve = null, Y()
            }, A, this, q)
        })
    }
}

// READABLE (for understanding):
class BatchQueue {
    pending = [];              // Events waiting to be sent
    draining = false;          // Is drain() currently running?
    closed = false;            // Has close() been called?
    backpressureResolvers = []; // Promises waiting for queue space
    sleepResolve = null;       // Resolver for sleep during retry
    flushResolvers = [];       // Promises waiting for flush completion
    droppedBatches = 0;        // Count of dropped batches
    config;                    // Configuration object

    constructor(config) {
        this.config = config;
    }

    // Add events to queue, blocking if queue is full
    async enqueue(items) {
        if (this.closed) return;
        let itemsArray = Array.isArray(items) ? items : [items];
        if (itemsArray.length === 0) return;

        // Backpressure: wait if queue would exceed max size
        while (this.pending.length + itemsArray.length > this.config.maxQueueSize && !this.closed) {
            await new Promise((resolve) => {
                this.backpressureResolvers.push(resolve);
            });
        }
        if (this.closed) return;

        this.pending.push(...itemsArray);
        this.drain();  // Trigger async drain
    }

    // Wait for all pending items to be sent
    flush() {
        if (this.pending.length === 0 && !this.draining) return Promise.resolve();
        this.drain();
        return new Promise((resolve) => {
            this.flushResolvers.push(resolve);
        });
    }

    // Cancel all pending items and resolve all waiters
    close() {
        this.closed = true;
        this.pending = [];
        this.sleepResolve?.();  // Wake up any sleeping retry
        this.sleepResolve = null;
        for (let resolver of this.backpressureResolvers) resolver();
        this.backpressureResolvers = [];
        for (let resolver of this.flushResolvers) resolver();
        this.flushResolvers = [];
    }

    // Main send loop with retry logic
    async drain() {
        if (this.draining || this.closed) return;
        this.draining = true;
        let consecutiveFailures = 0;

        try {
            while (this.pending.length > 0 && !this.closed) {
                // Take up to maxBatchSize items
                let batch = this.pending.splice(0, this.config.maxBatchSize);

                try {
                    await this.config.send(batch);
                    consecutiveFailures = 0;  // Reset on success
                } catch (error) {
                    consecutiveFailures++;

                    // Drop batch if too many consecutive failures
                    if (this.config.maxConsecutiveFailures !== undefined &&
                        consecutiveFailures >= this.config.maxConsecutiveFailures) {
                        this.droppedBatches++;
                        this.config.onBatchDropped?.(batch.length, consecutiveFailures);
                        consecutiveFailures = 0;
                        this.releaseBackpressure();
                        continue;
                    }

                    // Put batch back at front of queue
                    this.pending = batch.concat(this.pending);

                    // Check for server-specified retry delay
                    let retryAfterMs = error instanceof RetryAfterError ? error.retryAfterMs : undefined;
                    await this.sleep(this.retryDelay(consecutiveFailures, retryAfterMs));
                    continue;
                }

                this.releaseBackpressure();
            }
        } finally {
            this.draining = false;
            if (this.pending.length === 0) {
                for (let resolver of this.flushResolvers) resolver();
                this.flushResolvers = [];
            }
        }
    }

    // Calculate retry delay with exponential backoff and jitter
    retryDelay(attempt, serverRetryAfter) {
        // Server-specified retry delay takes precedence
        if (serverRetryAfter !== undefined) {
            return Math.max(this.config.baseDelayMs,
                           Math.min(serverRetryAfter, this.config.maxDelayMs));
        }

        // Exponential backoff: baseDelayMs * 2^(attempt-1)
        let baseWithBackoff = Math.min(
            this.config.baseDelayMs * Math.pow(2, attempt - 1),
            this.config.maxDelayMs
        );

        // Add jitter to prevent thundering herd
        let jitter = Math.random() * this.config.jitterMs;
        return baseWithBackoff + jitter;
    }

    releaseBackpressure() {
        let resolvers = this.backpressureResolvers;
        this.backpressureResolvers = [];
        for (let resolver of resolvers) resolver();
    }

    sleep(ms) {
        return new Promise((resolve) => {
            this.sleepResolve = resolve;
            setTimeout((self, resolver) => {
                self.sleepResolve = null;
                resolver();
            }, ms, this, resolve);
        });
    }
}

// Mapping: Y26→BatchQueue, MV6→RetryAfterError
```

#### Exponential Backoff Algorithm

**The retry formula:**
```
delay = min(baseDelay * 2^(attempt-1), maxDelay) + random(0, jitter)
```

**HybridTransport configuration:**
- `baseDelayMs: 500` — Start with 500ms
- `maxDelayMs: 8000` — Cap at 8 seconds
- `jitterMs: 1000` — Add 0-1000ms random jitter

**Delay progression example:**
```
Attempt 1: 500 * 2^0 + jitter = 500 + [0-1000] = 500-1500ms
Attempt 2: 500 * 2^1 + jitter = 1000 + [0-1000] = 1000-2000ms
Attempt 3: 500 * 2^2 + jitter = 2000 + [0-1000] = 2000-3000ms
Attempt 4: 500 * 2^3 + jitter = 4000 + [0-1000] = 4000-5000ms
Attempt 5+: min(500 * 2^4, 8000) + jitter = 8000 + [0-1000] = 8000-9000ms (capped)
```

**Why jitter matters:** Without jitter, all clients would retry simultaneously after a server recovery, causing another overload. Random jitter spreads retries over time.

#### Backpressure Mechanism

**What it does:** When `pending.length + newItems.length > maxQueueSize`, the `enqueue()` method blocks until space is available.

**Flow diagram:**
```
Producer calls enqueue(items)
    │
    ├── Would exceed maxQueueSize (100,000)?
    │   │
    │   ├── YES: Add Promise to backpressureResolvers
    │   │       await Promise  // Block producer
    │   │       │
    │   │       └── [Unblocked when releaseBackpressure() called]
    │   │
    │   └── NO: Add items to pending array
    │           Trigger drain()
    │
    └── drain() succeeds → releaseBackpressure()
        → All blocked producers resume
```

**Key insight:** Backpressure prevents memory exhaustion when the server is slow or unreachable. Instead of queueing unlimited events, producers are blocked, naturally throttling the system.

#### Batch Drop Strategy

When `maxConsecutiveFailures` is set and exceeded:
1. Increment `droppedBatches` counter
2. Call `onBatchDropped(batchSize, failureCount)` callback
3. Reset failure counter
4. Continue with next batch

**Why drop instead of retry forever:**
- Prevents stale events from accumulating during extended outages
- Allows the system to continue processing new events
- Provides visibility via `onBatchDropped` callback for monitoring

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

## SSETransport (z26) — Server-Sent Events Transport (CCR v2)

**What it does:** Implements a transport layer using Server-Sent Events (SSE) for receiving messages and HTTP POST for sending. Used when `CLAUDE_CODE_USE_CCR_V2=true` environment variable is set.

**Why SSE vs WebSocket:**
- SSE is unidirectional (server → client), which matches the read-heavy pattern of event streaming
- Native browser support and simpler reconnection semantics
- HTTP/2 multiplexing support
- Better proxy/firewall compatibility

### Class Fields

```javascript
class SSETransport {  // z26
    url;                       // SSE endpoint URL
    state = "idle";            // "idle" | "reconnecting" | "connected" | "closing" | "closed"
    onData;                    // callback(dataString) for received messages
    onCloseCallback;           // callback() when permanently closed
    onEventCallback;           // callback for SSE event types
    headers;                   // HTTP headers for requests
    sessionId;                 // Session ID
    refreshHeaders;            // function to refresh auth headers
    abortController = null;    // AbortController for fetch cancellation
    lastSequenceNum = 0;       // Last received sequence number for resume
    seenSequenceNums = new Set; // Deduplication tracking
    reconnectAttempts = 0;     // Exponential backoff counter
    reconnectStartTime = null; // Timestamp for reconnect budget
    reconnectTimer = null;     // setTimeout handle
    livenessTimer = null;      // Keep-alive timer
    postUrl;                   // HTTP POST endpoint for sending
}
```

### connect() — SSE Stream Establishment

```javascript
// ============================================
// SSETransport.connect - Opens SSE stream with resume capability
// Location: chunks.185.mjs:28-83
// ============================================

// ORIGINAL (for source lookup):
async connect() {
    if (this.state !== "idle" && this.state !== "reconnecting") return;
    this.state = "reconnecting";
    let A = new URL(this.url.href);
    if (this.lastSequenceNum > 0) A.searchParams.set("from_sequence_num", String(this.lastSequenceNum));
    let K = { ...this.headers, Accept: "text/event-stream" };
    if (this.lastSequenceNum > 0) K["Last-Event-ID"] = String(this.lastSequenceNum);
    this.abortController = new AbortController;
    let z = await fetch(A.href, { headers: K, signal: this.abortController.signal });
    if (!z.ok) {
        if ([401, 403, 404].includes(z.status)) { this.state = "closed"; this.onCloseCallback?.(); return }
        this.handleConnectionError(); return
    }
    this.state = "connected";
    await this.readStream(z.body)
}

// READABLE (for understanding):
async connect() {
    if (this.state !== "idle" && this.state !== "reconnecting") return;

    this.state = "reconnecting";
    let url = new URL(this.url.href);

    // Resume from last sequence number (enables exactly-once delivery)
    if (this.lastSequenceNum > 0) {
        url.searchParams.set("from_sequence_num", String(this.lastSequenceNum));
    }

    let headers = {
        ...this.headers,
        Accept: "text/event-stream",
        "anthropic-version": "2023-06-01"
    };

    // Last-Event-ID header for standard SSE resume
    if (this.lastSequenceNum > 0) {
        headers["Last-Event-ID"] = String(this.lastSequenceNum);
    }

    this.abortController = new AbortController();
    let response = await fetch(url.href, { headers, signal: this.abortController.signal });

    // Permanent errors (auth, not found)
    if (!response.ok) {
        if ([401, 403, 404].includes(response.status)) {
            this.state = "closed";
            this.onCloseCallback?.();
            return;
        }
        this.handleConnectionError();
        return;
    }

    this.state = "connected";
    this.reconnectAttempts = 0;
    this.reconnectStartTime = null;
    this.resetLivenessTimer();

    // Read the SSE stream
    await this.readStream(response.body);
}

// Mapping: z26→SSETransport, A→url, K→headers, z→response
```

### Sequence Number Tracking

**What it does:** Tracks `lastSequenceNum` to enable exactly-once delivery semantics. On reconnect, the client sends `from_sequence_num` to resume from the last successfully processed message.

**How it works:**
1. Each SSE frame has an `id` field containing a sequence number
2. `lastSequenceNum` is updated when a frame with higher ID is received
3. `seenSequenceNums` Set tracks recent IDs for duplicate detection
4. On reconnect, `from_sequence_num` query parameter requests replay from `lastSequenceNum + 1`

```javascript
// Sequence number update in readStream
if (frame.id) {
    let seqNum = parseInt(frame.id, 10);
    if (!isNaN(seqNum)) {
        // Duplicate detection
        if (this.seenSequenceNums.has(seqNum)) {
            log(`DUPLICATE frame seq=${seqNum}`, { level: "warn" });
        } else {
            this.seenSequenceNums.add(seqNum);
            // LRU cleanup: keep ~1000 entries
            if (this.seenSequenceNums.size > 1000) {
                let threshold = this.lastSequenceNum - 200;
                for (let id of this.seenSequenceNums) {
                    if (id < threshold) this.seenSequenceNums.delete(id);
                }
            }
        }
        if (seqNum > this.lastSequenceNum) {
            this.lastSequenceNum = seqNum;
        }
    }
}
```

### handleSSEFrame() — Event Routing

```javascript
// ============================================
// SSETransport.handleSSEFrame - Routes SSE events
// Location: chunks.185.mjs:134-150
// ============================================

// ORIGINAL (for source lookup):
handleSSEFrame(A, q) {
    if (A !== "client_event") {
        k(`Unexpected SSE event type '${A}'`, { level: "warn" });
        return
    }
    let K;
    try { K = i1(q) } catch (z) { k(`Failed to parse: ${z}`, { level: "error" }); return }
    this.onData?.(K)
}

// READABLE (for understanding):
handleSSEFrame(eventType, data) {
    // Only "client_event" is expected on the worker stream
    if (eventType !== "client_event") {
        log(`Unexpected SSE event type '${eventType}'`, { level: "warn" });
        return;
    }

    let message;
    try {
        message = JSON.parse(data);
    } catch (error) {
        log(`Failed to parse SSE data: ${error}`, { level: "error" });
        return;
    }

    // Route to the onData callback (same as WebSocket onmessage)
    this.onData?.(message);
}

// Mapping: A→eventType, q→data, K→message, i1→JSON.parse
```

### write() — HTTP POST for Outbound

SSE is receive-only. Outbound messages use HTTP POST to `postUrl`:

```javascript
async write(message) {
    // POST to /session/<id>/events
    let response = await fetch(this.postUrl, {
        method: "POST",
        headers: { ...this.headers, "Content-Type": "application/json" },
        body: JSON.stringify(message)
    });
    if (!response.ok) {
        log(`SSE POST failed: ${response.status}`, { level: "error" });
    }
}
```

**Key insight:** The asymmetry (SSE for receive, HTTP POST for send) matches the traffic pattern: high-volume streaming from server, lower-frequency control messages to server. This avoids WebSocket frame overhead for the dominant direction.

---

## getTransportForUrl (URq) — Transport Selection Logic

**What it does:** Selects the appropriate transport class based on environment variables and URL protocol.

**How it works:**
1. If `CLAUDE_CODE_USE_CCR_V2=true`: Use SSETransport (z26)
2. If URL is `ws://` or `wss://`:
   - If `CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2=true`: Use HybridTransport (eo6)
   - Otherwise: Use WebSocketTransport (to6)

```javascript
// ============================================
// getTransportForUrl - Transport factory based on environment
// Location: chunks.185.mjs:296-307
// ============================================

// ORIGINAL (for source lookup):
function URq(A, q = {}, K, Y) {
    if (t6(process.env.CLAUDE_CODE_USE_CCR_V2)) {
        let z = new lDz(A.href);
        if (z.protocol === "wss:") z.protocol = "https:";
        else if (z.protocol === "ws:") z.protocol = "http:";
        z.pathname = z.pathname.replace(/\/$/, "") + "/worker/events/stream";
        return new z26(z, q, K, Y)
    }
    if (A.protocol === "ws:" || A.protocol === "wss:") {
        if (t6(process.env.CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2)) return new eo6(A, q, K, Y);
        return new to6(A, q, K, Y)
    } else throw Error(`Unsupported protocol: ${A.protocol}`)
}

// READABLE (for understanding):
function getTransportForUrl(url, headers = {}, sessionId, refreshHeaders) {
    // CCR v2: Convert WebSocket URL to SSE URL
    if (parseBoolean(process.env.CLAUDE_CODE_USE_CCR_V2)) {
        let sseUrl = new URL(url.href);
        // wss:// → https://, ws:// → http://
        if (sseUrl.protocol === "wss:") sseUrl.protocol = "https:";
        else if (sseUrl.protocol === "ws:") sseUrl.protocol = "http:";
        // Append SSE stream path
        sseUrl.pathname = sseUrl.pathname.replace(/\/$/, "") + "/worker/events/stream";
        return new SSETransport(sseUrl, headers, sessionId, refreshHeaders);
    }

    // WebSocket-based transports
    if (url.protocol === "ws:" || url.protocol === "wss:") {
        // Hybrid: WebSocket read + HTTP POST write
        if (parseBoolean(process.env.CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2)) {
            return new HybridTransport(url, headers, sessionId, refreshHeaders);
        }
        // Standard WebSocket
        return new WebSocketTransport(url, headers, sessionId, refreshHeaders);
    }

    throw Error(`Unsupported protocol: ${url.protocol}`);
}

// Mapping: URq→getTransportForUrl, A→url, q→headers, K→sessionId, Y→refreshHeaders, z26→SSETransport, eo6→HybridTransport, to6→WebSocketTransport, t6→parseBoolean, lDz→URL
```

### Transport Selection Matrix

| Environment | Protocol | Transport Class | Read Path | Write Path |
|-------------|----------|-----------------|-----------|------------|
| Default | `wss://` | WebSocketTransport | WebSocket | WebSocket |
| `POST_FOR_SESSION_INGRESS_V2=true` | `wss://` | HybridTransport | WebSocket | HTTP POST |
| `USE_CCR_V2=true` | `wss://` → `https://` | SSETransport | SSE | HTTP POST |

### CCR v2 Protocol Benefits

**Why CCR v2 uses SSE:**
1. **Simpler reconnection** — SSE has built-in `Last-Event-ID` resume semantics
2. **Sequence numbers** — Enables exactly-once delivery tracking
3. **HTTP/2 support** — Multiplexing with other requests on same connection
4. **Proxy-friendly** — Standard HTTP, no WebSocket upgrade negotiation
5. **Browser-native** — EventSource API for web clients

---

## CCRClient (qa6) — CCR v2 Client Logic

**What it does:** Manages CCR v2 protocol specifics including heartbeats, epoch tracking, and internal event handling.

### Key Features

1. **Heartbeat mechanism** — Periodic HTTP POST to maintain liveness
2. **Epoch tracking** — Detects server-side session resets
3. **Internal events** — Separate channel for telemetry/debug events
4. **Delivery tracking** — Confirms message delivery to server

```javascript
class CCRClient {  // qa6
    workerEpoch = 0;
    heartbeatTimer = null;
    heartbeatInFlight = false;
    currentState = null;
    sessionBaseUrl;
    sessionId;
    workerState;
    eventUploader;           // BatchUploader for events
    internalEventUploader;   // Separate uploader for internal events
    deliveryUploader;        // Delivery confirmation channel
    onEpochMismatch;         // Callback when epoch changes
}
```

### Epoch Mismatch Handling

When `workerEpoch` changes server-side (e.g., session reset), the client must handle the mismatch:

```javascript
// On epoch mismatch: exit and let the orchestrator restart
if (responseEpoch !== this.workerEpoch) {
    log(`Epoch mismatch: expected ${this.workerEpoch}, got ${responseEpoch}`);
    this.onEpochMismatch?.();  // Default: process.exit(1)
}
```

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
// processPermissionResult - Processes MCP tool permission result
// Location: chunks.184.mjs:1621-1642
// ============================================

// ORIGINAL (for source lookup):
function JV6(A, q, K, Y) {
    let z = {
        type: "permissionPromptTool",
        permissionPromptToolName: q.name,
        toolResult: A
    };
    if (A.behavior === "allow") {
        let _ = A.updatedPermissions;
        if (_) Y.setAppState((w) => ({
            ...w,
            toolPermissionContext: _v(w.toolPermissionContext, _)
        })), NC(_);
        return {
            ...A,
            decisionReason: z
        }
    } else if (A.behavior === "deny" && A.interrupt) k(`SDK permission prompt deny+interrupt: tool=${q.name} message=${A.message}`), Y.abortController.abort();
    return {
        ...A,
        decisionReason: z
    }
}

// READABLE (for understanding):
function processPermissionResult(toolCallResult, permissionTool, toolInput, sessionContext) {
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

// Mapping: JV6→processPermissionResult, A→toolCallResult, q→permissionTool, K→toolInput, Y→sessionContext, z→decisionReason, _v→mergePermissions, NC→persistPermissions
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
