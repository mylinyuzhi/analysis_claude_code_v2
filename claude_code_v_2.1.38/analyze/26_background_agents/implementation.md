# Background Agents and Detached Tasks Analysis

## Module Overview

Claude Code v2.1.38 supports running sub-agents and shell commands in the background. This allows the user to continue interacting with the "Lead" agent while long-running tasks (like a test suite or a complex code search) execute asynchronously.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key symbols in this document:
- `run_in_background`: Parameter for `Task` and `Bash` tools.
- `background-task-output`: Marker for capturing async output.
- `backgroundTasks`: State key for tracking detached processes.

## Detached Sub-Agents

When using the `Task` tool, the agent can set `run_in_background: true`.

### Background Lifecycle (Algorithm)

**What it does:** Forks a sub-agent process and manages its lifecycle independently of the main conversation loop.

**How it works:**
1. **Validation**: Checks if the current agent is capable of backgrounding (in-process teammates cannot spawn background agents).
2. **Forking**: Spawns a new agent instance with a unique `taskId`.
3. **Redirection**: Redirects the sub-agent's stdout/stderr to a temporary output file.
4. **Monitoring**: Registers the task in the `backgroundTasks` registry.
5. **Completion**: When the sub-agent finishes, it sends a notification (`TaskCompleted` hook) back to the lead agent.

```javascript
// ============================================
// Task Tool Background Logic
// Location: chunks.132.mjs:134-382
// ============================================

// READABLE (for understanding):
async function callTaskTool(input, context) {
    if (input.run_in_background) {
        if (context.backendType === "in-process") {
            throw Error("In-process teammates cannot spawn background agents.");
        }

        const backgroundTaskId = generateId();
        const outputFile = getTempPath(`task-${backgroundTaskId}.log`);

        // Spawn detached process
        const subagentProcess = spawnAgent({
            ...input,
            outputFile,
            detached: true
        });

        // Track in state
        context.setAppState(s => ({
            ...s,
            backgroundTasks: {
                ...s.backgroundTasks,
                [backgroundTaskId]: {
                    status: "running",
                    outputFile
                }
            }
        }));

        return {
            content: "The agent is working in the background. You will be notified when it completes.",
            output_file: outputFile,
            task_id: backgroundTaskId
        };
    }
}
```

## Output Capture

Background tasks use a structured tagging system to report their progress back to the Lead.

- `<background-task-input>`: Logs the command or prompt that started the task.
- `<background-task-output>`: Captures the results or final status of the task.

## Background Shell Commands

The `Bash` tool also supports `run_in_background`. This is particularly useful for starting dev servers or running slow builds.

```javascript
// ============================================
// Bash Tool Background Logic
// Location: chunks.148.mjs:2495-2506
// ============================================

if (input.run_in_background) {
    const bashId = startBackgroundShell(input.command);
    return {
        message: "Command started in background",
        bash_id: bashId
    };
}
```

## Management Tools

- **`TaskGet` / `BashOutput`**: Used to poll or retrieve the current output of a background task.
- **`Stop`**: Used to kill a background process by its `task_id` or `bash_id`.

**Key insight:** The background system is designed for **eventual consistency**. The Lead agent doesn't wait for the result; it receives a "Task ID" and continues. Later, the system injects the task result into the prompt as a "System Reminder" or via a specialized tool result, allowing the Lead agent to "discover" that the work is done.
