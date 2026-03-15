# HTTP Hooks

## Overview

HTTP hooks (introduced in v2.1.63) provide an alternative to shell command hooks for integrating with remote services. Instead of spawning a local process, an HTTP hook POSTs a JSON payload to a configurable URL and processes the JSON response. This enables integration with webhooks, remote approval systems, and external validation services without requiring local scripts.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks section)

Key functions in this document:
- `executeHttpHook` - HTTP hook executor (POSTs JSON payload, handles response)
- `executeHooksIterator` (NI) - Central generator that invokes all hook types including http
- `resolveHooksForEvent` (oRA) - Resolves which hooks apply for a given event

---

## Configuration

### Hook Type: `"http"`

HTTP hooks are configured with `type: "http"` in settings.json:

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "Bash",
      "type": "http",
      "url": "https://your-service.example.com/hooks/pre-tool",
      "timeout": 30000,
      "headers": {
        "Authorization": "Bearer <token>",
        "X-Custom-Header": "value"
      }
    }
  ]
}
```

### Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Must be `"http"` |
| `url` | string | Yes | Full URL to POST to (https:// recommended) |
| `timeout` | number | No | Request timeout in ms (default: 600000) |
| `headers` | object | No | Additional HTTP headers to include in request |

**Security note:** HTTP hooks do not support `async: true` (background mode), as they use HTTP's built-in response mechanism rather than background process management. HTTP hooks always wait for a response before the main loop continues.

---

## Request Format

### HTTP Method and Content-Type

HTTP hooks always use:
- Method: `POST`
- Content-Type: `application/json`
- Accept: `application/json`

### Request Body

The request body is the standard hook payload JSON serialized to a string. The payload is identical to what would be sent via stdin to a `command` hook:

```json
{
  "session_id": "abc123-...",
  "transcript_path": "/path/to/transcript",
  "cwd": "/current/working/directory",
  "permission_mode": "auto",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  },
  "tool_use_id": "toolu_xxx"
}
```

### Authentication

Authentication is handled via the `headers` field in the hook configuration. Common patterns:

**Bearer token:**
```json
{
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

**API key header:**
```json
{
  "headers": {
    "X-API-Key": "your-api-key-here"
  }
}
```

**Basic auth (pre-encoded):**
```json
{
  "headers": {
    "Authorization": "Basic dXNlcjpwYXNzd29yZA=="
  }
}
```

---

## Response Format

### Expected Response

The server must respond with HTTP 200 and a JSON body. The JSON schema is identical to the `command` hook output schema:

```json
{
  "continue": true,
  "suppressOutput": false,
  "systemMessage": "Optional context injected into conversation",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "Approved by remote policy"
  }
}
```

### Blocking via HTTP Response

To block an operation, the server returns a JSON body with a blocking error:

```json
{
  "blockingError": "Policy violation: command accesses restricted directory",
  "continue": false
}
```

Or returns the hook-specific deny decision:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Command blocked by security policy"
  }
}
```

### Non-200 HTTP Responses

If the server returns a non-200 HTTP status code:
- The hook is treated as a **non-blocking error** (similar to shell command exit code != 0 and != 2)
- The error is logged but execution continues
- The hook does not inject any context

### Response Timeout Behavior

If the server does not respond within the configured `timeout` (default 600,000ms):
- The hook times out with a non-blocking error
- The operation continues as if no hook was registered
- A timeout warning is logged

---

## Comparison: HTTP Hooks vs Command Hooks

| Aspect | Command Hook (`type: "command"`) | HTTP Hook (`type: "http"`) |
|--------|--------------------------------|--------------------------|
| Execution | Spawns local shell process | HTTP POST to remote URL |
| Input | JSON via stdin | JSON in request body |
| Output | JSON on stdout | JSON in response body |
| Blocking | Exit code 2 | `blockingError` field in JSON |
| Async support | Yes (`async: true`) | No (always synchronous) |
| Authentication | Via script logic | Via `headers` config |
| Dependencies | Local scripts/binaries | Remote HTTP endpoint |
| Use case | Local validation, scripts | Remote approval systems, SaaS webhooks |
| Network requirements | None (local) | Requires network access to URL |

---

## Architecture: How HTTP Hooks Execute

### Execution Flow

```
executeHooksIterator (NI)
    │
    ├── resolveHooksForEvent (oRA)
    │   → Returns list of hooks including http-type hooks
    │
    ├── mergeAsyncGenerators (_J6)
    │   → Starts all hook types concurrently
    │
    └── For each http hook:
        executeHttpHook(hookConfig, hookInput, signal, timeoutMs)
            │
            ├── Build HTTP request:
            │   • Method: POST
            │   • URL: hookConfig.url
            │   • Headers: { Content-Type: application/json, ...hookConfig.headers }
            │   • Body: JSON.stringify(hookInput)
            │
            ├── Send request with AbortSignal (for timeout + cancellation)
            │
            ├── On HTTP 200:
            │   • Parse response body as JSON
            │   • Process via parseHookOutput/processHookJsonOutput
            │   • Yield structured results upstream
            │
            └── On error/timeout/non-200:
                • Log non-blocking error
                • Continue without blocking
```

### Integration with Permission System

HTTP hooks integrate with the permission decision system identically to command hooks. The `permissionDecision` field in `hookSpecificOutput` controls whether a PreToolUse hook allows, denies, or asks for user confirmation:

```json
// Allow (bypass user prompt):
{ "hookSpecificOutput": { "hookEventName": "PreToolUse", "permissionDecision": "allow" } }

// Deny (block immediately):
{ "hookSpecificOutput": { "hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": "Blocked" } }

// Ask (force user prompt even if auto-allow rules apply):
{ "hookSpecificOutput": { "hookEventName": "PreToolUse", "permissionDecision": "ask" } }
```

---

## Practical Examples

### Example 1: Remote Command Approval Service

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "Bash",
      "type": "http",
      "url": "https://approval.example.com/api/hooks/pre-tool",
      "timeout": 10000,
      "headers": {
        "Authorization": "Bearer ${APPROVAL_TOKEN}"
      }
    }
  ]
}
```

**Server response for approved commands:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "Command approved by policy engine"
  }
}
```

**Server response for blocked commands:**
```json
{
  "blockingError": "This command is blocked by your organization's security policy",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny"
  }
}
```

### Example 2: Context Injection via Remote Service

```json
{
  "hooks": [
    {
      "event": "SessionStart",
      "matcher": "startup",
      "type": "http",
      "url": "https://context.example.com/api/session-context",
      "headers": {
        "X-Project-Id": "my-project"
      }
    }
  ]
}
```

**Server response:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Current sprint: Sprint 23\nActive tasks: 5\nBlocking issues: PROJ-123"
  }
}
```

### Example 3: Stop Hook Quality Gate

```json
{
  "hooks": [
    {
      "event": "Stop",
      "type": "http",
      "url": "https://qa.example.com/api/verify-completion",
      "timeout": 60000
    }
  ]
}
```

**Server response if verification passes:**
```json
{ "continue": true }
```

**Server response if verification fails:**
```json
{
  "blockingError": "QA check failed: 3 test cases are still failing. Please fix them before stopping."
}
```

---

## Security Considerations

### URL Validation

The URL must be a valid HTTP or HTTPS endpoint. Localhost and internal network addresses are permitted but should be used carefully in shared environments.

### Header Secrets

Sensitive values in `headers` (API keys, tokens) should be stored in `.claude/settings.local.json` (which is git-ignored) rather than in the project-shared `settings.json`:

```json
// .claude/settings.local.json (git-ignored)
{
  "hooks": [
    {
      "event": "PreToolUse",
      "type": "http",
      "url": "https://api.example.com/hooks",
      "headers": {
        "Authorization": "Bearer my-secret-token"
      }
    }
  ]
}
```

### Workspace Trust

Like all hooks, HTTP hooks are subject to the workspace trust check. They will not execute in untrusted directories regardless of configuration.

### Network Sandbox Interaction

When running with the sandbox enabled, HTTP hooks execute outside the sandbox (they are not sandboxed shell commands). The hook's HTTP requests bypass the sandbox network restrictions. This is by design: hook configurations are user-controlled and trusted, unlike model-generated Bash commands.

---

## Troubleshooting

### Hook Not Executing
1. Verify `type: "http"` is set (not `type: "command"`)
2. Check that the URL is reachable from the machine
3. Verify workspace trust is accepted
4. Check `disableAllHooks` setting is not true

### Hook Returning Non-Blocking Error
1. Check server returns HTTP 200 (not 4xx/5xx)
2. Verify response Content-Type is `application/json`
3. Validate response body is valid JSON
4. Check timeout is sufficient for your server's response time

### Blocking Not Working
1. Ensure `blockingError` field is set in response JSON
2. Check `hookSpecificOutput.permissionDecision` is `"deny"` for PreToolUse
3. Verify the hook event matches (e.g., `PreToolUse` for tool blocking)
