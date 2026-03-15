# SDK Error Recovery

## Overview

Error handling in SDK mode follows different patterns than interactive CLI mode. Since there's no human operator to respond to errors, the system must handle failures gracefully and communicate them through the streaming protocol. This document covers WebSocket reconnection, abort handling, timeout management, and error output formatting.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Transport symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent loop symbols
> - [transport_layer.md](./transport_layer.md) - Transport layer details

Key functions in this document:
- `handleConnectionError` - WebSocket reconnection with exponential backoff
- `outputError` (Ev6) - Error output for SDK mode
- `AbortError` (dz) - Thrown when operations are cancelled
- `sendRequest` - Bidirectional request with abort support
- `handleSessionResume` (hJz) - Session resume error handling

---

## Error Types in SDK Mode

### Error Categories

| Category | Source | Handling |
|----------|--------|----------|
| Connection Errors | WebSocket disconnect | Automatic reconnection with backoff |
| Stream Errors | stdin closed, parse errors | Session termination |
| Permission Errors | Tool denied, interrupt | Error result message |
| Timeout Errors | Control request timeout | AbortError, retry possible |
| Execution Errors | Agent loop exceptions | Error result message |
| Budget/Turn Limits | Limits exceeded | Specific result subtype |

### Result Message Error Subtypes

```javascript
// Success result
{
    "type": "result",
    "subtype": "success",
    "result": "...",
    "num_turns": 3,
    ...
}

// Error during execution
{
    "type": "result",
    "subtype": "error_during_execution",
    "is_error": true,
    "errors": ["Error message"],
    ...
}

// Max turns reached
{
    "type": "result",
    "subtype": "error_max_turns",
    "is_error": true,
    "num_turns": 10,
    ...
}

// Budget exceeded
{
    "type": "result",
    "subtype": "error_max_budget_usd",
    "is_error": true,
    "total_cost_usd": 5.00,
    ...
}
```

---

## WebSocket Reconnection

### Reconnection Algorithm

**What it does:** Implements exponential backoff with jitter for automatic WebSocket reconnection. This ensures resilience for SDK sessions using `--sdk-url`.

**How it works:**
1. On disconnect: clean up current WebSocket
2. Calculate backoff using exponential formula with jitter
3. Schedule reconnection attempt
4. Track total reconnection time; give up after 10 minutes
5. On success: reset counters, replay buffered messages

**Backoff constants:**
- `BASE_BACKOFF_MS` (1000ms): Initial backoff
- `MAX_BACKOFF_MS` (30000ms): Backoff cap
- `MAX_RECONNECT_DURATION_MS` (600000ms): Total time budget (10 minutes)
- `PING_INTERVAL_MS` (10000ms): Keep-alive ping interval

```javascript
// ============================================
// handleConnectionError - WebSocket reconnection with exponential backoff
// Location: chunks.178.mjs:1405-1426
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
        h(`WebSocketTransport: Reconnection time budget exhausted`, { level: "error" });
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

    // Don't reconnect if intentionally closing
    if (this.state === "closing" || this.state === "closed") return;

    let now = Date.now();
    if (!this.reconnectStartTime) this.reconnectStartTime = now;
    let elapsedMs = now - this.reconnectStartTime;

    if (elapsedMs < MAX_RECONNECT_DURATION_MS) {
        // Clear any pending reconnect timer
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        this.state = "reconnecting";
        this.reconnectAttempts++;

        // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s (capped)
        let baseBackoff = Math.min(
            BASE_BACKOFF_MS * Math.pow(2, this.reconnectAttempts - 1),
            MAX_BACKOFF_MS
        );

        // Add ±25% jitter to avoid thundering herd
        let jitter = baseBackoff * 0.25 * (2 * Math.random() - 1);
        let actualBackoff = Math.max(0, baseBackoff + jitter);

        logDebug(`Reconnecting in ${Math.round(actualBackoff)}ms (attempt ${this.reconnectAttempts})`);

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
        }, actualBackoff);
    } else {
        // Give up after 10 minutes
        logError(`Reconnection budget exhausted after ${Math.round(elapsedMs/1000)}s`);
        this.state = "closed";
        if (this.onCloseCallback) this.onCloseCallback();
    }
}

// Mapping: XJz→MAX_RECONNECT_DURATION_MS (600000), _Jz→BASE_BACKOFF_MS (1000), JJz→MAX_BACKOFF_MS (30000)
```

### Backoff Sequence

| Attempt | Base Backoff | With Jitter Range |
|---------|-------------|-------------------|
| 1 | 1s | 0.75s - 1.25s |
| 2 | 2s | 1.5s - 2.5s |
| 3 | 4s | 3s - 5s |
| 4 | 8s | 6s - 10s |
| 5 | 16s | 12s - 20s |
| 6+ | 30s (capped) | 22.5s - 37.5s |

**Why exponential backoff with jitter:**
- **Exponential:** Reduces server load during outages
- **Jitter:** Prevents synchronized reconnection attempts (thundering herd)
- **Cap:** Prevents unreasonably long waits between attempts
- **Time budget:** Eventually gives up to prevent infinite reconnection

### Message Replay After Reconnect

When reconnecting, messages may need to be replayed:

```javascript
// On successful reconnect
handleOpenEvent(connectStartTime) {
    // ... connection established
    this.startPingInterval();

    // If we have buffered messages to replay
    if (this.lastSentId) {
        this.replayBufferedMessages("");
    }
}

// Server can acknowledge last received message
// via X-Last-Request-Id header
replayBufferedMessages(serverLastId) {
    let messages = this.messageBuffer.toArray();

    // Find where to start replaying
    let startIndex = 0;
    if (serverLastId) {
        let idx = messages.findIndex(m => m.uuid === serverLastId);
        if (idx >= 0) startIndex = idx + 1;
    }

    let toReplay = messages.slice(startIndex);
    // Send each message...
}
```

---

## Stream Disconnection Handling

### stdin Stream Closed

When stdin closes unexpectedly:

```javascript
// In StdioStreamIO.read()
async * read() {
    let buffer = "";
    for await (let chunk of this.input) {
        // ... process chunks
    }

    // Stream ended
    this.inputClosed = true;

    // Reject all pending permission requests
    for (let pending of this.pendingRequests.values()) {
        pending.reject(Error("Tool permission stream closed before response received"));
    }
}
```

**What happens:**
1. `inputClosed` flag is set
2. All pending `control_request` promises are rejected
3. Agent loop receives rejection
4. Session terminates with error

### WebSocket Stream Closed

For `SdkUrlStreamIO`:

```javascript
// In SdkUrlStreamIO constructor
this.transport.setOnClose(() => {
    this.inputStream.end();  // End the PassThrough stream
});

// This triggers the parent's read() to exit
// Same cleanup as stdin close
```

---

## Abort Signal Propagation

### AbortController Usage

Abort signals propagate through the SDK stack:

```
SDK Client (interrupt control_request)
    │
    └── StdioStreamIO.pendingRequests.reject(AbortError)
            │
            └── Agent loop catches AbortError
                    │
                    └── Tool execution cancelled
```

### sendRequest Abort Handling

```javascript
// ============================================
// sendRequest - With abort signal support
// Location: chunks.178.mjs:1163-1210
// ============================================

async sendRequest(requestPayload, responseSchema, abortSignal) {
    let requestId = generateUUID();

    if (this.inputClosed) throw Error("Stream closed");
    if (abortSignal?.aborted) throw Error("Request aborted");

    // Send request
    await this.write({ type: "control_request", request_id: requestId, request: requestPayload });

    // Setup abort handler
    let cancelHandler = () => {
        this.write({ type: "control_cancel_request", request_id: requestId });
        let pending = this.pendingRequests.get(requestId);
        if (pending) pending.reject(new AbortError());
    };
    if (abortSignal) abortSignal.addEventListener("abort", cancelHandler, { once: true });

    try {
        return await new Promise((resolve, reject) => {
            this.pendingRequests.set(requestId, {
                request: { ... },
                resolve,
                reject,
                schema: responseSchema
            });
        });
    } finally {
        abortSignal?.removeEventListener("abort", cancelHandler);
        this.pendingRequests.delete(requestId);
    }
}
```

### Interrupt Control Request

SDK client can abort the session:

```javascript
// Client sends interrupt
{
    "type": "control_request",
    "request": {
        "subtype": "interrupt"
    }
}

// Handler in Claude Code
if (request.subtype === "interrupt") {
    sessionContext.abortController.abort();
    // Session terminates gracefully
}
```

---

## Timeout Handling

### Control Request Timeout

Control requests can timeout if the SDK client doesn't respond:

```javascript
// Timeout handling in sendRequest
let timeoutMs = 60000; // 60 second default

let timeoutId = setTimeout(() => {
    let pending = this.pendingRequests.get(requestId);
    if (pending) {
        pending.reject(Error("Control request timed out"));
    }
}, timeoutMs);

// Clear timeout on response
try {
    let response = await promise;
    clearTimeout(timeoutId);
    return response;
} catch (error) {
    clearTimeout(timeoutId);
    throw error;
}
```

### Tool Execution Timeout

Tools have their own timeout handling:

```javascript
// Tool execution with timeout
let toolTimeout = tool.timeout || 120000; // 2 minutes default

let result = await Promise.race([
    executeTool(toolInput),
    new Promise((_, reject) =>
        setTimeout(() => reject(Error("Tool execution timed out")), toolTimeout)
    )
]);
```

---

## Error Output Formatting

### outputError Function (Ev6)

**What it does:** Formats and outputs errors appropriately based on output format. For `stream-json`, outputs a structured error result message. For `text`, writes to stderr.

```javascript
// ============================================
// outputError - Format error output for SDK mode
// Location: chunks.179.mjs:1805-1827
// ============================================

// ORIGINAL (for source lookup):
function Ev6(A, q) {
    if (q === "stream-json") {
        let K = {
            type: "result",
            subtype: "error_during_execution",
            duration_ms: 0,
            duration_api_ms: 0,
            is_error: !0,
            num_turns: 0,
            stop_reason: null,
            session_id: U6(),
            total_cost_usd: 0,
            usage: LN,
            modelUsage: {},
            permission_denials: [],
            uuid: SE(),
            errors: [A]
        };
        process.stdout.write(Q1(K) + `
`)
    } else process.stderr.write(A + `
`)
}

// READABLE (for understanding):
function outputError(errorMessage, outputFormat) {
    if (outputFormat === "stream-json") {
        // Structured error result for machine parsing
        let errorResult = {
            type: "result",
            subtype: "error_during_execution",
            duration_ms: 0,
            duration_api_ms: 0,
            is_error: true,
            num_turns: 0,
            stop_reason: null,
            session_id: getSessionId(),
            total_cost_usd: 0,
            usage: emptyUsage,
            modelUsage: {},
            permission_denials: [],
            uuid: generateUUID(),
            errors: [errorMessage]
        };
        process.stdout.write(JSON.stringify(errorResult) + '\n');
    } else {
        // Plain text error for text output mode
        process.stderr.write(errorMessage + '\n');
    }
}

// Mapping: Ev6→outputError, A→errorMessage, q→outputFormat, U6→getSessionId, SE→generateUUID, Q1→stringify, LN→emptyUsage
```

### Error Message Differences

| Scenario | Interactive Mode | SDK Mode |
|----------|-----------------|----------|
| Authentication failure | "Run /login to authenticate" | "Failed to authenticate" |
| PDF read failure | "Double press esc to go back" | "Try reading the file a different way" |
| Permission denied | Interactive dialog | Returns deny result |
| Stream closed | N/A | "Stream closed before response received" |
| Timeout | User can retry | Error result, client can retry |

---

## Session Resume Error Handling

### handleSessionResume (hJz)

**What it does:** Handles errors during session resume operations. Formats errors appropriately and ensures clean exit.

```javascript
// ============================================
// handleSessionResume - Error handling for session resume
// Location: chunks.179.mjs:1829-1884
// ============================================

// ORIGINAL (for source lookup):
async function hJz(A, q) {
    let K = !qk();
    if (q.continue) try {
        // ... resume logic
    } catch (Y) {
        return K1(Y instanceof Error ? Y : Error(String(Y))), w3(1), []
    }
    if (q.resume) try {
        let Y = yMq(typeof q.resume === "string" ? q.resume : "");
        if (!Y) {
            let w = "Error: --resume requires a valid session ID...";
            return Ev6(w, q.outputFormat), w3(1), []
        }
        // ... resume logic
    } catch (Y) {
        K1(Y instanceof Error ? Y : Error(String(Y)));
        let z = Y instanceof Error ? `Failed to resume session: ${Y.message}` : "Failed to resume session...";
        return Ev6(z, q.outputFormat), w3(1), []
    }
    return await PP("startup")
}

// READABLE (for understanding):
async function handleSessionResume(promptInput, options) {
    let shouldPersist = !isNoPersistenceMode();

    // Handle --continue flag
    if (options.continue) {
        try {
            let session = await resumeSession();
            // ... process resumed session
        } catch (error) {
            logError(error instanceof Error ? error : Error(String(error)));
            setExitCode(1);
            return [];
        }
    }

    // Handle --resume flag
    if (options.resume) {
        try {
            let parsedResume = parseResumeId(options.resume);
            if (!parsedResume) {
                let errorMsg = "Error: --resume requires a valid session ID...";
                outputError(errorMsg, options.outputFormat);
                setExitCode(1);
                return [];
            }
            // ... process resume
        } catch (error) {
            logError(error instanceof Error ? error : Error(String(error)));
            let errorMsg = error instanceof Error
                ? `Failed to resume session: ${error.message}`
                : "Failed to resume session...";
            outputError(errorMsg, options.outputFormat);
            setExitCode(1);
            return [];
        }
    }

    return await startNewSession();
}

// Mapping: hJz→handleSessionResume, A→promptInput, q→options, Ev6→outputError, w3→setExitCode, K1→logError
```

---

## Error Recovery Strategies

### Automatic Recovery

| Error Type | Recovery Strategy |
|------------|------------------|
| WebSocket disconnect | Automatic reconnection with backoff |
| MCP server disconnect | Retry or fail gracefully |
| Tool timeout | Abort and return error |
| Permission denied | Return denial, agent can adapt |

### Manual Recovery (SDK Client)

SDK client can implement additional recovery:

1. **Retry failed requests:**
   ```javascript
   async function retryableRequest(fn, maxRetries = 3) {
       for (let i = 0; i < maxRetries; i++) {
           try {
               return await fn();
           } catch (error) {
               if (i === maxRetries - 1) throw error;
               await sleep(1000 * Math.pow(2, i));
           }
       }
   }
   ```

2. **Session recreation:**
   ```javascript
   // If session becomes corrupted, create new one
   if (result.subtype === "error_during_execution") {
       let newSession = await client.createSession();
       // Retry with new session
   }
   ```

3. **Graceful degradation:**
   ```javascript
   // If some features fail, continue without them
   if (error.code === "MCP_SERVER_UNAVAILABLE") {
       // Continue without MCP tools
   }
   ```

---

## Ping/Pong Keep-Alive

### Connection Health Monitoring

WebSocket connections use ping/pong for health monitoring:

```javascript
// Start ping interval after connection
startPingInterval() {
    this.stopPingInterval();
    if (typeof Bun !== "undefined") return; // Bun handles this natively

    this.pongReceived = true;
    this.pingInterval = setInterval(() => {
        if (this.state === "connected" && this.ws) {
            if (!this.pongReceived) {
                // No pong received since last ping: connection is dead
                logError("No pong received, connection appears dead");
                this.handleConnectionError();
                return;
            }
            this.pongReceived = false;
            try {
                this.ws.ping();
            } catch (error) {
                logError(`Ping failed: ${error}`);
            }
        }
    }, PING_INTERVAL_MS); // ~10 seconds
}
```

**Why ping/pong AND keep_alive:**
- **Ping/pong (WebSocket level):** Detects dead TCP connections
- **keep_alive messages (application level):** Maintains connection through proxies that close idle connections

---

## Summary: Error Handling Flow

```
Error Occurs
    │
    ├── Connection Error?
    │   ├── YES: WebSocket reconnect with backoff
    │   │   ├── Success: Replay buffered messages
    │   │   └── Exhausted: Close session, notify client
    │   └── NO: Continue
    │
    ├── Abort Signal?
    │   ├── YES: Cancel pending operations
    │   │   └── Clean up and terminate
    │   └── NO: Continue
    │
    ├── Timeout?
    │   ├── YES: Reject promise
    │   │   └── Return error result
    │   └── NO: Continue
    │
    ├── Execution Error?
    │   ├── YES: Format error result
    │   │   ├── stream-json: Structured result message
    │   │   └── text: Write to stderr
    │   └── NO: Normal completion
    │
    └── Return result to SDK client
```

This comprehensive error handling ensures SDK sessions are resilient and provide clear, actionable error information to the SDK client for programmatic handling.

---

## Troubleshooting Guide

### Common Error Scenarios and Solutions

#### 1. WebSocket Connection Refused

**Symptoms:**
- `ECONNREFUSED` error when using `--sdk-url`
- Immediate disconnection on startup

**Possible causes:**
- SDK URL server not running
- Wrong port or hostname
- Firewall blocking connection

**Solutions:**
```javascript
// Check server is running
const healthCheck = await fetch('http://server:port/health');

// Verify URL format (must include protocol)
claude --sdk-url wss://server.example.com/path

// Check for proxy issues
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Development only
```

#### 2. Permission Timeout

**Symptoms:**
- Error: "Control request timed out"
- Session hangs waiting for permission

**Possible causes:**
- SDK client not responding to `control_request`
- Network latency
- Permission handler crashed

**Solutions:**
```javascript
// Implement timeout in permission handler
async function handlePermission(request) {
  const timeout = setTimeout(() => {
    return { behavior: 'deny', message: 'Permission timeout' };
  }, 30000);

  try {
    const decision = await askUser(request);
    clearTimeout(timeout);
    return decision;
  } catch (error) {
    clearTimeout(timeout);
    return { behavior: 'deny', message: error.message };
  }
}
```

#### 3. Session Resume Failure

**Symptoms:**
- Error: "Failed to resume session"
- Missing session context after restart

**Possible causes:**
- Session ID doesn't exist
- Session file corrupted
- Different Claude Code version

**Solutions:**
```bash
# List available sessions
ls ~/.claude/sessions/

# Use correct session ID format (UUID)
claude --resume <session-uuid>

# Start fresh if session corrupted
claude --no-session-persistence
```

#### 4. Stream Closed Unexpectedly

**Symptoms:**
- Error: "Stream closed before response received"
- Mid-operation termination

**Possible causes:**
- stdin closed prematurely
- Process killed
- Memory limits exceeded

**Solutions:**
```javascript
// Handle stream closure gracefully
process.on('SIGTERM', () => {
  // Clean up pending operations
  client.abort();
});

// Use abort signal for long operations
const controller = new AbortController();
process.on('SIGINT', () => controller.abort());
await client.run('Task', { signal: controller.signal });
```

#### 5. Budget Exceeded

**Symptoms:**
- Result subtype: `error_max_budget_usd`
- Session terminates mid-operation

**Solutions:**
```javascript
// Set appropriate budget
const client = new ClaudeAgent({
  maxBudgetUsd: 5.00, // Increase budget
});

// Monitor usage
const result = await client.run('Task');
console.log('Cost:', result.total_cost_usd);

// Use cheaper model for simple tasks
const cheapClient = new ClaudeAgent({
  model: 'claude-haiku-4-5',
});
```

#### 6. Max Turns Reached

**Symptoms:**
- Result subtype: `error_max_turns`
- Task incomplete after N turns

**Solutions:**
```javascript
// Increase turn limit
const client = new ClaudeAgent({
  maxTurns: 50, // Increase from default
});

// Check turn count
const result = await client.run('Complex task');
if (result.subtype === 'error_max_turns') {
  // Resume with more turns
  const client2 = new ClaudeAgent({
    resume: result.session_id,
    maxTurns: 50,
  });
  await client2.run('Continue');
}
```

#### 7. MCP Tool Not Found

**Symptoms:**
- Error: "MCP tool not found: <tool_name>"
- Permission prompts not routing correctly

**Solutions:**
```javascript
// Verify MCP server is configured
const config = loadMcpConfig();
console.log(config.mcpServers);

// Check tool name matches exactly
claude --permission-prompt-tool exact_tool_name

// Debug MCP connection
claude mcp list
```

#### 8. JSON Schema Validation Failure

**Symptoms:**
- Output doesn't match schema
- Error in structured output parsing

**Solutions:**
```javascript
// Ensure schema is valid JSON Schema draft-07
const schema = {
  type: 'object',
  properties: { /* ... */ },
  additionalProperties: false, // Strict validation
  required: ['field1', 'field2'],
};

// Handle validation errors
try {
  const result = await client.run('Task', { jsonSchema: schema });
  const data = JSON.parse(result.result);
} catch (error) {
  if (error.name === 'ValidationError') {
    console.log('Schema validation failed:', error.errors);
  }
}
```

### Debugging Techniques

#### Enable Verbose Logging

```bash
# Enable all debug logs
DEBUG=claude:* claude --print

# Enable SDK-specific logs
CLAUDE_CODE_DEBUG=1 claude --print --output-format stream-json
```

#### Inspect Stream Events

```javascript
// Log all stream events for debugging
for await (const event of client.stream('Task')) {
  console.log(JSON.stringify(event, null, 2));
}
```

#### Check Token Usage

```javascript
// Monitor token usage during session
const result = await client.run('Task');
console.log('Input tokens:', result.usage.input_tokens);
console.log('Output tokens:', result.usage.output_tokens);
```

### Error Code Reference

| Error Code | Description | Action |
|------------|-------------|--------|
| `ECONNREFUSED` | Connection refused | Check server availability |
| `ETIMEDOUT` | Connection timeout | Check network/firewall |
| `EPIPE` | Broken pipe | Check stdin/stdout handling |
| `ENOTFOUND` | DNS resolution failed | Check hostname |
| `EPROTO` | Protocol error | Check TLS/SSL configuration |
| `error_during_execution` | Agent error | Check errors array |
| `error_max_turns` | Turn limit reached | Increase maxTurns |
| `error_max_budget_usd` | Budget exceeded | Increase maxBudgetUsd |

### Recovery Patterns

#### Exponential Backoff Retry

```javascript
async function retryableRun(prompt, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.run(prompt);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.min(1000 * Math.pow(2, i), 30000);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

#### Session Recreation

```javascript
async function robustRun(prompt) {
  let result = await client.run(prompt);

  if (result.subtype === 'error_during_execution') {
    // Create fresh session
    const freshClient = new ClaudeAgent();
    result = await freshClient.run(prompt);
  }

  return result;
}
```