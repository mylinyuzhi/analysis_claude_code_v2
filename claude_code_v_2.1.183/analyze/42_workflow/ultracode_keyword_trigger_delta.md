# Workflow Keyword Trigger — `workflow(s)` → `ultracode` (v2.1.156 → v2.1.183)

> **Delta tree.** This document covers only what changed in the **keyword-trigger UX** of the Workflow subsystem between v2.1.156 and v2.1.183. Every citation below is `cli_inner_pretty.js:<line>` in the **v2.1.183** bundle (`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`) unless explicitly tagged `(v2.1.156 before)` or `(v2.1.88)`. The *unchanged* keyword machinery — the code-span-masking matcher, the `preExpansionInput` rule, the first-use consent layer, the runtime caps, the journal/resume, the VM runtime — is documented in the v2.1.156 baseline and is **linked, not re-derived**:
> - [`gate_caps_lifecycle_relations.md` Part 2](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md) — keyword opt-in, reminder, dismiss/restore, consent (the unchanged spine this delta sits on top of).
> - [`workflow_tool_definition.md`](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md) — the tool description and its opt-in catalog.
> - [`README.md`](../../../claude_code_v_2.1.156/analyze/42_workflow/README.md) — the NEW-post-2.1.88 verdict (GA'd 2.1.154); not re-derived here.

---

## 0. Why this is the headline delta

The Workflow subsystem is **structurally frozen** v2.1.156 → v2.1.183: same 4-layer enablement gate, same VM runtime, same caps (1000 agents, 180 s stall, `min(16,cores−2)` concurrency), same journal/resume, same `meta` AST parser, same subagent prompts (see the dossier §C and the baseline). What moved is the **keyword-trigger UX** — the single most user-visible change in the whole subsystem:

1. **The per-turn trigger keyword was renamed `workflow`/`workflows` → `ultracode`** (changelog 2.1.160). The runtime detector switched from `Bg6(text,"workflows?")` to `hho(text,"ultracode")`, and the three human-facing surfaces that mention the keyword (the model-facing system-reminder, the tool description, the toast) all switched to "ultracode".
2. **A dedicated violet shimmer** replaced the shared rainbow shimmer on the highlighted keyword.
3. **A new `/config` setting** `workflowKeywordTriggerEnabled` (default `true`) was added, gating *both* the model-facing reminder and the input highlight behind `Jyn()`.

The detector's **internals are byte-identical** to v2.1.156 — only the keyword string and the rendered surfaces changed. The telemetry event names (`tengu_workflow_keyword`, `..._dismissed`, `..._restored`) and the reminder *type* string (`workflow_keyword_request`) are **unchanged**, which is the tell that this is a rename of the user-facing keyword, not a re-architecture.

This doc also resolves the **B2 framing trap** the changelog invites: the 2.1.178 "triggers only on explicit phrases like *run a workflow* / *workflow:*" line is a **model-facing description/policy edit**, not a new runtime regex. There is no runtime detector for those phrases — `grep` proves the only place those strings live is inside the tool description.

---

## 1. Runtime matcher: `Bg6(…,"workflows?")` → `hho(…,"ultracode")`

### What it does

A single generic matcher scans the raw user prompt for a bare keyword while *masking out* code-like spans (backticks, quotes, brackets, angle tags, paths) so that a keyword written inside `` `workflow.yml` `` or `<workflow>` or `path/to/ultracode` does **not** trigger. v2.1.156 applied that matcher to the regex `workflows?` (matching both "workflow" and "workflows"); v2.1.183 applies the *same* matcher to the literal `ultracode`.

### The generic matcher is unchanged

`matchKeyword` (obfuscated: `hho`, cli_inner_pretty.js:464214-464253) is byte-for-byte the same code-span-masking algorithm as v2.1.156's `Bg6` (cli_inner_pretty.js:412125-412165 in the v2.1.156 bundle). The masking pass walks the string building a list of delimiter spans from `Yel` (the delimiter map), then a second `\b<kw>\b` regex pass drops any match whose index falls inside a masked span or is glued to a path char (`/`, `\`, `-`, `?`). The full algorithm and the contraction-handling subtlety are analyzed in the baseline ([`gate_caps_lifecycle_relations.md` §2.2](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md)); it is **not** re-derived here because nothing inside `hho`/`Yel` changed.

What changed is the **wrapper that picks the keyword**:

```javascript
// ============================================
// findUltracodeKeyword / hasUltracodeKeyword - v2.1.183 keyword wrappers
// Location: cli_inner_pretty.js:464255-464268
// ============================================

// ORIGINAL (for source lookup):
function zWn(e) { return hho(e, "ultraplan"); }
function Xel(e) { return hho(e, "ultrareview"); }
function yho(e) { return hho(e, "ultracode"); }
function Jel(e) { return zWn(e).length > 0; }
function Qel(e) { return yho(e).length > 0; }

// READABLE (for understanding):
function findUltraplanKeyword(text)   { return matchKeyword(text, "ultraplan"); }
function findUltrareviewKeyword(text) { return matchKeyword(text, "ultrareview"); }
function findUltracodeKeyword(text)   { return matchKeyword(text, "ultracode"); }   // <- was "workflows?"
function hasUltraplanKeyword(text)    { return findUltraplanKeyword(text).length > 0; }
function hasUltracodeKeyword(text)    { return findUltracodeKeyword(text).length > 0; }

// Mapping: hho→matchKeyword, yho→findUltracodeKeyword, Qel→hasUltracodeKeyword,
//          zWn→findUltraplanKeyword, Xel→findUltrareviewKeyword, Jel→hasUltraplanKeyword
```

The v2.1.156 before-picture (read directly in the v2.1.156 bundle):

```javascript
// ORIGINAL (v2.1.156 before) — cli_inner_pretty.js:412172-412180:
function pg6(H) { return Bg6(H, "workflows?"); }   // <- the old workflow keyword
function lj4(H) { return pg6(H).length > 0; }
```

### Why the keyword changed

**What it does:** The keyword is the *cheapest* per-turn opt-in into a tool that can spawn up to 1000 agents and burn a "large amount of tokens" (the tool description's words). The matcher fires on every regular user prompt to inject a model-facing reminder + a UI highlight.

**Why rename `workflows?` → `ultracode`:** The word "workflow" is a *common English noun*. A user describing their CI pipeline ("our deploy workflow is flaky") would routinely trip the detector, get a shimmer + toast, and risk the model inferring an opt-in it never made. The v2.1.156 design papered over this with a per-prompt `alt+w` dismiss and a separate `suppressWorkflowKeyword` flag (baseline §2.4) — i.e. it accepted the false-positive rate and made it cheap to ignore. v2.1.160's fix is structural: switch the trigger to a **coined word nobody types incidentally** (`ultracode`), the same family as the already-coined `ultraplan`/`ultrareview`/`ultrathink` keywords. That collapses the false-positive surface to ~zero *without* touching the matcher.

**Key insight:** This is why the changelog's 2.1.178 line ("triggers only on explicit phrases, not any mention") is *true in effect* yet involves **no new phrase-matching code** — the moment the literal keyword became `ultracode`, "any mention of workflow" simply stopped matching because the runtime no longer looks for "workflow" at all. The behavior change is entirely a consequence of the renamed single-word keyword plus the description rewrite (§5), not a new regex.

---

## 2. The model-facing reminder: text + injection gate

### 2.1 The reminder maker `o4p`

The reminder is the model's side of the opt-in: when the keyword is present, a meta system-reminder is injected telling the model it may use the Workflow tool *this turn*.

```javascript
// ============================================
// makeWorkflowKeywordReminder - emit telemetry + workflow_keyword_request reminder
// Location: cli_inner_pretty.js:464869-464871
// ============================================

// ORIGINAL (for source lookup):
function o4p(e) {
  if (!e || !Qel(e)) return [];
  return (G("tengu_workflow_keyword", {}), [{ type: "workflow_keyword_request" }]);
}

// READABLE (for understanding):
function makeWorkflowKeywordReminder(promptText) {
  if (!promptText || !hasUltracodeKeyword(promptText)) return [];   // <- now hasUltracodeKeyword
  logEvent("tengu_workflow_keyword", {});                            // event name UNCHANGED
  return [{ type: "workflow_keyword_request" }];                     // reminder type UNCHANGED
}

// Mapping: o4p→makeWorkflowKeywordReminder, Qel→hasUltracodeKeyword, G→logEvent
```

This is structurally identical to v2.1.156's `KR_` (which called `lj4`/`hasWorkflowKeyword`; baseline §2.3). **Only the keyword-detector call changed** (`lj4` → `Qel`). The telemetry event `tengu_workflow_keyword` and the reminder `type:"workflow_keyword_request"` are the *same string* — confirming this is a keyword rename, not a new reminder channel.

### 2.2 The injection gate now requires `Jyn()`

The reminder is registered into the system-reminder pipeline only when the master gate `isWorkflowsEnabled` (`Pw`) is on, the turn is a regular user prompt that hasn't suppressed the keyword, **and the new `workflowKeywordTriggerEnabled` setting is on**:

```javascript
// ============================================
// reminder pipeline registration for the keyword reminder (v2.1.183)
// Location: cli_inner_pretty.js:464665-464670
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
      registerReminder("workflow_keyword_request", () =>
        Promise.resolve(
          prompt?.isRegularUserPrompt          // only real user turns, not tool-result turns
          && !prompt.suppressWorkflowKeyword    // not dismissed via alt+w plumbing
          && isUltracodeKeywordTriggerEnabled()  // <-- NEW: /config setting gate (was absent in 156)
            ? makeWorkflowKeywordReminder(prompt.preExpansionInput ?? rawText)  // match RAW typed text
            : [],
        ),
      ),
      registerReminder("ultra_effort_enter", () =>
        Promise.resolve(prompt?.isRegularUserPrompt ? makeStandingUltracodeReminder(attachments, ctx) : []),
      ),
    ]
  : []),

// Mapping: Pw→isWorkflowsEnabled, Jyn→isUltracodeKeywordTriggerEnabled, o4p→makeWorkflowKeywordReminder,
//          BA→registerReminder, i→prompt, s4p→makeStandingUltracodeReminder
```

The v2.1.156 before-picture (read directly):

```javascript
// ORIGINAL (v2.1.156 before) — cli_inner_pretty.js:412709-412714:
...(NZ()
  ? [E3("workflow_keyword_request", () =>
       Promise.resolve(
         A?.isRegularUserPrompt && !A.suppressWorkflowKeyword ? KR_(A.preExpansionInput ?? H) : [],   // <- NO Jyn()
       )),
     E3("ultra_effort_enter", () => Promise.resolve(A?.isRegularUserPrompt ? _R_(_, $) : []))]
  : []),
```

**What changed:** exactly one conjunct — `&& Jyn()` — was inserted (cli_inner_pretty.js:464668). The `preExpansionInput ?? e` rule (match the *raw* text the user typed, before slash/skill macro expansion) is **unchanged** and is analyzed in the baseline §2.3; it survives so an expanded macro can neither inject nor strip the keyword.

### 2.3 The reminder text the model finally sees

The renderer for `workflow_keyword_request` produces the meta message:

```javascript
// ============================================
// workflow_keyword_request renderer - the meta reminder the model reads
// Location: cli_inner_pretty.js:590606-590617
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
  wrapAsMetaMessages([
    metaUserMessage({
      content:
        'The user included the keyword "ultracode", opting this turn into multi-agent orchestration — use the Workflow tool to fulfill the request.',
      isMeta: true,
    }),
  ]),

// Mapping: Jp→wrapAsMetaMessages, Rn→metaUserMessage
```

The v2.1.156 before-picture (read directly, cli_inner_pretty.js:446731-446738 in the v2.1.156 bundle):

> *"The user included the keyword "workflow" or "workflows", which means you should use the Workflow tool to fulfill their request."*

**What changed in the text:**
- Keyword: `"workflow" or "workflows"` → `"ultracode"` (single coined word).
- Framing: from "which means you should use the Workflow tool" → "opting this turn into multi-agent orchestration — use the Workflow tool". The new wording emphasizes that the keyword is a **per-turn opt-in into orchestration**, dovetailing with the tool description's stricter opt-in policy (§5).

**Key insight:** the renderer key (`workflow_keyword_request`) and the meta-message wrapping are unchanged; only the rendered English moved. The model is told to *look for* a reminder confirming the keyword (see the tool description opt-in form #1, §5), and this is the reminder it gets.

---

## 3. The new `/config` setting `workflowKeywordTriggerEnabled`

This setting did not exist in v2.1.156 (`grep -c workflowKeywordTriggerEnabled` over the v2.1.156 bundle = **0**, verified). It was added in 2.1.157 and renamed to its current describe-text/label in 2.1.160. It gates *both* keyword surfaces (the model reminder and the input highlight) so a user can keep workflows enabled while turning off the keyword trigger.

### 3.1 The reader `Jyn`

```javascript
// ============================================
// isUltracodeKeywordTriggerEnabled - read the keyword-trigger setting (default ON)
// Location: cli_inner_pretty.js:148797-148799
// ============================================

// ORIGINAL (for source lookup):
function Jyn() {
  return mk()?.settings.workflowKeywordTriggerEnabled ?? !0;
}

// READABLE (for understanding):
function isUltracodeKeywordTriggerEnabled() {
  return readSettings()?.settings.workflowKeywordTriggerEnabled ?? true;   // default ON when unset
}

// Mapping: Jyn→isUltracodeKeywordTriggerEnabled, mk→readSettings, !0→true
```

`Jyn` sits in the same gate cluster as the master gate `isWorkflowsEnabled` (`Pw`, cli_inner_pretty.js:148784) and `getWorkflowDefaultOn` (`eNr`, cli_inner_pretty.js:148791). It is a **separate dimension** from enablement: `Pw()` decides whether the *feature* exists; `Jyn()` decides whether the *keyword trigger* is active within an enabled feature. The `?? true` default means existing users keep the trigger on unless they explicitly opt out.

### 3.2 The settings schema entry

```javascript
// ============================================
// workflowKeywordTriggerEnabled schema field + describe text
// Location: cli_inner_pretty.js:56008-56012
// ============================================

// ORIGINAL (for source lookup):
workflowKeywordTriggerEnabled: H.boolean()
  .optional()
  .describe(
    'Enable the "ultracode" keyword trigger: including the keyword in a prompt opts that turn into the Workflow tool. Set to false to disable the trigger. Default: true.',
  ),

// READABLE (for understanding):
workflowKeywordTriggerEnabled: zod.boolean()
  .optional()
  .describe('Enable the "ultracode" keyword trigger: including the keyword in a prompt opts that turn into the Workflow tool. Set to false to disable the trigger. Default: true.'),

// Mapping: H→zod (the schema builder)
```

It is declared adjacent to the unchanged `disableWorkflows` (cli_inner_pretty.js:55997) and `enableWorkflows` (cli_inner_pretty.js:56003) fields. Those two pre-existed in v2.1.156; `workflowKeywordTriggerEnabled` is the only *new* workflow settings field.

### 3.3 The `/config` toggle row

The settings UI exposes a boolean row "Ultracode keyword trigger":

```javascript
// ============================================
// /config "Ultracode keyword trigger" toggle row
// Location: cli_inner_pretty.js:479214-479225
// ============================================

// ORIGINAL (for source lookup):
{
  id: "workflowKeywordTriggerEnabled",
  label: "Ultracode keyword trigger",
  value: n?.workflowKeywordTriggerEnabled ?? !0,
  type: "boolean",
  onChange(M) {
    let U = M ? void 0 : !1;
    (co("userSettings", { workflowKeywordTriggerEnabled: U }),
      x((F) => ({ ...F, workflowKeywordTriggerEnabled: U })),
      I((F) => ({ ...F, ultracodeKeywordTrigger: M ? "on" : "off" })));
  },
},

// READABLE (for understanding):
{
  id: "workflowKeywordTriggerEnabled",
  label: "Ultracode keyword trigger",
  value: settings?.workflowKeywordTriggerEnabled ?? true,        // reflects the default-ON reader
  type: "boolean",
  onChange(enabled) {
    let writeValue = enabled ? undefined : false;                // ON => unset (store stays clean), OFF => explicit false
    writeUserSetting("userSettings", { workflowKeywordTriggerEnabled: writeValue });
    updateLocalState((s) => ({ ...s, workflowKeywordTriggerEnabled: writeValue }));
    updateTelemetryState((s) => ({ ...s, ultracodeKeywordTrigger: enabled ? "on" : "off" }));  // telemetry diff
  },
},

// Mapping: co→writeUserSetting, x→updateLocalState, I→updateTelemetryState,
//          M→enabled, U→writeValue
```

**Design note (the `enabled ? undefined : false` write):** Turning the setting *on* writes `undefined` (i.e. **deletes** the key) rather than `true`. Because the reader (`Jyn`) defaults to `true` when the key is absent, storing `undefined` keeps the user settings file minimal — only the *non-default* state (`false`, the user explicitly disabled the trigger) is persisted. This is the same "only store deviations from default" convention used by the adjacent `enableWorkflows` toggle one row up (cli_inner_pretty.js:479208, `U = M === eNr() ? void 0 : M`). The `ultracodeKeywordTrigger:"on"/"off"` field is pushed into the settings-diff telemetry state (cli_inner_pretty.js:479223), so changes are observable in aggregate.

### 3.4 What the setting gates

`Jyn()` is consulted at exactly two sites — the two keyword surfaces:
1. **Model-facing reminder injection** — `&& Jyn()` in the pipeline registration (cli_inner_pretty.js:464668; §2.2).
2. **Input highlight memo** — `Pw() && Jyn() ? yho(Tf) : []` in the prompt editor (cli_inner_pretty.js:622226; §4).

When the setting is off, both the model reminder and the violet shimmer/toast disappear; the Workflow tool itself stays usable (the user can still type `use a workflow` in their own words, or run a named workflow). This is the **separation of concerns** the setting buys: keyword *convenience* is decoupled from feature *availability*.

---

## 4. Input highlight: violet shimmer + the `Jyn()`-gated memo + the toast

The prompt editor highlights the keyword in three coordinated ways for one user action: a shimmer on the keyword characters, a 30 s "requested" toast, and an `alt+w` dismiss/restore toggle. The structure is the same three-way surfacing the baseline §2.4 describes; the deltas are (a) the memo is now `Jyn()`-gated, (b) the shimmer is a dedicated violet instead of the shared rainbow, and (c) the *ignored* toast text says "Ultracode" instead of "Workflow".

### 4.1 The keyword-spans memo `ji` (now `Pw() && Jyn()`)

```javascript
// ============================================
// ji - memoized ultracode keyword spans for input highlighting
// Location: cli_inner_pretty.js:622226
// ============================================

// ORIGINAL (for source lookup):
ji = Fo.useMemo(() => (Pw() && Jyn() ? yho(Tf) : []), [Tf]),

// READABLE (for understanding):
let ultracodeSpans = useMemo(
  () => (isWorkflowsEnabled() && isUltracodeKeywordTriggerEnabled() ? findUltracodeKeyword(displayText) : []),
  [displayText],   // recompute only when the rendered input text changes
);

// Mapping: ji→ultracodeSpans, Pw→isWorkflowsEnabled, Jyn→isUltracodeKeywordTriggerEnabled,
//          yho→findUltracodeKeyword, Tf→displayText
```

The v2.1.156 before-picture (read directly, cli_inner_pretty.js:584681):

```javascript
// ORIGINAL (v2.1.156 before):
o1 = Jq.useMemo(() => (NZ() ? pg6(r1) : []), [r1]),   // NZ() only — no keyword-trigger setting gate
```

**What changed:** the memo gate went from `NZ()` (master enablement only) to `Pw() && Jyn()` (enablement **and** the new keyword-trigger setting), and the matcher went from `pg6` (workflow) to `yho` (ultracode). Every downstream highlight surface keys off this memo, so a single `&& Jyn()` here kills the highlight, the toast, and the `alt+w` toggle together. (The two sibling memos in this block — `uy` for ultraplan via `zWn`, `J_` for ultrareview via `Xel` — are unchanged structurally; only the ultracode memo gained the `Jyn()` conjunct.)

### 4.2 The dedicated violet shimmer

```javascript
// ============================================
// keyword shimmer push - violet for ultracode vs rainbow for ultraplan (v2.1.183)
// Location: cli_inner_pretty.js:622300-622313
// ============================================

// ORIGINAL (for source lookup):
if (Tue())
  for (let an of uy)
    for (let gr = an.start; gr < an.end; gr++)
      _t.push({ start: gr, end: gr + 1, color: Xq(gr - an.start), shimmerColor: Xq(gr - an.start, !0), priority: 10 });
if (Pw() && !WA)
  for (let an of ji)
    for (let gr = an.start; gr < an.end; gr++)
      _t.push({ start: gr, end: gr + 1, color: "autoAccept", shimmerColor: "autoAcceptShimmer", priority: 10 });

// READABLE (for understanding):
if (isUltraplanEnabled())                                  // ultraplan keyword: STILL the rainbow
  for (let span of ultraplanSpans)
    for (let i = span.start; i < span.end; i++)
      highlights.push({ start: i, end: i + 1,
        color: rainbowColor(i - span.start),                // Xq = per-offset rainbow cycler
        shimmerColor: rainbowColor(i - span.start, true), priority: 10 });
if (isWorkflowsEnabled() && !keywordIgnored)               // ultracode keyword: dedicated VIOLET
  for (let span of ultracodeSpans)
    for (let i = span.start; i < span.end; i++)
      highlights.push({ start: i, end: i + 1,
        color: "autoAccept",            // rgb(135,0,255) violet — static, not per-offset
        shimmerColor: "autoAcceptShimmer", priority: 10 });  // rgb(208,180,255) light violet

// Mapping: Xq→rainbowColor, uy→ultraplanSpans, ji→ultracodeSpans, WA→keywordIgnored,
//          Tue→isUltraplanEnabled, Pw→isWorkflowsEnabled
```

The shimmer color tokens resolve at cli_inner_pretty.js:154110-154111:

```javascript
// ORIGINAL (for source lookup) — cli_inner_pretty.js:154108-154112:
FZu = {
  autoAccept: "rgb(135,0,255)",
  autoAcceptShimmer: "rgb(208,180,255)",
  ...
}
```

The v2.1.156 before-picture (read directly, cli_inner_pretty.js:584766-584772): the workflow-keyword branch pushed the **rainbow** shimmer, identical to ultraplan's:

```javascript
// ORIGINAL (v2.1.156 before):
if (NZ() && !__)
  for (let b8 of o1)
    for (let n6 = b8.start; n6 < b8.end; n6++)
      k$.push({ start: n6, end: n6 + 1,
                color: fI(n6 - b8.start),            // fI = the SAME rainbow cycler as ultraplan/ultrathink
                shimmerColor: fI(n6 - b8.start, !0), priority: 10 });
```

**What it does:** colors each character of the matched keyword in the input box with a shimmer animation, signaling "this word is an active trigger".

**How it works:** v2.1.156 cycled the rainbow palette per-character via `fI(offset)` (cli_inner_pretty.js:130292 in the v2.1.156 bundle) — and `fI` is *byte-identical* to v2.1.183's `Xq` (cli_inner_pretty.js:134367): `function Xq(e,t=!1){ let n = t ? D8u : L8u; return n[e % n.length]; }`. So the rainbow cycler itself is unchanged and is **still used for ultraplan** (the `uy`/`Xq` branch above). What changed is that the *workflow/ultracode* branch was **detached from the rainbow** and given two static color tokens: `autoAccept` (violet `rgb(135,0,255)`) and `autoAcceptShimmer` (light violet `rgb(208,180,255)`).

**Why a dedicated violet:** Three reasons cohere:
1. **Disambiguation.** In v2.1.156, workflow, ultraplan, ultrathink, and ultrareview keywords all rendered the same rainbow shimmer. A dedicated violet lets the user *see* that "ultracode" is a distinct, heavier opt-in (multi-agent orchestration) versus the lighter reasoning keywords.
2. **Consistency with the `/effort` ultracode level**, which already carried a violet identity in v2.1.156 (`color:"violet-ripple"`, cli_inner_pretty.js:551113; the same level existed in v2.1.156 — this is *not* a delta, see the dossier §C). The keyword highlight now matches the effort-slider color, so "ultracode" reads as one visual concept across surfaces.
3. **Reuse of the `autoAccept` token.** `autoAccept` = `rgb(135,0,255)` is the existing violet used for the auto-accept-edits border; reusing it (rather than minting a new token) keeps the palette small. The trade-off — semantic overload of one color token across two unrelated features (auto-accept border + ultracode keyword) — is acceptable because the contexts never co-render in the same widget.

**Key insight:** the rainbow cycler (`fI`/`Xq`) was *not* removed or changed — ultraplan still uses it. The delta is purely that the ultracode branch's `color`/`shimmerColor` args switched from a per-offset rainbow function call to two static violet tokens. This is the cheapest possible way to give one keyword a distinct identity without touching the shimmer engine.

### 4.3 The `alt+w` ignore toggle and its toasts

The dismiss/restore toggle and its two toasts (the active "requested" toast and the "ignored" confirmation) are structurally identical to the baseline §2.4 mechanism. The deltas are narrow but worth pinning precisely, because **only one of the two toasts changed text**.

```javascript
// ============================================
// el (toggleKeywordIgnored) - alt+w dismiss/restore of the per-prompt ultracode keyword
// Location: cli_inner_pretty.js:622362-622375
// ============================================

// ORIGINAL (for source lookup):
let el = Fo.useCallback(() => {
    if (ji.length === 0) return;
    let _t = !Gv.current;
    if ((dy(_t), (Gv.current = _t), _t))
      (G("tengu_workflow_keyword_dismissed", {}),
        xa({
          key: "workflow-keyword-ignored",
          text: `Ultracode keyword ignored for this prompt${Jn ? ` \xB7 ${Jn} to undo` : ""}`,
          priority: "immediate",
          timeoutMs: 5000,
        }));
    else (G("tengu_workflow_keyword_restored", {}), hd("workflow-keyword-ignored"));
  }, [ji.length, Jn, xa, hd]),

// READABLE (for understanding):
let toggleKeywordIgnored = useCallback(() => {
    if (ultracodeSpans.length === 0) return;                    // nothing matched -> nothing to toggle
    let nextIgnored = !ignoredRef.current;
    setIgnored(nextIgnored); ignoredRef.current = nextIgnored;
    if (nextIgnored) {
      logEvent("tengu_workflow_keyword_dismissed", {});         // event name UNCHANGED
      addNotification({
        key: "workflow-keyword-ignored",
        text: `Ultracode keyword ignored for this prompt${shortcut ? ` · ${shortcut} to undo` : ""}`,   // <- "Ultracode", was "Workflow"
        priority: "immediate", timeoutMs: 5000,
      });
    } else {
      logEvent("tengu_workflow_keyword_restored", {});          // event name UNCHANGED
      removeNotification("workflow-keyword-ignored");
    }
  }, [ultracodeSpans.length, shortcut, addNotification, removeNotification]);

// Mapping: el→toggleKeywordIgnored, ji→ultracodeSpans, WA/Gv→ignored state & ref (dy=setIgnored),
//          Jn→shortcut, G→logEvent, xa→addNotification, hd→removeNotification
```

The v2.1.156 before-picture (read directly, cli_inner_pretty.js:584818-584830 in the v2.1.156 bundle): the callback `UJ` is identical in shape but the *ignored* toast text reads `Workflow keyword ignored for this prompt${D_ ? \` · ${D_} to undo\` : ""}`.

**The two toasts, precisely:**
- **Active "requested" toast** (cli_inner_pretty.js:622350-622358): `\`Dynamic workflow requested for this turn${Jn ? \` · ${Jn} to ignore\` : ""}\``, 30 s timeout, fired when `Pw() && ji.length && !WA`. **This text is UNCHANGED from v2.1.156** (cli_inner_pretty.js:584806-584814 reads the identical "Dynamic workflow requested for this turn"). Only the gate changed: `NZ() && o1.length && !__` → `Pw() && ji.length && !WA` (and `ji` now carries the `Jyn()` gate via §4.1).
- **Ignored confirmation toast** (the `el` callback above): `Workflow keyword ignored` → **`Ultracode keyword ignored`**, 5 s timeout. This is the only toast string that changed.

**Why the active toast kept "Dynamic workflow requested":** it describes the *action being requested* (a dynamic workflow), not the keyword the user typed — so it reads correctly regardless of whether the trigger keyword is "workflow" or "ultracode". The *ignored* toast, by contrast, names the **keyword** ("Ultracode keyword ignored"), so it had to follow the rename. This asymmetry is intentional and a useful sanity check that the rename was applied surgically, not by find-and-replace.

**Telemetry continuity:** both `tengu_workflow_keyword_dismissed` and `tengu_workflow_keyword_restored` keep their v2.1.156 names. As the baseline §2.4 notes, dismissing only suppresses the *highlight/toast*; the model-facing reminder is suppressed by the separate `suppressWorkflowKeyword` prompt flag (cli_inner_pretty.js:464668), which is unchanged. The keybinding lookup `Gu("chat:workflowKeywordToggle","Chat","alt+w")` (cli_inner_pretty.js:622229) is also unchanged from v2.1.156's `u1("chat:workflowKeywordToggle","Chat","alt+w")`.

---

## 5. The tool-description opt-in forms — and the B2 framing trap

The Workflow tool description (`WORKFLOW_DESCRIPTION`, obfuscated `gdo`, cli_inner_pretty.js:418170; v2.1.156 was `Fp6`) is a ~30-paragraph model-facing prompt that catalogs the *only* acceptable opt-ins. This is the **model's policy**, distinct from the **runtime detector** (§1). The 2.1.178 changelog phrase "triggers only on explicit phrases" describes edits *here*, in the prose — not a new runtime regex.

### 5.1 The opt-in catalog (what changed)

The description's "Explicit opt-in means one of:" list changed in three places. Reading the v2.1.183 bundle at cli_inner_pretty.js:418175-418177 and the footer at 418181, versus the v2.1.156 bundle at 376082-376088:

| Form | v2.1.156 (before, 376082-376088) | v2.1.183 (418175-418181) |
|---|---|---|
| #1 keyword | `- The user included the "workflow" or "workflows" keyword (you'll see a system-reminder confirming it).` | `- The user included the keyword "ultracode" in their prompt (you'll see a system-reminder confirming it).` |
| #3 own-words | `("run a workflow", "fan out agents", "orchestrate this with subagents")` | `("use a workflow", "run a workflow", "fan out agents", "orchestrate this with subagents")` — **added "use a workflow"** |
| footer hint | `Mention they can include "workflow" in a future message to skip the ask.` | `Mention they can ask for one with "use a workflow" in a future message to skip the ask.` |

> The above is a **cross-version comparison table** (the CLAUDE.md exception for before/after contrast), not an obfuscated→readable symbol mapping. The symbol mapping for `gdo`/`aLp`/`Fp6` lives in the symbol-additions file linked at the bottom.

The descriptions are otherwise the same shape: a blunt "ONLY call this tool when the user has explicitly opted into multi-agent orchestration … the user must request that scale, not have it inferred" (cli_inner_pretty.js:418173), followed by five opt-in forms, the hybrid-scouting guidance, the single-phase pattern catalog, the **Ultracode** standing-orchestration paragraph (418194), and the `export const meta` authoring spec. The unchanged bulk is documented in the baseline [`workflow_tool_definition.md`](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md).

### 5.2 B2: there is no "run a workflow" / "workflow:" runtime regex

**What the changelog implies:** the 2.1.178 note "triggers only on explicit phrases (e.g. *run a workflow*, *workflow:*), not any mention of the word" reads as if a new natural-language phrase detector was added.

**What the code actually says:** the runtime keyword detector is the single-word `hho(text,"ultracode")` (§1). There is **no** runtime matcher for the phrases "run a workflow" or "workflow:". Grep proof over the v2.1.183 bundle:

```
$ grep -nF "run a workflow" cli_inner_pretty.js
418177: - The user directly asked you to run a workflow ... ("use a workflow", "run a workflow", ...)
418194: **Ultracode.** When a system-reminder confirms ultracode is on ... author and run a workflow ...

$ grep -nF '"workflow:"' cli_inner_pretty.js
(no matches)
```

Both "run a workflow" hits are **inside the tool description `gdo`** (the opt-in catalog #3 at 418177, and the standing-ultracode prose at 418194). The literal `"workflow:"` does not appear anywhere as a runtime string.

**How the "explicit phrases" behavior is actually produced** — two independent mechanisms, neither a phrase regex:
1. **The runtime keyword is now `ultracode`** (§1). Because nobody types "ultracode" incidentally, "any mention of the word workflow" simply stopped firing — there is no code that *suppresses* the word "workflow"; the detector just no longer looks for it.
2. **Natural-language phrases are an instruction to the model, not a regex.** Opt-in form #3 tells the *model* that if the user says "use a workflow"/"run a workflow"/"fan out agents" in their own words, that counts as an opt-in (with the caveat "the ask must be in the user's words — a task that would merely benefit from a workflow does not count", 418177). The model — not a runtime detector — judges whether such a phrase was used. The 2.1.183 addition of "use a workflow" (and the matching footer hint) makes the canonical user phrase explicit.

**Key insight:** the "explicit phrases" framing is satisfied by a renamed single-word keyword (runtime) plus a model-policy instruction (prose). Treating it as a phrase-matching regex would be wrong — it would imply a parser that does not exist in the bundle. This is the trap; the grep is the proof.

---

## 6. Cross-cutting: the three keyword surfaces after the delta

Putting the pieces together, one user action — typing `ultracode` in a regular prompt — now drives three surfaces, each independently gated:

```
user types "ultracode" in a regular prompt
        │
        ├─ runtime detector  yho/Qel = hho(text,"ultracode")          (§1; matcher unchanged, keyword renamed)
        │
        ├─[gate: Pw() && isRegularUserPrompt && !suppressWorkflowKeyword && Jyn()]
        │        └─ o4p → tengu_workflow_keyword + workflow_keyword_request reminder   (§2; +Jyn() gate)
        │             └─ renderer @590606: 'The user included the keyword "ultracode" ...'  (§2.3; text changed)
        │
        └─[gate: Pw() && Jyn()]  → memo ji = yho(displayText)          (§4.1; +Jyn() gate)
                 ├─ violet shimmer  color:"autoAccept"/"autoAcceptShimmer"  (§4.2; was rainbow fI/Xq)
                 ├─ active toast "Dynamic workflow requested for this turn"  (§4.3; text UNCHANGED, gate changed)
                 └─ alt+w toggle el → "Ultracode keyword ignored" + dismissed/restored telemetry  (§4.3; ignored text changed)
```

The v2.1.156 → v2.1.183 deltas in this picture, exhaustively:
- detector keyword `workflows?` → `ultracode` (matcher internals byte-identical);
- reminder injection gained `&& Jyn()`; renderer text rewritten;
- highlight memo gate `NZ()` → `Pw() && Jyn()`; shimmer rainbow → static violet;
- *ignored* toast text "Workflow keyword ignored" → "Ultracode keyword ignored" (active toast unchanged);
- new `/config` setting `workflowKeywordTriggerEnabled` (reader `Jyn`, schema, toggle, telemetry diff) feeding both gates.

Everything else — the code-span masking, `preExpansionInput` matching, `suppressWorkflowKeyword` flag, the consent layer, the telemetry event names, the reminder type string, the keybinding — is **carried over unchanged** from v2.1.156 (baseline §2).

---

## 7. Confidence and open items

- **All claims in §§1-5 are high-confidence**, each verified by reading the cited v2.1.183 line and the corresponding v2.1.156 before-line directly. The grep proof in §5.2 was run against the v2.1.183 bundle.
- **Carried caveat (dossier §D3):** the tool description `gdo` is ~30 paragraphs; this doc diffed the load-bearing opt-in/keyword/footer parts (§5.1). There may be additional small wording tweaks in the pattern catalog or the **Ultracode** standing-orchestration prose (418194) not enumerated here — low impact. A full character-level diff of `gdo` (418170+) vs `Fp6` (375…) is the place to look if an exhaustive description audit is needed; it is out of scope for this keyword-UX doc.
- The non-delta **framing traps** (the `/effort ultracode`-on-xhigh-models gate and the `violet-ripple` effort-slider level *already existed* in v2.1.156) are documented in the dossier §C and the sibling [delta README](./README.md); they are intentionally **not** re-claimed as deltas here.

---

## Related Symbols

> Symbol mappings (single source of truth — do not duplicate as tables in this doc):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Workflows live here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_additions_v2_1_183_workflow.md](../00_overview/symbol_additions_v2_1_183_workflow.md) - Per-feature v2.1.183 re-derived workflow symbols

Key functions in this document:
- `matchKeyword` (obfuscated: `hho`, cli_inner_pretty.js:464214) — generic code-span-masking keyword matcher; byte-identical to v2.1.156 `Bg6`
- `findUltracodeKeyword` (obfuscated: `yho`, cli_inner_pretty.js:464261) — `matchKeyword(text,"ultracode")`; was `pg6 = Bg6(…,"workflows?")` in v2.1.156
- `hasUltracodeKeyword` (obfuscated: `Qel`, cli_inner_pretty.js:464267) — `findUltracodeKeyword(text).length > 0`; was `lj4` in v2.1.156
- `findUltraplanKeyword` (obfuscated: `zWn`, cli_inner_pretty.js:464255) / `findUltrareviewKeyword` (obfuscated: `Xel`, cli_inner_pretty.js:464258) — sibling matchers (unchanged behavior)
- keyword delimiter map (obfuscated: `Yel`, cli_inner_pretty.js:464280) — `` {"`":"`",'"':'"',"<":">","{":"}","[":"]","(":")","'":"'"} `` (unchanged)
- `makeWorkflowKeywordReminder` (obfuscated: `o4p`, cli_inner_pretty.js:464869) — emits `tengu_workflow_keyword` + `workflow_keyword_request`; was `KR_` in v2.1.156
- `workflow_keyword_request` renderer (renderer map, cli_inner_pretty.js:590606) — the meta reminder text ("ultracode")
- `isUltracodeKeywordTriggerEnabled` reader (obfuscated: `Jyn`, cli_inner_pretty.js:148797) — NEW; reads the `workflowKeywordTriggerEnabled` setting; `?? true` default; gates reminder (464668) + highlight (622226)
- `isWorkflowsEnabled` (obfuscated: `Pw`, cli_inner_pretty.js:148784) — master gate; was `NZ` in v2.1.156 (logic unchanged)
- keyword-spans memo (obfuscated: `ji`, cli_inner_pretty.js:622226) — `Pw() && Jyn() ? yho(displayText) : []`; was `NZ() ? pg6(r1) : []`
- `toggleKeywordIgnored` (obfuscated: `el`, cli_inner_pretty.js:622362) — `alt+w` dismiss/restore; was `UJ` in v2.1.156; ignored-toast text now "Ultracode keyword ignored"
- rainbow color cycler (obfuscated: `Xq`, cli_inner_pretty.js:134367) — still used by ultraplan; byte-identical to v2.1.156 `fI`; ultracode no longer uses it
- shimmer color tokens (obfuscated: `FZu`, cli_inner_pretty.js:154110) — `autoAccept = rgb(135,0,255)`, `autoAcceptShimmer = rgb(208,180,255)`
- `WORKFLOW_DESCRIPTION` (obfuscated: `gdo`, cli_inner_pretty.js:418170) — model-facing tool description / opt-in catalog; was `Fp6` in v2.1.156
- `/config` toggle row "Ultracode keyword trigger" (cli_inner_pretty.js:479214) — writes `workflowKeywordTriggerEnabled` + `ultracodeKeywordTrigger` telemetry
