# Tool surface delta: 50 -> 65 entries (v2.1.193 -> v2.1.220)

**Bundles** (see [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §1): TARGET
`cli_inner_pretty.js` @ 2.1.220 (872,596 lines); BASELINE tagged `(193)`.

`assets/tools/_index.json` grew from **50** entries to **65**, with **zero removals**. That arithmetic
matters: nothing in the tool surface was retired across 25 releases; the surface only accreted. This
document establishes (a) which of the 15 new entries are real registered tools, (b) which are detector
artefacts, and (c) what actually changed in the **deferred-tool / ToolSearch** plumbing that decides
whether a tool's full schema is even sent to the model.

---

## 1. The 15 new index entries, individually verified

Every name below was counted with `grep -c -F '<name>' $T $B`. **All 13 distinct real names are
220>0 / 193=0** — this is one of the few clusters in the window where the raw asset diff does *not*
over-report.

| `_index.json` name | 220 | 193 | Registration / definition line read in 2.1.220 | Verdict |
|---|---|---|---|---|
| `EndConversation` | 7 | 0 | name const `:231369`; tool object `:413093`; registry `:425147`, list slot `:424991` | **NET_NEW** — see [`end_conversation_tool.md`](end_conversation_tool.md) |
| `ReportFindings` | 1 | 0 | name const `:403821`; tool object `:403878`; description `:403823`; `searchHint` `:403879` | **NET_NEW** — see [`web_and_misc_tools_deltas.md`](web_and_misc_tools_deltas.md) §3 |
| `SearchMcpRegistry` | 7 | 0 | `SEARCH_MCP_REGISTRY_TOOL_NAME` `:512961`; instance `:425136`; `searchHint` `:408152` | **NET_NEW** (mcp) |
| `SuggestConnectors` | 5 | 0 | `SUGGEST_CONNECTORS_TOOL_NAME` `:512962`; instance `:425138`; `searchHint` `:408229` | **NET_NEW** (mcp) |
| `ListConnectors` | 5 | 0 | `LIST_CONNECTORS_TOOL_NAME` `:512963`; instance `:425139`; `searchHint` `:408316` | **NET_NEW** (mcp) |
| `RefreshMcpTools` | 3 | 0 | `searchHint` `:405759`; registry slot `:424999`, **env-gated** | **NET_NEW** (mcp) |
| `propose_skills` | 3 | 0 | `ProposeSkillsTool` `:425143`; list slot `:424989` (unconditional); `searchHint` `:409194` | **NET_NEW** (skills) |
| `SuggestSkills` | 4 | 0 | `searchHint` `:408941`; `shouldDefer` getter `:408943` | **NET_NEW** (claude.ai surface) |
| `SuggestPluginInstall` | 6 | 0 | `searchHint` `:408902` | **NET_NEW** (plugins) |
| `SendFile` | 10 | 0 | `searchHint` `:419038` (`"send files to another Claude Code session"`) | **NET_NEW** |
| `SendFeedback` | 6 | 0 | `searchHint` `:404725` (`"draft product feedback bug report queue"`) | **NET_NEW** |
| `ObserverReport` | 8 | 0 | (`searchHint: null` in the index — description-only tool) | **NET_NEW** (observer agents) |
| `ClaudeDesign` | 24 | 0 | `searchHint` `:411815`; sibling `DesignSync` instance `:425141` | **NET_NEW** (claude.ai/design) |
| `<unknown>` ×2 | — | — | `:408721` and `:408786` — see §2 | **DETECTOR ARTEFACT over real tools** |

Arithmetic check: 13 distinct real names + 2 `<unknown>` rows = **15 new entries**; 50 + 15 = 65. ✔

### 1.1 Which of them can actually appear in a CLI session

Presence in `assets/tools/` proves the *code* is bundled, not that the tool is *offered*. The registry
builder is one array literal, `:424940-425002`, and the guards are visible in it:

```javascript
// ============================================
// buildToolRegistry (tail) - the conditional slots that decide which new tools are offered
// Location: cli_inner_pretty.js:424979-425002
// ============================================

// ORIGINAL (for source lookup):
    _wd,
    ...(_Rd ? [_Rd] : []),
    ...(bRd ? [bRd] : []),
    ...(SRd ? [SRd] : []),
    fAd,
    ...(ERd ? [ERd] : []),
    ...FJy,
    ...(vRd ? [vRd] : []),
    HAd,
    BJy,
    UJy,
    ...(ARd ? [ARd] : []),
    ...(wRd ? [wRd] : []),
    ...
    ...(Z.CLAUDE_CODE_ENABLE_REFRESH_MCP_TOOLS ? [KOs] : []),
    ...(o4() ? [Han] : []),
    Ntd,
  ];

// READABLE (for understanding):
    todoWriteTool,
    ...(remoteTriggerTool ? [remoteTriggerTool] : []),
    ...(searchMcpRegistryTool ? [searchMcpRegistryTool] : []),   // bRd, bound at :425136
    ...(suggestConnectorsTool ? [suggestConnectorsTool] : []),    // SRd, :425138
    lspTool,
    ...(listConnectorsTool ? [listConnectorsTool] : []),          // ERd, :425139
    ...pluginSkillTools,
    ...(monitorTool ? [monitorTool] : []),
    pushNotificationTool,
    sendUserFileTool,
    proposeSkillsTool,                                           // UJy, :425143 - UNCONDITIONAL
    ...(pushNotificationTool2 ? [pushNotificationTool2] : []),
    ...(endConversationTool ? [endConversationTool] : []),        // wRd, :425147
    ...
    ...(env.CLAUDE_CODE_ENABLE_REFRESH_MCP_TOOLS ? [refreshMcpToolsTool] : []),
    ...(isToolSearchEnabled() ? [toolSearchTool] : []),
    deferredPlaceholderOrLast,
  ];

// Mapping: bRd→searchMcpRegistryTool, SRd→suggestConnectorsTool, ERd→listConnectorsTool,
//          UJy→proposeSkillsTool, wRd→endConversationTool, KOs→refreshMcpToolsTool,
//          Han→toolSearchTool, o4→isToolSearchEnabled, Z→envAccessor
```

Two things to take away:

1. The `...(X ? [X] : [])` slots are **module-binding** guards, not feature gates. `bRd`/`SRd`/`ERd`/
   `wRd` are assigned at `:425136-425147` from lazily-required modules; if the module is absent from a
   build variant the slot collapses. The *behavioural* gating lives inside each tool's `isEnabled()`
   (EndConversation's is a four-layer check — [`end_conversation_tool.md`](end_conversation_tool.md)).
2. `RefreshMcpTools` is the only new tool behind a plain env var: **`CLAUDE_CODE_ENABLE_REFRESH_MCP_TOOLS`
   (220=2 / 193=0)**. It is off unless you set it. So a user who greps `assets/tools/` and expects to see
   `RefreshMcpTools` offered will not find it in a default session.

---

## 2. The two `<unknown>` rows are real tools with template-literal names

Ground truth §5 warns that `<unknown>` / `_unknown_` / `eval_registered________` / `explain_command` /
`mcp` are detector noise. That is correct as far as it goes, but for the two `<unknown>` rows the noise
has a *specific and interesting* cause worth recording, because the same mechanism will keep producing
`<unknown>` rows in future builds.

Their `searchHint` values in `_index.json` are `"list the user's enabled claude.ai ${...}s"` and
`"discover claude.ai ${...}s by keyword"`. Grepping those in the bundle lands on:

```
:408721   searchHint: `list the user's enabled claude.ai ${e.noun}s`,
:408786   searchHint: `discover claude.ai ${e.noun}s by keyword`,
```

Both are inside a **tool factory** parameterised by a descriptor `e` carrying a `noun`. The tool's
`name` is therefore a template expression too, which is why the asset extractor — which pattern-matches
string literals — emits `<unknown>`. So: two genuinely registered tools whose names are computed at
construction time (the claude.ai *skills* and *connectors* listing/discovery pair, judging from the
neighbouring `SuggestSkills` `:408941` and `SuggestPluginInstall` `:408902` entries). Treat them as real,
but do not invent names for them: the bundle does not contain their names as literals.

The other four noise names (`_unknown_`, `eval_registered________`, `explain_command`, `mcp`) have no
`searchHint` anchor and no registry slot; leave them alone.

---

## 3. The deferred-tool machinery: mostly carryover, with one important addition

The "deferred tool" design is what keeps a 65-tool surface affordable: most tools are advertised to the
model as **name + one-line hint only**, and the model must call `ToolSearch` to pull the full schema
before it can invoke them. It is easy to mistake this whole system for new in 2.1.220 (the tool count
jumped, `ToolSearch` is prominent in the system prompt, and there are four new `tengu_defer*` gates).
It is not. Here is the honest split.

### 3.1 CARRYOVER: the deferral predicate is structurally byte-identical

```javascript
// ============================================
// isDeferredTool - decides whether a tool is advertised by name+hint only
// Location: cli_inner_pretty.js:231912-231926
// ============================================

// ORIGINAL (for source lookup):
function r7(e) {
  if (e.alwaysLoad === !0) return !1;
  if (Oxu().includes(e.name)) return !1;
  if (e.isMcp === !0) return !0;
  if (e.name === Zv) return !1;
  if (e.name === qo) { if ((fct(), en(EPu)).isForkSubagentEnabled()) return !1; }
  if (e.name === Dty) return !1;
  if (e.name === Pty) return !1;
  if (e.name === mee && hYt()) return !1;
  if (e.name === Fg && UVe()) return !1;
  if (e.name === xpe && process.env.CLAUDE_CODE_SESSION_KIND === "bg") return !1;
  return e.shouldDefer === !0;
}

// READABLE (for understanding):
function isDeferredTool(tool) {
  if (tool.alwaysLoad === true) return false;              // explicit opt-out wins
  if (alwaysLoadedToolNames().includes(tool.name)) return false;
  if (tool.isMcp === true) return true;                    // ALL MCP tools defer, unconditionally
  if (tool.name === TOOL_SEARCH_TOOL_NAME) return false;   // the loader can never be deferred
  if (tool.name === AGENT_TOOL_NAME) { if (isForkSubagentEnabled()) return false; }
  if (tool.name === deferExemptA) return false;
  if (tool.name === deferExemptB) return false;
  if (tool.name === toolC && predicateC()) return false;
  if (tool.name === toolD && predicateD()) return false;
  if (tool.name === toolE && process.env.CLAUDE_CODE_SESSION_KIND === "bg") return false;
  return tool.shouldDefer === true;                        // per-tool declaration
}

// Mapping: r7→isDeferredTool, Zv→TOOL_SEARCH_TOOL_NAME ("ToolSearch", :121281),
//          qo→AGENT_TOOL_NAME, Oxu→alwaysLoadedToolNames
```

The 2.1.193 counterpart is `Tj` at `:230406-230420 (193)` and it has the **same ten branches in the same
order**, differing only in mangled identifiers. Corroborating counts:

| Anchor | 220 | 193 | Reading |
|---|---|---|---|
| `shouldDefer` | 38 | 29 | +9 — new *tools declaring* deferral, not new machinery |
| `coarseParts` (ToolSearch scorer internals) | 6 | 6 | pure carryover |
| `select:<tool_name>` (ToolSearch prompt) | 1 | 1 | pure carryover |
| `Deferred tools appear by name in` (prompt text) | 1 | 1 | pure carryover |
| `searchHint` | 69 | 54 | +15 — exactly matches +15 tool entries |
| `tool_search_server` | 3 | 3 | pure carryover |
| `defer_loading` (wire field) | 15 | 8 | +7, see §3.2/§3.3 |

**The `+15 searchHint` / `+15 tool entries` coincidence is the cleanest single statement of what happened
to the tool surface in this window: fifteen new tools were added, each declaring one search hint, into an
unchanged deferral framework.**

The ToolSearch relevance scorer (`$Td`, `:405899-405967`) is also carryover, but it is worth documenting
because nothing else in the tree does, and its constants explain observed ranking behaviour:

- Exact case-insensitive name match short-circuits to a single result (`:405901-405902`).
- An `mcp__`-prefixed query does prefix matching over MCP tools only (`:405903-405909`).
- Terms prefixed with `+` become **required** filters (`a`), the rest are ranked terms (`l`) — `:405913-405916`.
- Scoring per term (`:405951-405957`): exact token hit **10** (MCP: **12**); substring token hit **5**
  (MCP: **6**); coarse-name exact **10**/**12**; coarse substring **3**/**4**; whole-name substring **3**
  but only if nothing else scored; `searchHint` word-boundary hit **+4**; full-description hit **+2**.

The MCP bonus (12 vs 10, 6 vs 5) is the design decision: MCP tool names are namespaced
(`mcp__server__tool`) and split on `[\s_.]+`, so their tokens are noisier; the bonus keeps a
deliberately-named MCP tool from being buried under built-ins that coincidentally share a token.
Note `searchHint` outranks the full description 4:2 — the hint is authored for retrieval, the
description for use.

### 3.2 NET_NEW: `DeferredToolPlaceholder`

This is the one genuinely new piece of deferred-tool machinery, and its purpose is subtle.

```javascript
// ============================================
// buildDeferredToolPlaceholder - a no-op tool whose only job is to keep defer_loading present
// Location: cli_inner_pretty.js:508596-508606
// ============================================

// ORIGINAL (for source lookup):
function ptp() {
  try {
    if (w_e()) return null;
    let e = jbi();
    if (e === null) ((e = Ke("tengu_deferred_stub_tool", !0)), Gbi(e));
    if (!e) return null;
    return { name: jQt, description: $Jn, input_schema: { type: "object", properties: {} }, defer_loading: !0 };
  } catch (e) {
    return (xe(e), null);
  }
}

// READABLE (for understanding):
function buildDeferredToolPlaceholder() {
  try {
    if (isExperimentalBetasDisabled()) return null;            // :109341 - env kill switch or HIPAA
    let latched = getDeferredToolStubGateLatch();               // :2783 - session-scoped memo
    if (latched === null) {
      latched = getFeatureValue("tengu_deferred_stub_tool", true);   // default ON
      setDeferredToolStubGateLatch(latched);                    // :2786 - latch for the session
    }
    if (!latched) return null;
    return {
      name: "DeferredToolPlaceholder",                          // jQt, :121282
      description: "Reserved placeholder that keeps deferred tool loading active; never call this tool.",
      input_schema: { type: "object", properties: {} },
      defer_loading: true,
    };
  } catch (err) { return (reportError(err), null); }
}

// Mapping: ptp→buildDeferredToolPlaceholder, w_e→isExperimentalBetasDisabled,
//          jbi→getDeferredToolStubGateLatch, Gbi→setDeferredToolStubGateLatch,
//          Ke→getFeatureValue, jQt→DEFERRED_PLACEHOLDER_NAME, $Jn→DEFERRED_PLACEHOLDER_DESCRIPTION
```

Counts: `DeferredToolPlaceholder` **220=1 / 193=0**; its description string **220=1 / 193=0**;
`tengu_deferred_stub_tool` **220=1 / 193=0**.

### The placeholder-tool decision

**What it does:** injects a permanently-uncallable tool carrying `defer_loading: true` into every
request, so that the request's tool array always contains at least one deferred tool.

**How it works:**
1. `w_e()` (`:109341`) is checked *first*: `Z.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS || iY("hipaa")`.
   Under HIPAA or with betas disabled the placeholder is never emitted — consistent with `qLo`
   (`:508202-508215`), which strips every non-baseline field (`strict`, `eager_input_streaming`,
   `defer_loading`) from tool schemas in that mode.
2. The gate value is read **once per session** and latched into module state (`Ot.deferredToolStubGateLatch`,
   `:2783`/`:2786`). Default `true`.
3. The returned object is minimal: empty `properties`, a description that instructs the model never to
   call it.

**Why this approach:** the server enables the *tool-search server-side beta* per request based on whether
any tool carries `defer_loading`. If a session happens to have no deferred tools — because MCP is absent,
`shouldDefer` tools were filtered by permissions, and the always-load list covers the rest — the flag
disappears from the request, the beta flips off mid-conversation, and **the prompt cache breaks**. The
placeholder pins the flag. The corroborating evidence is a diagnostic string added in the same window:

```
:327222   m.push("defer_loading presence flipped (deferred-tool hint section, inc-5316)");
```

`inc-5316` is an incident reference (`deferLoadingPresenceChanged` 220=3 / 193=0; `inc-5316`
220=1 / 193=0; `anyDeferLoading` 220=6 / 193=0). The prompt-cache-break analyser at `:327200-327235`
now names "defer_loading presence flipped" as a distinct cause, and `:509545` computes it:

```javascript
let Ho = ee.filter((Pn) => !("defer_loading" in Pn && Pn.defer_loading));   // :509545
xsd({ system: ce, toolSchemas: Ho, anyDeferLoading: Ho.length !== ee.length, ... });
```

i.e. the cache fingerprint is taken over the **non-deferred** schemas plus a single boolean for "any
deferred at all". Deferred tools are excluded from the fingerprint (their descriptions are hints, not
schemas), so the only way deferral can break the cache is the boolean flipping — which is exactly what
the placeholder prevents.

**Trade-off:** one wasted tool slot and ~15 tokens per request, versus a full prompt-cache miss (tens of
thousands of tokens) whenever the deferred set empties. The asymmetry is enormous, which is why this
shipped as a hack rather than a refactor.

**Key insight:** the placeholder is not a feature — it is a **cache-stability shim**, and its existence
is proof that `defer_loading` is part of the server-side cache key.

### 3.3 The Foundry escape hatch: `defer_loading` gets stripped, and the placeholder gets deleted

Azure AI Foundry deployments may not support the tool-search server extension. `D2c`
(`:121340-121369`) rewrites the tool array on the way out:

```javascript
// ============================================
// stripFoundryUnsupportedToolFields - removes defer_loading/strict on deployments that reject them
// Location: cli_inner_pretty.js:121340-121369
// ============================================

// ORIGINAL (for source lookup):
function D2c(e, t) {
  if (Hn() !== "foundry") return e;
  let r = tNr(); if (r.size === 0) return e;
  let n = r.get(l6i(t)); if (!n || n.size === 0) return e;
  let o = n.has("tool_search_server") || n.has("tool_search"), i = n.has("structured_outputs");
  if (!o && !i) return e;
  let s = !1, a = [];
  for (let l of e) {
    let c = o && l.defer_loading;
    if (c && l.name === jQt && l.description === $Jn) { s = !0; continue; }
    let u = i && l.strict;
    if (!c && !u) { a.push(l); continue; }
    s = !0;
    let d = { ...l };
    if (c) delete d.defer_loading;
    if (u) delete d.strict;
    a.push(d);
  }
  return s ? a : e;
}

// READABLE (for understanding):
function stripFoundryUnsupportedToolFields(toolSchemas, model) {
  if (currentProvider() !== "foundry") return toolSchemas;
  let unsupportedByDeployment = foundryCapabilityBlocklist();
  if (unsupportedByDeployment.size === 0) return toolSchemas;
  let missing = unsupportedByDeployment.get(foundryDeploymentKey(model));
  if (!missing || missing.size === 0) return toolSchemas;
  let dropDefer  = missing.has("tool_search_server") || missing.has("tool_search"),
      dropStrict = missing.has("structured_outputs");
  if (!dropDefer && !dropStrict) return toolSchemas;
  let changed = false, out = [];
  for (let schema of toolSchemas) {
    let deferDoomed = dropDefer && schema.defer_loading;
    if (deferDoomed && schema.name === DEFERRED_PLACEHOLDER_NAME
                    && schema.description === DEFERRED_PLACEHOLDER_DESCRIPTION) {
      changed = true; continue;                       // the placeholder is DELETED, not downgraded
    }
    let strictDoomed = dropStrict && schema.strict;
    if (!deferDoomed && !strictDoomed) { out.push(schema); continue; }
    changed = true;
    let copy = { ...schema };
    if (deferDoomed) delete copy.defer_loading;       // real tools become fully-loaded instead
    if (strictDoomed) delete copy.strict;
    out.push(copy);
  }
  return changed ? out : toolSchemas;
}

// Mapping: D2c→stripFoundryUnsupportedToolFields, Hn→currentProvider,
//          tNr→foundryCapabilityBlocklist, l6i→foundryDeploymentKey,
//          jQt/$Jn→DEFERRED_PLACEHOLDER_NAME/_DESCRIPTION
```

The asymmetry in the loop is the point: a **real** deferred tool loses only its `defer_loading` flag
(so the model still gets it, just eagerly), whereas the **placeholder** is removed entirely — with
`defer_loading` gone it would be a callable no-op tool inviting a wasted turn. `foundry-capability-strip`
is 220=1 / 193=1, so the stripping machinery itself is carryover; the placeholder special-case at
`:121353` is what is new.

Note also the blocklist is *learned*: `NJn` (`:121333-121339`) parses Foundry's 400-error text
(`/([a-z0-9_, ]+?)\s+not supported in your workspace/i`, `:121383) and records the capability per
deployment (`c6i`, `:121308-121317`), warning once. The client discovers deployment limits by being
refused, then adapts — a design worth noting because it means the first request of a session on a
restricted Foundry deployment is *expected* to fail.

### 3.4 `searchHint` doubles as a token-saving description substitute

```javascript
// ============================================
// resolveToolDescriptionForApi - prefers the one-line searchHint in lean mode
// Location: cli_inner_pretty.js:508141-508153
// ============================================

// ORIGINAL (for source lookup):
async function $O_(e, t) {
  if (!yqs()) return e.prompt(t);
  if (e.searchHint) return e.searchHint;
  let r = await e.prompt(t);
  return (Wi(r, `\n\n`).trim() || r);
}

// READABLE (for understanding):
async function resolveToolDescriptionForApi(tool, options) {
  if (!isSimpleMode()) return tool.prompt(options);        // yqs() === Z.CLAUDE_CODE_SIMPLE, :507686
  if (tool.searchHint) return tool.searchHint;             // one line instead of a multi-KB prompt
  let full = await tool.prompt(options);
  return firstParagraph(full).trim() || full;              // fallback: first paragraph only
}

// Mapping: $O_→resolveToolDescriptionForApi, yqs→isSimpleMode, Wi→splitOnFirst
```

`CLAUDE_CODE_SIMPLE` is **220=18 / 193=18** — carryover — so this is not a new mechanism either, but it
is the reason every one of the 15 new tools declares a `searchHint`: the hint is load-bearing in two
independent paths (ToolSearch ranking, §3.1; lean-mode description, here). A new tool that omits it
degrades both.

### 3.5 CORRECTION to the seed brief: `tengu_defer_cap_*` has nothing to do with deferred tools

The assignment suggested chasing `tengu_defer_cap_ms` / `tengu_defer_cap_refused_queued` /
`tengu_defer_cap_refused_restartable` as deferred-tool machinery. **They are not.** All three are
220=1 / 193=0 and all three live in one place, `:823518-823556`, inside the left-arrow
"open the agents view" handler:

```
:823508   let Pg = Nl.via === "abort-then-fork" && !wp ? "defer-then-fork" : Nl.via,
:823520   o8 = Ke("tengu_defer_cap_ms", 1e4) ?? 1e4,
:823527   if (CC > 0) O("tengu_defer_cap_refused_queued", { queue_len: CC, wait_ms: Date.now() - yS });
:823533   O("tengu_defer_cap_refused_restartable", { restartable_count: tL, ... }), Co(ukd(tL)));
```

"Defer" here means *defer the fork of the session until in-flight work settles*, capped at 10 s
(`tengu_defer_cap_ms`, default `1e4`), then abort-and-fork anyway (`deferCapFired: !0`, `:823552`).
It belongs to `36_background_agents`, not to tools. Recording this explicitly because the name
collision is exactly the kind of thing that produces a fabricated section.

---

## 4. Per-tool metadata worth knowing when reading `_index.json`

`_index.json` carries `isReadOnly` / `isConcurrencySafe` / `descriptionLen` / `promptLen` per entry.
Two entries in the new set are informative:

- **`EndConversation`**: `isReadOnly: true`, `isConcurrencySafe: false`. Read-only is honest (it writes
  no file the model can observe) yet it is the most destructive tool in the set — a reminder that
  `isReadOnly` in this codebase means "does not modify the workspace", not "is safe". The
  `isConcurrencySafe: false` is what actually matters: it forces serial dispatch so the abort cannot
  race sibling tool calls. Source: `:413118-413123`.
- **`ReportFindings`**: `maxResultSizeChars: 256` (`:403880`) — by far the smallest cap in the surface,
  because the payload is echoed for the host UI and the model must not re-read its own findings back as
  context. Compare `Grep` at `20000` (`:312105`), `Read`/`Write`/`Glob`/`NotebookEdit`/`AskUserQuestion`
  at `1e5` (`:310967`, `:311377`, `:311872`, `:314860`, `:323351`) and `EndConversation` at `1e4`
  (`:413098`).

---

## 5. Verdict summary

| Claim | Verdict |
|---|---|
| 15 new tool entries, 0 removals | **CONFIRMED** (`_index.json` 65 vs 50) |
| 13 distinct new tool names are real | **CONFIRMED** — all 220>0 / 193=0 with a registration line read |
| The two `<unknown>` rows are noise | **PARTIALLY** — extractor artefacts over *real* factory-built tools (`:408721`, `:408786`) |
| The deferred-tool / ToolSearch system is new | **FALSE — carryover.** `isDeferredTool` is structurally identical to 193 `:230406 (193)`; the scorer, prompt and `tool_search_server` literal are all unchanged |
| `DeferredToolPlaceholder` is new | **CONFIRMED** (220=1 / 193=0) and it is a prompt-cache shim, not a feature |
| `tengu_defer_cap_*` is deferred-tool machinery | **FALSE** — it is the agents-view fork deferral cap |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New rows for this window are staged in
> [symbol_additions_v2_1_220_tools.md](../00_overview/symbol_additions_v2_1_220_tools.md).

Key functions in this document:
- `isDeferredTool` (`r7`) - ten-branch deferral predicate, carryover from 193 `Tj`
- `buildDeferredToolPlaceholder` (`ptp`) - emits `DeferredToolPlaceholder` to pin `defer_loading`
- `getDeferredToolStubGateLatch` / `setDeferredToolStubGateLatch` (`jbi` / `Gbi`) - session latch for `tengu_deferred_stub_tool`
- `stripFoundryUnsupportedToolFields` (`D2c`) - drops `defer_loading`/`strict`, deletes the placeholder
- `parseFoundryUnsupportedCapabilities` (`L2c`) / `recordFoundryUnsupported` (`c6i`) - learn deployment limits from 400 text
- `resolveToolDescriptionForApi` (`$O_`) - `searchHint`-as-description under `CLAUDE_CODE_SIMPLE`
- `serializeToolForApi` (`qLo`) - builds the wire schema, applies `defer_loading` / `strict` / `eager_input_streaming`
- `scoreToolsForSearch` (`$Td`) - ToolSearch ranking, `+`-required terms, MCP token bonus
- `isExperimentalBetasDisabled` (`w_e`) - HIPAA / `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` kill switch
- `isSimpleMode` (`yqs`) - `CLAUDE_CODE_SIMPLE`
- `isToolSearchEnabled` (`o4`) - ToolSearch availability with optimistic-mode logging
