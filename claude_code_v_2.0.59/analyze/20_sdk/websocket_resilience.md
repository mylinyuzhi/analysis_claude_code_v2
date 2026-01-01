# WebSocket Resilience Patterns

> Deep analysis of WebSocket connection management, reconnection, and message buffering.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - SDK Transport module

Key classes in this document:
- `ResilientWebSocket` (OD0) - WebSocket connection manager
- `RingBuffer` (K$A) - Message buffer for replay

Key constants:
- `WEBSOCKET_BUFFER_SIZE` (ng3) - 1000 messages
- `MAX_RECONNECT_ATTEMPTS` (Kw9) - 3 attempts
- `INITIAL_BACKOFF_MS` (ag3) - 1000ms
- `MAX_BACKOFF_MS` (sg3) - 30000ms
- `PING_INTERVAL_MS` (rg3) - 10000ms

---

## Overview

The `ResilientWebSocket` class (OD0) provides robust WebSocket connectivity with:

1. **Automatic Reconnection** - Exponential backoff on disconnection
2. **Message Buffering** - Ring buffer for replay after reconnection
3. **Health Monitoring** - Ping interval for connection verification
4. **State Machine** - Proper lifecycle management

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ResilientWebSocket Architecture                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────┐      ┌─────────────────┐      ┌────────────────┐ │
│   │   Application   │      │ ResilientWS     │      │   WebSocket    │ │
│   │                 │─────>│ (OD0)           │─────>│   Server       │ │
│   │                 │<─────│                 │<─────│                │ │
│   └─────────────────┘      │  ┌───────────┐  │      └────────────────┘ │
│                            │  │  Message  │  │                         │
│                            │  │  Buffer   │  │                         │
│                            │  │  (Ring)   │  │                         │
│                            │  └───────────┘  │                         │
│                            │  ┌───────────┐  │                         │
│                            │  │  State    │  │                         │
│                            │  │  Machine  │  │                         │
│                            │  └───────────┘  │                         │
│                            └─────────────────┘                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## State Machine

### States

| State | Description |
|-------|-------------|
| `idle` | Initial state, not connected |
| `reconnecting` | Connection attempt in progress |
| `connected` | Active connection |
| `closing` | Graceful shutdown in progress |
| `closed` | Connection terminated |

### State Transitions

```
              ┌──────────────────────────────────────────┐
              │                                          │
              ▼                                          │
         ┌─────────┐     connect()     ┌──────────────┐ │
         │  idle   │ ─────────────────>│ reconnecting │ │
         └─────────┘                   └──────┬───────┘ │
                                              │         │
                                   on "open"  │         │
                                              ▼         │
                                       ┌───────────┐   │
                                       │ connected │   │
                                       └─────┬─────┘   │
                                             │         │
                           ┌─────────────────┼─────────┘
                           │                 │
              on "error"   │    on "error"   │    close()
              or "close"   │    or "close"   │
                           │                 ▼
                           │          ┌───────────┐
                           │          │  closing  │
                           │          └─────┬─────┘
                           │                │
                           │                ▼
                           │          ┌───────────┐
                           └─────────>│  closed   │
                                      └───────────┘
                                             │
                                             │ max attempts
                                             │ exhausted
                                             ▼
                                    onCloseCallback()
```

---

## ResilientWebSocket Class

### Class Structure

```javascript
// ============================================
// ResilientWebSocket - WebSocket connection manager
// Location: chunks.156.mjs:2630-2770
// ============================================

// ORIGINAL (for source lookup):
class OD0 {
  ws = null;
  lastSentId = null;
  url;
  state = "idle";
  onData;
  onCloseCallback;
  headers;
  reconnectAttempts = 0;
  reconnectTimer = null;
  pingInterval = null;
  messageBuffer;

  constructor(A, Q = {}) {
    this.url = A, this.headers = Q, this.messageBuffer = new K$A(ng3)
  }
  // ... methods
}

// READABLE (for understanding):
class ResilientWebSocket {
  ws = null;                    // Raw WebSocket instance
  lastSentId = null;            // Last sent message UUID
  url;                          // WebSocket URL
  state = "idle";               // Current state
  onData;                       // Data callback
  onCloseCallback;              // Close callback
  headers;                      // Connection headers
  reconnectAttempts = 0;        // Current attempt count
  reconnectTimer = null;        // Reconnection timer
  pingInterval = null;          // Health check timer
  messageBuffer;                // Ring buffer for replay

  constructor(url, headers = {}) {
    this.url = url;
    this.headers = headers;
    this.messageBuffer = new RingBuffer(WEBSOCKET_BUFFER_SIZE);  // 1000
  }
}

// Mapping: OD0→ResilientWebSocket, A→url, Q→headers, K$A→RingBuffer, ng3→WEBSOCKET_BUFFER_SIZE
```

---

## Connection Management

### connect() Method

**What it does:** Establishes WebSocket connection with appropriate headers.

**How it works:**
1. Validate state (must be `idle` or `reconnecting`)
2. Set state to `reconnecting`
3. Add `X-Last-Request-Id` header if resuming
4. Create WebSocket with headers
5. Setup event handlers for open/message/error/close

```javascript
// ============================================
// connect() - Establish WebSocket connection
// Location: chunks.156.mjs:2645-2680
// ============================================

// READABLE:
connect() {
  // State validation
  if (this.state !== "idle" && this.state !== "reconnecting") {
    debug(`WebSocketTransport: Cannot connect, current state is ${this.state}`, {
      level: "error"
    });
    telemetry("error", "cli_websocket_connect_failed");
    return;
  }

  this.state = "reconnecting";
  debug(`WebSocketTransport: Opening ${this.url.href}`);

  // Build headers with last-sent-id for replay
  const headers = { ...this.headers };
  if (this.lastSentId) {
    headers["X-Last-Request-Id"] = this.lastSentId;
    debug(`WebSocketTransport: Adding X-Last-Request-Id header: ${this.lastSentId}`);
  }

  // Create WebSocket
  this.ws = new WebSocket(this.url.href, {
    headers: headers,
    agent: getProxyAgent(this.url.href)
  });

  // Handle successful connection
  this.ws.on("open", () => {
    debug("WebSocketTransport: Connected");

    // Check for server-acknowledged last-request-id
    const upgradeReq = this.ws.upgradeReq;
    if (upgradeReq?.headers?.["x-last-request-id"]) {
      const lastId = upgradeReq.headers["x-last-request-id"];
      this.replayBufferedMessages(lastId);
    }

    this.reconnectAttempts = 0;
    this.state = "connected";
    this.startPingInterval();
  });

  // Handle incoming data
  this.ws.on("message", (data) => {
    const text = data.toString();
    if (this.onData) this.onData(text);
  });

  // Handle errors
  this.ws.on("error", (error) => {
    debug(`WebSocketTransport: Error: ${error.message}`, { level: "error" });
    this.handleConnectionError();
  });

  // Handle close
  this.ws.on("close", (code, reason) => {
    debug(`WebSocketTransport: Closed: ${code}`, { level: "error" });
    this.handleConnectionError();
  });
}
```

**Key insight:** The `X-Last-Request-Id` header enables the server to acknowledge which messages have been received, allowing the client to replay only missing messages after reconnection.

---

## Reconnection Algorithm

### handleConnectionError() Method

**What it does:** Implements exponential backoff reconnection on connection failure.

**How it works:**
1. Disconnect and cleanup existing connection
2. Check if in `closing` or `closed` state (skip reconnection)
3. Check if max attempts reached
4. Calculate backoff: `min(1000ms * 2^(attempt-1), 30000ms)`
5. Schedule reconnection timer
6. If exhausted, call close callback

```javascript
// ============================================
// handleConnectionError - Exponential backoff reconnection
// Location: chunks.156.mjs:2694-2710
// ============================================

// ORIGINAL:
handleConnectionError() {
  if (g(`WebSocketTransport: Disconnected from ${this.url.href}`), k6("info", "cli_websocket_disconnected"),
      this.doDisconnect(), this.state === "closing" || this.state === "closed") return;
  if (this.reconnectAttempts < Kw9) {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
    this.state = "reconnecting", this.reconnectAttempts++;
    let A = Math.min(ag3 * Math.pow(2, this.reconnectAttempts - 1), sg3);
    g(`WebSocketTransport: Reconnecting in ${A}ms (attempt ${this.reconnectAttempts}/${Kw9})`),
    k6("error", "cli_websocket_reconnect_attempt", { reconnectAttempts: this.reconnectAttempts }),
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null, this.connect()
    }, A)
  } else if (g(`WebSocketTransport: Max reconnection attempts reached for ${this.url.href}`, {
      level: "error"
    }), k6("error", "cli_websocket_reconnect_exhausted", {
      reconnectAttempts: this.reconnectAttempts
    }), this.state = "closed", this.onCloseCallback) this.onCloseCallback()
}

// READABLE:
handleConnectionError() {
  debug(`WebSocketTransport: Disconnected from ${this.url.href}`);
  telemetry("info", "cli_websocket_disconnected");

  // Cleanup existing connection
  this.doDisconnect();

  // Skip reconnection if closing/closed
  if (this.state === "closing" || this.state === "closed") {
    return;
  }

  // Check if we can retry
  if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {  // 3
    // Clear any existing timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.state = "reconnecting";
    this.reconnectAttempts++;

    // Calculate exponential backoff
    // Attempt 1: 1000ms, Attempt 2: 2000ms, Attempt 3: 4000ms (capped at 30000ms)
    const backoffMs = Math.min(
      INITIAL_BACKOFF_MS * Math.pow(2, this.reconnectAttempts - 1),
      MAX_BACKOFF_MS
    );

    debug(`WebSocketTransport: Reconnecting in ${backoffMs}ms (attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
    telemetry("error", "cli_websocket_reconnect_attempt", {
      reconnectAttempts: this.reconnectAttempts
    });

    // Schedule reconnection
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, backoffMs);
  } else {
    // Max attempts exhausted
    debug(`WebSocketTransport: Max reconnection attempts reached for ${this.url.href}`, {
      level: "error"
    });
    telemetry("error", "cli_websocket_reconnect_exhausted", {
      reconnectAttempts: this.reconnectAttempts
    });

    this.state = "closed";

    // Notify callback
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }
}

// Mapping: g→debug, k6→telemetry, Kw9→MAX_RECONNECT_ATTEMPTS
// ag3→INITIAL_BACKOFF_MS, sg3→MAX_BACKOFF_MS, A→backoffMs
```

### Backoff Calculation

| Attempt | Backoff (ms) | Formula |
|---------|-------------|---------|
| 1 | 1000 | min(1000 × 2^0, 30000) |
| 2 | 2000 | min(1000 × 2^1, 30000) |
| 3 | 4000 | min(1000 × 2^2, 30000) |
| 4+ | - | Max attempts exhausted |

**Why exponential backoff:**
- Prevents connection storms when server is overloaded
- Allows server time to recover
- Limits resource consumption during outages
- Cap at 30 seconds prevents excessive waits

---

## Message Buffering

### write() Method

**What it does:** Sends message and buffers for potential replay.

**How it works:**
1. If message has `uuid`, add to ring buffer and update `lastSentId`
2. Serialize to JSON + newline
3. If connected, send via WebSocket

```javascript
// ============================================
// write() - Send and buffer message
// Location: chunks.156.mjs:2749-2755
// ============================================

// ORIGINAL:
write(A) {
  if ("uuid" in A && typeof A.uuid === "string")
    this.messageBuffer.add(A), this.lastSentId = A.uuid;
  let Q = JSON.stringify(A) + `\n`;
  if (this.state !== "connected") return;
  this.sendLine(Q)
}

// READABLE:
write(message) {
  // Buffer messages with UUID for replay
  if ("uuid" in message && typeof message.uuid === "string") {
    this.messageBuffer.add(message);
    this.lastSentId = message.uuid;
  }

  const serialized = JSON.stringify(message) + "\n";

  // Only send if connected
  if (this.state !== "connected") {
    return;  // Message is buffered, will be replayed on reconnect
  }

  this.sendLine(serialized);
}

// Mapping: A→message, Q→serialized
```

**Key insight:** Messages without `uuid` are not buffered (like keep-alive pings). Only meaningful messages with UUIDs are preserved for replay.

### replayBufferedMessages() Method

**What it does:** Replays buffered messages after reconnection.

**How it works:**
1. Get all buffered messages as array
2. Find index of last-acknowledged message (by UUID)
3. Slice array to get only un-acknowledged messages
4. Send each message in order
5. Stop on send failure (triggers another reconnection)

```javascript
// ============================================
// replayBufferedMessages - Replay after reconnect
// Location: chunks.156.mjs:2715-2739
// ============================================

// ORIGINAL:
replayBufferedMessages(A) {
  let Q = this.messageBuffer.toArray();
  if (Q.length === 0) return;
  let B = 0;
  if (A) {
    let Z = Q.findIndex((I) => ("uuid" in I) && I.uuid === A);
    if (Z >= 0) B = Z + 1
  }
  let G = Q.slice(B);
  if (G.length === 0) {
    g("WebSocketTransport: No new messages to replay"),
    k6("info", "cli_websocket_no_messages_to_replay");
    return
  }
  g(`WebSocketTransport: Replaying ${G.length} buffered messages`),
  k6("info", "cli_websocket_messages_to_replay", { count: G.length });
  for (let Z of G) {
    let I = JSON.stringify(Z) + `\n`;
    if (!this.sendLine(I)) {
      this.handleConnectionError();
      break
    }
  }
}

// READABLE:
replayBufferedMessages(lastAcknowledgedId) {
  const allMessages = this.messageBuffer.toArray();
  if (allMessages.length === 0) return;

  // Find starting point (after last acknowledged message)
  let startIndex = 0;
  if (lastAcknowledgedId) {
    const acknowledgedIndex = allMessages.findIndex((msg) =>
      ("uuid" in msg) && msg.uuid === lastAcknowledgedId
    );
    if (acknowledgedIndex >= 0) {
      startIndex = acknowledgedIndex + 1;
    }
  }

  // Get messages to replay
  const messagesToReplay = allMessages.slice(startIndex);
  if (messagesToReplay.length === 0) {
    debug("WebSocketTransport: No new messages to replay");
    return;
  }

  debug(`WebSocketTransport: Replaying ${messagesToReplay.length} buffered messages`);

  // Replay each message
  for (const message of messagesToReplay) {
    const serialized = JSON.stringify(message) + "\n";
    if (!this.sendLine(serialized)) {
      // Send failed, trigger reconnection
      this.handleConnectionError();
      break;
    }
  }
}

// Mapping: A→lastAcknowledgedId, Q→allMessages, B→startIndex, G→messagesToReplay
// Z→message/acknowledgedIndex, I→serialized
```

---

## Health Monitoring

### Ping Interval

**Purpose:** Verify connection health and detect silent failures.

```javascript
// ============================================
// Ping interval management
// Location: chunks.156.mjs:2756-2769
// ============================================

// ORIGINAL:
startPingInterval() {
  this.stopPingInterval(), this.pingInterval = setInterval(() => {
    if (this.state === "connected" && this.ws) try {
      this.ws.ping()
    } catch (A) {
      g(`WebSocketTransport: Ping failed: ${A}`, { level: "error" }),
      k6("error", "cli_websocket_ping_failed")
    }
  }, rg3)
}

stopPingInterval() {
  if (this.pingInterval) clearInterval(this.pingInterval), this.pingInterval = null
}

// READABLE:
startPingInterval() {
  this.stopPingInterval();

  this.pingInterval = setInterval(() => {
    if (this.state === "connected" && this.ws) {
      try {
        this.ws.ping();  // WebSocket ping frame
      } catch (error) {
        debug(`WebSocketTransport: Ping failed: ${error}`, { level: "error" });
        telemetry("error", "cli_websocket_ping_failed");
      }
    }
  }, PING_INTERVAL_MS);  // 10000ms = 10 seconds
}

stopPingInterval() {
  if (this.pingInterval) {
    clearInterval(this.pingInterval);
    this.pingInterval = null;
  }
}

// Mapping: rg3→PING_INTERVAL_MS, A→error
```

**Why ping interval:**
- WebSocket connections can silently fail (no TCP close)
- Server may have timeout without notification
- Ping frames verify end-to-end connectivity
- Failed ping indicates connection problem

---

## Ring Buffer

### Buffer Characteristics

| Property | Value | Purpose |
|----------|-------|---------|
| Size | 1000 messages | Limit memory usage |
| Type | Ring (FIFO eviction) | Oldest messages dropped first |
| Key | UUID | Message identification for replay |

### Usage Pattern

```
┌───────────────────────────────────────────────────────────────┐
│                    Ring Buffer (1000 slots)                   │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  write(msg1)  ──>  [msg1][ ][ ][ ]...                        │
│  write(msg2)  ──>  [msg1][msg2][ ][ ]...                     │
│  ...                                                          │
│  write(msg1001) ──> [msg2][msg3]...[msg1001]                 │
│                      └── msg1 evicted (FIFO)                  │
│                                                               │
│  On reconnect:                                                │
│  lastAcknowledgedId = "msg500"                               │
│  replayBufferedMessages() ──> send msg501, msg502, ...       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Constants Reference

```javascript
// ============================================
// WebSocket Constants
// Location: chunks.156.mjs:2772-2780
// ============================================

// ORIGINAL:
ng3 = 1000   // WEBSOCKET_BUFFER_SIZE
Kw9 = 3     // MAX_RECONNECT_ATTEMPTS
ag3 = 1000  // INITIAL_BACKOFF_MS
sg3 = 30000 // MAX_BACKOFF_MS
rg3 = 1e4   // PING_INTERVAL_MS (10000)

// READABLE:
const WEBSOCKET_BUFFER_SIZE = 1000;      // Max buffered messages
const MAX_RECONNECT_ATTEMPTS = 3;        // Reconnection limit
const INITIAL_BACKOFF_MS = 1000;         // First retry delay
const MAX_BACKOFF_MS = 30000;            // Maximum retry delay
const PING_INTERVAL_MS = 10000;          // Health check interval
```

---

## Telemetry Events

| Event | Level | Description |
|-------|-------|-------------|
| `cli_websocket_connect_opening` | info | Connection attempt started |
| `cli_websocket_connect_connected` | info | Connection established |
| `cli_websocket_connect_failed` | error | Connection state invalid |
| `cli_websocket_connect_error` | error | WebSocket error event |
| `cli_websocket_connect_closed` | error | WebSocket closed |
| `cli_websocket_disconnected` | info | Disconnect detected |
| `cli_websocket_reconnect_attempt` | error | Reconnection scheduled |
| `cli_websocket_reconnect_exhausted` | error | Max attempts reached |
| `cli_websocket_send_not_connected` | info | Send while disconnected |
| `cli_websocket_send_error` | error | Send failed |
| `cli_websocket_ping_failed` | error | Ping frame failed |
| `cli_websocket_no_messages_to_replay` | info | Replay not needed |
| `cli_websocket_messages_to_replay` | info | Replaying N messages |

---

## Related Documents

- [overview.md](./overview.md) - SDK architecture overview
- [transport_layer.md](./transport_layer.md) - Transport implementation
- [message_protocol.md](./message_protocol.md) - Message format details
