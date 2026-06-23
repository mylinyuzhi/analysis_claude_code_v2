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

---

## 5. Coverage audit (2026-06-23) — every CHANGELOG bullet accounted for

**Scope of this pass:** an *exhaustive per-bullet* audit (distinct from §1's *sampled-anchor* citation audit). For
each of the 22 published releases, every enumerated bullet in [`../../CHANGELOG.md`](../../CHANGELOG.md) was diffed
against its `2.1.NN.md` by_version file to confirm the bullet is **addressed** somewhere in the file. A bullet counts
as covered when the file does any of: (a) analyzes it with a `cli_inner_pretty.js:<line>` anchor, (b) summarizes it +
links to a depth module (`30_agent_team` / `42_workflow` / `36_background_agents` / `07_compact` / `31_auto_memory`),
or (c) honestly flags it as a non-isolable timing/render/platform fix carrying **no** fabricated anchor. A bullet is a
gap only if it is unaddressed anywhere in the file, **or** it is plainly isolable and is mentioned without the source
anchor it should carry.

### 5.1 Method

Per-release CHANGELOG-bullet ↔ by_version-file diff: enumerate the release's bullets → locate each in the file →
classify covered/gap → for gaps, locate the patch by grepping a stable string (setting key, flag, `tengu_*` event,
prompt/error fragment) in the v2.1.183 bundle, read off the enclosing declaration, and confirm NEW/removed claims by
re-grepping the same stable string in the v2.1.156 bundle (never an obfuscated name — those are re-mangled between
builds).

### 5.2 Per-version covered/total counts

| Release | Covered/Total | Gaps filled | Notes |
|---------|---------------|-------------|-------|
| 2.1.157 | 27/27 (after fill) | **2** | §26 worktree-restore-dir fix (anchored), §27 sleep/wake date fix (non-isolable, depth-linked) |
| 2.1.158 | 1/1 | 0 | single-bullet auto-mode-on-3P release |
| 2.1.159 | 1/1 | 0 | internal-only checkpoint (provenance) |
| 2.1.160 | 27/27 | 0 | `workflow`→`ultracode` rename inflection |
| 2.1.161 | 22/22 | 0 | telemetry-correctness + secret-hygiene |
| 2.1.162 | 28/28 | 0 | "make the surfaces honest" |
| 2.1.163 | 22/22 | 0 | managed-fleet ergonomics |
| 2.1.165 | 1/1 | 0 | boilerplate release (provenance) |
| 2.1.166 | 21/21 | 0 | `fallbackModel` chain |
| 2.1.167 | 1/1 | 0 | boilerplate release (provenance) |
| 2.1.168 | 1/1 | 0 | boilerplate release (provenance) |
| 2.1.169 | 31/31 | 0 | troubleshooting + enterprise-hardening |
| 2.1.170 | 2/2 | 0 | Fable 5 launch (causal, out-of-scope) |
| 2.1.172 | 30/30 | 0 | nested subagents + focus cluster |
| 2.1.173 | 2/2 | 0 | Fable `[1m]` + Windows sandbox-warning |
| 2.1.174 | 13/13 | 0 | model-naming correctness sweep |
| 2.1.175 | 1/1 | 0 | `enforceAvailableModels` |
| 2.1.176 | 22/22 | 0 | localized titles + auth tightening |
| 2.1.178 | 24/24 | 0 | the agent-team redesign |
| 2.1.179 | 9/9 | 0 | "stop surfacing raw failure states" |
| 2.1.181 | 39/39 | 0 | flagship maintenance |
| 2.1.183 | 17/17 | 0 | auto-mode safety hardening |
| **Total** | **343/343** | **2** | every enumerated bullet across 22 releases accounted for |

**21 of 22 files were already complete** before this pass. Only `2.1.157.md` carried gaps (the window's largest fix
batch); both were filled.

### 5.3 Gaps filled — new source anchors

Both gaps were in **`2.1.157.md`**, appended as numbered §26 and §27 in CHANGELOG order, immediately after §25 and
before the trailing "File-level where to look" / Summary / See-also nav (all of which remain intact).

**§26 — `--worktree` / `--worktree --tmux` return to the current linked worktree, not the canonical repo root (FIX,
fully isolable, anchored).** Root cause: the `--worktree` launch runner `Gvf` (`cli_inner_pretty.js:598716-598748`)
must `process.chdir` to the canonical repo root `Nm(Pt())` so `git worktree add` is parented at the main repo, but the
session-worktree creator `b3t` derives `originalCwd = r?.fromCwd ?? Pt()` (`cli_inner_pretty.js:579989`). In v2.1.156
the equivalent runner `dPz` (`cli_inner_pretty.js:563122-563146` before-picture) passed **no** `fromCwd`, so after the
chdir, `DV$`'s `originalCwd = K?.fromCwd ?? C$()` (`cli_inner_pretty.js:554907` before-picture) captured the
post-chdir cwd = the canonical root, and exiting returned there. The fix threads `fromCwd: e` (the pre-chdir launch
dir = the linked worktree) into `b3t` at `cli_inner_pretty.js:598740`, so the session restores to the worktree the
user launched from. Covers both `--worktree` and `--worktree --tmux` (same runner, same `b3t` call). 0-diff verified:
v2.1.156 passed `Y ? { prNumber: Y } : void 0`; v2.1.183 passes `{ prNumber: a, fromCwd: e }`.

**§27 — background sessions re-attached after sleep/wake are told the correct (current) date (FIX, honestly flagged
non-isolable, depth-linked).** The conversation-side date stack is byte-identical between v2.1.156 and v2.1.183: the
memoize `SCe = wn(Itt)` (`cli_inner_pretty.js:220209-220222`), the `date_change` detector `ftl`
(`cli_inner_pretty.js:464855-464863`), the reminder text (`cli_inner_pretty.js:590591-590597`), the user-context
"Today's date is …" surface `M1i` (`cli_inner_pretty.js:222386-226664`), and the cache-clear `Jyo`
(`cli_inner_pretty.js:476428-476459`, clearing `SCe.cache` + `cyt(null)`) — and `date_change` resolves to the same 5
occurrences with identical strings in both bundles. So the fix is **not** a new date-logic declaration; it is a
wake/reattach-flow change in the background subsystem (the live wake path now invalidates the memoized date / re-runs
the attachment pipeline), correctly recorded as "not isolated to a single declaration" and cross-linked to
[`../36_background_agents/bg_command_surface_and_retire_delta.md`](../36_background_agents/bg_command_surface_and_retire_delta.md),
matching the existing non-isolable sections' style.

### 5.4 Genuinely non-isolable items (honestly recorded, no fabricated anchors)

The fill did not invent anchors for render/timing/flow fixes that the bundle does not isolate. Recorded as such:

- **2.1.157 §17** — pure rendering/timing fixes, explicitly "not isolated to a single decl."
- **2.1.157 §27** — the sleep/wake date fix above: a background reattach-flow change, date machinery byte-identical to
  v2.1.156, documented at the subsystem level (depth-linked), not pinned to a fabricated date-logic line.

These follow the corpus convention of stating the absence of an isolable declaration honestly rather than fabricating
a line number.

### 5.5 Re-verification of the filled anchors (PASS/FAIL)

Five anchors from the fill were re-opened in the bundles (v2.1.183 unless tagged otherwise):

| # | Anchor | Bundle | Expected | Result |
|---|--------|--------|----------|--------|
| C1 | 598727-598740 (`Gvf` runner, `fromCwd: e`) | 2.1.183 | `_ = await b3t(xt(), h, y, { prNumber: a, fromCwd: e })` after the `qEt(Pt())` chdir to `Nm(Pt())` | PASS |
| C2 | 579983-579992 (`b3t`, `originalCwd = fromCwd ?? cwd`) | 2.1.183 | `async function b3t(e,t,n,r){ … let o = r?.fromCwd ?? Pt(), s; …}` | PASS |
| C3 | 220209-220222 (`SCe = wn(Itt)`) | 2.1.183 | `function Itt(){ … return \`${t}-${n}-${r}\`; }` then `var SCe; … SCe = wn(Itt);` | PASS |
| C4 | 464855-464863 (`ftl` date_change detector) | 2.1.183 | `function ftl(e){ let t = Itt(); … if(SCe()===t) return []; … return [{ type:"date_change", newDate:t }]; }` | PASS |
| C5 | 476428-476442 (`Jyo` clears `SCe.cache` + `cyt(null)`) | 2.1.183 | `function Jyo(e=new Set(),t){ … SCe.cache.clear?.(), … cyt(null), …}` | PASS |
| C6 | 563122-563146 / 554907 (v2.1.156 before: `dPz`→`DV$`, no `fromCwd`) | 2.1.156 | runner calls `DV$(E$(), L, P, Y ? { prNumber: Y } : void 0)` (no fromCwd); `DV$` has `let _ = K?.fromCwd ?? C$()` | PASS |

**Re-verification result: 6/6 PASS** (target was ~5). The before-picture C6 confirms the 0-diff claim: v2.1.156's
runner genuinely omits `fromCwd`, so the `originalCwd` fell back to the post-chdir canonical root — exactly the bug
§26 fixes.

### 5.6 Format re-scan after the fill

Re-ran the §3 invariants over all 22 files after the fill:

| Check | Result | Detail |
|-------|--------|--------|
| `## See also` present | PASS | 22/22 (unchanged by the fill). |
| Prev/Next version nav | PASS | 22/22 — nav phrasing varies across files (`Prev:`/`Next:`, `Previous:`/`Next:`, `Adjacent versions: … (prev) … (next)`); all carry both directions (2.1.157 links the prior window as "Prev" via the cross-tree pointer and `2.1.158.md` as "Next"). |
| No forbidden obf→readable mapping tables | PASS | New §26/§27 use the allowed dual-version `// Mapping:` comment line and a key/value `\| \| \|` info table (not a two-column obf→readable mapping table). No `\| Obfuscated \| Readable \|` headers anywhere. |
| Relative links resolve | PASS | All `](../…)` / `](./…)` targets across the 22 analysis files resolve. The §26/§27 fill added only links to existing targets (`../36_background_agents/bg_command_surface_and_retire_delta.md`). The lone grep hit for `../43_model_opus48/` is the **quoted fix-note in §3 of this report**, not a live link in any analysis file. |
| English-only | PASS | No CJK/Japanese/Korean in any file. |

No new link or format breakage was introduced by the fill; nothing required re-fixing.

### 5.7 README theme reconciliation

The two filled §26/§27 items are both FIXes already encompassed by the existing `2.1.157` README theme line
("…`EnterWorktree` mid-session switch … and background worktree-retire fixes"): the worktree-restore-dir fix is a
worktree fix, and the sleep/wake date fix is a background-session fix. Neither materially shifts the release's theme
(plugin ergonomics + `claude agents`/worktree polish), so [`README.md`](./README.md) needs no change.

### 5.8 Overall coverage verdict

**PASS — full coverage.** All **343** enumerated CHANGELOG bullets across the 22 published releases (2.1.157 … 2.1.183)
are accounted for in their by_version files: anchored, depth-linked, or honestly flagged non-isolable. The only two
gaps (both in `2.1.157.md`) are filled — one with a verified dual-version source anchor (`Gvf`/`b3t` `fromCwd`), one
honestly recorded as a non-isolable background reattach-flow change (date machinery byte-identical to v2.1.156). Of the
re-verified filled anchors, **6/6 PASS**. The corpus remains format-clean (universal `## See also` + prev/next nav, no
forbidden mapping tables, all relative links resolving, English-only). No gaps remain open.

---

## 6. Adversarial cross-validation pass (2026-06-23) — independent coverage + citation re-check

A second, **adversarial** pass re-audited every one of the 22 per-version files from a *default-to-FAIL* posture:
each release was treated as guilty until each of its enumerated bullets was proven both (a) **covered** somewhere in
the file and (b) **citation-accurate** — every cited `cli_inner_pretty.js:<line>` anchor re-opened *fresh* in the
v2.1.183 bundle (`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`), and every
"before-picture" absence claim re-confirmed in the v2.1.156 bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`). The pass was split into a
**substantive** track (the large/medium releases with enumerable surfaces) and a **trivial/boilerplate** track (the
single-bullet internal/bug-fix checkpoints). This rollup independently re-sampled anchors from across both tracks to
corroborate the pass's own claims.

### 6.1 Method

Per-release, default-to-FAIL re-audit: (1) enumerate the release's bullets; (2) confirm each is addressed in the file
(anchored / depth-linked / honestly flagged non-isolable — never a fabricated line); (3) re-read every sampled anchor
*in source* and require the literal token at the cited line to match the asserted meaning; (4) re-confirm before-picture
absences in the 2.1.156 bundle by grepping the **stable string** (setting key, flag, `tengu_*` event, prompt/error
fragment), never an obfuscated name (those are re-mangled between builds). A citation is a FAIL if the cited line does
not carry the claimed declaration; a coverage item is a FAIL if a bullet is unaddressed or mentioned without the anchor
it should carry.

### 6.2 Per-release coverage + citation result

| Track | Release | Coverage | Citation | Fix |
|-------|---------|----------|----------|-----|
| substantive | 2.1.157 | PASS | PASS | — (the §26/§27 fills from §5 re-verified below) |
| substantive | 2.1.160 | PASS | **FIXED** | §6 `xr()` prose corrected (see 6.4) |
| substantive | 2.1.161 | PASS | PASS | — |
| substantive | 2.1.162 | PASS | PASS | — |
| substantive | 2.1.163 | PASS | PASS | — |
| substantive | 2.1.166 | PASS | PASS | — |
| substantive | 2.1.169 | PASS | PASS | — |
| substantive | 2.1.172 | PASS | **FIXED** | §14 `vFi` anchor repointed 229573→228964 (see 6.4) |
| substantive | 2.1.174 | PASS | PASS | — |
| substantive | 2.1.176 | PASS | **FIXED** | `_Fl` anchor repointed 794→594705-594717 (see 6.4) |
| substantive | 2.1.178 | PASS | PASS | — |
| substantive | 2.1.179 | PASS | PASS | — |
| substantive | 2.1.181 | PASS | PASS | — |
| substantive | 2.1.183 | PASS | PASS | — |
| trivial | 2.1.158 | PASS (1 bullet) | PASS (2 anchors) | — |
| trivial | 2.1.159 | PASS (1 bullet) | PASS (2 anchors) | — |
| trivial | 2.1.165 | PASS (1 bullet) | PASS (2 anchors) | — |
| trivial | 2.1.167 | PASS (1 bullet) | PASS (2 anchors) | — |
| trivial | 2.1.168 | PASS (1 bullet) | PASS (2 anchors) | — |
| trivial | 2.1.170 | PASS (2 bullets) | PASS (4 anchors) | — |
| trivial | 2.1.173 | PASS (2 bullets) | PASS (2 anchors) | — |
| trivial | 2.1.175 | PASS (1 bullet) | PASS (2 anchors) | — |

**Coverage: 22/22 PASS. Citation: 19/22 PASS, 3 FIXED.** The trivial track checked 18 anchors across 8 boilerplate
releases (all PASS), confirming each correctly documents its single no-enumerated-surface bullet plus VERSION-metadata
provenance — and that the per-release version strings (2.1.159 / .165 / .167 / .168) appear **zero** times in the
bundle (a build embeds only its own VERSION), validating each doc's honest "no NN-specific symbol to cite" stance.

### 6.3 Anchors re-sampled by this rollup (independent corroboration)

Eight anchors were re-opened directly in the v2.1.183 bundle (and line 794 in the same bundle) to corroborate the
pass's own claims rather than take them on trust:

| # | Origin | Anchor | Expected | Result |
|---|--------|--------|----------|--------|
| R1 | 2.1.160 fix | 3151-3152 | `function xr(){ return !Ot.isInteractive; }` — TRUE when NOT interactive | PASS |
| R2 | 2.1.172 fix | 228964-228965 | `function vFi(){ return st(process.env.CLAUDE_CODE_REMOTE); }` (and 229573 = `}` inside the AUP refusal builder) | PASS |
| R3 | 2.1.176 fix | 594705-594717 | `function _Fl(...)` env-builder; `CLAUDE_CODE_SESSION_NAME: e.seed?.name \|\| e.seed?.intent \|\| e.short` @594717; line 794 = unrelated Vertex AI region URL | PASS |
| R4 | 2.1.157 §26 | 579989 / 598740 | `b3t`'s `let o = r?.fromCwd ?? Pt()`; runner threads `_ = await b3t(xt(), h, y, { prNumber: a, fromCwd: e })` | PASS |
| R5 | 2.1.157 §27 | 476428-476442 | `Jyo` clears `SCe.cache` + `cyt(null)`; `ftl` @464855 is the `date_change` detector returning `[{ type:"date_change", newDate:t }]` | PASS |
| R6 | 2.1.158 | 134546-134549 | `function yxt(e){ if(e==="firstParty"\|\|e==="anthropicAws") return !0; return st(process.env.CLAUDE_CODE_ENABLE_AUTO_MODE); }` | PASS |
| R7 | 2.1.170 | 95139 | `firstParty:"claude-fable-5", bedrock:"us.anthropic.claude-fable-5", …` | PASS |

**Rollup re-sample result: 7/7 anchor groups PASS** (target was ~4). The deep re-verification of the new
**2.1.157 §26/§27** sections specifically confirms: §26's worktree-restore-dir fix is a real one-argument
change (`fromCwd: e` threaded into `b3t`, whose `originalCwd = r?.fromCwd ?? Pt()` previously fell back to the
post-chdir canonical root), and §27's sleep/wake date fix is correctly recorded as a *non-isolable* background
reattach-flow change — the underlying date machinery (`SCe`/`ftl`/`Jyo`) is byte-identical to v2.1.156, so no
date-logic line was fabricated.

### 6.4 Citation failures found and how they were fixed

All three were **single bad-anchor** failures (the bullet was covered; only the line pointer was wrong). Each fix
repointed the anchor to the verified site and adjusted prose where needed; coverage, `## See also`, and Prev/Next nav
were left intact:

- **`2.1.160.md` §6** — the prose described `xr()` as "this is the interactive CLI," but `xr()` at
  `cli_inner_pretty.js:3151-3152` returns `!Ot.isInteractive` (TRUE when **not** interactive). Corrected: `!xr()`
  (interactive) yields the `/model` picker; the `sdk-cli --model` branch is reached only when `xr()` is true
  (non-interactive). 3151-3152 anchor added. **Re-verified by this rollup: PASS** (R1).
- **`2.1.172.md` §14** — the "stopped promoting `/loop` in remote sessions" item cited the `vFi` remote-session
  predicate near line 229573, but `vFi` is at **228964** (`st(process.env.CLAUDE_CODE_REMOTE)`); 229573 is a bare `}`
  in the Usage-Policy refusal builder. Anchor repointed to 228964. **Re-verified by this rollup: PASS** (R2).
- **`2.1.176.md`** — the `--bg -cn <name>` session-name item carried a spurious `cli_inner_pretty.js:794` anchor
  (actually unrelated Vertex AI region code). Repointed to `_Fl`'s real bundle site **594705-594717**, with the
  `CLAUDE_CODE_SESSION_NAME: e.seed?.name || e.seed?.intent || e.short` seed at 594717. **Re-verified by this rollup:
  PASS** (R3).

### 6.5 Format re-scan after the fixes

Re-ran the §3/§5.6 invariants over all 22 files after the three fix-stage edits:

| Check | Result | Detail |
|-------|--------|--------|
| `## See also` present | PASS | 22/22 — unchanged by the fixes. |
| Prev/Next version nav | PASS | 22/22 carry both directions. |
| No forbidden obf→readable mapping tables | PASS | No `## Symbol Mapping` / `## Symbol Index Reference` headers, no `\| Obfuscated \| Readable \|` table headers anywhere. |
| Relative links resolve | PASS | Every `](../…)` / `](./…)` target across the 22 files resolves; the §5 `2.1.167.md` link fix (`../43_model_opus48/` → `../07_compact/fallback_model_in_compaction.md`) is in place. |
| English-only | PASS | No CJK/Japanese/Korean in any file. |

No fix-stage edit broke a format invariant; nothing required re-fixing.

### 6.6 Overall verdict (adversarial pass)

**PASS — high confidence.** Under a default-to-FAIL re-audit, all 22 per-version files are fully covered (343/343
bullets) and citation-clean after three single-anchor fixes (2.1.160, 2.1.172, 2.1.176). Every anchor this rollup
independently re-sampled (7/7 groups, spanning the three fixes, the new §26/§27 fills, and the 158/170 trivial track)
lands on the cited line with the asserted meaning matching the literal code, and the trivial track's 18 boilerplate
anchors plus zero-occurrence version-string checks all hold. The corpus remains format-clean across all invariants.
No coverage failure and no unresolved citation failure remain.
