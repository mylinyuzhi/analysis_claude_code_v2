# Implementation Report - Hook System (Module 11)

## Overview

The Hook System is Claude Code's event-driven extension framework. It intercepts 15 distinct lifecycle moments, dispatches user-configured handlers (shell commands, LLM prompts, sub-agents, in-process callbacks, or function hooks), and feeds the results back into the main agent loop to control behavior: blocking tool calls, modifying inputs, injecting context, or forcing the model to continue working.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

**Cross-references:**
- [10_skill_system/skill_context_modifier.md](../10_skill_system/skill_context_modifier.md#hook-registration) - Skill hook registration via `registerSkillHooks` (IM6)

Key functions in this document:
- `executeHooksIterator` (NI) - Central async generator that executes all matched hooks for an event
- `resolveHooksForEvent` (oRA) - Filters and deduplicates hooks from all sources for a given event
- `mergeHookSources` (JhY) - Loads and merges hook configs from policy, plugin, user/project settings
- `executeCommandHook` (BW6) - Shell command hook executor with async backgrounding support
- `executeAgentHook` (Xi4) - Sub-agent hook that runs a full LLM agent to verify a stop condition
- `executePromptHook` (Pn7) - Sends a structured prompt to the LLM to evaluate a condition
- `executeCallbackHook` (DhY) - Runs in-process callback hooks (from plugins)
- `executeFunctionHook` (XhY) - Runs function-type hooks (REPL-only, Stop hooks)
- `executeHooksOutsideREPL` (AyA) - Parallel hook executor for non-streaming contexts
- `parseHookOutput` (Wi4) - Parses hook stdout as JSON or plain text
- `processHookJsonOutput` (Gi4) - Maps JSON output fields to permission decisions, context injections, etc.
- `registerAsyncHook` ($n7) - Registers a backgrounded hook process in the async registry
- `checkAsyncHookResponses` (Jn7) - Polls background hook registry for completed hooks
- `mergeAsyncGenerators` (_J6) - Concurrent iterator merger for parallel hook execution
- `combineAbortSignals` (fR) - Merges timeout + parent abort signals into one
- `matchesHookMatcher` (_hY) - Tests if a query string matches a hook's matcher pattern
- `isAsyncHookResponse` (SK1) - Detects `{"async": true}` in hook JSON output
- `notifyHookStart` (Hn7) - Emits hook start event for remote streaming
- `logHookCompletion` (Ch) - Logs hook output and emits completion event for remote streaming
- `hookProgressPoller` (HJ6) - Streams hook stdout to remote clients during execution
- `getStructuredOutputTool` (jn7) - Returns the structured-output tool used by agent hooks
- `interpolateHookPrompt` (XJ6) - Interpolates `${VAR}` in hook prompt strings
- `buildBasePayload` (aX) - Constructs the common base payload for every hook event
- `HOOK_EVENT_NAMES` (tGY) - Canonical list of all 15 event names
- `DEFAULT_HOOK_TIMEOUT` (MP) - Default timeout: **600,000ms (10 minutes)**
- `HOOK_BLOCKED_TOOLS` (Bj1) - Set of tool names blocked from agent hooks

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Hook System Architecture                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Event Triggers (15 events)                                      │
│  ─────────────────────────                                       │
│  PreToolUse → executePreToolHooks (qyA) ──────┐                  │
│  PostToolUse → executePostToolHooks (KyA) ────┤                  │
│  PostToolUseFailure → (YyA) ──────────────────┤                  │
│  Stop / SubagentStop → executeStopHooks (zyA) ┤                  │
│  UserPromptSubmit → (HyA) ────────────────────┤ yield*           │
│  SessionStart → ($yA) ────────────────────────┤ → NI             │
│  SubagentStart → (AEA) ───────────────────────┤    (executeHooks │
│  TeammateIdle → (wyA) ────────────────────────┤     Iterator)    │
│  TaskCompleted → (Cg1) ───────────────────────┤                  │
│  Setup → (OyA) ───────────────────────────────┘                  │
│                                                                   │
│  Notification → (UTA) ─────────────────────────→ AyA             │
│  PreCompact → (mW6) ───────────────────────────→ AyA             │
│  SessionEnd → (SessionEndHook) ────────────────→ AyA             │
│  PermissionRequest → (PermissionRequestHook) ──→ AyA             │
│                                                                   │
│  NI (executeHooksIterator):                                      │
│  1. JhY (mergeHookSources) → get all registered hooks            │
│  2. oRA (resolveHooksForEvent) → filter + dedup by event/matcher │
│  3. _J6 (mergeAsyncGenerators) → run all hook types concurrently │
│     ├── command → BW6 (executeCommandHook)                       │
│     ├── agent → Xi4 (executeAgentHook)                           │
│     ├── prompt → Pn7 (executePromptHook)                         │
│     ├── callback → DhY (executeCallbackHook)                     │
│     └── function → XhY (executeFunctionHook) [REPL only]        │
│  4. Aggregate results → yield structured outputs upstream        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Algorithms

### Algorithm 1: Hook Source Merging (`JhY` / `mergeHookSources`)

**What it does:** Collects hooks from all possible sources and merges them into a unified map keyed by event name.

**How it works:**

```javascript
// ============================================
// mergeHookSources - Merge hooks from all configuration sources
// Location: chunks.141.mjs:2104-2137
// ============================================

// ORIGINAL (for source lookup):
function JhY(A, q) {
    let K = {},
        Y = Uk7();
    if (Y)
        for (let [H, $] of Object.entries(Y)) K[H] = $.map((O) => ({
            matcher: O.matcher, hooks: O.hooks
        }));
    let z = Ap(), w = DN1();
    if (w)
        for (let [H, $] of Object.entries(w)) {
            if (!K[H]) K[H] = [];
            for (let O of $) {
                if (z && "pluginRoot" in O) continue;
                K[H].push(O)
            }
        }
    if (!z && A !== void 0) {
        let H = Ww6(A, q);
        for (let [O, _] of H.entries()) {
            if (!K[O]) K[O] = [];
            for (let J of _) K[O].push(J)
        }
        let $ = Ik7(A, q);
        for (let [O, _] of $.entries()) {
            if (!K[O]) K[O] = [];
            for (let J of _) K[O].push({ matcher: J.matcher, hooks: J.hooks })
        }
    }
    return K
}

// READABLE (for understanding):
function mergeHookSources(appState, agentId) {
    let merged = {};

    // 1. Policy settings hooks (highest priority, managed-only mode)
    let policyHooks = getPolicySettingsHooks();  // Uk7()
    if (policyHooks)
        for (let [event, matchers] of Object.entries(policyHooks))
            merged[event] = matchers.map(m => ({ matcher: m.matcher, hooks: m.hooks }));

    // 2. Plugin-registered hooks (from DN1() - global process state)
    let isManagedOnly = isAllowManagedHooksOnly();  // Ap()
    let registeredHooks = getRegisteredHooks();  // DN1()
    if (registeredHooks)
        for (let [event, matchers] of Object.entries(registeredHooks)) {
            if (!merged[event]) merged[event] = [];
            for (let matcher of matchers) {
                // When in managed-only mode, skip plugin hooks
                if (isManagedOnly && "pluginRoot" in matcher) continue;
                merged[event].push(matcher)
            }
        }

    // 3. User/project/local settings + function hooks (skipped in managed-only mode)
    if (!isManagedOnly && appState !== undefined) {
        // Session hooks (from appState.sessionHooks[agentId])
        let sessionHooks = getSessionHooks(appState, agentId);  // Ww6()
        for (let [event, matchers] of sessionHooks.entries()) {
            if (!merged[event]) merged[event] = [];
            for (let matcher of matchers) merged[event].push(matcher)
        }
        // Function hooks specifically (filtered from session)
        let functionHooks = getSessionFunctionHooks(appState, agentId);  // Ik7()
        for (let [event, matchers] of functionHooks.entries()) {
            if (!merged[event]) merged[event] = [];
            for (let matcher of matchers) merged[event].push({ matcher: matcher.matcher, hooks: matcher.hooks })
        }
    }
    return merged
}

// Mapping: JhY→mergeHookSources, A→appState, q→agentId, K→merged,
//          Uk7→getPolicySettingsHooks, Ap→isAllowManagedHooksOnly,
//          DN1→getRegisteredHooks, Ww6→getSessionHooks, Ik7→getSessionFunctionHooks
```

**Source Priority (from highest to lowest):**
1. **Policy settings** (`Uk7`) — Loaded from managed/enterprise policy configuration. Always included.
2. **Plugin hooks** (`DN1`) — Registered at process level via `o6.registeredHooks`. Skipped in managed-only mode.
3. **Session hooks** (`Ww6`) — User/project/local settings hooks, stored in `appState.sessionHooks[agentId]`. Skipped in managed-only mode.
4. **Function hooks** (`Ik7`) — Same as session hooks but only `type: "function"` entries. REPL-only, for Stop hooks.

**Key insight:** The `isAllowManagedHooksOnly()` (`Ap`) flag gates whether plugins and user settings can inject hooks. In enterprise deployments, only policy-controlled hooks run.

---

### Algorithm 2: Hook Resolution and Matching (`oRA` / `resolveHooksForEvent`)

**What it does:** Filters the merged hook map to find which hooks apply to the current event+query, deduplicates by content, and returns a flat ordered list.

**How it works:**

```javascript
// ============================================
// resolveHooksForEvent - Filter and deduplicate hooks for an event+query
// Location: chunks.141.mjs:2140-2200
// ============================================

// ORIGINAL (for source lookup):
function oRA(A, q, K, Y) {
    try {
        let w = JhY(A, q)?.[K] ?? [], H = void 0;
        switch (Y.hook_event_name) {
            case "PreToolUse": case "PostToolUse": case "PostToolUseFailure":
            case "PermissionRequest": H = Y.tool_name; break;
            case "SessionStart": H = Y.source; break;
            case "Setup": H = Y.trigger; break;
            case "PreCompact": H = Y.trigger; break;
            case "Notification": H = Y.notification_type; break;
            case "SessionEnd": H = Y.reason; break;
            case "SubagentStart": H = Y.agent_type; break;
            case "SubagentStop": H = Y.agent_type; break;
            case "TeammateIdle": case "TaskCompleted": break;
        }
        let O = (H ? w.filter((P) => !P.matcher || _hY(H, P.matcher)) : w)
            .flatMap((P) => {
                let W = "pluginRoot" in P ? P.pluginRoot : void 0;
                let G = "pluginId" in P ? P.pluginId : void 0;
                let f = "skillRoot" in P ? P.skillRoot : void 0;
                return P.hooks.map((Z) => ({ hook: Z, pluginRoot: W, pluginId: G, skillRoot: f }))
            });
        let _ = Array.from(new Map(O.filter(P => P.hook.type === "command").map(P => [P.hook.command, P])).values());
        let J = Array.from(new Map(O.filter(P => P.hook.type === "prompt").map(P => [P.hook.prompt, P])).values());
        let X = Array.from(new Map(O.filter(P => P.hook.type === "agent").map(P => [P.hook.prompt([]), P])).values());
        let D = O.filter(P => P.hook.type === "callback");
        let j = O.filter(P => P.hook.type === "function");
        let M = [..._, ...J, ...X, ...D, ...j];
        return M
    } catch { return [] }
}

// READABLE (for understanding):
function resolveHooksForEvent(appState, agentId, eventName, hookInput) {
    // 1. Load all hook matchers for this event from all sources
    let allMatchers = mergeHookSources(appState, agentId)?.[eventName] ?? [];

    // 2. Determine the sub-query for matcher filtering
    let matchQuery = getMatchQueryForEvent(hookInput);
    // matchQuery = tool_name for PreToolUse/PostToolUse/PostToolUseFailure/PermissionRequest
    //            = source for SessionStart (startup|resume|clear|compact)
    //            = trigger for Setup/PreCompact (init|maintenance or manual|auto)
    //            = notification_type for Notification
    //            = agent_type for SubagentStart/SubagentStop
    //            = undefined for Stop/TeammateIdle/TaskCompleted/UserPromptSubmit

    // 3. Filter matchers by match query
    let matchingHooks = (matchQuery
        ? allMatchers.filter(m => !m.matcher || matchesHookMatcher(matchQuery, m.matcher))
        : allMatchers
    ).flatMap(m => m.hooks.map(h => ({ hook: h, pluginRoot: m.pluginRoot, ... })));

    // 4. Deduplicate by content within each type
    let commandHooks = dedupByKey(matchingHooks.filter(h => h.hook.type === "command"), h => h.hook.command);
    let promptHooks = dedupByKey(matchingHooks.filter(h => h.hook.type === "prompt"), h => h.hook.prompt);
    let agentHooks = dedupByKey(matchingHooks.filter(h => h.hook.type === "agent"), h => h.hook.prompt([]));
    let callbackHooks = matchingHooks.filter(h => h.hook.type === "callback");  // no dedup
    let functionHooks = matchingHooks.filter(h => h.hook.type === "function");  // no dedup

    // 5. Final ordered list: command → prompt → agent → callback → function
    return [...commandHooks, ...promptHooks, ...agentHooks, ...callbackHooks, ...functionHooks];
}
```

**Matcher Pattern System** (`_hY` / `matchesHookMatcher`):

```javascript
// ============================================
// matchesHookMatcher - Pattern matching for hook matchers
// Location: chunks.141.mjs:2079-2090
// ============================================

// ORIGINAL (for source lookup):
function _hY(A, q) {
    if (!q || q === "*") return !0;
    if (/^[a-zA-Z0-9_|]+$/.test(q)) {
        if (q.includes("|")) return q.split("|").map((Y) => Y.trim()).includes(A);
        return A === q
    }
    try { return new RegExp(q).test(A) } catch { return !1 }
}

// READABLE (for understanding):
function matchesHookMatcher(query, pattern) {
    if (!pattern || pattern === "*") return true;                 // Wildcard: match all
    if (/^[a-zA-Z0-9_|]+$/.test(pattern)) {
        if (pattern.includes("|"))
            return pattern.split("|").map(s => s.trim()).includes(query); // Pipe list: "Bash|Python"
        return query === pattern;                                 // Exact: "Bash"
    }
    try { return new RegExp(pattern).test(query) } catch { return false } // Regex: "Bash.*"
}

// Mapping: _hY→matchesHookMatcher, A→query, q→pattern
```

**Three matcher modes:**
- **Wildcard**: `*` or empty → matches all queries
- **Exact/Pipe list**: alphanumeric+underscore+pipe → literal `"Bash"` or `"Bash|Python|Write"`
- **Regex**: anything else → `new RegExp(pattern).test(query)`

---

### Algorithm 3: Core Hook Execution Engine (`NI` / `executeHooksIterator`)

**What it does:** The central async generator that executes all resolved hooks for an event and yields structured results upstream.

**How it works:**

```javascript
// ============================================
// executeHooksIterator - Core hook execution engine
// Location: chunks.141.mjs:2226-2689
// ============================================

// ORIGINAL (for source lookup):
async function* NI({ hookInput: A, toolUseID: q, matchQuery: K, signal: Y, timeoutMs: z = MP,
                     toolUseContext: w, messages: H, forceSyncExecution: $ }) {
    if (C8().disableAllHooks) return;
    let O = A.hook_event_name, _ = K ? `${O}:${K}` : O;
    if (Pi4()) { h(`Skipping ${_} hook execution - workspace trust not accepted`); return }
    let J = w ? await w.getAppState() : void 0, X = w?.agentId ?? U6(),
        D = oRA(J, X, O, A);
    if (D.length === 0) return;
    if (Y?.aborted) return;
    // ... telemetry, progress yield, parallel execution ...
}

// READABLE (for understanding):
async function* executeHooksIterator({ hookInput, toolUseID, matchQuery, signal,
                                       timeoutMs = DEFAULT_HOOK_TIMEOUT,
                                       toolUseContext, messages, forceSyncExecution }) {
    // Guard 1: Global kill switch
    if (getSettings().disableAllHooks) return;

    let eventName = hookInput.hook_event_name;
    let hookName = matchQuery ? `${eventName}:${matchQuery}` : eventName;

    // Guard 2: Workspace trust (hooks require user to trust workspace)
    if (!isWorkspaceTrusted()) {
        log(`Skipping ${hookName} hook execution - workspace trust not accepted`);
        return;
    }

    // Step 1: Resolve which hooks apply
    let appState = toolUseContext ? await toolUseContext.getAppState() : undefined;
    let agentId = toolUseContext?.agentId ?? getCurrentAgentId();
    let resolvedHooks = resolveHooksForEvent(appState, agentId, eventName, hookInput);
    if (resolvedHooks.length === 0) return;
    if (signal?.aborted) return;

    // Step 2: Telemetry tracking
    trackHookEvent("tengu_run_hook", { hookName, numCommands: resolvedHooks.length });
    let otelSpan = startOtelSpan(eventName, hookName, resolvedHooks.length);

    // Step 3: Yield progress notification for each hook BEFORE execution
    for (let { hook } of resolvedHooks) yield {
        message: buildProgressMessage({
            type: "hook_progress",
            hookEvent: eventName, hookName,
            command: getHookDisplayName(hook),
            promptText: hook.type === "prompt" ? hook.prompt : undefined,
            statusMessage: hook.statusMessage
        }, toolUseID)
    };

    // Step 4: Create per-hook async generator functions
    let hookGenerators = resolvedHooks.map(async function*({ hook, pluginRoot, skillRoot }, index) {
        // Dispatch to the correct executor based on hook type
        if (hook.type === "callback") {
            yield executeCallbackHook({ toolUseID, hook, ... });  // DhY
            return;
        }
        if (hook.type === "function") {
            if (!messages) { yield { outcome: "non_blocking_error", ... }; return; }
            yield executeFunctionHook({ hook, messages, ..., signal });  // XhY
            return;
        }

        // For command/prompt/agent: create combined timeout+parent abort signal
        let hookTimeout = hook.timeout ? hook.timeout * 1000 : timeoutMs;
        let { signal: hookSignal, cleanup } = combineAbortSignals(
            AbortSignal.timeout(hookTimeout), signal
        );  // fR()

        let stringifiedInput = JSON.stringify(hookInput);
        let hookId = generateUUID();

        if (hook.type === "prompt") {
            yield await executePromptHook(hook, hookName, eventName, stringifiedInput, hookSignal, ...);
            return;
        }
        if (hook.type === "agent") {
            yield await executeAgentHook(hook, hookName, eventName, stringifiedInput, hookSignal, ...);
            return;
        }

        // Command hook: start execution timer, execute, then parse output
        notifyHookStart(hookId, hookName, eventName);  // Hn7
        let result = await executeCommandHook(hook, eventName, hookName, stringifiedInput, hookSignal, hookId, index, pluginRoot, skillRoot, forceSyncExecution);
        cleanup?.();

        if (result.backgrounded) { yield { outcome: "success", hook }; return; }
        if (result.aborted) { yield { outcome: "cancelled", ... }; return; }

        // Parse stdout as JSON or plain text
        let { json, plainText, validationError } = parseHookOutput(result.stdout);  // Wi4

        if (validationError) { yield { outcome: "non_blocking_error", ... }; return; }

        if (json) {
            if (isAsyncHookResponse(json)) {  // SK1: checks {"async": true}
                yield { outcome: "success", hook };
                return;
            }
            // Process JSON response → permission decisions, context injections, etc.
            let processed = processHookJsonOutput({ json, ... });  // Gi4
            // Emit based on exit code + JSON content
            yield { ...processed, outcome: "success", hook };
            return;
        }

        // Non-JSON path: dispatch by exit code
        if (result.status === 0) { yield { outcome: "success", ... }; return; }
        if (result.status === 2) { yield { blockingError: {...}, outcome: "blocking" }; return; }
        yield { outcome: "non_blocking_error", ... };
    });

    // Step 5: Run ALL hook generators concurrently via mergeAsyncGenerators (_J6)
    let stats = { success: 0, blocking: 0, non_blocking_error: 0, cancelled: 0 };
    let aggregatedPermissionBehavior;

    for await (let result of mergeAsyncGenerators(hookGenerators)) {
        stats[result.outcome]++;

        // Propagate each result type upstream
        if (result.preventContinuation) yield { preventContinuation: true, ... };
        if (result.blockingError) yield { blockingError: result.blockingError };
        if (result.message) yield { message: result.message };
        if (result.systemMessage) yield { message: buildSystemMessage(result.systemMessage) };
        if (result.additionalContexts) yield { additionalContexts: result.additionalContexts };
        if (result.updatedMCPToolOutput) yield { updatedMCPToolOutput: result.updatedMCPToolOutput };

        // Permission aggregation (deny overrides ask overrides allow overrides passthrough)
        if (result.permissionBehavior) {
            switch (result.permissionBehavior) {
                case "deny": aggregatedPermissionBehavior = "deny"; break;
                case "ask":
                    if (aggregatedPermissionBehavior !== "deny") aggregatedPermissionBehavior = "ask";
                    break;
                case "allow":
                    if (!aggregatedPermissionBehavior) aggregatedPermissionBehavior = "allow";
                    break;
            }
        }
        if (aggregatedPermissionBehavior) yield { permissionBehavior: aggregatedPermissionBehavior, ... };
        if (result.updatedInput && result.permissionBehavior === undefined) yield { updatedInput: result.updatedInput };
    }

    // Step 6: Final telemetry
    trackHookFinished("tengu_repl_hook_finished", { numSuccess: stats.success, ... });
    finalizeOtelSpan(otelSpan, stats);
}
```

**Key insight:** Hooks run **concurrently**, not sequentially. `_J6(W)` (mergeAsyncGenerators) starts all hook generators at the same time and yields results in completion order. The permission aggregation happens AFTER all results are collected, so the most restrictive permission still wins even across concurrent executions.

---

### Algorithm 4: Parallel Generator Merger (`_J6` / `mergeAsyncGenerators`)

**What it does:** Takes an array of async generators and yields their values in the order they resolve - essentially a concurrent `await Promise.race` loop over generators.

```javascript
// ============================================
// mergeAsyncGenerators - Concurrent async generator merger
// Location: chunks.90.mjs:1950-1983
// ============================================

// ORIGINAL (for source lookup):
async function* _J6(A, q = 1 / 0) {
    let K = (w) => {
            let H = w.next().then(({ done: $, value: O }) =>
                ({ done: $, value: O, generator: w, promise: H }));
            return H
        },
        Y = [...A], z = new Set;
    while (z.size < q && Y.length > 0) { let w = Y.shift(); z.add(K(w)) }
    while (z.size > 0) {
        let { done: w, value: H, generator: $, promise: O } = await Promise.race(z);
        if (z.delete(O), !w) {
            if (z.add(K($)), H !== void 0) yield H
        } else if (Y.length > 0) { let _ = Y.shift(); z.add(K(_)) }
    }
}

// READABLE (for understanding):
async function* mergeAsyncGenerators(generators, concurrency = Infinity) {
    // "advance" wraps a generator's .next() call with a self-referential promise
    // so we can identify WHICH generator completed via Promise.race
    const advance = (gen) => {
        const promise = gen.next().then(({ done, value }) =>
            ({ done, value, generator: gen, promise }));
        return promise;
    };

    let remaining = [...generators];
    let inFlight = new Set;

    // Start up to `concurrency` generators
    while (inFlight.size < concurrency && remaining.length > 0)
        inFlight.add(advance(remaining.shift()));

    // Race until all done
    while (inFlight.size > 0) {
        let { done, value, generator, promise } = await Promise.race(inFlight);
        inFlight.delete(promise);
        if (!done) {
            inFlight.add(advance(generator));  // re-queue for next value
            if (value !== undefined) yield value;
        } else if (remaining.length > 0) {
            inFlight.add(advance(remaining.shift()));  // start next queued generator
        }
    }
}
```

**Why this approach:**
- **True concurrency**: All hooks for one event start simultaneously, not one-at-a-time.
- **Order-agnostic**: Results are yielded in completion order, not definition order. A fast `echo` hook beats a slow verification script.
- **Backpressure-safe**: The outer `for await` consuming the merged generator applies natural backpressure - the race loop only advances when the consumer is ready.
- **Default concurrency = Infinity**: All hooks for an event run in parallel. The concurrency parameter is exposed but unused at call sites.

---

### Algorithm 5: Command Hook Execution (`BW6` / `executeCommandHook`)

**What it does:** Spawns a shell command, writes the hook's JSON payload to stdin, collects stdout/stderr, and handles both sync completion and async backgrounding.

```javascript
// ============================================
// executeCommandHook - Shell command hook execution with async support
// Location: chunks.141.mjs:1924-2077
// ============================================

// ORIGINAL (for source lookup):
async function BW6(A, q, K, Y, z, w, H, $, O, _) {
    let J = y8(), X = A.command;
    if ($) X = X.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, $);
    if (eA() === "windows" && X.trim().match(/\.sh(\s|$|")/)) {
        if (!X.trim().startsWith("bash ")) X = `bash ${X}`
    }
    let D = process.env.CLAUDE_CODE_SHELL_PREFIX ? Q_6(process.env.CLAUDE_CODE_SHELL_PREFIX, X) : X,
        j = A.timeout ? A.timeout * 1000 : MP,
        M = { ...process.env, CLAUDE_PROJECT_DIR: J };
    if ($) M.CLAUDE_PLUGIN_ROOT = $;
    if (O) M.CLAUDE_PLUGIN_ROOT = O;
    if ((q === "SessionStart" || q === "Setup") && H !== void 0) M.CLAUDE_ENV_FILE = hd7(q, H);
    let P = OhY(D, [], { env: M, cwd: h6(), shell: true, windowsHide: true }),
        W = F_6(P, z, j), G = false, f = false;
    if (A.async && !_) {
        // Mode 1: Config-based async (hook.async === true)
        let p = `async_hook_${P.pid}`;
        if (h(`Hooks: Config-based async hook, backgrounding process ${p}`),
            P.stdin.write(Y, "utf8"), P.stdin.end(), f = true,
            ji4({ processId: p, hookId: w, shellCommand: W, ... }))
            return { stdout: "", stderr: "", output: "", status: 0, backgrounded: true }
    }
    // ... collect stdout, check for {"async": true} in initial output ...
    // Mode 2: Output-based async detection
    P.stdout.on("data", (p) => {
        if (!k && Z.trim().includes("}")) {
            k = true;
            try {
                let l = JSON.parse(Z.trim());
                if (isAsyncHookResponse(l) && !forceSyncExecution) {
                    // Hook returned {"async": true} — background it
                    ji4({ processId: `async_hook_${P.pid}`, ... });
                    G = true;  // resolve the race immediately
                    y?.({ stdout: Z, ..., status: 0 })
                }
            } catch {}
        }
    });
    // Races: stdin-write error | backgrounded-resolve | process-close
    return await Promise.race([stdinWritePromise, backgroundedPromise, processClosePromise]);
}

// READABLE (for understanding):
async function executeCommandHook(hook, eventName, hookName, inputJson, signal,
                                   hookId, hookIndex, pluginRoot, skillRoot, forceSyncExecution) {
    let projectDir = getProjectDir();
    let command = resolveCommand(hook.command, pluginRoot, skillRoot);  // CLAUDE_PLUGIN_ROOT substitution

    // Windows compatibility: automatically prepend "bash " to .sh scripts
    if (getPlatform() === "windows" && command.match(/\.sh(\s|$|")/))
        if (!command.startsWith("bash ")) command = `bash ${command}`;

    // CLAUDE_CODE_SHELL_PREFIX support (e.g., for Docker container execution)
    if (process.env.CLAUDE_CODE_SHELL_PREFIX)
        command = prependShellPrefix(process.env.CLAUDE_CODE_SHELL_PREFIX, command);

    let env = {
        ...process.env,
        CLAUDE_PROJECT_DIR: projectDir,
        CLAUDE_PLUGIN_ROOT: pluginRoot || skillRoot,
        // For SessionStart/Setup: inject env file path for the hook to read
        ...(eventName === "SessionStart" || eventName === "Setup") && {
            CLAUDE_ENV_FILE: buildEnvFilePath(eventName, hookIndex)
        }
    };

    let proc = spawn(command, [], { env, cwd: getCwd(), shell: true, windowsHide: true });
    let managedProcess = createManagedShellProcess(proc, signal, hook.timeout ?? DEFAULT_HOOK_TIMEOUT);

    // === Async Mode 1: Config-based (hook.async === true) ===
    if (hook.async && !forceSyncExecution) {
        let processId = `async_hook_${proc.pid}`;
        proc.stdin.write(inputJson, "utf8");
        proc.stdin.end();
        registerAsyncHook({ processId, hookId, shellCommand: managedProcess, ... });  // $n7
        return { stdout: "", stderr: "", output: "", status: 0, backgrounded: true };
    }

    // === Sync mode: collect output, watch for async self-declaration ===
    let stdout = "", stderr = "", combinedOutput = "";
    let checkedAsync = false, earlyResolve = null, backgrounded = false;
    let earlyResolvePromise = new Promise(resolve => earlyResolve = resolve);

    // Set up streaming progress (remote clients get live updates)
    let stopPolling = hookProgressPoller({ hookId, hookName, hookEvent: eventName,
                                          getOutput: () => ({ stdout, stderr, output: combinedOutput }) });

    proc.stdout.on("data", (chunk) => {
        stdout += chunk; combinedOutput += chunk;
        // === Async Mode 2: Output-based detection ===
        if (!checkedAsync && stdout.includes("}")) {
            checkedAsync = true;
            try {
                let parsed = JSON.parse(stdout.trim());
                if (isAsyncHookResponse(parsed) && !forceSyncExecution) {
                    // Hook's first output contains {"async": true} — background it
                    registerAsyncHook({ processId: `async_hook_${proc.pid}`, asyncResponse: parsed, ... });
                    backgrounded = true;
                    earlyResolve({ stdout, stderr, output: combinedOutput, status: 0 });
                }
            } catch {}
        }
    });
    proc.stderr.on("data", chunk => { stderr += chunk; combinedOutput += chunk; });

    // Three-way race:
    // 1. stdin write error (EPIPE if command closed early)
    // 2. Async background resolve (earlyResolvePromise)
    // 3. Process close (normal completion)
    try {
        await Promise.race([stdinWritePromise, Error]);
        return await Promise.race([earlyResolvePromise, processClosePromise, Error]);
    } catch (e) {
        if (e.code === "EPIPE") return { stdout: "", stderr: "Hook closed stdin early", status: 1 };
        if (e.code === "ABORT_ERR") return { stdout: "", stderr: "Hook cancelled", status: 1, aborted: true };
        return { stdout: "", stderr: e.message, status: 1 };
    } finally {
        stopPolling();
        if (!backgrounded) managedProcess.cleanup();
    }
}

// Mapping: BW6→executeCommandHook, A→hook, q→eventName, K→hookName, Y→inputJson,
//          z→signal, w→hookId, H→hookIndex, $→pluginRoot, O→skillRoot, _→forceSyncExecution,
//          P→proc, W→managedProcess, G→backgrounded, f→stdinWritten, k→checkedAsync
```

**Two async detection modes:**

| Mode | Trigger | Mechanism |
|------|---------|-----------|
| **Config-based** | `hook.async === true` | Background immediately after stdin write, don't wait |
| **Output-based** | Hook writes `{"async": true}` to stdout | Race resolves when first JSON parsed; process continues in background |

**Key environment variables injected:**
- `CLAUDE_PROJECT_DIR` - always injected (current project directory)
- `CLAUDE_PLUGIN_ROOT` - when hook is from a plugin
- `CLAUDE_ENV_FILE` - for `SessionStart`/`Setup` hooks: path to file containing current environment variables
- `CLAUDE_CODE_SHELL_PREFIX` - user-configurable prefix for all hook commands (e.g., Docker exec)

**Exit code semantics:**
- `0` → Success. If stdout is valid JSON → process it. If plain text → log it.
- `2` → Blocking error. stderr content is shown to user/model as blocking reason.
- Other → Non-blocking error. Logged but execution continues.

---

### Algorithm 6: Async Hook Background Registry

**What it does:** Manages backgrounded hook processes. They run asynchronously and their completion is checked during session turns.

```javascript
// ============================================
// registerAsyncHook - Register a process in the background hook registry
// Location: chunks.90.mjs:1793-1838
// ============================================

// ORIGINAL (for source lookup):
function $n7({ processId: A, hookId: q, asyncResponse: K, hookName: Y, hookEvent: z,
               command: w, shellCommand: H, toolName: $ }) {
    let O = K.asyncTimeout || 15000;
    let _ = HJ6({ hookId: q, hookName: Y, hookEvent: z,
                  getOutput: () => { let J = VR.get(A); return J ? {...} : { stdout: "", ... } } });
    VR.set(A, { processId: A, hookId: q, hookName: Y, hookEvent: z, toolName: $,
                command: w, startTime: Date.now(), timeout: O, stdout: "", stderr: "", output: "",
                responseAttachmentSent: false, shellCommand: H, stopProgressInterval: _ })
}

// READABLE (for understanding):
function registerAsyncHook({ processId, hookId, asyncResponse, hookName, hookEvent,
                              command, shellCommand, toolName }) {
    let timeout = asyncResponse.asyncTimeout || 15000;  // Default: 15 seconds

    // Start streaming progress to remote clients during background execution
    let stopProgressPolling = hookProgressPoller({ hookId, hookName, hookEvent,
        getOutput: () => {
            let entry = asyncHookRegistry.get(processId);
            return entry ? { stdout: entry.stdout, stderr: entry.stderr, output: entry.output }
                         : { stdout: "", stderr: "", output: "" };
        }
    });

    asyncHookRegistry.set(processId, {
        processId, hookId, hookName, hookEvent, toolName, command,
        startTime: Date.now(), timeout,
        stdout: "", stderr: "", output: "",
        responseAttachmentSent: false,
        shellCommand,
        stopProgressInterval: stopProgressPolling
    });
}

// Mapping: $n7→registerAsyncHook, VR→asyncHookRegistry, K→asyncResponse, H→shellCommand
```

**Background hook lifecycle:**

```
1. Hook starts → registerAsyncHook($n7) adds to VR (asyncHookRegistry: Map)
2. Process streams stdout → On7 appends to VR[processId].stdout
3. Process streams stderr → _n7 appends to VR[processId].stderr
4. Next session turn → checkAsyncHookResponses(Jn7) polls all VR entries:
   - If shellCommand.status === "killed" → remove from registry
   - If shellCommand.status === "completed" AND stdout non-empty AND not yet delivered:
     → Parse stdout lines for non-async JSON response
     → Mark responseAttachmentSent = true
     → Return as attachment to session
     → If hookEvent === "SessionStart" → invalidate session env cache
5. Session end → cleanupAllAsyncHooks(lMA) forces all pending hooks to complete or kill
```

---

### Algorithm 7: Hook Output Parsing and Processing

**What it does:** Two-step pipeline. First parse the stdout string. Then map the parsed JSON to structured hook outcomes.

**Step 1: Parse (`Wi4` / `parseHookOutput`)**

```javascript
// ============================================
// parseHookOutput - Parse hook stdout as JSON or plain text
// Location: chunks.141.mjs:1780-1808
// ============================================

// ORIGINAL (for source lookup):
function Wi4(A) {
    let q = A.trim();
    if (!q.startsWith("{")) return { plainText: A };
    try {
        let K = _A(q), Y = zJ6.safeParse(K);
        if (Y.success) return { json: Y.data };
        else { let w = `Hook JSON output validation failed: ...`; return { plainText: A, validationError: w } }
    } catch (K) { return { plainText: A } }
}

// READABLE (for understanding):
function parseHookOutput(stdout) {
    let trimmed = stdout.trim();
    // If output doesn't start with "{", it's plain text (not an error)
    if (!trimmed.startsWith("{")) {
        log("Hook output does not start with {, treating as plain text");
        return { plainText: stdout };
    }
    try {
        let parsed = JSON.parse(trimmed);
        let validation = HookOutputSchema.safeParse(parsed);  // zJ6
        if (validation.success) {
            log("Successfully parsed and validated hook JSON output");
            return { json: validation.data };
        } else {
            let errorMsg = buildValidationErrorMessage(validation.error, parsed);
            // Output the complete expected schema in the error message
            return { plainText: stdout, validationError: errorMsg };
        }
    } catch (e) {
        log(`Failed to parse hook output as JSON: ${e}`);
        return { plainText: stdout };
    }
}

// Mapping: Wi4→parseHookOutput, A→stdout, q→trimmed, K→parsed, Y→validation, zJ6→HookOutputSchema
```

**Step 2: Process JSON (`Gi4` / `processHookJsonOutput`)**

```javascript
// ============================================
// processHookJsonOutput - Map JSON fields to structured hook outcomes
// Location: chunks.141.mjs:1810-1922
// ============================================

// READABLE (for understanding):
function processHookJsonOutput({ json, command, hookName, toolUseID, hookEvent,
                                  expectedHookEvent, stdout, stderr, exitCode }) {
    let result = {};

    // continue: false → prevent the agent from continuing after this stop
    if (json.continue === false) {
        result.preventContinuation = true;
        if (json.stopReason) result.stopReason = json.stopReason;
    }

    // decision: "approve"/"block" → legacy permission control
    if (json.decision === "approve") result.permissionBehavior = "allow";
    if (json.decision === "block") {
        result.permissionBehavior = "deny";
        result.blockingError = { blockingError: json.reason || "Blocked by hook", command };
    }

    // systemMessage → inject a message directly into the conversation
    if (json.systemMessage) result.systemMessage = json.systemMessage;

    // hookSpecificOutput → event-specific typed response
    if (json.hookSpecificOutput) {
        if (expectedHookEvent && json.hookSpecificOutput.hookEventName !== expectedHookEvent)
            throw Error(`Hook returned incorrect event name: expected '${expectedHookEvent}'`);

        switch (json.hookSpecificOutput.hookEventName) {
            case "PreToolUse":
                // permissionDecision: "allow"/"deny"/"ask"
                result.permissionBehavior = mapPermissionDecision(json.hookSpecificOutput.permissionDecision);
                // updatedInput: replace tool's input parameters (only if allowing)
                if (json.hookSpecificOutput.updatedInput) result.updatedInput = json.hookSpecificOutput.updatedInput;
                result.additionalContext = json.hookSpecificOutput.additionalContext;
                break;
            case "PostToolUse":
                result.additionalContext = json.hookSpecificOutput.additionalContext;
                // updatedMCPToolOutput: replace the tool's output (for MCP tools)
                if (json.hookSpecificOutput.updatedMCPToolOutput)
                    result.updatedMCPToolOutput = json.hookSpecificOutput.updatedMCPToolOutput;
                break;
            case "PermissionRequest":
                // Full permission request override with optional input modification
                if (json.hookSpecificOutput.decision) {
                    result.permissionRequestResult = json.hookSpecificOutput.decision;
                    result.permissionBehavior = json.hookSpecificOutput.decision.behavior === "allow" ? "allow" : "deny";
                    if (json.hookSpecificOutput.decision.updatedInput)
                        result.updatedInput = json.hookSpecificOutput.decision.updatedInput;
                }
                break;
            // UserPromptSubmit, SessionStart, Setup, SubagentStart, PostToolUseFailure:
            default:
                result.additionalContext = json.hookSpecificOutput.additionalContext;
        }
    }

    // Build success/blocking message
    return {
        ...result,
        message: result.blockingError
            ? buildBlockingErrorMessage({ type: "hook_blocking_error", ... })
            : buildSuccessMessage({ type: "hook_success", stdout, stderr, exitCode, ... })
    };
}
```

---

### Algorithm 8: Agent Hook Execution (`Xi4` / `executeAgentHook`)

**What it does:** Runs a full LLM sub-agent to evaluate a boolean condition. Used for sophisticated stop conditions like "verify the bug is fixed".

```javascript
// ============================================
// executeAgentHook - Sub-agent based condition verification
// Location: chunks.141.mjs:1561-1717
// ============================================

// READABLE (for understanding):
async function executeAgentHook(hook, hookName, eventName, inputJson, signal,
                                 toolUseContext, toolUseID, messages) {
    let agentId = toolUseID || `hook-${generateHookId()}`;
    let transcriptPath = toolUseContext.agentId
        ? getAgentTranscriptPath(toolUseContext.agentId)   // kh()
        : getDefaultTranscriptPath();

    // Interpolate ${VARIABLE} in the prompt template
    let interpolatedPrompt = interpolateHookPrompt(hook.prompt(messages), inputJson);  // XJ6

    // Create specialized tools for the agent hook
    // Filters out: STRUCTURED_OUTPUT tool (cD), HOOK_BLOCKED_TOOLS (Bj1)
    // Bj1 = Set containing: bash tool, web fetch, computer use, etc.
    let availableTools = [
        ...toolUseContext.options.tools
            .filter(t => t.name !== STRUCTURED_OUTPUT_TOOL_NAME)
            .filter(t => !HOOK_BLOCKED_TOOLS.has(t.name)),
        getStructuredOutputTool()   // Special { ok: boolean, reason?: string } tool
    ];

    let systemPrompt = [
        `You are verifying a stop condition in Claude Code. Your task is to verify that the agent completed the given plan.`,
        `The conversation transcript is available at: ${transcriptPath}`,
        `You can read this file to analyze the conversation history if needed.`,
        `\nUse the available tools to inspect the codebase and verify the condition.`,
        `Use as few steps as possible - be efficient and direct.`,
        `\nWhen done, return your result using the ${STRUCTURED_OUTPUT_TOOL_NAME} tool with:`,
        `- ok: true if the condition is met`,
        `- ok: false with reason if the condition is not met`
    ];

    // Configure sub-agent context (inherits parent but with modifications)
    let hookAgentId = generateAgentId(`hook-agent-${generateHookId()}`);
    let hookAgentContext = {
        ...toolUseContext,
        agentId: hookAgentId,
        abortController: hookAbortController,
        options: {
            ...toolUseContext.options,
            tools: availableTools,
            mainLoopModel: hook.model ?? getDefaultModel(),
            isNonInteractiveSession: true,
            maxThinkingTokens: 0  // No extended thinking for efficiency
        },
        setInProgressToolUseIDs: () => {},  // Ignore tool use tracking
        async getAppState() {
            let state = await toolUseContext.getAppState();
            return {
                ...state,
                toolPermissionContext: {
                    ...state.toolPermissionContext,
                    mode: "dontAsk",  // Auto-approve all permission requests
                    alwaysAllowRules: {
                        ...state.toolPermissionContext.alwaysAllowRules,
                        session: [...existingRules, `Read(/${transcriptPath})`]  // Allow reading transcript
                    }
                }
            };
        }
    };

    // Register sub-agent in state for visibility
    registerAgentInState(toolUseContext.setAppState, hookAgentId);  // DJ6

    let structuredOutput = null, turnCount = 0, hitMaxTurns = false;
    const MAX_TURNS = 50;

    // Run the agent loop
    for await (let event of runMainLLMLoop({ messages: [{ content: interpolatedPrompt }],
                                              systemPrompt, toolUseContext: hookAgentContext, ... })) {
        if (event.type === "assistant") {
            if (++turnCount >= MAX_TURNS) {
                hitMaxTurns = true;
                hookAbortController.abort();
                break;
            }
        }
        // Watch for structured output tool result
        if (event.type === "attachment" && event.attachment.type === "structured_output") {
            let parsed = StructuredOutputSchema.safeParse(event.attachment.data);
            if (parsed.success) {
                structuredOutput = parsed.data;
                hookAbortController.abort();  // Stop agent once we have a result
                break;
            }
        }
    }

    // Unregister sub-agent
    unregisterAgentFromState(toolUseContext.setAppState, hookAgentId);  // iD1

    if (!structuredOutput) {
        if (hitMaxTurns) return { hook, outcome: "cancelled" };
        return { hook, outcome: "cancelled" };
    }

    // The agent returned { ok: true } → condition met → don't block
    if (structuredOutput.ok) return { hook, outcome: "success", message: ... };

    // The agent returned { ok: false, reason: "..." } → block execution
    return {
        hook, outcome: "blocking",
        blockingError: {
            blockingError: `Agent hook condition was not met: ${structuredOutput.reason}`,
            command: hook.prompt(messages)
        }
    };
}
```

**HOOK_BLOCKED_TOOLS (`Bj1`):** The set of tools that agent hooks cannot use (to prevent recursive/dangerous behavior). Includes bash execution, web fetch, computer use, and other potentially dangerous tools.

**Key design decisions:**
- Max 50 turns to prevent runaway agents
- `dontAsk` permission mode → agent hook never prompts for permissions
- `maxThinkingTokens: 0` → no extended thinking (efficiency)
- The hook can read the parent agent's transcript via the injected `alwaysAllowRules`

---

### Algorithm 9: Permission Decision Aggregation

**What it does:** When multiple hooks provide permission decisions, they must be merged into one final decision. The system uses a "most restrictive wins" hierarchy.

```
Priority: deny > ask > allow > passthrough

Aggregation logic in NI (executeHooksIterator):
───────────────────────────────────────────────
Initial state: aggregatedPermissionBehavior = undefined

For each hook result with permissionBehavior:
  "deny"  → always set (cannot be overridden)
  "ask"   → set only if not already "deny"
  "allow" → set only if currently undefined
  passthrough → no change

Final yielded value = aggregatedPermissionBehavior (may be undefined = passthrough)
```

**Why this approach:** Safety first. Even one hook saying "deny" overrides all others saying "allow". This prevents a permissive hook from nullifying a restrictive policy hook.

**`updatedInput` condition:** Input replacement is only propagated when the hook's permissionBehavior is `allow` or `ask` — it wouldn't make sense to modify input while denying the operation.

---

### Algorithm 10: `executeHooksOutsideREPL` (`AyA`)

**What it does:** A non-generator parallel hook executor for contexts where streaming isn't available (Notification, PreCompact, SessionEnd, PermissionRequest). Returns an array of results.

**Key differences from `NI`:**
- Returns `Promise<Array>` instead of `AsyncGenerator`
- No `yield` — all hooks run and results collected in `Promise.all()`
- Only supports `command` and `callback` types; prompt/agent/function hooks return error entries
- No permission aggregation or message streaming

```javascript
// READABLE excerpt:
async function executeHooksOutsideREPL({ getAppState, hookInput, matchQuery, signal, timeoutMs }) {
    // ... guards (same as NI) ...

    let resolvedHooks = resolveHooksForEvent(...);
    let inputJson = JSON.stringify(hookInput);

    let promises = resolvedHooks.map(async ({ hook, pluginRoot }, index) => {
        if (hook.type === "callback") {
            let result = await hook.callback(hookInput, toolUseId, signal, index);
            if (isAsyncHookResponse(result)) return { command: "callback", succeeded: true, output: "" };
            return { command: "callback", succeeded: true, output: result.systemMessage || "" };
        }
        if (hook.type === "prompt") return { command: hook.prompt, succeeded: false,
                                              output: "Prompt stop hooks not yet supported outside REPL" };
        if (hook.type === "agent") return { command: hook.prompt([]), succeeded: false,
                                             output: "Agent stop hooks not yet supported outside REPL" };
        if (hook.type === "function") { logError(...); return { ..., succeeded: false }; }

        // command type: execute and return result
        let result = await executeCommandHook(hook, eventName, hookName, inputJson, hookSignal, ...);
        let { json, validationError } = parseHookOutput(result.stdout);
        if (validationError) throw Error(validationError);
        return {
            command: hook.command,
            succeeded: result.status === 0,
            output: result.status === 0 ? result.stdout : result.stderr
        };
    });

    return await Promise.all(promises);  // All hooks run in parallel
}
```

---

## Lifecycle Events - Complete Payload Schemas

All events are defined as Zod schemas in `chunks.129.mjs`. The base payload (`gZ`) is always:

```javascript
// Base payload (gZ): chunks.129.mjs:717-722
{
    session_id: string,           // Current session UUID
    transcript_path: string,      // Path to session transcript file
    cwd: string,                  // Current working directory
    permission_mode?: string      // Current permission mode (optional)
}
```

Individual event schemas (from chunks.129.mjs:722-791):

| Event | Extra Fields | Match Query Source |
|-------|-------------|-------------------|
| `PreToolUse` | `tool_name`, `tool_input`, `tool_use_id` | `tool_name` |
| `PostToolUse` | `tool_name`, `tool_input`, `tool_response`, `tool_use_id` | `tool_name` |
| `PostToolUseFailure` | `tool_name`, `tool_input`, `tool_use_id`, `error`, `is_interrupt?` | `tool_name` |
| `PermissionRequest` | `tool_name`, `tool_input`, `permission_suggestions?` | `tool_name` |
| `Notification` | `message`, `title?`, `notification_type` | `notification_type` |
| `UserPromptSubmit` | `prompt` | none |
| `SessionStart` | `source` (startup/resume/clear/compact), `agent_type?`, `model?` | `source` |
| `SessionEnd` | `reason` (clear/logout/prompt_input_exit/other/bypass_permissions_disabled) | `reason` |
| `Stop` | `stop_hook_active` (bool) | none |
| `SubagentStart` | `agent_id`, `agent_type` | `agent_type` |
| `SubagentStop` | `stop_hook_active`, `agent_id`, `agent_transcript_path`, `agent_type` | `agent_type` |
| `PreCompact` | `trigger` (manual/auto), `custom_instructions?` | `trigger` |
| `Setup` | `trigger` (init/maintenance) | `trigger` |
| `TeammateIdle` | `teammate_name`, `team_name` | none |
| `TaskCompleted` | `task_id`, `task_subject`, `task_description?`, `teammate_name?`, `team_name?` | none |

---

## Hook Types Summary

| Type | Executor | Context Required | Blocking | Async Support |
|------|---------|-----------------|----------|---------------|
| `command` | `BW6` (shell spawn) | None | Yes (exit 2) | Yes (config/output-based) |
| `prompt` | `Pn7` (single LLM query) | ToolUseContext + messages | No (yes/no only) | No |
| `agent` | `Xi4` (full agent loop) | ToolUseContext + messages | Yes (ok: false) | No |
| `callback` | `DhY` (in-process function) | Optional ToolUseContext | Via JSON return | Via `{async: true}` return |
| `function` | `XhY` (REPL function) | messages | Yes (false return) | No |

---

## Remote Streaming Support

Only **SessionStart** and **Setup** events stream progress to remote clients during execution. This is hardcoded in `IL9 = ["SessionStart", "Setup"]`.

```javascript
function wJ6(hookEvent) {
    return ["SessionStart", "Setup"].includes(hookEvent);  // IL9
}
```

The `HJ6` (hookProgressPoller) function creates a 1-second polling interval that pushes stdout/stderr updates to remote clients via the `dMA` dispatch mechanism. This only activates when `CLAUDE_CODE_REMOTE` environment variable is set.

---

## Key Constants and Configuration

| Symbol | Value | Meaning |
|--------|-------|---------|
| `MP` | `600000` | Default hook timeout: **10 minutes** |
| `Bj1` (HOOK_BLOCKED_TOOLS) | Set of tool names | Tools blocked from agent hooks |
| `IL9` | `["SessionStart", "Setup"]` | Events that stream progress to remote |
| `tGY` (HOOK_EVENT_NAMES) | Array of 15 strings | All valid event names |
| `VR` | `Map<string, HookProcessEntry>` | Async hook background registry |

---

## Key Insights

1. **10-Minute Default Timeout**: `MP = 600000` (10 minutes) is the default. This is very permissive — hooks intended for complex verification tasks can run for many minutes without needing a custom timeout.

2. **Concurrent Execution, Sequential Permission Aggregation**: All hooks for one event run concurrently (via `_J6`), but the permission aggregation logic processes results in completion order with "most restrictive wins". There is no race condition in permission decisions.

3. **Two-Level Async Detection**: A hook can opt into async mode either statically (`hook.async === true` in config) or dynamically (outputting `{"async": true}` as its first JSON response). The dynamic mode allows a hook to decide at runtime based on what work is needed.

4. **`forceSyncExecution` Override**: The `SessionStart` hook uses `forceSyncExecution` to prevent async backgrounding during session initialization — the session cannot proceed until all SessionStart hooks complete.

5. **Trust Gate**: `Pi4()` (workspace trust check) silently skips all hooks if the user hasn't accepted workspace trust. This prevents malicious project hooks from running in untrusted projects.

6. **Agent Hook Tool Filtering**: Agent hooks cannot use `HOOK_BLOCKED_TOOLS` (`Bj1`). The set prevents agent hooks from spawning bash commands, doing web requests, or using other powerful tools — they're limited to reading files and inspecting the codebase.

7. **System Message Injection**: The `systemMessage` field in hook JSON output injects a message directly into the conversation context — not as user/assistant messages but as a special injection. This allows hooks to communicate with the model without appearing as user messages.

8. **Hook Name Format**: The hook name `hookEvent:matchQuery` (e.g., `PreToolUse:Bash`) is used throughout for logging, telemetry, and OpenTelemetry spans. When no matchQuery applies, just the event name is used.
