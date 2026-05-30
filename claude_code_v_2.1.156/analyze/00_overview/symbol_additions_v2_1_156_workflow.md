# Symbol Additions — v2.1.156 Dynamic Workflows (module 42_workflow)

These mappings cover every obfuscated identifier introduced or touched by the v2.1.156 **Dynamic
Workflows** module (FLAGSHIP, new in 2.1.154): the `Workflow` tool object and its lazy Zod schemas, the
four-layer enablement gate, the long opt-in description prompt, the `meta` AST parser, the
six-error-code `validateInput` flow, ask-by-default permissions, fire-and-forget script persistence and
UNC rejection, telemetry helpers, and the tool factory / compile / permission-lookup helpers the tool
is built from.

Each row gives the v2.1.156 obfuscated identifier, the readable name, `file:line`, and type. Every line
was verified by reading `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
at that location.

Cross-validated against:
- v2.1.156 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/` (no Workflow runtime/gate precursor — the only
  `Workflow`-named file, `src/components/WorkflowMultiselectDialog.tsx`, is an unrelated GitHub Actions
  installer; the `WORKFLOW_SCRIPTS`-gated scaffolding is stripped from the public tree)
- Module docs: `claude_code_v_2.1.156/analyze/42_workflow/{workflow_tool_definition,gate_caps_lifecycle_relations}.md`

> **Home modules:** Most rows belong to `symbol_index_core_features.md` (Workflows is the home module).
> Two rows are platform-infra (`tm` UNC detector, `d6H` permission-rule lookup → `symbol_index_infra_platform.md`)
> and two are core-execution (`yK` tool factory, `P45` tool defaults → `symbol_index_core_execution.md`).
> They live here, consolidated, while the v2.1.156 module is being reviewed.

> **Line-number notes (single source of truth):**
> - `Fp6` is declared as `Fp6;` at 376074 and assigned at 376077; the row below cites the assignment (376077).
> - `mx` is the constant at 216291; `m57` (the `workflowExports` namespace) is at 216289 with its lazy
>   `WORKFLOW_TOOL_NAME` getter wired at 216290.
> - `$48` (`workflowAvailabilityCache`) is the `var $48;` declaration at 184789, populated lazily by `KP6`.
> - `RZ_` is declared `var RZ_;` at 371853 and assigned the `Set(["__proto__","constructor","prototype"])` at 371856.

---

## Module: Dynamic Workflows

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$48` | `workflowAvailabilityCache` (module-level memo for `SL5()` result; populated by `KP6`) | cli_inner_pretty.js:184789 | variable |
| `b44` | `resolveWorkflowSource` (resolve `scriptPath` > `name` > `script` to a script string + telemetry source) | cli_inner_pretty.js:378081 | function |
| `bZ_` | `validateMetaFields` (require non-empty `name`/`description`; optional `title`/`whenToUse`; normalize `phases`) | cli_inner_pretty.js:371832 | function |
| `BP8` | `compileWorkflowScript` (wrap the script body in an `async () => {}` and compile to a VM script) | cli_inner_pretty.js:367468 | function |
| `c0_` | `WORKFLOW_DESC_TELEMETRY_CAP` (`200` — char cap on the workflow description sent in telemetry) | cli_inner_pretty.js:378111 | constant |
| `CZ_` | `metaPropertyKey` (resolve a `meta` object-literal property key, rejecting computed/reserved keys) | cli_inner_pretty.js:371824 | function |
| `d0_` | `workflowNameForTelemetry` (built-in name verbatim, else `"custom"`) | cli_inner_pretty.js:378099 | function |
| `d6H` | `lookupPermissionRules` (collect allow/deny/ask rules for a tool into a `Map<ruleContent, rule>`) | cli_inner_pretty.js:442061 | function |
| `d9H` | `slugifyWorkflowName` (lowercase to `[a-z0-9-]`, fall back to `"workflow"`) | cli_inner_pretty.js:145267 | function |
| `Fp6` | `WORKFLOW_DESCRIPTION` (the long opt-in policy + scripting-DSL reference returned by `prompt()`/`description()`) | cli_inner_pretty.js:376077 | variable |
| `FZ` | `parseWorkflowMeta` (Acorn-parse, assert first statement is `export const meta = <literal>`, eval it, split body) | cli_inner_pretty.js:371746 | function |
| `g0_` | `workflowOutputSchema` (lazy Zod `object` for the tool result: `status`/`taskId`/`runId`/`scriptPath`/…) | cli_inner_pretty.js:378186 | variable |
| `H48` | `isWorkflowsManagedDisabled` (env `CLAUDE_CODE_DISABLE_WORKFLOWS` true or managed `disableWorkflows === true`) | cli_inner_pretty.js:184750 | function |
| `Hj$` | `readWorkflowScriptFile` (read a `scriptPath` from disk, rejecting UNC paths, bounded at `jI + 1` bytes) | cli_inner_pretty.js:145294 | function |
| `hL5` | `getUserWorkflowSetting` (read managed/user `enableWorkflows` setting; overrides the tier default) | cli_inner_pretty.js:184773 | function |
| `i$7` | `isWorkflowsLaunchable` (`r$7() && !CLAUDE_CODE_DISABLE_WORKFLOWS && KP6().available`) | cli_inner_pretty.js:184767 | function |
| `IZ_` | `isMetaExport` (assert an `ExportNamedDeclaration` is `const meta = <ObjectExpression>`) | cli_inner_pretty.js:371779 | function |
| `jI` | `WORKFLOW_SCRIPT_MAX_BYTES` (`524288` = 512 KiB script-size cap) | cli_inner_pretty.js:145308 | constant |
| `KP6` | `resolveWorkflowAvailabilityCached` (memoize `SL5()` into `$48`) | cli_inner_pretty.js:184776 | function |
| `l0_` | `workflowDescriptionForTelemetry` (built-in description truncated to `c0_`, else empty) | cli_inner_pretty.js:378103 | function |
| `m57` | `workflowExports` (namespace object exposing the lazy `WORKFLOW_TOOL_NAME` getter) | cli_inner_pretty.js:216289 | object |
| `mx` | `WORKFLOW_TOOL_NAME` (the string `"Workflow"`) | cli_inner_pretty.js:216291 | constant |
| `n0_` | `workflowTool` (the tool object built by `yK`; `aliases:["RunWorkflow"]`, `searchHint`, schemas, gate, validate, permissions, call) | cli_inner_pretty.js:378217 | object |
| `NZ` | `isWorkflowsEnabled` (four-layer master gate: `!H48() && r$7() && KP6().available && (hL5() ?? defaultOn)`) | cli_inner_pretty.js:184757 | function |
| `O68` | `workflowScriptsDir` (`<sessionRoot>/<sessionId>/workflows/scripts/` + sep) | cli_inner_pretty.js:145274 | function |
| `P45` | `TOOL_DEFAULTS` (default tool fields — `isEnabled`/`checkPermissions`/`toAutoClassifierInput`/… — spread by `yK`) | cli_inner_pretty.js:143499 | object |
| `pK4` | `evalLiteralNode` (recursively evaluate only pure-literal AST nodes; throw on non-literal node types) | cli_inner_pretty.js:371786 | function |
| `Q0_` | `workflowInputSchema` (lazy Zod `strictObject` for tool input: `script`/`name`/`scriptPath`/`args`/`resumeFromRunId`/…) | cli_inner_pretty.js:378140 | variable |
| `r$7` | `isWorkflowsPolicyAllowed` (Statsig/managed `allow_workflows` capability gate) | cli_inner_pretty.js:184770 | function |
| `RZ_` | `RESERVED_META_KEYS` (`Set(["__proto__","constructor","prototype"])` — prototype-pollution guard for `meta`) | cli_inner_pretty.js:371853 | constant |
| `SL5` | `resolveWorkflowAvailability` (`{available, defaultOn}` from `CLAUDE_CODE_WORKFLOWS` env + `tengu_workflows_enabled` gate + tier; `defaultOn = tier !== "pro"`) | cli_inner_pretty.js:184780 | function |
| `tm` | `isUncPath` (`/^[\\/]{2}/` two-leading-slash UNC detector — shared util, load-bearing for workflow `scriptPath` security) | cli_inner_pretty.js:8587 | function |
| `UK4` | `evalObjectLiteral` (statically evaluate the `meta` object literal; ban computed keys, methods, reserved keys) | cli_inner_pretty.js:371813 | function |
| `xFK` | `persistWorkflowScript` (fire-and-forget write of the script to the session dir at mode `0o600`; return path synchronously) | cli_inner_pretty.js:145280 | function |
| `xZ_` | `normalizeMetaPhases` (coerce `meta.phases` to `{title, detail?, model?}[]`, dropping entries without a string `title`) | cli_inner_pretty.js:371842 | function |
| `Y95` | `workflowScriptPath` (`${workflowScriptsDir()}${slug}-${runId}.js`) | cli_inner_pretty.js:145277 | function |
| `yK` | `makeTool` (tool factory: spread `P45` defaults under the supplied definition, preserving getters via `getOwnPropertyDescriptors`) | cli_inner_pretty.js:143482 | function |

---

## Module: Dynamic Workflows — Control Plane (gate_caps_lifecycle_relations.md)

These rows cover the control-plane symbols analyzed in
`42_workflow/gate_caps_lifecycle_relations.md`: the rest of the enablement gate family, the per-turn
keyword opt-in, first-use consent, the four runtime resource caps, the append-only resume
journal/snapshot, the launch → flush → completion lifecycle + telemetry, the `/workflows` save/command/
viewer, and the `ultracode` standing-orchestration mode. Every line was verified against the v2.1.156
bundle; they mirror (and are kept consistent with) the same rows already merged into the Dynamic
Workflows / Effort sections of `symbol_index_core_features.md`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Q4` | `saveWorkflow` (persist a named workflow, refuse-clobber-unless-overwrite, emits `tengu_workflow_saved`) | cli_inner_pretty.js:507621 | function |
| `_1z` | `getProjectWorkflowsDir` (project-scope `<project>/.claude/workflows/` path for save) | cli_inner_pretty.js:507616 | function |
| `ar` | `isUltracodeActive` (`q && NZ() && resolveEffort()==="xhigh"`; slider-rail + consent short-circuit) | cli_inner_pretty.js:184856 | function |
| `b74` | `listWorkflowSnapshots` (read + sort run snapshots for `/workflows`) | cli_inner_pretty.js:374781 | function |
| `Bg6` | `matchKeyword` (generic keyword matcher with code-span/path/flag masking; shared with ultraplan/ultrareview) | cli_inner_pretty.js:412125 | function |
| `bp6` | `LocalFileJournal` (append-only `journal.jsonl` per run) | cli_inner_pretty.js:374871 | class |
| `C74` | `writeWorkflowSnapshot` (write the run snapshot JSON for `/workflows` history) | cli_inner_pretty.js:374771 | function |
| `cG_` | `WORKFLOW_PARALLEL_DEFAULT` (concurrency limit seeded from CPU count via `dG_`) | cli_inner_pretty.js:375676 | variable |
| `dG_` | `computeWorkflowConcurrency` (`min(16, max(2, cores-2))`) | cli_inner_pretty.js:374930 | function |
| `Djz` | `isLocalWorkflowTask` (`task.type === "local_workflow"` — app-state task filter for the viewer's live runs) | cli_inner_pretty.js:538819 | function |
| `Dk5` | `getCoordinatorSystemPrompt` (coordinator system prompt with the `NZ()`-gated Workflow tool clause) | cli_inner_pretty.js:216506 | function |
| `F74` | `WORKFLOW_AGENT_CAP` (`1000` agent-call ceiling) | cli_inner_pretty.js:375678 | constant |
| `fW8` | `WorkflowBudgetExceededError` (thrown when the output-token budget is spent) | cli_inner_pretty.js:375746 | class |
| `gG_` | `canonicalizeAgentOpts` (stable JSON of cache-relevant opts: schema/model/isolation/agentType) | cli_inner_pretty.js:374847 | function |
| `gt4` | `WorkflowHistoryDialog` (`/workflows` viewer component; merges live + snapshot runs, list/detail modes) | cli_inner_pretty.js:538403 | React component |
| `gtH` | `registerSessionHook` (generic session-hook registrar; powers the StructuredOutput nudge) | cli_inner_pretty.js:372079 | function |
| `H0_` | `WORKFLOW_LOG_CAP` (`1000` — max log lines kept by `q44`) | cli_inner_pretty.js:376011 | constant |
| `KR_` | `makeWorkflowKeywordReminder` (emits `tengu_workflow_keyword` + `workflow_keyword_request` reminder) | cli_inner_pretty.js:412916 | function |
| `lG_` | `WORKFLOW_PIPELINE_DEFAULT` (`50` default pipeline concurrency) | cli_inner_pretty.js:375677 | constant |
| `lj4` | `hasWorkflowKeyword` (`pg6(text).length > 0`) | cli_inner_pretty.js:412178 | function |
| `m74` | `journalKey` (SHA-256 cache key `v2:<hash>` of phase + prompt + canonical opts) | cli_inner_pretty.js:374867 | function |
| `nG_` | `agentCapErrorMessage` (diagnostic text for `Q74` — the `budget.remaining()` infinite-loop hint) | cli_inner_pretty.js:375736 | constant |
| `o0_` | `recordWorkflowUsageConsent` (persists `skipWorkflowUsageWarning`, emits `tengu_workflow_usage_warning_accepted`) | cli_inner_pretty.js:378654 | function |
| `o74` | `getBuiltinWorkflows` (returns the built-in workflow list `r74`, empty in this build) | cli_inner_pretty.js:375876 | function |
| `pg6` | `findWorkflowKeyword` (`Bg6(text, "workflows?")` — match prose keyword outside code spans) | cli_inner_pretty.js:412172 | function |
| `Pi_` | `setUltracodeAppState` (reducer: `{...s, effortValue:"xhigh", ultracode:true}`) | cli_inner_pretty.js:461114 | function |
| `Pjz` | `workflowsCommand` (`/workflows` local-jsx slash command, gated on `NZ()`) | cli_inner_pretty.js:538934 | object |
| `Q74` | `WorkflowAgentCapError` (thrown at the `F74` agent cap) | cli_inner_pretty.js:375740 | class |
| `qP6` | `getWorkflowDefaultOn` (`KP6().defaultOn`) | cli_inner_pretty.js:184764 | function |
| `QG_` | `JOURNAL_KEY_VERSION` (`"v2"` cache-key prefix; bump invalidates all journals) | cli_inner_pretty.js:374910 | constant |
| `q44` | `runWorkflowScript` (executes the VM script, returns `{result, agentCount, logs, failures, durationMs, error?}`) | cli_inner_pretty.js:376007 | function |
| `r0_` | `workflowNeedsUsageConsentPrompt` (gate for the one-time usage warning; ultracode short-circuits via `ar`) | cli_inner_pretty.js:378645 | function |
| `r74` | `BUILTIN_WORKFLOWS` (the built-in workflow array; assigned `[]` in this build) | cli_inner_pretty.js:375880 | variable |
| `sF$` | `hasWorkflowUsageConsent` (checks `skipWorkflowUsageWarning` across settings scopes) | cli_inner_pretty.js:53591 | function |
| `tG_` | `WORKFLOW_STALL_MS_DEFAULT` (`180000` = 3 min per-agent stall timeout) | cli_inner_pretty.js:375699 | constant |
| `TrH` | `emitTaskProgress` (flush a `task_progress` system message to the UI progress tree, 16ms-batched) | cli_inner_pretty.js:278050 | function |
| `Vx` | `ultracodeAvailable` (`workflowsEnabled() && (model===undefined || modelSupportsXhighEffort(model))`) | cli_inner_pretty.js:184853 | function |
| `wjz` | `getWorkflowRunId` (`task.workflowRunId` accessor; keys the live + snapshot de-dup in the viewer's merge effect at 538436) | cli_inner_pretty.js:538816 | function |
| `x74` | `indexJournal` (fold journal lines into `{results, started}` maps) | cli_inner_pretty.js:374835 | function |
| `zP6` | `readUltracodeFlag` / `isUltracodeOn` (`i6().ultracode === true`; side-effect `SI()` releases the launch latch) | cli_inner_pretty.js:184884 | function |

> **Effort-system overlap.** The `ultracode` rows (`ar`, `Pi_`, `Vx`, `zP6`) and the shared effort
> resolver/gates (`or`, `ycH`) are the workflow-facing slice of the effort system; their canonical home
> is the **Effort** section of `symbol_index_core_features.md` (and they are documented in depth in
> `43_model_opus48/`). They are listed here because `gate_caps_lifecycle_relations.md` Part 6 analyzes
> them as part of the workflow control plane.

---

## Notes on home-index placement

When these rows are merged into the central index, split them as follows (so each lands in its
single-source-of-truth file):

- **`symbol_index_core_features.md`** (Module: Dynamic Workflows) — all rows **except** the four below
  and the effort-overlap rows noted above. (All of these are already present in the central index's
  Dynamic Workflows / Effort sections; this additions file is the staging mirror.)
- **`symbol_index_core_execution.md`** (Tools) — `yK` (`makeTool`), `P45` (`TOOL_DEFAULTS`). These are
  generic tool-runtime helpers the Workflow tool is built from, not workflow-specific.
- **`symbol_index_infra_platform.md`** — `tm` (`isUncPath`, a shared path util; Permissions/Sandbox area)
  and `d6H` (`lookupPermissionRules`, Permissions).

Status: as of this finalize pass the control-plane rows above have been merged into
`symbol_index_core_features.md` (Dynamic Workflows §Gate/Keyword/Consent/Caps/Journal/Lifecycle/Save-UI/
Coordinator + Effort §ultracode). This combined additions file (data plane + control plane) is the
comprehensive, deduplicated table the `42_workflow/` module docs reference.
