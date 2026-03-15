# Hooks Integration - Agent Team Coordination Mechanism

> **Module**: Agent Teams - Hooks System
> **Source**: `chunks.141.mjs` (lines 1561-1711), `chunks.131.mjs` (lines 260-346)
> **Version**: Claude Code 2.1.76

---

## Table of Contents

1. [Overview](#1-overview)
2. [executeAgentHook - Main Hook Execution Engine](#2-executeagenthook---main-hook-execution-engine)
3. [Hook Result Parsing and Validation](#3-hook-result-parsing-and-validation)
4. [TeammateIdle Hook Flow](#4-teammateidle-hook-flow)
5. [TaskCompleted Hook Flow](#5-taskcompleted-hook-flow)
6. [5-Level Priority Poll Loop Integration](#6-5-level-priority-poll-loop-integration)
7. [Error Handling and Telemetry](#7-error-handling-and-telemetry)
8. [Design Trade-offs](#8-design-trade-offs)
9. [Related Symbols](#9-related-symbols)

---

## 1. Overview

The hooks system in Claude Code Agent Teams provides a programmable extension mechanism for intercepting and responding to key lifecycle events during multi-agent collaboration. Unlike traditional event listeners that simply notify, these hooks are **verification agents** -- autonomous Claude agents spawned to validate conditions, inspect code state, and decide whether to approve or block an action.

### Key Concepts

**Hook Types:**
- **TeammateIdle** - Fires when a teammate agent transitions to idle state (available for new work)
- **TaskCompleted** - Fires when an agent marks a task as completed
- **Custom verification hooks** - User-defined conditions via shell commands or agent prompts

**Hook Lifecycle:**
```
Event occurs → Hook config retrieved → executeAgentHook spawns verification agent
  → Agent runs with 50-turn limit → Structured output validation
  → Success (condition met) / Blocking error (condition failed) / Non-blocking error (execution failed)
```

**Architecture Insight:**
Hooks integrate with the in-process poll loop's 5-level priority system. When a hook fires, the verification agent runs **synchronously** (blocking the triggering action) before the system proceeds. This ensures conditions are validated *before* state transitions occur, preventing invalid team configurations or premature task completion.

---

## 2. executeAgentHook - Main Hook Execution Engine

### What it does

`executeAgentHook` (Xi4) is the core function that spawns a temporary verification agent, runs it with strict resource limits, and interprets its structured output to determine whether the hook condition is satisfied.

### How it works

**Step-by-step algorithm:**

1. **Generate Hook ID**: Creates unique identifier `hook-${generateHookId()}` for tracking and telemetry. Reuses provided `toolUseID` if available.

2. **Resolve transcript path**: Determines the conversation transcript path for the current agent, allowing the verification agent to read full conversation history via `Read` tool.

3. **Interpolate prompt**: Calls `hook.prompt($)` to fill in template variables (e.g., `${taskId}`, `${agentName}`) into the hook's verification prompt.

4. **Setup timeout**: Configures timeout from `hook.timeout` (in seconds, default 60s). Creates `AbortSignal.timeout(60000ms)` for automatic cancellation.

5. **Prepare verification agent tools**: Filters available tools to exclude:
   - Agent-spawning tools (prevents recursive hook agents)
   - Tools in the block list `Bj1` (likely includes risky destructive operations)
   - Adds special `StructuredOutput` tool (cD) for returning verification results

6. **Build system prompt**: Injects instructions for the verification agent:
   ```
   You are verifying a stop condition in Claude Code.
   Your task is to verify that the agent completed the given plan.
   The conversation transcript is available at: /path/to/transcript.jsonl

   Use available tools to inspect codebase and verify the condition.
   Use as few steps as possible - be efficient and direct.

   When done, return result using StructuredOutput tool with:
   - ok: true if condition is met
   - ok: false with reason if condition is not met
   ```

7. **Configure agent context**: Creates a new `toolUseContext` with:
   - Unique `agentId: hook-agent-${generateHookId()}`
   - Permission mode: `dontAsk` (auto-approve all tool uses)
   - Session-scoped allow rule: `Read(/${transcriptPath})` for accessing conversation history
   - `isNonInteractiveSession: true` to disable user prompts
   - `maxThinkingTokens: 0` to minimize latency

8. **Register agent in AppState**: Calls `registerAgentInState` (DJ6) to add the hook agent's ID to the active agents registry. This prevents name collisions and enables proper cleanup.

9. **Execute agent loop**: Runs the main agent loop (`ZR`) with a strict 50-turn limit:
   ```javascript
   let turnCount = 0, hitMaxTurns = false;
   for await (let event of agentLoop(...)) {
     if (event.type === "assistant") {
       turnCount++;
       if (turnCount >= 50) {
         hitMaxTurns = true;
         abortController.abort();
         break;
       }
     }
     if (event.type === "attachment" && event.attachment.type === "structured_output") {
       // Parse and validate structured output
       let parsed = StructuredOutputSchema.safeParse(event.attachment.data);
       if (parsed.success) {
         result = parsed.data;
         abortController.abort(); // Stop agent immediately
         break;
       }
     }
   }
   ```

10. **Cleanup**: Removes abort listener, cleans up signal handler, unregisters agent from AppState via `unregisterAgentFromState` (iD1).

11. **Interpret result**:
    - **No structured output + hitMaxTurns**: Return `{outcome: "cancelled"}` + telemetry `tengu_agent_stop_hook_max_turns`
    - **No structured output + normal termination**: Return `{outcome: "cancelled"}` + telemetry `tengu_agent_stop_hook_error`
    - **Structured output with `ok: false`**: Return `{outcome: "blocking", blockingError: ...}` (prevents the triggering action)
    - **Structured output with `ok: true`**: Return `{outcome: "success"}` + telemetry `tengu_agent_stop_hook_success`

12. **Error handling**: Catch-all wraps entire execution. If `abortSignal.aborted`, return `{outcome: "cancelled"}`. Otherwise, return `{outcome: "non_blocking_error"}` with error message (does NOT block the triggering action).

### Why this approach

**Verification agent pattern**: Instead of running shell commands with limited context, spawning a full Claude agent gives access to:
- All available tools (Read, Grep, Glob, Bash, etc.)
- Reasoning capabilities to understand complex conditions
- Access to conversation history and code state
- Ability to handle ambiguous requirements

**50-turn limit**: Prevents runaway loops while allowing multi-step verification (e.g., read file → parse output → check condition → return). Most verifications complete in 2-5 turns; 50 is a generous upper bound.

**Strict timeout (60s default)**: Hooks are synchronous blockers of user-facing actions (task completion, team shutdown). A hung hook would freeze the entire workflow. The timeout ensures eventual progress even if verification fails.

**Structured output requirement**: Forces explicit `{ok: boolean, reason?: string}` format. This eliminates ambiguity from parsing natural language responses ("looks good to me" → is that success or failure?).

**Non-blocking error fallback**: If the verification agent crashes (out of memory, API error, etc.), the system treats it as a non-blocking error rather than preventing the action. This "fail-open" design prioritizes user productivity over strict enforcement when infrastructure fails.

### Key insight

The hook system transforms user-defined conditions (plain text prompts like "verify all tests pass") into programmatic gates by leveraging Claude's reasoning and tool-use capabilities. This is more flexible than traditional webhook systems (which require pre-defined APIs) but safer than unrestricted shell command execution (which lacks context and reasoning).

```javascript
// ============================================
// executeAgentHook - Spawn verification agent to validate hook condition
// Location: chunks.141.mjs:1561-1698
// ============================================

// ORIGINAL (for source lookup):
async function Xi4(A, q, K, Y, z, w, H, $) {
    let O = H || `hook-${Ji4()}`,
        _ = w.agentId ? kh(w.agentId) : dO(),
        J = Date.now();
    try {
        let X = XJ6(A.prompt($), Y);
        h(`Hooks: Processing agent hook with prompt: ${X}`);
        let j = [c6({ content: X })];
        h(`Hooks: Starting agent query with ${j.length} messages`);
        let M = A.timeout ? A.timeout * 1000 : 60000,
            P = Aq(),
            { signal: W, cleanup: G } = fR(z, AbortSignal.timeout(M)),
            f = () => P.abort();
        W.addEventListener("abort", f);
        let Z = P.signal;
        try {
            let N = jn7(),
                k = [...w.options.tools.filter((p) => p.name !== cD).filter((p) => !Bj1.has(p.name)), N],
                y = [`You are verifying a stop condition in Claude Code...`],
                B = A.model ?? _J(),
                S = 50,
                m = xZ(`hook-agent-${Ji4()}`),
                b = { /* ... agent config ... */ };
            DJ6(w.setAppState, m);
            let g = null, U = 0, x = !1;
            for await (let p of ZR({ /* ... agent loop params ... */ })) {
                if (p.type === "assistant") {
                    if (U++, U >= 50) { x = !0; P.abort(); break }
                }
                if (p.type === "attachment" && p.attachment.type === "structured_output") {
                    let l = GB1.safeParse(p.attachment.data);
                    if (l.success) { g = l.data; P.abort(); break }
                }
            }
            if (!g) {
                if (x) return { hook: A, outcome: "cancelled" };
                return { hook: A, outcome: "cancelled" };
            }
            if (!g.ok) return { hook: A, outcome: "blocking", blockingError: { ... } };
            return { hook: A, outcome: "success", message: kq({ ... }) };
        } catch (N) { /* ... */ }
    } catch (X) {
        return { hook: A, outcome: "non_blocking_error", message: kq({ ... }) };
    }
}

// READABLE (for understanding):
async function executeAgentHook(
    hookConfig,
    hookName,
    hookEvent,
    contextVariables,
    parentAbortSignal,
    toolUseContext,
    toolUseID,
    hookContext
) {
    let hookId = toolUseID || `hook-${generateHookId()}`;
    let transcriptPath = toolUseContext.agentId ? getTranscriptPath(toolUseContext.agentId) : getDefaultTranscriptPath();
    let startTime = Date.now();

    try {
        // Interpolate hook prompt with context variables
        let interpolatedPrompt = interpolatePrompt(hookConfig.prompt(hookContext), contextVariables);
        log(`Hooks: Processing agent hook with prompt: ${interpolatedPrompt}`);

        let initialMessages = [createUserMessage({ content: interpolatedPrompt })];
        let timeoutMs = hookConfig.timeout ? hookConfig.timeout * 1000 : 60000;
        let hookAbortController = new AbortController();
        let { signal: combinedSignal, cleanup: cleanupSignal } = combineAbortSignals(
            parentAbortSignal,
            AbortSignal.timeout(timeoutMs)
        );

        // Setup abort forwarding
        let abortHandler = () => hookAbortController.abort();
        combinedSignal.addEventListener("abort", abortHandler);

        try {
            let structuredOutputTool = getStructuredOutputTool();

            // Filter tools: remove agent-spawning tools and blocked tools
            let verificationTools = [
                ...toolUseContext.options.tools
                    .filter(tool => tool.name !== STRUCTURED_OUTPUT_TOOL_NAME)
                    .filter(tool => !HOOK_BLOCKED_TOOLS.has(tool.name)),
                structuredOutputTool
            ];

            let systemPromptLines = [
                `You are verifying a stop condition in Claude Code.`,
                `Your task is to verify that the agent completed the given plan.`,
                `The conversation transcript is available at: ${transcriptPath}`,
                `You can read this file to analyze the conversation history if needed.`,
                ``,
                `Use the available tools to inspect the codebase and verify the condition.`,
                `Use as few steps as possible - be efficient and direct.`,
                ``,
                `When done, return your result using the ${STRUCTURED_OUTPUT_TOOL_NAME} tool with:`,
                `- ok: true if the condition is met`,
                `- ok: false with reason if the condition is not met`
            ];

            let modelOverride = hookConfig.model ?? getDefaultModel();
            let MAX_TURNS = 50;
            let agentId = generateAgentId(`hook-agent-${generateHookId()}`);

            // Build agent context with permissive permissions
            let hookAgentContext = {
                ...toolUseContext,
                agentId: agentId,
                abortController: hookAbortController,
                options: {
                    ...toolUseContext.options,
                    tools: verificationTools,
                    mainLoopModel: modelOverride,
                    isNonInteractiveSession: true,
                    maxThinkingTokens: 0  // Minimize latency
                },
                setInProgressToolUseIDs: () => {},  // No-op for hooks
                async getAppState() {
                    let currentAppState = await toolUseContext.getAppState();
                    let existingSessionRules = currentAppState.toolPermissionContext.alwaysAllowRules.session ?? [];
                    return {
                        ...currentAppState,
                        toolPermissionContext: {
                            ...currentAppState.toolPermissionContext,
                            mode: "dontAsk",  // Auto-approve all tool uses
                            alwaysAllowRules: {
                                ...currentAppState.toolPermissionContext.alwaysAllowRules,
                                session: [
                                    ...existingSessionRules,
                                    `Read(/${transcriptPath})`  // Allow reading conversation history
                                ]
                            }
                        }
                    };
                }
            };

            // Register agent in AppState
            registerAgentInState(toolUseContext.setAppState, agentId);

            let structuredResult = null;
            let turnCount = 0;
            let hitMaxTurns = false;

            // Run agent loop with turn limit
            for await (let event of runAgentLoop({
                messages: initialMessages,
                systemPrompt: systemPromptLines,
                userContext: {},
                systemContext: {},
                canUseTool: alwaysAllowTool,
                toolUseContext: hookAgentContext,
                querySource: "hook_agent"
            })) {
                // Handle streaming events (display progress)
                handleStreamingEvent(event, () => {}, updateResponseLength, setStreamMode, () => {});

                if (event.type === "stream_event" || event.type === "stream_request_start") {
                    continue;
                }

                // Count assistant turns and enforce limit
                if (event.type === "assistant") {
                    turnCount++;
                    if (turnCount >= 50) {
                        hitMaxTurns = true;
                        log(`Hooks: Agent turn ${turnCount} hit max turns, aborting`);
                        hookAbortController.abort();
                        break;
                    }
                }

                // Check for structured output attachment
                if (event.type === "attachment" && event.attachment.type === "structured_output") {
                    let parseResult = StructuredOutputSchema.safeParse(event.attachment.data);
                    if (parseResult.success) {
                        structuredResult = parseResult.data;
                        log(`Hooks: Got structured output: ${JSON.stringify(structuredResult)}`);
                        hookAbortController.abort();  // Stop agent immediately
                        break;
                    }
                }
            }

            // Cleanup
            combinedSignal.removeEventListener("abort", abortHandler);
            cleanupSignal();
            unregisterAgentFromState(toolUseContext.setAppState, agentId);

            // Interpret results
            if (!structuredResult) {
                if (hitMaxTurns) {
                    log("Hooks: Agent hook did not complete within 50 turns");
                    recordTelemetry("tengu_agent_stop_hook_max_turns", {
                        durationMs: Date.now() - startTime,
                        turnCount: turnCount
                    });
                    return {
                        hook: hookConfig,
                        outcome: "cancelled"
                    };
                }
                log("Hooks: Agent hook did not return structured output");
                recordTelemetry("tengu_agent_stop_hook_error", {
                    durationMs: Date.now() - startTime,
                    turnCount: turnCount,
                    errorType: 1  // No structured output
                });
                return {
                    hook: hookConfig,
                    outcome: "cancelled"
                };
            }

            // Check if condition was met
            if (!structuredResult.ok) {
                log(`Hooks: Agent hook condition was not met: ${structuredResult.reason}`);
                return {
                    hook: hookConfig,
                    outcome: "blocking",
                    blockingError: {
                        blockingError: `Agent hook condition was not met: ${structuredResult.reason}`,
                        command: hookConfig.prompt(hookContext)
                    }
                };
            }

            // Success case
            log("Hooks: Agent hook condition was met");
            recordTelemetry("tengu_agent_stop_hook_success", {
                durationMs: Date.now() - startTime,
                turnCount: turnCount
            });
            return {
                hook: hookConfig,
                outcome: "success",
                message: formatMessage({
                    type: "hook_success",
                    hookName: hookName,
                    toolUseID: hookId,
                    hookEvent: hookEvent,
                    content: "Condition met"
                })
            };

        } catch (error) {
            combinedSignal.removeEventListener("abort", abortHandler);
            cleanupSignal();

            // If aborted (timeout or parent signal), treat as cancelled
            if (hookAbortController.signal.aborted) {
                return {
                    hook: hookConfig,
                    outcome: "cancelled"
                };
            }
            throw error;
        }
    } catch (error) {
        let errorMessage = error instanceof Error ? error.message : String(error);
        log(`Hooks: Agent hook error: ${errorMessage}`);
        recordTelemetry("tengu_agent_stop_hook_error", {
            durationMs: Date.now() - startTime,
            errorType: 2  // Execution error
        });
        return {
            hook: hookConfig,
            outcome: "non_blocking_error",
            message: formatMessage({
                type: "hook_non_blocking_error",
                hookName: hookName,
                toolUseID: hookId,
                hookEvent: hookEvent,
                content: `Hook execution failed: ${errorMessage}`
            })
        };
    }
}

// Mapping: Xi4→executeAgentHook, A→hookConfig, q→hookName, K→hookEvent, Y→contextVariables, z→parentAbortSignal, w→toolUseContext, H→toolUseID, $→hookContext, Ji4→generateHookId, XJ6→interpolatePrompt, c6→createUserMessage, fR→combineAbortSignals, Aq→AbortController, jn7→getStructuredOutputTool, cD→STRUCTURED_OUTPUT_TOOL_NAME, Bj1→HOOK_BLOCKED_TOOLS, _J→getDefaultModel, xZ→generateAgentId, DJ6→registerAgentInState, ZR→runAgentLoop, uX→alwaysAllowTool, iW1→handleStreamingEvent, GB1→StructuredOutputSchema, Q1→JSON.stringify, c→recordTelemetry, kq→formatMessage, iD1→unregisterAgentFromState, kh→getTranscriptPath, dO→getDefaultTranscriptPath
```

---

## 3. Hook Result Parsing and Validation

### What it does

`parseHookOutput` (Wi4) handles the output from shell-command-based hooks (as opposed to agent-based hooks). It attempts to parse JSON-structured output and validates it against a schema.

### How it works

**Algorithm:**

1. **Trim whitespace**: Remove leading/trailing spaces from hook output

2. **Check for JSON format**: If output doesn't start with `{`, treat as plain text:
   ```javascript
   if (!output.trim().startsWith("{")) {
     log("Hook output does not start with {, treating as plain text");
     return { plainText: output };
   }
   ```

3. **Parse JSON**: Use `JSON.parse` to attempt parsing

4. **Schema validation**: Validate against `HookOutputSchema` (zJ6) using Zod's `safeParse`:
   ```typescript
   interface HookOutput {
     ok: boolean;
     reason?: string;
     // ... other optional fields
   }
   ```

5. **Return result**:
   - **Valid JSON**: `{ json: parsedData }`
   - **Invalid JSON or schema failure**: `{ plainText: originalOutput }`

### Why this approach

**Lenient parsing**: Treats non-JSON output as plain text rather than failing. This allows hooks to provide human-readable error messages without strict formatting.

**Schema validation**: Ensures hooks return expected fields (`ok`, `reason`). This prevents downstream code from crashing on malformed outputs.

**Separate path from agent hooks**: Agent-based hooks use structured output tool (enforced format), while shell-command hooks use this parser (lenient format). This reflects the different levels of control over each hook type.

```javascript
// ============================================
// parseHookOutput - Parse and validate shell hook output
// Location: chunks.141.mjs:1780-1790
// ============================================

// ORIGINAL (for source lookup):
function Wi4(A) {
    let q = A.trim();
    if (!q.startsWith("{")) return h("Hook output does not start with {, treating as plain text"), { plainText: A };
    try {
        let K = _A(q),
            Y = zJ6.safeParse(K);
        if (Y.success) return h("Successfully parsed and validated hook JSON output"), { json: Y.data };
        // ... error handling ...
    } catch { /* ... */ }
}

// READABLE (for understanding):
function parseHookOutput(rawOutput) {
    let trimmed = rawOutput.trim();

    // Not JSON - treat as plain text
    if (!trimmed.startsWith("{")) {
        log("Hook output does not start with {, treating as plain text");
        return { plainText: rawOutput };
    }

    try {
        let parsed = JSON.parse(trimmed);
        let validationResult = HookOutputSchema.safeParse(parsed);

        if (validationResult.success) {
            log("Successfully parsed and validated hook JSON output");
            return { json: validationResult.data };
        }

        // Schema validation failed - treat as plain text
        log("Hook output failed schema validation, treating as plain text");
        return { plainText: rawOutput };
    } catch (error) {
        log(`Failed to parse hook JSON: ${error.message}`);
        return { plainText: rawOutput };
    }
}

// Mapping: Wi4→parseHookOutput, A→rawOutput, q→trimmed, _A→JSON.parse, zJ6→HookOutputSchema, h→log
```

---

## 4. TeammateIdle Hook Flow

### Trigger Condition

The `TeammateIdle` hook fires when an agent in an agent team transitions to an idle state -- meaning it has no pending messages, no active tasks, and is waiting for new work to be assigned.

### Integration Points

**1. Agent poll loop completion**: When `inProcessPollLoop` (WVY) returns `{type: "aborted"}` or when a pane-based agent's process exits with status 0 (clean shutdown).

**2. Hook invocation**:
```javascript
if (agent.status === "idle" && hookRegistry.has("TeammateIdle")) {
    let hookResult = await executeAgentHook(
        hookRegistry.get("TeammateIdle"),
        "TeammateIdle",
        { agentId: agent.id, agentName: agent.name },
        /* ... */
    );

    if (hookResult.outcome === "blocking") {
        // Prevent idle transition, display error
        log(`TeammateIdle hook blocked idle transition: ${hookResult.blockingError}`);
        // Agent remains in "busy" state
    } else if (hookResult.outcome === "success") {
        // Allow idle transition
        agent.status = "idle";
    }
}
```

**3. Typical use cases**:
- **Verify completion**: Check if agent actually finished assigned work before marking as available
- **Cleanup validation**: Ensure temporary files were cleaned up, processes were stopped
- **State consistency**: Verify agent's claimed completion matches observable state

### Example Hook Config

```json
{
  "name": "TeammateIdle",
  "prompt": "Verify that agent {{agentName}} has completed all assigned tasks. Check the task list, conversation history, and code state. Return {ok: true} if the agent has no pending work, or {ok: false, reason: 'description'} if work remains.",
  "timeout": 30,
  "model": "haiku"
}
```

---

## 5. TaskCompleted Hook Flow

### Trigger Condition

The `TaskCompleted` hook fires when an agent calls `TaskUpdate` with `status: "completed"` on a task it owns.

### Integration Points

**1. TaskUpdate tool execution**: Before persisting the status change:
```javascript
// In TaskUpdate tool implementation
if (newStatus === "completed" && hookRegistry.has("TaskCompleted")) {
    let hookResult = await executeAgentHook(
        hookRegistry.get("TaskCompleted"),
        "TaskCompleted",
        { taskId: task.id, taskSubject: task.subject, agentId: agent.id },
        /* ... */
    );

    if (hookResult.outcome === "blocking") {
        // Reject the TaskUpdate, return error to agent
        return {
            success: false,
            error: `TaskCompleted hook failed: ${hookResult.blockingError.blockingError}`
        };
    }
}

// Proceed with status update
task.status = "completed";
```

**2. Typical use cases**:
- **Verify tests pass**: Run test suite before allowing task completion
- **Check coverage**: Ensure new code meets coverage thresholds
- **Validate requirements**: Confirm acceptance criteria were met
- **Dependency checks**: Ensure dependent tasks can proceed

### Example Hook Config

```json
{
  "name": "TaskCompleted",
  "prompt": "Verify that task '{{taskSubject}}' is truly complete. Run the test suite with 'npm test' and check that all tests pass. Return {ok: true} if tests pass, or {ok: false, reason: 'X tests failed'} otherwise.",
  "timeout": 120,
  "model": "sonnet"
}
```

---

## 6. 5-Level Priority Poll Loop Integration

### Hook Priority in Message Queue

Hooks do **not** have their own priority level in the poll loop. Instead, they are **synchronous blockers** that execute *before* the poll loop processes the next message.

**Execution flow:**
```
Agent finishes current turn
  → Check for lifecycle event (TaskCompleted, TeammateIdle)
  → If hook registered, call executeAgentHook (blocks)
  → Hook returns success/blocking/error
  → If success, proceed to poll loop
  → If blocking, display error and retry current operation
  → If non-blocking error, log warning and proceed

Poll loop priorities (from pane_backend_executor.md):
  Priority 1: pendingUserMessages (direct injection)
  Priority 2: shutdown_request (always wins)
  Priority 3: team-lead messages
  Priority 4: any unread messages
  Priority 5: claim next task
```

### Shutdown Request and Hook Interaction

**Critical behavior**: Shutdown requests bypass hooks. This prevents deadlock scenarios where a hook blocks shutdown and the user has no way to terminate the agent.

**Implementation:**
```javascript
// In poll loop (inProcessPollLoop)
if (hasShutdownRequest) {
    // Return shutdown immediately, do NOT check hooks
    return { type: "shutdown_request", ... };
}

// In agent runner (after receiving shutdown)
if (message.type === "shutdown_request") {
    // Process shutdown directly, bypassing all hooks
    await handleGracefulShutdown();
}
```

### Hook and Task Claiming

When an agent claims a task (Priority 5), the TaskCompleted hook will fire *after* the agent marks the task as done (not during claiming). This avoids circular dependencies where the hook checks if a task is claimable.

---

## 7. Error Handling and Telemetry

### Telemetry Events

The hook system emits three telemetry events for observability:

**1. `tengu_agent_stop_hook_success`**
```typescript
{
  event: "tengu_agent_stop_hook_success",
  durationMs: number,  // Total hook execution time
  turnCount: number    // Number of agent turns used
}
```

**2. `tengu_agent_stop_hook_max_turns`**
```typescript
{
  event: "tengu_agent_stop_hook_max_turns",
  durationMs: number,
  turnCount: 50  // Always 50 (the limit)
}
```

**3. `tengu_agent_stop_hook_error`**
```typescript
{
  event: "tengu_agent_stop_hook_error",
  durationMs: number,
  turnCount: number,
  errorType: 1 | 2  // 1 = no structured output, 2 = execution error
}
```

### Error Outcomes

| Outcome | Meaning | Blocks Action? | User Impact |
|---------|---------|----------------|-------------|
| `success` | Condition met, hook passed | No | Action proceeds normally |
| `blocking` | Condition not met, hook failed validation | **Yes** | Error displayed, action cancelled |
| `cancelled` | Hook timed out or hit turn limit | No | Warning logged, action proceeds |
| `non_blocking_error` | Hook crashed (exception thrown) | No | Warning logged, action proceeds |

### Graceful Degradation

**Design principle**: Hook failures should not brick the system. If infrastructure fails (API timeout, OOM, etc.), the system treats it as a non-blocking error and proceeds with the user's requested action.

**Rationale**: Hooks are *enhancements* to the workflow, not critical safety checks. A failing hook should not prevent users from completing work, especially in time-sensitive scenarios.

**Exception**: When a hook explicitly returns `{ok: false}` with a reason, it's treated as a blocking error because the verification agent successfully evaluated the condition and determined it was not met. This is the user's intent (enforce a requirement), not a system failure.

---

## 8. Design Trade-offs

### Synchronous vs Asynchronous Hooks

**Chosen approach**: Synchronous (blocking)

**Alternatives considered**:
- **Async with notifications**: Fire hooks in background, notify when complete
- **Async with eventual consistency**: Allow action, roll back if hook fails

**Why synchronous**:
- **Simpler mental model**: User expects "if hook fails, action doesn't happen"
- **Prevents invalid states**: Async hooks would require rollback logic (complex and error-prone)
- **Acceptable latency**: Most hooks complete in <5 seconds (agent spawning is fast)

**Trade-off**: Users may experience a brief delay when triggering hook-protected actions. This is acceptable given the alternative complexity.

### 50-Turn Limit

**Chosen approach**: Hard limit of 50 turns

**Alternatives considered**:
- **No limit**: Risk of infinite loops
- **Lower limit (e.g., 10 turns)**: May not be enough for complex verifications
- **Dynamic limit based on hook type**: Added complexity

**Why 50 turns**:
- **Generous upper bound**: Even multi-step verifications (read file → parse → check → return) complete in <10 turns
- **Prevents runaway**: Catches infinite loops before consuming excessive API credits
- **Simple implementation**: Single constant, no dynamic logic

**Trade-off**: A legitimate hook that needs >50 turns would be cancelled. This is rare in practice (most hooks are simple checks).

### Fail-Open vs Fail-Closed on Infrastructure Errors

**Chosen approach**: Fail-open (non-blocking error)

**Alternatives considered**:
- **Fail-closed**: Treat all errors as blocking
- **Configurable per hook**: Let users choose behavior

**Why fail-open**:
- **Availability over enforcement**: Users can always make progress
- **Infrastructure failures are transient**: API timeouts, rate limits, OOM are temporary
- **Explicit failures still block**: `{ok: false}` is honored because it's intentional

**Trade-off**: A hook that should block may fail to block if infrastructure fails. This is acceptable given the alternative (completely blocked users during outages).

### Agent-Based vs Shell-Command Hooks

**Current implementation**: Both supported

**Why agent-based hooks are preferred**:
- **Access to tools**: Can read files, run commands, parse outputs
- **Reasoning capability**: Can handle ambiguous conditions ("ensure API is working")
- **Consistent interface**: Same tool ecosystem as main agents

**Why shell-command hooks still exist**:
- **Lower latency**: No agent spawn overhead
- **Simple checks**: For trivial conditions (file exists, process running)
- **Legacy compatibility**: Existing hooks may be shell-based

**Trade-off**: Maintaining two hook types increases code complexity. The agent-based path is the future; shell-command hooks may be deprecated.

---

## 9. Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `executeAgentHook` (Xi4) - Main hook execution engine, spawns verification agent
- `generateHookId` (Ji4) - Generates unique hook identifiers for tracking
- `parseHookOutput` (Wi4) - Parses and validates shell hook output
- `inProcessPollLoop` (WVY) - 5-level priority message polling (documented in pane_backend_executor.md)
- `registerAgentInState` (DJ6) - Adds hook agent to active agents registry
- `unregisterAgentFromState` (iD1) - Removes hook agent from registry
- `interpolatePrompt` (XJ6) - Fills template variables in hook prompts
- `combineAbortSignals` (fR) - Merges parent and timeout abort signals
- `getStructuredOutputTool` (jn7) - Returns StructuredOutput tool for verification results
- `runAgentLoop` (ZR) - Main agent execution loop
- `formatMessage` (kq) - Formats hook result messages
- `recordTelemetry` (c) - Emits telemetry events
- `HookOutputSchema` (zJ6) - Zod schema for validating hook outputs
- `StructuredOutputSchema` (GB1) - Zod schema for agent structured outputs
- `STRUCTURED_OUTPUT_TOOL_NAME` (cD) - Constant for structured output tool name
- `HOOK_BLOCKED_TOOLS` (Bj1) - Set of tools not available to verification agents

Cross-references:

- [pane_backend_executor.md](./pane_backend_executor.md) - Poll loop priority system
- [agent_teams_architecture.md](./agent_teams_architecture.md) - Overall team architecture
- [inter_agent_communication.md](./inter_agent_communication.md) - Message delivery and mailbox system
