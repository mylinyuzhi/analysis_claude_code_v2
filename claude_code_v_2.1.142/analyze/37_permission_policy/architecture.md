# Permission Policy Architecture (v2.1.142)

**Theme:** This document is the **top-down map** of where permission checks fire in v2.1.142 — from the moment the model emits a tool-use block, through input validation, hook chains, the policy authority chain (`UA5`), the auto-mode classifier wrapper (`tD`), down to the tool's own `checkPermissions` callback and the final allow/ask/deny verdict.

Everything else in this module — `rule_grammar.md`, `mode_lifecycle.md`, `auto_mode_classifier.md`, `allow_deny_ask_precedence.md`, `settings_tier_hierarchy.md`, `sandbox_integration.md` — drills into one branch of the tree shown here. Read this first if you want to know *where* a check fires; read the others for *what* it does.

---

## 1. The End-to-End Flow in One Diagram

```
   Model returns tool_use ──► Tool dispatch (Query loop)
                                      │
                                      ▼
                          1. tool.validateInput(input)        ◄─── per-tool schema/shape check
                                      │ (throws → ToolError, no permission check fires)
                                      ▼
                          2. hasPermissionsToUseTool (tD)     ◄─── auto-mode wrapper
                                      │
                                      ▼
                          3. UA5(tool, input, ctx)            ◄─── policy authority chain
                                      │
                  ┌───────────────────┼───────────────────┐
                  ▼                   ▼                   ▼
              deny rule          ask rule            tool.checkPermissions
              fires first        (early ask)         (per-tool semantics)
                  │                   │                   │
                  └──────────┬────────┘                   │
                             │                            │
                             └───────────┬────────────────┘
                                         ▼
                                4. mode evaluation
                                  - bypassPermissions → allow (+ safety check)
                                  - allow rule match → allow
                                  - passthrough → ask
                                         │
                                         ▼
                                5. tD continues:
                                  - dontAsk → deny
                                  - auto mode → classifier (jJ$)
                                    or fast-path: acceptEdits-eq, allowlist
                                  - else → return raw verdict
                                         │
                                         ▼
                          6. UI permission prompt OR auto-deny
                                         │
                                  ┌──────┴──────┐
                                  │             │
                                  ▼             ▼
                              user allow    user deny
                                  │             │
                                  ▼             ▼
                          7. (optional) PreToolUse hook
                                         │
                                         ▼
                                tool.handleToolUse() runs
                                         │
                                         ▼
                          8. PostToolUse / PostToolUseFailure hook
                                         │
                                         ▼
                                final tool_result returned
```

The numbered steps map 1:1 to entry-points listed in section 4.

---

## 2. Where Are the Three Authority Layers?

Three independent layers each contribute to the decision (see [`allow_deny_ask_precedence.md`](./allow_deny_ask_precedence.md) for ordering):

| Layer | Where it fires | What it returns |
|---|---|---|
| **Hook layer** | `PreToolUse` event in `b9H` / `BA5` (line 421635) | `permissionDecision: allow|deny|ask|defer` |
| **Static rule layer** | `UA5` (line 421757) — checks `permissions.{allow,deny,ask}` arrays | `behavior: allow|ask|deny + decisionReason: {type: rule, rule}` |
| **Tool callback layer** | `tool.checkPermissions(parsedInput, ctx)` invoked from `UA5` line 421775 | `behavior: allow|ask|deny|passthrough + decisionReason` |

Plus the **auto-mode classifier** (`jJ$` in `tD`) which runs *after* the three layers above when the result is `ask` and mode is `auto` — it's not a fourth authority, it's a *fallback* that converts `ask` into `allow` or `deny` using an LLM.

---

## 3. Entry-Point Map

The flow has eight architectural touch-points. Each is implemented by a specific function in v2.1.142.

```
// ============================================
// Permission flow entry points - v2.1.142
// Locations: cli_inner_pretty.js (various)
// ============================================

  Step │ Symbol          │ Location                              │ Returns
  ─────┼─────────────────┼───────────────────────────────────────┼─────────────────────
   1   │ validateInput   │ tool-specific (e.g. 339066, 353543)   │ {result, message}
   2   │ tD              │ 421879-422144 (export at 421493)      │ PermissionDecision
   3   │ UA5             │ 421757-421814                         │ PermissionDecision
   4a  │ TL$ (deny rule) │ 421590-421592                         │ rule|null
   4b  │ eS6 (ask rule)  │ 421593-421595                         │ rule|null
   4c  │ tool.checkPerms │ defined per-tool (Sq, gN, R$, ...)    │ {behavior, ...}
   5   │ jJ$             │ 338324 (classifyYoloAction)           │ {shouldBlock, reason}
   6   │ UI prompt       │ permissionRequestRenderer             │ user-allow|user-deny
   7   │ PreToolUse hook │ b9H / BA5 / applyHookPermissionDecn   │ permissionDecision
   8   │ PostToolUse     │ post-call applyHookPermissionDecision │ updatedToolOutput
```

Notes:
- `tD` is the externally-exported `hasPermissionsToUseTool` (line 421493: `hasPermissionsToUseTool: () => tD`).
- The hook in step 2/3 fires *inside* the agent loop (not inside `tD`) — `tD` is policy-only.
- The PreToolUse hook fires both **before the prompt** (when the user-facing prompt would appear) and **after the prompt** (when the user clicks allow) depending on where in the agent loop the hook is registered. v2.1.110's fix ensures that hook `updatedInput` re-runs the deny-rule check (step 4a).

---

## 4. Step-by-Step Walk

### Step 1 — `validateInput` (per-tool)

Each tool implements `async validateInput(input, ctx) → { result: boolean, message?: string }`. Examples:

```
// Read tool: chunks (~339066)
async validateInput({ path: H }) { ... validates path exists, is readable, ... }

// Edit tool: chunks (~339386)
async validateInput({ path: H }) { ... checks file exists, isn't /dev/null, ... }

// Skill tool: chunks (~353543)
async validateInput({ skill: H }, $) { ... resolves skill name, checks not blocked ... }
```

**Key insight:** `validateInput` is *not* a permission check. It's a **schema/shape** check that runs *before* permissions to short-circuit obviously-broken calls. A failure here returns a `tool_result` with an error — the user is *not* asked. Permission checks only fire if `validateInput` returns `{result: true}`.

### Step 2 — `tD` (auto-mode wrapper)

```javascript
// ============================================
// hasPermissionsToUseTool - Auto-mode wrapper around UA5
// Location: cli_inner_pretty.js:421879-422144 (export: 421493)
// ============================================

// ORIGINAL (for source lookup):
tD = async (H, $, q, K, _) => {
  let A = await UA5(H, $, q);
  if (A.behavior === "allow") {
    /* reset consecutive denials, return allow */
    return A;
  }
  if (A.behavior === "ask") {
    /* check mode: dontAsk → deny, auto → classifier, else → return ask */
  }
};

// READABLE (for understanding):
const hasPermissionsToUseTool = async (tool, input, ctx, assistantMessage, toolUseID) => {
  const result = await checkRulesAndCallback(tool, input, ctx);

  // 'allow' returns immediately
  if (result.behavior === "allow") {
    resetConsecutiveDenialsIfAutoMode(ctx);
    return result;
  }

  if (result.behavior === "ask") {
    const appState = ctx.getAppState();

    // dontAsk mode: convert 'ask' to 'deny'
    if (appState.toolPermissionContext.mode === "dontAsk") {
      return denyDueToDontAskMode(tool.name);
    }

    // Auto mode (or plan-with-auto-active): try fast-paths, then classifier
    if (isAutoMode(appState)) {
      if (safetyCheckRequiresInteractive(result)) return result;
      if (acceptEditsFastPathAllows(tool, input, ctx)) return allowDueToAutoMode();
      if (uA5.isAutoModeAllowlistedTool(tool.name)) return allowDueToAutoMode();
      return await runClassifier(tool, input, ctx, result);
    }

    return result;  // bubble up to UI prompt
  }

  return result;  // deny: bubble up to tool-result error
};

// Mapping: tD→hasPermissionsToUseTool, UA5→checkRulesAndCallback, jJ$→runClassifier,
//          A→result, H→tool, $→input, q→ctx, K→assistantMessage, _→toolUseID
```

**Why split `tD` from `UA5`?** Because the auto-mode classifier is **expensive** (a full side-query to an LLM) and only fires when the static layer returned `ask`. Splitting lets `UA5` be pure-deterministic policy and `tD` add LLM-based fallback. The split also lets non-interactive callers (background agents, headless `-p` mode) reuse `UA5` directly without the classifier overhead — see step 7 (hooks).

### Step 3 — `UA5` (policy authority chain)

`UA5` (line 421757-421814) is the deterministic core. It walks the policy chain in this order:

```javascript
// ============================================
// checkRulesAndCallback - Deterministic policy chain (deny → ask → tool → mode → allow)
// Location: cli_inner_pretty.js:421757-421814
// ============================================

// ORIGINAL (for source lookup):
async function UA5(H, $, q) {
  if (q.abortController.signal.aborted) throw new ZA();
  let K = q.getAppState(),
    _ = TL$(K.toolPermissionContext, H);
  if (_) return { behavior: "deny", decisionReason: { type: "rule", rule: _ }, ... };
  let A = eS6(K.toolPermissionContext, H);
  if (A) {
    /* sandbox-fast-path exception for Bash with autoAllowBashIfSandboxed */
    return { behavior: "ask", decisionReason: { type: "rule", rule: A }, ... };
  }
  let z = { behavior: "passthrough", ... };
  try {
    let w = H.inputSchema.parse($);
    z = await H.checkPermissions(w, q);
  } catch (w) { /* ... */ }
  if (z?.behavior === "deny") return z;
  /* ... mode-based allow paths ... */
  let O = g64(K.toolPermissionContext, H);  // allow rule check
  if (O) return { behavior: "allow", ... };
  let M = z.behavior === "passthrough" ? { ...z, behavior: "ask" } : z;
  return M;
}

// READABLE (for understanding):
async function checkRulesAndCallback(tool, input, ctx) {
  if (ctx.abortController.signal.aborted) throw new AbortError();
  const appState = ctx.getAppState();

  // 1. DENY rule check first - always wins
  const denyRule = findMatchingDenyRule(appState.toolPermissionContext, tool);
  if (denyRule) {
    return { behavior: "deny", decisionReason: { type: "rule", rule: denyRule },
             message: `Permission to use ${tool.name} has been denied.` };
  }

  // 2. ASK rule check - upgrades passthrough to ask
  const askRule = findMatchingAskRule(appState.toolPermissionContext, tool);
  if (askRule) {
    // Exception: if Bash + autoAllowBashIfSandboxed + sandboxable → fall through to tool's check
    if (!(tool.name === BASH_TOOL_NAME && isSandboxingEnabled() && isAutoAllowBashIfSandboxedEnabled() && shouldSandbox(input))) {
      return { behavior: "ask", decisionReason: { type: "rule", rule: askRule }, ... };
    }
  }

  // 3. Tool's own checkPermissions callback
  let cbResult = { behavior: "passthrough" };
  try {
    const parsedInput = tool.inputSchema.parse(input);
    cbResult = await tool.checkPermissions(parsedInput, ctx);
  } catch (e) {
    if (e instanceof AbortError || e instanceof APIUserAbortError) throw e;
    logError(e);
  }

  // 4. Tool callback deny is final
  if (cbResult?.behavior === "deny") return cbResult;
  if (tool.requiresUserInteraction?.() && cbResult?.behavior === "ask") return cbResult;
  if (cbResult?.behavior === "ask" && isSafetyCheckNonApprovable(cbResult.decisionReason)) return cbResult;

  // 5. MCP "effectiveMaxPermission === 'ask'" ceiling
  if (tool.mcpInfo?.effectiveMaxPermission === "ask") return askDueToMcpCeiling(tool.name);

  // 6. Mode-based fast-paths
  const isBypass = isBypassActive(appState);
  const dangerousRmInBypass = isBypass && cbResult?.behavior === "ask" && isDangerousRmReason(cbResult);

  if (cbResult?.behavior === "ask" && (dangerousRmInBypass || (!isBypass && isSafetyCheck(cbResult)))) {
    return cbResult;  // bypass can't override dangerous-rm; non-bypass passes safety through
  }

  if (isBypass) {
    return { behavior: "allow", updatedInput: mergeUpdatedInput(cbResult, input),
             decisionReason: { type: "mode", mode: appState.toolPermissionContext.mode } };
  }

  // 7. ALLOW rule check
  const allowRule = findMatchingAllowRule(appState.toolPermissionContext, tool);
  if (allowRule) {
    return { behavior: "allow", updatedInput: mergeUpdatedInput(cbResult, input),
             decisionReason: { type: "rule", rule: allowRule } };
  }

  // 8. Passthrough → ask (default fall-through)
  return cbResult.behavior === "passthrough"
    ? { ...cbResult, behavior: "ask", message: buildAskMessage(tool.name, cbResult.decisionReason) }
    : cbResult;
}

// Mapping: UA5→checkRulesAndCallback, TL$→findMatchingDenyRule, eS6→findMatchingAskRule,
//          g64→findMatchingAllowRule, H→tool, $→input, q→ctx
```

**Key insight — Why deny goes first, allow last:** The chain order is `deny → ask → tool → mode-bypass → allow → passthrough-to-ask`. This means:

1. **Deny rules can't be overridden by anything** (`Bash(rm:*)` deny still fires even if `Bash(*)` allow exists).
2. **Ask rules are checked early** (before the tool's callback) so the user sees a prompt even if the tool would have auto-allowed.
3. **Tool callbacks can deny** even if no deny rule matches — `Bash` denies for `rm -rf /` via safety-check.
4. **Bypass mode** activates after deny/ask but before allow rules — bypass is "treat everything that isn't a deny as allow."
5. **Allow rules** are last in the deterministic chain — they only fire if no deny/ask/safety-check has fired.

### Step 4 — Tool's `checkPermissions`

Each tool implements `async checkPermissions(parsedInput, ctx) → PermissionDecision`. Most tools return `{behavior: "passthrough"}` (defer to global rules). Bash, Edit, Write, NotebookEdit, Skill, Agent, and a few others return semantic verdicts:

- **Bash** (line 207613): walks the parsed AST, runs the classifier (`yoloClassifier` family), returns `allow|ask|deny`. The Bash `checkPermissions` is the largest in the bundle — see `bash_classifier_hardening.md` for details.
- **Edit/Write** (line 339085, 360020): checks `Edit(path)` allow rules via `yL` and dangerous-path safety check (`bY$`). Returns `allow|ask|deny`.
- **Skill** (line 353604): walks `Skill(name)` and `Skill(name *)` allow/deny rules. See [`rule_grammar.md`](./rule_grammar.md) for the wildcard semantics.

### Step 5 — `jJ$` (auto-mode classifier)

Only called from `tD` when mode is `auto` (or plan-with-auto-active) and the deterministic chain returned `ask`. The classifier is a side-query to a separate LLM (`autoModeClassifierModel` — Sonnet 4.5 or whatever's configured) that reads:

- The current `tool_use` action
- The recent transcript (model's reasoning, tool calls, results)
- The classifier system prompt (`CF_` + `bF_`) with rule sections (`allow`, `soft_deny`, `hard_deny`, `environment`)

Returns `{shouldBlock: boolean, reason: string}`. See [`auto_mode_classifier.md`](./auto_mode_classifier.md).

### Step 6 — UI prompt

If the verdict is `ask`, the agent loop renders the permission prompt UI (the "Always allow X?" prompt). The user's button choice is mapped to a `PermissionResult` and threaded back as the final answer. The prompt also supports persisting an allow rule to `localSettings` (v2.1.128 made this the suggested destination for SDK callers).

### Step 7 — `PreToolUse` hook

If a `PreToolUse` hook is registered for this tool name, it fires before the tool actually runs. The hook can:

- Return `hookSpecificOutput.permissionDecision: "allow"` — short-circuit the static chain
- Return `permissionDecision: "deny"` — short-circuit, block
- Return `permissionDecision: "ask"` — force a prompt (used by SDK to add safety layers)
- Return `permissionDecision: "defer"` — proceed to the next check
- Return `hookSpecificOutput.updatedInput` — rewrite the tool's input

**v2.1.110 fix:** When a hook returns both `permissionDecision: "allow"` AND `updatedInput`, the **deny rules are re-checked against the new input**. `oiH` (line 421627) wraps this check — if the hook rewrites `rm -rf safe.txt` into `rm -rf /etc`, the deny rule for `/etc` paths fires even though the hook said "allow."

```javascript
// ============================================
// recheckRulesAfterHookRewrite - Re-validate deny/ask rules after hook mutates input
// Location: cli_inner_pretty.js:421627-421634
// ============================================

// ORIGINAL (for source lookup):
function oiH(H, $) {
  if (H?.behavior === "deny" || H?.behavior === "ask")
    return (
      N(`PermissionRequest hook allowed ${$} with updatedInput, but ${H.behavior} rule overrides: ${H.message}`),
      H
    );
  return null;
}

// READABLE (for understanding):
function recheckRulesAfterHookRewrite(secondPassResult, toolName) {
  // After a hook says allow + provides updatedInput, we re-run the rule chain
  // against the NEW input. If a deny or ask rule matches the new input, the
  // hook's "allow" is overridden by policy.
  if (secondPassResult?.behavior === "deny" || secondPassResult?.behavior === "ask") {
    logDebug(`PermissionRequest hook allowed ${toolName} with updatedInput, but ${secondPassResult.behavior} rule overrides`);
    return secondPassResult;
  }
  return null;
}

// Mapping: oiH→recheckRulesAfterHookRewrite, H→secondPassResult, $→toolName
```

### Step 8 — `PostToolUse` / `PostToolUseFailure` hook

After the tool runs, `PostToolUse` (success) or `PostToolUseFailure` (error) hooks fire. They can rewrite the tool's output (`hookSpecificOutput.updatedToolOutput`) but cannot change the permission decision retroactively.

---

## 5. The Bridge Layer

When Claude Code is invoked via the SDK or Remote Control (claude.ai mobile), the **bridge layer** sits between the model's tool-use and `tD`. The bridge:

1. Forwards the tool-use to the host SDK process
2. The host's `canUseTool` callback (e.g. `Options.canUseTool` in the SDK) runs
3. If the host says `behavior: "allow"`, the CLI continues to its own policy chain (`UA5`)
4. If the host says `behavior: "deny"`, the CLI auto-denies

This means the SDK's `canUseTool` is **layered on top of**, not instead of, the static policy chain. Even a permissive SDK can't bypass a local `Bash(rm:*)` deny rule.

The bridge also handles **`onPermissionRequest`** (line 10958, 11421) for Remote Control sessions — when the user is interacting via claude.ai/code, the permission prompt is rendered remotely and the answer is messaged back to the CLI. The CLI still runs `tD`; the prompt step (step 6) is what gets remoted.

---

## 6. Failure Modes & Fail-Safe Design

Where does the chain fail closed vs. fail open?

| Failure | Behavior | Why |
|---|---|---|
| `tool.checkPermissions` throws | logError, treat as `passthrough` → `ask` | Tool bug shouldn't auto-allow |
| Hook `PermissionRequest` errors | Fall through to next check | Hook misconfig shouldn't deny entirely |
| Classifier unavailable + `iron_gate_closed` | deny | Default secure: classifier outage doesn't auto-allow |
| Classifier unavailable + iron-gate-open | fall back to manual prompt | Some users prefer "show me when unavailable" |
| Classifier transcript too long | fall back to manual prompt (or deny in headless) | Deterministic failure won't recover on retry |
| Hook returns invalid `permissionDecision` | throw `Unknown permissionDecision type` | Misconfig is loud |
| `validateInput` throws | tool returns error, no permission check | Schema failure shouldn't trigger prompts |
| Abort signal | throws `AbortError` immediately | User-initiated cancel takes priority |

The pattern is consistent: **deterministic failures fail closed** (deny or prompt), **transient failures fall through** (try next check), **user-initiated cancels abort cleanly**.

---

## 7. Why This Architecture?

Three design rationales recur:

### 7.1 Deny-first, allow-last

The chain order is fundamental: deny rules can't be downgraded by allow rules or hook mutations. v2.1.110's `oiH` fix is a *correction* — without it, a hook could mutate input around a deny rule. The fix preserves the invariant: **policy beats hooks, hooks beat tool callbacks, tool callbacks beat passthrough**.

### 7.2 Mode is user-controlled, rules are policy-controlled

The mode (`default | acceptEdits | plan | bypassPermissions | auto | dontAsk`) is mutated only by:
- User shift-tab cycle (`getNextPermissionMode`)
- `setMode` permission update (from hooks)
- Plan-mode entry/exit
- CLI flag at startup

The rules (`allow | ask | deny` arrays) are loaded once from settings tiers and never mutated mid-session (except via hook-issued `permissionUpdates`). This separation lets the user's "I want to be in auto mode" intent persist independent of which rules match.

### 7.3 The classifier is a fallback, not an authority

The classifier (`jJ$`) is *only* invoked when the deterministic chain returned `ask`. It can never override an explicit `deny` or `allow`. This means the classifier's reasoning errors (or LLM hallucinations) can only cause prompts to be over-blocked or over-allowed *within the ask space* — never bypass explicit policy.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission_arch.md`](../00_overview/symbol_additions_v2_1_142_permission_arch.md) — Symbols introduced/used in this document
> - [`symbol_additions_v2_1_142_sandbox.md`](../00_overview/symbol_additions_v2_1_142_sandbox.md) — Sandbox-tier symbols cross-referenced
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — v2.1.112 baseline (when present)

Key functions in this document:
- `hasPermissionsToUseTool` (`tD`) — Auto-mode wrapper, the public entry-point exposed at `cli_inner_pretty.js:421493`
- `checkRulesAndCallback` (`UA5`) — Deterministic policy chain (cli_inner_pretty.js:421757)
- `findMatchingDenyRule` (`TL$`) — Walk deny rules (cli_inner_pretty.js:421590)
- `findMatchingAskRule` (`eS6`) — Walk ask rules (cli_inner_pretty.js:421593)
- `findMatchingAllowRule` (`g64`) — Walk allow rules (cli_inner_pretty.js:421584)
- `recheckRulesAfterHookRewrite` (`oiH`) — v2.1.110 deny re-check after hook updatedInput (cli_inner_pretty.js:421627)
- `runPermissionRequestHookForHeadlessAgent` (`BA5`) — Headless-mode hook driver (cli_inner_pretty.js:421635)
- `classifyYoloAction` (`jJ$`) — Auto-mode classifier (cli_inner_pretty.js:338324)
- `resolvePermissionModeFromSources` (`rgK`) — Mode resolution from CLI/env/settings (cli_inner_pretty.js:198981)
- `applyHookPermissionDecision` (around line 520649) — Maps hook output to `permissionBehavior`
