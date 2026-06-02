# AskUserQuestion 2.1.154 Reservation: Model-Gated Prompt Injection

> **Scope:** The v2.1.154 behavioral change to the `AskUserQuestion` tool's `prompt(model)`
> hook. A new "reservation" paragraph (`FUK`) is injected into the tool's system-prompt
> contribution **only when the model is on the lean/simple-system-prompt set** (`X3(model)`
> true — i.e. Opus 4.8 and the broader simple-prompt eligibility set), with a runtime
> feature-gate override (`tengu_cinder_plover`). This document explains the gate
> (`X3 = !c45(model) || d45(model)`), the call site, and the cross-validated diff vs v2.1.88.
>
> **Source:** `cli_inner_pretty.js` (Claude Code v2.1.156 bundle). Cross-validation:
> `/lyz/codespace/3rd/claude-code/src/tools/AskUserQuestionTool/prompt.ts` (v2.1.88).

---

## Related Symbols

> Symbol mappings live in the central index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools, Agent Loop, LLM API)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Model, Prompt, Telemetry/Gates)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key symbols in this document:

- `ASK_USER_QUESTION_TOOL_NAME` (`ez`) — wire-name constant `"AskUserQuestion"` (cli_inner_pretty.js:143388)
- `ASK_USER_QUESTION_DESCRIPTION` (`pUK`) — one-liner tool description (cli_inner_pretty.js:143390-143391)
- `ASK_USER_QUESTION_RESERVATION_PROMPT` (`FUK`) — the v2.1.154 reservation paragraph (cli_inner_pretty.js:143394-143396)
- `ASK_USER_QUESTION_BASE_PROMPT` (`xM6`) — base usage-notes prompt (cli_inner_pretty.js:143419-143427)
- `PREVIEW_FEATURE_PROMPT` (`UUK`) — markdown/html preview guidance map (cli_inner_pretty.js:143398-143418)
- `askUserQuestionTool` (`YtH`) — the tool object whose `prompt({model})` injects the reservation (cli_inner_pretty.js:348809-348828)
- `isLeanSystemPrompt` (`X3`) — memoized lean/simple-system-prompt eligibility predicate (cli_inner_pretty.js:143864, 143872-143877)
- `isFullSystemPromptModel` (`c45`) — "NOT lean" classifier (Claude 3 / Haiku / Sonnet / Opus ≤4.7) (cli_inner_pretty.js:143847-143862)
- `isVelvetCascadeOptIn` (`d45`) — gate/clientData opt-in into the lean set (cli_inner_pretty.js:143839-143846)
- `getQuestionPreviewFormat` (`wC$`) — returns `"markdown" | "html" | undefined` (cli_inner_pretty.js:2829-2831)
- `getFeatureGate` (`V$`) — GrowthBook/feature-gate reader with default (cli_inner_pretty.js:141101-141114)
- `parseBoolTrue` (`xH`) / `parseBoolFalse` (`k4`) — env-var tri-state parsers (cli_inner_pretty.js:1795-1805)
- `normalizeModelId` (`O7`) — model-id canonicalizer (cli_inner_pretty.js:98770-98778)
- `isFirstPartyish` (`UA`) — provider check firstParty/anthropicAws/gateway (cli_inner_pretty.js:91891-91893)
- `memoize` (`v8`) — lodash memoize used to cache `X3` (cli_inner_pretty.js:1488-1492)
- `EnterPlanMode` name (`og`) / `ExitPlanMode` name (`oG`) — referenced in the base prompt (cli_inner_pretty.js:143385-143387)

---

## TL;DR

Through v2.1.142, the `AskUserQuestion` tool fed the model a **static** instructional
prompt that *encouraged* asking ("Use this tool when you need to ask the user questions
during execution… Gather user preferences…"). v2.1.154 inverts the framing for the new
lean-prompt models. The tool's `prompt()` hook now:

1. Takes the **model id** as an argument: `async prompt({ model: H })` (cli_inner_pretty.js:348816).
2. Computes the lean-prompt predicate `X3(model)` (cli_inner_pretty.js:348818). If the model is
   **not** on the lean set, nothing extra is injected — behavior is the old base prompt.
3. If the model **is** lean (Opus 4.8 and the rest of the simple-prompt set), it appends a
   **reservation paragraph** that tells the model to *withhold* the tool: "Reserve this for
   decisions where the user's answer changes what you do next — not for choices with a
   conventional default or facts you can verify in the codebase yourself."
   (`FUK`, cli_inner_pretty.js:143394-143396, injected at 348824).
4. A runtime feature-gate, `tengu_cinder_plover`, can **override** that paragraph with
   custom text without shipping a new build (cli_inner_pretty.js:348819-348824).

The eligibility gate is `X3 = !c45(model) || d45(model)` (cli_inner_pretty.js:143876), with
two explicit env overrides (`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT`). `c45` lists the *full*-prompt
(non-lean) models; `claude-opus-4-8` is explicitly excluded from that list and therefore
lands in the lean set (cli_inner_pretty.js:143861).

**Cross-validation:** In v2.1.88 (`prompt.ts`) the reservation paragraph, the `model`
parameter, the `X3` gate, and the `tengu_cinder_plover` override **do not exist**. This is a
**NEW** post-2.1.88 feature. Confidence: **high** (all anchors read directly; both code paths
diffed line-by-line).

---

## Background: what AskUserQuestion's prompt did before

The tool is identified by `ez = "AskUserQuestion"` (cli_inner_pretty.js:143388) with a fixed
description string `pUK` (cli_inner_pretty.js:143390-143391):

> "Asks the user multiple choice questions to gather information, clarify ambiguity,
> understand preferences, make decisions or offer them choices."

In v2.1.88 the instructional system-prompt contribution was a single static constant
`ASK_USER_QUESTION_TOOL_PROMPT`, composed at registration with an optional preview block:

```javascript
// ============================================
// AskUserQuestionTool.prompt (v2.1.88) - STATIC prompt, no model awareness
// Location: 3rd/claude-code/src/tools/AskUserQuestionTool/AskUserQuestionTool.tsx:117-125
// ============================================

// ORIGINAL (v2.1.88 readable TS — the precursor):
async prompt() {
  const format = getQuestionPreviewFormat();
  if (format === undefined) {
    // SDK consumer that hasn't opted into a preview format — omit preview guidance
    return ASK_USER_QUESTION_TOOL_PROMPT;
  }
  return ASK_USER_QUESTION_TOOL_PROMPT + PREVIEW_FEATURE_PROMPT[format];
}

// Mapping (precursor → 2.1.156): prompt()→prompt({model}), getQuestionPreviewFormat→wC$,
//   ASK_USER_QUESTION_TOOL_PROMPT→xM6, PREVIEW_FEATURE_PROMPT→UUK
```

And the v2.1.88 base prompt body itself was **invitational** (encourages use):

```text
Use this tool when you need to ask the user questions during execution. This allows you to:
1. Gather user preferences or requirements
2. Clarify ambiguous instructions
3. Get decisions on implementation choices as you work
4. Offer choices to the user about what direction to take.
```
(`ASK_USER_QUESTION_TOOL_PROMPT`, prompt.ts:32-44)

Note the two structural facts that matter for the diff:
- `prompt()` took **no arguments** — it could not vary by model.
- There was **no reservation language** anywhere in `prompt.ts` (grep for
  "Reserve this for decisions" / "genuinely the user" returns nothing in `src/`).

---

## v2.1.156: the new constants

The base prompt body changed too. In v2.1.156 the base (`xM6`) opens with a much stronger
gate-keeping sentence — "**only** when you are blocked on a decision that is genuinely the
user's to make" — replacing the v2.1.88 "Use this tool when you need to ask" framing:

```javascript
// ============================================
// ASK_USER_QUESTION_BASE_PROMPT (xM6) + RESERVATION (FUK) + DESCRIPTION (pUK)
// Location: cli_inner_pretty.js:143388-143427
// ============================================

// ORIGINAL (for source lookup):
var ez = "AskUserQuestion",
  BUK = 12,
  pUK = "Asks the user multiple choice questions to gather information, clarify ambiguity, understand preferences, make decisions or offer them choices.",
  UUK, xM6,
  FUK = `
Reserve this for decisions where the user's answer changes what you do next — not for choices with a conventional default or facts you can verify in the codebase yourself. In those cases pick the obvious option, mention it in your response, and proceed.
`;
// ... inside kh = T(() => { ... }) ...
  (xM6 = `Use this tool only when you are blocked on a decision that is genuinely the user's to make: one you cannot resolve from the request, the code, or sensible defaults.

Usage notes:
- Users will always be able to select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers to be selected for a question
- If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label

Plan mode note: To switch into plan mode, use ${og} (not this tool). Once in plan mode, use this tool to clarify requirements or choose between approaches BEFORE finalizing your plan. Do NOT use this tool to ask "Is my plan ready?", "Should I proceed?", or otherwise reference "the plan" in questions — the user cannot see the plan until you call ${oG} for approval.
`);

// READABLE (for understanding):
const ASK_USER_QUESTION_TOOL_NAME = "AskUserQuestion";
const ASK_USER_QUESTION_TOOL_CHIP_WIDTH = 12;
const ASK_USER_QUESTION_DESCRIPTION = "Asks the user multiple choice questions ...";
let PREVIEW_FEATURE_PROMPT, ASK_USER_QUESTION_BASE_PROMPT;
const ASK_USER_QUESTION_RESERVATION_PROMPT = `
Reserve this for decisions where the user's answer changes what you do next — not for
choices with a conventional default or facts you can verify in the codebase yourself. In
those cases pick the obvious option, mention it in your response, and proceed.
`;
// (lazy init) ASK_USER_QUESTION_BASE_PROMPT = `Use this tool only when you are blocked on a
//   decision that is genuinely the user's to make ...  ${ENTER_PLAN_MODE} ... ${EXIT_PLAN_MODE} ...`;

// Mapping: ez→ASK_USER_QUESTION_TOOL_NAME, BUK→CHIP_WIDTH, pUK→DESCRIPTION,
//   UUK→PREVIEW_FEATURE_PROMPT, xM6→ASK_USER_QUESTION_BASE_PROMPT,
//   FUK→ASK_USER_QUESTION_RESERVATION_PROMPT, og→EnterPlanMode, oG→ExitPlanMode
```

So there are **two** new strings vs v2.1.88:
1. A tightened `xM6` base ("only when you are blocked"), which ships to **every** model.
2. A separate `FUK` reservation block that ships **conditionally** (the subject of this doc).

The preview-feature map `UUK` (cli_inner_pretty.js:143398-143418) is unchanged in content
from the v2.1.88 `PREVIEW_FEATURE_PROMPT`.

---

## The call site: `prompt({ model })`

```javascript
// ============================================
// askUserQuestionTool.prompt - model-gated reservation injection (v2.1.154+)
// Location: cli_inner_pretty.js:348809-348829
// ============================================

// ORIGINAL (for source lookup):
YtH = yK({
  name: ez,
  searchHint: "prompt the user with a multiple-choice question",
  maxResultSizeChars: 1e5,
  async description() {
    return pUK;
  },
  async prompt({ model: H }) {
    let $ = "";
    if (X3(H)) {
      let K = V$("tengu_cinder_plover", "").trim();
      $ = K
        ? `
${K}
`
        : FUK;
    }
    let q = wC$();
    if (q === void 0) return xM6 + $;
    return xM6 + $ + UUK[q];
  },
  ...
});

// READABLE (for understanding):
askUserQuestionTool = createTool({
  name: ASK_USER_QUESTION_TOOL_NAME,
  searchHint: "prompt the user with a multiple-choice question",
  maxResultSizeChars: 100_000,
  async description() {
    return ASK_USER_QUESTION_DESCRIPTION;
  },
  async prompt({ model }) {
    let reservation = "";
    if (isLeanSystemPrompt(model)) {                          // gate: lean-prompt models only
      const override = getFeatureGate("tengu_cinder_plover", "").trim();
      reservation = override
        ? `\n${override}\n`                                   // runtime-overridden text
        : ASK_USER_QUESTION_RESERVATION_PROMPT;               // default FUK paragraph
    }
    const previewFormat = getQuestionPreviewFormat();         // "markdown" | "html" | undefined
    if (previewFormat === undefined) return ASK_USER_QUESTION_BASE_PROMPT + reservation;
    return ASK_USER_QUESTION_BASE_PROMPT + reservation + PREVIEW_FEATURE_PROMPT[previewFormat];
  },
  ...
});

// Mapping: YtH→askUserQuestionTool, yK→createTool, H→model, $→reservation, K/override,
//   q→previewFormat, X3→isLeanSystemPrompt, V$→getFeatureGate, FUK→reservationPrompt,
//   wC$→getQuestionPreviewFormat, xM6→basePrompt, UUK→PREVIEW_FEATURE_PROMPT
```

### Composition order

The final prompt string is always assembled in the same order:

```
basePrompt (xM6)  +  reservation ($)  +  previewGuidance (UUK[format], if any)
```

- `reservation` is `""` for non-lean models → identical to the old shape (base + preview).
- `reservation` is `FUK` (or the gate override) for lean models → the model is told to
  *withhold* the tool unless the answer genuinely changes the plan.
- The preview block is appended only when a host has opted into a preview format
  (`wC$()` returns `"markdown"`/`"html"`); SDK consumers that never set it get `undefined`
  and the preview guidance is omitted (cli_inner_pretty.js:348826-348828). This SDK-omission
  behavior is carried over verbatim from v2.1.88.

---

## The eligibility gate `X3` (lean / simple system prompt)

`X3` is the single predicate that decides whether a model uses Claude Code's **lean
("simple") system prompt** set. The reservation injection is just one of ~20 call sites that
key off it (e.g. memory-load prompt at cli_inner_pretty.js:145062, coding-style guidance at
555400, output-style at 555866). Centralizing the decision in one memoized predicate is what
makes "Opus 4.8 gets the lean prompt everywhere" a one-line config rather than 20 scattered
checks.

```javascript
// ============================================
// isLeanSystemPrompt (X3) - memoized lean/simple-system-prompt eligibility
// Location: cli_inner_pretty.js:143864, 143872-143877
// ============================================

// ORIGINAL (for source lookup):
var X3;
var Dv = T(() => {
  Qt(); r8(); s8(); c$(); Rq(); f4();
  X3 = v8((H) => {
    if (!H) return !1;
    if (xH(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return !0;
    if (k4(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return !1;
    return !c45(H) || d45(H);
  });
});

// READABLE (for understanding):
let isLeanSystemPrompt;
const initLeanPromptPredicate = lazyModuleInit(() => {
  // ...module imports...
  isLeanSystemPrompt = memoize((model) => {
    if (!model) return false;                                          // no model → full prompt
    if (parseBoolTrue(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT))  return true;   // forced on
    if (parseBoolFalse(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return false;  // forced off
    return !isFullSystemPromptModel(model) || isVelvetCascadeOptIn(model);
  });
});

// Mapping: X3→isLeanSystemPrompt, v8→memoize, H→model, xH→parseBoolTrue, k4→parseBoolFalse,
//   c45→isFullSystemPromptModel, d45→isVelvetCascadeOptIn
```

### The core boolean: `!c45(model) || d45(model)`

This is the heart of the gate. Read it as:

> A model is lean **unless** it's explicitly on the full-prompt list (`c45`), **OR** it's
> opted into the lean set by a feature-gate / client-data override (`d45`).

`d45` is the escape hatch: even a model that would otherwise be "full" can be pulled into the
lean set by config — used to roll the lean prompt out to additional models without a build.

`isFullSystemPromptModel` (`c45`) — the explicit allow-list of models that keep the **full**
prompt:

```javascript
// ============================================
// isFullSystemPromptModel (c45) - models that KEEP the full (non-lean) system prompt
// Location: cli_inner_pretty.js:143847-143862
// ============================================

// ORIGINAL (for source lookup):
function c45(H) {
  if (gM6(H)) return !1;                       // -eap (early-access) builds → not full
  let $ = O7(H);
  if (
    $.includes("claude-3-") ||
    $.includes("haiku") ||
    $.includes("sonnet") ||
    $ === "claude-opus-4-0" ||
    $ === "claude-opus-4-1" ||
    $ === "claude-opus-4-5" ||
    $ === "claude-opus-4-6" ||
    $ === "claude-opus-4-7"
  )
    return !0;
  if ($ === "claude-opus-4-8") return !1;      // Opus 4.8 → NOT full → lean
  return !UA();                                // unknown model: full unless first-party-ish
}

// READABLE (for understanding):
function isFullSystemPromptModel(model) {
  if (isEarlyAccessBuild(model)) return false;
  const id = normalizeModelId(model);
  if (
    id.includes("claude-3-") || id.includes("haiku") || id.includes("sonnet") ||
    id === "claude-opus-4-0" || id === "claude-opus-4-1" ||
    id === "claude-opus-4-5" || id === "claude-opus-4-6" || id === "claude-opus-4-7"
  ) return true;                               // Claude 3.x, Haiku, Sonnet, Opus ≤4.7 → full
  if (id === "claude-opus-4-8") return false;  // Opus 4.8 → lean
  return !isFirstPartyish();                   // unknown id: lean iff first-party / Bedrock / gateway
}

// Mapping: c45→isFullSystemPromptModel, gM6→isEarlyAccessBuild, O7→normalizeModelId,
//   UA→isFirstPartyish
```

`isVelvetCascadeOptIn` (`d45`) — the additive opt-in that promotes a model into the lean set
via client-data or a feature gate:

```javascript
// ============================================
// isVelvetCascadeOptIn (d45) - clientData/gate opt-in into the lean prompt set
// Location: cli_inner_pretty.js:143839-143846
// ============================================

// ORIGINAL (for source lookup):
function d45(H) {
  let $ = O7(H),
    q = b$().clientDataCache?.simple_system_prompt;
  if (typeof q === "object" && q !== null && Object.entries(q).some(([_, z]) => z === !0 && $.includes(_))) return !0;
  let K = V$("tengu_velvet_cascade", null);
  if (typeof K !== "object" || K === null || !("models" in K) || !Array.isArray(K.models)) return !1;
  return K.models.some((_) => typeof _ === "string" && $.includes(_));
}

// READABLE (for understanding):
function isVelvetCascadeOptIn(model) {
  const id = normalizeModelId(model);
  // 1) server-pushed clientData map: { "<model-substring>": true }
  const clientMap = getConfig().clientDataCache?.simple_system_prompt;
  if (clientMap && typeof clientMap === "object" &&
      Object.entries(clientMap).some(([k, v]) => v === true && id.includes(k))) return true;
  // 2) feature gate "tengu_velvet_cascade": { models: ["<substring>", ...] }
  const gate = getFeatureGate("tengu_velvet_cascade", null);
  if (!gate || typeof gate !== "object" || !Array.isArray(gate.models)) return false;
  return gate.models.some((m) => typeof m === "string" && id.includes(m));
}

// Mapping: d45→isVelvetCascadeOptIn, O7→normalizeModelId, b$→getConfig, V$→getFeatureGate
```

### Decision diagram

```
prompt({ model }) called
        │
        ▼
   X3(model)?  ───────────────────────────────────────────────┐
   (isLeanSystemPrompt)                                        │
        │ env CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=truthy → TRUE   │
        │ env CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=falsy  → FALSE  │
        │ else: !c45(model) || d45(model)                      │
        ▼                                                      ▼
   TRUE (lean: Opus 4.8, EAP builds,                     FALSE (full: Claude 3.x,
   velvet-cascade opt-ins, unknown                       Haiku, Sonnet, Opus ≤4.7,
   first-party ids)                                      unknown non-first-party)
        │                                                      │
        ▼                                                      ▼
   override = V$("tengu_cinder_plover","")           reservation = ""  (nothing injected;
        │                                            same prompt shape as v2.1.88)
        ├─ override non-empty → reservation = "\n"+override+"\n"
        └─ override empty     → reservation = FUK
        │
        ▼
   result = xM6 + reservation [+ UUK[wC$()] if preview format set]
```

---

## Why this approach

**Why gate the reservation by model at all?** The reservation paragraph is a *steering*
instruction that tells the model to be conservative about interrupting the user. Anthropic
only wants to ship behavioral steering to models that were trained/tuned for the lean prompt
regime (Opus 4.8 and the simple-prompt cohort). Older models (Opus ≤4.7, Sonnet, Haiku) keep
the full, more explicit prompt and the original invitational framing, so layering a
"withhold the tool" paragraph on top of them could regress their behavior. Reusing the
existing `X3` predicate — the same switch that selects the entire lean system prompt — keeps
the AskUserQuestion change consistent with the model's overall prompt regime instead of
introducing a tool-local, divergent model check.

**Why a separate `FUK` block instead of folding it into `xM6`?** Because `xM6` ships to
everyone, but the reservation should not. Keeping them as two constants lets the call site
concatenate them conditionally (`xM6 + $`) — a single base for all models plus an opt-in tail
for lean models. It also makes the runtime override surgical: the gate replaces only the tail,
never the base usage notes.

**Why the `tengu_cinder_plover` override?** Prompt steering is high-iteration. Embedding a
runtime feature-gate string means Anthropic can A/B test or hotfix the exact reservation
wording (e.g. soften it, strengthen it, or disable it by setting it to empty/whitespace —
which `.trim()` collapses, but note: an empty override falls through to `FUK`, so to *remove*
the reservation you must flip `X3` off, not blank the gate) **without** shipping a new CLI
build. The default-on path (`FUK`) means even if the gate service is unreachable, lean models
still get a sensible reservation.

**Why memoize `X3`?** `prompt()` and the ~20 other lean-prompt call sites run on every turn
of the agent loop and during every system-prompt assembly. `X3 = v8(predicate)` wraps the
predicate in lodash `memoize` (`v8 = cx8`, cli_inner_pretty.js:1492), so for a stable model id
the env/regex/gate evaluation runs once per process and is cached thereafter. The cache key is
the model string (lodash memoize's default keyer), which is exactly the only input that varies.

---

## Edge cases & subtleties

1. **Empty/whitespace gate override falls back to `FUK`.** `V$("tengu_cinder_plover", "").trim()`
   yields `""` for an unset or blank gate, which is falsy, so the ternary picks `FUK`
   (cli_inner_pretty.js:348819-348824). You cannot suppress the reservation by blanking the
   gate — you suppress it by making the model non-lean (`X3` false).

2. **The override is wrapped in newlines** (`` `\n${K}\n` ``) so a single-line gate value
   reads as its own paragraph, matching `FUK`'s leading/trailing newlines
   (cli_inner_pretty.js:143394-143396).

3. **`d45` matches by substring (`id.includes(k)`)**, both for `clientDataCache` keys and the
   `tengu_velvet_cascade` model list (cli_inner_pretty.js:143842, 143845). A gate entry like
   `"opus-4-8"` would match `"claude-opus-4-8"`. This is deliberately loose so a single gate
   substring can cover provider-prefixed ids.

4. **Unknown model ids default by provider.** `c45` ends with `return !UA()`
   (cli_inner_pretty.js:143862): an unrecognized model is *lean* on first-party / Bedrock /
   gateway providers, and *full* elsewhere. So a brand-new first-party model automatically
   gets the reservation before its id is hard-coded anywhere.

5. **Early-access (`-eap`) builds are always lean.** `c45` short-circuits `false` when
   `gM6(model)` matches `/-eap($|\[)/i` (cli_inner_pretty.js:143836-143837, 143848), so EAP
   variants of any model receive the reservation.

6. **`isEnabled` gates availability separately — and on an unrelated axis.** Whether the tool is
   *shown to the model* is decided by its `isEnabled()` (cli_inner_pretty.js:348839-348842), whose
   body is `if (uw().length > 0 && R6()) return !1; return !0;`. The two predicates are:
   - `uw()` (`getAllowedChannels`, cli_inner_pretty.js:3217-3219) returns `d$.allowedChannels` — the
     `--channels` MCP-channel allowlist (default `[]` at cli_inner_pretty.js:2340, populated by
     `K7H(I$)` from the `--channels` flag handler at cli_inner_pretty.js:645080). So
     `uw().length > 0` means *a channel allowlist is in force*.
   - `R6()` (`isNonInteractive`, cli_inner_pretty.js:2742-2744) returns `!d$.isInteractive`, i.e. the
     session is headless/print rather than a live TUI.

   So AskUserQuestion is withheld **only when a `--channels` allowlist is active AND the session is
   non-interactive** — a print/headless session restricted to specific MCP channels, where there is
   no interactive UI to render the multiple-choice prompt. This is *not* an "extra MCP tools present"
   check; the allowlist is about restricting *channels*, not about the presence of other tools, and
   the non-interactive half of the condition is what actually makes the prompt un-renderable. The
   reservation paragraph (`FUK`) only affects the *prompt text* when the tool is enabled; it does not
   participate in this availability gate.

---

## Cross-validation summary (v2.1.88 → v2.1.156)

| Aspect | v2.1.88 (`prompt.ts` / `AskUserQuestionTool.tsx`) | v2.1.156 (`cli_inner_pretty.js`) |
|---|---|---|
| `prompt()` signature | `async prompt()` — no args (tsx:117) | `async prompt({ model })` (348816) |
| Base framing | "Use this tool when you need to ask…" (prompt.ts:32) | "Use this tool **only** when you are blocked…" (`xM6`, 143419) |
| Reservation paragraph | **absent** (grep empty) | `FUK` injected when `X3(model)` (143394-143396, 348818-348824) |
| Model gate | **none** | `X3 = !c45 || d45` (143876) |
| Runtime override | **none** | `tengu_cinder_plover` gate (348819) |
| Preview omission for SDK | present (prompt.ts via tsx:119-124) | present, unchanged (348826-348828) |

> The above is the *only* place where this doc uses a table — it is a **cross-version
> behavioral diff**, not a symbol-mapping table. Per CLAUDE.md, symbol mappings stay in the
> `symbol_index_*.md` files (linked above) and in prose list form.

**Verdict:** The model-gated reservation injection is **NEW in v2.1.154** (flagship Opus 4.8
release) with **no precursor** in v2.1.88. The supporting predicate `X3` and its helpers
(`c45`, `d45`) are part of the broader lean-system-prompt subsystem also new post-2.1.88
(see module `44_lean_prompt`). Confidence: **high** — every cited `cli_inner_pretty.js` line
was read directly, and the v2.1.88 precursor was diffed line-by-line.

---

## Key insight

The clever part is **reuse, not novelty**: AskUserQuestion's 2.1.154 reservation does not
introduce a tool-specific model check. It piggybacks on `X3` — the single, memoized,
env-/gate-overridable predicate that already decides the *entire* lean system prompt for a
model. That makes "Opus 4.8 should be more conservative about interrupting the user" a
two-line addition (`if (X3(H)) $ = FUK`) whose rollout, A/B testing, and per-model targeting
are inherited for free from the lean-prompt infrastructure (`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT`
env override, `tengu_velvet_cascade` model list, and the `tengu_cinder_plover` text override).
The behavioral inversion — from "use this tool when you need to ask" (2.1.88) to "reserve this
for decisions only the user can make" (2.1.154 lean models) — reflects a deliberate shift to
make the smarter model *decide and proceed* rather than *ask and wait*.
