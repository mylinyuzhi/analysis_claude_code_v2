# 42 — Dynamic Workflows / ultracode — DELTA v2.1.156 → v2.1.183

> Module: `42_workflow` (DELTA tree) — what changed in **Dynamic Workflows** between Claude Code **v2.1.156** and **v2.1.183**.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). Every `cli_inner_pretty.js:<line>` citation below is a v2.1.183 line unless explicitly labelled *(v2.1.156 before-picture)*.
> BASELINE (read this for everything unchanged): [`../../../claude_code_v_2.1.156/analyze/42_workflow/`](../../../claude_code_v_2.1.156/analyze/42_workflow/README.md).
> Obfuscated names were **re-derived** for v2.1.183 — the bundler re-mangles every build, so a v2.1.156 obf name is never reused. Use the anchor list in the per-feature additions file as the canonical map.

---

## TL;DR — the subsystem is structurally unchanged; the deltas are concentrated in the keyword UX plus a handful of correctness fixes

**Read this first.** The Dynamic-Workflow subsystem in v2.1.183 is the **same machine** documented in the v2.1.156 baseline:

- the **4-layer enablement gate** (`isWorkflowsEnabled`, obfuscated: `Pw`, cli_inner_pretty.js:148784) is byte-equivalent logic to v2.1.156 `NZ`;
- the **VM runtime** (compile → `vm.Script` → `runInContext`, the six-global DSL surface `agent/parallel/pipeline/phase/log/workflow` + `args`/`budget`/`console`/timers) is unchanged;
- the **caps** are identical to the bit: agent ceiling `_Wa = 1000` (cli_inner_pretty.js:417718), stall `rLp = 180000` (cli_inner_pretty.js:417739), remote-default `X0p = 50` (cli_inner_pretty.js:417717), stall-retry `gWa = 5` (cli_inner_pretty.js:417740), script cap `A2 = 524288` (cli_inner_pretty.js:152140), preview truncation `AWa = 400` (cli_inner_pretty.js:417722), and concurrency `min(16, max(2, cores-2))` (`computeWorkflowConcurrency`, obfuscated: `K0p`, cli_inner_pretty.js:416892);
- the **journal/resume protocol** (`journal.jsonl`, SHA-256 cache key over `(phase, prompt, canonical opts)`, longest-unchanged-prefix replay, respawn detection, snapshot for `/workflows`) is unchanged;
- the **`meta` AST parser** (`parseWorkflowMeta`, obfuscated: `m0`, cli_inner_pretty.js:416466) keeps the first-statement `export const meta` rule, pure-literal evaluation, and prototype-pollution key ban;
- the **subagent system prompts** (plain `Q0p` cli_inner_pretty.js:417723, StructuredOutput `tLp` cli_inner_pretty.js:417804) are the same text;
- **fire-and-forget launch**, **`worktree` as the only advertised isolation** (`'remote'` still throws), and **first-use consent** all behave as in v2.1.156.

So everything in that list is **carryover** — do not re-derive it; link the baseline (see [§ Carryover map](#carryover-map-link-the-baseline-for-the-unchanged-spine)).

The real changes are **seven deltas**, and they cluster in two places: the **keyword-trigger UX** (the `workflow(s)` → `ultracode` rename, a dedicated violet input-box shimmer, and a new `/config` toggle that gates both the model reminder and the highlight) and a set of **tool-definition / runtime correctness fixes** (regex→AST determinism check, errorCode 7 abort-retraction, two new output-schema fields, a per-agent `effort` opt, per-agent attribution context on spawn, and `/workflows` opening immediately).

**Two framing traps** the scout caught (both confirmed against source here, so we do **not** mis-attribute them as 156→183 deltas):

1. **"/effort `ultracode` option only on xhigh-capable models" already shipped in v2.1.156.** The gate `T4(e) = Pw() && (e === void 0 || hTe(e))` (cli_inner_pretty.js:148898) is functionally identical to v2.1.156 `Vx(H) = NZ() && (H === void 0 || ycH(H))` *(v2.1.156 before-picture: cli_inner_pretty.js:184853)*, and the `/effort` slider already carried the `{value:"ultracode", label:"ultracode", color:"violet-ripple"}` level in v2.1.156 *(before-picture: cli_inner_pretty.js:527109)*. This is **not** a delta.
2. **The 2.1.178 "triggers only on explicit phrases" change is a description/policy edit, not a new runtime regex.** There is no runtime detector for the phrases "run a workflow" / "workflow:". The only runtime keyword matcher is the single-word `findUltracodeKeyword` (`yho`) = `matchKeyword(e, "ultracode")`. The phrases live exclusively inside the tool description prompt `gdo` (cli_inner_pretty.js:418177). See [Delta B2](#b2--the-2-1-178-explicit-phrase-change-is-a-descriptionpolicy-edit-not-a-new-regex).

**Confidence:** all seven deltas are **high** confidence (each proved with a before/after read). Two items carry an honest caveat: the worktree bg-edit fix (2.1.161) is only **medium** confidence on *where* the one-line permission-routing fix lives, and the per-agent attribution *header render* (the consumer of the new `agentContext`) is unconfirmed. See [§ Open questions](#open-questions--lowmedium-confidence-carried-from-the-dossier).

---

## What changed at a glance

| # | Delta | Kind | v2.1.183 anchor | Confidence |
|---|-------|------|-----------------|:----------:|
| B1 | Trigger keyword `workflow(s)` → `ultracode` (runtime matcher + reminder + description + footer) | renamed / behavior | `yho` cli_inner_pretty.js:464261; reminder cli_inner_pretty.js:590606 | high |
| B2 | "Explicit-phrase" trigger is a **description/policy** edit, **not** a new regex | behavior (model-facing) | `gdo` cli_inner_pretty.js:418177 | high |
| B3 | Dedicated **violet shimmer** for the keyword highlight (was the shared rainbow) | behavior (UI) | cli_inner_pretty.js:622310-622313; colors cli_inner_pretty.js:154110-154111 | high |
| B4 | New `/config` setting **`workflowKeywordTriggerEnabled`** ("Ultracode keyword trigger") gating both surfaces | added | `Jyn` cli_inner_pretty.js:148797; toggle cli_inner_pretty.js:479214 | high |
| B5 | Determinism check **regex → AST walk** (no more false-positives in strings/comments) | fix / refactor | `rWa` cli_inner_pretty.js:416439 | high |
| B6 | Per-agent **attribution context** (`agentContext`) on subagent spawn | fix | `Dt` cli_inner_pretty.js:417152; spawn cli_inner_pretty.js:417250 | high |
| B7 | `/workflows` opens **immediately** (`immediate:!0`) + renamed description | fix / behavior | `jmf` cli_inner_pretty.js:562632 | high |
| B8 | Tool-definition hardening: **errorCode 7** retraction, output fields **`taskType`/`workflowName`**, per-agent **`effort`** opt | added | `r5a` cli_inner_pretty.js:419415; schema cli_inner_pretty.js:419376; `effort` cli_inner_pretty.js:417123 | high |

Plus the **two framing traps** above, which look like deltas in the changelog but are not 156→183 source changes.

---

## B1 — Trigger keyword renamed `workflow(s)` → `ultracode`

**What it does:** The per-turn opt-in keyword that the user types to push a turn into multi-agent orchestration changed from `workflow`/`workflows` to the single word `ultracode`. Four surfaces moved together: the *runtime matcher* (what the input box scans for), the *model-facing system reminder* (what Claude is told), the *tool description* (the opt-in policy Claude reads), and the *footer hint* (what Claude suggests the user say next time).

**How it works (step by step):**

1. The generic keyword matcher `matchKeyword` (obfuscated: `hho`, cli_inner_pretty.js:464214) is the **same code-span-masking algorithm** as v2.1.156's `Bg6`: it first walks the text marking delimiter spans (backtick/quote/`<>`/`{}`/`[]`/`()`/`'`) using the delimiter map `Yel` (cli_inner_pretty.js:464280), then runs a `\b<kw>\b` regex and **discards any hit that falls inside a masked span** or is glued to `/`, `\`, `-`, `?`, or a `.identifier`. This is why "look in `workflows/`" or a path like `--ultracode-foo` does **not** trip it.
2. The only thing that changed at the matcher layer is the keyword the family functions pass: `findUltracodeKeyword` (obfuscated: `yho`, cli_inner_pretty.js:464261) returns `matchKeyword(e, "ultracode")`, and `hasUltracodeKeyword` (obfuscated: `Qel`, cli_inner_pretty.js:464267) returns `yho(e).length > 0`. Its v2.1.156 ancestor was `pg6(H) = Bg6(H, "workflows?")` *(before-picture: cli_inner_pretty.js:412172)* — note the `?` making the trailing `s` optional.
3. The reminder injector `makeWorkflowKeywordReminder` (obfuscated: `o4p`, cli_inner_pretty.js:464869) fires telemetry `tengu_workflow_keyword` and emits a `{type:"workflow_keyword_request"}` attachment — both names **unchanged**. Only the *rendered* reminder text changed (cli_inner_pretty.js:590606-590612).

```javascript
// ============================================
// findUltracodeKeyword / hasUltracodeKeyword - the renamed per-turn keyword matcher
// Location: cli_inner_pretty.js:464261-464268
// ============================================

// ORIGINAL (for source lookup):
function yho(e) {
  return hho(e, "ultracode");
}
// ...
function Qel(e) {
  return yho(e).length > 0;
}

// READABLE (for understanding):
function findUltracodeKeyword(text) {
  // matchKeyword (hho) is byte-for-byte the v2.1.156 masking algorithm;
  // only the literal keyword changed from "workflows?" to "ultracode".
  return matchKeyword(text, "ultracode");
}
function hasUltracodeKeyword(text) {
  return findUltracodeKeyword(text).length > 0;
}

// Mapping: yho->findUltracodeKeyword, Qel->hasUltracodeKeyword, hho->matchKeyword, e->text
// v2.1.156 ancestor: pg6(H)=Bg6(H,"workflows?") @412172, lj4(H)=pg6(H).length>0
```

The model reminder text moved from "workflow(s)" wording to the single "ultracode" keyword, and now explicitly frames it as *opting this turn into multi-agent orchestration*:

```javascript
// ============================================
// workflow_keyword_request reminder renderer - what the model is told
// Location: cli_inner_pretty.js:590606-590613
// ============================================

// ORIGINAL (for source lookup):
workflow_keyword_request: () =>
  Jp([
    Rn({
      content:
        'The user included the keyword "ultracode", opting this turn into multi-agent orchestration — use the Workflow tool to fulfill the request.',
      isMeta: !0,
    }),
  ]),

// READABLE (for understanding):
workflow_keyword_request: () =>
  makeReminderBlock([
    makeMetaMessage({
      content:
        'The user included the keyword "ultracode", opting this turn into multi-agent orchestration — use the Workflow tool to fulfill the request.',
      isMeta: true,
    }),
  ]),

// Mapping: Jp->makeReminderBlock, Rn->makeMetaMessage
// v2.1.156 before-picture @446735:
//   'The user included the keyword "workflow" or "workflows", which means you should use the Workflow tool to fulfill their request.'
```

The other two surfaces (verified by reading both bundles):

- **Tool-description opt-in form #1.** v2.1.183 cli_inner_pretty.js:418175: `- The user included the keyword "ultracode" in their prompt (you'll see a system-reminder confirming it).` *(v2.1.156 before-picture cli_inner_pretty.js:376082: `- The user included the "workflow" or "workflows" keyword (you'll see a system-reminder confirming it).`)*
- **Footer hint.** v2.1.183 cli_inner_pretty.js:418181: `Mention they can ask for one with "use a workflow" in a future message to skip the ask.` *(v2.1.156 before-picture cli_inner_pretty.js:376088: `Mention they can include "workflow" in a future message to skip the ask.`)*

**Why this approach:**

- **Why rename at all?** "workflow"/"workflows" are extremely common English words — users typing "set up a CI workflow" or "what's my workflow here?" incidentally tripped the per-turn opt-in (and saw a violet/rainbow shimmer they never asked for). `ultracode` is a coined token nobody types by accident, so the keyword becomes an *intentional* opt-in. This is also exactly what makes the changelog's "triggers only on explicit phrases, not any mention" framing true: the single-word trigger is now un-incidental, and *all other* opt-in routes are taught as natural-language phrases inside the description (see B2).
- **Why keep the telemetry event name and the attachment `type` string?** Renaming `tengu_workflow_keyword` or `workflow_keyword_request` would orphan dashboards and break the renderer/injector wiring for zero user benefit. The human-facing keyword is decoupled from the internal plumbing identifiers — a clean separation that lets the product surface change without a data-pipeline migration.
- **Why reuse `matchKeyword` unchanged?** The masking algorithm is the hard, well-tested part (it has to ignore code spans and path-glued mentions). Reusing it verbatim and only swapping the literal keeps the family of keywords (`ultracode`/`ultraplan`/`ultrareview`) consistent — they all funnel through the same `hho` (cli_inner_pretty.js:464255-464262), differing only by their literal.

**Key insight:** The rename is *almost entirely a string swap at one call site* (`"workflows?"` → `"ultracode"`) plus three prose edits — the entire detection algorithm, telemetry, and attachment plumbing are untouched. The behavioral consequence ("any mention no longer triggers") is a *side effect of choosing a non-incidental word*, not of new matching logic.

---

## B2 — The 2.1.178 "explicit-phrase" change is a description/policy edit, not a new regex

**What it does:** The 2.1.178 changelog says workflows now trigger "only on explicit phrases (e.g. *run a workflow*, *workflow:*), not on any mention of the word." This is **not** implemented as a runtime phrase-detector. It is the *combination* of (a) the renamed single-word runtime keyword from B1 and (b) an edit to the natural-language opt-in policy inside the tool description.

**How it works:**

1. `grep -nF "run a workflow"` over the v2.1.183 bundle returns hits **only inside the tool description `gdo`** (cli_inner_pretty.js:418177, and the footer at :418181). There is no `RegExp`/matcher over the strings "run a workflow" or "workflow:". The single runtime detector remains `matchKeyword(e, "ultracode")`.
2. The description's opt-in form #3 added "use a workflow" to the list of accepted natural-language asks:
   - v2.1.183 cli_inner_pretty.js:418177: `... in their own words ("use a workflow", "run a workflow", "fan out agents", "orchestrate this with subagents").`
   - v2.1.156 before-picture cli_inner_pretty.js:376084: `... in their own words ("run a workflow", "fan out agents", "orchestrate this with subagents").` — no "use a workflow".

**Why this approach:** The "explicit phrases" guarantee is enforced at the **model-policy layer** (the description teaches Claude which user phrasings count as opt-in) plus the **non-incidental keyword** layer (B1). Implementing a literal phrase regex would be brittle (every paraphrase would have to be enumerated) and redundant — the model is already the natural-language understander. The runtime only needs *one* deterministic trigger (the coined `ultracode` keyword); everything else is delegated to the model's reading of the policy.

**Key insight:** Don't look for a phrase regex in the streaming path — there isn't one. The "explicit-phrase" behavior = renamed single keyword (B1) + the description policy in `gdo`. The two phrases the changelog quotes are *examples Claude reads*, not patterns the runtime matches.

---

## B3 — Dedicated violet shimmer for the keyword highlight

**What it does:** When the user has typed the (now `ultracode`) keyword in the input box and it isn't dismissed, the matched characters get a colored shimmer. In v2.1.156 this reused the **rainbow** shimmer shared with `ultrathink`/`ultraplan`; in v2.1.183 the workflow keyword gets its own **dedicated violet/purple** shimmer so it is visually distinct from the rainbow keywords.

**How it works:**

1. The highlight-span memo `ji` (cli_inner_pretty.js:622226) computes the keyword's character spans (gated — see B4). The render loop then pushes per-character style segments.
2. v2.1.183 pushes a **fixed** color/shimmer pair for the workflow keyword, instead of the position-indexed rainbow function used by the other keywords just above it:

```javascript
// ============================================
// Workflow keyword highlight - dedicated violet shimmer (was rainbow)
// Location: cli_inner_pretty.js:622310-622313
// ============================================

// ORIGINAL (for source lookup):
if (Pw() && !WA)
  for (let an of ji)
    for (let gr = an.start; gr < an.end; gr++)
      _t.push({ start: gr, end: gr + 1, color: "autoAccept", shimmerColor: "autoAcceptShimmer", priority: 10 });

// READABLE (for understanding):
if (isWorkflowsEnabled() && !keywordDismissed)             // WA = user pressed alt+w to ignore
  for (let span of ultracodeSpans)                         // ji = yho(inputText) spans (B4-gated)
    for (let i = span.start; i < span.end; i++)
      styleSegments.push({
        start: i, end: i + 1,
        color: "autoAccept",          // rgb(135,0,255) violet  (cli_inner_pretty.js:154110)
        shimmerColor: "autoAcceptShimmer", // rgb(208,180,255)    (cli_inner_pretty.js:154111)
        priority: 10,
      });

// Mapping: Pw->isWorkflowsEnabled, WA->keywordDismissed, ji->ultracodeSpans, _t->styleSegments
```

3. The two color tokens resolve in the theme palette `FZu` (cli_inner_pretty.js:154109-154111): `autoAccept: "rgb(135,0,255)"` (violet) and `autoAcceptShimmer: "rgb(208,180,255)"` (light lavender).

**Before (v2.1.156, before-picture cli_inner_pretty.js:584763-584772):** the workflow keyword used `color: fI(n6 - b8.start), shimmerColor: fI(n6 - b8.start, !0)` — the **same `fI` rainbow function**, position-indexed, that ultrathink/ultraplan use. So in v2.1.156 the workflow keyword shimmered identically to the thinking keywords; in v2.1.183 it has its own solid violet identity.

**Why this approach:**

- **Why a dedicated color?** With three keyword families sharing one input box (`ultracode`/`ultraplan`/`ultrareview` plus `ultrathink`), reusing the rainbow for all of them made them indistinguishable. A fixed violet gives `ultracode` a recognizable signature, and violet is already this build's "power/automation" accent — it matches the `/effort ultracode` slider level, which carries `color:"violet-ripple"` (cli_inner_pretty.js:551113). The keyword highlight and the effort level now share a visual language.
- **Why a fixed color instead of a per-character function?** The rainbow `fI` exists to give a *moving* gradient; a single deterministic accent is cheaper (no per-character index math) and reads as "this is one specific mode," not "this is animated text."
- **Why the `autoAccept` token name for a workflow color?** This is shared palette reuse: `rgb(135,0,255)` is the same violet already named `autoAccept`/`skill` (cli_inner_pretty.js:154110, :154112). The token name is historical (auto-accept mode also uses violet); the workflow highlight simply points at the existing violet entry rather than defining a new one. (A small naming wart worth knowing when grepping.)

**Key insight:** The shimmer change is purely cosmetic-but-meaningful: the *spans* are computed the same way; only the per-character `{color, shimmerColor}` pushed for those spans changed from the indexed rainbow to a constant violet pair. Don't confuse this **input-box shimmer** (B3) with the **`/effort` slider's `violet-ripple` level** — the latter already existed in v2.1.156 and is a framing trap, not a delta.

---

## B4 — New `/config` setting `workflowKeywordTriggerEnabled` ("Ultracode keyword trigger")

**What it does:** A new user setting lets you turn the keyword trigger off entirely. When off, typing `ultracode` neither injects the model reminder nor shows the violet highlight. It defaults **on**, so default behavior is unchanged from v2.1.156. This setting did not exist in v2.1.156 (`grep -c workflowKeywordTriggerEnabled` over the v2.1.156 bundle = 0).

**How it works:**

1. **Reader.** `Jyn` (cli_inner_pretty.js:148797) reads `mk()?.settings.workflowKeywordTriggerEnabled ?? !0` — i.e. default true when unset.

```javascript
// ============================================
// workflowKeywordTriggerEnabled reader - the new master toggle for the keyword UX
// Location: cli_inner_pretty.js:148797-148799
// ============================================

// ORIGINAL (for source lookup):
function Jyn() {
  return mk()?.settings.workflowKeywordTriggerEnabled ?? !0;
}

// READABLE (for understanding):
function isUltracodeKeywordTriggerEnabled() {
  // Default ON: only an explicit `false` disables the trigger.
  return getEffectiveSettings()?.settings.workflowKeywordTriggerEnabled ?? true;
}

// Mapping: Jyn->isUltracodeKeywordTriggerEnabled, mk->getEffectiveSettings
```

2. **Schema.** The settings schema (cli_inner_pretty.js:56008-56012) declares it as an optional boolean with describe text: *'Enable the "ultracode" keyword trigger: including the keyword in a prompt opts that turn into the Workflow tool. Set to false to disable the trigger. Default: true.'* It sits beside the pre-existing `disableWorkflows` (cli_inner_pretty.js:55997) and `enableWorkflows` (cli_inner_pretty.js:56003).
3. **`/config` toggle.** cli_inner_pretty.js:479214-479225 renders `{id:"workflowKeywordTriggerEnabled", label:"Ultracode keyword trigger", value: n?.workflowKeywordTriggerEnabled ?? !0, type:"boolean"}`. `onChange` writes `userSettings.workflowKeywordTriggerEnabled` (storing `undefined` for on, `false` for off — so "on" means "absent/default") and fires telemetry `{ultracodeKeywordTrigger: "on"/"off"}` (cli_inner_pretty.js:479223).
4. **It gates both surfaces:**
   - **Reminder injection** (cli_inner_pretty.js:464664-464670) now has the extra `&& Jyn()` clause:

```javascript
// ============================================
// Workflow keyword reminder injection - now gated by the new setting (Jyn)
// Location: cli_inner_pretty.js:464664-464672
// ============================================

// ORIGINAL (for source lookup):
...(Pw()
  ? [
      BA("workflow_keyword_request", () =>
        Promise.resolve(
          i?.isRegularUserPrompt && !i.suppressWorkflowKeyword && Jyn() ? o4p(i.preExpansionInput ?? e) : [],
        ),
      ),
      BA("ultra_effort_enter", () => Promise.resolve(i?.isRegularUserPrompt ? s4p(o, t) : [])),
    ]
  : []),

// READABLE (for understanding):
...(isWorkflowsEnabled()
  ? [
      reminder("workflow_keyword_request", () =>
        Promise.resolve(
          // NEW &&Jyn(): the keyword reminder is suppressed when the trigger setting is off.
          prompt?.isRegularUserPrompt && !prompt.suppressWorkflowKeyword && isUltracodeKeywordTriggerEnabled()
            ? makeWorkflowKeywordReminder(prompt.preExpansionInput ?? input)
            : [],
        ),
      ),
      reminder("ultra_effort_enter", () => Promise.resolve(prompt?.isRegularUserPrompt ? makeUltraEffortReminder(steps, ctx) : [])),
    ]
  : []),

// Mapping: Pw->isWorkflowsEnabled, BA->reminder, Jyn->isUltracodeKeywordTriggerEnabled,
//          o4p->makeWorkflowKeywordReminder, s4p->makeUltraEffortReminder, i->prompt
// v2.1.156 before-picture @412713: ...&& !A.suppressWorkflowKeyword ? KR_(...) : []   (no Jyn() gate)
```

   - **Input highlight memo** (cli_inner_pretty.js:622226) now has `Pw() && Jyn()` instead of v2.1.156's bare `NZ()`:

```javascript
// ============================================
// Ultracode highlight span memo - now requires both the gate AND the setting
// Location: cli_inner_pretty.js:622226
// ============================================

// ORIGINAL (for source lookup):
ji = Fo.useMemo(() => (Pw() && Jyn() ? yho(Tf) : []), [Tf]),

// READABLE (for understanding):
ultracodeSpans = useMemo(
  () => (isWorkflowsEnabled() && isUltracodeKeywordTriggerEnabled() ? findUltracodeKeyword(inputText) : []),
  [inputText],
);

// Mapping: ji->ultracodeSpans, Pw->isWorkflowsEnabled, Jyn->isUltracodeKeywordTriggerEnabled,
//          yho->findUltracodeKeyword, Tf->inputText
// v2.1.156 before-picture @584681: o1 = useMemo(() => (NZ() ? pg6(r1) : []), [r1])   (no Jyn() gate)
```

**Why this approach:**

- **Why a setting now?** Once the keyword has its own conspicuous violet shimmer and a system reminder that hard-steers Claude into multi-agent mode, a user who never wants that behavior (or who literally works on "ultracode"-named things) needs an off switch. The `disableWorkflows`/`enableWorkflows` pair governs *whether the feature exists*; this new flag governs *whether the convenience keyword fires* — a finer grain.
- **Why gate both the reminder and the highlight with the same flag?** Consistency: it would be confusing if the violet shimmer appeared but the model wasn't actually nudged (or vice-versa). One reader (`Jyn`) feeding both keeps them in lockstep.
- **Why "on" stored as `undefined` and "off" as `false`?** Storing the default as absence (rather than literal `true`) keeps settings files minimal and lets a future default change apply to everyone who never touched the toggle. The `?? !0` in `Jyn` makes absence ≡ on.

**Key insight:** This is the one genuinely *new* control-plane component in the delta. It does not touch detection or runtime — it is a single boolean read (`Jyn`) inserted as an extra `&&` at exactly the two user-facing surfaces (reminder injection + highlight memo), leaving the matcher, telemetry, and tool dispatch untouched.

---

## B5 — Determinism check rewritten: regex → AST walk

**What it does:** `validateInput` rejects a script that calls `Date.now()`, `Math.random()`, or argless `new Date()` (errorCode 4) because those break journal-replay resume. v2.1.156 detected them with a raw regex over the script body — which also matched those tokens **inside string literals and comments**, causing false rejections. v2.1.183 parses the script with Acorn and walks the AST, flagging only *real* member/new expressions.

**How it works (step by step):**

1. `rWa` (cli_inner_pretty.js:416439) parses the body with Acorn (`xjn()`) at `ecmaVersion:"latest"`, `sourceType:"module"`, allowing top-level await/return (the workflow body runs in an async IIFE).
2. It walks with `acorn-walk` (`ido()`), visiting two node types:
   - **`MemberExpression`** — flags `Date.now` and `Math.random`, but only when both object and property are plain (non-computed) `Identifier`s. So `obj["now"]` or a `now` property on something other than `Date` is *not* flagged.
   - **`NewExpression`** — flags `new Date` **only when `arguments.length === 0`** (argless). `new Date(args.ts)` is allowed (deterministic — the timestamp comes in via `args`).
3. A parse error is swallowed (`catch { return !1 }`) — i.e. an unparseable body is *not* treated as a determinism violation here (the syntax error is surfaced separately by the `m0` parser at errorCode 2).
4. It is invoked as `e.script && rWa(r.scriptBody)` at cli_inner_pretty.js:419461 — note it only runs for **inline `script`** input (not `name`/`scriptPath`), matching v2.1.156's `H.script && ...` guard.

```javascript
// ============================================
// determinismCheck (AST walk) - the regex-free Date.now/Math.random/new Date() ban
// Location: cli_inner_pretty.js:416439-416465
// ============================================

// ORIGINAL (for source lookup):
function rWa(e) {
  let { parse: t } = xjn(), n = ido(), r = !1;
  try {
    let o = t(e, { ecmaVersion: "latest", sourceType: "module", allowAwaitOutsideFunction: !0, allowReturnOutsideFunction: !0 });
    n.simple(o, {
      MemberExpression(s) {
        if (s.computed || s.object.type !== "Identifier" || s.property.type !== "Identifier") return;
        let i = s.object.name, a = s.property.name;
        if ((i === "Date" && a === "now") || (i === "Math" && a === "random")) r = !0;
      },
      NewExpression(s) {
        if (s.callee.type === "Identifier" && s.callee.name === "Date" && s.arguments.length === 0) r = !0;
      },
    });
  } catch { return !1; }
  return r;
}

// READABLE (for understanding):
function isNonDeterministic(scriptBody) {
  const { parse } = getAcorn();
  const walk = getAcornWalk();
  let found = false;
  try {
    const ast = parse(scriptBody, {
      ecmaVersion: "latest", sourceType: "module",
      allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true,
    });
    walk.simple(ast, {
      MemberExpression(node) {
        // only literal `Date.now` / `Math.random`, never inside strings/comments,
        // never computed (`Date["now"]`).
        if (node.computed || node.object.type !== "Identifier" || node.property.type !== "Identifier") return;
        const objName = node.object.name, propName = node.property.name;
        if ((objName === "Date" && propName === "now") || (objName === "Math" && propName === "random")) found = true;
      },
      NewExpression(node) {
        // only argless `new Date()`; `new Date(args.ts)` is deterministic and allowed.
        if (node.callee.type === "Identifier" && node.callee.name === "Date" && node.arguments.length === 0) found = true;
      },
    });
  } catch { return false; }   // unparseable body is handled by m0 (errorCode 2), not here
  return found;
}

// Mapping: rWa->isNonDeterministic, xjn->getAcorn, ido->getAcornWalk, e->scriptBody, r->found
```

**Before (v2.1.156, before-picture cli_inner_pretty.js:378256):**
```javascript
if (H.script && /\bDate\s*\.\s*now\b|\bMath\s*\.\s*random\b|\bnew\s+Date\s*\(\s*\)/.test(K.scriptBody)) ... errorCode 4
```
That regex matched the *characters* `Date.now()` anywhere — including a prompt string like `agent("explain how Date.now() works")` or a `// uses Math.random` comment — and wrongly rejected the whole workflow. The error message wording is **unchanged**; only the detection mechanism changed.

**Why this approach:**

- **Why AST over regex?** A regex sees text, not structure. The false-positive class here is *real and common*: workflow authors routinely *mention* these APIs in prompts/comments (often to tell a subagent "don't use Date.now"). An AST walk distinguishes a *mention* (string/comment token) from a *use* (a `MemberExpression`/`NewExpression` node), eliminating the false rejection without weakening the ban on real uses.
- **Why the `computed` / `Identifier` guards?** They keep the check precise: it should not flag `Date["now"]` differently than its purpose requires, and it must not crash on member expressions whose object/property aren't simple identifiers. The narrow match means *only* the exact two member forms and argless `new Date` trip it.
- **Why still allow `new Date(arg)`?** Determinism only breaks when the value is *implicit time/randomness*. A date built from an `args`-supplied timestamp is fully reproducible on replay, so it's intentionally permitted — the workflow author is told to "pass timestamps in via args" (description cli_inner_pretty.js:418228).
- **Trade-off:** the AST walk costs a full Acorn parse of the body. But the body is already parsed once by `m0` for `meta` extraction, and the cap is 512 KiB, so the extra parse is cheap relative to launching a background VM run. The correctness win (no false errorCode-4 rejections) dwarfs the cost.

**Key insight:** This is the validateInput *static* check, which is **separate** from the runtime determinism *sandbox* (the VM shim that makes `Math.random`/`Date.now`/`new Date()` actually throw at execution time). The runtime sandbox is unchanged — see the baseline runtime doc §E. The AST rewrite only fixes the *pre-launch* gate's false positives.

---

## B6 — Per-agent attribution context on subagent spawn

**What it does:** When a workflow spawns a subagent, v2.1.183 now passes a full **agent-context object** carrying the agent's identity, its parent, its depth, and the parent session — so each subagent's transcript/streaming output can be attributed (per-agent headers). v2.1.156 passed only the bare `agentId`, leaving subagents without that parent/depth/session identity.

**How it works:**

1. Inside the per-agent spawn closure (`Tt`, cli_inner_pretty.js:417149), the runtime builds the context object `Dt` (cli_inner_pretty.js:417152-417160):

```javascript
// ============================================
// Per-agent attribution context (Dt) - carried on workflow subagent spawn
// Location: cli_inner_pretty.js:417152-417160, spawn @417250
// ============================================

// ORIGINAL (for source lookup):
let Dt = {
    agentId: dt,
    parentAgentId: jz(ue) ? void 0 : ue?.agentId,
    depth: Gz(ue) + 1,
    parentSessionId: a4(),
    agentType: "subagent",
    subagentName: pe.agentType,
    isBuiltIn: ay(pe),
  },
  // ... later, on spawn:
  override: { agentId: dt, agentContext: Dt },

// READABLE (for understanding):
let agentContext = {
    agentId: newAgentId,                                  // dt = freshly minted id (dM())
    parentAgentId: isRootContext(parentCtx) ? undefined : parentCtx?.agentId,  // jz()=is-root guard
    depth: contextDepth(parentCtx) + 1,                  // Gz()=current depth
    parentSessionId: currentSessionId(),                 // a4()
    agentType: "subagent",
    subagentName: agentDef.agentType,                    // pe = chosen subagent def (nLp/ddo)
    isBuiltIn: isBuiltInAgentDef(agentDef),              // ay()
  };
// ... passed to the subagent query:
override: { agentId: newAgentId, agentContext };

// Mapping: Dt->agentContext, dt->newAgentId, ue->parentCtx, pe->agentDef,
//          jz->isRootContext, Gz->contextDepth, a4->currentSessionId, ay->isBuiltInAgentDef
// v2.1.156 before-picture @375257: override: { agentId: eH }   (no agentContext)
```

2. The spawn call (cli_inner_pretty.js:417250) sets `override: { agentId: dt, agentContext: Dt }`. The surrounding plumbing — `transcriptSubdir: r ? `workflows/${r}` : void 0` (cli_inner_pretty.js:417248) and `spawnedByWorkflowRunId: r` (cli_inner_pretty.js:417249) — is **unchanged** from v2.1.156 (before-picture cli_inner_pretty.js:375255-375256). Only the `override` object grew the `agentContext` field.

**Before (v2.1.156, before-picture cli_inner_pretty.js:375257):** `override: { agentId: eH }` — just the id, no parent/depth/session/subagentName. Without those, the streaming layer couldn't render per-agent attribution headers (which subagent produced which output, at what depth, under which parent), the symptom the 2.1.174 fix targets.

**Why this approach:**

- **Why pass the whole context, not just the id?** A bare `agentId` is an opaque token — the consumer can't render a useful header ("subagent *code-reviewer* at depth 2 under parent X") without the parent/depth/name fields. Bundling them at spawn time means the streaming/transcript layer receives the attribution data inline, rather than having to look it up (and there's no reliable place to look it up from for a backgrounded workflow agent).
- **Why compute `parentAgentId` with an is-root guard (`jz(ue)?void 0:...`)?** The top-level workflow context is the root; its agents have no meaningful parent agent (the parent is the main loop, not another agent), so `parentAgentId` is `undefined` there. Nested workflow agents (one level deep) get a real parent id. This keeps the attribution tree well-formed.
- **Why `depth: Gz(ue)+1`?** Workflows can nest one level (a `workflow()` call inside a workflow). Recording depth lets the UI indent/group nested-workflow agents correctly.

**Key insight:** This is a *one-field* spawn-payload addition that supplies the identity a transcript renderer needs. The *cause* of the missing attribution headers (no context on spawn) is high-confidence; the *exact render site* that consumes `agentContext`/`subagentName` lives in the streaming/transcript layer and was **not fully traced** — carried as an open item (see [§ Open questions](#open-questions--lowmedium-confidence-carried-from-the-dossier)).

---

## B7 — `/workflows` opens immediately

**What it does:** The `/workflows` slash command (the live/completed workflow browser) now opens right away instead of waiting for the in-progress turn to settle, and its one-line description was reworded.

**How it works:**

```javascript
// ============================================
// /workflows slash command - now immediate, reworded description
// Location: cli_inner_pretty.js:562632-562641
// ============================================

// ORIGINAL (for source lookup):
((jmf = {
  type: "local-jsx",
  name: "workflows",
  aliases: [],
  description: "Browse running and completed workflows",
  isEnabled: () => Pw(),
  immediate: !0,
  load: () => Promise.resolve().then(() => (CPl(), wPl)),
}),
  (Gmf = jmf));

// READABLE (for understanding):
workflowsCommand = {
  type: "local-jsx",
  name: "workflows",
  aliases: [],
  description: "Browse running and completed workflows",
  isEnabled: () => isWorkflowsEnabled(),
  immediate: true,                 // NEW: opens without waiting for the current turn to settle
  load: () => lazyLoadWorkflowsViewer(),
};

// Mapping: jmf/Gmf->workflowsCommand, Pw->isWorkflowsEnabled
// v2.1.156 before-picture @538934: Pjz = { ... description: "Browse dynamic workflow history (running and completed)", isEnabled: () => NZ(), load: ... }  (NO immediate flag)
```

**Before (v2.1.156, before-picture cli_inner_pretty.js:538934-538941):** `Pjz` had **no** `immediate` flag and described itself as `"Browse dynamic workflow history (running and completed)"`.

**Why this approach:** `/workflows` is a read-only viewer — there's no reason to defer it behind the current turn's completion. Because workflows run in the background, a user typically invokes `/workflows` *during* a busy turn precisely to watch live progress; deferring the panel until the turn settles defeats the purpose. The `immediate:!0` flag (a generic slash-command property) lets the local-jsx panel mount instantly. The description reword ("Browse running and completed workflows") is cosmetic — slightly shorter and drops the now-unnecessary "dynamic … history" framing.

**Key insight:** A two-line change (`immediate:!0` + a string) with an outsized UX effect for a background-feature viewer: you can pop the panel mid-run instead of waiting.

---

## B8 — Tool-definition hardening: errorCode 7, new output fields, per-agent `effort`

Three independent robustness additions to the tool object, all in the same `validateInput`/schema/`agent()`-DSL neighborhood.

### B8a — errorCode 7: server-fallback retraction

**What it does:** Before doing any validation work, `validateInput` now checks whether the tool call's abort signal was tripped by a *server fallback* — i.e. the model server retracted/re-dispatched the tool call (its input may be truncated). If so it returns a dedicated retraction result with `errorCode: 7`, short-circuiting the expensive source-resolution and parse.

**How it works:**

```javascript
// ============================================
// validateInput abort/retraction guard - new errorCode 7 pre-check (and mid-check)
// Location: cli_inner_pretty.js:419415-419419 (r5a), :419442 + :419457 (checks)
// ============================================

// ORIGINAL (for source lookup):
r5a = { result: !1, message: "Tool dispatch was retracted by a server fallback; the input may be truncated.", errorCode: 7 };
// ... inside validateInput:
async validateInput(e, t) {
  if (zCe(t.abortController.signal)) return r5a;        // pre-check before any work
  if (Kyn()) return { result: !1, message: "Dynamic workflows are disabled by managed settings (`disableWorkflows`).", errorCode: 5 };
  if (!Pw())  return { result: !1, message: 'Dynamic workflows are not enabled for this session ...', errorCode: 6 };
  let n = await n5a(e);
  if (zCe(t.abortController.signal)) return r5a;        // re-check after source resolution
  ...
}

// READABLE (for understanding):
const serverFallbackRetraction = {
  result: false,
  message: "Tool dispatch was retracted by a server fallback; the input may be truncated.",
  errorCode: 7,
};
async validateInput(input, ctx) {
  if (abortedByServerFallback(ctx.abortController.signal)) return serverFallbackRetraction;  // bail early
  if (isWorkflowsManagedDisabled()) return { result: false, ..., errorCode: 5 };
  if (!isWorkflowsEnabled())        return { result: false, ..., errorCode: 6 };
  const source = await resolveWorkflowSource(input);
  if (abortedByServerFallback(ctx.abortController.signal)) return serverFallbackRetraction;  // re-check (resolveWorkflowSource can await I/O)
  ...
}

// Mapping: r5a->serverFallbackRetraction, zCe->abortedByServerFallback, Kyn->isWorkflowsManagedDisabled,
//          Pw->isWorkflowsEnabled, n5a->resolveWorkflowSource
// zCe (cli_inner_pretty.js:227026) = signal.aborted && reason === <server-fallback reason sentinel Hqr>
// v2.1.156 before-picture @378238: validateInput started directly with H48() (errorCode 5) — NO abort pre-check.
```

`zCe` (cli_inner_pretty.js:227026) returns `e.aborted && uMt(e.reason) === Hqr` — it is specifically the *server-fallback* abort reason, not any abort. The check appears **twice**: once at the very top (cli_inner_pretty.js:419442) and again after `resolveWorkflowSource` (cli_inner_pretty.js:419457), because source resolution can `await` file/registry I/O during which the fallback may fire.

**Before (v2.1.156):** the Workflow `validateInput` had errorCodes 1–6 only and *no* abort-signal pre-check (before-picture cli_inner_pretty.js:378238 started straight at `H48()`/errorCode 5). errorCode 7 existed in v2.1.156 for *other* tools (e.g. NotebookEdit) — this delta brings the same retraction convention to Workflow.

**Why this approach:** When the server retracts a tool dispatch via a fallback, the tool input the client holds may be truncated/partial. Validating or *launching a background workflow* on truncated input would be wasteful and possibly wrong (a half-script). Detecting the specific server-fallback abort reason and returning a clean `errorCode 7` lets the dispatch unwind cleanly instead of erroring on a malformed parse. Checking twice (before and after the only `await` that can race) is defense-in-depth against the fallback landing mid-resolution. Reusing the existing errorCode-7 convention keeps tool-result handling uniform across tools.

### B8b — Output schema gains `taskType` and `workflowName`

**What it does:** The Workflow output schema (`workflowOutputSchema`, obfuscated: `ILp`, cli_inner_pretty.js:419372) added two optional, self-documenting fields: `taskType` (`"local_workflow"` | `"remote_agent"`) and `workflowName` (the `meta.name` echo).

**How it works:** cli_inner_pretty.js:419376-419385 adds:
- `taskType: H.enum(["local_workflow","remote_agent"]).optional()` — *"TaskType of the registered background task … Set on all new writes; absent only on transcripts written before this field existed."*
- `workflowName: H.string().optional()` — *"meta.name from the workflow script — same value as task_started.workflow_name."*

**Before (v2.1.156, before-picture cli_inner_pretty.js:378186-378216):** the output schema had `status`/`taskId`/`runId`/`summary`/`transcriptDir`/`scriptPath`/`sessionUrl`/`warning`/`error` — but **neither** `taskType` nor `workflowName`.

**Why this approach:** Both fields make the tool result self-describing for downstream consumers (transcript replay, `/workflows` viewer, analytics) without forcing a separate lookup into the task registry. The describe text's "absent only on transcripts written before this field existed" pattern is the standard additive-schema migration story: old transcripts simply lack the field, new writes always include it. Making them `.optional()` keeps the schema backward-compatible.

A minor adjacent reword: the `warning` describe text changed *"…the pushed branch the **remote** session will clone"* (v2.1.156, before-picture cli_inner_pretty.js:378212) → *"…the **cloud** session will clone"* (v2.1.183 cli_inner_pretty.js:419404) — terminology drift "remote" → "cloud", no behavior change.

### B8c — Per-agent `effort` opt in the `agent()` DSL

**What it does:** A workflow script can now set `effort` per `agent()` call, overriding the reasoning effort for just that subagent (e.g. cheap `low` for mechanical stages, `xhigh`/`max` for the hardest verify/judge stages).

**How it works:**
- **Description** (cli_inner_pretty.js:418215) documents the new opt: `agent(prompt, opts?: { … effort?: string, isolation?: 'worktree', agentType?: string})`, with guidance: *"opts.effort overrides the reasoning effort for this agent call ('low' | 'medium' | 'high' | 'xhigh' | 'max') — omit to inherit the session effort; use 'low' for cheap mechanical stages and higher tiers only for the hardest verify/judge stages."*
- **Runtime** (cli_inner_pretty.js:417123) reads it: `le = rB(re?.effort)`, then merges it into the chosen agent def: `pe = le !== void 0 ? { ...se, effort: le } : se` (cli_inner_pretty.js:417124). `rB` (cli_inner_pretty.js:148923) is the effort normalizer — it accepts the string levels (and numeric forms), mapping aliases and rejecting unknowns by returning `undefined` (so a bad value silently inherits the session effort).

```javascript
// ============================================
// agent() per-call effort opt - normalize and merge into the chosen subagent def
// Location: cli_inner_pretty.js:417122-417124
// ============================================

// ORIGINAL (for source lookup):
let se = ae ?? (ge ? nLp : ddo),
  le = rB(re?.effort),
  pe = le !== void 0 ? { ...se, effort: le } : se,

// READABLE (for understanding):
let baseAgentDef = customAgentDef ?? (hasSchema ? structuredOutputSubagentDef : plainSubagentDef),
  resolvedEffort = normalizeEffort(opts?.effort),         // rB: maps aliases, returns undefined for unknown
  agentDef = resolvedEffort !== undefined
    ? { ...baseAgentDef, effort: resolvedEffort }          // override just this agent's effort
    : baseAgentDef;                                        // else inherit session effort

// Mapping: se/pe->agentDef, ae->customAgentDef, ge->hasSchema, nLp->structuredOutputSubagentDef,
//          ddo->plainSubagentDef, le->resolvedEffort, rB->normalizeEffort, re->opts
// v2.1.156 before-picture: agent() signature @376122 listed {label,phase,schema,model,isolation,agentType} — NO effort.
```

**Before (v2.1.156, before-picture cli_inner_pretty.js:376122):** the `agent()` signature in the description was `{label?, phase?, schema?, model?, isolation?, agentType?}` — **no `effort`** — and the runtime did not read `re?.effort`.

**Why this approach:** Effort is the biggest cost/quality lever per call. Letting the workflow author dial it per stage (cheap scouts, expensive judges) gives fine cost control that a single session-wide effort can't. Normalizing through `rB` (which returns `undefined` for unrecognized values) makes the opt fail-safe: a typo'd effort silently inherits the session default rather than erroring the whole workflow. Merging via spread (`{ ...se, effort: le }`) preserves all other properties of the chosen subagent def (plain vs StructuredOutput vs custom) while overriding only the effort.

**Key insight:** The three B8 items are independent but share a theme — making the tool *more robust and more expressive at the call boundary*: B8a hardens the dispatch unwind, B8b makes the result self-describing, B8c gives the script author per-agent cost control. None of them touch the runtime VM, the journal, or the caps.

---

## Carryover map — link the baseline for the unchanged spine

Everything below is **structurally identical** to v2.1.156. Do not re-derive it; read the cited baseline section. (Obfuscated names are re-derived for v2.1.183 where useful, but the *logic* is the same.)

| Unchanged subsystem | v2.1.183 anchor (logic-equivalent) | Baseline to read |
|---|---|---|
| 4-layer enablement gate (`isWorkflowsEnabled`/managed-disabled/policy/availability/user-setting) | `Pw` :148784, `Kyn` :148777, `aAi` :148800, `tNr`/`HJu` :148806/:148810, `EJu` :148803 | [`gate_caps_lifecycle_relations.md` Part 1](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md) (§1.1–1.2) |
| `/effort ultracode` xhigh-gating (FRAMING TRAP — pre-existing) | `T4` :148898, `hTe` :148878, `eZ` :148901, downgrade `ZQ` :148967 | [`gate_caps_lifecycle_relations.md` Part 6](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md) (§6.1–6.2) |
| VM runtime / DSL semantics (`agent()` per-call pipeline, true `parallel()` barrier vs `pipeline()` flow, `phase()`/`log()`, nested `workflow()` one-level, frozen `budget`) | runtime body cli_inner_pretty.js:416988+ | [`workflow_runtime_and_subagents.md` §A–D](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_runtime_and_subagents.md) |
| Runtime determinism *sandbox* (the VM shim that makes `Math.random`/`Date.now`/`new Date()` *throw at runtime*) — distinct from B5's pre-launch check | runtime shim (unchanged) | [`workflow_runtime_and_subagents.md` §E](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_runtime_and_subagents.md) |
| Caps: agent `_Wa=1000`, stall `rLp=180000`, remote `X0p=50`, retry `gWa=5`, concurrency `K0p=min(16,max(2,cores-2))`, script `A2=524288`, preview `AWa=400` | :417718, :417739, :417717, :417740, :416892, :152140, :417722 | [`gate_caps_lifecycle_relations.md` Part 3](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md) (§3.1–3.4) |
| Journal / resume protocol (`journal.jsonl`, SHA-256 cache key, longest-unchanged-prefix replay, respawn detection, snapshot) | journal subsystem (unchanged) | [`gate_caps_lifecycle_relations.md` Part 4](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md) (§4.1–4.7) |
| `meta` AST parser (`parseWorkflowMeta` first-statement rule, pure-literal eval, prototype-pollution key ban) | `m0` :416466 | [`workflow_tool_definition.md` §5](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md) |
| `resolveWorkflowSource` precedence (scriptPath > name > script), UNC rejection (`r0t`), 512 KiB cap, fire-and-forget persist | `n5a` (:419456), `r0t` (:419492), `A2` :152140 | [`workflow_tool_definition.md` §6, §8](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md) |
| `checkPermissions` ask-by-default + name-scoped allow-suggestion | `DLp.checkPermissions` :419479 (`Vte` rule lookup :419482) | [`workflow_tool_definition.md` §7](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md) |
| First-use consent (usage warning, ultracode-implies-consent short-circuit) | consent subsystem (unchanged) | [`gate_caps_lifecycle_relations.md` Part 2.5](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md) |
| Subagent system prompts (plain `Q0p` :417723, StructuredOutput `tLp` :417804) + StructuredOutput forcing/nudge | defs `ddo` :417811, `nLp` :417820 | [`workflow_runtime_and_subagents.md` §F](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_runtime_and_subagents.md) |
| `worktree` as the only advertised isolation (`'remote'` still throws) | description `aLp="'worktree'"` :418164 | [`workflow_authoring_and_orchestration.md`](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_authoring_and_orchestration.md) |
| Coordinator's NZ-gated Workflow clause | coordinator integration (unchanged) | [`gate_caps_lifecycle_relations.md` Part 7](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md) |
| **NEW-post-2.1.88 verdict** (GA'd 2.1.154 — already established) | n/a | [baseline `README.md` TL;DR](../../../claude_code_v_2.1.156/analyze/42_workflow/README.md) |

---

## Open questions / low-medium-confidence (carried from the dossier)

1. **2.1.161 bg-worktree edit fix — medium confidence on the exact diff site.** The changelog notes that workflow agents using `isolation:"worktree"` inside background sessions were blocked from editing their own worktree. The worktree plumbing is confirmed present: spawn injects the worktree system-prompt suffix (cli_inner_pretty.js:417137-417143) and passes `worktreePath: Ce` on spawn (cli_inner_pretty.js:417253). The exact one-line permission-routing change that unblocked the bg-session edit (likely in the write-permission *root resolution* that now includes `worktreePath`) was **not isolated** to a precise line. Treat the fix as "lives in this plumbing"; a focused permission-context comparison is needed to pin the exact site.
2. **B6 attribution-header *render* unconfirmed.** The *cause* (missing `agentContext` on spawn) is high-confidence and the new `Dt` object is verified. But the *consumer* — where `agentContext`/`subagentName` becomes a visible per-agent header in the streaming/transcript layer — was **not fully traced**. The fix's seat (the spawn payload) is solid; the render site is the open piece.
3. **Description body full diff.** The tool description `gdo` (cli_inner_pretty.js:418170-~418320) is ~150 lines; the load-bearing opt-in/keyword/`agent()`-signature parts were diffed line-by-line (B1, B2, B8c). Small wording tweaks elsewhere in the pattern catalog (the Understand/Design/Review/Research/Migrate patterns and the adversarial-verify/judge-panel/loop-until-dry catalog) may exist and are **low-impact**; a full text diff during a deeper pass would catch any.

---

## Reading order

1. **This README** — the delta index + carryover map. Internalize that the machine is unchanged and only the seven deltas + two framing traps differ.
2. For any unchanged subsystem, jump straight to the linked **v2.1.156 baseline** section in the [carryover map](#carryover-map-link-the-baseline-for-the-unchanged-spine) — that is the authoritative description; this delta tree does not re-document it.
3. For the keyword UX delta (B1–B4), read the snippets here top-to-bottom: matcher → reminder → shimmer → the `Jyn` setting that gates both. The framing-trap analysis (B2) is essential to avoid hunting for a phrase regex that doesn't exist.
4. For the tool-definition/runtime fixes (B5–B8), the order is: determinism AST walk (B5) → attribution context (B6) → `/workflows` immediate (B7) → tool hardening (B8a errorCode 7 / B8b output fields / B8c per-agent effort).

For cross-cutting context: the **`local_workflow` task type** and background-task plumbing the launch rides on are in `36_background_agents/`; **Opus 4.8 + effort** (which `ultracode`'s `xhigh` depends on) is in the model module.

---

## Related Symbols

> Symbol mappings live in the central index and the per-feature additions file (never as tables in module docs):
> - [symbol_additions_v2_1_183_workflow.md](../00_overview/symbol_additions_v2_1_183_workflow.md) — **All re-derived v2.1.183 Workflow symbols for this delta** (the comprehensive table; add new rows there).
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (Workflows is the home module; Plan, Hooks, Skills, Compact, Todo, Thinking, Steering, CLI).
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (the `pi` tool factory the Workflow tool is built from; subagent spawn).
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (`Vte` permission-rule lookup, settings schema, effort resolution `ZQ`/`hTe`).
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (the `/config` UI, `/workflows` slash command, input-box highlight UI).

Key functions in this delta doc (re-derived v2.1.183 names):

- `isWorkflowsEnabled` (`Pw`, cli_inner_pretty.js:148784) — 4-layer master gate (logic-equivalent to v2.1.156 `NZ`).
- `isUltracodeKeywordTriggerEnabled` (`Jyn`, cli_inner_pretty.js:148797) — **NEW** setting reader; gates both reminder + highlight.
- `matchKeyword` (`hho`, cli_inner_pretty.js:464214) — code-span-masking keyword matcher (unchanged from v2.1.156 `Bg6`).
- `findUltracodeKeyword` (`yho`, cli_inner_pretty.js:464261) / `hasUltracodeKeyword` (`Qel`, cli_inner_pretty.js:464267) — the renamed `"ultracode"` matcher (was `pg6`/`lj4` on `"workflows?"`).
- `makeWorkflowKeywordReminder` (`o4p`, cli_inner_pretty.js:464869) — emits `tengu_workflow_keyword` + `workflow_keyword_request` (names unchanged).
- `WORKFLOW_DESCRIPTION` (`gdo`, cli_inner_pretty.js:418170) — the opt-in policy + DSL reference prompt (B1/B2/B8c edits).
- `isNonDeterministic` (`rWa`, cli_inner_pretty.js:416439) — **NEW** AST-walk determinism check (was an inline regex).
- `parseWorkflowMeta` (`m0`, cli_inner_pretty.js:416466) — `meta` AST parser + body splitter (unchanged from v2.1.156 `FZ`).
- `workflowTool` (`DLp`, cli_inner_pretty.js:419420) — the tool object (`validateInput` gained errorCode 7; output schema gained `taskType`/`workflowName`).
- `serverFallbackRetraction` (`r5a`, cli_inner_pretty.js:419415) / `abortedByServerFallback` (`zCe`, cli_inner_pretty.js:227026) — **NEW** errorCode-7 retraction result + its abort-reason predicate.
- `workflowInputSchema` (`CLp`, cli_inner_pretty.js:419334) / `workflowOutputSchema` (`ILp`, cli_inner_pretty.js:419372) — Zod schemas (output gained two fields).
- `agentContext` (`Dt`, cli_inner_pretty.js:417152) — **NEW** per-agent attribution object on subagent spawn (`override:{agentId,agentContext}`).
- `normalizeEffort` (`rB`, cli_inner_pretty.js:148923) — effort normalizer used for the new per-agent `effort` opt.
- `workflowsCommand` (`jmf`/`Gmf`, cli_inner_pretty.js:562632) — `/workflows` slash command, now `immediate:!0`.
- `isUltracodeOption` (`T4`, cli_inner_pretty.js:148898) / `supportsXhighEffort` (`hTe`, cli_inner_pretty.js:148878) / `resolveEffort` (`ZQ`, cli_inner_pretty.js:148967) — `/effort ultracode` xhigh-gating (FRAMING TRAP — pre-existing in v2.1.156 as `Vx`/`ycH`/`or`).
