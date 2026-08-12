# 56_chrome_ide — Browser relay, host integration, and environment work bridge

This module re-derives the full 2.1.220 Chrome/IDE scope from the 2.1.227 bundle. It deliberately
keeps three systems with the word “bridge” separate:

| System | Purpose | Transport | Primary coordinator |
|---|---|---|---|
| Chrome extension bridge | Relay browser MCP calls to one selected extension/device | Authenticated WebSocket | `ChromeBridgeClient` (`$no`) |
| Environment/work bridge | Poll for remote work and spawn local Claude sessions | HTTPS REST plus child processes | `runEnvironmentBridgeLoop` (`nDa`) |
| Remote Control bridge | Attach clients to an existing interactive session | Inbound SSE plus outbound HTTPS | `createRemoteControlBridge` (`MGp`) |

The third system is analyzed in [54_remote_control](../54_remote_control/). This module covers the
first two, plus the SDK/IDE host boundary shared by Desktop, VS Code, and thin clients.

## Documents

- [chrome_bridge_and_tools.md](chrome_bridge_and_tools.md) — extension discovery, authenticated
  connection, liveness, tool correlation, permission-paused deadlines, session tab ownership, the
  2.1.221 tab-cleanup contract, and screenshot persistence.
- [chrome_file_security_and_setup.md](chrome_file_security_and_setup.md) — upload input rewriting,
  path authorization, descriptor-bound stable reads, attachment digests, Windows App Paths, native
  host setup, and reconnect-page suppression.
- [ide_host_and_workspace_diff.md](ide_host_and_workspace_diff.md) — two-phase `set_cwd`, trust
  attestation, IDE selections, raw git-blob diff behavior, permission/cap filtering, and the boundary
  between CLI code and VS Code extension behavior.
- [environment_work_bridge.md](environment_work_bridge.md) — authenticated environment APIs,
  liveness-safe polling configuration, capacity-aware heartbeat mode, work admission, worktree
  ownership, error budgets, and shutdown.

## 2.1.220 → 2.1.227 result

| Concern | 2.1.227 status | Evidence |
|---|---|---|
| Chrome relay architecture | Retained and revalidated; device discovery, pairing, correlated calls, and reconnect remain one WebSocket state machine | `28976-29883` |
| Startup without Chrome | Refactored: the old legacy-socket dead probe is absent; the current WebSocket path has a 30-second handshake bound, a 10-second caller wait, and bounded reconnect backoff | `29031-29055`, `29293-29415`; old probe at 2.1.220 `267285-267308` |
| Browser tab cleanup | Changed in 2.1.221: tool descriptions make model-created tabs session-owned and require closing them when no longer needed | `30300-30340` |
| Navigate without `tabId` | Retained and deepened: a per-client/per-session hidden context request creates or recovers the group, has an 8-second bound, and propagates group identity | `39193-39247`, `39426-39467` |
| Chrome upload | Hardened/refactored: path policy is followed by descriptor binding, hard-link refusal, stable bounded reads, and registered-attachment digest verification | `589581-589785` |
| Screenshot `save_to_disk` | Retained: secure directory validation and exclusive `0600` writes preserve the inline image even if persistence fails | `38915-39020` |
| Windows setup page | Retained: bounded App Paths resolution launches the actual browser executable before falling back to `rundll32` | `241370-241636` |
| Native-host reconnect page | Retained: only a newly created manifest replacement opens the reconnect page, and headless setup explicitly suppresses it | `750530-750578`, `864113` |
| Host `set_cwd` | Retained and revalidated: idle is checked both before and after asynchronous validation; trust acceptance must echo the exact resolved directory | `750100-750223` |
| Workspace diff | Changed in 2.1.222: content-producing git diff calls add `--no-ext-diff --no-textconv`, then the host applies read permission and a 2 MB aggregate hunk budget | `324984-325009`, `940877-940915` |
| VS Code Focus view | Cross-module: CLI transcript folding and the 2.1.225 semantic fixes are verified in module 48; extension UI exposure is outside this bundle | `351930-352359`, `495379-495451` |
| Environment/work bridge | Retained but substantially evolved: multi-session capacity, lease heartbeat, CCR worker epochs, worktree isolation, split retry budgets, and resumable shutdown are all current | `624758-624987`, `628421-629626` |

## Architectural conclusions

1. “Bridge” identifies a role, not a protocol. Chrome uses request-correlated WebSocket messages;
   environment work uses leased REST polling; Remote Control uses sequence-aware SSE plus HTTPS.
2. Chrome session isolation is carried by `session_scope` and `tabGroupId`, not by trusting the
   model to remember which browser window belongs to which conversation.
3. Upload security is a two-stage proof: first prove that the path is authorized, then prove that
   the opened bytes still belong to that path. Neither proof substitutes for the other.
4. Thin-client workspace diffs intentionally separate metadata from content. Stats can remain
   visible when hunk text is restricted or too large.
5. Environment work is a lease scheduler, not a terminal mirror. The local process may own several
   sessions and must reconcile remote work IDs, session IDs, worker epochs, worktrees, and teardown.

## Scope and confidence

Chrome relay, upload handling, setup, SDK `set_cwd`, workspace diff, and environment work paths are
**Verified** directly in the 2.1.227 bundle and **Cross-checked** against 2.1.220. The 2.1.221 and
2.1.222 deltas have bundle-level anchors. VS Code banner text, extension command registration, and
the extension-side mechanics of Focus view are not embedded in the CLI; this report marks that
boundary rather than attributing extension behavior to unrelated CLI code.

Self-hosted environments introduced in 2.1.224 are a separate operator-managed runner product. See
[60_self_hosted_runner](../60_self_hosted_runner/) for pool registration, runner leases, and base-dir
preflight.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `ChromeBridgeClient` (`$no`) — authenticated Chrome WebSocket and device-selection state machine.
- `prepareChromeFileUploadInput` (`GgS`) — converts authorized filesystem paths into bridge-safe bytes.
- `handleSetCwdRequest` (`EHE`) — trust-aware SDK/IDE working-directory transaction.
- `buildWorkspaceDiffResponse` (`_oH`) — permission- and size-filtered thin-client diff response.
- `createEnvironmentBridgeApi` (`XRa`) — authenticated environment/work control-plane client.
- `runEnvironmentBridgeLoop` (`nDa`) — capacity-aware local session scheduler.
