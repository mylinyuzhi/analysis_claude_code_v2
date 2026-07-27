# Plan mode deltas (v2.1.193 → v2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines, `build_sha 4073f595`). Baseline
`/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines),
always tagged `(193)`.

This directory documents **only what changed** in plan mode across the 25-release window. The
current-state description of the feature — the enter/exit state machine, the reminder cadence, the
prompt surface, the UI flow — is the 2.1.193 tree's appendix and is still accurate for everything not
listed here:

- [`../../../claude_code_v_2.1.193/analyze/05_plan_mode/README.md`](../../../claude_code_v_2.1.193/analyze/05_plan_mode/README.md)
- [`../../../claude_code_v_2.1.193/analyze/05_plan_mode/lifecycle_state_machine.md`](../../../claude_code_v_2.1.193/analyze/05_plan_mode/lifecycle_state_machine.md)
- [`../../../claude_code_v_2.1.193/analyze/05_plan_mode/ui_permission_flow.md`](../../../claude_code_v_2.1.193/analyze/05_plan_mode/ui_permission_flow.md)
- [`../../../claude_code_v_2.1.193/analyze/05_plan_mode/prompt_surface.md`](../../../claude_code_v_2.1.193/analyze/05_plan_mode/prompt_surface.md)
- [`../../../claude_code_v_2.1.193/analyze/05_plan_mode/reminder_cadence.md`](../../../claude_code_v_2.1.193/analyze/05_plan_mode/reminder_cadence.md)

## Documents in this directory

| Doc | Covers |
|---|---|
| [`readonly_auto_allow_198_199.md`](readonly_auto_allow_198_199.md) | `.198` born-in-plan sessions; `.199` the per-call browser read-only predicate and the `passthrough` plan floor |
| [`bash_bypass_and_classifier_212_218.md`](bash_bypass_and_classifier_212_218.md) | `.212` the two plan-mode Bash bypasses; `.218` classifier adjudication instead of a dialog |
| this README | window narrative, per-bullet ledger, the two small UI/dialog bullets (`.210`, `.212` #27), and the carryover traps |

The two UI bullets (`.210`, `.212` #27) are one paragraph and one JSX diff each; giving each its own
file would be padding, so they live in §3 below.

---

## 1. The window in one sentence

**Every plan-mode bullet in this window is the same bug reported six times: a permission decision was
being made without asking "but are we in plan mode?".**

That is not a rhetorical framing — it is literally what the diff looks like. 2.1.220 introduces a
two-line predicate, `tcr(ctx) { return ctx.mode === "plan"; }` (`:289037`), and inserts it as an extra
conjunct into **four** pre-existing expressions (`:393890`, `:393924`, `:513525`, `:513574`); it adds a
fifth plan-mode term `$ = u === "plan"` to a fast-path guard (`:513776`); it adds a plan-mode arm that
converts a tool's `passthrough` into an `ask` (`:513586-513594`); it adds a plan-mode arm to the browser
override that *stops* it answering (`:289440`); and it adds a born-in-plan branch to the auto-mode gate
verifier (`:529638`). Seven insertions, no rewrites. The surrounding machinery — the nine-name browser
set, the `acceptEdits` command list, the sandboxed-Bash auto-allow, the `plan_mode_floor` telemetry,
the `(edited by user)` renderer, the `useAutoModeDuringPlan` setting — is byte-equivalent carryover.

The structural reason so many sites needed the same guard: **plan mode is a permission *mode*, but the
paths that bypass permissions do not consult the mode.** The sandbox auto-allow asks "is sandboxing
on?", the fast path asks "would `acceptEdits` allow this?", the browser override asks "is this tool on
the list?". Each answers correctly for its own question and each returns `{behavior: "allow"}`, which
in this codebase means *no dialog and no SDK `canUseTool` callback*. Plan mode's contract is a property
of the whole pipeline, and it was being enforced only in the branches that happened to remember it.

Second theme, only visible once you read `:512892` next to `:512911`: 2.1.220 **forks the read-only
definition in two**. `isAutoModeAllowlistedTool` (`zqs`) treats a browser click as read-only; the new
`isStrictlyReadOnlyBrowserTool` (`n2o`) does not. Auto mode prevents *destructive* actions; plan mode
prevents *any observable* action. One predicate cannot serve both, and 2.1.193 had only one.

---

## 2. Per-bullet ledger

Six changelog bullets carry the `plan_mode` theme across five releases.

| # | Bullet (abbreviated) | Version | Verdict | Anchor (2.1.220) | 220 / 193 | Doc section |
|---|---|---|---|---|---|---|
| 1 | Plan mode not auto-allowing read-only tool calls when a session **starts** in plan mode | `.198` | **NET_NEW** | born-in-plan branch `:529638`; `activatePlanAutoMode` (`Kfn`) `:529742`; export literal `:529177` | `activatePlanAutoMode` 1 / **0** | [`readonly_auto_allow_198_199.md`](readonly_auto_allow_198_199.md) §2 |
| 2 | Plan mode not prompting for state-changing browser calls; read-only `browser_batch` auto-allowed | `.199` | **NET_NEW** | `cOt` `:288994` + tables `:289002-289013`; `BEy` `:289288`; plan passthrough `:289440`; floor `:513586-513594` | `Cannot call … while in plan mode.` 1 / **0**; `record a GIF of the page` 1 / **0** | [`readonly_auto_allow_198_199.md`](readonly_auto_allow_198_199.md) §1 |
| 3 | Plan approvals without edits labelled "(edited by user)"; plan file overwritten with a stale snapshot | `.210` | **DELTA — partially anchored; headline literal is CARRYOVER** | dialog builder refactor `e7f` `:761160`; stale-artifact hook `Mnl` `:761667`; the `(edited by user)` renderer `:326160` is unchanged | `(edited by user)` 2 / **2**; `planWasEdited` 3 / **3**; `planEditedLocally` 2 / **5** | §3.1 below |
| 4 | Plan mode auto-running file-modifying Bash (`touch`, `rm`) without a prompt or SDK `canUseTool` | `.212` | **NET_NEW (guards on carryover machinery)** | `tcr` `:289037` inserted at `:393890`, `:393924`, `:513525`, `:513574`; `$ = u === "plan"` `:513776`; the list `Lqy` `:393515` | `tcr` 5 / **0**; `Lqy` list 1 / 1 (carryover) | [`bash_bypass_and_classifier_212_218.md`](bash_bypass_and_classifier_212_218.md) §1-2 |
| 5 | Plan-approval footer splitting `ctrl+g to edit in <editor>` on long paths | `.212` | **NET_NEW (JSX restructure) — the scoping pass recorded this as UNANCHORED; it is anchored** | footer `:761890-761900` vs `:641168-641178 (193)` | `ctrl+g` 9 / **12** (count went DOWN) | §3.2 below |
| 6 | Plan mode with auto no longer prompts for Bash the analyzer can't prove read-only; classifier judges | `.218` | **DELTA — end state proven, intermediate state not observable** | floor narrowing `H = Prp(…) && !n2o(…)` `:513751`; circuit-breaker exemption `gnn` `:325872` at `:513745`; `pvd` `:394411`; queue gate `:442629` | `circuitBreaker` 12 / **0**; `isAutoModePermissionSurface` 1 / **0**; `plan_mode_floor` 1 / **1** | [`bash_bypass_and_classifier_212_218.md`](bash_bypass_and_classifier_212_218.md) §3 |

**Correction to the scoping pass, bullet 5.** `_scope_v211_214.md` row 27 records
`ctrl+g to edit in`(0) and marks the bullet *UNANCHORED — footer text assembled from fragments*. The
"assembled from fragments" observation is right and is exactly the bug; the fix is therefore visible as
a **structural** change and is anchored at `:761898`. See §3.2.

**Correction to the scoping pass, bullet 1.** `_scope_v195_199.md` row 25 lists the anchors as
`:289063` / `:288994` — i.e. the browser predicate. Those are the `.199` anchors. `.198` is about
session *initialisation* and its anchor is `:529638`; the two bullets are separate code.

---

## 3. The two dialog bullets

### 3.1 `.210` — "(edited by user)" and the stale plan-file write

**Verdict: DELTA, partially anchored. I could not isolate the changed line, and I am recording that
rather than guessing.**

The whole visible surface of this bullet is carryover, and I read every site in both bundles:

| Anchor | 220 | 193 | Read |
|---|---|---|---|
| `## ${o ? "Approved Plan (edited by user)" : "Approved Plan"}:` | 1 (`:326160`) | 1 (`:381727 (193)`) | byte-identical |
| `## Approved Plan (edited by user):` (the second, team-lead copy) | 1 (`:498208`) | 1 (`:537512 (193)`) | byte-identical |
| `planWasEdited: c !== void 0 \|\| void 0` in `ExitPlanMode.call` | 1 (`:326115`) | 1 (`:381678 (193)`) | byte-identical |
| the write guard `if (c !== void 0 && l) … qi().write(l, c)` | `:326040-326047` | `:381604-381610 (193)` | identical except 220 prepends `await gpt()` (`ensurePlansDirectory`, `:527741`) |
| `u = n ? { plan: r } : {}` — the dialog's `updatedInput` builder | `:761171` | `d = r ? { plan: n } : {}` `:640598 (193)` | identical logic |
| the ctrl+g editor callback's `content !== currentPlan` guard | `:761692` | `:640997 (193)` | identical guard |

So the causal chain the bullet describes — *dialog sets `updatedInput.plan` → `ExitPlanMode.call` sees
`c !== undefined` → it writes the file **and** stamps `planWasEdited`* — is intact in both builds, and
the single flag `planEditedLocally` still drives both symptoms simultaneously (which is why one bug
report names both).

What **did** change in that component:

1. **Call-site consolidation.** 2.1.193 called the builder `Tar` (`:640586`) inline from four separate
   dialog branches (`:640786`, `:640869`, `:640893`, `:640919`), each re-listing nine props by hand.
   2.1.220 renames it `e7f` (`:761160`) and calls it **once**, from a single `Dnl` closure at
   `:761486-761496`. `planEditedLocally` counts 220=2 / 193=5 purely because of this. Four hand-copied
   argument lists collapsing to one is the classic shape of a fix for *"one branch passed the wrong
   flag"*, but I cannot show a 2.1.193 branch that did, so I will not claim it.
2. **A new staleness hook.** `Mnl` (`:761667-761670`) fires whenever the plan is edited and demotes a
   previously published plan artifact from `status:"done"` to `status:"stale"`. It is called from both
   ctrl+g branches (`:761692`, `:761705`). This is the *publish* pipeline's staleness, not the plan
   file's, but it is the only new "the snapshot you have is out of date" logic in the dialog.
3. **`await gpt()` before the write** (`:326041`) — ensures `~/.claude/plans` exists before
   `qi().write`. A robustness fix, not this bullet.

The remaining possibility is that the fix lives in the **remote/team-lead** approval path
(`:809656` `[InboxPoller] Ignoring plan approval response while not in plan mode`, `:498208`) rather
than the local dialog, or in the argument list one of the four 2.1.193 call sites passed that I did not
diff exhaustively. Anyone continuing this should diff 2.1.193 `:640700-641100` against 2.1.220
`:761200-761730` statement by statement rather than by literal.

### 3.2 `.212` #27 — the footer split

**Verdict: NET_NEW, and it is a pure layout restructure with no new string.** This is why a literal
grep finds nothing: `ctrl+g to edit in` was **never a string** in either build. It was assembled from a
key-chord component, a hard space, a separate bold `<Text>` node, and a separate path node — four
sibling children of a flex **row**.

```javascript
// ============================================
// planApprovalFooter - the ctrl+g footer, 2.1.193 flex-row vs 2.1.220 single text run
// Location: cli_inner_pretty.js:761890-761900  (2.1.193 twin at :641168-641178)
// ============================================

// ORIGINAL (2.1.193, for source lookup):
      He &&
      Gh.jsxs(B, {
        flexDirection: "row",
        gap: 1,
        marginTop: 1,
        children: [
          Gh.jsxs(w, { dimColor: !0, children: [Gh.jsx(pt, { chord: "ctrl+g", action: "edit in" }), " "] }),
          Gh.jsx(w, { bold: !0, dimColor: !0, children: He }),
          x && Gh.jsxs(w, { dimColor: !0, children: [" \xB7 ", Sd(x)] }),
          F && Gh.jsxs(Gh.Fragment, { children: [ … "Plan saved!" … ] }),
        ],
      })

// ORIGINAL (2.1.220, for source lookup):
      MBS &&
      Fc.jsx(k, {
        marginTop: 1,
        children: Fc.jsxs(h, {
          children: [
            Fc.jsxs(h, {
              dimColor: !0,
              children: [Fc.jsx(Be, { chord: "ctrl+g", action: `edit in ${MBS}` }), mqt && ` \xB7 ${Cd(mqt)}`],
            }),
            yPr && Fc.jsxs(Fc.Fragment, { children: [ … "Plan saved!" … ] }),
          ],
        }),
      })

// READABLE (for understanding):
// 193: <Box flexDirection="row" gap={1}>              // yoga lays out 3-4 sibling BOXES
//        <Text dim><KeyChord chord="ctrl+g" action="edit in"/>{" "}</Text>
//        <Text bold dim>{editorName}</Text>           // <- wraps to the next line when narrow
//        {planPath && <Text dim>{" · "}{shortenPath(planPath)}</Text>}
//        {justSaved && <>… Plan saved! …</>}
//      </Box>
//
// 220: <Box marginTop={1}>
//        <Text>
//          <Text dim>
//            <KeyChord chord="ctrl+g" action={`edit in ${editorName}`}/>   // one inline run
//            {planPath && ` · ${shortenPath(planPath)}`}                   // plain string child
//          </Text>
//          {justSaved && <>… Plan saved! …</>}
//        </Text>
//      </Box>

// Mapping (220): Be→KeyChord, h→Text, k→Box, MBS→editorName, mqt→planFilePath, Cd→shortenPath,
//                yPr→justSaved   |   (193): pt→KeyChord, w→Text, B→Box, He→editorName, x→planFilePath,
//                Sd→shortenPath, F→justSaved
```

**How it works / why it fixes the bullet:**

1. In Ink, a `<Box flexDirection="row">` gives every child its own yoga node. When the terminal is
   narrower than the sum of the children's widths, yoga wraps **between** boxes. The chord label
   `ctrl+g to edit in` was one box and `<editor>` was the next, so a long plan path (the third box)
   pushing the row over the width caused the break to land between "…edit in" and the editor name —
   exactly the reported symptom, and *only* when the path is long, which is why the report says so.
2. 2.1.220 makes the chord label and the editor name **one string** inside the component's `action`
   prop, so there is no box boundary to break at. Ink's text wrapping still applies, but it now breaks
   at word boundaries inside a single run instead of at a layout boundary.
3. The path moves from a sibling `<Text>` to a plain string child of the same `<Text>` — so it too
   participates in one wrapping context instead of being an atomic box.
4. `flexDirection: "row"` and `gap: 1` are dropped entirely; the outer `<Box>` keeps only `marginTop`.

**The cosmetic cost, which is a real trade-off:** the editor name lost its `bold` styling. It was bold
only because it was a separate `<Text bold>` node; folding it into the `action` string makes it inherit
the chord label's dim styling. The fix chose "never splits" over "editor name stands out".

---

## 4. Carryover traps — do not write any of these up as new

Every row was grepped in both bundles and the 2.1.220 site was read.

| Subject | Anchor | 220 | 193 | Why it is a trap |
|---|---|---|---|---|
| the browser auto-allow name set | `OKt` `:34675-34684` vs `Kvt` `:12536-12546 (193)` | 9 names | **9 identical names** | Recorded in [`../00_overview/_false_delta_ledger.md`](../00_overview/_false_delta_ledger.md) §1 and re-verified here. The delta is the `cOt` predicate in front of it. |
| `plan_mode_floor` telemetry reason | `:513757` vs `:597942 (193)` | 1 | **1** | The four-way `reason:` ternary is byte-identical. The delta is the `&& !n2o(…)` conjunct at `:513751`. |
| `useAutoModeDuringPlan` setting | zod `:60121`, resolver `:63540-63548`, `/config` row `:451661` | 11 | **11** | "Plan mode can use auto semantics" is not new to this window. |
| `(edited by user)` label | `:326160`, `:498208` | 2 | **2** | See §3.1. |
| `planWasEdited` | `:325955`, `:326115`, `:326119` | 3 | **3** | Schema field, producer and consumer all byte-identical. |
| `--plan-mode-instructions` CLI flag | `:851161` | 4 | **4** | Looks like a new SDK surface; it is not. Its help text `Custom workflow body for plan mode` (`:851162`) is 220=1 / **193=1**. |
| `ExitPlanMode` / `EnterPlanMode` tool-name constants | `hN = "ExitPlanMode"` `:162389`; `Vie = "EnterPlanMode"` `:229020` | 19 / 7 | **19 / 7** | Exact match on both. |
| `strippedDangerousRules`, `canAutoClassifierRun`, `prepareContextForPlanMode`, `transitionPlanAutoMode`, `shouldPlanUseAutoMode`, `stripDangerousPermissionsForAutoMode`, `restoreDangerousPermissions` | `:529746`, `:529762`, `:529739`, `:529287`, `:529301` | 12 / 7 / 2 / 1 / 1 / 2 / 2 | **identical** | The plan-auto machinery is entirely pre-existing. Only `activatePlanAutoMode` (`Kfn`) is a new extraction. |
| `Lqy = ["mkdir","touch","rm","rmdir","mv","cp","sed"]` | `:393515` | 1 | 1 (`:459780 (193)` twin message) | The list and its branch are carryover; only its *reachability from plan mode* changed. |
| the sandboxed-Bash auto-allow bodies (`cvd`/`Wqy`) | `:393889`, `:393923` | — | twins `:460180 (193)`, `:460214 (193)` | Byte-equivalent except the added `\|\| tcr(t)`. |

**Identifier-reuse landmines specific to this theme** (`_CONVENTIONS.md` §4.1). In 2.1.193 these names
exist and mean something unrelated; never carry a 193 count across:

- `cOt` → a CommonJS module wrapper at `:161316-161317 (193)` (220: the browser read-only predicate)
- `BEy` → a bundler alias at `:264361 (193)` (220: `browserBatchNeedsPermission`)
- `OKt` → `getRemoteControlPolicyVerdict` at `:603963 (193)` (220: the 9-name browser set)

---

## 5. Genuinely net-new, undocumented in the changelog

Two things in the plan-mode surface have no bullet at all:

1. **The strict/lenient read-only fork.** `isStrictlyReadOnlyBrowserTool` (`n2o`, `:512911`) and its
   five-name / five-action tables (`vrp`/`B1_` `:513037-513038`, `U1_` `:513039`) are new; 2.1.193 had
   a single 13-name set `ZGf` (`:597386-597402 (193)`) and one predicate `rWf` (`:597321 (193)`).
   Two of the 13 (`gif_creator`, `select_browser`) were dropped from read-only status entirely, three
   became argument-conditional, and the browser prefix list gained `mcp__Claude_Preview__` and
   `mcp__Claude_Browser__` (`t2o` `:512996`, **220=2 / 193=0**).
2. **A plan-approval "review step".** `tengu_plan_review_step` (`:761415`, **220=1 / 193=0**) records
   `{choice, msSinceShown, viaChord}` for a pre-approval choice whose `"review-artifact"` value
   (**220=3 / 193=0**, `:761426`) publishes the plan as a shareable artifact before approving, with
   four states (`publishing` / `done` / `stale` / `failed`, `:761100-761109`) and a stale-on-edit
   demotion. `tengu_plan_exit_dialog_shown` (`:761290`, **220=1 / 193=0**) records
   `{planLengthChars, isEmptyPlan, publishOptionVisible}` once per dialog. This is instrumentation +
   feature for the `/plan share` flow, and the changelog never mentions it in a plan-mode bullet.

---

## 6. Not covered, and why

- **The Bash static read-only analyzer itself** — owned by [`../38_permissions/`](../38_permissions/)
  ([`security_hardening_214.md`](../38_permissions/security_hardening_214.md),
  [`classifier_adjudication.md`](../38_permissions/classifier_adjudication.md),
  [`destructive_command_rules.md`](../38_permissions/destructive_command_rules.md)). This directory
  documents what plan mode does with its verdict, not how the verdict is computed. The
  `circuitBreaker` taxonomy (`suspiciousWindowsPath` etc.) likewise belongs there; only its plan-mode
  exemption via `gnn` is here.
- **`.207`'s "background sessions auto-named by accepting a plan not showing that name on their
  agent-view row"** — that bullet is scoped to `background_agents`, not `plan_mode`. For the record,
  its plan-side entry point is `YYf` (`:761072-761092`), newly called from the approval handler at
  `:761523` (`if (C3 !== "no") YYf(uI, lne, !XBS);`), which summarises the first 1,000 characters of
  the plan into a session name. `YYf` has no 2.1.193 counterpart at that call site.
- **`.210`'s exact changed line** — see §3.1. Recorded as partially anchored rather than guessed.
- **Which release each `tcr` guard landed in** — not derivable from a two-point diff; see
  [`bash_bypass_and_classifier_212_218.md`](bash_bypass_and_classifier_212_218.md) §4.
- **The plan-mode system reminder text and cadence** — unchanged surface as far as the literals go
  (`--plan-mode-instructions` help text 1/1); the 2.1.193 tree's `reminder_cadence.md` and
  `prompt_surface.md` still apply.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this directory are staged in
> [symbol_additions_v2_1_220_plan_mode.md](../00_overview/symbol_additions_v2_1_220_plan_mode.md).

Key functions in this document:
- `isPlanMode` (`tcr`, `:289037`) - the two-line predicate inserted at four permission-bypass sites
- `isReadOnlyBrowserCall` (`cOt`, `:288994`) - per-call browser read-only verdict
- `browserBatchNeedsPermission` (`BEy`, `:289288`) - `some()` over `browser_batch` sub-actions
- `BROWSER_AUTO_ALLOW_TOOL_NAMES` (`OKt`, `:34675`) - carryover 9-name set
- `activatePlanAutoMode` (`Kfn`, `:529742`) - extracted activator, also used for born-in-plan sessions
- `verifyAutoModeGateAccess` (`Vfn`, `:529614`) - holds the born-in-plan branch at `:529638`
- `autoModeAdjudication` (`t$_`, `:513711`) - the block holding `$`, the plan floor and the classifier call
- `decisionReasonIsPlanMode` (`Prp`, `:513484`) - `{type:"mode", mode:"plan"}` test
- `isStrictlyReadOnlyBrowserTool` (`n2o`, `:512911`) / `isAutoModeAllowlistedTool` (`zqs`, `:512892`) - the forked predicates
- `isAutoModePermissionSurface` (`gnn`, `:325872`) - `auto` OR `plan`+auto; gates the circuit-breaker exemption
- `bashAcceptEditsModeAllow` (`Pqy`, `:393486`) / `ACCEPT_EDITS_FILE_COMMANDS` (`Lqy`, `:393515`)
- `sandboxedBashAutoAllowAst` (`cvd`, `:393889`) / `sandboxedBashAutoAllowPrefix` (`Wqy`, `:393923`)
- `buildPlanApprovalAnswer` (`e7f`, `:761160`) - the consolidated dialog answer builder (was `Tar` `:640586 (193)`)
- `markPublishedPlanStale` (`Mnl`, `:761667`) - demotes a published plan artifact on edit
- `logPlanReviewStep` (`Lnl`, `:761410`) - `tengu_plan_review_step` emitter
- `nameSessionFromPlan` (`YYf`, `:761072`) - plan-derived session auto-naming
