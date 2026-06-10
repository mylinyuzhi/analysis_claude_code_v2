# EnterPlanMode Tool — Deep Deobfuscation (v2.1.156)

> **Scope / Source.** This document analyzes the `EnterPlanMode` tool exactly as it exists in
> Claude Code **v2.1.156**. Every claim is grounded in the pretty-printed obfuscated bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
> (cited as `cli_inner_pretty.js:<line>`; all line numbers were read and verified for this build).
> Readable names are recovered from the v2.1.88 TypeScript precursor
> `/lyz/codespace/3rd/claude-code/src/tools/EnterPlanModeTool/` and used for cross-validation only —
> they are NOT evidence for v2.1.156 behavior, which is taken from the bundle itself.
> The v2.1.142 analysis doc was used as a structure/format reference; all content here is re-grounded in v2.1.156.

## TL;DR

`EnterPlanMode` is a **deferred, read-only, concurrency-safe** tool with **no input parameters** that
asks the user for permission to flip the interactive session into *plan mode*. The tool object is
`EnterPlanModeTool` (obfuscated: `hL8`, `cli_inner_pretty.js:349703-349766`), built via the shared
tool factory `buildTool` (`yK`) and named via the constant `og = "EnterPlanMode"` (`143385`).
Its `call(input, context)` does three things: (1) hard-**throws** if `context.agentId` is set
(subagents cannot enter plan mode), (2) toggles a pending plan-mode-exit attachment flag via
`handlePlanModeTransition` (`Tt`), and (3) atomically transforms the permission context with
`prepareContextForPlanMode` (`xhH`) and then sets the mode to `"plan"` (session-scoped) via
`applyPermissionUpdate` (`nY`). The model-facing `tool_result` re-injects a 6-step read-only workflow
ending with *"DO NOT write or edit any files yet."*

**Three things changed vs v2.1.88:** (1) the `isEnabled` gate was rewritten from a KAIROS
feature-flag predicate to a pure capability gate (`channels configured && non-interactive`);
(2) the entire `isPlanModeInterviewPhaseEnabled()` / `USER_TYPE === 'ant'` branching collapsed into a
single always-on variant in both the prompt and the result footer (0 grep hits remain); and (3) a
**new shell-alias branch** in the `## What Happens in Plan Mode` section surfaces `find`/`grep`
aliases when the session is interactive and bash is available.

---

## 1. Overview: what EnterPlanMode is and where it lives

`EnterPlanMode` is the single model-callable lever that transitions a session into plan mode. It is
*deferred* (`shouldDefer: true`), so the agent loop re-evaluates its applicability before each turn
rather than statically advertising it. It exposes **zero parameters** — the model emits
`{"name":"EnterPlanMode","input":{}}` and nothing else.

The tool descriptor lives in a lazily-initialized module body at `cli_inner_pretty.js:349690-349767`.
Three top-level vars are declared (`TL_`, `VL_`, `hL8`) and assigned inside the module initializer
`ru6` (`349691`). The descriptor itself (`hL8`) is the output of `buildTool` (`yK`, `143482`).

The tool name is a frozen string constant interned alongside its sibling plan-mode tools:

```javascript
// ============================================
// Plan-mode tool name constants - interned literals
// Location: cli_inner_pretty.js:143385-143388
// ============================================

// ORIGINAL (for source lookup):
var og = "EnterPlanMode";
var oG = "ExitPlanMode",
  wv = "ExitPlanMode";
var ez = "AskUserQuestion",

// READABLE (for understanding):
const ENTER_PLAN_MODE_TOOL_NAME = "EnterPlanMode";
const EXIT_PLAN_MODE_TOOL_NAME = "ExitPlanMode";   // wv is a duplicate alias of oG
const ASK_USER_QUESTION_TOOL_NAME = "AskUserQuestion";

// Mapping: og->ENTER_PLAN_MODE_TOOL_NAME, oG->EXIT_PLAN_MODE_TOOL_NAME, wv->EXIT_PLAN_MODE_TOOL_NAME(alias), ez->ASK_USER_QUESTION_TOOL_NAME
```

`og` matches `ENTER_PLAN_MODE_TOOL_NAME` in v2.1.88 `constants.ts:1` exactly. `oG`/`ez` are
interpolated into the prompt and footer text (see §8, §10).

---

## 2. Tool descriptor anatomy

The full descriptor — name, search hint, schemas, behavioral flags, `call`, and the result mapper —
is one `buildTool(...)` call. Here it is verbatim from v2.1.156, then deobfuscated:

```javascript
// ============================================
// EnterPlanModeTool - Full tool descriptor
// Location: cli_inner_pretty.js:349701-349766
//   - TL_/VL_ schema assignments: 349701-349702
//   - hL8 = yK({...}) descriptor object proper: 349703-349766
// ============================================

// ORIGINAL (for source lookup):
((TL_ = yH(() => y.strictObject({}))),
  (VL_ = yH(() => y.object({ message: y.string().describe("Confirmation that plan mode was entered") }))),
  (hL8 = yK({
    name: og,
    searchHint: "switch to plan mode to design an approach before coding",
    maxResultSizeChars: 1e5,
    async description() {
      return "Requests permission to enter plan mode for complex tasks requiring exploration and design";
    },
    async prompt() {
      return rH4();
    },
    get inputSchema() { return TL_(); },
    get outputSchema() { return VL_(); },
    userFacingName() { return ""; },
    shouldDefer: !0,
    isEnabled() {
      if (uw().length > 0 && R6()) return !1;
      return !0;
    },
    isConcurrencySafe() { return !0; },
    isReadOnly() { return !0; },
    renderToolUseMessage: aH4,
    renderToolResultMessage: sH4,
    renderToolUseRejectedMessage: tH4,
    async call(H, $) {
      if ($.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
      return (
        Tt(T6($).mode, "plan"),
        $.setToolPermissionContext((q) => nY(xhH(q), { type: "setMode", mode: "plan", destination: "session" })),
        { data: { message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach." } }
      );
    },
    mapToolResultToToolResultBlockParam({ message: H }, $) { /* see §10 */ },
  })));

// READABLE (for understanding):
const enterPlanModeInputSchema  = lazySchema(() => z.strictObject({}));            // no params
const enterPlanModeOutputSchema = lazySchema(() => z.object({
  message: z.string().describe("Confirmation that plan mode was entered"),
}));

const EnterPlanModeTool = buildTool({
  name: ENTER_PLAN_MODE_TOOL_NAME,                                                 // "EnterPlanMode"
  searchHint: "switch to plan mode to design an approach before coding",
  maxResultSizeChars: 100_000,
  async description() { return "Requests permission to enter plan mode for complex tasks requiring exploration and design"; },
  async prompt() { return getEnterPlanModeToolPrompt(); },                         // rH4 -> GL_
  get inputSchema()  { return enterPlanModeInputSchema(); },
  get outputSchema() { return enterPlanModeOutputSchema(); },
  userFacingName() { return ""; },                                                // suppresses any label
  shouldDefer: true,
  isEnabled() {
    if (getAllowedChannels().length > 0 && isNonInteractive()) return false;       // §5
    return true;
  },
  isConcurrencySafe() { return true; },
  isReadOnly() { return true; },
  renderToolUseMessage,            // aH4 -> null
  renderToolResultMessage,         // sH4 -> "Entered plan mode"
  renderToolUseRejectedMessage,    // tH4 -> "User declined to enter plan mode"
  async call(input, context) { /* §6 */ },
  mapToolResultToToolResultBlockParam({ message }, toolUseID) { /* §10 */ },
});

// Mapping: hL8->EnterPlanModeTool, TL_->enterPlanModeInputSchema, VL_->enterPlanModeOutputSchema,
//          yK->buildTool, yH->lazySchema, y->zod, og->ENTER_PLAN_MODE_TOOL_NAME,
//          rH4->getEnterPlanModeToolPrompt(wrapper), uw->getAllowedChannels, R6->isNonInteractive,
//          aH4->renderToolUseMessage, sH4->renderToolResultMessage, tH4->renderToolUseRejectedMessage,
//          Tt->handlePlanModeTransition, T6->getToolPermissionContext, nY->applyPermissionUpdate,
//          xhH->prepareContextForPlanMode
```

### The `buildTool` factory (`yK`)

**What it does:** Wraps a raw tool-definition object into a fully-formed tool by layering it over a
shared default descriptor.

```javascript
// ============================================
// buildTool - tool-factory that merges def over shared defaults
// Location: cli_inner_pretty.js:143482-143484
// ============================================

// ORIGINAL (for source lookup):
function yK(H) {
  return Object.defineProperties({ ...P45, userFacingName: () => H.name }, Object.getOwnPropertyDescriptors(H));
}

// READABLE (for understanding):
function buildTool(toolDef) {
  return Object.defineProperties(
    { ...DEFAULT_TOOL_DESCRIPTOR, userFacingName: () => toolDef.name },  // base + derived default name
    Object.getOwnPropertyDescriptors(toolDef),                          // toolDef overrides win
  );
}

// Mapping: yK->buildTool, H->toolDef, P45->DEFAULT_TOOL_DESCRIPTOR
```

**How it works:**
1. It spreads the shared default descriptor `DEFAULT_TOOL_DESCRIPTOR` (`P45`) into a fresh object.
2. It pre-seeds a *default* `userFacingName: () => toolDef.name` — i.e. by default a tool's
   user-facing name is its raw name.
3. It then applies `Object.getOwnPropertyDescriptors(toolDef)` on top via `defineProperties`, so
   anything the definition declares (including getters like `inputSchema`) overrides the defaults.

**Why this approach:** Using `defineProperties` with the definition's *property descriptors* (rather
than a shallow spread) preserves getter/setter semantics — `inputSchema`/`outputSchema` are lazy
getters, and a spread would eagerly invoke them. Descriptors keep them lazy.

**Key insight:** `EnterPlanMode` overrides the default `userFacingName` with `() => ""` (`349719`).
Because the factory seeded `() => toolDef.name` only as a *default*, the explicit empty-string getter
wins, giving the tool **no user-facing label**. This is consistent with `renderToolUseMessage`
returning `null` (`aH4`, §11) — the tool deliberately renders nothing on invocation; the only visible
output is the result line "Entered plan mode".

### Schemas (`TL_` / `VL_`)

- `enterPlanModeInputSchema` (obfuscated: `TL_`, `349701`) — `z.strictObject({})`. **Strict** empty
  object: the model may pass no keys, and any extra key is a validation error. This is the schema-level
  enforcement that the tool is parameterless.
- `enterPlanModeOutputSchema` (obfuscated: `VL_`, `349702`) — `z.object({ message: string })`. The
  `call` return shape. Both are wrapped in `lazySchema` (`yH`) so the Zod object is only constructed on
  first access, not at module load.

Both match v2.1.88 `EnterPlanModeTool.ts:21-32` byte-for-byte (modulo renames).

---

## 3. The `agentId` throw: why subagents cannot enter plan mode

```javascript
// ============================================
// call() subagent guard - hard invariant
// Location: cli_inner_pretty.js:349737
// ============================================

// ORIGINAL (for source lookup):
if ($.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");

// READABLE (for understanding):
if (context.agentId) throw new Error("EnterPlanMode tool cannot be used in agent contexts");

// Mapping: $->context, $.agentId->context.agentId
```

**What it does:** The very first statement of `call` throws an `Error` if the invoking context belongs
to a subagent (any context with a non-null `agentId`).

**How it works:** `context.agentId` is set when the context belongs to a subagent spawned by the
`Agent`/`Task` tool. When it is truthy, `call` throws rather than entering plan mode. This is an
exception, not a soft `{ error }` return — it aborts the tool call entirely.

**Why this approach (rationale + alternatives + trade-offs):**
Plan mode is a **session-level interactive permission mode**: the `setMode` update flips
`destination: "session"` (`349740`, §6) and the only way *out* is the `ExitPlanMode` approval dialog,
which renders in the terminal and waits for a human keypress. A subagent runs headless with its own
permission context and *no human at its terminal*. If a subagent entered plan mode it would become
**unexitable** — there is no UI to approve `ExitPlanMode`, so the subagent would be trapped in
read-only mode forever, unable to complete its task. The hard throw makes the invariant explicit at
the entry point.
- *Alternative 1 — silent no-op:* return success without changing mode. Rejected because it would
  mislead the model into believing it is in plan mode and "plan" instead of acting, wasting the
  subagent's budget on planning text that is never approved.
- *Alternative 2 — filter the tool out of subagent toolsets only:* this is the **first** line of
  defense (the tool is not normally offered to subagents). The throw is **defense in depth** for the
  case where it leaks into a subagent toolset anyway.

**Key insight:** This pairs with the `isEnabled` gate (§5), which disables the tool entirely in a
*non-interactive session with channels*. Both are the same "never let plan mode become a trap"
principle applied at two different layers — `isEnabled` removes the *option* up-front for non-TUI
foreground sessions, and the `agentId` throw is the *runtime* backstop for the headless-subagent case.

---

## 4. Read-only + concurrency-safe + shouldDefer flags and what they imply

Three boolean-returning flags shape how the agent loop treats this tool (`349722-349731`):

- `shouldDefer: true` — **deferred announcement**. The tool list is rebuilt each turn; deferral lets
  the registry decide *per-turn* whether to advertise `EnterPlanMode` (e.g. suppress it once already
  in plan mode, where it would re-save `prePlanMode` redundantly). This is orthogonal to `isEnabled`:
  `isEnabled` is the hard capability gate, `shouldDefer` is an announcement-timing modifier.
- `isConcurrencySafe() => true` — the tool may run in the same parallel batch as other tools. This is
  safe because, despite mutating session state, the mutation is **idempotent and self-consistent** —
  the worst case under concurrency is entering plan mode twice, and `prepareContextForPlanMode`'s
  `mode === "plan"` short-circuit (§6) makes the second entry a no-op.
- `isReadOnly() => true` — declares the tool performs no file writes. This is what lets the
  permission system schedule it freely.

**What it does (as a trio):** Together these declare *"this tool changes only session-local permission
state, never the filesystem, and is safe to batch."*

**Why this approach:** Marking a *mode-changing* tool as `isReadOnly: true` looks paradoxical, but the
contract of `isReadOnly` is specifically about **file/external side effects**, not about in-process
state. Plan mode entry mutates only the in-memory permission context and an attachment flag — nothing
on disk. Declaring it read-only means the loop never treats it as a "dangerous write" requiring
serialization or extra confirmation.

**Key insight:** `isReadOnly: true` here is doing double duty as a *promise to the model* as well as a
scheduler hint. It reinforces the textual steering in the result footer ("This is a read-only
exploration and planning phase", §10): the tool both *declares* itself read-only to the runtime and
*tells the model* to stay read-only.

---

## 5. `isEnabled` gate: `--channels` + non-interactive (the v2.1.156 rewrite)

```javascript
// ============================================
// isEnabled - capability gate for plan-mode entry
// Location: cli_inner_pretty.js:349723-349726
// ============================================

// ORIGINAL (for source lookup):
isEnabled() {
  if (uw().length > 0 && R6()) return !1;
  return !0;
},

// READABLE (for understanding):
isEnabled() {
  if (getAllowedChannels().length > 0 && isNonInteractive()) return false;
  return true;
}

// Mapping: uw->getAllowedChannels, R6->isNonInteractive
```

The two predicates, verified in the bundle:

```javascript
// ============================================
// getAllowedChannels + isNonInteractive - the two gate predicates
// Location: cli_inner_pretty.js:3217-3219 ; 2742-2744
// ============================================

// ORIGINAL (for source lookup):
function uw() { return d$.allowedChannels; }
function R6() { return !d$.isInteractive; }

// READABLE (for understanding):
function getAllowedChannels() { return appState.allowedChannels; }   // the --channels allow-list
function isNonInteractive()   { return !appState.isInteractive; }    // true when no TUI is attached

// Mapping: uw->getAllowedChannels, R6->isNonInteractive, d$->appState
```

**What it does:** Returns `false` (tool unavailable) when **both** conditions hold: the
`--channels` allow-list is non-empty AND the session is non-interactive. Otherwise the tool is enabled.

**How it works:** `getAllowedChannels()` returns the configured remote-control channel list (set by
the `--channels` flag for Telegram/Discord-style remote control). `isNonInteractive()` is the negation
of `appState.isInteractive` — true when there is no terminal/TUI to render dialogs into. The AND means
plan mode is only suppressed in the specific case where the user is driving via channels *and* there
is no attached terminal.

**Why this approach (rationale + alternatives + trade-offs):**
`ExitPlanMode`'s approval dialog must render in a terminal and block on a keypress. If a session has
no terminal (non-interactive) and is being driven over channels, that dialog can never run, so plan
mode would be a trap the model could enter but never leave. Gating *entry* here mirrors the gate on
`ExitPlanMode.isEnabled`, ensuring plan mode is never enterable-but-unexitable. The AND (rather than
OR) is deliberate: merely having channels configured does not disable plan mode in an interactive
foreground session, because the human is still at the terminal and can approve.

**v2.1.156 change — feature flag → capability gate.** In v2.1.88 (`EnterPlanModeTool.ts:60-65`) the
guard keyed on KAIROS feature flags:
```typescript
if ((feature('KAIROS') || feature('KAIROS_CHANNELS')) && getAllowedChannels().length > 0) return false;
```
v2.1.156 replaces the `feature('KAIROS') || feature('KAIROS_CHANNELS')` predicate with a runtime
`isNonInteractive()` check (`R6()`). This generalizes the guard beyond the KAIROS experiment: *any*
non-interactive channels session now disables plan entry, regardless of feature-flag state. The
underlying rationale (don't trap the model where there's no terminal for the exit dialog) is unchanged;
only the *trigger* moved from an experiment flag to an intrinsic capability check.
- *Alternative considered:* keep the feature flag and add the non-interactive check. Rejected because
  once the KAIROS experiment graduated, the flag is dead weight — collapsing to a pure capability test
  removes a stale rollout switch and makes the guard's intent self-evident from the code.

**Key insight:** The migration from `feature(...)` to `isNonInteractive()` is part of a broader
v2.1.156 de-flagging trend visible across this whole region (the interview-phase and `USER_TYPE`
branches were removed the same way, §8/§10). The guard's *behavior* converged on the most defensible
condition: "is there a terminal for the exit dialog?"

---

## 6. `call()` lifecycle: transition → prepare → setMode

```javascript
// ============================================
// call() body - the three-step plan-mode entry
// Location: cli_inner_pretty.js:349736-349748
// ============================================

// ORIGINAL (for source lookup):
async call(H, $) {
  if ($.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
  return (
    Tt(T6($).mode, "plan"),
    $.setToolPermissionContext((q) => nY(xhH(q), { type: "setMode", mode: "plan", destination: "session" })),
    { data: { message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach." } }
  );
}

// READABLE (for understanding):
async call(input, context) {
  if (context.agentId) throw new Error("EnterPlanMode tool cannot be used in agent contexts");
  handlePlanModeTransition(getToolPermissionContext(context).mode, "plan");   // (1) toggle exit-attachment flag
  context.setToolPermissionContext(prev =>                                    // (2)+(3) atomic context update
    applyPermissionUpdate(
      prepareContextForPlanMode(prev),                                        // (2) record prePlanMode + auto-mode side effects
      { type: "setMode", mode: "plan", destination: "session" },             // (3) actually set mode = plan (session-scoped)
    ),
  );
  return { data: { message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach." } };
}

// Mapping: Tt->handlePlanModeTransition, T6->getToolPermissionContext, nY->applyPermissionUpdate, xhH->prepareContextForPlanMode, $->context, q->prev
```

The body is written as a comma-sequence returned in a single expression — `(Tt(...), setCtx(...),
{data:...})` — which evaluates each side effect left to right and yields the final object literal.
This is semantically identical to the v2.1.88 statement form.

### Step 1 — `handlePlanModeTransition` (`Tt`) is a STATE TOGGLE, not an emitter

```javascript
// ============================================
// handlePlanModeTransition - toggles the pending exit-attachment flag
// Location: cli_inner_pretty.js:3047-3050
// ============================================

// ORIGINAL (for source lookup):
function Tt(H, $) {
  if ($ === "plan" && H !== "plan") d$.needsPlanModeExitAttachment = !1;
  if (H === "plan" && $ !== "plan") d$.needsPlanModeExitAttachment = !0;
}

// READABLE (for understanding):
function handlePlanModeTransition(fromMode, toMode) {
  // Entering plan from non-plan: CLEAR any pending exit attachment.
  if (toMode === "plan" && fromMode !== "plan") appState.needsPlanModeExitAttachment = false;
  // Leaving plan to non-plan: SET a pending exit attachment for the next turn.
  if (fromMode === "plan" && toMode !== "plan") appState.needsPlanModeExitAttachment = true;
}

// Mapping: Tt->handlePlanModeTransition, H->fromMode, $->toMode, d$->appState
```

**What it does:** Maintains a single boolean `appState.needsPlanModeExitAttachment` that downstream
code consumes to decide whether to inject a `plan_mode_exit` attachment into the next prompt.

**How it works:** It is called here as `handlePlanModeTransition(getToolPermissionContext(context).mode,
"plan")`, i.e. `fromMode = currentMode`, `toMode = "plan"`. Since we are *entering* plan
(`toMode === "plan"` and `fromMode !== "plan"`), it sets the flag to **false** — clearing any pending
exit attachment.

**Why this approach (rationale):** Consider a quick toggle: the user is in plan mode, the model calls
`ExitPlanMode` (setting `needsPlanModeExitAttachment = true` so the next turn gets a "you exited plan
mode" attachment), and then immediately re-enters plan mode. Without the clear, the next prompt would
carry **both** a stale `plan_mode_exit` attachment *and* the fresh plan-mode state — contradictory
signals. By clearing the flag on entry, only the most recent transition's attachment survives. The
v2.1.88 comment at `state.ts:1353-1354` documents exactly this reasoning.

**Key insight (corrects a common mischaracterization):** This is a **state setter that toggles a
boolean**, not an event emitter that "fires a plan-mode-transition event." There is no event bus here —
just a flag flip read later by the attachment builder. Treating it as an emitter would over-attribute
behavior to this function.

### Steps 2+3 — order-sensitive atomic context update

The single `setToolPermissionContext(prev => applyPermissionUpdate(prepareContextForPlanMode(prev),
{setMode plan}))` composes two transforms inside one state update. **Order matters.**

```javascript
// ============================================
// prepareContextForPlanMode - records prePlanMode + auto-mode side effects (MUST run before setMode)
// Location: cli_inner_pretty.js:443097-443111
// ============================================

// ORIGINAL (for source lookup):
function xhH(H) {
  let $ = H.mode;
  if ($ === "plan") return H;
  {
    let q = Hi6();
    if ($ === "auto") {
      if (q) return { ...H, prePlanMode: "auto" };
      return (Pk?.setAutoModeActive(!1), PR(!0), { ...EzH(H), prePlanMode: "auto" });
    }
    if (q && $ !== "bypassPermissions") return (Pk?.setAutoModeActive(!0), { ...Km(H), prePlanMode: $ });
  }
  return (N(`[prepareContextForPlanMode] plain plan entry, prePlanMode=${$}`, { level: "info" }), { ...H, prePlanMode: $ });
}

// READABLE (for understanding):
function prepareContextForPlanMode(ctx) {
  const prev = ctx.mode;
  if (prev === "plan") return ctx;                                  // idempotent re-entry guard
  const shouldPlanUseAuto = shouldPlanUseAutoMode();                // Hi6
  if (prev === "auto") {
    if (shouldPlanUseAuto) return { ...ctx, prePlanMode: "auto" };  // plan piggybacks auto
    autoModeStateModule?.setAutoModeActive(false);                  // deactivate auto
    setNeedsAutoModeExitAttachment(true);                          // PR(true): queue one-shot reminder
    return { ...stripDangerousRulesForAutoMode(ctx), prePlanMode: "auto" };  // EzH: strip dangerous rules
  }
  if (shouldPlanUseAuto && prev !== "bypassPermissions") {
    autoModeStateModule?.setAutoModeActive(true);
    return { ...promoteToAutoModeContext(ctx), prePlanMode: prev };  // Km
  }
  logDebug(`[prepareContextForPlanMode] plain plan entry, prePlanMode=${prev}`, { level: "info" });
  return { ...ctx, prePlanMode: prev };                             // default: just snapshot prev mode
}

// Mapping: xhH->prepareContextForPlanMode, H->ctx, $->prev, Hi6->shouldPlanUseAutoMode,
//          Pk->autoModeStateModule, PR->setNeedsAutoModeExitAttachment, EzH->stripDangerousRulesForAutoMode,
//          Km->promoteToAutoModeContext, N->logDebug
```

Then `applyPermissionUpdate` (`nY`) actually sets the mode:

```javascript
// ============================================
// applyPermissionUpdate - setMode case (with bypassPermissions guard)
// Location: cli_inner_pretty.js:210027-210037
// ============================================

// ORIGINAL (for source lookup):
function nY(H, $) {
  switch ($.type) {
    case "setMode":
      if ($.mode === "bypassPermissions" && !H.isBypassPermissionsModeAvailable)
        return (N("Ignoring permission update: setMode 'bypassPermissions' rejected — mode is not available (...)"), H);
      return (N(`Applying permission update: Setting mode to '${$.mode}'`), { ...H, mode: $.mode });
    /* ...addRules / replaceRules / removeRules / ... */
  }
}

// READABLE (for understanding):
function applyPermissionUpdate(ctx, update) {
  switch (update.type) {
    case "setMode":
      if (update.mode === "bypassPermissions" && !ctx.isBypassPermissionsModeAvailable) {
        logDebug("Ignoring permission update: setMode 'bypassPermissions' rejected ...");
        return ctx;  // refuse to escalate to bypass when not available
      }
      logDebug(`Applying permission update: Setting mode to '${update.mode}'`);
      return { ...ctx, mode: update.mode };
    /* ...other update kinds... */
  }
}

// Mapping: nY->applyPermissionUpdate, H->ctx, $->update
```

**What it does (combined):** `prepareContextForPlanMode` snapshots the *current* mode into
`prePlanMode` (so exit can restore it) and runs auto-mode-specific side effects, producing a new
context; `applyPermissionUpdate` then overwrites `mode` with `"plan"` on that already-prepared context.

**How it works (the ordering, step by step):**
1. `prepareContextForPlanMode(prev)` reads `prev.mode` — the *real* prior mode (e.g. `"default"`,
   `"acceptEdits"`, or `"auto"`) — and stashes it in `prePlanMode`. If the prior mode was `"auto"`, it
   may deactivate the auto-mode classifier, strip dangerous permission rules, and queue an
   `auto_mode_exit` reminder, depending on `shouldPlanUseAutoMode()`.
2. The result of step 1 is passed to `applyPermissionUpdate(..., {setMode plan})`, which sets
   `mode = "plan"`.

**Why this order (rationale + the failure mode if reversed):** If `applyPermissionUpdate` ran *first*,
the context would already have `mode === "plan"` before `prepareContextForPlanMode` saw it. Then
`prepareContextForPlanMode`'s very first guard — `if (prev === "plan") return ctx` — would
short-circuit, so `prePlanMode` would either never be set or be set to `"plan"`. **Restore-on-exit
would break**: on `ExitPlanMode` the session would "restore" to plan mode (or have no recorded prior
mode), instead of returning to `"default"`/`"acceptEdits"`/`"auto"`. The current order guarantees the
snapshot captures the genuine prior mode.

**Why one combined `setToolPermissionContext` call (not two):** Composing both transforms inside a
single updater makes the whole transition **atomic** — no intermediate render or concurrent reader can
observe a half-applied state (e.g. dangerous rules already stripped but mode still `"auto"`, or mode
`"plan"` but `prePlanMode` not yet recorded).

**v2.1.156 vs v2.1.88 — narrower setter:** v2.1.88 used
`context.setAppState(prev => ({ ...prev, toolPermissionContext: applyPermissionUpdate(...) }))`
(`EnterPlanModeTool.ts:88-94`). v2.1.156 uses the dedicated
`context.setToolPermissionContext(prev => ...)` where `prev` is already the permission context. This
is a purely mechanical refactor — same effect, narrower setter — but note it also changes how the
*current* mode is read: v2.1.88 read `appState.toolPermissionContext.mode`, whereas v2.1.156 computes
the effective mode via `getToolPermissionContext(context).mode` (`T6`, §6 below), which folds the base
context through permission layers.

### `getToolPermissionContext` (`T6`) — reading the *effective* current mode

```javascript
// ============================================
// getToolPermissionContext - folds base context through permission layers
// Location: cli_inner_pretty.js:453162-453176
// ============================================

// ORIGINAL (for source lookup):
function T6(H) {
  let $ = H.getAppState().toolPermissionContext,
    q = H.permissionLayers;
  if (!q) return $;
  for (let K of q)
    switch (K.kind) {
      case "allowed_tools":     $ = YV8($, [...K.allowedTools]); break;
      case "disallowed_tools":  $ = fV8($, [...K.disallowedTools]); break;
      case "avoid_prompts":     if (!$.shouldAvoidPermissionPrompts) $ = { ...$, shouldAvoidPermissionPrompts: !0 }; break;
      /* ... */
    }
}

// READABLE (for understanding):
function getToolPermissionContext(context) {
  let ctx = context.getAppState().toolPermissionContext;
  const layers = context.permissionLayers;
  if (!layers) return ctx;
  for (const layer of layers)
    switch (layer.kind) {
      case "allowed_tools":    ctx = applyAllowedTools(ctx, [...layer.allowedTools]); break;
      case "disallowed_tools": ctx = applyDisallowedTools(ctx, [...layer.disallowedTools]); break;
      case "avoid_prompts":    if (!ctx.shouldAvoidPermissionPrompts) ctx = { ...ctx, shouldAvoidPermissionPrompts: true }; break;
      /* ... */
    }
  return ctx;
}

// Mapping: T6->getToolPermissionContext, H->context, $->ctx, q->layers, K->layer, YV8->applyAllowedTools, fV8->applyDisallowedTools
```

**Key insight:** In `call`, only `getToolPermissionContext(context).mode` is consumed — and `mode` is
not affected by the `allowed_tools`/`disallowed_tools`/`avoid_prompts` layer folds shown here, so the
net effect on `mode` matches reading the base context directly. The change to `T6` is therefore
behaviorally neutral *for the `mode` read*, but it is the more correct/consistent accessor used
elsewhere in v2.1.156.

---

## 7. Permission descriptor `permission_enter_plan_mode` (`K0$`) and the deferred approval flow

```javascript
// ============================================
// enterPlanModePermissionDescriptor - typed descriptor for the approval gate
// Location: cli_inner_pretty.js:349439-349452
// ============================================

// ORIGINAL (for source lookup):
var K0$;
var gu6 = T(() => {
  I6();
  K0$ = BM({
    kind: "permission_enter_plan_mode",
    payload: yH(() =>
      y.custom((H) => typeof H === "object" && H !== null && "requestId" in H && "toolName" in H && "permissionResult" in H),
    ),
    result: yH(() => y.custom((H) => typeof H === "object" && H !== null && "behavior" in H)),
    default: { behavior: "cancelled" },
  });
});

// READABLE (for understanding):
const enterPlanModePermissionDescriptor = definePermissionDescriptor({
  kind: "permission_enter_plan_mode",
  payload: lazySchema(() => z.custom(v =>
    typeof v === "object" && v !== null && "requestId" in v && "toolName" in v && "permissionResult" in v)),
  result:  lazySchema(() => z.custom(v => typeof v === "object" && v !== null && "behavior" in v)),
  default: { behavior: "cancelled" },   // if no user response, treat as cancelled
});

// Mapping: K0$->enterPlanModePermissionDescriptor, BM->definePermissionDescriptor, yH->lazySchema, y->zod
```

`definePermissionDescriptor` (`BM`) is an identity passthrough used purely for typed registration:

```javascript
// ============================================
// definePermissionDescriptor - identity registrar
// Location: cli_inner_pretty.js:215037-215039
// ============================================

// ORIGINAL (for source lookup):
function BM(H) { return H; }

// READABLE (for understanding):
function definePermissionDescriptor(descriptor) { return descriptor; }  // identity; exists for typing/registration

// Mapping: BM->definePermissionDescriptor
```

**What it does:** Declares the typed shape of the permission request/result pair the runtime uses when
asking the user to approve entering plan mode, with a fail-safe default of `cancelled`.

**How it works:** Because `EnterPlanMode` is `shouldDefer: true`, the call does not execute
immediately on emission; the runtime raises a `permission_enter_plan_mode` request. The `payload`
schema validates the request carries `requestId`/`toolName`/`permissionResult`; the `result` schema
validates the user's response carries a `behavior`. If the user never answers (e.g. the request is
abandoned), `default: { behavior: "cancelled" }` is applied — plan mode is **not** entered.

**Why `default: cancelled` (rationale + trade-off):** Defaulting to `cancelled` is the conservative
choice — an unanswered or interrupted plan-mode request must not silently flip the session into a
read-only mode the user didn't choose. The alternative (default-allow) would risk trapping a user in
plan mode after an accidental dismissal. The trade-off is a (rare) extra prompt if the user actually
wanted plan mode but the request was dropped — acceptable, since plan entry is cheap to retry.

**Key insight:** The descriptor's identity registrar (`BM`) is the seam where a *typed permission kind*
is woven into the generic permission system. The schemas are intentionally `z.custom(...)` structural
checks (just "has these keys") rather than full object schemas — a lightweight runtime shape guard,
not strict validation, keeping the deferred-permission path cheap.

---

## 8. Prompt steering: `getEnterPlanModeToolPrompt` (`GL_`) + the wrapper (`rH4`)

The tool's `prompt()` getter returns `rH4()`, a thin wrapper:

```javascript
// ============================================
// prompt() wrapper - returns the external prompt
// Location: cli_inner_pretty.js:349644-349646
// ============================================

// ORIGINAL (for source lookup):
function rH4() { return GL_(); }

// READABLE (for understanding):
function getEnterPlanModeToolPrompt() { return getEnterPlanModeToolPromptExternal(); }

// Mapping: rH4->getEnterPlanModeToolPrompt(wrapper), GL_->getEnterPlanModeToolPromptExternal
```

`GL_` (`349566-349643`) is the full proactive-use prompt: a "Use this tool proactively..." preamble,
a 7-item **When to Use This Tool** list (New Feature / Multiple Approaches / Code Modifications /
Architectural Decisions / Multi-File / Unclear Requirements / User Preferences Matter), a
**When NOT to Use** list, the `${ZL_()}` What-Happens section, an **Examples** block (GOOD vs BAD),
and **Important Notes**. The text is identical to v2.1.88's `getEnterPlanModeToolPromptExternal`
(`prompt.ts:16-99`).

### v2.1.156 change — single variant, no `USER_TYPE` / interview-phase branching

**What it does:** v2.1.156 ships exactly **one** prompt variant (the external one).

**How v2.1.88 differed:** v2.1.88 `getEnterPlanModeToolPrompt` (`prompt.ts:166-170`) dispatched on
`process.env.USER_TYPE === 'ant'` between an Ant variant and an External variant. Each variant computed
`whatHappens = isPlanModeInterviewPhaseEnabled() ? '' : WHAT_HAPPENS_SECTION` — i.e. it *omitted* the
What-Happens section when the interview-phase flag was on (because the workflow then arrived via the
`plan_mode` attachment instead).

**v2.1.156 evidence:** Grepping the entire bundle for `isPlanModeInterviewPhase` /
`tengu_plan_mode_interview_phase` returns **0 hits**, and `USER_TYPE === "ant"` returns **0 hits**.
In `GL_`, `${ZL_()}` is interpolated unconditionally at `349609` — the What-Happens section is
*always* present. The Ant branch and the interview-phase conditional are gone.

> **Caveat (not a counterexample).** The removed branch was specifically
> `process.env.USER_TYPE === 'ant'`, for which the exact-string grep is genuinely 0. A *near*-token
> `USER_TYPE=ant` does still appear once at `cli_inner_pretty.js:521823`, but only inside a user-facing
> Remote Control error string (`"... Remote Control must be connected (USER_TYPE=ant)."`) — it is
> unrelated to the removed prompt-variant branch and is not a runtime `process.env.USER_TYPE`
> comparison.

**Why this approach (rationale + trade-off):** The interview-phase experiment appears to have been
collapsed into a single always-on path. Removing both the `USER_TYPE` fork and the flag conditional
shrinks the prompt surface to one canonical variant, eliminating drift between two prompt texts and
removing a stale rollout switch. The trade-off is loss of the terser Ant-specific guidance — but for a
single shipped product that guidance is redundant.

**Key insight:** This de-branching is the same de-flagging pattern as the `isEnabled` rewrite (§5) and
the result-footer simplification (§10). v2.1.156 systematically removed the plan-mode experiment
plumbing across this region, converging on one always-on behavior.

---

## 9. NEW `find`/`grep` shell-alias branch in the What-Happens section (`ZL_`)

```javascript
// ============================================
// WHAT_HAPPENS_SECTION builder - now with entrypoint/platform-aware tool naming
// Location: cli_inner_pretty.js:349553-349565
// ============================================

// ORIGINAL (for source lookup):
function ZL_() {
  return `## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using ${RL() && K1() ? `\`find\`/${S_}, \`grep\`/${s1}, and ${HK}` : `${S_}, ${s1}, and ${HK}`}
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use ${ez} if you need to clarify approaches
6. Exit plan mode with ${oG} when ready to implement

`;
}

// READABLE (for understanding):
function buildWhatHappensSection() {
  const exploreTools = isInteractiveEntrypoint() && isBashAvailable()
    ? `\`find\`/${GLOB_TOOL_NAME}, \`grep\`/${GREP_TOOL_NAME}, and ${READ_TOOL_NAME}`   // "find/Glob, grep/Grep, and Read"
    : `${GLOB_TOOL_NAME}, ${GREP_TOOL_NAME}, and ${READ_TOOL_NAME}`;                     // "Glob, Grep, and Read"
  return `## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using ${exploreTools}
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use ${ASK_USER_QUESTION_TOOL_NAME} if you need to clarify approaches
6. Exit plan mode with ${EXIT_PLAN_MODE_TOOL_NAME} when ready to implement

`;
}

// Mapping: ZL_->buildWhatHappensSection, RL->isInteractiveEntrypoint, K1->isBashAvailable,
//          S_->GLOB_TOOL_NAME, s1->GREP_TOOL_NAME, HK->READ_TOOL_NAME, ez->ASK_USER_QUESTION_TOOL_NAME, oG->EXIT_PLAN_MODE_TOOL_NAME
```

The two branch predicates, verified:

```javascript
// ============================================
// isInteractiveEntrypoint + isBashAvailable - the shell-alias branch predicates
// Location: cli_inner_pretty.js:235617-235621 ; 216267-216270
// ============================================

// ORIGINAL (for source lookup):
function RL() {
  if (!xH("true")) return !1;
  let H = process.env.CLAUDE_CODE_ENTRYPOINT;
  return H !== "sdk-ts" && H !== "sdk-py" && H !== "sdk-cli" && H !== "local-agent";
}
function K1() {
  if (n$() !== "windows") return !0;
  return u7H() !== null;
}

// READABLE (for understanding):
function isInteractiveEntrypoint() {
  if (!isTtyOrFlag("true")) return false;
  const entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
  return entrypoint !== "sdk-ts" && entrypoint !== "sdk-py" && entrypoint !== "sdk-cli" && entrypoint !== "local-agent";
}
function isBashAvailable() {
  if (platform() !== "windows") return true;     // non-Windows always has a shell
  return locateBashOnWindows() !== null;         // Windows: only if bash is found
}

// Mapping: RL->isInteractiveEntrypoint, xH->isTtyOrFlag, K1->isBashAvailable, n$->platform, u7H->locateBashOnWindows
```

**What it does:** Step 1 of the What-Happens list dynamically names the exploration tools. When the
session is an **interactive (non-SDK) entrypoint** AND **bash is available**, it advertises
`` `find`/Glob, `grep`/Grep, and Read `` — surfacing the shell aliases `find`/`grep` alongside the
native `Glob`/`Grep`/`Read` tools. Otherwise it uses the plain `Glob, Grep, and Read`.

**How it works:** `isInteractiveEntrypoint()` is true only for a TTY/interactive launch that is *not*
one of the SDK/headless entrypoints (`sdk-ts`/`sdk-py`/`sdk-cli`/`local-agent`). `isBashAvailable()` is
true on any non-Windows platform, and on Windows only if a bash binary is located. The conjunction
gates the richer wording.

**Why this approach (rationale + alternatives + trade-offs):** This is **entrypoint- and
platform-aware prompt tailoring**. Mentioning `find`/`grep` is only useful to a model whose user can
actually run shell commands — i.e. an interactive terminal session with a working shell. In SDK or
headless contexts (where the harness may not expose a Bash tool the same way) or on a bash-less Windows
box, advertising shell aliases would be misleading or unusable, so the prompt falls back to the
tool-name-only form. The trade-off is a slightly more complex prompt builder, paid once per prompt
render, in exchange for not steering the model toward tools its environment can't run.
- *Alternative considered:* always mention `find`/`grep`. Rejected because it pollutes SDK/headless
  prompts with shell guidance that may not apply, encouraging failed/denied Bash calls.

**v2.1.156 change:** v2.1.88 `WHAT_HAPPENS_SECTION` (`prompt.ts:7`) was a **constant string** hardcoded
to `"Thoroughly explore the codebase using Glob, Grep, and Read tools"` — no branch. v2.1.156 converts
this constant into a function (`ZL_`) precisely so it can inject the conditional shell-alias wording at
render time.

**Key insight:** Turning a static `const` into a builder function is the structural enabler for the
whole feature — the branch *can't* exist in a constant. The choice mirrors how Claude Code tailors
other prompts to entrypoint/platform capability (e.g. the same `isInteractiveEntrypoint`/`isBashAvailable`
predicates gate shell-related guidance elsewhere).

---

## 10. `tool_result` footer: priming the read-only research phase

```javascript
// ============================================
// mapToolResultToToolResultBlockParam - re-injects the 6-step read-only workflow
// Location: cli_inner_pretty.js:349749-349765
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam({ message: H }, $) {
  return {
    type: "tool_result",
    content: `${H}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use ${ez} if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ${oG} to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
    tool_use_id: $,
  };
}

// READABLE (for understanding):
mapToolResultToToolResultBlockParam({ message }, toolUseID) {
  return {
    type: "tool_result",
    content: `${message}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use ${ASK_USER_QUESTION_TOOL_NAME} if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ${EXIT_PLAN_MODE_TOOL_NAME} to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
    tool_use_id: toolUseID,
  };
}

// Mapping: H->message, $->toolUseID, ez->ASK_USER_QUESTION_TOOL_NAME, oG->EXIT_PLAN_MODE_TOOL_NAME
```

**What it does:** Rewrites the bare success `message` from `call` into the actual `tool_result` content
the model sees — appending a 6-step plan-mode workflow and an emphatic read-only reminder.

**How it works:** The `call` return only carries `message = "Entered plan mode..."`. This mapper takes
that message and concatenates a fixed footer: a numbered workflow (explore → identify → weigh
trade-offs → `AskUserQuestion` to clarify → design a strategy → `ExitPlanMode` to present) plus the
final *"Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning
phase."* Tool names `${ez}` and `${oG}` are interpolated so the model sees the live tool names.

**Why this approach (rationale + trade-off):** This footer is a **behavioral primer, not a mere
confirmation**. It is belt-and-suspenders steering: even though `isReadOnly: true` and the plan-mode
permission context already *block* file writes at runtime, the model is *also textually* told to stay
read-only. Restating the constraint in the result reduces wasted edit attempts that the permission
layer would otherwise deny — saving turns and tokens, and avoiding the model getting "stuck" repeatedly
trying a write that fails.

**v2.1.156 change — the interview-phase branch is gone.** v2.1.88 (`EnterPlanModeTool.ts:104-118`)
branched: `isPlanModeInterviewPhaseEnabled()` produced a *terse* message
(*"DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow."*)
vs the full 6-step footer otherwise. v2.1.156 has **no branch** — it unconditionally emits the 6-step
footer (confirmed: 0 grep hits for `isPlanModeInterviewPhase` in the bundle). The "except the plan
file" variant and its deferred-attachment workflow are removed from this path.

**Key insight:** The footer's instruction `4. Use ${ez}` and the prompt's item 7 both point the model
at `AskUserQuestion` for *clarifying the approach mid-plan* — the workflow capability that the now-removed
"interview phase" was experimenting with is, in effect, baked into the single canonical footer.

---

## 11. UI renderers (`aH4` / `sH4` / `tH4`)

```javascript
// ============================================
// EnterPlanMode UI renderers - use / result / rejected
// Location: cli_inner_pretty.js:349655-349682
// ============================================

// ORIGINAL (for source lookup):
function aH4() { return null; }
function sH4(H, $, q) {
  return JV.createElement(p, { flexDirection: "column", marginTop: 1 },
    JV.createElement(p, { flexDirection: "row" },
      JV.createElement(k, { color: tV("plan") }, r9),
      JV.createElement(k, null, " Entered plan mode")),
    JV.createElement(p, { paddingLeft: 2 },
      JV.createElement(k, { dimColor: !0 }, "Claude is now exploring and designing an implementation approach.")));
}
function tH4() {
  return JV.createElement(p, { flexDirection: "row", marginTop: 1 },
    JV.createElement(k, { color: tV("default") }, r9),
    JV.createElement(k, null, " User declined to enter plan mode"));
}

// READABLE (for understanding):
function renderToolUseMessage() { return null; }   // nothing shown when the tool is invoked
function renderToolResultMessage(output, progress, options) {
  return <Box flexDirection="column" marginTop={1}>
    <Box flexDirection="row">
      <Text color={getModeColor("plan")}>{STATUS_BULLET_GLYPH}</Text>
      <Text> Entered plan mode</Text>
    </Box>
    <Box paddingLeft={2}>
      <Text dimColor>Claude is now exploring and designing an implementation approach.</Text>
    </Box>
  </Box>;
}
function renderToolUseRejectedMessage() {
  return <Box flexDirection="row" marginTop={1}>
    <Text color={getModeColor("default")}>{STATUS_BULLET_GLYPH}</Text>
    <Text> User declined to enter plan mode</Text>
  </Box>;
}

// Mapping: aH4->renderToolUseMessage, sH4->renderToolResultMessage, tH4->renderToolUseRejectedMessage,
//          tV->getModeColor, r9->STATUS_BULLET_GLYPH (⏺ on macOS / ● elsewhere; readable name BLACK_CIRCLE),
//          p->Box, k->Text, JV->React
```

The mode-color helper:

```javascript
// ============================================
// getModeColor - resolves a permission mode to its theme color
// Location: cli_inner_pretty.js:49218-49220
// ============================================

// ORIGINAL (for source lookup):
function tV(H) { return WF$(H).color; }

// READABLE (for understanding):
function getModeColor(mode) { return getModeStyle(mode).color; }

// Mapping: tV->getModeColor, WF$->getModeStyle
```

**What it does:** `renderToolUseMessage` renders nothing (`null`); `renderToolResultMessage` shows a
status-bullet glyph (`r9`, declared at `49116`, assigned at `49159` — `⏺` on macOS / `●`
elsewhere) in the *plan* mode color followed by " Entered plan mode" plus a dim subtitle;
`renderToolUseRejectedMessage` shows the same glyph in the *default* mode color with " User declined
to enter plan mode".

**Why `renderToolUseMessage` returns `null` (rationale):** Pairing the empty `userFacingName()` (§2)
with a `null` use-renderer means the *invocation* of `EnterPlanMode` is visually silent — only the
*outcome* (entered / declined) appears. Showing a "calling EnterPlanMode..." line would be noise; the
meaningful event is the mode transition, which the result/rejected renderers communicate with a single
colored status line.

**Key insight:** The color choice encodes the *result semantics*: success is rendered in the **plan**
mode color (a visual cue that the session is now in plan mode), while rejection reverts to the
**default** color (a cue that nothing changed). This is a small but deliberate affordance — the color
itself tells the user which mode they're in.

> **Note on the glyph.** `r9` is *declared* at `cli_inner_pretty.js:49116` (`var r9,`) and *assigned*
> inside the figures-init module body at `cli_inner_pretty.js:49159`:
> `r9 = n$() === "macos" ? "⏺" : "●"`. It is therefore **platform-dependent** — `⏺`
> (`⏺`, BLACK CIRCLE FOR RECORD) on macOS, and `●` (`●`, BLACK CIRCLE) on every other
> platform. The single readable name `BLACK_CIRCLE` is only literally accurate off-macOS; on macOS the
> glyph is the record bullet. This is the import-equivalent of v2.1.88's `BLACK_CIRCLE` figure
> (`figures.js`, imported in `UI.tsx:2`). High confidence: the assignment is fully readable in this
> build.

---

## 12. Cross-validation: v2.1.88 → v2.1.156 behavioral diff

| Aspect | v2.1.88 (`EnterPlanModeTool/`) | v2.1.156 (`cli_inner_pretty.js`) | Status |
|--------|--------------------------------|----------------------------------|--------|
| Tool name | `ENTER_PLAN_MODE_TOOL_NAME = "EnterPlanMode"` (constants.ts:1) | `og = "EnterPlanMode"` (143385) | **Identical** |
| Input schema | `z.strictObject({})` (21-25) | `TL_ = z.strictObject({})` (349701) | **Identical** |
| Output schema | `{ message: string }` (28-32) | `VL_ = { message: string }` (349702) | **Identical** |
| searchHint / maxResultSizeChars / description | (38-41) | (349705-349709) | **Identical** |
| `userFacingName()` | `""` (52-54) | `""` (349719-349721) | **Identical** |
| `shouldDefer` / `isConcurrencySafe` / `isReadOnly` | `true`/`true`/`true` (55,68,71) | `true`/`true`/`true` (349722,349727,349730) | **Identical** |
| Subagent throw | `if (context.agentId) throw ...` (78-80) | `if ($.agentId) throw ...` (349737) | **Identical** (same message) |
| `call` body semantics | transition → prepare → setMode plan, session-scoped (82-101) | same (349739-349746) | **Identical** (effect) |
| `call` state setter | `context.setAppState(prev => ({...prev, toolPermissionContext: ...}))` (88-94) | `context.setToolPermissionContext(prev => ...)` (349740) | **Refactor** — narrower setter, same effect |
| Current-mode read | `appState.toolPermissionContext.mode` (83) | `getToolPermissionContext(context).mode` (349739, T6) | **Refactor** — layer-folding accessor; `mode` unaffected |
| `handlePlanModeTransition` | toggles `needsPlanModeExitAttachment` (state.ts) | `Tt` identical logic (3047-3050) | **Identical** |
| `isEnabled` gate | `(feature('KAIROS')||feature('KAIROS_CHANNELS')) && allowedChannels.length>0` (60-65) | `getAllowedChannels().length>0 && isNonInteractive()` (349724) | **Changed** — flag predicate → non-interactive capability check |
| Prompt variant selection | `USER_TYPE==='ant' ? Ant : External` (prompt.ts:166-170) | External only; no `USER_TYPE` branch (GL_, 349566) | **Removed** — single variant (0 grep hits) |
| What-Happens section gating | `isPlanModeInterviewPhaseEnabled() ? '' : WHAT_HAPPENS_SECTION` (prompt.ts:19-21) | always included: `${ZL_()}` at 349609 | **Removed** — always on |
| What-Happens explore tools | const string `"Glob, Grep, and Read tools"` (prompt.ts:7) | `RL()&&K1() ? "find/Glob, grep/Grep, and Read" : "Glob, Grep, and Read"` (349557) | **NEW** — shell-alias branch |
| Result footer | `isPlanModeInterviewPhaseEnabled() ? terse : 6-step` (104-118) | 6-step footer, no branch (349749-349765) | **Removed** — single 6-step variant |
| Permission descriptor | `permission_enter_plan_mode`, default `cancelled` | `K0$` same shape (349439-349452) | **Identical** |
| UI: use / result / rejected | `null` / "Entered plan mode" (plan color) / "User declined" (default color) (UI.tsx:9-32) | `aH4`/`sH4`/`tH4` same (349655-349682) | **Identical** |

**Summary of the three real behavioral deltas:**
1. **`isEnabled` rewrite (§5):** KAIROS feature-flag predicate → `isNonInteractive()` capability check.
   Generalizes the anti-trap guard beyond the KAIROS experiment.
2. **De-branching (§8, §10):** both `USER_TYPE === 'ant'` and `isPlanModeInterviewPhaseEnabled()`
   conditionals are entirely removed from the prompt and footer (0 grep hits). The product converged on
   one always-on variant.
3. **NEW shell-alias branch (§9):** the What-Happens section now surfaces `find`/`grep` aliases when
   interactive + bash-available, by converting the former `const` string into a builder function.

Everything else (tool shape, schemas, the subagent throw, the transition/prepare/setMode lifecycle, the
permission descriptor, and all three UI renderers) is unchanged modulo renames and one mechanical
state-setter refactor.

---

## Related Symbols

> Symbol mappings live in the central index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)

Key symbols in this document:
- `EnterPlanModeTool` (obfuscated: `hL8`) - the tool descriptor object - `cli_inner_pretty.js:349703-349766`
- `ENTER_PLAN_MODE_TOOL_NAME` (obfuscated: `og`) - `"EnterPlanMode"` - `cli_inner_pretty.js:143385`
- `EXIT_PLAN_MODE_TOOL_NAME` (obfuscated: `oG`/`wv`) - `"ExitPlanMode"` - `cli_inner_pretty.js:143386-143387`
- `ASK_USER_QUESTION_TOOL_NAME` (obfuscated: `ez`) - `"AskUserQuestion"` - `cli_inner_pretty.js:143388`
- `buildTool` (obfuscated: `yK`) - tool factory merging def over `P45` defaults - `cli_inner_pretty.js:143482-143484`
- `enterPlanModeInputSchema` (obfuscated: `TL_`) - `z.strictObject({})` - `cli_inner_pretty.js:349701`
- `enterPlanModeOutputSchema` (obfuscated: `VL_`) - `z.object({ message })` - `cli_inner_pretty.js:349702`
- `getEnterPlanModeToolPromptExternal` (obfuscated: `GL_`) - full proactive-use prompt - `cli_inner_pretty.js:349566-349643`
- `buildWhatHappensSection` (obfuscated: `ZL_`) - What-Happens builder w/ shell-alias branch - `cli_inner_pretty.js:349553-349565`
- `getEnterPlanModeToolPrompt` (obfuscated: `rH4`) - prompt() wrapper - `cli_inner_pretty.js:349644-349646`
- `renderToolUseMessage` (obfuscated: `aH4`) - returns null - `cli_inner_pretty.js:349655-349657`
- `renderToolResultMessage` (obfuscated: `sH4`) - "Entered plan mode" - `cli_inner_pretty.js:349658-349674`
- `renderToolUseRejectedMessage` (obfuscated: `tH4`) - "User declined to enter plan mode" - `cli_inner_pretty.js:349675-349682`
- `enterPlanModePermissionDescriptor` (obfuscated: `K0$`) - `permission_enter_plan_mode` - `cli_inner_pretty.js:349439-349452` (descriptor module body; `var K0$` at 349439, `gu6` initializer 349440-349452, `K0$ = BM({...})` literal 349442-349451)
- `definePermissionDescriptor` (obfuscated: `BM`) - identity registrar - `cli_inner_pretty.js:215037-215039`
- `handlePlanModeTransition` (obfuscated: `Tt`) - toggles `needsPlanModeExitAttachment` - `cli_inner_pretty.js:3047-3050`
- `getToolPermissionContext` (obfuscated: `T6`) - effective permission-context accessor - `cli_inner_pretty.js:453162-453175`
- `applyPermissionUpdate` (obfuscated: `nY`) - `setMode`/`addRules`/... updater - `cli_inner_pretty.js:210027-210046`
- `prepareContextForPlanMode` (obfuscated: `xhH`) - records prePlanMode + auto-mode prep - `cli_inner_pretty.js:443097-443111`
- `getAllowedChannels` (obfuscated: `uw`) - `--channels` allow-list - `cli_inner_pretty.js:3217-3219`
- `isNonInteractive` (obfuscated: `R6`) - `!isInteractive` - `cli_inner_pretty.js:2742-2744`
- `isInteractiveEntrypoint` (obfuscated: `RL`) - TTY & non-SDK entrypoint - `cli_inner_pretty.js:235617-235621`
- `isBashAvailable` (obfuscated: `K1`) - bash present (always true off-Windows) - `cli_inner_pretty.js:216267-216270`
- `getModeColor` (obfuscated: `tV`) - mode → theme color - `cli_inner_pretty.js:49218-49220`
- `STATUS_BULLET_GLYPH` / `BLACK_CIRCLE` (obfuscated: `r9`) - status bullet, `⏺` on macOS / `●` elsewhere - `cli_inner_pretty.js:49116` (declaration), `49159` (assignment)
- `READ_TOOL_NAME` (obfuscated: `HK`) - `"Read"` - `cli_inner_pretty.js:145385`
- `GLOB_TOOL_NAME` (obfuscated: `S_`) - `"Glob"` - `cli_inner_pretty.js:212034`
- `GREP_TOOL_NAME` (obfuscated: `s1`) - `"Grep"` - `cli_inner_pretty.js:212063`

See also:
- [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) - the companion exit tool (the approval-dialog half of the trap-avoidance pairing)

---

## Confidence labels

- **High confidence:** tool descriptor shape and all flags (§2, §4); the `agentId` throw (§3);
  `isEnabled` gate and its two predicates (§5); the `call` lifecycle and the order-sensitivity of
  `prepareContextForPlanMode` before `applyPermissionUpdate` (§6); `handlePlanModeTransition` as a
  boolean toggle (§6); the permission descriptor and `cancelled` default (§7); the prompt/footer
  de-branching with **0 grep hits** for `isPlanModeInterviewPhase` and `USER_TYPE === "ant"` (§8, §10);
  the NEW shell-alias branch and its predicates (§9); the three UI renderers (§11). All line numbers in
  these sections were read directly from the v2.1.156 bundle.
- **High confidence (added):** the exact glyph value of the status bullet (`r9`) — its *declaration* at
  `49116` and its figures-init *assignment* at `49159` (`r9 = n$() === "macos" ? "⏺" : "●"`) are both
  read directly from this build. The glyph is platform-dependent: `⏺` (BLACK CIRCLE FOR RECORD) on macOS,
  `●` (BLACK CIRCLE) elsewhere (§11).
- **Medium confidence:** the full body of `applyPermissionUpdate` beyond the `setMode` case and the
  complete branch logic of `prepareContextForPlanMode`'s auto-mode paths were read but their *downstream
  consumers* (`prePlanMode` restore-on-exit) live elsewhere and were not traced here.
- **Open question (low impact):** whether any live call site sets `context.agentId` such that the
  `agentId` throw is actually reachable in production (vs. being purely defensive). The tool is
  registered globally; confirming it is filtered out of subagent toolsets would upgrade the
  "defense in depth" claim from inferred to verified.
