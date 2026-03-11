# SDK Session Management

## Overview

SDK sessions manage state differently from interactive CLI sessions. This document covers session persistence, session ID handling, auto-compact integration, and budget/turn limits in SDK mode.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - State management symbols
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - SDK configuration
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact feature

Key functions in this document:
- `initializeSession` (CJz) - Processes initialize control request
- `generateSessionId` (pcA) - Creates new session ID
- `resumeSession` (yt) - Resumes previous session
- `autoCompactDispatcher` (sI2) - Handles auto-compaction
- `setJsonSchema` (KR6) - Sets structured output schema

---

## Session Initialization

### initializeSession (CJz)

```javascript
// ============================================
// initializeSession - Process initialize control request
// Location: chunks.179.mjs:1654-1734
// ============================================

// ORIGINAL (for source lookup):
async function CJz(A, q, K, Y, z, w, H, $, O, _, J) {
    if (K) {
        Y.enqueue({ type: "control_response", response: { subtype: "error", error: "Already initialized", request_id: q, pending_permission_requests: H.getPendingPermissionRequests() } });
        return
    }
    // Apply session configuration
    if (A.systemPrompt !== void 0) O.systemPrompt = A.systemPrompt;
    if (A.appendSystemPrompt !== void 0) O.appendSystemPrompt = A.appendSystemPrompt;
    if (A.agents) {
        let X = fJ6(A.agents, "flagSettings");
        _.push(...X)
    }
    // ... agent model/prompt loading, hooks registration, jsonSchema ...
    let P = {
        commands: z.map(...),
        output_style: D,
        available_output_styles: ...,
        models: w,
        account: { email, organization, subscriptionType, tokenSource, apiKeySource }
    };
    Y.enqueue({ type: "control_response", response: { subtype: "success", request_id: q, response: P } })
}

// READABLE (for understanding):
async function initializeSession(request, requestId, isAlreadyInitialized, outputQueue, commands, models, streamIO, enableAuthStatus, sessionOptions, agentList, getSettings) {
    // Guard against double initialization
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

    // Apply system prompt overrides
    if (request.systemPrompt !== undefined) {
        sessionOptions.systemPrompt = request.systemPrompt;
    }
    if (request.appendSystemPrompt !== undefined) {
        sessionOptions.appendSystemPrompt = request.appendSystemPrompt;
    }

    // Load custom agents from JSON
    if (request.agents) {
        let customAgents = parseAgentsFromJson(request.agents, "flagSettings");
        agentList.push(...customAgents);
    }

    // Apply agent-specific settings if agent type specified
    if (sessionOptions.agent) {
        let agentDef = agentList.find((a) => a.agentType === sessionOptions.agent);
        if (agentDef) {
            activateAgent(agentDef.agentType);
            // Load agent's system prompt if not overridden
            if (!sessionOptions.systemPrompt && !hasCustomSystemPrompt(agentDef)) {
                let prompt = agentDef.getSystemPrompt();
                if (prompt) sessionOptions.systemPrompt = prompt;
            }
            // Load agent's model override
            if (!sessionOptions.userSpecifiedModel && agentDef.model && agentDef.model !== "inherit") {
                setModelOverride(resolveModel(agentDef.model));
            }
        }
    }

    // Register SDK hooks
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

    // Register JSON schema for structured output
    if (request.jsonSchema) {
        setJsonSchema(request.jsonSchema);
    }

    // Build session metadata for response
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
        fast_mode_state: getFastModeState()  // Only if available
    };

    outputQueue.enqueue({
        type: "control_response",
        response: {
            subtype: "success",
            request_id: requestId,
            response: sessionMetadata
        }
    });
}

// Mapping: CJz→initializeSession, A→request, q→requestId, K→isAlreadyInitialized, Y→outputQueue, z→commands, w→models, H→streamIO, O→sessionOptions, _→agentList, J→getSettings
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

## Max Turns and Budget Limits

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

// Turn counter increments after each agent turn
let turnCount = 0;

// After each turn:
turnCount++;

// Check limits:
if (maxTurns && turnCount >= maxTurns) {
    yield { type: "result", subtype: "error_max_turns", num_turns: turnCount, ... };
    return;
}

if (maxBudgetUsd && totalCostUsd >= maxBudgetUsd) {
    yield { type: "result", subtype: "error_max_budget_usd", total_cost_usd: totalCostUsd, ... };
    return;
}
```

---

## Auto-Compact Integration

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
    // SDK can disable compact entirely via environment variable
    if (parseBoolean(process.env.DISABLE_COMPACT)) {
        return { wasCompacted: false };
    }

    // Check if compaction is needed
    let tokenCount = countTokens(messages);
    let threshold = getCompactThreshold();

    if (tokenCount > threshold) {
        // Perform compaction
        let compactedMessages = await performCompaction(messages);

        // In SDK mode, compaction events are streamed
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

### Compact Behavior Differences

| Aspect | Interactive Mode | SDK Mode |
|---|---|---|
| Trigger | Token threshold | Token threshold (same) |
| Confirmation | User prompted | Automatic |
| Notification | UI message | `stream_event` message |
| Disable | Settings | `DISABLE_COMPACT=1` env var |

### Compact Stream Event

```javascript
// When compaction occurs in SDK mode:
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
| Max turns reached | `error_max_turns` | Turn count >= limit |
| Budget exceeded | `error_max_budget_usd` | Cost >= limit |
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
            "fast_mode_state": "on" | "off" | "cooldown"
        }
    }
}
```

### Fast Mode States

| State | Meaning |
|---|---|
| `on` | Fast mode active (using Haiku for initial responses) |
| `off` | Fast mode disabled |
| `cooldown` | Fast mode in cooldown (recently triggered) |

**Note:** Fast mode is not available in Agent SDK mode for direct use - the message `"Fast mode is not available in the Agent SDK"` is shown if the user tries to enable it via settings.

---

## Session Persistence Options

### Persistence Control

```bash
# Enable persistence (default)
claude --print --session-id "my-session"

# Disable persistence
claude --print --no-session-persistence

# Resume session
claude --print --continue
```

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
    │
    ├── Send initialize response with session metadata
    │
    └── Enter agent loop:
        │
        ├── For each user message:
        │   ├── Process through agent loop
        │   ├── Check max turns
        │   ├── Check budget
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