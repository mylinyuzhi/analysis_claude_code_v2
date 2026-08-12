# Catalogue and provider architecture

## Architectural map

The model layer separates three identities that must not be conflated:

1. a canonical catalogue id such as `claude-opus-5`;
2. a provider-facing id such as a Bedrock inference profile or Vertex model name; and
3. a user-facing selector such as `opus`, `default`, `best`, or a concrete custom string.

`Msc` stores canonical metadata. `Otg` validates it and derives both lookup directions. `nfy` and
`ofy` then rebuild the older provider configuration objects needed by networking code, while the
resolution layer interprets selectors and organization policy. This separation is why a provider id
can change without rewriting every capability predicate.

### Validated catalogue construction

**What it does:** Turns the hand-maintained catalogue into a safe, lazily cached runtime index.

**How it works:**
1. `parseModelCatalog` (`Otg`, `cli_inner_pretty.js:9056-9071`) runs the loose schema at
   `9114-9213` with `safeParse`.
2. A validation failure selects `Mtg`, an empty schema-version-zero catalogue, rather than exposing a
   partially parsed object.
3. It indexes every entry by canonical `id`.
4. It lowercases every non-null provider id and builds the reverse provider-id-to-canonical-id map.
5. A provider id claimed by two distinct entries throws immediately; silently choosing one would make
   billing, capability, and policy behavior depend on catalogue order.
6. `getParsedModelCatalog` (`y8i`, `9073-9076`) stores the result in the shared resettable lazy cache.

Edge cases are intentional: schemas are `.loose()` so a newer catalogue can carry fields an older
binary ignores, but invalid required fields discard the whole catalogue. Duplicate provider aliases
are stricter because reverse lookup would otherwise be ambiguous.

**Why this approach:**
- A single validated object prevents provider tables, picker labels, prices, and capabilities from
  drifting independently.
- Fail-empty is safer than accepting malformed launch data, while the collision throw protects an
  invariant that cannot be repaired locally.
- The alternative—repeating per-model conditionals throughout the bundle—was the architecture the
  2.1.220 report showed had already been replaced.
- Loose forward compatibility trades early detection of misspelled optional keys for smoother schema
  evolution.

**Key insight:** Validation protects shape, but the two derived indexes protect identity. The reverse
index is the critical bridge from provider traffic back to policy and capability metadata.

### Capability and pricing lookup

**What it does:** Provides uniform feature and cost metadata for canonical and provider-specific IDs.

**How it works:**
1. `getModelCatalogEntry` (`hv`, `9087-9088`) performs canonical lookup.
2. `getModelPricingTier` (`_8i`, `9090-9094`) accepts either an inline price object or a named tier.
3. `hasModelCapability` (`y2`, `9096-9100`) strips `[1m]`, reads the catalogue entry, and returns
   `true` only when the capability token is present.
4. If the id is not baked in, capability lookup delegates to a runtime hook, allowing custom/server
   models to participate without mutating the baked object.
5. Callers distinguish `true` from `undefined`; absence is not treated as an affirmative capability.

**Why this approach:**
- Tokenized capabilities keep launch differences declarative.
- Named price tiers deduplicate identical economics while allowing exceptional inline data.
- A runtime hook supports gateways and future catalogue injection, at the cost of a three-state result
  that callers must handle carefully.

**Key insight:** `undefined` means “catalogue has no affirmative proof,” not necessarily “the remote
model can never do this.” Safety-sensitive callers therefore default conservatively.

## Exact 2.1.220-to-2.1.227 catalogue delta

The catalogue literal is almost byte-for-byte stable after identifier remangling. The meaningful
differences are:

- Sonnet 5 adds `effort_cost_index: {low: 0.47, medium: 0.74, high: 1, xhigh: 2.41, max: 5.59}`.
- Opus 4.7 removes `fast_mode` from its capability list.
- Opus 4.8 adds `{0.72, 0.9, 1, 1.65, 1.88}`.
- Opus 5 adds `{0.67, 0.76, 1, 1.6, 1.7}`.
- Fable 5 adds `{0.6, 0.77, 1, 1.74, 1.91}`.

No other field differs in the compared literal. This resolves a discrepancy recorded by the 2.1.220
report: its changelog said Opus 4.7 was removed from fast mode, but that build still carried the
capability. The removal is actually present by 2.1.227. The exact intermediate build is not inferable
from the supplied endpoints.

### Effort cost-index projection

**What it does:** Estimates the relative token cost of choosing a different effort level.

**How it works:**
1. `getEffortCostRatio` (`dTi`, `cli_inner_pretty.js:764300-764307`) first requires that the model
   supports configurable effort.
2. It canonicalizes the model and reads its catalogue `effort_cost_index`.
3. It selects both the requested effort coefficient and the model's current/default coefficient.
4. Missing curves or coefficients produce `null`, suppressing an estimate rather than fabricating one.
5. Otherwise it returns `requested / baseline`; `Ual` formats the ratio for the UI.

**Why this approach:**
- Ratios communicate a useful trade-off without claiming they are literal billing multipliers.
- Keeping curves beside model metadata lets each model encode a different response to effort.
- Returning no estimate for old/custom models is less misleading than applying a universal curve.

**Key insight:** These coefficients are comparative UI metadata. Actual usage billing still uses
reported tokens and the speed-aware price record described in `thinking_effort_and_fast_mode.md`.

## Compatibility projection and provider channels

### Catalogue-to-provider adapter

**What it does:** Recreates legacy camel-case provider configuration exports from catalogue rows.

**How it works:**
1. `projectProviderIds` (`nfy`, `cli_inner_pretty.js:97494-97507`) maps snake-case provider keys to
   camel-case runtime keys and normalizes absent optional channels to `null`.
2. Gateway falls back to the first-party id only when the catalogue omits its own id.
3. Eager-input-streaming metadata is copied only when present.
4. `buildProviderModelConfigs` (`ofy`, `97509-97520`) walks the fixed 16-row compatibility map.
5. Missing catalogue rows throw a redacted internal error; named public exports additionally require
   non-null Bedrock, Vertex, Foundry, and Anthropic-on-AWS ids through `QZ` (`97522-97531`).
6. Mythos remains a deliberate exception: its catalogue row nulls third-party ids, while the
   hand-built compatibility object at `97570-97581` populates them.

**Why this approach:**
- It permits a staged migration: catalogue-native consumers get richer metadata while older network
  paths keep their established object shape.
- Explicit throws make a launch omission fail during initialization instead of much later in a request.
- The compatibility layer is duplication, but bounded duplication is cheaper than rewriting every
  provider client in one release.

**Key insight:** The adapter is not another source of truth. With the Mythos exception, it is generated
from canonical rows and acts as an invariant check on launch completeness.

### Provider selection precedence

**What it does:** Chooses the API backend and, where necessary, a per-model secondary backend.

**How it works:**
1. `getApiProvider` (`Wn`, `cli_inner_pretty.js:97625-97640`) gives gateway mode absolute priority.
2. Otherwise environment switches are evaluated in order: Bedrock, Foundry, Claude Platform on AWS,
   Claude Platform on Google Cloud, Mantle, Vertex, then first party.
3. `getProviderForModel` (`Ab`, `97654-97667`) can choose Mantle as a secondary provider when the
   primary is Bedrock and the model form or provider table makes Mantle appropriate.
4. `isClaudePlatformProvider` (`CV`, `97669-97671`) groups the AWS and Google Cloud Claude Platform
   channels for capability and identity policy, without pretending their authentication is identical.

**Why this approach:**
- Deterministic precedence makes conflicting environment switches reproducible.
- Per-model secondary routing allows a provider migration without changing the session-wide setting.
- Grouping by platform capability avoids repeating AWS/Google checks, while authentication and request
  signing remain separate.

**Key insight:** “Provider” is both a session default and a model-specific routing result. Consumers
that need the latter must call `Ab(model)` rather than caching `Wn()`.

## Claude Platform on Google Cloud

This eighth channel is retained from 2.1.220. It is selected by
`CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD`, mapped from `anthropic_google_cloud` catalogue fields, grouped
with Claude Platform on AWS by `CV`, and considered first-party-capability-compatible by `Yh`/`gq`.
It is not first-party for direct-host/pricing decisions and it does not sign with AWS credentials.
Most modern catalogue rows populate the channel; older models deliberately carry `null`.

### Provider grouping decision

**What it does:** Shares product semantics across Claude Platform channels without sharing transport
or billing assumptions.

**How it works:**
1. Provider selection returns `anthropicGoogleCloud` as its own enum member.
2. `CV` groups it only with `anthropicAws`.
3. `Yh` treats first party, Claude Platform, and gateway as using first-party model-id semantics.
4. `gq` broadens capability trust to first party, Claude Platform, Foundry, and Mantle.
5. `Mnn` keeps first-party pricing narrower: only direct first party uses it.

**Why this approach:**
- Product/catalogue compatibility is not the same dimension as credentials, host identity, or price.
- A single boolean “is first party” would over-authorize assumptions on at least one of those axes.
- Multiple small predicates cost readability but prevent security and billing rules from inheriting an
  overly broad classification.

**Key insight:** Provider taxonomies are purpose-specific. The same backend can be “first-party-like”
for capabilities and third-party for authentication or price.

## Aliases and canonical identity

### Provider-dependent alias resolution

**What it does:** Maps family aliases to the best supported canonical model for the active provider.

**How it works:**
1. `resolveCatalogAlias` (`Bsc`, `cli_inner_pretty.js:9102-9108`) reads the alias entry.
2. It prefers a `per_provider` row and falls back to the alias default.
3. In 2.1.227, `opus` defaults to Opus 5 but remains Opus 4.6 on Foundry and Opus 4.7 on gateways.
4. `sonnet` defaults to Sonnet 5 but remains Sonnet 4.5 on Bedrock/Vertex/Foundry/Mantle and 4.6 on
   Anthropic AWS/gateway.
5. `latest_per_family` remains distinct: it answers “newest family member,” not “provider default.”

**Why this approach:**
- Provider availability is not synchronized, so a universal alias would select models a backend does
  not yet serve.
- Keeping provider differences in catalogue data makes launches auditable.
- The trade-off is that `opus` is intentionally not a globally stable concrete id.

**Key insight:** Family identity is stable; its concrete provider projection is not. Policy code that
means “any Opus” must retain the family alias until availability is evaluated.

### Canonical normalization

**What it does:** Collapses dated, regional, provider-specific, and overridden model IDs to one stable
catalogue identity.

**How it works:**
1. `normalizeCanonicalModelId` (`gF`, `cli_inner_pretty.js:109369-109399`) lowercases input and first
   tries the reverse catalogue index.
2. For Bedrock regional prefixes, it retries by replacing the region prefix with `us`.
3. It then recognizes known families by contained id patterns, in newest-first order.
4. Legacy Claude 3 forms are handled explicitly.
5. As a final generic operation it strips a trailing eight-digit date.
6. `resolveModelWithOverrides` (`Co`, `109424-109435`) reverses trusted override maps first, unwraps
   Bedrock application inference profiles next, then delegates to `gF`.

**Why this approach:**
- Exact reverse indexing is fast and unambiguous for catalogue-known provider IDs.
- Ordered pattern fallback handles gateway decoration and provider prefixes the catalogue cannot list
  exhaustively.
- Pattern matching risks false positives, so recognized built-ins are explicitly enumerated before the
  conservative date-strip fallback.

**Key insight:** Canonicalization is the join key for capability, policy, UI, and pricing. The order is
therefore exact mapping first, heuristic mapping second—not the reverse.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `parseModelCatalog` (`Otg`) - validates and indexes catalogue identity.
- `hasModelCapability` (`y2`) - catalogue/runtime capability probe.
- `buildProviderModelConfigs` (`ofy`) - compatibility projection.
- `getApiProvider` (`Wn`) - provider precedence.
- `resolveCatalogAlias` (`Bsc`) - provider-aware family alias.
- `normalizeCanonicalModelId` (`gF`) - provider-to-canonical normalization.
- `getEffortCostRatio` (`dTi`) - relative effort estimate.
