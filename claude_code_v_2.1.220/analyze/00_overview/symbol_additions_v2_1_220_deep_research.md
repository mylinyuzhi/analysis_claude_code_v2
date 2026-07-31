# Symbol additions — v2.1.220 `deep-research` (bundled harness + its runtime contract)

> Staged for merge into the four `symbol_index_*.md` files. Each `## Module:` heading names the
> destination file. **Every line number below was read in the 2.1.220 bundle**
> (`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`, `build_sha 4073f595`)
> during the analysis that produced [`../42_workflow/deep_research_harness.md`](../42_workflow/deep_research_harness.md)
> and [`../42_workflow/deep_research_runtime_contract.md`](../42_workflow/deep_research_runtime_contract.md).
> `File:Line` is always `cli_inner_pretty.js:<line>` in the **2.1.220** build.
> Reminder (`_CONVENTIONS.md` §4.1): these ids are re-mangled per build — never carry them to another tree.

Row format: `| Obfuscated | Readable | File:Line | Type |`, sorted alphabetically by obfuscated id
within each section.

**Already indexed elsewhere — not repeated here** (use the existing readable names):
`kxo` `SSd` `OJy` `mRd` `hRd` `uRd` `dRd` `pRd` `fRd` `MJy` `PJy` (→
`symbol_index_core_features.md` → *Code Review — bundled workflows and effort cells*);
`Kep` `ZXn` `Qcg` (→ *Code Review — system-prompt restraint (deep research)*);
`zSd` `eEd` `rEd` `Osn` `Fxo` `V$t` `UWy` `zWy` `KWy` `YWy` `WSd` `BSd` `Bxo` `r6y` `JWy` `e6y`
`ZWy` `QWy` `eMs` `t6y` `FSd` `VWy` `u6y` `yEd` `S6y` `dk` `z$t` `LSd` (→
`symbol_additions_v2_1_220_workflow.md`); `yPu` `_ty` `Zch` (→ `symbol_index_core_execution.md`);
`bV` (→ `symbol_index_infra_integration.md`); `M0` `Ke` (→ `symbol_index_infra_platform.md`).

---

## Module: Workflow — bundled registry and command projection

**Merge into:** `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dsn` | resolveWorkflowByName | cli_inner_pretty.js:388331-388333 | function |
| `HM_` | getWorkflowCommands | cli_inner_pretty.js:506559-506562 | function |
| `Jxo` | invalidateWorkflowCache | cli_inner_pretty.js:388334-388336 | function |
| `ksn` | getBundledWorkflows | cli_inner_pretty.js:385336-385339 | function |
| `Lep` | createWorkflowCommand | cli_inner_pretty.js:506513-506557 | function |
| `Lft` | getAllWorkflows (memoised; built-in < plugin < user) | cli_inner_pretty.js:388346-388356 | function |
| `Qxo` | redactWorkflowNameForTelemetry | cli_inner_pretty.js:388577-388580 | function |
| `tMs` | isVerbatimBuiltInWorkflow | cli_inner_pretty.js:388574-388576 | function |
| `Zxo` | redactWorkflowDescriptionForTelemetry | cli_inner_pretty.js:388581-388584 | function |

## Module: Skills — model-invocation gating and the skill listing

**Merge into:** `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BLo` | buildModelVisibleSkillSet | cli_inner_pretty.js:441278-441285 | function |
| `FLo` | renderSkillListingLines | cli_inner_pretty.js:441264-441276 | function |
| `oin` | checkSkillInvocationBlocked (the `!userTypedThisTurn` refusal) | cli_inner_pretty.js:346456-346463 | function |
| `oKe` | isModelInvocableCommand (filters `disableModelInvocation` out of the listing) | cli_inner_pretty.js:506851-506863 | function |
| `YFo` | buildSkillListingReminder | cli_inner_pretty.js:499488-499499 | function |
| `zL` | getModelInvocableCommands (memoised, applies `oKe`) | cli_inner_pretty.js:507331-507334 | variable |
| `zNy` | didUserTypeCommandThisTurn | cli_inner_pretty.js:346566-346569 | function |

## Module: Slash Commands — registry and dispatch

**Merge into:** `symbol_index_infra_integration.md` (existing section of this name)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `GBo` | loadAllSlashCommands (merges workflow commands in) | cli_inner_pretty.js:507314-507328 | variable |
| `JJa` | buildCommandMenuRow (emits the `dynamic workflow` tag) | cli_inner_pretty.js:744010-744026 | function |
| `nw` | loadCommandRegistry | cli_inner_pretty.js:506699 | function |
| `PYe` | describeCommandForListing (appends `(dynamic workflow)`) | cli_inner_pretty.js:506916-506918 | function |
| `Uep` | getWorkflowCommandsRef (late-bound `HM_`) | cli_inner_pretty.js:507313 | variable |

## Module: Core execution — structured output tool

**Merge into:** `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aPu` | STRUCTURED_OUTPUT_TOOL_CACHE (schema-identity keyed) | cli_inner_pretty.js:231147 (decl) | variable |
| `dty` | STRUCTURED_OUTPUT_SCHEMA_NODE_CAP (= `1e5`) | cli_inner_pretty.js:231148 | constant |
| `Eg` | STRUCTURED_OUTPUT_TOOL_NAME | cli_inner_pretty.js:231145 | constant |
| `fty` | compileStructuredOutputToolUncached | cli_inner_pretty.js:231103 | function |
| `pty` | STRUCTURED_OUTPUT_SCHEMA_DEPTH_CAP (= `1e4`) | cli_inner_pretty.js:231149 | constant |
| `uPu` | schemaExceedsSizeBudget | cli_inner_pretty.js:231097-231102 | function |
| `wir` | compileStructuredOutputTool (memoised) | cli_inner_pretty.js:231091-231096 | function |

---

## Verification notes

- `Eg` = `"StructuredOutput"` is referenced from the workflow runtime at `:387447` (appending it to a
  custom agent's explicit tool list) and `:387466` (stripping an inherited one before appending the
  schema-bound one). Its prose appearances are in `ZWy` `:388196-388200` and `e6y` `:388201-388207`.
- `zL`'s memo key and `Lft`'s memo key both fold in `bV()` (bundled-skills disabled), so toggling
  `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS` invalidates both correctly.
- `tMs`/`Qxo`/`Zxo` gate what `tengu_workflow_launched` reports (`:389528-389538`); the deciding
  input is `scriptMatchesDefinition` from `yEd` (`:389197-389198`, `:389210`), not `source` alone.
