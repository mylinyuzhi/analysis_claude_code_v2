# Streaming and Error Handling

## Overview

Claude Code v2.0.59 implements robust streaming support for real-time command output, comprehensive timeout mechanisms, and graceful error handling with abort capabilities. This document covers the streaming architecture, timeout patterns, and error recovery mechanisms.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

---

## Streaming Architecture

### Stream Events

Commands and API calls support streaming through async generators and event-based patterns:

```
API Request
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│  Streaming Pipeline                                              │
│                                                                  │
│  content_block_start → content_block_delta → content_block_stop  │
│         │                      │                    │            │
│         ▼                      ▼                    ▼            │
│    Initialize             Append text           Finalize         │
│     buffer                  chunks               block           │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
  Progressive display in terminal
```

### Stream Event Types

| Event | Description | Data |
|-------|-------------|------|
| `content_block_start` | New content block begins | Block type, index |
| `content_block_delta` | Incremental text update | Delta text |
| `content_block_stop` | Block completed | Final state |
| `message_start` | Message begins | Message metadata |
| `message_stop` | Message completed | Final message |

---

## Timeout Mechanisms

### API Timeout

The default API timeout is 10 minutes (600,000ms):

```javascript
// ============================================
// API Timeout Configuration
// Location: chunks.88.mjs:27
// ============================================

// ORIGINAL (for source lookup):
{
  defaultHeaders: Y,
  maxRetries: Q,
  timeout: parseInt(process.env.API_TIMEOUT_MS || String(600000), 10),
  dangerouslyAllowBrowser: !0,
  // ...
}

// READABLE (for understanding):
const clientOptions = {
  defaultHeaders: headers,
  maxRetries: maxRetries,
  timeout: parseInt(process.env.API_TIMEOUT_MS || "600000", 10),  // 10 minutes
  dangerouslyAllowBrowser: true,
  // ...
};
```

**Configuration:**
- Environment variable: `API_TIMEOUT_MS`
- Default: 600,000ms (10 minutes)
- Applies to all API calls

### Command-Level Timeouts

Individual commands can have shorter timeouts:

```javascript
// Example: release-notes command with 500ms timeout
async call() {
  let notes = [];
  try {
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(Error("Timeout")), 500);
    });
    await Promise.race([fetchReleaseNotes(), timeout]);
    notes = parseReleaseNotes();
  } catch {}
  // ...
}
```

### Directory Scan Timeout

Custom command loading uses 3-second timeouts:

```javascript
// ============================================
// scanMarkdownFiles timeout
// Location: chunks.153.mjs:1809-1836
// ============================================

async function scanMarkdownFiles(directory) {
  const abortController = createAbortController();
  const timeout = setTimeout(() => abortController.abort(), 3000);  // 3 seconds

  try {
    // Scan with abort signal
    const files = await ripgrepSearch(args, directory, abortController.signal);
    // ...
  } finally {
    clearTimeout(timeout);
  }
}
```

---

## AbortController Integration

### Controller Architecture

```
User Action (Ctrl+C)
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  AbortController                                                 │
│                                                                  │
│  controller.abort()                                              │
│       │                                                          │
│       ├─── API requests → Canceled                               │
│       ├─── Tool execution → Stopped                              │
│       ├─── Stream → Terminated                                   │
│       └─── Pending operations → Rejected                         │
└─────────────────────────────────────────────────────────────────┘
```

### Signal Propagation

AbortController signals flow through the entire call chain:

```javascript
// ============================================
// AbortController in command context
// ============================================

// READABLE pattern:
async function executeWithAbort(context) {
  const { abortController } = context;

  try {
    // Pass signal to all async operations
    const result = await apiCall({
      signal: abortController.signal
    });

    // Check for abort before continuing
    if (abortController.signal.aborted) {
      throw new AbortError("Operation canceled");
    }

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      // Handle graceful cancellation
      return { type: "canceled" };
    }
    throw error;
  }
}
```

### MCP Request Handler with AbortController

```javascript
// ============================================
// MCP AbortController integration
// Location: chunks.91.mjs:448-484
// ============================================

// ORIGINAL (for source lookup):
let Y = new AbortController;
this._requestHandlerAbortControllers.set(A.id, Y);
let J = {
  signal: Y.signal,
  sessionId: I?.sessionId,
  _meta: A.params?._meta,
  sendNotification: (W) => this.notification(W, {
    relatedRequestId: A.id
  }),
  // ...
};

// READABLE (for understanding):
const abortController = new AbortController();
this._requestHandlerAbortControllers.set(request.id, abortController);

const requestContext = {
  signal: abortController.signal,
  sessionId: session?.sessionId,
  _meta: request.params?._meta,
  sendNotification: (notification) => this.notification(notification, {
    relatedRequestId: request.id
  }),
  // ...
};
```

---

## Error Handling

### Error Types

| Error Class | Description | Recovery |
|-------------|-------------|----------|
| `AbortError` | User-initiated cancellation | Graceful termination |
| `TimeoutError` | Operation exceeded time limit | Retry or fallback |
| `CommandNotFoundError` | Invalid command name | Show available commands |
| `SDKAbortError` | Anthropic SDK timeout | Retry with fallback |

### Error Wrapping in Command Execution

```javascript
// ============================================
// Error handling in executeCommand
// Location: chunks.121.mjs:1106-1145
// ============================================

// READABLE pattern:
async function executeCommand(commandName, args, context) {
  const command = lookupCommand(commandName, context.commands);

  try {
    switch (command.type) {
      case "local":
        try {
          const result = await command.call(args, context);
          return { messages: [formatOutput(result)], shouldQuery: false };
        } catch (error) {
          logError(error);
          return {
            messages: [
              createUserMessage({ content: formatCommandMetadata(command, args) }),
              createUserMessage({ content: `<local-command-stderr>${String(error)}</local-command-stderr>` })
            ],
            shouldQuery: false,
            command: command
          };
        }

      case "prompt":
        try {
          return await processPromptSlashCommand(command, args, context);
        } catch (error) {
          return {
            messages: [
              createUserMessage({ content: formatCommandMetadata(command, args) }),
              createUserMessage({ content: `<local-command-stderr>${String(error)}</local-command-stderr>` })
            ],
            shouldQuery: false,
            command: command
          };
        }
    }
  } catch (error) {
    // Handle CommandNotFoundError specially
    if (error instanceof CommandNotFoundError) {
      return {
        messages: [createUserMessage({ content: error.message })],
        shouldQuery: false,
        command: command
      };
    }
    throw error;
  }
}
```

### Output Format for Errors

```xml
<!-- Standard output -->
<local-command-stdout>Command completed successfully</local-command-stdout>

<!-- Error output -->
<local-command-stderr>Error: Something went wrong</local-command-stderr>
```

---

## Serial Command Execution

### Why Serial?

Commands execute one at a time (serially) for these reasons:

1. **State consistency:** Commands modify shared state (context, settings)
2. **Deterministic order:** Results don't depend on race conditions
3. **User expectations:** Commands complete in order typed
4. **Resource management:** Single LLM call at a time

### Command Queue

```javascript
// ============================================
// Command queue operations
// Location: chunks.142.mjs:1717-1771
// ============================================

// Enqueue command
function enqueueCommand(command, setState) {
  setState((state) => ({
    ...state,
    queuedCommands: [...state.queuedCommands, command]
  }));
  logQueueEvent("enqueue", command.value);
}

// Dequeue single command
async function dequeueSingleCommand(getState, setState) {
  const state = await getState();
  if (state.queuedCommands.length === 0) return;

  const [nextCommand, ...remaining] = state.queuedCommands;
  setState((state) => ({
    ...state,
    queuedCommands: remaining
  }));

  logQueueEvent("dequeue");
  return nextCommand;
}

// Dequeue all commands
async function dequeueAllCommands(getState, setState) {
  const state = await getState();
  if (state.queuedCommands.length === 0) return [];

  const allCommands = [...state.queuedCommands];
  setState((state) => ({
    ...state,
    queuedCommands: []
  }));

  for (const cmd of allCommands) {
    logQueueEvent("dequeue");
  }

  return allCommands;
}
```

### Contrast: Parallel Tool Execution

While commands are serial, tools execute in parallel:

```
Commands: SERIAL (queue-based)
  /cmd1 → /cmd2 → /cmd3
    ↓        ↓        ↓
  exec    wait     wait
           ↓
         exec    wait
                   ↓
                 exec

Tools: PARALLEL (concurrent)
  tool1, tool2, tool3
    ↓       ↓       ↓
  exec    exec    exec
    ↓       ↓       ↓
  done    done    done
```

---

## Non-Interactive Mode

### supportsNonInteractive Flag

Commands can declare headless support:

```javascript
const compactCommand = {
  name: "compact",
  type: "local",
  supportsNonInteractive: true,  // Works in headless mode
  // ...
};

const configCommand = {
  name: "config",
  type: "local-jsx",
  supportsNonInteractive: false,  // Requires interactive UI
  // ...
};
```

### Non-Interactive Execution

```javascript
// ============================================
// Non-interactive mode handling
// Location: chunks.121.mjs:1048-1057
// ============================================

// READABLE pattern:
case "local-jsx":
  return new Promise((resolve) => {
    command.call(onComplete, context, args).then((jsxElement) => {
      // Skip JSX rendering in non-interactive mode
      if (context.options.isNonInteractiveSession) {
        resolve({
          messages: [],
          shouldQuery: false,
          skipHistory: true,
          command: command
        });
        return;
      }

      // Render JSX in interactive mode
      setCommandJSX({
        jsx: jsxElement,
        shouldHidePromptInput: true,
        showSpinner: false,
        isLocalJSXCommand: false
      });
    });
  });
```

---

## Retry Mechanisms

### Streaming Fallback

If streaming fails, fall back to non-streaming:

```javascript
// Streaming with fallback pattern:
async function apiCallWithFallback(params) {
  try {
    // Try streaming first
    return await streamingApiCall(params);
  } catch (error) {
    if (isStreamingError(error)) {
      // Fall back to non-streaming
      return await nonStreamingApiCall(params);
    }
    throw error;
  }
}
```

### Token Counting Retry

Token counting may need retry on errors:

```javascript
// Token counting with retry:
async function countTokensWithRetry(content, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await countTokens(content);
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await sleep(100 * (attempt + 1));  // Exponential backoff
    }
  }
}
```

---

## Graceful Shutdown

### Abort Cascade

When user cancels (Ctrl+C):

```
User: Ctrl+C
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│  Abort Cascade                                                   │
│                                                                  │
│  1. Set abortController.abort()                                  │
│  2. Cancel pending API requests                                  │
│  3. Terminate active streams                                     │
│  4. Clear queued commands                                        │
│  5. Clean up resources                                           │
│  6. Return to prompt                                             │
└─────────────────────────────────────────────────────────────────┘
```

### Cleanup Pattern

```javascript
// Cleanup on abort:
async function executeWithCleanup(operation, cleanup) {
  try {
    return await operation();
  } catch (error) {
    if (error.name === "AbortError") {
      await cleanup();
      throw error;
    }
    throw error;
  } finally {
    // Always run cleanup for resources
    await cleanup();
  }
}
```

---

## Display Options for Error States

### Display Modes

| Mode | When Used | Effect |
|------|-----------|--------|
| `"skip"` | Silent errors | No output |
| `"system"` | System messages | Gray/dim output |
| Default | User-visible errors | Normal output |

### Error Display Pattern

```javascript
// Error display decision:
function displayError(error, context) {
  if (context.options.isNonInteractiveSession) {
    // Non-interactive: always show errors
    return createErrorMessage(error);
  }

  if (error.name === "AbortError") {
    // User-initiated: skip display
    return { display: "skip" };
  }

  // Normal error: show to user
  return createErrorMessage(error);
}
```

---

## Timeout Configuration Summary

| Component | Default | Env Variable | Description |
|-----------|---------|--------------|-------------|
| API calls | 600,000ms | `API_TIMEOUT_MS` | Main API timeout |
| Directory scan | 3,000ms | - | Custom command loading |
| Release notes | 500ms | - | Quick network check |
| MCP operations | Varies | - | Per-operation |

---

## Error Recovery Strategies

### Strategy 1: Silent Fallback

```javascript
// Silent fallback for non-critical operations:
async function loadWithFallback() {
  try {
    return await loadFromNetwork();
  } catch {
    return [];  // Return empty, don't fail
  }
}
```

### Strategy 2: Retry with Backoff

```javascript
// Retry with exponential backoff:
async function retryWithBackoff(operation, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 100);
    }
  }
}
```

### Strategy 3: User Notification

```javascript
// Notify user and continue:
async function notifyAndContinue(operation) {
  try {
    return await operation();
  } catch (error) {
    console.warn(`Warning: ${error.message}`);
    return null;
  }
}
```

---

## See Also

- [Command Parsing](./parsing.md) - Command validation and routing
- [Command Execution](./execution.md) - Execution flow
- [Built-in Commands](./builtin_commands.md) - Command reference
- [Custom Commands](./custom_commands.md) - Custom command system
