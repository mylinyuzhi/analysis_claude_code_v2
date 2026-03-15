# Remote Sessions - State Synchronization

## Module Overview

Analysis of state synchronization, hydration, and message routing in remote sessions (v2.1.76).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Remote sessions

Key functions:
- `hydrateSessionState` (omA) - State hydration on connect
- Session ingress upload (Ci4) - Message history sync
- Stream event processing (iW1) - Convert stream to messages
- `updateSessionMetadata` (BI4) - Sync title and metadata to backend

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
5. **Session Title** (v2.1.76): Set from first prompt, propagated to server

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

## 2. Session Name Preservation (v2.1.76)

### 2.1 Title from First Prompt

**What it does:** Automatically assigns a session title from the first user message, making the session discoverable in the `/resume` picker and on claude.ai.

**How it works:**
1. When the first user message is submitted to a remote session, `extractChatTitle` (I2z) processes the message content to extract a human-readable title
2. The title is saved locally to `appState.sessionTitle`
3. `updateSessionMetadata` (BI4) is called to POST the title to the backend
4. The backend updates the session's display name

**Why first prompt (not LLM response):** The first prompt represents the user's intent, which is the most useful label for the session. The LLM response would be longer and less suited for a compact session title.

### 2.2 Title Preservation Through Compaction

Session names are preserved through context compaction in v2.1.76.

**How it works:**
1. Before compaction, `sessionTitle` is captured from app state
2. Compaction process creates a new summarized conversation
3. After compaction, `sessionTitle` is restored from the captured value
4. `updateSessionMetadata` is NOT called again (no need to re-sync to backend since the title hasn't changed)

**Design rationale:** In v2.1.38, context compaction could reset the session title because the title was stored inline in the conversation metadata and the summarization process did not preserve it. v2.1.76 explicitly extracts and re-injects the title as a separate operation, independent of the conversation content.

### 2.3 Remote Session Title Sync

**What it does:** When the CLI session's title is set (manually via `/rename` or automatically from first prompt), the change is propagated to the remote session's metadata.

**How it works:**
```javascript
// ============================================
// updateSessionMetadata - Sync title and metadata to backend
// Location: chunks.126.mjs (metadata section)
// ============================================

// READABLE (for understanding):
async function updateSessionMetadata(sessionId, metadata) {
    const { accessToken, orgUUID } = await getAuthContext();
    const url = `${getApiBaseUrl()}/v1/sessions/${sessionId}`;

    await fetch(url, {
        method: "PATCH",
        headers: {
            ...getAuthHeaders(accessToken),
            "x-organization-uuid": orgUUID,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: metadata.title
        })
    });
}
```

---

## 3. Message Routing

### 3.1 Local → Remote Flow

```
┌─────────────────────────────────────────────────────────┐
│           LOCAL TO REMOTE MESSAGE FLOW                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  User Input                                             │
│     │                                                   │
│     ▼                                                   │
│  [v2.1.76: Rapid message batching check]               │
│     │   If < 500ms since last message: add to batch    │
│     │   Else: send immediately                         │
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
│     ├─> [v2.1.76: JWT refresh redelivery check]        │
│     │   If 401: refresh token → redeliver              │
│     │                                                   │
│     ▼                                                   │
│  Remote agent processes message                        │
│     │                                                   │
│     └─> Streams response back via WebSocket            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 3.2 Remote → Local Flow

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
│              │   - [v2.1.76] Extract title if first   │
│              │                                          │
│              └─> tool_progress?                        │
│                  - Show tool execution status          │
│                  - Update progress indicators          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Stream Event Processing

### 4.1 Streaming Message Adaptation

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
5. (v2.1.76) When first assistant response completes, extract and propagate session title

---

## 5. Permission Request Synchronization

### 5.1 Request-Response Pairing

**Request Storage**:
```javascript
class RemoteSessionManager {
    pendingPermissionRequests = new Map();  // request_id → request

    handleControlRequest(request) {
        const requestId = request.request_id;
        this.pendingPermissionRequests.set(requestId, request);
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

    this.websocket.sendControlResponse(response);
    this.pendingPermissionRequests.delete(requestId);
}
```

**Key Property**: Request ID ensures responses match requests even with concurrent permission dialogs.

---

## 6. Connection Timeout Handling

**Timeout Detection** (useRemoteSession hook):

```javascript
// After sending message, start 30s timeout
const timeoutId = setTimeout(() => {
    showNotification({
        message: "Remote session seems stuck. Reconnecting...",
        dismissible: true
    });
    remoteSessionManager.reconnect();
}, 30000);

remoteSessionManager.onMessage(() => {
    clearTimeout(timeoutId);
});
```

**Reconnection Effect**:
1. Closes current WebSocket connection
2. Resets reconnect attempts to 0
3. Establishes new connection
4. Re-subscribes to session events
5. (v2.1.76) If session was idle for >30min: attempts idle session recovery before full re-hydration

---

## 7. State Reconciliation

### 7.1 Message Ordering Guarantees

**Server-Side Ordering**:
- All events timestamped on receipt
- WebSocket stream delivers events in chronological order
- Control messages interleaved with data messages (same stream)

**Client-Side Handling**:
- Sequential processing (no concurrent message handlers)
- Permission requests block until response sent
- Message history append-only (no retroactive edits)

### 7.2 Session Name Through Reconciliation

In v2.1.76, session name reconciliation follows this rule:
- **Manual name wins**: If the user has explicitly renamed the session via `/rename`, that name is preserved indefinitely
- **Automatic name updated**: If the session has an automatic name (from first prompt), and the session is resumed with a different first message visible, the name may be updated to reflect the new context
- **Remote wins on conflict**: If the CLI and remote have different titles, the remote (server) title takes precedence on reconnect (it reflects what other clients may have seen)

---

## Summary

State synchronization in remote sessions is **eventually consistent** with **strict ordering**:

1. **Message History Upload**: Pre-sync before new messages
2. **WebSocket Streaming**: Real-time event delivery
3. **Permission Pairing**: request_id ensures correct response routing
4. **Timeout Recovery**: 30s timeout triggers reconnection
5. **Tool Delegation**: Remote execution, local permission
6. **Offline Handling**: Fail-fast (no queuing) — except for JWT redelivery queue (v2.1.76)
7. **Session Title**: Automatically set and preserved through compaction and reconnects (v2.1.76)

**Key insight**: System prioritizes **consistency** over **availability** — when disconnected, operations fail rather than queue, ensuring the user always sees the true connection state. The JWT redelivery mechanism is the one exception: a single message is held pending token refresh, not queued indefinitely.
