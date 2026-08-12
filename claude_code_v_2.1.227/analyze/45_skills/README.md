# Skills and plugins

- [`skills_runtime.md`](skills_runtime.md) - Complete 2.1.227 pipeline: metadata normalization,
  multi-scope discovery, precedence, dynamic/conditional activation, plugin ingestion, lazy disclosure,
  authorization, inline context layers, and forked/background execution.

- [`plugin_archive_and_marketplace_policy.md`](plugin_archive_and_marketplace_policy.md) - HTTPS zip
  plugin sources, integrity and redirect controls, root-shape validation, digest versioning, and managed
  GitHub owner wildcards.
- [`plugin_usability_and_prompt_audit.md`](plugin_usability_and_prompt_audit.md) - refresh-on-miss install,
  cache-safe immediate activation, Desktop compatibility warnings, root skills, and `prompt-audit`.

Other plugin fixes from 2.1.221–2.1.225 are inventoried in the changelog ledger. Intermediate attribution
is limited to changelog evidence because the analysis corpus contains the 2.1.220 and 2.1.227 endpoint
bundles, while the runtime document above analyzes the complete current endpoint directly.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `parseSkillFrontmatterFields` (`RGo`) - Normalizes skill metadata.
- `loadSkillDirectorySet` (`Dob`) - Loads and merges filesystem skill sources.
- `authorizeSkillInvocation` (`KIn`) - Enforces invocation policy before prompt expansion.
- `executeForkedSkill` (`grS`) - Runs forked skills inline-waiting or in the background.
- `downloadPluginArchive` (`_pd`) - bounded HTTPS download and digest verification.
- `installPluginArchive` (`AH_`) - extraction, root selection, shape validation, and atomic promotion.
- `isMarketplaceSourceAllowed` (`BZu`) - strict policy matching including owner wildcards.
- `refreshMarketplaceOnCatalogMiss` (`hFr`) - retries a stale named marketplace once.
- `activatePluginsAfterInstall` (`JOm`) - opportunistic current-session activation.
