# Goal Module (39_goal) - v2.1.139 introduction, v2.1.140 hook-gate refinement

## TL;DR

The `/goal` command (v2.1.139) lets the user **set a completion condition** and have Claude keep working across stop boundaries until the condition is met. The mechanism reuses the **Stop hook** infrastructure - a Stop hook is registered with the goal condition as its prompt; every time the model tries to stop, the hook runs and either blocks the stop ("not yet met, continue") or releases it ("goal achieved").

Three surfaces consume the goal:

- Interactive sessions show a **live overlay panel** with elapsed time, turns spent, and tokens used.
- `-p` and SDK headless sessions get a non-interactive variant (`goalNonInteractive`) that prints status text.
- Remote Control sessions accept `/goal` like any other `post-text` slash command and the panel state is mirrored to the connected client.

v2.1.140 adds a precondition check: if `disableAllHooks` or `allowManagedHooksOnly` is set, `/goal` now shows a clear "/goal can't run while hooks are disabled" error instead of hanging silently while the hook never registers.

---

## Architecture

```
   /goal <condition>
        │
        v
   ┌────────────────────────────────────────────────────────────┐
   │  preGate checks (xaH.js / Xp6)                             │
   │    - km() / disableAllHooks (policy)?     fail "hooks_gate"│
   │    - rw() / allowManagedHooksOnly?        fail "hooks_gate"│
   │    - interactive && !trustGranted?        fail "trust_gate"│
   │      (!T6() && !_5())                                       │
   └────────────────────────────────────────────────────────────┘
        │ pass
        v
   ┌────────────────────────────────────────────────────────────┐
   │  CaH (registerGoal) - cli_inner_pretty.js:486719           │
   │    - remove any existing Stop hooks with empty matcher     │
   │    - sessionHooksRegistry.add(sessionId, "Stop", "",       │
   │        { type: "prompt", prompt: condition })              │
   │    - setAppState(activeGoal = { condition, iterations: 0,  │
   │        setAt: now, tokensAtStart })                        │
   │    - applyMessageOp append goal_status attachment(met=false│
   │        sentinel=true)                                      │
   │    - emit "tengu_stop_hook_added" with via:"goal"          │
   │    - return null  (success)                                │
   └────────────────────────────────────────────────────────────┘
        │
        v
   ┌────────────────────────────────────────────────────────────┐
   │  Main loop continues. After every assistant turn finishes, │
   │  the Stop hook chain runs.                                 │
   │                                                            │
   │  cli_inner_pretty.js:391740-391790                         │
   │                                                            │
   │  if hook returns hook_success and condition met:           │
   │    - sessionHooksRegistry.remove (clear the stop-hook)     │
   │    - setAppState(activeGoal = undefined)                   │
   │    - yield goal_status attachment(met=true, iterations++,  │
   │        durationMs, tokens)                                 │
   │    - emit "tengu_goal_achieved"                            │
   │                                                            │
   │  if hook returns blockingError (not yet met):              │
   │    - yield active_goal with iterations++ and lastReason    │
   │    - yield goal_status attachment(met=false, reason)       │
   │    - the blockingError text feeds back into the model      │
   │      and triggers another turn                             │
   └────────────────────────────────────────────────────────────┘
        │
        v
   ┌────────────────────────────────────────────────────────────┐
   │  Overlay panel (interactive only)                          │
   │   - cli_inner_pretty.js:507612 (Xk4) renders the /goal     │
   │     dialog state ("set", "active", "achieved")             │
   │   - cli_inner_pretty.js:544426 (Xx4) renders the           │
   │     "◎ /goal active" status badge with elapsed time when   │
   │     active                                                 │
   └────────────────────────────────────────────────────────────┘
```

---

## Lifecycle

A goal flows through four states:

| State | Trigger | What is visible |
|-------|---------|------------------|
| Not set | Initial | `/goal` shows "No goal set" placeholder |
| Set | User typed `/goal <condition>` | Overlay panel shows condition + elapsed/turns/tokens; status badge `◎ /goal active` in main UI |
| Achieved | Stop hook returned `hook_success` without blocking | Overlay shows "Goal achieved" with final stats; status badge clears |
| Cleared | User typed `/goal clear` | Overlay shows "No goal set"; status badge clears |

The state lives on `appState.activeGoal`:

```typescript
type ActiveGoal = {
  condition: string;       // the user-provided condition text
  iterations: number;       // how many times the hook has fired (incremented per stop)
  setAt: number;            // Date.now() at /goal call
  tokensAtStart: number;    // nX() at /goal call - for delta computation
  lastReason?: string;      // the Stop hook's last "why not yet" output
};
```

Transcripts persist the goal as a sentinel `goal_status` attachment - this is what `restoreGoalFromTranscript` (`Cr5` at `cli_inner_pretty.js:564153`) replays at resume time so a `--resume`d session restores its active goal automatically (unless the precondition gates fail at restore).

---

## Integration with `-p`, headless, and Remote Control

### `-p` and SDK headless

The non-interactive variant `goalNonInteractive` (`pR5` at `cli_inner_pretty.js:507858-507869`) is registered as a `type: "local"` command with `supportsNonInteractive: true` and `thinClientDispatch: "post-text"`:

```javascript
pR5 = {
  type: "local",
  name: "goal",
  supportsNonInteractive: true,
  thinClientDispatch: "post-text",
  description: "Set a goal - keep working until the condition is met",
  get isHidden() { return !isTrustedWorkspace(); },
  isEnabled: () => isTrustedWorkspace() || isHeadless(),
  load: () => Promise.resolve().then(() => (Tk4(), Gk4)),
};
```

The `call` function `mR5` (`cli_inner_pretty.js:507815-507839`) returns a `{ type, value }` tuple appropriate for `-p`:

- Empty arg with no active goal: `{ type: "text", value: "No goal set. Usage: '/goal <condition>'" }`
- Empty arg with active goal: `{ type: "text", value: "Goal active: <cond> (<N> turn|not yet evaluated)..." }`
- "clear" subcommand: clears and returns text
- New condition: registers and returns `{ type: "query", value: "Goal set: ...", prompt: <hook-priming-text> }`

The `type: "query"` return shape causes the headless harness to **continue running** with the priming prompt as the next user message - which is what makes `-p "/goal all tests pass"` work the way users expect.

### Remote Control

`thinClientDispatch: "post-text"` means the `/goal` command can be invoked over the Remote Control protocol (claude.ai's web UI sending a text-mode command to a connected CLI). The dispatch path is the same as for `/compact` or `/effort` - the remote client just posts the slash-command text and the CLI processes it normally.

The interactive variant `Hx5` (`UR5` at the same export, line 507870) is a `type: "local-jsx"` that returns a React component for the dialog. Remote Control falls back to the `pR5` "local" variant since `local-jsx` UIs do not render remotely. The two variants share the same underlying `CaH` (register) and `baH` (clear) logic in `xaH.js` module.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (goals are conceptually a feature, hook integration sits here)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Stop hook execution
> - [symbol_additions_v2_1_142_skills_goal.md](../00_overview/symbol_additions_v2_1_142_skills_goal.md) - All new symbols

Key symbols:

- `goalCommand` (`BR5`) - cli_inner_pretty.js:507850 - the interactive local-jsx command def
- `goalNonInteractive` (`pR5`) - cli_inner_pretty.js:507858 - the headless variant
- `registerGoal` (`CaH`) - cli_inner_pretty.js:486719 - registers the Stop hook
- `clearGoal` (`baH`) - cli_inner_pretty.js:486734 - removes the Stop hook
- `goalGateCheck` (`Xp6`) - cli_inner_pretty.js:486714 - precondition checks
- `getStopHookPrompts` (`gX8`) - cli_inner_pretty.js:486706 - reads the active stop-hook prompts
- `getLastGoalAttachment` (`oP4`) - cli_inner_pretty.js:486693 - finds the last goal_status in messages
- `formatHookReason` (`aP4`) - cli_inner_pretty.js:486703 - formats "Last check: <reason>"
- `goalStatusAttachment` (`sP4`) - cli_inner_pretty.js:486747 - the attachment factory
- `STOP_HOOK_GOAL_PROMPT` (`FX8`) - cli_inner_pretty.js:486758 - the priming user-message text
- `GOAL_TRUST_GATE_MSG` (`ov5`) - cli_inner_pretty.js:486760
- `GOAL_HOOKS_GATE_MSG` (`av5`) - cli_inner_pretty.js:486761
- `GOAL_CLEAR_KEYWORDS` (`rv5`) - cli_inner_pretty.js:486771 - set of clear synonyms
- `MAX_GOAL_CONDITION_CHARS` (`RaH`) - cli_inner_pretty.js:486756 - 4000
- `isClearKeyword` (`UX8`) - cli_inner_pretty.js:486690 - tests against `rv5`
- `isAllHooksDisabled` (`km`) - cli_inner_pretty.js:240936 - precondition source (reads `policySettings.disableAllHooks`)
- `isAllowManagedHooksOnly` (`rw`) - cli_inner_pretty.js:240930 - precondition source (policy + user-tier `disableAllHooks`)
- `isNonInteractive` (`T6`) - cli_inner_pretty.js:2677 - `!U$.isInteractive`; the goal trust gate auto-bypasses for non-interactive callers
- `isTrustGranted` (`_5`) - cli_inner_pretty.js:140015 - memoized; sandboxed env OR sessionTrustAccepted OR background-agent OR projectTree.hasTrustDialogAccepted
- `computeTrust` (`eh1`) - cli_inner_pretty.js:140018 - the underlying trust evaluator that `_5` memoizes
- `sessionTrustAccepted` (`YIH`) - cli_inner_pretty.js:2940 - per-session trust flag set by remote-bridge / flag launches
- `isBackgroundAgent` (`N7`) - cli_inner_pretty.js:97906 - `bU() === "bg"`; one of the trust-grant sources
- `isRemoteWorkspace` (`I6`) - cli_inner_pretty.js:3104 - remote bridge bypass for the `pR5.isEnabled` check
- `runStopHookChain` (`Co7`) - cli_inner_pretty.js:391626 - the pre-stop-hook orchestrator that hosts the goal achievement/progress logic
- `hookEquals` (`AY8`) - cli_inner_pretty.js:352528 - identity predicate (type + content) used to decide whether an incoming hook is session-owned
- `getSessionHooksByEvent` (`rwH`) - cli_inner_pretty.js:352607 - returns the current session's hooks for a given event (used by Co7's isSessionRegisteredHook filter)
- `attachmentMsg` (`fK`) - cli_inner_pretty.js:398535 - the attachment-message factory used by Co7 to yield non-sentinel goal_status messages
- `registerSessionHookDirect` (`_X$`) - cli_inner_pretty.js:352560 - underlying session-hook add (used by resume path)
- `attachmentRenderer` (`db7`) - cli_inner_pretty.js:346787 - the transcript attachment renderer; case `"goal_status"` at 347071-347110 produces the inline "Goal achieved" / "Goal not yet met... continuing" lines
- `restoreGoalFromTranscript` (`Cr5`) - cli_inner_pretty.js:564153
- `findGoalToRestore` (`Eg4`) - cli_inner_pretty.js:564144
- `GoalOverlayPanel` (`Xk4`) - cli_inner_pretty.js:507612 - the React dialog component
- `goalDefaultExport` (`Hx5` -> `WE4.default` -> `BR5`) - cli_inner_pretty.js:514106 - export alias for `goalCommand`
- `LabeledField` (`UF6`) - cli_inner_pretty.js:507749 - "Label: value" row used by the overlay
- `GoalActiveBadge` (`Xx4`) - cli_inner_pretty.js:544426 - "◎ /goal active" status-bar component
- `BADGE_PULSE_PERIOD_MS` (`Ug5`) - cli_inner_pretty.js:544514 - 4000
- `BADGE_DOT_INTERVAL_FRAC` (`Fg5`) - cli_inner_pretty.js:544515 - 0.18
- `BADGE_DOTS` (`V28`) - cli_inner_pretty.js:544513 - 20

---

## Module Structure

| Document | Purpose |
|----------|---------|
| [goal_command.md](./goal_command.md) | The `/goal` command - syntax, completion-condition workflow, interactive/non-interactive variants, the registration core (`CaH`) and the clear core (`baH`) |
| [goal_hooks_interaction.md](./goal_hooks_interaction.md) | v2.1.140 gate: clear error when `disableAllHooks`/`allowManagedHooksOnly` is set; also covers the trust gate and the corrected `T6` / `_5` semantics |
| [goal_overlay_panel.md](./goal_overlay_panel.md) | Live elapsed/turns/tokens overlay panel and the "/goal active" badge, including the two-timer scheduling and the color-degradation fallback |
| [goal_remote_control.md](./goal_remote_control.md) | Remote Control integration via `thinClientDispatch: "post-text"` |
| [goal_stop_hook_consumer.md](./goal_stop_hook_consumer.md) | `Co7` — the Stop-hook chain orchestrator that drives `iterations++`, `lastReason`, achievement detection, and the `active_goal` state-write protocol with its three reducers |
| [goal_status_rendering.md](./goal_status_rendering.md) | `db7` case `"goal_status"` — the inline transcript renderer that produces the "Goal achieved" and "Goal not yet met... continuing" lines |

---

## Cross-references

- Stop hook chain - `27_hooks_subsystem`
- Session hooks registry (`sessionHooksRegistry.add/remove`) - `27_hooks_subsystem`
- Token counting (`nX()`) - `06_state_management` or `25_model_selection`
- `setAppState` / app state machine - `06_state_management`
- Resume / `--resume` and the transcript replay - `08_session_management`
- Slash commands and `thinClientDispatch` - `28_cli_commands`
- Trust gate (`_5` / `eh1`) and the workspace trust dialog - `12_permission_policy`

---

## End-to-end timeline

For reference, here's the complete event sequence for a typical `/goal write a hello world` interaction in an interactive REPL:

```
t=0     user types:    /goal write a hello world
        │
        │  goalCommand.call (uR5) runs
        │   1. Xp6() gate passes (hooks enabled, trust granted)
        │   2. registerGoal (CaH):
        │      - removes any existing stop-hook (gX8 finds none)
        │      - sessionHooksRegistry.add(sid, "Stop", "", {type:"prompt", prompt:"write a hello world"})
        │      - setAppState({activeGoal: {condition, iterations:0, setAt:t0, tokensAtStart:T0}})
        │      - applyMessageOp(append sP4(false, condition))   ← sentinel attachment
        │      - tengu_stop_hook_added telemetry
        │   3. emit "Goal set: write a hello world" with shouldQuery=true and metaMessages=[FX8(condition)]
        │
        ├──> overlay panel doesn't render (no /goal bare yet); badge starts showing "◎ /goal active"
        │
t=0+    main loop fires next turn with the priming meta-message:
        │  "A session-scoped Stop hook is now active with condition: ..."
        │
t=2     assistant responds: "I'll write a hello world program."
        │  (creates hello.py with `print("hello world")`)
        │  assistant turn ends — main loop calls Co7 (runStopHookChain)
        │
        │  Co7:
        │   - iterates S9H Stop hook iterator
        │   - yields the prompt-Stop hook subagent's result
        │   - subagent reads transcript, sees hello.py was created, decides MET
        │   - yields hook_success
        │   - isSessionRegisteredHook filter: yes, matches
        │   - sessionHooksRegistry.remove(sid, "Stop", hook)
        │   - activeGoal.condition === hook.prompt: YES
        │   - yield {type:"active_goal", value: undefined}   ← three reducers all clear it
        │   - yield fK({type:"goal_status", met:true, condition, reason, iterations:1, durationMs:2000, tokens:T1-T0})
        │   - tengu_goal_achieved telemetry; recordSuccess("goal_met")
        │
        ├──> overlay badge transitions to null; transcript shows: "✓ Goal achieved (2s · 1 turn · 250 tokens)"
        │
t=2+    main loop continues normally; model is free to stop on next consideration
```

For the "not yet met" branch, replace the `hook_success` step with `blockingError`:

```
t=2     assistant responds: "I'll start by listing the directory."
        │  (calls ls)
        │  assistant turn ends — main loop calls Co7
        │
        │  Co7:
        │   - subagent decides: NOT MET (no hello.py created yet)
        │   - yields blockingError with stopReason="No hello world program has been created yet."
        │   - re-emit blockingError as isMeta user message → main loop will run another turn
        │   - isSessionRegisteredHook: yes (still registered — block doesn't remove)
        │   - activeGoal.condition === hook.prompt: YES
        │   - yield {type:"active_goal", value: {condition, iterations:1, lastReason:"No hello..."}}
        │   - yield fK({type:"goal_status", met:false, condition, reason:"No hello..."})
        │
        ├──> overlay panel (if opened) shows iterations=1, "Last check: No hello..."
        ├──> badge stays active, elapsed time keeps ticking
        ├──> transcript shows: "⏸ Goal not yet met... continuing"  (or with reason in verbose mode)
        │
t=3     main loop fires next turn — model sees the blockingError-derived meta-message
        │  and continues working on the goal
        │  ... (loop until subagent says MET)
```

The "not yet" cycle can repeat indefinitely until either the model satisfies the condition or the user types `/goal clear` (clearGoal / baH) or hits Esc on an active turn.
