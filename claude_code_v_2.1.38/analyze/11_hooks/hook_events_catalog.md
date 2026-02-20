# Hook Events Catalog

## Overview

Claude Code v2.1.38 supports 15 distinct hook events that allow users to execute custom shell commands, prompts, agent-based hooks, callback functions, or "function" hooks in response to specific lifecycle moments. Hooks are configured in the user's settings file and are executed by the central `executeHooksIterator` (`NI`) generator function.

Each hook event has a well-defined schema for its input payload, specific trigger conditions, and expected return value semantics (blocking, non-blocking, passthrough, etc.). This document catalogs every event with deep detail on when it fires, what data it provides, and what outcomes are possible.

The canonical list of hook event names is defined as the constant `ax` in `chunks.14.mjs:3569`:

```javascript
ax = ["PreToolUse", "PostToolUse", "PostToolUseFailure", "Notification",
      "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop",
      "SubagentStart", "SubagentStop", "PreCompact", "PermissionRequest",
      "Setup", "TeammateIdle", "TaskCompleted"]
```

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `executeHooksIterator` (NI) - Central generator that executes all matched hooks for an event
- `executePreToolHooks` (qyA) - Wrapper for PreToolUse event
- `executePostToolHooks` (KyA) - Wrapper for PostToolUse event
- `executePostToolUseFailureHooks` (YyA) - Wrapper for PostToolUseFailure event
- `executeNotificationHooks` (UTA) - Wrapper for Notification event
- `executeStopHooks` (zyA) - Wrapper for Stop/SubagentStop events
- `executeUserPromptSubmitHooks` (HyA) - Wrapper for UserPromptSubmit event
- `executeSessionStartHooks` ($yA) - Wrapper for SessionStart event
- `executeSubagentStartHooks` (AEA) - Wrapper for SubagentStart event
- `executePreCompactHooks` (mW6) - Wrapper for PreCompact event
- `executeTeammateIdleHooks` (wyA) - Wrapper for TeammateIdle event
- `executeTaskCompletedHooks` (Cg1) - Wrapper for TaskCompleted event (note: same obfuscated name as `verifyTaskCompletion` in task system, different function)
- `executeSetupHooks` (OyA) - Wrapper for Setup event
- `executeCommandHook` (BW6) - Low-level shell command execution for hooks
- `executeAgentHook` (Xi4) - Executes agent-type hooks
- `HOOK_EVENT_NAMES` (tGY / ax) - Canonical list of all event names
- `DEFAULT_HOOK_TIMEOUT` (MP) - Default timeout: **600,000ms (10 minutes)** — set in `chunks.142.mjs:215`

---

## Hook Execution Architecture

### Common Base Payload

Every hook event receives a base payload defined by the `gZ` schema:

```json
{
  "session_id": "<current session UUID>",
  "transcript_path": "<path to session transcript>",
  "cwd": "<current working directory>",
  "permission_mode": "<current permission mode (optional)>"
}
```

This base is constructed by `aX()` and merged with event-specific fields.

### Hook Types

Hooks can be of several types, each with different execution semantics:

| Type | Execution | Can Block? | Description |
|------|-----------|------------|-------------|
| `command` | Shell command via `BW6` | Yes (exit code 2) | Runs a shell command, passes hook input as JSON via stdin |
| `prompt` | LLM prompt via `Pn7` | No (yes/no only) | Sends a prompt to the LLM; returns `{"ok": true/false}`. Requires ToolUseContext. |
| `agent` | Agent invocation via `Xi4` | Yes (`ok: false`) | Runs a full agent loop with tools to verify a condition. Can block if condition not met. |
| `callback` | In-process function via `DhY` | Via JSON return | Direct JS async callback (used by plugins). Can return structured JSON like command hooks. |
| `function` | REPL-only function via `XhY` | Yes (false return) | Executes within the REPL context with access to conversation messages. Stop hooks only. |

### Exit Code Semantics (for `command` type)

| Exit Code | Meaning | Effect |
|-----------|---------|--------|
| 0 | Success | Hook output passed through (non-blocking) |
| 2 | Blocking error | Operation is blocked; stderr message shown to user/model |
| Other | Non-blocking error | Error logged, execution continues |

### JSON Response Schema

Command hooks can return structured JSON on stdout. The `LZY` schema (`HookOutputSchema` / `zJ6`) in `chunks.129.mjs:834` defines:

```json
{
  "continue": false,        // Optional: if false, set preventContinuation=true with optional stopReason
  "suppressOutput": false,  // Optional: suppress hook output in UI (only applies when JSON response)
  "stopReason": "...",      // Optional: reason string when continue=false
  "decision": "approve",    // Optional: legacy field. "approve"→allow, "block"→deny with reason
  "systemMessage": "...",   // Optional: text injected as system message into conversation
  "reason": "...",          // Optional: human-readable reason for blocking decisions
  "hookSpecificOutput": {}  // Optional: event-specific structured response (see below)
}
```

The `hookSpecificOutput` varies per event and can control permission decisions, inject context, modify tool inputs, and more. The `hookEventName` field within `hookSpecificOutput` must match the current event.

#### `hookSpecificOutput` by Event

| Event | Schema Name | Available Fields |
|-------|------------|-----------------|
| `PreToolUse` | `GZY` | `permissionDecision` (allow/deny/ask), `permissionDecisionReason`, `updatedInput`, `additionalContext` |
| `PostToolUse` | `TZY` | `additionalContext`, `updatedMCPToolOutput` |
| `PostToolUseFailure` | `vZY` | `additionalContext` |
| `UserPromptSubmit` | `ZZY` | `additionalContext` |
| `SessionStart` | `fZY` | `additionalContext` |
| `Setup` | `VZY` | `additionalContext` |
| `SubagentStart` | `NZY` | `additionalContext` |
| `Notification` | `EZY` | `additionalContext` |
| `PermissionRequest` | `kZY` | `decision` (behavior: "allow"/"deny", updatedInput?, updatedPermissions?, message?, interrupt?) |

#### Async Response Schema

Hooks can opt into async execution by returning `WZY`:
```json
{ "async": true, "asyncTimeout": 15000 }
```
This is detected by `SK1(isAsyncHookResponse)` in `chunks.90.mjs:1624`.

---

## Event Catalog

### 1. PreToolUse

**When it triggers:** Before any tool is executed, after the model has requested a tool call but before the tool's `call()` method runs.

**Match query:** The tool name (e.g., `PreToolUse:Bash`, `PreToolUse:FileWrite`), allowing hooks to target specific tools.

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "PreToolUse",
  "tool_name": "<tool name>",
  "tool_input": { /* tool input parameters */ },
  "tool_use_id": "<unique tool use ID>"
}
```

**Return value effects:**
- `permissionDecision: "allow"` - Auto-approve the tool execution
- `permissionDecision: "deny"` - Deny the tool execution with a message
- `permissionDecision: "ask"` - Defer to normal permission flow
- `updatedInput: { ... }` - Replace the tool's input parameters (only when `allow` or `ask`)
- `additionalContext: "..."` - Inject context into the conversation for the model to see

**Example use cases:**
- Linting code before writes: A `PreToolUse:FileWrite` hook runs a linter on the proposed content
- Blocking dangerous commands: A `PreToolUse:Bash` hook checks command patterns and blocks `rm -rf /`
- Input transformation: Rewrite file paths or command arguments before execution

**Implementation:**
```javascript
// ============================================
// executePreToolHooks - PreToolUse event dispatcher
// Location: chunks.141.mjs:2812-2829 (Ln 359877)
// ============================================

// READABLE (for understanding):
async function* executePreToolHooks(toolName, toolUseId, toolInput, toolUseContext, signal, messages, timeoutMs = DEFAULT_HOOK_TIMEOUT) {
    let hookInput = {
        ...buildBasePayload(toolUseContext),
        hook_event_name: "PreToolUse",
        tool_name: toolName,
        tool_input: toolInput,
        tool_use_id: toolUseId
    };
    yield* executeHooksIterator({
        hookInput, toolUseID: toolUseId, matchQuery: toolName,
        signal, timeoutMs, toolUseContext
    });
}
```

---

### 2. PostToolUse

**When it triggers:** After a tool has executed successfully and returned its result.

**Match query:** The tool name.

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "PostToolUse",
  "tool_name": "<tool name>",
  "tool_input": { /* original tool input */ },
  "tool_response": { /* tool result */ },
  "tool_use_id": "<unique tool use ID>"
}
```

**Return value effects:**
- `additionalContext: "..."` - Inject additional context for the model
- `updatedMCPToolOutput: ...` - Replace the MCP tool output with modified content

**Example use cases:**
- Post-write validation: After `FileWrite`, run tests and report results
- Auto-formatting: After code edits, run a formatter
- Audit logging: Record all tool executions to an external system

---

### 3. PostToolUseFailure

**When it triggers:** After a tool execution fails (throws an error or is interrupted).

**Match query:** The tool name.

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "PostToolUseFailure",
  "tool_name": "<tool name>",
  "tool_input": { /* original tool input */ },
  "tool_use_id": "<unique tool use ID>",
  "error": "<error message string>",
  "is_interrupt": false  // true if the failure was due to user interrupt
}
```

**Return value effects:**
- `additionalContext: "..."` - Provide debugging hints to the model

**Example use cases:**
- Error diagnostics: When a build command fails, automatically gather relevant log files
- Auto-retry preparation: Analyze the error and suggest corrections

---

### 4. Notification

**When it triggers:** When the system generates a notification to the user (e.g., task completion, background agent results).

**Match query:** The notification type string.

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "Notification",
  "message": "<notification message>",
  "title": "<notification title (optional)>",
  "notification_type": "<type string>"
}
```

**Return value effects:** Minimal - primarily for side effects (e.g., playing a sound, sending a Slack message).

**Example use cases:**
- Desktop notifications: Trigger system notifications when tasks complete
- Chat integration: Forward notifications to Slack or Discord
- Sound alerts: Play a sound when the model finishes a long task

**Implementation note:** Unlike other hooks, Notification hooks use `executeHooksOutsideREPL` (`AyA`) which runs all hooks in parallel and collects results, rather than yielding them one by one through the generator.

---

### 5. UserPromptSubmit

**When it triggers:** When the user submits a prompt (presses Enter in the REPL), before the prompt is sent to the LLM.

**Match query:** None (no sub-matching).

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "UserPromptSubmit",
  "prompt": "<the user's input text>"
}
```

**Return value effects:**
- Blocking error: Prevents the prompt from being submitted; the error message is shown as `<user-prompt-submit-hook>` feedback
- `additionalContext: "..."` - Inject context that the model will see alongside the user's prompt

**Example use cases:**
- Input validation: Block prompts that contain sensitive information
- Context injection: Automatically add project-specific context based on the prompt content
- Prompt logging: Record all user prompts for audit purposes

---

### 6. SessionStart

**When it triggers:** At the beginning of a session. Specifically fires on four occasions:
- `source: "startup"` - Fresh session start
- `source: "resume"` - Resuming a previous session
- `source: "clear"` - After `/clear` command
- `source: "compact"` - After compaction completes (new context window)

**Match query:** The source string (e.g., `SessionStart:startup`).

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "SessionStart",
  "source": "startup|resume|clear|compact",
  "agent_type": "<agent type (optional)>",
  "model": "<model name (optional)>"
}
```

**Return value effects:**
- `additionalContext: "..."` - Inject context at the start of the session (e.g., project status, recent git changes)

**Example use cases:**
- Environment setup: Run setup scripts when a session starts
- Context preloading: Automatically provide recent git log or project status
- Team notifications: Notify teammates when a session begins

---

### 7. SessionEnd

**When it triggers:** When a session ends for any reason.

**Match query:** None.

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "SessionEnd",
  "reason": "clear|logout|prompt_input_exit|other|bypass_permissions_disabled"
}
```

**Return value effects:** Minimal - primarily for cleanup side effects.

**Example use cases:**
- Cleanup: Remove temporary files created during the session
- Reporting: Generate a session summary report
- State persistence: Save session state to external storage

---

### 8. Stop

**When it triggers:** When the main agent (not a subagent) reaches a natural stop point - the model has finished its response and is not requesting any more tool calls.

**Match query:** None.

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "Stop",
  "stop_hook_active": false  // true if this is a re-invocation after a previous Stop hook
}
```

**Return value effects:**
- Blocking error with `blockingError`: The error message is injected back into the conversation as feedback, causing the model to continue working. This is the key mechanism for "keep going" hooks.
- `preventContinuation: true` with `stopReason`: Prevents the model from continuing even if other logic would cause it to.

**Example use cases:**
- Verification gates: Run tests after the model claims to be done; if tests fail, feed the failure back to force continued work
- Quality checks: Verify that all requested changes were actually made
- Auto-commit: Automatically create a git commit when the model finishes

**Key insight:** The `stop_hook_active` flag prevents infinite loops. When a Stop hook causes the model to continue, the next Stop event will have `stop_hook_active: true`, signaling to hooks that they are in a re-check phase.

---

### 9. SubagentStart

**When it triggers:** When a subagent (spawned via the Task tool) begins execution.

**Match query:** The agent type string (e.g., `SubagentStart:code`).

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "SubagentStart",
  "agent_id": "<agent UUID>",
  "agent_type": "<agent type string>"
}
```

**Return value effects:**
- `additionalContext: "..."` - Inject context into the subagent's initial messages

**Example use cases:**
- Subagent configuration: Provide project-specific context to each subagent
- Logging: Track which subagents are spawned and when

---

### 10. SubagentStop

**When it triggers:** When a subagent finishes execution (natural completion, not kill).

**Match query:** None.

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "SubagentStop",
  "stop_hook_active": false,
  "agent_id": "<agent UUID>",
  "agent_transcript_path": "<path to agent transcript file>",
  "agent_type": "<agent type string>"
}
```

**Return value effects:** Same as Stop - blocking errors cause the subagent to continue working.

**Example use cases:**
- Result validation: Verify subagent output before accepting it
- Cross-agent coordination: Notify other agents when one completes

---

### 11. PreCompact

**When it triggers:** Just before conversation compaction begins, both for auto-compact and manual "Summarize from here".

**Match query:** The trigger type: `PreCompact:manual` or `PreCompact:auto`.

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "PreCompact",
  "trigger": "manual|auto",
  "custom_instructions": "<string or null>"
}
```

**Return value effects:**
- Successful hook output (non-empty stdout) is collected and merged into `newCustomInstructions`, which gets prepended to the compaction prompt. This allows hooks to inject information that should be preserved across compaction.

**Implementation:**
```javascript
// ============================================
// executePreCompactHooks - PreCompact event dispatcher
// Location: chunks.141.mjs:3011-3039 (Ln 360065)
// ============================================

// READABLE (for understanding):
async function executePreCompactHooks(hookConfig, signal, timeoutMs = DEFAULT_HOOK_TIMEOUT) {
    let hookInput = {
        ...buildBasePayload(undefined),
        hook_event_name: "PreCompact",
        trigger: hookConfig.trigger,
        custom_instructions: hookConfig.customInstructions
    };
    let results = await executeHooksOutsideREPL({ hookInput, matchQuery: hookConfig.trigger, signal, timeoutMs });
    if (results.length === 0) return {};

    // Collect successful outputs as custom instructions
    let customInstructions = results.filter(r => r.succeeded && r.output.trim().length > 0).map(r => r.output.trim());
    return {
        newCustomInstructions: customInstructions.length > 0 ? customInstructions.join("\n\n") : undefined,
        userDisplayMessage: /* formatted status messages */
    };
}
```

**Example use cases:**
- Context preservation: Output critical state that must survive compaction
- Summary augmentation: Add project-specific context to the compaction summary

---

### 12. PermissionRequest

**When it triggers:** When a tool execution requires a permission decision (the tool's `checkPermissions` returns `"ask"`).

**Match query:** None.

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "PermissionRequest",
  "tool_name": "<tool name>",
  "tool_input": { /* tool input parameters */ },
  "permission_suggestions": [ /* suggested permission rules */ ]
}
```

**Return value effects:**
- `decision.behavior: "allow"` - Auto-approve with optional `updatedInput` and `updatedPermissions`
- `decision.behavior: "deny"` - Deny with optional message and interrupt flag

**Example use cases:**
- Policy enforcement: Automatically approve/deny based on organizational policies
- Custom permission UI: Integrate with an external approval system

---

### 13. Setup

**When it triggers:** During initial setup or maintenance cycles.

**Match query:** The trigger type: `Setup:init` or `Setup:maintenance`.

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "Setup",
  "trigger": "init|maintenance"
}
```

**Return value effects:**
- `additionalContext: "..."` - Inject context for the session

**Example use cases:**
- Environment validation: Check that required tools are installed
- Dependency updates: Verify project dependencies are up to date
- Configuration sync: Pull latest team configuration

---

### 14. TeammateIdle

**When it triggers:** When a teammate in a swarm/team becomes idle (finishes its current task and has nothing queued).

**Match query:** None.

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "TeammateIdle",
  "teammate_name": "<name of the idle teammate>",
  "team_name": "<team name>"
}
```

**Return value effects:**
- Blocking error feedback is formatted as `TeammateIdle hook feedback: <message>` and sent back to the model.

**Example use cases:**
- Work assignment: Automatically assign the next available task to the idle teammate
- Team coordination: Notify the team lead that a teammate is available

---

### 15. TaskCompleted

**When it triggers:** When a task's status is changed to `"completed"` via `TaskUpdate`. This fires before the status change is persisted.

**Match query:** None.

**Payload:**
```json
{
  ...basePayload,
  "hook_event_name": "TaskCompleted",
  "task_id": "<task ID>",
  "task_subject": "<task subject line>",
  "task_description": "<task description (optional)>",
  "teammate_name": "<completing teammate name (optional)>",
  "team_name": "<team name (optional)>"
}
```

**Return value effects:**
- Blocking error: Prevents the task from being marked as completed. The error message is returned as the `TaskUpdate` error, causing the model to address the feedback before re-attempting completion.

**Example use cases:**
- Completion verification: Run tests or checks before allowing a task to be marked done
- Quality gates: Ensure code review or documentation requirements are met
- Auto-merge: Trigger CI/CD pipelines upon task completion

**Key insight:** This is the only hook that can prevent a state transition. By returning a blocking error, the hook effectively vetoes the completion, keeping the task in its current state.

---

## Hook Resolution and Matching

### How Hooks Are Matched to Events

The function `oRA` (not shown in full) resolves which hooks apply for a given event:

1. **Load all registered hooks** from settings (user, project, local), plugins, and policy settings
2. **Filter by event name:** Only hooks registered for the current `hook_event_name`
3. **Filter by match query:** If the hook specifies a tool name pattern (e.g., `PreToolUse:Bash`), only match when the query matches
4. **Merge sources:** Hooks from different sources (settings, plugins, managed policies) are merged, with managed-only mode filtering when active

### Execution Order and Concurrency

**All hooks for a single event run concurrently**, not sequentially. The `_J6(mergeAsyncGenerators)` function in `chunks.90.mjs:1950` starts all hook generators simultaneously and yields results in completion order (first-completed, first-yielded).

The permission aggregation follows a "most restrictive wins" hierarchy, accumulated as results arrive:

```
deny > ask > allow > passthrough(undefined)

- "deny"  → always overrides (immutable once set)
- "ask"   → overrides "allow" and undefined
- "allow" → set only if currently undefined
- undefined → passthrough (no change to permission flow)
```

**Hook type ordering within resolved list:** `command → prompt → agent → callback → function`

All hooks start at the same time regardless of type ordering.

### Two Execution Paths

Events use one of two execution strategies:

| Path | Function | Used By | Returns |
|------|---------|---------|---------|
| **Streaming (REPL)** | `NI` (executeHooksIterator) | PreToolUse, PostToolUse, PostToolUseFailure, Stop, SubagentStop, UserPromptSubmit, SessionStart, SubagentStart, TeammateIdle, TaskCompleted, Setup | `AsyncGenerator` (yields messages live) |
| **Parallel (non-REPL)** | `AyA` (executeHooksOutsideREPL) | Notification, PreCompact, SessionEnd, PermissionRequest | `Promise<Array>` (all results at once) |

The parallel path only supports `command` and `callback` hook types — `prompt`, `agent`, and `function` hooks are not supported outside the REPL context.

### Guards Applied Before Execution

Both `NI` and `AyA` check the same two guards before doing anything:

1. **`disableAllHooks` setting** (`C8().disableAllHooks`): Global kill switch in settings. If set, silently skip all hooks.
2. **Workspace trust** (`Pi4()`): If the workspace trust has not been accepted (`$H(!1)` returns false), skip all hooks. This prevents malicious project-level hooks from running in untrusted directories.
