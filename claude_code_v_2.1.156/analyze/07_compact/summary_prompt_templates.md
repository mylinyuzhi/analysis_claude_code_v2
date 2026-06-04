# Summary meta-prompt templates (v2.1.156)

## Overview

When the agent loop decides to compact a conversation — manually via `/compact`, automatically when the context window fills (auto-compact), reactively to shave a proactive token gap, or via the `/rewind`-style partial/range compaction — it does not simply truncate. It replaces the long conversation with a single **seed** message that the next turn reads as if resuming from a saved game. That seed is produced by sending the model a carefully tuned **meta-prompt** that instructs it to write a structured plain-text summary, then post-processing the model's output and prepending a fixed continuation header.

This document covers the meta-prompt layer of that pipeline in v2.1.156: the three prompt-builder entry points, the four distinct body templates, the shared no-tools scaffolding that sandwiches every body, the 9-section summary contract, the v2.1.156 security-preservation clause, the `<analysis>`/`<summary>` two-block structure, the `xc5` extraction step, and the `jP$` seed builder. Where it plugs into the loop: the three callers — `runFullCompact` (`_eH`) at `cli_inner_pretty.js:423130+`, `runPartialCompact` (`qX4`) at `cli_inner_pretty.js:423340+`, and `runReactiveCompactSummarize` (`uc5`) at `cli_inner_pretty.js:271156` — each build a prompt with one of the three builders, run a single-turn summarizer fork, then call `buildCompactSummarySeed` (`jP$`) to produce the replacement user message that is spliced into the rebuilt context.

### The three builders and four body templates

| Builder (obf) | Path | Body template used | Seed builder |
|---|---|---|---|
| `buildFullCompactPrompt` (`bA8`) @270917 | standard full compact (`/compact`, auto-compact) via `_eH` @423154 | full inline `BASE_COMPACT_PROMPT` (built inline inside `bA8`) | `jP$` @423239 |
| `buildPartialCompactPrompt` (`Cv7`) @270824 | partial / range compact via `qX4` @423373 | `direction==="up_to"` -> inline up_to template @270835; else -> `bc5` (partial-from) @271076 | `jP$` @423468 |
| `buildFullCompactPrompt` (`bA8`) @270917 | reactive compact (proactive token-gap shaving) via `uc5` @271157 | same full `BASE_COMPACT_PROMPT` | `jP$` @271217 |

All four bodies share the same scaffolding:

- `NO_TOOLS_PREAMBLE` — the `CRITICAL: Respond with TEXT ONLY` block, prepended. In v2.1.156 it is literally inlined into both `bA8` (`cli_inner_pretty.js:270919-270925`) and `Cv7` (`cli_inner_pretty.js:270826-270832`) rather than referenced as a named constant.
- `NO_TOOLS_TRAILER` (`Iv7`) — the closing reminder, appended (`K += Iv7` @270915, `$ += Iv7` @271029, defined @271150-271154).
- An optional `Additional Instructions:` block injected from custom compact instructions (`if (H && H.trim()!=="") ... ${H}` @270910-270914 and @271024-271028).

---

## Template selection by compact direction (the `Cv7` dispatcher)

### What it does

Picks which body meta-prompt to send to the summarizer model based on whether compaction is keeping the head (`up_to`) or the tail (`from`), and whether it is a full compact.

### How it works

1. The standard full path (`runFullCompact` / `_eH` @423154) and the reactive path (`runReactiveCompactSummarize` / `uc5` @271157) both call `bA8(custom)`, which **always** emits the full `BASE_COMPACT_PROMPT` (whole-conversation scope; sections 8/9 = **Current Work** / **Optional Next Step**).
2. The partial/range path (`runPartialCompact` / `qX4` @423373) calls `Cv7(custom, direction)`.
3. Inside `Cv7` (@270909): if `direction === "up_to"`, it inlines the @270835 continuation template (sections 8/9 = **Work Completed** / **Context for Continuing Work**); otherwise it uses `bc5` (@271076), the partial-from template scoped to "the RECENT portion".
4. All three builders prepend `NO_TOOLS_PREAMBLE`, optionally inject `Additional Instructions:\n${custom}`, and append the `Iv7` trailer.

The default param `$ = "from"` means a bare `Cv7(custom)` produces the partial-from prompt.

### Why this approach

The model's final two sections must match what it can actually see. The `up_to` template shows the model only the **prefix** of the conversation, and newer (unseen) messages will follow *after* the summary, so "Optional Next Step" with verbatim quotes would be meaningless — "Context for Continuing Work" (state to carry forward) is what's useful. The `from`/full templates show the tail/all, where "Optional Next Step" with verbatim quotes prevents task drift. Reusing one builder with a `direction` param instead of three fully separate functions keeps the preamble/trailer/custom-instruction wiring DRY.

### Key insight

It is not just "partial vs full" — it is a **three-way** split where the `up_to` (continuation) template uniquely swaps sections 8 and 9 from action-oriented (Current Work / Optional Next Step) to state-oriented (Work Completed / Context for Continuing Work), precisely because the model is blind to the messages that will follow its summary.

```javascript
// ============================================
// buildPartialCompactPrompt - Direction dispatcher for partial/range compact
// Location: cli_inner_pretty.js:270824-270916
// ============================================

// ORIGINAL (for source lookup):
function Cv7(H, $ = "from") {
  let K =
    `CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.\n\n- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.\n- You already have all the context you need in the conversation above.\n- Tool calls will be REJECTED and will waste your only turn — you will fail the task.\n- Your entire response must be plain text: an <analysis> block followed by a <summary> block.\n\n` +
    ($ === "up_to"
      ? `Your task is to create a detailed summary of this conversation. This summary will be placed at the start of a continuing session; ... 8. Work Completed: ... 9. Context for Continuing Work: ...`
      : bc5);
  if (H && H.trim() !== "")
    K += `\n\nAdditional Instructions:\n${H}`;
  return ((K += Iv7), K);
}

// READABLE (for understanding):
function buildPartialCompactPrompt(customInstructions, direction = "from") {
  let prompt = NO_TOOLS_PREAMBLE +
    (direction === "up_to"
      ? PARTIAL_COMPACT_UP_TO_PROMPT   // inline @270835: ends with Work Completed / Context for Continuing Work
      : PARTIAL_COMPACT_FROM_PROMPT);  // bc5 @271076: scoped to the RECENT portion
  if (customInstructions && customInstructions.trim() !== "")
    prompt += `\n\nAdditional Instructions:\n${customInstructions}`;
  prompt += NO_TOOLS_TRAILER;          // Iv7
  return prompt;
}

// Mapping: Cv7->buildPartialCompactPrompt, H->customInstructions, $->direction, K->prompt, bc5->PARTIAL_COMPACT_FROM_PROMPT, Iv7->NO_TOOLS_TRAILER; inline string->PARTIAL_COMPACT_UP_TO_PROMPT
```

---

## The four body templates and their differences

### 1. Full / BASE template — `bA8(H)` @270917-270930

Opening line (@270927):

> "Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions. / This summary should be thorough in capturing technical details, code patterns, and architectural decisions that would be essential for continuing development work without losing context."

This is the unscoped variant — it covers the **entire** conversation. Its 9 sections (@270948-270957) are:

1. Primary Request and Intent
2. Key Technical Concepts
3. Files and Code Sections
4. Errors and fixes
5. Problem Solving
6. All user messages
7. Pending Tasks
8. **Current Work**
9. **Optional Next Step**

It is the only template that ends with the "There may be additional summarization instructions provided in the included context" block plus the two `## Compact Instructions` / `# Summary instructions` worked examples (@271013-271022).

```javascript
// ============================================
// buildFullCompactPrompt - Builds the full/BASE compact meta-prompt (whole-conversation scope)
// Location: cli_inner_pretty.js:270917-270930 (template body 270927-271022)
// ============================================

// ORIGINAL (for source lookup):
function bA8(H) {
  let $ =
    `CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.\n\n- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.\n...\n` +
    `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.\n... 6. All user messages: List ALL user messages that are not tool results. These are critical ... Preserve any security-relevant instructions or constraints verbatim so they remain in effect after compaction.\n... 8. Current Work: ...\n9. Optional Next Step: ...`;
  if (H && H.trim() !== "")
    $ += `\n\nAdditional Instructions:\n${H}`;
  return (($ += Iv7), $);
}

// READABLE (for understanding):
function buildFullCompactPrompt(customInstructions) {
  let prompt = NO_TOOLS_PREAMBLE + BASE_COMPACT_PROMPT; // whole-conversation scope, 9 sections incl. Current Work + Optional Next Step + security-preservation clause
  if (customInstructions && customInstructions.trim() !== "")
    prompt += `\n\nAdditional Instructions:\n${customInstructions}`;
  prompt += NO_TOOLS_TRAILER; // Iv7
  return prompt;
}

// Mapping: bA8->buildFullCompactPrompt, H->customInstructions, $->prompt, Iv7->NO_TOOLS_TRAILER; equivalent to v2.1.88 getCompactPrompt + BASE_COMPACT_PROMPT
```

### 2. Partial-from template — `bc5` @271076-271149

Opening line (@271076):

> "Your task is to create a detailed summary of the RECENT portion of the conversation — the messages that follow earlier retained context. The earlier messages are being kept intact and do NOT need to be summarized. Focus your summary on what was discussed, learned, and accomplished in the recent messages only."

Used when `qX4` runs with `direction === "from"` (summarize the tail, keep the head). The analysis-instruction sub-block is reworded to "Analyze the **recent messages** chronologically" (@271080) rather than "each message and section of the conversation". Sections 1, 2, 6, 7 are scoped to "the recent messages"; sections 8 (Current Work) and 9 (Optional Next Step) are retained. Closing line (@271148): "Please provide your summary based on the RECENT messages only (after the retained earlier context)…".

Note this body is the lazily-initialized module var `bc5`, assigned inside `MN6 = T(() => {...})` @271075 — `T(...)` is the standard lazy-module-init wrapper, so the giant string is only materialized on first use.

### 3. Partial-up_to template — inline in `Cv7` @270835-270908

Opening — note the quoted clause below is the **second sentence**, not the literal opening words. Line 270835 begins:

> "Your task is to create a detailed summary of this conversation. **This summary will be placed at the start of a continuing session; newer messages that build on this context will follow after your summary (you do not see them here).** Summarize thoroughly so that someone reading only your summary and then the newer messages can fully understand what happened and continue the work."

This is the **continuation** variant. It is selected when `qX4` runs with `direction === "up_to"`: the model sees only the **prefix** of the conversation (the part being summarized), and the kept recent messages will follow *after* the summary. Because the model cannot see what comes next, its final two sections differ from the full/partial-from templates: instead of "Current Work" + "Optional Next Step", it uses **(8) Work Completed** (@270862) and **(9) Context for Continuing Work** (@270863).

This matters: an "Optional Next Step" with verbatim quotes would be meaningless when newer (unseen) messages will immediately follow, so the up_to template asks for *state to carry forward* instead of *what to do next*.

### 4. (v2.1.88 only) `PARTIAL_COMPACT_PROMPT` "from" variant

In the older readable source this `from` body was a separate named constant `PARTIAL_COMPACT_PROMPT`. In v2.1.156 the equivalent is `bc5`. See the cross-validation section for the full constant-rename map.

### Selection logic — `Cv7` @270824, @270909

```javascript
function Cv7(H, $ = "from") {
  let K = preamble + ($ === "up_to" ? <inline up_to template> : bc5);
  if (H && H.trim() !== "") K += "\n\nAdditional Instructions:\n" + H;
  return (K += Iv7), K;   // append no-tools trailer
}
```

So `Cv7` is the **partial dispatcher**: `up_to` -> continuation template (the @270835 string); anything else (`from`) -> `bc5`.

---

## The two-block `<analysis>`/`<summary>` contract with the no-tools sandwich

### What it does

Forces the model to (a) never call a tool and (b) emit a chain-of-thought scratchpad in `<analysis>` followed by the real deliverable in `<summary>`, structured as 9 numbered sections.

### How it works

1. `NO_TOOLS_PREAMBLE` is prepended (@270826 / @270919) with explicit rejection-consequence language.
2. The body says "wrap your analysis in `<analysis>` tags" (@270837 / @270930) and gives a bracketed-placeholder `<example>` of both blocks (@270867-270905 / @270961-271009).
3. The `Iv7` trailer is appended (@271151) repeating the no-tools + two-block rule.
4. The summarization fork runs with `maxTurns: 1` (`uc5` @271167) and inherits the parent's tool set for cache-key parity.

#### No-tools preamble (verbatim, @270826-270831 / @270919-270924)

> "CRITICAL: Respond with TEXT ONLY. Do NOT call any tools."
> "- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool."
> "- You already have all the context you need in the conversation above."
> "- Tool calls will be REJECTED and will waste your only turn — you will fail the task."
> "- Your entire response must be plain text: an <analysis> block followed by a <summary> block."

#### No-tools trailer — `Iv7` (verbatim, @271151-271154)

> "REMINDER: Do NOT call any tools. Respond with plain text only — an <analysis> block followed by a <summary> block. Tool calls will be rejected and you will fail the task."

The preamble and trailer **sandwich** the body — the no-tool instruction appears first AND last.

#### The two-block structure (@270837 / @270930)

> "Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points."

The `<analysis>` block is an explicit chain-of-thought scratchpad: chronologically walk each message and identify the user's requests, the assistant's approach, key decisions/concepts/patterns, specific details (file names, full code snippets, function signatures, file edits), errors+fixes, and special user feedback (@270839-270849 / @270932-270942). Then `<summary>` holds the actual deliverable (the 9 numbered sections). The example output (@270867-270905 / @270961-271009) shows both blocks with bracketed placeholders so the model knows the exact shape.

### Why this approach

The summarization fork must keep the **same prompt-cache prefix** as the parent to get a cache hit, which means it cannot simply remove the tools from the request; so it instead instructs the model out of using them. The v2.1.88 engineering comment (prompt.ts:12-18) quantifies the failure mode: on Sonnet 4.6 adaptive-thinking models the model attempts a tool call **2.79%** of the time (vs **0.01%** on 4.5) despite a weaker trailer, and with `maxTurns: 1` a denied tool call yields no text output, so the call falls through to the streaming fallback. Putting the prohibition FIRST and LAST, with concrete consequences, drives the rate down. That comment is stripped in the minified v2.1.156 build, but the design it justified (preamble-first + trailer-last sandwich; `maxTurns: 1` @271167) is fully preserved.

### Key insight

The no-tools instruction is duplicated at both ends of the prompt on purpose — recency and primacy both matter for instruction-following, and a single wasted turn is fatal because the summarizer only gets one (`maxTurns: 1`).

---

## The security / sensitive-instruction preservation clause

This is a notable v2.1.156 addition (absent from the v2.1.88 readable build). It appears in **two** places per template.

1. Inside the analysis instructions (@270850 / @270943 / @271091):
   > "Note any security-relevant instructions or constraints the user stated (e.g., sensitive files or data to avoid, operations that must not be performed, credential or secret handling rules). These MUST be preserved verbatim in the summary so they continue to apply after compaction."

2. Inside the "All user messages" section #6 (@270860 / @270953 / @271101):
   > "Preserve any security-relevant instructions or constraints verbatim so they remain in effect after compaction."

**Why two placements:** the analysis-instruction copy ensures the model *notices* such constraints while reasoning; the section-6 copy ensures they actually *land* in the persisted summary. Only the `<summary>` content survives compaction (see `xc5` below), so a clause that lived only in the `<analysis>` instructions would influence the draft but not necessarily appear in the kept text. Without this clause, a security rule like "never read .env" stated 100 messages ago would be silently dropped at compaction and the post-compaction agent would have no memory of it.

---

## Summary extraction & normalization — `xc5(H)` @271031-271052

### What it does

Turns the raw model output (which contains `<analysis>…</analysis>` + `<summary>…</summary>`) into clean summary text that becomes the conversation seed.

### How it works

Three regex operations:

1. `$.replace(/<analysis>[\s\S]*?<\/analysis>/, "")` @271033 — **drop the analysis scratchpad entirely.** It improved summary quality but has zero informational value once the summary is written, and keeping it would waste context tokens.
2. `$.match(/<summary>([\s\S]*?)<\/summary>/)` @271034, then replace the whole `<summary>…</summary>` with `"Summary:\n" + K.trim()` @271037-271041 — **unwrap the summary**, capturing group 1 and re-emitting it under a plain `Summary:` header (XML tags removed).
3. `$.replace(/\n\n+/g, "\n\n")` @271044-271049 then `.trim()` @271050 — collapse runs of 3+ newlines to exactly 2, then trim. This normalizes whitespace left behind by stripping the analysis block.

Both the analysis-strip and the summary-match are non-greedy (`*?`) and single-shot (no `g` flag), so only the first `<analysis>`/`<summary>` pair is processed — if the model emits stray tags inside the summary they survive as literal text.

### Why this approach

The `<analysis>` CoT improves summary quality but is pure overhead in the persisted context, so it is discarded. Re-emitting `<summary>` as a plain `Summary:` header avoids leaking XML scaffolding into the model's future context (which could confuse it into thinking the tags are still meaningful). Non-greedy / single-shot regexes avoid eating content if the model emits stray tags.

### Key insight

Only the `<summary>` content survives compaction — which is exactly why the security-preservation clause is restated inside section 6 (the part that lands in `<summary>`) and not only in the `<analysis>` instructions.

**Edge case:** if the model omits `<summary>` tags entirely, step 2's `match` returns null, the `if (q)` is skipped, and the raw text (minus any analysis block) passes through. So a malformed response still produces *some* seed rather than crashing.

```javascript
// ============================================
// formatCompactSummary - Strip <analysis>, unwrap <summary> into a "Summary:" header, normalize whitespace
// Location: cli_inner_pretty.js:271031-271052
// ============================================

// ORIGINAL (for source lookup):
function xc5(H) {
  let $ = H;
  $ = $.replace(/<analysis>[\s\S]*?<\/analysis>/, "");
  let q = $.match(/<summary>([\s\S]*?)<\/summary>/);
  if (q) {
    let K = q[1] || "";
    $ = $.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:\n${K.trim()}`);
  }
  return (($ = $.replace(/\n\n+/g, `\n\n`)), $.trim());
}

// READABLE (for understanding):
function formatCompactSummary(raw) {
  let out = raw;
  out = out.replace(/<analysis>[\s\S]*?<\/analysis>/, ""); // drop CoT scratchpad
  const m = out.match(/<summary>([\s\S]*?)<\/summary>/);
  if (m) {
    const content = m[1] || "";
    out = out.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:\n${content.trim()}`);
  }
  out = out.replace(/\n\n+/g, "\n\n"); // collapse blank-line runs
  return out.trim();
}

// Mapping: xc5->formatCompactSummary, H->raw, $->out, q->m, K->content; byte-identical regex logic to v2.1.88 formatCompactSummary
```

---

## Replacement-seed assembly — `jP$(H, $, q, K, _)` @271053-271073

### What it does

Wraps the extracted summary into the single user-visible `isCompactSummary` message that replaces the compacted conversation, with conditional trailers for transcript path, preserved recent messages, cleared REPL state, and auto-continuation.

### How it works

Parameters (recovered from the v2.1.88 `getCompactUserSummaryMessage` signature + the call sites @423239 / @271217):

- `H` = raw summary string (passed straight into `xc5(H)` @271056)
- `$` = `suppressFollowUpQuestions` — if truthy, appends the "Continue the conversation from where it left off without asking… Resume directly — do not acknowledge the summary…" continuation directive @271069-271071
- `q` = `transcriptPath` — if set, appends "If you need specific details from before compaction … read the full transcript at: ${q}" @271058-271060
- `K` = `recentMessagesPreserved` — if set, appends "Recent messages are preserved verbatim." @271062-271064
- `_` = `replStateCleared` — **NEW in v2.1.156** — if set, appends "Your REPL VM state has been cleared as part of this compaction. Variables defined in REPL calls before this point are no longer accessible — redefine any you still need." @271066-271068

Fixed header (always present, @271054):

> "This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation."

The resulting message is created with `T8({ content: jP$(...), isCompactSummary: !0, isVisibleInTranscriptOnly: !0 })` (@423239, @271217). `isCompactSummary` flags it so the rest of the system treats it as the compaction boundary; `isVisibleInTranscriptOnly` keeps it out of the live UI render in some code paths.

At the call sites the flags are derived: `$H = yZ() && MJ$($.getReplContexts(), $.agentId)` @423238 feeds `_` (the REPL flag), and `o = iA()` @423237 feeds `q` (transcript path). The standard path passes `K` (suppress-questions) through from `_eH`; the reactive path hard-codes suppress = `!0` (jP$'s 2nd arg, @271217); the partial path (qX4 @423468) hard-codes suppress = `!1` (false), so a partial/range compact never appends the auto-continuation directive.

### Why this approach

Each trailer is independently optional because the caller knows the runtime situation (was a transcript saved? were recent messages kept? was a REPL active? is this autonomous mode?). Conditionally appending avoids stating false things (e.g. promising a transcript that doesn't exist). The "Resume directly — do not acknowledge the summary" wording prevents the post-compaction model from wasting a turn narrating that a summary happened — without it, models routinely respond to the seed with "Sounds good! What would you like to work on next?".

### Key insight

The order of conditional appends is fixed (transcript -> preserved -> REPL -> continuation), and the continuation directive is mutually-exclusive-by-position: it always comes last so "Pick up the last task as if the break never happened" is the final instruction the resumed model reads.

```javascript
// ============================================
// buildCompactSummarySeed - Build the isCompactSummary replacement user message
// Location: cli_inner_pretty.js:271053-271073
// ============================================

// ORIGINAL (for source lookup):
function jP$(H, $, q, K, _) {
  let A = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.\n\n${xc5(H)}`;
  if (q) A += `\n\nIf you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${q}`;
  if (K) A += `\n\nRecent messages are preserved verbatim.`;
  if (_) A += `\n\nYour REPL VM state has been cleared as part of this compaction. Variables defined in REPL calls before this point are no longer accessible — redefine any you still need.`;
  if ($) return `${A}\nContinue the conversation from where it left off without asking the user any further questions. Resume directly — do not acknowledge the summary, do not recap what was happening, do not preface with "I'll continue" or similar. Pick up the last task as if the break never happened.`;
  return A;
}

// READABLE (for understanding):
function buildCompactSummarySeed(rawSummary, suppressFollowUpQuestions, transcriptPath, recentMessagesPreserved, replStateCleared) {
  let msg = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.\n\n${formatCompactSummary(rawSummary)}`;
  if (transcriptPath) msg += `\n\nIf you need specific details from before compaction ... read the full transcript at: ${transcriptPath}`;
  if (recentMessagesPreserved) msg += `\n\nRecent messages are preserved verbatim.`;
  if (replStateCleared) msg += `\n\nYour REPL VM state has been cleared as part of this compaction. ... redefine any you still need.`;
  if (suppressFollowUpQuestions) return `${msg}\nContinue the conversation from where it left off without asking the user any further questions. Resume directly ...`;
  return msg;
}

// Mapping: jP$->buildCompactSummarySeed, H->rawSummary, $->suppressFollowUpQuestions, q->transcriptPath, K->recentMessagesPreserved, _->replStateCleared, A->msg; corresponds to v2.1.88 getCompactUserSummaryMessage but adds the replStateCleared parameter
```

---

## Lazy module initialization — `bc5` / `Iv7` via `MN6`

The partial-from body and the trailer are not eagerly constructed. They are declared as bare module vars and assigned inside a lazy-init thunk wrapped by `T(() => {...})`. This keeps the very large template strings out of memory until the first compaction actually needs them.

```javascript
// ============================================
// initCompactPromptModule - Lazy-init of the partial-from body and the no-tools trailer
// Location: cli_inner_pretty.js:271074-271155
// ============================================

// ORIGINAL (for source lookup):
var bc5, Iv7;
var MN6 = T(() => {
  ((bc5 = `Your task is to create a detailed summary of the RECENT portion of the conversation — ...`),
    (Iv7 = `\n\nREMINDER: Do NOT call any tools. Respond with plain text only — ` + "an <analysis> block followed by a <summary> block. Tool calls will be rejected and you will fail the task."));
});

// READABLE (for understanding):
let PARTIAL_COMPACT_FROM_PROMPT, NO_TOOLS_TRAILER;
const initCompactPromptModule = lazyInit(() => {
  PARTIAL_COMPACT_FROM_PROMPT = `Your task is to create a detailed summary of the RECENT portion of the conversation — ...`;
  NO_TOOLS_TRAILER = "\n\nREMINDER: Do NOT call any tools. Respond with plain text only — an <analysis> block followed by a <summary> block. Tool calls will be rejected and you will fail the task.";
});

// Mapping: bc5->PARTIAL_COMPACT_FROM_PROMPT, Iv7->NO_TOOLS_TRAILER, MN6->initCompactPromptModule, T->lazyInit
```

---

## Helpers that locate the produced summary

- `findSummaryAssistantMessage` (`IA8`) @270798 — `findLast` an assistant text message that contains `<summary>`, else `findLast` any assistant text message. So when re-reading the transcript it preferentially finds the summarization response.
- `extractSummaryText` (`CA8`) @270805 — returns the trimmed text of the first text block of `IA8`'s result, or null. This is the "extract summary text from the model's messages" step used by the reactive path (`f = CA8(A.messages)` @271204).
- `groupByAssistantTurn` (`riH`) @270812 — groups messages into assistant-turn boundaries, used by reactive compact `xA8` @271233 to decide how many groups to summarize vs preserve.

---

## Worked example: end-to-end for a partial up_to compact

1. User selects a message; `qX4(..., z="up_to", ...)` runs. Prefix `w = H.slice(0, $)` is summarized; suffix is kept (@423346). (Here `z` is the direction; the custom-instructions/user-context arg `L` is the merged string built at 423363-423369, not the raw user instructions.)
2. `P = Cv7(L, "up_to")` @423373 builds: preamble + the @270835 up_to template (sections end with "Work Completed" / "Context for Continuing Work") + optional `Additional Instructions:` + `Iv7` trailer.
3. The fork runs with `forkContextMessages: w` (only the prefix; cache hit) @423377.
4. Model returns `<analysis>…</analysis><summary>1. Primary Request…9. Context for Continuing Work…</summary>`.
5. `jP$(E, !1, o, void 0, $H)` @423468 calls `xc5(E)` to strip analysis + unwrap summary into `Summary:\n…`, prepends the "This session is being continued…" header, optionally appends transcript-path / preserved / REPL-cleared / continuation lines. Note the suppress arg is hard-coded to `!1` (false) for the partial path (so no auto-continuation directive), NOT the variable `K`.
6. The result is wrapped as an `isCompactSummary` user message and spliced in front of the kept recent messages.

---

## Cross-validation against v2.1.88

The v2.1.88 readable build (`prompt.ts`) is the closest fully-named source; v2.1.156 is the minified `cli_inner_pretty.js` bundle.

### Matched (essentially verbatim)

- The full BASE template body (v2.1.156 @270927-271022 vs v2.1.88 `BASE_COMPACT_PROMPT` prompt.ts:61-143) is line-for-line identical, including all 9 section headings, the `<example>` structure, and the trailing "There may be additional summarization instructions … ## Compact Instructions / # Summary instructions" examples.
- The up_to template (@270835-270908 vs `PARTIAL_COMPACT_UP_TO_PROMPT` prompt.ts:208-267) matches verbatim, including the "Work Completed" / "Context for Continuing Work" section swap.
- The partial-from template `bc5` (@271076-271148 vs `PARTIAL_COMPACT_PROMPT` prompt.ts:145-204) matches, including "Analyze the recent messages chronologically".
- The no-tools preamble (@270826-270831 vs prompt.ts:19-26) and trailer `Iv7` (@271151-271154 vs `NO_TOOLS_TRAILER` prompt.ts:269-272) match verbatim.
- `xc5` (@271031-271052) matches `formatCompactSummary` (prompt.ts:311-335) byte-for-byte in regex logic (strip `<analysis>`, capture+rewrite `<summary>` to `Summary:\n`, collapse `\n\n+`).
- The `Cv7` dispatcher logic (preamble + direction-selected template + optional Additional Instructions + trailer) matches `getPartialCompactPrompt` (prompt.ts:274-291) exactly, and `bA8` matches `getCompactPrompt` (prompt.ts:293-303).
- `jP$`'s base header, transcript-path line, "Recent messages are preserved verbatim.", and "Continue … Resume directly …" lines all match `getCompactUserSummaryMessage` (prompt.ts:345-373).

### Diverged (changed in v2.1.156)

- **NEW security-preservation clause.** v2.1.88 templates (`DETAILED_ANALYSIS_INSTRUCTION_BASE`/`_PARTIAL` prompt.ts:31-59; section 6 lines 73/156/219) contained NO security/sensitive-instruction language at all. v2.1.156 adds it in TWO places per template: inside the analysis instructions (@270850/270943/271091) and inside section 6 (@270860/270953/271101). This is the single biggest content change.
- **REFACTOR / inlining.** v2.1.88 factored the analysis-instruction sub-block into named constants (`DETAILED_ANALYSIS_INSTRUCTION_BASE`/`_PARTIAL`) and the bodies into `BASE_COMPACT_PROMPT` / `PARTIAL_COMPACT_PROMPT` / `PARTIAL_COMPACT_UP_TO_PROMPT` (5 named consts plus `NO_TOOLS_PREAMBLE`/`TRAILER`). v2.1.156 minifies these: the full template and up_to template are inlined directly inside `bA8`/`Cv7` (no separate BASE/UP_TO consts survive as standalone vars), while only the partial-from body (`bc5`) and the trailer (`Iv7`) remain as lazily-initialized module vars under `MN6 = T(() => ...)`.
- Constant renames: `NO_TOOLS_PREAMBLE` -> inlined string; `NO_TOOLS_TRAILER` -> `Iv7`; `BASE_COMPACT_PROMPT` -> inlined in `bA8`; `PARTIAL_COMPACT_PROMPT` -> `bc5`; `PARTIAL_COMPACT_UP_TO_PROMPT` -> inlined in `Cv7`; `getCompactPrompt` -> `bA8`; `getPartialCompactPrompt` -> `Cv7`; `formatCompactSummary` -> `xc5`; `getCompactUserSummaryMessage` -> `jP$`.

### Post-2.1.88 (new, not in the readable build)

- **The REPL-state-cleared trailer in `jP$` (5th param `_`).** v2.1.88 `getCompactUserSummaryMessage` had only `summary`, `suppressFollowUpQuestions`, `transcriptPath`, `recentMessagesPreserved`. v2.1.156 adds `replStateCleared` producing the "Your REPL VM state has been cleared as part of this compaction … redefine any you still need." trailer @271066-271068. The call sites compute it via `$H = yZ() && MJ$(getReplContexts(), agentId)` @423238/271211.

### Removed / could not confirm

- v2.1.88's `getCompactUserSummaryMessage` appended an extra "You are running in autonomous/proactive mode…" paragraph when PROACTIVE/KAIROS features were active (prompt.ts:361-368). v2.1.156 `jP$` has no such branch — its continuation directive is the single "Resume directly…" paragraph. **Unconfirmed:** whether any non-template proactive continuation logic moved to a different function in v2.1.156. Only the seed builder `jP$` and its two call sites (@423239 / @271217) were traced; a relocated proactive branch was not exhaustively searched for, so this is stated as unconfirmed rather than asserting outright deletion.
- The model-failure-rate engineering comment (prompt.ts:12-18; "2.79% on 4.6 vs 0.01% on 4.5"; `maxTurns: 1` rationale) is stripped in the minified build, but the design it justified (preamble-first + trailer-last sandwich; `maxTurns: 1` @271167) is fully preserved.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact lives here
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Loop integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry / model context window
> - [symbol_additions_v2_1_156_compact.md](../00_overview/symbol_additions_v2_1_156_compact.md) - This module's new symbols

Key functions in this document:

- `buildFullCompactPrompt` (`bA8`) — cli_inner_pretty.js:270917-270930 — builds the full/BASE compact meta-prompt (whole-conversation scope; sections 8/9 = Current Work / Optional Next Step); v2.1.88 `getCompactPrompt` + `BASE_COMPACT_PROMPT`
- `buildPartialCompactPrompt` (`Cv7`) — cli_inner_pretty.js:270824-270916 — direction dispatcher for partial/range compact: `up_to` -> inline continuation template @270835, `from` -> `bc5`; v2.1.88 `getPartialCompactPrompt`
- `PARTIAL_COMPACT_FROM_PROMPT` (`bc5`) — cli_inner_pretty.js:271076-271149 — lazily-initialized partial-from body template ("RECENT portion"); v2.1.88 `PARTIAL_COMPACT_PROMPT`
- `NO_TOOLS_TRAILER` (`Iv7`) — cli_inner_pretty.js:271150-271154 — lazily-initialized closing reminder appended to every compact prompt; v2.1.88 `NO_TOOLS_TRAILER`
- `formatCompactSummary` (`xc5`) — cli_inner_pretty.js:271031-271052 — strips `<analysis>`, unwraps `<summary>` into a `Summary:` header, collapses blank-line runs; v2.1.88 `formatCompactSummary`
- `buildCompactSummarySeed` (`jP$`) — cli_inner_pretty.js:271053-271073 — builds the `isCompactSummary` replacement user message with conditional transcript/preserved/REPL-cleared/auto-continue trailers; v2.1.88 `getCompactUserSummaryMessage` plus new `replStateCleared` param
- `findSummaryAssistantMessage` (`IA8`) — cli_inner_pretty.js:270798-270804 — `findLast` assistant text message containing `<summary>`, else any assistant text message
- `extractSummaryText` (`CA8`) — cli_inner_pretty.js:270805-270811 — trimmed text of the first text block of `IA8`'s result, or null; used by reactive path @271204
- `groupByAssistantTurn` (`riH`) — cli_inner_pretty.js:270812-270823 — groups messages into assistant-turn boundary groups; used by reactive compact `xA8` @271233
- `initCompactPromptModule` (`MN6`) — cli_inner_pretty.js:271075-271155 — lazy module-init (`T(()=>...)`) assigning `bc5` and `Iv7` on first use
- `runReactiveCompactSummarize` (`uc5`) — cli_inner_pretty.js:271156-271219 — reactive compact: builds prompt via `bA8`, runs fork (`maxTurns:1`, output capped by `NO$`=20000), extracts via `CA8`, wraps via `jP$` with suppress=true
- `runPartialCompact` (`qX4`) — cli_inner_pretty.js:423340+ — partial/range compact path; slices prefix/suffix by direction, builds prompt via `Cv7(custom, direction)`, wraps result via `jP$` @423468
- `runFullCompact` (`_eH`) — cli_inner_pretty.js:423130+ — standard full compact (`/compact` + auto-compact); builds prompt via `bA8` @423154, wraps result via `jP$` @423239
- `COMPACT_MAX_OUTPUT_TOKENS` (`NO$`) — cli_inner_pretty.js:130224 — `=20000`; upper bound on summarizer output tokens (min'd against the model cap) in `uc5` @271168
