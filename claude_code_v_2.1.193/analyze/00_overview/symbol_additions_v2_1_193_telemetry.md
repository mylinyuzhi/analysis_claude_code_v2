# Symbol Additions — v2.1.193 — Telemetry / OTEL (NEW MODULE)

> These symbols route to **[symbol_index_infra_platform.md](./symbol_index_infra_platform.md)** (the **Telemetry** module is its home).
>
> Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Every line was re-derived in the live 193 bundle for this round; obfuscated names are re-mangled per build and are **never** assumed to carry across versions. Where a symbol is *carryover* (present in v2.1.183 under a different obf token), the 183 status is noted in the readable column. The headline NET-NEW symbols for this window are `dGi` (the response-redaction gate), the `assistant_response` emit inside `cSl`, and the `FZc` / managed-env registration of `OTEL_LOG_ASSISTANT_RESPONSES`.

## Module: Telemetry — `assistant_response` OTEL log event (NET-NEW 2.1.193)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cSl` | `recordApiRequestTelemetry` (emits `api_request` then NEW `assistant_response`) | cli_inner_pretty.js:468542 | function |
| `dGi` | `isAssistantResponseLoggingEnabled` (NET-NEW response-redaction gate) | cli_inner_pretty.js:195211 | function |
| `FZc` | `OTEL_LOG_ASSISTANT_RESPONSES` value (NET-NEW; `Fe.triBool()`) | cli_inner_pretty.js:36363 (decl) / 36424 (bind) | variable |

## Module: Telemetry — OTEL log emitter + redaction helpers (CARRYOVER, reused by the new event)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Jc` | `logOTelEvent` (carryover; 88 ancestor `logOTelEvent` events.ts:21) | cli_inner_pretty.js:195214 | function |
| `GNd` | `isUserPromptLoggingEnabled` (carryover; 88 ancestor events.ts:13) | cli_inner_pretty.js:195205 | function |
| `V1t` | `redactIfDisabled` (carryover; 88 ancestor events.ts:17) | cli_inner_pretty.js:195208 | function |
| `CD` | `truncateForTelemetry` (carryover; 88 ancestor `truncateContent` betaSessionTracing.ts:103) | cli_inner_pretty.js:285861 | function |
| `xcp` | `TELEMETRY_CONTENT_LIMIT_BYTES` (= 61440 = 60×1024; carryover) | cli_inner_pretty.js:286044 | constant |
| `rSl` | `recordApiResponseBodyTrace` (carryover; beta-tracing `api_response_body`, 183 `UZa`) | cli_inner_pretty.js:468122 | function |
| `Hh` | `getQuerySource` (carryover; maps `agent:custom:*`→`agent:custom`) | cli_inner_pretty.js:145303 | function |
| `R4e` | `getTelemetryAttributes` (carryover; resource attrs in every event) | cli_inner_pretty.js:195103 | function |
| `qpr` | `getEventLogger` (carryover; the OTEL event sink) | cli_inner_pretty.js:3019 | function |
| `DTt` | `getPromptId` (carryover; injects `prompt.id` into events) | cli_inner_pretty.js:3628 | function |
| `jNd` | `eventSequenceCounter` (carryover; monotonic `event.sequence`) | cli_inner_pretty.js:195268 | variable |

## Module: Telemetry — env-var schema + managed-env plumbing (CARRYOVER machinery, NEW application)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Fe` | `envSchemaBuilder` (`str/bool/triBool/int/enum`; carryover) | cli_inner_pretty.js:36090 | object |
| `QJc` | `triBoolParser` (memoized zod schema; FIRST applied to an OTEL_* var this window) | cli_inner_pretty.js:36076 | variable |
| `JJc` | `boolParser` (memoized zod schema; transform `(e)=>at(e)`) | cli_inner_pretty.js:36067 | variable |
| `lIt` | `envValuePreprocessor` (`e===void 0 ? void 0 : String(e)`; carryover) | cli_inner_pretty.js:36039 | function |
| `at` | `isEnvTruthy` (`["1","true","yes","on"]`; carryover) | cli_inner_pretty.js:1934 | function |
| `ul` | `isEnvFalsy` (`["0","false","no","off"]`; carryover) | cli_inner_pretty.js:1940 | function |
| `BZc` | `OTEL_LOG_USER_PROMPTS` value (carryover; `Fe.bool()`) | cli_inner_pretty.js:36362 (decl) / 36423 (bind) | variable |
| `NHr` | `otelEnvGetterNamespace` (lazy getter map; `OTEL_LOG_ASSISTANT_RESPONSES:()=>FZc` @36266) | cli_inner_pretty.js:36256 | object |
| `Qmu` | `mergedEnvGetterMap` (spreads `...NHr`; carryover) | cli_inner_pretty.js:43995 | object |
| `Be` | `managedEnvProxy` (`$cs(Qmu, qXe)`; per-access parses `process.env[key]`) | cli_inner_pretty.js:43996 | object |
| `$cs` | `makeEnvProxy` (defines per-key getters that `.parse(process.env[key])`) | cli_inner_pretty.js:43951 | function |
