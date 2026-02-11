# Implementation Report - Hook System (Module 11)

## Overview

The Hook System is an event-driven framework that allows the extension of Claude Code's core loop. It supports intercepting tool usage, responding to session events, and even using AI-based logic to decide when to stop an agent's execution. Hooks can be synchronous (blocking) or asynchronous (backgrounded).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `executeHooksIterator` (NI) - Core generator for iterating and executing matched hooks
- `executeCommandHook` (BW6) - Executes a shell command-based hook
- `executeAgentHook` (found in chunks.141.mjs) - Uses an LLM to evaluate a hook condition
- `executePreToolHooks` (qyA) - Specifically handles the `PreToolUse` event lifecycle
- `executePreCompactHooks` (mW6) - Handles the `PreCompact` event, allowing custom instruction injection

## Lifecycle Events

The system supports 15 distinct lifecycle hooks:
1.  **PreToolUse**: Before a tool is called (can block or modify input).
2.  **PostToolUse**: After a tool completes successfully.
3.  **PostToolUseFailure**: After a tool fails.
4.  **Notification**: Triggered by system notifications.
5.  **UserPromptSubmit**: When the user sends a message.
6.  **SessionStart / SessionEnd**: Session lifecycle boundaries.
7.  **Stop**: Global agent stop condition check.
8.  **SubagentStart / SubagentStop**: Sub-agent lifecycle.
9.  **PreCompact**: Before context compaction starts.
10. **PermissionRequest**: When a tool requires user approval.
11. **Setup**: Application initialization.
12. **TeammateIdle**: When a swarm teammate is waiting.
13. **TaskCompleted**: When a task in the Task System reaches 'completed'.

## Core Algorithms

### 1. Hook Execution and Dispatch (`NI` / `executeHooksIterator`)

The system uses a generator-based approach to execute hooks. This allows for streaming results back to the UI and handling interruptions gracefully.

**Execution Flow:**
1.  Identify all registered hooks matching the event name.
2.  Filter hooks based on "matchers" (e.g., a `PreToolUse` hook might only trigger for `BashTool`).
3.  Execute each hook sequentially (or in parallel depending on the event type).
4.  If a hook returns a JSON response, it is parsed and validated against the `HookOutput` schema.

### 2. Async Hook Management (`BW6` / `executeCommandHook`)

Hooks can run in the background to avoid blocking the main agent loop.

====
// executeCommandHook - Logic for backgrounding async hooks
// Location: chunks.141.mjs:1951-1988
====

// ORIGINAL (for source lookup):
if (h(`Hooks: Config-based async hook, backgrounding process ${p}`), P.stdin.write(Y, "utf8"), P.stdin.end(), f = !0, ji4({
    command: j.command,
    process: P,
    hookEvent: H,
    agentId: w
}), Z = { succeeded: !0, stdout: "", stderr: "", status: 0 }, k = !0, h(`Hooks: Checking initial response for async: ${Z.trim()}`), l = Ci4(Z)) {
    if (h(`Hooks: Parsed initial response: ${Q1(l)}`), SK1(l) && !_) {
        if (h(`Hooks: Detected async hook, backgrounding process ${r}`), ji4({
            command: j.command,
            process: r,
            hookEvent: H,
            agentId: w
        }), f = !0, Z = { succeeded: !0, stdout: "", stderr: "", status: 0 }, k = !0, !X.isVisibleInTranscriptOnly) q.addNotification?.({
            key: `async-hook-${p}`,
            text: `Started background task: ${j.command}`,
            priority: "low"
        });
    }
}

// READABLE (for understanding):
async function executeCommandHook(hook, eventName, agentId, inputJson) {
    let process = spawn(hook.command, { shell: true });
    
    // Write event context to hook's stdin
    process.stdin.write(JSON.stringify(inputJson));
    process.stdin.end();

    if (hook.isAsync) {
        log(`Hooks: Detected async hook, backgrounding process ${process.pid}`);
        // Add to background task registry
        registerBackgroundTask({
            command: hook.command,
            process: process,
            event: eventName,
            agentId: agentId
        });
        
        notifyUser(`Started background task: ${hook.command}`);
        return { succeeded: true, output: "" };
    }

    // Otherwise, wait for completion (Sync mode)
    return await waitForProcess(process);
}

// Mapping: BW6→executeCommandHook, ji4→registerBackgroundTask, P/r→process, j→hook, H→eventName, w→agentId

### 3. AI-Based Stop Hooks (`executeAgentHook`)

This is a unique feature where an LLM is used to evaluate if an agent should stop. It's often used for tasks like "Stop when the bug is fixed". The system queries a specialized sub-agent with the current transcript and a "Stop Condition" prompt. If the sub-agent returns a "success" outcome, the main loop is terminated.

## Key Insight

The Hook System transforms Claude Code from a linear agent into an **Event-Driven Orchestrator**. By allowing hooks to modify tool inputs (`updatedInput`) and block execution (`behavior: deny`), the system enables complex safety guardrails and workflow automations (like auto-committing after a successful test run) without hard-coding them into the core agent loop.
