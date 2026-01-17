# SDK Architecture Overview (Claude Code 2.1.7)

> Analysis of the SDK transport layer enabling external SDKs (Python, TypeScript, CLI) to interact with Claude Code.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - SDK Transport module

Key classes in this document:
- `StdioSDKTransport` (wmA) - Stdin/stdout transport for SDK communication
- `WebSocketSDKTransport` (Fy0) - WebSocket transport for remote SDK communication
- `WebSocketTransport` (Vy0) - Low-level WebSocket connection handler
- `AsyncMessageQueue` (khA) - Producer-consumer output buffer
- `runSDKAgentLoop` (LR7) - Main SDK agent loop generator
- `runNonInteractiveSession` (hw9) - Non-interactive session runner

---

## Architecture Overview

Claude Code supports two modes of SDK integration:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                      SDK Architecture Overview                              │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  SDK Client                    Claude Code CLI                              │
│  (Python/TS)                                                               │
│                                                                            │
│  ┌──────────┐   stdin/stdout   ┌──────────────────────────────────────┐   │
│  │ SDK API  │◄────────────────►│ StdioSDKTransport (wmA)              │   │
│  └──────────┘                  │                                       │   │
│                                │   • JSON-lines protocol               │   │
│                                │   • Control request/response          │   │
│                                │   • Bidirectional streaming           │   │
│                                └─────────────┬────────────────────────┘   │
│                                              │                             │
│                                              ▼                             │
│  Remote Agent                  ┌──────────────────────────────────────┐   │
│  (Background)                  │ runSDKAgentLoop (LR7)                │   │
│                                │                                       │   │
│  ┌──────────┐   WebSocket      │   • Permission callbacks             │   │
│  │ Backend  │◄────────────────►│   • Hook execution                   │   │
│  └──────────┘                  │   • MCP message routing              │   │
│                                │   • AsyncMessageQueue (khA)          │   │
│         │                      └─────────────┬────────────────────────┘   │
│         │                                    │                             │
│         │                                    ▼                             │
│         │                      ┌──────────────────────────────────────┐   │
│         │                      │ Agent Loop (v19)                      │   │
│         │                      │                                       │   │
│         └─────────────────────►│   • LLM API calls                    │   │
│         WebSocketSDKTransport  │   • Tool execution                   │   │
│         (Fy0)                  │   • Message streaming                │   │
│                                └──────────────────────────────────────┘   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Two Transport Modes

### 1. StdioSDKTransport (wmA) - Default Mode

**Purpose:** Communication with SDK clients that spawn Claude Code as a subprocess.

**Used by:**
- Python SDK (`claude-agent-sdk`)
- TypeScript SDK
- Direct CLI usage with `--print` flag

**Location:** `chunks.155.mjs:2621-2790`

```javascript
// ============================================
// StdioSDKTransport - Stdin/stdout transport
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
  constructor(A, Q) {
    this.input = A;
    this.replayUserMessages = Q;
    this.input = A, this.structuredInput = this.read()
  }
  // ...
}

// READABLE (for understanding):
class StdioSDKTransport {
  input;                        // Raw input stream
  replayUserMessages;           // Flag to echo messages back
  structuredInput;              // Async generator for parsed messages
  pendingRequests = new Map();  // Control request → Promise mapping
  inputClosed = false;          // Stream close flag
  unexpectedResponseCallback;   // Handler for orphaned responses

  constructor(inputStream, replayUserMessages) {
    this.input = inputStream;
    this.replayUserMessages = replayUserMessages;
    this.structuredInput = this.read();
  }
}

// Mapping: wmA→StdioSDKTransport, A→inputStream, Q→replayUserMessages
```

### 2. WebSocketSDKTransport (Fy0) - Remote Mode

**Purpose:** Communication with remote backend services via WebSocket for background agents.

**Used by:**
- Remote agent execution
- Background agents with `--sdk-url` flag

**Location:** `chunks.155.mjs:3000-3034`

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
    // ...
  }
}

// READABLE (for understanding):
class WebSocketSDKTransport extends StdioSDKTransport {
  url;          // WebSocket URL
  transport;    // WebSocketTransport instance
  inputStream;  // PassThrough stream for bridging

  constructor(url, initialInputStream, replayUserMessages) {
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

    // Create WebSocket transport
    this.transport = createWebSocketTransport(this.url, headers, getSessionId());
    this.transport.setOnData((data) => this.inputStream.write(data));
    this.transport.setOnClose(() => this.inputStream.end());
    this.transport.connect();

    // Forward initial input stream messages
    if (initialInputStream) {
      (async () => {
        for await (const line of initialInputStream) {
          passThroughStream.write(line + "\n");
        }
      })();
    }
  }
}

// Mapping: Fy0→WebSocketSDKTransport, A→url, Q→initialInputStream, B→replayUserMessages
```

---

## Entry Point Detection

Claude Code detects SDK mode through environment variables:

```javascript
// ============================================
// Entry Point Detection
// Location: chunks.156.mjs:1818-1854
// ============================================

// ORIGINAL (for source lookup):
function B_7(A) {
  if (process.env.CLAUDE_CODE_ENTRYPOINT) return;
  let Q = process.argv.slice(2),
    B = Q.indexOf("mcp");
  if (B !== -1 && Q[B + 1] === "serve") {
    process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
    return
  }
  if (a1(process.env.CLAUDE_CODE_ACTION)) {
    process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
    return
  }
  process.env.CLAUDE_CODE_ENTRYPOINT = A ? "sdk-cli" : "cli"
}

// READABLE (for understanding):
function setEntryPoint(isPrintMode) {
  // Skip if already set externally
  if (process.env.CLAUDE_CODE_ENTRYPOINT) return;

  const args = process.argv.slice(2);
  const mcpIndex = args.indexOf("mcp");

  // Check for MCP serve mode
  if (mcpIndex !== -1 && args[mcpIndex + 1] === "serve") {
    process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
    return;
  }

  // Check for GitHub Action
  if (parseBoolean(process.env.CLAUDE_CODE_ACTION)) {
    process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
    return;
  }

  // Set based on print mode
  process.env.CLAUDE_CODE_ENTRYPOINT = isPrintMode ? "sdk-cli" : "cli";
}

// Mapping: B_7→setEntryPoint, A→isPrintMode
```

### Entry Point Types

| Entry Point | Environment Variable | Description |
|-------------|---------------------|-------------|
| `cli` | (default) | Interactive CLI mode |
| `sdk-cli` | `--print` flag | SDK print mode |
| `sdk-py` | Set by Python SDK | Python SDK integration |
| `sdk-ts` | Set by TypeScript SDK | TypeScript SDK integration |
| `mcp` | `mcp serve` command | MCP server mode |
| `claude-vscode` | VS Code extension | IDE integration |
| `local-agent` | Local agent mode | Background agent |
| `claude-code-github-action` | GitHub Action | CI/CD integration |

---

## Transport Factory

The `createIOHandler` function selects the appropriate transport based on CLI options:

```javascript
// ============================================
// createIOHandler - Transport factory
// Location: chunks.155.mjs:3036-3055 (inferred from TR7)
// ============================================

// READABLE (for understanding):
function createIOHandler(input, options) {
  let inputStream;

  if (typeof input === "string") {
    // String input - wrap as initial user message
    if (input.trim() !== "") {
      inputStream = createReadableStream([JSON.stringify({
        type: "user",
        session_id: "",
        message: { role: "user", content: input },
        parent_tool_use_id: null
      })]);
    } else {
      inputStream = createReadableStream([]);
    }
  } else {
    // Already a stream (from stdin)
    inputStream = input;
  }

  // Choose transport based on SDK URL presence
  if (options.sdkUrl) {
    return new WebSocketSDKTransport(options.sdkUrl, inputStream, options.replayUserMessages);
  } else {
    return new StdioSDKTransport(inputStream, options.replayUserMessages);
  }
}
```

### Transport Selection Logic

```
┌────────────────────────────────────────────────────────────────┐
│                     Transport Selection                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Input Type                  Action                             │
│  ──────────────────────────  ────────────────────────────────   │
│  string (non-empty)          Wrap as user message JSON stream   │
│  string (empty/whitespace)   Empty stream                       │
│  stream (stdin)              Use directly                       │
│                                                                 │
│  options.sdkUrl              Transport Type                     │
│  ──────────────────────────  ────────────────────────────────   │
│  present (truthy)            → WebSocketSDKTransport (Fy0)      │
│  absent (falsy)              → StdioSDKTransport (wmA)          │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Session Loading (jR7)

The `loadInitialMessages` function handles session resumption for SDK mode:

### Session Loading Options

| Option | CLI Flag | Description |
|--------|----------|-------------|
| `continue` | `--continue` | Resume last session |
| `teleport` | `--teleport <id>` | Resume from remote session |
| `resume` | `--resume <id>` | Resume specific session by UUID |
| `resumeSessionAt` | `--resume-session-at <uuid>` | Resume from specific message |
| `forkSession` | `--fork-session` | Create new session from history |

### Resume Target Parsing (vw9)

```javascript
// ============================================
// parseResumeTarget - Determine resume source type
// Location: chunks.155.mjs:3061-3088
// ============================================

// READABLE:
function parseResumeTarget(resumeArg) {
  // 1. Try as URL (WebSocket reconnect)
  try {
    const url = new URL(resumeArg);
    return {
      sessionId: generateSessionId(),
      ingressUrl: url.href,
      isUrl: true,
      jsonlFile: null,
      isJsonlFile: false
    };
  } catch {}

  // 2. Check if valid UUID
  if (isValidUUID(resumeArg)) {
    return {
      sessionId: resumeArg,
      ingressUrl: null,
      isUrl: false,
      jsonlFile: null,
      isJsonlFile: false
    };
  }

  // 3. Check if .jsonl file
  if (resumeArg.endsWith(".jsonl")) {
    return {
      sessionId: generateSessionId(),
      ingressUrl: null,
      isUrl: false,
      jsonlFile: resumeArg,
      isJsonlFile: true
    };
  }

  return null;  // Invalid
}
```

### Session Loading Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Session Loading Flow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  --continue         --teleport            --resume              │
│       │                  │                     │                │
│       ▼                  ▼                     ▼                │
│  Load last         Fetch remote         Parse target           │
│  session           session              (vw9)                   │
│       │                  │                     │                │
│       │                  │              ┌──────┼──────┐         │
│       │                  │              ▼      ▼      ▼         │
│       │                  │            URL    UUID   .jsonl      │
│       │                  │              │      │      │         │
│       │                  │              │      │      │         │
│       ▼                  ▼              ▼      ▼      ▼         │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              Restore file history                     │      │
│  │              Set session ID                           │      │
│  │              Return messages                          │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Transport Methods

### 1. read() - Async Input Generator

```javascript
// ============================================
// read - Async input generator
// Location: chunks.155.mjs:2633-2652
// ============================================

// READABLE (for understanding):
async * read() {
  let buffer = "";

  for await (const chunk of this.input) {
    buffer += chunk;
    let newlineIndex;

    // Process complete lines
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      const message = await this.processLine(line);
      if (message) yield message;
    }
  }

  // Handle remaining data without newline
  if (buffer) {
    const message = await this.processLine(buffer);
    if (message) yield message;
  }

  // Mark input as closed and reject pending requests
  this.inputClosed = true;
  for (const pending of this.pendingRequests.values()) {
    pending.reject(Error("Tool permission stream closed before response received"));
  }
}
```

### 2. processLine() - Message Parsing and Routing

```javascript
// ============================================
// processLine - Message parser and router
// Location: chunks.155.mjs:2659-2692
// ============================================

// READABLE (for understanding):
async processLine(line) {
  try {
    const message = JSON.parse(line);

    // Ignore keepalives
    if (message.type === "keep_alive") return;

    // Handle control responses
    if (message.type === "control_response") {
      const pending = this.pendingRequests.get(message.response.request_id);
      if (!pending) {
        // Unexpected response - call callback if registered
        if (this.unexpectedResponseCallback) {
          await this.unexpectedResponseCallback(message);
        }
        return;
      }

      this.pendingRequests.delete(message.response.request_id);

      if (message.response.subtype === "error") {
        pending.reject(Error(message.response.error));
        return;
      }

      const responseData = message.response.response;
      if (pending.schema) {
        try {
          pending.resolve(pending.schema.parse(responseData));
        } catch (validationError) {
          pending.reject(validationError);
        }
      } else {
        pending.resolve({});
      }

      if (this.replayUserMessages) return message;
      return;
    }

    // Validate message type
    if (message.type !== "user" && message.type !== "control_request") {
      exitWithError(`Error: Expected 'user' or 'control_request', got '${message.type}'`);
    }

    // Validate control request structure
    if (message.type === "control_request" && !message.request) {
      exitWithError("Error: Missing request on control_request");
    }

    // Validate user message role
    if (message.type === "user" && message.message.role !== "user") {
      exitWithError(`Error: Expected role 'user', got '${message.message.role}'`);
    }

    return message;
  } catch (error) {
    console.error(`Error parsing streaming input line: ${line}: ${error}`);
    process.exit(1);
  }
}
```

### 3. write() - Output Sender

```javascript
// ============================================
// write - Output sender (stdout)
// Location: chunks.155.mjs:2693-2696
// ============================================

// ORIGINAL:
write(A) {
  J9(eA(A) + `\n`)
}

// READABLE:
write(message) {
  writeToStdout(JSON.stringify(message) + "\n");
}

// Mapping: J9→writeToStdout, eA→JSON.stringify
```

### 4. sendRequest() - Control Request Sender

```javascript
// ============================================
// sendRequest - Control request with Promise correlation
// Location: chunks.155.mjs:2697-2737
// ============================================

// READABLE (for understanding):
async sendRequest(request, schema, abortSignal) {
  const requestId = generateControlRequestId();
  const fullRequest = {
    type: "control_request",
    request_id: requestId,
    request: request
  };

  if (this.inputClosed) throw Error("Stream closed");
  if (abortSignal?.aborted) throw Error("Request aborted");

  this.write(fullRequest);

  // Abort handler for cancellation
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
        request: fullRequest,
        resolve: (response) => resolve(response),
        reject,
        schema
      });
    });
  } finally {
    if (abortSignal) {
      abortSignal.removeEventListener("abort", abortHandler);
    }
    this.pendingRequests.delete(requestId);
  }
}
```

---

## SDK Callback Factories

### 1. createCanUseTool() - Permission Callback

```javascript
// ============================================
// createCanUseTool - Permission callback factory
// Location: chunks.155.mjs:2738-2762
// ============================================

// READABLE (for understanding):
createCanUseTool() {
  return async (tool, input, context, globals, toolUseId) => {
    // First check local permission rules
    const localResult = await toolPermissionDispatcher(tool, input, context, globals, toolUseId);

    // If decisive, return immediately
    if (localResult.behavior === "allow" || localResult.behavior === "deny") {
      return localResult;
    }

    // Otherwise, ask SDK client
    try {
      const sdkResponse = await this.sendRequest({
        subtype: "can_use_tool",
        tool_name: tool.name,
        input: input,
        permission_suggestions: localResult.suggestions,
        blocked_path: localResult.blockedPath,
        decision_reason: extractDecisionReason(localResult.decisionReason),
        tool_use_id: toolUseId,
        agent_id: context.agentId
      }, canUseToolResponseSchema, context.abortController.signal);

      return processToolPermissionResponse(sdkResponse, tool, input, context);
    } catch (error) {
      return processToolPermissionResponse({
        behavior: "deny",
        message: `Tool permission request failed: ${error}`,
        toolUseID: toolUseId
      }, tool, input, context);
    }
  };
}
```

### 2. createHookCallback() - Hook Callback Factory

```javascript
// ============================================
// createHookCallback - Hook callback factory
// Location: chunks.155.mjs:2763-2780
// ============================================

// READABLE (for understanding):
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
        return {};
      }
    }
  };
}
```

### 3. sendMcpMessage() - MCP Message Router

```javascript
// ============================================
// sendMcpMessage - MCP message router
// Location: chunks.155.mjs:2781-2789
// ============================================

// READABLE (for understanding):
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
```

---

## v2.1.7 Changes from v2.0.59

### New Features

1. **WebSocketTransport Resilience (Vy0)**
   - Added `reconnectAttempts` counter
   - Exponential backoff: 1s → 30s max
   - Message buffering for replay after reconnect
   - `X-Last-Request-Id` header for message recovery

2. **MCP Set Servers Control Request**
   - New `mcp_set_servers` subtype for dynamic MCP configuration
   - Supports runtime MCP server addition/removal

3. **Auth Status Streaming**
   - `auth_status` message type for OAuth flow visibility
   - `enableAuthStatus` option to subscribe to auth events

4. **File Rewind Support**
   - `rewind_files` control request subtype
   - `dry_run` option for preview

5. **Exit After Stop Delay**
   - `CLAUDE_CODE_EXIT_AFTER_STOP_DELAY` environment variable
   - Auto-exit after idle period in SDK mode

### Symbol Changes

| v2.0.59 | v2.1.7 | Description |
|---------|--------|-------------|
| aSA | wmA | StdioSDKTransport |
| RD0 | Fy0 | WebSocketSDKTransport |
| YSA | khA | AsyncMessageQueue |
| Qu3 | LR7 | runSDKAgentLoop |
| Rw9 | hw9 | runNonInteractiveSession |
| Wu3 | TR7 | createIOHandler |

---

---

## SDK Communication Methods (Comprehensive)

### Overview of Supported Communication Methods

Claude Code SDK supports **3 communication methods** for different use cases:

| Method | Transport Class | Protocol | Use Case |
|--------|-----------------|----------|----------|
| **Stdio** | `StdioSDKTransport` (wmA) | JSON-lines over stdin/stdout | Local subprocess SDK (Python/TS) |
| **WebSocket** | `WebSocketSDKTransport` (Fy0) | JSON-lines over WebSocket | Remote/background agents |
| **HTTP (via MCP)** | Via MCP server | MCP protocol | External MCP server tools |

### Communication Method 1: Stdio Transport (Default)

**Class:** `StdioSDKTransport` (wmA)
**Location:** `chunks.155.mjs:2621-2790`

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Stdio Transport Architecture                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SDK Client (Python/TypeScript)         Claude Code Process             │
│  ┌─────────────────────────────┐        ┌─────────────────────────┐    │
│  │                             │        │                          │    │
│  │  subprocess.Popen(          │        │  StdioSDKTransport       │    │
│  │    "claude",                │        │                          │    │
│  │    stdin=PIPE,              │        │  ┌──────────────────┐   │    │
│  │    stdout=PIPE              │ stdin  │  │ read() generator │   │    │
│  │  )                          │───────►│  │  • JSON parsing  │   │    │
│  │                             │        │  │  • Line buffering│   │    │
│  │  proc.stdin.write(json)     │        │  └──────────────────┘   │    │
│  │                             │        │                          │    │
│  │  for line in proc.stdout:   │ stdout │  ┌──────────────────┐   │    │
│  │    process(json.loads(line))│◄───────│  │ write() method   │   │    │
│  │                             │        │  │  • J9 chunked    │   │    │
│  └─────────────────────────────┘        │  │    stdout        │   │    │
│                                         │  └──────────────────┘   │    │
│                                         └─────────────────────────┘    │
│                                                                         │
│  Protocol: Newline-delimited JSON (JSON-lines)                          │
│  Direction: Bidirectional, full-duplex                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Chunked output** via `J9` (2000 chars per write to prevent buffer overflow)
- **Async generator** input parsing with line buffering
- **Request correlation** via `pendingRequests` Map
- **Keepalive support** (messages ignored)

### Communication Method 2: WebSocket Transport (Remote Mode)

**Class:** `WebSocketSDKTransport` (Fy0) extends `StdioSDKTransport`
**Location:** `chunks.155.mjs:3000-3034`

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   WebSocket Transport Architecture                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Remote Backend                              Claude Code                 │
│  ┌─────────────────────────┐                ┌─────────────────────┐    │
│  │                         │                │                      │    │
│  │  WebSocket Server       │                │ WebSocketSDKTransport│    │
│  │                         │                │ (extends Stdio)      │    │
│  │  • Message routing      │   WebSocket    │                      │    │
│  │  • Authentication       │◄──────────────►│ ┌──────────────────┐│    │
│  │  • State management     │                │ │WebSocketTransport││    │
│  │                         │                │ │(Vy0) low-level   ││    │
│  └─────────────────────────┘                │ │                  ││    │
│                                             │ │• Reconnection    ││    │
│                                             │ │• Message buffer  ││    │
│  Triggered by:                              │ │• Ping keepalive  ││    │
│  --sdk-url wss://backend.example.com        │ └──────────────────┘│    │
│                                             │         │            │    │
│                                             │         ▼            │    │
│                                             │ ┌──────────────────┐│    │
│                                             │ │ PassThrough      ││    │
│                                             │ │ Stream           ││    │
│                                             │ │ (bridges to      ││    │
│                                             │ │  parent read())  ││    │
│                                             │ └──────────────────┘│    │
│                                             └─────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Reconnection Parameters:**
```javascript
MESSAGE_BUFFER_SIZE = 1000;      // Ring buffer for replay
MAX_RECONNECT_ATTEMPTS = 3;      // Before giving up
INITIAL_RECONNECT_DELAY_MS = 1000;  // 1 second
MAX_RECONNECT_DELAY_MS = 30000;  // 30 seconds (exponential backoff)
PING_INTERVAL_MS = 10000;        // Keepalive ping every 10s
```

**Recovery Features:**
- **Message buffering**: Last 1000 messages stored for replay
- **Exponential backoff**: 1s → 2s → 4s → ... → max 30s
- **X-Last-Request-Id header**: Server can acknowledge last received message
- **Auto-replay**: Buffered messages replayed after reconnect

### Communication Method 3: MCP Message Routing

**Via:** `sendMcpMessage()` method
**Location:** `chunks.155.mjs:2781-2789`

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      MCP Message Routing                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Claude Code                SDK Transport              MCP Server        │
│      │                           │                         │            │
│      │  executeMcpTool()         │                         │            │
│      │──────────────────────────►│                         │            │
│      │                           │                         │            │
│      │                           │  sendMcpMessage()       │            │
│      │                           │                         │            │
│      │                           │  control_request        │            │
│      │                           │  {mcp_message}          │            │
│      │                           │────────────────────────►│            │
│      │                           │                         │            │
│      │                           │         Process MCP     │            │
│      │                           │         protocol        │            │
│      │                           │                         │            │
│      │                           │  control_response       │            │
│      │                           │  {mcp_response}         │            │
│      │                           │◄────────────────────────│            │
│      │                           │                         │            │
│      │  Tool result              │                         │            │
│      │◄──────────────────────────│                         │            │
│                                                                         │
│  SDK server type: { type: "sdk", name: "serverName" }                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## SDK Runtime Mechanism

### Startup Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       SDK Runtime Startup Flow                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. CLI Parsing (chunks.157.mjs)                                        │
│     │                                                                   │
│     │  Detect SDK mode:                                                 │
│     │  • --print flag → isNonInteractive = true                         │
│     │  • --sdk-url → Auto-set: stream-json, verbose, print              │
│     │  • stdin has data → Use as input                                  │
│     │                                                                   │
│     ▼                                                                   │
│  2. Entry Point Detection (B_7 in chunks.156.mjs)                       │
│     │                                                                   │
│     │  Set CLAUDE_CODE_ENTRYPOINT:                                      │
│     │  • "sdk-py" (Python SDK sets this)                                │
│     │  • "sdk-ts" (TypeScript SDK sets this)                            │
│     │  • "sdk-cli" (--print flag)                                       │
│     │  • "cli" (default interactive)                                    │
│     │                                                                   │
│     ▼                                                                   │
│  3. Transport Selection (TR7 in chunks.156.mjs)                         │
│     │                                                                   │
│     │  if (options.sdkUrl) → WebSocketSDKTransport                      │
│     │  else               → StdioSDKTransport                           │
│     │                                                                   │
│     ▼                                                                   │
│  4. Session Initialization (hw9 in chunks.155.mjs)                      │
│     │                                                                   │
│     │  • Initialize sandbox if enabled                                  │
│     │  • Load initial messages (jR7):                                   │
│     │    - --continue: Load last session                                │
│     │    - --resume: Load specific session                              │
│     │    - --teleport: Fetch remote session                             │
│     │  • Apply rewound files if --rewind-files                          │
│     │                                                                   │
│     ▼                                                                   │
│  5. Agent Loop Start (LR7 → v19 → aN)                                   │
│     │                                                                   │
│     │  Create AsyncMessageQueue (khA) for output                        │
│     │  Wait for input from transport                                    │
│     │  Process messages through agent loop                              │
│     │                                                                   │
│     ▼                                                                   │
│  6. Output Processing                                                   │
│     │                                                                   │
│     │  Output format selection:                                         │
│     │  • "text" → Extract result text                                   │
│     │  • "json" → Full result JSON                                      │
│     │  • "stream-json" → Real-time message stream                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Main Agent Loop Lifecycle (LR7)

```javascript
// ============================================
// LR7 - SDK Agent Loop Lifecycle
// Location: chunks.155.mjs:3207-3466
// ============================================

// READABLE (for understanding):
function runSDKAgentLoop(
  transport,           // StdioSDKTransport or WebSocketSDKTransport
  mcpClients,          // MCP client connections
  commands,            // Available slash commands
  tools,               // Available tools
  initialMessages,     // Messages from session loading
  canUseTool,          // Permission callback
  sdkMcpConfigs,       // SDK-provided MCP configs
  getAppState,         // State getter
  setAppState,         // State setter
  agents,              // Agent definitions
  options              // CLI options
) {
  // 1. Create output queue
  const outputQueue = new AsyncMessageQueue();

  // 2. Auth status subscription (if enabled)
  if (options.enableAuthStatus) {
    authStatusEmitter.subscribe((status) => {
      outputQueue.enqueue({ type: "auth_status", ...status });
    });
  }

  // 3. Process SessionStart hook responses from history
  const sessionStartResponses = extractSessionStartResponses(initialMessages);

  // 4. Create idle exit timer (CLAUDE_CODE_EXIT_AFTER_STOP_DELAY)
  const idleTimer = createIdleExitTimer(() => !isProcessing);

  // 5. Main processing function
  async function processInput() {
    // Wait for MCP clients to connect
    await refreshMcpClients();

    // Merge all tools (built-in + MCP + SDK)
    const allTools = [...tools, ...mcpTools, ...sdkTools];

    // Get queued command
    while (command = await getNextCommand(getAppState, setAppState)) {
      const abortController = new AbortController();

      // Run agent loop (v19)
      for await (const message of v19({
        prompt: command.value,
        tools: allTools,
        canUseTool,
        setSDKStatus: (status) => {
          outputQueue.enqueue({
            type: "system",
            subtype: "status",
            status: status
          });
        },
        // ... other params
      })) {
        // Filter and enqueue output messages
        outputQueue.enqueue(message);
      }
    }
  }

  // 6. Input processing loop
  (async () => {
    for await (const input of transport.structuredInput) {
      // Handle control requests
      if (input.type === "control_request") {
        handleControlRequest(input, outputQueue, setAppState);
        continue;
      }

      // Handle user messages
      if (input.type === "user") {
        // Deduplication check
        if (await isDuplicate(input.uuid)) {
          if (options.replayUserMessages) {
            outputQueue.enqueue({ ...input, isReplay: true });
          }
          continue;
        }

        // Queue for processing
        setAppState((state) => ({
          ...state,
          queuedCommands: [...state.queuedCommands, {
            mode: "prompt",
            value: input.message.content,
            uuid: input.uuid
          }]
        }));

        // Trigger processing
        processInput();
      }
    }
  })();

  // 7. Return output queue as async iterator
  return outputQueue;
}
```

### Message Processing Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Message Processing Pipeline                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Input                Processing              Output                     │
│                                                                         │
│  ┌─────────┐         ┌─────────────┐         ┌─────────────────┐       │
│  │ user    │────────►│ Agent Loop  │────────►│ assistant       │       │
│  │ message │         │ (v19 → aN)  │         │ message         │       │
│  └─────────┘         │             │         └─────────────────┘       │
│                      │ ┌─────────┐ │                                    │
│  ┌─────────────┐     │ │ LLM API │ │         ┌─────────────────┐       │
│  │ control_    │     │ │ call    │ │────────►│ stream_event    │       │
│  │ request     │     │ └─────────┘ │         │ (if verbose)    │       │
│  │ (interrupt, │     │             │         └─────────────────┘       │
│  │  init, etc.)│     │ ┌─────────┐ │                                    │
│  └──────┬──────┘     │ │ Tool    │ │         ┌─────────────────┐       │
│         │            │ │ execute │ │────────►│ system          │       │
│         ▼            │ └─────────┘ │         │ (tool_result)   │       │
│  ┌─────────────┐     │             │         └─────────────────┘       │
│  │ Handle in   │     │ ┌─────────┐ │                                    │
│  │ LR7 directly│     │ │ Compact │ │         ┌─────────────────┐       │
│  └─────────────┘     │ │ check   │ │────────►│ system          │       │
│                      │ └─────────┘ │         │ (status:        │       │
│                      └─────────────┘         │  compacting)    │       │
│                                              └─────────────────┘       │
│                                                                         │
│                                              ┌─────────────────┐       │
│                                         ────►│ result          │       │
│                                              │ (final output)  │       │
│                                              └─────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## CLI Integration

### SDK Mode Activation

| Trigger | Effect | Entry Point |
|---------|--------|-------------|
| `-p, --print` | Non-interactive mode, single response | `sdk-cli` |
| `--sdk-url <url>` | WebSocket transport, auto-enables print/stream-json | Depends |
| `CLAUDE_CODE_ENTRYPOINT=sdk-py` | Python SDK mode | `sdk-py` |
| `CLAUDE_CODE_ENTRYPOINT=sdk-ts` | TypeScript SDK mode | `sdk-ts` |

### CLI Options for SDK Mode

```bash
# Basic SDK mode
claude -p "Your prompt here"

# JSON output
claude -p --output-format=json "Your prompt"

# Real-time streaming
claude -p --output-format=stream-json --verbose "Your prompt"

# Streaming input/output (full SDK mode)
claude -p --input-format=stream-json --output-format=stream-json

# WebSocket backend connection
claude --sdk-url wss://backend.example.com

# Session management
claude -p --continue                    # Continue last session
claude -p --resume <session-id>         # Resume specific session
claude -p --resume <url>                # WebSocket reconnect
claude -p --resume session.jsonl        # Resume from file

# Permission modes
claude -p --permission-mode=acceptEdits
claude -p --dangerously-skip-permissions

# Resource limits
claude -p --max-turns=10
claude -p --max-budget-usd=1.00
claude -p --max-thinking-tokens=8000

# Custom system prompt
claude -p --system-prompt "Custom instructions"
claude -p --append-system-prompt "Additional instructions"

# Structured output
claude -p --json-schema '{"type":"object","properties":{"name":{"type":"string"}}}'
```

### Transport Selection Logic (TR7)

```javascript
// ============================================
// TR7 - createIOHandler
// Location: chunks.156.mjs:64-79
// ============================================

function createIOHandler(input, options) {
  let inputStream;

  // 1. Convert string input to JSON-lines stream
  if (typeof input === "string") {
    if (input.trim() !== "") {
      // Wrap as user message
      inputStream = createReadableStream([JSON.stringify({
        type: "user",
        session_id: "",
        message: { role: "user", content: input },
        parent_tool_use_id: null
      })]);
    } else {
      inputStream = createReadableStream([]);
    }
  } else {
    // Already a stream (stdin)
    inputStream = input;
  }

  // 2. Select transport based on --sdk-url
  if (options.sdkUrl) {
    return new WebSocketSDKTransport(options.sdkUrl, inputStream, options.replayUserMessages);
  } else {
    return new StdioSDKTransport(inputStream, options.replayUserMessages);
  }
}
```

### Output Format Handling

```javascript
// ============================================
// Output Format Processing
// Location: chunks.155.mjs:3169-3203
// ============================================

// After agent loop completes:
const lastMessage = extractLastMessage(allMessages);

switch (options.outputFormat) {
  case "json":
    // Single JSON result
    if (options.verbose) {
      writeToStdout(JSON.stringify(allMessages) + "\n");
    } else {
      writeToStdout(JSON.stringify(lastMessage) + "\n");
    }
    break;

  case "stream-json":
    // Already streamed via outputQueue, nothing more needed
    break;

  default: // "text"
    // Extract text from result
    switch (lastMessage.subtype) {
      case "success":
        writeToStdout(lastMessage.result);
        break;
      case "error_during_execution":
        writeToStdout("Execution error");
        break;
      case "error_max_turns":
        writeToStdout(`Error: Reached max turns (${options.maxTurns})`);
        break;
      case "error_max_budget_usd":
        writeToStdout(`Error: Exceeded USD budget (${options.maxBudgetUsd})`);
        break;
    }
}
```

### SDK Mode vs Interactive Mode Differences

| Aspect | SDK Mode (--print) | Interactive Mode |
|--------|-------------------|------------------|
| **Identity prompt** | SDK_CLI_IDENTITY or SDK_AGENT_IDENTITY | CLI_IDENTITY |
| **Permission UI** | Control protocol callbacks | Terminal prompts |
| **Output** | JSON-lines to stdout | Formatted to terminal |
| **Session** | Optional persistence | Always persisted |
| **claude-code-guide agent** | Excluded | Included |
| **Workspace trust** | Skipped | Dialog shown |
| **Error handling** | JSON error responses | Terminal error display |
| **Interrupt** | control_request interrupt | Ctrl+C signal |

---

## Related Documents

- [transport_layer.md](./transport_layer.md) - Transport implementation details
- [message_protocol.md](./message_protocol.md) - Message types and validation
- [control_protocol.md](./control_protocol.md) - Control request/response
- [output_pipeline.md](./output_pipeline.md) - Output flow and AsyncMessageQueue
