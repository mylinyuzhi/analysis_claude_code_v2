# Hooks System & Lifecycle Integration

## Overview

The **Hooks System** provides lifecycle integration points for compaction, allowing users to inject custom behavior at critical stages: **before compaction begins** (PreCompact) and **after compaction completes** (SessionStart). Hooks can modify compaction behavior (add custom instructions), provide user feedback (display messages), or perform cleanup/initialization tasks.

Hooks are implemented as **callback functions** or **shell commands** registered in `~/.claude/hooks.json`. During compaction, the system executes matching hooks synchronously, collects their outputs, and integrates results back into the compaction process.

**Key characteristics:**
- **Three hook points**: PreCompact (before summarization), PostCompact (after compaction), and SessionStart (after compaction)
- **Custom instructions injection**: PreCompact hooks can add instructions to summary request
- **Post-compaction notifications**: PostCompact hooks receive compaction results and can perform cleanup/logging
- **User feedback**: Hooks can return display messages shown to user
- **Timeout protection**: Default 10-minute timeout prevents hanging
- **Async execution**: Hooks run concurrently via `Promise.all()`
- **Graceful failure**: Hook errors don't crash compaction

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `executePreCompactHooks` (sT6) - Executes PreCompact hooks with trigger and custom instructions
- `executePostCompactHooks` (FE1) - Executes PostCompact hooks after compaction completes
- `executeSessionStartHooks` (Qu8) - Executes SessionStart hooks after compaction completes
- `executeHooksOutsideREPL` (RF) - Core hook execution engine (callback, command, agent, prompt types)
- `createHookContext` ($w) - Builds hook context object (session ID, transcript path, cwd)

Constants:
- `DEFAULT_HOOK_TIMEOUT` (T$) - 600,000 ms (10 minutes)

---

## Architecture: Hook Lifecycle

### Compaction Hook Flow

```
performFullCompaction()
│
├─[Phase 2] Pre-Compact Hooks
│   ├─ executePreCompactHooks({ trigger: "auto"|"manual", customInstructions })
│   ├─ Hook execution:
│   │   ├─ Find matching "PreCompact" hooks in registry
│   │   ├─ Execute all hooks concurrently
│   │   ├─ Collect outputs (custom instructions + display messages)
│   │   └─ Return { newCustomInstructions, userDisplayMessage }
│   └─ Merge newCustomInstructions into existing customInstructions
│
├─[Phase 3-4] LLM Summary Generation + State Collection
│   └─ (hooks don't run here)
│
├─[Phase 5] Post-Compact Hooks
│   ├─ executePostCompactHooks({ trigger: "auto"|"manual", success: true|false, summary: string })
│   ├─ Hook execution:
│   │   ├─ Find matching "PostCompact" hooks in registry
│   │   ├─ Execute all hooks concurrently (fire-and-forget, no required output)
│   │   └─ Hooks can perform cleanup, logging, or post-compaction tasks
│   └─ Continue regardless of hook results (errors don't block)
│
└─[Phase 6] Session Start Hooks
    ├─ executeSessionStartHooks("compact", { model })
    ├─ Hook execution:
    │   ├─ Find matching "SessionStart" hooks in registry
    │   ├─ Execute all hooks concurrently
    │   ├─ Collect additional context messages
    │   └─ Return array of hook result messages
    └─ Include results in compaction result
```

**Key insight:** PreCompact hooks can **modify** compaction behavior (via custom instructions), while SessionStart hooks can only **observe and log** (via additional context messages).

---

## Core Algorithms

### 1. Pre-Compact Hook Execution

**Function:** `executePreCompactHooks` (sT6)
**Location:** chunks.175.mjs:2682-2711
**Purpose:** Executes PreCompact hooks to gather custom instructions and user feedback before compaction

#### What it does

Calls all registered PreCompact hooks with trigger type and custom instructions, collects their outputs, and returns merged custom instructions and user display message.

#### How it works

**Step-by-step algorithm:**

1. **Build hook input**: Create `hookInput` object:
   ```javascript
   {
       ...createHookContext(undefined),  // session_id, transcript_path, cwd, permission_mode
       hook_event_name: "PreCompact",
       trigger: "auto" | "manual",
       custom_instructions: string | null
   }
   ```

2. **Execute hooks**: Call `executeHooksOutsideREPL()`:
   - `hookInput`: Input object from step 1
   - `matchQuery`: `trigger` value (allows hooks to match on "auto" vs "manual")
   - `signal`: Abort signal for cancellation
   - `timeoutMs`: Default 600000ms (10 minutes)

3. **Process results**:
   - `results` = array of `{ command, succeeded, output }` objects
   - Filter for successful hooks with non-empty output: `succeeded === true AND output.trim().length > 0`
   - Extract `output` strings from successful hooks → `customInstructionsArray`

4. **Build user display messages**:
   - `displayMessages = []`
   - For each hook result:
     - If `succeeded === true`:
       - If `output.trim()` non-empty: Add `"PreCompact [{command}] completed successfully: {output}"`
       - Otherwise: Add `"PreCompact [{command}] completed successfully"`
     - If `succeeded === false`:
       - If `output.trim()` non-empty: Add `"PreCompact [{command}] failed: {output}"`
       - Otherwise: Add `"PreCompact [{command}] failed"`

5. **Return**:
   ```javascript
   {
       newCustomInstructions: customInstructionsArray.length > 0
           ? customInstructionsArray.join("\n\n")
           : undefined,
       userDisplayMessage: displayMessages.length > 0
           ? displayMessages.join("\n")
           : undefined
   }
   ```

**Edge cases:**
- **No hooks registered**: Returns `{}` (empty object)
- **All hooks fail**: `newCustomInstructions` undefined, `userDisplayMessage` contains failure messages
- **Empty hook outputs**: Skipped in custom instructions, but logged in display message

#### Why this approach

**Design rationale:**

1. **Merge multiple hook outputs**: Joins custom instructions with `\n\n` separator
   - **Flexibility**: Multiple hooks can each contribute instructions
   - **Clarity**: Double newline separates different hook contributions

2. **User display message**: Provides transparency about hook execution
   - **Debugging**: User can see which hooks ran and succeeded/failed
   - **Trust**: Clear communication builds confidence in automation

3. **Match query by trigger**: Allows hooks to opt-in to auto vs manual compaction
   - **Precision**: Hook can specify `"PreCompact:auto"` to only run on auto-trigger
   - **Control**: User can define different behavior for manual compaction

**Trade-offs:**

- **Synchronous execution**: Hooks block compaction until complete (timeout protects against hanging)
- **String concatenation**: Simple but may not handle conflicts (e.g., contradictory instructions)

#### Key insight

PreCompact hooks enable **user-controlled compaction customization** without modifying core code, supporting use cases like:
- Adding project-specific context to summary ("Focus on database schema changes")
- Injecting warnings ("Large refactor in progress, preserve detailed context")
- Conditional behavior ("If auto-trigger, summarize aggressively; if manual, preserve details")

#### Code Snippet

```javascript
// ============================================
// executePreCompactHooks - Execute PreCompact hooks for custom instructions
// Location: chunks.175.mjs:2682-2711
// ============================================

// ORIGINAL (for source lookup):
async function sT6(A, q, K = T$) {
    let Y = {
            ...$w(void 0),
            hook_event_name: "PreCompact",
            trigger: A.trigger,
            custom_instructions: A.customInstructions
        },
        z = await RF({
            hookInput: Y,
            matchQuery: A.trigger,
            signal: q,
            timeoutMs: K
        });
    if (z.length === 0) return {};
    let _ = z.filter((O) => O.succeeded && O.output.trim().length > 0).map((O) => O.output.trim()),
        w = [];
    for (let O of z)
        if (O.succeeded)
            if (O.output.trim()) w.push(`PreCompact [${O.command}] completed successfully: ${O.output.trim()}`);
            else w.push(`PreCompact [${O.command}] completed successfully`);
    else if (O.output.trim()) w.push(`PreCompact [${O.command}] failed: ${O.output.trim()}`);
    else w.push(`PreCompact [${O.command}] failed`);
    return {
        newCustomInstructions: _.length > 0 ? _.join("\n\n") : void 0,
        userDisplayMessage: w.length > 0 ? w.join("\n") : void 0
    }
}

// READABLE (for understanding):
async function executePreCompactHooks(input, signal, timeoutMs = DEFAULT_HOOK_TIMEOUT) {
    // Build hook input with context
    let hookInput = {
        ...createHookContext(undefined),
        hook_event_name: "PreCompact",
        trigger: input.trigger,  // "auto" or "manual"
        custom_instructions: input.customInstructions
    };

    // Execute all matching hooks
    let results = await executeHooksOutsideREPL({
        hookInput,
        matchQuery: input.trigger,  // Allows hooks to match on trigger type
        signal,
        timeoutMs
    });

    if (results.length === 0) return {};

    // Extract custom instructions from successful hooks
    let customInstructionsArray = results
        .filter((r) => r.succeeded && r.output.trim().length > 0)
        .map((r) => r.output.trim());

    // Build user display messages
    let displayMessages = [];
    for (let result of results) {
        if (result.succeeded) {
            if (result.output.trim()) {
                displayMessages.push(`PreCompact [${result.command}] completed successfully: ${result.output.trim()}`);
            } else {
                displayMessages.push(`PreCompact [${result.command}] completed successfully`);
            }
        } else {
            if (result.output.trim()) {
                displayMessages.push(`PreCompact [${result.command}] failed: ${result.output.trim()}`);
            } else {
                displayMessages.push(`PreCompact [${result.command}] failed`);
            }
        }
    }

    return {
        newCustomInstructions: customInstructionsArray.length > 0
            ? customInstructionsArray.join("\n\n")
            : undefined,
        userDisplayMessage: displayMessages.length > 0
            ? displayMessages.join("\n")
            : undefined
    };
}

// Mapping: sT6→executePreCompactHooks, A→input, q→signal, K→timeoutMs, T$→DEFAULT_HOOK_TIMEOUT, $w→createHookContext, RF→executeHooksOutsideREPL, Y→hookInput, z→results, _→customInstructionsArray, w→displayMessages, O→result
```

---

### 2. Session Start Hook Execution

**Function:** `executeSessionStartHooks` (Qu8)
**Location:** chunks.175.mjs:2632
**Purpose:** Executes SessionStart hooks after compaction to perform initialization/cleanup tasks

#### What it does

Calls all registered SessionStart hooks with source, agent type, and model information, collects additional context messages, and returns attachment messages for injection into conversation.

#### How it works

**Step-by-step algorithm:**

1. **Initialize collectors**:
   - `messages = []` - Hook result messages
   - `additionalContexts = []` - Additional context strings

2. **Plugin hook loading** (lines 256-272):
   - Try to load plugin hooks via `loadPluginHooks()`
   - If loading fails:
     - Log error with detailed diagnostics (network, permissions, configuration issues)
     - Log warning message but continue execution

3. **Determine agent type**: `agentType = agentType ?? getDefaultAgentType()`

4. **Execute SessionStart hooks**:
   - Iterate over `executeSessionStartGenerator()` async generator
   - For each yielded result:
     - If `result.message` exists, push to `messages` array
     - If `result.additionalContexts` exists and non-empty, push all to `additionalContexts` array

5. **Create additional context attachment** (if any contexts collected):
   - If `additionalContexts.length > 0`:
     - Create attachment message:
       ```javascript
       {
           type: "hook_additional_context",
           content: additionalContexts,
           hookName: "SessionStart",
           toolUseID: "SessionStart",
           hookEvent: "SessionStart"
       }
       ```
     - Push to `messages` array

6. **Return** `messages` array

**Edge cases:**
- **Plugin loading fails**: Logs warning, continues with managed hooks only
- **No hooks registered**: Returns empty array
- **All hooks fail**: Returns empty array (failure messages not included in SessionStart)

#### Why this approach

**Design rationale:**

1. **Post-compaction timing**: Runs after summary generated and state collected
   - **Clean slate**: New "session" begins with fresh context
   - **Initialization**: Hooks can set up state for next conversation phase

2. **Additional context injection**: Allows hooks to add context without modifying summary
   - **Separation of concerns**: Summary reflects conversation; additional context reflects environment/state
   - **Example use case**: "Current git branch: main, last commit: abc123"

3. **Generator pattern**: Uses async generator for streaming results
   - **Memory efficiency**: Doesn't load all hook results into memory at once
   - **Responsiveness**: Can yield results as soon as each hook completes

**Trade-offs:**

- **No custom instructions**: SessionStart hooks can't modify compaction (already complete)
- **Limited feedback**: Failure messages not shown to user (only logged)

#### Key insight

SessionStart hooks implement the **session initialization pattern** - after compaction creates a clean slate, hooks can set up new session state (environment variables, file watchers, logging, etc.).

---

### 3. Core Hook Execution Engine

**Function:** `executeHooksOutsideREPL` (AyA)
**Location:** chunks.141.mjs:2691-2770
**Purpose:** Executes hooks of various types (callback, command, prompt, agent) with timeout and error handling

#### What it does

Executes all registered hooks matching the event name and query, handling different hook types (callback, command, prompt, agent, function) and returning success/failure results.

#### How it works

**High-level algorithm:**

1. **Validate execution**:
   - Check `disableAllHooks` setting → Skip if disabled
   - Check workspace trust → Skip if not trusted

2. **Find matching hooks**:
   - Get app state (if accessor provided)
   - Find hooks matching `hook_event_name` and `matchQuery`
   - Return empty array if no matches

3. **Log telemetry**: Report `tengu_run_hook` event with hook count

4. **Execute hooks concurrently**:
   - Map each hook to async execution function
   - For **callback hooks**:
     - Create timeout signal (hook.timeout or default 10 minutes)
     - Call `hook.callback(hookInput, toolUseID, signal, index)`
     - Return `{ command: "callback", succeeded: true/false, output: systemMessage }`
   - For **prompt/agent/function hooks**:
     - Return error (not supported outside REPL)
   - Use `Promise.all()` to execute all hooks in parallel

5. **Return results**: Array of `{ command, succeeded, output }` objects

**Edge cases:**
- **Callback throws error**: Caught, returns `{ succeeded: false, output: errorMessage }`
- **Timeout exceeded**: Abort signal triggers, throws error caught in step above
- **Hook returns async response**: Logged, returns empty output

#### Key insight

The hook execution engine implements a **plugin architecture** that supports multiple hook types while maintaining safety (timeouts, error handling) and performance (parallel execution).

---

## Integration Points

### 1. Standard Compaction Integration

**Location:** `performFullCompaction()` Phase 2 and Phase 5

**PreCompact integration:**
```javascript
// Phase 2: Before LLM summarization
let preCompactResults = await executePreCompactHooks({
    trigger: isAutoTrigger ? "auto" : "manual",
    customInstructions: customInstructions ?? null
}, abortSignal);

if (preCompactResults.newCustomInstructions) {
    customInstructions = customInstructions
        ? `${customInstructions}\n\n${preCompactResults.newCustomInstructions}`
        : preCompactResults.newCustomInstructions;
}

let userDisplayMessage = preCompactResults.userDisplayMessage;
```

**SessionStart integration:**
```javascript
// Phase 5: After state collection
let sessionStartHookResults = await executeSessionStartHooks("compact", {
    model: context.options.mainLoopModel
});

// Include in compaction result
return {
    ...result,
    hookResults: sessionStartHookResults,
    userDisplayMessage: userDisplayMessage
};
```

### 2. Session Memory Compaction Integration

**Location:** `performSessionMemoryCompaction()` - Only uses SessionStart hooks

**Why no PreCompact?** Session memory compaction doesn't call LLM for summarization, so custom instructions have no effect. PreCompact hooks are skipped to reduce latency.

### 3. Hook Registry

**Location:** `~/.claude/hooks.json`

**Schema:**
```json
{
  "hooks": [
    {
      "event": "PreCompact",
      "match": "auto",  // Optional: "auto", "manual", or omit for all
      "type": "callback",
      "callback": "function(hookInput, toolUseID, signal, index) { ... }"
    },
    {
      "event": "SessionStart",
      "type": "command",
      "command": "echo 'Session started'"
    }
  ]
}
```

---

## Hook Input Schema

### PreCompact Hook Input

```javascript
{
    session_id: string,
    transcript_path: string,
    cwd: string,
    permission_mode: string | undefined,
    hook_event_name: "PreCompact",
    trigger: "auto" | "manual",
    custom_instructions: string | null
}
```

### SessionStart Hook Input

```javascript
{
    session_id: string,
    transcript_path: string,
    cwd: string,
    permission_mode: string | undefined,
    hook_event_name: "SessionStart",
    source: string,  // "compact"
    agent_type: string,
    model: string
}
```

---

## Hook Output Schema

### PreCompact Hook Output

**String output (simple):**
```
Custom instructions text here
```

**JSON output (structured):**
```json
{
    "systemMessage": "Custom instructions text",
    "suppressOutput": false
}
```

**Behavior:**
- Output trimmed and used as custom instructions
- Multiple hooks: Outputs joined with `\n\n`

### SessionStart Hook Output

**JSON output:**
```json
{
    "additionalContext": "Environment info: Node v20.0.0, Git branch: main"
}
```

**Behavior:**
- `additionalContext` collected into array
- All contexts wrapped in single attachment message

---

## Error Handling

### Hook Timeout

**Scenario:** Hook execution exceeds timeout (default 10 minutes)
**Detection:** Abort signal triggers after timeout
**Handling:** Exception caught, returns `{ succeeded: false, output: timeoutError }`
**Impact:** Other hooks continue executing, compaction proceeds

### Hook Throws Exception

**Scenario:** Callback function throws error
**Detection:** Try-catch around hook execution
**Handling:** Returns `{ succeeded: false, output: errorMessage }`
**Impact:** Logged as failure in user display message

### All Hooks Fail

**Scenario:** Every hook returns `succeeded: false`
**Detection:** Filter for successful results returns empty array
**Handling:**
- PreCompact: `newCustomInstructions` undefined (no modification)
- SessionStart: No additional context attached
**Impact:** Compaction continues with default behavior

### Plugin Loading Fails

**Scenario:** `loadPluginHooks()` throws error (network, permissions, parse error)
**Detection:** Try-catch in `executeSessionStartHooks()`
**Handling:**
- Log detailed error diagnostic
- Continue execution with managed hooks only
**Impact:** Plugin hooks skipped, managed hooks still execute

---

## Performance Considerations

### Hook Concurrency

**Optimization:** All hooks execute in parallel via `Promise.all()`
**Impact:** 3 hooks @ 100ms each = ~100ms total (not 300ms)
**Trade-off:** Hooks can't depend on each other's outputs

### Timeout Protection

**Problem:** Hanging hook could block compaction indefinitely
**Solution:** Default 10-minute timeout with abort signal
**Impact:** Maximum 10-minute delay per hook batch

### PreCompact Latency

**Problem:** PreCompact hooks add latency before LLM call
**Mitigation:** Session memory compaction skips PreCompact (no LLM call = no custom instructions needed)
**Impact:** Standard compaction: +100-500ms; Session memory: +0ms

---

## Design Rationale Summary

### Why Two Hook Types?

**PreCompact:** Modifies compaction behavior
**SessionStart:** Observes and initializes

**Alternative:** Single "Compact" hook - Rejected because conflates two different use cases

### Why Async Generators for SessionStart?

**Benefits:**
- Stream results incrementally
- Memory efficient for large hook outputs
- Early termination possible

**Trade-off:** More complex API, but worth it for streaming

### Why Default 10 Minute Timeout?

**Rationale:**
- Long enough for complex operations (build processes, large file operations, network requests)
- Allows hooks to perform significant work without premature timeout
- Can be overridden per-hook for shorter or longer durations

---

## Symbol Updates

The following symbols should be added to `symbol_index_core_features.md` under **Module: Hooks > Compaction Hooks**:

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| mW6 | executePreCompactHooks | chunks.141.mjs:3011 | function |
| PP | executeSessionStartHooks | chunks.142.mjs:248 | function |
| $yA | executeSessionStartGenerator | chunks.141.mjs:2961 | function |
| AyA | executeHooksOutsideREPL | chunks.141.mjs:2691 | function |
| aX | createHookContext | chunks.141.mjs:1770 | function |
| Wi4 | parseHookOutput | chunks.141.mjs:1780 | function |
| MP | DEFAULT_HOOK_TIMEOUT | chunks.142.mjs:215 | constant (600000 = 10 minutes) |

---

## Conclusion

The Hooks System provides **lifecycle integration points** for compaction, enabling users to customize behavior (PreCompact) and perform initialization tasks (SessionStart). By supporting multiple hook types (callback, command), timeouts, parallel execution, and graceful error handling, the system balances flexibility with safety.

**Key takeaways:**
1. **Three hook points**: PreCompact (modify), PostCompact (notify), and SessionStart (observe)
2. **Custom instructions injection**: PreCompact hooks can augment summary prompt
3. **Post-compaction notifications**: PostCompact hooks receive compaction results for logging/cleanup
4. **Parallel execution**: All hooks run concurrently for performance
5. **Timeout protection**: Default 10 minutes prevents hanging
6. **Graceful failure**: Hook errors don't crash compaction

This architecture enables **extensible compaction** - users can customize behavior without modifying core Claude Code source.
