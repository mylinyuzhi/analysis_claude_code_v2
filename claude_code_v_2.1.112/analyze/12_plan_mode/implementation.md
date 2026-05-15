# Plan Mode Implementation — v2.1.112

This document traces the **end-to-end lifecycle** of a single plan-mode session: how a user (or the model) enters plan mode, how the slug is fixed, how the plan is persisted, how the exit dialog runs, and what state survives back into the main implementation phase.

## State Machine

Plan mode is encoded in three orthogonal pieces of state:

1. **`toolPermissionContext.mode`** (string) — the active permission mode. `'plan'` while in plan mode; restored to `prePlanMode` on exit.
2. **`toolPermissionContext.prePlanMode`** (string | undefined) — the mode in effect *before* entering plan mode. Used so exit can restore whatever the user was on (`default`, `acceptEdits`, `bypassPermissions`, or `auto`).
3. **`B8` session flags** in `chunks.1.mjs:2317-2322`:
   - `hasExitedPlanMode: bool` — sticky. Set true on the first `ExitPlanMode` of the session. Once set, the *re-entry* attachment is shown instead of a fresh `plan_mode` attachment when the model re-enters plan mode.
   - `needsPlanModeExitAttachment: bool` — single-shot. Set by `bi()` (mode transition) and by `ExitPlanModeV2Tool.call()`. Triggers `plan_mode_exit` attachment on the next turn.
   - `needsAutoModeExitAttachment: bool` — single-shot. Set when leaving auto-mode (including via plan exit).

Transitions are diagrammed below.

```
                  [Any non-plan mode]
                          |
              EnterPlanMode.call()        Shift+Tab cycle
              bi(prev, 'plan')            (UI path)
                          |
                          v
                    [mode = 'plan']
                          |
              (model researches; HMY  
               injects reminders; first
               g56(seed) call fixes
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
        (await leader          iL(true)
         approval)             Km(true)  [needsExitAttachment]
              |                     |
        awaiting...            tool_result with plan
              |                     |
        leader.reply           [mode = prePlanMode]
              |                     |
              └──────────┬──────────┘
                         v
                  [Back to normal]
              (next attachment turn:
               plan_mode_exit reminder)
```

## Source Chunks (Quick Map)

| Chunk | Role |
|-------|------|
| `chunks.1.mjs:2317-2322,3026-3060` | Session-flag declaration and getters/setters |
| `chunks.96.mjs:2549-2551` | `EXIT_PLAN_MODE_TOOL_NAME` constants (`Fk`, `dP`) |
| `chunks.97.mjs:1544-1782` | Slug generation, plan file IO, plan recovery |
| `chunks.98.mjs:1319` | `ENTER_PLAN_MODE_TOOL_NAME` constant (`d56`) |
| `chunks.150.mjs:2094-2315` | `ExitPlanModeV2Tool` (`zZ`) definition + body |
| `chunks.151.mjs:1286-1353` | `EnterPlanModeTool` (`o58`) definition + body |
| `chunks.155.mjs:1624-1648` | `buildPlanModeAttachment` (`HMY`) — first-call slug fix |

## Lifecycle Phase 1: Entry

The entry path has three call sites:

- **Model-driven**: the LLM emits a `tool_use` block with `name: "EnterPlanMode"`. The agent loop dispatches to `o58.call`.
- **User-driven**: Shift+Tab mode-cycling lands on plan mode and triggers `bi(prev, 'plan')` directly (no tool call).
- **Teammate-spawn**: agents marked `plan_mode_required` start with `mode === 'plan'` already.

For tool-driven entry, the body lives at chunks.151.mjs:1319-1331:

```javascript
// ============================================
// EnterPlanModeTool.call - Switches session to plan mode
// Location: chunks.151.mjs:1319-1331
// ============================================

// ORIGINAL (for source lookup):
async call(q, K) {
    if (K.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
    let _ = K.getAppState();
    return bi(_.toolPermissionContext.mode, "plan"), K.setToolPermissionContext((z) => EY(zI6(z), {
        type: "setMode",
        mode: "plan",
        destination: "session"
    })), {
        data: {
            message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
        }
    }
}

// READABLE (for understanding):
async call(input, context) {
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

// Mapping: q→input, K→context, _→appState, bi→handlePlanModeTransition,
//          EY→applyPermissionUpdate, zI6→prepareContextForPlanMode
```

**Key operation: `bi(prevMode, 'plan')` (chunks.1.mjs:3042)**
This is the mode-transition hook. It mutates `B8.needsPlanModeExitAttachment` based on the direction of the transition:
- `K === 'plan' && q !== 'plan'`: entering plan mode → clear `needsPlanModeExitAttachment`.
- `q === 'plan' && K !== 'plan'`: leaving plan mode → set `needsPlanModeExitAttachment = true`.

The first branch matches here. The exit attachment flag is cleared before the next turn so the model doesn't see a stale "you exited plan mode" reminder when it has just entered.

**Why throw on subagent context?** Subagents (delegated `Agent` tool calls) inherit the leader's mode via `runAgent.ts` and *cannot* independently enter plan mode — that would create a sub-plan that the leader can't observe or approve. Teammates spawned with `plan_mode_required` are pre-set to plan mode by the spawn path; they don't go through `EnterPlanMode.call`.

For the full deobfuscation of `EnterPlanModeTool` including schema, gating, and follow-up instruction generation, see [enter_plan_mode_tool.md](./enter_plan_mode_tool.md).

## Lifecycle Phase 2: Reminder Cycle & Slug Fixation

While in plan mode, the attachment loader (chunks.155.mjs around `mA("plan_mode", () => HMY(...))`) calls `HMY` on each turn. The function `HMY` is where the **plan slug actually gets fixed**:

```javascript
// ============================================
// buildPlanModeAttachment - Per-turn plan-mode reminder dispatcher
// Location: chunks.155.mjs:1624-1648
// ============================================

// ORIGINAL (for source lookup):
async function HMY(q, K, _, z) {
    if (_.getAppState().toolPermissionContext.mode !== "plan") return [];
    if (K && K.length > 0) {
        let { turnCount: J, foundPlanModeAttachment: X } = $MY(K);
        if (X && J < bNK.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    g56(I8(), z?.planSlugSeed ?? q ?? void 0);
    let O = eW(_.agentId), w = lP(_.agentId), $ = [];
    if (_p6() && w !== null) $.push({
        type: "plan_mode_reentry",
        planFilePath: O
    }), iL(!1);
    let H = (jMY(K ?? []) + 1) % bNK.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return $.push({
        type: "plan_mode",
        reminderType: H,
        isSubAgent: !!_.agentId,
        planFilePath: O,
        planExists: w !== null
    }), $
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
    });
    return attachments;
}

// Mapping: HMY→buildPlanModeAttachment, q→prompt, K→messages, _→context, z→options,
//          $MY→countTurnsSinceLastPlanAttachment, g56→getPlanSlug, I8→getSessionId,
//          eW→getPlanFilePath, lP→getPlan, _p6→hasExitedPlanModeInSession,
//          iL→setHasExitedPlanMode, jMY→countPlanModeAttachmentsSinceExit, bNK→PLAN_MODE
```

**Why fix the slug here and not in EnterPlanMode?**
The slug is `prompt`-derived in v2.1.111+. At the moment `EnterPlanMode.call` runs, the prompt that triggered it has already been processed but the slug seed in `options.planSlugSeed` flows through the slash-command machinery (chunks.141.mjs:2247-2250). By deferring slug generation to the *first reminder build* (which runs after the slash-command preamble), the slug seed can be assembled from either the slash-command's `planSlugSeed` option or from the user's bare prompt. This also means `getPlanSlug` is called with the most-recent context, not an early empty value.

**Idempotence**: `g56` checks the cache before generating. The first call wins. Subsequent calls return the same slug.

## Lifecycle Phase 3: Research

Inside plan mode the model uses Read/Grep/Glob/Bash(`isReadOnly`)/AskUserQuestion. Write-class tools are filtered out by the tool filter (separate from this module). The model writes its plan to the file `${getPlansDirectory()}/${slug}.md` via the `Write` tool — yes, plan mode allows `Write` to the plan file specifically. This is enforced by the system reminder text, not by tool filtering.

When the model is ready, it emits `ExitPlanMode` with no `plan` argument (the internal schema omits `plan` — see [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) for why).

## Lifecycle Phase 4: Exit & Approval

The exit body has several distinct logical phases. Top-level flow at chunks.150.mjs:2163-2261:

1. **Disk read**: `lP(agentId)` reads the plan file. If the model passed a `plan` field (via the SDK or via a permission hook's `updatedInput`), that takes priority over disk.
2. **Edited-plan write-back**: if `inputPlan !== undefined && filePath`, write the edited content back to disk so subsequent tools/recovery paths see it. Then `persistFileSnapshotIfRemote` snapshots it into the transcript.
3. **Teammate branch**: `isTeammate() && isPlanModeRequired()` → post a `plan_approval_request` message to `team-lead` mailbox and return `{ awaitingLeaderApproval: true, requestId }`. The runner blocks on the awaiting flag until the leader responds.
4. **Main-user branch**: validates the auto-mode gate (see [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) §Auto-Mode Gate Fallback), then calls `setToolPermissionContext` to revert to `prePlanMode`. Strips or restores dangerous permissions depending on whether the restored mode is auto. Sets `iL(true)` and `Km(true)` so the next turn sees the exit reminder.
5. **Result mapping**: `mapToolResultToToolResultBlockParam` formats the tool_result. For the main path, the result includes the full plan text inline so the model can begin implementing without re-reading the file.

### Decision: Why read plan from disk instead of taking it as a tool input?

Originally (v1) the tool took the plan as an `input.plan` parameter. v2 changed the contract:

- **The plan now lives on disk** (created during research with `Write`). The tool input is empty in the schema. The model just announces "I'm done; show the user".
- **CCR (web UI) edit flow**: the user can edit the plan in the web UI's diff editor. CCR sends the edit back via `permissionResult.updatedInput.plan`. The tool detects this (`'plan' in input`) and persists the edit. The `_sdkInputSchema` (chunks.150.mjs:2083-2086) adds `plan` and `planFilePath` fields for hook visibility.
- **Hook visibility**: `normalizeToolInput` injects the disk-read plan and the file path into the tool_use before hooks run, so `PreToolUse` hooks see the full plan content.

The dual schema is intentional: the *internal* `inputSchema` omits `plan` (model can't fabricate a plan inline), but the *SDK-facing* `_sdkInputSchema` extends it with `plan`/`planFilePath` for hook/SDK consumers.

## Key Data Structures

### `toolPermissionContext` (subset relevant to plan mode)

```typescript
type ToolPermissionContext = {
  mode: PermissionMode;  // 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan' | 'auto'
  prePlanMode?: PermissionMode;  // saved on entry; undefined otherwise
  strippedDangerousRules?: boolean;  // true if we stripped rules entering plan-from-auto
  // ... other fields
};
```

### `B8` session flags (chunks.1.mjs:2317-2322)

```typescript
// Subset visible to plan mode:
hasExitedPlanMode: boolean;            // sticky 'has this session exited plan mode at least once'
needsPlanModeExitAttachment: boolean;  // 'inject plan_mode_exit on next turn'
needsAutoModeExitAttachment: boolean;  // 'inject auto_mode_exit on next turn'
```

### Plan file path layout

| Context | Path |
|---------|------|
| Main session | `${plansDirectory}/${slug}.md` |
| Subagent | `${plansDirectory}/${slug}-agent-${agentId}.md` |

### `plansDirectory` resolution (memoized via `aO`)

1. If `settings.plansDirectory` is set: resolve relative to `getCwd()`. Path-traversal check: must stay within project root.
2. Else: fall back to `${getClaudeConfigHomeDir()}/plans` (e.g. `~/.claude/plans`).
3. `mkdirSync(plansPath)` runs once on first access. Failure is logged but not fatal.

## Failure Modes (Summary)

- **`No plan file found at <path>`** — teammate path only; thrown when `plan === null` and teammate has `plan_mode_required`.
- **"You are not in plan mode."** — `validateInput` rejects when mode is not `'plan'`. Caused by stale tool announcement after compact/clear.
- **Auto-mode gate-fallback** — `prePlanMode === 'auto'` but `isAutoModeGateEnabled()` is false at exit time. The tool downgrades to `'default'` and emits a warning notification with key `auto-mode-gate-plan-exit-fallback`.
- **CCR/SDK plan write failure** — disk write of edited plan errors are logged via `j6` (logError); call does not throw, but the on-disk plan may be stale.

For tool-specific failure semantics see [exit_plan_mode_tool.md](./exit_plan_mode_tool.md). For slug-collision handling see [plan_file_naming.md](./plan_file_naming.md).
