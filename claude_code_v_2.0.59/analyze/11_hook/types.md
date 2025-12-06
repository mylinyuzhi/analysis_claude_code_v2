# Hook Types Documentation

## Overview

Claude Code v2.0.59 supports 5 types of hooks that can be executed at various points during tool usage and session lifecycle. Hooks allow customization of behavior through external commands, LLM evaluation, agents, callbacks, and JavaScript functions.

## Hook Type Definitions

### 1. Command Hook

Executes a bash command when triggered.

**Schema:**
```typescript
{
  type: "command",
  command: string,           // Shell command to execute
  timeout?: number,          // Timeout in seconds (optional)
  statusMessage?: string     // Custom status message for spinner (optional)
}
```

**Example:**
```json
{
  "PostToolUse": [
    {
      "matcher": "Write",
      "hooks": [
        {
          "type": "command",
          "command": "echo 'File written successfully'",
          "timeout": 10,
          "statusMessage": "Running post-write validation..."
        }
      ]
    }
  ]
}
```

**Behavior:**
- Executes the specified shell command
- Command receives hook input as JSON via `$ARGUMENTS` placeholder
- Exit code determines outcome:
  - `0`: Success
  - `2`: Blocking error (stops execution)
  - Other codes: Non-blocking error (logs warning, continues)

**Timeout:**
- Default: 60 seconds
- Can be overridden per hook
- Timeout triggers cancellation

---

### 2. Prompt Hook

Evaluates a prompt using an LLM to make decisions.

**Schema:**
```typescript
{
  type: "prompt",
  prompt: string,            // Prompt to evaluate
  timeout?: number,          // Timeout in seconds (optional)
  model?: string,            // Model to use (optional, defaults to small fast model)
  statusMessage?: string     // Custom status message for spinner (optional)
}
```

**Example:**
```json
{
  "PreToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "Analyze this command for security risks: $ARGUMENTS. Return JSON with {decision: 'approve'|'block', reason: string}",
          "timeout": 30,
          "model": "claude-sonnet-4-5-20250929",
          "statusMessage": "Checking command safety..."
        }
      ]
    }
  ]
}
```

**Features:**
- Uses `$ARGUMENTS` placeholder for hook input JSON
- Can specify custom model (defaults to small fast model if not provided)
- Returns JSON response for decision-making
- Suitable for validation, filtering, and approval workflows

**Timeout:**
- Default: 60 seconds
- Can be overridden per hook

---

### 3. Agent Hook

Runs an agentic verifier with full tool access.

**Schema:**
```typescript
{
  type: "agent",
  prompt: string,            // Verification task description
  timeout?: number,          // Timeout in seconds (default 60)
  model?: string,            // Model to use (optional, defaults to Haiku)
  statusMessage?: string     // Custom status message for spinner (optional)
}
```

**Example:**
```json
{
  "PostToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        {
          "type": "agent",
          "prompt": "Verify that unit tests ran and passed. Use $ARGUMENTS for command details.",
          "timeout": 120,
          "model": "claude-sonnet-4-5-20250929",
          "statusMessage": "Verifying test results..."
        }
      ]
    }
  ]
}
```

**Features:**
- Full agentic capabilities with tool access
- Can read files, run commands, and perform complex verification
- Uses `$ARGUMENTS` placeholder for hook input JSON
- Prompt is transformed into a function that returns verification instructions
- Default model is Haiku for cost efficiency

**Timeout:**
- Default: 60 seconds
- Recommended to increase for complex verification tasks

**Limitations:**
- Stop hooks with agent type are not yet supported outside REPL

---

### 4. Callback Hook

Executes a JavaScript callback function (programmatic use only).

**Schema:**
```typescript
{
  type: "callback",
  callback: (hookInput: HookInput, toolUseID: string, signal: AbortSignal, hookIndex: number) => Promise<HookOutput>,
  timeout?: number           // Timeout in milliseconds (optional)
}
```

**Example (programmatic):**
```javascript
{
  type: "callback",
  callback: async (hookInput, toolUseID, signal, hookIndex) => {
    // Custom logic here
    console.log("Tool used:", hookInput.tool_name);

    // Return hook output
    return {
      decision: "approve"
    };
  },
  timeout: 5000
}
```

**Features:**
- Programmatic hook for SDK/API integration
- Receives full hook input, tool use ID, abort signal, and hook index
- Can return hook output JSON for decision-making
- Supports async operations

**Timeout:**
- Default: 60 seconds (60000 ms)
- Can be overridden per hook

**Note:** Callback hooks are not available in JSON configuration files - they are for programmatic use only.

---

### 5. Function Hook

Executes a JavaScript function with message access (REPL context only).

**Schema:**
```typescript
{
  type: "function",
  callback: (messages: Message[], signal: AbortSignal) => Promise<boolean>,
  errorMessage: string,      // Error message to display if function returns false
  timeout?: number           // Timeout in milliseconds (optional)
}
```

**Example (programmatic):**
```javascript
{
  type: "function",
  callback: async (messages, signal) => {
    // Analyze conversation messages
    const hasErrors = messages.some(m =>
      m.type === "tool_result" && m.isError
    );

    return !hasErrors; // true = approve, false = block
  },
  errorMessage: "Cannot proceed - errors detected in conversation",
  timeout: 5000
}
```

**Features:**
- Access to full conversation messages
- Receives abort signal for cancellation support
- Returns boolean: `true` for success, `false` for blocking error
- Only works in REPL context (Stop hooks)

**Behavior:**
- If function returns `true`: Success
- If function returns `false`: Blocking error with errorMessage
- If function throws or times out: Non-blocking error

**Timeout:**
- Default: 60 seconds (60000 ms)
- Can be overridden per hook

**Limitations:**
- **Only supported in REPL context (Stop hooks)**
- Requires messages array (not available in non-REPL contexts)
- Will error if executed outside REPL

**Note:** Function hooks are not available in JSON configuration files - they are for programmatic use only.

---

## Configuration Schema

### Hook Configuration Structure

```typescript
{
  "hooks": {
    "<HookEvent>": [
      {
        "matcher": string,     // Optional: Pattern to match (e.g., tool name)
        "hooks": [
          {
            "type": "command" | "prompt" | "agent" | "callback" | "function",
            // ... type-specific fields
          }
        ]
      }
    ]
  }
}
```

### Matcher System

Matchers allow targeting specific tools or contexts:

```json
{
  "PostToolUse": [
    {
      "matcher": "Write",      // Match Write tool only
      "hooks": [...]
    },
    {
      "matcher": "Bash",       // Match Bash tool only
      "hooks": [...]
    }
  ]
}
```

If matcher is not specified, hook applies to all triggers of that event type.

---

## Timeout Handling

### Default Timeout
- All hooks default to **60 seconds** (60000 ms)
- Can be configured at system level: `ZN = 60000`

### Per-Hook Timeout Override

Each hook type supports optional `timeout` field:
- **Command/Prompt/Agent hooks:** Timeout in **seconds**
- **Callback/Function hooks:** Timeout in **milliseconds**

```json
{
  "type": "command",
  "command": "npm test",
  "timeout": 300        // 5 minutes in seconds
}
```

```javascript
{
  type: "callback",
  callback: async () => { /* ... */ },
  timeout: 5000         // 5 seconds in milliseconds
}
```

### Timeout Behavior

1. **Before timeout:** Hook executes normally
2. **On timeout:**
   - Abort signal fires
   - Hook execution is cancelled
   - Outcome: `"cancelled"`
   - Message: `hook_cancelled` event

3. **Cleanup:** Always runs after timeout via cleanup callback

---

## Exit Code Behaviors (Command Hooks)

Command hooks interpret exit codes as follows:

| Exit Code | Outcome | Behavior |
|-----------|---------|----------|
| `0` | Success | Hook succeeds, stdout included in output |
| `2` | Blocking Error | Stops execution, shows error with stderr |
| Others (`1`, `3+`) | Non-blocking Error | Logs warning with stderr, continues execution |

### JSON Output Handling

Command hooks can return JSON for advanced control:

```bash
#!/bin/bash
# Return JSON for decision-making
echo '{
  "decision": "approve",
  "reason": "Command is safe"
}'
```

**Special JSON fields:**
- `suppressOutput`: Hide output from user
- `decision`: "approve" or "block"
- `systemMessage`: Add message to conversation
- `additionalContext`: Inject context into conversation

**JSON Validation:**
- Invalid JSON triggers non-blocking error
- Validation uses `oX9()` function
- Error shows: "JSON validation failed: <reason>"

---

## Hook Output Processing

### Success Output

```typescript
{
  message: {
    type: "hook_success",
    hookName: string,
    toolUseID: string,
    hookEvent: string,
    content: string,      // stdout or custom message
    stdout: string,
    stderr: string,
    exitCode: number
  },
  outcome: "success",
  hook: HookDefinition
}
```

### Blocking Error Output

```typescript
{
  blockingError: {
    blockingError: string,  // Error message
    command: string         // Command that failed
  },
  outcome: "blocking",
  hook: HookDefinition
}
```

### Non-Blocking Error Output

```typescript
{
  message: {
    type: "hook_non_blocking_error",
    hookName: string,
    toolUseID: string,
    hookEvent: string,
    stderr: string,
    stdout: string,
    exitCode: number
  },
  outcome: "non_blocking_error",
  hook: HookDefinition
}
```

### Cancelled Output

```typescript
{
  message: {
    type: "hook_cancelled",
    hookName: string,
    toolUseID: string,
    hookEvent: string
  },
  outcome: "cancelled",
  hook: HookDefinition
}
```

---

## Disabling Hooks

### Global Disable

```json
{
  "disableAllHooks": true
}
```

This disables:
- All hook execution
- StatusLine execution

### Managed Hooks Only

```json
{
  "allowManagedHooksOnly": true
}
```

When set in managed settings:
- Only hooks from managed settings run
- User, project, and local hooks are ignored

### Workspace Trust

Hooks are automatically skipped if workspace trust is not accepted:
```
Skipping <HookEvent> hook execution - workspace trust not accepted
```

---

## Best Practices

### 1. Choose the Right Hook Type

- **Command:** Simple validation, file operations, notifications
- **Prompt:** LLM-based decisions, content analysis, approval workflows
- **Agent:** Complex verification requiring tools (e.g., test validation)
- **Callback:** Programmatic integration in SDK/API
- **Function:** Message-based logic in Stop hooks only

### 2. Set Appropriate Timeouts

- Short timeouts (5-10s) for simple commands
- Medium timeouts (30-60s) for prompts
- Long timeouts (120s+) for agents and complex verification

### 3. Handle Errors Gracefully

- Use exit code 2 only for critical blocking errors
- Use exit code 1 for warnings that shouldn't stop execution
- Provide helpful error messages in stderr

### 4. Use Matchers Effectively

- Target specific tools to reduce overhead
- Use broad matchers for cross-cutting concerns (logging, metrics)

### 5. JSON Output for Advanced Control

- Return JSON for decision-making and additional context
- Use `suppressOutput: true` for silent hooks
- Add `systemMessage` for user-visible information

---

## Summary Table

| Hook Type | Use Case | Configuration | Timeout Unit | REPL Only |
|-----------|----------|--------------|--------------|-----------|
| `command` | Shell commands | JSON | Seconds | No |
| `prompt` | LLM evaluation | JSON | Seconds | No |
| `agent` | Agentic verification | JSON | Seconds | No |
| `callback` | Programmatic logic | Code | Milliseconds | No |
| `function` | Message analysis | Code | Milliseconds | **Yes** |

---

## See Also

- [Hook Execution](./execution.md) - Execution flow and event types
- [Settings Schema](../00_overview/settings_schema.md) - Full configuration reference
