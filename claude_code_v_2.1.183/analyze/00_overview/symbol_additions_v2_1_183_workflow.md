# Symbol Additions — Dynamic Workflows / ultracode (v2.1.183, the v2.1.156 → v2.1.183 DELTA)

> Consolidated obfuscated→readable symbol table for the **Dynamic Workflows** subsystem
> (the `Workflow`/`RunWorkflow` tool + the `ultracode` keyword/effort system) **as it exists
> in v2.1.183**. This is the delta-tree manifest: it records the v2.1.183 obfuscated names
> and, in the Description column, the v2.1.156 obfuscated alias (e.g. "v2.1.156 `NZ`") so every
> rename is traceable. **The v2.1.156 names DO NOT apply in v2.1.183 — the bundler re-mangles
> every build** (confirmed examples below: `NZ`→`Pw`, `mx`→`zk`, `Bg6`→`hho`, `Fp6`→`gdo`,
> `n0_`→`DLp`, `FZ`→`m0`). Every line was re-derived by reading the declaration in the
> v2.1.183 bundle.
>
> **Headline of this version (the v2.1.156 → v2.1.183 delta).** The Workflow subsystem is
> **structurally frozen** — same 4-layer gate, same VM runtime, same caps (1000 agents, 180 s
> stall, `min(16, cores−2)` concurrency), same journal/resume, same `meta` AST parser, same
> subagent prompts, same fire-and-forget launch. The deltas cluster in two places:
> 1. **The keyword-trigger UX.** The per-turn trigger keyword was renamed `workflow(s)` →
>    `ultracode` (the runtime matcher switched from `Bg6(text,"workflows?")` to
>    `hho(text,"ultracode")`); the keyword highlight got a **dedicated violet shimmer**
>    (`autoAccept`/`autoAcceptShimmer`) instead of the shared rainbow (`Xq`/v2.1.156 `fI`); and a
>    **new `/config` setting** `workflowKeywordTriggerEnabled` (reader `Jyn`, default ON) now
>    gates **both** the model-facing reminder and the input highlight. The "ignored" toast text
>    became "Ultracode keyword ignored". Telemetry event names (`tengu_workflow_keyword`,
>    `..._dismissed`, `..._restored`) and the reminder *type* string (`workflow_keyword_request`)
>    are **unchanged** — the tell that this is a user-facing rename, not a re-architecture.
> 2. **Tool-definition / runtime correctness fixes.** The determinism check was rewritten from a
>    raw regex to an AST walk (`rWa`, the 2.1.172 fix); a new `errorCode 7` server-fallback
>    retraction (`r5a`/`zCe`) was added to `validateInput`; the output schema gained two optional
>    fields (`taskType`, `workflowName`); a per-agent `effort` opt was added to the `agent()`
>    DSL; subagent spawn now carries a per-agent attribution context (`agentContext: Dt`, the
>    2.1.174 fix) and threads `worktreePath` (the 2.1.161 bg-worktree edit fix); and `/workflows`
>    opens immediately (`immediate:!0`, the 2.1.169 fix).
>
> **Two framing traps** (changelog items that are NOT 156→183 source deltas): (a) the "/effort
> `ultracode` only on xhigh-capable models" gate (`T4`=`Pw() && (e===void 0 || hTe(e))`) already
> shipped in v2.1.156 as `Vx`=`NZ() && (H===void 0 || ycH(H))`; and (b) the 2.1.178 "triggers
> only on explicit phrases" line is a model-facing *description/policy* edit inside `gdo`, **not**
> a new runtime regex — there is no runtime detector for "run a workflow"/"workflow:".

## Home index

These rows fold into:
- **`00_overview/symbol_index_core_features.md`, "## Module: Workflow"** — the primary home for
  almost every row: the enablement-gate family (`Pw`/`Kyn`/`aAi`/`tNr`/`HJu`/`EJu`/`eNr`), the
  **new** keyword-trigger setting (`Jyn`), the keyword matchers (`hho`/`yho`/`Qel`/`zWn`/`Xel`/
  `Yel`), the reminder maker (`o4p`/`s4p`), the tool object and schemas (`DLp`/`CLp`/`ILp`/`Vjn`/
  `r5a`), the description (`gdo`/`aLp`), the source/parse/determinism spine (`n5a`/`m0`/`rWa`/
  `r0t`/`jjt`), the caps (`A2`/`_Wa`/`rLp`/`X0p`/`gWa`/`K0p`), the subagent prompts/defs (`Q0p`/
  `tLp`/`ddo`/`nLp`), the per-agent attribution context (`Dt`), the save/slash/viewer
  (`oHl`/`jmf`/`Gmf`), and the keyword UI memo/toast (`ji`/`el`).
- **`00_overview/symbol_index_core_execution.md`** — for the subagent/tool-execution symbols the
  Workflow tool and its spawn path *share* with the broader runtime: the tool factory `pi`, the
  StructuredOutput tool name `Em`, the subagent query `wj`, the agent-context `AsyncLocalStorage`
  run wrapper `Rq`/store `pwt`, the context-field helpers (`jz`/`Gz`/`a4`/`ay`), the attribution
  builder `vXu` and subagent-name resolver `M2s`, the `TaskStop` name `uP`, and the Acorn modules
  `xjn`/`ido`. These are generic execution plumbing the Workflow tool consumes, not
  workflow-specific; their canonical home is the execution index (duplicated here as a reading aid
  for the workflow docs).
- **`00_overview/symbol_index_infra_platform.md`** — `Vte` (`lookupPermissionRules`, Permissions),
  `zCe`/`uMt`/`Hqr` (the server-fallback abort-classification helpers), `rB`/`hTe`/`ZQ`/`eZ`/`T4`
  (effort normalizer + the `/effort ultracode` xhigh gates), and the settings-schema field.
- **`00_overview/symbol_index_infra_integration.md`** — the input-box highlight UI (`Xq` rainbow
  cycler, `FZu` color tokens), the `/config` toggle row, and the `/workflows` slash command/viewer.

The full deep-analysis prose lives in `42_workflow/` —
[`README.md`](../42_workflow/README.md),
[`ultracode_keyword_trigger_delta.md`](../42_workflow/ultracode_keyword_trigger_delta.md),
[`tool_definition_fixes_delta.md`](../42_workflow/tool_definition_fixes_delta.md),
[`runtime_fixes_delta.md`](../42_workflow/runtime_fixes_delta.md).
This file is the flat symbol manifest; the four module docs use list-format references back to it.

## Cross-validated against

- **v2.1.183 bundle self-cross-check.** Every row's `File:Line` was read directly from
  `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
  during this pass — not inferred from the module docs. The full anchor set was re-read
  line-for-line and all matched: the gate family (`Pw`@148784, `Kyn`@148777, `aAi`@148800,
  `tNr`/`HJu`@148806/148810, `EJu`@148803, `eNr`@148791, **new** `Jyn`@148797); the keyword
  matchers (`hho`@464214, `yho`@464261, `Qel`@464267, `zWn`@464255, `Xel`@464258, `Yel`@464280);
  the reminder (`o4p`@464869); the tool object/schemas (`DLp`@419420, `CLp`@419334, `ILp`@419372,
  `Vjn`@419409, **new** `r5a`@419415); the description (`gdo`@418170, `aLp`@418164, `y1i`/`zk`@221549/
  221550); the spine (`n5a`@419272, `m0`@416466, **new** `rWa`@416439, `Vte`@585562); the caps
  (`A2`@152140, `_Wa`@417718, `rLp`@417739, `X0p`@417717, `gWa`@417740, `K0p`@416892); the prompts/
  defs (`Q0p`@417723, `tLp`@417804, `ddo`@417811, `nLp`@417820, `Em`@221489); the effort gates
  (`rB`@148923, `hTe`@148878, `T4`@148898, `eZ`@148901, `ZQ`@148967, `nNr`@148937); the runtime-fix
  symbols (`Tt`@417149, **new** `Dt`@417152, `Rq`@103143, `jz`@103149, `Gz`@103152, `a4`@103436,
  `ay`@472399, `vXu`@145447, `M2s`@103159, `Xct`@389676, `wpe`@46250, `zCe`@227026); the UI
  (`ji`@622226, `el`@622362, `Xq`@134367, `FZu`@154110); and the save/slash (`oHl`@530752,
  `jmf`/`Gmf`@562632). All verified.
- **v2.1.156 before-picture.** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
  (649,979 lines) — the v2.1.156 obfuscated aliases recorded in the Description column come from the
  v2.1.156 baseline `symbol_additions_v2_1_156_workflow.md` and the baseline `42_workflow/` docs.
  Confirmed re-mangling: `NZ`→`Pw`, `mx`→`zk`, `m57`→`y1i`, `H48`→`Kyn`, `r$7`→`aAi`, `KP6`→`tNr`,
  `SL5`→`HJu`, `hL5`→`EJu`, `qP6`→`eNr`, `Bg6`→`hho`, `pg6`→`yho`, `lj4`→`Qel`, `OG8`→`zWn`,
  `dj4`→`Xel`, `gj4`→`Yel`, `KR_`→`o4p`, `_R_`→`s4p`, `Fp6`→`gdo`, `q0_`→`aLp`, `n0_`→`DLp`,
  `Q0_`→`CLp`, `g0_`→`ILp`, `b44`→`n5a`, `FZ`→`m0`, `Hj$`→`r0t`, `AT$`→`jjt`, `d6H`→`Vte`,
  `jI`→`A2`, `F74`→`_Wa`, `Q74`→`bWa`, `fW8`→`SWa`, `dG_`→`K0p`, `tG_`→`rLp`, `lG_`→`X0p`,
  `p74`→`gWa`, `iG_`→`Q0p`, `aG_`→`tLp`, `mp6`→`ddo`, `sG_`→`nLp`, `iY`→`Em`, `zP6`→`nNr`,
  `ycH`→`hTe`, `ar`→`eZ`, `or`→`ZQ`, `Vx`→`T4`, `$Q4`→`oHl`, `UJ`→`el`, `o1`→`ji`, `fI`→`Xq`,
  `Pjz`/`Wjz`→`jmf`/`Gmf`. **New in v2.1.183 (no v2.1.156 ancestor):** `Jyn`, `r5a`, `Dt`, plus the
  `worktreePath` query field, the `taskType`/`workflowName` schema fields, and the `effort` opt.
- **v2.1.88 named TypeScript** (`/lyz/codespace/3rd/claude-code/src/`) — no Workflow runtime/gate
  precursor exists; the subsystem GA'd in 2.1.154 (NEW-post-2.1.88). The only `Workflow`-named
  source file, `src/components/WorkflowMultiselectDialog.tsx`, is an unrelated GitHub-Actions
  installer. The NEW-post-2.1.88 verdict is carried from the v2.1.156 baseline — not re-derived.

---

## Module: Workflow — Enablement gate (control plane)

The 4-layer enablement gate. Logic is **identical** to v2.1.156's `NZ` chain (env
`CLAUDE_CODE_WORKFLOWS`/`CLAUDE_CODE_DISABLE_WORKFLOWS`, gate `tengu_workflows_enabled`, policy
`allow_workflows`, settings `enableWorkflows`/`disableWorkflows`, `defaultOn = tier!=="pro"`); only
the obfuscated names changed. The one genuinely new member is `Jyn`.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Pw` | `isWorkflowsEnabled` | cli_inner_pretty.js:148784 | function | 4-layer master gate: `!Kyn() && aAi() && tNr().available && (EJu() ?? defaultOn)`. v2.1.156 `NZ`. |
| `Kyn` | `isWorkflowsManagedDisabled` | cli_inner_pretty.js:148777 | function | `st(env.CLAUDE_CODE_DISABLE_WORKFLOWS) \|\| settings.disableWorkflows === true`. v2.1.156 `H48`. |
| `aAi` | `isWorkflowsPolicyAllowed` | cli_inner_pretty.js:148800 | function | `di("allow_workflows")` Statsig/managed capability gate. v2.1.156 `r$7`. |
| `tNr` | `resolveWorkflowAvailabilityCached` | cli_inner_pretty.js:148806 | function | Memoizes `HJu()` into module-level `Yyn`. v2.1.156 `KP6` (into `$48`). |
| `HJu` | `resolveWorkflowAvailability` | cli_inner_pretty.js:148810 | function | `{available, defaultOn: sa()!=="pro"}` from env + `tengu_workflows_enabled` gate + tier. v2.1.156 `SL5`. |
| `EJu` | `getUserWorkflowSetting` | cli_inner_pretty.js:148803 | function | `mk()?.settings.enableWorkflows` — overrides the tier default. v2.1.156 `hL5`. |
| `eNr` | `getWorkflowDefaultOn` | cli_inner_pretty.js:148791 | function | `tNr().defaultOn`. v2.1.156 `qP6`. |
| `Jyn` | `isUltracodeKeywordTriggerEnabled` (canonical; the setting it reads is named `workflowKeywordTriggerEnabled`) | cli_inner_pretty.js:148797 | function | **NEW.** `mk()?.settings.workflowKeywordTriggerEnabled ?? true` (default ON). Gates the keyword reminder (464668) + the input highlight (622226). No v2.1.156 ancestor (`grep -c` = 0 in v2.1.156). |

---

## Module: Workflow — Keyword trigger (detector + reminder + setting + UI)

The per-turn `ultracode` keyword opt-in. The masking matcher `hho` is **byte-identical** to
v2.1.156 `Bg6`; only the literal keyword (`"workflows?"` → `"ultracode"`) and the human-facing
surfaces changed.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `hho` | `matchKeyword` | cli_inner_pretty.js:464214 | function | Generic code-span-masking keyword matcher (masks backtick/quote/`<>`/`{}`/`[]`/`()`/`'` spans, drops path-glued hits). Byte-identical to v2.1.156 `Bg6`. |
| `yho` | `findUltracodeKeyword` | cli_inner_pretty.js:464261 | function | `matchKeyword(text, "ultracode")`. v2.1.156 `pg6 = Bg6(…,"workflows?")`. |
| `Qel` | `hasUltracodeKeyword` | cli_inner_pretty.js:464267 | function | `findUltracodeKeyword(text).length > 0`. v2.1.156 `lj4`. |
| `zWn` | `findUltraplanKeyword` | cli_inner_pretty.js:464255 | function | `matchKeyword(text, "ultraplan")` (sibling; unchanged behavior). v2.1.156 `OG8`. |
| `Xel` | `findUltrareviewKeyword` | cli_inner_pretty.js:464258 | function | `matchKeyword(text, "ultrareview")` (sibling; unchanged behavior). v2.1.156 `dj4`. |
| `Yel` | `KEYWORD_DELIMITER_MAP` | cli_inner_pretty.js:464280 | object | `` {"`":"`",'"':'"',"<":">","{":"}","[":"]","(":")","'":"'"} `` masking delimiter map (unchanged). v2.1.156 `gj4`. |
| `o4p` | `makeWorkflowKeywordReminder` | cli_inner_pretty.js:464869 | function | `G("tengu_workflow_keyword",{})` + `[{type:"workflow_keyword_request"}]`; event name + reminder type UNCHANGED. v2.1.156 `KR_`. |
| `s4p` | `makeStandingUltracodeReminder` / `ultraEffortEnter` | cli_inner_pretty.js:464873 | function | Standing-ultracode `ultra_effort_enter` reminder injector. v2.1.156 `_R_`. |
| `ji` | `ultracodeSpans` (keyword-highlight memo) | cli_inner_pretty.js:622226 | variable | `useMemo(() => Pw() && Jyn() ? yho(inputText) : [], [inputText])`. v2.1.156 `o1` (was `NZ() ? pg6(r1) : []`, **no `Jyn()` gate**). |
| `el` | `toggleKeywordIgnored` | cli_inner_pretty.js:622362 | function | `alt+w` dismiss/restore; emits `tengu_workflow_keyword_dismissed`/`_restored`; **ignored toast text now "Ultracode keyword ignored"** (was "Workflow keyword ignored"). v2.1.156 `UJ`. |
| `Xq` | `rainbowColor` (per-offset cycler) | cli_inner_pretty.js:134367 | function | Per-offset rainbow shimmer cycler; **still used by ultraplan**, but ultracode no longer uses it. Byte-identical to v2.1.156 `fI`. |
| `FZu` | `themeColorTokens` (palette; `autoAccept`/`autoAcceptShimmer`) | cli_inner_pretty.js:154110 | object | `autoAccept = "rgb(135,0,255)"` (violet), `autoAcceptShimmer = "rgb(208,180,255)"` — the **dedicated ultracode keyword shimmer** (replaced the rainbow). Token names are shared with auto-accept mode. |

> The `workflow_keyword_request` reminder *renderer* lives at cli_inner_pretty.js:590606 (renderer
> map, not a named top-level symbol): `'The user included the keyword "ultracode", opting this turn
> into multi-agent orchestration — use the Workflow tool to fulfill the request.'` (v2.1.156
> @446735: `'The user included the keyword "workflow" or "workflows", which means you should use
> the Workflow tool…'`). The `/config` toggle row "Ultracode keyword trigger" is the inline object
> at cli_inner_pretty.js:479214 (`id:"workflowKeywordTriggerEnabled"`, writes
> `userSettings.workflowKeywordTriggerEnabled`, telemetry `ultracodeKeywordTrigger:"on"/"off"`),
> and the settings-schema field is the inline `H.boolean().optional().describe(…)` at
> cli_inner_pretty.js:56007 — neither is a named symbol.

---

## Module: Workflow — Tool object, schemas, description

The tool object and its lazy Zod schemas. The factory wrapper, `isEnabled` gate, input schema
fields, `checkPermissions`, and `call` launch spine are **unchanged logic** from v2.1.156; the
deltas are the new `r5a` (errorCode 7) and the two new output-schema fields.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `zk` | `WORKFLOW_TOOL_NAME` | cli_inner_pretty.js:221550 | constant | `"Workflow"`. v2.1.156 `mx`. |
| `y1i` | `workflowExports` | cli_inner_pretty.js:221549 | object | Namespace exposing the lazy `WORKFLOW_TOOL_NAME`/`CODE_REVIEW_WORKFLOW_NAME` getters. v2.1.156 `m57`. |
| `DLp` | `workflowTool` | cli_inner_pretty.js:419420 | object | The tool object built by `pi({name:zk, aliases:["RunWorkflow"], …})`; `validateInput` gained errorCode 7, output schema gained 2 fields. v2.1.156 `n0_` (built by `yK`). |
| `CLp` | `workflowInputSchema` | cli_inner_pretty.js:419334 | variable | Lazy Zod `strictObject` (`script`/`name`/`scriptPath`/`args`/`resumeFromRunId`/…).refine. Fields unchanged. v2.1.156 `Q0_`. |
| `ILp` | `workflowOutputSchema` | cli_inner_pretty.js:419372 | variable | Lazy Zod `object`; **NEW `taskType: enum(["local_workflow","remote_agent"]).optional()` + `workflowName: string().optional()`**; `warning` describe text "remote"→"cloud". v2.1.156 `g0_`. |
| `Vjn` | `WorkflowInputError` | cli_inner_pretty.js:419409 | class | `Error` subclass thrown by `call` on source/parse failure. v2.1.156 alias not separately tracked. |
| `r5a` | `serverFallbackRetraction` | cli_inner_pretty.js:419415 | variable | **NEW.** `{result:false, message:"Tool dispatch was retracted by a server fallback; the input may be truncated.", errorCode:7}` — returned by `validateInput` pre-check (419442) + mid-check (419457). No v2.1.156 ancestor on Workflow (errorCode 7 existed for other tools). |
| `gdo` | `WORKFLOW_DESCRIPTION` | cli_inner_pretty.js:418170 | variable | The long opt-in policy + scripting-DSL reference prompt. Edits: opt-in keyword "ultracode", "use a workflow" added to own-words list, `agent()` signature gained `effort?`. v2.1.156 `Fp6`. |
| `aLp` | `WORKFLOW_ISOLATION_DESC` | cli_inner_pretty.js:418164 | constant | `"'worktree'"` — the only `isolation` value advertised in the `agent()` signature (interpolated into `gdo`). v2.1.156 `q0_`. |

---

## Module: Workflow — Source resolution, parsing, determinism, permissions

The source-resolution precedence ladder, `meta` parser, determinism check, and permission-rule
lookup. `n5a`/`m0`/`r0t`/`jjt`/`Vte` are **unchanged logic** from v2.1.156; `rWa` is the new
AST-walk determinism check (the 2.1.172 fix).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `n5a` | `resolveWorkflowSource` | cli_inner_pretty.js:419272 | function | `scriptPath` > `name` > inline `script` precedence ladder → `{script, resolvedScriptPath?/source?}` or `{error}`. v2.1.156 `b44`. |
| `m0` | `parseWorkflowMeta` | cli_inner_pretty.js:416466 | function | Acorn parse as ES-module; first statement must be `export const meta = <literal>`; pure-literal eval; prototype-pollution key ban; body split. v2.1.156 `FZ`. |
| `rWa` | `isNonDeterministic` (canonical; alias `scriptUsesNonDeterminism`) | cli_inner_pretty.js:416439 | function | **NEW IMPL (2.1.172).** Acorn + `acorn-walk` over `MemberExpression` (`Date.now`/`Math.random`) + `NewExpression` (argless `new Date()`). Replaced the v2.1.156 inline regex (`@378256` before-picture) that false-positived on strings/comments. |
| `r0t` | `readWorkflowScriptFile` | cli_inner_pretty.js:419492 (callsite) | function | UNC-reject + cwd-resolve + `A2 + 1` bounded read. v2.1.156 `Hj$`. |
| `jjt` | `resolveNamedWorkflow` | cli_inner_pretty.js:419495 (callsite) | function | Registry lookup of a saved/named workflow by name. v2.1.156 `AT$`. |
| `Vte` | `lookupPermissionRules` | cli_inner_pretty.js:585562 | function | Collect allow/deny/ask rules for a tool into `Map<ruleContent, rule>`; Workflow uses `Vte(n, zk, c).get(name)`. v2.1.156 `d6H`. |
| `xjn` | `getAcorn` | cli_inner_pretty.js:411725 | function | The Acorn parser module backing both `m0` and `rWa`. |
| `ido` | `getAcornWalk` | cli_inner_pretty.js:415881 | function | The `acorn-walk` module (`e.acorn.walk`) backing `rWa`'s `walk.simple`. |

---

## Module: Workflow — Caps and runtime constants (unchanged)

All caps are **identical to the bit** vs v2.1.156; only names re-mangled.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `A2` | `WORKFLOW_SCRIPT_MAX_BYTES` | cli_inner_pretty.js:152140 | constant | `524288` = 512 KiB script-size cap. v2.1.156 `jI`. |
| `_Wa` | `WORKFLOW_AGENT_CAP` | cli_inner_pretty.js:417718 | constant | `1000` agent-call ceiling. v2.1.156 `F74`. |
| `rLp` | `WORKFLOW_STALL_MS_DEFAULT` | cli_inner_pretty.js:417739 | constant | `180000` = 3 min per-agent stall timeout. v2.1.156 `tG_`. |
| `X0p` | `WORKFLOW_REMOTE_DEFAULT` | cli_inner_pretty.js:417717 | constant | `50` — semaphore width for the remote executor (remote isolation disabled in this build). v2.1.156 `lG_`. |
| `gWa` | `MAX_STALL_RETRIES` | cli_inner_pretty.js:417740 | constant | `5` — per-agent stall retry ceiling. v2.1.156 `p74`. |
| `K0p` | `computeWorkflowConcurrency` | cli_inner_pretty.js:416892 | function | `min(16, max(2, cores-2))`. v2.1.156 `dG_`. |

> Also unchanged and confirmed: preview truncation `AWa = 400` (cli_inner_pretty.js:417722), agent
> cap error `bWa` (`WorkflowAgentCapError`, cli_inner_pretty.js:417785; v2.1.156 `Q74`), budget
> error `SWa` (`WorkflowBudgetExceededError`, cli_inner_pretty.js:417791; v2.1.156 `fW8`). These
> are carryover; not separately re-derived here beyond the location.

---

## Module: Workflow — Subagent prompts and defs (unchanged text)

The workflow-subagent system prompts and their agent defs. Prompt **text is unchanged** from
v2.1.156; only names re-mangled.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Q0p` | `WORKFLOW_SUBAGENT_PROMPT` (plain) | cli_inner_pretty.js:417723 | variable | "You are a subagent spawned by a workflow orchestration script…final text response is returned verbatim…not a message to a human." v2.1.156 `iG_`. |
| `tLp` | `WORKFLOW_STRUCTURED_PROMPT` | cli_inner_pretty.js:417804 | variable | StructuredOutput-forcing subagent prompt ("…you MUST call the StructuredOutput tool exactly once…"). v2.1.156 `aG_`. |
| `ddo` | `WORKFLOW_SUBAGENT_DEF` (plain) | cli_inner_pretty.js:417811 | object | `agentType:"workflow-subagent"`, `disallowedTools:[KO,vs,zk]`, `getSystemPrompt:()=>Q0p`. v2.1.156 `mp6`. |
| `nLp` | `WORKFLOW_STRUCTURED_DEF` | cli_inner_pretty.js:417820 | object | `{...ddo, getSystemPrompt:()=>tLp}`. v2.1.156 `sG_`. |
| `Em` | `STRUCTURED_OUTPUT_TOOL_NAME` | cli_inner_pretty.js:221489 | constant | `"StructuredOutput"`. v2.1.156 `iY`. |

---

## Module: Workflow — Effort / ultracode system (xhigh gating)

The workflow-facing slice of the effort system. **Framing trap:** the `/effort ultracode`
xhigh-gating (`T4`) already shipped in v2.1.156 as `Vx` — NOT a 156→183 delta. The genuine delta
here is that `rB` (the effort normalizer) is now read by the **new per-agent `effort` opt** in the
`agent()` DSL. Canonical home: the **Effort** section of `symbol_index_core_features.md` / platform
infra; listed here as the workflow control-plane slice.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `rB` | `parseEffort` / `normalizeEffort` | cli_inner_pretty.js:148923 | function | Effort normalizer (alias map + valid-level check + numeric); returns `undefined` for unknown. **NEW use:** read by `agent()`'s per-call `effort` opt at cli_inner_pretty.js:417123 (`le = rB(re?.effort)`). |
| `hTe` | `supportsXhighEffort` | cli_inner_pretty.js:148878 | function | xhigh-capable model check (fable-5/mythos-5/opus-4-8/4-7). v2.1.156 `ycH`. |
| `T4` | `isUltracodeOption` (xhigh+wf gate) | cli_inner_pretty.js:148898 | function | `Pw() && (e === void 0 \|\| hTe(e))` — gates the `/effort ultracode` option. **FRAMING TRAP — pre-existing as v2.1.156 `Vx` = `NZ() && (H===void 0 \|\| ycH(H))`.** |
| `eZ` | `isWorkflowKeywordOrUltracodeEffort` | cli_inner_pretty.js:148901 | function | `n === true && Pw() && ZQ(e,t) === "xhigh"`. v2.1.156 `ar`. |
| `ZQ` | `resolveEffort` (xhigh downgrade) | cli_inner_pretty.js:148967 | function | Resolves effort; downgrades `"xhigh"`→`"high"` on non-xhigh models. v2.1.156 `or`. |
| `nNr` | `isUltracodeOn` (unpins launch effort) | cli_inner_pretty.js:148937 | function | `jr().ultracode === true; if(t) u2(); return t` — releases the launch latch. v2.1.156 `zP6`. |

---

## Module: Workflow — Runtime spawn / attribution fixes (core execution)

The per-agent spawn closure and the attribution/worktree fixes. The spawn loop, VM/DSL, caps,
journal, and the write-isolation **guard** are **unchanged**; the fixes are two added query fields
(`agentContext`, `worktreePath`) and the ALS-enrollment of the workflow spawn. The attribution
consumers (`vXu`/`M2s`) and the guard (`Xct`) are pre-existing and unchanged — their canonical home
is `symbol_index_core_execution.md` / `symbol_index_infra_platform.md`.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Tt` | `spawnWorkflowAgent` | cli_inner_pretty.js:417149 | function | Per-agent workflow spawn closure; R1+R2 both edit its `wj({…})` query call. v2.1.156 ancestor `tH` (@375171). |
| `Dt` | `agentContext` (per-agent attribution) | cli_inner_pretty.js:417152 | object | **NEW (2.1.174).** `{agentId, parentAgentId, depth, parentSessionId, agentType:"subagent", subagentName, isBuiltIn}`; passed as `override.agentContext` (417250) + via `Rq(Dt,…)` ALS wrapper (417238). v2.1.156 passed only `override:{agentId}`. |
| `Rq` | `runInAgentContext` | cli_inner_pretty.js:103143 | function | `pwt.run(ctx, fn)` agent-context `AsyncLocalStorage` run wrapper; the workflow spawn is **newly enrolled** (417238). v2.1.156 ancestor `Lg` (@98977, never wired to the workflow path). |
| `jz` | `isRootContext` | cli_inner_pretty.js:103149 | function | `e.agentType === "main"` — the is-root guard for `parentAgentId`. |
| `Gz` | `contextDepth` | cli_inner_pretty.js:103152 | function | `0` for main, else `e.depth ?? 0` — feeds `depth: Gz(ue)+1`. |
| `a4` | `currentSessionId` | cli_inner_pretty.js:103436 | function | The current session id, stored in `agentContext.parentSessionId`. |
| `ay` | `isBuiltInAgentDef` | cli_inner_pretty.js:472399 | function | Built-in subagent predicate; feeds `agentContext.isBuiltIn`. |
| `vXu` | `getAgentAttribution` | cli_inner_pretty.js:145447 | function | Reads `pwt.getStore()` → builds `{agentId, parentAgentId, parentSessionId, agentType}` for headers/telemetry (UNCHANGED; v2.1.156 `X75` @139990). Now populated for workflow subagents. |
| `M2s` | `resolveSubagentNameForTelemetry` | cli_inner_pretty.js:103159 | function | `isBuiltIn ? subagentName : "user-defined"`; used by the PostToolUse memory hook `hFp` (@449494) (UNCHANGED; v2.1.156 `e3K` @99006). |
| `Xct` | `checkWorktreeWriteIsolation` | cli_inner_pretty.js:389676 | function | Write-isolation guard; the agent-level branch (`if (t.agentWorktree)…`) was **unchanged** but now reachable for workflow subagents (the 2.1.161 fix populates `agentWorktree`). v2.1.156 @346662. |
| `wpe` | `worktreeCwdRetryWrapper` | cli_inner_pretty.js:46250 | function | `e7c(e ?? Pt(), t)` cwd-scoped retry wrapper (UNCHANGED; v2.1.156 ancestor `x7H` @42224); unrelated to the permission fix — sets cwd only. |
| `zCe` | `isRetractedByServerFallback` | cli_inner_pretty.js:227026 | function | `signal.aborted && uMt(signal.reason) === Hqr` — the errorCode-7 abort-reason predicate. `uMt` (@227020) unwraps the abort reason; `Hqr` is the server-fallback sentinel. |
| `uP` | `TaskStop` (tool name) | cli_inner_pretty.js:220834 | constant | `"TaskStop"`; interpolated into the errorCode-3 resume-conflict message. |

> The subagent query `wj` (destructured `worktreePath` @387088, sets `agentWorktree` @387267,
> records metadata @387312) is a generic execution symbol; its canonical home is
> `symbol_index_core_execution.md`. The new `worktreePath: Ce` query field (cli_inner_pretty.js:417253)
> and `override.agentContext` field (417250) are the only two 156→183 changes to that query call.

---

## Module: Workflow — Save / slash command / viewer

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `oHl` | `saveWorkflow` | cli_inner_pretty.js:530752 | function | Persist a named workflow (refuse-clobber-unless-overwrite); emits `tengu_workflow_saved`. v2.1.156 `$Q4`. |
| `jmf` / `Gmf` | `workflowsCommand` | cli_inner_pretty.js:562632 | object | `/workflows` local-jsx slash command: **NEW `immediate:!0` (2.1.169)** + reworded description "Browse running and completed workflows"; `isEnabled:()=>Pw()`. v2.1.156 `Pjz`/`Wjz` (no `immediate`; "Browse dynamic workflow history (running and completed)"). |

---

## Notes on home-index placement

When these rows are merged into the central index, split them as follows (single source of truth):

- **`symbol_index_core_features.md` (Module: Workflow)** — all gate/keyword/tool/schema/source/
  parser/caps/prompt/save rows: `Pw`, `Kyn`, `aAi`, `tNr`, `HJu`, `EJu`, `eNr`, **`Jyn`**, `hho`,
  `yho`, `Qel`, `zWn`, `Xel`, `Yel`, `o4p`, `s4p`, `ji`, `el`, `zk`, `y1i`, `DLp`, `CLp`, `ILp`,
  `Vjn`, **`r5a`**, `gdo`, `aLp`, `n5a`, `m0`, **`rWa`**, `r0t`, `jjt`, `A2`, `_Wa`, `rLp`, `X0p`,
  `gWa`, `K0p`, `Q0p`, `tLp`, `ddo`, `nLp`, **`Dt`**, `oHl`, `jmf`/`Gmf`, `nNr`.
- **`symbol_index_core_execution.md` (Tools / Subagent / State)** — `pi` (tool factory), `Em`
  (`STRUCTURED_OUTPUT_TOOL_NAME`), `wj` (subagent query), `Rq`/`pwt` (agent-context ALS),
  `jz`/`Gz`/`a4`/`ay` (context helpers), `vXu` (attribution builder), `M2s` (subagent-name
  resolver), `uP` (`TaskStop`), `xjn`/`ido` (Acorn modules). Generic execution plumbing the
  Workflow tool consumes.
- **`symbol_index_infra_platform.md`** — `Vte` (`lookupPermissionRules`, Permissions), `zCe`/`uMt`/
  `Hqr` (server-fallback abort classification), `rB`/`hTe`/`T4`/`eZ`/`ZQ` (effort normalizer +
  `/effort ultracode` xhigh gates), `Xct` (write-isolation guard), the settings-schema field.
- **`symbol_index_infra_integration.md`** — `Xq` (rainbow cycler) + `FZu` (color tokens) for the
  input-box highlight, the `/config` toggle row, the `/workflows` slash command/viewer (`jmf`/`Gmf`).

> **Status.** This combined additions file (gate + keyword UX + tool object + source/parse +
> caps + prompts + effort + runtime fixes + save/UI) is the comprehensive, deduplicated table the
> `42_workflow/` v2.1.183 delta module docs reference via list-format `Related Symbols` sections.
> Every `File:Line` was verified by reading the v2.1.183 bundle declaration during this pass.
