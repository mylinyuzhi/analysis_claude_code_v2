# Persistent session goals

Claude Code implements a goal as a session-scoped prompt `Stop` hook. The goal text is the hook's
evaluation prompt, `activeGoal` carries live counters, and `goal_status` attachments form the durable
transcript record used on resume.

2.1.227 adds a second ingress path, `ProposeGoal`. The evaluator itself already existed in 2.1.220;
the addition is a consent-aware tool that eventually queues the same `/goal <condition>` command.

Read [`goal_lifecycle_proposal_and_resume.md`](goal_lifecycle_proposal_and_resume.md) for the complete
state machine, background-task deferral, approval race handling, and recovery algorithm.

## Boundary summary

- Typed `/goal` is capped at 4,000 characters and is unaffected by `modelProposedGoals`.
- `ProposeGoal` is capped at 500 canonicalized characters so the approval dialog stays readable.
- Both paths fail closed when hooks are restricted or the workspace is not trusted.
- `ProposeGoal` additionally rejects plan mode, agents, noninteractive/session shapes, a disabled
  setting, and concurrent pending proposals.
- An accepted proposal does not call the goal setter directly; it enqueues `/goal`, preserving the
  command's validation, transcript notice, and kickoff prompt.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `setSessionGoal` (`GCr`) - installs the session Stop hook.
- `clearSessionGoal` (`WCr`) - removes all generic prompt Stop hooks and records a met sentinel.
- `preflightSessionGoal` (`yvn`) - shared hooks/trust gate.
- `goalCommandCall` (`I7b`) - status, clear aliases, length cap, and kickoff query.
- `proposeGoalTool` (`slS`) - consent-aware model proposal path.
- `findGoalToRestore` (`Hlh`) - reverse transcript scan.
- `restoreGoalFromTranscript` (`IRv`) - reconstructs transient hook and counters.
