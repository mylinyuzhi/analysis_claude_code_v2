# Compaction Prompt — Preserve Sensitive User Instructions (v2.1.139)

## Changelog Anchor

> Compaction prompt now asks the model to preserve sensitive user instructions

## What Changed

All four variants of the compact summarizer prompt picked up two new sentences. The variants are:

- `bq8` — full-conversation compact (used by autocompact `Fo7` → `qrH` and slash `/compact`)
- `m47` with `direction: "from"` — partial compact summarizing *forward* from a rewind point
- `m47` with `direction: "up_to"` — partial compact summarizing *backward* up to a rewind point
- The recent-portion analysis block (`j3_`, the `"up_to"` body) — bound inside `Yj6`

Each got the same two-sentence security-preservation directive injected at two structural points: the chronological-analysis stage (section 1) and the user-message enumeration stage (section 6).

## The Two Sentences

**Section 1 (chronological analysis stage):**

```
- Note any security-relevant instructions or constraints the user stated (e.g.,
  sensitive files or data to avoid, operations that must not be performed,
  credential or secret handling rules). These MUST be preserved verbatim in
  the summary so they continue to apply after compaction.
```

**Section 6 (user-messages enumeration):**

```
6. All user messages: List ALL user messages that are not tool results.
   Preserve any security-relevant instructions or constraints verbatim so
   they remain in effect after compaction.
```

The "verbatim" word is doing the heavy lifting. Without it, summarizers tend to paraphrase: a user's "never write to /etc/passwd, period" becomes "the user wants to avoid system files", which loses the literal-substring anchoring that downstream allow/deny rules and pre-tool-use safety prompts depend on.

## Where In the Prompts

Showing the v2.1.142 full-compact prompt structure (line numbers from `cli_inner_pretty.js`):

```javascript
// ============================================
// compactFullPrompt - The big summarizer instruction for qrH/Fo7 autocompact pipeline
// Location: cli_inner_pretty.js:242949-243062
// ============================================

// ORIGINAL (for source lookup):
function bq8(H) {
  let $ =
    `CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.

- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.
- You already have all the context you need in the conversation above.
- Tool calls will be REJECTED and will waste your only turn — you will fail the task.
- Your entire response must be plain text: an <analysis> block followed by a <summary> block.

` +
    `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
... (long instructions) ...

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
   - Note any security-relevant instructions or constraints the user stated (e.g., sensitive files or data to avoid, operations that must not be performed, credential or secret handling rules). These MUST be preserved verbatim in the summary so they continue to apply after compaction.   // ← NEW IN v2.1.139
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.

...

Your summary should include the following sections:

1. Primary Request and Intent: ...
2. Key Technical Concepts: ...
3. Files and Code Sections: ...
4. Errors and fixes: ...
5. Problem Solving: ...
6. All user messages: List ALL user messages that are not tool results. These are critical for understanding the users' feedback and changing intent. Preserve any security-relevant instructions or constraints verbatim so they remain in effect after compaction.   // ← NEW IN v2.1.139
7. Pending Tasks: ...
8. Current Work: ...
9. Optional Next Step: ...
` ;
  if (H && H.trim() !== "")
    $ += `\n\nAdditional Instructions:\n${H}`;
  return (($ += u47), $);
}

// READABLE (for understanding):
function compactFullPrompt(additionalInstructions) {
  // Two-part composite: text-only guard + structured summarizer instructions.
  const NO_TOOLS_GUARD = `CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.

- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.
- You already have all the context you need in the conversation above.
- Tool calls will be REJECTED and will waste your only turn — you will fail the task.
- Your entire response must be plain text: an <analysis> block followed by a <summary> block.

`;

  const SUMMARIZER_INSTRUCTIONS =
    `Your task is to create a detailed summary of the conversation so far...

1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - ...
   - Pay special attention to specific user feedback ...
   - Note any security-relevant instructions or constraints the user stated (e.g.,
     sensitive files or data to avoid, operations that must not be performed,
     credential or secret handling rules). These MUST be preserved verbatim in
     the summary so they continue to apply after compaction.   // ← NEW v2.1.139

2. Double-check for technical accuracy and completeness ...

Your summary should include the following sections:
1. Primary Request and Intent ...
2. Key Technical Concepts ...
3. Files and Code Sections ...
4. Errors and fixes ...
5. Problem Solving ...
6. All user messages: List ALL user messages that are not tool results.
   These are critical for understanding the users' feedback and changing intent.
   Preserve any security-relevant instructions or constraints verbatim so they
   remain in effect after compaction.   // ← NEW v2.1.139
7. Pending Tasks ...
8. Current Work ...
9. Optional Next Step ...
`;

  let prompt = NO_TOOLS_GUARD + SUMMARIZER_INSTRUCTIONS;
  if (additionalInstructions && additionalInstructions.trim() !== "") {
    prompt += `\n\nAdditional Instructions:\n${additionalInstructions}`;
  }
  prompt += u47;  // No-tools reminder appendix
  return prompt;
}

// Mapping: bq8→compactFullPrompt, H→additionalInstructions, $→prompt, u47→NO_TOOLS_REMINDER
```

The same insertion is repeated in `m47` (partial compact, both directions) and inside `Yj6`'s `j3_` definition (the "RECENT messages only" variant body).

## Why Verbatim Matters

**What an unprompted summarizer does:**

User says: *"Never modify .git/ directly. If you need to change git state, do it via the gh CLI or by suggesting a command for me to run."*

Default summary: *"User wants careful handling of git state and prefers using the gh CLI."*

**Why this is a regression in security posture:**

1. **String-matching denylists break.** Many tool-permission checks look for literal substrings ("`.git/`", "`/etc/passwd`", "`secrets.json`"). A paraphrased summary doesn't carry the strings.
2. **Specificity bleed.** "Never modify .git/ directly" is a hard rule. "Careful handling of git state" is vibes — Claude might then run `git push --force` because it doesn't perceive that as "modifying" .git/.
3. **Path/credential leakage prevention.** If the user says "the API key is in `~/.config/foo/creds`, never `cat` it, never include its contents in messages", paraphrasing strips off the exact path and the exact prohibition shape.

**What the verbatim clause does:**

Forces the summarizer to copy the constraint exactly. The user's "Never modify .git/ directly" appears in the summary as that exact string, anchored to the user's role. Downstream permission checks, the system reminder builder, and the model itself all see the original wording.

## Architectural Note — Why It's In The Prompt, Not Code

A reasonable alternative would have been a post-summary regex pass that extracts and re-appends security-relevant lines. But:

- "Security-relevant" is fuzzy — no regex captures "the user said don't touch this thing" without huge false-positive/negative rates.
- The summarizer already has the entire conversation in context. It's the right component to do this work.
- Prompt-level instruction means the verbatim clause applies to *all four* compact variants without separate code paths.

The tradeoff: an LLM might still occasionally paraphrase. But the loss is gradual ("most" constraints preserved instead of "all"), whereas a regex-based approach has hard recall ceilings (it misses things the prompt doesn't have to).

## Verification Surface

The four variants all carry the change. Search the bundle for the canonical sentence to verify:

```bash
grep -c "These MUST be preserved verbatim in the summary so they continue to apply after compaction" \
  /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# → 3   (full, partial-from, recent-only/up_to)
```

```bash
grep -c "Preserve any security-relevant instructions or constraints verbatim so they remain in effect after compaction" \
  /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# → 3
```

(The partial `from` body shares the long `j3_` block with the `up_to` body via the `m47` switch on `$`, so the verbatim sentence appears 3× total in source even though it's used 4×.)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact module
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This unit's new symbols

Key functions:
- `compactFullPrompt` (`bq8`) — `cli_inner_pretty.js:242949-243062` — Full-conversation summarizer
- `compactPartialPrompt` (`m47`) — `cli_inner_pretty.js:242856-242948` — Partial summarizer (`from` and `up_to`)
- `compactRecentBodyConst` (`j3_`) — `cli_inner_pretty.js:243108-243181` — The recent-portion body used by `m47("up_to")`
- `compactNoToolsReminder` (`u47`) — `cli_inner_pretty.js:243182-243186` — Trailing reminder appended to all variants
- `lazyInitCompactBodies` (`Yj6`) — `cli_inner_pretty.js:243107` — Lazy initializer that builds `j3_` and `u47`
