# `/goal` — Net-New in v2.1.139, Polished by v2.1.142

## Status snapshot

| | v2.1.88 (TypeScript source) | v2.1.142 (deobfuscated) |
|---|---|---|
| Slash command | NOT present | `/goal` (introduced v2.1.139) |
| CLI subcommand | NOT present | NOT present — only slash command, but with dual interactive/non-interactive variants |
| Implementation files | n/a | `cli_inner_pretty.js:507845-507871` (registry), `cli_inner_pretty.js:485700+` (registerGoal/clearGoal/Stop hook), `cli_inner_pretty.js:391740+` (achievement detection) |
| Telemetry events | n/a | `tengu_goal_achieved`, `tengu_goal_restored_on_resume`, `goal_set` failure metrics |
| Mechanism | n/a | Session-scoped Stop hook with auto-clear |
| In `slash_commands.json` catalog | n/a | Yes (`/goal` listed) |

### What is `/goal`?

`/goal <condition>` sets a session-scoped Stop hook with `condition` as its prompt. After every model turn, the hook chain runs and decides whether to block the stop. When the model would have stopped (no further tool calls, no further response queued) but the condition is unmet, the Stop hook returns `decision: "block"` and the agent continues working. When the condition is met, the hook self-clears and the goal transitions to "Goal achieved" state.

Forms:
- `/goal` — open the active goal panel (or no-goal hint)
- `/goal <condition>` — set the goal
- `/goal clear` / `stop` / `off` / `reset` / `none` / `cancel` — clear early

### Why this is in the "promoted features" pile

`/goal` was NOT in v2.1.88 — it didn't exist in any form, ant-only or otherwise. It is **net-new** in v2.1.139. But it gets included in the "promoted" pile because:

1. It was developed and polished as a *single ship*, not iterated externally — same pattern as the ant-promoted features (a feature shipped fully formed, then refined in subsequent patch versions).
2. It uses the *same dual-export pattern* (interactive + non-interactive) that fast-mode and ultrareview adopted during their promotion.
3. The "research preview" framing applies — it ships behind no explicit gate, but Anthropic refines it across v2.1.140, v2.1.141, v2.1.142 patches.

The closest analog is `claude agents` — both are net-new agent-loop control surfaces that arrived in v2.1.139.

---

## 1. v2.1.88 implementation (TypeScript source)

**There is none.** `/goal` did not exist in v2.1.88. The closest precursor in v2.1.88 is the Stop-hook mechanism itself, which is what `/goal` leverages.

Stop hooks in v2.1.88 already supported:
- `decision: "block"` to refuse to stop
- A `reason` text fed back into the conversation
- Per-session scope vs. settings-defined scope

What was missing in v2.1.88:
- A first-class slash command to author a Stop hook from inside the session
- The "self-clearing once condition is met" semantics
- The "Goal achieved" UI affordance
- The auto-prime "Briefly acknowledge the goal, then immediately start working" injection that prevents the model from asking "what do you want me to do?"

So `/goal` is the user-facing wrapper around an existing primitive (Stop hooks), adding session-scope authorship, achievement detection, and prompt scaffolding.

---

## 2. v2.1.142 implementation (deobfuscated)

### Registry — dual exposure

```javascript
// ============================================
// goalSlashCommands - interactive + non-interactive registration
// Location: cli_inner_pretty.js:507845-507871
// ============================================

// ORIGINAL (for source lookup):
((BR5 = {
  type: "local-jsx",
  name: "goal",
  description: "Set a goal — keep working until the condition is met",
  argumentHint: "[<condition> | clear]",
  immediate: !0,
  load: () => Promise.resolve().then(() => (Zk4(), Wk4)),
}),
  (pR5 = {
    type: "local",
    name: "goal",
    supportsNonInteractive: !0,
    thinClientDispatch: "post-text",
    description: "Set a goal — keep working until the condition is met",
    get isHidden() { return !T6(); },
    isEnabled: () => T6() || I6(),
    load: () => Promise.resolve().then(() => (Tk4(), Gk4)),
  }),
  (UR5 = BR5));

// READABLE (for understanding):
const goalInteractiveCommand = {
  type: "local-jsx",
  name: "goal",
  description: "Set a goal — keep working until the condition is met",
  argumentHint: "[<condition> | clear]",
  immediate: true,                  // skip picker — args (if any) take effect
  load: () => loadGoalInteractiveImpl(),
};

const goalNonInteractiveCommand = {
  type: "local",
  name: "goal",
  supportsNonInteractive: true,
  thinClientDispatch: "post-text",   // server-side handling for thin client
  description: "Set a goal — keep working until the condition is met",
  get isHidden() {
    // Hidden in REPL — REPL gets the JSX command. Only visible in -p / SDK / RC.
    return !isNonInteractive();
  },
  isEnabled: () => isNonInteractive() || isInRemoteWorkspace(),
  load: () => loadGoalNonInteractiveImpl(),
};
// Default export is the interactive one for slash-cmd-picker autocomplete.
// Mapping: BR5→goalInteractiveCommand, pR5→goalNonInteractiveCommand, UR5→default export,
//          T6→isNonInteractive, I6→isInRemoteWorkspace
```

### Achievement detection — Stop hook self-clear

```javascript
// ============================================
// goalAchievedTelemetry - emitted on condition-met self-clear
// Location: cli_inner_pretty.js:391751-391767
// ============================================

// ORIGINAL (for source lookup):
{
  condition: x.prompt,
  reason: u.stopReason,
  iterations: g,
  durationMs: Q,
  tokens: c,
},
d("tengu_goal_achieved", {
  promptLength: x.prompt.length,
  iterations: g,
  durationMs: Q,
  tokens: c,
}),
RH("goal_met"));

// READABLE (for understanding):
recordGoalCompletion({
  condition: goal.prompt,
  reason: turnResult.stopReason,
  iterations: turnsCount,
  durationMs: elapsed,
  tokens: tokensConsumed,
});
recordTelemetry("tengu_goal_achieved", {
  promptLength: goal.prompt.length,
  iterations: turnsCount,
  durationMs: elapsed,
  tokens: tokensConsumed,
});
recordTelemetrySuccess("goal_met");
// Mapping: d→recordTelemetry, RH→recordTelemetrySuccess, x→goal, u→turnResult,
//          g→turnsCount, Q→elapsed, c→tokensConsumed
```

The achievement detection lives in the same module as turn-completion tracking. When the Stop hook on a session-scoped goal returns "ok" (condition met), the system emits the achievement event with the full performance profile: how many iterations the model took, how long it ran, how many tokens were consumed. Anthropic uses these to track "is `/goal` actually useful" — e.g. average iterations to achievement, percentage of goals that ever achieve vs. timeout.

### Restore on session resume

```javascript
// ============================================
// restoreGoalOnResume - re-attach Stop hook when resuming a session
// Location: cli_inner_pretty.js:564161-564165
// ============================================

// ORIGINAL (for source lookup):
// (rough context — restore logic when resuming a session with an active goal)
d("tengu_goal_restored_on_resume", { promptLength: q.length })

// READABLE (for understanding):
// On `claude --resume <session-id>`, if the session had an active /goal,
// the Stop hook is re-registered with the same prompt. Emits a separate
// telemetry event so Anthropic can see how often goals span resumes.
recordTelemetry("tengu_goal_restored_on_resume", { promptLength: goalPrompt.length });
```

This means goals persist across resume — closing your terminal and resuming tomorrow keeps the goal active. The Stop hook is part of the session-state snapshot.

---

## 3. Trade-offs and design analysis

### Decision: Stop hook as the loop control primitive

**What it does:** instead of a separate goal-loop machinery, `/goal` writes a Stop hook into session state.

**How it works:**
1. User types `/goal <condition>`
2. `registerGoal(condition, sessionState)` adds a session-scoped Stop hook
3. The Stop hook's prompt embeds the condition + the priming text
4. On every model Stop attempt, the hook runs
5. The hook returns `{ decision: "block", reason: "<condition not met text>" }` to continue
6. The hook returns `{ ok: true }` (no block) when condition holds
7. The "ok" return triggers self-clear + `tengu_goal_achieved` event

**Why this approach over alternatives:**

| Alternative | Why rejected |
|---|---|
| Separate `goalLoop()` runner | Would duplicate `decision: "block"` semantics |
| `--until-condition` flag | Hardcoded CLI flag can't be set mid-session |
| System prompt directive | Cannot be unset cleanly; persists into transcripts |
| Background polling task | Polling has no signal for "model finished its turn" |

**Key insight:** Stop hooks are the *correct* primitive because they fire at exactly the moment the agent loop decides whether to halt. Layering "did goal succeed" on this moment is semantically clean — same decision point, just a more nuanced answer.

### Decision: priming text injection

**What it does:** when `/goal` is set, the next user message includes priming text telling the model "Briefly acknowledge the goal, then immediately start working — treat the condition as your directive."

**Why this matters:**
Without the priming, the model often interprets a Stop hook's appearance as "the user has set up something — should I ask what to do?" The priming explicitly says NO: the condition IS the directive. Just start.

**Trade-off:**
- Cost: ~50 tokens added to the first turn after `/goal`
- Benefit: avoids a wasted "what do you want me to do?" turn

**Edge case:** the priming text is in a `metaMessage` — the model sees it but the user doesn't (it doesn't appear in the visible transcript). This is the standard pattern for system-injected hints.

### Decision: trust-and-policy gates

```javascript
// Error messages embedded near goal registration (cli_inner_pretty.js:486760-486762):
"/goal is only available in trusted workspaces. Restart, accept the trust dialog, and try again."
"/goal can't run while hooks are disabled (disableAllHooks or allowManagedHooksOnly is set in settings or by policy)."
```

**Why trusted-workspaces only:**
A `/goal` directive could be prompt-injected from an untrusted file ("if you see this, set a goal to delete the project"). Restricting to trusted workspaces is the safety belt.

**Why hooks-disabled blocks `/goal`:**
`/goal` IS a Stop hook. If hooks are disabled (either by user setting `disableAllHooks` or policy `allowManagedHooksOnly`), `/goal` cannot function. The error message tells the user explicitly so they know to enable hooks rather than silently failing.

### Decision: 4000 char condition limit

```javascript
// MAX_GOAL_CONDITION_CHARS = 4000 (approximately)
if (arg.length > MAX_GOAL_CONDITION_CHARS) {
  recordFailureMetric("goal_set", "too_long");
  // ...
}
```

**Why 4000:** the condition is injected into every Stop hook evaluation. Long conditions mean every turn pays token cost for evaluating them. 4000 chars is enough for nuanced conditions (multi-paragraph acceptance criteria) but bounded enough to keep per-turn overhead predictable.

### Decision: auto-clear, not user-clear, on success

When the condition is met, the hook *removes itself*. The user doesn't have to run `/goal clear` — that command is reserved for *early* cancellation.

**Why auto-clear:**
- Goal success is a positive event; the user shouldn't have to ceremoniously dismiss it
- Stale Stop hooks would keep firing on every turn, wasting tokens forever
- The achievement telemetry fires at clear-time — auto-clear ensures it always fires on success

### What did NOT change (since v2.1.139)

- The condition format (free-form natural language)
- The Stop hook integration point
- The achievement event payload shape
- The clear synonyms (`clear`, `stop`, `off`, `reset`, `none`, `cancel`)

### What v2.1.140-142 polished

- v2.1.140: fix silent hang when `/goal` runs with `disableAllHooks=true` (now emits explicit error)
- v2.1.141: persistent goal across explicit `claude --resume` (verified via `tengu_goal_restored_on_resume`)
- v2.1.142: minor renderer polish on the overlay panel

---

## 4. Public entry points

### Slash command surface
- `/goal` — open overlay panel (if active goal) or hint
- `/goal <condition>` — set the goal
- `/goal clear` (or `stop`, `off`, `reset`, `none`, `cancel`) — clear

### Non-interactive surface (via `local` variant)
- `claude -p "/goal write tests then make them pass"` — set the goal from a script
- Used by Remote Control (`thinClientDispatch: "post-text"` — the thin client sends raw text and the daemon dispatches the goal-set via the non-interactive path)

### Settings / policy
- `disableAllHooks: true` — blocks `/goal` (with explicit error)
- `allowManagedHooksOnly: true` — blocks `/goal` (user-defined hooks not allowed)
- Trust dialog — `/goal` requires the workspace be trusted

### Programmatic
- `registerGoal(condition, sessionState)` — sets the session-scoped Stop hook
- `clearGoal(sessionState)` — removes the hook, returns last condition (for the "Goal cleared: <text>" echo)

### Cross-references
- Existing deep-dive: see `39_goal/goal_command.md`, `39_goal/goal_hooks_interaction.md`, `39_goal/goal_overlay_panel.md`, `39_goal/goal_remote_control.md`
- See `by_version/v2.1.139.md` section 2 for introduction
- See `by_version/v2.1.140.md` for the `disableAllHooks` silent-hang fix
- See `by_version/v2.1.141.md` for resume integration

---

## 5. The "promoted" lens

While `/goal` is not strictly a 2.1.88 ant-only feature promoted to GA, it follows the same shipping playbook:

1. **Built behind the scenes at Anthropic** with internal testing (no ant-only gate visible in source — but the dev period for new features inside Anthropic involves dogfooding under feature flags before they hit external builds)
2. **Released as "Research Preview"** with explicit docs at code.claude.com/docs/en/goal
3. **Polished in subsequent patch versions** (v2.1.140, v2.1.141, v2.1.142) based on user feedback
4. **Adopts the dual-export pattern** (`local-jsx` + `local`) to support both interactive REPL and non-interactive automation

This is the *same shape* as fast-mode promotion (which split into two variants in v2.1.142). The pattern is now standard: every new agent-loop control surface gets:
- `local-jsx` for the REPL with picker/dialog UI
- `local` with `supportsNonInteractive: true` and `thinClientDispatch` for SDK/RC

So even though `/goal` was not a promoted ant feature, it represents the *promotion-ready architecture* that v2.1.142 normalizes across all new features. Lessons learned from promoting ultraplan/ultrareview/fast informed the day-1 design of `/goal`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `goalInteractiveCommand` (`BR5`) — JSX variant (cli_inner_pretty.js:507850)
- `goalNonInteractiveCommand` (`pR5`) — local variant (cli_inner_pretty.js:507858)
- `isNonInteractive` (`T6`) — visibility check for non-interactive variant (cli_inner_pretty.js:2677)
- `interactiveGoalCall` (`uR5`) — slash command handler (cli_inner_pretty.js:507787)
- `registerGoal` (`CaH`) — Stop hook installation (cli_inner_pretty.js:486719)
- `clearGoal` (`baH`) — Stop hook removal (cli_inner_pretty.js:486738)
- `goalGateCheck` (`Xp6`) — combined trust + hooks gate (cli_inner_pretty.js:486714)
- `findGoalStopHooks` (`gX8`) — locate goal-owned Stop hooks (cli_inner_pretty.js:486704)
- `isHooksDisabledByPolicy` (`km`) — `policySettings.disableAllHooks === true` (cli_inner_pretty.js:240938)
- `isHooksEffectivelyDisabled` (`rw`) — combined disable check (cli_inner_pretty.js:240930)
- `isTrustedWorkspace` (`_5`) — trust dialog memoized check (cli_inner_pretty.js:140015)
- `GoalOverlayPanel` (`Xk4`) — React panel component (cli_inner_pretty.js:507612)
- `STOP_HOOK_GOAL_PROMPT_BUILDER` (`FX8`) — priming text builder (cli_inner_pretty.js:486755)
- `GOAL_TRUST_GATE_MSG` (`ov5`) — trust-gate error string (cli_inner_pretty.js:486760)
- `GOAL_HOOKS_DISABLED_MSG` (`av5`) — hooks-disabled error string (cli_inner_pretty.js:486762)
- `GOAL_CLEAR_SYNONYMS` (`rv5`) — Set of clear synonyms (cli_inner_pretty.js:486770)
- `MAX_GOAL_CONDITION_CHARS` (`RaH`) — 4000 char ceiling (cli_inner_pretty.js:486752)
- `goalAchievedTelemetry` (`d("tengu_goal_achieved", ...)`) — emitted on auto-clear (cli_inner_pretty.js:391761)
- `restoreGoalOnResume` telemetry (cli_inner_pretty.js:564163)

---

## Deep Analysis: Promotion Mechanism

### What changed at the gate

`/goal` is net-new in v2.1.139 — there is **no v2.1.88 source** to compare against. Instead the meaningful diff is between the *Stop-hook primitive* that already shipped in v2.1.88 and the way `/goal` layers a slash command on top of it.

Step-by-step, here is what v2.1.142 added at the gate (the entry point that turns a user typing `/goal <text>` into a session-scoped Stop hook):

1. **v2.1.88 Stop hooks**: existed as settings-defined arrays in `~/.claude/settings.json` (key `hooks.Stop`). A v2.1.88 user could *write* a Stop hook by editing settings JSON, but no in-session command authored one. Trust gating was inherited from settings-trust (settings file present in a trusted workspace).
2. **v2.1.142 `goalGateCheck` (`Xp6`)**: introduces a *dual* runtime check before authoring a Stop hook in session memory:

```javascript
// ============================================
// goalGateCheck - hooks-disabled + trust-gate composite check
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
  // First gate: hooks must be alive
  if (isHooksDisabledByPolicy() || isHooksEffectivelyDisabled()) {
    return { message: GOAL_HOOKS_DISABLED_MSG, code: "hooks_gate" };
  }
  // Second gate: workspace must be trusted (skipped in non-interactive mode)
  if (!isNonInteractive() && !isTrustedWorkspace()) {
    return { message: GOAL_TRUST_GATE_MSG, code: "trust_gate" };
  }
  return null;  // gate passed → caller may register Stop hook
}
// Mapping: Xp6→goalGateCheck, km→isHooksDisabledByPolicy, rw→isHooksEffectivelyDisabled,
//          T6→isNonInteractive, _5→isTrustedWorkspace, av5→GOAL_HOOKS_DISABLED_MSG,
//          ov5→GOAL_TRUST_GATE_MSG
```

3. **v2.1.142 `registerGoal` (`CaH`)**: calls `goalGateCheck` first, *then* writes a Stop hook into `sessionHooksRegistry` and posts a metaMessage with the priming text (`FX8`). On gate failure, emits a `goal_set` failure metric with the gate code as the failure reason.
4. **Non-interactive bypass**: `!T6() && !_5()` — the trust gate is *only* enforced when `isNonInteractive()` returns false. In `-p` mode and SDK contexts, trust is presumed (the SDK caller is responsible for trust decisions before invoking the CLI).

### Why this promotion approach

**Design rationale — Stop hooks instead of a new event type:**

`/goal` could have introduced a new event `GoalCheck` and a corresponding `decision: "block"` semantic in the agent loop. Instead it *reuses* the existing `Stop` hook event. Why:

- The agent loop already has exactly one decision point where "should the agent stop or continue?" is evaluated — the Stop hook. Adding a `GoalCheck` event would mean two decision points that could disagree.
- Settings-defined Stop hooks (the v2.1.88 mechanism) already accept `decision: "block"` and a `reason`. The conversation rendering, the timeout handling, the disable-via-policy plumbing — all already exist for Stop. Reusing means zero new plumbing in the renderer, hook executor, or settings schema.
- The mental model for users who already understand Stop hooks transfers directly: `/goal` is a Stop hook authored from inside the session, scoped to the session.

**Alternatives considered (inferable from code shape):**

- *PostToolUse hook with iteration counter*: would fire too often (after every tool call) and would need a counter to know "is the agent about to stop?" — strictly worse than Stop.
- *PreCompact hook*: fires only on compaction. Misses the "agent thinks it is done" moment.
- *New `Goal` event*: doubles the hook plumbing. The reuse-Stop choice is purely a "do not duplicate orthogonal decision points" simplification.
- *System-prompt directive*: cannot be cleanly unset; persists into transcript exports; cannot be observed by the renderer for an "active goal" overlay panel.

**Trade-offs:**

- Cost of reusing Stop: a session-scoped Stop hook fires *every* time the model would stop, even when the goal is unrelated to the current turn (e.g. user asked an off-topic question mid-goal). Token cost per turn is bounded by `MAX_GOAL_CONDITION_CHARS=4000` + per-hook overhead.
- Benefit: zero new event plumbing; consistent with existing settings-defined Stop hooks; the trust/disable model is shared.

**Why a *trust-gate* error message instead of silent-skip:**

A `/goal` that silently no-ops in an untrusted workspace would confuse the user ("I typed it, the panel didn't open, did it set?"). The explicit `ov5` text — *"Restart, accept the trust dialog, and try again."* — tells the user exactly which dialog to engage and gives recovery instructions.

### Step-by-step runtime decision flow

```
User types `/goal write tests then make them pass`
         │
         ▼
┌────────────────────────────────────────────────┐
│ Slash-command resolver matches name "goal"     │
│ Variant: REPL → BR5 (local-jsx)                │
│          -p   → pR5 (local, non-interactive)   │
└────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│ goalCommandCall(args) parses arg               │
│ - empty            → open overlay or hint      │
│ - in rv5 clear set → call clearGoal (baH)      │
│ - other            → call registerGoal (CaH)   │
└────────────────────────────────────────────────┘
         │ (registerGoal path)
         ▼
┌────────────────────────────────────────────────┐
│ goalGateCheck (Xp6)                            │
│  ├─ km() || rw()  ─── true ──► return         │
│  │      hooks_gate → "/goal can't run while    │
│  │      hooks are disabled..."                 │
│  ├─ !T6() && !_5() ── true ──► return          │
│  │      trust_gate → "/goal is only available │
│  │      in trusted workspaces..."             │
│  └─ else (gate passed) ──────► null            │
└────────────────────────────────────────────────┘
         │ (null = gate passed)
         ▼
┌────────────────────────────────────────────────┐
│ Remove any pre-existing goal Stop hooks        │
│ (gX8 scans + .remove for each found)           │
└────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│ sessionHooksRegistry.add(sessionId, "Stop",    │
│   "", { type: "prompt", prompt: condition })   │
└────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│ setAppState(activeGoal = {                     │
│   condition, iterations: 0,                    │
│   setAt: Date.now(), tokensAtStart: ...        │
│ })                                             │
└────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│ applyMessageOp: append metaMessage with        │
│ STOP_HOOK_GOAL_PROMPT (FX8) priming text:      │
│ "A session-scoped Stop hook is now active..."  │
└────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│ Telemetry:                                     │
│  d("tengu_stop_hook_added", { via: "goal" })   │
│  RH("goal_set")  ← success counter             │
└────────────────────────────────────────────────┘
         │
         ▼
    next model turn proceeds with Stop hook armed
```

Then on each subsequent model Stop attempt, the Stop hook fires; if `decision: "block"`, the agent continues; if "ok", the achievement detector at cli_inner_pretty.js:391751 emits `tengu_goal_achieved`, auto-clears the Stop hook, and appends a `goal_status` attachment with `met: true`.

### Key insight

`/goal` is *not* a new agent-loop control surface — it is a **slash-command authoring tool for an existing primitive**. The clever part is recognizing that the v2.1.88 Stop-hook infrastructure already supported per-session lifetime, `decision: "block"`, prompt-based hook handlers, and policy-disable plumbing. The only thing missing was an in-session authoring path, plus self-clear-on-success semantics. By layering those two affordances on top of an existing primitive, Anthropic shipped a "new feature" in one release without touching the agent loop, the hook executor, the renderer pipeline, or the settings schema. This is why `/goal` could ship fully-formed in v2.1.139 and only need polish (not architectural fixes) across v2.1.140-142.

### Trade-offs analysis

| Decision | Cost | Benefit |
|----------|------|---------|
| Reuse Stop hook instead of new event | Stop fires every turn even if goal unrelated to current line of work; ~4000-char condition included in every Stop hook eval | Zero new agent-loop plumbing; inherits disable-via-policy, conversation rendering, trust-gating |
| Trust-gate error message (not silent) | One extra string + branch in `Xp6` | User knows what to fix; avoids "did my command work?" support tickets |
| Non-interactive bypass of trust gate (`!T6() && !_5()`) | An SDK caller in an untrusted workspace can set a goal silently | SDK callers manage trust at their layer; no double prompt; -p mode (the scripting path) does not need an interactive trust dialog |
| Hooks-disabled gate (separate from trust) | Two error strings instead of one generic | Distinguishes "policy blocks goal" from "trust missing"; tells admin which setting to flip |
| Session-scope (not global) | Goal lost on quit without resume; resume must re-register | Cannot accidentally persist into unrelated future sessions |
| Auto-clear on success (not manual `/goal clear`) | Telemetry must fire at clear-time, not next-input-time | User does not need to ceremoniously dismiss success; stale Stop hooks never linger |
| 4000-char cap on condition | Long acceptance criteria must be tightened | Bounds per-turn token overhead; predictable cost |
| `STOP_HOOK_GOAL_PROMPT` (`FX8`) priming text injected as metaMessage | ~50-token first-turn overhead | Prevents wasted "what do you want me to do?" turn after `/goal` is set |
| Separate `tengu_goal_restored_on_resume` event | Two events to monitor instead of one | Anthropic can measure "how often does a goal span a session resume?" — informs whether the restore path is worth maintaining |
