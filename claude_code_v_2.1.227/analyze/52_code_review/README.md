# Code review in 2.1.227

- [`code_review_runtime.md`](code_review_runtime.md) - full current-build analysis of local route selection,
  model-specific review cells, adaptive finder sizing, structured findings, cloud scope validation, and
  consent-bound PR posting.
- [`review_alias_and_effort_memory.md`](review_alias_and_effort_memory.md) - unified `/review` routing,
  argument parsing, remembered effort, and local/workflow/fork execution decisions.

The current-build document revalidates the full review system against 2.1.227. The focused document
isolates the user-visible 2.1.223 migration from a standalone `/review` command to the richer
`/code-review` pipeline.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `registerCodeReviewCommand` (`dyh`) - registers `/code-review` and the `review` alias.
- `parseCodeReviewArgs` (`GYn`) - separates effort, target, and behavior flags.
- `resolveCodeReviewEffort` (`G3l`) - chooses the effective effort after policy adjustment.
- `buildCodeReviewPrompt` (`dBv`) - selects inline, workflow, or fork-oriented execution text.
- `resolveUltrareviewScope` (`PXo`) - validates PR or branch cloud-review scope.
- `postUltrareviewFindings` (`lXo`) - launches the constrained PR-comment routine.
