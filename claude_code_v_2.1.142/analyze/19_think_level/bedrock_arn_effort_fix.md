# Bedrock Application-Inference-Profile ARN Effort Fix (v2.1.122)

## What changed

Before v2.1.122, when the Bedrock model id was an
`application-inference-profile` ARN (e.g.
`arn:aws:bedrock:us-east-1:123:application-inference-profile/abc`), two
parts of the effort pipeline broke:

1. The `/model` UI's **Effort** sub-row was hidden — the capability
   check `modelSupportsEffort(arn)` couldn't pattern-match the ARN
   against `claude-opus-4-7` / `opus-4-6` / `sonnet-4-6`, so the row
   wouldn't render.
2. The request builder skipped `output_config.effort` for the same
   reason — `lm5` (applyOutputConfigEffort) gates on
   `modelSupportsEffort` and silently dropped the field for ARNs.

The fix in v2.1.122 plumbs an **ARN → backing model resolution** layer
into the model-identity function (`k7`). When the ARN's backing model
is unknown, the fix asynchronously calls Bedrock's
`GetInferenceProfileCommand` to discover it and caches the result for
the session. The `/model` UI warms this cache on focus via `useEffect`,
so by the time the Effort row would render, the resolved canonical id
(e.g. `claude-opus-4-7`) is available and the capability check passes.

## Source: model identity with ARN resolution

```javascript
// ============================================
// resolveModelCanonicalId - model id with ARN→backing-model resolution
// Location: cli_inner_pretty.js:97419-97427
// ============================================

// ORIGINAL (for source lookup):
function k7(H) {
  let $ = vp$(H);
  if ($ !== H) return Nj($);
  if (H.includes("application-inference-profile")) {
    let q = av8(DL(H));
    if (q) return Nj(q);
  }
  return Nj($);
}

// READABLE (for understanding):
function resolveModelCanonicalId(modelString) {
  // Path 1: try to extract a canonical model substring from the input.
  // vp$ scans for known model substrings; if it doesn't change anything,
  // the input is "raw" — possibly an opaque ARN or a Bedrock model id.
  const trimmed = stripVendorPrefix(modelString);
  if (trimmed !== modelString) return canonicalizeModelId(trimmed);

  // Path 2: Bedrock application-inference-profile ARN — look up the
  // backing model from the in-memory cache populated asynchronously by
  // GetInferenceProfileCommand.
  if (modelString.includes("application-inference-profile")) {
    const backingModel = getInferenceProfileBackingModel(stripQuotes(modelString));
    if (backingModel) return canonicalizeModelId(backingModel);
  }

  // Path 3: fall back to canonicalize the original string.
  return canonicalizeModelId(trimmed);
}

// Mapping: k7→resolveModelCanonicalId, vp$→stripVendorPrefix,
//          Nj→canonicalizeModelId, av8→getInferenceProfileBackingModel,
//          DL→stripQuotes
```

`canonicalizeModelId` (`Nj`) is the substring-matcher that maps
`anthropic.claude-opus-4-7-foundry-xyz` → `claude-opus-4-7`:

```javascript
// ============================================
// canonicalizeModelId - reduce vendor-specific id to canonical "claude-…" name
// Location: cli_inner_pretty.js:97401-97418
// ============================================

function canonicalizeModelId(modelString) {
  const lc = modelString.toLowerCase();
  if (lc.includes("claude-opus-4-7"))  return "claude-opus-4-7";
  if (lc.includes("claude-opus-4-6"))  return "claude-opus-4-6";
  if (lc.includes("claude-opus-4-5"))  return "claude-opus-4-5";
  if (lc.includes("claude-opus-4-1"))  return "claude-opus-4-1";
  if (/claude-opus-4(?!-\d(?!\d))/.test(lc)) return "claude-opus-4-0";
  if (lc.includes("claude-sonnet-4-6"))   return "claude-sonnet-4-6";
  if (lc.includes("claude-sonnet-4-5"))   return "claude-sonnet-4-5";
  if (/claude-sonnet-4(?!-\d(?!\d))/.test(lc)) return "claude-sonnet-4-0";
  if (lc.includes("claude-haiku-4-5"))    return "claude-haiku-4-5";
  // …Claude 3.x branches…
  return lc.replace(/-\d{8}$/, "");
}
```

## Source: async backing-model loader

```javascript
// ============================================
// loadBedrockInferenceProfileBackingModel - cached async GetInferenceProfile
// Location: cli_inner_pretty.js:90502-90523
// ============================================

// ORIGINAL (for source lookup):
abH = L8(async function (H) {
  let $ = rQq(H),
    q = null;
  try {
    let [K, { GetInferenceProfileCommand: _ }] = await Promise.all([
        oQq(),
        Promise.resolve().then(() => (b7$(), C7$)),
      ]),
      z = (await K.send(new _({ inferenceProfileIdentifier: $ }), { abortSignal: AbortSignal.timeout(8000) }))
        .models?.[0]?.modelArn;
    if (z) {
      let Y = z.lastIndexOf("/");
      q = Y >= 0 ? z.substring(Y + 1) : z;
    }
  } catch (K) {
    N(
      `Failed to resolve Bedrock inference profile backing model for ${$}: ${K instanceof Error ? K.message : String(K)}`,
      { level: "error" },
    );
  }
  return (sv8($, q), q);
}, rQq);

// READABLE (for understanding):
//
// L8 is a memoize-by-key helper. Second arg `rQq` is the key function
// (it returns the ARN string, normalized). The function body runs once
// per unique ARN; subsequent calls with the same ARN await the cached
// promise.
const loadBedrockInferenceProfileBackingModel = memoizeByKey(
  async function (arn) {
    const normalizedArn = normalizeArnForCache(arn);  // rQq
    let backingModel = null;
    try {
      // Build a Bedrock client and load the SDK GetInferenceProfileCommand
      // in parallel (both are async dynamic imports).
      const [bedrockClient, { GetInferenceProfileCommand }] = await Promise.all([
        getBedrockClientForArn(normalizedArn),
        importBedrockSdkCommand(),
      ]);

      // 8-second hard timeout. Bedrock's GetInferenceProfile is usually
      // ~200ms but can stall under throttling — we don't want to block
      // the /model UI for 30s.
      const response = await bedrockClient.send(
        new GetInferenceProfileCommand({ inferenceProfileIdentifier: normalizedArn }),
        { abortSignal: AbortSignal.timeout(8000) },
      );

      // The response shape is `.models[0].modelArn` — extract the model
      // name from the trailing path segment.
      const modelArn = response.models?.[0]?.modelArn;
      if (modelArn) {
        const slashIdx = modelArn.lastIndexOf("/");
        backingModel = slashIdx >= 0 ? modelArn.substring(slashIdx + 1) : modelArn;
      }
    } catch (err) {
      logError(
        `Failed to resolve Bedrock inference profile backing model for ${normalizedArn}: ${errMessage(err)}`,
        { level: "error" },
      );
      // backingModel stays null — capability checks return false.
    }
    // Cache (including null on failure) so we don't re-hit Bedrock on
    // every keystroke in the /model picker.
    setInferenceProfileBackingModel(normalizedArn, backingModel);
    return backingModel;
  },
  normalizeArnForCache,  // memoize key
);

// Mapping: abH→loadBedrockInferenceProfileBackingModel, rQq→normalizeArnForCache,
//          L8→memoizeByKey, oQq→getBedrockClientForArn,
//          b7$/C7$→importBedrockSdkCommand, sv8→setInferenceProfileBackingModel
```

## Source: `/model` picker warming on focus

```javascript
// ============================================
// modelPickerUseEffect - warm ARN backing model when row appears
// Location: cli_inner_pretty.js:434323-434346
// ============================================

// ORIGINAL (for source lookup):
if ($[22] !== l || $[23] !== c)
  ((r = () => {
    if (!c?.includes("application-inference-profile")) return;
    let M$ = !1;
    return (
      abH(c).then(() => {
        if (!M$) l();
      }),
      () => {
        M$ = !0;
      }
    );
  }), …);

$jH.useEffect(r, KH);
let HH;
if ($[27] !== c) ((HH = c ? CP(c) : !1), ($[27] = c), ($[28] = HH));
else HH = $[28];
let qH = HH;

// READABLE (for understanding):
useEffect(() => {
  if (!modelId?.includes("application-inference-profile")) return;
  let cancelled = false;
  loadBedrockInferenceProfileBackingModel(modelId).then(() => {
    // Bump a render counter so the surrounding component re-runs the
    // capability checks (modelSupportsEffort, modelSupportsMax, modelSupportsXhigh)
    // with the now-populated cache.
    if (!cancelled) forceRerender();
  });
  return () => { cancelled = true; };
}, [modelId]);

// Re-checked AFTER the useEffect resolves:
const effortSupported = modelId ? modelSupportsEffort(modelId) : false;
//                                  └── now sees the resolved backing
//                                      model thanks to the cache write
```

The `useEffect` runs whenever `modelId` (the user's currently-selected
model) changes. It:

1. Bails immediately for non-ARN model ids (no async work needed).
2. Starts the async loader for ARN model ids.
3. On resolution (or failure), bumps a render counter (`l()`) to
   trigger a re-evaluation of the capability gates.

The capability gate evaluation `c ? CP(c) : !1` is the line that
*shows or hides* the Effort row. Once `CP` (`modelSupportsEffort`)
returns true, the Effort sub-picker renders.

## Source: request-builder gate on `lm5`

```javascript
// ============================================
// applyOutputConfigEffort - gates output_config.effort on modelSupportsEffort
// Location: cli_inner_pretty.js:524795-524803
// ============================================

// ORIGINAL (for source lookup):
function lm5(H, $, q, K, _) {
  if (!CP(_)) {
    delete $.effort;
    return;
  }
  if ("effort" in $) return;
  if (H === void 0) K.push(WxH);
  else if (typeof H === "string") (($.effort = H), K.push(WxH));
}

// READABLE (for understanding):
function applyOutputConfigEffort(effortValue, outputConfig, requestBody, betas, model) {
  // Step 1: capability gate.
  // For Bedrock ARNs, this now correctly returns true once the cache is warm.
  if (!modelSupportsEffort(model)) {
    // Strip stray "effort" if some earlier path put one in — defensive.
    delete outputConfig.effort;
    return;
  }
  // Step 2: don't clobber an existing effort (caller has higher priority).
  if ("effort" in outputConfig) return;
  // Step 3: write effort + opt in to the beta header so the server actually
  // accepts the field.
  if (effortValue === undefined) {
    // Even with no effort value, mention the beta so the request shape stays valid.
    betas.push(EFFORT_BETA_HEADER);
  } else if (typeof effortValue === "string") {
    outputConfig.effort = effortValue;
    betas.push(EFFORT_BETA_HEADER);
  }
}

// Mapping: lm5→applyOutputConfigEffort, CP→modelSupportsEffort,
//          WxH→EFFORT_BETA_HEADER ("anthropic-beta" value enabling output_config.effort)
```

The fix is implicit here: `lm5` itself is unchanged in structure
between v2.1.121 and v2.1.122. What's changed is `modelSupportsEffort`
via `k7`'s new ARN-resolution path. The same call to
`modelSupportsEffort(arn)` that returned `false` in v2.1.121 now
returns `true` (after the cache is warm) — and `lm5` consequently
sets `output_config.effort`.

The thinking branch (524276-524291) has an identical capability check
shape; the same fix benefits thinking-budget computation.

## Why this approach

### Why async resolution rather than parsing the ARN?

**What:** The fix calls Bedrock's `GetInferenceProfileCommand` rather
than parsing the ARN string to guess the backing model.

**Why:**

- An `application-inference-profile` ARN is opaque by design — the
  profile name `abc-123` can route to *any* underlying model the
  customer chose. There's no parseable hint in the ARN about which
  Claude model is backing it.
- Bedrock's API exposes the mapping (`GetInferenceProfile.models[]`)
  as a first-class resource. Using the API is the only correct way.
- The customer can change the routing later (e.g. swap Opus 4.6 →
  Opus 4.7 in their profile config). Bedrock's API reflects the
  current routing; a static parse would not.

### Why memoize the loader?

**What:** `abH` wraps the async lookup in `L8(…, rQq)` — a memoize-by-
key helper. Repeat calls with the same ARN reuse the in-flight
promise.

**Why:**

- The `/model` picker can fire the `useEffect` multiple times during a
  single session (focus changes, re-render churn). Without memoization
  the client would hammer Bedrock with redundant requests.
- The 8-second timeout per call means a deduplicated single-flight
  pattern is essential — a stuck request shouldn't block subsequent
  retries.
- The cache persists across `/model` opens within a session, so
  re-opening the picker is instantaneous.

### Why an 8-second timeout?

**What:** `AbortSignal.timeout(8000)` caps the Bedrock call at 8s.

**Why:**

- Bedrock's `GetInferenceProfile` is normally ~200ms-1s. 8s is well
  above the p99.
- The UI thread is waiting for this response to decide whether to show
  the Effort row. A longer timeout would feel like the UI is
  unresponsive.
- 8s is short enough that a true network blackhole gives up
  reasonably; a longer wait would just frustrate users.
- On timeout, `q` stays null and the cache caches null — subsequent
  re-tries on the same ARN won't hammer Bedrock. The user can refresh
  the picker manually if they want to retry.

### Why cache null (failure) as well as the value?

**What:** The line `sv8($, q)` writes the result to the cache even
when `q === null` (lookup failed).

**Why:**

- Without caching null, every re-render would re-attempt the lookup
  → multiplied 8s timeouts. The user's `/model` picker would feel
  broken.
- A failure to resolve is itself a stable answer: "we don't know,
  treat as unsupported." Caching that answer is correct.
- The user can re-launch the client to retry (the cache is in-memory,
  per process). This is the trade-off — staleness vs. retry storm —
  and the team chose staleness.

### Why warm the cache on `/model` focus rather than on session start?

**What:** The `useEffect` runs only when the user opens the `/model`
picker (or the ARN-model is selected via CLI).

**Why:**

- A session may never need to know the backing model — e.g. a CLI
  invocation that doesn't open `/model` and uses the default effort.
  Eager resolution would waste a Bedrock call.
- The picker is the canonical "show me effort options" moment. Warming
  there means the row appears with at most one frame of lag.
- For non-picker code paths (the request builder's `lm5`), the cache
  is consulted lazily on first request — the first request itself
  populates the cache for subsequent requests in the same session.

## What this means for users

A user with a Bedrock setup like:

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export ANTHROPIC_MODEL="arn:aws:bedrock:us-east-1:123:application-inference-profile/my-claude-opus-4-7"
```

Pre-2.1.122 experience:
- `/model` picker: no Effort sub-row visible. Looked like effort
  wasn't available on Bedrock.
- API requests: `output_config.effort` never sent. Even after
  `/effort high`, the request omitted effort entirely. Server defaulted
  to its own behavior.
- `claude_effort_env_var` and hook input `effort.level` also missed
  because they go through the same `modelSupportsEffort` gate.

Post-2.1.122 experience:
- `/model` picker: opens, then ~200ms later the Effort sub-row
  appears (cache warmed via `useEffect`).
- API requests: `output_config.effort` correctly populated.
- Hook input: includes `effort.level`. Bash env: includes
  `CLAUDE_EFFORT`.

The fix is invisible during the 200ms warm window; users with very
attentive eyes might see the Effort row appear-after-render, but
that's the cost of moving from "broken" to "correct."

## Cross-validation: v2.1.121 → v2.1.122

| Aspect | v2.1.121 | v2.1.122 | Δ |
|--------|----------|----------|---|
| ARN → backing model resolution | Not attempted | `GetInferenceProfileCommand` async lookup | New |
| `k7(arn)` returns | Raw ARN substring | Canonical model id (`claude-opus-4-7`) after cache warm | Fixed |
| `modelSupportsEffort(arn)` returns | Coarse-grained (Bedrock-region default) | Per-backing-model | Fixed |
| `/model` Effort row visible | Hidden | Visible after ~200ms warm | Fixed |
| `output_config.effort` in request | Dropped (capability check failed) | Set when supported | Fixed |
| Hook input `effort.level` | Absent | Present | Fixed (consequential) |
| `CLAUDE_EFFORT` env var on Bash | Absent | Present when warmed | Fixed (consequential) |
| Cache | n/a | `U$.inferenceProfileBackingModels: Map<ARN, modelId\|null>` | New |
| Failure handling | n/a | Caches null after 8s timeout | New |

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Bedrock / Model Selection
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions in this document:
- `resolveModelCanonicalId` (`k7`) — model identity with ARN path; cli_inner_pretty.js:97419-97427
- `canonicalizeModelId` (`Nj`) — substring matcher; cli_inner_pretty.js:97401-97418
- `loadBedrockInferenceProfileBackingModel` (`abH`) — async lookup + memoize; cli_inner_pretty.js:90502-90523
- `getInferenceProfileBackingModel` (`av8`) — cache read; cli_inner_pretty.js:3172-3174
- `setInferenceProfileBackingModel` (`sv8`) — cache write; cli_inner_pretty.js:3175-3177
- `applyOutputConfigEffort` (`lm5`) — capability-gated effort writer; cli_inner_pretty.js:524795-524803
- `U$.inferenceProfileBackingModels` — Map cache; cli_inner_pretty.js:2300
