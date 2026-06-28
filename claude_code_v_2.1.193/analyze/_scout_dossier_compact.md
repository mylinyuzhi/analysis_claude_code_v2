# Scout Dossier — Compaction (v2.1.183 → v2.1.193 delta)

> **Scope:** the COMPACTION subsystem only, across the published window 2.1.185 / .186 / .187 / .190 / .191 / .193.
> **TARGET (every claim proven here):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build a1938d2a).
> **BEFORE-PICTURE:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines, build 9d251abd).
> **88 ancestor:** `/lyz/codespace/3rd/claude-code/src`. **183 baseline docs:** `claude_code_v_2.1.183/analyze/07_compact/` (README + 4 deep docs).
> All line anchors are in the **193** bundle unless explicitly tagged `(183)`.

---

## TL;DR (honest answer to the brief)

**There is NO new compaction *behavior* in the 2.1.183 → 2.1.193 window.** Every behavioral lane the user asked me to check — the `--fallback-model`-honoring summarize loop, the 1M-credits-without-credits clamp, the 6-source window resolver, the micro-compact `context_hint` beta, the auto-compact/failure/rapid-refill thresholds, the `tengu_compact*` telemetry, and the prefix-overflow pre-check — is **byte-for-byte carryover** (only obf names re-mangled). The compaction summary prompt is md5-identical. There are **zero** net-new compaction feature-gates, env vars, or CLI flags in the window.

**The single real source-level change is an internal, behavior-preserving REFACTOR:** the auto-compact dispatcher's return value was rewritten from a flat boolean-tagged object `{ wasCompacted, compactionResult, rapidRefillBreakerTripped, … }` into a **discriminated union** `{ kind: "not_needed" | "failure_breaker_open" | "rapid_refill_breaker_tripped" | "compacted" | "hook_blocked" | "failed" }`. This is plumbing, not a feature. It is NOT mentioned in any changelog bullet (silent refactor). It is provably in-window (`wasCompacted` 183=10 → 193=0; `rapid_refill_breaker_tripped` 183=0 → 193=2), but I cannot pin the exact sub-version without intermediate bundles.

**Disambiguation requested by the brief:** the 2.1.186 "MEMORY.md compact reminder" is an **AUTO-MEMORY** feature, **NOT compaction**. There is no `MEMORY.md`×compaction binding string anywhere in the 193 bundle; it belongs to `31_auto_memory`.

**Depth assessment: thin.** `07_compact` is behaviorally unchanged in the window; the one in-window change is a behavior-preserving dispatcher refactor. Document as carryover + a short refactor note.

---

## 1. The ONE real delta — auto-compact dispatcher return-shape refactor (REFINEMENT)

### 1.1 What changed

The auto-compact dispatcher is the async-generator that the `query` loop calls each turn (`yield* p.autocompact(...)`) to decide whether to compact and to drive the compaction. In **183** it was `Ego` (`cli_inner_pretty.js:461531` (183)); in **193** it is `Rxo` (`cli_inner_pretty.js:470250`). Its **return shape** changed:

- **183 `Ego`** returned a flat object whose *truthiness fields* the caller had to test: `{ wasCompacted: bool, compactionResult?, rapidRefillBreakerTripped?, consecutiveFailures?, consecutiveRapidRefills?, thresholdSource?, routedThroughReactive? }`. The caller destructured `{ compactionResult, consecutiveFailures, consecutiveRapidRefills, rapidRefillBreakerTripped, thresholdSource, routedThroughReactive }` and branched on `if (de /*rapidRefillBreakerTripped*/)` then `if (se /*compactionResult*/) … else if (le /*consecutiveFailures*/ !== void 0)`.
- **193 `Rxo`** returns a **single discriminated union** the caller switches on by `kind`: `not_needed`, `failure_breaker_open`, `rapid_refill_breaker_tripped`, `compacted`, `hook_blocked`, `failed`.

```javascript
// ============================================
// autoCompactDispatcher - per-turn compaction decision; now returns a discriminated union
// Location: cli_inner_pretty.js:470250-470348 (193)   |  before: Ego @461531-461654 (183)
// ============================================

// ORIGINAL 183 (Ego, flat boolean-tagged object):
async function Ego(e, t, n, r, o, s, i) {
  if (Ge.DISABLE_COMPACT) return { wasCompacted: !1 };
  if (o?.consecutiveFailures !== void 0 && o.consecutiveFailures >= jgo) return { wasCompacted: !1 };
  /* ... */
  if (d >= cWn) return ( /* log + counter */ { wasCompacted: !1, rapidRefillBreakerTripped: !0 } );
  /* reactive success */ return { wasCompacted: !0, compactionResult: y, consecutiveFailures: 0, consecutiveRapidRefills: d, thresholdSource: p, routedThroughReactive: !0 };
  /* proactive success */ return { wasCompacted: !0, compactionResult: g, consecutiveFailures: 0, consecutiveRapidRefills: d, thresholdSource: p, routedThroughReactive: !1 };
  /* failed */ return { wasCompacted: !1, consecutiveFailures: y };
}

// ORIGINAL 193 (Rxo, discriminated union):
async function* Rxo(e, t, n, r, o, s, i) {
  if (Be.DISABLE_COMPACT) return { kind: "not_needed" };
  if (o?.consecutiveFailures !== void 0 && o.consecutiveFailures >= ISl) return { kind: "failure_breaker_open" };
  if (!(await lcf(e, a, l, r, s))) return { kind: "not_needed" };
  let u = acf(e, a, l, s);                       // prefix-overflow precheck (unchanged)
  if (u) (/* warn + counter */ V("tengu_auto_compact_prefix_overflow", { ...u, wouldHaveBlocked: !0 }));
  let d = VDn(o), { consecutiveRapidRefills: p } = d;
  if (d.action === "trip") return ( /* log + counter */ { kind: "rapid_refill_breaker_tripped" });
  /* reactive success */ return { kind: "compacted", result: _, consecutiveRapidRefills: p, thresholdSource: f, routedThroughReactive: !0 };
  /* reactive hook block */ return { kind: "hook_blocked", thresholdSource: f, routedThroughReactive: !0 };
  /* reactive fail */ return CSl(o, !0, f);
  /* proactive success */ return { kind: "compacted", result: y, consecutiveRapidRefills: p, thresholdSource: f, routedThroughReactive: !1 };
  /* proactive hook block */ return { kind: "hook_blocked", routedThroughReactive: !1 };
  /* proactive fail */ return CSl(o, !1, void 0);
}

// READABLE (193):
async function* autoCompactDispatcher(messages, ctx, cacheSafeParams, querySource, compactState, snipFreedTokens, precomputeHook) {
  if (env.DISABLE_COMPACT) return { kind: "not_needed" };
  if (compactState?.consecutiveFailures >= FAILURE_BREAKER_MAX) return { kind: "failure_breaker_open" };
  if (!(await autocompactNeeded(messages, model, window, querySource, snipFreedTokens))) return { kind: "not_needed" };
  const prefix = prefixOverflowProbe(messages, model, window, snipFreedTokens);
  if (prefix) emit("tengu_auto_compact_prefix_overflow", { ...prefix, wouldHaveBlocked: true });
  const rr = rapidRefillBreaker(compactState);                 // { action, consecutiveRapidRefills }
  if (rr.action === "trip") return { kind: "rapid_refill_breaker_tripped" };
  // ... reactive vs proactive paths, each yielding { kind: "compacted" | "hook_blocked" } or CSl(...) on failure
}

// Mapping: Ego->Rxo->autoCompactDispatcher, wasCompacted-bool-shape -> {kind} discriminated union,
//   jgo->ISl (FAILURE_BREAKER_MAX=3), cWn-count-compare -> VDn(...).action==="trip",
//   Xjp->lcf (autocompactNeeded), Yjp->acf (prefixOverflowProbe), Igo->VDn (rapidRefillBreaker)
```

### 1.2 The caller (`query` loop) was rewritten to match

```javascript
// ============================================
// queryLoop autocompact dispatch - switch on .kind instead of testing booleans
// Location: cli_inner_pretty.js:466397-466458 (193)   |  before: 457762-457821 (183)
// ============================================

// ORIGINAL 183 (destructure flat object, test fields):
let { compactionResult: se, consecutiveFailures: le, consecutiveRapidRefills: pe,
      rapidRefillBreakerTripped: de, thresholdSource: ye, routedThroughReactive: me } = yield* p.autocompact(...);
if (de) { G("tengu_auto_compact_rapid_refill_breaker", {...}); /* invalid_request msg, return */ }
if (se) { G("tengu_auto_compact_succeeded", {... compactedMessageCount: se.summaryMessages.length + se.attachments.length + se.hookResults.length ...}); /* update state */ }
else if (le !== void 0) oe = { ...(oe ?? {...}), consecutiveFailures: le };

// ORIGINAL 193 (single binding, switch on kind):
let ge = yield* p.autocompact(...);
if ((Op("query_autocompact_end"), ge.kind === "rapid_refill_breaker_tripped")) { V("tengu_auto_compact_rapid_refill_breaker", {...}); /* invalid_request msg, return */ }
if (ge.kind === "compacted") {
  let { result: Me, thresholdSource: rt } = ge,
      { preCompactTokenCount, postCompactTokenCount, truePostCompactTokenCount, compactionUsage } = Me;
  V("tengu_auto_compact_succeeded", {... compactedMessageCount: Me.summaryMessages.length + Me.attachments.length + Me.hookResults.length ...});
  le = VZr(p.uuid(), ge.consecutiveRapidRefills); /* update state */
} else if (ge.kind === "failed") le = { ...(le ?? { compacted: !1, turnId: "", turnCounter: 0 }), consecutiveFailures: ge.consecutiveFailures };
let _e = ge.kind === "compacted" || ge.kind === "failed";   // "autocompactRan" — was previously `compactionResult || consecutiveFailures!==undefined`

// Mapping: se->ge.result, de->ge.kind==="rapid_refill_breaker_tripped", le(failures)->ge.consecutiveFailures,
//   "autocompactRan" boolean now derived from kind∈{compacted,failed}
```

### 1.3 Two new helpers + one consolidated emission site

- **`CSl` (193 `cli_inner_pretty.js:470189`) — new "failed" factory.** Increments `consecutiveFailures`, and if it reaches `ISl` (=3) emits `tengu_auto_compact_circuit_breaker`, then returns `{ kind: "failed", consecutiveFailures, routedThroughReactive, thresholdSource }`. In **183** the circuit-breaker emission was **duplicated** at two sites inside `Ego` (reactive-fail @461612, proactive-fail @461651). 193 consolidates both into `CSl`. This is why **`tengu_auto_compact_circuit_breaker` drops from 2 lines (183) to 1 line (193)** — corroborating the refactor with no behavior change (same event, same `consecutiveFailures>=3` condition).
- **`VDn` (193 `cli_inner_pretty.js:235130`) — rapid-refill breaker now returns a struct.** `function VDn(e){ let t=u8d(e); return { action: t>=3?"trip":"proceed", consecutiveRapidRefills: t }; }`. In **183** the analog `Igo` returned the bare count and the dispatcher tested `if (d >= cWn)`. Same threshold (3), structured result.
- **Thrash message constant-folded.** 183 `wgo` (`461687` (183)) was a *template literal* `…within ${Ggo} turns…${cWn} times in a row…` (`Ggo=3`, `cWn=3`); 193 `qZr` (`235139`) is the *static string* `…within 3 turns…3 times in a row…`. **Rendered text is identical** — `Ggo`/`cWn` were both 3, so this is pure constant-folding from the refactor, not a wording change.

### 1.4 Evidence table (the refactor is in-window)

| Signal | 193 | 183 | Verdict |
|---|---|---|---|
| `wasCompacted` (string, lines) | **0** | **10** | flat shape removed in-window |
| `rapid_refill_breaker_tripped` (string) | **2** | **0** | union tag net-new in-window |
| `tengu_auto_compact_circuit_breaker` | 1 | 2 | two emit sites consolidated into `CSl` |
| `compactedMessageCount` | 1 | 1 | telemetry carryover (unchanged) |
| `tengu_auto_compact_succeeded` | 1 | 1 | telemetry carryover |
| thrash message exact text | static "3 / 3" | template `${Ggo}/${cWn}` | constant-folded, identical render |

**Classification: REFINEMENT (behavior-preserving internal refactor). Confidence: HIGH that it is in-window and behavior-preserving; LOW on which exact sub-version (no intermediate bundles).**

---

## 2. Carryover — everything the brief asked me to grep is unchanged

All of the following matched on stable strings with **identical** before/after counts (or counts whose deltas are fully explained by §1's refactor), and were spot-read where load-bearing. **None is a 2.1.193 delta** — each landed at or before 2.1.183 and survives byte-for-byte (obf names re-mangled only).

| Lane (183 delta origin) | 193 anchor + obf → readable | 183 anchor | Diff evidence | Verdict |
|---|---|---|---|---|
| **`--fallback-model` honoring in summarize** (2.1.178) | `wSl` (streamCompactSummary) @469797; fallback loop @469966-469994; `query_source:"compact"` @469978; `nN`=ModelFallbackError, `Dat`=needsRequestDialog, `Wge`=resolveConsentedModel, `cCe`=isSmallerWindow, `w5`=UserFacingError | `del` @461088 (183) | `tengu_model_fallback_triggered` 3=3; "only allows Fable 5" 2=2; "is currently unavailable." 3=3 | **Carryover** |
| **1M-credits-without-credits clamp** (2.1.172) | flag `Nt.longContext1mCreditsBlocked` get `wYe`@2876 / set `Lpr`@2878; matcher `Heo`@237959 ("Extra usage is required for long context"); `SQi`@237965 | `Fwn` (183) | `longContext1mCreditsBlocked` 3=3; "Extra usage…" 1=1; "Usage credits…" 1=1 | **Carryover** |
| **Window resolver — 6 sources** (env/settings/clientdata/model-default/experiment/auto) | `clientdata` source @235026; `model-default` @235030/235032; source-set guard @235037 | resolver (183) | `clientdata` 8=8; precedence guard identical | **Carryover** |
| **Micro-compaction `context_hint` beta** | `pOr = pE("context_hint","context-hint-2026-04-09")` @102179 | (183 `k76`) | beta string `context-hint-2026-04-09` 1=1 (no version bump) | **Carryover** |
| **Prefix-overflow pre-check** | `acf`@470203; `tengu_auto_compact_prefix_overflow` @470262; `compact_auto_prefix_overflow` counter | `Yjp` (183) | `tengu_auto_compact_prefix_overflow` 1=1; `compact_auto_prefix_overflow` 1=1 | **Carryover** (now lives in `Rxo`) |
| **Auto-compact thresholds** | failure breaker `ISl=3` @470357; rapid-refill window `VXi=3` @235137; trip at count≥3 (`VDn`) | `jgo`/`Ggo`/`cWn` all 3 (183) | identical numeric constants | **Carryover** |
| **`tengu_compact*` telemetry surface** | feature_gates.json: 38 compaction events | — | asset diff: **0** net-new, **0** removed | **Carryover** |
| **`/compact` + auto-compact env/flags** | `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`, `CLAUDE_AFTER_LAST_COMPACT`, `CLAUDE_CODE_COLD_COMPACT`, `CLAUDE_CODE_DISABLE_PRECOMPACT_SKIP`, `DISABLE_AUTO_COMPACT` | — | env_vars.json + cli_flags.json asset diff: **0** net-new, **0** removed | **Carryover** |
| **Compaction summary prompt** ("Your task is to create a detailed summary…", 8-section template) | 3 detailed-summary prompt assets | 3 assets | **md5 sets IDENTICAL** between 183 and 193 | **Carryover** |
| **Reactive / partial / `/rewind` / dispatcher breakers** | `tengu_reactive_compact_*`, `tengu_partial_compact*`, `tengu_precomputed_compact_*`, OTEL span `claude_code.compaction` @ (1=1) | — | all counts identical | **Carryover** |

### 2.1 Spot-read proof that `--fallback-model` honoring is unchanged

193 `wSl` (`469966-469994`) is the **same** model-fallback chain loop documented as 183 DELTA 1, only re-mangled: catch a `nN` (ModelFallbackError) with a remaining chain link, emit `tengu_model_fallback_triggered { …, query_source: Ve("compact"), … }` (`469978`), flip `stream_mode:"requesting"`, `_++`, `continue`; on `reason==="model_blocked"` throw `w5("… is currently unavailable.")`; otherwise re-throw. The request-dialog consent substitution (`Dat`/`Wge`/`cCe`) at `469968-469970` is identical to 183's `fnt`/`_Q`/`XHe`. No structural change.

---

## 3. Disambiguation — the 2.1.186 "MEMORY.md compact reminder" is AUTO-MEMORY, not compaction

The brief flagged this. **Verdict: it belongs to `31_auto_memory`, not `07_compact`.**

- There is **no `MEMORY.md`×compaction co-mention string** in the 193 bundle: every adversarial pattern returned 0 — `grep -niE "compact[^a-z]{0,40}(memory|persist|survive|forget)"` = 0; `"MEMORY.md" & "compact"` on the same line = 0; "persists across compact" = 0; "write to memory before" = 0.
- `MEMORY.md` literal: 10=10 (193=183, carryover). `autoMemory`: 18 (193) vs 20 (183) — a small auto-memory-side change, **not** in the compaction subsystem.
- The memory-guidance prompt block (e.g. `cli_inner_pretty.js:152131` "…a very important type of memory to read and write…") is the **auto-memory** reminder subsystem; it does not reference the compaction pipeline.

Conclusion: do not document this under compaction. It is an auto-memory reminder (extend `31_auto_memory` if anything).

---

## 4. Why no compaction work this window (interpretation)

The 2.1.157→2.1.183 stretch had four real compaction deltas (fallback chain, 1M clamp, 6-source resolver, precompute/prefix-overflow). The 2.1.185→2.1.193 window's engineering attention is plainly elsewhere — auto-mode/permissions (2.1.193), background-agents/subagent-depth (2.1.186/187), MCP reliability (2.1.191), OTEL (2.1.193). The compaction subsystem received only the incidental discriminated-union cleanup, likely riding along with a broader `query`-loop tidy. Nothing here changes a default or upgrade behavior. **No upgrade-behavior gotcha exists in compaction this window.**

---

## 5. Proposed module docs

Given depth = thin, the lightest correct option:

1. **`07_compact/README.md` (thin DELTA note, RECOMMENDED).** One short doc: "07_compact is behaviorally unchanged 2.1.183→2.1.193; documented as carryover." Contents: (a) the §1 dispatcher discriminated-union refactor as the only in-window change (REFINEMENT), with the `wasCompacted`→`{kind}` before/after and the `CSl`/`VDn` helpers; (b) a carryover table pointing each lane back to `claude_code_v_2.1.183/analyze/07_compact/` (which remains canonical); (c) the 2.1.186 MEMORY.md-reminder disambiguation cross-link to `31_auto_memory`.
2. **Alternatively fold into `00_overview/`** a single "Compaction: carryover this window + dispatcher refactor" paragraph if a full `07_compact/` dir is judged overkill.
3. **Symbol additions** (route to `symbol_index_core_features.md`, Compact module): `Rxo` autoCompactDispatcher @470250, `CSl` compactFailedResult @470189, `VDn` rapidRefillBreaker @235130, `lcf` autocompactNeeded @470238, `acf` prefixOverflowProbe @470203, `ccf` autoWindowSpinnerHint @470349, `wSl` streamCompactSummary @469797, `ISl` FAILURE_BREAKER_MAX(=3) @470357, `VXi` RAPID_REFILL_WINDOW(=3) @235137, `qZr` thrashMessage @235139, `wYe`/`Lpr` get/set longContext1mCreditsBlocked @2876/2878, `Heo` is1mCreditsError @237959.

---

## 6. Depth assessment

**thin.** No new compaction behavior in the window. One behavior-preserving dispatcher refactor (`{wasCompacted}` → `{kind}` discriminated union, + `CSl`/`VDn` helpers, + circuit-breaker emission consolidated 2→1, + thrash-message constant-folded). Everything else — fallback chain, 1M clamp, 6-source resolver, micro-compact beta, thresholds, prefix-overflow, telemetry, summary prompt — is carryover, proven by identical grep-counts, identical asset diffs, and md5-identical prompts. `07_compact` is unchanged in the window and should be documented as carryover.
