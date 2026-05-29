# Stop-Hook Chain — Goal Consumer (`Co7`)

## What it does

`/goal` is a thin wrapper that **registers** a Stop hook (`registerGoal` / `CaH`) and **renders** its state (`GoalOverlayPanel` / `Xk4`, `GoalActiveBadge` / `Xx4`). The actual "decide whether the goal is met, increment iterations, append goal_status attachments, fire telemetry, write back into appState" lives in the **Stop-hook chain orchestrator** at `cli_inner_pretty.js:391626-391787` (the function `Co7`).

This document covers that orchestrator's goal-related branches in full. The previous docs in this folder reference `cli_inner_pretty.js:391740-391790` in passing but never inline the code — this is the missing piece.

---

## High-level flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ Co7 (pre-stop-hook orchestrator) — called after every assistant turn │
│ before the model is considered "done"                                │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       v
        ┌───────────────────────────────────┐
        │ Build hook-iterator V via S9H()   │
        │ V iterates ALL Stop hook results  │
        │ (managed, user, plugin, session)  │
        └────────────────┬──────────────────┘
                         │
       ┌─────────────────┼───────────────────┐
       v                 v                   v
  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐
  │ hook_       │  │ blocking    │  │ preventContinu  │
  │ success     │  │ Error       │  │ ation           │
  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘
         │                │                  │
         v                v                  v
   ┌─────────────┐  ┌─────────────────┐  ┌──────────┐
   │ if hook is  │  │ append meta-msg │  │ stop the │
   │ session-reg │  │ feeds back into │  │ loop &   │
   │ AND matches │  │ model loop      │  │ yield    │
   │ active goal │  │                 │  │ event    │
   │ → ACHIEVED  │  │ if hook is goal │  └──────────┘
   │   ・remove  │  │ AND matches:    │
   │   ・active_ │  │ → NOT YET MET   │
   │     goal=∅  │  │   ・active_goal │
   │   ・goal_   │  │     {iter++,    │
   │     status  │  │      lastReason}│
   │     met=T   │  │   ・goal_status │
   │   ・telem   │  │     met=F+reason│
   └─────────────┘  └─────────────────┘
```

The crucial thing: a single hook iterator drives both branches. Whether a `/goal` hook resolves as "achieved" or "not yet" depends entirely on what the prompt-type Stop hook subagent decides — `Co7` is just the dispatcher.

---

## How it works

### 1. The orchestrator signature and entry

```javascript
// ============================================
// runStopHookChain - the pre-stop-hook orchestrator
// Location: cli_inner_pretty.js:391626
// ============================================

// ORIGINAL (for source lookup):
async function* Co7(H, $, q, K, _, A, z, Y, f) {
  let O = Date.now(),
    M = { messages: [...H, ...$], systemPrompt: q, userContext: K, systemContext: _, toolUseContext: A, querySource: z };
  // ... brief-mode enforcement, post-turn classifier, etc ...
  let X = null, L = !1;
  try {
    let P = [];
    if (J) P.push(J);
    if (X) P.push(X);
    let Z = A.getAppState(), W = Z.toolPermissionContext.mode;
    let G = (u) => {
      if (!u) return;
      return (rwH(Z, v$(), "Stop").get("Stop") ?? []).flatMap((x) => x.hooks).some((x) => AY8(x, u)) ? u : void 0;
    };
    let V = S9H(W, A.abortController.signal, void 0, Y, A.agentId, A, M.messages, A.agentType);
    // ... iterate V ...
  }
}

// READABLE (for understanding):
// Co7 is invoked once per turn-finish event before the main loop decides whether
// to stop or query the model again. Its job is to:
//   1. Optionally inject a brief-mode meta-message.
//   2. Run the Stop hook chain (S9H async iterator).
//   3. Translate each hook's result into either:
//        - a blocking error meta-message (feeds back into the model)
//        - a goal achievement/state update
//        - a preventContinuation signal (hard stop)
//   4. Run the TaskCompleted hooks if in auto-accept mode.
async function* runStopHookChain(priorMessages, currentMessages, systemPrompt, userContext, systemContext, toolUseContext, querySource, parentAgentSurface, postTurnClassifier) {
  // ... brief-mode setup ...
  const appState = toolUseContext.getAppState();
  // isSessionRegisteredHook — given a hook payload, return it iff it equals a hook currently
  // registered for this session. Identity via AY8 (type + prompt/command/url etc).
  const isSessionRegisteredHook = (incomingHook) => {
    if (!incomingHook) return;
    const sessionStopHooks = getSessionHooksByEvent(appState, currentSessionId(), "Stop").get("Stop") ?? [];
    const allHooks = sessionStopHooks.flatMap((g) => g.hooks);
    return allHooks.some((h) => hookEquals(h, incomingHook)) ? incomingHook : undefined;
  };
  // S9H = the Stop-hook iterator. Yields one result object per hook (managed/user/session).
  const hookIterator = stopHookIterator(
    appState.toolPermissionContext.mode,
    toolUseContext.abortController.signal,
    /*hookFilter=*/ undefined,
    parentAgentSurface,
    toolUseContext.agentId,
    toolUseContext,
    fullMessages,
    toolUseContext.agentType,
  );
  // ... iterate ...
}

// Mapping:
//   Co7 -> runStopHookChain,          rwH -> getSessionHooksByEvent,
//   v$  -> currentSessionId,          AY8 -> hookEquals,
//   S9H -> stopHookIterator,          A   -> toolUseContext
```

### 2. The `isSessionRegisteredHook` filter

```javascript
// ============================================
// isSessionRegisteredHook - filter incoming hook payloads to session-owned
// Location: cli_inner_pretty.js:391717-391720
// ============================================

// ORIGINAL (for source lookup):
G = (u) => {
  if (!u) return;
  return (rwH(Z, v$(), "Stop").get("Stop") ?? []).flatMap((x) => x.hooks).some((x) => AY8(x, u)) ? u : void 0;
};

// READABLE (for understanding):
// Returns `incomingHook` if and only if a hook with the same identity (type + prompt/command/url)
// is currently registered for this session. Used to scope auto-removal and goal handling to
// session-owned hooks — we don't want to act on, e.g., a settings.json-defined Stop hook that
// happens to match the goal prompt by coincidence.
const isSessionRegisteredHook = (incomingHook) => {
  if (!incomingHook) return undefined;
  const sessionStopHooks = getSessionHooksByEvent(appState, currentSessionId(), "Stop").get("Stop") ?? [];
  const allHooks = sessionStopHooks.flatMap((g) => g.hooks);
  return allHooks.some((h) => hookEquals(h, incomingHook)) ? incomingHook : undefined;
};
```

**Why this filter exists:** Stop hooks can come from many tiers — managed policy hooks, user `settings.json` hooks, project hooks, Skill-injected hooks, plugin hooks, and *session* hooks added at runtime by `/goal`. Only session-owned hooks should be auto-removed after firing successfully, and only the session hook whose prompt matches `appState.activeGoal.condition` is "the goal hook". This filter guards both those decisions.

`AY8` (`hookEquals`) compares by `type` plus the type-specific identity field:

```javascript
// ============================================
// hookEquals - identity check by type + key fields
// Location: cli_inner_pretty.js:352528-352559
// ============================================

// ORIGINAL (for source lookup):
function AY8(H, $) {
  if (H.type !== $.type) return !1;
  let q = (K, _) => (K.if ?? "") === (_.if ?? "");
  switch (H.type) {
    case "command": { ... return H.command === $.command && SH(H.args ?? null) === SH($.args ?? null) && (H.shell ?? K) === ($.shell ?? K) && q(H, $); }
    case "prompt": return $.type === "prompt" && H.prompt === $.prompt && q(H, $);
    case "agent":  return $.type === "agent" && H.prompt === $.prompt && q(H, $);
    case "http":   return $.type === "http"   && H.url    === $.url    && q(H, $);
    case "mcp_tool": return ... && H.server === $.server && H.tool === $.tool && SH(H.input ?? {}) === SH($.input ?? {}) && q(H, $);
    case "function": return !1;          // function hooks never compare equal
  }
}

// READABLE (for understanding):
function hookEquals(a, b) {
  if (a.type !== b.type) return false;
  const conditionEq = (x, y) => (x.if ?? "") === (y.if ?? "");
  switch (a.type) {
    case "command":  return a.command === b.command && stableStringify(a.args ?? null) === stableStringify(b.args ?? null) && (a.shell ?? defaultShell()) === (b.shell ?? defaultShell()) && conditionEq(a, b);
    case "prompt":   return a.prompt === b.prompt && conditionEq(a, b);
    case "agent":    return a.prompt === b.prompt && conditionEq(a, b);
    case "http":     return a.url === b.url && conditionEq(a, b);
    case "mcp_tool": return a.server === b.server && a.tool === b.tool && stableStringify(a.input ?? {}) === stableStringify(b.input ?? {}) && conditionEq(a, b);
    case "function": return false;
  }
}
```

For `/goal`, the hook is `{ type: "prompt", prompt: condition }` — so identity is **literally the condition text**. Two goals with the same condition would be `===` and `clearGoal` would remove both at once; in practice the registration in `registerGoal` already calls `getStopHookPrompts` and removes any prior goal first, so this is idempotent.

### 3. The hook-success branch — goal achieved

```javascript
// ============================================
// Co7 hook-success branch (goal-achieved path)
// Location: cli_inner_pretty.js:391736-391770
// ============================================

// ORIGINAL (for source lookup):
if (u.message.type === "attachment") {
  let S = u.message.attachment;
  if ("hookEvent" in S && (S.hookEvent === "Stop" || S.hookEvent === "SubagentStop")) {
    if (S.type === "hook_non_blocking_error") (R.push(S.stderr || `Exit code ${S.exitCode}`), (C = !0));
    else if (S.type === "hook_error_during_execution") (R.push(S.content), (C = !0));
    else if (S.type === "hook_success") {
      if ((S.stdout && S.stdout.trim()) || (S.stderr && S.stderr.trim())) C = !0;
      let x = G(u.hook);
      if (S.hookEvent === "Stop" && x) {
        A.sessionHooksRegistry.remove(v$(), "Stop", x);
        let F = A.getAppState().activeGoal;
        if (F?.condition === x.prompt) {
          let g = F.iterations + 1,
            Q = Date.now() - F.setAt,
            c = nX() - F.tokensAtStart;
          (yield { type: "active_goal", value: void 0 },
            yield fK({ type: "goal_status", met: !0, condition: x.prompt, reason: u.stopReason, iterations: g, durationMs: Q, tokens: c }),
            d("tengu_goal_achieved", { promptLength: x.prompt.length, iterations: g, durationMs: Q, tokens: c }),
            RH("goal_met"));
        }
      }
    }
    if ("durationMs" in S && "command" in S) { ... }
  }
}

// READABLE (for understanding):
if (yielded.message.type === "attachment") {
  const attachment = yielded.message.attachment;
  // Only act on Stop/SubagentStop hook attachments
  if ("hookEvent" in attachment && (attachment.hookEvent === "Stop" || attachment.hookEvent === "SubagentStop")) {
    if (attachment.type === "hook_non_blocking_error") {
      errors.push(attachment.stderr || `Exit code ${attachment.exitCode}`);
      hasUserVisibleHookOutput = true;
    } else if (attachment.type === "hook_error_during_execution") {
      errors.push(attachment.content);
      hasUserVisibleHookOutput = true;
    } else if (attachment.type === "hook_success") {
      // Track that hooks produced visible output (used for the toast at the end of the chain)
      if ((attachment.stdout && attachment.stdout.trim()) || (attachment.stderr && attachment.stderr.trim())) {
        hasUserVisibleHookOutput = true;
      }
      // Goal-achievement path: only run when the hook is session-owned (filter via isSessionRegisteredHook)
      const sessionHook = isSessionRegisteredHook(yielded.hook);
      if (attachment.hookEvent === "Stop" && sessionHook) {
        // Session-owned Stop hooks that succeed get auto-removed — they're "one-shot" hooks
        toolUseContext.sessionHooksRegistry.remove(currentSessionId(), "Stop", sessionHook);
        const goal = toolUseContext.getAppState().activeGoal;
        // Is this the /goal hook?
        if (goal?.condition === sessionHook.prompt) {
          const iterations = goal.iterations + 1;
          const durationMs = Date.now() - goal.setAt;
          const tokens = currentTokenCount() - goal.tokensAtStart;
          // 1. Clear active_goal state — overlay panel/badge will transition to "achieved"
          yield { type: "active_goal", value: undefined };
          // 2. Append a NON-sentinel goal_status attachment with full stats — this renders in
          //    the transcript as "✓ Goal achieved (1m 23s · 5 turns · 2.4k tokens)" via db7.
          yield attachmentMsg({ type: "goal_status", met: true, condition: sessionHook.prompt, reason: yielded.stopReason, iterations, durationMs, tokens });
          // 3. Telemetry
          recordInternalEvent("tengu_goal_achieved", { promptLength: sessionHook.prompt.length, iterations, durationMs, tokens });
          recordSuccess("goal_met");
        }
      }
    }
  }
}

// Mapping:
//   d   -> recordInternalEvent,        RH  -> recordSuccess,
//   fK  -> attachmentMsg,              nX  -> currentTokenCount,
//   C   -> hasUserVisibleHookOutput,   R   -> errors,
//   u   -> yielded,                    A   -> toolUseContext,
//   w8  -> userMessage,                Dy6 -> formatBlockingErrorForModel
```

The exact text the model sees on the next turn (`Dy6` at cli_inner_pretty.js:521309):

```
Stop hook feedback:
<blockingError text from the prompt-Stop subagent>
```

So the model reads "Stop hook feedback: …" as guidance and adjusts its next response accordingly. This is the loop's actual feedback signal — the priming meta-message (from `STOP_HOOK_GOAL_PROMPT` / `FX8`) only fires once at registration; every subsequent block uses `Dy6`'s "Stop hook feedback:" prefix.

**Important subtlety:** the auto-remove (`sessionHooksRegistry.remove`) fires for **any** session-owned Stop hook that returns `hook_success`, not just the goal hook. The goal-specific work (yield active_goal=undefined, yield goal_status, telemetry) is gated on `goal?.condition === sessionHook.prompt`. This means session hooks added by other mechanisms (theoretically — currently `/goal` is the only producer) would also be one-shot.

**Why `hook_success` plus a session-hook match means "achieved":** prompt-type Stop hooks run a Claude subagent that evaluates the prompt and returns either a `hook_success` (the condition holds, allow stopping) or a `blockingError` (the condition does not hold, here's why). So success = condition met.

### 4. The blockingError branch — goal not yet met

```javascript
// ============================================
// Co7 blockingError branch (goal-progress path)
// Location: cli_inner_pretty.js:391778-391787
// ============================================

// ORIGINAL (for source lookup):
if (u.blockingError) {
  let S = w8({ content: Dy6(u.blockingError), isMeta: !0 });
  (P.push(S), yield S, (C = !0));
  let x = G(u.hook),
    F = A.getAppState().activeGoal;
  if (x && F?.condition === x.prompt)
    (yield { type: "active_goal", value: { ...F, iterations: F.iterations + 1, lastReason: u.stopReason } },
      yield fK({ type: "goal_status", met: !1, condition: x.prompt, reason: u.stopReason }));
  else R.push(u.blockingError.blockingError);
}

// READABLE (for understanding):
if (yielded.blockingError) {
  // The blockingError gets re-emitted as an isMeta user message — this is what feeds back
  // into the model loop and triggers another turn. Dy6 formats the error for model consumption
  // as literally:
  //     "Stop hook feedback:\n<blockingError text>"
  // So the model sees the goal-progress reason prefixed with "Stop hook feedback:".
  const errorMetaMsg = userMessage({ content: formatBlockingErrorForModel(yielded.blockingError), isMeta: true });
  blockingErrors.push(errorMetaMsg);
  yield errorMetaMsg;
  hasUserVisibleHookOutput = true;
  const sessionHook = isSessionRegisteredHook(yielded.hook);
  const goal = toolUseContext.getAppState().activeGoal;
  // Is this the /goal hook blocking?
  if (sessionHook && goal?.condition === sessionHook.prompt) {
    // 1. Update active_goal: iterations++ and store the model-facing reason for the overlay panel
    yield {
      type: "active_goal",
      value: { ...goal, iterations: goal.iterations + 1, lastReason: yielded.stopReason },
    };
    // 2. Append a non-sentinel goal_status attachment with met=false + reason —
    //    renders in the transcript as "⏸ Goal not yet met... continuing" + reason via db7.
    yield attachmentMsg({ type: "goal_status", met: false, condition: sessionHook.prompt, reason: yielded.stopReason });
    // Note: the goal hook does NOT get removed on blocking — it stays registered for the next turn.
  } else {
    // Non-goal blocking hook: log to errors-toast collection only
    errors.push(yielded.blockingError.blockingError);
  }
}
```

**The feedback loop in detail:**

1. Model finishes a turn — wants to stop.
2. `Co7` runs the Stop hook chain.
3. The goal's prompt-type Stop hook runs a Claude subagent with the condition as its prompt. The subagent evaluates the messages and decides: met or not met.
4. If not met → the subagent returns a `blockingError` whose `blockingError` text is "why not yet" + `stopReason` is the subagent's reasoning.
5. `Co7` yields an `isMeta` user message containing the formatted error. This message becomes part of the conversation — the model sees it on the next turn.
6. The model treats it as guidance from the user ("you said `<reason>` is still pending") and works on it.
7. After the model's next response, GOTO 2.

The cycle terminates only when the subagent says "yes, met" — at which point the success branch removes the hook, clears `activeGoal`, and the model is free to stop on the next try.

**Why `iterations` is incremented on BLOCKING, not on every turn:** iterations measure how many times the Stop hook had to push back. If the model happens to fully finish on its first turn after `/goal`, the hook returns `hook_success` immediately and `iterations` is `0 + 1 = 1` in the achievement event. If it took 4 turns, the hook blocks 3 times → iterations = 3 at each block, then `3 + 1 = 4` in the achievement event. So the displayed `N turns` count is "how many turns did this goal take to complete".

### 5. The `preventContinuation` branch — hook hard-stop

```javascript
// ============================================
// Co7 preventContinuation branch — not goal-specific but interacts
// Location: cli_inner_pretty.js:391788-391797
// ============================================

// ORIGINAL (for source lookup):
if (u.preventContinuation)
  ((I = !0),
    (h = u.stopReason || "Stop hook prevented continuation"),
    yield fK({ type: "hook_stopped_continuation", message: h, hookName: "Stop", toolUseID: v, hookEvent: "Stop" }));

// READABLE (for understanding):
if (yielded.preventContinuation) {
  hookForcedStop = true;
  forcedStopReason = yielded.stopReason || "Stop hook prevented continuation";
  yield attachmentMsg({ type: "hook_stopped_continuation", message: forcedStopReason, hookName: "Stop", toolUseID: lastToolUseID, hookEvent: "Stop" });
}
```

A `preventContinuation` Stop hook (a different result shape) hard-stops the model loop regardless of `blockingError`. For `/goal`, this is **not** the path — prompt-type Stop hooks use `blockingError` to push back. But other hook configurations could use `preventContinuation` to "kill" the goal loop externally. In that case, `activeGoal` stays in state (no auto-clear) and the user would see "/goal active" forever until they manually `/goal clear`.

**This is a known sharp edge.** `Co7` does not clear `activeGoal` on `preventContinuation`. The goal is technically still "active" — the next manual user turn would still trigger the Stop hook chain and the prompt-Stop hook would run again. The Stop machinery is what owns the goal lifecycle; `preventContinuation` short-circuits the *loop* but doesn't kill the *registration*.

### 6. The abort branch

```javascript
// ============================================
// Co7 abort branch — Esc cancellation
// Location: cli_inner_pretty.js:391798-391806
// ============================================

// ORIGINAL (for source lookup):
if (A.abortController.signal.aborted)
  return (
    d("tengu_pre_stop_hooks_cancelled", { queryChainId: A.queryTracking?.chainId, queryDepth: A.queryTracking?.depth }),
    yield kHH({ toolUse: !1 }),
    { blockingErrors: [], preventContinuation: !0 }
  );

// READABLE (for understanding):
if (toolUseContext.abortController.signal.aborted) {
  recordInternalEvent("tengu_pre_stop_hooks_cancelled", {
    queryChainId: toolUseContext.queryTracking?.chainId,
    queryDepth: toolUseContext.queryTracking?.depth,
  });
  yield cancellationMarker({ toolUse: false });
  return { blockingErrors: [], preventContinuation: true };
}
```

If the user hits Esc mid-Stop-hook-evaluation, the orchestrator bails out with `preventContinuation: true`. The goal again stays in state — the hook will run again on the next turn. **Esc does not clear the goal**, by design; if it did, the user would have no way to interrupt a misbehaving subagent without losing their goal too.

### 7. The `active_goal` event protocol

`yield { type: "active_goal", value: ... }` is a typed *state-write event* that flows through the same channel as messages and attachments. Three independent reducers consume it:

#### Reducer A — main UI subscriber (`424603-424606`)

```javascript
// ============================================
// active_goal reducer (main UI callback bridge)
// Location: cli_inner_pretty.js:424603-424606
// ============================================

// ORIGINAL (for source lookup):
if (H.type === "active_goal") {
  $.onActiveGoal?.(H.value);
  return;
}

// READABLE (for understanding):
if (event.type === "active_goal") {
  // The host (REPL session, Ink renderer) wires onActiveGoal to call setAppState({ activeGoal: value })
  callbacks.onActiveGoal?.(event.value);
  return;
}
```

#### Reducer B — background-session writer (`386552-386555`)

```javascript
// ============================================
// active_goal reducer (background-session state)
// Location: cli_inner_pretty.js:386552-386555
// ============================================

// ORIGINAL (for source lookup):
if (J.type === "active_goal") {
  A?.((X) => (X.activeGoal === J.value ? X : { ...X, activeGoal: J.value }));
  continue;
}

// READABLE (for understanding):
if (event.type === "active_goal") {
  // Reference-equal short-circuit avoids unnecessary re-renders in long-running bg sessions.
  setAppState?.((prev) =>
    prev.activeGoal === event.value ? prev : { ...prev, activeGoal: event.value },
  );
  continue;
}
```

#### Reducer C — streaming SDK output (`600352-600354`)

```javascript
// ============================================
// active_goal reducer (streaming SDK)
// Location: cli_inner_pretty.js:600352-600354
// ============================================

// ORIGINAL (for source lookup):
case "active_goal":
  this.config.setAppState((AH) => (AH.activeGoal === s.value ? AH : { ...AH, activeGoal: s.value }));
  break;

// READABLE (for understanding):
case "active_goal":
  this.config.setAppState((prev) =>
    prev.activeGoal === event.value ? prev : { ...prev, activeGoal: event.value },
  );
  break;
```

**All three converge on the same `appState.activeGoal` field.** The pattern of "yield a typed event from an async generator and let multiple subscribers write state from it" is how Claude Code threads side-effects through its iterator-based message pipeline without smashing global state from inside the generator.

### 8. The `goal_status` attachment in the transcript

`yield fK({ type: "goal_status", ... })` (lines 391752 and 391785) emits a transcript attachment. Note these are **NOT sentinels** (no `sentinel: true` field) — they get rendered, unlike the registration/clear sentinels produced by `goalStatusAttachment` / `sP4`.

The renderer is `db7` at `cli_inner_pretty.js:346787` (the general attachment renderer); see [goal_status_rendering.md](./goal_status_rendering.md) for the full rendering branch.

**Three kinds of `goal_status` attachments exist:**

| Source | `met` | `sentinel` | `iterations`/`durationMs`/`tokens` | `reason` | Renders? |
|--------|-------|-----------|------------------------------------|----------|----------|
| `registerGoal` (`sP4(false, condition)`) | `false` | `true` | absent | absent | no (sentinel) |
| `clearGoal` (`sP4(true, condition)`) | `true` | `true` | absent | absent | no (sentinel) |
| `Co7` achievement (`fK({...})`) | `true` | absent (false) | present | present | yes — "Goal achieved" |
| `Co7` progress block (`fK({...})`) | `false` | absent (false) | absent | present | yes — "Goal not yet met... continuing" |

This split makes the resume path simple: `findGoalToRestore` (`Eg4`) walks newest-first and looks at the most recent `goal_status` attachment.
- If most recent is `met=true` (whether sentinel from `clearGoal` or achievement from `Co7`) → don't restore.
- If most recent is `met=false` (sentinel from `registerGoal` *that wasn't subsequently achieved or cleared*) → restore that condition.

So the "live" non-sentinel "Goal not yet met... continuing" `met=false` attachments do not trigger restoration, because they're written *between* registration and resolution — by the time the session ends, the most recent attachment is either an achievement (`met=true`) or another progress message (`met=false`). 

Wait — a session that ends mid-loop would have a `met=false` non-sentinel as the most recent! Let me re-read `Eg4`:

```javascript
function Eg4(H) {
  if (!H) return null;
  for (let $ = H.length - 1; $ >= 0; $--) {
    let q = H[$];
    if (q?.type !== "attachment" || q.attachment.type !== "goal_status") continue;
    return q.attachment.met ? null : q.attachment.condition;
  }
  return null;
}
```

It returns the condition iff the most recent `met` is `false`. So both the registration sentinel AND a "Goal not yet met" progress attachment will trigger restore. That's correct: in both cases the goal is unfinished. The session just disconnected mid-loop, so resuming should re-register the same Stop hook and let the model continue.

### 9. The auto-remove asymmetry

`Co7` removes the session hook **only on success**, never on `blockingError`. This is essential: if the hook were removed on block, the goal would only get one chance to fail. By keeping the hook registered through every block, the loop can iterate. The hook is only removed when:

- The Stop subagent says "yes, condition holds" → `hook_success` → `Co7` removes it (and the achievement-rendering branch fires).
- The user types `/goal clear` → `clearGoal` (`baH`) removes it directly.
- The session ends (registry is in-memory only) — the next session restores it from the transcript via `restoreGoalFromTranscript` (`Cr5`).

There is no "self-clearing on Nth blocks" or "max iteration" cap. The goal runs forever until met or until the user intervenes. This is deliberate — `/goal` is a "keep going" directive, and a cap would defeat the purpose.

---

## Why this approach

**Why is the goal-completion logic in `Co7` rather than in a separate goal module?** Because the decision "did the goal complete?" is structurally identical to the decision "did the Stop hook return success?" — and `Co7` already has to handle the latter for *every* prompt-type Stop hook, not just the goal hook. Putting the goal-specific branch inside `Co7` means there's exactly one place where the Stop hook chain is consumed; the goal piggybacks on it. The alternative would be a second iteration over hook results in a goal-aware wrapper, which would either duplicate work or require yet another callback protocol.

**Why is the "is this the goal hook" check `goal?.condition === sessionHook.prompt` instead of a hook ID?** Because `sessionHooksRegistry` doesn't expose hook IDs to the consumer — hooks are identified by content (`AY8`). And the goal's content *is* its condition. Using condition-equality means a `/goal X` followed by `/goal clear` followed by `/goal X` re-creates the same hook (same prompt) — but `clearGoal` ensures only one goal hook exists at a time, so the equality is well-defined.

**Why both `yield { active_goal: ... }` AND `yield fK({ goal_status: ... })`?** They serve different surfaces:
- `active_goal` is a **state-write event** — invisible to the user but updates the overlay panel and badge through `appState.activeGoal`.
- `goal_status` is a **transcript attachment** — visible in the conversation history as "Goal achieved" or "Goal not yet met... continuing".

Without `active_goal`, the overlay would not know about iteration/lastReason updates without re-parsing the transcript. Without `goal_status`, the transcript would have no record of progress. Both are needed.

**Why isn't `activeGoal` set with the cleared value from `Co7` instead of using the typed event?** Because `Co7` runs inside an async generator and shouldn't directly mutate app state — it would create a race condition with downstream consumers that read `appState` between yields. The event pattern serializes state writes through the same consumer that handles messages, so iteration order is preserved.

**Why does the blocking branch increment `iterations` while the success branch *also* uses `iterations + 1` for the final count?** Because the success branch fires on the turn the goal completes. If iterations were just `goal.iterations` in the achievement event, a goal that took 1 turn (no blocks) would show "0 turns". `iterations + 1` matches "the number of turns the model spent on this goal", which is the user-meaningful metric.

**Why is there no rate-limiting on the loop?** Because each iteration is a real model turn — the user is paying for it with tokens. The natural rate-limit is the conversation budget (compaction kicks in at ~80% context). And the user can always `/goal clear` or Esc.

---

## Key insight

`Co7` is a **dispatcher**, not a goal-aware orchestrator. It iterates Stop hook results and translates them into three things: a meta-message that feeds back into the model loop (block), an attachment that gets persisted to the transcript (status), and a state-write event that updates the live overlay (active_goal). The "is this the goal hook?" check is one tiny `if` branch — everything else is the same dispatch that happens for every Stop hook.

The goal feature emerges from the composition of:

1. A single Stop hook registered with the user's condition as its prompt (`registerGoal`).
2. The existing prompt-type Stop hook subagent (decides met / not met).
3. The existing `Co7` consumer (translates the subagent's decision into messages, attachments, state writes).
4. The existing app-state pipeline (renders the live UI from state writes).
5. The existing transcript pipeline (renders the inline transcript from attachments).

There is no "goal engine" — the goal is a 4-line registration + a 13-line consumer branch + a single attachment renderer case. The architecture is "thinness" all the way down.

---

## Cross-references

- [goal_command.md](./goal_command.md) — `CaH` (registerGoal) and `baH` (clearGoal) — the producer side that this consumer reads
- [goal_status_rendering.md](./goal_status_rendering.md) — `db7` — the renderer that displays the attachments yielded here
- [goal_overlay_panel.md](./goal_overlay_panel.md) — `Xk4` and `Xx4` — the surfaces that consume `active_goal` events
- [goal_hooks_interaction.md](./goal_hooks_interaction.md) — `Xp6` — the precondition gate (why hooks must be enabled for any of this to fire)
- Stop hook iterator `S9H` (the `for await` source above) — `27_hooks_subsystem`
- Session hooks registry `sessionHooksRegistry.add/remove` — `27_hooks_subsystem`
- Hook event types and `hook_success`/`blockingError`/`preventContinuation` schema — `27_hooks_subsystem`
