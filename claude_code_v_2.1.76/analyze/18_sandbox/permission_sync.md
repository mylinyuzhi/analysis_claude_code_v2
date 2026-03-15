# Swarm Sandbox Permission Sync (Claude Code 2.1.38)

## Overview

In multi-agent (swarm) mode, worker agents run in sandboxed environments with network restrictions. When a worker encounters a network request to an unknown domain, it cannot prompt the user directly -- only the leader agent has UI access. The permission sync protocol enables workers to request network permission from the leader via a mailbox-based message passing system, and receive the leader's allow/deny decision asynchronously.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents)

Key functions in this document:
- `generateSandboxRequestId` (Ib4) - Creates unique request ID: `sandbox-<timestamp>-<random>`
- `sendSandboxPermissionRequest` (xb4) - Worker sends permission request to leader via mailbox
- `sendSandboxPermissionResponse` (bb4) - Leader sends allow/deny decision to worker via mailbox
- `registerSandboxCallback` (mb4) - Worker registers a Promise resolver for a pending request
- `hasSandboxCallback` (Fb4) - Checks if a sandbox callback exists for a request ID
- `processSandboxResponse` (Qb4) - Worker processes leader's response and resolves the Promise
- `registerPermissionCallback` (lM6) - Registers a standard (non-sandbox) permission callback
- `processPermissionResponse` (eP1) - Processes standard permission responses from mailbox
- `sendPermissionRequest` - Sends tool permission request to leader for approval
- `sendPermissionResponse` - Leader sends tool permission decision back to worker
- `PermissionRequestSchema` (ZAH) - Zod schema defining permission request structure

---

## Protocol Architecture

```
Worker Agent (sandboxed)                Leader Agent (has UI)
========================                ====================

1. Command requires network
   to unknown domain
        |
        v
2. generateSandboxRequestId()
   -> "sandbox-1707123456-abc123"
        |
        v
3. sendSandboxPermissionRequest()
   - Looks up team name, leader name
   - Creates typed message via uvA()
   - Posts to leader's mailbox
        |                                    |
        |  -------- mailbox msg -------->    |
        |                                    v
4. registerSandboxCallback()          5. Leader reads mailbox
   - Stores Promise resolver              - Sees sandbox permission request
   in cM6 Map                             - Shows UI prompt to user
   - Worker blocks/waits                       |
        |                                    v
        |                              6. User approves/denies
        |                                    |
        |                                    v
        |                              7. sendSandboxPermissionResponse()
        |                                 - Creates response message via BvA()
        |                                 - Posts to worker's mailbox
        |                                    |
        |  <------- mailbox msg ---------   |
        v
8. processSandboxResponse()
   - Finds callback in cM6 Map
   - Resolves Promise with allow/deny
   - Deletes callback
        |
        v
9. Network request proceeds or fails
```

---

## Request Flow: Worker Side

### Step 1: Generating Request IDs

```javascript
// ============================================
// generateSandboxRequestId - Creates unique sandbox permission request ID
// Location: chunks.130.mjs:2809-2811 (Ln 326587)
// ============================================

// ORIGINAL (for source lookup):
function Ib4() {
    return `sandbox-${Date.now()}-${Math.random().toString(36).substring(2,9)}`
}

// READABLE (for understanding):
function generateSandboxRequestId() {
    return `sandbox-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Mapping: Ib4->generateSandboxRequestId
```

**What it does:** Creates a globally unique request ID by combining a timestamp with a random string. The `sandbox-` prefix distinguishes these from regular permission requests.

**Why this approach:**
- Timestamp ensures ordering and debugging traceability
- Random suffix prevents collisions even if two workers request simultaneously
- The `sandbox-` prefix allows the mailbox poller to quickly identify the message type

### Step 2: Sending the Request

```javascript
// ============================================
// sendSandboxPermissionRequest - Worker sends network permission request to leader
// Location: chunks.130.mjs:2812-2839 (Ln 326591)
// ============================================

// ORIGINAL (for source lookup):
function xb4(A, q, K) {
    let Y = K || i3();
    if (!Y) return h("[PermissionSync] Cannot send sandbox permission request: team name not found"), !1;
    let z = hb4(Y);
    if (!z) return h("[PermissionSync] Cannot send sandbox permission request: leader name not found"), !1;
    let w = ID(), H = g5(), $ = b$();
    if (!w || !H) return h("[PermissionSync] Cannot send sandbox permission request: worker ID or name not found"), !1;
    try {
        let O = uvA({ requestId: q, workerId: w, workerName: H, workerColor: $, host: A });
        return f9(z, { from: H, text: Q1(O), timestamp: new Date().toISOString(), color: $ }, Y),
            h(`[PermissionSync] Sent sandbox permission request ${q} for host ${A} to leader ${z} via mailbox`), !0
    } catch (O) {
        return h(`[PermissionSync] Failed to send sandbox permission request via mailbox: ${O}`),
            K1(O instanceof Error ? O : Error(String(O))), !1
    }
}

// READABLE (for understanding):
function sendSandboxPermissionRequest(host, requestId, teamName) {
    let resolvedTeamName = teamName || getCurrentTeamName();
    if (!resolvedTeamName) {
        log("[PermissionSync] Cannot send sandbox permission request: team name not found");
        return false;
    }

    let leaderName = getLeaderNameForTeam(resolvedTeamName);
    if (!leaderName) {
        log("[PermissionSync] Cannot send sandbox permission request: leader name not found");
        return false;
    }

    let workerId = getWorkerId();
    let workerName = getAgentName();
    let workerColor = getAgentColor();
    if (!workerId || !workerName) {
        log("[PermissionSync] Cannot send sandbox permission request: worker ID or name not found");
        return false;
    }

    try {
        let message = createSandboxPermissionRequestMessage({
            requestId, workerId, workerName, workerColor, host
        });

        postToMailbox(leaderName, {
            from: workerName,
            text: JSON.stringify(message),
            timestamp: new Date().toISOString(),
            color: workerColor
        }, resolvedTeamName);

        log(`[PermissionSync] Sent sandbox permission request ${requestId} for host ${host} to leader ${leaderName} via mailbox`);
        return true;
    } catch (error) {
        log(`[PermissionSync] Failed to send sandbox permission request via mailbox: ${error}`);
        reportError(error instanceof Error ? error : Error(String(error)));
        return false;
    }
}

// Mapping: xb4->sendSandboxPermissionRequest, A->host, q->requestId, K->teamName, Y->resolvedTeamName, z->leaderName, w->workerId, H->workerName, $->workerColor, f9->postToMailbox, uvA->createSandboxPermissionRequestMessage, i3->getCurrentTeamName, hb4->getLeaderNameForTeam, ID->getWorkerId, g5->getAgentName, b$->getAgentColor
```

**How it works:**
1. Resolves the team name (passed or from current context)
2. Looks up the leader agent name for this team
3. Gets the current worker's identity (ID, name, color)
4. Constructs a typed message with all context needed for the leader to display a prompt
5. Posts to the leader's mailbox using `postToMailbox` (f9)

**Key insight:** The function includes the worker's color in the message. This allows the leader's UI to display the request with visual identification of which worker is asking, critical in swarms with many concurrent workers.

### Step 3: Registering the Callback

```javascript
// ============================================
// registerSandboxCallback - Registers a promise resolver for pending sandbox request
// Location: chunks.130.mjs:2918-2919 (Ln 326692)
// ============================================

// ORIGINAL (for source lookup):
function mb4(A) {
    cM6.set(A.requestId, A), h(`[SwarmPermissionPoller] Registered sandbox callback for request ${A.requestId}`)
}

// READABLE (for understanding):
function registerSandboxCallback(callbackEntry) {
    sandboxCallbackMap.set(callbackEntry.requestId, callbackEntry);
    log(`[SwarmPermissionPoller] Registered sandbox callback for request ${callbackEntry.requestId}`);
}

// Mapping: mb4->registerSandboxCallback, A->callbackEntry, cM6->sandboxCallbackMap
```

**What it does:** The callback entry contains a `resolve` function (from a Promise) that will be called when the leader responds. The worker creates a Promise, registers its resolver here, and then `await`s the Promise -- effectively blocking until the leader responds.

---

## Response Flow: Leader Side

### Step 4: Leader Sends Response

```javascript
// ============================================
// sendSandboxPermissionResponse - Leader sends allow/deny decision to worker
// Location: chunks.130.mjs:2840-2859 (Ln 326619)
// ============================================

// ORIGINAL (for source lookup):
function bb4(A, q, K, Y, z) {
    let w = z || i3();
    if (!w) return h("[PermissionSync] Cannot send sandbox permission response: team name not found"), !1;
    try {
        let H = BvA({ requestId: q, host: K, allow: Y }),
            $ = g5() || "team-lead";
        return f9(A, { from: $, text: Q1(H), timestamp: new Date().toISOString() }, w),
            h(`[PermissionSync] Sent sandbox permission response for ${q} (host: ${K}, allow: ${Y}) to worker ${A} via mailbox`), !0
    } catch (H) {
        return h(`[PermissionSync] Failed to send sandbox permission response via mailbox: ${H}`),
            K1(H instanceof Error ? H : Error(String(H))), !1
    }
}

// READABLE (for understanding):
function sendSandboxPermissionResponse(workerName, requestId, host, allow, teamName) {
    let resolvedTeamName = teamName || getCurrentTeamName();
    if (!resolvedTeamName) {
        log("[PermissionSync] Cannot send sandbox permission response: team name not found");
        return false;
    }

    try {
        let message = createSandboxPermissionResponseMessage({ requestId, host, allow });
        let senderName = getAgentName() || "team-lead";

        postToMailbox(workerName, {
            from: senderName,
            text: JSON.stringify(message),
            timestamp: new Date().toISOString()
        }, resolvedTeamName);

        log(`[PermissionSync] Sent sandbox permission response for ${requestId} (host: ${host}, allow: ${allow}) to worker ${workerName} via mailbox`);
        return true;
    } catch (error) {
        log(`[PermissionSync] Failed to send sandbox permission response via mailbox: ${error}`);
        reportError(error instanceof Error ? error : Error(String(error)));
        return false;
    }
}

// Mapping: bb4->sendSandboxPermissionResponse, A->workerName, q->requestId, K->host, Y->allow, z->teamName, BvA->createSandboxPermissionResponseMessage, f9->postToMailbox
```

### Step 5: Worker Processes Response

```javascript
// ============================================
// processSandboxResponse - Worker processes leader's sandbox permission decision
// Location: chunks.130.mjs:2926-2930 (Ln 326700)
// ============================================

// ORIGINAL (for source lookup):
function Qb4(A) {
    let q = cM6.get(A.requestId);
    if (!q) return h(`[SwarmPermissionPoller] No sandbox callback registered for request ${A.requestId}`), !1;
    return h(`[SwarmPermissionPoller] Processing sandbox response for request ${A.requestId}: allow=${A.allow}`),
        cM6.delete(A.requestId), q.resolve(A.allow), !0
}

// READABLE (for understanding):
function processSandboxResponse(response) {
    let callback = sandboxCallbackMap.get(response.requestId);
    if (!callback) {
        log(`[SwarmPermissionPoller] No sandbox callback registered for request ${response.requestId}`);
        return false;
    }

    log(`[SwarmPermissionPoller] Processing sandbox response for request ${response.requestId}: allow=${response.allow}`);
    sandboxCallbackMap.delete(response.requestId);  // Clean up
    callback.resolve(response.allow);                // Unblock the waiting worker
    return true;
}

// Mapping: Qb4->processSandboxResponse, A->response, q->callback, cM6->sandboxCallbackMap
```

**Key insight:** The `resolve(response.allow)` call is what unblocks the worker. The worker had created a `new Promise((resolve) => { registerSandboxCallback({ requestId, resolve }); })` and was awaiting it. When `resolve(true)` is called, the worker's network request proceeds. When `resolve(false)`, the request is denied.

---

## Standard (Non-Sandbox) Permission Sync

In addition to sandbox network permissions, the same mailbox system handles tool permission requests. These have a richer protocol:

### Permission Request Schema

```javascript
// ============================================
// PermissionRequestSchema - Zod schema for swarm permission requests
// Location: chunks.130.mjs:2874-2892 (Ln 326639)
// ============================================

// ORIGINAL (for source lookup):
ZAH = u.object({
    id: u.string(),
    workerId: u.string(),
    workerName: u.string(),
    workerColor: u.string().optional(),
    teamName: u.string(),
    toolName: u.string(),
    toolUseId: u.string(),
    description: u.string(),
    input: u.record(u.string(), u.unknown()),
    permissionSuggestions: u.array(u.unknown()),
    status: u.enum(["pending", "approved", "rejected"]),
    resolvedBy: u.enum(["worker", "leader"]).optional(),
    resolvedAt: u.number().optional(),
    feedback: u.string().optional(),
    updatedInput: u.unknown().optional(),
    permissionUpdates: u.array(u.unknown()).optional(),
    createdAt: u.number()
})

// READABLE (for understanding):
PermissionRequestSchema = z.object({
    id: z.string(),                                    // Unique request ID
    workerId: z.string(),                              // Worker agent ID
    workerName: z.string(),                            // Worker display name
    workerColor: z.string().optional(),                // Worker color for UI
    teamName: z.string(),                              // Team this belongs to
    toolName: z.string(),                              // Tool requiring permission (e.g., "Bash")
    toolUseId: z.string(),                             // Specific tool use ID
    description: z.string(),                           // Human-readable description
    input: z.record(z.string(), z.unknown()),          // Tool input parameters
    permissionSuggestions: z.array(z.unknown()),        // Suggested permission rules
    status: z.enum(["pending", "approved", "rejected"]),
    resolvedBy: z.enum(["worker", "leader"]).optional(),
    resolvedAt: z.number().optional(),                 // Resolution timestamp
    feedback: z.string().optional(),                   // Leader's feedback text
    updatedInput: z.unknown().optional(),              // Modified tool input from leader
    permissionUpdates: z.array(z.unknown()).optional(), // Permission rule updates
    createdAt: z.number()                              // Request creation timestamp
})

// Mapping: ZAH->PermissionRequestSchema
```

**Key insight:** The leader can not only approve/reject but also modify the tool input (`updatedInput`) and propagate new permission rules (`permissionUpdates`). This allows the leader to, for example, approve a bash command but modify the arguments, or add a new allow rule so future similar commands auto-approve.

### Standard Permission Response Processing

```javascript
// ============================================
// processPermissionResponse - Worker processes standard permission response
// Location: chunks.130.mjs:2907-2916 (Ln 326681)
// ============================================

// ORIGINAL (for source lookup):
function eP1(A) {
    let q = RQ1.get(A.requestId);
    if (!q) return h(`[SwarmPermissionPoller] No callback registered for mailbox response ${A.requestId}`), !1;
    if (h(`[SwarmPermissionPoller] Processing mailbox response for request ${A.requestId}: ${A.decision}`),
        RQ1.delete(A.requestId), A.decision === "approved") {
        let K = A.permissionUpdates || [], Y = A.updatedInput;
        q.onAllow(Y, K)
    } else q.onReject(A.feedback);
    return !0
}

// READABLE (for understanding):
function processPermissionResponse(response) {
    let callback = permissionCallbackMap.get(response.requestId);
    if (!callback) {
        log(`[SwarmPermissionPoller] No callback registered for mailbox response ${response.requestId}`);
        return false;
    }

    log(`[SwarmPermissionPoller] Processing mailbox response for request ${response.requestId}: ${response.decision}`);
    permissionCallbackMap.delete(response.requestId);

    if (response.decision === "approved") {
        let permissionUpdates = response.permissionUpdates || [];
        let updatedInput = response.updatedInput;
        callback.onAllow(updatedInput, permissionUpdates);  // Pass modified input + new rules
    } else {
        callback.onReject(response.feedback);               // Pass leader's rejection reason
    }
    return true;
}

// Mapping: eP1->processPermissionResponse, A->response, q->callback, RQ1->permissionCallbackMap
```

---

## Internal State Management

Two separate `Map` instances manage the two types of permission callbacks:

| Map | Variable | Purpose | Key | Value |
|-----|----------|---------|-----|-------|
| Standard permissions | `RQ1` (permissionCallbackMap) | Tool permission requests | requestId | `{ onAllow, onReject }` |
| Sandbox permissions | `cM6` (sandboxCallbackMap) | Network permission requests | requestId | `{ resolve }` |

Both maps are initialized during module setup and cleaned up when responses arrive. Orphaned entries (where the worker dies before receiving a response) are not explicitly cleaned up, but this is acceptable because:
1. The maps are in-process and scoped to the worker's lifetime
2. If the worker dies, its process (and maps) are garbage collected
3. The leader's pending UI prompt becomes stale but does not cause resource leaks

---

## Error Handling and Resilience

The protocol handles several failure modes:

1. **Team name not found:** Both request and response functions return `false` with a log message. This happens if the agent is not in a swarm context.
2. **Leader name not found:** Request fails gracefully. The sandbox will deny the network request since no approval can come.
3. **Worker ID not found:** Similar graceful failure.
4. **Mailbox delivery failure:** Caught in try/catch, logged, and reported via error tracking. Returns `false`.
5. **No callback registered:** If a response arrives for an unknown request ID (e.g., after a timeout), it is logged and dropped.
6. **Duplicate responses:** The callback is deleted after first resolution, so subsequent responses for the same ID are logged as "no callback registered" and harmlessly dropped.
