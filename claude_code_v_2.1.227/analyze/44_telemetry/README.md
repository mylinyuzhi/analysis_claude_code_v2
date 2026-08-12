# 44_telemetry — Telemetry, usage accounting, and feature evaluation

This module re-derives the full 2.1.220 telemetry scope from the 2.1.227 bundle. It covers both
telemetry planes, OpenTelemetry export and correlation, local usage attribution, gateway spend
metering, and GrowthBook feature evaluation. The most important post-2.1.220 changes are:

- 2.1.222 makes MCP attribution request-scoped instead of sticky across the rest of a session.
- 2.1.225 adds a gateway spend-limit response contract whose error identifies the cap period, reset
  time, and administrator message while standard unified-limit headers drive the existing UI.
- 2.1.227 refreshes an expired OAuth login before GrowthBook reads subscription-bearing user
  attributes, preventing Max users from being evaluated as if their tier were absent.

The older 2.1.212–2.1.220 hardening remains present: one four-way content cap, explicit
`Content-Length` on OTLP HTTP bodies, Prometheus-only unit suppression, staged feature-payload
commit, rotation-aware GrowthBook reinitialization, cumulative SSE output-token assignment, and
trace/log correlation.

## Documents

- [telemetry_feature_flags_usage_and_export.md](telemetry_feature_flags_usage_and_export.md) — deep
  analysis of event planes, exporters, correlation, usage metering and attribution, gateway caps,
  and GrowthBook lifecycle.

## Version findings

| Version | Finding | Evidence |
|---|---|---|
| 2.1.222 | MCP usage attribution is cleared after the consuming request | `cli_inner_pretty.js:367806-367808`, `369423-369431`; absent from the equivalent 2.1.220 loop |
| 2.1.225 | Gateway spend caps expose reset/period/operator detail and unified-limit headers | `cli_inner_pretty.js:960177-960290` |
| 2.1.227 | GrowthBook performs a bounded pre-init OAuth refresh before reading tier attributes | `cli_inner_pretty.js:617746-617803`, `618113-618155` |
| retained | OTel truncation, trace adoption, exporters, and transport repair remain intact | `cli_inner_pretty.js:129857-130063`, `462462-462912` |

## Scope and confidence

All control-flow claims are **Verified** in the 2.1.227 bundle. The MCP repair is additionally
**Cross-checked** against the 2.1.220 bundle at `:337916-337917` and `:509988-511799`. The exact
release attribution of the gateway and OAuth fixes comes from the supplied changelog; their current
mechanisms are directly verified.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `emitOtelEvent` (`Tu`) - correlated third-party OTel event emission.
- `initializeTelemetry` (`gUb`) - exporter/provider construction and shutdown ownership.
- `clearConsumedMcpAttribution` (`V6d`) - one-request MCP attribution reset.
- `collectUsageData` (`jCn`) - `/usage` session, plan, behavior, and source aggregation.
- `createGrowthBookClient` (`sRa.createClient`) - refresh-before-attributes client initialization.
- `createGatewaySpendMeter` (`m9h`) - gateway precheck, response metering, and cap response path.
