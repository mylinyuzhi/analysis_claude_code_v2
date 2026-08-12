# Bedrock cross-region inference-profile preference

## Scope and evidence

The 2.1.224 changelog adds `ANTHROPIC_BEDROCK_REGION_PREFIX`. The variable has no occurrence in the
2.1.220 bundle and has nine target-bundle sites: declaration/settings allowlists, environment
propagation, and the model-resolution consumer. The behavioral delta is concentrated in
`resolvePreferredBedrockRegionPrefix` (`Ffr`, `cli_inner_pretty.js:97473-97476`) and the expanded
`resolveBedrockModelIds` (`afy`, `cli_inner_pretty.js:97738-97776`).

The pre-existing 2.1.220 resolver `UZh` (`cli_inner_pretty.js:100415-100435`, 2.1.220) always used
`inferBedrockCrossRegionPrefix` (`FCe`, `cli_inner_pretty.js:100098-100106`, 2.1.220). The target keeps
that derived prefix as its fallback, but makes the configured prefix the first lookup preference.

## Resolution pipeline

```text
AWS region ──> derived prefix ───────────────┐
                                             ├─> hardcoded per-family fallback IDs
explicit prefix ──> GovCloud guard ─> chosen┘
                              │
                              └─> profile discovery ─> preferred match ─> any matching profile
                                                        │
                                                        └─> fallback ID + warning
```

### Preferred-prefix selection

**What it does:** Selects the prefix used to construct and discover Bedrock cross-region inference
profiles while preserving the mandatory GovCloud partition behavior.

**How it works:**
1. `inferBedrockCrossRegionPrefix` maps `us-*` to `us`, `eu-*` to `eu`, `ap-*` to `apac`, and all
   other commercial regions to `global`; `us-gov-*` maps to `us-gov`.
2. `resolvePreferredBedrockRegionPrefix` checks GovCloud first. A `us-gov-*` region always produces
   `us-gov`, even when the environment variable requests another prefix.
3. For other partitions, the explicit `ANTHROPIC_BEDROCK_REGION_PREFIX` value wins when present.
4. With no explicit value, resolution is behaviorally identical to 2.1.220 because it returns the
   region-derived prefix.

**Why this approach:**
- It is backward compatible: existing installations retain the previous region-derived selection.
- A preference is less disruptive than a hard override because the later discovery stage can fall
  back when the account has no matching profile.
- The GovCloud guard avoids constructing commercial-partition profile IDs for a partition whose
  routing and compliance boundary cannot safely be overridden by this convenience setting.
- A stricter alternative would fail whenever the preferred profile is absent. That would provide a
  residency-like guarantee, but it would make an availability preference a startup-breaking policy.

**Key insight:** The environment variable does not replace region inference globally. It inserts one
preferred prefix between partition safety and the existing derived fallback.

### Discovery-aware per-model resolution

**What it does:** Resolves a Bedrock provider ID for every Claude model family, preferring profiles
with the requested prefix without making the whole model catalog unavailable when one is missing.

**How it works:**
1. `resolveBedrockModelIds` obtains the current AWS region, the chosen prefix, and the legacy derived
   prefix.
2. `buildProviderModelIds` (`Nnn`, `cli_inner_pretty.js:97728-97736`) builds a complete fallback map
   from the static model catalog. For Bedrock it rewrites direct `anthropic.*` IDs, or replaces an
   existing cross-region prefix, with the chosen prefix.
3. `getCachedBedrockInferenceProfiles` (`Pnn`, `cli_inner_pretty.js:97326-97329`) returns a process-level
   promise so concurrent callers share the same paginated AWS discovery request.
4. For each model family, `selectBedrockInferenceProfile` first searches for a profile containing the
   model ID and starting with the preferred prefix. If none exists, it accepts any profile containing
   the model ID. If discovery has no match, the static fallback ID remains.
5. When the explicit prefix differs from the region-derived prefix, every family that resolves to a
   different prefix is collected. One aggregate warning names the number and model IDs rather than
   emitting a warning per family.

**Why this approach:**
- Resolution is per model because Bedrock accounts can expose different cross-region profiles for
  different model families; an all-or-nothing decision would unnecessarily hide available models.
- Discovery is cached because `ListInferenceProfiles` is paginated network I/O with an eight-second
  abort bound. Sharing its promise reduces startup latency and avoids duplicate AWS calls.
- The fallback-to-any-profile branch prioritizes model availability. The trade-off is explicit: the
  configured prefix is a routing preference, not a residency guarantee, and the warning says so.
- Aggregating fallback warnings prevents startup notification spam while retaining enough detail to
  diagnose account/profile configuration.

**Key insight:** The clever branch is `preferred match || any match || static ID`: it preserves the
full model map while making preference failures observable instead of fatal.

### Discovery failure and warning policy

**What it does:** Keeps Bedrock usable when inference-profile discovery is unavailable, while making
an unchecked explicit preference visible to the operator.

**How it works:**
1. Profile discovery uses `ListInferenceProfiles` with `SYSTEM_DEFINED`, follows pagination, filters
   to Anthropic profile IDs, and applies an eight-second abort signal per request in
   `listBedrockInferenceProfiles` (`Zpy`, `cli_inner_pretty.js:97331-97351`).
2. If discovery throws, the error is logged and the complete static fallback map is returned.
3. If discovery returns no profiles, the same fallback map is returned.
4. In either degraded case, a warning is emitted only when the chosen prefix differs from the
   region-derived prefix. It explains that no availability check occurred and recommends either
   enabling the corresponding profiles or unsetting the variable if requests return HTTP 400.
5. With no explicit preference, degradation remains quiet beyond the discovery error because the
   fallback is the legacy region-derived behavior.

**Why this approach:**
- Model discovery is advisory, not a prerequisite for making a Bedrock request. Treating it as fatal
  would turn a control-plane outage or restricted IAM permission into total client unavailability.
- Silent fallback would conceal a likely configuration mismatch. Conditional warning avoids alarming
  users who did not opt into the new behavior.
- Constructing the preferred IDs even without discovery supports accounts where invocation is allowed
  but profile listing is blocked by IAM.

**Key insight:** The resolver separates confidence from capability: lack of discovery removes the
availability check, not the operator's requested routing preference.

## Critical branches

- `AWS region starts with us-gov-` -> force `us-gov`; ignore the explicit commercial prefix.
- no environment preference -> use the 2.1.220 region-derived behavior.
- preferred profile exists for a model -> use it.
- only a differently prefixed profile exists -> use it and include that model in the aggregate warning.
- no discovered profile for a model -> retain the constructed static ID.
- discovery fails or is empty -> return the complete static map; warn only for an explicit divergent
  preference.

## Operational boundaries

- The setting controls model identifier selection, not the AWS SDK client region. Both the Bedrock
  control-plane and runtime clients still use the resolved AWS region.
- The value is not validated against a closed enum at this layer. Incorrect prefixes can survive into
  constructed IDs when discovery is unavailable, which is why the HTTP-400 remediation is explicit.
- A successful preferred-prefix match proves that a profile was listed, not that the setting is an
  enforceable data-residency policy.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getCachedBedrockInferenceProfiles` (`Pnn`) - shares the discovery promise across callers.
- `listBedrockInferenceProfiles` (`Zpy`) - paginated, timeout-bounded AWS profile discovery.
- `selectBedrockInferenceProfile` (`cgt`) - preferred-prefix match followed by any-prefix fallback.
- `inferBedrockCrossRegionPrefix` (`dgt`) - legacy AWS-region-to-prefix mapping.
- `resolvePreferredBedrockRegionPrefix` (`Ffr`) - explicit preference with a GovCloud guard.
- `buildProviderModelIds` (`Nnn`) - complete static provider-ID fallback map.
- `resolveBedrockModelIds` (`afy`) - discovery, per-family selection, and warning orchestration.
