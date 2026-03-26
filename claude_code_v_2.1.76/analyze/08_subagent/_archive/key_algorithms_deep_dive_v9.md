# Key Algorithms Deep Dive V9 (Claude Code 2.1.76)

> Deep analysis of critical algorithms in the subagent and background agent systems including task ID generation, tool filtering, abort signal propagation, mid-run backgrounding, and mailbox communication.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](./cross_validation_unified_v3.md) - Unified symbol verification

---

## Algorithm 1: Task ID Generation (oV)

### What it does

Generates a unique 9-character task ID with a type prefix for collision-free identification.

### How it works

```
Step 1: Get task type prefix (e.g., "a" for agent)
Step 2: Generate 8 cryptographically random bytes
Step 3: Map each byte to a character from charset
Step 4: Concatenate prefix + suffix
```

### Source Code

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID
// Location: chunks.41.mjs:2410-2416
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = k$3(A),
        K = N$3(8);
    for (let z = 0; z < 8; z++) Y += G97[K[z] % G97.length];
    return Y
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Step 1: Get type prefix
    let typeName = getTaskTypePrefix(taskType);
    let prefix = TASK_TYPE_PREFIXES[typeName] ?? "x";

    // Step 2: Generate 8 random bytes using crypto
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));

    // Step 3: Convert bytes to characters
    // charset = "0123456789abcdefghijklmnopqrstuvwxyz"
    let suffix = "";
    for (let i = 0; i < 8; i++) {
        suffix += TASK_ID_CHARSET[randomBytes[i] % TASK_ID_CHARSET.length];
    }

    // Step 4: Return prefix + suffix (9 chars total)
    return prefix + suffix;
}

// Mapping: oV→generateTaskId, A→taskType, q→typeName, K→randomBytes, Y→result, V$3→TASK_TYPE_PREFIXES, G97→TASK_ID_CHARSET, N$3→crypto.getRandomValues
```

### Why this approach

| Design Choice | Rationale |
|---------------|-----------|
| Type prefix | Visual identification of task type in logs and UI |
| 8 random chars | 36^8 = ~2.8 trillion combinations, collision improbable |
| Crypto random | Unpredictable, cannot be guessed |
| Modulo mapping | Efficient charset conversion without bias |

### Key insight

The type prefix serves as a visual debugging aid - `a7x9k2m3` is immediately recognizable as an agent task, `b8p1n4q5` as a bash task. This helps in logs, output files, and debugging.

---

## Algorithm 2: Tool Filtering for Subagents (Xk8)

### What it does

Determines which tools a subagent can access based on agent type, execution mode, and permission context.

### How it works

```
Step 1: Allow all MCP tools (mcp__*)
Step 2: Check ExitPlanMode exception for plan mode
Step 3: Block tools in BACKGROUND_AGENT_EXCLUDED_TOOLS
Step 4: Block built-in excluded tools for non-built-in agents
Step 5: If async mode, only allow ASYNC_AGENT_ALLOWED_TOOLS
Step 6: Exception: Teammates get Agent + TEAM_DELEGATE_TOOLS
```

### Decision Tree

```
For each tool T:
├── T.name starts with "mcp__"?
│   └── YES → ALLOW
│   └── NO → Continue
├── T.name == "ExitPlanMode" AND mode == "plan"?
│   └── YES → ALLOW
│   └── NO → Continue
├── T.name in BACKGROUND_AGENT_EXCLUDED_TOOLS?
│   └── YES → DENY
│   └── NO → Continue
├── Not built-in AND T.name in BUILTIN_EXCLUDED_TOOLS?
│   └── YES → DENY
│   └── NO → Continue
├── isAsync?
│   └── NO → ALLOW
│   └── YES → Continue
    ├── T.name in ASYNC_AGENT_ALLOWED_TOOLS?
    │   └── YES → ALLOW
    │   └── NO → Continue
    ├── Is teammate (AgentTeams + InProcess)?
    │   └── NO → DENY
    │   └── YES → Continue
        ├── T.name == "Agent" OR T.name in TEAM_DELEGATE_TOOLS?
        │   └── YES → ALLOW
        │   └── NO → DENY
```

### Key insight

The filtering prevents background agents from doing anything that would block or require user interaction, while allowing teammates special delegation capabilities. The key security principle is **least privilege** - background agents get minimal tools, teammates get delegation tools.

---

## Algorithm 3: Abort Signal Propagation (x66)

### What it does

Gracefully terminates a running task with proper cleanup and partial result preservation.

### How it works

```
Step 1: Check if task is running
Step 2: Abort the AbortController (cancels LLM stream)
Step 3: Unregister cleanup handler (prevent double cleanup)
Step 4: Set status to "killed"
Step 5: Keep last message (for debugging)
Step 6: Clear sensitive references
Step 7: Flush output buffer (preserve partial results)
```

### Source Code

```javascript
// ============================================
// x66 - triggerAbortSignal - Trigger abort signal for task
// Location: chunks.146.mjs:2012-2027
// ============================================

// ORIGINAL (for source lookup):
function x66(A, q) {
    let K = !1;
    if (i9(A, q, (Y) => {
            if (Y.status !== "running") return Y;
            return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
                ...Y,
                status: "killed",
                endTime: Date.now(),
                messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                selectedAgent: void 0
            }
        }), K) $O(A);
    return K
}

// READABLE (for understanding):
function triggerAbortSignal(taskId, setAppState) {
    let wasKilled = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only kill running tasks
        if (task.status !== "running") return task;

        wasKilled = true;

        // Step 1: Abort the abort controller
        // This cancels the LLM API stream
        task.abortController?.abort();

        // Step 2: Unregister cleanup handler
        // Prevents double cleanup on exit
        task.unregisterCleanup?.();

        // Step 3: Return killed state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message for debugging
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer
    // Preserves partial results for debugging
    if (wasKilled) {
        flushOutputBuffer(taskId);
    }

    return wasKilled;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasKilled, Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
```

### Key insight

The abort mechanism is carefully designed to:
1. **Cancel immediately** - AbortController stops LLM stream
2. **Prevent double cleanup** - Unregister before state change
3. **Preserve results** - Flush output buffer after kill
4. **Keep evidence** - Last message retained for debugging

---

## Algorithm 4: Progress Tracking with Telemetry (nl4)

### What it does

Updates task progress and sends telemetry events for monitoring.

### How it works

```
Step 1: Atomically update task progress
Step 2: Capture telemetry data from old progress
Step 3: If telemetry enabled, send progress event
Step 4: Include token count, tool uses, duration
```

### Source Code

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry
// Location: chunks.146.mjs:2059-2098
// ============================================

// READABLE (for understanding):
function updateTaskProgressWithTelemetry(taskId, summary, setAppState) {
    let telemetryData = null;

    // Step 1: Atomically update progress
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Capture data for telemetry BEFORE update
        telemetryData = {
            tokenCount: task.progress?.tokenCount ?? 0,
            toolUseCount: task.progress?.toolUseCount ?? 0,
            startTime: task.startTime,
            toolUseId: task.toolUseId
        };

        return {
            ...task,
            progress: {
                ...task.progress,
                toolUseCount: task.progress?.toolUseCount ?? 0,
                tokenCount: task.progress?.tokenCount ?? 0,
                summary: summary
            }
        };
    });

    // Step 2: Send telemetry if enabled
    if (telemetryData && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = telemetryData;
        sendTelemetry({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: toolUseId,
            description: summary,
            usage: {
                total_tokens: tokenCount,
                tool_uses: toolUseCount,
                duration_ms: Date.now() - startTime
            },
            summary: summary
        });
    }
}
```

### Key insight

Progress updates are throttled by the caller (typically on tool use), and telemetry is sent asynchronously. The key design is capturing telemetry data BEFORE the state update to ensure accurate values.

---

## Algorithm 5: Mailbox Lock-Based Concurrency

### What it does

Provides safe concurrent access to mailbox files using file locking.

### How it works

```
Step 1: Create mailbox file if not exists
Step 2: Acquire file lock using proper-lockfile
Step 3: Read current messages
Step 4: Modify messages (add/remove/mark)
Step 5: Write back to file
Step 6: Release lock
```

### Lock Configuration

```javascript
// Lock options for proper-lockfile
LOCK_OPTIONS = {
    retries: {
        retries: 10,        // Try 10 times
        minTimeout: 50,     // Min 50ms between retries
        maxTimeout: 200     // Max 200ms between retries
    },
    stale: 5000             // Lock considered stale after 5 seconds
};
```

### Key insight

The lock configuration balances:
1. **Responsiveness** - 10 retries with 50-200ms backoff
2. **Deadlock prevention** - 5 second stale timeout
3. **Atomicity** - Read-modify-write under lock

---

## Algorithm 6: Orphaned Tool Result Filtering (Fx8)

### What it does

Removes tool_use blocks that don't have corresponding tool_results when forking context.

### How it works

```
Step 1: Collect all tool_result IDs from user messages
Step 2: Filter assistant messages with tool_uses lacking results
Step 3: Keep all other messages
```

### Source Code

```javascript
// ============================================
// Fx8 - filterOrphanedToolResults
// Location: chunks.133.mjs:1788-1803
// ============================================

// READABLE (for understanding):
function filterOrphanedToolResults(messages) {
    // Step 1: Collect all tool_result IDs
    let toolResultIds = new Set();

    for (let message of messages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let block of content) {
                    if (block.type === "tool_result" && block.tool_use_id) {
                        toolResultIds.add(block.tool_use_id);
                    }
                }
            }
        }
    }

    // Step 2: Filter orphaned assistant messages
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Remove if any tool_use lacks a result
                return !content.some(block =>
                    block.type === "tool_use" &&
                    block.id &&
                    !toolResultIds.has(block.id)
                );
            }
        }
        return true;
    });
}
```

### Key insight

When forking from a parent context, some tool_uses may have been made but not yet received results. Including these orphaned tool_uses in the subagent context would cause LLM errors because the model expects results for all tool uses.

---

## Algorithm 7: Skill Name Resolution (NvY)

### What it does

Resolves skill names to full identifiers using multiple lookup strategies.

### How it works

```
Step 1: Try exact match in registry
Step 2: Try prefixing with agent namespace (agentType:skillName)
Step 3: Try suffix match (ends with :skillName)
Step 4: Return null if not found
```

### Source Code

```javascript
// ============================================
// NvY - resolveSkillName
// Location: chunks.133.mjs:1817-1828
// ============================================

// READABLE (for understanding):
function resolveSkillName(skillName, skillRegistry, agentDefinition) {
    // Step 1: Exact match
    if (skillExistsInRegistry(skillName, skillRegistry)) {
        return skillName;
    }

    // Step 2: Namespace prefix
    let agentNamespace = agentDefinition.agentType.split(":")[0];
    if (agentNamespace) {
        let namespacedName = `${agentNamespace}:${skillName}`;
        if (skillExistsInRegistry(namespacedName, skillRegistry)) {
            return namespacedName;
        }
    }

    // Step 3: Suffix match
    let suffix = `:${skillName}`;
    let matchingSkill = skillRegistry.find(skill => skill.name.endsWith(suffix));
    if (matchingSkill) {
        return matchingSkill.name;
    }

    // Step 4: Not found
    return null;
}
```

### Key insight

The three-tier lookup allows flexible skill referencing:
- `"my-skill"` - Direct reference
- `"my-agent:my-skill"` - Namespaced reference
- `":my-skill"` - Any skill ending with `:my-skill`

---

## Summary Table

| Algorithm | Purpose | Key Insight |
|-----------|---------|-------------|
| Task ID Generation | Unique IDs | Type prefix for visual identification |
| Tool Filtering | Access control | Least privilege for async agents |
| Abort Signal | Safe termination | Cleanup before state change |
| Progress Tracking | Monitoring | Telemetry capture before update |
| Mailbox Locking | Concurrency | Balance responsiveness vs safety |
| Orphan Filtering | Context cleanup | Prevent LLM errors from missing results |
| Skill Resolution | Flexible lookup | Three-tier matching strategy |

---

## Related Documents

- [agent_tool_complete_source_v4.md](./agent_tool_complete_source_v4.md) - AgentTool
- [agent_loop_complete_source_v5.md](./agent_loop_complete_source_v5.md) - Agent loop
- [task_lifecycle_complete_source_v7.md](../26_background_agents/task_lifecycle_complete_source_v7.md) - Task lifecycle
- [tool_filtering_complete_source_v2.md](./tool_filtering_complete_source_v2.md) - Tool filtering

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All key algorithms documented with source-level restoration