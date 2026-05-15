# `/effort max` Denial Fix (v2.1.101)

## What changed

v2.1.94 baseline `modelSupportsMaxEffort` used **allowlist** semantics:
only Opus 4.6 (and ant-resolved models) supported `max` effort.
Everything else returned false — including unknown model strings (e.g.
a fresh Anthropic release that the client hasn't been updated for) or
third-party models without a capability override.

v2.1.101 flipped the function to **blocklist** semantics: return false
only for the **known legacy/non-max-capable** models, default to true
otherwise. This means future Anthropic models, third-party adapters
without overrides, and any unforeseen ID gets the benefit of the doubt
on `max` support.

The bug fix was visible to users as `/effort max` getting silently
downgraded to `high` on:
- Newly-released Anthropic models (between client releases)
- Third-party adapter model strings that didn't match `opus-4-6`
- Internal experimental model IDs

After 2.1.101, those models all get `max` correctly.

## Source: v2.1.88 baseline — the allowlist (pre-fix)

`src/utils/effort.ts:51-65`:

```typescript
// @[MODEL LAUNCH]: Add the new model to the allowlist if it supports 'max' effort.
// Per API docs, 'max' is Opus 4.6 only for public models — other models return an error.
export function modelSupportsMaxEffort(model: string): boolean {
  const supported3P = get3PModelCapabilityOverride(model, 'max_effort')
  if (supported3P !== undefined) {
    return supported3P
  }
  if (model.toLowerCase().includes('opus-4-6')) {
    return true
  }
  if (process.env.USER_TYPE === 'ant' && resolveAntModel(model)) {
    return true
  }
  return false
}
```

The `// @[MODEL LAUNCH]:` comment captures the maintenance burden: this
function had to be **manually edited** with each new model release. If a
new Opus tier shipped before a client update, that model would have
`modelSupportsMaxEffort = false` — and `/effort max` would silently
downgrade to `high`.

The third-party override path was an escape hatch for Bedrock/Vertex/
Foundry — they could declare capability via JSON. But for **first-party
Anthropic** models, the only "support" check was the hardcoded
substring match.

## Source: v2.1.112 obfuscated chunks — the blocklist (post-fix)

```javascript
// ============================================
// modelSupportsMaxEffort - blocklist-driven: deny only known-bad
// Location: chunks.80.mjs:2701-2706
// ============================================

// ORIGINAL (for source lookup):
function Ct6(q) {
    let K = $a(q, "max_effort");
    if (K !== void 0) return K;
    if (q.toLowerCase().includes("haiku")) return !1;
    return !c8z.has(l8z(q))
}

// READABLE (for understanding):
function modelSupportsMaxEffort(model) {
  // Third-party adapters can override (Bedrock, Vertex, Foundry).
  const overrideValue = get3PModelCapabilityOverride(model, "max_effort");
  if (overrideValue !== undefined) return overrideValue;

  // Haiku models never support max effort.
  if (model.toLowerCase().includes("haiku")) return false;

  // Blocklist check: return true UNLESS the model is in the explicit
  // "doesn't support max" set. New/unknown models default to true.
  return !MAX_EFFORT_BLOCKLIST.has(stripModelVersionSuffix(model));
}

// Mapping: Ct6→modelSupportsMaxEffort, $a→get3PModelCapabilityOverride,
//          c8z→MAX_EFFORT_BLOCKLIST, l8z→stripModelVersionSuffix
```

### The blocklist

```javascript
// ============================================
// MAX_EFFORT_BLOCKLIST - models known NOT to support max effort
// Location: chunks.80.mjs:2836
// ============================================

c8z = new Set([
  "claude-3-opus", "claude-3-sonnet", "claude-3-5-sonnet", "claude-3-7-sonnet",
  "claude-sonnet-4", "claude-sonnet-4-0", "claude-sonnet-4-5",
  "claude-opus-4", "claude-opus-4-0", "claude-opus-4-1", "claude-opus-4-5"
]);
```

Models NOT in the blocklist (and thus allowed `max`):
- `claude-opus-4-6` (the originally-supported Opus tier)
- `claude-opus-4-7` (the new Opus tier)
- `claude-sonnet-4-6` (the new Sonnet tier)
- `claude-haiku-4-5` (would be allowed by the blocklist check, but
  caught by the explicit `if (model.includes("haiku")) return false`)
- Any future Anthropic model ID (e.g. `claude-opus-4-8`, `claude-sonnet-5-0`)
- Any third-party model string that doesn't match the blocklist entries

### The stripper helper

```javascript
// ============================================
// stripModelVersionSuffix - canonicalize model ID for blocklist lookup
// Location: chunks.80.mjs:2694-2699
// ============================================

// ORIGINAL (for source lookup):
function l8z(q) {
    let K = q.toLowerCase(),
        _ = K.match(/claude-[a-z0-9-]+/),
        z = _ ? _[0] : K;
    return z = z.replace(/-v\d+(:\d+)?$/, ""),
           z = z.replace(/-\d{8}$/, ""), z
}

// READABLE (for understanding):
function stripModelVersionSuffix(model) {
  const lc = model.toLowerCase();
  // Extract just the "claude-…" portion (drops any vendor prefix).
  const match = lc.match(/claude-[a-z0-9-]+/);
  let id = match ? match[0] : lc;
  // Drop Bedrock-style "-v1" or "-v1:0" suffixes.
  id = id.replace(/-v\d+(:\d+)?$/, "");
  // Drop date suffixes like "-20251022".
  id = id.replace(/-\d{8}$/, "");
  return id;
}

// Mapping: l8z→stripModelVersionSuffix
```

The stripper is what makes the blocklist work across model-string
variants:
- `claude-3-5-sonnet-20240620` → `claude-3-5-sonnet` (in blocklist)
- `anthropic.claude-sonnet-4-5-v1:0` (Bedrock) → `claude-sonnet-4-5` (in blocklist)
- `claude-opus-4-6:0` → `claude-opus-4-6` (NOT in blocklist → allowed)
- `claude-opus-4-7-20251022` → `claude-opus-4-7` (NOT in blocklist → allowed)

## Why this approach

### Why the flip from allowlist to blocklist?

**What it does:** Inverts the default for unknown model strings. With
the allowlist, unknown → unsupported. With the blocklist, unknown →
supported.

**How it works:**
1. The third-party override path still wins if set (escape hatch for
   adapters).
2. Haiku is hard-coded as unsupported (none of the Haiku variants have
   `max` effort capability).
3. The fallback is a Set lookup. Set contains the known-bad models.

**Why this approach — the maintenance burden inversion:**

The allowlist required **adding** an entry for each new model that
supports `max`. The blocklist requires **removing or not adding** an
entry for each new model. The asymmetry is significant:

- **New Anthropic models** are usually capable enough to support `max`.
  The blocklist default-allows them — correct outcome.
- **New Anthropic models** that *don't* support `max` are rare (they'd
  be a regression). The blocklist requires explicit gating in those
  cases — a small maintenance debt.
- **Allowlist downside:** every new model that *does* support `max`
  requires a client update. Until that ships, users get the wrong
  behavior.
- **Blocklist downside:** if a new model *doesn't* support `max` and
  isn't in the blocklist, the API call will fail (the API itself does
  the canonical capability check; the client check is best-effort).

**The trade-off favors the blocklist** because:
1. New-model launches happen monthly; new-incompatible-model launches
   are rare.
2. The API will catch any blocklist gap with a clear error message.
3. Users on the latest client get the right behavior for the latest
   models with no manual sync.

### Why include Haiku as a hard-coded check before the blocklist?

**What:** `if (model.toLowerCase().includes("haiku")) return false`
runs **before** the blocklist Set lookup.

**Why:**
- Haiku models follow a different naming convention
  (`claude-haiku-4-5`, `claude-3-5-haiku`, `claude-3-haiku`, etc.) and
  enumerating them all would be brittle.
- Substring matching on `"haiku"` catches all Haiku variants including
  future releases.
- Haiku is fundamentally a different *class* of model (small, fast) and
  hasn't ever supported `max` effort.

**Trade-off:** A model named `haiku` that *did* support `max` (e.g.
some hypothetical `claude-haiku-pro-4`) would be wrongly excluded. The
team has accepted this — Haiku as a brand is committed to the
small/fast tier.

### Why the explicit `MAX_EFFORT_BLOCKLIST` contents?

The blocklist enumerates:
- `claude-3-opus`, `claude-3-sonnet`: legacy Opus 3 / Sonnet 3.
- `claude-3-5-sonnet`, `claude-3-7-sonnet`: Sonnet 3.5 / 3.7.
- `claude-sonnet-4`, `claude-sonnet-4-0`, `claude-sonnet-4-5`: Sonnet
  4.0 and 4.5 variants.
- `claude-opus-4`, `claude-opus-4-0`, `claude-opus-4-1`, `claude-opus-4-5`:
  Opus 4.0/4.1/4.5 variants.

**Notably absent:**
- `claude-opus-4-6`, `claude-opus-4-7`: these are the "thinking-capable"
  Opus tiers and support `max`.
- `claude-sonnet-4-6`: the new Sonnet tier that **does** support max
  (this is one of the 2.1.101 fix beneficiaries — pre-fix, the
  allowlist's `model.includes("opus-4-6")` would have rejected it).

The list is curated based on **API behavior**, not on capability
guesses. The team's source of truth is "what does the API return when
called with effort=max on this model?" — anything that errors goes in
the blocklist; anything that succeeds stays out.

### Why this is a 2.1.101 fix (not 2.1.94 or 2.1.111)?

The fix landed in 2.1.101 because:
- 2.1.94 had introduced the `medium → high` default change, which
  intensified API errors when `max` was requested but the model
  silently downgraded inconsistently.
- 2.1.101 was the architectural refactor pass for the effort system
  (other changes in 2.1.101 included compact memory leak fixes and
  /resume parallelism).
- Waiting until 2.1.111 (the xhigh launch) would have meant the bug
  affected `max` users on Sonnet 4.6 for 10+ versions.

The 2.1.101 fix sequence:
1. Identify the regression class: "models I think should support max
   are getting downgraded."
2. Inspect `modelSupportsMaxEffort`: the function uses an allowlist
   that doesn't include Sonnet 4.6.
3. Decide between adding Sonnet 4.6 to the allowlist or flipping to a
   blocklist.
4. The team chose the blocklist for the asymmetry reasons above —
   future-proofing was worth the small risk of a "wrong default."

## Cross-validation: v2.1.88 → v2.1.112

| Aspect | v2.1.88 | v2.1.112 | Δ |
|--------|---------|----------|---|
| `modelSupportsMaxEffort` semantics | Allowlist (`opus-4-6` + ant) | Blocklist (deny known legacy) | Flipped |
| Unknown model default | `false` (max denied) | `true` (max allowed) | Inverted |
| New-model behavior | Requires client update | Works immediately | Forward-compatible |
| Haiku check | Implicit (not in allowlist) | Explicit substring | Made explicit |
| Third-party override | Same | Same | Unchanged |
| ant-only path (`USER_TYPE=ant`) | Distinct branch | Folded into blocklist absence | Cleaner |
| String normalization | (none — direct substring) | `stripModelVersionSuffix` for Set lookup | New helper |
| `MAX_EFFORT_BLOCKLIST` constant | (didn't exist) | 11 model IDs | New |

## Why the downgrade path still matters

Even after the 2.1.101 fix, **silent downgrade** is still part of the
flow:

```javascript
// resolveAppliedEffort (chunks.80.mjs:2752)
if (A === "max" && !Ct6(q)) return "high";
```

If a model IS in the blocklist (or is Haiku, or the third-party
override says false), and the user requested `max`, the resolver
downgrades to `high`. This is correct — it preserves the user's
"thinking intent" while routing to what the model actually supports.

The 2.1.101 fix was specifically about **reducing false-positives of
the downgrade** — making sure models that *do* support max actually
get it. The downgrade itself is still the right behavior for the
genuinely-unsupported case.

## Related symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) - scoped diff index
> - [symbol_additions_unit_16.md](../00_overview/symbol_additions_unit_16.md) - new symbols from this unit

Key functions in this document:
- `modelSupportsMaxEffort` (Ct6) — blocklist-driven max gate; chunks.80.mjs:2701-2706
- `stripModelVersionSuffix` (l8z) — canonicalize for Set lookup; chunks.80.mjs:2694-2699
- `MAX_EFFORT_BLOCKLIST` (c8z) — claude-3-*, sonnet-4-0/4-5, opus-4-0/4-1/4-5; chunks.80.mjs:2836
- `get3PModelCapabilityOverride` ($a) — third-party adapter capability lookup
- `resolveAppliedEffort` (wy6) — the downgrade-on-unsupported routing; chunks.80.mjs:2746-2755
- `resolveModelId` (o5) — normalized model ID (strips date suffix)
