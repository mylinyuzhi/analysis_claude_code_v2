# 41 - Hooks

This module re-derives the complete hook runtime from Claude Code 2.1.227. It covers the same scope as
the 2.1.220 report, but treats 2.1.227 as an independent target: identifiers, line locations, source
merging, matching, execution, output translation, trust, and asynchronous delivery were all checked
again in the current bundle.

## Current result

The public event surface is stable across the comparison: both 2.1.220 and 2.1.227 enumerate the same
31 hook events in the same order. The five settings-defined hook types are also retained: `command`,
`prompt`, `agent`, `http`, and `mcp_tool`. Two internal types, `callback` and `function`, support SDK and
in-process control paths.

The important post-2.1.220 change is not a new event. The 2.1.222 fix strengthens the consumer-side
permission boundary for internal background forks. Those forks now default `requireCanUseTool` to
true, so a PreToolUse `allow` cannot bypass the restricted `canUseTool` path used by summaries,
compaction, renames, and similar automated jobs. The hook dispatcher still proposes a decision; the
permission engine remains the final authority.

Other current-runtime findings:

- Hook selection merges managed, settings, plugin, agent-frontmatter, and skill-frontmatter sources,
  with managed-only and workspace-trust gates applied before execution.
- Matching is two-stage: an event-specific `matcher`, followed by an optional tool permission-rule
  `if:` expression.
- The interactive runner streams progress and semantic result fields; the ambient runner returns a
  bounded batch for lifecycle events.
- Settings hooks run concurrently after selection and de-duplication, while result aggregation uses a
  deterministic permission precedence: deny, defer, ask, allow, passthrough.
- Command hooks support shell form and injection-resistant exec form. Plugin option substitution is
  rejected in shell form and allowed only as element-wise exec arguments or environment variables.
- Hook JSON is schema-validated, large context is persisted out of band, terminal escape sequences are
  allowlisted, and asynchronous responses are delivered at most once.

## Documents

- [hook_runtime_matching_execution_and_trust.md](hook_runtime_matching_execution_and_trust.md) - the
  2.1.227 architecture, source/trust gates, matcher algorithm, all runner types, command security,
  exit/result semantics, permission aggregation, async lifecycle, ambient events, and the exact
  post-2.1.220 assessment.

The earlier 2.1.220 event-specific reports remain useful historical evidence, but this directory is
the authoritative current-runtime analysis for 2.1.227.

## Related modules

- [Permissions](../38_permissions/README.md) - final PreToolUse arbitration, auto-mode floors, and the
  2.1.222 background-fork hardening.
- [MCP](../39_mcp/README.md) - MCP client discovery and calls used by `mcp_tool` hooks and elicitation
  events.
- [Compaction](../07_compact/README.md) - consumers of PreCompact and PostCompact results.
- [Background agents](../36_background_agents/README.md) - restricted fork contexts and task
  notifications.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:

- `collectHooksForEvent` (`meS`) - merges eligible sources for one event.
- `getMatchingHooks` (`H_a`) - applies event matchers, de-duplication, and `if:` conditions.
- `executeHooks` (`jN`) - public streaming entry point.
- `runHooksStreaming` (`JWp`) - concurrent interactive execution and deterministic aggregation.
- `executeHooksOutsideREPL` (`zN`) - ambient/lifecycle batch runner.
- `spawnHookCommand` (`iri`) - command environment, process, timeout, and async boundary.
- `translateHookJsonResult` (`mIn`) - converts validated JSON into typed runtime effects.
- `registerAsyncHook` (`YWp`) - ordinary background and async-rewake registration.
- `isAgentHookOriginTrusted` (`VJo`) - validates the definition folder for frontmatter hooks.
