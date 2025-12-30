# Hook Configuration

## Overview

This document describes how to configure hooks in Claude Code, including configuration sources, global settings, and custom hook development.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

---

## Configuration Sources

Claude Code loads hooks from multiple sources with a defined priority order.

### Priority Order (Highest to Lowest)

| Priority | Source | Location | Description |
|----------|--------|----------|-------------|
| 1 | Managed Settings | Enterprise policy | IT-managed hooks for organizations |
| 2 | User Settings | `~/.claude/settings.json` | User's personal hooks |
| 3 | Project Settings | `.claude/settings.json` | Project-specific hooks |
| 4 | Session Hooks | Programmatic (SDK) | Runtime-registered hooks |

### User Settings Location

```
~/.claude/settings.json
```

### Project Settings Location

```
<project_root>/.claude/settings.json
```

### Managed Settings

Enterprise administrators can configure hooks via managed policy settings. When `allowManagedHooksOnly` is enabled, user and project hooks are ignored.

---

## Configuration Schema

### Basic Structure

```json
{
  "hooks": {
    "<HookEvent>": [
      {
        "matcher": "<pattern>",   // Optional: filter by tool/context
        "hooks": [
          {
            "type": "command|prompt|agent",
            // ... type-specific fields
          }
        ]
      }
    ]
  }
}
```

### Hook Event Types

All 12 supported hook events:

```json
{
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "PostToolUseFailure": [...],
    "SessionStart": [...],
    "SessionEnd": [...],
    "Stop": [...],
    "SubagentStart": [...],
    "SubagentStop": [...],
    "UserPromptSubmit": [...],
    "Notification": [...],
    "PreCompact": [...],
    "PermissionRequest": [...]
  }
}
```

---

## Global Settings

### Disable All Hooks

Completely disable the hook system:

```json
{
  "disableAllHooks": true
}
```

**Effect:** All hooks are skipped, including StatusLine execution.

### Allow Managed Hooks Only

Restrict to enterprise-managed hooks (must be set in managed settings):

```json
{
  "allowManagedHooksOnly": true
}
```

**Effect:** User, project, and session hooks are ignored. Only hooks from managed settings run.

**Important:** When `allowManagedHooksOnly` is enabled:
- Plugin hooks are **completely excluded** (not filtered, entirely skipped)
- User-defined hooks in `~/.claude/settings.json` are ignored
- Project hooks in `.claude/settings.json` are ignored
- Session hooks registered via SDK are ignored
- Only hooks defined in managed policy settings will execute

### Workspace Trust

Hooks automatically check workspace trust:

```javascript
// Hooks are skipped if:
// 1. Not in remote environment AND
// 2. Workspace is not trusted
if (!isRemoteEnvironment() && !isWorkspaceTrusted()) {
  log("Skipping hook execution - workspace trust not accepted");
  return;
}
```

---

## Matcher Patterns

### Pattern Types

| Pattern | Example | Matches |
|---------|---------|---------|
| Exact | `"Write"` | Only "Write" |
| Wildcard | `"*"` or omitted | All values |
| Pipe-separated | `"Write\|Edit\|Bash"` | "Write", "Edit", or "Bash" |
| Regex | `"Bash.*"` | "Bash", "BashOutput", etc. |

### Matcher Edge Cases

**Empty String or Wildcard:**
- Empty string (`""`) matches all values (same as `*`)
- Omitting the matcher field also matches all

**Pattern Validation:**
- Matchers are trimmed (whitespace removed) before comparison
- Invalid regex patterns fail silently with a logged warning
- Pipe-separated values are trimmed individually: `"Write | Edit"` → `["Write", "Edit"]`

**Pattern Detection Logic:**
```javascript
// Simple patterns (alphanumeric + underscore + pipe)
if (/^[a-zA-Z0-9_|]+$/.test(pattern)) {
  // Uses exact match or pipe-split comparison
} else {
  // Falls back to regex evaluation
}
```

### Matcher Usage by Event

| Event Type | Matcher Field |
|------------|---------------|
| `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest` | `tool_name` |
| `SessionStart` | `source` |
| `PreCompact` | `trigger` |
| `Notification` | `notification_type` |
| `SessionEnd` | `reason` |
| `SubagentStart` | `agent_type` |

---

## Custom Hook Development

### Command Hook

#### Basic Example

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'File written: $CLAUDE_PROJECT_DIR'",
            "timeout": 10,
            "statusMessage": "Processing..."
          }
        ]
      }
    ]
  }
}
```

#### Environment Variables

Command hooks receive these environment variables:

| Variable | Description | Availability |
|----------|-------------|--------------|
| `CLAUDE_PROJECT_DIR` | Project root directory | All hooks |
| `CLAUDE_ENV_FILE` | Environment file path | SessionStart only |
| `CLAUDE_CODE_SHELL_PREFIX` | Custom shell prefix (if set) | All hooks |

**CLAUDE_CODE_SHELL_PREFIX (Advanced):**

Set this environment variable to prepend a custom shell wrapper to all hook commands:

```bash
# Set in your shell profile or before running Claude Code
export CLAUDE_CODE_SHELL_PREFIX="/path/to/shell-init.sh"
```

This is useful for:
- Custom shell environments requiring special initialization
- Wrapper scripts that set up PATH or other variables
- Debugging hook execution

When set, all hook commands are transformed:
```bash
# Original command
echo "Hello"

# With CLAUDE_CODE_SHELL_PREFIX="/custom/init.sh"
/custom/init.sh echo "Hello"
```

#### Input via Stdin

Hook input is provided as JSON via stdin:

```bash
#!/bin/bash
# Read hook input from stdin
HOOK_INPUT=$(cat)

# Parse JSON (requires jq)
TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.tool_name')
echo "Tool: $TOOL_NAME"
```

#### Exit Code Behavior

```bash
#!/bin/bash
# Exit 0 = Success
exit 0

# Exit 2 = BLOCKING ERROR (stops execution)
echo "Critical failure" >&2
exit 2

# Exit 1,3+ = Non-blocking error (continues with warning)
echo "Warning" >&2
exit 1
```

#### JSON Output for Control Flow

```bash
#!/bin/bash
# Return JSON for advanced control
cat <<'EOF'
{
  "decision": "approve",
  "systemMessage": "Validation passed",
  "suppressOutput": true
}
EOF
```

#### Permission Override

```bash
#!/bin/bash
# Auto-approve specific tools
cat <<'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "Command in whitelist"
  }
}
EOF
```

#### Async Hook

```bash
#!/bin/bash
# Return immediately, run in background
echo '{"async": true}'

# Continue processing (won't block Claude)
sleep 10
echo "Background task complete"
```

**Async Timeout Configuration:**

You can specify a custom timeout for async hooks (default: 15000ms):

```bash
#!/bin/bash
# Return immediately with custom timeout
echo '{"async": true, "asyncTimeout": 30000}'  # 30 seconds

# Long-running background task
# ... your processing ...
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `async` | `true` | required | Marks hook as async |
| `asyncTimeout` | number | 15000 | Timeout in milliseconds |

**Async Hook Lifecycle:**
1. Hook outputs `{"async": true}` as first JSON line
2. Process is backgrounded and detached
3. Stdout/stderr continue to accumulate in registry
4. Completion detected when non-async JSON is found in output
5. Results collected with `{processId, response, hookName, hookEvent, stdout, stderr, exitCode}`

---

### Prompt Hook

#### Basic Example

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Analyze this bash command for security risks: $ARGUMENTS. Return {\"ok\": true} if safe, or {\"ok\": false, \"reason\": \"explanation\"} if risky.",
            "timeout": 30,
            "model": "claude-sonnet-4-5-20250929",
            "statusMessage": "Analyzing command safety..."
          }
        ]
      }
    ]
  }
}
```

#### Response Schema

Prompt hooks must return JSON matching:

```typescript
{
  ok: boolean,
  reason?: string  // Required if ok === false
}
```

#### How It Works

1. `$ARGUMENTS` is replaced with JSON-stringified hook input
2. LLM is called with strict JSON-only system prompt
3. Response is prefilled with `{` to force JSON output
4. Result validated against `{ok: boolean, reason?: string}` schema
5. If `ok === false`, execution is blocked with `reason`

---

### Agent Hook

#### Basic Example

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "agent",
            "prompt": "Verify that the tests ran successfully. Check the output for any failures. Use the Read tool if needed to examine files. Return your verdict using the structured output tool.",
            "timeout": 120,
            "model": "claude-sonnet-4-5-20250929",
            "statusMessage": "Verifying test results..."
          }
        ]
      }
    ]
  }
}
```

#### How It Works

1. Spawns temporary sub-agent with tool access
2. Agent has read access to conversation transcript
3. Uses structured output tool for response: `{ok: boolean, reason?: string}`
4. Limited to 50 turns to prevent infinite loops
5. If `ok === false`, execution is blocked

#### Limitations

- Agent hooks are **NOT supported outside REPL** (returns error)
- Default model is Haiku for cost efficiency
- Recommended to increase timeout for complex verification

---

## Complete Configuration Examples

### Security Validation Hook

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/security-check.sh",
            "timeout": 30,
            "statusMessage": "Security validation..."
          }
        ]
      }
    ]
  }
}
```

```bash
#!/bin/bash
# security-check.sh
HOOK_INPUT=$(cat)
COMMAND=$(echo "$HOOK_INPUT" | jq -r '.tool_input.command')

# Check for dangerous patterns
if echo "$COMMAND" | grep -qE 'rm -rf|sudo|chmod 777'; then
  echo '{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": "Potentially dangerous command detected"}}'
  exit 0
fi

echo '{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "allow"}}'
exit 0
```

### Auto-Commit Hook

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "git add -A && git commit -m 'Auto-commit from Claude Code' || true",
            "timeout": 30,
            "statusMessage": "Auto-committing changes..."
          }
        ]
      }
    ]
  }
}
```

### Notification Forwarder

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "error",
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST https://slack.webhook.url -d '{\"text\": \"Claude Code error: $ARGUMENTS\"}'",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

### Context Injection on Session Start

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"hookSpecificOutput\": {\"hookEventName\": \"SessionStart\", \"additionalContext\": \"Project uses TypeScript 5.0 with strict mode enabled.\"}}'",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

---

## Programmatic Hook Registration (SDK)

For SDK users, hooks can be registered programmatically at runtime.

### Callback Hook

```javascript
// Register callback hook via SDK
const hook = {
  type: "callback",
  callback: async (hookInput, toolUseID, signal, hookIndex) => {
    console.log("Tool used:", hookInput.tool_name);

    // Check if aborted
    if (signal.aborted) {
      return { async: true };
    }

    // Return decision
    return {
      decision: "approve",
      systemMessage: "Approved by callback"
    };
  },
  timeout: 5000  // milliseconds
};
```

### Function Hook (Stop hooks only)

```javascript
// For Stop hooks with message access
const hook = {
  type: "function",
  callback: async (messages, signal) => {
    // Check conversation for errors
    const hasErrors = messages.some(m =>
      m.type === "tool_result" && m.isError
    );

    return !hasErrors;  // true = allow, false = block
  },
  errorMessage: "Cannot proceed - errors in conversation",
  timeout: 5000  // milliseconds
};
```

### Session Hook Registration

```javascript
// Register hook for current session
registerSessionHook(setAppState, sessionId, "PostToolUse", "Write", hook, onSuccessCallback);

// Unregister when done
unregisterSessionHook(setAppState, sessionId);
```

**Function Signatures:**

```typescript
// Register a session hook
function registerSessionHook(
  setAppState: (updater: (state) => state) => void,
  sessionId: string,
  hookEventType: HookEventType,  // "PreToolUse", "PostToolUse", etc.
  matcher: string,                // Pattern to match (e.g., "Write", "*")
  hook: Hook,                     // Hook configuration object
  onSuccessCallback?: (hook, result) => void  // Optional success callback
): void;

// Unregister all hooks for a session
function unregisterSessionHook(
  setAppState: (updater: (state) => state) => void,
  sessionId: string
): void;
```

**Hook Registration Structure:**

Session hooks are stored in AppState as:
```typescript
{
  sessionHooks: {
    [sessionId]: {
      hooks: {
        [eventType]: [
          {
            matcher: string,
            hooks: Array<{
              hook: HookConfig,
              onHookSuccess?: (hook, result) => void
            }>
          }
        ]
      }
    }
  }
}
```

**onHookSuccess Callback:**

The optional `onSuccessCallback` is called after successful hook execution:

```javascript
const onSuccess = (hook, result) => {
  console.log("Hook executed:", hook.type);
  console.log("Outcome:", result.outcome);
  // Perform post-hook state updates or side effects
};

registerSessionHook(
  setAppState,
  sessionId,
  "PostToolUse",
  "Write",
  myHook,
  onSuccess  // Called on success only
);
```

**Note:** Errors in the callback are caught and logged but don't propagate to block the main flow.

---

## Debugging Hooks

### Enable Debug Logging

Set environment variable:

```bash
export DEBUG=claude-code:hooks
```

### Log Output Examples

```
Hooks: Getting matching hook commands for PostToolUse with query: Write
Hooks: Found 2 hook matchers in settings
Hooks: Matched 1 unique hooks for query "Write" (1 before deduplication)
Hooks: Checking initial response for async: {"async": true}
Hooks: Detected async hook, backgrounding process async_hook_12345
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Hook not running | Matcher not matching | Check matcher pattern matches tool name |
| Hook output ignored | Invalid JSON | Ensure valid JSON starting with `{` |
| Blocking not working | Wrong exit code | Use exit code `2` for blocking errors |
| Timeout issues | Long-running command | Increase `timeout` value |
| Permission denied | Workspace trust | Accept workspace trust or run in remote environment |

---

## Best Practices

### 1. Use Appropriate Hook Types

| Use Case | Recommended Type |
|----------|------------------|
| Simple validation | `command` |
| LLM-based decisions | `prompt` |
| Complex verification | `agent` |
| SDK integration | `callback` |
| Message analysis | `function` (Stop only) |

### 2. Set Appropriate Timeouts

| Hook Type | Recommended Timeout |
|-----------|---------------------|
| Simple commands | 5-10 seconds |
| Network calls | 30 seconds |
| LLM prompts | 30-60 seconds |
| Agent verification | 120+ seconds |

### 3. Handle Errors Gracefully

```bash
#!/bin/bash
# Good: Non-blocking error for warnings
echo "Warning: file not found" >&2
exit 1

# Good: Blocking error for critical issues
echo "CRITICAL: security violation detected" >&2
exit 2

# Bad: Silent failure
exit 0  # Should report the issue
```

### 4. Use JSON Output for Control Flow

```bash
#!/bin/bash
# Return structured output instead of relying on exit codes
cat <<'EOF'
{
  "suppressOutput": true,
  "systemMessage": "Validation complete",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow"
  }
}
EOF
```

### 5. Keep Hooks Fast

- Avoid blocking operations in frequently-triggered hooks
- Use `async: true` for background tasks
- Cache expensive computations
- Use matchers to reduce unnecessary executions

---

## See Also

- [Hook Types](./types.md) - Hook type definitions and schemas
- [Hook Execution](./execution.md) - Execution flow and event handling
