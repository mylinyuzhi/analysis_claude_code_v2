# `@` Mention — Unified File + Agent + MCP Suggestion Popup (v2.1.142)

## TL;DR

When the user types `@<query>` in the prompt input box, the typeahead pops up
a single ranked list that **interleaves four kinds of matches**: indexed
files, MCP resources, MCP resource templates (new in 2.1.142), and **agent
definitions**. Each match carries a one-character icon (`+` file, `◇` MCP
resource / template, `*` agent), and agent rows additionally render in the
agent's assigned color.

The screenshot the user pasted for `@ag` —

```
❯@ag
+ ../AGENTS.md
* Plan (agent) – Software architect agent for designing implementation plans…
* claude (agent) – Catch-all for any task that doesn't fit a more specific age…
* general-purpose (agent) – General-purpose agent for researching complex questions, se…
* statusline-setup (agent) – Use this agent to configure the user's Claude Code status l…
* claude-code-guide (agent) – Use this agent when the user asks questions ("Can Claude…
* Explore (agent) – Fast read-only search agent for locating code. Use it to fi…
+ ../AGENTS_codex.md
+ ../docs/agents_md.md
+ vercel-ai/google/
+ memory/src/agent_memory.rs
+ common/types/src/agent.rs
+ ../codex-rs/core/src/agent/
+ ../codex-rs/agent-identity/
+ vercel-ai/google/tests/
```

— is exactly fifteen items because `MAX_UNIFIED_SUGGESTIONS = 15`. The
`AGENTS.md` file wins the top slot because its nucleo (Rust fuzzy matcher)
score is lower than any Fuse.js score the agents could earn, but the six
agent definitions all sort above the bulk of the files because Fuse weights
the `agentType` and `displayText` fields at 3 and 2 respectively and `"ag"`
is a prefix of `AGENTS.md`'s only the fuzzy matcher knows.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Agent definitions, AgentTool)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI Components / Slash Commands
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — MCP, Prompt

Key functions in this document:
- `generateUnifiedSuggestions` (`Nc6`) — file + MCP + template + agent merge & rank (cli_inner_pretty.js:546070-546129)
- `generateAgentSuggestions` (`QQ5`) — agent-name filter (cli_inner_pretty.js:546053-546069)
- `createSuggestionFromSource` (`$u4`) — adds `file-`/`mcp-resource-`/`mcp-template…`/`agent-` id prefix and color (cli_inner_pretty.js:546033-546049)
- `usePromptInputTypeahead` (`fu4`) — the typeahead hook (cli_inner_pretty.js:546309-546993)
- `getCompletionToken` (`K_H`) — extract the `@…` token at cursor (cli_inner_pretty.js:546267-546297)
- `getAgentColor` (`F7H`) — palette lookup (cli_inner_pretty.js:231351-231356)
- `getMcpResourceTemplateSuggestions` (`u28`) — NEW in 2.1.142, resolves `@server:resource{arg}` templates (cli_inner_pretty.js:546130-546182)
- `formatAtMentionReplacement` (`kc6`) — adds `@` / quotes / `%20` (cli_inner_pretty.js:546183-546187)
- `formatReplacementValue` (`Ic6`) — applies prefix and trailing space (cli_inner_pretty.js:546227-546233)
- `getSuggestionIcon` (`Ul1`) — `+` / `◇` / `*` per item type (cli_inner_pretty.js:179731-179737)
- `SuggestionItemRow` (`gl1`) — renders one row with truncation + highlight (cli_inner_pretty.js:179949+)
- `DM_NAME_AT_RE` (`B28`) — `(^|[\s。、？！])@([\w-]*)$` (cli_inner_pretty.js:547045)
- `HAS_AT_SYMBOL_RE` (`iQ5`) — Unicode-property variant for path-like `@` tokens (cli_inner_pretty.js:547041)
- `MAX_UNIFIED_SUGGESTIONS` (`P0$` = 15) and `DESCRIPTION_MAX_LENGTH` (`gQ5` = 60) (cli_inner_pretty.js:546189-546190)
- `TEAM_LEAD_NAME` (`az` = `"team-lead"`) (cli_inner_pretty.js:239082)
- `isAgentSwarmsEnabled` (`eK`) — `--agent-teams` flag + statsig gate (cli_inner_pretty.js:237057-237061)
- `isRemoteWorkspace` (`I6`) — branch that suppresses local indexes (cli_inner_pretty.js:3104-3106)
- `extractAgentMentions` (`Bs7`) — submit-time @ parser for popup-quoted `@"X (agent)"` and `@agent-X` forms (cli_inner_pretty.js:398387-398396)
- `extractFileMentions` (`Xq5`) — file/dir parser; explicitly skips `@"X (agent)"` (cli_inner_pretty.js:398367-398381)
- `extractMcpResourceMentions` (`Lq5`) — requires `server:uri` colon (cli_inner_pretty.js:398382-398386)
- `processAgentMentions` (`_q5`) — agentType lookup, emits `agent_mention` attachment (cli_inner_pretty.js:398036-398051)
- `emitAtMentionEvent` (`Nk`) — OTel `at_mention` event with `mention_type`/`success` (cli_inner_pretty.js:218482-218484)
- Meta-message template for `agent_mention` attachment (cli_inner_pretty.js:426141-426147)
- `tengu_subagent_at_mention` telemetry with `is_subagent_only`/`is_prefix` (cli_inner_pretty.js:557415-557421)

---

## Three Branches of the `@` Trigger

The typeahead's `updateSuggestions` callback (`fu4`'s inner `GH`, cli_inner_pretty.js:546459-546696) checks for three different `@`-shaped patterns in order — they correspond to three different *intents*. Only one is active per keystroke.

```javascript
// ============================================
// updateAtSuggestions - three-branch @ dispatcher
// Location: cli_inner_pretty.js:546489-546693 (excerpted)
// ============================================

// ORIGINAL (for source lookup):
let iH = z !== "bash" ? WH.substring(0, q$).match(B28) : null;
if (iH) {
  let $$ = (iH[2] ?? "").toLowerCase(),
      G$ = C.getState(),
      M$ = [],
      W$ = new Set();
  if (eK() && G$.teamContext)
    for (let S$ of Object.values(G$.teamContext.teammates ?? {})) {
      if (S$.name === az) continue;
      if (!S$.name.toLowerCase().startsWith($$)) continue;
      (W$.add(S$.name),
        M$.push({ id: `dm-${S$.name}`, displayText: `@${S$.name}`, description: "send message" }));
    }
  for (let [S$, m$] of G$.agentNameRegistry) {
    if (W$.has(S$)) continue;
    if (!S$.toLowerCase().startsWith($$)) continue;
    let i$ = G$.tasks[m$]?.status;
    M$.push({
      id: `dm-${S$}`,
      displayText: `@${S$}`,
      description: i$ ? `send message · ${i$}` : "send message",
    });
  }
  if (M$.length > 0) { /* set suggestionType="agent", return early */ }
}
// ... HASH (#channel) and emoji branches elided ...
let A$ = WH.substring(0, q$).match(iQ5);   // path-like @ token
if (A$ && z !== "bash") {
  let $$ = K_H(WH, q$, !0);                // includeAtSymbol=true
  if ($$ && $$.token.startsWith("@")) {
    let G$ = hc6($$);                       // strip @ / quotes
    if (YmK(G$)) {                          // path-completion gate
      // @./, @~/, @/abs/... -> directory completion fast path
    }
    zH(G$, !0);                             // <- otherwise: Nc6() unified
    return;
  }
}

// READABLE (for understanding):
const dmAtMatch = mode !== "bash"
  ? value.substring(0, cursor).match(DM_NAME_AT_RE)   // /(^|[\s。…])@([\w-]*)$/
  : null;
if (dmAtMatch) {
  const partial = (dmAtMatch[2] ?? "").toLowerCase();
  const dmItems = [];
  const seen = new Set();
  // (1a) live teammates (swarm sessions only)
  if (isAgentSwarmsEnabled() && state.teamContext) {
    for (const t of Object.values(state.teamContext.teammates ?? {})) {
      if (t.name === TEAM_LEAD_NAME) continue;
      if (!t.name.toLowerCase().startsWith(partial)) continue;
      seen.add(t.name);
      dmItems.push({ id: `dm-${t.name}`, displayText: `@${t.name}`, description: "send message" });
    }
  }
  // (1b) running subagents by registered name (always, even without swarms)
  for (const [name, agentId] of state.agentNameRegistry) {
    if (seen.has(name) || !name.toLowerCase().startsWith(partial)) continue;
    const status = state.tasks[agentId]?.status;
    dmItems.push({
      id: `dm-${name}`,
      displayText: `@${name}`,
      description: status ? `send message · ${status}` : "send message",
    });
  }
  if (dmItems.length > 0) {
    setSuggestions({ suggestions: dmItems });
    setSuggestionType("agent");
    return;                                            // <- early return: DM wins
  }
}

// ... (Slack #channel, emoji `:`) ...

const pathAtMatch = value.substring(0, cursor).match(HAS_AT_SYMBOL_RE);
if (pathAtMatch && mode !== "bash") {
  const token = getCompletionToken(value, cursor, /*includeAt=*/true);
  if (token?.token.startsWith("@")) {
    const search = stripAtAndQuotes(token);
    if (isPathLike(search)) {
      // @./foo, @~/foo, @/abs — fast-path directory completion (no agents)
    }
    debouncedUnifiedFetch(search, /*isAtSymbol=*/true);  // -> Nc6(...)
    return;
  }
}

// Mapping:
//   B28        -> DM_NAME_AT_RE
//   iQ5        -> HAS_AT_SYMBOL_RE
//   eK         -> isAgentSwarmsEnabled
//   az         -> TEAM_LEAD_NAME
//   K_H        -> getCompletionToken
//   hc6        -> stripAtAndQuotes
//   YmK        -> isPathLike
//   zH         -> debouncedUnifiedFetch (wraps Nc6)
//   Nc6        -> generateUnifiedSuggestions
```

### Why two `@` regexes?

`DM_NAME_AT_RE` (`B28`, line 547045) accepts only `[\w-]*` — alphanumeric and hyphens — because teammate names and `agentNameRegistry` keys are slugs. It anchors at start-of-string or whitespace/CJK-sentence-punctuation:

```
/(^|[\s。、？！])@([\w-]*)$/
```

The CJK additions (`。` 。, `、` 、, `？` ？, `！` ！) let a Chinese/Japanese sentence-ending punctuation count as a word boundary — important for users writing CJK prose with embedded `@names`.

`HAS_AT_SYMBOL_RE` (`iQ5`, line 547041) is much broader: it matches the same word-boundary anchor but the token body uses Unicode-property classes that include letters, marks, digits, plus path characters `_-./\\()[\]~:`:

```
/(^|[\s。、？！])@([\p{L}\p{N}\p{M}_\-./\\()[\]~:]*|"[^"]*"?)$/u
```

This is the regex that lets `@/abs/path`, `@~/foo`, `@server:resource`, and quoted `@"path with spaces"` tokens trigger the unified popup.

**Why DM wins**: the two regexes overlap (`@foo` matches both). The hook short-circuits the unified branch *only when at least one DM item matches*. So `@foo` with no teammate or running subagent named `foo…` falls through to unified suggestions — which is what produced the `@ag` screenshot (no teammate named `ag*`).

### Bash mode: `@` is inert

The `mode !== "bash"` guard on both regex tests means the prompt's bash mode (`!` prefix) gets *zero* `@` autocomplete. `@` has no special meaning to the shell, so the typeahead deliberately stays out of the user's way.

---

## `generateUnifiedSuggestions` — the merger

This is the algorithm that produced the mixed list in the screenshot. The 2.1.142 implementation is at cli_inner_pretty.js:546070-546129. It is recognizably evolved from the 2.1.88 `unifiedSuggestions.ts` (kept in tree at `/lyz/codespace/3rd/claude-code/src/hooks/unifiedSuggestions.ts`), with two material differences and one new parameter.

```javascript
// ============================================
// generateUnifiedSuggestions - merge & rank file + MCP + template + agent matches
// Location: cli_inner_pretty.js:546070-546129
// ============================================

// ORIGINAL (for source lookup):
async function Nc6(H, $, q, K, _ = !1, A = {}) {
  if (!$ && !_) return [];
  let [z, Y] = await Promise.all([_oH(H, $, _), Promise.resolve(QQ5(K, $, _))]),
    f = z.map((j) => ({ type: "file", displayText: j.displayText, description: j.description,
                       path: j.displayText, filename: qu4.basename(j.displayText),
                       score: j.metadata?.score })),
    O = Object.values(q).flat().map((j) => ({
      type: "mcp_resource",
      displayText: `${j.server}:${j.uri}`,
      description: W0$(j.description || j.name || j.uri),
      server: j.server, uri: j.uri, name: j.name || j.uri,
    })),
    M = Object.values(A).flat().map((j) => ({
      type: "mcp_resource_template",
      displayText: `${j.server}:${VV6(j.uriTemplate)}`,
      description: W0$(j.description || j.name || j.uriTemplate),
      server: j.server, uriTemplate: j.uriTemplate, name: j.name || j.uriTemplate,
    }));
  if (!$) return [...f, ...O, ...M, ...Y].slice(0, P0$).map($u4);
  let w = [...O, ...M, ...Y], D = [];
  for (let j of f) D.push({ source: j, score: j.score ?? 0.5 });
  if (w.length > 0) {
    let J = new oQ(w, {
      includeScore: !0,
      threshold: 0.6,
      keys: [
        { name: "displayText",  weight: 2 },
        { name: "name",         weight: 3 },
        { name: "server",       weight: 1 },
        { name: "description",  weight: 1 },
        { name: "agentType",    weight: 3 },
        { name: "uriTemplate",  weight: 2 },
      ],
    }).search($, { limit: P0$ });
    for (let X of J) {
      let L = X.item.type === "mcp_resource" ? 0.15 : 0;
      D.push({ source: X.item, score: (X.score ?? 0.5) + L });
    }
  }
  return (D.sort((j, J) => j.score - J.score),
          D.slice(0, P0$).map((j) => j.source).map($u4));
}

// READABLE (for understanding):
const MAX_UNIFIED_SUGGESTIONS = 15;   // P0$
const DESCRIPTION_MAX_LENGTH   = 60;  // gQ5
const MCP_RESOURCE_RANK_PENALTY = 0.15;  // <- new in 2.1.142

async function generateUnifiedSuggestions(
  fileIndex,            // H — shared, in-memory file index
  query,                // $ — search text without the leading "@"
  mcpResources,         // q — { server -> ServerResource[] }
  agents,               // K — AgentDefinition[]
  showOnEmpty = false,  // _ — show suggestions even with empty query (Tab on empty input)
  mcpResourceTemplates = {},  // A — NEW: { server -> ServerResourceTemplate[] }
) {
  if (!query && !showOnEmpty) return [];

  // Run file index lookup (Rust/nucleo) in parallel with agent name filter (cheap, sync).
  const [files, agentSources] = await Promise.all([
    generateFileSuggestions(fileIndex, query, showOnEmpty),  // _oH
    Promise.resolve(generateAgentSuggestions(agents, query, showOnEmpty)),  // QQ5
  ]);

  const fileSources = files.map(f => ({
    type: "file",
    displayText: f.displayText,
    description: f.description,
    path: f.displayText,
    filename: path.basename(f.displayText),
    score: f.metadata?.score,         // 0..1 from nucleo, lower = better
  }));

  const mcpSources = Object.values(mcpResources).flat().map(r => ({
    type: "mcp_resource",
    displayText: `${r.server}:${r.uri}`,
    description: truncateDescription(r.description || r.name || r.uri),
    server: r.server, uri: r.uri, name: r.name || r.uri,
  }));

  // NEW in 2.1.142: server-declared templates (e.g. github://repos/{owner}/{repo})
  const templateSources = Object.values(mcpResourceTemplates).flat().map(t => ({
    type: "mcp_resource_template",
    displayText: `${t.server}:${stripUriTemplateArgs(t.uriTemplate)}`,
    description: truncateDescription(t.description || t.name || t.uriTemplate),
    server: t.server, uriTemplate: t.uriTemplate, name: t.name || t.uriTemplate,
  }));

  // No query → just splice the lists together untruncated and cap at 15.
  if (!query) {
    return [...fileSources, ...mcpSources, ...templateSources, ...agentSources]
      .slice(0, MAX_UNIFIED_SUGGESTIONS)
      .map(createSuggestionFromSource);
  }

  // Score files separately: nucleo already gave them a 0..1 score, lower=better.
  const scored = fileSources.map(s => ({ source: s, score: s.score ?? 0.5 }));

  // Score everything else with Fuse.js using a weighted multi-key match.
  const nonFile = [...mcpSources, ...templateSources, ...agentSources];
  if (nonFile.length > 0) {
    const fuse = new Fuse(nonFile, {
      includeScore: true,
      threshold: 0.6,
      keys: [
        { name: "displayText",  weight: 2 },
        { name: "name",         weight: 3 },
        { name: "server",       weight: 1 },
        { name: "description",  weight: 1 },
        { name: "agentType",    weight: 3 },
        { name: "uriTemplate",  weight: 2 },   // NEW in 2.1.142
      ],
    });
    for (const r of fuse.search(query, { limit: MAX_UNIFIED_SUGGESTIONS })) {
      // NEW in 2.1.142: nudge mcp_resource items 0.15 worse so agents and
      // templates beat them when both fuzzy-match the same query.
      const penalty = r.item.type === "mcp_resource" ? MCP_RESOURCE_RANK_PENALTY : 0;
      scored.push({ source: r.item, score: (r.score ?? 0.5) + penalty });
    }
  }

  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, MAX_UNIFIED_SUGGESTIONS)
               .map(r => r.source)
               .map(createSuggestionFromSource);
}

// Mapping:
//   Nc6 -> generateUnifiedSuggestions,  H/$/q/K/_/A -> fileIndex/query/mcpResources/agents/showOnEmpty/mcpResourceTemplates
//   _oH -> generateFileSuggestions,     QQ5 -> generateAgentSuggestions,  $u4 -> createSuggestionFromSource
//   W0$ -> truncateDescription,         VV6 -> stripUriTemplateArgs,      oQ  -> Fuse
//   P0$ -> MAX_UNIFIED_SUGGESTIONS=15,  gQ5 -> DESCRIPTION_MAX_LENGTH=60
```

### Algorithm — how scoring orders the screenshot

**What it does:** Merge four independently-fetched suggestion streams into one list, dedup by id-prefix domain, score using two different matchers, and return the top 15.

**How it works:**

1. **Two-track scoring**: File suggestions are scored by **nucleo** (a Rust fuzzy matcher used by the file index — see `_oH` at cli_inner_pretty.js:430192). Everything non-file (MCP resource, MCP template, agent) is scored by **Fuse.js** with a weighted multi-key match. Both scoring systems use *lower-is-better*, so they can be merged onto a single number line.
2. **Why two matchers?** Nucleo runs on a pre-built path-trigram index of the whole workspace — it scales to tens of thousands of files. Fuse.js doesn't need an index but isn't free per query, which is fine for the dozen-or-so non-file candidates.
3. **Fuse keys & weights**: `agentType` (3) and `name` (3) dominate. `displayText` (2) and `uriTemplate` (2) come next. `server` (1) and `description` (1) are tie-breakers. So when the user types `ag`:
   - An agent whose `agentType` is `agent-foo` scores very low (best) on the weight-3 key.
   - An agent whose `description` contains "agent" only matches the weight-1 key.
   - Note that in the screenshot, *all six agent definitions* match because their descriptions all contain the substring "agent" — `Plan` ("Software architect agent..."), `claude` ("any task that doesn't fit a more specific agent..."), `general-purpose` ("General-purpose agent..."), `statusline-setup` ("Use this agent..."), `claude-code-guide` ("agent" appears in name and description), `Explore` ("read-only search agent...").
4. **Files win the top slot anyway** because nucleo gives an exact-prefix hit (`AGENTS.md` starts with `AG`) a score very close to 0, which beats Fuse's best (typically 0.0–0.1 for a key-prefix match but ~0.1–0.3 for substring matches in descriptions).
5. **The 0.15 MCP penalty (NEW in 2.1.142)**: Inside the Fuse loop, *only* `mcp_resource` items get a +0.15 score nudge. The effect is that, when an MCP resource and an agent definition both fuzzy-match the same query with similar quality, the agent ranks first. Templates (`mcp_resource_template`) do **not** get this penalty — they're closer to first-class actions ("expand a parametric resource") than the often-noisy raw resource list.
6. **Final cap**: Top 15 after the merged sort. The 15 the user sees in the screenshot are 1 file + 6 agents + 8 more files. No MCP resources because the project has none configured for that workspace; if it did, the penalty would push them below the agents.

**Why this approach:**

- **Mixing two matchers** lets the file path index live in Rust (fast, indexed) while keeping the non-file candidates small enough for JS-side fuzzy without an index step.
- **Lower-is-better unified scoring** is the cheapest way to merge — no normalization per source, no "promote files first" rule, just compare numbers.
- **Penalty rather than re-ordering** keeps tie-breaking smooth: in the rare case where an agent's match is very weak (score ~0.55) and an MCP resource is excellent (score ~0.05), the MCP resource still wins despite the penalty. Hard category-based ordering would mis-rank these.

**Key insight:** The single 0.15 number does all the "agents matter more than raw MCP listings" work — no separate code path, no list-merging logic, no agent-specific UI. Adding the penalty was a one-line behavior change.

---

## `generateAgentSuggestions` — filtering and decoration

```javascript
// ============================================
// generateAgentSuggestions - filter agent list by query, attach color
// Location: cli_inner_pretty.js:546053-546069
// ============================================

// ORIGINAL (for source lookup):
function QQ5(H, $, q = !1) {
  if (!$ && !q) return [];
  try {
    let K = H.map((A) => ({
      type: "agent",
      displayText: `${A.agentType} (agent)`,
      description: W0$(A.whenToUse),
      agentType: A.agentType,
      color: F7H(A.agentType),
    }));
    if (!$) return K;
    let _ = $.toLowerCase();
    return K.filter((A) => A.agentType.toLowerCase().includes(_) || A.displayText.toLowerCase().includes(_));
  } catch (K) { return (EH(K), []); }
}

// READABLE (for understanding):
function generateAgentSuggestions(agents, query, showOnEmpty = false) {
  if (!query && !showOnEmpty) return [];
  try {
    const sources = agents.map(a => ({
      type: "agent",
      displayText: `${a.agentType} (agent)`,            // "Plan (agent)"
      description: truncateDescription(a.whenToUse),    // a.whenToUse, truncated to 60 chars
      agentType: a.agentType,
      color: getAgentColor(a.agentType),                // theme key like "blue_FOR_SUBAGENTS_ONLY"
    }));
    if (!query) return sources;                         // show-all when triggered with no query
    const q = query.toLowerCase();
    return sources.filter(s =>
      s.agentType.toLowerCase().includes(q) ||
      s.displayText.toLowerCase().includes(q),
    );
  } catch (err) {
    logError(err);
    return [];
  }
}

// Mapping:
//   QQ5 -> generateAgentSuggestions,  H/$/q -> agents/query/showOnEmpty
//   W0$ -> truncateDescription,       F7H -> getAgentColor,         EH -> logError
```

### Where do the agents come from?

The `agents` array passed in is the `activeAgents` from `loadAgentsDir` (see [30_agent_team](../30_agent_team/v2_1_142_subagent_matching.md) for the loader and dispatch path). It includes:

- **Built-in agents**: `Plan`, `claude`, `general-purpose`, `statusline-setup`, `claude-code-guide`, `Explore` (the six in the user's screenshot).
- **Custom agents**: from `.claude/agents/*.md` in user/project settings.
- **Plugin agents**: declared in `plugin.json`.

The same filter passed to `Nc6` is shown in the popup is the same set that the Agent tool's `subagent_type` parameter accepts (see [`v2_1_142_subagent_matching.md`](../30_agent_team/v2_1_142_subagent_matching.md) for the resolution algorithm).

### The pre-filter vs. the Fuse step

`generateAgentSuggestions` runs an additional substring pre-filter on its agent set *before* handing it to Fuse. This is a defensive narrow: only agents whose `agentType` or `displayText` literally contain the query (case-insensitive) make it into the Fuse pool. A query like `@ag` keeps all six built-ins (because they all literally contain "ag" somewhere: AGENTS, agent, general, statusline-setup contains "set", but wait — `statusline-setup` does NOT contain "ag"...).

Looking at the actual code: the filter uses `agentType.toLowerCase().includes(q) || displayText.toLowerCase().includes(q)`. `displayText` is `"${agentType} (agent)"` — so *every agent's* displayText contains the literal substring `"agent"`. For `@ag`, "agent" includes "ag" → every agent's displayText matches. **That's why the screenshot has all six built-ins** even though `statusline-setup` has no "ag" in its name. The `(agent)` suffix is the great equalizer.

This is also why the popup degrades gracefully on short queries: any query that's a prefix of `agent` (i.e. `@a`, `@ag`, `@age`, `@agen`, `@agent`) lists *every* agent. Beyond `@agent` the filter starts dropping items that don't contain the broader substring.

---

## Replacement — what `Tab` actually inserts

When the user accepts an agent suggestion (Tab/Enter), the typeahead's `vH`/`TH` callbacks (cli_inner_pretty.js:546853 and :546703) route through `WW$` (the splice-and-set-cursor helper). All unified-type items (file, mcp_resource, mcp_resource_template, agent) share the `suggestionType === "file"` commit branch at cli_inner_pretty.js:546771-546812, because `Nc6` sets the type to `"file"` for the whole merged list at :546414. The replacement text comes from `Ic6` (`formatReplacementValue`):

```javascript
// ORIGINAL (for source lookup):
function Ic6(H) {
  let { displayText: $, mode: q, hasAtPrefix: K, needsQuotes: _, isQuoted: A, isComplete: z } = H,
    Y = z ? " " : "";
  if (A || _) return q === "bash" ? `"${$}"${Y}` : `@"${$}"${Y}`;
  else if (K) return q === "bash" ? `${$}${Y}` : `@${$}${Y}`;
  else return $;
}

// READABLE:
function formatReplacementValue({ displayText, mode, hasAtPrefix, needsQuotes, isQuoted, isComplete }) {
  const trailing = isComplete ? " " : "";
  if (isQuoted || needsQuotes)
    return mode === "bash" ? `"${displayText}"${trailing}` : `@"${displayText}"${trailing}`;
  if (hasAtPrefix)
    return mode === "bash" ? `${displayText}${trailing}` : `@${displayText}${trailing}`;
  return displayText;
}

// Mapping: Ic6 -> formatReplacementValue
```

The commit branch's call into `Ic6` passes `needsQuotes: $$.displayText.includes(" ")` (cli_inner_pretty.js:546803). For an agent pick where `displayText` is `"Plan (agent)"`, the space triggers `needsQuotes = true`, so the inserted text is:

```
@"Plan (agent)"·          # · is the trailing space from isComplete:true
```

For a plain file pick where `displayText` is `"src/main.ts"`, no quotes are needed:

```
@src/main.ts·
```

For an `mcp_resource_template` pick, the createSuggestionFromSource step (cli_inner_pretty.js:546044) attaches `metadata.replacement` — the commit branch sees this via `vnH(metadata)` (cli_inner_pretty.js:546796) and uses the pre-built replacement string `metadata.replacement` instead of going through `Ic6`. Templates also set `metadata.partial: true`, which makes the commit branch immediately re-trigger another `updateSuggestions` pass to fetch arg-value completions via `u28` — that's the "expand `@github:repos/{owner}/{repo}` and then ask the server for `{owner}` candidates" flow.

## Round-trip — from popup pick to `agent_mention` attachment

The popup pick is only the first half of the story. At submit time, `applyAttachmentTriggers` (cli_inner_pretty.js:397558-397562) runs three @-mention parsers in parallel over the raw input text:

```javascript
// cli_inner_pretty.js:397558-397562 (excerpted)
D = H ? [
  aY("at_mentioned_files", () => Kq5(H, M)),                              // extractFileMentions → file/dir
  aY("mcp_resources",      () => Aq5(H, M)),                              // extractMcpResourceMentions
  aY("agent_mentions",     () => Promise.resolve(_q5(H, $.options.agentDefinitions.activeAgents))),
] : [];
```

Each parser uses its own regex, and the three regexes are designed to be **mutually exclusive** so the same `@`-token can never be claimed by two parsers:

```javascript
// ============================================
// extractFileMentions / extractAgentMentions / extractMcpResourceMentions - the three @ parsers
// Location: cli_inner_pretty.js:398367-398395
// ============================================

// ORIGINAL (for source lookup):
function Xq5(H) {                                                         // file mentions
  let $ = /(^|[\s。、？！])@"([^"]+)"/g,                   // quoted form
    q = /(^|[\s。、？！])@([^\s]+)\b/g,                   // unquoted form
    K = [], _ = [], A;
  while ((A = $.exec(H)) !== null) if (A[2] && !A[2].endsWith(" (agent)")) K.push(A[2]);
  return ((H.match(q) || []).forEach((Y) => {
            let f = Y.slice(Y.indexOf("@") + 1);
            if (!f.startsWith('"')) _.push(f);
          }),
          JK([...K, ..._]));
}
function Lq5(H) {                                                         // mcp resource mentions
  let $ = /(^|[\s。、？！])@([^\s]+:[^\s]+)\b/g,           // requires "server:uri" colon
    q = H.match($) || [];
  return JK(q.map((K) => K.slice(K.indexOf("@") + 1)));
}
function Bs7(H) {                                                         // agent mentions
  let $ = [],
    q = /(^|[\s。、？！])@"([\w:.@-]+) \(agent\)"/g,       // popup-generated quoted form
    K;
  while ((K = q.exec(H)) !== null) if (K[2]) $.push(K[2]);
  let _ = /(^|[\s。、？！])@(agent-[\w:.@-]+)/g,           // model/manual id form
    A = H.match(_) || [];
  for (let z of A) $.push(z.slice(z.indexOf("@") + 1));
  return JK($);                                                            // dedup
}

// READABLE (for understanding):
function extractFileMentions(input) {
  const quotedRe   = /(^|[\s。、？！])@"([^"]+)"/g;
  const unquotedRe = /(^|[\s。、？！])@([^\s]+)\b/g;
  const quoted = [], unquoted = [];
  // ① quoted form, but exclude "<x> (agent)" — those belong to the agent parser
  for (const m of input.matchAll(quotedRe))
    if (m[2] && !m[2].endsWith(" (agent)")) quoted.push(m[2]);
  // ② unquoted form, but skip tokens that start with " — already counted above
  for (const m of (input.match(unquotedRe) ?? [])) {
    const tok = m.slice(m.indexOf("@") + 1);
    if (!tok.startsWith('"')) unquoted.push(tok);
  }
  return uniq([...quoted, ...unquoted]);
}

function extractMcpResourceMentions(input) {
  // Distinguished from file mentions by requiring a colon in the token body
  const re = /(^|[\s。、？！])@([^\s]+:[^\s]+)\b/g;
  return uniq((input.match(re) ?? []).map(m => m.slice(m.indexOf("@") + 1)));
}

function extractAgentMentions(input) {
  const results = [];
  // ① popup-generated: @"<type> (agent)"   — what the suggestion commit inserts
  const quotedAgentRe = /(^|[\s。、？！])@"([\w:.@-]+) \(agent\)"/g;
  for (let m; (m = quotedAgentRe.exec(input)); ) if (m[2]) results.push(m[2]);
  // ② model/manual: @agent-<type>          — what the model writes naturally
  const prefixedRe = /(^|[\s。、？！])@(agent-[\w:.@-]+)/g;
  for (const m of (input.match(prefixedRe) ?? [])) results.push(m.slice(m.indexOf("@") + 1));
  return uniq(results);
}

// Mapping:
//   Xq5 -> extractFileMentions,  Lq5 -> extractMcpResourceMentions,  Bs7 -> extractAgentMentions
//   JK  -> uniq
```

**The three-way disambiguation:** for the input `@"Plan (agent)" please review`:
- `extractAgentMentions` matches `Plan` (quoted-agent regex)
- `extractFileMentions`'s quoted-regex matches `Plan (agent)` but the `!endsWith(" (agent)")` guard rejects it; the unquoted regex doesn't match because the token starts with `"`. Result: no file mention.
- `extractMcpResourceMentions` doesn't match — no `:` in the token body.

So the same character span is unambiguously an agent mention. The `" (agent)"` suffix is the disambiguator — it's why the popup's `displayText` is `"Plan (agent)"` rather than just `"Plan"`. **Removing the suffix would break the parser** because `@"Plan"` (without the suffix) would be a file mention.

For the input `@agent-Plan now`:
- `extractAgentMentions` matches `agent-Plan` (prefix regex)
- `extractFileMentions` matches `agent-Plan` too! (unquoted regex matches `[^\s]+`)
- `extractMcpResourceMentions` doesn't match — no colon

Both file and agent parsers claim this token. Downstream, the resulting attachments are de-duplicated by type only — but the file lookup fails (no file named `agent-Plan` exists), so the file mention silently produces nothing. The agent mention succeeds. This collision is benign but inelegant — the file parser does not guard against the `agent-` prefix the way it does against the `(agent)` suffix.

### What `_q5` (the agent-mention resolver) does

```javascript
// cli_inner_pretty.js:398036-398051
function _q5(H, $) {                                  // H = input text, $ = activeAgents
  let q = Bs7(H);                                     // captured agent slugs
  if (q.length === 0) return [];
  return q.map((_) => {
    let A = _.replace("agent-", ""),                  // strip the `agent-` prefix from form ②
        z = $.find((Y) => Y.agentType === A);
    if (!z) return (d("tengu_at_mention_agent_not_found", {}),
                    Nk({ mentionType: "agent", success: !1 }), null);
    return (d("tengu_at_mention_agent_success", {}),
            Nk({ mentionType: "agent", success: !0 }),
            { type: "agent_mention", agentType: z.agentType });
  }).filter((_) => _ !== null);
}
```

- For form ① `@"Plan (agent)"` → captured slug is `Plan` (no `agent-` prefix) → `.replace("agent-", "")` is a no-op → `find(a => a.agentType === "Plan")` resolves the AgentDefinition.
- For form ② `@agent-Plan` → captured slug is `agent-Plan` → strip → `Plan` → same lookup.

Both forms converge on the same `AgentDefinition` and produce `{ type: "agent_mention", agentType: "Plan" }`. The telemetry event `tengu_at_mention_agent_success` / `tengu_at_mention_agent_not_found` plus `Nk({ mentionType: "agent", success })` (cli_inner_pretty.js:218483) emits an OTel `at_mention` event with `mention_type: "agent"` for ops dashboards.

### Where the attachment lands in the prompt

The `agent_mention` attachment renders into a meta-message before the user's prompt reaches the model (cli_inner_pretty.js:426141-426147):

```
The user has expressed a desire to invoke the agent "<agentType>".
Please invoke the agent appropriately, passing in the required context to it.
```

That is a soft signal — it doesn't auto-dispatch the Agent tool — but it's enough that the main loop almost always responds by calling `Agent(subagent_type: <agentType>, …)` (see [v2_1_142_subagent_matching.md](../30_agent_team/v2_1_142_subagent_matching.md) for the matcher that accepts the `agentType` value from this attachment).

There's a special-case telemetry at cli_inner_pretty.js:557415-557421 that detects when the user's prompt is *exactly* `@agent-<type>` (no other content) vs. `@agent-<type>` followed by other text. The flags `is_subagent_only` and `is_prefix` ride a `tengu_subagent_at_mention` event — used to distinguish "the user wants ONLY this agent" from "the user wants this agent to do <task>".

---

## Pre-warm and async re-fetch

A subtle but user-visible piece: the file index is a Rust-side data structure that can take 100ms–1s to build on first session start. Two mechanisms keep the `@` popup from blocking:

```javascript
// cli_inner_pretty.js:546419-546428
Hf.useEffect(() => {
  if (!I6()) PW$(ri);                          // prefetch the file index (skip on remote workspaces)
  return ri.indexBuildComplete.subscribe(() => {
    let WH = r.current;                         // last-issued search token
    if (WH === null) return;
    let mH = KH.current;                        // last trigger kind ("at" | "file" | "slash-template")
    if (mH === "slash-template") return;        // template flow has its own fetch path
    ((r.current = null), $H(WH, mH === "at"));  // re-issue with same trigger kind
  });
}, [$H]);
```

1. **Mount-time prefetch** (`PW$(ri)`): the index starts building as soon as the prompt input mounts, before the user types anything.
2. **Build-complete re-issue**: if the user typed `@ag` while the index was still building, the unified fetch returned with no file matches (just agents/MCP). When the index finishes, `indexBuildComplete` fires and the typeahead re-issues the latest search token, so the file matches *do* show up retroactively without the user touching anything.

This is the fix for "type `@readme.md` immediately on session start → no suggestions" — a hand-off that previously fell on the floor. **This mechanism is present in 2.1.88 already** (see `/lyz/codespace/3rd/claude-code/src/hooks/useTypeahead.tsx:494-505`). The 2.1.142 refinement is the *trigger-kind preservation* — 2.1.88's re-issue always re-fired with `(token, token === '')` (file-style), while 2.1.142 tracks whether the original fetch was an `@`-trigger (`KH.current === "at"`) and re-fires with the matching flag so the unified mode is preserved.

---

## Rendering — `+`, `◇`, `*` icons and the agent color

`SuggestionItemRow` (`gl1`) at cli_inner_pretty.js:179949 renders each row. The agent color from `getAgentColor` is forwarded into `<Text color={…}>`:

```javascript
// SuggestionItemRow excerpts (179949+)
let qH = K.id.startsWith("file-"),        // bool: is file
    a  = K.id.startsWith("mcp-resource-"),
    t  = K.id.startsWith("mcp-template-value::"),
    wH = K.id.startsWith("mcp-template::");
// ... if file or template, path-middle-truncate; if mcp resource, width-truncate to 30 ...
let zH = `${icon} ${o} – ${truncatedDesc}`;   // line content
// icon = Ul1(K.id):  "+" file | HL mcp-resource/template | "*" agent | "+" default

// Down at the unified-suggestion branch, color from item.color overrides:
let D = K.color || (A ? "suggestion" : void 0);  // <- only agents have a color set
```

`getAgentColor` (cli_inner_pretty.js:231351) maps an agent's `agentType` to a theme key (`red_FOR_SUBAGENTS_ONLY` … `cyan_FOR_SUBAGENTS_ONLY`) drawn from the eight-color palette `Nf` (`["red","blue","green","yellow","purple","orange","pink","cyan"]`). The map is keyed by `agentType` and managed by `BOH` (the `setAgentColor` setter — called when an agent is first registered or when the user issues `/color`). `general-purpose` is hard-wired to *no* color (return early at 231352) so the default agent doesn't burn a slot in the palette.

### Width math

```
column 1: icon (1 cell + space)
column 2: displayText, truncated to (term.cols * 0.4) or the column max, whichever smaller
column 3: " – " separator (3 cells)
column 4: description, truncated to remaining width using `truncateToWidth`
```

For unified suggestions (file, mcp, agent, template), the layout uses the inline form `+ AGENTS.md – description` rather than the padded two-column form used for commands. This matches the screenshot: each row is `icon SPACE displayText SPACE – SPACE description`, all wrapped to the terminal width with `wrap: "truncate"`.

---

## Diff vs. v2.1.88

Comparison against the readable 2.1.88 source at `/lyz/codespace/3rd/claude-code/src/hooks/unifiedSuggestions.ts` and `/lyz/codespace/3rd/claude-code/src/hooks/useTypeahead.tsx`:

| Behavior | v2.1.88 | v2.1.142 | Note |
|---|---|---|---|
| Source types in unified | file, mcp_resource, agent (3) | + mcp_resource_template (4) | Templates declared by MCP servers (`uriTemplate`) are now first-class suggestions |
| Template value resolution | n/a | `u28` (mcp-template-value::) | After picking a `mcp-template::`, the popup fetches arg-value completions from the server |
| Fuse keys | 5 (no uriTemplate) | 6 (+ uriTemplate, weight 2) | |
| MCP-resource score penalty | 0 | +0.15 | Demotes raw MCP resources below agents and templates when both fuzzy-match |
| `Nc6` arity | 4 params (query, mcpResources, agents, showOnEmpty) | 6 params (+ fileIndex, + mcpResourceTemplates) | The fileIndex parameter exists in 2.1.88 too but is global there |
| DM-name regex leading boundary | `(^|\s)@([\w-]*)$` | `(^|[\s。、？！])@([\w-]*)$` | CJK sentence punctuation now treated as a word boundary before `@` |
| HAS_AT_SYMBOL_RE leading boundary | `(^|\s)@…` | `(^|[\s。、？！])@…` | Same CJK widening |
| `K_H` (getCompletionToken) word boundary | `\s` only | CJK class | Same |
| Index-build re-fetch | `onIndexBuildComplete` re-fires file-only | `indexBuildComplete.subscribe` re-fires preserving trigger kind | 2.1.142 keeps the original `@`-vs-non-`@` mode on re-issue (`KH.current === "at"`) |
| Suggestion id prefixes | `file-`, `mcp-resource-`, `agent-` | + `mcp-template::`, `mcp-template-value::` | Routed through the same `createSuggestionFromSource` |
| `isRemoteWorkspace` short-circuit | partial | `I6()` is a primary gate: skips index, skips template fetch | Remote workspaces use RPC `cf5` instead |

The CJK boundary widening matches a class of v2.1.140+ fixes around CJK boundary calculation (see 02_ui changelog for `Fixed border-embedded text overflowing on CJK/emoji due to visual cell width miscalculation` in v2.1.139).

The MCP-resource penalty is the single line that gives agents priority in mixed queries. Before this, an installed MCP server with a `github://repos/agent-team` resource would rank above the `Plan` agent for `@ag`. After, `Plan` ranks first.

### Where the changelog mentions this code path

The 2.1.142 changelog has no entry that calls out @-mention behavior — agent suggestions in the unified popup are not a new feature. The two most-recent changelog entries about the file picker (`2.1.136: Fixed @ file picker not matching files created mid-session in small non-git directories` and `Fixed @-mention file picker not finding files in directories with more than 100 entries`) sit in the file-index pipeline that this popup consumes, not in the unified merge logic itself.

The 2.1.139 entry `Fixed MCP resources from disconnected servers lingering in @server: autocomplete` is downstream of the same popup: it fixed a state-cleanup issue in `state.mcp.resources` rather than the merge in `Nc6`.

---

## Reading order

1. **This file** — overall flow, `Nc6` + `QQ5` + the three branches in `fu4`, and the submit-time round-trip through `Bs7` / `_q5`.
2. [v2_1_142_subagent_matching.md](../30_agent_team/v2_1_142_subagent_matching.md) — how the `subagent_type` accepted at the Agent tool's call site resolves names case-/separator-insensitively. The `agentType` extracted from an `agent_mention` attachment flows into this matcher when the main loop responds to the meta-message.
3. [agent_identity_propagation.md](../30_agent_team/agent_identity_propagation.md) — `agentNameRegistry`, which feeds the *DM-style* `@name` suggestions when a subagent is running.
4. [list_mcp_resources.md](../04_tools/list_mcp_resources.md) and [read_mcp_resource.md](../04_tools/read_mcp_resource.md) — the MCP resource path; the popup shares its `state.mcp.resources` / `state.mcp.resourceTemplates` with these tools.

---

## Cross-validation notes (2026-05-27)

This document was originally drafted with one incorrect finding — that agent popup picks would leave a "dead" `@Plan (agent)` string in the prompt. Cross-validation against `cli_inner_pretty.js:398036-398051` (the `_q5` agent-mention processor) and `cli_inner_pretty.js:398387-398396` (the `Bs7` agent-mention parser) showed this was wrong: the popup's `@"<type> (agent)"` form is *purpose-built* for the parser, and the file parser at :398373 has an explicit `!endsWith(" (agent)")` guard to keep file mentions from claiming agent-shaped tokens. The doc has been corrected.

The doc was also originally claiming `indexBuildComplete.subscribe` was new in 2.1.142. It is not — both 2.1.88 (`useTypeahead.tsx:494-505`) and 2.1.142 (`cli_inner_pretty.js:546419-546428`) have the re-fetch wiring. The actual 2.1.142 refinement is that the re-issue preserves the `@`-vs-non-`@` trigger kind via `KH.current === "at"` rather than always re-firing in file-only mode. The diff table reflects this.

All other line ranges, regexes, constants, and Fuse weights have been verified verbatim against the source via `sed -n` reads.
