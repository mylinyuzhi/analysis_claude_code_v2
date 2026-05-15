# `/goal` Command (v2.1.139)

## What it does

`/goal <condition>` sets a session-scoped Stop hook with `condition` as its prompt. After every model turn, the Stop hook chain runs and evaluates whether the condition is met. If the model would have stopped (no further tool calls, no further response queued) but the condition is unmet, the Stop hook **blocks** the stop and feeds the reason back into the model as a new user message - which triggers another turn. The condition self-resolves the first time the hook returns `hook_success` without a block; the hook then auto-clears and the goal moves to "Goal achieved" state.

Three forms:

```
/goal                  ## (interactive) show the dialog with current goal state
/goal <condition>      ## set a goal
/goal clear            ## stop early; synonyms: stop, off, reset, none, cancel
```

The command is exposed as **two variants** in the command registry:

- `goalCommand` (`BR5`) - `type: "local-jsx"`, rendered as a React dialog when the user types `/goal` from an interactive session.
- `goalNonInteractive` (`pR5`) - `type: "local"`, returns `{ type, value }` text for `-p`, SDK, and Remote Control.

Both variants share the same registration core (`CaH` / `registerGoal`) and clear core (`baH` / `clearGoal`) in `xaH.js`.

---

## How it works

### 1. The interactive variant

```javascript
// ============================================
// goalCommand - the interactive /goal entry
// Location: cli_inner_pretty.js:507787-507806
// ============================================

// ORIGINAL (for source lookup):
var Pk4,
  uR5 = async (H, $, q) => {
    let K = q.trim();
    if (K === "")
      return Pk4.default.createElement(Xk4, { messages: $.messages, onDone: () => H(void 0, { display: "skip" }) });
    if (UX8(K)) {
      let A = baH($);
      return (H(A === null ? "No goal set" : `Goal cleared: ${A}`, { display: "system" }), null);
    }
    if (K.length > RaH)
      return (
        J8("goal_set", "too_long"),
        H(`Goal condition is limited to ${RaH} characters (got ${K.length})`, { display: "system" }),
        null
      );
    let _ = CaH(K, $);
    if (_ !== null) return (H(_, { display: "system" }), null);
    return (H(`Goal set: ${K}`, { shouldQuery: !0, metaMessages: [FX8(K)] }), null);
  };

// READABLE (for understanding):
const interactiveGoalCall = async (emit, sessionState, rawArgs) => {
  const arg = rawArgs.trim();
  // 1. Bare /goal -> open the React dialog with current state
  if (arg === "") {
    return React.createElement(GoalOverlayPanel, {
      messages: sessionState.messages,
      onDone: () => emit(undefined, { display: "skip" }),
    });
  }
  // 2. Clear synonyms (clear, stop, off, reset, none, cancel)
  if (isClearKeyword(arg)) {
    const lastCondition = clearGoal(sessionState);
    emit(
      lastCondition === null ? "No goal set" : `Goal cleared: ${lastCondition}`,
      { display: "system" },
    );
    return null;
  }
  // 3. Length cap (MAX_GOAL_CONDITION_CHARS = 4000)
  if (arg.length > MAX_GOAL_CONDITION_CHARS) {
    recordFailureMetric("goal_set", "too_long");
    emit(
      `Goal condition is limited to ${MAX_GOAL_CONDITION_CHARS} characters (got ${arg.length})`,
      { display: "system" },
    );
    return null;
  }
  // 4. Set the goal. registerGoal returns either null (success) or an error message string.
  const gateError = registerGoal(arg, sessionState);
  if (gateError !== null) {
    emit(gateError, { display: "system" });
    return null;
  }
  // Success path: emit the priming text as a meta-message that the model will treat as a system reminder.
  // shouldQuery: true makes the main loop kick off the next turn immediately.
  emit(`Goal set: ${arg}`, {
    shouldQuery: true,
    metaMessages: [STOP_HOOK_GOAL_PROMPT(arg)],
  });
  return null;
};

// Mapping:
//   uR5 -> interactiveGoalCall,         Pk4 -> React,
//   Xk4 -> GoalOverlayPanel,            UX8 -> isClearKeyword,
//   baH -> clearGoal,                   J8  -> recordFailureMetric,
//   CaH -> registerGoal,                FX8 -> STOP_HOOK_GOAL_PROMPT,
//   RaH -> MAX_GOAL_CONDITION_CHARS (4000),
//   $   -> sessionState,                q   -> rawArgs,
//   H   -> emit
```

### 2. The non-interactive variant

```javascript
// ============================================
// goalNonInteractive - the /goal entry for -p/SDK
// Location: cli_inner_pretty.js:507815-507839
// ============================================

// ORIGINAL (for source lookup):
var mR5 = async (H, $) => {
  let q = H.trim();
  if (q === "") {
    let _ = $.getAppState().activeGoal;
    if (!_) return { type: "text", value: "No goal set. Usage: `/goal <condition>`" };
    let A = _.iterations === 0 ? "not yet evaluated" : `${_.iterations} ${S8(_.iterations, "turn")}`,
      z = _.lastReason
        ? `
${aP4(_.lastReason)}`
        : "";
    return { type: "text", value: `Goal active: ${_.condition} (${A})${z}` };
  }
  if (UX8(q)) {
    let _ = baH($);
    return { type: "text", value: _ === null ? "No goal set" : `Goal cleared: ${_}` };
  }
  if (q.length > RaH)
    return (
      J8("goal_set", "too_long"),
      { type: "text", value: `Goal condition is limited to ${RaH} characters (got ${q.length})` }
    );
  let K = CaH(q, $);
  if (K !== null) return { type: "text", value: K };
  return { type: "query", value: `Goal set: ${q}`, prompt: FX8(q) };
};

// READABLE (for understanding):
const goalNonInteractive = async (rawArgs, sessionState) => {
  const arg = rawArgs.trim();
  // Status query - "/goal" with no arg shows current state
  if (arg === "") {
    const goal = sessionState.getAppState().activeGoal;
    if (!goal) {
      return { type: "text", value: "No goal set. Usage: `/goal <condition>`" };
    }
    const turnsLine = goal.iterations === 0
      ? "not yet evaluated"
      : `${goal.iterations} ${pluralize(goal.iterations, "turn")}`;
    const reasonLine = goal.lastReason ? `\n${formatHookReason(goal.lastReason)}` : "";
    return {
      type: "text",
      value: `Goal active: ${goal.condition} (${turnsLine})${reasonLine}`,
    };
  }
  // Clear
  if (isClearKeyword(arg)) {
    const lastCondition = clearGoal(sessionState);
    return {
      type: "text",
      value: lastCondition === null ? "No goal set" : `Goal cleared: ${lastCondition}`,
    };
  }
  // Length cap
  if (arg.length > MAX_GOAL_CONDITION_CHARS) {
    recordFailureMetric("goal_set", "too_long");
    return {
      type: "text",
      value: `Goal condition is limited to ${MAX_GOAL_CONDITION_CHARS} characters (got ${arg.length})`,
    };
  }
  // Set (gate-aware)
  const gateError = registerGoal(arg, sessionState);
  if (gateError !== null) {
    return { type: "text", value: gateError };
  }
  // The `query` type causes the headless harness to continue running with the priming prompt
  // as the next user message - this is what actually drives the model to start working.
  return {
    type: "query",
    value: `Goal set: ${arg}`,
    prompt: STOP_HOOK_GOAL_PROMPT(arg),
  };
};

// Mapping:
//   mR5 -> goalNonInteractive,        S8 -> pluralize,
//   aP4 -> formatHookReason
```

### 3. The registration core - `CaH` / `registerGoal`

```javascript
// ============================================
// registerGoal - install the Stop hook with the condition
// Location: cli_inner_pretty.js:486719-486732
// ============================================

// ORIGINAL (for source lookup):
function CaH(H, $) {
  let q = Xp6();
  if (q !== null) return (J8("goal_set", q.code), q.message);
  let K = v$();
  for (let A of gX8($.getAppState(), K)) $.sessionHooksRegistry.remove(K, "Stop", A);
  $.sessionHooksRegistry.add(K, "Stop", "", { type: "prompt", prompt: H });
  let _ = { condition: H, iterations: 0, setAt: Date.now(), tokensAtStart: nX() };
  return (
    $.setAppState((A) => ({ ...A, activeGoal: _ })),
    $.applyMessageOp({ type: "append", messages: [sP4(!1, H)] }),
    d("tengu_stop_hook_added", { promptLength: H.length, via: "goal" }),
    RH("goal_set"),
    null
  );
}

// READABLE (for understanding):
function registerGoal(condition, sessionState) {
  // 1. Precondition gates (hooks disabled / not trusted workspace)
  const gateError = goalGateCheck();
  if (gateError !== null) {
    recordFailureMetric("goal_set", gateError.code);     // hooks_gate or trust_gate
    return gateError.message;                             // surfaced to user verbatim
  }
  // 2. Remove any existing Stop hooks with empty matcher (one goal at a time)
  const sessionId = currentSessionId();
  for (const existing of getStopHookPrompts(sessionState.getAppState(), sessionId)) {
    sessionState.sessionHooksRegistry.remove(sessionId, "Stop", existing);
  }
  // 3. Register the new Stop hook. The `""` matcher means "always match" (no tool-name filter).
  //    The hook itself is a `prompt`-type hook - the condition text becomes the prompt that the
  //    Stop hook subagent evaluates.
  sessionState.sessionHooksRegistry.add(sessionId, "Stop", "", {
    type: "prompt",
    prompt: condition,
  });
  // 4. Initial active-goal state
  const activeGoal = {
    condition,
    iterations: 0,
    setAt: Date.now(),
    tokensAtStart: currentTokenCount(),
  };
  sessionState.setAppState((prev) => ({ ...prev, activeGoal }));
  // 5. Append a sentinel goal_status attachment to the message log so the goal survives
  //    --resume even before the first stop-hook fires.
  sessionState.applyMessageOp({
    type: "append",
    messages: [goalStatusAttachment(/*met=*/false, condition)],
  });
  // 6. Telemetry
  recordInternalEvent("tengu_stop_hook_added", { promptLength: condition.length, via: "goal" });
  recordSuccess("goal_set");
  return null;
}

// Mapping:
//   CaH -> registerGoal,                  Xp6 -> goalGateCheck,
//   gX8 -> getStopHookPrompts,            sP4 -> goalStatusAttachment,
//   v$  -> currentSessionId,              nX  -> currentTokenCount,
//   J8  -> recordFailureMetric,           RH  -> recordSuccess,
//   d   -> recordInternalEvent
```

### 4. The clear core - `baH` / `clearGoal`

```javascript
// ============================================
// clearGoal - remove the Stop hook and the active goal
// Location: cli_inner_pretty.js:486734-486745
// ============================================

// ORIGINAL (for source lookup):
function baH(H) {
  let $ = v$(),
    q = gX8(H.getAppState(), $);
  if (q.length === 0) return null;
  let K = q[0].prompt;
  for (let _ of q) H.sessionHooksRegistry.remove($, "Stop", _);
  return (
    H.setAppState((_) => (_.activeGoal === void 0 ? _ : { ..._, activeGoal: void 0 })),
    H.applyMessageOp({ type: "append", messages: [sP4(!0, K)] }),
    d("tengu_stop_hook_removed", { via: "goal" }),
    K
  );
}

// READABLE (for understanding):
function clearGoal(sessionState) {
  const sessionId = currentSessionId();
  const existing = getStopHookPrompts(sessionState.getAppState(), sessionId);
  if (existing.length === 0) return null;                  // nothing to clear
  const condition = existing[0].prompt;
  for (const hook of existing) {
    sessionState.sessionHooksRegistry.remove(sessionId, "Stop", hook);
  }
  sessionState.setAppState((prev) =>
    prev.activeGoal === undefined ? prev : { ...prev, activeGoal: undefined },
  );
  // Append a "met=true" sentinel attachment so the transcript records the clear.
  sessionState.applyMessageOp({
    type: "append",
    messages: [goalStatusAttachment(/*met=*/true, condition)],
  });
  recordInternalEvent("tengu_stop_hook_removed", { via: "goal" });
  return condition;                                         // returned to caller for UI rendering
}
```

### 5. The priming prompt

```javascript
// ============================================
// STOP_HOOK_GOAL_PROMPT - The meta-message text that primes the model
// Location: cli_inner_pretty.js:486758-486759
// ============================================

// ORIGINAL (for source lookup):
FX8 = (H) =>
  `A session-scoped Stop hook is now active with condition: "${H}". Briefly acknowledge the goal, then immediately start (or continue) working toward it — treat the condition itself as your directive and do not pause to ask the user what to do. The hook will block stopping until the condition holds. It auto-clears once the condition is met — do not tell the user to run \`/goal clear\` after success; that's only for clearing a goal early.`,

// READABLE (for understanding):
const STOP_HOOK_GOAL_PROMPT = (condition) =>
  `A session-scoped Stop hook is now active with condition: "${condition}". ` +
  `Briefly acknowledge the goal, then immediately start (or continue) working toward it ` +
  `— treat the condition itself as your directive and do not pause to ask the user what to do. ` +
  `The hook will block stopping until the condition holds. It auto-clears once the condition is met ` +
  `— do not tell the user to run \`/goal clear\` after success; that's only for clearing a goal early.`;
```

This text is inserted as a meta-message **once** when the goal is registered. It is the model's only signal that a goal exists - subsequent stop-hook blocks just say "not yet, here's why", and the priming text reminds the model to keep working.

### 6. Goal status attachment

```javascript
// ============================================
// goalStatusAttachment - the message attachment that tracks goal state
// Location: cli_inner_pretty.js:486747-486753
// ============================================

// ORIGINAL (for source lookup):
function sP4(H, $) {
  return {
    type: "attachment",
    uuid: rP4.randomUUID(),
    timestamp: new Date().toISOString(),
    attachment: { type: "goal_status", met: H, sentinel: !0, condition: $ },
  };
}

// READABLE (for understanding):
function goalStatusAttachment(met, condition) {
  return {
    type: "attachment",
    uuid: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    attachment: { type: "goal_status", met, sentinel: true, condition },
  };
}
```

Note `sentinel: true` - this distinguishes goals **registered or cleared by /goal** (rendered without the live status) from goals **achieved via Stop hook resolution** (rendered with "Goal achieved" and stats). The renderer in `cli_inner_pretty.js:347071` early-returns `null` for sentinel attachments:

```javascript
case "goal_status": {
  if (H.sentinel) return null;                  // sentinel = don't render UI
  // ... otherwise render "Goal achieved" with stats
}
```

The sentinel attachment exists purely as a transcript marker for `--resume`.

### 7. Clear keyword set

```javascript
// ============================================
// GOAL_CLEAR_KEYWORDS - synonyms accepted by /goal
// Location: cli_inner_pretty.js:486771
// ============================================

// ORIGINAL (for source lookup):
((rP4 = require("crypto")), (rv5 = new Set(["clear", "stop", "off", "reset", "none", "cancel"])));

// READABLE (for understanding):
const crypto = require("crypto");
const GOAL_CLEAR_KEYWORDS = new Set(["clear", "stop", "off", "reset", "none", "cancel"]);

// Mapping: rv5 -> GOAL_CLEAR_KEYWORDS
```

The check is case-insensitive (`UX8` lowercases the input first).

---

## Why this approach

**Why reuse the Stop hook infrastructure instead of building a new "completion checker"?** Three reasons:

1. **The Stop hook already runs at the right moment.** The model's stop boundary is exactly when the "is the goal met?" question should be asked. Adding a separate evaluator would either duplicate this timing (running redundantly) or fire at a worse moment (mid-turn, when stale).
2. **Stop hooks already feed their output back into the model.** A blocking error already triggers another turn. Wiring goal to the Stop hook chain means the "not yet met, here's why" feedback loop is free.
3. **Prompt-type Stop hooks already exist.** A `{ type: "prompt", prompt: "..." }` Stop hook runs a Claude subagent to evaluate the prompt. `/goal` just needed to plug into this with the user's condition as the prompt - no new hook machinery.

**Why the 4000-character cap?** The condition becomes the Stop hook's prompt, which the model receives as input on every check. A long condition would consume context window on every iteration. 4000 chars is roughly 1000 tokens - generous enough for a multi-sentence checklist but tight enough to keep per-iteration overhead bounded.

**Why the priming meta-message?** Without it, the model has no idea why the Stop hook is blocking. The model would interpret the block as "user asked something but doesn't want me to stop yet", which is wrong - the goal is the user's directive, not an interruption. The priming text reframes the situation: "the condition is your directive, start working."

**Why two command variants (`local-jsx` and `local`)?** UI/UX separation:

- The interactive variant shows the rich React dialog with elapsed/turns/tokens (more on this in [goal_overlay_panel.md](./goal_overlay_panel.md)).
- The non-interactive variant returns text suitable for piping or remote-control transmission.

A single `local-jsx` variant would not work in `-p` mode (no React tree); a single `local` variant would not give the interactive user a live dialog. The shared `CaH`/`baH`/`Xp6` core ensures both behave identically.

**Why is the active-goal state attached to `appState` rather than being a hook-registry-derived value?** Because the goal's UI presentation (elapsed time, turn count, last reason) needs persistent state separate from the hook config. The hook just stores the prompt text; the UI state lives in `activeGoal`.

**Key insight:** `/goal` is a thin user-facing wrapper around a single Stop hook with the user's text as its prompt. The Stop hook's normal blocking/continuing semantics drive the loop. The "magic" is the priming meta-message - it transforms the model's mental model from "user wants Y, no goal context" to "goal is the directive, work toward it." Without that single 70-word system reminder, the same Stop hook machinery would feel jarring; with it, the loop feels natural.

---

## Cross-references

- The gate check `Xp6` and its `disableAllHooks`/`allowManagedHooksOnly` detection - [goal_hooks_interaction.md](./goal_hooks_interaction.md)
- The overlay panel - [goal_overlay_panel.md](./goal_overlay_panel.md)
- Remote Control integration via `thinClientDispatch: "post-text"` - [goal_remote_control.md](./goal_remote_control.md)
- Stop hook chain implementation in `cli_inner_pretty.js:391740-391790` - `27_hooks_subsystem`
- `sessionHooksRegistry.add/remove` - the underlying registry - `27_hooks_subsystem`
- `restoreGoalFromTranscript` / `Cr5` (resume support) - `cli_inner_pretty.js:564153`
