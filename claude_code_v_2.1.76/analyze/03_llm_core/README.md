# LLM Core Module (03_llm_core)

> Claude Code v2.1.76 - LLM API integration, message processing, and agent loop execution
>
> **Symbol Validation Status**: ✅ COMPLETE - All symbols cross-validated against source code on 2026-03-26.
> **Integration Status**: ✅ COMPLETE - Cross-module integration documented in [cli_ui_llm_integration.md](../00_overview/cli_ui_llm_integration.md), [cli_ui_llm_deep_integration.md](../00_overview/cli_ui_llm_deep_integration.md), and [cli_ui_llm_complete_joint_analysis.md](../00_overview/cli_ui_llm_complete_joint_analysis.md).
> **Joint Analysis v2**: ✅ NEW - See [cli_ui_llm_joint_complete_v2.md](../00_overview/cli_ui_llm_joint_complete_v2.md) for the latest comprehensive joint analysis with source-level algorithm restoration.
>
> **NEW Joint Analysis Documents (2026-03-26)**:
> - [cli_ui_llm_joint_complete_v8.md](../00_overview/cli_ui_llm_joint_complete_v8.md) - **LATEST v8**: Complete joint analysis with source-level restoration, decision trees, UI interaction patterns, and verified symbols
> - [cli_ui_llm_joint_complete_v7.md](../00_overview/cli_ui_llm_joint_complete_v7.md) - v7: Complete joint analysis with source-level restoration, decision trees, and UI interaction patterns
> - [cli_ui_llm_joint_complete_v5.md](../00_overview/cli_ui_llm_joint_complete_v5.md) - v5: Complete joint analysis with verified symbols, deep algorithms, and feature linkages
> - [algorithms_deep_dive_complete_v2.md](./algorithms_deep_dive_complete_v2.md) - **NEW v2**: Complete algorithm deep dive with decision trees
> - [cross_feature_linkages_complete.md](../00_overview/cross_feature_linkages_complete.md) - **NEW**: Complete cross-feature linkage documentation
> - [cli_ui_llm_joint_analysis_final.md](../00_overview/cli_ui_llm_joint_analysis_final.md) - Final comprehensive joint analysis with source-level restoration
> - [cli_ui_llm_joint_complete_v3.md](../00_overview/cli_ui_llm_joint_complete_v3.md) - Comprehensive joint analysis v3 with source-level restoration
> - [turn_management_complete.md](./turn_management_complete.md) - **NEW**: Complete turn management analysis
> - [cli_ui_llm_ui_interaction_complete_v3.md](../00_overview/cli_ui_llm_ui_interaction_complete_v3.md) - Complete UI interaction analysis v3
> - [cli_ui_llm_algorithm_complete_restoration.md](../00_overview/cli_ui_llm_algorithm_complete_restoration.md) - Source-level algorithm restoration
> - [cli_ui_llm_feature_interaction_matrix.md](../00_overview/cli_ui_llm_feature_interaction_matrix.md) - Cross-feature interactions
>
> **NEW Cross-Module Analysis Documents (2026-03-26)**:
> - [cli_ui_llm_system_reminder_integration.md](../00_overview/cli_ui_llm_system_reminder_integration.md) - **NEW**: Complete System Reminder integration
> - [cli_ui_llm_error_recovery_patterns_v2.md](../00_overview/cli_ui_llm_error_recovery_patterns_v2.md) - **NEW**: Cross-module error handling v2
> - [cli_ui_llm_system_reminder_deep_integration.md](../00_overview/cli_ui_llm_system_reminder_deep_integration.md) - Complete attachment producer catalog

---

## Module Overview

The LLM Core module is the "heart" of Claude Code, responsible for:

1. **Agent Loop Execution** - The main turn-based conversation cycle
2. **LLM API Communication** - Streaming requests to Anthropic API
3. **Message Processing** - Normalization, caching, and transformation
4. **Tool Dispatch** - Coordinating tool execution during streaming
5. **Error Recovery** - Retry logic, context overflow handling, and fallbacks

This module implements the async generator pattern for streaming events back to the UI layer, enabling real-time feedback during LLM interactions.

---

## Documents in This Module

| Document | Description | Key Symbols |
|----------|-------------|-------------|
| [agent_loop.md](./agent_loop.md) | Main agent loop, turn state machine, tool dispatch | `mainAgentLoop` (Yh), `mainAgentLoopCore` (omY), `StreamingToolExecutor` (ui6) |
| [stream_processing.md](./stream_processing.md) | SSE event handling, delta assembly, stall detection | `streamingQueryCore` (mGq), `withApiRetry` (_P1), `mergeUsage` (e51) |
| [implementation.md](./implementation.md) | Core implementation details, request building | `callModel`, `buildApiParams` |
| [algorithms.md](./algorithms.md) | Key algorithms: message normalization, context limits | `normalizeMessages` (cM), token counting |
| [algorithms_detailed.md](./algorithms_detailed.md) | Deep analysis of core algorithms with decision trees | `getInputDialogType` (ra6), `filterToolsByMode` (Xk8), `shouldTriggerAutoCompaction` |
| [llm_request_pipeline.md](./llm_request_pipeline.md) | Request pipeline from agent loop to API | `buildConversationChain`, system prompt assembly |
| [message_normalization.md](./message_normalization.md) | Message format conversion for API | `normalizeMessages` (cM), `flattenMessages` (JM) |
| [system_prompt_building.md](./system_prompt_building.md) | System prompt composition | `buildSystemPromptFromSections`, cache controls |
| [tool_integration.md](./tool_integration.md) | Tool schema building, execution coordination | `toolDispatcher` (Wi6), `executeToolCore` (fxY) |
| [error_recovery.md](./error_recovery.md) | Error handling, retry logic, fallback strategies | `withApiRetry` (_P1), context overflow recovery |
| [thinking_mode_integration.md](./thinking_mode_integration.md) | Extended thinking mode support | `thinkingConfig`, budget tokens |
| [proactive_mode.md](./proactive_mode.md) | Proactive mode (background agent activity) | Proactive controller |
| [reminder_integration.md](./reminder_integration.md) | System reminder attachment during requests | `assembleAllAttachments` |
| [system_reminder_flow.md](./system_reminder_flow.md) | **NEW** - Complete system reminder integration analysis | `assembleAllAttachments` (_uY), `normalizeAttachmentForAPI` (Ui8) |
| [compact_integration.md](./compact_integration.md) | Auto-compact trigger logic | `autoCompactDispatcher` (sqq) |
| [model_selection.md](./model_selection.md) | Model selection and resolution | Model aliases, Bedrock profiles |
| [slash_command_integration.md](./slash_command_integration.md) | Slash command invocation via agent loop | Skill execution |
| [cross_feature_linkages.md](./cross_feature_linkages.md) | Cross-feature integration points | All features |
| [ui_linkage.md](./ui_linkage.md) | UI streaming event handling | `handleStreamedEvent`, state updates |
| **[turn_state_machine.md](./turn_state_machine.md)** | **NEW**: Turn state management, transitions, recovery | `mainAgentLoopCore` (omY), turn state object |
| **[tool_executor_queue.md](./tool_executor_queue.md)** | **NEW**: StreamingToolExecutor analysis, parallel execution | `StreamingToolExecutor` (ui6), sibling abort |
| **[algorithms_deep_dive.md](./algorithms_deep_dive.md)** | **NEW**: Deep analysis of key algorithms with decision trees | `canExecuteTool`, `getAbortReason`, `assembleAllAttachments` |
| **[algorithms_complete_deep_dive.md](./algorithms_complete_deep_dive.md)** | **NEW**: Complete algorithm restoration with source-level pseudocode | `StreamingToolExecutor`, `streamingQueryCore`, turn state machine |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, LLM API, Tools)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Compact, Thinking, Steering)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP, Permissions, Auth)

Key symbols in this module:
- `mainAgentLoop` (Yh) - Main agent loop async generator at chunks.148.mjs:875
- `mainAgentLoopCore` (omY) - Inner implementation at chunks.148.mjs:882
- `StreamingToolExecutor` (ui6) - Parallel tool execution at chunks.148.mjs:3
- `streamingQueryCore` (mGq) - Full SSE implementation at chunks.171.mjs:3
- `callModel` (NT6) - LLM API wrapper at chunks.170.mjs:2009
- `toolDispatcher` (Wi6) - Tool routing at chunks.146.mjs:285
- `normalizeMessages` (cM) - Message conversion at chunks.173.mjs:1999
- `withApiRetry` (_P1) - Retry wrapper at chunks.89.mjs:3
- `getSessionGates` (RKq) - Feature flags at chunks.148.mjs:816
- `getModelCallHelpers` (SKq) - Helper factory at chunks.148.mjs:834

---

## Architecture Overview

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT LOOP (mainAgentLoop/Yh)                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                       Turn Loop (while true)                          │   │
│  │                                                                        │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │   │
│  │  │ Pre-turn    │───►│ LLM Request │───►│ Post-turn   │              │   │
│  │  │ • Compact   │    │ • Streaming │    │ • Tool exec │              │   │
│  │  │ • Attach.   │    │ • SSE events│    │ • Hooks     │              │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘              │   │
│  │                              │                    │                   │   │
│  │                              ▼                    ▼                   │   │
│  │                       yield events         Continue loop?            │   │
│  │                       to UI layer          • Tools called → yes      │   │
│  │                                              • No tools → no          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     STREAMING CORE (streamingQueryCore/mGq)                  │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                       SSE Event Processing                            │   │
│  │                                                                        │   │
│  │  message_start ──────────────────────────► Initialize message state   │   │
│  │  content_block_start ────────────────────► Create block placeholder  │   │
│  │  content_block_delta ────────────────────► Accumulate text/json      │   │
│  │  content_block_stop ─────────────────────► Finalize, yield message   │   │
│  │  message_delta ──────────────────────────► Usage, stop_reason        │   │
│  │  message_stop ───────────────────────────► Complete                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TOOL EXECUTOR (StreamingToolExecutor/ui6)               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    Parallel Tool Execution                            │   │
│  │                                                                        │   │
│  │  • Queue tool_use blocks as they stream in                            │   │
│  │  • Execute concurrency-safe tools in parallel                        │   │
│  │  • Yield results as they complete                                     │   │
│  │  • Handle abort/rollback on sibling errors                            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Complete Request Flow

```
User Message (from UI)
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 1. PRE-TURN PHASE                                                         │
│    • Micro-compact check (remove consecutive duplicates)                 │
│    • Auto-compact check (token threshold exceeded?)                      │
│    • Context limit validation                                            │
│    • Attachment assembly (system reminders)                              │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 2. REQUEST BUILD PHASE                                                    │
│    • Build tool schemas (with deferred loading)                          │
│    • Normalize messages (API format conversion)                          │
│    • Add cache controls to messages                                      │
│    • Assemble system prompt (with MCP instructions)                      │
│    • Construct API params (model, betas, thinking, etc.)                 │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 3. STREAMING PHASE                                                        │
│    • Send streaming request to Anthropic API                             │
│    • Process SSE events in real-time                                     │
│    • Yield events to UI as they arrive                                   │
│    • Accumulate content blocks (text, thinking, tool_use)                │
│    • Track token usage                                                   │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 4. TOOL EXECUTION PHASE                                                   │
│    • Collect tool_use blocks from response                               │
│    • Validate inputs against tool schemas                                │
│    • Execute tools (parallel for concurrency-safe)                       │
│    • Collect tool results                                                │
│    • Run post-tool hooks                                                 │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 5. TURN COMPLETION PHASE                                                  │
│    • If tools were called: Continue to next turn (go to step 1)          │
│    • If no tools: Return final result                                    │
│    • Run stop hooks                                                      │
│    • Update session state                                                │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Key Algorithms

### 1. Turn State Machine

The agent loop maintains a state object across turns:

```javascript
// ============================================
// Turn State Object (J in obfuscated code)
// Location: chunks.148.mjs:882-900
// ============================================

// ORIGINAL (for source lookup):
let J = {
    messages: A.messages,
    toolUseContext: A.toolUseContext,
    maxOutputTokensOverride: A.maxOutputTokensOverride,
    autoCompactTracking: void 0,
    stopHookActive: void 0,
    maxOutputTokensRecoveryCount: 0,
    hasAttemptedReactiveCompact: !1,
    transition: void 0
};

// READABLE (for understanding):
let turnState = {
    messages: params.messages,                    // Conversation history
    toolUseContext: params.toolUseContext,        // Permission/session context
    maxOutputTokensOverride: params.maxOutputTokensOverride,  // Token limit
    autoCompactTracking: undefined,               // Compaction state
    stopHookActive: undefined,                    // Hook control flag
    maxOutputTokensRecoveryCount: 0,              // Retry counter
    hasAttemptedReactiveCompact: false,           // Compact flag
    transition: undefined                         // Mode transition
};

// Mapping: J→turnState, A→params
```

**Why this approach:**
- Single object contains all mutable state for the turn
- Enables clean state transitions and recovery
- Tracks compaction attempts to prevent infinite loops

### 2. StreamingToolExecutor Queue

Parallel tool execution with concurrency safety:

```javascript
// ============================================
// StreamingToolExecutor (ui6) - Tool execution queue
// Location: chunks.148.mjs:3-200
// ============================================

// READABLE (for understanding):
class StreamingToolExecutor {
    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.tools = [];  // Queue of tool executions
        this.toolUseContext = toolUseContext;
        this.hasErrored = false;  // Circuit breaker flag
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
    }

    canExecuteTool(isConcurrencySafe) {
        let executing = this.tools.filter(t => t.status === "executing");
        // Allow if nothing executing, or if all executing tools are concurrency-safe
        return executing.length === 0 ||
               (isConcurrencySafe && executing.every(t => t.isConcurrencySafe));
    }

    async executeTool(toolEntry) {
        toolEntry.status = "executing";

        // Check abort conditions
        let abortReason = this.getAbortReason(toolEntry);
        if (abortReason) {
            toolEntry.results = [this.createSyntheticErrorMessage(toolEntry.id, abortReason)];
            toolEntry.status = "completed";
            return;
        }

        // Create sibling abort controller for isolation
        let siblingAbort = cloneAbortController(this.siblingAbortController);

        // Execute via toolDispatcher
        for await (let event of toolDispatcher(toolEntry.block, toolEntry.assistantMessage,
                                                this.canUseTool, {...this.toolUseContext, abortController: siblingAbort})) {
            // Collect results
            if (event.message) {
                toolEntry.results.push(event.message);
            }
        }

        toolEntry.status = "completed";
    }
}
```

**Why this approach:**
- Parallel execution for concurrency-safe tools (Read, Grep, Glob)
- Sequential execution for non-safe tools (Write, Edit, Bash)
- Sibling abort pattern: one tool failure aborts siblings but not parent

### 3. SSE Event Processing

```javascript
// ============================================
// SSE Event Processing - Core streaming logic
// Location: chunks.171.mjs:100-200
// ============================================

// READABLE (for understanding):
switch (sseEvent.type) {
    case "message_start":
        partialMessage = sseEvent.message;
        usage = mergeUsage(usage, sseEvent.message?.usage);
        break;

    case "content_block_start":
        switch (sseEvent.content_block.type) {
            case "tool_use":
                contentBlocks[sseEvent.index] = {
                    ...sseEvent.content_block,
                    input: ""  // Accumulated via deltas
                };
                break;
            case "text":
                contentBlocks[sseEvent.index] = {
                    ...sseEvent.content_block,
                    text: ""  // Accumulated via deltas
                };
                break;
            case "thinking":
                contentBlocks[sseEvent.index] = {
                    ...sseEvent.content_block,
                    thinking: "",
                    signature: ""
                };
                break;
        }
        break;

    case "content_block_delta":
        let block = contentBlocks[sseEvent.index];
        switch (sseEvent.delta.type) {
            case "text_delta":
                block.text += sseEvent.delta.text;
                break;
            case "input_json_delta":
                block.input += sseEvent.delta.partial_json;
                break;
            case "thinking_delta":
                block.thinking += sseEvent.delta.thinking;
                break;
            case "signature_delta":
                block.signature = sseEvent.delta.signature;
                break;
        }
        break;

    case "content_block_stop":
        let completedBlock = contentBlocks[sseEvent.index];
        // Yield complete message to UI
        yield {
            message: {
                ...partialMessage,
                content: [completedBlock]
            },
            type: "assistant",
            uuid: generateUUID()
        };
        break;

    case "message_delta":
        usage = mergeUsage(usage, sseEvent.usage);
        stopReason = sseEvent.delta.stop_reason;
        if (stopReason === "max_tokens") {
            yield createMaxTokensError();
        }
        break;
}

// Always yield raw event for UI state updates
yield { type: "stream_event", event: sseEvent };
```

**Why this approach:**
- Incremental accumulation: content built via delta events
- Immediate yielding: UI receives events in real-time
- Complete messages: Only yielded on content_block_stop for efficient rendering

---

## Integration Points

### With CLI Module (01_cli)

The CLI module initializes the agent loop with session context:

```
CLI Flags → initialState → createStateStore → SessionOrchestrator
                                                │
                                                ▼
                              mainAgentLoop({messages, systemPrompt, toolUseContext, ...})
```

**Key integration points:**
- `--model` flag sets model for session
- `--print` enables non-interactive mode (maxTurns)
- `--dangerously-skip-permissions` sets permission mode
- `--resume` loads previous session messages

See: [01_cli/ui_linkage.md](../01_cli/ui_linkage.md)

### With UI Module (02_ui)

The UI receives streaming events and updates React state:

```
mainAgentLoop yields event
        │
        ▼
for await (event of mainAgentLoop(...)) {
    handleStreamedEvent(event);
}
        │
        ▼
processStreamEvent(event)
        │
        ├── type: "assistant" → setMessages([...prev, event])
        ├── type: "user" → setMessages([...prev, event])
        ├── type: "tombstone" → setMessages(prev => filter(...))
        └── type: "stream_event" → setStreamMode(...)
```

See: [ui_linkage.md](./ui_linkage.md), [02_ui/streaming_ui.md](../02_ui/streaming_ui.md)

### With System Reminder (04_system_reminder)

System reminders are injected as attachments before each LLM request:

```
mainAgentLoop (pre-turn)
        │
        ▼
assembleAllAttachments(sessionState)
        │
        ├── Plan mode attachment
        ├── Token usage attachment
        ├── Todo list attachment
        └── Team context attachment
        │
        ▼
normalizeAttachmentForAPI(attachment)
        │
        ▼
Injected as user message with isMeta: true
```

See: [reminder_integration.md](./reminder_integration.md)

### With Compact Module (07_compact)

Auto-compact triggers when token threshold exceeded:

```
mainAgentLoop (turn start)
        │
        ▼
shouldTriggerAutoCompaction(messages, model)
        │
        ├── Check: tokenCount >= threshold
        ├── Check: consecutiveFailures < 3
        └── Check: !DISABLE_AUTO_COMPACT
        │
        ▼
autoCompactDispatcher(messages, sessionContext)
        │
        ├── Summarize old messages
        ├── Create summary message
        └── Replace old messages with summary
        │
        ▼
Continue with compacted context
```

See: [compact_integration.md](./compact_integration.md)

### With Hooks Module (11_hooks)

Hooks execute at various lifecycle points:

```
Tool Execution:
        │
        ├── PreToolUse hooks → Can block/modify
        │
        ▼
    Tool executes
        │
        ├── PostToolUse hooks → Can modify result
        │
        ▼
    Tool result returned

Turn Completion:
        │
        ▼
    Stop hooks execute
```

See: [tool_integration.md](./tool_integration.md)

### With MCP Module (06_mcp)

MCP tools are discovered and executed:

```
MCP Client Startup
        │
        ▼
Discover tools from MCP servers
        │
        ▼
Add to toolDefinitions (prefixed with mcp__)
        │
        ▼
toolDispatcher handles MCP tool routing
```

---

## Source Code Locations

| Component | Source File | Key Functions |
|-----------|-------------|---------------|
| Agent Loop | chunks.148.mjs | `mainAgentLoop` (Yh), `mainAgentLoopCore` (omY), `StreamingToolExecutor` (ui6) |
| Streaming | chunks.171.mjs | `streamingQueryCore` (mGq), SSE processing |
| Tool Dispatch | chunks.146.mjs | `toolDispatcher` (Wi6), `executeToolCore` (fxY) |
| Message Normalization | chunks.173.mjs | `normalizeMessages` (cM), `flattenMessages` (JM) |
| System Prompt | chunks.168.mjs, chunks.170.mjs | `buildSystemPromptFromSections`, cache controls |
| Retry Logic | chunks.89.mjs | `withApiRetry` (_P1), context overflow handling |
| State Store | chunks.85.mjs | `createStateStore` (WX1) |
| Tool Schemas | chunks.170.mjs | `buildToolSchema` (Sh1) |

---

## Cross-References

- **CLI Module** (01_cli/) - Entry points, argument parsing, mode detection
- **UI Module** (02_ui/) - Terminal rendering, user interaction, state management
- **Tools Module** (05_tools/) - Tool definitions, execution, permissions
- **Compact Module** (07_compact/) - Context summarization
- **Hooks Module** (11_hooks/) - Lifecycle hooks
- **MCP Module** (06_mcp/) - External tool integration
- **System Reminder** (04_system_reminder/) - Attachment production

---

## Performance Considerations

### Streaming Latency
- Events yielded immediately upon arrival from API
- No batching of SSE events
- UI uses `useDeferredValue` for message rendering

### Token Efficiency
- Deferred tool loading: only include tools referenced in conversation
- Prompt caching: system prompt and repeated user messages cached
- Message normalization: removes unnecessary metadata

### Error Recovery
- Automatic retry on transient failures
- Context overflow triggers compact, then retry with smaller context
- Circuit breaker for consecutive compact failures (max 3)

---

**Last Updated**: 2026-03-26
**Version**: Claude Code 2.1.76
**Status**: Complete - All LLM Core functionality documented with source verification

### Joint Analysis Documents

- **[cli_ui_llm_joint_analysis.md](../00_overview/cli_ui_llm_joint_analysis.md)** - Complete CLI-UI-LLM integration analysis
- **[algorithm_deep_dive.md](../00_overview/algorithm_deep_dive.md)** - Key algorithms: StreamingToolExecutor, auto-compact
- **[feature_interaction_matrix.md](../00_overview/feature_interaction_matrix.md)** - Cross-module feature interactions