# 44 — Telemetry / OTEL (v2.1.183 → v2.1.193, NEW MODULE)

> Delta module: `44_telemetry/` documents the **v2.1.183 → v2.1.193** change to the OpenTelemetry log-event pipeline. This window adds exactly one new event and one new env var; the surrounding emitter, redaction, truncation, and managed-env machinery is all carryover.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Every `cli_inner_pretty.js:<line>` citation is a **v2.1.193** line unless tagged *(183 before-picture)* or *(v2.1.88)*.
> Obfuscated names are re-mangled per build — they are **never** reused across versions. Canonical map: [`../00_overview/symbol_additions_v2_1_193_telemetry.md`](../00_overview/symbol_additions_v2_1_193_telemetry.md).

---

## TL;DR — one new event, one new env var, the rest is carryover

Claude Code emits OTEL **log events** (records of the form `{ body: "claude_code.<event>", attributes }`) through a single emitter `logOTelEvent` (obfuscated: `Jc`, `cli_inner_pretty.js:195214`). The family already includes `api_request`, `user_prompt`, `permission_mode_changed`, `compaction`, `tool_result`, and others — all carryover.

v2.1.193 adds **one** member to that family: `claude_code.assistant_response`, emitted per completed model turn right after `api_request` (`cli_inner_pretty.js:468662`, inside `recordApiRequestTelemetry` `cSl`). It logs the assistant's reply text (text content blocks only, joined by `\n`, capped at 60 KB) plus `response_length`, `request_id`, `model`, and `query_source`.

The headline is not the event but its **redaction gate**: `isAssistantResponseLoggingEnabled` (`dGi`, `:195211`) returns `OTEL_LOG_ASSISTANT_RESPONSES ?? OTEL_LOG_USER_PROMPTS`. The new env var is parsed **tri-state** (`true`/`false`/`undefined`), so when it is unset the `??` inherits the older `OTEL_LOG_USER_PROMPTS` flag — meaning **prompt-logging deployments begin logging full response bodies on upgrade unless they explicitly set `OTEL_LOG_ASSISTANT_RESPONSES=0`.** Full analysis: [`assistant_response_event.md`](./assistant_response_event.md).

---

## What changed at a glance

| # | Delta | Kind | 193 anchor | 183 before | Confidence |
|---|-------|------|------------|-----------|:----------:|
| T1 | `claude_code.assistant_response` OTEL log event | **NET-NEW** | `Jc("assistant_response",…)` :468662; assembled :468659 | absent (grep=0) | high |
| T2 | `OTEL_LOG_ASSISTANT_RESPONSES` tri-state env var | **NET-NEW** | getter :36266; `FZc=Fe.triBool()` :36424; allowlist :193053 | absent (grep=0) | high |
| T3 | Response-redaction gate w/ `??` inheritance | **NET-NEW** | `dGi` :195211 (`?? OTEL_LOG_USER_PROMPTS` :195212) | absent (grep=0) | high |
| T4 | 60 KB body truncation **applied to** the new event | reused helper, new application | `CD(ne).content` :468664; `xcp=61440` :286044 | helper present, not applied here | high |
| — | OTEL emitter `Jc`, prompt gate `GNd`/`V1t`, `user_prompt` event, `truncateForTelemetry`, env parsers, managed-env proxy | **CARRYOVER** | :195214 / :195205 / :397799 / :285861 / :36076 / :43996 | byte-equivalent (re-mangled) | high |

The three NET-NEW rows (T1–T3) are each proven by a **0 → present** grep diff between the 183 and 193 bundles (`assistant_response`, `OTEL_LOG_ASSISTANT_RESPONSES`, `?? Be.OTEL_LOG_USER_PROMPTS` all = 0 in 183). The carryover machinery is unchanged: `61440` and `Content exceeds 60KB` both keep identical occurrence counts (4 and 2) across 183 ↔ 193.

---

## The OTEL log-event pipeline (one-paragraph map)

A log event is built and dispatched in three layers, all carryover:

1. **Emit:** call sites invoke `logOTelEvent(name, payload)` (`Jc`, `:195214`). The emitter merges `getTelemetryAttributes()` resource attrs, stamps `event.name`/`event.timestamp`/`event.sequence` (monotonic `jNd++`), injects `prompt.id` and `workspace.host_paths` when present, drops `undefined` fields, wraps `{ body: \`claude_code.${name}\`, attributes }`, and emits via the event logger `qpr()` (or warns once if none is initialized).
2. **Redact:** sensitive bodies are gated before emission. Prompts use `redactIfDisabled` (`V1t`, `:195208`) ← `isUserPromptLoggingEnabled` (`GNd`, `:195205`, reads `OTEL_LOG_USER_PROMPTS`). Responses (NEW) use `isAssistantResponseLoggingEnabled` (`dGi`, `:195211`, reads `OTEL_LOG_ASSISTANT_RESPONSES ?? OTEL_LOG_USER_PROMPTS`).
3. **Bound:** large bodies are capped by `truncateForTelemetry` (`CD`, `:285861`) at `xcp = 61440` bytes (60 KB), appending `[TRUNCATED - Content exceeds 60KB limit]`. Applied to the `assistant_response` body (new application); the `user_prompt` body is not truncated.

v2.1.193's change touches only layer 2 (a new gate) and adds one new call into layers 1+3 (the new event, which reuses the existing truncation).

---

## Documents in this module

- **[`assistant_response_event.md`](./assistant_response_event.md)** — THE headline. The new `assistant_response` event end-to-end: payload schema (`response_length` always emitted even when redacted; text-blocks-only assembly; 60 KB cap), the `dGi()` `??` inheritance algorithm with the full truth table, the tri-state-vs-bool design rationale, the upgrade-behavior gotcha, parallelism with the carryover `user_prompt` event, and the env-var registration sites. Rich enough to stand alone.

---

## Related Symbols

> Symbol mappings live in the symbol index files (never duplicated as a table in module docs):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (**Telemetry** — home of these symbols)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
>
> Per-feature additions: [symbol_additions_v2_1_193_telemetry.md](../00_overview/symbol_additions_v2_1_193_telemetry.md)
>
> Headline symbols (full list in the deep doc and the additions file):
> - `recordApiRequestTelemetry` (`cSl`, `:468542`) — emits `api_request` then the NEW `assistant_response`.
> - `isAssistantResponseLoggingEnabled` (`dGi`, `:195211`) — the NET-NEW `??`-inheritance gate.
> - `OTEL_LOG_ASSISTANT_RESPONSES` (`FZc`, bind `:36424`) — NET-NEW tri-state env var.
> - `logOTelEvent` (`Jc`, `:195214`) — carryover OTEL log emitter (88 ancestor `events.ts:21`).
