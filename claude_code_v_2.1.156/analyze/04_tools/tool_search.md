# Tool: ToolSearch — Deferred-Tool Discovery (v2.1.156)

> **Identity:** wire-name `ToolSearch` (`l3`), `userFacingName: () => ""`, `isReadOnly: true`,
> `isConcurrencySafe: true`, `maxResultSizeChars: 100_000`.
> **Source (2.1.156):** tool object `wV$` at `cli_inner_pretty.js:404286-404506`; search algorithm
> `jf4` at `404164-404231`; schemas `wf4`/`Df4` at `404249-404266`.
> **Cross-validation baseline (2.1.88):** `src/tools/ToolSearchTool/ToolSearchTool.ts` (471 lines),
> `src/tools/ToolSearchTool/{prompt.ts,constants.ts}`, `src/utils/toolSearch.ts`.
> **Prior doc:** `claude_code_v_2.1.142/analyze/04_tools/tool_search.md`.

ToolSearch is the **deferred-tool loader**. Deferred tools are not advertised with full schemas in
the turn-1 prompt — they appear only by *name* in `<system-reminder>` messages, and the model must
call ToolSearch to fetch their JSONSchema before it can invoke them. ToolSearch also bridges MCP
autodiscovery: tools from still-connecting MCP servers become loadable once their server connects,
and the tool will *wait* (up to 5 s) for a relevant pending server inside a single call.

This document is a full re-analysis against the 2.1.156 bundle. Where 2.1.156 diverges from the
2.1.88 reconstruction, the divergence is called out inline and consolidated in
[§ v2.1.88 → v2.1.156 evolution](#v2188--v2156-evolution).

---

## 1. Overview — the three-tier tool pool

The model's tool pool has three tiers:

1. **Always-on tools** — Read, Edit, Write, Bash, Glob, Grep, … — full schema in every prompt.
2. **Deferred tools** (`shouldDefer: true` or MCP) — name only in the system reminder; schema fetched
   on demand. Decided by `isDeferredTool` (`pp`) — see [`deferred_tools.md`](./deferred_tools.md).
3. **MCP tools** — from connected MCP servers. Some servers are still connecting at session start;
   their tool defs arrive asynchronously.

ToolSearch bridges tiers 2 and 3: the model passes a query (a name or keywords), and gets back the
full schema definitions of matching tools as `tool_reference` content blocks, which the API expands
into callable tools for the rest of the session.

**The whole point — token economics:** with 40+ built-ins and potentially hundreds of MCP tools,
shipping every schema every turn would cost a large fraction of the context window. Deferral ships
"names you might need" cheaply and pays the full schema cost only for tools the model actually
reaches for. ToolSearch is the on-demand hydration path that makes deferral safe.

---

## 2. Tool object & schemas

```javascript
// ============================================
// ToolSearchTool - The tool object (identity, schemas, call, render)
// Location: cli_inner_pretty.js:404286-404506
// ============================================

// ORIGINAL (for source lookup):
wV$ = yK({
  isEnabled() { return wE(); },
  isConcurrencySafe() { return !0; },
  isReadOnly() { return !0; },
  name: l3,
  maxResultSizeChars: 1e5,
  async description() { return r18(); },
  async prompt() { return r18(); },
  get inputSchema() { return wf4(); },
  get outputSchema() { return Df4(); },
  async call(H, { options: { tools: $, refreshTools: q, mcpClients: K, refreshMcpClients: _ }, abortController: z }) { /* §4 */ },
  renderToolUseMessage() { return null; },
  userFacingName: () => "",
  mapToolResultToToolResultBlockParam(H, $) { /* §6 */ },
});

// READABLE (for understanding):
const ToolSearchTool = buildTool({
  isEnabled() { return isToolSearchEnabledOptimistic(); },   // wE — §5
  isConcurrencySafe: () => true,
  isReadOnly: () => true,                                     // pure discovery, never mutates
  name: TOOL_SEARCH_TOOL_NAME,                                // "ToolSearch"
  maxResultSizeChars: 100_000,
  async description() { return getPrompt(); },                // r18 — §3
  async prompt()      { return getPrompt(); },
  get inputSchema()  { return inputSchema(); },               // wf4
  get outputSchema() { return outputSchema(); },              // Df4
  async call(input, { options: { tools, refreshTools, mcpClients, refreshMcpClients }, abortController }) { /* §4 */ },
  renderToolUseMessage: () => null,                           // invisible in the transcript
  userFacingName: () => "",
  mapToolResultToToolResultBlockParam(content, toolUseID) { /* §6 */ },
});

// Mapping: wV$→ToolSearchTool, yK→buildTool, wE→isToolSearchEnabledOptimistic, l3→TOOL_SEARCH_TOOL_NAME,
//          r18→getPrompt, wf4→inputSchema, Df4→outputSchema, q→refreshTools, _→refreshMcpClients, z→abortController
```

### 2.1 Input schema (`wf4`)

```javascript
// ============================================
// inputSchema - {query, max_results?} for ToolSearch
// Location: cli_inner_pretty.js:404249-404258
// ============================================

// ORIGINAL (for source lookup):
wf4 = yH(() => y.object({
  query: y.string().describe('Query to find deferred tools. Use "select:<tool_name>" for direct selection, or keywords to search.'),
  max_results: y.number().optional().default(5).describe("Maximum number of results to return (default: 5)"),
}));

// READABLE (for understanding):
const inputSchema = lazySchema(() => z.object({
  query: z.string().describe('Query (use "select:Name" for exact, or keywords)'),
  max_results: z.number().optional().default(5).describe("Max matches"),
}));

// Mapping: wf4→inputSchema, yH→lazySchema, y→z(zod)
```

**Three query forms** (parsed in `call()`):

| Form | Behavior |
|------|----------|
| `select:Read,Edit,Grep` | Exact lookup by name. Comma-split, trimmed. Partial success allowed (some found, some missing). |
| `notebook jupyter` | Keyword search — case-insensitive token match against name parts + searchHint + description, ranked by score. |
| `+slack send` | `+`-prefixed terms are *required* (tool filtered out if absent); remaining terms rank the survivors. |

### 2.2 Output schema (`Df4`)

```javascript
// ============================================
// outputSchema - matches + deferred-pool & pending-server visibility
// Location: cli_inner_pretty.js:404259-404266
// ============================================

// ORIGINAL (for source lookup):
Df4 = yH(() => y.object({
  matches: y.array(y.string()),
  query: y.string(),
  total_deferred_tools: y.number(),
  pending_mcp_servers: y.array(y.string()).optional(),
}));

// READABLE (for understanding):
const outputSchema = lazySchema(() => z.object({
  matches: z.array(z.string()),                 // tool names matched (→ tool_reference blocks)
  query: z.string(),                            // echo of the query
  total_deferred_tools: z.number(),             // size of the deferred pool (lets model broaden)
  pending_mcp_servers: z.array(z.string()).optional(),  // servers still connecting
}));

// Mapping: Df4→outputSchema
```

**Cross-validation:** both schemas are **byte-identical** to 2.1.88
(`ToolSearchTool.ts:21-45`) — same field names, same descriptions, same `default(5)`. Confidence
**high**.

---

## 3. The prompt text (`r18`)

```javascript
// ============================================
// getPrompt - ToolSearch description/prompt text
// Location: cli_inner_pretty.js:216884-216899
// ============================================

// ORIGINAL (for source lookup):
function r18() { return Vk5 + vk5; }
var Vk5 = `Fetches full schema definitions for deferred tools so they can be called.

Deferred tools appear by name in <system-reminder> messages.`;
var vk5 = ` Until fetched, only the name is known — there is no parameter schema, so the tool cannot be invoked. This tool takes a query, matches it against the deferred tool list, and returns the matched tools' complete JSONSchema definitions inside a <functions> block. Once a tool's schema appears in that result, it is callable exactly like any tool defined at the top of the prompt.

Result format: each matched tool appears as one <function>{"description": "...", "name": "...", "parameters": {...}}</function> line inside the <functions> block — the same encoding as the tool list at the top of the prompt.

Query forms:
- "select:Read,Edit,Grep" — fetch these exact tools by name
- "notebook jupyter" — keyword search, up to max_results best matches
- "+slack send" — require "slack" in the name, rank by remaining terms`;

// READABLE (for understanding):
function getPrompt() { return PROMPT_HEAD + PROMPT_TAIL; }   // location hint is hard-coded now

// Mapping: r18→getPrompt, Vk5→PROMPT_HEAD, vk5→PROMPT_TAIL
```

**Why this matters — a real 2.1.156 delta.** In 2.1.88, `getPrompt()` interpolated a *runtime*
location hint:

```typescript
// 2.1.88 src/tools/ToolSearchTool/prompt.ts
function getToolLocationHint(): string {
  const deltaEnabled = process.env.USER_TYPE === 'ant'
    || getFeatureValue_CACHED_MAY_BE_STALE('tengu_glacier_2xr', false)
  return deltaEnabled
    ? 'Deferred tools appear by name in <system-reminder> messages.'
    : 'Deferred tools appear by name in <available-deferred-tools> messages.'
}
export function getPrompt() { return PROMPT_HEAD + getToolLocationHint() + PROMPT_TAIL }
```

In 2.1.156 the toggle is **gone**. `r18 = Vk5 + vk5` hard-codes the `<system-reminder>` wording, and
the string `available-deferred-tools` does **not appear anywhere in the 2.1.156 bundle**
(`grep -c "available-deferred-tools" → 0`). The `tengu_glacier_2xr` gate and
`isDeferredToolsDeltaEnabled` are likewise absent. This is the fingerprint of a **completed
rollout**: the delta-attachment protocol (see [`deferred_tools.md` § delta protocol](./deferred_tools.md))
is now the only announcement path, so the legacy pre-gate `<available-deferred-tools>` header is
fully retired. Confidence **high** (negative-grep + absent gate).

---

## 4. `call()` — multi-phase search

The 2.1.156 `call()` is materially richer than the 2.1.88 one. The 2.1.88 version (`ToolSearchTool.ts:328-434`)
reads pending servers from `getAppState()` and **reports but never waits**. The 2.1.156 version takes
`refreshTools` / `refreshMcpClients` callbacks and an `abortController`, and contains a full
**refresh-and-wait-for-MCP** sub-machine. Walkthrough:

### 4.1 Setup & helper closures

```javascript
// ============================================
// callToolSearch (Phase 1) - setup, deferred filter, MCP-state closures
// Location: cli_inner_pretty.js:404310-404350
// ============================================

// ORIGINAL (for source lookup):
async call(H, { options: { tools: $, refreshTools: q, mcpClients: K, refreshMcpClients: _ }, abortController: z }) {
  let { query: A, max_results: Y = 5 } = H,
    f = q?.() ?? $,
    O = f.filter(pp);          // deferred tools, freshly recomputed
  Of4(O);                      // invalidate description cache if the deferred set changed
  let M = () => _?.() ?? K;    // live MCP-clients getter
  function j() { return M().filter((v) => v.type === "pending").map((v) => v.name); }
  function w(v, E) { /* extract target server names from query */ }
  function D() { /* refresh deferred pool; count newly-appeared tools */ }
  async function J(v) { /* wait ≤ py_ ms for pending servers matching targets v */ }
  async function X(v, E, S) { /* MCP-aware search: run v(); if empty & pending, wait, re-run */ }
  // ... dispatch (select vs keyword) follows ...
}

// READABLE (for understanding):
async function call({ query, max_results = 5 }, { options, abortController }) {
  const { tools, refreshTools, mcpClients, refreshMcpClients } = options;
  const freshTools = refreshTools?.() ?? tools;        // rebuild the pool — it may have grown
  const deferred  = freshTools.filter(isDeferredTool); // pp
  maybeInvalidateCache(deferred);                      // Of4 → fingerprint compare
  const getMcpClients = () => refreshMcpClients?.() ?? mcpClients;
  const getPendingServerNames = () =>
    getMcpClients().filter(c => c.type === "pending").map(c => c.name);
  // extractTargetServers / refreshDeferredPool / waitForPendingMcpServers / searchWithMcpRefresh below
}

// Mapping: H→input, $→tools, q→refreshTools, K→mcpClients, _→refreshMcpClients, z→abortController,
//          O→deferred, pp→isDeferredTool, Of4→maybeInvalidateCache, j→getPendingServerNames
```

**Why refresh the pool eagerly (`q?.() ?? $`):** the deferred-tool set can change *after* the agent
loop computed its last tool list (an MCP server just connected, a plugin activated). `refreshTools()`
rebuilds "the pool as of right now" so a search isn't blind to tools that appeared mid-turn. When
`refreshTools` is undefined (frozen pool — SDK/test), it falls back to the static `tools`.

### 4.2 `extractTargetServers` (`w`) — which pending servers could satisfy this query?

```javascript
// ============================================
// extractTargetServers - parse mcp__ patterns + bare server names from the query
// Location: cli_inner_pretty.js:404321-404332
// ============================================

// ORIGINAL (for source lookup):
function w(v, E) {
  let S = Array.isArray(v) ? v.join(" ") : v, h = new Set();
  for (let C of S.matchAll(/mcp__([a-zA-Z0-9._-]+)/g)) {
    let b = C[1], B = b.indexOf("__");
    h.add(B >= 0 ? b.slice(0, B) : b);
  }
  let I = S.toLowerCase();
  for (let C of E) if (new RegExp(`\\b${vR(C)}\\b`, "i").test(I)) h.add(C);
  return [...h];
}

// READABLE (for understanding):
function extractTargetServers(query, knownServerNames) {
  const text = Array.isArray(query) ? query.join(" ") : query;
  const targets = new Set();
  // (a) explicit mcp__<server>__<tool> patterns → server fragment
  for (const m of text.matchAll(/mcp__([a-zA-Z0-9._-]+)/g)) {
    const frag = m[1], dd = frag.indexOf("__");
    targets.add(dd >= 0 ? frag.slice(0, dd) : frag);
  }
  // (b) bare server names appearing as whole words in the query
  const lowered = text.toLowerCase();
  for (const name of knownServerNames)
    if (new RegExp(`\\b${escapeRegExp(name)}\\b`, "i").test(lowered)) targets.add(name);
  return [...targets];
}

// Mapping: w→extractTargetServers, vR→escapeRegExp
```

This is the **gating signal** for whether it is worth waiting: only wait for a pending server that
the query plausibly targets. A search for "calendar" should not block on a pending "slack" server.

### 4.3 `waitForPendingMcpServers` (`J`) — the in-tool MCP wait

```javascript
// ============================================
// waitForPendingMcpServers - poll ≤ 5s for relevant pending servers to connect
// Location: cli_inner_pretty.js:404340-404350
// ============================================

// ORIGINAL (for source lookup):
async function J(v) {
  let E = Date.now(), S = E + py_;           // py_ = 5000
  while (Date.now() < S && !z.signal.aborted) {
    let h = M().filter((I) => I.type === "pending");
    if (h.length === 0) break;
    if (v.length > 0 && !h.some((I) => v.includes(I.name) || v.includes(u9(I.name)))) break;
    await g8(50, z.signal);                  // sleep 50ms
  }
  return Date.now() - E;
}

// READABLE (for understanding):
async function waitForPendingMcpServers(targetServers) {
  const start = Date.now(), deadline = start + MCP_WAIT_BUDGET_MS;  // 5000
  while (Date.now() < deadline && !abortController.signal.aborted) {
    const pending = getMcpClients().filter(c => c.type === "pending");
    if (pending.length === 0) break;                          // all connected — done
    // early-out: no pending server matches our targets → waiting can't help
    if (targetServers.length > 0 &&
        !pending.some(c => targetServers.includes(c.name) || targetServers.includes(stripMcpServerPrefix(c.name))))
      break;
    await sleep(50, abortController.signal);
  }
  return Date.now() - start;
}

// Mapping: J→waitForPendingMcpServers, py_→MCP_WAIT_BUDGET_MS(5000), u9→stripMcpServerPrefix, g8→sleep
```

**Why the wait lives inside the tool, not the loop:** the agent loop runs once per turn. A model that
"searches, finds nothing, and re-calls next turn" burns a whole round-trip per poll. Folding a
≤ 5 s, 50 ms-granularity poll into `call()` lets a single ToolSearch invocation absorb MCP startup
latency and return tools in one shot — the asynchrony is invisible to the model.

**Why 50 ms / 5000 ms:** 50 ms is short enough that a fast-connecting server (typical: a few hundred
ms) is caught with little wasted latency; 5000 ms (`py_`) is the same budget as the standard MCP
connect timeout, so the wait never outlives the connection attempt it's waiting on.

### 4.4 `searchWithMcpRefresh` (`X`) — refresh, search, conditionally wait, re-search

```javascript
// ============================================
// searchWithMcpRefresh - run a searcher; if empty and a target server is pending, wait + retry
// Location: cli_inner_pretty.js:404351-404380
// ============================================

// ORIGINAL (for source lookup):
async function X(v, E, S) {
  let h = D(), I = j(), C = I.length;
  if (!q || (h.newCount === 0 && C === 0)) return null;                 // nothing changed, no pending
  let b = h.newCount > 0 ? await v(h.freshDeferred, h.freshTools) : [], B = 0, R = !0,
    x = w(S, M().map((g) => g.name)), U = I.map(u9),
    Q = x.length === 0 || x.some((g) => I.includes(g) || U.includes(g));
  if (b.length === 0 && C > 0 && Q) ((R = !1), (B = await J(x)), (h = D()), (b = await v(h.freshDeferred, h.freshTools)));
  return (d("tengu_tool_search_mcp_wait", { queryType: E, refreshOnly: R, waitedMs: B, pendingBefore: C,
    pendingAfter: j().length, matchesAfterWait: b.length, targetServerCount: x.length,
    skippedPollNoTargetPending: C > 0 && !Q && b.length === 0 }),
    { matches: b, freshDeferred: h.freshDeferred, freshTools: h.freshTools });
}

// READABLE (for understanding):
async function searchWithMcpRefresh(searcher, queryType, queryString) {
  const refreshed = refreshDeferredPool();              // D — recompute pool, count new tools
  const pending = getPendingServerNames();
  const pendingCount = pending.length;
  if (!refreshTools || (refreshed.newCount === 0 && pendingCount === 0)) return null;  // pointless

  let matches = refreshed.newCount > 0 ? await searcher(refreshed.freshDeferred, refreshed.freshTools) : [];
  let waitedMs = 0, refreshOnly = true;

  const targets = extractTargetServers(queryString, getMcpClients().map(c => c.name));
  const targetIsPending = targets.length === 0
    || targets.some(t => pending.includes(t) || pending.map(stripMcpServerPrefix).includes(t));

  if (matches.length === 0 && pendingCount > 0 && targetIsPending) {
    refreshOnly = false;
    waitedMs = await waitForPendingMcpServers(targets);     // ≤5s
    const after = refreshDeferredPool();
    matches = await searcher(after.freshDeferred, after.freshTools);
  }

  logEvent("tengu_tool_search_mcp_wait", { queryType, refreshOnly, waitedMs, pendingBefore: pendingCount,
    pendingAfter: getPendingServerNames().length, matchesAfterWait: matches.length,
    targetServerCount: targets.length, skippedPollNoTargetPending: pendingCount > 0 && !targetIsPending && matches.length === 0 });
  return { matches, freshDeferred: /*after||refreshed*/.freshDeferred, freshTools: /*…*/.freshTools };
}

// Mapping: X→searchWithMcpRefresh, D→refreshDeferredPool, j→getPendingServerNames, w→extractTargetServers,
//          J→waitForPendingMcpServers, R→refreshOnly, Q→targetIsPending, d→logEvent
```

**Decision table — when does it actually wait?**

| `refreshTools`? | new tools appeared | pending servers | query targets a pending server | Action |
|:--:|:--:|:--:|:--:|--------|
| no | — | — | — | `return null` (short-circuit) |
| yes | 0 | 0 | — | `return null` (nothing to do) |
| yes | >0 | any | — | search fresh pool; **no wait** if it matched |
| yes | any | >0 | **no** | search; **skip wait** (`skippedPollNoTargetPending`) |
| yes | any | >0 | **yes**, and still empty | **wait ≤5 s**, refresh, re-search |

### 4.5 Dispatch: `select:` vs keyword

```javascript
// ============================================
// callToolSearch dispatch - select: exact path, else keyword path
// Location: cli_inner_pretty.js:404406-404484
// ============================================

// ORIGINAL (for source lookup):
let Z = A.match(/^select:(.+)$/i);
if (Z) {
  let v = Z[1].split(",").map((I) => I.trim()).filter(Boolean), E = [], S = [];
  for (let I of v) { let C = W9(O, I) ?? W9(f, I); if (C) { if (!E.includes(C.name)) E.push(C.name); } else S.push(I); }
  // if some names missing → searchWithMcpRefresh(...) and merge
  // logging + reH(...) returns
}
let W = await jf4(A, O, f, Y);                          // keyword search
if (W.length === 0) { let v = await X((E, S) => jf4(A, E, S, Y), "keyword", A); /* merge if any */ }
// reH(W, A, totalDeferred, pendingOrEmpty)

// READABLE (for understanding):
const selectMatch = query.match(/^select:(.+)$/i);
if (selectMatch) {
  const requested = selectMatch[1].split(",").map(s => s.trim()).filter(Boolean);
  const found = [], missing = [];
  for (const name of requested) {
    const tool = findToolByName(deferred, name) ?? findToolByName(freshTools, name);   // deferred first, then full pool
    if (tool) { if (!found.includes(tool.name)) found.push(tool.name); }
    else missing.push(name);
  }
  if (missing.length > 0) {                              // try MCP refresh+wait for the missing ones
    const r = await searchWithMcpRefresh(async (def, all) => { /* re-resolve missing */ }, "select", missing);
    if (r?.matches.length > 0) return buildSearchResult([...found, ...r.matches], query, r.freshDeferred.length, []);
  }
  if (found.length === 0)
    return buildSearchResult([], query, deferred.length, getPendingServerNames());     // total miss → expose pending
  return buildSearchResult(found, query, deferred.length, []);                         // partial/full hit
}
// keyword path
let matches = await searchToolsWithKeywords(query, deferred, freshTools, max_results);
if (matches.length === 0) {
  const r = await searchWithMcpRefresh((def, all) => searchToolsWithKeywords(query, def, all, max_results), "keyword", query);
  if (r?.matches.length > 0) return buildSearchResult(r.matches, query, r.freshDeferred.length, []);
}
return buildSearchResult(matches, query, totalDeferred, matches.length === 0 ? getPendingServerNames() : []);

// Mapping: Z→selectMatch, v→requested, E→found, S→missing, W9→findToolByName, jf4→searchToolsWithKeywords,
//          X→searchWithMcpRefresh, reH→buildSearchResult
```

**Key detail — `findToolByName(deferred, name) ?? findToolByName(freshTools, name)`:** a `select:` name
is resolved against the *deferred* set first, then the *full* pool. If the model `select:`s a tool
that is already loaded (common after compaction or from subagents that echo a bare name), the tool is
returned as a harmless no-op rather than reported missing — avoiding pointless retry churn. This
fallback is present in both 2.1.88 (`ToolSearchTool.ts:374-375`) and 2.1.156. Confidence **high**.

### 4.6 Telemetry (`tengu_tool_search_outcome` `P`, `tengu_sdk_mcp_false_unavailable` `L`)

```javascript
// ============================================
// logSearchOutcome + falseUnavailable - per-call result + SDK "named a pending server" signal
// Location: cli_inner_pretty.js:404381-404405
// ============================================

// ORIGINAL (for source lookup):
function L(v, E, S) {                                    // E = mcp__ names from query, S = pending servers
  if (S.length === 0 || E.length === 0) return;
  let h = new Set(E.map((C) => C.split("__")[1]).filter(Boolean)),
    I = H6(S, (C) => h.has(u9(C)));
  d("tengu_sdk_mcp_false_unavailable", { queryType: v, pendingServers: S.length, targetedPendingServers: I });
}
function P(v, E, S) {                                    // v = matches, E = "select"|"keyword"
  let h = M(), I = S?.freshDeferred ?? O, C = S?.freshTools ?? f;
  d("tengu_tool_search_outcome", { queryLength: A.length,
    querySelectCount: E === "select" ? a1(A, ",") + 1 : void 0, queryType: E, matchCount: v.length,
    totalDeferredTools: I.length, maxResults: Y, hasMatches: v.length > 0,
    mcpServersConfigured: h.length, mcpServersConnected: H6(h, (b) => b.type === "connected"),
    mcpServersPending: H6(h, (b) => b.type === "pending"), mcpToolsInPool: H6(C, (b) => !!b.mcpInfo) });
}

// READABLE (for understanding):
function logFalseUnavailable(queryType, mcpNamesInQuery, pendingServers) {
  if (!pendingServers.length || !mcpNamesInQuery.length) return;
  const queried = new Set(mcpNamesInQuery.map(n => n.split("__")[1]).filter(Boolean));
  const targetedPending = count(pendingServers, p => queried.has(stripMcpServerPrefix(p)));
  logEvent("tengu_sdk_mcp_false_unavailable", { queryType, pendingServers: pendingServers.length, targetedPendingServers });
}
function logSearchOutcome(matches, queryType, refreshResult) {
  const clients = getMcpClients();
  logEvent("tengu_tool_search_outcome", {
    queryLength: query.length, queryType, matchCount: matches.length, maxResults: max_results,
    hasMatches: matches.length > 0, totalDeferredTools: (refreshResult?.freshDeferred ?? deferred).length,
    mcpServersConfigured: clients.length, mcpServersConnected: count(clients, c => c.type === "connected"),
    mcpServersPending: count(clients, c => c.type === "pending"),
    mcpToolsInPool: count(refreshResult?.freshTools ?? freshTools, t => !!t.mcpInfo) });
}

// Mapping: L→logFalseUnavailable, P→logSearchOutcome, H6→count, u9→stripMcpServerPrefix, a1→countOccurrences, d→logEvent
```

**`tengu_sdk_mcp_false_unavailable` is new vs 2.1.88.** The 2.1.88 `logSearchOutcome`
(`ToolSearchTool.ts:342-356`) logs only `tengu_tool_search_outcome` with five fields
(`query/queryType/matchCount/totalDeferredTools/maxResults/hasMatches`). The 2.1.156 outcome event is
broader (adds MCP server-state counts), and the `false_unavailable` event is entirely new — it fires
when a `select:`/keyword query *named* a pending MCP server but found nothing, which is the canonical
"SDK reported a tool unavailable that is actually still connecting" failure the wait machinery exists
to prevent. Together with `tengu_tool_search_mcp_wait`, this is the observability layer for the whole
MCP-autodiscovery feature.

---

## 5. Enablement — `isToolSearchEnabledOptimistic` (`wE`) and the mode machine

ToolSearch's `isEnabled()` is `wE()`. There are two enablement checks:

- **`wE` / `isToolSearchEnabledOptimistic`** — cheap, no model/threshold awareness. Used to decide
  whether `ToolSearch` is in the base tool list and whether `tool_reference` fields are preserved.
- **`Dv$` / `isToolSearchEnabled`** — the definitive, async per-request check (model support +
  ToolSearch availability + `auto:N` threshold).

### 5.1 `getToolSearchMode` (`Pc6`)

```javascript
// ============================================
// getToolSearchMode - map ENABLE_TOOL_SEARCH → "tst" | "tst-auto" | "standard"
// Location: cli_inner_pretty.js:424695-424705
// ============================================

// ORIGINAL (for source lookup):
function Pc6() {
  if (fVH()) return "standard";                          // CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS kill switch
  let H = process.env.ENABLE_TOOL_SEARCH, $ = H ? PX4(H) : null;
  if ($ === 0) return "tst";                             // auto:0  = always on
  if ($ === 100) return "standard";                      // auto:100 = always off
  if (Dx_(H)) return "tst-auto";                         // auto / auto:1-99
  if (xH(H)) return "tst";                               // truthy → on
  if (k4(process.env.ENABLE_TOOL_SEARCH)) return "standard";  // explicit falsy → off
  return "tst";                                          // default: defer MCP + shouldDefer
}

// READABLE (for understanding):
function getToolSearchMode() {
  if (isExperimentalBetasDisabled()) return "standard";  // fVH — no beta shapes on the wire
  const v = process.env.ENABLE_TOOL_SEARCH, pct = v ? parseAutoPercentage(v) : null;
  if (pct === 0)   return "tst";
  if (pct === 100) return "standard";
  if (isAutoToolSearchMode(v)) return "tst-auto";
  if (isEnvTruthy(v))       return "tst";
  if (isEnvDefinedFalsy(process.env.ENABLE_TOOL_SEARCH)) return "standard";
  return "tst";                                          // unset default = tst
}

// Mapping: Pc6→getToolSearchMode, fVH→isExperimentalBetasDisabled, PX4→parseAutoPercentage,
//          Dx_→isAutoToolSearchMode, xH→isEnvTruthy, k4→isEnvDefinedFalsy
```

| `ENABLE_TOOL_SEARCH` | Mode | Effect |
|----------------------|------|--------|
| (unset) | `tst` | default — defer MCP + `shouldDefer` tools, discover via ToolSearch |
| `true` / `auto:0` | `tst` | always defer |
| `auto` / `auto:1`–`auto:99` | `tst-auto` | defer **only if** deferred-tool tokens exceed N% of the context window |
| `false` / `auto:100` | `standard` | disabled — every tool's full schema ships inline |
| `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` set | `standard` | hard kill switch, overrides everything |

This logic is **identical** to 2.1.88 `getToolSearchMode` (`utils/toolSearch.ts`), including the
kill-switch precedence and the `auto:0`/`auto:100` edge cases. Confidence **high**.

### 5.2 `isToolSearchEnabledOptimistic` (`wE`) — and the **new Vertex branch**

```javascript
// ============================================
// isToolSearchEnabledOptimistic - cheap "could tool search be on?" check
// Location: cli_inner_pretty.js:424719-424747
// ============================================

// ORIGINAL (for source lookup):
function wE() {
  let H = Pc6();
  if (H === "standard") { /* log once */ return !1; }
  if (!process.env.ENABLE_TOOL_SEARCH && Zq() === "firstParty" && !Rz()) { /* log */ return !1; }   // proxy that may drop tool_reference
  if (!process.env.ENABLE_TOOL_SEARCH && Zq() === "vertex") { /* log */ return !1; }                 // NEW in 2.1.156
  /* log */ return !0;
}

// READABLE (for understanding):
function isToolSearchEnabledOptimistic() {
  const mode = getToolSearchMode();
  if (mode === "standard") return false;
  // firstParty provider but a non-Anthropic base URL → a proxy that may reject tool_reference (400)
  if (!process.env.ENABLE_TOOL_SEARCH && getAPIProvider() === "firstParty" && !isFirstPartyAnthropicBaseUrl())
    return false;
  // Vertex does not accept the tool-search beta header → disable unless explicitly forced
  if (!process.env.ENABLE_TOOL_SEARCH && getAPIProvider() === "vertex")
    return false;
  return true;
}

// Mapping: wE→isToolSearchEnabledOptimistic, Pc6→getToolSearchMode, Zq→getAPIProvider, Rz→isFirstPartyAnthropicBaseUrl
```

**The Vertex branch is a genuine 2.1.156 addition.** The 2.1.88 optimistic check has exactly two
disable conditions — `standard` mode, and the firstParty-proxy guard
(`utils/toolSearch.ts:isToolSearchEnabledOptimistic`). 2.1.156 adds a third: when the provider is
`vertex` and the user has not explicitly set `ENABLE_TOOL_SEARCH`, ToolSearch is disabled because
Vertex AI rejects the tool-search beta header. The escape hatch is the same for both proxy branches:
set any non-empty `ENABLE_TOOL_SEARCH` value to assert "my gateway forwards these blocks". Confidence
**high** (the 2.1.88 source has no `=== 'vertex'` branch; the 2.1.156 source has it with its own
debug string at `cli_inner_pretty.js:424738-424740`).

### 5.3 `isToolSearchEnabled` (`Dv$`) and `auto:N` threshold

`Dv$` is the definitive gate used at API-call time. It (1) rejects models that don't support
`tool_reference` (`k5H`/`modelSupportsToolReference`, negative test against `["haiku"]` = `Lx_`,
overridable via the `tengu_tool_search_unsupported_models` GrowthBook list), (2) rejects if
`ToolSearch` is not in the pool (`$RH`, e.g. disallowed), then (3) switches on the mode. For
`tst-auto` it compares deferred-tool token count to `Math.floor(contextWindow × pct)` (`WX4`), with a
2.5-chars-per-token fallback (`Jx_`/`ZX4`) when the token-count API is unavailable. Each decision is
logged as `tengu_tool_search_mode_decision` with a `reason`. This mirrors 2.1.88 `isToolSearchEnabled`
+ `checkAutoThreshold` field-for-field (`utils/toolSearch.ts`). Confidence **high**.

```javascript
// ============================================
// isToolSearchEnabled (head) - model + availability gates before the mode switch
// Location: cli_inner_pretty.js:424768-424799
// ============================================

// ORIGINAL (for source lookup):
async function Dv$(H, $, q, K, _) {
  let z = H6($, (f) => f.isMcp);
  function A(f, O, M, j) { d("tengu_tool_search_mode_decision", { enabled: f, mode: O, reason: M, checkedModel: H, mcpToolCount: z, mcpNonBlocking: B2H(), userType: "external", ...j }); }
  if (!k5H(H)) return (N(`Tool search disabled for model '${H}': … only available on Claude Sonnet 4+, Opus 4+ …`), A(!1, "standard", "model_unsupported"), !1);
  if (!$RH($)) return (N("Tool search disabled: ToolSearchTool is not available …"), A(!1, "standard", "mcp_search_unavailable"), !1);
  let Y = Pc6();
  switch (Y) { case "tst": return (A(!0, Y, "tst_enabled"), !0); /* tst-auto: threshold; standard: false */ }
}

// READABLE (for understanding):
async function isToolSearchEnabled(model, tools, getToolPermissionContext, agents, source) {
  const mcpToolCount = count(tools, t => t.isMcp);
  const log = (enabled, mode, reason, extra) => logEvent("tengu_tool_search_mode_decision",
    { enabled, mode, reason, checkedModel: model, mcpToolCount, ... });
  if (!modelSupportsToolReference(model)) { log(false, "standard", "model_unsupported"); return false; }
  if (!isToolSearchToolAvailable(tools))  { log(false, "standard", "mcp_search_unavailable"); return false; }
  switch (getToolSearchMode()) {
    case "tst":       log(true, "tst", "tst_enabled"); return true;
    case "tst-auto":  /* checkAutoThreshold: deferred tokens ≥ ctx×pct ? */ return /* … */;
    case "standard":  log(false, "standard", "standard_mode"); return false;
  }
}

// Mapping: Dv$→isToolSearchEnabled, k5H→modelSupportsToolReference, $RH→isToolSearchToolAvailable, Pc6→getToolSearchMode, H6→count
```

---

## 6. Result injection — `mapToolResultToToolResultBlockParam`

```javascript
// ============================================
// renderResult - matches → tool_reference blocks; empty → pending-server hint text
// Location: cli_inner_pretty.js:404490-404505
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam(H, $) {
  if (H.matches.length === 0) {
    let q = "No matching deferred tools found";
    if (H.pending_mcp_servers && H.pending_mcp_servers.length > 0) {
      let K = H.pending_mcp_servers,
        _ = K.length > $qH ? `${K.slice(0, $qH).join(", ")}, …and ${K.length - $qH} more` : K.join(", ");
      q += `. Some MCP servers are still connecting: ${_}. Their tools will become available shortly — try searching again. If you're looking for a capability rather than a specific tool name, try keywords that might match the server's purpose (e.g., 'slack message', 'calendar event'). Once you find a matching tool, call it directly — do not stop after searching.`;
    }
    return { type: "tool_result", tool_use_id: $, content: q };
  }
  return { type: "tool_result", tool_use_id: $, content: H.matches.map((q) => ({ type: "tool_reference", tool_name: q })) };
}

// READABLE (for understanding):
function mapResultToBlock(data, toolUseID) {
  if (data.matches.length === 0) {
    let msg = "No matching deferred tools found";
    if (data.pending_mcp_servers?.length) {
      const list = data.pending_mcp_servers.length > DEFERRED_DELTA_LIST_CAP   // 30
        ? `${data.pending_mcp_servers.slice(0, DEFERRED_DELTA_LIST_CAP).join(", ")}, …and ${data.pending_mcp_servers.length - DEFERRED_DELTA_LIST_CAP} more`
        : data.pending_mcp_servers.join(", ");
      msg += `. Some MCP servers are still connecting: ${list}. Their tools will become available shortly — try searching again. … Once you find a matching tool, call it directly — do not stop after searching.`;
    }
    return { type: "tool_result", tool_use_id: toolUseID, content: msg };
  }
  // Non-empty: emit tool_reference blocks — the API expands these into callable tool defs
  return { type: "tool_result", tool_use_id: toolUseID, content: data.matches.map(name => ({ type: "tool_reference", tool_name: name })) };
}

// Mapping: H→data, $→toolUseID, $qH→DEFERRED_DELTA_LIST_CAP(30)
```

**`tool_reference` is the magic content type.** Unlike every other tool, ToolSearch's success result
is not text — it's a list of `{type:"tool_reference", tool_name}` blocks. Anthropic's API parses these
and injects the named tools' full JSONSchema into a `<functions>` block at the head of the next
prompt; the schema also enters the prompt cache so later turns don't re-pay the load. `isToolReferenceBlock`
(`$s`, `424818`) is the runtime type-guard, and `extractDiscoveredToolNames` (`P8H`, `424834`) scans
history for these blocks to reconstruct "which tools have been loaded." The full produce→scan→assemble
→strip pipeline (including the request-tools split at `556979-557015`, the beta header `oEK`, the
unavailable-reference strip, and the "you must ToolSearch this first" guard `zS_`) is documented in
[`deferred_tools.md` § 6.5 — the full `tool_reference` lifecycle](./deferred_tools.md#65-the-full-tool_reference-lifecycle--how-its-triggered-and-used).

**The empty-with-pending hint is the key UX, and it grew vs 2.1.88.** The 2.1.88 empty message is one
sentence — *"Their tools will become available shortly — try searching again."*
(`ToolSearchTool.ts:454`). The 2.1.156 message is three coordinated instructions: (1) retry — servers
will connect shortly; (2) try *capability* keywords, not exact names — fuzzy search may catch related
tools; (3) **don't stop after searching** — once a tool is found, *use* it. This third clause targets
the common failure mode where a model searches, finds nothing, and tells the user "that tool doesn't
exist" — wrong when a server is still connecting. The pending list is also truncated at
`$qH = 30` names. Confidence **high**.

---

## 7. The keyword scorer — see `deferred_tools.md`

The keyword-search algorithm (`searchToolsWithKeywords` `jf4`, `parseToolName` `Mf4`,
`compileTermPatterns` `Qy_`) — including the **new `coarseParts` scoring dimension** and the
`mcpInfo`-based MCP detection that replaced 2.1.88's prefix check — is analyzed in depth in
[`deferred_tools.md` § search algorithm](./deferred_tools.md#the-search-algorithm). It is shared with
deferral because it is the mechanism that makes "names only" navigable.

---

## 8. v2.1.88 → v2.1.156 evolution

| Area | 2.1.88 | 2.1.156 | Evidence |
|------|--------|---------|----------|
| Prompt location hint | runtime toggle `<system-reminder>` vs `<available-deferred-tools>` (gate `tengu_glacier_2xr`) | hard-coded `<system-reminder>`; legacy string & gate **removed** | `216884-216899`; `grep available-deferred-tools → 0` |
| `call()` signature | `{ options:{tools}, getAppState }` | `{ options:{tools, refreshTools, mcpClients, refreshMcpClients}, abortController }` | `404310` |
| Pending MCP servers | reported, **never waited** | **waits ≤5 s** for relevant pending servers, then re-searches | `404340-404380` |
| Pool freshness | static `tools` | `refreshTools?.()` rebuilds the pool mid-call | `404312, 404333` |
| MCP detection (scorer) | `name.startsWith('mcp__')` | `mcpInfo ?? getMcpInfo(name)` | `404146` |
| Scoring dimensions | parts + full + hint + desc | **+ `coarseParts`** (whole lowered name) exact/substring | `404144-404158, 404217-404218` |
| Optimistic gating | standard + firstParty-proxy | **+ Vertex** branch | `424735-424742` |
| Outcome telemetry | `tengu_tool_search_outcome` (6 fields) | richer outcome **+ `tengu_tool_search_mcp_wait` + `tengu_sdk_mcp_false_unavailable`** | `404368, 404385, 404391` |
| Empty-result hint | 1 sentence | 3-clause hint (retry / capability-keywords / don't-stop), list capped at 30 | `404496` |

**Net:** the *contract* (schemas, `tool_reference`, `select:`/keyword/`+required` forms,
`maxResultSizeChars`, read-only/concurrency-safe) is unchanged from 2.1.88. Everything new is
**MCP-autodiscovery robustness**: refresh the pool, wait for connecting servers, score more precisely,
gate more conservatively per provider, and emit the telemetry to measure all of it.

---

## 9. Key insights

- **The wait is in the tool, not the loop.** Folding a 5 s / 50 ms poll into `call()` lets one
  invocation absorb MCP startup latency. The loop just sees a slightly slower tool on a cold-MCP turn;
  it never has to know MCP exists.

- **`tool_reference` is unique to ToolSearch.** No other tool returns reference blocks. They are the
  hand-off point where the API turns a name into a callable schema — and the anchor that
  `extractDiscoveredToolNames` reads back to know what's loaded.

- **Two enablement layers, deliberately.** `wE` (optimistic) keeps ToolSearch present and preserves
  `tool_reference` fields cheaply; `Dv$` (definitive) does the expensive model/threshold check at API
  time. Splitting them avoids paying for a token-count API call on every render.

- **Provider gating is conservative by default, overridable explicitly.** firstParty-proxy and Vertex
  both disable optimistic tool search *only when `ENABLE_TOOL_SEARCH` is unset* — any explicit value is
  read as "I assert my gateway forwards beta blocks." The default protects users whose proxy would
  400 on `tool_reference`; the override unblocks the proxies that do support it.

- **Partial success is first-class.** `select:A,B,C` can return a subset and report the rest missing;
  a missing name that's already loaded is resolved against the full pool as a no-op. The design assumes
  the model's name memory is imperfect (post-compaction, subagent echoes) and degrades gracefully.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_tool_search.md](../00_overview/symbol_additions_v2_1_156_tool_search.md) - v2.1.156 ToolSearch & deferred-tool symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (enablement/provider)

Key functions in this document:
- `ToolSearchTool` (`wV$`) - the tool object
- `inputSchema` (`wf4`) / `outputSchema` (`Df4`) - `{query,max_results}` / `{matches,…,pending_mcp_servers?}`
- `getPrompt` (`r18`) - description text (hard-coded `<system-reminder>` hint)
- `searchToolsWithKeywords` (`jf4`) - keyword scorer (detailed in `deferred_tools.md`)
- `maybeInvalidateCache` (`Of4`) / `getDeferredToolsCacheKey` (`Uy_`) - fingerprint cache
- `isToolSearchEnabledOptimistic` (`wE`) / `isToolSearchEnabled` (`Dv$`) - enablement
- `getToolSearchMode` (`Pc6`) - `ENABLE_TOOL_SEARCH` → mode
- `modelSupportsToolReference` (`k5H`) - negative test vs `["haiku"]` (`Lx_`)
- `isToolReferenceBlock` (`$s`) - runtime type guard
- `MCP_WAIT_BUDGET_MS` (`py_`) - 5000 ms wait budget
- `DEFERRED_DELTA_LIST_CAP` (`$qH`) - 30, inline-vs-summarized threshold
