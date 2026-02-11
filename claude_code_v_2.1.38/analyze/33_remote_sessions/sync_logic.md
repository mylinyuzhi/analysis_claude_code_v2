# Remote Session Synchronization Logic Analysis

## Module Overview

Remote Sessions allow the Claude Code CLI to synchronize its state with a remote interface (e.g., a web UI). This enables features like "handing off" a session from the CLI to the web, or allowing a web-based "Control Plane" to oversee a local CLI agent.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions and classes in this document:
- `sendEventToRemoteSession` (JM6) - Core function for event delivery via POST
- `RemoteSessionManager` - Coordinates WebSocket and HTTP communications
- `useRemoteSession` - React hook for managing session state in the UI

## Core Architecture

1. **Local State**: The CLI maintains its own `AppState` (messages, tools, tasks).
2. **Synchronization**: Whenever the local state changes, or a specific event occurs (e.g., tool use, output stream), an event is dispatched to the remote session.
3. **Control Channel (WebSocket)**: Used for incoming real-time events from the remote UI, such as:
   - Tool permission approvals/denials.
   - Interrupt (Cancel) signals.
   - User input from the web.
4. **Data Channel (HTTP POST)**: Used for outgoing batch data or state hydration.

### Event Synchronization (Algorithm)

**What it does:** Sends local CLI events to the remote session server to keep the UI in sync.

**How it works:**
1. Formats the event data (type, payload, timestamp).
2. Uses `JM6` to perform an HTTP POST request to the remote session endpoint.
3. Includes the `sessionId` from the environment (`CLAUDE_CODE_REMOTE_SESSION_ID`).
4. Handles failures by logging and potentially retrying (via the manager).

```javascript
// ============================================
// sendEventToRemoteSession - Event delivery logic
// Location: chunks.126.mjs:2724-2753
// ============================================

// ORIGINAL (for source lookup):
async function JM6(A, q) {
    try {
        h(`[sendEventToRemoteSession] Sending event to session ${A}`);
        let K = await fetch(`${baseURL}/sessions/${A}/events`, {
            method: "POST",
            body: JSON.stringify(q),
            headers: { "Content-Type": "application/json" }
        });
        if (K.status === 200 || K.status === 201) return !0;
        return !1;
    } catch (Y) {
        return !1;
    }
}

// READABLE (for understanding):
async function sendEventToRemoteSession(sessionId, eventData) {
    try {
        logDebug(`[sendEventToRemoteSession] Sending event to session ${sessionId}`);
        
        const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/events`, {
            method: "POST",
            body: JSON.stringify(eventData),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await getAccessToken()}`
            }
        });
        
        if (response.ok) {
            logDebug(`[sendEventToRemoteSession] Successfully sent event`);
            return true;
        } else {
            logError(`[sendEventToRemoteSession] Failed with status ${response.status}`);
            return false;
        }
    } catch (error) {
        logError(`[sendEventToRemoteSession] Error: ${error.message}`);
        return false;
    }
}

// Mapping: JM6→sendEventToRemoteSession, A→sessionId, q→eventData, K→response
```

## State Hydration

When a remote session is initiated, the CLI needs to "catch up" with any existing state on the server.

```javascript
// ============================================
// hydrateRemoteSession - Initial state loading
// Location: cli.chunks.mjs:5821 (EntryPoint)
// ============================================

async function hydrateRemoteSession(sessionId) {
    logDebug(`[Hydration] Loading state for session ${sessionId}`);
    const state = await fetchSessionState(sessionId);
    
    if (state) {
        // Hydrate messages, tasks, and environment context
        setAppState({
            messages: state.messages,
            tasks: state.tasks,
            teamContext: state.teamContext
        });
        logDebug("[Hydration] State restored successfully");
    }
}
```

## Permission Delegation

A key feature of Remote Sessions is the ability to delegate tool permissions to a human in the Web UI.
- When the agent attempts a "Protected" tool use, the `RemoteSessionManager` intercepts the request.
- It sends a `can_use_tool` event via WebSocket to the web client.
- The web client responds with an `approve` or `reject` signal.
- The manager then resumes or aborts the tool call based on this signal.

**Key insight:** This mechanism allows "Human-in-the-loop" oversight for local agents without requiring the user to be at the terminal.
