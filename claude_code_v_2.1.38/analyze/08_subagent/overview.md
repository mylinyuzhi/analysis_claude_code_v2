# Subagent Module Overview (Claude Code 2.1.38)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `AgentTool` (rj1) - The tool object that defines the "Task" tool for spawning subagents
- `resolveSubagentModel` (Uq6) - Model resolution with cascading fallback logic
- `agentLoopRunner` (dR) - The async generator that runs the core agent loop
- `buildAgentResult` (UEA) - Collects results from a completed subagent run
- `resolveTeamName` (KNY) - Resolves team name from input or parent context
- `isInProcessTeammate` (MM) - Checks if the current execution is within an in-process teammate context
- `runWithAgentIdentity` (p01) - Runs a callback bound to an `AsyncLocalStorage` agent identity
- `buildForkContextMessages` (Nn7) - Constructs prompt messages with parent context when forkContext is true
- `buildAgentDescription` (Gn7) - Builds the dynamic tool description listing available agent types

---

## 1. Overview

Subagents are independent Claude instances spawned by the parent agent (or the "team leader") to handle tasks in isolation. Each subagent operates with:

- **Its own message history** -- isolated from the parent conversation
- **Dedicated tool permissions** -- configured via the agent definition's `permissionMode` and filtered `availableTools`
- **Its own model selection** -- potentially different from the parent
- **An abort controller** -- enabling cancellation from the parent or via user input

Subagents serve as the primary mechanism for parallelism and task decomposition in Claude Code. When the parent model decides a task is complex enough to warrant delegation, it invokes the `Task` tool (internally called `AgentTool` / `rj1`), which resolves the right agent definition, configures permissions, and launches a nested agent loop.

---

## 2. Architecture -- Three Execution Modes

The subagent system supports three distinct execution modes, each with different lifecycle characteristics:

### 2.1 Synchronous (Inline) Execution

The default path. The parent agent blocks and waits while the subagent processes. The subagent's streamed messages are relayed back to the parent as `agent_progress` events so the UI can show real-time output.

**Key characteristic:** The parent's tool call does not return until the subagent completes or errors out.

**Flow:**
```
Parent calls Task tool
  -> resolveSubagentModel()
  -> build prompt messages
  -> p01(agentIdentity, async () => {
       for await (msg of dR(agentLoop)) {
         collect messages, relay progress
       }
       return buildAgentResult(messages)
     })
  -> return { status: "completed", ...result }
```

### 2.2 Asynchronous (Background) Execution

When `run_in_background: true` is set, the subagent is launched as a background task. The parent receives an immediate `async_launched` response containing the `agentId` and an `outputFile` path for polling.

**Key characteristic:** Returns immediately. The subagent runs in a detached async closure. State is tracked via the task management system.

**Flow:**
```
Parent calls Task tool with run_in_background: true
  -> zd7() creates background task entry with its own AbortController
  -> p01(agentIdentity, async () => {
       for await (msg of dR(agentLoop)) {
         collect messages, update task progress
       }
       mark task completed/failed
     })
  -> return { status: "async_launched", agentId, outputFile }
```

### 2.3 Teammate (Team Spawning) Execution

When `name` and `team_name` are provided, the subagent is spawned as a **teammate** in a multi-agent team. This path delegates to `spawnTeammate` (Iu4), which dispatches to one of three backends:

| Backend | Function | Condition |
|---------|----------|-----------|
| In-process | `lVY` (handleSpawnInProcess) | `Rm()` returns true (non-interactive or remote sessions) |
| Split-pane (iTerm2/tmux) | `dVY` (handleSpawnSplitPane) | Default when `use_splitpane !== false` |
| Tmux-only | `cVY` (handleSpawnTmux) | Fallback |

**Key characteristic:** The teammate gets its own session and mailbox-based message passing system. It runs independently with a poll loop (`WVY`) for receiving messages.

---

## 3. Lifecycle

The complete subagent lifecycle follows this sequence:

```
1. SPAWN
   - Parent invokes Task tool with { prompt, subagent_type, ... }
   - resolveTeamName() determines team context (if applicable)
   - Validate in-process restrictions (no nested teammates, no background from teammates)

2. RESOLVE AGENT DEFINITION
   - Look up subagent_type in activeAgents registry
   - Apply allowedAgentTypes filtering
   - Apply permission-based filtering (pEA)
   - Validate requiredMcpServers (KPA)

3. CONFIGURE
   - resolveSubagentModel() determines which model to use
   - Build system prompt (NQ1 for standard, dZ+custom for teammates)
   - Build prompt messages (with or without fork context)
   - Set permissionMode from agent definition or parent context
   - Assemble available tools (YP6)

4. EXECUTE
   - Wrap in p01(agentIdentity) for AsyncLocalStorage binding
   - Enter dR() agent loop generator
   - For sync: iterate messages, relay progress
   - For async: detach into background closure
   - For teammate: enter poll loop (WVY) for ongoing message exchange

5. COLLECT RESULTS
   - buildAgentResult() (UEA) extracts final text, usage stats, token counts
   - Sync: return { status: "completed", ...result }
   - Async: mark task completed via vK1(), write output file
   - Teammate: broadcast idle status, wait for next message

6. CLEANUP
   - Abort controllers cleaned up
   - Task state updated (completed/failed/killed)
   - For sync agents that get backgrounded mid-run: seamless transition via backgroundSignal
```

---

## 4. Agent Definition Resolution

### How `subagent_type` Maps to Agent Definitions

**What it does:** Given a `subagent_type` string (e.g., `"code"`, `"research"`), find the matching agent definition from the registry, respecting permission rules and MCP requirements.

**How it works:**

1. Retrieve `activeAgents` from `toolUseContext.options.agentDefinitions`
2. If `allowedAgentTypes` is set, filter to only those types
3. Apply `filterDeniedAgents` (pEA) -- removes agents that have been explicitly denied by permission rules
4. Search for the matching `agentType` in the filtered list
5. If not found in filtered list but found in full list, report a permission denial with source tracking via `getDenialSource` (cEA)
6. If not found at all, report available agents

```javascript
// ============================================
// Agent Definition Lookup - Resolution flow in AgentTool.call()
// Location: chunks.132.mjs:159-171
// ============================================

// ORIGINAL (for source lookup):
let f = J.options.agentDefinitions.activeAgents,
    { allowedAgentTypes: Z } = J.options.agentDefinitions,
    N = pEA(Z ? f.filter((r) => Z.includes(r.agentType)) : f, P.toolPermissionContext, fK),
    T = N.find((r) => r.agentType === q);
if (!T) {
    if (f.find((s) => s.agentType === q)) {
        let s = cEA(P.toolPermissionContext, fK, q);
        throw Error(`Agent type '${q}' has been denied by permission rule '${fK}(${q})' from ${s?.source??"settings"}.`)
    }
    throw Error(`Agent type '${q}' not found. Available agents: ${N.map((s)=>s.agentType).join(", ")}`)
}

// READABLE (for understanding):
let allAgents = toolUseContext.options.agentDefinitions.activeAgents,
    { allowedAgentTypes } = toolUseContext.options.agentDefinitions,
    permittedAgents = filterDeniedAgents(
        allowedAgentTypes ? allAgents.filter(a => allowedAgentTypes.includes(a.agentType)) : allAgents,
        appState.toolPermissionContext,
        AGENT_TOOL_NAME
    ),
    selectedAgent = permittedAgents.find(a => a.agentType === subagentType);
if (!selectedAgent) {
    if (allAgents.find(a => a.agentType === subagentType)) {
        let denialSource = getDenialSource(appState.toolPermissionContext, AGENT_TOOL_NAME, subagentType);
        throw Error(`Agent type '${subagentType}' has been denied by permission rule 'Task(${subagentType})' from ${denialSource?.source ?? "settings"}.`)
    }
    throw Error(`Agent type '${subagentType}' not found. Available agents: ${permittedAgents.map(a => a.agentType).join(", ")}`)
}

// Mapping: f→allAgents, Z→allowedAgentTypes, N→permittedAgents, T→selectedAgent,
//          q→subagentType, pEA→filterDeniedAgents, cEA→getDenialSource, fK→AGENT_TOOL_NAME ("Task")
```

**Why this approach:** The two-level check (filtered vs. full list) provides clear error messages. If the agent type exists but was denied, the user learns which permission rule caused the denial and from which source (settings file, CLI flags, etc.). If the type simply does not exist, the user sees the list of valid options.

**Key insight:** The `allowedAgentTypes` filter acts as a whitelist gate BEFORE the permission-based deny filter. This means an agent type must pass both: (a) be in the allowed list (if one is set), and (b) not be explicitly denied by any permission rule.

---

## 5. Model Resolution

### `resolveSubagentModel` (Uq6)

**What it does:** Determines which LLM model a subagent should use, following a cascading priority order.

**How it works:**

```
Priority (highest first):
1. CLAUDE_CODE_SUBAGENT_MODEL env var  -- always wins
2. CLI model override (passed as `model` parameter)  -- user-specified "sonnet"/"opus"/"haiku"
3. Agent definition's model field  -- from .mdc frontmatter
   - If "inherit": use parent model selection logic ($71)
   - Otherwise: resolve the model name string (t9)
4. Default: Bq6() which returns "inherit"  -- falls through to parent model
```

```javascript
// ============================================
// resolveSubagentModel - Model selection with cascading fallback
// Location: chunks.47.mjs:2329-2345
// ============================================

// ORIGINAL (for source lookup):
function Uq6(A, q, K, Y, z) {
    if (process.env.CLAUDE_CODE_SUBAGENT_MODEL) return t9(process.env.CLAUDE_CODE_SUBAGENT_MODEL);
    let w = E1A(q),
        H = (O) => {
            if (w && E4() === "bedrock") return dl8(O, w);
            return O
        };
    if (K) return H(t9(K));
    let $ = A ?? Bq6();
    if (!$) return H(t9(Bq6()));
    if ($ === "inherit") return $71({
        permissionMode: Y ?? "default",
        mainLoopModel: q,
        exceeds200kTokens: !1
    });
    return H(t9($))
}

// READABLE (for understanding):
function resolveSubagentModel(agentModel, mainLoopModel, cliOverride, permissionMode, agentType) {
    // Priority 1: Environment variable override
    if (process.env.CLAUDE_CODE_SUBAGENT_MODEL)
        return resolveModelName(process.env.CLAUDE_CODE_SUBAGENT_MODEL);

    // Bedrock cross-region inference wrapper
    let crossRegionPrefix = extractCrossRegionPrefix(mainLoopModel);
    let maybeWrapBedrock = (model) => {
        if (crossRegionPrefix && getProvider() === "bedrock")
            return addBedrockPrefix(model, crossRegionPrefix);
        return model;
    };

    // Priority 2: CLI model override (e.g., user picked "sonnet" from tool input)
    if (cliOverride) return maybeWrapBedrock(resolveModelName(cliOverride));

    // Priority 3: Agent definition's model, or default to "inherit"
    let effectiveModel = agentModel ?? getDefaultSubagentModel(); // getDefaultSubagentModel() returns "inherit"
    if (!effectiveModel) return maybeWrapBedrock(resolveModelName(getDefaultSubagentModel()));

    // "inherit" means: use the parent's model selection logic (respects plan mode, opus plan, etc.)
    if (effectiveModel === "inherit") return resolveInheritedModel({
        permissionMode: permissionMode ?? "default",
        mainLoopModel: mainLoopModel,
        exceeds200kTokens: false
    });

    return maybeWrapBedrock(resolveModelName(effectiveModel));
}

// Mapping: Uq6->resolveSubagentModel, A->agentModel, q->mainLoopModel, K->cliOverride,
//          Y->permissionMode, z->agentType, t9->resolveModelName, E1A->extractCrossRegionPrefix,
//          E4->getProvider, dl8->addBedrockPrefix, Bq6->getDefaultSubagentModel,
//          $71->resolveInheritedModel, w->crossRegionPrefix, H->maybeWrapBedrock
```

**Why this approach:**
- The env var override (`CLAUDE_CODE_SUBAGENT_MODEL`) enables operators to force all subagents onto a specific model for cost control or testing.
- The `"inherit"` strategy ensures subagents respect plan-mode-aware model selection -- when the parent is in plan mode with an `opusplan` configuration, the subagent can inherit the same Opus model for planning tasks.
- Bedrock wrapping is applied at the end to ensure cross-region inference prefixes are correctly propagated from the parent model when running on AWS Bedrock.

**Key insight:** The default model for all agent definitions is `"inherit"`, which means subagents will use the *same model resolution logic* as the parent, including plan-mode-specific overrides. This is deliberate: most subagents should use the same model tier as the parent to maintain quality consistency.

---

## 6. Fork Context

### When `forkContext` is True

**What it does:** When an agent definition has `forkContext: true`, the parent's full message history is passed to the subagent, giving it awareness of the ongoing conversation.

**How it works:**

1. If `agentDefinition.forkContext` is truthy, set `forkContextMessages = toolUseContext.messages`
2. Build prompt messages via `buildForkContextMessages` (Nn7) instead of a simple user message
3. `Nn7` locates the specific tool_use block in the parent's assistant message that matches the subagent's prompt
4. Constructs a tool_result message that provides context continuity

```javascript
// ============================================
// buildForkContextMessages - Attach parent context to subagent prompt
// Location: chunks.90.mjs:2529-2537
// ============================================

// ORIGINAL (for source lookup):
function Nn7(A, q) {
    let K = c6({ content: A }),
        Y = q.message.content.find((O) => {
            if (O.type !== "tool_use" || O.name !== fK) return !1;
            let _ = O.input;
            return "prompt" in _ && _.prompt === A
        });
    // ... builds context-aware messages
}

// READABLE (for understanding):
function buildForkContextMessages(prompt, parentAssistantMsg) {
    let userMessage = createUserMessage({ content: prompt });
    let matchingToolUse = parentAssistantMsg.message.content.find((block) => {
        if (block.type !== "tool_use" || block.name !== AGENT_TOOL_NAME) return false;
        let input = block.input;
        return "prompt" in input && input.prompt === prompt;
    });
    // Finds the exact tool_use block in the parent that triggered this subagent,
    // then creates a message sequence that gives the subagent continuity with the parent conversation
}

// Mapping: Nn7->buildForkContextMessages, A->prompt, q->parentAssistantMsg,
//          c6->createUserMessage, fK->AGENT_TOOL_NAME
```

**Why this approach:**
- Fork context is useful for "research" or "analysis" agents that need to understand what the user has already discussed with the parent.
- Without fork context, the subagent starts with a blank slate and only sees its prompt string.
- The cost is higher token usage (the parent's full message history is included), which is why it is opt-in per agent definition.

**Trade-offs:**
- **With forkContext**: Better context awareness, but higher token cost and potential for the subagent to be "distracted" by irrelevant earlier conversation
- **Without forkContext**: Clean isolation, lower cost, but the subagent may miss relevant context that the user already provided

---

## 7. Mid-Run Backgrounding

A unique feature of synchronous subagents is the ability to be **backgrounded mid-execution**. This is achieved through a racing mechanism:

```javascript
// ============================================
// backgroundSignal race - Mid-run transition from sync to async
// Location: chunks.132.mjs:372-381
// ============================================

// ORIGINAL (for source lookup):
let A1 = J1.next(),
    M1 = q1 ? await Promise.race([
        A1.then(($1) => ({ type: "message", result: $1 })),
        q1.then(() => ({ type: "background" }))
    ]) : await A1.then(($1) => ({ type: "message", result: $1 }));

// READABLE (for understanding):
let nextMessage = agentIterator.next();
let raceResult = backgroundSignal
    ? await Promise.race([
        nextMessage.then(result => ({ type: "message", result })),
        backgroundSignal.then(() => ({ type: "background" }))
    ])
    : await nextMessage.then(result => ({ type: "message", result }));

// Mapping: A1->nextMessage, M1->raceResult, J1->agentIterator, q1->backgroundSignal
```

**How it works:**
1. For each iteration, `Promise.race` is used between the next agent message and a `backgroundSignal`
2. If the user triggers backgrounding (e.g., via a keyboard shortcut), the signal resolves
3. The code detects `type: "background"`, checks that the task has been marked `isBackgrounded`
4. It then re-enters `p01()` with `isAsync: true` and the task's own `abortController`
5. From the parent's perspective, it returns `{ status: "async_launched" }` as if it had been async from the start

**Key insight:** This seamless transition means the user never loses work. A long-running synchronous subagent can be moved to the background without restarting, preserving all accumulated messages and state.

---

## 8. In-Process Teammate Runner

### `inProcessAgentRunner` (GVY)

**What it does:** Runs a full agent loop for an in-process teammate, including message polling, compaction, and task list management.

**How it works:**

1. **Initialize identity** -- Build agent identity with `agentId`, `agentName`, `teamName`, `agentColor`
2. **Build system prompt** -- Either replace, append, or use default system prompts, augmented with agent definition instructions
3. **Main loop** -- While not aborted:
   a. Create a work-level AbortController for the current prompt
   b. Check token count; if exceeding threshold, compact history via `AW1`
   c. Enter the agent loop `dR()` within `nq6()` (teammate context AsyncLocalStorage) and `p01()` (identity)
   d. Collect messages, update task state with progress
   e. When the agent loop completes a round, mark as idle
   f. Call `pollForNextMessage` (WVY) to wait for the next incoming message
   g. Dispatch based on message type: shutdown_request, new_message, or aborted
4. **Cleanup** -- Update task status to completed/failed, broadcast idle notification

```javascript
// ============================================
// inProcessAgentRunner - Core teammate execution loop
// Location: chunks.131.mjs:348-596
// ============================================

// ORIGINAL (for source lookup):
async function GVY(A) {
    let { identity: q, taskId: K, prompt: Y, description: z, agentDefinition: w,
          teammateContext: H, toolUseContext: $, abortController: O, model: _,
          systemPrompt: J, systemPromptMode: X, allowedTools: D, allowPermissionPrompts: j } = A;
    // ... 250 lines of agent loop logic
}

// READABLE (for understanding):
async function inProcessAgentRunner(config) {
    let { identity, taskId, prompt, description, agentDefinition,
          teammateContext, toolUseContext, abortController, model,
          systemPrompt, systemPromptMode, allowedTools, allowPermissionPrompts } = config;

    // Build system prompt (replace/append/default)
    // Enter main while loop:
    //   1. Create per-round abort controller
    //   2. Compact if token count exceeds threshold
    //   3. Run dR() agent loop, collecting messages
    //   4. Update task state with progress
    //   5. Mark idle, broadcast status
    //   6. Poll for next message (WVY)
    //   7. Dispatch based on message type
}

// Mapping: GVY->inProcessAgentRunner, A->config, q->identity, K->taskId, Y->prompt,
//          z->description, w->agentDefinition, H->teammateContext, $->toolUseContext,
//          O->abortController, _->model, J->systemPrompt, X->systemPromptMode,
//          D->allowedTools, j->allowPermissionPrompts
```

### `pollForNextMessage` (WVY)

**What it does:** A poll loop that waits for incoming messages from the team mailbox, user pending messages, or task list assignments.

**How it works:**

1. Check for pending user messages in the task state (from UI input)
2. Poll the mailbox (`Ld`) for the teammate at 500ms intervals
3. Prioritize shutdown requests (messages matching `ss()` shutdown pattern)
4. Among non-shutdown messages, prioritize messages from `K2` (team leader constant)
5. Check task list for unclaimed tasks via `ib4()`
6. Respect abort signal throughout

**Why this approach:** The poll-based design with prioritization ensures that:
- Shutdown requests are never missed (they skip the queue)
- The team leader's messages are processed before peer messages
- Task list items provide a "fallback" work source when no explicit messages arrive

---

## 9. Summary of Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Three execution modes | Covers all use cases: quick tasks (sync), long tasks (async), collaborative tasks (teammate) |
| AsyncLocalStorage for identity | Enables deep stack code to identify which agent is running without passing identity through every function |
| Permission filtering at spawn time | Prevents unauthorized agent types from being invoked, with clear error messages |
| "inherit" as default model | Ensures consistent model quality between parent and child unless explicitly overridden |
| Poll-based teammate messaging | Simple, reliable, avoids complex event system; 500ms interval balances responsiveness with CPU usage |
| Mid-run backgrounding via Promise.race | Zero-loss transition from sync to async without restarting the agent |
| Fork context as opt-in | Balances token cost against context awareness per agent definition |

---

## 10. See Also - Deep Technical Analysis

For comprehensive deep-dive analysis of specific subsystems, see:

### Core Execution & State

- **[execution_flow_deep_dive.md](./execution_flow_deep_dive.md)** - Agent loop integration, task state machine, abort signal propagation, identity propagation (AsyncLocalStorage), progress reporting pipeline with 15+ code examples

- **[task_lifecycle_and_state.md](./task_lifecycle_and_state.md)** - Task creation patterns (foreground/background), background signal mechanism (Promise.race), task completion flow (success/fail/kill), state transition diagrams, cleanup mechanisms (three-layer cleanup system)

### Communication & Coordination

- **[communication_and_coordination.md](./communication_and_coordination.md)** - Mailbox system architecture (file-based message queue), poll loop mechanism (5-level priority queue), in-process communication optimization, message flow diagrams, error handling (lock timeouts, corruption recovery)

- **[transcript_and_resume_system.md](./transcript_and_resume_system.md)** - Transcript recording pipeline (write queue pattern, JSONL format), three-stage cleanup pipeline (orphaned tools, thinking blocks, whitespace), conversation chain walking (UUID-based parent links), output file polling, complete resume flow

### Execution Modes & Error Handling

- **[execution_modes_comparison.md](./execution_modes_comparison.md)** - Comprehensive comparison of synchronous vs asynchronous vs teammate execution modes, performance metrics tables, decision matrix for choosing execution mode, resource usage breakdown

- **[error_handling_and_recovery.md](./error_handling_and_recovery.md)** - Error categories (tool, LLM API, state, communication, timeout), recovery strategies (graceful degradation, partial preservation), error propagation (try-catch boundaries, logging, telemetry), cleanup mechanisms (three-layer system)

### Architecture Summary

- **[architecture_summary.md](./architecture_summary.md)** - High-level component overview diagrams, complete data flow diagrams for all execution modes, file structure map, key design patterns (generator-based iteration, AsyncLocalStorage, Promise.race, write queue, priority queue), critical code paths with hotspot analysis, performance bottlenecks identification, future enhancement opportunities

### Integration with Other Modules

- **[tools_integration.md](./tools_integration.md)** - Tool set assembly pipeline (`assembleSessionToolSet`), context derivation (`deriveToolUseContext`), tool whitelists (`BACKGROUND_AGENT_ALLOWED_TOOLS`, `DELEGATE_ALLOWED_TOOLS`), permission filtering flow, `readFileState` isolation

- **[system_reminder_integration.md](./system_reminder_integration.md)** - System reminder propagation to subagents, fork context integration (`buildForkContextMessages`), progress reporting functions (`reportToolProgress`, `updateTaskProgress`), `agent_progress` event flow

- **[compact_integration.md](./compact_integration.md)** - Token counting in subagent loop, compaction trigger in `agentLoopRunner`, `sessionMemoryType` parameter behavior, in-process teammate compaction, file read tracking isolation during compaction

- **[hooks_integration.md](./hooks_integration.md)** - `SubagentStart` hook execution timing, hook cleanup in subagent context, Pre/Post tool hooks within subagent execution, hook context isolation between parent and subagent via AsyncLocalStorage
