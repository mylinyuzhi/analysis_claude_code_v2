# Read-only auto-allow in plan mode (`.198`) and the browser read-only predicate (`.199`)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

Two consecutive releases fixed two halves of the same question — *which tool calls may run without a
prompt while the session is in plan mode?* `.198` fixed **when** the answer is computed (a session that
was born in plan mode never got the answer at all). `.199` fixed **what** the answer is for browser
tools (a nine-name allow-list was applied blindly, ignoring the call's arguments).

> The 2.1.193 current-state description of plan mode lives at
> [`../../../claude_code_v_2.1.193/analyze/05_plan_mode/README.md`](../../../claude_code_v_2.1.193/analyze/05_plan_mode/README.md).
> This document only covers what changed.

---

## 0. The trap you must clear first

The obvious anchor for `.199` is the browser auto-allow name set. **It is carryover.** I re-derived it
in both bundles:

| | 2.1.193 | 2.1.220 |
|---|---|---|
| symbol | `Kvt` `:12531`, populated `:12536-12546 (193)` | `OKt` `:34670`, populated `:34675-34684` |
| members | `tabs_context_mcp`, `tabs_create_mcp`, `tabs_close_mcp`, `shortcuts_list`, `shortcuts_execute`, `resize_window`, `switch_browser`, `list_connected_browsers`, `gif_creator` | **identical 9 names, identical order** |
| sibling set | `TJo = new Set(["switch_browser","list_connected_browsers","select_browser"])` `:12547 (193)` | `COl` — same three names `:34685` |

A `grep -c` on any member (e.g. `gif_creator` 220=9 / 193=8) reads like a delta and is not one.
Worse, the *symbol names themselves* are re-mangled onto unrelated declarations across builds — in
2.1.193, `cOt` is a CommonJS module wrapper at `:161316-161317 (193)`, `BEy` is a bundler alias at
`:264361 (193)`, and `OKt` is `getRemoteControlPolicyVerdict` at `:603963 (193)`. Counting those names
gives 4/1/5 in 193 and proves nothing. Every claim below was made by reading the declaration in
**both** bundles.

The real delta is a **new predicate layer in front of the unchanged set**.

---

## 1. `.199` — `isReadOnlyBrowserCall`: from set membership to argument inspection

> *"Fixed plan mode not prompting for state-changing browser tool calls; read-only `browser_batch`
> calls are now correctly auto-allowed."*

**Verdict: NET_NEW.** `cOt` (`:288994`) and `BEy` (`:289288`) are new *functions* in 2.1.220; their
2.1.193 namesakes are unrelated vendored declarations (above). The predicate's data tables `len` and
`vEy` (`:289002-289013`) have no 2.1.193 equivalent, and the human-readable action strings they feed
(`record a GIF of the page` `:289103`, `open a new browser tab` `:289105`,
`create a browser window and read your tabs` `:289081`, `read your browser tabs` `:289081`) are all
**220=1 / 193=0**.

### 1.1 The predicate

**What it does:** Answers "is this one browser tool call provably read-only?" from the tool name *and*
its input object, replacing "is this tool name in the nine-name set?".

**How it works:**

1. `vEy` (`:289007-289013`) is the **unconditional** read-only set — five names whose every invocation
   is read-only regardless of arguments: `list_connected_browsers`, `resize_window`, `shortcuts_list`,
   `switch_browser`, `tabs_close_mcp`.
2. `len` (`:289002-289006`) is the **conditional** map — three names whose verdict depends on one input
   field: `read_console_messages` → `z9u`, `read_network_requests` → `z9u`, `tabs_context_mcp` → `DEs`.
3. `z9u(input)` (`:288991`) is `!input?.clear` — reading the console/network buffer is read-only, but
   `{clear: true}` *empties the browser's buffer*, which is a side effect on the user's browser.
4. `DEs(input)` (`:288988`) is `!input?.createIfEmpty` — listing tabs is read-only, but
   `{createIfEmpty: true}` **opens a browser window**.
5. Anything not in either table returns `false`.

```javascript
// ============================================
// isReadOnlyBrowserCall - per-call read-only verdict for one Claude-in-Chrome tool
// Location: cli_inner_pretty.js:288988-289013
// ============================================

// ORIGINAL (for source lookup):
function DEs(e) {
  return !e?.createIfEmpty;
}
function z9u(e) {
  return !e?.clear;
}
function cOt(e, t) {
  if (vEy.has(e)) return !0;
  let r = len.get(e);
  if (r) return r(t);
  return !1;
}
var len, vEy;
var mbo = S(() => {
  ((len = new Map([
    ["read_console_messages", z9u],
    ["read_network_requests", z9u],
    ["tabs_context_mcp", DEs],
  ])),
    (vEy = new Set([
      "list_connected_browsers",
      "resize_window",
      "shortcuts_list",
      "switch_browser",
      "tabs_close_mcp",
    ])));
});

// READABLE (for understanding):
function tabsContextIsReadOnly(input) {
  return !input?.createIfEmpty;          // createIfEmpty opens a window -> not read-only
}
function bufferReadIsReadOnly(input) {
  return !input?.clear;                  // clear: true empties the browser's buffer
}
function isReadOnlyBrowserCall(toolName, input) {
  if (UNCONDITIONALLY_READ_ONLY_BROWSER_TOOLS.has(toolName)) return true;
  let argumentDependentCheck = ARGUMENT_DEPENDENT_BROWSER_TOOLS.get(toolName);
  if (argumentDependentCheck) return argumentDependentCheck(input);
  return false;                          // default deny: unknown or known-mutating
}

// Mapping: cOt→isReadOnlyBrowserCall, DEs→tabsContextIsReadOnly, z9u→bufferReadIsReadOnly,
//          len→ARGUMENT_DEPENDENT_BROWSER_TOOLS, vEy→UNCONDITIONALLY_READ_ONLY_BROWSER_TOOLS
```

### 1.2 What actually changed, member by member

The composition `OKt.has(name) && cOt(name, input)` is what replaced `Kvt.has(name)`. Intersecting the
carryover nine-name set with the new predicate:

| Name (in the 9-name set) | 2.1.193 verdict | 2.1.220 verdict | Why |
|---|---|---|---|
| `list_connected_browsers` | auto-allow | auto-allow | in `vEy` |
| `resize_window` | auto-allow | auto-allow | in `vEy` |
| `shortcuts_list` | auto-allow | auto-allow | in `vEy` |
| `switch_browser` | auto-allow | auto-allow | in `vEy` |
| `tabs_close_mcp` | auto-allow | auto-allow | in `vEy` |
| `tabs_context_mcp` | auto-allow | **auto-allow only without `createIfEmpty`** | `len` → `DEs` |
| `tabs_create_mcp` | auto-allow | **prompts** | in neither table |
| `shortcuts_execute` | auto-allow | **prompts** | in neither table |
| `gif_creator` | auto-allow | **prompts** | in neither table |

Three of nine lost their blanket exemption and a fourth became conditional. Note the direction of the
mistakes being corrected: `tabs_create_mcp` **opens a tab**, `shortcuts_execute` **runs a user-recorded
macro of arbitrary browser actions**, and `gif_creator` **records the screen and writes a file**. None
of those is read-only; they were in the set because the set originally meant "browser *management*
verbs", not "read-only verbs". `.199` re-purposed the set's meaning and added the predicate that makes
the new meaning true.

The reverse also happened: `read_console_messages` and `read_network_requests` are in `len` but **not**
in `OKt`, so the conjunction still rejects them here. They exist in `len` for the *other* consumer of
`cOt` — the auto-mode allow-list tables at `:513012-513015`, which key on the fully-qualified MCP names.

### 1.3 `browser_batch`: recursion, and the two directions of the recursion

`browser_batch` takes an `actions: [{name, input}]` array. A batch is a single tool call, so a single
verdict must be derived from N sub-verdicts. 2.1.220 does that in `BEy` (`:289288-289294`):

```javascript
// ============================================
// browserBatchNeedsPermission - does any sub-action of a browser_batch require approval?
// Location: cli_inner_pretty.js:289288-289294
// ============================================

// ORIGINAL (for source lookup):
function BEy(e) {
  if (!Array.isArray(e.actions)) return !1;
  return e.actions.some((t) => {
    if (!uOt(t) || typeof t.name !== "string") return !0;
    return t.name === "browser_batch" || (OKt.has(t.name) && !cOt(t.name, uOt(t.input) ? t.input : {}));
  });
}

// READABLE (for understanding):
function browserBatchNeedsPermission(input) {
  if (!Array.isArray(input.actions)) return false;
  return input.actions.some((action) => {
    if (!isPlainObject(action) || typeof action.name !== "string") return true;   // malformed -> fail closed
    return (
      action.name === "browser_batch" ||                                          // no nesting
      (BROWSER_AUTO_ALLOW_TOOL_NAMES.has(action.name) &&
        !isReadOnlyBrowserCall(action.name, isPlainObject(action.input) ? action.input : {}))
    );
  });
}

// Mapping: BEy→browserBatchNeedsPermission, uOt→isPlainObject, OKt→BROWSER_AUTO_ALLOW_TOOL_NAMES,
//          cOt→isReadOnlyBrowserCall
```

**Why `some(...)` and not `every(...)`?** Because the question is "does anything here need a prompt",
not "is everything here safe". A batch is approved as a unit, so one mutating sub-action must taint the
whole batch. `every(isReadOnly)` would have been the equivalent formulation but fails open on the empty
array; `some(needsPermission)` fails **closed** on a malformed entry (`return !0` on the first line of
the callback) and closed on nesting.

**Why refuse a nested `browser_batch` outright?** A nested batch would need a recursive walk with cycle
and depth accounting; refusing it costs one comparison and removes an entire class of "how deep did we
check?" bugs. The same three-line shape appears in `xEy` (`:289056-289068`), which builds the
human-readable prompt text and *skips* read-only sub-actions so the dialog says
"navigate and click" rather than "read your browser tabs, navigate, and click" — so the predicate is
used both to decide and to explain.

### 1.4 Where the verdict is consumed: the `passthrough`-in-plan-mode branch

`$Es` (`:289344`, exported as `getClaudeInChromePermissionOverrides` `:289132`) is the per-tool
permission override every Claude-in-Chrome tool is built with. The 2.1.193 version began:

```javascript
// 193: :288605-288607
    checkPermissions: async (o, s) => {
      let i = s.toolUseId;
      if (Kvt.has(e)) return { behavior: "allow", updatedInput: o };
```

2.1.220 replaces that with a three-value computation and adds a plan-mode arm at the end of the
function:

```javascript
// ============================================
// chromeToolCheckPermissions - the read-only fast allow and the new plan-mode passthrough
// Location: cli_inner_pretty.js:289353-289357, :289440
// ============================================

// ORIGINAL (for source lookup):
    checkPermissions: async (o, i) => {
      let s = i.toolUseId,
        a = OKt.has(e);
      if (a && cOt(e, o)) return { behavior: "allow", updatedInput: o };
      let l = (a && !cOt(e, o)) || (e === "browser_batch" && BEy(o));
      ...
      if (l && d.mode === "plan") return { behavior: "passthrough", message: "Claude in Chrome requires permission." };
      return { behavior: "ask", message: "Claude in Chrome requires permission.", ... };

// READABLE (for understanding):
    checkPermissions: async (input, ctx) => {
      let toolUseId = ctx.toolUseId,
        isOnAutoAllowList = BROWSER_AUTO_ALLOW_TOOL_NAMES.has(toolName);
      if (isOnAutoAllowList && isReadOnlyBrowserCall(toolName, input))
        return { behavior: "allow", updatedInput: input };            // (1) provably read-only
      let isStateChanging =
        (isOnAutoAllowList && !isReadOnlyBrowserCall(toolName, input)) ||   // (2) on the list but mutating
        (toolName === "browser_batch" && browserBatchNeedsPermission(input));
      ...
      if (isStateChanging && permissionCtx.mode === "plan")
        return { behavior: "passthrough", message: "Claude in Chrome requires permission." };   // (3)
      return { behavior: "ask", message: "Claude in Chrome requires permission.", ... };

// Mapping: $Es→getClaudeInChromePermissionOverrides, a→isOnAutoAllowList, l→isStateChanging,
//          d→permissionCtx (En(i)), OKt→BROWSER_AUTO_ALLOW_TOOL_NAMES, cOt→isReadOnlyBrowserCall
```

**Why `passthrough` and not `ask`?** This is the single most important design decision in the change,
and it is easy to misread as a no-op.

`ask` means *"I, the tool, have decided this needs one prompt"*. Returning `ask` from a tool's own
`checkPermissions` **satisfies** the permission pipeline: the user sees a generic "Allow Claude in
Chrome to click on example.com?" dialog, says yes, and the action runs — **while the session is
supposedly in plan mode**. That is exactly the bug: plan mode's contract ("no side effects until the
plan is approved") was reduced to "one extra click".

`passthrough` means *"I have no opinion"*. Control returns to the generic dispatcher `o$_`
(`:513554`), which now carries a plan-mode floor added in the same window:

```javascript
// ============================================
// checkToolPermissions - the plan-mode floor that catches the browser passthrough
// Location: cli_inner_pretty.js:513584-513594
// ============================================

// ORIGINAL (for source lookup):
    let y = e.inputSchema.parse(t);
    if (
      ((l = await e.checkPermissions(y, r)),
      e.mcpInfo && !e.isReadOnly(y) && l.behavior === "passthrough" && En(r).mode === "plan" && !n2o(GK(e), y))
    )
      l = {
        behavior: "ask",
        message: `Cannot call ${e.name} while in plan mode.`,
        decisionReason: { type: "mode", mode: "plan" },
      };

// READABLE (for understanding):
    let parsedInput = tool.inputSchema.parse(rawInput);
    verdict = await tool.checkPermissions(parsedInput, ctx);
    if (
      tool.mcpInfo &&                                  // MCP-surfaced tool (Chrome tools are MCP)
      !tool.isReadOnly(parsedInput) &&
      verdict.behavior === "passthrough" &&
      getPermissionContext(ctx).mode === "plan" &&
      !isStrictlyReadOnlyBrowserTool(getFullToolName(tool), parsedInput)
    )
      verdict = {
        behavior: "ask",
        message: `Cannot call ${tool.name} while in plan mode.`,
        decisionReason: { type: "mode", mode: "plan" },   // <- the tag that the auto-mode floor reads
      };

// Mapping: o$_→checkToolPermissions, n2o→isStrictlyReadOnlyBrowserTool, GK→getFullToolName,
//          En→getPermissionContext
```

`Cannot call ${e.name} while in plan mode.` is **220=1 / 193=0** — a genuinely new string, and the
proof that this arm did not exist before. The `decisionReason: {type:"mode", mode:"plan"}` tag matters
far beyond the message: it is what `Prp` (`:513484`) tests, and `Prp` is what re-arms the plan-mode
floor inside auto mode (see
[`bash_bypass_and_classifier_212_218.md`](bash_bypass_and_classifier_212_218.md) §3).

**Key insight:** the fix is not "add a prompt". It is "**stop** answering, so that the mode gate can
answer". A tool that returns `ask` silently promotes itself above the permission mode; a tool that
returns `passthrough` stays subordinate to it. Every tool-level permission override in this codebase
faces the same choice, and the browser override got it wrong until `.199`.

### 1.5 The strict predicate `n2o` — a *second*, narrower read-only definition

`:513588` does not call `cOt`; it calls `n2o` (`:512911-512922`). There are two browser read-only
predicates in 2.1.220 and they disagree on purpose:

| | `zqs` (`:512892`) — the lenient one | `n2o` (`:512911`) — the strict one |
|---|---|---|
| base tool set | `P1_` (`:512965-512995`, ~23 built-in read-only tools) | **none** — browser-only |
| chrome name set | `M1_` (`:513008`) from `yrp` = 8 names | `B1_` (`:513038`) from `vrp` = **5 names** |
| `vrp` members | — | `find`, `get_page_text`, `list_connected_browsers`, `read_page`, `shortcuts_list` |
| conditional map | `_rp` (`:513012`) | `_rp` (same) |
| `computer` sub-action set | `O1_` (`:513018-513035`) — **18** actions incl. all clicks, scroll, drag | `U1_` (`:513039`) — **5** actions: `screenshot`, `wait`, `get_page_text`, `find`, `cursor_position` |
| used by | the auto-mode allowlist fast path `:513833` | the plan-mode floor `:513588`, `:513751`; the post-queue revalidation `:513132` |

**Why two?** Auto mode's contract is "prevent destructive, hard-to-undo, or security-relevant
actions"; clicking a button is none of those, so `zqs` lets `left_click` through. Plan mode's contract
is "produce **no** observable change until the plan is approved"; clicking a button submits forms and
navigates, so `n2o` refuses it. The same tool call is therefore auto-allowed in auto mode and blocked
in plan mode — which is correct, and which a single shared predicate could not express.

**Where the split came from:** in 2.1.193 there was exactly one such predicate, `rWf`
(`isAutoModeAllowlistedTool`, `:597321-597331 (193)`), reading one flat 13-name set `ZGf`
(`:597386-597402 (193)`: `find`, `get_page_text`, `gif_creator`, `list_connected_browsers`,
`read_console_messages`, `read_network_requests`, `read_page`, `resize_window`, `select_browser`,
`shortcuts_list`, `switch_browser`, `tabs_close_mcp`, `tabs_context_mcp`). 2.1.220 split that one set
three ways: 8 unconditional (`yrp`), 3 conditional (`len`, shared with `cOt`), and 2 dropped entirely
(`gif_creator`, `select_browser`) — then derived a stricter 5-name subset for the plan-mode floor.
`mcp__Claude_Preview__` / `mcp__Claude_Browser__` (`t2o`, `:512996`) also join `mcp__claude-in-chrome__`
/ `mcp__Claude_in_Chrome__` as recognised prefixes (`mcp__Claude_Preview__` is **220=2 / 193=0**),
so all four spellings of the browser surface get the same treatment.

---

## 2. `.198` — the session that was born in plan mode

> *"Fixed plan mode not auto-allowing read-only tool calls when a session starts in plan mode."*

**Verdict: NET_NEW, and the mechanism is a five-line branch plus one extracted function.**

### 2.1 The bug, stated in terms of state

Plan mode's "auto-allow read-only tool calls" behaviour is not a property of plan mode at all — it is a
property of **plan mode *with auto mode active***. The predicate is `Qqs` (`:513122`):

```javascript
function Qqs(e) {
  return e === "auto" || (e === "plan" && A9());     // A9 = isAutoModeActive, :325869
}
```

`A9()` reads a **module-global mutable flag** `vfe.active` (`:325869-325871`), not the permission
context. So plan mode only auto-allows anything if somebody previously called `$N(true)`
(`setAutoModeActive`, `:325866`).

Who calls it? In 2.1.193, exactly one place mattered: `Pmt` (`prepareContextForPlanMode`,
`:598780-598795 (193)`), which runs on the **transition** `X → plan`:

```javascript
// 193: :598789
    if (n && t !== "bypassPermissions") return (H$?.setAutoModeActive(!0), { ...sV(e), prePlanMode: t });
```

A session launched with `--permission-mode plan` (or restored into plan mode) never performs a
transition — its context is *constructed* with `mode: "plan"`. `Pmt` is never called, `$N(true)` never
runs, `A9()` stays `false`, `Qqs("plan")` is `false`, and the whole auto-mode block at `:513732` is
skipped. Every read-only tool call prompts. That is the reported symptom, exactly.

The tell in the data structure is `prePlanMode`: a context that *entered* plan mode records what it
came from (`{...e, prePlanMode: t}`); a context that *started* in plan mode has `prePlanMode`
undefined. So `mode === "plan" && !prePlanMode` is a precise, cheap test for "born in plan mode".

### 2.2 The fix

2.1.220 extracts the activation into `Kfn` (exported as `activatePlanAutoMode`, `:529177` — the export
literal is **220=1 / 193=0**) and calls it from a second place: the gate verifier that runs on context
updates.

```javascript
// ============================================
// activatePlanAutoMode + verifyAutoModeGateAccess - late activation for born-in-plan sessions
// Location: cli_inner_pretty.js:529742-529745, :529635-529644
// ============================================

// ORIGINAL (for source lookup):
function Kfn(e) {
  if (!xUo()) return null;
  return ($N(!0), Dte(e));
}
...
  if (l)
    return {
      updateContext: (E) => {
        if (E.mode === "plan" && !E.prePlanMode) {
          let A = Kfn(E);
          if (A) return d({ ...A, prePlanMode: "default" }, c);
        }
        return d(E, c);
      },
    };

// READABLE (for understanding):
function activatePlanAutoMode(permissionCtx) {
  if (!shouldPlanUseAutoMode()) return null;              // gate off, or useAutoModeDuringPlan === false
  setAutoModeActive(true);                                // the flag A9() reads
  return stripDangerousPermissionsForAutoMode(permissionCtx);
}
...
  if (canEnterAuto)
    return {
      updateContext: (ctx) => {
        if (ctx.mode === "plan" && !ctx.prePlanMode) {    // born in plan mode, never transitioned
          let activated = activatePlanAutoMode(ctx);
          if (activated) return setAvailability({ ...activated, prePlanMode: "default" }, carouselAvailable);
        }
        return setAvailability(ctx, carouselAvailable);
      },
    };

// Mapping: Kfn→activatePlanAutoMode, xUo→shouldPlanUseAutoMode, $N→setAutoModeActive,
//          Dte→stripDangerousPermissionsForAutoMode, Vfn→verifyAutoModeGateAccess, d→setAvailability
```

The 2.1.193 line this replaces is a bare pass-through: `if (c) return { updateContext: (b) => d(b, l) };`
(`:598682 (193)`).

**How it works:**

1. `Vfn` (`verifyAutoModeGateAccess`, `:529614`) already ran on every context update — it resolves the
   remote `tengu_auto_mode_config` gate, the `disableAutoMode` setting, and model support, and it
   returns an `updateContext` transformer. It is the one hook guaranteed to see a born-in-plan context.
2. The new branch fires only when `mode === "plan" && !prePlanMode`.
3. `Kfn` re-checks `xUo()` = `gk() && YMi()` (`:529739-529740`) — the auto-mode gate **and** the
   `useAutoModeDuringPlan` setting, which is resolved across four settings layers at `:63540-63548`
   (`policySettings`, `flagSettings`, `userSettings`, `localSettings`, each `!== false`). So an org can
   still switch this off; the fix does not force auto semantics onto anyone.
4. `Dte` (`stripDangerousPermissionsForAutoMode`, `:529287-529300`) removes allow-rules that would
   bypass the classifier and records them in `strippedDangerousRules` so `gRe`
   (`restoreDangerousPermissions`, `:529301-529313`) can put them back on plan exit. Calling it is not
   optional: activating auto without stripping would hand the session a *weaker* posture than it had.
5. `prePlanMode: "default"` is then written, which (a) makes the context indistinguishable from one
   that entered plan mode from `default`, and (b) **makes the branch idempotent** — `updateContext`
   runs on every gate re-verification, and without this the function would call `$N(true)` and re-strip
   rules forever.

**Why `"default"` and not the real prior mode?** There is no real prior mode; the session started here.
`"default"` is the conservative choice: on `ExitPlanMode` the tool reads `prePlanMode ?? "default"`
(`:326096`) and restores that mode, so a born-in-plan session drops to `default` after approval rather
than to `acceptEdits` or `bypassPermissions`.

**Failure mode worth noting:** `Kfn` returns `null` when the gate is off, and the branch then falls
through to `d(E, c)` unchanged — so the pre-`.198` behaviour (prompt for everything) is still what a
gate-disabled session gets. The fix is strictly additive.

**Key insight:** this is a *lifecycle* bug, not a *policy* bug. The policy ("plan mode may use auto
semantics") already existed and was already correct; it was installed by a transition handler, and one
legitimate way of reaching plan mode does not go through a transition. The one-line diagnostic is
`prePlanMode === undefined`, and the fix is to give the initialisation path the same entry point the
transition path uses — which is why the extraction of `Kfn` and the fix are the same commit.

---

## 3. What this leaves for the auto-mode side

Both fixes above deliver a verdict *into* the auto-mode adjudication block. What that block then does
with a plan-mode verdict — including the two ways plan mode could still run a file-modifying Bash
command without any prompt — is
[`bash_bypass_and_classifier_212_218.md`](bash_bypass_and_classifier_212_218.md).

The Bash read-only analyzer itself (the thing that decides whether a *shell command* is provably
read-only) is owned by [`../38_permissions/`](../38_permissions/) — see
[`../38_permissions/classifier_adjudication.md`](../38_permissions/classifier_adjudication.md) and
[`../38_permissions/security_hardening_214.md`](../38_permissions/security_hardening_214.md).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_plan_mode.md](../00_overview/symbol_additions_v2_1_220_plan_mode.md).

Key functions in this document:
- `isReadOnlyBrowserCall` (`cOt`, `:288994`) - per-call read-only verdict for a Chrome tool
- `tabsContextIsReadOnly` (`DEs`, `:288988`) - `!input.createIfEmpty`
- `bufferReadIsReadOnly` (`z9u`, `:288991`) - `!input.clear`
- `UNCONDITIONALLY_READ_ONLY_BROWSER_TOOLS` (`vEy`, `:289007`) - 5 names
- `ARGUMENT_DEPENDENT_BROWSER_TOOLS` (`len`, `:289002`) - 3 names → predicate
- `BROWSER_AUTO_ALLOW_TOOL_NAMES` (`OKt`, `:34675`) - the carryover 9-name set (was `Kvt` `:12536 (193)`)
- `browserBatchNeedsPermission` (`BEy`, `:289288`) - `some()` over sub-actions, fails closed
- `describeBrowserBatchActions` (`xEy`, `:289056`) - prompt text builder that skips read-only sub-actions
- `describeBrowserAction` (`uen`, `:289069`) - name+input → human phrase
- `getClaudeInChromePermissionOverrides` (`$Es`, `:289344`) - holds the read-only allow and the plan passthrough
- `isPlanMode` (`tcr`, `:289037`) - `ctx.mode === "plan"`
- `checkToolPermissions` (`o$_`, `:513554`) - dispatcher holding the `Cannot call … while in plan mode.` floor
- `isStrictlyReadOnlyBrowserTool` (`n2o`, `:512911`) - the strict browser predicate used by the plan floor
- `isAutoModeAllowlistedTool` (`zqs`, `:512892`) - the lenient predicate used by the auto-mode fast path
- `STRICT_READ_ONLY_BROWSER_NAMES` (`vrp`/`B1_`, `:513037`/`:513038`) - 5 names
- `LENIENT_READ_ONLY_BROWSER_NAMES` (`yrp`/`M1_`, `:512998`/`:513008`) - 8 names
- `STRICT_READ_ONLY_COMPUTER_ACTIONS` (`U1_`, `:513039`) - 5 `computer` actions
- `LENIENT_READ_ONLY_COMPUTER_ACTIONS` (`O1_`, `:513018`) - 18 `computer` actions
- `isAutoModeActive` (`A9`, `:325869`) - reads the module-global `vfe.active`
- `setAutoModeActive` (`$N`, `:325866`) - writes it
- `isAutoModePermissionSurface` (`gnn`, `:325872`) - `auto` OR `plan`+auto
- `isAutoOrPlanAutoMode` (`Qqs`, `:513122`) - the classifier-block entry test
- `activatePlanAutoMode` (`Kfn`, `:529742`) - the extracted activator (220-only export name)
- `verifyAutoModeGateAccess` (`Vfn`, `:529614`) - holds the born-in-plan branch at `:529638`
- `shouldPlanUseAutoMode` (`xUo`, `:529739`) - gate AND `useAutoModeDuringPlan`
- `resolveUseAutoModeDuringPlan` (`YMi`, `:63540`) - four-layer settings resolution
- `prepareContextForPlanMode` (`bdr`, `:529746`) - the transition path that also calls `Kfn`
- `stripDangerousPermissionsForAutoMode` (`Dte`, `:529287`) / `restoreDangerousPermissions` (`gRe`, `:529301`)
