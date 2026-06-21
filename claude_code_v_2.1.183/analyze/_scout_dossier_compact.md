# Scout Dossier — COMPACT (compaction strategies + threshold ladder) — v2.1.156 → v2.1.183

> Target bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
> Prior bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
> Baseline docs being diffed: `claude_code_v_2.1.156/analyze/07_compact/`
> All obfuscated names RE-DERIVED in v2.1.183 by reading each declaration. NONE carried over from v2.1.156 by assumption.

---

## 0. Executive summary

The compaction subsystem is **structurally the same five-strategy / threshold-ladder design as v2.1.156**, but four real deltas land between 2.1.157 and 2.1.183:

1. **`--fallback-model` honoring in the compaction summarize call (2.1.178, HEADLINE).** The summarize function (v2.1.156 `_X4`/`streamCompactSummary` → v2.1.183 `del` @461088) was a single-pass stream with `model: mainLoopModel` hardcoded and `throw Error(NH$)` on failure. v2.1.183 wraps it in a `while(!0)` **fallback-model chain loop** (`y = [model, ...ICn(model, options.fallbackModel)]`), passes `fallbackModel: y[_+1]` into the request, catches the model-fallback error class `vF`, advances `_++`, and emits `tengu_model_fallback_triggered{query_source:"compact"}`. The cache-prefix fork (`Xk` @461118) is also now fallback-aware.
2. **1M-context-without-credits auto-compact-back (2.1.172).** New session flag `longContext1mCreditsBlocked` (setter `Wtr` @2968 / getter `N8e` @2965), tripped on a 429 "Usage/Extra credits required for long context" via `Fwn` @229606, emitting new event `tengu_1m_credits_clamp_activated` @229192. The window hard-cap `tH` (was `Ov`/`getContextWindowForModel`) @134105 now clamps to `jQ`=200000 when `ARr` @134118 is true (`N8e() && no MAX_CONTEXT_TOKENS && rawWindow > 200k`), forcing a stuck 1M session back under the standard limit.
3. **Window resolver grew from 4 sources to 6.** v2.1.156 `Xl` had `env > settings > experiment > auto`. v2.1.183 `z2` @226875 inserts two NEW sources: **`clientdata`** (via `ywd` @226865 reading `rowan_thicket` clientdata) and **`model-default`** (the 1M→200k clamp via `ARr`, for `claude-sonnet-4-6`/`claude-opus-4-6`). Precedence: `env > settings > clientdata > experiment > model-default > auto`.
4. **New precompute "arm table" + remote-reactive gate + prefix-overflow pre-check.** New `tengu_amber_moleskin` arm table (`bqr` @226920, per-window-size fractions with sdk/repl variants), new `tengu_reactive_compact_remote` gate inside the renamed `isLocal`→`S7` @226751, and a new dispatcher pre-check `Yjp` @461484 emitting `tengu_auto_compact_prefix_overflow` when the fixed cache prefix already exceeds the threshold.

The micro-compact `context_hint` beta string is **UNCHANGED** (`context-hint-2026-04-09` in both builds — no beta version bump). The five strategies (full, reactive, micro/context-hint, partial/rewind, the removed session-memory) all still exist with the same shape; the partial compactor is just renamed `qX4`→`cel`. Line numbers shifted massively: the whole threshold ladder moved from ~423864-424154 (v2.1.156) to ~226818-226983 (v2.1.183), and the dispatcher/pipeline from ~423130-424018 to ~460676-461662.

---

## 1. Verified anchor table

Every line below was read in v2.1.183 `cli_inner_pretty.js` and the obfuscated name confirmed at that declaration.

| Readable name | v2.1.183 obf | v2.1.183 line | v2.1.156 obf | one-line evidence |
|---|---|---|---|---|
| getAutoCompactThreshold | `gwn` | 226818 | `Jv$` | `let n = e - 13000; … return Math.min(Math.floor(e*(r/100)), n)` |
| precomputeThreshold | `mqr` | 226824 | `YX4` | `Math.min(e - Math.round(e*t.precomputeBufferFraction), gwn(e,t))` |
| calculateTokenWarningState | `nBi` | 226827 | `fX4` | returns `{level:"blocked"/"compact"/"warn"/"ok", pctLeft}` |
| parseWindowString | `yqr` | 226843 | `Ac6` | `"auto"`/`…m`/`…k`/`[100,1000]`-thousands, clamp `[hwn,hqr]` |
| opus48ExperimentWindow | `_qr` | 226856 | `wX4` | `if (e!=="claude-opus-4-8") return; ct("tengu_amber_redwood2","")` |
| clientDataWindow (NEW) | `ywd` | 226865 | — (none) | reads `hti()?.rowan_thicket[e]` then `yti()?.[e]`, clamp `[hwn,hqr]` |
| getAutoCompactWindow (6-source) | `z2` | 226875 | `Xl` | returns `{window,configured,source}` source ∈ env/settings/clientdata/experiment/model-default/auto |
| isConfiguredWindow | `qCe` | 226895 | `EH$` | `n==="env"||"settings"||"clientdata"||"model-default"` |
| getAutoCompactWindowSource | `ywn` | 226899 | `ab_` | `return z2(e,t).source` |
| getEffectiveContextWindowSize | `oee` | 226902 | `_qH` | `min(XAe(e), sBi=20000); { window:o } = z2(...); return o - n` |
| getEffectiveContextWindowSizeRaw | `_wd` | 226908 | `sb_` | `tH(e, Wb()) - min(XAe(e), 20000)` (raw cap) |
| isRedwood3Reactive | `uG` | 226742 | `Pc` | `if (xr()) return !1; return !!ct("tengu_amber_redwood3","")` |
| isAutoCompactEnabled | `Kw` | 226746 | `J0` | `DISABLE_COMPACT`/`DISABLE_AUTO_COMPACT`/`autoCompactEnabled` |
| isLocal / reactive-remote gate | `S7` | 226751 | `_JH` | now: `CLAUDE_CODE_REMOTE` → only allowed if `tengu_reactive_compact_remote` |
| getPrecomputeBufferFraction (scalar) | `gqr` | 226916 | `tb_` | `ct("tengu_amber_rokovoko", fqr=0.2)`, validate `[0,1)` |
| getPrecomputeArm (NEW table) | `bqr` | 226920 | — (none) | `ct(bwd="tengu_amber_moleskin", null)` → per-windowSize {repl,sdk} |
| getPrecomputeBufferFraction (resolved) | `Ewd` | 226935 | — (extends `tb_`) | `return bqr(e,t,n).fraction` |
| getThresholdOverrides | `Sqr` | 226938 | `jc6` | reads `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` + `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` |
| getAutoCompactThresholdForModel | `lMt` | 226948 | `DU6` | `gwn(oee(e,t), Sqr(e,t))` |
| calculateTokenWarningStatePublic | `VCe` | 226951 | `WRH` | `nBi(e, oee(t,o), r, _wd(t))` blocking base = raw |
| isAbovePrecomputeOrCompact | `iBi` | 226956 | `tv7` | `if (!uG() && !qCe(...)) return e >= mqr(...)` |
| validateEnvInt | `yae` | 226769 | `n$H` | `{effective, status:"valid"/"invalid"/"capped"}` |
| getContextWindowForModel (hard cap, +1M clamp) | `tH` | 134105 | `Ov` | `if (ARr(e,t)) return jQ` ← NEW clamp branch @134108 |
| getMaxContextTokensOverride | `Ati` | 134111 | inline in `Ov` | `DISABLE_COMPACT && CLAUDE_CODE_MAX_CONTEXT_TOKENS` |
| is1mClampActive (NEW) | `ARr` | 134118 | — (none) | `N8e() && Ati()===void 0 && gti(e,t) > jQ` |
| rawModelWindow | `gti` | 134121 | inner of `Ov` | `1e6` for `[1m]`/header/family else `mxt` |
| STANDARD_WINDOW (200k) | `jQ` | 134192 | `P36` | `jQ = 200000` |
| get1mCreditsBlocked (NEW) | `N8e` | 2965 | — (none) | `return Ot.longContext1mCreditsBlocked` |
| set1mCreditsBlocked (NEW) | `Wtr` | 2968 | — (none) | `Ot.longContext1mCreditsBlocked = e` |
| is1mCreditsError (NEW) | `Fwn` | 229606 | — (none) | `"Extra usage is required for long context"` / `"Usage credits are required for long context"` |
| shouldAutoCompact (loop predicate) | `Xjp` | 461519 | `eb_` | `if (S7() && !uG() && !qCe(t,n)) return !1` |
| autoCompactIfNeeded (dispatcher) | `Ego` | 461531 | `DX4` | `async function* Ego(...)` async generator |
| computeRapidRefillStreak | `Igo` | 461481 | `fc6` | `e?.compacted===!0 && e.turnCounter < Ggo ? +1 : 0` |
| prefixOverflowCheck (NEW) | `Yjp` | 461484 | — (none) | emits `tengu_auto_compact_prefix_overflow` |
| autoWindowSpinnerHint | `Jjp` | 461655 | `Hx_` | now matches `r!=="experiment" && r!=="clientdata"` |
| isColdCompact | `Wgo` | 461516 | `Mc6` | `return st(process.env.CLAUDE_CODE_COLD_COMPACT)` |
| compactConversation (full pipeline) | `zut` | 460676 | `_eH` | `D$t("claude_code.compaction", {spanType:"compaction"…})` |
| streamCompactSummary (+fallback loop) | `del` | 461088 | `_X4` | `while(!0){ … fallbackModel:y[_+1] … }` |
| fallbackChainBuilder | `ICn` | 461078 | — (n/a in compact) | `(Array.isArray(t)?t:…).filter(r=>!XHe(e,r))` |
| partialCompact (/rewind) | `cel` | 460886 | `qX4` | `async function cel(e,t,n,r,o, s="from", i,a)` |
| OTEL span helper | `D$t` | 460682 (call) | `xP$` | `D$t("claude_code.compaction", {spanType:"compaction"})` |
| MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES | `jgo` | 461663 | `_c6` | `jgo = 3` |
| RAPID_REFILL_TURN_WINDOW | `Ggo` | 461664 | `Yc6` | `Ggo = 3` |
| RAPID_REFILL_BREAKER_COUNT | `cWn` | 461665 | `Y08` | `cWn = 3` |
| AUTOCOMPACT_BUFFER_TOKENS | `QNi` | 226839 | `zX4` | `QNi = 13000` |
| MANUAL_COMPACT_BUFFER_TOKENS | `ZNi` | 226840 | `AX4` | `ZNi = 3000` |
| DEFAULT_PRECOMPUTE_BUFFER_FRACTION | `fqr` | 226841 | `qc6` | `fqr = 0.2` |
| MAX_OUTPUT_TOKENS_FOR_SUMMARY (reserve) | `sBi` | 226965 | `MX4` | `sBi = 20000` |
| WINDOW_MIN (100k) | `hwn` | 226966 | `zc6` | `hwn = 1e5` |
| WINDOW_MAX (1M) | `hqr` | 226967 | `jX4` | `hqr = 1e6` |
| AUTO_WINDOW_TABLE (empty) | `rBi` | 226968 / init @226982 | `ob_` | `rBi = {}` (still inert pass-through) |
| MODEL_DEFAULT_CLAMP_SET (NEW) | `hwd` | 226969 / init @226982 | — (none) | `new Set(["claude-sonnet-4-6","claude-opus-4-6"])` |
| PRECOMPUTE_ARM_FLAG (NEW) | `bwd` | 226970 | — (none) | `"tengu_amber_moleskin"` |
| RECOVERY_TIMEOUT_MS (NEW) | `vqr` | 227081 | — (none) | `vqr = 600000` (reactive recovery-timeout) |

---

## 2. Confirmed deltas

### DELTA 1 (HEADLINE, 2.1.178) — Compaction summarize call now honors the `--fallback-model` chain

**v2.1.183 evidence** — `del` @461088, fallback chain at 461189-461285:
```js
let h = ICn(A, r.options.fallbackModel),        // 461189  build chain from --fallback-model / settings.fallbackModel
    y = [A, ...h.filter((b) => b !== A)],        // 461190  [primary, ...fallbacks]
    _ = 0;
while (!0) {                                     // 461192  NEW outer loop
  let b = y[_], …
  let x = sdt({ …
      options: { …
        model: b,                                // 461208
        fallbackModel: y[_ + 1],                 // 461209  next link threaded into request
      …}})[Symbol.asyncIterator]();
  …
  } catch (C) {
    let x = y[_ + 1];                            // 461259
    …
    if (C instanceof vF && x !== void 0) {       // 461264  vF = model-fallback error class
      G("tengu_model_fallback_triggered", {      // 461266
        original_model: …, fallback_model: x_(x), chain_index: _ + 1,
        query_source: Qe("compact"), reason: Ne(C.reason), entrypoint: Qe("cli"), … });
      … _++; continue; }                          // 461280-461281  advance & retry
    if (C instanceof vF && C.reason === "model_blocked")
      throw new FW(`${Jd(C.originalModel)} is currently unavailable.`);  // 461283-461284
    throw C; } } }
```
The cache-prefix fork is also fallback-aware now (461118): `fallbackModel: ICn(r.options.mainLoopModel, r.options.fallbackModel)`.

`ICn` @461078: `(Array.isArray(t) ? t : t !== void 0 ? [t] : []).filter(r => !XHe(e, r))` — normalizes `fallbackModel` (string|array) into a deduped chain. The CLI flag feeds it via `e.cli.fallbackModel?.split(",") ?? settings.fallbackModel` (@149266), confirming the 2.1.166 `fallbackModel` setting (up-to-three) and `--fallback-model` precedence.

**v2.1.156 / before-picture** — `_X4` @423527 (`streamCompactSummary`). Read 423618-423682:
- Single streaming call with `model: K.options.mainLoopModel` hardcoded (423641), NO `fallbackModel` in `options`.
- The ONLY loop is the inner stream pump `while (!W.done)` (423651).
- On streaming failure: `throw Error(NH$)` directly (423682) — no retry, no model chain.
- Grep proof: `grep -F "fallbackModel"` over 423527-423660 returns **0**; `tengu_model_fallback_triggered` exists in v2.1.156 (@143197, @451640) but NOT inside `_X4`. The compaction path did not participate in fallback.

**Confidence: high.** This is the must-have delta and is unambiguous in source.

---

### DELTA 2 (2.1.172) — 1M-context-without-credits auto-compact-back under the standard limit

**v2.1.183 evidence (trip):** `$Cd` error mapper @229183-229208 (the 429 branch):
```js
if (s && Fwn(e.message) && !N8e()) (Wtr(!0), G("tengu_1m_credits_clamp_activated", {}));   // 229192
…
if (s && Fwn(e.message)) {                                                                   // 229199
  let f = xr() ? "turn on usage credits …, or use --model to switch to standard context"
              : "run /usage-credits …, or /model to switch to standard context";            // 229200-229202
  return tc({ content: `${oE}: Usage credits required for 1M context · ${f}`, error: "rate_limit", … }); }
```
- `Fwn` @229606: `e.includes("Extra usage is required for long context") || e.includes("Usage credits are required for long context")`.
- `Wtr` @2968 sets `Ot.longContext1mCreditsBlocked = true`; `N8e` @2965 reads it (init `false` @2624).

**v2.1.183 evidence (clamp consumer):** the model hard-cap `tH` @134105:
```js
function tH(e, t) {
  let n = Ati();                 // CLAUDE_CODE_MAX_CONTEXT_TOKENS (only when DISABLE_COMPACT)
  if (n !== void 0) return n;
  if (ARr(e, t)) return jQ;      // 134108  NEW: clamp 1M model down to 200k standard
  return gti(e, t);              // raw model window (1e6 for 1M models)
}
function ARr(e, t) {             // 134118  NEW
  return N8e() && Ati() === void 0 && gti(e, t) > jQ;   // jQ = 200000
}
```
`ARr` is consumed in two places: (a) `tH` @134108 forces the hard cap to 200k, which then flows through `z2`/`oee`/threshold ladder so the session compacts back under standard; (b) the window resolver `z2` @226891 returns `source:"model-default"` with `configured: jQ` when it fires. So a session stuck on 1M without credits is automatically re-windowed to 200k and compacted under it.

**v2.1.156 / before-picture:**
- `grep -c longContext1mCreditsBlocked` and `grep -c tengu_1m_credits_clamp_activated` over the v2.1.156 bundle both return **0** — the entire mechanism is new.
- v2.1.156 `Ov` @130165-130176 (the hard-cap, ancestor of `tH`) has NO `ARr` branch: it goes straight `MAX_CONTEXT_TOKENS → DZ([1m]) → header+pB → Se → OH8 → P36`. A stuck 1M session would keep resolving to `1e6` forever (the "permanently stuck" bug the changelog describes).

**Confidence: high.**

---

### DELTA 3 — Window resolver `Xl`→`z2` grew from 4 sources to 6 (clientdata, model-default)

**v2.1.183 evidence** — `z2` @226875-226894:
```js
if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) { … source: "env" }                        // 226879-226885
if (t !== void 0) return { …, source: "settings" };                                          // 226886
let s = ywd(n);                                                                              // 226887  NEW
if (s !== null) return { window: Math.min(o, s), configured: s, source: "clientdata" };       // 226888
let i = _qr(n);
if (i !== void 0) return { …, source: "experiment" };                                        // 226889-226890
if (o < 1e6 && (hwd.has(n) || ARr(e, r)))                                                     // 226891  NEW
  return { window: Math.min(o, jQ), configured: jQ, source: "model-default" };
let l = (Kw() && Object.hasOwn(rBi, n) ? rBi[n] : void 0) ?? o;
return { …, source: "auto" };                                                                // 226892-226893
```
- `ywd` @226865: clientdata window — reads `hti()?.rowan_thicket[modelKey]` (clientDataCache) then `yti()?.[modelKey]` (autoCompactWindowsCache), validated integer in `[hwn,hqr]`.
- `model-default`: clamps `claude-sonnet-4-6`/`claude-opus-4-6` (the `hwd` Set @226982) — and any `ARr`-clamped 1M model — down to `jQ`=200000.
- The UI string @478044 now branches on `o === "clientdata"` alongside experiment/env/settings/auto, and `qCe`/`isConfiguredWindow` @226895 now treats `clientdata` and `model-default` as "configured".

**v2.1.156 / before-picture** — `Xl` @423915 had exactly four returns: `env`, `settings`, `experiment`, `auto`. Grep over the v2.1.156 bundle: `source: "clientdata"` → **0**, `source: "model-default"` → **0**, `rowan_thicket` → **0**.

**Confidence: high.**

---

### DELTA 4 — New precompute "arm table", remote-reactive gate, and dispatcher prefix-overflow pre-check

**4a. Precompute arm table (`tengu_amber_moleskin`).** v2.1.156 had only the scalar `tengu_amber_rokovoko` fraction (`tb_`). v2.1.183 keeps that scalar (`gqr` @226916) but adds a richer table resolver:
```js
function bqr(e, t, n) {                                          // 226920
  let r = ct(bwd, null);                                         // bwd = "tengu_amber_moleskin"
  if (r === null) return { fraction: gqr(), source: "scalar" };
  let o = eBi(r);                                                // parse {windowSize:{repl,sdk}, default:{…}}
  if (o === null) return (Swd(…), { fraction: gqr(), source: "malformed" });   // tengu_precompute_arm_table_malformed
  …
  let c = a.entry[n === "sdk" ? "sdk" : "repl"];                 // per-surface fraction
  return a.kind === "exact" ? { fraction: c, source: "table_exact", matchedWindowKey: … }
                            : { fraction: c, source: "table_default" }; }
```
Supporting: `JNi`/`gwd`/`eBi`/`tBi` (226785-226816) parse the table; `Swd` @226912 fires `tengu_precompute_arm_table_malformed`. New precompute telemetry events confirm this: `tengu_precomputed_compact_arm_gated` @452899, `tengu_precomputed_compact_rearm_capped` @452973, `tengu_precompute_arm_table_malformed` @226914 — all **0** in v2.1.156 (v2.1.156 precompute events were only `_started`/`_failed`/`_ready`/`_consumed`/`_discarded`/`borrow_boundary_miss`).

**4b. Remote-reactive gate.** `S7` @226751 (the renamed `isLocal`):
```js
function S7() {
  if (st(process.env.CLAUDE_CODE_REMOTE)) {
    if (((YNi ??= ct("tengu_reactive_compact_remote", !1)), !YNi)) return !1;   // 226753 NEW flag
  }
  return !0; }
```
v2.1.156 `_JH` @423988 was a bare `return !isEnvTruthy(process.env.CLAUDE_CODE_REMOTE)`. Now remote sessions CAN run reactive/proactive compaction if `tengu_reactive_compact_remote` is on. Grep `tengu_reactive_compact_remote` in v2.1.156 → **0**.

**4c. Dispatcher prefix-overflow pre-check.** In `Ego` @461537-461543:
```js
let u = Yjp(e, a, l, s);                                          // 461537  NEW
if (u) (… Rt("compact_auto","compact_auto_prefix_overflow"),
        G("tengu_auto_compact_prefix_overflow", { ...u, wouldHaveBlocked: !0 }));  // 461542-461543
```
`Yjp` @461484 computes the fixed (cache-prefix) token weight vs `lMt` threshold and reports when compaction physically cannot help. Grep `tengu_auto_compact_prefix_overflow` in v2.1.156 → **0**.

**Confidence: high** for all three sub-items (each backed by a 0-count grep in v2.1.156 + a read declaration in v2.1.183).

---

### DELTA 5 — Renames of stable structures (no behavior change, but the writer must re-map)

These are pure re-minification renames; logic byte-identical to v2.1.156 (verified by reading both). Listed so the writer does NOT mistake them for new code:

- Threshold ladder: `Jv$→gwn`, `YX4→mqr`, `fX4→nBi`, `Ac6→yqr`, `wX4→_qr`, `Xl→z2`, `_qH→oee`, `sb_→_wd`, `EH$→qCe`, `ab_→ywn`, `Pc→uG`, `J0→Kw`, `jc6→Sqr`, `DU6→lMt`, `WRH→VCe`, `tv7→iBi`, `n$H→yae`.
- Dispatcher/breakers: `eb_→Xjp`, `DX4→Ego`, `fc6→Igo`, `Mc6→Wgo`, `Hx_→Jjp`; constants `_c6→jgo`, `Yc6→Ggo`, `Y08→cWn`, `zX4→QNi`, `AX4→ZNi`, `qc6→fqr`, `MX4→sBi`, `zc6→hwn`, `jX4→hqr`, `ob_→rBi`, `P36→jQ`.
- Pipeline/summarize/partial: `_eH→zut`, `_X4→del`, `qX4→cel` (still `s="from"` default direction @460886), `Ov→tH`, OTEL helper `xP$→D$t`.
- The full-pipeline `zut` retains the same 16-phase shape: OTEL span @460682, HEAD-truncation PTL retry loop @460707-460743 (`tengu_compact_ptl_retry` @460736), summary extraction, `tengu_compact` event @460793. The breaker thrash message `wgo` @461687 is the same `_c6`/`Yc6`/`Y08` (now `jgo`/`Ggo`/`cWn` = 3/3/3) text.

**Confidence: high.**

---

## 3. Unchanged carryover (writer: LINK to 2.1.156, do NOT re-document)

These were checked and are materially identical (modulo rename) to v2.1.156; reference the existing 07_compact docs:

- **Threshold formulas & buffer ladder.** `gwn` = `eff - 13000` with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` floor; `mqr` = `min(eff - round(eff*frac), threshold)`; `nBi` returns `{level: ok|warn|compact|blocked, pctLeft}` with warn = threshold-20000, blocked = blockingBase-3000. Constants 13000/3000/0.2/20000/100k/1M all unchanged. → `threshold_and_window_resolution.md`.
- **`parseWindowString`** `[100,1000]`-as-thousands shorthand + `[1e5,1e6]` clamp — byte-identical (`yqr` @226843). → same doc.
- **Dispatcher gate cascade & async-generator shape.** `Ego` is still `async function*`, still `DISABLE_COMPACT → consecutiveFailures>=3 → Xjp predicate → breakers → thresholdSource routing → full/reactive`. Both circuit breakers (consecutive-failure + rapid-refill, both =3) unchanged in value/intent. → `autocompact_dispatcher_and_breakers.md`.
- **Reactive lane** (group-walk, `initialTokenGap` seeding, PTL extraction, `tengu_reactive_compact_attempt` @233113, precompute swap/borrow) — structurally unchanged except the new arm table feeding the fraction. → `reactive_compaction.md`.
- **Micro-compaction / context-hint.** Beta string `context-hint-2026-04-09` UNCHANGED (@101582 vs v2.1.156 @98137). `tengu_hazel_osprey`/`_floor` master flags present (@581750/581753), `tengu_context_hint_reject` @581777, `<persisted-output>` disk-persist pointer (@275271 `zIe`), 20000 floor — all carried. → `micro_compact.md`. (Note: `tengu_velvet_ibis` appears @275271 but ALSO exists in v2.1.156 (@? mcp_tool config) — pre-existing, not a compact delta.)
- **Session-memory removal** stays removed (still 0 reconstructable matches). → `session_memory_and_partial_compact.md`.
- **Partial `/rewind` compactor** logic — `cel` is `qX4` renamed, same `up_to`/`from` discriminator, shared PTL slicer, directional anchor, `tengu_partial_compact`/`_failed` (@460991/460946). → `session_memory_and_partial_compact.md`.
- **Summary meta-prompt templates** (security-preservation clause, REPL-state-cleared trailer, no-tools sandwich, `maxTurns:1`) — not re-derived in depth here; assume carried unless the writer finds a string diff. → `summary_prompt_templates.md`.
- **PostCompact tail & prompt-cache break** (`claude_code.compaction` OTEL still 1 site @460682; PostCompact hook; cache-break baseline reset) — carried. → `postcompact_and_prompt_cache.md`.

---

## 4. Open questions / low-confidence items

1. **`clientdata` window source semantics.** `ywd` reads `rowan_thicket` from clientDataCache and `autoCompactWindowsCache`. The exact server-push mechanism that populates these caches (and whether `rowan_thicket` is a feature-gate key vs a clientdata blob field) was not traced end-to-end. MEDIUM confidence on classification as a window source; HIGH on its existence/placement in `z2`.
2. **Precompute arm-table consumption.** Confirmed the table parser (`bqr`/`eBi`) and the new gated telemetry, but did not fully trace how `tengu_precomputed_compact_arm_gated` / `_rearm_capped` change the reactive precompute swap timing vs v2.1.156. Worth a focused read of `452899-452990` during the writing phase.
3. **`tengu_compact_streaming_retry` resurrection?** v2.1.156 README claimed streaming retry was removed from the full path. v2.1.183 `del` now has the `while(!0)` loop — but it is a MODEL-fallback loop, not a same-model streaming retry. I did not find a `tengu_compact_streaming_retry` event in `del`; confirm there is still no same-model sleep+retry. LOW risk of mischaracterization.
4. **Did `nBi`/threshold math change at all?** Read confirms formulas identical, but I did not exhaustively diff the `iBi` (isAbovePrecompute) `l < jQ` guard @226962 — it references `jQ`=200k which ties into the 1M-clamp. Likely just the standard-window guard; verify during writing.
5. **2.1.166 `fallbackModel` up-to-three enforcement.** The schema @55907 is `H.array(H.string())` (no explicit max-3 in the parser I read); the "up to three" may be UI/doc-level only. Did not locate a hard length cap.

---

## 5. Proposed docs (writing phase)

Target dir: `claude_code_v_2.1.183/analyze/07_compact/` (delta module; link unchanged parts to the v2.1.156 docs).

| Filename | Purpose |
|---|---|
| `README.md` | Delta overview: the 4 real deltas (fallback-model in summarize, 1M-credits clamp-back, 6-source resolver, arm-table/remote-reactive/prefix-overflow), the v2.1.156→183 rename map, and a "what's unchanged, see 2.1.156" pointer table. |
| `fallback_model_in_compaction.md` | DEEP-DIVE on DELTA 1: `del`'s fallback chain loop, `ICn` chain builder, `vF` error handling, `tengu_model_fallback_triggered{query_source:"compact"}`, cache-prefix-fork fallback, vs v2.1.156 single-pass `_X4`. With dual-version snippets. |
| `one_million_credits_clamp.md` | DEEP-DIVE on DELTA 2: `Fwn`/`Wtr`/`N8e` flag, `tengu_1m_credits_clamp_activated`, `ARr` clamp + `tH` 200k cap branch + `z2` `model-default` source; the "permanently stuck" before-state in v2.1.156 `Ov`. |
| `window_resolver_six_sources.md` | DELTA 3 + 4a: the new `clientdata` (`ywd`/`rowan_thicket`) and `model-default` sources in `z2`, the `tengu_amber_moleskin` precompute arm table (`bqr`/`eBi`), updated `qCe`/UI strings. Link unchanged ladder math to 2.1.156. |
| `dispatcher_delta.md` | DELTA 4b/4c + DELTA 5 dispatcher renames: `S7` remote-reactive gate, `Yjp` prefix-overflow pre-check, `Ego` rename map, recovery-timeout `vqr`. |
| `cross_validation.md` | Line-by-line re-verification log of every anchor in section 1 + the 0-count grep proofs against v2.1.156. |

Also: add the v2.1.183 symbols above to `00_overview/symbol_index_core_features.md` (Compact module) — every readable name now has a NEW obfuscated alias.

---

## 6. Grep-proof appendix (reproducible)

```
# v2.1.156 (PRIOR) — all ZERO (mechanisms are new in 2.1.183):
grep -c "tengu_1m_credits_clamp_activated"     156 → 0
grep -c "longContext1mCreditsBlocked"          156 → 0
grep -c 'source: "clientdata"'                 156 → 0
grep -c 'source: "model-default"'              156 → 0
grep -c "rowan_thicket"                        156 → 0
grep -c "tengu_amber_moleskin"                 156 → 0
grep -c "tengu_precompute_arm_table_malformed" 156 → 0
grep -c "tengu_reactive_compact_remote"        156 → 0
grep -c "tengu_auto_compact_prefix_overflow"   156 → 0
grep -F "fallbackModel" in _X4 body (156:423527-423660) → 0

# v2.1.183 (TARGET) — present:
229192  tengu_1m_credits_clamp_activated ; 2968 Wtr / 2965 N8e ; 229606 Fwn
134108  tH: if (ARr(e,t)) return jQ ; 134118 ARr ; 134192 jQ=200000
226888  source:"clientdata" (ywd@226865) ; 226891 source:"model-default"
226920  bqr (tengu_amber_moleskin@226970) ; 226914 tengu_precompute_arm_table_malformed
226751  S7 remote gate (tengu_reactive_compact_remote@226753)
461484  Yjp ; 461542 tengu_auto_compact_prefix_overflow
461189-461285  del fallback-model while-loop ; 461078 ICn ; 461118 cache-fork fallback
context-hint beta UNCHANGED: 101582 (183) vs 98137 (156) == "context-hint-2026-04-09"
```
