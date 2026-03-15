# Remote Sessions Overview

## Overview

Claude Code v2.1.38 provides deep integration with "Web Sessions" hosted on Claude.ai. This allows users to start a conversation in the browser and continue it in the CLI, or vice-versa. The CLI interacts with a backend API to list, retrieve, and send events to these remote sessions.

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

**Why this approach**:
By requiring an `orgUUID` for session access, Claude Code ensures that enterprise and individual project contexts remain isolated and secure.

### [Algorithm] Event-Based Synchronization

**How it works**:
Instead of simply sending raw text, the CLI sends structured "events" (`chunks.126.mjs:2724`).
1. Wraps the message in an event object with a unique UUID.
2. Identifies the message role (`user`).
3. Posts to `/v1/sessions/${sessionId}/events`.
4. The backend process calculates the agent's response and broadcasts it back to any connected clients (browser or CLI).

**Why this approach**:
This architecture allows multiple clients to stay in sync. If a user is looking at the web UI while typing in the terminal, the web UI will update in real-time as events are processed.

## Code Snippets

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

## Related Symbols

- `listRemoteSessions` (`uI4`) - List tool.
- `getRemoteSession` (`KQ1`) - Fetch tool.
- `sendEventToRemoteSession` (`JM6`) - Event sender.
- `getAuthContext` (`PN`) - Auth helper.

## Location References

- `chunks.126.mjs:2644` - `listRemoteSessions` implementation.
- `chunks.126.mjs:2699` - `getRemoteSession` implementation.
- `chunks.126.mjs:2724` - `sendEventToRemoteSession` implementation.
- `chunks.185.mjs:1457` - `useRemoteSession` hook.
