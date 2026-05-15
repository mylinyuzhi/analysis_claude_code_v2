# Agent Frontmatter Hooks on Main-Thread Agents (v2.1.117)

## Overview

v2.1.117 makes an agent's frontmatter `hooks:` block apply to the **main thread** when the agent is invoked via `--agent`. The changelog:

> Agent frontmatter `hooks:` fire on main-thread agent via `--agent`

Previously, frontmatter hooks fired only when the agent ran as a subagent (via `Agent` tool dispatch). With `--agent <name>` setting the main-thread agent, the user-defined hooks for that agent are now equally active on the top-level conversation.

The implementation introduces a new runtime slot, `mainThreadAgentHooks`, that the hook-matcher reads alongside settings and plugin hooks. When `--agent` resolves an agent definition, its `hooks:` block is materialized into this slot; when the session ends or `--agent` changes, the slot is cleared.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks + Background Agents
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agents
> - [symbol_additions_v2_1_142_hooks.md](../00_overview/symbol_additions_v2_1_142_hooks.md) - New symbols

Key functions in this document:

- `getMainThreadAgentHooks` (`kp`) — Reader; consulted by hook matcher
- `setMainThreadAgentHooks` (`dv$`) — Writer; called when agent is loaded
- `applyMainThreadAgent` (`pJH`) — Orchestrator that calls `dv$` with the agent's hooks
- `resolveAgentSetting` (`SyH`) — Resolves `--agent` flag to agent definition; calls `pJH`
- `getMatchedHooks` (`uu5`) — Hook matcher that reads `kp()` alongside other sources
- `hasHookForEvent` (`tI`) — Existence check that reads `kp()` early-exit
- `validateMainThreadAgentTrust` (`B7H`) — Trust check (admin-only / non-third-party gate)

## Storage Slot

```javascript
// ============================================
// mainThreadAgentHooks - Module-level state slot
// Location: cli_inner_pretty.js:2282-2283, 3083-3091
// ============================================

// ORIGINAL (for source lookup):
// In the global state object U$:
mainThreadAgentType: void 0,
mainThreadAgentHooks: void 0,

function kp() {
  let H = jv();
  return H ? H.mainThreadAgentHooks : U$.mainThreadAgentHooks;
}
function dv$(H) {
  let $ = jv();
  if ($) $.mainThreadAgentHooks = H;
  else U$.mainThreadAgentHooks = H;
}

// READABLE (for understanding):
// In the global state object:
//   mainThreadAgentType: undefined,    // e.g., "code-reviewer" when --agent code-reviewer
//   mainThreadAgentHooks: undefined,   // the agent's HooksSettings, or undefined when no agent

function getMainThreadAgentHooks() {
  // jv() returns the async-local-storage entry if inside one, else uses module global
  const localStorage = getAsyncLocalStorageEntry();
  return localStorage ? localStorage.mainThreadAgentHooks : globalState.mainThreadAgentHooks;
}
function setMainThreadAgentHooks(hooks) {
  const localStorage = getAsyncLocalStorageEntry();
  if (localStorage) localStorage.mainThreadAgentHooks = hooks;
  else globalState.mainThreadAgentHooks = hooks;
}

// Mapping:
//   kp→getMainThreadAgentHooks, dv$→setMainThreadAgentHooks, jv→getAsyncLocalStorageEntry,
//   U$→globalState
```

The use of async-local-storage means concurrent main-thread agents in separate sessions (REPL + background dispatch) don't collide on the same module global.

## Wiring: Agent Setting Resolution

```javascript
// ============================================
// applyMainThreadAgent - Calls setMainThreadAgentHooks with agent's hooks
// Location: cli_inner_pretty.js:564134-564137
// ============================================

// ORIGINAL (for source lookup):
function pJH(H) {
  if (H?.hooks && (!DX("hooks") || B7H(H.source))) dv$(H.hooks);
  else dv$(void 0);
}

// READABLE (for understanding):
function applyMainThreadAgent(agentDefinition) {
  // Only install hooks if the agent has a hooks block AND it's either:
  //   - not subject to admin policy lockdown ("hooks" feature isn't locked), OR
  //   - the agent comes from a trusted source (B7H = admin-controlled managed settings)
  if (agentDefinition?.hooks && (!isFeatureLocked("hooks") || isAdminTrustedSource(agentDefinition.source))) {
    setMainThreadAgentHooks(agentDefinition.hooks);
  } else {
    setMainThreadAgentHooks(undefined);
  }
}

// Mapping:
//   pJH→applyMainThreadAgent, H→agentDefinition, dv$→setMainThreadAgentHooks,
//   DX→isFeatureLocked, B7H→isAdminTrustedSource
```

The gate prevents user-installed agents from registering hooks when the admin policy locks down the `"hooks"` feature — preserving the same admin trust model that already governs settings.json hooks.

## Resolver Call Site

```javascript
// ============================================
// resolveAgentSetting - Calls applyMainThreadAgent on agent resolution
// Location: cli_inner_pretty.js:564205-564219
// ============================================

// ORIGINAL (for source lookup):
function SyH(H, $, q) {
  if ($) return { agentDefinition: $, agentType: void 0 };
  if (!H) return (vp(void 0), pJH(void 0), { agentDefinition: void 0, agentType: void 0 });
  let K = q.activeAgents.find((_) => _.agentType === H);
  if (!K)
    return (
      N(`Resumed session had agent "${H}" but it is no longer available. Using default behavior.`),
      vp(void 0),
      pJH(void 0),
      { agentDefinition: void 0, agentType: void 0 }
    );
  if ((vp(K.agentType), pJH(K), !Jv() && K.model && K.model !== "inherit")) bG(n7(K.model));
  return { agentDefinition: K, agentType: K.agentType };
}

// READABLE (for understanding):
function resolveAgentSetting(agentTypeName, prebuiltDefinition, agentRegistry) {
  // Caller has already constructed a definition object — use directly
  if (prebuiltDefinition) return { agentDefinition: prebuiltDefinition, agentType: undefined };
  // No --agent flag — clear both type and hooks slots
  if (!agentTypeName) {
    setMainThreadAgentType(undefined);
    applyMainThreadAgent(undefined);
    return { agentDefinition: undefined, agentType: undefined };
  }
  // Resolve name → definition
  const definition = agentRegistry.activeAgents.find((a) => a.agentType === agentTypeName);
  if (!definition) {
    logForDebugging(
      `Resumed session had agent "${agentTypeName}" but it is no longer available. Using default behavior.`,
    );
    setMainThreadAgentType(undefined);
    applyMainThreadAgent(undefined);
    return { agentDefinition: undefined, agentType: undefined };
  }
  // Install both: type identifier (for hook envelope agent_type) and hooks (for matcher)
  setMainThreadAgentType(definition.agentType);
  applyMainThreadAgent(definition);                   // ← v2.1.117 entry point
  // Apply the agent's model if it's not "inherit"
  if (!isModelOverridden() && definition.model && definition.model !== "inherit") {
    setMainLoopModel(resolveModel(definition.model));
  }
  return { agentDefinition: definition, agentType: definition.agentType };
}

// Mapping:
//   SyH→resolveAgentSetting, H→agentTypeName, $→prebuiltDefinition, q→agentRegistry,
//   K→definition, vp→setMainThreadAgentType, pJH→applyMainThreadAgent,
//   Jv→isModelOverridden, bG→setMainLoopModel, n7→resolveModel
```

## Hook Matcher Integration

```javascript
// ============================================
// getMatchedHooks - Reads main-thread agent hooks alongside settings & plugin hooks
// Location: cli_inner_pretty.js:521108-521134
// ============================================

// ORIGINAL (for source lookup):
function uu5(H, $, q) {
  let K = [...(Cg()?.[q] ?? [])],     // settings.json hooks for this event
    _ = rw(),
    A = _ ? cFH() : null;
  if (!_) {
    let Y = kp()?.[q];                  // ← main-thread agent hooks
    if (Y) for (let f of Y) K.push(f);
  }
  let z = Px()?.[q];                    // plugin hooks
  if (z)
    for (let Y of z) {
      if (_ && "pluginRoot" in Y && !A?.has(Y.pluginId)) continue;
      K.push(Y);
    }
  if (!_ && H !== void 0) {
    let Y = rwH(H, $, q).get(q);        // session-scoped hooks (e.g., agent-scope from runAgent)
    if (Y) for (let O of Y) K.push(O);
    let f = au7(H, $, q).get(q);
    if (f) for (let O of f) K.push(O);
  }
  return K;
}

// READABLE (for understanding):
function getMatchedHooks(appState, sessionId, hookEvent) {
  // 1. Start with hooks from settings.json
  const settingsHooks = [...(getSettingsHooks()?.[hookEvent] ?? [])];
  const isManagedOnly = isAllowManagedHooksOnly();
  const trustedPluginIds = isManagedOnly ? getTrustedPluginIds() : null;

  // 2. NEW v2.1.117: Add main-thread agent's hooks (if not in managed-only mode)
  if (!isManagedOnly) {
    const mainThreadHooks = getMainThreadAgentHooks()?.[hookEvent];
    if (mainThreadHooks) {
      for (const matcher of mainThreadHooks) settingsHooks.push(matcher);
    }
  }

  // 3. Add plugin hooks (filtered by trust list in managed-only mode)
  const pluginHooks = getPluginHooks()?.[hookEvent];
  if (pluginHooks) {
    for (const matcher of pluginHooks) {
      if (isManagedOnly && "pluginRoot" in matcher && !trustedPluginIds?.has(matcher.pluginId)) continue;
      settingsHooks.push(matcher);
    }
  }

  // 4. Add session-scoped hooks (e.g., subagent's frontmatter hooks while inside the subagent)
  if (!isManagedOnly && appState !== undefined) {
    const sessionHooks = getSessionHooks(appState, sessionId, hookEvent).get(hookEvent);
    if (sessionHooks) for (const h of sessionHooks) settingsHooks.push(h);
    const subagentSessionHooks = getSubagentSessionHooks(appState, sessionId, hookEvent).get(hookEvent);
    if (subagentSessionHooks) for (const h of subagentSessionHooks) settingsHooks.push(h);
  }

  return settingsHooks;
}

// Mapping:
//   uu5→getMatchedHooks, Cg→getSettingsHooks, rw→isAllowManagedHooksOnly, cFH→getTrustedPluginIds,
//   kp→getMainThreadAgentHooks, Px→getPluginHooks, rwH→getSessionHooks, au7→getSubagentSessionHooks
```

The matcher merges hooks from **four sources** in order:
1. settings.json (user / project / managed)
2. **Main-thread agent frontmatter** (NEW v2.1.117)
3. Plugins (filtered by trust in managed-only mode)
4. Session-scoped (per-subagent or skill registration)

## Existence Check Integration

```javascript
// ============================================
// hasHookForEvent - Early-exit reader; consults main-thread agent hooks
// Location: cli_inner_pretty.js:521135-521146
// ============================================

// ORIGINAL (for source lookup):
function tI(H, $, q) {
  let K = Cg()?.[H];
  if (K && K.length > 0) return !0;
  if (!rw()) {
    let A = kp()?.[H];                          // ← main-thread agent check
    if (A && A.length > 0) return !0;
  }
  let _ = Px()?.[H];
  if (_ && _.length > 0) return !0;
  if ($?.sessionHooks.get(q)?.hooks[H]) return !0;
  return !1;
}

// READABLE (for understanding):
function hasHookForEvent(hookEvent, appState, sessionId) {
  // Cheap any-hook check before paying the cost of full matcher resolution
  const settingsHooks = getSettingsHooks()?.[hookEvent];
  if (settingsHooks && settingsHooks.length > 0) return true;

  if (!isAllowManagedHooksOnly()) {
    // NEW v2.1.117: main-thread agent has any hook for this event?
    const mainThreadHooks = getMainThreadAgentHooks()?.[hookEvent];
    if (mainThreadHooks && mainThreadHooks.length > 0) return true;
  }

  const pluginHooks = getPluginHooks()?.[hookEvent];
  if (pluginHooks && pluginHooks.length > 0) return true;

  if (appState?.sessionHooks.get(sessionId)?.hooks[hookEvent]) return true;

  return false;
}

// Mapping: tI→hasHookForEvent, Cg→getSettingsHooks, rw→isAllowManagedHooksOnly,
//   kp→getMainThreadAgentHooks, Px→getPluginHooks
```

This is the fast-path predicate used by event-firing sites (`postToolUseFailureHook`, `subagentStartHook`, etc.) to skip envelope construction when no hooks are registered.

## Key Decisions/Algorithms

### Slot-based registration vs. merge-on-call

**What it does:** When `--agent` resolves, the agent's hooks are stored in `mainThreadAgentHooks`. Subsequent matcher calls read this slot directly.

**Alternative considered:** Re-resolve the agent on every matcher call and pull `agentDefinition.hooks` fresh.

**Why the slot approach:**
- The agent definition is loaded once on session start; re-resolving on every hook event would re-read `.claude/agents/<name>.md` (or settings) on every tool call.
- The slot acts as a cache for the **bound** hooks specific to this session's main-thread agent.

**Key insight:** This is **session-scoped denormalization**. The agent's hooks are normalized in their definition file; on bind, they're projected into a per-session runtime slot keyed by hook event. The matcher consults the projection, not the source.

### Async-local-storage backing

**What it does:** `kp()` and `dv$()` consult an async-local-storage (`jv()`) entry first, falling back to a module global.

**Why this approach:**
- Background agent sessions can run concurrently in the same process (the Claude Code daemon hosts multiple). Each session needs its own main-thread agent state.
- Module globals would cause cross-session pollution: session A's `--agent reviewer` would leak hooks into session B.
- Async-local-storage isolates state per async context (set up at session entry).

**Key insight:** This is **multi-tenant safety**. The same `--agent` flag in two sessions produces two independent `mainThreadAgentHooks` projections, even though both reference the same source definition.

### Admin trust gate

**What it does:** `applyMainThreadAgent` only installs hooks if **either**:
- The "hooks" feature is NOT locked by admin policy, OR
- The agent comes from a trusted (admin-controlled) source

**How it works:** `DX("hooks")` checks `disableAllHooks`/`allowManagedHooksOnly` admin settings. `B7H(source)` checks whether the agent definition file lives in an admin-controlled directory.

**Why this approach:**
- Same trust model as plugin hooks: admins can lock down hooks across all sources, OR allow only admin-managed sources.
- An agent file in `~/.claude/agents/` is **user-controlled** — admin lockdown should suppress its hooks even if the user invokes it.
- An agent file in `/etc/claude-code/agents/` (admin-managed) **should** install hooks because the admin already vetted it.

**Key insight:** The trust gate uses the same predicates as the rest of the hooks subsystem — `DX("hooks")` and `B7H(source)`. No new policy primitives. This means admin teams that already configured hooks lockdown for plugins automatically get the same behavior for agent frontmatter.

### Cleared on agent unset

**What it does:** When `--agent` is unset (or resolved to nothing), `setMainThreadAgentHooks(undefined)` is called.

**Why this approach:**
- A session that starts with `--agent foo` then `/agent default` should not retain foo's hooks.
- Explicit clear-on-unset avoids stale state if the agent definition changes mid-session.

**Key insight:** The slot is **always in sync** with the active `--agent`. There's no "previous agent" state to inspect — the slot reflects the current binding only.

### Same hook structure as settings.json

**What it does:** The agent's `hooks:` frontmatter has the same shape as settings.json `hooks:` — a record from event name to array of matchers.

**Why this approach:**
- The matcher resolver doesn't need a separate code path for agent hooks — they're appended to the same array as settings hooks.
- Plugin authors familiar with settings hooks can author agent hooks identically.

**Key insight:** Agents are **just another hook source**. The matcher treats settings, agent, plugin, and session-scoped hooks identically (modulo trust filtering and deduplication). This keeps the dispatcher uniform.

## Diff vs v2.1.112

In v2.1.112, the `mainThreadAgentType` slot existed but `mainThreadAgentHooks` did not. `--agent` set the type (for envelope `agent_type` field), but the agent's frontmatter `hooks:` block was only installed when the agent ran as a **subagent** — via `runAgent.ts:526` (which calls `registerFrontmatterHooks` against the subagent's sessionId).

The v2.1.117 patch adds:
1. `mainThreadAgentHooks` slot in the global state object.
2. `getMainThreadAgentHooks` (`kp`) and `setMainThreadAgentHooks` (`dv$`) accessor/mutator.
3. `applyMainThreadAgent` (`pJH`) — orchestrator with the admin trust gate.
4. Call sites in `resolveAgentSetting` (`SyH`) and `--agent` flag handling.
5. Reader integration in `getMatchedHooks` (`uu5`) and `hasHookForEvent` (`tI`).
6. Cleared-on-unset wiring.

Subagent frontmatter hooks continue to use the existing `sessionHooksRegistry` path (via `eo7` at `cli_inner_pretty.js:393200`). The main-thread path is a new parallel slot, not a refactor of the existing one — minimizing regression risk.

## Related Reading

- Agent definition shape: see `00_overview/symbol_index_core_execution.md` "Agents" section for `agentDefinition` / `AgentSetting` types.
- Subagent hook registration: see [v2.1.112 30_agent_team/](../../../claude_code_v_2.1.112/analyze/30_agent_team/) for the existing `eo7`/`registerFrontmatterHooks` flow.
- Admin trust model: `disableAllHooks` and `allowManagedHooksOnly` are settings; their resolution path is in `00_overview/symbol_index_infra_platform.md` "Permissions" section.
