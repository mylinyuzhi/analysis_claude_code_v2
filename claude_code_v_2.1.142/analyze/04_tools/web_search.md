# WebSearch — Web Search via Anthropic Native Tool

> **Tool name:** `WebSearch` (user-facing: `Web Search`)
> **Source:** `cli_inner_pretty.js:381254-381453` (`C38` declaration)
> **Search hint:** *search the web for current information*
> **Concurrency-safe:** true · **Read-only:** true

---

## Overview

`WebSearch` runs a web search via Anthropic's native `web_search_20250305` server tool. The Claude model is instructed to call the search tool (`web_search`), then the WebSearch wrapper extracts results from the streaming response and returns them as search-result blocks.

Region: **US-only**. Maximum **8 searches per call** (`max_uses: 8`).

---

## Schema

```javascript
// ============================================
// webSearchInputSchema - bt_ query + domain filters
// Location: cli_inner_pretty.js:381229-381235
// ============================================

// ORIGINAL (for source lookup):
bt_ = yH(() =>
  y.strictObject({
    query: y.string().min(2).describe("The search query to use"),
    allowed_domains: y.array(y.string()).optional().describe("Only include search results from these domains"),
    blocked_domains: y.array(y.string()).optional().describe("Never include search results from these domains"),
  }),
);

// READABLE (for understanding):
const webSearchInputSchema = lazySchema(() =>
  z.strictObject({
    query: z.string().min(2),
    allowed_domains: z.array(z.string()).optional(),
    blocked_domains: z.array(z.string()).optional(),
  }),
);

// Mapping: bt_→webSearchInputSchema
```

`validateInput` rejects empty queries and the both-allowed-and-blocked-set combination ("Cannot specify both `allowed_domains` and `blocked_domains` in the same request" — pick filtering direction).

---

## Key Behavior

### v2.1.141 "Did 0 searches" fix

```javascript
// ============================================
// extractWebSearchResults - Bt_ with searchCount fix (v2.1.141)
// Location: cli_inner_pretty.js:381186-381215
// ============================================

// ORIGINAL (for source lookup):
function Bt_(H, $, q) {
  let K = [], _ = "", A = !0, z = 0, Y = 0;
  for (let f of H) {
    if (f.type === "server_tool_use") {
      if ((z++, A)) {
        if (((A = !1), _.trim().length > 0)) K.push(_.trim());
        _ = "";
      }
      continue;
    }
    if (f.type === "web_search_tool_result") {
      if ((Y++, !Array.isArray(f.content))) {
        let M = `Web search error: ${f.content.error_code}`;
        (N(M, { level: "error" }), K.push(M));
        continue;
      }
      let O = f.content.map((M) => ({ title: M.title, url: M.url }));
      K.push({ tool_use_id: f.tool_use_id, content: O });
    }
    if (f.type === "text")
      if (A) _ += f.text;
      else ((A = !0), (_ = f.text));
  }
  if (_.length) K.push(_.trim());
  return { query: $, results: K, durationSeconds: q, searchCount: Math.max(z, Y) };
}

// READABLE (for understanding):
function extractWebSearchResults(streamBlocks, query, durationSeconds) {
  const results = [];
  let textBuffer = "";
  let inTextRun = true;
  let serverToolUseCount = 0;     // ← v2.1.141: count attempted searches
  let resultBlockCount = 0;       // ← v2.1.141: count completed result blocks

  for (const block of streamBlocks) {
    if (block.type === "server_tool_use") {
      serverToolUseCount++;
      if (inTextRun) {
        inTextRun = false;
        if (textBuffer.trim().length > 0) results.push(textBuffer.trim());
        textBuffer = "";
      }
      continue;
    }
    if (block.type === "web_search_tool_result") {
      resultBlockCount++;
      if (!Array.isArray(block.content)) {
        // Error path: server returned an error_code (e.g. rate-limit, no-region).
        const errorMessage = `Web search error: ${block.content.error_code}`;
        logError(errorMessage);
        results.push(errorMessage);
        continue;
      }
      const hits = block.content.map((h) => ({ title: h.title, url: h.url }));
      results.push({ tool_use_id: block.tool_use_id, content: hits });
    }
    if (block.type === "text") {
      if (inTextRun) textBuffer += block.text;
      else { inTextRun = true; textBuffer = block.text; }
    }
  }
  if (textBuffer.length) results.push(textBuffer.trim());

  // v2.1.141 fix: use Math.max so that even when EVERY search errors
  // (z>0, Y>0 with all results being error blocks) the count is non-zero.
  // Before: only one of these was used, and an error path could leave count=0
  // → UI showed "Did 0 searches in X ms" even when the model attempted N.
  return {
    query,
    results,
    durationSeconds,
    searchCount: Math.max(serverToolUseCount, resultBlockCount),
  };
}

// Mapping: Bt_→extractWebSearchResults, z→serverToolUseCount, Y→resultBlockCount
```

### Result rendering

```javascript
// ============================================
// renderWebSearchResultMessage - Fc7
// Location: cli_inner_pretty.js:381153-381165
// ============================================

// READABLE:
function renderWebSearchResultMessage(result) {
  const count = result.searchCount ?? countWebSearchResults(result.results ?? []);
  const duration = result.durationSeconds >= 1
    ? `${Math.round(result.durationSeconds)}s`
    : `${Math.round(result.durationSeconds * 1000)}ms`;
  return <Box justifyContent="space-between" width="100%">
    <Box height={1}>
      <Text>Did {count} search{count !== 1 ? "es" : ""} in {duration}</Text>
    </Box>
  </Box>;
}
```

Status string format: "Did N searches in Xms" — singular/plural aware. With the v2.1.141 fix, N is the *attempted* count (capped at the result-block count when both are nonzero), not the *success* count.

### Region + provider gating

```javascript
isEnabled() {
  const provider = currentProvider();
  if (provider === "firstParty" || provider === "anthropicAws") return true;
  if (provider === "gateway") return false;                          // gateway: disabled
  if (provider === "vertex") {
    const model = currentModel();
    return ["claude-opus-4", "claude-sonnet-4", "claude-haiku-4"].some(prefix => model.includes(prefix));
  }
  if (provider === "foundry") return true;
  return false;
}
```

Web search is **disabled** on gateway providers (no native web_search support). Vertex is conditionally enabled based on whether the chosen Claude model supports the native tool.

### Current-month hint in prompt

```javascript
const month = WcK();  // current month string
// FlK(model) returns either short or long variant:
// "Search the web. ... The current month is ${month} — use this when searching for recent information. ..."
```

The model is *explicitly told* what month it is so it can include the current year in search queries (preventing the "search docs for React in 2024" stale-results problem when the current year is later).

---

## Key Insights

**Why use Anthropic's native `web_search` server tool instead of a 3rd-party search API?**
- Built into the model: Claude can decide WHEN to issue searches based on the conversation.
- Domain-filtered: `allowed_domains` / `blocked_domains` are honored by the search backend, not just filtered post-hoc.
- Sources are surfaced as structured `{tool_use_id, content[{title,url}]}` blocks the rendering can hyperlink.

**Why `max_uses: 8`?** Caps the cost-per-call. The model can issue up to 8 searches in service of one query, but no more — a runaway recursive search storm is contained.

**The CRITICAL "Sources:" requirement.** The prompt's branch-2 variant has hard-coded MANDATORY language: *"After answering the user's question, you MUST include a 'Sources:' section at the end ... This is MANDATORY - never skip including sources in your response."* This requirement is for legal/IP reasons (attribution to the source pages) and accuracy (so the user can verify the answer).

**`extractSearchText: () => ""`** is intentionally empty. WebSearch doesn't produce its own "search text" for the `extractSearchText` indexing layer (used for tool history search) — the query itself is sufficient context.

**The Math.max in v2.1.141 fix is subtle but important.** When **every** search returns an error (rate-limit, region-blocked, etc.), `Y` (result-block count) would be ≥ 1 (one error block per attempt), and `z` (server-tool-use count) would also be ≥ 1. Without `Math.max`, the previous code used only `Y`, and a race or missed event could leave the count at 0 in some failure modes. Max-of-both is robust to both "no result blocks emitted yet but server_tool_use fired" and "result blocks emitted but server_tool_use was missed".

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.141:** Fixed Web Search status showing "Did 0 searches" when searches returned errors — `searchCount: Math.max(z, Y)`.
- **v2.1.126:** Fixed deferred tools (WebSearch, WebFetch, etc.) not being available to skills with `context: fork` and other subagents on their first turn.
- **v2.1.122:** Fixed ToolSearch missing MCP tools that connected after session start in nonblocking mode (affects how WebSearch is surfaced when deferred).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Web*

Key functions in this document:
- `WebSearchTool` (`C38`) — declaration with provider-gated `isEnabled`
- `webSearchInputSchema` (`bt_`) — query + allowed/blocked_domains
- `extractWebSearchResults` (`Bt_`) — v2.1.141 `Math.max` fix
- `renderWebSearchResultMessage` (`Fc7`) — "Did N searches in X" formatter
- `buildWebSearchToolSchema` (`mt_`) — `web_search_20250305` server-tool schema with `max_uses: 8`
- `WEB_SEARCH_TOOL_NAME` (`VI`) — `"WebSearch"`
- `buildWebSearchPrompt` (`FlK`) — current-month-aware prompt
- `getCurrentMonth` (`WcK`) — month string helper
