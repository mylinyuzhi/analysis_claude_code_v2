# by_version Cross-Validation Roll-Up — v2.1.183 tree

**Scope:** the 22 per-version analysis files in
`/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.183/analyze/by_version/`
(`2.1.157.md` … `2.1.183.md`).

**Method:**
1. **Citation audit** — sampled 50+ cited `cli_inner_pretty.js:<line>` anchors spread across all 22 files,
   weighted toward the large/xlarge releases (.157 / .162 / .169 / .172 / .176 / .178 / .181 / .183), and re-opened
   each at its line in the **v2.1.183** bundle
   (`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`, 699,346 lines).
2. **Before-picture spot-check** — re-opened 9 anchors tagged "v2.1.156 / before-picture" in the **v2.1.156** bundle
   (`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`, 649,979 lines).
3. **Format scan** — all 22 files for: forbidden obf→readable mapping tables, presence of `## See also`,
   relative-link resolution (`../<module>/`, `../00_overview/`, `../../../claude_code_v_2.1.156/analyze/`),
   prev/next nav, and English-only.

**Verdict: PASS.** Every sampled current-bundle anchor and every sampled before-picture anchor resolves to the
declaration the doc claims. One broken relative link (`../43_model_opus48/` in `2.1.167.md`) was found and **fixed**
(re-pointed to the real `../07_compact/fallback_model_in_compaction.md`, the same target `2.1.166.md` uses for the
fallback-model work). No forbidden mapping tables; all 22 files carry `## See also` + prev/next nav; all relative
links (including cross-tree `../../../`) now resolve; no non-English content.

---

## 1. Citation audit — v2.1.183 bundle (current anchors)

All anchors are `cli_inner_pretty.js:<line>` in the v2.1.183 bundle. "Verified declaration" is the literal token
found at (or spanning) the cited line.

| # | File | Anchor | Claimed | Verified declaration @ line | Result |
|---|------|--------|---------|------------------------------|--------|
| 1 | 2.1.157 | 602703-602726 | `claude plugin init` command registration | range contains `.command("init <name>")` + description "Scaffold a new plugin at ~/.claude/skills/<name>/ (auto-loads next session as <name>@skills-dir)" (decl `u2l` @602716) | PASS |
| 2 | 2.1.157 | 661062 | `dispatchDefaultsWithAgent` (`LJl`) | `function LJl(e){ let t = e?.agent ?? jr().agent; …}` | PASS |
| 3 | 2.1.157 | 145332 | `buildToolParameters` (`Skt`), OTEL-gated | `function Skt(e,t,n){ let r={}; if(!wA()) return r; …}` | PASS |
| 4 | 2.1.157 | 183572 | `imageToBlockWithFallback` (`XM`) | `async function XM({ data:e, mediaType:t, limits:n }){ … }` | PASS |
| 5 | 2.1.158 | 134546 | `providerAllowsAutoMode` (`yxt`) | `function yxt(e){ if(e==="firstParty"||e==="anthropicAws") return !0; return st(process.env.CLAUDE_CODE_ENABLE_AUTO_MODE); }` | PASS |
| 6 | 2.1.159 | 848 | bundle metadata `VERSION:"2.1.183"` | line 848 = `claude-code/${{ … VERSION:"2.1.183" … }.VERSION}` | PASS |
| 7 | 2.1.160 | 574833-574863 | sensitive-file check precedes `acceptEdits` auto-allow | safety check `Htt(…)` → `if(!u.safe){…}` precedes `if(n.mode==="acceptEdits"&&d) return {behavior:"allow"…}` | PASS |
| 8 | 2.1.160 | 447013 | `parseGrepTarget` (`vBp`) | `function vBp(e){ let t; try { t = lE(e); …}` | PASS |
| 9 | 2.1.161 | 10300 | OTEL attr redactor (`Kor`) | `function Kor(e){ … t[n] = f3o.test(n) ? "[REDACTED]" : r; …}` | PASS |
| 10 | 2.1.162 | 586457-586469 | `resolveToolPermissions` sets searchToolsOptIn for Glob/Grep | `u = !!n && … xfo(n.join(" ").trim()) !== null` → `bnr([_u, Uc].some(…))` | PASS |
| 11 | 2.1.162 | 283351 | `resolveMcpToolTimeout` (`mGd`), sub-1000ms ignored | `function mGd(e){ … e.timeout >= 1000 ? e.timeout : void 0 … Math.min(Math.max(r,1000), dra); }` | PASS |
| 12 | 2.1.162 | 574675 | `matchesPathRule` (`uye`), Windows backslash+case fold | `function uye(e,t){ … if(Kt()==="windows" && n.includes("\\")) n = ND(n); …}` | PASS |
| 13 | 2.1.163 | 593560 | `evaluateVersionPolicy` (`UBl`) | `function UBl({ currentVersion, requiredMinimumVersion, requiredMaximumVersion, topLevelCommand }){…}` | PASS |
| 14 | 2.1.163 | 509983 | `/plugin list` `--enabled/--disabled` filter | `case "list": case "ls": { … find(o => o==="--enabled"||o==="--disabled") … }` | PASS |
| 15 | 2.1.165 | 897 | bundle metadata `VERSION:"2.1.183"` | line 897 = `VERSION: "2.1.183",` | PASS |
| 16 | 2.1.166 | 149264 | `resolveFallbackModelChain` (`SAi`) | `function SAi(e){ let t = e.cli.fallbackModel?.split(",") ?? …; }` | PASS |
| 17 | 2.1.167 | (provenance only) | bundle metadata `VERSION:"2.1.183"` | shares the metadata object at 848/897 (see #6/#15) | PASS |
| 18 | 2.1.168 | 897 | bundle metadata `VERSION:"2.1.183"` | line 897 = `VERSION: "2.1.183",` | PASS |
| 19 | 2.1.169 | 763 | safe-mode gate (`Nl`) | `function Nl(){ return st(process.env.CLAUDE_CODE_SAFE_MODE) || Uzt("--safe-mode"); }` | PASS |
| 20 | 2.1.169 | 392809 | `isBundledSkillsDisabled` (`oV`) | `function oV(e){ return Ge.CLAUDE_CODE_DISABLE_BUNDLED_SKILLS || (e ?? jr()).disableBundledSkills === !0; }` | PASS |
| 21 | 2.1.169 | 466082-466096 | `sweepInUseLocks` (`Dtl`) | `async function Dtl(e){ if(e.length===0) return; … }` (ends @466096) | PASS |
| 22 | 2.1.169 | 225660 | `claudeMdWarnThreshold` (`NCe`), context-scaled | `function NCe(e=Gs()){ … return Math.max(TNi, Math.round(n * vNi * ww(e))); }` | PASS |
| 23 | 2.1.169 | 499635 | MCP reconnect "stop retry on disabled server" | `if(RL(L.name)){ on(L.name,"Server disabled during reconnection, stopping retry"); …}` | PASS |
| 24 | 2.1.170 | 95138 | `fable5ModelEntry` (`MHe`) | `MHe = { firstParty:"claude-fable-5", bedrock:"us.anthropic.claude-fable-5", vertex:"claude-fable-5", … }` | PASS |
| 25 | 2.1.170 | 230192 | `fableOverageConsentPrompt` (`nge`) | `nge = Kh({ kind:"fable_overage_consent_prompt", … })` | PASS |
| 26 | 2.1.170 | 570534 | `shouldSkipSessionPersistence` (`dV`) | `function dV(){ … (XRl()==="test" && !e) || y3() || …CLAUDE_CODE_SKIP_PROMPT_HISTORY… || u1e(); }` | PASS |
| 27 | 2.1.170 | 103473 | `isNestedInteractiveClaudeSession` (`u1e`) | `function u1e(){ … Ge.CLAUDE_CODE_CHILD_SESSION && VI() && !em() … }` | PASS |
| 28 | 2.1.172 | 45604 | AWS region resolver (`Rfr`) | `function Rfr(){ let e = Ge.AWS_REGION || Ge.AWS_DEFAULT_REGION; … }` | PASS |
| 29 | 2.1.172 | 388064-388065 | `locCounterRecord` carries type+model | `MKt()?.add(r,{type:"added",model:t}); MKt()?.add(o,{type:"removed",model:t});` | PASS |
| 30 | 2.1.173 | (current) 98586 tagged before | (before-picture; see §2 row B6) | — | (see §2) |
| 31 | 2.1.174 | 489517 | backoff-schedule builder (`I6p`) | `function I6p(e=!1,t=1,n=!1,r=!0){ return { time:0, mult:t, … } }` | PASS |
| 32 | 2.1.174 | 227389 | default-Sonnet resolver (`wBi`) | `function wBi(){ let e = process.env.ANTHROPIC_DEFAULT_SONNET_MODEL; … }` | PASS |
| 33 | 2.1.176 | 516571 | `generateSessionTitle` (`Eue`) language directive | `async function Eue(e,t){ … let r = jr().language; … }` | PASS |
| 34 | 2.1.176 | 136419-136434 | `awsCredentialResolver` (`n4`) | `n4 = j$e(async () => { … v("[API:auth] AWS credential resolve start"); … })` | PASS |
| 35 | 2.1.176 | 102453 | `resolveClassifierOpus` (`awt`) | `function awt(e){ let t = Ge.ANTHROPIC_DEFAULT_OPUS_MODEL; … }` | PASS |
| 36 | 2.1.178 | 585532 | `evaluateParameterRules` (`V9t`) | `function V9t(e,t,n,r){ let o = lOe(t); for(let s of [o, ...Enn(o, e.toolAliases)]) … }` | PASS |
| 37 | 2.1.178 | 424241 | Agent tool `checkPermissions` auto-mode routing | `async checkPermissions(e,t){ if(Br(t).mode==="auto") return {behavior:"passthrough", message:"Agent tool requires permission to spawn subagents."}; …}` | PASS |
| 38 | 2.1.178 | 475363 | `isRefusalTitle` (`KWp`) | `function KWp(e){ let t = e.trim(); return t==="" || zWp.test(t); }` | PASS |
| 39 | 2.1.178 | 96256 | `readCredentialFromFd` (`/proc/self/fd`, 64 KB cap) | `let l = \`/proc/self/fd/${a}\`, c = xze(l,{maxBytes:HTr}).trim(); …` | PASS |
| 40 | 2.1.178 | 467674 | keep-marketplace-on-failure guard | `if(st(process.env.CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE)){ … marketplace.json … }` | PASS |
| 41 | 2.1.179 | 583848-583924 | `finalizePartialStreamOnDrop` synth stop-reason | `if(Ve) zi = "stale_connection"; …` (stream-drop trailer synth) | PASS |
| 42 | 2.1.179 | 449929 | `capPathListForPrompt` (`RWe`) | `function RWe(e){ if(!e||e.length<=_Ao) return e; … \`... and ${t} more (truncated for prompt size)\` }` | PASS |
| 43 | 2.1.181 | 479892 | `applyConfigPair` (`pqp`) | `function pqp(e,t,n){ … G("tengu_config_shorthand",{key_hash:Dp(e),matched:r!==void 0}); … "isn't a /config setting" }` | PASS |
| 44 | 2.1.181 | 209500-209509 | Apple-Events sandbox rules (opt-in) | `…(p ? ["; Apple Events - opt-in…","(allow appleevent-send)", …] : …)` | PASS |
| 45 | 2.1.181 | 606236 | `isClientPresent` (`ECf`) | `async function ECf(){ let e = Ge.CLAUDE_CLIENT_PRESENCE_FILE; if(!e) return !1; … }` | PASS |
| 46 | 2.1.181 | 136428-136433 | `awsCredentialCacheTtl`, Expiration-aware | `let t = e?.expiration, n = t===void 0 ? void 0 : t - Date.now(); if(n===void 0 || n <= Mti+G8u) return j8u;` | PASS |
| 47 | 2.1.183 | 369316-369331 | auto-mode soft-deny rules text | `<user_soft_deny_rules_to_replace>- Git Destructive: … - Code from External: \`curl | bash\` … - Cloud Storage Mass Delete: …` | PASS |
| 48 | 2.1.183 | 694437 | print-mode model deprecation warning (call site) | `let Jn = (a.continue||a.resume||ae) && !pRo() ? null : Zwo(Is ?? so); if(Jn && R!=="json" && R!=="stream-json") a5(Jn);` (`Zwo` decl @549627) | PASS |
| 49 | 2.1.183 | 55886-55890 | `attributionSessionUrlSetting` (`sessionUrl`) | `sessionUrl: H.boolean().optional().describe("Whether to append the claude.ai session link to commits and PRs created from web or Remote Control sessions (default: true)…")` | PASS |
| 50 | 2.1.183 | 552913-552919 | `serializeThinkingFlags` (`--thinking-display` gate) | `M.push("--thinking","disabled"); … case "adaptive": M.push("--thinking","adaptive");` | PASS |
| 51 | 2.1.183 | 428659-428683 | `webSearchNestedCall` (force `web_search`, Foundry guard) | `if(Ir()==="foundry" && !Zoe(u,"web_search")) throw Error("Web search is not available on this Foundry deployment.");` | PASS |
| 52 | 2.1.183 | 274617 | `mcpAuthStubTools` (`Jxn`), headless suppression | `function Jxn(e,t){ if(xr()) return []; return [p2d(e,t), f2d(e)]; }` | PASS |
| 53 | 2.1.183 | 458928-458962 | `thinkingOnlyReprompt` | `if((An==="end_turn"||An==="stop_sequence") && !xe?.isApiErrorMessage && a!=="compact" …)` → `Le("query_thinking_only_response")` @458962 | PASS |
| 54 | 2.1.183 | 466651-466671 | `dedupePluginSkills` | dedupe loop: "Skipping duplicate plugin skill '…' — … already loaded as '…'" / "already surfaced by the skills directory load" | PASS |
| 55 | 2.1.183 | 606139-606215 | `classifyDeliveryOrigin` (`k8t`) | `function k8t(e,t){ … if(t && lCf.has(t)) return {kind:"task-notification"}; if(t && aCf.has(t)) return {kind:"human"}; }` ; trigger set `lCf = {scheduled_trigger, force_run_trigger, github_webhook_trigger, fire_routine, pr_steward}` @606215 | PASS |
| 56 | 2.1.175 | 55917-55921 | `enforceAvailableModels` settings schema | `enforceAvailableModels: H.boolean().optional().describe("When true and availableModels is a non-empty array, the Default model selection is also constrained: …")` | PASS |

**Current-anchor result: 55/55 PASS** (provenance row #17 reuses the verified metadata object; row #30 is a
before-picture anchor counted in §2).

### Note on cited-range start lines
Several citations name a **line range** (e.g. `602703-602726`, `574833-574863`). In a few cases the named
declaration begins a handful of lines *after* the cited range-start (e.g. the `init <name>` registration is at 602720
inside the 602703-602726 window; `editWritePermissionEvaluator`'s sensitive-file branch sits inside its 574833-574863
window). In every sampled case the **claimed code is contained within the cited range** and the surrounding text
correctly names where the declaration sits — so these are accurate range citations, not misses.

---

## 2. Before-picture spot-check — v2.1.156 bundle

Anchors tagged "v2.1.156" / "before-picture", re-opened in
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`.

| # | File | Anchor (v2.1.156) | Claimed "before" | Verified declaration | Result |
|---|------|-------------------|------------------|----------------------|--------|
| B1 | 2.1.157 | 460601-460613 | pre-Fable pinned-model row (`Xi_`) | `function Xi_(H){ let $ = $w(H); if(!$) return null; … }` | PASS |
| B2 | 2.1.157 | 176569-176584 | old image converter `Vv` calling `WjH` with no try/catch | `async function Vv({data:H, mediaType:$, limits:q}){ … z = await WjH(K, K.length, _, q); … }` | PASS |
| B3 | 2.1.157 | 268572 | old `tool_decision` emitted only 4 fields | `j1("tool_decision", { decision:f, source:j, tool_name:p7(K.name), tool_use_id:Y })` | PASS |
| B4 | 2.1.157 | 590898-590907 | only the query-image loop caller caught the resize error | `let a = await weK(r, V); if(a.dimensions){ … }` (catch at the single call site) | PASS |
| B5 | 2.1.157 | 614999 | old backspace handler with a different `Q.current` guard | `} else if (FH.name === "backspace" && !Q.current) { FH.preventDefault(); E("prompt"); return; }` | PASS |
| B6 | 2.1.173 | 98586 | alias list without `fable` | `E4H = ["sonnet","opus","haiku","best","sonnet[1m]","opus[1m]","opusplan"]` (no `fable`) | PASS |
| B7 | 2.1.176/181 | 131124-131135 | old AWS STS export shape | `if(!y3K(q)) throw Error("awsCredentialExport did not return valid AWS STS output structure"); return { accessKeyId: q.Credentials.AccessKeyId, … }` | PASS |
| B8 | 2.1.176/181 | 97996-98008 | old STS-shape validator (`y3K`) | `function y3K(H){ … if(!$.Credentials || typeof $.Credentials!=="object") return !1; … }` | PASS |
| B9 | 2.1.181 | 471855-471860 | old settings-validation high-priority warning notification | `if(K.length>0){ let O = \`Found ${K.length} settings ${K.length===1?"issue":"issues"} · /doctor for details\`; $({ key:Ph4, text:O, color:"warning", priority:"high", timeoutMs:60000 }); }` | PASS |

**Before-picture result: 9/9 PASS** (target was ≥5).

---

## 3. Format scan — all 22 per-version files

| Check | Result | Detail |
|-------|--------|--------|
| No forbidden obf→readable **mapping tables** | PASS | No `## Symbol Mapping` / `## Symbol Index Reference` headers; no `\| Obfuscated \| Readable \|` table headers; no two-column backtick obf→name tables. Snippets use the dual-version `// Mapping:` comment line (allowed), not tables. |
| Every file has `## See also` | PASS | 22/22 present. |
| Prev/next version nav | PASS | 22/22 carry Prev/Previous + Next links. |
| Relative links `../<module>/`, `../00_overview/` resolve | PASS (after 1 fix) | 1 broken link found and fixed: `2.1.167.md` `../43_model_opus48/` (no such dir) → re-pointed to `../07_compact/fallback_model_in_compaction.md`. All others resolve. |
| Cross-tree `../../../claude_code_v_2.1.156/analyze/…` resolve | PASS | All sampled cross-tree links (`by_version/2.1.150.md`, `2.1.153.md`, `2.1.154.md`, `36_background_agents/README.md`) exist. |
| English-only | PASS | No CJK / non-Latin script in any file. |

### Fix applied
- **`by_version/2.1.167.md`** — broken module link `[../43_model_opus48/](../43_model_opus48/)` (directory does not
  exist in this tree; the only module dirs are `00_overview`, `07_compact`, `30_agent_team`, `31_auto_memory`,
  `36_background_agents`, `42_workflow`) → changed to
  `[../07_compact/fallback_model_in_compaction.md](../07_compact/fallback_model_in_compaction.md)`, matching how
  `2.1.166.md` (the release that actually ships the `fallbackModel` work) links the same subject.

---

## 4. Verdict

**PASS.** The by_version corpus is source-faithful: every one of the 55 sampled current-bundle anchors and all 9
sampled v2.1.156 before-picture anchors resolve to the exact declaration claimed, including the trickier
range-citations where the named declaration sits a few lines inside the cited window. The corpus is also
format-clean — no forbidden mapping tables, universal `## See also` + prev/next nav, English-only, and (after the one
`2.1.167.md` fix) all relative and cross-tree links resolve. No high- or medium-severity issues remain open.
