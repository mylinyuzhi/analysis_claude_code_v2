# The plan-mode Bash bypasses (`.212` security) and classifier adjudication (`.218`)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

> *`.212`: "Fixed plan mode auto-running file-modifying Bash commands (e.g. `touch`, `rm`) without a
> permission prompt or SDK `canUseTool` callback."*
>
> *`.218`: "Changed plan mode with auto to no longer prompt for Bash commands the static analyzer can't
> prove read-only; the auto-mode classifier judges them instead."*

These two bullets look contradictory — one adds friction, the other removes it. They are not. `.212`
closes **two independent code paths that returned `{behavior:"allow"}` in plan mode**; `.218` then
routes what those paths used to swallow into the auto-mode classifier instead of a modal dialog. The
2.1.220 bundle contains the end state of both, and every guard involved is a **220-only** addition to
byte-identical 2.1.193 machinery.

**Boundary:** the static Bash read-only analyzer — how it decides that a shell command is provably
read-only — belongs to [`../38_permissions/`](../38_permissions/)
([`security_hardening_214.md`](../38_permissions/security_hardening_214.md),
[`classifier_adjudication.md`](../38_permissions/classifier_adjudication.md)). This document owns what
**plan mode** does with the analyzer's verdict.

---

## 0. The scoreboard: four new `tcr(...)` guards and one new `$` guard

`tcr` (`:289037`) is a two-line predicate, `ctx.mode === "plan"`. It has four call sites in 2.1.220 and
**every one of them is a plan-mode disqualifier added to a 2.1.193 expression that had no plan-mode
term at all**:

| Site | 2.1.220 | 2.1.193 twin | What it closes |
|---|---|---|---|
| `:393890` (`cvd`) | `… \|\| !H4(e) \|\| tcr(t)) return null;` | `:460181 (193)` `… \|\| !o$(e)) return null;` | sandboxed-Bash auto-allow, AST path |
| `:393924` (`Wqy`) | `… \|\| !H4(e) \|\| tcr(t)) return null;` | `:460215 (193)` — same shape (in `Iif`, declared `:460214`) | sandboxed-Bash auto-allow, prefix path |
| `:513525` (`bft`) | `d = u && tcr(o); if (!(u && !d)) return Mrp(…)` | `:597743 (193)` `if (!(e.name === Io && … && o$(t))) return ask` | sandbox exemption from an **ask rule** |
| `:513574` (`o$_`) | `_ = y && tcr(o), E = y && !_;` | `:597784 (193)` — same shape | same, on the primary dispatcher |

Plus, in the auto-mode adjudication block:

| Site | 2.1.220 | 2.1.193 twin | What it closes |
|---|---|---|---|
| `:513776-513777` | `$ = u === "plan"; if (!wrp(e.name) && !b && !P && !$)` | `:597959 (193)` `if ((e.name, Ss, e.name !== is && !y))` | the `acceptEdits` fast-path re-check |

Neither `tcr` nor `$` has any 2.1.193 counterpart. (⚠ **count it as `tcr(`, which is 220=5 / 193=0.** The bare word is 220=5 / **193=4** — 2.1.193
reuses `tcr` as a React import alias (`tcr.useSyncExternalStore`, `tcr = L(et(),1)` at `:685015`/`:685085 (193)`),
an identifier-reuse collision of exactly the class `_CONVENTIONS.md` §4 trap 1 describes.)

---

## 1. Bypass #1 — the sandboxed-Bash auto-allow ran in plan mode

**Verdict: NET_NEW guard on carryover machinery.** This is, in my reading, the bullet's primary
subject: it is the only path in the Bash pipeline that returns a bare
`{behavior: "allow"}` for a *file-modifying* command with no dialog and no `canUseTool` round-trip.

### 1.1 The machinery (carryover)

When sandboxing is on and `isAutoAllowBashIfSandboxedEnabled()` is set, Claude Code will run a Bash
command with **no approval at all**, on the theory that the sandbox is the approval. Two entry points
implement it — `cvd` (`:393889`, AST-based) and `Wqy` (`:393923`, prefix-based). Both are otherwise
byte-for-byte identical to their 2.1.193 twins `Lyl` (`:460180 (193)`) and `Iif` (`:460214 (193)`),
down to variable ordering.

The body of `cvd` is worth reading because it proves the function **knowingly passes file-modifying
commands**:

```javascript
// ============================================
// sandboxedBashAutoAllowAst - the sandbox auto-allow, with the new plan-mode disqualifier
// Location: cli_inner_pretty.js:393889-393920
// ============================================

// ORIGINAL (for source lookup):
function cvd(e, t, r, n) {
  if (!Oo.isSandboxingEnabled() || !Oo.isAutoAllowBashIfSandboxedEnabled() || !H4(e) || tcr(t)) return null;
  let o = zqy(e, t, r);
  if (o.behavior === "passthrough") return null;
  ...
  let l = !1, c = !1;
  for (let u of r) {
    let [d, ...p] = x2e(u.argv),
      f = d?.replace(/^.*[\\/]/, "");
    if (f === "cd" || f === "pushd" || f === "popd" || f === "chdir") { l = !0; continue; }
    if (f !== "rm" && f !== "rmdir") continue;
    if (((c = !0), emr(f, p, Ht(), t).behavior !== "passthrough")) return null;
  }
  if (l && c) return null;
  return o;
}

// READABLE (for understanding):
function sandboxedBashAutoAllowAst(bashInput, permissionCtx, parsedCommands, resolvedPaths) {
  if (
    !Sandbox.isSandboxingEnabled() ||
    !Sandbox.isAutoAllowBashIfSandboxedEnabled() ||
    !isSandboxableBashInput(bashInput) ||
    isPlanMode(permissionCtx)                       // <-- NEW in 2.1.220
  )
    return null;
  let verdict = sandboxRuleVerdict(bashInput, permissionCtx, parsedCommands);
  if (verdict.behavior === "passthrough") return null;
  ...
  let sawDirChange = false, sawRemove = false;
  for (let cmd of parsedCommands) {
    let [argv0, ...args] = stripLeadingAssignments(cmd.argv),
      base = argv0?.replace(/^.*[\\/]/, "");
    if (base === "cd" || base === "pushd" || base === "popd" || base === "chdir") { sawDirChange = true; continue; }
    if (base !== "rm" && base !== "rmdir") continue;
    sawRemove = true;
    if (checkCatastrophicRemoval(base, args, cwd(), permissionCtx).behavior !== "passthrough") return null;
  }
  if (sawDirChange && sawRemove) return null;      // cd + rm together is unanalyzable
  return verdict;                                  // {behavior: "allow", ...}
}

// Mapping: cvd→sandboxedBashAutoAllowAst, H4→isSandboxableBashInput, tcr→isPlanMode,
//          zqy→sandboxRuleVerdict, emr→checkCatastrophicRemoval, x2e→stripLeadingAssignments
```

Read the loop: it explicitly tolerates `rm` and `rmdir` (only refusing when the *catastrophic-removal*
check fires, or when a directory change is combined with a removal in the same command). `touch`,
`mkdir`, `mv`, `cp`, `>` redirects — none of those are even mentioned, because inside the sandbox they
are considered acceptable. That is a defensible position for `default`/`acceptEdits`. It is
indefensible for **plan mode**, whose entire contract is that nothing observable happens until the user
approves the plan — and the changelog's chosen examples (`touch`, `rm`) are exactly the two verbs this
loop lets through.

### 1.2 Why the guard is placed in the disqualifier chain rather than at the call site

`cvd`/`Wqy` are called from the Bash permission chain (via `zqy`/`gvd`) at several points. Adding
`tcr(t)` to the *first* line of each function means:

- there is exactly one place per entry point to audit;
- the guard runs before any parsing, so the cost is one property read on the fast reject;
- the return value is `null`, which the callers already treat as "the sandbox has no opinion" — so
  control flows into the ordinary rule matching, path validation, and finally the `no-rule-match`
  passthrough. No caller needed to change.

The alternative — checking plan mode where `cvd`'s result is consumed — would have required the same
guard in every consumer and would have been the kind of change where one consumer gets missed. Note
that the *same* release also had to patch `Wqy`, the prefix-based twin: a single-entry-point fix would
have left the second path open.

**`H4` vs `o$`** is a second, smaller carryover-with-a-twist: `H4` (`:512818-512826`) opens with
`if (GP() && Bxe()) return !0;` — an early *true* that the 2.1.193 `o$` shape does not have — before
the same four rejections (sandboxing off; bash-on-Windows without a resolvable shell; explicit
`dangerouslyDisableSandbox` when unsandboxed commands are allowed; empty command; the `I1_` pattern).
Do not attribute `H4`'s existence to `.212`; only the `|| tcr(t)` term is the plan-mode delta.

---

## 2. Bypass #2 — the `acceptEdits` fast path re-checked permissions in the wrong mode

**Verdict: NET_NEW guard (`$`), and the file-modifying command list is spelled out in the bundle.**

### 2.1 The fast path (carryover)

Inside the auto-mode adjudication block, before spending a classifier call, Claude Code asks a cheap
question: *"would this tool have been allowed in `acceptEdits` mode?"* If yes, allow it and skip the
classifier. The implementation re-invokes the tool's own `checkPermissions` with a synthetic context:

```javascript
// 220 :513788-513798 (193 twin at :597970-597980, byte-equivalent)
oe = await e.checkPermissions(V, {
  ...r,
  permissionLayers: re,
  getAppState: () => {
    let ce = r.getAppState();
    return { ...ce, toolPermissionContext: { ...ce.toolPermissionContext, mode: "acceptEdits", alwaysAllowRules: Y } };
  },
});
if (oe.behavior === "allow") { … return E({ updatedInput: oe.updatedInput ?? t, … }); }
```

The debug line `Skipping auto mode classifier for ${e.name}: would be allowed in acceptEdits mode`
(220 `:513803`, 193 `:597985 (193)`) is identical in both builds.

### 2.2 Why that is fatal in plan mode

The synthetic context sets `mode: "acceptEdits"`. Every mode-sensitive branch downstream therefore
believes the session is in `acceptEdits`. The Bash tool has exactly such a branch:

```javascript
// ============================================
// bashAcceptEditsModeAllow - the acceptEdits carve-out the plan fast path was reaching
// Location: cli_inner_pretty.js:393483-393493, list at :393515
// ============================================

// ORIGINAL (for source lookup):
function Dqy(e) {
  return Lqy.includes(e);
}
function Pqy(e, t) {
  let r = rae(e),
    [n] = r.split(/\s+/);
  if (!n) return { behavior: "passthrough", message: "Base command not found" };
  if (t.mode === "acceptEdits" && Dqy(n))
    return { behavior: "allow", updatedInput: { command: e }, decisionReason: { type: "mode", mode: "acceptEdits" } };
  return { behavior: "passthrough", message: `No mode-specific handling for '${n}' in ${t.mode} mode` };
}
...
  Lqy = ["mkdir", "touch", "rm", "rmdir", "mv", "cp", "sed"];

// READABLE (for understanding):
function isAcceptEditsAutoAllowedCommand(baseCommand) {
  return ACCEPT_EDITS_FILE_COMMANDS.includes(baseCommand);
}
function bashAcceptEditsModeAllow(commandText, permissionCtx) {
  let stripped = stripEnvAssignments(commandText),
    [base] = stripped.split(/\s+/);
  if (!base) return { behavior: "passthrough", message: "Base command not found" };
  if (permissionCtx.mode === "acceptEdits" && isAcceptEditsAutoAllowedCommand(base))
    return { behavior: "allow", updatedInput: { command: commandText },
             decisionReason: { type: "mode", mode: "acceptEdits" } };
  return { behavior: "passthrough", message: `No mode-specific handling for '${base}' in ${permissionCtx.mode} mode` };
}
var ACCEPT_EDITS_FILE_COMMANDS = ["mkdir", "touch", "rm", "rmdir", "mv", "cp", "sed"];

// Mapping: Pqy→bashAcceptEditsModeAllow, Dqy→isAcceptEditsAutoAllowedCommand,
//          Lqy→ACCEPT_EDITS_FILE_COMMANDS, rae→stripEnvAssignments
```

`Lqy = ["mkdir", "touch", "rm", "rmdir", "mv", "cp", "sed"]` — **the changelog names `touch` and `rm`
and they are entries 2 and 3 of this list.** The 2.1.193 twin is `:459780 (193)` with the identical
`No mode-specific handling for '${r}' in ${t.mode} mode` message, so the list and the branch are pure
carryover; only the plan-mode reachability changed.

Chain, in 2.1.193, for a session in plan mode with auto active:

1. `Qqs("plan")` is true (auto active) → enter the adjudication block (`:597922 (193)`).
2. `S = pQl(a.decisionReason)` (`:597928 (193)`) — the plan-mode floor. **False**, because Bash's ask
   carries `decisionReason: {type:"other", reason:"This command requires approval",
   bashMissKind:"no-rule-match"}` (`:394737`/`:394768`), not `{type:"mode", mode:"plan"}`. The floor
   only ever caught the *filesystem* engine's `Cannot write to … while in plan mode.` (`:528751`).
3. Fast path runs with `mode: "acceptEdits"` → `ovd` → `Pqy` → `{behavior:"allow"}`.
4. The block returns `E({updatedInput, decisionReason:{type:"mode", mode:"auto"}})` = `{behavior:"allow"}`.

`{behavior:"allow"}` out of `cM` means the caller never renders a dialog **and never calls the SDK
`canUseTool` callback** — the second half of the bullet's wording, and the reason it is a security
bullet rather than a UX bullet.

### 2.3 The fix

```javascript
// ============================================
// autoModeAdjudication - the fast-path guard set, with the new plan-mode term
// Location: cli_inner_pretty.js:513773-513777
// ============================================

// ORIGINAL (for source lookup):
        let L = r.localDenialTracking ?? l.denialTracking ?? bTo(),
          P = xrp(e.name) && Trp(WL(r)),
          M = Irp(i2o(c, e), e, t, u),
          $ = u === "plan";
        if (!wrp(e.name) && !b && !P && !$)

// READABLE (for understanding):
        let denialTracking = ctx.localDenialTracking ?? appState.denialTracking ?? newDenialTracking(),
          isClassifyEditsTool  = isEditTool(tool.name) && classifyEditsEnabled(getModel(ctx)),
          mcpAlwaysAllowOverride = isMcpWriteAllowedByPolicy(sessionAllowRule(permCtx, tool), tool, input, mode),
          inPlanMode = mode === "plan";                                   // <-- NEW in 2.1.220
        if (!isFastPathExemptTool(tool.name) && !isSandboxOverride && !isClassifyEditsTool && !inPlanMode)

// Mapping: $→inPlanMode, u→mode (nze(e, c)), b→isSandboxOverride, P→isClassifyEditsTool,
//          wrp→isFastPathExemptTool, xrp→isEditTool, Trp→classifyEditsEnabled, Irp→isMcpWriteAllowedByPolicy
```

The 2.1.193 line was `if ((e.name, Ss, e.name !== is && !y))` (`:597959 (193)`) — a single tool-name
exclusion plus the sandbox-override flag. 2.1.220 generalises the name exclusion into a set
(`wrp` → `q1_`, `:513041`) and adds two terms, of which `$` is the plan-mode one.

**Why disable the whole fast path rather than special-case `Pqy`?** Because `Pqy` is not the only
mode-sensitive branch a synthetic `acceptEdits` context unlocks. `Odt` (the filesystem edit engine)
has `if (r.mode === "plan") return ask "Cannot write to …"` at `:528748` immediately followed by
`if (r.mode === "acceptEdits" && d) return allow` at `:528755` — the synthetic context skips the first
and satisfies the second, so `Edit`/`Write` inside the working directory were allowed by the same
mechanism. `FEd` (the `sed` guard) reads `t.mode === "acceptEdits"` at `:390531` to widen what `sed`
scripts count as safe. The PowerShell tool has two more at `:428728`/`:428772`. Patching each would
have been four or five fixes with an open-ended tail; refusing to *pretend* the mode is `acceptEdits`
while it is `plan` is one line and closes the class.

**Trade-off the fix accepts:** in plan mode with auto, every tool call that would previously have been
resolved for free now costs a classifier round-trip (or falls to the allow-list at `:513833`). That is
a latency and token cost paid on the mode where the user has explicitly asked for caution. Note the
ordering: `$` is evaluated *before* the `try` block, so plan mode does not even pay the
`inputSchema.parse` cost of the fast path.

---

## 3. `.218` — what plan mode does *instead* of prompting

With both bypasses closed, an unprovable-read-only Bash command in plan mode with auto reaches
`:513833` and beyond. Three predicates decide whether it prompts or gets adjudicated.

### 3.1 The plan-mode floor was narrowed, not removed

```javascript
// ============================================
// planModeFloor - the plan-mode ask floor and its one exemption
// Location: cli_inner_pretty.js:513751-513761
// ============================================

// ORIGINAL (for source lookup):
          H = Prp(a.decisionReason) && !n2o(GK(e), t);
        if (A || b || I || R || H) {
          if (c.shouldAvoidPermissionPrompts) return Xqs(a.message);
          if (A || I || R || H)
            return (
              O("tengu_auto_mode_fallback_to_ask", {
                reason: Ee(A ? "safety_check" : I ? "ask_rule" : H ? "plan_mode_floor" : "org_ask_ceiling"),
                toolName: ua(e.name),
              }),
              a
            );
        }

// READABLE (for understanding):
          hitPlanModeFloor =
            decisionReasonIsPlanMode(verdict.decisionReason) &&                 // {type:"mode", mode:"plan"}
            !isStrictlyReadOnlyBrowserTool(getFullToolName(tool), input);       // <-- NEW exemption
        if (hitSafetyCheck || isSandboxOverride || hitAskRule || hitOrgCeiling || hitPlanModeFloor) {
          if (permCtx.shouldAvoidPermissionPrompts) return denyNoInteractiveApproval(verdict.message);
          if (hitSafetyCheck || hitAskRule || hitOrgCeiling || hitPlanModeFloor)
            return (logAutoModeFallbackToAsk({ reason: hitSafetyCheck ? "safety_check"
                                                     : hitAskRule ? "ask_rule"
                                                     : hitPlanModeFloor ? "plan_mode_floor"
                                                     : "org_ask_ceiling" }), verdict);
        }

// Mapping: H→hitPlanModeFloor, Prp→decisionReasonIsPlanMode, n2o→isStrictlyReadOnlyBrowserTool,
//          A→hitSafetyCheck, I→hitAskRule, R→hitOrgCeiling, Xqs→denyNoInteractiveApproval
```

⚠ **Carryover trap.** `plan_mode_floor` is **220=1 / 193=1**. The 2.1.193 line is
`S = pQl(a.decisionReason)` (`:597928 (193)`) with `pQl` at `:597723-597725 (193)` being the identical
`e?.type === "mode" && e.mode === "plan"` test, and the identical four-way `reason:` ternary at
`:597942 (193)`. Grepping the telemetry reason therefore proves nothing. The delta is the `&& !n2o(...)`
conjunct — the exemption for strictly-read-only browser calls (see
[`readonly_auto_allow_198_199.md`](readonly_auto_allow_198_199.md) §1.5) — and nothing else.

The consequence for Bash is that the floor **never applies to it**: `Prp` requires a
`{type:"mode", mode:"plan"}` decisionReason, and the Bash pipeline emits `{type:"other", …
bashMissKind:"no-rule-match"}`. Plan mode's protection for Bash was never this floor; it was the
prompt that `passthrough` eventually produced.

### 3.2 The circuit-breaker escape hatch explicitly includes plan mode

The other predicate that used to force a dialog is `A` (safety checks). 2.1.220 narrows it:

| | 2.1.193 `:597924 (193)` | 2.1.220 `:513745` |
|---|---|---|
| expression | `h = H5(a.decisionReason, (P) => !P.classifierApprovable)` | `A = sG(a.decisionReason, (V) => !V.classifierApprovable && !(V.circuitBreaker !== void 0 && gnn(c)))` |

`circuitBreaker` is **220=12 / 193=0** and `isAutoModePermissionSurface` (`gnn`) is **220=1 / 193=0**.
`gnn` (`:325872`) is:

```javascript
function gnn(e) {
  return e.mode === "auto" || (e.mode === "plan" && A9() && !e.isBypassPermissionsModeAvailable);
}
```

So a safety check that carries a `circuitBreaker` tag no longer forces a fallback-to-ask when the
session is in **auto mode or plan mode with auto** — it is handed to the classifier instead. The
matching Bash-side helper is `pvd` (`:394411-394423`), also gated on `gnn`, which first looks for a
*real* user ask-rule covering the command (`matchedAskRule`) and only lets the circuit-breaker ask
dissolve when there is none.

That is `.218`'s stated behaviour, expressed in code: commands the static analyzer flags on a heuristic
(`dangerous-rm`, background `&`, `suspiciousWindowsPath` — the circuit-breaker family owned by
[`../38_permissions/`](../38_permissions/)) stop opening dialogs in plan mode with auto, and the
classifier adjudicates. `.216`'s permissions bullet describes the same mechanism for auto mode; the
plan-mode half is the `(e.mode === "plan" && A9() && …)` disjunct in `gnn`, and the fact that the
disjunct also requires `!isBypassPermissionsModeAvailable` — i.e. a session that could bypass
permissions anyway is excluded, because for it the whole question is moot.

### 3.3 The classifier queue and its post-queue mode revalidation

2.1.220 adds an optional queue in front of the classifier, behind the gate
`tengu_auto_mode_classifier_queue` (`:442629`, **220=1 / 193=0**, default `false`). When the queue is
on, the classifier verdict may be produced after the permission mode has changed — so the block
revalidates:

```javascript
// ============================================
// modeStillEligibleForAutoDecision - post-queue revalidation, with the plan-mode arm
// Location: cli_inner_pretty.js:513125-513144, consumer :513875-513884
// ============================================

// ORIGINAL (for source lookup):
function Y1_(e, t, r, n) {
  switch (e) {
    case "auto":
      return !0;
    case "plan": {
      if (!A9()) return !1;
      let o = r.inputSchema.safeParse(n);
      return (o.success === !0 && r.isReadOnly(o.data)) || n2o(GK(r), o.success ? o.data : n);
    }
    case "default":
    case "dontAsk":
    case "acceptEdits":
    case "bypassPermissions":
    case "bubble":
      return t;
    default: { let o = e; return !1; }
  }
}

// READABLE (for understanding):
function modeStillEligibleForAutoDecision(mode, chromeFloorOverride, tool, rawInput) {
  switch (mode) {
    case "auto":
      return true;                                   // auto always may auto-decide
    case "plan": {
      if (!isAutoModeActive()) return false;         // plan without auto: never
      let parsed = tool.inputSchema.safeParse(rawInput);
      return (
        (parsed.success === true && tool.isReadOnly(parsed.data)) ||        // provably read-only
        isStrictlyReadOnlyBrowserTool(getFullToolName(tool), parsed.success ? parsed.data : rawInput)
      );
    }
    case "default": case "dontAsk": case "acceptEdits": case "bypassPermissions": case "bubble":
      return chromeFloorOverride;                    // only the chrome-classifier-floor override qualifies
    default:
      return false;                                  // exhaustiveness guard
  }
}

// Mapping: Y1_→modeStillEligibleForAutoDecision, A9→isAutoModeActive,
//          n2o→isStrictlyReadOnlyBrowserTool, GK→getFullToolName, t→chromeFloorOverride
```

Its consumer at `:513875-513884` re-reads the mode (`u = nze(e, En(r))`), and on failure emits
`tengu_auto_mode_fallback_to_ask` with `reason: "mode_changed_while_queued"` (**220=1 / 193=0**) and
returns the original ask.

**Why is the `"plan"` arm stricter than the pre-classifier path?** Because the pre-classifier path knew
the mode at decision time, whereas this one is repairing a *race*. The conservative rule "after a
queued wait, plan mode may only auto-decide things that are read-only by construction" means a mode
flip into plan mode while a classifier call was in flight can never cause a write. Note the asymmetry
with `case "auto": return !0` — auto mode does not re-verify, because there is no stricter mode you can
flip *into* that the fallback would not already handle. The `default:` arm assigns `e` to an unused
local `o`, the compiled remnant of a TypeScript `never` exhaustiveness check.

---

## 4. Honest limits of the `.212`/`.218` reconstruction

- **I cannot attribute individual guards to individual releases.** Only 2.1.193 and 2.1.220 are
  available. Every guard above is 220-only relative to 193; whether `$ = u === "plan"` landed in `.212`
  or `.218` is not observable. The `tcr` guards are the better match for `.212`'s wording ("without a
  permission prompt or SDK `canUseTool` callback"), because they are the only paths that return a bare
  `allow`.
- **`.218`'s intermediate state is invisible.** If `.212` fixed the bypass by making plan-mode Bash
  *prompt*, and `.218` then replaced that prompt with classifier adjudication, only the end state is in
  this bundle. What I can prove is the end state: in 2.1.220, a plan-mode-with-auto Bash command that
  the analyzer cannot prove read-only reaches the classifier at `:513862`, not a dialog — because
  `Prp` is false for its decisionReason (§3.1), `$` blocks the fast path (§2.3), `zqs` does not cover
  Bash (`P1_` at `:512965` contains no Bash entry), and the circuit-breaker family is exempted by
  `gnn` (§3.2).
- **`useAutoModeDuringPlan` is carryover, not a `.212`/`.218` addition** — 220=11 / 193=11, resolved at
  `:63540-63548`, `/config` row at `:451661-451667`. Any doc that presents "plan mode can use auto
  semantics" as new to this window is wrong.

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
- `isPlanMode` (`tcr`, `:289037`) - the four-site plan-mode disqualifier
- `sandboxedBashAutoAllowAst` (`cvd`, `:393889`) - sandbox auto-allow, AST path (guard at `:393890`)
- `sandboxedBashAutoAllowPrefix` (`Wqy`, `:393923`) - sandbox auto-allow, prefix path (guard at `:393924`)
- `isSandboxableBashInput` (`H4`, `:512818`) - sandboxability precondition
- `checkCatastrophicRemoval` (`emr`, called `:393917`) - the `rm` carve-out inside the sandbox path
- `bashAcceptEditsModeAllow` (`Pqy`, `:393486`) - the `acceptEdits` file-command allow
- `isAcceptEditsAutoAllowedCommand` (`Dqy`, `:393483`) / `ACCEPT_EDITS_FILE_COMMANDS` (`Lqy`, `:393515`)
- `bashModeSpecificCheck` (`ovd`, `:393494`) - splits the command and calls `Pqy` per segment
- `checkRuleBasedPermissions` (`bft`, `:513506`) - ask-rule path, plan guard at `:513525`
- `checkToolPermissions` (`o$_`, `:513554`) - primary dispatcher, plan guard at `:513574`
- `hasPermissionsToUseToolWithSink` (`oNt`, `:513707`) / `cM` (`:513703`) - the entry points
- `autoModeAdjudication` (`t$_`, `:513711`) - the block holding `$`, `H`, `A`, the fast path and the classifier
- `decisionReasonIsPlanMode` (`Prp`, `:513484`) - `{type:"mode", mode:"plan"}` test
- `isStrictlyReadOnlyBrowserTool` (`n2o`, `:512911`) - the plan-floor exemption
- `findSafetyCheckReason` (`sG`, `:513689`) - safety-check walker used by `A`
- `isAutoModePermissionSurface` (`gnn`, `:325872`) - includes plan+auto; gates the circuit-breaker exemption
- `relaxCircuitBreakerAskForBash` (`pvd`, `:394411`) - Bash-side circuit-breaker re-check, `gnn`-gated
- `modeStillEligibleForAutoDecision` (`Y1_`, `:513125`) - post-queue revalidation
- `isClassifierQueueEnabled` (`eDo`, gate `tengu_auto_mode_classifier_queue` `:442629`)
- `isFastPathExemptTool` (`wrp`, `:512923`) / `FAST_PATH_EXEMPT_TOOLS` (`q1_`, `:513041`)
- `isAutoModeAllowlistedTool` (`zqs`, `:512892`) / `AUTO_MODE_SAFE_TOOLS` (`P1_`, `:512965`)
