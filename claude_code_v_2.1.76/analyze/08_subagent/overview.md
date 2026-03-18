# Overview - Subagent System (Claude Code 2.1.76)

## Overview

The subagent system enables parallel execution, task decomposition, and multi-agent collaboration. Parent agents spawn subagents via the `Task` tool, with three execution modes: synchronous, asynchronous, and teammate.

**v2.1.76 additions:**
- `isolation: worktree` declarative support in agent definitions
- Per-invocation `model` override in Task tool calls
- `background: true` agent definition flag
- Completion notifications include result file path
- Task creation no longer requires `activeForm` field

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `agentLoopRunner` (qh) - Core execution generator - chunks.133.mjs:1565
- `runWithAgentIdentity` (X66) - Identity binding - chunks.133.mjs:841
- `getCurrentAgentIdentity` (Tf6) - Get current agent identity - chunks.133.mjs:837
- `inProcessAgentRunner` (XNY) - In-process teammate runner - chunks.134.mjs:1571
- `pollForNextMessage` (DNY) - Poll loop for teammate messages - chunks.134.mjs:1483
- `resolveModelConfig` (C01) - Model resolution - chunks.133.mjs:1589

> **CORRECTION:** Previous documentation incorrectly mapped `p01` as `runWithAgentIdentity`.
> The actual `p01` (chunks.94.mjs:295) is `isSkillMdFile`. The correct symbol for
> `runWithAgentIdentity` is `X66` (chunks.133.mjs:841).

---

## Three Execution Modes

### 1. Synchronous

```
Parent: Task { description: "..." }
    → Creates foreground task
    → Blocks waiting for completion
    → Yields real-time progress events
    → Returns { status: "completed", content, tokens }
```

**When to use:** Results needed before parent can continue. Small, fast tasks.

### 2. Asynchronous

```
Parent: Task { description: "...", run_in_background: true }
    → Creates async task
    → Returns immediately { status: "async_launched", agentId, outputFile }
    → Subagent runs independently
    → Parent can poll outputFile for progress/results
```

**When to use:** Long-running tasks. Tasks that should not block the session.

### 3. Teammate

```
Parent: Task { name: "agent-type", team_name: "my-team", ... }
    → Dispatches via spawnTeammateDispatcher
    → Routes to appropriate backend (in-process, iTerm2, tmux)
    → Teammate runs with mailbox-based communication
    → Returns immediately
```

**When to use:** Parallel collaboration. Multi-agent workflows.

---

## Agent Lifecycle (6 Stages)

```
Stage 1: SPAWNING     - AgentTool.call() resolves agent definition
Stage 2: INITIALIZING - Tool assembly, context derivation, worktree setup (if needed)
Stage 3: STARTING     - SubagentStart hooks fire, system prompt built
Stage 4: RUNNING      - LLM loop executing, tool calls, progress updates
Stage 5: COMPLETING   - Final response generated, output written to file/stream
Stage 6: CLEANUP      - SubagentStop hooks, worktree teardown, task state updated
```

---

## Agent Definition Resolution

### Two-Level Permission Check

When resolving an agent definition by name:

1. **Level 1: Existence check** - Does an agent definition with this name exist in the built-in or user-defined registry?
2. **Level 2: Permission check** - Is the user permitted to use this agent type (based on `permissionMode` and settings)?

If either check fails, the Task tool returns an error before spawning.

---

## Model Resolution (Uq6)

### Cascading Priority (v2.1.76)

```
Priority 1: Per-invocation model (Task tool input.model)   ← NEW in v2.1.76
Priority 2: Agent definition model field
Priority 3: Session-level model configuration
Priority 4: System default model
```

The `resolveModelConfig` (Uq6) function handles string-to-model-config resolution, supporting aliases like "sonnet", "opus", "haiku".

---

## Fork Context

When `forkContext: true` is set on a skill or agent definition, the subagent receives a clean conversation context:
1. Three messages are prepended as context anchors (via `buildForkContextMessages`)
2. The subagent's system prompt replaces the parent's system prompt
3. The subagent does not see the parent's conversation history

**Why:** Prevents context pollution when the subagent's task is unrelated to the parent's ongoing conversation.

---

## Mid-Run Backgrounding

Foreground tasks can be transitioned to background execution without restarting:

```javascript
// Promise.race enables seamless transition
let result = await Promise.race([
    agentLoopPromise,   // Continue as foreground
    backgroundSignal    // Transition to background
]);

if (result.type === "background") {
    // Agent continues running, output redirected to file
    return { status: "async_launched", agentId, outputFile };
}
```

The agent loop is never cancelled - it continues running. Only the output routing changes.

---

## inProcessAgentRunner (XNY)

For teammate mode in non-interactive sessions (like API/SDK usage), the teammate runs in-process:

```javascript
// READABLE (for understanding):
async function inProcessAgentRunner(agentDefinition, toolUseContext, mailbox) {
    for await (let event of agentLoopRunner({ agentDefinition, toolUseContext, ... })) {
        // Process events
        // Write to mailbox if needed
    }
}
```

**Why in-process for non-interactive:** Split-pane and tmux backends require a terminal environment. The API/SDK does not have a terminal, so a single-process implementation is needed.

## pollForNextMessage (DNY)

For in-process teammates, `pollForNextMessage` implements a priority-ordered check:

```
Priority 1: User interrupt signal (highest priority)
Priority 2: New mailbox messages from orchestrator
Priority 3: Idle/waiting state
```

The poll interval starts short and increases with consecutive idle cycles (exponential backoff), reducing CPU usage during long waits.

---

## Related Modules

- **[agent_definitions.md](./agent_definitions.md)** - Built-in agents and merging logic
- **[execution_flow_deep_dive.md](./execution_flow_deep_dive.md)** - agentLoopRunner internals
- **[task_lifecycle_and_state.md](./task_lifecycle_and_state.md)** - Task state machine
- **[communication_and_coordination.md](./communication_and_coordination.md)** - Mailbox system
- **[tools_integration.md](./tools_integration.md)** - Tool assembly
