# Skill Subsystem: Hook Mechanism

## Overview

The Hook Mechanism allows Skills to extend the agent's behavior by intercepting and reacting to lifecycle events. Hooks are registered per-session and can be triggered by events such as tool usage, session start/end, and subagent activities.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `NI` (chunks.141.mjs) - **executeHooksIterator**: Main generator for executing hooks.
- `IM6` (chunks.130.mjs) - **registerSkillHooks**: Registers hooks from a skill definition.
- `ax` (chunks.14.mjs) - **HOOK_EVENTS**: List of supported hook events.
- `Xi4` (chunks.141.mjs) - **executeAgentHook**: Executes an "agent" type hook (subagent).
- `BW6` (chunks.141.mjs) - **executeCommandHook**: Executes a "command" type hook (shell).
- `Pn7` (chunks.90.mjs) - **executePromptHook**: Executes a "prompt" type hook.

## Architecture

The Hook System consists of three main components:
1.  **Registry**: Stores hooks in the application state (`appState.sessionHooks`).
2.  **Events**: A predefined set of lifecycle points where hooks can be triggered.
3.  **Executor**: A mechanism to match events to hooks and execute them (sequentially or in parallel).

### Event Types (`ax`)

Location: `chunks.14.mjs:3572`

| Event Name | Description |
|------------|-------------|
| `PreToolUse` | Triggered before a tool is executed. Can validate or modify input. |
| `PostToolUse` | Triggered after a tool execution completes successfully. |
| `PostToolUseFailure` | Triggered if a tool execution fails. |
| `Notification` | Triggered when a notification is received. |
| `UserPromptSubmit` | Triggered when the user submits a prompt. |
| `SessionStart` | Triggered when a new session begins. |
| `SessionEnd` | Triggered when a session ends. |
| `Stop` | Triggered when the agent is stopped. |
| `SubagentStart` | Triggered when a subagent is spawned. |
| `SubagentStop` | Triggered when a subagent finishes. |
| `PreCompact` | Triggered before memory compaction. |
| `PermissionRequest` | Triggered when a permission is requested. |
| `Setup` | Triggered during initialization. |
| `TeammateIdle` | Triggered when a teammate (subagent) is idle. |
| `TaskCompleted` | Triggered when a task is marked as completed. |

## Implementation Details

### Hook Registration (`IM6`)

Hooks are registered via the `Skill` tool (or internally). The registration logic iterates through the provided hook definitions and adds them to the session state.

```javascript
// ============================================
// registerSkillHooks - Registers hooks for a session
// Location: chunks.130.mjs:1361
// ============================================

// ORIGINAL (for source lookup):
// (Logic typically found in IM6 function)

// READABLE (for understanding):
function registerSkillHooks(setAppState, sessionId, hooks, skillName, skillRoot) {
    const eventTypes = HOOK_EVENTS; // ax
    
    for (const event of eventTypes) {
        const hookConfigs = hooks[event];
        if (!hookConfigs) continue;
        
        for (const config of hookConfigs) {
            addSessionHook(
                setAppState, 
                sessionId, 
                event, 
                config.matcher, 
                config.hook, 
                config.onSuccess, 
                skillRoot
            );
        }
    }
}
```

### Hook Execution (`NI`)

The `executeHooksIterator` (`NI`) function is responsible for running hooks when an event occurs. It handles different hook types and ensures proper context (e.g., passing tool inputs, handling timeouts).

```javascript
// ============================================
// executeHooksIterator - Main Hook Execution Generator
// Location: chunks.141.mjs:2226
// ============================================

// ORIGINAL (for source lookup):
async function* NI({ hookInput: A, toolUseID: q, matchQuery: K, signal: Y, timeoutMs: z = MP, toolUseContext: w, messages: H, forceSyncExecution: $ }) { ... }

// READABLE (for understanding):
async function* executeHooksIterator({
    hookInput,
    toolUseID,
    matchQuery,
    signal,
    timeoutMs,
    toolUseContext,
    messages,
    forceSyncExecution
}) {
    if (globalConfig().disableAllHooks) return;

    const eventName = hookInput.hook_event_name;
    const hookName = matchQuery ? `${eventName}:${matchQuery}` : eventName;

    // 1. Retrieve matching hooks
    const hooksToRun = getMatchingHooks(appState, agentId, eventName, hookInput);
    if (hooksToRun.length === 0) return;

    // 2. Emit progress
    for (const { hook } of hooksToRun) {
        yield {
            message: { type: "progress", data: { type: "hook_progress", ... } }
        };
    }

    // 3. Execute hooks based on type
    const executions = hooksToRun.map(async function* ({ hook, pluginRoot }) {
        // Handle "callback" hooks
        if (hook.type === "callback") {
            yield executeCallbackHook({ ... });
            return;
        }
        
        // Handle "function" hooks
        if (hook.type === "function") {
            yield executeFunctionHook({ ... });
            return;
        }

        // Handle "prompt" hooks (User/LLM interaction)
        if (hook.type === "prompt") {
            yield await executePromptHook(hook, hookName, eventName, ...);
            return;
        }

        // Handle "agent" hooks (Subagents)
        if (hook.type === "agent") {
            yield await executeAgentHook(hook, hookName, eventName, ...);
            return;
        }

        // Handle "command" hooks (Shell scripts, etc.)
        // Default behavior for other types
        const result = await executeCommandHook(hook, eventName, hookName, ...);
        if (result.aborted) {
            yield { message: { type: "hook_cancelled", ... } };
        }
    });

    // Yield results from executions
    // ...
}
```

### Executor Types

1.  **Agent Hook (`Xi4`)**: Spawns a subagent to handle the hook. This is powerful for complex validations or side-effects that require reasoning.
2.  **Command Hook (`BW6`)**: Executes a shell command. Useful for integrating with external scripts or tools.
3.  **Prompt Hook (`Pn7`)**: Likely injects prompts into the context or requests user input.
4.  **Function/Callback (`XhY`, `DhY`)**: Internal JS execution for high-performance, low-overhead hooks.

## Usage Scenarios

*   **Security Policies**: A `PreToolUse` hook can check `Bash` commands against a deny-list before execution.
*   **Auditing**: A `PostToolUse` hook can log tool outputs to an external file or service.
*   **Workflow Automation**: `SessionStart` hooks can initialize the environment or load necessary context.
*   **Cleanup**: `SessionEnd` hooks can remove temporary files or close connections.
