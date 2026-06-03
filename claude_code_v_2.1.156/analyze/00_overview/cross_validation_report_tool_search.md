# Cross-Validation Report — ToolSearch & Deferred-Tool Loading

- **Module:** 04_tools — ToolSearch tool + deferred-tool (defer-loaded) loading, v2.1.156.
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/04_tools`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- **v2.1.88 xval source:** `/lyz/codespace/3rd/claude-code/src` (named TypeScript reconstruction —
  `tools/ToolSearchTool/{ToolSearchTool.ts,prompt.ts,constants.ts}`, `utils/toolSearch.ts`,
  `utils/api.ts`)
- **Prior-version baseline:** `claude_code_v_2.1.142/analyze/04_tools/{tool_search,deferred_tools}.md`
- **Markdown files scanned:** 3 (`04_tools/tool_search.md`, `04_tools/deferred_tools.md`,
  `00_overview/symbol_additions_v2_1_156_tool_search.md`)
- **Samples verified directly in the bundle:** 73 (41 core + 18 supplement + 14 cross-tree lifecycle;
  well above the ≥15 floor). Cross-tree samples (C7) were verified in **both** the 2.1.156 bundle and
  the 2.1.88 named TypeScript source.

---

## C1 — Symbol existence (41 cited symbols/lines sampled)

Every sampled obfuscated identifier was located at its cited `cli_inner_pretty.js:<line>` by reading
the line directly.

- **ToolSearch tool:** `wV$` (404286), `wf4` (404249), `Df4` (404259), `Jf4` ns (404122-404128),
  `l3 = "ToolSearch"` (216132), `r18` (216884), `Vk5` (216889), `vk5` (216892), `pZ8` (404267),
  `py_ = 5000` (404234).
- **Search algorithm / cache:** `jf4` (404164), `Mf4` (404144), `Qy_` (404159), `reH` (404141),
  `Of4` (404134), `Uy_` (404129), `Fy_` (404138), `aQ6 = null` (404235), `W9` (143471), `UR` (50920),
  `u9` (50915), `vR` (9649).
- **Enablement / mode:** `Jc6` ns (424653-424667), `wE` (424719), `Dv$` (424768), `Pc6` (424695),
  `PX4` (424668), `Dx_` (424675), `Lc6` (424679), `WX4` (424687), `ZX4` (424692), `k5H` (424713),
  `Px_` (424706), `Lx_ = ["haiku"]` (424986), `$RH` (424752), `Wc6` (424748), `$s` (424818),
  `Xc6 = 10` (424947), `Jx_ = 2.5` (424948), `fVH` (130470), `xH` (1795), `k4` (1801).
- **Deferral / delta:** `pp` (216868), `PG6` (216881), `WG6` ns (216861-216867), `tg6` (424861),
  `P8H` (424834), `J08` (424918), `$qH = 30` (424952), `yT8` (446489), `n1H = "EnterWorktree"`
  (216098), `df = "ScheduleWakeup"` (216099), `hwH` (216001), `sq = "Agent"` (185637), `aq` (40716),
  `H6` (40711).

- **PASS: 41**
- **FAIL: 0**

No cited symbol was missing from its cited window.

## C2 — Line/symbol pairing (41 pairs)

For each sample, the identifier present at the cited line matched the readable name and role asserted
in the docs/additions. Notable verbatim matches:

- `pp` ladder body ends `…; if (H.name === n1H && process.env.CLAUDE_CODE_SESSION_KIND === "bg") return !1; return H.shouldDefer === !0;` (216878-216879) — confirming **rule 8 (EnterWorktree/bg)** and the `shouldDefer` fallthrough, and `if (H.name === df && hwH()) return !1;` (216877) confirming **rule 7 (ScheduleWakeup/kairos)**.
- `wE` body has **three** disable branches: `standard` (424721), firstParty-proxy (424727), and `Zq() === "vertex"` (424735) — confirming the **new Vertex branch**.
- `r18 = Vk5 + vk5` (216884-216885) with `Vk5` ending `"…appear by name in <system-reminder> messages."` (216891) — confirming the hard-coded location hint.
- `jf4` scoring block (404215-404221) contains both `J.parts.includes(W)` **and** `J.coarseParts.includes(W)` arms (`+12/+10`, `+4/+3`) — confirming the **`coarseParts` dimension**.
- `Mf4` head `let q = H.mcpInfo ?? UR($)` (404146) — confirming structured MCP detection (not prefix-string).
- `tg6` returns `{ addedNames, addedLines, removedNames, readdedNames, …(K !== void 0 && { pendingMcpServers: P }) }` (424910-424914) — confirming the **5-state delta**.
- `mapToolResultToToolResultBlockParam` empty branch builds the 3-clause pending hint and success branch maps to `{ type: "tool_reference", tool_name }` (404496, 404503).

- **PASS: 41**
- **FAIL: 0**

## C3 — Behavioral claims vs source

| Claim (doc) | Source evidence | Verdict |
|-------------|-----------------|---------|
| ToolSearch waits ≤5 s for relevant pending MCP servers, 50 ms poll | `J` loop `S = E + py_` / `await g8(50, …)` (404341-404347); `py_ = 5000` (404234) | ✅ |
| Wait is gated on a pending server matching query targets | `Q = x.length === 0 || x.some(…)`; `if (b.length===0 && C>0 && Q)` (404364-404366) | ✅ |
| `select:` resolves deferred-first then full pool (no-op for loaded) | `W9(O, I) ?? W9(f, I)` (404415) | ✅ |
| `+`-required terms gate the candidate set then also score | `Y` partition + pre-filter `j = (…filter(J=>J!==null))` (404183-404205), then scored | ✅ |
| Empty-with-pending hint truncates list at 30 | `K.length > $qH ? …slice(0,$qH)…` with `$qH = 30` (404495, 424952) | ✅ |
| `defer_loading: true` stamped on the API tool schema | `if ($.deferLoading) M.defer_loading = !0;` (556008) | ✅ |
| "Undeferred but still in pool" is NOT reported as removed | `for (let G of _){ if (j.has(G)) continue; if (!w.has(G)) L.push(G); }` (424884-424887) | ✅ |
| `extractDiscoveredToolNames` carries pre-compact set across boundary | `compact_boundary` → `preCompactDiscoveredTools` (424834-424859) | ✅ |
| `getToolSearchMode` kill-switch overrides everything | `if (fVH()) return "standard";` first line of `Pc6` (424696); `fVH` reads `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` (130470) | ✅ |
| `modelSupportsToolReference` is a negative test vs `["haiku"]`, GrowthBook-overridable | `k5H` loops `Px_()`; `Px_` reads `tengu_tool_search_unsupported_models` else `Lx_ = ["haiku"]` (424706-424717, 424986) | ✅ |

## C4 — v2.1.88 divergences (asserted deltas verified against both trees)

| Delta | 2.1.88 evidence (absent/old) | 2.1.156 evidence (present/new) | Verdict |
|-------|------------------------------|-------------------------------|---------|
| Vertex optimistic branch | `isToolSearchEnabledOptimistic` has only standard + firstParty-proxy (utils/toolSearch.ts) | `wE` adds `Zq()==="vertex"` (424735-424742) | ✅ NEW |
| MCP wait in `call()` | `call(input,{options:{tools},getAppState})`, reports but never waits (ToolSearchTool.ts:328-433) | `call(…,{options:{tools,refreshTools,mcpClients,refreshMcpClients},abortController})` with `J`/`X` wait machine (404310-404380) | ✅ NEW |
| `coarseParts` scoring | `parseToolName → {parts,full,isMcp}` (ToolSearchTool.ts:132-161) | `Mf4 → {parts,coarseParts,full,isMcp}` + scoring arms (404144-404158, 404217) | ✅ NEW |
| ScheduleWakeup defer rule | `isDeferredTool` has no ScheduleWakeup case (prompt.ts) | `pp` rule 7 `df && hwH()` (216877) | ✅ NEW |
| EnterWorktree/bg defer rule | no EnterWorktree case (prompt.ts) | `pp` rule 8 (216878); changelog `by_version/2.1.153.md:481` | ✅ NEW (2.1.153) |
| Delta facets | type `{addedNames,addedLines,removedNames}` (utils/toolSearch.ts) | `tg6` returns `+ readdedNames + pendingMcpServers` (424910-424914) | ✅ NEW |
| Prompt location toggle | `getToolLocationHint()` switches on `tengu_glacier_2xr` (prompt.ts) | hard-coded; `grep available-deferred-tools → 0`, no `glacier_2xr`/`isDeferredToolsDeltaEnabled` in bundle | ✅ REMOVED |
| `tengu_sdk_mcp_false_unavailable` | not present | `L` logs it (404385) | ✅ NEW |

## C6 — `shouldDefer` inventory + `tool_reference` lifecycle (supplement, 18 samples)

Added for the "which tools declare defer / how `tool_reference` works" follow-up.

**`shouldDefer: !0` inventory (27 tools).** `grep -c "shouldDefer"` = 28 (27 declarations + the read
site in `pp`). All 27 declaration lines were read and the enclosing `name:` field resolved to a
tool-name constant:

- Verified decls: 215500 (`NwH`=ListMcpResourcesTool), 348411 (`z0`=NotebookEdit), 349722
  (`og`=EnterPlanMode), 350044 (`wv`=ExitPlanMode), 366237 (`WX`=WebFetch), 376476 (`mv`=TodoWrite),
  378969 (`MJ`=Monitor), 399608 (`nT`=TaskStop), 402239 (`df`=ScheduleWakeup), 402565
  (`Yo`=TaskOutput), 402847 (`ux`=WebSearch), 403841 (`ZrH`=LSP), 404057 (literal
  `"ReadMcpResourceTool"`), 404650 (`n1H`=EnterWorktree), 404852 (`l18`=ExitWorktree), 405050
  (`SL`=TaskCreate), 405155 (`nd`=TaskGet), 405337 (`rT`=TaskUpdate), 405553 (`Y0`=TaskList), 405709
  (`rP`=CronCreate), 405791 (`dI`=CronDelete), 405862 (`bJ$`=CronList), 406035 (`aSH`=RemoteTrigger),
  406403 (`Q$H`=PushNotification), 406635 (`rd`=TeamCreate), 406779 (`Oo`=TeamDelete), 407457
  (`cf`=SendMessage).
- **Runtime corroboration:** this session's opening `<system-reminder>` listed 20 deferred tools — a
  clean subset of the 27 — and `ScheduleWakeup` appeared as a **non-deferred regular tool** despite its
  `shouldDefer: !0`, which is only possible via `pp` rule 7 (kairos-loop gate on). Each of the 7
  not-listed tools is independently explained (rule-7 / MCP-absent / feature-disabled).
- **Verdict:** PASS. `AskUserQuestion`/`StructuredOutput`/`Skill`/`PowerShell`/`TestingPermission` do
  **not** declare `shouldDefer` in 2.1.156 (the 2.1.142 doc's list was approximate); corrected.

**`tool_reference` lifecycle.**

| Stage | Claim | Source | Verdict |
|-------|-------|--------|---------|
| Produce | ToolSearch emits `{type:"tool_reference",tool_name}` | 404503 | ✅ |
| Scan | `extractDiscoveredToolNames` rebuilds discovered set | `P8H` 424834 (called 556980) | ✅ |
| Assemble | request tools = non-deferred + ToolSearch + discovered-deferred | 556979-556990 | ✅ |
| Defer flag | discovered deferred tool still ships `defer_loading:true` | `W = J.has(name) || RLz(...)`, `deferLoading:W(BH)` 556997-557009 | ✅ |
| Beta | tool-search beta added when on & not bedrock; provider-specific | `oEK` 130461, apply 556992-556994; consts 98125-98126 | ✅ |
| Strip (gone) | refs to vanished tools → `[…tools no longer available]` | `jQ_` 444299-444345 | ✅ |
| Strip (off) | tool-search-off → strip all refs → `[…tool search not enabled]` | `Mi6` 444337, dispatch 557022-557033 | ✅ |
| Guard | undiscovered deferred-tool call → "ToolSearch select:<name> first" | `zS_` 409866-409882 | ✅ |

- **PASS: 18 / 18**

## C5 — Unchanged contract (regression guard)

Verified byte-stable from 2.1.88 → 2.1.156: input/output schemas (404249-404266 vs ToolSearchTool.ts:21-45),
`maxResultSizeChars: 1e5`, `isReadOnly/isConcurrencySafe: true`, `userFacingName: ""`,
`tool_reference` success encoding, `select:`/keyword/`+required` query forms, `alwaysLoad`→MCP→
ToolSearch→Agent→Brief→SendUserFile prefix of the defer ladder, `defer_loading` semantics, fingerprint
cache (`names.sort().join(",")`), and the compact carry-across.

## C7 — `tool_reference` lifecycle + `shouldDefer` set vs 2.1.88 named source (14 samples)

Dedicated cross-validation of the newest content against `/lyz/codespace/3rd/claude-code/src` (the
named TypeScript reconstruction), to confirm the lifecycle claims aren't 2.1.156-only assertions.

| Element | 2.1.156 | 2.1.88 | Match |
|---------|---------|--------|-------|
| Request-tools 3-way filter (non-deferred + ToolSearch + discovered) | 556979-556990 | `claude.ts:1154-1172` (same comments) | ✅ byte-identical structure |
| Schema builder gets **full** pool (not filtered) | `w08(BH,{tools:K,…})` 557003-557005 | `claude.ts:1232-1241` ("list ALL available MCP tools") | ✅ |
| `willDefer` = search-on && (deferred ‖ LSP-defer) | `W = D && (J.has ‖ RLz)` 556997 | `claude.ts:1208-1209` | ✅ |
| `RLz` = `shouldDeferLspTool` | `RLz` 556787 (`isLsp` + init pending/not-started) | `claude.ts:786-793` | ✅ byte-identical |
| Beta constants | `V76`/`XY$` 98125-98126 | `constants/betas.ts:13-14` | ✅ identical strings |
| Beta provider→header map | `oEK` 130461: 3P for vertex/bedrock/**mantle/gateway** | `betas.ts:202-208`: 3P for vertex/bedrock | ⚠ **DELTA** (mantle+gateway added) |
| Beta apply (search-on, exclude bedrock from array) | 556992-556994 | `claude.ts:1174-1181` | ✅ |
| Strip refs for gone tools → "…no longer available" | `jQ_` 444299 | `messages.ts:1536-1600` | ✅ same placeholder |
| Strip all refs when search off → "…not enabled" | `Mi6` 444337 | `messages.ts:1673-1717` | ✅ same placeholder |
| Strip `caller` from `tool_use` when search off | `yG4` 444355 | `messages.ts:1733-1747` | ✅ |
| Undiscovered-tool hint (`select:<name>` first) | `zS_` 409866-409882 | `toolExecution.ts:585-596` | ✅ byte-identical text + gates |
| `shouldDefer` set | 27 tools (§2.1) | 26 tools (`grep tools/`) | ⚠ **DELTA** (see below) |
| — removed in 2.1.156 | (absent) | AskUserQuestion `AskUserQuestionTool.tsx:113`, Config `ConfigTool.ts:86` | ✅ confirmed |
| — added in 2.1.156 | Monitor 378969, ScheduleWakeup 402239, PushNotification 406403 | (absent) | ✅ confirmed |

- **PASS: 14 / 14** (12 byte/structural matches + 2 confirmed deltas)

**Verdict:** the entire `tool_reference` lifecycle (assembly, defer-flag, strip, hint) is a faithful
2.1.88 precursor — the docs' lifecycle claims hold against an independent named source, not just the
obfuscated bundle. The only two 2.1.156 deltas in this area are the beta provider map (+mantle/gateway)
and the `shouldDefer` set (−AskUserQuestion/Config, +Monitor/ScheduleWakeup/PushNotification), both
confirmed at source on both sides.

---

## Summary

- **C1 symbol existence:** 41/41 PASS
- **C2 line/symbol pairing:** 41/41 PASS
- **C3 behavioral claims:** 10/10 PASS
- **C4 asserted deltas:** 8/8 confirmed (6 NEW, 1 REMOVED, 1 version-attributed to 2.1.153)
- **C5 contract regression:** no regressions
- **C6 shouldDefer inventory + tool_reference lifecycle:** 18/18 PASS (27-tool inventory verified +
  runtime-corroborated; 8-stage lifecycle each anchored)
- **C7 lifecycle + shouldDefer set vs 2.1.88 named source:** 14/14 PASS (12 byte/structural matches +
  2 confirmed deltas: beta provider map +mantle/gateway; shouldDefer set −AskUQ/Config +Monitor/
  ScheduleWakeup/PushNotification)

**Overall confidence: HIGH.** Every analytical conclusion in `tool_search.md` and `deferred_tools.md`
is backed by a directly-read 2.1.156 source line, cross-checked against the named 2.1.88 TypeScript
reconstruction. The only doc-vs-prior-doc discrepancy (the 2.1.142 "Skill" defer rule) is explicitly
flagged in `deferred_tools.md § 2` as not present in 2.1.156, with the actual rule-7 slot
(`ScheduleWakeup + hwH()`) documented from source.
