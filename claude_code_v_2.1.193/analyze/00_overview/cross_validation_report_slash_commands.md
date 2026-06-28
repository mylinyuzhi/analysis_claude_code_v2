# Cross-Validation Report — 43_slash_commands (v2.1.193 delta)

- **Theme:** slash_commands (`/rewind` before `/clear`, hooks comma matcher fix, plugin marketplace `renames` auto-follow, `/review`→code-review medium, `/add-dir` message, `/btw` nav, MAX_RETRIES cap)
- **Module dir:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/43_slash_commands/`
- **Docs audited:** `README.md`, `rewind_before_clear.md`, `plugin_auto_rename.md`, `hook_matcher_comma_fix.md`, `cli_input_and_review_misc.md`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/00_overview/symbol_additions_v2_1_193_slash_commands.md`
- **TARGET bundle (v2.1.193):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build a1938d2a)
- **BEFORE-PICTURE (v2.1.183):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- **EARLIER BASELINE (v2.1.156):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)

**Verdict (one line):** PASS WITH FIXES. Every load-bearing 193 declaration, body, and every NET-NEW / CARRYOVER grep-count claim reproduced exactly in the live bundles. The four deltas (rewind-before-clear, plugin `renames` auto-follow, hooks comma matcher fix, the four CLI/review/retry items) are all materially correct. Three citation drifts were fixed in place (a `tKt` cite landing on a return line, a `Kcn`/`KL` cite off by one, an `Hzn` cite landing on a blank line ~95k lines from the real declaration). No mislabels, no fabricated lines, no false deltas.

---

## Sample

- **193 anchors re-read (sed at exact cited line, declaration/body/string confirmed): 55+** distinct `cli_inner_pretty.js:<line>` citations across all five docs + the additions file.
- **Before-picture decls re-read: 8** in the 183 bundle (`qyf`@577890, `VZe`@176903/176914, `Zrf`@527334/527336, `vEf`@591059, `pWp`@473560, `lTf`@600380, watchdog reader@590654, watchdog export@43455).
- **Grep-count diffs re-run: 22 distinct patterns, each in 193 AND 183 AND 156 (66 grep invocations).** Every count in the docs matched.

---

## C1 — 193 anchor PASS/FAIL (obf → readable → 193 line → verdict)

### rewind_before_clear.md
| Obf | Readable | 193 line | Verified | Result |
|-----|----------|----------|----------|--------|
| `hYt` | `rewindAnchorWriter` | 582712 | `async function hYt(e, t) {` + `...(t?.rewound && { rewound: !0 })` | PASS |
| `MUo` | `rewindAnchorMirror` | 582725 | `async function MUo(e, t) {` (mirrorInternalEntry variant) | PASS |
| `tde` | `readTranscriptChain` | 584448 | `async function tde(e, t) {`; parentUuid remap @584487; rewound track @584494 | PASS |
| `XRc` | `resolveRewindAnchors` | 705599 | `function XRc(e, t)` → `{ persistAnchor: n, precedingAssistantUuid: r }` | PASS |
| `Jdr` | `resetSessionForClear` | 2575 | `function Jdr(e = {})` → `Nt.parentSessionId = Nt.sessionId` | PASS |
| (gate) | `tengu_rewind_first_message` | 707201 | `ra = it("tengu_rewind_first_message", !1)` | PASS |
| (handler) | rewind-conversation handler | 707200-707234 | `ka = ra ? go : rs`; `MUo`/`hYt(ka,{rewound:!0})` exact | PASS |
| — | `conversation_reset` yield / `Jdr` call | 485413 / 485414 | yield@485413, `Jdr({setCurrentAsParent:!0})`@485414 | PASS |
| — | `MessageSelector` label | 178765 | `MessageSelector: "When the message selector (rewind) is open"` | PASS |
| — | `--rewind-files` flag | 193227 | `"--rewind-files",` | PASS |

### plugin_auto_rename.md
| Obf | Readable | 193 line | Verified | Result |
|-----|----------|----------|----------|--------|
| `renames` | marketplace schema field | 55667 | `renames: A.record(A.string(), A.string().nullable())…describe("Append-only map…")` | PASS |
| `jBe` | `PLUGIN_ID_SCHEMA` | 55675 | `(jBe = Ce(() => A.string().regex(…` | PASS |
| `s_t` | `resolvePluginRename` | 478428 | `function s_t(e, t, n)` cycle/removed/chain-too-deep | PASS |
| `Gdf` | `MAX_RENAME_CHAIN` (16) | 478477 | `var Gdf = 16;` | PASS |
| `NHl` | `migrateRenamedPluginsInSettings` | 478443 | `function NHl(e)` settings key rewrite | PASS |
| `p0o` | `loadPluginsWithRenameFollow` | 479482 | `async function p0o({ cacheOnly: e, preview: t = !1 })`; follow flatMap@479507 | PASS |
| `k0n` | `emitPluginRenamedTelemetry` | 195349 | `function k0n(e, t, n)` → `V("tengu_plugin_renamed", …)` | PASS |
| `S9f` | `findOrphanedConfiguredPlugins` | 612532 | `function S9f(e, t, n)` with `l = t.renames && s_t(…)?.kind==="renamed"`@612539 | PASS |
| `G1t` | `getPluginStaleness` | 195014 | `function G1t(e, t, n)` → `sessionsSinceLastUse` | PASS |
| `wAf`/`CAf` | `PLUGIN_STALE_DAYS`/`SESSIONS` | 518436/518437 | `var wAf = 14, CAf = 10;` | PASS |
| `tKt` | `computeListWindow` | ~~517886~~ → **517883** | decl `function tKt(e, t, n)` @517883; `moreAbove: windowStart` return @517886 | **FIXED** |
| — | renames validation site | 521492 | `.extend({ plugins: A.array(a), renames: A.record(…).optional() }).safeParse` | PASS |
| — | chevron guard | 517998 | `d.moreAbove > 0 &&` | PASS |
| — | staleness sweep | 518409-518412 | `G1t(l, r, o)` + `if (u >= wAf && c >= CAf)` | PASS |

### hook_matcher_comma_fix.md
| Obf | Readable | 193 line | Verified | Result |
|-----|----------|----------|----------|--------|
| `s3f` | `hookMatcherMatches` | 589634 | `function s3f(e, t, n, r)`; `split(n ? /[|,]/ : "|")` exact | PASS |
| `o3f` | `HOOK_EVENT_NAMES` | 591335 | `o3f = new Set(["PreToolUse",…"InstructionsLoaded"])` | PASS |
| — | allowComma source | 589831 | `let a = o3f.has(r.hook_event_name);` | PASS |
| `Kcn`/`KL` | `resolveAliases`/`canonicalToolName` | ~~589640~~ → **589641** | use site `.flatMap((i) => Kcn(KL(i), r))` @589641 (589640 = `.filter(Boolean)`) | **FIXED** |
| — | FileChanged path splitter (false-delta) | 240472 | `for (let I of x.matcher.split("|")…)` inside FileChanged-hook fn — DIFFERENT feature | PASS |

### cli_input_and_review_misc.md
| Obf | Readable | 193 line | Verified | Result |
|-----|----------|----------|----------|--------|
| `jot` | `formatAddDirResult` | 177994 | `function jot(e)`; three `alreadyInWorkingDirectory` messages | PASS |
| `isExactMatch`/`isOriginalCwd` | add-dir flags | 177989/177990 | `isExactMatch: jOt.resolve(s) === n`, `isOriginalCwd: s === o` | PASS |
| `xpf` | `BTW_COMMAND_REGEX` | 482363 | `xpf = /^\/btw\b/gi;` | PASS |
| (handler) | `/btw` ←/→ stepping | 482757 / 482763 | `if (G.key === "left"…)`@482757; `K + (G.key === "left" ? -1 : 1)`@482763 | PASS |
| — | `(+M earlier /btw)` indicator | 482874 | `["(+", M, " earlier /btw)"]` | PASS |
| `oRf` | `reviewCommand` | 538534 | `((oRf = {` `effort: "medium"`, `argumentHint: "[pr number]"`, desc redirects to `/code-review` | PASS |
| `rRf` | `buildPrReviewPrompt` | 538510 | `rRf = (e, t) => \`Review target… gh pr view ${e} --json …; gh pr diff ${e}\`` | PASS |
| `nRf` | `PR_REVIEW_FALLBACK_HINT` | 538509 | `nRf = "Run \`gh pr list\`…"` | PASS |
| `Hzn` | review pipeline body (medium tier) | ~~538526~~ → **443362** | decl `(Hzn = \`\`medium effort → 3+5 angles…\``@443362; woven `${Hzn}`@538524 | **FIXED** |
| `O5f` | `getMaxRetries` | 603209 | `function O5f()`; `if (e > Ujo) … return Ujo` | PASS |
| `Ujo`/`_5f` | `MAX_RETRIES_CAP`/`DEFAULT` | 603244/603243 | `_5f = 10, Ujo = 15,` | PASS |
| `pZl` | `maxRetriesWarnedOnce` | 603261 | `pZl = !1,` | PASS |
| `jHe` | `isRetryWatchdogEnabled` | 602803 | `function jHe() { return at(process.env.CLAUDE_CODE_RETRY_WATCHDOG);` | PASS |
| — | watchdog backoff-abort guard | 603017 | `else if (((x = AX(g, C)), !jHe() && x > T5f))` | PASS |

### 183 before-picture decls
| Obf (183) | Readable | 183 line | Verified | Result |
|-----------|----------|----------|----------|--------|
| `qyf` | `hookMatcherMatches` (pipe-only, 3-arg) | 577890 | `function qyf(e, t, n)`; `/^[a-zA-Z0-9_|]+$/`; `split("|")` only | PASS |
| `VZe` | `formatAddDirResult` (single message) | 176903 / 176914 | `function VZe(e)`; "…already accessible within the existing working directory…"@176914 | PASS |
| `Zrf` | `reviewCommand` (no effort) | 527334 / 527336 | `((Zrf = {`@527334; `name: "review"`, `description: "Review a pull request"`@527336 | PASS (note) |
| `vEf` | `getMaxRetries` (no cap) | 591059 | `function vEf()`; `if (Number.isFinite(e) && e >= 0) return e;` | PASS |
| `pWp` | `BTW_COMMAND_REGEX` | 473560 | `pWp = /^\/btw\b/gi;` | PASS |
| `lTf` | `findOrphanedConfiguredPlugins` (no renames) | 600380 | `function lTf(e, t, n)`; byte-identical to `S9f` minus the `&& !l` renames exclusion | PASS |

Note on `Zrf`: cite `527336` lands on the `name: "review"` line (the exact text quoted in the doc); the object opener `((Zrf = {` is 2 lines above at `527334`. Within ±2 and pointing at the quoted content — left as-is.

---

## C2 — False-delta hunt (NET-NEW / CARRYOVER claims vs 183 + 156)

Every grep-count in the docs was re-run in all three bundles. Format: `193 / 183 / 156`.

### NET-NEW claims — CONFIRMED (string absent in 183 AND 156)
| Token / string | 193 | 183 | 156 | Doc claim | Verdict |
|----------------|-----|-----|-----|-----------|---------|
| `rewound` | 12 | 1 | 1 | 1→12 NET-NEW (183's lone hit = `--rewind-files` file-rewind) | CONFIRMED |
| `persistAnchor` | 2 | 0 | 0 | 0→2 (`XRc`) | CONFIRMED |
| `precedingAssistantUuid` | 9 | 0 | 0 | 0→9 | CONFIRMED |
| `tengu_rewind_first_message` | 1 | 0 | 0 | 0→1 gate | CONFIRMED |
| `type: "last-prompt"` write-sites | 3 | 2 | 2 | 2→3 | CONFIRMED |
| `Append-only map of old plugin` | 1 | 0 | 0 | 0→1 schema | CONFIRMED |
| `tengu_plugin_renamed` | 1 | 0 | 0 | 0→1+ telemetry | CONFIRMED |
| `plugin_rename_migration` | 4 | 0 | 0 | 0→4 migrator outcomes | CONFIRMED |
| `chain-too-deep` | 1 | 0 | 0 | 0→1 resolver | CONFIRMED |
| `split(n ? /[|,]/` | 1 | 0 | 0 | 0→1 comma split (the hooks FIX) | CONFIRMED |
| `isExactMatch` | 2 | 0 | 0 | 0→2 add-dir flag | CONFIRMED |
| `isOriginalCwd` | 3 | 0 | 0 | 0→3 add-dir flag | CONFIRMED |
| `key === "left" ? -1 : 1` | 1 | 0 | 0 | 0→1 /btw nav | CONFIRMED |
| `dimColor: S !== J` | 1 | 0 | 0 | 0→1 /btw selection render | CONFIRMED |
| `effort: "medium"` | 1 | 0 | 0 | 0→1 /review (only one such literal in 193, = the review cmd) | CONFIRMED |

### CARRYOVER claims — CONFIRMED (string present in 183)
| Token / string | 193 | 183 | 156 | Doc claim | Verdict |
|----------------|-----|-----|-----|-----------|---------|
| `--rewind-files` | 5 | 5 | 5 | CARRYOVER (file-rewind, not conversation rewind) | CONFIRMED |
| `Run /rewind to recover` | 2 | 2 | 2 | CARRYOVER (strings only) | CONFIRMED |
| `daysSinceLastUse` | 8 | 8 | 0 | CARRYOVER vs 183 (staleness machinery byte-identical 183↔193) | CONFIRMED |
| `more above` | 9 | 9 | 9 | CARRYOVER / UI-only (windowed-list) | CONFIRMED |
| `clamped to` | 3 | 2 | 1 | 2→3, the +1 is the new MAX_RETRIES clamp warning | CONFIRMED |
| `CLAUDE_CODE_RETRY_WATCHDOG` | 2 | 2 | 1 | CARRYOVER env vs 183 (only the MAX_RETRIES cap is new) | CONFIRMED |

**Notes on attribution honesty.** `daysSinceLastUse` (8 in 183, 0 in 156) and `CLAUDE_CODE_RETRY_WATCHDOG` (2 in 183, 1 in 156) both landed in the 156→183 window, so the docs' "CARRYOVER (relative to 183→193)" framing is correct — they predate the audited window and are byte-stable into 193. No NET-NEW claim relied on "new vs 88" reasoning that turned out to be 156/183 carryover; every NET-NEW token is genuinely 0 in BOTH 183 and 156. The structural CARRYOVER claims (`lTf`@600380 byte-identical to `S9f`@612532 minus the `&& !l` renames line; `qyf`@577890 pipe-only predecessor of `s3f`) were verified by reading both bodies, not just grep.

**False-delta trap confirmed correct.** `x.matcher.split("|")`@240472 is inside the `FileChanged` watch-path collector (`(y ?? OB())?.FileChanged`), splitting watch *paths*, not the tool-name hook matcher — exactly as the doc warns. It is pipe-only and is NOT the comma fix.

---

## C3 — Defects fixed in place

1. **`plugin_auto_rename.md` + `README.md` + `symbol_additions_…slash_commands.md` — `tKt` cite.** The function `computeListWindow` (`tKt`) is declared at **517883** (`function tKt(e, t, n) {`); the docs cited **517886**, which is the `return { … moreAbove: r … }` line inside the body. Fixed the function cite to `517883` in all three places and kept `:517886` as the explicit return-line reference for the `moreAbove: windowStart` claim.

2. **`hook_matcher_comma_fix.md` + `symbol_additions_…slash_commands.md` — `Kcn`/`KL` cite.** The `.flatMap((i) => Kcn(KL(i), r))` use site is at **589641**; the docs cited **589640**, which is the preceding `.filter(Boolean)` line. Fixed both `Kcn` and `KL` cites to `589641` (the actual `s3f` flatMap site).

3. **`symbol_additions_…slash_commands.md` — `Hzn` cite.** `Hzn` (the medium-effort review pipeline body, shared with `/code-review`) is declared at **443362** (`(Hzn = \`\`medium effort → 3+5 angles × 6 candidates → 1-vote verify → ≤8 findings\``) and confirmed as the `medium:` tier in the effort map at 650897. The additions file cited **538526**, which is a blank line just after `## Present the review` inside the `rRf` template (the `${Hzn}` weave-in is at 538524, not 538526). Fixed the cite to `443362` and annotated the weave-in site `:538524`. (The module doc prose did not cite a line for `Hzn`, so only the additions file needed editing.)

No prose was churned; no obf→readable mapping tables were introduced into module docs; every `## Related Symbols` section remains list-format.

---

## C4 — Format / CLAUDE.md compliance

- No "Symbol Mapping Reference" / "Symbol Index Reference" sections or obf→readable mapping tables exist in any of the five module docs. The tables present are delta summaries (`# | Delta | Kind | …`), carryover ledgers, and `Token | 183 | 193 | Verdict` evidence tables — none forbidden.
- Each module doc retains its list-format `## Related Symbols` section; the fixes preserved list format.
- Code snippets retain the dual-version `====` header → ORIGINAL → READABLE → Mapping structure; no snippet bodies were altered (only out-of-snippet cite numbers).

---

## Final verdict

**PASS WITH FIXES — confidence HIGH.**

All four in-scope 193 deltas are materially correct and provable in the live bundle: the woven `/rewind`-before-`/clear` capability (`rewound` marker `hYt`/`MUo`, `XRc` resolver, `tengu_rewind_first_message` gate, `tde` chain-follow), the plugin marketplace `renames` auto-follow subsystem (`renames` schema, `s_t` cycle-safe resolver, `p0o` loader follow, `NHl` settings migrator, `k0n` telemetry), the hooks comma-matcher FIX (`s3f` `allowComma` + `/[|,]/` split), and the four CLI/review/retry items (`jot` add-dir, `/btw` nav, `oRf`/`rRf` `/review` medium, `O5f` MAX_RETRIES cap). Every NET-NEW token is 0 in BOTH 183 and 156; every CARRYOVER token is present in 183; every grep-count in the docs reproduced exactly. Three citation drifts were fixed in place.

**Residuals (honest):**
- `Zrf`@527336 (183 before-picture) lands on the quoted `name: "review"` line rather than the `((Zrf = {` opener two lines above (527334); within ±2 and pointing at the quoted text — left as-is.
- `tengu_plugin_renamed` count is exactly 1 in 193 (one `recordEvent` call site); the doc's "0 → 1+" is conservatively phrased but accurate.
- `daysSinceLastUse`/`CLAUDE_CODE_RETRY_WATCHDOG` are CARRYOVER relative to the 183→193 window but were themselves introduced in the 156→183 window (156 counts 0/1); the docs label them CARRYOVER, which is correct for this delta tree.
