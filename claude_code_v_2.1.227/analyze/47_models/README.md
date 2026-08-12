# 47_models — Model catalogue, resolution, policy, and fast mode

This module re-derives the full 2.1.220 models scope from the 2.1.227 bundle. It covers the declarative
model catalogue, provider projections, the Claude Platform on Google Cloud channel, canonical model
identity, default and organization policy, gateway discovery, the model picker, thinking/effort
selection, fast-mode availability and pricing, and model choice for subagents and teammates.

The catalogue architecture introduced before 2.1.220 remains intact: one validated snake-case object
feeds canonical metadata and the older camel-case provider exports. The important 2.1.227 changes sit
at its boundaries. Opus 4.7 no longer advertises fast mode; four frontier entries carry new
per-effort cost curves; gateway discovery accepts provider-prefixed Claude IDs; reverse
`modelOverrides` lookup refuses unknown canonical keys; restricted family aliases step down within
their family; host-supplied model settings override stale disk policy; a live thinking toggle can
revive a session whose startup template was disabled; and fast-mode credit exhaustion is surfaced on
the stream once per turn.

## Documents

- [catalogue_and_provider_architecture.md](catalogue_and_provider_architecture.md) — catalogue
  validation, dual indexes, compatibility projection, provider selection, aliases, canonicalization,
  Claude Platform on Google Cloud, pricing, and exact catalogue deltas.
- [resolution_policy_discovery_and_picker.md](resolution_policy_discovery_and_picker.md) — default
  attribution, managed enforcement, gateway discovery, safe override reversal, host precedence,
  family-preserving step-down, warning propagation, and the picker pipeline.
- [thinking_effort_and_fast_mode.md](thinking_effort_and_fast_mode.md) — live thinking restoration,
  request serialization, mechanically-disabled effort clamping, effort-cost estimates, fast-mode
  eligibility, cooldowns, credit rejection, and speed-sensitive cost accounting.

## Version findings

| Version | Finding | Evidence |
|---|---|---|
| 2.1.220 baseline | Declarative catalogue, eight provider channels, organization defaults, model picker, and fast-mode state machine already exist | `2.1.220:14008-14661`, `100310-100348`, `109455-109560`, `110784-110936`, `119946-120721` |
| 2.1.221 | A live thinking toggle now converts a stale disabled startup template to adaptive thinking; mechanically disabled requests clamp unsupported high effort | `cli_inner_pretty.js:118481-118486`, call `916077`; `528931-528938`, `529678-529711` |
| 2.1.221 | Fast-mode credit rejection now injects an immediate once-per-turn notification | `cli_inner_pretty.js:107606-107661`, `107715-107746` versus `2.1.220:109549-109560` |
| 2.1.222 | Restricted subagent and teammate family aliases step down to the newest permitted model in the requested family | `cli_inner_pretty.js:108908-108918`, `475539-475616`, `549953-549999` |
| 2.1.222 | Host model-selection fields take precedence over stale local managed settings | `cli_inner_pretty.js:59526-59540`, `59569-59599`, `59659-59737` |
| 2.1.223 | Gateway discovery accepts provider-prefixed IDs and reverse overrides ignore non-Anthropic keys | `cli_inner_pretty.js:108103-108173`, `109408-109435` versus `2.1.220:109914`, `100449-100459` |
| 2.1.223 | Restricted workflow, skill, command, and resumed-agent choices emit substitution warnings through the shared resolver | `cli_inner_pretty.js:475577-475616`, `549967-549999` and callers documented below |
| verified bundle delta | Opus 4.7 loses `fast_mode`; four frontier models gain `effort_cost_index` curves | exact catalogue diff: `cli_inner_pretty.js:8829-8962` versus `2.1.220:14316-14428` |
| retained | Provider-dependent aliases, Claude Platform on Google Cloud, speed-sensitive pricing, Fable/Mythos gates, and picker ordering remain | `cli_inner_pretty.js:8998-9023`, `97494-97671`, `107937-108043`, `119260-119525` |

The 2.1.227 Fable subscription-tier correction is implemented upstream in authenticated feature
evaluation and is analyzed in `44_telemetry`. This module documents the downstream picker/credit gate
that consumes that decision, but does not duplicate the feature-flag analysis.

## Scope and confidence

Catalogue, provider, resolution, picker, thinking, and fast-mode control flow are **Verified** in the
2.1.227 bundle. Deltas are **Cross-checked** against 2.1.220. The declarative catalogue and provider
architecture are also consistent with the readable 2.1.88 source, although later model entries and
policy refinements have no 2.1.88 twin. Exact attribution to 2.1.221–2.1.223 follows the supplied
changelog; the catalogue-only changes are deliberately labeled as unattributed bundle deltas.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `parseModelCatalog` (`Otg`) - validates the baked catalogue and builds canonical/provider indexes.
- `normalizeCanonicalModelId` (`gF`) - collapses provider-specific and dated IDs to stable identities.
- `resolveModelWithOverrides` (`Co`) - safely reverses managed/provider override mappings.
- `resolveEnforcedAvailableModel` (`Hyo`) - applies managed allowlists without crossing trust tiers.
- `resolvePermittedFamilyAlias` (`yF`) - preserves a restricted alias's requested family when possible.
- `buildModelPickerOptions` (`Vhs`) - assembles, filters, annotates, and orders picker rows.
- `resolveInteractiveThinkingConfig` (`gEu`) - reconciles live state with the startup thinking template.
- `handleFastModeOverageRejection` (`huu`) - surfaces credit exhaustion and updates durable state.
