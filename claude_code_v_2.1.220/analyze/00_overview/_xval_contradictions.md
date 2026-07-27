# Cross-validation: contradictions between documents in this tree

**Pass type:** default-to-FAIL adjudication. The tree holds **111 module docs + 25 release ledgers +
overview files** written by ~25 independent agents. This pass hunts for places where **two documents
say incompatible things**, and decides each one against the bundle.

**Bundles** ([`../_CONVENTIONS.md`](../_CONVENTIONS.md) §1):

```
T = /lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js   872,596 lines  (verified: wc -l)
B = /lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js   718,679 lines  (verified: wc -l)
```

**Adjudication rule.** Every row below carries bundle evidence that was **read during this pass** —
either a `sed -n` of the cited line in T (and B where relevant) or a `grep -cF` re-measurement.
Counts are `grep -cF` (fixed-string) unless noted; an unescaped `.` in a `grep -c` regex has already
produced at least two false verdicts in this tree.

**Method.** Five seams were worked in parallel — shared-anchor collisions, module-vs-`by_version`
verdicts, count claims, deferral graph, and release attribution — each hunting independently. Findings
were then re-checked: a representative sample of every seam's highest-stakes claims was re-measured
and re-read against the bundle before being written down (e.g. the `_Il` `utf16le` round-trip and the
193 keep-alive gate for §1B; four count pairs for §1C; the whole `.217` #10 function for §2 C6; six
CHANGELOG line/header resolutions for §1D). Every sample re-check confirmed the seam's verdict.

**Two contradictions were fixed before this pass ran** and are not re-listed:
the `.214` PowerShell bypass anchoring dispute (`49_sandbox` was right), and two misfiled bullets
(`.217`/`.218` mojibake, `.211`/`.212` "Request too large"). **Both fixes turn out to be incomplete** —
see §1B B3 and §1D D-3.

---

## 0. Verdict summary

| Class | Count | Worst instance |
|---|---:|---|
| **Version misattribution** — a bullet filed under the wrong release | **41** | `36_background_agents/README.md:484` claims eleven of these were fixed and "the docs now agree"; the sibling doc was never renumbered |
| Module ledger vs `by_version` ledger — opposite verdicts on the same bullet | 22 | `55_auth_providers` calls a **gate removal** "the whole mechanism shipped in 2.1.193" |
| Circular deferrals (A→B→A, nobody covers) | 14 | `07_compact` ↔ `43_slash_commands`, `.217` #10 — a **1/0 named fix** filed UNANCHORED tree-wide |
| Dangling deferrals (A→B, B never heard of it) | 9 | `50_performance` → a `misc` module **that does not exist** |
| Same symbol, two readable names at the same line (symbol index) | **95** | `$hy` = `explainAgentFrontmatterError` **vs** `validateAgentFrontmatterName` |
| Same literal, different counts across docs | 10 | `eN()` printed as **1/0** in one doc and **13/0** in two others |
| False `193=0` proofs (identifier reuse) | 5 (spanning 7 files) | `05_plan_mode` asserts `tcr` *"does not exist in 2.1.193 at all"*; it is 4/4 |
| Standalone wrong counts, verdict unaffected | 13 | `_false_delta_ledger.md` register-2 rows over-counting the 220 column |
| Reference-file claims contradicted by the modules that were told to build on them | 4 | `_GROUND_TRUTH` §6.5 heading still asserts the refuted conclusion |
| Line-precision drift on a hand-verified anchor | 3 | `ZDu = 3` is `:230906`, ground truth says `:230907` |

### The single most serious defect

**`07_compact` ↔ `43_slash_commands` on `.217` #10** (§2, C6). Both modules punt the bullet to each
other; `by_version/2.1.217.md:68` and `changelog_to_code_map.md:149` therefore file it **UNANCHORED**
and even *name the cycle in the doc column*. It is not unanchored. The 2.1.220 bundle carries a
readably-named, one-function fix with an English export table at `:320059-320072`:

```javascript
// ============================================
// dropMalformedAttachments - drops attachment entries whose payload is missing or ill-formed on resume
// Location: cli_inner_pretty.js:320096-320110  (validator Qnd :320077-320095; export table :320059-320072)
// ============================================

// ORIGINAL (for source lookup):
function Arn(e) {
  let t = 0,
    r = e.filter((n) => {
      if (n.type === "attachment" && !Qnd(n.attachment)) return ((t += 1), !1);
      return !0;
    });
  if (t === 0) return e;
  return (
    w(
      `resume: dropped ${t} attachment ${Et(t, "entry", "entries")} with a missing or malformed payload — the session transcript appears partially corrupt`,
      { level: "error" },
    ),
    r
  );
}

// READABLE (for understanding):
function dropMalformedAttachments(entries) {
  let dropped = 0;
  const kept = entries.filter((entry) => {
    if (entry.type === "attachment" && !isWellFormedAttachmentPayload(entry.attachment)) {
      dropped += 1;
      return false;
    }
    return true;
  });
  if (dropped === 0) return entries;                    // fast path: original array, no log
  logError(
    `resume: dropped ${dropped} attachment ${plural(dropped, "entry", "entries")} with a missing or malformed payload — the session transcript appears partially corrupt`,
  );
  return kept;
}

// Mapping: Arn→dropMalformedAttachments, Qnd→isWellFormedAttachmentPayload, e→entries, t→dropped,
//          r→kept, n→entry, w→logError, Et→plural
```

`Qnd` (`:320077-320095`) is a `switch` over `attachment.type` checking each variant's required field
(`new_file`→`filename`, `new_directory`→`path`, `invoked_skills`→`skills[]`, `hook_success`→`content`,
`skill_listing`→optional `names[]`, `hook_additional_context`→`content: string[]`, `default`→accept) —
the exact shape of "a transcript has a malformed attachment entry".

Counts measured this pass: `dropMalformedAttachments` **220=1 / 193=0**,
`isWellFormedAttachmentPayload` **1 / 0**, `with a missing or malformed payload` **1 / 0**.

**Why it matters beyond one bullet:** an ownership loop between two modules propagated an UNANCHORED
verdict into the two files the tree presents as authoritative, and the `by_version` pass — which
rescued nine other cycles — inherited the loop instead of breaking it. The decoy that made this hard is
`tengu_dead_probe_attachment_rename` two lines above at `:320075`, a *legacy-type rename* probe, not
this fix.

---

## 1. Master contradiction table

### 1A. Reference files vs the modules that corrected them

| # | Topic | Doc A | Doc B | Bundle evidence (read this pass) | Who is right | Fix |
|---|---|---|---|---|---|---|
| A1 | **Fast-mode pricing is/is not client-side** | `_GROUND_TRUTH_verified_anchors.md:414` heading — *"§6.5 RESOLVED: … fast-mode pricing is **NOT** client-side"*, body `:438-451` — *"no fast-mode tier and no multiplier anywhere in the pricing code … session cost is under-reported by ~2× in fast mode"* | `47_models/README.md:138-175` and `44_telemetry/README.md:154-167` — *"That conclusion is wrong … there is a **cost-object substitution** keyed on `usage.speed`"* | `Dji` at `:109772-109784` read verbatim: `if (t.speed === "fast") { if (r === "claude-opus-4-8" \|\| r === "claude-opus-5") return a7n; if (r === "claude-opus-4-6" \|\| r === "claude-opus-4-7") return UIc; }`. `a7n` `:109843-109850` = `{inputTokens:10, outputTokens:50, …}`; `UIc` `:109835-109842` = `{30,150,…}`; `zkt` `:109713-109717` applies the same swap for display | **B (both modules).** Fast mode **is** priced client-side | `_GROUND_TRUTH_verified_anchors.md:414` — give §6.5 the same `~~strikethrough~~ — **SUPERSEDED**` treatment §6.6/§6.7 already have, and add the pointer at `:451`. Root `README.md:224-228` already records it; the settled-facts file does not |
| A2 | **`.201` "reverted": flat vs refined** | `47_models/README.md:26`, `:80`, `:125` and `47_models/opus5_and_sonnet5.md:31`, §5 `:411-452` — *"Real change, reverted"* / *"no longer true"*, with no mention of `mro` and no link to `40_system_prompt` | `_GROUND_TRUTH_verified_anchors.md:337-347` (⚠ REFINED block) — *"half right and **must not be quoted alone**"*; `40_system_prompt/mid_conversation_system_role.md` — three framing states | `mro` at `:150395-150397` read: `function mro(e){ return lo(e) === "claude-sonnet-5"; }`. Both consumers read: `:508117` `Jep = Vr((e) => (…, Ser(e) && !mro(e) && !$Fc(lo(e))), …)`; `:531422` `i = r !== void 0 && o && mro(r)` inside `NN` `:531420`. `grep -c '\bmro\b'` = 3 (decl + 2 uses) | **B.** The role-level exclusion reverted; a **Sonnet-5-only presentation carve-out survives** | `47_models/README.md:80` and `:125`, `opus5_and_sonnet5.md:31` and §5 — add "role-level only" and a link to `40_system_prompt/mid_conversation_system_role.md`. `47_models` never cites `mro` |
| A3 | **Model catalogue start line** | `_GROUND_TRUTH_verified_anchors.md:23` — catalogue at `:14028-14496`; propagated to `04_tools/end_conversation_tool.md:184` | `README.md:33`, `47_models/README.md:20`, `47_models/model_catalogue_rewrite.md:19`, `symbol_index_infra_platform.md:537` — `:14008-14496` | Read `:13995-14035`: `var Skl;` `:14006`, `var bkl = S(() => {` `:14007`, **`Skl = {`** `:14008`, `"//": "Hand-maintained baked-in model catalog…"` `:14009`, `schema_version: 1` `:14010`, `pricing_tiers` `:14011`, `models: [` `:14026`, **`id: "claude-3-5-haiku"`** `:14028` | **B.** `:14008` is the catalogue; `:14028` is the **first model entry** | `_GROUND_TRUTH_verified_anchors.md:23` — `:14028` → `:14008`. `04_tools/end_conversation_tool.md:184` likewise |
| A4 | **`ZDu = 3` line** | `_GROUND_TRUTH_verified_anchors.md:98` — *"`ZDu = 3` (`:230907`)"*; `:103` — `hee` spans `:230896-230906` | `symbol_index_core_execution.md:373` — `hee` `:230896-230905`; `53_subagent_limits/spawn_depth_gate.md:65` — block `:230896-230908` | `grep -n` in T: `230896:function hee() {`, **`230906:var ZDu = 3,`**, `230907:  sty = "tengu_hazel_trellis",`, `230908:  Dus = null;` | **B.** `:230907` is `sty`, not `ZDu` | `_GROUND_TRUTH_verified_anchors.md:98` — `:230907` → `:230906`; `:103` — `hee` `:230896-230905` |
| A5 | **"shipped already-expired" vs "1 h 42 m live window"** | `47_models/fast_mode.md:165` — *"A shipped-already-expired default…"*; `47_models/README.md:128` — *"Carryover, and **shipped already-expired**"* | `47_models/fast_mode.md:161-163` (same paragraph!), `README.md:82`, `_GROUND_TRUTH:503-512`, `by_version/2.1.219.md:253-262` — the notice shipped **1 h 42 m 15 s before** its own sunset | `:228` `BUILD_TIME: "2026-07-24T22:17:45Z"`; `:109493` `Ke("tengu_sunset_penguin_opus47", "2026-07-25")` with `Date.now() >= Date.parse(e)` at `:109495`. `2026-07-25T00:00:00Z − 2026-07-24T22:17:45Z = 1:42:15`, so at ship time the notice was **live** | **B.** "Already-expired" is false at ship time and contradicts its own next-but-one sentence | `47_models/fast_mode.md:165` and `47_models/README.md:128` — replace "shipped already-expired" with "shipped with a 1 h 42 m live window; expired for every later run" |

### 1B. Module ledger vs `by_version` ledger — opposite verdicts on the same bullet

Every row was re-measured in this pass. **`grep -cF` unless stated.**

| # | Bullet | Doc A (module) | Doc B (`by_version`) | Bundle evidence | Right | Fix |
|---|---|---|---|---|---|---|
| B1 | `.214` #46 keep-alive on `ECONNRESET` | `55_auth_providers/README.md:74` (repeated `:123`) — **CARRYOVER**, *"the whole mechanism shipped in 2.1.193"*; `Stale connection` 1/1, `disableKeepAlive` 3/3 | `by_version/2.1.214.md:127` — **GATE_REMOVAL** | T `:534548-534549`: `let b = YU_(a); if (b) (w("Stale connection — disabling keep-alive for retry"), UFi());` — B `:602836-602838`: `let b = C5f(a); if (b && it("tengu_disable_keepalive_on_econnreset", !1)) …`. `tengu_disable_keepalive_on_econnreset` **220=0 / 193=1** | **B** | `55_auth_providers/README.md:74`, `:123` → GATE_REMOVAL. **The strongest over-claim on the carryover side in the tree**: every literal is 1/1 and the behaviour still went from never-fires to always-fires |
| B2 | `.217` #3 MCP truncation memory leak | `39_mcp/README.md:111` — **UNANCHORED** (`untruncated` 0/0); `04_tools/README.md:143` — **UNANCHORED → 39_mcp / 50_performance** | `by_version/2.1.217.md:61` + `50_performance/README.md:149` — **NET_NEW**, `_Il` `:20687` | Read T `:20681-20689`: `function m8(e,t){ … return _Il(n >= 56320 && n <= 57343 ? r.slice(1) : r); }` and `function _Il(e){ return Buffer.from(e, "utf16le").toString("utf16le"); }`. That literal is **220=1 / 193=0** — the round-trip that severs the V8 sliced-string parent reference | **B** | `39_mcp/README.md:111`, `04_tools/README.md:143` → NET_NEW, anchor `:20687-20689` |
| B3 | `.214` #2 PowerShell 5.1 permission bypass | `38_permissions/README.md:102` — **UNANCHORED**, `PowerShell 5.1` 3/3 | `by_version/2.1.214.md:83` — **DELTA**, `nDd` `:512802-512807`, refusal `:430929` | `Enterprise policy requires sandboxing, but this command would not be sandboxed on Windows` **220=1 / 193=0** at `:430929`; continues *"…must run sandboxed even when a statement matches an exclusion."* | **B** | `38_permissions/README.md:102` and `:32` — reclassify. (Same finding as the pre-pass `49_sandbox` fix; the permissions ledger row was never updated) |
| B4 | `.208` #12 `CLAUDE_CODE_MAX_OUTPUT_TOKENS` mantissa of `1e6` | `47_models/README.md:84` — **UNANCHORED** (`scientific` 1/1) | `by_version/2.1.208.md:83` + `changelog_to_code_map.md:434` — **NET_NEW**, `Fd` `:4441-4444`, `fUm` `:4431-4440` | Read T `:4431-4455`: `fUm` `:4431-4440` tries `pUm` then `G0l`; `Fd` `:4441-4444` = `fUm(t) ?? parseInt(t,10)`; `pUm = /^[+-]?(\d+(\.\d*)?\|\.\d+)[eE][+-]?\d+$/` at `:4453`. `grep -cF` on that exponent regex → **220=1 / 193=0**. Decoys confirmed: `scientific` 1/1, `toExponential` 3/3 | **B** | `47_models/README.md:84` → NET_NEW with the `Fd`/`fUm` anchors |
| B5 | `.216` #10 undeletable worktree | `36_background_agents/README.md:351` — **NET_NEW**, `could not canonicalize the path` 1/0 `:225693` | `by_version/2.1.216.md:77` — **UNANCHORED**, `worktree has no git` 0/0 | `could not canonicalize the path` **220=1 / 193=0** at `:225693`, inside an eight-arm refusal ladder | **A** | `by_version/2.1.216.md:77` → NET_NEW, anchor `:225685-225700` |
| B6 | `.216` #3 HTTP 401 classifier errors | `38_permissions/README.md:111` — **UNANCHORED** | `by_version/2.1.216.md:70` — **NET_NEW**, `$Od` `:444729` | `/^http_401/` **220=1 / 193=0**; bare `http_401` **2/2** (the decoy). `function $Od(e){ return e !== void 0 && !/^http_401/.test(e); }` at `:444729-444731` | **B** | `38_permissions/README.md:111` and `:32` |
| B7 | `.216` #22 PowerShell invisible Unicode | `04_tools/README.md:139` — **NET_NEW → 38_permissions**, `U+200B` 1/0; `38_permissions/README.md:114` — OTHER MODULE | `by_version/2.1.216.md:89`, §c.4 — **UNANCHORED**, anchor disproven | `U+200B`'s single T hit is `:424585`, a **comment** inside the bundled deep-research script (`// (U+200B-200F, U+202A-202E, …)`); `:323491`/`:431002` are byte-identical to B `:299306`/`:451008` | **B** | `04_tools/README.md:139` and `38_permissions/README.md:114` → UNANCHORED |
| B8 | `.218` #10 IDE-selection mojibake | `04_tools/README.md:146` — **DELTA → 56_chrome_ide**, "surrogate-safe truncation at `:424599`" | `by_version/2.1.218.md:68` — **UNANCHORED**, `:424599` wrong | T `:424597-424599` are three comment lines of the same embedded research script about *URL label* truncation; no IDE-selection code within 100 lines | **B** | `04_tools/README.md:146` — drop the anchor |
| B9 | `.205` #8 session→PR link over the 30 K inline limit | `04_tools/README.md:108` and `36_background_agents/README.md:245` — **UNANCHORED** (`30K` 0/0) | `by_version/2.1.205.md:68` — **NET_NEW**, `uvo` `:316609-316621`, call site `:438149` | `prResolved` **220=8 / 193=0**; `:438149` `E = await uvo(_.stdout, _.outputFilePath)` then `dvo(...).prResolved && !_.backgroundTaskId` | **B** | both module rows → NET_NEW |
| B10 | `.198` #26 `/branch` fork name | `07_compact/README.md:99` — **UNANCHORED** | `by_version/2.1.198.md:87` — **NET_NEW**, `nJd` `:500107-500112` | Export name `deriveFirstPrompt` is **1/1** (the trap). Bodies differ: T `:500107-500112` scans the message array with a `commandFallback` accumulator; B `:482519-482525` reads a single message. `commandFallback` **220=10 / 193=8** | **B** | `07_compact/README.md:99` → NET_NEW (body rewrite behind an unchanged export name) |
| B11 | `.198` #31 `/login` from the agents view | `36_background_agents/README.md:178` — **UNANCHORED** | `by_version/2.1.198.md:92` — **NET_NEW**, `:455400` | `fleetHostCall` **220=8 / 193=7**. T `:455394-455401` login descriptor ends `fleetHostCall: async ({ login: e }) => e(),`; B `:507317-507325` has no such key | **B** | `36_background_agents/README.md:178` → NET_NEW |
| B12 | `.203` #9 bg sessions dropping `ANTHROPIC_BASE_URL` | `55_auth_providers/README.md:88` — **UNANCHORED** (47/40 too common) | `by_version/2.1.203.md:71` — **DELTA**, `:553425` | `s.ANTHROPIC_BASE_URL !== i.ANTHROPIC_BASE_URL` **220=1 / 193=0**; the new `else if` strips `Sxt` and deletes `ANTHROPIC_AUTH_TOKEN` | **B** | `55_auth_providers/README.md:88` → DELTA |
| B13 | `.211` #22 bg titles show the naming model's refusal | `36_background_agents/README.md:314` — **CARRYOVER** (refusal regex 1/1) | `by_version/2.1.211.md:91` — **NET_NEW (prompt-side)**, `yLb` anchor a decoy | `The quotes are data to label` **220=1 / 193=0** | **B** | `36_background_agents/README.md:314` → NET_NEW (prompt-side) |
| B14 | `.210` #32 ← leaves the source session marked | `36_background_agents/README.md:305` — **CARRYOVER** (`keepInPlaceIds` 2/2) | `by_version/2.1.210.md:83` — **DELTA**, `:802689` | `keepInPlaceIds` **2/2** but both sites are in the *plugin manager*; `session you came from` **220=1 / 193=0** at `:802689` | **B** | `36_background_agents/README.md:305` → DELTA |
| B15 | `.205` #14 agent view one line too high | `48_accessibility_ui/README.md:218` — **UNANCHORED** | `by_version/2.1.205.md:74` — **DELTA**, `:802912-802916` | `compactHeader` **220=5 / 193=0**; `rfi` at `:802912-802916` is a two-mode header-height computation absent from B | **B** | `48_accessibility_ui/README.md:218` → DELTA |
| B16 | `.216` #6 vim dot-repeat | `48_accessibility_ui/README.md:290` — **ANCHORED**, `:656935-656966` | `by_version/2.1.216.md:73` — **UNANCHORED**, *"none with a literal"* | T `:656948-656951` adds a provenance test `z = j === b.current` and `{...j, insertedText}`; B `:492841` overwrote with `{type:"insert"}`. `insertedText` **220=15 / 193=9** | **A** | `by_version/2.1.216.md:73` → DELTA; drop "none with a literal" |
| B17 | `.206` #7 expired login → misleading model error | `by_version/2.1.206.md:64` — **CARRYOVER**; `47_models/README.md:82` — **CARRYOVER**, *"not read by this agent"* | `55_auth_providers/README.md:62` — **DELTA**, `:121405-121410` | `OAuthRefreshDeadError` **220=1 / 193=0** at `:121408` — a typed error short-circuiting the model path | **`55_auth_providers`** | `by_version/2.1.206.md:64` and `47_models/README.md:82` → DELTA |
| B18 | `.212` #22 workflow agent grid | `54_remote_control/README.md:73`, `:96` — **UNANCHORED**, "`tengu_frame_publish_context` is the Artifact publisher" | `by_version/2.1.212.md:85` + `42_workflow/README.md:72` — **NET_NEW** with that gate as the lead anchor | `wbd()` `:381715-381717` has one reader, `:381809`, inside an object carrying `title/favicon/label/description` — the artifact publish request. Separately T `:335470-335487` has a **third** `.subscribe` calling `Ocd` `:335489`; B `:464880-464906` has **two** | **Split**: `54_remote_control` right about the decoy, wrong to conclude UNANCHORED; `by_version` right about NET_NEW, wrong to lead with the decoy | `by_version/2.1.212.md:85` — lead with `bHs.subscribe` `:335476`; `54_remote_control/README.md:73` — repoint to `42_workflow` |
| B19 | `.206` #19 ← in the workflow detail view | `42_workflow/README.md:79` — **CARRYOVER**, `:559928` is the prompt-input guard | `by_version/2.1.206.md:76` + `48_accessibility_ui/README.md:224` — **DELTA/PARTIAL**, `:559926-559931` | `tengu_left_arrow_editing_guard` **220=1 / 193=0**, but T `:559920-559935` is `case "left":` of a **text-input** handler (siblings `startOfLine()`, `prevWord()`), entered only when `W.text === ""`; `Nyp` `:559650-559662` state is `{editedEmptyAtMs, armedAtMs, lastLeftPressMs, attachConfirmArmedAtMs}` — a composer FSM with no workflow-phase concept | **A** | `by_version/2.1.206.md:76`, `48_accessibility_ui/README.md:224` → CARRYOVER on the workflow side |
| B20 | `.211` #37 prompt-caching regression | `47_models/README.md:89` — NET_NEW **(gate only)**, `tengu_lapis_anchor_*` **1/0**, owner `api_reliability`; `57_api_reliability/README.md:70` — OTHER MODULE (`40_system_prompt`), lapis **4/1** | `40_system_prompt/README.md:93` + `by_version/2.1.211.md:106` — **NET_NEW breakpoint promotion**, `:511886`/`:511909`/`:511938-511943` | `tengu_lapis_anchor` **220=4 / 193=1** — and all four T sites (`:61361`, `:226383`, `:226391`, `:226399`) are the **token-reminder budget** gate, unrelated to caching. Real site: `:511900-511943`, `cache_control` emitted on `api_system` | **`40_system_prompt` + `by_version`** | `47_models/README.md:89` — wrong count **and** wrong owner; `57_api_reliability/README.md:70` — replace the lapis evidence |
| B21 | `.211` #2 chat-relay sanitiser | `38_permissions/README.md:94` — OTHER MODULE (`remote_control`) | `54_remote_control/README.md` **has no row for it**; `by_version/2.1.211.md:71` doc column `—` | `QUOTE_HOMOGLYPHS` **220=1 / 193=0**; predicate `dV` `:151789-151805` | Bullet is real and net-new; the contradiction is **ownership** | `38_permissions/README.md:94` — claim it (`Gfr` `:384986-384992`, call site `:385213`) or repoint to `by_version/2.1.211.md` §3 |
| B22 | `.219` #20 `/model` picker highlighting | `48_accessibility_ui/README.md:325` — anchor `:120261` | `by_version/2.1.219.md:78` + `47_models/README.md:69` — `:667097` vs `:490616-490617 (193)` | T `:667096-667097` is one `.replaceAll("Opus 5", …)`; B `:490616-490617` is two calls. T `:120258-120261` is `WBc()` building `{value:"opus[1m]", label:"Opus (1M context)"}` — a *row builder*, a different bullet (`.219` #10) | **B** | `48_accessibility_ui/README.md:325` — `:120261` → `:667097` |

### 1C. Same literal, different counts — and false `193=0` proofs

Coverage: **1,516** proximate `220=N / 193=M` claims (1,135 distinct literals) were harvested and
re-measured with `grep -cF`; **1,125** matched the printed literal exactly, including **741 verified
`193=0` claims across 134 files**. The defects below are what survived.

#### C-i. A NET_NEW verdict that flips to CARRYOVER

| # | Literal | Doc A | Doc B | Measured | Right | Fix |
|---|---|---|---|---|---|---|
| C1 | `--bg with bypassPermissions requires accepting the disclaimer` | `_scope_v195_199.md:78` — **1 / 0**, `NET_NEW`, `:683507` | `38_permissions/auto_mode_availability_and_gating.md:112-113`, `38_permissions/README.md:74`, `changelog_to_code_map.md:768`, `by_version/2.1.196.md:72` — **1 / 1**, CARRYOVER | `grep -cF` → **T=1 (`:683507`) / B=1 (`:577592`)**, byte-identical sentence (read both) | **Doc B** | `_scope_v195_199.md:78` → `1 \| 1`, CARRYOVER (twin `:577592 (193)`). `_false_delta_ledger.md` has **no row** for this bullet — add one. *(Only surviving `193=0`-carrying-a-NET_NEW-verdict falsehood in the two registers.)* |

#### C-ii. Same literal, two count pairs

| # | Literal | Doc A | Doc B | Measured | Right | Fix |
|---|---|---|---|---|---|---|
| C2 | `reserved for plugin namespacing` | `_false_delta_ledger.md:406` and `_scope_v215_220.md:225` — **3 / 1** | **six** docs at **2 / 0**: `30_agent_team/README.md:47`,`:128`, `teammate_lifecycle_and_notifications.md:810`, `45_skills/plugin_config_and_security.md:715`, `45_skills/README.md:108`, `by_version/2.1.218.md:411`, `changelog_to_code_map.md:127` | **T=2 (`:269872`, `:269957`) / B=0** | **the module docs** | `_false_delta_ledger.md:406`, `_scope_v215_220.md:225` → `2 \| 0`. The ledger is register-2 ("verified net-new"), so a `193=1` row contradicts its own contract — and six documents already flagged it |
| C3 | `mid_conv_system` | `47_models/README.md:126` — **4 / 0**; `47_models/opus5_and_sonnet5.md:438` — **5 / 1** | `_false_delta_ledger.md:54` and `_scope_v200_205.md:125` — **6 / 1** | bare → **T=6 (`:14207 :14355 :14390 :14428 :150524 :509912`) / B=1 (`:595123`)**; quoted `"mid_conv_system"` → **T=5 / B=0** | **Doc B (the two registers)** | `opus5_and_sonnet5.md:438` missed `:509912` — the 220 twin of the single 193 hit, which is why its own `4 + 1 = 5` arithmetic comes out short. `47_models/README.md:126` → "quoted token 5/0; bare 6/1" |
| C4 | `eN()` | `43_slash_commands/command_and_flag_deltas.md:370` — **1 / 0**, "the two call sites" | `changelog_to_code_map.md:413`, `by_version/2.1.209.md:47`,`:179` — **13 / 0**, "13 call sites" | **T=13 / B=0** (decl `:112712` + 12 call sites) | **map / by_version** | `command_and_flag_deltas.md:370` → 13/0 (1 decl + 12 call sites). The "1" is `grep -cF 'function eN()'` |
| C5 | `_monotonicClock` | `50_performance/README.md:153` — **39 / 34**, DELTA | `by_version/2.1.218.md:76` — **6 / 6**, UNANCHORED (vendored OTel) | `_monotonicClock` → **T=6 / B=6**; bare `monotonic` → **39 / 34** | **by_version** | `50_performance/README.md:153` → UNANCHORED. The DELTA verdict rests entirely on the wrong literal |
| C6 | `tengu_lapis_anchor*` | `47_models/README.md:89` — **1 / 0** | `57_api_reliability/README.md:70` — **4 / 1** | **T=4 / B=1** | **`57_api_reliability`** | see B20 — and the four T sites are the token-reminder gate, not caching |
| C7 | `declineFirst`/`initialIndex` | `47_models/README.md:205` — two terms, **(3/3)** | `_scope_v206_210.md:210` — three terms, **(3/3)** | `declineFirst` **0/0**, `defaultOption` **2/2**, `initialIndex` **1/1** — the 3/3 is the *three*-way sum | **the scope register** | `47_models/README.md:205` — restore `defaultOption` or print `0/0, 2/2, 1/1` |
| C8 | `set_cwd` | `51_headless_sdk/control_requests.md:687` — **13 / 0**, then says "193's two hits are `tengu_shell_set_cwd`" **in the same sentence** | `56_chrome_ide/README.md:45`, `ide_and_desktop.md:109` — **13 / 2** | **T=13 / B=2** (`:301826`, `:301857`) | **`56_chrome_ide`** | `control_requests.md:687` → `13 / 2`. NET_NEW survives; the printed proof self-contradicts |
| C9 | `SKILL_MD:` | `54_remote_control/client_surfaces.md:441` — `SKILL_MD:` **12 / 6** | `file_index.md:376` — `SKILL_MD: () =>` **12 / 6** | `SKILL_MD:` → **24 / 12**; `SKILL_MD: () =>` → **12 / 6** | **`file_index.md`** | `client_surfaces.md:441` — restore the ` () =>` |
| C10 | `thinkingConfig:` | `by_version/2.1.198.md:320` and `_scope_v195_199.md:175` — **50 / 46**, framed as "hunt for four new occurrences" | — | `thinkingConfig:` → **37 / 42** (went **DOWN** by 5); bare `thinkingConfig` → **50 / 46** | neither as printed | Print both. The doc's conclusion (counting cannot see this change) is **strengthened** by the true numbers |

#### C-iii. False `193=0` proofs — identifier reuse (`_CONVENTIONS.md` trap #1)

In every row the **semantic verdict survives** (193's homonym is unrelated code) but the printed proof
is false. This is the trap the conventions file warns about, walked into by the docs that cite it.

| # | Id | Doc claim | Measured T / B | 193's homonym | Fix |
|---|---|---|---|---|---|
| C11 | `tcr` | `05_plan_mode/bash_bypass_and_classifier_212_218.md:47` — *"does not exist in 2.1.193 at all"*, `\btcr\b` **5 / 0** | `grep -cE '\btcr\b'` → **5 / 4** | a re-mangled React import alias, `:685015-685085 (193)` | state the reuse; keep NET_NEW |
| C12 | `gnn` | `05_plan_mode/bash_bypass_and_classifier_212_218.md:355`, `symbol_additions_v2_1_220_plan_mode.md:43`, `symbol_index_core_features.md:1335` — **1 / 0** (three files) | **4 / 4** | a vendored helper, `:9202-9204 (193)` | use `circuitBreaker` **12 / 0** as the count proof |
| C13 | `ptp`,`jQt`,`$Jn`,`jbi`,`Gbi` | `symbol_additions_v2_1_220_tools.md:49` — *"220=1 / 193=0 each"* | **5/4, 4/6, 3/3, 3/3, 4/4** — no `193=0` holds | 193's `Gbi = "net.host.port"` (OTel semconv) `:140530 (193)` vs 220's `setDeferredToolStubGateLatch` `:2786` | use the gate `tengu_deferred_stub_tool` **1 / 0** `:508600` |
| C14 | `Yzr` | `45_skills/plugin_config_and_security.md:273` — **1 / 0** | **4 / 3** | an unrelated lazy-init wrapper `:186007 (193)` | the load-bearing anchor is `a5g` initialiser **1 / 0** `:191083` |
| C15 | `O7a` | `43_slash_commands/fork_and_subtask.md:430` — **4 / 0** | **4 / 3** | the `ExtraUsageDialog` React import `:388412 (193)` | state the reuse |

#### C-iv. Standalone wrong counts (verdict unaffected)

`45_skills/plugin_config_and_security.md:593` — `already handled by` is **1 / 2** not 1/1, and
`Failed to initialize LSP server` is **4 / 3** not 1/1 (220 gains `:307227`) ·
`by_version/2.1.211.md:343` — protobuf timestamp bound is **2 / 2** not 4/4 ·
`38_permissions/auto_mode_availability_and_gating.md:597` — `CLAUDE_CODE_AUTO_MODE_REPO_VISIBILITY` is
**1 / 0** (and `repoVisibility` 3/0); "4" is not reproducible under any reading ·
`45_skills/README.md:91` — `a5g` is **3 / 0** (its initialiser 1/0) ·
`symbol_additions_v2_1_220_models.md:156` and `symbol_index_infra_platform.md:645` —
`Ot.resolvedOrgDefault` is **2 / 0** (bare `resolvedOrgDefault` 3/0), not 3/0 ·
`40_system_prompt/README.md:120` — `perTurnEffort` is **8 / 0**; the 12/0 is the sum with
`per_turn_effort` (4/0), which two sibling docs print correctly ·
`_scope_v206_210.md:355`,`:445` — `isValidElement` is **14 / 14** not 18/18 ·
`_scope_v206_210.md:365` — `"ultracode"` **with quotes** is 27/22; the 83/70 is the bare form ·
`_scope_v206_210.md:137`,`:378` — `${i.label} needs your input` is **1 / 0** (`:802111`); the 5/4 is
the generic `needs your input`, and the register's own §437 note already says so ·
`_false_delta_ledger.md:316` (`tff = 3 * rff`) and `:260` (`multiple hard links, which can alias a file
outside the session's allowed directories`) — both **1 / 0**, not 2/0.

#### C-v. Measurement conventions confirmed (do **not** "fix" these)

- The bundle stores non-ASCII as JS escapes. `Session is starting — …` → **1 / 0** and
  `Forking…` → **2 / 1**. `36_background_agents/agent_view_and_status.md:664` and
  `fork_to_background_session.md:643` are **correct**; re-verifiers must use the escaped form.
- `_false_delta_ledger.md`'s `claude agents --plugin-dir (commander action)` row: the parenthetical is
  **part of the bundle string** (`QI("claude agents --plugin-dir (commander action)")` `:865022`).
  Full string **1 / 0** ✓; truncated it is 2/1.
- `workflow.run_id`: `grep -cE` → 3/2 but `grep -cF` → **1 / 0**. The retraction at
  `_GROUND_TRUTH_verified_anchors.md:149` / `42_workflow/README.md:66` is confirmed correct.

> ⚠ **The tree was being edited during this pass.** `_false_delta_ledger.md` was modified mid-run and
> its line numbers shifted by about +42. **Anchor on the quoted text, not the line number**, for every
> `_false_delta_ledger.md` row above.

### 1D. Version misattribution — 41 bullets filed under the wrong release

**Ground truth** is `claude_code_v_2.1.220/CHANGELOG.md`. Section-header lines verified this pass:
L3 §.220 · L7 §.219 · L34 §.218 · L73 §.217 · L96 §.216 · L139 §.215 · L143 §.214 · L193 §.212 ·
L244 §.211 · L284 §.210 · L320 §.209 · L324 §.208 · L373 §.207 · L400 §.206 · L430 §.205 · L456 §.204 ·
L460 §.203 · L500 §.202 · L521 §.201 · L525 §.200 · L545 §.199 · L572 §.198 · L608 §.197 · L612 §.196 ·
L642 §.195. Per-section `^- ` counts re-measured: `.215`=1, `.216`=**40**, `.217`=**20** — used below to
prove the out-of-range ordinals.

#### D-1. The structural finding: one doc was never renumbered

`36_background_agents/README.md:484` records a correction: *"eleven changelog bullets cited under the
wrong release in the three docs … renumbered against CHANGELOG.md … **the docs now agree with it**."*
**That claim is false.** `36_background_agents/README.md` §4 was renumbered; its sibling
`agent_view_and_status.md` was not. Nine table rows plus one prose reference still carry the
pre-correction labels, and in **every** case the bullet ordinal `#` is right while the release label
drifts *forward* by exactly the skipped-release count (`.201 .204 .209 .213` were never published) —
the signature of the very bug the note claims to have fixed. That same correction note also cites
`` `.215` #11 ``, and §.215 has one bullet.

| `agent_view_and_status.md` | Claims | CHANGELOG truth (line, header) | Contradicted by |
|---|---|---|---|
| `:34` | `.198 #9` | **§.196 #9** — L622, hdr L612 (*"multiple `claude agents` side panel issues…"*) | `36_background_agents/README.md:164` |
| `:35` | `.198 #19` | **§.196 #19** — L632 | `README.md:165` |
| `:36` | `.198 #27` | **§.196 #27** — L640 | `README.md:168` |
| `:38` | `.202 #10` | **§.200 #10** — L536 (*"control bytes from background-agent output…"*) | `README.md:200` |
| `:51` | `.208 #16` | **§.206 #16** — L417 | `README.md:257` |
| `:52` | `.208 #18` | **§.207 #18** — L392 | `README.md:270` |
| `:60` | `.214 #37` | **§.212 #37** — L231 | `README.md:328` |
| `:62` | `.216 #4` | **§.218 #4** — L39 | `README.md:371` |
| `:63` | `.218 #14` | **§.217 #14** — L88 | `README.md:364` |
| `:694` (prose) | `.215 #14` | **§.216 #14** — L111 (§.215 has **1** bullet) | `README.md:353` |

#### D-2. Cross-doc release disagreements (two docs, two releases, one bullet)

| Bullet | CHANGELOG truth | Wrong doc | Right doc |
|---|---|---|---|
| Agents composer discards the message | **§.203 #16** L477 | `43_slash_commands/README.md:132` (`.202 #16`) | `36_background_agents/README.md:223` |
| Desktop sessions stuck "running" | **§.206 #15** L416 | `56_chrome_ide/README.md:44` **and** `ide_and_desktop.md:508` (`.208`) | `51_headless_sdk/README.md:79` |
| Bedrock `awsCredentialExport` hang | **§.206 #24** L425 | `50_performance/README.md:128` (`.207`) | `55_auth_providers/README.md:63` |
| Deep-research "unknown" chips | **§.207 #15** L389 | `42_workflow/README.md:82` (`.208`) | `52_code_review/README.md:79`, `manual_invocation_gating.md:15` |
| SDK "Change directory" | **§.208 #25** L350 | `56_chrome_ide/README.md:45`, `ide_and_desktop.md:509` (`.210`) | `51_headless_sdk/README.md:83` |
| `/install-github-app` blocked in agent view | **§.214 #32** L176 | `43_slash_commands/README.md:103` (`.203 #32`) | `36_background_agents/README.md:343` |
| `/verify` `/code-review` no self-invoke | **§.215 #1** L141 | `45_skills/skill_loading_and_stacking.md:760` (`.216`) | `by_version/2.1.215.md` |
| Skills/commands missing from the slash menu | **§.216 #27** L124 | `43_slash_commands/README.md:144` (`.217 #27`) | `45_skills/README.md:103` |
| Truncated MCP outputs memory leak | **§.217 #3** L77 | `39_mcp/errors_and_diagnostics.md:573` (`.218 #3`) | `50_performance/README.md:149` |
| Auto-compact on Opus 4.8 / Bedrock | **§.217 #6** L80 | `47_models/README.md:92` (`.216 #6`) | `07_compact/README.md:105` |
| Corporate mTLS in Claude Desktop | **§.217 #7** L81 | `56_chrome_ide/README.md:54` (`.216`) | `55_auth_providers/README.md:77` |
| `--max-budget-usd` not stopping bg subagents | **§.217 #20** L94 | `51_headless_sdk/README.md:96` (`.216 #20`) | `53_subagent_limits/README.md:110`, `budget_and_delegation_hardening.md:12` |
| `claude --teleport` repo mismatch | **§.219 #17** L25 | `43_slash_commands/README.md:140` (`.218 #17`) | `36_background_agents/README.md:377` |

#### D-3. The already-"fixed" mojibake defect survives in a third file

The brief records that the `.217`/`.218` mojibake misfile was found and fixed. **It was not fixed
everywhere**: `56_chrome_ide/ide_and_desktop.md:514` still reads `| IDE selection mojibake | .217 |`.
CHANGELOG L45 places *"Fixed mojibake when a long IDE selection was truncated mid-emoji…"* under
**§2.1.218** (hdr L34). Same for `43_slash_commands/README.md:145` (`.218 #10` → **§.217 #10**, L84,
the `--resume` TypeError — the two bullets were swapped in both directions).

#### D-4. Remaining single-doc misattributions

| File:line | Claims | CHANGELOG truth |
|---|---|---|
| `07_compact/README.md:104` | `.215` | **§.216 #35** L132 (§.215 has 1 bullet) |
| `07_compact/README.md:110` | `.218` | **§.217 #10** L84 |
| `07_compact/context_accounting_and_context_command.md:590`, `:603` | `.215 #35` | **§.216 #35** L132 |
| `40_system_prompt/README.md:98` | `.199` | **§.198 #22** L595 |
| `42_workflow/README.md:80` | `.195` | **§.196 #7** L620 |
| `47_models/README.md:81` | `.205 #20` | **§.203 #20** L481 (§.205 #20 is the coloured-state-word bullet, L451) |
| `51_headless_sdk/README.md:74` | `.196 #11` | **§.198 #11** L584 (§.196 #11 is the Remote mid-turn-crash bullet, L624) |
| `43_slash_commands/README.md:143` | `.217 #24` | **§.216 #24** L121 — **§.217 has only 20 bullets** |
| `38_permissions/README.md:231` | `.216 #42`, `.216 #41` | **§.216 has only 40 bullets**; targets are **#29** L126 (telemetry) and **#22** L119 (PowerShell Unicode) |
| `55_auth_providers/README.md:166` | `.199 #28` | **§.199 has only 24 bullets**; "SSL errors fail fast" is **§.199 #2** L548 |
| `36_background_agents/README.md:484` | `.215 #11` | §.215 has **1** bullet — a stale citation inside the correction note |

**Low severity (conflation, not a hard misfile):** `43_slash_commands/README.md:130` merges §.202 #1
(the `/config` row) with §.219 #5 (the `workflowSizeGuideline` key) into one cell — `42_workflow/README.md:75`
files the key correctly under `.219`. `48_accessibility_ui/vim_and_input.md:1038` hedges `.215`/`.216`
for a bullet that exists only at **§.216 #6** L103.

---

## 2. Circular deferral register

**A circular deferral** = module A punts bullet X to module B and B punts X back to A (or onward to a
third module that punts it home), so **no module doc contains the analysis**. The `by_version/` pass ran
after the modules and silently rescued nine of them — which is itself the strongest evidence that
running it last was the right call.

**14 cycles. 8 rescued by `by_version/`. 6 were real holes.** Five of the six are anchorable in T with
counts verified in this pass; only C14 is thin.

> ⚠ **Arithmetic corrected by the orchestrator.** This line originally read *"9 rescued … 5 are real
> holes"*, which the table below does not support: it lists **8** `RESCUED` (C1, C3, C4, C5, C7, C10,
> C11, C13) and **6** `HOLE` (C2, C6, C8, C9, C12, C14). A register that miscounts its own rows is the
> same defect class it exists to catch, so it is fixed here rather than quietly rounded.
>
> **C6 has since been CLOSED.** `.217` #10 was anchored and both authoritative files corrected —
> `by_version/2.1.217.md:68` now reads `NET_NEW` with `dropMalformedAttachments` (`Arn`)
> `:320096-320110` and `isWellFormedAttachmentPayload` (`Qnd`) `:320077-320095`, both **1/0**, and
> `changelog_to_code_map.md` was regenerated from it. **5 holes remain: C2, C8, C9, C12, C14**
> (plus the two dangling holes D1 and D2 in §2b).

| # | Cycle | Bullet | Deferral pointers | Where the analysis actually lives | Status |
|---|---|---|---|---|---|
| C1 | `38_permissions` ↔ `55_auth_providers` | `.207` managed-settings consent from `-p`/SDK | `38_permissions/README.md:87` → auth; `55_auth_providers/README.md:89` → permissions, and `:171-174` "I did not read those sites" | **`by_version/2.1.207.md` §3.1** (`:106-210`) — full dual-version snippet, `deferred_non_interactive` `:455663` | RESCUED |
| C2 | `45_skills` ↔ `47_models` | `.219` #23 `claude-api` skill defaults to Opus 5 | `45_skills/README.md:113`, `:173-174` → models; `47_models/README.md:94`, `:195-201` → skills, anchor column literally *"not read by this agent"* | **NOWHERE.** Only anchor-only rows at `by_version/2.1.219.md:81` and `changelog_to_code_map.md:88`, both of which *name the cycle* | **CLOSED** (owner `45_skills` §8) — `PREV_OPUS_ID` **220=10 / 193=0**, `PREV_OPUS_NAME` **14/0**, table `QzS` `:799615-799630` |
| C3 | `47_models` ↔ `36_background_agents` | `.210` #18 `--effort ultracode` dropped | `36_background_agents/README.md:300`; `47_models/README.md:86`, `:195-201` | **`by_version/2.1.210.md` §3** (`:91-199`) — `uJn` vs 193's `cje` `:802163`, alias table `hBc` `:119651` | RESCUED |
| C4 | `47_models` ↔ `36_background_agents` | `.214` #13 effort in `subagentStatusLine` | `36_background_agents/README.md:337` ("→ part 2", which also never took it); `47_models/README.md:91`, `:197` | **`by_version/2.1.214.md` §3.6** — heading literally reads *"module gap: primary analysis"*; `effort: g.effort` `:750210` 1/0 | RESCUED |
| C5 | `47_models` ↔ `53_subagent_limits` | `.211` #7 model override lost on resume | `47_models/README.md:88`, `:196`; `53_subagent_limits/README.md:100`, `:173-174` | **`by_version/2.1.211.md` §6** — `:344319`, resolver `Wrd` `:318835-318866`, `subagent_model_resolve` 7/0. Both modules had anchored on `modelOverride` 28/16, an unrelated subsystem | RESCUED |
| C6 | `07_compact` ↔ `43_slash_commands` | `.217` #10 `--resume` TypeError on a malformed attachment | `07_compact/README.md:110`, `:180-181` → slash; `43_slash_commands/README.md:145` → compact | **NOWHERE.** `by_version/2.1.217.md:68` and `changelog_to_code_map.md:149` file it UNANCHORED and write *"circular gap: 07_compact defers to 43_slash_commands, which defers back"* | **CLOSED** (owner `43_slash_commands`; anchored during cross-validation and both authoritative files corrected — `by_version/2.1.217.md:68` now reads NET_NEW and `changelog_to_code_map.md` was regenerated from it) — `dropMalformedAttachments` **1/0**, `isWellFormedAttachmentPayload` **1/0**, `with a missing or malformed payload` **1/0**; export table `:320059-320072`, fix `Arn` `:320096-320110`, validator `Qnd` `:320077-320095` (see §0) |
| C7 | `04_tools` ↔ `38_permissions` | `.216` #22 PowerShell invisible Unicode | `04_tools/README.md:139`; `38_permissions/README.md:114`, `:231-232` | **`by_version/2.1.216.md` §c.4** — *disproves* the anchor | RESCUED (but **both READMEs still assert the disproven NET_NEW** — see B7) |
| C8 | `04_tools` ↔ `49_sandbox` | `.216` #36 `/rewind` symlink/hard-link refusal | `04_tools/README.md:142`; `49_sandbox/README.md:155`, `:219-222` | **NOWHERE.** `by_version/2.1.216.md:103` records the anchor with doc column *"verified, no deep doc"*, and `:113` then **wrongly lists #36 as covered**, which is why it escaped that release's `module_gaps` | **HOLE** — `symlink, hard link, or other non-regular file` **1/0** at `:835183`, but that is the *describe string of the counter field* `p_l`; the enforcement site is untraced |
| C9 | `42_workflow` ↔ `51_headless_sdk` | `.205` #2 `--json-schema` invalid / `format` keyword | `42_workflow/README.md:81`, `:188-192`; `51_headless_sdk/README.md:76` | **NOWHERE** in a module doc; three for-the-record lines at `by_version/2.1.205.md:419-421` opening *"the `--json-schema` validator is documented nowhere"* | **CLOSED** (owner `42_workflow` §8) — `schema too large` **220=2 / 193=0**; `fty` `:231103`, walker `uPu` `:231097-231101`, `new Ajv({allErrors:!0, validateFormats:!1})` (the `format` half), caps `:231148-231149` |
| C10 | `41_hooks` ↔ `51_headless_sdk` | `.204` #1 hook events not streaming in headless | `41_hooks/README.md:92`; `51_headless_sdk/README.md:75`, `:157-158` | **`by_version/2.1.204.md` §c** — states the cycle, then anchors both halves (`:845211-845212`, `Kkm` `:845049-845053`; `CLAUDE_RUNNER_ACTIVITY_FD` 3/0) | RESCUED (minor: the two READMEs disagree `:840835` vs `:840836`) |
| C11 | `44_telemetry` ↔ `50_performance` | `.217` #2 transcript-write / saving-off warnings | `44_telemetry/README.md:112`, `:192-194`; `50_performance/README.md:148`, `:193` | **`by_version/2.1.217.md` §c.1** — `tengu_transcript_writer_recovered` `:522797`, `tengu_persistence_suppressed` `:749593` | RESCUED. Both modules had already **agreed** the verdict was NET_NEW and still neither wrote it — a pure ownership standoff |
| C12 | `43_slash_commands` ↔ `45_skills` | `.200` #11 `claude agents --plugin-dir` ignored | `43_slash_commands/README.md:129`; `45_skills/README.md:83` | **NOWHERE.** `by_version/2.1.200.md:69` and `changelog_to_code_map.md:666` both end the doc column with *"— gap"* | **CLOSED** (owner `43_slash_commands` §1.6) — ⚠ anchor re-measured **2/1**, not 1/0; true delta is 3 inserted lines `:865021-865023`. Uncovered a **policy bypass**: the old fast path gates `--plugin-dir` behind `areSideloadFlagsDisabledByPolicy` (`:872446`, the only consumer bundle-wide) and the new site does not; a post-commander re-parse of raw argv at `:865020-865022` |
| C13 | `38_permissions` ↔ `39_mcp` | `.206` #12 `--permission-prompt-tool` cold start | `38_permissions/README.md:82`; `39_mcp/README.md:98`, `:147-149` | **`by_version/2.1.206.md` §C.1** — second wait phase `:849288-849292`, `permissionPromptToolServerName` 3/0 | RESCUED |
| C14 | `51_headless_sdk` ↔ `53_subagent_limits` | `.212` #21 `ExitWorktree` "no active session" | `51_headless_sdk/README.md:90`; `53_subagent_limits/README.md:104`, `:175` | **NOWHERE** beyond counts. `by_version/2.1.212.md:573` §5 names the cycle | **HOLE (thin)** — literal genuinely 1/1; no string surface, neither module attempted a structural diff. Lowest priority |

**Soft cycle, not a defect:** `.203` #20 / `.205` #20 "bg sessions ignoring `effortLevel` when daemon-forked"
— `47_models/README.md:81` ↔ `36_background_agents/README.md:227`, `:411-415`. Both probed
`effortLevel` 23/19 and stopped. Two honest negative results, but nobody is pursuing the
`cappedDispatch`/`rosterExtras` diff that would settle it.

### 2b. Dangling deferrals (A → B, and B never heard of the bullet)

| # | Pointer | Bullet | Reality | Status |
|---|---|---|---|---|
| D1 | `49_sandbox/README.md:157` → `36_background_agents` + `42_workflow`; `53_subagent_limits/README.md:103`, `:169` → `38_permissions`/`49_sandbox` | `.212` #8 worktree creation through a committed `.claude/worktrees` symlink | **No `.212` #8 row in `36_background_agents/README.md`**; `42_workflow/README.md:74` covers only the `.216` half; `38_permissions` has no row | **CLOSED** (owner `36_background_agents/session_store_and_worktrees.md` §8; TOCTOU verdict MEDIUM — static committed-symlink attack closed, active local race not) — three modules read the anchor `:224562-224564` (`git_worktree_create_symlink_rejected` **1/0**), none wrote the mechanism. `by_version/2.1.212.md:572` §5 recommends `session_store_and_worktrees.md` §5 |
| D2 | `44_telemetry/README.md:115`, `:187-189` → `50_performance` | `.218` #16 PR events lost on immediate exit | **`50_performance/README.md` has no row**, and its "Not covered" table `:190-198` omits it | **CLOSED** (owner `50_performance/disk_and_transcript.md` §6; verdict **narrowed, not closed** — 4 residual holes, incl. a default `onEpochMismatch` of bare `process.exit(1)` `:415612-415616`) — `registerPreExitFlush` **220=2 / 193=0** at `:416193-416195`; registry `kFn` `:4353`, drain `HFn` `:4356`, second caller `:538578`. A whole pre-exit flush registry shipped unanalysed |
| D3 | `50_performance/README.md:150` → **`misc`** | `.217` #4 Windows update loses `claude.exe` | **There is no `misc` module in this tree** — the pointer resolves nowhere | RESCUED by `by_version/2.1.217.md` §c.2 (`preserved copy` 5/0, `update_apply_heal` 3/0, `:539197`). Fix the pointer |
| D4 | `45_skills/README.md:111`, `:177-178` → `38_permissions` + `30_agent_team` | `.218` agent-frontmatter hook workspace trust | Neither named module mentions it | MIS-ROUTED — actually covered by `41_hooks/hook_trust_and_origin.md` §1 (`MTo` `:342023`, `tengu_agent_hooks_origin_untrusted` 1/0). Repoint |
| D5 | `53_subagent_limits/README.md:87` → `36_background_agents` | `.198` #1 subagents background by default | `36_background_agents/README.md`'s `.198` section has no such row | RESCUED by `by_version/2.1.198.md` §3 (`:397986`, `:398208`) |
| D6 | `04_tools/README.md:111` → `38_permissions`; `49_sandbox/README.md:161` → `53_subagent_limits` | `.206` #5 `EnterWorktree` confirmation | **Double dangle** — two modules point at two different third modules, neither of which claims it | RESCUED by `by_version/2.1.206.md` §C.4 (`:406425-406446`) |
| D7 | `04_tools/README.md:138` → `38_permissions` | `.216` #21 Bash non-ASCII word boundaries | `38_permissions/README.md`'s ledger has no row | COVERED in `38_permissions/security_hardening_214.md:242` (`synthesized zero-width token` **1/0** at `:210396`). Only the ledger row is missing |
| D8 | `04_tools/README.md:136` → `40_system_prompt`; `:137` → `54_remote_control` | `.216` #4/#5 AskUserQuestion | Neither named module has a row | SELF-COVERED in `04_tools/web_and_misc_tools_deltas.md` §6. The README arrows are misleading |
| D9 | `42_workflow/README.md:80`, `:188-192` → `04_tools`/`51_headless_sdk` | `.195` #7 duplicate recap on schema-rejected `StructuredOutput` | Neither named module has a row | RESCUED as a **negative** by `by_version/2.1.196.md` §c.3 (three candidates eliminated) |

---

## 3. The largest systematic contradiction: duplicate rows in the symbol index

The four `symbol_index_*.md` files were merged from the 25 `symbol_additions_v2_1_220_*.md` staging
files **without a dedup step**. The signature is visible in the row numbers: an early row from the
module merge and a late row (typically >1380) from the additions merge.

| File | Rows | Unique ids | Ids with >1 row | **Same start line, different readable name** |
|---|---:|---:|---:|---:|
| `symbol_index_core_execution.md` | 327 | 305 | 2 | **1** |
| `symbol_index_core_features.md` | 1,278 | 1,152 | 45 | **37** |
| `symbol_index_infra_platform.md` | 1,367 | 1,227 | 62 | **41** |
| `symbol_index_infra_integration.md` | 567 | 504 | 23 | **16** |
| **Total** | 3,539 | 3,188 | **132** | **95** |

This is exactly the failure mode `CLAUDE.md` calls **Mistake 3** ("same symbol with different readable
names in different places"). Some pairs are harmless aliases (`isNonInteractive` / `isNonInteractiveSession`);
others are semantically wrong. Adjudicated samples:

| Id | Line | Competing names | Bundle evidence (read this pass) | Verdict |
|---|---|---|---|---|
| `$hy` | `:269867` | `explainAgentFrontmatterError` (core_features `:40`) vs `validateAgentFrontmatterName` (`:1430`) | Reads `{name, description}`, returns `Ee('Missing required "name" field…')` / `…must not start with "-"` / `…must not contain ":"` / `Missing required "description"` / `Unknown parsing error`. It **never returns success** and it checks `description` too | **`explainAgentFrontmatterError`.** The `validate…Name` row is wrong on both counts |
| `EJi` | `:158059` | `detectInlineHashHazard` (`:240`) vs `recordUnprovableInlineHash` (`:1448`) | Matches a `key: value` line, strips quoted spans, and if a `#` survives **pushes the key onto the accumulator `t`** (`unprovableKeys`, `:158057`) | **`recordUnprovableInlineHash`** — `detect…` omits the side effect |
| `Ede` | `:118826` | `getEnvDeclaredCapability` (infra_platform `:492`) vs `getCustomModelCapabilityOverride` (`:633`) | Memoised `(modelId, token) => boolean\|undefined`; scans `eug` pairs of `ANTHROPIC_DEFAULT_*_MODEL` + `…_SUPPORTED_CAPABILITIES` and tests membership; `if (rm()) return;` guards it | Both defensible; **pick one**. `40_system_prompt` already uses `getCustomModelCapabilityOverride` |
| `jIc` | — | `:109720-109725` (`:604`) vs `:109718-109722` (`:1596`) | `function jIc(e) {` at **`:109718`**, closing `}` at **`:109722`** | **`:109718-109722`**; row `:604` is wrong |
| `GIc` | — | `:109726-109738` (`:603`) vs `:109723-109738` (`:1595`) | `function GIc(e, t) {` at **`:109723`** | **`:109723-109738`**; row `:603` is wrong |
| `eug` | — | `:118804-118825` (`:494`) vs `:118800` (`:635`) | `var eug, Ede;` at `:118800` (declaration); `eug = [` at `:118804` (assignment, runs to `:118825`) | Both real; the index must say which convention it uses |
| `Cke` | — | `:520091` (core_features `:1120`) vs `:215213` (`:1151`) | `function Cke(e) { return "async" in e && e.async === !0; }` at **`:215213`**; `:520091` is a call site | **`:215213`**; annotate or drop row `:1120` |
| `Nyp` / `Fyp` / `Oyp` / `UXs` / `GV_` | `:559650` etc. | **three** names each across infra_integration `:61-65`, `:309-327`, `:720-730` | `Nyp` `:559650-559662` returns `"reject"/"attach-absorb"/"attach-arm"/"fire"/"absorb"/"arm"` — a pure classifier | The left-arrow family was merged **three times**. `classifyLeftArrow*` is the accurate shape for `Nyp` |
| `Hn` | `:100302` | `getAPIProvider` (`:97`, `:1096`) vs `getProviderChannel` (`:683`) — **three rows** | — | Collapse to one |

### Adjacent, same class: cross-file symbol conflicts

| Id | Docs | Bundle evidence | Verdict |
|---|---|---|---|
| `atp` / `utp` | `symbol_additions_v2_1_220_tools.md:206` — `atp` = `postNormalizeToolInput` `:508391-508471`; `symbol_additions_v2_1_220_todo_tasks.md:225`,`:235` — `atp` = `normalizeToolInput` `:508391-508471`, `utp` = `postNormalizeToolInput` `:508507-508531` | `function atp(e, t, r)` `:508391` (switch on `e.name`, called at `:531890` after `ctp`); `function utp(e, t, r = !0)` `:508507` (called at `:531601`) | **`todo_tasks`.** `tools.md:206` must be renamed to `normalizeToolInput` and gain a `utp` row. Note `todo_tasks.md:232-236` quotes `tools.md`'s **old** line range — that quote is now stale and should be updated when the row is fixed |
| `$Om` | `symbol_index_core_features.md:771` + `symbol_additions_…_slash_cli.md:174` — `describeUnparseableEntries` `:865375`; `symbol_index_infra_platform.md:843` + `…_permissions.md:189` — `dedupeAutoModeSectionLabels` `:865420` | `function $Om(e)` is at **`:865420-865424`** (dedupe + `(n) entries` suffix); `:865375` is a **call site**; the module's own export table at `:865310` names it **`describeLossyPaths`** | **Neither name matches the bundle.** Use `describeLossyPaths` and the declaration line `:865420-865424`. (`OOm` `:865414-865419` is `describeAutoModeBlock`) |
| `Qry` | `symbol_additions_…_tools.md:168` — `streamFileLines` `:235137`; `symbol_index_core_execution.md:106` + `…_performance.md:40` — `streamLinesFromFile` `:235315` | `function Qry(e,t,r,n,o,i,s,a)` at **`:235315`**; `:235137` is the call site | **`:235315`**; pick one name |
| `Lpn`, `mJd`, `A_f` | infra_integration `:541-544` vs `:554-558` | Export table `:500336` names `Lpn` **`spawnForkFromDirective`**; `var A_f = {}` is `:695431`, `tt(A_f, …)` is `:695432` | Use the bundle's own export names; `A_f` = `:695431-695432` |

**Not a conflict (checked):** `pRt` and `wZ` are both cited at `:158237` — correct, both are assigned on
that one pretty-printed line: `((wZ = /^---\s*\n([\s\S]*?)---\s*\n?/), (pRt = /^---[ \t]*\r?\n…/));`

---

## 4. Checked and found consistent

Recording these so the next pass does not re-plough them.

- **`changelog_to_code_map.md` is a faithful consolidation of `by_version/`.** Machine-joined all
  **579** map rows against the 25 release ledgers: **zero** real verdict mismatches (the one apparent
  hit, `.196` #8, is a table-parse artefact from an escaped `\|` — both files say UNANCHORED).
- **Bullet-count integrity — clean.** Independently counted `^- ` bullets per `## 2.1.NNN` section of
  `CHANGELOG.md` against the map's per-release row counts and every `by_version` header claim:
  **all 25 releases match exactly** (`.195=12 … .220=1`, total **579**). The map's §2 verdict tally
  also sums to 579. No `## 2.1.213` or `## 2.1.194` section exists.
- **`by_version/` bullet identity — clean.** All **579** ledger rows were resolved *positionally*
  (row *N* ↔ CHANGELOG bullet *N* of that section) and all 579 matched. **No invented, misfiled, or
  uncovered bullets in `by_version/`** — the misattributions in §1D are all in *module* docs. Note the
  contrast: the release ledgers are numerically perfect; the module ledgers are not.
- **Module-coverage claim verified.** `changelog_to_code_map.md:44` says "518 of 579 bullets (89.5%)
  link to a module document" — machine-counted: **exactly 518 covered / 61 in the gap register**.
- **Bundle identity.** `wc -l` → 872,596 / 718,679; `wc -c` → 29,422,342 / 24,097,739. Matches
  `_CONVENTIONS.md` §1 exactly.
- **Tool asset counts.** `assets/tools/` = **66** files (**65** `.md` + `_index.json`); `_index.json`
  = **65** records, **64** unique names; 193 = 52 files / 50 records. `_CONVENTIONS.md:26`,
  `file_index.md:143`, `:304`, `:311`, `04_tools/tool_surface_delta_220.md:6` and
  `_GROUND_TRUTH:239-241` all agree and are all right.
- **Subagent cap defaults.** `gty = 20` `:231411`, `yty = 200` `:231412`, `_ty = 200` `:231413`,
  `ZDu = 3` `:230906` — the changelog values in `_GROUND_TRUTH` §6.1 are correct (only the `ZDu`
  *line* is off by one, A4).
- **`.212` #35 web-search retry** — `04_tools/README.md:127` and `by_version/2.1.212.md:98`
  independently refute the same scoping anchor. Consistent.
- **`.217` #11 pending permission prompts** — `38_permissions/README.md:116` defers to
  `54_remote_control/README.md:77`, which owns it (`:414765-414784`). Ownership chain intact.
- **`.211` #1 `--forward-subagent-text`**, **`.211` #11/#33**, **`.208` #1**, **`.212` #44**,
  **`.218` #34/#35**, **`.217` #19**, **`.210` #10**, **`.199` #23**, **`.218` #3** — module and
  `by_version` differ only in vocabulary, with identical anchors and counts.

**Minor, non-contradictory:** `changelog_to_code_map.md` §1 documents six verdict tokens but the tree
also uses **`DISCREPANCY`** (map `:532` and `by_version/2.1.206.md:83`, the "OTHER 1" bucket) and
`GATE_REMOVAL` only in passing. Add `DISCREPANCY` to the §1 legend.

---

## 5. Fix list, grouped by file

Highest-consequence first. Every line number is the row to edit.

> ⚠ The tree was under concurrent edit during this pass. Line numbers for
> `_false_delta_ledger.md` (and possibly `_scope_v*.md`) may have drifted — **match on quoted text**.

**Renumber against CHANGELOG (41 bullets, §1D)** — largest single batch
- `36_background_agents/agent_view_and_status.md:34,35,36,38,51,52,60,62,63,694` — the doc was never
  renumbered; `36_background_agents/README.md:484`'s "the docs now agree" claim must be retracted, and
  its own `.215 #11` citation corrected
- `43_slash_commands/README.md:103,132,140,143,144,145` · `56_chrome_ide/README.md:44,45,54` and
  `ide_and_desktop.md:508,509,514` · `07_compact/README.md:104,110` and
  `context_accounting_and_context_command.md:590,603` · `47_models/README.md:81,92` ·
  `51_headless_sdk/README.md:74,96` · `42_workflow/README.md:80,82` · `50_performance/README.md:128` ·
  `40_system_prompt/README.md:98` · `39_mcp/errors_and_diagnostics.md:573` ·
  `45_skills/skill_loading_and_stacking.md:760` · `38_permissions/README.md:231` ·
  `55_auth_providers/README.md:166`
- **`56_chrome_ide/ide_and_desktop.md:514` is a surviving instance of the `.217`/`.218` mojibake defect
  the brief lists as already fixed** — the fix did not reach this file

**Reference files**
- `_GROUND_TRUTH_verified_anchors.md:414` — mark §6.5 `~~…~~ — **SUPERSEDED**` (A1)
- `_GROUND_TRUTH_verified_anchors.md:23` — `:14028` → `:14008` (A3)
- `_GROUND_TRUTH_verified_anchors.md:98` — `ZDu` `:230907` → `:230906`; `:103` — `hee` `:230896-230905` (A4)
- `_scope_v195_199.md:78` — NET_NEW → CARRYOVER, `1 | 0` → `1 | 1` (C1); add the missing
  `_false_delta_ledger.md` register-1 row
- `_false_delta_ledger.md` — `reserved for plugin namespacing` `3|1` → `2|0` (C2); `tff = 3 * rff` and
  `multiple hard links…` 220 columns `2` → `1` (C-iv)
- `_scope_v215_220.md` — `reserved for plugin namespacing` `3|1` → `2|0` (C2)
- `_scope_v206_210.md` — `isValidElement` 18/18 → 14/14; `"ultracode"` quoting;
  `${i.label} needs your input` 5|4 → 1|0 (C-iv)

**Verdict flips (module → by_version was right)**
- `55_auth_providers/README.md:74`, `:123` → GATE_REMOVAL (B1) · `:88` → DELTA (B12) · `:62` is already right (B17)
- `39_mcp/README.md:111` and `04_tools/README.md:143` → NET_NEW (B2)
- `38_permissions/README.md:102`, `:111`, `:32` → anchored (B3, B6) · `:114` → UNANCHORED (B7) · `:94` ownership (B21)
- `47_models/README.md:84` → NET_NEW (B4) · `:89` count + owner (B20) · `:126` counts (C1) · `:80`, `:125`, `:128` wording (A2, A5)
- `04_tools/README.md:108`, `139`, `146` (B7, B8, B9)
- `07_compact/README.md:99` → NET_NEW (B10)
- `36_background_agents/README.md:178`, `:245`, `:305`, `:314` (B9, B11, B13, B14)
- `48_accessibility_ui/README.md:218`, `:224`, `:325` (B15, B19, B22)
- `50_performance/README.md:153` → UNANCHORED (C2)
- `57_api_reliability/README.md:70` — replace lapis evidence (B20)

**Verdict flips (by_version → module was right)**
- `by_version/2.1.216.md:77` → NET_NEW (B5) · `:73` → DELTA (B16) · `:113` mis-lists `.216` #36 as covered (C8)
- `by_version/2.1.206.md:64` → DELTA (B17) · `:76` → CARRYOVER on the workflow side (B19)
- `by_version/2.1.212.md:85` — drop the decoy anchor (B18)

**Coverage holes to close (all anchorable, counts verified)**
- `.217` #10 → `07_compact/context_accounting_and_context_command.md` (C6) — **priority**
- `.219` #23 → `45_skills/skill_loading_and_stacking.md` (C2)
- `.205` #2 → `51_headless_sdk/` (C9)
- `.200` #11 → `43_slash_commands/command_and_flag_deltas.md` §1 (C12)
- `.216` #36 → `04_tools/file_and_search_tools_deltas.md` (C8)
- `.212` #8 → `36_background_agents/session_store_and_worktrees.md` §5 (D1)
- `.218` #16 → `50_performance/disk_and_transcript.md` or `44_telemetry/` (D2)

**Count corrections (§1C)**
- False `193=0` identifier-reuse proofs: `05_plan_mode/bash_bypass_and_classifier_212_218.md:47`,`:355` ·
  `symbol_additions_v2_1_220_plan_mode.md:43` · `symbol_index_core_features.md:1335` ·
  `symbol_additions_v2_1_220_tools.md:49` · `45_skills/plugin_config_and_security.md:273` ·
  `43_slash_commands/fork_and_subtask.md:430`
- Wrong pair printed: `43_slash_commands/command_and_flag_deltas.md:370` (1/0 → 13/0) ·
  `51_headless_sdk/control_requests.md:687` (self-contradicting) ·
  `54_remote_control/client_surfaces.md:441` · `47_models/opus5_and_sonnet5.md:438` ·
  `47_models/README.md:126`,`:205` · `by_version/2.1.198.md:320` + `_scope_v195_199.md:175` ·
  `45_skills/plugin_config_and_security.md:593` · `by_version/2.1.211.md:343` ·
  `38_permissions/auto_mode_availability_and_gating.md:597` · `45_skills/README.md:91` ·
  `symbol_additions_v2_1_220_models.md:156` + `symbol_index_infra_platform.md:645` ·
  `40_system_prompt/README.md:120`

**Symbol index dedup** — 95 same-line name conflicts (§3). Mechanical: keep the row whose name matches
the bundle's own export table where one exists, drop the other, and re-run the merge with a dedup key
of `(id, start_line)`.

**Pointer repairs**
- `50_performance/README.md:150` — `→ misc` names a module that does not exist (D3)
- `45_skills/README.md:111`, `:177-178` — repoint to `41_hooks` (D4)
- `04_tools/README.md:136-137` — the arrows contradict the module's own coverage (D8)
- `changelog_to_code_map.md` §1 — add `DISCREPANCY` to the legend

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](symbol_index_infra_integration.md) - Integrations

Symbols adjudicated in this pass (obfuscated id in parentheses; every line below was read in the
2.1.220 bundle during this pass):

- `resolveModelCosts` (`Dji`, `:109772-109784`) - the `usage.speed === "fast"` cost-table swap that refutes ground truth §6.5
- `FAST_MODE_COSTS_10_50` (`a7n`, `:109843-109850`) - `{inputTokens:10, outputTokens:50, …}`
- `FAST_MODE_COSTS_30_150` (`UIc`, `:109835-109842`) - the Opus 4.6/4.7 fast rate
- `fastModeCostsForDisplay` (`zkt`, `:109713-109717`) - the `/fast` confirmation string's source
- `getOpus47FastModeSunsetDate` (`LIc`, `:109491-109497`) - default `"2026-07-25"`, 1 h 42 m after `BUILD_TIME` `:228`
- `isSonnet5` (`mro`, `:150395-150397`) - the surviving `.201` presentation-level carve-out
- `supportsMidConversationSystem` (`Ser`, `:150505-150526`) - the role-level capability resolver
- `BAKED_MODEL_CATALOGUE` (`Skl`, `:14008-14496`) - `Skl = {` at `:14008`, first model id at `:14028`
- `getMaxSubagentSpawnDepth` (`hee`, `:230896-230905`) - env → gate → constant
- `DEFAULT_SPAWN_DEPTH` (`ZDu`, `:230906`) - `= 3`
- `normalizeToolInput` (`atp`, `:508391-508470`) - pre-dispatch switch on `e.name`
- `postNormalizeToolInput` (`utp`, `:508507-508531`) - the `:531601` path
- `describeLossyPaths` (`$Om`, `:865420-865424`) - export-table name at `:865310`
- `describeAutoModeBlock` (`OOm`, `:865414-865419`)
- `streamLinesFromFile` (`Qry`, `:235315`) - declaration, not the `:235137` call site
- `isAsyncHookResponse` (`Cke`, `:215213`) - declaration, not the `:520091` call site
- `explainAgentFrontmatterError` (`$hy`, `:269867`) - returns messages, never success
- `recordUnprovableInlineHash` (`EJi`, `:158059`) - pushes onto the `unprovableKeys` accumulator
- `getEnvDeclaredCapability` (`Ede`, `:118826-118844`) - `eug` env pairs declared at `:118800`, assigned `:118804-118825`
- `catalogPricingToModelCosts` (`GIc`, `:109723-109738`)
- `formatCatalogPriceLabel` (`jIc`, `:109718-109722`)
- `classifyLeftArrowGesture` (`Nyp`, `:559650-559662`) - returns fire / arm / absorb / attach-arm / attach-absorb / reject
- `truncateTailSevered` (`m8`, `:20681-20686`) and `severSlicedStringParent` (`_Il`, `:20687-20689`) - the `.217` MCP leak fix
- `isNotHttp401` (`$Od`, `:444729-444731`) - `!/^http_401/.test(e)`
- `parseGroupedOrExponentInt` (`fUm`, `:4431-4440`) and `parseIntLike` (`Fd`, `:4441-4444`) - the `.208` `1e6` fix
- `EXPONENT_INT_RE` (`pUm`, `:4453`) - **220=1 / 193=0**
- `dropMalformedAttachments` (`Arn`, `:320096-320110`) and `isWellFormedAttachmentPayload` (`Qnd`, `:320077-320095`) - the uncovered `.217` #10 fix; export table `:320059-320072`
- `spawnForkFromDirective` (`Lpn`, `:500337`) - export-table name at `:500336`
- `resolveModelCostsFast` display twin (`zkt`, `:109713-109717`) - `Fot[e] ?? l7n` unless fast
- `isDeferredStubGateLatched` (`Gbi`, `:2786`) - 220's `Gbi`; 193's `Gbi` is `"net.host.port"` `:140530 (193)` (identifier reuse)
- `parseGroupedDigitsInt` regex (`G0l`, `:4454`) and `GROUP_SEP_RE` (`W0l`, `:4455`)
- `disableKeepAliveForRetry` call site (`:534548-534549`) - 193's twin `:602836-602838 (193)` was gated by `tengu_disable_keepalive_on_econnreset` (**220=0 / 193=1**)
- `validateAgentHooksBlock` (`Nhy`, `:269876`) - the hooks branch immediately after `$hy`
