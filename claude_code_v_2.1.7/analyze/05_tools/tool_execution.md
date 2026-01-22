# Tool Execution Flow (Claude Code v2.1.7)

This document describes the tool execution orchestration, including parallel/serial execution, concurrency control, and progress tracking.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## Overview

Claude Code v2.1.7 introduces a refined tool execution architecture using the `_H1` (ToolUseQueueManager) class that manages concurrent and sequential tool execution with streaming results.

### Key Execution Functions

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `aN` | mainQueryGenerator | chunks.134.mjs:99-114 | Main query/agent loop generator |
| `jH1` | executeToolUse | chunks.134.mjs:660-739 | Tool execution dispatcher |
| `k77` | wrapToolWithProgress | chunks.134.mjs:741-770 | Progress callback wrapper |
| `b77` | executeToolWithValidation | chunks.134.mjs:772-849+ | Validation and execution |
| `_H1` | ToolUseQueueManager | chunks.133.mjs:2911-3087 | Queue manager class |
| `_77` | getMaxToolConcurrency | chunks.134.mjs:80 | Max concurrency getter |

---

## Execution Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           Tool Execution Flow                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. LLM Response with tool_use blocks                                        │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────┐                                     │
│  │ _H1.addTool(toolUseBlock, message)  │  Queue tool for execution           │
│  └─────────────────┬───────────────────┘                                     │
│                    │                                                         │
│                    ▼                                                         │
│  ┌─────────────────────────────────────┐                                     │
│  │ _H1.processQueue()                  │  Check if tool can execute          │
│  │  └─ canExecuteTool(isConcurrencySafe)                                     │
│  └─────────────────┬───────────────────┘                                     │
│                    │                                                         │
│         ┌─────────┴─────────┐                                                │
│         │                   │                                                │
│         ▼                   ▼                                                │
│    [Can Execute]      [Must Wait]                                            │
│         │                   │                                                │
│         ▼                   ▼                                                │
│  ┌─────────────────┐  ┌─────────────┐                                        │
│  │ executeTool(t)  │  │ Stay queued │                                        │
│  └────────┬────────┘  └─────────────┘                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────┐                                     │
│  │ jH1(toolUse, message, canUse, ctx)  │  Dispatch execution                 │
│  │  └─ k77(toolDef, id, input, ctx)    │  Wrap with progress                 │
│  │      └─ b77(tool, id, input, ctx)   │  Validate and call                  │
│  └─────────────────┬───────────────────┘                                     │
│                    │                                                         │
│         ┌─────────┴─────────┐                                                │
│         │                   │                                                │
│         ▼                   ▼                                                │
│    [Progress]          [Complete]                                            │
│         │                   │                                                │
│         ▼                   ▼                                                │
│  ┌─────────────────┐  ┌─────────────────────┐                                │
│  │ Yield progress  │  │ Mark tool completed │                                │
│  │ to queue        │  │ Apply context mods  │                                │
│  └─────────────────┘  └─────────────────────┘                                │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## ToolUseQueueManager Class (_H1)

The `_H1` class is the central coordinator for tool execution in v2.1.7.

### Class Structure

```javascript
// ============================================
// ToolUseQueueManager - Tool execution queue manager
// Location: chunks.133.mjs:2911-3087
// ============================================

// ORIGINAL (for source lookup):
class _H1 {
  toolDefinitions;
  canUseTool;
  tools = [];
  toolUseContext;
  hasErrored = !1;
  discarded = !1;
  progressAvailableResolve;

  constructor(toolDefinitions, canUseTool, toolUseContext) { ... }
  addTool(toolUseBlock, assistantMessage) { ... }
  canExecuteTool(isConcurrencySafe) { ... }
  async processQueue() { ... }
  async executeTool(tool) { ... }
  createSyntheticErrorMessage(toolUseId, reason, assistantMessage) { ... }
  getAbortReason() { ... }
  *getCompletedResults() { ... }
  async *getRemainingResults() { ... }
  hasCompletedResults() { ... }
  hasExecutingTools() { ... }
  hasUnfinishedTools() { ... }
  hasPendingProgress() { ... }
  getUpdatedContext() { ... }
  discard() { ... }
}

// READABLE (for understanding):
class ToolUseQueueManager {
  toolDefinitions;      // Array of tool definitions
  canUseTool;           // Permission check function
  tools = [];           // Tool execution queue with state
  toolUseContext;       // Execution context
  hasErrored = false;   // Error flag for sibling abort
  discarded = false;    // Whether queue is discarded
  progressAvailableResolve;  // Promise resolver for progress

  constructor(toolDefinitions, canUseTool, toolUseContext) {
    this.toolDefinitions = toolDefinitions;
    this.canUseTool = canUseTool;
    this.toolUseContext = toolUseContext;
  }
}
```

### Tool State Machine

Each tool in the queue progresses through states:

```
┌─────────┐     ┌───────────┐     ┌───────────┐     ┌─────────┐
│ queued  │ ──▶ │ executing │ ──▶ │ completed │ ──▶ │ yielded │
└─────────┘     └───────────┘     └───────────┘     └─────────┘
```

### Tool Queue Entry Structure

```javascript
{
  id: string;                  // Tool use ID
  block: ToolUseBlock;         // The tool_use block from LLM
  assistantMessage: Message;   // Parent assistant message
  status: "queued" | "executing" | "completed" | "yielded";
  isConcurrencySafe: boolean;  // Can run in parallel
  results: Message[];          // Accumulated results
  contextModifiers: Function[]; // Context modification functions
  pendingProgress: Message[];  // Pending progress messages
  promise?: Promise;           // Execution promise
}
```

---

## Concurrency Control

### canExecuteTool Method

Determines if a tool can start executing based on concurrency:

```javascript
// ============================================
// canExecuteTool - Check if tool can execute now
// Location: chunks.133.mjs:2959-2963
// ============================================

// ORIGINAL (for source lookup):
canExecuteTool(A) {
  let Q = this.tools.filter((B) => B.status === "executing");
  return Q.length === 0 || A && Q.every((B) => B.isConcurrencySafe)
}

// READABLE (for understanding):
canExecuteTool(isConcurrencySafe) {
  const executingTools = this.tools.filter((tool) => tool.status === "executing");

  // Can execute if:
  // 1. No tools currently executing, OR
  // 2. This tool is concurrency-safe AND all executing tools are also safe
  return executingTools.length === 0 ||
         (isConcurrencySafe && executingTools.every((tool) => tool.isConcurrencySafe));
}
```

**Algorithm:**
- If queue is empty → tool can execute
- If tool is NOT concurrency-safe → must wait for queue to clear
- If tool IS concurrency-safe → can run if all executing tools are also safe

### processQueue Method

Processes the tool queue, starting tools when possible:

```javascript
// ============================================
// processQueue - Process tool execution queue
// Location: chunks.133.mjs:2965-2973
// ============================================

// ORIGINAL (for source lookup):
async processQueue() {
  for (let A of this.tools) {
    if (A.status !== "queued") continue;
    if (this.canExecuteTool(A.isConcurrencySafe)) await this.executeTool(A);
    else if (!A.isConcurrencySafe) break
  }
}

// READABLE (for understanding):
async processQueue() {
  for (const tool of this.tools) {
    // Skip non-queued tools
    if (tool.status !== "queued") continue;

    if (this.canExecuteTool(tool.isConcurrencySafe)) {
      // Start executing this tool
      await this.executeTool(tool);
    } else if (!tool.isConcurrencySafe) {
      // Non-concurrent tool found but can't execute - stop processing
      // This maintains order for sequential tools
      break;
    }
    // If tool is concurrent but can't execute, continue checking next
  }
}
```

**Key insight:** Non-concurrent tools create a barrier - queue processing stops when reaching one that can't execute yet.

---

## Tool Execution

### executeTool Method

Main execution logic for a single tool:

```javascript
// ============================================
// executeTool - Execute a single tool
// Location: chunks.133.mjs:3010-3055
// ============================================

// READABLE (for understanding):
async executeTool(tool) {
  // Mark as executing
  tool.status = "executing";
  this.toolUseContext.setInProgressToolUseIDs((ids) =>
    new Set([...ids, tool.id])
  );

  let results = [];
  let contextModifiers = [];

  const executionPromise = (async () => {
    // Check for abort before starting
    const abortReason = this.getAbortReason();
    if (abortReason) {
      results.push(this.createSyntheticErrorMessage(
        tool.id, abortReason, tool.assistantMessage
      ));
      tool.results = results;
      tool.contextModifiers = contextModifiers;
      tool.status = "completed";
      return;
    }

    // Execute via jH1 generator
    const toolExecutor = jH1(
      tool.block,
      tool.assistantMessage,
      this.canUseTool,
      this.toolUseContext
    );

    let hasErroredLocally = false;

    for await (const output of toolExecutor) {
      // Check for abort during execution
      const currentAbortReason = this.getAbortReason();
      if (currentAbortReason && !hasErroredLocally) {
        results.push(this.createSyntheticErrorMessage(
          tool.id, currentAbortReason, tool.assistantMessage
        ));
        break;
      }

      // Check if this tool result has error
      if (output.message.type === "user" &&
          Array.isArray(output.message.message.content) &&
          output.message.message.content.some((c) =>
            c.type === "tool_result" && c.is_error === true
          )) {
        this.hasErrored = true;
        hasErroredLocally = true;
      }

      // Handle message types
      if (output.message) {
        if (output.message.type === "progress") {
          // Queue progress for streaming
          tool.pendingProgress.push(output.message);
          if (this.progressAvailableResolve) {
            this.progressAvailableResolve();
            this.progressAvailableResolve = undefined;
          }
        } else {
          results.push(output.message);
        }
      }

      // Collect context modifiers
      if (output.contextModifier) {
        contextModifiers.push(output.contextModifier.modifyContext);
      }
    }

    tool.results = results;
    tool.contextModifiers = contextModifiers;
    tool.status = "completed";

    // Apply context modifiers immediately for non-concurrent tools
    if (!tool.isConcurrencySafe && contextModifiers.length > 0) {
      for (const modifier of contextModifiers) {
        this.toolUseContext = modifier(this.toolUseContext);
      }
    }
  })();

  tool.promise = executionPromise;

  // Trigger queue processing when complete
  executionPromise.finally(() => {
    this.processQueue();
  });
}
```

---

## Streaming Results

### getRemainingResults Generator

Yields results as tools complete:

```javascript
// ============================================
// getRemainingResults - Async generator for streaming results
// Location: chunks.133.mjs:3060-3085
// ============================================

// READABLE (for understanding):
async *getRemainingResults() {
  if (this.discarded) return;

  while (this.hasUnfinishedTools()) {
    await this.processQueue();

    // Yield completed results
    for (const result of this.getCompletedResults()) {
      yield result;
    }

    // Wait for tool completion if needed
    if (this.hasExecutingTools() && !this.hasCompletedResults() && !this.hasPendingProgress()) {
      const executingPromises = this.tools
        .filter((tool) => tool.status === "executing" && tool.promise)
        .map((tool) => tool.promise);

      // Create promise for progress availability
      const progressWaitPromise = new Promise((resolve) => {
        this.progressAvailableResolve = resolve;
      });

      if (executingPromises.length > 0) {
        // Wait for either tool completion OR progress available
        await Promise.race([...executingPromises, progressWaitPromise]);
      }
    }
  }

  // Final yield of any remaining completed results
  for (const result of this.getCompletedResults()) {
    yield result;
  }
}
```

**Key insight:** Uses `Promise.race` to wait for either:
1. Any executing tool to complete
2. Progress data to become available

This enables real-time streaming of results and progress.

---

## Max Concurrency Configuration

```javascript
// ============================================
// getMaxToolConcurrency - Returns max concurrent tool limit
// Location: chunks.134.mjs:80
// ============================================

// ORIGINAL (for source lookup):
function _77() {
  return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10
}

// READABLE (for understanding):
function getMaxToolConcurrency() {
  return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10;
}

// Default: 10 concurrent tools
// Override: Set CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY env var
```

---

## Tool Dispatch Chain

### jH1 - Tool Execution Dispatcher

```javascript
// ============================================
// jH1 - Tool execution dispatcher
// Location: chunks.134.mjs:660-739
// ============================================

// READABLE (for understanding):
async function* executeToolUse(toolUseBlock, assistantMessage, canUseTool, toolUseContext) {
  const toolName = toolUseBlock.name;
  const toolDefinition = lookupTool(toolUseContext.options.tools, toolName);
  const messageId = assistantMessage.message.id;
  const requestId = assistantMessage.requestId;
  const mcpServerType = getMcpServerType(toolName, toolUseContext.options.mcpClients);

  // Validate tool exists
  if (!toolDefinition) {
    yield createErrorResult(`Tool ${toolName} not found`);
    return;
  }

  // Check if aborted
  if (toolUseContext.abortController.signal.aborted) {
    yield createAbortedResult(toolUseBlock.id, assistantMessage);
    return;
  }

  // Execute with progress tracking
  for await (const result of executeToolWithProgressTracking(
    toolDefinition,
    toolUseBlock.id,
    toolUseBlock.input,
    toolUseContext,
    canUseTool,
    assistantMessage,
    messageId,
    requestId,
    mcpServerType
  )) {
    yield result;
  }
}
```

### k77 - Progress Callback Wrapper

```javascript
// ============================================
// k77 - Progress callback wrapper
// Location: chunks.134.mjs:741-770
// ============================================

// READABLE (for understanding):
function wrapToolExecutionWithProgress(toolDef, toolUseId, toolInput, toolUseContext, canUseTool, assistantMessage, messageId, requestId, mcpServerType) {
  const progressQueue = new ProgressQueue();

  executeToolWithCallback(
    toolDef, toolUseId, toolInput, toolUseContext, canUseTool,
    assistantMessage, messageId, requestId, mcpServerType,
    // Progress callback
    (progressData) => {
      logEvent("tengu_tool_use_progress", { ... });
      progressQueue.enqueue({
        message: createProgressMessage({
          toolUseID: progressData.toolUseID,
          parentToolUseID: toolUseId,
          data: progressData.data
        })
      });
    }
  ).then((results) => {
    for (const result of results) {
      progressQueue.enqueue(result);
    }
  }).catch((error) => {
    progressQueue.error(error);
  }).finally(() => {
    progressQueue.done();
  });

  return progressQueue;
}
```

### b77 - Validation and Execution

```javascript
// ============================================
// b77 - Tool validation and execution
// Location: chunks.134.mjs:772-849+
// ============================================

// READABLE (for understanding):
async function executeToolWithValidation(tool, toolUseId, toolInput, context, systemContext, assistantMessage, messageId, requestId, mcpServerType, progressCallback) {

  // Step 1: Schema validation
  const schemaResult = tool.inputSchema.safeParse(toolInput);
  if (!schemaResult.success) {
    const errorMessage = formatZodError(tool.name, schemaResult.error);
    logError("tengu_tool_use_error", { error: "InputValidationError", ... });
    return [{ message: createErrorResult(errorMessage, toolUseId) }];
  }

  // Step 2: Custom validation (validateInput hook)
  const customValidation = await tool.validateInput?.(schemaResult.data, context);
  if (customValidation?.result === false) {
    logError("tengu_tool_use_error", { error: customValidation.message, ... });
    return [{ message: createErrorResult(customValidation.message, toolUseId) }];
  }

  // Step 3: Permission check (handled separately in canUseTool)

  // Step 4: Execute tool.call()
  const results = [];
  for await (const output of tool.call(
    schemaResult.data,
    context,
    toolUseId,
    assistantMessage,
    progressCallback
  )) {
    // Handle progress messages
    if (output.type === "progress" && progressCallback) {
      progressCallback(output);
      continue;
    }

    // Handle context modifiers
    if (output.contextModifier) {
      results.push({ contextModifier: output.contextModifier });
    }

    // Handle stop reasons
    if (output.stopReason) {
      results.push({ stopReason: output.stopReason });
    }

    // Handle new messages
    if (output.newMessages) {
      for (const msg of output.newMessages) {
        results.push({ message: msg });
      }
    }

    // Map result to tool_result block
    if (output.data !== undefined) {
      const toolResult = tool.mapToolResultToToolResultBlockParam(
        output.data,
        toolUseId
      );
      results.push({
        message: createUserMessage({
          content: [toolResult],
          toolUseResult: formatToolResult(output.data),
          sourceToolAssistantUUID: assistantMessage.uuid
        })
      });
    }
  }

  return results;
}
```

---

## Abort and Error Handling

### Abort Reason Detection

```javascript
// ============================================
// getAbortReason - Check why execution should abort
// Location: chunks.133.mjs:3004-3009
// ============================================

// READABLE (for understanding):
getAbortReason() {
  if (this.discarded) return "streaming_fallback";
  if (this.hasErrored) return "sibling_error";
  if (this.toolUseContext.abortController.signal.aborted) return "user_interrupted";
  return null;
}
```

### Synthetic Error Messages

```javascript
// ============================================
// createSyntheticErrorMessage - Create error for aborted tools
// Location: chunks.133.mjs:2972-3003
// ============================================

// READABLE (for understanding):
createSyntheticErrorMessage(toolUseId, reason, assistantMessage) {
  let content;
  let toolUseResult;

  if (reason === "user_interrupted") {
    content = "The user doesn't want to proceed with this tool use..."; // v4A
    toolUseResult = "User rejected tool use";
  } else if (reason === "streaming_fallback") {
    content = "<tool_use_error>Error: Streaming fallback - tool execution discarded</tool_use_error>";
    toolUseResult = "Streaming fallback - tool execution discarded";
  } else {
    content = "<tool_use_error>Sibling tool call errored</tool_use_error>";
    toolUseResult = "Sibling tool call errored";
  }

  return createUserMessage({
    content: [{
      type: "tool_result",
      content: content,
      is_error: true,
      tool_use_id: toolUseId
    }],
    toolUseResult: toolUseResult,
    sourceToolAssistantUUID: assistantMessage.uuid
  });
}
```

### Error Propagation

When a tool fails with `is_error: true`:
1. `hasErrored` flag is set on the queue manager
2. All sibling tools receive synthetic error messages
3. Execution stops for all pending tools

---

## Context Modifiers

Context modifiers allow tools to update the execution context:

```javascript
// Context modifier pattern
{
  contextModifier: {
    toolUseID: string;
    modifyContext: (context) => newContext;
  }
}

// Applied differently based on concurrency:

// For non-concurrent tools: Applied immediately after tool completes
if (!tool.isConcurrencySafe && contextModifiers.length > 0) {
  for (const modifier of contextModifiers) {
    this.toolUseContext = modifier(this.toolUseContext);
  }
}

// For concurrent tools: Batched and applied after all complete
// (handled in calling code)
```

---

## Concurrency Safety by Tool

| Tool | Concurrency Safe | Reason |
|------|-----------------|--------|
| Read | Yes | Read-only operation |
| Write | No | Modifies files |
| Edit | No | Modifies files |
| Glob | Yes | Read-only search |
| Grep | Yes | Read-only search |
| Bash | Conditional | Based on command analysis |
| KillShell | Yes | Stateless operation |
| TaskOutput | Yes | Read-only query |
| WebFetch | Yes | External request |
| WebSearch | Yes | External request |
| Task | Yes | Spawns separate process |
| NotebookEdit | No | Modifies files |

### Bash Concurrency Logic

```javascript
// chunks.124.mjs:1517-1523
isConcurrencySafe(input) {
  return this.isReadOnly(input);
},
isReadOnly(input) {
  const parsed = parseCommand(input.command);
  return checkCommandBehavior(input, parsed).behavior === "allow";
}

// Read-only commands (auto-allowed):
// find, grep, rg, ag, ack, locate, which, whereis
// cat, head, tail, less, more, wc, stat, file, strings, ls, tree, du
// echo, true, false, :
```

---

## Summary

The tool execution system in Claude Code v2.1.7:

1. **Queue-Based Execution** - Tools queued and processed based on concurrency
2. **Streaming Results** - Async generators yield results as available
3. **Progress Tracking** - Real-time progress via callback pattern
4. **Error Propagation** - Single tool error affects all siblings
5. **Context Modifiers** - Tools can update shared context
6. **Abort Support** - Clean cancellation via AbortController
7. **Configurable Concurrency** - Max parallel tools via env var (default: 10)
