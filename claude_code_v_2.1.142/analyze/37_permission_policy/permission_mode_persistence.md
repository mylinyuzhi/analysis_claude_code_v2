# Permission Mode Persistence — Resume, Background Agents, Open-Prompt Dismissal

**Theme:** Three v2.1.132–v2.1.141 fixes that all tighten the same invariant: **mode is user-controlled, never silently mutated**.

| Version | Fix | Surface |
|---|---|---|
| v2.1.132 | `--permission-mode plan` honored on `-p --continue/--resume` | CLI flag → context |
| v2.1.136 | Plan mode blocks file writes even when `Edit(...)` allow rule matches | Rule precedence |
| v2.1.141 | Background agents preserve current permission mode (no revert to default) | Context propagation |
| v2.1.141 | Switching permission mode auto-dismisses open tool-permission prompt | Prompt UI |

Each is a small fix; together they make "what mode am I in?" a precisely answerable question for the whole window of an agent's lifetime.

---

## 1. The Mode-Mutation Rule Restated

From the v2.1.97-98 fix (see [`dangerously_skip_fix.md`](../../../claude_code_v_2.1.112/analyze/37_permission_policy/dangerously_skip_fix.md)):

> Modes are only mutated by:
> - User shift-tab in the carousel
> - `setMode` in a hook output
> - Plan mode entry/exit

v2.1.141 adds one more: **the permission-update callback respects a `preserveMode` flag** when applying rule changes from hooks. v2.1.132 closes a parallel gap on the *startup* side — restoring a session's mode from CLI flag is *not* a "silent mutation," but the loader was failing to read the flag on `-p --continue`, so the mode reverted to default. v2.1.141's open-prompt fix re-evaluates pending prompts when the mode changes, which is the natural inverse of "mode change shouldn't silently allow."

---

## 2. v2.1.132 — `--permission-mode plan` on `-p --continue/--resume`

### The bug

Pre-fix, this worked:
```bash
claude --permission-mode plan -p "review this code"  # OK, runs in plan
```

But this didn't:
```bash
claude -p "review this code" --continue --permission-mode plan  # Reverts to default!
```

The CLI flag was parsed but **not threaded through** to the session-restore path that `--continue` uses. The user's intent (plan mode) was silently dropped.

### The fix path

`zR6` (chunks `_top_*`, line 422449-422468) is the consolidator that reads `permissionModeCli` from the CLI args, the `agentPermissionMode` from agent frontmatter, and the settings tier — and returns the effective mode for context construction:

```javascript
// ============================================
// resolvePermissionMode - Resolve effective mode from CLI/env/settings/agent
// Location: cli_inner_pretty.js:422449-422468
// ============================================

// ORIGINAL (for source lookup):
function zR6({ permissionModeCli: H, dangerouslySkipPermissions: $, agentPermissionMode: q }) {
  if (aW()) {
    let _ = $ || (H && H !== "default") || (q && q !== "default"),
      A = "Permission mode forced to default — CLAUDE_CODE_SUBPROCESS_ENV_SCRUB is set ...";
    if (_) process.stderr.write(`⚠ ${A}\n`);
    return { mode: "default", notification: _ ? A : void 0 };
  }
  let K = rgK({
    cli: { permissionMode: H, dangerouslySkipPermissions: $ },
    env: { ...process.env, CLAUDE_CODE_SUBPROCESS_ENV_SCRUB: void 0 },
    settings: Oq() || {},
    agentFrontmatter: q ? { permissionMode: q } : void 0,
  });
  if (K.mode === "auto") ON?.setAutoModeActive(!0);
  return { mode: K.mode, notification: K.notification };
}

// READABLE (for understanding):
function resolvePermissionMode({
  permissionModeCli,        // --permission-mode value
  dangerouslySkipPermissions, // --dangerously-skip-permissions boolean
  agentPermissionMode,      // permissionMode from agent frontmatter
}) {
  // Subprocess env scrub forces default (hardening)
  if (isSubprocessEnvScrubbed()) {
    const anyRequested =
      dangerouslySkipPermissions ||
      (permissionModeCli && permissionModeCli !== "default") ||
      (agentPermissionMode && agentPermissionMode !== "default");
    const warning = "Permission mode forced to default — CLAUDE_CODE_SUBPROCESS_ENV_SCRUB is set ...";
    if (anyRequested) process.stderr.write(`⚠ ${warning}\n`);
    return { mode: "default", notification: anyRequested ? warning : undefined };
  }

  // Delegate to resolver that walks all sources:
  // CLI > env > policy > flag > user > local (with auto-mode gating)
  const result = resolveModeFromSources({
    cli: { permissionMode: permissionModeCli, dangerouslySkipPermissions },
    env: { ...process.env, CLAUDE_CODE_SUBPROCESS_ENV_SCRUB: undefined },
    settings: getAdminSettings() || {},
    agentFrontmatter: agentPermissionMode ? { permissionMode: agentPermissionMode } : undefined,
  });

  if (result.mode === "auto") globalAutoModeController?.setAutoModeActive(true);
  return { mode: result.mode, notification: result.notification };
}

// Mapping: zR6→resolvePermissionMode, H→permissionModeCli, $→dangerouslySkipPermissions,
//   q→agentPermissionMode, rgK→resolveModeFromSources, aW→isSubprocessEnvScrubbed,
//   Oq→getAdminSettings, ON→globalAutoModeController
```

The v2.1.132 fix is in the **call path** to `zR6` — the `-p --continue` codepath now passes `permissionModeCli` through. The internal logic was already correct; the wiring was wrong.

### The internal resolver `rgK` (chunks `_top_*`, line 198981-199046)

This walks all four sources and stacks them by precedence:

```
priority: high → low
  CLI dangerouslySkipPermissions=true → "bypassPermissions"
  CLI permissionMode                    → that value
  Agent frontmatter permissionMode      → that value
  Settings permissions.defaultMode      → that value (with auto-mode authority check)
  fallback                              → "default"
```

The first mode that **passes** all the disable-checks (bypass disabled by policy, auto disabled by circuit-breaker, etc.) wins. If none pass, fallback is `"default"` with a notification explaining why the requested mode was rejected.

### Why a *notification* not an *error*

When `--permission-mode bypassPermissions` is requested but managed policy disables bypass mode, the CLI doesn't error — it falls through to `"default"` and sets `notification: "Bypass permissions mode was disabled by your organization policy"`. The session continues; the user just sees a banner explaining the mismatch. This is consistent with the project's "fail open with warning, fail closed on action" pattern — a configuration mismatch doesn't kill the session, it shows up at the right surface (the mode banner).

### The session-resume warning (line 277311-277315)

For *deferred tools* (interrupted tools that need to re-emit on resume), the resumer compares the original mode against the current mode and warns:

```javascript
if (A !== H.permissionMode)
  N(
    `Deferred tool resume: permissionMode mismatch (deferred under '${H.permissionMode}', resuming under '${A}'). --resume does not restore permissionMode — pass --permission-mode ${H.permissionMode} to match.`,
    { level: "warn" },
  );
```

This is **explicit messaging** at the right point. The deferred tool will re-evaluate permissions under the new mode — if the user *meant* to continue in plan mode but forgot the flag, they see the warning and can retry.

---

## 3. v2.1.136 — Plan Mode Blocks Edit Even When Allow Rule Matches

### The bug

A user with `permissions.allow: ["Edit(src/**)"]` who entered plan mode expected file writes to be blocked. Pre-fix, the allow rule short-circuited the plan-mode check — the rule matched, the write happened.

### The fix

In `VkH` (the file-edit permission check — chunks `_top_*`, line 518202-518286), the allow-rule lookup now includes a plan-mode guard (line 518226-518237):

```javascript
// ============================================
// fileEditPermissionCheck - Edit/Write permission with plan-mode allow-rule override
// Location: cli_inner_pretty.js:518202-518286
// ============================================

// ORIGINAL (for source lookup):
let Y = yL(_, { ...q, alwaysAllowRules: { session: q.alwaysAllowRules.session ?? [] } }, "edit", "allow");
if (Y) {
  let D = Y.ruleValue.ruleContent;
  if (
    D &&
    (D.startsWith(si$.slice(0, -2)) || D.startsWith(ti$.slice(0, -2))) &&
    !D.includes("..") &&
    D.endsWith("/**") &&
    q.mode !== "plan"
  )
    return { behavior: "allow", updatedInput: $, decisionReason: { type: "rule", rule: Y } };
}
// ... later, line 518269-518274:
if (q.mode === "plan")
  return {
    behavior: "ask",
    message: `Cannot write to ${_} while in plan mode.`,
    decisionReason: { type: "mode", mode: "plan" },
  };

// READABLE (for understanding):
const sessionRule = matchPathRule(
  filePath,
  { ...permContext, alwaysAllowRules: { session: permContext.alwaysAllowRules.session ?? [] } },
  "edit",
  "allow"
);
if (sessionRule) {
  const content = sessionRule.ruleValue.ruleContent;
  // The session-scoped rule was a path-prefix grant from an earlier approval.
  // Honor it ONLY when we're not in plan mode.
  const isSessionApproval =
    content &&
    (content.startsWith(homePath) || content.startsWith(cwdPath)) &&
    !content.includes("..") &&
    content.endsWith("/**");
  if (isSessionApproval && permContext.mode !== "plan") {
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: { type: "rule", rule: sessionRule }
    };
  }
}
// ... fall through to the plan-mode deny near the end of the function
if (permContext.mode === "plan") {
  return {
    behavior: "ask",
    message: `Cannot write to ${filePath} while in plan mode.`,
    decisionReason: { type: "mode", mode: "plan" },
  };
}

// Mapping: VkH→fileEditPermissionCheck, yL→matchPathRule, q→permContext, _→filePath, $→input,
//   Y→sessionRule, D→content, si$→homePath, ti$→cwdPath
```

### Key insight — why the check is on session rules, not all allow rules

The `Y = yL(_, { ..., alwaysAllowRules: { session: ... } }, ...)` call **deliberately restricts the lookup to session-scoped rules only** — by stripping `userSettings`, `localSettings`, `policySettings` from `alwaysAllowRules`. Why?

Because *session-scoped allow rules* are what the user grants at the prompt ("Allow this write to `src/**` for this session"). Plan mode should override these (the user said "I'm thinking, don't write yet").

*Settings-scoped allow rules* (e.g., `permissions.allow: ["Edit(README.md)"]` in `~/.claude/settings.json`) are matched **later** in the same function — through `wy4(A, q, "edit")` on line 518278, which uses the **full** allow-rule set. But by then, the plan-mode check on line 518269 has already fired. So in plan mode:

1. Session allow rule check (line 518226-518237) — short-circuits **only if not plan mode**
2. Safety check (line 518247-518248) — denies if path is dangerous
3. **Plan mode check (line 518269-518274) — denies in plan mode unconditionally**
4. Settings allow rule check (line 518278-518279) — never reached in plan mode

So `permissions.allow: ["Edit(README.md)"]` in `settings.json` is **also blocked** in plan mode, because the plan-mode deny is *before* the settings-rule lookup. The session-rule path is what gets the early short-circuit (so a session-grant outside plan mode is still fast).

### Why this design

The team could have moved plan-mode check to the very top of the function. They didn't — and the reason becomes clear with reading the order:

1. **Deny rules win first** (lines 518210-518218) — even in plan mode, an explicit `deny` should fire with the correct message ("Permission to edit X has been denied"), not a plan-mode message
2. **Memory writes off** (line 518219-518225) — toggle-memory blocks have priority over plan
3. **Session approvals** (line 518226-518237) — if a *non-plan* session has session-granted, allow immediately
4. **Ask rules** (line 518238-518246) — explicit ask should fire
5. **Safety check** (line 518247-518268) — protected paths get the safety-check UX
6. **Plan mode** (line 518269-518274) — finally, the mode-level block
7. **Settings allow** (line 518278-518279) — only reached outside plan mode

The plan-mode check is **after** the deny/safety checks (because those are stronger) but **before** the settings-allow lookup (because the user explicitly entered plan mode and we're protecting their intent). This is the layering that makes plan mode behave as "I'm thinking, please don't side-effect" rather than "I want to disable everything."

---

## 4. v2.1.141 — Background Agents Preserve Permission Mode

### The bug

When a background agent (`/bg` or `←←`) launched from an interactive session in `acceptEdits` mode, the agent reverted to `default` mode. Each tool call would prompt the (offline) user, hang the background agent.

### The fix

The permission-update callback `eJH` (chunks `_top_*`, line 580705-580724) is invoked by hooks and other rule-changing paths. When called with `preserveMode: true`, it keeps the existing mode:

```javascript
// ============================================
// applyPermissionUpdateCallback - Update rules while optionally preserving mode
// Location: cli_inner_pretty.js:580705-580724
// ============================================

// ORIGINAL (for source lookup):
let eJH = e$.useCallback(
  (j$, a$) => {
    (_H((j8) => ({
      ...j8,
      toolPermissionContext: { ...j$, mode: a$?.preserveMode ? j8.toolPermissionContext.mode : j$.mode },
    })),
      setImmediate((j8) => {
        // re-check open permission requests
      }, i9));
  },
  [_H, i9],
);

// READABLE (for understanding):
const applyPermissionUpdate = useCallback(
  (newContext, options) => {
    // Update the global app state with the new permission context.
    // If preserveMode is set, keep the EXISTING mode instead of using newContext.mode.
    setAppState((prev) => ({
      ...prev,
      toolPermissionContext: {
        ...newContext,
        mode: options?.preserveMode
          ? prev.toolPermissionContext.mode      // ← keep the current mode
          : newContext.mode,                     // ← otherwise, take from the update
      },
    }));
    // Re-evaluate any open permission requests with the new context
    setImmediate((pendingRequests) => {
      pendingRequests.forEach((req) => req.recheckPermission());
      eventEmitter.emit();
    }, pendingRequestRegistry);
  },
  [setAppState, pendingRequestRegistry]
);

// Mapping: eJH→applyPermissionUpdate, _H→setAppState, j$→newContext, a$→options,
//   j8→prev, jt→eventEmitter, i9→pendingRequestRegistry
```

### Where `preserveMode: true` is passed (line 395699-395704)

In the hook-controlled permission flow (`tD` etc.), when a hook returns `permissionUpdates`, those updates are applied with `preserveMode: true`:

```javascript
case "allow": {
  let { updatedInput: v, permissionUpdates: E, feedback: I, contentBlocks: h } = V;
  if ((AC(E ?? []), E && E.length > 0)) {
    let R = $QK();  // ← retrieve the callback
    if (R) {
      let B = A.getAppState(),
        u = Dk(B.toolPermissionContext, E);  // ← apply E to context
      R(u, { preserveMode: !0 });            // ← invoke callback with preserveMode
    }
  }
  // ...
}
```

This is the hook-driven *rule update* path. The hook can change rules (add allows/denies) without changing the *mode*. The mode is owned by the user/session, not by hooks.

### Why this matters for background agents

Background agents inherit the parent's `toolPermissionContext`. When a parent agent's hook fires (e.g., on tool use, the hook updates rules), the parent's `eJH` runs with `preserveMode: true` — the parent's mode is unchanged. The child background agent that subsequently reads the parent context sees the same mode.

Pre-fix, the same path didn't pass `preserveMode: true`, so the hook accidentally *re-set the mode* to the value carried in the update payload — which was `default` (the hook didn't carry a mode at all, but the update object's `mode` field was `undefined` → falsy → defaulted to `"default"`).

---

## 5. v2.1.141 — Switching Permission Mode Auto-Dismisses Open Prompt

### The bug

User in `default` mode, model invokes `Bash(npm test)`, prompt opens asking "Allow?". User shift-tabs to switch into `acceptEdits` mode (which allows test commands). **Prompt stayed open**, blocking the agent. User had to manually approve.

### The fix

When mode changes via the carousel (`eJH` callback), the same `setImmediate` callback that fires the rules-update also iterates open prompts and calls `recheckPermission()` on each. The prompt's recheck logic compares its `originalDecisionReason` against the new context — if the new mode would have allowed the call originally, the prompt closes with an automatic "allow".

The mechanism is the existing `recheckPermission` already wired in v2.1.97 for rule changes; v2.1.141 extends it to fire on **mode changes** too, via the shared `_H` setState path.

---

## 6. Layered Invariants — What's Preserved, What's Re-Evaluated

```
                User-controlled axis        Rule-controlled axis
                ───────────────────         ────────────────────
                permission mode             allow/deny/ask rules
                  ↓                            ↓
       owned by: shift-tab,                hooks, settings.json,
                 startup flags,            user prompt approvals
                 ExitPlanMode,
                 mode-set hook
                  ↓
       preserved across:                   preserved across:
       - hook rule updates (.141)          - mode changes (.141 re-eval)
       - bg agent dispatch (.141)          - resume (.132 indirectly)
       - rule changes                      - plan mode (.136 — settings
                                             allow doesn't override)
                  ↓
       changed by:                         changed by:
       - user mode action                  - hook permissionUpdates
       - --permission-mode flag            - rule-add suggestions
         (.132 fixes resume)                 from prompt approvals
       - plan exit                         - settings.json edits
```

The fixes in this window all live on the diagonal — they prevent rule changes from changing mode, and prevent the *missed* propagation of user mode intent (the resume flag).

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions in this document:
- `resolvePermissionMode` (`zR6`) — Top-level mode resolver, threading CLI/env/settings/agent through
- `resolveModeFromSources` (`rgK`) — Internal walker that stacks CLI > agent > settings
- `applyPermissionUpdate` (`eJH`) — React callback applying rule updates; honors `preserveMode`
- `fileEditPermissionCheck` (`VkH`) — Edit/Write rule check with plan-mode block before settings-allow lookup
- `getPermissionUpdateCallback` (`$QK`) — Returns the current `eJH` instance from React context
- `recheckPermission` — Called on each open prompt when context changes
- `setAppState` (`_H`) — React state setter used by `eJH`
- `Dk` — Applies an array of permission-update objects to a context
- `permissionsAlwaysAllowRulesSession` field — Session-scoped allow rules (subset of `alwaysAllowRules`)
- `decisionReason.type === "mode"` — Reason discriminant for mode-driven decisions
- `decisionReason.mode` — String value (`"plan"`, `"acceptEdits"`, etc.)
