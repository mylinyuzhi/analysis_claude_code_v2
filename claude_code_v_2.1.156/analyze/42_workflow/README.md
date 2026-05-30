# 42 — Dynamic Workflows (v2.1.156)

> Module: `42_workflow` — **Dynamic Workflows** (FLAGSHIP, new in 2.1.154)
> Build under analysis: Claude Code **v2.1.156**
> Source: `cli_inner_pretty.js` (single pretty-printed bundle; every citation is a verified read)

## TL;DR

**Dynamic Workflows** is Claude Code's flagship 2.1.154 feature and the headline addition in the
2.1.143 → 2.1.156 window: a single `Workflow` tool that takes a **self-contained JavaScript
orchestration script**, runs it in the background against a sandboxed VM, and fans work out across
**tens to hundreds of subagents deterministically**. The model authors the program inline (`script`),
names a saved one (`name`), or points at a file (`scriptPath`); the runtime exposes `agent()`,
`pipeline()`, `parallel()`, `phase()`, `log()`, `args`, `budget`, and `workflow()` primitives, returns
a task ID **immediately**, and notifies on completion. `/workflows` shows live and completed runs.

The whole subsystem is gated behind a four-layer enablement chain (`isWorkflowsEnabled` / `NZ`),
opted into per-turn by a `workflow(s)` keyword or per-session by `ultracode`, bounded at runtime by an
agent-call cap (1000), a token budget, a per-agent stall timeout, and a CPU-derived concurrency limit,
and made resumable by an append-only **journal** that replays the longest unchanged prefix of `agent()`
calls on `resumeFromRunId`. Because resume depends on replay, scripts must be **deterministic** —
`Date.now()`/`Math.random()`/`new Date()` are rejected.

**NEW-post-2.1.88 verdict (confidence: high, one nuance):** The runtime, gate, keyword opt-in, caps,
journal, ultracode, consent warning, and `/workflows` viewer are **all new in 2.1.154** — there is no
precursor in the readable v2.1.88 tree. The one nuance is that scaffolding existed in 2.1.88 behind the
ant-only `WORKFLOW_SCRIPTS` build feature gate (`feature('WORKFLOW_SCRIPTS') ? require(...) : null`
references in `src/tools.ts`, `src/commands.ts`, `src/tasks.ts`, `src/components/permissions/PermissionRequest.tsx`),
but the actual source files are stripped from the public tree — so 2.1.156 is the **GA of an
internal-only prototype**, not a from-scratch feature. The only `Workflow`-named file in 2.1.88,
`src/components/WorkflowMultiselectDialog.tsx`, is an unrelated **GitHub Actions installer**. The
**coordinator** prompt (`Dk5`) has a clear precursor (`src/coordinator/coordinatorMode.ts`); only its
`NZ()`-gated Workflow clause is new.

> **82209 disambiguation (important):** `orchestrationConfiguration` at cli_inner_pretty.js:82209 is
> **NOT** dynamic-workflow code. It is a field inside the AWS Bedrock Smithy schema
> `KnowledgeBaseRetrieveAndGenerateConfiguration` (namespace `com.amazonaws.bedrock`,
> cli_inner_pretty.js:82200-82211) — a keyword false-positive. Do not cite it as part of this module.

## Architecture

Dynamic Workflows is best understood as **two planes**: a *data plane* (the tool object, schemas,
script source, and the background VM that actually spawns subagents) and a *control plane* (the gate
that decides whether workflows exist, the opt-in that decides when the model may call the tool, the
caps that bound a run, the journal that resumes it, and the UI that surfaces it). The data plane lives
in [`workflow_tool_definition.md`](./workflow_tool_definition.md); the control plane lives in
[`gate_caps_lifecycle_relations.md`](./gate_caps_lifecycle_relations.md).

```
   ┌──────────────────────── CONTROL PLANE ───────────────────────────┐
   │                                                                   │
   │  ENABLEMENT     NZ() = !H48() && r$7() && KP6().available         │ per session
   │  (4 layers)            && (hL5() ?? defaultOn)                     │ (memoized in $48)
   │                              │ true                                │
   │  OPT-IN         keyword "workflow(s)" → KR_ → reminder             │ per turn
   │  (per turn)     OR ultracode on (standing) OR user ask OR skill    │
   │                              │                                     │
   │  CONSENT        r0_? → one-time usage warning → o0_ persists       │ first use
   │                              │                                     │
   └──────────────────────────────┼───────────────────────────────────┘
                                   ▼
   ┌──────────────────────── DATA PLANE ──────────────────────────────┐
   │  LLM emits Workflow tool call { script|name|scriptPath, args?,    │
   │                                 resumeFromRunId? }                 │
   │            │                                                       │
   │  isEnabled: NZ()  ── false ──▶ tool hidden from the model         │
   │            │ enabled                                              │
   │  validateInput (378238): H48→5, !NZ→6, b44→1, FZ→2, regex→4,      │
   │            │             resume-conflict→3                        │
   │  checkPermissions (378274): deny → ask(updatedInput) → allow      │
   │            │             default = ask + name-scoped allow suggest │
   │  call (378336): b44→script, FZ→meta, runId=resume ?? wf_<uuid12>, │
   │            │   BP8 compile, xFK persist, tengu_workflow_launched, │
   │            │   q44(VM) in background                              │
   │            ▼ returns immediately                                  │
   │  { status:"async_launched", taskId, runId, summary, scriptPath }  │
   │            │                                                       │
   │  RUNTIME CAPS: agent-cap F74=1000→Q74 · token budget→fW8 ·        │
   │            │   concurrency dG_=min(16,cores-2) · pipeline lG_=50 · │
   │            │   stall tG_=180s        + journal bp6 (resume)        │
   │            ▼                                                       │
   │  FLUSH: TrH(task_progress) ~16ms-batched → progress tree          │
   │            ▼                                                       │
   │  COMPLETION: tengu_workflow_completed (+ per-phase) → C74 snapshot │
   │            → <task-notification> to model; /workflows to watch     │
   └───────────────────────────────────────────────────────────────────┘
```

**Key abstractions:**

- **`meta` is the trust boundary.** The script must begin with `export const meta = {...}` as a *pure
  literal*; `parseWorkflowMeta` (`FZ`) statically evaluates it (no `eval`, no prototype-pollution keys,
  no interpolation) so the runtime can learn a workflow's name/description/phases *without executing the
  untrusted program* — everything the user sees before approving a run comes from this evaluated `meta`.
- **Fire-and-forget.** The output schema only allows `async_launched` / `remote_launched` — there is no
  `completed` status because the tool returns a task ID immediately; even a compile failure returns a
  normal result with `error` set rather than throwing.
- **Determinism enables resume.** The journal caches `agent()` results keyed on a SHA-256 of
  `(phase, prompt, canonical opts)`; resume replays the longest unchanged prefix as instant cache hits.
  This only works if the script is deterministic, hence the hard `Date.now()`/`Math.random()`/`new Date()`
  ban in `validateInput` (errorCode 4).
- **Defense in depth.** `NZ()` is checked at `isEnabled` (model sees the tool), again in `validateInput`
  (errorCode 6 if state changed), the source is resolved in both `validateInput` and `call`, and the size
  cap is enforced at the schema, the parser, and the file reader.

## Resource caps at a glance

| Cap | Symbol | Value | Purpose | Location |
|-----|--------|-------|---------|----------|
| Agent-call ceiling | `F74` (`WORKFLOW_AGENT_CAP`) → `Q74` | **1000** | Catch unbounded `agent()` loops (esp. `while(budget.remaining())` with no budget). | cli_inner_pretty.js:375678, 375740-375745 |
| Token budget | `fW8` (`WorkflowBudgetExceededError`) | turn-spend derived | Stop new `agent()` calls once output-token budget spent; in-flight agents finish. | cli_inner_pretty.js:375746-375753 |
| Concurrency | `dG_` (`computeWorkflowConcurrency`) → `cG_` | `min(16, max(2, cores-2))` | Default parallel/agent fan-out width; reserve 2 cores, cap at 16. | cli_inner_pretty.js:374930-374932 |
| Pipeline concurrency | `lG_` (`WORKFLOW_PIPELINE_DEFAULT`) | **50** | Wider default for `pipeline()` stages. | cli_inner_pretty.js:375677 |
| Per-agent stall | `tG_` (`WORKFLOW_STALL_MS_DEFAULT`) | **180000** (3 min) | Abort a single stalled agent (reason `"stalled"`), free its slot. | cli_inner_pretty.js:375699 |

## Module Structure

| Document | Purpose |
|----------|---------|
| `README.md` | This file — module index, architecture, reading order. |
| [`workflow_tool_definition.md`](./workflow_tool_definition.md) | **Data plane / tool anatomy.** The `Workflow` tool-name constant (`mx`) and `RunWorkflow` alias; the `yK` tool factory; the four-layer `isEnabled` gate (`NZ`); the lazy Zod input/output schemas (`Q0_`/`g0_`) field-by-field; the long opt-in description prompt (`Fp6`); the `meta` AST parser (`FZ` + `IZ_`/`UK4`/`pK4`/`CZ_`/`bZ_`/`xZ_`/`RZ_`) and why it uses static evaluation instead of `eval`; the six `validateInput` error codes; `resolveWorkflowSource` (`b44`) precedence (`scriptPath > name > script`); ask-by-default `checkPermissions` with name-scoped allow-suggestion; fire-and-forget script persistence (`xFK`) and UNC rejection (`Hj$`/`tm`); the `call` launch path overview; the 82209-is-Bedrock disambiguation and the NEW-post-2.1.88 verdict. |
| [`gate_caps_lifecycle_relations.md`](./gate_caps_lifecycle_relations.md) | **Control plane.** The enablement gate (`NZ`/`SL5`/`KP6`/`H48`/`r$7`/`hL5`, Pro-defaults-off rationale, the memo `$48`); the keyword opt-in (`pg6`/`Bg6` code-span masking, `KR_` reminder + `workflow_keyword_request`, the `alt+w` dismiss/restore with telemetry, `preExpansionInput` matching); first-use consent (`r0_`/`o0_`/`sF$`); the four runtime caps in depth (`F74`/`Q74`, `fW8`, `dG_`, `tG_`); the resume journal/respawn/snapshot (`bp6` JSONL, `x74` index, `m74` SHA-256 cache key, `gG_` canonical opts, longest-unchanged-prefix semantics, `C74` snapshot, the StructuredOutput nudge `gtH`); the launch→flush→completion lifecycle and telemetry (`call`, `q44` VM executor, the 16ms-batched `TrH` flush, `tengu_workflow_completed` + per-phase, save `$Q4`, `/workflows` command `Pjz` and viewer `gt4`); ultracode standing orchestration (`zP6`/`ycH`/`ar`/`or`); and the coordinator integration (`Dk5` NZ-gated Workflow clause). |

## Related Symbols

> Symbol mappings live in the central index and the per-module additions file (never as tables in the
> module docs):
> - [symbol_additions_v2_1_156_workflow.md](../00_overview/symbol_additions_v2_1_156_workflow.md) — **All v2.1.156 symbols for this module** (the comprehensive, deduplicated table — the home for these rows pending consolidation).
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (Workflows is the home module; Plan, Hooks, Skills, Compact, Todo, Thinking, Steering, CLI).
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (the `yK` tool factory and `P45` tool defaults the Workflow tool is built from).
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (`tm` UNC detector, `d6H` permission-rule lookup).
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (LSP, IDE, UI, Plugin).

Key symbols in this module (full table in the additions file):

- `WORKFLOW_TOOL_NAME` (`mx`) — the string `"Workflow"` (cli_inner_pretty.js:216291); re-exported via `workflowExports` (`m57`, cli_inner_pretty.js:216289).
- `workflowTool` (`n0_`) — the tool object built by `makeTool` (`yK`), `aliases:["RunWorkflow"]` (cli_inner_pretty.js:378217).
- `workflowInputSchema` (`Q0_`) / `workflowOutputSchema` (`g0_`) — lazy Zod schemas (cli_inner_pretty.js:378140, 378186).
- `WORKFLOW_DESCRIPTION` (`Fp6`) — the long opt-in policy + DSL reference prompt (cli_inner_pretty.js:376077).
- `parseWorkflowMeta` (`FZ`) — the `meta` AST parser + body splitter (cli_inner_pretty.js:371746).
- `isWorkflowsEnabled` (`NZ`) — the four-layer master gate (cli_inner_pretty.js:184757).
- `resolveWorkflowAvailability` (`SL5`) — `{available, defaultOn}` from env+gate+tier (cli_inner_pretty.js:184780).
- `persistWorkflowScript` (`xFK`) / `readWorkflowScriptFile` (`Hj$`) — fire-and-forget persist + UNC-rejecting read (cli_inner_pretty.js:145280, 145294).
- `WORKFLOW_SCRIPT_MAX_BYTES` (`jI`) — `524288` (512 KiB) script size cap (cli_inner_pretty.js:145308).

## Reading Order

Start with this **README.md** for the two-plane mental model. Then:

1. **[`workflow_tool_definition.md`](./workflow_tool_definition.md)** — read first. It establishes the
   tool object, the schemas, the `meta` trust boundary, the validation error codes, and the launch path.
   Everything else references the symbols defined here (`mx`, `NZ`, `FZ`, `b44`, `jI`).
2. **[`gate_caps_lifecycle_relations.md`](./gate_caps_lifecycle_relations.md)** — read second, in this
   internal order if you want the system layer-by-layer:
   - **Part 1 (Enablement gate)** — `NZ`/`SL5`; understand *whether* workflows exist before anything else.
   - **Part 2 (Keyword opt-in & consent)** — *when* the model may call the tool, and the human consent layer.
   - **Part 3 (Runtime caps)** — the four guards that bound a running script.
   - **Part 4 (Journal/respawn/snapshot)** — *resume*: the cache-key algorithm and longest-unchanged-prefix replay.
   - **Part 5 (Lifecycle/telemetry/UI)** — launch→flush→completion, the 16ms batch, and `/workflows`.
   - **Part 6 (Ultracode)** — the standing-orchestration session mode.
   - **Part 7 (Coordinator)** — the one place the two orchestration models (`Dk5` coordinator vs. scripted
     Workflow tool) cross-reference each other.

For cross-cutting context: the **task taxonomy** (the `local_workflow` task type) is documented in
`30_agent_team/` of the 2.1.142 tree; the **background-task** plumbing the launch rides on is in
`36_background_agents/`; **Opus 4.8 + effort** (which `ultracode`'s `xhigh` depends on) is in
`43_model_opus48/`.
