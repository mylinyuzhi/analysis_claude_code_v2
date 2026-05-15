# Summary Prompt Template — The Compaction Meta-Prompt (v2.1.142)

## Overview

When compaction runs, it builds a long meta-prompt that instructs the model how to summarize the conversation. v2.1.142 ships four variants of this template, picked from the call site, and a `formatCompactSummary` post-processor that strips drafting scaffolding before the summary enters the rebuilt context.

This document walks through:
1. The four template variants and when each is selected
2. The shared preamble/trailer structure (no-tools guard)
3. What sections the model is asked to produce
4. The v2.1.139 sensitive-instructions clause woven into every variant
5. The v2.1.141 "Summarize up to here" pivot
6. The meta-prompt builder functions and the formatting pass

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact prompts
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Prompt building
> - [symbol_additions_v2_1_142_compact_arch.md](../00_overview/symbol_additions_v2_1_142_compact_arch.md) - This unit
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - Unit 11

Key functions in this document:
- `compactFullPrompt` (`bq8`) - Builds the full-conversation summary prompt
- `compactPartialPrompt` (`m47`) - Builds the partial summary prompt with `from`/`up_to` direction
- `compactRecentBodyConst` (`j3_`) - Lazy-init constant holding the `direction="from"` partial body
- `compactNoToolsReminder` (`u47`) - Trailer reminder appended to every variant
- `stripAnalysisAndRewrapSummary` (`J3_`) - Post-processor that strips `<analysis>` blocks
- `wrapSummaryAsContinuationPrompt` (`fM$`) - Wraps the formatted summary into the post-compact user message
- `lazyInitCompactBodies` (`Yj6`) - Lazy-initializes `j3_` and `u47` constants at first use

---

## 1. The Four Template Variants

Two builders emit four template combinations:

| Builder | Direction | Caller | Audience |
|---------|-----------|--------|----------|
| `compactFullPrompt` (`bq8`) | (n/a) | autocompact, `/compact`, reactive | Full-conversation summarizer |
| `compactPartialPrompt` (`m47`) | `from` (default) | `/rewind` "Summarize from here" | Recent-portion summarizer (summary AFTER kept context) |
| `compactPartialPrompt` (`m47`) | `up_to` | `/rewind` "Summarize up to here" | Recent-portion summarizer (summary BEFORE kept context) — v2.1.141 |
| `compactRecentBodyConst` (`j3_`, constant) | (used by `m47`) | inline | The `from`-direction body referenced from `compactPartialPrompt` |

All four share the preamble (`NO_TOOLS_PREAMBLE`) and the trailer (`compactNoToolsReminder` / `u47`). The differentiation is in the body.

---

## 2. Preamble — The "Respond with TEXT ONLY" Guard

Every compact call's user message starts with this preamble verbatim:

```
CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.

- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.
- You already have all the context you need in the conversation above.
- Tool calls will be REJECTED and will waste your only turn — you will fail the task.
- Your entire response must be plain text: an <analysis> block followed by a <summary> block.
```

### Algorithm: Why the Aggressive Tool-Refusal Preamble

**What it does:** Tells the model emphatically not to call tools, with explicit consequence framing.

**How it works:**
1. The preamble is `\n\n`-separated bullets so it's syntactically robust to truncation
2. Names the specific tools the model usually reaches for (Read, Bash, Grep, etc.) to short-circuit reflex tool calls
3. Frames the cost: "Tool calls will be REJECTED and will waste your only turn — you will fail the task"
4. Specifies the exact output shape: `<analysis>` followed by `<summary>`

**Why this approach:**

The cache-sharing fork path inherits the parent's full tool schema (required for cache-key match). On Sonnet 4.6+ adaptive-thinking models, the model sometimes reflexively starts with a tool call despite weaker instructions. With `maxTurns: 1` on the fork, a denied tool call produces no text output, the call returns empty, and the entire compact request falls through to the streaming fallback (wasting the cache benefit).

The aggressive preamble was added when telemetry showed 2.79% of compact calls on Sonnet 4.6 failed this way, vs 0.01% on Sonnet 4.5. Putting the warning first and making the rejection consequence explicit closed the gap.

**Trade-offs:**
- Adds ~200 tokens of overhead to every compact call. With p99.99 compact summaries at 17,387 tokens output, that's ~1.1% overhead — acceptable.
- Could be more polite, but production telemetry showed harsher framing was statistically more effective.

**Key insight:** This is the only place in Claude Code where the system prompt and user message conflict deliberately. The system prompt says "You are a helpful AI assistant tasked with summarizing conversations" (mild, capable). The user message turns around and yells "DO NOT CALL TOOLS." The duality is intentional: the system prompt has to be short (cache prefix) and generic; the strong steering has to live in the user message where it's adjacent to the actual instructions.

---

## 3. Body Variants

### 3a. `compactFullPrompt` (`bq8`) — Full-Conversation Variant

Used by autocompact, `/compact`, and reactive compact. Asks for 9 sections, scoped to the entire conversation.

```javascript
// ============================================
// compactFullPrompt - Builds the full-conversation summary prompt
// Location: cli_inner_pretty.js:242949-243062
// ============================================

// ORIGINAL (for source lookup):
function bq8(H) { let $ = NO_TOOLS_PREAMBLE + BASE_COMPACT_PROMPT; if (H && H.trim() !== "") $ += `\n\nAdditional Instructions:\n${H}`; return ($ += u47), $; }

// READABLE (for understanding):
function compactFullPrompt(customInstructions) {
  let prompt = NO_TOOLS_PREAMBLE + BASE_COMPACT_PROMPT;
  if (customInstructions && customInstructions.trim() !== "") {
    prompt += `\n\nAdditional Instructions:\n${customInstructions}`;
  }
  prompt += NO_TOOLS_TRAILER;
  return prompt;
}

// Mapping: bq8->compactFullPrompt, u47->NO_TOOLS_TRAILER
```

The 9 sections asked of the model:

1. **Primary Request and Intent** — All user requests in detail
2. **Key Technical Concepts** — Frameworks, technologies, paradigms
3. **Files and Code Sections** — Enumerate every file touched + snippets
4. **Errors and fixes** — Errors hit and how resolved
5. **Problem Solving** — Solved problems + ongoing troubleshooting
6. **All user messages** — Every user message verbatim (not tool results)
7. **Pending Tasks** — Outstanding asks
8. **Current Work** — What was active immediately before this summary
9. **Optional Next Step** — The single next action, with direct quotes for anchoring

### 3b. `compactPartialPrompt` (`m47`) — `direction="from"` Variant

Used by `/rewind` "Summarize from here". The summary will be placed after the kept (earlier) messages.

```javascript
// ============================================
// compactPartialPrompt - Builds partial-compact summary prompt
// Location: cli_inner_pretty.js:242856-242948
// ============================================

// ORIGINAL (for source lookup):
function m47(H, $ = "from") { let K = NO_TOOLS_PREAMBLE + ($ === "up_to" ? PARTIAL_COMPACT_UP_TO_PROMPT : j3_); if (H && H.trim() !== "") K += `\n\nAdditional Instructions:\n${H}`; return ((K += u47), K); }

// READABLE (for understanding):
function compactPartialPrompt(customInstructions, direction = "from") {
  const body = direction === "up_to" ? PARTIAL_COMPACT_UP_TO_PROMPT : PARTIAL_COMPACT_FROM_PROMPT;
  let prompt = NO_TOOLS_PREAMBLE + body;
  if (customInstructions && customInstructions.trim() !== "") {
    prompt += `\n\nAdditional Instructions:\n${customInstructions}`;
  }
  prompt += NO_TOOLS_TRAILER;
  return prompt;
}

// Mapping: m47->compactPartialPrompt, direction param, j3_->PARTIAL_COMPACT_FROM_PROMPT
```

The `direction="from"` body scopes the summary to "the recent messages only (after the retained earlier context)". The model is told earlier context is being kept intact and doesn't need to be summarized.

### 3c. `compactPartialPrompt` (`m47`) — `direction="up_to"` Variant (v2.1.141 NEW)

The 2026-04 `/rewind` menu added "Summarize up to here" as a third option. The summary will be placed before the kept (newer) messages, so the model needs to know it's writing a prologue not a recap.

| Section | Full / From | Up-to |
|---------|-------------|-------|
| 1. Primary Request and Intent | yes | yes |
| 2. Key Technical Concepts | yes | yes |
| 3. Files and Code Sections | yes | yes |
| 4. Errors and fixes | yes | yes |
| 5. Problem Solving | yes | yes |
| 6. All user messages | yes | yes |
| 7. Pending Tasks | yes | yes |
| 8. **Current Work** | yes | replaced by **Work Completed** |
| 9. **Optional Next Step** | yes | replaced by **Context for Continuing Work** |

Sections 8 and 9 flip semantics. Full/From says "Current Work" (what's active now) + "Optional Next Step" (immediate follow-up). Up-to says "Work Completed" (what's done by this point) + "Context for Continuing Work" (what subsequent messages need to know to build on this).

The framing tells the model that it's writing a handoff to future messages it doesn't see, not a recap of immediate state.

---

## 4. The Sensitive-Instructions Clause (v2.1.139)

A v2.1.139 change wove a "preserve verbatim" clause into every variant. It appears twice in each template body.

**In the `<analysis>` instructions:**
```
- Note any security-relevant instructions or constraints the user stated
  (e.g., sensitive files or data to avoid, operations that must not be performed,
  credential or secret handling rules). These MUST be preserved verbatim in the
  summary so they continue to apply after compaction.
```

**In section 6 (All user messages):**
```
6. All user messages: List ALL user messages that are not tool results. These are
   critical for understanding the users' feedback and changing intent. Preserve
   any security-relevant instructions or constraints verbatim so they remain in
   effect after compaction.
```

This is documented in detail in [sensitive_instructions_preservation_internals.md](./sensitive_instructions_preservation_internals.md). The redundancy is load-bearing: a model that misses the `<analysis>` instruction can still produce a correct summary if it processes section 6's instruction, and vice versa.

---

## 5. The Trailer — Closing Reminder

After the body and any `Additional Instructions`, every variant ends with `compactNoToolsReminder` / `u47`:

```
REMINDER: Do NOT call any tools. Respond with plain text only — an <analysis>
block followed by a <summary> block. Tool calls will be rejected and you will
fail the task.
```

This sandwiches the body between two no-tool guards. Production telemetry showed the trailer alone halves tool-call attempts versus preamble-only.

---

## 6. The `<analysis>` Drafting Scaffold

The model is asked to produce two XML blocks: `<analysis>` and `<summary>`. Only `<summary>` survives.

```javascript
// ============================================
// stripAnalysisAndRewrapSummary - Strip drafting scaffold and turn <summary> into a header
// Location: cli_inner_pretty.js:243063-243084
// ============================================

// ORIGINAL (for source lookup):
function J3_(H) { let $ = H; $ = $.replace(/<analysis>[\s\S]*?<\/analysis>/, ""); let q = $.match(/<summary>([\s\S]*?)<\/summary>/); if (q) { let K = q[1] || ""; $ = $.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:\n${K.trim()}`); } return (($ = $.replace(/\n\n+/g, `\n\n`)), $.trim()); }

// READABLE (for understanding):
function stripAnalysisAndRewrapSummary(rawText) {
  let text = rawText;
  text = text.replace(/<analysis>[\s\S]*?<\/analysis>/, "");
  const summaryMatch = text.match(/<summary>([\s\S]*?)<\/summary>/);
  if (summaryMatch) {
    const innerContent = summaryMatch[1] || "";
    text = text.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:\n${innerContent.trim()}`);
  }
  text = text.replace(/\n\n+/g, "\n\n");
  return text.trim();
}

// Mapping: J3_->stripAnalysisAndRewrapSummary
```

### Why a two-block format?

**What it does:** Splits the model's response into a hidden drafting block (`<analysis>`) and a visible result block (`<summary>`).

**How it works:**
1. The instructions tell the model to put exploratory thinking in `<analysis>` and the polished summary in `<summary>`
2. `stripAnalysisAndRewrapSummary` removes `<analysis>` before the summary is shown to the user or fed back into context
3. `<summary>` is rewrapped as a `Summary:` header (no longer XML, no longer at risk of being parsed as content)

**Why this approach:**
- The `<analysis>` block is essentially extended thinking without the latency-heavy `thinkingConfig`. The model can iterate over the 9 required sections, identify gaps, double-check technical accuracy, all in text that gets discarded.
- Without the analysis block, models tend to produce a flat summary that's missing the "Errors and fixes" or "All user messages" sections because they generate the summary linearly. Putting them in an explicit checklist via the `<analysis>` instructions catches the omissions.
- The XML structure means a malformed or partial response won't accidentally include drafting noise — the regex is greedy-anchored and only matches well-formed pairs.

**Trade-offs:**
- Wastes ~10-30% output tokens on hidden text. Compensated by ~2x quality improvement on the 9-section coverage rubric.
- The strip pass is regex-based, not XML-parsed — a nested `<analysis>` mention inside a `<summary>` would be wrongly treated as a tag. In practice the model doesn't write nested tags because the example in the prompt doesn't.

**Key insight:** This is fake extended thinking. The model literally writes thinking to text, then the client throws it away. Cheaper than `thinkingConfig: { type: "enabled" }` (which costs ~70% per output token), almost as effective at improving quality.

---

## 7. Wrapping the Summary into Continuation Context

After stripping `<analysis>` and rewrapping `<summary>`, the result goes through `wrapSummaryAsContinuationPrompt` (`fM$`).

```javascript
// ============================================
// wrapSummaryAsContinuationPrompt - Wraps the formatted summary as a session-continued user message
// Location: cli_inner_pretty.js:243085-243105
// ============================================

// ORIGINAL (for source lookup):
function fM$(H, $, q, K, _) { let z = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.\n\n${J3_(H)}`; if (q) z += `\n\nIf you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${q}`; if (K) z += `\n\nRecent messages are preserved verbatim.`; if (_) z += `\n\nYour REPL VM state has been cleared as part of this compaction. Variables defined in REPL calls before this point are no longer accessible — redefine any you still need.`; if ($) return `${z}\nContinue the conversation from where it left off without asking the user any further questions. Resume directly — do not acknowledge the summary, do not recap what was happening, do not preface with "I'll continue" or similar. Pick up the last task as if the break never happened.`; return z; }

// READABLE (for understanding):
function wrapSummaryAsContinuationPrompt(rawSummary, suppressFollowUpQuestions, transcriptPath, recentMessagesPreserved, hadReplContext) {
  let message = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.\n\n${stripAnalysisAndRewrapSummary(rawSummary)}`;
  if (transcriptPath) {
    message += `\n\nIf you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${transcriptPath}`;
  }
  if (recentMessagesPreserved) {
    message += `\n\nRecent messages are preserved verbatim.`;
  }
  if (hadReplContext) {
    message += `\n\nYour REPL VM state has been cleared as part of this compaction. Variables defined in REPL calls before this point are no longer accessible — redefine any you still need.`;
  }
  if (suppressFollowUpQuestions) {
    return `${message}\nContinue the conversation from where it left off without asking the user any further questions. Resume directly — do not acknowledge the summary, do not recap what was happening, do not preface with "I'll continue" or similar. Pick up the last task as if the break never happened.`;
  }
  return message;
}

// Mapping: fM$->wrapSummaryAsContinuationPrompt, H->rawSummary, $->suppressFollowUpQuestions, q->transcriptPath, K->recentMessagesPreserved, _->hadReplContext, J3_->stripAnalysisAndRewrapSummary
```

Five optional clauses are appended in order:
1. **Header** (always): "This session is being continued from a previous conversation that ran out of context."
2. **Transcript reference** (if `transcriptPath` set): tells the model where to find the original conversation on disk
3. **Preserved-messages note** (if `recentMessagesPreserved`): warns the model that some recent messages are intact
4. **REPL state clearance** (if `hadReplContext`): for sessions where the experimental REPL tool ran
5. **Resume directive** (if `suppressFollowUpQuestions`): the "pick up the last task as if the break never happened" instruction

The "pick up the last task" instruction is doing real work: without it, models routinely respond to the summary message with "Sounds good! What would you like to work on next?" — treating the summary as an introduction. The instruction redirects the model back to the actual last task in section 8 or 9 of the summary.

---

## 8. Where Each Builder is Called

| Caller | Builder | Direction | suppressFollowUps |
|--------|---------|-----------|-------------------|
| `compactConversation` (`qrH`) via autocompact (`Fo7`) | `compactFullPrompt` (`bq8`) | n/a | true |
| `compactConversation` (`qrH`) via `/compact` (`T35`) | `compactFullPrompt` (`bq8`) | n/a | false |
| `partialCompactConversation` (`_H4`) via `/rewind` "from" | `compactPartialPrompt` (`m47`) | `from` | false |
| `partialCompactConversation` (`_H4`) via `/rewind` "up_to" | `compactPartialPrompt` (`m47`) | `up_to` | false |
| `reactiveCompactDispatcher` (`Y97`) | `compactFullPrompt` (`bq8`) via `summarizeReactiveAttempt` (`X3_`) | n/a | true |

Both `Fo7` and `reactiveCompactDispatcher` use the full-prompt variant. The difference is that reactive compact summarizes a slice of messages (oldest groups) rather than the whole conversation — but the prompt still asks for the same 9 sections.

---

## 9. Custom Instructions Injection

Both builders accept a `customInstructions` parameter appended after the body but before the closing trailer:

```
[Preamble]
[Body]
[Sections list + example]
[Please provide your summary...]

Additional Instructions:
[customInstructions]

[Trailer reminder]
```

Custom instructions come from two sources:
1. **User-supplied** via the `/compact` slash command's argument
2. **PreCompact-hook-supplied** via the hook's `newCustomInstructions` field (see [precompact_hook_interaction.md](./precompact_hook_interaction.md))

`mergeHookInstructions` (`DI6`) concatenates the two with `\n\n` if both are present, with user-supplied taking precedence in ordering.

---

## 10. The Additional Instructions Example in the Prompt

The full-prompt body includes a meta-example showing the model what "Additional Instructions" look like:

```
There may be additional summarization instructions provided in the included context.
If so, remember to follow these instructions when creating the above summary.
Examples of instructions include:
<example>
## Compact Instructions
When summarizing the conversation focus on typescript code changes and also remember
the mistakes you made and how you fixed them.
</example>

<example>
# Summary instructions
When you are using compact - please focus on test output and code changes. Include
file reads verbatim.
</example>
```

The two example instruction styles (`## Compact Instructions` and `# Summary instructions`) intentionally show different header conventions to signal that the model should adapt to whatever style the hook or user uses. The examples themselves are hard-coded suggestions, not real instructions — they prime the model to expect instruction-style content rather than treating it as content to summarize.

This block only appears in the full prompt body, not in the partial variants. Partial-compact callers don't pass custom instructions through the same path — they pass them via `userFeedback` which becomes part of `getCompactUserSummaryMessage`'s output, not the LLM-call prompt.

---

## 11. Summary — Prompt Template Decision Tree

```
                +---------------------------------+
                | Compaction caller                |
                +----------------+----------------+
                                 |
        +------------------------+-----------------------+
        |                        |                       |
        v                        v                       v
  Full conversation       Partial conversation     Reactive (group walk)
    (autocompact,          (/rewind menu)            (reactive lane)
     /compact, etc.)              |                          |
        |                         |                          |
        v             +-----------+-----------+              v
compactFullPrompt     |                       |     compactFullPrompt
   (bq8)            "from"                "up_to"        (bq8)
     |          default v2.1.112        v2.1.141 NEW       |
     |                 |                     |             |
     v                 v                     v             v
     |     compactPartialPrompt    compactPartialPrompt    |
     |        (m47, from)              (m47, up_to)        |
     |                 |                     |             |
     +-----------------+-----------+---------+-------------+
                                   |
                                   v
                + sensitive-instructions clause (v2.1.139)
                + Additional Instructions (user + hook merged)
                + NO_TOOLS_TRAILER
                                   |
                                   v
                         +-------------------+
                         | LLM call          |
                         +---------+---------+
                                   |
                                   v
                    stripAnalysisAndRewrapSummary (J3_)
                                   |
                                   v
                  wrapSummaryAsContinuationPrompt (fM$)
                                   |
                                   v
                         +--------------------+
                         | User-facing summary|
                         | message inserted   |
                         | at start of new ctx|
                         +--------------------+
```

**Key insight:** The compaction prompt is one of the most carefully-tuned single artifacts in Claude Code. Every clause — preamble, body, sensitive-instructions, example, trailer — has been shown to measurably shift compaction success rates in production telemetry. The v2.1.139 sensitive-instructions clause was added after a production review showed compactions silently stripping `"don't touch the .env file"`-style guardrails; the v2.1.141 up_to variant was added to support a UX flow that previously could only summarize recent history. The prompt template is treated as a versioned API surface, not as static text.
