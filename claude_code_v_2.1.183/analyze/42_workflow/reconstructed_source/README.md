# Workflow / ultracode — Readable-Source Restoration (v2.1.183)

> **What this is.** A *readable-source-level* reconstruction of the **entire** Dynamic-Workflow /
> `ultracode` subsystem **as it exists in Claude Code v2.1.183** — not a delta, the *whole machine* —
> written as clean TypeScript organized the way the genuine Anthropic source tree (the v2.1.88
> named-TS at `/lyz/codespace/3rd/claude-code/src`) organizes it.
>
> **Why it exists.** The sibling docs in `42_workflow/` (`README.md`, `ultracode_keyword_trigger_delta.md`,
> `tool_definition_fixes_delta.md`, `runtime_fixes_delta.md`) are a *verified 2.1.156 → 2.1.183 delta*:
> they document only what changed and defer the unchanged spine to the v2.1.156 baseline. This
> directory completes the picture by restoring the full subsystem at the source level, so you can read
> the implementation top-to-bottom without cross-referencing two version trees.
>
> Every behavior here is backed by a v2.1.183 line that was read directly; every reconstructed
> function carries a `// 2.1.183: <readable> = <obf> @<line>` anchor so any claim can be re-verified in
> seconds.

---

## How to read these files (the three evidence tiers)

These files were built — and adversarially verified — under a strict evidence discipline (the full
rules live in [`_conventions.md`](./_conventions.md)):

1. **PRIMARY — truth.** The v2.1.183 obfuscated bundle
   `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
   Every symbol, constant, branch, and string was verified by reading the exact line(s). Obfuscated
   names re-mangle every build, so all were re-derived in this build.
2. **SCAFFOLD — readable logic & names.** The v2.1.156 baseline analysis
   (`../../../claude_code_v_2.1.156/analyze/42_workflow/`) supplied the readable logic and the
   established readable names for the unchanged spine — each claim re-verified against the 183 bundle.
3. **CONVENTION ONLY — file shape.** The v2.1.88 named-TS source. The Workflow feature is *gated out*
   there (`feature('WORKFLOW_SCRIPTS')`), so there is **no implementation to copy** — only the *shape*:
   the `tools/WorkflowTool/` one-tool-per-directory layout, the `Tool`/`buildTool` factory and
   `ValidationResult` type, Zod v4, ESM `.js` import specifiers on `.ts`, React/Ink `.tsx`, the
   `local_workflow` task type (`Task.ts`, id-prefix `'w'`), and the gated-but-referenced paths
   `tools/WorkflowTool/{WorkflowTool.tsx,bundled/index.ts,createWorkflowCommand.ts}`,
   `commands/workflows/index.ts`, `tasks/LocalWorkflowTask/LocalWorkflowTask.ts`.

---

## File map

Each `.ts`/`.tsx` file restores one slice of the subsystem. The **mirrors** column is the v2.1.88
path whose conventions the file imitates (shape only); the **v2.1.183 regions** column is the load-
bearing source span (all line numbers are `cli_inner_pretty.js`).

| File | Restores | Mirrors (v2.1.88 convention) | v2.1.183 regions |
|------|----------|------------------------------|------------------|
| [`gate_and_effort.ts`](./gate_and_effort.ts) | The 4-layer enablement gate (`isWorkflowsEnabled` and its managed-disabled / policy / availability / user-setting chain) **and** the `ultracode` effort resolution (`isUltracodeOn`, `supportsXhighEffort`, `resolveEffort` xhigh-downgrade, the `/effort ultracode` gate, `normalizeEffort`). | `utils/model` effort helpers; `tools.ts` `feature('WORKFLOW_SCRIPTS')` gating | 148777–148810, 148878–148970 |
| [`keyword.ts`](./keyword.ts) | The per-turn `ultracode` keyword detector (`matchKeyword` code-span masking, `findUltracodeKeyword`/`hasUltracodeKeyword`, the delimiter map, the `ultraplan`/`ultrareview` siblings), the model-facing reminder injection + renderer, and the `workflowKeywordTriggerEnabled` settings reader + schema. | `utils/processUserInput`, `utils/messages`; `schemas/` (Zod v4) | 464214–464290, 464660–464885, 590606–590615, 148797–148799, 55997–56012 |
| [`highlight.tsx`](./highlight.tsx) | The input-box keyword highlight (the span memo + the **dedicated violet shimmer** that replaced the shared rainbow), the `/config` "Ultracode keyword trigger" toggle row, and the alt+w "ignore" toggle. | `screens/REPL.tsx` Ink highlight memo; config UI components | 622220–622370, 154105–154115, 479201–479230 |
| [`schemas.ts`](./schemas.ts) | The Zod input/output schemas (`workflowInputSchema` with its `.refine`, `workflowOutputSchema` with the new `taskType`/`workflowName` fields), the `WorkflowInputError` class, and the `serverFallbackRetraction` (errorCode 7) result + its `abortedByServerFallback` predicate. | `entrypoints/sdk/coreSchemas.ts`; `Tool.ts` `ValidationResult` | 419334–419419, 227026–227028 |
| [`WorkflowTool.tsx`](./WorkflowTool.tsx) | The tool registration object: name/aliases, lazy schemas, the description, `validateInput` (the **7-code error ladder**), `checkPermissions` (ask-by-default + name-scoped allow suggestion), and `call` (the fire-and-forget launch front-half). | `Tool.ts` `buildTool`; `tools/AgentTool/AgentTool.tsx` layout | 419334–419846 |
| [`source.ts`](./source.ts) | Source resolution precedence (`resolveWorkflowSource`: `scriptPath` > `name` > inline `script`), the `scriptPath` file read with UNC rejection, named-workflow lookup, and the 512 KiB size cap. | `tools/WorkflowTool/createWorkflowCommand.ts`; `utils/filePersistence` | 419272–419334, 152126–152141 |
| [`meta.ts`](./meta.ts) | The `meta` AST parser (`parseWorkflowMeta`: first-statement `export const meta` rule, pure-literal eval, prototype-pollution key ban, body splitter) and the **static** determinism check (`isNonDeterministic`, the 2.1.172 regex→AST-walk fix). | `tools/WorkflowTool/`; acorn / acorn-walk usage | 416439–416560 |
| [`runtime.ts`](./runtime.ts) | The VM runtime spine: compile (top-level-await instrumentation + `vm.Script` over an async IIFE), context assembly + the SES-style intrinsic hardening membrane, the DSL primitives (`agent`/`parallel`/`pipeline`/`phase`/`log` + nested `workflow`), the **runtime** determinism sandbox (throws at execution), the frozen `budget`, the concurrency formula, and the local/remote executors. | `utils/task/framework.ts` ALS; `tools/AgentTool/runAgent.ts`; `node:vm` | 411340–411720, 416277–417720, 418026–418155 |
| [`subagents.ts`](./subagents.ts) | The per-`agent()` subagent spawn: agent-def selection (plain vs StructuredOutput vs custom), the verbatim subagent system prompts, the per-agent `effort` merge, the **agent-context attribution object** (the 2.1.174 fix), worktree isolation, and the query/stream loop. | `tools/AgentTool/{runAgent,builtInAgents,forkSubagent}.ts` | 417089–417416, 417700–417825 |
| [`journal.ts`](./journal.ts) | The journal / resume protocol: the `journal.jsonl` append/read, the SHA-256 cache key (`v2:` versioned, over the canonicalized `(phase, prompt, opts)`), longest-unchanged-prefix replay with deep-clone, respawn detection, and the `/workflows` snapshot. | `utils/filePersistence`; `tasks/LocalWorkflowTask`; `crypto` | 416700–417060, 416802–416900 |
| [`prompt.ts`](./prompt.ts) | The `WORKFLOW_DESCRIPTION` authoring prompt restored verbatim as an exported template literal (opt-in forms, the DSL signature reference incl. per-agent `effort?`, the Understand/Design/Review/Research/Migrate pattern catalog, the adversarial-verify / judge-panel / loop-until-dry catalog, the Ultracode standing-opt-in). | `tools/AgentTool/prompt.ts` exported description literal | 418164–418330 |
| [`commands_and_task.ts`](./commands_and_task.ts) | The `/workflows` slash command (now `immediate`), `saveWorkflow`, the tool-name/exports, and the `local_workflow` background-task launch + the `<task-notification>` envelope. | `commands/workflows/index.ts`; `Task.ts` (`local_workflow`); `tasks/LocalWorkflowTask/` | 562632–562645, 530752–530775, 221489–221555, plus the launch IIFE 419547–419788 |
| [`constants.ts`](./constants.ts) | **The leaf single-source-of-truth:** every numeric cap (agent cap 1000, stall 180 s, remote 50, stall-retry 5, preview 400, script 512 KiB), the cap message, and the two cap/budget error classes. | `tools/AgentTool/constants.ts` | 417717–417742, 152140, 417781–417798 |

> Note on file boundaries: the v2.1.183 bundle is a single concatenated file, so several of these
> modules are co-located there (e.g. the runtime hooks, executors, and spawn loop all live inside one
> closure `EWa` @416901–417713). The split into `runtime.ts` / `subagents.ts` / `journal.ts` /
> `constants.ts` follows the v2.1.88 module conventions; each file's header discloses where its content
> physically sits in the bundle. The behavior is faithful to those exact lines — only the grouping is a
> convention choice.

---

## Module dependency graph (no cycles)

```
constants.ts        (leaf — imports no sibling)
   ▲   ▲   ▲   ▲
   │   │   │   └──────────── journal.ts        (AGENT_PREVIEW_MAX)
   │   │   └──────────────── schemas.ts        (WORKFLOW_SCRIPT_MAX_BYTES, TASK_STOP_TOOL_NAME)
   │   └──────────────────── subagents.ts      (caps + error classes;  + type WorkflowToolContext from runtime.ts)
   └──────────────────────── runtime.ts        (caps + error classes;  owns computeWorkflowConcurrency + DEFAULT_WORKFLOW_CONCURRENCY)

runtime.ts  ←  meta.ts, source.ts, workflowRegistry
WorkflowTool.tsx  ←  schemas.ts, source.ts, meta.ts, gate_and_effort.ts, prompt.ts, runtime.ts, constants.ts
keyword.ts / highlight.tsx  ←  gate_and_effort.ts (and keyword.ts)
commands_and_task.ts  ←  runtime.ts, gate_and_effort.ts
```

`constants.ts` is deliberately a **dependency-free leaf** so both `runtime.ts` and `subagents.ts`
can import the caps and the two error classes (`WorkflowAgentCapError`, `WorkflowBudgetExceededError`)
from one place without an import cycle. The derived `DEFAULT_WORKFLOW_CONCURRENCY` (which needs the
`computeWorkflowConcurrency` formula) lives in `runtime.ts`, where the source seeds it once as `Y0p`
(@417780) — keeping `constants.ts` free of any computed dependency.

---

## Suggested reading order

1. **`constants.ts`** — the caps and error classes; the resource model in one screen.
2. **`gate_and_effort.ts`** — is the feature on, and what does `ultracode` do to effort?
3. **`keyword.ts` → `highlight.tsx`** — how a typed `ultracode` keyword is detected, gated, reminded, and rendered.
4. **`prompt.ts`** — what the model is actually told about orchestration (the authoring contract).
5. **`schemas.ts` → `WorkflowTool.tsx` → `source.ts` → `meta.ts`** — the tool boundary: schema → validate → resolve source → parse `meta` + static determinism check.
6. **`runtime.ts` → `subagents.ts` → `journal.ts`** — the engine: compile/VM/DSL → spawn one subagent → cache/resume.
7. **`commands_and_task.ts`** — `/workflows`, `saveWorkflow`, and the background-task launch + notification.

For *what changed* between v2.1.156 and v2.1.183 specifically, read the delta docs one level up
([`../README.md`](../README.md)). For the still-authoritative narrative of the unchanged subsystems,
the v2.1.156 baseline is linked from each file's header.

---

## Verification status

All 13 files were produced by a reconstruction agent and then **independently re-verified by a
separate adversarial agent** that re-read the cited v2.1.183 lines (≈300 anchors re-checked across the
set) and fixed or flagged any drift. Representative defects caught and fixed during verification:

- `runtime.ts` — the six DSL primitives were mislabeled as wrapped by `syncGuard` (`KY`) when the
  source wraps them with the prototype-stripper `K0e` @416277 (no error-reshaping); and an invented
  `vmClone` on the live `agent()` dispatch path was removed to match `await ye(await R(...))` @417064.
- `journal.ts` — a wrong anchor `AWa @416722` corrected to `@417722`; the cache-hit deep-clone
  (`structuredClone`, `p(Ae.result)`) restored to the replay path.
- `commands_and_task.ts` — the `<task-notification>` envelope tag names corrected to the interned
  constants (`<task-id>`/`<output-file>`/`<tool-use-id>`/`<summary>`, @45659–45665).
- `constants.ts` — the agent-cap error class renamed to the source's `.name` (`WorkflowAgentCapError`, @417788).

After verification, a **cross-file reconciliation pass** (this tree's author) removed the triple-
declared caps and the two divergent error-class names: `constants.ts` is now the single source of
truth, and `runtime.ts` / `subagents.ts` / `journal.ts` import from it.

Finally, an independent **adversarial cross-validation** (15 default-to-FAIL validators, ~279 anchors
re-read directly in the live 2.1.183 bundle, including a dedicated pass over the reconciliation edits
and a read-only 2.1.88-convention audit) returned **PASS 15/15, high confidence** — **zero defects in
the v2.1.183 primary-truth anchors or the reconstructed logic**; the few corrections were all in
secondary 2.1.88 convention citations/prose. Full results: [`_cross_validation_report.md`](./_cross_validation_report.md).

---

## Related Symbols

> Symbol mappings live in the central index and the per-feature additions file (never as obf→readable
> tables in these docs). Each reconstructed `.ts` file is itself the authoritative, line-anchored
> symbol map for its slice (via its `// 2.1.183: <readable> = <obf> @<line>` comments).
>
> - [symbol_additions_v2_1_183_workflow.md](../../00_overview/symbol_additions_v2_1_183_workflow.md) — the consolidated v2.1.183 Workflow symbol table (delta symbols **plus** the full-reconstruction additions surfaced here).
> - [symbol_index_core_features.md](../../00_overview/symbol_index_core_features.md) — Workflows is the home module (Plan, Hooks, Skills, Compact, Todo, Thinking, Steering, CLI).
> - [symbol_index_core_execution.md](../../00_overview/symbol_index_core_execution.md) — the `pi`/`buildTool` factory and subagent spawn.
> - [symbol_index_infra_platform.md](../../00_overview/symbol_index_infra_platform.md) — `Vte` permission-rule lookup, settings schema, effort resolution.
> - [symbol_index_infra_integration.md](../../00_overview/symbol_index_infra_integration.md) — the `/config` UI, `/workflows` slash command, input-box highlight.

Anchor entry points (re-derived v2.1.183 names; each file is the full map):

- `isWorkflowsEnabled` (`Pw`, cli_inner_pretty.js:148784) — 4-layer master gate → `gate_and_effort.ts`.
- `matchKeyword` (`hho`, cli_inner_pretty.js:464214) / `findUltracodeKeyword` (`yho`, cli_inner_pretty.js:464261) — the keyword detector → `keyword.ts`.
- `workflowTool` (`DLp`, cli_inner_pretty.js:419420) — the tool object → `WorkflowTool.tsx`.
- `parseWorkflowMeta` (`m0`, cli_inner_pretty.js:416466) / `isNonDeterministic` (`rWa`, cli_inner_pretty.js:416439) — parse + static determinism → `meta.ts`.
- `makeWorkflowHooks` (`EWa`, cli_inner_pretty.js:416901) — the DSL/executor closure → `runtime.ts`.
- `agentContext` (`Dt`, cli_inner_pretty.js:417152) — per-agent attribution on spawn → `subagents.ts`.
- `WORKFLOW_DESCRIPTION` (`gdo`, cli_inner_pretty.js:418170) — the authoring prompt → `prompt.ts`.
- `WORKFLOW_AGENT_CAP` (`_Wa`=1000, cli_inner_pretty.js:417718) and siblings — the caps → `constants.ts`.
