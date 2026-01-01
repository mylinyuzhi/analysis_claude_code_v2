# Transport Layer Implementation (Input Side)

> Deep analysis of SDK transport implementations for stdin/stdout and WebSocket communication.
> This document covers the **input side** - reading from SDK clients. See [output_pipeline.md](./output_pipeline.md) for the output side.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - SDK Transport module

Key classes in this document:
- `StdioSDKTransport` (aSA) - stdin/stdout transport class
- `WebSocketSDKTransport` (RD0) - WebSocket transport extending aSA
- `ResilientWebSocket` (OD0) - WebSocket connection manager
- `createWebSocketTransport` (Hw9) - Transport factory function

---

## Transport Class Hierarchy

```
┌────────────────────────────────────────────────────────────────┐
│                      StdioSDKTransport (aSA)                   │
│  chunks.156.mjs:2447-2616                                      │
│                                                                │
│  - input: AsyncIterable<string>                                │
│  - pendingRequests: Map<requestId, {resolve, reject, schema}>  │
│  - structuredInput: AsyncGenerator                             │
│                                                                │
│  Methods:                                                      │
│  + read(): AsyncGenerator<Message>                             │
│  + processLine(line): Message | void                           │
│  + write(message): void                                        │
│  + sendRequest(request, schema, signal): Promise<Response>     │
│  + createCanUseTool(): CanUseToolCallback                      │
│  + createHookCallback(callbackId, timeout): HookCallback       │
│  + sendMcpMessage(serverName, message): Promise<Response>      │
└───────────────────────────────┬────────────────────────────────┘
                                │ extends
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                   WebSocketSDKTransport (RD0)                   │
│  chunks.156.mjs:2805-2836                                      │
│                                                                │
│  - url: URL                                                    │
│  - transport: ResilientWebSocket (OD0)                         │
│  - inputStream: PassThroughStream                              │
│                                                                │
│  Overrides:                                                    │
│  + write(message): void  (delegates to WS transport)           │
│  + close(): void                                               │
└────────────────────────────────────────────────────────────────┘
```

---

## StdioSDKTransport (aSA)

### Class Overview

**Purpose:** Base transport class handling stdin/stdout communication with JSON-lines protocol.

**Responsibilities:**
- Parse incoming JSON-lines from stdin
- Route messages to appropriate handlers
- Manage pending control request/response correlation
- Provide factory methods for permission and hook callbacks

### Class Structure

```javascript
// ============================================
// StdioSDKTransport - stdin/stdout transport class
// Location: chunks.156.mjs:2447-2616
// ============================================

// ORIGINAL (for source lookup):
class aSA {
  input;
  replayUserMessages;
  structuredInput;
  pendingRequests = new Map;
  inputClosed = !1;
  unexpectedResponseCallback;

  constructor(A, Q) {
    this.input = A;
    this.replayUserMessages = Q;
    this.input = A, this.structuredInput = this.read()
  }
  // ... methods
}

// READABLE (for understanding):
class StdioSDKTransport {
  input;                      // AsyncIterable<string> for reading
  replayUserMessages;         // Flag for replay mode
  structuredInput;            // Parsed message generator
  pendingRequests = new Map;  // Map<requestId, PendingRequest>
  inputClosed = false;        // Stream closure flag
  unexpectedResponseCallback; // Handler for orphaned responses

  constructor(inputStream, replayUserMessages) {
    this.input = inputStream;
    this.replayUserMessages = replayUserMessages;
    this.structuredInput = this.read();  // Initialize parser
  }
}

// Mapping: aSA→StdioSDKTransport, A→inputStream, Q→replayUserMessages
```

### Key Methods

#### read() - Async Generator

**What it does:** Parses incoming data stream into individual JSON messages.

**How it works:**
1. Accumulate data into buffer
2. Extract complete lines (newline-delimited)
3. Parse each line via `processLine()`
4. Yield valid messages
5. Handle cleanup on stream close

```javascript
// ============================================
// read() - Async message generator
// Location: chunks.156.mjs:2459-2478
// ============================================

// READABLE:
async *read() {
  let buffer = "";

  for await (let chunk of this.input) {
    buffer += chunk;

    // Extract and process complete lines
    let newlineIndex;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);

      const message = await this.processLine(line);
      if (message) yield message;
    }
  }

  // Handle incomplete final line
  if (buffer) {
    const message = await this.processLine(buffer);
    if (message) yield message;
  }

  // Cleanup
  this.inputClosed = true;
  for (let pending of this.pendingRequests.values()) {
    pending.reject(Error("Tool permission stream closed before response received"));
  }
}
```

**Key insight:** The cleanup phase rejects all pending requests, ensuring SDK clients receive proper error notifications instead of hanging indefinitely.

#### write() - Output Method

```javascript
// ============================================
// write() - Send message to SDK
// Location: chunks.156.mjs:2519-2522
// ============================================

// ORIGINAL:
write(A) {
  L9(JSON.stringify(A) + `\n`)
}

// READABLE:
write(message) {
  writeToStdout(JSON.stringify(message) + "\n");
}

// Mapping: A→message, L9→writeToStdout
```

#### sendRequest() - Control Protocol

**What it does:** Sends control requests and waits for matching responses.

**How it works:**
1. Generate unique request ID
2. Construct control_request message
3. Register in pendingRequests Map
4. Write request to output
5. Return Promise that resolves when response received
6. Handle abort signals for cancellation

```javascript
// ============================================
// sendRequest() - Control protocol handler
// Location: chunks.156.mjs:2523-2563
// ============================================

// READABLE:
async sendRequest(request, responseSchema, abortSignal) {
  const requestId = generateControlRequestId();

  const message = {
    type: "control_request",
    request_id: requestId,
    request: request
  };

  // Pre-checks
  if (this.inputClosed) throw Error("Stream closed");
  if (abortSignal?.aborted) throw Error("Request aborted");

  // Send request
  this.write(message);

  // Setup abort handler
  const abortHandler = () => {
    this.write({
      type: "control_cancel_request",
      request_id: requestId
    });
    const pending = this.pendingRequests.get(requestId);
    if (pending) pending.reject(new AbortError());
  };

  if (abortSignal) {
    abortSignal.addEventListener("abort", abortHandler, { once: true });
  }

  try {
    return await new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, {
        request: message,
        resolve: (response) => resolve(response),
        reject: reject,
        schema: responseSchema
      });
    });
  } finally {
    if (abortSignal) {
      abortSignal.removeEventListener("abort", abortHandler);
    }
    this.pendingRequests.delete(requestId);
  }
}

// Mapping: lg3→generateControlRequestId, WW→AbortError
```

**Key insight:** The Promise-based correlation pattern allows async tool permission checks while maintaining the synchronous agent loop flow.

---

## WebSocketSDKTransport (RD0)

### Class Overview

**Purpose:** WebSocket-based transport extending StdioSDKTransport.

**Why extension pattern:**
- Reuses all message parsing and control protocol logic
- Only overrides I/O methods (write, close)
- Adds WebSocket-specific resilience (via OD0)

### Constructor Flow

```javascript
// ============================================
// WebSocketSDKTransport - WebSocket transport
// Location: chunks.156.mjs:2805-2836
// ============================================

// ORIGINAL:
RD0 = class RD0 extends aSA {
  url;
  transport;
  inputStream;
  constructor(A, Q, B) {
    let G = new tg3({ encoding: "utf8" });
    super(G, B);
    this.inputStream = G, this.url = new og3(A);
    let Z = {},
      I = cAA();
    if (I) Z.Authorization = `Bearer ${I}`;
    if (this.transport = Hw9(this.url, Z), this.transport.setOnData((Y) => {
        this.inputStream.write(Y)
      }), this.transport.setOnClose(() => {
        this.inputStream.end()
      }), this.transport.connect(), PG(async () => this.close()), Q) {
      let Y = this.inputStream;
      (async () => {
        for await (let J of Q) Y.write(J + `\n`)
      })()
    }
  }
  // ...
}

// READABLE:
class WebSocketSDKTransport extends StdioSDKTransport {
  url;
  transport;          // ResilientWebSocket instance
  inputStream;        // PassThrough stream

  constructor(sdkUrl, initialMessages, replayUserMessages) {
    // Create PassThrough stream for input
    const inputStream = new PassThroughStream({ encoding: "utf8" });

    // Initialize parent with PassThrough as input
    super(inputStream, replayUserMessages);

    this.inputStream = inputStream;
    this.url = new URL(sdkUrl);

    // Build auth headers
    const headers = {};
    const authToken = getAuthToken();
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    // Create WebSocket transport
    this.transport = createWebSocketTransport(this.url, headers);

    // Wire up data/close handlers
    this.transport.setOnData((data) => {
      this.inputStream.write(data);
    });

    this.transport.setOnClose(() => {
      this.inputStream.end();
    });

    // Connect
    this.transport.connect();

    // Register cleanup handler
    registerCleanup(async () => this.close());

    // Write initial messages if provided
    if (initialMessages) {
      const stream = this.inputStream;
      (async () => {
        for await (let msg of initialMessages) {
          stream.write(msg + "\n");
        }
      })();
    }
  }

  write(message) {
    this.transport.write(message);
  }

  close() {
    this.transport.close();
    this.inputStream.end();
  }
}

// Mapping: RD0→WebSocketSDKTransport, A→sdkUrl, Q→initialMessages, B→replayUserMessages
// G→inputStream, tg3→PassThroughStream, og3→URL, cAA→getAuthToken, Hw9→createWebSocketTransport
// PG→registerCleanup
```

### Architecture Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                   WebSocketSDKTransport                          │
│                                                                 │
│   ┌─────────────┐      ┌─────────────┐      ┌──────────────┐   │
│   │  WebSocket  │      │ PassThrough │      │ StdioSDK     │   │
│   │  (OD0)      │─────>│   Stream    │─────>│ Transport    │   │
│   │             │      │             │      │ (inherited)  │   │
│   └─────────────┘      └─────────────┘      └──────────────┘   │
│         │                                                       │
│         │ write()                                               │
│         ▼                                                       │
│   ┌─────────────┐                                              │
│   │  WebSocket  │                                              │
│   │   Server    │                                              │
│   └─────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
```

**Key insight:** The PassThrough stream acts as an adapter, allowing the WebSocket data to flow through the same parsing logic as stdin data.

---

## Transport Factory

### createWebSocketTransport Function

```javascript
// ============================================
// createWebSocketTransport - Factory function
// Location: chunks.156.mjs:2789-2792
// ============================================

// ORIGINAL:
function Hw9(A, Q = {}) {
  if (A.protocol === "ws:" || A.protocol === "wss:") return new OD0(A, Q);
  else throw Error(`Unsupported protocol: ${A.protocol}`)
}

// READABLE:
function createWebSocketTransport(url, headers = {}) {
  if (url.protocol === "ws:" || url.protocol === "wss:") {
    return new ResilientWebSocket(url, headers);
  } else {
    throw Error(`Unsupported protocol: ${url.protocol}`);
  }
}

// Mapping: Hw9→createWebSocketTransport, A→url, Q→headers, OD0→ResilientWebSocket
```

---

## Permission Callback Factory

### createCanUseTool Method

**What it does:** Creates a permission callback that bridges SDK permission checks.

**Flow:**
1. First check local permission rules (M$)
2. If result is `allow` or `deny`, return immediately
3. Otherwise, send `can_use_tool` control request to SDK
4. Wait for SDK response and process

```javascript
// ============================================
// createCanUseTool - Permission bridge factory
// Location: chunks.156.mjs:2564-2588
// ============================================

// ORIGINAL:
createCanUseTool() {
  return async (A, Q, B, G, Z) => {
    let I = await M$(A, Q, B, G, Z);
    if (I.behavior === "allow" || I.behavior === "deny") return I;
    try {
      let Y = await this.sendRequest({
        subtype: "can_use_tool",
        tool_name: A.name,
        input: Q,
        permission_suggestions: I.suggestions,
        blocked_path: I.blockedPath,
        decision_reason: ig3(I.decisionReason),
        tool_use_id: Z,
        agent_id: B.agentId
      }, ZW1, B.abortController.signal);
      return nSA(Y, A, Q, B)
    } catch (Y) {
      return nSA({
        behavior: "deny",
        message: `Tool permission request failed: ${Y}`,
        toolUseID: Z
      }, A, Q, B)
    }
  }
}

// READABLE:
createCanUseTool() {
  return async (tool, input, context, globals, toolUseId) => {
    // First check local permission rules
    const localResult = await toolPermissionDispatcher(tool, input, context, globals, toolUseId);

    // Return immediately if decisive
    if (localResult.behavior === "allow" || localResult.behavior === "deny") {
      return localResult;
    }

    // Send to SDK for decision
    try {
      const sdkResponse = await this.sendRequest({
        subtype: "can_use_tool",
        tool_name: tool.name,
        input: input,
        permission_suggestions: localResult.suggestions,
        blocked_path: localResult.blockedPath,
        decision_reason: formatDecisionReason(localResult.decisionReason),
        tool_use_id: toolUseId,
        agent_id: context.agentId
      }, canUseToolResponseSchema, context.abortController.signal);

      return processToolPermissionResponse(sdkResponse, tool, input, context);
    } catch (error) {
      // Fail-safe: deny on error
      return processToolPermissionResponse({
        behavior: "deny",
        message: `Tool permission request failed: ${error}`,
        toolUseID: toolUseId
      }, tool, input, context);
    }
  };
}

// Mapping: A→tool, Q→input, B→context, G→globals, Z→toolUseId
// M$→toolPermissionDispatcher, ig3→formatDecisionReason, ZW1→canUseToolResponseSchema
// nSA→processToolPermissionResponse, I→localResult, Y→sdkResponse/error
```

**Key insight:** The fallback to `deny` on error ensures the agent doesn't proceed with potentially dangerous operations if the SDK communication fails.

---

## Hook Callback Factory

### createHookCallback Method

```javascript
// ============================================
// createHookCallback - Hook bridge factory
// Location: chunks.156.mjs:2589-2606
// ============================================

// ORIGINAL:
createHookCallback(A, Q) {
  return {
    type: "callback",
    timeout: Q,
    callback: async (B, G, Z) => {
      try {
        return await this.sendRequest({
          subtype: "hook_callback",
          callback_id: A,
          input: B,
          tool_use_id: G || void 0
        }, Q91, Z)
      } catch (I) {
        return console.error(`Error in hook callback ${A}:`, I), {}
      }
    }
  }
}

// READABLE:
createHookCallback(callbackId, timeout) {
  return {
    type: "callback",
    timeout: timeout,
    callback: async (input, toolUseId, abortSignal) => {
      try {
        return await this.sendRequest({
          subtype: "hook_callback",
          callback_id: callbackId,
          input: input,
          tool_use_id: toolUseId || undefined
        }, hookCallbackResponseSchema, abortSignal);
      } catch (error) {
        console.error(`Error in hook callback ${callbackId}:`, error);
        return {};  // Return empty object on error (continue)
      }
    }
  };
}

// Mapping: A→callbackId, Q→timeout, B→input, G→toolUseId, Z→abortSignal
// Q91→hookCallbackResponseSchema, I→error
```

---

## MCP Message Routing

### sendMcpMessage Method

```javascript
// ============================================
// sendMcpMessage - MCP protocol bridge
// Location: chunks.156.mjs:2607-2615
// ============================================

// ORIGINAL:
async sendMcpMessage(A, Q) {
  return (await this.sendRequest({
    subtype: "mcp_message",
    server_name: A,
    message: Q
  }, j.object({
    mcp_response: j.any()
  }))).mcp_response
}

// READABLE:
async sendMcpMessage(serverName, message) {
  const response = await this.sendRequest({
    subtype: "mcp_message",
    server_name: serverName,
    message: message
  }, z.object({
    mcp_response: z.any()
  }));

  return response.mcp_response;
}

// Mapping: A→serverName, Q→message, j→z (Zod)
```

---

## Pending Request Management

### Request Tracking Pattern

```javascript
// pendingRequests Map structure
Map<requestId, {
  request: {
    type: "control_request",
    request_id: string,
    request: ControlRequest
  },
  resolve: (response) => void,
  reject: (error) => void,
  schema: ZodSchema | null
}>
```

### Lifecycle

```
1. sendRequest() called
   │
   ├─> Generate requestId
   ├─> Add to pendingRequests Map
   ├─> Write control_request
   └─> Return Promise
           │
           │ (waiting for response)
           ▼
2. processLine() receives control_response
   │
   ├─> Lookup by request_id
   ├─> Remove from pendingRequests
   ├─> Validate with schema (if provided)
   └─> Resolve or reject Promise
           │
           ▼
3. sendRequest() Promise resolves
   │
   └─> Cleanup abort handler
```

---

## Error Handling

### Stream Closure

When the input stream closes unexpectedly:

```javascript
// All pending requests are rejected
this.inputClosed = true;
for (let pending of this.pendingRequests.values()) {
  pending.reject(Error("Tool permission stream closed before response received"));
}
```

### Abort Handling

When abort signal fires:

```javascript
// Send cancel request
this.write({
  type: "control_cancel_request",
  request_id: requestId
});

// Reject with AbortError
pending.reject(new AbortError());
```

---

## Related Documents

- [overview.md](./overview.md) - SDK architecture overview
- [output_pipeline.md](./output_pipeline.md) - Output side implementation
- [message_protocol.md](./message_protocol.md) - Message format details
- [control_protocol.md](./control_protocol.md) - Control request/response
- [websocket_resilience.md](./websocket_resilience.md) - WebSocket patterns
