# 51_headless_sdk — Print mode and the SDK stream protocol

This module re-derives the complete 2.1.220 headless/SDK scope from the 2.1.227 bundle: process I/O,
stream-json initialization, partial-result recovery, structured input, control requests, dynamic SDK
configuration, MCP startup, and subagent-text forwarding. It also traces the 2.1.227
`claude-code-action`/`allowed_non_write_users` repair to the subprocess-scrub state refactor.

The core protocol remains compatible with 2.1.220. The largest changes in 2.1.221–2.1.227 are at
integration boundaries rather than wire-shape replacement. Print startup still awaits its MCP
coordinator; control requests still have tracked and detached lifecycles; stdout still uses byte
accounting and a queue-scaled exit budget; and interrupted text output still uses a two-slot recovery
accumulator.

## Documents

- [stream_json_and_process_io.md](stream_json_and_process_io.md) — structured input, init-event
  construction, stdout accounting/draining, error classification, and incomplete-result recovery.
- [control_requests_and_startup.md](control_requests_and_startup.md) — MCP readiness, initialize-state
  merge, tracked/detached control requests, model transactions, working-directory changes, and
  register-root keep-alives.
- [forwarding_and_ci_hardening.md](forwarding_and_ci_hardening.md) — subagent-text forwarding and the
  consolidated subprocess environment/sandbox state behind the GitHub Action repair.

## Version findings

| Version | Finding | Evidence |
|---|---|---|
| 2.1.220 baseline | Byte-accounted stdout, scaled exit drain, init diagnostics, control progress, live model switching, initialize agent merge, partial-result recovery, and nested subagent forwarding already exist | `2.1.220:20516-20652`, `336898-336901`, `593588-593652`, `840090-841111`, `843299-849486` |
| 2.1.221 carryover check | Print startup still awaits the MCP coordinator; the `alwaysLoad`/deferrable split is structurally equivalent to 2.1.220 | `cli_inner_pretty.js:928831-928900`, `947808-947821` versus `2.1.220:834115-834175`, `850787-850803` |
| 2.1.221 retained | Inserted SDK MCP servers trigger immediate reconciliation from the initialize arm; initialize agents merge by name into the live getter-backed set | `cli_inner_pretty.js:944180-944252`, `946282-946343` |
| 2.1.225 ownership | Output-less Remote Control/SDK display normalization is implemented in the remote projection and is analyzed in `54_remote_control`; OAuth-token precedence is analyzed in `55_auth_providers` | cross-module ownership; shared `(no content)` sentinel at `121603` |
| 2.1.227 | Subprocess scrub booleans, paths, script caps, environment providers, and counters are consolidated in `SubprocessEnvState`; preflight snapshots runner paths used by the Bash sandbox | `cli_inner_pretty.js:129253-129380`, `129565-129715` versus `2.1.220:166673-167069` |
| retained | Stream-json output filtering, incomplete-text recovery, control-request progress, mid-turn model switching, and forward-subagent-text behavior remain | `cli_inner_pretty.js:932021-933354`, `938248-938278`, `941450-944360`, `923562-923628` |

The exact 2.1.226 faulty intermediate is unavailable. The 2.1.227 action attribution is therefore
marked **Inferred from a verified target-side refactor**: the consolidated scrub state is unique to
the current build and is the state consumed by every Bash sandbox launch, but a 2.1.226 binary would
be required to prove the single failing assignment.

## Architectural conclusion

Headless mode has three independent reliability contracts:

1. Protocol lifecycle: every request must complete exactly once, including long-running requests.
2. Byte lifecycle: a `result` is not delivered until queued stdout bytes have flushed or a bounded
   budget expires.
3. Dynamic-state lifecycle: SDK-provided agents, MCP servers, model choice, and scrub configuration
   must be read from the latest authoritative state rather than stale startup arrays.

The current implementation keeps these contracts separate. That makes individual recovery paths
more verbose, but prevents a transport concern from silently changing model or permission state.

## Scope and confidence

Process I/O, init/result events, control dispatch, MCP startup, and forwarding are **Verified** in
2.1.227 and **Cross-checked** against 2.1.220. The action repair's precise causal link is **Inferred**
as described above. The readable 2.1.88 source confirms the older print/SDK architecture but predates
several current protocol fields and scrub-state changes.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `writeToStdout` (`Va`) - records queued and flushed stdout bytes.
- `drainStdoutBeforeExit` (`icr`) - closes and drains non-TTY stdout under a scaled budget.
- `buildHeadlessInitEvent` (`FFr`) - emits the SDK's versioned session snapshot.
- `updatePartialResultAccumulator` (`wUh`) - recovers the previous complete assistant text when a
  stream ends with an incomplete marker.
- `createMcpStartupCoordinator` (`nNh`) - partitions required and deferrable MCP startup.
- `runHeadlessControlLoop` (control loop at `943840-944360`) - dispatches tracked/detached requests.
- `SubprocessEnvState` (`v_s`) - owns all latched subprocess-scrub state.
