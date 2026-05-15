# Tool: ToolSearch — Deferred Tool Discovery

> **Identity:** wire-name `ToolSearch`, userFacingName `""` (custom), `isReadOnly: true`, `isConcurrencySafe: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:383360-383616` (declaration), `assets/tools/ToolSearch.md` (tool def).

ToolSearch is the **deferred-tool loader**. Some tools are not advertised in the initial tool list — they appear only by name in system-reminder messages, and the model must call ToolSearch to fetch their schemas before it can invoke them. ToolSearch also handles MCP server autodiscovery: tools from pending-connection MCP servers become loadable once the server connects.

---

## Overview

The model's tool pool has three tiers:

1. **Always-on tools**: Read, Edit, Write, Bash, Glob, Grep, etc. — listed in every prompt. Cheap to keep visible; high-value.

2. **Deferred tools** (`shouldDefer: true`): TaskCreate, TaskUpdate, TaskGet, TaskList, EnterWorktree, ExitWorktree, etc. — listed only by *name* in the system reminder. Their schemas are not loaded until needed. Saves tokens on sessions that don't use them.

3. **MCP tools**: From connected MCP servers (Slack, GitHub, etc.). Some servers are still connecting at session start. Their tool definitions arrive asynchronously.

ToolSearch bridges 2 and 3: model passes a query (a tool name or keyword) and gets back the full schema definitions of matching tools, which then become callable. After ToolSearch loads a tool's schema, the model can use it like any always-on tool for the rest of the session.

---

## Input Schema (`Fl7`)

```javascript
// ============================================
// toolSearchInputSchema - Query + max_results
// Location: cli_inner_pretty.js:383360-383368 (Fl7)
// ============================================

// ORIGINAL (for source lookup):
Fl7 = yH(() =>
  y.object({
    query: y.string().describe('Query to find deferred tools. Use "select:<tool_name>" for direct selection, or keywords to search.'),
    max_results: y.number().optional().default(5).describe("Maximum number of results to return (default: 5)"),
  }),
);

// READABLE (for understanding):
toolSearchInputSchema = lazy(() =>
  z.object({
    query: z.string().describe('Query (use "select:Name" for exact, or keywords)'),
    max_results: z.number().optional().default(5).describe("Max matches"),
  }),
);

// Mapping: Fl7→toolSearchInputSchema
```

### Query Forms

| Form | Behavior |
|------|----------|
| `"select:Read,Edit,Grep"` | Exact lookup by name. Returns matches in input order. Missing names are reported but don't fail. |
| `"notebook jupyter"` | Keyword search — case-insensitive word match against tool names + search hints. Ranks by match count. |
| `"+slack send"` | Required-keyword + scored — tools must include "slack" in name; ranks remaining matches by other keyword scores. |

The query parsing is conditional in the call: `z.match(/^select:(.+)$/i)` detects the select form; everything else is keyword search.

---

## Output Schema (`gl7`)

```javascript
// ============================================
// toolSearchOutputSchema - Matches + state visibility hints
// Location: cli_inner_pretty.js:383370-383377 (gl7)
// ============================================

// ORIGINAL (for source lookup):
gl7 = yH(() => y.object({
  matches: y.array(y.string()),
  query: y.string(),
  total_deferred_tools: y.number(),
  pending_mcp_servers: y.array(y.string()).optional(),
}));

// READABLE (for understanding):
toolSearchOutputSchema = lazy(() =>
  z.object({
    matches: z.array(z.string()),             // tool names matched
    query: z.string(),                         // echo of the input
    total_deferred_tools: z.number(),          // size of the deferred pool
    pending_mcp_servers: z.array(z.string()).optional(),  // names of MCP servers still connecting
  }),
);

// Mapping: gl7→toolSearchOutputSchema
```

The output gives the model context:
- `matches`: names of tools to expect in the result block (their schemas are injected into a `<functions>` block in the tool-result content).
- `total_deferred_tools`: how many deferred tools exist (lets the model decide whether to broaden the search).
- `pending_mcp_servers`: which servers are still pending — if matches is empty, this hint suggests retrying after a moment.

---

## call() — Multi-Phase Search

The call function has three major phases:

### Phase 1: Setup and Helpers

```javascript
// ============================================
// callToolSearch - Phase 1: Setup, MCP-state helpers
// Location: cli_inner_pretty.js:383421-383497 (in wL$.call, setup phase)
// ============================================

// ORIGINAL (for source lookup):
async call(H, { options: { tools: $, refreshTools: q, mcpClients: K, refreshMcpClients: _ }, abortController: A }) {
  let { query: z, max_results: Y = 5 } = H,
    f = q?.() ?? $, O = f.filter(zm);
  Bl7(O);
  let M = () => _?.() ?? K;
  function w() { return M().filter((v) => v.type === "pending").map((v) => v.name); }
  function D(v, E) { /* extract target server names */ }
  function j() { /* refresh deferred pool, count new */ }
  async function J(v) { /* wait for pending MCP servers (Pe_ budget) */ }
  /* ... search dispatch follows ... */
}

// READABLE (for understanding):
async function callToolSearch({ query, max_results = 5 }, { options, abortController }) {
  const { tools, refreshTools, mcpClients, refreshMcpClients } = options;
  const initialTools = refreshTools?.() ?? tools;
  const initialDeferred = initialTools.filter(isDeferredTool);
  warmDeferredCache(initialDeferred);  // Bl7

  // Helper closures for MCP state observation
  const getMcpClients = () => refreshMcpClients?.() ?? mcpClients;
  function getPendingServerNames() {
    return getMcpClients().filter(c => c.type === "pending").map(c => c.name);
  }

  // Extract MCP server name targets from the query
  function extractTargetServers(input, knownServers) {
    const text = Array.isArray(input) ? input.join(" ") : input;
    const targets = new Set();
    // Find mcp__servername patterns in the query
    for (const match of text.matchAll(/mcp__([a-zA-Z0-9._-]+)/g)) {
      const fragment = match[1];
      const dashIdx = fragment.indexOf("__");
      targets.add(dashIdx >= 0 ? fragment.slice(0, dashIdx) : fragment);
    }
    // Find bare server names in the query (\b matching)
    const lowered = text.toLowerCase();
    for (const serverName of knownServers) {
      if (new RegExp(`\\b${escapeRegex(serverName)}\\b`, "i").test(lowered)) targets.add(serverName);
    }
    return [...targets];
  }

  function refreshDeferredPool() {
    const updatedTools = refreshTools?.() ?? initialTools;
    const initialNames = new Set(initialTools.map(t => t.name));
    const newCount = updatedTools.filter(t => !initialNames.has(t.name)).length;
    const updatedDeferred = updatedTools.filter(isDeferredTool);
    warmDeferredCache(updatedDeferred);
    return { freshTools: updatedTools, freshDeferred: updatedDeferred, newCount };
  }

  async function waitForPendingMcpServers(targetServers) {
    const startMs = Date.now();
    const deadline = startMs + MCP_WAIT_BUDGET_MS;  // Pe_
    while (Date.now() < deadline && !abortController.signal.aborted) {
      const stillPending = getMcpClients().filter(c => c.type === "pending");
      if (stillPending.length === 0) break;
      // Early exit: if no pending server matches our targets, no point waiting
      if (targetServers.length > 0 && !stillPending.some(c => targetServers.includes(c.name) || targetServers.includes(stripPrefix(c.name)))) break;
      await sleep(50, abortController.signal);
    }
    return Date.now() - startMs;
  }

  // ... continued ...
}
```

**Why refresh tools eagerly:** The deferred-tool pool may have changed since the agent loop's last tool-list was computed. Some sessions add tools dynamically (plugin activation, MCP server connect). Calling `refreshTools?.()` rebuilds the current pool before searching.

**Why warm a deferred cache:** The bundle keeps a per-tool ranking cache (`Bl7`). Recomputing the rank table for every search would be O(N) work per call. Caching makes repeated searches fast.

### Phase 2: MCP-Aware Search Function

```javascript
async function searchWithMcpRefreshIfNeeded(searcher, queryType, queryString) {
  const refreshResult = refreshDeferredPool();
  const pendingServers = getPendingServerNames();
  const pendingCount = pendingServers.length;

  // No new tools to consider and no pending servers? Nothing to do.
  if (!refreshTools || (refreshResult.newCount === 0 && pendingCount === 0)) return null;

  // Try the searcher with the current pool
  let matches = refreshResult.newCount > 0 ? await searcher(refreshResult.freshDeferred, refreshResult.freshTools) : [];
  let waitedMs = 0, skippedWait = true;

  // Extract target server names from query
  const targets = extractTargetServers(queryString, getMcpClients().map(c => c.name));
  const pendingTargetMatch = targets.length === 0 || targets.some(t => pendingServers.includes(t) || pendingServers.map(stripPrefix).includes(t));

  // If no matches yet and there are pending servers that could plausibly satisfy the query: wait
  if (matches.length === 0 && pendingCount > 0 && pendingTargetMatch) {
    skippedWait = false;
    waitedMs = await waitForPendingMcpServers(targets);
    const refreshed = refreshDeferredPool();
    matches = await searcher(refreshed.freshDeferred, refreshed.freshTools);
  }

  logEvent("tengu_tool_search_mcp_wait", { queryType, refreshOnly: skippedWait, waitedMs, pendingBefore: pendingCount, pendingAfter: getPendingServerNames().length, matchesAfterWait: matches.length, ... });
  return { matches, freshDeferred: refreshed.freshDeferred, freshTools: refreshed.freshTools };
}
```

**The wait-for-MCP logic:**

When the model searches for "slack" but the Slack MCP server is still in `pending` state, the tool *waits* (up to `Pe_` ms, typically a few seconds) for the connection to complete. After the wait, the deferred pool is re-checked and the search re-run.

The wait is gated on `pendingTargetMatch`: only wait if at least one pending server matches the query. If the user searches for "calendar" but no pending server name contains "calendar", waiting wouldn't help — return empty immediately.

**Why this matters:**

The agent loop runs once per turn. The model can't easily "wait and re-call" — that would burn turns. Building the wait into ToolSearch means a single call can wait for MCP and return tools all in one go, hiding the asynchrony from the model's perspective.

### Phase 3: Branch on Query Type

```javascript
// "select:" form — exact lookup
const selectMatch = query.match(/^select:(.+)$/i);
if (selectMatch) {
  const requestedNames = selectMatch[1].split(",").map(s => s.trim()).filter(Boolean);
  const found = [], missing = [];
  for (const name of requestedNames) {
    const tool = findTool(initialDeferred, name) ?? findTool(initialTools, name);
    if (tool) {
      if (!found.includes(tool.name)) found.push(tool.name);
    } else {
      missing.push(name);
    }
  }

  // If some names are missing, try refreshing+waiting for MCP
  let refreshHint;
  if (missing.length > 0) {
    const refreshResult = await searchWithMcpRefreshIfNeeded(
      async (freshDef, freshAll) => {
        const newlyFound = [];
        for (const name of missing) {
          const tool = findTool(freshDef, name) ?? findTool(freshAll, name);
          if (tool && !newlyFound.includes(tool.name)) newlyFound.push(tool.name);
        }
        return newlyFound;
      },
      "select",
      missing,
    );
    if (refreshResult) {
      refreshHint = refreshResult;
      if (refreshResult.matches.length > 0) {
        const merged = [...found, ...refreshResult.matches];
        const stillMissing = missing.filter(n => !refreshResult.matches.includes(n));
        // ... log result ...
        return buildResult(merged, query, refreshResult.freshDeferred.length, []);
      }
    }
  }

  if (found.length === 0) {
    return buildResult([], query, ..., getPendingServerNames());
  }
  return buildResult(found, query, ..., []);
}

// Keyword search form
let matches = await keywordSearch(query, initialDeferred, initialTools, max_results);
// If no matches, try MCP refresh
if (matches.length === 0) {
  const refreshResult = await searchWithMcpRefreshIfNeeded(
    (freshDef, freshAll) => keywordSearch(query, freshDef, freshAll, max_results),
    "keyword", query,
  );
  if (refreshResult && refreshResult.matches.length > 0) {
    matches = refreshResult.matches;
    return buildResult(matches, query, refreshResult.freshDeferred.length, []);
  }
}
if (matches.length === 0) {
  return buildResult([], query, ..., getPendingServerNames());
}
return buildResult(matches, query, ..., []);
```

### The Two Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| Select | `query` starts with `select:` | Comma-split names; exact match per name; partial success possible |
| Keyword | Anything else | Multi-word fuzzy ranking against name + searchHint |

Both modes go through the same MCP-refresh-on-miss logic. Both produce a `matches: string[]` of tool names that get rendered to the model.

---

## mapToolResultToToolResultBlockParam — Schema Injection

```javascript
// ============================================
// renderToolSearchResult - Inject tool schemas as tool_reference
// Location: cli_inner_pretty.js:383600-383615 (mapToolResultToToolResultBlockParam)
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam(H, $) {
  if (H.matches.length === 0) {
    let q = "No matching deferred tools found";
    if (H.pending_mcp_servers && H.pending_mcp_servers.length > 0) {
      let K = H.pending_mcp_servers,
        _ = K.length > xHH ? `${K.slice(0, xHH).join(", ")}, …and ${K.length - xHH} more` : K.join(", ");
      q += `. Some MCP servers are still connecting: ${_}. ...`;
    }
    return { type: "tool_result", tool_use_id: $, content: q };
  }
  return { type: "tool_result", tool_use_id: $, content: H.matches.map((q) => ({ type: "tool_reference", tool_name: q })) };
}

// READABLE (for understanding):
function mapResultToBlock(data, toolUseId) {
  if (data.matches.length === 0) {
    let message = "No matching deferred tools found";
    if (data.pending_mcp_servers && data.pending_mcp_servers.length > 0) {
      const servers = data.pending_mcp_servers;
      // Truncate the displayed list if too long
      const displayed = servers.length > MAX_DISPLAYED_PENDING
        ? `${servers.slice(0, MAX_DISPLAYED_PENDING).join(", ")}, …and ${servers.length - MAX_DISPLAYED_PENDING} more`
        : servers.join(", ");
      message += `. Some MCP servers are still connecting: ${displayed}. Their tools will become available shortly — try searching again. If you're looking for a capability rather than a specific tool name, try keywords that might match the server's purpose (e.g., 'slack message', 'calendar event'). Once you find a matching tool, call it directly — do not stop after searching.`;
    }
    return { type: "tool_result", tool_use_id: toolUseId, content: message };
  }
  // Return as tool_reference content blocks — the agent loop interprets these and injects the tools
  return {
    type: "tool_result",
    tool_use_id: toolUseId,
    content: data.matches.map(name => ({ type: "tool_reference", tool_name: name })),
  };
}
```

**The `tool_reference` content block type:** This is a special block type the agent loop interprets. When the model receives a tool result containing `tool_reference` blocks, the loop:

1. Looks up each referenced tool by name in the (now-refreshed) tool pool.
2. Generates a `<functions>` block at the top of the next prompt with those tools' JSONSchema definitions.
3. The model sees the new tools as if they were always-on.

After ToolSearch returns, the model invokes the referenced tools by name — they're now callable.

**Why the "still connecting" hint is so long:** Empty matches with pending servers is the most ambiguous outcome. The hint tells the model three things:
1. Wait and retry — servers might become available shortly.
2. Try semantic keywords rather than exact names — fuzzy search may catch related tools.
3. Don't stop after searching — once a tool is found, *use* it; the search is preparation, not the goal.

This addresses the common model failure mode of "I searched and didn't find it, so I'll explain to the user that the tool doesn't exist" — which is wrong when servers are still connecting.

---

## isEnabled

```javascript
isEnabled() { return UI(); }
```

The tool is gated by `UI()` which checks whether the `tengu_tool_search_enabled` GrowthBook gate is on. ToolSearch is a gradual rollout — older versions used a different mechanism (deferred tools were always visible). The gate lets the team flip ToolSearch on/off without redeployment.

---

## Render Methods

```javascript
renderToolUseMessage() { return null; }
userFacingName: () => "",
```

Both blank. The tool is meant to be invisible — the model uses it to discover tools, the user doesn't need to see "Searching for tools..." in the conversation. The result block is the only visible artifact, and that's the schema injection.

---

## Key Insights

- **`tool_reference` is the magic content type**: The result is not text — it's a list of references that the agent loop converts to schema injections. This is unique to ToolSearch; no other tool uses this content type.

- **MCP wait is in-tool, not in-loop**: The MCP refresh+wait logic lives inside ToolSearch's `call()`. From the agent loop's perspective, ToolSearch is just slow on a cold-MCP turn. The loop doesn't need to know about MCP at all.

- **Pending-server hint is the key UX**: When no tools match but servers are pending, the response includes a strongly-worded suggestion to retry. This prevents the model from prematurely giving up.

- **Select vs keyword distinction is by prefix**: `select:` prefix means "I know the exact names." No prefix means "find me whatever matches." This dispatch is a simple regex check — no schema variation.

- **Pre-warmed deferred cache**: `Bl7` warms an indexing structure once per call. Repeated keyword searches in the same turn (rare but possible with parallel tool calls) reuse this cache.

- **`refreshTools?.()` is optional**: Some tool pools are statically frozen (test mode, SDK). When `refreshTools` is undefined, the search uses only the initial pool. The `if (!refreshTools || ...)` check in `searchWithMcpRefreshIfNeeded` short-circuits the MCP refresh logic.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.114 | ToolSearch introduced for the deferred-tools system. |
| v2.1.117 | `select:` form added for exact lookup. |
| v2.1.121 | MCP autodiscovery — wait up to `Pe_` ms for pending servers when their tools are likely targets. |
| v2.1.125 | Pending-server hint with capability-keyword suggestion. |
| v2.1.129 | `pending_mcp_servers` field in output for state visibility. |
| v2.1.133 | Pending server display truncation (max N names + "and X more"). |
| v2.1.136 | `pendingTargetMatch` short-circuit — don't wait if no pending server could match. |
| v2.1.142 | No changes. |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 plan/worktree/ToolSearch additions

Key functions in this document:
- `toolSearchInputSchema` (Fl7) - {query, max_results?}
- `toolSearchOutputSchema` (gl7) - {matches, query, total_deferred_tools, pending_mcp_servers?}
- `toolSearchTool` (wL$) - Tool definition
- `keywordSearch` (Ul7) - Keyword-search ranking
- `findTool` (i4) - Exact-name lookup
- `warmDeferredCache` (Bl7) - Index warmer for ranking
- `isDeferredTool` (zm) - `shouldDefer === true` predicate
- `buildResult` (IiH) - Output object builder
- `isToolSearchEnabled` (UI) - GrowthBook gate
- `MCP_WAIT_BUDGET_MS` (Pe_) - Wait budget constant
- `stripPrefix` ($_) - Strip "mcp__" prefix
- `TOOL_SEARCH_TOOL_NAME` (cY) - "ToolSearch"
