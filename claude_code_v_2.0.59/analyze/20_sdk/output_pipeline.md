# Output Pipeline

> Analysis of Claude Code's output-side implementation for SDK mode: how messages flow from the agent loop to SDK clients via stdout or WebSocket.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - SDK Transport module

Key functions in this document:
- `writeToStdout` (L9) - Chunked stdout writer
- `writeToStderr` (Sj) - Chunked stderr writer
- `AsyncMessageQueue` (YSA) - Producer-consumer output buffer
- `runSDKAgentLoop` (Qu3) - Main SDK agent loop generator
- `runNonInteractiveSession` (Rw9) - Non-interactive session runner
- `createIOHandler` (Wu3) - Transport factory
- `extractLastMessage` (dC/pQ4) - Get final result message

---

## Output Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        SDK Output Pipeline Architecture                       │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Agent Loop (o59)            SDK Loop (Qu3)              Session Runner      │
│      │                            │                           │              │
│      │ yield message              │                           │              │
│      │─────────────────────────> │                           │              │
│      │                            │                           │              │
│      │                            │ H.enqueue(message)        │              │
│      │                            │──────────┐                │              │
│      │                            │          │                │              │
│      │                            │    ┌─────▼─────┐          │              │
│      │                            │    │   YSA     │          │              │
│      │                            │    │  Queue    │          │              │
│      │                            │    └─────┬─────┘          │              │
│      │                            │          │                │              │
│      │                            │          │ async iterate  │              │
│      │                            │          │                │              │
│      │                            │    ┌─────▼─────────────────────┐         │
│      │                            │    │  Rw9 (runNonInteractive)  │         │
│      │                            │    └─────┬─────────────────────┘         │
│      │                            │          │                               │
│      │                            │    ┌─────▼─────────────────────┐         │
│      │                            │    │  Output Format Handler    │         │
│      │                            │    │  (stream-json/json/text)  │         │
│      │                            │    └─────┬─────────────────────┘         │
│      │                            │          │                               │
│      │                            │    ┌─────▼─────────────────────┐         │
│      │                            │    │  L9 (writeToStdout)       │         │
│      │                            │    │  or WebSocket.send()      │         │
│      │                            │    └───────────────────────────┘         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Data Flow Summary:**

1. **Agent Loop** (`o59`) executes LLM calls and tool uses, yielding messages
2. **SDK Loop** (`Qu3`) receives messages and enqueues them to `YSA` queue
3. **Session Runner** (`Rw9`) iterates over the queue asynchronously
4. **Format Handler** processes based on output format (stream-json, json, text)
5. **Output Writer** (`L9` or WebSocket) sends data to SDK client

---

## writeToStdout (L9)

### Purpose

Writes output to stdout in 2000-character chunks to prevent buffer overflow in Node.js.

### Implementation

```javascript
// ============================================
// writeToStdout - Chunked stdout writer
// Location: chunks.1.mjs:646-648
// ============================================

// ORIGINAL (for source lookup):
function L9(A) {
  for (let Q = 0; Q < A.length; Q += 2000) process.stdout.write(A.substring(Q, Q + 2000))
}

// READABLE (for understanding):
function writeToStdout(content) {
  for (let offset = 0; offset < content.length; offset += 2000) {
    process.stdout.write(content.substring(offset, offset + 2000));
  }
}

// Mapping: L9→writeToStdout, A→content, Q→offset
```

### Why 2000 Characters?

**Design rationale:**
- Node.js `process.stdout.write()` can block or fail with very large strings
- 2000 characters is small enough to avoid buffer issues
- Large enough to minimize the number of write syscalls
- Safe margin under typical terminal buffer sizes (4KB-64KB)

**Companion function for stderr:**

```javascript
// ============================================
// writeToStderr - Chunked stderr writer
// Location: chunks.1.mjs:650-652
// ============================================

// ORIGINAL:
function Sj(A) {
  for (let Q = 0; Q < A.length; Q += 2000) process.stderr.write(A.substring(Q, Q + 2000))
}

// READABLE:
function writeToStderr(content) {
  for (let offset = 0; offset < content.length; offset += 2000) {
    process.stderr.write(content.substring(offset, offset + 2000));
  }
}
```

---

## AsyncMessageQueue (YSA)

### Purpose

A producer-consumer queue that implements the async iterator protocol, enabling the agent loop to produce messages while the output handler consumes them asynchronously.

### Class Structure

```javascript
// ============================================
// AsyncMessageQueue - Producer-consumer async queue
// Location: chunks.146.mjs:1635-1694
// ============================================

// ORIGINAL (for source lookup):
YSA = class YSA {
  returned;
  queue = [];
  readResolve;
  readReject;
  isDone = !1;
  hasError;
  started = !1;
  constructor(A) {
    this.returned = A
  }
  [Symbol.asyncIterator]() {
    if (this.started) throw Error("Stream can only be iterated once");
    return this.started = !0, this
  }
  next() {
    if (this.queue.length > 0) return Promise.resolve({
      done: !1,
      value: this.queue.shift()
    });
    if (this.isDone) return Promise.resolve({
      done: !0,
      value: void 0
    });
    if (this.hasError) return Promise.reject(this.hasError);
    return new Promise((A, Q) => {
      this.readResolve = A, this.readReject = Q
    })
  }
  enqueue(A) {
    if (this.readResolve) {
      let Q = this.readResolve;
      this.readResolve = void 0, this.readReject = void 0, Q({
        done: !1,
        value: A
      })
    } else this.queue.push(A)
  }
  done() {
    if (this.isDone = !0, this.readResolve) {
      let A = this.readResolve;
      this.readResolve = void 0, this.readReject = void 0, A({
        done: !0,
        value: void 0
      })
    }
  }
  error(A) {
    if (this.hasError = A, this.readReject) {
      let Q = this.readReject;
      this.readResolve = void 0, this.readReject = void 0, Q(A)
    }
  }
  return () {
    if (this.isDone = !0, this.returned) this.returned();
    return Promise.resolve({
      done: !0,
      value: void 0
    })
  }
}

// READABLE (for understanding):
class AsyncMessageQueue {
  returnCallback;      // Cleanup callback when iteration ends
  queue = [];          // Internal message buffer
  readResolve;         // Pending read promise resolver
  readReject;          // Pending read promise rejecter
  isDone = false;      // Completion flag
  hasError;            // Error state
  started = false;     // Ensures single iteration

  constructor(returnCallback) {
    this.returnCallback = returnCallback;
  }

  // Async iterator protocol - can only iterate once
  [Symbol.asyncIterator]() {
    if (this.started) throw Error("Stream can only be iterated once");
    this.started = true;
    return this;
  }

  // Get next message - returns Promise
  next() {
    // Case 1: Buffered messages available
    if (this.queue.length > 0) {
      return Promise.resolve({
        done: false,
        value: this.queue.shift()
      });
    }

    // Case 2: Stream is done
    if (this.isDone) {
      return Promise.resolve({
        done: true,
        value: undefined
      });
    }

    // Case 3: Error occurred
    if (this.hasError) {
      return Promise.reject(this.hasError);
    }

    // Case 4: Wait for next message
    return new Promise((resolve, reject) => {
      this.readResolve = resolve;
      this.readReject = reject;
    });
  }

  // Producer: Add message to queue
  enqueue(message) {
    if (this.readResolve) {
      // Consumer is waiting - resolve immediately
      const resolve = this.readResolve;
      this.readResolve = undefined;
      this.readReject = undefined;
      resolve({ done: false, value: message });
    } else {
      // No consumer waiting - buffer the message
      this.queue.push(message);
    }
  }

  // Signal completion
  done() {
    this.isDone = true;
    if (this.readResolve) {
      const resolve = this.readResolve;
      this.readResolve = undefined;
      this.readReject = undefined;
      resolve({ done: true, value: undefined });
    }
  }

  // Signal error
  error(err) {
    this.hasError = err;
    if (this.readReject) {
      const reject = this.readReject;
      this.readResolve = undefined;
      this.readReject = undefined;
      reject(err);
    }
  }

  // Early termination
  return() {
    this.isDone = true;
    if (this.returnCallback) this.returnCallback();
    return Promise.resolve({ done: true, value: undefined });
  }
}

// Mapping: YSA→AsyncMessageQueue, returned→returnCallback, A→message/err
```

### Algorithm: Producer-Consumer Pattern

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   AsyncMessageQueue State Transitions                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                                                            │
│  │  CREATED    │                                                            │
│  │ (started=F) │                                                            │
│  └──────┬──────┘                                                            │
│         │ [Symbol.asyncIterator]()                                          │
│         ▼                                                                   │
│  ┌─────────────┐         enqueue()          ┌─────────────┐                 │
│  │  WAITING    │ ◄─────────────────────────►│  BUFFERING  │                 │
│  │(readResolve)│   (no pending read)        │ (queue[])   │                 │
│  └──────┬──────┘                            └──────┬──────┘                 │
│         │ done()                                   │ next() when            │
│         │ or error()                               │ queue.length > 0       │
│         ▼                                          ▼                        │
│  ┌─────────────┐                            ┌─────────────┐                 │
│  │  COMPLETED  │                            │  YIELDING   │                 │
│  │ (isDone=T)  │ ◄──────────────────────────│  (value)    │                 │
│  └─────────────┘      queue exhausted       └─────────────┘                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**How it works:**

1. **Consumer calls `next()`**:
   - If queue has items → return immediately with `queue.shift()`
   - If done → return `{ done: true }`
   - If error → reject with error
   - Otherwise → create pending Promise, store resolve/reject

2. **Producer calls `enqueue(message)`**:
   - If consumer is waiting (`readResolve` exists) → resolve immediately
   - Otherwise → buffer the message in `queue[]`

3. **Producer calls `done()`**:
   - Set `isDone = true`
   - If consumer is waiting → resolve with `{ done: true }`

**Key insight:** This lazy resolution pattern avoids unnecessary buffering when consumer keeps pace with producer, while allowing buffering when producer outpaces consumer.

---

## runSDKAgentLoop (Qu3)

### Purpose

Main SDK agent loop that orchestrates the conversation, processes control requests, and routes all output through the `AsyncMessageQueue`.

### High-Level Structure

```javascript
// ============================================
// runSDKAgentLoop - Main SDK agent loop generator
// Location: chunks.156.mjs:3017-3256
// ============================================

// READABLE (simplified structure):
function runSDKAgentLoop(
  transport,           // aSA or RD0 transport
  mcpClients,          // MCP server connections
  commands,            // Slash commands
  tools,               // Available tools
  initialMessages,     // Initial conversation
  canUseTool,          // Permission callback
  agentConfigs,        // Agent configurations
  getAppState,         // State getter
  setAppState,         // State setter
  agents,              // Subagent registry
  options              // CLI options
) {
  let isProcessing = false;
  let isInputClosed = false;
  let abortController;

  // Create output queue
  const outputQueue = new AsyncMessageQueue();

  // Auth status subscription (if enabled)
  if (options.enableAuthStatus) {
    AuthStatusEmitter.getInstance().subscribe((status) => {
      outputQueue.enqueue({
        type: "auth_status",
        isAuthenticating: status.isAuthenticating,
        output: status.output,
        error: status.error,
        uuid: generateUUID(),
        session_id: getSessionId()
      });
    });
  }

  // Process a single prompt
  async function processPrompt() {
    if (isProcessing) return;
    isProcessing = true;

    try {
      let command;
      while (command = await dequeueCommand(getAppState, setAppState)) {
        abortController = createAbortController();

        // Run agent loop and enqueue all messages
        for await (const message of runAgentLoop({
          commands,
          prompt: command.value,
          promptUuid: command.uuid,
          tools: [...tools, ...mcpTools],
          mcpClients: [...mcpClients, ...sdkMcpClients],
          canUseTool,
          abortController,
          // ... other options
        })) {
          // Filter out subagent and replay messages from history
          const isSubagentMessage = (message.type === "assistant" || message.type === "user")
                                    && message.parent_tool_use_id;
          const isReplayMessage = message.type === "user" && message.isReplay;

          if (!isSubagentMessage && !isReplayMessage && message.type !== "stream_event") {
            conversationHistory.push(message);
          }

          // Enqueue to output
          outputQueue.enqueue(message);
        }
      }
    } catch (error) {
      // Send error result to SDK
      transport.write({
        type: "result",
        subtype: "error_during_execution",
        is_error: true,
        errors: [error.message]
      });
      exit(1);
      return;
    } finally {
      isProcessing = false;
    }

    // If input is closed and we're done processing, complete the queue
    if (isInputClosed) {
      outputQueue.done();
    }
  }

  // Helper: Send control response
  function sendControlResponse(request, response) {
    outputQueue.enqueue({
      type: "control_response",
      response: {
        subtype: "success",
        request_id: request.request_id,
        response: response
      }
    });
  }

  // Helper: Send control error
  function sendControlError(request, error) {
    outputQueue.enqueue({
      type: "control_response",
      response: {
        subtype: "error",
        request_id: request.request_id,
        error: error
      }
    });
  }

  // Set callback for unexpected SDK responses
  transport.setUnexpectedResponseCallback(async (message) => {
    await handleOrphanedPermission({
      message,
      setAppState,
      onEnqueued: () => processPrompt()
    });
  });

  // Main input processing loop (runs in background)
  (async () => {
    let initialized = false;

    for await (const input of transport.structuredInput) {
      if (input.type === "control_request") {
        // Handle control requests
        switch (input.request.subtype) {
          case "interrupt":
            if (abortController) abortController.abort();
            sendControlResponse(input);
            break;

          case "initialize":
            // Register SDK MCP servers, send capabilities
            await handleInitialize(input, initialized, outputQueue);
            initialized = true;
            break;

          case "set_permission_mode":
            // Update permission context
            setAppState(state => ({
              ...state,
              toolPermissionContext: updatePermissionMode(input.request)
            }));
            sendControlResponse(input);
            break;

          case "set_model":
            // Change model
            userSpecifiedModel = input.request.model === "default"
              ? getDefaultModel()
              : input.request.model;
            sendControlResponse(input);
            break;

          case "mcp_message":
            // Route MCP message to appropriate server
            const server = sdkMcpClients.find(s => s.name === input.request.server_name);
            if (server?.client?.transport?.onmessage) {
              server.client.transport.onmessage(input.request.message);
            }
            sendControlResponse(input);
            break;

          // ... other control request handlers
        }
        continue;
      }

      if (input.type === "control_response") {
        // Forward control responses if replaying
        if (options.replayUserMessages) {
          outputQueue.enqueue(input);
        }
        continue;
      }

      if (input.type === "keep_alive") {
        continue;  // Ignore keepalives
      }

      // User message - deduplicate and queue
      initialized = true;

      if (input.uuid) {
        if (await isDuplicateMessage(getSessionId(), input.uuid)) {
          if (options.replayUserMessages) {
            outputQueue.enqueue({
              type: "user",
              message: input.message,
              session_id: getSessionId(),
              uuid: input.uuid,
              isReplay: true
            });
          }
          continue;
        }
        markMessageProcessed(input.uuid);
      }

      // Queue the command for processing
      setAppState(state => ({
        ...state,
        queuedCommands: [...state.queuedCommands, {
          mode: "prompt",
          value: input.message.content,
          uuid: input.uuid
        }]
      }));

      processPrompt();
    }

    // Input stream closed
    isInputClosed = true;
    if (!isProcessing) {
      outputQueue.done();
    }
  })();

  // Return the queue for consumption
  return outputQueue;
}
```

### Message Types Enqueued

| Message Type | When Enqueued | Purpose |
|--------------|---------------|---------|
| `auth_status` | Auth state changes | OAuth flow progress |
| `user` | Input received (with isReplay) | Echo replayed messages |
| `assistant` | LLM response | AI responses |
| `system` | Status updates | SDK status notifications |
| `stream_event` | Token streaming | Real-time output |
| `result` | Session end | Final result/error |
| `control_response` | After control request | Request acknowledgments |

### Control Request Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   Control Request Processing                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Input Type        Handler                    Effect            │
│  ──────────────    ────────────────────────   ─────────────     │
│  interrupt         → abort current operation  → response ack    │
│  initialize        → setup MCP, send caps     → response caps   │
│  set_permission    → update context           → response ack    │
│  set_model         → change model             → response ack    │
│  set_thinking      → adjust token limit       → response ack    │
│  mcp_status        → collect server status    → response list   │
│  mcp_message       → route to MCP server      → response ack    │
│  rewind_code       → rollback conversation    → response/error  │
│                                                                 │
│  All control requests route through outputQueue.enqueue()       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## runNonInteractiveSession (Rw9)

### Purpose

Orchestrates a non-interactive (print mode) session, consuming the `Qu3` generator output and formatting it according to the specified output format.

### Implementation

```javascript
// ============================================
// runNonInteractiveSession - Non-interactive session runner
// Location: chunks.156.mjs:2934-3015
// ============================================

// ORIGINAL (for source lookup):
async function Rw9(A, Q, B, G, Z, I, Y, J) {
  if (await fYA()) await $D9();
  if (nQ.isSandboxingEnabled()) try {
    await nQ.initialize()
  } catch (q) {
    process.stderr.write(`\n❌ Sandbox Error: ${q instanceof Error?q.message:String(q)}\n`), l5(1, "other");
    return
  }
  // ... validation checks ...

  let W = await Q(),
    X = await Ju3(B, { continue: J.continue, teleport: J.teleport, resume: J.resume, ... }),
    V = typeof J.resume === "string" && (Boolean(nE(J.resume)) || J.resume.endsWith(".jsonl")),
    F = Boolean(J.sdkUrl);

  if (!A && !V && !F) {
    process.stderr.write(`Error: Input must be provided...\n`), l5(1);
    return
  }

  let K = bZ() ? Z : [...Z, ...W.mcp.tools],
    D = Wu3(A, J),  // Create transport
    H = J.sdkUrl ? "stdio" : J.permissionPromptToolName,
    C = Gu3(H, D, W.mcp.tools);

  let E = [];
  for await (let q of Qu3(D, W.mcp.clients, [...G, ...W.mcp.commands], K, X, C, I, Q, B, Y, J)) {
    if (J.outputFormat === "stream-json" && J.verbose) D.write(q);
    if (q.type !== "control_response" && q.type !== "control_request" &&
        q.type !== "control_cancel_request" && q.type !== "stream_event" &&
        q.type !== "keep_alive") E.push(q)
  }

  let U = dC(E);  // Get last message (the result)
  switch (J.outputFormat) {
    case "json":
      if (!U || U.type !== "result") throw Error("No messages returned");
      if (J.verbose) {
        L9(JSON.stringify(E) + `\n`);
        break
      }
      L9(JSON.stringify(U) + `\n`);
      break;
    case "stream-json":
      break;  // Already written during iteration
    default:
      // Text format
      if (!U || U.type !== "result") throw Error("No messages returned");
      switch (U.subtype) {
        case "success":
          L9(U.result.endsWith(`\n`) ? U.result : U.result + `\n`);
          break;
        case "error_during_execution":
          L9("Execution error");
          break;
        case "error_max_turns":
          L9(`Error: Reached max turns (${J.maxTurns})`);
          break;
        case "error_max_budget_usd":
          L9(`Error: Exceeded USD budget (${J.maxBudgetUsd})`);
          break;
        case "error_max_structured_output_retries":
          L9("Error: Failed to provide valid structured output after maximum retries")
      }
  }
  l5(U?.type === "result" && U?.is_error ? 1 : 0)
}

// READABLE (for understanding):
async function runNonInteractiveSession(
  input,               // Input prompt or null
  getAppState,         // State getter
  setAppState,         // State setter
  customCommands,      // Custom slash commands
  tools,               // Available tools
  agentConfigs,        // Agent configurations
  mcpServerConfigs,    // MCP server configs
  options              // CLI options
) {
  // Initialize Grove consent if needed
  if (await isGroveEnabled()) await showGroveConsent();

  // Initialize sandbox if enabled
  if (SandboxManager.isSandboxingEnabled()) {
    try {
      await SandboxManager.initialize();
    } catch (error) {
      process.stderr.write(`\n❌ Sandbox Error: ${error.message}\n`);
      exit(1, "other");
      return;
    }
  }

  // Validate resume options
  if (options.resumeSessionAt && !options.resume) {
    process.stderr.write(`Error: --resume-session-at requires --resume\n`);
    exit(1);
    return;
  }

  const appState = await getAppState();
  const initialMessages = await loadInitialMessages(setAppState, {
    continue: options.continue,
    resume: options.resume,
    // ...
  });

  const isResumeSession = typeof options.resume === "string" &&
    (isSessionId(options.resume) || options.resume.endsWith(".jsonl"));
  const isSDKMode = Boolean(options.sdkUrl);

  // Require input unless resuming or in SDK mode
  if (!input && !isResumeSession && !isSDKMode) {
    process.stderr.write(`Error: Input must be provided...\n`);
    exit(1);
    return;
  }

  // Validate stream-json requires verbose
  if (options.outputFormat === "stream-json" && !options.verbose) {
    process.stderr.write(`Error: --output-format=stream-json requires --verbose\n`);
    exit(1);
    return;
  }

  // Merge tools with MCP tools
  const allTools = isEnterpriseMode() ? tools : [...tools, ...appState.mcp.tools];

  // Create transport (stdio or WebSocket)
  const transport = createIOHandler(input, options);

  // Create permission callback
  const canUseTool = createPermissionCallback(
    options.sdkUrl ? "stdio" : options.permissionPromptToolName,
    transport,
    appState.mcp.tools
  );

  // Filter out permission prompt tool if custom
  if (options.permissionPromptToolName) {
    allTools = allTools.filter(t => t.name !== options.permissionPromptToolName);
  }

  // Collect non-control messages for final processing
  const collectedMessages = [];

  // Consume SDK agent loop output
  for await (const message of runSDKAgentLoop(
    transport,
    appState.mcp.clients,
    [...customCommands, ...appState.mcp.commands],
    allTools,
    initialMessages,
    canUseTool,
    agentConfigs,
    getAppState,
    setAppState,
    mcpServerConfigs,
    options
  )) {
    // Stream-json: write each message immediately
    if (options.outputFormat === "stream-json" && options.verbose) {
      transport.write(message);
    }

    // Collect non-control messages for final output
    if (message.type !== "control_response" &&
        message.type !== "control_request" &&
        message.type !== "control_cancel_request" &&
        message.type !== "stream_event" &&
        message.type !== "keep_alive") {
      collectedMessages.push(message);
    }
  }

  // Extract final result (last message)
  const finalResult = extractLastMessage(collectedMessages);

  // Format and output based on mode
  switch (options.outputFormat) {
    case "json":
      if (!finalResult || finalResult.type !== "result") {
        throw Error("No messages returned");
      }
      if (options.verbose) {
        writeToStdout(JSON.stringify(collectedMessages) + "\n");
      } else {
        writeToStdout(JSON.stringify(finalResult) + "\n");
      }
      break;

    case "stream-json":
      // Already written during iteration
      break;

    default:  // "text" format
      if (!finalResult || finalResult.type !== "result") {
        throw Error("No messages returned");
      }
      switch (finalResult.subtype) {
        case "success":
          writeToStdout(
            finalResult.result.endsWith("\n")
              ? finalResult.result
              : finalResult.result + "\n"
          );
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
        case "error_max_structured_output_retries":
          writeToStdout("Error: Failed to provide valid structured output after maximum retries");
          break;
      }
  }

  // Exit with appropriate code
  exit(finalResult?.type === "result" && finalResult?.is_error ? 1 : 0);
}

// Mapping: Rw9→runNonInteractiveSession, A→input, Q→getAppState, B→setAppState,
//          G→customCommands, Z→tools, I→agentConfigs, Y→mcpServerConfigs, J→options,
//          W→appState, X→initialMessages, D→transport, E→collectedMessages, U→finalResult
```

### Output Format Modes

| Mode | CLI Flag | Behavior | Use Case |
|------|----------|----------|----------|
| `text` | (default) | Extract `result.result` text only | Human-readable CLI |
| `json` | `--output-format=json` | Single JSON object at end | Scripting/automation |
| `stream-json` | `--output-format=stream-json --verbose` | Each message as JSON line | Real-time SDK integration |

### Output Format Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                    Output Format Processing                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  During Iteration (for await loop):                             │
│  ─────────────────────────────────                              │
│                                                                 │
│    Is stream-json && verbose?                                   │
│         │                                                       │
│         ├── YES → transport.write(message)  // immediate out    │
│         │                                                       │
│         └── NO  → (do nothing)                                  │
│                                                                 │
│    Always: collect non-control messages to E[]                  │
│                                                                 │
│  After Iteration (final output):                                │
│  ──────────────────────────────                                 │
│                                                                 │
│    outputFormat?                                                │
│         │                                                       │
│         ├── "stream-json" → skip (already written)              │
│         │                                                       │
│         ├── "json" ──┬── verbose? → L9(JSON.stringify(E[]))     │
│         │            └── !verbose → L9(JSON.stringify(U))       │
│         │                                                       │
│         └── "text" ──┬── success → L9(U.result)                 │
│                      ├── error_* → L9("Error: ...")             │
│                      └── other   → throw Error                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## createIOHandler (Wu3)

### Purpose

Factory function that creates the appropriate transport based on options - either `StdioSDKTransport` for subprocess communication or `WebSocketSDKTransport` for remote SDK connection.

### Implementation

```javascript
// ============================================
// createIOHandler - Transport factory
// Location: chunks.157.mjs:95-110
// ============================================

// ORIGINAL (for source lookup):
function Wu3(A, Q) {
  let B;
  if (typeof A === "string")
    if (A.trim() !== "") B = LQ0([JSON.stringify({
      type: "user",
      session_id: "",
      message: {
        role: "user",
        content: A
      },
      parent_tool_use_id: null
    })]);
    else B = LQ0([]);
  else B = A;
  return Q.sdkUrl ? new RD0(Q.sdkUrl, B, Q.replayUserMessages) : new aSA(B, Q.replayUserMessages)
}

// READABLE (for understanding):
function createIOHandler(input, options) {
  let inputStream;

  if (typeof input === "string") {
    // String input - wrap as initial user message
    if (input.trim() !== "") {
      inputStream = createReadableStream([JSON.stringify({
        type: "user",
        session_id: "",
        message: {
          role: "user",
          content: input
        },
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

// Mapping: Wu3→createIOHandler, A→input, Q→options, B→inputStream,
//          LQ0→createReadableStream, RD0→WebSocketSDKTransport, aSA→StdioSDKTransport
```

### Transport Selection Logic

```
┌─────────────────────────────────────────────────────────────────┐
│                    Transport Selection                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Input Type                  Action                             │
│  ──────────────────────────  ─────────────────────────────────  │
│  string (non-empty)          Wrap as user message JSON stream   │
│  string (empty/whitespace)   Empty stream                       │
│  stream (stdin)              Use directly                       │
│                                                                 │
│  options.sdkUrl              Transport Type                     │
│  ──────────────────────────  ─────────────────────────────────  │
│  present (truthy)            → WebSocketSDKTransport (RD0)      │
│  absent (falsy)              → StdioSDKTransport (aSA)          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Complete Output Flow Example

### SDK Python → Claude Code → SDK Python

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Complete Output Flow                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SDK Client (Python)           Claude Code Process                           │
│       │                              │                                       │
│       │ spawn: claude --print        │                                       │
│       │ stdin: {"type":"user",...}   │                                       │
│       │─────────────────────────────>│                                       │
│       │                              │                                       │
│       │                              │  Wu3: Create StdioSDKTransport        │
│       │                              │  Rw9: Start non-interactive session   │
│       │                              │  Qu3: Create AsyncMessageQueue        │
│       │                              │                                       │
│       │                              │  ┌────────────────────────┐           │
│       │                              │  │ Agent Loop (o59)       │           │
│       │                              │  │ - LLM call             │           │
│       │                              │  │ - Tool execution       │           │
│       │                              │  │ - yield messages       │           │
│       │                              │  └──────────┬─────────────┘           │
│       │                              │             │                         │
│       │                              │  ┌──────────▼─────────────┐           │
│       │                              │  │ YSA Queue              │           │
│       │                              │  │ - enqueue(message)     │           │
│       │                              │  └──────────┬─────────────┘           │
│       │                              │             │                         │
│       │                              │  ┌──────────▼─────────────┐           │
│       │                              │  │ Rw9: for await (msg)   │           │
│       │                              │  │ - collect messages     │           │
│       │                              │  │ - format output        │           │
│       │                              │  └──────────┬─────────────┘           │
│       │                              │             │                         │
│       │                              │  ┌──────────▼─────────────┐           │
│       │                              │  │ L9: writeToStdout      │           │
│       │                              │  │ - 2000 char chunks     │           │
│       │                              │  └──────────┬─────────────┘           │
│       │                              │             │                         │
│       │ {"type":"result",...}        │             │                         │
│       │<─────────────────────────────│◄────────────┘                         │
│       │                              │                                       │
│       │                              │  process.exit(0)                      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

| Component | Purpose | Key Insight |
|-----------|---------|-------------|
| `writeToStdout` (L9) | Chunked stdout writer | 2000-char chunks prevent buffer overflow |
| `AsyncMessageQueue` (YSA) | Producer-consumer buffer | Lazy resolution minimizes buffering |
| `runSDKAgentLoop` (Qu3) | Main orchestrator | Returns queue for async consumption |
| `runNonInteractiveSession` (Rw9) | Session runner | Format-aware output routing |
| `createIOHandler` (Wu3) | Transport factory | URL presence determines transport type |

---

## Related Documents

- [overview.md](./overview.md) - SDK architecture overview
- [transport_layer.md](./transport_layer.md) - Input-side transport implementation
- [message_protocol.md](./message_protocol.md) - Message types and validation
- [control_protocol.md](./control_protocol.md) - Control request/response
