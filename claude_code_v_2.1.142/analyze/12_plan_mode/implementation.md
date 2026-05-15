# Plan Mode Implementation — v2.1.142

This document traces the **end-to-end lifecycle** of a single plan-mode session: how a user (or the model) enters plan mode, how the slug is fixed, how the plan is persisted, how the exit dialog runs, and what state survives back into the main implementation phase.

For the v2.1.119/132/136 specific deltas (CLI flag persistence, plan-mode re-entry signaling, write-floor hardening), see [permission_mode_persistence.md](./permission_mode_persistence.md). For the tool internals see [enter_plan_mode_tool.md](./enter_plan_mode_tool.md) and [exit_plan_mode_tool.md](./exit_plan_mode_tool.md).

## State Machine

Plan mode is encoded in three orthogonal pieces of state:

1. **`toolPermissionContext.mode`** (string) — the active permission mode. `'plan'` while in plan mode; restored to `prePlanMode` on exit.
2. **`toolPermissionContext.prePlanMode`** (string | undefined) — the mode in effect *before* entering plan mode. Used so exit can restore whatever the user was on (`default`, `acceptEdits`, `bypassPermissions`, or `auto`).
3. **`U$` session flags** in `cli_inner_pretty.js:2270-2274`:
   - `hasExitedPlanMode: bool` — sticky. Set true on the first `ExitPlanMode` of the session. Once set, the *re-entry* attachment is shown instead of a fresh `plan_mode` attachment when the model re-enters plan mode.
   - `needsPlanModeExitAttachment: bool` — single-shot. Set by `Oo()` (mode transition) and by `ExitPlanModeV2Tool.call()`. Triggers `plan_mode_exit` attachment on the next turn.
   - `needsAutoModeExitAttachment: bool` — single-shot. Set when leaving auto-mode (including via plan exit).

Transitions are diagrammed below.

```
                  [Any non-plan mode]
                          |
              EnterPlanMode.call()        Shift+Tab cycle
              Oo(prev, 'plan')            /plan command (Wv5)
                          |
                          v
                    [mode = 'plan']
                          |
              (model researches; d65
               injects reminders; first
               PDH(seed) call fixes
               plan-file path)
                          |
              ExitPlanModeV2Tool.call()
                          |
              ┌──────────┴──────────┐
              |                     |
        isTeammate() &&        else (main user)
        isPlanModeRequired()        |
              |                     |
        writeToMailbox         setMode(prePlanMode)
        (await leader          OT(true)
         approval)             qh(true)  [needsExitAttachment]
              |                     |
        awaiting...            tool_result with plan
              |                     |
        leader.reply           [mode = prePlanMode]
              |                     |
              └──────────┬──────────┘
                         v
                  [Back to normal]
              (next attachment turn:
               plan_mode_exit reminder
               via c65)

   If model re-enters plan after exit:
   --------------------------------
              Oo('any', 'plan')
                    ↓
              [mode = 'plan']
                    ↓
              d65 detects HH$() === true
                    ↓
              Emits plan_mode_reentry attachment
              (carries existing planFilePath)
              Calls OT(false)
              Standard plan_mode attachment also
              appended (alternating full/sparse)
```

## Source Locations (Quick Map)

| Location | Role |
|----------|------|
| `cli_inner_pretty.js:2270-2274` | Session-flag initial state (`hasExitedPlanMode`, `needsPlanModeExitAttachment`, `needsAutoModeExitAttachment`) |
| `cli_inner_pretty.js:2949-2977` | Session-flag getters/setters and transition hooks (`HH$`, `OT`, `Cv8`, `qh`, `Oo`, `bv8`, `MT`, `xv8`) |
| `cli_inner_pretty.js:143086-143087` | `EXIT_PLAN_MODE_TOOL_NAME` constants (`kZ`, `NZ`) — both literal `"ExitPlanMode"` |
| `cli_inner_pretty.js:211429` | `ENTER_PLAN_MODE_TOOL_NAME` constant (`Q3H` = `"EnterPlanMode"`) |
| `cli_inner_pretty.js:138975-139001` | Word-list helpers: `Qh1` (randomInt), `k5$` (pickRandom), `Li$` (generateWordSlug), `Sq6` (slugifyPrompt), `nmH` (generateShortWordSlug) |
| `cli_inner_pretty.js:381649-381847` | `ExitPlanModeV2Tool` (`V2`) definition + body |
| `cli_inner_pretty.js:383798-383866` | `EnterPlanModeTool` (`Q38`) definition + body |
| `cli_inner_pretty.js:397726-397757` | `buildPlanModeAttachment`/`Exit` attachments (`d65`, `c65`) |
| `cli_inner_pretty.js:483806-483854` | `/plan` slash-command handler (`Wv5`) — v2.1.119 fix lives here |
| `cli_inner_pretty.js:517632-517772` | Plan-slug + plan-file utilities (`PDH`, `haH`, `tg6`, `u74`, `v2`, `HW`, `RA8`, `$y4`, `ox5`, `ax5`, `u38`) |
| `cli_inner_pretty.js:517791-517807` | `getPlansDirectory` (`SO`) memoized accessor |
| `cli_inner_pretty.js:518202-518286` | `checkWritePermissionForTool` (`VkH`) with v2.1.136 plan-mode write floor |
| `cli_inner_pretty.js:564219-564306` | Session restore + permission-mode filter (`ur5`, `nZ8`) — v2.1.132 fix lives here |
| `cli_inner_pretty.js:421723-421725` | `d64` decisionReason classifier — v2.1.136 plan_mode_floor predicate |
| `cli_inner_pretty.js:422720-422735` | `prepareContextForPlanMode` (`UkH`) |
| `cli_inner_pretty.js:422736-422746` | `transitionPlanAutoMode` (`TdH`) — handles auto-mode re-toggle on re-entry |

## Lifecycle Phase 1: Entry

The entry path has four call sites in v2.1.142:

- **Model-driven**: the LLM emits a `tool_use` block with `name: "EnterPlanMode"`. The agent loop dispatches to `Q38.call`.
- **User-driven via Shift+Tab**: Shift+Tab mode-cycling lands on plan mode and triggers `Oo(prev, 'plan')` directly (no tool call).
- **User-driven via `/plan`** (NEW or refined in v2.1.119): the `/plan` slash-command handler `Wv5` (`cli_inner_pretty.js:483806-483854`) enters plan mode and, when an existing plan file is present, optionally renders it or opens it in `$EDITOR`. Prior to v2.1.119 the command would always print "Enabled plan mode" without acting on the existing plan.
- **Teammate-spawn**: agents marked `plan_mode_required` start with `mode === 'plan'` already.

For tool-driven entry, the body lives at `cli_inner_pretty.js:383831-383843`:

```javascript
// ============================================
// EnterPlanModeTool.call - Switches session to plan mode
// Location: cli_inner_pretty.js:383831-383843
// ============================================

// ORIGINAL (for source lookup):
async call(H, $) {
  if ($.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
  let q = $.getAppState();
  return (
    Oo(q.toolPermissionContext.mode, "plan"),
    $.setToolPermissionContext((K) => Qz(UkH(K), { type: "setMode", mode: "plan", destination: "session" })),
    {
      data: {
        message:
          "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.",
      },
    }
  );
}

// READABLE (for understanding):
async call(_input, context) {
  if (context.agentId) {
    throw new Error('EnterPlanMode tool cannot be used in agent contexts');
  }
  const appState = context.getAppState();
  handlePlanModeTransition(appState.toolPermissionContext.mode, 'plan');
  context.setToolPermissionContext(prev =>
    applyPermissionUpdate(
      prepareContextForPlanMode(prev),
      { type: 'setMode', mode: 'plan', destination: 'session' }
    )
  );
  return {
    data: {
      message: 'Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.'
    }
  };
}

// Mapping: H→_input, $→context, q→appState, Oo→handlePlanModeTransition,
//          Qz→applyPermissionUpdate, UkH→prepareContextForPlanMode
```

**Key operation: `Oo(prevMode, 'plan')` (`cli_inner_pretty.js:2961-2964`)**

This is the mode-transition hook. It mutates `U$.needsPlanModeExitAttachment` based on the direction of the transition:

```javascript
// ============================================
// handlePlanModeTransition - Flip the exit-attachment flag based on direction
// Location: cli_inner_pretty.js:2961-2964
// ============================================

// ORIGINAL (for source lookup):
function Oo(H, $) {
  if ($ === "plan" && H !== "plan") U$.needsPlanModeExitAttachment = !1;
  if (H === "plan" && $ !== "plan") U$.needsPlanModeExitAttachment = !0;
}

// READABLE (for understanding):
function handlePlanModeTransition(prevMode, nextMode) {
  // Entering plan: clear stale exit-attachment so re-entry doesn't render
  // a "you exited plan mode" reminder.
  if (nextMode === 'plan' && prevMode !== 'plan') {
    U$.needsPlanModeExitAttachment = false;
  }
  // Leaving plan: schedule plan_mode_exit attachment for next turn.
  if (prevMode === 'plan' && nextMode !== 'plan') {
    U$.needsPlanModeExitAttachment = true;
  }
}

// Mapping: Oo→handlePlanModeTransition, H→prevMode, $→nextMode
```

The first branch matches on entry. The exit attachment flag is cleared before the next turn so the model doesn't see a stale "you exited plan mode" reminder when it has just entered. **This is essential for the v2.1.132 re-entry fix** — without the clear, a re-entry after a prior exit would render both `plan_mode_reentry` AND `plan_mode_exit` attachments in the same turn.

**Why throw on subagent context?** Subagents (delegated `Agent` tool calls) inherit the leader's mode via the agent spawn path and *cannot* independently enter plan mode — that would create a sub-plan that the leader can't observe or approve. Teammates spawned with `plan_mode_required` are pre-set to plan mode by the spawn path; they don't go through `EnterPlanMode.call`.

For the full deobfuscation of `EnterPlanModeTool` including schema, gating, and follow-up instruction generation, see [enter_plan_mode_tool.md](./enter_plan_mode_tool.md).

## Lifecycle Phase 2: Reminder Cycle & Slug Fixation

While in plan mode, the attachment loader (`cli_inner_pretty.js:397585-397590`, registering callbacks via `aY()`) calls `d65` on each turn. The function `d65` is where the **plan slug actually gets fixed**:

```javascript
// ============================================
// buildPlanModeAttachment - Per-turn plan-mode reminder dispatcher
// Location: cli_inner_pretty.js:397726-397748
// ============================================

// ORIGINAL (for source lookup):
async function d65(H, $, q, K) {
  if (q.getAppState().toolPermissionContext.mode !== "plan") return [];
  if ($ && $.length > 0) {
    let { turnCount: w, foundPlanModeAttachment: D } = bs7($);
    if (D && w < Is7.TURNS_BETWEEN_ATTACHMENTS) return [];
  }
  PDH(v$(), K?.planSlugSeed ?? H ?? void 0);
  let z = v2(q.agentId),
    Y = HW(q.agentId),
    f = [];
  if (HH$() && Y !== null) (f.push({ type: "plan_mode_reentry", planFilePath: z }), OT(!1));
  let M = (Q65($ ?? []) + 1) % Is7.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
  return (
    f.push({
      type: "plan_mode",
      reminderType: M,
      isSubAgent: !!q.agentId,
      planFilePath: z,
      planExists: Y !== null,
      customInstructions: q.options.planModeInstructions,
    }),
    f
  );
}

// READABLE (for understanding):
async function buildPlanModeAttachment(prompt, messages, context, options) {
  if (context.getAppState().toolPermissionContext.mode !== 'plan') return [];
  if (messages && messages.length > 0) {
    const { turnCount, foundPlanModeAttachment } = countTurnsSinceLastPlanAttachment(messages);
    if (foundPlanModeAttachment && turnCount < PLAN_MODE.TURNS_BETWEEN_ATTACHMENTS) {
      return [];
    }
  }
  // First-call fixation of plan slug. After this, getPlanSlug is idempotent for this session.
  getPlanSlug(getSessionId(), options?.planSlugSeed ?? prompt ?? undefined);
  const planFilePath = getPlanFilePath(context.agentId);
  const planContent = getPlan(context.agentId);
  const attachments = [];
  if (hasExitedPlanModeInSession() && planContent !== null) {
    attachments.push({ type: 'plan_mode_reentry', planFilePath });
    setHasExitedPlanMode(false);
  }
  const reminderType =
    (countPlanModeAttachmentsSinceExit(messages ?? []) + 1) % PLAN_MODE.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
      ? 'full' : 'sparse';
  attachments.push({
    type: 'plan_mode',
    reminderType,
    isSubAgent: !!context.agentId,
    planFilePath,
    planExists: planContent !== null,
    customInstructions: context.options.planModeInstructions,
  });
  return attachments;
}

// Mapping: d65→buildPlanModeAttachment, H→prompt, $→messages, q→context, K→options,
//          bs7→countTurnsSinceLastPlanAttachment, PDH→getPlanSlug, v$→getSessionId,
//          v2→getPlanFilePath, HW→getPlan, HH$→hasExitedPlanModeInSession,
//          OT→setHasExitedPlanMode, Q65→countPlanModeAttachmentsSinceExit, Is7→PLAN_MODE
```

### Algorithm: Plan-Mode Re-entry Detection

**What it does:** Detects that the model is re-entering plan mode after a prior `ExitPlanMode` in the same session, and emits a `plan_mode_reentry` attachment that surfaces the existing plan file.

**How it works (step by step):**

1. After the standard "are we still in plan mode?" guard returns true, check `HH$()` = `hasExitedPlanMode`.
2. Also verify the on-disk plan file still exists (`HW(agentId) !== null`).
3. If both true, push a `plan_mode_reentry` attachment carrying the resolved plan file path. This attachment is rendered by the prompt builder (`cli_inner_pretty.js:425113-425120`) with the text:
   > You are returning to plan mode after having previously exited it. A plan file exists at `${planFilePath}` from your previous planning session.
4. Reset `OT(!1)` so subsequent attachment cycles don't re-emit the re-entry attachment indefinitely. From this point on the model is treated as a fresh plan-mode session.
5. Continue to the standard `plan_mode` attachment append (alternating full/sparse).

**Why this approach:**
- Surfacing the prior plan file path on re-entry lets the model resume planning from where it left off, avoiding "start from scratch" behavior.
- The `OT(!1)` reset is one-shot: re-entry is detected ONCE per re-entry event. Subsequent turns in the same plan-mode session see only the standard attachment.
- The disk-existence guard (`Y !== null`) means the re-entry attachment is suppressed if the user cleared/deleted the plan file between exit and re-entry; in that case the model gets a fresh planning experience.

**Key insight:** v2.1.112 already had this re-entry path, but v2.1.132 changelog entry "plan mode not being re-applied after ExitPlanMode within the same session" suggests there was a regression where `EnterPlanMode.call` on re-entry would silently no-op due to the mode-transition flag being stuck or the `prePlanMode` already being `undefined` from the prior exit. The v2.1.142 implementation makes `Oo` idempotent and ensures `setToolPermissionContext` always emits the `setMode` action (overwriting any stale state).

**Why fix the slug here and not in EnterPlanMode?**
The slug is `prompt`-derived in v2.1.111+. At the moment `EnterPlanMode.call` runs, the prompt that triggered it has already been processed but the slug seed in `options.planSlugSeed` flows through the slash-command machinery. By deferring slug generation to the *first reminder build* (which runs after the slash-command preamble), the slug seed can be assembled from either the slash-command's `planSlugSeed` option or from the user's bare prompt. This also means `PDH` is called with the most-recent context, not an early empty value.

**Idempotence**: `PDH` checks the cache before generating. The first call wins. Subsequent calls return the same slug.

## Lifecycle Phase 3: Research

Inside plan mode the model uses Read/Grep/Glob/Bash(`isReadOnly`)/AskUserQuestion. Write-class tools are filtered out by the **v2.1.136 plan-mode write floor** in `VkH` (`checkWritePermissionForTool`), which inserts a hard "ask" gate between safety checks and allow-rule consultation:

```javascript
// ============================================
// checkWritePermissionForTool - Plan-mode floor enforcement
// Location: cli_inner_pretty.js:518269-518274 (the new v2.1.136 block)
// ============================================

// ORIGINAL (for source lookup):
// ... within VkH(H, $, q, K) ...
if (q.mode === "plan")
  return {
    behavior: "ask",
    message: `Cannot write to ${_} while in plan mode.`,
    decisionReason: { type: "mode", mode: "plan" },
  };

// READABLE (for understanding):
// Within checkWritePermissionForTool(tool, input, ctx, precomputedPaths):
// Step: after safety checks, before acceptEdits/allow-rule consultation.
if (ctx.mode === 'plan') {
  return {
    behavior: 'ask',
    message: `Cannot write to ${path} while in plan mode.`,
    decisionReason: { type: 'mode', mode: 'plan' },
  };
}

// Mapping: q→ctx, _→path
```

This means an `Edit(/path/to/file.ts)` or `Edit(/path/**)` allow rule **cannot** silently bypass plan-mode read-only-ness. The downstream auto-mode classifier (`tD`, `cli_inner_pretty.js:421879-421970`) detects this with `d64(decisionReason)`:

```javascript
// ============================================
// d64 - Decision-reason classifier for plan-mode floor
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

In the auto-mode classifier path, `d64(decisionReason)` short-circuits classifier fast-paths so writes in plan mode always surface to the user — even when auto-mode would otherwise allow them. The analytics tag `plan_mode_floor` (`cli_inner_pretty.js:421918`) is emitted when this fallback fires.

The plan file itself is exempt via `iUH` (`checkEditableInternalPath`) which short-circuits with `behavior:"allow"` for paths under the session's plan directory.

The model writes its plan to the file `${getPlansDirectory()}/${slug}.md` via the `Write` tool. The path is announced through the `plan_mode` system reminder. When the model is ready, it emits `ExitPlanMode` with no `plan` argument (the internal schema omits `plan` — see [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) for why).

## Lifecycle Phase 4: Exit & Approval

The exit body has several distinct logical phases. Top-level flow at `cli_inner_pretty.js:381709-381795`:

1. **Disk read**: `HW(agentId)` reads the plan file. If the model passed a `plan` field (via the SDK or via a permission hook's `updatedInput`), that takes priority over disk.
2. **Edited-plan write-back**: if `inputPlan !== undefined && filePath`, write the edited content back to disk so subsequent tools/recovery paths see it. Then `u38()` (`persistFileSnapshotIfRemote`) snapshots it into the transcript.
3. **Teammate branch**: `isTeammate() && isPlanModeRequired()` → post a `plan_approval_request` message to `team-lead` mailbox and return `{ awaitingLeaderApproval: true, requestId }`. The runner blocks on the awaiting flag until the leader responds.
4. **Main-user branch**: validates the auto-mode gate (see [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) §Auto-Mode Gate Fallback), then calls `setToolPermissionContext` to revert to `prePlanMode`. Strips or restores dangerous permissions depending on whether the restored mode is auto. Sets `OT(true)` and `qh(true)` so the next turn sees the exit reminder.
5. **Result mapping**: `mapToolResultToToolResultBlockParam` formats the tool_result. For the main path, the result includes the full plan text inline so the model can begin implementing without re-reading the file.

### Decision: Why read plan from disk instead of taking it as a tool input?

Originally (v1) the tool took the plan as an `input.plan` parameter. v2 changed the contract:

- **The plan now lives on disk** (created during research with `Write`). The tool input is empty in the schema. The model just announces "I'm done; show the user".
- **CCR (web UI) edit flow**: the user can edit the plan in the web UI's diff editor. CCR sends the edit back via `permissionResult.updatedInput.plan`. The tool detects this (`'plan' in input`) and persists the edit. The `_sdkInputSchema` (`cli_inner_pretty.js:381624-381629`) adds `plan` and `planFilePath` fields for hook visibility.
- **Hook visibility**: `normalizeToolInput` injects the disk-read plan and the file path into the tool_use before hooks run, so `PreToolUse` hooks see the full plan content.

The dual schema is intentional: the *internal* `inputSchema` (`sc7`, `cli_inner_pretty.js:381612`) omits `plan` (model can't fabricate a plan inline), but the *SDK-facing* `_sdkInputSchema` (`N53`, `cli_inner_pretty.js:381624`) extends it with `plan`/`planFilePath` for hook/SDK consumers.

## Key Data Structures

### `toolPermissionContext` (subset relevant to plan mode)

```typescript
type ToolPermissionContext = {
  mode: PermissionMode;  // 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan' | 'auto' | 'dontAsk'
  prePlanMode?: PermissionMode;  // saved on entry; undefined otherwise
  strippedDangerousRules?: boolean;  // true if we stripped rules entering plan-from-auto
  isAutoModeAvailable?: boolean;     // auto-mode gate state (v2.1.112+)
  isBypassPermissionsModeAvailable?: boolean;
  // ... other fields
};
```

### `U$` session flags (initial values at `cli_inner_pretty.js:2270-2274`)

```typescript
// Subset visible to plan mode:
hasExitedPlanMode: boolean;            // sticky 'has this session exited plan mode at least once'
needsPlanModeExitAttachment: boolean;  // 'inject plan_mode_exit on next turn'
needsAutoModeExitAttachment: boolean;  // 'inject auto_mode_exit on next turn'
planSlugCache: Map<SessionId, string>; // per-session slug cache (re-keyed on session-id change)
```

### Plan file path layout

| Context | Path |
|---------|------|
| Main session | `${plansDirectory}/${slug}.md` |
| Subagent | `${plansDirectory}/${slug}-agent-${agentId}.md` |

### `plansDirectory` resolution (memoized via `SO`)

1. If `settings.plansDirectory` is set: resolve relative to `getCwd()`. Path-traversal check: must stay within project root.
2. Else: fall back to `${getClaudeConfigHomeDir()}/plans` (e.g. `~/.claude/plans`).
3. `mkdirSync(plansPath)` runs once on first access. Failure is logged but not fatal.

```javascript
// ============================================
// getPlansDirectory - Memoized resolver for plan storage directory
// Location: cli_inner_pretty.js:517791-517807
// ============================================

// ORIGINAL (for source lookup):
SO = L8(function () {
  let q = m6().plansDirectory, K;
  if (q) {
    let _ = I$(), A = oB.resolve(_, q);
    if (!A.startsWith(_ + oB.sep) && A !== _)
      (N(`plansDirectory must be within project root: ${q}`, { level: "error" }), (K = oB.join(b8(), "plans")));
    else K = A;
  } else K = oB.join(b8(), "plans");
  try { C$().mkdirSync(K); }
  catch (_) { N(`Failed to create plans directory ${K}: ${_}`, { level: "error" }); }
  return K;
});

// READABLE (for understanding):
const getPlansDirectory = memoize(function getPlansDirectory() {
  const settingsDir = getInitialSettings().plansDirectory;
  let plansPath;
  if (settingsDir) {
    const cwd = getCwd();
    const resolved = path.resolve(cwd, settingsDir);
    if (!resolved.startsWith(cwd + path.sep) && resolved !== cwd) {
      logError(`plansDirectory must be within project root: ${settingsDir}`);
      plansPath = path.join(getClaudeConfigHomeDir(), 'plans');
    } else {
      plansPath = resolved;
    }
  } else {
    plansPath = path.join(getClaudeConfigHomeDir(), 'plans');
  }
  try {
    getFsImplementation().mkdirSync(plansPath);
  } catch (e) {
    logError(`Failed to create plans directory ${plansPath}: ${e}`);
  }
  return plansPath;
});

// Mapping: SO→getPlansDirectory, L8→memoize, m6→getInitialSettings, I$→getCwd,
//          oB→path, C$→getFsImplementation, b8→getClaudeConfigHomeDir, N→logError
```

The `memoize` wrapper (`L8`) returns the same string for the lifetime of the bundle's module-cache — the path is resolved once at startup and reused. Cache clearing on `/clear` operates via `SO.cache.clear?.()` (visible at `cli_inner_pretty.js:564274`, called in `hg4` for cwd changes).

## Failure Modes (Summary)

- **`No plan file found at <path>`** — teammate path only; thrown when `plan === null` and teammate has `plan_mode_required`.
- **"You are not in plan mode."** — `validateInput` rejects when mode is not `'plan'`. Caused by stale tool announcement after compact/clear.
- **`Cannot write to ${path} while in plan mode.`** — NEW in v2.1.136. Returned by `VkH` when any write/edit tool is invoked while `mode === 'plan'`. Allows users to recover by accepting the dialog (which would offer to switch to `acceptEdits`, but only when `prePlanMode` is not in `{auto, bypassPermissions, acceptEdits, dontAsk}` — see `hG$` at `cli_inner_pretty.js:518295-518301`).
- **Auto-mode gate-fallback** — `prePlanMode === 'auto'` but `isAutoModeGateEnabled()` is false at exit time. The tool downgrades to `'default'` and emits a warning notification with key `auto-mode-gate-plan-exit-fallback` (inherited from v2.1.112).
- **CCR/SDK plan write failure** — disk write of edited plan errors are logged via `N(...{level:"error"})`; call does not throw, but the on-disk plan may be stale.
- **`Deferred tool resume: permissionMode mismatch ...`** — warning emitted at `cli_inner_pretty.js:277311-277315` when the tool that was deferred under one permission mode is resumed under a different one. v2.1.132 elevated this warning to actionable text suggesting `--permission-mode <m>` to match.

For tool-specific failure semantics see [exit_plan_mode_tool.md](./exit_plan_mode_tool.md). For slug-collision handling see [plan_file_naming.md](./plan_file_naming.md). For the v2.1.119/132/136 details see [permission_mode_persistence.md](./permission_mode_persistence.md).
