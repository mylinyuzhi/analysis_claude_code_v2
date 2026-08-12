# Authentication and providers in 2.1.227

- [`auth_provider_runtime.md`](auth_provider_runtime.md) - full current-build analysis of provider and
  credential precedence, API-key helpers, OAuth refresh and 401 recovery, subscription-aware feature
  initialization, managed login, AWS credentials, host-managed transport, mTLS, keep-alive, and gateway
  certificate pinning.
- [`bedrock_region_prefix.md`](bedrock_region_prefix.md) - explicit cross-region inference-profile
  preference, discovery-aware fallback, warnings, and the distinction between preference and residency.

The full runtime has been re-derived from the 2.1.227 bundle. The 2.1.220 report is used only as a
comparison baseline; current behavior is not inferred from it. In particular, the new report traces the
2.1.227 refresh-before-feature-attributes ordering that prevents an expired startup token from dropping
the user's subscription tier during feature evaluation.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `getApiProvider` (`Wn`) - resolves global provider precedence.
- `getAuthTokenSource` (`tT`) - reports bearer credential source and availability.
- `recoverOAuth401` (`ZIS`) - recovers without replacing a user-owned environment token.
- `refreshOAuthTokenLocked` (`FIa`) - cross-process, race-rechecked token rotation.
- `createGrowthBookClient` (`sRa.createClient`) - refreshes auth before capturing subscription attributes.
- `getGrowthBookUserAttributes` (`aRa`) - supplies subscription and rate-limit tier to feature evaluation.
- `getDefaultAwsProviderChain` (`wV`) - caches AWS resolution per profile and region.
- `filterHostManagedProviderEnvironment` (`Wdd`) - protects host-owned routing and transport.
- `loadMTLSClientMaterial` (`apr`) - reloads same-path certificate rotations by content.
- `resolveBedrockModelIds` (`afy`) - discovers profiles and resolves every model-family ID.
- `resolvePreferredBedrockRegionPrefix` (`Ffr`) - applies the explicit preference except in GovCloud.
- `selectBedrockInferenceProfile` (`cgt`) - prefers a matching requested prefix, then any matching profile.
- `inferBedrockCrossRegionPrefix` (`dgt`) - derives the legacy prefix from the AWS region.
