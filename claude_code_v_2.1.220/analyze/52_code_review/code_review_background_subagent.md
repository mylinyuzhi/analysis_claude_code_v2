# `/code-review` becomes a background subagent, and the review pipeline it dispatches

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). **Baseline:** the same path under `versions/2.1.193/` (718,679 lines), always tagged
`(193)` when quoted. Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md).

Bullets covered here:

| Release | Bullet |
|---|---|
| `.218` | Changed `/code-review` to run as a background subagent, so review work no longer fills your conversation and keeps stacked slash commands as its review target |
| `.218` | Fixed `/code-review ultra` silently running a local review in non-interactive sessions — it now launches the cloud review |
| `.206` | Improved `/code-review` findings quality on `claude-opus-4-8` across all effort levels |
| `.196` | Improved `/code-review` workflow: merged five cleanup finders into one, cutting token usage by roughly 25% |

---

## 0. The three layers you have to hold in your head

`/code-review` is not one thing. It is a **dispatcher** that picks one of three execution shapes, and
almost every bullet in this theme is a change to *which shape gets picked* rather than to the review
itself.

| Shape | What runs | Where it lives in 2.1.220 |
|---|---|---|
| **inline cell** | one prompt string injected into the current turn; the main model does the review itself, optionally fanning out with the `Agent` tool | effort-cell builders `:423628-424045`, dispatch `xqS` `:774287-774312` |
| **Workflow** | the `code-review` bundled workflow script — a real multi-agent program with Scope/Find/Verify/Sweep/Synthesize phases | script source `:424046-424408`, metadata `:424409-424444` |
| **cloud (`ultra`)** | a remote "bughunter" session on Claude Code on the web | `subcommands: { ultra: "ultrareview" }` `:774584`, launcher `:497180`; argument handling is [`ultrareview_argument_handling.md`](ultrareview_argument_handling.md) |

`.218`'s "runs as a background subagent" changes a **fourth** axis, orthogonal to the three above:
whether the chosen shape runs *in the conversation* or *in a forked background agent*.

---

## 1. The `.218` change: `getContext` and the fork

### 1.1 The command definition, before and after

The `/code-review` command object is the smallest, cleanest diff in this whole theme.

```javascript
// ============================================
// registerCodeReviewCommand - the /code-review slash-command object
// Location: cli_inner_pretty.js:774580-774602  (2.1.193 twin at :650844-650856)
// ============================================

// ORIGINAL (for source lookup):
function Knm() {
  ou({
    name: REe,
    menuDescription: "Review the current diff for bugs and cleanups",
    subcommands: { ultra: "ultrareview" },
    description: RqS,
    argumentHint: LqS,
    userInvocable: !0,
    disableModelInvocation: !0,
    getEffort(e, t) { let { explicit: r } = icl(e); if (r === void 0) return; return Wnm(scl(t?.options ? WL(t) : void 0), r); },
    getContext(e, t) {
      if (F_()) return "inline";
      if (acl(t)) return "inline";
      let r = icl(e);
      if (!r.ultraFallback && znm(Vnm(r, t), t)) return "inline";
      return "fork";
    },
    getPromptForCommand: DqS,
  });
}

// READABLE (for understanding):
function registerCodeReviewCommand() {
  registerSlashCommand({
    name: CODE_REVIEW_SKILL_NAME,                       // "code-review"
    menuDescription: "Review the current diff for bugs and cleanups",
    subcommands: { ultra: "ultrareview" },              // /code-review ultra -> the ultrareview command
    description: buildCodeReviewDescription,
    argumentHint: buildCodeReviewArgumentHint,
    userInvocable: true,
    disableModelInvocation: true,                       // NEW in .215 - see manual_invocation_gating.md
    getEffort(args, ctx) { ... },
    getContext(args, ctx) {                             // NEW in .218
      if (isCoordinatorMode()) return "inline";              // CLAUDE_CODE_COORDINATOR_MODE, :231441
      if (isReportFindingsForceEnabled(ctx)) return "inline";
      let parsed = parseCodeReviewArgs(args);
      if (!parsed.ultraFallback && shouldRouteToWorkflow(resolveEffort(parsed, ctx), ctx)) return "inline";
      return "fork";                                    // default: run as a forked (background) subagent
    },
    getPromptForCommand: buildCodeReviewPrompt,
  });
}

// Mapping: Knm→registerCodeReviewCommand, ou→registerSlashCommand, REe→CODE_REVIEW_SKILL_NAME (:318660),
//          icl→parseCodeReviewArgs (:774350), znm→shouldRouteToWorkflow (:774526),
//          Vnm→resolveEffort (:774520), acl→isReportFindingsForceEnabled (:774313),
//          F_→isCoordinatorMode (:231441), DqS→buildCodeReviewPrompt
```

2.1.193's object (`:650844-650856 (193)`) is byte-for-byte the same **minus** `disableModelInvocation`
and **minus** `getContext`. It had no way to express "run me somewhere else".

**Proof that `getContext` is the new field, not a re-mangled old one.** `getContext(` is
`220=9 / 193=3`, but six of the nine 220 hits are `canvas.getContext('2d')` inside embedded skill
HTML (`:375642 :378501 :544736 :786853 :787156 :787855`) and two are the vendored OTEL Lambda context
class (`:71814`, `:71843`). Exactly **one** hit — `:774594` — is a slash-command field, and all three
193 hits are the OTEL class (`:67317`, `:67346 (193)`) plus a canvas call (`:526064 (193)`). The generic resolver that reads the field is also
220-only:

```javascript
// resolveCommandContext - "inline" or "fork" for a slash command  (:326547-326549)
function RAo(e, t, r) { return e.getContext?.(t, r) ?? e.context ?? "inline"; }
```

`context ?? "inline"` is `220=1 / 193=0`; 2.1.193 read the static field directly at its single
dispatch site (`if (c.context === "fork")`, `:398210 (193)`). So the delta is precise: **a static
enum field became a function of `(args, context)`**, and `/code-review` is the first command to use it.

### 1.2 Why "fork" now means "background", and when it does not

`RAo(...) === "fork"` routes into `aNy` (`:343059`), the forked-command dispatcher. Its very first
decision is whether the fork should be *backgrounded*:

```javascript
// ============================================
// shouldRunForkInBackground - decides background agent vs blocking in-process fork
// Location: cli_inner_pretty.js:342396-342399
// ============================================

// ORIGINAL (for source lookup):
function qTo(e, t) {
  if (t || LE() || yn()) return !1;
  return e.background ?? !0;
}

// READABLE (for understanding):
function shouldRunForkInBackground(command, isAlreadyInsideSubagent) {
  if (isAlreadyInsideSubagent) return false;                 // no nesting a bg agent inside a subagent
  if (backgroundTasksDisabledByEnv()) return false;          // CLAUDE_CODE_DISABLE_BACKGROUND_TASKS
  if (!isInteractiveSession()) return false;                 // print/SDK mode: run inline and block
  return command.background ?? true;                         // DEFAULT TRUE
}

// Mapping: qTo→shouldRunForkInBackground, LE→backgroundTasksDisabledByEnv (:230330),
//          yn→(!isInteractive) (:3286)
```

**Why `?? !0` (default true) rather than an opt-in?** Because the same predicate serves the `.218`
skill-frontmatter change (`context: fork` skills run in the background by default, with
`background: false` as the opt-out — the frontmatter field is at `:157797`, owned by the skills
module). Making the *runtime* default `true` and letting the declaration opt out means the
`/code-review` command object does not have to say `background: true` at all; it only says
`getContext → "fork"`.

**Three ways it silently degrades to a blocking fork**, in evaluation order:

1. `isAlreadyInsideSubagent` — a `/code-review` issued from inside a subagent must not spawn a
   sibling background agent, because the parent is already the thing waiting.
2. `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` — the global kill switch.
3. `!isInteractiveSession()` — in `--print`/SDK mode there is no agent view to watch, and the caller
   expects the review result on stdout. Backgrounding would return "started" and exit.

Ordering matters: the cheap boolean is first, the env read second, the process-mode read third, and
the per-command declaration last, so a command can never override an environment-level refusal.

When the background path is taken, `VTo` (`:343125`) launches the agent and the conversation gets a
two-line stub instead of the review:

```javascript
// :343158-343161
UH(`<local-command-stdout>Running in the background as @${K.name}</local-command-stdout>
` + Cdd({ agentId: K.agentId, skillName: e.name, description: `/${Sd(e)} ${t}`.trim() }))
```

`Running in the background as` is **220=2 / 193=0**. That literal is the cleanest single proof of the
bullet: in 2.1.193 the forked dispatcher `A9p` (`:397679 (193)`) had no background branch at all — it
logged `Executing forked slash command …` and then awaited the agent in-process, so the whole review
transcript landed in the conversation. This is exactly what "review work no longer fills your
conversation" means.

### 1.3 The stacked-slash-command carve-out

The second half of the `.218` bullet — "keeps stacked slash commands as its review target" — is a
three-term guard added to the prompt-command dispatch:

```javascript
// ============================================
// prompt-command dispatch: skip stacked-command parsing for fork-context commands
// Location: cli_inner_pretty.js:343677-343685
// ============================================

// ORIGINAL (for source lookup):
let { stacked: E, trailingArgs: A, capped: b } =
  y.context === "fork" || y.getContext !== void 0 || y.argsMayContainSlashCommands
    ? { stacked: [], trailingArgs: t, capped: !1 }
    : tpd(t, d, n.options.commands, c ? (u ?? (() => !0)) : void 0),
  T = A;
if (E.length > 0) O("tengu_stacked_slash_commands", { stacked_count: E.length });

// READABLE (for understanding):
let { stacked: stackedCommands, trailingArgs, capped } =
  command.context === "fork" || command.getContext !== undefined || command.argsMayContainSlashCommands
    ? { stacked: [], trailingArgs: rawArgs, capped: false }   // treat the WHOLE arg string as arguments
    : parseStackedSlashCommands(rawArgs, ...);
if (stackedCommands.length > 0) logEvent("tengu_stacked_slash_commands", { stacked_count: stackedCommands.length });

// Mapping: tpd→parseStackedSlashCommands (:343833), epd→STACKED_COMMAND_CAP (:343842 guard)
```

**What it does:** stacked slash commands ("`/plan /code-review fix the auth bug`" style chaining, added
in `.199`) let one input expand several bundled prompts in sequence. `parseStackedSlashCommands` walks
the argument string, and while it still starts with `/`, peels off another command.

**How it works and why the carve-out is needed:**

1. `/code-review /simplify src/auth.ts` — without the guard, `tpd` sees the argument starting with
   `/`, resolves `simplify`, and **consumes it as a second command to run**, leaving `/code-review`
   with the arguments `src/auth.ts`.
2. That is wrong for a review command, because a review *target* is legitimately free-form text and
   may name a slash command ("review my `/simplify` changes"). The review's own scope prompt takes
   the raw text verbatim (`:424151`, `:424183`).
3. The guard therefore short-circuits the parser for any command that (a) statically declares fork
   context, (b) has a dynamic `getContext`, or (c) explicitly declares `argsMayContainSlashCommands`.

Note the guard tests `getContext !== undefined`, **not** `getContext(...) === "fork"`. That is a
deliberate coarsening: a command whose context is dynamic must behave *consistently* whichever branch
it takes, otherwise `/code-review low /simplify x` would stack while `/code-review /simplify x` would
not. Stability of argument parsing beats precision here.

`tpd` carries the same three-term test internally when deciding whether to *keep* stacking
(`:343856-343866`), so a fork-context command can never appear as the second element of a stack
either. Both `tpd` and `tengu_stacked_slash_commands` are `220>0 / 193=0`; the *feature* is `.199`'s
(see the false-delta ledger's skills_plugins row) and only the fork carve-out belongs to `.218`.

### 1.4 What the fork inherits

`aNy` builds the child agent descriptor at `:343078-343090`:

```javascript
let y = qTo(e, c) ? {
  agentId: p,
  parentAgentId: r.agentId,
  depth: DI(r.agentContext) + 1,          // counts against CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH
  agentType: "subagent",
  isAsync: !1,
  isBackgroundAgent: r.agentContext && "isBackgroundAgent" in r.agentContext ? r.agentContext.isBackgroundAgent : void 0,
  ...nZ(r.agentContext),
} : void 0;
```

Two consequences worth stating:

- The forked review **counts against the spawn-depth cap** (`hee()`, `_GROUND_TRUTH` §2, default 3).
  A `/code-review` issued at depth 3 cannot fork; `qTo`'s `isAlreadyInsideSubagent` guard fires first
  in practice, so it runs inline.
- `Oon(...)` (`:343100-343105`) is called with `replaceCommandRules: !0` and
  `replaceDenyRules: !c` — the fork gets the command's own permission layer rather than inheriting
  the parent's, and `frozenCommandDenies` is threaded to the launcher. A background review therefore
  cannot quietly widen permissions relative to the `/code-review` command's own declaration.

---

## 2. `.218` cloud vs local routing, and the non-interactive fix

### 2.1 The four predicates that decide "is `ultra` even available"

```javascript
// :226438  isUltrareviewFeatureEnabled
function eir() { return Vlt()?.enabled === !0 && Dc() && !qW(); }
// :226425  isUltrareviewUsable  (feature on AND entitled)
function dee() { return eir() && NDt(); }
// :226428  getUltrareviewBlockedReason  - null when usable
function tLu() {
  if (dee()) return null;
  let e = $no(QRu, null);
  if (e.source === "fallback" && !X1e()) return "config_unavailable";
  if (e.value?.enabled !== !0) return "kill_switch";
  if (!Dc()) return "third_party_provider";
  if (qW()) return "remote_environment";
  if (!DVe()) return "non_first_party_base_url";
  return "entitlement";
}
```

`QRu = "tengu_review_bughunter_config"` (`:226458`, 220=1/193=1) is the remote config object that also
carries `max_diff_files`, `max_diff_lines`, `cost_note`, `duration_note`, `model`, `fleet_size` and
(new in this window) `empty_tree_fallback_enabled` (`:226423`, **220=1 / 193=0**).

The **ordering of `tLu`'s five reasons is a diagnostic ladder**, cheapest-and-most-global first:
config not loaded → org kill switch → provider is not first-party → running in a remote environment
→ base URL is not first-party → (everything structural is fine, so it must be) entitlement. Only the
last one is a per-user answer, so it is the only one that then calls `C7r()` for a finer sub-reason
(`api_key_auth`, `no_profile_scope`, `not_in_rollout`) inside `Jdo()` (`:226441-226457`).

### 2.2 The actual `.218` fix: a second, non-interactive `ultrareview` command

`/code-review ultra` works by **subcommand retargeting**: `Npr` (`:342641`) looks `ultra` up in
`subcommands`, finds `"ultrareview"`, and the dispatcher swaps the resolved command
(`:343319-343326`). If the retarget target is missing or `isEnabled()` returns false, control falls to:

```javascript
else if (C.name === REe) { let ve = Jdo(); if (ve) I = ml(`${ve} Running a local review instead.`, "warning"); }
```

That warning branch is **carryover** — 2.1.193 has the identical shape at `:397841 (193)`
(`else if (h.name === fre) { let te = vVn(); … }`). So the bullet's "silently" is not fixed by adding a
message; the message existed. What was missing is a target to retarget *to*.

In 2.1.193 there is exactly one `ultrareview` command object (`:538551 (193)`), `type: "local-jsx"` —
an Ink component. In a `--print`/SDK session there is no Ink renderer, so the command is unusable and
the retarget fails; `Jdo()` returns `null` whenever the user *is* entitled, so no warning printed
either, and the session quietly ran a local review. 2.1.220 registers **two**:

```javascript
// :497650-497668
(v7d = { type: "local-jsx", name: "ultrareview", get description() { return E7d(); }, isEnabled: () => dee() }),
(A7d = {
  type: "local",
  name: "ultrareview",
  get description() { return E7d(); },
  supportsNonInteractive: !0,
  isEnabled: () => yn() && dee(),          // ONLY in a non-interactive session
  get isHidden() { return !yn(); },
  load: () => Promise.resolve().then(() => (S7d(), b7d)),
});
```

`isEnabled: () => yn() && dee()` and `isEnabled: () => dee()` are mutually exclusive on `yn()`
(`!isInteractive`), so exactly one of the pair is live in any session. The non-interactive one loads
`b7d`, whose `call` (`ZI_`, `:497557-497590`) drives `runUltrareviewHeadless` (`OBt`, `:497398`) with
`confirm: !0, singlePass: !0, withholdOverageConsent: !0`.

**`withholdOverageConsent: !0` is the interesting flag.** A headless session cannot show a billing
dialog, so instead of silently consenting on the user's behalf it returns `needs-confirm` and prints
(`:497574-497577`):

> `<body> /ultrareview can't show the billing confirmation in this session.` followed by either
> `Run /ultrareview to confirm and launch the cloud review.` (on a GUI host) or
> `Run "claude ultrareview" from your terminal to consent and launch, or use /ultrareview in an interactive Claude Code session.`

So the fix is not "make it work headlessly"; it is "make it *reach* the cloud path and then fail
loudly at the one step that genuinely needs a human". The new telemetry gate
`tengu_review_remote_gate_blocked` (`:497402`, **220=1 / 193=0**) fires when the headless entry point
is reached but `dee()` is false, carrying `reason` from `tLu()` and `entitlement_blocker` from
`C7r()` — i.e. the client can now measure *why* headless cloud reviews do not start.

### 2.3 The fallback prose when the model asks for `ultra`

`$qS` (`:774534-774579`) builds the parenthetical that prefixes the inline prompt when
`ultraFallback` is set (the user or model typed `ultra` but the review is running locally). Its
branch structure encodes exactly who can do what:

| Condition | Message |
|---|---|
| `!dee()` and `--fix` | `(Running a local <level>-effort review and applying its findings.)` |
| `!dee()`, feature on, **non-interactive** | `(<Jdo() reason> Falling back to a local <level>-effort review.)` |
| `!dee()`, feature on, interactive | `(ultra (cloud review) requires claude.ai account access this session doesn't have …)` |
| `!dee()`, feature off | `(ultra (cloud review) isn't available in this environment …)` |
| `dee()` and the `ultrareview` command *is* visible | `(Claude can't launch the cloud review directly — type \`/code-review ultra\` to run it. …)` |
| `dee()` and it is not | `(… the user can run \`claude ultrareview\` from a terminal to start it. …)` |

The last two lines are the honest statement of the security posture: **the cloud review is billed and
therefore must be user-triggered**, and the client refuses to let the model launch it even when the
account is entitled. The system-prompt clause that says the same thing to the model
(`:507669`, "It is user-triggered and billed; you cannot launch it yourself, so do not attempt to via
Bash or otherwise") is **byte-identical carryover** from `:592710 (193)` — the policy is old, only the
non-interactive plumbing is new.

---

## 3. The Workflow pipeline: `Scope → Find (barrier) → group-by-location → Verify → Sweep → Synthesize`

The bundled `code-review` workflow is emitted as a **JavaScript source string** that the Workflow
runtime executes; it therefore carries its own architecture comment, which is the single richest
artefact in this theme.

```javascript
// ============================================
// codeReviewWorkflowScript - the bundled multi-agent review program (self-documenting header)
// Location: cli_inner_pretty.js:424055-424068
// ============================================

// ORIGINAL (for source lookup):
// code-review: Scope → Find (barrier) → group-by-location → Verify → Sweep (xhigh/max) → Synthesize
// Effort parameterization mirrors the inline /code-review cells. Correctness
// keeps one finder per angle; cleanup is one finder covering all cleanup
// angles, capped at (cleanup-angle count \xD7 perAngle) so the merged finder
// has the same total cleanup-candidate budget the old per-angle finders had.
//   high  → 3 correctness + 1 cleanup (5 angles, ≤30 cands) → ≤10 findings
//   xhigh → 5 correctness + 1 cleanup (5 angles, ≤40 cands) → sweep → ≤15 findings
//   max   → same structure as xhigh (the API reasoning effort differs, not the fan-out)
const LEVEL_PARAMS = {
  high: { correctnessAngles: 3, perAngle: 6, maxFindings: 10, sweep: false },
  xhigh: { correctnessAngles: 5, perAngle: 8, maxFindings: 15, sweep: true },
  max: { correctnessAngles: 5, perAngle: 8, maxFindings: 15, sweep: true },
}
const SWEEP_MAX = 8
```

2.1.193's header (`:443425-443429 (193)`) is the before-picture:

```
// code-review: Scope → pipeline(per-angle Find → Verify) → Sweep (xhigh/max) → Synthesize
//   high  → 3 correctness + 5 cleanup angles × 6 → ≤10 findings
//   xhigh → 5 correctness + 5 cleanup angles × 8 → sweep → ≤15 findings
```

`LEVEL_PARAMS` itself is **unchanged**. Every number a user could name (3/5 correctness angles, 6/8
per angle, 10/15 findings, sweep at xhigh+, `SWEEP_MAX = 8`) survives. Two structural things changed,
and only one of them is in the changelog.

### 3.1 `.196` — five cleanup finders merged into one

**What it does:** collapses the five cleanup *angles* (Reuse plus four siblings, `aRd` at
`:424435-424443`) from five parallel finder agents into a single agent that reviews through all five
lenses.

**How it works:**

1. `aRd` is a 5-element array of cleanup-lens prose blocks. In 193 the equivalent `bef` was mapped
   one-to-one onto finder descriptors: `.concat(CLEANUP_ANGLES.map(a => ({ ...a, kind: "cleanup" })))`
   (`:443570 (193)`).
2. In 220 the concat is a single synthetic descriptor whose cap is the *sum* of what the five agents
   used to have:

   ```javascript
   .concat([{ label: "cleanup", kind: "cleanup", cap: ${aRd.length} * P.perAngle, text: CLEANUP_TEXT }])   // :424278-424283
   ```

   `${aRd.length}` is interpolated at bundle time, so the emitted script literally reads `cap: 5 * P.perAngle`.
3. The prompt builder branches on `f.kind === "cleanup"` (`:424194-424204`) to switch the instruction
   from "review ONLY through the lens of your assigned angle" to "review through EACH of the following
   cleanup lenses", and appends `CLEANUP_PRECEDENCE` (the tie-break between overlapping lenses) which
   correctness finders never see.

**Why this approach:** the changelog's ~25 % token saving comes from the *shared prefix*, not from the
lens prose. Every finder receives the whole `SCOPE_BLOCK` — diff command, changed-file list,
CLAUDE.md list, change summary, conventions, and the verbatim user target (`:424169-424187`). Five
cleanup finders paid that prefix five times. One pays it once. The lens texts themselves are still all
sent, concatenated, so recall should be roughly preserved — which is why the *cap* had to be summed
rather than left at `perAngle`, or the merged agent would have been allowed only a fifth of the
candidates.

**Trade-offs the code is explicit about** (`:424268-424275`):

> Correctness stays 1 finder per angle (lens-partitioning matters for catch). Cleanup is ONE finder
> covering all cleanup angles (same shared texts, one agent) — keeps the task set identical to inline,
> breaks only the 1-angle:1-agent mapping. With four fewer finders at every level the barrier wait
> shortens enough that wall-clock is net-faster than the pre-#45024 per-finder pipeline.

So: correctness angles were *not* merged, because a single agent asked to hunt five distinct classes
of bug degrades — lens partitioning is a recall device there, whereas for cleanup the lenses overlap
enough that one pass over all five is acceptable.

**Key insight:** the saving is entirely in duplicated context, and the author bought it by giving up
the 1-angle:1-agent property only where partitioning was cheap to lose. `CLEANUP_TEXT` is
`220=2 / 193=0`; `CLEANUP_ANGLES` is `220=0 / 193=2`; the rename is the delta.

### 3.2 The undocumented second half: per-location verifier merge and a barrier

No changelog bullet mentions this, but it is the larger change.

**2.1.193** ran `pipeline(FINDERS, findStage, verifyStage)` — a streaming pipeline with *no barrier*:
each finder's candidates went straight into `parallel(candidates.map(verifyCandidate))`, i.e.
**one verifier agent per candidate** (`:443560-443585 (193)`).

**2.1.220** runs `parallel(FINDERS…)` to completion, then `verifyGroups(allCandidates)`
(`:424285-424295`). `verifyGroups` (`:424252-424266`) buckets candidates by
`loc(c) = file + ":" + line` and spawns **one verifier per distinct location**, asking for one verdict
per candidate at that location, indexed by `[i]`.

```javascript
// ============================================
// verifyGroups - one verifier agent per distinct (file, line), N verdicts each
// Location: cli_inner_pretty.js:424252-424266
// ============================================

// ORIGINAL (for source lookup):
async function verifyGroups(candidates) {
  const byLoc = Object.create(null)
  for (const c of candidates) (byLoc[loc(c)] ||= []).push(c)
  const groups = Object.values(byLoc)
  verifierAgents += groups.length
  const out = await parallel(groups.map(g => async () => {
    const short = g[0].file.split("/").pop()
    const r = await agent(GROUP_VERIFIER_PROMPT(g), { label: "verify:" + short + "(" + g.length + ")", phase: "Verify", schema: GROUP_VERDICT_SCHEMA })
    if (!r) return []
    const byIdx = {}
    for (const v of r.verdicts) if (inBounds(v.index, g.length)) byIdx[v.index] = v
    return g.flatMap((c, i) => byIdx[i] ? [{ ...c, verdict: byIdx[i].verdict, evidence: byIdx[i].evidence }] : [])
  }))
  return out.filter(Boolean).flat()
}

// READABLE: identical - this is workflow source, not obfuscated. `Object.create(null)` is used so a
// candidate at a file literally named "constructor" or "__proto__" cannot collide with Object.prototype.
```

The code documents its own cost model in three separate comments:

- `:424115-424118` — *"Cuts verifier-agent count by the cross-finder location-collision rate (~40% at
  p50) without dropping any candidate."*
- `:424242-424249` — *"Grouping is not dedup: every candidate keeps its own verdict … A candidate the
  verifier did not render a verdict on (agent died, or it omitted that index) is dropped — same policy
  as the old per-candidate verifier — so unverified candidates never reach the report as fabricated
  PLAUSIBLE. Trade-off vs per-candidate: one verifier-agent failure now drops every candidate at that
  location instead of one."*
- `:424268-424269` — *"The barrier is the deliberate trade for cross-finder location merge: grouping
  needs every finder's output."*

**Why the barrier is acceptable:** you cannot group across finders until all finders have reported.
That reintroduces a join the 193 pipeline deliberately avoided, and it is paid for by the `.196`
finder-count reduction (8→4 at high, 10→6 at xhigh/max) — the slowest finder now has four fewer peers
to wait behind. The two changes are load-bearing for each other, which is why they shipped together
even though only one got a bullet.

**A real regression the author accepted and named:** verifier-agent failure blast radius went from one
candidate to one *location*. Since candidates cluster at hot lines, that is not a small change. The
mitigation is the fail-closed policy: an unverified candidate is dropped rather than promoted to
`PLAUSIBLE`, so the failure mode is a miss, never a fabricated finding.

### 3.3 Path canonicalisation, an easily-missed correctness prerequisite

Grouping by `file + ":" + line` only works if every finder spells the path the same way. It does not:

```javascript
// canonFile - longest-suffix match against the Scope agent's file list  (:424216-424224)
const canonFile = raw => {
  if (!raw) return ""
  const p = raw.replace(/\\/g, "/")
  let best = ""
  for (const sf of scope.files) { if ((p === sf || p.endsWith("/" + sf)) && sf.length > best.length) best = sf }
  return best || p
}
```

*Longest* match wins, and the comment says why (`:424212-424215`): when one changed-file path is a
suffix of another (`util/x.ts` vs `a/util/x.ts`), an absolute path must canonicalise to the more
specific entry. A shortest-match or first-match implementation would silently merge two different
files into one verifier group. `canonFile` is **220=2 / 193=0** — in 193 the raw `c.file` went
straight into the label and the report, and there was no group key that could collide.

### 3.4 The synthesis assembler's three invariants

The Synthesize phase asks a model for *decisions by index* rather than re-emitted text
(`:424353-424362`), then reconstructs the report deterministically (`:424372-424395`). The assembler
states its invariants (`:424365-424371`):

1. no silent drops while there is room — a verified finding either appears (as primary or merge note)
   or is omitted only because the cap is full;
2. the displayed primary is the synthesizer's choice, and the verdict label is escalated to
   `CONFIRMED` only when a merged member is `CONFIRMED`;
3. the summary describes the report actually returned.

The mechanism is a `claim(i)` closure over a `Set` (`:424374`) that makes every index single-use, so a
synthesizer that lists the same finding as both a primary and someone else's merge member cannot
double-count. If the synthesizer's decisions are unusable, a backfill loop (`:424387-424392`) emits
the ranked findings unmerged and the summary says so verbatim. **The model is allowed to rank and
merge; it is not allowed to author the finding text.** That is the whole design of the phase.

---

## 4. Effort parameterization and per-model cells (`.206`)

### 4.1 The routing decision

```javascript
// ============================================
// shouldRouteToWorkflow - inline cell vs the bundled multi-agent workflow
// Location: cli_inner_pretty.js:774526-774533
// ============================================

// ORIGINAL (for source lookup):
function znm(e, t) {
  if (e !== "high" && e !== "xhigh" && e !== "max") return !1;
  if (t.options?.isSkillPreload) return !1;
  if (!M0()) return !1;
  if (t.options?.isNonInteractiveSession) return !1;
  if (!t.options?.tools?.some((r) => qa(r, dk))) return !1;
  return Ke("tengu_review_workflow_routing", !1);
}

// READABLE (for understanding):
function shouldRouteToWorkflow(effortLevel, ctx) {
  if (effortLevel !== "high" && effortLevel !== "xhigh" && effortLevel !== "max") return false; // low/medium stay inline
  if (ctx.options?.isSkillPreload) return false;          // preload only renders the description
  if (!areWorkflowsEnabled()) return false;
  if (ctx.options?.isNonInteractiveSession) return false; // no progress UI to show phases in
  if (!ctx.options?.tools?.some(t => isToolNamed(t, WORKFLOW_TOOL_NAME))) return false;
  return getFeatureValue("tengu_review_workflow_routing", false);   // remote gate, default OFF
}

// Mapping: znm→shouldRouteToWorkflow, dk→WORKFLOW_TOOL_NAME ("Workflow", :231211), Ke→getFeatureValue
```

Five refusals before a remote gate that **defaults to false**. So in a stock 2.1.220 the multi-agent
workflow is dark unless a server flag turns it on — and when it is off, `getContext` falls through to
`"fork"` and the *inline* cell runs in a background subagent instead. That is the practical meaning
of `.218` for most users: not "the workflow moved to the background", but "the inline review moved to
the background".

`tengu_review_workflow_routing` is 220=1/193=1 — the gate is carryover.

### 4.2 The per-model cell table (the real `.206` change)

The scoping pass classified `.206`'s "Improved `/code-review` findings quality on claude-opus-4-8" as
`SERVER_SIDE / THIN`. **That is wrong, and this is a correction.** The change is a client-side
per-model prompt-cell dispatch table that does not exist at all in 2.1.193:

```javascript
// ============================================
// codeReviewCellsByModel - per-model, per-effort prompt-cell selection
// Location: cli_inner_pretty.js:774655-774678
// ============================================

// ORIGINAL (for source lookup):
(cMr = {
  default: CqS,
  "claude-sonnet-5": {
    low: { cell: "low-sonnet5", modelEffort: "medium", finderBudgetHint: !1 },
    medium: fne("medium"),
    high: { ...fne("high"), finderBudgetHint: !0 },
    xhigh: { ...fne("xhigh"), finderBudgetHint: !0 },
    max: { ...fne("max"), finderBudgetHint: !0 },
  },
  "claude-opus-4-8": {
    low: { ...fne("o48-low-v1"), measuredExternal: !0 },
    medium: { ...fne("o48-med-v1"), measuredExternal: !0 },
    high: { ...fne("o48-high-v1"), measuredExternal: !0 },
    xhigh: { ...fne("o48-xhigh-v1"), measuredExternal: !0 },
    max: fne("max"),
  },
  "claude-opus-5": {
    low: Gnm,
    medium: { cell: "o5-bmin", modelEffort: "typed", finderBudgetHint: !1, measuredExternal: !0 },
    high: { cell: "o5-bmin", modelEffort: "typed", finderBudgetHint: !1, measuredExternal: !0 },
    xhigh: { ...fne("o48-xhigh-v1"), measuredExternal: !0 },
    max: fne("max"),
  },
});
for (let e of Object.values(cMr)) { for (let t of Object.values(e)) Object.freeze(t); Object.freeze(e); }
Object.freeze(cMr);

// READABLE (for understanding):
codeReviewCellsByModel = {
  default: DEFAULT_CELLS,
  "claude-sonnet-5": { ... },
  "claude-opus-4-8": {                                   // <- the .206 bullet, all five levels
    low:   { cell: "o48-low-v1",   modelEffort: "typed", finderBudgetHint: false, measuredExternal: true },
    ...
  },
  "claude-opus-5": { ... },                              // <- .219, undocumented
};

// Mapping: cMr→codeReviewCellsByModel, fne→cellDescriptor (:774605,
//          e => ({ cell: e, modelEffort: "typed", finderBudgetHint: !1 })),
//          CqS→DEFAULT_CELLS, Gnm→OPUS5_LOW_CELL
```

Evidence it is genuinely new: `o48-low-v1` is **220=2 / 193=0**, `o5-bmin` **220=4 / 193=0**,
`measuredExternal` **220=8 / 193=0**, `finderBudgetHint` **220=9 / 193=0**. 2.1.193's cell table is
flat and model-blind — `Ktm = { low: hpl, medium: Hzn, high: ypl, xhigh: bpl, max: Spl }`
(`:650897 (193)`), a single dimension.

**Why a table rather than prompt tweaks:** the bundled `claude-api` skill in the same build explains
the motivation in prose (`:796729`):

> *"if a code-review harness was tuned for an earlier model, it may initially show lower recall — this
> is likely a harness effect, not a capability regression. When a review prompt says 'only report
> high-severity issues' … Opus 4.7 follows that instruction more faithfully than earlier models did …
> Precision rises, but measured recall can fall even though underlying bug-finding has improved."*

That is the exact failure the `o48-*` cells exist to fix: the same instruction text produces different
reporting behaviour on a newer model, so the harness needs per-model prompt variants. `measuredExternal: !0`
is the marker for a cell whose wording was validated against an external eval; `DqS` reads it at
`:774396` (`E = m || !f.measuredExternal`) to decide whether to *skip* the generic extras
(finder-budget hint, artifact block) that a measured cell already accounts for. Freezing the whole
table (`:774679-774683`) makes accidental mutation impossible — these strings are eval-pinned.

**Verdict change:** `.206` is `DELTA / RICH` and client-side, not server-side. The *evaluation* that
chose the wording happened offline; the *dispatch* ships in the bundle.

### 4.3 Effort telemetry

`tengu_code_review_routed` (`:774406-774420`) is 220=1 / 193=1 as a *name*, but its payload grew from
6 fields to 13. New in 220: `uses_report_findings_tool`, `publishes_artifact`, `low_variant`,
`model_family`, `finder_budget`, `agent_tool_available`, `threaded_effort`. `model_family` is the
`cMr` key actually used; `threaded_effort` is `Wnm(model, explicitLevel)` — the *API reasoning effort*
the cell asks for, which can differ from the named level (Sonnet 5's `low` cell requests
`modelEffort: "medium"`). Anyone measuring `.206` from telemetry needs `model_family`, which is why it
was added in the same window.

---

## 5. How `ReportFindings` is consumed by the review pipeline

The tool object itself (schemas, `maxResultSizeChars: 256`, `strict: !0`) is documented in
[`../04_tools/tool_surface_delta_220.md`](../04_tools/tool_surface_delta_220.md) and
[`../04_tools/web_and_misc_tools_deltas.md`](../04_tools/web_and_misc_tools_deltas.md) §3. This
section owns only the *review-side* wiring.

### 5.1 Two gates, one forcing and one negotiated

```javascript
// isReportFindingsForceEnabled (acl)  :774313-774317
function acl(e) {
  if (e.options?.isSkillPreload) return !1;
  let t = XNn();
  if (t === "text" || t === "json") return !1;
  return Boolean(Z.CLAUDE_CODE_REPORT_FINDINGS) && Boolean(e.options?.tools?.some((r) => qa(r, ZB)));
}

// isReportFindingsAvailable (kqS)  :774319-774327
function kqS(e, t) {
  if (t.options?.isSkillPreload) return !1;
  if (acl(t)) return !0;
  if (!t.options?.tools?.some((n) => qa(n, ZB))) return !1;
  let r = XNn();
  if (r === "text" || r === "json") return !1;
  if (e === "low") return !1;
  return Ke("tengu_report_findings_tool", !1);
}
```

Both refuse when the session's output format is `text` or `json` — a structured tool call has no
renderer there, and the findings would vanish. `kqS` additionally refuses at `low` effort: at low
effort the review targets `min(files_changed, 4)` findings and a one-line-per-finding text list is
cheaper than a tool call whose result the host would render as a panel.

**`acl` has a second job that has nothing to do with tools:** it is the *second* early return in
`getContext` (`:774596`). When `CLAUDE_CODE_REPORT_FINDINGS` forces the structured path, the review
runs **inline**, not forked. The reason is that `ReportFindings` writes into the *host UI's* finding
panel for the session that called it; a background agent's tool calls render in the agent's own
transcript, so the panel would be attached to the wrong surface. The env var is a
developer/eval switch, and it keeps the review where the panel is.

### 5.2 What the prompt tells the model to do with it

Three distinct instruction blocks are appended depending on flags (`:774433`, `:774445`):

- **Report** — the workflow branch: *"call `ReportFindings` once with `{level, findings}` from the
  result payload (most-severe first; empty array if nothing survived). Give each finding a
  `short_summary`: the claim compressed to ≤60 characters, no rationale or consequence clause. Do not
  also print the findings as text."*
- **Re-report after `--fix`** (`qnm`, `:774686-774689`): call it again with the same findings, each
  carrying `outcome ∈ {fixed, no_change_needed, skipped}`.
- **Re-report later** (`Unm`, `:774691+`): *"Whenever reported findings get fixed later in this
  session … you MUST [re-call]. Make that call immediately after the fixes land, before any prose
  summary; the host UI's per-finding status updates only from it."*

`Unm` is appended only when `y && !A` — structured mode **and** the cell is not `o5-bmin`
(`:774433`, `:774445`; `A = !m && f.cell === "o5-bmin"` at `:774397`). Opus 5's medium/high cell is
deliberately not given the "you MUST re-report later" instruction. That is a per-model prompt-budget
decision of exactly the same kind as §4.2.

The tool description itself (`:403823`) is written defensively — *"Use this only when the active
code-review instructions tell you to report findings with this tool; otherwise follow whatever output
format those instructions specify"* — because the tool can be in the session's tool list while
`kqS` has decided this particular review should print text.

### 5.3 The cap mismatch

`Iwd` caps `findings` at `.max(32)` (`:403860`) while the review prompts say "at most 15"
(`:774271`) and `LEVEL_PARAMS.maxFindings` tops out at 15 (`:424065-424066`). The schema cap is
deliberately slack: it is a *validation* bound that must also admit the `--fix` re-report (which
echoes the same set) and any host-side path that is not the bundled review. A schema tighter than the
prompt would turn a mildly over-eager model into a hard tool-call rejection.

---

## 6. What the rest of the product now says about `/code-review`

Six surfaces reference the command, and reading them together is the fastest way to see the intended
posture:

| Site | Text | Delta |
|---|---|---|
| `:269622` | Workflow-agent scope prompt: *"If you have the `Agent` tool, you may use it to fan out (e.g. `/simplify`, `/code-review`, or your own parallel research/verification) — workers at the depth cap don't receive it"* | 220-only; gated on `hee() > 1` (the spawn-depth cap, `_GROUND_TRUTH` §2) |
| `:773628` | `/batch` step 1: *"Invoke the Skill tool with `skill: "code-review"` to find correctness bugs (it reports findings; it does not edit code)"* | 220 |
| `:788429`, `:788453` | `/simplify`: *"Quality only — it does not hunt for bugs; use `/code-review` for that."* | division of labour, carryover wording |
| `:815651-815665` | `code-review-low-fast` tip: suggests `/code-review low` — but only to users whose `skillUsage` contains a *custom* skill whose normalised name contains `codereview`, explicitly excluding `REe` itself | 220 |
| `:753651` | contextual banner: *"Run /code-review ultra after Claude finishes to review these changes in the cloud"* | gated on `dee()` |
| `:732844-732845` | after a review: *"Tip: run /code-review ultra (no number) to review your current branch instead"* / *"… `<PR number>` to fetch and review a specific GitHub PR instead"* | 220 |

The `:815659` detail is worth a sentence: `if (t === REe) return !1` means the tip only fires for
people who built *their own* code-review skill, nudging them onto the built-in one. It is a migration
prompt disguised as a tip.

The failure notification is the other end of the same posture (`:318328`):

> `Cloud review did not produce output (${i}). Tell the user to retry /code-review ultra, or use /review for a local review instead.`

`${i}` comes from `a0s` (`:318648-318655`), a six-member reason map:
`session_error`, `poll_timeout` ("cloud session exceeded 30 minutes"),
`poll_timeout_after_api_error`, `no_review_output` ("no review output — orchestrator may have exited
early"), `orchestrator_error`, `cancelled`. The notification is addressed to *Claude*, not the user —
it says "Tell the user to…" — because it arrives as a task notification into a background session.

---

## 7. Verdict table

| Claim | Verdict | Proof |
|---|---|---|
| `/code-review` runs as a background subagent (`.218`) | **NET_NEW** | `getContext` on the command `:774594` (193 command at `:650844-650856` has no such field); resolver `:326547` (`context ?? "inline"` 220=1/193=0); `Running in the background as` 220=2/193=0 |
| stacked commands stay the review target (`.218`) | **NET_NEW** | guard `:343681`, mirrored in the parser `:343856-343866`; `argsMayContainSlashCommands` 220=4/193=0 |
| `/code-review ultra` no longer silently local in non-interactive sessions (`.218`) | **NET_NEW** | second `ultrareview` command object `:497657-497668` with `supportsNonInteractive: !0` and `isEnabled: () => yn() && dee()`; `tengu_review_remote_gate_blocked` `:497402` 220=1/193=0. The *warning* branch at `:343323` is carryover (`:397841 (193)`) |
| five cleanup finders merged into one (`.196`) | **DELTA** | header `:424055-424062` vs `:443425-443429 (193)`; `CLEANUP_TEXT` 220=2/193=0, `CLEANUP_ANGLES` 220=0/193=2; merged descriptor `:424278-424283` |
| per-location verifier merge + barrier | **NET_NEW, UNDOCUMENTED** | `verifyGroups` 220=3/193=0, `GROUP_VERDICT_SCHEMA` 220=2/193=0, `canonFile` 220=2/193=0, `group-by-location` 220=1/193=0 |
| opus-4-8 findings quality (`.206`) | **DELTA, client-side** (scoping said SERVER_SIDE — corrected) | `cMr` `:774655-774678`; `o48-low-v1` 220=2/193=0; `measuredExternal` 220=8/193=0; 193's flat table `:650897 (193)` |
| `LEVEL_PARAMS` numbers changed | **NO** — identical in both builds | `:424063-424068` vs `:443430-443435 (193)` |
| model may not launch the cloud review | **CARRYOVER** | `:507669` byte-identical to `:592710 (193)` |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_code_review.md](../00_overview/symbol_additions_v2_1_220_code_review.md).

Key functions and constants in this document:
- `registerCodeReviewCommand` (`Knm`) - the `/code-review` command object, `:774580`
- `resolveCommandContext` (`RAo`) - `getContext?.() ?? context ?? "inline"`, `:326547`
- `shouldRunForkInBackground` (`qTo`) - background-vs-blocking fork decision, `:342396`
- `dispatchForkedSlashCommand` (`aNy`) - forked dispatcher + background launch, `:343059`
- `launchForkedBackgroundAgent` (`VTo`) - the background-agent launcher, `:343125`
- `parseStackedSlashCommands` (`tpd`) - stacked-command peeler with the fork carve-out, `:343833`
- `parseSubcommandRetarget` (`Npr`) - `subcommands` lookup for `/code-review ultra`, `:342641`
- `buildCodeReviewPrompt` (`DqS`) - cell selection, telemetry, prompt assembly, `:774384`
- `shouldRouteToWorkflow` (`znm`) - inline-vs-workflow routing, `:774526`
- `codeReviewCellsByModel` (`cMr`) - per-model, per-effort cell table, `:774655`
- `parseCodeReviewArgs` (`icl`) - level / target / `--fix` / `--comment` / `ultra`, `:774350`
- `buildUltraFallbackNotice` (`$qS`) - the "(Claude can't launch the cloud review directly…)" prose, `:774534`
- `isUltrareviewUsable` (`dee`) / `isUltrareviewFeatureEnabled` (`eir`) / `getUltrareviewBlockedReason` (`tLu`) - `:226425` / `:226438` / `:226428`
- `buildUltrareviewEntitlementHint` (`Jdo`) - per-auth-mode remediation text, `:226441`
- `isReportFindingsForceEnabled` (`acl`) / `isReportFindingsAvailable` (`kqS`) - `:774313` / `:774319`
- `CODE_REVIEW_SKILL_NAME` (`REe`) / `CODE_REVIEW_WORKFLOW_NAME` (`Cir`) - `:318660` / `:231212`
- `REMOTE_REVIEW_FAILURE_REASONS` (`a0s`) - the six cloud-review failure strings, `:318648`
