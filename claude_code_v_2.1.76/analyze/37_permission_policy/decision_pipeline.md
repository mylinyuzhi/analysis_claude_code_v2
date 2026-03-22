# Permission Decision Pipeline (Claude Code 2.1.76)

> 9-layer permission decision tree: pre-hooks, global deny/ask rules, tool-specific checks, bypass modes, global allow rules, and user dialog fallback.

---

## Related Symbols

> Symbol mappings:
> - [tool_execution_pipeline.md](../05_tools/tool_execution_pipeline.md) - Tool execution pipeline (fxY) that invokes this system
> - [dialog_system.md](dialog_system.md) - UI layer for "ask" decisions
> - [permission_sync.md](../18_sandbox/permission_sync.md) - Sandbox permission sync

Key functions in this document:
- `corePermissionDecision` (BYz) - 9-step decision tree: deny rules, ask rules, tool checks, bypass, allow rules
- `canUseTool` (tJ) - Callback wrapper: BYz + auto-mode classifier + denial tracking
- `hookDecisionIntegration` (fxY lines 591-600) - Pre-hook outcome routing into permission flow
- `enqueueCommandPermissionCheck` (S4q) - Pre-flight background permission check for Bash
- `getMatchingDenyRule` (bYz) - Global deny rule matcher
- `getMatchingAskRule` (xYz) - Global ask rule matcher
- `getMatchingAllowRule` (IYz) - Global allow rule matcher
- `toolMatchesRule` (mn8) - Core rule-to-tool matching logic

---

## Architecture Overview

```
Tool use request (from agent loop via fxY)
    |
    v
+-- Layer 1: Pre-Tool Hooks (y4q -> LF8 -> Ax) ----------------------+
|  Hook permissionBehavior: allow/deny/ask                             |
|  Multi-hook priority: deny > ask > allow                             |
|  Can also: modify input, prevent continuation                        |
+----------------------------------------------------------------------+
    |
    v
+-- Layer 2: Hook Decision Integration (fxY lines 591-600) -----------+
|  Hook allowed + no requiresUserInteraction -> use directly           |
|  Hook allowed + requiresUserInteraction -> fall through to BYz       |
|  Hook denied -> immediate reject                                     |
|  Hook ask -> force user prompt                                       |
|  No hook override -> standard BYz flow                               |
+----------------------------------------------------------------------+
    |
    v
+-- Layer 3-9: BYz Core Decision Tree --------------------------------+
|  3. Global deny rules (bYz) -> deny                                  |
|  4. Global ask rules (xYz) -> ask (sandbox exception)                |
|  5. Tool checkPermissions() -> tool-specific logic                   |
|  6. Tool deny -> deny                                                |
|  7. requiresUserInteraction + ask -> ask                             |
|  8. Bypass modes -> allow                                            |
|  9. Global allow rules (IYz) -> allow                                |
|  10. Default fallback -> ask                                         |
+----------------------------------------------------------------------+
    |
    v
+-- Layer 10-12: tJ Post-Processing ----------------------------------+
|  10. "dontAsk" mode -> convert ask to deny                           |
|  11. "auto" mode -> acceptEdits fast path / allowlist / classifier   |
|  12. shouldAvoidPermissionPrompts -> deny (headless agents)          |
+----------------------------------------------------------------------+
    |
    v
  Permission decision: {behavior, decisionReason, message, updatedInput, suggestions}
```

---

## Permission Decision Object Structure

Every permission decision flows through the system as a structured object with these fields:

```javascript
// ============================================
// Permission Decision Object
// Used throughout the pipeline
// ============================================

// ORIGINAL (for source lookup):
// Returned by BYz, tJ, and hook integration code

// READABLE (for understanding):
{
    behavior: "allow" | "deny" | "ask" | "passthrough",
    message?: string,            // Human-readable explanation shown in UI
    updatedInput?: object,       // Modified tool input (hooks/rules can rewrite)
    decisionReason?: {
        type: "rule" | "hook" | "mode" | "classifier" | "other"
               | "subcommandResults" | "permissionPromptTool"
               | "sandboxOverride" | "workingDir" | "asyncAgent",
        rule?: { source, ruleBehavior, ruleValue },  // when type === "rule"
        hookName?: string,                            // when type === "hook"
        hookSource?: string,
        reason?: string,                              // when type === "hook" | "classifier" | "other"
        mode?: string,                                // when type === "mode"
        classifier?: string,                          // when type === "classifier"
    },
    suggestions?: Array<{         // Permission rule suggestions for "always allow"
        description: string,
        command: string
    }>,
    contentBlocks?: Array<object>, // Additional content to display
    blockedPath?: string           // File path that triggered the block
}

// Mapping: behavior→decision outcome, decisionReason→audit trail for why
```

**What it does:** Provides a uniform contract between the permission engine and all consumers (UI dialogs, telemetry, hook callbacks, swarm delegation).

**How it works:** The `behavior` field drives all downstream logic. The `decisionReason` field is an audit trail -- it tells the UI what text to show, tells telemetry what to log, and tells the `recheckPermission` flow whether to re-evaluate. The `passthrough` behavior is internal-only: it means "no strong opinion yet" and gets converted to `ask` at the end of BYz if nothing else claims the decision.

**Key insight:** The `updatedInput` field enables hooks and rules to silently rewrite tool input before execution. This is used by pre-tool hooks that want to allow a command but with modified parameters (e.g., stripping dangerous flags from a bash command).

---

## Core Permission Decision Tree

### BYz (corePermissionDecision) - The 9-step sequential evaluator

**What it does:** Given a tool, its input, and the current permission context, evaluates a strict sequence of checks to produce a permission decision. This is the innermost decision function -- it knows nothing about auto-mode classifiers, denial tracking, or swarm delegation.

**How it works:**

```javascript
// ============================================
// corePermissionDecision - 9-step permission evaluator
// Location: chunks.172.mjs:2715-2776
// ============================================

// ORIGINAL (for source lookup):
async function BYz(A, q, K, Y, z) {
    if (K.abortController.signal.aborted) throw new oY;
    let _ = K.getAppState(),
        w = bYz(_.toolPermissionContext, A);
    if (w) return {
        behavior: "deny", decisionReason: { type: "rule", rule: w },
        message: `Permission to use ${A.name} has been denied.`
    };
    let O = xYz(_.toolPermissionContext, A);
    if (O) {
        if (!(A.name === Q7 && vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled() && Ti(q)))
            return { behavior: "ask", decisionReason: { type: "rule", rule: O }, message: ow(A.name) }
    }
    let $ = { behavior: "passthrough", message: ow(A.name) };
    try {
        let M = A.inputSchema.parse(q);
        $ = await A.checkPermissions(M, K)
    } catch (M) {
        if (M instanceof oY || M instanceof Az) throw M;
        _6(M)
    }
    if ($?.behavior === "deny") return $;
    if (A.requiresUserInteraction?.() && $?.behavior === "ask") return $;
    if ($?.behavior === "ask" && $.decisionReason?.type === "rule" &&
        $.decisionReason.rule.ruleBehavior === "ask") return $;
    if (_ = K.getAppState(),
        _.toolPermissionContext.mode === "bypassPermissions" ||
        _.toolPermissionContext.mode === "plan" && _.toolPermissionContext.isBypassPermissionsModeAvailable)
        return { behavior: "allow", updatedInput: lfq($, q),
                 decisionReason: { type: "mode", mode: _.toolPermissionContext.mode } };
    let j = IYz(_.toolPermissionContext, A);
    if (j) return { behavior: "allow", updatedInput: lfq($, q),
                    decisionReason: { type: "rule", rule: j } };
    let J = $.behavior === "passthrough" ? { ...$, behavior: "ask", message: ow(A.name, $.decisionReason) } : $;
    return J
}

// READABLE (for understanding):
async function corePermissionDecision(tool, input, toolUseContext, assistantMsg, toolUseId) {
    if (toolUseContext.abortController.signal.aborted) throw new AbortError;
    let appState = toolUseContext.getAppState();

    // Step 1: Global deny rules - unconditional block
    let denyRule = getMatchingDenyRule(appState.toolPermissionContext, tool);
    if (denyRule) return { behavior: "deny", reason: denyRule };

    // Step 2: Global ask rules - with sandbox exception
    let askRule = getMatchingAskRule(appState.toolPermissionContext, tool);
    if (askRule) {
        let isSandboxedBash = tool.name === BASH_TOOL && isSandboxingEnabled()
                              && isAutoAllowBashIfSandboxed() && inputIsSafe(input);
        if (!isSandboxedBash) return { behavior: "ask", reason: askRule };
    }

    // Step 3: Tool-specific permission check
    let toolResult = { behavior: "passthrough" };
    try {
        let parsedInput = tool.inputSchema.parse(input);
        toolResult = await tool.checkPermissions(parsedInput, toolUseContext);
    } catch (e) { /* propagate abort/cancellation, log others */ }

    // Step 4: Tool denied -> immediate deny
    if (toolResult.behavior === "deny") return toolResult;

    // Step 5: Interactive tool requesting ask -> respect it
    if (tool.requiresUserInteraction?.() && toolResult.behavior === "ask") return toolResult;

    // Step 6: Tool returned ask with explicit ask-rule -> respect it
    if (toolResult.behavior === "ask" && toolResult.decisionReason?.type === "rule"
        && toolResult.decisionReason.rule.ruleBehavior === "ask") return toolResult;

    // Step 7: Bypass modes -> auto-allow
    appState = toolUseContext.getAppState();  // re-read (may have changed)
    if (appState.toolPermissionContext.mode === "bypassPermissions" ||
        (appState.toolPermissionContext.mode === "plan" && appState.toolPermissionContext.isBypassPermissionsModeAvailable))
        return { behavior: "allow", mode: appState.toolPermissionContext.mode };

    // Step 8: Global allow rules -> auto-allow
    let allowRule = getMatchingAllowRule(appState.toolPermissionContext, tool);
    if (allowRule) return { behavior: "allow", rule: allowRule };

    // Step 9: Fallback -> convert passthrough to ask
    return toolResult.behavior === "passthrough"
        ? { ...toolResult, behavior: "ask" }
        : toolResult;
}

// Mapping: BYz->corePermissionDecision, A->tool, q->input, K->toolUseContext, Y->assistantMsg, z->toolUseId
// bYz->getMatchingDenyRule, xYz->getMatchingAskRule, IYz->getMatchingAllowRule
// Q7->BASH_TOOL, vA->sandboxConfig, Ti->inputIsSafe, ow->buildPermissionMessage, lfq->getUpdatedInput
```

**Why this order:**

- **Step 1 (deny) before everything:** Deny rules are absolute. They cannot be overridden by tool logic, bypass modes, or allow rules. This ensures that enterprise policy denials or user denials are unbreakable.

- **Step 2 (ask) before tool check:** Global ask rules override the tool's own opinion. If an admin says "always ask for tool X", the tool itself cannot auto-allow. The sandbox exception exists because sandboxed bash is considered inherently safe -- asking about every bash command in a sandbox would be unusable.

- **Steps 3-6 (tool check) before bypass:** The tool's own `checkPermissions()` runs next. If the tool says "deny", that's respected even in bypass mode. If the tool says "ask" because it requires user interaction (like `PermissionPromptTool`) or because it found a matching ask rule internally, that's also respected before bypass can intervene.

- **Step 7 (bypass) before allow rules:** `bypassPermissions` mode and `plan` mode with bypass available skip all remaining checks. This is checked after tool deny/interactive-ask so that truly dangerous operations still get blocked.

- **Step 8 (allow rules) last among positive checks:** Allow rules are checked only after all deny/ask paths have had their chance. This ensures that an allow rule cannot override a deny rule.

- **Step 9 (fallback to ask):** If nothing matched, the default is "ask the user." This fail-safe ensures that unknown or unconfigured tools always require user approval.

---

## Rule Matching System

### Rule Source Priority and Matching

**What it does:** Three parallel functions (`KF`, `Lv6`, `yv6`) flatten the multi-source rule sets into ordered lists. The `mn8` function matches a tool against a rule.

**How it works:**

```javascript
// ============================================
// Rule collection and matching
// Location: chunks.172.mjs:2509-2594
// ============================================

// ORIGINAL (for source lookup):
function yv6(A) {   // getAllowRules
    return un8.flatMap((q) => (A.alwaysAllowRules[q] || []).map((K) => ({
        source: q, ruleBehavior: "allow", ruleValue: CH(K)
    })))
}
function KF(A) {    // getDenyRules
    return un8.flatMap((q) => (A.alwaysDenyRules[q] || []).map((K) => ({
        source: q, ruleBehavior: "deny", ruleValue: CH(K)
    })))
}
function Lv6(A) {   // getAskRules
    return un8.flatMap((q) => (A.alwaysAskRules[q] || []).map((K) => ({
        source: q, ruleBehavior: "ask", ruleValue: CH(K)
    })))
}
function mn8(A, q) {  // toolMatchesRule
    if (q.ruleValue.ruleContent !== void 0) return !1;
    let K = LC6(A);
    if (q.ruleValue.toolName === K) return !0;
    let Y = iV(q.ruleValue.toolName), z = iV(K);
    return Y !== null && z !== null && (Y.toolName === void 0 || Y.toolName === "*") && Y.serverName === z.serverName
}

// READABLE (for understanding):
function getAllowRules(permContext) {
    return RULE_SOURCES.flatMap(source =>
        (permContext.alwaysAllowRules[source] || []).map(rule => ({
            source, ruleBehavior: "allow", ruleValue: normalizeRule(rule)
        }))
    );
}
function toolMatchesRule(tool, rule) {
    if (rule.ruleValue.ruleContent !== undefined) return false;  // content rules don't match by tool name
    let toolCanonicalName = getCanonicalToolName(tool);
    if (rule.ruleValue.toolName === toolCanonicalName) return true;
    // MCP wildcard matching: mcp__server__* matches any tool on that server
    let ruleParts = parseMcpToolName(rule.ruleValue.toolName);
    let toolParts = parseMcpToolName(toolCanonicalName);
    return ruleParts !== null && toolParts !== null
        && (ruleParts.toolName === undefined || ruleParts.toolName === "*")
        && ruleParts.serverName === toolParts.serverName;
}

// Mapping: yv6->getAllowRules, KF->getDenyRules, Lv6->getAskRules, mn8->toolMatchesRule
// un8->RULE_SOURCES (array of source keys), CH->normalizeRule, LC6->getCanonicalToolName, iV->parseMcpToolName
```

**Key insight:** The `un8` array defines the iteration order of rule sources. Rules are evaluated in source priority order, and the first match wins (via `.find()`). This means a deny rule from `session` source takes precedence over one from `userSettings`. The MCP wildcard matching (`mcp__server__*`) enables server-level allow/deny rules that apply to all tools from a given MCP server.

---

## Rule Sources

```
Rules are collected from toolPermissionContext which contains three maps:
  alwaysAllowRules, alwaysAskRules, alwaysDenyRules

Each map is keyed by source:
  session          <- Highest priority (set at runtime via user interaction)
  cliArg           <- --allow-tool, --deny-tool CLI flags
  command          <- set programmatically during the session
  flagSettings     <- --dangerously-skip-permissions etc.
  localSettings    <- .claude/settings.local.json
  projectSettings  <- .claude/settings.json (project-level)
  policySettings   <- Enterprise policy
  userSettings     <- ~/.claude/settings.json (user-level)

The un8 array iterates these in priority order.
Rules from higher-priority sources are checked first by .find().
```

---

## Hook Decision Integration

### fxY lines 591-600 - Four-branch hook routing

**What it does:** After pre-tool hooks run, this code decides whether to use the hook's permission decision directly or to fall through to the standard `canUseTool` (tJ -> BYz) path.

**How it works:**

```javascript
// ============================================
// Hook decision integration - 4 branches
// Location: chunks.146.mjs:591-600
// ============================================

// ORIGINAL (for source lookup):
if (Z !== void 0 && Z.behavior === "allow" && !A.requiresUserInteraction?.() && !Y.requireCanUseTool)
    k(`Hook approved tool use for ${A.name}, bypassing permission check`), V = Z;
else if (Z !== void 0 && Z.behavior === "allow" && (A.requiresUserInteraction?.() || Y.requireCanUseTool))
{
    if (k(`Hook approved tool use for ${A.name}, but canUseTool is required`), Z.updatedInput) X = Z.updatedInput;
    V = await z(A, X, Y, _, q)
} else if (Z !== void 0 && Z.behavior === "deny")
    k(`Hook denied tool use for ${A.name}`), V = Z;
else {
    let u = Z?.behavior === "ask" ? Z : void 0;
    if (Z?.behavior === "ask" && Z.updatedInput) X = Z.updatedInput;
    V = await z(A, X, Y, _, q, u)
}

// READABLE (for understanding):
if (hookResult && hookResult.behavior === "allow"
    && !tool.requiresUserInteraction?.() && !options.requireCanUseTool)
{
    // Branch 1: Hook allows, tool doesn't need interaction -> bypass permission entirely
    log("Hook approved, bypassing permission check");
    permissionDecision = hookResult;
}
else if (hookResult && hookResult.behavior === "allow"
    && (tool.requiresUserInteraction?.() || options.requireCanUseTool))
{
    // Branch 2: Hook allows, but tool requires interaction -> fall through to canUseTool
    // Hook's updatedInput is used, but user must still approve
    log("Hook approved but canUseTool is required");
    if (hookResult.updatedInput) input = hookResult.updatedInput;
    permissionDecision = await canUseTool(tool, input, options, assistantMsg, toolUseId);
}
else if (hookResult && hookResult.behavior === "deny")
{
    // Branch 3: Hook denies -> immediate rejection, no further checks
    log("Hook denied tool use");
    permissionDecision = hookResult;
}
else
{
    // Branch 4: No hook result, or hook says "ask" -> standard permission flow
    // If hook said "ask", pass it as a hint to canUseTool
    let hookHint = hookResult?.behavior === "ask" ? hookResult : undefined;
    if (hookResult?.behavior === "ask" && hookResult.updatedInput) input = hookResult.updatedInput;
    permissionDecision = await canUseTool(tool, input, options, assistantMsg, toolUseId, hookHint);
}

// Mapping: Z->hookResult, A->tool, X->input, Y->options, _->assistantMsg, q->toolUseId
// z->canUseTool (the tJ callback), V->permissionDecision, k->log
```

**Key insight:** Branch 2 is the critical security guard. Even if a hook says "allow", tools that `requiresUserInteraction()` (like `PermissionPromptTool` which lets the user edit permissions) still go through the full permission flow. This prevents a hook from silently granting permissions to security-critical tools. The `requireCanUseTool` flag serves the same purpose for SDK/API consumers that want to enforce user approval regardless of hooks.

---

## canUseTool Callback

### tJ - The outer permission wrapper with auto-mode and denial tracking

**What it does:** Wraps `BYz` (corePermissionDecision) with three additional layers: denial tracking reset on allow, auto-mode classifier invocation on ask, and mode-specific conversions (dontAsk -> deny, shouldAvoidPermissionPrompts -> deny).

**How it works:**

```javascript
// ============================================
// canUseTool - Outer permission wrapper
// Location: chunks.173.mjs:3-200
// ============================================

// ORIGINAL (for source lookup):
tJ = async (A, q, K, Y, z) => {
    let _ = await BYz(A, q, K, Y, z);
    if (_.behavior === "allow") {
        let w = K.getAppState();
        { let O = K.localDenialTracking ?? w.denialTracking;
          if (w.toolPermissionContext.mode === "auto" && O && O.consecutiveDenials > 0) {
              let $ = Fi6(O); I_6(K, $) } }
        return _
    }
    if (_.behavior === "ask") {
        let w = K.getAppState();
        if (w.toolPermissionContext.mode === "dontAsk") return { behavior: "deny", ... };
        if (w.toolPermissionContext.mode === "auto" || w.toolPermissionContext.prePlanMode === "auto") {
            // ... acceptEdits fast path, allowlist check, classifier invocation ...
        }
        if (w.toolPermissionContext.shouldAvoidPermissionPrompts) {
            // ... try async agent delegation, otherwise deny ...
        }
    }
    return _
}

// READABLE (for understanding):
canUseTool = async (tool, input, toolUseContext, assistantMsg, toolUseId) => {
    let result = await corePermissionDecision(tool, input, toolUseContext, assistantMsg, toolUseId);

    if (result.behavior === "allow") {
        // Reset consecutive denial counter on successful allow (in auto mode)
        let tracking = toolUseContext.localDenialTracking ?? appState.denialTracking;
        if (mode === "auto" && tracking?.consecutiveDenials > 0) resetDenials(tracking);
        return result;
    }

    if (result.behavior === "ask") {
        // Mode: dontAsk -> convert ask to deny
        if (mode === "dontAsk") return { behavior: "deny", mode: "dontAsk" };

        // Mode: auto (or pre-plan was auto) -> classifier pipeline
        if (mode === "auto" || prePlanMode === "auto") {
            // Fast path 1: requiresUserInteraction -> must ask (no auto-allow)
            if (tool.requiresUserInteraction?.()) return result;

            // Fast path 2: Dangerous action classifier unavailable -> retry/abort
            if (result.decisionReason?.classifier === "dangerous-agent-action-unavailable") {
                /* exponential backoff retry, or abort in headless */ }

            // Fast path 3: Would be allowed in acceptEdits mode? -> allow
            let acceptEditsResult = await tool.checkPermissions(input, { mode: "acceptEdits" });
            if (acceptEditsResult.behavior === "allow") return { behavior: "allow", mode: "auto" };

            // Fast path 4: Tool on safe allowlist? -> allow
            if (autoModeAllowlist.isAutoModeAllowlistedTool(tool.name)) return { behavior: "allow" };

            // Full path: Invoke auto-mode classifier (LLM-based safety check)
            let classifierResult = await invokeAutoModeClassifier(messages, toolCall, tools, permContext, signal);
            if (classifierResult.shouldBlock) {
                /* track denial, return deny with reason */ }
            return { behavior: "allow", classifier: "auto-mode" };
        }

        // Mode: headless agent -> try async delegation, otherwise deny
        if (shouldAvoidPermissionPrompts) {
            let asyncResult = await tryAsyncAgentDelegation(tool, input, toolUseId, ...);
            if (asyncResult) return asyncResult;
            return { behavior: "deny", reason: "Permission prompts unavailable" };
        }
    }
    return result;
}

// Mapping: tJ->canUseTool, BYz->corePermissionDecision, Fi6->resetDenials, I_6->updateDenialTracking
// SYz->autoModeAllowlist, EN1->invokeAutoModeClassifier, FKq->incrementDenials
// mYz->handleExcessiveDenials, oY->AbortError, Az->CancellationError
```

**Auto-mode classifier pipeline (within tJ):**

```
BYz returns "ask"
    |
    v
Is tool.requiresUserInteraction()? --yes--> return "ask" (must prompt)
    |no
    v
Is classifier unavailable? --yes--> exponential backoff retry, then deny
    |no
    v
Would tool be allowed in acceptEdits mode? --yes--> allow (fast path)
    |no
    v
Is tool on safe allowlist? --yes--> allow (fast path)
    |no
    v
Invoke LLM auto-mode classifier (EN1)
    |
    +-- shouldBlock + unavailable: deny (fail closed or fail open based on flag)
    +-- shouldBlock + available: deny with reason, track denial
    +-- !shouldBlock: allow
```

**Key insight:** The auto-mode classifier is expensive (it makes an LLM API call), so there are three fast paths that skip it: (1) the tool would be allowed in the more permissive `acceptEdits` mode, (2) the tool is on a hardcoded safe allowlist, or (3) the tool requires user interaction (in which case the classifier cannot help). The classifier also has a failure mode tracker (`denialTracking`) that escalates to user prompts or aborts if the classifier is repeatedly unavailable.

---

## Pre-Flight Permission Check

### S4q (enqueueCommandPermissionCheck) - Background pre-check for Bash

**What it does:** Starts a background permission check for a bash command before the actual permission decision happens. This is a speculative optimization -- if the command will need a permission check, starting it early reduces latency.

**How it works:**

```javascript
// ============================================
// enqueueCommandPermissionCheck - Pre-flight bash permission check
// Location: chunks.172.mjs:1915-1923
// ============================================

// ORIGINAL (for source lookup):
function S4q(A, q, K, Y) {
    if (!T66()) return !1;
    if (q.mode === "auto") return !1;
    if (q.mode === "bypassPermissions") return !1;
    let z = vN1(q);
    if (z.length === 0) return !1;
    let _ = G1(),
        w = NN1(A, _, z, "allow", K, Y);
    return w.catch(() => {}), Bfq.set(A, w), !0
}

// READABLE (for understanding):
function enqueueCommandPermissionCheck(command, permContext, abortSignal, isNonInteractive) {
    if (!isFeatureEnabled()) return false;        // Feature flag guard
    if (permContext.mode === "auto") return false;  // Auto mode has its own pipeline
    if (permContext.mode === "bypassPermissions") return false;  // No check needed
    let rules = getPreflightRules(permContext);
    if (rules.length === 0) return false;          // No rules to pre-check
    let context = getCurrentContext();
    let promise = matchCommandAgainstRules(command, context, rules, "allow", abortSignal, isNonInteractive);
    promise.catch(() => {});  // Swallow errors (this is speculative)
    preflightCache.set(command, promise);  // Cache for later retrieval
    return true;
}

// Mapping: S4q->enqueueCommandPermissionCheck, A->command, q->permContext, K->abortSignal, Y->isNonInteractive
// T66->isFeatureEnabled, vN1->getPreflightRules, G1->getCurrentContext
// NN1->matchCommandAgainstRules, Bfq->preflightCache (Map)
```

**Key insight:** This function is called from `fxY` (line 527) immediately after input validation for Bash tools, before hooks or permission checks run. The result is stored in `Bfq` (a global `Map`) keyed by the command string. Later, when the actual permission check runs, it can retrieve the pre-computed result. The `catch(() => {})` pattern prevents unhandled promise rejections since this is speculative -- if the pre-check fails, the real check will run normally. Note that `T66()` currently returns `false` and `vN1()` currently returns `[]`, meaning this feature is disabled in v2.1.76 (likely behind a feature flag for future use).

---

## Key Algorithm: Decision Priority

### Why deny is checked before allow

The ordering deny -> ask -> tool-check -> bypass -> allow -> fallback is not arbitrary. It implements a security principle: **restrictive rules always override permissive ones.**

```
                    DENY RULES
                   +-----------+
                   | Absolute  |  Cannot be overridden by anything
                   | block     |  (admin policy, explicit user deny)
                   +-----------+
                        |
                        v
                    ASK RULES
                   +-----------+
                   | Force     |  Can be bypassed only by sandbox exception
                   | prompt    |  (explicit user "always ask" rule)
                   +-----------+
                        |
                        v
                  TOOL SELF-CHECK
                   +-----------+
                   | Tool's    |  Tool knows its own semantics
                   | opinion   |  (file write to protected path, etc.)
                   +-----------+
                        |
                        v
                   BYPASS MODES
                   +-----------+
                   | Mode      |  bypassPermissions, plan+bypass
                   | override  |  Only overrides soft asks, not hard denies
                   +-----------+
                        |
                        v
                   ALLOW RULES
                   +-----------+
                   | Auto-     |  "Always allow tool X"
                   | approve   |  Only applies if nothing above blocked
                   +-----------+
                        |
                        v
                    FALLBACK
                   +-----------+
                   | Default   |  If nothing matched, ask the user
                   | to ask    |
                   +-----------+
```

### Why sandbox gets a special exception on ask rules

The ask rule bypass at Step 2 exists for one specific case: `Bash` tool when sandboxing is enabled AND `autoAllowBashIfSandboxed` is true AND the input is safe (`Ti(q)`). Without this exception, every bash command in a sandboxed environment would trigger a user prompt even though the sandbox already prevents damage. The exception makes sandboxed mode usable while preserving the ask rule's intent for non-sandboxed environments.

### Why tool deny survives bypass mode

Steps 4-6 return immediately when the tool says "deny" or when the tool requires user interaction with an "ask" result. These returns happen before Step 7 (bypass mode check). This is intentional: if a tool determines that an action is genuinely dangerous (e.g., writing to a system file), even `bypassPermissions` mode should not override that determination. The tool is closer to the action and understands the risk better than the global mode setting.

### Why appState is re-read at Step 7

BYz re-reads `K.getAppState()` before checking bypass modes (line 2752). This handles the case where the tool's `checkPermissions()` call (Step 3) modified the app state (e.g., by changing the permission mode as a side effect). Without this re-read, the bypass check could use stale state.

---

## Permission Message Builder

### ow (buildPermissionMessage) - Human-readable decision explanation

**What it does:** Converts a `decisionReason` into a human-readable message shown to the user when permission is being requested.

**How it works:**

```javascript
// ============================================
// buildPermissionMessage - Human-readable permission explanation
// Location: chunks.172.mjs:2517-2557
// ============================================

// ORIGINAL (for source lookup):
function ow(A, q) {
    if (q) {
        if (q.type === "classifier") return `Classifier '${q.classifier}' requires approval ...`;
        switch (q.type) {
            case "hook": return q.reason ? `Hook '${q.hookName}' blocked ...` : `Hook '${q.hookName}' requires approval ...`;
            case "rule": { let Y = L5(q.rule.ruleValue), z = Zn6(q.rule.source);
                           return `Permission rule '${Y}' from ${z} requires approval ...` }
            case "subcommandResults": { /* list subcommands that need approval */ }
            case "permissionPromptTool": return `Tool '${q.permissionPromptToolName}' requires approval ...`;
            case "sandboxOverride": return "Run outside of the sandbox";
            case "workingDir": return q.reason;
            case "other": return q.reason;
            case "mode": return `Current permission mode (${QQ(q.mode)}) requires approval ...`;
            case "asyncAgent": return q.reason
        }
    }
    return `Claude requested permissions to use ${A}, but you haven't granted it yet.`
}

// READABLE (for understanding):
function buildPermissionMessage(toolName, decisionReason) {
    if (decisionReason) {
        switch (decisionReason.type) {
            case "classifier":          return `Classifier '${...}' requires approval ...`;
            case "hook":                return `Hook '${hookName}' ...`;
            case "rule":                return `Rule '${ruleValue}' from ${source} ...`;
            case "subcommandResults":   return `This command contains operations requiring approval: ${list}`;
            case "permissionPromptTool": return `Tool '${name}' requires approval ...`;
            case "sandboxOverride":     return "Run outside of the sandbox";
            case "workingDir":          return reason;
            case "other":               return reason;
            case "mode":                return `Current permission mode (${mode}) requires approval ...`;
            case "asyncAgent":          return reason;
        }
    }
    return `Claude requested permissions to use ${toolName}, but you haven't granted it yet.`;
}

// Mapping: ow->buildPermissionMessage, A->toolName, q->decisionReason
// L5->formatRuleValue, Zn6->getSourceDisplayName, QQ->getModeDisplayName
```

**Key insight:** The `subcommandResults` case is specific to Bash: when a compound command (e.g., `git add . && rm -rf /`) contains multiple sub-operations, some safe and some not, the message lists only the parts that need approval. This helps the user understand exactly which part of a complex command is being flagged.

---

## Rule Management

### SMq - Delete a permission rule

**What it does:** Removes a permission rule from the system, with guards against deleting read-only rules.

```javascript
// ============================================
// deletePermissionRule - Rule removal with source guards
// Location: chunks.172.mjs:2778-2802
// ============================================

// ORIGINAL (for source lookup):
async function SMq({ rule: A, initialContext: q, setToolPermissionContext: K }) {
    if (A.source === "policySettings" || A.source === "flagSettings" || A.source === "command")
        throw Error("Cannot delete permission rules from read-only settings");
    let Y = Ez(q, { type: "removeRules", rules: [A.ruleValue], behavior: A.ruleBehavior, destination: A.source });
    switch (A.source) {
        case "localSettings":
        case "userSettings":
        case "projectSettings": { jX7(A); break }
        case "cliArg":
        case "session": break
    }
    K(Y)
}

// READABLE (for understanding):
async function deletePermissionRule({ rule, initialContext, setToolPermissionContext }) {
    // Guard: cannot delete from read-only sources
    if (rule.source === "policySettings" || rule.source === "flagSettings" || rule.source === "command")
        throw Error("Cannot delete permission rules from read-only settings");
    // Apply to in-memory context
    let newContext = applyRuleChange(initialContext, { type: "removeRules", ... });
    // Persist to disk if source is a settings file
    if (["localSettings", "userSettings", "projectSettings"].includes(rule.source))
        persistRuleDeletion(rule);
    // Session and cliArg rules are in-memory only
    setToolPermissionContext(newContext);
}

// Mapping: SMq->deletePermissionRule, jX7->persistRuleDeletion, Ez->applyRuleChange
```

**Key insight:** Three sources are read-only: `policySettings` (enterprise), `flagSettings` (CLI flags), and `command` (programmatic). These cannot be deleted at runtime because they come from sources outside the user's direct control. The distinction between persisted sources (`localSettings`, `userSettings`, `projectSettings`) and ephemeral sources (`cliArg`, `session`) determines whether deletion also writes to disk.

---

## End-to-End Flow Example

```
User says: "Run npm install"
    |
    v
Agent generates tool_use: { name: "Bash", input: { command: "npm install" } }
    |
    v
Wi6 (toolDispatcher) -> finds Bash tool in registry
    |
    v
ZxY (toolExecutionOrchestrator) -> queued execution
    |
    v
fxY (toolExecutionPipeline)
    |-- Zod schema parse: validates { command: string }
    |-- validateInput: checks command syntax
    |-- S4q: enqueues pre-flight permission check (disabled in 2.1.76)
    |-- y4q: runs pre-tool hooks
    |   `-- Hook returns permissionBehavior: undefined (no override)
    |
    |-- Hook integration (line 591): Branch 4 (no hook result)
    |   `-- V = await tJ(Bash, {command: "npm install"}, ...)
    |
    |   +-- tJ calls BYz:
    |   |   Step 1: bYz -> no matching deny rule -> continue
    |   |   Step 2: xYz -> no matching ask rule -> continue
    |   |   Step 3: Bash.checkPermissions() -> analyzes "npm install"
    |   |           -> returns { behavior: "ask", decisionReason: { type: "other", reason: "..." } }
    |   |   Step 4: behavior !== "deny" -> continue
    |   |   Step 5: Bash.requiresUserInteraction() -> false -> continue
    |   |   Step 6: decisionReason.type !== "rule" -> continue
    |   |   Step 7: mode === "normal" (not bypass) -> continue
    |   |   Step 8: IYz -> no matching allow rule -> continue
    |   |   Step 9: behavior === "ask" (not passthrough) -> return as-is
    |   |
    |   +-- tJ receives "ask" from BYz
    |   |   Mode is "normal" (not auto/dontAsk) -> return "ask" as-is
    |
    |-- V.behavior === "ask" -> proceed to dialog
    |
    v
Amq (pushToPermissionQueue) -> adds to toolUseConfirmQueue
    |
    v
ra6 (getInputDialogType) -> returns "tool-permission"
    |
    v
HIq (ToolPermissionDialog) -> renders dialog
    |
    v
User clicks "Allow" -> onAllow callback -> resolves promise
    |
    v
V = { behavior: "allow" } -> tool.call() executes "npm install"
```
