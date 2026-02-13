# Remote Sessions - WebSocket Protocol

## Module Overview

Analysis of the WebSocket protocol used for remote agent execution in Claude Code v2.1.38.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Remote sessions

Key classes:
- `SessionsWebSocket` (fQA) - Low-level WebSocket transport
- `RemoteSessionManager` (VQA) - High-level session orchestration
- `sendEventToRemoteSession` (JM6) - Send events to remote

---

## 1. Connection Architecture

### 1.1 WebSocket Endpoint

**URL Format**:
```
wss://api.anthropic.com/v1/sessions/ws/{sessionId}/subscribe?organization_uuid={orgUuid}
```

**Authentication Headers**:
```javascript
{
    "Authorization": "Bearer {accessToken}",
    "anthropic-version": "2023-06-01"
}
```

### 1.2 Connection Lifecycle

```
┌──────────────────────────────────────────────────────────┐
│          WEBSOCKET CONNECTION LIFECYCLE                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [closed]                                                │
│     │                                                    │
│     │ connect()                                          │
│     ▼                                                    │
│  [connecting]                                            │
│     │                                                    │
│     ├─> Success: onOpen()                               │
│     │     ▼                                              │
│     │  [connected]                                       │
│     │     │                                              │
│     │     ├─> Send/Receive messages                     │
│     │     ├─> Ping every 30s                           │
│     │     │                                              │
│     │     ├─> Close (normal)                            │
│     │     │     ▼                                        │
│     │     │  [closed]                                   │
│     │     │                                              │
│     │     └─> Close (error)                             │
│     │           ├─> reconnectAttempts < 5?             │
│     │           │   YES: Wait 2s → [connecting]        │
│     │           │   NO: [closed] (give up)             │
│     │           └─────────────────────────────          │
│     │                                                    │
│     └─> Error: onError()                                │
│           └─> [closed]                                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Reconnection Strategy**:
- Max attempts: 5
- Interval: 2000ms (2 seconds)
- Exponential backoff: Not implemented (constant 2s)

---

## 2. Message Protocol

### 2.1 Message Types

**Valid Types**:
```javascript
{
    "assistant",      // AI response
    "user",          // User input
    "result",        // Tool execution result
    "stream_event",  // Streaming token
    "system",        // System notification
    "control_request",   // Permission request
    "control_response",  // Permission response
    "tool_progress",     // Tool execution progress
    "auth_status"        // Authentication status
}
```

**Classification**:
- **Data Messages**: `assistant`, `user`, `result`, `stream_event`, `system`, `tool_progress`, `auth_status`
- **Control Messages**: `control_request`, `control_response`

### 2.2 Message Format

**User Message**:
```json
{
    "events": [{
        "uuid": "uuid-v4",
        "session_id": "session_123",
        "type": "user",
        "parent_tool_use_id": null,
        "message": {
            "role": "user",
            "content": "User's message text"
        }
    }]
}
```

**Control Request (Permission)**:
```json
{
    "type": "control_request",
    "request_id": "req_uuid",
    "request": {
        "subtype": "can_use_tool",
        "tool_name": "bash",
        "tool_use_id": "use_123",
        "input": {"command": "ls"},
        "blocked_path": "/root",
        "description": "Run shell command",
        "permission_suggestions": [...]
    }
}
```

**Control Response**:
```json
{
    "type": "control_response",
    "request_id": "req_uuid",
    "response": {
        "subtype": "can_use_tool",
        "behavior": "allow",
        "updatedInput": {...},
        "allowedPrompts": [...]
    }
}
```

---

## 3. Keepalive Mechanism

### 3.1 Ping/Pong

**Platform-Specific**:

**Bun Runtime**:
- Native WebSocket keepalive
- No explicit ping/pong

**Node.js**:
```javascript
if (this.state === "connected" && this.ws) {
    this.ws.ping();  // Every 30 seconds
}
```

**Pong Handling**:
```javascript
this.ws.on("pong", () => {
    debug("[SessionsWebSocket] Received pong");
    // No state change, just keepalive confirmation
});
```

---

## 4. Session Creation Flow

**API Call** (chunks.142.mjs:1220-1316):

```
POST /v1/sessions
Headers:
  Authorization: Bearer {token}
  anthropic-version: 2023-06-01
  X-Organization-UUID: {orgUuid}

Body:
{
    "environment_uuid": "{envUuid}",
    "initial_message": "User's first message",
    "context": {
        "sources": [{
            "type": "git",
            "git_sha": "abc123",
            "git_status": "clean",
            "git_branch": "main"
        }],
        "outcomes": []
    },
    "context_settings": {
        "model": "claude-sonnet-4-5"
    }
}

Response:
{
    "session_id": "session_xyz",
    "session_url": "https://claude.ai/session/session_xyz"
}
```

---

## 5. Error Handling

### 5.1 WebSocket Errors

```javascript
this.ws.addEventListener("error", (error) => {
    debug("[SessionsWebSocket] Error:", error);
    this.callbacks.onError?.(error);
    // Triggers reconnection if was previously connected
});
```

### 5.2 Message Send Failures

**HTTP Status Handling** (chunks.126.mjs):
```javascript
async function sendEventToRemoteSession(sessionId, event) {
    const response = await fetch(`/v1/sessions/${sessionId}/events`, {
        method: "POST",
        body: JSON.stringify({ events: [event] })
    });

    if (response.status < 500) {
        // Consider partial success (2xx, 3xx, 4xx)
        return response.status >= 200 && response.status < 300;
    }
    return false;  // 5xx = definite failure
}
```

---

## 6. Proxy Support

**Proxy Configuration** (chunks.176.mjs):

```javascript
function getProxyAgent(url) {
    const proxy = getProxyForUrl(url);
    if (!proxy) return undefined;

    if (url.startsWith("https:")) {
        return new HttpsProxyAgent(proxy);
    } else {
        return new HttpProxyAgent(proxy);
    }
}

// Used in WebSocket options:
new WebSocket(url, {
    agent: getProxyAgent(url),
    headers: authHeaders
});
```

---

## Summary

Remote Sessions WebSocket protocol provides:

1. **Persistent Connection**: Long-lived WebSocket for bidirectional communication
2. **Dual-Channel**: Data messages (content) + Control messages (permissions)
3. **Auto-Reconnection**: Up to 5 attempts with 2s intervals
4. **Keepalive**: Platform-specific ping/pong every 30s
5. **Secure**: WSS with OAuth bearer token authentication
6. **Proxy-Aware**: Supports HTTP/HTTPS proxies for corporate environments

**Key insight**: Control channel co-exists with data channel on same WebSocket, ensuring ordered processing of permission requests alongside message stream.
