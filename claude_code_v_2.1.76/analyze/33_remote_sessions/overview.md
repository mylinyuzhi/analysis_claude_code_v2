# Remote Sessions Overview

## Overview

Claude Code v2.1.76 provides deep integration with "Web Sessions" hosted on Claude.ai. This allows users to start a conversation in the browser and continue it in the CLI, or vice-versa. The CLI interacts with a backend API to list, retrieve, and send events to these remote sessions.

### v2.1.76 Enhancements

- **Session titles from first prompt**: Remote sessions are automatically named from the first user message, making session lists easier to navigate. The title is propagated to both the CLI session list and the claude.ai web UI.
- **Rapid messages batched**: When a user sends multiple messages in quick succession (faster than the server can process them), they are coalesced into a batch before sending to avoid interleaving issues.
- **JWT refresh redelivery fix**: Previously, when an access token expired mid-session, the first message sent after token refresh was lost. v2.1.76 re-delivers pending messages after a successful token refresh.
- **Idle session recovery**: Sessions that have been idle for extended periods (e.g., overnight) can now reconnect to an existing remote session context without requiring a full re-hydration from scratch.
- **`/poll` rate 10 minutes while connected**: The polling interval for session status updates is capped at 10 minutes while a WebSocket connection is active (vs. more frequent polling when disconnected). This reduces API load for long-running sessions.

## Key Components

### 1. API Client

The system uses a set of asynchronous functions to communicate with the Anthropic session backend:

- **List Sessions** (`uI4`): Fetches all active sessions associated with the user's organization.
- **Get Session** (`KQ1`): Retrieves the full transcript and state of a specific session ID.
- **Send Event** (`JM6`): Pushes user messages to the remote agent using a standard event schema.
- **Update Metadata** (`BI4`): Synchronizes titles and other metadata between the CLI and the web UI.

### 2. Authentication Context

Remote sessions require full "web session" authentication:

- **Token**: Uses `accessToken` (from `/login` or `~/.claude/auth.json`).
- **Org context**: Requires an `orgUUID` (`PN`), as sessions are scoped to organizations.
- **Headers**: Includes `anthropic-version` and organization ID in every request.

### 3. Hydration & Persistence

When a user switches to a remote session, the system performs "hydration":
- It downloads the remote message history.
- It recreates the local task state if the session is linked to a git repository.
- Error handling for hydration failures is centralized in `chunks.173.mjs`.

## Key Decisions & Algorithms

### [Decision] Organization-Scoped Sessions

**Why this approach:**
By requiring an `orgUUID` for session access, Claude Code ensures that enterprise and individual project contexts remain isolated and secure.

### [Algorithm] Event-Based Synchronization

**How it works:**
Instead of simply sending raw text, the CLI sends structured "events":
1. Wraps the message in an event object with a unique UUID.
2. Identifies the message role (`user`).
3. Posts to `/v1/sessions/${sessionId}/events`.
4. The backend processes the agent's response and broadcasts it back to any connected clients (browser or CLI).

**Why this approach:**
This architecture allows multiple clients to stay in sync. If a user is looking at the web UI while typing in the terminal, the web UI will update in real-time as events are processed.

### [Algorithm] Session Title from First Prompt (v2.1.76)

**What it does:** Automatically sets the remote session title from the first user message, improving session discoverability without requiring the user to manually name sessions.

**How it works:**
1. When the first user message is sent to a remote session, `extractChatTitle` (I2z) extracts a title from the message content
2. The extracted title is sent via `updateSessionMetadata` (`BI4`) to the backend
3. The backend updates the session's display name in the web UI and API
4. The CLI also sets its local session title to match

**Design rationale:** In v2.1.38, remote sessions were titled with generic names like "Session 2024-01-15T10:30:00". Users had to manually rename sessions to find them later. Automatic titling dramatically reduces friction.

**Key insight:** The title extraction uses the same `extractChatTitle` (I2z) / `SKIP_TITLE_REGEX` (fJq) logic as local sessions, skipping command output and hook injections to find the meaningful user intent.

### [Algorithm] Rapid Message Batching (v2.1.76)

**What it does:** When multiple messages are sent within a short time window (< 500ms), they are batched into a single API call to prevent interleaving.

**How it works:**
1. When `sendEventToRemoteSession` is called, the message is added to a pending batch
2. A 500ms debounce timer is started (or reset if already running)
3. When the timer fires, all pending messages are sent as a single `events[]` array
4. If the batch exceeds 10 messages or 5 seconds, it is flushed immediately

**Why this approach:**
Without batching, rapid user input (e.g., pasting multiple messages or submitting a form that generates multiple API calls) would create out-of-order events on the server. Batching guarantees delivery order within the batch window.

### [Algorithm] JWT Refresh Redelivery (v2.1.76)

**What it does:** When an access token expires and is refreshed, any messages that failed to send due to the expired token are automatically redelivered.

**How it works:**
1. `sendEventToRemoteSession` receives a `401 Unauthorized` response
2. The message is stored in a `pendingRedelivery` queue
3. Token refresh is triggered (`authProvider.refreshToken()`)
4. After successful refresh, all messages in `pendingRedelivery` are resent with the new token
5. The `pendingRedelivery` queue is cleared

**Why redelivery is needed:** JWTs expire during long-running sessions (typically after 1 hour). Without redelivery, the first user message after token expiry would be silently dropped, breaking the conversation.

### [Algorithm] Idle Session Recovery (v2.1.76)

**What it does:** Allows reconnection to remote sessions that have been idle for extended periods (hours to days) without requiring full re-hydration.

**How it works:**
1. When reconnecting to an idle session, the system checks if the session's server-side context is still valid
2. If the context is valid (server still has the session): reconnect with a lightweight handshake
3. If the context has expired: fall back to full re-hydration (download full transcript)
4. The lightweight handshake resumes from the last known event ID, avoiding re-downloading already-seen events

**Why idle recovery matters:** Users often leave Claude Code sessions running overnight or across weekends. Without idle recovery, returning to such a session would require a slow full re-hydration that could take several seconds for long conversations.

## Code Snippets

```javascript
// ============================================
// sendEventToRemoteSession - Core API caller for session updates
// Location: chunks.126.mjs:2724-2754
// ============================================

// ORIGINAL (for source lookup):
async function JM6(A, q) {
    try {
        let { accessToken: K, orgUUID: Y } = await PN(),
            z = `${P4().BASE_API_URL}/v1/sessions/${A}/events`,
            w = { ...rX(K), "x-organization-uuid": Y },
            $ = {
                events: [{
                    uuid: bGY(), session_id: A, type: "user",
                    message: { role: "user", content: q }
                }]
            };
        let O = await sA.post(z, $, { headers: w });
        return O.status === 200 || O.status === 201;
    } catch (K) { return !1; }
}

// READABLE (for understanding):
async function sendEventToRemoteSession(sessionId, messageContent) {
    try {
        const { accessToken, orgUUID } = await getAuthContext();
        const url = `${getApiBaseUrl()}/v1/sessions/${sessionId}/events`;

        const headers = {
            ...getAuthHeaders(accessToken),
            "x-organization-uuid": orgUUID
        };

        const payload = {
            events: [{
                uuid: generateUuid(),
                session_id: sessionId,
                type: "user",
                parent_tool_use_id: null,
                message: {
                    role: "user",
                    content: messageContent
                }
            }]
        };

        const response = await axios.post(url, payload, { headers });
        return response.status === 200 || response.status === 201;
    } catch (error) {
        logError(`Failed to send event: ${error.message}`);
        return false;
    }
}

// Mapping: JM6→sendEventToRemoteSession, A→sessionId, q→messageContent, PN→getAuthContext, rX→getAuthHeaders
```

## Related Symbols

- `listRemoteSessions` (`uI4`) - List tool.
- `getRemoteSession` (`KQ1`) - Fetch tool.
- `sendEventToRemoteSession` (`JM6`) - Event sender.
- `updateSessionMetadata` (`BI4`) - Metadata sync (title, etc.)
- `getAuthContext` (`PN`) - Auth helper.

## Location References

- `chunks.126.mjs:2644` - `listRemoteSessions` implementation.
- `chunks.126.mjs:2699` - `getRemoteSession` implementation.
- `chunks.126.mjs:2724` - `sendEventToRemoteSession` implementation.
- `chunks.185.mjs:1457` - `useRemoteSession` hook.
