# MCP Large-Output Truncation — Format-Specific Recipes

**Versions:** 2.1.105

## Summary

When an MCP tool returns a result that exceeds the per-tool result-size cap (`maxResultSizeChars`), Claude Code persists the full payload to disk and substitutes a short message back to the model. Pre-2.1.105 that message was generic: *"Output truncated. Refine your query."* The model had no clear path forward.

v2.1.105 expanded the substituted message into a **format-specific recipe**:

- For **JSON content** (`structuredContent` or `contentArray`): suggest `jq` for targeted queries, with concrete commands like `jq 'type, length, keys?' <path>` to probe structure.
- For **plain text** that's line-based: tell the model exactly how many lines to read per `Read(file, offset, limit)` chunk, computed from the file's max line length and the available token budget.
- For **text with very long lines** (binary-ish or single huge token): give a Python `read()[A:B]` slicing recipe in fixed-character chunks.

The recipe also tells the model the **summarization-via-subagent pattern**: "If a Task tool is available, do this inside a subagent so the full output stays out of your main context."

## Files Involved

| Path | Lines | What |
|------|------:|------|
| `chunks.145.mjs` | 432-441 | `formatPersistedOutputType` (`YK7`) — maps `toolResult`/`structuredContent`/`contentArray` to "Plain text"/"JSON"/"JSON array" labels |
| `chunks.145.mjs` | 443-466 | `buildPersistedOutputMessage` (`vWK`) — the format-specific recipe builder |
| `chunks.145.mjs` | 468-475 | `buildOldFormatPersistedOutputMessage` (`szY`) — the legacy generic message (kept for the feature-flag off path) |
| `chunks.145.mjs` | 427-430 | `isFormatSpecificRecipesEnabled` (`zK7`) — feature gate |
| `chunks.161.mjs` | 2491-2554 | `routeMcpLargeResult` (`nvY`) — the gate that decides "persist to disk vs return inline" and produces the final message |
| `chunks.161.mjs` | 2552-2553 | call site: `YK7` produces the type label, `vWK` produces the message |

## The Format-Specific Recipe Builder

```javascript
// ============================================
// buildPersistedOutputMessage - generate format-specific recovery instructions
// Location: chunks.145.mjs:443-466
// ============================================

// ORIGINAL (for source lookup):
function vWK(q, K, _, z, Y) {
    let O = `Error: result (${Y!==void 0?`${K.toLocaleString()} characters across ${Y.count.toLocaleString()} ${Y.count===1?"line":"lines"}`:`${K.toLocaleString()} characters`}) exceeds maximum allowed tokens. Output has been saved to ${q}.
Format: ${_}
`,
        w = Math.floor(as().maxTokens * 4 * 0.8),    // 80% of model's max tokens (×4 = chars/token)
        $ = 8,
        j = Y !== void 0 && Y.count > 1 && Y.maxLen <= w,
        H = j ? Math.max(1, Math.floor(w / (Y.maxLen + 8))) : void 0;
    if (!zK7()) return O + `Use offset and limit parameters to read specific portions of the file, search within it for specific content, and jq to make structured queries.
REQUIREMENTS FOR SUMMARIZATION/ANALYSIS/REVIEW:
` + szY(q, z);
    let J, X, M;
    if (Y === void 0) J = `- For targeted queries (find a value, filter by field): use jq on the file directly.
`, X = `first probe the structure (e.g., jq 'type, length, keys?' ${q}), then extract slices with jq or python — Read's line-based offset/limit will not chunk this file.`, M = `${q} is ${_}; probe the structure with jq (type/length/keys), then extract and read the content in full with jq or python, then summarize and quote any key findings verbatim.`;
    else if (!j) {
        let P = w.toLocaleString();
        J = `- For targeted searches (find a string): use grep on the file directly.
`, X = `the file's lines are too long for Read's offset/limit. Slice by character range via Bash instead — e.g. python3 -c "print(open('${q}').read()[A:B])" in ~${P}-char spans until you have read 100% of it.`, M = `Slice ${q} in ~${P}-char spans via python (read()[A:B]) until you have read all ${K.toLocaleString()} characters, then summarize and quote any key findings verbatim.`
    } else J = `- For targeted searches (find a line, locate a string): use grep on the file directly.
`, X = `read ${q} in chunks of ~${H} lines using offset/limit until you have read 100% of it.`, M = `Read ${q} in chunks of ~${H} lines using offset/limit until you have read all ${Y.count.toLocaleString()} lines, then summarize and quote any key findings verbatim.`;
    return O + J + `- For analysis or summarization that requires reading the full content: ${X}
- If the ${T4} tool is available, do this inside a subagent so the full output stays out of your main context. Give it the instruction above verbatim, and be explicit about what it must return — e.g. "${M}" A vague "summarize this" may lose detail.
`
}

// READABLE (for understanding):
function buildPersistedOutputMessage(persistFilepath, origCharCount, formatLabel, _unused, lineStats) {
    // Header — always emitted
    const header = `Error: result (` +
        (lineStats !== undefined
            ? `${origCharCount.toLocaleString()} characters across ${lineStats.count.toLocaleString()} ${lineStats.count === 1 ? "line" : "lines"}`
            : `${origCharCount.toLocaleString()} characters`) +
        `) exceeds maximum allowed tokens. Output has been saved to ${persistFilepath}\nFormat: ${formatLabel}\n`;

    // Compute the per-chunk char budget for line-based Read:
    //   maxTokens(model) × 4 chars/token × 0.8 safety margin
    const charBudget = Math.floor(getActiveModel().maxTokens * 4 * 0.8);
    const lineOverheadChars = 8;

    // Can we do line-based Read chunks?
    //  - we have lineStats (lineStats != null → result is plain text not JSON)
    //  - there's more than one line
    //  - the longest line fits in the per-call budget
    const canDoLineBasedRead = lineStats !== undefined && lineStats.count > 1 && lineStats.maxLen <= charBudget;
    const linesPerChunk = canDoLineBasedRead
        ? Math.max(1, Math.floor(charBudget / (lineStats.maxLen + lineOverheadChars)))
        : undefined;

    // FEATURE-GATE OFF: legacy generic message (pre-2.1.105 behavior)
    if (!isFormatSpecificRecipesEnabled()) {
        return header +
            `Use offset and limit parameters to read specific portions of the file, search within it for specific content, and jq to make structured queries.\nREQUIREMENTS FOR SUMMARIZATION/ANALYSIS/REVIEW:\n` +
            buildOldFormatPersistedOutputMessage(persistFilepath, _unused);
    }

    // FEATURE-GATE ON (default): format-specific recipe
    let targetedTip, analysisRecipe, subagentInstruction;
    if (lineStats === undefined) {
        // JSON-LIKE PATH — no line stats means the result was non-text (structuredContent / contentArray)
        targetedTip = `- For targeted queries (find a value, filter by field): use jq on the file directly.\n`;
        analysisRecipe = `first probe the structure (e.g., jq 'type, length, keys?' ${persistFilepath}), ` +
                         `then extract slices with jq or python — Read's line-based offset/limit will not chunk this file.`;
        subagentInstruction = `${persistFilepath} is ${formatLabel}; probe the structure with jq (type/length/keys), ` +
                              `then extract and read the content in full with jq or python, then summarize and quote any key findings verbatim.`;
    } else if (!canDoLineBasedRead) {
        // TEXT WITH SUPER-LONG LINES — fall back to character slicing
        const budgetLabel = charBudget.toLocaleString();
        targetedTip = `- For targeted searches (find a string): use grep on the file directly.\n`;
        analysisRecipe = `the file's lines are too long for Read's offset/limit. ` +
                         `Slice by character range via Bash instead — e.g. python3 -c "print(open('${persistFilepath}').read()[A:B])" ` +
                         `in ~${budgetLabel}-char spans until you have read 100% of it.`;
        subagentInstruction = `Slice ${persistFilepath} in ~${budgetLabel}-char spans via python (read()[A:B]) ` +
                              `until you have read all ${origCharCount.toLocaleString()} characters, ` +
                              `then summarize and quote any key findings verbatim.`;
    } else {
        // PLAIN TEXT, LINE-BASED — recommended path, gives explicit chunk size
        targetedTip = `- For targeted searches (find a line, locate a string): use grep on the file directly.\n`;
        analysisRecipe = `read ${persistFilepath} in chunks of ~${linesPerChunk} lines using offset/limit until you have read 100% of it.`;
        subagentInstruction = `Read ${persistFilepath} in chunks of ~${linesPerChunk} lines using offset/limit ` +
                              `until you have read all ${lineStats.count.toLocaleString()} lines, then summarize and quote any key findings verbatim.`;
    }

    return header + targetedTip +
        `- For analysis or summarization that requires reading the full content: ${analysisRecipe}\n` +
        `- If the ${TASK_TOOL_NAME} tool is available, do this inside a subagent so the full output stays out of your main context. ` +
        `Give it the instruction above verbatim, and be explicit about what it must return — e.g. "${subagentInstruction}" ` +
        `A vague "summarize this" may lose detail.\n`;
}

// Mapping: vWK→buildPersistedOutputMessage, q→persistFilepath, K→origCharCount,
//          _→formatLabel, z→_unused, Y→lineStats (count + maxLen of original text),
//          w→charBudget, $→lineOverheadChars, j→canDoLineBasedRead, H→linesPerChunk,
//          J→targetedTip, X→analysisRecipe, M→subagentInstruction, T4→TASK_TOOL_NAME,
//          as→getActiveModel, zK7→isFormatSpecificRecipesEnabled,
//          szY→buildOldFormatPersistedOutputMessage
```

## How the Three Branches are Selected

The decision tree inside `buildPersistedOutputMessage`:

```
                         lineStats === undefined?
                                 │
                  YES ───────────┴───────────── NO
                   │                             │
                   ▼                             ▼
               JSON path                 lineStats.count > 1
            (jq recipe)                  AND
                                         lineStats.maxLen ≤ charBudget?
                                                 │
                                  YES ───────────┴───────────── NO
                                   │                             │
                                   ▼                             ▼
                          Line-based Read              Character-slice Python
                          chunks of N lines            ~N chars per slice
```

`lineStats` comes from `chunks.161.mjs:2522-2533`: it's computed *only* for content classified as text-like (`O === "toolResult" || P !== void 0`). For JSON `structuredContent` / `contentArray`, `lineStats` is `undefined` and the JSON branch is taken. For plain text, `lineStats = { count, maxLen }` where `count` is line count and `maxLen` is the maximum line length.

The `canDoLineBasedRead` branch is the **preferred** outcome. Line-based Read is the cleanest API the model has. The character-slice fallback exists for pathological cases — minified JSON dumps, base64-encoded blobs that landed in `toolResult`, files with a single multi-megabyte line. Without the character-slice fallback, the model would either be forced into `jq` (which won't work on non-JSON text) or `Read(offset, limit)` with the wrong granularity (one line might exceed the model's per-call budget).

## How It's Triggered

The call site in `chunks.161.mjs:2491-2554`:

```javascript
// (excerpt: nvY / routeMcpLargeResult)
async function routeMcpLargeResult(rawResult, toolName, serverName, model, hasMetaOverride = false) {
    const { content, type, schema } = await normalizeMcpResult(rawResult, toolName, serverName, model);
    if (serverName === "ide") return content;                         // IDE MCP bypasses persist
    if (hasMetaOverride && !containsImages(content)) return content;  // _meta override bypasses persist
    if (!await isOversized(content)) return content;
    // ... DRK(content) → contains images → can't persist → return short truncated text ...
    // ... ENABLE_MCP_LARGE_OUTPUT_FILES=false → opt-out path ...

    const lineStats = computeLineStats(content);            // count + maxLen for text-like; undefined otherwise
    const persisted = await persistToDisk(content, persistId);
    if (persisted.error) {
        return /* short text fallback */;
    }
    const formatLabel = formatPersistedOutputType(type, schema);
    return buildPersistedOutputMessage(persisted.filepath, persisted.originalSize, formatLabel, undefined, lineStats);
}
```

Note three escape hatches:
1. `ENABLE_MCP_LARGE_OUTPUT_FILES=false` (env var, opt-out) — disables the entire persist path, falls back to in-context truncation.
2. `hasMetaOverride` — the `_meta["anthropic/maxResultSizeChars"]` override (see [max_result_size_chars.md](./max_result_size_chars.md)) lets specific tools bypass persistence entirely.
3. Images in the result — can't persist multimodal content, so the simple truncation path is used.

## Why This Approach

**Why format-specific recipes instead of "just truncate":**
The model receives "Output too large. Try again." had three failure modes:
1. The model re-issues the *same* tool call — wasteful, hits the same cap.
2. The model gives up and asks the user.
3. The model invents a parameter that doesn't exist (e.g. `limit=100`) hoping the tool supports it.

Format-specific recipes give the model a **concrete next step**, with file path baked in. The model knows: "OK, I'll run `Read(<path>, 0, 200)` or `Bash(jq 'type, length, keys?' <path>)`." Action-oriented prompts shift the model from guessing to executing.

**Why compute `linesPerChunk` based on model max-tokens:**
A small model (Haiku, 8K output) can read ~25K chars per call (× 4 chars/token × 0.8). A large model (Opus, 64K output) can read 200K chars. Hardcoding "200 lines" would underuse Opus and overflow Haiku. The dynamic computation:
```
charBudget = maxTokens × 4 × 0.8
linesPerChunk = floor(charBudget / (maxLineLen + 8))
```
ensures each Read fills the model's output budget without truncation. The `+ 8` is overhead for line numbering and ANSI control sequences.

**Why the 0.8 safety margin:**
The model's max-tokens is for *all* output: text response + tool calls + thinking. Eating 80% with raw file content leaves 20% for the model's actual reply. Without this margin, large files would force the model into "I read X lines but can't respond about them" failure mode.

**Why character-slice fallback uses Python (not Bash dd or cut):**
- `cut -c A-B file` works but the BSD `cut` (macOS) has different syntax than GNU `cut` (Linux). Cross-platform inconsistency.
- `dd if=file bs=1 skip=A count=$((B-A))` is slow (byte-at-a-time on stdlib `dd`) and confusing.
- `python3 -c "print(open('${q}').read()[A:B])"` is one-liner, universal, no quoting traps, supports UTF-8 boundary correctness.

**Why suggest a subagent (Task tool):**
The persisted file might be 500 KB. Reading it inline into the main agent's context blows the context budget. The Task subagent has its own context, processes the file, returns a few-KB summary. This is the canonical "process big-data-in-isolation" pattern. The recipe explicitly cites this: "Give it the instruction above verbatim, and be explicit about what it must return."

**Why the explicit "summarize this may lose detail" warning:**
Models tend to over-summarize when given vague instructions. A summary that drops the value the caller cared about wastes the entire effort. The recipe nudges the caller toward listing what to extract verbatim.

**Why a feature gate (`zK7`):**
The format-specific recipe path is new and complex; the feature flag lets the recipe be rolled out gradually and rolled back if it confuses any specific model. With the flag off, the legacy `szY` ("Use offset and limit, jq, etc.") message ships.

**Edge case: the lineStats vs JSON distinction:**
The decision is made upstream at `chunks.161.mjs:2519` via `D = O === "toolResult" || P !== void 0`. If `D` (i.e. the result was already text), lineStats is computed. Otherwise (JSON-shaped), lineStats stays undefined. This means a server that returns a JSON array containing text logs would be classified as JSON — even though the *content* is line-based. The model has to use `jq '.logs[]' file | head -N` rather than `Read(file, offset, limit)`. Slightly suboptimal but correct: the file is JSON-formatted on disk.

**Key insight:** This is "prompt engineering inside the runtime." The substituted message *is* a prompt — the model reads it on the next turn. Designing it carefully is the difference between an action-oriented next turn and a wasted-context apology. The pattern recurs in other parts of Claude Code: the truncated-too-large prompt for the Read tool (`chunks.165.mjs:2487`), the autocompact thrash error message (`chunks.159.mjs:1484`), and the model-facing notes for stale file state. Every message-back-to-the-model is a prompt that deserves design.

## Related Symbols

See [`symbol_additions_unit_14.md`](../00_overview/symbol_additions_unit_14.md) section "Module: MCP — Persisted Tool Output".

Key entities:
- `buildPersistedOutputMessage` (`vWK`, chunks.145.mjs:443-466) - format-specific recipe builder
- `formatPersistedOutputType` (`YK7`, chunks.145.mjs:432-441) - type → label mapper
- `isFormatSpecificRecipesEnabled` (`zK7`, chunks.145.mjs:427-430) - feature gate
- `buildOldFormatPersistedOutputMessage` (`szY`, chunks.145.mjs:468-475) - legacy generic message
- `routeMcpLargeResult` (`nvY`, chunks.161.mjs:2491-2554) - the gate function
- `persistToolResultToDisk` (`_L6`, chunks.86.mjs:2772-2803) - the underlying persist
- `getActiveModel` (`as`) - source of the per-call token budget
- `TASK_TOOL_NAME` (`T4`) - constant referenced for "use Task subagent" hint
