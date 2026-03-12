# SDK Cross-References

## Overview

This document provides cross-references between the SDK module and related modules, documenting how features behave differently in SDK mode versus interactive CLI mode. Understanding these differences is essential for building robust SDK integrations.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tool execution symbols
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Feature symbols
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - SDK mode detection

Key concepts in this document:
- `isNonInteractive` (w4) - Core SDK mode check
- Tool behavior variations by mode
- System reminder generation differences
- Compact integration with SDK

---

## Tools Behavior in SDK Mode

### Overview

The `isNonInteractive` flag (w4) fundamentally changes how tools behave. This section documents the specific differences for each tool category.

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

System reminders (attachments) are generated differently in SDK mode. Some attachments are omitted, while others have modified behavior.

### Attachment Generation Differences

| Attachment Type | Interactive Mode | SDK Mode |
|-----------------|------------------|----------|
| **File @-mentions** | Reads files on-demand | Same, but streamed as events |
| **MCP resources** | Loaded from local servers | Routed through SDK MCP channel |
| **Agent mentions** | Spawns agent in terminal | Uses SDK Agent tool |
| **Changed files** | Git diff displayed inline | Included as structured data |
| **Todo reminders** | Periodic UI updates | Sent as `system` messages |
| **IDE selection** | Real-time from IDE | Must be provided via input |
| **Diagnostics** | LSP queries on-demand | Cached or provided by SDK client |

### queued_command Attachment Handling

**What it does:** In SDK mode, queued commands (from hooks or system) are attached to messages differently than in interactive mode.

```javascript
// ============================================
// queued_command attachment in SDK mode
// Location: chunks.142.mjs (attachment generation)
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