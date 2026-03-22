# CLI-Hooks Integration

> How CLI flags `--init`, `--init-only`, and `--maintenance` control hook execution

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks Module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent Loop

Key functions in this document:
- `executeSetupHooks` (Uu8) - Runs Setup hooks with specified trigger - chunks.175.mjs:2650
- `executeSessionStartHooks` (Qu8) - Runs SessionStart lifecycle hooks - chunks.175.mjs:2632
- `executeSubagentStartHooks` (Ux8) - Runs SubagentStart hooks - chunks.175.mjs:2666
- `executePreCompactHooks` (sT6) - Runs PreCompact hooks - chunks.175.mjs:2682
- `HookTrigger` - Enum of hook trigger types (init, maintenance, startup)

---

## Overview

The CLI layer integrates with the hooks system through three hidden flags that control hook execution at startup:

1. **`--init`** - Runs Setup hooks with "init" trigger, then continues to normal session
2. **`--init-only`** - Runs Setup + SessionStart:startup hooks, then exits (no session)
3. **`--maintenance`** - Runs Setup hooks with "maintenance" trigger, then continues

These flags are hidden from `--help` output but provide essential CI/CD and automation integration points.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CLI → HOOKS INTEGRATION PIPELINE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  --init flag     │    │  --init-only      │    │  --maintenance   │     │
│  │  Setup:init      │    │  Setup:init       │    │  Setup:          │     │
│  │  then continue   │    │  SessionStart:    │    │  maintenance     │     │
│  │                  │    │  startup, exit    │    │  then continue   │     │
│  └────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘     │
│           │                        │                       │               │
│           └────────────────────────┼───────────────────────┘               │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │   executeSetupHooks(Uu8)      │                       │
│                    │   Trigger: init/maintenance   │                       │
│                    │   chunks.175.mjs:2650         │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│                          ┌─────────┴─────────┐                            │
│                          │                   │                            │
│                    --init-only              Others                        │
│                          │                   │                            │
│                          ▼                   ▼                            │
│           ┌─────────────────────────┐   ┌─────────────┐                   │
│           │ executeSessionStart     │   │ Continue    │                   │
│           │ Hooks(Qu8)              │   │ to REPL     │                   │
│           │ then exit               │   │             │                   │
│           └─────────────────────────┘   └─────────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. CLI Flag Definitions

### 1.1 Hidden Hook Flags

**Source location:** `chunks.198.mjs:26-27`

```javascript
// ============================================
// Hook-related CLI flag definitions - Hidden from --help
// Location: chunks.198.mjs:26-27
// ============================================

// ORIGINAL (for source lookup):
.addOption(new VK("--init", "Run Setup hooks with init trigger, then continue").hideHelp())
.addOption(new VK("--init-only", "Run Setup and SessionStart:startup hooks, then exit").hideHelp())
.addOption(new VK("--maintenance", "Run Setup hooks with maintenance trigger, then continue").hideHelp())

// READABLE (for understanding):
.addOption(new Option("--init", "Run Setup hooks with init trigger, then continue").hideHelp())
.addOption(new Option("--init-only", "Run Setup and SessionStart:startup hooks, then exit").hideHelp())
.addOption(new Option("--maintenance", "Run Setup hooks with maintenance trigger, then continue").hideHelp())

// Mapping: VK→Option (commander), .hideHelp()→hides from --help output
```

### 1.2 Flag Extraction in Action Handler

**Source location:** `chunks.198.mjs:65-68`

```javascript
// ============================================
// Hook flag extraction - Action handler
// Location: chunks.198.mjs:65-68
// ============================================

// ORIGINAL (for source lookup):
let Q = O.init ?? !1,
    U = O.initOnly ?? !1,
    r = O.maintenance ?? !1

// READABLE (for understanding):
let initFlag = options.init ?? false,
    initOnlyFlag = options.initOnly ?? false,
    maintenanceFlag = options.maintenance ?? false

// Mapping: Q→initFlag, U→initOnlyFlag, r→maintenanceFlag, O→options
```

---

## 2. Hook Execution Functions

### 2.1 executeSetupHooks (Uu8)

**What it does:** Generator function that executes Setup hooks with a specified trigger type. Yields hook execution results for streaming/concurrent processing.

**Source location:** `chunks.175.mjs:2650-2664`

```javascript
// ============================================
// executeSetupHooks - Setup hook execution generator
// Location: chunks.175.mjs:2650-2664
// ============================================

// ORIGINAL (for source lookup):
async function* Uu8(A, q, K = T$, Y) {
    let z = {
        ...$w(void 0),
        hook_event_name: "Setup",
        trigger: A
    };
    yield* Ax({
        hookInput: z,
        toolUseID: CE(),
        matchQuery: A,
        signal: q,
        timeoutMs: K,
        forceSyncExecution: Y
    })
}

// READABLE (for understanding):
async function* executeSetupHooks(trigger, signal, timeoutMs = DEFAULT_TIMEOUT, forceSyncExecution) {
    // Build hook input object
    let hookInput = {
        ...getBaseHookInput(undefined),
        hook_event_name: "Setup",
        trigger: trigger  // "init" or "maintenance"
    };

    // Execute hooks and yield results
    yield* executeHooks({
        hookInput: hookInput,
        toolUseID: generateToolUseID(),
        matchQuery: trigger,
        signal: signal,
        timeoutMs: timeoutMs,
        forceSyncExecution: forceSyncExecution
    });
}

// Mapping: Uu8→executeSetupHooks, A→trigger, q→signal, K→timeoutMs, Y→forceSyncExecution,
//          $w→getBaseHookInput, Ax→executeHooks, CE→generateToolUseID, T$→DEFAULT_TIMEOUT
```

### 2.2 executeSessionStartHooks (Qu8)

**What it does:** Generator function that executes SessionStart lifecycle hooks. Called after Setup hooks in the startup sequence.

**Source location:** `chunks.175.mjs:2632-2648`

```javascript
// ============================================
// executeSessionStartHooks - SessionStart hook execution generator
// Location: chunks.175.mjs:2632-2648
// ============================================

// ORIGINAL (for source lookup):
async function* Qu8(A, q, K, Y, z, _ = T$, w) {
    let O = {
        ...$w(void 0, q),
        hook_event_name: "SessionStart",
        source: A,
        agent_type: K,
        model: Y
    };
    yield* Ax({
        hookInput: O,
        toolUseID: CE(),
        matchQuery: A,
        signal: z,
        timeoutMs: _,
        forceSyncExecution: w
    })
}

// READABLE (for understanding):
async function* executeSessionStartHooks(
    source,
    settings,
    agentType,
    model,
    signal,
    timeoutMs = DEFAULT_TIMEOUT,
    forceSyncExecution
) {
    // Build hook input object
    let hookInput = {
        ...getBaseHookInput(undefined, settings),
        hook_event_name: "SessionStart",
        source: source,        // "startup" or "resume"
        agent_type: agentType, // Current agent type
        model: model           // Current model
    };

    // Execute hooks and yield results
    yield* executeHooks({
        hookInput: hookInput,
        toolUseID: generateToolUseID(),
        matchQuery: source,
        signal: signal,
        timeoutMs: timeoutMs,
        forceSyncExecution: forceSyncExecution
    });
}

// Mapping: Qu8→executeSessionStartHooks, A→source, q→settings, K→agentType, Y→model,
//          z→signal, _→timeoutMs, w→forceSyncExecution, $w→getBaseHookInput,
//          Ax→executeHooks, CE→generateToolUseID, T$→DEFAULT_TIMEOUT
```

### 2.3 executeSubagentStartHooks (Ux8)

**What it does:** Executes SubagentStart hooks when a new subagent is spawned.

**Source location:** `chunks.175.mjs:2666-2680`

```javascript
// ============================================
// executeSubagentStartHooks - SubagentStart hook execution
// Location: chunks.175.mjs:2666-2680
// ============================================

// ORIGINAL (for source lookup):
async function* Ux8(A, q, K, Y = T$) {
    let z = {
        ...$w(void 0),
        hook_event_name: "SubagentStart",
        agent_id: A,
        agent_type: q
    };
    yield* Ax({
        hookInput: z,
        toolUseID: CE(),
        matchQuery: q,
        signal: K,
        timeoutMs: Y
    })
}

// READABLE (for understanding):
async function* executeSubagentStartHooks(agentId, agentType, signal, timeoutMs = DEFAULT_TIMEOUT) {
    let hookInput = {
        ...getBaseHookInput(undefined),
        hook_event_name: "SubagentStart",
        agent_id: agentId,
        agent_type: agentType
    };

    yield* executeHooks({
        hookInput: hookInput,
        toolUseID: generateToolUseID(),
        matchQuery: agentType,
        signal: signal,
        timeoutMs: timeoutMs
    });
}

// Mapping: Ux8→executeSubagentStartHooks, A→agentId, q→agentType, K→signal, Y→timeoutMs
```

### 2.4 executePreCompactHooks (sT6)

**What it does:** Executes PreCompact hooks before context compaction. Returns custom instructions from hook outputs.

**Source location:** `chunks.175.mjs:2682-2710`

```javascript
// ============================================
// executePreCompactHooks - PreCompact hook execution
// Location: chunks.175.mjs:2682-2710
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
async function executePreCompactHooks(compactOptions, signal, timeoutMs = DEFAULT_TIMEOUT) {
    let hookInput = {
        ...getBaseHookInput(undefined),
        hook_event_name: "PreCompact",
        trigger: compactOptions.trigger,
        custom_instructions: compactOptions.customInstructions
    };

    let results = await executeHooksAsync({
        hookInput: hookInput,
        matchQuery: compactOptions.trigger,
        signal: signal,
        timeoutMs: timeoutMs
    });

    if (results.length === 0) return {};

    // Collect custom instructions from successful hooks
    let customInstructions = results
        .filter(r => r.succeeded && r.output.trim().length > 0)
        .map(r => r.output.trim());

    // Build user display messages
    let messages = [];
    for (let result of results) {
        if (result.succeeded) {
            if (result.output.trim()) {
                messages.push(`PreCompact [${result.command}] completed successfully: ${result.output.trim()}`);
            } else {
                messages.push(`PreCompact [${result.command}] completed successfully`);
            }
        } else {
            if (result.output.trim()) {
                messages.push(`PreCompact [${result.command}] failed: ${result.output.trim()}`);
            } else {
                messages.push(`PreCompact [${result.command}] failed`);
            }
        }
    }

    return {
        newCustomInstructions: customInstructions.length > 0 ? customInstructions.join("\n\n") : undefined,
        userDisplayMessage: messages.length > 0 ? messages.join("\n") : undefined
    };
}

// Mapping: sT6→executePreCompactHooks, A→compactOptions, q→signal, K→timeoutMs,
//          $w→getBaseHookInput, RF→executeHooksAsync
```

---

## 3. Hook Execution Flow

### 3.1 Setup Hooks with Triggers

**What it does:** The `--init` and `--maintenance` flags trigger Setup hooks with different trigger types, allowing different hook configurations for initialization vs. maintenance scenarios.

**Trigger Types:**

| Trigger | Flag | Use Case | Hook Event Name |
|---------|------|----------|-----------------|
| `init` | `--init` | First-time project setup, environment initialization | Setup |
| `maintenance` | `--maintenance` | Routine maintenance tasks, cleanup operations | Setup |

### 3.2 Hook Execution Algorithm

**How the hook system processes CLI flags:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HOOK EXECUTION DECISION FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Entry (main)                                                           │
│  │                                                                          │
│  ├─► Parse flags                                                            │
│  │   init = options.init ?? false                                           │
│  │   initOnly = options.initOnly ?? false                                   │
│  │   maintenance = options.maintenance ?? false                             │
│  │                                                                          │
│  ├─► setup() function call                                                  │
│  │   │                                                                      │
│  │   ├─► init flag set?                                                     │
│  │   │   └─► for await (result of executeSetupHooks("init"))               │
│  │   │       → Process each hook result                                     │
│  │   │       → Log output, handle errors                                    │
│  │   │                                                                      │
│  │   ├─► maintenance flag set?                                              │
│  │   │   └─► for await (result of executeSetupHooks("maintenance"))        │
│  │   │       → Process each hook result                                     │
│  │   │       → Log output, handle errors                                    │
│  │   │                                                                      │
│  │   └─► initOnly flag set?                                                 │
│  │       ├─► for await (result of executeSetupHooks("init"))               │
│  │       ├─► for await (result of executeSessionStartHooks("startup"))     │
│  │       └─► process.exit(0)  // Exit without starting session             │
│  │                                                                          │
│  └─► Continue to REPL (if not initOnly)                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Generator-Based Execution Pattern

**Why generators?** Hook execution uses async generators for:

1. **Streaming results** - Each hook result is yielded as it completes
2. **Cancellation support** - The `signal` parameter allows aborting mid-execution
3. **Timeout handling** - Individual hooks can timeout without blocking others
4. **Progress reporting** - UI can show hook progress in real-time

**Execution pattern:**
```javascript
// READABLE (for understanding):
async function runHooksWithProgress(trigger) {
    for await (let result of executeSetupHooks(trigger, abortSignal)) {
        if (result.succeeded) {
            console.log(`Hook succeeded: ${result.command}`);
        } else {
            console.error(`Hook failed: ${result.error}`);
        }
    }
}
```

---

## 4. Deep Algorithm Analysis: Generator Execution Pattern

### 4.1 Why Async Generators Instead of Promises

**What it does:** The hook system uses async generator functions (`async function*`) instead of regular async functions that return arrays. This design choice enables streaming execution.

**How async generators differ from promises:**

```javascript
// ============================================
// Async Generator vs Promise-based Hook Execution
// Conceptual comparison
// ============================================

// ❌ PROMISE-BASED APPROACH (not used):
async function executeHooksPromise(hookConfigs) {
    let results = [];
    for (let config of hookConfigs) {
        let result = await runHook(config);
        results.push(result);
    }
    return results;  // All results returned at once
}

// Caller must wait for ALL hooks to complete:
let allResults = await executeHooksPromise(configs);
// Now process all results...

// ✅ GENERATOR-BASED APPROACH (actual implementation):
async function* executeHooksGenerator(hookConfigs, signal) {
    for (let config of hookConfigs) {
        // Check for abort before each hook
        if (signal?.aborted) break;

        let result = await runHook(config);
        yield result;  // Yield immediately after each hook
    }
}

// Caller processes results as they arrive:
for await (let result of executeHooksGenerator(configs, signal)) {
    // Process this result immediately
    console.log(`Hook completed: ${result.command}`);
}
```

**Why this matters:**

| Aspect | Promise-based | Generator-based |
|--------|---------------|-----------------|
| Result availability | All at once | One at a time |
| Cancellation | Must cancel all | Can cancel between hooks |
| Progress reporting | Only after completion | Real-time per hook |
| Memory usage | Accumulates all results | Streams results |
| Error handling | One error stops all | Can skip failed hooks |

### 4.2 Yield Delegation Pattern

**What `yield*` does:** The `yield*` operator delegates to another generator, effectively flattening nested yields.

```javascript
// ============================================
// yield* Delegation Pattern
// Location: chunks.175.mjs:2650-2664 (inside executeSetupHooks)
// ============================================

// ORIGINAL (for source lookup):
async function* Uu8(A, q, K = T$, Y) {
    let z = {
        ...$w(void 0),
        hook_event_name: "Setup",
        trigger: A
    };
    yield* Ax({
        hookInput: z,
        toolUseID: CE(),
        matchQuery: A,
        signal: q,
        timeoutMs: K,
        forceSyncExecution: Y
    })
}

// READABLE (for understanding):
async function* executeSetupHooks(trigger, signal, timeoutMs = DEFAULT_TIMEOUT, forceSyncExecution) {
    let hookInput = {
        ...getBaseHookInput(undefined),
        hook_event_name: "Setup",
        trigger: trigger
    };

    // yield* delegates to the inner generator
    // All values yielded by executeHooks() are passed through
    yield* executeHooks({
        hookInput: hookInput,
        toolUseID: generateToolUseID(),
        matchQuery: trigger,
        signal: signal,
        timeoutMs: timeoutMs,
        forceSyncExecution: forceSyncExecution
    });
}

// What happens conceptually:
// executeHooks() yields: result1, result2, result3
// executeSetupHooks() passes through: result1, result2, result3
// Caller receives: result1, result2, result3
```

**Why `yield*` instead of `yield`:**

```javascript
// ❌ WRONG: yield would wrap the generator in a Promise
yield executeHooks({...});  // Yields a Promise<Generator>

// ✅ CORRECT: yield* delegates to the inner generator
yield* executeHooks({...});  // Yields each value from inner generator
```

### 4.3 For-Await-Of Consumption Pattern

**How callers consume hook results:**

```javascript
// ============================================
// for-await-of Hook Consumption Pattern
// Location: chunks.148.mjs (action handler hook invocation)
// ============================================

// READABLE (for understanding):
async function processInitHooks(initFlag, signal) {
    if (!initFlag) return;

    let hookResults = [];

    // The for-await-of loop:
    // 1. Calls the generator
    // 2. Awaits each yielded promise
    // 3. Assigns result to variable
    // 4. Continues until generator returns
    for await (let hookResult of executeSetupHooks("init", signal)) {
        // Process this hook result immediately
        if (hookResult.succeeded) {
            console.log(`✓ ${hookResult.command}: ${hookResult.output}`);
            hookResults.push(hookResult);
        } else {
            console.error(`✗ ${hookResult.command}: ${hookResult.error}`);
            // Can choose to continue or break based on error
        }

        // Check for user cancellation
        if (signal?.aborted) {
            console.log("Hook execution cancelled");
            break;
        }
    }

    return hookResults;
}
```

**The execution flow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GENERATOR EXECUTION FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Caller (for await...of)                                                    │
│  │                                                                          │
│  │  for await (result of executeSetupHooks("init", signal))                │
│  │      │                                                                   │
│  │      │  ◄── Request next value                                          │
│  │      │                                                                   │
│  │      ▼                                                                   │
│  │  executeSetupHooks generator                                            │
│  │      │                                                                   │
│  │      │  yield* executeHooks({...})                                       │
│  │      │      │                                                            │
│  │      │      ▼                                                            │
│  │      │  executeHooks generator                                          │
│  │      │      │                                                            │
│  │      │      ├─► Run hook 1                                               │
│  │      │      │   await runCommand(hook1)                                  │
│  │      │      │   yield { succeeded: true, output: "..." }                 │
│  │      │      │       │                                                    │
│  │      │      │       └───────► Caller receives result 1                   │
│  │      │      │                   console.log(result)                      │
│  │      │      │                   (continues loop)                         │
│  │      │      │                                                            │
│  │      │      ├─► Run hook 2                                               │
│  │      │      │   await runCommand(hook2)                                  │
│  │      │      │   yield { succeeded: false, error: "..." }                 │
│  │      │      │       │                                                    │
│  │      │      │       └───────► Caller receives result 2                   │
│  │      │      │                   console.error(result.error)              │
│  │      │      │                                                            │
│  │      │      └─► return (no more hooks)                                   │
│  │      │                                                                   │
│  │      └─► return (generator complete)                                     │
│  │                                                                          │
│  └─► Loop exits, continue with session                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 AbortSignal Integration

**How cancellation works:**

```javascript
// ============================================
// AbortSignal Integration in Hook Execution
// Location: chunks.175.mjs (inside executeHooks)
// ============================================

// READABLE (for understanding):
async function* executeHooks({ hookInput, signal, ...options }) {
    let hookConfigs = getMatchingHookConfigs(hookInput);

    for (let config of hookConfigs) {
        // CHECK ABORT BEFORE EACH HOOK
        if (signal?.aborted) {
            // Generator returns early, stopping iteration
            return;
        }

        try {
            let result = await runHookCommand(config, {
                // PASS SIGNAL TO HOOK RUNNER
                signal: signal,  // Hook process can be killed

                // TIMEOUT HANDLING
                timeout: options.timeoutMs
            });

            yield result;

        } catch (error) {
            // Check if error was due to abort
            if (error.name === 'AbortError') {
                return;  // Exit generator gracefully
            }

            yield {
                succeeded: false,
                command: config.command,
                error: error.message
            };
        }
    }
}
```

**Key insight:** The generator pattern enables graceful cancellation because:
1. The `signal.aborted` check happens between yields
2. No hooks are "in flight" when checking
3. The generator can return early without throwing
4. The consumer's loop naturally exits when generator returns

### 4.5 Trade-offs: Generator vs Other Patterns

| Pattern | Pros | Cons |
|---------|------|------|
| **Async Generator** (chosen) | Streaming results, easy cancellation, real-time progress | Requires for-await-of understanding |
| Promise.all() | Parallel execution, simple API | No streaming, can't cancel mid-flight |
| Observable (RxJS) | Rich operators, backpressure | External dependency, steeper learning curve |
| Callback-based | Maximum flexibility | Callback hell, harder to compose |

**Why generators were chosen:**
- Native JavaScript feature (no dependencies)
- Natural fit for sequential hook execution
- Built-in async/await integration
- Easy to understand for developers familiar with iterators
- Enables both sync and async consumption patterns

---

## 4. Hook Configuration Schema

### 4.1 Setup Hook Configuration

```json
{
  "hooks": {
    "Setup": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "npm install",
            "trigger": "init"
          },
          {
            "type": "command",
            "command": "npm run clean-cache",
            "trigger": "maintenance"
          }
        ]
      }
    ]
  }
}
```

### 4.2 SessionStart Hook Configuration

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Session starting'",
            "trigger": "startup"
          }
        ]
      }
    ]
  }
}
```

---

## 5. Error Handling

### 5.1 Hook Failure Behavior

| Flag | On Hook Failure |
|------|-----------------|
| `--init` | Log error, continue to session |
| `--maintenance` | Log error, continue to session |
| `--init-only` | Log error, exit with error code |

### 5.2 Timeout Handling

**Source location:** `chunks.175.mjs` (T$ constant)

The default timeout (`T$`) controls how long each hook can run before being terminated. This prevents runaway hooks from blocking the CLI indefinitely.

---

## 6. Use Cases

### 6.1 CI/CD Integration

```bash
# Run initialization hooks before starting session
claude --init -p "Review the codebase"

# Run maintenance hooks for cleanup
claude --maintenance -p "Generate documentation"
```

### 6.2 Setup-Only Mode

```bash
# Run setup hooks and exit - useful for CI pipelines
claude --init-only

# Typical output:
# - Runs Setup:init hooks
# - Runs SessionStart:startup hooks
# - Exits without starting interactive session
```

### 6.3 Hook Configuration Example

```json
{
  "hooks": {
    "Setup": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "npm install",
            "trigger": "init"
          },
          {
            "type": "command",
            "command": "npm run clean-cache",
            "trigger": "maintenance"
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Session starting'",
            "trigger": "startup"
          }
        ]
      }
    ]
  }
}
```

---

## 7. Integration with Other Systems

### 7.1 Permission Mode Interaction

Hook flags can be combined with permission mode flags:

```bash
# Run init hooks with bypass permissions
claude --init --dangerously-skip-permissions -p "Setup project"

# Run maintenance with plan mode
claude --maintenance --permission-mode plan
```

### 7.2 Print Mode Integration

Hook flags work with print mode for non-interactive execution:

```bash
# Initialize and run a prompt
claude --init -p "Analyze the project structure"

# Maintenance and analyze
claude --maintenance -p "Generate code coverage report"
```

---

## 8. Flag Combination Rules

### 8.1 Valid Combinations

| Combination | Allowed | Behavior |
|-------------|---------|----------|
| `--init` alone | Yes | Run init hooks, continue to session |
| `--maintenance` alone | Yes | Run maintenance hooks, continue to session |
| `--init-only` alone | Yes | Run init + startup hooks, exit |
| `--init` + `--maintenance` | Not validated | Processed in order (init first) |
| `--init` + `--init-only` | Not validated | Redundant, use `--init-only` only |

### 8.2 Validation Status

The CLI does not explicitly validate these combinations. If both are specified, the behavior depends on the order of processing in `setup()`.

---

## 9. Debugging Hook Execution

### 9.1 Enable Debug Output

```bash
# See hook execution details
claude --debug hooks --init

# Debug output includes:
# - Which hooks are being executed
# - Command output from hook scripts
# - Execution timing
# - Any errors or failures
```

### 9.2 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Hooks not running | No hooks configured | Check settings.json for hook definitions |
| Hook fails silently | Non-zero exit code | Check debug output for error details |
| Wrong trigger type | Mismatch in config | Verify trigger field matches flag |
| Timeout | Hook runs too long | Increase timeout in hook config |

---

## 10. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Flag definitions | `chunks.198.mjs:26` | Commander hidden options |
| Flag extraction | `chunks.198.mjs:65` | Action handler destructuring |
| Setup hooks execution | `chunks.175.mjs:2650` | `executeSetupHooks` (Uu8) |
| Session start hooks | `chunks.175.mjs:2632` | `executeSessionStartHooks` (Qu8) |
| Subagent start hooks | `chunks.175.mjs:2666` | `executeSubagentStartHooks` (Ux8) |
| PreCompact hooks | `chunks.175.mjs:2682` | `executePreCompactHooks` (sT6) |
| Hook trigger types | `chunks.131.mjs:2390` | init, maintenance, startup |