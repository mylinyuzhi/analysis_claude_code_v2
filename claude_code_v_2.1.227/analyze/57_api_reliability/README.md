# 57_api_reliability — Retry, transport, streaming, and startup connectivity

This module re-derives the full 2.1.220 API reliability architecture from the 2.1.227 bundle. The
core design remains layered: transport errors are normalized into stable classes, request creation
has a bounded retry/fallback state machine, streaming has independent byte- and event-level
watchdogs, and partial output is either retried, finalized, or accepted as complete based on explicit
stream state.

The 2.1.222 changes refine three boundaries rather than replacing the subsystem:

1. Startup connectivity now uses the same proxy/TLS transport policy as API traffic and has a hard
   10-second bound.
2. Raw SSE byte activity—not only parsed model events—feeds idle detection for custom gateways and
   custom first-party base URLs.
3. A connection closing after a final `message_delta` no longer converts an already complete response
   into a partial-response error.

## Documents

- [retry_policy.md](retry_policy.md) — retry budget, classifier precedence, auth/provider recovery,
  stale connection handling, context-overflow monotonicity, Retry-After/backoff, watchdog mode, and
  interruptible waits.
- [streaming_watchdogs_and_completion.md](streaming_watchdogs_and_completion.md) — byte/event
  watchdog separation, wire keep-alive activity, system-suspend detection, stream parser invariants,
  completion-aware close handling, partial finalization, and retry-before-output.
- [transport_and_connectivity.md](transport_and_connectivity.md) — cause-chain extraction, network,
  transient, certificate, and proxy sets; user formatting; proxy-aware startup checks; Bedrock
  content-type guard; and HTTP/2 process survival.

## 2.1.220 → 2.1.227 result

| Concern | 2.1.227 status | Evidence |
|---|---|---|
| Transport code taxonomy | Retained and revalidated: certificate verdicts fail fast, network-down and stale-connection codes remain distinct, and proxy/socket codes are classified consistently | `202453-202658` |
| Request retry budget | Retained: default 10, retry-watchdog 300, explicit counts above 15 clamped only without watchdog | `585378-585430` |
| Stale keep-alive connection | Retained: a stale connection disables keep-alive before the next client construction | `584941-584978` |
| Context-overflow loop | Retained fix: `maxTokensOverride` must strictly decrease; no-progress adjustment fails | `585123-585143` |
| Interruptible long retry | Retained and integrated: waits are wakeable and watchdog retry delay is sliced into bounded chunks | `585185-585228` |
| Event watchdog | Retained default-on, separately disableable through `CLAUDE_ENABLE_STREAM_WATCHDOG=0` | `530475-530532` |
| Byte watchdog provider coverage | Changed in 2.1.222: first-party, gateway, Anthropic AWS, and custom first-party SSE all use the raw-body wrapper | `612311-612369` |
| Wire keep-alive handling | Changed/verified: every raw response-body chunk updates shared `lastAt`; event-level stall arming consults that timestamp before warning/aborting | `612164-612287`, `529995-530041` |
| Connection close after completion | Changed in 2.1.222: a known stop reason plus a closed final block is accepted as complete even without `message_stop` | `531280-531298` |
| Partial response after real failure | Retained: meaningful output is finalized with synthesized `tool_use`/`end_turn` and a warning; thinking-only output is retried within a separate budget | `531218-531352` |
| Startup connectivity | Changed in 2.1.222: `fetch` uses shared proxy/TLS options and an explicit 10-second timeout; the UI reports proxy involvement | `924878-924920`, `924982-925004` |
| Bedrock transformed response | Retained: unexpected content type is rejected before binary event parsing and never retried as a transient connection | `612340-612364`, `585349-585370` |
| HTTP/2 GOAWAY process crash | Retained: only stack-verified Node HTTP/2 teardown shapes are recovered, under a process-level budget | `127548-127580`, `536463-536487` |

## Architectural conclusions

1. Request retry and stream retry are different machines. The former re-creates requests before a
   usable stream; the latter decides whether already observed content makes replay safe.
2. Liveness is measured at two semantic levels. Raw bytes prove the connection is active; parsed
   events prove the model protocol is progressing. A proxy comment can satisfy the first but not the
   second.
3. Stream completion is defined by protocol state, not the final transport frame. Once a non-null
   stop reason has arrived and the active block is closed, losing `message_stop` is not truncation.
4. Fail-fast classifications are as important as retryable classifications. Certificate verdicts,
   malformed Bedrock content, and nonretryable 4xx responses should not consume the retry budget.
5. Reliability has an authority boundary: retry may refresh or reconstruct credentials through
   approved providers, but it must not silently substitute a stale or unchanged token forever.

## Scope and confidence

The retry generator, stream generator, fetch/watchdog wrapper, connectivity check, transport sets,
Bedrock guard, and HTTP/2 recovery are **Verified** in 2.1.227 and **Cross-checked** with 2.1.220. The
three 2.1.222 reliability bullets have direct current/baseline deltas. Provider SDK internals are
treated as dependencies; this report analyzes the Claude Code wrappers and decisions around them.

MCP tool idle/hard watchdogs are analyzed in [39_mcp](../39_mcp/). Remote Control SSE replay and
event queues are analyzed in [54_remote_control](../54_remote_control/). Gateway spend-limit parsing
is analyzed in [44_telemetry](../44_telemetry/).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `retryApiRequest` (`Uti`) — request creation, auth repair, fallback, retry, and delay generator.
- `streamMessages` (`Z5p`) — streaming parser, watchdog, recovery, and partial finalization.
- `wrapResponseBodyWithByteWatchdog` (`wxS`) — raw-byte liveness and suspend-aware body wrapper.
- `createApiFetchWrapper` (`kxS`) — provider-aware response guarding and byte-watchdog installation.
- `extractConnectionDetails` (`dj`) — bounded error cause-chain normalization.
- `runStartupConnectivityCheck` (`DPh`) — proxy-aware, bounded API/OAuth reachability probe.
