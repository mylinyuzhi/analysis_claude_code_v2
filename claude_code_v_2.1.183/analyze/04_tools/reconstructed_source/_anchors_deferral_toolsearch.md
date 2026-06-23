# Anchors: Deferred-Tool Loading + ToolSearch Tool (v2.1.183)

> Scout dossier. Sole input for the reconstruction phase. Every decl/branch/gate/string a
> reconstructor needs is below with a `cli_inner_pretty.js` line anchor in the **2.1.183** bundle
> (`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`).
>
> Mirrors 2.1.156 `04_tools/deferred_tools.md` + `tool_search.md`. The 2.1.156 readable names are
> reused; the 2.1.183 obfuscated ids were **re-derived by string-anchoring in this bundle** (never
> copied). Anchored on: `defer_loading`, `ToolSearch`, `tool_reference`, `select:`,
> `InputValidationError`, `Fetches full schema definitions for deferred tools`,
> `tengu_deferred_tools_pool_change`, `preCompactDiscoveredTools`, `tengu_non_deferrable_builtins`.

---

## 0. Obfuscation map (2.1.156 readable → 2.1.183 obf id)

| Readable | 2.1.156 obf | 2.1.183 obf | Line(s) | Kind |
|----------|-------------|-------------|---------|------|
| `isDeferredTool` | `pp` | `G2` | 222307-222321 | function |
| `formatDeferredToolLine` | `PG6` | `k5r` | 222322-222324 | function |
| `getPrompt` (ToolSearch desc) | `r18` | `own` | 222325-222327 | function |
| `TOOL_SEARCH_TOOL_NAME` | `l3` | `DA` | 221267 | const = "ToolSearch" |
| `getNonDeferrableBuiltins` | — (NEW) | `c1i` | 221201-221217 | function |
| `ToolSearchTool` (object) | `wV$` | `IMt` | 230417-230637 | object |
| `inputSchema` | `wf4` | `pUi` | 230381-230388 | lazy schema |
| `outputSchema` | `Df4` | `fUi` | 230389-230396 | lazy schema |
| `getToolDescriptionMemoized` | `pZ8` | `oCn` | 230397-230416 | memoized fn |
| `getDeferredToolsCacheKey` | `Uy_` | `eId` | 230257-230262 | function |
| `maybeInvalidateCache` | `Of4` | `cUi` | 230263-230266 | function |
| `clearToolSearchDescriptionCache` | `Fy_` | `tId` | 230267-230269 | function |
| `buildSearchResult` | `reH` | `gnt` | 230270-230272 | function |
| `parseToolName` | `Mf4` | `uUi` | 230273-230288 | function |
| `compileTermPatterns` | `Qy_` | `nId` | 230289-230293 | function |
| `searchToolsWithKeywords` | `jf4` | `dUi` | 230294-230362 | async function |
| `getDeferredToolsDelta` | `tg6` | `Qgo` | 462347-462403 | function |
| `extractDiscoveredToolNames` | `P8H` | `eX` | 462320-462346 | function |
| `summarizeByServerPrefix` | `J08` | `xWn` | 462404-462413 | function |
| `isToolReferenceBlock` | `$s` | `rne` | 462304-462306 | function |
| `isToolReferenceBlockWithName` | (inline) | `f3p` | 462307-462309 | function |
| `isToolResultBlockWithContent` | (inline) | `m3p` | 462310-462318 | function |
| `isToolSearchEnabledOptimistic` | `wE` | `fR` | 221224-221252 | function |
| `modelSupportsToolReference` | `k5H` | `f7` | 221218-221223 | function |
| `getUnsupportedModelsList` | (inline) | `ovd` | 221194-221200 | function |
| `getToolSearchMode` | `Pc6` | `PPt` | 221183-221193 | function |
| `isToolSearchEnabled` | `Dv$` | `J4t` | 462248-462303 | async function |
| `checkAutoThreshold` | (helpers) | `A3p` | 462415-462434 | async function |
| `isToolSearchToolAvailable` | `$RH` | `gLe` | 462232 | function |
| `undiscoveredToolHint` | `zS_` | `G$p` | 437133-437148 | function |
| `getToolSearchBeta` | `oEK` | `wti` | 134585-134589 | function |
| `getAPIProvider` | `Zq` | `Ir`/`_y` | (used 134586, 582432) | function |
| `MCP_WAIT_BUDGET_MS` (5000) | `py_` | `ZCd` | 230365 | const |
| `DEFERRED_DELTA_LIST_CAP` (30) | `$qH` | `Sae` | 462436 | const |
| `AMBIENT_CONTEXT_NOTE` | `yT8` | `_7n` | (pushed 589489) | const |
| `ADVANCED_TOOL_USE_BETA` | `V76` | `cCr` | 101569 | const |
| `TOOL_SEARCH_TOOL_BETA` | `XY$` | `JTt` | 101570 | const |
| `stripMcpServerPrefix` | `u9` | `oc` | (used 230477) | function |
| `escapeRegExp` | `vR` | `q0` | (used 230461,230291) | function |
| `getMcpInfo` | `UR` | `kk` | (used 230275) | function |
| `findToolByName` | `W9` | `vl` | (used 230546) | function |
| `buildToolSchema` | `w08` | `CWn` | 582444 | function |
| `shouldDeferLspTool` | `RLz` | `cbf` | (used 582438) | function |
| `toolMatchesName` | `h1` | `Rc` | (used 582424) | function |
| `wrapAsSystemReminder` | `C_` | `Jp` | (used 589503) | function |
| `makeMetaMessage` | `T8` | `Rn` | (used 589504) | function |
| `logEvent` | `d` | `G` | (used widely) | function |
| `uniq` | `aq` | `ms` | (used 462377) | function |

**NEW symbols in 2.1.183 (no 2.1.156 equivalent):**
- `getNonDeferrableBuiltins` (`c1i`, 221201) — new ladder rule
- `tool_search_usage_reminder` builder (`wtl`, 465778) + turn-counter (`C4p`, 465755)
- `getToolSearchReminderConfig` (`B1r`, 147785) + master config (`Dkt`, 147759)
- `toolSearchFetchRule` gate (`qmi`, 147794) — gates new prompt variant
- ToolSearch prompt-tail variant `Lvd` (222334)

---

## 1. `isDeferredTool` ladder — `G2` (222307-222321) — TWO new rules + reorder

```javascript
// ============================================
// isDeferredTool - decide whether a tool ships name-only (defer_loading) or full-schema
// Location: cli_inner_pretty.js:222307-222321
// ============================================

// ORIGINAL (for source lookup):
function G2(e) {
  if (e.alwaysLoad === !0) return !1;
  if (c1i().includes(e.name)) return !1;                  // NEW in 2.1.183 — non-deferrable builtins gate
  if (e.isMcp === !0) return !0;
  if (e.name === DA) return !1;                           // ToolSearch
  if (e.name === vs) {                                    // Agent
    if ((MCe(), ro(D1i)).isForkSubagentEnabled()) return !1;
  }
  if (e.name === Cvd) return !1;                          // BRIEF_TOOL_NAME
  if (e.name === Ivd) return !1;                          // SEND_USER_FILE_TOOL_NAME
  if (e.name === G9 && wen()) return !1;                  // NEW — PushNotification + remote_trigger entrypoint
  if (e.name === $g && jAe()) return !1;                  // ScheduleWakeup + kairos-loop-dynamic
  if (e.name === WAe && process.env.CLAUDE_CODE_SESSION_KIND === "bg") return !1;  // EnterWorktree in bg
  return e.shouldDefer === !0;
}

// READABLE (for understanding):
function isDeferredTool(tool) {
  if (tool.alwaysLoad === true) return false;                                          // 1
  if (getNonDeferrableBuiltins().includes(tool.name)) return false;                    // 2 NEW
  if (tool.isMcp === true) return true;                                                // 3
  if (tool.name === TOOL_SEARCH_TOOL_NAME) return false;                               // 4
  if (tool.name === AGENT_TOOL_NAME && loadForkSubagentMod().isForkSubagentEnabled()) return false; // 5
  if (tool.name === BRIEF_TOOL_NAME) return false;                                     // 6
  if (tool.name === SEND_USER_FILE_TOOL_NAME) return false;                            // 7
  if (tool.name === PUSH_NOTIFICATION_TOOL_NAME && isRemoteTriggerEntrypoint()) return false; // 8 NEW
  if (tool.name === SCHEDULE_WAKEUP_TOOL_NAME && isKairosLoopDynamicEnabled()) return false;   // 9
  if (tool.name === ENTER_WORKTREE_TOOL_NAME && process.env.CLAUDE_CODE_SESSION_KIND === "bg") return false; // 10
  return tool.shouldDefer === true;                                                    // 11
}

// Mapping: G2→isDeferredTool, c1i→getNonDeferrableBuiltins, DA→TOOL_SEARCH_TOOL_NAME, vs→AGENT_TOOL_NAME,
//          Cvd→BRIEF_TOOL_NAME, Ivd→SEND_USER_FILE_TOOL_NAME, G9→PUSH_NOTIFICATION_TOOL_NAME, wen→isRemoteTriggerEntrypoint,
//          $g→SCHEDULE_WAKEUP_TOOL_NAME, jAe→isKairosLoopDynamicEnabled, WAe→ENTER_WORKTREE_TOOL_NAME
```

**Resolved name constants & gates (each Read-verified):**
- `DA = "ToolSearch"` (221267, const)
- `vs = "Agent"` (149939, const)
- `Cvd` = `BRIEF_TOOL_NAME` — assigned at 222350: `Cvd = (F2(), ro(xCe)).BRIEF_TOOL_NAME`
- `Ivd` = `SEND_USER_FILE_TOOL_NAME` — assigned at 222350: `Ivd = ro(QTn).SEND_USER_FILE_TOOL_NAME`
- `G9 = "PushNotification"` (220751, const)
- `$g = "ScheduleWakeup"` (220800, const)
- `WAe = "EnterWorktree"` (221266, const)
- `wen()` → `process.env.CLAUDE_CODE_ENTRYPOINT === "remote_trigger"` (43733-43735)
- `jAe()` → `ct("tengu_kairos_loop_dynamic", !1)` (221035-221037) — GrowthBook gate

### Rule 2 NEW — `getNonDeferrableBuiltins` (`c1i`, 221201-221217)

```javascript
// ============================================
// getNonDeferrableBuiltins - dynamic exempt list of builtins that must never defer
// Location: cli_inner_pretty.js:221201-221217
// ============================================

// ORIGINAL (for source lookup):
function c1i() {
  let e = new Set();
  try {
    let t = ct("tengu_non_deferrable_builtins", null);             // GrowthBook gate
    if (Array.isArray(t)) { for (let n of t) if (typeof n === "string") e.add(n); }
  } catch {}
  try {
    let t = wt().clientDataCache?.non_deferrable_builtins;         // server clientData override
    if (Array.isArray(t)) { for (let n of t) if (typeof n === "string") e.add(n); }
  } catch {}
  if (e.size === 0) return svd;                                    // svd = [] (default empty)
  return [...e];
}

// Mapping: c1i→getNonDeferrableBuiltins, ct→getFeatureGateValue, wt→getClientConfig, svd→EMPTY_NON_DEFERRABLE(=[])
```

- `svd = []` set at 221264 (in the `m7` init block, 221256-221265). Default = no exemptions.
- Anchors: `tengu_non_deferrable_builtins` (221204), `non_deferrable_builtins` (221210).
- **NEW in 2.1.183.** Before-picture grep in 2.1.156 bundle: `grep -c tengu_non_deferrable_builtins → 0`,
  `grep -c non_deferrable_builtins → 0`. This is a server-side kill-switch letting Anthropic force any
  built-in to load eagerly (full schema turn 1) without a client release — placed BEFORE the MCP check
  so it can override even MCP defaults if a server-tool name is listed.

### Ladder evolution 2.1.156 → 2.1.183

2.1.156 `pp` (verified at 216868-216880) had: alwaysLoad → MCP → ToolSearch → Agent+fork → Brief →
SendUserFile → ScheduleWakeup+kairos → EnterWorktree+bg → shouldDefer (8 conditional rules).

2.1.183 `G2` **inserts two rules and reorders**:
| Rule | 2.1.156 | 2.1.183 | Note |
|------|:--:|:--:|------|
| `alwaysLoad` | ✅ | ✅ | unchanged (first) |
| `getNonDeferrableBuiltins().includes(name)` | ❌ | ✅ **NEW** | rule 2, before MCP — `c1i`, 222309 |
| MCP / ToolSearch / Agent+fork / Brief / SendUserFile | ✅ | ✅ | unchanged ladder |
| `PushNotification + remote_trigger` | ❌ | ✅ **NEW** | rule 8 — `G9 && wen()`, 222317 |
| `ScheduleWakeup + kairos` | ✅ | ✅ | now rule 9, 222318 |
| `EnterWorktree + bg` | ✅ | ✅ | now rule 10, 222319 |
| `shouldDefer` fallthrough | ✅ | ✅ | unchanged |

The new PushNotification exemption makes sense exactly like EnterWorktree-in-bg: in `remote_trigger`
entrypoint sessions (cloud/remote-triggered agents) `PushNotification` is the primary way to surface
results back to the user, so it must be visible turn-1 without a ToolSearch round-trip. Before-picture
greps confirm both rules are new (`remote_trigger` PushNotification ladder rule absent in 2.1.156).

### `shouldDefer` inventory (rule 11 input)

`grep -c "shouldDefer"` over the 2.1.183 bundle = **28** (27 tool decls of `shouldDefer: !0` + the one
read site `return e.shouldDefer === !0` in `G2`, 222320) — same count as 2.1.156. The `shouldDefer`
inventory is unchanged in size from 2.1.156 (re-verify exact membership in reconstruction if needed; the
2.1.156 list of 27 in `deferred_tools.md §2.1` is the expected set).

---

## 2. The `defer_loading` wire field

```javascript
// ============================================
// buildToolSchema defer_loading stamp - mark a tool defer_loading on the per-request overlay
// Location: cli_inner_pretty.js:581339
// ============================================

// ORIGINAL (for source lookup):
if (t.deferLoading) u.defer_loading = !0;

// READABLE:
if (toolFlags.deferLoading) apiToolSchema.defer_loading = true;

// Mapping: t.deferLoading→toolFlags.deferLoading, u→apiToolSchema
```

- Context: this is inside the schema builder (`CWn`/`buildToolSchema`); surrounding fields are
  `input_schema`, `strict`, `eager_input_streaming`, `cache_control` (581335-581340).
- Filter site (exclude deferred from passes needing loaded-only tools): **582534**
  `let Tn = X.filter((kr) => !("defer_loading" in kr && kr.defer_loading));`
- A separate normalization deletes `defer_loading` when not applicable: **105630-105635**
  `let c = o && l.defer_loading, ... if (c) delete d.defer_loading;`
- **Verbatim MCP-config description string (`alwaysLoad` = `defer_loading: false`)** at 363589/363615/363630:
  > `"When true, all tools from this server are always included in the prompt and never deferred behind tool search. Equivalent to setting defer_loading: false on the API. Default: tools are deferred when tool search is enabled. As a side effect this also blocks startup until the server is connected (capped at the standard 5s connect timeout) even though MCP startup is otherwise non-blocking by default, since the tools must be present when the turn-1 prompt is built."`

---

## 3. ToolSearch tool object — `IMt` (230417-230637)

```javascript
// ============================================
// ToolSearchTool - identity, schemas, call, render
// Location: cli_inner_pretty.js:230417-230637
// ============================================

// ORIGINAL (for source lookup):
IMt = pi({
  isEnabled() { return fR(); },                            // isToolSearchEnabledOptimistic
  isConcurrencySafe() { return !0; },
  isReadOnly() { return !0; },
  name: DA,                                                // "ToolSearch"
  maxResultSizeChars: 1e5,
  async description() { return own(); },                   // getPrompt
  async prompt() { return own(); },
  get inputSchema() { return pUi(); },
  get outputSchema() { return fUi(); },
  async call(e, { options: { tools: t, refreshTools: n, mcpClients: r, refreshMcpClients: o }, abortController: s }) { /* §6 */ },
  renderToolUseMessage() { return null; },
  userFacingName: () => "",
  mapToolResultToToolResultBlockParam(e, t) { /* §7 */ },
});

// Mapping: IMt→ToolSearchTool, pi→buildTool, fR→isToolSearchEnabledOptimistic, DA→TOOL_SEARCH_TOOL_NAME,
//          own→getPrompt, pUi→inputSchema, fUi→outputSchema
```

Identity (verbatim from `assets/tools/ToolSearch.md`): `Read-only: true`, `Concurrency-safe: true`,
`maxResultSizeChars: 1e5` (=100_000), `userFacingName: () => ""`, `renderToolUseMessage → null`.
Module export at 230250-230256: `gt(mUi, { outputSchema:()=>fUi, inputSchema:()=>pUi,
clearToolSearchDescriptionCache:()=>tId, ToolSearchTool:()=>IMt })`.

### 3.1 Input schema — `pUi` (230381-230388)

```javascript
// ORIGINAL:
pUi = we(() => H.object({
  query: H.string().describe('Query to find deferred tools. Use "select:<tool_name>" for direct selection, or keywords to search.'),
  max_results: H.number().optional().default(5).describe("Maximum number of results to return (default: 5)"),
}));
// Mapping: pUi→inputSchema, we→lazySchema, H→z(zod)
```
Describe strings verbatim (230384, 230386). Byte-identical to 2.1.156 `wf4`.

### 3.2 Output schema — `fUi` (230389-230396)

```javascript
// ORIGINAL:
fUi = we(() => H.object({
  matches: H.array(H.string()),
  query: H.string(),
  total_deferred_tools: H.number(),
  pending_mcp_servers: H.array(H.string()).optional(),
}));
// Mapping: fUi→outputSchema
```
Byte-identical to 2.1.156 `Df4`.

---

## 4. ToolSearch prompt — `own`/`getPrompt` (222325) + NEW conditional variant

```javascript
// ============================================
// getPrompt - ToolSearch description/prompt text (NEW conditional fetch-rule variant)
// Location: cli_inner_pretty.js:222325-222342
// ============================================

// ORIGINAL (for source lookup):
function own() {
  return xvd + (qmi() ? Lvd : kvd) + Dvd;                 // qmi()=toolSearchFetchRule gate
}

// Mapping: own→getPrompt, qmi→toolSearchFetchRuleEnabled, xvd→PROMPT_HEAD, Lvd→PROMPT_MID_FETCHRULE(NEW),
//          kvd→PROMPT_MID_LEGACY, Dvd→PROMPT_TAIL
```

**This is a real 2.1.183 delta** — 2.1.156 `r18 = Vk5 + vk5` was a flat concatenation. 2.1.183 splices a
conditional middle paragraph keyed on the `qmi()` (`toolSearchFetchRule`) gate.

**Verbatim strings (Read-verified):**

`xvd` (PROMPT_HEAD, 222330-222332):
```
Fetches full schema definitions for deferred tools so they can be called.

Deferred tools appear by name in <system-reminder> messages.
```

`kvd` (PROMPT_MID_LEGACY, when `qmi()` false, 222333):
```
 Until fetched, only the name is known — there is no parameter schema, so the tool cannot be invoked.
```

`Lvd` (PROMPT_MID_FETCHRULE, **NEW**, when `qmi()` true, 222334):
```
 Until fetched, only the name is known — there is no parameter schema, so calling the tool fails with InputValidationError. When any instruction, system reminder, or other tool's description names a deferred tool, fetch it with query "select:<name>" before calling it.
```

`Dvd` (PROMPT_TAIL, 222335-222342):
```
 This tool takes a query, matches it against the deferred tool list, and returns the matched tools' complete JSONSchema definitions inside a <functions> block. Once a tool's schema appears in that result, it is callable exactly like any tool defined at the top of the prompt.

Result format: each matched tool appears as one <function>{"description": "...", "name": "...", "parameters": {...}}</function> line inside the <functions> block — the same encoding as the tool list at the top of this prompt.

Query forms:
- "select:Read,Edit,Grep" — fetch these exact tools by name
- "notebook jupyter" — keyword search, up to max_results best matches
- "+slack send" — require "slack" in the name, rank by remaining terms
```

The `qmi()` gate (`toolSearchFetchRule`, 147794-147796) reads `Dkt().toolSearchFetchRule`, which is the
config key `gorse_hollow` (147781). Default off (`Fmi.toolSearchFetchRule = !1`, 147834-block). When on,
the prompt becomes more directive: it names `InputValidationError` and tells the model to proactively
`select:` a deferred tool whenever any text names it. **NEW in 2.1.183** (before-grep
`"When any instruction, system reminder, or other tool" → 0` in 2.1.156).

---

## 5. Keyword scorer + parse + cache (byte-identical logic to 2.1.156)

### 5.1 `parseToolName` — `uUi` (230273-230288)

```javascript
// ORIGINAL:
function uUi(e) {
  let t = e.name, n = e.mcpInfo ?? kk(t);                  // kk = getMcpInfo
  if (n) {
    let o = [n.serverName, n.toolName].filter((i) => Boolean(i)).map((i) => i.toLowerCase()),
      s = o.flatMap((i) => i.split(/[\s_.]+/)).filter(Boolean);
    return { parts: s, coarseParts: o, full: s.join(" "), isMcp: !0 };
  }
  let r = t.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").toLowerCase().split(/\s+/).filter(Boolean);
  return { parts: r, coarseParts: [t.toLowerCase()], full: r.join(" "), isMcp: !1 };
}
// Mapping: uUi→parseToolName, kk→getMcpInfo
```
Identical to 2.1.156 `Mf4` — `coarseParts` dimension present; structured `mcpInfo ?? getMcpInfo`.

### 5.2 `compileTermPatterns` — `nId` (230289-230293)

```javascript
function nId(e) {
  let t = new Map();
  for (let n of e) if (!t.has(n)) t.set(n, new RegExp(`\\b${q0(n)}\\b`));   // q0 = escapeRegExp
  return t;
}
// Mapping: nId→compileTermPatterns, q0→escapeRegExp
```

### 5.3 `searchToolsWithKeywords` — `dUi` (230294-230362)

Three stages: (1) exact name (deferred first, then full pool) → `[name]`; (2) `mcp__` prefix (length>5)
→ that server's tools sliced to maxResults; (3) `+required`/optional partition, pre-filter on required,
then score. **Scoring table (230344-230353) byte-identical to 2.1.156:**

| Signal | Regular | MCP | Line |
|--------|:--:|:--:|------|
| term ∈ `parts` | +10 | +12 | 230346 |
| term ⊂ some part | +5 | +6 | 230347 |
| term ∈ `coarseParts` | +10 | +12 | 230348 |
| term ⊂ some coarsePart | +3 | +4 | 230349 |
| `full` includes term (only if score==0) | +3 | +3 | 230350 |
| `searchHint` whole-word | +4 | +4 | 230351 |
| description whole-word | +2 | +2 | 230352 |

```javascript
// ORIGINAL (scoring core, 230344-230353):
for (let _ of c) {
  let b = u.get(_);
  if (m.parts.includes(_)) y += m.isMcp ? 12 : 10;
  else if (m.parts.some((S) => S.includes(_))) y += m.isMcp ? 6 : 5;
  if (m.coarseParts.includes(_)) y += m.isMcp ? 12 : 10;
  else if (m.coarseParts.some((S) => S.includes(_))) y += m.isMcp ? 4 : 3;
  if (m.full.includes(_) && y === 0) y += 3;
  if (h && b.test(h)) y += 4;
  if (b.test(g)) y += 2;
}
// Mapping: dUi→searchToolsWithKeywords, c→scoringTerms, u→patterns, m→parsed(uUi), g→memoizedDesc(oCn), h→searchHint
```
Result: `.filter(score>0).sort(desc).slice(0,maxResults).map(name)` (230358-230361).

### 5.4 Memoized description + fingerprint cache

```javascript
// getToolDescriptionMemoized - oCn (230397-230416): renders tool.prompt() with stub permission ctx, memoized by name
// getDeferredToolsCacheKey - eId (230257-230262): names.sort().join(",")
// maybeInvalidateCache - cUi (230263-230266):
function cUi(e) {
  let t = eId(e);
  if (m9r !== t) (v("ToolSearchTool: cache invalidated - deferred tools changed"), oCn.cache.clear?.(), (m9r = t));
}
// clearToolSearchDescriptionCache - tId (230267-230269): clears + m9r = null
// Mapping: cUi→maybeInvalidateCache, eId→getDeferredToolsCacheKey, oCn→getToolDescriptionMemoized, m9r→cachedKey, tId→clearCache
```
`cUi` is invoked at call setup (230445) and after each `refreshDeferredPool` (`f`, 230469) inside the
tool. Byte-identical to 2.1.156 `Of4`/`Uy_`/`Fy_`. Debug string verbatim:
`"ToolSearchTool: cache invalidated - deferred tools changed"` (230265).

---

## 6. `call()` — multi-phase search with in-tool MCP refresh+wait (230441-230616)

Signature: `async call(e, { options: { tools:t, refreshTools:n, mcpClients:r, refreshMcpClients:o }, abortController:s })`
where `e = { query:i, max_results:a=5 }`.

Setup (230442-230445): `l = n?.() ?? t` (refresh pool), `c = l.filter(G2)` (deferred), `cUi(c)`
(invalidate cache). `u = () => o?.() ?? r` (live MCP clients).

**Internal closures (all Read-verified):**
- `d()` (230447-230451) — `getPendingServerNames`: MCP clients where `type === "pending"` → names.
- `p(T,C)` (230452-230463) — `extractTargetServers`: parse `/mcp__([a-zA-Z0-9._-]+)/g` patterns + bare
  whole-word server names (`new RegExp(\`\\b${q0(L)}\\b\`,"i")`). Returns `[...targets]`.
- `f()` (230464-230470) — `refreshDeferredPool`: recompute pool via `n?.()`, count newly-appeared tools
  (`x = Wn(T, k => !C.has(k.name))`), `cUi(I)`, return `{freshTools, freshDeferred, newCount}`.
- `m(T)` (230471-230481) — `waitForPendingMcpServers`: poll loop:

```javascript
// ============================================
// waitForPendingMcpServers - poll <=5s for relevant pending servers (py_=ZCd=5000)
// Location: cli_inner_pretty.js:230471-230481
// ============================================

// ORIGINAL:
async function m(T) {
  let C = Date.now(), x = C + ZCd;                          // ZCd = 5000
  while (Date.now() < x && !s.signal.aborted) {
    let I = u().filter((k) => k.type === "pending");
    if (I.length === 0) break;
    if (T.length > 0 && !I.some((k) => T.includes(k.name) || T.includes(oc(k.name)))) break;  // oc=stripMcpServerPrefix
    await Un(50, s.signal);                                 // sleep 50ms
  }
  return Date.now() - C;
}
// Mapping: m→waitForPendingMcpServers, ZCd→MCP_WAIT_BUDGET_MS(5000), oc→stripMcpServerPrefix, Un→sleep
```
`ZCd = 5000` confirmed at **230365**. Sleep granularity 50ms (230478). Identical to 2.1.156 `J`/`py_`.

- `A(T,C,x)` (230482-230511) — `searchWithMcpRefresh`: refresh pool, search; if empty AND pending AND
  query targets a pending server → wait `m()`, refresh, re-search. Logs
  `tengu_tool_search_mcp_wait` (230499) with fields `queryType/refreshOnly/waitedMs/pendingBefore/
  pendingAfter/matchesAfterWait/targetServerCount/skippedPollNoTargetPending`. Returns
  `{matches, freshDeferred, freshTools}` or `null` (short-circuit if `!n` or nothing changed).
- `g(T,C,x)` (230512-230517) — `logFalseUnavailable`: fires `tengu_sdk_mcp_false_unavailable`
  (`queryType/pendingServers/targetedPendingServers`) when query named a pending server but found nothing.
- `h(T,C,x)` (230518-230536) — `logSearchOutcome`: fires `tengu_tool_search_outcome` with
  `queryLength/querySelectCount/queryType/matchCount/totalDeferredTools/maxResults/hasMatches/
  mcpServersConfigured/mcpServersConnected/mcpServersPending/mcpToolsInPool`.

### 6.1 Dispatch: `select:` vs keyword (230537-230615)

```javascript
// select: path
let y = i.match(/^select:(.+)$/i);                          // 230537
if (y) {
  let T = y[1].split(",").map(k => k.trim()).filter(Boolean), C = [], x = [];
  for (let k of T) { let L = vl(c, k) ?? vl(l, k);          // vl=findToolByName: deferred first, then full pool
    if (L) { if (!C.includes(L.name)) C.push(L.name); } else x.push(k); }
  if (x.length > 0) { /* A(...,"select", x) MCP refresh+wait, merge */ }   // 230552-230577
  if (C.length === 0) { /* total miss → expose pending via gnt([], i, …, d()) + g("select",...) */ }  // 230578-230589
  /* partial/full hit */ return (h(C,"select",I), gnt(C, i, …, []));        // 230592
}
// keyword path
let _ = await dUi(i, c, l, a);                              // 230594 searchToolsWithKeywords
if (_.length === 0) { /* A((C,x)=>dUi(i,C,x,a),"keyword",i) refresh+wait */ }   // 230597-230608
if (_.length === 0) { return (g("keyword", i.match(/mcp__[A-Za-z0-9_-]+/g) ?? [], d()), gnt(_, i, S, d())); } // 230611-613
return gnt(_, i, S, []);                                    // 230615
```
- `select:` regex anchored at **230537**: `/^select:(.+)$/i`.
- `findToolByName(deferred) ?? findToolByName(fullPool)` (230546) — already-loaded tool resolved as no-op.
- Partial-success debug strings verbatim: `"ToolSearchTool: partial select — found: …, missing: …"`
  (230571, 230590), `"ToolSearchTool: selected …"` (230573, 230591),
  `"ToolSearchTool: select failed — none found: …"` (230579),
  `"ToolSearchTool: keyword search for "…", found N matches"` (230595, 230603).

### 6.2 Result injection — `mapToolResultToToolResultBlockParam` (230621-230636)

```javascript
// ============================================
// renderResult - matches → tool_reference blocks; empty → pending-server hint
// Location: cli_inner_pretty.js:230621-230636
// ============================================

// ORIGINAL:
mapToolResultToToolResultBlockParam(e, t) {
  if (e.matches.length === 0) {
    let n = "No matching deferred tools found";
    if (e.pending_mcp_servers && e.pending_mcp_servers.length > 0) {
      let r = e.pending_mcp_servers,
        o = r.length > Sae ? `${r.slice(0, Sae).join(", ")}, …and ${r.length - Sae} more` : r.join(", ");  // Sae=30
      n += `. Some MCP servers are still connecting: ${o}. Their tools will become available shortly — try searching again. If you're looking for a capability rather than a specific tool name, try keywords that might match the server's purpose (e.g., 'slack message', 'calendar event'). Once you find a matching tool, call it directly — do not stop after searching.`;
    }
    return { type: "tool_result", tool_use_id: t, content: n };
  }
  return { type: "tool_result", tool_use_id: t, content: e.matches.map((n) => ({ type: "tool_reference", tool_name: n })) };
}
// Mapping: e→data, t→toolUseID, Sae→DEFERRED_DELTA_LIST_CAP(30)
```
- `tool_reference` injection at **230634**. Empty-with-pending hint verbatim at 230627 (3-clause:
  retry / capability-keywords / don't-stop-after-searching). `Sae = 30` confirmed at **462436**.
- Byte-identical to 2.1.156 `wV$.mapToolResultToToolResultBlockParam`.

---

## 7. Deferred-tools delta protocol

### 7.1 `getDeferredToolsDelta` — `Qgo` (462347-462403) — 5-state diff

```javascript
// ============================================
// getDeferredToolsDelta - diff current deferred pool vs announced; emit pool-change event
// Location: cli_inner_pretty.js:462347-462403
// ============================================

// ORIGINAL (key lines):
function Qgo(e, t, n, r) {
  // scan prior deferred_tools_delta attachments → announced set o, readded-before s, lastPending i
  for (let b of t) {
    if (b.type !== "attachment") continue;
    if ((a++, c.add(b.attachment.type), b.attachment.type !== "deferred_tools_delta")) continue;  // 462356
    l++;
    let S = new Set(b.attachment.readdedNames ?? []);
    for (let T of b.attachment.addedNames) if ((o.add(T), !S.has(T))) s.add(T);
    for (let T of b.attachment.removedNames) o.delete(T);
    if (b.attachment.pendingMcpServers !== void 0) i = b.attachment.pendingMcpServers;
  }
  let u = e.filter(G2),                                      // current deferred pool
    d = new Set(u.map(b => b.name)), p = new Set(e.map(b => b.name)),
    f = u.filter(b => !o.has(b.name)),                       // added
    m = u.filter(b => !s.has(b.name)),                       // addedLines source
    A = f.filter(b => s.has(b.name)).map(b => b.name),       // readded
    g = [];
  for (let b of o) { if (d.has(b)) continue; if (!p.has(b)) g.push(b); }   // removed (gone entirely; undeferred=silent)
  let h = r !== void 0 ? [...r].sort() : [],
    y = r !== void 0 && (h.length !== i.length || h.some((b, S) => b !== i[S]));   // pendingChanged
  if (f.length === 0 && g.length === 0 && m.length === 0 && !y) return null;
  let _ = ms([...f, ...m].map(b => b.name));                 // ms=uniq
  return (G("tengu_deferred_tools_pool_change", { addedCount:f.length, readdedCount:A.length,
    unlistedCount:m.length, removedCount:g.length, pendingChanged:y, pendingCount:h.length,
    lastPendingCount:i.length, priorAnnouncedCount:o.size, messagesLength:t.length, attachmentCount:a,
    dtdCount:l, callSite:Ne(n?.callSite ?? "unknown"), querySource:Bh(n?.querySource) ?? "unknown",
    attachmentTypesSeen:[...c].sort().join(",") }),
    { addedNames:_.sort(), addedLines:m.map(k5r).sort(), removedNames:g.sort(), readdedNames:A.sort(),
      ...(r !== void 0 && { pendingMcpServers:h }) });
}
// Mapping: Qgo→getDeferredToolsDelta, G2→isDeferredTool, k5r→formatDeferredToolLine, ms→uniq, G→logEvent
```
Byte-identical 5-facet diff to 2.1.156 `tg6` (added/addedLines/removed/readded + optional pending).
`tengu_deferred_tools_pool_change` event at **462379**. The "undeferred → silent" invariant holds
(`g` only pushes names gone from the *whole pool* `p`, not just from `d`, 462370-462373).
`callSite`/`querySource`/`attachmentTypesSeen` inc-4747 diagnostics retained (462391-462393).

- `summarizeByServerPrefix` — `xWn` (462404-462413): collapses `mcp__server__tool` → `mcp__server__*`
  with counts.
- `formatDeferredToolLine` — `k5r` (222322-222324): `return e.name;` (one line per tool = its name).
- Delta attachment registered at **464630** (`BA("deferred_tools_delta", …)`) and emitted at **464914**
  (`return [{ type: "deferred_tools_delta", ...s }]`). Also referenced in attachment-type table at 519405.

### 7.2 System-reminder rendering — case "deferred_tools_delta" (589470-589511) — 4 sections

```javascript
// ============================================
// deferred_tools_delta reminder - render diff into <system-reminder>
// Location: cli_inner_pretty.js:589470-589511
// ============================================

case "deferred_tools_delta": {
  let n = [];
  // 1. ADDED
  if (e.addedLines.length > 0)
    n.push(`The following deferred tools are now available via ${DA}. Their schemas are NOT loaded — calling them directly will fail with InputValidationError. Use ${DA} with query "select:<name>[,<name>...]" to load tool schemas before calling them:\n${e.addedLines.join("\n")}`);  // 589472-589475
  // 2. RE-ADDED
  let r = e.readdedNames ?? [];
  if (r.length > 0)
    n.push(`${r.length} deferred tool${r.length === 1 ? " is" : "s are"} available again (MCP server reconnected — names announced earlier in this conversation): ${xWn(r)}. Load via ${DA} as before.`);  // 589479
  // 3. REMOVED (summarized if > Sae=30) + ambient note _7n
  if (e.removedNames.length > 0)
    (n.push(e.removedNames.length > Sae
      ? `${e.removedNames.length} deferred tools are no longer available (MCP server disconnected): ${xWn(e.removedNames)}. Do not search for them — ${DA} will return no match.`
      : `The following deferred tools are no longer available (their MCP server disconnected). Do not search for them — ${DA} will return no match:\n${e.removedNames.join("\n")}`),
      n.push(_7n));                                          // 589481-589489
  // 4. PENDING
  let o = e.pendingMcpServers ?? [];
  if (o.length > 0) {
    let s = o.length > Sae ? `${o.slice(0, Sae).join(", ")}, …and ${o.length - Sae} more` : o.join("\n");
    n.push(`The following MCP servers are still connecting — their tools (typically named mcp__<server>__*) are not yet available but will appear shortly:\n${s}\n\nIf the user's request might be served by one of these servers (even if they didn't name it explicitly), call ${DA} with a relevant keyword — ${DA} will wait for connecting servers and search their tools once available. Do not report a capability as unavailable without first searching.`);  // 589497-589500
  }
  if (n.length === 0) return [];
  return Jp([Rn({ content: n.join("\n\n"), isMeta: !0 })]);  // 589503
}
// Mapping: DA→TOOL_SEARCH_TOOL_NAME, xWn→summarizeByServerPrefix, Sae→DEFERRED_DELTA_LIST_CAP(30),
//          _7n→AMBIENT_CONTEXT_NOTE, Jp→wrapAsSystemReminder, Rn→makeMetaMessage
```
**All four section strings verbatim and byte-identical to 2.1.156.** Anchors: ADDED string at 589473
(contains `InputValidationError` + `select:<name>[,<name>...]`), RE-ADDED 589479, REMOVED 589484-589485,
PENDING 589497-589500.

---

## 8. `extractDiscoveredToolNames` — `eX` (462320-462346) + compact carry

```javascript
// ============================================
// extractDiscoveredToolNames - scan tool_reference blocks + compact-boundary carry
// Location: cli_inner_pretty.js:462320-462346
// ============================================

// ORIGINAL:
function eX(e) {
  let t = new Set(), n = 0;
  for (let r of e) {
    if (r.type === "system" && r.subtype === "compact_boundary") {
      let s = r.compactMetadata?.preCompactDiscoveredTools;
      if (s) { for (let i of s) t.add(i); n += s.length; }
      continue;
    }
    if (r.type !== "user") continue;
    let o = r.message?.content;
    if (!Array.isArray(o)) continue;
    for (let s of o) if (m3p(s)) { for (let i of s.content) if (f3p(i)) t.add(i.tool_name); }
  }
  if (t.size > 0) v(`Dynamic tool loading: found ${t.size} discovered tools in message history` + (n > 0 ? ` (${n} carried from compact boundary)` : ""));
  return t;
}
// Mapping: eX→extractDiscoveredToolNames, m3p→isToolResultBlockWithContent, f3p→isToolReferenceBlockWithName
```
- Type guards: `rne` (462304) = `isToolReferenceBlock` (`type === "tool_reference"`); `f3p` (462307) =
  reference WITH string `tool_name`; `m3p` (462310) = tool_result with array content.
- Compact carry: reads `compactMetadata.preCompactDiscoveredTools` (462325). Snapshot WRITE sites:
  **453446**, **460782**, **461008** (`compactMetadata.preCompactDiscoveredTools = [...h].sort()`).
  Serialization: `pre_compact_discovered_tools` (529632/529654).
- Byte-identical to 2.1.156 `P8H`.

---

## 9. Request assembly — which tools ship (582412-582457) + beta header

```javascript
// ============================================
// buildRequestTools - three-way split using discovered set; defer_loading flag; beta header
// Location: cli_inner_pretty.js:582412-582457
// ============================================

// ORIGINAL (key lines):
y = await J4t(g, r, s.getToolPermissionContext, s.agents, "query"),   // isToolSearchEnabled; 582412
_ = new Set();
if (y) { for (let Tn of r) if (G2(Tn)) _.add(Tn.name); }              // deferred names; 582414-416
if (y && _.size === 0 && !s.hasPendingMcpServers)
  (v("Tool search disabled: no deferred tools available to search"), (y = !1));   // 582417-418
let b;
if (y) {
  let Tn = eX(e);                                                     // discovered; 582421
  b = r.filter((kr) => {
    if (!_.has(kr.name)) return !0;                                   // non-deferred → full schema
    if (Rc(kr, DA)) return !0;                                        // ToolSearch always
    return Tn.has(kr.name);                                           // deferred → only if discovered
  });
} else b = r.filter((Tn) => { if (Rc(Tn, DA)) return !1; return !0; }); // search off → drop ToolSearch
let S = _y(s.model), T = y ? wti() : null;                            // 582432-433 getToolSearchBeta
if (T && S !== "bedrock") { if (!p.includes(T)) p.push(T); }          // 582434-436 add beta unless bedrock
let x = (Tn) => y && (_.has(Tn.name) || cbf(Tn)),                     // 582438 deferLoadingFlag (cbf=shouldDeferLspTool)
  L = await Promise.all(b.map((Tn) => CWn(Tn, { ..., model:g, deferLoading: x(Tn) })));  // 582442-453 buildToolSchema
// Mapping: J4t→isToolSearchEnabled, G2→isDeferredTool, eX→extractDiscoveredToolNames, Rc→toolMatchesName,
//          DA→TOOL_SEARCH_TOOL_NAME, _y→getAPIProvider, wti→getToolSearchBeta, cbf→shouldDeferLspTool, CWn→buildToolSchema
```
Three-way split (non-deferred + ToolSearch + discovered-deferred) byte-identical to 2.1.156.
`"Tool search disabled: no deferred tools available to search"` verbatim at 582418.

### 9.1 Beta header — `wti`/`getToolSearchBeta` (134585-134589)

```javascript
function wti() {
  let e = Ir();                                              // getAPIProvider
  if (e === "vertex" || e === "bedrock" || e === "mantle" || e === "gateway") return JTt;  // "tool-search-tool-2025-10-19"
  return cCr;                                                // "advanced-tool-use-2025-11-20"
}
// Mapping: wti→getToolSearchBeta, Ir→getAPIProvider, JTt→TOOL_SEARCH_TOOL_BETA, cCr→ADVANCED_TOOL_USE_BETA
```
- `cCr = jS("tool_search", "advanced-tool-use-2025-11-20")` (101569),
  `JTt = jS("tool_search", "tool-search-tool-2025-10-19")` (101570). Provider→header mapping
  (vertex/bedrock/mantle/gateway → 3P) identical to 2.1.156 `oEK`. Beta values unchanged.

### 9.2 tool_reference strip paths (lifecycle stages 6 & 7)

- Unavailable-reference strip (server gone) → placeholder `"[Tool references removed - tools no longer available]"` at **587987**.
- Tool-search-off strip → placeholder `"[Tool references removed - tool search not enabled]"` at **588005**.
- Deferred-tools filter for loaded-only passes: **582534** `X.filter(kr => !("defer_loading" in kr && kr.defer_loading))`.

---

## 10. Enablement machine

### 10.1 `getToolSearchMode` — `PPt` (221183-221193) — identical to 2.1.156

```javascript
function PPt() {
  if (jNe()) return "standard";                             // jNe = CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS || hipaa
  let e = process.env.ENABLE_TOOL_SEARCH, t = e ? a5r(e) : null;   // a5r = parseAutoPercentage
  if (t === 0) return "tst";
  if (t === 100) return "standard";
  if (nvd(e)) return "tst-auto";                            // nvd = isAutoToolSearchMode
  if (st(e)) return "tst";                                  // st = isEnvTruthy
  if (yl(process.env.ENABLE_TOOL_SEARCH)) return "standard"; // yl = isEnvDefinedFalsy
  return "tst";                                             // unset default
}
// Mapping: PPt→getToolSearchMode, jNe→isExperimentalBetasDisabled, a5r→parseAutoPercentage,
//          nvd→isAutoToolSearchMode, st→isEnvTruthy, yl→isEnvDefinedFalsy
```
`jNe` (134594-134596) = `st(CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS) || t1e("hipaa")` — the hipaa kill
condition is **carryover, not new** (2.1.156 `fVH` at 130470 was already
`xH(CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS) || b76("hipaa")`). `a5r`(221172), `nvd`(221179),
`yl`(169) helpers present.

### 10.2 `isToolSearchEnabledOptimistic` — `fR` (221224-221252) — identical 3-branch

```javascript
function fR() {
  let e = PPt();
  if (e === "standard") { /* log once via ICe */ return !1; }
  if (!process.env.ENABLE_TOOL_SEARCH && Ir() === "firstParty" && !Pu()) { /* proxy guard */ return !1; }  // Pu=isFirstPartyAnthropicBaseUrl
  if (!process.env.ENABLE_TOOL_SEARCH && Ir() === "vertex") { /* vertex guard */ return !1; }
  return !0;
}
// Mapping: fR→isToolSearchEnabledOptimistic, PPt→getToolSearchMode, Ir→getAPIProvider, Pu→isFirstPartyAnthropicBaseUrl, ICe→logOnceFlag
```
Debug strings verbatim at 221229/221236/221244/221250. Same standard + firstParty-proxy + vertex
branches as 2.1.156 `wE`.

### 10.3 `modelSupportsToolReference` — `f7` (221218-221223) — DELTA: haiku list narrowed

```javascript
function f7(e) {
  let t = e.toLowerCase(), n = ovd();                       // ovd = unsupported-models list
  for (let r of n) if (t.includes(r.toLowerCase())) return !1;
  return !0;
}
function ovd() {                                            // 221194-221200
  try { let e = ct("tengu_tool_search_unsupported_models", null); if (Array.isArray(e)) return e; } catch {}
  return rvd;                                               // rvd = ["claude-3-5-haiku", "claude-3-haiku"]  (221263)
}
// Mapping: f7→modelSupportsToolReference, ovd→getUnsupportedModelsList, rvd→TOOL_SEARCH_UNSUPPORTED_MODELS, ct→getFeatureGateValue
```
**DELTA vs 2.1.156:** 2.1.156 `Lx_ = ["haiku"]` (424986) — blocked ALL haiku. 2.1.183
`rvd = ["claude-3-5-haiku", "claude-3-haiku"]` (221263) — blocks only the OLD haikus, so **Haiku 4.5+
is now supported** for tool_reference. Confirmed by the J4t debug string (below). Both still overridable
via GrowthBook `tengu_tool_search_unsupported_models`.

### 10.4 `isToolSearchEnabled` — `J4t` (462248-462303) — DELTA: NEW Foundry gate

```javascript
async function J4t(e, t, n, r, o) {
  let s = Wn(t, (l) => l.isMcp);
  function i(l, c, u, d) { G("tengu_tool_search_mode_decision", { enabled:l, mode:Ne(c), reason:u, checkedModel:e, mcpToolCount:s, mcpNonBlocking:Jbe(), userType:"external", ...d }); }
  if (!f7(e)) return (v(`Tool search disabled for model '${e}': model does not support tool_reference blocks. This feature is available on Claude Sonnet 4+, Opus 4+, Haiku 4.5+, and newer models.`), i(!1,"standard","model_unsupported"), !1);  // 462262-269
  if (!Zoe(e, "tool_search_server") || !Zoe(e, "tool_search"))   // NEW Foundry gate; 462270
    return (v(`Tool search disabled: Foundry deployment for '${e}' does not support tool search.`), i(!1,"standard","foundry_deployment_unsupported"), !1);
  if (!gLe(t)) return (v("Tool search disabled: ToolSearchTool is not available (may have been disallowed via disallowedTools)."), i(!1,"standard","mcp_search_unavailable"), !1);  // 462276
  let a = PPt();
  switch (a) {
    case "tst": return (i(!0, a, "tst_enabled"), !0);
    case "tst-auto": { let { enabled:l, debugDescription:c, metrics:u } = await A3p(t, n, r, e); /* threshold */ return l; }  // 462286-298
    case "standard": return (i(!1, a, "standard_mode"), !1);
  }
}
// Mapping: J4t→isToolSearchEnabled, f7→modelSupportsToolReference, Zoe→foundryDeploymentSupports, gLe→isToolSearchToolAvailable, A3p→checkAutoThreshold, PPt→getToolSearchMode
```
**DELTA vs 2.1.156:** NEW `foundry_deployment_unsupported` gate (462270-462275) — `Zoe(e, "tool_search_server")`
AND `Zoe(e, "tool_search")` must both pass or tool search is off for Foundry deployments. Debug message
now lists `"Haiku 4.5+"` (462265), matching the §10.3 haiku-list change. Before-grep
`"foundry_deployment_unsupported" → 0` in 2.1.156.

### 10.5 `checkAutoThreshold` — `A3p` (462415-462434)

```javascript
async function A3p(e, t, n, r) {
  let o = await d3p(e, t, n, r);                            // deferred-tool token count (API)
  if (o !== null) return { enabled: o >= gel(r), debugDescription: `${o} tokens (threshold: ${gel(r)}, ${Xgo()}% of context)`, metrics: { deferredToolTokens:o, threshold:gel(r) } };
  let s = await p3p(e, t, n, r), i = hel(r);                // char fallback (2.5 chars/token, u3p)
  return { enabled: s >= i, debugDescription: `${s} chars (threshold: ${i}, ${Xgo()}% of context) (char fallback)`, metrics: { deferredToolDescriptionChars:s, charThreshold:i } };
}
// Mapping: A3p→checkAutoThreshold, d3p→countDeferredToolTokens, gel→tokenThreshold, p3p→countDeferredToolChars, hel→charThreshold, u3p→CHARS_PER_TOKEN(2.5), Xgo→autoPercentage
```
`u3p = 2.5` (char/token fallback ratio), `Ygo = 10` (default auto pct?) near 462436. `isToolSearchToolAvailable`
= `gLe` (462232).

---

## 11. NEW: `tool_search_usage_reminder` — periodic nudge (juniper_shoal)

A genuinely new 2.1.183 attachment type. Before-grep `tool_search_usage_reminder → 0` and
`tengu_juniper_shoal_shown → 0` in 2.1.156.

### 11.1 Builder — `wtl` (465778-465820)

```javascript
// ============================================
// buildToolSearchUsageReminder - every-N-turns nudge listing undiscovered deferred tools
// Location: cli_inner_pretty.js:465778-465820
// ============================================

async function wtl(e, t, n) {
  let r = B1r();                                             // getToolSearchReminderConfig (null if off)
  if (r === null) return [];
  if (!e || e.length === 0) return [];
  let { turnsSinceLastToolSearch: o, turnsSinceLastReminder: s } = C4p(e);   // C4p, 465755
  if (o < r.everyNTurns || s < r.everyNTurns) return [];
  let i = (u) => { if (s % r.everyNTurns === 0) G("tengu_juniper_shoal_shown", { delivered:!1, skipReason:Ne(u), everyNTurns:r.everyNTurns, turnsSinceLastReminder:s }); return []; };
  if (PPt() !== "tst") return i("mode_not_tst");
  if (!f7(t.options.mainLoopModel)) return i("model_unsupported");
  if (!gLe(t.options.tools)) return i("toolsearch_unavailable");
  let a = eX(e),                                             // discovered set
    l = t.options.tools.filter((u) => G2(u) && !a.has(u.name)).map((u) => u.name).sort();   // undiscovered deferred
  if (l.length === 0) return i("no_undiscovered_tools");
  let c = !1; try { c = await n(); } catch { c = !1; }       // n = "task reminder fired this turn?"
  if (c) return i("task_reminder_same_turn");                // avoid double reminders
  return (G("tengu_juniper_shoal_shown", { delivered:!0, undiscoveredCount:l.length, listedCount:Math.min(l.length, r.maxNames), everyNTurns:r.everyNTurns, maxNames:r.maxNames }),
    [{ type:"tool_search_usage_reminder", undiscoveredToolNames: l.slice(0, r.maxNames), undiscoveredCount: l.length }]);
}
// Mapping: wtl→buildToolSearchUsageReminder, B1r→getToolSearchReminderConfig, C4p→getTurnsSinceCounters,
//          PPt→getToolSearchMode, f7→modelSupportsToolReference, gLe→isToolSearchToolAvailable, eX→extractDiscoveredToolNames, G2→isDeferredTool
```
Registered conditionally at **464654-464656**:
`...(B1r() !== null ? [BA("tool_search_usage_reminder", () => wtl(o, t, async () => (await m()).length > 0))] : [])`.

### 11.2 Rendering — case "tool_search_usage_reminder" (589323-589334)

```javascript
case "tool_search_usage_reminder": {
  let n = e.undiscoveredToolNames;
  if (n.length === 0) return [];
  let r = e.undiscoveredCount - n.length, o = n.join(", ") + (r > 0 ? ` (+${r} more)` : "");
  return Jp([Rn({ content: `Some available tools' schemas are not loaded in this conversation yet: ${o}. Before concluding a capability is missing or building a workaround, use ${DA} to find and load relevant tools — keywords to search, or query "select:<name>[,<name>...]" for specific tools. Calling a tool before its schema is loaded will fail. This is just a gentle reminder - ignore if not applicable to the current work.`, isMeta: !0 })]);
}
```
**Verbatim reminder string at 589330.** Anchors `select:<name>[,<name>...]`, `ToolSearch` (`DA`).

### 11.3 Config — `Dkt`/`B1r` (147759-147786) — the juniper_shoal config object

```javascript
function Dkt() {                                            // master tool-search config reader
  let e; try { e = Umi?.()?.juniper_shoal; } catch { return Fmi; }
  if (typeof e !== "object" || e === null || Array.isArray(e)) return Fmi;
  let t = e, n = null, r = t.marsh_lantern;                 // marsh_lantern = reminder config
  if (r === !0) n = Object.freeze({ everyNTurns: Nmi, maxNames: Bmi });   // Nmi=15, Bmi=10
  else if (typeof r === "object" && ...) { let s = r.stride>=1 ? r.stride : Nmi, i = r.span>=1 ? r.span : Bmi; n = Object.freeze({ everyNTurns:s, maxNames:i }); }
  return Object.freeze({
    toolSearchReminder: n,                                  // → B1r()
    toolParamStrictness: t.bracken_spool === !0,            // → Gmi()
    emptyInputRepair: t.teasel_cove === !0,                 // → Wmi()
    toolSearchFetchRule: t.gorse_hollow === !0,             // → qmi()  (gates Lvd prompt variant)
    schemaDescFixes: t.thistle_skein === !0,                // → F1r()
  });
}
function B1r() { return Dkt().toolSearchReminder; }         // 147785
// Mapping: Dkt→getToolSearchConfig, Umi→getClientConfigCache, B1r→getToolSearchReminderConfig,
//          Fmi→DEFAULT_TS_CONFIG(all off), Nmi→DEFAULT_EVERY_N_TURNS(15), Bmi→DEFAULT_MAX_NAMES(10)
```
- Config source: `Umi()?.juniper_shoal` (147762) — a server clientData blob with whimsical key names:
  `marsh_lantern`(reminder), `bracken_spool`(strict params), `teasel_cove`(empty-input repair),
  `gorse_hollow`(fetch-rule prompt), `thistle_skein`(schema-desc fixes); sub-keys `stride`/`span`.
- Defaults: `Nmi = 15`, `Bmi = 10` (147834-147835), `Fmi` = all-off frozen object (147840-block).
- `qmi()` (147794) reads `toolSearchFetchRule` (`gorse_hollow`) — gates the §4 `Lvd` prompt variant.

---

## 12. NEW: `undiscoveredToolHint` — `G$p` (437133-437148) — DELTA: now appends input schema

```javascript
// ============================================
// undiscoveredToolHint - tell model to ToolSearch a deferred tool it called without loading
// Location: cli_inner_pretty.js:437133-437148
// ============================================

function G$p(e, t, n) {
  if (!fR()) return null;                                   // tool search off
  if (!gLe(n)) return null;                                 // ToolSearch unavailable
  if (!G2(e)) return null;                                  // not deferred
  if (eX(t).has(e.name)) return null;                       // already discovered
  let o = "";
  try { o = ` For reference, this tool's input schema is: ${Re(H.toJSONSchema(e.inputSchema))}`; } catch {}   // NEW appendix
  return `\n\nThis tool's schema was not sent to the API — it was not in the discovered-tool set derived from message history. Without the schema in your prompt, typed parameters (arrays, numbers, booleans) get emitted as strings and the client-side parser rejects them. Load the tool first: call ${DA} with query "select:${e.name}", then retry this call.${o}`;
}
// Mapping: G$p→undiscoveredToolHint, fR→isToolSearchEnabledOptimistic, gLe→isToolSearchToolAvailable,
//          G2→isDeferredTool, eX→extractDiscoveredToolNames, DA→TOOL_SEARCH_TOOL_NAME, H→zod, Re→jsonStringify
```
**Verbatim hint string at 437145-437146.** **DELTA vs 2.1.156 `zS_`:** 2.1.183 appends
` For reference, this tool's input schema is: <JSONSchema>` (437140) — giving the model the schema inline
so it can retry immediately without even waiting for the `select:` round-trip. Before-grep
`"For reference, this tool's input schema is" → 0` in 2.1.156.

---

## 13. Summary of confirmed 2.1.183 deltas vs 2.1.156

| # | Delta | Evidence (2.1.183 line) | Before-grep (2.1.156) |
|---|-------|-------------------------|-----------------------|
| 1 | `isDeferredTool` rule 2: `getNonDeferrableBuiltins` exempt list | `c1i` 221201; used 222309 | `tengu_non_deferrable_builtins → 0` |
| 2 | `isDeferredTool` rule 8: PushNotification + remote_trigger entrypoint | 222317 (`G9 && wen()`) | rule absent in `pp` 216868-880 |
| 3 | ToolSearch prompt: NEW directive variant `Lvd` gated by `toolSearchFetchRule` | `own` 222326, `Lvd` 222334 | `"When any instruction…" → 0` |
| 4 | `isToolSearchEnabled`: NEW Foundry-deployment gate | 462270-275 | `foundry_deployment_unsupported → 0` |
| 5 | Unsupported-models list narrowed `["haiku"]` → `["claude-3-5-haiku","claude-3-haiku"]` (Haiku 4.5+ supported) | `rvd` 221263; debug 462265 | 2.1.156 `Lx_ = ["haiku"]` (424986) |
| 6 | NEW `tool_search_usage_reminder` periodic nudge (juniper_shoal config) | `wtl` 465778; render 589323-334; cfg `Dkt` 147759 | `tool_search_usage_reminder → 0` |
| 7 | `undiscoveredToolHint` now appends inline JSONSchema | 437140 | `"For reference, this tool's input schema" → 0` |

**Unchanged from 2.1.156 (byte-identical):** input/output schemas, keyword scorer + `coarseParts`
weights, `parseToolName`/`compileTermPatterns`, fingerprint cache, `getDeferredToolsDelta` 5-state diff,
4-section delta reminder strings, `extractDiscoveredToolNames` + compact carry, request-assembly
three-way split, `defer_loading` stamp, beta-header provider mapping + beta values, `getToolSearchMode`,
`isToolSearchEnabledOptimistic` branches, MCP wait machine (`ZCd`=5000, 50ms poll), `select:` dispatch,
`mapToolResultToToolResultBlockParam` (`tool_reference` injection + empty-with-pending hint),
`DEFERRED_DELTA_LIST_CAP`=30 (`Sae`), tool-reference strip placeholders.

---

## 14. Open questions for reconstruction

1. ~~hipaa kill condition~~ RESOLVED: carryover from 2.1.156 (`fVH` 130470), not new. See §10.1.
2. Exact membership of the 28-hit `shouldDefer` inventory was not re-enumerated tool-by-tool (count
   matches 2.1.156's 27 decls + 1 read site). If the reconstruction needs the per-tool table, re-resolve
   each `shouldDefer: !0` decl's `name:` field in 2.1.183 (the 2.1.156 list in `deferred_tools.md §2.1`
   is the expected set).
3. RESOLVED: `Zoe(e, t)` (105597-105601) = Foundry per-model unsupported-feature check — `jht()` returns
   a `model → Set<unsupportedFeature>` map; `Zoe` returns `true` (supported) when the map is empty, else
   `!map.get(EIr(e))?.has(t)`. So `!Zoe(e,"tool_search")` means this Foundry deployment explicitly lists
   `tool_search` (or `tool_search_server`) as unsupported for model `e`.
