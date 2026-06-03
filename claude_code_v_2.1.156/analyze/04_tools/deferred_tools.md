# Deferred Tools — Lazy Loading via ToolSearch (v2.1.156)

> Some tools' schemas are too large to ship in the turn-1 system prompt for every session. The
> deferred-tools system sends just the **names** (via `<system-reminder>` attachments), and the model
> fetches the full schemas on demand with [`ToolSearch`](./tool_search.md).
>
> **Source (2.1.156):** predicate `isDeferredTool` (`pp`) at `cli_inner_pretty.js:216868-216880`;
> scorer `searchToolsWithKeywords` (`jf4`) at `404164-404231`; delta diff `getDeferredToolsDelta`
> (`tg6`) at `424861-424916`; system-reminder rendering at `445673-445714`; discovery scan
> `extractDiscoveredToolNames` (`P8H`) at `424834-424860`.
> **Cross-validation baseline (2.1.88):** `src/tools/ToolSearchTool/prompt.ts` (`isDeferredTool`,
> `getPrompt`, `formatDeferredToolLine`), `src/utils/toolSearch.ts` (`getDeferredToolsDelta`,
> `extractDiscoveredToolNames`, mode machinery), `src/utils/api.ts` (`defer_loading` emission).
> **Prior doc:** `claude_code_v_2.1.142/analyze/04_tools/deferred_tools.md`.

---

## 1. Why deferred loading

A heavy session may carry 40+ built-in tools (5–10 KB schema each) plus dozens-to-hundreds of MCP
tools (2–10 KB each) — a tool-schema overhead that can reach a meaningful fraction of the context
window. Shipping all of it every turn:

1. **Costs tokens** — every turn pays the full schema cost even if the model only uses Read + Bash.
2. **Slows time-to-first-token** — larger prompts take longer to send and process.
3. **Crowds the context window** — less room for actual conversation.

Deferred loading reduces turn-1 to "tools you'll definitely need" (full schema) + "names only, schemas
on demand" for everything else. The on-demand path is ToolSearch; the *eligibility* decision — which
tools defer — is `isDeferredTool`.

---

## 2. The `isDeferredTool` predicate (`pp`) — an 8-rule ladder

```javascript
// ============================================
// isDeferredTool - decide whether a tool ships name-only (defer_loading) or full-schema
// Location: cli_inner_pretty.js:216868-216880
// ============================================

// ORIGINAL (for source lookup):
function pp(H) {
  if (H.alwaysLoad === !0) return !1;
  if (H.isMcp === !0) return !0;
  if (H.name === l3) return !1;                                // ToolSearch
  if (H.name === sq) { if ((g$H(), Z6(d57)).isForkSubagentEnabled()) return !1; }   // Agent
  if (H.name === Gk5) return !1;                               // Brief
  if (H.name === Tk5) return !1;                               // SendUserFile
  if (H.name === df && hwH()) return !1;                       // ScheduleWakeup + kairos-loop gate
  if (H.name === n1H && process.env.CLAUDE_CODE_SESSION_KIND === "bg") return !1;    // EnterWorktree in bg
  return H.shouldDefer === !0;
}

// READABLE (for understanding):
function isDeferredTool(tool) {
  // 1. Explicit always-load wins (MCP _meta['anthropic/alwaysLoad'] = true)
  if (tool.alwaysLoad === true) return false;
  // 2. Every MCP tool defers by default — the count is open-ended
  if (tool.isMcp === true) return true;
  // 3. ToolSearch itself is never deferred (it's the resolver — chicken-and-egg)
  if (tool.name === TOOL_SEARCH_TOOL_NAME) return false;
  // 4. Agent (subagent) — non-deferred when the fork-subagent experiment is on
  if (tool.name === AGENT_TOOL_NAME && loadForkSubagentMod().isForkSubagentEnabled()) return false;
  // 5. Brief — the primary text-visibility channel; must be visible turn 1
  if (tool.name === BRIEF_TOOL_NAME) return false;
  // 6. SendUserFile — file-delivery channel; must be visible turn 1
  if (tool.name === SEND_USER_FILE_TOOL_NAME) return false;
  // 7. ScheduleWakeup — non-deferred when the /loop dynamic-pacing experiment is on   [NEW in 2.1.156]
  if (tool.name === SCHEDULE_WAKEUP_TOOL_NAME && isKairosLoopDynamicEnabled()) return false;
  // 8. EnterWorktree — non-deferred in background sessions                            [NEW in 2.1.153]
  if (tool.name === ENTER_WORKTREE_TOOL_NAME && process.env.CLAUDE_CODE_SESSION_KIND === "bg") return false;
  // 9. Otherwise defer iff the tool opts in
  return tool.shouldDefer === true;
}

// Mapping: pp→isDeferredTool, l3→TOOL_SEARCH_TOOL_NAME, sq→AGENT_TOOL_NAME, Gk5→BRIEF_TOOL_NAME,
//          Tk5→SEND_USER_FILE_TOOL_NAME, df→SCHEDULE_WAKEUP_TOOL_NAME, hwH→isKairosLoopDynamicEnabled,
//          n1H→ENTER_WORKTREE_TOOL_NAME, d57→forkSubagentModule, g$H/Z6→lazy module load
```

### Rule-by-rule rationale

**1. `alwaysLoad` → never defer (checked first).** MCP servers can set `_meta['anthropic/alwaysLoad']`
to force their tools into the turn-1 prompt with full schema. The MCP-config text describes it exactly:
*"all tools from this server are always included … never deferred behind tool search. Equivalent to
setting `defer_loading: false`. As a side effect this also blocks startup until the server is
connected"* (`cli_inner_pretty.js:336466`). Checked before rule 2 so an MCP tool can opt *out* of the
default MCP deferral.

**2. MCP → always defer.** The number of MCP tools is unbounded (a GitHub server alone exposes dozens),
so they default to name-only. This is what makes the whole feature worthwhile.

**3. ToolSearch → never defer.** ToolSearch is the resolver for deferred tools; deferring it would be a
deadlock — the model couldn't load anything because it couldn't load the loader.

**4. Agent → conditional on fork-subagent.** When the fork-subagent experiment is on, spawning a
subagent is a high-frequency, turn-1 operation, so `Agent` is loaded eagerly. When off, it defers like
any other `shouldDefer` tool. The module is lazy-required (`g$H(), Z6(d57)`) to avoid a static import
cycle (`forkSubagent → coordinatorMode → constants/tools`).

**5–6. Brief / SendUserFile → never defer.** These are *communication channels*. Brief carries the
text-visibility contract; SendUserFile is how the model proactively delivers files. The model must
*see they exist* without a ToolSearch round-trip, or it won't know the option is available when
relevant.

**7. ScheduleWakeup + `isKairosLoopDynamicEnabled()` → NEW in 2.1.156.** When the `/loop` dynamic-pacing
experiment (`tengu_kairos_loop_dynamic` gate, `hwH`) is on, `ScheduleWakeup` must be available turn 1
so the model can self-pace a loop *without* first spending a ToolSearch call to surface the tool — the
loop instruction explicitly tells the model to call `ScheduleWakeup` before ending the turn, so a
deferral would force a wasted discovery round-trip on the critical path.

**8. EnterWorktree + `CLAUDE_CODE_SESSION_KIND === "bg"` → NEW in 2.1.153.** Background-agent sessions
that must isolate into a linked worktree are blocked from editing the shared checkout until they call
`EnterWorktree`. Deferring that tool means the first thing a bg agent needs is hidden behind a search.
The changelog records this exactly: *"EnterWorktree available immediately in background sessions.
Previously you had to call ToolSearch first to surface it; now it's available up front"*
(`by_version/2.1.153.md:481`). The guard is keyed on the `CLAUDE_CODE_SESSION_KIND` env var = `"bg"`.

**9. Default — `shouldDefer === true`.** Everything else opts in explicitly. The complete inventory is
in § 2.1 below.

### 2.1 The complete `shouldDefer: !0` inventory (27 tools, verified)

A `grep -c "shouldDefer"` over the 2.1.156 bundle returns **28** hits: 27 tool declarations of
`shouldDefer: !0`, plus the one read site (`return H.shouldDefer === !0` in `pp`, 216879). Each
declaration was resolved to its tool-name constant by reading the `name:` field of the enclosing tool
object. These 27 are the tools that **opt into deferral** (the inputs to rule 9 — they still pass
through rules 1–8 first, and through `isEnabled()` and the tool-search-on gate, before actually being
deferred):

| Tool (name) | `shouldDefer` decl | name const | Category |
|-------------|-------------------:|------------|----------|
| `NotebookEdit` | 348411 | `z0` (212068) | editing |
| `WebFetch` | 366237 | `WX` (206819) | web |
| `WebSearch` | 402847 | `ux` (216253) | web |
| `TodoWrite` | 376476 | `mv` (216258) | session state |
| `EnterPlanMode` | 349722 | `og` (143385) | plan mode |
| `ExitPlanMode` | 350044 | `wv` (143387) | plan mode |
| `EnterWorktree` | 404650 | `n1H` (216098) | worktree |
| `ExitWorktree` | 404852 | `l18` (216288) | worktree |
| `Monitor` | 378969 | `MJ` (216210) | background |
| `ScheduleWakeup` | 402239 | `df` (216099) | loop pacing |
| `LSP` | 403841 | `ZrH` (276797) | integration |
| `ListMcpResourcesTool` | 215500 | `NwH` (215307) | MCP resources |
| `ReadMcpResourceTool` | 404057 | (literal string) | MCP resources |
| `TaskCreate` | 405050 | `SL` (216284) | tasks/agents |
| `TaskGet` | 405155 | `nd` (216285) | tasks/agents |
| `TaskUpdate` | 405337 | `rT` (216287) | tasks/agents |
| `TaskList` | 405553 | `Y0` (216286) | tasks/agents |
| `TaskStop` | 399608 | `nT` (216170) | tasks/agents |
| `TaskOutput` | 402565 | `Yo` (216168) | tasks/agents |
| `SendMessage` | 407457 | `cf` (216283) | tasks/agents |
| `CronCreate` | 405709 | `rP` (216385) | scheduling |
| `CronDelete` | 405791 | `dI` (216386) | scheduling |
| `CronList` | 405862 | `bJ$` (216387) | scheduling |
| `RemoteTrigger` | 406035 | `aSH` (405927) | scheduling |
| `PushNotification` | 406403 | `Q$H` (216186) | notification |
| `TeamCreate` | 406635 | `rd` (216438) | agent teams |
| `TeamDelete` | 406779 | `Oo` (216439) | agent teams |

**Notes on the inventory:**
- **`shouldDefer` ≠ "always deferred at runtime."** It is rule 9's *input*. A tool with
  `shouldDefer: !0` is **not** deferred if it hits an earlier rule (e.g. `ScheduleWakeup` → rule 7 when
  the /loop-dynamic gate is on; `EnterWorktree` → rule 8 in bg sessions), is disabled by `isEnabled()`,
  or if tool search is off entirely (`standard` mode → nothing defers).
- **MCP tools are NOT in this list and don't need to be** — they defer via rule 2 (`isMcp === true`),
  not `shouldDefer`. `AskUserQuestion`/`StructuredOutput`/`Skill`/`PowerShell`/`TestingPermission` do
  **not** set `shouldDefer: !0` in the 2.1.156 bundle (this table is the exhaustive verified set).

**Cross-validation — the `shouldDefer` set evolved (2.1.88 → 2.1.156).** A `grep` of the 2.1.88 named
tree (`src/tools/*/`) finds `shouldDefer: true` on **26** tools. Diffing against the 2.1.156 set of 27:
- **24 tools are common** to both versions (the Task*/Cron*/Team*/Web*/Plan*/Worktree*/Mcp* family +
  NotebookEdit, TodoWrite, LSP, RemoteTrigger, SendMessage).
- **Removed in 2.1.156** (declared `shouldDefer` in 2.1.88, no longer): **`AskUserQuestion`**
  (`AskUserQuestionTool.tsx:113`) and **`Config`** (`ConfigTool.ts:86`). AskUserQuestion's 2.1.156
  rework (the model-gated *reservation* prompt — see `ask_user_question_reservation.md`) makes it a
  turn-1 tool, so deferring it no longer fits; in this very session it appears as a full-schema regular
  tool. This is why the 2.1.142 doc listed AskUserQuestion as deferred — it *was*, through 2.1.88; the
  flag was dropped by 2.1.156. (The 2.1.142 doc's `StructuredOutput` claim was wrong even for 2.1.88 —
  it is not in either version's `shouldDefer` set.)
- **Added in 2.1.156** (not `shouldDefer` in 2.1.88): **`Monitor`** (378969), **`ScheduleWakeup`**
  (402239), **`PushNotification`** (406403) — all newer background/loop/notification tools.

Confidence **high** (both trees grepped exhaustively; each side's exclusive members confirmed at
source).

**Runtime corroboration (this very session).** The `<system-reminder>` that opened this analysis
session listed exactly these 20 deferred tools: `CronCreate, CronDelete, CronList, EnterPlanMode,
EnterWorktree, ExitPlanMode, ExitWorktree, LSP, Monitor, NotebookEdit, PushNotification, RemoteTrigger,
TaskCreate, TaskGet, TaskList, TaskOutput, TaskStop, TaskUpdate, WebFetch, WebSearch`. That is a clean
subset of the 27 — the 7 absent ones are explained, not contradictory:
- `ScheduleWakeup` — present in the session as a **regular, non-deferred** tool (full schema in the
  prompt), **not** in the deferred list. It declares `shouldDefer: !0` yet is loaded eagerly → the only
  path is **rule 7** (the `tengu_kairos_loop_dynamic` gate is on). This is direct runtime proof of
  rule 7.
- `ListMcpResourcesTool` / `ReadMcpResourceTool` — only present when MCP servers are configured (none
  here).
- `TeamCreate` / `TeamDelete` / `SendMessage` — agent-team / multi-agent tools, not enabled in a plain
  session (`isEnabled()` false).
- `TodoWrite` — not exposed in this harness configuration (`isEnabled()` gate).

The other 20 are exactly the deferred-and-enabled tools a plain session surfaces. The match (subset +
each exclusion individually explained) is strong corroboration that the `shouldDefer` inventory and the
rule ladder are jointly correct.

### Cross-validation & the two new rules

The 2.1.88 `isDeferredTool` (`prompt.ts`) has rules **1–6 and 9** — `alwaysLoad`, MCP, ToolSearch,
Agent+fork, Brief, SendUserFile, then `shouldDefer`. It has **no ScheduleWakeup rule and no
EnterWorktree-bg rule**. The 2.1.156 `pp` inserts both (rules 7 and 8) before the `shouldDefer`
fallthrough:

| Rule | 2.1.88 | 2.1.156 | Note |
|------|:--:|:--:|------|
| `alwaysLoad`, MCP, ToolSearch, Agent+fork, Brief, SendUserFile | ✅ | ✅ | unchanged ladder |
| ScheduleWakeup + kairos-loop | ❌ | ✅ | rule 7 — `cli_inner_pretty.js:216877` |
| EnterWorktree + bg session | ❌ | ✅ | rule 8 — `cli_inner_pretty.js:216878`; changelog 2.1.153 |
| `shouldDefer` fallthrough | ✅ | ✅ | unchanged |

> **Note on the 2.1.142 doc.** The prior `claude_code_v_2.1.142/analyze/04_tools/deferred_tools.md`
> listed a "Skill + skill-discovery" rule in this slot. The 2.1.156 source does **not** contain a Skill
> rule in `pp` — the conditional slot is now `ScheduleWakeup + hwH()`. Documented here from the 2.1.156
> bytes; treat the 2.1.142 Skill claim as version-specific to that build (or a mismapping), not carried
> forward.

> **Build-time vs source-time guards.** In 2.1.88, rules 5/6 are wrapped in `feature('KAIROS')` /
> `feature('KAIROS_BRIEF')` (from `bun:bundle`, dead-code-eliminated at build). In the 2.1.156 bundle
> those guards have already collapsed — `pp` is the *post-DCE* form, so the Brief/SendUserFile checks
> appear as bare `if (H.name === Gk5) return !1`. Same logic; the flag was resolved when the binary was
> built.

---

## 3. The `defer_loading` API field

When tool search is enabled and `isDeferredTool(tool)` is true, the tool ships to the API with
`defer_loading: true` — only its name reaches the model; the schema is withheld. The wire stamp:

```javascript
// ============================================
// deferLoading → API field - mark a tool defer_loading on the per-request overlay
// Location: cli_inner_pretty.js:556008
// ============================================

// ORIGINAL (for source lookup):
if ($.deferLoading) M.defer_loading = !0;

// READABLE (for understanding):
if (toolFlags.deferLoading) apiToolSchema.defer_loading = true;

// Mapping: $.deferLoading→toolFlags.deferLoading, M→apiToolSchema
```

Calling a deferred tool directly fails with `InputValidationError` — there is no schema to validate
against. The `<system-reminder>` text says exactly this (see § 5). A complementary filter at
`cli_inner_pretty.js:557080` (`c.filter((s) => !("defer_loading" in s && s.defer_loading))`) excludes
deferred tools from passes that need only loaded tools (e.g. token counting). This matches 2.1.88
`utils/api.ts` (`schema.defer_loading = true` overlay). Confidence **high**.

---

## 4. The search algorithm

ToolSearch's keyword scorer is what makes a name-only pool navigable. It runs three resolution stages
(exact → MCP-prefix → scored), and the scored stage is where 2.1.156 diverges most from 2.1.88.

### 4.1 `parseToolName` (`Mf4`) — tokenize a tool name

```javascript
// ============================================
// parseToolName - split a tool name into {parts, coarseParts, full, isMcp}
// Location: cli_inner_pretty.js:404144-404158
// ============================================

// ORIGINAL (for source lookup):
function Mf4(H) {
  let $ = H.name, q = H.mcpInfo ?? UR($);
  if (q) {
    let _ = [q.serverName, q.toolName].filter((A) => Boolean(A)).map((A) => A.toLowerCase()),
      z = _.flatMap((A) => A.split(/[\s_.]+/)).filter(Boolean);
    return { parts: z, coarseParts: _, full: z.join(" "), isMcp: !0 };
  }
  let K = $.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").toLowerCase().split(/\s+/).filter(Boolean);
  return { parts: K, coarseParts: [$.toLowerCase()], full: K.join(" "), isMcp: !1 };
}

// READABLE (for understanding):
function parseToolName(tool) {
  const name = tool.name;
  const mcp = tool.mcpInfo ?? getMcpInfo(name);             // structured {serverName, toolName} if MCP
  if (mcp) {
    const coarse = [mcp.serverName, mcp.toolName].filter(Boolean).map(s => s.toLowerCase());
    const parts  = coarse.flatMap(s => s.split(/[\s_.]+/)).filter(Boolean);
    return { parts, coarseParts: coarse, full: parts.join(" "), isMcp: true };
  }
  // regular tool: CamelCase + underscores → words
  const parts = name.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").toLowerCase().split(/\s+/).filter(Boolean);
  return { parts, coarseParts: [name.toLowerCase()], full: parts.join(" "), isMcp: false };
}

// Mapping: Mf4→parseToolName, UR→getMcpInfo
```

**Two deltas vs 2.1.88 here:**
1. **MCP detection.** 2.1.88 used `name.startsWith('mcp__')` and string-split the prefix
   (`prompt parseToolName`). 2.1.156 uses the **structured** `mcpInfo ?? getMcpInfo(name)`, giving it
   real `serverName` / `toolName` fields instead of positional `__`-splitting — more robust to server
   names containing underscores.
2. **`coarseParts`.** 2.1.88's `parseToolName` returns only `{parts, full, isMcp}`. 2.1.156 adds
   `coarseParts` — the *whole* lowered name (or `[serverName, toolName]` for MCP) — which the scorer
   weights separately (below). This lets a query term match the un-split name (`"toolsearch"` vs the
   split `["tool","search"]`).

### 4.2 `searchToolsWithKeywords` (`jf4`) — the scorer

```javascript
// ============================================
// searchToolsWithKeywords - exact → mcp-prefix → required/optional scored ranking
// Location: cli_inner_pretty.js:404164-404231
// ============================================

// ORIGINAL (for source lookup):
async function jf4(H, $, q, K) {
  let _ = H.toLowerCase().trim(),
    z = $.find((D) => D.name.toLowerCase() === _) ?? q.find((D) => D.name.toLowerCase() === _);
  if (z) return [z.name];                                                       // (1) exact name
  if (_.startsWith("mcp__") && _.length > 5) {                                  // (2) mcp prefix
    let D = $.filter((J) => J.name.toLowerCase().startsWith(_)).slice(0, K).map((J) => J.name);
    if (D.length > 0) return D;
  }
  let A = _.split(/\s+/).filter((D) => D.length > 0), Y = [], f = [];           // partition +required/optional
  for (let D of A) if (D.startsWith("+") && D.length > 1) Y.push(D.slice(1)); else f.push(D);
  let O = Y.length > 0 ? [...Y, ...f] : A, M = Qy_(O), j = $;
  if (Y.length > 0) j = (await Promise.all($.map(async (J) => { /* keep only tools matching ALL required */ }))).filter(Boolean);
  return (await Promise.all(j.map(async (D) => {                                // (3) score survivors
    let J = Mf4(D), L = (await pZ8(D.name, q)).toLowerCase(), P = D.searchHint?.toLowerCase() ?? "", Z = 0;
    for (let W of O) {
      let G = M.get(W);
      if (J.parts.includes(W)) Z += J.isMcp ? 12 : 10; else if (J.parts.some((V) => V.includes(W))) Z += J.isMcp ? 6 : 5;
      if (J.coarseParts.includes(W)) Z += J.isMcp ? 12 : 10; else if (J.coarseParts.some((V) => V.includes(W))) Z += J.isMcp ? 4 : 3;
      if (J.full.includes(W) && Z === 0) Z += 3;
      if (P && G.test(P)) Z += 4;
      if (G.test(L)) Z += 2;
    }
    return { name: D.name, score: Z };
  }))).filter((D) => D.score > 0).sort((D, J) => J.score - D.score).slice(0, K).map((D) => D.name);
}

// READABLE (for understanding):
async function searchToolsWithKeywords(query, deferred, allTools, maxResults) {
  const q = query.toLowerCase().trim();
  // (1) exact name (deferred first, then full pool — bare-name fast path)
  const exact = deferred.find(t => t.name.toLowerCase() === q) ?? allTools.find(t => t.name.toLowerCase() === q);
  if (exact) return [exact.name];
  // (2) mcp__<server> prefix → all that server's tools
  if (q.startsWith("mcp__") && q.length > 5) {
    const pref = deferred.filter(t => t.name.toLowerCase().startsWith(q)).slice(0, maxResults).map(t => t.name);
    if (pref.length) return pref;
  }
  // partition +required / optional
  const terms = q.split(/\s+/).filter(Boolean);
  const required = [], optional = [];
  for (const t of terms) t.startsWith("+") && t.length > 1 ? required.push(t.slice(1)) : optional.push(t);
  const scoringTerms = required.length ? [...required, ...optional] : terms;
  const patterns = compileTermPatterns(scoringTerms);
  // pre-filter: must match ALL required terms (in parts / desc / hint)
  let candidates = deferred;
  if (required.length) candidates = (await Promise.all(deferred.map(async t => {
    const p = parseToolName(t), desc = (await getToolDescriptionMemoized(t.name, allTools)).toLowerCase(), hint = t.searchHint?.toLowerCase() ?? "";
    const ok = required.every(term => p.parts.includes(term) || p.parts.some(x => x.includes(term))
      || p.coarseParts.includes(term) || p.coarseParts.some(x => x.includes(term))
      || patterns.get(term).test(desc) || (hint && patterns.get(term).test(hint)));
    return ok ? t : null;
  }))).filter(Boolean);
  // score
  const scored = await Promise.all(candidates.map(async t => {
    const p = parseToolName(t), desc = (await getToolDescriptionMemoized(t.name, allTools)).toLowerCase(), hint = t.searchHint?.toLowerCase() ?? "";
    let score = 0;
    for (const term of scoringTerms) {
      const re = patterns.get(term);
      if (p.parts.includes(term))            score += p.isMcp ? 12 : 10;
      else if (p.parts.some(x => x.includes(term))) score += p.isMcp ? 6 : 5;
      if (p.coarseParts.includes(term))      score += p.isMcp ? 12 : 10;        // NEW dimension
      else if (p.coarseParts.some(x => x.includes(term))) score += p.isMcp ? 4 : 3;
      if (p.full.includes(term) && score === 0) score += 3;
      if (hint && re.test(hint))             score += 4;
      if (re.test(desc))                     score += 2;
    }
    return { name: t.name, score };
  });
  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, maxResults).map(s => s.name);
}

// Mapping: jf4→searchToolsWithKeywords, Qy_→compileTermPatterns, Mf4→parseToolName, pZ8→getToolDescriptionMemoized
```

**The scoring table (2.1.156):**

| Signal | Regular | MCP | Notes |
|--------|:--:|:--:|-------|
| term ∈ `parts` (exact) | +10 | +12 | strongest — canonical name token |
| term ⊂ some `part` (substring) | +5 | +6 | partial token match |
| term ∈ `coarseParts` (exact) | +10 | +12 | **NEW in 2.1.156** — whole un-split name |
| term ⊂ some `coarsePart` (substring) | +3 | +4 | **NEW in 2.1.156** |
| `full` includes term (only if score still 0) | +3 | +3 | last-ditch fallback |
| `searchHint` whole-word match | +4 | +4 | curated capability phrase |
| description whole-word match | +2 | +2 | noisiest — lowest weight |

**Why MCP gets a small boost:** when the model types "slack", it almost always wants the MCP server,
not an incidental mention in some built-in's description. The +2 nudge (12 vs 10, 6 vs 5) biases ties
toward the integration the model is most likely reaching for.

**Why `coarseParts` was added:** the split `parts` lose information for short or compound names. A
query `"toolsearch"` would miss the split `["tool","search"]` on an exact-token test, but matches the
coarse whole-name `"toolsearch"`. The new dimension recovers exact-whole-name hits without weakening
the per-token signal. This is the single most impactful scoring change from 2.1.88.

**Why `+`-required uses a pre-filter, not just scoring:** required terms must *gate* the candidate set
(a tool missing a required term is dropped entirely, `candidates = …filter(Boolean)`), then the same
terms also *score* the survivors. This is what makes `+slack send` mean "only Slack tools, ranked by
send" rather than "tools that happen to mention slack or send."

**`compileTermPatterns` (`Qy_`, 404159)** pre-builds one `\bterm\b` word-boundary RegExp per unique
term, so the scorer doesn't recompile `tools × terms × 2` regexes. Description/hint matches use word
boundaries to avoid false positives (`"read"` shouldn't match `"thread"`).

**`getToolDescriptionMemoized` (`pZ8`, 404267)** lazily renders each tool's `prompt()` text (with a
stub permission context) and memoizes by tool name — the description is the lowest-weight signal but
still consulted, and memoizing avoids re-rendering prompts across the scoring loop and across calls.

---

## 5. The deferred-tools delta protocol

When the deferred-tool set changes mid-session (MCP connect/disconnect, plan-mode enter/exit, plugin
activate), the host diffs the pool against what was already announced and emits a
`deferred_tools_delta` attachment, which becomes a `<system-reminder>`.

### 5.1 `getDeferredToolsDelta` (`tg6`) — the 5-state diff

```javascript
// ============================================
// getDeferredToolsDelta - diff current deferred pool vs already-announced; emit pool-change event
// Location: cli_inner_pretty.js:424861-424916
// ============================================

// ORIGINAL (for source lookup):
function tg6(H, $, q, K) {
  let _ = new Set(), z = new Set(), A = [], Y = 0, f = 0, O = new Set();
  for (let G of $) {                                            // scan history for prior DTD attachments
    if (G.type !== "attachment") continue;
    if ((Y++, O.add(G.attachment.type), G.attachment.type !== "deferred_tools_delta")) continue;
    f++;
    let V = new Set(G.attachment.readdedNames ?? []);
    for (let v of G.attachment.addedNames) if ((_.add(v), !V.has(v))) z.add(v);
    for (let v of G.attachment.removedNames) _.delete(v);
    if (G.attachment.pendingMcpServers !== void 0) A = G.attachment.pendingMcpServers;
  }
  let M = H.filter(pp), j = new Set(M.map((G) => G.name)), w = new Set(H.map((G) => G.name)),
    D = M.filter((G) => !_.has(G.name)),                        // added (deferred & not announced)
    J = M.filter((G) => !z.has(G.name)),                        // addedLines source
    X = D.filter((G) => z.has(G.name)).map((G) => G.name),      // readded
    L = [];
  for (let G of _) { if (j.has(G)) continue; if (!w.has(G)) L.push(G); }      // removed (announced, gone from pool)
  let P = K !== void 0 ? [...K].sort() : [], Z = K !== void 0 && (P.length !== A.length || P.some((G, V) => G !== A[V]));
  if (D.length === 0 && L.length === 0 && J.length === 0 && !Z) return null;
  let W = aq([...D, ...J].map((G) => G.name));
  return (d("tengu_deferred_tools_pool_change", { addedCount: D.length, readdedCount: X.length,
    unlistedCount: J.length, removedCount: L.length, pendingChanged: Z, pendingCount: P.length,
    lastPendingCount: A.length, priorAnnouncedCount: _.size, /* …diagnostics… */ }),
    { addedNames: W.sort(), addedLines: J.map(PG6).sort(), removedNames: L.sort(), readdedNames: X.sort(),
      ...(K !== void 0 && { pendingMcpServers: P }) });
}

// READABLE (for understanding):
function getDeferredToolsDelta(tools, messages, scanContext, pendingServers) {
  // 1. reconstruct what's already been announced by scanning prior deferred_tools_delta attachments
  const announced = new Set(); const readdedBefore = new Set(); let lastPending = [];
  for (const m of messages) {
    if (m.type !== "attachment" || m.attachment.type !== "deferred_tools_delta") continue;
    const re = new Set(m.attachment.readdedNames ?? []);
    for (const n of m.attachment.addedNames)  { announced.add(n); if (!re.has(n)) readdedBefore.add(n); }
    for (const n of m.attachment.removedNames) announced.delete(n);
    if (m.attachment.pendingMcpServers !== undefined) lastPending = m.attachment.pendingMcpServers;
  }
  // 2. diff against the current deferred pool
  const deferred = tools.filter(isDeferredTool);
  const deferredNames = new Set(deferred.map(t => t.name)), poolNames = new Set(tools.map(t => t.name));
  const added   = deferred.filter(t => !announced.has(t.name));
  const lines   = deferred.filter(t => !readdedBefore.has(t.name));   // addedLines
  const readded = added.filter(t => readdedBefore.has(t.name)).map(t => t.name);
  const removed = [...announced].filter(n => !deferredNames.has(n) && !poolNames.has(n));  // gone entirely; undeferred = silent
  const pending = pendingServers ? [...pendingServers].sort() : [];
  const pendingChanged = pendingServers !== undefined && /* differs from lastPending */;
  if (!added.length && !removed.length && !lines.length && !pendingChanged) return null;
  logEvent("tengu_deferred_tools_pool_change", { addedCount: added.length, readdedCount: readded.length,
    unlistedCount: lines.length, removedCount: removed.length, pendingChanged, ... });
  return { addedNames: uniq([...added, ...lines].map(t => t.name)).sort(), addedLines: lines.map(formatDeferredToolLine).sort(),
           removedNames: removed.sort(), readdedNames: readded.sort(), ...(pendingServers !== undefined && { pendingMcpServers: pending }) };
}

// Mapping: tg6→getDeferredToolsDelta, pp→isDeferredTool, PG6→formatDeferredToolLine, aq→uniq, d→logEvent
```

**The crucial "undeferred → silent" invariant:** a name that was announced but is *no longer deferred*
yet **is still in the base pool** is **not** reported as removed. It's now loaded directly with full
schema, so telling the model "no longer available" would be a lie. Only names that vanished from the
pool entirely (`!poolNames.has(n)`) are `removed`. Both 2.1.88 and 2.1.156 enforce this. Confidence
**high**.

**This is richer than 2.1.88.** The 2.1.88 `DeferredToolsDelta` type is exactly
`{ addedNames, addedLines, removedNames }` (`utils/toolSearch.ts`). The 2.1.156 `tg6` returns
**five** facets — `addedNames`, `addedLines`, `removedNames`, `readdedNames`, and optional
`pendingMcpServers` — and tracks server reconnection (`readded`) plus pending-server changes
(`pendingChanged`) the 2.1.88 diff cannot express. The telemetry grew correspondingly: 2.1.88 logs
`addedCount/removedCount/priorAnnouncedCount/…`; 2.1.156 adds `readddedCount/unlistedCount/
pendingChanged/pendingCount/lastPendingCount`. (Both retain the `callSite`/`querySource`/
`attachmentTypesSeen` diagnostics from the inc-4747 investigation.)

### 5.2 System-reminder rendering (4 sections)

```javascript
// ============================================
// deferred_tools_delta reminder - render the diff into a <system-reminder> body
// Location: cli_inner_pretty.js:445673-445714
// ============================================

// ORIGINAL (for source lookup):
case "deferred_tools_delta": {
  let q = [];
  if (H.addedLines.length > 0)
    q.push(`The following deferred tools are now available via ${l3}. Their schemas are NOT loaded — calling them directly will fail with InputValidationError. Use ${l3} with query "select:<name>[,<name>...]" to load tool schemas before calling them:\n${H.addedLines.join("\n")}`);
  let K = H.readdedNames ?? [];
  if (K.length > 0)
    q.push(`${K.length} deferred tool${K.length === 1 ? " is" : "s are"} available again (MCP server reconnected — names announced earlier in this conversation): ${J08(K)}. Load via ${l3} as before.`);
  if (H.removedNames.length > 0)
    (q.push(H.removedNames.length > $qH
      ? `${H.removedNames.length} deferred tools are no longer available (MCP server disconnected): ${J08(H.removedNames)}. Do not search for them — ${l3} will return no match.`
      : `The following deferred tools are no longer available (their MCP server disconnected). Do not search for them — ${l3} will return no match:\n${H.removedNames.join("\n")}`), q.push(yT8));
  let _ = H.pendingMcpServers ?? [];
  if (_.length > 0) {
    let z = _.length > $qH ? `${_.slice(0, $qH).join(", ")}, …and ${_.length - $qH} more` : _.join("\n");
    q.push(`The following MCP servers are still connecting — their tools (typically named mcp__<server>__*) are not yet available but will appear shortly:\n${z}\n\nIf the user's request might be served by one of these servers (even if they didn't name it explicitly), call ${l3} with a relevant keyword — ${l3} will wait for connecting servers and search their tools once available. Do not report a capability as unavailable without first searching.`);
  }
  if (q.length === 0) return [];
  return C_([T8({ content: q.join("\n\n"), isMeta: !0 })]);
}

// READABLE (for understanding):
case "deferred_tools_delta": {
  const lines = [];
  // 1. ADDED — new deferred tools; tell the model how to load them
  if (delta.addedLines.length)
    lines.push(`The following deferred tools are now available via ${TOOL_SEARCH_TOOL_NAME}. Their schemas are NOT loaded — calling them directly will fail with InputValidationError. Use ${TOOL_SEARCH_TOOL_NAME} with query "select:<name>[,<name>...]" …:\n${delta.addedLines.join("\n")}`);
  // 2. RE-ADDED — MCP server reconnected; names known from earlier
  if ((delta.readdedNames ?? []).length)
    lines.push(`${n} deferred tool(s) are available again (MCP server reconnected …): ${summarizeByServerPrefix(delta.readdedNames)}. Load via ${TOOL_SEARCH_TOOL_NAME} as before.`);
  // 3. REMOVED — server gone; stop trying (summarized if > 30) + ambient-context trailer
  if (delta.removedNames.length) { lines.push(/* inline list or summarized */); lines.push(AMBIENT_CONTEXT_NOTE); }
  // 4. PENDING — servers still connecting; be patient, search with keywords, don't give up early
  if ((delta.pendingMcpServers ?? []).length)
    lines.push(`The following MCP servers are still connecting … call ${TOOL_SEARCH_TOOL_NAME} with a relevant keyword — it will wait for connecting servers … Do not report a capability as unavailable without first searching.`);
  if (!lines.length) return [];
  return wrapAsSystemReminder([makeMetaMessage(lines.join("\n\n"))]);
}

// Mapping: l3→TOOL_SEARCH_TOOL_NAME, J08→summarizeByServerPrefix, $qH→DEFERRED_DELTA_LIST_CAP(30),
//          yT8→AMBIENT_CONTEXT_NOTE, C_→wrapAsSystemReminder, T8→makeMetaMessage
```

**Why four sections, each phrased differently:** each is a distinct state-change with a distinct
correct response.
1. **Added** — *new* capabilities the model must learn exist (it'll ToolSearch them later). The text
   spells out the failure mode (direct call → `InputValidationError`) and the fix (`select:`).
2. **Re-added** — previously-known capabilities are back (reconnect). The model can reuse references it
   already had; names are summarized by `summarizeByServerPrefix` (`mcp__github__*` collapses with a
   count).
3. **Removed** — gone; *stop trying*. Summarized if > 30 names. Followed by the ambient-context note
   (`yT8`) so the model doesn't narrate the churn to the user.
4. **Pending** — *expected* capabilities; **don't give up early.** The "ToolSearch will wait for
   connecting servers" line is the linchpin — it's what tells the model to call ToolSearch (which then
   runs the ≤5 s wait in § 4 of [`tool_search.md`](./tool_search.md)) instead of replying "no such
   tool."

`summarizeByServerPrefix` (`J08`, 424918) collapses `mcp__<server>__<tool>` names to `mcp__<server>__*`
with an occurrence count, keeping long reconnect/disconnect lists compact.

### 5.3 Where the delta is produced

The `deferred_tools_delta` attachment is registered at `cli_inner_pretty.js:412679`
(`E3("deferred_tools_delta", …)`) and emitted at `412961`
(`return [{ type: "deferred_tools_delta", …z }]`) from the attachment-building path. The
`getDeferredToolsDelta` diff feeds it; the rendering above turns the persisted attachment into the
model-visible reminder. The `scanContext.callSite` discriminator (`attachments_main` /
`attachments_subagent` / `compact_full` / `compact_partial` / `reactive_compact`) distinguishes the
several sites that run the diff with different expected-prior semantics — directly carried from the
2.1.88 inc-4747 instrumentation.

---

## 6. Auto-resolution & carry-across — `extractDiscoveredToolNames` (`P8H`)

Once ToolSearch returns `tool_reference` blocks, the named tools are "discovered" and must be included
in subsequent API requests. `extractDiscoveredToolNames` rebuilds that set by scanning history.

```javascript
// ============================================
// extractDiscoveredToolNames - scan tool_reference blocks + compact-boundary carry
// Location: cli_inner_pretty.js:424834-424860
// ============================================

// ORIGINAL (for source lookup):
function P8H(H) {
  let $ = new Set(), q = 0;
  for (let K of H) {
    if (K.type === "system" && K.subtype === "compact_boundary") {
      let _ = K.compactMetadata?.preCompactDiscoveredTools;
      if (_) { for (let z of _) $.add(z); q += _.length; }
      continue;
    }
    if (K.type !== "user") continue;
    let _ = K.message?.content;
    if (!Array.isArray(_)) continue;
    for (let z of _) if (/* tool_result with array content */) for (let A of z.content) if ($s(A) && A.tool_name) $.add(A.tool_name);
  }
  /* debug log */ return $;
}

// READABLE (for understanding):
function extractDiscoveredToolNames(messages) {
  const discovered = new Set(); let carried = 0;
  for (const msg of messages) {
    // compact boundary carries the pre-compact discovered set forward
    if (msg.type === "system" && msg.subtype === "compact_boundary") {
      const c = msg.compactMetadata?.preCompactDiscoveredTools;
      if (c) { for (const n of c) discovered.add(n); carried += c.length; }
      continue;
    }
    if (msg.type !== "user") continue;                  // tool_result lives in user turns
    const content = msg.message?.content;
    if (!Array.isArray(content)) continue;
    for (const block of content)
      if (isToolResultBlockWithContent(block))
        for (const item of block.content)
          if (isToolReferenceBlock(item) && item.tool_name) discovered.add(item.tool_name);
  }
  return discovered;
}

// Mapping: P8H→extractDiscoveredToolNames, $s→isToolReferenceBlock
```

**Why scan history instead of tracking a list:** with dynamic loading, MCP tools are *not* predeclared
in the `tools` array — they enter the model's context only as `tool_reference` blocks returned by
ToolSearch. Scanning the message history for those blocks reconstructs "everything loaded so far"
without an out-of-band registry, and removes any cap on total MCP-tool count.

**The compaction interaction.** Auto-compaction replaces `tool_reference`-bearing messages with a
summary, which would erase the record of "I loaded `mcp__github__create_pr` earlier." To prevent that,
the compaction boundary snapshots the discovered set onto
`compactMetadata.preCompactDiscoveredTools`, and this scan reads it back from the boundary marker (the
`carried` counter). The post-compact `deferred_tools_delta` can then re-announce them. (Snip, the
alternative trim path, instead *protects* the `tool_reference`-carrying messages from removal.) See
`07_compact/` for the boundary mechanics. Both behaviors match 2.1.88 `utils/toolSearch.ts`
field-for-field. Confidence **high**.

---

## 6.5 The full `tool_reference` lifecycle — how it's triggered and used

`tool_reference` is the content-block type that turns a deferred tool's **name** into a **callable
schema**. It is produced only by ToolSearch and consumed only by the request-assembly path. The
end-to-end loop:

```
  ┌─ turn N ─────────────────────────────────────────────────────────────────┐
  │ deferred tool "Foo" is announced by NAME only (deferred_tools_delta §5)    │
  │ Foo is NOT in the request's tools array — just a name in <system-reminder> │
  └───────────────────────────────────────────────────────────────────────────┘
        │ model calls ToolSearch(select:Foo) or a keyword query
        ▼
  (1) PRODUCE   ToolSearch.call() matches Foo → mapToolResultToToolResultBlockParam
                emits { type:"tool_reference", tool_name:"Foo" }            (404503)
        ▼
  (2) PERSIST   the block lives inside the tool_result in conversation history
        ▼
  ┌─ turn N+1 ───────────────────────────────────────────────────────────────┐
  │ (3) SCAN       extractDiscoveredToolNames(messages) → {"Foo", …}    (P8H, 424834) │
  │ (4) ASSEMBLE   request tools X = non-deferred + ToolSearch + discovered-deferred  │
  │                Foo ∈ X, sent with defer_loading:true; the tool_reference in       │
  │                history makes the API expand Foo's full schema      (556979-557015)│
  │ (5) BETA       add advanced-tool-use / tool-search-tool beta header       (oEK)   │
  └───────────────────────────────────────────────────────────────────────────┘
        ▼
  model can now call Foo with typed parameters — schema is in context
```

### Stage 1–2 — produce & persist (ToolSearch side)

Covered in [`tool_search.md` § 6](./tool_search.md#6-result-injection--maptoolresulttotoolresultblockparam):
a non-empty search result is rendered as `content: matches.map(name => ({ type:"tool_reference",
tool_name:name }))` (404503). An empty result is plain text instead, so no reference is persisted.

### Stage 3 — scan (`extractDiscoveredToolNames` `P8H`)

Covered in § 6 above — rebuilds the discovered-name set from the `tool_reference` blocks in history
plus the compact-boundary carry.

### Stage 4 — request assembly: which tools actually ship (the key consumer)

```javascript
// ============================================
// buildRequestTools - filter the pool into the API tools array using the discovered set
// Location: cli_inner_pretty.js:556971-557015
// ============================================

// ORIGINAL (for source lookup):
let D = await Dv$(z.model, K, z.getToolPermissionContext, z.agents, "query"), J = new Set();   // D = tool search enabled?
if (D) { for (let BH of K) if (pp(BH)) J.add(BH.name); }                                        // J = all deferred names
if (D && J.size === 0 && !z.hasPendingMcpServers) (N("Tool search disabled: no deferred tools available to search"), (D = !1));
let X;
if (D) {
  let BH = P8H(H);                                       // discovered names from history
  X = K.filter((s) => {
    if (!J.has(s.name)) return !0;                       // not deferred → always send (full schema)
    if (h1(s, l3)) return !0;                            // ToolSearch itself → always send
    return BH.has(s.name);                               // deferred → send ONLY IF discovered
  });
} else X = K.filter((BH) => { if (h1(BH, l3)) return !1; return !0; });                         // search off → drop ToolSearch, send all
let W = (BH) => D && (J.has(BH.name) || RLz(BH)),        // per-tool defer_loading flag
  v = await Promise.all(X.map((BH) => w08(BH, { /* … */ model: z.model, deferLoading: W(BH) })));  // w08 = buildToolSchema, sets defer_loading

// READABLE (for understanding):
const toolSearchOn = await isToolSearchEnabled(model, pool, getToolPermissionContext, agents, "query");
const deferredNames = new Set();
if (toolSearchOn) for (const t of pool) if (isDeferredTool(t)) deferredNames.add(t.name);
if (toolSearchOn && deferredNames.size === 0 && !hasPendingMcpServers) toolSearchOn = false;   // nothing to defer

let requestTools;
if (toolSearchOn) {
  const discovered = extractDiscoveredToolNames(messages);          // P8H
  requestTools = pool.filter(t =>
       !deferredNames.has(t.name)        // non-deferred → full schema
    || toolMatchesName(t, TOOL_SEARCH_TOOL_NAME)  // ToolSearch always present
    || discovered.has(t.name));          // deferred → ONLY if already loaded via tool_reference
} else {
  requestTools = pool.filter(t => !toolMatchesName(t, TOOL_SEARCH_TOOL_NAME));  // search off: no ToolSearch, all tools full
}
// each deferred tool that DID make it into requestTools still ships with defer_loading:true;
// the matching tool_reference block in history is what tells the API to expand its schema.
const schemas = await Promise.all(requestTools.map(t =>
  buildToolSchema(t, { model, deferLoading: toolSearchOn && (deferredNames.has(t.name) || forceDeferred(t)) })));

// Mapping: Dv$→isToolSearchEnabled, K→pool, pp→isDeferredTool, P8H→extractDiscoveredToolNames,
//          h1→toolMatchesName, l3→TOOL_SEARCH_TOOL_NAME, w08→buildToolSchema, RLz→shouldDeferLspTool, W→deferLoadingFlag
```

**This is the crux.** When tool search is on, the deferred-tool pool is split three ways:
- **Non-deferred tools** → always in `X` with full schema.
- **ToolSearch** → always in `X` (the model needs the loader).
- **Deferred tools** → in `X` *only if they appear in the discovered set* (`P8H`). An
  announced-but-not-yet-loaded deferred tool is **absent from the request entirely** — its name lives
  only in the `<system-reminder>`, costing a few tokens instead of a full schema.

A deferred tool that *is* in `X` (because it was discovered) still carries `defer_loading: true`
(`deferLoading: W(BH)`, `W = J.has(name) || RLz(...)`, where `RLz` = `shouldDeferLspTool` — an LSP tool
also defers while LSP init is `pending`/`not-started`, `556787`). The `tool_reference` block already
sitting in the conversation is what makes the API expand its schema — `defer_loading` marks pool
membership, the reference is the per-conversation "expand now" signal. ToolSearch itself searches the
**full** local registry `K` (via `refreshTools`), not the filtered `X`, so it can still find
undiscovered deferred tools to reference them in the first place.

**Cross-validation (this whole stage is byte-identical to 2.1.88).** The 2.1.88 `services/api/claude.ts`
request-assembly is structurally identical, with the same three-way filter and the same source comments:
*"Always include non-deferred tools" / "Always include ToolSearchTool (so it can discover more tools)" /
"Only include deferred tools that have been discovered."* It even shares the subtle detail that the
schema builder receives the **full** `tools` list, not `filteredTools` — *"so that ToolSearchTool's
prompt can list ALL available MCP tools. The filtering only affects which tools are actually sent to the
API, not what the model sees in tool descriptions."* `willDefer = useToolSearch && (deferredToolNames.has
(t.name) || shouldDeferLspTool(t))` matches `W` exactly. Confidence **high**.

### Stage 5 — the beta header (`oEK`)

```javascript
// ============================================
// getToolSearchBeta - pick the anthropic-beta header for tool_reference, by provider
// Location: cli_inner_pretty.js:130461-130465 (header consts at 98125-98126)
// ============================================

// ORIGINAL (for source lookup):
function oEK() {
  let H = Zq();
  if (H === "vertex" || H === "bedrock" || H === "mantle" || H === "gateway") return XY$;   // "tool-search-tool-2025-10-19"
  return V76;                                                                                 // "advanced-tool-use-2025-11-20"
}
// V76 = KX("tool_search", "advanced-tool-use-2025-11-20"); XY$ = KX("tool_search", "tool-search-tool-2025-10-19");

// READABLE (for understanding):
function getToolSearchBeta() {
  const provider = getAPIProvider();
  return (provider === "vertex" || provider === "bedrock" || provider === "mantle" || provider === "gateway")
    ? TOOL_SEARCH_TOOL_BETA       // "tool-search-tool-2025-10-19"
    : ADVANCED_TOOL_USE_BETA;     // "advanced-tool-use-2025-11-20"
}
// applied: P = D ? getToolSearchBeta() : null; if (P && provider !== "bedrock") betas.push(P);   (556992-556994)

// Mapping: oEK→getToolSearchBeta, Zq→getAPIProvider, V76→ADVANCED_TOOL_USE_BETA, XY$→TOOL_SEARCH_TOOL_BETA
```

The beta header is added **only when tool search is on** (`D`) and only off-bedrock at the apply site
(for bedrock the header goes in `extraBodyParams`, not the `betas` array). This is the wire contract
that makes the API honor `defer_loading` and expand `tool_reference` blocks — and is exactly what the
optimistic firstParty-proxy / Vertex gates in
[`tool_search.md` § 5.2](./tool_search.md#52-istoolsearchenabledoptimistic-we--and-the-new-vertex-branch)
protect against (a proxy that strips the beta header would reject these shapes).

**Cross-validation + a delta.** The beta *constants* are byte-identical to 2.1.88
(`constants/betas.ts`: `TOOL_SEARCH_BETA_HEADER_1P = 'advanced-tool-use-2025-11-20'`,
`TOOL_SEARCH_BETA_HEADER_3P = 'tool-search-tool-2025-10-19'`), and the apply logic — add only when
tool search on, exclude bedrock from the `betas` array — matches 2.1.88 `claude.ts` line-for-line. The
**delta** is the provider→header mapping: 2.1.88 `getToolSearchBetaHeader()` returns the 3P header only
for `vertex || bedrock`; 2.1.156 `oEK` returns it for `vertex || bedrock || mantle || gateway` —
**`mantle` and `gateway` were added** to the 3P set (`130461-130465`). Confidence **high**.

### Stage 6 — validity filtering: drop references to tools that vanished

If an MCP server disconnects, its tools leave the pool but their `tool_reference` blocks remain in
history. Sending a reference to a tool the API can no longer resolve is an error, so a normalization
pass strips them:

```javascript
// ============================================
// stripUnavailableToolReferences - remove tool_reference blocks whose tool left the pool
// Location: cli_inner_pretty.js:444299-444345 (jQ_)
// ============================================

// ORIGINAL (for source lookup):
let z = _.content.filter((A) => {
  if (!$s(A)) return !0;                                 // not a tool_reference → keep
  let Y = A.tool_name; if (!Y) return !0;
  let f = JT(Y), O = $.has(f);                           // $ = set of currently-available tool names
  if (!O) N(`Filtering out tool_reference for unavailable tool: ${f}`, { level: "warn" });
  return O;                                              // keep only if still available
});
if (z.length === 0) return { ..._, content: [{ type: "text", text: "[Tool references removed - tools no longer available]" }] };

// READABLE (for understanding):
const kept = block.content.filter(item => {
  if (!isToolReferenceBlock(item)) return true;
  const name = item.tool_name; if (!name) return true;
  const available = availableNames.has(normalizeToolName(name));   // JT
  if (!available) logForDebugging(`Filtering out tool_reference for unavailable tool: ${normalizeToolName(name)}`, { level: "warn" });
  return available;
});
if (kept.length === 0) return { ...block, content: [{ type: "text", text: "[Tool references removed - tools no longer available]" }] };

// Mapping: jQ_→stripUnavailableToolReferences, $s→isToolReferenceBlock, JT→normalizeToolName, $→availableNames
```

### Stage 7 — the disabled path: strip all references when tool search is off

When tool search is **not** enabled for a request (`!D`), `tool_reference` blocks are meaningless (the
API won't expand them), so every reference is stripped from the messages before sending — user
messages via `Mi6`, assistant `caller` fields via `yG4`:

```javascript
// ============================================
// stripAllToolReferences - drop every tool_reference when tool search is disabled
// Location: cli_inner_pretty.js:444337-444354 (Mi6, the user-message branch)
// ============================================

// ORIGINAL (for source lookup):
let _ = K.content.filter((z) => !$s(z));                // drop ALL tool_reference blocks
if (_.length === 0) return { ...K, content: [{ type: "text", text: "[Tool references removed - tool search not enabled]" }] };

// READABLE (for understanding):
const kept = block.content.filter(item => !isToolReferenceBlock(item));
if (kept.length === 0) return { ...block, content: [{ type: "text", text: "[Tool references removed - tool search not enabled]" }] };

// Mapping: Mi6→stripAllToolReferences, $s→isToolReferenceBlock
```

Note the two distinct placeholder texts — *"tools no longer available"* (stage 6, server gone) vs
*"tool search not enabled"* (stage 7, feature off) — so the model can tell the two situations apart.
The dispatch is at 557022-557033: when `!D`, each message is run through `Mi6`/`yG4`.

### The guardrail — calling an undiscovered deferred tool (`zS_`)

If the model tries to invoke a deferred tool it has **not** loaded (no `tool_reference` for it), the
schema was never sent, so typed parameters would be emitted as strings and rejected by the client-side
parser. A guard injects an explicit corrective message:

```javascript
// ============================================
// undiscoveredToolHint - tell the model to ToolSearch a deferred tool it called without loading
// Location: cli_inner_pretty.js:409866-409882 (zS_)
// ============================================

// ORIGINAL (for source lookup):
function zS_(H, $, q) {
  if (!wE()) return null;                                // tool search off → no deferral, nothing to fix
  if (!$RH(q)) return null;                              // ToolSearch unavailable
  if (!pp(H)) return null;                               // not a deferred tool
  if (P8H($).has(H.name)) return null;                   // already discovered → fine
  return `\n\nThis tool's schema was not sent to the API — it was not in the discovered-tool set derived from message history. Without the schema in your prompt, typed parameters (arrays, numbers, booleans) get emitted as strings and the client-side parser rejects them. Load the tool first: call ${l3} with query "select:${H.name}", then retry this call.`;
}

// READABLE (for understanding):
function undiscoveredToolHint(tool, messages, tools) {
  if (!isToolSearchEnabledOptimistic()) return null;
  if (!isToolSearchToolAvailable(tools)) return null;
  if (!isDeferredTool(tool)) return null;
  if (extractDiscoveredToolNames(messages).has(tool.name)) return null;   // it WAS loaded — no hint
  return `\n\nThis tool's schema was not sent to the API … Load the tool first: call ${TOOL_SEARCH_TOOL_NAME} with query "select:${tool.name}", then retry this call.`;
}

// Mapping: zS_→undiscoveredToolHint, wE→isToolSearchEnabledOptimistic, $RH→isToolSearchToolAvailable, pp→isDeferredTool, P8H→extractDiscoveredToolNames, l3→TOOL_SEARCH_TOOL_NAME
```

This closes the loop defensively: the model occasionally guesses a deferred tool's name straight from
the `<system-reminder>` without loading it; instead of a cryptic validation error, it gets a precise
"call `ToolSearch` with `select:<name>` first" instruction — turning a dead-end into a one-step
recovery.

**Cross-validation:** the request-assembly split (non-deferred + ToolSearch + discovered), the
disabled-path strip, and the unavailable-reference strip are all present in 2.1.88
(`utils/toolSearch.ts` + `utils/api.ts` + message-normalization). The 2.1.156 additions in this area
are the **provider-specific beta selection** (`oEK`: vertex/bedrock/gateway → `tool-search-tool`, else
`advanced-tool-use`) and the **undiscovered-tool hint** (`zS_`). Confidence **high**.

---

## 7. Cache invalidation (`Of4` / `Uy_`)

ToolSearch memoizes per-tool description text (`getToolDescriptionMemoized` `pZ8`) for scoring. The
cache must be cleared whenever the deferred set itself changes.

```javascript
// ============================================
// maybeInvalidateCache - fingerprint the deferred set; clear description cache on change
// Location: cli_inner_pretty.js:404129-404140
// ============================================

// ORIGINAL (for source lookup):
function Uy_(H) { return H.map(($) => $.name).sort().join(","); }
function Of4(H) { let $ = Uy_(H); if (aQ6 !== $) (N("ToolSearchTool: cache invalidated - deferred tools changed"), pZ8.cache.clear?.(), (aQ6 = $)); }
function Fy_() { (pZ8.cache.clear?.(), (aQ6 = null)); }

// READABLE (for understanding):
function getDeferredToolsCacheKey(deferred) { return deferred.map(t => t.name).sort().join(","); }
function maybeInvalidateCache(deferred) {
  const key = getDeferredToolsCacheKey(deferred);
  if (cachedDeferredToolNames !== key) {
    logForDebugging("ToolSearchTool: cache invalidated - deferred tools changed");
    getToolDescriptionMemoized.cache.clear?.();
    cachedDeferredToolNames = key;
  }
}
function clearToolSearchDescriptionCache() { getToolDescriptionMemoized.cache.clear?.(); cachedDeferredToolNames = null; }

// Mapping: Of4→maybeInvalidateCache, Uy_→getDeferredToolsCacheKey, Fy_→clearToolSearchDescriptionCache, aQ6→cachedDeferredToolNames, pZ8→getToolDescriptionMemoized
```

The fingerprint is `names.sort().join(",")` — cheap, deterministic, run-stable. **Why fingerprint vs.
always-fresh:** scoring renders every deferred tool's `prompt()`; with 100+ MCP tools, recomputing per
call is wasteful. The fingerprint catches the only case that needs invalidation — the deferred set
changed — without paying per call. Identical to 2.1.88 (`ToolSearchTool.ts:55-105`). Confidence
**high**.

---

## 8. v2.1.88 → v2.1.156 evolution (deferral mechanism)

| Area | 2.1.88 | 2.1.156 | Evidence |
|------|--------|---------|----------|
| `isDeferredTool` ladder | 6 rules + `shouldDefer` | **+ ScheduleWakeup/kairos** (rule 7) **+ EnterWorktree/bg** (rule 8) | `216868-216880`; changelog 2.1.153 |
| Delta facets | `{added, addedLines, removed}` | **+ `readded` + `pendingMcpServers`** (5-state) | `424861-424916` |
| Pool-change telemetry | added/removed/prior counts | **+ readded/unlisted/pendingChanged/pendingCount/lastPending** | `424893` |
| Reminder sections | added / removed / pending (legacy path also existed) | added / re-added / removed / pending — single `<system-reminder>` path | `445673-445714` |
| Announcement gating | toggle `<system-reminder>` vs `<available-deferred-tools>` (`tengu_glacier_2xr`) | **always `<system-reminder>`**; legacy string & gate **removed** | `grep available-deferred-tools → 0` |
| Scorer MCP detection | `startsWith('mcp__')` | structured `mcpInfo ?? getMcpInfo` | `404146` |
| Scorer dimensions | parts/full/hint/desc | **+ `coarseParts`** exact & substring | `404217-404218` |

**Net:** the *deferral contract* (`alwaysLoad` opt-out, MCP-defaults-deferred, `shouldDefer` opt-in,
`defer_loading` wire field, `tool_reference` discovery, compact carry-across) is unchanged from 2.1.88.
The new work is **eligibility precision** (two new turn-1 exemptions tied to specific workflows: /loop
dynamic and bg-worktree), **richer state tracking** in the delta (reconnect + pending), and a
**completed rollout** of the delta-attachment announcement path.

---

## 9. Key insights

- **Eligibility is "small exception list, then `shouldDefer`."** Nine rules, but eight are explicit
  exceptions and the ninth (`shouldDefer`) covers the long tail. The exceptions are exactly the tools
  that would force a wasted ToolSearch round-trip on a critical path (the resolver, communication
  channels, fork-subagent, /loop pacing, bg-worktree isolation).

- **"Undeferred ≠ removed" is the subtle correctness invariant.** A tool that stopped deferring but is
  still in the pool is now *more* available (full schema), not gone. The diff deliberately stays silent
  rather than telling the model a loaded tool disappeared.

- **The pending-server reminder is a behavioral guardrail, not just info.** Its job is to stop the
  model from concluding "capability unavailable" before ToolSearch has waited for the connecting
  server. The delta reminder and the in-tool wait are two halves of one anti-pattern fix.

- **`coarseParts` is a quiet but real ranking upgrade.** Adding the whole-name dimension recovers
  exact-name hits the token-split scorer missed, at no cost to per-token precision — the highest-impact
  search change since 2.1.88.

- **Discovery is reconstructed, never registered.** The set of loaded MCP tools lives only in the
  message history as `tool_reference` blocks (+ the compact-boundary snapshot). This is what lets the
  system carry an unbounded number of MCP tools with no upfront declaration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_tool_search.md](../00_overview/symbol_additions_v2_1_156_tool_search.md) - v2.1.156 ToolSearch & deferred-tool symbols
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `isDeferredTool` (`pp`) - 8-rule defer-eligibility ladder
- `searchToolsWithKeywords` (`jf4`) / `parseToolName` (`Mf4`) / `compileTermPatterns` (`Qy_`) - scorer
- `getToolDescriptionMemoized` (`pZ8`) - memoized per-tool prompt text
- `getDeferredToolsDelta` (`tg6`) - 5-state pool diff
- `extractDiscoveredToolNames` (`P8H`) - `tool_reference` scan + compact carry
- `summarizeByServerPrefix` (`J08`) - collapse `mcp__server__*` with counts
- `formatDeferredToolLine` (`PG6`) - one announced line per tool (returns `tool.name`)
- `maybeInvalidateCache` (`Of4`) / `getDeferredToolsCacheKey` (`Uy_`) - fingerprint cache
- `SCHEDULE_WAKEUP_TOOL_NAME` (`df`) / `isKairosLoopDynamicEnabled` (`hwH`) - rule 7
- `ENTER_WORKTREE_TOOL_NAME` (`n1H`) - rule 8 (`CLAUDE_CODE_SESSION_KIND === "bg"`)
- `AMBIENT_CONTEXT_NOTE` (`yT8`) / `DEFERRED_DELTA_LIST_CAP` (`$qH`) - reminder trailer / 30-name cap
