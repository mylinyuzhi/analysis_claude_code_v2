# Permission Mode Lifecycle (v2.1.142)

**Theme:** A session has exactly one **permission mode** at any time: `default`, `acceptEdits`, `plan`, `bypassPermissions`, `auto`, or `dontAsk`. The mode is a *global state* that determines which checks fire in the policy chain (see [`architecture.md`](./architecture.md)). This document maps the **state machine** — how modes are entered, exited, persisted across resume/wake, and re-evaluated when prompts are open.

The window v2.1.113 → v2.1.142 makes the lifecycle **strict**: mode is mutated only by a small set of intentional transitions; per-call decisions never mutate mode; resume restores mode from CLI flag; background agents preserve mode; mode-change re-evaluates open prompts.

---

## 1. The Six Modes

```javascript
// ============================================
// PERMISSION_MODES constant - All valid permission modes
// Location: cli_inner_pretty.js:48447-48449
// ============================================

// ORIGINAL (for source lookup):
Uo = ["acceptEdits", "auto", "bypassPermissions", "default", "dontAsk", "plan"];
QMq = [...Uo];
tN = QMq;

// READABLE (for understanding):
const EXTERNAL_PERMISSION_MODES = ["acceptEdits", "auto", "bypassPermissions", "default", "dontAsk", "plan"];
const INTERNAL_PERMISSION_MODES = [...EXTERNAL_PERMISSION_MODES];
const PERMISSION_MODES = INTERNAL_PERMISSION_MODES;

// Mapping: Uo→EXTERNAL_PERMISSION_MODES, QMq→INTERNAL_PERMISSION_MODES, tN→PERMISSION_MODES
```

### Per-mode semantics

| Mode | Behavior on `ask` from rules | Behavior on Bash/Edit safety check | UI cue |
|---|---|---|---|
| `default` | Prompt user | Prompt user | (none) |
| `acceptEdits` | Edit/Write/MultiEdit allowed in cwd; others prompt | Prompt user | ⏵⏵ |
| `plan` | Block all writes/edits/Bash side-effects | Block | ⏸ (pause icon) |
| `bypassPermissions` | Auto-allow (except `_u5` sensitive paths and `nUH` critical paths) | Deny (with `safetyCheck` reason) | ⏵⏵ red |
| `auto` | Classifier (LLM) decides — see [`auto_mode_classifier.md`](./auto_mode_classifier.md) | Per-classifier | ⏵⏵ amber |
| `dontAsk` | Convert `ask` → `deny` (no UI prompt) | Deny | ⏵⏵ red |

The "external" set is the same — `bubble` (legacy internal name) was removed before v2.1.142.

---

## 2. The State Machine

```
                ┌───────────────────────────────────┐
                │                                   │
                │  shift+tab cycle (external users) │
                │  default ─► acceptEdits ─► plan ─►│
                │                              │    │
                │       ┌──────────────────────┘    │
                │       ▼                           │
                │  bypassPermissions ─► default     │
                │                                   │
                │  (auto inserted at the bypass     │
                │   slot if model+gate enabled)     │
                └─────────────┬─────────────────────┘
                              │
                              │ (also via slash command, CLI flag,
                              │  hook setMode update)
                              ▼
                  ┌──────────────────────────┐
                  │  Mode mutation triggers: │
                  │  - getNextPermissionMode │  (Shift+Tab)
                  │  - /permission-mode SLASH│  (Slash command)
                  │  - --permission-mode FLG │  (CLI flag)
                  │  - hook setMode update   │  (PermissionUpdate)
                  │  - ExitPlanMode → prePlan│  (plan-exit transition)
                  └──────────────────────────┘
```

### The cycle ([`getNextPermissionMode`](`/lyz/codespace/3rd/claude-code/src/utils/permissions/getNextPermissionMode.ts`))

For external users (USER_TYPE !== "ant"):

```
default → acceptEdits → plan → bypassPermissions (if available) → default
                                             ↓
                                         (or auto if gate enabled)
                                             ↓
                                          default
```

For Anthropic internal "ant" users, `acceptEdits` and `plan` are **skipped** — auto mode replaces them:

```
default → bypassPermissions (if available) → auto (if gate enabled) → default
                ↓
              auto (if gate enabled)
                ↓
              default
```

The fork at `plan` adds `auto` only when:
1. `ctx.isAutoModeAvailable` is true (set by `verifyAutoModeGateAccess` at startup)
2. `isAutoModeGateEnabled()` returns true (live re-check — settings or circuit-breaker can change mid-session)

The **double-check** (cached + live) prevents `transitionPermissionMode` from throwing when settings change mid-session — see comment in 2.1.88 `getNextPermissionMode.ts:14-26`.

---

## 3. Entry Triggers

### 3.1 Shift+Tab cycle

The user presses Shift+Tab to advance to the next mode. The handler calls `cyclePermissionMode` which:

1. Computes next mode via `getNextPermissionMode`
2. Runs `transitionPermissionMode(currentMode, nextMode, ctx)` which:
   - On `default → auto`: strips dangerous permissions (via `stripDangerousPermissionsForAutoMode`)
   - On `auto → default`: restores stripped dangerous permissions
   - On `default → plan`: stashes current mode in `prePlanMode`
   - On exit from plan: restores `prePlanMode`

### 3.2 Slash command `/permission-mode`

Users can switch directly: `/permission-mode plan`, `/permission-mode bypassPermissions`. Validation rejects unknown modes.

### 3.3 CLI flag `--permission-mode`

`--permission-mode plan` sets the **initial mode** when the session starts. The resolver `zR6` (`initialPermissionModeFromCLI`) at `cli_inner_pretty.js:422449` consolidates the CLI flag, env, agent frontmatter, and settings into the effective initial mode.

### 3.4 Hook `setMode` permission update

A `PreToolUse` or `PermissionRequest` hook can return a `permissionUpdates` array containing a `{type: "setMode", mode: <mode>, destination: <tier>}` entry. The agent loop applies it via the permission-update callback (`eJH`, line 580705).

```javascript
// At line 181048 (setMode handling):
case "setMode":
  if (rejected because not available) {
    log("setMode 'bypassPermissions' rejected — mode is not available");
    return;
  }
  /* apply the new mode */
```

`bypassPermissions` is **session-scoped** — the update is not persisted to `destination` (line 181117). All other modes persist if the destination is writable.

### 3.5 ExitPlanMode → `prePlanMode`

When `ExitPlanMode` is called (the plan→active transition):

```javascript
// At cli_inner_pretty.js:381771-381790 (ExitPlanMode tool's handleToolUse):
let j = $.getToolPermissionContext();
if (j.mode === "plan") {
  let X = j.prePlanMode ?? "default";  // ← restore stashed pre-plan mode
  if (X === "auto" && !(z?.isAutoModeGateEnabled() ?? !1)) X = "default";
  /* set mode = X, clear prePlanMode */
  $.setToolPermissionContext((Z) => {
    let W = Z;
    if (L) W = z?.stripDangerousPermissionsForAutoMode(W) ?? W;
    else if (P) W = z?.restoreDangerousPermissions(W) ?? W;
    return { ...W, mode: X, prePlanMode: void 0 };
  });
}
```

So entering plan from `auto` and exiting plan returns to `auto`. Entering plan from `default` and exiting returns to `default`.

If the user was in `auto` and the auto-mode gate **went off** during plan (e.g. circuit-breaker fired), the exit falls back to `default` with a notification:

> plan exit → default · auto mode unavailable

---

## 4. Mode Resolver — `zR6` / `rgK`

`zR6` is the public entry point that initial-mode resolution funnels through. It handles `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` (force-default) and then delegates to `rgK`:

```javascript
// ============================================
// initialPermissionModeFromCLI - CLI / env / settings / agent → effective mode
// Location: cli_inner_pretty.js:422449-422468
// ============================================

// ORIGINAL (for source lookup):
function zR6({ permissionModeCli: H, dangerouslySkipPermissions: $, agentPermissionMode: q }) {
  if (aW()) {  // CLAUDE_CODE_SUBPROCESS_ENV_SCRUB set
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
function initialPermissionModeFromCLI({ permissionModeCli, dangerouslySkipPermissions, agentPermissionMode }) {
  // Hardening: subprocess env scrub forces default
  if (isSubprocessEnvScrubEnabled()) {
    const anyExplicit = dangerouslySkipPermissions ||
      (permissionModeCli && permissionModeCli !== "default") ||
      (agentPermissionMode && agentPermissionMode !== "default");
    const warning = "Permission mode forced to default — CLAUDE_CODE_SUBPROCESS_ENV_SCRUB is set ...";
    if (anyExplicit) process.stderr.write(`⚠ ${warning}\n`);
    return { mode: "default", notification: anyExplicit ? warning : undefined };
  }

  // Delegate to the resolver
  const result = resolvePermissionModeFromSources({
    cli: { permissionMode: permissionModeCli, dangerouslySkipPermissions },
    env: { ...process.env, CLAUDE_CODE_SUBPROCESS_ENV_SCRUB: undefined },  // strip scrub from inherited env
    settings: getAdminSettings() || {},
    agentFrontmatter: agentPermissionMode ? { permissionMode: agentPermissionMode } : undefined,
  });

  if (result.mode === "auto") globalAutoModeController?.setAutoModeActive(true);
  return { mode: result.mode, notification: result.notification };
}

// Mapping: zR6→initialPermissionModeFromCLI, rgK→resolvePermissionModeFromSources,
//          aW→isSubprocessEnvScrubEnabled, Oq→getAdminSettings, ON→globalAutoModeController
```

### `rgK` precedence

The inner resolver walks sources in priority order (highest → lowest):

```javascript
// ============================================
// resolvePermissionModeFromSources - Priority-resolve mode from CLI/env/settings/agent
// Location: cli_inner_pretty.js:198981-199046
// ============================================

// ORIGINAL (for source lookup):
function rgK(H) {
  let { cli: $, env: q, settings: K, agentFrontmatter: _ } = H,
    A = $.permissionMode, z = $.dangerouslySkipPermissions, Y = _?.permissionMode;
  /* env scrub override -> default */
  let f = Z$("tengu_disable_bypass_permissions_mode", !1),
    O = K.permissions?.disableBypassPermissionsMode === "disable",
    M = f || O, w = $t1(),
    D = [];
  if (z) D.push("bypassPermissions");
  if (A) { /* CLI --permission-mode value */
    let X = Rv(A);
    if (X === "auto") if (w) /* circuit breaker */; else D.push("auto");
    else D.push(X);
  }
  if (Y) /* agent frontmatter permissionMode */;
  if (K.permissions?.defaultMode) {
    let X = K.permissions.defaultMode;
    /* settings defaultMode — only allow auto if from policy/user/flag */
    /* (project/local can't grant auto; they're repo-controllable) */
  }
  /* select first non-disabled mode */
}

// READABLE (for understanding):
function resolvePermissionModeFromSources({ cli, env, settings, agentFrontmatter }) {
  const { permissionMode: cliMode, dangerouslySkipPermissions } = cli;
  const agentMode = agentFrontmatter?.permissionMode;

  if (isEnvScrubbed(env.CLAUDE_CODE_SUBPROCESS_ENV_SCRUB)) {
    /* force default, warn if user requested anything else */
  }

  const bypassDisabledByGate = isBypassDisabledByFeatureGate();
  const bypassDisabledBySettings = settings.permissions?.disableBypassPermissionsMode === "disable";
  const bypassDisabled = bypassDisabledByGate || bypassDisabledBySettings;
  const autoCircuitBreakerActive = isAutoCircuitBreakerOpen();

  // Priority queue: first-match-wins
  const candidates = [];

  if (dangerouslySkipPermissions) candidates.push("bypassPermissions");
  if (cliMode) {
    const normalized = normalizeMode(cliMode);
    if (normalized === "auto" && autoCircuitBreakerActive) {
      // Skip — fall to next
    } else {
      candidates.push(normalized);
    }
  }
  if (agentMode) {
    if (agentMode === "auto" && autoCircuitBreakerActive) {
      // Skip
    } else {
      candidates.push(agentMode);
    }
  }
  if (settings.permissions?.defaultMode) {
    const m = settings.permissions.defaultMode;
    if (m === "auto") {
      // SPECIAL: project/local settings can't grant auto — only policy/user/flag
      if (!sourceTierMayGrantAuto(m)) {
        // Drop & log warning
      } else if (!autoCircuitBreakerActive) {
        candidates.push("auto");
      }
    } else {
      candidates.push(m);
    }
  }

  // First-match-wins, skipping disabled bypass
  for (const candidate of candidates) {
    if (candidate === "bypassPermissions" && bypassDisabled) {
      // Log; try next
      continue;
    }
    return { mode: candidate, notification: maybeNotification };
  }

  return { mode: "default", notification: maybeNotification };
}

// Mapping: rgK→resolvePermissionModeFromSources, Rv→normalizeMode, $t1→isAutoCircuitBreakerOpen, ...
```

**Key insight — Why priority-list-with-skip rather than first-set-wins:** The resolver builds a *list of candidates* and walks it skipping disabled modes. This means:

- A user with `--dangerously-skip-permissions` + admin policy `disableBypassPermissionsMode: "disable"` falls through to the CLI's `--permission-mode` (or default), with a warning. The CLI flag isn't silently ignored — it's the next candidate.
- An agent with `permissionMode: "auto"` in frontmatter, when the circuit breaker is open, falls through to `settings.defaultMode` or default — not auto-faking-default.

---

## 5. v2.1.132 — `--permission-mode` Honored on `-p --continue` / `--resume`

**Pre-fix bug:**

```bash
# Worked:
claude --permission-mode plan -p "review this code"

# Did NOT work (mode silently reverted to default):
claude -p "review this code" --continue --permission-mode plan
```

The flag was parsed but not threaded through the session-restore path. v2.1.132 fixed this by calling `zR6` *after* loading the resumed session's context, so the CLI flag wins over the restored mode.

A warning logs when mode and resumed mode don't match:

> permissionMode mismatch (deferred under 'plan', resuming under 'default') — --resume does not restore permissionMode — pass --permission-mode plan to match.

This is **opt-in restore** — by default, `--resume` does NOT restore the previous session's mode. The user re-specifies the mode for the resumed turn.

### Why opt-in?

Mode is **user-controlled**, not session-persistent. If a user paused mid-session in `bypassPermissions` and comes back the next day, restoring bypass might be a surprise — they should re-affirm by passing the flag again. This is a deliberate friction-for-safety tradeoff.

---

## 6. v2.1.141 — Background Agents Preserve Mode

**Pre-fix bug:** When the user dispatched a background agent (via `/bg` or the `←←` shortcut), the agent ran in `default` mode regardless of what mode the parent session was in.

**Fix:** The permission-update callback (`eJH`, cli_inner_pretty.js:580705) honors a `preserveMode: true` flag in the `secondArg`:

```javascript
// ============================================
// permissionUpdateCallback - Apply permission updates with optional mode preservation
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
        (j8((Xq) => {
          return (
            Xq.forEach((wK) => {
              wK.recheckPermission();  // ← v2.1.141 re-evaluate open prompts
            }),
            Xq
          );
        }),
          jt.emit());
      }, i9));
  },
  [_H, i9],
);

// READABLE (for understanding):
const permissionUpdateCallback = useCallback(
  (newPermContext, options) => {
    setAppState((prev) => ({
      ...prev,
      toolPermissionContext: {
        ...newPermContext,
        // If options.preserveMode, keep the existing mode; otherwise take the incoming mode.
        mode: options?.preserveMode ? prev.toolPermissionContext.mode : newPermContext.mode,
      },
    }));
    // After state update, re-evaluate any open permission prompts
    setImmediate((setRecheckQueue) => {
      setRecheckQueue((openPrompts) => {
        openPrompts.forEach((prompt) => prompt.recheckPermission());
        return openPrompts;
      });
      eventBus.emit();
    }, recheckQueueRef);
  },
  [setAppState, recheckQueueRef],
);

// Mapping: eJH→permissionUpdateCallback, _H→setAppState, j$→newPermContext, a$→options,
//          j8→prev, i9→recheckQueueRef, jt→eventBus
```

### How background agents use it

When `/bg` spawns a background agent, the spawn-side passes `{preserveMode: true}` so the agent inherits the parent's mode. The same applies when the agent's hook returns `permissionUpdates` — if the background agent calls `setMode`, we don't override the original mode unless the user explicitly wants to.

**Key insight:** This is the same pattern as `--resume` — modes are inherited explicitly, not silently. The default is "don't inherit"; the parent must opt in via `preserveMode`.

---

## 7. v2.1.141 — Open-Prompt Auto-Dismiss

**Pre-fix bug:** If a permission prompt was open and the user pressed Shift+Tab to switch to `acceptEdits`, the prompt stayed open even though the new mode would now allow the action. The user had to manually click "Allow" on a prompt that was now redundant.

**Fix:** The permission-update callback now calls `recheckPermission()` on every open prompt after a mode change. `recheckPermission()` re-runs the full chain — `tD` / `UA5` / classifier — with the new mode. If the new verdict is `allow`, the prompt closes automatically; if still `ask`, it stays.

The `setImmediate` deferral ensures state propagation completes before re-checking — otherwise the prompt would re-check against the old state.

### Why re-check, not "auto-allow"?

A simpler fix would be "if new mode is acceptEdits and prompt is for Edit, just allow." But this is fragile:

- The new mode might be `auto`, requiring a classifier call
- The new mode might be `plan`, which **blocks** the action
- A `deny` rule might still match independent of mode

Re-running the full chain handles all cases uniformly. The prompt closes only if the chain genuinely returns `allow`.

---

## 8. v2.1.110 — Hook `updatedInput` Re-Check

This is **not** a mode mutation but a related invariant: when a `PermissionRequest` hook returns `updatedInput` along with `permissionDecision: allow`, the deny rules are re-checked against the new input. See `architecture.md` step 7 and `oiH` (cli_inner_pretty.js:421627).

The invariant: **a hook cannot mutate input around a deny rule**. If the hook says allow + rewrites `rm /tmp` to `rm /etc`, the deny rule for `/etc` paths still fires.

---

## 9. v2.1.136 — Plan Mode Blocks Edit Even With Allow Rule

**Pre-fix bug:** When in `plan` mode, the user's `Edit(./src/**)` allow rule was being honored, letting Claude write to project files while supposedly in plan-only mode.

**Fix:** Plan mode is now a **floor** for write tools (Edit, Write, MultiEdit, NotebookEdit). Even if an allow rule matches, the per-tool `checkPermissions` returns `ask` with a `mode: plan` decision reason, which `UA5` short-circuits as the "plan_mode_floor" reason (see line 421918).

The agent loop renders this as "Plan mode active — confirm exit to plan mode before writing." The user must explicitly `ExitPlanMode` (which generates a plan summary) before writes are allowed.

---

## 10. Persistence Across Restart / Resume

The mode is **NOT** persisted across restart by default. Each session starts in:

1. `--permission-mode <m>` if specified
2. else `settings.permissions.defaultMode` if specified (and not a no-permitted-source like project/local for auto)
3. else `default`

For background agents in v2.1.142, `claude agents --permission-mode` is a new flag (see CHANGELOG 2.1.142 entry 1) — this lets dispatched bg sessions specify their own mode.

### v2.1.142 — `claude --bg --dangerously-skip-permissions` persistence fix

**Pre-fix bug:** `claude --bg --dangerously-skip-permissions` didn't persist the bypass across retire/wake. After the daemon retired the worker, waking it back up dropped the bypass flag.

**Fix:** The daemon now preserves `dangerouslySkipPermissions` in the wake-state so re-spawned workers keep the mode.

---

## 11. Mode Mutation Invariants (Summary)

After v2.1.142, the invariant set is:

1. **Per-call decisions never mutate mode.** Approving a single Bash call doesn't put the session in acceptEdits.
2. **Mode is mutated only by:** Shift+Tab, slash command, CLI flag, hook setMode update, plan entry/exit.
3. **Allow rules don't override mode.** Plan-mode write block, dontAsk mode deny — these can't be relaxed by an `allow` rule.
4. **Hook mutations are re-validated.** `updatedInput` re-runs the deny chain (v2.1.110).
5. **Resume doesn't restore mode** unless `--permission-mode` is passed (v2.1.132).
6. **Background agents inherit mode** when launched via `/bg`/`←←` (v2.1.141 `preserveMode`).
7. **Open prompts re-evaluate** on mode change (v2.1.141 `recheckPermission`).
8. **Sub-process env scrub forces default** (a hardening, not a normal user flow).
9. **Bypass mode is session-scoped** — never persisted as a saved `defaultMode`.

These invariants make "what mode am I in?" a precisely-answerable question across the whole session lifetime.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission_arch.md`](../00_overview/symbol_additions_v2_1_142_permission_arch.md) — Symbols introduced/used in this document

Key functions and constants in this document:
- `PERMISSION_MODES` (`tN`) — Six-mode constant array (cli_inner_pretty.js:48447)
- `EXTERNAL_PERMISSION_MODES` (`Uo`) — Same set, external API name
- `INTERNAL_PERMISSION_MODES` (`QMq`) — Same set, internal alias
- `normalizePermissionMode` (`Rv`) — Sanitize unknown mode strings → "default" (cli_inner_pretty.js:48473)
- `initialPermissionModeFromCLI` (`zR6`) — Entry point that calls `rgK` with env scrub override (cli_inner_pretty.js:422449)
- `resolvePermissionModeFromSources` (`rgK`) — Priority resolver: CLI > env > settings > agent (cli_inner_pretty.js:198981)
- `isAutoCircuitBreakerOpen` (`$t1`) — Live check for auto-mode disablement (cli_inner_pretty.js)
- `permissionUpdateCallback` (`eJH`) — Apply rule/mode changes; preserveMode option (cli_inner_pretty.js:580705)
- `stripDangerousPermissionsForAutoMode` (`pe`/`stripDangerousRules`) — Removes high-risk rules entering auto mode
- `restoreDangerousPermissions` — Re-installs the stripped rules on exit from auto
- `isSubprocessEnvScrubEnabled` (`aW`) — Hardening flag check (cli_inner_pretty.js:197361)
- `isAutoModeGateEnabled` — Live gate for auto-mode availability
- `cyclePermissionMode` (2.1.88 TS reference) — Compute next + transition
- `getNextPermissionMode` (2.1.88 TS reference) — Shift+Tab successor
- `transitionPermissionMode` — Apply mode change with side-effects (strip/restore rules, prePlanMode stash)
