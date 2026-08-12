# 53_subagent_limits — Admission, execution, and resource governance

This module re-derives the complete 2.1.220 subagent-limits scope from the 2.1.227 bundle. It covers
the Agent tool contract, depth and concurrency enforcement, the removed lifetime spawn cap, the
retained WebSearch and USD budgets, foreground/background/remote routing, tool resolution, partial
result recovery, worktree containment, and output hardening.

The principal 2.1.224 change is deliberately narrow: the monotone 200-subagent lifetime counter and
its admission refusal are gone. It did **not** remove nesting depth, the 20-running-agent default,
budget checks, agent-type policy, tool filtering, or worktree containment. The obsolete environment
name remains in the recognized-settings allowlist at `cli_inner_pretty.js:55013`, but no 2.1.227
reader or enforcement path consumes it.

## Documents

- [admission_and_resource_limits.md](admission_and_resource_limits.md) — depth, concurrency,
  lifetime-cap removal, WebSearch accounting, `/clear`, and USD-budget halting.
- [agent_runtime_and_routes.md](agent_runtime_and_routes.md) — Agent schemas, preflight order,
  local/remote and foreground/background execution, slot ownership, result recovery, and cleanup.
- [delegation_and_containment.md](delegation_and_containment.md) — tool resolution, zero-tool
  refusal, permission inheritance, delegation discipline, worktree shell guards, and untrusted-output
  neutralization.

## 2.1.220 → 2.1.227 result

| Concern | 2.1.227 status | Evidence |
|---|---|---|
| Nesting depth | Retained: env → cached feature value → default `3`; enforced in schema, prompt, and runtime | `206060-206068`, `207338-207374`, `244562-244565`, `483085`, `550853-550864` |
| Concurrent agents | Retained: default `20`, live app-state gauge, idempotent release | `206854-206856`, `352596-352610`, `550923-550939` |
| Lifetime subagent count | Removed: 2.1.220 reader/refusal/counter/reset have no 2.1.227 counterpart | 2.1.220 `231403`, `398397`; 2.1.227 allowlist residue only at `55013` |
| WebSearch count | Retained: default `200`, checked before increment, refusal returned as tool data | `206857-206858`, `554337-554363` |
| `/clear` accounting | Simplified: resets WebSearch only when no tasks survive; no lifetime-count reset remains | `405048-405070` |
| USD budget | Retained: blocks new agents and stops running background agents in print mode | `550909-550921`, `938380-938383`, `943557-943565` |
| Agent runtime | Expanded but architecturally retained: remote, async, and foreground-to-background routes share one admission boundary | `550844-551760` |
| Worktree/output hardening | Retained: real-path/shell redirect checks and control-tag neutralization remain active | `329213-329284`, `366845-366963`, `483346-483405` |

## Architectural conclusion

2.1.227 separates resources by what they measure:

1. Depth bounds recursive structure.
2. Concurrency bounds current load.
3. WebSearch bounds a costly tool over one conversation epoch.
4. USD budget bounds total economic cost.
5. The deleted lifetime counter no longer penalizes long sessions merely for completing useful work.

This separation is more flexible than one global spawn budget, but it requires careful lifecycle
ownership. The concurrency release closure is therefore idempotent and follows an agent when a
nominally foreground run becomes background work.

## Scope and confidence

All current-state paths in this module are **Verified** in 2.1.227 and **Cross-checked** against the
2.1.220 report and bundle. The readable 2.1.88 tree confirms the older Agent-tool and tool-filter
architecture but predates the current depth feature value, concurrency gauge, output scrubber, and
remote/background routes.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `agentTool` (`hni`) - central admission and route-selection surface.
- `getAgentDepth` (`nk`) - normalizes main and child context depth.
- `getMaxSubagentSpawnDepth` (`v6`) - resolves the recursive nesting ceiling.
- `getMaxConcurrentSubagents` (`V7u`) - resolves the live concurrency ceiling.
- `getMaxWebSearchesPerSession` (`K7u`) - resolves the WebSearch call ceiling.
- `createTaskRegistry` (`y5`) - owns WebSearch count and live concurrency state.
- `runSubagentStream` (`$5`) - constructs and executes the child query context.
- `finalizeSubagentResult` (`Mfa`) - extracts, measures, and sanitizes a completed result.
- `reviewSubagentHandoff` (`DDr`) - applies auto-mode handoff review.
