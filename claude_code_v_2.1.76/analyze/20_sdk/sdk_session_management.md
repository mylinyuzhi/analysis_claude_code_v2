# SDK Session Management

## Overview

SDK sessions manage state differently from interactive CLI sessions. This document covers session persistence, session ID handling, auto-compact integration, and budget/turn limits in SDK mode.

**Version note (v2.1.76):**
- The `activeForm` field is no longer required when creating tasks (breaking change removed). Task creation APIs that previously required `activeForm` now work without it.
- Max turns and budget limits are now properly enforced. A bug in v2.1.38 where limits were checked but not always triggered correctly has been fixed.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - State management symbols
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - SDK configuration
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact feature

Key functions in this document:
- `initializeHandler` (FXz) - Processes initialize control request
- `generateSessionId` (pcA) - Creates new session ID
- `resumeSession` (yt) - Resumes previous session
- `autoCompactDispatcher` (sI2) - Handles auto-compaction
- `setJsonSchema` (KR6) - Sets structured output schema
- `handleRewindRequest` (thq) - File history rewind control handler
- `handleSetPermissionMode` (pXz) - Permission mode transition handler

---

## Session Initialization

### initializeHandler (FXz)

```javascript
// ============================================
// initializeHandler - Process initialize control request
// Location: chunks.187.mjs:1174-1269
// ============================================

// ORIGINAL (for source lookup):
async function FXz(A, q, K, Y, z, w, H, $, O, _, J) {
    if (K) {
        Y.enqueue({ type: "control_response", response: { subtype: "error", error: "Already initialized", request_id: q, pending_permission_requests: H.getPendingPermissionRequests() } });
        return
    }
    if (A.systemPrompt !== void 0) O.systemPrompt = A.systemPrompt;
    if (A.appendSystemPrompt !== void 0) O.appendSystemPrompt = A.appendSystemPrompt;
    if (A.agents) { let X = fJ6(A.agents, "flagSettings"); _.push(...X) }
    let P = { commands: z.map(...), output_style: D, available_output_styles: ..., models: w, account: { email, organization, subscriptionType, tokenSource, apiKeySource } };
    Y.enqueue({ type: "control_response", response: { subtype: "success", request_id: q, response: P } })
}

// READABLE (for understanding):
async function initializeSession(request, requestId, isAlreadyInitialized, outputQueue, commands, models, streamIO, enableAuthStatus, sessionOptions, agentList, getSettings) {
    if (isAlreadyInitialized) {
        outputQueue.enqueue({
            type: "control_response",
            response: {
                subtype: "error",
                error: "Already initialized",
                request_id: requestId,
                pending_permission_requests: streamIO.getPendingPermissionRequests()
            }
        });
        return;
    }

    if (request.systemPrompt !== undefined) sessionOptions.systemPrompt = request.systemPrompt;
    if (request.appendSystemPrompt !== undefined) sessionOptions.appendSystemPrompt = request.appendSystemPrompt;

    if (request.agents) {
        let customAgents = parseAgentsFromJson(request.agents, "flagSettings");
        agentList.push(...customAgents);
    }

    if (sessionOptions.agent) {
        let agentDef = agentList.find((a) => a.agentType === sessionOptions.agent);
        if (agentDef) {
            activateAgent(agentDef.agentType);
            if (!sessionOptions.systemPrompt && !hasCustomSystemPrompt(agentDef)) {
                let prompt = agentDef.getSystemPrompt();
                if (prompt) sessionOptions.systemPrompt = prompt;
            }
            if (!sessionOptions.userSpecifiedModel && agentDef.model && agentDef.model !== "inherit") {
                setModelOverride(resolveModel(agentDef.model));
            }
        }
    }

    if (request.hooks) {
        let hookMap = {};
        for (let [hookEvent, hookConfigs] of Object.entries(request.hooks)) {
            hookMap[hookEvent] = hookConfigs.map((config) => ({
                matcher: config.matcher,
                hooks: config.hookCallbackIds.map((id) => streamIO.createHookCallback(id, config.timeout))
            }));
        }
        setHooks(hookMap);
    }

    if (request.promptSuggestions) sessionOptions.promptSuggestions = true;  // chunks.187.mjs:1189 — enables prompt suggestion feature (642)

    if (request.jsonSchema) setJsonSchema(request.jsonSchema);

    let sessionMetadata = {
        commands: commands.map((cmd) => ({
            name: cmd.userFacingName(),
            description: getCommandDescription(cmd),
            argumentHint: cmd.argumentHint || ""
        })),
        output_style: getOutputStyle(),
        available_output_styles: Object.keys(getAvailableOutputStyles()),
        models: models,
        account: {
            email: getEmail(),
            organization: getOrganization(),
            subscriptionType: getSubscriptionType(),
            tokenSource: getTokenSource(),
            apiKeySource: getApiKeySource()
        },
        fast_mode_state: getFastModeState()
    };

    outputQueue.enqueue({ type: "control_response", response: { subtype: "success", request_id: requestId, response: sessionMetadata } });
}

// Mapping: FXz→initializeHandler, A→request, q→requestId, K→isAlreadyInitialized, Y→outputQueue, z→commands, w→models, H→streamIO, O→sessionOptions, _→agentList
```

---

## Session ID Management

### Session ID Generation

```javascript
// ============================================
// generateSessionId - Create new session ID
// Location: chunks.1.mjs:2340
// ============================================

// Session IDs are UUIDs generated at session start
function generateSessionId() {
    return crypto.randomUUID();
}

// Mapping: pcA→generateSessionId
```

### Session Persistence

**CLI flags for session management:**
```bash
# Start new session with specific ID
claude --print --session-id "custom-uuid"

# Resume previous session
claude --print --continue
claude --print --resume  # Alias for --continue

# Disable session persistence
claude --print --no-session-persistence
```

### Session State Synchronization

```javascript
// Session state is stored in:
// - ~/.claude/sessions/<session-id>/

// Session contains:
{
    conversation: [...],         // Message history
    toolPermissionContext: {...}, // Permission state
    settings: {...},             // Session settings
    metadata: {
        created: timestamp,
        updated: timestamp,
        entrypoint: "sdk-ts"
    }
}
```

---

## Max Turns and Budget Limits (v2.1.76 Fix)

### Fix: Limits Now Properly Enforced

**What changed:** In v2.1.38, max turns and budget limits were defined and checked, but a code path existed where the agent loop could continue past the limit in certain edge cases (e.g., when a turn produced no tool calls). In v2.1.76, these checks are now applied unconditionally at the end of every turn, guaranteeing the limits are respected.

**Impact:** SDK clients relying on the `error_max_turns` or `error_max_budget_usd` result subtypes can now depend on them firing reliably.

### Max Turns

```javascript
// CLI flag: --max-turns <n>
// Limits the number of agentic turns

// When max turns is reached:
// 1. Agent stops after completing current turn
// 2. Emits result with subtype: "error_max_turns"

// In attachment processing (chunks.179.mjs:315-353):
if (event.attachment.type === "max_turns_reached") {
    yield {
        type: "result",
        subtype: "error_max_turns",
        duration_ms: Date.now() - startTime,
        duration_api_ms: apiDuration,
        num_turns: maxTurns,
        stop_reason: "max_turns",
        session_id: getSessionId(),
        ...
    };
    return;  // End session
}
```

### Max Budget USD

```javascript
// CLI flag: --max-budget-usd <amount>
// Limits API spending

// When budget is exceeded:
// 1. Agent stops immediately
// 2. Emits result with subtype: "error_max_budget_usd"

// Budget tracking is cumulative per session:
{
    "type": "result",
    "subtype": "error_max_budget_usd",
    "is_error": true,
    "total_cost_usd": 0.15,  // Actual cost when stopped
    "session_id": "<uuid>"
}
```

### Budget and Turn Tracking

```javascript
// ============================================
// Budget and turn tracking in SDK sessions
// Location: chunks.179.mjs (print mode agent loop)
// ============================================

let turnCount = 0;

// After each turn (v2.1.76: now runs unconditionally):
turnCount++;

if (maxTurns && turnCount >= maxTurns) {
    yield { type: "result", subtype: "error_max_turns", num_turns: turnCount, ... };
    return;
}

if (maxBudgetUsd && totalCostUsd >= maxBudgetUsd) {
    yield { type: "result", subtype: "error_max_budget_usd", total_cost_usd: totalCostUsd, ... };
    return;
}
```

**Key insight (v2.1.76):** The checks now run at the boundary of every agent turn regardless of what happened during the turn. Previously, certain code paths (particularly when the turn ended without tool_use) could skip the limit check.

---

## activeForm Field Removed (v2.1.76 Breaking Change)

**What changed:** In v2.1.38, certain task creation APIs in SDK mode required an `activeForm` field. This requirement has been **removed** in v2.1.76.

**Migration:** Remove any `activeForm` field from task creation calls. If your SDK client was including this field, it will be silently ignored in v2.1.76 (it is no longer read).

```javascript
// v2.1.38 (old): required activeForm
const task = await createTask({
    type: "agent",
    prompt: "...",
    activeForm: "chat"   // Was required
});

// v2.1.76 (new): activeForm not needed
const task = await createTask({
    type: "agent",
    prompt: "..."
    // activeForm no longer required or read
});
```

---

## Auto-Compact Integration

### setSDKStatus Mechanism

**What it does:** The `setSDKStatus` callback allows the compaction system to signal its status to the SDK client. When set to `"compacting"`, the SDK client knows the session is performing compaction and can adjust its behavior accordingly.

**How it works:**
1. Before compaction starts: `setSDKStatus("compacting")`
2. Compaction progress events: `onCompactProgress({ type: "..." })`
3. After compaction ends: `setSDKStatus(null)`

```javascript
// ============================================
// setSDKStatus - SDK status signaling during compaction
// Location: chunks.146.mjs:2447-2456, chunks.185.mjs:1251-1260
// ============================================

// In performFullCompaction:
try {
    context.onCompactProgress?.({ type: "hooks_start", hookType: "pre_compact" });
    context.setSDKStatus?.("compacting");

    // ... perform compaction ...

} finally {
    context.setStreamMode?.("requesting");
    context.setResponseLength?.(() => 0);
    context.onCompactProgress?.({ type: "compact_end" });
    context.setSDKStatus?.(null);
}

// Status to system message conversion
function statusToSystemMessage(sessionState) {
    if (!sessionState.status) return null;
    return {
        type: "system",
        subtype: "informational",
        content: sessionState.status === "compacting"
            ? "Compacting conversation…"
            : `Status: ${sessionState.status}`,
        level: "info",
        uuid: sessionState.uuid,
        timestamp: new Date().toISOString()
    };
}

// Mapping: setSDKStatus→setSDKStatus, onCompactProgress→onCompactProgress
```

### Compact in SDK Mode

```javascript
// ============================================
// autoCompactDispatcher - Auto-compaction in SDK sessions
// Location: chunks.107.mjs:1707-1731
// ============================================

// ORIGINAL (for source lookup):
async function sI2(A, Q, B) {
    if (Y0(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };
    // ... compaction logic
}

// READABLE (for understanding):
async function autoCompactDispatcher(messages, sessionContext, sessionMemoryType) {
    if (parseBoolean(process.env.DISABLE_COMPACT)) {
        return { wasCompacted: false };
    }

    let tokenCount = countTokens(messages);
    let threshold = getCompactThreshold();

    if (tokenCount > threshold) {
        let compactedMessages = await performCompaction(messages);
        return {
            wasCompacted: true,
            messages: compactedMessages,
            tokensSaved: tokenCount - countTokens(compactedMessages)
        };
    }

    return { wasCompacted: false };
}

// Mapping: sI2→autoCompactDispatcher, Y0→parseBoolean
```

### DISABLE_COMPACT Environment Variable

The `DISABLE_COMPACT` environment variable provides a hard-disable for all compaction:

| Variable | Scope | Effect |
|----------|-------|--------|
| `DISABLE_COMPACT=1` | All compaction | Disables standard, session memory, and microcompaction |
| `DISABLE_AUTO_COMPACT=1` | Auto-compaction only | Manual `/compact` still works |

```bash
# Disable all compaction for SDK sessions
CLAUDE_CODE_ENTRYPOINT=sdk-ts DISABLE_COMPACT=1 claude --print

# Use in CI/CD where compaction is not desired
export DISABLE_COMPACT=1
claude --print --max-turns 100 "..."
```

### Compact Behavior Differences

| Aspect | Interactive Mode | SDK Mode |
|---|---|---|
| Trigger | Token threshold | Token threshold (same) |
| Confirmation | User prompted | Automatic |
| Notification | UI message | `stream_event` message |
| Status | UI spinner | `setSDKStatus("compacting")` |
| Disable | Settings | `DISABLE_COMPACT=1` env var |

### Compact Stream Event

When compaction occurs in SDK mode, progress events are emitted:

```javascript
// Compact progress events
{ type: "hooks_start", hookType: "pre_compact" }
{ type: "compact_start" }
{ type: "compact_progress", phase: "summarizing", progress: 0.5 }
{ type: "compact_end" }

// Full event in stream-json format:
{
    "type": "stream_event",
    "event": {
        "type": "content_block_start",
        "index": 0,
        "content_block": {
            "type": "compaction",
            "tokens_before": 50000,
            "tokens_after": 20000,
            "messages_compacted": 15
        }
    },
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

---

## JSON Schema Structured Output

### Setting the Schema

```javascript
// CLI flag: --json-schema <schema>
// Or via initialize request: jsonSchema property

// In initializeSession:
if (request.jsonSchema) {
    setJsonSchema(request.jsonSchema);
}
```

### Structured Output Attachment

```javascript
// When structured output is generated:
{
    "type": "attachment",
    "attachment": {
        "type": "structured_output",
        "data": {
            // Parsed JSON matching the schema
            "name": "John",
            "age": 30
        }
    },
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

### Schema Validation Flow

```
1. Schema set via initialize request or CLI flag
2. Agent is instructed to produce JSON output
3. Output is validated against schema
4. If valid:
   - Set finalStructuredOutput = attachment.data
   - Include in result.result as JSON string
5. If invalid:
   - Error is raised
   - Agent may retry (within turn limits)
```

---

## Session Lifecycle Events

### Initialize Flow

```
SDK Client                          Claude Code Binary
    │                                    │
    │ ──── control_request (initialize) ► │
    │                                    ├── Check already initialized
    │                                    ├── Apply systemPrompt/appendSystemPrompt
    │                                    ├── Parse and register agents
    │                                    ├── Register hooks
    │                                    ├── Set jsonSchema
    │                                    │
    │ ◄─── control_response (success) ── │
    │         with session metadata       │
    │                                    │
    │ ──── user message ─────────────────► │
    │                                    ├── Process message
    │ ◄─── assistant message ─────────── │
    │ ◄─── stream_event × N ──────────── │
    │ ◄─── result ───────────────────── │
```

### Session End Conditions

| Condition | Result Subtype | Trigger |
|---|---|---|
| Normal completion | `success` | Agent finishes task |
| Max turns reached | `error_max_turns` | Turn count >= limit (now enforced in v2.1.76) |
| Budget exceeded | `error_max_budget_usd` | Cost >= limit (now enforced in v2.1.76) |
| Execution error | `error_during_execution` | Unhandled exception |
| User abort | `error_during_execution` | `interrupt` control_request |

---

## Auth Status Messages

### Enable Auth Status

```javascript
// CLI flag: --enable-auth-status
// Enables auth_status messages in SDK mode

// Auth status message:
{
    "type": "auth_status",
    "status": "authenticated" | "unauthenticated" | "expired",
    "account": {
        "email": "user@example.com",
        "organization": "...",
        "subscriptionType": "pro"
    },
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

### When Auth Status is Sent

- After `initialize` control response
- When authentication state changes
- Before API calls if token refresh needed

---

## Fast Mode State

### Fast Mode in Initialize Response

```javascript
// If fast mode is available, initialize response includes:
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            // ... other fields ...
            "fast_mode_state": "on" | "off" | "cooldown",
            "pid": 12345  // process.pid of the Claude Code binary (chunks.187.mjs:1245)
        }
    }
}
```

**Note:** Fast mode is not available in Agent SDK mode for direct use.

---

## Dynamic Session Control

### Control Request Subtypes for Session Modification

SDK clients can dynamically modify session parameters during an active session using control requests with specific subtypes.

### set_permission_mode

```javascript
{
    "type": "control_request",
    "request": {
        "subtype": "set_permission_mode",
        "mode": "default" | "acceptEdits" | "bypassPermissions"
    }
}

// Response
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            "previous_mode": "default",
            "current_mode": "acceptEdits"
        }
    }
}
```

### set_model

```javascript
{
    "type": "control_request",
    "request": {
        "subtype": "set_model",
        "model": "claude-sonnet-4-6" | "claude-opus-4-6" | "claude-haiku-4-5"
    }
}
```

### set_max_thinking_tokens

```javascript
{
    "type": "control_request",
    "request": {
        "subtype": "set_max_thinking_tokens",
        "max_thinking_tokens": 16000
    }
}
```

---

### handleRewindRequest (thq)

**What it does:** Handles the `rewind` control request, which rolls back file changes to a previous checkpoint in the session's file history. Supports both "dry run" (check mode) and "execute" modes.

**Source:** chunks.187.mjs:1271

**How it works:**
1. Checks if rewind is enabled via `iz()` (feature flag check)
2. Checks if a file checkpoint exists for the target message UUID via `tN1(q.fileHistory, A)`
3. If `Y` (dryRun) is true: returns stats only (filesChanged, insertions, deletions)
4. If dryRun is false: calls `sN1()` to actually apply the rewind

**Control request format:**
```javascript
{
  "type": "control_request",
  "request": {
    "subtype": "rewind",
    "message_uuid": "<uuid>",  // A - the message to rewind to
    "dry_run": true | false    // Y - check or execute
  }
}
```

**Response (success, dryRun=true):**
```javascript
{
  "canRewind": true,
  "filesChanged": 3,
  "insertions": 45,
  "deletions": 12
}
```

**Response (success, dryRun=false):**
```javascript
{ "canRewind": true }
```

**Response (failure):**
```javascript
{
  "canRewind": false,
  "error": "File rewinding is not enabled." | "No file checkpoint found for this message."
}
```

**Guard conditions:**
- `iz()` must return true (rewind feature enabled) — otherwise returns `canRewind: false`
- `tN1()` must find the checkpoint — otherwise returns `canRewind: false`

```javascript
// ============================================
// handleRewindRequest - File history rewind control handler
// Location: chunks.187.mjs:1271-1303
// ============================================

// ORIGINAL (for source lookup):
async function thq(A, q, K, Y) {
    if (!iz()) return { canRewind: !1, error: "File rewinding is not enabled." };
    if (!tN1(q.fileHistory, A)) return { canRewind: !1, error: "No file checkpoint found for this message." };
    if (Y) {
        let z = eN1(q.fileHistory, A);
        return { canRewind: !0, filesChanged: z?.filesChanged, insertions: z?.insertions, deletions: z?.deletions }
    }
    try {
        await sN1((z) => K((_) => ({ ..._, fileHistory: z(_.fileHistory) })), A)
    } catch (z) {
        return { canRewind: !1, error: `Failed to rewind: ${z.message}` }
    }
    return { canRewind: !0 }
}

// READABLE (for understanding):
async function handleRewindRequest(messageUuid, sessionState, setAppState, dryRun) {
    if (!isRewindEnabled()) return { canRewind: false, error: "File rewinding is not enabled." };
    if (!hasFileCheckpoint(sessionState.fileHistory, messageUuid)) {
        return { canRewind: false, error: "No file checkpoint found for this message." };
    }
    if (dryRun) {
        let stats = getFileCheckpointStats(sessionState.fileHistory, messageUuid);
        return { canRewind: true, filesChanged: stats?.filesChanged, insertions: stats?.insertions, deletions: stats?.deletions };
    }
    try {
        await applyFileRewind((updater) => setAppState((state) => ({ ...state, fileHistory: updater(state.fileHistory) })), messageUuid);
    } catch (error) {
        return { canRewind: false, error: `Failed to rewind: ${error.message}` };
    }
    return { canRewind: true };
}

// Mapping: thq→handleRewindRequest, A→messageUuid, q→sessionState, K→setAppState, Y→dryRun, iz→isRewindEnabled, tN1→hasFileCheckpoint, eN1→getFileCheckpointStats, sN1→applyFileRewind
```

---

### handleSetPermissionMode (pXz)

**What it does:** Handles the `set_permission_mode` control request. Validates the requested mode transition and updates the session's permission mode. Enforces policy restrictions for `bypassPermissions` and `auto` modes.

**Source:** chunks.187.mjs:1305-1345

**How it works:**
1. If mode is `bypassPermissions`:
   - Checks `bd()` (isDangerousPermissionsDisabled) — fails if permissions bypass is policy-blocked
   - Checks `isBypassPermissionsModeAvailable` flag — fails if session wasn't launched with `--dangerously-skip-permissions`
2. If mode is `auto`:
   - Checks `IN()` (isDangerousActionClassifierEnabled) — fails if auto mode is not available
3. On success: calls `ki()` to update permission context, sets `mode` to new value, returns success

**Guard conditions:**
- `bypassPermissions`: requires `!bd()` AND `isBypassPermissionsModeAvailable`
- `auto`: requires `IN()` (dangerous action classifier must be enabled)

```javascript
// ============================================
// handleSetPermissionMode - Permission mode transition handler
// Location: chunks.187.mjs:1305-1345
// ============================================

// ORIGINAL (for source lookup):
function pXz(A, q, K, Y) {
    if (A.mode === "bypassPermissions") {
        if (bd()) return Y.enqueue({type:"control_response",response:{subtype:"error",request_id:q,error:"Cannot set permission mode to bypassPermissions because it is disabled by settings or configuration"}}), K;
        if (!K.isBypassPermissionsModeAvailable) return Y.enqueue({type:"control_response",response:{subtype:"error",request_id:q,error:"Cannot set permission mode to bypassPermissions because the session was not launched with --dangerously-skip-permissions"}}), K
    }
    if (A.mode === "auto" && !IN()) return Y.enqueue({type:"control_response",response:{subtype:"error",request_id:q,error:"Cannot set permission mode to auto because the dangerous action classifier is not enabled"}}), K;
    return Y.enqueue({type:"control_response",response:{subtype:"success",request_id:q,response:{mode:A.mode}}}), {...ki(K.mode, A.mode, K), mode: A.mode}
}

// READABLE (for understanding):
function handleSetPermissionMode(request, requestId, currentState, outputQueue) {
    if (request.mode === "bypassPermissions") {
        if (isDangerousPermissionsDisabled()) {
            outputQueue.enqueue({ type: "control_response", response: { subtype: "error", request_id: requestId, error: "Cannot set permission mode to bypassPermissions because it is disabled by settings or configuration" } });
            return currentState;
        }
        if (!currentState.isBypassPermissionsModeAvailable) {
            outputQueue.enqueue({ type: "control_response", response: { subtype: "error", request_id: requestId, error: "Cannot set permission mode to bypassPermissions because the session was not launched with --dangerously-skip-permissions" } });
            return currentState;
        }
    }
    if (request.mode === "auto" && !isDangerousActionClassifierEnabled()) {
        outputQueue.enqueue({ type: "control_response", response: { subtype: "error", request_id: requestId, error: "Cannot set permission mode to auto because the dangerous action classifier is not enabled" } });
        return currentState;
    }
    outputQueue.enqueue({ type: "control_response", response: { subtype: "success", request_id: requestId, response: { mode: request.mode } } });
    return { ...updatePermissionContext(currentState.mode, request.mode, currentState), mode: request.mode };
}

// Mapping: pXz→handleSetPermissionMode, A→request, q→requestId, K→currentState, Y→outputQueue, bd→isDangerousPermissionsDisabled, IN→isDangerousActionClassifierEnabled, ki→updatePermissionContext
```

**Key insight:** This function returns the updated state object (not just a response). The caller replaces the session state with the returned value. This is a pure function pattern — it takes state in and returns new state out, making it easy to test.

---

## Rate Limit Events (v2.1.76)

### Overview

Rate limit events are emitted when the API returns rate limit information. SDK clients can use these events to display usage warnings or pause execution when limits are approached.

### Event Structure

```javascript
// ============================================
// rate_limit_event - Emitted when rate limit info changes
// Location: chunks.131.mjs:2603-2608, chunks.187.mjs:36-44
// ============================================

{
    "type": "rate_limit_event",
    "rate_limit_info": {
        "status": "allowed" | "allowed_warning" | "rejected",
        "resetsAt": 1710451200000,           // Unix timestamp (ms) when limit resets
        "rateLimitType": "five_hour" | "seven_day" | "seven_day_opus" | "seven_day_sonnet" | "overage",
        "utilization": 0.85,                 // 0.0 to 1.0 (85% used)
        "overageStatus": "allowed" | "allowed_warning" | "rejected",
        "overageResetsAt": 1710451200000,    // Overage limit reset timestamp
        "overageDisabledReason": "overage_not_provisioned" | "org_level_disabled" | "...",
        "isUsingOverage": false,             // Whether currently in overage mode
        "surpassedThreshold": 0.8            // Threshold that was surpassed (if any)
    },
    "uuid": "<uuid>",
    "session_id": "<session-id>"
}
```

### Status Values

| Status | Meaning |
|--------|---------|
| `allowed` | Request proceeded normally |
| `allowed_warning` | Request proceeded but usage is high (typically >80%) |
| `rejected` | Request was rejected due to rate limit |

### Rate Limit Types

| Type | Description |
|------|-------------|
| `five_hour` | Short-term rolling window limit |
| `seven_day` | 7-day rolling window limit |
| `seven_day_opus` | 7-day limit specific to Opus model |
| `seven_day_sonnet` | 7-day limit specific to Sonnet model |
| `overage` | Overage/billing limit |

### Overage Disabled Reasons

| Reason | Description |
|--------|-------------|
| `overage_not_provisioned` | Account doesn't have overage enabled |
| `org_level_disabled` | Organization disabled overage |
| `org_level_disabled_until` | Organization temporarily disabled |
| `out_of_credits` | No credits remaining |
| `seat_tier_level_disabled` | Seat tier doesn't allow overage |
| `member_level_disabled` | Member account disabled |
| `seat_tier_zero_credit_limit` | Seat tier has zero credit limit |
| `group_zero_credit_limit` | Group has zero credit limit |
| `member_zero_credit_limit` | Member has zero credit limit |
| `org_service_level_disabled` | Organization service disabled |
| `org_service_zero_credit_limit` | Org service has zero limit |
| `no_limits_configured` | No limits found |
| `unknown` | Unknown reason |

### Emission in runHeadless

```javascript
// ============================================
// Rate limit event emission in runHeadless (BXz)
// Location: chunks.187.mjs:36-44
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
// Register listener for API responses with rate limit info
let handleRateLimit = (apiResponse) => {
    let rateLimitInfo = extractRateLimitInfo(apiResponse);
    if (rateLimitInfo) {
        outputQueue.enqueue({
            type: "rate_limit_event",
            rate_limit_info: rateLimitInfo,
            uuid: generateUUID(),
            session_id: getSessionId()
        });
    }
};
rateLimitListeners.add(handleRateLimit);

// Mapping: f→handleRateLimit, T6→apiResponse, D6→rateLimitInfo, SJq→extractRateLimitInfo, Z→outputQueue, Nt→rateLimitListeners
```

### SDK Client Usage

```typescript
// TypeScript SDK client handling rate limit events
for await (const event of session) {
    if (event.type === "rate_limit_event") {
        const info = event.rate_limit_info;

        if (info.status === "rejected") {
            console.error(`Rate limited! Resets at: ${new Date(info.resetsAt)}`);
            // Wait until reset or prompt user
        } else if (info.status === "allowed_warning") {
            console.warn(`Usage at ${Math.round(info.utilization * 100)}%`);
        }

        if (info.rateLimitType === "seven_day_opus") {
            // Model-specific handling
        }
    }
}
```

---

## unexpectedResponseCallback

**What it does:** Provides a hook for the SDK client to handle unexpected or malformed responses that don't match the expected protocol.

```javascript
// Set during initialization:
let streamIO = new StdioStreamIO({
    unexpectedResponseCallback: (message) => {
        console.error("Unexpected response:", message);
    }
});
```

**Common triggers:**

| Trigger | Description |
|---------|-------------|
| Unknown type | Message type is not a recognized SDK event |
| Schema mismatch | Message doesn't validate against expected schema |
| Parse error | Malformed JSON in NDJSON stream |
| Version mismatch | Protocol version incompatibility |

---

## Session Persistence Options

### What Gets Persisted

```javascript
{
    // Conversation history
    conversation: [
        { role: "user", content: "..." },
        { role: "assistant", content: [...] }
    ],

    // Permission context
    toolPermissionContext: {
        mode: "default",
        allowedTools: [...],
        deniedTools: [...]
    },

    // Session metadata
    metadata: {
        session_id: "<uuid>",
        created: 1234567890,
        updated: 1234567900,
        entrypoint: "sdk-ts",
        model: "claude-opus-4-6"
    }
}
```

---

## Summary: SDK Session Lifecycle

```
Session Start
    │
    ├── Generate or use provided session ID
    │
    ├── Process initialize control_request
    │   ├── Apply system prompt configuration
    │   ├── Register custom agents
    │   ├── Register SDK hooks
    │   └── Set JSON schema (if provided)
    │   └── Note: activeForm no longer required (v2.1.76)
    │
    ├── Send initialize response with session metadata
    │
    └── Enter agent loop:
        │
        ├── For each user message:
        │   ├── Process through agent loop
        │   ├── Check max turns (enforced every turn in v2.1.76)
        │   ├── Check budget (enforced every turn in v2.1.76)
        │   ├── Auto-compact if needed
        │   └── Emit stream events
        │
        └── Session End:
            ├── Normal completion → result subtype: "success"
            ├── Max turns → result subtype: "error_max_turns"
            ├── Budget exceeded → result subtype: "error_max_budget_usd"
            ├── Error → result subtype: "error_during_execution"
            └── User abort → result subtype: "error_during_execution"
```

---

## runHeadless (BXz) — Complete Source-Level Analysis

### Function Overview

**What it does:** The `runHeadless` function is the main entry point for SDK session execution. It sets up all the event handlers, subscriptions, and the message processing loop for non-interactive (SDK/print) mode.

**Location:** chunks.187.mjs:3-500+

```javascript
// ============================================
// runHeadless - Headless execution loop for SDK sessions
// Location: chunks.187.mjs:3-500+
// ============================================

// ORIGINAL (for source lookup):
function BXz(A, q, K, Y, z, _, w, O, $, H, j, J) {
    let M = !1, D = !1, X = !1, P = null, W, Z = A.outbound;
    // ... rest of function
}

// READABLE (for understanding):
async function runHeadless(
    streamIO,           // A: StreamIO instance (StdioStreamIO or RemoteStreamIO)
    mcpClients,         // q: Initial MCP clients array
    slashCommands,      // K: Available slash commands
    toolRegistry,       // Y: Tool registry configuration
    messages,           // z: Mutable messages array
    canUseTool,         // _: Permission checker callback
    mcpServerConfigs,   // w: MCP server configurations object
    getAppState,        // O: App state getter function
    setAppState,        // $: App state setter function
    agents,             // H: Agent definitions array
    options             // j: Configuration options object
    // J: interruptedTurn (optional, for resuming interrupted sessions)
) {
    // Internal state
    let isShuttingDown = false;
    let hasInterruptedAgent = false;
    let localAgentRunning = false;
    let pendingResult = null;
    let abortController;
    let outbound = streamIO.outbound;  // AsyncQueue for outgoing messages

    // ... function body continues
}

// Mapping: BXz→runHeadless, A→streamIO, q→mcpClients, K→slashCommands, Y→toolRegistry,
//          z→messages, _→canUseTool, w→mcpServerConfigs, O→getAppState, $→setAppState,
//          H→agents, j→options, J→interruptedTurn, Z→outbound, M→isShuttingDown
```

### Parameter Details

| Parameter | Obfuscated | Type | Description |
|-----------|------------|------|-------------|
| `streamIO` | `A` | StdioStreamIO \| RemoteStreamIO | The I/O transport instance |
| `mcpClients` | `q` | McpClient[] | Initial MCP client array |
| `slashCommands` | `K` | SlashCommand[] | Available slash commands |
| `toolRegistry` | `Y` | ToolRegistry | Tool registry for execution |
| `messages` | `z` | Message[] | Mutable message array |
| `canUseTool` | `_` | Function | Permission checker callback |
| `mcpServerConfigs` | `w` | Object | MCP server configurations |
| `getAppState` | `O` | Function | State getter function |
| `setAppState` | `$` | Function | State setter function |
| `agents` | `H` | AgentDefinition[] | Agent definitions |
| `options` | `j` | Object | Configuration options |
| `interruptedTurn` | `J` | Object? | Interrupted turn to resume |

### Key Components

**1. Permission Mode Subscription:**
```javascript
// Subscribe to permission mode changes and broadcast to SDK client
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
```

**2. Auth Status Streaming:**
```javascript
// Stream auth state changes if enabled
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

**3. Rate Limit Event Handling:**
```javascript
// Forward rate limit info to SDK client
let handleRateLimit = (apiResponse) => {
    let rateLimitInfo = extractRateLimitInfo(apiResponse);
    if (rateLimitInfo) {
        outbound.enqueue({
            type: "rate_limit_event",
            rate_limit_info: rateLimitInfo,
            uuid: generateUUID(),
            session_id: getSessionId()
        });
    }
};
rateLimitListeners.add(handleRateLimit);
```

**4. MCP Server Initialization:**
```javascript
// Initialize MCP servers from configuration
async function initializeMcpServers() {
    let existingNames = new Set(mcpClients.map((c) => c.name));
    let newClients = await initializeSdkMcpClients(
        mcpServerConfigs,
        (serverName, message) => streamIO.sendMcpMessage(serverName, message)
    );
    mcpClients = newClients.clients;
    mcpTools = newClients.tools;

    // Update app state with new tools
    setAppState((state) => ({
        ...state,
        mcp: {
            ...state.mcp,
            tools: [...state.mcp.tools, ...mcpTools]
        }
    }));
}
```

**5. Elicitation Handler Setup:**
```javascript
// Set up MCP elicitation request handlers
function setupElicitationHandlers(clients) {
    if (!isElicitationEnabled()) return;

    for (let client of clients) {
        if (client.type !== "connected" || handledClients.has(client.name)) continue;
        if (client.config.type === "sdk") continue;

        client.client.setRequestHandler(ElicitationRequestSchema, async (request, context) => {
            // First try hook-based elicitation
            let hookResult = await tryElicitationHook(client.name, request.params, context.signal);
            if (hookResult) return hookResult;

            // Otherwise route through SDK control channel
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

        handledClients.add(client.name);
    }
}
```

**6. Message Processing Loop:**
```javascript
// Main message processing loop
async function processMessages() {
    while (true) {
        let command = getNextCommand();

        if (command.mode === "prompt") {
            // Handle user message
            if (streamIO instanceof RemoteStreamIO) {
                logTelemetry("tengu_bridge_message_received", { is_repl: false });
            }

            // Execute agent loop with all context
            abortController = new AbortController();

            await executeAgentLoop({
                commands: slashCommands,
                prompt: command.value,
                promptUuid: command.uuid,
                tools: toolRegistry,
                mcpClients: mcpClients,
                canUseTool: canUseTool,
                getAppState: getAppState,
                setAppState: setAppState,
                abortController: abortController,
                handleElicitation: (serverName, params, signal) =>
                    streamIO.handleElicitation(serverName, params.message, ...),
                agents: agents,
                setSDKStatus: (status) => {
                    outbound.enqueue({
                        type: "system",
                        subtype: "status",
                        status: status,
                        session_id: getSessionId(),
                        uuid: generateUUID()
                    });
                }
            });

        } else if (command.mode === "orphaned-permission") {
            // Handle late-arriving permission response
            await handleOrphanedPermission(command.orphanedPermission);

        } else if (command.mode === "task-notification") {
            // Handle background task status update
            outbound.enqueue({
                type: "system",
                subtype: "task_notification",
                task_id: extractTaskId(command.value),
                tool_use_id: extractToolUseId(command.value),
                status: extractStatus(command.value),
                ...
            });
        }
    }
}
```

**7. Prompt Suggestion Generation:**
```javascript
// Generate prompt suggestions after each turn
if (options.promptSuggestions && process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION !== "false") {
    suggestionAbortController?.abort();
    suggestionAbortController = new AbortController();

    let suggestion = await generatePromptSuggestion(
        suggestionAbortController,
        messages,
        getAppState,
        getSuggestionParams(),
        "sdk"
    );

    if (suggestion && !suggestionAbortController.signal.aborted) {
        outbound.enqueue({
            type: "prompt_suggestion",
            suggestion: suggestion.suggestion,
            uuid: generateUUID(),
            session_id: getSessionId()
        });
    }
}
```

### Shutdown Sequence

```javascript
// Clean shutdown
async function shutdown() {
    isShuttingDown = true;

    // Stop idle timer
    idleTimer.stop();

    // Clean up MCP clients
    await cleanupMcpClients(mcpClients);

    // Remove rate limit listener
    rateLimitListeners.delete(handleRateLimit);

    // Finalize pending operations
    await pendingMcpPromise;

    // Close outbound queue
    outbound.done();
}
```

---

## System Reminder Integration in SDK Mode

### Overview

System reminders in SDK mode follow the same architecture as CLI mode but have important differences in how they're exposed to SDK clients. This section documents the integration between SDK sessions and the system reminder module (04_system_reminder).

**Key Concepts:**
- **isMeta flag**: Messages with `isMeta: true` are system reminders (injected context, not user input)
- **Silent types**: Some attachment types produce no API messages
- **SDK event exposure**: Only certain reminder types are exposed as SDK events

### Architecture: System Reminders vs SDK Events

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    System Reminder Flow in SDK Mode                          │
│                                                                              │
│  ┌──────────────────┐                                                        │
│  │ Attachment       │                                                        │
│  │ Producers        │                                                        │
│  │ (40+ functions)  │                                                        │
│  └────────┬─────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌──────────────────┐     ┌─────────────────────────────────────────────┐   │
│  │ normalizeForAPI  │────▶│ Type Routing:                               │   │
│  │ (K2z)            │     │ - Visible → USER messages with isMeta:true  │   │
│  └──────────────────┘     │ - Silent → [] (no messages)                 │   │
│                           └─────────────────────────────────────────────┘   │
│                                   │                                          │
│           ┌───────────────────────┼───────────────────────┐                 │
│           ▼                       ▼                       ▼                 │
│  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────────┐    │
│  │ API Messages     │   │ Internal State   │   │ SDK Event Emission   │    │
│  │ (sent to Claude) │   │ (UI tracking)    │   │ (rate_limit_event,   │    │
│  │                  │   │                  │   │  prompt_suggestion)  │    │
│  └──────────────────┘   └──────────────────┘   └──────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### isMeta Flag Handling in SDK Output

The `isMeta` flag is the primary mechanism for distinguishing system reminders from real user messages. In SDK mode:

1. **Messages sent to API**: `isMeta` flag is **stripped** before sending to Claude API
2. **Messages in transcript**: `isMeta` is preserved for session persistence
3. **SDK client visibility**: SDK clients receive structured events, not raw messages

```javascript
// ============================================
// formatMessagesForAPI - Strips isMeta before API call
// Location: chunks.169.mjs:618-643
// ============================================

// ORIGINAL (for source lookup):
function b9z(A, q = !1, K) {
    // ... returns { role: "user", content: ... }
    // isMeta, uuid, timestamp are ALL dropped
    return { role: "user", content: A.message.content }
}

// READABLE (for understanding):
function formatUserMessageForAPI(internalMessage, isNearEnd, enableCaching) {
    // The isMeta flag exists on internal messages but is NOT included
    // in the API message - only role and content survive
    return {
        role: "user",
        content: internalMessage.message.content
    };
}

// Mapping: b9z→formatUserMessageForAPI, A→internalMessage
```

**Why this matters for SDK clients:**
- SDK clients don't receive raw `isMeta` messages
- Instead, they receive structured events (rate_limit_event, prompt_suggestion)
- The abstraction simplifies client implementation

### Silent Types in SDK Mode

Silent types return `[]` from `normalizeAttachmentForAPI` - they produce no API messages. In SDK mode, these types are still tracked internally but never exposed to clients.

```javascript
// ============================================
// Silent types - No API messages produced
// Location: chunks.173.mjs:1118-1131
// ============================================

// ORIGINAL (for source lookup):
case "already_read_file":
case "command_permissions":
case "edited_image_file":
case "hook_cancelled":
case "hook_error_during_execution":
case "hook_non_blocking_error":
case "hook_system_message":
case "structured_output":
case "hook_permission_decision":
    return []

// READABLE (for understanding):
// These types are tracked internally but don't produce messages:
// - already_read_file: File already in cache (deduplication)
// - command_permissions: Permission state tracking
// - edited_image_file: Binary file modification tracking
// - hook_*: Hook execution status (internal)
// - structured_output: Hook structured data (internal)
```

### SDK-Exposed Reminder Types

While most system reminders are internal, certain types are explicitly exposed as SDK events:

#### 1. rate_limit_event (v2.1.76)

Emitted when rate limit information changes. See the dedicated section above for full schema.

```javascript
// Emission in runHeadless
let handleRateLimit = (apiResponse) => {
    let rateLimitInfo = extractRateLimitInfo(apiResponse);
    if (rateLimitInfo) {
        outbound.enqueue({
            type: "rate_limit_event",
            rate_limit_info: rateLimitInfo,
            uuid: generateUUID(),
            session_id: getSessionId()
        });
    }
};
rateLimitListeners.add(handleRateLimit);
```

#### 2. prompt_suggestion

Emitted after each turn when prompt suggestions are enabled.

```javascript
// Emission in runHeadless
if (options.promptSuggestions && process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION !== "false") {
    let suggestion = await generatePromptSuggestion(
        suggestionAbortController,
        messages,
        getAppState,
        getSuggestionParams(),
        "sdk"
    );

    if (suggestion && !suggestionAbortController.signal.aborted) {
        outbound.enqueue({
            type: "prompt_suggestion",
            suggestion: suggestion.suggestion,
            uuid: generateUUID(),
            session_id: getSessionId()
        });
    }
}
```

**Schema:**
```json
{
    "type": "prompt_suggestion",
    "suggestion": "Continue implementing the authentication module",
    "uuid": "<uuid>",
    "session_id": "<session-id>"
}
```

#### 3. auth_status

Emitted when authentication state changes (if enabled).

```javascript
// Emission in runHeadless
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

**Schema:**
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

### Attachment Producers Relevant to SDK Sessions

The attachment producer system (`assembleAllAttachments`) runs in both CLI and SDK modes. Key producers for SDK:

| Producer | Attachment Type | SDK Relevance |
|----------|-----------------|---------------|
| `loadFileAttachment` | `file`, `already_read_file` | File context injection |
| `getChangedFilesAttachment` | `edited_file`, `edited_image_file` | Watched file changes |
| `getTodoAttachment` | `todo` | Task list context |
| `getTaskProgressAttachment` | `task_progress` | Background task status |
| `getHookAttachments` | `hook_*` types | Hook responses |

**Execution strategy (3-group parallel):**
```javascript
// ============================================
// assembleAllAttachments - Orchestrator for attachment production
// Location: chunks.147.mjs:3-18
// ============================================

// ORIGINAL (for source lookup):
async function _uY(A, q, K, Y, z, _) {
    if (t6(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    // ... parallel execution in 3 groups
}

// READABLE (for understanding):
async function assembleAllAttachments(
    sessionContext,    // A: Session state
    messageContext,    // q: Current message context
    ...otherParams
) {
    // Can be disabled via environment variable
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) ||
        parseBoolean(process.env.CLAUDE_CODE_SIMPLE)) {
        return [];
    }
    // ... executes producers in 3 parallel groups
}

// Mapping: _uY→assembleAllAttachments, A→sessionContext, q→messageContext
```

### XML Wrapping for System Reminders

System reminders that produce API messages are wrapped in XML tags for clear identification by the LLM:

```javascript
// ============================================
// wrapInXmlTag - Wrap content in XML tags
// Location: chunks.173.mjs:2490-2493
// ============================================

// ORIGINAL (for source lookup):
function af(A, q) {
    return `<${A}>\n${q}\n</${A}>`
}

// READABLE (for understanding):
function wrapInXmlTag(tagName, content) {
    return `<${tagName}>\n${content}\n</${tagName}>`;
}

// Mapping: af→wrapInXmlTag, A→tagName, q→content
```

```javascript
// ============================================
// wrapWithSystemReminderTags - Specialized wrapper for system reminders
// Location: chunks.173.mjs:2495-2523
// ============================================

// ORIGINAL (for source lookup):
function b5(A) {
    return af("system-reminder", A.join("\n\n"))
}

// READABLE (for understanding):
function wrapWithSystemReminderTags(messages) {
    return wrapInXmlTag("system-reminder", messages.join("\n\n"));
}

// Mapping: b5→wrapWithSystemReminderTags, A→messages, af→wrapInXmlTag
```

**Example output:**
```xml
<system-reminder>

Called the Read tool with the following input: {"file_path": "/src/index.js"}

Result of calling the Read tool:
<file_contents>
// file contents here
</file_contents>

</system-reminder>
```

### Filtering Meta Messages in SDK Collection

When SDK clients need to collect messages for analysis or display, they should filter by `isMeta`:

```javascript
// ============================================
// isValidUserMessage - Check if message is real user input
// Location: chunks.173.mjs:2164-2172
// ============================================

// ORIGINAL (for source lookup):
function V2z(A) {
    if (A.type !== "user") return !1;
    if (A.isMeta) return !1;
    let q = A.message?.content;
    if (!q) return !1;
    if (typeof q === "string") return q.trim().length > 0;
    if (Array.isArray(q)) return q.some((K) => K.type === "text" || K.type === "image" || K.type === "document");
    return !1
}

// READABLE (for understanding):
function isValidUserMessage(message) {
    // Must be user-type
    if (message.type !== "user") return false;
    // Must not be a system reminder (meta message)
    if (message.isMeta) return false;
    // Must have content
    let content = message.message?.content;
    if (!content) return false;
    // String content must be non-empty
    if (typeof content === "string") return content.trim().length > 0;
    // Array content must have at least one text, image, or document block
    if (Array.isArray(content)) {
        return content.some((block) =>
            block.type === "text" || block.type === "image" || block.type === "document"
        );
    }
    return false;
}

// Mapping: V2z→isValidUserMessage, A→message, q→content, K→block
```

### SDK Client Implementation Guide

#### Filtering Messages for Collection

```typescript
// TypeScript SDK - Filter out meta messages when collecting conversation
function collectUserMessages(messages: InternalMessage[]): UserMessage[] {
    return messages.filter(msg => {
        // Skip non-user messages
        if (msg.type !== 'user') return false;
        // Skip system reminders
        if (msg.isMeta) return false;
        // Skip tool results
        if (msg.toolUseResult) return false;
        return true;
    });
}
```

#### Handling SDK Events

```typescript
// TypeScript SDK - Handle all SDK-exposed events
for await (const event of session) {
    switch (event.type) {
        case 'rate_limit_event':
            handleRateLimit(event.rate_limit_info);
            break;

        case 'prompt_suggestion':
            displaySuggestion(event.suggestion);
            break;

        case 'auth_status':
            updateAuthUI(event);
            break;

        case 'result':
            // Final result - session complete
            console.log('Session ended:', event.subtype);
            break;
    }
}
```

### Cross-Module Integration

| Module | Integration Point | SDK Behavior |
|--------|-------------------|--------------|
| `04_system_reminder` | Attachment production | Same producers, different visibility |
| `05_tools` | Permission prompts | Exposed via `permission_prompt` event |
| `06_mcp` | Elicitation requests | Routed through SDK control channel |
| `11_hooks` | Hook responses | Silent types, no SDK event |
| `24_auth` | Auth state | Optional `auth_status` event |

---

## Cross-References

- **MCP Integration**: See [sdk_mcp_integration.md](./sdk_mcp_integration.md) for MCP server setup
- **Error Recovery**: See [sdk_error_recovery.md](./sdk_error_recovery.md) for session error handling
- **Compact Feature**: See [07_compact/](../07_compact/) for compaction details
- **Streaming Protocol**: See [streaming_protocol.md](./streaming_protocol.md) for message formats
- **Outbound Queue**: See [sdk_outbound_queue.md](./sdk_outbound_queue.md) for Pi6/Y26 queue architecture
- **Cross-References**: See [sdk_cross_references.md](./sdk_cross_references.md) for module integration details
