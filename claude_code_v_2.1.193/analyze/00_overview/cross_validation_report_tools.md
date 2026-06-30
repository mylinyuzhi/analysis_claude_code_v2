# Cross-Validation Report — Module 04_tools (v2.1.193 delta)

- **Theme:** tools (bash-mode `!` input deltas + the tool-surface diff), window v2.1.183 → v2.1.193
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/04_tools/`
- **Docs audited:** `README.md`, `bash_input_respond.md`, `bash_mode_autocomplete.md`, `tool_surface_delta_193.md` (+ the additions file below)
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/00_overview/symbol_additions_v2_1_193_tools.md`
- **TARGET bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build `a1938d2a`)
- **Before-picture bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- **Earlier baseline:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **v2.1.88 named-TS reference:** `/lyz/codespace/3rd/claude-code/src/`

**Sample:** 53 distinct v2.1.193 `cli_inner_pretty.js:<line>` anchors re-read in the TARGET bundle + 12 before-picture declarations re-read in 183 + 3 zero/equality checks re-read in 156 + 27 grep-count diffs re-run across both/all bundles + 2 asset-directory counts + 2 `assets/tools/*.md` cross-version diffs (Bash.md, PowerShell.md) + 15 v2.1.88 named-TS lineage anchors/absence checks.

**Verdict (one line):** PASS WITH FIXES. Every load-bearing 193 declaration, body, grep-count and before-picture in the three deep docs reproduced at the cited lines; all three headline deltas (T1 `"bash-path"` wiring, T2 `respondToBashCommands` auto-respond, T3 `ReadMcpResourceDirTool` 50→51) and both disambiguations (T4 un-isolable `--tools` fix, T5 `classifyAllShell` false-delta) are correctly classified against 183 **and** 156. The v2.1.88 named-TS lineage also supports the same split: old registry/resource/bash primitives existed, while the stable 193 delta tokens were absent. One citation drift was found and fixed in place: the `getAvailableTools` exclusion-set `new Set([…])` is at `:444237`, not the doc's `:444239` (which points at `o = Rre(r, e)`).

---

## C1 — Citation spot-check (v2.1.193 TARGET bundle)

Every line below was opened at the exact cited line in the 193 bundle and the declaration/string/field confirmed against the doc claim.

### `bash_input_respond.md` (T2 — `!` auto-respond)

| Cited line | Doc claim | Verified at 193 line | Result |
|---|---|---|---|
| 617560 | `bashModeModule` (`Mrc`) | `var Mrc = {};` | PASS |
| 617561 | export `processBashCommand: () => y6f` | `gt(Mrc, { processBashCommand: () => y6f });` | PASS |
| 617562 | `processBashCommand` (`y6f`) | `async function y6f(e, t, n, r) {` | PASS |
| 617564 | read `respondToBashCommands ?? !0` | `s = Lr().respondToBashCommands ?? !0;` | PASS |
| 617565 | NET-NEW `respond: s` telemetry field | `V("tengu_input_bash", { powershell: o, respond: s });` | PASS |
| 617604 | the `willQuery` gate (`S = s && …`) | `S = s && !g.interrupted && !g.backgroundTaskId && !n.abortController.signal.aborted;` | PASS |
| 617607 | caveat-only-when-silent | `...(S ? [] : [Sre()]),` | PASS |
| 617611 | `shouldQuery: S` return | `shouldQuery: S,` | PASS |
| 56489 | `defaultShell` setting (carryover) | `defaultShell: A.enum(["bash", "powershell"])` | PASS |
| 56492 | `respondToBashCommands` schema field | `respondToBashCommands: A.boolean()` + describe text verbatim | PASS |
| 617550 | `getDefaultShell` (`Psr`) | `function Psr() { let e = Lr().defaultShell; …` | PASS |
| 599656 | `noResponseCaveatMarker` (`Sre`) | `function Sre() { return Pn({ content: \`<${dBe}>Caveat:…DO NOT respond…\` … }` | PASS |
| 45931 | `LOCAL_COMMAND_CAVEAT_TAG` (`dBe`) | `dBe = "local-command-caveat",` | PASS |
| 58428 | `getSettings` (`Lr`) | `function Lr() { return lq().settings || {}; }` | PASS |
| 691999 | persisted-prefs key entry | `"respondToBashCommands",` (in the persisted key list) | PASS |

### `bash_mode_autocomplete.md` (T1 — live bash-mode path dropdown)

| Cited line | Doc claim | Verified at 193 line | Result |
|---|---|---|---|
| 629382 | bash-mode branch head in `se` | `if (i === "bash" && ze.trim()) {` | PASS |
| 629387 | second `pKr`/`getPathCompletions` caller | `let wn = await pKr(Ft, { maxResults: 10 });` | PASS |
| 629396 | `"bash-path"` marker set | `(te.current = "bash-path"),` | PASS |
| 629401 | dismiss-stale-bash-path | `if (S === "directory" && te.current === "bash-path") le();` | PASS |
| 188582 | `isPathLikeToken` (`dKr`) | `function dKr(e) {` + 7-way `startsWith` OR | PASS |
| 188593 | `scanDirectoryForCompletion` (`QOd`) | `async function QOd(e, t = !1) { … r = d4i.get(n);` | PASS |
| 188612 | `getPathCompletions` (`pKr`) | `async function pKr(e, t = {}) { … { directory: i, prefix: a } = g4i(e, n)` | PASS |
| 188641 | `DIRECTORY_SCAN_CAP` (`m4i`) = 5000 | `m4i = 5000,` | PASS |
| 188651 | `directoryScanCache` (`d4i`) LRU max:500 ttl:300000 | `d4i = new A3({ max: p4i, ttl: f4i })` (`p4i = 500`, `f4i = 300000`) | PASS |
| 628803 | `bashHistoryGhostText` (`Zic`) | `async function Zic(e) {` | PASS |
| 351210 | `detectUserShell` (`Wpt`) | `function Wpt() { let e = process.env.SHELL || ""; …` | PASS |
| 628313 | `getShellCompletions` (`Uic`) | `async function Uic(e, t, n, r) {` | PASS |
| 628324 | `SHELL_COMPLETION_LIMIT` (`MGo`) = 15 | `var MGo = 15,` | PASS |
| 628283 | `buildBashCompgenCommand` (`nYf`) | `function nYf(e, t)` + `compgen -f … | head -${MGo} …` | PASS |
| 628291 | `buildZshCompletionCommand` (`rYf`) | `function rYf(e, t) {` | PASS |
| 628299 | `runShellCompletion` (`oYf`) | `async function oYf(e, t, n, r, o) { … if (e === "bash") s = nYf(t, n);` | PASS |
| 629143 | `requestShellCompletion` (`DYf`) | `async function DYf(e, t, n) {` | PASS |
| 629693-629707 | `bash-path` accept (dir→re-run / file→space) | block present; `if (te.current === "bash-path")` at 629696, `if ((t(nt), r(Ft), $t)) se(nt, Ft); else le();` | PASS (range bounds block; see residual) |
| 629650 | dismiss-on-mode-flip | `if (S === "directory" && te.current === "bash-path" && i !== "bash") (be.cancel(), _e.cancel(), le());` | PASS |
| 629874-629882 | second `bash-path` accept | `if (te.current === "bash-path") {` at 629874 | PASS |

### `tool_surface_delta_193.md` (T3/T4/T5)

| Cited line | Doc claim | Verified at 193 line | Result |
|---|---|---|---|
| 283504 | `ReadMcpResourceDirToolName` (`iX`) | `var iX = "ReadMcpResourceDirTool",` | PASS |
| 283505 | description (`D_a`) | `D_a = \`\nList the direct children of a directory resource on an MCP server.…` | PASS |
| 283549 | `dlp`/`plp`/`_ne` decl | `var dlp, plp, _ne;` | PASS |
| 283549 / 283584-283585 | `ReadMcpResourceDirTool` object (`_ne`) | `var dlp, plp, _ne;` at 283549; `(_ne = Xs({` begins at 283584 and first property `isConcurrencySafe()` is at 283585 | PASS |
| 151125 | `defineTool` (`Xs`) | `function Xs(e) { return Object.defineProperties({ ...vHd, userFacingName: () => e.name }, …)` | PASS |
| 444127 | `getBuiltinToolRegistry` (`b4`) | `function b4() { return [ l6n, …` | PASS |
| 444225 | `getAvailableTools` (`a$`) | `a$ = (e, t) => {` | PASS |
| **444237** | exclusion `new Set([…])` 4 names incl. `_ne.name` | `let n = new Set([oW.name, hW.name, _ne.name, Ep]),` | PASS **(was cited :444239 — fixed)** |
| 229498 | `"StructuredOutput"` (`Ep`) | `Ep = "StructuredOutput",` | PASS |
| 598509 | `initializeToolPermissionContext` (`Sjo`) | `async function Sjo({ allowedToolsCli: e, disallowedToolsCli: t, …` | PASS |
| 598530-598539 | `--tools` deny-universe block | `let p = []; if (n && n.length > 0) { … z = (u ? qwo() : b4().map((J) => J.name)).filter((J) => !W.has(J)); … }` | PASS |
| 55814 | `classifyAllShell` schema | `classifyAllShell: A.boolean()` | PASS |
| 58759 | `classifyAllShell` reader | `for (let e of Uys) if (_n(e)?.autoMode?.classifyAllShell === !0) return !0;` | PASS |
| 284345 | sibling-desc cross-ref #1 | `let c = FGe(s.capabilities) ? \` If the URI is a directory resource, use ${iX} instead.\` : "";` | PASS |
| 451562 | sibling-desc cross-ref #2 | `let t = e.directoryRead ? \` Call ${iX} on "${e.uri}" or a subdirectory URI to list its contents.\` : "";` | PASS |
| 712389 | `--tools` flag description | `'Specify the list of available tools from the built-in set. Use "" to disable all tools…'` | PASS |

---

## C2 — Before-picture spot-check (183 / 156)

| Cited line / claim | Bundle | Verified | Result |
|---|---|---|---|
| `Owf` 183 `processBashCommand` @604506 | 183 | `async function Owf(e, t, n, r) {` | PASS |
| 183 telemetry has **no** `respond` field | 183 | `G("tengu_input_bash", { powershell: o });` | PASS |
| 183 `Owf` returns `shouldQuery: !1` on every path | 183 | 4 returns, all `shouldQuery: !1` | PASS |
| 183 at-mention path branch @615555 guarded `i !== "bash"` | 183 | `if (Dt && i !== "bash") { … if (Yki(Zt)) { … await Xki(Zt, { maxResults: 10 })` | PASS |
| 183 `Yki` (isPathLikeToken) @187417 byte-identical to 193 `dKr` | 183 | `function Yki(e) {` + identical 7-way OR | PASS |
| 183 `Amd` (scanDir) @187428 | 183 | `async function Amd(e, t = !1) {` | PASS |
| 183 `Xki` (getPathCompletions) @187447 | 183 | `async function Xki(e, t = {}) {` | PASS |
| 183 `b4` registry @436518 | 183 | `return [ f3n, q3n, …` | PASS |
| 183 `zR` (getAvailableTools) @436622 | 183 | `zR = (e, t) => {` | PASS |
| 183 exclusion set = **3** names @436634 | 183 | `let n = new Set([_G.name, kG.name, Em]),` | PASS |
| 183 `Sjo`-analog deny block @586466 region | 183 | `W = new Set(F.map(eL)),` @586464 (structurally identical) | PASS |
| `respondToBashCommands` absent in 156 | 156 | grep `=0` | PASS |
| `"bash-path"` absent in 156 | 156 | grep `=0` | PASS |
| `"Failed to scan directory for path completion"` present in 156 | 156 | grep `=1` | PASS |

---

## C3 — False-delta hunt (the high-value check)

Every NET-NEW / REFINEMENT / CARRYOVER claim was re-greped in **both** 183 and 156 (or against the 183 asset tree).

| Claim | Tag in doc | 193 | 183 | 156 | Verdict |
|---|---|---|---|---|---|
| `respondToBashCommands` setting | NET-NEW (2.1.186) | 3 | 0 | 0 | **CONFIRMED net-new** (schema :56492, read :617564, persisted-key :691999) |
| `respond: s` telemetry field | NET-NEW | 1 | 0 | — | **CONFIRMED net-new** |
| `Whether Claude responds after an input-box` describe | NET-NEW | 1 | 0 | 0 | **CONFIRMED net-new** |
| `"DO NOT respond to these messages"` caveat | CARRYOVER | 1 | 1 | — | **CONFIRMED carryover** (183 `Rte`→193 `Sre`) |
| `local-command-caveat` tag | CARRYOVER | 2 | 2 | — | **CONFIRMED carryover** |
| `defaultShell` setting/reader | CARRYOVER | 2 | 2 | — | **CONFIRMED carryover** |
| `"bash-path"` suggestion-kind marker | NET-NEW (2.1.193) | 5 | 0 | 0 | **CONFIRMED net-new** |
| `"at-path"` marker (at-mention surface unchanged) | unchanged | 2 | 2 | — | **CONFIRMED unchanged** |
| `"Failed to scan directory for path completion"` | CARRYOVER | 1 | 1 | 1 | **CONFIRMED carryover** |
| `compgen -f` Tab completion | CARRYOVER (false delta) | 1 | 1 | — | **CONFIRMED carryover** |
| `completionType` | CARRYOVER | 7 | 7 | — | **CONFIRMED carryover** |
| `detectUserShell` body (`process.env.SHELL || ""`) | CARRYOVER (re-mangle `bat`→`Wpt`) | 3 | 3 | — | **CONFIRMED carryover** (grep-rename only) |
| `ReadMcpResourceDirTool` (name const) | NET-NEW | 2 | 0 | — | **CONFIRMED net-new** |
| `ReadMcpResourceDir` (incl. alias) | NET-NEW | 3 | 0 | — | **CONFIRMED net-new** |
| `List the direct children of a directory resource` | NET-NEW | 2 | 0 | — | **CONFIRMED net-new** |
| `use ${iX} instead` cross-ref | NET-NEW | 1 | 0 | — | **CONFIRMED net-new** |
| `Call ${iX} on` cross-ref | NET-NEW | 1 | 0 | — | **CONFIRMED net-new** |
| `resources/directory/read` protocol | CARRYOVER (+1 = the tool) | 5 | 4 | — | **CONFIRMED carryover client** (+1 net is the new tool's own use) |
| `toolsNarrowing` permission source | CARRYOVER | 8 | 8 | — | **CONFIRMED carryover** |
| `classifyAllShell` (false delta → permissions) | NET-NEW but not tool-surface | 2 | 0 | — | **CONFIRMED net-new**, and Bash/PowerShell descriptions byte-identical (below) |
| `flagsLoaded` / `ensureFlags` / `waitForFlags` | absent (un-isolable `--tools` fix) | 0/0/0 | 0/0/0 | — | **CONFIRMED absent** — supports "un-isolable" honesty |
| `shouldToolsListOptInToBrief` / `setUserMsgOptIn` | CARRYOVER visible opt-in latch | `FXp`/`Jfe` | `tPp`/`Rde` | named TS `main.tsx:1722-1725` | **CONFIRMED carryover** — not the .186 patch |
| explicit `gb-before-tools` await order | after `Sjo` | `Sjo` call `:712994-713003`, await `:713130-713135` | `_rc` call `:693838-693850`, await `:693973-693978` | — | **CONFIRMED after permission context** |
| `assets/tools/*.md` count | 50 → 51 | 51 | 50 | — | **CONFIRMED** (`diff` = `+ReadMcpResourceDirTool.md`, 0 removed) |
| `Bash.md` description block 183↔193 | CARRYOVER (false delta) | — | — | — | **CONFIRMED identical** — only `Offset:` + schema token `AJa()`→`fyl()` differ |
| `PowerShell.md` description block 183↔193 | CARRYOVER (false delta) | — | — | — | **CONFIRMED identical** — only `Offset:` + schema token `V1p()`→`Qnf()` differ |

No claim was refuted. Every "carryover" was proven present in 183; every "net-new" was proven absent in 183 (and 156 where the doc made a 156 claim). The two genuine false-delta disambiguations the docs already make (`classifyAllShell` → permissions; compgen Tab completion → carryover) both held up.

---

## C3b — v2.1.88 named-TS lineage spot-check

### Named-Ancestor Tool Surface Split

**What it does:** Uses the v2.1.88 named TypeScript source as a semantic ancestor check, separate from the immediate 183 before-picture.

**How it works:**
1. `src/tools.ts:193-250` establishes that v2.1.88 already had the main builtin registry path, including `BashTool`, `ListMcpResourcesTool`, `ReadMcpResourceTool`, conditional `TeamCreateTool`/`TeamDeleteTool`, and conditional `ToolSearchTool`.
2. `src/tools.ts:300-307` establishes the v2.1.88 hidden/special exclusion set: `ListMcpResourcesTool.name`, `ReadMcpResourceTool.name`, and `SYNTHETIC_OUTPUT_TOOL_NAME`. There is no `ReadMcpResourceDirTool` entry in that set.
3. `src/tools/ReadMcpResourceTool/ReadMcpResourceTool.ts:49-101` confirms the old resource reader was a deferred `ReadMcpResourceTool` that called `resources/read` with `{ uri }`.
4. `src/tools/ListMcpResourcesTool/ListMcpResourcesTool.ts:40-100` confirms the old lister returned flat resources through `fetchResourcesForClient`, not directory children.
5. `src/utils/processUserInput/processBashCommand.tsx:17-135` confirms the old `!` command path returned `{ messages, shouldQuery: false }` on success and all visible error exits, and `src/utils/messages.ts:566-569` confirms the no-response caveat already existed.
6. `src/hooks/useTypeahead.tsx:593-596` and `:817-831` confirm v2.1.88 skipped bash mode for `@` suggestions; path completion existed there only for non-bash `@` tokens.

**Why this approach:**
- The named source identifies old concepts without relying on 183/193 obfuscated symbols.
- The immediate 183 bundle remains the authoritative delta boundary; v2.1.88 is used only to classify "evolved from older named code" versus "newer stable token absent from the ancestor."
- Stable absence strings (`respondToBashCommands`, `"bash-path"`, `ReadMcpResourceDirTool`, `ReadMcpResourceDir`, `resources/directory/read`) avoid false negatives caused by renamed local symbols.

**Key insight:** The older TypeScript source already had the tool registry, Bash execution, MCP resource list/read tools, Team tools, ToolSearch, and path completion machinery. It lacked the three later Tools-specific stable surfaces that matter for this window: bash-mode live path marker/wiring, bash auto-response setting/telemetry, and the MCP resource directory-read tool.

- `rg` over `/lyz/codespace/3rd/claude-code/src` found no `respondToBashCommands`, `"bash-path"`, `ReadMcpResourceDirTool`, `ReadMcpResourceDir`, or `resources/directory/read`.
- The v2.1.88 `processBashCommand` telemetry emitted `tengu_input_bash` with `{ powershell }`, not the 193 `{ powershell, respond }` shape.
- The v2.1.88 resource-tool pair was `ListMcpResourcesTool` + `ReadMcpResourceTool`; the 193 `ReadMcpResourceDirTool` remains a later tool-surface addition.

---

## C4 — Obf→readable mapping spot-check

Each mapping below was confirmed by reading the decl body (signature / return / held string) in 193:

- `y6f` → `processBashCommand` — async 4-arg handler returning `{ messages, shouldQuery }`. PASS.
- `Sre` → `noResponseCaveatMarker` — returns the `local-command-caveat` `isMeta` block. PASS.
- `dKr` → `isPathLikeToken` — 7-way `startsWith` path-sigil predicate. PASS.
- `pKr` → `getPathCompletions` — splits token via `g4i`, scans via `QOd`, caps at `maxResults`. PASS.
- `QOd` → `scanDirectoryForCompletion` — cached `d4i.get` readdir. PASS.
- `iX` → `ReadMcpResourceDirToolName` — holds `"ReadMcpResourceDirTool"`. PASS.
- `_ne` → `ReadMcpResourceDirTool` object — `Xs({ shouldDefer:!0, name: iX, aliases:["ReadMcpResourceDir"] })`. PASS.
- `Xs` → `defineTool` — builds the tool object via `Object.defineProperties`. PASS.
- `b4` → `getBuiltinToolRegistry` — returns the builtin tool array. PASS.
- `a$` → `getAvailableTools` — arrow filtering `b4()` by the exclusion set. PASS.
- `Sjo` → `initializeToolPermissionContext` — destructures `{ allowedToolsCli, disallowedToolsCli, … }`, builds the `--tools` deny universe. PASS.
- `Psr` → `getDefaultShell` / `Lr` → `getSettings` / `dBe` → `LOCAL_COMMAND_CAVEAT_TAG` / `Ep` → `"StructuredOutput"` / `Wpt` → `detectUserShell` / `Uic` → `getShellCompletions` / `nYf` → `buildBashCompgenCommand` / `MGo`=15 / `m4i`=5000 — all PASS.

No mislabels found.

---

## C5 — Defects fixed in place

1. **`tool_surface_delta_193.md` — exclusion-set citation drift (×2 sites).** The doc cited the `getAvailableTools` hidden-tool exclusion `new Set([oW.name, hW.name, _ne.name, Ep])` at `cli_inner_pretty.js:444239`. The actual `let n = new Set([…])` declaration is at **:444237**; line 444239 is `o = Rre(r, e)` (two statements later). Fixed the code-snippet header (`// Location: …:444239` → `:444237`) and the Evidence-note table row (`:444239` → `:444237`, and annotated the 183 comparison as `set = 3 names @436634`). The `let n = new Set([…])` snippet body and the 3→4 / `+_ne.name` claim were already correct and were left unchanged.

No other edits were required — the remaining ~48 anchors, all grep-count diffs, both asset counts, and both `*.md` cross-version diffs reproduced exactly as documented.

---

## C6 — Residuals (honest)

- **`bash_mode_autocomplete.md` accept-handler range `:629693-629707`** is a 3-line-wide bounding box: the shown `if (te.current === "bash-path")` actually starts at 629696 (629693 = the enclosing `let tt = c[yt];`). This is within ±5 and the range correctly bounds the accept statement block, so it was **left as-is** (not a wrong-decl cite). Noted for completeness.
- **Tangential (out of theme scope, no doc claim):** the 193 `defaultShell` describe text says "no Windows auto-flip", yet `Psr()` body still has `if (e === "bash" && !Su()) return "powershell"`. This is carryover shell-selection plumbing owned by `38_permissions/`-adjacent input code; the tools docs make no behavioral claim about it, so it is not a defect here.
- **T4 (`--tools` cold-launch gate fix)** remains correctly flagged LOW confidence / un-isolable. The absence of any `flagsLoaded`/`ensureFlags`/`waitForFlags` symbol (0 in both bundles), the carryover-identical `Sjo`/`b4` machinery, the carryover `FXp`/`Jfe` opt-in latch, and the explicit `gb-before-tools` await being after `Sjo` in both bundles were re-confirmed. A `38_permissions/` startup/gate-ordering follow-up is still the right call.

**Final verdict:** PASS WITH FIXES. **Confidence:** HIGH for deltas T1/T2/T3/T5 (each reproduced with a before/after read against 183 and, where claimed, 156); the single fixed citation drift was cosmetic (right region, wrong-by-2 line). T4 stays honestly LOW by its own (verified) reasoning.
