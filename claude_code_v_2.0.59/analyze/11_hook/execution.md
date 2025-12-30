# Hook Execution Flow

## Overview

This document describes how hooks are executed in Claude Code v2.0.59, including configuration loading, event types, matcher system, execution ordering, interruption mechanisms, error handling, and permission integration.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `executeHooksInREPL` (qa) - Main hook execution generator
- `loadAllHooks` (ek3) - Configuration aggregator
- `getMatchingHooks` (_V0) - Hook matcher
- `createCombinedAbortSignal` (ck) - Signal combiner
- `processHookResponse` (tX9) - Response processor

---

## Hook Event Types

Claude Code supports **12 hook event types** that trigger at different points in the session lifecycle.

```javascript
// ============================================
// HOOK_EVENT_TYPES - All supported hook events
// Location: chunks.94.mjs:2194
// ============================================

// ORIGINAL (for source lookup):
zLA = ["PreToolUse", "PostToolUse", "PostToolUseFailure", "Notification",
       "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop",
       "SubagentStart", "SubagentStop", "PreCompact", "PermissionRequest"]

// READABLE (for understanding):
const HOOK_EVENT_TYPES = [
  "PreToolUse",           // Before tool execution
  "PostToolUse",          // After successful tool execution
  "PostToolUseFailure",   // After failed tool execution
  "Notification",         // System notification
  "UserPromptSubmit",     // User sends message
  "SessionStart",         // Session begins
  "SessionEnd",           // Session ends
  "Stop",                 // User interruption (Ctrl+C)
  "SubagentStart",        // Subagent spawns
  "SubagentStop",         // Subagent ends
  "PreCompact",           // Before context compaction
  "PermissionRequest"     // Before permission prompt
]

// Mapping: zLA→HOOK_EVENT_TYPES
```

---

## Configuration Loading Pipeline

### Overview

Hook configuration is loaded from multiple sources with a defined priority order. The system aggregates hooks from managed settings, user settings, project settings, and session-level programmatic hooks.

### Key Design Decision: Configuration Aggregation Strategy

**What it solves:** Enterprises need to enforce mandatory hooks, users want personal preferences, projects need custom validation, and SDK users need runtime hooks.

**Configuration Priority (Highest to Lowest):**

```
1. Managed/Policy Settings (Enterprise)
2. User Settings (~/.claude/settings.json)
3. Project Settings (.claude/settings.json)
4. Session Hooks (Programmatic)
```

**Why this specific order:**
1. **Security first:** Managed settings can block all other hooks via `allowManagedHooksOnly`
2. **User autonomy:** User settings override project settings for personal tools
3. **Project flexibility:** Project hooks apply to all users working on that project
4. **SDK integration:** Session hooks are last because they're ephemeral

**Key insight:** Unlike permissions (where deny takes precedence), hooks from all sources are **aggregated and all execute**. Priority only matters for the `allowManagedHooksOnly` gate.

**Trade-off:** Multiple hooks from different sources all run, which could cause:
- Performance impact (many hooks = slow execution)
- Conflicting decisions (mitigated by permission aggregation's "deny wins" rule)

### Main Configuration Aggregator (`ek3`)

```javascript
// ============================================
// loadAllHooks - Hook configuration aggregator
// Location: chunks.146.mjs:3445-3476
// ============================================

// ORIGINAL (for source lookup):
function ek3(A) {
  let Q = {},
    B = SZ2();
  if (B)
    for (let [G, Z] of Object.entries(B))
      Q[G] = Z.map((I) => ({
        matcher: I.matcher,
        hooks: I.hooks
      }));
  if (!t21()) {
    let G = MkA();
    if (G)
      for (let [Z, I] of Object.entries(G)) {
        if (!Q[Z]) Q[Z] = [];
        for (let Y of I)
          Q[Z].push({
            matcher: Y.matcher,
            hooks: Y.hooks
          })
      }
  }
  if (A) {
    let G = e1(),
      Z = r21(A, G);
    for (let [I, Y] of Z.entries()) {
      if (!Q[I]) Q[I] = [];
      for (let J of Y)
        Q[I].push({
          matcher: J.matcher,
          hooks: J.hooks
        })
    }
  }
  return Q
}

// READABLE (for understanding):
function loadAllHooks(appState) {
  let aggregatedHooks = {};

  // 1. Load settings-based hooks (user/project/managed)
  let settingsHooks = getSettingsHooks();
  if (settingsHooks) {
    for (let [eventType, matcherGroups] of Object.entries(settingsHooks)) {
      aggregatedHooks[eventType] = matcherGroups.map((group) => ({
        matcher: group.matcher,
        hooks: group.hooks
      }));
    }
  }

  // 2. Load additional hooks (unless managed-only mode)
  if (!isAllowManagedHooksOnly()) {
    let additionalHooks = getAdditionalHooks();  // Project-specific
    if (additionalHooks) {
      for (let [eventType, matcherGroups] of Object.entries(additionalHooks)) {
        if (!aggregatedHooks[eventType]) aggregatedHooks[eventType] = [];
        for (let group of matcherGroups) {
          aggregatedHooks[eventType].push({
            matcher: group.matcher,
            hooks: group.hooks
          });
        }
      }
    }
  }

  // 3. Load session hooks (programmatic)
  if (appState) {
    let sessionId = getSessionId(),
      sessionHooks = getSessionHooks(appState, sessionId);

    for (let [eventType, matcherGroups] of sessionHooks.entries()) {
      if (!aggregatedHooks[eventType]) aggregatedHooks[eventType] = [];
      for (let group of matcherGroups) {
        aggregatedHooks[eventType].push({
          matcher: group.matcher,
          hooks: group.hooks
        });
      }
    }
  }

  return aggregatedHooks;
}

// Mapping: ek3→loadAllHooks, SZ2→getSettingsHooks, t21→isAllowManagedHooksOnly,
//          MkA→getAdditionalHooks, r21→getSessionHooks, e1→getSessionId
```

### Settings Hooks Loader (`SZ2`)

```javascript
// ============================================
// getSettingsHooks - Load hooks from settings files
// Location: chunks.106.mjs:1598-1601
// ============================================

// ORIGINAL (for source lookup):
function SZ2() {
  if (Oi === null) S00();
  return Oi
}

// READABLE (for understanding):
function getSettingsHooks() {
  if (hooksCache === null) {
    initializeHooksCache();  // Parses and caches hooks from settings
  }
  return hooksCache;
}

// Mapping: SZ2→getSettingsHooks, Oi→hooksCache, S00→initializeHooksCache
```

### Hook Sources Loader (`P00`)

```javascript
// ============================================
// getHookSources - Determine hook source based on policy
// Location: chunks.106.mjs:1522-1526
// ============================================

// ORIGINAL (for source lookup):
function P00() {
  let A = OB("policySettings");
  if (A?.allowManagedHooksOnly === !0)
    return A.hooks ?? {};
  return l0().hooks ?? {}
}

// READABLE (for understanding):
function getHookSources() {
  let policySettings = getPolicySetting("policySettings");

  // If managed-only mode, only use managed hooks
  if (policySettings?.allowManagedHooksOnly === true) {
    return policySettings.hooks ?? {};
  }

  // Otherwise use user/project settings
  return getSettings().hooks ?? {};
}

// Mapping: P00→getHookSources, OB→getPolicySetting, l0→getSettings
```

### Session Hooks Loader (`r21`)

```javascript
// ============================================
// getSessionHooks - Load programmatic session hooks
// Location: chunks.106.mjs:1285-1299
// ============================================

// ORIGINAL (for source lookup):
function r21(A, Q, B) {
  let G = A.sessionHooks[Q];
  if (!G) return new Map;
  let Z = new Map;
  if (B) {
    let I = G.hooks[B];
    if (I) Z.set(B, qZ2(I));
    return Z
  }
  for (let I of zLA) {
    let Y = G.hooks[I];
    if (Y) Z.set(I, qZ2(Y))
  }
  return Z
}

// READABLE (for understanding):
function getSessionHooks(appState, sessionId, specificEventType) {
  let sessionData = appState.sessionHooks[sessionId];

  if (!sessionData) {
    return new Map();  // No session hooks registered
  }

  let result = new Map();

  if (specificEventType) {
    // Return hooks for specific event type only
    let hooks = sessionData.hooks[specificEventType];
    if (hooks) result.set(specificEventType, normalizeHooks(hooks));
    return result;
  }

  // Return hooks for all event types
  for (let eventType of HOOK_EVENT_TYPES) {
    let hooks = sessionData.hooks[eventType];
    if (hooks) result.set(eventType, normalizeHooks(hooks));
  }

  return result;
}

// Mapping: r21→getSessionHooks, zLA→HOOK_EVENT_TYPES, qZ2→normalizeHooks
```

---

## Matcher System

### Overview

Matchers filter which hooks execute based on context. Different event types use different match queries.

### Match Query Extraction by Event Type

| Event Type | Match Query Field |
|------------|-------------------|
| `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest` | `tool_name` |
| `SessionStart` | `source` |
| `PreCompact` | `trigger` |
| `Notification` | `notification_type` |
| `SessionEnd` | `reason` |
| `SubagentStart` | `agent_type` |
| `Stop`, `SubagentStop`, `UserPromptSubmit` | No matcher (all hooks run) |

### Hook Matcher Implementation (`_V0`)

```javascript
// ============================================
// getMatchingHooks - Filter hooks by event and matcher
// Location: chunks.146.mjs:3478-3520
// ============================================

// ORIGINAL (for source lookup):
function _V0(A, Q, B) {
  try {
    let Z = ek3(A)?.[Q] ?? [],
      I = void 0;
    switch (B.hook_event_name) {
      case "PreToolUse":
      case "PostToolUse":
      case "PostToolUseFailure":
      case "PermissionRequest":
        I = B.tool_name;
        break;
      case "SessionStart":
        I = B.source;
        break;
      case "PreCompact":
        I = B.trigger;
        break;
      case "Notification":
        I = B.notification_type;
        break;
      case "SessionEnd":
        I = B.reason;
        break;
      case "SubagentStart":
        I = B.agent_type;
        break;
      default:
        break
    }
    g(`Getting matching hook commands for ${Q} with query: ${I}`);
    let Y;
    if (!I)
      Y = Z.flatMap((K) => K.hooks);
    else
      Y = Z.filter((K) => !K.matcher || tk3(I, K.matcher)).flatMap((K) => K.hooks);
    // Deduplicate by type
    let J = Array.from(new Map(Y.filter((K) => K.type === "command").map((K) => [K.command, K])).values()),
      W = Array.from(new Map(Y.filter((K) => K.type === "prompt").map((K) => [K.prompt, K])).values()),
      X = Array.from(new Map(Y.filter((K) => K.type === "agent").map((K) => [K.prompt([]), K])).values()),
      V = Y.filter((K) => K.type === "callback"),
      F = [...J, ...W, ...X, ...V];
    return F
  } catch {
    return []
  }
}

// READABLE (for understanding):
function getMatchingHooks(appState, hookEventName, hookInput) {
  try {
    // Load all hooks for this event type
    let matcherGroups = loadAllHooks(appState)?.[hookEventName] ?? [],
      matchQuery = undefined;

    // Extract match query based on event type
    switch (hookInput.hook_event_name) {
      case "PreToolUse":
      case "PostToolUse":
      case "PostToolUseFailure":
      case "PermissionRequest":
        matchQuery = hookInput.tool_name;
        break;
      case "SessionStart":
        matchQuery = hookInput.source;
        break;
      case "PreCompact":
        matchQuery = hookInput.trigger;
        break;
      case "Notification":
        matchQuery = hookInput.notification_type;
        break;
      case "SessionEnd":
        matchQuery = hookInput.reason;
        break;
      case "SubagentStart":
        matchQuery = hookInput.agent_type;
        break;
    }

    log(`Getting matching hook commands for ${hookEventName} with query: ${matchQuery}`);

    // Filter hooks by matcher
    let allHooks;
    if (!matchQuery) {
      // No query - all hooks match
      allHooks = matcherGroups.flatMap((group) => group.hooks);
    } else {
      // Filter by matcher pattern
      allHooks = matcherGroups
        .filter((group) => !group.matcher || matchPattern(matchQuery, group.matcher))
        .flatMap((group) => group.hooks);
    }

    // Deduplicate hooks by type-specific key
    let commandHooks = Array.from(
      new Map(allHooks.filter((h) => h.type === "command").map((h) => [h.command, h])).values()
    );
    let promptHooks = Array.from(
      new Map(allHooks.filter((h) => h.type === "prompt").map((h) => [h.prompt, h])).values()
    );
    let agentHooks = Array.from(
      new Map(allHooks.filter((h) => h.type === "agent").map((h) => [h.prompt([]), h])).values()
    );
    let callbackHooks = allHooks.filter((h) => h.type === "callback");

    return [...commandHooks, ...promptHooks, ...agentHooks, ...callbackHooks];
  } catch {
    return [];
  }
}

// Mapping: _V0→getMatchingHooks, ek3→loadAllHooks, tk3→matchPattern
```

### Pattern Matcher (`tk3`)

```javascript
// ============================================
// matchPattern - Pattern matching for hook matchers
// Location: chunks.146.mjs:3432-3443
// ============================================

// ORIGINAL (for source lookup):
function tk3(A, Q) {
  if (!Q || Q === "*") return !0;
  if (/^[a-zA-Z0-9_|]+$/.test(Q)) {
    if (Q.includes("|"))
      return Q.split("|").map((G) => G.trim()).includes(A);
    return A === Q
  }
  try {
    return new RegExp(Q).test(A)
  } catch {
    g(`Invalid regex pattern in hook matcher: ${Q}`);
    return !1
  }
}

// READABLE (for understanding):
function matchPattern(value, pattern) {
  // No pattern or wildcard - match all
  if (!pattern || pattern === "*") return true;

  // Simple alphanumeric pattern
  if (/^[a-zA-Z0-9_|]+$/.test(pattern)) {
    // Pipe-separated list: "Write|Edit|Bash"
    if (pattern.includes("|")) {
      return pattern.split("|").map((p) => p.trim()).includes(value);
    }
    // Exact match
    return value === pattern;
  }

  // Regex pattern
  try {
    return new RegExp(pattern).test(value);
  } catch {
    log(`Invalid regex pattern in hook matcher: ${pattern}`);
    return false;
  }
}

// Mapping: tk3→matchPattern
```

**Pattern Examples:**

| Pattern | Matches |
|---------|---------|
| `*` or (empty) | All values |
| `Write` | Only "Write" |
| `Write\|Edit\|Bash` | "Write", "Edit", or "Bash" |
| `^(Read\|Write)$` | "Read" or "Write" (regex) |
| `Bash.*` | "Bash", "BashOutput", etc. (regex) |

---

## Interruption Mechanism

### Signal Combination

Hooks use a signal combination pattern to handle multiple abort sources (timeout + parent abort).

```javascript
// ============================================
// createCombinedAbortSignal - Combine multiple abort signals
// Location: chunks.106.mjs:1725-1738
// ============================================

// ORIGINAL (for source lookup):
function ck(A, Q) {
  let B = o9(),
    G = () => { B.abort() };
  A.addEventListener("abort", G);
  Q?.addEventListener("abort", G);
  let Z = () => {
    A.removeEventListener("abort", G);
    Q?.removeEventListener("abort", G)
  };
  return { signal: B.signal, cleanup: Z }
}

// READABLE (for understanding):
function createCombinedAbortSignal(timeoutSignal, parentSignal) {
  let combinedController = new AbortController(),
    abortHandler = () => { combinedController.abort() };

  // Listen to both signals
  timeoutSignal.addEventListener("abort", abortHandler);
  parentSignal?.addEventListener("abort", abortHandler);

  // Cleanup function to remove listeners
  let cleanup = () => {
    timeoutSignal.removeEventListener("abort", abortHandler);
    parentSignal?.removeEventListener("abort", abortHandler);
  };

  return {
    signal: combinedController.signal,
    cleanup: cleanup
  };
}

// Mapping: ck→createCombinedAbortSignal, o9→new AbortController()
```

### Abort Flow Diagram

```
┌─────────────────┐     ┌─────────────────┐
│  Parent Signal  │     │  Timeout Signal │
│ (session abort) │     │ (hook timeout)  │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │    addEventListener   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Combined Controller  │
         │    (new AbortController) │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │    Hook Execution     │
         │  (command/prompt/etc) │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │       Cleanup         │
         │ (removeEventListener) │
         └───────────────────────┘
```

### Workspace Trust Check

```javascript
// ============================================
// shouldSkipWorkspaceTrust - Check if hooks should be skipped
// Location: chunks.146.mjs:3182-3185
// ============================================

// ORIGINAL (for source lookup):
function rX9() {
  if (!!N6()) return !1;
  return !TJ(!1)
}

// READABLE (for understanding):
function shouldSkipWorkspaceTrust() {
  // Remote environments skip trust check
  if (isRemoteEnvironment()) return false;

  // Skip hooks if workspace is not trusted
  return !isWorkspaceTrusted(requireConfirmation = false);
}

// Mapping: rX9→shouldSkipWorkspaceTrust, N6→isRemoteEnvironment, TJ→isWorkspaceTrusted
```

### Managed Hooks Only Check

```javascript
// ============================================
// isAllowManagedHooksOnly - Check enterprise restriction
// Location: chunks.106.mjs:1528-1530
// ============================================

// ORIGINAL (for source lookup):
function t21() {
  return OB("policySettings")?.allowManagedHooksOnly === !0
}

// READABLE (for understanding):
function isAllowManagedHooksOnly() {
  return getPolicySetting("policySettings")?.allowManagedHooksOnly === true;
}

// Mapping: t21→isAllowManagedHooksOnly
```

---

## Main Execution Function

### `executeHooksInREPL` (qa)

The primary hook execution function is an async generator that orchestrates all hook types.

### Key Design Decision: Generator-Based Execution

**What it solves:** Hooks need to yield multiple types of results (messages, permissions, context) without blocking the main loop.

**Why async generator instead of Promise:**
1. **Streaming results:** Can yield partial results as hooks complete
2. **Early termination:** Blocking errors can abort remaining hooks
3. **Memory efficiency:** No need to buffer all results before returning
4. **Interleaved execution:** Multiple hooks can run in parallel, yielding as they complete

**Alternative considered:** Array of promises with `Promise.all`:
- Pro: Simpler mental model
- Con: Cannot yield partial results, must wait for all to complete
- Con: Cannot early-terminate on blocking error

**Key insight:** The generator pattern enables "fire and stream" semantics - hooks execute in parallel but results flow back as soon as they're ready.

```javascript
// ============================================
// executeHooksInREPL - Main hook execution orchestrator
// Location: chunks.147.mjs:3-338
// ============================================

// ORIGINAL (for source lookup):
async function* qa({
  hookInput: A,
  toolUseID: Q,
  matchQuery: B,
  signal: G,
  timeoutMs: Z = ZN,
  toolUseContext: I,
  messages: Y
}) {
  if (l0().disableAllHooks) return;
  let J = A.hook_event_name,
    W = B ? `${J}:${B}` : J;
  if (rX9()) {
    g(`Skipping ${W} hook execution - workspace trust not accepted`);
    return
  }
  let X = I ? await I.getAppState() : void 0,
    V = _V0(X, J, A);
  if (V.length === 0) return;
  if (G?.aborted) return;
  // ... continues with hook execution ...
}

// READABLE (for understanding):
async function* executeHooksInREPL({
  hookInput,
  toolUseID,
  matchQuery,
  signal,
  timeoutMs = DEFAULT_HOOK_TIMEOUT,  // 60000ms
  toolUseContext,
  messages
}) {
  // ==========================================
  // PHASE 1: Pre-Execution Guards
  // ==========================================

  // Guard 1: Global disable check
  if (getSettings().disableAllHooks) return;

  let hookEventName = hookInput.hook_event_name,
    hookName = matchQuery ? `${hookEventName}:${matchQuery}` : hookEventName;

  // Guard 2: Workspace trust check
  if (shouldSkipWorkspaceTrust()) {
    log(`Skipping ${hookName} hook execution - workspace trust not accepted`);
    return;
  }

  // Get app state and matching hooks
  let appState = toolUseContext ? await toolUseContext.getAppState() : undefined,
    matchingHooks = getMatchingHooks(appState, hookEventName, hookInput);

  // Guard 3: No matching hooks
  if (matchingHooks.length === 0) return;

  // Guard 4: Already aborted
  if (signal?.aborted) return;

  // ==========================================
  // PHASE 2: Analytics & Progress
  // ==========================================

  analytics("tengu_run_hook", {
    hookName: hookName,
    numCommands: matchingHooks.length
  });

  // Yield progress message for each hook
  for (let hook of matchingHooks) {
    yield {
      message: {
        type: "progress",
        data: {
          type: "hook_progress",
          hookEvent: hookEventName,
          hookName: hookName,
          command: getHookCommandString(hook),
          promptText: hook.type === "prompt" ? hook.prompt : undefined,
          statusMessage: "statusMessage" in hook ? hook.statusMessage : undefined
        },
        parentToolUseID: toolUseID,
        toolUseID: toolUseID,
        timestamp: new Date().toISOString(),
        uuid: generateUUID()
      }
    };
  }

  // ==========================================
  // PHASE 3: Parallel Hook Execution
  // ==========================================

  let hookGenerators = matchingHooks.map(async function*(hook, hookIndex) {
    // Execute based on hook type
    if (hook.type === "callback") {
      let timeout = hook.timeout ? hook.timeout * 1000 : timeoutMs,
        { signal: combinedSignal, cleanup } = createCombinedAbortSignal(
          AbortSignal.timeout(timeout), signal
        );
      yield executeCallbackHook({ ... }).finally(cleanup);
      return;
    }

    if (hook.type === "function") {
      if (!messages) {
        yield { message: "Messages not provided for function hook", outcome: "non_blocking_error" };
        return;
      }
      yield executeFunctionHook({ hook, messages, hookName, ... });
      return;
    }

    // Command/Prompt/Agent hooks
    let timeout = hook.timeout ? hook.timeout * 1000 : timeoutMs,
      { signal: combinedSignal, cleanup } = createCombinedAbortSignal(
        AbortSignal.timeout(timeout), signal
      );

    try {
      let hookInputJSON = JSON.stringify(hookInput);

      if (hook.type === "prompt") {
        yield await executePromptHook(hook, hookName, hookEventName, hookInputJSON, ...);
        cleanup?.();
        return;
      }

      if (hook.type === "agent") {
        yield await executeAgentHook(hook, hookName, hookEventName, hookInputJSON, ...);
        cleanup?.();
        return;
      }

      // Default: command hook
      let result = await executeShellHook(hook, hookEventName, hookName, hookInputJSON, combinedSignal, hookIndex);
      cleanup?.();

      // Handle abort
      if (result.aborted) {
        yield { message: { type: "hook_cancelled", ... }, outcome: "cancelled", hook };
        return;
      }

      // Parse JSON output
      let { json, plainText, validationError } = parseHookJSONOutput(result.stdout);

      if (validationError) {
        yield { message: { type: "hook_non_blocking_error", stderr: validationError, ... }, outcome: "non_blocking_error", hook };
        return;
      }

      // Process JSON response
      if (json) {
        if (isAsyncHookResponse(json)) {
          yield { outcome: "success", hook };
          return;
        }

        let processed = processHookResponse({ json, command: hook.command, hookName, toolUseID, hookEventName, ... });
        yield { ...processed, outcome: "success", hook };
        return;
      }

      // Handle exit codes
      if (result.status === 0) {
        yield { message: { type: "hook_success", content: result.stdout, ... }, outcome: "success", hook };
      } else if (result.status === 2) {
        // BLOCKING ERROR
        yield { blockingError: { blockingError: result.stderr, command: hook.command }, outcome: "blocking", hook };
      } else {
        // Non-blocking error
        yield { message: { type: "hook_non_blocking_error", stderr: result.stderr, ... }, outcome: "non_blocking_error", hook };
      }

    } catch (error) {
      cleanup?.();
      yield { message: { type: "hook_non_blocking_error", ... }, outcome: "non_blocking_error", hook };
    }
  });

  // ==========================================
  // PHASE 4: Result Aggregation
  // ==========================================

  let outcomes = {
    success: 0,
    blocking: 0,
    non_blocking_error: 0,
    cancelled: 0
  };
  let permissionDecision;

  for await (let result of mergeAsyncGenerators(hookGenerators)) {
    outcomes[result.outcome]++;

    // Yield various result types
    if (result.preventContinuation) yield { preventContinuation: true, stopReason: result.stopReason };
    if (result.blockingError) yield { blockingError: result.blockingError };
    if (result.message) yield { message: result.message };
    if (result.systemMessage) yield { message: { type: "hook_system_message", content: result.systemMessage, ... } };
    if (result.additionalContext) yield { additionalContexts: [result.additionalContext] };
    if (result.updatedMCPToolOutput) yield { updatedMCPToolOutput: result.updatedMCPToolOutput };
    if (result.updatedInput) yield { updatedInput: result.updatedInput };

    // Aggregate permission decisions
    if (result.permissionBehavior) {
      if (!permissionDecision || result.permissionBehavior === "deny") {
        permissionDecision = result.permissionBehavior;
      }
    }

    if (result.permissionRequestResult) yield { permissionRequestResult: result.permissionRequestResult };

    // Execute success callback
    if (appState && result.hook.type !== "callback") {
      let sessionHook = findSessionHook(appState, getSessionId(), hookEventName, matchQuery, result.hook);
      if (sessionHook?.onHookSuccess && result.outcome === "success") {
        sessionHook.onHookSuccess(result.hook, result);
      }
    }
  }

  // Yield aggregated permission decision
  if (permissionDecision) {
    yield { permissionBehavior: permissionDecision };
  }

  // ==========================================
  // PHASE 5: Telemetry
  // ==========================================

  analytics("tengu_repl_hook_finished", {
    hookName: hookName,
    numCommands: matchingHooks.length,
    numSuccess: outcomes.success,
    numBlocking: outcomes.blocking,
    numNonBlockingError: outcomes.non_blocking_error,
    numCancelled: outcomes.cancelled
  });
}
```

---

## Error Handling

### Key Design Decision: No Retry Logic

**Important:** Hooks do NOT have retry logic. This is by design.

| Outcome | Behavior |
|---------|----------|
| Success | Hook completed successfully |
| Blocking Error | Stops execution, no retry |
| Non-blocking Error | Logs warning, continues, no retry |
| Cancelled | Timeout/abort, no retry |

**Why no retries:**
1. **Determinism:** Hooks should produce consistent results; if they fail, retrying likely fails again
2. **Latency:** Hook execution is in the critical path; retries would add unpredictable delays
3. **User control:** If retry is needed, the hook script should implement it internally
4. **Side effects:** Retrying a command hook could cause duplicate side effects (file writes, API calls)

**What to do instead:**
- For transient failures: Implement retry logic inside the hook script
- For timeouts: Increase the `timeout` configuration value
- For blocking errors: Fix the underlying issue, not the symptom

**Key insight:** The hook system is intentionally "thin" - it dispatches to hooks but doesn't try to be smart about error recovery. This keeps the system predictable and puts control in the hook author's hands.

### Exit Code Semantics

For command hooks, exit codes determine outcome:

```
Exit Code 0   → Success
Exit Code 2   → BLOCKING ERROR (stops execution)
Exit Code 1,3+ → Non-blocking error (continues with warning)
```

### Error Types and Messages

```javascript
// Success
{ type: "hook_success", content: stdout, stdout, stderr, exitCode: 0 }

// Blocking Error
{ type: "hook_blocking_error", blockingError: stderr, command }

// Non-blocking Error
{ type: "hook_non_blocking_error", stderr, stdout, exitCode }

// Cancelled (timeout/abort)
{ type: "hook_cancelled" }

// Execution Error
{ type: "hook_error_during_execution", content: errorMessage }
```

### JSON Validation Errors

```javascript
// When JSON output fails validation:
{
  type: "hook_non_blocking_error",
  stderr: "Hook JSON output validation failed:\n  - path.to.field: error message",
  stdout: originalOutput,
  exitCode: 1
}
```

---

## Permission Integration

### Hook-Based Permission Decisions

Hooks can return permission decisions that override the default permission flow.

### Permission Decision Values

| Value | Effect |
|-------|--------|
| `"allow"` | Auto-approve the permission request |
| `"deny"` | Auto-deny the permission request (blocking) |
| `"ask"` | Prompt user as normal (default behavior) |

### PreToolUse Permission Override

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "Command matches whitelist",
    "updatedInput": { /* optional modified input */ }
  }
}
```

### PermissionRequest Decision

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow",
      "updatedInput": { /* optional */ },
      "updatedPermissions": [ /* optional */ ]
    }
  }
}
```

Or to deny:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "deny",
      "message": "Command not allowed by policy",
      "interrupt": true
    }
  }
}
```

### Key Design Decision: Permission Aggregation ("Deny Wins")

**What it solves:** Multiple hooks can return conflicting permission decisions (allow/deny/ask). Need a deterministic way to resolve conflicts.

**The rule:** When multiple hooks return permission decisions, **deny takes precedence**:

```javascript
// In executeHooksInREPL:
if (result.permissionBehavior) {
  if (!permissionDecision || result.permissionBehavior === "deny") {
    permissionDecision = result.permissionBehavior;
  }
}
```

**Why "deny wins":**
1. **Security principle:** Fail-closed is safer than fail-open
2. **Veto power:** Any hook can block an action, but no hook can force approval against another's denial
3. **Enterprise control:** Managed hooks can always deny, even if project hooks allow

**Resolution order:**
| Hook 1 | Hook 2 | Result |
|--------|--------|--------|
| allow | allow | allow |
| allow | deny | **deny** |
| deny | allow | **deny** |
| ask | deny | **deny** |
| ask | allow | allow |

**Alternative considered:** "First decision wins" or voting system
- Pro: More predictable order
- Con: Depends on hook execution order (non-deterministic in parallel)
- Con: Security hooks might lose to earlier-finishing non-security hooks

**Key insight:** This is the same pattern used in Unix permissions (any deny = denied) and firewall rules. It creates a reliable security boundary.

---

## Event-Specific Execution Functions

Each hook event has a dedicated wrapper function that builds the appropriate hook input.

### Tool Events

```javascript
// PreToolUse
async function* executePreToolUseHooks(toolName, toolUseID, toolInput, context, appState, signal, timeout)

// PostToolUse
async function* executePostToolUseHooks(toolName, toolUseID, toolInput, toolResponse, appState, context, signal, timeout)

// PostToolUseFailure
async function* executePostToolUseFailureHooks(toolName, toolUseID, toolInput, error, isInterrupt, appState, context, signal, timeout)
```

### Session Events

```javascript
// SessionStart
async function* executeSessionStartHooks(source, agentContext, signal, timeout)

// SessionEnd (non-generator)
async function executeSessionEndHooks(reason, options)

// Stop / SubagentStop
async function* executeStopHooks(appState, signal, timeout, stopHookActive, agentId?, context?, messages?)
```

### User Events

```javascript
// UserPromptSubmit
async function* executeUserPromptSubmitHooks(prompt, appState, toolUseContext)

// Notification (non-generator)
async function executeNotificationHooks(notification, timeout)
```

### Compaction Events

```javascript
// PreCompact (non-generator, returns new instructions)
async function executePreCompactHooks(compactInput, signal, timeout): Promise<{
  newCustomInstructions?: string,
  userDisplayMessage?: string
}>
```

### Permission Events

```javascript
// PermissionRequest
async function* executePermissionRequestHooks(toolName, toolUseID, toolInput, context, appState, permissionSuggestions, signal, timeout)
```

### Subagent Events

```javascript
// SubagentStart
async function* executeSubagentStartHooks(agentId, agentType, signal, timeout)
```

---

## Hook Context Builder

```javascript
// ============================================
// createHookContext - Build base hook context
// Location: chunks.146.mjs:3187-3195
// ============================================

// ORIGINAL (for source lookup):
function tE(A, Q) {
  let B = Q ?? e1();
  return {
    session_id: B,
    transcript_path: WSA(B),
    cwd: W0(),
    permission_mode: A
  }
}

// READABLE (for understanding):
function createHookContext(permissionContext, sessionIdOverride) {
  let sessionId = sessionIdOverride ?? getSessionId();

  return {
    session_id: sessionId,
    transcript_path: getSessionTranscriptPath(sessionId),
    cwd: getCurrentWorkingDirectory(),
    permission_mode: permissionContext
  };
}

// Mapping: tE→createHookContext, e1→getSessionId, WSA→getSessionTranscriptPath, W0→getCurrentWorkingDirectory
```

---

## Telemetry Events

```javascript
// Hook execution start
analytics("tengu_run_hook", {
  hookName: string,      // e.g., "PreToolUse:Write"
  numCommands: number    // Count of matching hooks
});

// Hook execution complete
analytics("tengu_repl_hook_finished", {
  hookName: string,
  numCommands: number,
  numSuccess: number,
  numBlocking: number,
  numNonBlockingError: number,
  numCancelled: number
});

// Permission granted by hook
analytics("tengu_tool_use_granted_by_permission_hook");
```

**Telemetry Use Cases:**
- Monitor hook execution frequency and performance
- Track blocking error rates
- Identify slow or problematic hooks
- Measure permission automation effectiveness

---

## Async Hook Tracking System

When a hook returns `{"async": true}`, it enters the async tracking system for background execution.

### Async Hook Lifecycle

```
1. Hook outputs {"async": true} as first JSON line
       ↓
2. Process backgrounded via shellCommand.background(taskId)
       ↓
3. taskId = "async_hook_${pid}" registered in global Map
       ↓
4. Stdout/stderr accumulated in registry (xZ2, vZ2 functions)
       ↓
5. bZ2() polls for completion
       ↓
6. Completion detected when non-async JSON found in stdout
       ↓
7. Results returned: {processId, response, hookName, hookEvent, stdout, stderr, exitCode}
       ↓
8. Registry entry cleaned up
```

### Registry Structure

```typescript
// Global async hook registry (qh Map)
Map<string, {
  processId: string;           // "async_hook_12345"
  hookName: string;            // "PostToolUse:Write"
  hookEvent: string;           // "PostToolUse"
  toolName?: string;           // "Write"
  command: string;             // Hook command
  startTime: number;           // Date.now() at registration
  timeout: number;             // From asyncTimeout or default 15000ms
  stdout: string;              // Accumulated stdout
  stderr: string;              // Accumulated stderr
  responseAttachmentSent: boolean;  // Prevents duplicate processing
  shellCommand: ShellCommand;  // For process management
}>
```

### Special Handling

**SessionStart async hooks:** After completion, calls `LNB()` to invalidate session environment cache, allowing subsequent hooks to see any environment changes made by the async hook.

---

## Hook Deduplication Algorithm

When multiple hooks from different sources match the same event, deduplication prevents duplicate execution.

### Deduplication by Hook Type

| Hook Type | Deduplication Key | Behavior |
|-----------|------------------|----------|
| Command | `command` string | Hooks with identical command strings are deduplicated |
| Prompt | `prompt` string | Hooks with identical prompts are deduplicated |
| Agent | `prompt([])` evaluation | Hooks with identical prompt output are deduplicated |
| Callback | Never deduplicated | All callback hooks execute |
| Function | Never deduplicated | All function hooks execute |

### Implementation

```javascript
// Deduplication using Map with type-specific keys
let commandHooks = Array.from(
  new Map(allHooks.filter(h => h.type === "command")
    .map(h => [h.command, h])).values()  // Key = command string
);

let promptHooks = Array.from(
  new Map(allHooks.filter(h => h.type === "prompt")
    .map(h => [h.prompt, h])).values()   // Key = prompt string
);

let agentHooks = Array.from(
  new Map(allHooks.filter(h => h.type === "agent")
    .map(h => [h.prompt([]), h])).values()  // Key = prompt evaluation
);

let callbackHooks = allHooks.filter(h => h.type === "callback");
// No deduplication for callbacks
```

### Debug Log

When deduplication occurs, the system logs:
```
Hooks: Matched 3 unique hooks for query "Write" (5 before deduplication)
```

---

## StatusLine Hook Execution

StatusLine is a special hook type that displays custom status information.

### Configuration

```json
{
  "statusLine": {
    "type": "command",
    "command": "echo 'Branch: $(git branch --show-current)'",
    "padding": 2
  }
}
```

### Execution Details

| Property | Value |
|----------|-------|
| Executor Function | `cJ0()` |
| Default Timeout | 5000ms (5 seconds) |
| Event Name | "StatusLine" |
| Error Handling | Caught and logged (graceful degradation) |
| Return Value | Trimmed multi-line stdout or `undefined` |

### Key Behaviors

1. **Disabled when `disableAllHooks` is true:** StatusLine respects the global hook disable setting
2. **Only command type supported:** `statusLine.type` must be `"command"`
3. **Graceful degradation:** Errors are caught and logged, never thrown
4. **Input:** Stringified AppState passed to hook
5. **Output:** Multi-line output trimmed and returned for display

### Integration Warning

When StatusLine is configured but hooks are disabled:
```
Warning: Status line is configured but disableAllHooks is true
```

---

## Hook Progress Message Structure

Each hook yields progress messages during execution for UI feedback.

### Message Format

```typescript
{
  type: "progress",
  data: {
    type: "hook_progress",
    hookEvent: string,          // "PreToolUse", "PostToolUse", etc.
    hookName: string,           // "PreToolUse:Write"
    command: string,            // Formatted command for display
    promptText?: string,        // For prompt hooks only
    statusMessage?: string      // Custom status message if specified
  },
  parentToolUseID: string,
  toolUseID: string,
  timestamp: string,            // ISO 8601 timestamp
  uuid: string                  // Unique message identifier
}
```

### Spinner Integration

The UI integrates hook progress with spinners:
```javascript
Q.setSpinnerColor?.("claudeBlue_FOR_SYSTEM_SPINNER");
Q.setSpinnerShimmerColor?.("claudeBlueShimmer_FOR_SYSTEM_SPINNER");
Q.setSpinnerMessage?.("Running PreCompact hooks...");
```

After hook completion, colors and messages are reset with `null`.

---

## Workspace Trust Integration

Hooks check workspace trust before execution to prevent untrusted code from running hooks.

### Trust Check Logic

```javascript
function shouldSkipWorkspaceTrust() {
  // Remote environments bypass trust check entirely
  if (isRemoteEnvironment()) return false;

  // Skip hooks if workspace is not trusted
  return !isWorkspaceTrusted(requireConfirmation = false);
}
```

### Check Flow

```
User runs Claude Code
       ↓
Hook execution requested
       ↓
Check: Is this a remote environment?
  Yes → Proceed (trust assumed)
  No  → Check workspace trust
            ↓
       Is workspace trusted?
         Yes → Proceed with hook execution
         No  → Skip hooks silently with log message
```

### Log Output

When hooks are skipped due to trust:
```
Skipping PostToolUse:Write hook execution - workspace trust not accepted
```

---

## Generator vs Non-Generator Execution

Hook events are executed in two modes depending on their nature.

### Generator (Streaming) Events

These hooks yield results as they complete, enabling real-time feedback:

| Event | Function | Use Case |
|-------|----------|----------|
| PreToolUse | `OV0()` | Early termination on blocking |
| PostToolUse | `RV0()` | Stream context additions |
| PostToolUseFailure | `TV0()` | Stream error handling |
| SessionStart | `WQ0()` | Stream initial context |
| SubagentStart | `rX0()` | Stream subagent context |
| SubagentStop | `PV0()` | Stream cleanup results |
| Stop | `PV0()` | Stream interruption handling |
| UserPromptSubmit | `k60()` | Stream prompt context |
| PermissionRequest | `mW0()` | Stream permission decisions |

### Non-Generator (Collected) Events

These hooks collect all results before returning:

| Event | Function | Return Type |
|-------|----------|-------------|
| SessionEnd | `yV0()` | `void` (fire-and-forget) |
| PreCompact | `FQ0()` | `{newCustomInstructions?, userDisplayMessage?}` |
| Notification | `B60()` | `void` (fire-and-forget) |

### Executor Functions

- **Generator mode:** `qa()` - Main async generator for REPL context
- **Non-generator mode:** `kV0()` - Returns array of collected results

---

## SessionStart Special Handling

SessionStart hooks have special behavior for environment setup.

### Environment File Injection

Only SessionStart hooks receive the `CLAUDE_ENV_FILE` environment variable:

```javascript
if (hookEvent === "SessionStart" && hookIndex !== undefined) {
  env.CLAUDE_ENV_FILE = getEnvFilePath(hookIndex);
}
```

### Post-Execution Cache Invalidation

After SessionStart hooks complete (including async ones), the system invalidates the session environment cache:

```javascript
// In bZ2() async hook polling
if (event === "SessionStart") {
  LNB();  // Invalidate session env cache
}
```

**Purpose:** Allows SessionStart hooks to set up environment variables that subsequent hooks can see.

---

## Hook Timeout Error Codes

Command hooks can fail with specific error codes indicating the failure type.

### Error Types

| Error Code | Name | Cause | Handling |
|------------|------|-------|----------|
| `EPIPE` | Pipe Error | Hook closed stdin early | Returns error message with stderr |
| `ABORT_ERR` | Abort Error | Signal aborted (timeout/cancellation) | Returns `{aborted: true}` |
| Other | Generic Error | Any other error | Returns stringified error message |

### EPIPE Handling

```javascript
// Hook closed stdin before all data was written
if (error.code === "EPIPE") {
  return {
    stdout: stdoutBuffer,
    stderr: `Hook closed stdin early: ${stderrBuffer}`,
    status: 1
  };
}
```

### Abort Handling

```javascript
// Timeout or user cancellation
if (error.name === "ABORT_ERR" || signal.aborted) {
  return { aborted: true };
}
```

---

## Function Hook REPL Restriction

Function hooks have a strict execution context requirement.

### Restriction Details

| Aspect | Constraint |
|--------|------------|
| Valid Context | REPL/Stop hooks only |
| Invalid Context | Outside REPL (e.g., headless mode) |
| Error Message | "Function hook reached executeHooksOutsideREPL" |
| Requirement | Must have access to `messages` array |

### Implementation

```javascript
// In kV0() (executeHooksOutsideREPL)
if (hook.type === "function") {
  log("Error: Function hook reached executeHooksOutsideREPL");
  return { outcome: "non_blocking_error", hook };
}
```

### Design Intent

Function hooks are specifically designed for Stop hooks that need to analyze the conversation history. They require:
1. Access to the full message array
2. REPL context for interactive decisions
3. Ability to block further execution based on conversation state

**Use Case Example:** A Stop hook that checks if the conversation contains unresolved errors before allowing the user to interrupt.

---

## Hook Trigger Points Reference

Complete reference of where each hook is triggered in the codebase.

### Tool Lifecycle Hooks

| Hook | Trigger Location | Data Passed |
|------|-----------------|-------------|
| PreToolUse | `chunks.146.mjs:2721` (ak3 generator) | tool_name, tool_input, tool_use_id |
| PostToolUse | `chunks.146.mjs:2575` (ik3 generator) | tool_name, tool_input, tool_response, tool_use_id |
| PostToolUseFailure | `chunks.146.mjs:2656` (nk3 generator) | tool_name, tool_input, error, is_interrupt |
| PermissionRequest | `chunks.142.mjs:2738` (SYA) | tool_name, tool_input, permission_suggestions |

### Session Lifecycle Hooks

| Hook | Trigger Location | Data Passed |
|------|-----------------|-------------|
| SessionStart | `chunks.107.mjs:1094` | source |
| SessionEnd | `chunks.147.mjs:639` | reason |
| SubagentStart | `chunks.145.mjs:1105` | agent_id, agent_type |
| SubagentStop | `chunks.147.mjs:532` | stop_hook_active, agent_id |

### User Interaction Hooks

| Hook | Trigger Location | Data Passed |
|------|-----------------|-------------|
| UserPromptSubmit | `chunks.121.mjs:1618` | prompt |
| Stop | `chunks.146.mjs:2030` | stop_hook_active (always true) |
| Notification | `chunks.120.mjs:1435` | message, title, notification_type |

### Context Management Hooks

| Hook | Trigger Location | Data Passed |
|------|-----------------|-------------|
| PreCompact | `chunks.107.mjs:1133` | trigger ("auto"/"manual"), custom_instructions |

---

## Summary

Hook execution in Claude Code follows a well-defined flow:

1. **Pre-Execution Guards** - Check global disable, workspace trust, and abort signal
2. **Configuration Loading** - Aggregate hooks from managed, user, project, and session sources
3. **Hook Matching** - Filter hooks by event type and matcher pattern
4. **Parallel Execution** - Execute all matching hooks concurrently
5. **Result Processing** - Parse JSON output, handle exit codes, process special fields
6. **Permission Integration** - Aggregate permission decisions (deny takes precedence)
7. **Telemetry** - Emit analytics events for monitoring

Key design decisions:
- **No retry logic** - Hooks either succeed or fail, no automatic retries
- **Exit code 2 = blocking** - Special exit code for critical failures
- **Signal combination** - Nested timeouts via `createCombinedAbortSignal()`
- **Deny takes precedence** - Multiple hooks can vote on permissions

---

## See Also

- [Hook Types](./types.md) - Hook type definitions and schemas
- [Hook Configuration](./configuration.md) - Configuration and custom hook development
