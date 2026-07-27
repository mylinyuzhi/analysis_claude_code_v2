# Cost and usage metering (2.1.196 / 2.1.211 / 2.1.214 / 2.1.218 / 2.1.219)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
**Baseline:** `…/2.1.193/extract/cli_inner_pretty.js` — every `(193)` citation is tagged.

Bullets covered here:

| Version | Bullet | Verdict |
|---|---|---|
| `.214` | *Fixed session cost and token telemetry double-counting on streams that emit multiple cumulative `message_delta` frames* | net-new code, in a subsystem absent from the baseline |
| `.218` | *Fixed gateway spend metering to price Bedrock application-inference-profile ARNs and other config-mapped upstream model IDs at the configured model's rates* | net-new code, `application-inference-profile` literal is carryover |
| `.211` | *Fixed `/clear` not resetting the session cost counter — the statusline's cost now starts at $0 after `/clear`* | net-new call site, pinned to one line |
| `.219` | *"Removed Opus 4.7 from fast mode"* (adjacent) | **ground-truth correction: fast-mode pricing IS implemented client-side** |
| `.196` | *Fixed the rate-limit warning flickering off and rate-limit telemetry being over-counted…* | **unanchored** — decoy documented |
| `.218` | *Fixed rare negative or incorrect turn duration measurements after a system clock adjustment by timing turns with a monotonic clock* | **unanchored** — decoy documented |

---

## 0. Read this first: a whole cost subsystem is new, and it is a *server*

Two of these bullets ( `.214`#38 and `.218`#9 ) land in the **Cloud gateway** — an HTTP proxy that
sits between clients and upstream model providers, meters spend, and pushes managed settings. It is
bundled in 2.1.220 and **is not in 2.1.193 at all**:

```
all upstreams failed                        2 / 0
store.postgres_url                          3 / 0
telemetry.forward_to                       11 / 0        (`forward_to`)
output_tokens: Math.ceil(                    1 / 0
usage metering failed                        1 / 0
spend record failed                          1 / 0
spend meter has no exact rates for model     1 / 0
metering at the unknown-model default tier   1 / 0
```

So for these two bullets **there is no before-picture to diff against**. They describe fixes to code
that was written after 2.1.193 and before 2.1.214/.218. What I can do — and what the rest of this
document does — is show the *current* mechanism, identify the specific guard variable or branch that
is the fix's fingerprint, and say plainly that the pre-state is not observable from these two bundles.
Claiming a line-level "before" here would be fabrication.

---

## 1. `message_delta` double-counting (.214)

**Anchors:** `sawOutputTokens` 220=3 / 193=0; `estOutputChars` 220=5 / 193=0.

### 1.1 The Anthropic SSE stream's usage semantics

An Anthropic streaming response carries usage in two places:

- `message_start` → `message.usage` with `input_tokens`, `cache_read_input_tokens`,
  `cache_creation_input_tokens`, and a *provisional* `output_tokens`.
- `message_delta` → `usage.output_tokens`, **cumulative** — each frame restates the running total, it
  is not an increment.

A metering proxy that *adds* `message_delta.usage.output_tokens` to a running sum over-counts
quadratically in the number of frames. That is the bug.

### 1.2 The mechanism

```javascript
// ============================================
// newSseUsageAccumulator - per-response usage state for the gateway's SSE sniffer
// Location: cli_inner_pretty.js:862760-862762
// ============================================

// ORIGINAL (for source lookup):
function e_E() {
  return { usage: { input_tokens: 0, output_tokens: 0 }, seen: !1, estOutputChars: 0, sawOutputTokens: !1 };
}

// READABLE (for understanding):
function newSseUsageAccumulator() {
  return {
    usage: { input_tokens: 0, output_tokens: 0 },
    seen: false,                 // did we observe ANY authoritative usage frame?
    estOutputChars: 0,           // characters of streamed output, for the estimation fallback
    sawOutputTokens: false,      // did a message_delta ever report output_tokens?
  };
}

// Mapping: e_E→newSseUsageAccumulator
```

```javascript
// ============================================
// consumeSseUsageFrame - folds one SSE frame into the accumulator
// Location: cli_inner_pretty.js:862763-862802
// ============================================

// ORIGINAL (for source lookup):
function jMm(e, t) {
  let r = rvl(t, "event:"),
    n = r ? t.slice(r[0], r[1]).trim() : null;
  if (n === "content_block_delta") {
    GMm(e, t);
    return;
  }
  if (n !== null && n !== "message_start" && n !== "message_delta") return;
  if (n === null) {
    if (!t.includes('"usage"')) {
      if (t.includes('"content_block_delta"')) GMm(e, t);
      return;
    }
  }
  let o = rvl(t, "data:");
  if (!o) return;
  let i;
  try {
    i = JSON.parse(t.slice(o[0], o[1]).trim());
  } catch {
    return;
  }
  let s = n_E().safeParse(i);
  if (!s.success) return;
  if (s.data.type === "message_start" && s.data.message?.usage) {
    (VMm(e.usage, s.data.message.usage), (e.seen = !0));
    return;
  }
  if (s.data.type === "content_block_delta" && s.data.delta) {
    let a = s.data.delta;
    e.estOutputChars += (a.text?.length ?? 0) + (a.partial_json?.length ?? 0) + (a.thinking?.length ?? 0);
    return;
  }
  if (s.data.type === "message_delta" && s.data.usage) {
    if (s.data.usage.output_tokens !== void 0)
      ((e.usage.output_tokens = s.data.usage.output_tokens), (e.sawOutputTokens = !0));
    if (s.data.usage.server_tool_use !== void 0) e.usage.server_tool_use = s.data.usage.server_tool_use;
    e.seen = !0;
  }
}

// READABLE (for understanding):
function consumeSseUsageFrame(acc, frameText) {
  let eventSpan = findSseFieldSpan(frameText, "event:"),
    eventName = eventSpan ? frameText.slice(eventSpan[0], eventSpan[1]).trim() : null;

  if (eventName === "content_block_delta") { addContentBlockDeltaChars(acc, frameText); return; }

  // Only three event types matter; anything else with a name is skipped outright.
  if (eventName !== null && eventName !== "message_start" && eventName !== "message_delta") return;

  // No `event:` line (some upstreams omit it): cheap substring pre-filter before JSON.parse.
  if (eventName === null && !frameText.includes('"usage"')) {
    if (frameText.includes('"content_block_delta"')) addContentBlockDeltaChars(acc, frameText);
    return;
  }

  let dataSpan = findSseFieldSpan(frameText, "data:");
  if (!dataSpan) return;
  let parsed;
  try { parsed = JSON.parse(frameText.slice(dataSpan[0], dataSpan[1]).trim()); } catch { return; }
  let validated = sseUsageFrameSchema().safeParse(parsed);
  if (!validated.success) return;

  if (validated.data.type === "message_start" && validated.data.message?.usage) {
    mergeUsageFields(acc.usage, validated.data.message.usage);          // input/cache/server_tool_use/speed
    acc.seen = true;
    return;
  }
  if (validated.data.type === "content_block_delta" && validated.data.delta) {
    let d = validated.data.delta;
    acc.estOutputChars += (d.text?.length ?? 0) + (d.partial_json?.length ?? 0) + (d.thinking?.length ?? 0);
    return;
  }
  if (validated.data.type === "message_delta" && validated.data.usage) {
    if (validated.data.usage.output_tokens !== undefined) {
      acc.usage.output_tokens = validated.data.usage.output_tokens;     // ASSIGN, never +=
      acc.sawOutputTokens = true;
    }
    if (validated.data.usage.server_tool_use !== undefined)
      acc.usage.server_tool_use = validated.data.usage.server_tool_use;
    acc.seen = true;
  }
}

// Mapping: jMm→consumeSseUsageFrame, rvl→findSseFieldSpan (:862807), GMm→addContentBlockDeltaChars (:862803),
//          VMm→mergeUsageFields (:862850), n_E→sseUsageFrameSchema
```

```javascript
// ============================================
// finalizeSseUsage - estimates output tokens only when the stream never reported them
// Location: cli_inner_pretty.js:862829-862833
// ============================================

// ORIGINAL (for source lookup):
function t_E(e) {
  if (!e.sawOutputTokens && e.estOutputChars > 0)
    ((e.usage.output_tokens = Math.ceil(e.estOutputChars / qMm)), (e.seen = !0));
  return e.seen ? e.usage : null;
}
var qMm = 4;                                   // :862862

// READABLE (for understanding):
function finalizeSseUsage(acc) {
  if (!acc.sawOutputTokens && acc.estOutputChars > 0) {
    acc.usage.output_tokens = Math.ceil(acc.estOutputChars / CHARS_PER_TOKEN_ESTIMATE);
    acc.seen = true;
  }
  return acc.seen ? acc.usage : null;          // null => nothing to meter
}
var CHARS_PER_TOKEN_ESTIMATE = 4;

// Mapping: t_E→finalizeSseUsage, qMm→CHARS_PER_TOKEN_ESTIMATE
```

### `Algorithm: assign-not-accumulate, with a character-count fallback that must not fire`

**What it does:** derives one authoritative usage record from an SSE stream that may report usage
zero, one, or many times, and may not report output tokens at all.

**How it works:**
1. `message_start.message.usage` is merged by `mergeUsageFields` (`:862850-862859`). Note what that
   function does *not* touch: **`output_tokens`**. It writes `input_tokens`, both cache fields,
   `server_tool_use` and `speed`, and leaves `output_tokens` at whatever the accumulator holds. The
   provisional `output_tokens` in `message_start` is deliberately ignored.
2. `content_block_delta` frames only ever add to `estOutputChars`. They never touch `usage`.
3. `message_delta.usage.output_tokens` is **assigned** (`:862798`), and `sawOutputTokens` is latched
   true. Ten cumulative frames therefore leave `output_tokens` equal to the last frame's value, which
   is the correct total. **The assignment is the fix.**
4. At end of stream, `finalizeSseUsage` estimates from characters **only if `sawOutputTokens` is
   false**. `sawOutputTokens` is the guard that keeps the estimate from ever competing with real data.
5. `acc.seen` is the "meter this at all?" flag. If no usage frame and no output characters were seen,
   `null` is returned and `WMm`'s callback is never invoked (`:862699-862700`), so nothing is billed.

**Why two separate flags (`seen` and `sawOutputTokens`)?**
They answer different questions. `seen` means "we have *something* worth recording" — a
`message_start` alone sets it, because input tokens are billable even if the response produced no
output. `sawOutputTokens` means "output tokens are authoritative" — only `message_delta` sets it.
Collapsing them into one flag would either suppress input-only billing or let the character estimate
overwrite a real `message_delta` total. The two-flag split is the minimum needed to keep those cases
independent.

**Why is `estOutputChars` counted two different ways?**
- Precise, post-parse: `:862793` sums `text` + `partial_json` + `thinking` lengths from the validated
  delta.
- Approximate, pre-parse: `addContentBlockDeltaChars` at `:862803-862805` does
  `e.estOutputChars += Math.max(0, r[1] - r[0] - ZyE)` with `ZyE = 80` (`:862863`) — it measures the
  raw `data:` payload span and subtracts a flat 80-byte allowance for the JSON envelope.

  The cheap path exists because `content_block_delta` is by far the highest-frequency frame in a
  stream. Running `JSON.parse` plus zod validation on every token delta in a *proxy* would dominate
  its CPU. The 80-byte constant is a hand-tuned envelope estimate for
  `{"type":"content_block_delta","index":N,"delta":{"type":"text_delta","text":"…"}}`, and
  `Math.max(0, …)` protects against a frame shorter than the envelope. It is only ever used for a
  fallback estimate that `sawOutputTokens` normally suppresses, so its error budget is generous.
- `CHARS_PER_TOKEN_ESTIMATE = 4` is the conventional English-text chars-per-token ratio. `Math.ceil`
  biases the estimate *up* — for a meter, over-estimating a value you could not measure is the safer
  direction, but note it also means a fallback-metered response is billed slightly high.

**Failure modes:**
- Malformed JSON → `catch { return; }` (`:862782-862784`), frame ignored, no state corruption.
- Schema mismatch → `if (!validated.success) return;` (`:862786`). A stream whose *shape* changed
  upstream silently degrades to character estimation, which is why the estimate exists at all.
- Buffer overrun → `JyE`'s `push` drops the partial-frame buffer when it exceeds
  `UMm = 8388608` (8 MiB, `:862860`) at `:862735`, and the non-SSE branch latches a `s` flag and
  clears at `:862750`. An 8 MiB single SSE frame stops being parsed rather than growing unboundedly.
- A response that errors before any frame: `WMm` returns early on `!e.body || e.status >= 400`
  (`:862690`), so nothing is metered for a failed request.

**Key insight:** the *entire* correctness of a metering proxy hinges on whether one character is `=`
or `+=`. The two boolean flags exist to make that single assignment safe — one keeps a fallback
estimate from clobbering it, the other keeps a missing value from suppressing billable input tokens.

### 1.3 Where the sniffer plugs in

`WMm` (`:862689-862722`) wraps the upstream `Response` in a `ReadableStream` that tees every chunk to
the accumulator and forwards it unchanged. The `c()` closure at `:862695-862704` is idempotent (`let l`
latch) and is called from all three terminal paths — `pull` on `done`, `pull` on error, and `cancel`
— so **a client that disconnects mid-stream is still metered for what was generated**. A
`try/catch` logs `usage metering failed: …` (`:862702`) rather than propagating, so a metering bug can
never break the proxied response.

---

## 2. Gateway spend metering for config-mapped model ids (.218)

**Literal check:** `application-inference-profile` is 220=**6** / 193=**6**. All six map one-to-one
(220 `:111144 :436763 :455772 :509393 :510399 :667140` ↔ 193 `:103552 :457941 :692356 :594278
:595079 :490651`). The literal is pure carryover; the bullet is about the gateway's pricing lookup.

```javascript
// ============================================
// priceUsageCents - prices one metered request, falling back to the configured model id
// Location: cli_inner_pretty.js:862658-862663
// ============================================

// ORIGINAL (for source lookup):
function BMm(e, t, r) {
  let n = XyE(t),
    o = vTt(e ?? "") ? e : vTt(r ?? "") ? r : null,
    i = o != null ? Dji(o, n) : l7n;
  return Lji(i, n) * 100;
}

// READABLE (for understanding):
function priceUsageCents(requestedModelId, rawUsage, configuredModelId) {
  let usage = normalizeUsageForPricing(rawUsage);
  let priceableId =
    isPriceableModelId(requestedModelId ?? "") ? requestedModelId          // 1. the id on the wire
    : isPriceableModelId(configuredModelId ?? "") ? configuredModelId      // 2. the id from gateway config
    : null;
  let rates = priceableId != null ? resolveModelCosts(priceableId, usage) : UNKNOWN_MODEL_COSTS;
  return computeCostUsd(rates, usage) * 100;                               // dollars -> cents
}

// ============================================
// isPriceableModelId - is there a rate table for this id?
// Location: cli_inner_pretty.js:862664-862669
// ============================================

// ORIGINAL (for source lookup):
function vTt(e) {
  let t = lo(e);
  if (Fot[t] !== void 0) return !0;
  let r = xt().additionalModelCostsCache;
  return r?.[e] !== void 0 || r?.[t] !== void 0;
}

// READABLE (for understanding):
function isPriceableModelId(modelId) {
  let normalized = normalizeModelId(modelId);
  if (MODEL_COSTS[normalized] !== undefined) return true;              // the baked catalogue
  let extra = getConfig().additionalModelCostsCache;                   // operator-supplied rates
  return extra?.[modelId] !== undefined || extra?.[normalized] !== undefined;
}

// Mapping: BMm→priceUsageCents, XyE→normalizeUsageForPricing (:862670), vTt→isPriceableModelId,
//          Dji→resolveModelCosts (:109772), Lji→computeCostUsd (:109763),
//          l7n→UNKNOWN_MODEL_COSTS (:109851), Fot→MODEL_COSTS (:109853), lo→normalizeModelId
```

### `Decision: try the wire id, then the configured id, then a default tier`

**What it does:** prices a request whose model id is an opaque ARN that no rate table can contain.

**How it works:**
1. A Bedrock *application inference profile* ARN looks like
   `arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/abc123`. It carries **no
   model family**, so `MODEL_COSTS[normalize(arn)]` misses and `isPriceableModelId(arn)` is false.
2. The gateway's own configuration maps that ARN to a real model id (the "config-mapped upstream model
   ID" of the bullet). `priceUsageCents` receives it as the third argument and tries it second.
3. If neither is priceable, `UNKNOWN_MODEL_COSTS` is used. `l7n = Dig` (`:109851`), and `Dig`
   (`:109827-109834`) is `{ inputTokens: 5, outputTokens: 25, promptCacheWriteTokens: 6.25,
   promptCacheWrite1hTokens: 10, promptCacheReadTokens: 0.5, webSearchRequests: 0.01 }` — i.e.
   **standard Opus rates**. The default is deliberately the expensive end of the range: under-billing
   an unknown model is worse for the operator than over-billing it.
4. `× 100` converts to cents, because the gateway's spend ledger is integer cents.

**Why order the wire id first?** The id on the wire is the most specific statement of what actually
ran. Config mapping is a translation layer that may be stale or wrong; it should only be consulted
when the wire id cannot be priced.

**Why not fall back to the session's own model?** The client-side resolver `Dji` does exactly that as
its last resort — `Fot[lo(Z$())] ?? l7n` at `:109783`, "price it like whatever model this session is
using." In the gateway there is no session model: it serves many tenants and many models over one
process. Reaching for a "current model" would price tenant A's request at tenant B's rates. Hence the
explicit `UNKNOWN_MODEL_COSTS` branch.

**Observability of the fallback.** The gateway's `meter` closure warns once per distinct unknown id:

```javascript
// :862942-862955  (meter) and :862956-862961  (warnUnknownModel)
  function c(d, p, f, m, g, y) {
    if (d.status < 400 && f !== null && !vTt(m ?? "")) u(f);
    return WMm(d, (_) => BMm(f, _, m), (_) => { IMm(e, p.sub, _).catch((E) => Ap("warn", `spend record failed: ${le(E)}`)); }, g, y);
  }
  function u(d) {
    if (vTt(d) || n.has(d) || n.size >= 1000) return;
    (n.add(d), Ap("warn", `spend meter has no exact rates for model '${d}' — metering at the unknown-model default tier`));
  }
```

The `n.size >= 1000` cap is a log-flood guard: an attacker (or a misconfigured client) sending a
fresh random model id per request cannot make the gateway log unboundedly. Note the double check —
`c` tests `!vTt(m)` (configured id unpriceable) and `u` tests `vTt(d)` (requested id priceable) — so
the warning fires exactly when *neither* is priceable, matching the branch in `priceUsageCents` that
reaches `UNKNOWN_MODEL_COSTS`.

`additionalModelCostsCache` is 220=**6** / 193=**4** — the operator-rates escape hatch existed; the
gateway added two new readers of it (`:862667` and its client-side twin at `:109780`).

---

## 3. ⚠ Ground-truth correction: fast-mode pricing **is** implemented client-side

`_GROUND_TRUTH_verified_anchors.md` §6.5 states:

> *There is **no fast-mode tier and no multiplier anywhere in the pricing code** — `grep` for
> `fast_mode_multiplier` / `fastModeMultiplier` returns 0, and no `fastMode` site touches pricing.*
> … *Consequence worth stating explicitly: the client's own cost accounting prices a fast-mode turn
> at the standard `tier_5_25` rate, so session cost is under-reported by ~2× in fast mode.*

**Both sentences are wrong, and 44_telemetry was asked to check exactly this.** The mechanism is not
a multiplier — it is a **separate rate table selected by `usage.speed`** — which is why those two
grep terms found nothing.

```javascript
// ============================================
// resolveModelCosts - picks the rate table for a model, with a fast-mode override
// Location: cli_inner_pretty.js:109772-109784
// ============================================

// ORIGINAL (for source lookup):
function Dji(e, t) {
  let r = lo(e);
  if (t.speed === "fast") {
    if (r === "claude-opus-4-8" || r === "claude-opus-5") return a7n;
    if (r === "claude-opus-4-6" || r === "claude-opus-4-7") return UIc;
  }
  let n = Fot[r];
  if (n) return n;
  let o = xt().additionalModelCostsCache,
    i = o?.[e] ?? o?.[r];
  if (i) return i;
  return (Nig(e, r), Fot[lo(Z$())] ?? l7n);
}

// READABLE (for understanding):
function resolveModelCosts(modelId, usage) {
  let normalized = normalizeModelId(modelId);
  if (usage.speed === "fast") {                                   // <-- fast-mode rate override
    if (normalized === "claude-opus-4-8" || normalized === "claude-opus-5") return FAST_RATES_10_50;
    if (normalized === "claude-opus-4-6" || normalized === "claude-opus-4-7") return FAST_RATES_30_150;
  }
  let baked = MODEL_COSTS[normalized];
  if (baked) return baked;
  let extra = getConfig().additionalModelCostsCache;
  let operatorRates = extra?.[modelId] ?? extra?.[normalized];
  if (operatorRates) return operatorRates;
  reportUnknownModelCost(modelId, normalized);                    // tengu_unknown_model_cost
  return MODEL_COSTS[normalizeModelId(getSessionModel())] ?? UNKNOWN_MODEL_COSTS;
}

// Mapping: Dji→resolveModelCosts, lo→normalizeModelId, Fot→MODEL_COSTS, Nig→reportUnknownModelCost (:109785),
//          Z$→getSessionModel, a7n→FAST_RATES_10_50 (:109843), UIc→FAST_RATES_30_150 (:109835),
//          l7n→UNKNOWN_MODEL_COSTS (:109851)
```

The three rate tables, read verbatim at `:109827-109851`:

| Symbol | input | output | cache_write_5m | cache_write_1h | cache_read | web_search | role |
|---|---|---|---|---|---|---|---|
| `Dig` (`:109827`) | 5 | 25 | 6.25 | 10 | 0.50 | 0.01 | standard Opus; also `UNKNOWN_MODEL_COSTS` |
| `a7n` (`:109843`) | **10** | **50** | 12.5 | 20 | 1.00 | 0.01 | **fast mode, Opus 4.8 / Opus 5** |
| `UIc` (`:109835`) | **30** | **150** | 37.5 | 60 | 3.00 | 0.01 | **fast mode, Opus 4.6 / 4.7** |

`a7n` is exactly the **$10/$50** figure the `.219` changelog quotes for Opus 5. It is in the client
bundle, in the client's own cost accounting, reachable from the session cost counter. Session cost is
**not** under-reported ~2× in fast mode.

`a7n` also appears twice more:
- `:109853` — `Fot = { [YO(kot.firstParty)]: a7n, [YO(ybc.firstParty)]: a7n, ...Oig() }`. Two model ids
  are pinned to the $10/$50 table *before* the generated catalogue is spread in. `kot` is derived
  from the Fable-5 entry (`:100252`) and `ybc` from its neighbour at `:100253`, matching the
  `tier_10_50` assignment ground truth §6.5 recorded for Fable 5 and Mythos 5.
- `:109715` — `zkt(e)`: `if (!vl()) return Fot[e] ?? l7n; if (e === "claude-opus-4-8" || e === "claude-opus-5") return a7n; return UIc;` — the *display* variant, used when fast mode is build-enabled to show fast-mode prices in the UI.

### 3.1 What the real delta is: Opus 5 was added to the fast table

The mechanism is **carryover**. 2.1.193 has the same function:

```javascript
// ORIGINAL (2.1.193, for source lookup) — cli_inner_pretty.js:102553-102565 (193):
function s7u(e, t) {
  let n = to(e);
  if (t.speed === "fast") {
    if (n === "claude-opus-4-8") return n_n;
    if (n === "claude-opus-4-6" || n === "claude-opus-4-7") return r7s;
  }
  let r = TRt[n];
  ...
}
```

and the same numbers — `n_n` at `:102637-102644 (193)` is `{10, 50, 12.5, 20, 1, 0.01}`, `r7s` at
`:102629-102636 (193)` is `{30, 150, 37.5, 60, 3, 0.01}`. `grep -c 'speed === "fast"'` is 220=4 /
193=2.

**The one-token delta:** `if (n === "claude-opus-4-8")` (193) became
`if (r === "claude-opus-4-8" || r === "claude-opus-5")` (220 `:109775`). Opus 5 joined the $10/$50
fast tier. That, plus the display twin at `:109715`, is the whole pricing change for the Opus 5
launch — and it is the source-proof that the `$10/$50` in the `.219` bullet is a real client-side
price, not only skill text.

### 3.2 How `speed` reaches the pricing function

`Kkt` (`:109792-109802`) forwards it:

```javascript
function Kkt(e, t, r) {
  let n = { input_tokens: t.inputTokens, output_tokens: t.outputTokens,
            cache_read_input_tokens: t.cacheReadInputTokens,
            cache_creation_input_tokens: t.cacheCreationInputTokens,
            ...(r?.speed !== void 0 && { speed: r.speed }),
            ...(r?.serverToolUse !== void 0 && { server_tool_use: r.serverToolUse }) };
  return Roe(e, n);
}
```

Call sites read: `:331492` and `:331498` (fallback-message re-pricing, both passing
`{ speed: t.speed }`), `:513887`, `:513947`, `:513955` (auto-mode classifier cost, no speed —
classifier calls are never fast mode). `Roe` (`:109788-109791`) is the two-line
`resolveModelCosts` → `computeCostUsd` composition, and it has eleven call sites, seven of them in the
main streaming loop (`:510860`, `:511020`, `:511229`, `:511292`, `:511355`, `:511400`, `:511739`) all
passing the live `Dt` usage object — which carries `speed` when the API returned it.

`:308720` shows the other direction: `...(vl() && t.speed === "fast" && { speed: "fast" })` — a
fast-mode marker propagated only when fast mode is build-enabled. Its 193 twin is at `:375630 (193)`,
so that too is carryover.

### 3.3 What remains true from ground truth §6.5

- There is genuinely **no `fast_mode` pricing tier in the model catalogue**. The catalogue's
  `pricing_tiers` table has no fast entry, and Opus 5's catalogue `pricing` is `tier_5_25`. The
  fast-mode rates live in three hand-written objects at `:109827-109851`, outside the generated
  catalogue.
- The `$10/$50` figure does appear in the bundled `claude-api` skill text.
- Fast mode is still selected server-side by `speed: "fast"` + the beta header; the client only
  *prices* it.

**The correction is narrow and important:** "not in the catalogue" is not the same as "not
implemented". A reader who trusts §6.5 would tell an operator that fast-mode session costs are half
what they should be. They are not.

---

## 4. `/clear` resetting the session cost counter (.211)

The scoping pass filed this as *"CARRYOVER-trap — every cost literal identical in both bundles"*, and
it is right about the literals: `resetCost` 1/1, `totalCostUsd` 1/1, `sessionCost` 0/0. **The bullet
is nevertheless provable, at one line, by counting call sites rather than literals.**

```
grep -n 'resetCostState: () =>'   → 220 :2247 (=> Att)   |  193 :2215 (=> CYe)
grep -n '\bAtt\b'  (220)          → :2247 (export)  :3114 (definition)  :449533  :692558  :821906
grep -n '\bCYe\b'  (193)          → :2215 (export)  :2917 (definition)  :386120  :688562
```

Three call sites in 220, two in 193. Two of the 220 sites pair off exactly:

| 220 | 193 | context |
|---|---|---|
| `:692558` | `:386120 (193)` | `if ((Att(), Hn() === "gateway"))` / `if ((CYe(), _r() === "gateway"))` |
| `:821906` | `:688562 (193)` | the resume/fork branch — I read `:821896-821915` and `:688553-688570 (193)`; the surrounding statement lists are byte-equivalent |
| `:449533` | **—** | **new** |

`:449533` sits inside the `/clear` conversation-reset generator:

```javascript
// ============================================
// (conversation reset) - /clear now zeroes the cost/duration accumulators
// Location: cli_inner_pretty.js:449516, 449529-449541
// ============================================

// ORIGINAL (for source lookup):
  if (l && _ === 0) (l.resetTotalAgentSpawns(), l.resetWebSearchCalls());
  ...
  if (
    (Icn(),
    yield { type: "conversation_reset", newConversationId: M$d.randomUUID() },
    PSi(),
    Att(),
    Mbi({ setCurrentAsParent: !0 }),
    A$d(),
    Ept(),
    process.env.CLAUDE_CODE_SESSION_ID)
  )
    process.env.CLAUDE_CODE_SESSION_ID = kt();

// READABLE (for understanding):
  if (budgetTracker && depth === 0) {                       // .212 per-session budgets also reset here
    budgetTracker.resetTotalAgentSpawns();
    budgetTracker.resetWebSearchCalls();
  }
  ...
  notifyConversationResetListeners();
  yield { type: "conversation_reset", newConversationId: crypto.randomUUID() };
  runRegisteredResetHook();                                 // PSi -> the T0l callback slot
  resetCostState();                                         // <- NEW: the .211 fix
  reparentTranscript({ setCurrentAsParent: true });
  ...

// Mapping: Att→resetCostState, PSi→runRegisteredResetHook (:3111), DSi→setResetHook (:3108),
//          M$d→crypto, kt→getSessionId
```

and `resetCostState` itself:

```javascript
// ============================================
// resetCostState - zeroes every session-level cost and duration accumulator
// Location: cli_inner_pretty.js:3114-3126
// ============================================

// ORIGINAL (for source lookup):
function Att() {
  ((Ot.totalCostUSD = 0),
    (Ot.totalAPIDuration = 0),
    (Ot.totalAPIDurationWithoutRetries = 0),
    (Ot.totalToolDuration = 0),
    (Ot.startTime = Date.now()),
    kNn(void 0),
    (Ot.totalLinesAdded = 0),
    (Ot.totalLinesRemoved = 0),
    (Ot.hasUnknownModelCost = !1),
    (Ot.modelUsage = {}),
    (Ot.promptId = null));
}

// READABLE (for understanding):
function resetCostState() {
  STATE.totalCostUSD = 0;
  STATE.totalAPIDuration = 0;
  STATE.totalAPIDurationWithoutRetries = 0;
  STATE.totalToolDuration = 0;
  STATE.startTime = Date.now();              // session wall-clock restarts too
  setLastDuration(undefined);
  STATE.totalLinesAdded = 0;
  STATE.totalLinesRemoved = 0;
  STATE.hasUnknownModelCost = false;          // clears a sticky "prices may be wrong" flag
  STATE.modelUsage = {};                      // per-model token breakdown
  STATE.promptId = null;
}

// Mapping: Att→resetCostState, Ot→STATE, kNn→setLastDuration
```

### `Decision: reuse the whole reset, and place it after the yield`

**What it does:** makes `/clear` restore the statusline and `/cost` to a fresh-session state.

**How it works and why:**
1. **Reuse, not a narrower reset.** The bullet only mentions the statusline's dollar figure. The
   function that was called clears *eleven* fields. Introducing a `resetTotalCostOnly()` would have
   left `/cost` reporting a session duration and line counts from before the clear — internally
   inconsistent with a $0 cost. Reusing the existing reset (already exercised by the resume and
   gateway-login paths) keeps every cost surface consistent, at the price of `/clear` also resetting
   `startTime`.
2. **`startTime = Date.now()` is a deliberate consequence.** After `/clear`, "session duration" means
   time since the clear. Given that the conversation is gone, that is arguably the right reading —
   but it is a behaviour change the bullet does not mention.
3. **Ordering:** `Att()` comes *after* the `yield { type: "conversation_reset", … }` and after
   `PSi()`. Any consumer of the reset event that wanted to read the outgoing cost totals gets to run
   first. Zeroing before the yield would make the final cost unobservable.
4. **Adjacency:** `:449516` resets the `.212` per-session subagent-spawn and web-search budgets in the
   same generator, guarded by `_ === 0` (main agent only). So `/clear` is the single "new session,
   same process" boundary for *all* per-session budgets — which is what the `.212` bullet "`/clear`
   resets the budget" describes. One function, two changelog bullets, two versions apart.

**Method note worth keeping:** this bullet is unanchorable by literal counting and trivially provable
by call-site counting. When a fix is "call an existing function from one more place", the delta is a
*set difference over call sites*, and the exported-name → symbol → sites chain is how you get it.

---

## 5. Two bullets I could not anchor, and the decoys that look like anchors

Recording these is more useful than a plausible guess.

### 5.1 `.196` — rate-limit telemetry over-counted with parallel requests

**Status: UNANCHORED.**

- The scoping anchor `tengu_rate_limit_promo_notices` (220=1 / 193=0, `:227175`) is a **decoy**. I read
  `:227145-227199`: it is a GrowthBook gate name for *promotional notice content*
  (`AZg` is a zod schema of `{ bar, text, variant }` rows at `:227187-227198`), declared beside
  `tengu_usage_overage_included_models` (`:227174`). Nothing to do with counting.
- `rate_limit_status`, `tengu_rate_limit_reached`, `lastRateLimit`, `rateLimitEvent`, `exceeded_limit`
  are all 0/0.
- `tengu_rate_limit*` in 220 is six names, five of which are `_options_menu_*` / `_lever_hint` UI
  events; the sixth is the promo gate.
- `rate_limit` as a bare string is 220=102 / 193=81, and the eleven `error: "rate_limit"` construction
  sites map one-to-one to 193 (`:228456…:228499` ↔ `:237514…:237557 (193)`).

A de-duplication guard over concurrent in-flight requests would most likely be a boolean latch or a
`Set` of request ids with no string literal at all. I did not find it, and I am not going to name a
line I cannot justify.

### 5.2 `.218` — monotonic turn duration

**Status: UNANCHORED. Both scoping anchors are decoys, and one of them is vendored library code.**

- `_monotonicClock` is 220=**6** / 193=**6**. The scoping file's "best line" `:102162` is inside the
  vendored OpenTelemetry `TimeOrigin`-style clock class. Both 220 occurrences (`:102162-102169`,
  `:489375-489382`) have byte-identical 193 twins (`:140015-140022 (193)`,
  `:344734-344741 (193)`). It is `@opentelemetry/*` code and it is untouched.
- `turnDurationMs` is 220=2 / 193=2. I read both 220 sites and both 193 sites. `:647620-647642`
  (`J8p`) versus `:394402-394419 (193)` (`JJa`) are byte-equivalent including the
  `durationMs: i !== null ? o - i : r` background-wait branch. `:822912` versus `:689697 (193)` are
  the same statusline hook; I read `:821760-821804` against `:688450-688489 (193)` and the
  `turnStartTime` / `totalPausedMs` ref plumbing is identical.
- `turnStartTime` is 8/8, all eight mapping one-to-one.
- `monotonicNow`, `clockSkew`-adjacent terms, `elapsedMs`, `startPerf`, `timeOrigin`,
  `clock adjustment` all show either 0/0 or identical counts.

`performance.now()` is 220=324 / 193=297, so **27 new monotonic-clock reads exist somewhere** — the
fix is almost certainly one of them, replacing a `Date.now()` subtraction. Isolating which one, out of
324 sites with no distinguishing literal, was beyond the budget I could justify against the anchored
bullets. Recorded as unanchored with the decoys documented so the next reader does not re-walk them.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this module are staged in
> [symbol_additions_v2_1_220_telemetry.md](../00_overview/symbol_additions_v2_1_220_telemetry.md).

Key functions in this document:
- `newSseUsageAccumulator` (`e_E`, `:862760`) - per-response SSE usage state with `seen` / `sawOutputTokens`
- `consumeSseUsageFrame` (`jMm`, `:862763`) - assigns (never accumulates) `message_delta.usage.output_tokens`
- `addContentBlockDeltaChars` (`GMm`, `:862803`) - cheap pre-parse character count, `- ZyE` envelope allowance
- `finalizeSseUsage` (`t_E`, `:862829`) - character-based estimate, suppressed by `sawOutputTokens`
- `mergeUsageFields` (`VMm`, `:862850`) - merges input/cache/speed and deliberately skips `output_tokens`
- `findSseFieldSpan` (`rvl`, `:862807`) - allocation-free `event:` / `data:` line scanner
- `meterUpstreamResponse` (`WMm`, `:862689`) - tees the response body; idempotent finalisation on done/error/cancel
- `CHARS_PER_TOKEN_ESTIMATE` (`qMm` = 4, `:862862`), `SSE_BUFFER_LIMIT_BYTES` (`UMm` = 8388608, `:862860`), `SSE_ENVELOPE_ALLOWANCE` (`ZyE` = 80, `:862863`)
- `priceUsageCents` (`BMm`, `:862658`) - wire id → configured id → unknown-model tier
- `isPriceableModelId` (`vTt`, `:862664`) - catalogue or operator-supplied rates
- `normalizeUsageForPricing` (`XyE`, `:862670`) - flattens usage and forwards `speed`
- `resolveModelCosts` (`Dji`, `:109772`) - **fast-mode rate override at `:109774-109777`**
- `computeCostUsd` (`Lji`, `:109763`) - the per-Mtok dot product
- `computeCacheWriteCostUsd` (`$ig`, `:109756`) - splits 1h vs 5m cache-write tokens
- `priceUsageFromCounters` (`Kkt`, `:109792`) - client entry point; forwards `speed`
- `getFastModeDisplayCosts` (`zkt`, `:109713`) - UI-facing fast-mode rate lookup
- `FAST_RATES_10_50` (`a7n`, `:109843`) - $10/$50, Opus 4.8 + **Opus 5 (new)**
- `FAST_RATES_30_150` (`UIc`, `:109835`) - $30/$150, Opus 4.6 / 4.7
- `STANDARD_OPUS_RATES` (`Dig`, `:109827`) / `UNKNOWN_MODEL_COSTS` (`l7n`, `:109851`) - $5/$25
- `MODEL_COSTS` (`Fot`, `:109853`) - baked rate map, two ids pinned to `a7n`
- `buildBakedCostMap` (`Oig`, `:109742`) - generated from the model catalogue
- `resetCostState` (`Att`, `:3114`) - eleven-field reset; new `/clear` call site at `:449533`
