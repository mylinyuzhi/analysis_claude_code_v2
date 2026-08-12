# Removal of the lifetime subagent spawn cap

## Verified delta

The 2.1.220 Agent-tool path enforced three independent resource boundaries: nesting depth, cumulative
subagent spawns, and live concurrency. Its `getMaxSubagentsPerSession` (`Q7r`,
`cli_inner_pretty.js:231402-231404`, 2.1.220) defaulted to 200, and the call path rejected
`totalAgentSpawns >= limit` at `cli_inner_pretty.js:398391-398400` (2.1.220).

In 2.1.227, `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION` remains only in an environment-variable allowlist
at `cli_inner_pretty.js:55013`; the getter, 200 default, counter comparison, error text, and counter
increment are absent. The corresponding admission closure at `cli_inner_pretty.js:550909-550922`
now checks cancellation and dollar budget only.

### Lifetime-cap removal

**What it does:** Allows long-running sessions to create more than 200 subagents over their lifetime
without weakening the controls on simultaneous work, nesting, or spend.

**How it works:**
1. On every Agent invocation, the target still rejects a request whose agent-context depth reaches
   `getMaxSubagentSpawnDepth` (`v6`, `cli_inner_pretty.js:206060-206068`).
2. The admission closure rejects aborted sessions and exhausted `maxBudgetUsd` budgets.
3. Unlike 2.1.220, it no longer reads a cumulative spawn count, compares it with a per-session cap, or
   increments that lifetime counter.
4. The separate concurrency closure still calls `getMaxConcurrentSubagents` (`V7u`,
   `cli_inner_pretty.js:206854-206856`) and waits for a task-registry concurrency slot.
5. Teammate topology rules, permission checks, and the restriction on background agents spawned by
   in-process teammates remain before admission.

**Why this approach:**
- A cumulative limit penalizes session longevity rather than current pressure: 200 sequential,
  completed agents do not consume the resources of 200 live agents.
- Removing only the lifetime counter preserves the boundaries tied to actual risk: depth prevents
  recursive explosion, concurrency bounds live resource use, and the dollar budget bounds cost.
- Raising the default would postpone the same failure. Removing the comparison eliminates an arbitrary
  terminal state while leaving administrators control over the limits that reflect instantaneous load.
- The trade-off is that an unbudgeted session can create an unbounded number of agents over time; the
  design accepts this because completed-agent count is a poor proxy for safety or capacity.

**Key insight:** The changelog's “cap removal” is not a general relaxation of subagent controls. It is
the deletion of one lifetime-axis gate from a multidimensional admission policy.

## Critical branches that remain

- depth at or above the configured/default maximum -> reject before resolving agent type.
- flat teammate tries to spawn another named teammate -> reject.
- in-process teammate requests a background agent -> reject.
- session is aborted or its dollar budget is exhausted -> reject.
- live subagent count reaches the concurrency limit -> wait or reject according to the existing
  concurrency policy.
- cumulative completed/spawned agents exceeds 200 -> no longer a branch.

## Compatibility note

The old environment name is still recognized by the general environment/settings plumbing, but the
target Agent execution path does not consume it. Retaining an allowlist entry avoids turning a formerly
accepted variable into an unrelated configuration-validation failure, even though it no longer controls
admission.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getMaxSubagentSpawnDepth` (`v6`) - depth limit with environment and feature-value precedence.
- `getMaxConcurrentSubagents` (`V7u`) - independent live-concurrency limit.
