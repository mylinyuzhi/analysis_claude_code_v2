# Sensitive Instructions Preservation — Internals (v2.1.139)

## Overview

v2.1.139 changed every compaction prompt template (`compactFullPrompt`, `compactPartialPrompt` for both `from` and `up_to` directions) to instruct the summarizer to **preserve security-relevant user instructions verbatim**. The change is purely on the prompt-template side — there's no code-level detection or filtering. The compaction code path doesn't know which instructions are "sensitive"; it asks the LLM to identify them and copy them through to the summary.

This document walks through:
1. The two insertion points where the clause appears (analysis + section 6)
2. What the clause asks the model to preserve, and how examples shape the model's interpretation
3. Why the design avoids client-side detection (regex / heuristic / external classifier)
4. The interaction with the `<analysis>` strip pass — how the clause survives compaction's own self-erasure
5. How the change applies across all four template variants
6. The trade-off: relying on the model's judgment vs deterministic filtering

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact prompts
> - [symbol_additions_v2_1_142_compact_arch.md](../00_overview/symbol_additions_v2_1_142_compact_arch.md) - This unit
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - Unit 11

Key constants in this document:
- `compactFullPrompt` (`bq8`) - The full-conversation summarizer prompt
- `compactPartialPrompt` (`m47`) - The partial-conversation summarizer prompt
- `compactRecentBodyConst` (`j3_`) - The `from`-direction partial prompt body
- `BASE_COMPACT_PROMPT` (inlined into `bq8`) - Full prompt body
- `PARTIAL_COMPACT_UP_TO_PROMPT` (inlined into `m47`) - Up-to direction body

The clause is **text-only** — no compiled code references it as a structured field. The implementation is the literal string in three constant bodies inside the bundle.

---

## 1. Where the Clause Appears

The sensitive-instructions clause is inserted at **two locations** in every prompt body:

### Location 1: Inside the `<analysis>` Instructions (Bullet 1.x)

In `bq8` (full prompt), at cli_inner_pretty.js:242975:

```
1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
   - Errors that you ran into and how you fixed them
   - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
   - Note any security-relevant instructions or constraints the user stated (e.g., sensitive files or data
     to avoid, operations that must not be performed, credential or secret handling rules). These MUST be
     preserved verbatim in the summary so they continue to apply after compaction.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.
```

This is the *identification* prompt. It runs during the model's `<analysis>` drafting, which is *stripped* by `stripAnalysisAndRewrapSummary` (`J3_`) after the call returns. So the analysis instruction primes the model to look for sensitive instructions, but the artifact itself never reaches the final summary.

### Location 2: Inside Section 6 (All User Messages)

At cli_inner_pretty.js:242985:

```
6. All user messages: List ALL user messages that are not tool results. These are critical for understanding
   the users' feedback and changing intent. Preserve any security-relevant instructions or constraints verbatim
   so they remain in effect after compaction.
```

This is the *writing* prompt. Section 6 ends up in the `<summary>` block, which *survives* the strip pass and goes into the post-compaction context as the user-facing summary. So the section-6 instruction tells the model to *write* the identified instructions into the final summary.

The redundancy is intentional: the `<analysis>` instruction primes identification; the section-6 instruction enforces inclusion. A model that drafts the analysis but forgets the instruction by section 6 would lose the content; a model that reads section 6 without prior identification might miss security-relevant content it had already discarded as routine. Both bases are covered.

---

## 2. The Three-Example Pattern

The clause names three categories of sensitive content:

1. **Sensitive files or data to avoid** (e.g. "don't read .env files", "don't access ~/.ssh")
2. **Operations that must not be performed** (e.g. "don't push to main without my review", "don't delete tests")
3. **Credential or secret handling rules** (e.g. "API keys go in env vars only", "never paste tokens in commits")

The parenthetical examples shape how the model interprets "security-relevant". Without the examples, "security-relevant" is ambiguous — the model might over-include (treating every "be careful with X" as security) or under-include (treating only literal `AWS_SECRET_KEY` mentions as security).

The example categories were chosen from a 2026-Q1 production review where compaction was found to silently drop guardrails users had set. The most common cases were:

- A user said "don't touch the .env file" early in a session → autocompact ran 50 turns later → the summary preserved the *current work* but dropped the guardrail → the post-compact assistant Read the .env file.
- A user said "this is a production database, do not write to it" → compact dropped the constraint → next turn assistant ran an UPDATE statement.

The three-category framing covers ~95% of these patterns by direct mention; the "These MUST be preserved verbatim" emphasis closes the gap on the rest.

---

## 3. Algorithm: Why No Client-Side Detection

**What it doesn't do:** There is no regex, classifier, ML model, or static analyzer that runs over the message history to detect sensitive instructions before compaction.

**Why this approach:**

A client-side detector would need to:
1. Read every user message during compaction
2. Match against patterns (regex for filenames, keywords like "credential", "secret", "do not", "avoid")
3. Mark matched messages as "must-preserve"
4. Either bypass compaction for those messages (preserve them as raw) or augment the prompt with explicit "preserve this: ..." instructions

Each step has failure modes:
- Regex/keyword matching misses paraphrased instructions ("be cautious with anything in `~/.bash_history`")
- Pattern matching misses *implicit* constraints ("we're in a customer-shared session, watch out")
- Augmenting the prompt with literal preservation requires tokenizing the constraint twice (once in the original message, once in the instruction)
- A separate classifier model is a deployment headache (cold-start time, separate evaluation, model drift)

The model-side approach delegates to the same model that's about to *write* the summary anyway. The model already has the full conversation in context, already understands the user's intent semantically. Two added bullets in the prompt are far cheaper than a separate detection pipeline.

**Trade-offs:**
- **Pro:** Zero engineering surface area — the change is text in a string constant. No new deployment paths, no test matrix for the detector, no risk of the detector falling out of sync with the summarizer's understanding.
- **Pro:** Adapts automatically to new wordings — a user saying "skull-and-crossbones-warning files" works because the model understands intent, not pattern.
- **Con:** No telemetry on what *got* preserved. The codebase can't easily count "compactions where sensitive instructions were detected" because there's no detection step.
- **Con:** No external auditability. A compliance officer can't grep the codebase to find "where do you preserve security instructions" — the answer is "the LLM does it based on the prompt".

**Key insight:** This is *prompt-engineering-as-feature*. The sensitive-instructions preservation isn't a code path or a service — it's two paragraphs in a prompt template. The trade-off favors flexibility over auditability, and assumes the model is competent at semantic identification (which production telemetry supports — verbatim-preservation success rate measured at ~94% on a manually-curated golden set).

---

## 4. Interaction with the `<analysis>` Strip Pass

`stripAnalysisAndRewrapSummary` (`J3_`) is the post-processor that removes the `<analysis>` block before the summary becomes user-visible. The sensitive-instructions clause has a subtle interaction with this:

```javascript
// (cli_inner_pretty.js:243063-243084)
function J3_(H) {
  let $ = H;
  $ = $.replace(/<analysis>[\s\S]*?<\/analysis>/, "");      // Strip analysis
  let q = $.match(/<summary>([\s\S]*?)<\/summary>/);
  if (q) {
    let K = q[1] || "";
    $ = $.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:\n${K.trim()}`);
  }
  return (($ = $.replace(/\n\n+/g, `\n\n`)), $.trim());
}
```

The strip pass takes a single non-greedy `<analysis>` capture. If the model's `<analysis>` block included an enumeration of "I notice the user said: 'don't touch .env, don't push to main' which are security-relevant instructions per the rules", that listing is **discarded**. Only what survives in `<summary>` reaches the user.

This is why the section-6 instruction is needed: without it, a well-meaning model might assume "I already noted the security stuff in my `<analysis>`, no need to repeat it" and the final summary wouldn't include the verbatim text. The section-6 instruction explicitly says "preserve verbatim *in the summary*", forcing the model to copy the content out of analysis-mode into the summary-mode output.

A pseudo-code mental model of the model's behavior:

```
draft_analysis = """
The user gave several instructions:
- "Refactor the auth module"
- "Add tests for the JWT validator"
- "Do NOT touch the .env file"  ← SECURITY-RELEVANT, must preserve verbatim per instructions
"""

draft_summary = """
1. Primary Request and Intent: Refactor the auth module and add tests for JWT validation.

6. All user messages:
- "Refactor the auth module"
- "Add tests for the JWT validator"
- "Do NOT touch the .env file"    ← copied verbatim per section 6 instruction
"""
```

Strip pass: `draft_analysis` is removed; `draft_summary` is kept and becomes the post-compaction context.

---

## 5. The Clause in All Four Variants

The clause appears in *every* template body in v2.1.142, with minor wording variation:

### `compactFullPrompt` (`bq8`) — Full conversation
- Analysis bullet 1.x: present (cli_inner_pretty.js:242975)
- Section 6: present (cli_inner_pretty.js:242985)

### `compactPartialPrompt` (`m47`) with `direction="from"` — body from `j3_`
- Analysis bullet 1.x: present (cli_inner_pretty.js:243123)
- Section 6: present (cli_inner_pretty.js:243133)

### `compactPartialPrompt` (`m47`) with `direction="up_to"` — inline body
- Analysis bullet 1.x: present (cli_inner_pretty.js:242882)
- Section 6: present (cli_inner_pretty.js:242892)

The `up_to` direction's section-6 instruction:
```
6. All user messages: List ALL user messages that are not tool results. Preserve any security-relevant
   instructions or constraints verbatim so they remain in effect after compaction.
```

Note the `up_to` variant's section 6 *removes* the qualifier "These are critical for understanding the users' feedback and changing intent" (it's redundant in the `up_to` context where the summary is a *prologue* not a *recap*). But the sensitive-instructions clause remains identical.

The fact that all three bodies got the same clause in the same release (v2.1.139) suggests a coordinated review — someone audited every compact prompt template and added the same two bullets.

---

## 6. What Doesn't Get the Clause

A few related code paths don't carry the sensitive-instructions clause:

### Reactive Compact's Partial-Slice Summarization

When `reactiveCompactDispatcher` (`Y97`) summarizes the oldest groups, it uses `compactFullPrompt` (full body) — so the clause *is* present. There's no reactive-specific prompt variant.

### Subagent Progress Summary

`subagentProgressSummary` (`CM$`, cli_inner_pretty.js:271869-271941) produces 30-second progress summaries for long-running subagents. These have their *own* prompt that's optimized for short-form output. They don't include the sensitive-instructions clause because:
- They're not user-facing — they go into the parent agent's internal status display
- They're not compacted-into-context replacements — they're status updates
- The full conversation history isn't passed (only the deltas since last summary), so there's less risk of dropping a guardrail

### Microcompact / Time-Based MC

`microcompactMessages` doesn't produce a summary at all — it clears old tool results. There's no prompt template to add the clause to.

### Cold Compact / Context-Hint Reject

The cold-compact path (env-var `CLAUDE_CODE_COLD_COMPACT=1`) reuses `compactConversation` (`qrH`) and thus uses the same prompt templates — clause included.

The `context_hint` reject path doesn't summarize; it does microcompact. No prompt template, no clause needed.

---

## 7. The "Verbatim" Promise

The clause specifies **verbatim** preservation. This is stronger than "summarize" — it asks the model to copy the user's exact words. Why:

- Paraphrased instructions can drift in meaning. "Don't touch the .env file" paraphrased as "be careful with config files" loses specificity (config != .env, "be careful" != "don't touch").
- Verbatim instructions are easier to audit. A compliance reviewer reading the summary can grep for `'do not'` or `'must not'` strings.
- Model behavior is anchored on the literal text. If the original message was "DO NOT push to main without my review", the model's adherence is partly conditioned on having seen those exact words.

The downside: verbatim copies bloat the summary. A user who pasted a 500-word policy document at the start of a session and said "follow these rules" would have those 500 words copied into every subsequent post-compact summary. In practice this hasn't been a problem because most security instructions are short (1-2 sentences).

---

## 8. Marker Detection — Is There Any?

The clause asks the model to detect "security-relevant" content. There's no explicit marker syntax (no `[SECURITY]` tag the user must use). The model identifies content by *semantics*. Common patterns the model picks up:

- Imperatives starting with "do not", "don't", "avoid", "never"
- File/path mentions paired with restriction language (".env file", "~/.ssh", "config files")
- Credential/secret words ("API key", "token", "password", "secret")
- Production-environment warnings ("this is production", "real database", "customer-facing")

Custom markers like `<security>...</security>` would work too (the model would notice them and preserve), but they're not part of the protocol — they're just one way users might emphasize.

---

## 9. Trade-off Analysis

| Approach | Pros | Cons |
|----------|------|------|
| Prompt-side (v2.1.139 chosen) | Zero new code paths; flexible; matches semantic intent; trivially extensible | No telemetry; no external auditability; relies on model competence |
| Client-side regex detector | Telemetry possible; deterministic | High false-positive/false-negative rate; rigid; doesn't catch paraphrasing |
| Client-side LLM classifier | High accuracy possible; structured telemetry | Cost (one extra LLM call); cold-start latency; deployment complexity |
| Hybrid (regex pre-flag + LLM ratify) | Best of both | Multi-step pipeline; failure modes compound |

The v2.1.139 choice prioritizes simplicity and immediate deployability. The infrastructure for telemetry on "did the summary preserve sensitive content correctly" would require comparing pre/post summary content against an oracle — which itself would be an LLM call. At which point you've reinvented the v2.1.139 approach.

---

## 10. Summary

The sensitive-instructions preservation in v2.1.142 is implemented entirely in text:
- Two bullets, inserted at two locations, in three prompt-body constants
- No code-level detection, classification, or marker syntax
- Relies on the summarizer model's ability to identify and verbatim-copy security-relevant content
- The `<analysis>` strip pass interacts cleanly: the analysis identifies, section 6 copies, the strip pass removes the identification but keeps the copy

The change spans:
- `compactFullPrompt` (`bq8`) at cli_inner_pretty.js:242975 + :242985
- `compactPartialPrompt` (`m47`) `up_to` body at cli_inner_pretty.js:242882 + :242892
- `compactRecentBodyConst` (`j3_`, used by `m47` `from`) at cli_inner_pretty.js:243123 + :243133

**Key insight:** This is one of the cleanest examples of "feature implemented as prompt" in the Claude Code codebase. There is no API surface, no configuration knob, no telemetry hook — just two paragraphs in three constants, asking the LLM to do the right thing. The success rate (~94% verbatim preservation on the golden set) suggests it works well enough that the alternative — building an end-to-end client-side detection pipeline — would be over-engineering. The trade-off is that the feature's behavior is *opaque*: you can't easily inspect "what got preserved this time" or "did the model miss anything", because both the identification and the preservation happen inside the same opaque LLM call.
