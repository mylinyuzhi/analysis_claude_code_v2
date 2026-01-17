# Hooks System Implementation Details (2.1.7)

> Complete implementation analysis of hooks: scope, skill-level hooks, lifecycle control

---

## Overview

The hook system provides event-driven extensibility with:
1. **Multiple scopes** - Policy, Plugin, Session, and Skill-level hooks
2. **Skill-level hooks** - Hooks defined in skill/agent frontmatter
3. **Lifecycle control** - `once: true` for one-shot hooks

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         Hook Sources & Aggregation                          │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │ Policy Hooks    │  │ Plugin Hooks    │  │ Session Hooks              │ │
│  │ (o32)           │  │ (TdA)           │  │ (lZ1 + u32)                │ │
│  │                 │  │                 │  │                            │ │
│  │ policySettings. │  │ g0.registered   │  │ appState.sessionHooks      │ │
│  │ hooks           │  │ Hooks           │  │ [sessionId].hooks          │ │
│  └────────┬────────┘  └────────┬────────┘  └──────────┬────────────────┘ │
│           │                    │                       │                   │
│           └──────────────────┬─┴───────────────────────┘                   │
│                              │                                              │
│                              v                                              │
│                   ┌───────────────────────┐                                │
│                   │  aggregateHooksFrom   │                                │
│                   │  AllSources (al5)     │                                │
│                   └───────────┬───────────┘                                │
│                               │                                             │
│                               v                                             │
│                   ┌───────────────────────┐                                │
│                   │  getMatchingHooks     │                                │
│                   │  (uU0)                │                                │
│                   │                       │                                │
│                   │  Matcher + Hook Type  │                                │
│                   │  Deduplication        │                                │
│                   └───────────────────────┘                                │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Hook Scopes

### 1. Policy Hooks (Highest Priority)

```javascript
// ============================================
// getPolicyHooks - Load hooks from policy settings
// Location: chunks.91.mjs:3225-3228
// ============================================

// ORIGINAL (for source lookup):
function o32() {
  if (kr === null) fI0();
  return kr
}

// READABLE (for understanding):
function getPolicyHooks() {
  if (cachedPolicyHooks === null) {
    initializePolicyHooks();
  }
  return cachedPolicyHooks;
}

// Mapping: o32→getPolicyHooks, kr→cachedPolicyHooks, fI0→initializePolicyHooks
```

**Source:** `policySettings.hooks` or `settings.hooks` (when `allowManagedHooksOnly` is false)

**Key insight:** When `allowManagedHooksOnly` is enabled, only policy hooks run (plugin/session hooks are skipped).

---

### 2. Plugin Hooks (Global Scope)

```javascript
// ============================================
// setPluginHooks - Store hooks from all enabled plugins
// Location: chunks.1.mjs:2755-2762
// ============================================

// ORIGINAL (for source lookup):
function G7A(A) {
  if (!g0.registeredHooks) g0.registeredHooks = {};
  for (let [Q, B] of Object.entries(A)) {
    let G = Q;
    if (!g0.registeredHooks[G]) g0.registeredHooks[G] = [];
    g0.registeredHooks[G].push(...B)
  }
}

// READABLE (for understanding):
function setPluginHooks(hooksByEvent) {
  if (!globalState.registeredHooks) {
    globalState.registeredHooks = {};
  }
  for (let [eventType, hooks] of Object.entries(hooksByEvent)) {
    if (!globalState.registeredHooks[eventType]) {
      globalState.registeredHooks[eventType] = [];
    }
    globalState.registeredHooks[eventType].push(...hooks);
  }
}

// Mapping: G7A→setPluginHooks, g0→globalState, A→hooksByEvent, Q→eventType, B→hooks
```

```javascript
// ============================================
// getPluginHooks - Retrieve registered plugin hooks
// Location: chunks.1.mjs:2764-2766
// ============================================

// ORIGINAL:
function TdA() {
  return g0.registeredHooks
}

// READABLE:
function getPluginHooks() {
  return globalState.registeredHooks;
}

// Mapping: TdA→getPluginHooks
```

**Source:** Each plugin's `hooksConfig` in its manifest

**Loading flow:**
1. `Qt()` (loadPluginHooks) is called
2. For each enabled plugin, `sl5` (extractPluginHooks) extracts hooks
3. All hooks are aggregated and stored via `G7A` (setPluginHooks)

---

### 3. Session Hooks (Session-Scoped)

```javascript
// ============================================
// getSessionHooks - Retrieve hooks for a session
// Location: chunks.91.mjs:2877-2891
// ============================================

// ORIGINAL (for source lookup):
function lZ1(A, Q, B) {
  let G = A.sessionHooks[Q];
  if (!G) return new Map;
  let Z = new Map;
  if (B) {
    let Y = G.hooks[B];
    if (Y) Z.set(B, b32(Y));
    return Z
  }
  for (let Y of _b) {
    let J = G.hooks[Y];
    if (J) Z.set(Y, b32(J))
  }
  return Z
}

// READABLE (for understanding):
function getSessionHooks(appState, sessionId, eventType) {
  let sessionData = appState.sessionHooks[sessionId];
  if (!sessionData) return new Map();

  let result = new Map();
  if (eventType) {
    // Get hooks for specific event only
    let eventHooks = sessionData.hooks[eventType];
    if (eventHooks) result.set(eventType, formatHooksForOutput(eventHooks));
    return result;
  }

  // Get all session hooks
  for (let event of HOOK_EVENT_TYPES) {
    let eventHooks = sessionData.hooks[event];
    if (eventHooks) result.set(event, formatHooksForOutput(eventHooks));
  }
  return result;
}

// Mapping: lZ1→getSessionHooks, A→appState, Q→sessionId, B→eventType
// _b→HOOK_EVENT_TYPES, b32→formatHooksForOutput
```

**Structure:**
```javascript
appState.sessionHooks = {
  [sessionId]: {
    hooks: {
      [eventType]: [
        {
          matcher: string,  // e.g., "Write", "Bash|Read", regex pattern
          hooks: [
            { hook: hookDefinition, onHookSuccess?: callback }
          ]
        }
      ]
    }
  }
}
```

---

### 4. Skill-Level Hooks (Skill-Scoped within Session)

Skill frontmatter can define hooks that are active only during skill execution:

```yaml
---
name: my-linter
hooks:
  PreToolUse:
    - matcher: "Write"
      hooks:
        - type: command
          command: "npm run lint --fix $FILE"
          once: true
  PostToolUse:
    - matcher: "Bash"
      hooks:
        - type: prompt
          prompt: "Verify the command succeeded without errors"
---
```

---

## Skill-Level Hook Registration

```javascript
// ============================================
// registerSkillFrontmatterHooks - Register hooks from skill frontmatter
// Location: chunks.112.mjs:2340-2354
// ============================================

// ORIGINAL (for source lookup):
function OD1(A, Q, B, G) {
  let Z = 0;
  for (let Y of _b) {
    let J = B[Y];
    if (!J) continue;
    for (let X of J)
      for (let I of X.hooks) {
        let D = I.once ? () => {
          k(`Removing one-shot hook for event ${Y} in skill '${G}'`), g32(A, Q, Y, I)
        } : void 0;
        pZ1(A, Q, Y, X.matcher || "", I, D), Z++
      }
  }
  if (Z > 0) k(`Registered ${Z} hooks from skill '${G}'`)
}

// READABLE (for understanding):
function registerSkillFrontmatterHooks(setAppState, sessionId, hooksConfig, skillName) {
  let registeredCount = 0;

  for (let eventType of HOOK_EVENT_TYPES) {
    let eventMatchers = hooksConfig[eventType];
    if (!eventMatchers) continue;

    for (let matcher of eventMatchers) {
      for (let hook of matcher.hooks) {
        // Create removal callback for one-shot hooks
        let onSuccessCallback = hook.once ? () => {
          logDebug(`Removing one-shot hook for event ${eventType} in skill '${skillName}'`);
          removeHookFromState(setAppState, sessionId, eventType, hook);
        } : undefined;

        // Register the hook
        addSessionHook(setAppState, sessionId, eventType, matcher.matcher || "", hook, onSuccessCallback);
        registeredCount++;
      }
    }
  }

  if (registeredCount > 0) {
    logDebug(`Registered ${registeredCount} hooks from skill '${skillName}'`);
  }
}

// Mapping: OD1→registerSkillFrontmatterHooks, A→setAppState, Q→sessionId, B→hooksConfig, G→skillName
// _b→HOOK_EVENT_TYPES, pZ1→addSessionHook, g32→removeHookFromState, I→hook, D→onSuccessCallback
```

**Key insight:** Skill hooks are registered when the skill executes, not when the skill is loaded. They become active in the session context.

---

## Hook State Management

### Adding a Hook

```javascript
// ============================================
// addSessionHook - Add a hook to session state
// Location: chunks.91.mjs:2782-2784
// ============================================

// ORIGINAL:
function pZ1(A, Q, B, G, Z, Y) {
  h32(A, Q, B, G, Z, Y)
}

// READABLE:
function addSessionHook(setAppState, sessionId, eventType, matcher, hook, onHookSuccess) {
  addHookToState(setAppState, sessionId, eventType, matcher, hook, onHookSuccess);
}

// Mapping: pZ1→addSessionHook, h32→addHookToState
```

```javascript
// ============================================
// addHookToState - Internal state update for adding hook
// Location: chunks.91.mjs:2798-2837
// ============================================

// ORIGINAL (for source lookup):
function h32(A, Q, B, G, Z, Y) {
  A((J) => {
    let X = J.sessionHooks[Q] || { hooks: {} },
      I = X.hooks[B] || [],
      D = I.findIndex((V) => V.matcher === G),
      W;
    if (D >= 0) {
      W = [...I];
      let V = W[D];
      W[D] = {
        matcher: V.matcher,
        hooks: [...V.hooks, { hook: Z, onHookSuccess: Y }]
      }
    } else W = [...I, {
      matcher: G,
      hooks: [{ hook: Z, onHookSuccess: Y }]
    }];
    let K = { ...X.hooks, [B]: W };
    return {
      ...J,
      sessionHooks: {
        ...J.sessionHooks,
        [Q]: { hooks: K }
      }
    }
  }), k(`Added session hook for event ${B} in session ${Q}`)
}

// READABLE (for understanding):
function addHookToState(setAppState, sessionId, eventType, matcher, hook, onHookSuccess) {
  setAppState((currentState) => {
    // Get or create session data
    let sessionData = currentState.sessionHooks[sessionId] || { hooks: {} };
    let eventHooks = sessionData.hooks[eventType] || [];

    // Find existing matcher entry
    let existingIndex = eventHooks.findIndex((entry) => entry.matcher === matcher);
    let updatedHooks;

    if (existingIndex >= 0) {
      // Add to existing matcher
      updatedHooks = [...eventHooks];
      let existingEntry = updatedHooks[existingIndex];
      updatedHooks[existingIndex] = {
        matcher: existingEntry.matcher,
        hooks: [...existingEntry.hooks, { hook, onHookSuccess }]
      };
    } else {
      // Create new matcher entry
      updatedHooks = [...eventHooks, {
        matcher,
        hooks: [{ hook, onHookSuccess }]
      }];
    }

    return {
      ...currentState,
      sessionHooks: {
        ...currentState.sessionHooks,
        [sessionId]: {
          hooks: {
            ...sessionData.hooks,
            [eventType]: updatedHooks
          }
        }
      }
    };
  });

  logDebug(`Added session hook for event ${eventType} in session ${sessionId}`);
}

// Mapping: h32→addHookToState, A→setAppState, Q→sessionId, B→eventType, G→matcher
// Z→hook, Y→onHookSuccess, J→currentState
```

### Removing a Hook

```javascript
// ============================================
// removeHookFromState - Remove a hook from session state
// Location: chunks.91.mjs:2839-2868
// ============================================

// ORIGINAL (for source lookup):
function g32(A, Q, B, G) {
  A((Z) => {
    let Y = Z.sessionHooks[Q];
    if (!Y) return Z;
    let X = (Y.hooks[B] || []).map((D) => {
        let W = D.hooks.filter((K) => !LVA(K.hook, G));
        return W.length > 0 ? { ...D, hooks: W } : null
      }).filter((D) => D !== null),
      I = X.length > 0 ? { ...Y.hooks, [B]: X } : { ...Y.hooks };
    if (X.length === 0) delete I[B];
    return {
      ...Z,
      sessionHooks: {
        ...Z.sessionHooks,
        [Q]: { ...Y, hooks: I }
      }
    }
  }), k(`Removed session hook for event ${B} in session ${Q}`)
}

// READABLE (for understanding):
function removeHookFromState(setAppState, sessionId, eventType, hookToRemove) {
  setAppState((currentState) => {
    let sessionData = currentState.sessionHooks[sessionId];
    if (!sessionData) return currentState;

    // Filter out the hook from all matchers
    let filteredMatchers = (sessionData.hooks[eventType] || [])
      .map((matcherEntry) => {
        let remainingHooks = matcherEntry.hooks.filter(
          (hookEntry) => !isHookEqual(hookEntry.hook, hookToRemove)
        );
        return remainingHooks.length > 0
          ? { ...matcherEntry, hooks: remainingHooks }
          : null;
      })
      .filter((entry) => entry !== null);

    // Update or remove event type entry
    let updatedEventHooks = filteredMatchers.length > 0
      ? { ...sessionData.hooks, [eventType]: filteredMatchers }
      : { ...sessionData.hooks };

    if (filteredMatchers.length === 0) {
      delete updatedEventHooks[eventType];
    }

    return {
      ...currentState,
      sessionHooks: {
        ...currentState.sessionHooks,
        [sessionId]: { ...sessionData, hooks: updatedEventHooks }
      }
    };
  });

  logDebug(`Removed session hook for event ${eventType} in session ${sessionId}`);
}

// Mapping: g32→removeHookFromState, A→setAppState, Q→sessionId, B→eventType, G→hookToRemove
// LVA→isHookEqual
```

---

## Lifecycle Control: `once: true`

### Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                       once: true Hook Lifecycle                             │
│                                                                             │
│  1. Skill Execution                                                         │
│     │                                                                       │
│     v                                                                       │
│  2. registerSkillFrontmatterHooks (OD1)                                    │
│     │                                                                       │
│     └─► For each hook with once: true:                                     │
│         Create removal callback: () => removeHookFromState(...)             │
│         Register hook with onHookSuccess = callback                         │
│     │                                                                       │
│     v                                                                       │
│  3. Hook Stored in sessionHooks                                            │
│     { hook: hookDef, onHookSuccess: removalCallback }                      │
│     │                                                                       │
│     v                                                                       │
│  4. Tool Use Triggers PreToolUse Event                                     │
│     │                                                                       │
│     v                                                                       │
│  5. getMatchingHooks (uU0) retrieves hook                                  │
│     │                                                                       │
│     v                                                                       │
│  6. Hook Executes Successfully                                             │
│     │                                                                       │
│     v                                                                       │
│  7. findSessionHook (m32) finds hook entry                                 │
│     │                                                                       │
│     └─► If onHookSuccess exists AND outcome === "success":                 │
│         Call onHookSuccess() → removeHookFromState()                        │
│     │                                                                       │
│     v                                                                       │
│  8. Hook Removed from sessionHooks                                         │
│     │                                                                       │
│     v                                                                       │
│  9. Future matches will NOT find this hook                                 │
└────────────────────────────────────────────────────────────────────────────┘
```

### Success Callback Invocation

```javascript
// ============================================
// Hook execution with onHookSuccess callback
// Location: chunks.120.mjs:1868-1878
// ============================================

// ORIGINAL (for source lookup):
if (D && $.hook.type !== "callback") {
  let O = q0(),
    M = m32(D, O, X, B ?? "", $.hook);
  if (M?.onHookSuccess && $.outcome === "success") try {
    M.onHookSuccess($.hook, $)
  } catch (_) {
    e(Error("Session hook success callback failed", { cause: _ }))
  }
}

// READABLE (for understanding):
if (getAppState && hookResult.hook.type !== "callback") {
  let sessionId = getCurrentSessionId();
  let sessionHookEntry = findSessionHook(getAppState, sessionId, eventType, matcher, hookResult.hook);

  if (sessionHookEntry?.onHookSuccess && hookResult.outcome === "success") {
    try {
      // This is where the removal callback is invoked for once: true hooks
      sessionHookEntry.onHookSuccess(hookResult.hook, hookResult);
    } catch (error) {
      logError(Error("Session hook success callback failed", { cause: error }));
    }
  }
}

// Mapping: D→getAppState, q0→getCurrentSessionId, m32→findSessionHook
// X→eventType, B→matcher, $→hookResult
```

---

## Hook Aggregation

```javascript
// ============================================
// aggregateHooksFromAllSources - Combine hooks from all scopes
// Location: chunks.120.mjs:1430-1467
// ============================================

// ORIGINAL (for source lookup):
function al5(A, Q) {
  let B = {},
    G = o32();
  if (G)
    for (let [J, X] of Object.entries(G)) B[J] = X.map((I) => ({
      matcher: I.matcher,
      hooks: I.hooks
    }));
  let Z = br(),
    Y = TdA();
  if (Y)
    for (let [J, X] of Object.entries(Y)) {
      if (!B[J]) B[J] = [];
      for (let I of X) {
        if (Z && "pluginRoot" in I) continue;
        B[J].push(I)
      }
    }
  if (!Z && A !== void 0) {
    let J = lZ1(A, Q);
    for (let [I, D] of J.entries()) {
      if (!B[I]) B[I] = [];
      for (let W of D) B[I].push({ matcher: W.matcher, hooks: W.hooks })
    }
    let X = u32(A, Q);
    for (let [I, D] of X.entries()) {
      if (!B[I]) B[I] = [];
      for (let W of D) B[I].push({ matcher: W.matcher, hooks: W.hooks })
    }
  }
  return B
}

// READABLE (for understanding):
function aggregateHooksFromAllSources(appState, sessionId) {
  let aggregatedHooks = {};

  // 1. Load policy hooks (highest priority)
  let policyHooks = getPolicyHooks();
  if (policyHooks) {
    for (let [eventType, matchers] of Object.entries(policyHooks)) {
      aggregatedHooks[eventType] = matchers.map((m) => ({
        matcher: m.matcher,
        hooks: m.hooks
      }));
    }
  }

  // 2. Load plugin hooks (global scope)
  let managedOnly = isAllowManagedHooksOnly();
  let pluginHooks = getPluginHooks();
  if (pluginHooks) {
    for (let [eventType, matchers] of Object.entries(pluginHooks)) {
      if (!aggregatedHooks[eventType]) aggregatedHooks[eventType] = [];
      for (let matcher of matchers) {
        // Skip plugin hooks if allowManagedHooksOnly is enabled
        if (managedOnly && "pluginRoot" in matcher) continue;
        aggregatedHooks[eventType].push(matcher);
      }
    }
  }

  // 3. Load session hooks (session-scoped, includes skill hooks)
  if (!managedOnly && appState !== undefined) {
    // Regular session hooks
    let sessionHooks = getSessionHooks(appState, sessionId);
    for (let [eventType, matchers] of sessionHooks.entries()) {
      if (!aggregatedHooks[eventType]) aggregatedHooks[eventType] = [];
      for (let matcher of matchers) {
        aggregatedHooks[eventType].push({ matcher: matcher.matcher, hooks: matcher.hooks });
      }
    }

    // Function hooks (internal use)
    let functionHooks = getSessionFunctionHooks(appState, sessionId);
    for (let [eventType, matchers] of functionHooks.entries()) {
      if (!aggregatedHooks[eventType]) aggregatedHooks[eventType] = [];
      for (let matcher of matchers) {
        aggregatedHooks[eventType].push({ matcher: matcher.matcher, hooks: matcher.hooks });
      }
    }
  }

  return aggregatedHooks;
}

// Mapping: al5→aggregateHooksFromAllSources, o32→getPolicyHooks, TdA→getPluginHooks
// br→isAllowManagedHooksOnly, lZ1→getSessionHooks, u32→getSessionFunctionHooks
```

**Priority order:**
1. Policy hooks (always run, even with `allowManagedHooksOnly`)
2. Plugin hooks (skipped when `allowManagedHooksOnly`)
3. Session hooks (skipped when `allowManagedHooksOnly`)

---

## Hook Matching

```javascript
// ============================================
// matchHookPattern - Pattern matching for hook matchers
// Location: chunks.120.mjs:1419-1428
// ============================================

// ORIGINAL (for source lookup):
function nl5(A, Q) {
  if (/^[a-zA-Z0-9_|]+$/.test(Q)) {
    if (Q.includes("|")) return Q.split("|").map((G) => G.trim()).includes(A);
    return A === Q
  }
  try {
    return new RegExp(Q).test(A)
  } catch {
    return k(`Invalid regex pattern in hook matcher: ${Q}`), !1
  }
}

// READABLE (for understanding):
function matchHookPattern(value, pattern) {
  // Simple alphanumeric patterns (with | for OR)
  if (/^[a-zA-Z0-9_|]+$/.test(pattern)) {
    // OR syntax: "Write|Read|Edit"
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
    logDebug(`Invalid regex pattern in hook matcher: ${pattern}`);
    return false;
  }
}

// Mapping: nl5→matchHookPattern, A→value, Q→pattern
```

**Supported patterns:**
| Pattern | Example | Matches |
|---------|---------|---------|
| Exact | `"Write"` | Only "Write" |
| OR syntax | `"Write|Read|Edit"` | "Write", "Read", or "Edit" |
| Regex | `"^Bash.*"` | "Bash", "BashTool", etc. |
| Empty | `""` | All values |

---

## Event Types

```javascript
// ============================================
// HOOK_EVENT_TYPES - All supported hook events
// Location: chunks.90.mjs:1311
// ============================================

// ORIGINAL:
_b = ["PreToolUse", "PostToolUse", "PostToolUseFailure", "Notification",
      "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop",
      "SubagentStart", "SubagentStop", "PreCompact", "PermissionRequest"]

// READABLE:
HOOK_EVENT_TYPES = [
  "PreToolUse",           // Before tool executes
  "PostToolUse",          // After tool succeeds
  "PostToolUseFailure",   // After tool fails
  "Notification",         // On notification
  "UserPromptSubmit",     // When user submits prompt
  "SessionStart",         // Session begins
  "SessionEnd",           // Session ends
  "Stop",                 // Agent stops
  "SubagentStart",        // Sub-agent spawns
  "SubagentStop",         // Sub-agent completes
  "PreCompact",           // Before context compaction
  "PermissionRequest"     // Permission dialog shown
]

// Mapping: _b→HOOK_EVENT_TYPES
```

---

## Complete Example

### Skill with Hooks

```yaml
---
name: safe-deploy
description: Deploy with safety checks
hooks:
  PreToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npm run lint --fix"
          statusMessage: "Running linter..."
          once: true
    - matcher: "Bash"
      hooks:
        - type: prompt
          prompt: "Check if this command is safe: $ARGUMENTS"
          model: "claude-haiku-3"
  PostToolUse:
    - matcher: "Bash"
      hooks:
        - type: agent
          prompt: "Verify the command succeeded and check for errors"
          timeout: 120
---

Deploy my application safely.
```

### Execution Flow

1. User runs `/safe-deploy`
2. `OD1` registers 3 hooks:
   - PreToolUse/Write|Edit: lint command (once: true)
   - PreToolUse/Bash: safety check prompt
   - PostToolUse/Bash: verification agent
3. Agent calls `Write` tool
4. `uU0` finds matching PreToolUse hook (lint)
5. Lint runs successfully
6. `m32` finds the hook, calls `onHookSuccess`
7. `g32` removes the lint hook (once: true)
8. Agent calls `Bash` tool
9. PreToolUse prompt hook checks safety
10. Bash executes
11. PostToolUse agent hook verifies success

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `registerSkillFrontmatterHooks` (OD1) - Register hooks from skill frontmatter
- `addSessionHook` (pZ1) - Add hook to session state
- `addHookToState` (h32) - Internal state update
- `removeHookFromState` (g32) - Remove hook from state
- `aggregateHooksFromAllSources` (al5) - Combine all hook sources
- `getMatchingHooks` (uU0) - Get hooks matching event/query
- `matchHookPattern` (nl5) - Pattern matching logic
- `findSessionHook` (m32) - Find specific session hook entry
- `getPolicyHooks` (o32) - Get policy-level hooks
- `getPluginHooks` (TdA) - Get plugin-level hooks
- `setPluginHooks` (G7A) - Store plugin hooks
- `getSessionHooks` (lZ1) - Get session-scoped hooks
- `getSessionFunctionHooks` (u32) - Get function-type hooks
- `HOOK_EVENT_TYPES` (_b) - All supported event types

---

## See Also

- [hooks_extension.md](hooks_extension.md) - Hook types and schemas
- [../10_skill/](../10_skill/) - Skill system with frontmatter
- [../26_background_agents/](../26_background_agents/) - Background task hooks
