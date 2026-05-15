# Allow / Deny / Ask Precedence (v2.1.142)

**Theme:** When the policy chain has rules at multiple authority levels (hook + static rules + tool callback + mode), there's a specific **precedence order** that determines which decision wins. This document maps:

1. The intra-chain order inside `UA5` (the deterministic core)
2. The hook layering on top
3. The merging order across settings tiers
4. The v2.1.101 fix that ensured deny still overrides PreToolUse hook decisions
5. The "downgrade" semantics — when a hook can/can't relax a static rule

The unifying invariant: **deny is unconditional. Allow is conditional on no deny.**

---

## 1. The Intra-`UA5` Order

`UA5` (the deterministic core, cli_inner_pretty.js:421757) walks its checks in a specific order. The order is **not arbitrary** — each step's position encodes a precedence rule:

```
1. AbortSignal check (throw if cancelled)
2. Deny rule check (TL$) → returns deny
3. Ask rule check (eS6) → returns ask (with sandbox-autoallow exception)
4. Tool's checkPermissions(input, ctx) → returns allow|ask|deny|passthrough
5. Tool callback deny → return deny
6. Tool callback ask + requiresUserInteraction → return ask
7. Tool callback ask + safety-check-non-approvable → return ask
8. MCP effectiveMaxPermission === 'ask' → return ask
9. Mode bypass active:
   9a. Bypass + ask + dangerous-rm safety → return ask (bypass can't override dangerous-rm)
   9b. Bypass + ask + safety check → return ask
   9c. Bypass + ask + sandboxOverride/plan-floor → return ask
   9d. Bypass otherwise → return allow
10. Non-bypass + ask + non-classifier-approvable safety check → return ask
11. Allow rule check (g64) → return allow
12. Passthrough → ask (with built-in message)
```

### Why deny goes first

The deny check is **step 2** — before the tool callback, before mode, before allow rules. This means:

- A `Bash(rm:*)` deny rule fires *before* Bash's own `checkPermissions` runs
- A `Bash(rm:*)` deny rule fires *before* `bypassPermissions` mode would auto-allow
- No allow rule can match if a deny rule matches (allow check is step 11; deny is step 2)

```javascript
// ============================================
// denyRuleEarlyExit - The first thing UA5 does after abort-check
// Location: cli_inner_pretty.js:421760-421766
// ============================================

// ORIGINAL (for source lookup):
let _ = TL$(K.toolPermissionContext, H);
if (_) return { behavior: "deny", decisionReason: { type: "rule", rule: _ }, message: ... };

// READABLE (for understanding):
const denyRule = findMatchingDenyRule(appState.toolPermissionContext, tool);
if (denyRule) return { behavior: "deny", decisionReason: { type: "rule", rule: denyRule }, message: ... };

// Mapping: TL$→findMatchingDenyRule, K→appState, H→tool, _→denyRule
```

The deny rule lookup is checked **immediately after** the abort signal — nothing else has a chance to run if a deny matches.

### Why ask is checked early

The ask check (step 3) happens *before* the tool's own callback. Why? Because:

- An `ask` rule means "always prompt for this even if the tool would auto-allow"
- Without this, a tool's `checkPermissions` returning `allow` (via e.g. acceptEdits-mode fast-path) would skip the user's explicit "always ask me" rule

The exception: when Bash + `autoAllowBashIfSandboxed` + sandboxable command, the ask rule is *bypassed* to let the sandbox fast-path try its analysis. This is the **only** point in `UA5` where ask is downgraded — and only for Bash, only with the sandbox flag, only for shape-supported commands. See [`sandbox_integration.md`](./sandbox_integration.md).

### Why allow is last

Allow rules are step 11 — after everything else has had a chance to deny or ask. The order is intentional:
- Tool callbacks have priority over allow rules (a Bash safety check can deny `rm -rf /` even with `Bash(rm:*)` allow)
- Mode (bypass) has priority — but bypass is a *user-controlled* mode, not a settings rule, so it's higher-trust
- The MCP ceiling and per-tool requirements come before allow

Allow is "if we got here without anything else firing, and a rule says allow, allow." It's the *fallback* path, not the *override* path.

---

## 2. Hooks Layered on Top

Hooks (`PreToolUse`, `PermissionRequest`) fire **before** `tD`/`UA5` (architecturally) and can short-circuit the static chain. But the relationship is more nuanced than "hook always wins":

### Hook output semantics

A hook returns a `permissionDecision`:

| Hook output | Effect |
|---|---|
| `permissionDecision: "allow"` | Short-circuit static chain → allow (subject to v2.1.110 re-check; see below) |
| `permissionDecision: "deny"` | Short-circuit static chain → deny |
| `permissionDecision: "ask"` | Force a prompt (overrides static chain that would auto-allow) |
| `permissionDecision: "defer"` | Skip this hook, proceed to next check |
| (no `permissionDecision`) | Defer |

### The v2.1.101 fix — Deny overrides hook's allow

**Pre-v2.1.101 bug:** A `PreToolUse` hook returning `permissionDecision: "allow"` would short-circuit the static chain — including deny rules. So an attacker who could install a hook (e.g., via a malicious project's `.claude/settings.json`) could override the user's explicit `Bash(rm:*)` deny.

**Fix:** Even when a hook says `allow`, the deny chain runs again. The static deny rule wins. This is conceptually: `static deny > hook decision`.

The mirror fix (v2.1.110) handles the hook-with-`updatedInput` case — re-check deny rules against the **new** input the hook produced. See `oiH` in `architecture.md` step 7.

### Why deny beats hooks

A hook lives in `settings.json` and can come from any tier. A user's `userSettings` could contain a `Bash(rm:*)` deny rule, while a project's `.claude/settings.json` might install a hook that says "allow Bash unconditionally." Without the v2.1.101 fix, the project's hook would override the user's deny.

The principle: **user-installed deny rules in higher tiers must not be over-ridable by hooks**. The fix ensures the policy gradient is downward — broader/higher tiers can deny what lower tiers permit, but lower tiers can't unilaterally allow what higher tiers deny.

---

## 3. Cross-Tier Merging

Settings tiers contribute their `permissions.{allow, deny, ask}` arrays. The merger is **union**:

```javascript
// ============================================
// getAllowRules - Walk all eight permission rule sources and collect allow rules
// Location: 2.1.88 src/utils/permissions/permissions.ts:122 (mNH in bundle)
// ============================================

// ORIGINAL (for source lookup):
const PERMISSION_RULE_SOURCES = [...SETTING_SOURCES, 'cliArg', 'command', 'session']
function getAllowRules(context) {
  return PERMISSION_RULE_SOURCES.flatMap(source =>
    (context.alwaysAllowRules[source] || []).map(ruleString => ({
      source,
      ruleBehavior: 'allow',
      ruleValue: permissionRuleValueFromString(ruleString),
    })),
  )
}

// READABLE (for understanding):
// Same logic — function is already well-named. The 2.1.88 TypeScript form
// is itself the readable version; the bundle mNH is a minified equivalent
// with the same flatMap shape.

// Mapping: mNH (bundle) → getAllowRules (TS), permissionRuleValueFromString shared by both
```

`flatMap` over all sources — **everyone's rules combine**. The order is:

1. `userSettings`
2. `projectSettings`
3. `localSettings`
4. `flagSettings`
5. `policySettings`
6. `cliArg` (CLI flag `--allowed-tools`)
7. `command` (per-command override)
8. `session` (in-session changes via UI)

A `Bash(rm:*)` deny rule in **any** of these tiers fires. No tier can "win" against another for denies — they're all checked.

For **allow** rules, the same union applies. But the v2.1.142 settings:
- `allowManagedPermissionRulesOnly: true` (in policy tier) — drops allow rules from non-policy tiers
- `allowManagedDomainsOnly: true` — drops sandbox allowedDomains from non-policy tiers

These let the admin tier *suppress* lower-tier rules. They don't *override* lower-tier denies, just remove lower-tier allows.

### Permission rule source tier ordering for ASK

For **ask** rules, the same union applies — but the user prompt that fires presents the rule that matched. If multiple ask rules match the same input, the **first** (highest-tier, walked in order) wins for display purposes.

---

## 4. The Default Behavior

When no rule matches and the tool callback returns `passthrough`, the chain's default is:

```
mode = default       → ASK (prompt user)
mode = acceptEdits   → Edit/Write/MultiEdit auto-allow in cwd; others ASK
mode = plan          → BLOCK writes; ASK others
mode = bypassPerms   → ALLOW (except critical/sensitive paths via tool safety check)
mode = auto          → classifier decides (ask path goes through stage 1 + stage 2)
mode = dontAsk       → DENY
```

This is `defaultPermissionMode` taking effect at step 12 of `UA5` plus mode-handling. The mode is the **floor** — `default` mode means "everything prompts unless explicit allow rule."

### `settings.permissions.defaultMode`

The `defaultMode` settings key (in `permissions`) lets users set the **initial** mode. Allowed values: `default`, `acceptEdits`, `plan`, `bypassPermissions`, `auto`.

Restrictions (v2.1.142):
- `defaultMode: "auto"` from `projectSettings`/`localSettings` is **dropped** with a warning. Auto mode can only be granted by `userSettings`, `flagSettings`, or `policySettings`. (Project/local are repo-controllable; an attacker controlling the repo could otherwise auto-grant auto mode.)

```javascript
// ============================================
// autoFromUntrustedSourceCheck - Reject defaultMode=auto from project/local tiers
// Location: cli_inner_pretty.js:199020
// ============================================

// ORIGINAL (for source lookup):
if (X === "auto")
  if (!["policySettings", "userSettings", "flagSettings"].some((P) => v8(P)?.permissions?.defaultMode === "auto"))
    (N(
      'settings defaultMode "auto" ignored — only policy/user/flag settings may grant auto mode (projectSettings and localSettings are repo-controllable)',
      { level: "warn" },
    ),
      d("tengu_settings_auto_mode_untrusted_source_ignored", {}));

// READABLE (for understanding):
if (resolvedMode === "auto") {
  const trustedSources = ["policySettings", "userSettings", "flagSettings"];
  const hasAutoInTrustedSource = trustedSources.some(
    (source) => getSettingsForTierCached(source)?.permissions?.defaultMode === "auto"
  );
  if (!hasAutoInTrustedSource) {
    logWarn('settings defaultMode "auto" ignored — only policy/user/flag settings may grant auto mode (projectSettings and localSettings are repo-controllable)');
    logAnalyticsEvent("tengu_settings_auto_mode_untrusted_source_ignored", {});
  }
}

// Mapping: X→resolvedMode, P→source, v8→getSettingsForTierCached, N→logWarn, d→logAnalyticsEvent
```

---

## 5. Hook "Downgrade" Semantics

Can a hook **downgrade** a deny to a prompt? Pre-v2.1.101, yes — a hook returning `allow` would override. Post-v2.1.101, **no** for hooks; the static deny check re-runs.

But there's a nuance: a hook can return `permissionDecision: "ask"`, which converts a static `allow` into an `ask`. This is a **tightening**, not a loosening — the hook is *adding* a prompt the user wouldn't otherwise see.

```
Pre-fix (v2.1.100): hook allow OVERRIDES static deny  ← bug
Post-fix (v2.1.101): static deny OVERRIDES hook allow  ← correct
                     hook ask OVERRIDES static allow   ← correct (hook tightens)
                     hook deny OVERRIDES static allow  ← correct
```

The asymmetry is **correct**: tightening is always allowed (more prompts = more safe), loosening is gated by the static deny check.

---

## 6. `effectiveMaxPermission` (MCP Ceiling)

MCP tools have a per-server `effectiveMaxPermission` setting:

```
effectiveMaxPermission: "allow" | "ask" | "deny"
```

When set to `"ask"`, all calls to that server's tools force an ask, regardless of allow rules. This is step 8 in `UA5`:

```javascript
// ============================================
// mcpAskCeilingCheck - MCP per-server effectiveMaxPermission ceiling
// Location: cli_inner_pretty.js:421783
// ============================================

// ORIGINAL (for source lookup):
if (H.mcpInfo?.effectiveMaxPermission === "ask") {
  let w = { type: "other", reason: F64 };  // "Your organization requires approval for this tool"
  return { behavior: "ask", message: N5(H.name, w), decisionReason: w };
}

// READABLE (for understanding):
if (tool.mcpInfo?.effectiveMaxPermission === "ask") {
  const decisionReason = { type: "other", reason: ORG_REQUIRES_APPROVAL_MESSAGE };
  return { behavior: "ask", message: buildPermissionAskMessage(tool.name, decisionReason), decisionReason };
}

// Mapping: H→tool, F64→ORG_REQUIRES_APPROVAL_MESSAGE, N5→buildPermissionAskMessage, w→decisionReason
```

This is an **MCP-specific ceiling** — it sits between the tool callback and mode-based allow. So:
- A deny rule still beats it
- An allow rule does NOT beat it
- Bypass mode does NOT beat it (for ask-ceiling tools)

The ceiling is settable in MCP server config. Useful for connecting "third-party but trusted" MCP servers where each call should be sanity-checked.

---

## 7. Worked Examples

### Example A — Hook says allow but deny rule matches

```
Hook output:    permissionDecision: "allow"
Static deny:    Bash(rm:*) in userSettings
Tool call:      Bash("rm -rf /tmp/cache")

Result: DENY
Why: v2.1.101 fix — static deny re-checked even after hook says allow.
```

### Example B — Hook with updatedInput tries to escape deny

```
Hook output:    permissionDecision: "allow", updatedInput: { command: "rm -rf /etc" }
Static deny:    Path-based safety check + Bash(rm:*) deny
Tool call (original): Bash("rm -rf /tmp/cache")

Result: DENY
Why: v2.1.110 fix — oiH re-runs deny chain on updatedInput, dangerous-rm safety fires.
```

### Example C — Bypass mode + dangerous rm

```
Mode:           bypassPermissions
Static deny:    (none)
Bash callback:  Returns ask with safety-check "Dangerous rm operation" for rm -rf /
Tool call:      Bash("rm -rf /")

Result: ASK
Why: UA5 step 9a — bypass can't override dangerous-rm. The ask propagates.
```

Code path:

```javascript
// ============================================
// bypassDangerousRmExemption - Bypass mode can't override dangerous-rm safety check
// Location: cli_inner_pretty.js:421791-421802
// ============================================

// ORIGINAL (for source lookup):
Y = K.toolPermissionContext.mode === "bypassPermissions" || /* plan with bypass available */,
f = Y && z?.behavior === "ask"
    ? RQ(z.decisionReason, (w) => w.reason.startsWith("Dangerous rm operation") || w.reason.startsWith("Dangerous rmdir operation"))
    : void 0;
if (z?.behavior === "ask" && (f || (!Y && (...))))
    return z;

// READABLE (for understanding):
const isBypassActive = appState.toolPermissionContext.mode === "bypassPermissions" || /* plan with bypass available */;
const dangerousRmInBypass = isBypassActive && cbResult?.behavior === "ask"
  ? findSafetyCheckInDecisionReason(cbResult.decisionReason,
      (sc) => sc.reason.startsWith("Dangerous rm operation") || sc.reason.startsWith("Dangerous rmdir operation"))
  : undefined;
if (cbResult?.behavior === "ask" && (dangerousRmInBypass || (!isBypassActive && /* other ask conditions */)))
  return cbResult;

// Mapping: Y→isBypassActive, K→appState, z→cbResult, f→dangerousRmInBypass, RQ→findSafetyCheckInDecisionReason, w→sc
```

The `f` is "dangerous-rm safety in bypass mode" — when truthy, the bypass doesn't auto-allow.

### Example D — `effectiveMaxPermission: "ask"` MCP + allow rule

```
Tool:           mcp__github__create_issue
Allow rule:     mcp__github__* in userSettings
MCP server:     effectiveMaxPermission: "ask"

Result: ASK
Why: UA5 step 8 — MCP ask ceiling beats step 11 allow rule check.
```

### Example E — Plan mode + Edit allow rule

```
Mode:           plan
Static allow:   Edit(./src/**)
Tool call:      Edit({ path: "./src/foo.ts", ... })

Pre-v2.1.136: ALLOW (allow rule matched)
Post-v2.1.136: ASK (plan mode floor — Edit callback returns ask with mode:plan reason)
```

Plan mode is a floor for writes — even with allow rule, the write must be confirmed via `ExitPlanMode`.

### Example F — Cross-tier deny

```
User settings:  permissions.allow: ["Bash(npm publish *)"]
Policy:         permissions.deny: ["Bash(npm publish *)"]
Tool call:      Bash("npm publish")

Result: DENY
Why: Union merger; deny rule from policy tier fires; allow rule from user tier never wins.
```

### Example G — Hook downgrades allow to ask

```
Hook output:    permissionDecision: "ask"
Static allow:   Edit(./**)
Tool call:      Edit({ path: "./src/sensitive.ts" })

Result: ASK
Why: Hook tightening is always allowed; the prompt fires.
```

---

## 8. The Final Verdict Tree

To compute the final verdict for any tool call:

```
1. Did a deny rule match (any tier)?           → DENY
2. Did a hook say deny?                         → DENY
3. Did the tool callback say deny?              → DENY
4. Did the tool callback say ask (interactive)? → ASK (preserved through to UI)
5. Did the tool callback say ask (safetyCheck non-classifier-approvable)? → ASK
6. Does the MCP server have ask ceiling?        → ASK
7. Is mode bypassPermissions?
   a. Did the callback ask with dangerous-rm/critical-path? → ASK
   b. Otherwise                                  → ALLOW
8. Did a hook say allow?                         → ALLOW (subject to v2.1.110 updatedInput re-check)
9. Did an allow rule match (any tier)?           → ALLOW
10. Did an ask rule match (any tier)?            → ASK
11. Mode-specific default
    a. mode=default                              → ASK
    b. mode=acceptEdits (Edit/Write in cwd)      → ALLOW
    c. mode=auto                                 → classifier (then converts ask to allow/deny)
    d. mode=dontAsk                              → DENY
    e. mode=plan (write tool)                    → ASK (floor)
```

This tree is the canonical precedence. Read top-to-bottom; first match wins.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission_arch.md`](../00_overview/symbol_additions_v2_1_142_permission_arch.md) — Symbols introduced/used in this document

Key functions and constants in this document:
- `checkRulesAndCallback` (`UA5`) — Deterministic core (cli_inner_pretty.js:421757)
- `findMatchingDenyRule` (`TL$`) — Step 2 of UA5 (cli_inner_pretty.js:421590)
- `findMatchingAskRule` (`eS6`) — Step 3 of UA5 (cli_inner_pretty.js:421593)
- `findMatchingAllowRule` (`g64`) — Step 11 of UA5 (cli_inner_pretty.js:421584)
- `recheckRulesAfterHookRewrite` (`oiH`) — v2.1.110 re-check (cli_inner_pretty.js:421627)
- `getAllowRules` / `getDenyRules` / `getAskRules` (2.1.88 TS reference) — flatMap over tier sources
- `applyHookPermissionDecision` — Maps hook output to permissionBehavior (cli_inner_pretty.js:520649)
- `RQ` — Walk decisionReason looking for safetyCheck (cli_inner_pretty.js:421865)
- `dw8` — Check if decisionReason is non-classifier-approvable (cli_inner_pretty.js:421716)
- `d64` — Check if decisionReason is plan-mode-floor write (cli_inner_pretty.js:421723)
- `F64` — String literal "Your organization requires approval for this tool" (effectiveMaxPermission=ask)
- `i64` — Don't-Ask deny message builder (cli_inner_pretty.js:421519)
- `N5` — Build "Claude requested permissions to use X" message
- `U64` — Merge updatedInput from tool callback into raw input (cli_inner_pretty.js:421862)
- `Q64` — Test if rule's source is *not* `cliArg`/`toolsNarrowing` (for proxy expansion)
- `effectiveMaxPermission` — MCP server config key (`"allow" | "ask" | "deny"`)
- `defaultPermissionMode` — Settings key controlling initial mode
