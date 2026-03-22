# Hook Permission Integration (Claude Code 2.1.76)

> How the hook system interacts with permission decisions: PreToolUse permission overrides, multi-hook aggregation, hook source merging, and permission_mode context propagation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

**Cross-references:**
- [tool_execution_pipeline.md](../05_tools/tool_execution_pipeline.md) - Pre-hook execution within fxY pipeline
- [implementation.md](../11_hooks/implementation.md) - Hook system architecture and event catalog
- [http_hooks.md](../11_hooks/http_hooks.md) - HTTP hook request/response format
- [permission_sync.md](../18_sandbox/permission_sync.md) - Multi-agent permission forwarding

Key functions in this document:
- `buildHookContext` ($w) - Constructs the context object passed to every hook, including permission_mode
- `executePreToolHooks` (LF8) - Generator that runs all PreToolUse hooks for a tool
- `areHooksEnabled` (NS1) - Fast check: are any hooks registered for a given event?
- `resolveHooksForEvent` (kr8) - Full algorithm: merge sources, match query, filter, deduplicate
- `mergeHookSources` (E_z) - Loads and merges hook definitions from policy/project/plugin/session/user
- `matchesHookMatcher` (k_z) - Tests if a query string matches a hook's matcher pattern (literal, pipe-delimited, regex)
- `processHookJsonOutput` (Gi4) - Maps JSON output fields to permission decisions
- `executeHooksIterator` (Ax) - Central async generator that runs matched hooks and aggregates permission decisions
- `executePreToolHooksIterator` (y4q) - Pipeline-level adapter that yields typed results back to fxY
- `permissionBehaviorToVerb` (EF8) - Maps "allow"/"deny"/"ask" to human-readable past tense

---

## Architecture Overview

```
Tool execution request
    |
    v
NS1("PreToolUse") --- Are hooks registered?
    | yes                    | no
    v                        v
LF8() --- executePreToolHooks    Skip hooks
    |
    +-- $w(mode) --- Build hook context with permission_mode
    |
    +-- kr8() --- Resolve matching hooks
    |     +-- E_z() --- Merge sources (policy -> project -> plugin -> session -> user)
    |           +-- k_z() --- Matcher algorithm
    |
    +-- Ax() --- Execute hooks iterator
    |     +-- Command hooks: spawn subprocess
    |     +-- Prompt hooks: execute LLM prompt
    |     +-- Agent hooks: spawn sub-agent
    |     +-- HTTP hooks: POST to webhook endpoint
    |     +-- Callback hooks: call in-process callback
    |     +-- Function hooks: call directly
    |
    +-- Permission aggregation (deny > ask > allow)
          |
          v
    hookPermissionResult: { behavior, updatedInput, reason }
          |
          v
    y4q() yields to fxY pipeline --- Hook decision integration
```

---

## 1. Hook Context Construction

### buildHookContext - Inject permission_mode into every hook event

**What it does:** Creates the base context object that is merged into every hook event payload. Every hook -- regardless of type (command, prompt, HTTP, agent, callback, function) -- receives the current `permission_mode` so it can make context-aware decisions.

**How it works:**

1. Resolves the session ID from the parameter or falls back to `getSessionId()`
2. Determines the agent type from the tool use context or falls back to the default
3. Returns a flat object with session metadata, CWD, and critically, `permission_mode`

```javascript
// ============================================
// buildHookContext - Constructs hook context with permission_mode
// Location: chunks.175.mjs:1002-1013
// ============================================

// ORIGINAL (for source lookup):
function $w(A, q, K) {
    let Y = q ?? R1(),
        z = K?.agentType ?? Pp();
    return {
        session_id: Y,
        transcript_path: cf(Y),
        cwd: G1(),
        permission_mode: A,
        agent_id: K?.agentId,
        agent_type: z
    }
}

// READABLE (for understanding):
function buildHookContext(permissionMode, sessionId, toolUseContext) {
    let sid = sessionId ?? getSessionId();
    let agentType = toolUseContext?.agentType ?? getDefaultAgentType();
    return {
        session_id: sid,
        transcript_path: getTranscriptPath(sid),
        cwd: getCwd(),
        permission_mode: permissionMode,
        agent_id: toolUseContext?.agentId,
        agent_type: agentType
    }
}

// Mapping: $w->buildHookContext, A->permissionMode, q->sessionId, K->toolUseContext,
//          R1->getSessionId, cf->getTranscriptPath, G1->getCwd, Pp->getDefaultAgentType
```

**Key insight:** The `permission_mode` field exposes the current permission state ("default", "auto", "bypassPermissions", "plan") to every hook. This allows hooks to behave differently depending on the security context -- for example, an enterprise policy hook might enforce stricter rules when `permission_mode` is "auto" versus when a human is actively supervising in "default" mode.

**Where it is used:** Both `LF8` (executePreToolHooks) and `RF8` (executePostToolHooks) call `$w()` as a spread into their hook input objects, so the permission_mode propagates to PreToolUse, PostToolUse, and PostToolUseFailure events alike.

---

## 2. Pre-Hook Enablement Check

### areHooksEnabled - Fast-path check before hook execution

**What it does:** Determines whether any hooks are registered for a given event name before doing the more expensive work of resolving and executing them. This is a three-source check: policy hooks, project hooks, and session hooks.

**How it works:**

1. Check policy hooks (organization-level, loaded from managed settings)
2. Check project hooks (from `.claude/settings.json` or `CLAUDE.md` hooks config)
3. Check session hooks (registered dynamically during the session, keyed by agent ID)
4. Returns true if any source has at least one hook for the event

```javascript
// ============================================
// areHooksEnabled - Quick hook existence check
// Location: chunks.175.mjs:1497-1504
// ============================================

// ORIGINAL (for source lookup):
function NS1(A, q, K) {
    let Y = EM6()?.[A];
    if (Y && Y.length > 0) return !0;
    let z = Xp()?.[A];
    if (z && z.length > 0) return !0;
    if (q?.sessionHooks.get(K)?.hooks[A]) return !0;
    return !1
}

// READABLE (for understanding):
function areHooksEnabled(eventName, appState, agentId) {
    let policyHooks = getPolicyHooks()?.[eventName];
    if (policyHooks && policyHooks.length > 0) return true;
    let projectHooks = getProjectHooks()?.[eventName];
    if (projectHooks && projectHooks.length > 0) return true;
    if (appState?.sessionHooks.get(agentId)?.hooks[eventName]) return true;
    return false
}

// Mapping: NS1->areHooksEnabled, A->eventName, q->appState, K->agentId,
//          EM6->getPolicyHooks, Xp->getProjectHooks
```

**Key insight:** This function does not check user hooks (`i24`) or perform the full merge that `E_z` does. It is an intentionally imprecise fast-path -- it may return true even if all matching hooks would later be filtered out by matchers. The purpose is to avoid the overhead of `kr8` (resolveHooksForEvent) when no hooks exist at all, which is the common case for most tools in most sessions.

---

## 3. Pre-Tool Hook Execution Entry Point

### executePreToolHooks - Generator that runs all PreToolUse hooks

**What it does:** The async generator that constructs the full hook input payload for PreToolUse events and delegates to the central hook executor (`Ax`). This is the bridge between the tool execution pipeline and the hook system.

**How it works:**

1. Gets the app state and resolves the agent ID
2. Calls `NS1` (areHooksEnabled) as an early exit -- if no PreToolUse hooks exist, returns immediately
3. Constructs the hook input by spreading `$w()` (buildHookContext) with PreToolUse-specific fields: `tool_name`, `tool_input`, `tool_use_id`
4. Yields all results from `Ax` (executeHooksIterator) back to the caller

```javascript
// ============================================
// executePreToolHooks - PreToolUse hook entry point
// Location: chunks.175.mjs:2462-2483
// ============================================

// ORIGINAL (for source lookup):
async function* LF8(A, q, K, Y, z, _, w = T$, O, $) {
    let H = Y.getAppState(),
        j = Y.agentId ?? R1();
    if (!NS1("PreToolUse", H, j)) return;
    k(`executePreToolHooks called for tool: ${A}`);
    let J = {
        ...$w(z, void 0, Y),
        hook_event_name: "PreToolUse",
        tool_name: A,
        tool_input: K,
        tool_use_id: q
    };
    yield* Ax({
        hookInput: J,
        toolUseID: q,
        matchQuery: A,
        signal: _,
        timeoutMs: w,
        toolUseContext: Y,
        requestPrompt: O,
        toolInputSummary: $
    })
}

// READABLE (for understanding):
async function* executePreToolHooks(toolName, toolUseId, input, toolUseContext, permissionMode, signal, timeoutMs = DEFAULT_TIMEOUT, requestPrompt, toolInputSummary) {
    let appState = toolUseContext.getAppState();
    let agentId = toolUseContext.agentId ?? getSessionId();
    if (!areHooksEnabled("PreToolUse", appState, agentId)) return;
    log(`executePreToolHooks called for tool: ${toolName}`);
    let hookInput = {
        ...buildHookContext(permissionMode, undefined, toolUseContext),
        hook_event_name: "PreToolUse",
        tool_name: toolName,
        tool_input: input,
        tool_use_id: toolUseId
    };
    yield* executeHooksIterator({
        hookInput,
        toolUseID: toolUseId,
        matchQuery: toolName,
        signal,
        timeoutMs,
        toolUseContext,
        requestPrompt,
        toolInputSummary
    })
}

// Mapping: LF8->executePreToolHooks, A->toolName, q->toolUseId, K->input, Y->toolUseContext,
//          z->permissionMode, _->signal, w->timeoutMs, T$->DEFAULT_TIMEOUT,
//          O->requestPrompt, $->toolInputSummary,
//          NS1->areHooksEnabled, $w->buildHookContext, Ax->executeHooksIterator
```

**Key insight:** The `matchQuery` parameter passed to `Ax` is the tool name itself. This is what gets tested against each hook's `matcher` field. For example, a hook with `matcher: "Bash|Write"` would match PreToolUse events for the Bash and Write tools but not for Read or Grep.

---

## 4. Hook Resolution Algorithm

### resolveHooksForEvent - Merge, match, filter, deduplicate

**What it does:** Takes all hooks from all sources, filters them by the event's match query, and deduplicates by hook type. This is the complete algorithm that determines which hooks actually run for a given event.

**How it works:**

The algorithm has four stages:

```
Stage 1: Merge Sources
    E_z(appState, agentId, eventName) -> flat array of hooks from all sources

Stage 2: Extract Match Query
    Switch on hook_event_name:
      PreToolUse / PostToolUse / PostToolUseFailure / PermissionRequest -> tool_name
      SessionStart -> source
      Setup / PreCompact / PostCompact -> trigger
      Notification -> notification_type
      SessionEnd -> reason
      SubagentStart / SubagentStop -> agent_type
      Elicitation / ElicitationResult -> mcp_server_name
      ConfigChange -> source
      InstructionsLoaded -> load_reason
      TeammateIdle / TaskCompleted -> (no match query)

Stage 3: Filter by Matcher
    k_z(matchQuery, hook.matcher) for each hook
    If no match query, all hooks pass

Stage 4: Deduplicate by Type + Content
    Command hooks: dedup by (pluginRoot/skillRoot + command string)
    Prompt hooks: dedup by (pluginRoot/skillRoot + prompt string)
    Agent hooks: dedup by (pluginRoot/skillRoot + prompt string)
    HTTP hooks: dedup by (pluginRoot/skillRoot + URL)
    Callback hooks: no dedup (always included)
    Function hooks: no dedup (always included)

Post-filter: SessionStart and Setup events skip HTTP hooks
```

```javascript
// ============================================
// resolveHooksForEvent - Full hook resolution algorithm
// Location: chunks.175.mjs:1506-1586
// ============================================

// ORIGINAL (for source lookup):
function kr8(A, q, K, Y) {
    try {
        let z = E_z(A, q, K),
            _ = void 0;
        switch (Y.hook_event_name) {
            case "PreToolUse":
            case "PostToolUse":
            case "PostToolUseFailure":
            case "PermissionRequest":
                _ = Y.tool_name;
                break;
            case "SessionStart":
                _ = Y.source;
                break;
            // ... 12 more cases ...
            default:
                break
        }
        let O = (_ ? z.filter((W) => !W.matcher || k_z(_, W.matcher)) : z).flatMap((W) => {
                let Z = "pluginRoot" in W ? W.pluginRoot : void 0,
                    G = "pluginId" in W ? W.pluginId : void 0,
                    f = "skillRoot" in W ? W.skillRoot : void 0,
                    v = Z ? "pluginName" in W ? `plugin:${W.pluginName}` : "plugin" : f ? "skillName" in W ? `skill:${W.skillName}` : "skill" : "settings";
                return W.hooks.map((N) => ({
                    hook: N,
                    pluginRoot: Z,
                    pluginId: G,
                    skillRoot: f,
                    hookSource: v
                }))
            }),
            $ = Array.from(new Map(O.filter((W) => W.hook.type === "command").map((W) => [fS1(W, W.hook.command), W])).values()),
            H = Array.from(new Map(O.filter((W) => W.hook.type === "prompt").map((W) => [fS1(W, W.hook.prompt), W])).values()),
            j = Array.from(new Map(O.filter((W) => W.hook.type === "agent").map((W) => [fS1(W, W.hook.prompt), W])).values()),
            J = Array.from(new Map(O.filter((W) => W.hook.type === "http").map((W) => [fS1(W, W.hook.url), W])).values()),
            M = O.filter((W) => W.hook.type === "callback"),
            D = O.filter((W) => W.hook.type === "function"),
            X = [...$, ...H, ...j, ...J, ...M, ...D],
            P = K === "SessionStart" || K === "Setup" ? X.filter((W) => {
                if (W.hook.type === "http") return !1;
                return !0
            }) : X;
        return P
    } catch {
        return []
    }
}

// READABLE (for understanding):
function resolveHooksForEvent(appState, agentId, eventName, hookInput) {
    let allHooks = mergeHookSources(appState, agentId, eventName);
    let matchQuery = extractMatchQuery(hookInput);
    let filtered = matchQuery
        ? allHooks.filter(h => !h.matcher || matchesHookMatcher(matchQuery, h.matcher))
        : allHooks;
    let flattened = filtered.flatMap(hookDef => {
        let source = hookDef.pluginRoot ? `plugin:${hookDef.pluginName}` :
                     hookDef.skillRoot ? `skill:${hookDef.skillName}` : "settings";
        return hookDef.hooks.map(hook => ({ hook, pluginRoot: hookDef.pluginRoot, hookSource: source }));
    });
    let commands = deduplicateByKey(flattened, "command", h => h.hook.command);
    let prompts = deduplicateByKey(flattened, "prompt", h => h.hook.prompt);
    let agents = deduplicateByKey(flattened, "agent", h => h.hook.prompt);
    let https = deduplicateByKey(flattened, "http", h => h.hook.url);
    let callbacks = flattened.filter(h => h.hook.type === "callback");
    let functions = flattened.filter(h => h.hook.type === "function");
    let all = [...commands, ...prompts, ...agents, ...https, ...callbacks, ...functions];
    if (eventName === "SessionStart" || eventName === "Setup") {
        return all.filter(h => h.hook.type !== "http");
    }
    return all;
}

// Mapping: kr8->resolveHooksForEvent, E_z->mergeHookSources, k_z->matchesHookMatcher,
//          fS1->deduplicationKey, A->appState, q->agentId, K->eventName, Y->hookInput
```

**Key insight:** The deduplication strategy is type-specific. Two command hooks with the same command string from different sources (e.g., project settings and a plugin) are deduplicated -- only the last one wins (because `Map` keeps the last entry). This means a plugin can override a project hook by registering a hook with the same command string. Callback and function hooks are never deduplicated because they are internal hooks that may have distinct in-process behavior even if they appear similar.

---

## 5. Hook Source Merging

### mergeHookSources - Assembles hooks from all config layers

**What it does:** Loads hook definitions from all possible sources and merges them into a single ordered array. This determines the precedence of hooks from different origins.

**How it works:**

1. **Policy hooks** (highest priority): Organization-managed hooks from `getPolicyHooks()`. Always included.
2. **Project hooks**: From `.claude/settings.json` or project configuration. Plugin-contributed hooks are skipped when `isManagedOnlyMode()` is true.
3. **Session hooks**: Dynamically registered during the session (e.g., by skills or plugins). Skipped in managed-only mode.
4. **User hooks** (lowest priority): From user-level configuration. Skipped in managed-only mode.

```javascript
// ============================================
// mergeHookSources - Multi-source hook loading and merging
// Location: chunks.175.mjs:1477-1495
// ============================================

// ORIGINAL (for source lookup):
function E_z(A, q, K) {
    let Y = [...EM6()?.[K] ?? []],
        z = GL(),
        _ = Xp()?.[K];
    if (_)
        for (let w of _) {
            if (z && "pluginRoot" in w) continue;
            Y.push(w)
        }
    if (!z && A !== void 0) {
        let w = jW1(A, q, K).get(K);
        if (w)
            for (let $ of w) Y.push($);
        let O = i24(A, q, K).get(K);
        if (O)
            for (let $ of O) Y.push($)
    }
    return Y
}

// READABLE (for understanding):
function mergeHookSources(appState, agentId, eventName) {
    let hooks = [...(getPolicyHooks()?.[eventName] ?? [])];
    let managedOnly = isManagedOnlyMode();
    let projectHooks = getProjectHooks()?.[eventName];
    if (projectHooks) {
        for (let hook of projectHooks) {
            if (managedOnly && "pluginRoot" in hook) continue;
            hooks.push(hook);
        }
    }
    if (!managedOnly && appState !== undefined) {
        let sessionHooks = getSessionHooks(appState, agentId, eventName).get(eventName);
        if (sessionHooks) {
            for (let hook of sessionHooks) hooks.push(hook);
        }
        let userHooks = getUserHooks(appState, agentId, eventName).get(eventName);
        if (userHooks) {
            for (let hook of userHooks) hooks.push(hook);
        }
    }
    return hooks;
}

// Mapping: E_z->mergeHookSources, A->appState, q->agentId, K->eventName,
//          EM6->getPolicyHooks, GL->isManagedOnlyMode, Xp->getProjectHooks,
//          jW1->getSessionHooks, i24->getUserHooks
```

**Source priority order:**

| Priority | Source | Function | When skipped |
|----------|--------|----------|-------------|
| 1 (highest) | Policy | `EM6()` (getPolicyHooks) | Never |
| 2 | Project | `Xp()` (getProjectHooks) | Plugin hooks skipped in managed-only mode |
| 3 | Session | `jW1()` (getSessionHooks) | Entire source skipped in managed-only mode |
| 4 (lowest) | User | `i24()` (getUserHooks) | Entire source skipped in managed-only mode |

**Key insight:** Managed-only mode (`GL()`) is an enterprise control that restricts hooks to only policy and non-plugin project hooks. This prevents users or third-party plugins from injecting hooks that could bypass organizational security policies. When an organization deploys Claude Code with managed settings, only their policy hooks and the project's own settings-defined hooks run.

---

## 6. Hook Matcher Algorithm

### matchesHookMatcher - Pattern matching for hook filtering

**What it does:** Tests whether a match query (typically a tool name) satisfies a hook's `matcher` pattern. Supports three matching modes: wildcard, literal/pipe-delimited, and regex.

**How it works:**

1. **No matcher or wildcard**: `undefined` or `"*"` matches everything
2. **Simple alphanumeric**: If the matcher contains only letters, digits, underscores, and pipes:
   - If it contains `|`, split and check if the query matches any segment
   - Otherwise, direct equality check
   - Both sides normalized via `EG()` (case normalization)
3. **Regex**: If the matcher contains special characters, compile as `RegExp` and test against the query and all its aliases (`v57()`)

```javascript
// ============================================
// matchesHookMatcher - Hook matcher pattern algorithm
// Location: chunks.175.mjs:1434-1449
// ============================================

// ORIGINAL (for source lookup):
function k_z(A, q) {
    if (!q || q === "*") return !0;
    if (/^[a-zA-Z0-9_|]+$/.test(q)) {
        if (q.includes("|")) return q.split("|").map((Y) => EG(Y.trim())).includes(A);
        return A === EG(q)
    }
    try {
        let K = new RegExp(q);
        if (K.test(A)) return !0;
        for (let Y of v57(A))
            if (K.test(Y)) return !0;
        return !1
    } catch {
        return k(`Invalid regex pattern in hook matcher: ${q}`), !1
    }
}

// READABLE (for understanding):
function matchesHookMatcher(query, matcher) {
    if (!matcher || matcher === "*") return true;
    if (/^[a-zA-Z0-9_|]+$/.test(matcher)) {
        if (matcher.includes("|"))
            return matcher.split("|").map(s => normalizeToolName(s.trim())).includes(query);
        return query === normalizeToolName(matcher);
    }
    try {
        let regex = new RegExp(matcher);
        if (regex.test(query)) return true;
        for (let alias of getToolAliases(query))
            if (regex.test(alias)) return true;
        return false;
    } catch {
        return log(`Invalid regex pattern in hook matcher: ${matcher}`), false;
    }
}

// Mapping: k_z->matchesHookMatcher, A->query, q->matcher,
//          EG->normalizeToolName, v57->getToolAliases
```

**Matching examples:**

| Matcher | Query | Result | Mode |
|---------|-------|--------|------|
| `undefined` | any | match | wildcard |
| `"*"` | any | match | wildcard |
| `"Bash"` | `"Bash"` | match | literal |
| `"Bash\|Write"` | `"Write"` | match | pipe-delimited |
| `"mcp__.*"` | `"mcp__github__search"` | match | regex |
| `"^(Read\|Grep)$"` | `"Edit"` | no match | regex |

**Key insight:** The alias check (`v57()`) in regex mode means hooks can match tool names even when the tool has been renamed or aliased. For example, an MCP tool might have an alias, and a regex matcher can catch both the canonical name and the alias.

---

## 7. Hook Permission Decision Schema

### hookSpecificOutput - The PreToolUse permission contract

**What it does:** Defines the JSON schema that hooks must return to influence permission decisions. This is the contract between external hooks and the permission system.

**How it works:**

The `hookSpecificOutput` field in hook JSON output is a discriminated union keyed on `hookEventName`. For PreToolUse events, the schema is:

```javascript
// ============================================
// PreToolUse hookSpecificOutput schema
// Location: chunks.175.mjs:237-242
// ============================================

hookSpecificOutput: C.object({
    hookEventName: C.literal("PreToolUse"),
    permissionDecision: C.enum(["allow", "deny", "ask"]).optional(),
    permissionDecisionReason: C.string().optional(),
    updatedInput: C.record(C.string(), C.unknown()).optional(),
    additionalContext: C.string().optional()
})
```

| Field | Type | Effect |
|-------|------|--------|
| `permissionDecision` | `"allow" \| "deny" \| "ask"` | Overrides the normal permission check |
| `permissionDecisionReason` | string | Human-readable reason shown in UI |
| `updatedInput` | `Record<string, unknown>` | Replaces tool input before execution |
| `additionalContext` | string | Injected as a system-reminder-style message |

**Two permission paths in hook output:**

Hooks can express permission decisions via two independent mechanisms:

1. **Top-level `decision`**: `"approve"` or `"block"` -- coarse-grained, works for all event types
2. **`hookSpecificOutput.permissionDecision`**: `"allow"`, `"deny"`, or `"ask"` -- fine-grained, PreToolUse-specific

If both are present, `hookSpecificOutput.permissionDecision` takes precedence (it is processed after `decision` in the `Gi4` function).

---

## 8. Permission Decision Mapping

### processHookJsonOutput - Translating hook output to permission behavior

**What it does:** Maps the structured JSON output from a hook into internal permission behavior values. This function handles both the top-level `decision` field and the event-specific `hookSpecificOutput`.

**How it works:**

Two sequential switch statements process the hook output:

```javascript
// ============================================
// processHookJsonOutput - Permission decision mapping (excerpt)
// Location: chunks.175.mjs:1096-1145
// ============================================

// ORIGINAL (for source lookup):
// Top-level decision mapping:
if (A.decision) switch (A.decision) {
    case "approve":
        j.permissionBehavior = "allow";
        break;
    case "block":
        j.permissionBehavior = "deny", j.blockingError = {
            blockingError: A.reason || "Blocked by hook",
            command: q
        };
        break;
    default:
        throw Error(`Unknown hook decision type: ${A.decision}. Valid types are: approve, block`)
}

// hookSpecificOutput.permissionDecision mapping (overwrites top-level):
if (A.hookSpecificOutput?.hookEventName === "PreToolUse" && A.hookSpecificOutput.permissionDecision)
    switch (A.hookSpecificOutput.permissionDecision) {
        case "allow":
            j.permissionBehavior = "allow";
            break;
        case "deny":
            j.permissionBehavior = "deny", j.blockingError = {
                blockingError: A.hookSpecificOutput.permissionDecisionReason || A.reason || "Blocked by hook",
                command: q
            };
            break;
        case "ask":
            j.permissionBehavior = "ask";
            break;
        default:
            throw Error(`Unknown hook permissionDecision type: ...`)
    }

// READABLE (for understanding):
// Stage 1: top-level decision (coarse)
if (hookOutput.decision === "approve") result.permissionBehavior = "allow";
if (hookOutput.decision === "block") result.permissionBehavior = "deny";

// Stage 2: hookSpecificOutput (fine, overwrites stage 1)
if (hookOutput.hookSpecificOutput?.hookEventName === "PreToolUse") {
    if (permissionDecision === "allow") result.permissionBehavior = "allow";
    if (permissionDecision === "deny") result.permissionBehavior = "deny";
    if (permissionDecision === "ask") result.permissionBehavior = "ask";
}
```

**Complete decision mapping:**

| Hook Output Field | Hook Value | Internal Behavior | Effect |
|-------------------|-----------|-------------------|--------|
| `decision` | `"approve"` | `"allow"` | Bypass permission dialog |
| `decision` | `"block"` | `"deny"` | Block with error |
| `hookSpecificOutput.permissionDecision` | `"allow"` | `"allow"` | Bypass permission dialog |
| `hookSpecificOutput.permissionDecision` | `"deny"` | `"deny"` | Block with error |
| `hookSpecificOutput.permissionDecision` | `"ask"` | `"ask"` | Force user prompt |
| Neither set | -- | `undefined` | No permission override |

**Key insight:** The `"ask"` behavior is unique to `hookSpecificOutput.permissionDecision` -- it cannot be expressed via the top-level `decision` field. This is important because `"ask"` forces a user prompt even when auto-allow rules would normally permit the tool call. Enterprise security hooks use this to ensure human review of sensitive operations.

---

## 9. Multi-Hook Permission Aggregation

### Priority aggregation in executeHooksIterator

**What it does:** When multiple hooks return permission decisions, their results are aggregated using a strict priority order: deny beats everything, ask beats allow, allow only takes effect if nothing else has decided.

**How it works:**

The aggregation uses a mutable variable `h` that tracks the strongest permission decision seen so far:

```javascript
// ============================================
// Multi-hook permission aggregation
// Location: chunks.175.mjs:2196-2220
// ============================================

// ORIGINAL (for source lookup):
if (I.permissionBehavior) switch (I.permissionBehavior) {
    case "deny":
        h = "deny";
        break;
    case "ask":
        if (h !== "deny") h = "ask";
        break;
    case "allow":
        if (!h) h = "allow";
        break;
    case "passthrough":
        break
}
if (h !== void 0) {
    let g = I.updatedInput && (I.permissionBehavior === "allow" || I.permissionBehavior === "ask")
        ? I.updatedInput : void 0;
    yield {
        permissionBehavior: h,
        hookPermissionDecisionReason: I.hookPermissionDecisionReason,
        hookSource: R.get(I.hook),
        updatedInput: g
    }
}

// READABLE (for understanding):
if (hookResult.permissionBehavior) {
    switch (hookResult.permissionBehavior) {
        case "deny":
            aggregatedDecision = "deny";                      // Always wins
            break;
        case "ask":
            if (aggregatedDecision !== "deny")
                aggregatedDecision = "ask";                   // Wins over allow
            break;
        case "allow":
            if (!aggregatedDecision)
                aggregatedDecision = "allow";                 // Only if nothing decided yet
            break;
        case "passthrough":
            break;                                             // No effect
    }
    if (aggregatedDecision !== undefined) {
        let updatedInput = hookResult.updatedInput &&
            (hookResult.permissionBehavior === "allow" || hookResult.permissionBehavior === "ask")
            ? hookResult.updatedInput : undefined;
        yield { permissionBehavior: aggregatedDecision, ... };
    }
}
```

**Aggregation precedence:**

```
     deny  >  ask  >  allow  >  passthrough
     ^^^^     ^^^^     ^^^^^     ^^^^^^^^^^^
    sticky   sticky   first-     ignored
    (wins    (wins    only
     always)  over    (later
              allow)  allows
                      ignored)
```

| Scenario | Hook 1 | Hook 2 | Hook 3 | Result |
|----------|--------|--------|--------|--------|
| All allow | allow | allow | allow | allow |
| Any deny | allow | deny | allow | deny |
| Ask + allow | allow | ask | -- | ask |
| Deny + ask | ask | deny | -- | deny |
| Passthrough + allow | passthrough | allow | -- | allow |

**Key insight:** The aggregation yields after *every* hook that produces a permission decision. This means the consumer (`y4q`) receives potentially multiple `hookPermissionResult` events, but only uses the final one. Each successive yield overwrites the previous decision in `fxY`'s processing loop at line 554: `Z = u.hookPermissionResult`. This is important: the aggregated decision evolves as hooks execute, and the *last-yielded* decision is what takes effect.

**updatedInput merging:** Input updates are only passed through when the hook's *individual* decision is "allow" or "ask". A hook that returns "deny" with `updatedInput` has its input changes discarded -- there is no point modifying input for a denied tool call.

---

## 10. Pipeline Integration

### executePreToolHooksIterator - Bridge between hooks and tool pipeline

**What it does:** Sits between the hook system (`LF8/Ax`) and the tool execution pipeline (`fxY`). Translates raw hook results into typed messages that `fxY` understands.

**How it works:**

The function iterates over results from `LF8` and yields typed objects:

```javascript
// ============================================
// executePreToolHooksIterator - Pipeline-level hook adapter
// Location: chunks.146.mjs:74-216
// ============================================

// ORIGINAL (for source lookup):
async function* y4q(A, q, K, Y, z, _, w, O) {
    let $ = Date.now();
    try {
        let H = A.getAppState();
        for await (let j of LF8(q.name, Y, K, A, H.toolPermissionContext.mode, A.abortController.signal, ...)) try {
            if (j.blockingError) {
                let J = yF8(`PreToolUse:${q.name}`, j.blockingError);
                yield { type: "hookPermissionResult", hookPermissionResult: { behavior: "deny", message: J, decisionReason: { type: "hook", hookName: `PreToolUse:${q.name}`, reason: J } } }
            }
            if (j.preventContinuation) {
                yield { type: "preventContinuation", shouldPreventContinuation: true };
                if (j.stopReason) yield { type: "stopReason", stopReason: j.stopReason }
            }
            if (j.permissionBehavior !== undefined) {
                let decisionReason = { type: "hook", hookName: `PreToolUse:${q.name}`, hookSource: j.hookSource, reason: j.hookPermissionDecisionReason };
                if (j.permissionBehavior === "allow") yield { type: "hookPermissionResult", hookPermissionResult: { behavior: "allow", updatedInput: j.updatedInput, decisionReason } };
                else if (j.permissionBehavior === "ask") yield { type: "hookPermissionResult", hookPermissionResult: { behavior: "ask", updatedInput: j.updatedInput, message: j.hookPermissionDecisionReason || `Hook ... asked ...`, decisionReason } };
                else yield { type: "hookPermissionResult", hookPermissionResult: { behavior: j.permissionBehavior, message: ..., decisionReason } }
            }
            if (j.updatedInput && j.permissionBehavior === void 0) yield { type: "hookUpdatedInput", updatedInput: j.updatedInput };
            if (j.additionalContexts?.length > 0) yield { type: "additionalContext", message: { ... } };
            if (A.abortController.signal.aborted) { yield { type: "stop" }; return; }
        } catch (J) { yield { type: "stop" }; }
    } catch (H) { yield { type: "stop" }; return; }
}

// Mapping: y4q->executePreToolHooksIterator, A->toolUseContext, q->tool, K->input, Y->toolUseId,
//          LF8->executePreToolHooks, yF8->formatHookError, EF8->permissionBehaviorToVerb
```

**Result type mapping:**

| Hook Result Field | Pipeline Yield Type | Effect in fxY |
|-------------------|---------------------|---------------|
| `blockingError` | `hookPermissionResult { behavior: "deny" }` | Tool denied with hook error message |
| `preventContinuation` | `preventContinuation` | Entire agent loop stops |
| `permissionBehavior: "allow"` | `hookPermissionResult { behavior: "allow" }` | May bypass user prompt |
| `permissionBehavior: "ask"` | `hookPermissionResult { behavior: "ask" }` | Forces user prompt |
| `permissionBehavior: "deny"` | `hookPermissionResult { behavior: "deny" }` | Tool denied |
| `updatedInput` (no permission) | `hookUpdatedInput` | Input replaced silently |
| `additionalContexts` | `additionalContext` | Injected as attachment message |
| abort signal | `stop` | Pipeline terminates |

**Key insight:** The `decisionReason` object carries `type: "hook"` which is later used in `fxY` (line 603) to distinguish hook-driven decisions from config-driven decisions for telemetry: `let I = V.decisionReason?.type === "hook" ? "hook" : "config"`. This tracking enables organizations to monitor how often hooks override normal permission flows.

---

## 11. Hook Decision Integration in fxY

### How the pipeline uses hook permission results

**What it does:** After `y4q` yields all hook results, `fxY` (toolExecutionPipeline) makes the final permission decision by combining the hook result with the standard `canUseTool` flow.

**How it works:**

The decision tree at fxY lines 591-600:

```
hookPermissionResult (Z) resolved from y4q
    |
    +-- Z.behavior === "allow" AND tool does NOT requiresUserInteraction()
    |     AND NOT requireCanUseTool
    |     -> AUTO-ALLOW: Skip permission dialog entirely
    |
    +-- Z.behavior === "allow" AND tool DOES requiresUserInteraction()
    |     OR requireCanUseTool
    |     -> DOWNGRADE: Fall through to canUseTool() despite hook approval
    |     -> But apply updatedInput from hook
    |
    +-- Z.behavior === "deny"
    |     -> DENY: Tool blocked immediately
    |
    +-- Z.behavior === "ask"
    |     -> FORCE ASK: Pass hook context to canUseTool(), which will
    |        force a user prompt even if auto-allow rules match
    |
    +-- Z undefined (no hook override)
          -> NORMAL: Standard canUseTool() flow
```

```javascript
// ORIGINAL (for source lookup):
// Location: chunks.146.mjs:591-600
let V;
if (Z !== void 0 && Z.behavior === "allow" && !A.requiresUserInteraction?.() && !Y.requireCanUseTool)
    V = Z;
else if (Z !== void 0 && Z.behavior === "allow" && (A.requiresUserInteraction?.() || Y.requireCanUseTool)) {
    if (Z.updatedInput) X = Z.updatedInput;
    V = await z(A, X, Y, _, q)
} else if (Z !== void 0 && Z.behavior === "deny")
    V = Z;
else {
    let u = Z?.behavior === "ask" ? Z : void 0;
    if (Z?.behavior === "ask" && Z.updatedInput) X = Z.updatedInput;
    V = await z(A, X, Y, _, q, u)
}
```

**Key insight:** The `requiresUserInteraction()` guard prevents hooks from silently approving tools that the tool author explicitly marked as needing human oversight. For example, `ExitPlanMode` returns true from `requiresUserInteraction()`, so even if a hook approves it, the user still sees a confirmation dialog. This is a defense-in-depth measure against hooks inadvertently weakening security boundaries.

---

## 12. Complete Data Flow Summary

```
┌────────────────────────────────────────────────────────────────────┐
│  HOOK PERMISSION DATA FLOW                                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. fxY calls y4q(toolUseContext, tool, input, ...)                 │
│       |                                                              │
│  2. y4q reads appState.toolPermissionContext.mode                    │
│       |                                                              │
│  3. y4q calls LF8(toolName, input, context, permissionMode, ...)    │
│       |                                                              │
│  4. LF8 checks NS1("PreToolUse") for quick exit                    │
│       |                                                              │
│  5. LF8 builds hookInput = { ...$w(permissionMode), tool_name,     │
│       tool_input, tool_use_id, hook_event_name: "PreToolUse" }      │
│       |                                                              │
│  6. LF8 delegates to Ax(hookInput, matchQuery=toolName, ...)        │
│       |                                                              │
│  7. Ax calls kr8() to resolve hooks:                                │
│       E_z() merges: policy -> project -> session -> user             │
│       k_z() filters by matcher pattern                               │
│       Deduplicates by type                                           │
│       |                                                              │
│  8. Ax executes each hook (command/prompt/agent/http/callback/fn)   │
│       |                                                              │
│  9. Hook returns JSON with permissionDecision and/or decision        │
│       |                                                              │
│  10. Gi4() maps hook output to permissionBehavior                   │
│       |                                                              │
│  11. Ax aggregates: deny > ask > allow > passthrough                │
│       Yields { permissionBehavior, updatedInput, reason }            │
│       |                                                              │
│  12. y4q wraps as { type: "hookPermissionResult", ... }             │
│       |                                                              │
│  13. fxY processes: Z = hookPermissionResult                        │
│       Checks requiresUserInteraction() guard                        │
│       Either auto-allows, denies, forces ask, or falls through      │
│       |                                                              │
│  14. Result: tool executes, is denied, or user is prompted          │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 13. Attachment Types for System Reminders

Hook execution produces attachment messages that are injected into the conversation as system-reminder-style context. The `tuY()` function (chunks.147.mjs:1050) collects completed async hook responses and creates attachments:

| Attachment Type | When Created | Content |
|----------------|-------------|---------|
| `async_hook_response` | Async hook completes after initial yield | Hook output, stdout, stderr, exit code |
| `hook_blocking_error` | Hook returns blocking error | Error message, command that caused it |
| `hook_non_blocking_error` | Hook fails non-fatally | stderr, exit code, command |
| `hook_success` | Hook completes successfully | stdout, parsed output |
| `hook_system_message` | Hook returns `systemMessage` | Warning text shown to user |
| `hook_additional_context` | Hook returns `additionalContext` | Context string injected into conversation |
| `hook_cancelled` | Hook aborted (signal fired) | Cancellation notice |
| `hook_progress` | Hook starts executing | Command name, status message |
| `hook_permission_decision` | PermissionRequest hook decides | Decision (allow/deny), tool use ID |

These attachments are created via `f4()` which produces message objects with an `attachment` field rather than `content`, ensuring they appear as metadata rather than user-visible text.
