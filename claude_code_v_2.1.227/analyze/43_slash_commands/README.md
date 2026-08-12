# Slash commands and CLI surface

This module re-derives the complete slash-command architecture from Claude Code 2.1.227. It covers
the command catalog, source precedence, exact-name and alias resolution, interactive/headless
projection, parsing and dispatch, stacked and forked prompt commands, autocomplete ranking and
rendering, renderer-switch persistence, and the `/fork`, `/subtask`, `/doctor`, and `claude doctor`
surfaces previously owned by the 2.1.220 report.

## Documents

- [`slash_command_registry_dispatch_and_menu.md`](slash_command_registry_dispatch_and_menu.md) - deep
  implementation analysis and the exact 2.1.220-to-2.1.227 deltas.

## Principal findings

- Command precedence is established before lookup: project/user skills, workflows, plugin commands,
  plugin skills, bundled skills, built-in-plugin skills, and terminal built-ins are assembled in a
  deliberate order. Exact canonical names beat aliases even when the alias was encountered first.
- Headless filtering is a projection of the same catalog, not a second registry. In 2.1.221, the alias
  collision pass learned to yield terminal-only names such as `help` and `feedback` to plugin- or
  organization-delivered skills in non-interactive sessions.
- Dispatch is type-directed. `local-jsx` commands open UI only in interactive sessions; `local`
  commands return typed results; `prompt` commands pass through expansion hooks and may execute inline,
  as a bounded stack, or in an isolated fork.
- The 2.1.227 menu change is implemented in the shared suggestion renderer: fuzzy hits become bold,
  selection color belongs only to the selected row, and match ranges are expanded to grapheme
  boundaries before slicing emoji or accented text.
- `/tui` now writes an explicit resume leaf through the shared relaunch helper. If a rewind removed all
  conversational messages, it persists a null leaf instead of leaving the old first message as the
  resume point.
- The conditional `/fork`/`/subtask` registry branch and the split between read-only `claude doctor`
  diagnostics and the corrective `/doctor` skill remain present in 2.1.227.

## Confidence

All control-flow claims are **Verified** against
`/lyz/codespace/claude-code-bomb/versions/2.1.227/extract/cli_inner_pretty.js`. The menu, headless
collision, and `/tui` changes are also **Cross-checked** against the 2.1.220 bundle. The readable
2.1.88 source is used only as a semantic cross-check because symbol names and several later command
sources do not exist there.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `assembleCommandCatalog` (`sQb`) - merges every command source in precedence order.
- `resolveCommandsForWorkingDirectory` (`b0`) - adds path-scoped and dynamic skills.
- `filterPluginAliasCollisions` (`cQb`) - protects exact names and applies the headless exception.
- `findCommand` (`WH`) - exact-name-first command lookup with alias fallback.
- `processSlashCommand` (`x5b`) - parse, resolve, normalize, and instrument an invocation.
- `dispatchResolvedSlashCommand` (`I5b`) - type-directed command execution.
- `peelStackedPromptCommands` (`$1p`) - bounded prompt-command chaining.
- `executeForkedSlashCommand` (`k5b`) - isolated agent execution for fork-context skills.
- `buildSlashMenuSuggestions` (`S1l`) - menu filtering and multi-stage ranking.
- `findHighlightRanges` (`Gsm`) - contiguous/subsequence match range construction.
- `expandRangesToGraphemes` (`qsm`) - Unicode-safe range normalization.
- `persistResumeLeafBeforeRelaunch` (`W6t`) - durable renderer/restart resume boundary.
