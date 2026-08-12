# 42 - Workflow

This module re-analyzes the complete dynamic-workflow subsystem in Claude Code 2.1.227. It covers
tool admission, workflow discovery, metadata parsing, JavaScript transformation, VM hardening,
subagent scheduling, structured output, progress state, journal-based resume, nested workflows,
background lifecycle, and server-authored launches.

## Current result

Workflow remains a deterministic JavaScript orchestration environment built around `agent()`,
`parallel()`, `pipeline()`, `phase()`, `log()`, and one-level `workflow()` composition. It is not a
general Node.js runtime: string/wasm code generation is disabled, dangerous globals and mutable
intrinsics are removed or frozen, current-time/random APIs are rejected, and values cross the VM
boundary through explicit clone/sanitize helpers.

The direct post-2.1.220 security change is the 2.1.223 dynamic-import fix. The 2.1.220 compiler already
installed a `vm.Script` dynamic-import rejection callback, but 2.1.227 additionally rejects every
`ImportExpression` in the parsed AST before the await-rewrite pass. This closes the path at compile
time and keeps the runtime callback as defense in depth.

The broader 2.1.227 runtime also preserves and extends the mature workflow design:

- `scriptPath` takes precedence over `name`, which takes precedence over inline script resolution.
- A pure-literal `export const meta` must be the first statement.
- Per-run agent concurrency is `min(16, max(2, cpuCount - 2))`, with a 1,000-call safety cap and an
  output-token budget.
- `agent()` options are normalized and fail closed when deny/clamp entries would be inert.
- Journal keys chain the prior prefix hash, prompt, and execution-relevant options, so resume reuses
  only the longest unchanged prefix.
- Progress is an index-keyed state snapshot; logs are the only entries trimmed.
- Server-authored workflow bundles are size-pinned, SHA-256 verified, version-framed, and admitted
  through a one-use handoff slot.
- The default medium size guideline remains advisory rather than an execution limit.

## Documents

- [workflow_runtime_sandbox_scheduler_and_resume.md](workflow_runtime_sandbox_scheduler_and_resume.md)
  - complete 2.1.227 architecture and algorithms, including the 2.1.223 security delta.

Historical documents in the 2.1.220 report remain useful for release-by-release archaeology. This
directory is the current-runtime source of truth for 2.1.227 identifiers and behavior.

## Related modules

- [Agent teams](../30_agent_team/README.md) - session agents and cross-agent messaging.
- [Background agents](../36_background_agents/README.md) - task registry and lifecycle adoption.
- [Permissions](../38_permissions/README.md) - Workflow permission rules and delegated-action safety.
- [Models](../47_models/README.md) - model family resolution and organization restrictions.
- [Remote Control](../54_remote_control/README.md) - workflow progress/state projection to attached
  clients.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:

- `parseWorkflowDefinition` (`EL`) - parses metadata and extracts the executable body.
- `transformWorkflowAsyncBoundaries` (`dqb`) - rejects unsafe syntax and wraps await boundaries.
- `compileWorkflowScript` (`o0t`) - produces the hardened `vm.Script`.
- `createWorkflowRuntime` (`JFp`) - constructs the VM realm and orchestration API.
- `createWorkflowHooks` (`FFp`) - scheduler, agent, parallel, pipeline, and result accounting.
- `runWorkflowScript` (`ZFp`) - top-level execution and result normalization.
- `WorkflowJournal` (`Hma`) - append-only resume cache.
- `startLocalWorkflowTask` (`Nkn`) - background task registration, progress, and terminal transition.
- `WorkflowTool` (`rnS`) - user/model-facing validation, permission, launch, and rendering contract.
