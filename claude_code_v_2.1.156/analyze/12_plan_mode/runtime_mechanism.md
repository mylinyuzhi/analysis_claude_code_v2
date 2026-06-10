# Plan Mode Runtime Mechanism (v2.1.156)

> **Scope / Source.** This document explains *what actually runs* when Claude Code v2.1.156 is in plan mode: the permission-mode metadata that defines "plan", the session-state flags that track plan-mode crossings, the mode-transition machinery, the write-permission floor that enforces read-only behavior, the seeded plan-file naming scheme, the per-turn reminder cadence, and how plan mode survives (or deliberately does *not* survive) a `--resume`. Every claim is grounded in the v2.1.156 obfuscated bundle at `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` and cited as `cli_inner_pretty.js:<line>`; line numbers were verified by reading each region. Cross-validation uses the v2.1.88 unobfuscated TypeScript at `/lyz/codespace/3rd/claude-code/src/utils/{plans.ts,planModeV2.ts}` and the tool-prompt sources, which is where the readable names originate.
>
> **TL;DR.** Plan mode is one of six external permission modes (`cli_inner_pretty.js:49174`). Its identity lives in a metadata table (`cli_inner_pretty.js:49230`), its session-crossing bookkeeping lives in getter/setter pairs on the global state object (`cli_inner_pretty.js:3035-3065`), and its *enforcement* is a single decision inside the write-permission checker that, after deny-rules and safety checks have had their say, universally downgrades any remaining write to `ask` (`cli_inner_pretty.js:549873`). Reads, by contrast, are run with `mode` rewritten to `default` (`cli_inner_pretty.js:549790`), so plan mode floors writes without ever restricting reads. The plan file itself is exempt from the floor (`cli_inner_pretty.js:549942`) and is now named from a human-readable seed (`cli_inner_pretty.js:549223`, new in 2.1.156). Per-turn reminders re-anchor the model on a 5-turn / every-5th-full cadence (`cli_inner_pretty.js:414015`). On resume, plan mode and `bypassPermissions` are intentionally dropped (`cli_inner_pretty.js:598940`).

---

## Related Symbols

> Symbol mappings live in the central index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)

Key symbols in this document:
- `EXTERNAL_PERMISSION_MODES` (obfuscated: `st`) — the six-mode list, `cli_inner_pretty.js:49174`
- `PERMISSION_MODE_METADATA` (obfuscated: `xEq`) — title/symbol/color table, `cli_inner_pretty.js:49228-49253` (plan entry at 49230)
- `getModeDefaultBehavior` (obfuscated: `ZF$`) — mode → allow/ask/deny/classify, `cli_inner_pretty.js:49209-49214`
- `hasExitedPlanModeInSession` (obfuscated: `m7$`) / `setHasExitedPlanMode` (obfuscated: `zQ`) — `cli_inner_pretty.js:3035-3040`
- `needsPlanModeExitAttachment` (obfuscated: `Rm8`) / `setNeedsPlanModeExitAttachment` (obfuscated: `Gt`) — `cli_inner_pretty.js:3041-3046`
- `updatePlanModeExitAttachmentFlag` (obfuscated: `Tt`) — boundary-crossing flag toggle, `cli_inner_pretty.js:3047-3050`
- `transitionPermissionMode` (obfuscated: `vl`) — central mode transition, `cli_inner_pretty.js:442777-442791`
- `prepareContextForPlanMode` (obfuscated: `xhH`) — captures `prePlanMode`, `cli_inner_pretty.js:443097-443112`
- `recordPermissionModeChanged` (obfuscated: `t1H`) — OTEL telemetry, `cli_inner_pretty.js:222562-222565`
- `checkWritePermissionForTool` (obfuscated: `ChH`) — THE WRITE FLOOR, `cli_inner_pretty.js:549806-549890`
- `checkInternalEditablePath` (obfuscated: `WlH`) — plan/workflow/scratchpad/bg exemption, `cli_inner_pretty.js:549939-549997`
- `isPlanFileForCurrentSession` (obfuscated: `b$9`) — plan-file path test, `cli_inner_pretty.js:549461-549467`
- `buildWritePermissionSuggestions` (obfuscated: `Ah$`) — setMode suggestions, `cli_inner_pretty.js:549891-549916`
- `getPlanSlug` (obfuscated: `ILH`) — seeded slug generator, `cli_inner_pretty.js:549223-549238`
- `slugifyPromptSeed` (obfuscated: `MM6`) / `generateTwoWordSuffix` (obfuscated: `wgH`) / `generateWordSlug` (obfuscated: `y88`) — `cli_inner_pretty.js:141340-141362`
- `getPlanFilePath` (obfuscated: `wV`) / `getPlan` (obfuscated: `DV`) / `getPlansDirectory` (obfuscated: `nM`) — `cli_inner_pretty.js:549248-549398`
- `copyPlanForResume` (obfuscated: `HW8`) / `recoverPlanFromMessages` (obfuscated: `CJz`) / `snapshotPlanFile` (obfuscated: `CL8`) — `cli_inner_pretty.js:549265-549362`
- `buildPlanModeAttachment` (obfuscated: `eS_`) / `buildPlanModeExitAttachment` (obfuscated: `fw4`) — `cli_inner_pretty.js:412847-412879`
- `countTurnsSincePlanAttachment` (obfuscated: `ng6`) / `countPlanModeAttachments` (obfuscated: `tS_`) — `cli_inner_pretty.js:412820-412846`
- `PLAN_MODE_CADENCE` (obfuscated: `lg6`) — `cli_inner_pretty.js:414015`
- `renderPlanModeReminder` (obfuscated: `IQ_`) / `buildFullPlanModeReminder` (obfuscated: `bQ_`) / `buildSparsePlanModeReminder` (obfuscated: `xQ_`) / `buildSubAgentPlanModeReminder` (obfuscated: `uQ_`) — `cli_inner_pretty.js:445313-445424`
- `PLAN_MODE_READONLY_PREAMBLE` (obfuscated: `jG4`) / `PLAN_MODE_PHASE4_FINAL_PLAN` (obfuscated: `CQ_`) / `buildExitPlanModeFooter` (obfuscated: `wG4`) — `cli_inner_pretty.js:445318-446486`
- `getMainLoopModelForPermissionMode` (obfuscated: `VT`) / `getModelOverride` (obfuscated: `he`) / `getOpusModel` (obfuscated: `TT`) / `getSonnetModel` (obfuscated: `NN`) / `describeModelAlias` (obfuscated: `WY$`) — `cli_inner_pretty.js:98701-98801`
- `reconcileRestoredPermissionMode` (obfuscated: `Vyz`) — drops plan/bypass on resume, `cli_inner_pretty.js:598936-598953`
- `getPlanModeV2AgentCount` (obfuscated: `zG4`) / `getPlanModeV2ExploreAgentCount` (obfuscated: `AG4`) — `cli_inner_pretty.js:443669-443686`
- `ExitPlanModeTool` (obfuscated: `JC`) — deferred plan-exit tool, `cli_inner_pretty.js:350025-350200`
- `filterToolsByPermissionMode` (obfuscated: `uE6`) — keeps ExitPlanMode available, `cli_inner_pretty.js:278956-278971`
- `getPromptSuggestionBlockReason` (obfuscated: `gv6`) — suppresses suggestions in plan mode, `cli_inner_pretty.js:240792-240799`
- `EXIT_PLAN_MODE_TOOL_NAME` (obfuscated: `wv`/`oG`) / `ENTER_PLAN_MODE_TOOL_NAME` (obfuscated: `og`) / `ASK_USER_QUESTION_TOOL_NAME` (obfuscated: `ez`) — `cli_inner_pretty.js:143385-143388`

---

## 1. Plan Mode as a Permission *Mode*

Plan mode is not a separate subsystem with its own flag — it is one value of the single `permissionMode` enum that the whole permission engine is parameterized over. The six external modes are defined as a flat list (`EXTERNAL_PERMISSION_MODES`, obfuscated `st`) and its alias `ny` is what user-facing normalization validates against:

```javascript
// ============================================
// EXTERNAL_PERMISSION_MODES + getModeDefaultBehavior - the mode vocabulary and its base behavior
// Location: cli_inner_pretty.js:49174 / 49209-49214
// ============================================

// ORIGINAL (for source lookup):
st = ["acceptEdits", "auto", "bypassPermissions", "default", "dontAsk", "plan"];
function ZF$(H, $) {
  if (H === "auto") return "classify";
  if (H === "bypassPermissions" || (H === "plan" && $)) return "allow";
  if (H === "dontAsk") return "deny";
  return "ask";
}

// READABLE (for understanding):
EXTERNAL_PERMISSION_MODES = ["acceptEdits", "auto", "bypassPermissions", "default", "dontAsk", "plan"];
function getModeDefaultBehavior(mode, isPlanAllowedContext) {
  if (mode === "auto") return "classify";
  if (mode === "bypassPermissions" || (mode === "plan" && isPlanAllowedContext)) return "allow";
  if (mode === "dontAsk") return "deny";
  return "ask";
}

// Mapping: st->EXTERNAL_PERMISSION_MODES, ZF$->getModeDefaultBehavior, H->mode, $->isPlanAllowedContext
```

The display identity (title, short title, glyph, color, external token) is a static table, `PERMISSION_MODE_METADATA` (obfuscated `xEq`, `cli_inner_pretty.js:49228-49253`). The plan entry is `{ title: "Plan Mode", shortTitle: "Plan", symbol: XF$, color: "planMode", external: "plan" }` (`cli_inner_pretty.js:49230`), where `XF$` is the pause glyph `⏸` (U+23F8). Lookups go through `getPermissionModeMetadata` (obfuscated `WF$`, `cli_inner_pretty.js:49194`) which falls back to the `default` row, and the user-facing string is read via `Yi`/`tt`/`n3H` accessors on that table.

### The `getModeDefaultBehavior` "plan && context" branch

**What it does.** Maps a mode to one of four base behaviors (`allow` / `ask` / `deny` / `classify`). The notable line is `mode === "plan" && $` returning `allow`.

**How it works.** The function is called with a second argument (`isPlanAllowedContext`, obfuscated `$`). For plan mode the *default* behavior is `ask` (the final `return "ask"`), but when the caller passes a truthy second argument, plan mode is allowed. This second argument is the escape hatch the engine uses for the contexts where plan mode should *not* floor a tool — e.g. when classifying a read or when the tool is on the read-only allowlist.

**Why this approach.** Folding plan into the same allow/ask/deny vocabulary as every other mode means the permission engine has exactly one decision surface; plan mode never needs a parallel code path. The `&& $` guard avoids hard-coding plan's "default ask" everywhere — callers that legitimately should let plan-mode actions through (reads) pass the flag, rather than the engine maintaining a second whitelist. The alternative — a dedicated `isPlanModeBlocked(tool)` predicate — would scatter plan knowledge across every tool's permission check.

**Key insight.** Plan mode's read-only nature is *not* encoded here; this is only the abstract default. The real enforcement is in the write checker (§4), and this function's `ask` default is what that checker ultimately materializes for writes.

---

## 2. Session-State Model: the `d$` flag cluster

Plan-mode bookkeeping lives as getter/setter pairs on the global session-state object `d$`. There are two parallel concerns — *"did we exit plan mode at least once this session?"* and *"do we owe the model an exit reminder?"* — and an auto-mode mirror of the latter:

```javascript
// ============================================
// Plan-mode session-state cluster - exit tracking and boundary-crossing flag
// Location: cli_inner_pretty.js:3035-3050
// ============================================

// ORIGINAL (for source lookup):
function m7$() { return d$.hasExitedPlanMode; }
function zQ(H) { d$.hasExitedPlanMode = H; }
function Rm8() { return d$.needsPlanModeExitAttachment; }
function Gt(H) { d$.needsPlanModeExitAttachment = H; }
function Tt(H, $) {
  if ($ === "plan" && H !== "plan") d$.needsPlanModeExitAttachment = !1;
  if (H === "plan" && $ !== "plan") d$.needsPlanModeExitAttachment = !0;
}

// READABLE (for understanding):
function hasExitedPlanModeInSession() { return sessionState.hasExitedPlanMode; }
function setHasExitedPlanMode(value) { sessionState.hasExitedPlanMode = value; }
function needsPlanModeExitAttachment() { return sessionState.needsPlanModeExitAttachment; }
function setNeedsPlanModeExitAttachment(value) { sessionState.needsPlanModeExitAttachment = value; }
function updatePlanModeExitAttachmentFlag(fromMode, toMode) {
  if (toMode === "plan" && fromMode !== "plan") sessionState.needsPlanModeExitAttachment = false; // entering plan CLEARS
  if (fromMode === "plan" && toMode !== "plan") sessionState.needsPlanModeExitAttachment = true;  // leaving plan SETS
}

// Mapping: m7$->hasExitedPlanModeInSession, zQ->setHasExitedPlanMode, Rm8->needsPlanModeExitAttachment,
//          Gt->setNeedsPlanModeExitAttachment, Tt->updatePlanModeExitAttachmentFlag, H->fromMode, $->toMode, d$->sessionState
```

### How `updatePlanModeExitAttachmentFlag` tracks the exit-reminder debt

**What it does.** Toggles the "owe an exit reminder" flag based on which direction the plan boundary was crossed.

**How it works.** The signature is `(fromMode, toMode)` — the same order every caller passes and the same order `transitionPermissionMode` (`vl`) uses for `Tt(H, $)` at `cli_inner_pretty.js:442779` (and all four other callers pass `(currentMode, "plan")`). Entering plan (`toMode === "plan" && fromMode !== "plan"`) *clears* the flag to `false`; leaving plan (`fromMode === "plan" && toMode !== "plan"`) *sets* it to `true`. Crossings that do not touch the plan boundary (e.g. `default → acceptEdits`) leave the flag untouched.

**Why this approach.** The flag is consumed by the *exit* attachment builder `fw4` (§7): it emits a one-shot "you have left plan mode" reminder only when the flag is set. The direction is intuitive — the reminder debt is *raised* at the moment you leave plan mode (`fromMode === "plan"`), and `fw4` then *pays* it by emitting the `plan_mode_exit` attachment and clearing the flag. Entering plan resets the flag to `false` so a fresh planning episode starts with no stale exit debt outstanding.

**Key insight.** The auto-mode analog `Cm8` (obfuscated, `cli_inner_pretty.js:3057-3062`) is deliberately a *no-op* for auto↔plan crossings (`if ((H === "auto" && $ === "plan") || (H === "plan" && $ === "auto")) return;`). That carve-out exists because plan mode can be entered *from* auto and restored *to* auto (§3), and you do not want an auto-exit reminder firing just because you briefly passed through plan; the two reminder systems are kept from double-firing on the shared auto/plan boundary.

There is also a per-session slug cache, `getPlanSlugCache` (obfuscated `yYH`, `cli_inner_pretty.js:3110-3112`), a `Map<sessionId, slug>` on `d$`; the session-id helpers `setSessionId` (obfuscated `_T`, `cli_inner_pretty.js:2384`) and the reset path `resetSession` (obfuscated `ex8`, `cli_inner_pretty.js:2366`) delete stale entries so a `/clear` or session swap yields a fresh plan filename.

---

## 3. Mode Transitions: `transitionPermissionMode`, `prePlanMode`, telemetry

Every mode change funnels through `transitionPermissionMode` (obfuscated `vl`). It is the only place that emits telemetry, updates the boundary flags, and (critically for plan) captures the *previous* mode so exit can restore it.

```javascript
// ============================================
// transitionPermissionMode - the single mode-transition funnel
// Location: cli_inner_pretty.js:442777-442791
// ============================================

// ORIGINAL (for source lookup):
function vl(H, $, q, K) {
  if (H === $) return q;
  if ((t1H({ from: H, to: $, trigger: K }), Tt(H, $), Cm8(H, $), H === "plan" && $ !== "plan")) zQ(!0);
  {
    if ($ === "plan" && H !== "plan") return xhH(q);
    let _ = H === "auto" || (H === "plan" && (Pk?.isAutoModeActive() ?? !1)),
      z = $ === "auto";
    if (z && !_) {
      if (!h0()) throw Error("Cannot transition to auto mode: gate is not enabled");
      (Pk?.setAutoModeActive(!0), (q = Km(q)));
    } else if (_ && !z) (Pk?.setAutoModeActive(!1), PR(!0), (q = EzH(q)));
  }
  if (H === "plan" && $ !== "plan" && q.prePlanMode) return { ...q, prePlanMode: void 0 };
  return q;
}

// READABLE (for understanding):
function transitionPermissionMode(fromMode, toMode, context, trigger) {
  if (fromMode === toMode) return context;
  recordPermissionModeChanged({ from: fromMode, to: toMode, trigger });
  updatePlanModeExitAttachmentFlag(fromMode, toMode);
  updateAutoModeExitAttachmentFlag(fromMode, toMode);
  if (fromMode === "plan" && toMode !== "plan") setHasExitedPlanMode(true);
  if (toMode === "plan" && fromMode !== "plan") return prepareContextForPlanMode(context); // capture prePlanMode
  // ...auto-mode gate plumbing (orthogonal to plan)...
  if (fromMode === "plan" && toMode !== "plan" && context.prePlanMode)
    return { ...context, prePlanMode: undefined };                                          // clear on exit
  return context;
}

// Mapping: vl->transitionPermissionMode, H->fromMode, $->toMode, q->context, K->trigger,
//          t1H->recordPermissionModeChanged, Tt->updatePlanModeExitAttachmentFlag,
//          Cm8->updateAutoModeExitAttachmentFlag, zQ->setHasExitedPlanMode, xhH->prepareContextForPlanMode, Pk->autoModeController
```

### Entering plan mode: `prepareContextForPlanMode` stashes `prePlanMode`

```javascript
// ============================================
// prepareContextForPlanMode - record where we came from so exit can restore it
// Location: cli_inner_pretty.js:443097-443112
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
function prepareContextForPlanMode(context) {
  let currentMode = context.mode;
  if (currentMode === "plan") return context;
  let autoModeAvailable = isAutoModeAvailable();
  if (currentMode === "auto") {
    if (autoModeAvailable) return { ...context, prePlanMode: "auto" };
    // auto gate is off: deactivate auto, raise auto-exit flag, strip dangerous rules, then enter plan
    deactivateAutoMode(); setNeedsAutoModeExitAttachment(true);
    return { ...stripDangerousRulesForAutoMode(context), prePlanMode: "auto" };
  }
  if (autoModeAvailable && currentMode !== "bypassPermissions")
    return { ...applyAutoModeRules(context), prePlanMode: currentMode };
  logForDebugging("[prepareContextForPlanMode] plain plan entry, prePlanMode=" + currentMode);
  return { ...context, prePlanMode: currentMode };
}

// Mapping: xhH->prepareContextForPlanMode, H->context, $->currentMode, Hi6->isAutoModeAvailable,
//          Km->applyAutoModeRules, EzH->stripDangerousRulesForAutoMode, PR->setNeedsAutoModeExitAttachment
```

**What it does.** Stores the mode the user was in before entering plan mode into `context.prePlanMode`.

**How it works.** Whatever the prior mode (`auto`, `acceptEdits`, `dontAsk`, `bypassPermissions`, or `default`), it is recorded on `prePlanMode`. The auto branches additionally normalize auto-mode controller state so plan mode does not run with a live auto-classifier underneath it.

**Why this approach.** Plan mode is an *interlude*, not a destination — the user entered it from some working mode and expects to return there after approving the plan. Capturing `prePlanMode` makes exit deterministic: `ExitPlanMode` reads `prePlanMode` and restores it (§9). The alternative — always returning to `default` after planning — would silently demote a user who was in `acceptEdits` and force them to re-elevate after every plan.

**Key insight.** `prePlanMode` is also a *policy input*, not just a restore target. The write-suggestion builder `Ah$` (§4) computes `z = (mode === "plan") && prePlanMode ∈ {auto, bypassPermissions, acceptEdits, dontAsk}` (`cli_inner_pretty.js:549899-549904`), then `A = (mode === "default" || mode === "plan") && !z`, and only emits the `{type:"setMode", mode:"acceptEdits"}` shortcut when `A` is true (`cli_inner_pretty.js:549905-549916`). Because the gate is `!z`, the "jump to acceptEdits" shortcut is offered precisely when `prePlanMode` is *not* in that elevated set — i.e. when the user entered plan from plain `default` — and *suppressed* when they were already elevated (where the shortcut would be pointless). This is a suggestion-offering decision; the actual restore-to-`prePlanMode` happens in `ExitPlanMode` (§9), and a user who entered plan from `default` returns to `default`, so plan mode is never a stealth elevation path.

Telemetry is emitted via `recordPermissionModeChanged` (obfuscated `t1H`), which fires an OTEL `permission_mode_changed` event with `{from_mode, to_mode, trigger}` and short-circuits when `from === to` (`cli_inner_pretty.js:222562-222565`). Plan exit specifically uses `trigger: "exit_plan_mode"` (`cli_inner_pretty.js:350154`).

---

## 4. The Write Floor: `checkWritePermissionForTool` ordering

This is the heart of plan-mode enforcement. `checkWritePermissionForTool` (obfuscated `ChH`) is the permission check that `Write` (obfuscated `GD`), `Edit` (obfuscated `hJ`), and `NotebookEdit` all route through. Its *ordering* is the central design decision.

```javascript
// ============================================
// checkWritePermissionForTool - the write floor (deny -> memory -> allow-rule -> ask-rule -> exemption -> safety -> PLAN FLOOR -> acceptEdits/workingDir)
// Location: cli_inner_pretty.js:549806-549890
// ============================================

// ORIGINAL (for source lookup):
function ChH(H, $, q, K) {
  if (typeof H.getPath !== "function") return { behavior: "ask", message: `Claude requested permissions to use ${H.name}, but you haven't granted it yet.` };
  let _ = H.getPath($), z = K ?? Ry(_);
  for (let w of z) { let D = dP(w, q, "edit", "deny"); if (D) return { behavior: "deny", message: `Permission to edit ${_} has been denied.`, decisionReason: { type: "rule", rule: D } }; }
  let A = LK(_);
  if (ng(A) && XR()) return { behavior: "deny", message: "Cannot write to memory while it is toggled off. Run /toggle-memory to re-enable automemory.", decisionReason: { type: "other", reason: "memory access blocked by /toggle-memory" } };
  let Y = dP(_, { ...q, alwaysAllowRules: { session: q.alwaysAllowRules.session ?? [] } }, "edit", "allow");
  if (Y) { let w = Y.ruleValue.ruleContent; if (w && (w.startsWith(_68.slice(0, -2)) || w.startsWith(z68.slice(0, -2))) && !w.includes("..") && w.endsWith("/**") && q.mode !== "plan") return { behavior: "allow", updatedInput: $, decisionReason: { type: "rule", rule: Y } }; }
  for (let w of z) { let D = dP(w, q, "edit", "ask"); if (D) return { behavior: "ask", message: `Claude requested permissions to write to ${_}, but you haven't granted it yet.`, decisionReason: { type: "rule", rule: D } }; }
  let f = WlH(A, $, z); if (f.behavior !== "passthrough") return f;
  let O = _J$(_, z, void 0, q.isRemoteMode, q.trustedNetworkDirectories);
  if (!O.safe) { /* ...safetyCheck ask with rich suggestions... */ return { behavior: "ask", message: O.message, suggestions: D, decisionReason: { type: "safetyCheck", reason: O.message, classifierApprovable: O.classifierApprovable } }; }
  if (q.mode === "plan") return { behavior: "ask", message: `Cannot write to ${_} while in plan mode.`, decisionReason: { type: "mode", mode: "plan" } };
  let M = QI(_, q, z);
  if (q.mode === "acceptEdits" && M) return { behavior: "allow", updatedInput: $, decisionReason: { type: "mode", mode: q.mode } };
  let j = Q$9(z, q, "edit"); if (j) return { behavior: "allow", updatedInput: $, decisionReason: { type: "rule", rule: j } };
  return { behavior: "ask", message: `Claude requested permissions to write to ${_}, but you haven't granted it yet.`, suggestions: Ah$(_, "write", q, z), decisionReason: !M ? { type: "workingDir", reason: "Path is outside allowed working directories" } : void 0 };
}

// READABLE (for understanding):
function checkWritePermissionForTool(tool, input, ctx, precomputedRules) {
  if (typeof tool.getPath !== "function") return ask(`...use ${tool.name}...`);
  let path = tool.getPath(input), rules = precomputedRules ?? rulesForPath(path);
  // 1. DENY rules win outright
  for (let r of rules) { let d = matchRule(r, ctx, "edit", "deny"); if (d) return deny(`Permission to edit ${path} has been denied.`, { type: "rule", rule: d }); }
  // 2. memory toggle
  let canon = canonicalize(path);
  if (isMemoryPath(canon) && memoryToggledOff()) return deny("Cannot write to memory while it is toggled off...");
  // 3. ALLOW rule, but the .claude/** fast path is GATED OFF in plan mode
  let allow = matchRule(path, ctx, "edit", "allow");
  if (allow) { let content = allow.ruleValue.ruleContent;
    if (content && (content.startsWith(CLAUDE_PROJECT_GLOB.slice(0,-2)) || content.startsWith(CLAUDE_HOME_GLOB.slice(0,-2)))
        && !content.includes("..") && content.endsWith("/**") && ctx.mode !== "plan")
      return allow(input, { type: "rule", rule: allow });
  }
  // 4. ASK rules
  for (let r of rules) { let a = matchRule(r, ctx, "edit", "ask"); if (a) return ask(`...write to ${path}...`, { type: "rule", rule: a }); }
  // 5. internal-editable exemption (plan file, workflow script, scratchpad, bg tmp, memory, wiki...)
  let exempt = checkInternalEditablePath(canon, input, rules); if (exempt.behavior !== "passthrough") return exempt;
  // 6. dangerous-path safety check (rich ask)
  let safety = runSafetyCheck(path, rules, ctx.isRemoteMode, ctx.trustedNetworkDirectories);
  if (!safety.safe) return ask(safety.message, { suggestions, decisionReason: { type: "safetyCheck", ... } });
  // 7. >>> PLAN-MODE FLOOR <<< everything still standing becomes "ask"
  if (ctx.mode === "plan") return ask(`Cannot write to ${path} while in plan mode.`, { type: "mode", mode: "plan" });
  // 8. acceptEdits allow / workingDir allow (only reached when NOT in plan)
  let inWorkingDir = isInWorkingDir(path, ctx, rules);
  if (ctx.mode === "acceptEdits" && inWorkingDir) return allow(input, { type: "mode", mode: ctx.mode });
  let dirRule = matchDirectoryRule(rules, ctx, "edit"); if (dirRule) return allow(input, { type: "rule", rule: dirRule });
  return ask(`...write to ${path}...`, { suggestions: buildWritePermissionSuggestions(path, "write", ctx, rules) });
}

// Mapping: ChH->checkWritePermissionForTool, dP->matchRule, WlH->checkInternalEditablePath, _J$->runSafetyCheck,
//          QI->isInWorkingDir, Ah$->buildWritePermissionSuggestions, _68->CLAUDE_PROJECT_GLOB, z68->CLAUDE_HOME_GLOB, q->ctx
```

### Decision: why the plan floor sits *after* safety but *before* acceptEdits/workingDir

**What it does.** Once deny-rules, the memory toggle, allow-rules, ask-rules, the internal-editable exemption, and the dangerous-path safety check have all declined to make a final decision, plan mode forces `behavior: "ask"` with `decisionReason: { type: "mode", mode: "plan" }` for *every* remaining write (`cli_inner_pretty.js:549873-549878`).

**How it works.** The floor is line 549873. Everything above it can still return its own decision: a deny rule still denies (you do not want plan mode to silently "ask" about something a user explicitly blocked); a dangerous-path write still surfaces the richer `safetyCheck` ask with its tailored message and add-rule suggestion; and the plan file itself is allowed by the exemption at step 5. Only *after* all of those does plan mode universally downgrade the action to `ask`, and the lines below it — the `acceptEdits` auto-allow (549880) and the working-directory rule allow (549883) — are never reached while in plan mode.

**Why this approach (and the alternatives).** The ordering encodes a precedence lattice: *deny/safety semantics must outrank the plan floor, and the plan floor must outrank every "auto-allow" convenience.* If the floor were placed at the very top, a deny rule's specific "denied" message and a dangerous-path's classifier-approvable safety prompt would be flattened into a generic "ask in plan mode," losing fidelity the user needs to make a decision. If the floor were placed at the very bottom (after `acceptEdits`), then a user who was in `acceptEdits` before entering plan mode could have writes silently auto-approved — defeating the entire point of plan mode. Sandwiching it between the two ranges is the only ordering that preserves both the high-priority deny/safety messaging *and* the read-only guarantee.

**Key insight.** The floor uses `decisionReason.type === "mode"`, which is a *distinct* reason from `rule`/`safetyCheck`/`workingDir`. That lets the upstream UI render "Cannot write … while in plan mode" rather than a generic permission prompt, and lets analytics distinguish plan-mode floors from ordinary permission asks.

### Decision: the `.claude/**` allow-rule is suppressed in plan mode

**What it does.** At step 3, an allow rule whose content matches `/.claude/**` (`_68`) or `~/.claude/**` (`z68`, defined `cli_inner_pretty.js:145253-145254`) normally short-circuits to `allow` — but the conjunct `q.mode !== "plan"` (`cli_inner_pretty.js:549838`) disables that fast path in plan mode.

**Why this approach.** The `.claude/**` allow rule is a convenience that lets the agent freely manage its own config tree (settings, agents, commands) without prompting. In plan mode, honoring it would create a backdoor: an agent that is supposed to be read-only could silently rewrite `.claude/settings.json` or a hook script. Explicitly excluding plan mode from this one fast path closes that hole while still letting the *generic* plan floor (step 7) turn such a write into a user-visible `ask`. The alternative — letting the allow rule through and relying on the floor — fails, because step 3 returns early and never reaches step 7.

**Key insight.** This is a deliberate, non-obvious carve-out: it is the only allow-rule the engine specifically refuses to honor in plan mode, precisely because `.claude/**` is the one allowlist powerful enough to reconfigure the agent itself.

### Read vs write asymmetry

The read-permission sibling (just above `ChH`) does something the write path never does: it rewrites the mode to `default` before delegating.

```javascript
// ============================================
// Read-permission downgrade - plan mode never restricts reads
// Location: cli_inner_pretty.js:549790-549791
// ============================================

// ORIGINAL (for source lookup):
let A = q.mode === "plan" ? { ...q, mode: "default" } : q,
  Y = ChH(H, $, A, _);

// READABLE (for understanding):
let ctxForRead = ctx.mode === "plan" ? { ...ctx, mode: "default" } : ctx;
let result = checkWritePermissionForTool(tool, input, ctxForRead, rules);

// Mapping: A->ctxForRead, q->ctx, ChH->checkWritePermissionForTool
```

**Key insight.** Because reads run with `mode` rewritten to `default`, the plan floor at step 7 can never fire for a read — reads pass through normal rules unmolested. The write path keeps `mode === "plan"` so the floor *does* apply. This two-line difference is the entire encoding of "read-only exploration": reads are normal, writes are floored. No separate read-only tool list is needed.

---

## 5. Internal-Editable Exemption: the plan file is writable

The exemption at step 5 of the write floor is `checkInternalEditablePath` (obfuscated `WlH`, `cli_inner_pretty.js:549939-549997`). It walks a list of "files Claude is allowed to write even while otherwise restricted" and returns an explicit `allow` (or `deny` for toggled-off memory):

- `isPlanFileForCurrentSession` (obfuscated `b$9`) — the current session's plan file (`cli_inner_pretty.js:549942`)
- `UJz` — workflow script files (`cli_inner_pretty.js:549948`)
- `u$9` — scratchpad files (`cli_inner_pretty.js:549954`)
- `m$9` — background-job `tmp/` subtree (`cli_inner_pretty.js:549960`)
- agent-memory `.md` files, auto-memory `.md`, wiki files, and the preview `launch.json` (`cli_inner_pretty.js:549966-549995`)

```javascript
// ============================================
// isPlanFileForCurrentSession - is this path the plan file for the live session?
// Location: cli_inner_pretty.js:549461-549467
// ============================================

// ORIGINAL (for source lookup):
function b$9(H) {
  let $ = n8$();
  if (!$) return !1;
  let q = D1.join(nM(), $), K = D1.normalize(H);
  return K.startsWith(q) && K.endsWith(".md");
}

// READABLE (for understanding):
function isPlanFileForCurrentSession(path) {
  let slug = getCachedPlanSlug();           // n8$ -> planSlugCache.get(sessionId)
  if (!slug) return false;
  let planBase = pathJoin(getPlansDirectory(), slug);
  let norm = pathNormalize(path);
  return norm.startsWith(planBase) && norm.endsWith(".md");
}

// Mapping: b$9->isPlanFileForCurrentSession, n8$->getCachedPlanSlug, nM->getPlansDirectory, D1->path
```

**What it does.** Whitelists the plan file so the agent can write its own plan even though plan mode floors all other writes.

**How it works.** It checks the normalized path against `{plansDir}/{slug}` (prefix) and `.md` (suffix). Because the exemption runs at step 5 — *before* the plan floor at step 7 — `b$9` returning `true` short-circuits the floor and the write is allowed.

**Why this approach.** The plan file is the one artifact plan mode *must* produce; flooring it would make plan mode self-contradictory. Putting the exemption inside the same checker (rather than special-casing the `Write`/`Edit` tools) means a single source of truth: any tool that writes a path, by any route, gets the same plan-file carve-out. The prefix-match (`startsWith(planBase)`) also covers the per-agent variants `{slug}-agent-{id}.md`, so sub-agents writing their own plan files are covered too.

**Key insight.** The exemption is *session-scoped* by construction: it resolves the slug from the live session's cache (`n8$`/`yYH`). A stale plan file from a different session does not match (different slug), so the agent cannot use plan mode to overwrite arbitrary `.md` files in the plans directory — only its own.

---

## 6. Plan-File Naming: the seeded slug algorithm (NEW in 2.1.156)

The biggest *runtime* change from v2.1.88 is that plan filenames are now human-readable, derived from the user's prompt. `getPlanSlug` (obfuscated `ILH`) takes an optional seed:

```javascript
// ============================================
// getPlanSlug - seeded, collision-avoiding plan slug (NEW seed parameter in 2.1.156)
// Location: cli_inner_pretty.js:549223-549238
// ============================================

// ORIGINAL (for source lookup):
function ILH(H, $) {
  let q = H ?? E$(), K = yYH(), _ = K.get(q);
  if (!_) {
    let z = nM(), A = $ ? MM6($) : "";
    for (let Y = 0; Y < IJz; Y++) {
      _ = A ? `${A}-${wgH()}` : y88();
      let f = hF.join(z, `${_}.md`);
      if (!U$().existsSync(f)) break;
    }
    K.set(q, _);
  }
  return _;
}

// READABLE (for understanding):
function getPlanSlug(sessionId, planSlugSeed) {
  let id = sessionId ?? getSessionId();
  let cache = getPlanSlugCache();
  let slug = cache.get(id);
  if (!slug) {
    let plansDir = getPlansDirectory();
    let kebabSeed = planSlugSeed ? slugifyPromptSeed(planSlugSeed) : "";   // first 4 words, <=40 chars
    for (let i = 0; i < MAX_SLUG_RETRIES; i++) {                           // IJz = 10
      slug = kebabSeed ? `${kebabSeed}-${generateTwoWordSuffix()}`         // e.g. add-user-auth-bright-otter
                       : generateWordSlug();                              // legacy adj-adj-noun fallback
      if (!getFs().existsSync(pathJoin(plansDir, `${slug}.md`))) break;
    }
    cache.set(id, slug);
  }
  return slug;
}

// Mapping: ILH->getPlanSlug, H->sessionId, $->planSlugSeed, E$->getSessionId, yYH->getPlanSlugCache,
//          nM->getPlansDirectory, MM6->slugifyPromptSeed, wgH->generateTwoWordSuffix, y88->generateWordSlug, IJz->MAX_SLUG_RETRIES
```

The two new helpers, plus the legacy `generateWordSlug` (`y88`) shown alongside them (`cli_inner_pretty.js:141340-141362`):

```javascript
// ============================================
// slugifyPromptSeed + generateTwoWordSuffix + generateWordSlug - kebab the prompt, then disambiguate (MM6/wgH NEW in 2.1.156)
// Location: cli_inner_pretty.js:141340-141362
// ============================================

// ORIGINAL (for source lookup):
function MM6(H, $ = {}) {
  let { words: q = 4, maxLen: K = 40 } = $;
  return H.replace(p75, " ").split(/\s+/).filter(Boolean).slice(0, q).join(" ").toLowerCase()
          .replace(/[^a-z0-9]+/g, "-").slice(0, K).replace(/^-+|-+$/g, "");
}
function wgH() { let H = CM$(vUK), $ = CM$(kUK); return `${H}-${$}`; }
function y88() { let H = CM$(vUK), $ = CM$(m75), q = CM$(kUK); return `${H}-${$}-${q}`; }

// READABLE (for understanding):
function slugifyPromptSeed(text, { words = 4, maxLen = 40 } = {}) {
  return text.replace(STRIP_RE, " ").split(/\s+/).filter(Boolean)
             .slice(0, words).join(" ").toLowerCase()
             .replace(/[^a-z0-9]+/g, "-").slice(0, maxLen).replace(/^-+|-+$/g, "");
}
function generateTwoWordSuffix() { return `${randomAdjective()}-${randomNoun()}`; }      // adj-noun
function generateWordSlug()      { return `${randomAdjective()}-${randomAdjective2()}-${randomNoun()}`; } // adj-adj-noun

// Mapping: MM6->slugifyPromptSeed, wgH->generateTwoWordSuffix, y88->generateWordSlug, CM$->pickRandomWord, vUK/m75/kUK->word pools
```

**What it does.** Produces a unique, human-readable filename like `add-user-auth-flow-bright-otter.md` instead of the old opaque `wise-ancient-otter.md`.

**How it works.** When a seed (typically the user's first prompt, threaded as `planSlugSeed` from the attachment builder at `cli_inner_pretty.js:412853`) is present, `slugifyPromptSeed` keeps the first four words, lowercases, replaces non-alphanumerics with dashes, caps at 40 chars, and trims stray dashes; `generateTwoWordSuffix` appends a random `adjective-noun` token. If no seed is available it falls back to the legacy three-word random slug `generateWordSlug` (the exact v2.1.88 behavior). Either way the slug is run through an `existsSync` retry loop up to `MAX_SLUG_RETRIES = 10` (`cli_inner_pretty.js:549367`) and cached per session.

**Why this approach (trade-offs).** The motivation is discoverability: a user browsing `~/.claude/plans/` can now recognize plans by name. The trade-off is that prompt text is arbitrary, so the slugifier must aggressively sanitize (4-word cap, 40-char cap, dash-collapse, trim) to avoid pathological filenames; and because two prompts can produce the same kebab seed, the random two-word suffix is retained as a collision-avoider — the `existsSync` loop is the final guard. The legacy random fallback preserves correctness when no seed exists (e.g. resumed sessions, programmatic entry). An alternative — hashing the prompt — would guarantee uniqueness but lose the human-readability that was the whole point.

**Key insight.** The retry loop and `MAX_SLUG_RETRIES = 10` are *identical* to v2.1.88 (`plans.ts:38`); only the slug *source* changed. The seeded pipeline is layered on top of an unchanged uniqueness guarantee, which is why the change is low-risk.

Path resolution is unchanged from v2.1.88. `getPlanFilePath` (obfuscated `wV`, `cli_inner_pretty.js:549248`) returns `{plansDir}/{slug}.md` or `{plansDir}/{slug}-agent-{agentId}.md`; `getPlan` (obfuscated `DV`, `cli_inner_pretty.js:549253`) reads it, returning `null` on `ENOENT`; and `getPlansDirectory` (obfuscated `nM`, `cli_inner_pretty.js:549382`) is a memoized resolver that resolves `settings.plansDirectory` against the project root, falls back to `~/.claude/plans` with the exact error string `plansDirectory must be within project root` if it would escape the root (`cli_inner_pretty.js:549389`), and `mkdirSync`s the result.

---

## 7. Per-Turn Reminder Cadence

Plan mode keeps the model anchored by injecting a `plan_mode` attachment on a throttled cadence. The builder is `buildPlanModeAttachment` (obfuscated `eS_`):

```javascript
// ============================================
// buildPlanModeAttachment - per-turn plan reminder with throttle, re-entry, and full/sparse selection
// Location: cli_inner_pretty.js:412847-412870
// ============================================

// ORIGINAL (for source lookup):
async function eS_(H, $, q, K) {
  if (T6(q).mode !== "plan") return [];
  if ($ && $.length > 0) {
    let { turnCount: M, foundPlanModeAttachment: j } = ng6($);
    if (j && M < lg6.TURNS_BETWEEN_ATTACHMENTS) return [];
  }
  ILH(E$(), K?.planSlugSeed ?? H ?? void 0);
  let z = wV(q.agentId), A = DV(q.agentId), Y = [];
  if (m7$() && A !== null) (Y.push({ type: "plan_mode_reentry", planFilePath: z }), zQ(!1));
  let O = (tS_($ ?? []) + 1) % lg6.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
  return (Y.push({ type: "plan_mode", reminderType: O, isSubAgent: !!q.agentId, planFilePath: z, planExists: A !== null, customInstructions: q.options.planModeInstructions }), Y);
}

// READABLE (for understanding):
async function buildPlanModeAttachment(seed, messages, sessionCtx, options) {
  if (getToolPermissionContext(sessionCtx).mode !== "plan") return [];
  if (messages && messages.length > 0) {
    let { turnCount, foundPlanModeAttachment } = countTurnsSincePlanAttachment(messages);
    if (foundPlanModeAttachment && turnCount < PLAN_MODE_CADENCE.TURNS_BETWEEN_ATTACHMENTS) return [];
  }
  getPlanSlug(getSessionId(), options?.planSlugSeed ?? seed ?? undefined);   // ensure slug exists, seeded
  let planFilePath = getPlanFilePath(sessionCtx.agentId);
  let planContent = getPlan(sessionCtx.agentId);
  let out = [];
  if (hasExitedPlanModeInSession() && planContent !== null) {                // re-entry case
    out.push({ type: "plan_mode_reentry", planFilePath }); setHasExitedPlanMode(false);
  }
  let reminderType = (countPlanModeAttachments(messages ?? []) + 1) % PLAN_MODE_CADENCE.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
  out.push({ type: "plan_mode", reminderType, isSubAgent: !!sessionCtx.agentId, planFilePath, planExists: planContent !== null, customInstructions: sessionCtx.options.planModeInstructions });
  return out;
}

// Mapping: eS_->buildPlanModeAttachment, T6->getToolPermissionContext, ng6->countTurnsSincePlanAttachment,
//          lg6->PLAN_MODE_CADENCE, ILH->getPlanSlug, wV->getPlanFilePath, DV->getPlan, tS_->countPlanModeAttachments,
//          m7$->hasExitedPlanModeInSession, zQ->setHasExitedPlanMode
```

The cadence config is `PLAN_MODE_CADENCE` (obfuscated `lg6`, `cli_inner_pretty.js:414015`): `{ TURNS_BETWEEN_ATTACHMENTS: 5, FULL_REMINDER_EVERY_N_ATTACHMENTS: 5 }`.

### Decision: throttle + full/sparse modulo

**What it does.** Emits a plan reminder at most once per 5 user turns, and makes every 5th emitted reminder the full 5-phase protocol; the rest are one-line nudges.

**How it works.** Two counters drive it. `countTurnsSincePlanAttachment` (obfuscated `ng6`, `cli_inner_pretty.js:412820`) scans backward counting *user* turns until it hits the most recent `plan_mode`/`plan_mode_reentry` attachment (returning `{turnCount, foundPlanModeAttachment}`); if a prior attachment exists and fewer than 5 turns have elapsed, the builder returns `[]` (skip). `countPlanModeAttachments` (obfuscated `tS_`, `cli_inner_pretty.js:412836`) counts `plan_mode` attachments since the last `plan_mode_exit`; the selector `(tS_ + 1) % 5 === 1` makes attachments number 1, 6, 11, … *full* and the rest *sparse*. Crucially, `tS_` scans the message history *backward* and `break`s the moment it hits a `plan_mode_exit` attachment (`cli_inner_pretty.js:412841`), so the count covers only the *current* planning episode — not the whole session. The practical effect is that the full/sparse cycle *resets on every plan exit*: re-entering plan mode after a previous plan starts the counter from zero, so the first reminder of each re-entered episode is again full rather than the count accumulating across episodes.

**Why this approach (trade-offs).** Plan-mode reminders are expensive — the full reminder (§8) is a multi-hundred-token 5-phase protocol. Re-injecting it every turn would bloat the context and waste tokens; never re-injecting it risks the model drifting out of plan discipline over a long session. The two-knob design balances them: the *turn* throttle bounds frequency (a reminder at most every ~5 turns), and the *attachment* modulo bounds cost (the heavy full protocol roughly every 25 user turns, with cheap one-liners in between to keep plan mode top-of-mind). The alternative — a single "every N turns" knob — could not independently tune "how often we nudge" vs "how often we re-state the whole protocol."

**Key insight.** The modulo is computed on `tS_ + 1` (the *prospective* count including the about-to-be-added attachment), so the very first plan reminder of a session is always full — the model gets the complete protocol immediately, then sparse reinforcement.

### Re-entry handling

When `hasExitedPlanModeInSession()` is true *and* a plan file already exists, the builder injects a distinct `plan_mode_reentry` attachment and clears the exit flag via `setHasExitedPlanMode(false)` (`cli_inner_pretty.js:412857`). The rendered text (`cli_inner_pretty.js:445576-445588`) instructs the model to re-read the existing plan, decide whether the new request is the same task (refine) or a different task (overwrite), and *always* edit the plan file before calling `ExitPlanMode`. This handles the user toggling back into plan mode after a prior plan, preventing the model from blindly continuing a stale plan.

The exit attachment is `buildPlanModeExitAttachment` (obfuscated `fw4`, `cli_inner_pretty.js:412871`): if still in plan mode it clears the flag and returns `[]`; otherwise, if `needsPlanModeExitAttachment()` is set or a recent plan attachment exists, it emits a one-shot `plan_mode_exit` attachment and clears the flag.

---

## 8. Reminder Text: read-only preamble, 5-phase body, ExitPlanMode footer

The attachment → text dispatcher is `renderPlanModeReminder` (obfuscated `IQ_`, `cli_inner_pretty.js:445313`):

```javascript
// ============================================
// renderPlanModeReminder - route plan attachment to sub-agent / sparse / full renderer
// Location: cli_inner_pretty.js:445313-445317
// ============================================

// ORIGINAL (for source lookup):
function IQ_(H) {
  if (H.isSubAgent) return uQ_(H);
  if (H.reminderType === "sparse") return xQ_(H);
  return bQ_(H);
}

// READABLE (for understanding):
function renderPlanModeReminder(attachment) {
  if (attachment.isSubAgent) return buildSubAgentPlanModeReminder(attachment);
  if (attachment.reminderType === "sparse") return buildSparsePlanModeReminder(attachment);
  return buildFullPlanModeReminder(attachment);
}

// Mapping: IQ_->renderPlanModeReminder, uQ_->buildSubAgentPlanModeReminder, xQ_->buildSparsePlanModeReminder, bQ_->buildFullPlanModeReminder
```

- **Full** (`buildFullPlanModeReminder`, obfuscated `bQ_`, `cli_inner_pretty.js:445324`) opens with the read-only preamble `PLAN_MODE_READONLY_PREAMBLE` (obfuscated `jG4`, `cli_inner_pretty.js:446485`): *"Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below) … This supercedes any other instructions you have received."* It then states whether a plan file already exists (and which tool to use — `Edit`/`hJ` to refine, `Write`/`GD` to create), splices in any `customInstructions`, lays out Phases 1–5 (explore with the `Explore` sub-agent, design with the `Plan` sub-agent, review, write the final plan per `PLAN_MODE_PHASE4_FINAL_PLAN`/`CQ_` at `cli_inner_pretty.js:446477`, then call `ExitPlanMode`), and ends with the footer.
- **Sparse** (`buildSparsePlanModeReminder`, obfuscated `xQ_`, `cli_inner_pretty.js:445411`) is a single line: *"Plan mode still active … Read-only except plan file ({path}) … End turns with AskUserQuestion (for clarifications) or ExitPlanMode (for plan approval). Never ask about plan approval via text or AskUserQuestion."*
- **Sub-agent** (`buildSubAgentPlanModeReminder`, obfuscated `uQ_`, `cli_inner_pretty.js:445416`) is the strictest: *"… you MUST NOT make any edits, run any non-readonly tools … This supercedes any other instructions …"* plus the plan-file info.

The footer `buildExitPlanModeFooter` (obfuscated `wG4`, `cli_inner_pretty.js:445318`) enforces the terminal-call contract: *"your turn should only end with either using the `AskUserQuestion` tool OR calling `ExitPlanMode`"* and explicitly forbids asking for plan approval via free text (*"Phrases like 'Is this plan okay?' … MUST use ExitPlanMode"*).

The Phase-1/Phase-2 agent counts are computed by `getPlanModeV2ExploreAgentCount` (obfuscated `AG4`, default 3) and `getPlanModeV2AgentCount` (obfuscated `zG4`, 3 for max-20x/enterprise/team else 1), both honoring `CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT` / `CLAUDE_CODE_PLAN_V2_AGENT_COUNT` env overrides (`cli_inner_pretty.js:443669-443686`) — byte-for-byte the v2.1.88 `planModeV2.ts` logic.

**Key insight.** The read-only preamble in v2.1.156 differs materially from the v2.1.88 EnterPlanMode prompt: v2.1.88 said "DO NOT write or edit any files yet. This is a read-only exploration and planning phase," whereas `jG4` now carves out the plan file ("with the exception of the plan file mentioned below"). The runtime now *expects* the agent to write its plan incrementally — which is why the write floor (§4) and the exemption (§5) explicitly permit the plan file. The prompt and the enforcement floor were co-designed.

---

## 9. Resume, Snapshot, and Recovery

### Snapshot for remote recovery

`snapshotPlanFile` (obfuscated `CL8`, `cli_inner_pretty.js:549341`) records a `system`/`file_snapshot` transcript entry `{ key: "plan", path: getPlanFilePath(), content: getPlan() }` — but only when running remotely (`D68() === null` guard). `ExitPlanMode` calls it right after persisting the plan (`cli_inner_pretty.js:350100`).

### Recovery on resume

`copyPlanForResume` (obfuscated `HW8`, `cli_inner_pretty.js:549265`) restores the slug from the transcript via `setPlanSlug` (obfuscated `wKq`), then reads the plan file. If the file is missing *and* the session is remote, it recovers from the file snapshot (`bJz`) or, failing that, scans the message history via `recoverPlanFromMessages` (obfuscated `CJz`, `cli_inner_pretty.js:549305`) for an `ExitPlanMode` `tool_use` input `plan`, a user `planContent`, or a `plan_file_reference` attachment. This is the v2.1.88 behavior including the same `Plan recovered from file snapshot/message history` log strings.

### Permission-mode persistence: plan and bypass are *dropped*

The most consequential resume decision is `reconcileRestoredPermissionMode` (obfuscated `Vyz`):

```javascript
// ============================================
// reconcileRestoredPermissionMode - decide what permission mode a resumed session starts in
// Location: cli_inner_pretty.js:598936-598953
// ============================================

// ORIGINAL (for source lookup):
async function Vyz(H, $) {
  if ($ || !H) return;
  let q = MN(H);
  if (q === "default" && H !== "default") return;
  if (q === "plan" || q === "bypassPermissions") return;
  if (q === "default") {
    { let { isAutoModeFromFallback: K } = await Promise.resolve().then(() => (x6H(), B_H)); if (K()) return "default"; }
    return;
  }
  if (q === "auto") {
    let { isAutoModeGateEnabled: K } = await Promise.resolve().then(() => (wD(), IL8));
    if (!K()) return;
  }
  return q;
}

// READABLE (for understanding):
async function reconcileRestoredPermissionMode(restoredMode, permissionModeCliSet) {
  if (permissionModeCliSet || !restoredMode) return undefined;        // CLI flag wins; nothing to restore
  let mode = normalizePermissionMode(restoredMode);                   // MN: valid mode or "default"
  if (mode === "default" && restoredMode !== "default") return undefined; // unknown mode -> ignore
  if (mode === "plan" || mode === "bypassPermissions") return undefined;  // DELIBERATELY DROPPED
  if (mode === "default") { if (isAutoModeFromFallback()) return "default"; return undefined; }
  if (mode === "auto") { if (!isAutoModeGateEnabled()) return undefined; } // auto needs its gate
  return mode;                                                        // acceptEdits / dontAsk / (gated) auto restore
}

// Mapping: Vyz->reconcileRestoredPermissionMode, H->restoredMode, $->permissionModeCliSet, MN->normalizePermissionMode
```

**What it does.** Decides which permission mode a `--resume`/`--continue` session boots into. It returns `undefined` (meaning "keep the CLI/default mode, do not restore the transcript's mode") for plan and bypass.

**How it works.** Two short-circuits dominate: (1) if `--permission-mode` was explicitly passed (`permissionModeCliSet`), nothing is restored — the CLI flag always wins; (2) if the restored mode is `plan` or `bypassPermissions`, it returns `undefined` regardless. `auto` is restored only if its gate is enabled; `acceptEdits`/`dontAsk` restore directly. The result feeds `restoreSessionState` (obfuscated `II8`, `cli_inner_pretty.js:599022-599031`), which only calls `transitionPermissionMode` when a non-`undefined` mode comes back.

**Why this approach (trade-offs).** Plan and bypass are treated as deliberately *ephemeral / elevated* states that must be re-opted-into each launch. Resuming straight back into plan mode would surprise a user who resumed expecting to *implement* an already-approved plan; auto-restoring `bypassPermissions` would silently re-grant the most dangerous mode without the `--dangerously-skip-permissions` ceremony. Dropping both forces an explicit `--permission-mode plan` (or `--dangerously-skip-permissions`) to re-enter. The trade-off is mild friction on resume in exchange for never silently re-entering a constrained or elevated state. The deferred-tool warning at `cli_inner_pretty.js:410762` documents exactly this policy to the user.

**Key insight.** This is why the snapshot/recovery machinery (above) exists *independently* of mode restoration: even though the session does not resume *in* plan mode, the plan *file* must still be recoverable so the user can implement it. State (the mode) is intentionally not persisted; the artifact (the plan) is.

---

## 10. Model Selection: opusplan / haiku

When the configured model alias is `opusplan`, plan mode gets Opus while implementation gets Sonnet. The switch is `getMainLoopModelForPermissionMode` (obfuscated `VT`):

```javascript
// ============================================
// getMainLoopModelForPermissionMode - opusplan/haiku plan-mode model switch
// Location: cli_inner_pretty.js:98735-98740
// ============================================

// ORIGINAL (for source lookup):
function VT(H) {
  let { permissionMode: $, mainLoopModel: q, exceeds200kTokens: K = !1 } = H;
  if (he() === "opusplan" && $ === "plan" && !K) return TT();
  if (he() === "haiku" && $ === "plan") return NN();
  return q;
}

// READABLE (for understanding):
function getMainLoopModelForPermissionMode({ permissionMode, mainLoopModel, exceeds200kTokens = false }) {
  if (getModelOverride() === "opusplan" && permissionMode === "plan" && !exceeds200kTokens) return getOpusModel();
  if (getModelOverride() === "haiku" && permissionMode === "plan") return getSonnetModel();
  return mainLoopModel;
}

// Mapping: VT->getMainLoopModelForPermissionMode, he->getModelOverride, TT->getOpusModel, NN->getSonnetModel, K->exceeds200kTokens
```

**What it does.** Returns Opus for planning under the `opusplan` alias, but only when the context is not over 200k tokens; under the `haiku` alias, planning uses Sonnet instead.

**How it works.** `getModelOverride` (obfuscated `he`, `cli_inner_pretty.js:98701`) reads the configured alias. For `opusplan` *and* `mode === "plan"` *and* not exceeding 200k tokens, it returns `getOpusModel` (obfuscated `TT`, `cli_inner_pretty.js:98720`). Otherwise it returns the plain main-loop model. `describeModelAlias` (obfuscated `WY$`, `cli_inner_pretty.js:98797`) surfaces this to the UI as "Opus in plan mode, else Sonnet."

**Why this approach (the subtle guard).** Planning is the high-leverage phase — getting the plan right with the strongest model is worth the cost, while implementation (which can be many turns) runs cheaper on Sonnet. The `!exceeds200kTokens` guard is the non-obvious part: at very large contexts plan mode *silently degrades* to the normal main-loop model. This is a deliberate cost/availability ceiling — running Opus on a >200k-token context is expensive and may exceed the model's effective window — so the "Opus in plan mode" promise is best-effort, not absolute. A user with a huge session who expects Opus planning will instead get Sonnet, with no error.

**Key insight.** The model switch is keyed purely on `permissionMode === "plan"`, so it composes automatically with everything else in this document — the same flag that floors writes also upgrades the model. No separate "is planning" signal is threaded through.

---

## 11. ExitPlanMode, Tool Availability, and Prompt Suppression

`ExitPlanModeTool` (obfuscated `JC`, declared at `cli_inner_pretty.js:350025`) is `shouldDefer: true` (`cli_inner_pretty.js:350044`) and `isReadOnly(): false`. Its `validateInput` hard-errors when `mode !== "plan"`, logging `tengu_exit_plan_mode_called_outside_plan` with `hasExitedPlanModeInSession: m7$()` (`cli_inner_pretty.js:350065-350074`) — so calling ExitPlanMode outside plan mode tells the model to enter plan mode first or continue implementing. `checkPermissions` returns `ask("Exit plan mode?")` (`cli_inner_pretty.js:350080`). In `call`, the tool persists the plan to `getPlanFilePath` and `snapshotPlanFile`s it (`cli_inner_pretty.js:350096-350100`); in team/swarm mode (`FA()`) it routes a `plan_approval_request` to the team-lead instead of prompting locally (`cli_inner_pretty.js:350101-350119`); otherwise it reads `prePlanMode`, restores it (downgrading `auto` to `default` if the auto gate is off), and emits `recordPermissionModeChanged({ from: "plan", to: prePlanMode, trigger: "exit_plan_mode" })` (`cli_inner_pretty.js:350144-350154`).

### Local ask vs team-lead plan-approval routing

The `call` body forks on whether plan approval is owned by a team lead. The guard is `FA() && NY$()` (`cli_inner_pretty.js:350101`): `FA()` (`cli_inner_pretty.js:99280`) is the team/swarm-mode gate (true under a swarm context or when an `agentId`+`teamName` are set), and `NY$()` (`cli_inner_pretty.js:99289`, `isPlanModeRequiredForTeam`) reports the team/swarm's `planModeRequired` flag (or the `CLAUDE_CODE_PLAN_MODE_REQUIRED` env). When both hold, the tool does *not* prompt locally — instead it requires the plan file to already exist (throwing `No plan file found at ${f}...` otherwise, `cli_inner_pretty.js:350102-350103`), builds a `plan_approval_request` envelope (`{type:"plan_approval_request", from, timestamp, planFilePath, planContent, requestId}` where `requestId = gUH("plan_approval", ...)`, `cli_inner_pretty.js:350104-350114`), and dispatches it to the `"team-lead"` mailbox via `aA("team-lead", ...)` (`cli_inner_pretty.js:350115`). It then returns `{ awaitingLeaderApproval: true, requestId, ... }` (`cli_inner_pretty.js:350119`) **without** restoring `prePlanMode` or emitting the `permission_mode_changed` event — the local mode transition is deliberately *deferred* until the lead approves out-of-band. In other words, when the team requires plan approval the approver is the team lead (not the local user), and `prePlanMode` is restored only later, when the approval round-trips back.

By contrast, the non-team (local) path falls through to `cli_inner_pretty.js:350121-350160`: it reads `prePlanMode ?? "default"`, downgrades `auto → default` when the auto gate is off (with a warning notification, `cli_inner_pretty.js:350123-350143`), sets `setHasExitedPlanMode(true)` / `setNeedsPlanModeExitAttachment(true)` (`zQ(!0), Gt(!0)` at `cli_inner_pretty.js:350146`), restores the prior `toolPermissionContext`, and emits `recordPermissionModeChanged({ from: "plan", to: prePlanMode, trigger: "exit_plan_mode" })` (`cli_inner_pretty.js:350154`) — i.e. the mode transition happens immediately and locally. The earlier `ask("Exit plan mode?")` in `checkPermissions` is what gates *this* local path; the team path bypasses it because approval lives with the lead.

Two supporting behaviors keep plan mode coherent:

- **ExitPlanMode is always available in plan mode.** `filterToolsByPermissionMode` (obfuscated `uE6`, `cli_inner_pretty.js:278956`) special-cases `if (h1(_, wv) && K === "plan") return true` (`cli_inner_pretty.js:278959`) — so even though most write tools are floored to `ask`, the model can always end a plan turn by calling ExitPlanMode.
- **Prompt suggestions are suppressed.** `getPromptSuggestionBlockReason` (obfuscated `gv6`, `cli_inner_pretty.js:240792`) returns `"plan_mode"` when `toolPermissionContext.mode === "plan"` (`cli_inner_pretty.js:240796`), turning off the ambient prompt-suggestion feature while planning so the UI does not nudge the user toward actions plan mode forbids.

---

## 12. Cross-Validation vs v2.1.88

The behavioral diff below compares the v2.1.88 TypeScript precursors against the v2.1.156 bundle. Confidence is **HIGH** where a v2.1.88 source file directly corresponds; **MEDIUM** where the v2.1.88 analog lives in the permission/resume core (not in the provided stub files) and the comparison rests on the verified v2.1.156 read plus the v2.1.142 doc pattern.

| Behavior | v2.1.88 | v2.1.156 | Verdict | Confidence |
|----------|---------|----------|---------|------------|
| Plan-slug generation | `getPlanSlug` (`plans.ts:31-49`) — pure `generateWordSlug()`, no seed | `getPlanSlug` (obf `ILH`, 549223) — seeded `${slugifyPromptSeed(seed)}-${generateTwoWordSuffix()}`, falls back to `generateWordSlug` only when no seed | **CHANGED** — new seeded pipeline | HIGH |
| Slug helpers | only `generateWordSlug` (adj-adj-noun) exposed in `words.ts` | adds `slugifyPromptSeed` (obf `MM6`, 141346) + `generateTwoWordSuffix` (obf `wgH`, 141358); legacy `y88` retained | **NEW** helpers | HIGH |
| Retry loop / `MAX_SLUG_RETRIES` | loop to 10 (`plans.ts:38`) | loop to `IJz = 10` (549230/549367) | **IDENTICAL** | HIGH |
| `getPlansDirectory` | memoized; resolves `plansDirectory` vs project root; falls back to `~/.claude/plans` with exact error; `mkdirSync` (`plans.ts:79-110`) | obf `nM` (549382-549398) — line-for-line match, same error string at 549389 | **IDENTICAL** | HIGH |
| `getPlanFilePath` / `getPlan` | `{slug}.md` / `{slug}-agent-{id}.md`; `readFileSync`, ENOENT→null (`plans.ts:117-145`) | obf `wV` (549248) / `DV` (549253) — exact match | **IDENTICAL** | HIGH |
| `copyPlanForResume` | restore slug, recover from snapshot then message history, remote-only guard (`plans.ts`) | obf `HW8` (549265) — same logic, same remote guard `D68() === null`, same log strings | **IDENTICAL** | HIGH |
| ExitPlanMode tool name | `EXIT_PLAN_MODE_V2_TOOL_NAME = "ExitPlanMode"` (`constants.ts`) | `wv`/`oG = "ExitPlanMode"` (143386-143387) | **IDENTICAL** | HIGH |
| Plan-mode agent counts | `getPlanModeV2AgentCount`/`ExploreAgentCount` (`planModeV2.ts:5-43`) — 3 for max-20x/enterprise/team else 1; explore default 3; env overrides; `0<n<=10` | obf `zG4` (443669) / `AG4` (443680) — exact match incl. env names & bound | **IDENTICAL** | HIGH |
| Read-only preamble phrasing | EnterPlanMode prompt: "DO NOT write or edit any files yet. This is a read-only exploration and planning phase." (`EnterPlanModeTool.ts:118`) | `jG4` (446485): "…you MUST NOT make any edits (with the exception of the plan file…)… This supercedes any other instructions" | **CHANGED** — plan file now writable | HIGH |
| Write floor / plan gate | not in provided stubs (lives in permission core) | obf `ChH` (549806): plan floor forces `ask{type:mode,mode:plan}` at 549873; `.claude/**` allow-rule gated by `mode !== "plan"` at 549838; read path downgrades `plan→default` at 549790 | **CONSISTENT** with v2.1.142 pattern | MEDIUM (v2.1.156 read HIGH) |
| Resume permission-mode | analog in resume core, not in provided stubs | obf `Vyz` (598936): `plan` and `bypassPermissions` return `undefined` (dropped); `permissionModeCliSet` short-circuits | **CONFIRMED** in 2.1.156; warning at 410762 corroborates | MEDIUM (v2.1.156 read HIGH) |

---

## Confidence Labels

- **HIGH** — Plan-mode permission metadata (`st`, `xEq`, `ZF$`), the session-state cluster (`m7$`/`zQ`/`Rm8`/`Gt`/`Tt`), the write-floor ordering and the `.claude/**`/read-downgrade carve-outs (`ChH` at 549806-549890), the internal-editable exemption (`WlH`/`b$9`), the seeded slug algorithm (`ILH`/`MM6`/`wgH`/`y88`) and all plan-file path/recovery functions, the reminder cadence and renderers, the opusplan model switch (`VT`), and `Vyz` resume reconciliation — all read directly in v2.1.156 and line numbers verified.
- **HIGH (cross-version)** — Every IDENTICAL/NEW/CHANGED verdict whose v2.1.88 side is in `plans.ts`/`planModeV2.ts`/tool constants (slug pipeline, plans dir, file paths, agent counts, tool name, preamble change).
- **MEDIUM** — The v2.1.88 *precursors* for the write floor (`ChH`), resume reconcile (`Vyz`), and `transitionPermissionMode` are in the permission/resume core, which is not in the provided v2.1.88 stub files; those cross-version verdicts rest on the verified v2.1.156 read plus the v2.1.142 documented pattern rather than a direct v2.1.88 TS diff.
- **OPEN** — The upstream dispatcher that converts `ChH`'s `behavior:"ask"{type:mode,mode:plan}` into the user-facing prompt was not traced end-to-end here; `planSlugSeed` producers are confirmed at `cli_inner_pretty.js:412853` (attachment builder) but not exhaustively enumerated across all entry paths.
