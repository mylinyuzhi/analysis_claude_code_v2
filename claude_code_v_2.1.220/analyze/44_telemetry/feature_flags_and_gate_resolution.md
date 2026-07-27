# Feature-flag resolution and the GrowthBook cache (2.1.214)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
**Baseline:** `…/2.1.193/extract/cli_inner_pretty.js` — every `(193)` citation is tagged.

Bullets covered here:

| Version | Bullet |
|---|---|
| `.214` | *Fixed a crash when a GrowthBook feature evaluates to null, and a bug where a malformed flag payload could wipe the cached feature flags* |
| `.214` | *Fixed feature flags going stale in long-running sessions after the OAuth token rotates* |

This doc belongs in `44_telemetry` because the GrowthBook layer is the **control plane for telemetry
and for most other remotely-tunable behaviour** in Claude Code. `Ke(gateName, default)` is what
decides whether an experiment is on, and the ground truth's own worked example
(`getMaxSubagentSpawnDepth` reading `tengu_hazel_trellis`, `_GROUND_TRUTH_verified_anchors.md` §2) is a
direct consumer. A `null` returned from this layer, or a wiped cache, changes behaviour everywhere.

---

## 0. Both scoping anchors for the first bullet are decoys

The scoping pass proposed `gate_error` (220=1 / 193=0) at `:317450` and `feature_disabled` (220=3 /
193=0), plus `gate_denied` / `gate_skip` from the new-gate list. **None of them is the GrowthBook fix.**
Verified by reading every 2.1.220 site:

| Literal | 220 sites | What they actually are |
|---|---|---|
| `gate_denied` | `:317446`, `:529664` | `$e("agent_observer_delivery", "gate_denied")` — the **agent-observer delivery** gate; and `trigger: "auto_gate_denied"` on a permission-mode change |
| `gate_error` | `:317450` | `$e("agent_observer_delivery", "gate_error")` — same observer subsystem |
| `gate_skip` | `:158808`, `:158848` | `$e("org_memory_credential", "gate_skip")` / `"renewal_gate_skip"` — **org memory credentials** |
| `feature_disabled` | `:320533`, `:321314`, `:333750` | a stream/tool error-reason enum member, unrelated to flags |
| `feature_flag_writes` | `:345194` | a member of the **auto-mode dangerous-action taxonomy** (a long alphabetical list between `external_system_writes` and `git_destructive` at `:345193-345195`) — a *classifier category name*, not a telemetry gate |
| `tengu_otel_*` | **none** | `grep -c 'tengu_otel'` is **220=0 / 193=0**. No such gate exists in either bundle. |

`_raw_asset_diff_193_to_220.md` lists `feature_disabled`, `feature_flag_writes`, `gate_denied`,
`gate_error`, `gate_skip` in its "NEW feature gates / telemetry event names" block. Its own header
warns it is provenance-only; these five are the clearest demonstration of why. Four of them are event
*sub-names* in unrelated subsystems and one is a security-classifier category.

The same file's "new env vars" block lists eleven `OTEL_*` names. All are carryover:

```
OTEL_METRICS_EXPORTER        7 / 5      OTEL_LOG_USER_PROMPTS         6 / 6
OTEL_LOGS_EXPORTER           9 / 6      OTEL_LOG_TOOL_DETAILS         3 / 3
OTEL_TRACES_EXPORTER         7 / 6      OTEL_METRIC_EXPORT_INTERVAL   3 / 3
OTEL_EXPORTER_OTLP_PROTOCOL 11 / 11     CLAUDE_CODE_OTEL_FLUSH_TIMEOUT_MS     2 / 2
                                        CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS  4 / 4
```

They appear "new" because 2.1.220 registered them in the typed env accessor table (`:24360-24400`),
where 2.1.193 read them as bare `process.env.X`. **In the whole telemetry surface, exactly one env
var is genuinely new: `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` (220=2 / 193=0).**

The real anchors for this bullet, found by reading the GrowthBook module instead:

```
source: "payload"                              1 / 0
source: "disk"                                 1 / 0
source: "fallback"                              2 / 0
e === null ? t : e                              1 / 0
skipped value-less entries                      2 / 0
skipped malformed experiment entries            2 / 0
processRemoteEvalPayload                        5 / 1
getFeatureValueWithSource_CACHED_MAY_BE_STALE   1 / 0
preserveLoggedExposures                         4 / 0
preservePendingExposures                        5 / 0
```

`getFeatureValueWithSource_CACHED_MAY_BE_STALE` being 1/0 is the tell: the resolution function was
**rewritten**, not patched.

---

## 1. The null-feature crash

### 1.1 The three-line fix

```javascript
// ============================================
// coalesceNullFeatureValue - a null flag value falls back to the caller's default
// Location: cli_inner_pretty.js:156630-156632
// ============================================

// ORIGINAL (for source lookup):
function zXi(e, t) {
  return e === null ? t : e;
}

// READABLE (for understanding):
function coalesceNullFeatureValue(value, defaultValue) {
  return value === null ? defaultValue : value;      // strict === null, NOT == null
}

// Mapping: zXi→coalesceNullFeatureValue
```

Three call sites: `:156643` (the async resolver), `:156659` (payload path), `:156663` (disk path).

### 1.2 The rewritten resolver

```javascript
// ============================================
// getFeatureValueWithSource - flag resolution with a five-way provenance taxonomy
// Location: cli_inner_pretty.js:156651-156669
// ============================================

// ORIGINAL (for source lookup):
function $no(e, t) {
  let r = mVr();
  if (r && e in r) return { value: r[e], source: "override" };
  let n = Jer();
  if (n && e in n) return { value: n[e], source: "override" };
  if (!sie() && !lIg()) return { value: t, source: "disabled" };
  if (Tst.has(e)) Mno(e);
  let o = Gde.get(e);
  if (o !== void 0) return { value: zXi(o, t), source: "payload" };
  try {
    let i = xt(),
      s = i.cachedGrowthBookFeatures?.[e];
    if (s !== void 0) return (Dtu(e, i), { value: zXi(s, t), source: "disk" });
  } catch {}
  return { value: t, source: "fallback" };
}
function Ke(e, t) {
  return $no(e, t).value;
}

// READABLE (for understanding):
function getFeatureValueWithSource(featureKey, defaultValue) {
  let envOverrides = getEnvFeatureOverrides();
  if (envOverrides && featureKey in envOverrides) return { value: envOverrides[featureKey], source: "override" };
  let configOverrides = getGrowthBookConfigOverrides();
  if (configOverrides && featureKey in configOverrides) return { value: configOverrides[featureKey], source: "override" };

  if (!isGrowthBookEnabled() && !isDiskCacheAllowedWithTelemetryOff())
    return { value: defaultValue, source: "disabled" };

  if (experimentAssignments.has(featureKey)) recordExposure(featureKey);   // exposure logging

  let liveValue = livePayloadValues.get(featureKey);
  if (liveValue !== undefined)
    return { value: coalesceNullFeatureValue(liveValue, defaultValue), source: "payload" };

  try {
    let config = getConfig();
    let diskValue = config.cachedGrowthBookFeatures?.[featureKey];
    if (diskValue !== undefined) {
      recoverExperimentAssignmentFromDisk(featureKey, config);
      return { value: coalesceNullFeatureValue(diskValue, defaultValue), source: "disk" };
    }
  } catch {}

  return { value: defaultValue, source: "fallback" };
}
function getFeatureValue_CACHED_MAY_BE_STALE(featureKey, defaultValue) {
  return getFeatureValueWithSource(featureKey, defaultValue).value;
}

// Mapping: $no→getFeatureValueWithSource, Ke→getFeatureValue_CACHED_MAY_BE_STALE,
//          zXi→coalesceNullFeatureValue, mVr→getEnvFeatureOverrides (:156432),
//          Jer→getConfigFeatureOverrides (:156459, STUBBED), sie→isGrowthBookEnabled (:156576),
//          lIg→isDiskCacheAllowedWithTelemetryOff (:156579), Tst→experimentAssignments,
//          Mno→recordExposure (:156481), Gde→livePayloadValues, xt→getConfig,
//          Dtu→recoverExperimentAssignmentFromDisk (:156400)
```

> **Both override tiers are dead code in the shipped bundle — and were already dead in 2.1.193.**
> `Jer()` (`:156459-156461`) is `function Jer() { return; }`. `mVr()` (`:156432-156443`) is
> `if (qXi) return wst; return ((qXi = !0), wst);` **followed by an unreachable block** that would
> have parsed `CLAUDE_INTERNAL_FC_OVERRIDES` — `wst` is only ever assigned `null` (`:156724`), so
> `mVr()` always returns `null` and `if (r && e in r)` can never be true. Downstream,
> `iIg` (`getGrowthBookConfigOverrides`, `:156472`) returns `Jer() ?? {}` = `{}`,
> `aIg` (`clearGrowthBookConfigOverrides`, `:156478`) returns `undefined`, and `sIg` (`:156475`) is
> also a stub. 2.1.193 is identical: `KMt` at `:147182-147185 (193)` returns `fxi` (declared `null`
> at `:147464 (193)`) and `YMt` at `:147195-147197 (193)` is `function YMt() { return; }`.
> `CLAUDE_INTERNAL_FC_OVERRIDES` is 220=4 / 193=2 — a literal that survives only in unreachable code
> and a debug string. So in practice the ladder has **three** live tiers (`disabled`, `payload`,
> `disk`) plus the `fallback`, and the `"override"` source label is unreachable. Carryover, and worth
> knowing before anyone tries to force a flag with that env var.

The 2.1.193 original:

```javascript
// ORIGINAL (2.1.193, for source lookup) — cli_inner_pretty.js:147332-147347 (193):
function it(e, t) {
  let n = KMt();
  if (n && e in n) return n[e];
  let r = YMt();
  if (r && e in r) return r[e];
  if (!mG()) return t;
  if (vIe.has(e)) swn(e);
  else qMt.add(e);
  if (Xq.has(e)) return Xq.get(e);
  try {
    let o = Lt().cachedGrowthBookFeatures?.[e];
    return o !== void 0 ? o : t;
  } catch {
    return t;
  }
}
```

### `Algorithm: five sources in priority order, and why null is special-cased twice`

**What it does:** answers `Ke("tengu_something", default)` from the highest-priority source that has
an opinion, and guarantees the caller never receives `null` when it asked for a typed default.

**How it works:**
1. **Env overrides** (`mVr`, `:156432`) — `source: "override"`. **Unreachable in the shipped build**
   (see the note above); the code shape is retained for internal builds.
2. **Config overrides** (`Jer`, `:156459`) — also `"override"`, and also stubbed. Two distinct
   mechanisms share one source label because from a consumer's point of view they are the same thing:
   someone forced this value.
3. **Kill switch** — `!isGrowthBookEnabled() && !isDiskCacheAllowedWithTelemetryOff()` →
   `source: "disabled"`. Note this is a **two-condition** check. `lIg` (`:156579-156581`) is
   `Z.CLAUDE_CODE_GB_DISK_CACHE_WHEN_TELEMETRY_OFF && !Z.DISABLE_GROWTHBOOK && V0e() && Dc()`, i.e.
   "telemetry is off but the operator still wants disk-cached flags applied". 2.1.193 had only
   `if (!mG()) return t;` at `:147337 (193)`, so the disk cache was unreachable with telemetry off.
4. **Exposure logging** happens *before* the value is read (`:156657`), and only when this key has an
   experiment assignment. 2.1.193 also queued non-experiment keys into a pending set
   (`else qMt.add(e)` at `:147339 (193)`); 2.1.220 drops that branch.
5. **Live payload** (`Gde`) — `source: "payload"`.
6. **Disk cache** (`config.cachedGrowthBookFeatures`) — `source: "disk"`, and reading it also calls
   `recoverExperimentAssignmentFromDisk`, so a session started from cache can still log correct
   experiment exposures.
7. **`source: "fallback"`** — nobody knew.

**Why `=== null` and not `== null`?** Because `undefined` and `null` mean different things here, and
conflating them would break the ladder:

- `undefined` from `Gde.get(key)` means **"this key is not in the live payload"** — control must fall
  through to the disk cache. That is why the guard is `if (o !== void 0)`.
- `null` means **"the key IS in the payload and its value is null"** — an explicit remote value.
  Falling through to disk would be wrong (the server has spoken); returning `null` is what crashed
  callers.

So the two checks are complementary and must be distinct: `!== void 0` decides *whether this source
answers*, `=== null` decides *what a source that answered with null yields*. A single `?? default`
would have collapsed them and reintroduced the fall-through bug in reverse.

**Why does a `null` crash at all?** Every consumer passes a typed default and treats the result as
that type. `Ke("tengu_hazel_trellis", 3)` returning `null` flows into
`typeof r === "number" && Number.isInteger(r) && r >= 1 ? r : ZDu` — that particular caller happens to
validate and survives. Callers that do not validate — `Ke(gate, false)` used in a boolean position is
tolerant, but `Ke(gate, "2026-07-25")` fed to `Date.parse(null)`, or an object-valued config
dereferenced with `.field` — are the crash sites. The fix is placed at the *producer* precisely
because auditing every one of hundreds of consumers is not tractable.

**Why return `{value, source}` instead of just fixing the null?** The source label is what makes the
flag layer debuggable. "The gate says false" is ambiguous between five very different situations
(operator override, telemetry off, server said false, stale disk cache, never fetched). `Ke` discards
the label for the ~all callers that do not care, so the cost is one property read.

**Also tightened at `:156402-156408`** (`recoverExperimentAssignmentFromDisk`): an experiment
assignment is only recovered when
`typeof r.experimentId === "string" && typeof r.variationId === "number"` **and** the cached value
still deep-equals the current feature value. 2.1.193's payload-side equivalent accepted `l?.key &&
a.variationId !== void 0` (`:147245 (193)`) — which admits a `null` variationId (`null !== undefined`)
and any truthy non-string key. The same "null slipped through a loose check" pattern, in a second
place.

---

## 2. The cache wipe

**Bullet:** *a bug where a malformed flag payload could wipe the cached feature flags.*

### 2.1 The 2.1.193 failure, read

```javascript
// ORIGINAL (2.1.193, for source lookup) — cli_inner_pretty.js:147229-147258 (193):
async function mxi(e) {
  let t = e.getPayload();
  if (!t?.features || Object.keys(t.features).length === 0) return !1;
  (vIe.clear(), own.clear());                                   // <-- (1) CLEARS FIRST, before validation
  let n = {},
    r = [];
  for (let [o, s] of Object.entries(t.features)) {
    let i = s;
    if (i === null || typeof i !== "object") {
      r.push(`${o}:${i === null ? "null" : typeof i}`);
      continue;
    }
    if ("value" in i && !("defaultValue" in i)) n[o] = { ...i, defaultValue: i.value };
    else n[o] = i;
    if (i.source === "experiment" && i.experimentResult) {
      let { experimentResult: a, experiment: l } = i;
      if (l?.key && a.variationId !== void 0) vIe.set(o, { experimentId: l.key, variationId: a.variationId });
    }
    if (i.source !== void 0 && i.source !== "defaultValue" && i.source !== "unknownFeature") own.add(o);
  }
  if (r.length > 0) {
    if (!I5r) ((I5r = !0), ke(Error(`processRemoteEvalPayload: skipped non-object features [${r.join(", ")}]`)));
    if (Object.keys(n).length === 0) return !1;                 // <-- (2) counts ENTRIES, not usable values
  }
  (await e.setPayload({ ...t, features: n }), Xq.clear());       // <-- (3) CLEARS the live map, then refills
  for (let [o, s] of Object.entries(n)) {
    let i = "value" in s ? s.value : s.defaultValue;
    if (i !== void 0) Xq.set(o, i);                             // <-- entries with no value are silently dropped
  }
  return !0;
}
```

Three defects combine into the wipe:

1. `vIe.clear(), own.clear()` runs at the top, unconditionally. Any early `return !1` below leaves the
   experiment map and exposure set empty.
2. The bail-out guard counts `Object.keys(n).length` — *surviving object-shaped entries* — not entries
   that actually carry a value. A payload of 200 well-formed-but-value-less entries has `r.length === 0`,
   so the guard is not even evaluated.
3. `Xq.clear()` then runs, and the refill loop skips every entry whose `value`/`defaultValue` is
   `undefined`. **`Xq` ends up empty or near-empty.** `gxi()` (`:147260-147269 (193)`) then persists
   `Object.fromEntries(Xq)` into `cachedGrowthBookFeatures` — so the *disk* cache is wiped too, and the
   damage survives restarts until the next successful fetch.

### 2.2 The 2.1.220 stage-then-commit rewrite

```javascript
// ============================================
// processRemoteEvalPayload - validate into staging maps, then commit atomically
// Location: cli_inner_pretty.js:156504-156561 (excerpted at the changed parts)
// ============================================

// ORIGINAL (for source lookup):
async function Otu(e) {
  let t = e.getPayload();
  if (!t?.features || Object.keys(t.features).length === 0) return !1;
  let r = new Map(),
    n = new Set(),
    o = {},
    i = [],
    s = [];
  for (let [c, u] of Object.entries(t.features)) {
    let d = u;
    if (d === null || typeof d !== "object") {
      i.push(`${c}:${d === null ? "null" : typeof d}`);
      continue;
    }
    if ("value" in d && !("defaultValue" in d)) o[c] = { ...d, defaultValue: d.value };
    else o[c] = d;
    if (d.source === "experiment" && d.experimentResult) {
      let { experimentResult: p, experiment: f } = d;
      if (typeof f?.key === "string" && typeof p.variationId === "number")
        r.set(c, { experimentId: f.key, variationId: p.variationId });
      else s.push(`${c}:key=${typeof f?.key},variationId=${typeof p.variationId}`);
    }
    if (d.source !== void 0 && d.source !== "defaultValue" && d.source !== "unknownFeature") n.add(c);
  }
  ...
  let a = new Map(),
    l = [];
  for (let [c, u] of Object.entries(o)) {
    let d = "value" in u ? u.value : u.defaultValue;
    if (d !== void 0) a.set(c, d);
    else (r.delete(c), n.delete(c), delete o[c], l.push(c));
  }
  if (l.length > 0 && !WXi)
    ((WXi = !0),
      xe(new Lr(`processRemoteEvalPayload: skipped value-less entries [${l.join(", ")}]`,
                "processRemoteEvalPayload: skipped value-less entries")));
  if (a.size === 0) return !1;
  if ((await e.setPayload({ ...t, features: o }), R$e !== e)) return !1;
  Tst.clear();
  for (let [c, u] of r) Tst.set(c, u);
  Lno.clear();
  for (let c of n) Lno.add(c);
  Gde.clear();
  for (let [c, u] of a) Gde.set(c, u);
  return !0;
}

// READABLE (for understanding):
async function processRemoteEvalPayload(client) {
  let payload = client.getPayload();
  if (!payload?.features || Object.keys(payload.features).length === 0) return false;

  let stagedAssignments = new Map(),          // -> experimentAssignments
    stagedExposureKeys = new Set(),           // -> nonDefaultFeatureKeys
    stagedFeatures = {},                      // the payload we will hand back to the SDK
    nonObjectEntries = [],
    malformedExperiments = [];

  for (let [key, raw] of Object.entries(payload.features)) {
    if (raw === null || typeof raw !== "object") {
      nonObjectEntries.push(`${key}:${raw === null ? "null" : typeof raw}`);
      continue;
    }
    stagedFeatures[key] = "value" in raw && !("defaultValue" in raw) ? { ...raw, defaultValue: raw.value } : raw;
    if (raw.source === "experiment" && raw.experimentResult) {
      let { experimentResult, experiment } = raw;
      if (typeof experiment?.key === "string" && typeof experimentResult.variationId === "number")
        stagedAssignments.set(key, { experimentId: experiment.key, variationId: experimentResult.variationId });
      else
        malformedExperiments.push(`${key}:key=${typeof experiment?.key},variationId=${typeof experimentResult.variationId}`);
    }
    if (raw.source !== undefined && raw.source !== "defaultValue" && raw.source !== "unknownFeature")
      stagedExposureKeys.add(key);
  }
  // …two log-once diagnostics for nonObjectEntries / malformedExperiments…

  let stagedValues = new Map(), valueLessKeys = [];
  for (let [key, entry] of Object.entries(stagedFeatures)) {
    let value = "value" in entry ? entry.value : entry.defaultValue;
    if (value !== undefined) stagedValues.set(key, value);
    else {                                      // drop it from EVERY staging structure, coherently
      stagedAssignments.delete(key);
      stagedExposureKeys.delete(key);
      delete stagedFeatures[key];
      valueLessKeys.push(key);
    }
  }
  // …log-once diagnostic for valueLessKeys…

  if (stagedValues.size === 0) return false;                          // GUARD 1: nothing usable -> abort
  await client.setPayload({ ...payload, features: stagedFeatures });
  if (activeGrowthBookClient !== client) return false;                // GUARD 2: instance swapped -> abort

  experimentAssignments.clear();  for (let [k, v] of stagedAssignments)  experimentAssignments.set(k, v);
  nonDefaultFeatureKeys.clear();  for (let k of stagedExposureKeys)      nonDefaultFeatureKeys.add(k);
  livePayloadValues.clear();      for (let [k, v] of stagedValues)       livePayloadValues.set(k, v);
  return true;
}

// Mapping: Otu→processRemoteEvalPayload, Tst→experimentAssignments, Lno→nonDefaultFeatureKeys,
//          Gde→livePayloadValues, R$e→activeGrowthBookClient (:156784), xe→reportError,
//          WXi/jXi/GXi→log-once latches (:156785-156787)
```

### `Algorithm: stage-then-commit, with two abort gates and coherent drops`

**What it does:** replaces the live flag state only when a payload has produced at least one usable
value, and only if the client instance that produced it is still the active one.

**How it works:**
1. **Nothing live is touched during validation.** `stagedAssignments` / `stagedExposureKeys` /
   `stagedValues` are fresh local containers. Compare 2.1.193's `vIe.clear(), own.clear()` on line
   *four* of the function.
2. **Coherent drops.** When an entry has no value, it is removed from *all four* staging structures —
   assignments, exposure keys, the SDK payload object, and (by never being added) the value map. In
   2.1.193 an entry could be recorded as an experiment assignment in `vIe` while being skipped from
   `Xq`, leaving an exposure that could be logged for a value that does not exist.
3. **Guard 1: `stagedValues.size === 0`.** This counts *usable values*, closing the exact hole in
   2.1.193's `Object.keys(n).length === 0`. A payload of 200 value-less entries now aborts.
4. **Guard 2: `activeGrowthBookClient !== client` after the `await`.** `setPayload` is asynchronous;
   during it a re-init (`vxe` → `Qer` → `R$e = null`, `:156709-156725`) may have replaced the client.
   Committing then would install one client's payload into another's globals. `R$e` is re-checked in
   four places in this module (`:156554`, `:156751`, `:156753`, `:156857`, `:156859`) — a consistent
   pattern, so the re-entrancy hazard was understood and handled systematically.
5. **Commit is clear-then-refill per structure**, but now every source map is fully populated, so the
   window in which a reader could observe an empty map is a synchronous span with no `await` in it.
6. Only after `processRemoteEvalPayload` returns `true` do the callers persist to disk —
   `:156754` and `:156860` both read `if (t) (Mtu(), $tu(), Xer.emit())`. So a rejected payload never
   reaches `cachedGrowthBookFeatures`.

**Why not validate-then-clear without staging?** Because the value extraction and the drop are the
*same pass*: you cannot know an entry is value-less until you look for its value, and once you know,
three other structures need the key removed. Staging is what makes "drop from everywhere" expressible
without mutating live state.

**Diagnostics, and their cost model.** Three log-once latches (`jXi`, `GXi`, `WXi` at `:156785-156787`)
guard three distinct messages:
`skipped non-object features` (carryover, 1/1), `skipped malformed experiment entries` (new, 2/0),
`skipped value-less entries` (new, 2/0). Log-once matters because this function runs on every flag
refresh — every 6 hours (`cIg()` returns `21600000`, `:156726-156728`) for the life of the process. A
systematically malformed payload would otherwise log on every cycle. The latches are reset in `Qer`
(`:156721`) but **only when `!e?.preserveLoggedExposures`** — so a re-init that preserves exposures
also preserves the "already warned" state, keeping the two consistent.

**Key insight:** the pre-existing `null`-entry guard (`skipped non-object features`, 1/1) makes a
literal diff report this bullet as unchanged. The change is *where the clears happen relative to the
validation* — a code-motion fix, invisible to any string-based probe.

---

## 3. Flags going stale after OAuth rotation (.214)

**Anchor:** `tengu_gb_eval_authed_enable` — 220=1 (`:156378`) / 193=0.

Two independent pieces of work land under this bullet.

### 3.1 A rotation-aware refresh cycle

```javascript
// ============================================
// refreshFeatureFlagsPeriodically - now detects an OAuth identity change before refreshing
// Location: cli_inner_pretty.js:156733-156758
// ============================================

// ORIGINAL (for source lookup):
async function Nno() {
  if (!sie()) return;
  try {
    if (Pno) {
      let { checkAndRefreshOAuthTokenIfNeeded: r } = await Promise.resolve().then(() => (Eo(), kY));
      await r().catch((i) => {});
      let n = q8(),
        o = n.error ? void 0 : n.headers.Authorization;
      if (o !== void 0 && o !== KXi) {
        let i = xt().oauthAccount,
          s = i?.accountUuid === YXi && i?.organizationUuid === XXi;
        if (!s) L1e();
        vxe({ preserveLoggedExposures: s });
        return;
      }
    }
    let e = await lN();
    if (!e) return;
    if ((await e.refreshFeatures({ skipCache: !0 }), e !== R$e)) return;
    let t = await Otu(e);
    if (e !== R$e) return;
    if (t) (Mtu(), $tu(), Xer.emit());
  } catch (e) {
    xe(_n(e));
  }
}

// READABLE (for understanding):
async function refreshFeatureFlagsPeriodically() {
  if (!isGrowthBookEnabled()) return;
  try {
    if (wasInitializedWithAuth) {
      let { checkAndRefreshOAuthTokenIfNeeded } = await import("./auth");
      await checkAndRefreshOAuthTokenIfNeeded().catch(() => {});      // rotate first, swallow failures
      let authResult = getAuthHeaders(),
        authHeader = authResult.error ? undefined : authResult.headers.Authorization;
      if (authHeader !== undefined && authHeader !== initialAuthHeader) {   // the token CHANGED
        let account = getConfig().oauthAccount;
        let sameIdentity = account?.accountUuid === initialAccountUuid
                        && account?.organizationUuid === initialOrgUuid;
        if (!sameIdentity) clearMemoizedIdentityState();               // different user -> drop memoised identity
        reinitializeGrowthBook({ preserveLoggedExposures: sameIdentity });
        return;                                                        // re-init supersedes this refresh
      }
    }
    let client = await getGrowthBookClient();
    if (!client) return;
    await client.refreshFeatures({ skipCache: true });
    if (client !== activeGrowthBookClient) return;
    let ok = await processRemoteEvalPayload(client);
    if (client !== activeGrowthBookClient) return;
    if (ok) { flushRecoveredExposures(); persistFeatureFlagsToDisk(); notifyFlagSubscribers(); }
  } catch (e) { reportError(normalizeError(e)); }
}

// Mapping: Nno→refreshFeatureFlagsPeriodically, sie→isGrowthBookEnabled, Pno→wasInitializedWithAuth,
//          q8→getAuthHeaders, KXi/YXi/XXi→initialAuthHeader/initialAccountUuid/initialOrgUuid (:156791-156793),
//          vxe→reinitializeGrowthBook (:156695), Qer→teardownGrowthBook (:156709),
//          L1e→clearMemoizedIdentityState (:106755), lN→getGrowthBookClient,
//          Otu→processRemoteEvalPayload, Mtu→flushRecoveredExposures (:156497),
//          $tu→persistFeatureFlagsToDisk (:156563), Xer→flagSubscribers, R$e→activeGrowthBookClient
```

> Naming caveat on `L1e` (`:106755-106757`): I read it and it is
> `((jGr = null), (UGr = null), MJt.cache.clear?.(), D1e.cache.clear?.())` — it nulls a memoised
> value plus its in-flight promise and clears two memo caches, in the **account/identity** module
> around `:106752-106760`, not in the GrowthBook module. `clearMemoizedIdentityState` is the honest
> description of what the body does; I did not trace every consumer of `MJt` / `D1e`, so treat the
> name as a description rather than a recovered identifier.

2.1.193's counterpart, `awn` at `:147414-147426 (193)`, is the same function **minus the entire
`if (Pno) { … }` block and minus the `Mtu()` call**:

```javascript
// ORIGINAL (2.1.193) — cli_inner_pretty.js:147414-147426 (193):
async function awn() {
  if (!mG()) return;
  try {
    let e = await wR();
    if (!e) return;
    if ((await e.refreshFeatures({ skipCache: !0 }), e !== Khe)) return;
    let t = await mxi(e);
    if (e !== Khe) return;
    if (t) (gxi(), ert.emit());
  } catch (e) {
    ke(eo(e));
  }
}
```

### `Decision: re-initialise on rotation, and branch on whether the identity changed`

**What it does:** keeps remotely-evaluated flags valid across an OAuth token rotation in a session
that outlives the token.

**How it works:**
1. `wasInitializedWithAuth` (`Pno`) gates the whole block. A GrowthBook client created without auth
   has no bearer identity to invalidate.
2. `checkAndRefreshOAuthTokenIfNeeded()` is awaited **before** reading the header, and its rejection is
   swallowed. The goal is "give the token a chance to rotate", not "require it to". If refresh fails,
   the header is unchanged and the normal path runs.
3. `authHeader !== initialAuthHeader` compares against the header captured at init
   (`KXi`, `:156791`). This detects rotation without parsing or trusting JWT claims.
4. `sameIdentity` compares `accountUuid` **and** `organizationUuid` against the values captured at init
   (`YXi`, `XXi`). Both must match.
5. `if (!sameIdentity) clearMemoizedIdentityState()` (`L1e`, `:106755`) — on an account switch the
   memoised identity/account state is dropped first, so the re-init below re-derives GrowthBook's user
   attributes from the new account rather than the memoised old one.
6. `reinitializeGrowthBook({ preserveLoggedExposures: sameIdentity })`. Same identity → keep the
   exposure ledger, so an experiment is not double-counted as a fresh exposure merely because a token
   rotated. Different identity → drop it, so user B does not inherit user A's exposures.
7. `return` — re-init performs its own fetch; continuing would refresh the client that is being torn
   down.

**Why compare the raw header rather than an expiry timestamp?** The header is what GrowthBook's
remote-eval request actually carries. Comparing it detects *any* cause of change — refresh, re-login,
a different credential file, an env override — with one string compare and no clock dependency.

**Why is rotation an invalidation event at all?** Remote evaluation happens **server-side**: the
client posts attributes and the server returns evaluated values. Those values are scoped to the
identity in the bearer token. After rotation the previously-fetched payload was evaluated for a
credential that no longer applies, and (in the account-switch case) possibly for a different
organisation entirely. Re-evaluating rather than continuing to serve the old payload is the only
correct behaviour, and it is why `Qer`'s teardown is so thorough (`:156709-156725`: destroys the
client, clears five maps/sets, clears two memo caches, resets three log-once latches, nulls the env
override cache).

**Trade-off:** the check runs only on the 6-hour timer, so between rotation and the next tick the
session serves flags evaluated under the old credential. A rotation-triggered hook would be tighter;
polling on an interval that already exists is far cheaper and the staleness window is bounded by the
one thing the function is already scheduled by.

### 3.2 A dark-launched authenticated remote-eval endpoint

```javascript
// ============================================
// installAuthedRemoteEvalHook - routes GrowthBook remote-eval through an authenticated endpoint
// Location: cli_inner_pretty.js:156372-156399
// ============================================

// ORIGINAL (for source lookup):
function Ltu() {
  if (Itu) return;
  Itu = !0;
  let e = $Oe.fetchRemoteEvalCall;
  $Oe.fetchRemoteEvalCall = async (t) => {
    let { host: r, clientKey: n, payload: o, headers: i } = t;
    if (!Ke("tengu_gb_eval_authed_enable", !1)) return e(t);
    try {
      await Dy();
    } catch {}
    let s = {};
    try {
      let a = q8();
      if (!a.error) s = a.headers;
    } catch {}
    try {
      let a = await TUr().fetch(`${r}/api/eval-authed/${n}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...i, ...s },
        body: JSON.stringify(o),
      });
      if (!a.ok) return (xe(Error("GrowthBook eval-authed returned non-ok; falling back to /api/eval")), e(t));
      return a;
    } catch {
      return (xe(Error("GrowthBook eval-authed fetch threw; falling back to /api/eval")), e(t));
    }
  };
}

// READABLE (for understanding):
function installAuthedRemoteEvalHook() {
  if (hookInstalled) return;                        // idempotent: monkey-patch exactly once
  hookInstalled = true;
  let originalFetchRemoteEval = growthBookModule.fetchRemoteEvalCall;
  growthBookModule.fetchRemoteEvalCall = async (req) => {
    let { host, clientKey, payload, headers } = req;
    if (!getFeatureValue_CACHED_MAY_BE_STALE("tengu_gb_eval_authed_enable", false))
      return originalFetchRemoteEval(req);          // gate OFF by default -> vanilla /api/eval
    try { await checkAndRefreshOAuthTokenIfNeeded(); } catch {}     // fresh token before we send it
    let authHeaders = {};
    try { let r = getAuthHeaders(); if (!r.error) authHeaders = r.headers; } catch {}
    try {
      let res = await getFetch()(`${host}/api/eval-authed/${clientKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers, ...authHeaders },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        reportError(Error("GrowthBook eval-authed returned non-ok; falling back to /api/eval"));
        return originalFetchRemoteEval(req);
      }
      return res;
    } catch {
      reportError(Error("GrowthBook eval-authed fetch threw; falling back to /api/eval"));
      return originalFetchRemoteEval(req);
    }
  };
}

// Mapping: Ltu→installAuthedRemoteEvalHook, Itu→hookInstalled, $Oe→growthBookModule,
//          Dy→checkAndRefreshOAuthTokenIfNeeded, q8→getAuthHeaders, TUr→getFetch,
//          Ke→getFeatureValue_CACHED_MAY_BE_STALE, xe→reportError
```

### `Decision: a flag-gated monkey-patch that fails back to the unauthenticated path`

**What it does:** lets Claude Code fetch *authenticated* remote-eval results, so the server can
evaluate against the caller's real identity rather than only the attributes the client volunteers.

**How it works:**
1. `hookInstalled` makes installation idempotent — the patch replaces a module-level function, so a
   second call would wrap the already-wrapped version and double the fallback chain.
2. **The gate is checked inside the patched function, per call**, not at install time. So the endpoint
   can be turned on mid-session by a flag refresh, with no restart.
3. **The gate is itself a GrowthBook flag** — read through `Ke`, which resolves from the *previous*
   payload (or disk, or the `false` default). This is deliberately circular and it works because the
   default is off: the first fetch always uses the vanilla endpoint, and only a payload that already
   said "on" can promote subsequent fetches.
4. Token refresh precedes header capture, so the bearer sent is fresh.
5. Both failure modes — non-2xx and thrown — log once and **return `originalFetchRemoteEval(req)`**.
   The new endpoint can be entirely unavailable and flag evaluation still works.
6. Header merge order `{ "Content-Type", ...requestHeaders, ...authHeaders }` puts auth **last**, so
   the caller cannot accidentally override `Authorization` with a stale value.

**Why a monkey-patch?** `fetchRemoteEvalCall` is the vendored GrowthBook SDK's own extension point for
exactly this. Patching it means the SDK's caching, retry and payload handling are all preserved; a
parallel fetch path would duplicate them.

**Why is the gate default `false`?** Because a bug here silently breaks *all* remote flag evaluation —
including the flag that controls this very code path. Shipping it off, with a fallback on every error,
means the worst case is "nothing changed". This is a **dark launch**: the same pattern as
`tengu_hazel_trellis` in `_GROUND_TRUTH_verified_anchors.md` §2, where a shipped default is
remotely tunable without a release. The `.214` bullet describes the *symptom* fixed by §3.1; §3.2 is
the longer-term mechanism, present but disabled in 2.1.220.

**Key insight:** two fixes for one bullet at two different levels. §3.1 detects that the identity
changed and rebuilds the flag state (shipped, active). §3.2 removes the reason identity drift matters
by authenticating the evaluation itself (shipped, gated off). Reading only the changelog you would see
one bugfix; the bundle shows a bugfix plus a staged replacement for the whole approach.

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
- `getFeatureValue_CACHED_MAY_BE_STALE` (`Ke`, `:156667`) - the ubiquitous gate reader; thin wrapper over `$no`
- `getFeatureValueWithSource` (`$no`, `:156651`) - five-source resolution returning `{value, source}`
- `coalesceNullFeatureValue` (`zXi`, `:156630`) - `value === null ? default : value`
- `getFeatureValueAsync` (`Ftu`, `:156633`) - the async resolver; third `zXi` call site at `:156643`
- `recoverExperimentAssignmentFromDisk` (`Dtu`, `:156400`) - strict `typeof` validation before recovery
- `processRemoteEvalPayload` (`Otu`, `:156504`) - stage-then-commit with two abort gates
- `persistFeatureFlagsToDisk` (`$tu`, `:156563`) - writes `cachedGrowthBookFeatures` / `cachedExperimentData`
- `flushRecoveredExposures` (`Mtu`, `:156497`) - logs exposures recovered from the disk cache
- `refreshFeatureFlagsPeriodically` (`Nno`, `:156733`) - 6-hour cycle with the rotation check
- `getFlagRefreshIntervalMs` (`cIg`, `:156726`) - `21600000`
- `reinitializeGrowthBook` (`vxe`, `:156695`) / `teardownGrowthBook` (`Qer`, `:156709`)
- `installAuthedRemoteEvalHook` (`Ltu`, `:156372`) - gated `/api/eval-authed/` monkey-patch
- `isGrowthBookEnabled` (`sie`, `:156576`) / `isDiskCacheAllowedWithTelemetryOff` (`lIg`, `:156579`)
- `getEnvFeatureOverrides` (`mVr`, `:156432`) - `CLAUDE_INTERNAL_FC_OVERRIDES`; **unreachable body**, always returns `null`
- `getConfigFeatureOverrides` (`Jer`, `:156459`) - stub, always `undefined`; carryover from `YMt` `:147195 (193)`
- `recordExposure` (`Mno`, `:156481`) - logs one experiment exposure, de-duplicated via `Rno`
- `clearMemoizedIdentityState` (`L1e`, `:106755`) - called on an account switch before re-init
- `activeGrowthBookClient` (`R$e`, `:156784`) - the re-entrancy sentinel checked at `:156554`, `:156751`, `:156753`
- `livePayloadValues` (`Gde`), `experimentAssignments` (`Tst`), `nonDefaultFeatureKeys` (`Lno`), `pendingExposures` (`Dno`) - declared `:156831-156832`
