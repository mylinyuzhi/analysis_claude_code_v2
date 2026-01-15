# Hook System Internals

## Overview

This document covers advanced implementation details of the Claude Code hook system for SDK developers and contributors. It provides insights into internal data structures, caching mechanisms, and debug capabilities.

> **Note:** This is an advanced reference document. For user-facing documentation, see [configuration.md](./configuration.md), [types.md](./types.md), and [execution.md](./execution.md).

---

## Symbol Mapping Reference

The Claude Code source uses minified function and variable names. This reference maps obfuscated symbols to their readable equivalents.

### Core Hook Functions

| Minified | Readable | Location | Description |
|----------|----------|----------|-------------|
| `qa` | `executeHooksInREPL` | chunks.147.mjs:3 | Main async generator for REPL hook execution |
| `kV0` | `executeHooksOutsideREPL` | chunks.147.mjs:340 | Non-generator hook executor |
| `SV0` | `executeShellHook` | chunks.146.mjs:3337 | Shell command hook executor |
| `eP2` | `executePromptHook` | chunks.121.mjs:1754 | LLM prompt hook executor |
| `aX9` | `executeAgentHook` | chunks.146.mjs:2937 | Agent hook executor |
| `Qy3` | `executeCallbackHook` | chunks.147.mjs:756 | Callback hook executor |
| `Ay3` | `executeFunctionHook` | chunks.147.mjs:698 | Function hook executor |

### Configuration Functions

| Minified | Readable | Location | Description |
|----------|----------|----------|-------------|
| `ek3` | `loadAllHooks` | chunks.146.mjs:3445 | Aggregates hooks from all sources |
| `_V0` | `getMatchingHooks` | chunks.146.mjs:3478 | Filters hooks by event and matcher |
| `tk3` | `matchPattern` | chunks.146.mjs:3432 | Pattern matcher for hook matchers |
| `SZ2` | `getSettingsHooks` | chunks.106.mjs:1598 | Gets cached settings hooks |
| `MkA` | `getAdditionalHooks` | chunks.106.mjs | Gets plugin/project hooks |
| `r21` | `getSessionHooks` | chunks.106.mjs:1285 | Gets session-registered hooks |

### Async Hook Registry Functions

| Minified | Readable | Location | Description |
|----------|----------|----------|-------------|
| `yZ2` | `registerAsyncHook` | chunks.106.mjs:1744 | Registers async hook in registry |
| `xZ2` | `appendAsyncStdout` | chunks.106.mjs:1769 | Appends stdout to async hook |
| `vZ2` | `appendAsyncStderr` | chunks.106.mjs:1775 | Appends stderr to async hook |
| `bZ2` | `pollAsyncHooks` | chunks.106.mjs:1781 | Polls for completed async hooks |
| `fZ2` | `cleanupAsyncHooks` | chunks.106.mjs:1832 | Removes processed async hooks |

### State and Context Functions

| Minified | Readable | Location | Description |
|----------|----------|----------|-------------|
| `tE` | `createHookContext` | chunks.146.mjs:3187 | Builds base hook context |
| `ck` | `createCombinedAbortSignal` | chunks.106.mjs:1725 | Combines multiple abort signals |
| `zYA` | `isAsyncHookResponse` | chunks.106.mjs:1665 | Checks for async response marker |
| `oX9` | `parseHookJSONOutput` | chunks.146.mjs:3197 | Parses hook JSON output |
| `tX9` | `processHookResponse` | chunks.146.mjs:3227 | Processes hook JSON response |

### Global Variables

| Minified | Readable | Location | Description |
|----------|----------|----------|-------------|
| `Oi` | `hooksCache` | chunks.106.mjs | Cached hook configuration |
| `qh` | `asyncHookRegistry` | chunks.106.mjs | Global Map for async hooks |
| `ZN` | `DEFAULT_HOOK_TIMEOUT` | chunks.147.mjs | Default timeout (60000ms) |
| `zLA` | `HOOK_EVENT_TYPES` | chunks.94.mjs:2194 | Array of hook event names |

---

## Async Hook Registry Internals

### Registry Data Structure

The async hook registry (`qh`) is a global `Map` that tracks backgrounded hooks:

```javascript
// Global registry (qh)
const asyncHookRegistry = new Map();

// Entry structure
interface AsyncHookEntry {
  processId: string;              // "async_hook_12345"
  asyncResponse: {                // Original async response
    async: true;
    asyncTimeout?: number;
  };
  hookName: string;               // "PostToolUse:Write"
  hookEvent: string;              // "PostToolUse"
  toolName?: string;              // "Write"
  command: string;                // Hook command string
  shellCommand: ShellCommand;     // Process management object
  startTime: number;              // Date.now() at registration
  timeout: number;                // Effective timeout (asyncTimeout or 15000)
  stdout: string;                 // Accumulated stdout
  stderr: string;                 // Accumulated stderr
  responseAttachmentSent: boolean; // Prevents duplicate processing
}
```

### Registration Flow (yZ2)

```javascript
function registerAsyncHook({
  processId,
  asyncResponse,
  hookName,
  hookEvent,
  command,
  shellCommand,
  toolName
}) {
  const timeout = asyncResponse.asyncTimeout ?? 15000;  // Default 15s

  asyncHookRegistry.set(processId, {
    processId,
    asyncResponse,
    hookName,
    hookEvent,
    toolName,
    command,
    shellCommand,
    startTime: Date.now(),
    timeout,
    stdout: "",
    stderr: "",
    responseAttachmentSent: false
  });

  log(`Registered async hook ${processId} with timeout ${timeout}ms`);
}
```

### Polling Mechanism (bZ2)

The polling function checks for completed async hooks:

```javascript
async function pollAsyncHooks() {
  const results = [];
  const toRemove = [];

  for (const [processId, entry] of asyncHookRegistry) {
    // Check removal conditions
    if (!entry.shellCommand ||
        entry.shellCommand.status === "killed" ||
        entry.responseAttachmentSent ||
        !entry.stdout) {
      toRemove.push(processId);
      continue;
    }

    // Check for completion
    const exitCode = await entry.shellCommand.result.code;

    // Parse stdout for non-async JSON response
    const lines = entry.stdout.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("{")) continue;

      try {
        const parsed = JSON.parse(trimmed);
        if (!isAsyncHookResponse(parsed)) {  // Not {"async": true}
          results.push({
            processId,
            response: parsed,
            hookName: entry.hookName,
            hookEvent: entry.hookEvent,
            toolName: entry.toolName,
            stdout: entry.stdout,
            stderr: entry.stderr,
            exitCode
          });
          entry.responseAttachmentSent = true;

          // Special handling for SessionStart
          if (entry.hookEvent === "SessionStart") {
            invalidateSessionEnvCache();  // LNB()
          }
          break;
        }
      } catch {
        // Not valid JSON, continue
      }
    }
  }

  // Cleanup processed entries
  for (const id of toRemove) {
    asyncHookRegistry.delete(id);
  }

  return results;
}
```

### Stdout/Stderr Accumulation

```javascript
function appendAsyncStdout(processId, data) {
  const entry = asyncHookRegistry.get(processId);
  if (entry) {
    entry.stdout += data;
    log(`Adding stdout to ${processId}: ${data.substring(0, 50)}...`);
  }
}

function appendAsyncStderr(processId, data) {
  const entry = asyncHookRegistry.get(processId);
  if (entry) {
    entry.stderr += data;
    log(`Adding stderr to ${processId}: ${data.substring(0, 50)}...`);
  }
}
```

---

## Hook Caching System

### Settings Hook Cache (Oi)

Hook configurations are cached after first load:

```javascript
// Global cache variable
let hooksCache = null;

function getSettingsHooks() {
  if (hooksCache === null) {
    initializeHooksCache();  // S00()
  }
  return hooksCache;
}

function initializeHooksCache() {
  const hookSources = getHookSources();  // P00()
  hooksCache = parseAndValidateHooks(hookSources);
}
```

### Cache Invalidation

The cache is invalidated when settings change:

```javascript
function invalidateHooksCache() {
  hooksCache = null;
  log("Hooks cache invalidated");
}
```

### Session Environment Cache

For SessionStart hooks, there's a separate environment cache:

```javascript
function invalidateSessionEnvCache() {
  // LNB() - Called after SessionStart hooks complete
  sessionEnvCache = null;
  log("Session environment cache invalidated");
}
```

---

## Session Hook Lifecycle

### Registration (kK5)

```javascript
function registerSessionHook(
  setAppState,
  sessionId,
  hookEventType,
  matcher,
  hookConfig,
  onSuccessCallback
) {
  setAppState((state) => {
    // Create session entry if needed
    if (!state.sessionHooks[sessionId]) {
      state.sessionHooks[sessionId] = { hooks: {} };
    }

    const session = state.sessionHooks[sessionId];

    // Create event type entry if needed
    if (!session.hooks[hookEventType]) {
      session.hooks[hookEventType] = [];
    }

    // Find existing matcher group or create new
    let matcherGroup = session.hooks[hookEventType]
      .find(g => g.matcher === matcher);

    if (!matcherGroup) {
      matcherGroup = { matcher, hooks: [] };
      session.hooks[hookEventType].push(matcherGroup);
    }

    // Add hook with optional success callback
    matcherGroup.hooks.push({
      hook: hookConfig,
      onHookSuccess: onSuccessCallback
    });

    return state;
  });

  log(`Registered session hook: ${hookEventType}:${matcher} for session ${sessionId}`);
}
```

### Cleanup (o21)

```javascript
function unregisterSessionHook(setAppState, sessionId) {
  setAppState((state) => {
    delete state.sessionHooks[sessionId];
    return state;
  });

  log(`Cleared all session hooks for session ${sessionId}`);
}
```

### Hook Retrieval (r21)

```javascript
function getSessionHooks(appState, sessionId, specificEventType) {
  const session = appState.sessionHooks[sessionId];
  if (!session) return new Map();

  const result = new Map();

  if (specificEventType) {
    // Return hooks for specific event only
    const hooks = session.hooks[specificEventType];
    if (hooks) result.set(specificEventType, normalizeHooks(hooks));
    return result;
  }

  // Return hooks for all event types
  for (const eventType of HOOK_EVENT_TYPES) {
    const hooks = session.hooks[eventType];
    if (hooks) result.set(eventType, normalizeHooks(hooks));
  }

  return result;
}
```

---

## Debug Logging

### Enable Debug Mode

Set the `DEBUG` environment variable:

```bash
# Enable hook-specific logging
export DEBUG=claude-code:hooks

# Enable all Claude Code logging
export DEBUG=claude-code:*
```

### Log Output Categories

| Category | Example Output |
|----------|---------------|
| Hook matching | `Getting matching hook commands for PostToolUse with query: Write` |
| Deduplication | `Matched 3 unique hooks for query "Write" (5 before deduplication)` |
| Async detection | `Checking initial response for async: {"async": true}` |
| Backgrounding | `Detected async hook, backgrounding process async_hook_12345` |
| Execution | `Executing command hook: /path/to/script.sh` |
| JSON parsing | `Failed to parse initial response as JSON: SyntaxError...` |

### Debug Function (g)

The internal debug function logs with timestamps:

```javascript
function log(message) {
  if (process.env.DEBUG?.includes("claude-code:hooks")) {
    console.debug(`[${new Date().toISOString()}] Hooks: ${message}`);
  }
}
```

---

## Hook Background Process Management

### Process Backgrounding

When async hooks are detected, the process is backgrounded:

```javascript
// In SV0 (executeShellHook)
if (isAsyncHookResponse(parsed)) {
  const taskId = `async_hook_${childProcess.pid}`;
  log(`Detected async hook, backgrounding process ${taskId}`);

  const backgrounded = shellWrapper.background(taskId);
  if (backgrounded) {
    // Register in async hook registry
    registerAsyncHook({
      processId: taskId,
      asyncResponse: parsed,
      hookEvent,
      hookName,
      command: hook.command,
      shellCommand: shellWrapper
    });

    // Attach stream listeners
    backgrounded.stdoutStream.on("data", (data) => {
      appendAsyncStdout(taskId, data.toString());
    });
    backgrounded.stderrStream.on("data", (data) => {
      appendAsyncStderr(taskId, data.toString());
    });

    // Resolve immediately
    resolver({ stdout: stdoutBuffer, stderr: stderrBuffer, status: 0 });
  }
}
```

### ShellCommand Interface

```typescript
interface ShellCommand {
  pid: number;
  status: "running" | "completed" | "killed";
  result: {
    code: Promise<number>;
  };
  background(taskId: string): {
    stdoutStream: ReadableStream;
    stderrStream: ReadableStream;
  } | null;
  kill(): void;
}
```

---

## Abort Signal Management

### Combined Signal Creation (ck)

```javascript
function createCombinedAbortSignal(signal1, signal2) {
  const controller = new AbortController();

  const abortHandler = () => {
    controller.abort();
  };

  signal1.addEventListener("abort", abortHandler);
  signal2?.addEventListener("abort", abortHandler);

  const cleanup = () => {
    signal1.removeEventListener("abort", abortHandler);
    signal2?.removeEventListener("abort", abortHandler);
  };

  return {
    signal: controller.signal,
    cleanup
  };
}
```

### Usage Pattern

```javascript
// Create combined signal with timeout
const { signal: combinedSignal, cleanup } = createCombinedAbortSignal(
  AbortSignal.timeout(timeoutMs),
  parentSignal
);

try {
  // Execute with combined signal
  const result = await executeHook(hook, combinedSignal);
  return result;
} finally {
  // Always cleanup to prevent memory leaks
  cleanup();
}
```

---

## Hook Result Processing

### JSON Output Parser (oX9)

```javascript
function parseHookJSONOutput(stdout) {
  const trimmed = stdout.trim();

  // Only parse if starts with "{"
  if (!trimmed.startsWith("{")) {
    return { plainText: stdout };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const validated = hookOutputSchema.safeParse(parsed);

    if (validated.success) {
      return { json: validated.data };
    } else {
      const errors = validated.error.errors
        .map(e => `  - ${e.path.join(".")}: ${e.message}`)
        .join("\n");
      return {
        plainText: stdout,
        validationError: `Hook JSON output validation failed:\n${errors}`
      };
    }
  } catch {
    return { plainText: stdout };
  }
}
```

### Response Processor (tX9)

```javascript
function processHookResponse({
  json,
  command,
  hookName,
  toolUseID,
  hookEvent,
  expectedHookEvent,
  stdout,
  stderr,
  exitCode
}) {
  const result = {};

  // Handle continue field
  if (json.continue === false) {
    result.preventContinuation = true;
    if (json.stopReason) result.stopReason = json.stopReason;
  }

  // Handle legacy decision field
  if (json.decision === "approve") {
    result.permissionBehavior = "allow";
  } else if (json.decision === "block") {
    result.permissionBehavior = "deny";
    result.blockingError = {
      blockingError: json.reason || "Blocked by hook",
      command
    };
  }

  // Handle systemMessage
  if (json.systemMessage) {
    result.systemMessage = json.systemMessage;
  }

  // Handle hookSpecificOutput
  if (json.hookSpecificOutput) {
    // Validate event name matches
    if (expectedHookEvent &&
        json.hookSpecificOutput.hookEventName !== expectedHookEvent) {
      throw Error(`Hook returned incorrect event name`);
    }

    // Process based on event type
    processEventSpecificOutput(json.hookSpecificOutput, result);
  }

  return result;
}
```

---

## Policy Settings Integration

### allowManagedHooksOnly Check

```javascript
function isAllowManagedHooksOnly() {
  const policySettings = getPolicySetting("policySettings");
  return policySettings?.allowManagedHooksOnly === true;
}
```

### Hook Source Resolution

```javascript
function getHookSources() {
  const policySettings = getPolicySetting("policySettings");

  // If managed-only mode, only use managed hooks
  if (policySettings?.allowManagedHooksOnly === true) {
    return policySettings.hooks ?? {};
  }

  // Otherwise use merged user/project settings
  return getSettings().hooks ?? {};
}
```

---

## Plugin Hooks Loading

### Overview

Plugin hooks are loaded once per session at startup via a memoized function. This ensures efficient loading without re-parsing plugin configurations on every hook execution.

### Plugin Hooks Storage (`LkA`, `MkA`)

**Location:** `chunks.1.mjs:2823-2829`

```javascript
// ============================================
// setRegisteredHooks / getRegisteredHooks - Global plugin hooks storage
// Location: chunks.1.mjs:2823-2829
// ============================================

// ORIGINAL (for source lookup):
function LkA(A) {
  WQ.registeredHooks = A
}
function MkA() {
  return WQ.registeredHooks
}

// READABLE (for understanding):
function setRegisteredHooks(hooks) {
  globalState.registeredHooks = hooks;
}
function getRegisteredHooks() {
  return globalState.registeredHooks;
}

// Mapping: LkA→setRegisteredHooks, MkA→getRegisteredHooks, WQ→globalState
```

### Plugin Hooks Loader (`_1A`)

**Location:** `chunks.107.mjs:1045-1071`

The loader is wrapped with `s1()` (memoize) to ensure hooks are only loaded once per session.

```javascript
// ============================================
// loadPluginHooks - Memoized plugin hooks loader
// Location: chunks.107.mjs:1045-1071
// ============================================

// ORIGINAL (for source lookup):
_1A = s1(async () => {
  let {
    enabled: A
  } = await l7(), Q = {
    PreToolUse: [],
    PostToolUse: [],
    PostToolUseFailure: [],
    Notification: [],
    UserPromptSubmit: [],
    SessionStart: [],
    SessionEnd: [],
    Stop: [],
    SubagentStart: [],
    SubagentStop: [],
    PreCompact: [],
    PermissionRequest: []
  };
  for (let G of A) {
    if (!G.hooksConfig) continue;
    g(`Loading hooks from plugin: ${G.name}`);
    let Z = SD5(G);
    for (let I of Object.keys(Z)) Q[I].push(...Z[I])
  }
  LkA(Q);
  let B = Object.values(Q).reduce((G, Z) => G + Z.reduce((I, Y) => I + Y.hooks.length, 0), 0);
  g(`Registered ${B} hooks from ${A.length} plugins`)
})

// READABLE (for understanding):
const loadPluginHooks = memoize(async () => {
  let { enabled: enabledPlugins } = await getEnabledPlugins();
  let aggregatedHooks = {
    PreToolUse: [], PostToolUse: [], PostToolUseFailure: [],
    Notification: [], UserPromptSubmit: [], SessionStart: [],
    SessionEnd: [], Stop: [], SubagentStart: [], SubagentStop: [],
    PreCompact: [], PermissionRequest: []
  };

  for (let plugin of enabledPlugins) {
    if (!plugin.hooksConfig) continue;
    log(`Loading hooks from plugin: ${plugin.name}`);
    let extractedHooks = extractPluginHooks(plugin);
    for (let eventType of Object.keys(extractedHooks)) {
      aggregatedHooks[eventType].push(...extractedHooks[eventType]);
    }
  }

  setRegisteredHooks(aggregatedHooks);
  let totalHooks = Object.values(aggregatedHooks).reduce(
    (sum, groups) => sum + groups.reduce((s, g) => s + g.hooks.length, 0), 0
  );
  log(`Registered ${totalHooks} hooks from ${enabledPlugins.length} plugins`);
});

// Mapping: _1A→loadPluginHooks, s1→memoize, l7→getEnabledPlugins,
//          SD5→extractPluginHooks, LkA→setRegisteredHooks
```

### Plugin Hook Extraction (`SD5`)

**Location:** `chunks.107.mjs:999-1030`

Extracts hooks from a single plugin's `hooksConfig` configuration.

```javascript
// ============================================
// extractPluginHooks - Parse hooks from plugin config
// Location: chunks.107.mjs:999-1030
// ============================================

// ORIGINAL (for source lookup):
function SD5(A) {
  let Q = {
    PreToolUse: [],
    PostToolUse: [],
    PostToolUseFailure: [],
    Notification: [],
    UserPromptSubmit: [],
    SessionStart: [],
    SessionEnd: [],
    Stop: [],
    SubagentStart: [],
    SubagentStop: [],
    PreCompact: [],
    PermissionRequest: []
  };
  if (!A.hooksConfig) return Q;
  for (let [B, G] of Object.entries(A.hooksConfig)) {
    let Z = B;
    if (!Q[Z]) continue;
    for (let I of G) {
      let Y = [];
      for (let J of I.hooks)
        if (J.type === "command") Y.push(jD5(J.command, A.path, J.timeout));
      if (Y.length > 0) Q[Z].push({
        matcher: I.matcher,
        hooks: Y,
        pluginName: A.name
      })
    }
  }
  return Q
}

// READABLE (for understanding):
function extractPluginHooks(plugin) {
  let result = {
    PreToolUse: [], PostToolUse: [], PostToolUseFailure: [],
    Notification: [], UserPromptSubmit: [], SessionStart: [],
    SessionEnd: [], Stop: [], SubagentStart: [], SubagentStop: [],
    PreCompact: [], PermissionRequest: []
  };

  if (!plugin.hooksConfig) return result;

  for (let [eventType, matcherGroups] of Object.entries(plugin.hooksConfig)) {
    if (!result[eventType]) continue;

    for (let group of matcherGroups) {
      let hooks = [];
      for (let hookConfig of group.hooks) {
        if (hookConfig.type === "command") {
          hooks.push(transformHookCommand(hookConfig.command, plugin.path, hookConfig.timeout));
        }
      }
      if (hooks.length > 0) {
        result[eventType].push({
          matcher: group.matcher,
          hooks: hooks,
          pluginName: plugin.name
        });
      }
    }
  }
  return result;
}

// Mapping: SD5→extractPluginHooks, jD5→transformHookCommand
```

### Plugin Hooks Loading Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Session Start                                              │
│  └─> wq() (loadSessionStartHooks)                          │
│       └─> _1A() (loadPluginHooks) - memoized               │
│            ├─> l7() (getEnabledPlugins)                    │
│            ├─> SD5() (extractPluginHooks) for each plugin  │
│            └─> LkA() (setRegisteredHooks) - store globally │
└─────────────────────────────────────────────────────────────┘
```

### Plugin Hooks Cache Invalidation (`bI2`)

**Location:** `chunks.107.mjs:1032-1034`

```javascript
// ORIGINAL (for source lookup):
function bI2() {
  _1A.cache?.clear?.()
}

// READABLE (for understanding):
function clearPluginHooksCache() {
  loadPluginHooks.cache?.clear?.();
}

// Mapping: bI2→clearPluginHooksCache
```

---

## Hook Source Merging

### Overview

When hooks are executed, the system merges hooks from three sources in a specific order. This merging happens on every hook execution via `ek3()` (loadAllHooks).

### Merging Function (`ek3`)

**Location:** `chunks.146.mjs:3445-3476`

```javascript
// ============================================
// loadAllHooks - Merge hooks from all sources
// Location: chunks.146.mjs:3445-3476
// ============================================

// ORIGINAL (for source lookup):
function ek3(A) {
  let Q = {},
    B = SZ2();
  if (B)
    for (let [G, Z] of Object.entries(B)) Q[G] = Z.map((I) => ({
      matcher: I.matcher,
      hooks: I.hooks
    }));
  if (!t21()) {
    let G = MkA();
    if (G)
      for (let [Z, I] of Object.entries(G)) {
        if (!Q[Z]) Q[Z] = [];
        for (let Y of I) Q[Z].push({
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
      for (let J of Y) Q[I].push({
        matcher: J.matcher,
        hooks: J.hooks
      })
    }
  }
  return Q
}

// READABLE (for understanding):
function loadAllHooks(appState) {
  let mergedHooks = {};

  // 1. Settings hooks (SZ2) - user/project level
  let settingsHooks = getSettingsHooks();
  if (settingsHooks) {
    for (let [eventType, matcherGroups] of Object.entries(settingsHooks)) {
      mergedHooks[eventType] = matcherGroups.map(g => ({
        matcher: g.matcher,
        hooks: g.hooks
      }));
    }
  }

  // 2. Plugin hooks (MkA) - only if !allowManagedHooksOnly
  if (!isAllowManagedHooksOnly()) {
    let pluginHooks = getRegisteredHooks();
    if (pluginHooks) {
      for (let [eventType, matcherGroups] of Object.entries(pluginHooks)) {
        if (!mergedHooks[eventType]) mergedHooks[eventType] = [];
        for (let group of matcherGroups) {
          mergedHooks[eventType].push({
            matcher: group.matcher,
            hooks: group.hooks
          });
        }
      }
    }
  }

  // 3. Session hooks (r21) - ephemeral per-session
  if (appState) {
    let sessionId = getSessionId();
    let sessionHooks = getSessionHooks(appState, sessionId);
    for (let [eventType, matcherGroups] of sessionHooks.entries()) {
      if (!mergedHooks[eventType]) mergedHooks[eventType] = [];
      for (let group of matcherGroups) {
        mergedHooks[eventType].push({
          matcher: group.matcher,
          hooks: group.hooks
        });
      }
    }
  }

  return mergedHooks;
}

// Mapping: ek3→loadAllHooks, SZ2→getSettingsHooks, t21→isAllowManagedHooksOnly,
//          MkA→getRegisteredHooks, e1→getSessionId, r21→getSessionHooks
```

### Hook Merging Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Hook Execution (any event)                                 │
│  └─> ek3() (loadAllHooks) - merge 3 sources               │
│       ├─ SZ2() - Settings hooks (user/project)            │
│       ├─ MkA() - Plugin hooks (global, if allowed)        │
│       └─ r21() - Session hooks (ephemeral)                │
└─────────────────────────────────────────────────────────────┘
```

### Key Characteristics

1. **Settings hooks are loaded first** - These are the base hooks from user/project settings
2. **Plugin hooks are conditional** - Skipped if `allowManagedHooksOnly` is enabled
3. **Session hooks are ephemeral** - Registered via SDK, cleared when session ends
4. **Hooks are aggregated** - All sources are merged, not replaced

---

## See Also

- [Hook Configuration](./configuration.md) - User-facing configuration guide
- [Hook Types](./types.md) - Hook type definitions and schemas
- [Hook Execution](./execution.md) - Execution flow documentation
