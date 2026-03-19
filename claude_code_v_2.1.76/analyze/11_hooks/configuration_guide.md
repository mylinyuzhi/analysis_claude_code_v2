# Hook Configuration Guide

## Overview

Hooks are configured in Claude Code's settings files and can be registered at multiple levels: user-wide, project-specific, or local directory. This guide covers the configuration format, hook types, practical examples, and best practices.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks section)

Key functions in this document:
- `resolveHooksForEvent` (kr8) - Loads and filters hooks from all sources
- `mergeHookSources` (E_z) - Merges hooks from policy, plugin, user/project settings

---

## Configuration Locations

### Settings Files Priority

Hooks can be configured in multiple files, with the following priority (highest to lowest):

| Priority | Location | Scope |
|----------|----------|-------|
| 1 | `~/.claude/settings.json` | User-wide (all projects) |
| 2 | `<project>/.claude/settings.json` | Project-specific |
| 3 | `<project>/.claude/settings.local.json` | Local overrides (git-ignored) |
| 4 | Managed policy | Organization-enforced |

### Settings File Format

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "Bash",
      "type": "command",
      "command": "echo 'Checking command safety...'"
    }
  ]
}
```

### Multiple Configuration Sources

Hooks from different sources are **merged**. If the same event/matcher combination exists in multiple files, they are all executed concurrently.

**Managed-only mode:** If `managedSettingsMode: "managedOnly"` is set in policy, only managed hooks are executed, ignoring user/project hooks.

---

## Hook Configuration Schema

### Common Fields

All hooks share these base fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event` | string | Yes | Hook event name (e.g., "PreToolUse", "SessionStart") |
| `matcher` | string | No | Match query (e.g., "Bash" for PreToolUse:Bash) |
| `type` | string | Yes | Hook type: "command", "http", "prompt", "agent", "callback", "function" |
| `timeout` | number | No | Timeout in milliseconds (default: 600000 = 10 min) |
| `async` | boolean | No | Run in background (command type only, default: false) |

### Type-Specific Fields

#### Command Hook

```json
{
  "event": "PreToolUse",
  "matcher": "Bash",
  "type": "command",
  "command": "bash-script.sh",
  "timeout": 30000,
  "async": false
}
```

| Field | Type | Description |
|-------|------|-------------|
| `command` | string | Shell command to execute |
| `timeout` | number | Execution timeout (ms) |
| `async` | boolean | Run in background |

**Input:** JSON payload via stdin
**Output:** JSON on stdout (parsed for structured response)
**Exit codes:** 0 = success, 2 = block, other = error

#### HTTP Hook (v2.1.63+)

```json
{
  "event": "PreToolUse",
  "matcher": "Bash",
  "type": "http",
  "url": "https://api.example.com/hooks/validate",
  "timeout": 5000
}
```

| Field | Type | Description |
|-------|------|-------------|
| `url` | string | URL to POST the hook payload to |
| `timeout` | number | Request timeout (ms) |

**Input:** JSON payload via POST body
**Output:** JSON response (parsed for structured response)
**Behavior:** POSTs hook input to URL, expects JSON response with same schema as command hooks
**Note:** Requires network access; supports authentication via headers configured in settings

#### Prompt Hook

```json
{
  "event": "Stop",
  "type": "prompt",
  "prompt": "Verify that all requested changes were made. If not, describe what's missing."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `prompt` | string | Prompt text sent to LLM |

**Behavior:** Sends prompt to LLM, receives `{"ok": true/false}` response.
**Note:** Requires ToolUseContext (only available in REPL context).

#### Agent Hook

```json
{
  "event": "Stop",
  "type": "agent",
  "agent_type": "code",
  "prompt": "Run tests and verify all pass before stopping."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `agent_type` | string | Agent type to spawn |
| `prompt` | string | Task for the agent |

**Behavior:** Spawns a full subagent with tools to verify a condition.
**Can block:** Yes, by returning `{"ok": false}`

#### Callback Hook

```json
{
  "event": "PreToolUse",
  "type": "callback",
  "callback": "myCallbackFunction"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `callback` | string | Registered callback name |

**Used by:** Plugin system for in-process hooks.
**Note:** Callbacks are registered via `registerHookCallback()`.

#### Function Hook

```json
{
  "event": "Stop",
  "type": "function",
  "function": "myStopFunction"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `function` | string | Function name in REPL context |

**Available for:** Stop hooks only.
**Behavior:** Executes function with access to conversation messages.

---

## Hook Input Payload

### Base Payload

All hooks receive a base payload:

```json
{
  "session_id": "uuid-string",
  "transcript_path": "/path/to/transcript",
  "cwd": "/current/working/directory",
  "permission_mode": "auto" | "plan" | null
}
```

### Event-Specific Payloads

#### PreToolUse

```json
{
  ...base,
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": { "command": "ls -la" },
  "tool_use_id": "toolu_xxx"
}
```

#### PostToolUse

```json
{
  ...base,
  "hook_event_name": "PostToolUse",
  "tool_name": "Read",
  "tool_input": { "file_path": "/src/index.js" },
  "tool_result": { "content": "..." },
  "tool_use_id": "toolu_xxx"
}
```

#### SessionStart

```json
{
  ...base,
  "hook_event_name": "SessionStart",
  "source": "startup" | "resume" | "clear" | "compact",
  "agent_type": "code",
  "model": "claude-sonnet-4-6"
}
```

#### PreCompact

```json
{
  ...base,
  "hook_event_name": "PreCompact",
  "trigger": "manual" | "auto",
  "custom_instructions": "string or null"
}
```

---

## Hook Output Schema

### Simple Output

Plain text output is treated as context:

```bash
#!/bin/bash
echo "Remember to check file permissions"
```

### Structured JSON Output

For control flow, return JSON:

```json
{
  "continue": true,
  "suppressOutput": false,
  "systemMessage": "Injected context message",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "updatedInput": { "command": "ls -la" }
  }
}
```

### Event-Specific Output Fields

#### PreToolUse Output

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow" | "deny" | "ask",
    "permissionDecisionReason": "Auto-approved safe operation",
    "updatedInput": { "command": "modified command" },
    "additionalContext": "Extra context for LLM"
  }
}
```

#### PostToolUse Output

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Test results: all passed",
    "updatedMCPToolOutput": { "modified": "output" }
  }
}
```

#### SessionStart Output

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Current git branch: main"
  }
}
```

#### PreCompact Output

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreCompact"
  },
  "systemMessage": "Preserve database migration state in summary"
}
```

---

## Practical Configuration Examples

### Example 1: Security Gate for Bash Commands

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "Bash",
      "type": "command",
      "command": "/home/user/scripts/check-command-safety.sh",
      "timeout": 5000
    }
  ]
}
```

**Script `/home/user/scripts/check-command-safety.sh`:**

```bash
#!/bin/bash
set -e

# Read hook input from stdin
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

# Check for dangerous patterns
if [[ "$COMMAND" =~ "rm -rf /" ]] || [[ "$COMMAND" =~ ":(){ :|:& };:" ]]; then
  echo '{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": "Blocked potentially destructive command"}, "reason": "Dangerous command pattern detected"}'
  exit 2
fi

# Allow safe commands
echo '{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "allow"}}'
exit 0
```

### Example 2: Auto-Approve Read-Only Tools

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "Read",
      "type": "command",
      "command": "echo '{\"hookSpecificOutput\": {\"hookEventName\": \"PreToolUse\", \"permissionDecision\": \"allow\"}}'"
    },
    {
      "event": "PreToolUse",
      "matcher": "Glob",
      "type": "command",
      "command": "echo '{\"hookSpecificOutput\": {\"hookEventName\": \"PreToolUse\", \"permissionDecision\": \"allow\"}}'"
    },
    {
      "event": "PreToolUse",
      "matcher": "Grep",
      "type": "command",
      "command": "echo '{\"hookSpecificOutput\": {\"hookEventName\": \"PreToolUse\", \"permissionDecision\": \"allow\"}}'"
    }
  ]
}
```

### Example 3: Run Tests After Write

```json
{
  "hooks": [
    {
      "event": "PostToolUse",
      "matcher": "Write",
      "type": "command",
      "command": "npm test 2>&1 | head -50",
      "timeout": 60000
    }
  ]
}
```

### Example 4: Lint Before Write

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "Write",
      "type": "command",
      "command": "/home/user/scripts/lint-before-write.sh",
      "timeout": 30000
    }
  ]
}
```

**Script:**

```bash
#!/bin/bash
set -e

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content')

# Write to temp file for linting
TMP_FILE=$(mktemp)
echo "$CONTENT" > "$TMP_FILE"

# Run linter
if ! npx eslint "$TMP_FILE" 2>&1; then
  echo '{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": "Linting errors found"}, "reason": "Fix linting errors before writing"}'
  rm "$TMP_FILE"
  exit 2
fi

rm "$TMP_FILE"
echo '{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "allow"}}'
exit 0
```

### Example 5: Session Start Environment Report

```json
{
  "hooks": [
    {
      "event": "SessionStart",
      "matcher": "startup",
      "type": "command",
      "command": "/home/user/scripts/env-report.sh"
    }
  ]
}
```

**Script:**

```bash
#!/bin/bash

REPORT="Environment Report:\n"
REPORT+="Node: $(node --version 2>/dev/null || echo 'not installed')\n"
REPORT+="npm: $(npm --version 2>/dev/null || echo 'not installed')\n"
REPORT+="git: $(git --version 2>/dev/null || echo 'not installed')\n"
REPORT+="\nGit Status:\n$(git status --short 2>/dev/null | head -10 || echo 'not a git repo')"

echo "{\"hookSpecificOutput\": {\"hookEventName\": \"SessionStart\", \"additionalContext\": \"$REPORT\"}}"
```

### Example 6: Stop Hook for Verification

```json
{
  "hooks": [
    {
      "event": "Stop",
      "type": "command",
      "command": "/home/user/scripts/verify-before-stop.sh",
      "timeout": 120000
    }
  ]
}
```

**Script:**

```bash
#!/bin/bash
set -e

# Run tests
if ! npm test 2>&1; then
  # Tests failed - block stopping, provide feedback
  ERRORS=$(npm test 2>&1 | tail -20)
  echo "{\"blockingError\": \"Tests failed:\n$ERRORS\"}"
  exit 2
fi

# All good - allow stopping
exit 0
```

### Example 7: Async Hook for Background Work

```json
{
  "hooks": [
    {
      "event": "PostToolUse",
      "matcher": "Write",
      "type": "command",
      "command": "/home/user/scripts/async-build.sh",
      "async": true
    }
  ]
}
```

**Script:**

```bash
#!/bin/bash

# Signal async mode immediately
echo '{"async": true, "asyncTimeout": 30000}'

# Now run the background work
npm run build > /tmp/build.log 2>&1
```

---

## Best Practices

### 1. Use Appropriate Timeouts

| Operation Type | Recommended Timeout |
|----------------|---------------------|
| Quick validation (lint, format check) | 5,000 - 30,000 ms |
| Test runs | 60,000 - 300,000 ms |
| Build operations | 120,000 - 600,000 ms |
| External API calls | 30,000 - 60,000 ms |

### 2. Handle Errors Gracefully

```bash
#!/bin/bash
set -e

# Always produce valid JSON output
trap 'echo "{\"error\": \"Script failed unexpectedly\"}"' ERR

INPUT=$(cat)
# ... process ...

echo '{"hookSpecificOutput": {...}}'
```

### 3. Log for Debugging

```bash
#!/bin/bash

LOG_FILE="/tmp/claude-hook.log"

log() {
  echo "[$(date)] $1" >> "$LOG_FILE"
}

log "Hook started with input: $(cat)"
# ... processing ...
log "Hook completed successfully"
```

### 4. Use Async for Long Operations

```json
{
  "hooks": [
    {
      "event": "PostToolUse",
      "matcher": "Write",
      "type": "command",
      "command": "npm run build",
      "async": true,
      "timeout": 300000
    }
  ]
}
```

### 5. Match Specific Tools/Events

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "Bash",
      "type": "command",
      "command": "..."
    },
    {
      "event": "PreToolUse",
      "matcher": "Write",
      "type": "command",
      "command": "..."
    }
  ]
}
```

### 6. Use Local Settings for Sensitive Hooks

Store sensitive hook configurations in `.claude/settings.local.json` (git-ignored):

```json
// settings.local.json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "Bash",
      "type": "command",
      "command": "/home/user/.secrets/check-internal-api.sh"
    }
  ]
}
```

---

## Troubleshooting

### Hook Not Running

1. **Check event name**: Must match exactly (case-sensitive)
2. **Check matcher**: Must match the tool name or source
3. **Check workspace trust**: Hooks are disabled in untrusted directories
4. **Check `disableAllHooks`**: Ensure this setting is not `true`

### Hook Timeout

1. **Increase timeout**: Set higher `timeout` value
2. **Use async mode**: For long-running operations
3. **Optimize script**: Profile and improve performance

### Hook Blocking Unexpectedly

1. **Check exit code**: Only exit code 2 blocks
2. **Check JSON output**: `blockingError` field blocks
3. **Check permission decision**: `permissionDecision: "deny"` blocks

### JSON Parse Errors

1. **Validate JSON**: Use `jq` to test output
2. **Escape properly**: Ensure strings are valid JSON
3. **Check for binary output**: Hook stdout should be text

---

## Summary

### Configuration Checklist

- [ ] Choose correct event name (22 available)
- [ ] Set appropriate matcher for tool-specific hooks
- [ ] Select hook type (command, http, prompt, agent, callback, function)
- [ ] Set appropriate timeout
- [ ] Test hook script independently
- [ ] Place in correct settings file (user/project/local)
- [ ] Verify workspace trust is accepted

### Quick Reference

| Event | Matcher | Common Use |
|-------|---------|------------|
| PreToolUse | Tool name | Input validation, security gates |
| PostToolUse | Tool name | Post-processing, logging |
| PostToolUseFailure | Tool name | Error recovery, diagnostics |
| SessionStart | Source (startup/resume/clear/compact) | Environment setup |
| PreCompact | Trigger (manual/auto) | Context injection |
| Stop | None | Verification, auto-commit |
| SubagentStart | Agent type | Subagent configuration |
| TeammateIdle | None | Work assignment |
| TaskCompleted | None | Quality gates |