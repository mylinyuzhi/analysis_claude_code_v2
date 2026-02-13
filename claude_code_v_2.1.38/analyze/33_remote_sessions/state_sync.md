# Remote Sessions - State Synchronization

## Module Overview

Analysis of state synchronization, hydration, and message routing in remote sessions.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Remote sessions

Key functions:
- `hydrateSessionState` (omA) - State hydration on connect
- Session ingress upload (Ci4) - Message history sync
- Stream event processing (iW1) - Convert stream to messages

---

## 1. Session Hydration

### 1.1 Initial State Setup

**On Session Creation**:

```javascript
// POST /v1/sessions creates session with initial context
{
    "context": {
        "sources": [
            {
                "type": "git",
                "git_sha": "current_commit",
                "git_status": "clean|dirty",
                "git_branch": "branch_name"
            }
        ],
        "outcomes": []  // Empty on creation
    },
    "context_settings": {
        "model": "claude-sonnet-4-5"
    }
}
```

**State Components**:
1. **Git Context**: Current repo state (immutable per session)
2. **Model Selection**: Chosen model (immutable per session)
3. **Message History**: Built incrementally via events
4. **Tool State**: Permission decisions tracked locally

---

### 1.2 Message History Upload

**Before User Messages** (chunks.126.mjs, Ci4 function):

```javascript
async function uploadMessageHistory(sessionId, messages) {
    // Convert local messages to session ingress format
    const events = messages.map(msg => ({
        type: msg.role,  // "user" or "assistant"
        message: msg,
        uuid: generateUUID(),
        session_id: sessionId
    }));

    // Upload in batch
    const response = await fetch(
        `/v1/session_ingress/session/${sessionId}`,
        {
            method: "POST",
            body: JSON.stringify({ events })
        }
    );

    if (!response.ok) {
        throw new Error("Failed to upload message history");
    }

    return true;
}
```

**Why Upload Before Send**:
- Ensures server has full context before processing new message
- Maintains message ordering (history uploaded → user message sent)
- Fail-fast: If upload fails, don't send user message

---

## 2. Message Routing

### 2.1 Local → Remote Flow

```
┌─────────────────────────────────────────────────────────┐
│           LOCAL TO REMOTE MESSAGE FLOW                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  User Input                                             │
│     │                                                   │
│     ▼                                                   │
│  RemoteSessionManager.sendMessage(text)                │
│     │                                                   │
│     ├─> Build event object:                            │
│     │   {                                               │
│     │     uuid: UUID,                                   │
│     │     session_id: sessionId,                        │
│     │     type: "user",                                 │
│     │     message: { role: "user", content: text }     │
│     │   }                                               │
│     │                                                   │
│     ▼                                                   │
│  sendEventToRemoteSession(sessionId, event)            │
│     │                                                   │
│     ├─> POST /v1/sessions/{sessionId}/events           │
│     │                                                   │
│     ▼                                                   │
│  Response: { success: true }                           │
│     │                                                   │
│     ▼                                                   │
│  Remote agent processes message                        │
│     │                                                   │
│     └─> Streams response back via WebSocket            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 2.2 Remote → Local Flow

```
┌─────────────────────────────────────────────────────────┐
│           REMOTE TO LOCAL MESSAGE FLOW                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Remote Agent Response                                  │
│     │                                                   │
│     ▼                                                   │
│  WebSocket Message Received                            │
│     │                                                   │
│     ├─> SessionsWebSocket.handleMessage()              │
│     │   - JSON parse                                   │
│     │   - Type validation                              │
│     │                                                   │
│     ▼                                                   │
│  Message Type Filter                                   │
│     │                                                   │
│     ├─> Control Message?                               │
│     │   YES: RemoteSessionManager.handleControlRequest│
│     │        - Store in pendingPermissionRequests      │
│     │        - Invoke onPermissionRequest callback     │
│     │        - Await user decision                     │
│     │        - Send control_response                   │
│     │                                                   │
│     └─> Data Message?                                  │
│         YES: RemoteSessionManager.onMessage            │
│              │                                          │
│              ├─> stream_event?                         │
│              │   - Process streaming token             │
│              │   - Update UI incrementally             │
│              │                                          │
│              ├─> assistant?                            │
│              │   - Add to message history             │
│              │   - Display full response              │
│              │                                          │
│              └─> tool_progress?                        │
│                  - Show tool execution status          │
│                  - Update progress indicators          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Stream Event Processing

### 3.1 Streaming Message Adaptation

**Function**: `iW1` (stream event processor)

**What it does**: Converts streaming events into message history items.

**Input** (stream_event):
```json
{
    "type": "stream_event",
    "event": {
        "type": "content_block_delta",
        "delta": {
            "type": "text_delta",
            "text": "Hello"
        }
    }
}
```

**Processing**:
1. Extract delta type (`text_delta`, `tool_use`, `thinking`)
2. Accumulate deltas into message buffer
3. Yield complete message objects to UI
4. Track tool use state for permission requests

**Output** (message object):
```javascript
{
    type: "assistant",
    content: "Hello world",
    toolUses: [...],
    thinkingBlocks: [...]
}
```

---

## 4. Permission Request Synchronization

### 4.1 Request-Response Pairing

**Request Storage**:
```javascript
class RemoteSessionManager {
    pendingPermissionRequests = new Map();  // request_id → request

    handleControlRequest(request) {
        const requestId = request.request_id;

        // Store for later response
        this.pendingPermissionRequests.set(requestId, request);

        // Invoke callback (UI shows permission dialog)
        this.callbacks.onPermissionRequest(request, requestId);
    }
}
```

**Response Resolution**:
```javascript
respondToPermissionRequest(requestId, decision) {
    const request = this.pendingPermissionRequests.get(requestId);
    if (!request) {
        throw new Error("Unknown request ID");
    }

    // Build response
    const response = {
        type: "control_response",
        request_id: requestId,
        response: {
            subtype: request.request.subtype,
            behavior: decision.behavior,  // "allow" | "deny"
            updatedInput: decision.updatedInput,
            allowedPrompts: decision.allowedPrompts
        }
    };

    // Send via WebSocket
    this.websocket.sendControlResponse(response);

    // Cleanup
    this.pendingPermissionRequests.delete(requestId);
}
```

**Key Property**: Request ID ensures responses match requests even with concurrent permission dialogs.

---

## 5. Connection Timeout Handling

**Timeout Detection** (useRemoteSession hook):

```javascript
// After sending message, start 30s timeout
const timeoutId = setTimeout(() => {
    console.warn("Remote session timeout - no response in 30s");

    // Show user notification
    showNotification({
        message: "Remote session seems stuck. Reconnecting...",
        dismissible: true
    });

    // Attempt reconnection
    remoteSessionManager.reconnect();
}, 30000);

// Clear timeout when response arrives
remoteSessionManager.onMessage(() => {
    clearTimeout(timeoutId);
});
```

**Reconnection Effect**:
1. Closes current WebSocket connection
2. Resets reconnect attempts to 0
3. Establishes new connection
4. Re-subscribes to session events

---

## 6. State Reconciliation

### 6.1 Message Ordering Guarantees

**Server-Side Ordering**:
- All events timestamped on receipt
- WebSocket stream delivers events in chronological order
- Control messages interleaved with data messages (same stream)

**Client-Side Handling**:
- Sequential processing (no concurrent message handlers)
- Permission requests block until response sent
- Message history append-only (no retroactive edits)

---

### 6.2 Offline Message Queue

**Current Behavior**: No offline queue

**When Disconnected**:
- `sendMessage()` returns `false` immediately
- User sees "Not connected" error
- Messages are NOT queued for later delivery

**Reconnection**:
- Previous message history preserved (server-side)
- Client re-subscribes to event stream
- Continues from current state (no replay)

---

## 7. Tool Execution Delegation

**Remote Tool Request Flow**:

```
Remote Agent Wants Tool
     │
     ▼
Sends control_request (can_use_tool)
     │
     ▼
Local Client Receives Request
     │
     ├─> Lookup tool in local registry
     │   - Found: Use local tool definition
     │   - Not found: Create stub tool
     │
     ▼
Show Permission Dialog (with tool context)
     │
     ├─> User Allows
     │   └─> Send control_response (behavior: "allow")
     │
     └─> User Denies
         └─> Send control_response (behavior: "deny")
     │
     ▼
Remote Agent Receives Response
     │
     ├─> Allowed: Execute tool on remote
     │   └─> Send result back via WebSocket
     │
     └─> Denied: Show error to user
```

**Stub Tool Creation** (chunks.185.mjs):
```javascript
function createStubTool(toolName) {
    return {
        name: toolName,
        description: `Remote tool: ${toolName}`,
        input_schema: {
            type: "object",
            properties: {},
            required: []
        }
    };
}
```

**Why Stubs**: Enables permission UI for unknown tools without requiring local implementation.

---

## Summary

State synchronization in remote sessions is **eventually consistent** with **strict ordering**:

1. **Message History Upload**: Pre-sync before new messages
2. **WebSocket Streaming**: Real-time event delivery
3. **Permission Pairing**: request_id ensures correct response routing
4. **Timeout Recovery**: 30s timeout triggers reconnection
5. **Tool Delegation**: Remote execution, local permission
6. **Offline Handling**: Fail-fast (no queuing)

**Key insight**: System prioritizes **consistency** over **availability** - when disconnected, operations fail rather than queue, ensuring user always sees true connection state.
