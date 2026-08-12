# Claude Code 2.1.227 analysis

This tree is the version-pinned deobfuscation report for:

- Target bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.227/extract/cli_inner_pretty.js`
- Target size: 978,974 lines / 33,191,887 bytes
- Build metadata: SHA `5ecc7d5389d8b682652d0ea32eadd3e0eb537ee8`, built 2026-08-10
- Readable cross-check: `/lyz/codespace/3rd/claude-code` (Claude Code 2.1.88)
- Prior report baseline: [`../../claude_code_v_2.1.220/analyze/`](../../claude_code_v_2.1.220/analyze/README.md)

The 2.1.227 report has full numbered-module parity with 2.1.220, plus three target-only modules.
Obfuscated identifiers are remangled between builds, so the 2.1.220 symbol indexes are not copied.
Every symbol in this tree is re-derived from the 2.1.227 bundle; each parity module documents both
current architecture and 2.1.220-to-2.1.227 changes. See the
[`module coverage matrix`](00_overview/module_coverage.md) for the complete audit.

## Current coverage

- [`00_overview/`](00_overview/README.md) - complete 2.1.221-2.1.227 changelog, 130-row
  changelog-to-code ledger, module-parity matrix, file map, and canonical 2.1.227 symbols.
- [`by_version/`](by_version/README.md) - release-oriented views of the implementation changes from
  2.1.221 through 2.1.227.
- [`03_llm_core/`](03_llm_core/README.md) - full query-loop state machine, streaming tool execution,
  fallback rollback, Stop-hook decisions, recovery, and typed termination.
- [`04_tools/`](04_tools/README.md) - tool contracts, alias lookup, deferred loading, ToolSearch,
  execution boundaries, and guarded terminal tools.
- [`05_plan_mode/`](05_plan_mode/README.md) - reversible permission-state transition, plan-file
  enforcement, transcript reconstruction, approval, workshop/prototype routing, and gated ultraplan
  residue.
- [`07_compact/`](07_compact/README.md) - native-1M catalog enforcement, unknown-model caps,
  compaction-budget derivation, warnings, and escape hatches.
- [`30_agent_team/`](30_agent_team/README.md) - `ListAgents`, cross-session recipient resolution,
  confirmed identity pins, inbound policy, and held-message expiry.
- [`31_auto_memory/`](31_auto_memory/README.md) - prompt-time recall, incremental extraction, restricted
  maintenance forks, Dream scheduling/locking, pause enforcement, and write integrity.
- [`36_background_agents/`](36_background_agents/README.md) - the tightened foreground/background
  scheduling rule, worktree preservation, agents-view trust, and removal of the lifetime spawn cap.
- [`38_permissions/`](38_permissions/README.md) - provenance-aware rules, mode overlays, PreToolUse
  arbitration, Bash/PowerShell static analysis, auto-mode classification, and headless fail-closed
  behavior.
- [`39_mcp/`](39_mcp/README.md) - configuration/policy precedence, dual client runtimes, non-blocking
  startup, discovery and deferred tools, OAuth recovery, call watchdogs, roots, and diagnostics.
- [`40_system_prompt/`](40_system_prompt/README.md) - modular prompt composition, dynamic system-role
  reminders, compatibility framing, cache promotion/demotion, per-turn effort, and origin policy.
- [`41_hooks/`](41_hooks/README.md) - all 31 event adapters, source and trust gates, matcher/`if:`
  selection, seven runtime hook types, secure command execution, result precedence, asynchronous
  delivery, and the 2.1.222 restricted-fork permission repair.
- [`42_workflow/`](42_workflow/README.md) - workflow admission, pure metadata, AST instrumentation,
  hardened VM realm, bounded agent scheduler, structured output, prefix-journal resume, replicated
  progress, server-authored launches, and the 2.1.223 dynamic-import sandbox repair.
- [`43_slash_commands/`](43_slash_commands/README.md) - multi-source catalog precedence, exact-first
  aliases, headless projection, type-directed dispatch, stacked/forked prompt commands, fuzzy menu
  ranking, Unicode-safe highlighting, and `/tui` resume-leaf persistence.
- [`44_telemetry/`](44_telemetry/README.md) - dual telemetry planes, OTel correlation/export,
  request-scoped MCP attribution, gateway spend caps, usage scanning, and refresh-before-tier
  GrowthBook evaluation.
- [`45_skills/`](45_skills/README.md) - complete skill discovery, policy, invocation and fork runtime,
  plus HTTPS archive plugins and managed marketplace rules.
- [`46_todo_tasks/`](46_todo_tasks/README.md) - V1/V2 task surfaces, dual filesystem/Storage V5
  persistence, atomic allocation and claims, hooks, reminders, fork carry, and dead-probe retirement.
- [`47_models/`](47_models/README.md) - validated catalogue/provider projection, policy and entitlement
  resolution, gateway discovery, picker construction, live thinking repair, and fast-mode state/costs.
- [`48_accessibility_ui/`](48_accessibility_ui/README.md) - Focus-view semantic folding, accessible
  incremental rendering, durable Vim state, emoji aliases, terminal capability policy, Wayland copy
  ordering, and fullscreen scrollback retention.
- [`49_sandbox/`](49_sandbox/README.md) - policy normalization, Linux/macOS wrappers, violation
  propagation, structured/JWT credential masking, and AWS SigV4 repair.
- [`50_performance/`](50_performance/README.md) - bounded caches, streaming reads, LSP LRU, fork-load
  coalescing, transcript compaction, delta persistence, render pruning, drains, and async UI probes.
- [`51_headless_sdk/`](51_headless_sdk/README.md) - stream-json process I/O, init/result projection,
  control-request transactions, MCP readiness, SDK-state reconciliation, nested text forwarding, and
  GitHub Action subprocess-scrub state.
- [`52_code_review/`](52_code_review/README.md) - command/effort state, local and cloud route selection,
  adaptive reviewer sizing, structured findings, repository scope, and consent-bound posting.
- [`53_subagent_limits/`](53_subagent_limits/README.md) - Agent admission/runtime, layered depth gates,
  live concurrency slots, lifetime-cap removal, WebSearch/USD budgets, worktree containment, and
  untrusted-result hardening.
- [`54_remote_control/`](54_remote_control/README.md) - split SSE/HTTPS transport, sequence and epoch
  recovery, history-ownership taints, compaction/reset propagation, direct app-image delivery,
  scope-sensitive auto-start, and persistent connection-failure state.
- [`55_auth_providers/`](55_auth_providers/README.md) - provider and credential precedence, API-key
  helpers, OAuth concurrency/recovery, subscription-aware flags, managed login, AWS credentials,
  host-managed transport, mTLS, keep-alive, gateway pins, and Bedrock region preference.
- [`56_chrome_ide/`](56_chrome_ide/README.md) - authenticated Chrome relay, session-owned browser
  tabs, descriptor-bound file uploads, native-host setup, trust-aware IDE controls, raw workspace
  diffs, and the capacity-aware environment/work bridge.
- [`57_api_reliability/`](57_api_reliability/README.md) - transport normalization, bounded request
  recovery, raw-byte/event watchdogs, semantic completion, proxy-aware startup checks, provider
  guards, HTTP/2 survival, and integrity-gated update downloads.
- [`58_persistent_goals/`](58_persistent_goals/README.md) - `/goal`, Stop-hook evaluation, resume,
  and the new `ProposeGoal` consent path.
- [`59_connected_memory/`](59_connected_memory/README.md) - `memory_list`, `memory_read`, and
  `memory_write`, including store resolution, validation, and optimistic concurrency.
- [`60_self_hosted_runner/`](60_self_hosted_runner/README.md) - runner preflight, registration,
  capacity/lease polling, child isolation, drain, and the nine-tool operator/doctor suite.

## Confidence legend

- **Verified** - control flow was read in the target bundle and pinned to line ranges.
- **Cross-checked** - target behavior was compared with 2.1.220 or readable 2.1.88 source.
- **Inferred** - a conclusion follows from callers or schemas but lacks a readable-source twin.

All core claims in the analyzed modules are Verified. Exact intermediate-release attribution
still comes from the changelog because only 2.1.220 and 2.1.227 bundles are available. `ProposeGoal`,
the connected-memory tools, archive plugin pipeline, cross-session policy, and self-hosted runner have
no readable 2.1.88 counterpart; their analysis is therefore anchored directly in the target bundle.
