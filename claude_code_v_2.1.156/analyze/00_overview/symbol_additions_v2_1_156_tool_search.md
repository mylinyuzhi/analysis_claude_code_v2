# Symbol Additions — v2.1.156 ToolSearch & Deferred-Tool Loading

These mappings consolidate every obfuscated identifier referenced by the **ToolSearch** and
**deferred-tool (defer-loaded) loading** analysis for v2.1.156: the `ToolSearch` tool object and its
schemas, the keyword-search scorer, the enablement/mode machinery (`isToolSearchEnabledOptimistic`,
`getToolSearchMode`, `auto:N` thresholds, model/provider gating), the `isDeferredTool` predicate, the
deferred-tools delta diff + system-reminder rendering, and the `tool_reference` discovery scan.

Each row gives the v2.1.156 obfuscated identifier, the readable name, `file:line`, and type. Every
line was verified by reading
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` at that location.

Cross-validated against:
- v2.1.156 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/` —
  `tools/ToolSearchTool/{ToolSearchTool.ts,prompt.ts,constants.ts}`, `utils/toolSearch.ts`,
  `utils/api.ts`
- Module docs: `claude_code_v_2.1.156/analyze/04_tools/{tool_search,deferred_tools}.md`
- Prior-version docs: `claude_code_v_2.1.142/analyze/04_tools/{tool_search,deferred_tools}.md`

> **Readable-name provenance:** every readable name below is the *actual exported identifier* from
> the v2.1.88 named TypeScript reconstruction (the `Jc6`/`UZ8`/`WG6` namespace objects in the bundle
> export the same names — e.g. `X$(Jc6, { isToolSearchEnabledOptimistic: () => wE, … })` at
> cli_inner_pretty.js:424654-424667 wires `wE`→`isToolSearchEnabledOptimistic` directly). This is not
> an inferred mapping; it is the bundle's own export table.

---

## Module: ToolSearch Tool (core execution)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `wV$` | `ToolSearchTool` (the tool object, built via `yK`/buildTool) | cli_inner_pretty.js:404286 | object |
| `wf4` | `inputSchema` (`{query, max_results?}`, lazy) | cli_inner_pretty.js:404249 | function |
| `Df4` | `outputSchema` (`{matches, query, total_deferred_tools, pending_mcp_servers?}`) | cli_inner_pretty.js:404259 | function |
| `Jf4` | ToolSearch namespace export (`X$(Jf4, {outputSchema, inputSchema, clearToolSearchDescriptionCache, ToolSearchTool})`) | cli_inner_pretty.js:404122-404128 | object |
| `l3` | `TOOL_SEARCH_TOOL_NAME` (`"ToolSearch"`) | cli_inner_pretty.js:216132 | constant |
| `r18` | `getPrompt` (returns `Vk5 + vk5`) | cli_inner_pretty.js:216884 | function |
| `Vk5` | `PROMPT_HEAD` (`"Fetches full schema definitions… <system-reminder> messages."`) | cli_inner_pretty.js:216889 | constant |
| `vk5` | `PROMPT_TAIL` (query-forms + result-format text) | cli_inner_pretty.js:216892 | constant |
| `pZ8` | `getToolDescriptionMemoized` (per-tool prompt text, memoized by name) | cli_inner_pretty.js:404267 | function |
| `py_` | `MCP_WAIT_BUDGET_MS` (`5000`) | cli_inner_pretty.js:404234 | constant |

## Module: ToolSearch Search Algorithm & Cache

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jf4` | `searchToolsWithKeywords` (exact → mcp-prefix → required/optional scored) | cli_inner_pretty.js:404164 | function |
| `Mf4` | `parseToolName` (→ `{parts, coarseParts, full, isMcp}`) | cli_inner_pretty.js:404144 | function |
| `Qy_` | `compileTermPatterns` (word-boundary RegExp map) | cli_inner_pretty.js:404159 | function |
| `reH` | `buildSearchResult` (output `{data:{…}}` builder) | cli_inner_pretty.js:404141 | function |
| `Of4` | `maybeInvalidateCache` (fingerprint-based clear) | cli_inner_pretty.js:404134 | function |
| `Uy_` | `getDeferredToolsCacheKey` (`names.sort().join(",")`) | cli_inner_pretty.js:404129 | function |
| `Fy_` | `clearToolSearchDescriptionCache` | cli_inner_pretty.js:404138 | function |
| `aQ6` | `cachedDeferredToolNames` (last-seen fingerprint, init `null`) | cli_inner_pretty.js:404235 | variable |
| `W9` | `findToolByName` (tools, name) | cli_inner_pretty.js:143471 | function |
| `UR` | `getMcpInfo` (resolves `{serverName, toolName}` for a tool name) | cli_inner_pretty.js:50920 | function |
| `u9` | `stripMcpServerPrefix` (strip `mcp__<server>__`) | cli_inner_pretty.js:50915 | function |
| `vR` | `escapeRegExp` | cli_inner_pretty.js:9649 | function |

## Module: ToolSearch Enablement / Mode (platform)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Jc6` | toolSearch-util namespace export object | cli_inner_pretty.js:424653-424667 | object |
| `wE` | `isToolSearchEnabledOptimistic` | cli_inner_pretty.js:424719 | function |
| `Dv$` | `isToolSearchEnabled` (definitive, async) | cli_inner_pretty.js:424768 | function |
| `Pc6` | `getToolSearchMode` (→ `"tst"|"tst-auto"|"standard"`) | cli_inner_pretty.js:424695 | function |
| `PX4` | `parseAutoPercentage` (`auto:N` → 0–100 \| null) | cli_inner_pretty.js:424668 | function |
| `Dx_` | `isAutoToolSearchMode` (`"auto"` \| `"auto:…"`) | cli_inner_pretty.js:424675 | function |
| `Lc6` | `getAutoToolSearchPercentage` | cli_inner_pretty.js:424679 | function |
| `WX4` | `getAutoToolSearchTokenThreshold` | cli_inner_pretty.js:424687 | function |
| `ZX4` | `getAutoToolSearchCharThreshold` | cli_inner_pretty.js:424692 | function |
| `k5H` | `modelSupportsToolReference` (negative test vs `Lx_`) | cli_inner_pretty.js:424713 | function |
| `Px_` | `getUnsupportedToolReferencePatterns` | cli_inner_pretty.js:424706 | function |
| `Lx_` | `DEFAULT_UNSUPPORTED_MODEL_PATTERNS` (`["haiku"]`) | cli_inner_pretty.js:424986 | constant |
| `$RH` | `isToolSearchToolAvailable` (ToolSearch present in pool) | cli_inner_pretty.js:424752 | function |
| `Wc6` | `isMcpLadderNonblockingEnabled` | cli_inner_pretty.js:424748 | function |
| `$s` | `isToolReferenceBlock` | cli_inner_pretty.js:424818 | function |
| `Xc6` | `DEFAULT_AUTO_TOOL_SEARCH_PERCENTAGE` (`10`) | cli_inner_pretty.js:424947 | constant |
| `Jx_` | `CHARS_PER_TOKEN` (`2.5`) | cli_inner_pretty.js:424948 | constant |
| `fVH` | `isExperimentalBetasDisabled` (`CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS`) | cli_inner_pretty.js:130470 | function |
| `xH` | `isEnvTruthy` | cli_inner_pretty.js:1795 | function |
| `k4` | `isEnvDefinedFalsy` | cli_inner_pretty.js:1801 | function |
| `Zq` | `getAPIProvider` (`"firstParty"|"vertex"|…`) | cli_inner_pretty.js:91853 | function |
| `Rz` | `isFirstPartyAnthropicBaseUrl` | cli_inner_pretty.js:91897 | function |

## Module: Deferred-Tool Predicate & Delta Protocol (core features)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `pp` | `isDeferredTool` (8-rule ladder) | cli_inner_pretty.js:216868 | function |
| `PG6` | `formatDeferredToolLine` (returns `tool.name`) | cli_inner_pretty.js:216881 | function |
| `WG6` | prompt namespace export (`isDeferredTool/getPrompt/formatDeferredToolLine/TOOL_SEARCH_TOOL_NAME`) | cli_inner_pretty.js:216861-216867 | object |
| `tg6` | `getDeferredToolsDelta` (5-state diff: added/readded/removed/unlisted/pending) | cli_inner_pretty.js:424861 | function |
| `P8H` | `extractDiscoveredToolNames` (scan `tool_reference` + compact-boundary carry) | cli_inner_pretty.js:424834 | function |
| `J08` | `summarizeByServerPrefix` (collapse `mcp__server__*` with counts) | cli_inner_pretty.js:424918 | function |
| `$qH` | `DEFERRED_DELTA_LIST_CAP` (`30`; inline-vs-summarized threshold) | cli_inner_pretty.js:424952 | constant |
| `yT8` | `AMBIENT_CONTEXT_NOTE` (do-not-narrate trailer) | cli_inner_pretty.js:446489 | constant |
| `n1H` | `ENTER_WORKTREE_TOOL_NAME` (`"EnterWorktree"`) | cli_inner_pretty.js:216098 | constant |
| `df` | `SCHEDULE_WAKEUP_TOOL_NAME` (`"ScheduleWakeup"`) | cli_inner_pretty.js:216099 | constant |
| `hwH` | `isKairosLoopDynamicEnabled` (`tengu_kairos_loop_dynamic` gate) | cli_inner_pretty.js:216001 | function |
| `sq` | `AGENT_TOOL_NAME` (`"Agent"`) | cli_inner_pretty.js:185637 | constant |
| `Gk5` | `BRIEF_TOOL_NAME` (assigned from `i1H.BRIEF_TOOL_NAME`) | cli_inner_pretty.js:216904 | constant |
| `Tk5` | `SEND_USER_FILE_TOOL_NAME` (assigned from `c18.SEND_USER_FILE_TOOL_NAME`) | cli_inner_pretty.js:216904 | constant |
| `aq` | `uniq` (dedupe array) | cli_inner_pretty.js:40716 | function |
| `H6` | `count` (count matching predicate) | cli_inner_pretty.js:40711 | function |

## Module: tool_reference Lifecycle (produce → scan → assemble → strip)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (anon, in `query` builder) | `buildRequestTools` (splits pool: non-deferred + ToolSearch + discovered-deferred) | cli_inner_pretty.js:556971-557015 | logic |
| `w08` | `buildToolSchema` (stamps `defer_loading` via `deferLoading` opt) | cli_inner_pretty.js:555969 | function |
| `RLz` | `shouldDeferLspTool` (defer LSP tool while LSP init `pending`/`not-started`; OR'd with `isDeferredTool` for `defer_loading`) | cli_inner_pretty.js:556787 | function |
| `oEK` | `getToolSearchBeta` (provider → which tool-search beta header) | cli_inner_pretty.js:130461 | function |
| `V76` | `ADVANCED_TOOL_USE_BETA` (`"advanced-tool-use-2025-11-20"`) | cli_inner_pretty.js:98125 | constant |
| `XY$` | `TOOL_SEARCH_TOOL_BETA` (`"tool-search-tool-2025-10-19"`; vertex/bedrock/mantle/gateway) | cli_inner_pretty.js:98126 | constant |
| `jQ_` | `stripUnavailableToolReferences` (drop refs to tools gone from pool → `[Tool references removed - tools no longer available]`) | cli_inner_pretty.js:444299 | function |
| `Mi6` | `stripAllToolReferences` (tool-search-off user-msg strip → `[Tool references removed - tool search not enabled]`) | cli_inner_pretty.js:444337 | function |
| `yG4` | `stripAssistantCaller` (drop `caller` field from `tool_use` when tool search off) | cli_inner_pretty.js:444355 | function |
| `zS_` | `undiscoveredToolHint` (corrective msg: call ToolSearch `select:<name>` first) | cli_inner_pretty.js:409866 | function |
| `JT` | `normalizeToolName` (strip/normalize for availability compare) | cli_inner_pretty.js:50959 | function |
| `h1` | `toolMatchesName` (tool vs name predicate) | cli_inner_pretty.js:143452 | function |

> **`shouldDefer: !0` tool-name constants (27).** The deferral opt-in (rule 9 of `isDeferredTool`).
> Each constant resolves to a string tool name; full inventory table with decl lines in
> `04_tools/deferred_tools.md § 2.1`. Constants: `z0`=NotebookEdit(212068), `WX`=WebFetch(206819),
> `ux`=WebSearch(216253), `mv`=TodoWrite(216258), `og`=EnterPlanMode(143385), `wv`=ExitPlanMode(143387),
> `n1H`=EnterWorktree(216098), `l18`=ExitWorktree(216288), `MJ`=Monitor(216210),
> `df`=ScheduleWakeup(216099), `ZrH`=LSP(276797), `NwH`=ListMcpResourcesTool(215307),
> `SL`=TaskCreate(216284), `nd`=TaskGet(216285), `rT`=TaskUpdate(216287), `Y0`=TaskList(216286),
> `nT`=TaskStop(216170), `Yo`=TaskOutput(216168), `cf`=SendMessage(216283), `rP`=CronCreate(216385),
> `dI`=CronDelete(216386), `bJ$`=CronList(216387), `aSH`=RemoteTrigger(405927),
> `Q$H`=PushNotification(216186), `rd`=TeamCreate(216438), `Oo`=TeamDelete(216439); plus the literal
> `"ReadMcpResourceTool"` (decl 404057).

## Shared helpers cited

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `yK` | `buildTool` (tool factory) | cli_inner_pretty.js:143482 | function |
| `v8` | `memoize` (= `cx8`) | cli_inner_pretty.js:1492 | function |
| `d` | `logEvent` (telemetry) | cli_inner_pretty.js (global) | function |
| `N` | `logForDebugging` | cli_inner_pretty.js (global) | function |
| `g8` | `sleep(ms, signal)` | cli_inner_pretty.js (global) | function |
| `V$` | `getFeatureValue_CACHED_MAY_BE_STALE` (GrowthBook) | cli_inner_pretty.js (global) | function |

---

## API-emission anchors (defer_loading wire field)

- `cli_inner_pretty.js:556008` — `if ($.deferLoading) M.defer_loading = !0;` — the per-request overlay
  that stamps `defer_loading: true` onto a tool's API schema.
- `cli_inner_pretty.js:557080` — `c.filter((s) => !("defer_loading" in s && s.defer_loading))` —
  filter that excludes deferred tools (e.g. token-count / non-deferred passes).
- `cli_inner_pretty.js:336466,336487,336503` — MCP-server config option text describing
  `alwaysLoad` = "Equivalent to setting `defer_loading: false` on the API".

## Delta-protocol anchors (attachment → reminder)

- `cli_inner_pretty.js:412679` — `E3("deferred_tools_delta", …)` attachment registration.
- `cli_inner_pretty.js:412961` — `return [{ type: "deferred_tools_delta", …z }]` attachment emission.
- `cli_inner_pretty.js:424868-424916` — `tg6` diff body + `tengu_deferred_tools_pool_change` event.
- `cli_inner_pretty.js:445673-445714` — `deferred_tools_delta` system-reminder rendering (4 sections).

## Telemetry events (verified at source)

- `tengu_tool_search_mcp_wait` — cli_inner_pretty.js:404368 (refresh/wait outcome).
- `tengu_tool_search_outcome` — cli_inner_pretty.js:404391 (per-call result).
- `tengu_sdk_mcp_false_unavailable` — cli_inner_pretty.js:404385 (select/keyword named a pending server).
- `tengu_tool_search_mode_decision` — cli_inner_pretty.js:424771 (definitive enable/disable + reason).
- `tengu_deferred_tools_pool_change` — cli_inner_pretty.js:424893 (delta diff metrics).
