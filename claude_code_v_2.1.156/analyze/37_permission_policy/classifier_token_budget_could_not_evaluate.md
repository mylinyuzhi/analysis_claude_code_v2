# Could-Not-Evaluate Fix - Stage-2 Output-Token Budget and Failure-Mode Parsing (2.1.156)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions / data in this document:
- `runTwoStageClassifier` (`en5`) — two-stage XML auto-mode classifier; stage 1 = hard_deny, stage 2 = soft_deny + ALLOW + user intent. Holds the stage-2 `max_tokens: 8192 + V` budget that is the fix (cli_inner_pretty.js:277392, 277501)
- `runSingleStageToolUseClassifier` (`BP$`) — single-stage `tool_use` classifier path; unchanged `max_tokens: 4096 + E` (cli_inner_pretty.js:277689, 277757)
- `stripUnterminatedThinking` (`BE7`) — strips both well-formed and unterminated `<thinking>` blocks before block parsing (cli_inner_pretty.js:277337-277339)
- `parseBlockDecision` (`ZE7`) — parses `<block>yes|no` after thinking-strip; returns `null` when no block tag is present (cli_inner_pretty.js:277340-277343)
- `parseBlockReason` (`GE7`) — extracts the `<reason>...</reason>` text (cli_inner_pretty.js:277345-277348)
- `parseThinking` (`an5`) — extracts the first well-formed `<thinking>...</thinking>` body for telemetry (cli_inner_pretty.js:277350-277352)
- `classifierCouldNotEvaluateReason` (`rY8`) — builds the user-facing "could not evaluate ... blocking it for safety" reason string (cli_inner_pretty.js:277918-277919)
- `emitClassifierOutcome` (`vc`) — telemetry emitter that maps outcome → SLI counters and the `tengu_auto_mode_outcome` event, carrying `failureKind` (cli_inner_pretty.js:277921-277947)
- `thinkingBudgetForModel` (`pE7`) — returns `[thinkingConfig, extraTokens]` = `[false, 0]` for the classifier (so `V`/`E` add 0) (cli_inner_pretty.js:277389-277391)
- `stage2ThinkingReminder` (`on5`) — stage-2 reminder appended to the transcript; the 2.1.156 "think for as long as needed" extension that motivates the budget bump (cli_inner_pretty.js:277995-277996)
- `extractTextBlocks` (`w9`) — concatenates the `text` blocks of a response's content array (cli_inner_pretty.js:445034-445038)
- `classifierRequestWithStallMonitor` (`vE6`) — request wrapper that drives the stall watchdog and counts fetch attempts (cli_inner_pretty.js:277677-277683)

> Cross-version precursors (2.1.142 bundle): `runTwoStageClassifier` precursor at chunks line 338028 (stage-2 `max_tokens: 4096 + V` at 338136); identical failure-mode guard at 338161-338163; `classifierCouldNotEvaluateReason` precursor `qz8` at 338548-338549.

---

## TL;DR

In auto mode the safety classifier's **stage 2** asks the model to *reason out loud* inside a `<thinking>` block
and only then emit `<block>yes</block>` or `<block>no</block>`. On hard or borderline actions the model writes a
lot of reasoning. In 2.1.142 the stage-2 request capped output at **4096 tokens** (cli_inner_pretty.js (2.1.142
bundle):338136). On a hard case the model could **run out of output tokens mid-reasoning** — `stop_reason` came
back `max_tokens` with a partial, unterminated `<thinking>` block and **no `<block>` tag yet**.

The response parser `parseBlockDecision` (`ZE7`) then returns `null` (no block tag found), the failure-mode guard
classifies it as `"unparseable"`, and the classifier returns
`shouldBlock: true` with the reason produced by `classifierCouldNotEvaluateReason` (`rY8`):

> "Auto mode could not evaluate this action and is blocking it for safety — run with --debug for details"

So a perfectly safe action got **blocked**, not because the model judged it unsafe, but because it was *cut off
while thinking*. The 2.1.156 changelog:

> "Fixed auto mode incorrectly blocking actions with 'could not evaluate this action' when the safety classifier
> ran out of output tokens while reasoning."

**The fix is a one-token-budget change**: stage 2's `max_tokens` was doubled from `4096` to `8192`
(cli_inner_pretty.js:277501). The parser (`ZE7`/`BE7`), the failure-mode guard, and the `rY8` message are all
**byte-for-byte unchanged** between 2.1.142 and 2.1.156 — the bump is the only behavioral difference on this path.
A second, corroborating change in the same release lengthens the stage-2 reminder prompt to tell the model to
"think for as long as needed", which is precisely the input pressure the larger budget absorbs.

Confidence: **high** that the 4096 → 8192 stage-2 budget delta is real (verified in both bundles, both `pE7`/`yS7`
return `[false,0]` so the additive term is 0 in both). **Medium** that the budget bump is the *sole* fix — the
parser/guard/message are demonstrably unchanged, so the budget is the load-bearing change, but the simultaneous
prompt extension means "raise the ceiling" and "ask for more reasoning" shipped together.

---

## 1. Where this lives in the auto-mode pipeline

```
 tool_use ──► auto-mode wrapper ──► classify action
                                       │
                         ┌─────────────┴──────────────┐
                         │  twoStageClassifier on?     │
                         │  ($i5(): true|"fast"|       │
                         │   "thinking")               │
                         ▼ yes                         ▼ no
              runTwoStageClassifier (en5)    runSingleStageToolUseClassifier (BP$)
              cli_inner_pretty.js:277392      cli_inner_pretty.js:277689
                         │                             │
            ┌────────────┴───────────┐                tool_use call, max_tokens 4096+E
            │                        │                (UNCHANGED in 2.1.156)
        stage 1 (fast/both)      stage 2 (thinking)
        max_tokens 256|64 + V    max_tokens 8192 + V   ◄── THE FIX (was 4096+V)
        cli...:277423            cli...:277501
            │                        │
            ▼                        ▼
        <block>yes|no            <thinking>…</thinking><block>yes|no</block>
            │                        │
            ▼                        ▼
        parseBlockDecision (ZE7) ── strips <thinking> via BE7, matches <block>(yes|no)
            │
        null? ─► failure-mode guard (stop_reason)
            │            │
            │            ├─ refusal OR (empty AND not max_tokens) ─► "policy_refusal"
            │            └─ else (incl. max_tokens cutoff)        ─► "unparseable"
            ▼
        shouldBlock:true, reason = rY8(stage, kind, stop_reason)
        = "Auto mode could not evaluate this action and is blocking it for safety …"
```

There are two classifier code paths that share the same parser and the same `rY8` failure message:

1. **XML two-stage path** — `runTwoStageClassifier` (`en5`) at cli_inner_pretty.js:277392. Used when the
   two-stage classifier is enabled (`$i5()` true / `"fast"` / `"thinking"`, cli_inner_pretty.js:277911-277913).
   This is the path with the bug and the fix.
2. **Single-stage `tool_use` path** — `runSingleStageToolUseClassifier` (`BP$`) at cli_inner_pretty.js:277689.
   Used when the two-stage classifier is *off*. It asks for the verdict via a forced `classify_result` tool call
   rather than XML, and keeps `max_tokens: 4096 + E` (cli_inner_pretty.js:277757) — **unchanged in 2.1.156**
   because the tool-use schema does not require the model to first emit prose reasoning the way the XML thinking
   stage does.

---

## 2. The parser: strip thinking, then match a block tag

The model is instructed (for stage 2) to *think first* and *then* commit to a decision. The parser therefore has
to throw away the thinking and look only at the final `<block>` tag.

### `stripUnterminatedThinking` (`BE7`) — kill both closed and dangling `<thinking>`

**What it does:** Removes every `<thinking>…</thinking>` pair, *and* any trailing `<thinking>` that was never
closed — which is exactly what happens when the model is cut off by `max_tokens` mid-thought.

```javascript
// ============================================
// stripUnterminatedThinking - Remove closed AND unterminated <thinking> blocks
// Location: cli_inner_pretty.js:277337-277339
// ============================================

// ORIGINAL (for source lookup):
function BE7(H) {
  return H.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").replace(/<thinking>[\s\S]*$/, "");
}

// READABLE (for understanding):
function stripUnterminatedThinking(text) {
  return text
    .replace(/<thinking>[\s\S]*?<\/thinking>/g, "")  // remove well-formed thinking pairs
    .replace(/<thinking>[\s\S]*$/, "");               // remove a dangling, never-closed <thinking> to EOF
}

// Mapping: BE7→stripUnterminatedThinking, H→text
```

**Key insight:** The *second* `.replace` is the load-bearing one for this bug. A response that died at the token
ceiling looks like `…<thinking>step 1…step 2…` with no `</thinking>` and no `<block>` after it. The greedy
`/<thinking>[\s\S]*$/` swallows everything from the open tag to end-of-string, leaving an **empty** post-strip
string. There is nothing left for the block regex to match — so the decision parser will return `null`. The parser
is *correct*: a cut-off response genuinely contains no verdict. The defect was upstream — the model was never
given enough room to *reach* the verdict.

### `parseBlockDecision` (`ZE7`) — yes/no, or null when there's no verdict

```javascript
// ============================================
// parseBlockDecision - Extract <block>yes|no after stripping thinking; null if absent
// Location: cli_inner_pretty.js:277340-277343
// ============================================

// ORIGINAL (for source lookup):
function ZE7(H) {
  let $ = [...BE7(H).matchAll(/<block>(yes|no)\b(<\/block>)?/gi)];
  if ($.length === 0) return null;
  return $[0][1].toLowerCase() === "yes";
}

// READABLE (for understanding):
function parseBlockDecision(text) {
  let matches = [...stripUnterminatedThinking(text).matchAll(/<block>(yes|no)\b(<\/block>)?/gi)];
  if (matches.length === 0) return null;          // no verdict emitted → caller treats as failure
  return matches[0][1].toLowerCase() === "yes";   // true = block, false = allow
}

// Mapping: ZE7→parseBlockDecision, H→text
```

Note the tolerant regex: the closing `</block>` is **optional** (`(<\/block>)?`), and the stage-2/stage-1 requests
set `stop_sequences: ["</block>"]` for the XML stages (cli_inner_pretty.js:277430) so the model is expected to be
*halted at* `</block>`. That means a healthy stage response ends `…<block>yes` (the stop sequence chops the close
tag) — the parser deliberately matches an *unterminated* block tag too. The `null` return is reserved for the
genuinely-no-verdict case: the model never wrote `<block>` at all, which is what a `max_tokens` cutoff during
`<thinking>` produces.

### `parseBlockReason` (`GE7`) and `parseThinking` (`an5`)

`parseBlockReason` (`GE7`, cli_inner_pretty.js:277345-277348) pulls the `<reason>…</reason>` text for the
user-facing block message on a *successful* block (`GE7(x) ?? "No reason provided"`, cli_inner_pretty.js:277562).
`parseThinking` (`an5`, cli_inner_pretty.js:277350-277352) extracts the first **well-formed**
`<thinking>…</thinking>` for telemetry (`thinking: an5(x) ?? void 0`, cli_inner_pretty.js:277560) — it uses a
non-global, non-dangling regex, so a cut-off thinking block yields `null` here too. Neither participates in the
failure path; they only run once a verdict was parsed.

---

## 3. The failure-mode guard — why a cutoff becomes "unparseable", not "policy_refusal"

When `parseBlockDecision` returns `null`, the classifier must decide *why* there was no verdict, because that
choice drives both the telemetry `failureKind` and (historically) callers' interpretation. The guard at
cli_inner_pretty.js:277526-277528 (stage 2) is:

```javascript
// ============================================
// stage2NullVerdictGuard - Classify a no-verdict stage-2 response & build the block reason
// Location: cli_inner_pretty.js:277526-277539
// ============================================

// ORIGINAL (for source lookup):
if ((TE6(h, I, E, "stage2"), b7$(L ? [L, h] : [h]), U === null)) {
  let l =
    I.stop_reason === "refusal" || (x === "" && I.stop_reason !== "max_tokens") ? "policy_refusal" : "unparseable";
  return (
    vc("parse_failure", _, { classifierType: M, failureKind: l, durationMs: Q, stage1Attempts: P.count, stage2Attempts: Z.count }),
    {
      shouldBlock: !0,
      reason: rY8("stage 2", l, I.stop_reason),
      failureMode: l,
      /* …usage, stage ids… */
    }
  );
}

// READABLE (for understanding):
if ((logRequest(stage2Request, stage2Resp, stage2Start, "stage2"),
     recordSpend(stage1Request ? [stage1Request, stage2Request] : [stage2Request]),
     stage2Verdict === null)) {
  // Decide the failure kind from stop_reason + emitted text:
  //  - explicit upstream refusal, OR
  //  - nothing was emitted AND it was NOT a token-budget cutoff   → "policy_refusal"
  //  - everything else (incl. ran-out-of-tokens-while-thinking)   → "unparseable"
  let failureKind =
    stage2Resp.stop_reason === "refusal" ||
    (stage2Text === "" && stage2Resp.stop_reason !== "max_tokens")
      ? "policy_refusal"
      : "unparseable";
  emitClassifierOutcome("parse_failure", model, { classifierType, failureKind, /* … */ });
  return {
    shouldBlock: true,
    reason: classifierCouldNotEvaluateReason("stage 2", failureKind, stage2Resp.stop_reason),
    failureMode: failureKind,
    /* …usage, stage ids… */
  };
}

// Mapping: U→stage2Verdict, x→stage2Text, I→stage2Resp, l→failureKind, h→stage2Request,
//          L→stage1Request, vc→emitClassifierOutcome, rY8→classifierCouldNotEvaluateReason
```

**How the guard reads on a token-cutoff:**

| signal on cutoff | value | guard branch |
|---|---|---|
| `stage2Resp.stop_reason` | `"max_tokens"` | not `"refusal"` |
| `stage2Text` (`w9(I.content)`) | non-empty (the partial thinking) | not `""` |
| `stage2Text === "" && stop_reason !== "max_tokens"` | `false` | — |

So both `policy_refusal` conditions are false and the kind is **`"unparseable"`**. That is the *correct*
classification — the response genuinely could not be parsed — and it is exactly why the user saw the
could-not-evaluate block. The guard is not buggy; it is faithfully reporting a truncated response.

**Why two kinds at all (`policy_refusal` vs `unparseable`):** They mean different things operationally.
`policy_refusal` = an upstream safety layer refused to answer the classification prompt (Anthropic-side refusal or
an empty non-truncated response); `unparseable` = the model answered but in a shape the parser cannot read
(garbled, or — pre-fix — truncated). Splitting them lets the telemetry distinguish "the model wouldn't engage"
from "the model engaged but we couldn't read the answer", which is what made the token-budget root cause
diagnosable in the first place: a spike in `failureKind=unparseable` with `stop_reason=max_tokens`.

Note `extractTextBlocks` (`w9`, cli_inner_pretty.js:445034-445038) just concatenates the `text` parts of the
content array, so `stage2Text` (`x`) is everything the model emitted as prose — non-empty whenever the model
started thinking, even if it never reached `<block>`.

### Single-stage `tool_use` variant (cli_inner_pretty.js:277793-277809)

The single-stage path has a structurally identical guard, adapted to the tool-use shape. When no
`classify_result` tool-use block is found, it inspects `stop_reason` and the **content-block array length**:

```javascript
// ============================================
// singleStageNoToolUseGuard - Classify a missing tool_use verdict in the single-stage path
// Location: cli_inner_pretty.js:277792-277817
// ============================================

// ORIGINAL (for source lookup):
if (!Q) {
  let c = C.stop_reason === "refusal" || (C.content.length === 0 && C.stop_reason !== "max_tokens");
  return (
    N(c ? `Auto mode classifier: input blocked by upstream policy (stop_reason=${C.stop_reason})`
        : "Auto mode classifier: No tool use block found", { level: "warn" }),
    vc("parse_failure", V, { failureKind: c ? "policy_refusal" : "no_tool_use", durationMs: b, stage1Attempts: h.count }),
    {
      shouldBlock: !0,
      reason: rY8(c ? "tool_use" : "no tool use block", c ? "policy_refusal" : "unparseable", C.stop_reason),
      failureMode: c ? "policy_refusal" : "unparseable",
      /* …usage… */
    }
  );
}

// READABLE (for understanding):
if (!toolUseBlock) {
  let isPolicyRefusal =
    resp.stop_reason === "refusal" ||
    (resp.content.length === 0 && resp.stop_reason !== "max_tokens");
  emitClassifierOutcome("parse_failure", model, {
    failureKind: isPolicyRefusal ? "policy_refusal" : "no_tool_use",
    durationMs, stage1Attempts: attempts.count,
  });
  return {
    shouldBlock: true,
    reason: classifierCouldNotEvaluateReason(
      isPolicyRefusal ? "tool_use" : "no tool use block",
      isPolicyRefusal ? "policy_refusal" : "unparseable",
      resp.stop_reason),
    failureMode: isPolicyRefusal ? "policy_refusal" : "unparseable",
    /* …usage… */
  };
}

// Mapping: Q→toolUseBlock, c→isPolicyRefusal, C→resp, V→model, b→durationMs, h→attempts,
//          vc→emitClassifierOutcome, rY8→classifierCouldNotEvaluateReason
```

Same three-way split, same `max_tokens`-aware `policy_refusal` test, same `rY8` message. The single-stage telemetry
uses `failureKind: "no_tool_use"` (vs the XML path's `"unparseable"`) but the user-facing `failureMode` collapses
back to `"unparseable"`. Crucially, this path's `max_tokens` is still `4096 + E` (cli_inner_pretty.js:277757),
**not** raised — because a tool-use schema response does not front-load multi-paragraph prose, so the truncation
risk is far lower.

---

## 4. The `rY8` failure-reason builder — a constant message, with diagnostic params

```javascript
// ============================================
// classifierCouldNotEvaluateReason - Build the user-facing could-not-evaluate block reason
// Location: cli_inner_pretty.js:277918-277919
// ============================================

// ORIGINAL (for source lookup):
function rY8(H, $, q) {
  return `${"Auto mode could not evaluate this action and is blocking it for safety"} — run with --debug for details`;
}

// READABLE (for understanding):
function classifierCouldNotEvaluateReason(stageLabel, failureKind, stopReason) {
  // Params are accepted for call-site documentation / future use but NOT interpolated:
  // the surfaced message is intentionally identical regardless of stage/kind/stop_reason.
  return "Auto mode could not evaluate this action and is blocking it for safety — run with --debug for details";
}

// Mapping: rY8→classifierCouldNotEvaluateReason, H→stageLabel, $→failureKind, q→stopReason
```

**What it does:** Produces the single user-facing sentence shown when the classifier cannot produce a verdict.

**Key insight — the params are decorative.** All three arguments (`stageLabel`, `failureKind`, `stopReason`) are
*ignored* in the body; the function always returns the same string. The diagnostic detail (stage, kind,
stop_reason) does **not** go to the user — it goes to telemetry via `emitClassifierOutcome` (`vc`) and to the
`--debug` log, which is why the message says "run with --debug for details". This is a deliberate UX/security
trade-off: surfacing "the classifier ran out of tokens at stage 2 with stop_reason=max_tokens" to an end user is
noise and could leak classifier internals, so the visible text stays generic while the real signal is captured for
operators. The arguments exist so the call sites *self-document* their failure context and so the signature can be
extended later without touching every caller.

**Cross-version:** the 2.1.142 precursor `qz8` (chunks 2.1.142 bundle:338548-338549) returns the identical literal.
The message did not change in 2.1.156 — only the conditions under which it fires got rarer.

---

## 5. Telemetry plumbing — `failureMode` from classifier to decision event

The `failureMode` field threads from the classifier result through two `tengu_auto_mode_decision` emit sites:

- `emitClassifierOutcome` (`vc`, cli_inner_pretty.js:277921-277947) — the per-classifier-call event. It maps
  outcome → an SLI helper (`SH`/`uH`) and emits `tengu_auto_mode_outcome` carrying `failureKind` (the internal
  `"unparseable"` / `"policy_refusal"` / `"no_tool_use"` value):

```javascript
// ============================================
// emitClassifierOutcome - Map classifier outcome to SLI counters + tengu_auto_mode_outcome
// Location: cli_inner_pretty.js:277921-277947
// ============================================

// ORIGINAL (for source lookup):
function vc(H, $, q) {
  let { classifierType: K, failureKind: _, errorKind: z, ...A } = q ?? {};
  switch (H) {
    case "success": SH("permission_auto_mode_classifier"); break;
    case "error": uH("permission_auto_mode_classifier", z ?? "classifier_api_error"); break;
    case "transcript_too_long": uH("permission_auto_mode_classifier", "transcript_too_long"); break;
    case "parse_failure": uH("permission_auto_mode_classifier", _ ?? "parse_failure"); break;
    case "interrupted": break;
  }
  d("tengu_auto_mode_outcome", { outcome: H, classifierModel: $,
    ...(K !== void 0 && { classifierType: K }),
    ...(_ !== void 0 && { failureKind: _ }),
    ...(z !== void 0 && { errorKind: z }), ...A });
}

// READABLE (for understanding):
function emitClassifierOutcome(outcome, classifierModel, fields) {
  let { classifierType, failureKind, errorKind, ...rest } = fields ?? {};
  switch (outcome) {
    case "success":            sliOk("permission_auto_mode_classifier"); break;
    case "error":              sliFail("permission_auto_mode_classifier", errorKind ?? "classifier_api_error"); break;
    case "transcript_too_long":sliFail("permission_auto_mode_classifier", "transcript_too_long"); break;
    case "parse_failure":      sliFail("permission_auto_mode_classifier", failureKind ?? "parse_failure"); break;
    case "interrupted":        break;
  }
  logEvent("tengu_auto_mode_outcome", {
    outcome, classifierModel,
    ...(classifierType !== undefined && { classifierType }),
    ...(failureKind   !== undefined && { failureKind }),
    ...(errorKind     !== undefined && { errorKind }),
    ...rest,
  });
}

// Mapping: vc→emitClassifierOutcome, H→outcome, $→classifierModel, q→fields, K→classifierType,
//          _→failureKind, z→errorKind, SH→sliOk, uH→sliFail, d→logEvent
```

- The downstream decision events stamp `classifierFailureMode: result.failureMode` so a blocked decision can be
  attributed to the *kind* of failure rather than a genuine policy judgement:
  - sub-agent handoff classifier — `classifierFailureMode: Y.failureMode` (cli_inner_pretty.js:279229)
  - main tool-use auto-mode decision — `classifierFailureMode: Z.failureMode` (cli_inner_pretty.js:442480)

This is the observability that made the bug *findable*: an operator watching `tengu_auto_mode_outcome` would see a
population of `outcome=parse_failure, failureKind=unparseable` correlated with `stop_reason=max_tokens`, and a
matching population of `tengu_auto_mode_decision` with `decision=blocked, classifierFailureMode=unparseable`. That
is the fingerprint of "blocked because we ran out of tokens", which is precisely the changelog symptom.

---

## 6. The root-cause fix — stage-2 `max_tokens` 4096 → 8192

The stage-2 request object is built at cli_inner_pretty.js:277497-277510. The single changed line vs 2.1.142:

```javascript
// ============================================
// stage2ClassifierRequest - Stage-2 (thinking) classifier request; max_tokens is the fix
// Location: cli_inner_pretty.js:277497-277510  (precursor: 2.1.142 bundle:338132-338145)
// ============================================

// ORIGINAL (2.1.142 — BEFORE, chunks line 338134-338136):
h = {
  model: _,
  max_tokens: 4096 + V,          // ◄── too small: model truncated mid-<thinking> on hard cases
  system: w,
  /* … */
};

// ORIGINAL (2.1.156 — AFTER, cli_inner_pretty.js:277499-277501):
h = {
  model: _,
  max_tokens: 8192 + V,          // ◄── doubled: room to finish reasoning AND emit <block>
  system: j,
  /* … */
};

// READABLE (for understanding):
let stage2Request = {
  model: classifierModel,
  max_tokens: 8192 + extraThinkingTokens,   // extraThinkingTokens (V) is 0 — see thinkingBudgetForModel
  system: classifierSystemPrompt,
  skipSystemPromptPrefix: true,
  temperature: 0,
  thinking: thinkingConfig,                 // false — classifier does NOT use API extended-thinking
  messages: [...transcriptMessages, { role: "user", content: stage2UserContent }],
  maxRetries: CLASSIFIER_MAX_RETRIES,
  querySource: "auto_mode",
  extraBodyParams: classifierExtraBodyParams(),
};

// Mapping: h→stage2Request, _→classifierModel, V→extraThinkingTokens, j/w→classifierSystemPrompt,
//          G→thinkingConfig, cY8→CLASSIFIER_MAX_RETRIES
```

**Why `+ V` doesn't move the comparison:** the budget is `8192 + V` where `[G, V] = pE7(_)`
(cli_inner_pretty.js:277403). `thinkingBudgetForModel` (`pE7`, cli_inner_pretty.js:277389-277391) returns
`[false, 0]` — i.e. the classifier never enables API extended-thinking and `V` is always `0`. The 2.1.142 precursor
`yS7` (chunks 2.1.142 bundle:338024-338025) *also* returns `[false, 0]`. So the effective budget cleanly went from
**4096 → 8192**; nothing else in the additive term changed. (Confirmed by `grep "max_tokens: 8192"` returning only
the stage-2 site in 2.1.156, and `grep "max_tokens: 4096"` matching the unchanged single-stage site at 277757 plus
an unrelated site at 643019.)

### Why the budget mattered specifically for stage 2

Stage 2 is the **thinking** stage. Its reminder prompt `stage2ThinkingReminder` (`on5`,
cli_inner_pretty.js:277995-277996) literally tells the model to reason at length before committing:

> "…Use `<thinking>` before responding with `<block>`. Think for as long as needed — at least several paragraphs
> for ambiguous or borderline actions; do not cut your reasoning short on hard cases."

Compare the 2.1.142 precursor `bF_` (chunks 2.1.142 bundle:338625-338626), which stopped at:

> "…Use `<thinking>` before responding with `<block>`."

**The 2.1.156 release did two complementary things at once:**

1. **Asked for more reasoning** — appended "Think for as long as needed … do not cut your reasoning short on hard
   cases" to `on5` (a new sentence vs 2.1.142).
2. **Raised the ceiling** — doubled `max_tokens` to 8192 so the longer reasoning fits *plus* the trailing
   `<block>` verdict.

Step 1 alone would have *worsened* the truncation bug; step 2 is the safety valve. Together they let the classifier
think harder on hard cases (improving correctness) without hitting the cutoff that produced the false block.

Stage 1, by contrast, is deliberately terse — its reminders (`in5` / `rn5`, cli_inner_pretty.js:277991-277994) say
"`<block>` immediately" and its budget is tiny (`256` for fast, `64` for both, cli_inner_pretty.js:277423) with a
`</block>` stop sequence. Stage 1 cannot meaningfully run out of tokens because it is told *not* to reason. That is
why only stage 2's budget needed raising.

### Why not just make the parser tolerate a missing block?

An alternative fix would be: if `stop_reason === "max_tokens"` and no `<block>` was parsed, **retry** or **fall
back to allow**. That was *not* chosen, and for good reason:

- **Falling back to allow is unsafe.** A truncated reasoning trace might have been *heading toward a block*. The
  classifier's whole contract is fail-closed (`shouldBlock: true` on every uncertainty). Auto-allowing on cutoff
  would open an exfiltration/destructive-action hole exactly where the model found the case *hard enough to reason
  about at length* — i.e. the highest-risk cases.
- **Retrying is expensive and non-deterministic.** Each stage is already a full extra API call per tool use; adding
  speculative retries on truncation multiplies cost and latency on precisely the slow, hard cases.
- **Doubling the budget is cheap and deterministic.** `temperature: 0` plus 8192 tokens is enough headroom for
  even multi-paragraph reasoning to terminate with a verdict, while only paying for the tokens actually generated
  (output billing is per token emitted, not per `max_tokens`). It fixes the *cause* (insufficient room) rather than
  papering over the *symptom* (no verdict).

**Key insight:** The bug was a budget/observability story, not a parser story. The parser correctly refused to
invent a verdict from a truncated response, and the fail-closed guard correctly blocked. The real defect was that
the classifier was being asked to think on hard cases but not given the tokens to finish — visible only because the
team had already instrumented `failureKind` + `stop_reason`. The minimal, deterministic, fail-closed-preserving fix
is to widen the ceiling, which is exactly what 2.1.156 did.

---

## 7. End-to-end walkthrough: a safe-but-hard action under both versions

Consider an ambiguous-looking but ultimately safe action (e.g. a complex `git` command the model must reason about
to confirm it isn't pushing secrets to a remote). It reaches stage 2.

**Under 2.1.142 (`max_tokens: 4096`):**

```
1. Stage 2 prompt: "Use <thinking> before <block>."
2. Model opens <thinking>, writes several paragraphs weighing the action.
3. At ~4096 output tokens it is cut off:  stop_reason = "max_tokens",
   content = "…<thinking>para1…para2…para3"  (no </thinking>, no <block>)
4. parseBlockDecision: BE7 strips the dangling <thinking> → ""; no <block> match → null
5. Guard: stop_reason==="max_tokens" and text!=="" → failureKind = "unparseable"
6. Result: shouldBlock=true, reason=rY8(...) = "could not evaluate … blocking for safety"
   → SAFE action BLOCKED (the bug)
```

**Under 2.1.156 (`max_tokens: 8192`, plus "think for as long as needed"):**

```
1. Stage 2 prompt: "Use <thinking> before <block>. Think for as long as needed …"
2. Model reasons at length (now encouraged to) — but within 8192 tokens it finishes:
   "…</thinking><block>no</block>"  (stop_reason = "stop_sequence" at "</block>")
3. parseBlockDecision: strips <thinking>, matches <block>no → false (allow)
4. Result: shouldBlock=false, reason="…", stage="thinking"  → SAFE action ALLOWED (fixed)
```

The only structural difference between these two traces is the ceiling at step 2/3. Everything else — the prompt
shape, the parser, the guard, the message — is shared code.

---

## 8. Confidence & cross-validation summary

| Claim | Evidence | Confidence |
|---|---|---|
| Stage-2 budget 4096 → 8192 | 2.1.142:338136 (`4096 + V`) vs 2.1.156:277501 (`8192 + V`); `grep max_tokens: 8192` unique to stage-2 | **high** |
| Additive term `V`/`E` is 0 in both | `pE7`→`[!1,0]` (277390-277391); `yS7`→`[!1,0]` (2.1.142:338024-338025) | **high** |
| Parser `ZE7`/`BE7` unchanged | identical bodies 277337-277343 vs 2.1.142 equivalents | **high** |
| Failure-mode guard unchanged | 277526-277528 vs 2.1.142:338161-338163 (byte-identical predicate) | **high** |
| `rY8` message unchanged | 277918-277919 vs `qz8` 2.1.142:338548-338549 (identical literal) | **high** |
| Single-stage `tool_use` budget unchanged (4096) | 277757 (`4096 + E`) vs 2.1.142:338392 (`4096 + E`) | **high** |
| Stage-2 prompt gained "think for as long as needed" | `on5` 277995-277996 vs `bF_` 2.1.142:338625-338626 | **high** |
| Budget bump is the *sole* behavioral fix on this path | parser/guard/message unchanged; only budget + prompt extension differ | **medium** |

No 2.1.88 precursor exists for this exact two-stage XML classifier path: the two-stage `hard_deny` classifier was
introduced in v2.1.136 (per the 2.1.142 reference docs), well after the 2.1.88 readable source under
`/lyz/codespace/3rd/claude-code/src/`. This module delta is therefore **post-2.1.88 with no readable precursor** to
cross-check against; the cross-validation above is 2.1.142-vs-2.1.156 only.

---

## 9. Pre-completion checklist

- [x] No mapping tables in this module doc — list-format symbol refs only
- [x] Code snippets use the header `====` block + ORIGINAL + READABLE + Mapping
- [x] Every cited `cli_inner_pretty.js:<line>` was read in the 2.1.156 bundle (and 2.1.142 bundle for precursors)
- [x] New symbols recorded for `symbol_index_infra_platform.md` (Permissions/Auto-mode classifier section)
