# Hook Execution Flow

## Overview

This document describes how hooks are executed in Claude Code v2.0.59, including event types, matcher system, execution ordering, error handling, and output processing.

---

## Hook Event Types

Claude Code supports 12 hook event types that trigger at different points in the session lifecycle:

### Tool-Related Events

#### 1. PreToolUse
**When:** Before a tool is executed
**Context:**
```typescript
{
  hook_event_name: "PreToolUse",
  tool_name: string,        // Name of tool about to execute
  tool_input: object,       // Input arguments for the tool
  tool_use_id: string,      // Unique ID for this tool use
  // ... session context
}
```
**Use Cases:**
- Pre-validation of tool inputs
- Security checks
- Input transformation
- Permission decisions

---

#### 2. PostToolUse
**When:** After a tool executes successfully
**Context:**
```typescript
{
  hook_event_name: "PostToolUse",
  tool_name: string,        // Name of executed tool
  tool_input: object,       // Input arguments used
  tool_response: object,    // Tool's response/output
  tool_use_id: string,      // Unique ID for this tool use
  // ... session context
}
```
**Use Cases:**
- Post-execution validation
- Output verification
- Cleanup operations
- Logging/metrics

**Example:**
```json
{
  "PostToolUse": [
    {
      "matcher": "Write",
      "hooks": [
        {
          "type": "command",
          "command": "git add $FILE && git commit -m 'Auto-commit'",
          "statusMessage": "Committing changes..."
        }
      ]
    }
  ]
}
```

---

#### 3. PostToolUseFailure
**When:** After a tool execution fails or is interrupted
**Context:**
```typescript
{
  hook_event_name: "PostToolUseFailure",
  tool_name: string,        // Name of failed tool
  tool_input: object,       // Input arguments used
  tool_use_id: string,      // Unique ID for this tool use
  error: string,            // Error message
  is_interrupt: boolean,    // True if user interrupted
  // ... session context
}
```
**Use Cases:**
- Error recovery
- Rollback operations
- Error logging
- Cleanup after failures

---

### Session Events

#### 4. SessionStart
**When:** At the beginning of a new session
**Context:**
```typescript
{
  hook_event_name: "SessionStart",
  source: string,           // Session source (e.g., "cli", "repl")
  // ... session context
}
```
**Use Cases:**
- Environment setup
- Initial configuration
- Welcome messages
- Logging session start

---

#### 5. SessionEnd
**When:** At the end of a session
**Context:**
```typescript
{
  hook_event_name: "SessionEnd",
  // ... session context
}
```
**Use Cases:**
- Cleanup operations
- Session summary
- Saving state
- Logging session end

---

#### 6. Stop
**When:** When user stops execution (Ctrl+C) or session ends
**Context:**
```typescript
{
  hook_event_name: "Stop",
  stop_hook_active: boolean,  // True if already in stop hook
  // ... session context
}
```
**Use Cases:**
- Cleanup on interruption
- Save progress
- Graceful shutdown
- Message-based verification (function hooks)

**Special:** Supports function hooks with message access

---

### Subagent Events

#### 7. SubagentStart
**When:** When a subagent session begins
**Context:**
```typescript
{
  hook_event_name: "SubagentStart",
  agent_id: string,         // ID of the subagent
  agent_type: string,       // Type/name of agent
  // ... session context
}
```
**Use Cases:**
- Subagent initialization
- Context setup
- Logging subagent creation

---

#### 8. SubagentStop
**When:** When a subagent session ends
**Context:**
```typescript
{
  hook_event_name: "SubagentStop",
  stop_hook_active: boolean,
  agent_id: string,             // ID of the subagent
  agent_transcript_path: string, // Path to agent transcript
  // ... session context
}
```
**Use Cases:**
- Subagent cleanup
- Result aggregation
- Transcript processing

---

### User Interaction Events

#### 9. UserPromptSubmit
**When:** User submits a prompt/message
**Context:**
```typescript
{
  hook_event_name: "UserPromptSubmit",
  prompt: string,           // User's submitted prompt
  // ... session context
}
```
**Use Cases:**
- Prompt preprocessing
- Content filtering
- Logging user input
- Rate limiting

---

#### 10. Notification
**When:** System sends a notification
**Context:**
```typescript
{
  hook_event_name: "Notification",
  message: string,          // Notification message
  title?: string,           // Notification title
  notification_type: string, // Type of notification
  // ... session context
}
```
**Use Cases:**
- External notification forwarding (Slack, email)
- Logging important events
- Custom alert handling

---

### Context Compaction

#### 11. PreCompact
**When:** Before context compaction occurs
**Context:**
```typescript
{
  hook_event_name: "PreCompact",
  trigger: string,          // What triggered compaction
  custom_instructions?: string, // Current custom instructions
  // ... session context
}
```
**Use Cases:**
- Add context before compaction
- Inject custom instructions
- Preserve important information

**Special:** Can return new custom instructions

---

### Permission Requests

#### 12. PermissionRequest
**When:** Before requesting permission from user
**Context:**
```typescript
{
  hook_event_name: "PermissionRequest",
  // ... permission request details
  // ... session context
}
```
**Use Cases:**
- Auto-approve specific permissions
- Add verification logic
- Log permission requests
- Custom permission UI

---

## Hook Matcher System

### Matcher Definition

Matchers filter which hooks execute based on context:

```typescript
{
  matcher?: string,     // Optional pattern to match
  hooks: Hook[]        // Hooks to execute if matched
}
```

### Matching Logic

#### Tool Events
For `PreToolUse`, `PostToolUse`, `PostToolUseFailure`:
- Matcher compares against **tool name**
- Example: `"matcher": "Write"` matches Write tool only

#### Other Events
For `Notification`, `SessionStart`, `SubagentStart`, `PreCompact`:
- Matcher compares against event-specific field:
  - `Notification`: Matches `notification_type`
  - `SessionStart`: Matches `source`
  - `SubagentStart`: Matches `agent_type`
  - `PreCompact`: Matches `trigger`

#### No Matcher
- If matcher is omitted, hook executes for all triggers of that event type

### Matcher Examples

```json
{
  "PostToolUse": [
    {
      "matcher": "Write",       // Only Write tool
      "hooks": [...]
    },
    {
      "matcher": "Edit",        // Only Edit tool
      "hooks": [...]
    },
    {
      // No matcher - all tools
      "hooks": [...]
    }
  ],
  "Notification": [
    {
      "matcher": "error",       // Only error notifications
      "hooks": [...]
    }
  ]
}
```

---

## Execution Flow

### Main Execution Function: `qa()`

The primary hook execution function is an async generator:

```typescript
async function* qa({
  hookInput: HookInput,
  toolUseID: string,
  matchQuery?: string,
  signal: AbortSignal,
  timeoutMs?: number,
  toolUseContext?: ToolUseContext,
  messages?: Message[]
}) { ... }
```

### Execution Steps

#### 1. Pre-Execution Checks

```
1. Check if hooks are disabled (disableAllHooks setting)
   → If true: Return early, skip all hooks

2. Check workspace trust
   → If not accepted: Log skip message and return

3. Get app state (if toolUseContext provided)
   → Used for session-specific hook configuration

4. Retrieve matching hooks for event
   → Uses matcher system to filter hooks
   → If no matching hooks: Return early

5. Check abort signal
   → If already aborted: Return early
```

#### 2. Hook Progress Notification

For each hook about to execute, yield progress message:

```typescript
{
  message: {
    type: "progress",
    data: {
      type: "hook_progress",
      hookEvent: string,
      hookName: string,
      command: string,
      promptText?: string,
      statusMessage?: string
    },
    parentToolUseID: string,
    toolUseID: string,
    timestamp: string,
    uuid: string
  }
}
```

#### 3. Parallel Hook Execution

Hooks execute in parallel via `Promise.all()` pattern:

```typescript
let hookPromises = hooks.map(async function*(hook, index) {
  // Execute individual hook
});

for await (let result of mergeAsyncGenerators(hookPromises)) {
  // Process results as they complete
}
```

#### 4. Individual Hook Execution

Each hook type has specific execution path:

**Callback Hook:**
```
1. Create timeout signal
2. Call callback(hookInput, toolUseID, signal, hookIndex)
3. Process JSON output
4. Cleanup timeout
5. Return outcome
```

**Function Hook:**
```
1. Validate messages array exists
2. Create timeout signal
3. Call callback(messages, signal)
4. Boolean result: true=success, false=blocking error
5. Cleanup timeout
6. Return outcome
```

**Command/Prompt/Agent Hook:**
```
1. Stringify hookInput to JSON
2. Replace $ARGUMENTS placeholder
3. Execute hook (command/prompt/agent specific)
4. Process output/response
5. Parse JSON if present
6. Determine outcome from exit code/response
7. Cleanup timeout
8. Return outcome
```

#### 5. Result Aggregation

Results are aggregated and tracked:

```typescript
{
  success: number,            // Count of successful hooks
  blocking: number,           // Count of blocking errors
  non_blocking_error: number, // Count of non-blocking errors
  cancelled: number           // Count of cancelled hooks
}
```

#### 6. Output Processing

Each result is processed and yields:

```typescript
// Success
if (result.message) yield { message }

// Blocking error
if (result.blockingError) yield { blockingError }

// System message
if (result.systemMessage) yield { message: hook_system_message }

// Additional context
if (result.additionalContext) yield { additionalContexts: [...] }

// Permission behavior
if (result.permissionBehavior) yield { permissionBehavior, ... }

// And more...
```

#### 7. Hook Success Callback

If hook succeeds and session has `onHookSuccess` callback:

```typescript
if (appState && hook.type !== "callback") {
  let sessionHook = findSessionHook(appState, hookEvent, matcher, hook);
  if (sessionHook?.onHookSuccess && outcome === "success") {
    sessionHook.onHookSuccess(hook, result);
  }
}
```

#### 8. Telemetry Event

At the end, emit telemetry:

```typescript
telemetry("tengu_repl_hook_finished", {
  hookName: string,
  numCommands: number,
  numSuccess: number,
  numBlocking: number,
  numNonBlockingError: number,
  numCancelled: number
});
```

---

## Execution Ordering

### Hook Order Within Event

For a single hook event with multiple matchers:

```
1. Hooks are retrieved in configuration order
2. All hooks execute in parallel (Promise.all)
3. Results are processed as they complete (non-deterministic order)
4. Aggregation happens after all hooks finish
```

### Multiple Hook Events

Different hook events execute at different times in the lifecycle:

```
Session Lifecycle:
  SessionStart
    ↓
  UserPromptSubmit (on each user message)
    ↓
  PreToolUse (before each tool)
    ↓
  PostToolUse | PostToolUseFailure (after each tool)
    ↓
  PreCompact (when context full)
    ↓
  Notification (as needed)
    ↓
  Stop | SubagentStop (on interruption)
    ↓
  SessionEnd
```

### Tool Use Lifecycle

```
PreToolUse hooks
    ↓
Execute tool
    ↓
PostToolUse hooks (if success)
    OR
PostToolUseFailure hooks (if failure)
```

---

## Error Handling

### Hook Execution Errors

#### 1. Timeout
```typescript
{
  message: {
    type: "hook_cancelled",
    hookName: string,
    toolUseID: string,
    hookEvent: string
  },
  outcome: "cancelled"
}
```

#### 2. JSON Stringify Failure
```typescript
{
  message: {
    type: "hook_error_during_execution",
    hookName: string,
    toolUseID: string,
    hookEvent: string,
    content: "Failed to prepare hook input: <error>"
  },
  outcome: "non_blocking_error"
}
```

#### 3. Command Execution Error
```typescript
{
  message: {
    type: "hook_non_blocking_error",
    hookName: string,
    toolUseID: string,
    hookEvent: string,
    stderr: "Failed to run: <error>",
    stdout: "",
    exitCode: 1
  },
  outcome: "non_blocking_error"
}
```

#### 4. Function Hook Missing Messages
```typescript
{
  message: {
    type: "hook_error_during_execution",
    hookName: string,
    toolUseID: string,
    hookEvent: string,
    content: "Messages not provided for function hook"
  },
  outcome: "non_blocking_error"
}
```

### Error Recovery

Claude Code handles hook errors gracefully:

1. **Non-blocking errors:** Log error, continue execution
2. **Blocking errors:** Stop execution, show error to user
3. **Cancelled hooks:** Clean up, continue if possible
4. **Missing context:** Skip hooks that can't execute

### Workspace Trust

If workspace trust is not accepted:
```
g(`Skipping ${hookName} hook execution - workspace trust not accepted`);
return; // Exit early
```

### DisableAllHooks Setting

If `disableAllHooks` is true:
```
if (settings.disableAllHooks) {
  g(`Skipping hooks for ${hookName} due to 'disableAllHooks' setting`);
  return [];
}
```

---

## Hook Output Processing

### JSON Output Parsing

Function: `oX9(stdout: string)`

Attempts to parse stdout as JSON:

```typescript
{
  json: object | null,        // Parsed JSON if valid
  plainText: string,          // Original stdout
  validationError: string | null // Error message if invalid
}
```

**Validation Error Handling:**
```typescript
if (validationError) {
  yield {
    message: {
      type: "hook_non_blocking_error",
      stderr: `JSON validation failed: ${validationError}`,
      stdout: stdout,
      exitCode: 1
    },
    outcome: "non_blocking_error"
  };
  return;
}
```

### Special JSON Fields

Function: `tX9()` processes JSON output for special fields:

#### 1. Empty Output (No Decision)
```json
{}
```
Result: Silent success (no output to user)

Check: `zYA(json)` returns true for empty/no-op output

#### 2. Decision Field
```json
{
  "decision": "approve" | "block",
  "reason": "..."
}
```

**approve:** Continue execution
**block:** Stop execution with blocking error

#### 3. Permission Decision
```json
{
  "permissionDecision": "allow" | "deny" | "ask",
  "updatedInput": { ... }
}
```

**allow:** Auto-approve permission
**deny:** Auto-deny permission
**ask:** Prompt user (default behavior)

#### 4. System Message
```json
{
  "systemMessage": "Message visible to LLM and user"
}
```

Adds message to conversation context

#### 5. Additional Context
```json
{
  "additionalContext": {
    "type": "text",
    "content": "..."
  }
}
```

Injects context into conversation without user visibility

#### 6. Suppress Output
```json
{
  "suppressOutput": true
}
```

Prevents hook output from being shown to user

#### 7. Stop Continuation
```json
{
  "preventContinuation": true,
  "stopReason": "..."
}
```

Stops further execution with reason

---

## Outside REPL Execution

Function: `kV0()` - Execute hooks outside REPL context

Used for synchronous hook execution without streaming:

```typescript
async function kV0({
  getAppState: () => AppState,
  hookInput: HookInput,
  matchQuery?: string,
  signal: AbortSignal,
  timeoutMs?: number
}): Promise<HookResult[]>
```

**Key Differences from REPL (`qa()`):**
- Returns array of results instead of async generator
- No streaming progress updates
- Agent hooks not supported (returns error message)
- Function hooks not supported (returns error)
- Used for: `SessionEnd`, `Notification`, `PreCompact`

**Example Usage:**
```typescript
// PreCompact hooks
let results = await kV0({
  hookInput: {
    hook_event_name: "PreCompact",
    trigger: "user",
    custom_instructions: "..."
  },
  matchQuery: "user",
  signal: abortSignal,
  timeoutMs: 60000
});

// Process results
let newInstructions = results
  .filter(r => r.succeeded && r.output.trim())
  .map(r => r.output.trim())
  .join('\n\n');
```

---

## Hook Type Execution Implementation

### Function Hook Execution

**From chunks.147.mjs:698-754:**
```javascript
// ============================================
// Ay3 - Execute function hook
// Location: chunks.147.mjs:698
// ============================================
async function Ay3({
  hook,
  messages,
  hookName,
  toolUseID,
  hookEvent,
  timeoutMs,
  signal
}) {
  let timeout = hook.timeout ?? timeoutMs,
    { signal: timeoutSignal, cleanup } = ck(AbortSignal.timeout(timeout), signal);

  try {
    if (timeoutSignal.aborted) {
      return cleanup(), { outcome: "cancelled", hook };
    }

    // Execute function hook callback with messages
    let result = await new Promise((resolve, reject) => {
      let abortHandler = () => reject(Error("Function hook cancelled"));
      timeoutSignal.addEventListener("abort", abortHandler);

      Promise.resolve(hook.callback(messages, timeoutSignal))
        .then((res) => {
          timeoutSignal.removeEventListener("abort", abortHandler);
          resolve(res);
        })
        .catch((err) => {
          timeoutSignal.removeEventListener("abort", abortHandler);
          reject(err);
        });
    });

    cleanup();

    // Boolean result: true = success, false = blocking error
    if (result) {
      return { outcome: "success", hook };
    }

    return {
      blockingError: {
        blockingError: hook.errorMessage,
        command: "function"
      },
      outcome: "blocking",
      hook
    };
  } catch (error) {
    cleanup();

    if (error instanceof Error &&
        (error.message === "Function hook cancelled" || error.name === "AbortError")) {
      return { outcome: "cancelled", hook };
    }

    AA(error instanceof Error ? error : Error(String(error)));
    return {
      message: l9({
        type: "hook_error_during_execution",
        hookName,
        toolUseID,
        hookEvent,
        content: error instanceof Error ? error.message : "Function hook execution error"
      }),
      outcome: "non_blocking_error",
      hook
    };
  }
}
```

**Function Hook Logic:**
- Receives `messages` array instead of hook input
- Returns boolean: `true` for success, `false` for blocking error
- Used exclusively in Stop hooks for message-based verification
- Abort signal passed to callback for cancellation support

### Callback Hook Execution

**From chunks.147.mjs:756-784:**
```javascript
// ============================================
// Qy3 - Execute callback hook
// Location: chunks.147.mjs:756
// ============================================
async function Qy3({
  toolUseID,
  hook,
  hookEvent,
  hookInput,
  signal,
  hookIndex
}) {
  // Execute callback with hook input
  let result = await hook.callback(hookInput, toolUseID, signal, hookIndex);

  // Check if result is async/empty response
  if (zYA(result)) {
    return { outcome: "success", hook };
  }

  // Process JSON result for special fields
  return {
    ...tX9({
      json: result,
      command: "callback",
      hookName: `${hookEvent}:Callback`,
      toolUseID,
      hookEvent,
      expectedHookEvent: hookEvent,
      stdout: undefined,
      stderr: undefined,
      exitCode: undefined
    }),
    outcome: "success",
    hook
  };
}
```

**Callback Hook Features:**
- Direct JavaScript function execution
- Returns JSON object with special fields
- Can modify permission behavior, add context, etc.
- No shell execution overhead

## Helper Functions

### `_V0()` - Get Matching Hooks

Retrieves hooks that match the event and query:

```typescript
function _V0(
  appState: AppState,
  hookEvent: HookEvent,
  hookInput: HookInput
): Hook[]
```

1. Loads hook configuration from settings
2. Filters by hook event type
3. Applies matcher logic
4. Returns array of hooks to execute

### `hE()` - Get Hook Command String

Returns display string for hook:

```typescript
function hE(hook: Hook): string {
  if (hook.type === "command") return hook.command;
  if (hook.type === "prompt") return "prompt";
  if (hook.type === "agent") return "agent";
  if (hook.type === "callback") return "callback";
  if (hook.type === "function") return "function";
}
```

### `tE()` - Create Session Context

Adds session context to hook input:

```typescript
function tE(
  appState?: AppState,
  agentContext?: AgentContext
): SessionContext {
  return {
    cwd: string,
    session_id: string,
    // ... other context
  };
}
```

### `SV0()` - Execute Shell Command

Low-level command execution:

```typescript
async function SV0(
  hook: CommandHook,
  hookEvent: string,
  hookName: string,
  jsonInput: string,
  signal: AbortSignal,
  hookIndex?: number
): Promise<{
  stdout: string,
  stderr: string,
  status: number,
  aborted: boolean
}>
```

---

## Event-Specific Execution Functions

Each hook event has a dedicated execution function:

### Tool Events
```typescript
// PreToolUse
async function* OV0(toolName, toolUseID, toolInput, context, appState, signal, timeout)

// PostToolUse
async function* RV0(toolName, toolUseID, toolInput, toolResponse, appState, context, signal, timeout)

// PostToolUseFailure
async function* TV0(toolName, toolUseID, toolInput, error, isInterrupt, appState, context, signal, timeout)
```

### Session Events
```typescript
// SessionStart
async function* WQ0(source, agentContext, signal, timeout)

// SubagentStart
async function* rX0(agentId, agentType, signal, timeout)

// Stop / SubagentStop
async function* PV0(appState, signal, timeout, stopHookActive, agentId?, context?, messages?)
```

### User Events
```typescript
// UserPromptSubmit
async function* k60(prompt, appState, toolUseContext)
```

### Notification Events
```typescript
// Notification
async function B60(notification, timeout)
```

### Compaction Events
```typescript
// PreCompact
async function FQ0(compactInput, signal, timeout): Promise<{
  newCustomInstructions?: string,
  notificationLogs?: string[]
}>
```

### Permission Events
```typescript
// PermissionRequest
async function* VQ0(permissionRequest, signal, timeout)
```

---

## StatusLine Execution

Special hook for status line display (separate from main hook system):

```typescript
async function cJ0(
  statusInput: StatusInput,
  signal?: AbortSignal,
  timeout: number = 5000
): Promise<string | undefined>
```

**Features:**
- Executed on every status line update
- Shorter default timeout (5 seconds)
- Returns string for display
- Respects `disableAllHooks` setting
- Command type only (no prompt/agent)

**Configuration:**
```json
{
  "statusLine": {
    "type": "command",
    "command": "git branch --show-current",
    "padding": 2
  }
}
```

---

## Best Practices

### 1. Use Appropriate Event Types

- **PreToolUse:** Validation before execution
- **PostToolUse:** Verification after success
- **PostToolUseFailure:** Error recovery
- **SessionStart:** One-time setup
- **Stop:** Cleanup on interruption

### 2. Handle Errors Gracefully

- Use non-blocking errors for warnings
- Use blocking errors only when execution must stop
- Provide helpful error messages

### 3. Optimize Performance

- Keep hooks fast (< 5 seconds when possible)
- Use matchers to reduce unnecessary executions
- Avoid heavy operations in frequently-triggered events

### 4. Use JSON Output for Control Flow

- Return decisions for approval/blocking
- Use `suppressOutput` for silent hooks
- Add context with `systemMessage` or `additionalContext`

### 5. Test Hook Behavior

- Test with various inputs
- Verify timeout handling
- Check error scenarios
- Ensure cleanup occurs

---

## Telemetry Events

Hook execution emits telemetry events:

```typescript
// Hook start
telemetry("tengu_run_hook", {
  hookName: string,
  numCommands: number
});

// Hook finish
telemetry("tengu_repl_hook_finished", {
  hookName: string,
  numCommands: number,
  numSuccess: number,
  numBlocking: number,
  numNonBlockingError: number,
  numCancelled: number
});
```

---

## Summary

Hook execution in Claude Code follows a well-defined flow:

1. **Check** if hooks are enabled and workspace is trusted
2. **Retrieve** matching hooks using matcher system
3. **Execute** hooks in parallel with timeout protection
4. **Process** JSON output for special fields and decisions
5. **Aggregate** results and track outcomes
6. **Yield** messages, errors, and context updates
7. **Emit** telemetry for monitoring

This system provides powerful customization while maintaining safety and performance.

---

## See Also

- [Hook Types](./types.md) - Hook type definitions and schemas
- [Settings Schema](../00_overview/settings_schema.md) - Full configuration reference
