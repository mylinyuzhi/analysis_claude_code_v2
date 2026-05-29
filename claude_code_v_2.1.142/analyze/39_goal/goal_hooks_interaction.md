# `/goal` and Hook Disable Settings (v2.1.140 gate)

## What it does

`/goal` is implemented as a session-scoped Stop hook (see [goal_command.md](./goal_command.md)). If hooks are disabled at the time `/goal` is invoked, registering the hook would silently succeed at the registry layer but the host would skip every Stop hook invocation - leaving the user with an indicator that never resolves.

v2.1.140 adds a **precondition gate** that catches this before the hook is registered:

- If `disableAllHooks` is set in `settings.json` or by policy, the host rejects `/goal` with a clear message: "/goal can't run while hooks are disabled (disableAllHooks or allowManagedHooksOnly is set in settings or by policy)."
- If `allowManagedHooksOnly` is set, same message - because `/goal` registers a session-scoped (non-managed) hook, the managed-only filter would silently drop it.

Plus a related gate: `/goal` in an **interactive** session requires the user to have accepted the workspace trust dialog. If not, the host shows: "/goal is only available in trusted workspaces. Restart, accept the trust dialog, and try again." Non-interactive sessions (`-p`/SDK/background) auto-bypass the trust check — see [§ T6 and \_5 in context](#correction-t6-is-isnoninteractive-_5-is-istrustgranted) below.

The same gate is applied at session-resume time by `restoreGoalFromTranscript` - if the gate fails at resume, the active goal is dropped rather than re-registered into a doomed state.

---

## How it works

### 1. The gate function

```javascript
// ============================================
// goalGateCheck - precondition gates for /goal
// Location: cli_inner_pretty.js:486714-486718
// ============================================

// ORIGINAL (for source lookup):
function Xp6() {
  if (km() || rw()) return { message: av5, code: "hooks_gate" };
  if (!T6() && !_5()) return { message: ov5, code: "trust_gate" };
  return null;
}

// READABLE (for understanding):
function goalGateCheck() {
  // Hooks layer is off (either fully disabled or restricted to managed-only)
  if (isAllHooksDisabled() || isAllowManagedHooksOnly()) {
    return { message: GOAL_HOOKS_GATE_MSG, code: "hooks_gate" };
  }
  // Trust gate. T6 = isNonInteractive (true for -p/SDK/bg). _5 = isTrustGranted (sandboxed,
  // session-trust flag set, bg-agent context, OR project-tree hasTrustDialogAccepted).
  // Reads as: "if we're interactive AND trust hasn't been granted -> reject".
  // Non-interactive contexts auto-pass (no dialog can be shown there); interactive contexts
  // require an accepted trust dialog or one of the bypass conditions in eh1().
  if (!isNonInteractive() && !isTrustGranted()) {
    return { message: GOAL_TRUST_GATE_MSG, code: "trust_gate" };
  }
  return null;          // OK
}

// Mapping:
//   Xp6 -> goalGateCheck,
//   km  -> isAllHooksDisabled,         rw  -> isAllowManagedHooksOnly,
//   T6  -> isNonInteractive,           _5  -> isTrustGranted,
//   av5 -> GOAL_HOOKS_GATE_MSG,        ov5 -> GOAL_TRUST_GATE_MSG
```

### 1a. Correction: `T6` is `isNonInteractive`, `_5` is `isTrustGranted`

The literal definitions in cli_inner_pretty.js:

```javascript
// ============================================
// T6 - isNonInteractive
// Location: cli_inner_pretty.js:2677-2679
// ============================================

// ORIGINAL (for source lookup):
function T6() {
  return !U$.isInteractive;
}

// READABLE (for understanding):
function isNonInteractive() {
  // True for -p mode, SDK callers, background agents — anything where the Ink renderer
  // is not in control and the user cannot be shown a dialog.
  return !sessionGlobals.isInteractive;
}
```

```javascript
// ============================================
// _5 - isTrustGranted (memoized)
// Location: cli_inner_pretty.js:140013-140033
// ============================================

// ORIGINAL (for source lookup):
function _5() {
  return (hTK ||= eh1());
}
function eh1() {
  if (bH(process.env.CLAUDE_CODE_SANDBOXED)) return !0;
  if (YIH()) return !0;
  if (N7()) return !0;
  let H = h$(), $ = HBH();
  if (H.projects?.[$]?.hasTrustDialogAccepted) return !0;
  let K = ep(I$());
  while (!0) {
    if (H.projects?.[K]?.hasTrustDialogAccepted) return !0;
    let A = ep(QM.resolve(K, ".."));
    if (A === K) break;
    K = A;
  }
  return !1;
}

// READABLE (for understanding):
let trustCache = false;
function isTrustGranted() {
  // Memoized — once true, stays true for the rest of the process lifetime.
  return (trustCache ||= computeTrust());
}
function computeTrust() {
  // Trust is granted if any of:
  // 1. The CLAUDE_CODE_SANDBOXED env var is truthy (running inside Anthropic's sandbox).
  if (parseBoolean(process.env.CLAUDE_CODE_SANDBOXED)) return true;
  // 2. The session-trust flag was set (e.g., by the remote-bridge bootstrap or by an
  //    --dangerously-skip-permissions / similar invocation that set sessionTrustAccepted).
  if (sessionTrustAccepted()) return true;
  // 3. Running as a background agent (bU() === "bg").
  if (isBackgroundAgent()) return true;
  // 4. The user has previously accepted the trust dialog for this project OR any ancestor.
  const cfg = getGlobalConfig();
  const projectKey = currentProjectKey();
  if (cfg.projects?.[projectKey]?.hasTrustDialogAccepted) return true;
  let dir = absolutePath(currentDir());
  while (true) {
    if (cfg.projects?.[dir]?.hasTrustDialogAccepted) return true;
    const parent = absolutePath(pathJoin(dir, ".."));
    if (parent === dir) break;
    dir = parent;
  }
  return false;
}

// Mapping:
//   _5  -> isTrustGranted (memoized),    eh1 -> computeTrust,
//   YIH -> sessionTrustAccepted,         N7  -> isBackgroundAgent,
//   bH  -> parseBoolean,                 hTK -> trustCache
```

**Why this distinction matters:** earlier drafts of this analysis treated `T6` as "isTrustedWorkspace" and `_5` as "isTrustBypassContext". Both names were wrong. `T6` has nothing to do with trust — it's a pure "are we in interactive mode" probe used in ~50 places across the codebase for things like "should this command show a TUI dialog or return text". `_5` is the actual trust check, and it accepts trust from any of four sources (sandbox env, session flag, background-agent context, or accepted dialog) — calling it a "bypass" understates how much real trust evaluation it does.

**The gate's effective truth table:**

| Mode | `T6()` | `_5()` | `!T6() && !_5()` | Trust gate result |
|------|--------|--------|-------------------|-------------------|
| Interactive REPL, dialog accepted | false | true | false | pass |
| Interactive REPL, dialog NOT accepted | false | false | **true** | reject — show trust message |
| `-p` / SDK | true | * | false | pass (interactive check satisfied) |
| Background agent | true (via interactive=false at session bootstrap) | true (via `N7()`) | false | pass |
| Sandboxed CI container | depends | true (via `CLAUDE_CODE_SANDBOXED`) | false | pass |
| Remote-bridge with `sessionTrustAccepted` | false | true (via `YIH()`) | false | pass |

So the gate rejects exactly one case: an interactive session whose project (and ancestor projects) haven't had the trust dialog accepted, *and* which isn't running in a sandbox/bg/remote-trusted context. Resolution path: accept the trust dialog (Claude Code re-prompts on next launch in an untrusted project).

### 2. The hook-disable predicates

```javascript
// ============================================
// isAllHooksDisabled - reads policySettings.disableAllHooks
// Location: cli_inner_pretty.js:240936-240938
// ============================================

// ORIGINAL (for source lookup):
function km() {
  return v8("policySettings")?.disableAllHooks === !0;
}

// READABLE (for understanding):
function isAllHooksDisabled() {
  // Note: this checks ONLY policySettings (admin-controlled), NOT user-tier disableAllHooks.
  // The user-tier disableAllHooks is checked separately via Oq().disableAllHooks - see below.
  return getSettings("policySettings")?.disableAllHooks === true;
}

// Mapping: km -> isAllHooksDisabled, v8 -> getSettings
```

```javascript
// ============================================
// isAllowManagedHooksOnly - reads either tier
// Location: cli_inner_pretty.js:240930-240935
// ============================================

// ORIGINAL (for source lookup):
function rw() {
  let H = v8("policySettings");
  if (H?.allowManagedHooksOnly === !0) return !0;
  if (Oq().disableAllHooks === !0 && H?.disableAllHooks !== !0) return !0;
  return !1;
}

// READABLE (for understanding):
function isAllowManagedHooksOnly() {
  const policy = getSettings("policySettings");
  // Admin-set managed-only: every non-policy hook is dropped.
  if (policy?.allowManagedHooksOnly === true) return true;
  // User-set disableAllHooks (without policy override) ALSO collapses to "managed only" -
  // because policy hooks survive disableAllHooks (`241302` log line: "Skipping plugin hooks -
  // allowManagedHooksOnly is enabled and no managed plugins"). The semantics for /goal are
  // the same: only managed hooks survive, and /goal's hook is not managed.
  if (mergedSettings().disableAllHooks === true && policy?.disableAllHooks !== true) return true;
  return false;
}

// Mapping: rw -> isAllowManagedHooksOnly, Oq -> mergedSettings
```

The two predicates together cover all four combinations of `policySettings.disableAllHooks`, `userSettings.disableAllHooks`, and `policySettings.allowManagedHooksOnly`:

| Setting                              | `km()` | `rw()` | `/goal` |
|--------------------------------------|--------|--------|---------|
| All off                              | false  | false  | proceed |
| `policySettings.disableAllHooks`     | true   | false  | reject  |
| `userSettings.disableAllHooks` (only)| false  | true   | reject  |
| `policySettings.allowManagedHooksOnly`| false | true   | reject  |
| Both `policySettings.disableAllHooks` and user disableAllHooks | true | false | reject |

Any of the rejection branches resolves to the same user-facing message.

### 3. The user-facing messages

```javascript
// ============================================
// Goal gate user-facing message constants
// Location: cli_inner_pretty.js:486760-486762
// ============================================

// ORIGINAL (for source lookup):
ov5 = "/goal is only available in trusted workspaces. Restart, accept the trust dialog, and try again.",
av5 =
  "/goal can't run while hooks are disabled (disableAllHooks or allowManagedHooksOnly is set in settings or by policy).";

// READABLE (for understanding):
const GOAL_TRUST_GATE_MSG = "/goal is only available in trusted workspaces. Restart, accept the trust dialog, and try again.";
const GOAL_HOOKS_GATE_MSG = "/goal can't run while hooks are disabled (disableAllHooks or allowManagedHooksOnly is set in settings or by policy).";

// Mapping: ov5 -> GOAL_TRUST_GATE_MSG, av5 -> GOAL_HOOKS_GATE_MSG
```

### 4. Telemetry on rejection

The `Xp6` return value carries a `code` (`"hooks_gate"` or `"trust_gate"`) which gets fed to `J8("goal_set", code)` (the failure-metric recorder). This lets enterprises notice when policies are blocking `/goal` more than expected.

```javascript
// ============================================
// CaH (registerGoal) - the gate-emission wiring
// Location: cli_inner_pretty.js:486720-486721
// ============================================

// ORIGINAL (for source lookup):
function CaH(H, $) {
  let q = Xp6();
  if (q !== null) return (J8("goal_set", q.code), q.message);
  // ... rest of registration
}

// READABLE (for understanding):
function registerGoal(condition, sessionState) {
  const gateError = goalGateCheck();
  if (gateError !== null) {
    recordFailureMetric("goal_set", gateError.code);            // hooks_gate or trust_gate
    return gateError.message;
  }
  // ... rest of registration
}
```

### 5. The resume-time gate

```javascript
// ============================================
// restoreGoalFromTranscript - resume-time gate
// Location: cli_inner_pretty.js:564153-564164
// ============================================

// ORIGINAL (for source lookup):
function Cr5(H, $) {
  let q = Eg4(H),
    K = q !== null ? Xp6() : null;
  if (K !== null) J8("goal_set", K.code);
  if (q === null || K !== null) {
    $((_) => (_.activeGoal === void 0 ? _ : { ..._, activeGoal: void 0 }));
    return;
  }
  (_X$($, v$(), "Stop", "", { type: "prompt", prompt: q }),
    $((_) => ({ ..._, activeGoal: { condition: q, iterations: 0, setAt: Date.now(), tokensAtStart: nX() } })),
    d("tengu_goal_restored_on_resume", { promptLength: q.length }));
}

// READABLE (for understanding):
function restoreGoalFromTranscript(messages, setAppState) {
  const conditionToRestore = findGoalToRestore(messages);
  // Only check the gate if there's actually a goal to restore (avoid spurious metric noise)
  const gateError = conditionToRestore !== null ? goalGateCheck() : null;
  if (gateError !== null) {
    recordFailureMetric("goal_set", gateError.code);
  }
  // If no goal exists in the transcript OR if the gate is failing, clear any stale state and exit
  if (conditionToRestore === null || gateError !== null) {
    setAppState((prev) => prev.activeGoal === undefined ? prev : { ...prev, activeGoal: undefined });
    return;
  }
  // Re-register the Stop hook and re-initialise active-goal state
  registerSessionHookDirect(setAppState, currentSessionId(), "Stop", "", {
    type: "prompt",
    prompt: conditionToRestore,
  });
  setAppState((prev) => ({
    ...prev,
    activeGoal: {
      condition: conditionToRestore,
      iterations: 0,
      setAt: Date.now(),
      tokensAtStart: currentTokenCount(),
    },
  }));
  recordInternalEvent("tengu_goal_restored_on_resume", { promptLength: conditionToRestore.length });
}

// Mapping:
//   Cr5 -> restoreGoalFromTranscript,    Eg4 -> findGoalToRestore,
//   _X$ -> registerSessionHookDirect,    nX -> currentTokenCount,
//   v$  -> currentSessionId,             d  -> recordInternalEvent,
//   J8  -> recordFailureMetric
```

If a user disabled hooks **after** setting a goal in a previous session, resuming that session drops the goal silently (clearing `activeGoal` from state) instead of leaving a goal active that the host can't enforce. The `tengu_goal_restored_on_resume` event only fires on successful restoration; failures emit `goal_set` with the gate code instead.

### 6. Why pre-gate not post-gate?

Pre-2.1.140, the registration would have proceeded:

1. `sessionHooksRegistry.add` - stores the hook in the in-memory map. OK.
2. Model turn finishes, the Stop hook chain runs.
3. The hook engine reads `disableAllHooks` and **skips** the hook silently.
4. Goal never resolves. User sees the overlay panel ticking forever with no progress.

The pre-gate intercepts at step 1 and surfaces the failure to the user immediately, with actionable text ("disableAllHooks or allowManagedHooksOnly is set in settings or by policy"). This is the same defensive pattern as v2.1.140's other hook fixes (e.g. "configuring a prompt-/agent-type hook for SessionStart shows a clear 'use a command-type hook instead' error").

---

## Why this approach

**Why a unified message for `disableAllHooks` and `allowManagedHooksOnly`?** Both settings produce the same user-visible failure (the goal cannot be enforced). The message names both so the user can check their config tree without guessing which knob to flip. Different messages per setting would force the user to look up which one is set.

**Why include the trust gate alongside the hook gate?** `/goal` relies on a Stop hook that runs a model subagent to evaluate the condition. In an untrusted workspace, the hook system itself is gated (no project-level hooks, no plugin hooks, no user `.claude/skills/` shell fences). Letting `/goal` proceed would either silently fail at the hook layer (same as disableAllHooks) or run unconfigured. The trust gate makes the requirement explicit.

**Why does the gate bypass trust in non-interactive mode?** Because non-interactive callers (`-p`, SDK, background agents) cannot see or respond to a trust dialog. The trust contract for those callers is established at launch time via flag (`--dangerously-skip-permissions`), env (`CLAUDE_CODE_SANDBOXED`), or context (the bridge that set `sessionTrustAccepted`). At the point `/goal` is invoked, the trust decision has already been made — `T6()` true means "we wouldn't have started without trust being implicit". So gating again would either be redundant or block a legitimate caller.

**Why does the resume-time gate drop the goal instead of leaving it pending?** Two reasons:

1. The overlay panel would tick the elapsed-time clock against a goal that cannot ever resolve. The user has no way to know the goal is broken without checking settings.
2. The `tengu_stop_hook_added` event already fired in the prior session. Re-firing it would over-count goal registrations.

Dropping the goal is the conservative path - the user can run `/goal <cond>` again to re-establish it.

**Why is the trust check `!T6() && !_5()` (interactive AND not-trust-granted)?** The check is `if (interactive && !trustGranted) reject`. Interactive contexts must have trust, because they're the contexts where a dialog *could* be shown. Non-interactive contexts auto-pass because they got trust through some other channel at launch (flag/env/bridge) or they don't need it (background agent runs under the parent session's trust). This split keeps headless callers usable while preserving the interactive trust-dialog as the single point of user consent.

**Key insight:** The gate is **pure detection** - it does not try to fix the configuration or prompt the user to change settings. It returns the failure to the caller verbatim, who emits it via the same `display: "system"` channel any other error message would use. This keeps the failure indistinguishable from any other `/goal` failure (length cap, etc.) from the caller's perspective. The "how to fix" hint is baked into the message itself.

---

## What changed in v2.1.140 specifically

The v2.1.139 release added `/goal` but the gate was missing. Symptom: if `disableAllHooks` was set, `/goal` would emit "Goal set: ..." and the priming meta-message, the model would start working, the Stop hook engine would skip the hook silently, and the model would just keep going until token budget or user-Esc.

v2.1.140 added:

1. The `Xp6` (`goalGateCheck`) function itself (didn't exist before).
2. The `if (q !== null) return (J8("goal_set", q.code), q.message);` lines in `CaH` (`registerGoal`).
3. The mirror gate in `Cr5` (`restoreGoalFromTranscript`) for resume-time consistency.

Three coordinated changes - the registration, the resume path, and the gate function - all shipped in v2.1.140.

---

## Cross-references

- The hook disable settings (`disableAllHooks`, `allowManagedHooksOnly`) - `27_hooks_subsystem`
- Trust dialog and `isTrustedWorkspace` / `T6` - `12_permission_policy` or `13_sandbox_hardening`
- The Stop hook chain that the goal piggybacks on - `27_hooks_subsystem`
- The other v2.1.140 hook-configuration error refinements (`SessionStart`/`Setup`/`SubagentStart` prompt-type rejection) - `27_hooks_subsystem`
