# `/goal` — Deep Analysis (Claude Code v2.1.183)

> `/goal <condition>` tells the agent to *keep working until a condition holds*. It does
> this not with a bespoke "agentic loop" but by **installing a session-scoped Stop hook**
> whose `prompt` is the goal condition. The existing Stop-hook machinery — which already
> blocks the agent from stopping when a `prompt`-type Stop hook is unsatisfied — does all
> the gating for free. When the hook is finally satisfied, it auto-clears.
>
> - **Reconstructed readable source (primary input):**
>   - [`reconstructed_source/commands/goal/index.ts`](reconstructed_source/commands/goal/index.ts) — the dual `Command` registration
>   - [`reconstructed_source/commands/goal/goal.tsx`](reconstructed_source/commands/goal/goal.tsx) — interactive Ink dialog + local-jsx `call`
>   - [`reconstructed_source/commands/goal/goalNonInteractive.ts`](reconstructed_source/commands/goal/goalNonInteractive.ts) — shared machinery (`setGoal`/`clearGoal`/validate) + non-interactive twin
> - **Anchor dossier:** [`reconstructed_source/_anchors_goal.md`](reconstructed_source/_anchors_goal.md)
> - **Conventions:** [`reconstructed_source/_conventions.md`](reconstructed_source/_conventions.md)
> - **Registration/dispatch context:** [`registration_and_dispatch.md`](registration_and_dispatch.md)
> - **PRIMARY truth (183 bundle):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (cited `cli_inner_pretty.js:NNN`)
> - **Before-picture:** v2.1.156 bundle (tagged `(v2.1.156)`); `/goal` has **no** v2.1.88 named-TS ancestor (2.1.156-era feature).

---

## 1. What `/goal` is

`/goal` is unique among the four reconstructed slash commands: it is **not** a bundled skill
registered through `registerBundledSkill` (`ap`). Instead it is a **dual `Command`** — two
separate command objects sharing the name `"goal"`, one interactive and one non-interactive
(`cli_inner_pretty.js:562050-562070`):

- `goalLocalJsxCommand` (`Cmf`) — `type:"local-jsx"`, `immediate:true`, the interactive entry
  that opens an Ink dialog (`cli_inner_pretty.js:562050-562056`).
- `goalCommand` (`Imf`) — `type:"local"`, the non-interactive twin / thin-client path with
  `supportsNonInteractive:true` and `thinClientDispatch:"post-text"` (`cli_inner_pretty.js:562058-562068`).
- default export `xmf = Cmf` (`cli_inner_pretty.js:562070`).

All the *behavior* — installing/removing the Stop hook, validating the condition, the gate
checks, the analytics — lives in a small shared machinery module (`FWe`,
`cli_inner_pretty.js:454437-454519`) that both entries import. The two command objects are
thin dispatchers over that machinery.

---

## 2. THE STOP-HOOK MECHANISM (core algorithm)

This is the entire point of `/goal`, and the most interesting design decision in the command.

### setGoal — installing the goal as a Stop hook

**What it does:** Turns a user-supplied condition string into a *session-scoped, empty-matcher,
`prompt`-type Stop hook* whose `prompt` IS the raw condition, records the active goal in app
state, drops a sentinel marker into the transcript, and emits analytics.

**How it works** — step by step (`setGoal` = `Qdt`, `cli_inner_pretty.js:454466-454479`;
readable mirror in [`goalNonInteractive.ts:148`](reconstructed_source/commands/goal/goalNonInteractive.ts#L148)):

1. **Gate check.** Call `goalGateCheck` (`ego`). If it returns a blocking `{message, code}`,
   log `tengu_feature_sad` with that `code` and return the message (shown to the user); do
   not install anything (`cli_inner_pretty.js:454467-454468`). Gates are analyzed in §6.
2. **Resolve the session.** `sessionId = getSessionId()` (`xt`) scopes the hook to this
   session only — it is never written to settings or persisted (`cli_inner_pretty.js:454469`).
3. **Replace any prior goal.** Iterate `findStopPromptHooks(appState, sessionId)` and remove
   each via `sessionHooksRegistry.remove(sessionId, "Stop", hook)`
   (`cli_inner_pretty.js:454470`). This guarantees *at most one* active goal — setting a new
   goal silently supersedes the old one. `findStopPromptHooks` (`Jdt`) is the identity test
   for "a hook goal installed": empty `matcher` AND no `skillRoot` AND `type:"prompt"`
   (`cli_inner_pretty.js:454453-454459`). The empty matcher and absent `skillRoot` are what
   distinguish a goal hook from user-configured Stop hooks and skill-provided hooks.
4. **Install the hook.** `sessionHooksRegistry.add(sessionId, "Stop", "", { type:"prompt", prompt:condition })`
   (`cli_inner_pretty.js:454471`). The matcher is the empty string `""` (matches every Stop),
   and crucially the hook's `prompt` **is the bare condition** — *not* the
   `buildGoalPrompt(...)` directive (that directive goes into the *conversation*, see §2.3).
5. **Record app-state.** Set `activeGoal = { condition, iterations:0, setAt:Date.now(), tokensAtStart:getOutputTokens() }`
   (`cli_inner_pretty.js:454473-454474`). The `setAt`/`tokensAtStart` baselines let the UI show
   elapsed-since-set and tokens-spent-since-set.
6. **Append a set sentinel.** `applyMessageOp({ type:"append", messages:[makeGoalStatusAttachment(false, condition)] })`
   drops a synthetic `goal_status` attachment with `met:false, sentinel:true` into the
   transcript (`cli_inner_pretty.js:454475`). See §4 for why sentinels matter.
7. **Analytics.** `tengu_stop_hook_added { promptLength, via:"goal" }` and `tengu_feature_ok("goal_set")`
   (`cli_inner_pretty.js:454476-454477`). Return `null` (success).

**Why a Stop hook instead of a bespoke loop — the altitude/reuse insight:**

Claude Code *already* has a machine for "do not let the agent stop yet": the **Stop-hook
evaluator**. When the agent reaches a natural stopping point, every registered `Stop` hook
runs; a `prompt`-type Stop hook re-invokes the model with the hook's `prompt`, and if the
model decides the work is *not* done it yields a `blockingError` that prevents the stop and
feeds a reason back into the conversation. `/goal` realizes that **"keep working until
condition X holds" is exactly "a Stop hook that blocks until X holds"** — so instead of writing
a parallel control loop (poll, re-prompt, decide, repeat), it leases the Stop-hook machinery by
registering one hook whose prompt is the condition.

- *Alternative considered (inferable):* a dedicated goal loop in the agent driver (read goal →
  if unmet, synthesize a continuation message → re-run). That would duplicate the stop-decision
  logic, the re-prompt plumbing, and the blocking/yield protocol that Stop hooks already
  implement, and it would have to be threaded through every place the agent can stop.
- *Trade-off accepted:* `/goal` inherits the Stop-hook system's constraints — most visibly, it
  **cannot run when hooks are restricted** (§6), and it shares the Stop evaluator's quirks (e.g.
  it must defer evaluation while background work is still running, §5). It also means the goal's
  "is it done?" judgment is made by the same model-as-judge mechanism Stop hooks use, with all
  the latency that implies.
- *Trade-off won:* near-zero new control-flow surface. The whole command is ~80 lines of
  machinery; the loop, the blocking, the re-prompt, and the conversation-injection are all
  free.

**Key insight:** the goal is encoded in *two* places with *two* different texts, and conflating
them is the easy mistake. The **Stop hook's `prompt` is the raw condition** (line 454471) —
that is what the Stop evaluator re-prompts the model with to judge "done yet?". The
**conversation** receives `buildGoalPrompt(condition)` (the long directive) as a meta-message —
that is what tells the model to *start working and stop asking*. One is the recurring judge
prompt; the other is the one-time kickoff directive.

### 2.2 Auto-clear: what completes the lifecycle at runtime

`setGoal` only *installs*. The goal is *retired* by the Stop-hook evaluator at runtime, which
is where "auto-clears once the condition is met" actually happens (Stop-hook goal-evaluation
block, `cli_inner_pretty.js:457105-457210`):

- Before evaluating, if background tasks are still running the evaluator *removes* the goal hook
  for this turn and logs `[goal] evaluation deferred — background work still running`
  (`cli_inner_pretty.js:457108-457111`) — you do not judge a goal "unmet" while async work is
  in flight.
- On a **`hook_success`** whose hook matches the active goal's condition: it removes the hook,
  yields `{ type:"active_goal", value:void 0 }` to **clear `activeGoal`**, and emits a *real*
  (non-sentinel) `goal_status` attachment with `met:true`, plus the elapsed `durationMs`,
  `iterations+1`, and tokens-spent, then logs `tengu_goal_achieved` / `logFeatureOk("goal_met")`
  (`cli_inner_pretty.js:457146-457186`). If the model judged the goal *impossible*
  (`U.impossible`), it instead emits `met:false, failed:true`, logs `tengu_goal_failed` and
  `goal_met → "impossible"` — an impossible goal is also retired, not looped forever
  (`cli_inner_pretty.js:457149-457167`).
- On a **`blockingError`** (goal still unmet): it does **not** clear; it yields an updated
  `activeGoal` with `iterations: iterations+1` and `lastReason: stopReason`, and emits a
  `met:false` `goal_status` so the conversation carries the "still working" reason
  (`cli_inner_pretty.js:457200-457207`). This is what populates the `iterations` counter and the
  `lastReason` the dialog shows as "Last check: …".

So the full lifecycle is: `setGoal` installs → the Stop evaluator re-judges on every stop,
bumping `iterations`/`lastReason` while unmet → on met (or impossible) it removes the hook,
clears `activeGoal`, and writes the achieved/failed sentinel. The user never has to run
`/goal clear` on success — which is exactly what `buildGoalPrompt` tells the model.

### 2.3 buildGoalPrompt — the kickoff directive

**What it does:** Produces the verbatim text injected into the *conversation* (not the hook)
when a goal is set, telling the model to acknowledge, start working immediately, treat the
condition as its directive, and not nag the user to clear the goal after success.

```javascript
// ============================================
// buildGoalPrompt — the one-time kickoff directive injected into the conversation on set
// Location: cli_inner_pretty.js:454505
// ============================================

// ORIGINAL (for source lookup):
UGn = (e) => `A session-scoped Stop hook is now active with condition: "${e}". Briefly acknowledge the goal, then immediately start (or continue) working toward it — treat the condition itself as your directive and do not pause to ask the user what to do. The hook will block stopping until the condition holds. It auto-clears once the condition is met — do not tell the user to run \`/goal clear\` after success; that's only for clearing a goal early.`

// READABLE (for understanding):
export const buildGoalPrompt = (condition: string): string =>
  `A session-scoped Stop hook is now active with condition: "${condition}". Briefly acknowledge the goal, then immediately start (or continue) working toward it — treat the condition itself as your directive and do not pause to ask the user what to do. The hook will block stopping until the condition holds. It auto-clears once the condition is met — do not tell the user to run \`/goal clear\` after success; that's only for clearing a goal early.`

// Mapping: UGn→buildGoalPrompt, e→condition, —→— (em dash, two occurrences)
```

The directive is injected differently by the two entries — as `metaMessages` (local-jsx) or as
the query `prompt` (non-interactive) — but the text is identical (`cli_inner_pretty.js:454505`).
Note the directive's own self-description ("The hook will block stopping until the condition
holds. It auto-clears once the condition is met") is the user-facing explanation of the §2.1/§2.2
machinery.

---

## 3. THE DUAL COMMAND — why two entries

**What it does:** Registers two `Command` objects under the same name so the *same* `/goal` works
both as an interactive dialog in a TUI session and as a deterministic text-returning command in
non-interactive / thin-client contexts, with only one ever visible at a time.

**How the routing works** (`cli_inner_pretty.js:562050-562070`,
[`index.ts:30`](reconstructed_source/commands/goal/index.ts#L30)):

- **`Cmf` (local-jsx, the interactive entry)** has `immediate:true` and a lazy
  `load: () => import('./goal.js')` (`cli_inner_pretty.js:562055-562056`). It does not declare
  `isHidden`/`isEnabled`, so it is the default visible entry in an interactive session. Its
  `call(onDone, context, args)` returns an Ink node (the dialog) or `null`.
- **`Imf` (local, the non-interactive twin)** is the gated mirror:
  - `get isHidden() { return !isNonInteractive() }` — `!xr()`: **hidden whenever the session
    *is* interactive** (`cli_inner_pretty.js:562065`). So in a normal TUI you never see the twin;
    you see `Cmf`.
  - `isEnabled: () => isNonInteractive() || isRemoteWorkspace()` — `xr() || _a()`: **enabled only
    when non-interactive OR in a remote workspace** (`cli_inner_pretty.js:562067`).
  - `supportsNonInteractive:true` + `thinClientDispatch:"post-text"` — the result is routed back
    into the thin client as posted text (`cli_inner_pretty.js:562061-562062`).

**Why two entries instead of one:** the two execution contexts have *incompatible* protocols.
A `local-jsx` command must return a React/Ink node and finish through an `onDone(text, opts)`
callback — that is meaningless without a terminal UI. A non-interactive run needs a *value*
returned synchronously (`{ type:"text"|"query", value, prompt }`) that can be serialized to a
thin client. Rather than branch a single command on "am I interactive?", `/goal` ships **two
purpose-built command objects** and lets the menu's `isHidden`/`isEnabled` predicates pick
exactly one for the current context.

- *Alternative considered:* a single `local-jsx` command that internally checks
  `isNonInteractive()` and returns text vs a node. This is awkward because the command *type*
  (`local-jsx` vs `local`) is read by the dispatcher before `call` even runs, and it changes how
  results are delivered (callback vs return value, JSX vs serializable text).
- *Trade-off:* slight duplication of the dispatch ladder (empty/clear/too-long/set appears in
  both `Tmf` and `wmf`), accepted in exchange for each entry being a clean, single-protocol
  object. The duplicated ladders are kept in lockstep by delegating all real work to the shared
  machinery (`setGoal`/`clearGoal`/`isClearKeyword`/`MAX_GOAL_CONDITION_CHARS`/`buildGoalPrompt`).

**Key insight:** `isHidden` (`!isNonInteractive`) and `isEnabled` (`isNonInteractive || isRemoteWorkspace`)
are *complementary mirrors* of the same `isNonInteractive` predicate, so exactly one of `Cmf`/`Imf`
is the live `/goal` in any context. The remote-workspace clause in `isEnabled` is the one
asymmetry: a remote workspace enables the twin even when nominally "interactive", because remote
workspaces drive `/goal` through the thin-client text protocol.

### 3.1 The two dispatch ladders

Both ladders are: empty → clear-keyword → too-long → set. The only difference is the result
shape (the protocol difference above):

- **Interactive `call` (`Tmf`, `cli_inner_pretty.js:561989-562005`,
  [`goal.tsx:185`](reconstructed_source/commands/goal/goal.tsx#L185)):**
  - empty → render `<ActiveGoalDialog>`; dismiss is a silent `onDone(undefined, { display:'skip' })`.
  - clear → `clearGoal(context)`, then `onDone("No goal set" | "Goal cleared: …", { display:'system' })`.
  - too-long → `logFeatureSad('goal_set','too_long')` + system message.
  - set → `setGoal`; on error surface it as a system message; on success
    `onDone("Goal set: …", { shouldQuery:true, metaMessages:[buildGoalPrompt(arg)] })` — the
    directive rides in as a meta-message that triggers the next query (`cli_inner_pretty.js:562005`).
- **Non-interactive `call` (`wmf`, `cli_inner_pretty.js:562015-562039`,
  [`goalNonInteractive.ts:207`](reconstructed_source/commands/goal/goalNonInteractive.ts#L207)):**
  - empty → returns the *status text* (`Goal active: <cond> (<status>)` or
    `No goal set. Usage: …`), not a dialog (`cli_inner_pretty.js:562019-562025`).
  - clear / too-long → returns `{ type:'text', value:… }`.
  - set → returns `{ type:'query', value:"Goal set: …", prompt:buildGoalPrompt(arg) }` — here the
    directive is the *query prompt* rather than a meta-message (`cli_inner_pretty.js:562038`).

---

## 4. LIFECYCLE — set / clear / show, and the sentinel attachments

`/goal`'s state lives in two places that must stay consistent: `state.activeGoal` (live, for the
UI) and the **transcript** (a sequence of `goal_status` attachments, for history/"Goal achieved").
The transcript markers come in two flavors:

- **Sentinels** (`makeGoalStatusAttachment` = `hQa`, `cli_inner_pretty.js:454494-454500`): synthetic
  `goal_status` attachments with `sentinel:true`, written by `setGoal` (`met:false`) and `clearGoal`
  (`met:true`). They mark the *user actions* set/clear in the transcript.
- **Real status** (written by the Stop evaluator, §2.2): non-sentinel `goal_status` attachments with
  full stats, written on achieved/failed/still-unmet.

**`findLastAchievedGoal` (`AQa`, `cli_inner_pretty.js:454440-454451`)** is why sentinels carry
`sentinel:true`: it scans the transcript newest-first for the last `goal_status` that is
`met && !sentinel` — i.e. a *genuine* achievement, skipping the synthetic clear sentinel (which is
also `met:true`). Without the `sentinel` discriminator, a manual `/goal clear` (which writes
`met:true`) would falsely render as "Goal achieved". This drives **dialog branch 2** (§5).

**`clearGoal` (`Zdt`, `cli_inner_pretty.js:454481-454492`)**, the explicit early-stop path:

1. `findStopPromptHooks`; if none, return `null` → caller shows "No goal set"
   (`cli_inner_pretty.js:454484`).
2. Capture `clearedPrompt = hooks[0].prompt`, remove every goal hook
   (`cli_inner_pretty.js:454485-454486`).
3. Clear `activeGoal` (no-op-guarded if already undefined) (`cli_inner_pretty.js:454488`).
4. Append the **clear sentinel** `makeGoalStatusAttachment(true, clearedPrompt)`
   (`cli_inner_pretty.js:454489`), log `tengu_stop_hook_removed { via:"goal" }`
   (`cli_inner_pretty.js:454490`), return `clearedPrompt` for the "Goal cleared: …" message.

**`iterations` counter and `lastReason`** are *not* touched by set/clear/show — they are bumped
only by the runtime Stop evaluator (§2.2, `cli_inner_pretty.js:457203-457204`): each unmet
re-check is `iterations+1` and stores the model's `stopReason` as `lastReason`.
**`formatLastReason` (`gQa`, `cli_inner_pretty.js:454450-454451`)** renders it as a single line
`Last check: <collapsed reason>` for both the dialog (§5) and the non-interactive status text.

**Analytics** trace the whole lifecycle: `tengu_stop_hook_added`/`tengu_stop_hook_removed`
(set/clear, `cli_inner_pretty.js:454476`, `:454490`), `tengu_feature_ok("goal_set")`
(`cli_inner_pretty.js:454477`), `tengu_feature_sad("goal_set", code)` (gate/too-long), and at
runtime `tengu_goal_failed` (`cli_inner_pretty.js:457160`) / `tengu_goal_achieved` (`cli_inner_pretty.js:457178`).

---

## 5. The interactive dialog (`ActiveGoalDialog`)

**What it does:** Renders one of three states when the user runs a bare `/goal` interactively —
active goal (with live-ticking stats), recently-achieved goal, or nothing set.

**How it works** (`ActiveGoalDialog` = `APl`, `cli_inner_pretty.js:561812-561940`,
[`goal.tsx:81`](reconstructed_source/commands/goal/goal.tsx#L81)):

- It reads the goal via `selectActiveGoal` (`vmf`, `state => state.activeGoal`,
  `cli_inner_pretty.js:561946`) and arms a 1-second `useInterval` *only while a goal is active*
  (`du(i, goal ? 1000 : null)`, `cli_inner_pretty.js:561820`); the tick callback is `incrementIterations`
  (`Hmf`, `n => n+1`, `cli_inner_pretty.js:561943`) used purely to force a re-render so the
  "running <duration>" subtitle advances. (This `incrementIterations` is a *render tick*, unrelated to
  the goal's own `iterations` field, which the Stop evaluator owns.)
- **Branch 1 — active:** title `◎ Goal active`, subtitle
  `running <dur> · <n> turn(s) · <tokens> tokens` (turns part omitted when `iterations===0`),
  a `Goal:` row and (if present) a `Last check:` row from `collapseNewlines(lastReason)`; input
  guide `/goal clear to stop early` (`cli_inner_pretty.js:561820-561875`).
- **Branch 2 — achieved:** if no active goal but `findLastAchievedGoal(messages)` finds a real met
  goal, render a success-colored "Goal achieved" with its `durationMs`/`iterations`/`tokens`
  subtitle and guide `/goal <condition> to set another` (`cli_inner_pretty.js:561880-561930`).
- **Branch 3 — none:** a plain "Goal" dialog with `No goal set` and hint
  `/goal <condition> to set one` (`cli_inner_pretty.js:561931-561939`).

(The bundle's `APl` is React-compiler-cached — the `t[…]` memo slots; the reconstruction omits the
cache bookkeeping and preserves render behavior, per the task allowance.)

---

## 6. GATES — hooks-restricted before trust, length, and clear keywords

### goalGateCheck — order matters

**What it does:** Returns a blocking `{ message, code }` if `/goal` cannot run, else `null`. The
*order* of the two checks is load-bearing.

```javascript
// ============================================
// goalGateCheck — refuses /goal when hooks are restricted (checked FIRST) or untrusted
// Location: cli_inner_pretty.js:454461
// ============================================

// ORIGINAL (for source lookup):
function ego() {
  if (f2() || Qse()) return { message: zUp, code: "hooks_gate" };
  if (!xr() && !Lp()) return { message: VUp, code: "trust_gate" };
  return null;
}

// READABLE (for understanding):
function goalGateCheck(): { message: string; code: 'hooks_gate' | 'trust_gate' } | null {
  if (isHooksDisabledByPolicy() || isHooksRestricted())
    return { message: HOOKS_GATE_MESSAGE, code: 'hooks_gate' }
  if (!isNonInteractive() && !isTrusted())
    return { message: TRUST_GATE_MESSAGE, code: 'trust_gate' }
  return null
}

// Mapping: ego→goalGateCheck, f2→isHooksDisabledByPolicy, Qse→isHooksRestricted,
//   xr→isNonInteractive, Lp→isTrusted, zUp→HOOKS_GATE_MESSAGE, VUp→TRUST_GATE_MESSAGE
```

**Why hooks-restricted is checked *before* trust** (`cli_inner_pretty.js:454461-454464`): `/goal`
*is* a Stop hook (§2). If hooks are restricted, the command **cannot function at all** regardless
of trust — installing the hook would silently do nothing. So the hooks gate is the more
fundamental "this feature is structurally unavailable" failure, and reporting it first gives the
user the accurate reason (the `HOOKS_GATE_MESSAGE` names the exact settings:
`disableAllHooks` / `allowManagedHooksOnly`) instead of a misleading "untrusted workspace"
message. The predicates:
- `isHooksDisabledByPolicy` (`f2`) — `policySettings.disableAllHooks === true`
  (`cli_inner_pretty.js:150375`).
- `isHooksRestricted` (`Qse`) — `policySettings.allowManagedHooksOnly === true`, OR settings
  `disableAllHooks` with policy not overriding (`cli_inner_pretty.js:150369-150374`).

The **trust** gate is intentionally *softer*: `!isNonInteractive() && !isTrusted()`
(`cli_inner_pretty.js:454463`). Trust is only required in an *interactive* session — a
non-interactive run skips the trust gate entirely (a deliberate carve-out so headless/CI usage
isn't blocked on the interactive trust dialog). `isTrusted` is `Lp` (`cli_inner_pretty.js:591980`).

### Length gate and clear keywords

- **`MAX_GOAL_CONDITION_CHARS`** (`Xdt` = `4000`, `cli_inner_pretty.js:454503`): a condition longer
  than 4000 chars is rejected *before* install with `logFeatureSad('goal_set','too_long')` and a
  message stating the limit and the actual length (both ladders, `cli_inner_pretty.js:561997`,
  `:562033`). 4000 chars bounds the recurring Stop-hook re-prompt cost.
- **`CLEAR_KEYWORDS`** (`qUp` = `{clear, stop, off, reset, none, cancel}`, assigned at module init,
  `cli_inner_pretty.js:454518`): `isClearKeyword(arg)` (`FGn`) is a case-insensitive set membership
  test (`cli_inner_pretty.js:454437-454438`). Any of these six words as the whole argument routes
  to `clearGoal` rather than being treated as a (one-word) goal condition — a small affordance so
  natural "stop"/"cancel" phrasings clear the goal.

---

## 7. EVOLUTION — 2.1.156 → 2.1.183 delta

`/goal` is a **2.1.156-era feature with no v2.1.88 named-TS ancestor**; the reconstruction mirrors
the `commands/effort/` `local-jsx` idiom for shape only (the machinery is reconstructed straight
from the 183 bundle).

The **2.1.156 → 2.1.183 delta is two strings**: one description and one gate message.

**(a) Local-jsx description.** In v2.1.156 *both* command objects shared the identical
description "Set a goal — keep working until the condition is met"
(`cli_inner_pretty.js:538354` and `:538364` (v2.1.156)). In v2.1.183:

- the **local-jsx** entry `Cmf` now reads **"Set a goal Claude checks before stopping"**
  (`cli_inner_pretty.js:562053`);
- the **local twin** `Imf` still reads "Set a goal — keep working until the condition is met"
  (`cli_inner_pretty.js:562063`).

So 2.1.183 gives the interactive and non-interactive entries **distinct menu descriptions** for
the first time.

**(b) HOOKS_GATE_MESSAGE wording.** The hooks-gate string also changed: v2.1.156 (`Sg_`) read
"…hooks **are disabled** (disableAllHooks or allowManagedHooksOnly…)" (`cli_inner_pretty.js:447986`
(v2.1.156)); v2.1.183 (`zUp`) reads "…hooks **are restricted** (…)" (`cli_inner_pretty.js:454509`).
The word "disabled" became "restricted" — the gate *logic* (hooks-check before trust) is unchanged.

Everything else is byte-identical: the Stop-hook install/clear, `buildGoalPrompt`
text (156 @447983 == 183 @454505), validation, `MAX=4000`, clear keywords, gate ordering,
`TRUST_GATE_MESSAGE`, and analytics are unchanged (the `isHidden`/`isEnabled` predicates moved
from 156's `R6`/`d6` to 183's `xr`/`_a` — same `!isNonInteractive()` /
`isNonInteractive() || isRemoteWorkspace()` semantics, just re-mangled names).

---

## Related Symbols

> Symbol mappings live only in the central index files, never as tables here.
> Slash Commands route to the **Integrations** index per project conventions:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure (LSP, Chrome, IDE, UI, Plugin, Slash Commands)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks / Steering adjacent)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure (Permissions/Trust, Telemetry)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Stop-hook evaluator)

Key functions in this document:
- `goalLocalJsxCommand` (`Cmf`) — interactive `local-jsx` entry; new 183 description "Set a goal Claude checks before stopping" (cli_inner_pretty.js:562050)
- `goalCommand` (`Imf`) — non-interactive `local` twin; `isHidden:!isNonInteractive`, `isEnabled:isNonInteractive||isRemoteWorkspace`, `thinClientDispatch:"post-text"` (cli_inner_pretty.js:562058)
- default export (`xmf`) — `= Cmf` (cli_inner_pretty.js:562070)
- `setGoal`/`validateGoalCondition` (`Qdt`) — installs the empty-matcher `prompt` Stop hook; gate → replace → install → state → sentinel → analytics (cli_inner_pretty.js:454466)
- `clearGoal` (`Zdt`) — removes goal Stop hook(s), clears `activeGoal`, appends met sentinel (cli_inner_pretty.js:454481)
- `buildGoalPrompt` (`UGn`) — verbatim kickoff directive injected into the conversation on set (cli_inner_pretty.js:454505)
- `goalGateCheck` (`ego`) — hooks-restricted (checked first) then trust gate (cli_inner_pretty.js:454461)
- `findStopPromptHooks` (`Jdt`) — identifies goal hooks: empty matcher + no skillRoot + `type:"prompt"` (cli_inner_pretty.js:454453)
- `makeGoalStatusAttachment` (`hQa`) — synthetic `goal_status` sentinel (`sentinel:true`); `met:false` on set, `met:true` on clear (cli_inner_pretty.js:454494)
- `findLastAchievedGoal` (`AQa`) — newest-first scan for last `met && !sentinel` `goal_status` (cli_inner_pretty.js:454440)
- `formatLastReason` (`gQa`) — `Last check: <collapsed reason>` (cli_inner_pretty.js:454450)
- `isClearKeyword` (`FGn`) / `CLEAR_KEYWORDS` (`qUp`) — `{clear,stop,off,reset,none,cancel}` (cli_inner_pretty.js:454437, :454518)
- `MAX_GOAL_CONDITION_CHARS` (`Xdt`) — `4000` (cli_inner_pretty.js:454503)
- `TRUST_GATE_MESSAGE` (`VUp`) / `HOOKS_GATE_MESSAGE` (`zUp`) — gate strings (cli_inner_pretty.js:454507, :454508)
- interactive `call` (`Tmf`) — empty→dialog / clear / too-long / set→`metaMessages` (cli_inner_pretty.js:561989)
- non-interactive `call` (`wmf`) — empty→status / clear / too-long / set→`{type:'query',prompt}` (cli_inner_pretty.js:562015)
- `ActiveGoalDialog` (`APl`) — active / achieved / no-goal render branches (cli_inner_pretty.js:561812)
- `selectActiveGoal` (`vmf`) / `incrementIterations` (`Hmf`, render tick) (cli_inner_pretty.js:561946, :561943)
- Stop-hook goal evaluator (runtime auto-clear; emits achieved/failed/unmet `goal_status`, bumps `iterations`/`lastReason`) (cli_inner_pretty.js:457105, :457146, :457200)
- `isHooksDisabledByPolicy` (`f2`) / `isHooksRestricted` (`Qse`) / `isTrusted` (`Lp`) / `isNonInteractive` (`xr`) / `isRemoteWorkspace` (`_a`) — gate predicates (cli_inner_pretty.js:150375, :150369, :591980, :3151, :3638)
