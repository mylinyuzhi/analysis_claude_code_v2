# Claude Code 2.1.227 overview

## Executive result

The complete supplied changelog window contains 130 bullets across 2.1.221-2.1.227. The highest-impact
verified client additions and policy deltas are:

1. `ProposeGoal` lets the model propose an existing session-goal mechanism without silently bypassing
   user consent. It queues `/goal` rather than mutating the Stop-hook registry itself.
2. `memory_list`, `memory_read`, and `memory_write` expose connected organization/project stores to the
   model with explicit trust, path, secret, size, and compare-and-swap boundaries.
3. `claude self-hosted-runner` is a full supervisor: preflight precedes registration, capacity and leases
   drive polling, children receive per-session authority, and shutdown is a bounded drain protocol.
4. Cross-session `SendMessage` adds a multi-transport identity resolver, confirmed-recipient pins, a
   monotone inbound authority policy, and an expiring bounded hold queue.
5. Archive plugins use bounded HTTPS retrieval, per-hop redirect checks, optional SHA-256 pinning,
   shape validation, and atomic installation; managed marketplace `owner/*` is a typed policy sentinel.
6. Context enforcement derives native-1M behavior from catalog capabilities and actively contains
   unknown model IDs unless an explicit escape hatch applies.
7. `/review` is a compatibility alias for `/code-review`; only explicitly typed effort is remembered,
   and the effective effort helps select inline, workflow, or fork execution.
8. Bedrock region-prefix selection is a per-model availability preference: partition safety wins,
   profile discovery prefers the requested prefix, and degraded discovery retains a warned fallback.

Supporting verified improvements include structured/JWT/AWS credential masking and replacing sync file
suggestion/stat calls with awaited filesystem operations to reduce event-loop stalls. The old cumulative
200-subagent gate is gone, while depth, concurrency, topology, and budget controls remain.

Two mature systems were also re-derived because the additions depend on them:

- `/goal` is a session-scoped prompt `Stop` hook whose transcript attachments are its recovery log.
- `ListAgents` builds one addressable roster from in-process subagents, Unix-domain-socket sessions,
  and Remote Control bridge sessions. Its formatter retains cloud and DID extension slots, but both
  providers return empty results in this build's traced path.

## Architecture

```text
ProposeGoal ──approval/queue──> /goal ──register──> prompt Stop hook
                                                │
                                                ├─ unmet: block + continue
                                                ├─ met: clear + record metrics
                                                └─ resume: rebuild from goal_status

memory_list ─┐
memory_read ─┼─> availability/store resolver ─> path/content guards ─> memory backend
memory_write ┘                                      │
                                                   └─ version token / CAS retry

self_hosted_runner_* ─┬─> OAuth admin API (pool, runners, sessions, secret metadata, requeue)
                      └─> localhost/process/files (health, metrics, spawn, redacted log tail)

cross-session send ─> recipient resolver ─> confirmed identity pin ─> transport delivery
inbound peer       ─> monotone policy ─────> accept / bounded hold / refuse

self-hosted command ─> local preflight ─> register ─> capacity/lease poll ─> isolated child
                                                                  └────────> bounded drain
```

## Version boundaries

- 2.1.220 already contains goal attachments, `/goal`, Stop-hook integration, and `ListAgents` prompt
  text. They are not new features in 2.1.227.
- `ProposeGoal` and `modelProposedGoals` have no fixed-string sites in the 2.1.220 bundle.
- The exact connected-memory tool declarations and all nine `self_hosted_runner_*` tool assets are new
  relative to the 2.1.220 extracted tool assets.
- The main self-hosted command dispatch and lifecycle, `crossSessionInbound`, `dialogExpiry`, archive
  source schema, marketplace owner wildcard, and unknown-model window policy are target-only mechanisms.
- `ANTHROPIC_BEDROCK_REGION_PREFIX` is target-only; it changes model-ID selection without changing the
  AWS SDK client region or promising data residency.
- `SendMessage`, `ListAgents`, and the base sandbox mask engine predate this window; the new work is their
  transport/policy/credential-format expansion, not their headline names.
- The readable 2.1.88 source contains `SendMessage` and the older team runtime, but no
  `ProposeGoal`, connected-memory tools, archive source, or self-hosted runner runtime.

See [`changelog_analysis.md`](changelog_analysis.md) for the complete changelog,
[`changelog_to_code_map.md`](changelog_to_code_map.md) for the 130-row evidence ledger, and
[`module_coverage.md`](module_coverage.md) for 2.1.220 parity, and [`file_index.md`](file_index.md) for
source ranges. Release-oriented navigation is in [`../by_version/`](../by_version/README.md).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](symbol_index_infra_integration.md) - Integrations

Key entry points:
- `setSessionGoal` (`GCr`) - installs the goal Stop hook and active state.
- `proposeGoalTool` (`slS`) - consent-aware model proposal path.
- `resolveMemoryStore` (`SPr`) - central connected-memory availability and capability resolver.
- `memoryWriteTool` (`HKp`) - full-document compare-and-swap write surface.
- `listAllReachableAgents` (`aya`) - multi-transport peer aggregation.
- `resolveSendMessageRecipient` (`NRn`) - safe local/remote recipient selection.
- `resolveAutoCompactWindow` (`q3`) - context-window enforcement precedence.
- `selfHostedRunnerMain` (`dhH`) - runner preflight, registration, and supervision.
- `selfHostedRunnerApiRequest` (`U8e`) - OAuth-backed runner admin request boundary.
- `resolveBedrockModelIds` (`afy`) - preference-aware Bedrock profile and fallback resolver.
