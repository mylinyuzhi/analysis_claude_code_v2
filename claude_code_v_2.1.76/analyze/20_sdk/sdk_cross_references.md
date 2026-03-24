# SDK Cross-References

## Overview

This document provides cross-references between the SDK module and related modules, documenting how features behave differently in SDK mode versus interactive CLI mode. Understanding these differences is essential for building robust SDK integrations.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tool execution symbols
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Feature symbols
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - SDK mode detection

Key concepts in this document:
- `isNonInteractive` (q7) - Core SDK mode check (global state)
- `isNonInteractiveSession` (DY4) - Session context SDK mode check
- Tool behavior variations by mode
- System reminder generation differences
- Compact integration with SDK

---

## Tools Behavior in SDK Mode

### Overview

The `isNonInteractive` flag (q7) fundamentally changes how tools behave. This section documents the specific differences for each tool category.

### File Operation Tools

| Tool | Interactive Mode | SDK Mode |
|------|------------------|----------|
| **Read** | Shows progress spinner | Streams `stream_event` for each file |
| **Write** | Prompts for confirmation | Uses permission flow (control_request or MCP tool) |
| **Edit** | Interactive preview diff | Sends diff as `tool_result` event |
| **Glob** | Paginated results | Returns all results at once |
| **Grep** | Highlighted matches | Plain text results with line numbers |

### Execution Tools

| Tool | Interactive Mode | SDK Mode |
|------|------------------|----------|
| **Bash** | Real-time output streaming | Output buffered and sent as events |
| **Agent** | Subagent spawns in same terminal | Subagent runs with same SDK session |
| **TaskOutput** | Real-time task monitoring | Events for task state changes |

### Network Tools

| Tool | Interactive Mode | SDK Mode |
|------|------------------|----------|
| **WebFetch** | Progress indicator | Returns content directly |
| **WebSearch** | Displays results list | Returns structured search results |

### Permission-Affected Tool Behavior

**What changes in SDK mode:**

1. **No interactive prompts:** All permission requests go through `control_request` or MCP tool
2. **Timeout handling:** Controlled via `abortSignal` instead of Ctrl+C
3. **Error messages:** Machine-parseable format instead of user-friendly hints
4. **Progress reporting:** Streamed as events instead of terminal spinners

```javascript
// ============================================
// Tool execution path selection based on mode
// Location: chunks.179.mjs (tool execution dispatcher)
// ============================================

// Interactive mode:
if (!isNonInteractive()) {
    // Show progress spinner
    // Allow Ctrl+C cancellation
    // Display user-friendly errors
}

// SDK mode:
if (isNonInteractive()) {
    // Stream events for progress
    // Use abortSignal for cancellation
    // Return machine-parseable errors
    // Route permissions through control channel
}
```

---

## System Reminders in SDK Mode

### Overview

System reminders (attachments) are generated differently in SDK mode. Some attachments are omitted, while others have modified behavior. Understanding these differences is crucial for SDK clients that need to properly reconstruct conversation state.

**Critical insight:** The `isNonInteractive` (q7) check affects individual attachment producers, while the `isMainAgent` check (`!sessionContext.agentId`) determines whether Group 3 producers run at all. These two checks create a matrix of behaviors.

### Attachment Generation Architecture

The system reminder module has three layers. The core function is `_uY` (`assembleAllAttachments`) at `chunks.147.mjs:3-18`:

```javascript
// ============================================
// assembleAllAttachments - Core attachment orchestration
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = { ...q, abortController: w },
        H = !q.agentId,  // isMainAgent flag
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), ...] : [],  // Group 1
        J = await Promise.all(j),
        M = [Hz("changed_files", ...), Hz("plan_mode", ...), ...],       // Group 2
        D = H ? [Hz("ide_selection", ...), Hz("diagnostics", ...), ...] : [],  // Group 3
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return [...J.flat(), ...X.flat(), ...P.flat()].filter(...)
}

// READABLE (for understanding):
async function assembleAllAttachments(userMessage, sessionContext, ideContext, queuedCommands, messages, memoryType) {
    // Early exit if attachments disabled
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // 1-second timeout for entire attachment production
    let abortController = new AbortController();
    let timeout = setTimeout((c) => c.abort(), 1000, abortController);

    // Augment context with abort controller
    let context = { ...sessionContext, abortController };

    // KEY CHECK: isMainAgent = !agentId
    // If running as subagent, Group 3 is skipped entirely
    let isMainAgent = !sessionContext.agentId;

    // GROUP 1: User-dependent (only if userMessage exists)
    let group1 = userMessage ? [
        timedAttachmentProducer("at_mentioned_files", () => getAtMentionedFiles(userMessage, context)),
        timedAttachmentProducer("mcp_resources", () => getMcpResources(userMessage, context)),
        timedAttachmentProducer("agent_mentions", () => getAgentMentions(userMessage, context.options.agentDefinitions.activeAgents))
    ] : [];
    let group1Results = await Promise.all(group1);

    // GROUP 2: Always computed (runs for all sessions)
    let group2 = [
        timedAttachmentProducer("changed_files", () => getChangedFilesAttachment(context)),
        timedAttachmentProducer("nested_memory", () => getNestedMemoryAttachment(context)),
        timedAttachmentProducer("plan_mode", () => getPlanModeAttachment(messages, context)),
        timedAttachmentProducer("todo_reminders", () => getTodoReminders(messages, context)),
        // ... 14+ producers total
    ];

    // GROUP 3: Main-agent-only (SKIPPED if subagent)
    let group3 = isMainAgent ? [
        timedAttachmentProducer("ide_selection", () => getIDESelectionAttachment(ideContext, context)),
        timedAttachmentProducer("diagnostics", () => getDiagnosticsAttachment(context)),
        timedAttachmentProducer("token_usage", () => getTokenUsageAttachment(messages ?? [], context)),
        timedAttachmentProducer("queued_commands", () => getQueuedCommandsAttachment(queuedCommands))
        // ... 11 producers total
    ] : [];

    // Execute Group 2 and Group 3 in parallel
    let [group2Results, group3Results] = await Promise.all([
        Promise.all(group2),
        Promise.all(group3)
    ]);

    clearTimeout(timeout);

    return [...group1Results.flat(), ...group2Results.flat(), ...group3Results.flat()]
        .filter((item) => item !== undefined && item !== null);
}

// Mapping: _uY→assembleAllAttachments, A→userMessage, q→sessionContext, K→ideContext,
//          Y→queuedCommands, z→messages, _→memoryType, H→isMainAgent, j→group1, M→group2, D→group3
```

**Key architectural decisions:**

1. **Timeout protection:** 1-second timeout prevents attachment production from blocking the main loop
2. **Group 1 sequential:** Must complete before Groups 2/3 because @-mentions may load files needed later
3. **Groups 2/3 parallel:** Independent producers can run concurrently
4. **isMainAgent check:** Simple boolean (`!agentId`) - if truthy, subagent skips Group 3

```
LAYER 1: ATTACHMENT PRODUCTION (_uY - assembleAllAttachments)
    │
    ├── Group 1: User-Dependent (Sequential)
    │     ├── at_mentioned_files (RuY) - File @-mentions
    │     ├── mcp_resources (SuY) - MCP server resources
    │     └── agent_mentions (huY) - Agent @-mentions
    │     [Await completion before Group 2/3]
    │
    ├── Group 2: Always-Computed (Parallel with Group 3)
    │     ├── changed_files (CuY) - Git diff state
    │     ├── plan_mode (DuY) - Plan mode instructions
    │     ├── todo_reminders (ruY) - Todo list state
    │     └── ... (14+ producers total)
    │
    └── Group 3: Main-Agent-Only (Skipped if subagent or SDK mode)
          ├── ide_selection (kuY) - IDE cursor/selection
          ├── diagnostics (cuY/luY) - LSP diagnostics
          ├── token_usage (qmY) - Token budget status
          └── queued_commands (OuY) - Hook/system commands
          ↓
LAYER 2: ATTACHMENT NORMALIZATION (Ui8 - normalizeAttachmentForAPI)
    │
    └── Converts 57+ attachment types → formatted messages
          ↓
LAYER 3: MESSAGE STREAM INJECTION
    │
    └── Inserted before user messages in API calls
```

### Attachment Generation Differences

| Attachment Type | Interactive Mode | SDK Mode | Reason |
|-----------------|------------------|----------|--------|
| **File @-mentions** | Reads files on-demand | Same, but streamed as events | Content is still needed for LLM |
| **MCP resources** | Loaded from local servers | Routed through SDK MCP channel | Different transport path |
| **Agent mentions** | Spawns agent in terminal | Uses SDK Agent tool | Different execution context |
| **Changed files** | Git diff displayed inline | Included as structured data | No terminal display |
| **Todo reminders** | Periodic UI updates | Sent as `system` messages | No UI to update |
| **IDE selection** | Real-time from IDE | Must be provided via input | No IDE connection |
| **Diagnostics** | LSP queries on-demand | Cached or provided by SDK client | No LSP server access |
| **Token usage** | Displayed in UI | Sent as `system.status` event | No UI display |

### Key Producer Behavior in SDK Mode

#### IDE Selection Attachment (kuY)

**What changes:** In SDK mode, there is no IDE connection to query for cursor position or selected text. The attachment producer returns `null` unless the SDK client provides this data.

```javascript
// ============================================
// IDE selection producer - SDK mode behavior
// Location: chunks.147.mjs (attachment producers)
// ============================================

// Interactive mode: Queries IDE via MCP for selection
// SDK mode: Returns null unless provided in input

async function getIDESelectionAttachment(sessionContext) {
    if (isNonInteractive()) {
        // In SDK mode, IDE selection must be provided by the client
        // via the input message or control request
        return sessionContext.providedIDESelection || null;
    }
    // Interactive mode: Query IDE for current selection
    return await queryIDESelection();
}
```

#### Diagnostics Attachment (cuY/luY)

**What changes:** In SDK mode, LSP diagnostics are not available because there's no LSP server connection. The SDK client must provide diagnostics if needed.

```javascript
// ============================================
// Diagnostics producer - SDK mode behavior
// Location: chunks.147.mjs (attachment producers)
// ============================================

// Interactive mode: Queries LSP server for diagnostics
// SDK mode: Uses cached diagnostics or client-provided data

async function getDiagnosticsAttachment(sessionContext) {
    if (isNonInteractive()) {
        // Return cached diagnostics or client-provided data
        return sessionContext.cachedDiagnostics || null;
    }
    // Interactive mode: Query LSP servers
    return await queryLSPDiagnostics();
}
```

### queued_command Attachment Handling

**What it does:** In SDK mode, queued commands (from hooks or system) are attached to messages differently than in interactive mode.

```javascript
// ============================================
// queued_command attachment in SDK mode
// Location: chunks.147.mjs (OuY producer)
// ============================================

// Interactive mode: Queued commands trigger immediate execution
// SDK mode: Queued commands are attached to next user message

function getQueuedCommandsAttachment(sessionContext) {
    let queuedCommands = sessionContext.getQueuedCommands();
    if (queuedCommands.length === 0) return null;

    return {
        type: "queued_commands",
        commands: queuedCommands.map(cmd => ({
            type: cmd.type,
            data: cmd.data
        }))
    };
}
```

### System Reminder Streaming

In SDK mode, system reminders are streamed as part of the message flow:

```javascript
// System reminder event structure
{
    "type": "system",
    "subtype": "reminder",
    "content": "Todo list has changed...",
    "level": "info",
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

### Token Budget Status in SDK Mode

The token usage attachment becomes a streaming event rather than a UI element:

```javascript
// Interactive mode: Token budget shown in UI status bar
// SDK mode: Sent as system.status event

{
    "type": "system",
    "subtype": "status",
    "status": {
        "token_usage": {
            "used": 45000,
            "limit": 200000,
            "percentage": 22.5
        }
    },
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

### MCP Integration Differences

| Aspect | Interactive Mode | SDK Mode |
|--------|------------------|----------|
| Server discovery | Local file-based config | Via SDK control channel |
| Tool execution | Direct server process | Routed through `sendMcpMessage` |
| Resource access | Local file paths | Virtual paths through SDK |
| Permission prompts | Terminal UI | `control_request` to SDK client |

```javascript
// ============================================
// MCP tool execution in SDK mode
// Location: chunks.169.mjs (oi8 - SdkMcpTransport)
// ============================================

// Interactive mode: Direct MCP server communication
// SDK mode: Routed through sendMcpMessage control channel

class SdkMcpTransport {
    serverName;
    sendMcpMessage;
    isClosed = false;

    async send(message) {
        if (this.isClosed) throw Error("Transport is closed");
        // Send through SDK control channel
        let response = await this.sendMcpMessage(this.serverName, message);
        if (this.onmessage) this.onmessage(response);
    }
}
```

---

## Compact Integration with SDK

### Overview

The compact feature integrates with SDK through the `setSDKStatus` mechanism, allowing the SDK client to be notified when compaction is in progress.

### setSDKStatus Mechanism

**What it does:** Signals the current session status to the SDK client. Used primarily during compaction to prevent race conditions.

**How it works:**
1. Before compaction: `setSDKStatus("compacting")`
2. SDK client receives status change event
3. Compaction progress events are streamed
4. After compaction: `setSDKStatus(null)`

```javascript
// ============================================
// setSDKStatus during compaction
// Location: chunks.146.mjs, chunks.185.mjs
// ============================================

// Status change event sent to SDK client:
{
    "type": "system",
    "subtype": "status_change",
    "status": "compacting",
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}

// Compact progress events:
{ "type": "stream_event", "event": { "type": "hooks_start", "hookType": "pre_compact" } }
{ "type": "stream_event", "event": { "type": "compact_start" } }
{ "type": "stream_event", "event": { "type": "compact_progress", "phase": "summarizing", "progress": 0.5 } }
{ "type": "stream_event", "event": { "type": "compact_end" } }

// Status cleared:
{
    "type": "system",
    "subtype": "status_change",
    "status": null,
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

### DISABLE_COMPACT Environment Variable

The SDK can disable compaction entirely:

```bash
# Disable all compaction
CLAUDE_CODE_ENTRYPOINT=sdk-ts DISABLE_COMPACT=1 claude --print

# Or in Node.js:
process.env.DISABLE_COMPACT = "1";
```

### Compact Behavior Differences

| Aspect | Interactive Mode | SDK Mode |
|--------|------------------|----------|
| Trigger | Token threshold | Token threshold (same) |
| Confirmation | User prompted | Automatic |
| Notification | UI spinner | `setSDKStatus("compacting")` |
| Progress | Terminal animation | Streamed events |
| Disable | Settings | `DISABLE_COMPACT=1` env var |

---

## Slash Commands in SDK Mode

### Overview

Slash commands behave differently in SDK mode. Some commands are unavailable, while others have modified behavior.

### Command Availability

| Command | Interactive Mode | SDK Mode | Notes |
|---------|------------------|----------|-------|
| `/help` | Available | Available | Lists available commands |
| `/clear` | Clears screen | Clears conversation | Sends `conversation_cleared` event |
| `/compact` | Manual compaction | Automatic only | Manual `/compact` returns error |
| `/model` | Interactive selection | Via `set_model` control | Use control request instead |
| `/doctor` | Runs diagnostics | Returns diagnostic results | Results sent as events |
| `/bug` | Opens GitHub issue | Returns bug report | Structured output |
| `/review-pr` | Interactive review | Via control requests | Permission prompts routed through SDK |
| `/config` | Opens editor | Returns config JSON | Read-only in SDK |

### /compact Behavior

**Why manual /compact is unavailable:** In SDK mode, compaction is fully automatic. The `DISABLE_COMPACT` environment variable can disable it entirely, but there's no manual trigger.

```javascript
// If user tries /compact in SDK mode:
{
    "type": "system",
    "subtype": "error",
    "content": "/compact is not available in SDK mode. Compaction is automatic.",
    "session_id": "<uuid>"
}
```

### /clear Behavior

In SDK mode, `/clear` sends a structured event instead of clearing the terminal:

```javascript
// Clear event in SDK mode
{
    "type": "system",
    "subtype": "conversation_cleared",
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}

// Client should clear its conversation state
```

### /model Behavior

Instead of interactive selection, use the `set_model` control request:

```javascript
// Interactive mode: /model shows menu
// SDK mode: Use control request
{
    "type": "control_request",
    "request": {
        "subtype": "set_model",
        "model": "claude-sonnet-4-6"
    }
}
```

---

## Summary: SDK Mode Differences

```
SDK Mode Detection (isNonInteractive = true)
    │
    ├── Tool Execution
    │   ├── Permissions via control_request or MCP tool
    │   ├── No interactive prompts
    │   ├── Events streamed instead of displayed
    │   └── Error messages in machine-parseable format
    │
    ├── System Reminders
    │   ├── Some attachments omitted (IDE selection, real-time diagnostics)
    │   ├── Reminders streamed as system messages
    │   └── Queued commands attached to messages
    │
    ├── Compact
    │   ├── Automatic trigger only
    │   ├── setSDKStatus("compacting") notification
    │   ├── Progress streamed as events
    │   └── Can be disabled via DISABLE_COMPACT=1
    │
    └── Slash Commands
        ├── Some commands unavailable (/compact manual)
        ├── /clear sends event instead of terminal clear
        ├── /model via control request instead of menu
        └── Other commands return structured output
```

---

## Cross-References

- **Tool Execution**: See [05_tools/](../05_tools/) for tool implementation details
- **System Reminders**: See [04_system_reminder/](../04_system_reminder/) for attachment generation
- **Compact Feature**: See [07_compact/](../07_compact/) for compaction implementation
- **Slash Commands**: See [09_slash_command/](../09_slash_command/) for command definitions
- **SDK Overview**: See [overview.md](./overview.md) for SDK architecture
- **Streaming Protocol**: See [streaming_protocol.md](./streaming_protocol.md) for message formats

---

## Detailed Attachment Producer Cross-Reference

### Relationship: SDK Mode and Attachment Group Filtering

The attachment production system in `chunks.147.mjs` uses a three-group architecture that affects SDK mode differently:

```
Group 1: User-Dependent (Sequential)
├── at_mentioned_files (RuY)  → Same in SDK mode, content needed for LLM
├── mcp_resources (SuY)       → Routed through SDK MCP channel
└── agent_mentions (huY)      → Uses SDK Agent tool instead of terminal spawn

Group 2: Always-Computed (Parallel)
├── changed_files (CuY)       → Structured data instead of terminal display
├── nested_memory (IuY)       → Same in SDK mode
├── plan_mode (DuY)           → Same in SDK mode
├── todo_reminders (ruY)      → Sent as system messages, not UI updates
├── skill_listing (guY)       → Same in SDK mode
├── team_context (AmY)        → Same in SDK mode (if team mode)
├── session_name              → Same in SDK mode (v2.1.76)
└── post_compact              → Same in SDK mode (v2.1.76)

Group 3: Main-Agent-Only (Skipped in SDK mode for some producers)
├── ide_selection (kuY)       → NULL in SDK mode (no IDE connection)
├── diagnostics (cuY/luY)     → Cached or client-provided in SDK mode
├── token_usage (qmY)         → Sent as system.status event in SDK mode
├── queued_commands (OuY)     → Attached to next message in SDK mode
├── ide_opened_file           → NULL in SDK mode
├── output_style              → Same in SDK mode
├── unified_tasks             → Same in SDK mode
├── async_hook_responses      → Same in SDK mode
├── budget_usd                → Same in SDK mode
└── verify_plan_reminder      → Same in SDK mode
```

### Key Insight: Subagent vs SDK Mode Overlap

**Critical relationship:** Group 3 producers are skipped when `!isMainAgent` (i.e., in subagent mode). However, in SDK mode:

1. **IDE-related producers return NULL** because there's no IDE connection
2. **Diagnostics use cached data** because there's no LSP server
3. **Token usage is streamed as events** instead of being attached

This overlap means:
- SDK mode with `agentId` set acts like a subagent (skips Group 3 entirely)
- SDK mode without `agentId` runs Group 3 but with degraded functionality

### Attachment Producer Symbols Reference

For detailed analysis of each producer, see:
- [04_system_reminder/overview.md](../04_system_reminder/overview.md) - Layer architecture
- [04_system_reminder/producers.md](../04_system_reminder/producers.md) - Individual producer analysis

**Verified Symbol Locations (chunks.147.mjs):**

| Producer | Symbol | Location | SDK Mode Behavior |
|----------|--------|----------|-------------------|
| `assembleAllAttachments` | _uY | chunks.147.mjs:3 | Main entry point; orchestrates three-group architecture |
| `queued_commands` | OuY | chunks.147.mjs:48 | Attached to next message |
| `plan_mode` | DuY | chunks.147.mjs:136 | Same as interactive |
| `ide_selection` | kuY | chunks.147.mjs:306 | Returns NULL (no IDE) |
| `at_mentioned_files` | RuY | chunks.147.mjs:407 | Reads files, streams as events |
| `agent_mentions` | huY | chunks.147.mjs:450 | Uses SDK Agent tool |
| `mcp_resources` | SuY | chunks.147.mjs:464 | Routes through SDK MCP channel |
| `changed_files` | CuY | chunks.147.mjs:497 | Structured data output |
| `nested_memory` | IuY | chunks.147.mjs:541 | Same as interactive |
| `skill_listing` | guY | chunks.147.mjs:700 | Same as interactive |
| `todo_reminders` | ruY | chunks.147.mjs:972 | Sent as system messages |
| `team_context` | AmY | chunks.147.mjs:1089 | Same as interactive |
| `token_usage` | qmY | chunks.147.mjs:1108 | Sent as system.status event |

### Cross-Reference: isNonInteractive Check Locations

The `isNonInteractive` (q7) flag is checked in 30+ locations. Key locations affecting attachments:

| File | Line Range | Behavior Change |
|------|------------|-----------------|
| chunks.147.mjs | 150-160 | IDE selection returns NULL |
| chunks.147.mjs | 175-185 | Diagnostics uses cache |
| chunks.173.mjs | 2200+ | Token usage → system.status |
| chunks.179.mjs | 500+ | Permission flow routing |
| chunks.185.mjs | 120+ | Compact status notification |
| chunks.1.mjs | 2720 | isNonInteractive definition (`return !v1.isInteractive`) |

---

## Tool Execution Cross-Reference

### Permission Flow Routing

The permission handling fundamentally differs between modes:

```
INTERACTIVE MODE:
Tool Request → Terminal UI Prompt → Keyboard Input → Response

SDK MODE:
Tool Request → control_request Message → SDK Client Response → control_response
```

### Permission Tool Flow (Detailed)

```javascript
// ============================================
// Permission flow decision tree
// Location: chunks.179.mjs (permission dispatcher)
// ============================================

async function requestPermission(permissionRequest) {
    // Branch 1: Interactive mode with terminal
    if (!isNonInteractive()) {
        return await showTerminalPrompt(permissionRequest);
    }

    // Branch 2: SDK mode with MCP tool capability
    if (hasMcpPermissionTool()) {
        return await sendMcpToolRequest(permissionRequest);
    }

    // Branch 3: SDK mode with control_request
    return await sendControlRequest({
        type: "control_request",
        request_id: generateUUID(),
        request: {
            subtype: "can_use_tool",
            tool_name: permissionRequest.toolName,
            input: permissionRequest.input,
            tool_use_id: permissionRequest.toolUseId
        }
    });
}
```

### Tool-Specific SDK Behavior

| Tool | Interactive | SDK Mode | Permission Path |
|------|-------------|----------|-----------------|
| Bash | Terminal preview | `tool_result` event | control_request |
| Read | Spinner | `stream_event` | None (auto-allow) |
| Write | Confirmation dialog | control_request | Required |
| Edit | Diff preview | `tool_result` with diff | Required |
| Agent | Subprocess spawn | Same SDK session | Inherited |
| WebFetch | Progress indicator | Direct return | None |

---

## Compact Feature Cross-Reference

### setSDKStatus Integration

The compact feature uses `setSDKStatus` to notify SDK clients:

```javascript
// ============================================
// setSDKStatus during compaction
// Location: chunks.146.mjs (compact orchestration)
// ============================================

// Before compaction starts:
setSDKStatus("compacting");

// During compaction:
yield { type: "stream_event", event: { type: "compact_start" } };
yield { type: "stream_event", event: { type: "compact_progress", phase: "summarizing", progress: 0.5 } };
yield { type: "stream_event", event: { type: "compact_end" } };

// After compaction:
setSDKStatus(null);
```

### DISABLE_COMPACT Environment Variable

SDK clients can disable automatic compaction:

```javascript
// Check at compaction entry point
if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false };
}
```

### Compact Event Sequence (SDK Mode)

```javascript
// Complete event sequence during compaction in SDK mode
{ "type": "system", "subtype": "status_change", "status": "compacting" }
{ "type": "stream_event", "event": { "type": "hooks_start", "hookType": "pre_compact" } }
{ "type": "stream_event", "event": { "type": "compact_start" } }
{ "type": "stream_event", "event": { "type": "compact_progress", "phase": "analyzing", "progress": 0.1 } }
{ "type": "stream_event", "event": { "type": "compact_progress", "phase": "summarizing", "progress": 0.5 } }
{ "type": "stream_event", "event": { "type": "compact_progress", "phase": "rebuilding", "progress": 0.9 } }
{ "type": "stream_event", "event": { "type": "compact_end" } }
{ "type": "stream_event", "event": { "type": "hooks_end", "hookType": "pre_compact" } }
{ "type": "system", "subtype": "status_change", "status": null }
```

---

## MCP Integration Cross-Reference

### SdkMcpTransport Architecture

```javascript
// ============================================
// SdkMcpTransport - MCP routing in SDK mode
// Location: chunks.169.mjs:1506-1527
// ============================================

class oi8 {  // SdkMcpTransport
    serverName;
    sendMcpMessage;
    isClosed = false;

    async send(message) {
        if (this.isClosed) throw Error("Transport is closed");
        // Route through SDK control channel instead of direct server process
        let response = await this.sendMcpMessage(this.serverName, message);
        if (this.onmessage) this.onmessage(response);
    }

    close() {
        this.isClosed = true;
    }
}
```

### MCP Server Registration in SDK Mode

```javascript
// SDK client provides MCP servers via initialize request
{
    "type": "user",
    "content": "...",
    "sdkMcpServers": [
        { "name": "filesystem", "config": { "path": "/workspace" } },
        { "name": "github", "config": { "token": "..." } }
    ]
}

// SDK creates SdkMcpTransport for each server
for (const server of sdkMcpServers) {
    const transport = new SdkMcpTransport(server.name, sendMcpMessage);
    await mcpClient.connect(transport);
}
```

---

## Hook System Cross-Reference

### Hook Callback Differences

| Hook Type | Interactive Mode | SDK Mode |
|-----------|-----------------|----------|
| PreToolUse | Terminal preview | `stream_event` |
| PostToolUse | Terminal output | `tool_result` event |
| Notification | Toast message | `system` event |
| Stop | Terminal prompt | control_request |

### Hook Event Streaming (SDK Mode)

```javascript
// Hook start
{ "type": "system", "subtype": "hook_started", "hook_id": "...", "hook_name": "pre_tool_use" }

// Hook progress (real-time stdout/stderr)
{ "type": "system", "subtype": "hook_progress", "stdout": "...", "stderr": "..." }

// Hook complete
{ "type": "system", "subtype": "hook_response", "outcome": "allow", "reason": "..." }
```

---

## Detailed System Reminder Integration

### isNonInteractive Check in Attachment Producers

The `isNonInteractive` (q7) flag fundamentally changes how system reminder attachments are produced. Here's the source-level analysis of key producer behaviors:

```javascript
// ============================================
// isNonInteractive - Core SDK mode check
// Location: chunks.1.mjs:2720-2722
// ============================================

// ORIGINAL (for source lookup):
function q7() {
    return !v1.isInteractive
}

// READABLE (for understanding):
function isNonInteractive() {
    return !globalState.isInteractive;
}

// Mapping: q7→isNonInteractive, v1→globalState
```

### assembleAllAttachments (_uY) — Complete Source Analysis

The `assembleAllAttachments` function is the main orchestrator for system reminder attachment production. Here's the complete source-level analysis:

```javascript
// ============================================
// assembleAllAttachments - Three-group attachment orchestrator
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let w = sK(),
        O = setTimeout((W) => W.abort(), 1000, w),
        $ = {
            ...q,
            abortController: w
        },
        H = !q.agentId,
        j = A ? [Hz("at_mentioned_files", () => RuY(A, $)), Hz("mcp_resources", () => SuY(A, $)), Hz("agent_mentions", () => Promise.resolve(huY(A, q.options.agentDefinitions.activeAgents))), ...[]] : [],
        J = await Promise.all(j),
        M = [Hz("date_change", () => Promise.resolve(fuY())), Hz("ultrathink_effort", () => Promise.resolve(TuY(A))), Hz("deferred_tools_delta", () => Promise.resolve(xE1(q.options.tools, q.options.mainLoopModel, z))), Hz("mcp_instructions_delta", () => Promise.resolve(uE1(q.options.mcpClients, q.options.tools, q.options.mainLoopModel, z))), Hz("changed_files", () => CuY($)), Hz("nested_memory", () => IuY($)), Hz("dynamic_skill", () => BuY($)), Hz("skill_listing", () => guY($)), Hz("ultra_claude_md", async () => VuY(z)), Hz("plan_mode", () => DuY(z, q)), Hz("plan_mode_exit", () => XuY(q)), Hz("auto_mode", () => ZuY(z, q)), Hz("auto_mode_exit", () => GuY(q)), Hz("todo_reminders", () => r$() ? auY(z, q) : ruY(z, q)), ...E7() ? [..._ === "session_memory" ? [] : [Hz("teammate_mailbox", async () => euY(q))], Hz("team_context", async () => AmY(z ?? []))] : [], Hz("agent_pending_messages", async () => $uY(q)), Hz("critical_system_reminder", () => Promise.resolve(vuY(q)))],
        D = H ? [Hz("ide_selection", async () => kuY(K, q)), Hz("ide_opened_file", async () => LuY(K, q)), Hz("output_style", async () => Promise.resolve(NuY())), Hz("diagnostics", async () => cuY(q)), Hz("lsp_diagnostics", async () => luY(q)), Hz("unified_tasks", async () => suY(q)), Hz("async_hook_responses", async () => tuY()), Hz("token_usage", async () => Promise.resolve(qmY(z ?? [], q.options.mainLoopModel))), Hz("budget_usd", async () => Promise.resolve(YmY(q.options.maxBudgetUsd))), Hz("output_token_usage", async () => Promise.resolve(KmY())), Hz("verify_plan_reminder", async () => _mY(z, q)), Hz("queued_commands", () => OuY(Y))] : [],
        [X, P] = await Promise.all([Promise.all(M), Promise.all(D)]);
    return clearTimeout(O), [...J.flat(), ...X.flat(), ...P.flat()].filter((W) => W !== void 0 && W !== null)
}

// READABLE (for understanding):
async function assembleAllAttachments(
    userMessage,       // A: The user message with @-mentions
    sessionContext,    // q: Session context (options, state, etc.)
    userInputContext,  // K: User input context (IDE selection, etc.)
    queuedCommands,    // Y: Queued commands from hooks/system
    messages,          // z: Current message history
    memoryType         // _: Memory type ("session_memory" or undefined)
) {
    // Early exit if attachments disabled
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }

    // ─── 1-Second Timeout Protection ────────────────────────────────────
    let abortController = createAbortController();
    let timeoutId = setTimeout((ac) => ac.abort(), 1000, abortController);

    let contextWithAbort = {
        ...sessionContext,
        abortController: abortController
    };

    // ─── isMainAgent Check ───────────────────────────────────────────────
    // H = true if NOT a subagent (no agentId set)
    let isMainAgent = !sessionContext.agentId;

    // ─── GROUP 1: User-Dependent (Sequential Execution) ──────────────────
    // These depend on user message content, must run sequentially
    let group1Producers = userMessage ? [
        timedAttachmentProducer("at_mentioned_files", () => getAtMentionedFiles(userMessage, contextWithAbort)),
        timedAttachmentProducer("mcp_resources", () => getMCPResources(userMessage, contextWithAbort)),
        timedAttachmentProducer("agent_mentions", () => Promise.resolve(getAgentMentions(userMessage, sessionContext.options.agentDefinitions.activeAgents)))
    ] : [];

    // Group 1 runs SEQUENTIALLY because each producer may depend on the previous
    let group1Results = await Promise.all(group1Producers);

    // ─── GROUP 2: Always-Computed (Parallel Execution) ───────────────────
    // These are always computed regardless of agent or mode
    let group2Producers = [
        timedAttachmentProducer("date_change", () => Promise.resolve(getDateChange())),
        timedAttachmentProducer("ultrathink_effort", () => Promise.resolve(getUltrathinkEffort(userMessage))),
        timedAttachmentProducer("deferred_tools_delta", () => Promise.resolve(getDeferredToolsDelta(sessionContext.options.tools, sessionContext.options.mainLoopModel, messages))),
        timedAttachmentProducer("mcp_instructions_delta", () => Promise.resolve(getMCPInstructionsDelta(sessionContext.options.mcpClients, sessionContext.options.tools, sessionContext.options.mainLoopModel, messages))),
        timedAttachmentProducer("changed_files", () => getChangedFiles(contextWithAbort)),
        timedAttachmentProducer("nested_memory", () => getNestedMemory(contextWithAbort)),
        timedAttachmentProducer("dynamic_skill", () => getDynamicSkill(contextWithAbort)),
        timedAttachmentProducer("skill_listing", () => getSkillListing(contextWithAbort)),
        timedAttachmentProducer("ultra_claude_md", async () => getUltraClaudeMd(messages)),
        timedAttachmentProducer("plan_mode", () => getPlanMode(messages, sessionContext)),
        timedAttachmentProducer("plan_mode_exit", () => getPlanModeExit(sessionContext)),
        timedAttachmentProducer("auto_mode", () => getAutoMode(messages, sessionContext)),
        timedAttachmentProducer("auto_mode_exit", () => getAutoModeExit(sessionContext)),
        timedAttachmentProducer("todo_reminders", () => isTeamMode() ? getTeamTodoReminders(messages, sessionContext) : getTodoReminders(messages, sessionContext)),
        // Conditional: Team mode only
        ...(isTeamMode() ? [
            ...(memoryType === "session_memory" ? [] : [timedAttachmentProducer("teammate_mailbox", async () => getTeammateMailbox(sessionContext))]),
            timedAttachmentProducer("team_context", async () => getTeamContext(messages ?? []))
        ] : []),
        timedAttachmentProducer("agent_pending_messages", async () => getAgentPendingMessages(sessionContext)),
        timedAttachmentProducer("critical_system_reminder", () => Promise.resolve(getCriticalSystemReminder(sessionContext)))
    ];

    // ─── GROUP 3: Main-Agent-Only (Parallel Execution) ───────────────────
    // These are ONLY computed for the main agent, not subagents
    let group3Producers = isMainAgent ? [
        timedAttachmentProducer("ide_selection", async () => getIDESelection(userInputContext, sessionContext)),
        timedAttachmentProducer("ide_opened_file", async () => getIDEOpenedFile(userInputContext, sessionContext)),
        timedAttachmentProducer("output_style", async () => Promise.resolve(getOutputStyle())),
        timedAttachmentProducer("diagnostics", async () => getDiagnostics(sessionContext)),
        timedAttachmentProducer("lsp_diagnostics", async () => getLSPDiagnostics(sessionContext)),
        timedAttachmentProducer("unified_tasks", async () => getUnifiedTasks(sessionContext)),
        timedAttachmentProducer("async_hook_responses", async () => getAsyncHookResponses()),
        timedAttachmentProducer("token_usage", async () => Promise.resolve(getTokenUsage(messages ?? [], sessionContext.options.mainLoopModel))),
        timedAttachmentProducer("budget_usd", async () => Promise.resolve(getBudgetUsd(sessionContext.options.maxBudgetUsd))),
        timedAttachmentProducer("output_token_usage", async () => Promise.resolve(getOutputTokenUsage())),
        timedAttachmentProducer("verify_plan_reminder", async () => getVerifyPlanReminder(messages, sessionContext)),
        timedAttachmentProducer("queued_commands", () => getQueuedCommands(queuedCommands))
    ] : [];

    // Groups 2 and 3 run in PARALLEL
    let [group2Results, group3Results] = await Promise.all([
        Promise.all(group2Producers),
        Promise.all(group3Producers)
    ]);

    // Clear the timeout
    clearTimeout(timeoutId);

    // Flatten and filter all results
    return [...group1Results.flat(), ...group2Results.flat(), ...group3Results.flat()]
        .filter((result) => result !== undefined && result !== null);
}

// Mapping: _uY→assembleAllAttachments, A→userMessage, q→sessionContext, K→userInputContext,
//          Y→queuedCommands, z→messages, _→memoryType, w→abortController, O→timeoutId,
//          H→isMainAgent, j→group1Producers, J→group1Results, M→group2Producers, D→group3Producers,
//          Hz→timedAttachmentProducer, sK→createAbortController, t6→parseBoolean
```

**Key architectural decisions:**

1. **Sequential Group 1**: User-dependent producers run sequentially because they may share state or depend on each other's results.

2. **Parallel Groups 2 & 3**: Always-computed and main-agent-only producers run in parallel for performance. The `Promise.all([Promise.all(M), Promise.all(D)])` pattern enables this.

3. **1-Second Timeout**: A global timeout of 1000ms protects against slow producers. If exceeded, the abort controller signals cancellation.

4. **isMainAgent Logic**: `H = !q.agentId` determines if this is the main agent (not a subagent). Group 3 is only computed for main agent.

5. **Filtering**: Final results are filtered to remove null/undefined entries, allowing producers to opt-out by returning null.

**SDK Mode Interaction:**

In SDK mode, individual producers within Group 3 check `isNonInteractive()` internally:
- `ide_selection` returns null (no IDE connection)
- `diagnostics` uses cached data
- `token_usage` returns data that gets streamed as system events

### timedAttachmentProducer (Hz) — Telemetry Wrapper

```javascript
// ============================================
// timedAttachmentProducer - Telemetry wrapper for producers
// Location: chunks.147.mjs:20-46
// ============================================

// ORIGINAL (for source lookup):
async function Hz(A, q) {
    let K = Date.now();
    try {
        let Y = await q(),
            z = Date.now() - K;
        if (Math.random() < 0.05) {
            let _ = Y.filter((w) => w !== void 0 && w !== null).reduce((w, O) => {
                return w + B6(O).length
            }, 0);
            d("tengu_attachment_compute_duration", {
                label: A,
                duration_ms: z,
                attachment_size_bytes: _,
                attachment_count: Y.length
            })
        }
        return Y
    } catch (Y) {
        let z = Date.now() - K;
        if (Math.random() < 0.05) d("tengu_attachment_compute_duration", {
            label: A,
            duration_ms: z,
            error: !0
        });
        return _6(Y), jV(`Attachment error in ${A}`, Y), []
    }
}

// READABLE (for understanding):
async function timedAttachmentProducer(label, producerFn) {
    let startTime = Date.now();
    try {
        let result = await producerFn();
        let duration = Date.now() - startTime;

        // Sample 5% of successful runs for telemetry
        if (Math.random() < 0.05) {
            let totalSize = result
                .filter((item) => item !== undefined && item !== null)
                .reduce((sum, item) => sum + serializeAttachment(item).length, 0);

            emitTelemetry("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                attachment_size_bytes: totalSize,
                attachment_count: result.length
            });
        }
        return result;
    } catch (error) {
        let duration = Date.now() - startTime;

        // Sample 5% of errors for telemetry
        if (Math.random() < 0.05) {
            emitTelemetry("tengu_attachment_compute_duration", {
                label: label,
                duration_ms: duration,
                error: true
            });
        }

        // Log error and return empty array (graceful degradation)
        logError(error);
        logWarning(`Attachment error in ${label}`, error);
        return [];
    }
}

// Mapping: Hz→timedAttachmentProducer, A→label, q→producerFn, K→startTime, Y→result, z→duration,
//          B6→serializeAttachment, d→emitTelemetry, _6→logError, jV→logWarning
```

**Key insight:** The 5% sampling rate for telemetry prevents performance impact from logging every attachment computation. Errors are also sampled at 5% to avoid log flooding.

### Group 3 Producers in SDK Mode

The attachment production system (`_uY` / `assembleAllAttachments`) uses three groups:

**Group 3: Main-Agent-Only** — These producers are skipped in SDK mode or return degraded data:

```javascript
// ============================================
// Group 3 producers - SDK mode behavior
// Location: chunks.147.mjs:3-550
// ============================================

// ORIGINAL (for source lookup):
let D = H ? [
    Hz("ide_selection", async () => await kuY(A, q)),
    Hz("ide_opened_file", async () => await vuY(q)),
    Hz("output_style", async () => await OuY(q)),
    Hz("diagnostics", async () => await yuY(A, q)),
    Hz("lsp_diagnostics", async () => await buY(q)),
    Hz("unified_tasks", async () => await WuY(q)),
    Hz("async_hook_responses", async () => await JuY(q)),
    Hz("token_usage", async () => await qmY(A, q)),
    Hz("budget_usd", async () => await XuY(A, q)),
    Hz("verify_plan_reminder", async () => await ZuY(q)),
    Hz("queued_commands", async () => await QuY(q))
] : [];

// READABLE (for understanding):
let mainAgentOnlyProducers = isMainAgent ? [
    timedAttachmentProducer("ide_selection", async () => await getIDESelectionAttachment(userMsg, context)),
    // ... other producers
] : [];

// Mapping: H→isMainAgent, Hz→timedAttachmentProducer
```

**Key insight:** In SDK mode, `isMainAgent` is typically `true` (unless running as subagent), but the individual producers check `isNonInteractive()` internally to provide degraded data.

### ide_selection Producer Behavior

```javascript
// ============================================
// ide_selection producer - SDK mode behavior
// Location: chunks.147.mjs (kuY function)
// ============================================

async function getIDESelectionAttachment(userMessage, context) {
    // In SDK mode: No IDE connection exists
    if (isNonInteractive()) {
        // Return NULL unless client provided selection via input
        return context.providedIDESelection || null;
    }
    // Interactive mode: Query IDE via MCP for selection
    return await queryIDESelection();
}
```

### token_usage Producer — Streaming vs UI Display

In SDK mode, token usage is streamed as a system event rather than being attached to messages:

```javascript
// Interactive mode: Token budget shown in UI status bar
// SDK mode: Sent as system.status event

{
    "type": "system",
    "subtype": "status",
    "status": {
        "token_usage": {
            "used": 45000,
            "limit": 200000,
            "percentage": 22.5
        }
    },
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

### queued_commands Attachment Handling

In SDK mode, queued commands (from hooks or system) are attached to the next message instead of triggering immediate execution:

```javascript
// ============================================
// queued_command attachment in SDK mode
// Location: chunks.147.mjs (QuY producer)
// ============================================

function getQueuedCommandsAttachment(sessionContext) {
    let queuedCommands = sessionContext.getQueuedCommands();
    if (queuedCommands.length === 0) return null;

    // In SDK mode: Attach to next message (will be processed in next turn)
    // In interactive mode: Trigger immediate execution

    return {
        type: "queued_commands",
        commands: queuedCommands.map(cmd => ({
            type: cmd.type,
            data: cmd.data
        }))
    };
}
```

### runHeadless (BXz) — Detailed Source Analysis

The `runHeadless` function is the main entry point for SDK session execution. Here's the complete source-level analysis:

```javascript
// ============================================
// runHeadless - Headless execution loop for SDK sessions
// Location: chunks.187.mjs:3-500
// ============================================

// ORIGINAL (for source lookup):
function BXz(A, q, K, Y, z, _, w, O, $, H, j, J) {
    let M = !1, D = !1, X = !1, P = null, W, Z = A.outbound;
    xkq((T6) => {
        if (T6 === "default" || T6 === "acceptEdits" || T6 === "bypassPermissions"
            || T6 === "plan" || T6 === "auto" || T6 === "dontAsk")
            Z.enqueue({
                type: "system",
                subtype: "status",
                status: null,
                permissionMode: T6,
                uuid: WD(),
                session_id: R1()
            })
    });
    let G = {
        abortController: null,
        inflightPromise: null,
        lastEmitted: null,
        pendingSuggestion: null,
        pendingLastEmittedEntry: null
    };
    if (j.enableAuthStatus) e0.getInstance().subscribe((D6) => {
        Z.enqueue({
            type: "auth_status",
            isAuthenticating: D6.isAuthenticating,
            output: D6.output,
            error: D6.error,
            uuid: WD(),
            session_id: R1()
        })
    });
    let f = (T6) => {
        let D6 = SJq(T6);
        if (D6) Z.enqueue({
            type: "rate_limit_event",
            rate_limit_info: D6,
            uuid: WD(),
            session_id: R1()
        })
    };
    Nt.add(f);
    // ... continuation
}

// READABLE (for understanding):
async function runHeadless(
    streamIO,           // A: StreamIO instance (so6 or AI1)
    mcpClients,         // q: MCP clients array
    slashCommands,      // K: Available slash commands
    toolRegistry,       // Y: Tool registry
    messages,           // z: Mutable messages array
    canUseTool,         // _: Permission checker callback
    mcpServerConfigs,   // w: MCP server configurations
    getAppState,        // O: App state getter
    setAppState,        // $: App state setter
    agents,             // H: Agent definitions
    options             // j: Configuration options
) {
    let isShuttingDown = false;
    let hasInterruptedAgent = false;
    let localAgentRunning = false;
    let pendingResult = null;
    let abortController;
    let outbound = streamIO.outbound;  // AsyncQueue for outgoing messages

    // ─── Permission Mode Subscription ─────────────────────────────────────
    // When permission mode changes, broadcast status to SDK client
    subscribeToPermissionModeChange((newMode) => {
        if (["default", "acceptEdits", "bypassPermissions", "plan", "auto", "dontAsk"].includes(newMode)) {
            outbound.enqueue({
                type: "system",
                subtype: "status",
                status: null,
                permissionMode: newMode,
                uuid: generateUUID(),
                session_id: getSessionId()
            });
        }
    });

    // ─── Suggestion State Management ───────────────────────────────────────
    let suggestionState = {
        abortController: null,
        inflightPromise: null,
        lastEmitted: null,
        pendingSuggestion: null,
        pendingLastEmittedEntry: null
    };

    // ─── Auth Status Streaming ─────────────────────────────────────────────
    if (options.enableAuthStatus) {
        AuthManager.getInstance().subscribe((authState) => {
            outbound.enqueue({
                type: "auth_status",
                isAuthenticating: authState.isAuthenticating,
                output: authState.output,
                error: authState.error,
                uuid: generateUUID(),
                session_id: getSessionId()
            });
        });
    }

    // ─── Rate Limit Event Handling ────────────────────────────────────────
    let rateLimitHandler = (event) => {
        let rateLimitInfo = parseRateLimitInfo(event);
        if (rateLimitInfo) {
            outbound.enqueue({
                type: "rate_limit_event",
                rate_limit_info: rateLimitInfo,
                uuid: generateUUID(),
                session_id: getSessionId()
            });
        }
    };
    rateLimitEventEmitter.add(rateLimitHandler);

    // ... rest of function continues with MCP initialization, elicitation handlers,
    // message processing loop, prompt suggestion generation, etc.
}

// Mapping: BXz→runHeadless, A→streamIO, q→mcpClients, K→slashCommands, Y→toolRegistry,
//          z→messages, _→canUseTool, w→mcpServerConfigs, O→getAppState, $→setAppState,
//          H→agents, j→options, J→interruptedTurn, Z→outbound, M→isShuttingDown,
//          xkq→subscribeToPermissionModeChange, WD→generateUUID, R1→getSessionId
```

### runHeadless Key Components

**1. Permission Mode Broadcasting:**
When the permission mode changes (default, acceptEdits, bypassPermissions, plan, auto, dontAsk), the function broadcasts a system status message to the SDK client via the outbound queue.

**2. Auth Status Streaming:**
If `enableAuthStatus` is true, auth state changes are streamed as `auth_status` events.

**3. Rate Limit Handling:**
Rate limit events from the API are captured and forwarded to the SDK client as `rate_limit_event` messages.

**4. MCP Server Initialization:**
The function calls `WGq` (initializeMcpServers) to set up MCP servers, routing messages through `sendMcpMessage`.

**5. Elicitation Handler Setup:**
MCP elicitation requests are handled by routing through the SDK control channel.

**6. Message Processing Loop:**
The core loop processes incoming messages from the streamIO input, handling:
- `prompt` mode: User messages to process
- `orphaned-permission` mode: Permission responses that arrived late
- `task-notification` mode: Background task status updates

### createStreamIO (UXz) — Factory Function

```javascript
// ============================================
// createStreamIO - Factory for StreamIO instances
// Location: chunks.187.mjs:1467-1482
// ============================================

// ORIGINAL (for source lookup):
function UXz(A, q) {
    let K;
    if (typeof A === "string")
        if (A.trim() !== "") K = tV8([B6({
            type: "user",
            session_id: "",
            message: { role: "user", content: A },
            parent_tool_use_id: null
        })]);
        else K = tV8([]);
    else K = A;
    return q.sdkUrl ? new AI1(q.sdkUrl, K, q.replayUserMessages) : new so6(K, q.replayUserMessages)
}

// READABLE (for understanding):
function createStreamIO(input, options) {
    let normalizedInput;

    // Normalize input to async iterable format
    if (typeof input === "string") {
        if (input.trim() !== "") {
            // Create async iterable with single user message
            normalizedInput = createAsyncIterable([
                serializeMessage({
                    type: "user",
                    session_id: "",
                    message: { role: "user", content: input },
                    parent_tool_use_id: null
                })
            ]);
        } else {
            normalizedInput = createAsyncIterable([]);
        }
    } else {
        // Already an async iterable
        normalizedInput = input;
    }

    // Choose transport based on SDK URL
    if (options.sdkUrl) {
        // WebSocket-based remote SDK session
        return new RemoteStreamIO(options.sdkUrl, normalizedInput, options.replayUserMessages);
    } else {
        // Stdio-based local SDK session
        return new StdioStreamIO(normalizedInput, options.replayUserMessages);
    }
}

// Mapping: UXz→createStreamIO, A→input, q→options, K→normalizedInput,
//          tV8→createAsyncIterable, B6→serializeMessage, AI1→RemoteStreamIO, so6→StdioStreamIO
```

**Key insight:** The `sdkUrl` option determines whether the SDK session uses WebSocket transport (`RemoteStreamIO` / `AI1`) or stdin/stdout transport (`StdioStreamIO` / `so6`). This enables both local SDK integration (CLI tools piping to claude) and remote SDK sessions (browser-based or remote IDE integration).

---

## 04_system_reminder Module Integration

### Architecture Overview

The SDK module integrates deeply with the system reminder infrastructure. This section documents the specific integration points and behavioral differences.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│               System Reminder Integration Architecture                        │
│                                                                               │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────┐    │
│  │ 04_system_      │     │ Attachment      │     │ normalizeForAPI     │    │
│  │ reminder Module │────▶│ Producers       │────▶│ (K2z)               │    │
│  │                 │     │ (40+ functions) │     │                     │    │
│  └─────────────────┘     └─────────────────┘     └─────────────────────┘    │
│                                                           │                  │
│                          ┌────────────────────────────────┤                  │
│                          ▼                                ▼                  │
│                  ┌─────────────────┐             ┌─────────────────────┐    │
│                  │ Visible Types   │             │ Silent Types        │    │
│                  │ (API messages)  │             │ (no messages)       │    │
│                  └─────────────────┘             └─────────────────────┘    │
│                          │                                                  │
│                          ▼                                                  │
│                  ┌─────────────────────────────────────────────────────┐    │
│                  │ SDK Event Emission (selected types only)            │    │
│                  │ - rate_limit_event                                  │    │
│                  │ - prompt_suggestion                                 │    │
│                  │ - auth_status                                       │    │
│                  └─────────────────────────────────────────────────────┘    │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Key Differences from CLI Mode

| Aspect | CLI Mode | SDK Mode |
|--------|----------|----------|
| **IDE selection** | Queries IDE via MCP | Returns NULL |
| **Diagnostics** | Live LSP queries | Uses cached data |
| **Token usage** | UI status bar | `system.status` event |
| **Permission prompts** | Terminal UI | `control_request` / MCP tool |
| **Hook responses** | Toast messages | `system` events |

### isMeta Flag Lifecycle

The `isMeta` flag distinguishes system reminders from real user messages throughout the pipeline:

```javascript
// ============================================
// isMeta flag propagation through the system
// Location: Various files
// ============================================

// 1. Creation - System reminders are created with isMeta: true
let systemReminder = {
    type: "user",
    message: { role: "user", content: "<system-reminder>..." },
    isMeta: true,  // ← Set at creation
    uuid: generateUUID()
};

// 2. Internal use - isMeta affects multiple subsystems
// - Session title generation skips isMeta messages
// - Turn counting excludes isMeta messages
// - Token budget excludes isMeta messages
// - Transcript parsing skips isMeta lines

// 3. API preparation - isMeta is stripped before sending to Claude
function formatUserMessageForAPI(internalMessage) {
    // Returns { role: "user", content: ... }
    // isMeta is NOT included - only role and content survive
    return {
        role: "user",
        content: internalMessage.message.content
    };
}
```

### Silent Types Reference

Silent types produce no API messages but serve important internal purposes:

| Type | Purpose | SDK Relevance |
|------|---------|---------------|
| `already_read_file` | Deduplication | Prevents re-reading cached files |
| `command_permissions` | Permission state | Internal tracking only |
| `edited_image_file` | Binary modification | No API message needed |
| `hook_cancelled` | Hook cancellation | Logged but not shown |
| `hook_error_during_execution` | Hook errors | Non-blocking, logged |
| `autocheckpointing` | Checkpoint status | Reserved for future use |
| `background_task_status` | Task tracking | UI state only |

---

## 05_tools Module Integration

### Permission Flow Architecture

The tools module behaves fundamentally differently in SDK mode due to the non-interactive permission flow:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      Permission Flow Comparison                               │
│                                                                               │
│  INTERACTIVE MODE:                                                            │
│  ┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐           │
│  │ Tool     │────▶│ Terminal  │────▶│ Keyboard │────▶│ Response │           │
│  │ Request  │     │ UI Prompt │     │ Input    │     │          │           │
│  └──────────┘     └───────────┘     └──────────┘     └──────────┘           │
│                                                                               │
│  SDK MODE:                                                                    │
│  ┌──────────┐     ┌────────────────┐     ┌────────────┐     ┌──────────┐    │
│  │ Tool     │────▶│ control_       │────▶│ SDK Client │────▶│ control_ │    │
│  │ Request  │     │ request        │     │ Response   │     │ response │    │
│  └──────────┘     └────────────────┘     └────────────┘     └──────────┘    │
│                          OR                                                   │
│  ┌──────────┐     ┌────────────────┐     ┌────────────┐     ┌──────────┐    │
│  │ Tool     │────▶│ MCP Permission │────▶│ SDK Client │────▶│ Response │    │
│  │ Request  │     │ Tool           │     │            │     │          │    │
│  └──────────┘     └────────────────┘     └────────────┘     └──────────┘    │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Permission Decision Points

```javascript
// ============================================
// Permission routing decision tree
// Location: chunks.179.mjs
// ============================================

async function routePermissionRequest(request) {
    // Branch 1: Interactive mode
    if (!isNonInteractive()) {
        return await showTerminalPermissionPrompt(request);
    }

    // Branch 2: SDK mode with MCP permission tool
    if (hasMcpPermissionTool()) {
        // Route through MCP tool mechanism
        return await sendMcpPermissionToolRequest(request);
    }

    // Branch 3: SDK mode with control_request
    return await sendControlRequest({
        type: "control_request",
        request_id: generateUUID(),
        request: {
            subtype: "can_use_tool",
            tool_name: request.toolName,
            input: request.input,
            tool_use_id: request.toolUseId
        }
    });
}
```

### Tool Behavior Differences

| Tool | Permission Required | Interactive Behavior | SDK Behavior |
|------|---------------------|----------------------|--------------|
| **Bash** | Yes | Preview + confirm | `control_request` |
| **Read** | No | Spinner | Direct execution |
| **Write** | Yes | Diff preview | `control_request` |
| **Edit** | Yes | Diff preview | `control_request` |
| **Agent** | Inherited | Subprocess | Same session |
| **WebFetch** | No | Progress indicator | Direct return |
| **Glob** | No | Paginated | All results |
| **Grep** | No | Highlighted | Plain text |

### createCanUseTool Implementation

The `createCanUseTool` function creates a permission checker that uses Promise.race for timeout handling:

```javascript
// ============================================
// createCanUseTool - Permission checker factory with timeout
// Location: chunks.184.mjs:2150-2227
// ============================================

// ORIGINAL (for source lookup):
createCanUseTool: (A, q, K, Y, z, _) => {
    let w = A[WU], O = 12e4, $ = new Promise((H, j) => setTimeout(() => j(new Error("Permission timeout")), O));
    return Promise.race([new Promise((H, j) => {
        w.set(A.id, { resolve: H, reject: j });
        Z.enqueue({ type: "control_request", ... })
    }), $])
}

// READABLE (for understanding):
createCanUseTool: (toolUseId, toolName, input, context, options, signal) => {
    let pendingPermissions = context.pendingPermissions;
    let timeoutMs = 120000; // 2-minute default timeout

    // Create timeout promise
    let timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("Permission timeout")), timeoutMs);
    });

    // Create permission request promise
    let permissionPromise = new Promise((resolve, reject) => {
        // Register in pending map for later resolution
        pendingPermissions.set(toolUseId, { resolve, reject });

        // Send control_request to SDK client
        outbound.enqueue({
            type: "control_request",
            request_id: generateUUID(),
            request: {
                subtype: "can_use_tool",
                tool_name: toolName,
                input: input,
                tool_use_id: toolUseId
            }
        });
    });

    // Race between permission response and timeout
    return Promise.race([permissionPromise, timeoutPromise]);
}

// Mapping: A→toolUseId, q→toolName, K→input, Y→context, WU→pendingPermissionsKey,
//          Z→outbound, O→timeoutMs, $→timeoutPromise, H→resolve, j→reject
```

---

## 06_mcp Module Integration

### SdkMcpTransport Architecture

MCP servers in SDK mode use a custom transport that routes messages through the SDK control channel:

```javascript
// ============================================
// SdkMcpTransport - MCP routing for SDK mode
// Location: chunks.169.mjs:1506-1527
// ============================================

// ORIGINAL (for source lookup):
class oi8 {
    serverName;
    sendMcpMessage;
    isClosed = !1;

    async send(A) {
        if (this.isClosed) throw Error("Transport is closed");
        let q = await this.sendMcpMessage(this.serverName, A);
        if (this.onmessage) this.onmessage(q)
    }

    close() {
        this.isClosed = !0
    }
}

// READABLE (for understanding):
class SdkMcpTransport {
    serverName;
    sendMcpMessage;  // Function to route through SDK channel
    isClosed = false;

    constructor(serverName, sendMcpMessage) {
        this.serverName = serverName;
        this.sendMcpMessage = sendMcpMessage;
    }

    async send(message) {
        if (this.isClosed) {
            throw new Error("Transport is closed");
        }

        // Route through SDK control channel instead of direct process
        let response = await this.sendMcpMessage(this.serverName, message);

        // Deliver response to MCP client
        if (this.onmessage) {
            this.onmessage(response);
        }
    }

    close() {
        this.isClosed = true;
    }
}

// Mapping: oi8→SdkMcpTransport, A→message, q→response
```

### MCP Server Registration Flow

```javascript
// SDK client provides MCP servers via initialize control request
{
    "type": "user",
    "content": "...",
    "sdkMcpServers": [
        { "name": "filesystem", "config": { "path": "/workspace" } },
        { "name": "github", "config": { "token": "..." } }
    ]
}

// SDK initializes each server with SdkMcpTransport
for (const server of sdkMcpServers) {
    const transport = new SdkMcpTransport(
        server.name,
        (serverName, message) => streamIO.sendMcpMessage(serverName, message)
    );
    await mcpClient.connect(transport);
}
```

### Elicitation Handler Setup

```javascript
// ============================================
// Elicitation handler setup in runHeadless
// Location: chunks.187.mjs
// ============================================

function setupElicitationHandlers(clients, streamIO) {
    if (!isElicitationEnabled()) return;

    for (let client of clients) {
        if (client.type !== "connected") continue;
        if (client.config.type === "sdk") continue;  // Skip SDK-type clients

        client.client.setRequestHandler(ElicitationRequestSchema, async (request, context) => {
            // First try hook-based elicitation
            let hookResult = await tryElicitationHook(
                client.name,
                request.params,
                context.signal
            );
            if (hookResult) return hookResult;

            // Route through SDK control channel
            return await streamIO.handleElicitation(
                client.name,
                request.params.message,
                request.params.requestedSchema,
                context.signal,
                request.params.mode,
                request.params.url,
                request.params.elicitationId
            );
        });
    }
}
```

---

## 11_hooks Module Integration

### Hook Execution in SDK Mode

Hooks in SDK mode produce different output patterns compared to interactive mode:

| Hook Type | Interactive Output | SDK Output |
|-----------|-------------------|------------|
| `PreToolUse` | Terminal preview | `stream_event` |
| `PostToolUse` | Terminal output | `tool_result` event |
| `Notification` | Toast message | `system` event |
| `Stop` | Terminal prompt | `control_request` |

### Hook Event Sequence

```javascript
// Hook start event
{
    "type": "system",
    "subtype": "hook_started",
    "hook_id": "hook-uuid",
    "hook_name": "pre_tool_use",
    "uuid": "<uuid>",
    "session_id": "<session-id>"
}

// Hook progress (real-time stdout/stderr)
{
    "type": "system",
    "subtype": "hook_progress",
    "hook_id": "hook-uuid",
    "stdout": "Processing...",
    "stderr": "",
    "uuid": "<uuid>",
    "session_id": "<session-id>"
}

// Hook complete
{
    "type": "system",
    "subtype": "hook_response",
    "hook_id": "hook-uuid",
    "outcome": "allow",
    "reason": "Tool execution permitted",
    "uuid": "<uuid>",
    "session_id": "<session-id>"
}
```

### Hook Callback via SDK

```javascript
// ============================================
// createHookCallback - SDK hook wrapper
// Location: chunks.184.mjs:2100-2140
// ============================================

// ORIGINAL (for source lookup):
createHookCallback: (A) => ({
    onToolUse: (q, K, Y) => {
        Z.enqueue({
            type: "hook_request",
            hook_type: "pre_tool_use",
            tool_name: q,
            input: K,
            tool_use_id: Y
        })
    },
    onToolResult: (q, K, Y, z) => {
        Z.enqueue({
            type: "hook_request",
            hook_type: "post_tool_use",
            tool_name: q,
            input: K,
            result: Y,
            tool_use_id: z
        })
    }
})

// READABLE (for understanding):
createHookCallback: (context) => ({
    // Pre-tool-use callback
    onToolUse: (toolName, input, toolUseId) => {
        outbound.enqueue({
            type: "hook_request",
            hook_type: "pre_tool_use",
            tool_name: toolName,
            input: input,
            tool_use_id: toolUseId
        });
    },

    // Post-tool-use callback
    onToolResult: (toolName, input, result, toolUseId) => {
        outbound.enqueue({
            type: "hook_request",
            hook_type: "post_tool_use",
            tool_name: toolName,
            input: input,
            result: result,
            tool_use_id: toolUseId
        });
    }
})

// Mapping: A→context, q→toolName, K→input, Y→toolUseId/result, z→toolUseId, Z→outbound
```

### Silent Hook Types

Hook-related attachment types that are silent (no API messages):

```javascript
// ============================================
// Silent hook types - No API messages produced
// Location: chunks.173.mjs:1121-1126
// ============================================

case "hook_cancelled":           // Hook was cancelled
case "hook_error_during_execution":  // Execution error (non-blocking)
case "hook_non_blocking_error":  // Non-blocking error
case "hook_system_message":      // System message from hook
case "structured_output":        // Structured output from hook
case "hook_permission_decision": // Permission decision from hook
    return [];  // Silent - tracked internally only
```

---

## 24_auth Module Integration

### Auth Status Streaming

SDK clients can opt-in to receive authentication state changes:

```javascript
// ============================================
// Auth status streaming in runHeadless
// Location: chunks.187.mjs
// ============================================

if (options.enableAuthStatus) {
    AuthManager.getInstance().subscribe((authState) => {
        outbound.enqueue({
            type: "auth_status",
            isAuthenticating: authState.isAuthenticating,
            output: authState.output,
            error: authState.error,
            uuid: generateUUID(),
            session_id: getSessionId()
        });
    });
}
```

### Auth Status Event Schema

```json
{
    "type": "auth_status",
    "isAuthenticating": false,
    "output": "Authentication successful",
    "error": null,
    "uuid": "<uuid>",
    "session_id": "<session-id>"
}
```

### SDK Client Usage

```typescript
// TypeScript SDK - Handle auth status changes
for await (const event of session) {
    if (event.type === "auth_status") {
        if (event.isAuthenticating) {
            console.log("Authenticating...");
        } else if (event.error) {
            console.error("Auth failed:", event.error);
        } else {
            console.log("Auth success:", event.output);
        }
    }
}
```

### API Key Management

In SDK mode, API keys are typically provided via environment variables or configuration:

```javascript
// SDK session initialization with API key
const session = await createSession({
    apiKey: process.env.ANTHROPIC_API_KEY,
    // or via options
    // ...
});
```

**Key consideration:** SDK sessions don't use the interactive auth flow. The `auth_status` event is purely informational about background auth state changes (e.g., token refresh).

---

## Summary: Module Integration Matrix

| Module | Primary Integration | SDK Event Type | Key Function |
|--------|---------------------|----------------|--------------|
| `04_system_reminder` | Attachment producers | Mixed | `assembleAllAttachments` (_uY) |
| `05_tools` | Permission flow | `control_request` | `createCanUseTool` |
| `06_mcp` | Server transport | `mcp_request` | `SdkMcpTransport` (oi8) |
| `11_hooks` | Callback wrapper | `hook_request` | `createHookCallback` |
| `24_auth` | Status streaming | `auth_status` | `AuthManager.subscribe` |