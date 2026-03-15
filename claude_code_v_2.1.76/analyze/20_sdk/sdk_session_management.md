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

## Cross-References

- **MCP Integration**: See [sdk_mcp_integration.md](./sdk_mcp_integration.md) for MCP server setup
- **Error Recovery**: See [sdk_error_recovery.md](./sdk_error_recovery.md) for session error handling
- **Compact Feature**: See [07_compact/](../07_compact/) for compaction details
- **Streaming Protocol**: See [streaming_protocol.md](./streaming_protocol.md) for message formats
- **Outbound Queue**: See [sdk_outbound_queue.md](./sdk_outbound_queue.md) for Pi6/Y26 queue architecture
