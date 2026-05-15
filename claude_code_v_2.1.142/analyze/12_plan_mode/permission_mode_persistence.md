# Permission Mode Persistence — v2.1.142 Deltas

> This document captures the three v2.1.119/132/136 changelog entries that altered plan-mode behavior in v2.1.142. Each section dissects the bug, the fix mechanism, and the code locations.

---

## Three Bugs Fixed

| Version | Changelog entry | Section |
|---------|-----------------|---------|
| 2.1.119 | "Fixed `/plan` and `/plan open` not acting on the existing plan when entering plan mode" | [§1](#1-v21119-plan-and-plan-open-acts-on-existing-plan) |
| 2.1.132 | "Fixed `--permission-mode` flag being ignored when resuming a plan-mode session with `-p --continue`/`--resume`, and plan mode not being re-applied after `ExitPlanMode` within the same session" | [§2](#2-v21132-permission-mode-flag-on-resume) and [§3](#3-v21132-plan-mode-re-applied-after-exitplanmode) |
| 2.1.136 | "Fixed plan mode not blocking file writes when a matching `Edit(...)` allow rule exists" | [§4](#4-v21136-plan-mode-floor-for-file-writes) |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) — Symbol discoveries for this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Plan Mode section
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Permissions

Key functions in this document:
- `planSlashCommandHandler` (obfuscated: `Wv5`) - `/plan` command, `cli_inner_pretty.js:483806-483854`
- `getPlanSlugForSession` (obfuscated: `haH`) - non-creating slug accessor, `cli_inner_pretty.js:517648-517650`
- `restoreFromTranscriptPermissionMode` (obfuscated: `ur5`) - resume filter, `cli_inner_pretty.js:564219-564229`
- `sessionRestore` (obfuscated: `nZ8`) - session-restore body, `cli_inner_pretty.js:564282-564344`
- `initialPermissionModeFromCLI` (obfuscated: `zR6`) - CLI-derived initial mode, `cli_inner_pretty.js:422449-422468`
- `checkWritePermissionForTool` (obfuscated: `VkH`) - write-permission gate, `cli_inner_pretty.js:518202-518286`
- `isPlanModeFloorReason` (obfuscated: `d64`) - decision-reason classifier, `cli_inner_pretty.js:421723-421725`
- `setPermissionModeWithGuards` (obfuscated: `dA5`) - mode setter with guard chain, `cli_inner_pretty.js:422400-422438`
- `transitionPermissionMode` (obfuscated: `tHH`) - mode-transition helper, `cli_inner_pretty.js:422385-422398`

---

## 1. v2.1.119: `/plan` and `/plan open` Acts on Existing Plan

### The Bug

Before v2.1.119, the `/plan` slash command would always print "Enabled plan mode" — even if the user was already in plan mode with an existing plan file. `/plan open` would only work if you were not in plan mode (it would print "Enabled plan mode" first and skip the open). Users couldn't quickly view or open their current plan via slash command.

### The Fix

The `/plan` handler (`Wv5`) now branches on three states:

1. **Not in plan mode**: enter plan mode. If `/plan` was given an argument (treated as a query or "open"), continue. If `/plan` was given no argument and no slug exists yet, print "Enabled plan mode" and stop.
2. **Already in plan mode**: skip the mode-transition.
3. **Plan file exists**: render it (default) or open in `$EDITOR` (with `open` subcommand).

### Source

```javascript
// ============================================
// planSlashCommandHandler - /plan command with subcommand routing
// Location: cli_inner_pretty.js:483806-483854
// ============================================

// ORIGINAL (for source lookup):
async function Wv5(H, $, q) {
  let { getAppState: K, setAppState: _ } = $,
    z = K().toolPermissionContext.mode,
    Y = Gf();
  if (Y?.kind === "ccr") {
    if (z !== "plan")
      (Oo(z, "plan"),
        _((L) => ({
          ...L,
          toolPermissionContext: Qz(UkH(L.toolPermissionContext), { type: "setMode", mode: "plan", destination: "session" }),
        })),
        Y.sendControlRequest({ subtype: "set_permission_mode", mode: "plan" }),
        H("Enabled plan mode"));
    else H("Already in plan mode.");
    return null;
  }
  let f = z !== "plan";
  if (f) {
    (Oo(z, "plan"),
      _((P) => ({
        ...P,
        toolPermissionContext: Qz(UkH(P.toolPermissionContext), { type: "setMode", mode: "plan", destination: "session" }),
      })));
    let L = q.trim();
    if (L && L !== "open") return (H("Enabled plan mode", { shouldQuery: !0 }), null);
    if (!haH()) return (H("Enabled plan mode"), null);
  }
  let O = HW(), M = v2();
  if (!O) return (H(f ? "Enabled plan mode" : "Already in plan mode. No plan written yet."), null);
  if (q.trim().split(/\s+/)[0] === "open") {
    let L = await AS(M);
    if (L.error) H(L.error);
    else H(`Opened plan in editor: ${M}`);
    return null;
  }
  let D = xy(),
    j = D ? cD(D) : void 0,
    X = await UT7(n0.createElement(Pv5, { planContent: O, planPath: M, editorName: j }));
  return (H(X), null);
}

// READABLE (for understanding):
async function planSlashCommandHandler(printOutput, context, argv) {
  const { getAppState, setAppState } = context;
  const mode = getAppState().toolPermissionContext.mode;
  const remoteBridge = getRemoteControlBridge();

  // Branch 1: CCR session — propagate via control_request
  if (remoteBridge?.kind === 'ccr') {
    if (mode !== 'plan') {
      handlePlanModeTransition(mode, 'plan');
      setAppState(prev => ({
        ...prev,
        toolPermissionContext: applyPermissionUpdate(
          prepareContextForPlanMode(prev.toolPermissionContext),
          { type: 'setMode', mode: 'plan', destination: 'session' }
        ),
      }));
      remoteBridge.sendControlRequest({ subtype: 'set_permission_mode', mode: 'plan' });
      printOutput('Enabled plan mode');
    } else {
      printOutput('Already in plan mode.');
    }
    return null;
  }

  // Branch 2: local session
  const wasNotInPlanMode = mode !== 'plan';
  if (wasNotInPlanMode) {
    handlePlanModeTransition(mode, 'plan');
    setAppState(prev => ({
      ...prev,
      toolPermissionContext: applyPermissionUpdate(
        prepareContextForPlanMode(prev.toolPermissionContext),
        { type: 'setMode', mode: 'plan', destination: 'session' }
      ),
    }));
    const arg = argv.trim();
    // Arg present and not "open": treat as a query that should kick off planning
    if (arg && arg !== 'open') {
      printOutput('Enabled plan mode', { shouldQuery: true });
      return null;
    }
    // No prior slug = no existing plan to render
    if (!getPlanSlugForSession()) {
      printOutput('Enabled plan mode');
      return null;
    }
  }

  // We're now in plan mode (either by entry or already). Read the disk plan.
  const planContent = getPlan();
  const planPath = getPlanFilePath();
  if (!planContent) {
    printOutput(wasNotInPlanMode ? 'Enabled plan mode' : 'Already in plan mode. No plan written yet.');
    return null;
  }

  // "/plan open" subcommand: launch the user's editor
  if (argv.trim().split(/\s+/)[0] === 'open') {
    const result = await openInEditor(planPath);
    if (result.error) printOutput(result.error);
    else printOutput(`Opened plan in editor: ${planPath}`);
    return null;
  }

  // Default: render the plan in an Ink dialog
  const editor = getEditor();
  const editorName = editor ? getEditorDisplayName(editor) : undefined;
  const rendered = await renderInkComponent(React.createElement(PlanPreviewComponent, {
    planContent, planPath, editorName,
  }));
  printOutput(rendered);
  return null;
}

// Mapping: Wv5→planSlashCommandHandler, H→printOutput, $→context, q→argv,
//          K→getAppState, _→setAppState, z→mode, Y→remoteBridge, f→wasNotInPlanMode,
//          L→arg/result, O→planContent, M→planPath, D→editor, j→editorName, X→rendered,
//          Gf→getRemoteControlBridge, Oo→handlePlanModeTransition,
//          UkH→prepareContextForPlanMode, Qz→applyPermissionUpdate,
//          haH→getPlanSlugForSession, HW→getPlan, v2→getPlanFilePath,
//          AS→openInEditor, xy→getEditor, cD→getEditorDisplayName,
//          UT7→renderInkComponent, Pv5→PlanPreviewComponent
```

### Algorithm: 3-State Branching

**What it does:** The handler decides what to do based on three dimensions:

1. **Mode**: currently `plan` or not?
2. **Argument**: empty, `open`, or other text?
3. **Plan presence**: does a plan file exist for the current session?

**Decision matrix:**

| Mode | Arg | Plan Exists | Action |
|------|-----|-------------|--------|
| `plan` | empty | no | "Already in plan mode. No plan written yet." |
| `plan` | empty | yes | Render plan in Ink dialog |
| `plan` | `open` | no | "Already in plan mode. No plan written yet." |
| `plan` | `open` | yes | Launch `$EDITOR` on plan file |
| `plan` | other | n/a | (treated same as empty for plan-presence branches) |
| non-plan | empty | n/a (no slug yet) | Enter plan mode, "Enabled plan mode" |
| non-plan | empty | yes (resumed session) | Enter plan mode, render plan |
| non-plan | `open` | yes (resumed session) | Enter plan mode, launch editor |
| non-plan | other | n/a | Enter plan mode, kick off planning with the arg as the prompt seed |

**Why these branches:**
- The "kick off planning" branch (`arg && arg !== 'open'`) interprets `/plan add login flow` as "enter plan mode + start planning the login flow". The `shouldQuery: true` option signals the REPL to immediately submit the arg as a user message.
- The `haH()` check (`getPlanSlugForSession`) is non-creating: it returns the cached slug if one exists, otherwise undefined. This is the key v2.1.119 addition — distinguishing "session has a plan file" from "session is in plan mode but has no plan yet".
- The CCR branch is separate because remote sessions need the `set_permission_mode` control_request to propagate the mode change.

**Key insight:** Prior to v2.1.119, the handler unconditionally returned "Enabled plan mode" after entering plan mode. The fix is the `haH()` check + the plan rendering branch. This lets users use `/plan` mid-session to view their plan without re-entering plan mode (the most common case).

---

## 2. v2.1.132: `--permission-mode` Flag on Resume

### The Bug

When the user invoked `claude --resume <id> --permission-mode plan` or `claude --continue --permission-mode acceptEdits` with a transcript whose stored mode was incompatible (especially `plan`), the CLI flag was silently ignored. The session would start in the transcript's saved mode (or default), not the CLI-requested mode.

This was particularly painful for plan-mode sessions: a user wanted to resume a session and re-enter plan mode, but the resume path dropped the `plan` mode from the transcript (saved modes `plan` and `bypassPermissions` are always dropped — see `ur5`), so they ended up in `default`. Their `--permission-mode plan` flag was supposed to fix that, but it didn't take effect.

### The Fix

The fix introduces `permissionModeCliSet`, a boolean threaded from the top-level CLI argument parser into the session-restore helpers. When `permissionModeCliSet === true`, `ur5` returns `undefined` (don't restore from transcript), letting the CLI-derived mode (computed by `zR6`) win.

### Source: `permissionModeCliSet` Threading

```javascript
// ============================================
// Argument-set detection - Threads permissionModeCliSet through resume
// Location: cli_inner_pretty.js:607273
// ============================================

// ORIGINAL (for source lookup):
ZG = {
  modeApi: zKA,
  mainThreadAgentDefinition: t6,
  agentDefinitions: Y6,
  currentCwd: x8,
  cliAgents: Eq,
  initialState: kM,
  permissionModeCliSet: P !== void 0 || Boolean(w),
};
// ... later:
if (z.continue) { ...let ZK = await nZ8(WK, opts, ZG); ... }
else if (z.resume || z.fromPr || _H || DH !== null) { ... }

// READABLE (for understanding):
const restoreGlobals = {
  modeApi,
  mainThreadAgentDefinition,
  agentDefinitions,
  currentCwd,
  cliAgents,
  initialState,
  // `P` = --permission-mode flag value (undefined if not passed)
  // `w` = --dangerously-skip-permissions flag (Boolean)
  // permissionModeCliSet is true iff either flag was explicitly set
  permissionModeCliSet: cliPermissionModeFlag !== undefined || Boolean(dangerouslySkipPermissionsFlag),
};

// Mapping: ZG→restoreGlobals, P→cliPermissionModeFlag, w→dangerouslySkipPermissionsFlag,
//          z→cliFlags, t6→mainThreadAgentDefinition, Y6→agentDefinitions, x8→currentCwd,
//          Eq→cliAgents, kM→initialState, zKA→modeApi, nZ8→sessionRestore
```

### Source: `ur5` (the resume filter)

```javascript
// ============================================
// restoreFromTranscriptPermissionMode - Resume-time mode filter (v2.1.132 fix)
// Location: cli_inner_pretty.js:564219-564229
// ============================================

// ORIGINAL (for source lookup):
async function ur5(H, $) {
  if ($ || !H) return;
  let q = Rv(H);
  if (q === "default" && H !== "default") return;
  if (q === "plan" || q === "bypassPermissions") return;
  if (q === "default") return;
  if (q === "auto") {
    let { isAutoModeGateEnabled: K } = await Promise.resolve().then(() => (JX(), x38));
    if (!K()) return;
  }
  return q;
}

// READABLE (for understanding):
async function restoreFromTranscriptPermissionMode(transcriptMode, permissionModeCliSet) {
  // CLI flag set OR no transcript mode → don't restore (CLI wins, or nothing to restore)
  if (permissionModeCliSet || !transcriptMode) return undefined;
  // Validate transcript mode is recognized
  const validated = validatePermissionMode(transcriptMode);
  // If validation downgraded to 'default' but transcript wasn't 'default': skip restore
  if (validated === 'default' && transcriptMode !== 'default') return undefined;
  // Plan and bypassPermissions are SESSION-LOCAL; do not restore on resume
  if (validated === 'plan' || validated === 'bypassPermissions') return undefined;
  // Restored default == default: redundant, skip
  if (validated === 'default') return undefined;
  // Auto: only restore if gate is still enabled
  if (validated === 'auto') {
    const { isAutoModeGateEnabled } = await import('./permissionSetup.js');
    if (!isAutoModeGateEnabled()) return undefined;
  }
  return validated;
}

// Mapping: ur5→restoreFromTranscriptPermissionMode, H→transcriptMode, $→permissionModeCliSet,
//          q→validated, K→isAutoModeGateEnabled, Rv→validatePermissionMode, JX/x38→permissionSetupModule
```

### Algorithm: Resume Mode Resolution

**What it does:** Decides whether to restore the transcript's saved permission mode on resume, returning the mode to apply (or `undefined` to skip).

**How it works (step by step):**

1. **CLI-flag preemption (THE v2.1.132 FIX)**: `if (permissionModeCliSet || !transcriptMode) return undefined;`
   - When the user passed `--permission-mode <mode>` (or `--dangerously-skip-permissions`), `permissionModeCliSet` is true. We bail immediately so the CLI value (computed by `zR6`) takes effect.
   - If there's no transcript mode (fresh session-style restore), nothing to restore.
2. **Mode validation**: `Rv(H)` validates the saved mode against the known set (`acceptEdits`, `auto`, `bypassPermissions`, `default`, `dontAsk`, `plan`). Unknown values get downgraded to `default`.
3. **Default-downgrade rejection**: if validation downgraded a non-default value to `default`, skip restoration. This is the "I don't know what mode you meant, so I'm not going to silently downgrade" branch.
4. **Session-local skip**: `plan` and `bypassPermissions` are not restored. Plan is session-local (it represents an active workflow phase, not a persistent preference). bypassPermissions is gated on the `--dangerously-skip-permissions` CLI flag and must NOT be quietly re-entered just because a prior session was in it.
5. **Redundant `default`**: if the restored mode equals the default initialization, skip (no need to layer a mode-set update on top of an already-default context).
6. **Auto-mode gate**: if the saved mode is `auto`, double-check the auto-mode gate is still enabled. If not (e.g. user lost Claude Max), skip — they'd otherwise see an unfriendly "auto mode unavailable" error.
7. Else return the validated mode for application.

**Why CLI flag preemption is the right place:**
- The CLI permission mode is computed by `zR6` (`initialPermissionModeFromCLI`) which already handles the CLI + env + settings layering. Resume should not override that. The `permissionModeCliSet` flag is the explicit user intent that the CLI value matters.
- Without preemption, the resume path would silently fall through to the transcript value, undoing the CLI's effort.

**Why plan/bypassPermissions are session-local:**
- `plan`: represents an in-flight planning workflow. After a resume, the user might want to continue planning (so they'd pass `--permission-mode plan` explicitly) or might want to exit plan mode. Defaulting to plan would be presumptuous.
- `bypassPermissions`: explicitly requires `--dangerously-skip-permissions` flag at session launch. Silently re-entering it on resume bypasses this safety check.

**Trade-off:** A user who genuinely wants to continue a plan-mode session on resume must pass `--permission-mode plan` explicitly. This is the v2.1.132 fix — make `--permission-mode plan` actually work in that scenario.

### Source: `sessionRestore` (`nZ8`) Mode Application

```javascript
// Excerpt from cli_inner_pretty.js:564294-564306:
let { agentDefinition: _, agentType: A } = SyH(H.agentSetting, q.mainThreadAgentDefinition, q.agentDefinitions),
  z = await ur5(H.permissionMode, q.permissionModeCliSet),  // ← the v2.1.132 fix entry point
  Y = mr5(H.messages, q.initialState.mainLoopModel);
if (Y) bG(Y);
let f;
if (z) {
  let { transitionPermissionMode: X } = await Promise.resolve().then(() => (JX(), x38)),
    L = q.initialState.toolPermissionContext;
  try {
    f = { ...X(L.mode, z, L), mode: z };
  } catch (P) {
    N(`[sessionRestore] transitionPermissionMode rejected restored mode '${z}': ${P}`);
  }
}
// ...
initialState: {
  ...J,
  initialMessage: j,
  // ...
  ...(f && { toolPermissionContext: f }),  // ← apply restored mode only when ur5 returned a value
  agentDefinitions: D,
},
```

When `ur5` returns `undefined` (the CLI-flag preemption path), `f` stays undefined and `toolPermissionContext: f` is omitted from the spread. The CLI's pre-computed `initialState.toolPermissionContext` (built by `zR6` upstream) remains intact.

### Algorithm: `transitionPermissionMode` Safety Net

When `ur5` returns a value, `nZ8` applies it via `transitionPermissionMode` (the obfuscated `tHH`):

```javascript
// At cli_inner_pretty.js:422385-422398:
function tHH(H, $, q, K) {
  // ... mode-transition logic that strips/restores dangerous rules, handles auto-mode gate, etc.
}
```

This wraps the restoration in the same safety net as a runtime mode-change (dangerous-rule strip/restore symmetry, auto-mode gate check). If the saved mode would violate a current constraint (e.g. auto mode but gate now off), the helper logs an error and bails — `nZ8` catches the throw and leaves the context unchanged.

This double-defense (filter at `ur5` + safety net at `tHH`) means CLI-flag preemption is the *first* line; even if `ur5` had a bug, `tHH` would still reject an unsafe restoration.

### Telemetry

The deferred-tool resume path warns when the restored mode mismatches:

```javascript
// At cli_inner_pretty.js:277311-277315:
if (A !== H.permissionMode)
  N(
    `Deferred tool resume: permissionMode mismatch (deferred under '${H.permissionMode}', resuming under '${A}'). --resume does not restore permissionMode — pass --permission-mode ${H.permissionMode} to match.`,
    { level: "warn" }
  );
```

This warning is the user-facing observability: it tells them when a deferred tool (one announced under a different mode) is resuming under a new mode. The actionable advice ("pass `--permission-mode ${H.permissionMode}`") was added in v2.1.132 to match the new flag behavior.

---

## 3. v2.1.132: Plan Mode Re-Applied After ExitPlanMode

### The Bug

A user enters plan mode, the model writes a plan and calls `ExitPlanMode`. The user approves. The mode is restored to e.g. `default`. The user later asks the model to start another plan (via `/plan` or via the model calling `EnterPlanMode` again). The expectation: the new `EnterPlanMode` call re-applies plan-mode state cleanly. The pre-v2.1.132 reality: the re-entry might silently no-op or produce inconsistent state, because:

- `setToolPermissionContext` could short-circuit if `prev === computed-next` after the first restoration.
- The attachment loop (`d65`) might not refresh its understanding of plan-mode if it had cached state from the prior cycle.
- `prePlanMode` was cleared on exit but `hasExitedPlanMode` flag remained set, so the re-entry attachment fired but the standard plan-mode reminder didn't refresh.

### The Fix

Three coordinated changes:

1. **`Oo` (handlePlanModeTransition)**: ensure the flag flip always happens, regardless of prior state.
2. **`UkH` (prepareContextForPlanMode)**: idempotent early-exit when already in plan, otherwise always produce a fresh context object.
3. **`d65` (buildPlanModeAttachment)**: detect re-entry via `HH$()` and emit `plan_mode_reentry` attachment carrying the previous plan path.

### Source: Three Coordinated Functions

```javascript
// ============================================
// Oo - handlePlanModeTransition (always emits flag flip)
// Location: cli_inner_pretty.js:2961-2964
// ============================================

// ORIGINAL (for source lookup):
function Oo(H, $) {
  if ($ === "plan" && H !== "plan") U$.needsPlanModeExitAttachment = !1;
  if (H === "plan" && $ !== "plan") U$.needsPlanModeExitAttachment = !0;
}

// READABLE (for understanding):
function handlePlanModeTransition(prevMode, nextMode) {
  // Entering plan: clear the exit-attachment so the re-entry doesn't see a stale exit notice
  if (nextMode === 'plan' && prevMode !== 'plan') {
    U$.needsPlanModeExitAttachment = false;
  }
  // Leaving plan: queue the exit attachment for next turn
  if (prevMode === 'plan' && nextMode !== 'plan') {
    U$.needsPlanModeExitAttachment = true;
  }
}

// Mapping: Oo→handlePlanModeTransition, H→prevMode, $→nextMode
```

```javascript
// ============================================
// UkH - prepareContextForPlanMode (idempotent re-entry guard)
// Location: cli_inner_pretty.js:422720-422735
// ============================================

// ORIGINAL (for source lookup):
function UkH(H) {
  let $ = H.mode;
  if ($ === "plan") return H;  // ← idempotent re-entry guard
  // ... rest of body handles auto-mode interaction
}

// READABLE (for understanding):
function prepareContextForPlanMode(ctx) {
  const prevMode = ctx.mode;
  if (prevMode === 'plan') return ctx;  // already in plan; nothing to prepare
  // ... handle auto-mode interaction, strip dangerous rules, etc.
}

// Mapping: UkH→prepareContextForPlanMode, H→ctx, $→prevMode
```

```javascript
// ============================================
// d65 - buildPlanModeAttachment (re-entry detection)
// Location: cli_inner_pretty.js:397726-397748 (excerpt)
// ============================================

// ORIGINAL (for source lookup):
async function d65(H, $, q, K) {
  if (q.getAppState().toolPermissionContext.mode !== "plan") return [];
  // ... cadence check ...
  PDH(v$(), K?.planSlugSeed ?? H ?? void 0);
  let z = v2(q.agentId), Y = HW(q.agentId), f = [];
  // RE-ENTRY DETECTION: HH$() = hasExitedPlanMode (sticky flag from prior exit)
  if (HH$() && Y !== null) (f.push({ type: "plan_mode_reentry", planFilePath: z }), OT(!1));
  // ... append standard plan_mode attachment ...
  return f;
}

// READABLE (for understanding):
// At line cli_inner_pretty.js:397736:
if (hasExitedPlanModeInSession() && planContent !== null) {
  attachments.push({ type: 'plan_mode_reentry', planFilePath });
  setHasExitedPlanMode(false);  // one-shot
}

// Mapping: d65→buildPlanModeAttachment, HH$→hasExitedPlanModeInSession,
//          OT→setHasExitedPlanMode, Y→planContent, z→planFilePath
```

### Algorithm: Re-entry Coordination

**What it does:** Coordinates three pieces of state so that `EnterPlanMode` (or `/plan`) after a prior `ExitPlanMode` results in a clean plan-mode resumption.

**How it works:**

1. **At `ExitPlanMode` time** (`call` body, `cli_inner_pretty.js:381773`): `OT(true)` sets `hasExitedPlanMode = true`. `qh(true)` sets `needsPlanModeExitAttachment = true`. Mode goes to `prePlanMode ?? 'default'`.
2. **At re-entry** (`EnterPlanMode.call` or `/plan`): `Oo(prevMode, 'plan')` is called with `prevMode = 'default'` and `nextMode = 'plan'`. This:
   - Clears `needsPlanModeExitAttachment = false` (the queued exit attachment from the prior cycle).
   - (The opposite branch — `prevMode === 'plan' && nextMode !== 'plan'` — does not fire here.)
3. **`UkH` idempotence**: if somehow `prevMode === 'plan'` (corner case), the guard returns early; otherwise the standard auto-mode-handling path runs.
4. **State update**: `setToolPermissionContext(prev => applyPermissionUpdate(UkH(prev), { setMode plan, session }))`. The `applyPermissionUpdate` is always called; even if the result equals `prev` in shape, React's `setState` doesn't actually re-render unless the reducer returns a different object reference, and `applyPermissionUpdate` always returns a fresh object.
5. **First attachment turn after re-entry**:
   - `d65` checks mode === `plan` (yes).
   - Calls `PDH(sessionId, seed)` — but the slug is already cached from the prior cycle, so it returns the same slug.
   - Reads plan content via `HW()`. The plan file from the prior cycle still exists.
   - `HH$()` returns true (sticky from `OT(true)` at prior exit).
   - Both conditions true → emit `plan_mode_reentry` attachment carrying the prior `planFilePath`.
   - `OT(false)` resets the sticky flag. Future attachment cycles will NOT re-emit the re-entry attachment.
   - Standard `plan_mode` attachment is also appended.

**Why three pieces?**
- Single-piece fixes wouldn't work: just fixing `Oo` doesn't refresh the attachment; just fixing the attachment doesn't clear stale exit flags; just fixing `UkH` doesn't surface the existing plan to the model.
- The coordination ensures (a) the model is told "you re-entered plan mode and have an existing plan to work with", (b) no stale "you exited" reminder confuses the next turn, and (c) the slug + plan file consistency is preserved.

**Key insight:** The `OT(false)` reset inside `d65` is one-shot per re-entry event. If the user exits plan, re-enters, the re-entry attachment fires ONCE; subsequent turns in the same re-entered session see only the standard `plan_mode` attachment. If they exit again and re-enter, `OT(true)` is set on the second exit, then cleared again on the second re-entry.

---

## 4. v2.1.136: Plan-Mode Floor for File Writes

### The Bug

Before v2.1.136, the permission check order was:

1. deny rules
2. memory toggle
3. internal editable paths (plan file bypass)
4. safety checks
5. `acceptEdits` mode → allow
6. **allow rules → allow** ← This bypassed plan mode!
7. default ask

The allow-rule check at step 6 would happily approve a `Write` to e.g. `~/code/src/login.ts` if the user had `Edit(~/code/src/**)` in their settings — even when the mode was `plan` and the model should be read-only. The model could write to user-allowed paths during plan-mode "research", silently violating the read-only contract.

### The Fix

A new "plan-mode floor" check is inserted at step 5.5 (between safety checks and acceptEdits/allow-rule consultation):

```javascript
// ============================================
// checkWritePermissionForTool - Plan-mode floor (NEW in v2.1.136)
// Location: cli_inner_pretty.js:518269-518274
// ============================================

// ORIGINAL (for source lookup):
// ... within VkH(H, $, q, K), after safety checks at line ~518268:
if (q.mode === "plan")
  return {
    behavior: "ask",
    message: `Cannot write to ${_} while in plan mode.`,
    decisionReason: { type: "mode", mode: "plan" },
  };
let M = GI(_, q, A);
if (q.mode === "acceptEdits" && M)
  return { behavior: "allow", updatedInput: $, decisionReason: { type: "mode", mode: q.mode } };
let w = wy4(A, q, "edit");
if (w) return { behavior: "allow", updatedInput: $, decisionReason: { type: "rule", rule: w } };
// ... default ask ...

// READABLE (for understanding):
// Within checkWritePermissionForTool(tool, input, ctx, precomputedPaths):
// Step 5: safety checks have passed.
// Step 5.5 (NEW): plan-mode floor — block all writes while in plan mode.
if (ctx.mode === 'plan') {
  return {
    behavior: 'ask',
    message: `Cannot write to ${path} while in plan mode.`,
    decisionReason: { type: 'mode', mode: 'plan' },
  };
}
// Step 6: acceptEdits mode allows writes in working dir
const isInWorkingDir = pathInAllowedWorkingPath(path, ctx, pathsToCheck);
if (ctx.mode === 'acceptEdits' && isInWorkingDir) {
  return { behavior: 'allow', updatedInput: input, decisionReason: { type: 'mode', mode: ctx.mode } };
}
// Step 7: allow rules (now only reached when NOT in plan mode)
const allowRule = matchingRuleForInput(path, ctx, 'edit', 'allow');
if (allowRule) {
  return { behavior: 'allow', updatedInput: input, decisionReason: { type: 'rule', rule: allowRule } };
}
// Step 8: default ask...

// Mapping: q→ctx, _→path, $→input, A→pathsToCheck, M→isInWorkingDir, w→allowRule,
//          GI→pathInAllowedWorkingPath, wy4→matchingRuleForInput
```

### Source: `d64` (Decision-Reason Classifier)

```javascript
// ============================================
// d64 - isPlanModeFloorReason (NEW in v2.1.136)
// Location: cli_inner_pretty.js:421723-421725
// ============================================

// ORIGINAL (for source lookup):
function d64(H) {
  return H?.type === "mode" && H.mode === "plan";
}

// READABLE (for understanding):
function isPlanModeFloorReason(decisionReason) {
  return decisionReason?.type === 'mode' && decisionReason.mode === 'plan';
}

// Mapping: d64→isPlanModeFloorReason, H→decisionReason
```

This predicate is used by the auto-mode classifier dispatcher (`tD`, `cli_inner_pretty.js:421879-421970`) to detect when the floor fired:

```javascript
// At cli_inner_pretty.js:421900-421923 (excerpt):
let Y = RQ(A.decisionReason, (Z) => !Z.classifierApprovable),
  f = A.decisionReason?.type === "sandboxOverride",
  O = dw8(A.decisionReason),         // ask-rule detected
  M = H.mcpInfo?.effectiveMaxPermission === "ask",
  w = d64(A.decisionReason);          // PLAN-MODE FLOOR detected ← NEW
if (Y || f || O || M || w) {
  // ... fallback to ask path ...
  if (Y || O || M || w)
    return (
      d("tengu_auto_mode_fallback_to_ask", {
        reason: Y ? "safety_check" : O ? "ask_rule" : w ? "plan_mode_floor" : "org_ask_ceiling",
        toolName: r7(H.name),
      }),
      A
    );
}
```

When `d64(decisionReason) === true`, the auto-mode classifier:

1. Emits `tengu_auto_mode_fallback_to_ask` with `reason: "plan_mode_floor"`. This is the analytics signal that plan-mode actively blocked a write.
2. Falls back to the standard ask flow (no classifier fast-paths).

This ensures **auto-mode cannot bypass plan-mode floor** either. Even if the user is in plan mode and has auto-mode active (`shouldPlanUseAutoMode`), the floor blocks writes.

### Algorithm: Order Matters

**What it does:** The order of permission checks ensures plan mode is enforced regardless of allow rules.

**Step by step (new order):**

1. **Deny rules**: blanket deny still wins.
2. **Memory toggle**: `Cannot write to memory while it is toggled off.` (orthogonal).
3. **`.claude/**` session allow**: bypasses safety checks for user-scoped writes — but **`q.mode !== "plan"`** guard prevents this in plan mode (NEW guard at `cli_inner_pretty.js:518234`).
4. **Ask rules**: surface for user approval if matched.
5. **Internal editable paths**: plan file path bypass (`iUH`).
6. **Safety checks**: dangerous file patterns, Claude config, etc.
7. **PLAN-MODE FLOOR (NEW)**: `if (mode === 'plan') return ask`. Decision reason `{ type: 'mode', mode: 'plan' }`.
8. **`acceptEdits` mode**: allow in working dir.
9. **Allow rules**: now only reachable when mode is NOT plan.
10. **Default ask**.

**Why between safety and acceptEdits/allow?**
- Safety checks must run first (regardless of mode). A Windows-pattern unsafe path should never be writable, plan-mode or otherwise.
- The internal-path bypass (step 5) runs before the floor so the **plan file itself** is still writable. The model writes its plan to `${plansDir}/${slug}.md`, which is an internal path. The floor doesn't apply.
- Putting the floor BEFORE allow rules is the key fix. Pre-v2.1.136 the floor wasn't there; allow rules fired and bypassed plan mode.

**Why "ask" and not "deny"?**
- The user might want to manually approve a write during plan mode (e.g., "I know this is plan mode but I really need to write this one file"). Returning "ask" surfaces the dialog. The user can approve or reject.
- "Deny" would force a model reaction (the model would have to explain why it failed and ask the user to switch modes). "Ask" is more user-friendly.
- The `decisionReason: { type: 'mode', mode: 'plan' }` lets downstream consumers know exactly why the ask was triggered — useful for telemetry and for the auto-mode classifier's fast-path skip.

### Side Effect: `.claude/**` allow exclusion in plan mode

The `.claude/**` session-allow bypass at `cli_inner_pretty.js:518226-518237` is itself gated on `q.mode !== "plan"`:

```javascript
let Y = yL(_, { ...q, alwaysAllowRules: { session: q.alwaysAllowRules.session ?? [] } }, "edit", "allow");
if (Y) {
  let D = Y.ruleValue.ruleContent;
  if (
    D &&
    (D.startsWith(si$.slice(0, -2)) || D.startsWith(ti$.slice(0, -2))) &&
    !D.includes("..") &&
    D.endsWith("/**") &&
    q.mode !== "plan"  // ← NEW gate in v2.1.142
  )
    return { behavior: "allow", updatedInput: $, decisionReason: { type: "rule", rule: Y } };
}
```

This is the second instance of the v2.1.136 fix: even the `.claude/**` allow bypass (which previously would allow writes to `.claude/skills/...`) is now blocked in plan mode. Users wanting to write to their skill directories must exit plan mode first.

### Algorithm: Why also gate the `.claude/**` bypass?

**What it does:** Disables the `.claude/**` session-allow rule bypass when in plan mode.

**Why:** The bypass exists so users can grant session permission to edit their skill files (`/.claude/skills/foo/**`) without leaving plan mode. But if the user is in plan mode, they explicitly opted into read-only research. Allowing the bypass would violate that contract — even for `.claude/` files.

**Trade-off:** Users who need to edit a skill during a plan-mode session must exit plan first. This is the conservative read of "plan mode = read-only".

---

## Verification: Source Locations

To verify these fixes are actually in the v2.1.142 bundle, search:

```bash
# v2.1.119 /plan command fix:
grep -n "Already in plan mode" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# Expect: hit around line 483823 and 483843

# v2.1.132 --permission-mode resume fix:
grep -n "permissionModeCliSet" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# Expect: hits around 564219, 564294, 607273

# v2.1.132 deferred-tool warning:
grep -n "pass --permission-mode" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# Expect: hit around 277313

# v2.1.136 plan-mode floor:
grep -n "Cannot write to.*while in plan mode" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# Expect: hit at 518272

# v2.1.136 plan-mode floor analytics:
grep -n "plan_mode_floor" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# Expect: hit at 421918

# v2.1.136 .claude/** bypass gating:
grep -n 'q.mode !== "plan"' /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# Expect: hit at 518234
```

All six expected locations are present in v2.1.142.

---

## Summary Table

| Fix | Affected Function | Mechanism | Impact |
|-----|-------------------|-----------|--------|
| v2.1.119: `/plan` open | `Wv5` (planSlashCommandHandler) | New branching: check `haH()` for slug presence, render plan if exists, support `open` subcommand | UX: users can view/edit current plan via `/plan` |
| v2.1.132: --permission-mode resume | `ur5` (restoreFromTranscriptPermissionMode) + `permissionModeCliSet` threading | CLI flag preemption — `if (cliSet) return undefined` so CLI value wins | CLI flag now actually applies on resume |
| v2.1.132: re-entry after exit | `Oo`, `UkH`, `d65` coordination | Always emit state-change updates, idempotent UkH, detect re-entry via HH$() | Re-entering plan mode after exit works reliably |
| v2.1.136: write floor | `VkH` (checkWritePermissionForTool) | New "plan-mode floor" check between safety and allow-rules, plus `q.mode !== "plan"` gating on `.claude/**` bypass, plus `d64` classifier in auto-mode dispatch | `Edit(...)` allow rules and auto-mode classifier cannot bypass plan-mode read-only |

---

## Related

- [implementation.md](./implementation.md) — overall lifecycle including these fixes
- [enter_plan_mode_tool.md](./enter_plan_mode_tool.md) — the tool that re-entry uses
- [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) — the tool that produces the exit state
- [approval_flow.md](./approval_flow.md) — user dialog flow + auto-mode interaction
- [hooks_integration.md](./hooks_integration.md) — how hooks interact with the new floor
- [cross_validation.md](./cross_validation.md) — v2.1.88 source ↔ v2.1.142 obfuscated mapping
