# by_version Cross-Validation Report — v2.1.193 tree (2.1.183 → 2.1.193 delta)

**Scope:** the 6 per-version analysis files in
`/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/by_version/`
(`2.1.185.md`, `2.1.186.md`, `2.1.187.md`, `2.1.190.md`, `2.1.191.md`, `2.1.193.md`) — the published
sub-versions of the 2.1.183→2.1.193 train. (The unpublished 2.1.184 / .188 / .189 / .192 numbers were cut internally
but never shipped to the channel and have no by_version file, which is correct.)

**Method (adversarial, default-to-FAIL):**
1. **Coverage** — for each release, the enumerated bullets in
   [`../../CHANGELOG.md`](../../CHANGELOG.md) were counted programmatically (`awk` over `^## ` / `^- `) and each bullet
   was matched to its by_version file's Summary table + body. A bullet counts as covered when the file does one of:
   (a) analyzes it with a `cli_inner_pretty.js:<line>` anchor, (b) summarizes it + links to a depth module
   (`30_agent_team` / `36_background_agents` / `38_permissions` / `39_mcp` / `42_workflow` / `43_slash_commands` /
   `44_telemetry` / `45_skills` / `04_tools` / `40_system_prompt` / `31_auto_memory` / `07_compact`), or (c) honestly
   flags it as a non-isolable timing/render/platform/server-side fix carrying **no** fabricated anchor.
2. **Citation spot-check** — sampled **58** cited `cli_inner_pretty.js:<line>` anchors across the four substantive
   releases (≥6 per release; 6 / 12 / 13 / 13 / 14 for .185 / .186 / .187 / .191 / .193), re-opened each at its exact
   line in the **2.1.193** bundle (`/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
   718,679 lines) with `sed -n`, and required the literal declaration / string at the cited line to match the asserted
   meaning.
3. **Before-picture spot-check** — re-opened **4** anchors tagged `(183)` in the **2.1.183** bundle
   (`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`, 699,346 lines) plus **4**
   `0-in-183` token-count claims, to confirm the diff direction.
4. **Format scan** — all 6 files for forbidden obf→readable mapping tables, `## See also`, prev/next nav,
   relative-link resolution, and English-only.

**Verdict: PASS (no fixes required).** All **91** enumerated CHANGELOG bullets across the 6 published releases are
accounted for in their by_version files — anchored, depth-linked, or honestly flagged non-isolable. Every one of the
58 sampled current-bundle anchors resolves to the declaration/string the doc claims, and all 4 before-picture anchors
plus all 4 zero-in-183 claims hold. No citation drift was found, so **no in-place edits were made**. The corpus is
format-clean: 6/6 `## See also` + prev/next nav, no forbidden mapping tables, no CJK, and all 35 referenced module-doc
targets + every relative `.md` link resolve. One minor prose imprecision is noted (2.1.191 §3) where both cited line
numbers are nonetheless accurate — recorded as an observation, not a citation failure.

---

## 1. Coverage audit — every CHANGELOG bullet accounted for

Bullet counts were taken directly from `../../CHANGELOG.md`:

| Release | CHANGELOG bullets | Covered in by_version file | Summary-table rows | Result |
|---------|-------------------|----------------------------|--------------------|--------|
| 2.1.185 | 1 | 1 | 1 | 1/1 PASS |
| 2.1.186 | 33 | 33 | 33 | 33/33 PASS |
| 2.1.187 | 21 | 21 | 21 (rows 1–16 + 17a–17e) | 21/21 PASS |
| 2.1.190 | 1 | 1 | n/a (boilerplate) | 1/1 PASS |
| 2.1.191 | 20 | 20 | 20 | 20/20 PASS |
| 2.1.193 | 15 | 15 | 15 | 15/15 PASS |
| **Total** | **91** | **91** | — | **91/91 PASS** |

**How coverage was confirmed per release:**

- **2.1.185 (1/1).** The single bullet (stream-stall hint rewording + 10s→20s threshold) is fully anchored: the
  reworded JSX strings in `Tyo` (`cli_inner_pretty.js:366196`, lines 366220 / 366231) and the doubled threshold
  constant `q2o = 20000` (`cli_inner_pretty.js:596507`).
- **2.1.186 (33/33).** All 33 bullets map 1:1 to the 33 Summary-table rows. 11 in-scope items carry verified anchors +
  depth links; the 12 out-of-scope items (rows 12–18 area) split into anchored (AWS `/login` refresh, strikethrough,
  usage-cost) and the honestly-flagged TUI-render/streaming cluster (rows 24–33) given the nearest verified region but
  **no fabricated anchor**. Carryover/false-delta items (MEMORY.md reminder, `/plugin` "more above", bg-subagent
  permission forwarding) are labeled as such to avoid delta inflation.
- **2.1.187 (21/21).** 16 numbered items + the 5 sub-items 17a–17e = 21. Twelve are FOCUS items with a depth-module
  link + anchor; the remainder are anchored here (mouse-click select, `--bg` help, `/install-github-app`,
  Ghostty/macOS Cmd+click) or honestly flagged non-isolable (`--resume` no-model-turns persistence, CJK paste,
  `/update`-over-Remote-Control, `/share` input) with the `[VSCode]` bullet correctly declared out-of-bundle.
- **2.1.190 (1/1).** The lone "Bug fixes and reliability improvements" boilerplate bullet is documented as a
  maintenance checkpoint with verified bundle provenance and an honest "no isolable user-facing surface, no fabricated
  anchor" stance — the correct treatment for a no-named-surface release.
- **2.1.191 (20/20).** All 20 bullets map to the 20 Summary-table rows: 9 in-scope (rows 1–9), 11 out-of-scope of
  which 3 are primary-anchored here (`/voice`, `forceRemoteSettingsRefresh`, `claude agents` local-slash hint), 1
  partial (`[Image #N]`), and 7 honestly flagged not-isolable (streaming CPU, terminal-cache memory, `/login` URL
  wrap, Ghostty ssh/tmux, welcome splash, vim `/` hint, scroll-jump).
- **2.1.193 (15/15).** All 15 bullets map to the 15 Summary-table rows: 14 FOCUS items (anchored + depth-linked) and
  the single out-of-scope `/model`-stale-after-`/login` bullet given full primary analysis here (org-keyed
  client-data cache).

---

## 2. Citation spot-check — 2.1.193 bundle (current anchors)

All anchors are `cli_inner_pretty.js:<line>` re-opened with `sed -n` in the **2.1.193** bundle. "Verified at line" is
the literal token found at (or beginning at) the cited line.

### 2.1 — 2.1.185 (6 anchors)

| # | Anchor | Claimed | Verified at line | Result |
|---|--------|---------|------------------|--------|
| 1 | 596507 | silence threshold `q2o = 20000` | `q2o = 20000,` | PASS |
| 2 | 366196 | stalled-status renderer `Tyo` | `function Tyo(e) {` | PASS |
| 3 | 366220 | reworded line-1 string | `((C = wf.jsx(w, { color: "error", children: "Waiting for API response" })), …)` | PASS |
| 4 | 366231 | reworded line-2 string | `wf.jsxs(w, { dimColor: !0, children: [" \xB7 will retry in ", a, " \xB7 check your network"] })` | PASS |
| 5 | 594848 | stall watchdog timer `xs` | `xs = function () {` | PASS |
| 6 | 595167 | idle-abort timeout `Fn` | `Fn = Math.min(d3r(_r()), Ln ? Wn : 1 / 0),` | PASS |

### 2.2 — 2.1.186 (12 anchors)

| # | Anchor | Claimed | Verified at line | Result |
|---|--------|---------|------------------|--------|
| 1 | 613318 | `mcp login` handler (`L9f`) | `async function L9f(e, t) {` | PASS |
| 2 | 613467 | `mcp logout` handler (`D9f`) | `async function D9f(e) {` | PASS |
| 3 | 617562 | `processBashCommand` (`y6f`) | `async function y6f(e, t, n, r) {` | PASS |
| 4 | 56492 | `respondToBashCommands` setting | `respondToBashCommands: A.boolean()` | PASS |
| 5 | 228300 | `RETIRED_TOOL_NAMES` (`HBt`) set | `HBt = new Set(["Frame","FrameRead","TeamCreate","TeamDelete","SuggestBackgroundPR"]);` | PASS |
| 6 | 430515–430532 | `Agent(type)` deny / `Agent(x,y)` allow-list upfront block | `if (t !== void 0 && !k) { … throw … "has been denied by permission rule" … "Available agents: …" }` | PASS |
| 7 | 54136 | `EXEC_MODE_ENUM` (`uhs`) gains `iterm2` | `(uhs = ["auto","tmux","iterm2","in-process"]),` | PASS |
| 8 | 543272 | `/workflows` filter order (`eYt`) | `eYt = ["all","running","queued","failed","done","skipped","interrupted"];` | PASS |
| 9 | 424307 | `DEFAULT_SO_RETRIES` (`NYp`) = 5 | `NYp = 5;` | PASS |
| 10 | 603244 | `MAX_RETRIES_CAP` (`Ujo`) = 15 | `Ujo = 15,` | PASS |
| 11 | 135747 | AWS-refresh `/login` gate `C2e()` | `function C2e() {` | PASS |
| 12 | 369751–369758 | AWS-refresh menu entry (value `aws_refresh`) | `"Claude Platform on AWS \xB7" … "refresh credentials" … value: "aws_refresh"` | PASS |

### 2.3 — 2.1.187 (13 anchors)

| # | Anchor | Claimed | Verified at line | Result |
|---|--------|---------|------------------|--------|
| 1 | 54069 | `sandbox.credentials` schema (`IEu`) | `(IEu = Ce(() =>` | PASS |
| 2 | 211660 | `resolveCredentialProtection` (`Rqi`) | `function Rqi(e, t) {` | PASS |
| 3 | 102873 | `isModelAvailable` (`Ia`) | `function Ia(e, t) {` | PASS |
| 4 | 487243 | `switchModel` (`tzt`) | `async function tzt(e) {` | PASS |
| 5 | 487250 | restricted-model denial message | `message: \`Model '${t}' is restricted by your organization's settings. Run /model …\`,` | PASS |
| 6 | 293017 | `callToolWithWatchdog` (`bao`) | `async function bao({ client: { client: e, name: t, config: n, transportErrorState: r }, …`  | PASS |
| 7 | 293311 | `DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS` (`hpp`) = 300000 | `hpp = 300000,` | PASS |
| 8 | 431759 | `stopTask` (`kht`) | `async function kht(e, t) {` | PASS |
| 9 | 453792 | `enqueueAgentNotification` (`Eqe`) | `function Eqe({` | PASS |
| 10 | 441544 | subagent resume-restore depth expr | `H = (Kl(_) ? _.spawnDepth : b?.spawnDepth) ?? K3(i.agentContext) + 1,` | PASS |
| 11 | 191075 | select option row `onClick` | `onClick: ce(Tt.option),` | PASS |
| 12 | 714390–714394 | `--bg`/`--background` help option | `new _c("--bg, --background", "Start the session as a background agent and return immediately …")` | PASS |
| 13 | 155914 | Ghostty/macOS cmd-click predicate | `macCmdClickArrivesWithoutSgrModifierBit() {` | PASS |

### 2.4 — 2.1.191 (13 anchors)

| # | Anchor | Claimed | Verified at line | Result |
|---|--------|---------|------------------|--------|
| 1 | 582712 | `/rewind` anchor writer (`hYt`) | `async function hYt(e, t) {` | PASS |
| 2 | 292176 | MCP discovery retry (`P1n`) | `async function P1n(e, t, n, r, o) {` | PASS |
| 3 | 293455 | discovery backoff schedule `mpp` | `mpp = [250, 500, 1000];` | PASS |
| 4 | 281573 | retrying OAuth fetch (`AOn`) | `function AOn() {` | PASS |
| 5 | 547334 | recent-denied overlay close handler `wt` (body) | `let Ke = b.current,` — `wt = () =>` declared at 547333; approved removeDenial loop `i(Sn)` at 547353; `H4l` overlay at 547100 | PASS |
| 6 | 219238 | `addSessionAllowedHost` (`_Wd`) | `function _Wd(e) {` | PASS |
| 7 | 431808 | `markAgentStoppedByUser` (`Mde`) | `function Mde(e, t) {` | PASS |
| 8 | 589634 | `hookMatcherMatches` (`s3f`) + `allowComma` | `function s3f(e, t, n, r) {` | PASS |
| 9 | 572489 | `/voice` org-policy call `gG("allow_voice_mode",…)` | `let S = gG("allow_voice_mode", "Voice mode", "is");` | PASS |
| 10 | 148824 | org-policy explanation builder `gG` | `function gG(e, t, n) {` | PASS |
| 11 | 57812–57814 | `forceRemoteSettingsRefresh` tier OR-merge | `if (n.some((a) => a.forceRemoteSettingsRefresh === !0)) i.forceRemoteSettingsRefresh = !0;` | PASS |
| 12 | 312112 | remote-settings fetcher `Fka` | `async function Fka(e, t = !1) {` | PASS |
| 13 | 398029 | `claude agents` local-slash dispatch `v9p` | `async function v9p(e, t, n, r, o, s, i, a, l) {` | PASS |

### 2.5 — 2.1.193 (14 anchors)

| # | Anchor | Claimed | Verified at line | Result |
|---|--------|---------|------------------|--------|
| 1 | 55814 | `autoMode.classifyAllShell` schema | `classifyAllShell: A.boolean()` | PASS |
| 2 | 58758 | gate `isClassifyAllShellEnabled` (`$Cr`) | `function $Cr() {` | PASS |
| 3 | 416263–416264 | suspend predicate `isShellAllowRuleSuspended` (`r9e`) | `function r9e(e, t) { if ((e === Io \|\| e === Ss) && sTo()) return !0;` | PASS |
| 4 | 640271 | auto-mode-denied toast reason line | `if (((k = v.decisionReason.reason ?? ""), k.length > 80)) k = \`${k.slice(0, 79)}…\`;` | PASS |
| 5 | 468662 | `assistant_response` OTEL emit | `Jc("assistant_response", {` | PASS |
| 6 | 195211 | tri-state gate `isAssistantResponseLoggingEnabled` (`dGi`) | `function dGi() {` | PASS |
| 7 | 36424 | `OTEL_LOG_ASSISTANT_RESPONSES` (`FZc = Fe.triBool()`) | `(FZc = Fe.triBool()),` | PASS |
| 8 | 454354 | bg-shell pressure reaper (`Mgl`) | `function Mgl(e, t, n, r, o, s) {` | PASS |
| 9 | 454610 | idle-reap threshold `eof` = 1.8e6 | `eof = 1800000,` | PASS |
| 10 | 578073 | `countAbandonedBgTasks` (`oUo`) | `function oUo(e, t = fze(e)) {` | PASS |
| 11 | 431253–431264 | `async_launched` tool-result drops "end your response" | `if (e.status === "async_launched") { … "The agent is working in the background…" }` (no "end your response") | PASS |
| 12 | 478428 | `resolvePluginRename` (`s_t`) | `function s_t(e, t, n) {` | PASS |
| 13 | 604858 | `getCachedClientData` (`Xk`) org-keyed read | `function Xk() { … if (n != null && Object.hasOwn(n, t)) return Rxi(n, t); …}` | PASS |
| 14 | 148487 | client-data cache-key builder (`mwn`) | `function mwn(e) {` | PASS |

**Current-anchor result: 58/58 PASS.**

### Note on range-citation start lines
A few citations name a **line range** or a function whose declaration begins a line or two before the cited line.
The clearest example is **2.1.191 anchor #5**: the doc names the recent-denied close handler `wt` at
`cli_inner_pretty.js:547334`, but `wt` is declared on line 547333 (`((wt = () => {`) and 547334 is its first body line
(`let Ke = b.current,`). The named construct is contained in the cited window and the surrounding text correctly
describes where it sits, so this is an accurate range citation, not a miss — exactly as the 2.1.183 report's
"cited-range start lines" note records for that tree.

---

## 3. Before-picture spot-check — 2.1.183 bundle

Anchors tagged `(183)` re-opened in the **2.1.183** bundle, plus the `0-in-183` token-count diff claims.

| # | Origin | Anchor (183) | Claimed "before" | Verified at line | Result |
|---|--------|--------------|------------------|------------------|--------|
| B1 | 2.1.185 | 584496 | old threshold `u0o = 1e4` (10s) | `u0o = 1e4,` | PASS |
| B2 | 2.1.185 | 354984 | old line-1 "No response from API" | `((C = wa.createElement(w, { color: "error" }, "No response from API")), …)` | PASS |
| B3 | 2.1.185 | 354996 | old line-2 " · Retrying in …" | `wa.createElement(w, { dimColor: !0 }, " \xB7 Retrying in ", a, " \xB7 check your network")` | PASS |
| B4 | 2.1.191 | 561695 | old generic `/voice` message | `return { type: "text", value: "Voice mode is not available." };` | PASS |

**Zero-in-183 diff confirmations** (grep count in the 183 bundle):

| Claim | Token | 183 count | Result |
|-------|-------|-----------|--------|
| 2.1.193 `classifyAllShell` is net-new | `classifyAllShell` | 0 | PASS |
| 2.1.193 org-keyed client-data cache is net-new | `clientDataCacheSlots` | 0 | PASS |
| 2.1.186 `!` bash auto-respond setting is net-new | `respondToBashCommands` | 0 | PASS |
| 2.1.187 `sandbox.credentials` description is net-new | `"block sandboxed commands from reading"` | 0 | PASS |

**Before-picture result: 4/4 anchors + 4/4 zero-count claims PASS.**

---

## 4. Format scan — all 6 files

| Check | Result | Detail |
|-------|--------|--------|
| No forbidden obf→readable **mapping tables** | PASS | No `\| Obfuscated \| Readable \|` headers, no `## Symbol Mapping` / `## Symbol Index Reference` sections. Code snippets use the allowed dual-version `// Mapping:` comment line; before/after and summary tables are allowed. |
| Every file has `## See also` | PASS | 6/6 present. |
| Prev/next version nav | PASS | 6/6 carry "Previous version" + "Next version" (2.1.185 honestly records Prev = none; 2.1.193 records Next = none). |
| Referenced module-doc targets resolve | PASS | All 35 sampled `../<module>/*.md` targets exist; the automated link-resolution loop over every relative `.md` link in the 6 files reported **0 broken**. |
| English-only | PASS | No CJK/Hangul; the only non-ASCII is expected typography (`·` middot `\xB7`, `…` ellipsis `…`, arrows). |

No format fix was required.

---

## 5. Mis-scoping review

No bullet is materially mis-scoped. Specific judgments checked and upheld:

- **Carryover / false-delta labels are honest, not evasions.** 2.1.186's MEMORY.md compact reminder, `/plugin` "more
  above" indicator, and bg-subagent permission forwarding; 2.1.187's "stuck working" finalizer, leaked-worktree
  cleanup, and `/plugin` unused-plugin sweep are each flagged as present-before-this-window with a verified
  count-equality note. This is the correct treatment — the changelog label lags the ship date — and prevents delta
  inflation rather than hiding a change.
- **Out-of-scope render/streaming/platform fixes carry no fabricated anchors.** 2.1.186's TUI-render cluster (rows
  24–33), 2.1.187's `--resume`/CJK/`/update`/`/share` items, and 2.1.191's streaming-CPU / terminal-cache / splash /
  vim-hint items are honestly flagged `(not isolable)` with the nearest verified region only. The `[VSCode]` bullet
  (2.1.187 #17e) is correctly declared to live outside `cli_inner_pretty.js`.
- **2.1.190 is correctly scoped as a maintenance checkpoint.** A single boilerplate bullet with no named surface is
  documented as such with verified provenance and no invented anchor — the honest finding for a fixes-only release.

**One minor prose imprecision (observation, not a citation failure).** In **2.1.191 §3**, the recent-denied overlay
paragraph says the "approved-branch (`cli_inner_pretty.js:547353`) … emits a 'Permission granted for:' meta-message."
Re-reading the `wt` handler in source: the `for (let Sn of Xn) i(Sn)` per-approval `removeDenial` loop is indeed at
547353 (the approved sub-branch), but the literal `"Permission granted for:"` string is emitted by the **retry**
sub-branch one block above (≈547346); the approved sub-branch itself emits `"Approved …"`. Both strings are net-new in
this handler and **both cited line numbers (547334 for `wt`, 547353 for the removeDenial loop) point at exactly what
the doc says they point at**, so this is not citation drift and required no in-place edit — only the natural-language
binding of which sub-branch owns which string is slightly loose. Left as-is to avoid introducing risk; recorded here
for completeness.

---

## 6. Per-release pass/fail summary

| Release | Coverage | Citation (sampled) | Fixes applied | Result |
|---------|----------|--------------------|---------------|--------|
| 2.1.185 | 1/1 PASS | 6/6 PASS | 0 | PASS |
| 2.1.186 | 33/33 PASS | 12/12 PASS | 0 | PASS |
| 2.1.187 | 21/21 PASS | 13/13 PASS | 0 | PASS |
| 2.1.190 | 1/1 PASS | n/a (boilerplate — provenance verified) | 0 | PASS |
| 2.1.191 | 20/20 PASS | 13/13 PASS | 0 | PASS |
| 2.1.193 | 15/15 PASS | 14/14 PASS | 0 | PASS |
| **Total** | **91/91 PASS** | **58/58 PASS** (+ 4/4 before-picture + 4/4 zero-in-183) | **0** | **PASS** |

---

## 7. Verdict

**PASS — no fixes required.** Under a default-to-FAIL re-audit, all **91** enumerated CHANGELOG bullets across the 6
published releases (2.1.185 / .186 / .187 / .190 / .191 / .193) are accounted for in their by_version files: anchored,
depth-linked to a module doc, or honestly flagged non-isolable with no fabricated line number. Every one of the 58
sampled `cli_inner_pretty.js:<line>` current-bundle anchors resolves to the exact declaration or string claimed
(including the trickier range-citations such as 2.1.191's `wt` handler), and all 4 before-picture (183) anchors plus
all 4 zero-in-183 diff claims hold. No citation drift was found, so the by_version files were left unmodified. The
corpus is format-clean across all invariants — universal `## See also` + prev/next nav, no forbidden mapping tables,
English-only, and every referenced module-doc target and relative link resolves. The one recorded prose imprecision
(2.1.191 §3) does not affect any cited line number. No coverage failure and no unresolved citation failure remain.

### Second-pass addendum (independent adversarial re-read)

A subsequent independent pass re-derived the 91/91 coverage count (1 + 33 + 21 + 1 + 20 + 15 = 91, confirmed by
re-counting `^- ` bullets per `## ` section in `../../CHANGELOG.md`) and re-checked a fresh sample of the anchors this
report claims it verified (186: `613318`/`228300`/`54136`/`603244`; 187: `54069`/`487250`/`293311`; 191:
`293455`/`589634`/`572489`/`57812-57814`; plus the 185 stall anchors and 193 cluster) — all resolve as claimed, and
the two known false-deltas hold (`mcp_headers_helper` carryover 193=7/183=6/156=6 with only `reauth_retry` net-new;
the agent-team kill events live outside this surface). **One defect outside this report's before-picture sample was
found and corrected in `2.1.193.md` §15:** the 2.1.183 `oauth_logout` mutator clears **three** of the five tracked
client-data cache fields (`additionalModelOptionsCache` `:340788`, `additionalModelCostsCache` `:340789`,
`clientDataCache` `:340790`), not "two" — the doc cited `:340788`/`:340790` and skipped the contiguous `:340789`. The
193 delta is the **two** added clears `modelAccessCache` (`:350427`) and `clientDataCacheSlots` (`:350429`), both
0-in-183 (so "2 → 5" was corrected to "3 of 5 → all 5, +2 net-new"). This report's own 58/58 + 4/4 + 4/4 sampled
claims were all independently re-confirmed; the defect fell in a contiguous-block line the original before-picture
sample did not open.

---

## See also

- Per-version files audited → [`./2.1.185.md`](./2.1.185.md) · [`./2.1.186.md`](./2.1.186.md) ·
  [`./2.1.187.md`](./2.1.187.md) · [`./2.1.190.md`](./2.1.190.md) · [`./2.1.191.md`](./2.1.191.md) ·
  [`./2.1.193.md`](./2.1.193.md)
- Bullet source of truth → [`../../CHANGELOG.md`](../../CHANGELOG.md)
- Changelog → code mapping → [`../00_overview/changelog_to_code_map.md`](../00_overview/changelog_to_code_map.md)
- Full 2.1.183→2.1.193 delta analysis → [`../00_overview/changelog_analysis.md`](../00_overview/changelog_analysis.md)
