# Cross-Validation Report — Workflow/ultracode Readable-Source Reconstruction (v2.1.183)

> **Verdict: PASS (15/15, high confidence).** Every load-bearing behavioral claim in the 13
> reconstructed source files was independently re-verified against the live v2.1.183 obfuscated
> bundle. **Zero defects were found in the v2.1.183 primary-truth anchors or in the reconstructed
> logic.** All defects found were in *secondary documentation* (2.1.88 convention citations and a
> few prose comments) and were fixed in place. All six v2.1.88 convention claims hold.

## Method

An adversarial cross-validation workflow ran **15 independent validators**, each instructed to
**default to FAIL** and to *re-read the actual v2.1.183 bundle lines itself* rather than trust any
anchor comment in the files:

- **13 per-file validators** — one per reconstructed module. Each re-read a fixed set of *critical*
  anchors plus a sample of inline `// @line` anchors directly in
  `cli_inner_pretty.js`, compared the obfuscated source to the readable TypeScript, and hunted for
  wrong/stale anchors, invented behavior, semantic inversions, and verbatim-string drift.
- **1 hand-edit / SSOT validator** — re-verified the *post-reconstruction* cross-file refactor
  (constants.ts single-source-of-truth, the cycle-free import graph, the de-duplications, the import
  rewirings) against the bundle, since those edits were never independently checked.
- **1 read-only 2.1.88-convention validator** — confirmed each claimed convention mirror actually
  exists in the v2.1.88 named-TS tree.

**~279 distinct line anchors were independently re-read** across the run (≈836K tokens, 15 agents).

## Per-file results

| File | Anchors re-read | Verdict | Defects fixed (all secondary-doc) |
|------|:---:|:---:|---|
| `gate_and_effort.ts` | 24 | PASS (high) | 3 secondary-tree (2.1.88 `effort.ts`) line citations off by ~2 |
| `keyword.ts` | 22 | PASS (high) | `btl` external-predicate doc mischaracterized → rewritten + renamed `containsToolResult` |
| `highlight.tsx` | 19 | PASS (high) | — (cosmetic residuals only) |
| `schemas.ts` | 17 | PASS (high) | — |
| `WorkflowTool.tsx` | 21 | PASS (high) | — |
| `source.ts` | 13 | PASS (high) | header prose "falls back to home" → "originalCwd" |
| `meta.ts` | 14 | PASS (high) | "acorn named-import is a 2.1.88 convention" overstated → rewritten |
| `runtime.ts` | 22 | PASS (high) | ALS pattern misattributed to `framework.ts/runInAgentContext` → `agentContext.ts/runWithAgentContext` |
| `subagents.ts` | 22 | PASS (high) | — |
| `journal.ts` | 22 | PASS (high) | — |
| `prompt.ts` | 14 | PASS (high) | convention comment cited non-existent 2.1.88 symbols → real `getPrompt()`/`AGENT_TOOL_NAME` |
| `commands_and_task.ts` | 22 | PASS (high) | header alias `Fof resolveSaveDir` → `resolveWorkflowSaveDir` |
| `constants.ts` | 18 | PASS (high) | — |
| `_cross_file_refactor` (SSOT/hand-edits) | 15 | PASS (high) | — |
| `_2.1.88_conventions` (read-only audit) | 14 | PASS (high) | — (6/6 claims hold) |

## What was proven against source (the load-bearing confirmations)

These are the claims a skeptical reader most needs verified; each was re-read in the live bundle:

- **Gate chain** (`isWorkflowsEnabled` `Pw@148784`): the precedence ladder `Kyn()→!1`, `!aAi()→!1`,
  `{available,defaultOn}=tNr()`, `!available→!1`, `return EJu() ?? defaultOn`; and `defaultOn = sa() !== "pro"` @148817 — exact.
- **Effort** : `supportsXhighEffort` `hTe@148878` confirmed to gate to the **narrowest** set of 4
  models (fable-5/mythos-5/opus-4-8/opus-4-7); `resolveEffort` `ZQ@148967` xhigh→high clamp @148975;
  `isUltracodeOn` `nNr@148937` reads **only** `jr().ultracode` (the suspected `i6()` does **not**
  exist) and fires the `u2()` launch-effort-unpin side effect.
- **Keyword masker** `hho@464214`: the `startsWith("/")` guard, the `[[`-reset, the single-quote
  word-boundary open/close polarity (`!isWordChar(prev)` to open, `!isWordChar(next)` to close), and
  the `/ \ - ?` path/flag rejection — all re-derived char-by-char; **no polarity inversion**.
- **Runtime**: the **`K0e@416277` prototype-stripper** (sets `__proto__=null`, deletes
  `constructor`/`prototype`, **no** try/catch) is correctly distinguished from the error-reshaping
  `syncGuard` `KY@411622`; the **`agent()` live-dispatch path `@417064` returns `ye(R(...))` without
  `vmClone`** while only the cached path `@417021` deep-clones; nested `workflow()` is hard-capped at
  one level `@416628`; `budget` is frozen `@418029`; concurrency `K0p@416892 = min(16,max(2,cpus-2))`.
- **Subagents**: the `agentContext` object `Dt@417152` fields (parent-id is-root guard, `depth+1`,
  `parentSessionId`, `subagentName`, `isBuiltIn`); the per-agent `effort` merge `@417123`; the
  budget gate `T()@417090` throw site.
- **Verbatim strings**: the `workflow_keyword_request` reminder text `@590606`, the subagent system
  prompts `Q0p@417723`/`tLp@417804`, and the `WORKFLOW_DESCRIPTION` `gdo@418170` matched the bundle
  (after `\uXXXX` de-escaping). The `<task-notification>` envelope uses the interned tag constants
  `<task-id>`/`<output-file>`/`<tool-use-id>`/`<summary>` `@45659-45665`.
- **Caps & errors**: `_Wa@417718=1000`, `rLp@417739=180000`, `X0p@417717=50`, `gWa@417740=5`,
  `AWa@417722=400` (**not** the earlier mis-anchor 416722), `A2@152140=524288`; and the error-class
  `.name`s `WorkflowAgentCapError@417788` / `WorkflowBudgetExceededError@417796`.

## SSOT / hand-edit validation

The post-reconstruction refactor was independently confirmed correct:
- `constants.ts` imports **no** sibling module (true leaf); `runtime.ts`/`subagents.ts`/`journal.ts`/
  `schemas.ts`/`meta.ts`/`source.ts` import the caps/errors **from** `./constants.js` — **cycle-free**.
- Exactly **one** definition tree-wide for each de-duplicated symbol: `isNonDeterministic` (meta.ts),
  `isUltracodeKeywordTriggerEnabled` (gate_and_effort.ts), `WORKFLOW_SCRIPT_MAX_BYTES` (constants.ts),
  the caps and error classes (constants.ts). subagents.ts *re-exports* (not re-declares) some of them,
  which preserves SSOT.
- The import rewirings resolve to the correct export homes: `WorkflowInputError`←`schemas.ts`,
  `resolveNamedWorkflow`←`workflowRegistry.js`, `isNonDeterministic`←`meta.ts`, gate functions←
  `gate_and_effort.js`. **No factual error was introduced by the edits.**

## v2.1.88 convention audit — 6/6 hold

All claimed convention mirrors exist in `/lyz/codespace/3rd/claude-code/src`:
1. `Tool.ts` exports `buildTool` + the `Tool` type + `ValidationResult = {result:true}|{result:false,message,errorCode}` + `ToolUseContext`. *(Nuance: `Tool` is a `type` alias, structurally interface-shaped — claim intent correct.)*
2. `Task.ts` declares `'local_workflow'` with id-prefix `'w'` in `TASK_ID_PREFIXES`.
3. `tools.ts` gates `WorkflowTool` behind `feature('WORKFLOW_SCRIPTS')` and references `tools/WorkflowTool/{WorkflowTool,bundled/index,createWorkflowCommand}` + `commands/workflows`.
4. `tools/AgentTool/` has the one-tool-per-directory layout (`runAgent.ts`, `prompt.ts`, `constants.ts`, `builtInAgents.ts`, `forkSubagent.ts`).
5. ESM `.js` import specifiers on `.ts`; Zod v4; React/Ink `.tsx`.
6. `tasks/types.ts` imports `LocalWorkflowTaskState`.

## Residuals (disclosed, cosmetic — left as-is)

These are honest, non-behavioral nits the validators flagged and judged not worth a code change; each
is already disclosed in the relevant file's comments:
- The bundle's executor bodies (`localExecutor U@417088`, `spawnWorkflowAgent Tt@417149`,
  `remoteExecutor W@417529`) and the large VM-hardening/clone program strings (`KGe`/`vjn`) are
  reconstructed **in spirit** (behavior enumerated, internals stubbed) — the files state this openly.
- A few external-helper readable labels are approximations of the bundle name (`a4`→`currentSessionId`
  though it returns `parentSessionId`; the `runAgent` generator labeled `querySubagent`). The *field
  assignments and call shapes are faithful*; only the label differs.
- Some reconstruction-local import paths (e.g. `./lazySchema.js`, `../hooks/notifs/useNotifications.js`)
  are house-style module boundaries, not bundle facts — they carry no behavioral claim.

## Conclusion

The readable-source reconstruction of the Workflow/ultracode subsystem is **source-accurate to
v2.1.183**: every behavioral claim that was independently re-checked matches the obfuscated bundle,
and the cross-file refactor is correct and cycle-free. The only corrections needed were to secondary
2.1.88 convention citations and a handful of prose comments, all now fixed. The 2.1.88 conventions the
reconstruction borrows are real (shape-only; the feature itself is gated out of that build).

*(Cross-validation workflow `wf_8897d849-3d0`, 15 agents, 2026-06-23.)*
